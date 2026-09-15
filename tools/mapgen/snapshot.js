//region snapshot
/**
 * Renders a map to a PNG the way the game draws it.
 *
 * Text floor plans answer "can you walk there"; they cannot answer "does it look right", which is
 * the only question that matters when the map is somebody's art. This composites the real tileset
 * sheets using the engine's own autotile tables - lifted from `js/rmmz_core.js` rather than
 * reconstructed - so a wall corner that is wrong here is wrong in the game too.
 *
 * Events are drawn from their character sheets at their page-0 image and facing, because a room
 * reads completely differently once the save sigil and the furniture are standing in it.
 *
 * Usage: bun tools/mapgen/snapshot.js 83 [--out path.png] [--no-events] [--scale 1]
 */
import { DATA, loadMap } from './paths.js';

const ROOT = `${import.meta.dir}/../..`;
const TILE = 48;

// --- the engine's quadrant tables, copied verbatim from js/rmmz_core.js -------------------------
const FLOOR_AUTOTILE_TABLE = [
  [[2,4],[1,4],[2,3],[1,3]], [[2,0],[1,4],[2,3],[1,3]], [[2,4],[3,0],[2,3],[1,3]], [[2,0],[3,0],[2,3],[1,3]],
  [[2,4],[1,4],[2,3],[3,1]], [[2,0],[1,4],[2,3],[3,1]], [[2,4],[3,0],[2,3],[3,1]], [[2,0],[3,0],[2,3],[3,1]],
  [[2,4],[1,4],[2,1],[1,3]], [[2,0],[1,4],[2,1],[1,3]], [[2,4],[3,0],[2,1],[1,3]], [[2,0],[3,0],[2,1],[1,3]],
  [[2,4],[1,4],[2,1],[3,1]], [[2,0],[1,4],[2,1],[3,1]], [[2,4],[3,0],[2,1],[3,1]], [[2,0],[3,0],[2,1],[3,1]],
  [[0,4],[1,4],[0,3],[1,3]], [[0,4],[3,0],[0,3],[1,3]], [[0,4],[1,4],[0,3],[3,1]], [[0,4],[3,0],[0,3],[3,1]],
  [[2,2],[1,2],[2,3],[1,3]], [[2,2],[1,2],[2,3],[3,1]], [[2,2],[1,2],[2,1],[1,3]], [[2,2],[1,2],[2,1],[3,1]],
  [[2,4],[3,4],[2,3],[3,3]], [[2,4],[3,4],[2,1],[3,3]], [[2,0],[3,4],[2,3],[3,3]], [[2,0],[3,4],[2,1],[3,3]],
  [[2,4],[1,4],[2,5],[1,5]], [[2,0],[1,4],[2,5],[1,5]], [[2,4],[3,0],[2,5],[1,5]], [[2,0],[3,0],[2,5],[1,5]],
  [[0,4],[3,4],[0,3],[3,3]], [[2,2],[1,2],[2,5],[1,5]], [[0,2],[1,2],[0,3],[1,3]], [[0,2],[1,2],[0,3],[3,1]],
  [[2,2],[3,2],[2,3],[3,3]], [[2,2],[3,2],[2,1],[3,3]], [[2,4],[3,4],[2,5],[3,5]], [[2,0],[3,4],[2,5],[3,5]],
  [[0,4],[1,4],[0,5],[1,5]], [[0,4],[3,0],[0,5],[1,5]], [[0,2],[3,2],[0,3],[3,3]], [[0,2],[1,2],[0,5],[1,5]],
  [[0,4],[3,4],[0,5],[3,5]], [[2,2],[3,2],[2,5],[3,5]], [[0,2],[3,2],[0,5],[3,5]], [[0,0],[1,0],[0,1],[1,1]],
];
const WALL_AUTOTILE_TABLE = [
  [[2,2],[1,2],[2,1],[1,1]], [[0,2],[1,2],[0,1],[1,1]], [[2,0],[1,0],[2,1],[1,1]], [[0,0],[1,0],[0,1],[1,1]],
  [[2,2],[3,2],[2,1],[3,1]], [[0,2],[3,2],[0,1],[3,1]], [[2,0],[3,0],[2,1],[3,1]], [[0,0],[3,0],[0,1],[3,1]],
  [[2,2],[1,2],[2,3],[1,3]], [[0,2],[1,2],[0,3],[1,3]], [[2,0],[1,0],[2,3],[1,3]], [[0,0],[1,0],[0,3],[1,3]],
  [[2,2],[3,2],[2,3],[3,3]], [[0,2],[3,2],[0,3],[3,3]], [[2,0],[3,0],[2,3],[3,3]], [[0,0],[3,0],[0,3],[3,3]],
];
const WATERFALL_AUTOTILE_TABLE = [
  [[2,0],[1,0],[2,1],[1,1]], [[0,0],[1,0],[0,1],[1,1]], [[2,0],[3,0],[2,1],[3,1]], [[0,0],[3,0],[0,1],[3,1]],
];

