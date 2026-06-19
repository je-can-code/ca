import { readFileSync, writeFileSync } from 'fs';

const configPath = '/mnt/exdrive/dev/gaming/ca/chef-adventure/data/config.sdp.json';
const outPath = '/mnt/exdrive/dev/gaming/ca/docs/sdp/data-sheet.md';

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { sdps, subgroups, families } = config;

const sdpBySubgroup = {};
for (const sdp of sdps) {
  const sgKey = sdp.mastery?.subgroupKey;
  if (!sgKey || sdp.key.startsWith('SIN_') || sdp.key.startsWith('TUT')) continue;
  if (!sdpBySubgroup[sgKey]) sdpBySubgroup[sgKey] = [];
  sdpBySubgroup[sgKey].push(sdp);
}

for (const key of Object.keys(sdpBySubgroup)) {
  sdpBySubgroup[key].sort((a, b) => a.mastery.subgroupTier - b.mastery.subgroupTier);
}

// Params where DOWN is the good direction (negative total = bonus)
const goodDirectionDown = new Set(['pdr', 'mdr', 'fdr', 'mcr', 'tcr']);

// Band classification
// For bonus (good direction): positive = bonus band, negative = penalty band
// For inverted (goodDirectionDown): negative = bonus band, positive = penalty band
function classifyBand(key, total, isFlat) {
  const bonusVal = goodDirectionDown.has(key) ? -total : total;

  const mag = Math.abs(bonusVal);
  if (bonusVal >= 0) {
    if (mag >= 170) return '⬆️ Extreme';
    if (mag >= 120) return '⬆️ Very High';
    if (mag >= 80)  return '⬆️ High';
    if (mag >= 40)  return '⬆️ Moderate';
    if (mag >= 15)  return '⬆️ Gentle';
    if (mag >= 5)   return '⬆️ Weak';
    if (mag > 0)    return '⬆️ Trace';
    return '—';
  } else {
    if (mag >= 70) return '🔽 Brutal';
    if (mag >= 50) return '🔽 Painful';
    if (mag >= 35) return '🔽 Bad';
    if (mag >= 20) return '🔽 Middling';
    if (mag >= 8)  return '🔽 Not Good';
    if (mag > 0)   return '🔽 Itchy';
    return '—';
  }
}

function formatValue(value, isFlat) {
  const r = Math.round(value * 100) / 100;
  if (isFlat) {
    return (r >= 0 ? '+' : '') + r;
  } else {
    return (r >= 0 ? '+' : '') + r + '%';
  }
}

function analyzeSubgroup(sgKey, panels) {
  const panelCount = panels.length;

  const rankWarnings = [];
  for (const panel of panels) {
    const tier = panel.mastery.subgroupTier;
    const expected = tier === 10 ? 20 : 10;
    const actual = panel.progression.maxRank;
    if (actual !== expected) {
      rankWarnings.push(`  ⚠️ ${panel.key} tier ${tier}: maxRank=${actual}, expected ${expected}`);
    }
  }

  const paramData = {};
  for (const panel of panels) {
    const tier = panel.mastery.subgroupTier;
    const maxRank = tier === 10 ? 20 : 10;
    for (const pp of (panel.panelParameters || [])) {
      const k = pp.parameterKey;
      if (!paramData[k]) paramData[k] = [];
      paramData[k].push({ tier, perRank: pp.perRank, isFlat: pp.isFlat, maxRank });
    }
  }

  const coreParams = [];
  const nearUniversal = [];
  const cycling = [];

  for (const [k, entries] of Object.entries(paramData)) {
    if (entries.length === panelCount) coreParams.push(k);
    else if (entries.length >= 7) nearUniversal.push(k);
    else cycling.push(k);
  }

  const totals = {};
  const isFlats = {};
  for (const [k, entries] of Object.entries(paramData)) {
    totals[k] = entries.reduce((sum, e) => sum + e.perRank * e.maxRank, 0);
    isFlats[k] = entries[0].isFlat;
  }

  return { panelCount, rankWarnings, coreParams, nearUniversal, cycling, totals, isFlats, paramData };
}

