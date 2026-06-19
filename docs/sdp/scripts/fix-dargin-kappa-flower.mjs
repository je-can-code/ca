import { readFileSync, writeFileSync } from 'fs';

const configPath = '/mnt/exdrive/dev/gaming/ca/chef-adventure/data/config.sdp.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { sdps } = config;

function panel(sgKey, tier) {
  return sdps.find(s => s.mastery?.subgroupKey === sgKey && s.mastery.subgroupTier === tier);
}
function remove(p, key) { if (p) p.panelParameters = p.panelParameters.filter(pp => pp.parameterKey !== key); }
function add(p, key, perRank, isFlat = false, isCore = false) {
  if (!p) return;
  remove(p, key);
  p.panelParameters.push({ parameterKey: key, perRank, isFlat, isCore });
}
function keep(p, ...keys) {
  if (!p) return;
  p.panelParameters = p.panelParameters.filter(pp => keys.includes(pp.parameterKey));
}

// ─── reptile-dargin ───────────────────────────────────────────────────────────
// Core every panel: mhp UP + mat DOWN (already present, keep values)
// Layout:
// T1 [3]: mhp, mat, def
// T2 [4]: mhp, mat, mrf, cev
// T3 [3]: mhp, mat, def
// T4 [4]: mhp, mat, mrf, mev
// T5 [4]: mhp, mat, def, cdm
// T6 [5]: mhp, mat, mrf, cev, atk
// T7 [5]: mhp, mat, def, cri, cev
// T8 [5]: mhp, mat, mrf, cdm, mev
// T9 [5]: mhp, mat, def, cri, atk
// T10 [6]: mhp, mat, mrf, cdm, cev, atk

// Existing value scales (interpolated where missing):
const def  = { 1:0.9, 3:1.0, 5:1.05, 7:1.15, 9:1.25 }; // odd tiers only
const mrf  = { 2:0.341, 4:0.378, 6:0.416, 8:0.454, 10:0.605 }; // even tiers only
const cev  = { 2:0.3, 6:0.35, 7:0.4, 10:0.45 };
const mev  = { 4:-0.2, 8:-0.25, 9:-0.3 };
const cdm  = { 5:-0.25, 8:-0.3, 10:-0.35 };
const cri  = { 7:-0.25, 9:-0.3 }; // repurposed from T3/T8 → T7/T9
const atk  = { 6:0.6, 9:0.65, 10:0.7 };

const darginLayout = {
  1:  ['mhp','mat','def'],
  2:  ['mhp','mat','mrf','cev'],
  3:  ['mhp','mat','def'],
  4:  ['mhp','mat','mrf','mev'],
  5:  ['mhp','mat','def','cdm'],
  6:  ['mhp','mat','mrf','cev','atk'],
  7:  ['mhp','mat','def','cri','cev'],
  8:  ['mhp','mat','mrf','cdm','mev'],
  9:  ['mhp','mat','def','cri','atk'],
  10: ['mhp','mat','mrf','cdm','cev','atk'],
};

const darginVals = { def, mrf, cev, mev, cdm, cri, atk };

for (const [tier, params] of Object.entries(darginLayout)) {
  const t = Number(tier);
  const p = panel('reptile-dargin', t);
  if (!p) continue;
  // rebuild panelParameters from scratch for this tier
  p.panelParameters = [];
  for (const key of params) {
    const isCore = key === 'mhp' || key === 'mat';
    // get existing perRank from current data or interpolated table
    if (key === 'mhp') {
      // existing scale: 0.45 + 0.05 per tier roughly, T10=1.0
      const v = key === 'mhp' ? [0,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,1.0][t] : null;
      add(p, key, v, false, true);
    } else if (key === 'mat') {
      const v = t <= 4 ? -0.3 : t <= 6 ? -0.35 : t <= 9 ? -0.4 : -0.5;
      add(p, key, v, false, true);
    } else {
      const vals = darginVals[key];
      const v = vals?.[t];
      if (v !== undefined) add(p, key, v, false, false);
    }
  }
}

// ─── aquatic-kappa ────────────────────────────────────────────────────────────
// Core: luk UP + exr UP (generalist, keep existing values)
// Cycling pool: cev, grd, cnt, eva, dor, gdr
// Layout:
// T1 [2]: luk, exr
// T2 [3]: luk, exr, cev
// T3 [3]: luk, exr, grd
// T4 [4]: luk, exr, cev, dor
// T5 [4]: luk, exr, grd, cnt
// T6 [4]: luk, exr, cev, gdr
// T7 [5]: luk, exr, grd, cnt, dor
// T8 [5]: luk, exr, cev, eva, gdr
// T9 [5]: luk, exr, grd, cnt, eva
// T10 [6]: luk, exr, cev, grd, cnt, eva

// Cycling values — small, fitting for a generalist annoyance pool
const kappaVals = {
  cev: { 2:0.3, 4:0.35, 6:0.4, 8:0.45, 10:0.5 },
  grd: { 3:0.3, 5:0.35, 7:0.4, 9:0.45, 10:0.5 },
  cnt: { 5:0.1, 7:0.15, 9:0.2, 10:0.3 },
  eva: { 8:0.2, 9:0.25, 10:0.35 },
  dor: { 4:0.3, 7:0.4, 10:null }, // not in T10
  gdr: { 6:0.3, 8:0.35, 10:null }, // not in T10
};

const kappaLayout = {
  1:  ['luk','exr'],
  2:  ['luk','exr','cev'],
  3:  ['luk','exr','grd'],
  4:  ['luk','exr','cev','dor'],
  5:  ['luk','exr','grd','cnt'],
  6:  ['luk','exr','cev','gdr'],
  7:  ['luk','exr','grd','cnt','dor'],
  8:  ['luk','exr','cev','eva','gdr'],
  9:  ['luk','exr','grd','cnt','eva'],
  10: ['luk','exr','cev','grd','cnt','eva'],
};

// Existing luk/exr values
const kappaLuk = [0,1.0,1.2,1.5,1.5,1.6,1.7,1.8,1.9,2.0,2.5];
const kappaExr = { flat: true, vals: [0,1,1,1,1,1,1,1,1,2,5] };

for (const [tier, params] of Object.entries(kappaLayout)) {
  const t = Number(tier);
  const p = panel('aquatic-kappa', t);
  if (!p) continue;
  p.panelParameters = [];
  for (const key of params) {
    if (key === 'luk') { add(p, 'luk', kappaLuk[t], false, true); }
    else if (key === 'exr') { add(p, 'exr', kappaExr.vals[t], true, true); }
    else {
      const v = kappaVals[key]?.[t];
      if (v !== null && v !== undefined) add(p, key, v, false, false);
    }
  }
}

// ─── plant-flower T10: trim from 8 → 6, drop ser and pha ─────────────────────
const flowerT10 = panel('plant-flower', 10);
remove(flowerT10, 'ser');
remove(flowerT10, 'pha');

writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log('Done.');
