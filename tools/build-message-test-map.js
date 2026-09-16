// Builds the message sandbox map by cloning the lighting sandbox's shell.
//
// The shell is cloned rather than hand-drawn because the tile data is what defines where the floor
// is, and it is the one part of a map nobody should be authoring by hand. Every event placement is
// checked against a reproduction of Game_Map#checkPassage before it is written - tile ids alone
// cannot be trusted here, because the ids this shell uses for the room floor also fill the starfield
// void outside the walls, so "the sibling map's events stood on this id" places events out in space.

const fs = require('node:fs');
const path = require('node:path');

const DATA = path.join(__dirname, '../chef-adventure/data');

const SHELL_MAP_ID = 382;
const NEW_MAP_ID = 383;
const MAP_NAME = 'Message Oasis';

// the engine's direction bits, as Game_Map#isPassable derives them from a numpad direction.
const DIRECTIONS = [
  { d: 2, bit: 0x01, dx: 0, dy: 1, reverse: 8 },
  { d: 4, bit: 0x02, dx: -1, dy: 0, reverse: 6 },
  { d: 6, bit: 0x04, dx: 1, dy: 0, reverse: 4 },
  { d: 8, bit: 0x08, dx: 0, dy: -1, reverse: 2 },
];

/** The direction bits by numpad direction, for the reverse lookups below. */
const BIT_BY_DIRECTION = Object.fromEntries(DIRECTIONS.map(entry => [ entry.d, entry.bit ]));

/**
 * Reads one of the game's data files.
 * @param {string} name The file name.
 * @returns {object}
 */
const readData = name => JSON.parse(fs.readFileSync(path.join(DATA, name), 'utf-8'));

/**
 * The tileset flag table for a map, which is what says whether a tile can be stood on.
 * @param {object} map The map.
 * @returns {number[]}
 */
const flagsFor = map => readData('Tilesets.json')[ map.tilesetId ].flags;

/**
 * The four layered tile ids at a square, top layer first, exactly as the engine reads them.
 * @param {object} map The map.
 * @param {number} x The column.
 * @param {number} y The row.
 * @returns {number[]}
 */
function layeredTiles(map, x, y)
{
  const tiles = [];
  for (let i = 0; i < 4; i++)
  {
    const z = 3 - i;
    tiles.push(map.data[ (z * map.height + y) * map.width + x ] || 0);
  }

  return tiles;
}

/**
 * Whether a square can be left or entered in one direction, reproducing Game_Map#checkPassage.
 * @param {object} map The map.
 * @param {number[]} flags The tileset flags.
 * @param {number} x The column.
 * @param {number} y The row.
 * @param {number} bit The direction bit being asked about.
 * @returns {boolean}
 */
function checkPassage(map, flags, x, y, bit)
{
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;

  for (const tile of layeredTiles(map, x, y))
  {
    const flag = flags[ tile ];

    // [*] star tiles have no effect on passage at all; keep looking underneath.
    if ((flag & 0x10) !== 0) continue;

    if ((flag & bit) === 0) return true;
    if ((flag & bit) === bit) return false;
  }

  return false;
}

/**
 * Every square actually reachable on foot from a starting square.
 *
 * Reachability rather than standability, because those are not the same thing and the difference is
 * exactly where this went wrong before. The wall faces on this shell carry flag `0x0e06` - blocked
 * left and right, open up and down - so asking only "can something move down through here" calls a
 * wall a floor, and events get planted in the masonry. A square counts only if a walk can actually
 * arrive at it, which is what the flood fill below answers and what a single flag test never can.
 *
 * The step rule is the engine's own, from Game_CharacterBase#canPass: leaving a square in a
 * direction and entering the next one from the opposite direction must *both* be allowed.
 * @param {object} map The map.
 * @param {number[]} flags The tileset flags.
 * @param {{x: number, y: number}} origin Where the walk begins.
 * @returns {Set<string>} The reachable squares, as `x,y` keys.
 */
function reachableFrom(map, flags, origin)
{
  const reached = new Set([ `${origin.x},${origin.y}` ]);
  const queue = [ origin ];

  while (queue.length > 0)
  {
    const { x, y } = queue.shift();

    DIRECTIONS.forEach(({ bit, dx, dy, reverse }) =>
    {
      const nextX = x + dx;
      const nextY = y + dy;
      const key = `${nextX},${nextY}`;
      if (reached.has(key) === true) return;

      if (checkPassage(map, flags, x, y, bit) === false) return;
      if (checkPassage(map, flags, nextX, nextY, BIT_BY_DIRECTION[ reverse ]) === false) return;

      reached.add(key);
      queue.push({ x: nextX, y: nextY });
    });
  }

  return reached;
}

