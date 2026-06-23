#!/usr/bin/env node
/**
 * Rewrites panel key prefixes in map JSON files via simple string replacement.
 *
 * Usage:
 *   bun chef-adventure/tools/rewrite-sdp-unlock-prefix.mjs --from ROP --to JEL --map 357 --apply
 *
 * Options:
 *   --from PREFIX     Source panel prefix (e.g. ROP)
 *   --to PREFIX       Target panel prefix (e.g. JEL)
 *   --map ID          Limit to Map###.json (default: all maps in data/)
 *   --apply           Write changes (default: dry-run)
 *   --list-prefixes   Print subgroup prefixes from sdp-family-registry.mjs and exit
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FAMILIES } from './sdp-family-registry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../../chef-adventure/data');


/**
 * @param {string[]} argv
 * @returns {Record<string, string|boolean>}
 */
function parseArgs(argv)
{
  /** @type {Record<string, string|boolean>} */
  const out = {
    apply: false,
    listPrefixes: false,
  };

  for (let i = 2; i < argv.length; i++)
  {
    const arg = argv[i];

    if (arg === '--apply')
    {
      out.apply = true;
      continue;
    }

    if (arg === '--list-prefixes')
    {
      out.listPrefixes = true;
      continue;
    }

    if (arg === '--from')
    {
      out.from = argv[++i];
      continue;
    }

    if (arg === '--to')
    {
      out.to = argv[++i];
      continue;
    }

    if (arg === '--map')
    {
      out.map = argv[++i];
      continue;
    }


    throw new Error(`Unknown argument: ${arg}`);
  }

  return out;
}

/**
 * @param {string} prefix
 * @returns {string}
 */
function normalizePrefix(prefix)
{
  return prefix.trim().toUpperCase();
}


/**
 * @param {number|string|null|undefined} mapFilter
 * @returns {string[]}
 */
function resolveMapFiles(mapFilter)
{
  if (mapFilter === undefined || mapFilter === null)
  {
    return readdirSync(dataDir)
      .filter(name => /^Map\d+\.json$/i.test(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(name => path.join(dataDir, name));
  }

  const id = String(mapFilter).replace(/^Map/i, '').replace(/\.json$/i, '');
  return [path.join(dataDir, `Map${id.padStart(3, '0')}.json`)];
}

function printPrefixList()
{
  console.log('Subgroup prefixes (sdp-family-registry.mjs):\n');

  for (const family of FAMILIES)
  {
    console.log(`${family.familyName} (${family.familyKey})`);

    for (const subgroup of family.subgroups)
    {
      const prefix = subgroup.prefix ?? '(none)';
      console.log(`  ${prefix.padEnd(4)}  ${subgroup.key.padEnd(28)}  ${subgroup.label}`);
    }

    console.log('');
  }
}

const args = parseArgs(process.argv);

if (args.listPrefixes === true)
{
  printPrefixList();
  process.exit(0);
}

if (args.from === undefined || args.to === undefined)
{
  console.error('Required: --from PREFIX --to PREFIX');
  console.error('Example: bun tools/rewrite-sdp-unlock-prefix.mjs --from ROP --to JEL --map 357 --apply');
  process.exit(1);
}

const fromPrefix = normalizePrefix(String(args.from));
const toPrefix = normalizePrefix(String(args.to));
const apply = args.apply === true;

if (fromPrefix === toPrefix)
{
  console.error('--from and --to must differ.');
  process.exit(1);
}

const touchedMaps = [];

for (const mapPath of resolveMapFiles(args.map))
{
  const raw = readFileSync(mapPath, 'utf8');
  const next = raw.replaceAll(`${fromPrefix}_`, `${toPrefix}_`);

  if (next === raw) continue;

  const count = (raw.match(new RegExp(`${fromPrefix}_`, 'g')) ?? []).length;
  console.log(`${path.basename(mapPath)}: ${count} replacement(s) (${fromPrefix}_ → ${toPrefix}_)`);
  touchedMaps.push(path.basename(mapPath));

  if (apply)
  {
    writeFileSync(mapPath, next);
  }
}

if (touchedMaps.length === 0)
{
  console.log(`No occurrences of "${fromPrefix}_" found.`);
}
else if (!apply)
{
  console.log('\nDry run — pass --apply to write.');
}
