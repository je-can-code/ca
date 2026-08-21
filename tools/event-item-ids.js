/**
 * event-item-ids — repoint map events and common events at items that moved.
 *
 * Companion to `item-ids.js`, which only ever touches `config.crafting.json`. Events reference items
 * too - shops stock them, chests grant them, branches ask whether you are carrying one - and those
 * references are the ones that fail quietly, because a shop selling the wrong thing still opens.
 *
 * **Only the lines that actually change are rewritten.** RMMZ writes one event per line with the map's
 * enormous tile `data` array on a line of its own, so re-serialising a whole file would produce a diff
 * nobody could read and would risk reformatting data this tool never looked at. Every untouched line is
 * left byte-for-byte alone.
 *
 * Usage:
 *   bun tools/event-item-ids.js plan [ref]
 *   bun tools/event-item-ids.js apply [ref]
 *
 * `ref` defaults to HEAD.
 */

const ROOT = `${import.meta.dir}/..`;
const DATA_DIR = `${ROOT}/chef-adventure/data`;

//region moves

/**
 * Works out which item ids moved, by matching names either side of a git ref.
 * @param {string} ref The git ref to compare against.
 * @returns {Promise<Map<number, number>>} Old id to new id.
 */
const buildMoves = async ref =>
{
  const beforeText = await Bun.$`git -C ${ROOT} show ${ref}:chef-adventure/data/Items.json`.text();
  const before = JSON.parse(beforeText);
  const after = JSON.parse(await Bun.file(`${DATA_DIR}/Items.json`).text());

  const counts = new Map();
  after.forEach(row =>
  {
    if (!row || !row.name) return;

    counts.set(row.name, (counts.get(row.name) ?? 0) + 1);
  });

  const idByName = new Map();
  after.forEach(row =>
  {
    if (!row || !row.name) return;
    if (counts.get(row.name) > 1) return;

    idByName.set(row.name, row.id);
  });

  const moves = new Map();
  before.forEach(row =>
  {
    if (!row || !row.name) return;

    const to = idByName.get(row.name);

    if (to === undefined) return;
    if (to === row.id) return;

    moves.set(row.id, to);
  });

  return moves;
};

//endregion moves

//region rewriting

/**
 * Repoints every item reference inside one event, reporting what it changed.
 *
 * Three command shapes carry an item id, and each keeps it somewhere different: shop goods behind a
 * type discriminator, Change Items in the first slot, and a possession branch in the second.
 * @param {object} event The parsed event.
 * @param {Map<number, number>} moves Old id to new id.
 * @returns {string[]} A description of each change made.
 */
const repointEvent = (event, moves) =>
{
  const changes = [];

  const walk = (commands, where) => commands.forEach(command =>
  {
    const parameters = command.parameters;
    const isShopGoods = command.code === 302 || command.code === 605;

    if (isShopGoods && parameters[0] === 0 && moves.has(parameters[1]))
    {
      changes.push(`${where} shop i${parameters[1]} -> i${moves.get(parameters[1])}`);
      parameters[1] = moves.get(parameters[1]);
    }

    if (command.code === 126 && moves.has(parameters[0]))
    {
      changes.push(`${where} grant i${parameters[0]} -> i${moves.get(parameters[0])}`);
      parameters[0] = moves.get(parameters[0]);
    }

    if (command.code === 111 && parameters[0] === 8 && moves.has(parameters[1]))
    {
      changes.push(`${where} branch i${parameters[1]} -> i${moves.get(parameters[1])}`);
      parameters[1] = moves.get(parameters[1]);
    }
  });

  if (event.list) walk(event.list, `ev${event.id}`);
  if (event.pages) event.pages.forEach((page, index) => walk(page.list, `ev${event.id} pg${index + 1}`));

  return changes;
};

/**
 * Rewrites only the event lines of a file written in RMMZ's own format.
 *
 * Answers null when the file is not in that format, so the caller can fall back rather than conclude
 * there was nothing to do - a silent skip here would leave a shop selling the wrong thing and report
 * success.
 * @param {string} filename The data file being processed.
 * @param {string} raw The file's current contents.
 * @param {Map<number, number>} moves Old id to new id.
 * @returns {{ changes: string[], contents: string }|null}
 */
