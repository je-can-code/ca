/**
 * burndown — count what is left before Chef Adventure is content complete.
 *
 * Content complete means every event is built and theoretically works, so the count has to come from
 * the game rather than from anyone's memory of it. `docs/content-complete.md` holds everything only a
 * person can judge, as checkboxes. Everything that can be measured is measured here instead, because a
 * hand-kept tally of it would drift by the end of the week: the townsfolk quests from the event pages
 * that move them, the new maps from where their creatures stand, the harvest nodes from what stands in
 * the world, the node panels from their names, and the crafting from a supply trace that walks every
 * way an item can enter the game.
 *
 * Tile polish is reported beside the count and never inside it, since it is not part of the definition.
 * Neither is anything under the checklist's "After the line" heading.
 *
 * Usage:
 *   bun tools/burndown.js          # print the count
 *   bun tools/burndown.js --write  # also record today in the history and write the page's data
 *
 * With `--write`, today's rows replace any earlier run from the same day in
 * `docs/content-complete-history.json`, and `dist/burndown/` gets `items.json`, `history.json`,
 * `areas.json` and `supply.json`, which are the four files the burndown page reads.
 */

const ROOT = `${import.meta.dir}/..`;
const DATA_DIR = `${ROOT}/chef-adventure/data`;
const CHECKLIST_PATH = `${ROOT}/docs/content-complete.md`;
const HISTORY_PATH = `${ROOT}/docs/content-complete-history.json`;
const OUT_DIR = `${ROOT}/dist/burndown`;

/**
 * How many creatures must stand on a map before it reads as populated.
 *
 * One is not enough, because the T5 homes put a single monster on many of these maps long before anyone
 * has placed the map's real population. The Fortress's rule of one encounter per room, sized for a fight
 * of one against four or five, is the smallest real population anywhere, and three clears it.
 * @type {number}
 */
const POPULATED_AT = 3;

/**
 * The deepest row a roster stamp stands on.
 *
 * A rough map gets a row of one palette copy per species along its top, to be pasted from, and a stamp
 * is a note to the mapper rather than a monster in the world, so nothing up there counts as placed.
 * @type {number}
 */
const STAMP_ROW = 1;

/**
 * Enemy rows at or below this id are harvest nodes and tool gates, not creatures.
 * @type {number}
 */
const LAST_NODE_ROW = 100;

/**
 * The last row of the weapon lines. Each of the eighteen lines is ten rows long.
 * @type {number}
 */
const LAST_WEAPON_LINE_ROW = 180;

/**
 * The last row of the armor lines. Each of the nine lines is ten rows long.
 * @type {number}
 */
const LAST_ARMOR_LINE_ROW = 90;

/**
 * The comments a folk quest's scaffold pages use to name what is still missing.
 *
 * The quest counts as finished only once these are gone, so resolving one means deleting its comment.
 * @type {RegExp}
 */
const FLAG_PATTERN = /GATE NEEDED|CONTENT NEEDED|REWARD NEEDED|CLOSURE NEEDED|OUTCOME STORAGE NEEDED|MAKER'S CALL|OFF-SITE|TODO dialogue/;

/**
 * The checklist's headings that this tool fills in itself.
 * @type {{ folk: string, maps: string, nodes: string, panels: string, supply: string, gear: string }}
 */
const AUTOMATIC_LANES = {
  folk: 'Townsfolk quests',
  maps: 'Enemies on the new maps',
  nodes: 'Harvest nodes to place',
  panels: 'Node names and flavor',
  supply: 'Things nothing supplies',
  gear: 'Named gear recipes',
};

/**
 * The checklist heading that is listed so it isn't forgotten, and never counts toward the target.
 * @type {string}
 */
const OFF_THE_LINE = 'After the line';

/**
 * Every run of ids from first to last, both included.
 * @param {number} first The lowest id.
 * @param {number} last The highest id.
 * @returns {number[]}
 */
const range = (first, last) => Array.from({ length: last - first + 1 }, (_, index) => first + index);

/**
 * The areas built after chapter 3.
 *
 * `noRoster` lists the maps that never count toward the enemy lane: rest rooms and switcher rooms, which
 * are enemy-free by convention, arenas, and rooms whose fight sits on the checklist by hand, so that
 * nothing is counted twice. Folder rows in these ranges hold no tiles and are skipped when read.
 * @type {Array<{ name: string, maps: number[], noRoster: number[] }>}
 */
