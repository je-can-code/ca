/**
 * map-atlas — read the shipped map data and describe the shape of a dungeon.
 *
 * Everything here is derived from `chef-adventure/data/`. Nothing is hand-maintained, because a
 * companion annotations file would be a second source of truth that goes stale the moment an event
 * moves. If the atlas says something is true, the data said it first.
 *
 * Usage:
 *   bun tools/map-atlas.js dungeons
 *   bun tools/map-atlas.js atlas <mapId>
 *   bun tools/map-atlas.js links <rootMapId>
 *   bun tools/map-atlas.js gates <rootMapId>
 *   bun tools/map-atlas.js oneways [rootMapId]
 *   bun tools/map-atlas.js plan <mapId>
 *   bun tools/map-atlas.js event <mapId> [eventId]
 *
 * See docs/maps/atlas.md for what each subcommand is for and how to read its output.
 */

const DATA_DIR = `${import.meta.dir}/../chef-adventure/data`;

//region data loading

const infos = JSON.parse(await Bun.file(`${DATA_DIR}/MapInfos.json`).text());
const tilesets = JSON.parse(await Bun.file(`${DATA_DIR}/Tilesets.json`).text());

/**
 * J-RegionEffects' passage rules exactly as Chef Adventure configures them, read from the shipped plugin
 * list so the atlas walls off what the game does. CA seals its void and ceiling tiles with a denied
 * terrain tag and paints unwalkable ground with a denied region, and plain tileset passability calls
 * both of those floor.
 * @returns {Promise<{denyTerrainTags: number[], denyRegions: number[], allowRegions: number[]}>}
 */
const readRegionRules = async () =>
{
  const source = await Bun.file(`${DATA_DIR}/../js/plugins.js`).text();
  const listStart = source.indexOf('[', source.indexOf('$plugins'));
  const plugins = JSON.parse(source.slice(listStart, source.lastIndexOf(']') + 1));
  const regions = plugins.find(plugin => plugin.status && plugin.name.endsWith('J-RegionEffects'));

  // a project without the plugin switched on walls off nothing beyond the tileset.
  if (regions === undefined) return { denyTerrainTags: [], denyRegions: [], allowRegions: [] };

  // RMMZ stores a list parameter as a JSON-encoded list of strings.
  const idsOf = raw => (raw ? JSON.parse(raw).map(Number) : []);
  return {
    denyTerrainTags: idsOf(regions.parameters.globalDenyTerrainTags),
    denyRegions: idsOf(regions.parameters.globalDenyRegions),
    allowRegions: idsOf(regions.parameters.globalAllowRegions),
  };
};

const regionRules = await readRegionRules();

const allInfos = infos.filter(info => info);
const infoById = new Map(allInfos.map(info => [ info.id, info ]));

const childrenOf = new Map();
allInfos.forEach(info =>
{
  if (!childrenOf.has(info.parentId)) childrenOf.set(info.parentId, []);
  childrenOf.get(info.parentId).push(info);
});

/**
 * Every map id beneath a tree node, at any depth. Grouping nodes like `FLOOR:` and `AREA:` are
 * included; callers drop the ones that turn out to hold no events.
 * @param {number} id The tree node to walk beneath.
 * @returns {number[]}
 */
const descendantsOf = id =>
{
  const found = [];
  const walk = current => (childrenOf.get(current) ?? []).forEach(child =>
  {
    found.push(child.id);
    walk(child.id);
  });
  walk(id);
  return found;
};

const mapCache = new Map();

/**
 * Loads one Map###.json, or returns null when the tree lists an id that has no file on disk.
 * @param {number} id The map id to load.
 * @returns {object|null}
 */
const loadMap = async id =>
{
  if (mapCache.has(id)) return mapCache.get(id);
  const file = Bun.file(`${DATA_DIR}/Map${String(id).padStart(3, '0')}.json`);
  const map = await file.exists() ? JSON.parse(await file.text()) : null;
  mapCache.set(id, map);
  return map;
};

/**
 * Loads every map beneath a tree node that actually exists on disk.
 * @param {number} rootId The dungeon or region root.
 * @returns {Map<number, object>}
 */
const loadSubtree = async rootId =>
{
  const loaded = new Map();
  for (const id of descendantsOf(rootId))
  {
    const map = await loadMap(id);
    if (map !== null) loaded.set(id, map);
  }
  return loaded;
};

const nameOf = id => (infoById.has(id) ? infoById.get(id).name : '<outside this tree>');

//endregion data loading

//region passability

// RMMZ direction numbers map onto passage bits as (1 << (d / 2 - 1)).
const DOWN = 1, LEFT = 2, RIGHT = 4, UP = 8;

// crossing a tile boundary is a two-sided agreement, so each bit needs its opposite: you leave one
// tile going DOWN only if the tile below admits you from UP. DOWN<->UP is 1<->8, LEFT<->RIGHT 2<->4.
const OPPOSITE_BIT = new Map([ [ DOWN, UP ], [ UP, DOWN ], [ LEFT, RIGHT ], [ RIGHT, LEFT ] ]);
const STEPS = [ [ DOWN, 0, 1 ], [ UP, 0, -1 ], [ LEFT, -1, 0 ], [ RIGHT, 1, 0 ] ];

/**
 * Faithful port of Game_Map.checkPassage as J-RegionEffects overwrites it: walk the four tile layers
 * top-down and let the first tile with an opinion decide. Star tiles ([*], flag 0x10) never have one,
 * and a tile carrying a denied terrain tag is a wall whatever its direction bits say.
 * @param {object} map The loaded map.
 * @param {number} x The tile column.
 * @param {number} y The tile row.
 * @param {number} bit The passage bit being tested.
 * @returns {boolean}
 */
const checkPassage = (map, x, y, bit) =>
{
  const { width, height, data } = map;
  const { flags } = tilesets[map.tilesetId];
  for (let z = 3; z >= 0; z--)
  {
    const flag = flags[data[(z * height + y) * width + x]];
    if ((flag & 0x10) !== 0) continue;
    if (regionRules.denyTerrainTags.includes(flag >> 12)) return false;
    if ((flag & bit) === 0) return true;
    if ((flag & bit) === bit) return false;
  }
  return false;
};

/**
 * Whether a walker standing on one tile can step to the neighbouring tile in a direction, honouring
 * both sides of the boundary and any blocking events sitting in the way.
 * @param {object} map The loaded map.
 * @param {number} x The starting column.
 * @param {number} y The starting row.
 * @param {number} bit The direction bit being travelled.
 * @param {Set<string>} blocked Tile keys occupied by something solid.
 * @returns {boolean}
 */
const canStep = (map, x, y, bit, blocked) =>
{
  const [ , dx, dy ] = STEPS.find(([ stepBit ]) => stepBit === bit);
  const nx = x + dx, ny = y + dy;
  if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) return false;
  if (blocked.has(`${nx},${ny}`)) return false;

  // J-RegionEffects judges each half of a step by the region on the far side of it: a denied region
  // refuses that half, an allowed one waves it through, and anything else is the tileset's call.
  const { deny, allow } = regionRulesOf(map);
  const half = (fromX, fromY, farX, farY, halfBit) =>
  {
    const region = map.data[(5 * map.height + farY) * map.width + farX];
    if (deny.includes(region)) return false;
    if (allow.includes(region)) return true;
    return checkPassage(map, fromX, fromY, halfBit);
  };
  return half(x, y, nx, ny, bit) && half(nx, ny, x, y, OPPOSITE_BIT.get(bit));
};

const mapRegionRules = new WeakMap();

/**
 * The regions that deny and allow passage on one map: the plugin's global lists plus the map's own
 * <denyRegions:[...]> and <allowRegions:[...]> note tags, combined the way J-RegionEffects combines them.
 * @param {object} map The loaded map.
 * @returns {{deny: number[], allow: number[]}}
 */
const regionRulesOf = map =>
{
  if (mapRegionRules.has(map)) return mapRegionRules.get(map);
  const fromNote = pattern => [ ...map.note.matchAll(pattern) ].flatMap(match => JSON.parse(match[1]).map(Number));
  const rules = {
    deny: [ ...regionRules.denyRegions, ...fromNote(/<denyRegions:[ ]?(\[[\d, ]+])>/gi) ],
    allow: [ ...regionRules.allowRegions, ...fromNote(/<allowRegions:[ ]?(\[[\d, ]+])>/gi) ],
  };
  mapRegionRules.set(map, rules);
  return rules;
};

/**
 * Every tile reachable on foot from a starting tile. This is the whole point of the tool: it answers
 * "can the player actually get there" rather than "is there a line on the graph".
 * @param {object} map The loaded map.
 * @param {number[]} start The [x, y] tile to flood from.
 * @param {Set<string>} blocked Tile keys occupied by something solid.
 * @returns {Set<string>}
 */
const floodFrom = (map, start, blocked) =>
{
  const seen = new Set();
  const [ sx, sy ] = start;
  if (blocked.has(`${sx},${sy}`)) return seen;

  const queue = [ [ sx, sy ] ];
  seen.add(`${sx},${sy}`);
  while (queue.length > 0)
  {
    const [ x, y ] = queue.pop();
    STEPS.forEach(([ bit, dx, dy ]) =>
    {
      const key = `${x + dx},${y + dy}`;
      if (seen.has(key)) return;
      if (canStep(map, x, y, bit, blocked) === false) return;
      seen.add(key);
      queue.push([ x + dx, y + dy ]);
    });
  }
  return seen;
};

//endregion passability

//region events

// JABS reads its tags from page comments, not from the event's note field. Anything looking for
// <enemyId:...> in `event.note` will find nothing and quietly conclude the map is empty.
const commentsOf = event => event.pages
  .flatMap(page => page.list.filter(command => command.code === 108 || command.code === 408))
  .map(command => command.parameters[0])
  .join(' ');

const enemyIdOf = event =>
{
  const match = commentsOf(event).match(/<enemyId:\s*(\d+)>/i);
  return match === null ? 0 : Number(match[1]);
};

// tool gates are invincible JABS enemies that only the matching tool can remove. A Spire is a wall
// standing in a doorway; a Durable Post is a hookshot anchor, and `through: true` means it never
// blocked anyone in the first place.
const TOOL_GATES = new Map([
  [ 31, { tool: 'shatter/crush', kind: 'wall' } ],
  [ 32, { tool: 'explosive', kind: 'wall' } ],
  [ 33, { tool: 'hookshot', kind: 'anchor' } ],
  [ 34, { tool: 'ignite', kind: 'wall' } ],
]);

const eventsOf = map => map.events.filter(event => event);

/**
 * The tool gates on a map, each tagged with which tool clears it and whether it physically blocks.
 * @param {object} map The loaded map.
 * @returns {object[]}
 */
const gatesOf = map => eventsOf(map)
  .map(event =>
  {
    const gate = TOOL_GATES.get(enemyIdOf(event));
    if (gate === undefined) return null;
    // a page that walks through walls is not standing in anyone's way.
    const solid = event.pages.some(page => page.through === false && page.priorityType === 1);
    return { event, tool: gate.tool, kind: gate.kind, solid };
  })
  .filter(gate => gate !== null);

/**
 * Every direct map transfer authored on a map, with the event that carries it.
 * @param {object} map The loaded map.
 * @returns {object[]}
 */
const transfersOf = map => eventsOf(map).flatMap(event => event.pages.flatMap(page => page.list
  .filter(command => command.code === 201 && command.parameters[0] === 0)
  .map(command =>
  {
    const [ , target, x, y ] = command.parameters;
    return { event, target, landing: [ x, y ] };
  })));

// a Set Movement Route (205) aimed at the player (-1) that contains ROUTE_JUMP (14) with a non-zero
// offset moves them somewhere they may not be able to walk back from.
const ROUTE_JUMP = 14;
const PLAYER_TARGET = -1;

/**
 * Scripted player jumps on a map. These are the in-map counterpart to a one-way transfer: nothing in
 * the transfer graph records them, but they are frequently a point of no return.
 * @param {object} map The loaded map.
 * @returns {object[]}
 */
const jumpsOf = map => eventsOf(map).flatMap(event => event.pages.flatMap(page => page.list
  .filter(command => command.code === 205 && command.parameters[0] === PLAYER_TARGET)
  .flatMap(command => command.parameters[1].list
    .filter(step => step.code === ROUTE_JUMP)
    .map(step =>
    {
      const [ dx, dy ] = step.parameters;
      return { event, dx, dy };
    }))
  .filter(jump => jump.dx !== 0 || jump.dy !== 0)));

//endregion events

//region graph

/**
 * Builds the transfer graph across a set of loaded maps: which map leads where, and through which
 * event. The atlas picture reads doors in more detail; see doorsAround.
 * @param {Map<number, object>} maps The loaded maps to connect.
 * @returns {object[]}
 */
const buildLinks = maps =>
{
  const links = [];
  maps.forEach((map, id) => transfersOf(map).forEach(transfer =>
  {
    links.push({
      from: id,
      to: transfer.target,
      via: transfer.event.name,
      at: [ transfer.event.x, transfer.event.y ],
      landing: transfer.landing,
    });
  }));
  return links;
};

/**
 * Groups map ids into islands that can reach each other by transfer.
 * @param {number[]} ids Every map under consideration.
 * @param {object[]} links The transfer graph, already filtered to these ids.
 * @returns {number[][]}
 */
const componentsOf = (ids, links) =>
{
  const adjacency = new Map(ids.map(id => [ id, new Set() ]));
  links.forEach(link =>
  {
    if (adjacency.has(link.from) === false || adjacency.has(link.to) === false) return;
    adjacency.get(link.from).add(link.to);
    adjacency.get(link.to).add(link.from);
  });

  const seen = new Set();
  const groups = [];
  ids.forEach(id =>
  {
    if (seen.has(id) || adjacency.get(id).size === 0) return;
    const stack = [ id ], group = [];
    seen.add(id);
    while (stack.length > 0)
    {
      const current = stack.pop();
      group.push(current);
      adjacency.get(current).forEach(neighbour =>
      {
        if (seen.has(neighbour)) return;
        seen.add(neighbour);
        stack.push(neighbour);
      });
    }
    groups.push(group);
  });
  return groups;
};

//endregion graph

//region progression

/**
 * How far the Snake Rope reaches, in tiles: the widest crossing a shipped dungeon asks of it. Erocia
 * Isthmus has a crossing 8 tiles wide and the Pearl Salt Mines' NW Corner one of 7, so anything shorter
 * would call playable dungeons blocked. The rope flies in a straight line, so a hookshot post counts as
 * reachable from any spot that close to it along its row or its column, and the pull carries the player
 * across whatever lies between.
 * @type {number}
 */
const ROPE_REACH = 8;

// how much of a dungeon's own logic a walk lets play out: nothing at all, the switches a player can flip
// outright, those plus the ones a puzzle flips, or every condition holding at once.
const SEALED = 0, SWITCHES = 1, PUZZLES = 2, EVERYTHING = 3;

// what each step up in a walk's logic is called on a connector it opens.
const MODE_TAGS = [ '', 'switch', 'puzzle' ];

// conditional branch kinds that test something a player arranges in the room - a variable, a timer, a
// character's position, a button, a script - and so read as a puzzle.
const PUZZLE_BRANCHES = new Set([ 1, 3, 6, 11, 12 ]);

// the conditional branch kinds that test a switch or a self switch, which a walk tracks for itself.
const SWITCH_BRANCH = 0, SELF_SWITCH_BRANCH = 2;

// event commands that open a block of their own one indent deeper: a choice, a loop, a battle outcome.
const BLOCK_OPENERS = new Set([ 402, 403, 112, 601, 602, 603 ]);

