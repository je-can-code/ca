//region oasis
/**
 * The test oases' shared look and furniture: the brick block floating over the Space parallax that the
 * TESTING lobbies wear, and the small events every test map is built from, such as labels, two-wide exits
 * and copies of events borrowed from other maps.
 *
 * The Enemy Oases and the Boss Halls both draw their lobbies with these, so the two read as one place and
 * a change to the styling lands on both at once.
 */
import { transferEvent } from './terrain.js';
import { CELL } from './cave.js';

/**
 * The regular oasis styling, read off Map359: an A5 floor tile, which `cave.js` cannot lay since it shapes
 * autotiles, and the wall top and wall face kinds. `floor` is only a stand-in kind for the carver, swapped
 * for the real tile by {@link #paveFloors}.
 * @type {{floor: number, ceiling: number, face: number, floorTile: number, portalTile: number}}
 */
const OASIS = { floor: 16, ceiling: 112, face: 120, floorTile: 1556, portalTile: 173 };

/**
 * The layer the exit's glow sits on, as on Map203.
 * @type {number}
 */
const PORTAL_LAYER = 3;

/**
 * Takes a copy of an event from another map, under a new id and on a new square.
 * @param {Object} source The event to copy.
 * @param {number} id The copy's event id.
 * @param {number} x The copy's column.
 * @param {number} y The copy's row.
 * @returns {Object}
 */
const copyEvent = (source, id, x, y) => ({ ...structuredClone(source), id, x, y });

/**
 * A comment line for an event page's tags.
 * @param {string} text The comment.
 * @returns {{code: number, indent: number, parameters: string[]}}
 */
const comment = text => ({ code: 108, indent: 0, parameters: [ text ] });

/**
 * Sets a stretch of a carving to one kind of cell.
 * @param {number[][]} carved The carving, by row then column.
 * @param {number[]} from The rectangle's top left, as [x, y].
 * @param {number[]} to The rectangle's bottom right, as [x, y].
 * @param {number} cell What the rectangle holds, as a {@link CELL}.
 */
const fill = (carved, [ x1, y1 ], [ x2, y2 ], cell) =>
{
  for (let y = y1; y <= y2; y++)
  {
    for (let x = x1; x <= x2; x++)
    {
      carved[y][x] = cell;
    }
  }
};

/**
 * Starts a map as a floating brick block: void all around for the parallax to show through, and solid rock
 * from the second row down to the block's bottom edge.
 * @param {{width: number, height: number, blockLeft: number, blockRight: number, blockBottom: number}} shape
 * The map's size and its block.
 * @returns {number[][]}
 */
const newBlock = shape =>
{
  const carved = Array.from({ length: shape.height }, () => new Array(shape.width).fill(CELL.void));
  fill(carved, [ shape.blockLeft, 1 ], [ shape.blockRight, shape.blockBottom ], CELL.rock);
  return carved;
};

/**
 * Lays the oasis's stone over every carved square. The carver shaped its walls against the stand-in floor,
 * so only the floor tile itself changes here.
 * @param {number[]} data The six-layer tile array.
 * @param {number[][]} carved The carving.
 * @param {number} width The map's width.
 */
const paveFloors = (data, carved, width) =>
{
  carved.forEach((row, y) => row.forEach((cell, x) =>
  {
    if (cell === CELL.floor)
    {
      data[y * width + x] = OASIS.floorTile;
    }
  }));
};

/**
 * Draws a doorway's glow, two squares wide, over the floor of an exit notch.
 * @param {number[]} data The six-layer tile array.
 * @param {number} x The exit's left column.
 * @param {number} y The exit's row.
 * @param {number} width The map's width.
 * @param {number} height The map's height.
 */
const lightPortal = (data, x, y, width, height) =>
{
  [ x, x + 1 ].forEach(column =>
  {
    data[(PORTAL_LAYER * height + y) * width + column] = OASIS.portalTile;
  });
};

/**
 * Wraps an oasis's tiles and events in a map file, with the header the AI Oasis's rooms wear.
 * @param {{tree: string, display: string}} names The map's names.
 * @param {{width: number, height: number}} shape The map's size.
 * @param {number[]} data The six-layer tile array.
 * @param {(Object|null)[]} events The map's events, with slot 0 empty.
 * @returns {Object}
 */
const oasisMap = (names, shape, data, events) =>
{
  return {
    autoplayBgm: true,
    autoplayBgs: false,
    battleback1Name: '',
    battleback2Name: '',
    bgm: { name: '_CT_DreamOfZeal', pan: 0, pitch: 100, volume: 100 },
    bgs: { name: '', pan: 0, pitch: 100, volume: 90 },
    disableDashing: false,
    displayName: names.display,
    encounterList: [],
    encounterStep: 30,
    height: shape.height,
    note: '',
    parallaxLoopX: true,
    parallaxLoopY: true,
    parallaxName: 'Space',
    parallaxShow: true,
    parallaxSx: 2,
    parallaxSy: 1,
    scrollType: 0,
    specifyBattleback: false,
    tilesetId: 4,
    width: shape.width,
    data,
    events,
    tree: names.tree,
  };
};

/**
 * A label: an invisible event whose only job is to draw its text over a square.
 * @param {number} id The event id.
 * @param {number} x The column.
 * @param {number} y The row.
 * @param {string} text What it reads.
 * @returns {Object}
 */
const labelEvent = (id, x, y, text) =>
{
  const event = transferEvent(id, `label: ${text}`, x, y, { map: 1, x: 0, y: 0, dir: 0 });
  const [ page ] = event.pages;
  page.list = [ comment(`<text:${text}>`), { code: 0, indent: 0, parameters: [] } ];
  page.trigger = 0;
  return event;
};

/**
 * An exit: a transfer stretched across a two-wide doorway, the way Jeremy's area doors are written.
 * @param {number} id The event id.
 * @param {number} x The doorway's left column.
 * @param {number} y The doorway's row.
 * @param {{map: number, x: number, y: number, dir: number}} to Where it leads.
 * @returns {Object}
 */
const exitEvent = (id, x, y, to) =>
{
  const event = transferEvent(id, 'exit', x, y, to);
  event.pages[0].list.unshift(comment('<areaEvent:[2,1]>'));
  return event;
};

export { OASIS, PORTAL_LAYER, copyEvent, comment, fill, newBlock, paveFloors, lightPortal, oasisMap, labelEvent, exitEvent };
//endregion oasis
