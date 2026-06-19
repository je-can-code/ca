import { readFileSync, writeFileSync } from 'fs';

const configPath = '/mnt/exdrive/dev/gaming/ca/chef-adventure/data/config.sdp.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { sdps } = config;

function panel(sgKey, tier) {
  return sdps.find(s => s.mastery?.subgroupKey === sgKey && s.mastery.subgroupTier === tier);
}

function allPanels(sgKey) {
  return sdps.filter(s => s.mastery?.subgroupKey === sgKey).sort((a, b) => a.mastery.subgroupTier - b.mastery.subgroupTier);
}

function remove(p, key) { if (p) p.panelParameters = p.panelParameters.filter(pp => pp.parameterKey !== key); }
function addParam(p, key, perRank, isFlat, isCore = false) { if (!p) return; remove(p, key); p.panelParameters.push({ parameterKey: key, perRank, isFlat, isCore }); }
function setCore(p, key, isCore) { if (!p) return; const pp = p.panelParameters.find(pp => pp.parameterKey === key); if (pp) pp.isCore = isCore; }

function setCoreSg(sgKey, key, isCore) { for (const p of allPanels(sgKey)) setCore(p, key, isCore); }

// Jagged cycling: remove param from early tiers, keep mid-to-late.
// keepTiers = set of tiers that KEEP the param (typically 5 panels, mid-to-late)
function jaggedCycle(sgKey, key, keepTiers) {
  for (const p of allPanels(sgKey)) {
    const t = p.mastery.subgroupTier;
    if (!keepTiers.has(t)) remove(p, key);
    else setCore(p, key, false);
  }
}

// ─── undead-armor: def UP + mat DOWN; mhp cycles (keep T4,T6,T8,T9,T10) ──────
setCoreSg('undead-armor', 'def', true);
setCoreSg('undead-armor', 'mat', true);
jaggedCycle('undead-armor', 'mhp', new Set([4, 6, 8, 9, 10]));

// ─── undead-reborn: mdf UP + atk DOWN; agi cycles (keep T4,T6,T7,T9,T10) ─────
setCoreSg('undead-reborn', 'mdf', true);
setCoreSg('undead-reborn', 'atk', true);
jaggedCycle('undead-reborn', 'agi', new Set([4, 6, 7, 9, 10]));

// ─── plant-fungus: atk UP + pdr DOWN; mdr cycles (keep T4,T5,T7,T9,T10) ──────
setCoreSg('plant-fungus', 'atk', true);
setCoreSg('plant-fungus', 'pdr', true);
jaggedCycle('plant-fungus', 'mdr', new Set([4, 5, 7, 9, 10]));

// ─── plant-dryad: mdf UP + atk DOWN; cdm cycles (keep T4,T6,T8,T9,T10) ───────
setCoreSg('plant-dryad', 'mdf', true);
setCoreSg('plant-dryad', 'atk', true);
jaggedCycle('plant-dryad', 'cdm', new Set([4, 6, 8, 9, 10]));

// ─── plant-treant: def UP + cri DOWN; mat cycles (keep T3,T5,T7,T9,T10) ───────
setCoreSg('plant-treant', 'def', true);
setCoreSg('plant-treant', 'cri', true);
jaggedCycle('plant-treant', 'mat', new Set([3, 5, 7, 9, 10]));

// ─── reptile-salamander: hrg UP + mat DOWN; cri cycles (keep T4,T6,T8,T9,T10) ─
setCoreSg('reptile-salamander', 'hrg', true);
setCoreSg('reptile-salamander', 'mat', true);
jaggedCycle('reptile-salamander', 'cri', new Set([4, 6, 8, 9, 10]));

// ─── aquatic-cephalopod: rec UP + agi DOWN; mat + cri cycle ──────────────────
// Remove agi from all first (added incorrectly in v1), then re-add properly.
// mat cycles: keep T4,T6,T8,T9,T10 (already core, demote + trim)
// cri cycles: keep T3,T5,T7,T9,T10
// agi as core DOWN on every panel — not currently present, add with scaling values
{
  const agiVals = { 1:-0.3, 2:-0.3, 3:-0.35, 4:-0.35, 5:-0.4, 6:-0.4, 7:-0.45, 8:-0.45, 9:-0.5, 10:-0.6 };
  for (const p of allPanels('aquatic-cephalopod')) {
    remove(p, 'agi');
    addParam(p, 'agi', agiVals[p.mastery.subgroupTier], false, true);
  }
  setCoreSg('aquatic-cephalopod', 'rec', true);
  jaggedCycle('aquatic-cephalopod', 'mat', new Set([4, 6, 8, 9, 10]));
  jaggedCycle('aquatic-cephalopod', 'cri', new Set([3, 5, 7, 9, 10]));
}

// ─── slime-jelly: mrg UP + cdm DOWN; mdf cycles (keep T4,T5,T7,T9,T10) ───────
setCoreSg('slime-jelly', 'mrg', true);
setCoreSg('slime-jelly', 'cdm', true);
jaggedCycle('slime-jelly', 'mdf', new Set([4, 5, 7, 9, 10]));

// ─── slime-aerial: mrg UP + atk DOWN; mdf cycles (keep T4,T6,T8,T9,T10) ──────
setCoreSg('slime-aerial', 'mrg', true);
setCoreSg('slime-aerial', 'atk', true);
jaggedCycle('slime-aerial', 'mdf', new Set([4, 6, 8, 9, 10]));

// ─── slime-cube: mhp UP + atk DOWN; mat + mdf cycle ─────────────────────────
// atk currently present as a positive bonus on some panels — replace with negative core DOWN.
// mat cycles: keep T4,T6,T8,T9,T10
// mdf cycles: keep T3,T5,T7,T9,T10
{
  const atkVals = { 1:-0.3, 2:-0.3, 3:-0.35, 4:-0.35, 5:-0.4, 6:-0.4, 7:-0.45, 8:-0.45, 9:-0.5, 10:-0.6 };
  for (const p of allPanels('slime-cube')) {
    setCore(p, 'mhp', true);
    remove(p, 'atk');
    addParam(p, 'atk', atkVals[p.mastery.subgroupTier], false, true);
  }
  jaggedCycle('slime-cube', 'mat', new Set([4, 6, 8, 9, 10]));
  jaggedCycle('slime-cube', 'mdf', new Set([3, 5, 7, 9, 10]));
}

// ─── aquatic-fish: agi UP + mhp DOWN; def cycles (keep T4,T5,T7,T9,T10) ──────
setCoreSg('aquatic-fish', 'agi', true);
setCoreSg('aquatic-fish', 'mhp', true);
jaggedCycle('aquatic-fish', 'def', new Set([4, 5, 7, 9, 10]));

writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log('Done.');