// move route commands that walk a character somewhere, as opposed to turning it or changing its look.
const MOVING_ROUTE_CODES = new Set([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]);

const commonEvents = JSON.parse(await Bun.file(`${DATA_DIR}/CommonEvents.json`).text());

/**
 * The tools that clear each kind of tool gate, read from the database rather than written down here. A
 * gate's <strictElements> name the elements that can hurt it, and a hookshot post names its gap-close
 * key; the skills dealing that element or carrying that key are the ones a tool item casts. Each tool is
 * known by the last word of its item's name in lower case - ukelele, bomb, rope - which is short enough
 * to write on a line, and a rename in the database carries straight through.
 * @returns {Promise<Map<number, string[]>>} Each gate enemy's id to the tools that clear it, the tool
 * made for it first.
 */
const readGateTools = async () =>
{
  const read = async name => JSON.parse(await Bun.file(`${DATA_DIR}/${name}.json`).text()).filter(row => row);
  const [ enemies, skills, items ] = await Promise.all([ read('Enemies'), read('Skills'), read('Items') ]);

  const toolOfSkill = new Map();
  items
    .filter(item => /<jabsTool>/i.test(item.note))
    .forEach(item =>
    {
      const cast = item.note.match(/<skillId:\s*(\d+)>/i);
      if (cast !== null) toolOfSkill.set(Number(cast[1]), item.name.trim().split(/\s+/).pop().toLowerCase());
    });
  const toolSkills = skills.filter(skill => toolOfSkill.has(skill.id));

  const gateTools = new Map();
  TOOL_GATES.forEach((_gate, enemyId) =>
  {
    const { note } = enemies.find(enemy => enemy.id === enemyId);
    // element 0 is "None", and a gate that only nothing can hurt is one no element opens.
    const strict = note.match(/<strictElements:\s*\[([\d,\s]+)]>/i);
    const elements = strict === null ? [] : strict[1].split(',').map(Number).filter(element => element > 0);
    const byElement = elements.flatMap(element => toolSkills.filter(skill => skill.damage.elementId === element));
    const key = note.match(/<gapCloseTarget:(\w+)>/i);
    const byKey = key === null ? [] : toolSkills.filter(skill => new RegExp(`<gapClose:${key[1]}>`, 'i').test(skill.note));
    gateTools.set(enemyId, [ ...new Set([ ...byElement, ...byKey ].map(skill => toolOfSkill.get(skill.id))) ]);
  });
  return gateTools;
};

const gateTools = await readGateTools();

// every tool that clears some gate, in the order gates and their tools are listed: the order a label
// prefers when more than one tool would do.
const TOOL_ORDER = [ ...new Set([ ...gateTools.values() ].flat()) ];

// the gates a walker is pulled across to rather than breaks through.
const ANCHOR_GATES = new Set([ ...TOOL_GATES ].filter(([ , gate ]) => gate.kind === 'anchor').map(([ enemyId ]) => enemyId));

const commentCache = new WeakMap();

/**
 * The comments on one page of an event, joined into one string, which is where JABS and J-Pixelistics
 * read their tags. Pages are read over and over by a walk, so each is joined once.
 * @param {object} page The event page.
 * @returns {string}
 */
const pageComments = page =>
{
  if (commentCache.has(page) === false)
  {
    const text = page.list
      .filter(command => command.code === 108 || command.code === 408)
      .map(command => command.parameters[0])
      .join(' ');
    commentCache.set(page, text);
  }
  return commentCache.get(page);
};

// a condition a walk cannot settle either way: a switch one event turns on and another turns off again,
// or anything at all in a walk where every condition is allowed to hold.
const MAYBE = 'maybe';

/**
 * Where a switch stands in a walk: off until something turns it on, then on - or either way, once some
 * event can also turn it back off. A boss room's lock that comes down when the fight ends is the case
 * that needs it, and an orb that can be touched twice is another. In a walk where every condition may
 * hold, every switch stands either way.
 * @param {object} state The walk's state.
 * @param {number} id The switch.
 * @returns {boolean|string} true, false, or MAYBE.
 */
const switchValue = (state, id) =>
{
  if (state.mode === EVERYTHING) return MAYBE;
  if (state.switches.has(id) === false) return false;
  return state.switchesOff.has(id) ? MAYBE : true;
};

/**
 * Where a self switch stands in a walk, on the same terms as a switch.
 * @param {object} state The walk's state.
 * @param {string} key The self switch, as "mapId:eventId:letter".
 * @returns {boolean|string} true, false, or MAYBE.
 */
const selfSwitchValue = (state, key) =>
{
  if (state.mode === EVERYTHING) return MAYBE;
  if (state.selfSwitches.has(key) === false) return false;
  return state.selfSwitchesOff.has(key) ? MAYBE : true;
};

/**
 * Whether a page's conditions hold in a walk's state. A self switch belongs to one event, so it is looked
 * up by that event's key. A variable condition is a count or a position something in the dungeon has to
 * reach, so it may hold once puzzles are allowed; items and actors are the party's to bring, which they
 * have once any of the dungeon's logic plays out.
 * @param {object} page The event page.
 * @param {string} key The event, as "mapId:eventId".
 * @param {object} state The walk's state.
 * @returns {boolean|string} true, false, or MAYBE when the answer depends on something that can go
 * either way.
 */
const pageTruth = (page, key, state) =>
{
  const { conditions } = page;
  const tests = [];
  if (conditions.switch1Valid) tests.push(switchValue(state, conditions.switch1Id));
  if (conditions.switch2Valid) tests.push(switchValue(state, conditions.switch2Id));
  if (conditions.selfSwitchValid) tests.push(selfSwitchValue(state, `${key}:${conditions.selfSwitchCh}`));
  if (conditions.variableValid) tests.push(state.mode >= PUZZLES ? MAYBE : false);
  if (conditions.itemValid || conditions.actorValid)
  {
    if (state.mode === EVERYTHING) tests.push(MAYBE);
    else tests.push(state.mode > SEALED);
  }
  if (tests.includes(false)) return false;
  return tests.includes(MAYBE) ? MAYBE : true;
};

/**
 * The pages an event might be showing in a walk's state, as the engine would pick them: from the last
 * page down, every page whose conditions might hold is possible, until one whose conditions surely hold
 * hides everything beneath it. When no page surely holds the event might not be there at all, which
 * shows as a null among them.
 * @param {object} event The event.
 * @param {string} key The event, as "mapId:eventId".
 * @param {object} state The walk's state.
 * @returns {(object|null)[]}
 */
const possiblePages = (event, key, state) =>
{
  const pages = [];
  for (let index = event.pages.length - 1; index >= 0; index--)
  {
    const truth = pageTruth(event.pages[index], key, state);
    if (truth === false) continue;
    pages.push(event.pages[index]);
    if (truth === true) return pages;
  }
  pages.push(null);
  return pages;
};

/**
 * What running a page's commands does to getting around: the transfers it makes, and the switches and
 * self switches it turns on, each marked when a puzzle stood between the player and that command.
 *
 * Branches are followed the way a player could steer them. Every choice can be picked. A branch on a
 * switch or a self switch goes the way the walk's state says, and both ways when that switch may stand
 * either way. A branch on a count, a position or a script is a puzzle, so only its else side runs until
 * puzzles are allowed, and then both sides can. Anything the party brings - items, gold, an actor - counts
 * as brought once the dungeon's logic is in play. Common events run where they are called, a few calls
 * deep. A switch turned off is reported as well, which makes it one that may stand either way.
 * @param {object[]} list The commands.
 * @param {string} key The running event, as "mapId:eventId", which owns any self switch it touches.
 * @param {object} state The walk's state.
 * @param {boolean} puzzled Whether reaching this list already took solving a puzzle.
 * @param {number} depth How many common events deep this list runs.
 * @returns {{transfers: object[], switches: object[], selfSwitches: object[], switchesOff: number[],
 * selfSwitchesOff: string[], jumps: number[][]}} The jumps are the [dx, dy] of every scripted jump it
 * throws the player through.
 */
const effectsOf = (list, key, state, puzzled, depth) =>
{
  const effects = { transfers: [], switches: [], selfSwitches: [], switchesOff: [], selfSwitchesOff: [], jumps: [] };
  const everything = state.mode === EVERYTHING;

  // per indent level: whether its commands can run, and whether getting there took a puzzle. The else
  // side of each level's last conditional branch is kept for when its 411 arrives.
  const live = [ true ], puzzle = [ puzzled ], otherwise = [];
  const alive = level => live.slice(0, level + 1).every(open => open === true);

  list.forEach(({ code, indent, parameters }) =>
  {
    if (code === 111)
    {
      const [ kind ] = parameters;
      let thenOpen = true, elseOpen = true;
      const puzzling = PUZZLE_BRANCHES.has(kind);
      if (everything === false && (kind === SWITCH_BRANCH || kind === SELF_SWITCH_BRANCH))
      {
        const value = kind === SWITCH_BRANCH
          ? switchValue(state, parameters[1])
          : selfSwitchValue(state, `${key}:${parameters[1]}`);
        const wantsOn = parameters[2] === 0;
        thenOpen = value === MAYBE || value === wantsOn;
        elseOpen = value === MAYBE || value !== wantsOn;
      }
      else if (everything === false && puzzling)
      {
        thenOpen = state.mode >= PUZZLES;
      }
      else if (everything === false)
      {
        thenOpen = state.mode >= SWITCHES;
      }
      live[indent + 1] = alive(indent) && thenOpen;
      puzzle[indent + 1] = puzzle[indent] || puzzling;
      otherwise[indent] = { open: alive(indent) && elseOpen, puzzling };
      return;
    }
    if (code === 411)
    {
      const branch = otherwise[indent] ?? { open: false, puzzling: false };
      live[indent + 1] = branch.open;
      puzzle[indent + 1] = puzzle[indent] || branch.puzzling;
      return;
    }
    if (BLOCK_OPENERS.has(code))
    {
      live[indent + 1] = alive(indent);
      puzzle[indent + 1] = puzzle[indent];
      return;
    }
    if (alive(indent) === false) return;

    const solved = puzzle[indent];
    if (code === 121)
    {
      for (let id = parameters[0]; id <= parameters[1]; id++)
      {
        if (parameters[2] === 0) effects.switches.push({ id, puzzle: solved });
        else effects.switchesOff.push(id);
      }
    }
    else if (code === 123)
    {
      if (parameters[1] === 0) effects.selfSwitches.push({ key: `${key}:${parameters[0]}`, puzzle: solved });
      else effects.selfSwitchesOff.push(`${key}:${parameters[0]}`);
    }
    else if (code === 201 && parameters[0] === 0)
    {
      effects.transfers.push({ to: parameters[1], x: parameters[2], y: parameters[3] });
    }
    else if (code === 205 && parameters[0] === PLAYER_TARGET)
    {
      // a route aimed at the player throws them somewhere no step may lead. Its jumps follow one another,
      // hop by hop across a lava field of platforms, so the player lands where all of them add up to.
      const hops = parameters[1].list.filter(step => step.code === ROUTE_JUMP);
      const landing = hops.reduce(([ x, y ], step) => [ x + step.parameters[0], y + step.parameters[1] ], [ 0, 0 ]);
      if (landing[0] !== 0 || landing[1] !== 0) effects.jumps.push(landing);
    }
    else if (code === 117 && depth < 3 && commonEvents[parameters[0]])
    {
      const called = effectsOf(commonEvents[parameters[0]].list, key, state, solved, depth + 1);
      Object.keys(effects).forEach(kind => effects[kind].push(...called[kind]));
    }
    else if (code === 355 || code === 655)
    {
      [ ...String(parameters[0]).matchAll(/\$gameSwitches\.setValue\(\s*(\d+)\s*,\s*(true|false)\s*\)/g) ]
        .forEach(([ , id, value ]) =>
        {
          if (value === 'true') effects.switches.push({ id: Number(id), puzzle: solved });
          else effects.switchesOff.push(Number(id));
        });
    }
  });
  return effects;
};

/**
 * Whether an event's page stands in a walker's way on the tile it occupies. Only a page at character
 * level that does not walk through things can, and not every one of those does: a JABS enemy can be
 * beaten, a boulder can be pushed and anything that wanders will wander off, so none of them seals a
 * passage. A tool gate stays put until the walk carries a tool that clears it, and a hookshot post is
 * something to be pulled towards, never a wall.
 * @param {object} page The event's active page.
 * @param {Set<string>} tools The tools the walk carries.
 * @returns {boolean}
 */
const blocksWalker = (page, tools) =>
{
  if (page.priorityType !== 1 || page.through) return false;
  if (page.moveType === 1 || page.moveType === 2) return false;
  if (page.moveType === 3 && page.moveRoute.list.some(command => MOVING_ROUTE_CODES.has(command.code))) return false;

  const enemy = pageComments(page).match(/<enemyId:\s*(\d+)>/i);
  if (enemy !== null)
  {
    const enemyId = Number(enemy[1]);
    if (gateTools.has(enemyId) === false || ANCHOR_GATES.has(enemyId)) return false;
    return gateTools.get(enemyId).some(tool => tools.has(tool)) === false;
  }

  // a page that moves its own event when touched is a boulder, there to be pushed out of the way.
  return page.list.some(command => command.code === 205 && command.parameters[0] === 0) === false;
};

/**
 * The rectangle of tiles a page covers, its event's tile being the top-left corner: one tile, unless
 * J-Pixelistics' <areaEvent:[width,height]> stretches it across a doorway.
 * @param {object} page The event page.
 * @returns {number[]} The area's [width, height] in tiles.
 */
const areaOf = page =>
{
  const match = pageComments(page).match(/<areaEvent:[ ]?\[[ ]?(\d+)[ ]?,[ ]?(\d+)[ ]?]>/i);
  return match === null ? [ 1, 1 ] : [ Number(match[1]), Number(match[2]) ];
};

const openWayCache = new WeakMap();

/**
 * Every tile's open ways out on one map, worked out once: the step bits a walker standing there may
 * leave by, with CA's region and terrain rules applied and nothing standing in the way.
 * @param {object} map The loaded map.
 * @returns {Uint8Array} One entry per tile, row by row.
 */
const openWaysOf = map =>
{
  if (openWayCache.has(map)) return openWayCache.get(map);
  const ways = new Uint8Array(map.width * map.height);
  const nobody = new Set();
  for (let y = 0; y < map.height; y++)
  {
    for (let x = 0; x < map.width; x++)
    {
      STEPS.forEach(([ bit ]) =>
      {
        if (canStep(map, x, y, bit, nobody)) ways[y * map.width + x] |= bit;
      });
    }
  }
  openWayCache.set(map, ways);
  return ways;
};

/**
 * Whether a walker who has covered `visited` can set off an event's page. An autorun or parallel page
 * runs as soon as its map is entered. A page at character level is set off from beside it, by bumping
 * into it or facing it; any other is set off by standing on it. Every tile of its area counts.
 * @param {object} map The event's map.
 * @param {object} event The event.
 * @param {object} page Its active page.
 * @param {Uint8Array} visited The tiles covered on this map.
 * @returns {boolean}
 */
const canTrigger = (map, event, page, visited) =>
{
  if (page.trigger === 3 || page.trigger === 4) return true;
  const { width, height } = map;
  const covered = (x, y) => x >= 0 && y >= 0 && x < width && y < height && visited[y * width + x] === 1;
  const [ areaWidth, areaHeight ] = areaOf(page);
  for (let y = event.y; y < event.y + areaHeight; y++)
  {
    for (let x = event.x; x < event.x + areaWidth; x++)
    {
      if (page.priorityType !== 1 && covered(x, y)) return true;
      if (page.priorityType === 1 && STEPS.some(([ , dx, dy ]) => covered(x + dx, y + dy))) return true;
    }
  }
  return false;
};

