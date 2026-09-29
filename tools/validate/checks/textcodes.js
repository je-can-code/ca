/**
 * text codes — every `\Code[arg]` in text the game draws, resolved against what it names.
 *
 * A text code is a reference too, and the one no writer checks. `\Item[127]` in a line of dialogue is
 * an id into Items.json exactly as much as `<drops:[i,127,50]>` is, but it lives in prose rather than
 * a note, so a bulk renumber that moves the item leaves the line reading "I miss the days of " and
 * nobody notices until they play past it. The anomaly board once named all nine of its hunts by enemy
 * ids the enemy redesign had since reassigned: three drew placeholder rows, and six drew real enemies
 * that were simply the wrong ones.
 *
 * Every string the game can draw is scanned: message lines, choices, scrolling text, speaker names
 * and the name, nickname and profile commands on every map event, common event and troop page; every
 * string field of every database row but its note; every string in every plugin config; each map's
 * display name. Each code found is then held to what it names:
 *
 * - **database rows** (`\Item`, `\Weapon`, `\Armor`, `\Skill`, `\State`, `\Enemy`, `\N`) resolve the
 *   way notes and configs do, so a blank or placeholder row fails here for the reason it fails there
 * - **System lists** (`\element`, `\skillType`, `\weaponType`, `\armorType`, `\equipType`, `\V`)
 * - **keyed configs** (`\sdp`, `\quest`, `\weather`)
 * - **the icon sheet** (`\I`): the index has to land on a tile of `img/system/IconSet.png` that
 *   somebody actually painted
 * - **the windowskin palette** (`\C`): 0 to 31, which is every colour `Window.png` holds
 * - **bubble targets** (`\pop`): `self`, `player`, an actor, a follower, a map event or a point. An
 *   event target is checked against the map the line runs on; for a common event, against every map
 *   whose events call it, directly or through another common event
 * - **a code nothing reads** is reported, because MZ draws it literally, backslash and all
 *
 * Which codes exist and what each one names is the engine's and the plugins' knowledge, and it is
 * written down here rather than read from the manifest, because the manifest publishes tags only.
 * When a plugin gains a text code, this vocabulary is where the validator learns it.
 */

import { ICON_SHEET } from '../project.js';
import { describeRow, isWholeNumber, resolveReference } from '../resolve.js';

//region sources

/**
 * The database tables scanned as rows: every MZ table but the two whose content is event commands
 * and the one that is a single object.
 * @type {string[]}
 */
const TEXT_TABLES = [
  'Actors',
  'Animations',
  'Armors',
  'Classes',
  'Enemies',
  'Items',
  'MapInfos',
  'Skills',
  'States',
  'Tilesets',
  'Weapons',
];

/**
 * The event command that runs a common event.
 * @type {number}
 */
const CALL_COMMON_EVENT = 117;

/**
 * The strings an event command draws, if it draws any.
 * @param {{ code: number, parameters: any[] }} command The event command.
 * @returns {string[]}
 */
const drawnStrings = command =>
{
  switch (command.code)
  {
    // a message's speaker name box, which MZ 1.6 added as the fifth parameter.
    case 101:
      return [ String(command.parameters[4] ?? '') ];

    // a message line, and a line of scrolling text.
    case 401:
    case 405:
      return [ command.parameters[0] ];

    // every choice in a choice list.
    case 102:
      return command.parameters[0];

    // an actor's name, nickname or profile, rewritten.
    case 320:
    case 324:
    case 325:
      return [ String(command.parameters[1] ?? '') ];

    default:
      return [];
  }
};

/**
 * Every non-empty string a command list draws, with the index of the command drawing it.
 * @param {object[]} list The event commands.
 * @returns {{ index: number, text: string }[]}
 */
const listStrings = list => list.flatMap((command, index) => drawnStrings(command)
  .filter(text => text !== '')
  .map(text => ({ index, text })));

