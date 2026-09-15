//region nimbus
/**
 * The Nimbus dungeon: eighteen draft maps of walkable cloud above the Negative Peaks, built to the
 * spec in `docs/maps/nimbus.md`. Terrain, structures and teleport events only - no enemies, no
 * interactables, no save sigil, no boss.
 *
 * The gradient the doc locks runs white to gold: the arrival island is humble cloud, gilding
 * creeps in through the causeway and the approach, and the throne room is solid gold filigree.
 * The palette below is ordered to match that.
 *
 * Usage: bun tools/mapgen/dungeons/nimbus.js && bun tools/mapgen/validate.js 363 ... 380
 */
import { K, W, blob, span, box, ring, render, transferEvent, serialise, OUT } from '../terrain.js';

/**
 * How far into a map the landing square sits from its doorway, per arrival facing.
 * @type {Object<number, number[]>}
 */
const DELTA = { 2: [0, 1], 4: [-1, 0], 6: [1, 0], 8: [0, -1] };

/**
 * The map tree node these eighteen maps hang under: Map122, "DUNGEON: Nimbus".
 * @type {number}
 */
const PARENT = 122;

// Every link names both doorways. `dir` is the way the player faces on arrival, which always points
// into the map, so the landing square is one step that way and the touch event never re-fires.
const LINKS = [
  { a: { map: 322, ev: [22, 14], dir: 8, silent: true }, b: { map: 363, ev: [20, 22], dir: 2 } },
  { a: { map: 363, ev: [33, 15], dir: 4 }, b: { map: 364, ev: [4, 20], dir: 6 } },
  { a: { map: 364, ev: [26, 3], dir: 2 }, b: { map: 365, ev: [20, 25], dir: 8 } },
  { a: { map: 364, ev: [46, 22], dir: 4 }, b: { map: 366, ev: [3, 20], dir: 6 } },
  { a: { map: 366, ev: [47, 18], dir: 4 }, b: { map: 367, ev: [5, 20], dir: 6 } },
  { a: { map: 367, ev: [24, 5], dir: 2 }, b: { map: 368, ev: [20, 25], dir: 8 } },
  { a: { map: 367, ev: [44, 26], dir: 4 }, b: { map: 369, ev: [20, 35], dir: 8 } },
  { a: { map: 367, ev: [24, 35], dir: 8 }, b: { map: 370, ev: [4, 20], dir: 6 } },
  { a: { map: 370, ev: [47, 20], dir: 4 }, b: { map: 371, ev: [4, 22], dir: 6 } },
  { a: { map: 371, ev: [12, 6], dir: 2 }, b: { map: 372, ev: [20, 24], dir: 8 } },
  { a: { map: 371, ev: [38, 6], dir: 2 }, b: { map: 373, ev: [20, 24], dir: 8 } },
  { a: { map: 371, ev: [25, 37], dir: 8 }, b: { map: 374, ev: [20, 6], dir: 2 } },
  { a: { map: 371, ev: [25, 4], dir: 2 }, b: { map: 375, ev: [20, 25], dir: 8 } },
  { a: { map: 375, ev: [20, 5], dir: 2 }, b: { map: 376, ev: [25, 34], dir: 8 } },
  { a: { map: 376, ev: [25, 5], dir: 2 }, b: { map: 377, ev: [20, 26], dir: 8 } },
  { a: { map: 377, ev: [20, 3], dir: 2 }, b: { map: 378, ev: [15, 20], dir: 8 } },
  { a: { map: 378, ev: [15, 4], dir: 2 }, b: { map: 379, ev: [20, 20], dir: 8 } },
  { a: { map: 379, ev: [20, 4], dir: 2 }, b: { map: 380, ev: [25, 35], dir: 8 } },
];

const sky = { parallax: 'IslandofSky1', loop: true };
const inner = { parallax: 'Clouds', loop: true };