/**
 * Whether a hookshot post can be reached: some spot the walker can stand lies within the rope's reach of
 * it, straight along its row or its column. Covered ground counts, and so does every post already pulled
 * to, because a walker hanging at one post can fire the rope again from there - which is how a chain of
 * posts strung across open void is crossed.
 * @param {Uint8Array} visited The tiles covered on this map.
 * @param {Set<string>} anchors The posts already pulled to, as "x,y".
 * @param {object} map The map.
 * @param {number} postX The post's column.
 * @param {number} postY The post's row.
 * @returns {boolean}
 */
const withinRope = (visited, anchors, map, postX, postY) =>
{
  for (let reach = 1; reach <= ROPE_REACH; reach++)
  {
    const aimed = STEPS.some(([ , dx, dy ]) =>
    {
      const x = postX + dx * reach, y = postY + dy * reach;
      if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
      return visited[y * map.width + x] === 1 || anchors.has(`${x},${y}`);
    });
    if (aimed) return true;
  }
  return false;
};

/**
 * Floods one room outward from wherever the walker newly arrived in it, never onto a tile something
 * stands on. Carrying the rope, every hookshot post within reach of covered ground pulls the walker to
 * stand beside it and the flood carries on from there, which is how a walk crosses a gap no step can.
 * @param {object} map The room.
 * @param {Uint8Array} visited The tiles covered so far, grown in place.
 * @param {number[][]} seeds The tiles just arrived on, which count as covered whatever stands there.
 * @param {Uint8Array} blocked The tiles something stands on.
 * @param {number[][]} posts The hookshot posts in the room when the walk carries the rope, else none.
 */
const floodRoom = (map, visited, seeds, blocked, posts) =>
{
  const { width, height } = map;
  const ways = openWaysOf(map);
  const queue = [];
  const cover = (x, y) =>
  {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index] === 1) return;
    visited[index] = 1;
    queue.push(index);
  };
  seeds.forEach(([ x, y ]) => cover(x, y));

  const anchors = new Set();
  for (let grew = true; grew;)
  {
    while (queue.length > 0)
    {
      const index = queue.pop();
      const x = index % width, y = Math.floor(index / width);
      STEPS.forEach(([ bit, dx, dy ]) =>
      {
        if ((ways[index] & bit) === 0 || blocked[(y + dy) * width + (x + dx)] === 1) return;
        cover(x + dx, y + dy);
      });
    }

    // the walker pulls itself to every post in reach and lands beside it, on whichever sides can be
    // stood on; a post with none still counts as somewhere to fire the rope from again.
    grew = false;
    posts.forEach(([ postX, postY ]) =>
    {
      if (anchors.has(`${postX},${postY}`) || withinRope(visited, anchors, map, postX, postY) === false) return;
      anchors.add(`${postX},${postY}`);
      grew = true;
      STEPS.forEach(([ , dx, dy ]) =>
      {
        const x = postX + dx, y = postY + dy;
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        if (ways[y * width + x] !== 0 && blocked[y * width + x] === 0) cover(x, y);
      });
    });
  }
};

/**
 * One pass of a walk: floods every room it can get into from where it arrived and from everywhere earlier
 * passes reached, sets off every event it can reach and follows their transfers into further rooms, then
 * turns on whatever switches those events flipped, so the next pass sees the doors they open.
 *
 * Ground an earlier pass covered stays covered, because the player is standing there when a switch flips.
 * A boss room is the case that needs it: beating the boss flips the switch that brings the exit in, and
 * the same switch can reroute the way back in somewhere else, but the player never had to come back in.
 * @param {Set<number>} rooms The dungeon's own rooms; transfers out of them are not followed.
 * @param {object[]} arrivals Where the player arrives, as { map, x, y }.
 * @param {Set<string>} tools The tools carried.
 * @param {object} state The walk's state, whose switches grow at the end of the pass.
 * @param {Map<number, Uint8Array>} reached The tiles earlier passes covered, by room.
 * @returns {{entered: Set<number>, fired: Map<string, number>, grew: boolean, covered: Map<number, Uint8Array>}}
 * The fired transfers carry the order they first went off in.
 */
const walkOnce = (rooms, arrivals, tools, state, reached) =>
{
  const visited = new Map();
  const seeds = new Map();
  const planted = new Set();
  const queue = [];
  // the transfers set off, each with the order it first went off in this pass. The order is causal: a
  // door that can only be reached by coming back through its own mirror always goes off after it.
  const fired = new Map();
  const flippedSwitches = new Set(), flippedSelfSwitches = new Set();
  const flippedSwitchesOff = new Set(), flippedSelfSwitchesOff = new Set();
  const carriesRope = TOOL_ORDER.some(tool => tools.has(tool) && [ ...ANCHOR_GATES ].some(id => gateTools.get(id).includes(tool)));

  // arriving on a square queues its room for flooding, once per square per pass.
  const arrive = (mapId, x, y) =>
  {
    if (rooms.has(mapId) === false || planted.has(`${mapId},${x},${y}`)) return;
    planted.add(`${mapId},${x},${y}`);
    if (seeds.has(mapId) === false) seeds.set(mapId, []);
    seeds.get(mapId).push([ x, y ]);
    queue.push(mapId);
  };
  arrivals.forEach(({ map, x, y }) => arrive(map, x, y));

  // everywhere an earlier pass got to is somewhere the player can already be.
  reached.forEach((tiles, mapId) =>
  {
    const { width } = mapCache.get(mapId);
    if (seeds.has(mapId) === false) seeds.set(mapId, []);
    tiles.forEach((tile, index) =>
    {
      if (tile === 1) seeds.get(mapId).push([ index % width, Math.floor(index / width) ]);
    });
    queue.push(mapId);
  });

  // plays out one page the walker set off: follows its transfers, notes the switches it flips either way,
  // and throws the walker through any scripted jump - from wherever they stood to set it off, which is on
  // the event for a page below or above characters and beside it for one at character level.
  const runPage = (map, mapId, event, key, page, covered) =>
  {
    const effects = effectsOf(page.list, key, state, page.conditions.variableValid, 0);
    if (effects.transfers.length > 0 && fired.has(key) === false) fired.set(key, fired.size);
    effects.transfers.forEach(transfer => arrive(transfer.to, transfer.x, transfer.y));
    effects.switches.forEach(flip => flippedSwitches.add(flip.id));
    effects.selfSwitches.forEach(flip => flippedSelfSwitches.add(flip.key));
    effects.switchesOff.forEach(id => flippedSwitchesOff.add(id));
    effects.selfSwitchesOff.forEach(selfSwitch => flippedSelfSwitchesOff.add(selfSwitch));

    const launches = page.priorityType === 1
      ? STEPS.map(([ , dx, dy ]) => [ event.x + dx, event.y + dy ])
        .filter(([ x, y ]) => x >= 0 && y >= 0 && x < map.width && y < map.height && covered[y * map.width + x] === 1)
      : [ [ event.x, event.y ] ];
    effects.jumps.forEach(([ dx, dy ]) => launches.forEach(([ x, y ]) => arrive(mapId, x + dx, y + dy)));
  };

  while (queue.length > 0)
  {
    const mapId = queue.shift();
    const fresh = seeds.get(mapId);
    if (fresh.length === 0) continue;
    seeds.set(mapId, []);

    const map = mapCache.get(mapId);
    if (visited.has(mapId) === false) visited.set(mapId, new Uint8Array(map.width * map.height));
    const covered = visited.get(mapId);

    // what stands where, and which posts the rope can pull to, as this state shows them. Something only
    // blocks when every page it might be showing blocks; a post is there if any page shows one.
    const blocked = new Uint8Array(map.width * map.height);
    const posts = [];
    eventsOf(map).forEach(event =>
    {
      const pages = possiblePages(event, `${mapId}:${event.id}`, state);
      if (pages.every(page => page !== null && blocksWalker(page, tools))) blocked[event.y * map.width + event.x] = 1;
      const isPost = page =>
      {
        const enemy = page === null ? null : pageComments(page).match(/<enemyId:\s*(\d+)>/i);
        return enemy !== null && ANCHOR_GATES.has(Number(enemy[1]));
      };
      if (carriesRope && pages.some(isPost)) posts.push([ event.x, event.y ]);
    });
    floodRoom(map, covered, fresh, blocked, posts);

    eventsOf(map).forEach(event =>
    {
      const key = `${mapId}:${event.id}`;
      possiblePages(event, key, state)
        .filter(page => page !== null && canTrigger(map, event, page, covered))
        .forEach(page => runPage(map, mapId, event, key, page, covered));
    });
  }

  // a sealed walk lets nothing change, so only the others carry their flipped switches forward.
  let grew = false;
  const adopt = (flipped, into) => flipped.forEach(entry =>
  {
    if (into.has(entry)) return;
    into.add(entry);
    grew = true;
  });
  if (state.mode === SWITCHES || state.mode === PUZZLES)
  {
    adopt(flippedSwitches, state.switches);
    adopt(flippedSelfSwitches, state.selfSwitches);
    adopt(flippedSwitchesOff, state.switchesOff);
    adopt(flippedSelfSwitchesOff, state.selfSwitchesOff);
  }
  return { entered: new Set(visited.keys()), fired, grew, covered: visited };
};

/**
 * Walks a dungeon the way a player could, carrying one set of tools and letting one amount of its logic
 * play out, until a pass flips nothing new. Each pass starts again from the entrance, because a switch
 * flipped in one room can open a door in any other.
 * @param {Set<number>} rooms The dungeon's own rooms.
 * @param {object[]} arrivals Where the player arrives, as { map, x, y }.
 * @param {Set<string>} tools The tools carried.
 * @param {number} mode How much of the dungeon's logic plays out.
 * @returns {{entered: Map<number, number>, fired: Map<string, {pass: number, order: number}>}} The rooms
 * got into, with the pass each was first entered on, and the transfer events set off, as
 * "mapId:eventId", with the pass and the order within it each first went off. A door that first opens on
 * a later pass than its room was entered waited on a switch flipped in between.
 */
const walkDungeon = (rooms, arrivals, tools, mode) =>
{
  const state = { mode, switches: new Set(), selfSwitches: new Set(), switchesOff: new Set(), selfSwitchesOff: new Set() };
  const entered = new Map(), fired = new Map();
  let reached = new Map();
  for (let pass = 0; ; pass++)
  {
    const result = walkOnce(rooms, arrivals, tools, state, reached);
    reached = result.covered;
    result.entered.forEach(id =>
    {
      if (entered.has(id) === false) entered.set(id, pass);
    });
    result.fired.forEach((order, key) =>
    {
      if (fired.has(key) === false) fired.set(key, { pass, order });
    });
    if (result.grew === false || pass === 50) return { entered, fired };
  }
};

/**
 * Where a walk through an island begins: the squares that transfers from outside land the player on in
 * its entrance room, or, for an entrance nothing leads into, the squares of its own doors out.
 * @param {number} start The entrance room.
 * @param {Set<number>} rooms The island's rooms.
 * @param {object[]} transfers Every transfer in the project.
 * @returns {object[]} Arrival squares, as { map, x, y }.
 */
const arrivalsAt = (start, rooms, transfers) =>
{
  const landings = transfers
    .filter(transfer => transfer.to === start && rooms.has(transfer.from) === false)
    .map(transfer => ({ map: start, x: transfer.landing[0], y: transfer.landing[1] }));
  if (landings.length > 0) return landings;
  return transfers
    .filter(transfer => transfer.from === start)
    .map(transfer => ({ map: start, x: transfer.event.x, y: transfer.event.y }));
};

/**
 * The tools that clear some gate standing in an island's rooms, in the order labels prefer them.
 * @param {number[]} island The rooms.
 * @returns {string[]}
 */
const toolsInPlay = island => TOOL_ORDER.filter(tool => island.some(id => gatesOf(mapCache.get(id))
  .some(gate => gateTools.get(enemyIdOf(gate.event)).includes(tool))));

// what a room or a transfer that no walk ever reaches is labelled.
const BLOCKED = { kind: 'blocked', tools: [], mode: EVERYTHING, walk: -2, pass: 0, order: 0 };

/**
 * What it takes to get into each room and set off each transfer of an island from its entrance: the
 * cheapest walk that gets there. Walks run cheapest first - no tools before one, one before two, nothing
 * flipped before plain switches before puzzles - so whatever a walk reaches first is labelled with exactly
 * what that walk carried. What only a walk where every condition holds reaches is locked behind something
 * from outside the dungeon; what even that never reaches is left unlabelled, which reads as blocked.
 * @param {Set<number>} rooms The island's rooms.
 * @param {object[]} arrivals Where the player arrives.
 * @param {string[]} tools The tools in play, preferred first.
 * @returns {{rooms: Map<number, object>, doors: Map<string, object>}} Labels for rooms by id and for
 * transfer events by "mapId:eventId", each { kind, tools, mode, walk, pass }: which walk got there first,
 * what it carried, and on which of its passes.
 */
const requirementsOf = (rooms, arrivals, tools) =>
{
  // every subset of the tools in play, fewest first; the sort is stable, so preferred tools lead ties.
  const subsets = [];
  for (let mask = 0; mask < (1 << tools.length); mask++)
  {
    subsets.push(tools.filter((_tool, index) => (mask & (1 << index)) !== 0));
  }
  subsets.sort((left, right) => left.length - right.length);
  const walks = [ SEALED, SWITCHES, PUZZLES ]
    .flatMap(mode => subsets.map(carried => ({ kind: 'open', tools: carried, mode })))
    .sort((left, right) => left.tools.length + left.mode - (right.tools.length + right.mode))
    .map((walk, index) => ({ ...walk, walk: index }));

  const roomLabels = new Map(), doorLabels = new Map();
  const record = (walk, result) =>
  {
    result.entered.forEach((pass, id) =>
    {
      if (roomLabels.has(id) === false) roomLabels.set(id, { ...walk, pass });
    });
    result.fired.forEach(({ pass, order }, key) =>
    {
      if (doorLabels.has(key) === false) doorLabels.set(key, { ...walk, pass, order });
    });
  };
  walks.forEach(walk => record(walk, walkDungeon(rooms, arrivals, new Set(walk.tools), walk.mode)));
  const locked = { kind: 'locked', tools: [], mode: EVERYTHING, walk: -1 };
  record(locked, walkDungeon(rooms, arrivals, new Set(tools), EVERYTHING));
  return { rooms: roomLabels, doors: doorLabels };
};

/**
 * How expensive a label is, for picking the cheapest way through a connector.
 * @param {object} label A label from requirementsOf.
 * @returns {number}
 */
const costOf = label =>
{
  if (label.kind === 'blocked') return 1000000;
  if (label.kind === 'locked') return 100000;
  return label.tools.length + label.mode;
};

/**
 * What getting through a transfer takes beyond what getting into its room already took: the tools the
 * room did not need, a step up to switches or puzzles, or the whole of "locked" or "blocked".
 *
 * A step counts in two ways. The transfer may need more of the dungeon's logic than its room did, or it
 * may need the same amount again: the same walk entered the room on one pass and only opened the door on
 * a later one, so something had to be flipped in between. That second way is what marks the exit of a
 * room behind one puzzle that is itself behind another.
 * @param {object} label The transfer's label.
 * @param {object} room The label of the room it stands in.
 * @returns {string[]}
 */
