import { readFileSync, writeFileSync } from 'fs';

const configPath = '/mnt/exdrive/dev/gaming/ca/chef-adventure/data/config.sdp.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { sdps } = config;

function allPanels(sgKey) {
  return sdps.filter(s => s.mastery?.subgroupKey === sgKey).sort((a, b) => a.mastery.subgroupTier - b.mastery.subgroupTier);
}
function panel(sgKey, tier) {
  return sdps.find(s => s.mastery?.subgroupKey === sgKey && s.mastery.subgroupTier === tier);
}
function remove(p, key) { if (p) p.panelParameters = p.panelParameters.filter(pp => pp.parameterKey !== key); }
function add(p, key, perRank, isFlat, isCore = false) {
  if (!p) return;
  remove(p, key);
  p.panelParameters.push({ parameterKey: key, perRank, isFlat, isCore });
}
function setCore(p, key, val) { if (!p) return; const pp = p.panelParameters.find(pp => pp.parameterKey === key); if (pp) pp.isCore = val; }
function setCoreSg(sgKey, key, val) { for (const p of allPanels(sgKey)) setCore(p, key, val); }
function jaggedCycle(sgKey, key, keepTiers) {
  for (const p of allPanels(sgKey)) {
    if (!keepTiers.has(p.mastery.subgroupTier)) remove(p, key);
    else setCore(p, key, false);
  }
}

// ─── undead-ghosty: mat UP + mhp DOWN; def cycles (T4,T6,T8,T9,T10) ──────────
// eva UP cycling: add T3,T5,T7,T9,T10 (not currently present, gentle scaling)
// existing cycling: mmp UP (odd tiers), mcr/tgr/grd/cev DOWN — keep as-is
{
  setCoreSg('undead-ghosty', 'mat', true);
  setCoreSg('undead-ghosty', 'mhp', true);
  jaggedCycle('undead-ghosty', 'def', new Set([4, 6, 8, 9, 10]));

  const evaVals = { 3:0.2, 5:0.25, 7:0.3, 9:0.35, 10:0.5 };
  for (const [t, v] of Object.entries(evaVals)) add(panel('undead-ghosty', Number(t)), 'eva', v, false, false);
}

// ─── undead-wisp: mat UP + mhp DOWN; def + grd cycle; she cycles UP ────────────
// def cycles: keep T4,T6,T8,T9,T10
// grd already on T3,T10 — keep as cycling (already <7)
// she UP cycling: add T3,T5,T7,T9,T10 — shield effectiveness bonus
// remove ser (wrong param), keep cri/cdm/hit/cev/cdr cycling as-is
{
  setCoreSg('undead-wisp', 'mat', true);
  setCoreSg('undead-wisp', 'mhp', true);
  jaggedCycle('undead-wisp', 'def', new Set([4, 6, 8, 9, 10]));

  // remove ser (not what we want)
  for (const p of allPanels('undead-wisp')) remove(p, 'ser');

  const sheVals = { 3:0.2, 5:0.25, 7:0.3, 9:0.35, 10:0.5 };
  for (const [t, v] of Object.entries(sheVals)) add(panel('undead-wisp', Number(t)), 'she', v, false, false);
}

// ─── reptile-lamia: mat UP + agi DOWN; mhp + def cycle; cri/cdm stay cycling ──
// mhp cycles: keep T4,T6,T8,T9,T10
// def cycles: keep T3,T5,T7,T9,T10
// agi DOWN core: not currently present — add to every panel with gentle scaling
// cri already cycling (odd tiers T1-T9) — keep, just ensure not core
// cdr already cycling (even T2-T8) — keep
// cdm on T10 — fine
// remove ser (tiny flat value, meaningless)
{
  setCoreSg('reptile-lamia', 'mat', true);
  jaggedCycle('reptile-lamia', 'mhp', new Set([4, 6, 8, 9, 10]));
  jaggedCycle('reptile-lamia', 'def', new Set([3, 5, 7, 9, 10]));
  for (const p of allPanels('reptile-lamia')) remove(p, 'ser');

  const agiVals = { 1:-0.3, 2:-0.3, 3:-0.35, 4:-0.35, 5:-0.4, 6:-0.4, 7:-0.45, 8:-0.45, 9:-0.5, 10:-0.6 };
  for (const p of allPanels('reptile-lamia')) {
    add(p, 'agi', agiVals[p.mastery.subgroupTier], false, true);
  }
}

// ─── aquatic-polliwog: mat UP + def DOWN; mhp cycles; agi DOWN cycling ─────────
// mhp cycles: keep T4,T6,T8,T9,T10
// agi DOWN cycling: add T3,T5,T7,T9,T10 (immobile frog)
// existing cycling mdf/cdm/mmp — keep as-is
{
  setCoreSg('aquatic-polliwog', 'mat', true);
  setCoreSg('aquatic-polliwog', 'def', true);
  jaggedCycle('aquatic-polliwog', 'mhp', new Set([4, 6, 8, 9, 10]));

  const agiVals = { 3:-0.2, 5:-0.25, 7:-0.3, 9:-0.35, 10:-0.5 };
  for (const [t, v] of Object.entries(agiVals)) add(panel('aquatic-polliwog', Number(t)), 'agi', v, false, false);
}

// ─── plant-trap: mat UP + agi DOWN; mhp + def cycle ────────────────────────────
// mhp cycles: keep T4,T6,T8,T9,T10
// def cycles: keep T3,T5,T7,T9,T10
// agi DOWN core: not currently present — add to every panel
// existing cycling: mmp UP, tgr/grd/cev/mcr DOWN — keep as-is
{
  setCoreSg('plant-trap', 'mat', true);
  jaggedCycle('plant-trap', 'mhp', new Set([4, 6, 8, 9, 10]));
  jaggedCycle('plant-trap', 'def', new Set([3, 5, 7, 9, 10]));

  const agiVals = { 1:-0.3, 2:-0.3, 3:-0.35, 4:-0.35, 5:-0.4, 6:-0.4, 7:-0.45, 8:-0.45, 9:-0.5, 10:-0.6 };
  for (const p of allPanels('plant-trap')) {
    add(p, 'agi', agiVals[p.mastery.subgroupTier], false, true);
  }
}

writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log('Done.');
