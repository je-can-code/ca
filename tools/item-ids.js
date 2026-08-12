/**
 * item-ids — work out where items moved to, and repoint everything that referenced them.
 *
 * Moving a block of items around in the editor renumbers the rows and nothing else. Every recipe slot,
 * every shop, every event that grants one still names the old id - and because the old id is usually
 * still occupied by *something*, nothing errors. A recipe quietly starts producing whatever moved into
 * the slot its output used to sit in.
 *
 * So the remap is done against **names**, never ids, and the previous names come from git rather than
 * from a hand-kept file: whatever `Items.json` looked like at a given commit is the record of what each
 * id used to mean.
 *
 * Usage:
 *   bun tools/item-ids.js plan [ref]     # what moved, and what still points at the old place
 *   bun tools/item-ids.js apply [ref]    # rewrite config.crafting.json to match (asks nothing; read plan first)
 *
 * `ref` defaults to HEAD.
 */

const ROOT = `${import.meta.dir}/..`;
const DATA_DIR = `${ROOT}/chef-adventure/data`;
const CRAFTING_PATH = `${DATA_DIR}/config.crafting.json`;

//region loading

/**
 * Reads and parses one file out of the shipped data directory.
 * @param {string} filename The filename within `chef-adventure/data`, including the extension.
 * @returns {Promise<any>} The parsed contents.
 */
const readData = async filename =>
{
  return JSON.parse(await Bun.file(`${DATA_DIR}/${filename}`).text());
};

/**
 * Reads a data file as it stood at a given commit.
 * @param {string} ref The git ref to read from.
 * @param {string} filename The filename within `chef-adventure/data`.
 * @returns {Promise<any>} The parsed contents at that ref.
 */
const readDataAt = async (ref, filename) =>
{
  const text = await Bun.$`git -C ${ROOT} show ${ref}:chef-adventure/data/${filename}`.text();

  return JSON.parse(text);
};

//endregion loading

//region mapping

/**
 * Works out which ids moved, by matching the names either side.
 *
 * A name occupying two rows is skipped rather than guessed at: with duplicates there is no honest answer
 * to "which one did this reference mean", and picking one silently is how a remap corrupts data while
 * reporting success.
 * @param {any[]} before The rows as they stood.
 * @param {any[]} after The rows as they stand now.
 * @returns {{ moves: Map<number, number>, ambiguous: string[], lost: Array<{ id: number, name: string }> }}
 */
const buildMoves = (before, after) =>
{
  const countsAfter = new Map();
  after.forEach(row =>
  {
    if (!row || !row.name) return;

    const seen = countsAfter.get(row.name) ?? 0;
    countsAfter.set(row.name, seen + 1);
  });

  const idAfterByName = new Map();
  after.forEach(row =>
  {
    if (!row || !row.name) return;
    if (countsAfter.get(row.name) > 1) return;

    idAfterByName.set(row.name, row.id);
  });

  const moves = new Map();
  const ambiguous = [];
  const lost = [];

  before.forEach(row =>
  {
    if (!row || !row.name) return;

    if (countsAfter.get(row.name) > 1)
    {
      ambiguous.push(row.name);
      return;
    }

    if (idAfterByName.has(row.name) === false)
    {
      lost.push({
        id: row.id,
        name: row.name,
      });
      return;
    }

    const idAfter = idAfterByName.get(row.name);

    if (idAfter === row.id) return;

    moves.set(row.id, idAfter);
  });

  return {
    moves,
    ambiguous,
    lost,
  };
};

/**
 * Walks every item-typed slot of every recipe, handing each to a visitor.
 * @param {any} crafting The parsed crafting configuration.
 * @param {function(object, string, string): void} visit Receives the component, its recipe key, and its slot.
 */
const forEachItemSlot = (crafting, visit) =>
{
  crafting.recipes.forEach(recipe => [ 'ingredients', 'tools', 'outputs', 'cost' ].forEach(slot =>
  {
    const components = recipe[slot];

    if (components === undefined) return;

    components.forEach(component =>
    {
      if (component.type !== 'i') return;
      if (component.categories !== undefined && component.categories.length > 0) return;

      visit(component, recipe.key, slot);
    });
  }));
};

//endregion mapping

//region subcommands

/**
 * Reports what moved and what still points at the old place, writing nothing.
 * @param {string} ref The git ref to compare against.
 * @returns {Promise<void>}
 */
const runPlan = async ref =>
{
  const before = await readDataAt(ref, 'Items.json');
  const after = await readData('Items.json');
  const crafting = await readData('config.crafting.json');

  const { moves, ambiguous, lost } = buildMoves(before, after);

  console.log(`=== items that moved since ${ref}: ${moves.size} ===`);
  [ ...moves.entries() ]
    .sort((a, b) => a[0] - b[0])
    .forEach(([ from, to ]) => console.log(`  i${from} -> i${to}  ${after[to].name}`));

  if (lost.length > 0)
  {
    console.log();
    console.log(`=== ${lost.length} name(s) no longer present anywhere ===`);
    console.log('  these cannot be remapped; whatever referenced them needs a decision.');
    lost.forEach(row => console.log(`    was i${row.id} "${row.name}"`));
  }

  if (ambiguous.length > 0)
  {
    console.log();
    console.log(`=== ${ambiguous.length} name(s) occupy more than one row and were skipped ===`);
    [ ...new Set(ambiguous) ].forEach(name => console.log(`    "${name}"`));
  }

  const stale = [];
  forEachItemSlot(crafting, (component, recipeKey, slot) =>
  {
    if (moves.has(component.id) === false) return;

    stale.push({
      recipeKey,
      slot,
      from: component.id,
      to: moves.get(component.id),
    });
  });

  console.log();
  console.log(`=== recipe slots needing a rewrite: ${stale.length} ===`);
  stale.forEach(entry =>
  {
    const name = after[entry.to].name;

    console.log(`  ${entry.recipeKey.padEnd(28)} ${entry.slot.padEnd(12)} i${entry.from} -> i${entry.to}  ${name}`);
  });
};

/**
 * Rewrites the crafting configuration so every moved item is referenced where it now lives.
 * @param {string} ref The git ref to compare against.
 * @returns {Promise<void>}
 */
const runApply = async ref =>
{
  const before = await readDataAt(ref, 'Items.json');
  const after = await readData('Items.json');
  const crafting = await readData('config.crafting.json');

  const { moves } = buildMoves(before, after);

  let rewritten = 0;

  forEachItemSlot(crafting, component =>
  {
    if (moves.has(component.id) === false) return;

    component.id = moves.get(component.id);
    rewritten += 1;
  });

  await Bun.write(CRAFTING_PATH, `${JSON.stringify(crafting, null, 2)}\n`);

  console.log(`rewrote ${rewritten} slot(s) in config.crafting.json`);
  console.log('run `plan` again to confirm nothing is left pointing at an old id.');
};

//endregion subcommands

const [ subcommand, ref = 'HEAD' ] = process.argv.slice(2);

if (subcommand === 'plan')
{
  await runPlan(ref);
}
else if (subcommand === 'apply')
{
  await runApply(ref);
}
else
{
  console.log('usage: bun tools/item-ids.js plan [ref] | apply [ref]');
}
