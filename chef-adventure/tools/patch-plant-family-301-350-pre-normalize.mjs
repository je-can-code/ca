/**
 * Prepare plant-family decades 301–350 (monsterFamilyIcon:52) for normalize-decade-tiers:
 * tier-1 anchors (MHP + six linear tags, Σk=25) and TBD rows get placeholder growth.
 * Fungus decade is 311–320 (Fungrowth → Ghastroom → …); tier-base 310.
 *
 * Then:
 *   node normalize-decade-tiers.mjs --from 301 --to 310 --tier-base 300 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 311 --to 320 --tier-base 310 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 321 --to 330 --tier-base 320 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 331 --to 340 --tier-base 330 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 341 --to 350 --tier-base 340 --f 2.5 --budget-step 5 --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const MHP_F = 2.5;
const ICON_RE = /<monsterFamilyIcon:52>\s*\n/;

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
  { id: 301, B: 220, M: 3.78, ks: [4, 8, 3, 5, 2, 3], blurb: 'Trap: ambush bulk — def/mdf tilt, modest atk.' },
  { id: 311, B: 220, M: 4.38, ks: [5, 5, 3, 5, 2, 5], blurb: 'Fungus: bruiser spread — even atk/def with luk.' },
  { id: 321, B: 220, M: 4.98, ks: [3, 3, 6, 4, 5, 4], blurb: 'Fae: skirmish caster — mat/agi, light def.' },
  { id: 331, B: 220, M: 5.58, ks: [3, 9, 2, 8, 1, 2], blurb: 'Treant: lumbering tank — def/mdf anchor.' },
  { id: 341, B: 220, M: 6.18, ks: [3, 4, 7, 6, 3, 2], blurb: 'Flower: arcane striker — mat/mdf pressure.' },
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
  const idx = lines.findIndex(l => l.trimEnd() === '<monsterFamilyIcon:52>');
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
  if (!m) throw new Error('monsterFamilyIcon:52 missing');
  const at = m.index + m[0].length;
  return n.slice(0, at) + `<mhpBuffPlus:[${inner}]>\n` + n.slice(at);
}

function ensurePlaceholderGrowth(note)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  if (n.includes('<mhpBuffPlus:')) return n;
  const m = n.match(ICON_RE);
  if (!m) throw new Error('monsterFamilyIcon:52 missing');
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
  for (let id = 303; id <= 310; id++) placeholderIds.push(id);
  for (let id = 313; id <= 320; id++) placeholderIds.push(id);
  for (let id = 324; id <= 330; id++) placeholderIds.push(id);
  for (let id = 332; id <= 340; id++) placeholderIds.push(id);
  for (let id = 342; id <= 350; id++) placeholderIds.push(id);

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

  console.log('Wrote plant 301–350 pre-normalize patches.');
}

main();