const AREAS = [
  { name: 'Nimbus', maps: range(363, 380), noRoster: [ 374, 378, 380 ] },
  { name: 'The Subterranean', maps: range(385, 409), noRoster: [ 406, 408, 409 ] },
  {
    name: 'The Frozen Fortress',
    maps: range(411, 444),
    noRoster: [ 411, 416, 417, 421, 422, 423, 425, 426, 432, 436, 438, 439, 441, 443, 444 ],
  },
  { name: 'Crystalline Ravine', maps: range(445, 449), noRoster: [] },
  { name: 'Seashell Shores', maps: range(451, 457), noRoster: [] },
  { name: 'Desolate Graves', maps: range(458, 478), noRoster: [] },
  { name: 'Windward Tunnels', maps: range(479, 492), noRoster: [] },
];

/**
 * One row of the burndown list.
 * @typedef {{ id: string, lane: string, item: string, status: string, where: string, counted: boolean }} BurndownItem
 */

//region reading the game

/**
 * Reads a JSON file from the game's data folder.
 * @param {string} name The file's name.
 * @returns {Promise<*>}
 */
const readData = async name => JSON.parse(await Bun.file(`${DATA_DIR}/${name}`).text());

/**
 * The file name of a map, as MZ pads it.
 * @param {number} id The map's id.
 * @returns {string}
 */
const mapFileName = id => `Map${String(id).padStart(3, '0')}.json`;

/**
 * Reads a map, or nothing when no such file exists.
 * @param {number} id The map's id.
 * @returns {Promise<object|null>}
 */
const readMap = async id =>
{
  const file = Bun.file(`${DATA_DIR}/${mapFileName(id)}`);
  return await file.exists()
    ? file.json()
    : null;
};

/**
 * Whether a map holds any painted tile. A folder row in the map tree has a file, but an empty one.
 * @param {object} map The map's data.
 * @returns {boolean}
 */
const hasTiles = map => map.data.some(tile => tile !== 0);

/**
 * Every enemy an event can stand in for, read from its page comments.
 *
 * `<enemyIds:[...]>` is a spot's pool, the rows it can roll into on arrival, so a row that only ever
 * appears through a pool is still in the world and must not read as missing.
 * @param {object} event The event.
 * @returns {number[]}
 */
const enemyIdsOf = event =>
{
  const ids = [];

  event.pages
    .flatMap(page => page.list)
    .filter(command => command.code === 108 || command.code === 408)
    .forEach(command =>
    {
      const text = String(command.parameters[0]);
      const single = text.match(/<enemyId:\s*(\d+)>/i);
      if (single) ids.push(Number(single[1]));

      const pool = text.match(/<enemyIds:\s*\[([\d,\s]+)]>/i);
      if (pool) ids.push(...pool[1].split(',').map(Number));
    });

  return ids;
};

/**
 * How many creatures stand on a map, leaving out harvest nodes, tool gates and the roster stamp.
 * @param {object} map The map's data.
 * @returns {number}
 */
const countPlacedCreatures = map => map.events
  .filter(event => event && event.y > STAMP_ROW)
  .filter(event => enemyIdsOf(event).some(id => id > LAST_NODE_ROW))
  .length;

/**
 * How many lines of dialogue a map's events hold.
 * @param {object} map The map's data.
 * @returns {number}
 */
const countDialogueLines = map => map.events
  .filter(event => event)
  .flatMap(event => event.pages)
  .flatMap(page => page.list)
  .filter(command => command.code === 401)
  .length;

/**
 * The commit that first added a map, which for a rough map is the commit of its draft.
 * @param {number} id The map's id.
 * @returns {string}
 */
const firstCommitOf = id =>
{
  const path = `chef-adventure/data/${mapFileName(id)}`;
  const log = Bun.spawnSync([ 'git', '-C', ROOT, 'log', '--diff-filter=A', '--format=%h', '--', path ]);
  return log.stdout.toString().trim().split('\n').pop();
};

/**
 * Whether any painted tile differs from a map's draft, which is the only sign of polish the data holds.
 *
 * Only the four tile layers are compared. The two above them are shadows and regions, which the rough
 * passes set themselves, and events are left out because placing enemies is not polish.
 * @param {number} id The map's id.
 * @param {object} map The map as it stands now.
 * @returns {boolean}
 */