const needsBeyond = (label, room) =>
{
  if (label.kind === 'blocked') return room.kind === 'blocked' ? [] : [ 'blocked' ];
  if (label.kind === 'locked') return room.kind === 'open' ? [ 'locked' ] : [];
  if (room.kind !== 'open') return [];
  const tools = label.tools.filter(tool => room.tools.includes(tool) === false);
  const waited = label.walk === room.walk && label.pass > room.pass && label.mode > SEALED;
  const stepped = label.mode > room.mode || waited;
  return stepped ? [ ...tools, MODE_TAGS[label.mode] ] : tools;
};

/**
 * The tag a connector carries: what getting through it takes beyond what getting into the room it leads
 * out of already took. The way through is whichever of its transfers the cheapest walk sets off first,
 * so a tool gate is marked once, on the line where it stands, rather than on every line past it.
 * @param {object} door The connector's door, with the transfer events on each side.
 * @param {{rooms: Map<number, object>, doors: Map<string, object>}} labels From requirementsOf.
 * @param {Set<number>} rooms The island's rooms; transfers outside it were never walked.
 * @returns {string} The tag's parts joined with "+", or an empty string when nothing more is needed.
 */
const tagFor = (door, labels, rooms) =>
{
  const ways = [ [ door.a, door.eventsA ], [ door.b, door.eventsB ] ]
    .filter(([ room ]) => rooms.has(room))
    .flatMap(([ room, events ]) => events.map(event => ({
      label: labels.doors.get(`${room}:${event}`) ?? BLOCKED,
      room: labels.rooms.get(room) ?? BLOCKED,
    })));
  if (ways.length === 0) return '';
  // the way through is the door that went off first: the cheapest walk, its earliest pass, and the first
  // in that pass. Going by the room alone would credit a door the walker only reached by coming back in
  // through its own mirror, which is how a crossing gets tagged at the wrong end.
  const [ first ] = ways.sort((left, right) => costOf(left.label) - costOf(right.label)
    || left.label.pass - right.label.pass
    || left.label.order - right.label.order
    || costOf(left.room) - costOf(right.room)
    || left.room.pass - right.room.pass);
  return needsBeyond(first.label, first.room).join('+');
};

/**
 * What a room asks of the player, as the tags drawn inside its box: the tool made for each kind of gate
 * standing in it, and "puzzle" when solving something there flips a switch - a boulder on its plate, a
 * count reached, a position checked.
 * @param {object} map The room.
 * @param {number} mapId Its id.
 * @returns {string[]}
 */
const roomTagsOf = (map, mapId) =>
{
  const tools = [ ...new Set(gatesOf(map).map(gate => gateTools.get(enemyIdOf(gate.event))[0])) ]
    .filter(tool => tool !== undefined);
  const probe = { mode: PUZZLES, switches: new Set(), selfSwitches: new Set(), switchesOff: new Set(), selfSwitchesOff: new Set() };
  const puzzle = eventsOf(map).some(event => event.pages.some(page =>
  {
    const effects = effectsOf(page.list, `${mapId}:${event.id}`, probe, page.conditions.variableValid, 0);
    return [ ...effects.switches, ...effects.selfSwitches ].some(flip => flip.puzzle);
  }));
  return puzzle ? [ ...tools, 'puzzle' ] : tools;
};

//endregion progression

//region layout and rendering

const NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3;

// canvas steps by direction, clockwise from north. A box side is named by the direction a line leaves
// through it, so the top of a box is NORTH and its left-hand side is WEST.
const DIRS = [ [ 0, -1 ], [ 1, 0 ], [ 0, 1 ], [ -1, 0 ] ];
const opposite = dir => (dir + 2) % 4;
const bitOf = dir => 1 << dir;

// a line cell records which neighbours it reaches, one bit per direction, and that set alone picks its
// glyph. That is what turns a line arriving at a box border into a tidy junction with no special case.
const GLYPHS = new Map([
  [ 0b0101, '│' ], [ 0b0001, '│' ], [ 0b0100, '│' ],
  [ 0b1010, '─' ], [ 0b0010, '─' ], [ 0b1000, '─' ],
  [ 0b0110, '┌' ], [ 0b1100, '┐' ], [ 0b0011, '└' ], [ 0b1001, '┘' ],
  [ 0b0111, '├' ], [ 0b1101, '┤' ], [ 0b1110, '┬' ], [ 0b1011, '┴' ], [ 0b1111, '┼' ],
]);
const ROUNDED = new Map([ [ 0b0110, '╭' ], [ 0b1100, '╮' ], [ 0b0011, '╰' ], [ 0b1001, '╯' ] ]);
const ARROWS = [ '^', '>', 'v', '<' ];

// stepping out through a door in a map's east wall takes you east.
const EDGE_DIR = { N: NORTH, E: EAST, S: SOUTH, W: WEST };

// arriving through a room's own south wall means that room lies north of the one you came from.
const ARRIVAL_DIR = { N: SOUTH, E: WEST, S: NORTH, W: EAST };

// where a room with no compass reading goes, tried in this order around the room it hangs off.
const AROUND = [ [ 0, 1 ], [ 1, 0 ], [ 0, -1 ], [ -1, 0 ], [ 1, 1 ], [ -1, 1 ], [ 1, -1 ], [ -1, -1 ] ];

const WRAP = 10;
const GUTTER_X = 3, GUTTER_Y = 2, MARGIN = 3;

// what a line pays to be drawn: length first, a turn costs three steps, a crossing twelve, and a step
// right beside a box or another line costs half a step more, so lines keep to the middle of a gap.
const STEP_PRICE = 2, HUG_PRICE = 1, BEND_PRICE = 6, CROSS_PRICE = 24;

/**
 * The order a map appears in the editor's map tree, used to break ties the way Jeremy reads the tree.
 * @param {number} id The map.
 * @returns {number}
 */
const treeOrder = id => (infoById.has(id) ? infoById.get(id).order : Number.MAX_SAFE_INTEGER);

/**
 * Reads which wall of its map a door stands in. A door close to a border leads that way; one standing
 * out in the room is a hole, a stairwell or a portal, and has no compass reading at all.
 *
 * Closeness is judged against the map's size as well as in tiles, because a door six tiles down from
 * the top of a forty-tile map is plainly its north door, while six tiles into a tiny room is its middle.
 * @param {object} map The map the door is on.
 * @param {number} x The door's column.
 * @param {number} y The door's row.
 * @returns {string|null} 'N', 'E', 'S' or 'W', or null for a door out in the room.
 */
const edgeOf = (map, x, y) =>
{
  const walls = [
    { edge: 'W', gap: x, span: map.width },
    { edge: 'E', gap: map.width - 1 - x, span: map.width },
    { edge: 'N', gap: y, span: map.height },
    { edge: 'S', gap: map.height - 1 - y, span: map.height },
  ];
  walls.sort((left, right) => left.gap / left.span - right.gap / right.span);
  const [ closest ] = walls;
  return closest.gap <= 4 || closest.gap / closest.span <= 0.2 ? closest.edge : null;
};

/**
 * One end of a door: the wall it stands in, and how far along that wall from 0 at its west or north
 * end to 1 at its east or south end, so two doors in one wall keep their order when drawn.
 * @param {object} map The map this end is on.
 * @param {number} x The door's column, or the landing square's when nobody authored a door here.
 * @param {number} y The matching row.
 * @returns {{edge: string|null, along: number}}
 */
const endOf = (map, x, y) =>
{
  const edge = edgeOf(map, x, y);
  if (edge === null) return { edge, along: 0.5 };
  const along = edge === 'N' || edge === 'S' ? x / Math.max(map.width - 1, 1) : y / Math.max(map.height - 1, 1);
  return { edge, along };
};

/**
 * Every direct transfer in the project, tagged with the map it is authored on. Drawing one dungeon still
 * needs all of them, because the ways into a dungeon are authored on the maps outside it.
 * @returns {Promise<object[]>}
 */
const allTransfers = async () =>
{
  const found = [];
  for (const info of allInfos)
  {
    const map = await loadMap(info.id);
    if (map === null) continue;
    transfersOf(map).forEach(transfer => found.push({ ...transfer, from: info.id, to: transfer.target }));
  }
  return found;
};

/**
 * Every door touching a set of rooms, read from both of its ends wherever both were authored.
 *
 * Transfer events standing side by side are one wide doorway and fold into a single door. A door's
 * return trip is the transfer on the far map whose landing square comes back to it. A transfer whose
 * return trip was never authored is kept and marked one-way, because that is a point of no return.
 * @param {Set<number>} rooms The rooms being drawn.
 * @param {object[]} transfers Every transfer in the project, from allTransfers.
 * @returns {Promise<{doors: object[], broken: object[]}>} The doors, and any transfer aimed at a map
 * that has no file on disk.
 */
const doorsAround = async (rooms, transfers) =>
{
  const doorways = [];
  const broken = [];
  for (const transfer of transfers)
  {
    if (transfer.from === transfer.to) continue;
    if (rooms.has(transfer.from) === false && rooms.has(transfer.to) === false) continue;
    if (await loadMap(transfer.to) === null)
    {
      broken.push(transfer);
      continue;
    }
    const { x, y, id } = transfer.event;
    const twin = doorways.find(door => door.from === transfer.from && door.to === transfer.to
      && Math.max(Math.abs(door.x - x), Math.abs(door.y - y)) <= 2);
    if (twin === undefined) doorways.push({ from: transfer.from, to: transfer.to, x, y, landing: transfer.landing, events: [ id ] });
    else if (twin.events.includes(id) === false) twin.events.push(id);
  }

  // how far a landing square sits from a doorway, in tiles either way.
  const reach = (tile, door) => Math.max(Math.abs(tile[0] - door.x), Math.abs(tile[1] - door.y));
  const paired = new Set();
  const doors = [];
  for (const door of doorways)
  {
    if (paired.has(door)) continue;
    paired.add(door);
    const [ back ] = doorways
      .filter(other => paired.has(other) === false && other.from === door.to && other.to === door.from)
      .sort((left, right) => reach(door.landing, left) + reach(left.landing, door)
        - reach(door.landing, right) - reach(right.landing, door));
    if (back !== undefined) paired.add(back);
    const near = await loadMap(door.from);
    const far = await loadMap(door.to);
    doors.push({
      a: door.from,
      b: door.to,
      endA: endOf(near, door.x, door.y),
      endB: back === undefined ? endOf(far, door.landing[0], door.landing[1]) : endOf(far, back.x, back.y),
      oneWay: back === undefined,
      eventsA: door.events,
      eventsB: back === undefined ? [] : back.events,
    });
  }
  return { doors, broken };
};

/**
 * Folds every door between the same two rooms into one, because a picture of a dungeon wants one line
 * between two rooms however many doorways join them. The door kept is the most telling one: a two-way
 * door over a one-way, and one whose both ends sit in a wall over a hole or a portal. The pair only
 * counts as one-way when every door between them goes the same single way.
 * @param {object[]} doors The doors to fold.
 * @returns {object[]}
 */
const mergeParallel = doors =>
{
  const pairs = new Map();
  doors.forEach(door =>
  {
    const key = [ door.a, door.b ].sort((left, right) => left - right).join('-');
    if (pairs.has(key) === false) pairs.set(key, []);
    pairs.get(key).push(door);
  });
  return [ ...pairs.values() ].map(group =>
  {
    const telling = door => Number(door.oneWay) * 4 + Number(door.endA.edge === null) + Number(door.endB.edge === null);
    const [ kept ] = [ ...group ].sort((left, right) => telling(left) - telling(right));
    const oneWay = group.every(door => door.oneWay && door.a === kept.a);
    // every folded door's transfer events stay with the side of the pair they stand on.
    const eventsA = group.flatMap(door => (door.a === kept.a ? door.eventsA : door.eventsB));
    const eventsB = group.flatMap(door => (door.a === kept.a ? door.eventsB : door.eventsA));
    return { ...kept, oneWay, eventsA: [ ...new Set(eventsA) ], eventsB: [ ...new Set(eventsB) ] };
  });
};

/**
 * Every door seen from one room: which room is on the other side, and how each end of it reads.
 * @param {number} id The room looking out.
 * @param {object[]} doors The doors to look through.
 * @returns {object[]}
 */
const viewsFrom = (id, doors) => doors
  .filter(door => door.a === id || door.b === id)
  .map(door => (door.a === id
    ? { door, other: door.b, near: door.endA, far: door.endB }
    : { door, other: door.a, near: door.endB, far: door.endA }));

/**
 * Fans out two or more doors in one wall, so the rooms behind them land in the order the doors stand.
 * Three doors in a north wall put their rooms to the north-west, the north and the north-east.
 * @param {object[]} views One room's doors, from viewsFrom.
 * @returns {Map<object, number>} Each fanned door's sideways offset, in cells.
 */
const fanOf = views =>
{
  const fans = new Map();
  [ 'N', 'E', 'S', 'W' ].forEach(edge =>
  {
    const wall = views
      .filter(view => view.near.edge === edge)
      .sort((left, right) => left.near.along - right.near.along);
    if (wall.length < 2) return;
    // an even count cannot centre, so it leans toward the half of the wall its doors stand in.
    const mean = wall.reduce((sum, view) => sum + view.near.along, 0) / wall.length;
    const lean = wall.length % 2 === 0 && mean < 0.5 ? 1 : 0;
    wall.forEach((view, index) => fans.set(view, index - Math.floor((wall.length - 1) / 2) - lean));
  });
  return fans;
};

/**
 * Which cell, relative to this room, the room behind a door wants to be in.
 * @param {object} view The door, seen from this room.
 * @param {number} fan Its sideways offset when it shares a wall with other doors.
 * @returns {number[]|null} A [column, row] offset, or null when neither end has a compass reading.
 */
const offsetFor = (view, fan) =>
{
  const out = view.near.edge === null ? null : DIRS[EDGE_DIR[view.near.edge]];
  const back = view.far.edge === null ? null : DIRS[ARRIVAL_DIR[view.far.edge]];
  if (out === null && back === null) return null;
  if (out === null) return back;
  const fanned = out[0] === 0 ? [ fan, out[1] ] : [ out[0], fan ];
  if (back === null) return fanned;
  // out through one room's east wall and in through the next room's south wall: it is north-east.
  if (out[0] * back[0] + out[1] * back[1] === 0) return [ out[0] + back[0], out[1] + back[1] ];
  // the two ends agree, or contradict each other; either way the door you walk through decides.
  return fanned;
};

/**
 * Lays rooms out on a grid by walking outward from the entrance, then hangs the maps outside the
 * dungeon off the rooms that lead to them.
 *
 * When the cell a room wants is taken, a whole column or row is opened beside the room it hangs off
 * instead of settling for the nearest free cell. Opening a column moves everything past it together,
 * so a room that was east of another stays east of it and no door is drawn pointing the wrong way.
 * Maps outside the dungeon only ever take a free cell, so a stub never stretches the picture.
 * @param {number} start The room the walk begins from.
 * @param {Set<number>} rooms The dungeon rooms to place.
 * @param {object[]} doors Every door touching them, including those that lead outside.
 * @returns {Map<number, {col: number, row: number}>}
 */
