//region boss-halls
/**
 * The Boss Halls: a test copy of every converted boss's arena, so a fight can be started, lost, won and
 * started again without the story scene in front of it. The halls hang under a lobby beside the Enemy
 * Oases, and the lobby holds one door per hall, with the boss itself standing in for the door.
 *
 * A hall is its arena tile for tile: the same size, tileset, parallax, music and notes, with the story's
 * events taken out and the test kit put in. The fight itself is never copied. A hall starts the very
 * encounter its arena starts, out of the `bosses` block of `config.jabs.json`, and the arena it copies is
 * the one that encounter names, so whatever the fight becomes, the hall fights the same one, with nothing
 * to keep in step.
 *
 * A fight won in a hall turns no switch on, since J-ABS-Boss only tells the story about a fight won on the
 * map its encounter names. The hall hears about it from `JabsBossManager.isBossDefeated()` instead, and puts
 * itself back for the next attempt: the boss frame away, the menu back, the party healed and the room's own
 * music playing again.
 *
 * The kit stands at the same event ids in every hall, so anything driving a hall from outside, like a
 * playtest probe, finds the start of the fight at event 4 whichever boss it is.
 *
 * Usage: bun tools/mapgen/dungeons/boss-halls.js
 *        bun tools/mapgen/validate.js --staged 542 543
 *        bun tools/mapgen/snapshot.js 543 --staged --out hall.png
 *        bun tools/mapgen/install.js
 */
import { DATA, mapFile } from '../paths.js';
import { serialise, transferEvent, OUT } from '../terrain.js';
import { CELL, renderCave } from '../cave.js';
import { OASIS, copyEvent, comment, fill, newBlock, paveFloors, lightPortal, oasisMap, exitEvent } from '../oasis.js';

/**
 * The map tree node the lobby hangs under: Map1, the Test Oasis, beside the Enemy Oases.
 * @type {number}
 */
const TEST_OASIS = 1;

/**
 * The lobby's map id and tree name. `TESTING:` rather than `REGION:` because `tools/burndown.js` counts
 * everything under a `REGION:` map as the real world.
 * @type {{id: number, tree: string}}
 */
const LOBBY = { id: 542, tree: 'TESTING: Boss Halls' };

/**
 * Every boss with a hall, in the order their doors stand in the lobby. Each hall names its own map id, so
 * adding a hall never moves one that already exists.
 *
 * `encounter` names the fight in `config.jabs.json`, and the arena the hall copies is the map that encounter
 * names. `arrival` is where the hall sets the player down: the arena's own landing square, turned to face
 * into the room, so that holding the key they walked in with never carries them straight back out through
 * the exit. `exitEventId` is the arena's way out, which the hall keeps where it stands and points at the
 * lobby instead. An arena with no way out of its own, like the pit Aqualock waits at the bottom of, or with
 * one the fight's floor cannot walk back to, like the one-way stairs below Lucian's throne, names
 * `exitEventId: 0` and an `exit` square, and its hall gets a plain labelled exit there. `kit` places the test
 * kit off the fight's floor and out of the walk from the arrival to it. `seals` names the arena's events that
 * shut a way out while the fight is on, each by its id and the page that shuts it, so the hall stands in the room
 * the fight is actually fought in.
 * @type {Object[]}
 */