/**
 * The stock event page conditions, all of them off.
 * @param {?string} selfSwitch The self switch this page waits on, or null for none.
 * @returns {object}
 */
const conditions = (selfSwitch = null) => ({
  actorId: 1,
  actorValid: false,
  itemId: 1,
  itemValid: false,
  selfSwitchCh: selfSwitch ?? 'A',
  selfSwitchValid: selfSwitch !== null,
  switch1Id: 1,
  switch1Valid: false,
  switch2Id: 1,
  switch2Valid: false,
  variableId: 1,
  variableValid: false,
  variableValue: 0,
});

/**
 * A stationary event page wearing the sandbox's usual signpost sprite.
 * @param {object[]} list The command list.
 * @param {number} trigger The trigger type.
 * @param {?string} selfSwitch The self switch this page waits on.
 * @returns {object}
 */
const page = (list, trigger = 0, selfSwitch = null, characterName = '$o_grass') => ({
  conditions: conditions(selfSwitch),
  directionFix: false,
  image: { tileId: 0, characterName, direction: 2, pattern: 1, characterIndex: 0 },
  list,
  moveFrequency: 3,
  moveRoute: { list: [ { code: 0, parameters: [] } ], repeat: true, skippable: false, wait: false },
  moveSpeed: 3,
  moveType: 0,
  priorityType: 1,
  stepAnime: false,
  through: true,
  trigger,
  walkAnime: true,
});

/** A comment line. */
const comment = text => ({ code: 108, indent: 0, parameters: [ text ] });

/** A continuation of the comment above it. */
const commentMore = text => ({ code: 408, indent: 0, parameters: [ text ] });

/** The end of a command list. */
const end = () => ({ code: 0, indent: 0, parameters: [] });

/**
 * The Position dropdown's "top", which a floating message reads as "sit above your speaker".
 * @type {number}
 */
const POSITION_TOP = 0;

/**
 * The Position dropdown's "bottom", which a floating message reads as "hang below your speaker".
 * @type {number}
 */
const POSITION_BOTTOM = 2;

/**
 * A Show Text command and its lines.
 * @param {string} faceName The face sheet, or empty for none.
 * @param {number} faceIndex The index within that sheet.
 * @param {string} speaker The literal contents of the Name field.
 * @param {string[]} lines The message lines.
 * @param {number} background The Background dropdown: 0 window, 1 dim, 2 transparent.
 * @param {number} position The Position dropdown: 0 top, 1 middle, 2 bottom.
 * @returns {object[]}
 */
function showText(faceName, faceIndex, speaker, lines, background, position)
{
  const commands = [
    { code: 101, indent: 0, parameters: [ faceName, faceIndex, background, position, speaker ] } ];
  lines.forEach(line => commands.push({ code: 401, indent: 0, parameters: [ line ] }));

  return commands;
}

/**
 * J-Base's gate on which event comments are even offered to a plugin as notetags.
 *
 * Copied from `J.BASE.RegExp.ParsableComment`. A comment that fails this is dropped before any
 * plugin sees it, silently and with no diagnostic - which is exactly how five escribe labels came
 * to be missing from this map's first build while the other seven worked. Worth reading the
 * character class carefully: parentheses are not in it, and neither are the three symbols this very
 * plugin uses as its effect codes.
 * @type {RegExp}
 */