const placeRooms = (start, rooms, doors) =>
{
  const cells = new Map([ [ start, { col: 0, row: 0 } ] ]);
  const taken = (col, row) => [ ...cells.values() ].some(cell => cell.col === col && cell.row === row);

  // opening a column or row moves everything on its far side along by one, all together.
  const open = (axis, at) => cells.forEach(cell =>
  {
    if (cell[axis] >= at) cell[axis] += 1;
  });

  // puts a room beside the one it hangs off, opening a column or row when its cell is taken.
  const settle = (id, anchor, view, fan, squeeze) =>
  {
    const here = cells.get(anchor);
    const offset = offsetFor(view, fan);
    const free = AROUND
      .map(([ dc, dr ]) => [ here.col + dc, here.row + dr ])
      .find(([ col, row ]) => taken(col, row) === false);

    // a hole or a portal has no compass, so it takes the first free cell around its neighbour.
    if (offset === null && free !== undefined)
    {
      cells.set(id, { col: free[0], row: free[1] });
      return;
    }

    // the cell it wants, then the cells beside that which keep its bearing: one step to either side for
    // a straight door, leaning toward the end of the wall the door stands at, or one step further out
    // along either axis for a diagonal one. Shuffling sideways like this is what keeps a chain of rooms
    // from being wedged in between two rooms that were already placed.
    const [ dc, dr ] = offset ?? [ 0, 1 ];
    const tries = [ [ dc, dr ] ];
    if (dc !== 0 && dr !== 0)
    {
      tries.push([ dc + Math.sign(dc), dr ], [ dc, dr + Math.sign(dr) ]);
    }
    else
    {
      const lean = view.near.along < 0.5 ? -1 : 1;
      [ lean, -lean ].forEach(step => tries.push(dc === 0 ? [ step, dr ] : [ dc, step ]));
    }
    const spot = tries.find(([ tc, tr ]) => taken(here.col + tc, here.row + tr) === false);
    if (spot !== undefined)
    {
      cells.set(id, { col: here.col + spot[0], row: here.row + spot[1] });
      return;
    }

    // a map outside the dungeon makes do with any free cell rather than stretch the picture for a stub.
    if (squeeze && free !== undefined)
    {
      cells.set(id, { col: free[0], row: free[1] });
      return;
    }

    // a door in an east or west wall opens a column, one in a north or south wall opens a row, and the
    // wanted cell then sits in the empty strip. `here` moves along with everything else.
    const sideways = dr === 0 || (dc !== 0 && (view.near.edge === 'E' || view.near.edge === 'W'));
    if (sideways) open('col', dc > 0 ? here.col + 1 : here.col);
    else open('row', dr > 0 ? here.row + 1 : here.row);
    cells.set(id, { col: here.col + dc, row: here.row + dr });
  };

  const internal = doors.filter(door => rooms.has(door.a) && rooms.has(door.b));
  const queue = [ start ];
  while (queue.length > 0)
  {
    const id = queue.shift();
    const views = viewsFrom(id, internal);
    const fans = fanOf(views);

    // doors with a compass reading claim their cells before holes and portals do.
    views
      .sort((left, right) => Number(left.near.edge === null) - Number(right.near.edge === null))
      .forEach(view =>
      {
        if (cells.has(view.other)) return;
        settle(view.other, id, view, fans.get(view) ?? 0, false);
        queue.push(view.other);
      });
  }

  // the maps outside are hung last, each off whichever room leads to it first.
  doors
    .filter(door => rooms.has(door.a) !== rooms.has(door.b))
    .forEach(door =>
    {
      const inside = rooms.has(door.a) ? door.a : door.b;
      const [ view ] = viewsFrom(inside, [ door ]);
      if (cells.has(view.other)) return;
      settle(view.other, inside, view, 0, true);
    });
  return cells;
};

/**
 * The rooms on the way from the entrance to the deepest room, the one the most doors away. In a
 * dungeon that is the throne or the boss; a tie goes to the room later in the map tree.
 * @param {number} start The entrance.
 * @param {object[]} internal The doors between this dungeon's own rooms.
 * @returns {Set<number>}
 */
const mainRoute = (start, internal) =>
{
  const parent = new Map([ [ start, null ] ]);
  const depth = new Map([ [ start, 0 ] ]);
  const queue = [ start ];
  while (queue.length > 0)
  {
    const id = queue.shift();
    viewsFrom(id, internal).forEach(view =>
    {
      if (depth.has(view.other)) return;
      depth.set(view.other, depth.get(id) + 1);
      parent.set(view.other, id);
      queue.push(view.other);
    });
  }
  const [ deepest ] = [ ...depth.keys() ]
    .sort((left, right) => depth.get(right) - depth.get(left) || treeOrder(right) - treeOrder(left));
  const onRoute = new Set();
  for (let id = deepest; id !== null; id = parent.get(id)) onRoute.add(id);
  return onRoute;
};

/**
 * Breaks a map's name onto short lines, so boxes stay narrow enough for a dungeon to fit on a screen.
 * A word longer than a line keeps a line to itself rather than being split.
 * @param {string} name The map's name in the tree.
 * @returns {string[]}
 */
const wrapName = name =>
{
  const lines = [];
  name.split(/\s+/).filter(word => word.length > 0).forEach(word =>
  {
    const last = lines.length - 1;
    if (last >= 0 && lines[last].length + 1 + word.length <= WRAP) lines[last] = `${lines[last]} ${word}`;
    else lines.push(word);
  });
  return lines;
};

/**
 * What one room looks like on the canvas: its name on short lines, then what it asks of the player one
 * tag to a line, and whether it is drawn square (on the main route) or rounded (off it, or outside what
 * is being drawn). Tags stack rather than share a line, so a busy room grows taller instead of wider.
 * @param {number} id The room.
 * @param {boolean} outside Whether it lies outside what is being drawn.
 * @param {boolean} onRoute Whether it lies on the main route.
 * @returns {object}
 */
const boxFor = (id, outside, onRoute) =>
{
  const lines = wrapName(nameOf(id));
  const tags = outside ? [] : roomTagsOf(mapCache.get(id), id);
  tags.forEach(tag => lines.push(`(${tag})`));
  // wide enough that the id on the top border stops short of the box's centre line, which is where a
  // line from the room above comes in.
  const label = ` ${id} `;
  const w = Math.max(label.length + 7, ...lines.map(line => line.length + 4));
  return { id, label, lines, tags, w, h: lines.length + 2, outside, rounded: outside || onRoute === false };
};

/**
 * Turns grid cells into character positions. Each column is as wide as its widest box and every box is
 * centred on its column's centre line, so a door between two rooms stacked in one column comes out as a
 * straight drop instead of a line with a kink in it. Boxes sit at the top of their row, which lines up
 * the first line of text along a row for the doors running east and west.
 * @param {Map<number, object>} cells Each room's grid cell.
 * @param {Map<number, object>} boxes Each room's box, which gains its x, y, col, row and centre here.
 * @param {Map<number, number>} gaps The gap after a column, where wider than usual to fit a line's tag.
 * @returns {{width: number, height: number}} The canvas size the layout needs.
 */
const measure = (cells, boxes, gaps) =>
{
  const widths = new Map(), heights = new Map();
  cells.forEach((cell, id) =>
  {
    widths.set(cell.col, Math.max(widths.get(cell.col) ?? 0, boxes.get(id).w));
    heights.set(cell.row, Math.max(heights.get(cell.row) ?? 0, boxes.get(id).h));
  });
  const cols = [ ...widths.keys() ].sort((left, right) => left - right);
  const rows = [ ...heights.keys() ].sort((left, right) => left - right);

  const lefts = new Map(), tops = new Map();
  let x = MARGIN, y = MARGIN;
  for (let col = cols[0]; col <= cols[cols.length - 1]; col++)
  {
    lefts.set(col, x);
    x += (widths.get(col) ?? 0) + (gaps.get(col) ?? GUTTER_X);
  }
  for (let row = rows[0]; row <= rows[rows.length - 1]; row++)
  {
    tops.set(row, y);
    y += (heights.get(row) ?? 0) + GUTTER_Y;
  }

  cells.forEach((cell, id) =>
  {
    const box = boxes.get(id);
    box.col = cell.col;
    box.row = cell.row;
    box.centre = lefts.get(cell.col) + Math.floor(widths.get(cell.col) / 2);
    box.x = box.centre - Math.floor(box.w / 2);
    box.y = tops.get(cell.row);
  });
  const lastGap = gaps.get(cols[cols.length - 1]) ?? GUTTER_X;
  return { width: x - lastGap + MARGIN, height: y - GUTTER_Y + MARGIN };
};

/**
 * An empty canvas: which room covers each cell, the solid and dashed line bits drawn so far, any text
 * written over the top, and which box corners are drawn rounded.
 * @param {number} width The canvas width in characters.
 * @param {number} height The canvas height in characters.
 * @returns {object}
 */
const makeCanvas = (width, height) =>
{
  const grid = fill => Array.from({ length: height }, () => new Array(width).fill(fill));
  return { width, height, room: grid(0), solid: grid(0), dashed: grid(0), text: grid(null), rounded: new Set() };
};

/**
 * Writes text onto the canvas, over whatever lines are underneath.
 * @param {object} canvas The canvas.
 * @param {number} x The column of the first character.
 * @param {number} y The row.
 * @param {string} text What to write.
 */
const writeText = (canvas, x, y, text) => [ ...text ].forEach((char, index) =>
{
  canvas.text[y][x + index] = char;
});

/**
 * Draws one box: its border into the solid line layer, so lines that reach it later become junctions,
 * and its name inside. The id goes on last, once every line knows where it attaches.
 * @param {object} canvas The canvas.
 * @param {object} box The box, already measured.
 */
const drawBox = (canvas, box) =>
{
  const right = box.x + box.w - 1, bottom = box.y + box.h - 1;
  for (let y = box.y; y <= bottom; y++)
  {
    for (let x = box.x; x <= right; x++) canvas.room[y][x] = box.id;
  }
  for (let x = box.x; x <= right; x++)
  {
    const bits = (x > box.x ? bitOf(WEST) : 0) | (x < right ? bitOf(EAST) : 0);
    canvas.solid[box.y][x] |= bits;
    canvas.solid[bottom][x] |= bits;
  }
  for (let y = box.y; y <= bottom; y++)
  {
    const bits = (y > box.y ? bitOf(NORTH) : 0) | (y < bottom ? bitOf(SOUTH) : 0);
    canvas.solid[y][box.x] |= bits;
    canvas.solid[y][right] |= bits;
  }
  if (box.rounded)
  {
    [ [ box.x, box.y ], [ right, box.y ], [ box.x, bottom ], [ right, bottom ] ]
      .forEach(([ x, y ]) => canvas.rounded.add(`${x},${y}`));
  }
  box.lines.forEach((line, index) =>
  {
    writeText(canvas, box.x + 1 + Math.floor((box.w - 2 - line.length) / 2), box.y + 1 + index, line);
  });
};

/**
 * The side of a box a door's line leaves through: the wall the door really stands in, or for a hole or
 * a portal, whichever side faces the room it leads to.
 * @param {object} end The door's end in this room.
 * @param {object} box This room's box.
 * @param {object} other The box at the far end.
 * @returns {number}
 */
const sideFor = (end, box, other) =>
{
  if (end.edge !== null) return EDGE_DIR[end.edge];
  const dc = other.col - box.col, dr = other.row - box.row;
  if (Math.abs(dr) >= Math.abs(dc)) return dr > 0 ? SOUTH : NORTH;
  return dc > 0 ? EAST : WEST;
};

/**
 * Where along a side a door's line would ideally attach, scaled from where the door stands in its wall.
 * Both ends of a door that crosses straight to a box in the same row or column aim at one shared line
 * instead, so the line between them has no kink.
 * @param {object} box The box.
 * @param {number} side The side being attached to.
 * @param {number} along How far along its wall the door stands, from 0 to 1.
 * @param {boolean} straight Whether the door crosses straight to a box in the same row or column.
 * @returns {number} A column on the top or bottom, a row on either side.
 */
const aimFor = (box, side, along, straight) =>
{
  const across = side === NORTH || side === SOUTH;
  if (straight) return across ? box.centre : box.y + 1;
  if (across) return box.x + 1 + Math.round(along * (box.w - 3));
  return box.y + 1 + Math.round(along * (box.h - 3));
};

/**
 * Picks where on one side of a box a door's line attaches. It aims for where the door really stands,
 * and settles for the nearest cell that is not a corner, does not touch another line's attachment, and
 * still has open space just outside it for the line to leave through.
 * @param {object} canvas The canvas.
 * @param {object} box The box being attached to.
 * @param {number} side The side, as the direction a line leaves through it.
 * @param {number} aim The column (top and bottom) or row (either side) to aim for.
 * @param {Set<string>} reserved The cells outside other doors' attachments, as "x,y".
 * @returns {object|null} The attach point { x, y, side }, or null when that side has no room left.
 */
const attachOn = (canvas, box, side, aim, reserved) =>
{
  const right = box.x + box.w - 1, bottom = box.y + box.h - 1;
  const across = side === NORTH || side === SOUTH;
  const [ dx, dy ] = DIRS[side];
  const spots = [];
  if (across)
  {
    for (let x = box.x + 1; x < right; x++) spots.push({ x, y: side === NORTH ? box.y : bottom, at: x });
  }
  else
  {
    for (let y = box.y + 1; y < bottom; y++) spots.push({ x: side === WEST ? box.x : right, y, at: y });
  }

  // a spot is usable when nothing attaches there yet and the cell just outside it is open.
  const usable = spot =>
  {
    const outX = spot.x + dx, outY = spot.y + dy;
    if (outX < 0 || outY < 0 || outX >= canvas.width || outY >= canvas.height) return false;
    if ((canvas.solid[spot.y][spot.x] & bitOf(side)) !== 0 || reserved.has(`${outX},${outY}`)) return false;
    return canvas.room[outY][outX] === 0 && canvas.solid[outY][outX] === 0 && canvas.dashed[outY][outX] === 0;
  };
  // two lines leaving side by side read as one thick line, so a neighbour of an attachment waits.
  const crowded = spot => [ -1, 1 ].some(step =>
  {
    const x = across ? spot.x + step : spot.x, y = across ? spot.y : spot.y + step;
    return (canvas.solid[y][x] & bitOf(side)) !== 0;
  });
  // the first cells of the top border are where the room's id goes.
  const labelled = spot => side === NORTH && spot.x <= box.x + 5;

  const preferences = [
    spot => usable(spot) && crowded(spot) === false && labelled(spot) === false,
    spot => usable(spot) && crowded(spot) === false,
    usable,
  ];
  for (const acceptable of preferences)
  {
    const [ best ] = spots
      .filter(acceptable)
      .sort((left, right) => Math.abs(left.at - aim) - Math.abs(right.at - aim));
    if (best !== undefined) return { x: best.x, y: best.y, side };
  }
  return null;
};

/**
 * A small binary heap for the route search, ordered by each entry's rank, lowest first.
 * @returns {{push: function(object): void, pop: function(): object, size: function(): number}}
 */
const makeHeap = () =>
{
  const items = [];
  // between equal ranks the entry that has come further wins, which keeps the search straight and short.
  const before = (left, right) => left.rank < right.rank || (left.rank === right.rank && left.cost > right.cost);
  const swap = (first, second) =>
  {
    [ items[first], items[second] ] = [ items[second], items[first] ];
  };
  return {
    size: () => items.length,
    push: item =>
    {
      items.push(item);
      for (let index = items.length - 1; index > 0;)
      {
        const parent = (index - 1) >> 1;
        if (before(items[index], items[parent]) === false) break;
        swap(index, parent);
        index = parent;
      }
    },
    pop: () =>
    {
      const top = items[0];
      const last = items.pop();
      if (items.length === 0) return top;
      items[0] = last;
      for (let index = 0; ;)
      {
        const leftChild = index * 2 + 1, rightChild = index * 2 + 2;
        let next = index;
        if (leftChild < items.length && before(items[leftChild], items[next])) next = leftChild;
        if (rightChild < items.length && before(items[rightChild], items[next])) next = rightChild;
        if (next === index) break;
        swap(index, next);
        index = next;
      }
      return top;
    },
  };
};

