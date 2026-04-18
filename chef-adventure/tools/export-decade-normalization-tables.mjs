/**
 * Prints markdown: Max HP anchors + stat k tables + % tables per normalized decade.
 * Reads chef-adventure/data/Enemies.json (run after decade normalize passes).
 *
 * Usage: node export-decade-normalization-tables.mjs > ../docs/enemy-decade-normalization-tables.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const LEVELS = [1, 10, 20, 35, 55, 75, 100];
const SIX =
[
  { short: 'atk', tag: 'atkBuffPlus' },
  { short: 'def', tag: 'defBuffPlus' },
  { short: 'mat', tag: 'matBuffPlus' },
  { short: 'mdf', tag: 'mdfBuffPlus' },
  { short: 'agi', tag: 'agiBuffPlus' },
  { short: 'luk', tag: 'lukBuffPlus' },
];

const SKELLY_PAIRS =
[
  { masterId: 131, petId: 132, virtualTier: 2 },
  { masterId: 133, petId: 134, virtualTier: 4 },
  { masterId: 135, petId: 136, virtualTier: 6 },
  { masterId: 137, petId: 138, virtualTier: 8 },
  { masterId: 139, petId: 140, virtualTier: 10 },
];

function parseTag(note, tag)
{
  const re = new RegExp(`<${tag}:\\[([^\\]]*)\\]>`, 'i');
  const m = String(note || '').match(re);
  return m ? m[1] : null;
}

function evalInner(inner, L)
{
  if (!inner) return 0;
  return Function('a', '"use strict"; return (' + inner + ');')({ level: L });
}

function mhpTotal(e, L)
{
  return e.params[0] + evalInner(parseTag(e.note, 'mhpBuffPlus'), L);
}

function parseK(note, tag)
{
  const inner = parseTag(note, tag);
  if (!inner) return null;
  const km = inner.match(/a\.level\s*\*\s*([0-9]+(?:\.[0-9]+)?)/i);
  return km ? parseFloat(km[1]) : null;
}

function fmt(n)
{
  return Math.round(n).toLocaleString('en-US');
}

function extractF(note)
{
  const inner = parseTag(note, 'mhpBuffPlus');
  if (!inner) return '?';
  const m = inner.match(/\*\*\s*([0-9.]+)\s*\)/);
  return m ? m[1] : '?';
}

function skellyCol(id)
{
  const pair = SKELLY_PAIRS.find((p) => p.masterId === id || p.petId === id);
  if (!pair) return '? | ?';
  const role = pair.masterId === id ? 'master' : 'pet';
  return `${pair.virtualTier} | ${role}`;
}

function tableMhp(data, ids, tierCol)
{
  const lines = [];
  lines.push('| id | tier | name | L1 | L10 | L20 | L35 | L55 | L75 | L100 |');
  lines.push('| ---: | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const id of ids)
  {
    const e = data[id];
    if (!e) continue;
    const name = String(e.name || '').replace(/\|/g, '').slice(0, 40);
    const tier = tierCol(id);
    const cells = LEVELS.map((L) => fmt(mhpTotal(e, L))).join(' | ');
    lines.push(`| ${id} | ${tier} | ${name} | ${cells} |`);
  }
  return lines.join('\n');
}

function tableKs(data, ids, tierCol)
{
  const lines = [];
  lines.push('| id | tier | Σk | atk | def | mat | mdf | agi | luk |');
  lines.push('| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const id of ids)
  {
    const e = data[id];
    if (!e) continue;
    const ks = SIX.map((s) => parseK(e.note, s.tag));
    if (ks.some((k) => k === null)) continue;
    const sum = ks.reduce((a, b) => a + b, 0);
    const row = ks.map((k) => String(k)).join(' | ');
    lines.push(`| ${id} | ${tierCol(id)} | ${sum.toFixed(2)} | ${row} |`);
  }
  return lines.join('\n');
}

function tablePct(data, ids, tierCol)
{
  const lines = [];
  lines.push('| id | tier | atk | def | mat | mdf | agi | luk |');
  lines.push('| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const id of ids)
  {
    const e = data[id];
    if (!e) continue;
    const ks = SIX.map((s) => parseK(e.note, s.tag));
    if (ks.some((k) => k === null)) continue;
    const sum = ks.reduce((a, b) => a + b, 0);
    const pcts = ks.map((k) => `${((k / sum) * 100).toFixed(1)}%`).join(' | ');
    lines.push(`| ${id} | ${tierCol(id)} | ${pcts} |`);
  }
  return lines.join('\n');
}

function rangeIds(from, to)
{
  const a = [];
  for (let id = from; id <= to; id++) a.push(id);
  return a;
}

function section(out, title, meta, data, ids, tierCol)
{
  out.push(`## ${title}`);
  out.push('');
  out.push(meta);
  out.push('');
  out.push('### Max HP anchors');
  out.push('');
  out.push(tableMhp(data, ids, tierCol));
  out.push('');
  out.push('### Stat growth coefficients (linear `a.level * k`)');
  out.push('');
  out.push(tableKs(data, ids, tierCol));
  out.push('');
  out.push('### Budget distribution (% of Σk)');
  out.push('');
  out.push(tablePct(data, ids, tierCol));
  out.push('');
}

function main()
{
  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));
  const out = [];

  out.push('# Enemy decade normalization snapshot');
  out.push('');
  out.push('Generated from `chef-adventure/data/Enemies.json` after decade normalize passes.');
  out.push('');
  out.push('**Skipped:** Salamander **191–200** (tier-1 has no `mhpBuffPlus` + six linear growth tags).');
  out.push('');
  out.push('**Dragon 163–170:** placeholder growth tags were added where missing so the decade tool could run; ladder comes from **161 Lesser Dargin**.');
  out.push('');

  section(
    out,
    'Ghosty (101–104)',
    `**Tool:** \`normalize-ghosty-decade-tiers.mjs --apply\` · **F:** ${extractF(data[101].note)} · **Stat budget:** 25 + (tier−1)×5`,
    data,
    [101, 102, 103, 104],
    (id) => id - 100
  );

  section(
    out,
    'Reborn (111–120)',
    '**Tool:** `normalize-decade-tiers.mjs --from 111 --to 120 --tier-base 110 --f 2.7 --budget-step 5 --apply`',
    data,
    rangeIds(111, 120),
    (id) => id - 110
  );

  section(
    out,
    'Wisp (121–130)',
    '**Tool:** `normalize-decade-tiers.mjs --from 121 --to 130 --tier-base 120 --f 1.6 --budget-step 5 --apply`',
    data,
    rangeIds(121, 130),
    (id) => id - 120
  );

  const skellyIds = [];
  for (const p of SKELLY_PAIRS)
  {
    skellyIds.push(p.masterId);
    skellyIds.push(p.petId);
  }
  section(
    out,
    'Skelly pairs (131–140)',
    `**Tool:** \`apply-skelly-pair-decade.mjs --apply\` · **F:** ${extractF(data[131].note)} · **tier** = virtual tier (2,4,6,8,10) and role (master = Skeletor curve, pet ≈ 60% of master tier MHP targets).`,
    data,
    skellyIds,
    skellyCol
  );

  section(
    out,
    'Hollow (141–150)',
    '**Tool:** `normalize-decade-tiers.mjs --from 141 --to 150 --tier-base 140 --f 2.5 --budget-step 5 --apply`',
    data,
    rangeIds(141, 150),
    (id) => id - 140
  );

  section(
    out,
    'Snake (151–160)',
    '**Tool:** `normalize-decade-tiers.mjs --from 151 --to 160 --tier-base 150 --f 2.6 --budget-step 5 --apply`',
    data,
    rangeIds(151, 160),
    (id) => id - 150
  );

  section(
    out,
    'Dragon (161–170)',
    '**Tool:** `normalize-decade-tiers.mjs --from 161 --to 170 --tier-base 160 --f 2.5 --budget-step 5 --apply`',
    data,
    rangeIds(161, 170),
    (id) => id - 160
  );

  section(
    out,
    'Draconian (171–180)',
    '**Tool:** `normalize-decade-tiers.mjs --from 171 --to 180 --tier-base 170 --f 2.5 --budget-step 5 --apply`',
    data,
    rangeIds(171, 180),
    (id) => id - 170
  );

  section(
    out,
    'Lamia (181–190)',
    '**Tool:** `normalize-decade-tiers.mjs --from 181 --to 190 --tier-base 180 --f 2.6 --budget-step 5 --apply`',
    data,
    rangeIds(181, 190),
    (id) => id - 180
  );

  process.stdout.write(out.join('\n'));
}

main();