const isPolished = (id, map) =>
{
  const commit = firstCommitOf(id);
  if (!commit) return false;

  const shown = Bun.spawnSync([ 'git', '-C', ROOT, 'show', `${commit}:chef-adventure/data/${mapFileName(id)}` ]);
  if (shown.exitCode !== 0) return false;

  const draft = JSON.parse(shown.stdout.toString());

  // a resized canvas is reworked by definition, and its layers no longer line up to compare.
  if (draft.width !== map.width || draft.height !== map.height) return true;

  const tileCount = map.width * map.height * 4;
  for (let index = 0; index < tileCount; index += 1)
  {
    if (draft.data[index] !== map.data[index]) return true;
  }

  return false;
};

/**
 * The status of a map from how many creatures stand on it.
 * @param {number} placed The creatures placed on it.
 * @returns {string}
 */
const statusOfMap = placed =>
{
  if (placed >= POPULATED_AT) return 'Done';

  return placed > 0
    ? 'Started'
    : 'To do';
};

/**
 * Measures every area: its maps, how far each one is populated, its dialogue and its polish.
 * @returns {Promise<{ areas: object[], maps: BurndownItem[] }>}
 */
const surveyAreas = async () =>
{
  const infos = (await readData('MapInfos.json')).filter(info => info);
  const names = new Map(infos.map(info => [ info.id, info.name ]));
  const areas = [];
  const maps = [];

  for (const area of AREAS)
  {
    const row = { area: area.name, maps: 0, populated: 0, needing: 0, lines: 0, polished: 0 };

    for (const id of area.maps)
    {
      const map = await readMap(id);
      if (!map || !hasTiles(map)) continue;

      row.maps += 1;
      row.lines += countDialogueLines(map);
      if (isPolished(id, map)) row.polished += 1;

      // rooms without a roster still count as maps of the area, they just owe the enemy lane nothing.
      if (area.noRoster.includes(id)) continue;

      const placed = countPlacedCreatures(map);
      row.needing += 1;
      if (placed >= POPULATED_AT) row.populated += 1;

      maps.push({
        id: `map-${id}`,
        lane: AUTOMATIC_LANES.maps,
        item: `${area.name}: ${names.get(id)}, ${placed} placed`,
        status: statusOfMap(placed),
        where: `Map${id}`,
        counted: true,
      });
    }

    areas.push(row);
  }

  return { areas, maps };
};

/**
 * Tallies one list of event commands against the folk quests it moves.
 *
 * A quest is named by the plugin commands and scripts that move it. Comments are left out on purpose:
 * every opener page names the previous quest in its page condition, and counting those would hold a
 * finished quest open until the next one in its chain was written.
 * @param {object[]} list The page's commands.
 * @param {string} where Where the page lives, for the report.
 * @param {Map<string, object>} ledger The running tally for each folk quest.
 */
const tallyQuestPage = (list, where, ledger) =>
{
  const named = new Set();
  let lines = 0;
  let flags = 0;

  list.forEach(command =>
  {
    if (command.code === 401) lines += 1;

    const isComment = command.code === 108 || command.code === 408;
    if (isComment && FLAG_PATTERN.test(String(command.parameters[0]))) flags += 1;

    const movesQuests = [ 355, 655, 357, 657 ].includes(command.code);
    if (!movesQuests) return;

    for (const match of JSON.stringify(command.parameters).matchAll(/\b[a-z]+-\d{3}\b/g))
    {
      if (ledger.has(match[0])) named.add(match[0]);
    }
  });

  named.forEach(key =>
  {
    const entry = ledger.get(key);
    entry.pages += 1;
    entry.lines += lines;
    entry.flags += flags;
    entry.where ||= where;
    if (lines === 0) entry.silentPages += 1;
  });
};

/**
 * The status of a folk quest from what its pages hold.
 * @param {object} entry The quest's tally.
 * @returns {string}
 */
const statusOfQuest = entry =>
{
  const isFinished = entry.pages > 0 && entry.silentPages === 0 && entry.flags === 0;
  if (isFinished) return 'Done';

  return entry.lines > 0
    ? 'Started'
    : 'To do';
};

/**
 * Reads every folk quest's state out of the maps and common events.
 * @returns {Promise<BurndownItem[]>}
 */
