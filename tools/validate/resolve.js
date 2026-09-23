/**
 * resolve — decide whether one id names something that exists.
 *
 * The notetag check and the config check both end in the same question, "does this id still point
 * at a real row", and they have to answer it the same way or one of them will wave through what the
 * other flags. The table names are the vocabulary rmmz-plugins' manifest publishes in `idTables`;
 * anything outside it is a contract this validator was never taught, and fails loudly.
 */

/**
 * The database tables whose rows count as present only while they carry a name.
 *
 * A row MZ has never had authored into is not absent, it is an array slot with an empty name, so
 * "does the row exist" alone would call every blank row fine. That blank-row case is the exact shape
 * of the 274 dead drops `tools/dead-drops.js` found by hand.
 * @type {Set<string>}
 */
const ROW_TABLES = new Set([
  'Actors',
  'Animations',
  'Armors',
  'Classes',
  'Enemies',
  'Items',
  'Skills',
  'States',
  'Weapons',
]);

/**
 * The lists inside `System.json` a table name refers to, whether an entry must carry a name, and
 * whether id 0 means something.
 *
 * Switches are the exception on names: an unnamed switch is still a perfectly good switch, while an
 * unnamed element or skill type is a slot nobody filled in. Elements are the exception on zero: element
 * 0 is RPG Maker's built-in "None", a real choice a skill's damage can carry, so `<strictElements:[0]>`
 * names something even though the list's slot 0 is blank.
 * @type {Object<string, { list: string, named: boolean, zeroIsReal: boolean }>}
 */
const SYSTEM_LISTS = {
  Elements: { list: 'elements', named: true, zeroIsReal: true },
  SkillTypes: { list: 'skillTypes', named: true, zeroIsReal: false },
  WeaponTypes: { list: 'weaponTypes', named: true, zeroIsReal: false },
  Switches: { list: 'switches', named: false, zeroIsReal: false },
};

/**
 * Every table name this file knows how to resolve, including `Self`, which callers turn into the
 * table of the row carrying the tag. The notetag check compares the manifest's `idTables` against it
 * up front, so a table taught to rmmz-plugins but not to this file is reported even when no tag in the
 * data happens to use it yet.
 * @type {Set<string>}
 */
export const RESOLVABLE_TABLES = new Set([
  ...ROW_TABLES,
  ...Object.keys(SYSTEM_LISTS),
  'Self',
  'Maps',
  'JabsActionMapEvents',
  'SdpPanels',
  'Quests',
]);

/**
 * Crafting components and knowledge exchanges name their table with a single letter.
 * @type {Object<string, string>}
 */
export const TYPE_LETTER_TABLES = {
  i: 'Items',
  w: 'Weapons',
  a: 'Armors',
};

/**
 * Describes a row for a report: its table, id, and name when it has one.
 * @param {string} table The table name.
 * @param {number} id The row id.
 * @param {object} row The row, if it exists.
 * @returns {string}
 */
export const describeRow = (table, id, row) =>
{
  const name = row && row.name
    ? ` "${row.name}"`
    : '';

  return `${table} #${id}${name}`;
};

/**
 * Whether a value is a whole number, as a string straight out of a notetag or a number out of JSON.
 * @param {string|number} value The value to test.
 * @returns {boolean}
 */
export const isWholeNumber = value => /^-?\d+$/.test(String(value).trim());

/**
 * Checks an id against one of the database tables.
 * @param {object[]} rows The table.
 * @param {string} table The table's name, for the report.
 * @param {number} id The id.
 * @returns {string} Why the id does not resolve; empty when it does.
 */
const resolveRow = (rows, table, id) =>
{
  const row = rows[id];

  if (id <= 0 || !row) return `${table} #${id}, which does not exist`;
  if (row.name === '') return `${table} #${id}, which is a blank row`;

  return '';
};

/**
 * Checks an id against one of the lists in `System.json`.
 * @param {object} system The parsed `System.json`.
 * @param {string} table The table name, which picks the list.
 * @param {number} id The id, which is an index into the list.
 * @returns {string} Why the id does not resolve; empty when it does.
 */
