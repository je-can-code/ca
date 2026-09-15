//region paths
/**
 * Every path the generator touches, resolved from this file rather than from the shell's cwd.
 * The tools are run from the repo root, from `tools/`, and from an editor's run button, and a
 * relative `chef-adventure/data` silently means a different directory in each of those.
 */
const ROOT = `${import.meta.dir}/../..`;

/**
 * The live database the game ships. Nothing here writes to it except `install.js`.
 * @type {string}
 */
export const DATA = `${ROOT}/chef-adventure/data`;

/**
 * Where generated maps land before anyone looks at them. Staging exists so a bad run costs a
 * re-run rather than a `git checkout` over hand-authored data.
 * @type {string}
 */
export const STAGING = `${ROOT}/tools/mapgen/.staging`;

/**
 * The learned autotile shape tables, kept next to the learner that produces them.
 * @type {string}
 */
export const TABLES = `${import.meta.dir}/tables.json`;

/**
 * The zero-padded database filename for a map id, which is what the editor writes.
 * @param {number} id The map id.
 * @returns {string}
 */
export const mapFile = id => `Map${String(id).padStart(3, '0')}.json`;

/**
 * Loads a map, from the database by default and from staging when asked.
 *
 * Reading the database by default matters once a dungeon is installed: events get hand-added
 * afterwards, and a tool still reading the generator's output would cheerfully report a fully
 * wired teleportal room as having no events at all. Pass `--staged` to review a regenerated map
 * before it is installed; either source falls back to the other when a map lives in only one.
 * @param {number} id The map id.
 * @param {boolean} preferStaging Whether to read the generator's output first.
 * @returns {Promise<Object>}
 */
export const loadMap = async (id, preferStaging = false) =>
{
  const staged = Bun.file(`${STAGING}/Map${id}.json`);
  const shipped = Bun.file(`${DATA}/${mapFile(id)}`);
  const [ first, second ] = preferStaging ? [ staged, shipped ] : [ shipped, staged ];

  return JSON.parse(await (await first.exists() ? first : second).text());
};
//endregion paths
