/**
 * Moves above-divider ex- and sp-parameter traits onto `<this{PARAM}:N>` tags.
 *
 * Codes 22 and 23 have no `params` field to act as the item's own base, so under localised equipment
 * parameters a percentage on one of them has nothing to multiply. This transcribes each into the tag
 * that supplies that base, which is behaviour-preserving: the tag summed equals the trait summed while
 * no material percentage is present.
 *
 * The trait must be removed as it is transcribed. Leaving both in place would have the item's own
 * percentage scale its own base, which is a number nobody authored.
 *
 * Code 21 is deliberately untouched - `params` already gives it a base, so it localises as-is.
 * Below-divider traits are deliberately untouched - those are refinement payloads, which are the
 * percentages the whole design is about.
 *
 * Run with `--write` to apply; prints a dry run otherwise.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'chef-adventure', 'data');
const WRITE = process.argv.includes('--write');

const X_NAME = [ 'Hit', 'Eva', 'Cri', 'Cev', 'Mev', 'Mrf', 'Cnt', 'Hrg', 'Mrg', 'Trg' ];
const S_NAME = [ 'Tgr', 'Grd', 'Rec', 'Pha', 'Mcr', 'Tcr', 'Pdr', 'Mdr', 'Fdr', 'Exr' ];

/**
 * The whole-percent amount a trait is worth, in the units its family stores.
 * @param {{code: number, dataId: number, value: number}} trait The trait being transcribed.
 * @returns {number}
 */
const pointsFor = trait => (trait.code === 22
  ? Math.round(trait.value * 100)
  : Math.round((trait.value - 1) * 100));

/**
 * The tag name a trait transcribes into.
 * @param {{code: number, dataId: number, value: number}} trait The trait being transcribed.
 * @returns {string}
 */
const tagNameFor = trait => (trait.code === 22
  ? X_NAME[trait.dataId]
  : S_NAME[trait.dataId]);

const summary = {
  rowsChanged: 0,
  rowsSkipped: 0,
  traitsMoved: 0,
  tagsEmitted: 0,
  zeroDropped: 0,
  byTag: {},
};
const samples = [];

/**
 * Transcribes one file in place, returning its new text.
 * @param {string} file The data file to process.
 * @returns {string}
 */
const processFile = file =>
{
  const full = path.join(DATA, file);
  const text = fs.readFileSync(full, 'utf8');
  const rows = JSON.parse(text);

  rows.forEach((row, id) =>
  {
    if (!row) return;

    const traits = row.traits ?? [];
    const dividerIndex = traits.findIndex(t => t.code === 63);

    // no divider means the whole list is the item's own; otherwise only what precedes it is.
    const aboveCount = dividerIndex === -1
      ? traits.length
      : dividerIndex;

    const moving = [];
    const kept = [];

    traits.forEach((trait, index) =>
    {
      const isAbove = index < aboveCount;
      const isTranscribable = trait.code === 22 || trait.code === 23;

      if (isAbove && isTranscribable)
      {
        moving.push(trait);

        return;
      }

      kept.push(trait);
    });

    if (moving.length === 0) return;

    const newTags = [];

    moving.forEach(trait =>
    {
      const points = pointsFor(trait);
      summary.traitsMoved++;

      // a trait worth nothing transcribes into a tag worth nothing; drop it rather than author noise.
      if (points === 0)
      {
        summary.zeroDropped++;
        kept.push(trait);

        return;
      }

      const tagName = tagNameFor(trait);
      const tag = `<this${tagName}:${points}>`;
      newTags.push(tag);
      summary.tagsEmitted++;
      summary.byTag[tagName] = (summary.byTag[tagName] ?? 0) + 1;
    });

    // a row whose transcribable traits are all worth nothing gets left exactly as it is. Those are
    // unbuilt slots carrying a placeholder line, and a zero trait is inert either way - rewriting them
    // would put 186 rows in the diff that mean nothing and bury the ones that do.
    if (newTags.length === 0)
    {
      summary.rowsSkipped++;

      return;
    }

    const existing = row.note ?? '';
    const trimmed = existing.replace(/\n+$/, '');
    const joined = newTags.join('\n');
    const nextNote = trimmed.length === 0
      ? joined
      : `${trimmed}\n${joined}`;

    if (samples.length < 8)
    {
      samples.push(`${file.slice(0, 1)}${String(id).padStart(3)} ${String(row.name).slice(0, 22).padEnd(22)} `
        + `${moving.length} trait(s) -> ${newTags.join(' ') || '(all zero, dropped)'}`);
    }

    row.traits = kept;
    row.note = newTags.length === 0
      ? existing
      : nextNote;
    summary.rowsChanged++;
  });

  // the engine writes one row per line; rebuilding it any other way reformats the entire file.
  const body = rows.map(row => (row === null
    ? 'null'
    : JSON.stringify(row)))
    .join(',\n');

  return `[\n${body}\n]`;
};

[ 'Weapons.json', 'Armors.json' ].forEach(file =>
{
  const next = processFile(file);

  if (WRITE)
  {
    fs.writeFileSync(path.join(DATA, file), next, 'utf8');
  }
});

console.log(WRITE
  ? '=== WROTE ==='
  : '=== DRY RUN (pass --write to apply) ===');
console.log(`rows changed:   ${summary.rowsChanged}`);
console.log(`rows skipped:   ${summary.rowsSkipped} (every transcribable trait worth nothing)`);
console.log(`traits seen:    ${summary.traitsMoved}`);
console.log(`tags emitted:   ${summary.tagsEmitted}`);
console.log(`zero left be:   ${summary.zeroDropped}`);
console.log(`seen == emitted + left: ${summary.traitsMoved === summary.tagsEmitted + summary.zeroDropped}`);
console.log('\nby tag:');
Object.keys(summary.byTag)
  .sort()
  .forEach(k => console.log(`  this${k.padEnd(4)} ${summary.byTag[k]}`));
console.log('\nsamples:');
samples.forEach(s => console.log(`  ${s}`));
