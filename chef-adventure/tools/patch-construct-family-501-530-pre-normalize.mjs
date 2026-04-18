/**
 * Prepare construct family 501–530 for three `normalize-decade-tiers` passes (F=2.5, budget-step 5).
 * Decades: 501–510 Irongiant colossi (tier-base 500), 511–520 hazards (510), 521–530 robots (520).
 * Fills missing growth/MHP and `monsterFamilyIcon:56`. Stat shape comes from tier‑1 seeds only (no extra note text).
 * Placeholders: `=== TBD Golem` / `=== TBD Hazard` / `=== TBD Robot`. Named seeds: **501 Heated Titan**, **511–513**, **521 Bot**.
 * Hazards are static traps: **agi/luk = 0**; shell profile (**def/mdf** heavy, **atk/mat** light, Σk = 25).
 *
 * Then:
 *   node normalize-decade-tiers.mjs --from 501 --to 510 --tier-base 500 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 511 --to 520 --tier-base 510 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 521 --to 530 --tier-base 520 --f 2.5 --budget-step 5 --apply
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

function stripGrowth(note)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  for (const tag of [...SIX, 'mhpBuffPlus'])
  {
    const lineRe = new RegExp(`\\n?<${tag}:\\[[^\\]]*\\]>\\s*`, 'gi');
    n = n.replace(lineRe, '\n');
  }
  return n.replace(/\n{3,}/g, '\n\n').trimEnd();
}

function ensureIcon56(note)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  if (/<monsterFamilyIcon:56>/.test(n)) return n;
  const m = n.match(/^(<level:[^>]+>)\s*\n/im);
  if (!m) throw new Error('Expected <level:N> near top of note.');
  return n.replace(m[0], `${m[1]}\n<monsterFamilyIcon:56>\n`);
}

function insertAfterIcon(note, block)
{
  let n = ensureIcon56(note);
  const iconRe = /<monsterFamilyIcon:56>\s*\n/;
  const im = n.match(iconRe);
  if (!im) throw new Error('monsterFamilyIcon:56 missing');
  const at = im.index + im[0].length;
  return n.slice(0, at) + block + n.slice(at);
}

function setLevel(note, level)
{
  const n = String(note || '').replace(/\r\n/g, '\n');
  if (/<level:/i.test(n)) return n.replace(/^<level:[^>]+>/im, `<level:${level}>`);
  return `<level:${level}>\n${n}`;
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

const COLOSSI =
[
  { id: 501, name: 'Heated Titan', ks: [7, 5.5, 3.75, 5.75, 4.75, 4.75], B: 440, M: 7.56, level: 69 },
  { id: 502, name: '=== TBD Golem', tier: 2 },
  { id: 503, name: '=== TBD Golem', tier: 3 },
  { id: 504, name: '=== TBD Golem', tier: 4 },
  { id: 505, name: '=== TBD Golem', tier: 5 },
  { id: 506, name: '=== TBD Golem', tier: 6 },
  { id: 507, name: '=== TBD Golem', tier: 7 },
  { id: 508, name: '=== TBD Golem', tier: 8 },
  { id: 509, name: '=== TBD Golem', tier: 9 },
  { id: 510, name: '=== TBD Golem', tier: 10 },
];

const HAZARDS =
[
  { id: 511, name: 'Ignihazard', ks: [2, 10.5, 2, 10.5, 0, 0], B: 90, M: 1.85, level: 1 },
  { id: 512, name: 'Liquihazard', tier: 2 },
  { id: 513, name: 'Zaphazard', tier: 3 },
  { id: 514, name: '=== TBD Hazard', tier: 4 },
  { id: 515, name: '=== TBD Hazard', tier: 5 },
  { id: 516, name: '=== TBD Hazard', tier: 6 },
  { id: 517, name: '=== TBD Hazard', tier: 7 },
  { id: 518, name: '=== TBD Hazard', tier: 8 },
  { id: 519, name: '=== TBD Hazard', tier: 9 },
  { id: 520, name: '=== TBD Hazard', tier: 10 },
];

const ROBOTS =
[
  { id: 521, name: 'Bot', ks: [6, 5, 4, 5, 3.5, 1.5], B: 140, M: 2.65, level: 14 },
  { id: 522, name: '=== TBD Robot', tier: 2 },
  { id: 523, name: '=== TBD Robot', tier: 3 },
  { id: 524, name: '=== TBD Robot', tier: 4 },
  { id: 525, name: '=== TBD Robot', tier: 5 },
  { id: 526, name: '=== TBD Robot', tier: 6 },
  { id: 527, name: '=== TBD Robot', tier: 7 },
  { id: 528, name: '=== TBD Robot', tier: 8 },
  { id: 529, name: '=== TBD Robot', tier: 9 },
  { id: 530, name: '=== TBD Robot', tier: 10 },
];

function applyColossus(data, row)
{
  const e = data[row.id];
  if (!e) throw new Error(`Missing ${row.id}`);
  e.name = row.name;
  if (row.ks == null && /<mhpBuffPlus:/i.test(String(e.note || ''))) return;

  let note = stripGrowth(e.note || '');
  note = setLevel(note, row.level != null ? row.level : 10 + row.tier);
  const growthBlock = row.ks
    ? `<mhpBuffPlus:[${mhpInner(row.M)}]>\n${row.ks.map((k, i) => `<${SIX[i]}:[(a.level * ${formatQuarter(k)})]>`).join('\n')}\n`
    : `${PLACEHOLDER_MHP}\n${PLACEHOLDER_SIX}\n`;
  note = insertAfterIcon(note, growthBlock);
  e.note = note;
  const p = e.params.slice();
  if (row.ks)
  {
    p[0] = row.B;
    for (let i = 0; i < 6; i++) p[2 + i] = Math.round(row.ks[i] * 4);
  }
  else
  {
    p[0] = 260;
    for (let i = 2; i <= 7; i++) p[i] = 12;
  }
  e.params = p;
}

function hazardTailLines(oldNote)
{
  const lines = String(oldNote || '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  for (const line of lines)
  {
    if (/^<knockbackResist:/i.test(line.trim())) continue;
    if (/^<(expPlus|goldPlus|sdpPlus|sdpPoints|sdpDropData|drops|hideFromMonsterpedia|jabsConfig):/i.test(line.trim()))
    {
      out.push(line);
    }
  }
  return out.length ? `${out.join('\n')}\n` : '';
}

function applyHazard(data, row)
{
  const e = data[row.id];
  if (!e) throw new Error(`Missing ${row.id}`);
  e.name = row.name;
  if (row.ks == null && /<mhpBuffPlus:/i.test(String(e.note || ''))) return;

  const level = row.level != null ? row.level : Math.min(92, 6 + row.tier * 9);
  if (row.ks) assertSum25(row.ks, `hazard ${row.id}`);
  const old = e.note || '';
  const knock = /<knockbackResist:100>/i.test(old);
  const jabs = /<jabsConfig:inanimate>/i.test(old);
  let head = `<level:${level}>\n<hideFromMonsterpedia>\n<monsterFamilyIcon:56>\n`;
  if (knock) head += '<knockbackResist:100>\n';
  if (jabs) head += '<jabsConfig:inanimate>\n';
  const growth = row.ks
    ? `<mhpBuffPlus:[${mhpInner(row.M)}]>\n${row.ks.map((k, i) => `<${SIX[i]}:[(a.level * ${formatQuarter(k)})]>`).join('\n')}\n`
    : `${PLACEHOLDER_MHP}\n${PLACEHOLDER_SIX}\n`;
  e.note = `${head}${growth}${hazardTailLines(old)}`.trimEnd() + '\n';
  const p = e.params.slice();
  if (row.ks)
  {
    p[0] = row.B;
    for (let i = 0; i < 6; i++) p[2 + i] = Math.round(row.ks[i] * 4);
  }
  else
  {
    p[0] = 120;
    for (let i = 2; i <= 7; i++) p[i] = 10;
  }
  e.params = p;
}

function robotTailLines(oldNote)
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

function applyRobot(data, row)
{
  const e = data[row.id];
  if (!e) throw new Error(`Missing ${row.id}`);
  e.name = row.name;
  if (row.ks == null && /<mhpBuffPlus:/i.test(String(e.note || ''))) return;

  const level = row.level != null ? row.level : Math.min(90, 10 + row.tier * 8);
  if (row.ks) assertSum25(row.ks, `robot ${row.id}`);
  const old = e.note || '';
  let head = `<level:${level}>\n<hideFromMonsterpedia>\n<monsterFamilyIcon:56>\n`;
  head += '<knockbackResist:100>\n';
  const growth = row.ks
    ? `<mhpBuffPlus:[${mhpInner(row.M)}]>\n${row.ks.map((k, i) => `<${SIX[i]}:[(a.level * ${formatQuarter(k)})]>`).join('\n')}\n`
    : `${PLACEHOLDER_MHP}\n${PLACEHOLDER_SIX}\n`;
  e.note = `${head}${growth}${robotTailLines(old)}`.trimEnd() + '\n';
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

  for (const row of COLOSSI)
  {
    applyColossus(data, row);
  }

  for (const row of HAZARDS)
  {
    applyHazard(data, row);
  }

  for (const row of ROBOTS)
  {
    applyRobot(data, row);
  }

  writeEnemyArray(data);
  console.log('Wrote construct 501–530 pre-normalize patch.');
}

main();