/**
 * Every non-empty string inside a value, at any depth, except under a `note`, which holds tags.
 *
 * This is the one place the validator inspects raw JSON types: what a field holds is not known until
 * it is looked at, which is the whole reason for walking rather than naming fields.
 * @param {any} value The parsed JSON to walk.
 * @param {string} path Where the value sits, for the report.
 * @param {(path: string, text: string) => void} visit Called once per string found.
 */
const walkStrings = (value, path, visit) =>
{
  if (typeof value === 'string')
  {
    if (value !== '') visit(path, value);

    return;
  }

  if (Array.isArray(value))
  {
    value.forEach((entry, index) => walkStrings(entry, `${path}[${index}]`, visit));

    return;
  }

  if (value !== null && typeof value === 'object')
  {
    Object.entries(value).forEach(([ key, entry ]) =>
    {
      if (key === 'note') return;

      walkStrings(entry, path === '' ? key : `${path}.${key}`, visit);
    });
  }
};

/**
 * Records that one caller runs one common event.
 * @param {Map<number, Set<number>>} store Callers by common event id.
 * @param {number} commonEventId The common event being run.
 * @param {number} caller The map or common event running it.
 */
const recordCall = (store, commonEventId, caller) =>
{
  if (store.has(commonEventId) === false) store.set(commonEventId, new Set());

  store.get(commonEventId).add(caller);
};

/**
 * Which maps can run each common event: the maps whose events call it, plus the maps that can run any
 * common event which calls it in turn.
 *
 * A common event's lines are drawn on whichever map happens to be running it, so that is the map a
 * `\pop[eN]` in one of them has to find its event on. A common event no map reaches is left with an
 * empty set, which the bubble judge reports rather than guesses around.
 * @param {object} project The loaded project.
 * @returns {Map<number, Set<number>>} Every common event's id to the ids of the maps that can run it.
 */
const commonEventCallers = project =>
{
  const { tables, maps } = project;
  const byMap = new Map();
  const byCommonEvent = new Map();

  maps.forEach((map, mapId) => map.events.forEach(event =>
  {
    if (!event) return;

    event.pages.forEach(page => page.list.forEach(command =>
    {
      if (command.code === CALL_COMMON_EVENT) recordCall(byMap, command.parameters[0], mapId);
    }));
  }));

  tables.CommonEvents.forEach(commonEvent =>
  {
    if (!commonEvent) return;

    commonEvent.list.forEach(command =>
    {
      if (command.code === CALL_COMMON_EVENT) recordCall(byCommonEvent, command.parameters[0], commonEvent.id);
    });
  });

  // walk up through the common events that call this one until the maps that start each chain.
  const reach = (commonEventId, seen) =>
  {
    if (seen.has(commonEventId)) return new Set();

    seen.add(commonEventId);

    const reached = new Set(byMap.get(commonEventId) ?? []);
    (byCommonEvent.get(commonEventId) ?? []).forEach(parentId => reach(parentId, seen).forEach(mapId => reached.add(mapId)));

    return reached;
  };

  const callers = new Map();
  tables.CommonEvents.forEach(commonEvent =>
  {
    if (commonEvent) callers.set(commonEvent.id, reach(commonEvent.id, new Set()));
  });

  return callers;
};

/**
 * Every string the game can draw, labelled for a report, with the maps it can be drawn on.
 *
 * `mapIds` is what a bubble's event target resolves against: the map itself for a map event, every
 * map that can run a common event for its lines, and null where no map applies - a database field, a
 * config, a troop page - so an event target there is reported rather than guessed at.
 * @param {object} project The loaded project.
 * @returns {{ where: string, text: string, mapIds: number[] | null }[]}
 */
