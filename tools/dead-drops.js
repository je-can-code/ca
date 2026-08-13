/**
 * dead-drops — repoint enemy drop tags left behind by the food migration.
 *
 * The fifteen food families used to live in the material armor block as five tiers each. Moving them
 * into `Items.json` consolidated every family to three or four tiers, and the tiers that were cut took
 * their armor rows with them. The enemy `<drops:[a,ID,N]>` tags naming those rows were never updated,
 * so 274 of them point at blank rows and drop nothing — silently, because a drop tag naming a missing
 * row is not an error, it is just a drop that never happens.
 *
 * Each dead id is re-aimed at the surviving tier of the same family that sits nearest its old rank.
 * That mapping is a design decision rather than a derivation, so it is written out in full below
 * instead of being recomputed: the old block is gone from the working tree, and a table that has to
 * reconstruct itself out of git history is a table nobody can check.
 *
 * Usage:
 *   bun tools/dead-drops.js plan    # what would change, and where
 *   bun tools/dead-drops.js apply
 */

const ROOT = `${import.meta.dir}/..`;
const DATA_DIR = `${ROOT}/chef-adventure/data`;

/**
 * Old material armor id to the item that replaces it, with the retired name kept for the report.
 *
 * The rank in each comment is the tier's position in its original five-wide family, which is what
 * chose the replacement. Ranks 1 and 3 dominate because the consolidation cut the weakest tier of
 * most families and the middle of the rest.
 * @type {Array<{ from: number, was: string, to: number, becomes: string }>}
 */
const RETARGETS = [
  { from: 321, was: 'Dead Greens', to: 281, becomes: 'Leafy Greens' },          // rank 1/5
  { from: 342, was: 'Gnarled Coral', to: 307, becomes: 'River Coral' },         // rank 2/5
  { from: 346, was: 'Scavenged Tail', to: 206, becomes: 'Lanky Tail' },         // rank 1/5
  { from: 347, was: 'Sinewy Tail', to: 207, becomes: 'Beefy Tail' },            // rank 2/5
  { from: 349, was: 'Thicc Tail', to: 208, becomes: 'Dargin Tail' },            // rank 4/5
  { from: 357, was: 'Lacerated Eyeball', to: 227, becomes: 'Snooping Eyeball' },// rank 2/5
  { from: 372, was: 'Coagulated Blood', to: 232, becomes: 'Virgin Blood' },     // rank 2/5
  { from: 374, was: 'Sinister Blood', to: 233, becomes: 'Blue Blood' },         // rank 4/5
  { from: 388, was: 'Grim Flank', to: 213, becomes: 'Giga Flank' },             // rank 3/5
  { from: 398, was: 'Serpent Ribs', to: 218, becomes: 'Ouroboros Ribs' },       // rank 3/5
  { from: 402, was: 'Large Gelatin', to: 242, becomes: 'Big Gelatin' },         // rank 2/5
  { from: 403, was: 'Huge Gelatin', to: 243, becomes: 'Oversized Gelatin' },    // rank 3/5
  { from: 411, was: 'Animal Heart', to: 236, becomes: 'Beast Heart' },          // rank 1/5
  { from: 416, was: 'Gross Slime', to: 391, becomes: 'Leftover Slime' },        // rank 1/5
  { from: 421, was: 'Damaged Wing', to: 221, becomes: 'Flappy Wing' },          // rank 1/5
  { from: 423, was: 'Glossy Wing', to: 223, becomes: 'Iridescent Wing' },       // rank 3/5
  { from: 427, was: 'Ordinary Fish', to: 247, becomes: 'Fresh Fish' },          // rank 2/5
  { from: 433, was: 'Faerie Flower', to: 288, becomes: 'Faerie Blossom' },      // rank 3/5
  { from: 437, was: 'Critter Eggs', to: 202, becomes: 'Bug Eggs' },             // rank 2/5
  { from: 447, was: 'Bloodtrap Vine', to: 262, becomes: 'Subtrap Vine' },       // rank 2/5
];

/**
 * Every armor drop tag in a note, whether or not it is one we intend to move.
 * @type {RegExp}
 */
const ARMOR_DROP = /<drops:\[\s*a\s*,\s*(\d+)\s*,\s*([^\]]*)\]>/gi;

/**
 * Reads and parses one file out of the shipped data directory.
 * @param {string} filename The filename within `chef-adventure/data`.
 * @returns {Promise<any>}
 */
const readData = async filename => JSON.parse(await Bun.file(`${DATA_DIR}/${filename}`).text());

/**
 * The retarget map, keyed by the armor id being retired.
 * @returns {Map<number, object>}
 */
const retargetsById = () => new Map(RETARGETS.map(retarget => [ retarget.from, retarget ]));

/**
 * Rewrites every armor drop tag in a note that names a retired row.
 *
 * Only the type letter and the id change; the chance and any spacing the author used are carried
 * through untouched, because a drop tag is hand-written text and reformatting it would bury the real
 * edits in noise.
 * @param {string} note The enemy's note field.
 * @param {Map<number, object>} moves The retarget map.
 * @returns {{ note: string, changed: number }}
 */