const HALLS = [
  {
    id: 543,
    name: 'Gluttonwolf',
    encounter: 'gluttonwolf',
    arrival: { x: 26, y: 9, dir: 2 },
    exitEventId: 1,
    kit: { init: [ 28, 15 ], levels: [ 28, 10 ], fight: [ 28, 12 ], watch: [ 24, 15 ] },
  },
  {
    id: 544,
    name: 'Earthie',
    encounter: 'earthie',
    arrival: { x: 15, y: 15, dir: 8 },
    exitEventId: 2,
    kit: { init: [ 14, 16 ], levels: [ 14, 15 ], fight: [ 16, 15 ], watch: [ 16, 16 ] },
  },
  {
    id: 545,
    name: 'Aqualock',
    encounter: 'aqualock-1',
    arrival: { x: 11, y: 41, dir: 8 },
    exitEventId: 0,
    exit: [ 8, 42 ],
    kit: { init: [ 13, 42 ], levels: [ 14, 42 ], fight: [ 15, 42 ], watch: [ 16, 42 ] },
  },
  {
    id: 546,
    name: 'Cynder',
    encounter: 'cynder',
    arrival: { x: 31, y: 9, dir: 2 },
    exitEventId: 19,
    kit: { init: [ 27, 9 ], levels: [ 28, 9 ], fight: [ 34, 9 ], watch: [ 35, 9 ] },
    seals: [ { eventId: 22, page: 1 } ],
  },
  {
    id: 547,
    name: 'Wrath',
    encounter: 'wrath',
    arrival: { x: 22, y: 19, dir: 8 },
    exitEventId: 0,
    exit: [ 22, 34 ],
    kit: { init: [ 18, 19 ], levels: [ 19, 19 ], fight: [ 25, 19 ], watch: [ 26, 19 ] },
  },
  {
    id: 548,
    name: 'Garuda',
    encounter: 'garuda',
    arrival: { x: 24, y: 47, dir: 8 },
    exitEventId: 1,
    kit: { init: [ 21, 46 ], levels: [ 22, 46 ], fight: [ 27, 46 ], watch: [ 28, 46 ] },
  },
  {
    id: 549,
    name: 'Skye',
    encounter: 'skye',
    arrival: { x: 24, y: 47, dir: 8 },
    exitEventId: 1,
    kit: { init: [ 21, 46 ], levels: [ 22, 46 ], fight: [ 27, 46 ], watch: [ 28, 46 ] },
  },
  {
    id: 550,
    name: 'Gloria',
    encounter: 'gloria',
    arrival: { x: 40, y: 34, dir: 8 },
    exitEventId: 1,
    kit: { init: [ 39, 31 ], levels: [ 40, 31 ], fight: [ 41, 31 ], watch: [ 42, 31 ] },
  },
  {
    id: 551,
    name: 'Sloth',
    encounter: 'sloth',
    arrival: { x: 57, y: 22, dir: 4 },
    exitEventId: 1,
    kit: { init: [ 52, 24 ], levels: [ 53, 24 ], fight: [ 54, 24 ], watch: [ 55, 24 ] },
  },
  {
    id: 552,
    name: 'Lust',
    encounter: 'lust',
    arrival: { x: 39, y: 43, dir: 8 },
    exitEventId: 1,
    kit: { init: [ 34, 42 ], levels: [ 35, 42 ], fight: [ 36, 42 ], watch: [ 37, 42 ] },
  },
];

/**
 * The lobby's map size and fixed lines. Doors stand in rows of five, with free floor on every side of each,
 * so a door can be walked into from whichever side its hall wants.
 * @type {Object<string, number>}
 */
const HUB = {
  width: 40,
  height: 24,
  blockLeft: 4,
  blockRight: 35,
  blockBottom: 22,
  floorLeft: 5,
  floorRight: 34,
  floorTop: 4,
  floorBottom: 19,
  firstRow: 6,
  rowPitch: 4,
  firstColumn: 9,
  columnPitch: 5,
  perRow: 5,
  exitX: 19,
  exitY: 20,
};

/**
 * The common events a boss fight leans on: the boss music, which saves whatever was playing before it
 * changes the track, and the cleanup that takes the boss frame away and gives the menu back.
 * @type {{bossMusic: number, cleanup: number}}
 */
const COMMON = { bossMusic: 16, cleanup: 104 };

/**
 * One step in each of the four directions, as [dx, dy], keyed by the direction's number.
 * @type {Object<number, number[]>}
 */
const STEP = { 2: [ 0, 1 ], 4: [ -1, 0 ], 6: [ 1, 0 ], 8: [ 0, -1 ] };

/**
 * Each direction's opposite.
 * @type {Object<number, number>}
 */
const REVERSE = { 2: 8, 4: 6, 6: 4, 8: 2 };

/**
 * True while any body of the running fight still stands on this map. Starting a second fight over one still
 * standing would put a second boss beside the first, so the start of the fight asks this first. A fight left
 * running by a game over, or by any way out of the hall but its exit, reads as over here, because its bodies
 * went with the map they stood on.
 * @type {string}
 */
const STANDING = [
  'JabsBossManager.hasActiveEncounter() && ',
  'JabsBossManager.activeEncounter().participants()',
  '.some(participant => JabsBossManager.getParticipantJabsBattler(participant) !== null)',
].join('');

/**
 * True once the running fight has been won: every body down, and every death scene played out.
 * @type {string}
 */
const WON = 'JabsBossManager.hasActiveEncounter() && JabsBossManager.isBossDefeated()';

/**
 * Reads a database file.
 * @param {string} name The file's name in `data/`.
 * @returns {Promise<Object>}
 */
const readData = async name => JSON.parse(await Bun.file(`${DATA}/${name}`).text());

const bosses = (await readData('config.jabs.json')).bosses;
const palette = await readData('Map361.json');
const respawnOasis = await readData('Map359.json');
const levelOasis = await readData('Map305.json');

