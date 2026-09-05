/**
 * map-atlas — read the shipped map data and describe the shape of a dungeon.
 *
 * Everything here is derived from `chef-adventure/data/`. Nothing is hand-maintained, because a
 * companion annotations file would be a second source of truth that goes stale the moment an event
 * moves. If the atlas says something is true, the data said it first.
 *
 * Usage:
 *   bun tools/map-atlas.js dungeons
 *   bun tools/map-atlas.js atlas <rootMapId>
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
 * Faithful port of Game_Map.checkPassage: walk the four tile layers top-down and let the first tile
 * with an opinion decide. Star tiles ([*], flag 0x10) never have one.
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
  if (checkPassage(map, x, y, bit) === false) return false;
  return checkPassage(map, nx, ny, OPPOSITE_BIT.get(bit));
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
 * Builds the transfer graph across a set of loaded maps, keeping the compass facing of each door.
 * A door sitting on a map border tells you which way it leads; one in the middle of a room is a
 * stairwell or a hole and carries no direction at all.
 * @param {Map<number, object>} maps The loaded maps to connect.
 * @returns {object[]}
 */
const buildLinks = maps =>
{
  const INTERIOR_MARGIN = 4;
  const facing = (map, event) =>
  {
    const borders = [
      { dir: 'W', gap: event.x },
      { dir: 'E', gap: map.width - 1 - event.x },
      { dir: 'N', gap: event.y },
      { dir: 'S', gap: map.height - 1 - event.y },
    ];
    borders.sort((left, right) => left.gap - right.gap);
    const [ closest ] = borders;
    return closest.gap <= INTERIOR_MARGIN ? closest.dir : null;
  };

  const links = [];
  maps.forEach((map, id) => transfersOf(map).forEach(transfer =>
  {
    links.push({
      from: id,
      to: transfer.target,
      dir: facing(map, transfer.event),
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

//region layout and rendering

const DELTA = { N: [ 0, -1 ], S: [ 0, 1 ], E: [ 1, 0 ], W: [ -1, 0 ] };
const OPPOSITE_DIR = { N: 'S', S: 'N', E: 'W', W: 'E' };
const CELL_W = 8, CELL_H = 4, BOX_W = 5;

/**
 * Places rooms on an integer grid by walking outward from a start room and honouring the compass
 * facing of each door, so the picture reflects the real geometry rather than an arbitrary tree.
 * @param {number} startId The room to place at the origin.
 * @param {Set<number>} allowed The rooms eligible for placement.
 * @param {Map<number, object[]>} neighbours Bidirectional adjacency with directions.
 * @returns {Map<number, object>}
 */
const layoutFloor = (startId, allowed, neighbours) =>
{
  const placed = new Map();
  const taken = new Set([ '0,0' ]);
  placed.set(startId, { x: 0, y: 0 });

  // when several rooms claim the same door direction, fan sideways before abandoning the compass —
  // a room that is genuinely south should stay south, just offset.
  const candidatesFor = (x, y, dir) =>
  {
    if (dir === null)
    {
      return [ [ 1, 1 ], [ -1, 1 ], [ 1, -1 ], [ -1, -1 ], [ 2, 0 ], [ 0, 2 ] ]
        .map(([ dx, dy ]) => [ x + dx, y + dy ]);
    }
    const [ dx, dy ] = DELTA[dir];
    const [ px, py ] = [ dy, dx ];
    const offsets = [];
    for (let reach = 1; reach <= 3; reach++)
    {
      offsets.push([ dx * reach, dy * reach ]);
      offsets.push([ dx * reach + px, dy * reach + py ]);
      offsets.push([ dx * reach - px, dy * reach - py ]);
      offsets.push([ dx * reach + px * 2, dy * reach + py * 2 ]);
      offsets.push([ dx * reach - px * 2, dy * reach - py * 2 ]);
    }
    return offsets.map(([ ox, oy ]) => [ x + ox, y + oy ]);
  };

  const queue = [ startId ];
  while (queue.length > 0)
  {
    const current = queue.shift();
    const { x, y } = placed.get(current);
    // rooms with a known compass reading claim their cell before the ambiguous ones do.
    const outgoing = neighbours.get(current)
      .filter(link => allowed.has(link.to) && placed.has(link.to) === false)
      .sort((left, right) => (left.dir === null ? 1 : 0) - (right.dir === null ? 1 : 0));

    outgoing.forEach(link =>
    {
      if (placed.has(link.to)) return;
      const spot = candidatesFor(x, y, link.dir).find(([ cx, cy ]) => taken.has(`${cx},${cy}`) === false);
      const [ fx, fy ] = spot ?? [ x, y ];
      taken.add(`${fx},${fy}`);
      placed.set(link.to, { x: fx, y: fy });
      queue.push(link.to);
    });
  }
  return placed;
};

/**
 * Draws placed rooms as boxes with their doors as lines. Links between rooms that ended up far apart
 * are listed underneath instead of drawn, because a line across half the canvas teaches nothing.
 * @param {Map<number, object>} placed The grid positions from layoutFloor.
 * @param {object[]} links Every link in the dungeon.
 * @param {Map<number, string>} marks Room ids to a box style key.
 * @returns {string}
 */
const renderFloor = (placed, links, marks) =>
{
  const xs = [ ...placed.values() ].map(spot => spot.x);
  const ys = [ ...placed.values() ].map(spot => spot.y);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  const width = (Math.max(...xs) - minX + 1) * CELL_W + 2;
  const height = (Math.max(...ys) - minY + 1) * CELL_H + 2;

  const canvas = Array.from({ length: height }, () => new Array(width).fill(' '));
  const write = (x, y, char) =>
  {
    if (y < 0 || y >= height || x < 0 || x >= width) return;
    canvas[y][x] = char;
  };
  const originOf = id =>
  {
    const { x, y } = placed.get(id);
    return { ox: (x - minX) * CELL_W + 1, oy: (y - minY) * CELL_H + 1 };
  };

  const drawn = new Set();
  const distant = [];
  const offFloor = [];
  links.forEach(link =>
  {
    const key = [ link.from, link.to ].sort((left, right) => left - right).join(' <-> ');
    if (drawn.has(key)) return;

    // a link with one foot on another floor cannot be drawn here, but hiding it entirely is how the
    // single staircase in a two-floor dungeon becomes invisible.
    const hasFrom = placed.has(link.from), hasTo = placed.has(link.to);
    if (hasFrom === false && hasTo === false) return;
    drawn.add(key);
    if (hasFrom === false || hasTo === false)
    {
      offFloor.push(key);
      return;
    }

    const from = placed.get(link.from), to = placed.get(link.to);
    if (Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y)) > 1)
    {
      distant.push(key);
      return;
    }

    // both runs travel through box centres, so a door leaves from the side it actually uses.
    const a = originOf(link.from), b = originOf(link.to);
    const ax = a.ox + 2, ay = a.oy, bx = b.ox + 2, by = b.oy;
    const stepX = ax < bx ? 1 : -1;
    for (let x = ax; x !== bx; x += stepX) write(x, ay, canvas[ay][x] === '|' ? '+' : '-');
    const stepY = ay < by ? 1 : -1;
    for (let y = ay; y !== by; y += stepY) write(bx, y, canvas[y][bx] === '-' ? '+' : '|');
  });

  const STYLES = { wall: [ '#', '#' ], anchor: [ '=', '=' ], plain: [ '+', '-' ] };
  placed.forEach((_spot, id) =>
  {
    const { ox, oy } = originOf(id);
    const [ corner, edge ] = STYLES[marks.get(id) ?? 'plain'];
    for (let i = 0; i < BOX_W; i++)
    {
      const char = i === 0 || i === BOX_W - 1 ? corner : edge;
      write(ox + i, oy - 1, char);
      write(ox + i, oy + 1, char);
    }
    write(ox, oy, corner === '+' ? '|' : corner);
    write(ox + BOX_W - 1, oy, corner === '+' ? '|' : corner);
    [ ...String(id).padStart(3, ' ') ].forEach((char, i) => write(ox + 1 + i, oy, char));
  });

  const picture = canvas
    .map(row => row.join('').replace(/\s+$/, ''))
    .filter(row => row.length > 0)
    .join('\n');

  const footnotes = [];
  if (distant.length > 0) footnotes.push(`  drawn too far apart to connect: ${distant.join('   ')}`);
  if (offFloor.length > 0) footnotes.push(`  links to another floor: ${offFloor.join('   ')}`);
  return footnotes.length === 0 ? picture : `${picture}\n\n${footnotes.join('\n')}`;
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
 * Draws the dungeon as boxes and doors, one picture per FLOOR node, marking tool-gated rooms.
 * @param {number} rootId The dungeon root.
 * @returns {void}
 */
const commandAtlas = async rootId =>
{
  const maps = await loadSubtree(rootId);
  const links = buildLinks(maps).filter(link => maps.has(link.to));

  const neighbours = new Map([ ...maps.keys() ].map(id => [ id, [] ]));
  links.forEach(link =>
  {
    neighbours.get(link.from).push(link);
    // the far side of a door is the same door read backwards.
    neighbours.get(link.to).push({ ...link, from: link.to, to: link.from, dir: link.dir ? OPPOSITE_DIR[link.dir] : null });
  });

  const marks = new Map();
  maps.forEach((map, id) =>
  {
    const gates = gatesOf(map);
    if (gates.some(gate => gate.kind === 'wall')) marks.set(id, 'wall');
    else if (gates.length > 0) marks.set(id, 'anchor');
  });

  // a dungeon with FLOOR nodes gets one picture per floor; anything else is drawn in one go.
  const floors = (childrenOf.get(rootId) ?? []).filter(child => /^FLOOR:/i.test(child.name));
  const groups = floors.length > 0
    ? floors.map(floor => ({ name: floor.name, ids: descendantsOf(floor.id).filter(id => maps.has(id)) }))
    : [ { name: infoById.get(rootId).name, ids: [ ...maps.keys() ] } ];

  console.log('legend:  +---+ open room     ##### tool wall in this room     ===== hookshot anchor in this room\n');
  groups.forEach(group =>
  {
    const members = new Set(group.ids.filter(id => neighbours.get(id).length > 0));
    if (members.size === 0) return;
    const [ start ] = [ ...members ].sort((left, right) => neighbours.get(right).length - neighbours.get(left).length);
    console.log(`=== ${group.name} (${members.size} maps) ===\n`);
    console.log(renderFloor(layoutFloor(start, members, neighbours), links, marks));
    console.log('');
  });
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