const PARSABLE_COMMENT = /^<[[\]\w :"',.!+\-*/\\#]+>$/i;

/**
 * Builds one escribe label comment, refusing a label the engine would quietly discard.
 * @param {string} label What floats above the event.
 * @returns {object}
 */
function escribeLabel(label)
{
  const tag = `<text:${label}>`;

  if (PARSABLE_COMMENT.test(tag) === false)
  {
    throw new Error(`label would be dropped by ParsableComment, so the sign would be blank: [${tag}]`);
  }

  return comment(tag);
}

/**
 * One demo signpost: an escribe label, and a message it shows when spoken to.
 * @param {string} label What floats above it.
 * @param {string} faceName The face sheet for its message.
 * @param {number} faceIndex The index within that sheet.
 * @param {string} speaker The Name field for its message.
 * @param {string[]} lines The message lines.
 * @param {number} background The Background dropdown: 0 window, 1 dim, 2 transparent.
 * @returns {object[]}
 */
const signpost = (label, faceName, faceIndex, speaker, lines, background) => [
  escribeLabel(label),
  ...showText(faceName, faceIndex, speaker, lines, background, POSITION_TOP),
  end(),
];

/**
 * A plugin command call, as the editor writes one.
 * @param {string} pluginName The plugin's filename without its extension.
 * @param {string} commandName The registered command key.
 * @param {string} displayName What the editor shows in the event list.
 * @returns {object}
 */
const pluginCommand = (pluginName, commandName, displayName) => (
  { code: 357, indent: 0, parameters: [ pluginName, commandName, displayName, {} ] });

/**
 * A signpost that runs several messages in a row and then declares the scene over.
 *
 * Each beat is its own Show Text, so each gets its own bubble - which is the whole thing being
 * demonstrated: the earlier ones stay on screen, dimmed and frozen, until the command at the end
 * clears them.
 * @param {string} label What floats above it.
 * @param {object[]} beats The messages, in order.
 * @returns {object[]}
 */
const conversation = (label, beats) => [
  escribeLabel(label),
  ...beats.flatMap(beat => showText(
    beat.faceName ?? '',
    beat.faceIndex ?? 0,
    beat.speaker ?? '',
    beat.lines,
    beat.background ?? 0,
    beat.position ?? POSITION_TOP)),
  pluginCommand('J-Message-Bubbles', 'end-conversation', 'End Conversation'),
  end(),
];

// the demos, in the order they are laid out. Two rows of six on the interior floor.
const DEMOS = [
  {
    name: 'wave',
    label: 'wave - tilde code',
    lines: [ 'Whoa, that is \\~incredible\\~, would you look at it \\~roll\\~.' ],
  },
  {
    name: 'jitter',
    label: 'jitter - percent code',
    lines: [ 'D-did you \\%hear\\% that? I think something is \\%out there\\%.' ],
  },
  {
    name: 'rainbow',
    label: 'rainbow - equals code',
    lines: [ 'Behold the \\=legendary treasure\\= of the oasis!' ],
  },
  {
    name: 'stacked',
    label: 'stacking',
    lines: [
      'Plain, \\C[2]coloured\\C[0], \\*bold\\*, \\_italic\\_.',
      'And \\*\\~bold waving\\~\\* plus \\C[3]\\%coloured trembling\\%\\C[0].',
    ],
  },
  {
    name: 'jerald',
    label: 'jerald voice',
    speaker: '\\N[1]',
    faceName: 'face_je',
    faceIndex: 0,
    lines: [
      'Right, so here is the thing. I talk fast, I talk a lot,',
      'and I do not much care who is listening. Keep up!',
    ],
  },
  {
    name: 'rupert',
    label: 'rupert voice',
    speaker: '\\N[2]',
    faceName: 'face_rp',
    faceIndex: 0,
    lines: [
      'Hold on. Let me think about that for a moment.',
      'There is no need to rush this... none at all.',
    ],
  },
  {
    name: 'unprofiled',
    label: 'no profile - default voice',
    speaker: 'Wandering Stranger',
    lines: [ 'Nobody has written me a voice yet, so I read exactly as the engine always did.' ],
  },
  {
    name: 'narration',
    label: 'narration - no speaker',
    lines: [ 'The oasis is quiet. Nothing here has a mouth, and nothing here makes a sound.' ],
  },
  {
    name: 'punctuation',
    label: 'pacing + punctuation',
    speaker: '\\N[2]',
    faceName: 'face_rp',
    faceIndex: 0,
    lines: [
      'Wait. Stop, and listen... do you hear it?',
      'No? Then perhaps; perhaps, it was nothing at all!',
    ],
  },
  {
    name: 'icons',
    label: 'icons + db codes',
    lines: [
      'Here: \\I[87] a star, and \\weapon[1] and \\item[1] from the database.',
      'An icon inside a \\~\\I[87] waving span\\~ should ride along with it.',
    ],
  },
  {
    name: 'pages',
    label: 'two pages + open span',
    // a page break is not a second Show Text - it is one message with more lines than the window is
    // tall. `needsNewPage` fires when the next line would run past the contents height, so eight
    // lines through a four-line window is what actually produces one, and three lines never could.
    lines: [
      'Page one, line one. This opens a wave \\~and never closes it.',
      'Page one, line two. The wave should still be going here.',
      'Page one, line three. Still waving, because nothing closed it.',
      'Page one, line four. This is the last line that fits.',
      'Page two, line one. NOTHING here should be waving any more.',
      'Page two, line two. The open span died with the page break.',
      'Page two, line three. A speaker whose profile waved still would.',
      'Page two, line four. End of the message.',
    ],
  },
  {
    name: 'pulse',
    label: 'pulse - plus code',
    lines: [
      'And this is what it looks like when a word \\+swells and settles\\+ again.',
      'It reads as breathing, where the wave reads as motion.',
    ],
  },
  {
    name: 'bubbleSelf',
    label: 'bubble - over this sign',
    speaker: 'The Signpost',
    lines: [
      '\\pop[self]I am speaking for myself, from here.',
      'My name is set into my own border.',
    ],
  },
  {
    name: 'bubbleTalk',
    label: 'bubble - a conversation',
    // four messages rather than one, so four bubbles exist in turn and the first three are still on
    // screen - dimmed and frozen - while the fourth is being read. The command at the end is what
    // clears them; without it they would wait for the map to change.
    // the sign takes the top of each exchange and the player takes the bottom, which is what keeps
    // two characters standing a tile apart from stacking their dialogue in the same place. That is
    // the Show Text Position dropdown doing it, not anything new.
    beats: [
      {
        speaker: 'The Signpost',
        position: POSITION_TOP,
        lines: [ '\\pop[self]Do you ever wonder what is over the wall?' ],
      },
      {
        position: POSITION_BOTTOM,
        lines: [
          '\\pop[player]Nobody is named on this one, so its border runs',
          'unbroken all the way around.',
        ],
      },
      {
        speaker: 'The Signpost',
        position: POSITION_TOP,
        background: 1,
        lines: [ '\\pop[self]He is not going to answer, is he.' ],
      },
      {
        speaker: '\\N[1]',
        position: POSITION_BOTTOM,
        // the same target as the beat above rather than the equivalent `a1`, so this replaces the
        // player's own earlier bubble instead of standing a second one on top of it. Two aliases
        // for one character are two speakers as far as a conversation is concerned.
        lines: [ '\\pop[player]I am absolutely going to answer. Eventually.' ],
      },
    ],
  },
  {
    name: 'bubbleActor',
    label: 'bubble - actor a1',
    speaker: '\\N[1]',
    lines: [
      // a1 is whoever is leading, and the leader walks as the player sprite rather than as a
      // follower - so this and the one above should land in the same place.
      '\\pop[a1]Actor one is Jerald, and Jerald is leading, so this is me.',
    ],
  },
  {
    name: 'bubblePoint',
    label: 'bubble - dim, fixed point',
    speaker: 'A Voice From Nowhere',
    // background 1 is the editor's Dim, which on a bubble means greyed and half see-through rather
    // than the gradient plate it draws behind an ordinary window. Doubled up with the fixed-point
    // target because the room only holds sixteen signs and this form has no real uses to protect.
    background: 1,
    lines: [
      '\\pop[300,240]This one is nailed to a spot on the screen, and it is',
      'dimmed, which is what an inner thought should look like.',
    ],
  },
];

/**
 * The autorun setup event, carried over from the other sandboxes verbatim.
 * @param {number} id The event id.
 * @param {number} x The column.
 * @param {number} y The row.
 * @returns {object}
 */
const initEvent = (id, x, y) => ({
  id,
  name: 'init',
  note: '',
  x,
  y,
  pages: [
    page([
      comment('//'),
      commentMore('// basic init cleanup.'),
      commentMore('// enable party style fighting, allyAI, SDP.'),
      commentMore('//'),
      commentMore('//'),
      { code: 123, indent: 0, parameters: [ 'A', 0 ] },
      { code: 216, indent: 0, parameters: [ 0 ] },
      { code: 121, indent: 0, parameters: [ 101, 101, 0 ] },
      { code: 121, indent: 0, parameters: [ 104, 104, 0 ] },
      { code: 121, indent: 0, parameters: [ 108, 108, 0 ] },
      { code: 314, indent: 0, parameters: [ 0, 0 ] },
      end(),
    // no sprite at all: this one is machinery rather than scenery. `String.empty` is a J-Base
    // polyfill and does not exist out here in a plain script, where it would arrive as undefined
    // and quietly fall back to the default sprite.
    ], 3, null, ''),
    page([ end() ], 0, 'A', ''),
  ],
});

// ---------------------------------------------------------------------------

const shell = readData(`Map${SHELL_MAP_ID}.json`);
const flags = flagsFor(shell);

const map = {
  ...shell,
  displayName: MAP_NAME,
  // no ambient darkness: the whole point of this room is reading text in it.
  note: '',
  events: [ null ],
};

// the player stands in the middle of the room; everything else is measured from where they land.
const START = { x: 16, y: 10 };
const reachable = reachableFrom(map, flags, START);

const reachedX = [ ...reachable ].map(key => Number(key.split(',')[ 0 ]));
const reachedY = [ ...reachable ].map(key => Number(key.split(',')[ 1 ]));
const bounds = {
  minX: Math.min(...reachedX),
  maxX: Math.max(...reachedX),
  minY: Math.min(...reachedY),
  maxY: Math.max(...reachedY),
};

/**
 * Claims a square for an event, refusing anything a walk cannot reach or that is already taken.
 * @param {number} x The column.
 * @param {number} y The row.
 * @returns {{x: number, y: number}}
 */
const claimed = new Set();
function claim(x, y)
{
  const key = `${x},${y}`;
  if (reachable.has(key) === false)
  {
    throw new Error(`refusing to place an event where a walk cannot reach it: [${key}]`);
  }
  if (claimed.has(key) === true)
  {
    throw new Error(`refusing to place two events on the same square: [${key}]`);
  }
  claimed.add(key);

  return { x, y };
}

// the player's own square is claimed first so nothing can be placed on top of them.
claim(START.x, START.y);

/**
 * Spreads a number of positions evenly across a span, inset from both ends.
 * @param {number} min The lowest usable coordinate.
 * @param {number} max The highest usable coordinate.
 * @param {number} count How many positions are wanted.
 * @returns {number[]}
 */
function spread(min, max, count)
{
  const inset = 1;
  const first = min + inset;
  const last = max - inset;
  const step = (last - first) / (count - 1);

  return Array.from({ length: count }, (_, index) => Math.round(first + (step * index)));
}

// four rows of four, spread across whatever the room actually turned out to be rather than across
// numbers written down by hand. Four columns rather than six because each signpost carries a
// floating label wider than the tuft under it, and six across this room puts "no profile - default
// voice" straight through its neighbour. The rows are two apart rather than three because a fourth
// row of demos has to fit in the same room, and two tiles still clears a one-line label.
const COLUMNS = spread(bounds.minX, bounds.maxX, 4);
const ROWS = [ bounds.minY + 1, bounds.minY + 3, bounds.minY + 5, bounds.maxY - 1 ];

DEMOS.forEach((demo, index) =>
{
  const x = COLUMNS[ index % COLUMNS.length ];
  const y = ROWS[ Math.floor(index / COLUMNS.length) ];
  const spot = claim(x, y);

  map.events.push({
    id: map.events.length,
    name: demo.name,
    note: '',
    x: spot.x,
    y: spot.y,
    pages: [ page(demo.beats === undefined
      ? signpost(
        demo.label,
        demo.faceName ?? '',
        demo.faceIndex ?? 0,
        demo.speaker ?? '',
        demo.lines,
        demo.background ?? 0)
      : conversation(demo.label, demo.beats)) ],
  });
});

// the init event is the one deliberate exception to everything above. It has no sprite, it is an
// autorun that switches itself off on the first frame, and nothing ever walks up to it - so it
// neither needs to be reachable nor wants to occupy a square of floor that a demo could use. It is
// parked up in the unreachable corridor, which is where the sibling sandboxes keep theirs.
const initSpot = { x: 26, y: 2 };
map.events.push(initEvent(map.events.length, initSpot.x, initSpot.y));

const start = START;

// RMMZ writes a map as one line per top-level key and one line per event, with no trailing newline.
// Matching it keeps the editor's own rewrite of this file to a small diff.
const { data, events, ...header } = map;
const headerLine = Object.entries(header)
  .map(([ key, value ]) => `${JSON.stringify(key)}:${JSON.stringify(value)}`)
  .join(',');
const eventLines = events
  .map(event => (event === null ? 'null' : JSON.stringify(event)))
  .join(',\n');

const serialized = `{\n${headerLine},\n"data":${JSON.stringify(data)},\n"events":[\n${eventLines}\n]\n}`;

fs.writeFileSync(path.join(DATA, `Map${NEW_MAP_ID}.json`), serialized);

console.log(`wrote Map${NEW_MAP_ID}.json - ${DEMOS.length} demo events, init, ${map.width}x${map.height}`);
console.log(`reachable floor from ${start.x},${start.y}: x ${bounds.minX}..${bounds.maxX}, y ${bounds.minY}..${bounds.maxY} (${reachable.size} squares)`);
console.log(`columns: ${COLUMNS.join(', ')}  rows: ${ROWS.join(', ')}`);
console.log('every event square proved reachable on foot, not merely standable');