/**
 * Finds the cells a door's line passes through between its two attach points, as a cheapest-path
 * search over the canvas. Length is the main price, every turn costs extra and every crossing costs far
 * more, so a line runs straight where it can, crosses another only when there is no way around, and
 * never passes through a room. A line may cross another at right angles but never runs along it or
 * turns on top of it, which keeps every junction on the canvas a real one.
 * @param {object} canvas The canvas.
 * @param {object} from The attach point the line leaves.
 * @param {object} to The attach point it arrives at.
 * @param {boolean} dashed Whether this is a dashed line to a map outside the picture; those cross nothing.
 * @param {Set<string>} reserved The cells just outside every door's attachments, as "x,y". Only this
 * line's own two may be stepped on, so no line runs across a doorway before its own line is drawn.
 * @returns {number[][]|null} The cells between the two attach points, or null when no way exists.
 */
const route = (canvas, from, to, dashed, reserved) =>
{
  const { width, height } = canvas;
  const start = [ from.x + DIRS[from.side][0], from.y + DIRS[from.side][1] ];
  const goal = [ to.x + DIRS[to.side][0], to.y + DIRS[to.side][1] ];
  const arrive = opposite(to.side);
  const ownDoorway = (x, y) => (x === start[0] && y === start[1]) || (x === goal[0] && y === goal[1]);

  // a cell beside a box or another line is a little dearer, so lines keep to the middle of a gap.
  const crowding = (x, y) => DIRS.some(([ dx, dy ]) =>
  {
    const row = canvas.room[y + dy];
    if (row === undefined || x + dx < 0 || x + dx >= width) return false;
    return row[x + dx] !== 0 || canvas.solid[y + dy][x + dx] !== 0 || canvas.dashed[y + dy][x + dx] !== 0;
  });

  // the price of stepping into a cell on top of the step itself, or -1 when the line may not go there.
  // where a solid line and a dashed one cross, the solid one is drawn and the dashed one passes under.
  const priceOf = (x, y, dir) =>
  {
    if (x < 0 || y < 0 || x >= width || y >= height) return -1;
    if (canvas.room[y][x] !== 0 || canvas.text[y][x] !== null) return -1;
    if (reserved.has(`${x},${y}`) && ownDoorway(x, y) === false) return -1;
    const existing = canvas.solid[y][x] | canvas.dashed[y][x];
    if (existing === 0) return crowding(x, y) ? HUG_PRICE : 0;
    const across = dir === NORTH || dir === SOUTH ? bitOf(EAST) | bitOf(WEST) : bitOf(NORTH) | bitOf(SOUTH);
    return existing === across ? CROSS_PRICE : -1;
  };

  const startPrice = priceOf(start[0], start[1], from.side);
  if (startPrice < 0 || startPrice === CROSS_PRICE) return null;

  const key = (x, y, dir) => (y * width + x) * 4 + dir;
  const guess = (x, y) => (Math.abs(x - goal[0]) + Math.abs(y - goal[1])) * STEP_PRICE;
  const best = new Map([ [ key(start[0], start[1], from.side), STEP_PRICE + startPrice ] ]);
  const heap = makeHeap();
  const first = STEP_PRICE + startPrice;
  heap.push({ x: start[0], y: start[1], dir: from.side, cost: first, rank: first + guess(start[0], start[1]), parent: null });

  while (heap.size() > 0)
  {
    const node = heap.pop();
    if (node.done)
    {
      const cells = [];
      for (let step = node.parent; step !== null; step = step.parent) cells.unshift([ step.x, step.y ]);
      return cells;
    }
    if (node.cost > best.get(key(node.x, node.y, node.dir))) continue;

    // standing on a crossing, the line has to carry straight on through it.
    const crossing = (canvas.solid[node.y][node.x] | canvas.dashed[node.y][node.x]) !== 0;
    if (node.x === goal[0] && node.y === goal[1] && crossing === false)
    {
      const cost = node.cost + STEP_PRICE + (node.dir === arrive ? 0 : BEND_PRICE);
      heap.push({ done: true, cost, rank: cost, parent: node });
    }
    for (let dir = 0; dir < 4; dir++)
    {
      if (dir === opposite(node.dir) || (crossing && dir !== node.dir)) continue;
      const x = node.x + DIRS[dir][0], y = node.y + DIRS[dir][1];
      const price = priceOf(x, y, dir);
      if (price < 0) continue;
      const cost = node.cost + STEP_PRICE + price + (dir === node.dir ? 0 : BEND_PRICE);
      const id = key(x, y, dir);
      if (best.has(id) && best.get(id) <= cost) continue;
      best.set(id, cost);
      heap.push({ x, y, dir, cost, rank: cost + guess(x, y), parent: node });
    }
  }
  return null;
};

/**
 * Draws a routed line. Both border cells gain a junction, every cell between gains its bits on the solid
 * or dashed layer, and a one-way door gets an arrowhead just outside the room it leads into.
 * @param {object} canvas The canvas.
 * @param {object} from The attach point the line leaves.
 * @param {number[][]} cells The cells between, from route.
 * @param {object} to The attach point it arrives at.
 * @param {boolean} dashed Whether the line is dashed.
 * @param {boolean} oneWay Whether the door only goes from `from` to `to`.
 */
const drawLine = (canvas, from, cells, to, dashed, oneWay) =>
{
  const points = [ [ from.x, from.y ], ...cells, [ to.x, to.y ] ];
  // the border cells are always solid, so a dashed line still meets its box in a proper junction.
  const layerAt = index => (index === 0 || index === points.length - 1 || dashed === false ? canvas.solid : canvas.dashed);
  points.slice(1).forEach(([ x, y ], index) =>
  {
    const [ px, py ] = points[index];
    const dir = DIRS.findIndex(([ dx, dy ]) => px + dx === x && py + dy === y);
    layerAt(index)[py][px] |= bitOf(dir);
    layerAt(index + 1)[y][x] |= bitOf(opposite(dir));
  });
  if (oneWay)
  {
    const [ x, y ] = cells[cells.length - 1];
    writeText(canvas, x, y, ARROWS[opposite(to.side)]);
  }
};

/**
 * Writes a room's id into its top border, in the first stretch that no line attaches through.
 * @param {object} canvas The canvas.
 * @param {object} box The box.
 */
const placeLabel = (canvas, box) =>
{
  const { label } = box;
  const right = box.x + box.w - 1;
  for (let x = box.x + 1; x + label.length <= right; x++)
  {
    const clear = [ ...label ].every((_, index) => (canvas.solid[box.y][x + index] & bitOf(NORTH)) === 0);
    if (clear)
    {
      writeText(canvas, x, box.y, label);
      return;
    }
  }
  writeText(canvas, box.x + 1, box.y, label);
};

/**
 * Turns the canvas into lines of text, trimming the empty margin the route search was given to work in.
 * @param {object} canvas The canvas.
 * @returns {string[]}
 */
const paint = canvas =>
{
  const glyphAt = (x, y) =>
  {
    if (canvas.text[y][x] !== null) return canvas.text[y][x];
    const solid = canvas.solid[y][x];
    if (solid !== 0 && canvas.rounded.has(`${x},${y}`) && ROUNDED.has(solid)) return ROUNDED.get(solid);
    if (solid !== 0) return GLYPHS.get(solid);
    const dashed = canvas.dashed[y][x];
    if (dashed === 0) return ' ';
    // the box-drawing set has no dashed corners, so a dashed line turns with a solid one.
    if ((dashed & (bitOf(EAST) | bitOf(WEST))) === 0) return '╎';
    if ((dashed & (bitOf(NORTH) | bitOf(SOUTH))) === 0) return '╌';
    return GLYPHS.get(dashed);
  };
  const rows = canvas.room.map((row, y) => row.map((_, x) => glyphAt(x, y)).join('').replace(/\s+$/, ''));
  while (rows.length > 0 && rows[0] === '') rows.shift();
  while (rows.length > 0 && rows[rows.length - 1] === '') rows.pop();
  const indent = Math.min(...rows.filter(row => row !== '').map(row => row.length - row.trimStart().length));
  return rows.map(row => row.slice(indent));
};

/**
 * The legend for one picture, naming only what that picture actually uses.
 * @param {object[]} doors The doors drawn.
 * @param {object[]} boxes The boxes drawn.
 * @param {object[]} plans The lines drawn, with their tags.
 * @returns {string[]}
 */
const legendFor = (doors, boxes, plans) =>
{
  const tags = new Set(plans.flatMap(plan => (plan.tag === '' ? [] : plan.tag.split('+'))));
  const toolTags = TOOL_ORDER.filter(tool => tags.has(tool)).map(tool => `[${tool}]`);
  return [
    '    N',
    'W ──┼── E',
    '    S',
    '',
    '┌──┐ main route: entrance to deepest room',
    '╭──╮ off the main route',
    ...(boxes.some(box => box.outside) ? [ '╌╌╌╌ leads outside this picture' ] : []),
    ...(doors.some(door => door.oneWay) ? [ '──>  one way, no door back' ] : []),
    ...(boxes.some(box => box.tags.length > 0) ? [ '(..) what the room asks for' ] : []),
    ...(toolTags.length > 0 ? [ `${toolTags.join(' ')} bring that tool to get through` ] : []),
    ...(tags.has('switch') ? [ '[switch] flip a switch in the dungeon first' ] : []),
    ...(tags.has('puzzle') ? [ '[puzzle] solve something in the dungeon first' ] : []),
    ...(tags.has('locked') ? [ '[locked] needs progress made somewhere else' ] : []),
    ...(tags.has('blocked') ? [ '[blocked] no way through yet' ] : []),
  ];
};

/**
 * Splits a drawn line into its straight stretches, each keeping only the cells strictly between its two
 * ends, so a corner, a junction or a box border at either end is never written over.
 * @param {number[][]} path Every cell of the line, border cells included.
 * @returns {{horizontal: boolean, inner: number[][]}[]}
 */
const straightRuns = path =>
{
  const runs = [];
  let start = 0;
  for (let index = 1; index < path.length; index++)
  {
    const last = index === path.length - 1;
    const turns = last === false
      && (path[index + 1][0] - path[index][0] !== path[index][0] - path[index - 1][0]
        || path[index + 1][1] - path[index][1] !== path[index][1] - path[index - 1][1]);
    if (turns || last)
    {
      runs.push({ horizontal: path[index][1] === path[start][1], inner: path.slice(start + 1, index) });
      start = index;
    }
  }
  return runs;
};

/**
 * Writes a connector's tag onto its line, in the longest straight stretch with room for it, as near its
 * middle as fits: along a horizontal stretch as part of the line, across a vertical one with the line
 * running through it. A spot only counts when the tag covers nothing but this line's own straight cells
 * and empty space, so it can never hide another line or a crossing.
 * @param {object} canvas The canvas.
 * @param {number[][]} path The line's cells, border cells included.
 * @param {string} text The tag, bracketed.
 * @returns {boolean} Whether the tag found a spot.
 */
const placeTag = (canvas, path, text) =>
{
  const across = bitOf(EAST) | bitOf(WEST), down = bitOf(NORTH) | bitOf(SOUTH);
  const empty = (x, y) => x >= 0 && y >= 0 && x < canvas.width && y < canvas.height && canvas.room[y][x] === 0
    && canvas.solid[y][x] === 0 && canvas.dashed[y][x] === 0 && canvas.text[y][x] === null;
  const straight = (x, y, bits) => (canvas.solid[y][x] | canvas.dashed[y][x]) === bits && canvas.text[y][x] === null;

  const runs = straightRuns(path).sort((left, right) => right.inner.length - left.inner.length);
  for (const run of runs)
  {
    const own = new Set(run.inner.map(([ x, y ]) => `${x},${y}`));
    const middle = (run.inner.length - 1) / 2;
    const tries = run.inner
      .map((cell, index) => ({ cell, offset: Math.abs(index - middle) }))
      .sort((left, right) => left.offset - right.offset);
    for (const { cell: [ cx, cy ] } of tries)
    {
      const left = cx - Math.floor(text.length / 2);
      const cells = [ ...text ].map((_char, index) => [ left + index, cy ]);
      const fits = run.horizontal
        ? cells.every(([ x, y ]) => own.has(`${x},${y}`) && straight(x, y, across))
        : cells.every(([ x, y ]) => (x === cx ? own.has(`${x},${y}`) && straight(x, y, down) : empty(x, y)));
      if (fits)
      {
        writeText(canvas, left, cy, text);
        return true;
      }
    }
  }
  return false;
};

/**
 * Tucks the legend into the empty top-left corner of a picture when it fits there, and puts it above
 * the picture when it does not.
 * @param {string[]} rows The painted picture.
 * @param {string[]} legend The legend lines.
 * @returns {string[]}
 */
const withLegend = (rows, legend) =>
{
  const width = Math.max(...legend.map(line => line.length)) + 2;
  const fits = rows.length > legend.length
    && rows.slice(0, legend.length + 1).every(row => row.slice(0, width).trim() === '');
  if (fits === false) return [ ...legend, '', ...rows ];
  return rows.map((row, index) => (index < legend.length ? `${legend[index].padEnd(width)}${row.slice(width)}` : row));
};

/**
 * Splits rooms into islands joined by doors among themselves. A room whose only doors lead outside is
 * an island of its own.
 * @param {number[]} rooms The rooms.
 * @param {object[]} doors The doors touching them.
 * @returns {number[][]} Each island's rooms in map tree order, islands in the order their first room
 * appears in the tree.
 */
const islandsOf = (rooms, doors) =>
{
  const inside = new Set(rooms);
  const links = doors
    .filter(door => inside.has(door.a) && inside.has(door.b))
    .map(door => ({ from: door.a, to: door.b }));
  const joined = componentsOf(rooms, links);
  const grouped = new Set(joined.flat());
  return [ ...joined, ...rooms.filter(id => grouped.has(id) === false).map(id => [ id ]) ]
    .map(island => [ ...island ].sort((left, right) => treeOrder(left) - treeOrder(right)))
    .sort((left, right) => treeOrder(left[0]) - treeOrder(right[0]));
};

/**
 * Works out how one door will be drawn: its two boxes, the side of each that its line leaves through,
 * and whether it crosses straight to a neighbour in the same row or column.
 * @param {object} door The door.
 * @param {Map<number, object>} boxes Every box, already placed in its grid cell.
 * @param {boolean} dashed Whether the door leads out of the picture.
 * @returns {object}
 */
const planFor = (door, boxes, dashed) =>
{
  const boxA = boxes.get(door.a), boxB = boxes.get(door.b);
  const sideA = sideFor(door.endA, boxA, boxB), sideB = sideFor(door.endB, boxB, boxA);
  const sameRow = boxA.row === boxB.row && sideA === (boxB.col > boxA.col ? EAST : WEST);
  const sameCol = boxA.col === boxB.col && sideA === (boxB.row > boxA.row ? SOUTH : NORTH);
  const straight = (sameRow || sameCol) && sideB === opposite(sideA);
  const span = Math.abs(boxA.col - boxB.col) + Math.abs(boxA.row - boxB.row);
  return { door, boxA, boxB, sideA, sideB, straight, span, dashed };
};

/**
 * Grows each box until every wall has room for its doors: three doors in one wall need room for three
 * lines to leave it apart, and the top border still has to fit the room's id.
 * @param {object[]} plans The doors about to be drawn, from planFor.
 */
