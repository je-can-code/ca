/**
 * Normalizes a contiguous enemy id range to a shared decade tier model.
 *
 * - Tier = enemyId - tierBase (e.g. tierBase 110 => 111->1, 112->2).
 * - Optional `--skip-tbd`: skips names starting with "=== TBD" (default processes them).
 * - Tier-1 template: enemy at id (tierBase + 1); six linear growth tags define proportions.
 *   Budget(tier) = max(25, sum(templateKs)) + (tier-1)*budgetStep so tier-1 is at least 25 points
 *   when the template sums lower (same proportional growth as higher tiers).
 * - Six stat growth: linear (a.level * k), k in 0.25 steps; bases params[2..7] = round(k*4).
 * - MHP: MHP(L) = B + (L ** F) * M with shared F; per-tier targets scale ~25%/tier from
 *   tier-1's current L1/L100 totals before rewrite.
 * - Optional `--flat-tier N`: every processed enemy uses **tier N** MHP targets and stat budget.
 *   Each row keeps its **own** six-tag proportions (parsed from that row before rewrite); `priorKs`
 *   is not applied between rows. Use when a decade is **not** a 1→10 ladder (e.g. elemental allies).
 * - With `--flat-tier`, optional `--mhp-mult id:mult,id:mult,...` scales that row’s **MHP tier targets**
 *   (L1 / L100) before fitting B/M (e.g. squishy casters `0.7`, bruisers `1.25`). Omitted ids default to **1**.
 *
 * Usage:
 *   node normalize-decade-tiers.mjs --from 111 --to 120 --tier-base 110 --f 2.7
 *   node normalize-decade-tiers.mjs --from 111 --to 120 --tier-base 110 --f 2.7 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs ... --skip-tbd   # leave === TBD rows unchanged
 *   node normalize-decade-tiers.mjs ... --flat-tier 4 --apply   # same MHP/stat tier for all rows
 *   node normalize-decade-tiers.mjs ... --flat-tier 4 --mhp-mult 552:0.72,553:1.2 --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

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

/** Minimum tier-1 six-stat growth budget; below this, scale targets up to 25 like later tiers. */
const MIN_TIER1_STAT_BUDGET = 25;

function isSkippedEnemy(e, skipTbd)
{
  if (skipTbd === false) return false;
  return String(e && e.name ? e.name : '').trim().startsWith('=== TBD');
}

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
  if (Number.isInteger(n)) return String(n);
  return String(n);
}