const SPECS = [
  { id: 363, tree: 'Arrival Island', display: 'Humble Arrival', w: 40, h: 30, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 20, 16, 14, 9, 3631);
      blob(g, w, h, K.pale, 20, 16, 5, 3, 3632, 0.35);
    } },
  { id: 364, tree: 'Cloudbreak', display: 'Cloudbreak', w: 50, h: 40, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 11, 20, 8, 7, 3641);
      blob(g, w, h, K.cloud, 26, 20, 9, 8, 3642);
      blob(g, w, h, K.cloud, 26, 8, 7, 6, 3643);
      blob(g, w, h, K.cloud, 42, 22, 7, 6, 3644);
      span(g, w, h, K.cloud, [17, 20], [19, 20], 3);
      span(g, w, h, K.cloud, [26, 13], [26, 14], 3);
      span(g, w, h, K.cloud, [34, 21], [36, 22], 3);
      blob(g, w, h, K.grass, 26, 8, 4, 3, 3645, 0.4);
    } },
  { id: 365, tree: 'Whispering Fall', display: 'Whispering Fall', w: 40, h: 30, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 20, 15, 11, 8, 3651);
      blob(g, w, h, K.grass, 20, 14, 6, 4, 3652, 0.4);
      span(g, w, h, K.cloud, [20, 22], [20, 26], 3);
    } },
  { id: 366, tree: 'The Long Span', display: 'The Long Span', w: 50, h: 40, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 8, 20, 6, 5, 3661);
      blob(g, w, h, K.cloud, 19, 13, 5, 5, 3662);
      blob(g, w, h, K.cloud, 31, 25, 5, 5, 3663);
      blob(g, w, h, K.cloud, 43, 18, 7, 6, 3664);
      span(g, w, h, K.cloud, [12, 19], [16, 14], 3);
      span(g, w, h, K.cloud, [21, 17], [29, 22], 3);
      span(g, w, h, K.cloud, [35, 24], [40, 20], 3);
      blob(g, w, h, K.sand, 43, 18, 4, 3, 3665, 0.4);
    } },
  { id: 367, tree: 'Sunlit Terrace', display: 'Sunlit Terrace', w: 50, h: 40, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 25, 20, 18, 13, 3671);
      blob(g, w, h, K.grass, 19, 21, 8, 6, 3672, 0.35);
      blob(g, w, h, K.sand, 33, 16, 6, 4, 3673, 0.35);
      span(g, w, h, K.cloud, [25, 9], [25, 4], 3);
      span(g, w, h, K.cloud, [25, 31], [25, 36], 3);
      span(g, w, h, K.cloud, [40, 25], [45, 26], 3);
      span(g, w, h, K.cloud, [10, 20], [4, 20], 3);
    } },
  { id: 368, tree: 'Goldenmist Fall', display: 'Goldenmist Fall', w: 40, h: 30, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 20, 15, 11, 8, 3681);
      blob(g, w, h, K.gild, 20, 14, 5, 3, 3682, 0.4);
      span(g, w, h, K.cloud, [20, 22], [20, 26], 3);
    } },
  { id: 369, tree: 'The Aerie', display: 'The Aerie', w: 40, h: 40, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 20, 26, 12, 8, 3691);
      blob(g, w, h, K.stone, 20, 11, 8, 6, 3692);
      span(g, w, h, K.cloud, [20, 18], [20, 22], 3);
      blob(g, w, h, K.sand, 20, 10, 4, 3, 3693, 0.4);
      span(g, w, h, K.cloud, [20, 33], [20, 36], 3);
    } },
  { id: 370, tree: 'Gilded Causeway', display: 'Gilded Causeway', w: 50, h: 40, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 11, 20, 8, 7, 3701);
      blob(g, w, h, K.gild, 40, 20, 9, 8, 3702);
      span(g, w, h, K.gild, [18, 20], [32, 20], 5);
      span(g, w, h, K.gild, [44, 20], [48, 20], 3);
    } },
  { id: 371, tree: 'Palace Approach', display: 'Palace Approach', w: 50, h: 40, ...inner, paint: (g, w, h) => {
      blob(g, w, h, K.gild, 25, 22, 19, 13, 3711);
      box(g, w, h, K.gold, 17, 16, 33, 29);
      span(g, w, h, K.gild, [6, 22], [3, 22], 3);
      span(g, w, h, K.gild, [18, 16], [12, 5], 3);
      span(g, w, h, K.gild, [32, 16], [38, 5], 3);
      span(g, w, h, K.gild, [25, 30], [25, 38], 3);
      span(g, w, h, K.gold, [25, 15], [25, 3], 5);
    } },
  { id: 372, tree: 'West Gatehouse', display: 'West Gatehouse', w: 40, h: 30, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 20, 15, 14, 11, 3721);
      box(g, w, h, K.pale, 12, 8, 28, 20);
      ring(g, w, h, W.whiteStone, 11, 7, 29, 21);
      box(g, w, h, K.pale, 19, 21, 21, 21);
      span(g, w, h, K.cloud, [20, 21], [20, 26], 3);
    } },
  { id: 373, tree: 'East Gatehouse', display: 'East Gatehouse', w: 40, h: 30, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 20, 15, 14, 11, 3731);
      box(g, w, h, K.pale, 12, 8, 28, 20);
      ring(g, w, h, W.whiteStone, 11, 7, 29, 21);
      box(g, w, h, K.pale, 19, 21, 21, 21);
      span(g, w, h, K.cloud, [20, 21], [20, 26], 3);
    } },
  { id: 374, tree: 'Approach Rest', display: 'A Gilded Reprieve', w: 40, h: 30, ...sky, paint: (g, w, h) => {
      blob(g, w, h, K.cloud, 20, 16, 12, 8, 3741);
      blob(g, w, h, K.gild, 20, 16, 5, 3, 3742, 0.35);
      span(g, w, h, K.cloud, [20, 9], [20, 4], 3);
    } },
  { id: 375, tree: 'Grand Entry Hall', display: 'Grand Entry Hall', w: 40, h: 30, ...inner, paint: (g, w, h) => {
      box(g, w, h, K.gold, 6, 6, 33, 24);
      ring(g, w, h, W.goldBrick, 5, 5, 34, 25);
      box(g, w, h, K.gold, 19, 25, 21, 25);
      box(g, w, h, K.gold, 19, 5, 21, 5);
    } },
  { id: 376, tree: 'Pillared Hall', display: 'Hall of Pillars', w: 50, h: 40, ...inner, paint: (g, w, h) => {
      box(g, w, h, K.gold, 6, 6, 43, 33);
      ring(g, w, h, W.goldBrick, 5, 5, 44, 34);
      [12, 20, 29, 37].forEach(px => [12, 20, 27].forEach(py =>
        box(g, w, h, W.goldBrick, px, py, px + 1, py + 1)));
      box(g, w, h, K.gold, 24, 34, 26, 34);
      box(g, w, h, K.gold, 24, 5, 26, 5);
    } },
  { id: 377, tree: 'Gilded Stair', display: 'The Gilded Stair', w: 40, h: 30, ...inner, paint: (g, w, h) => {
      box(g, w, h, K.gold, 12, 4, 27, 25);
      ring(g, w, h, W.goldBrick, 11, 3, 28, 26);
      box(g, w, h, K.gild, 16, 8, 23, 20);
      box(g, w, h, K.gold, 19, 26, 21, 26);
      box(g, w, h, K.gold, 19, 3, 21, 3);
    } },
  { id: 378, tree: 'Hall of Repose', display: 'Hall of Repose', w: 30, h: 25, ...inner, paint: (g, w, h) => {
      box(g, w, h, K.pale, 6, 5, 23, 19);
      ring(g, w, h, W.whiteStone, 5, 4, 24, 20);
      box(g, w, h, K.gild, 12, 9, 17, 14);
      box(g, w, h, K.pale, 14, 20, 16, 20);
      box(g, w, h, K.pale, 14, 4, 16, 4);
    } },
  { id: 379, tree: 'The Final Door', display: 'The Final Door', w: 40, h: 25, ...inner, paint: (g, w, h) => {
      box(g, w, h, K.gold, 10, 5, 29, 19);
      ring(g, w, h, W.goldBrick, 9, 4, 30, 20);
      box(g, w, h, K.gold, 19, 20, 21, 20);
      box(g, w, h, K.gold, 19, 4, 21, 4);
    } },
  { id: 380, tree: 'Throne of Glory', display: 'Throne of Glory', w: 50, h: 40, ...inner, paint: (g, w, h) => {
      box(g, w, h, K.gold, 6, 5, 43, 34);
      ring(g, w, h, W.goldBrick, 5, 4, 44, 35);
      box(g, w, h, K.gild, 18, 7, 31, 15);
      [10, 39].forEach(px => [10, 18, 26].forEach(py =>
        box(g, w, h, W.goldBrick, px, py, px + 1, py + 1)));
      box(g, w, h, K.gold, 24, 35, 26, 35);
    } },

  // The teleportal room is not part of the dungeon; it hangs under the Central Teleportal Hub with
  // its four built siblings, and every one of those is 32x25 with the portal at (15,10) and the exit
  // at (14,19). Matching those coordinates exactly is what lets the hub door wire up unchanged.
  { id: 381, tree: 'Nimbus Teleportal', display: 'To Nimbus', w: 32, h: 25, parent: 194,
    parallax: 'Space', loop: false, paint: (g, w, h) => {
      box(g, w, h, K.gold, 7, 4, 24, 20);
      ring(g, w, h, W.goldBrick, 6, 3, 25, 21);
      box(g, w, h, K.gild, 13, 8, 17, 12);
    } },
];