const fitDoors = plans =>
{
  const counts = new Map();
  plans.forEach(plan =>
  {
    [ [ plan.boxA, plan.sideA ], [ plan.boxB, plan.sideB ] ].forEach(([ box, side ]) =>
    {
      if (counts.has(box) === false) counts.set(box, [ 0, 0, 0, 0 ]);
      counts.get(box)[side] += 1;
    });
  });
  counts.forEach((sides, box) =>
  {
    box.w = Math.max(box.w, box.label.length + 3 + sides[NORTH] * 3, sides[SOUTH] * 3 + 2);
    box.h = Math.max(box.h, sides[EAST] * 2 + 1, sides[WEST] * 2 + 1);
  });
};

/**
 * Places attachments along one side as near their aims as possible, keeping their order and a free cell
 * between neighbours, and squeezing them together only when the side is too short for that.
 * @param {number[]} aims Each attachment's preferred position, already in the order they must keep.
 * @param {number} lo The first usable position on the side.
 * @param {number} hi The last usable position.
 * @returns {number[]}
 */
const spread = (aims, lo, hi) =>
{
  for (const gap of [ 2, 1 ])
  {
    const spots = aims.map(aim => Math.min(Math.max(aim, lo), hi));
    for (let index = 1; index < spots.length; index++) spots[index] = Math.max(spots[index], spots[index - 1] + gap);
    for (let index = spots.length - 1; index >= 0; index--)
    {
      const limit = index === spots.length - 1 ? hi : spots[index + 1] - gap;
      spots[index] = Math.min(spots[index], limit);
    }
    if (spots[0] >= lo) return spots;
  }
  return aims.map(aim => Math.min(Math.max(aim, lo), hi));
};

/**
 * Decides where every door's line meets its two boxes, one whole side of a box at a time.
 *
 * Lines leaving one side are spread along it in the order of the rooms they lead to, west to east or
 * north to south, so they never have to cross each other on the way out, and a door crossing straight
 * to its neighbour keeps the shared centre line when there is room. The cell just outside every
 * attachment is reserved, so no other line can run across a doorway before its own line is drawn.
 * @param {object[]} plans The doors about to be drawn; each gains its `from` and `to` attach points.
 * @returns {Set<string>} The reserved cells, as "x,y".
 */
const assignAttaches = plans =>
{
  const sides = new Map();
  plans.forEach(plan =>
  {
    const ends = [
      { plan, role: 'from', box: plan.boxA, side: plan.sideA, end: plan.door.endA, other: plan.boxB },
      { plan, role: 'to', box: plan.boxB, side: plan.sideB, end: plan.door.endB, other: plan.boxA },
    ];
    ends.forEach(entry =>
    {
      const key = `${entry.box.id}:${entry.side}`;
      if (sides.has(key) === false) sides.set(key, []);
      sides.get(key).push(entry);
    });
  });

  const reserved = new Set();
  sides.forEach(entries =>
  {
    const { box, side } = entries[0];
    const across = side === NORTH || side === SOUTH;
    // the top border keeps its first cells for the room's id.
    const lo = across ? box.x + 1 + (side === NORTH ? box.label.length : 0) : box.y + 1;
    const hi = across ? box.x + box.w - 2 : box.y + box.h - 2;
    const where = entry => (across ? entry.other.centre : entry.other.y + entry.other.h / 2);
    entries.sort((left, right) => where(left) - where(right) || left.end.along - right.end.along);
    const spots = spread(entries.map(entry => aimFor(box, side, entry.end.along, entry.plan.straight)), lo, hi);
    entries.forEach((entry, index) =>
    {
      const x = across ? spots[index] : box.x + (side === WEST ? 0 : box.w - 1);
      const y = across ? box.y + (side === NORTH ? 0 : box.h - 1) : spots[index];
      entry.plan[entry.role] = { x, y, side };
      reserved.add(`${x + DIRS[side][0]},${y + DIRS[side][1]}`);
    });
  });
  return reserved;
};

/**
 * Draws one island of a dungeon: walks it from the entrance to learn what each door asks, places its
 * rooms, sizes and draws their boxes, routes every door between them and out to the maps beyond, then
 * writes on the tags, the ids and the legend.
 * @param {number[]} island The rooms in it, in map tree order.
 * @param {object[]} doors Every door touching the dungeon.
 * @param {{labels: object, walked: Set<number>}} progress What the walk through the whole dungeon this
 * island belongs to learned, and which rooms it walked. A floor is drawn on its own but walked as part of
 * its dungeon, because a switch on one floor can open a door on another.
 * @returns {{rows: string[], undrawn: object[], untagged: object[]}} The picture, any door no line could
 * be found for, and any line whose tag found no room on it.
 */
const drawIsland = (island, doors, progress) =>
{
  const rooms = new Set(island);
  const local = mergeParallel(doors.filter(door => rooms.has(door.a) || rooms.has(door.b)));
  const internal = local.filter(door => rooms.has(door.a) && rooms.has(door.b));
  const leadsOut = door => rooms.has(door.a) !== rooms.has(door.b);

  // the walk starts at the first room in the tree with a way in from outside, which is the entrance in
  // every dungeon built so far; an island with no way in starts from its first room instead.
  const entrances = island.filter(id => local.some(door => leadsOut(door) && (door.a === id || door.b === id)));
  const [ start ] = entrances.length > 0 ? entrances : island;

  const cells = placeRooms(start, rooms, local);
  const onRoute = mainRoute(start, internal);
  const boxes = new Map([ ...cells ].map(([ id, cell ]) =>
  {
    const box = boxFor(id, rooms.has(id) === false, onRoute.has(id));
    return [ id, { ...box, col: cell.col, row: cell.row } ];
  }));
  const plans = local.map(door => ({ ...planFor(door, boxes, leadsOut(door)), tag: tagFor(door, progress.labels, progress.walked) }));
  fitDoors(plans);

  // a tagged line between rooms in neighbouring columns gets a gap wide enough to write its tag in.
  const gaps = new Map();
  plans
    .filter(plan => plan.tag !== '' && plan.boxA.row === plan.boxB.row && Math.abs(plan.boxA.col - plan.boxB.col) === 1)
    .forEach(plan =>
    {
      const col = Math.min(plan.boxA.col, plan.boxB.col);
      gaps.set(col, Math.max(gaps.get(col) ?? GUTTER_X, plan.tag.length + 6));
    });

  const { width, height } = measure(cells, boxes, gaps);
  const canvas = makeCanvas(width, height);
  boxes.forEach(box => drawBox(canvas, box));
  const reserved = assignAttaches(plans);

  // straight doors are drawn first so they get the straight lines, then the rest from shortest to
  // longest, so a short line to a neighbour is never walled in by a long one looping around it.
  plans.sort((left, right) => Number(left.straight === false) - Number(right.straight === false)
    || left.span - right.span
    || Number(left.dashed) - Number(right.dashed));

  const undrawn = [];
  plans.forEach(plan =>
  {
    const { door, boxA, boxB, dashed } = plan;
    const planned = route(canvas, plan.from, plan.to, dashed, reserved);
    if (planned !== null)
    {
      drawLine(canvas, plan.from, planned, plan.to, dashed, door.oneWay);
      plan.path = [ [ plan.from.x, plan.from.y ], ...planned, [ plan.to.x, plan.to.y ] ];
      return;
    }
    // boxed in on the sides the door really uses, so try whichever sides face each other.
    const sideA = sideFor({ edge: null }, boxA, boxB), sideB = sideFor({ edge: null }, boxB, boxA);
    const from = attachOn(canvas, boxA, sideA, aimFor(boxA, sideA, 0.5, false), reserved);
    const to = attachOn(canvas, boxB, sideB, aimFor(boxB, sideB, 0.5, false), reserved);
    const fallback = from === null || to === null ? null : route(canvas, from, to, dashed, reserved);
    if (fallback === null)
    {
      undrawn.push(door);
      return;
    }
    drawLine(canvas, from, fallback, to, dashed, door.oneWay);
    plan.path = [ [ from.x, from.y ], ...fallback, [ to.x, to.y ] ];
  });

  // tags go on once every line is down, so each one can find room among all of them.
  const untagged = plans
    .filter(plan => plan.tag !== '' && plan.path !== undefined)
    .filter(plan => placeTag(canvas, plan.path, `[${plan.tag}]`) === false);

  boxes.forEach(box => placeLabel(canvas, box));
  const legend = legendFor(local, [ ...boxes.values() ], plans);
  return { rows: withLegend(paint(canvas), legend), undrawn, untagged };
};

//endregion layout and rendering

//region subcommands

/**
 * Lists every dungeon root in the project with the size of its subtree.
 * @returns {void}
 */
const commandDungeons = () =>
{
  const sizeOf = id => (childrenOf.get(id) ?? []).reduce((sum, child) => sum + 1 + sizeOf(child.id), 0);
  console.log('dungeon roots (tree nodes named "DUNGEON: ..."):\n');
  allInfos
    .filter(info => /^DUNGEON:/i.test(info.name))
    .forEach(info => console.log(`  ${String(info.id).padStart(3)}  ${info.name.padEnd(34)} ${sizeOf(info.id)} maps beneath`));
  console.log('\nnote: some dungeons are entered through a map that sits outside their own subtree.');
  console.log('run "links" on a root to see which outside maps lead in.');
};

/**
 * The tree node a drawing covers when asked for one map: the dungeon the map sits in, so naming any of
 * its rooms draws the whole dungeon; otherwise the map's own subtree when it has one, else its parent's.
 * @param {number} mapId The map asked for.
 * @returns {number} The node to draw beneath, or 0 for a lone map at the top of the tree.
 */
const drawingRootOf = mapId =>
{
  for (let id = mapId; infoById.has(id); id = infoById.get(id).parentId)
  {
    if (/^DUNGEON:/i.test(infoById.get(id).name)) return id;
  }
  return (childrenOf.get(mapId) ?? []).length > 0 ? mapId : infoById.get(mapId).parentId;
};

/**
 * Draws a dungeon as named boxes joined by its doors, one picture per FLOOR node. Where each room goes is
 * read from the walls its doors stand in, so the picture is the dungeon's real shape, and naming any map
 * inside a dungeon draws the whole dungeon.
 * @param {number} mapId The dungeon root, or any map inside it.
 * @returns {void}
 */
const commandAtlas = async mapId =>
{
  if (infoById.has(mapId) === false)
  {
    console.log(`no map ${mapId} in the map tree.`);
    return;
  }
  const rootId = drawingRootOf(mapId);
  const transfers = await allTransfers();

  // a dungeon with FLOOR nodes gets one picture per floor and anything else is drawn in one go. A lone
  // map at the top of the tree is drawn with just the maps it leads to.
  const floors = rootId === 0 ? [] : (childrenOf.get(rootId) ?? []).filter(child => /^FLOOR:/i.test(child.name));
  let groups = [ { name: nameOf(mapId), ids: [ mapId ] } ];
  if (floors.length > 0) groups = floors.map(floor => ({ name: floor.name, ids: descendantsOf(floor.id) }));
  else if (rootId !== 0) groups = [ { name: nameOf(rootId), ids: [ rootId, ...descendantsOf(rootId) ] } ];

  // the whole dungeon is walked once, from its entrance, so a switch on one floor can open a door on
  // another; each floor's picture then reads its tags from that one walk.
  const everyId = rootId === 0 ? [ mapId ] : [ rootId, ...descendantsOf(rootId) ];
  const whole = await doorsAround(new Set(everyId), transfers);
  const wholeRooms = everyId.filter(id => whole.doors.some(door => door.a === id || door.b === id));
  const progressOf = new Map();
  const wholeIslands = wholeRooms.length === 0 ? [] : islandsOf(wholeRooms, whole.doors);
  wholeIslands.forEach(island =>
  {
    const walked = new Set(island);
    const leadsIn = id => whole.doors.some(door => (door.a === id || door.b === id) && walked.has(door.a) !== walked.has(door.b));
    const [ start ] = [ ...island.filter(leadsIn), ...island ];
    const labels = requirementsOf(walked, arrivalsAt(start, walked, transfers), toolsInPlay(island));
    island.forEach(id => progressOf.set(id, { labels, walked }));
  });

  for (const group of groups)
  {
    const members = new Set(group.ids);
    const { doors, broken } = await doorsAround(members, transfers);
    const rooms = group.ids.filter(id => doors.some(door => door.a === id || door.b === id));
    console.log(`=== ${group.name} (${rooms.length} maps) ===\n`);

    const islands = rooms.length === 0 ? [] : islandsOf(rooms, doors);
    islands.forEach((island, index) =>
    {
      if (islands.length > 1) console.log(`--- island ${index + 1} of ${islands.length} ---\n`);
      const { rows, undrawn, untagged } = drawIsland(island, doors, progressOf.get(island[0]));
      console.log(rows.join('\n'));
      undrawn.forEach(door => console.log(`\n  no room to draw: ${door.a} ${nameOf(door.a)} <-> ${door.b} ${nameOf(door.b)}`));
      untagged.forEach(plan =>
      {
        const { a, b } = plan.door;
        console.log(`\n  no room on the line for [${plan.tag}]: ${a} ${nameOf(a)} <-> ${b} ${nameOf(b)}`);
      });
      console.log('');
    });

    // the gaps get a line each: a transfer into nowhere, and a built map that nothing leads to yet.
    broken.forEach(transfer =>
    {
      console.log(`  transfer to a map with no file: ${transfer.from} ${nameOf(transfer.from)} "${transfer.event.name}" -> Map${transfer.to}`);
    });
    const unlinked = [];
    for (const id of group.ids)
    {
      const map = await loadMap(id);
      if (map !== null && map.width > 0 && rooms.includes(id) === false) unlinked.push(`${id} ${nameOf(id)}`);
    }
    if (unlinked.length > 0) console.log(`  not linked to anything yet: ${unlinked.join(', ')}\n`);
  }
};

/**
 * Reports how a dungeon is wired: its islands, the outside maps that lead in and out, and any room
 * the transfer graph never reaches.
 * @param {number} rootId The dungeon root.
 * @returns {void}
 */
const commandLinks = async rootId =>
{
  const maps = await loadSubtree(rootId);
  const inside = new Set(maps.keys());
  const internal = buildLinks(maps).filter(link => inside.has(link.to));

  console.log(`${infoById.get(rootId).name} — ${maps.size} maps on disk\n`);

  const groups = componentsOf([ ...inside ], internal);
  console.log(`connected islands: ${groups.length}`);
  groups.forEach((group, index) =>
  {
    console.log(`  #${index + 1} (${group.length} maps): ${group.map(id => `${id} ${nameOf(id)}`).join(', ')}`);
  });

  // the maps that lead in from elsewhere are invisible from inside the dungeon, so the whole project
  // has to be swept to find them.
  const inbound = [];
  for (const info of allInfos)
  {
    if (inside.has(info.id)) continue;
    const map = await loadMap(info.id);
    if (map === null) continue;
    transfersOf(map)
      .filter(transfer => inside.has(transfer.target))
      .forEach(transfer => inbound.push({ from: info.id, to: transfer.target, via: transfer.event.name }));
  }

  console.log('\nways in from outside:');
  [ ...new Map(inbound.map(entry => [ `${entry.from}>${entry.to}`, entry ])).values() ]
    .forEach(entry => console.log(`  ${entry.from} ${nameOf(entry.from)}  ->  ${entry.to} ${nameOf(entry.to)}   via "${entry.via}"`));

  const outbound = buildLinks(maps).filter(link => inside.has(link.to) === false);
  console.log('\nways out to elsewhere:');
  [ ...new Map(outbound.map(link => [ `${link.from}>${link.to}`, link ])).values() ]
    .forEach(link => console.log(`  ${link.from} ${nameOf(link.from)}  ->  ${link.to} ${nameOf(link.to)}   via "${link.via}"`));

  const touched = new Set(internal.flatMap(link => [ link.from, link.to ]));
  const stranded = [ ...inside ].filter(id => touched.has(id) === false && eventsOf(maps.get(id)).length > 0);
  if (stranded.length > 0)
  {
    console.log('\nrooms with events but no transfer of their own:');
    stranded.forEach(id => console.log(`  ${id} ${nameOf(id)}`));
  }
};