const resolveSystemEntry = (system, table, id) =>
{
  const { list, named, zeroIsReal } = SYSTEM_LISTS[table];
  const entries = system[list];

  if (id === 0 && zeroIsReal) return '';
  if (id <= 0 || id >= entries.length) return `${table} #${id}, which does not exist (System.json ${list} holds 1-${entries.length - 1})`;
  if (named && entries[id] === '') return `${table} #${id}, which is an unnamed ${list} entry`;

  return '';
};

/**
 * Finds a System list entry by its display name, the way J-Aptitude-Typed does: trimmed, case-blind,
 * first match.
 * @param {object} system The parsed `System.json`.
 * @param {string} table The table name, which picks the list.
 * @param {string} name The display name.
 * @returns {number} The entry's id, or -1 when no entry carries that name.
 */
const findSystemEntryByName = (system, table, name) =>
{
  const needle = name.trim().toLowerCase();

  return system[SYSTEM_LISTS[table].list].findIndex(entry => entry && entry.trim().toLowerCase() === needle);
};

/**
 * Checks an id against the events of the map J-ABS clones actions from.
 * @param {object} project The loaded project.
 * @param {number} id The event id.
 * @returns {string} Why the id does not resolve; empty when it does.
 */
const resolveActionMapEvent = (project, id) =>
{
  const { actionMapId, maps } = project;

  if (actionMapId === 0) return `action map event #${id}, but J-ABS names no actionMapId in js/plugins.js`;

  const actionMap = maps.get(actionMapId);
  if (!actionMap) return `action map event #${id}, but the J-ABS action map (Map #${actionMapId}) does not exist`;

  if (id <= 0 || !actionMap.events[id]) return `action map event #${id}, which the J-ABS action map (Map #${actionMapId}) does not hold`;

  return '';
};

/**
 * Checks a key against the keys a plugin config declares.
 * @param {object[]} rows The config's keyed rows.
 * @param {string} what What the rows are, for the report.
 * @param {string} key The key.
 * @returns {string} Why the key does not resolve; empty when it does.
 */
const resolveKey = (rows, what, key) => rows.some(row => row.key === key)
  ? ''
  : `${what} "${key}", which does not exist`;

/**
 * Resolves one reference against one table.
 * @param {object} project The loaded project.
 * @param {string} table A table name from the manifest's `idTables`, never `Self` - callers turn that
 *   into the table of the row carrying the tag before asking.
 * @param {string|number} value The id, key or name being resolved.
 * @param {{ allowZero?: boolean, acceptsName?: boolean }} [options] The target's flags.
 * @returns {string} What the reference names and why that fails - phrased to follow the word "names",
 *   as in `names Armors #321, which is a blank row` - or empty when it resolves.
 */
export const resolveReference = (project, table, value, options = {}) =>
{
  const { tables, configs } = project;

  // keyed tables hold strings, so they are settled before anything tries to read a number.
  if (table === 'SdpPanels') return resolveKey(configs.get('sdp').sdps, 'SDP panel', String(value).trim());
  if (table === 'Quests') return resolveKey(configs.get('quest').quests, 'quest', String(value).trim());

  // a System list may accept a display name in place of its id.
  if (isWholeNumber(value) === false)
  {
    if (options.acceptsName && Object.hasOwn(SYSTEM_LISTS, table))
    {
      return findSystemEntryByName(tables.System, table, String(value)) > 0
        ? ''
        : `${table} "${String(value).trim()}", which no entry is named`;
    }

    return `"${String(value).trim()}", which is not an id`;
  }

  const id = Number(String(value).trim());

  // zero is the documented "none" for some references, and a missing row for every other.
  if (id === 0 && options.allowZero) return '';

  if (ROW_TABLES.has(table)) return resolveRow(tables[table], table, id);
  if (Object.hasOwn(SYSTEM_LISTS, table)) return resolveSystemEntry(tables.System, table, id);
  if (table === 'Maps') return id > 0 && tables.MapInfos[id] ? '' : `Map #${id}, which does not exist`;
  if (table === 'JabsActionMapEvents') return resolveActionMapEvent(project, id);

  throw new Error(`the manifest names a table this validator does not know how to resolve: ${table}. `
    + 'Teach tools/validate/resolve.js what it means.');
};