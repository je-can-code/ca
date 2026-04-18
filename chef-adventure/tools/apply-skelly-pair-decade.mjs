/**
 * Skelly decade 131–140 is five master/pet pairs (Skeletor + Skeledoggo pattern).
 * Each pair uses the same stat *budget* as virtual tiers 2, 4, 6, 8, 10 of the standard decade
 * ladder (not 1/2, 3/4, …). Masters keep Skeletor stat proportions; pets keep Skeledoggo proportions.
 * MHP: ladder is scaled so virtual tier 10 master is ~1.5M HP at L100; pet MHP targets are 60% of
 * the master's tier targets (separate B/M per pet row).
 *
 * Tier-1 MHP anchor for ladder targets: legacy Skeletor B=70, (a.level ** 2.6) * 2, F=2.6.
 *
 * Usage:
 *   node apply-skelly-pair-decade.mjs --dry-run
 *   node apply-skelly-pair-decade.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const F = 2.6;
const BUDGET_STEP = 5;
const MIN_TIER1_STAT_BUDGET = 25;

const MASTER_VT10_L100_TARGET = 1500000;
const PET_MHP_FRACTION_OF_MASTER_TARGETS = 0.6;

const TIER1_MHP_BASE = 70;
const TIER1_MHP_INNER = '(a.level ** 2.6) * 2';

const MASTER_TEMPLATE_KS = [3.75, 3.75, 3.25, 3.25, 3.75, 3.75];
const PET_TEMPLATE_KS = [6, 3, 3, 3, 5, 4];

const PAIRS =
[
  { masterId: 131, petId: 132, virtualTier: 2 },
  { masterId: 133, petId: 134, virtualTier: 4 },
  { masterId: 135, petId: 136, virtualTier: 6 },
  { masterId: 137, petId: 138, virtualTier: 8 },
  { masterId: 139, petId: 140, virtualTier: 10 },
];

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

function roundHundredth(n)
{
  return Math.round(n * 100) / 100;
}

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

function totalMhpAt(base, inner, level)
{
  return Number(base) + evalFormula(inner, level);
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

function stripTagLine(note, tag)
{
  const normalized = String(note || '').replace(/\r\n/g, '\n');
  const lineRe = new RegExp(`\\n?<${tag}:\\[[^\\]]*\\]>\\s*`, 'g');
  const stripped = normalized.replace(lineRe, '\n');
  return stripped.replace(/\n{3,}/g, '\n\n').trimEnd();
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
      if (applied === false) throw new Error(`Unable to allocate +diff: diff=${diff}`);
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
      if (applied === false) throw new Error(`Unable to allocate -diff: diff=${diff}`);
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
          if (did === false) throw new Error(`Unable to rebalance: diff=${diff}`);
        }
      }
    }
  }

  sum = ks.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - budget) > 1e-9) throw new Error(`Budget mismatch tier ${tier}: sum=${sum} budget=${budget}`);

  return ks;
}

function fitMhpBM({ Fm, T1, T100 })
{
  const p100 = Math.pow(100, Fm);
  const M = (T100 - T1) / (p100 - 1);
  const B = T1 - M;
  return { B, M };
}

function chooseRoundedBAndM({ Fm, targetT1, targetT100, idealB })
{
  const p100 = Math.pow(100, Fm);
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

function applyMhpAndSix(e, mhp, ks, Fm)
{
  const mhpMTag = roundHundredth(mhp.M);
  const mhpInner = `(a.level ** ${Fm}) * ${formatMhpMultiplier(mhp.M)}`;

  const newParams = e.params.slice();
  newParams[0] = mhp.B;
  for (let i = 0; i < SIX.length; i++)
  {
    newParams[SIX[i].paramIndex] = Math.round(ks[i] * 4);
  }

  let note = e.note || '';
  note = stripTagLine(note, MHP_TAG);
  for (const { tag } of SIX) note = stripTagLine(note, tag);

  note = replaceOrAddTagLine(note, MHP_TAG, mhpInner);
  for (let i = 0; i < SIX.length; i++)
  {
    const inner = `(a.level * ${formatQuarter(ks[i])})`;
    note = replaceOrAddTagLine(note, SIX[i].tag, inner);
  }

  e.params = newParams;
  e.note = note;
}

function buildKsByTier(templateKs, budget1, budgetStep)
{
  const map = new Map();
  let prior = null;
  for (let t = 1; t <= 10; t++)
  {
    const ks = allocateGrowthFromTemplate(templateKs, t, prior, budget1, budgetStep);
    map.set(t, ks);
    prior = ks;
  }
  return map;
}

function buildMhpTargetPlans(baselineT1, baselineT100)
{
  const map = new Map();
  for (let t = 1; t <= 10; t++)
  {
    const mult = Math.pow(1.25, t - 1);
    map.set(t, {
      targetT1: baselineT1 * mult,
      targetT100: baselineT100 * mult,
    });
  }
  return map;
}

function solveMhpPlan(targetT1, targetT100)
{
  const { B: idealB } = fitMhpBM({ Fm: F, T1: targetT1, T100: targetT100 });
  const chosen = chooseRoundedBAndM({ Fm: F, targetT1, targetT100, idealB });
  return {
    targetT1,
    targetT100,
    B: chosen.B,
    M: chosen.M,
    achievedT1: chosen.T1,
  };
}

function writeEnemiesJson(data)
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

function main()
{
  const apply = process.argv.includes('--apply');
  const dry = process.argv.includes('--dry-run') || apply === false;

  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));

  const baselineT1 = totalMhpAt(TIER1_MHP_BASE, TIER1_MHP_INNER, 1);
  const baselineT100 = totalMhpAt(TIER1_MHP_BASE, TIER1_MHP_INNER, 100);
  const vt10Mult = Math.pow(1.25, 10 - 1);
  const unscaledVt10L100 = baselineT100 * vt10Mult;
  const ladderScale = MASTER_VT10_L100_TARGET / unscaledVt10L100;
  const scaledBaselineT1 = baselineT1 * ladderScale;
  const scaledBaselineT100 = baselineT100 * ladderScale;

  const masterBudget1 = Math.max(MIN_TIER1_STAT_BUDGET, MASTER_TEMPLATE_KS.reduce((a, b) => a + b, 0));
  const petBudget1 = Math.max(MIN_TIER1_STAT_BUDGET, PET_TEMPLATE_KS.reduce((a, b) => a + b, 0));

  const masterKsByTier = buildKsByTier(MASTER_TEMPLATE_KS, masterBudget1, BUDGET_STEP);
  const petKsByTier = buildKsByTier(PET_TEMPLATE_KS, petBudget1, BUDGET_STEP);
  const mhpTargets = buildMhpTargetPlans(scaledBaselineT1, scaledBaselineT100);

  const masterMhpByTier = new Map();
  const petMhpByTier = new Map();
  for (let t = 1; t <= 10; t++)
  {
    const targets = mhpTargets.get(t);
    masterMhpByTier.set(t, solveMhpPlan(targets.targetT1, targets.targetT100));
    petMhpByTier.set(
      t,
      solveMhpPlan(
        targets.targetT1 * PET_MHP_FRACTION_OF_MASTER_TARGETS,
        targets.targetT100 * PET_MHP_FRACTION_OF_MASTER_TARGETS
      )
    );
  }

  const report = [];

  for (const { masterId, petId, virtualTier } of PAIRS)
  {
    const master = data[masterId];
    const pet = data[petId];
    if (!master || !pet) throw new Error(`Missing master ${masterId} or pet ${petId}`);

    if (parseLevel(master.note || '') === null) throw new Error(`Master ${masterId} missing <level>`);
    if (parseLevel(pet.note || '') === null) throw new Error(`Pet ${petId} missing <level>`);

    const mhpMaster = masterMhpByTier.get(virtualTier);
    const mhpPet = petMhpByTier.get(virtualTier);
    const mKs = masterKsByTier.get(virtualTier);
    const pKs = petKsByTier.get(virtualTier);
    if (!mhpMaster || !mhpPet || !mKs || !pKs) throw new Error(`Missing plan for virtual tier ${virtualTier}`);

    report.push({
      virtualTier,
      masterId,
      petId,
      mhpMaster,
      mhpPet,
      mKs,
      pKs,
    });

    if (apply)
    {
      applyMhpAndSix(master, mhpMaster, mKs, F);
      applyMhpAndSix(pet, mhpPet, pKs, F);
    }
  }

  console.log(apply ? 'APPLY: wrote Enemies.json' : 'DRY RUN (pass --apply to save)');
  console.log(
    `F=${F}, legacy baseline L1=${baselineT1.toFixed(2)} L100=${baselineT100.toFixed(2)} | ladderScale=${ladderScale.toFixed(6)} scaled L1=${scaledBaselineT1.toFixed(2)} L100=${scaledBaselineT100.toFixed(2)}`
  );
  console.log(`master vt10 L100 target=${MASTER_VT10_L100_TARGET}, pet MHP = ${PET_MHP_FRACTION_OF_MASTER_TARGETS} * master tier targets`);
  console.log('');

  for (const r of report)
  {
    console.log(
      `pair vt=${r.virtualTier} master=${r.masterId} pet=${r.petId} | master MHP B=${r.mhpMaster.B} M=${formatMhpMultiplier(r.mhpMaster.M)} | pet MHP B=${r.mhpPet.B} M=${formatMhpMultiplier(r.mhpPet.M)} | master ks sum=${r.mKs.reduce((a, b) => a + b, 0)} pet ks sum=${r.pKs.reduce((a, b) => a + b, 0)}`
    );
    console.log(`  master ks: ${r.mKs.map(formatQuarter).join(', ')}`);
    console.log(`  pet ks:    ${r.pKs.map(formatQuarter).join(', ')}`);
    console.log('');
  }

  if (apply) writeEnemiesJson(data);
}

main();