/**
 * Finds the encounter a hall stages.
 * @param {Object} hall The hall's spec.
 * @returns {Object} The encounter, as `config.jabs.json` writes it.
 */
const encounterOf = hall =>
{
  const encounter = bosses.find(boss => boss.key === hall.encounter);
  if (!encounter) throw new Error(`${hall.name}: config.jabs.json has no encounter [ ${hall.encounter} ]`);

  // a piece of the kit on a spawn square would have the boss arrive standing inside it.
  const spawns = encounter.participants.map(participant => `${participant.x},${participant.y}`);
  Object.entries(hall.kit).forEach(([ piece, [ x, y ] ]) =>
  {
    if (spawns.includes(`${x},${y}`))
    {
      throw new Error(`${hall.name}: the kit's ${piece} stands where a boss spawns`);
    }
  });

  return encounter;
};

const encounters = HALLS.map(encounterOf);
const arenas = await Promise.all(encounters.map(encounter => readData(mapFile(encounter.map))));

/**
 * One command of an event list.
 * @param {number} code The command's code.
 * @param {number} indent How deep in the list's branches it sits.
 * @param {Array} parameters Its parameters.
 * @returns {{code: number, indent: number, parameters: Array}}
 */
const command = (code, indent, parameters) => ({ code, indent, parameters });

/**
 * A J-ABS-Boss plugin command, written the way the editor writes one: the call, then a line per argument
 * that the editor shows beneath it.
 * @param {number} indent How deep in the list's branches it sits.
 * @param {string} name The command's name.
 * @param {string} label The command's display name.
 * @param {Object<string, string>} args Its arguments.
 * @returns {Object[]}
 */
const bossCommand = (indent, name, label, args) => [
  command(357, indent, [ 'j/abs/ext/J-ABS-Boss', name, label, args ]),
  ...Object.entries(args).map(([ key, value ]) => command(657, indent, [ `${key} = ${value}` ])),
];

/**
 * Where a hall's door stands in the lobby: its place in the rows of five.
 * @param {number} index The hall's place in {@link HALLS}.
 * @returns {number[]} The door's [x, y].
 */
const doorOf = index => [
  HUB.firstColumn + (index % HUB.perRow) * HUB.columnPitch,
  HUB.firstRow + Math.floor(index / HUB.perRow) * HUB.rowPitch,
];

/**
 * The square a player stands on to walk into a door the way its hall wants it walked into: one step back
 * from the door. Walking out of the hall sets them down here again, still heading the way they walked out,
 * which leads away from the door.
 * @param {number[]} door The door's [x, y].
 * @param {number} dir The way the player walks into it, which is also the way they face in the hall.
 * @returns {number[]} The square's [x, y].
 */
const approachOf = ([ x, y ], dir) =>
{
  const [ dx, dy ] = STEP[dir];
  return [ x - dx, y - dy ];
};

/**
 * What starting the fight does: it refuses while a boss still stands, and otherwise heals the party and
 * opens the fight the way its arena does, with the boss music, the encounter, the boss frame and the menu
 * put away.
 * @param {Object} hall The hall's spec.
 * @returns {Object[]}
 */
const fightList = hall => [
  comment(`<text:FIGHT ${hall.name}>`),
  comment('one fight at a time: starting another over a boss still standing would put a second one beside it.'),
  command(111, 0, [ 12, STANDING ]),
  command(101, 1, [ '', 0, 0, 2, '' ]),
  command(401, 1, [ `${hall.name} is still standing. Win, or walk out to call it off.` ]),
  command(0, 1, []),
  command(411, 0, []),
  command(314, 1, [ 0, 0 ]),
  command(117, 1, [ COMMON.bossMusic ]),
  ...bossCommand(1, 'start-encounter', 'Start Boss Encounter', { encounterKey: hall.encounter }),
  command(355, 1, [ 'BossFrameManager.setBossFromEncounter();' ]),
  command(655, 1, [ 'BossFrameManager.requestShowBossFrame();' ]),
  command(135, 1, [ 0 ]),
  command(0, 1, []),
  command(412, 0, []),
  command(0, 0, []),
];

/**
 * What the hall does once a fight is won: it ends the encounter, takes the boss frame away, gives the menu
 * back, heals the party and plays the room's own music again, which the boss music saved and the boss's
 * death scene faded out. Nothing in it waits, so it all lands in one frame and a fight started right after
 * can never be the one it ends.
 * @param {{name: string, volume: number, pitch: number, pan: number}} bgm The room's own music.
 * @returns {Object[]}
 */
