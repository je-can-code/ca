#!/usr/bin/env node
/**
 * Rewrites panel key prefixes on J-SDP Unlock/Lock plugin commands in map events.
 *
 * Typical debug flow (Map357 SDP manager): unlock GHO_1…GHO_10 in the editor, then:
 *   node chef-adventure/tools/rewrite-sdp-unlock-prefix.mjs --from GHO --to REB --map 357 --event 1 --apply
 *
 * Usage:
 *   node tools/rewrite-sdp-unlock-prefix.mjs --from GHO --to REB [--map 357] [--event 1] [--apply]
 *
 * Options:
 *   --from PREFIX     Source panel prefix (e.g. GHO, REB)
 *   --to PREFIX       Target panel prefix
 *   --map ID          Limit to Map###.json (default: all maps in data/)
 *   --event ID        Limit to one event id on each map
 *   --command KIND    unlock | lock | both (default: both)
 *   --apply           Write changes (default: dry-run)
 *   --list-prefixes   Print subgroup prefixes from sdp-family-registry.mjs and exit
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FAMILIES } from './sdp-family-registry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');

const PLUGIN_COMMAND_CODE = 357;
const PLUGIN_PARAM_PREVIEW_CODE = 657;
const SDP_COMMANDS = new Set(['Unlock SDP', 'Lock SDP']);

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
    command: 'both',
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

    if (arg === '--event')
    {
      out.event = argv[++i];
      continue;
    }

    if (arg === '--command')
    {
      out.command = argv[++i];
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
 * @param {string} key
 * @param {string} fromPrefix
 * @param {string} toPrefix
 * @returns {string}
 */
function rewritePanelKey(key, fromPrefix, toPrefix)
{
  const pattern = new RegExp(`^${fromPrefix}_(\\d{1,2})$`);
  const match = pattern.exec(key);

  if (match === null)
  {
    return key;
  }

  return `${toPrefix}_${match[1]}`;
}

/**
 * @param {string} keysJson
 * @param {string} fromPrefix
 * @param {string} toPrefix
 * @returns {{ keys: string[], changed: boolean }}
 */
function rewriteKeysJson(keysJson, fromPrefix, toPrefix)
{
  /** @type {string[]} */
  let keys;

  try
  {
    keys = JSON.parse(keysJson);
  }
  catch (error)
  {
    throw new Error(`Could not parse keys JSON: ${keysJson}`);
  }

  if (Array.isArray(keys) === false)
  {
    throw new Error(`Expected keys array, got: ${typeof keys}`);
  }

  let changed = false;
  const nextKeys = keys.map(key =>
  {
    const rewritten = rewritePanelKey(String(key), fromPrefix, toPrefix);

    if (rewritten !== key)
    {
      changed = true;
    }

    return rewritten;
  });

  return { keys: nextKeys, changed };
}

/**
 * RMMZ editor preview line for plugin command string args (truncated like the IDE).
 *
 * @param {string[]} keys
 * @returns {string}
 */
function buildKeysPreviewLine(keys)
{
  const full = `keys = ${JSON.stringify(keys)}`;

  if (full.length <= 60)
  {
    return full;
  }

  return `${full.slice(0, 57)}…`;
}

/**
 * @param {string} commandKind
 * @param {string} pluginCommandName
 * @returns {boolean}
 */
function commandMatchesFilter(commandKind, pluginCommandName)
{
  if (commandKind === 'both')
  {
    return true;
  }

  if (commandKind === 'unlock')
  {
    return pluginCommandName === 'Unlock SDP';
  }

  if (commandKind === 'lock')
  {
    return pluginCommandName === 'Lock SDP';
  }

  throw new Error(`--command must be unlock, lock, or both (got: ${commandKind})`);
}

/**
 * @param {object} mapData
 * @param {string} mapLabel
 * @param {string} fromPrefix
 * @param {string} toPrefix
 * @param {number|null} eventFilter
 * @param {string} commandKind
 * @returns {{ hitCount: number, details: string[] }}
 */