// --- assemble ----------------------------------------------------------------------------------
const exitsFor = id =>
{
  const out = [];
  for (const link of LINKS)
    for (const [self, other] of [ [link.a, link.b], [link.b, link.a] ])
    {
      if (self.map !== id || self.silent) continue;
      const [dx, dy] = DELTA[other.dir];
      out.push({
        name: `Transfer (${SPECS.find(s => s.id === other.map)?.tree ?? `Map${other.map}`})`,
        x: self.ev[0], y: self.ev[1],
        to: { map: other.map, x: other.ev[0] + dx, y: other.ev[1] + dy, dir: other.dir },
      });
    }
  return out;
};

/**
 * Erases every walkable square the entrance cannot reach.
 * Islands are grown from noise, so a stray shelf beyond a wall is a normal by-product rather than
 * a mistake worth hand-patching - and an unreachable shelf is indistinguishable from sky anyway.
 */
const prune = (grid, w, h, entrance) =>
{
  if (!entrance) return;
  const walkable = (x, y) => x >= 0 && y >= 0 && x < w && y < h && grid[y][x] !== null && grid[y][x] < 80;
  const seen = new Set();
  const stack = [ [ entrance.x, entrance.y ] ];
  seen.add(stack[0].join(","));
  while (stack.length)
  {
    const [ cx, cy ] = stack.pop();
    for (const [ dx, dy ] of [ [0,1],[0,-1],[1,0],[-1,0] ])
    {
      const nx = cx + dx, ny = cy + dy, key = nx + "," + ny;
      if (seen.has(key) || !walkable(nx, ny)) continue;
      seen.add(key); stack.push([ nx, ny ]);
    }
  }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (walkable(x, y) && !seen.has(x + "," + y)) grid[y][x] = null;
};