export const collectTextSources = project =>
{
  const { tables, maps, configs } = project;
  const sources = [];

  // the database tables, every string field of every row but its note.
  TEXT_TABLES.forEach(table => tables[table].forEach(row =>
  {
    if (!row) return;

    walkStrings(row, '', (path, text) => sources.push({ where: `${describeRow(table, row.id, row)} ${path}`, text, mapIds: null }));
  }));

  // System.json is one object rather than a table of rows.
  walkStrings(tables.System, 'System.json', (path, text) => sources.push({ where: path, text, mapIds: null }));

  // maps: their display names, and every message on every event page.
  [ ...maps.keys() ].sort((left, right) => left - right).forEach(mapId =>
  {
    const map = maps.get(mapId);
    const mapLabel = describeRow('Map', mapId, tables.MapInfos[mapId]);

    if (map.displayName) sources.push({ where: `${mapLabel} displayName`, text: map.displayName, mapIds: [ mapId ] });

    map.events.forEach(event =>
    {
      if (!event) return;

      event.pages.forEach((page, index) => listStrings(page.list).forEach(({ index: command, text }) =>
        sources.push({ where: `${mapLabel} event #${event.id} "${event.name}" page ${index + 1} command ${command}`, text, mapIds: [ mapId ] })));
    });
  });

  // common events, drawn on whichever map runs them.
  const callers = commonEventCallers(project);
  tables.CommonEvents.forEach(commonEvent =>
  {
    if (!commonEvent) return;

    const mapIds = [ ...callers.get(commonEvent.id) ].sort((left, right) => left - right);
    listStrings(commonEvent.list).forEach(({ index, text }) =>
      sources.push({ where: `${describeRow('CommonEvents', commonEvent.id, commonEvent)} command ${index}`, text, mapIds }));
  });

  // troop pages run in battle, where no map event is in reach.
  tables.Troops.forEach(troop =>
  {
    if (!troop) return;

    troop.pages.forEach((page, index) => listStrings(page.list).forEach(({ index: command, text }) =>
      sources.push({ where: `${describeRow('Troops', troop.id, troop)} page ${index + 1} command ${command}`, text, mapIds: null })));
  });

  // the plugin configs, every string in them.
  [ ...configs.keys() ].sort().forEach(name =>
    walkStrings(configs.get(name), `config.${name}.json`, (path, text) => sources.push({ where: path, text, mapIds: null })));

  return sources;
};

//endregion sources

//region vocabulary

/**
 * A text code: a backslash, a name, and a bracketed argument.
 *
 * <pre>
 * Structure:
 *  \NAME[ARGUMENT]
 *
 * Example:
 *  \Item[126]
 *
 * Translation:
 *  the name of Items #126, with its icon
 * </pre>
 * @type {RegExp}
 */
const TEXT_CODE = /\\([A-Za-z]+)\[([^\]]*)\]/g;

/**
 * How many colours the windowskin palette holds; `\C[n]` reads the nth.
 * @type {number}
 */
const PALETTE_SIZE = 32;

/**
 * The plugin configs a keyed table resolves against, so a missing config is a finding rather than
 * a crash inside the resolver.
 * @type {Object<string, string>}
 */
const KEYED_CONFIGS = {
  SdpPanels: 'sdp',
  Quests: 'quest',
};

/**
 * Wraps a single reason into the list every judge returns.
 * @param {string} problem Why the argument fails, or empty when it does not.
 * @returns {string[]}
 */
const asProblems = problem => problem === ''
  ? []
  : [ problem ];

/**
 * Judges an argument that has to be a whole number.
 * @param {string} argument The bracketed argument.
 * @param {(value: number) => string} judge Decides the number's fate; returns why it fails, or empty.
 * @returns {string}
 */
const asInteger = (argument, judge) => isWholeNumber(argument)
  ? judge(Number(argument.trim()))
  : `"${argument.trim()}", which is not a number`;

/**
 * A judge for a code whose argument is an id into one of the validator's resolvable tables.
 * @param {string} table The table name, as `resolve.js` knows it.
 * @returns {(project: object, argument: string) => string[]}
 */
const table = table => (project, argument) =>
{
  const config = KEYED_CONFIGS[table];

  if (config && project.configs.has(config) === false) return [ `${table} "${argument.trim()}", but config.${config}.json is missing` ];

  return asProblems(resolveReference(project, table, argument));
};

/**
 * A judge for a code whose argument only has to be a whole number: a font size, a pixel offset, a
 * time of day.
 * @returns {(project: object, argument: string) => string[]}
 */
const integer = () => (project, argument) => asProblems(asInteger(argument, () => ''));