function rewriteMapUnlockCommands(mapData, mapLabel, fromPrefix, toPrefix, eventFilter, commandKind)
{
  let hitCount = 0;
  /** @type {string[]} */
  const details = [];

  for (const event of mapData.events ?? [])
  {
    if (event === null || typeof event !== 'object')
    {
      continue;
    }

    if (eventFilter !== null && event.id !== eventFilter)
    {
      continue;
    }

    for (const page of event.pages ?? [])
    {
      const list = page.list ?? [];

      for (let index = 0; index < list.length; index++)
      {
        const command = list[index];

        if (command.code !== PLUGIN_COMMAND_CODE)
        {
          continue;
        }

        const pluginCommandName = command.parameters?.[1];

        if (SDP_COMMANDS.has(pluginCommandName) === false)
        {
          continue;
        }

        if (commandMatchesFilter(commandKind, pluginCommandName) === false)
        {
          continue;
        }

        const args = command.parameters?.[3];

        if (args === undefined || args.keys === undefined)
        {
          continue;
        }

        const beforeKeys = JSON.parse(args.keys);
        const { keys, changed } = rewriteKeysJson(args.keys, fromPrefix, toPrefix);

        if (changed === false)
        {
          continue;
        }

        args.keys = JSON.stringify(keys);
        hitCount += 1;

        const afterPreview = keys.join(', ');
        details.push(
          `${mapLabel} event ${event.id} page cmd ${index} ${pluginCommandName}: `
          + `${beforeKeys.join(', ')} → ${afterPreview}`);

        const previewCommand = list[index + 1];

        if (
          previewCommand !== undefined
          && previewCommand.code === PLUGIN_PARAM_PREVIEW_CODE
          && String(previewCommand.parameters?.[0] ?? '').startsWith('keys = ')
        )
        {
          previewCommand.parameters[0] = buildKeysPreviewLine(keys);
        }
      }
    }
  }

  return { hitCount, details };
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
  console.error('Example: node tools/rewrite-sdp-unlock-prefix.mjs --from GHO --to REB --map 357 --event 1 --apply');
  process.exit(1);
}

const fromPrefix = normalizePrefix(String(args.from));
const toPrefix = normalizePrefix(String(args.to));
const eventFilter = args.event === undefined ? null : Number(args.event);
const commandKind = String(args.command ?? 'both');
const apply = args.apply === true;

if (fromPrefix === toPrefix)
{
  console.error('--from and --to must differ.');
  process.exit(1);
}

/** @type {string[]} */
const allDetails = [];
let totalHits = 0;
/** @type {string[]} */
const touchedMaps = [];

for (const mapPath of resolveMapFiles(args.map))
{
  const mapLabel = path.basename(mapPath);
  const raw = readFileSync(mapPath, 'utf8');
  const mapData = JSON.parse(raw);
  const { hitCount, details } = rewriteMapUnlockCommands(
    mapData,
    mapLabel,
    fromPrefix,
    toPrefix,
    eventFilter,
    commandKind);

  if (hitCount === 0)
  {
    continue;
  }

  totalHits += hitCount;
  allDetails.push(...details);

  if (apply === true)
  {
    writeFileSync(mapPath, `${JSON.stringify(mapData, null, 0)}\n`);
    touchedMaps.push(mapLabel);
  }
}

console.log({
  apply,
  from: fromPrefix,
  to: toPrefix,
  map: args.map ?? '(all)',
  event: eventFilter ?? '(all)',
  command: commandKind,
  commandsRewritten: totalHits,
  mapsTouched: touchedMaps,
});

for (const line of allDetails)
{
  console.log(`  ${line}`);
}

if (totalHits === 0)
{
  console.log('\nNo matching Unlock/Lock SDP commands found.');
}

if (totalHits > 0 && apply === false)
{
  console.log('\nDry run — pass --apply to write map files.');
}
