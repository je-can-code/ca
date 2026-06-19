import { readFileSync, writeFileSync } from 'fs';

const configPath = '/mnt/exdrive/dev/gaming/ca/chef-adventure/data/config.sdp.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { sdps } = config;

function panel(sgKey, tier) {
  return sdps.find(s => s.mastery?.subgroupKey === sgKey && s.mastery.subgroupTier === tier);
}

function removeParam(p, key) {
  if (!p) return;
  p.panelParameters = p.panelParameters.filter(pp => pp.parameterKey !== key);
}

function addParam(p, key, perRank, isFlat, isCore = false) {
  if (!p) return;
  removeParam(p, key); // prevent duplicates
  p.panelParameters.push({ parameterKey: key, perRank, isFlat, isCore });
}

function setCore(p, key, isCore) {
  if (!p) return;
  const pp = p.panelParameters.find(pp => pp.parameterKey === key);
  if (pp) pp.isCore = isCore;
}

// ─── aquatic-crab ─────────────────────────────────────────────────────────────
// Core: grd UP + atk DOWN. def demoted to cycling ~5/10 (keep T4,T6,T8,T9,T10).
// mhp trimmed 8→4 (keep T4,T7,T8,T10).

const crabDefKeep = new Set([4, 6, 8, 9, 10]);
const crabMhpKeep = new Set([4, 7, 8, 10]);

for (let t = 1; t <= 10; t++) {
  const p = panel('aquatic-crab', t);
  if (!p) continue;
  setCore(p, 'def', false);
  if (!crabDefKeep.has(t)) removeParam(p, 'def');
  if (!crabMhpKeep.has(t)) removeParam(p, 'mhp');
}

// ─── beast-rat ────────────────────────────────────────────────────────────────
// Swap core: dor becomes core (every panel), luk demotes to cycling.
// dor is currently missing from T1 and T9 — add it there at matching values.
// luk stays on all panels (just isCore:false now). dor gets isCore:true.
// Values: dor already present on T2-T8, T10. Need to add T1 and T9.
// T1 neighbors: T1 sdr=0.3, match dor≈0.3 (same as T2). T9: dor≈0.5 (same as T7/T8).

const ratDorValues = { 1: 0.3, 2: 0.4, 3: 0.4, 4: 0.4, 5: 0.5, 6: 0.5, 7: 0.5, 8: 0.5, 9: 0.5, 10: 0.6 };

for (let t = 1; t <= 10; t++) {
  const p = panel('beast-rat', t);
  if (!p) continue;
  setCore(p, 'luk', false);
  removeParam(p, 'dor');
  addParam(p, 'dor', ratDorValues[t], true, true);
}

// ─── plant-fungus ─────────────────────────────────────────────────────────────
// cri 7/10 → 5/10. Currently on T1,T2,T3,T4,T6,T8,T10. Remove from T2 and T4.
// (keeps T1,T3,T6,T8,T10 = 5 panels, nicely spread)
removeParam(panel('plant-fungus', 2), 'cri');
removeParam(panel('plant-fungus', 4), 'cri');

// ─── slime-roper ──────────────────────────────────────────────────────────────
// cri 7/10 → 4/10. Currently on T1,T3,T5,T7,T8,T9,T10. Remove from T1, T5, T8.
// (keeps T3,T7,T9,T10 = 4 panels)
removeParam(panel('slime-roper', 1), 'cri');
removeParam(panel('slime-roper', 5), 'cri');
removeParam(panel('slime-roper', 8), 'cri');

// ─── plant-flower ─────────────────────────────────────────────────────────────
// cdm 9/10 → 4/10. Keep T4,T6,T9,T10. Remove from T2,T3,T5,T7,T8.
for (const t of [2, 3, 5, 7, 8]) removeParam(panel('plant-flower', t), 'cdm');

// ─── construct-puppet ─────────────────────────────────────────────────────────
// Core: mmp UP + mdf DOWN. mat cycles odd tiers (T1,T3,T5,T7,T9,T10). mhp cycles even tiers (T2,T4,T6,T8,T10).
// mrf trimmed 8→4: keep T5,T7,T9,T10 (already on T3-T10; remove T3,T4,T6,T8).
// Values carried from existing data.

const puppetMatValues  = { 1:1.2, 3:1.5, 5:1.8, 7:2.0, 9:2.2, 10:2.5 };
const puppetMhpValues  = { 2:-0.3, 4:-0.4, 6:-0.5, 8:-0.6, 10:-0.8 };

