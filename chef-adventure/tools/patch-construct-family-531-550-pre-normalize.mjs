/**
 * Prepare construct-adjunct decades **531–540** (homunculi / puppet) and **541–550** (runebound / runic orb).
 * Tier-bases **530** and **540**; same exponent **F=2.5** and **budget-step 5** as other construct families.
 * Tier‑1 shapes: **531 Puppet** — mixed striker, favors **agi**; **541 Runic Orb** — magic turret, heavy **mat/mdf**.
 * Preserves existing `<sdpDropData:…>` lines. Skips rows that already have `<mhpBuffPlus:`> (safe re-run).
 *
 * Then:
 *   node normalize-decade-tiers.mjs --from 531 --to 540 --tier-base 530 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 541 --to 550 --tier-base 540 --f 2.5 --budget-step 5 --apply
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

function jobTailLines(oldNote)
{
  const lines = String(oldNote || '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  for (const line of lines)
  {
    if (/^<(sdpDropData|drops|hideFromMonsterpedia):/i.test(line.trim()))
    {
      out.push(line);
    }
  }
  return out.length ? `${out.join('\n')}\n` : '';
}

const HOMUNCULI =
[
  { id: 531, name: 'Puppet', ks: [5, 4, 5, 4, 6, 1], B: 110, M: 2.15, level: 12 },
  { id: 532, name: '=== TBD Homunculus', tier: 2 },
  { id: 533, name: '=== TBD Homunculus', tier: 3 },
  { id: 534, name: '=== TBD Homunculus', tier: 4 },
  { id: 535, name: '=== TBD Homunculus', tier: 5 },
  { id: 536, name: '=== TBD Homunculus', tier: 6 },
  { id: 537, name: '=== TBD Homunculus', tier: 7 },
  { id: 538, name: '=== TBD Homunculus', tier: 8 },
  { id: 539, name: '=== TBD Homunculus', tier: 9 },
  { id: 540, name: '=== TBD Homunculus', tier: 10 },
];

const RUNEBOUND =
[
  { id: 541, name: 'Runic Orb', ks: [1.5, 5, 8.5, 7.5, 1.5, 1], B: 95, M: 2, level: 9 },
  { id: 542, name: '=== TBD Runebound', tier: 2 },
  { id: 543, name: '=== TBD Runebound', tier: 3 },
  { id: 544, name: '=== TBD Runebound', tier: 4 },
  { id: 545, name: '=== TBD Runebound', tier: 5 },
  { id: 546, name: '=== TBD Runebound', tier: 6 },
  { id: 547, name: '=== TBD Runebound', tier: 7 },
  { id: 548, name: '=== TBD Runebound', tier: 8 },
  { id: 549, name: '=== TBD Runebound', tier: 9 },
  { id: 550, name: '=== TBD Runebound', tier: 10 },
];

function applyAdjunctRow(data, row, label)
{
  const e = data[row.id];
  if (!e) throw new Error(`Missing ${row.id}`);
  e.name = row.name;
  if (row.ks == null && /<mhpBuffPlus:/i.test(String(e.note || ''))) return;

  const level = row.level != null ? row.level : Math.min(90, 10 + row.tier * 8);
  if (row.ks) assertSum25(row.ks, `${label} ${row.id}`);
  const old = e.note || '';
  let head = `<level:${level}>\n<hideFromMonsterpedia>\n<monsterFamilyIcon:56>\n`;
  head += '<knockbackResist:100>\n';
  const growth = row.ks
    ? `<mhpBuffPlus:[${mhpInner(row.M)}]>\n${row.ks.map((k, i) => `<${SIX[i]}:[(a.level * ${formatQuarter(k)})]>`).join('\n')}\n`
    : `${PLACEHOLDER_MHP}\n${PLACEHOLDER_SIX}\n`;
  e.note = `${head}${growth}${jobTailLines(old)}`.trimEnd() + '\n';
  const p = e.params.slice();
  if (row.ks)
  {
    p[0] = row.B;
    for (let i = 0; i < 6; i++) p[2 + i] = Math.round(row.ks[i] * 4);
  }
  else
  {
    p[0] = 180;
    for (let i = 2; i <= 7; i++) p[i] = 10;
  }
  e.params = p;
}

function main()
{
  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));

  for (const row of HOMUNCULI)
  {
    applyAdjunctRow(data, row, 'homunculus');
  }

  for (const row of RUNEBOUND)
  {
    applyAdjunctRow(data, row, 'runebound');
  }

  writeEnemyArray(data);
  console.log('Wrote construct-adjunct 531–550 pre-normalize patch.');
}

main();