const surveyFolkQuests = async () =>
{
  const { quests } = await readData('config.quest.json');
  const folk = quests.filter(quest => quest.categoryKey === 'folk');
  const ledger = new Map(folk.map(quest =>
  {
    const entry = { name: quest.name, pages: 0, silentPages: 0, lines: 0, flags: 0, where: '' };
    return [ quest.key, entry ];
  }));

  const infos = (await readData('MapInfos.json')).filter(info => info);
  for (const info of infos)
  {
    const map = await readMap(info.id);
    if (!map) continue;

    map.events
      .filter(event => event)
      .forEach(event => event.pages.forEach(page => tallyQuestPage(page.list, `Map${info.id}`, ledger)));
  }

  const commonEvents = (await readData('CommonEvents.json')).filter(common => common);
  commonEvents.forEach(common => tallyQuestPage(common.list, `CE${common.id}`, ledger));

  return [ ...ledger.entries() ].map(([ key, entry ]) => ({
    id: key,
    lane: AUTOMATIC_LANES.folk,
    item: `${key}: ${entry.name.replace(/\\[A-Za-z]+\[\d+\]/g, '')}`,
    status: statusOfQuest(entry),
    where: entry.where,
    counted: true,
  }));
};

/**
 * Whether a map is part of the world a player can reach, rather than a test map or a template.
 * @param {number} id The map's id.
 * @param {Map<number, object>} infos The map tree, by id.
 * @returns {boolean}
 */
const isInTheWorld = (id, infos) =>
{
  let current = infos.get(id);
  while (current)
  {
    if (/^REGION:|^FLASHBACKS/.test(current.name)) return true;
    current = infos.get(current.parentId);
  }

  return false;
};

/**
 * Notes everything one list of event commands hands the player, and every enemy it spawns.
 *
 * These are all the ways an event can put a thing in the party's hands: the three Change commands, a
 * shop's goods, and a script naming a database row. A spawned enemy counts as standing in the world,
 * because a named monster's only home is the alert event that calls it in.
 * @param {object[]} list The commands.
 * @param {{ standing: Set<number>, supplied: Set<string> }} world What the world holds so far.
 */
const collectFromCommands = (list, world) =>
{
  const shopKinds = { 0: 'i', 1: 'w', 2: 'a' };
  const changeKinds = { 126: 'i', 127: 'w', 128: 'a' };
  const scriptKinds = { Items: 'i', Weapons: 'w', Armors: 'a' };

  list.forEach(command =>
  {
    const parameters = command.parameters;

    // the second parameter of a Change command is zero for a gain and one for a loss.
    if (changeKinds[command.code] && parameters[1] === 0)
    {
      world.supplied.add(`${changeKinds[command.code]}${parameters[0]}`);
    }

    if (command.code === 302 || command.code === 605)
    {
      world.supplied.add(`${shopKinds[parameters[0]]}${parameters[1]}`);
    }

    if (command.code === 355 || command.code === 655)
    {
      for (const match of String(parameters[0]).matchAll(/\$data(Items|Weapons|Armors)\[(\d+)]/g))
      {
        world.supplied.add(`${scriptKinds[match[1]]}${match[2]}`);
      }
    }

    if (command.code === 357 && parameters[1] === 'Spawn Enemy')
    {
      world.standing.add(Number(parameters[3].enemyEventId));
    }
  });
};

/**
 * Walks the reachable world once, for what stands in it and what it hands the player.
 * @returns {Promise<{ standing: Set<number>, supplied: Set<string> }>}
 */
const surveyWorld = async () =>
{
  const infos = (await readData('MapInfos.json')).filter(info => info);
  const tree = new Map(infos.map(info => [ info.id, info ]));
  const world = { standing: new Set(), supplied: new Set() };

  for (const info of infos)
  {
    if (!isInTheWorld(info.id, tree)) continue;

    const map = await readMap(info.id);
    if (!map) continue;

    map.events.filter(event => event).forEach(event =>
    {
      enemyIdsOf(event).forEach(id => world.standing.add(id));
      event.pages.forEach(page => collectFromCommands(page.list, world));
    });
  }

  const commonEvents = (await readData('CommonEvents.json')).filter(common => common);
  commonEvents.forEach(common => collectFromCommands(common.list, world));

  return world;
};

