//region terrain
/**
 * The shape vocabulary a dungeon recipe draws with, and the renderer that turns it into map JSON.
 *
 * A recipe paints into a grid of autotile kinds - blobs, spans, boxes, rings - and this file is
 * the only place that knows how a kind becomes a tile id, how the six layers are laid out, and
 * how the editor writes a map file. Recipes live under `dungeons/`.
 */
import { a2TileId } from './autotile.js';
import { STAGING } from './paths.js';

const OUT = STAGING;

// --- ground palette, verified against the sheet rather than recalled -----------------------------
const K = {
  cloud: 28,   // fluffy white cloud platform, cloud-edged
  grass: 34,   // green grass on a cloud edge
  sand:  27,   // warm tan on a cloud edge
  gild:  45,   // gold filigree on a cloud edge
  stone: 36,   // grey stone on a cloud edge
  gold:  43,   // solid gold filigree, no cloud edge - palace flooring
  pale:  26,   // plain soft white, no cloud edge
};
// A4 wall sides, all confirmed blocked in tileset 20's flags.
const W = { goldBrick: 91, whiteStone: 93 };

const A4_SIDE_SHAPE = {0:3,2:12,8:14,10:12,16:10,18:9,24:8,26:8,64:3,66:4,72:2,74:4,80:2,82:1,88:2,90:0};

// --- deterministic noise so a re-run reproduces the same coastline ------------------------------
const rng = seed => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;

/**
 * Paints an organic island. A plain ellipse reads as a stamped oval; perturbing the radius by a
 * few tiles per angle is what makes it look like weather instead of geometry.
 */
const blob = (grid, w, h, kind, cx, cy, rx, ry, seed, wobble = 0.28) =>
{
  const r = rng(seed);
  const steps = 64;
  const radii = Array.from({ length: steps }, () => 1 + (r() - 0.5) * 2 * wobble);
  // smooth the noise so neighbouring angles agree and the edge undulates rather than spikes.
  const smooth = radii.map((_, i) =>
    (radii[(i - 1 + steps) % steps] + radii[i] * 2 + radii[(i + 1) % steps]) / 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
    {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d === 0) { grid[y][x] = kind; continue; }
      const ang = Math.atan2(dy, dx);
      const idx = Math.floor(((ang + Math.PI) / (2 * Math.PI)) * steps) % steps;
      if (d <= smooth[idx]) grid[y][x] = kind;
    }
};

/** Lays a walkway between two points, thick enough to walk and to read as built rather than eroded. */
const span = (grid, w, h, kind, [x1, y1], [x2, y2], thick = 3) =>
{
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2 + 1;
  const half = Math.floor(thick / 2);
  for (let i = 0; i <= steps; i++)
  {
    const t = i / steps;
    const cx = Math.round(x1 + (x2 - x1) * t), cy = Math.round(y1 + (y2 - y1) * t);
    for (let dy = -half; dy <= half; dy++)
      for (let dx = -half; dx <= half; dx++)
      {
        const x = cx + dx, y = cy + dy;
        if (x >= 0 && y >= 0 && x < w && y < h) grid[y][x] = kind;
      }
  }
};

/** Fills an axis-aligned box. Used for palace rooms, which are architecture and should look it. */
const box = (grid, w, h, kind, x1, y1, x2, y2) =>
{
  for (let y = Math.max(0, y1); y <= Math.min(h - 1, y2); y++)
    for (let x = Math.max(0, x1); x <= Math.min(w - 1, x2); x++) grid[y][x] = kind;
};

/** A hollow ring of wall around a room, one tile thick. */
const ring = (grid, w, h, kind, x1, y1, x2, y2) =>
{
  for (let x = x1; x <= x2; x++) { grid[y1][x] = kind; grid[y2][x] = kind; }
  for (let y = y1; y <= y2; y++) { grid[y][x1] = kind; grid[y][x2] = kind; }
};

const isWall = k => k >= 80;

/**
 * Turns the kind grid into the six-layer tile array.
 * A-tiles all live on layer 0 in this project (Map322 is the reference), so layers 1-5 stay empty
 * and the void keeps its zeros, which is what makes empty sky impassable.
 */
const render = (grid, w, h) =>
{
  const data = new Array(w * h * 6).fill(0);
  const kindAt = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? undefined : (grid[y][x] ?? -1);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
    {
      const k = grid[y][x];
      if (k === null || k === undefined) continue;
      let id;
      if (isWall(k))
      {
        let mask = 0;
        [[0, -1, 2], [-1, 0, 8], [1, 0, 16], [0, 1, 64]].forEach(([dx, dy, bit]) =>
        {
          const n = kindAt(x + dx, y + dy);
          if (n === k || n === undefined) mask |= bit;
        });
        id = 2048 + k * 48 + (A4_SIDE_SHAPE[mask] ?? 0);
      }
      else
      {
        id = a2TileId(kindAt, x, y);
      }
      data[(0 * h + y) * w + x] = id;
    }
  return data;
};

// --- events ------------------------------------------------------------------------------------
const BLANK_CONDITIONS = {
  actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: 'A', selfSwitchValid: false,
  switch1Id: 1, switch1Valid: false, switch2Id: 1, switch2Valid: false,
  variableId: 1, variableValid: false, variableValue: 0,
};

/** A transfer event, shaped exactly like Map322's Transfer (Peak Rest). */
const transferEvent = (id, name, x, y, to) => ({
  id, name, note: '',
  pages: [ {
    conditions: { ...BLANK_CONDITIONS },
    directionFix: false,
    image: { characterIndex: 0, characterName: '', direction: 2, pattern: 0, tileId: 0 },
    list: [
      { code: 250, indent: 0, parameters: [ { name: 'Move1', volume: 90, pitch: 100, pan: 0 } ] },
      { code: 201, indent: 0, parameters: [ 0, to.map, to.x, to.y, to.dir, 0 ] },
      { code: 0, indent: 0, parameters: [] },
    ],
    moveFrequency: 3,
    moveRoute: { list: [ { code: 0, parameters: [] } ], repeat: true, skippable: false, wait: false },
    moveSpeed: 3, moveType: 0, priorityType: 0, stepAnime: false, through: false, trigger: 1, walkAnime: true,
  } ],
  x, y,
});

// --- serialisation, matching the editor's own line discipline -----------------------------------
const HEADER_KEYS = [ 'autoplayBgm', 'autoplayBgs', 'battleback1Name', 'battleback2Name', 'bgm', 'bgs',
  'disableDashing', 'displayName', 'encounterList', 'encounterStep', 'height', 'note', 'parallaxLoopX',
  'parallaxLoopY', 'parallaxName', 'parallaxShow', 'parallaxSx', 'parallaxSy', 'scrollType',
  'specifyBattleback', 'tilesetId', 'width' ];

const serialise = map =>
{
  const header = HEADER_KEYS.map(k => `${JSON.stringify(k)}:${JSON.stringify(map[k])}`).join(',');
  const events = map.events.map(e => e === null ? 'null' : JSON.stringify(e));
  return `{\n${header},\n"data":${JSON.stringify(map.data)},\n"events":[\n${events.join(',\n')}\n]\n}`;
};

export { K, W, blob, span, box, ring, render, transferEvent, serialise, OUT };
//endregion terrain