/**
 * Proves what each tool gate actually blocks, by flooding the map from one door with the gate tiles
 * treated as walls and checking which other doors remain reachable.
 * @param {number} rootId The dungeon root.
 * @returns {void}
 */
const commandGates = async rootId =>
{
  const maps = await loadSubtree(rootId);
  console.log(`${infoById.get(rootId).name} — tool gates, verified by walking the tiles\n`);

  let found = 0;
  for (const [ id, map ] of maps)
  {
    const gates = gatesOf(map);
    if (gates.length === 0) continue;
    found++;

    const solid = gates.filter(gate => gate.solid && gate.kind === 'wall');
    const anchors = gates.filter(gate => gate.kind === 'anchor');
    console.log(`${String(id).padStart(3)} ${nameOf(id)}  [${map.width}x${map.height}]`);
    if (solid.length > 0)
    {
      const tools = [ ...new Set(solid.map(gate => gate.tool)) ].join(', ');
      console.log(`      ${solid.length} solid gate(s) [${tools}] at ${solid.map(gate => `(${gate.event.x},${gate.event.y})`).join(' ')}`);
    }
    if (anchors.length > 0)
    {
      console.log(`      ${anchors.length} hookshot anchor(s) at ${anchors.map(gate => `(${gate.event.x},${gate.event.y})`).join(' ')} (pass-through, not walls)`);
    }

    const doors = transfersOf(map).map(transfer => ({
      to: transfer.target,
      tile: [ transfer.event.x, transfer.event.y ],
      via: transfer.event.name,
    }));
    if (doors.length < 2 || solid.length === 0)
    {
      console.log('');
      continue;
    }

    const blocked = new Set(solid.map(gate => `${gate.event.x},${gate.event.y}`));
    // flooding twice - once with the gates solid, once with them gone - is what separates "there is
    // a wall in this room" from "this wall is the only thing between these two doors".
    const island = (tile, obstacles) => floodFrom(map, tile, obstacles);
    const [ first, ...rest ] = doors;
    const gatedReach = island(first.tile, blocked);
    const openReach = island(first.tile, new Set());

    rest.forEach(door =>
    {
      const key = `${door.tile[0]},${door.tile[1]}`;
      const reachableNow = gatedReach.has(key);
      const reachableAfter = openReach.has(key);
      const verdict = reachableNow
        ? 'reachable without the tool'
        : reachableAfter
          ? '>> SEPARATED by the gate — the tool opens this route'
          : 'unreachable even with the gate removed (jump, ledge, or a second obstacle)';
      console.log(`      door "${first.via}" -> door "${door.via}" (to ${door.to} ${nameOf(door.to)}): ${verdict}`);
    });
    console.log('');
  }

  if (found === 0) console.log('  no tool gates in this dungeon.');
};

/**
 * Finds the points of no return: transfers authored in only one direction, and scripted player jumps
 * that move them somewhere they may not be able to walk back from.
 * @param {number} rootId The dungeon root, or 0 to sweep the whole project.
 * @returns {void}
 */
const commandOneways = async rootId =>
{
  const scoped = new Set(rootId === 0 ? allInfos.map(info => info.id) : descendantsOf(rootId));
  const scope = rootId === 0 ? 'the whole project' : infoById.get(rootId).name;

  // mirrors are looked for across the entire project even when the report is scoped, because the
  // return trip out of a dungeon is authored on the map outside it. Scoping the search instead of
  // the report turns every exit into a false one-way.
  const edges = [];
  const jumps = [];
  for (const info of allInfos)
  {
    const map = await loadMap(info.id);
    if (map === null) continue;
    transfersOf(map).forEach(transfer => edges.push({ from: info.id, to: transfer.target, via: transfer.event.name }));
    if (scoped.has(info.id)) jumpsOf(map).forEach(jump => jumps.push({ id: info.id, ...jump }));
  }

  // a one-way is simply a transfer whose mirror was never authored.
  const present = new Set(edges.map(edge => `${edge.from}>${edge.to}`));
  const oneWay = [ ...new Map(edges
    .filter(edge => scoped.has(edge.from) || scoped.has(edge.to))
    .filter(edge => present.has(`${edge.to}>${edge.from}`) === false)
    .map(edge => [ `${edge.from}>${edge.to}`, edge ])).values() ];

  const inScope = edges.filter(edge => scoped.has(edge.from)).length;
  console.log(`${scope} — ${inScope} transfers authored here, ${oneWay.length} one-way route(s) touching it\n`);
  oneWay.forEach(edge =>
  {
    console.log(`  ${String(edge.from).padStart(3)} ${nameOf(edge.from).padEnd(30)} -> ${String(edge.to).padStart(3)} ${nameOf(edge.to).padEnd(30)} via "${edge.via}"`);
  });

  console.log(`\nscripted player jumps (${jumps.length}) — in-map points of no return:`);
  jumps.forEach(jump =>
  {
    console.log(`  ${String(jump.id).padStart(3)} ${nameOf(jump.id).padEnd(30)} "${jump.event.name}" at (${jump.event.x},${jump.event.y}) jumps [${jump.dx},${jump.dy}]`);
  });
};

/**
 * Draws one map as a text floor plan: walls, open floor, directional tiles, and the events that
 * matter, so a room can be read without opening the RMMZ editor.
 * @param {number} mapId The map to draw.
 * @returns {void}
 */
const commandPlan = async mapId =>
{
  const map = await loadMap(mapId);
  if (map === null)
  {
    console.log(`no Map${String(mapId).padStart(3, '0')}.json on disk.`);
    return;
  }

  const overlay = new Map();
  eventsOf(map).forEach(event =>
  {
    const enemyId = enemyIdOf(event);
    const commands = event.pages.flatMap(page => page.list);
    const codes = new Set(commands.map(command => command.code));

    let mark = 'e';
    if (codes.has(201)) mark = 'T';
    else if (TOOL_GATES.has(enemyId)) mark = 'X';
    else if (enemyId > 0) mark = 'E';
    else if (codes.has(125) || codes.has(126) || codes.has(127)) mark = '$';
    else if (codes.has(101)) mark = '!';
    overlay.set(`${event.x},${event.y}`, { mark, event, enemyId });
  });

  const glyph = (x, y) =>
  {
    const open = [ DOWN, LEFT, RIGHT, UP ].filter(bit => checkPassage(map, x, y, bit)).length;
    if (open === 4) return '.';
    if (open === 0) return '#';
    return '+';
  };

  console.log(`Map${String(mapId).padStart(3, '0')} — ${nameOf(mapId)}  [${map.width}x${map.height}]  tileset: ${tilesets[map.tilesetId].name}`);
  console.log('legend: . open   + directional   # wall   T transfer   X tool gate   E enemy   $ treasure   ! talker   e other\n');

  for (let y = 0; y < map.height; y++)
  {
    let row = '';
    for (let x = 0; x < map.width; x++)
    {
      const hit = overlay.get(`${x},${y}`);
      row += hit ? hit.mark : glyph(x, y);
    }
    console.log(`${String(y).padStart(2)} ${row}`);
  }

  console.log('');
  overlay.forEach(({ mark, event, enemyId }) =>
  {
    const enemy = enemyId > 0 ? ` enemyId:${enemyId}` : '';
    console.log(`  ${mark} (${event.x},${event.y}) #${event.id} ${event.name}${enemy}`);
  });
};

/**
 * The event command codes worth narrating, and how to say each one.
 *
 * Anything absent is printed as its bare numeric code rather than dropped, because a command nobody
 * has taught this tool about is exactly the one worth noticing in an unfamiliar event.
 * @type {Object<number, {label: string, detail: (parameters: any[]) => string}>}
 */
const COMMAND_READERS = {
  101: { label: 'text', detail: p => `speaker: ${p[4] || '(none)'}` },
  401: { label: '  |', detail: p => p[0] },
  102: { label: 'choices', detail: p => JSON.stringify(p[0]) },
  402: { label: 'when', detail: p => p[1] },
  103: { label: 'input-number', detail: p => `var ${p[0]}, ${p[1]} digits` },
  108: { label: 'comment', detail: p => p[0] },
  408: { label: 'comment', detail: p => p[0] },
  111: { label: 'if', detail: p => describeCondition(p) },
  411: { label: 'else', detail: () => '' },
  412: { label: 'end-if', detail: () => '' },
  117: { label: 'common-event', detail: p => `CE${p[0]}` },
  121: { label: 'switch', detail: p => `${p[0] === p[1] ? p[0] : `${p[0]}-${p[1]}`} = ${p[2] === 0 ? 'ON' : 'OFF'}` },
  122: { label: 'variable', detail: p => `var ${p[0] === p[1] ? p[0] : `${p[0]}-${p[1]}`}` },
  123: { label: 'self-switch', detail: p => `${p[0]} = ${p[1] === 0 ? 'ON' : 'OFF'}` },
  126: { label: 'gain-item', detail: p => `item ${p[0]} x${p[3]}` },
  127: { label: 'gain-weapon', detail: p => `weapon ${p[0]} x${p[3]}` },
  128: { label: 'gain-armor', detail: p => `armor ${p[0]} x${p[3]}` },
  201: { label: 'transfer', detail: p => `-> Map${p[1]} (${p[2]},${p[3]})` },
  205: { label: 'move-route', detail: () => '' },
  212: { label: 'animation', detail: p => `id ${p[1]}` },
  213: { label: 'balloon', detail: p => `id ${p[1]}` },
  230: { label: 'wait', detail: p => `${p[0]} frames` },
  355: { label: 'script', detail: p => p[0] },
  655: { label: '  |', detail: p => p[0] },
  357: { label: 'PLUGIN', detail: p => `${p[1]} ${JSON.stringify(p[3])}` },
  657: { label: '  |', detail: p => p[0] },
};

/**
 * Renders a conditional branch's parameters as something a person can read.
 *
 * Only the branch kinds this project actually uses are spelled out; the rest fall back to the raw
 * parameters, which is still more useful than pretending the branch is not there.
 * @param {any[]} parameters The conditional branch's parameters.
 * @returns {string}
 */
const describeCondition = parameters =>
{
  const [ kind ] = parameters;

  // switch is by far the most common gate in this project's events.
  if (kind === 0) return `switch ${parameters[1]} is ${parameters[2] === 0 ? 'ON' : 'OFF'}`;

  // variable comparisons against a constant.
  if (kind === 1) return `var ${parameters[1]} compared to ${parameters[3]}`;

  // self-switches gate the per-event progression pages.
  if (kind === 2) return `self-switch ${parameters[1]} is ${parameters[2] === 0 ? 'ON' : 'OFF'}`;

  // script conditions carry their own explanation.
  if (kind === 12) return `script: ${parameters[1]}`;

  return JSON.stringify(parameters);
};

/**
 * Describes the conditions under which one page of an event becomes the active page.
 * @param {object} conditions The page's conditions object.
 * @returns {string}
 */
const describePageConditions = conditions =>
{
  const gates = [];

  if (conditions.switch1Valid) gates.push(`switch ${conditions.switch1Id}`);
  if (conditions.switch2Valid) gates.push(`switch ${conditions.switch2Id}`);
  if (conditions.variableValid) gates.push(`var ${conditions.variableId} >= ${conditions.variableValue}`);
  if (conditions.selfSwitchValid) gates.push(`self-switch ${conditions.selfSwitchCh}`);
  if (conditions.itemValid) gates.push(`holding item ${conditions.itemId}`);
  if (conditions.actorValid) gates.push(`actor ${conditions.actorId} in party`);

  return gates.length ? gates.join(' AND ') : 'no conditions';
};

/**
 * How RPG Maker names each page trigger, indexed by the trigger's own value.
 * @type {string[]}
 */
const TRIGGER_NAMES = [ 'action button', 'player touch', 'event touch', 'autorun', 'parallel' ];

/**
 * Prints one page of an event: what makes it the active page, and everything it then does.
 * @param {object} page The event page to narrate.
 * @param {number} pageIndex The page's index within the event.
 */
const printPage = (page, pageIndex) =>
{
  const trigger = TRIGGER_NAMES[page.trigger] ?? `trigger ${page.trigger}`;
  console.log(`\n  --- page ${pageIndex} [${describePageConditions(page.conditions)}] on ${trigger} ---`);

  page.list.forEach(command =>
  {
    // an empty command is the terminator RPG Maker appends to every list and branch.
    if (command.code === 0) return;

    const reader = COMMAND_READERS[command.code];
    const indent = '  '.repeat(command.indent + 1);

    // an unknown code still gets a line, because silence would hide it.
    if (!reader)
    {
      console.log(`${indent}[${command.code}]`);
      return;
    }

    const detail = reader.detail(command.parameters);
    console.log(`${indent}${reader.label}${detail ? ` ${detail}` : ''}`);
  });
};

/**
 * Prints every page of one event, or a one-line summary of every event on the map.
 *
 * This is the companion to `plan`: that answers "what does this room look like and who is standing in
 * it", and this answers "what does that one actually do when you walk up to it".
 * @param {number} mapId The map to inspect.
 * @param {number} eventId The event to narrate, or NaN to list them all.
 */
const commandEvent = async (mapId, eventId) =>
{
  const map = await loadMap(mapId);

  if (!map)
  {
    console.log(`Map${mapId} does not exist.`);
    return;
  }

  const events = map.events.filter(event => event);
  console.log(`Map${String(mapId).padStart(3, '0')} — ${nameOf(mapId)}  [${events.length} events]`);

  // with no event named, a summary is more useful than dumping every page on the map.
  if (Number.isNaN(eventId))
  {
    events.forEach(event =>
    {
      const pages = event.pages
        .map((page, index) => `p${index}[${describePageConditions(page.conditions)}]`)
        .join(' ');
      console.log(`  #${String(event.id).padStart(3)} (${event.x},${event.y}) ${event.name}\n        ${pages}`);
    });

    console.log(`\nname an event id to read its pages: bun tools/map-atlas.js event ${mapId} <eventId>`);
    return;
  }

  const event = map.events[eventId];

  if (!event)
  {
    console.log(`  no event #${eventId} on this map.`);
    return;
  }

  console.log(`\n#${event.id} "${event.name}" at (${event.x},${event.y}), ${event.pages.length} pages`);
  event.pages.forEach(printPage);
};

//endregion subcommands

const [ command, argument, secondArgument ] = Bun.argv.slice(2);
const target = Number(argument);

switch (command)
{
  case 'dungeons':
    commandDungeons();
    break;
  case 'atlas':
    await commandAtlas(target);
    break;
  case 'links':
    await commandLinks(target);
    break;
  case 'gates':
    await commandGates(target);
    break;
  case 'oneways':
    await commandOneways(Number.isNaN(target) ? 0 : target);
    break;
  case 'plan':
    await commandPlan(target);
    break;
  case 'event':
    await commandEvent(target, Number(secondArgument));
    break;
  default:
    console.log('usage: bun tools/map-atlas.js <dungeons|atlas|links|gates|oneways|plan> [mapId]');
    console.log('       bun tools/map-atlas.js event <mapId> [eventId]');
    console.log('see docs/maps/atlas.md for what each subcommand answers.');
}