const processLinePerEvent = (filename, raw, moves) =>
{
  const lines = raw.split('\n');

  // an event line is the only kind that starts an object; everything else is chrome, tile data, or null.
  const eventLines = lines.filter(line => line.startsWith('{"id":'));

  if (eventLines.length === 0) return null;

  const changes = [];

  lines.forEach((line, index) =>
  {
    if (line.startsWith('{"id":') === false) return;

    const hasTrailingComma = line.endsWith(',');
    const body = hasTrailingComma
      ? line.slice(0, -1)
      : line;

    const event = JSON.parse(body);
    const eventChanges = repointEvent(event, moves);

    if (eventChanges.length === 0) return;

    changes.push(...eventChanges.map(change => `${filename} ${change}`));

    const rebuilt = JSON.stringify(event);

    lines[index] = hasTrailingComma
      ? `${rebuilt},`
      : rebuilt;
  });

  return {
    changes,
    contents: lines.join('\n'),
  };
};

/**
 * Rewrites a file that was pretty-printed at some point rather than left in RMMZ's format.
 *
 * Eight of the map files are in this state. Rewriting one means re-serialising the whole thing, so the
 * indentation is confirmed to reproduce the file byte-for-byte *before* anything is changed - and if no
 * indentation does, the tool refuses. Guessing would rewrite thousands of lines this tool never read.
 * @param {string} filename The data file being processed.
 * @param {string} raw The file's current contents.
 * @param {Map<number, number>} moves Old id to new id.
 * @returns {{ changes: string[], contents: string }}
 */
const processWholeFile = (filename, raw, moves) =>
{
  const parsed = JSON.parse(raw);

  const indent = [ 2, 4, '\t' ].find(candidate => JSON.stringify(parsed, null, candidate) === raw);

  if (indent === undefined)
  {
    throw new Error(`${filename} is formatted in a way this tool cannot reproduce; it must be fixed by hand.`);
  }

  const changes = [];

  (parsed.events ?? []).forEach(event =>
  {
    if (!event) return;

    changes.push(...repointEvent(event, moves)
      .map(change => `${filename} ${change}`));
  });

  return {
    changes,
    contents: JSON.stringify(parsed, null, indent),
  };
};

/**
 * Repoints every item reference in one data file, touching as little of it as possible.
 * @param {string} filename The data file to process.
 * @param {Map<number, number>} moves Old id to new id.
 * @param {boolean} write Whether to save the result.
 * @returns {Promise<string[]>} A description of each change made.
 */
const processFile = async (filename, moves, write) =>
{
  const raw = await Bun.file(`${DATA_DIR}/${filename}`).text();

  // ask a throwaway copy what would change before choosing how to write anything back. most files
  // change nothing, and a file that changes nothing must never be re-serialised - that is how a tool
  // reformats thousands of lines it never read, or refuses over a map with no events in it.
  const rehearsal = JSON.parse(raw);
  const events = Array.isArray(rehearsal)
    ? rehearsal
    : (rehearsal.events ?? []);

  const wouldChange = events
    .filter(Boolean)
    .flatMap(event => repointEvent(event, moves));

  if (wouldChange.length === 0) return [];

  const result = processLinePerEvent(filename, raw, moves) ?? processWholeFile(filename, raw, moves);

  if (write)
  {
    await Bun.write(`${DATA_DIR}/${filename}`, result.contents);
  }

  return result.changes;
};

/**
 * Every data file that can hold events.
 * @returns {Promise<string[]>}
 */
const eventFiles = async () =>
{
  const infos = JSON.parse(await Bun.file(`${DATA_DIR}/MapInfos.json`).text());
  const files = [ 'CommonEvents.json' ];

  for (const info of infos)
  {
    if (!info) continue;

    const filename = `Map${String(info.id).padStart(3, '0')}.json`;

    if (!(await Bun.file(`${DATA_DIR}/${filename}`).exists())) continue;

    files.push(filename);
  }

  return files;
};

//endregion rewriting

const [ subcommand, ref = 'HEAD' ] = process.argv.slice(2);

if (subcommand !== 'plan' && subcommand !== 'apply')
{
  console.log('usage: bun tools/event-item-ids.js plan [ref] | apply [ref]');
}
else
{
  const write = subcommand === 'apply';
  const moves = await buildMoves(ref);
  const files = await eventFiles();

  const changes = [];

  for (const filename of files)
  {
    const fileChanges = await processFile(filename, moves, write);

    changes.push(...fileChanges);
  }

  console.log(`items that moved since ${ref}: ${moves.size}`);
  console.log(`${write ? 'rewrote' : 'would rewrite'} ${changes.length} event reference(s)\n`);
  changes.forEach(change => console.log(`  ${change}`));
}
