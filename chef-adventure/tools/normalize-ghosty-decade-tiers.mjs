/**
 * Normalizes the Ghosty decade (101–104) to a tier model:
 * - Tier = enemyId - 100 (101->1, 102->2, 103->3, 104->4).
 * - Six stat growth budgets (atk/def/mat/mdf/agi/luk) are EXACT:
 *   budget(tier) = 25 + (tier - 1) * 5.
 * - Each stat growth is linear and a multiple of 0.25: (a.level * k).
 * - Base stats (params[2..7]) are derived from growth: base = k * 4.
 * - Distribution follows tier-1 proportions (Ghosty) with deterministic rounding.
 * - MHP uses a shared exponent F for the decade and per-tier B/M:
 *   MHP(L) = B + (L ** F) * M.
 *   Targets for MHP totals at L1 and L100 grow ~25% per tier from tier-1's CURRENT totals.
 * - Skips nothing in 101–104; validates required tags exist and growth is linear first.
 *
 * Usage:
 *   node normalize-ghosty-decade-tiers.mjs          # dry run report
 *   node normalize-ghosty-decade-tiers.mjs --apply # write Enemies.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const IDS = [101, 102, 103, 104];
const LEVEL_RE = /<(?:lv|lvl|level):[ ]?(-?\d+)>/i;

const SIX =
[
  { paramIndex: 2, short: 'atk', tag: 'atkBuffPlus' },
  { paramIndex: 3, short: 'def', tag: 'defBuffPlus' },
  { paramIndex: 4, short: 'mat', tag: 'matBuffPlus' },
  { paramIndex: 5, short: 'mdf', tag: 'mdfBuffPlus' },
  { paramIndex: 6, short: 'agi', tag: 'agiBuffPlus' },
  { paramIndex: 7, short: 'luk', tag: 'lukBuffPlus' },
];

const MHP_TAG = 'mhpBuffPlus';

function parseLevel(note)
{
  const m = String(note || '').match(LEVEL_RE);
  if (!m) return null;
  const L = parseInt(m[1], 10);
  if (!Number.isFinite(L) || L <= 0) return null;
  return L;
}

function roundQuarter(n)
{
  return Math.round(n * 4) / 4;
}

/**
 * Rounds a coefficient for tags (e.g. mhpBuffPlus M) to the nearest 0.01.
 * @param {number} n
 * @returns {number}
 */
function roundHundredth(n)
{
  return Math.round(n * 100) / 100;
}

/**
 * String for M in `(a.level ** F) * M` — max two decimal places, no float noise.
 * @param {number} m
 * @returns {string}
 */
function formatMhpMultiplier(m)
{
  const r = roundHundredth(m);
  if (Number.isInteger(r)) return String(r);
  return r.toFixed(2);
}

function formatQuarter(n)
{
  // Keep readable: integers as "6", quarters as "6.25"/"6.5"/"6.75".
  if (Number.isInteger(n)) return String(n);
  const s = String(n);
  return s;
}

