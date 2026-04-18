/**
 * Prepare humanoid-family decades 451–500 for normalize-decade-tiers (F=2.5, budget-step 5).
 * Humanoid family icon is always 55 (`<monsterFamilyIcon:55>`).
 * Thief decade 471–480 is contiguous (Mercenary is tier 6 between TBD rows); tier-base 470.
 * Default icon when missing: 55 (insert after `<level:N>`).
 *
 * Tier-1 shapes (Σk=25):
 *   451 bulls — horn charge: atk/def skew.
 *   461 orcs — brutal line: atk/luk, middling def.
 *   471 thieves — skirmisher: agi/luk, light def.
 *   481 walkers — shambling dead: def/mdf, low agi, stubborn luk.
 *   491 clan — formation fighters: balanced atk/def/mat/mdf.
 *
 * Then:
 *   node normalize-decade-tiers.mjs --from 451 --to 460 --tier-base 450 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 461 --to 470 --tier-base 460 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 471 --to 480 --tier-base 470 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 481 --to 490 --tier-base 480 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 491 --to 500 --tier-base 490 --f 2.5 --budget-step 5 --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const MHP_F = 2.5;
const ICON_RE = /<monsterFamilyIcon:55>\s*\n/;

const PLACEHOLDER_MHP = `<mhpBuffPlus:[(a.level ** ${MHP_F}) * 0.1]>`;
const PLACEHOLDER_SIX = [
  '<atkBuffPlus:[(a.level * 3)]>',
  '<defBuffPlus:[(a.level * 3)]>',
  '<matBuffPlus:[(a.level * 3)]>',
  '<mdfBuffPlus:[(a.level * 3)]>',
  '<agiBuffPlus:[(a.level * 3)]>',
  '<lukBuffPlus:[(a.level * 3)]>',
].join('\n');

const SIX = ['atkBuffPlus', 'defBuffPlus', 'matBuffPlus', 'mdfBuffPlus', 'agiBuffPlus', 'lukBuffPlus'];

const TIER1 =
[
  { id: 451, B: 220, M: 3.78, ks: [7, 5, 1, 3, 3, 6], blurb: 'Bulls: gore bruiser — atk/def, modest agi.' },
  { id: 461, B: 220, M: 4.38, ks: [5, 5, 2, 3, 4, 6], blurb: 'Orcs: brutal line — atk/luk, middling shell.' },
  { id: 471, B: 220, M: 4.98, ks: [4, 3, 3, 2, 5, 8], blurb: 'Thieves: skirmisher — agi/luk, tricks.' },
  { id: 481, B: 220, M: 5.58, ks: [4, 6, 2, 5, 1, 7], blurb: 'Walkers: shambling — def/mdf, slow, grim luk.' },
  { id: 491, B: 220, M: 6.18, ks: [5, 5, 4, 4, 4, 3], blurb: 'Clan: disciplined — even frontline.' },
];

function formatMhpM(m)
{
  const r = Math.round(m * 100) / 100;
  if (Number.isInteger(r)) return String(r);
  return r.toFixed(2);
}

function mhpInner(M)
{
  return `(a.level ** ${MHP_F}) * ${formatMhpM(M)}`;
}

function formatQuarter(n)
{
  const r = Math.round(n * 4) / 4;
  if (Number.isInteger(r)) return String(r);
  const s = r.toFixed(2);
  if (s.endsWith('0')) return s.slice(0, -1);
  return s;
}

function ensureFamilyIconHumanoid(note)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  if (/<monsterFamilyIcon:55>/.test(n)) return n;
  const m = n.match(/^(<level:[^>]+>)\s*\n/im);
  if (!m) throw new Error('Expected <level:N> before inserting monsterFamilyIcon for humanoid block.');
  return n.replace(m[0], `${m[1]}\n<monsterFamilyIcon:55>\n`);
}

function replaceTagLine(note, tag, inner)
{
  const normalized = String(note || '').replace(/\r\n/g, '\n');
  const lineRe = new RegExp(`^<${tag}:\\[[^\\]]*\\]>\\s*$`, 'm');
  const newLine = `<${tag}:[${inner}]>`;

  if (lineRe.test(normalized))
  {
    return normalized.replace(lineRe, newLine);
  }

  const lines = normalized.split('\n');
  let insertAt = 0;
    const idx = lines.findIndex(l => /^<monsterFamilyIcon:55>$/.test(l.trimEnd()));
  if (idx >= 0) insertAt = idx + 1;
  else
  {
    const levelIdx = lines.findIndex(l => /^<level:/i.test(l.trimStart()));
    insertAt = levelIdx >= 0 ? levelIdx + 1 : 0;
  }

  lines.splice(insertAt, 0, newLine);
  return lines.join('\n');
}

function insertMhpAfterIcon(note, inner)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  if (n.includes('<mhpBuffPlus:')) return n;
  const m = n.match(ICON_RE);
  if (!m) throw new Error('monsterFamilyIcon:55 missing');
  const at = m.index + m[0].length;
  return n.slice(0, at) + `<mhpBuffPlus:[${inner}]>\n` + n.slice(at);
}

function ensurePlaceholderGrowth(note)
{
  let n = ensureFamilyIconHumanoid(String(note || '').replace(/\r\n/g, '\n'));
  if (n.includes('<mhpBuffPlus:')) return n;
  const m = n.match(ICON_RE);
  if (!m) throw new Error('monsterFamilyIcon:55 missing after ensureFamilyIconHumanoid');
  const at = m.index + m[0].length;
  return n.slice(0, at) + `${PLACEHOLDER_MHP}\n${PLACEHOLDER_SIX}\n` + n.slice(at);
}

function assertSum25(ks, label)
{
  const s = ks.reduce((a, b) => a + b, 0);
  if (Math.abs(s - 25) > 1e-9) throw new Error(`${label}: ks sum ${s}, expected 25`);
}

function applyTier1(data, cfg)
{
  assertSum25(cfg.ks, `tier1 ${cfg.id}`);
  const e = data[cfg.id];
  if (!e) throw new Error(`Missing enemy ${cfg.id}`);

  let note = String(e.note || '').replace(/\r\n/g, '\n');
  if (/<monsterFamilyIcon:55>/.test(note) === false)
  {
    note = ensureFamilyIconHumanoid(note);
  }
  const inner = mhpInner(cfg.M);
  const hasSix = SIX.every(t => new RegExp(`<${t}:`, 'i').test(note));
  if (note.includes('<mhpBuffPlus:') === false && hasSix)
  {
    note = insertMhpAfterIcon(note, mhpInner(0.1));
  }
  else if (note.includes('<mhpBuffPlus:') === false && hasSix === false)
  {
    note = ensurePlaceholderGrowth(note);
  }
  note = replaceTagLine(note, 'mhpBuffPlus', inner);
  for (let i = 0; i < 6; i++)
  {
    const tag = SIX[i];
    const lineInner = `(a.level * ${formatQuarter(cfg.ks[i])})`;
    note = replaceTagLine(note, tag, lineInner);
  }
  e.note = note;

  const p = e.params.slice();
  p[0] = cfg.B;
  for (let i = 0; i < 6; i++)
  {
    p[2 + i] = Math.round(cfg.ks[i] * 4);
  }
  e.params = p;

  console.log(`Tier1 ${cfg.id}: MHP B=${cfg.B} M=${formatMhpM(cfg.M)} | ${cfg.blurb}`);
}

function main()
{
  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));

  for (const cfg of TIER1)
  {
    applyTier1(data, cfg);
  }

  const placeholderIds = [];
  for (let id = 453; id <= 460; id++) placeholderIds.push(id);
  for (let id = 466; id <= 470; id++) placeholderIds.push(id);
  for (let id = 474; id <= 475; id++) placeholderIds.push(id);
  for (let id = 477; id <= 480; id++) placeholderIds.push(id);
  for (let id = 482; id <= 490; id++) placeholderIds.push(id);
  for (let id = 492; id <= 500; id++) placeholderIds.push(id);

  for (const id of placeholderIds)
  {
    const e = data[id];
    if (!e) throw new Error(`Missing enemy ${id}`);
    e.note = ensurePlaceholderGrowth(e.note || '');
  }

  const chunks = ['[\n'];
  for (let j = 0; j < data.length; j++)
  {
    const rowJson = data[j] === null ? 'null' : JSON.stringify(data[j]);
    chunks.push(j < data.length - 1 ? `${rowJson},\n` : `${rowJson}\n`);
  }
  chunks.push(']');
  fs.writeFileSync(ENEMIES_PATH, chunks.join(''));

  console.log('Wrote humanoid 451–500 pre-normalize patches.');
}

main();