/**
 * Reads every harvest node, and whether it stands anywhere in the world.
 * @param {{ standing: Set<number> }} world What the world holds.
 * @returns {Promise<BurndownItem[]>}
 */
const surveyNodes = async world =>
{
  const enemies = await readData('Enemies.json');

  return enemies
    .filter(row => row && row.id <= LAST_NODE_ROW && row.name.startsWith('*'))
    .map(row => ({
      id: `node-${row.id}`,
      lane: AUTOMATIC_LANES.nodes,
      item: row.name.slice(1),
      status: world.standing.has(row.id) ? 'Done' : 'To do',
      where: '',
      counted: true,
    }));
};

/**
 * Reads how many of each subgroup's node panels are still placeholders.
 *
 * A placeholder panel already has its parameters and its mastery, and an enemy already hands it out, so
 * what is missing is the name and the flavor a player reads on it.
 * @returns {Promise<BurndownItem[]>}
 */
const surveyPanels = async () =>
{
  const { sdps, subgroups } = await readData('config.sdp.json');

  return subgroups.map(subgroup =>
  {
    const panels = sdps.filter(panel => panel.mastery.subgroupKey === subgroup.key);
    const unnamed = panels.filter(panel => panel.identity.name.includes('==='));

    return {
      id: `panels-${subgroup.key}`,
      lane: AUTOMATIC_LANES.panels,
      item: `${subgroup.name}: ${unnamed.length} of ${panels.length} nodes need a name and flavor`,
      status: unnamed.length > 0 ? 'To do' : 'Done',
      where: '',
      counted: true,
    };
  });
};

/**
 * Reads a table's rows that carry an ingredient type, with their types, for matching a recipe's slots.
 * @param {object} tables The item, weapon and armor tables, keyed by letter.
 * @returns {Array<{ key: string, types: string[] }>}
 */
const readIngredientRows = tables => Object.entries(tables).flatMap(([ letter, table ]) => table
  .filter(row => row && row.name)
  .map(row => ({
    key: `${letter}${row.id}`,
    types: [ ...String(row.note ?? '').matchAll(/<ingredientType:\s*(\w+)>/gi) ].map(match => match[1]),
  }))
  .filter(row => row.types.length > 0));

/**
 * Reads the drop tags out of one table's notes.
 * @param {object[]} rows The table's rows.
 * @param {Set<string>} into Where each dropped row's key goes.
 */
