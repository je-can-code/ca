/**
 * One-shot prep before normalize-decade-tiers for aquatic decades (201–230).
 * - Kappa tier-1: unified generalist growth (moderate atk/mat/luk; low def/mdf/agi).
 * - Amphibian / crustacean tier-1: distinct templates + MHP anchors (crab > kappa > frog at tier-10).
 * - TBD rows: placeholder mhpBuffPlus + six linear tags (parsed by the normalizer).
 * - 222: add standard mhpBuffPlus; tame params[0] so baseline is sane before rewrite.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const PLACEHOLDER_MHP = '<mhpBuffPlus:[(a.level ** 2.5) * 0.1]>';
const PLACEHOLDER_SIX = [
  '<atkBuffPlus:[(a.level * 3)]>',
  '<defBuffPlus:[(a.level * 3)]>',
  '<matBuffPlus:[(a.level * 3)]>',
  '<mdfBuffPlus:[(a.level * 3)]>',
  '<agiBuffPlus:[(a.level * 3)]>',
  '<lukBuffPlus:[(a.level * 3)]>',
].join('\n');

function replaceTag(note, tag, inner)
{
  const lineRe = new RegExp(`^<${tag}:\\[[^\\]]*\\]>\\s*$`, 'm');
  const newLine = `<${tag}:[${inner}]>`;
  if (lineRe.test(note))
  {
    return note.replace(lineRe, newLine);
  }
  throw new Error(`Missing tag <${tag}:...> in note`);
}

function insertAfterFamilyIcon(note, block)
{
  const needle = '<monsterFamilyIcon:50>\n';
  const idx = note.indexOf(needle);
  if (idx === -1)
  {
    throw new Error('monsterFamilyIcon:50 not found');
  }
  const at = idx + needle.length;
  return note.slice(0, at) + block + note.slice(at);
}

function ensureAquaticPlaceholders(note)
{
  if (note.includes('<mhpBuffPlus:')) return note;
  return insertAfterFamilyIcon(note, `${PLACEHOLDER_MHP}\n${PLACEHOLDER_SIX}\n`);
}

function main()
{
  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));

  const e201 = data[201];
  e201.params[0] = 280;
  let n201 = e201.note;
  n201 = replaceTag(n201, 'mhpBuffPlus', '(a.level ** 2.5) * 2.61');
  n201 = replaceTag(n201, 'atkBuffPlus', '(a.level * 6)');
  n201 = replaceTag(n201, 'defBuffPlus', '(a.level * 2)');
  n201 = replaceTag(n201, 'matBuffPlus', '(a.level * 6)');
  n201 = replaceTag(n201, 'mdfBuffPlus', '(a.level * 2)');
  n201 = replaceTag(n201, 'agiBuffPlus', '(a.level * 2)');
  n201 = replaceTag(n201, 'lukBuffPlus', '(a.level * 7)');
  e201.note = n201;

  const e211 = data[211];
  e211.params[0] = 100;
  let n211 = e211.note;
  n211 = replaceTag(n211, 'mhpBuffPlus', '(a.level ** 2.6) * 1.31');
  n211 = replaceTag(n211, 'atkBuffPlus', '(a.level * 7)');
  n211 = replaceTag(n211, 'defBuffPlus', '(a.level * 2.5)');
  n211 = replaceTag(n211, 'matBuffPlus', '(a.level * 2)');
  n211 = replaceTag(n211, 'mdfBuffPlus', '(a.level * 4)');
  n211 = replaceTag(n211, 'agiBuffPlus', '(a.level * 6.5)');
  n211 = replaceTag(n211, 'lukBuffPlus', '(a.level * 3)');
  e211.note = n211;

  const e221 = data[221];
  e221.params[0] = 300;
  let n221 = e221.note;
  n221 = replaceTag(n221, 'mhpBuffPlus', '(a.level ** 2.5) * 2.82');
  n221 = replaceTag(n221, 'atkBuffPlus', '(a.level * 6)');
  n221 = replaceTag(n221, 'defBuffPlus', '(a.level * 7)');
  n221 = replaceTag(n221, 'matBuffPlus', '(a.level * 1.5)');
  n221 = replaceTag(n221, 'mdfBuffPlus', '(a.level * 7)');
  n221 = replaceTag(n221, 'agiBuffPlus', '(a.level * 2)');
  n221 = replaceTag(n221, 'lukBuffPlus', '(a.level * 1.5)');
  e221.note = n221;

  for (let id = 205; id <= 210; id++)
  {
    data[id].note = ensureAquaticPlaceholders(String(data[id].note || ''));
  }

  for (let id = 223; id <= 230; id++)
  {
    data[id].note = ensureAquaticPlaceholders(String(data[id].note || ''));
  }

  const e222 = data[222];
  e222.params[0] = 220;
  let n222 = e222.note;
  if (/<mhpBuffPlus:\[[^\]]*\]>/i.test(n222) === false)
  {
    n222 = insertAfterFamilyIcon(n222, '<mhpBuffPlus:[(a.level ** 2.5) * 1]>\n');
  }
  else
  {
    n222 = replaceTag(n222, 'mhpBuffPlus', '(a.level ** 2.5) * 1');
  }
  e222.note = n222;

  const chunks = ['[\n'];
  for (let j = 0; j < data.length; j++)
  {
    const rowJson = data[j] === null ? 'null' : JSON.stringify(data[j]);
    chunks.push(j < data.length - 1 ? `${rowJson},\n` : `${rowJson}\n`);
  }
  chunks.push(']');
  fs.writeFileSync(ENEMIES_PATH, chunks.join(''));
  console.log('Wrote aquatic pre-normalize patches to Enemies.json');
}

main();