/**
 * Judges a party position, which counts from one.
 * @param {object} project The loaded project.
 * @param {string} argument The bracketed argument.
 * @returns {string[]}
 */
const judgePartyPosition = (project, argument) => asProblems(asInteger(argument, position => position >= 1
  ? ''
  : `party position ${position}, which nobody stands in (the leader is 1)`));

/**
 * Judges a colour against the windowskin palette.
 * @param {object} project The loaded project.
 * @param {string} argument The bracketed argument.
 * @returns {string[]}
 */
const judgeColour = (project, argument) => asProblems(asInteger(argument, index => (index >= 0 && index < PALETTE_SIZE)
  ? ''
  : `colour ${index}, which is outside the windowskin palette (0-${PALETTE_SIZE - 1})`));

/**
 * Judges an icon index against the sheet: it has to land on the sheet, on a tile somebody painted.
 * @param {object} project The loaded project.
 * @param {string} argument The bracketed argument.
 * @returns {string[]}
 */
const judgeIcon = (project, argument) => asProblems(asInteger(argument, index =>
{
  const sheet = project.iconSheet;

  // without the sheet there is nothing to judge an index against; the check reports that once, up front.
  if (!sheet) return '';

  const last = sheet.drawn.length - 1;

  if (index < 0 || index > last) return `icon ${index}, which is off the sheet (${sheet.file} holds 0-${last})`;
  if (sheet.drawn[index] === 0) return `icon ${index}, which is a blank tile of ${sheet.file}`;

  return '';
}));

/**
 * Judges a parameter key by shape only. The keys themselves live in J-Base's parameter registry at
 * runtime, which the data does not carry; an unknown key draws a loud "UNKNOWN PARAM" in game.
 * @param {object} project The loaded project.
 * @param {string} argument The bracketed argument.
 * @returns {string[]}
 */
const judgeParameter = (project, argument) => /^[\w-]+$/.test(argument.trim())
  ? []
  : [ `"${argument.trim()}", which is not a parameter key` ];

/**
 * Judges a weather code: no argument names whatever is falling now; otherwise a preset the weather
 * config declares, with an optional strength it also declares.
 * @param {object} project The loaded project.
 * @param {string} argument The bracketed argument.
 * @returns {string[]}
 */
const judgeWeather = (project, argument) =>
{
  const weather = project.configs.get('weather');

  if (!weather) return [ 'a weather, but config.weather.json is missing' ];

  const tokens = argument.split(',')
    .map(token => token.trim())
    .filter(token => token !== '');

  if (tokens.length === 0) return [];

  const [ preset, strength ] = tokens;
  const declares = (ids, token) => Object.hasOwn(ids, token) || Object.values(ids).includes(Number(token));

  if (declares(weather.presetIds, preset) === false) return [ `weather preset "${preset}", which config.weather.json does not declare` ];
  if (strength !== undefined && declares(weather.intensityIds, strength) === false) return [ `weather strength "${strength}", which config.weather.json does not declare` ];

  return [];
};

/**
 * Judges a bubble target against the grammar J-Message-Bubbles reads: `self`, `player`, `aN` for an
 * actor, `fN` for the Nth follower behind the player, `eN` for an event on the running map, or `x,y`
 * for a point on screen.
 * @param {object} project The loaded project.
 * @param {string} argument The bracketed argument.
 * @param {{ mapIds: number[] | null }} source Where the text is drawn.
 * @returns {string[]}
 */
