/**
 * Prepare insect-family decades 401–450 for normalize-decade-tiers (F=2.5, budget-step 5).
 * Icons are usually 54; 413 uses 49 — same insert pattern (49|54).
 * Replaces Needler (401) non-standard MHP (`100 + (a.level ** 2.5) * …`) with tier-1 B/M + linear buff.
 *
 * Tier-1 shapes (Σk=25):
 *   401 bees — fast skirmish: agi/luk/mat bias.
 *   411 worms — burrow tank: def/mdf, low agi.
 *   421 solo (spider) — stalker: atk/luk, balanced mdf.
 *   431 jumper (scorpion) — burst / venom skew: atk/agi/mat.
 *   441 parasite — glassy drain: mat/luk, low def.
 *
 * Then:
 *   node normalize-decade-tiers.mjs --from 401 --to 410 --tier-base 400 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 411 --to 420 --tier-base 410 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 421 --to 430 --tier-base 420 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 431 --to 440 --tier-base 430 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 441 --to 450 --tier-base 440 --f 2.5 --budget-step 5 --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const MHP_F = 2.5;
const ICON_RE = /<monsterFamilyIcon:(49|54)>\s*\n/;

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
  { id: 401, B: 220, M: 3.78, ks: [4, 3, 3, 2, 6, 7], blurb: 'Bees: swarm skirmish — agi/luk, light shell.' },
  { id: 411, B: 220, M: 4.38, ks: [5, 6, 2, 6, 1, 5], blurb: 'Worms: burrow bruiser — def/mdf, slow.' },
  { id: 421, B: 220, M: 4.98, ks: [6, 4, 2, 3, 4, 6], blurb: 'Solo spider: ambush — atk/luk, middling bulk.' },
  { id: 431, B: 220, M: 5.58, ks: [6, 4, 3, 3, 5, 4], blurb: 'Scorpion jumper: venom striker — atk/agi/mat.' },
  { id: 441, B: 220, M: 6.18, ks: [2, 2, 6, 4, 4, 7], blurb: 'Parasite: glassy drain — mat/luk, soft def.' },
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

function ensureFamilyIconInsect(note)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  if (/<monsterFamilyIcon:(49|54)>/.test(n)) return n;
  const m = n.match(/^(<level:[^>]+>)\s*\n/im);
  if (!m) throw new Error('Expected <level:N> before inserting monsterFamilyIcon for insect block.');
  return n.replace(m[0], `${m[1]}\n<monsterFamilyIcon:54>\n`);
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
  const idx = lines.findIndex(l => /^<monsterFamilyIcon:(49|54)>$/.test(l.trimEnd()));
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
  if (!m) throw new Error('monsterFamilyIcon:49/54 missing');
  const at = m.index + m[0].length;
  return n.slice(0, at) + `<mhpBuffPlus:[${inner}]>\n` + n.slice(at);
}

function ensurePlaceholderGrowth(note)
{
  let n = ensureFamilyIconInsect(String(note || '').replace(/\r\n/g, '\n'));
  if (n.includes('<mhpBuffPlus:')) return n;
  const m = n.match(ICON_RE);
  if (!m) throw new Error('monsterFamilyIcon:49/54 missing after ensureFamilyIconInsect');
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

  let note = ensureFamilyIconInsect(String(e.note || '').replace(/\r\n/g, '\n'));
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
  for (let id = 404; id <= 410; id++) placeholderIds.push(id);
  for (let id = 414; id <= 420; id++) placeholderIds.push(id);
  for (let id = 422; id <= 430; id++) placeholderIds.push(id);
  for (let id = 432; id <= 440; id++) placeholderIds.push(id);
  for (let id = 442; id <= 450; id++) placeholderIds.push(id);

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

  console.log('Wrote insect 401–450 pre-normalize patches.');
}

main();