const watchList = bgm => [
  comment('a fight won here turns no switch on, so the hall hears it from the boss manager and resets itself.'),
  command(111, 0, [ 12, WON ]),
  ...bossCommand(1, 'end-encounter', 'End Boss Encounter', {}),
  command(117, 1, [ COMMON.cleanup ]),
  command(314, 1, [ 0, 0 ]),
  command(241, 1, [ { name: bgm.name, volume: bgm.volume, pitch: bgm.pitch, pan: bgm.pan } ]),
  command(0, 1, []),
  command(412, 0, []),
  command(0, 0, []),
];

/**
 * The hall's way out: the arena's own exit, on the square it stood on, pointed at the lobby instead. It calls
 * off whatever fight is on before it goes, so the lobby never carries a boss frame or a locked menu, and
 * coming back finds the hall ready to start again. An arena with no exit of its own gets a plain one on the
 * hall's `exit` square, labelled, since there is no door there to see.
 * @param {Object} arena The arena's map.
 * @param {Object} hall The hall's spec.
 * @param {{map: number, x: number, y: number, dir: number}} to Where it leads.
 * @returns {Object}
 */
const hallExitEvent = (arena, hall, to) =>
{
  const hasOwnExit = hall.exitEventId !== 0;
  const source = hasOwnExit ? arena.events[hall.exitEventId] : transferEvent(2, 'exit', ...hall.exit, to);
  const event = copyEvent(source, 2, source.x, source.y);
  event.name = 'exit';

  // only the first page is the door itself; any later page would be the story changing it.
  const [ page ] = event.pages;
  event.pages = [ page ];

  // only a plain transfer can be re-aimed safely. One with branches in it is a door with a story attached,
  // and that hall's exit gets written by hand.
  const transfers = page.list.filter(entry => entry.code === 201);
  const plain = page.list.every(entry => entry.indent === 0);
  if (!plain || transfers.length !== 1) throw new Error(`${hall.name}: the arena's exit is not a plain transfer`);

  // the door keeps what it already did on the way out, such as its sound and its fade.
  const [ transfer ] = transfers;
  const kept = page.list.filter(entry => entry.code !== 201 && entry.code !== 0);
  page.list = [
    comment('walking out calls off whatever fight is on, so the lobby never carries one.'),
    ...bossCommand(0, 'end-encounter', 'End Boss Encounter', {}),
    command(117, 0, [ COMMON.cleanup ]),
    ...kept,
    command(201, 0, [ 0, to.map, to.x, to.y, to.dir, transfer.parameters[5] ]),
    command(0, 0, []),
  ];

  // a doorway nobody built shows nothing, so it says what it is.
  if (hasOwnExit === false) page.list.unshift(comment('<text:EXIT>'));
  return event;
};

/**
 * The arena's seals, standing for the whole life of the hall: each one a copy of the arena event that shuts a
 * way out while the fight is on, kept on the page that shuts it and standing without the switch the story turns
 * on for it. A hall without them is a bigger room than the fight is ever fought in, and a body shoved into a
 * doorway the arena keeps shut can wedge there with nothing about the hall saying why.
 * @param {Object} arena The arena's map.
 * @param {Object} hall The hall's spec.
 * @param {number} firstId The id the first seal takes; the rest follow it.
 * @returns {Object[]}
 */
const sealEvents = (arena, hall, firstId) => (hall.seals ?? []).map((seal, index) =>
{
  const source = arena.events[seal.eventId];
  const event = copyEvent(source, firstId + index, source.x, source.y);
  event.name = `seal: ${source.name}`;

  // only the sealing page, and nothing it waits on: in the hall the fight is always about to be on.
  const page = structuredClone(source.pages[seal.page]);
  page.conditions = { ...page.conditions, switch1Valid: false, switch2Valid: false, variableValid: false, selfSwitchValid: false };
  event.pages = [ page ];
  return event;
});

/**
 * The start of the fight: the respawn oasis's stake, so it reads as a thing to press, carrying the fight
 * instead of a respawn.
 * @param {Object} hall The hall's spec.
 * @param {number} x The column.
 * @param {number} y The row.
 * @returns {Object}
 */
const fightEvent = (hall, x, y) =>
{
  const event = copyEvent(respawnOasis.events[13], 4, x, y);
  event.name = `fight: ${hall.name}`;
  event.pages[0].list = fightList(hall);
  return event;
};

/**
 * The watcher: an invisible parallel event that resets the hall once a fight is won. A parallel event runs
 * on its own interpreter, so it never counts as a scene holding the fight still.
 * @param {Object} bgm The room's own music.
 * @param {number} x The column.
 * @param {number} y The row.
 * @returns {Object}
 */