const built = [];
for (const spec of SPECS)
{
  const { w, h } = spec;
  const grid = Array.from({ length: h }, () => new Array(w).fill(null));
  spec.paint(grid, w, h);
  // ground the player can never stand on is a lie the map tells; sky is the honest answer, and
  // clearing it before rendering lets the cloud edges close around the real shoreline.
  prune(grid, w, h, exitsFor(spec.id)[0]);
  const data = render(grid, w, h);
  const events = [ null ];
  exitsFor(spec.id).forEach((e, i) => events.push(transferEvent(i + 1, e.name, e.x, e.y, e.to)));
  built.push({
    id: spec.id, tree: spec.tree, grid, parent: spec.parent,
    autoplayBgm: false, autoplayBgs: false, battleback1Name: '', battleback2Name: '',
    bgm: { name: '', pan: 0, pitch: 100, volume: 90 }, bgs: { name: '', pan: 0, pitch: 100, volume: 90 },
    disableDashing: false, displayName: spec.display, encounterList: [], encounterStep: 30,
    height: h, note: '', parallaxLoopX: spec.loop, parallaxLoopY: false, parallaxName: spec.parallax,
    parallaxShow: true, parallaxSx: 0, parallaxSy: 0, scrollType: 0, specifyBattleback: false,
    tilesetId: 20, width: w, data, events,
  });
}

await Bun.$`mkdir -p ${OUT}`.quiet();
for (const m of built)
{
  await Bun.write(`${OUT}/Map${m.id}.json`, serialise(m));
}
// the manifest is what `install.js` reads, so it carries everything MapInfos needs and nothing else.
const manifest = built.map(m => ({
  id: m.id, tree: m.tree, parentId: m.parent ?? PARENT, order: m.id, w: m.width, h: m.height,
  events: m.events.filter(Boolean).length,
}));
await Bun.write(`${OUT}/_built.json`, JSON.stringify(manifest));

console.log(`wrote ${built.length} maps to staging`);
built.forEach(m => console.log(`  Map${m.id} ${m.tree.padEnd(18)} ${m.width}x${m.height}  exits=${m.events.filter(Boolean).length}`));
//endregion nimbus