function parseLinearK(note, tag)
{
  const re = new RegExp(`<${tag}:\\[([^\\]]*)\\]>`, 'i');
  const m = String(note || '').match(re);
  if (!m) return null;
  const inner = m[1];

  // Only accept simple linear form: (a.level * k)
  const km = inner.match(/a\.level\s*\*\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (!km) return NaN;
  const k = parseFloat(km[1]);
  if (!Number.isFinite(k)) return NaN;
  return k;
}

function parseMhpInner(note)
{
  const re = new RegExp(`<${MHP_TAG}:\\[([^\\]]*)\\]>`, 'i');
  const m = String(note || '').match(re);
  if (!m) return null;
  return m[1];
}

function evalFormula(inner, level)
{
  if (!inner) return 0;
  return Function('a', '"use strict"; return (' + inner + ');')({ level });
}

function totalMhpAt(enemy, level)
{
  const base = Number(enemy.params[0]);
  const inner = parseMhpInner(enemy.note || '');
  const buff = evalFormula(inner, level);
  return base + buff;
}

function budgetForTier(tier)
{
  return 25 + (tier - 1) * 5;
}

function round5(n)
{
  return Math.round(n / 5) * 5;
}

function mod5(n)
{
  // Floating safety.
  const r = n % 5;
  return Math.abs(r) < 1e-9 ? 0 : r;
}

function replaceOrAddTagLine(note, tag, newInner)
{
  const normalized = String(note || '').replace(/\r\n/g, '\n');
  const lineRe = new RegExp(`^<${tag}:\\[[^\\]]*\\]>\\s*$`, 'm');
  const newLine = `<${tag}:[${newInner}]>`;

  if (lineRe.test(normalized))
  {
    return normalized.replace(lineRe, newLine);
  }

  // Insert after the last *BuffPlus line if any, else after <level>.
  const lines = normalized.split('\n');
  let insertAt = 0;
  let lastBuffIdx = -1;
  const anyBuffPlusLineRe = /^<[a-zA-Z][a-zA-Z0-9]*BuffPlus:/;
  for (let i = 0; i < lines.length; i++)
  {
    if (anyBuffPlusLineRe.test(lines[i].trimStart())) lastBuffIdx = i;
  }

  if (lastBuffIdx >= 0) insertAt = lastBuffIdx + 1;
  else
  {
    const levelIdx = lines.findIndex(l => LEVEL_RE.test(l));
    insertAt = levelIdx >= 0 ? levelIdx + 1 : 0;
  }

  lines.splice(insertAt, 0, newLine);
  return lines.join('\n');
}

function stripTagLine(note, tag)
{
  const normalized = String(note || '').replace(/\r\n/g, '\n');
  const lineRe = new RegExp(`\\n?<${tag}:\\[[^\\]]*\\]>\\s*`, 'g');
  const stripped = normalized.replace(lineRe, '\n');
  return stripped.replace(/\n{3,}/g, '\n\n').trimEnd();
}

function allocateGrowthFromTemplate(templateKs, tier, priorTierKs)
{
  const budget = budgetForTier(tier);
  const templateSum = templateKs.reduce((a, b) => a + b, 0);

  // Scale by budget ratio.
  const scaled = templateKs.map(k => (k / templateSum) * budget);

  // Round to quarter, then fix drift to exact budget.
  const ks = scaled.map(roundQuarter);
  let sum = ks.reduce((a, b) => a + b, 0);
  let diff = roundQuarter(budget - sum);

  // Deterministic priority order: highest template weight first for adds, lowest for subtracts.
  const idxByWeightDesc = templateKs
    .map((k, i) => ({ k, i }))
    .sort((a, b) => b.k - a.k)
    .map(x => x.i);
  const idxByWeightAsc = [...idxByWeightDesc].reverse();

  const minKs = priorTierKs ? priorTierKs.slice() : null;

  function canSub(i)
  {
    const after = ks[i] - 0.25;
    if (after < 0.25) return false;
    if (minKs && after < minKs[i]) return false;
    return true;
  }

  function canAdd(i)
  {
    const after = ks[i] + 0.25;
    if (minKs && after < minKs[i]) return false;
    return true;
  }

  while (diff !== 0)
  {
    if (diff > 0)
    {
      let applied = false;
      for (const i of idxByWeightDesc)
      {
        if (canAdd(i) === false) continue;
        ks[i] = roundQuarter(ks[i] + 0.25);
        diff = roundQuarter(diff - 0.25);
        applied = true;
        break;
      }
      if (applied === false) throw new Error(`Unable to allocate +diff without breaking constraints: diff=${diff}`);
    }
    else
    {
      let applied = false;
      for (const i of idxByWeightAsc)
      {
        if (canSub(i) === false) continue;
        ks[i] = roundQuarter(ks[i] - 0.25);
        diff = roundQuarter(diff + 0.25);
        applied = true;
        break;
      }
      if (applied === false) throw new Error(`Unable to allocate -diff without breaking constraints: diff=${diff}`);
    }
  }

  // Enforce non-decreasing vs prior tier (if rounding + diff fix somehow violated via NaNs).
  if (minKs)
  {
    for (let i = 0; i < ks.length; i++)
    {
      if (ks[i] < minKs[i]) ks[i] = minKs[i];
    }

    // If we changed values to satisfy mins, re-balance to exact budget.
    sum = ks.reduce((a, b) => a + b, 0);
    diff = roundQuarter(budget - sum);
    if (diff !== 0)
    {
      // Only add/sub where possible without violating mins.
      while (diff !== 0)
      {
        if (diff > 0)
        {
          for (const i of idxByWeightDesc)
          {
            ks[i] = roundQuarter(ks[i] + 0.25);
            diff = roundQuarter(diff - 0.25);
            break;
          }
        }
        else
        {
          let did = false;
          for (const i of idxByWeightAsc)
          {
            if (canSub(i) === false) continue;
            ks[i] = roundQuarter(ks[i] - 0.25);
            diff = roundQuarter(diff + 0.25);
            did = true;
            break;
          }
          if (did === false) throw new Error(`Unable to rebalance after enforcing mins: diff=${diff}`);
        }
      }
    }
  }

  // Final exactness check.
  sum = ks.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - budget) > 1e-9) throw new Error(`Budget mismatch tier ${tier}: sum=${sum} budget=${budget}`);

  return ks;
}