const collectNoteDrops = (rows, into) => rows
  .filter(row => row)
  .forEach(row =>
  {
    for (const match of String(row.note ?? '').matchAll(/<drops:\s*\[\s*([iwa])\s*,\s*(\d+)/gi))
    {
      into.add(`${match[1].toLowerCase()}${match[2]}`);
    }
  });

/**
 * Traces everything a player can obtain, and what that leaves out of reach.
 *
 * It starts from every real way in (a drop on a creature that stands in the world, a drop tag on any
 * other table, an event, a shop, a starting item) and then crafts outward until nothing new turns up,
 * because a recipe's output is only obtainable if its own ingredients and tools are. A slot asking for
 * categories matches a single row carrying all of them, which is how `CraftingComponent` reads it.
 * @param {{ standing: Set<number>, supplied: Set<string> }} world What the world holds.
 * @returns {Promise<{ supply: object, gaps: BurndownItem[], gear: BurndownItem[] }>}
 */
const surveySupply = async world =>
{
  const tables = {
    i: await readData('Items.json'),
    w: await readData('Weapons.json'),
    a: await readData('Armors.json'),
  };
  const { recipes } = await readData('config.crafting.json');
  const enemies = (await readData('Enemies.json')).filter(row => row);
  const obtainable = new Set(world.supplied);

  // a drop on a row nobody has placed yet is promised, not supplied: the placing lanes own that gap.
  const promised = new Set();
  collectNoteDrops(enemies.filter(row => world.standing.has(row.id)), obtainable);
  collectNoteDrops(enemies.filter(row => !world.standing.has(row.id)), promised);

  for (const table of [ 'States', 'Actors', 'Classes', 'Skills' ])
  {
    collectNoteDrops(await readData(`${table}.json`), obtainable);
  }

  const actors = (await readData('Actors.json')).filter(actor => actor);
  actors.forEach(actor => actor.equips.forEach((id, slot) =>
  {
    if (id > 0) obtainable.add(`${slot === 0 ? 'w' : 'a'}${id}`);
  }));

  // a kill can promote a dropped rung to the next one up, so a ladder carries supply upward.
  const ladders = Object.entries(tables).flatMap(([ letter, table ]) => table
    .filter(row => row && /<dropUpgradeId:/i.test(String(row.note ?? '')))
    .map(row => [ `${letter}${row.id}`, `${letter}${String(row.note).match(/<dropUpgradeId:\s*(\d+)>/i)[1]}` ]));

  const ingredientRows = readIngredientRows(tables);
  const isSatisfied = slot =>
  {
    if (slot.id > 0) return obtainable.has(`${slot.type}${slot.id}`);

    return ingredientRows.some(row => obtainable.has(row.key) && slot.categories.every(type => row.types.includes(type)));
  };
  const canMake = recipe => recipe.ingredients.every(isSatisfied) && recipe.tools.every(isSatisfied);

  let grew = true;
  while (grew)
  {
    const before = obtainable.size;

    ladders.forEach(([ rung, next ]) =>
    {
      if (obtainable.has(rung)) obtainable.add(next);
    });

    recipes.filter(canMake).forEach(recipe => recipe.outputs.forEach(output => obtainable.add(`${output.type}${output.id}`)));
    grew = obtainable.size > before;
  }

  const outputs = new Set(recipes.flatMap(recipe => recipe.outputs.map(output => `${output.type}${output.id}`)));
  const blocked = recipes.filter(recipe => !canMake(recipe));

  return {
    supply: buildSupplyRow(recipes, blocked, tables, obtainable),
    gaps: buildGapItems(blocked, isSatisfied, outputs, promised, tables),
    gear: buildGearItems(tables, outputs),
  };
};

/**
 * Whether a row is gear a player could hold, leaving out the materials and dividers in the armor table.
 * @param {object} row The row.
 * @returns {boolean}
 */
const isGear = row => Boolean(row && row.name) && row.id <= 300 && !/^[-=(]/.test(row.name);

/**
 * Sums up what the supply trace reached.
 * @param {object[]} recipes Every recipe.
 * @param {object[]} blocked The recipes nothing can make.
 * @param {object} tables The item, weapon and armor tables.
 * @param {Set<string>} obtainable Everything a player can get.
 * @returns {{ recipes: number, craftable: number, gear: number, gettable: number }}
 */
const buildSupplyRow = (recipes, blocked, tables, obtainable) =>
{
  const gear = [
    ...tables.w.filter(isGear).map(row => `w${row.id}`),
    ...tables.a.filter(isGear).map(row => `a${row.id}`),
  ];

  return {
    recipes: recipes.length,
    craftable: recipes.length - blocked.length,
    gear: gear.length,
    gettable: gear.filter(key => obtainable.has(key)).length,
  };
};

/**
 * Names the root causes of the blocked recipes, one row per thing nothing supplies.
 *
 * Most blocked recipes are downstream of something else, so listing them would count one missing tool
 * thirty times. Only a row no recipe makes, and no unplaced enemy or node is waiting to drop, is a root.
 * The named gear lines are left out, because their own lane covers them.
 * @param {object[]} blocked The recipes nothing can make.
 * @param {function(object): boolean} isSatisfied Whether a recipe's slot can be filled.
 * @param {Set<string>} outputs Everything some recipe makes.
 * @param {Set<string>} promised Everything an unplaced enemy or node would drop.
 * @param {object} tables The item, weapon and armor tables.
 * @returns {BurndownItem[]}
 */
const buildGapItems = (blocked, isSatisfied, outputs, promised, tables) =>
{
  const waiting = new Map();

  blocked.forEach(recipe =>
  {
    const slots = [ ...recipe.ingredients, ...recipe.tools ].filter(slot => !isSatisfied(slot));
    slots.filter(slot => slot.id > 0).forEach(slot =>
    {
      const key = `${slot.type}${slot.id}`;
      const isLineGear = (slot.type === 'w' && slot.id <= LAST_WEAPON_LINE_ROW) ||
        (slot.type === 'a' && slot.id <= LAST_ARMOR_LINE_ROW);
      if (isLineGear || outputs.has(key) || promised.has(key)) return;

      const entry = waiting.get(key) ?? { name: tables[slot.type][slot.id].name, recipes: 0 };
      entry.recipes += 1;
      waiting.set(key, entry);
    });
  });

  return [ ...waiting.entries() ]
    .sort((a, b) => b[1].recipes - a[1].recipes)
    .map(([ key, entry ]) => ({
      id: `supply-${key}`,
      lane: AUTOMATIC_LANES.supply,
      item: `${entry.name}: nothing supplies it, and ${entry.recipes} ${entry.recipes === 1 ? 'recipe waits' : 'recipes wait'} on it`,
      status: 'To do',
      where: '',
      counted: true,
    }));
};

/**
 * Checks each named line for the recipes its upper rungs need.
 *
 * A weapon line is found at rung 7 and forged up through rungs 8 and 9, so those two need recipes. An
 * armor line's rungs 7 to 9 are all restored from salvage, so all three do. The legendary at rung 10
 * has its recipe already, and is out of reach only because it consumes the rung below it.
 * @param {object} tables The item, weapon and armor tables.
 * @param {Set<string>} outputs Everything some recipe makes.
 * @returns {BurndownItem[]}
 */
const buildGearItems = (tables, outputs) =>
{
  const lineItem = (letter, line, rungs) =>
  {
    const offset = (line - 1) * 10;
    const needed = rungs.map(rung => `${letter}${offset + rung}`);
    const missing = needed.filter(key => !outputs.has(key)).length;
    const name = tables[letter][offset + rungs.at(-1)].name;
    const status = missing === 0 ? 'Done' : 'To do';

    return {
      id: `gear-${letter}${line}`,
      lane: AUTOMATIC_LANES.gear,
      item: `${name}'s line: ${missing} of ${needed.length} recipes missing`,
      status: missing > 0 && missing < needed.length ? 'Started' : status,
      where: '',
      counted: true,
    };
  };

  return [
    ...range(1, LAST_WEAPON_LINE_ROW / 10).map(line => lineItem('w', line, [ 8, 9 ])),
    ...range(1, LAST_ARMOR_LINE_ROW / 10).map(line => lineItem('a', line, [ 7, 8, 9 ])),
  ];
};

//endregion reading the game

//region reading the checklist

/**
 * The status a checkbox stands for.
 * @param {string} mark The character between the brackets.
 * @returns {string}
 */
const statusOfBox = mark =>
{
  if (mark === 'x') return 'Done';

  return mark === '~'
    ? 'Started'
    : 'To do';
};

/**
 * Splits a trailing map reference off a checklist line.
 * @param {string} text The line's text.
 * @returns {{ item: string, where: string }}
 */
const splitWhere = text =>
{
  const match = text.match(/^(.*) \(((?:Map|CE)[\dMapCE, -]+)\)$/);
  return match
    ? { item: match[1], where: match[2] }
    : { item: text, where: '' };
};

/**
 * Reads the checklist into lanes, in the order they appear.
 * @param {string} text The checklist's text.
 * @returns {Array<{ name: string, entries: object[] }>}
 */
const parseChecklist = text =>
{
  const lanes = [];

  text.split('\n').forEach(line =>
  {
    const heading = line.match(/^## (.+)$/);
    if (heading)
    {
      lanes.push({ name: heading[1].trim(), entries: [] });
      return;
    }

    const lane = lanes.at(-1);
    if (!lane) return;

    const box = line.match(/^- \[([ ~x])\] (.+)$/);
    if (box)
    {
      lane.entries.push({ mark: box[1], text: box[2].trim() });
      return;
    }

    // a line that wraps is indented, and belongs to the box above it.
    if (line.startsWith('  ') && lane.entries.length > 0)
    {
      lane.entries.at(-1).text += ` ${line.trim()}`;
    }
  });

  return lanes;
};

/**
 * Builds the full list, slotting the measured lanes in at their headings.
 * @param {Array<{ name: string, entries: object[] }>} lanes The checklist's lanes.
 * @param {Map<string, BurndownItem[]>} measured The measured lanes, by heading.
 * @returns {BurndownItem[]}
 */
const buildItems = (lanes, measured) => lanes.flatMap((lane, laneIndex) =>
{
  if (measured.has(lane.name)) return measured.get(lane.name);

  // backticks are for the checklist's own markdown, and would show as stray marks on the page.
  return lane.entries.map((entry, entryIndex) => ({
    id: `list-${laneIndex + 1}-${entryIndex + 1}`,
    lane: lane.name,
    ...splitWhere(entry.text.replaceAll('`', '')),
    status: statusOfBox(entry.mark),
    counted: lane.name !== OFF_THE_LINE,
  }));
});

//endregion reading the checklist

//region reporting

/**
 * Today's date in the machine's own timezone, as the history stores it.
 * @returns {string}
 */
const today = () => new Date().toLocaleDateString('en-CA');

/**
 * Counts each lane that counts toward the target, in list order.
 * @param {BurndownItem[]} items The full list.
 * @returns {Array<{ lane: string, total: number, left: number }>}
 */
const countLanes = items =>
{
  const lanes = new Map();

  items.filter(item => item.counted).forEach(item =>
  {
    const lane = lanes.get(item.lane) ?? { lane: item.lane, total: 0, left: 0 };
    lane.total += 1;
    if (item.status !== 'Done') lane.left += 1;
    lanes.set(item.lane, lane);
  });

  return [ ...lanes.values() ];
};

/**
 * Writes rows as a JSON array with one row per line, so the history diffs one day at a time.
 * @param {string} path Where to write.
 * @param {object[]} rows The rows.
 * @returns {Promise<number>}
 */
const writeRows = (path, rows) =>
{
  const body = rows.map(row => `  ${JSON.stringify(row)}`).join(',\n');
  return Bun.write(path, `[\n${body}\n]\n`);
};

/**
 * Records today in the history, replacing any earlier run from the same day.
 * @param {Array<{ lane: string, total: number, left: number }>} lanes Today's count.
 * @returns {Promise<object[]>}
 */
const recordHistory = async lanes =>
{
  const file = Bun.file(HISTORY_PATH);
  const earlier = await file.exists()
    ? await file.json()
    : [];

  const date = today();
  const rows = [
    ...earlier.filter(row => row.date !== date),
    ...lanes.map(({ lane, total, left }) => ({ date, lane, total, left })),
  ];

  await writeRows(HISTORY_PATH, rows);
  return rows;
};

/**
 * Prints the count.
 * @param {Array<{ lane: string, total: number, left: number }>} lanes The count per lane.
 * @param {object[]} areas The measured areas.
 * @param {{ recipes: number, craftable: number, gear: number, gettable: number }} supply The supply trace.
 */
const printCount = (lanes, areas, supply) =>
{
  const left = lanes.reduce((sum, lane) => sum + lane.left, 0);
  const total = lanes.reduce((sum, lane) => sum + lane.total, 0);

  lanes.forEach(lane => console.log(`${String(lane.left).padStart(4)} of ${String(lane.total).padEnd(4)} ${lane.lane}`));
  console.log(`${String(left).padStart(4)} of ${String(total).padEnd(4)} left in all`);
  console.log('');
  areas.forEach(area => console.log(`${area.area}: ${area.maps} maps, ${area.populated}/${area.needing} populated, ` +
    `${area.lines} lines, ${area.polished} polished`));
  console.log('');
  console.log(`${supply.craftable} of ${supply.recipes} recipes can be made, ${supply.gettable} of ${supply.gear} pieces of gear can be had.`);
};

//endregion reporting

const { areas, maps } = await surveyAreas();
const world = await surveyWorld();
const { supply, gaps, gear } = await surveySupply(world);

const measured = new Map([
  [ AUTOMATIC_LANES.folk, await surveyFolkQuests() ],
  [ AUTOMATIC_LANES.maps, maps ],
  [ AUTOMATIC_LANES.nodes, await surveyNodes(world) ],
  [ AUTOMATIC_LANES.panels, await surveyPanels() ],
  [ AUTOMATIC_LANES.supply, gaps ],
  [ AUTOMATIC_LANES.gear, gear ],
]);

const checklist = parseChecklist(await Bun.file(CHECKLIST_PATH).text());
const items = buildItems(checklist, measured);
const lanes = countLanes(items);

printCount(lanes, areas, supply);

if (process.argv.includes('--write'))
{
  const history = await recordHistory(lanes);
  await writeRows(`${OUT_DIR}/items.json`, items);
  await writeRows(`${OUT_DIR}/history.json`, history);
  await writeRows(`${OUT_DIR}/areas.json`, areas);
  await writeRows(`${OUT_DIR}/supply.json`, [ supply ]);
  console.log(`\nrecorded ${today()} and wrote the page's data to dist/burndown/.`);
}
