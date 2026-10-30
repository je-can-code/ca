/**
 * maptree — every map's place in the tree is a whole number.
 *
 * Each row of `MapInfos.json` carries an `order`, which sorts a map among its siblings in the map tree.
 * jmz-data-editor reads the field as a whole number, so a single fractional order makes it refuse the entire
 * file, which takes the map editor's tree and every "where it appears" lookup down with it. The editor can only
 * write whole numbers back, so the writer to watch is a script in `tools/`, and the likeliest moment is a
 * recipe slotting a new map between two existing ones with a half step.
 */

/**
 * Checks that every map in the tree has a whole-number order.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkMapTree = project =>
{
  // the table holds a null at index 0 and in every deleted map's slot; only the maps themselves are placed.
  const maps = project.tables.MapInfos.filter(info => info !== null);

  const findings = maps
    .filter(info => Number.isInteger(info.order) === false)
    .map(info => `MapInfos.json places Map #${info.id} "${info.name}" at order ${info.order}; jmz-data-editor reads an order as a whole number and refuses the whole tree over one that is not. Renumber the tree in its current order, 1 upward.`);

  return {
    findings,
    summary: `${maps.length} map(s) in the tree`,
  };
};