function fitMhpBM({ F, T1, T100 })
{
  // T1 = B + 1^F*M = B + M
  // T100 = B + 100^F*M
  const p100 = Math.pow(100, F);
  const M = (T100 - T1) / (p100 - 1);
  const B = T1 - M;
  return { B, M };
}

function chooseRoundedBAndM({ F, targetT1, targetT100, idealB })
{
  const p100 = Math.pow(100, F);
  const B0 = round5(idealB);

  let best = null;
  // Search wide enough to actually hit "L1 total multiple of 5" when possible.
  for (let delta = -500; delta <= 500; delta += 5)
  {
    const B = B0 + delta;
    if (B <= 0) continue;
    const M = (targetT100 - B) / p100;
    if (Number.isFinite(M) === false || M <= 0) continue;

    const T1 = B + M;
    const m5 = mod5(T1);
    const distTo5 = Math.min(m5, 5 - m5);

    const score =
      distTo5 * 1000 +
      Math.abs(delta) +
      Math.abs(B - idealB) * 0.01;

    if (best === null || score < best.score)
    {
      best = { B, M, T1, score };
      if (distTo5 === 0) break;
    }
  }

  if (!best) throw new Error('Unable to find a rounded B/M candidate.');
  return best;
}

function main()
{
  const apply = process.argv.includes('--apply');
  const json = fs.readFileSync(ENEMIES_PATH, 'utf8');
  const data = JSON.parse(json);

  const enemies = IDS.map((id) => data[id]);
  for (const [i, e] of enemies.entries())
  {
    const id = IDS[i];
    if (!e) throw new Error(`Missing enemy id ${id}.`);
    const L = parseLevel(e.note || '');
    if (L === null) throw new Error(`Enemy ${id} (${e.name}) missing valid <level:N> tag.`);
  }

  // Validate six-stat growth is linear for 101–104.
  const tier1 = enemies[0];
  const templateKs = [];
  for (const { tag } of SIX)
  {
    const k = parseLinearK(tier1.note || '', tag);
    if (k === null) throw new Error(`Tier-1 template missing <${tag}:[...]> tag.`);
    if (Number.isNaN(k)) throw new Error(`Tier-1 template has non-linear <${tag}>; expected (a.level * k).`);
    templateKs.push(k);
  }

  for (const e of enemies)
  {
    for (const { tag } of SIX)
    {
      const k = parseLinearK(e.note || '', tag);
      if (k === null) throw new Error(`Enemy ${e.id} (${e.name}) missing <${tag}> tag.`);
      if (Number.isNaN(k)) throw new Error(`Enemy ${e.id} (${e.name}) has non-linear <${tag}>; expected (a.level * k).`);
    }
  }

  // Shared MHP exponent for the decade.
  const F = 2.6;

  // Tier-1 baseline targets come from CURRENT tier-1 totals (before any rewrite).
  const baselineT1 = totalMhpAt(tier1, 1);
  const baselineT100 = totalMhpAt(tier1, 100);

  const report = [];
  const newSixKsByTier = new Map();

  let priorKs = null;
  for (let t = 1; t <= 4; t++)
  {
    const ks = allocateGrowthFromTemplate(templateKs, t, priorKs);
    newSixKsByTier.set(t, ks);
    priorKs = ks;
  }

  const mhpPlans = new Map();
  for (let t = 1; t <= 4; t++)
  {
    const mult = Math.pow(1.25, t - 1);
    const targetT1 = baselineT1 * mult;
    const targetT100 = baselineT100 * mult;
    const { B: idealB, M: idealM } = fitMhpBM({ F, T1: targetT1, T100: targetT100 });
    const chosen = chooseRoundedBAndM({ F, targetT1, targetT100, idealB });
    mhpPlans.set(t, {
      targetT1,
      targetT100,
      idealB,
      idealM,
      B: chosen.B,
      M: chosen.M,
      achievedT1: chosen.T1,
    });
  }

  // Preview anchor check for MHP totals only.
  const anchors = [1, 10, 20, 35, 55, 75, 100];
  function mhpTotal(B, M, L)
  {
    return B + (Math.pow(L, F) * M);
  }

  for (let idx = 0; idx < enemies.length; idx++)
  {
    const e = enemies[idx];
    const tier = e.id - 100;
    const ks = newSixKsByTier.get(tier);
    const mhp = mhpPlans.get(tier);
    const old = {
      params: e.params.slice(),
      ks: SIX.map(({ tag }) => parseLinearK(e.note || '', tag)),
      mhpB: e.params[0],
      mhpInner: parseMhpInner(e.note || ''),
    };

    const newParams = e.params.slice();
    // MHP base.
    newParams[0] = mhp.B;
    // Six bases derived from growth.
    for (let i = 0; i < SIX.length; i++)
    {
      newParams[SIX[i].paramIndex] = Math.round(ks[i] * 4);
    }

    const newTags = [];
    for (let i = 0; i < SIX.length; i++)
    {
      newTags.push({ tag: SIX[i].tag, inner: `(a.level * ${formatQuarter(ks[i])})` });
    }

    // Replace mhpBuffPlus with shared exponent formula (M rounded to 0.01 in the tag).
    const mhpMTag = roundHundredth(mhp.M);
    const mhpInner = `(a.level ** ${F}) * ${formatMhpMultiplier(mhp.M)}`;

    report.push({
      id: e.id,
      name: e.name,
      tier,
      statBudget: budgetForTier(tier),
      oldParams: old.params,
      newParams,
      oldKs: old.ks,
      newKs: ks,
      mhp: {
        baselineTier1: { L1: baselineT1, L100: baselineT100 },
        tierTargets: { L1: mhp.targetT1, L100: mhp.targetT100 },
        chosen: { B: mhp.B, M: mhp.M, MTag: mhpMTag, achievedL1: mhp.B + mhpMTag },
        oldB: old.mhpB,
        oldInner: old.mhpInner,
        newInner: mhpInner,
        anchors: anchors.map(L => ({ L, hp: mhpTotal(mhp.B, mhpMTag, L) })),
      },
    });

    if (apply)
    {
      // Strip and replace tags.
      let note = e.note || '';
      note = stripTagLine(note, MHP_TAG);
      for (const { tag } of SIX) note = stripTagLine(note, tag);

      // Insert new MHP then the six stats.
      note = replaceOrAddTagLine(note, MHP_TAG, mhpInner);
      for (const { tag, inner } of newTags)
      {
        note = replaceOrAddTagLine(note, tag, inner);
      }

      e.params = newParams;
      e.note = note;
    }
  }

  // Console report (dry-run friendly).
  console.log(apply ? 'APPLY mode: wrote Enemies.json' : 'DRY RUN (no file write). Pass --apply to save.');
  console.log(`Shared MHP exponent F=${F}`);
  console.log(`Tier-1 MHP baseline totals: L1=${baselineT1.toFixed(2)} L100=${baselineT100.toFixed(2)}`);
  console.log('');

  for (const r of report)
  {
    console.log(`Enemy ${r.id} ${r.name} (tier ${r.tier})`);
    console.log(`  Stat budget: ${r.statBudget} (sum newKs=${r.newKs.reduce((a,b)=>a+b,0)})`);
    console.log(`  Old ks: ${r.oldKs.map(k => formatQuarter(k)).join(', ')}`);
    console.log(`  New ks: ${r.newKs.map(k => formatQuarter(k)).join(', ')}`);
    console.log(`  New bases (atk..luk): ${SIX.map(s => r.newParams[s.paramIndex]).join(', ')}`);
    console.log(`  Old MHP: B=${r.mhp.oldB}, inner=${String(r.mhp.oldInner).replace(/\\s+/g,' ').trim().slice(0, 80)}`);
    console.log(`  New MHP: B=${r.mhp.chosen.B}, inner=${r.mhp.newInner}`);
    console.log(`  M (pre-round ${r.mhp.chosen.M.toFixed(4)} -> tag ${r.mhp.chosen.MTag})`);
    console.log(`  Tier targets: L1=${r.mhp.tierTargets.L1.toFixed(2)} L100=${r.mhp.tierTargets.L100.toFixed(2)} | L1 with tag M=${r.mhp.chosen.achievedL1.toFixed(2)}`);
    console.log(`  MHP anchors: ${r.mhp.anchors.map(a => `L${a.L}=${Math.round(a.hp)}`).join(' ')}`);
    console.log('');
  }

  if (apply)
  {
    const chunks = ['[\n'];
    for (let j = 0; j < data.length; j++)
    {
      const row = data[j] === null ? 'null' : JSON.stringify(data[j]);
      chunks.push(j < data.length - 1 ? `${row},\n` : `${row}\n`);
    }
    chunks.push(']');
    fs.writeFileSync(ENEMIES_PATH, chunks.join(''));
  }
}

main();
