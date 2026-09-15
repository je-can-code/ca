//region validate
/**
 * Proves a generated dungeon is actually playable before it goes anywhere near `data/`.
 *
 * Three things go wrong when maps are written by a script, and none of them are visible in the
 * JSON: a transfer event sitting on empty sky, a landing square inside a wall, and a stretch of
 * ground with no path to the entrance. All three look completely normal in the editor's tile view
 * and only show up when somebody walks there. So this reproduces `Game_Map#checkPassage` exactly,
 * floods the map from its entrance, and follows every transfer to the square it actually lands on
 * - including landings on maps that shipped long ago.
 *
 * Usage: bun tools/mapgen/validate.js 363 364 365 ...
 */
import { DATA, loadMap } from './paths.js';

const tilesets = JSON.parse(await Bun.file(`${DATA}/Tilesets.json`).text());

const args = process.argv.slice(2);
const preferStaging = args.includes('--staged');

/**
 * Loads a map for checking, honouring the `--staged` flag.
 * @param {number} id The map id.
 * @returns {Promise<Object>}
 */
const load = id => loadMap(id, preferStaging);

/**
 * `Game_Map#checkPassage` with the 0x0f passage bit, reproduced rather than approximated.
 *
 * The star bit is the part worth knowing: a star tile is skipped entirely, and a square whose
 * every layer is skipped falls out of the loop impassable. Empty sky is four zeros, tile 0 carries
 * the star flag in every tileset here, and that is why an unpainted square blocks for free.
 * @param {Object} map The map data.
 * @param {number[]} flags The tileset's flag table.
 * @param {number} x The tile column.
 * @param {number} y The tile row.
 * @returns {boolean}
 */
const passable = (map, flags, x, y) =>
{
  const { width: w, height: h, data } = map;

  if (x < 0 || y < 0 || x >= w || y >= h) return false;

  for (let z = 3; z >= 0; z--)
  {
    const flag = flags[data[(z * h + y) * w + x]] ?? 0;

    if ((flag & 0x10) !== 0) continue;
    if ((flag & 0x0f) === 0) return true;
    if ((flag & 0x0f) === 0x0f) return false;
  }

  return false;
};

/**
 * Every square reachable on foot from a starting tile.
 * @param {Object} map The map data.
 * @param {number[]} flags The tileset's flag table.
 * @param {number[]} start The `[x, y]` to flood from.
 * @returns {Set<string>} The reached squares, keyed `"x,y"`.
 */
const flood = (map, flags, start) =>
{
  const seen = new Set();

  if (!start || !passable(map, flags, start[0], start[1])) return seen;

  const stack = [ start ];
  seen.add(start.join(','));

  while (stack.length)
  {
    const [ cx, cy ] = stack.pop();
    for (const [ dx, dy ] of [ [ 0, 1 ], [ 0, -1 ], [ 1, 0 ], [ -1, 0 ] ])
    {
      const nx = cx + dx;
      const ny = cy + dy;
      const key = `${nx},${ny}`;

      if (seen.has(key) || !passable(map, flags, nx, ny)) continue;

      seen.add(key);
      stack.push([ nx, ny ]);
    }
  }

  return seen;
};

const ids = args.filter(a => !a.startsWith('--')).map(Number);

if (ids.length === 0)
{
  console.log('usage: bun tools/mapgen/validate.js [--staged] <mapId> [mapId...]');
}

const landings = [];
let problems = 0;

for (const id of ids)
{
  const map = await load(id);
  const flags = tilesets[map.tilesetId].flags;
  const { width: w, height: h } = map;
  const events = map.events.filter(Boolean);

  // a visit always begins on a doorway, so that is the honest place to measure reachability from.
  const start = events[0] ? [ events[0].x, events[0].y ] : null;
  const reached = flood(map, flags, start);

  let walkable = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (passable(map, flags, x, y)) walkable++;

  const issues = [];
  if (!start) issues.push('no events');
  else if (!passable(map, flags, ...start)) issues.push(`start ${start} is not walkable`);

  events.forEach(e =>
  {
    if (!passable(map, flags, e.x, e.y)) issues.push(`event ${e.id} "${e.name}" at ${e.x},${e.y} sits on sky`);
    else if (!reached.has(`${e.x},${e.y}`)) issues.push(`event ${e.id} "${e.name}" at ${e.x},${e.y} is unreachable`);

    const transfer = e.pages[0].list.find(c => c.code === 201);
    if (transfer) landings.push({ from: `${id}#${e.id}`, params: transfer.parameters });
  });

  problems += issues.length;
  console.log(
    `Map${id} ${`${w}x${h}`.padEnd(6)} walkable=${String(walkable).padStart(5)} reached=${String(reached.size).padStart(5)}` +
    ` orphaned=${String(walkable - reached.size).padStart(4)}` +
    (issues.length ? `  !! ${issues.join(' | ')}` : '  ok'));
}

for (const { from, params } of landings)
{
  const [ , dest, dx, dy ] = params;
  const map = await load(dest);

  if (!map.width)
  {
    console.log(`  !! ${from} transfers to Map${dest}, which is 0x0`);
    problems++;
    continue;
  }

  if (!passable(map, tilesets[map.tilesetId].flags, dx, dy))
  {
    console.log(`  !! ${from} lands on Map${dest} (${dx},${dy}), which is not walkable`);
    problems++;
  }
}

console.log(`\n${problems === 0 ? 'clean' : `${problems} problem(s)`} across ${ids.length} map(s), ${landings.length} transfer(s) followed`);
//endregion validate