const watchEvent = (bgm, x, y) =>
{
  const event = transferEvent(5, 'watch: the fight', x, y, { map: 1, x: 0, y: 0, dir: 0 });
  const [ page ] = event.pages;
  page.list = watchList(bgm);
  page.trigger = 4;
  return event;
};

/**
 * Builds one boss's hall: its arena, tile for tile, with the test kit in place of the story.
 * @param {Object} hall The hall's spec.
 * @param {number} index The hall's place in {@link HALLS}.
 * @returns {Object}
 */
const buildHall = (hall, index) =>
{
  const arena = arenas[index];
  const { init, levels, fight, watch } = hall.kit;

  // walking out lands on the square the hall's door is walked into from, still heading the way the player
  // walked out, which is the way out of the hall turned around.
  const [ backX, backY ] = approachOf(doorOf(index), hall.arrival.dir);
  const back = { map: LOBBY.id, x: backX, y: backY, dir: REVERSE[hall.arrival.dir] };

  // the kit first and always at these ids, so every hall reads the same from outside; the arena's seals after it.
  const events = [
    null,
    copyEvent(respawnOasis.events[9], 1, ...init),
    hallExitEvent(arena, hall, back),
    copyEvent(levelOasis.events[1], 3, ...levels),
    fightEvent(hall, ...fight),
    watchEvent(arena.bgm, ...watch),
    ...sealEvents(arena, hall, 6),
  ];

  return {
    ...structuredClone(arena),
    id: hall.id,
    displayName: `Boss Hall: ${hall.name}`,
    events,
    tree: `${hall.name} Hall`,
  };
};

/**
 * A lobby door: the boss standing still, labelled, and bumping it walks you into its hall.
 * @param {number} id The event id.
 * @param {Object} hall The hall's spec.
 * @param {number} index The hall's place in {@link HALLS}.
 * @returns {Object}
 */
const doorEvent = (id, hall, index) =>
{
  const [ x, y ] = doorOf(index);
  const to = { map: hall.id, ...hall.arrival };
  const event = transferEvent(id, `door: ${hall.name}`, x, y, to);
  const [ page ] = event.pages;

  // the door wears whoever the frame names: the encounter's first participant.
  const [ primary ] = encounters[index].participants;
  page.image = structuredClone(palette.events[primary.enemyId].pages[0].image);
  page.list.unshift(comment(`<text:${hall.name}>`));
  page.priorityType = 1;
  page.directionFix = true;
  page.walkAnime = false;
  return event;
};

/**
 * Builds the lobby: a door per hall, and the way back to the Test Oasis.
 * @returns {Object}
 */
const buildLobby = () =>
{
  const carved = newBlock(HUB);
  fill(carved, [ HUB.floorLeft, HUB.floorTop ], [ HUB.floorRight, HUB.floorBottom ], CELL.floor);
  fill(carved, [ HUB.exitX, HUB.exitY ], [ HUB.exitX + 1, HUB.exitY ], CELL.floor);

  const data = renderCave(carved, HUB.width, HUB.height, OASIS);
  paveFloors(data, carved, HUB.width);
  lightPortal(data, HUB.exitX, HUB.exitY, HUB.width, HUB.height);

  const events = [
    null,
    copyEvent(respawnOasis.events[9], 1, HUB.floorLeft, HUB.floorBottom),
    exitEvent(2, HUB.exitX, HUB.exitY, { map: TEST_OASIS, x: 26, y: 26, dir: 2 }),
  ];

  HALLS.forEach((hall, index) =>
  {
    events.push(doorEvent(events.length, hall, index));
  });

  return { id: LOBBY.id, ...oasisMap({ tree: LOBBY.tree, display: 'Boss Halls' }, HUB, data, events) };
};

const built = [ buildLobby(), ...HALLS.map(buildHall) ];

await Bun.$`mkdir -p ${OUT}`.quiet();
for (const map of built)
{
  await Bun.write(`${OUT}/Map${map.id}.json`, serialise(map));
}

// the manifest is what `install.js` reads: the lobby under the Test Oasis, and every hall under the lobby.
const manifest = built.map(map => ({
  id: map.id,
  tree: map.tree,
  parentId: map.id === LOBBY.id ? TEST_OASIS : LOBBY.id,
  order: map.id,
  w: map.width,
  h: map.height,
  events: map.events.filter(Boolean).length,
}));
await Bun.write(`${OUT}/_built.json`, JSON.stringify(manifest));

console.log(`wrote ${built.length} maps to staging`);
built.forEach(map =>
{
  console.log(`  Map${map.id} ${map.tree.padEnd(24)} ${map.width}x${map.height}  events=${map.events.length - 1}`);
});
//endregion boss-halls
