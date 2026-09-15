//region install
/**
 * Moves staged maps into `data/` and registers them in `MapInfos.json`.
 *
 * This is the only file in `tools/mapgen` that writes to the database, and it is deliberately
 * timid about it: it refuses to overwrite a map that already exists, refuses to register an id
 * that is already registered, and appends to `MapInfos.json` rather than rewriting it, so the
 * diff is the new lines and one comma.
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
const lines = text.split('\n');
const closing = lines.lastIndexOf(']');
const last = closing - 1;

const pending = manifest.filter(entry => !text.includes(`{"id":${entry.id},`));

if (pending.length === 0)
{
  console.log('every map is already registered in MapInfos');
  process.exit(0);
}

// the editor writes one entry per line and no trailing comma, so the previously-final entry gains
// one and every new entry but the last carries its own.
const entries = pending.map(entry => JSON.stringify({
  id: entry.id,
  expanded: false,
  name: entry.tree,
  order: entry.order,
  parentId: entry.parentId,
  scrollX: 1101,
  scrollY: 701.5,
}));

lines[last] += ',';
lines.splice(closing, 0, ...entries.map((e, i) => i === entries.length - 1 ? e : `${e},`));

// parse before writing, never after. MapInfos is the one file in data/ that is genuinely painful
// to lose, and a corrupt append that has already hit disk is a restore rather than a re-run.
const rebuilt = lines.join('\n');
JSON.parse(rebuilt);
await Bun.write(infoPath, rebuilt);
console.log(`registered ${entries.length} map(s) in MapInfos`);
//endregion install