const retargetNote = (note, moves) =>
{
  let changed = 0;

  const rewritten = note.replace(ARMOR_DROP, (whole, rawId) =>
  {
    const id = parseInt(rawId, 10);
    const move = moves.get(id);

    if (move === undefined) return whole;

    changed += 1;

    return whole.replace(/^(<drops:\[\s*)a(\s*,\s*)\d+/i, `$1i$2${move.to}`);
  });

  return {
    note: rewritten,
    changed,
  };
};

/**
 * Verifies that every replacement lands on a real item, so a typo in the table above fails loudly
 * rather than trading one silent dead drop for another.
 * @param {any[]} items The parsed item list.
 * @returns {void}
 */
const assertTargetsExist = items => RETARGETS.forEach(retarget =>
{
  const row = items[retarget.to];

  if (!row || !row.name)
  {
    throw new Error(`retarget for a${retarget.from} points at i${retarget.to}, which is blank.`);
  }

  if (row.name !== retarget.becomes)
  {
    throw new Error(`i${retarget.to} is "${row.name}", but the table expects "${retarget.becomes}".`);
  }
});

/**
 * Counts what each retarget would touch, and which enemies are involved.
 * @param {any[]} enemies The parsed enemy list.
 * @param {Map<number, object>} moves The retarget map.
 * @returns {{ counts: Map<number, number>, enemyIds: Set<number>, total: number }}
 */
const survey = (enemies, moves) =>
{
  const counts = new Map();
  const enemyIds = new Set();
  let total = 0;

  enemies.forEach(enemy =>
  {
    if (!enemy) return;

    for (const match of (enemy.note ?? '').matchAll(ARMOR_DROP))
    {
      const id = parseInt(match[1], 10);

      if (moves.has(id) === false) continue;

      counts.set(id, (counts.get(id) ?? 0) + 1);
      enemyIds.add(enemy.id);
      total += 1;
    }
  });

  return {
    counts,
    enemyIds,
    total,
  };
};

//region subcommands

/**
 * Reports what would move, without writing anything.
 * @returns {Promise<void>}
 */
const runPlan = async () =>
{
  const items = await readData('Items.json');
  const enemies = await readData('Enemies.json');

  assertTargetsExist(items);

  const moves = retargetsById();
  const { counts, enemyIds, total } = survey(enemies, moves);

  console.log('=== retargets ===');
  RETARGETS.forEach(retarget =>
  {
    const tags = counts.get(retarget.from) ?? 0;
    const suffix = tags === 0
      ? '  (nothing references it)'
      : '';

    console.log(`  a${retarget.from} ${retarget.was.padEnd(18)} -> i${retarget.to} ${retarget.becomes}` +
      `   ${String(tags).padStart(3)} tag(s)${suffix}`);
  });

  console.log(`\n${total} tag(s) across ${enemyIds.size} enemies.`);
};

/**
 * Rewrites the drop tags in place.
 *
 * `Enemies.json` keeps one enemy per line, so only the lines that actually change are rebuilt — a
 * whole-file re-serialise would touch every line and hide these edits inside a cosmetic diff. The
 * line count and the expected edit count are both asserted afterwards, because the line heuristic
 * failing silently would look exactly like a file with nothing to change.
 * @returns {Promise<void>}
 */
const runApply = async () =>
{
  const items = await readData('Items.json');
  const enemies = await readData('Enemies.json');

  assertTargetsExist(items);

  const moves = retargetsById();
  const expected = survey(enemies, moves);

  const raw = await Bun.file(`${DATA_DIR}/Enemies.json`).text();
  const lines = raw.split('\n');

  let applied = 0;
  const touchedEnemies = new Set();

  lines.forEach((line, index) =>
  {
    if (line.startsWith('{"id":') === false) return;

    const hasComma = line.endsWith(',');
    const body = hasComma
      ? line.slice(0, -1)
      : line;

    const enemy = JSON.parse(body);
    const { note, changed } = retargetNote(enemy.note ?? '', moves);

    if (changed === 0) return;

    enemy.note = note;
    applied += changed;
    touchedEnemies.add(enemy.id);

    const rebuilt = JSON.stringify(enemy);
    lines[index] = hasComma
      ? `${rebuilt},`
      : rebuilt;
  });

  if (applied !== expected.total)
  {
    throw new Error(`expected to rewrite ${expected.total} tag(s) but rewrote ${applied}; ` +
      'the per-line reader missed part of the file and nothing was written.');
  }

  await Bun.write(`${DATA_DIR}/Enemies.json`, lines.join('\n'));

  console.log(`rewrote ${applied} drop tag(s) across ${touchedEnemies.size} enemies.`);
  console.log('run `plan` again to confirm nothing still points at a retired row.');
};

//endregion subcommands

const [ subcommand ] = process.argv.slice(2);

if (subcommand === 'plan')
{
  await runPlan();
}
else if (subcommand === 'apply')
{
  await runApply();
}
else
{
  console.log('usage: bun tools/dead-drops.js plan | apply');
}