const judgeBubbleTarget = (project, argument, source) =>
{
  const target = argument.trim().toLowerCase();

  if (target === 'self' || target === 'player') return [];
  if (/^-?\d+,-?\d+$/.test(target)) return [];

  const actor = /^a(\d+)$/.exec(target);
  if (actor) return asProblems(resolveReference(project, 'Actors', actor[1]));

  const follower = /^f(\d+)$/.exec(target);
  if (follower)
  {
    return Number(follower[1]) >= 1
      ? []
      : [ `follower ${follower[1]}, which nobody walks as (the follower behind the player is f1)` ];
  }

  const event = /^e(\d+)$/.exec(target);
  if (event)
  {
    const eventId = Number(event[1]);

    if (source.mapIds === null) return [ `event #${eventId}, but this text is not drawn on a map, so there is no event to find` ];
    if (source.mapIds.length === 0) return [ `event #${eventId}, but no map event runs this common event, so there is no map to find it on` ];

    return source.mapIds
      .filter(mapId => !project.maps.get(mapId).events[eventId])
      .map(mapId => `event #${eventId}, which Map #${mapId} does not hold`);
  }

  return [ `"${argument.trim()}", which is not a bubble target (self, player, aN, fN, eN or x,y)` ];
};

/**
 * Every text code the game reads, by lower-cased name, and how to judge its argument. Every reader -
 * the engine's `obtainEscapeCode` and each plugin's `replace(/\\name\[…]/gi)` - ignores case.
 * @type {Map<string, (project: object, argument: string, source: object) => string[]>}
 */
const VOCABULARY = new Map([
  // RPG Maker MZ's own.
  [ 'n', table('Actors') ],
  [ 'p', judgePartyPosition ],
  [ 'v', table('Variables') ],
  [ 'c', judgeColour ],
  [ 'i', judgeIcon ],
  [ 'fs', integer() ],
  [ 'px', integer() ],
  [ 'py', integer() ],

  // J-Message's database codes.
  [ 'item', table('Items') ],
  [ 'weapon', table('Weapons') ],
  [ 'armor', table('Armors') ],
  [ 'skill', table('Skills') ],
  [ 'state', table('States') ],
  [ 'enemy', table('Enemies') ],
  [ 'element', table('Elements') ],
  [ 'skilltype', table('SkillTypes') ],
  [ 'weapontype', table('WeaponTypes') ],
  [ 'armortype', table('ArmorTypes') ],
  [ 'equiptype', table('EquipTypes') ],
  [ 'sdp', table('SdpPanels') ],
  [ 'param', judgeParameter ],

  // the extensions: J-Omni-Quests, J-Weather, J-Time.
  [ 'quest', table('Quests') ],
  [ 'weather', judgeWeather ],
  [ 'timeofday', integer() ],
  [ 'seasonofyear', integer() ],

  // J-Message-Bubbles.
  [ 'pop', judgeBubbleTarget ],
]);

/**
 * Judges one text code.
 * @param {object} project The loaded project.
 * @param {RegExpMatchArray} match One `TEXT_CODE` match.
 * @param {{ mapIds: number[] | null }} source Where the text is drawn.
 * @returns {{ recognised: boolean, problems: string[] }} Whether anything reads the code, and every
 *   problem with what it names, each phrased to follow the code in a report.
 */
const judgeCode = (project, match, source) =>
{
  const [ , name, argument ] = match;
  const judge = VOCABULARY.get(name.toLowerCase());

  // a code nothing reads is drawn as-is, backslash and all.
  if (!judge) return { recognised: false, problems: [ 'matches no text code the engine or any plugin reads' ] };

  return { recognised: true, problems: judge(project, argument, source).map(problem => `names ${problem}`) };
};

//endregion vocabulary

/**
 * Checks every text code in every string the game draws.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkTextCodes = project =>
{
  const findings = [];

  // the sheet lives in img/ beside the data; without it every icon index goes unjudged, which is a
  // finding rather than a silent pass.
  if (!project.iconSheet) findings.push(`${ICON_SHEET} is missing; \\I[n] icons cannot be judged`);

  const sources = collectTextSources(project);
  let codes = 0;
  let recognised = 0;

  sources.forEach(source =>
  {
    [ ...source.text.matchAll(TEXT_CODE) ].forEach(match =>
    {
      codes++;

      const verdict = judgeCode(project, match, source);

      if (verdict.recognised) recognised++;

      verdict.problems.forEach(problem => findings.push(`${source.where}: ${match[0]} ${problem}`));
    });
  });

  return {
    findings,
    summary: `${codes} text code(s) in ${sources.length} drawn string(s), ${recognised} recognised`,
  };
};