function renderSubgroup(sgKey, panels) {
  const name = subgroups.find(s => s.key === sgKey)?.name ?? sgKey;
  const { panelCount, rankWarnings, coreParams, nearUniversal, cycling, totals, isFlats, paramData } = analyzeSubgroup(sgKey, panels);

  const lines = [];
  lines.push(`### ${name} (\`${sgKey}\`)`);
  lines.push('');

  if (rankWarnings.length > 0) {
    for (const w of rankWarnings) lines.push(w);
    lines.push('');
  }

  const coreStr = coreParams.length > 0
    ? coreParams.map(k => `\`${k}\``).join(', ')
    : '_none — no param appears on every panel_';
  lines.push(`**Core (every panel):** ${coreStr}`);

  if (nearUniversal.length > 0) {
    const nuStr = nearUniversal.map(k => `\`${k}\` (${paramData[k].length}/${panelCount})`).join(', ');
    lines.push(`**Near-universal (7+/${panelCount}):** ${nuStr}`);
  }

  if (cycling.length > 0) {
    const cyStr = cycling.map(k => `\`${k}\` (${paramData[k].length}/${panelCount})`).join(', ');
    lines.push(`**Cycling pool:** ${cyStr}`);
  }

  lines.push('');

  const tierHeaders = panels.map(p => `T${p.mastery.subgroupTier}`);
  lines.push(`| param | ${tierHeaders.join(' | ')} | **Total** | Band |`);
  lines.push(`|-------|${tierHeaders.map(() => '------').join('|')}|-----------|------|`);

  const sortedParams = [
    ...coreParams.sort(),
    ...nearUniversal.sort(),
    ...cycling.sort(),
  ];

  for (const k of sortedParams) {
    const isFlat = isFlats[k];
    const cells = panels.map(panel => {
      const pp = (panel.panelParameters || []).find(p => p.parameterKey === k);
      if (!pp) return '—';
      const maxRank = panel.mastery.subgroupTier === 10 ? 20 : 10;
      return formatValue(pp.perRank * maxRank, pp.isFlat);
    });
    const total = formatValue(totals[k], isFlat);
    const band = classifyBand(k, totals[k], isFlat);
    const label = coreParams.includes(k) ? `**\`${k}\`**` : nearUniversal.includes(k) ? `_\`${k}\`_` : `\`${k}\``;
    lines.push(`| ${label} | ${cells.join(' | ')} | **${total}** | ${band} |`);
  }

  lines.push('');
  return lines.join('\n');
}

const legend = `## Legend

### Bonus bands (total in good direction)

| Band | Rate % total | Meaning |
|------|-------------|---------|
| ⬆️ **Extreme** | +170–220% | Core UP identity stat — the defining trait |
| ⬆️ **Very High** | +120–170% | Strong secondary or high-frequency cycling |
| ⬆️ **High** | +80–120% | Heavy cycling, late-tier focus |
| ⬆️ **Moderate** | +40–80% | Common cycling |
| ⬆️ **Gentle** | +15–40% | Light cycling, sparse presence |
| ⬆️ **Weak** | +5–15% | Flavor; T10-only or single-panel sprinkles |
| ⬆️ **Trace** | +1–5% | Negligible; barely registers individually |

### Penalty bands (total in bad direction)

| Band | Rate % total | Meaning |
|------|-------------|---------|
| 🔽 **Brutal** | −70% or worse | Avoid — stacking risk approaches zero-floor |
| 🔽 **Painful** | −50–70% | Core DOWN on glass-cannon identity only |
| 🔽 **Bad** | −35–50% | Standard core DOWN; safe for most identities |
| 🔽 **Middling** | −20–35% | Common cycling penalty |
| 🔽 **Not Good** | −8–20% | Light cycling penalty |
| 🔽 **Itchy** | −1–8% | Flavor; barely noticeable individually |

> For inverted params (\`pdr\`, \`mdr\`, \`fdr\`, \`mcr\`, \`tcr\`): good direction is DOWN, so a negative total is classified as a bonus band and a positive total as a penalty band.

---
`;

const docLines = [];
docLines.push('# SDP Data Sheet');
docLines.push('');
docLines.push('Auto-generated from `config.sdp.json`. **Core** params (bold) appear on every panel. _Near-universal_ params (italic, 7+/10) are flagged for review. Cycling pool params appear on fewer than 7 panels.');
docLines.push('');
docLines.push('Totals = sum of `perRank × maxRank` across the entire strip. Rate params show `%`; flat params show raw values. The **Band** column classifies the total against the legend below.');
docLines.push('');
docLines.push('---');
docLines.push('');
docLines.push(legend);

const coveredSubgroupKeys = new Set(Object.keys(sdpBySubgroup));

for (const family of families) {
  const familySubgroups = family.subgroupKeys.filter(k => coveredSubgroupKeys.has(k));
  if (familySubgroups.length === 0) continue;

  docLines.push(`## ${family.name}`);
  docLines.push('');

  for (const sgKey of familySubgroups) {
    docLines.push(renderSubgroup(sgKey, sdpBySubgroup[sgKey]));
  }
}

const familySubgroupKeys = new Set(families.flatMap(f => f.subgroupKeys));
const orphans = Object.keys(sdpBySubgroup).filter(k => !familySubgroupKeys.has(k));
if (orphans.length > 0) {
  docLines.push('## (Uncategorized)');
  docLines.push('');
  for (const sgKey of orphans) {
    docLines.push(renderSubgroup(sgKey, sdpBySubgroup[sgKey]));
  }
}

writeFileSync(outPath, docLines.join('\n'), 'utf8');
console.log(`Written to ${outPath}`);
