/**
 * start — a new game on main begins where a player's does.
 *
 * MZ has exactly one place a new game begins, the start map and tile in `System.json`, and it is also the
 * only way to reach a hand-built test map: point the start at it, play, look. That is fine on a branch and
 * a problem on main, because main is what gets bundled and released, and a release that opens in a test
 * room is a release nobody can play. Main has shipped that way for months at a time.
 *
 * So the real start is written down here, and any other start is a finding. A branch can point anywhere
 * it likes; this is what stops one from landing.
 */

/**
 * Where a new game of Chef Adventure begins: the first room of the opening cave.
 *
 * Moving the real start, with a new opening or a renumbered map, means changing this in the same pull
 * request.
 * @type {{ mapId: number, x: number, y: number }}
 */
export const REAL_START = { mapId: 4, x: 8, y: 11 };

/**
 * Describes a start for a reader: the map's id and display name, then the tile.
 *
 * The display name is the one MZ's map tree shows. The tree shows no ids, so an id on its own is nearly
 * impossible to find in it.
 * @param {object[]} mapInfos The MapInfos table.
 * @param {{ mapId: number, x: number, y: number }} start The start to describe.
 * @returns {string} For example, `Map #4 "Cave - 1 - START" at (8, 11)`.
 */
const describeStart = (mapInfos, { mapId, x, y }) =>
{
  const info = mapInfos[mapId];

  // a start aimed at a map that no longer exists still deserves a readable finding, not a crash.
  const name = info
    ? `"${info.name}"`
    : '(no such map)';

  return `Map #${mapId} ${name} at (${x}, ${y})`;
};

/**
 * Checks that a new game begins at the real start.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkStart = project =>
{
  const { System, MapInfos } = project.tables;
  const start = { mapId: System.startMapId, x: System.startX, y: System.startY };

  // the map alone is not enough: the right room with the player standing in a wall is still broken.
  const isRealStart = start.mapId === REAL_START.mapId
    && start.x === REAL_START.x
    && start.y === REAL_START.y;

  const findings = isRealStart
    ? []
    : [ `System.json starts a new game on ${describeStart(MapInfos, start)}; main has to start where a player does, ${describeStart(MapInfos, REAL_START)}. Set the player's starting position back in MZ before merging.` ];

  return {
    findings,
    summary: `new games start on ${describeStart(MapInfos, start)}`,
  };
};