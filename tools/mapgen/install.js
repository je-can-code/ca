//region install
/**
 * Moves staged maps into `data/` and registers them in `MapInfos.json`.
 *
 * This is the only file in `tools/mapgen` that writes to the database, and it is deliberately
 * timid about it: it refuses to overwrite a map that already exists, refuses to register an id
 * that is already registered, and writes `MapInfos.json` line by line rather than rewriting it, so
 * the diff is the new lines and one comma, each new entry landing at the index equal to its id.
 *
 * **`MapInfos.json` is the one file in `data/` an open editor will clobber.** MZ holds the whole
 * map tree in memory; saving in the editor writes that stale tree back and silently drops entries
 * added out here. The `Map###.json` files are never at risk - MZ does not know a map exists until
 * `MapInfos.json` points at it - so the repair is always just re-adding the lines.
 *
 * Usage: bun tools/mapgen/install.js
 */
import { DATA, STAGING } from './paths.js';

const manifest = JSON.parse(await Bun.file(`${STAGING}/_built.json`).text());

let written = 0;
let unchanged = 0;

for (const entry of manifest)
{
  const dest = `${DATA}/Map${entry.id}.json`;
  const staged = await Bun.file(`${STAGING}/Map${entry.id}.json`).text();
  const existing = Bun.file(dest);

  if (await existing.exists())
  {
    // an installed map that still matches its recipe is just this script being run twice; one that
    // has drifted has been hand-edited, and hand-edits outrank the generator every time.
    if (await existing.text() !== staged) throw new Error(`Map${entry.id} has been edited since it was generated; refusing to overwrite`);

    unchanged++;
    continue;
  }

  await Bun.write(dest, staged);
  written++;
}

console.log(`installed ${written} map file(s), ${unchanged} already present and unchanged`);

const infoPath = `${DATA}/MapInfos.json`;
const text = await Bun.file(infoPath).text();
const infos = JSON.parse(text);
const lines = text.split('\n');
const closing = lines.lastIndexOf(']');

// MapInfos is read by position, not by search: the engine and the editor both find a map's entry at the
// index equal to its id. An entry sitting anywhere else is a corrupt tree, so a slot that already holds
// some other map stops the run before anything is written.
manifest.forEach(entry =>
{
  const held = infos[entry.id];
  if (held && held.id !== entry.id) throw new Error(`MapInfos slot ${entry.id} holds Map${held.id}; refusing to register Map${entry.id}`);
});

// new entries go on in id order whatever order the recipe listed them in, since an append lands at the
// end of the array and only id order keeps each one at its own index.
const pending = manifest
  .filter(entry => !infos[entry.id])
  .sort((left, right) => left.id - right.id);

if (pending.length === 0)
{
  console.log('every map is already registered in MapInfos');
  process.exit(0);
}

const entryLine = entry => JSON.stringify({
  id: entry.id,
  expanded: false,
  name: entry.tree,
  order: entry.order,
  parentId: entry.parentId,
  scrollX: 1101,
  scrollY: 701.5,
});

// the editor writes one element per line, so element N is line N + 1. An id inside the array fills its
// own null slot in place; an id past the end is appended, with a null for every unused id before it.
const appended = [];
let next = infos.length;
pending.forEach(entry =>
{
  if (entry.id < infos.length)
  {
    const line = entry.id + 1;
    lines[line] = lines[line].endsWith(',') ? `${entryLine(entry)},` : entryLine(entry);
    return;
  }

  for (; next < entry.id; next++) appended.push('null');
  appended.push(entryLine(entry));
  next++;
});

// the editor writes no trailing comma, so the previously-final element gains one and every appended
// element but the last carries its own.
if (appended.length > 0)
{
  lines[closing - 1] += ',';
  lines.splice(closing, 0, ...appended.map((line, index) => index === appended.length - 1 ? line : `${line},`));
}

// parse before writing, never after, and prove every entry sits at its own id. MapInfos is the one file
// in data/ that is genuinely painful to lose, and a corrupt tree that has already hit disk is a restore
// rather than a re-run.
const rebuilt = lines.join('\n');
const check = JSON.parse(rebuilt);
check.forEach((info, index) =>
{
  if (info && info.id !== index) throw new Error(`MapInfos would put Map${info.id} at index ${index}; nothing written`);
});
await Bun.write(infoPath, rebuilt);
console.log(`registered ${pending.length} map(s) in MapInfos`);
//endregion install
