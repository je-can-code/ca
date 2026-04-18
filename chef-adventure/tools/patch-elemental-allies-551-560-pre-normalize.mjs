/**
 * Elemental **ally** decade **551–560** (`monsterFamilyIcon:57`): encounter order, not a 1→10 ladder.
 * Each row gets its **own** six-tag shape (Σk = 25); after prep, normalize with **`--flat-tier 4`** so every id
 * uses **tier‑4** MHP targets and stat budget while keeping per-element stat **personality**.
 *
 * Stat intent: **551** earth support (heavier **mdf/luk**, lighter **def**); **552** water glass cannon (**mat** over **mdf**);
 * **553** fire bruiser; **554** wind thief/skirmisher; **555–560** neutral placeholders until named.
 *
 * Do **not** run `normalize-decade-tiers` on **561–570** until the rare/elite/boss pass (boss + lesser counterpart rework).
 *
 * Then:
 *   node normalize-decade-tiers.mjs --from 551 --to 560 --tier-base 550 --f 2.5 --budget-step 5 --flat-tier 4 --mhp-mult 552:0.72,554:0.68,553:1.24 --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const MHP_F = 2.5;

const SIX = ['atkBuffPlus', 'defBuffPlus', 'matBuffPlus', 'mdfBuffPlus', 'agiBuffPlus', 'lukBuffPlus'];

const GROWTH_TAGS = ['mhpBuffPlus', ...SIX];

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

function stripGrowth(note)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  for (const tag of GROWTH_TAGS)
  {
    const lineRe = new RegExp(`\\n?<${tag}:\\[[^\\]]*\\]>\\s*`, 'gi');
    n = n.replace(lineRe, '\n');
  }
  return n.replace(/\n{3,}/g, '\n\n').trimEnd();
}

function setLevel(note, level)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  if (/<level:/i.test(n)) return n.replace(/^<level:[^>]+>/im, `<level:${level}>`);
  return `<level:${level}>\n${n}`;
}

function insertGrowthAfterIcon57(note, growthBlock)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  if (/<monsterFamilyIcon:57>/i.test(n) === false) throw new Error('Expected <monsterFamilyIcon:57>.');
  const iconRe = /<monsterFamilyIcon:57>\s*\n?/i;
  const m = n.match(iconRe);
  if (!m) throw new Error('monsterFamilyIcon:57 match failed.');
  const at = m.index + m[0].length;
  return n.slice(0, at) + growthBlock + n.slice(at);
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

const ROWS =
[
  { id: 551, name: 'TBD Earthie ', ks: [6, 4.5, 2, 8, 2, 2.5], B: 220, M: 3.9, level: 30 },
  { id: 552, name: 'Aqualock', ks: [2.5, 3.5, 7, 4.5, 4.5, 3], B: 220, M: 3.9, level: 30 },
  { id: 553, name: 'Cynder', ks: [7, 6.5, 3, 5.5, 2, 1], B: 220, M: 3.9, level: 45 },
  { id: 554, name: 'Skye', ks: [4, 3.5, 2.5, 3.5, 9, 2.5], B: 220, M: 3.9, level: 70 },
  { id: 555, name: '=== TBD Elementals', ks: [5, 5, 4, 5, 4, 2], B: 220, M: 3.9, level: 30 },
  { id: 556, name: '=== TBD Elementals', ks: [5, 5, 4, 5, 4, 2], B: 220, M: 3.9, level: 30 },
  { id: 557, name: '=== TBD Elementals', ks: [5, 5, 4, 5, 4, 2], B: 220, M: 3.9, level: 30 },
  { id: 558, name: '=== TBD Elementals', ks: [5, 5, 4, 5, 4, 2], B: 220, M: 3.9, level: 30 },
  { id: 559, name: '=== TBD Elementals', ks: [5, 5, 4, 5, 4, 2], B: 220, M: 3.9, level: 30 },
  { id: 560, name: '=== TBD Elementals', ks: [5, 5, 4, 5, 4, 2], B: 220, M: 3.9, level: 30 },
];

function applyRow(data, row)
{
  assertSum25(row.ks, `elemental ${row.id}`);
  const e = data[row.id];
  if (!e) throw new Error(`Missing ${row.id}`);
  e.name = row.name;

  let note = stripGrowth(e.note || '');
  note = setLevel(note, row.level);
  if (/<monsterFamilyIcon:57>/i.test(note) === false)
  {
    const lv = note.match(/^<level:\d+>\s*\n/i);
    if (lv) note = note.replace(lv[0], `${lv[0]}<monsterFamilyIcon:57>\n`);
    else note = `<monsterFamilyIcon:57>\n${note}`;
  }

  const growth = `<mhpBuffPlus:[${mhpInner(row.M)}]>\n${row.ks.map((k, i) => `<${SIX[i]}:[(a.level * ${formatQuarter(k)})]>`).join('\n')}\n`;
  note = insertGrowthAfterIcon57(note, growth);
  e.note = `${note}`.trimEnd() + '\n';

  const p = e.params.slice();
  p[0] = row.B;
  for (let i = 0; i < 6; i++) p[2 + i] = Math.round(row.ks[i] * 4);
  e.params = p;
}

function main()
{
  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));
  for (const row of ROWS)
  {
    applyRow(data, row);
  }
  writeEnemyArray(data);
  console.log('Wrote elemental allies 551–560 pre-flat-tier-4 patch.');
}

main();
