/**
 * Deity ladder **571–600** (icon **53**): three decades with tier‑1 seeds **Emotion**, **Kaiju**, **Devil**;
 * TBD rows get placeholder growth until named.
 * **561–570** (sin bosses / lesser counterparts) are intentionally **not** touched here — normalize after elite/boss work.
 *
 * Then:
 *   node normalize-decade-tiers.mjs --from 571 --to 580 --tier-base 570 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 581 --to 590 --tier-base 580 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 591 --to 600 --tier-base 590 --f 2.5 --budget-step 5 --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const MHP_F = 2.5;

const SIX = ['atkBuffPlus', 'defBuffPlus', 'matBuffPlus', 'mdfBuffPlus', 'agiBuffPlus', 'lukBuffPlus'];

const PLACEHOLDER_MHP = `<mhpBuffPlus:[(a.level ** ${MHP_F}) * 0.1]>`;
const PLACEHOLDER_SIX = [
  '<atkBuffPlus:[(a.level * 3)]>',
  '<defBuffPlus:[(a.level * 3)]>',
  '<matBuffPlus:[(a.level * 3)]>',
  '<mdfBuffPlus:[(a.level * 3)]>',
  '<agiBuffPlus:[(a.level * 3)]>',
  '<lukBuffPlus:[(a.level * 3)]>',
].join('\n');

function formatQuarter(n)
{
  const r = Math.round(n * 4) / 4;
  if (Number.isInteger(r)) return String(r);
  const s = r.toFixed(2);
  if (s.endsWith('0')) return s.slice(0, -1);
  return s;
}

function mhpInner(M)
{
  return `(a.level ** ${MHP_F}) * ${formatQuarter(M)}`;
}

function deityJobTail(oldNote)
{
  const lines = String(oldNote || '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  for (const line of lines)
  {
    if (/^<(sdpDropData|sdpPoints|cdmBuffPlus|aiTrait|prepare):/i.test(line.trim()))
    {
      out.push(line);
    }
  }
  return out.length ? `${out.join('\n')}\n` : '';
}

function assertSum25(ks, label)
{
  const s = ks.reduce((a, b) => a + b, 0);
  if (Math.abs(s - 25) > 1e-9) throw new Error(`${label}: ks sum ${s}, expected 25`);
}

function writeEnemyArray(data)
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

const ASPECT =
[
  { id: 571, name: 'Emotion', ks: [3, 4.5, 6.5, 7, 3, 1], B: 200, M: 3.2, level: 15 },
  { id: 572, name: '=== TBD Aspect', tier: 2 },
  { id: 573, name: '=== TBD Aspect', tier: 3 },
  { id: 574, name: '=== TBD Aspect', tier: 4 },
  { id: 575, name: '=== TBD Aspect', tier: 5 },
  { id: 576, name: '=== TBD Aspect', tier: 6 },
  { id: 577, name: '=== TBD Aspect', tier: 7 },
  { id: 578, name: '=== TBD Aspect', tier: 8 },
  { id: 579, name: '=== TBD Aspect', tier: 9 },
  { id: 580, name: '=== TBD Aspect', tier: 10 },
];

const SOVEREIGN =
[
  { id: 581, name: 'Kaiju', ks: [9, 7.5, 2, 3.5, 2, 1], B: 200, M: 3.35, level: 15 },
  { id: 582, name: '=== TBD Sovereign', tier: 2 },
  { id: 583, name: '=== TBD Sovereign', tier: 3 },
  { id: 584, name: '=== TBD Sovereign', tier: 4 },
  { id: 585, name: '=== TBD Sovereign', tier: 5 },
  { id: 586, name: '=== TBD Sovereign', tier: 6 },
  { id: 587, name: '=== TBD Sovereign', tier: 7 },
  { id: 588, name: '=== TBD Sovereign', tier: 8 },
  { id: 589, name: '=== TBD Sovereign', tier: 9 },
  { id: 590, name: '=== TBD Sovereign', tier: 10 },
];

const COVENANT =
[
  { id: 591, name: 'Devil', ks: [4.5, 5, 6, 6.5, 2, 1], B: 200, M: 3.5, level: 15 },
  { id: 592, name: '=== TBD Covenant', tier: 2 },
  { id: 593, name: '=== TBD Covenant', tier: 3 },
  { id: 594, name: '=== TBD Covenant', tier: 4 },
  { id: 595, name: '=== TBD Covenant', tier: 5 },
  { id: 596, name: '=== TBD Covenant', tier: 6 },
  { id: 597, name: '=== TBD Covenant', tier: 7 },
  { id: 598, name: '=== TBD Covenant', tier: 8 },
  { id: 599, name: '=== TBD Covenant', tier: 9 },
  { id: 600, name: '=== TBD Covenant', tier: 10 },
];

function applyRow(data, row)
{
  const e = data[row.id];
  if (!e) throw new Error(`Missing ${row.id}`);
  e.name = row.name;
  if (row.ks == null && /<mhpBuffPlus:/i.test(String(e.note || ''))) return;

  const level = row.level != null ? row.level : Math.min(92, 10 + row.tier * 8);
  if (row.ks) assertSum25(row.ks, `deity ${row.id}`);
  const old = e.note || '';
  const tail = deityJobTail(old);
  const growth = row.ks
    ? `<mhpBuffPlus:[${mhpInner(row.M)}]>\n${row.ks.map((k, i) => `<${SIX[i]}:[(a.level * ${formatQuarter(k)})]>`).join('\n')}\n`
    : `${PLACEHOLDER_MHP}\n${PLACEHOLDER_SIX}\n`;
  e.note = `<level:${level}>\n<monsterFamilyIcon:53>\n${growth}${tail}`.trimEnd() + '\n';

  const p = e.params.slice();
  if (row.ks)
  {
    p[0] = row.B;
    for (let i = 0; i < 6; i++) p[2 + i] = Math.round(row.ks[i] * 4);
  }
  else
  {
    p[0] = 200;
    for (let i = 2; i <= 7; i++) p[i] = 12;
  }
  e.params = p;
}

function main()
{
  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));
  for (const row of ASPECT) applyRow(data, row);
  for (const row of SOVEREIGN) applyRow(data, row);
  for (const row of COVENANT) applyRow(data, row);
  writeEnemyArray(data);
  console.log('Wrote deity aspect/sovereign/covenant 571–600 pre-normalize patch.');
}

main();