for (let t = 1; t <= 10; t++) {
  const p = panel('construct-puppet', t);
  if (!p) continue;

  // demote mat to cycling — remove from all, re-add only on odd+T10
  removeParam(p, 'mat');
  if (puppetMatValues[t] !== undefined) addParam(p, 'mat', puppetMatValues[t], false, false);

  // demote mhp to cycling — remove from all, re-add only on even+T10
  removeParam(p, 'mhp');
  if (puppetMhpValues[t] !== undefined) addParam(p, 'mhp', puppetMhpValues[t], false, false);

  // mmp and mdf remain core
  setCore(p, 'mmp', true);
  setCore(p, 'mdf', true);

  // mrf: keep T5,T7,T9,T10 only
  const mrfKeep = new Set([5, 7, 9, 10]);
  if (!mrfKeep.has(t)) removeParam(p, 'mrf');
}

// ─── deity-elemental ──────────────────────────────────────────────────────────
// New core: mat UP + mrg UP + mcr UP (MCR up = costs more = penalty).
// mmp, mhp, def, cev demoted to cycling, jagged escalation.
// mcr values (per-rank): scales with tier. As a cost-UP penalty, small values, positive perRank.
// Cycling pool presence (each ~5/10, jagged):
//   mmp: T2,T4,T5,T6,T8,T10 (6) — trim to 5: T2,T4,T6,T8,T10
//   mhp: T3,T5,T6,T7,T9,T10 (keeping 5)
//   def: T4,T6,T7,T8,T10 (5)
//   cev: T5,T7,T8,T9,T10 (5)
// T10 gets all 4 cycling = 7 params total.

// Existing mrg values from current panels (already on T2-T10):
const elemMrgValues = { 1:0.3, 2:0.3, 3:0.3, 4:0.4, 5:0.5, 6:0.5, 7:0.6, 8:0.7, 9:0.8, 10:1.0 };
// mcr (MCR UP = costs go up = negative for player = penalty):
const elemMcrValues = { 1:0.2, 2:0.2, 3:0.25, 4:0.25, 5:0.3, 6:0.3, 7:0.35, 8:0.35, 9:0.4, 10:0.5 };

// Cycling presence sets
const elemMmp = new Set([2, 4, 6, 8, 10]);
const elemMhp = new Set([3, 5, 6, 7, 9, 10]); // 6 panels — trim: keep T3,T5,T7,T9,T10
const elemMhpKeep = new Set([3, 5, 7, 9, 10]);
const elemDef = new Set([4, 6, 7, 8, 10]);
const elemCev = new Set([5, 7, 8, 9, 10]);

for (let t = 1; t <= 10; t++) {
  const p = panel('deity-elemental', t);
  if (!p) continue;

  // Set mat as core (already present)
  setCore(p, 'mat', true);

  // mrg: add to T1 (missing), set core everywhere
  removeParam(p, 'mrg');
  addParam(p, 'mrg', elemMrgValues[t], false, true);

  // mcr: add as core (new param)
  removeParam(p, 'mcr');
  addParam(p, 'mcr', elemMcrValues[t], false, true);

  // demote mmp to cycling
  removeParam(p, 'mmp');
  if (elemMmp.has(t)) {
    // use existing perRank scale: 0.5,0.7,0.9,1.0,1.2 mapped to our keep tiers T2,T4,T6,T8,T10
    const mmpScale = { 2:0.6, 4:0.7, 6:0.9, 8:1.0, 10:1.2 };
    addParam(p, 'mmp', mmpScale[t], false, false);
  }

  // demote mhp to cycling
  removeParam(p, 'mhp');
  if (elemMhpKeep.has(t)) {
    const mhpScale = { 3:-0.4, 5:-0.5, 7:-0.6, 9:-0.7, 10:-0.8 };
    addParam(p, 'mhp', mhpScale[t], false, false);
  }

  // demote def to cycling
  removeParam(p, 'def');
  if (elemDef.has(t)) {
    const defScale = { 4:-0.3, 6:-0.4, 7:-0.5, 8:-0.5, 10:-0.6 };
    addParam(p, 'def', defScale[t], false, false);
  }

  // demote cev to cycling
  removeParam(p, 'cev');
  if (elemCev.has(t)) {
    const cevScale = { 5:-0.4, 7:-0.5, 8:-0.5, 9:-0.5, 10:-0.6 };
    addParam(p, 'cev', cevScale[t], false, false);
  }
}

writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log('Done.');