const isAutotile = id => id >= 2048;
const kindOf = id => Math.floor((id - 2048) / 48);
const shapeOf = id => (id - 2048) % 48;
const isA1 = id => id >= 2048 && id < 2816;
const isA2 = id => id >= 2816 && id < 4352;
const isA3 = id => id >= 4352 && id < 5888;
const isA4 = id => id >= 5888;
const isA5 = id => id >= 1536 && id < 1664;

// --- raw pixel helpers --------------------------------------------------------------------------
/**
 * Decodes an image to a raw RGBA buffer through ImageMagick.
 *
 * Going out to a process beats hand-rolling a PNG decoder: these sheets use interlacing and palette
 * modes that a minimal decoder gets wrong silently, and silently-wrong pixels are the worst kind.
 * @param {string} path The image file.
 * @returns {Promise<{w: number, h: number, px: Uint8Array}|null>}
 */
const decode = async path =>
{
  const file = Bun.file(path);
  if (!await file.exists()) return null;

  const header = new DataView(await file.slice(0, 32).arrayBuffer());
  const w = header.getUint32(16);
  const h = header.getUint32(20);
  const proc = Bun.spawn([ 'magick', path, '-depth', '8', 'rgba:-' ], { stdout: 'pipe' });
  const px = new Uint8Array(await new Response(proc.stdout).arrayBuffer());

  return { w, h, px };
};

/** Alpha-composites a source rectangle onto the canvas. */
const blit = (dst, dw, src, sx, sy, dx, dy, rw, rh) =>
{
  for (let y = 0; y < rh; y++)
  {
    const syy = sy + y;
    const dyy = dy + y;
    if (syy < 0 || syy >= src.h || dyy < 0) continue;

    for (let x = 0; x < rw; x++)
    {
      const sxx = sx + x;
      const dxx = dx + x;
      if (sxx < 0 || sxx >= src.w || dxx < 0 || dxx >= dw) continue;

      const si = (syy * src.w + sxx) * 4;
      const a = src.px[si + 3];
      if (a === 0) continue;

      const di = (dyy * dw + dxx) * 4;
      if (a === 255)
      {
        dst[di] = src.px[si];
        dst[di + 1] = src.px[si + 1];
        dst[di + 2] = src.px[si + 2];
        dst[di + 3] = 255;
        continue;
      }

      const inv = 255 - a;
      dst[di] = (src.px[si] * a + dst[di] * inv) / 255;
      dst[di + 1] = (src.px[si + 1] * a + dst[di + 1] * inv) / 255;
      dst[di + 2] = (src.px[si + 2] * a + dst[di + 2] * inv) / 255;
      dst[di + 3] = Math.min(255, a + dst[di + 3]);
    }
  }
};

// --- main ---------------------------------------------------------------------------------------
const args = process.argv.slice(2);
const flag = name => args.includes(name);
const value = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const id = Number(args.find(a => !a.startsWith('--') && !Number.isNaN(Number(a))));

if (!id)
{
  console.log('usage: bun tools/mapgen/snapshot.js <mapId> [--out path.png] [--no-events] [--staged]');
  process.exit(0);
}

const map = await loadMap(id, flag('--staged'));
const tilesets = JSON.parse(await Bun.file(`${DATA}/Tilesets.json`).text());
const tileset = tilesets[map.tilesetId];
const { width: mw, height: mh, data } = map;
const W = mw * TILE;
const H = mh * TILE;
const canvas = new Uint8Array(W * H * 4);

// the parallax is the floor of the image: on floating or open maps it is most of what you see.
if (map.parallaxName)
{
  const par = await decode(`${ROOT}/chef-adventure/img/parallaxes/${map.parallaxName}.png`);
  if (par) for (let y = 0; y < H; y += par.h) for (let x = 0; x < W; x += par.w) blit(canvas, W, par, 0, 0, x, y, par.w, par.h);
}

const sheets = [];
for (let i = 0; i < 9; i++)
{
  const name = tileset.tilesetNames[i];
  sheets[i] = name ? await decode(`${ROOT}/chef-adventure/img/tilesets/${name}.png`) : null;
}

const readData = (x, y, z) => (x < 0 || y < 0 || x >= mw || y >= mh) ? 0 : data[(z * mh + y) * mw + x];