function parseLinearK(note, tag)
{
  const re = new RegExp(`<${tag}:\\[([^\\]]*)\\]>`, 'i');
  const m = String(note || '').match(re);
  if (!m) return null;
  const inner = m[1];

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

function budgetForTier(tier, budget1, budgetStep)
{
  return budget1 + (tier - 1) * budgetStep;
}

function round5(n)
{
  return Math.round(n / 5) * 5;
}

function mod5(n)
{
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

function allocateGrowthFromTemplate(templateKs, tier, priorTierKs, budget1, budgetStep)
{
  const budget = budgetForTier(tier, budget1, budgetStep);
  const templateSum = templateKs.reduce((a, b) => a + b, 0);

  const scaled = templateKs.map(k => (k / templateSum) * budget);

  const ks = scaled.map(roundQuarter);
  let sum = ks.reduce((a, b) => a + b, 0);
  let diff = roundQuarter(budget - sum);

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

  if (minKs)
  {
    for (let i = 0; i < ks.length; i++)
    {
      if (ks[i] < minKs[i]) ks[i] = minKs[i];
    }

    sum = ks.reduce((a, b) => a + b, 0);
    diff = roundQuarter(budget - sum);
    if (diff !== 0)
    {
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

  sum = ks.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - budget) > 1e-9) throw new Error(`Budget mismatch tier ${tier}: sum=${sum} budget=${budget}`);

  return ks;
}

function fitMhpBM({ F, T1, T100 })
{
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

/**
 * Parses `--mhp-mult 552:0.72,554:0.65` into a Map of enemy id → positive multiplier.
 * @param {string | null | undefined} s
 * @returns {Map<number, number>}
 */
function parseMhpMult(s)
{
  const map = new Map();
  if (s == null || String(s).trim() === '') return map;
  for (const part of String(s).split(','))
  {
    const t = part.trim();
    if (t === '') continue;
    const bits = t.split(':');
    if (bits.length !== 2) throw new Error(`Bad --mhp-mult segment "${part}"; use id:mult`);
    const id = parseInt(bits[0], 10);
    const mul = parseFloat(bits[1]);
    if (Number.isFinite(id) === false || id <= 0) throw new Error(`Bad enemy id in --mhp-mult: ${bits[0]}`);
    if (Number.isFinite(mul) === false || mul <= 0) throw new Error(`Bad multiplier in --mhp-mult: ${bits[1]}`);
    map.set(id, mul);
  }
  return map;
}

function parseArgs()
{
  const argv = process.argv.slice(2);
  let from = null;
  let to = null;
  let tierBase = null;
  let F = null;
  let budgetStep = 5;
  let apply = false;
  let skipTbd = false;
  let flatTier = null;
  let mhpMultRaw = null;

  for (let i = 0; i < argv.length; i++)
  {
    const a = argv[i];
    if (a === '--apply')
    {
      apply = true;
      continue;
    }
    if (a === '--skip-tbd')
    {
      skipTbd = true;
      continue;
    }
    if (a === '--from')
    {
      from = parseInt(argv[++i], 10);
      continue;
    }
    if (a === '--to')
    {
      to = parseInt(argv[++i], 10);
      continue;
    }
    if (a === '--tier-base')
    {
      tierBase = parseInt(argv[++i], 10);
      continue;
    }
    if (a === '--f')
    {
      F = parseFloat(argv[++i]);
      continue;
    }
    if (a === '--budget-step')
    {
      budgetStep = parseInt(argv[++i], 10);
      continue;
    }
    if (a === '--flat-tier')
    {
      flatTier = parseInt(argv[++i], 10);
      continue;
    }
    if (a === '--mhp-mult')
    {
      mhpMultRaw = argv[++i];
      continue;
    }
  }

  return { from, to, tierBase, F, budgetStep, apply, skipTbd, flatTier, mhpMultRaw };
}

function usage()
{
  console.error(`Usage:
  node normalize-decade-tiers.mjs --from N --to N --tier-base N --f F [--budget-step 5] [--flat-tier N] [--mhp-mult id:mul,...] [--skip-tbd] [--apply]
Example (Reborn 111–120, tier = id - 110, F matches Wraith/Felmist):
  node normalize-decade-tiers.mjs --from 111 --to 120 --tier-base 110 --f 2.7 --apply`);
}

function main()
{
  const { from, to, tierBase, F, budgetStep, apply, skipTbd, flatTier, mhpMultRaw } = parseArgs();
  const mhpMultById = parseMhpMult(mhpMultRaw);

  if (
    Number.isFinite(from) === false ||
    Number.isFinite(to) === false ||
    Number.isFinite(tierBase) === false ||
    Number.isFinite(F) === false ||
    from > to ||
    Number.isFinite(budgetStep) === false ||
    budgetStep <= 0
  )
  {
    usage();
    process.exit(1);
  }

  if (flatTier != null && (Number.isFinite(flatTier) === false || flatTier < 1))
  {
    usage();
    process.exit(1);
  }

  if (mhpMultById.size > 0 && flatTier == null)
  {
    console.error('--mhp-mult requires --flat-tier.');
    process.exit(1);
  }

  const json = fs.readFileSync(ENEMIES_PATH, 'utf8');
  const data = JSON.parse(json);

  const tier1Id = tierBase + 1;
  const tier1Enemy = data[tier1Id];
  if (!tier1Enemy) throw new Error(`Missing tier-1 enemy at id ${tier1Id}.`);
  if (isSkippedEnemy(tier1Enemy, skipTbd)) throw new Error(`Tier-1 enemy ${tier1Id} is skipped (TBD placeholder).`);

  const L1 = parseLevel(tier1Enemy.note || '');
  if (L1 === null) throw new Error(`Tier-1 enemy ${tier1Id} (${tier1Enemy.name}) missing valid <level:N> tag.`);

  const templateKs = [];
  for (const { tag } of SIX)
  {
    const k = parseLinearK(tier1Enemy.note || '', tag);
    if (k === null) throw new Error(`Tier-1 template missing <${tag}:[...]> tag.`);
    if (Number.isNaN(k)) throw new Error(`Tier-1 template has non-linear <${tag}>; expected (a.level * k).`);
    templateKs.push(k);
  }

  const templateSum = templateKs.reduce((a, b) => a + b, 0);
  const budget1 = Math.max(MIN_TIER1_STAT_BUDGET, templateSum);

  const processed = [];
  for (let id = from; id <= to; id++)
  {
    const e = data[id];
    if (!e) throw new Error(`Missing enemy id ${id}.`);
    const skipped = isSkippedEnemy(e, skipTbd);
    const tier = id - tierBase;
    if (skipped === false && tier < 1)
    {
      throw new Error(`Enemy ${id} (${e.name}) tier ${tier} < 1 for tierBase ${tierBase}.`);
    }

    if (skipped === false)
    {
      const L = parseLevel(e.note || '');
      if (L === null) throw new Error(`Enemy ${id} (${e.name}) missing valid <level:N> tag.`);

      for (const { tag } of SIX)
      {
        const k = parseLinearK(e.note || '', tag);
        if (k === null) throw new Error(`Enemy ${id} (${e.name}) missing <${tag}> tag.`);
        if (Number.isNaN(k)) throw new Error(`Enemy ${id} (${e.name}) has non-linear <${tag}>; expected (a.level * k).`);
      }
    }

    processed.push({ id, e, tier, skipped });
  }

  const active = processed.filter(x => x.skipped === false);
  if (active.length === 0)
  {
    console.log('No non-TBD enemies in range; nothing to do.');
    return;
  }

  const maxTier = Math.max(...active.map(x => x.tier));
  const maxTierForMhp = flatTier != null ? Math.max(maxTier, flatTier) : maxTier;

  const baselineT1 = totalMhpAt(tier1Enemy, 1);
  const baselineT100 = totalMhpAt(tier1Enemy, 100);

  const newSixKsByTier = new Map();
  if (flatTier == null)
  {
    let priorKs = null;
    for (let t = 1; t <= maxTier; t++)
    {
      const ks = allocateGrowthFromTemplate(templateKs, t, priorKs, budget1, budgetStep);
      newSixKsByTier.set(t, ks);
      priorKs = ks;
    }
  }

  const mhpPlans = new Map();
  for (let t = 1; t <= maxTierForMhp; t++)
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

  const anchors = [1, 10, 20, 35, 55, 75, 100];
  function mhpTotal(B, M, L)
  {
    return B + (Math.pow(L, F) * M);
  }

  const report = [];

  for (const row of processed)
  {
    const { id, e, tier, skipped } = row;
    if (skipped)
    {
      console.log(`SKIP ${id} ${e.name} (TBD placeholder)`);
      continue;
    }

    const rowTemplateKs = [];
    for (const { tag } of SIX)
    {
      const k = parseLinearK(e.note || '', tag);
      if (k === null) throw new Error(`Enemy ${id} (${e.name}) missing <${tag}> tag.`);
      if (Number.isNaN(k)) throw new Error(`Enemy ${id} (${e.name}) has non-linear <${tag}>; expected (a.level * k).`);
      rowTemplateKs.push(k);
    }

    const rowBudget1 = Math.max(MIN_TIER1_STAT_BUDGET, rowTemplateKs.reduce((a, b) => a + b, 0));
    const mhpTier = flatTier != null ? flatTier : tier;
    const mhpBase = mhpPlans.get(mhpTier);
    if (!mhpBase) throw new Error(`Internal: missing MHP plan for id ${id} mhpTier ${mhpTier}.`);

    const hpMult = mhpMultById.get(id) || 1;
    let mhp = mhpBase;
    if (hpMult !== 1)
    {
      const targetT1 = mhpBase.targetT1 * hpMult;
      const targetT100 = mhpBase.targetT100 * hpMult;
      const { B: idealB, M: idealM } = fitMhpBM({ F, T1: targetT1, T100: targetT100 });
      const chosen = chooseRoundedBAndM({ F, targetT1, targetT100, idealB });
      mhp = {
        targetT1,
        targetT100,
        idealB,
        idealM,
        B: chosen.B,
        M: chosen.M,
        achievedT1: chosen.T1,
      };
    }

    let ks;
    if (flatTier != null)
    {
      ks = allocateGrowthFromTemplate(rowTemplateKs, flatTier, null, rowBudget1, budgetStep);
    }
    else
    {
      ks = newSixKsByTier.get(tier);
      if (!ks) throw new Error(`Internal: missing ks plan for id ${id} tier ${tier}.`);
    }

    const old = {
      params: e.params.slice(),
      ks: rowTemplateKs.slice(),
      mhpB: e.params[0],
      mhpInner: parseMhpInner(e.note || ''),
    };

    const newParams = e.params.slice();
    newParams[0] = mhp.B;
    for (let i = 0; i < SIX.length; i++)
    {
      newParams[SIX[i].paramIndex] = Math.round(ks[i] * 4);
    }

    const newTags = [];
    for (let i = 0; i < SIX.length; i++)
    {
      newTags.push({ tag: SIX[i].tag, inner: `(a.level * ${formatQuarter(ks[i])})` });
    }

    const mhpMTag = roundHundredth(mhp.M);
    const mhpInner = `(a.level ** ${F}) * ${formatMhpMultiplier(mhp.M)}`;

    const statBudgetTier = flatTier != null ? flatTier : tier;
    const statBudgetSource = flatTier != null ? rowBudget1 : budget1;

    report.push({
      id: e.id,
      name: e.name,
      tier,
      statBudget: budgetForTier(statBudgetTier, statBudgetSource, budgetStep),
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
        anchors: anchors.map(Lv => ({ L: Lv, hp: mhpTotal(mhp.B, mhpMTag, Lv) })),
      },
    });

    if (apply)
    {
      let note = e.note || '';
      note = stripTagLine(note, MHP_TAG);
      for (const { tag } of SIX) note = stripTagLine(note, tag);

      note = replaceOrAddTagLine(note, MHP_TAG, mhpInner);
      for (const { tag, inner } of newTags)
      {
        note = replaceOrAddTagLine(note, tag, inner);
      }

      e.params = newParams;
      e.note = note;
    }
  }

  console.log(apply ? 'APPLY mode: wrote Enemies.json' : 'DRY RUN (no file write). Pass --apply to save.');
  const budgetNote = budget1 > templateSum
    ? `budget1=${budget1} (template sum ${templateSum} -> floor ${MIN_TIER1_STAT_BUDGET})`
    : `budget1=${budget1} (template sum ${templateSum})`;
  console.log(`Range ${from}–${to}, tierBase=${tierBase}, F=${F}, budgetStep=${budgetStep}, ${budgetNote}`);
  if (flatTier != null) console.log(`Flat tier mode: MHP + stat budget locked to tier ${flatTier} (per-row k proportions).`);
  if (mhpMultById.size > 0) console.log(`MHP row multipliers: ${[...mhpMultById.entries()].map(([k, v]) => `${k}×${v}`).join(', ')}`);
  console.log(`Shared MHP exponent F=${F}`);
  console.log(`Tier-1 MHP baseline totals: L1=${baselineT1.toFixed(2)} L100=${baselineT100.toFixed(2)}`);
  console.log('');

  for (const r of report)
  {
    const tierLabel = flatTier != null ? `${r.tier} (flat MHP/stat tier ${flatTier})` : String(r.tier);
    console.log(`Enemy ${r.id} ${r.name} (tier ${tierLabel})`);
    console.log(`  Stat budget: ${r.statBudget} (sum newKs=${r.newKs.reduce((a, b) => a + b, 0)})`);
    console.log(`  Old ks: ${r.oldKs.map(k => formatQuarter(k)).join(', ')}`);
    console.log(`  New ks: ${r.newKs.map(k => formatQuarter(k)).join(', ')}`);
    console.log(`  New bases (atk..luk): ${SIX.map(s => r.newParams[s.paramIndex]).join(', ')}`);
    const oldInnerStr = String(r.mhp.oldInner || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    console.log(`  Old MHP: B=${r.mhp.oldB}, inner=${oldInnerStr}`);
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
      const rowJson = data[j] === null ? 'null' : JSON.stringify(data[j]);
      chunks.push(j < data.length - 1 ? `${rowJson},\n` : `${rowJson}\n`);
    }
    chunks.push(']');
    fs.writeFileSync(ENEMIES_PATH, chunks.join(''));
  }
}

main();
