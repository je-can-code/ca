/**
 * Prepare beast-family decades 351–400 for normalize-decade-tiers (same F/budget as plants).
 * Icons are mostly 53; 353–354 use 54 — both match `monsterFamilyIcon:5[3-4]` for inserts.
 * Garuda / sparse TBD rows get `<monsterFamilyIcon:53>` when missing.
 * Doom Harbinger / Doom Wing (363–364) gain def/mdf/luk lines so the normalizer can parse six stats.
 *
 * Then:
 *   node normalize-decade-tiers.mjs --from 351 --to 360 --tier-base 350 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 361 --to 370 --tier-base 360 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 371 --to 380 --tier-base 370 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 381 --to 390 --tier-base 380 --f 2.5 --budget-step 5 --apply
 *   node normalize-decade-tiers.mjs --from 391 --to 400 --tier-base 390 --f 2.5 --budget-step 5 --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const MHP_F = 2.5;
const ICON_RE = /<monsterFamilyIcon:5[34]>\s*\n/;

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
  { id: 351, B: 220, M: 3.78, ks: [6, 5, 2, 4, 3, 5], blurb: 'Hybrid line: bruiser skew — atk/def, modest agi.' },
  { id: 361, B: 220, M: 4.38, ks: [4, 2, 3, 2, 8, 6], blurb: 'Winger line: bat — agi/atk, light shell.' },
  { id: 371, B: 220, M: 4.98, ks: [5, 4, 6, 5, 4, 1], blurb: 'Beaks line: aerial striker — mat/agi pressure.' },
  { id: 381, B: 220, M: 5.58, ks: [3, 3, 2, 2, 7, 8], blurb: 'Rodent line: scrappy — agi/luk, soft def.' },
  { id: 391, B: 220, M: 6.18, ks: [7, 6, 2, 5, 3, 2], blurb: 'Quadraped line: bruiser tank — atk/def.' },
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

/**
 * Ensures `<monsterFamilyIcon:53>` exists after `<level:N>` when no family icon is present.
 * @param {string} note
 * @returns {string}
 */
function ensureFamilyIconBeast(note)
{
  let n = String(note || '').replace(/\r\n/g, '\n');
  if (/<monsterFamilyIcon:5[34]>/.test(n)) return n;
  const m = n.match(/^(<level:[^>]+>)\s*\n/im);
  if (!m) throw new Error('Expected <level:N> before inserting monsterFamilyIcon for beast block.');
  return n.replace(m[0], `${m[1]}\n<monsterFamilyIcon:53>\n`);
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
  const idx = lines.findIndex(l => /^<monsterFamilyIcon:5[34]>$/.test(l.trimEnd()));
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
  if (!m) throw new Error('monsterFamilyIcon:53/54 missing');
  const at = m.index + m[0].length;
  return n.slice(0, at) + `<mhpBuffPlus:[${inner}]>\n` + n.slice(at);
}

function ensurePlaceholderGrowth(note)
{
  let n = ensureFamilyIconBeast(String(note || '').replace(/\r\n/g, '\n'));
  if (n.includes('<mhpBuffPlus:')) return n;
  const m = n.match(ICON_RE);
  if (!m) throw new Error('monsterFamilyIcon:53/54 missing after ensureFamilyIconBeast');
  const at = m.index + m[0].length;
  return n.slice(0, at) + `${PLACEHOLDER_MHP}\n${PLACEHOLDER_SIX}\n` + n.slice(at);
}

function assertSum25(ks, label)
{
  const s = ks.reduce((a, b) => a + b, 0);
  if (Math.abs(s - 25) > 1e-9) throw new Error(`${label}: ks sum ${s}, expected 25`);
}

/**
 * Doom Harbinger / Doom Wing only had atk/mat/agi; normalizer requires six linear BuffPlus lines.
 * @param {unknown[]} data
 * @returns {void}
 */
function ensureDoomHarbingersSixStats(data)
{
  const pad = '<defBuffPlus:[(a.level * 2)]>\n<mdfBuffPlus:[(a.level * 2)]>\n<lukBuffPlus:[(a.level * 2)]>\n';
  for (const id of [363, 364])
  {
    const e = data[id];
    if (!e) throw new Error(`Missing enemy ${id}`);
    let n = String(e.note || '').replace(/\r\n/g, '\n');
    if (/<defBuffPlus:/i.test(n)) continue;
    const replaced = n.replace(
      /(<agiBuffPlus:\[[^\]]*\]>)\s*\n/i,
      `$1\n${pad}`,
    );
    if (replaced === n) throw new Error(`Could not insert def/mdf/luk after agi for enemy ${id}`);
    e.note = replaced;
  }
}

function applyTier1(data, cfg)
{
  assertSum25(cfg.ks, `tier1 ${cfg.id}`);
  const e = data[cfg.id];
  if (!e) throw new Error(`Missing enemy ${cfg.id}`);

  let note = ensureFamilyIconBeast(String(e.note || '').replace(/\r\n/g, '\n'));
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

  ensureDoomHarbingersSixStats(data);

  for (const cfg of TIER1)
  {
    applyTier1(data, cfg);
  }

  const placeholderIds = [];
  for (let id = 355; id <= 360; id++) placeholderIds.push(id);
  for (let id = 365; id <= 370; id++) placeholderIds.push(id);
  for (let id = 372; id <= 380; id++) placeholderIds.push(id);
  for (let id = 382; id <= 390; id++) placeholderIds.push(id);
  for (let id = 392; id <= 400; id++) placeholderIds.push(id);

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

  console.log('Wrote beast 351–400 pre-normalize patches.');
}

main();
