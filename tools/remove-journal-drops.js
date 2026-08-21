/**
 * remove-journal-drops — strip the retired Recipe Journal drops from every enemy.
 *
 * Recipe Journals I-III taught a bundle of recipes on use, which is the discovery model the study shop
 * replaces: recipes are now chosen and bought with scrap currency rather than handed over in batches.
 * The three journal rows are gone from `Items.json`, but the drop tags naming them were left behind,
 * and a drop tag pointing at a missing row is silently ignored rather than reported - so 353 tags across
 * 352 enemies were rolling for nothing.
 *
 * They are removed outright rather than repointed at Recipe Scrap. The journals are done; where scrap
 * should drop is a separate authoring decision and not something a cleanup pass should invent.
 *
 * Every journal tag occupies a line by itself, so removal deletes whole lines and never rewrites a line
 * that holds anything else. The tool verifies that before it writes.
 *
 * Usage:
 *   bun tools/remove-journal-drops.js plan
 *   bun tools/remove-journal-drops.js apply
 */

const ROOT = `${import.meta.dir}/..`;
const ENEMIES_PATH = `${ROOT}/chef-adventure/data/Enemies.json`;

/**
 * The retired item ids, with the names they carried, for the report.
 * @type {Array<{ id: number, was: string }>}
 */
const JOURNALS = [
  {
    id: 461,
    was: 'Recipe Journal I',
  },
  {
    id: 462,
    was: 'Recipe Journal II',
  },
  {
    id: 463,
    was: 'Recipe Journal III',
  },
];

/**
 * Matches a drop tag naming one of the retired journals.
 *
 * Deliberately mirrors the spacing the plugin's own `J.DROPS.RegExp.ExtraDrop` allows - a single
 * optional space after each comma - so this cannot match text the game itself would not have read as a
 * drop.
 * @returns {RegExp}
 */
const journalDropPattern = () =>
{
  const ids = JOURNALS.map(journal => journal.id).join('|');

  return new RegExp(`<drops:[ ]?\\[(?:i|item),[ ]?(${ids}),[ ]?(\\d+)\\]>`, 'gi');
};

/**
 * Removes the journal drops from one note, deleting the lines they occupy.
 * @param {string} note The enemy's note field.
 * @returns {{ note: string, removed: Array<{ id: number, chance: number }> }}
 */
const stripJournalDrops = note =>
{
  const removed = [];
  const kept = [];

  note.split('\n')
    .forEach(line =>
    {
      const matches = [ ...line.matchAll(journalDropPattern()) ];

      if (matches.length === 0)
      {
        kept.push(line);
        return;
      }

      const remainder = line.replace(journalDropPattern(), '')
        .trim();

      // a journal tag sharing its line with anything else would make deleting the line destructive, so
      // that line keeps everything except the tag rather than disappearing.
      if (remainder.length > 0)
      {
        kept.push(line.replace(journalDropPattern(), '')
          .trimEnd());
      }

      matches.forEach(match => removed.push({
        id: parseInt(match[1], 10),
        chance: parseInt(match[2], 10),
      }));
    });

  return {
    note: kept.join('\n'),
    removed,
  };
};

/**
 * Surveys what would be removed.
 * @param {any[]} enemies The parsed enemy list.
 * @returns {{ perId: Map<number, number>, enemyIds: Set<number>, total: number }}
 */
const survey = enemies =>
{
  const perId = new Map();
  const enemyIds = new Set();
  let total = 0;

  enemies.forEach(enemy =>
  {
    if (!enemy) return;

    const { removed } = stripJournalDrops(enemy.note ?? '');

    removed.forEach(drop =>
    {
      perId.set(drop.id, (perId.get(drop.id) ?? 0) + 1);
      enemyIds.add(enemy.id);
      total += 1;
    });
  });

  return {
    perId,
    enemyIds,
    total,
  };
};

//region subcommands

/**
 * Reports what would be removed, without writing.
 * @returns {Promise<void>}
 */
const runPlan = async () =>
{
  const enemies = JSON.parse(await Bun.file(ENEMIES_PATH).text());
  const { perId, enemyIds, total } = survey(enemies);

  console.log('=== journal drops to remove ===');
  JOURNALS.forEach(journal => console.log(`  i${journal.id} ${journal.was.padEnd(20)} ` +
    `${String(perId.get(journal.id) ?? 0).padStart(3)} tag(s)`));

  console.log(`\n${total} tag(s) across ${enemyIds.size} enemies.`);
};

/**
 * Removes the drops.
 *
 * `Enemies.json` keeps one enemy per line, so only the lines whose notes change are rebuilt. The count
 * actually removed is checked against the survey, because the per-line reader silently skipping part of
 * the file would otherwise look identical to a file with nothing to remove.
 * @returns {Promise<void>}
 */
const runApply = async () =>
{
  const enemies = JSON.parse(await Bun.file(ENEMIES_PATH).text());
  const expected = survey(enemies);

  if (expected.total === 0)
  {
    console.log('nothing to do; no journal drops remain.');
    return;
  }

  const raw = await Bun.file(ENEMIES_PATH).text();
  const lines = raw.split('\n');

  let removedCount = 0;
  const touched = new Set();

  lines.forEach((line, index) =>
  {
    if (line.startsWith('{"id":') === false) return;

    const hasComma = line.endsWith(',');
    const body = hasComma
      ? line.slice(0, -1)
      : line;

    const enemy = JSON.parse(body);
    const { note, removed } = stripJournalDrops(enemy.note ?? '');

    if (removed.length === 0) return;

    // every other tag on this enemy must survive untouched; only the journal lines may disappear.
    const before = (enemy.note ?? '').split('\n').length;
    const after = note.split('\n').length;

    if (before - after !== removed.length)
    {
      throw new Error(`e${enemy.id} lost ${before - after} line(s) for ${removed.length} tag(s); nothing was written.`);
    }

    enemy.note = note;
    removedCount += removed.length;
    touched.add(enemy.id);

    const rebuilt = JSON.stringify(enemy);
    lines[index] = hasComma
      ? `${rebuilt},`
      : rebuilt;
  });

  if (removedCount !== expected.total)
  {
    throw new Error(`expected to remove ${expected.total} tag(s) but removed ${removedCount}; ` +
      'the per-line reader missed part of the file and nothing was written.');
  }

  await Bun.write(ENEMIES_PATH, lines.join('\n'));

  console.log(`removed ${removedCount} journal drop tag(s) from ${touched.size} enemies.`);
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
  console.log('usage: bun tools/remove-journal-drops.js plan | apply');
}