/** Draws one tile id at a pixel position, autotile or not, exactly as `Tilemap` would. */
const drawTile = (tileId, dx, dy) =>
{
  if (tileId <= 0) return;

  if (!isAutotile(tileId))
  {
    const setNumber = isA5(tileId) ? 4 : 5 + Math.floor(tileId / 256);
    const sheet = sheets[setNumber];
    if (!sheet) return;

    const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * TILE;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * TILE;
    blit(canvas, W, sheet, sx, sy, dx, dy, TILE, TILE);

    return;
  }

  const kind = kindOf(tileId);
  const shape = shapeOf(tileId);
  const tx = kind % 8;
  const ty = Math.floor(kind / 8);
  let setNumber = 0;
  let bx = 0;
  let by = 0;
  let table = FLOOR_AUTOTILE_TABLE;

  if (isA1(tileId))
  {
    // frame 0 of any animation: a snapshot has to pick one, and the first is the authored one.
    if (kind === 0) { bx = 0; by = 0; }
    else if (kind === 1) { bx = 0; by = 3; }
    else if (kind === 2) { bx = 6; by = 0; }
    else if (kind === 3) { bx = 6; by = 3; }
    else
    {
      bx = Math.floor(tx / 4) * 8;
      by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;
      if (kind % 2 === 0) bx += 0;
      else { bx += 6; table = WATERFALL_AUTOTILE_TABLE; }
    }
  }
  else if (isA2(tileId)) { setNumber = 1; bx = tx * 2; by = (ty - 2) * 3; }
  else if (isA3(tileId)) { setNumber = 2; bx = tx * 2; by = (ty - 6) * 2; table = WALL_AUTOTILE_TABLE; }
  else if (isA4(tileId))
  {
    setNumber = 3;
    bx = tx * 2;
    by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
    if (ty % 2 === 1) table = WALL_AUTOTILE_TABLE;
  }

  const sheet = sheets[setNumber];
  if (!sheet) return;

  const quads = table[shape];
  const half = TILE / 2;
  for (let i = 0; i < 4; i++)
  {
    const [ qsx, qsy ] = quads[i];
    blit(canvas, W, sheet,
      (bx * 2 + qsx) * half, (by * 2 + qsy) * half,
      dx + (i % 2) * half, dy + Math.floor(i / 2) * half,
      half, half);
  }
};

for (let z = 0; z <= 3; z++)
  for (let y = 0; y < mh; y++)
    for (let x = 0; x < mw; x++)
      drawTile(readData(x, y, z), x * TILE, y * TILE);

// --- events --------------------------------------------------------------------------------------
if (!flag('--no-events'))
{
  const DIR_ROW = { 2: 0, 4: 1, 6: 2, 8: 3 };
  for (const event of map.events.filter(Boolean))
  {
    // the last page whose conditions are blank is the closest thing to "what the editor shows".
    const image = event.pages[0].image;
    if (!image.characterName) continue;

    const sheet = await decode(`${ROOT}/chef-adventure/img/characters/${image.characterName}.png`);
    if (!sheet) continue;

    // a `$` sheet holds one character in a 3x4 grid; every other sheet holds eight in a 12x8 grid.
    const big = image.characterName.startsWith('$');
    const cw = big ? sheet.w / 3 : sheet.w / 12;
    const ch = big ? sheet.h / 4 : sheet.h / 8;
    const ox = big ? 0 : (image.characterIndex % 4) * 3;
    const oy = big ? 0 : Math.floor(image.characterIndex / 4) * 4;
    const sx = (ox + (image.pattern ?? 1)) * cw;
    const sy = (oy + (DIR_ROW[image.direction] ?? 0)) * ch;

    // characters stand on the bottom-centre of their tile rather than filling it.
    blit(canvas, W, sheet, sx, sy,
      Math.round(event.x * TILE + TILE / 2 - cw / 2),
      Math.round(event.y * TILE + TILE - ch),
      Math.round(cw), Math.round(ch));
  }
}

const out = value('--out', `${ROOT}/tools/mapgen/.staging/Map${id}.png`);
await Bun.$`mkdir -p ${out.slice(0, out.lastIndexOf('/'))}`.quiet();
const writer = Bun.spawn([ 'magick', '-size', `${W}x${H}`, '-depth', '8', 'rgba:-', out ], { stdin: 'pipe' });
writer.stdin.write(canvas);
await writer.stdin.end();
await writer.exited;

console.log(`Map${id} "${map.displayName}" ${mw}x${mh} tiles -> ${out} (${W}x${H}px, tileset ${map.tilesetId} "${tileset.name}")`);
//endregion snapshot
