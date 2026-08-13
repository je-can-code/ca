/**
 * armor-retrait — reassign the two doubly-covered material families to uncovered parameters.
 *
 * `cri` was granted by both Stinger and Fangs, and `cev` by both Talon and Scales, which left two
 * parameters with two families and two others with none. Stinger takes `hit` and Scales takes `mdf`,
 * so all sixteen families land on sixteen distinct parameters.
 *
 * This runs on its own, ahead of any reordering, and moves nothing. A retrait is a change of meaning
 * and a reorder is a change of position; fused together, the reorder could no longer assert that its
 * output is a byte-for-byte permutation of its input, because two rows would legitimately differ. Kept
 * apart, each gets an assertion the other could not support.
 *
 * The two conversions are not symmetric:
 *
 * - **Stinger, cri to hit** stays within the x-params, so only `dataId` moves. An x-param value is a
 *   flat rate added to the parameter, and that means the same thing on either one, so the values carry
 *   over untouched.
 * - **Scales, cev to mdf** crosses from an x-param to a b-param, and a b-param reads its value as a
 *   **multiplier** rather than a rate. Carrying `0.05` across unchanged would not be a five percent
 *   gain in magic defense, it would cut magic defense to a twentieth. The value becomes `1 + value`.
 *
 * Usage:
 *   bun tools/armor-retrait.js plan
 *   bun tools/armor-retrait.js apply
 */

const ROOT = `${import.meta.dir}/..`;
const ARMORS_PATH = `${ROOT}/chef-adventure/data/Armors.json`;

/**
 * Trait code for a b-param, whose value is a multiplier.
 * @type {number}
 */
const B_PARAM = 21;

/**
 * Trait code for an x-param, whose value is a flat rate.
 * @type {number}
 */
const X_PARAM = 22;

/**
 * The two reassignments, each naming exactly the trait it expects to find.
 *
 * Matching on the current code and dataId rather than "the first non-divider trait" is what makes a
 * second run a no-op instead of a second conversion: once Scales reads as a b-param, nothing here
 * matches it again.
 * @type {Array<object>}
 */
const RETRAITS = [
  {
    family: 'Stinger',
    start: 326,
    end: 330,
    fromParam: 'cri',
    toParam: 'hit',
    match: {
      code: X_PARAM,
      dataId: 2,
    },
    become: {
      code: X_PARAM,
      dataId: 0,
    },
    convertValue: value => value,
  },
  {
    family: 'Scales',
    start: 376,
    end: 380,
    fromParam: 'cev',
    toParam: 'mdf',
    match: {
      code: X_PARAM,
      dataId: 3,
    },
    become: {
      code: B_PARAM,
      dataId: 5,
    },
    convertValue: value => Math.round((1 + value) * 100) / 100,
  },
];

/**
 * The trait a material transfers, which is the one that is not JAFTING's divider.
 * @param {object} row The armor row.
 * @returns {object|null}
 */
const payloadOf = row =>
{
  const payload = row.traits.find(trait => trait.code !== 63);

  if (payload === undefined) return null;

  return payload;
};

/**
 * Works out the edits without performing them.
 * @param {any[]} armors The parsed armor list.
 * @returns {Array<object>}
 */
const collectEdits = armors => RETRAITS.flatMap(retrait =>
{
  const edits = [];

  for (let id = retrait.start; id <= retrait.end; id++)
  {
    const row = armors[id];

    if (!row || !row.name)
    {
      throw new Error(`a${id} is blank, but ${retrait.family} was expected to occupy it.`);
    }

    const payload = payloadOf(row);

    if (payload === null)
    {
      throw new Error(`a${id} "${row.name}" carries no transferable trait.`);
    }

    // a row that no longer matches has already been converted, so it is skipped rather than doubled.
    if (payload.code !== retrait.match.code) continue;
    if (payload.dataId !== retrait.match.dataId) continue;

    edits.push({
      retrait,
      id,
      name: row.name,
      before: {
        ...payload,
      },
      after: {
        code: retrait.become.code,
        dataId: retrait.become.dataId,
        value: retrait.convertValue(payload.value),
      },
    });
  }

  return edits;
});

//region subcommands

/**
 * Reports the edits without writing.
 * @returns {Promise<void>}
 */
const runPlan = async () =>
{
  const armors = JSON.parse(await Bun.file(ARMORS_PATH).text());
  const edits = collectEdits(armors);

  RETRAITS.forEach(retrait =>
  {
    const mine = edits.filter(edit => edit.retrait === retrait);

    console.log(`\n${retrait.family} a${retrait.start}-${retrait.end}: ` +
      `${retrait.fromParam} -> ${retrait.toParam}   (${mine.length} row(s))`);

    mine.forEach(edit => console.log(`  a${edit.id} ${edit.name.padEnd(18)} ` +
      `{code:${edit.before.code},dataId:${edit.before.dataId},value:${edit.before.value}}` +
      `  ->  {code:${edit.after.code},dataId:${edit.after.dataId},value:${edit.after.value}}`));
  });

  console.log(`\n${edits.length} row(s) would change.`);
};

/**
 * Applies the retraits.
 *
 * `Armors.json` keeps one row per line and carries no trailing newline, so it is rebuilt in that shape
 * rather than pretty-printed. Only the ten payload traits change; every other byte of every row, and
 * every row outside the two ranges, is reproduced exactly.
 * @returns {Promise<void>}
 */
const runApply = async () =>
{
  const raw = await Bun.file(ARMORS_PATH).text();
  const armors = JSON.parse(raw);
  const original = JSON.parse(raw);
  const edits = collectEdits(armors);

  if (edits.length === 0)
  {
    console.log('nothing to do; both families already read as their new parameters.');
    return;
  }

  edits.forEach(edit =>
  {
    const payload = payloadOf(armors[edit.id]);

    payload.code = edit.after.code;
    payload.dataId = edit.after.dataId;
    payload.value = edit.after.value;
  });

  // every row that changed must be one we intended to change, and must differ only inside its traits.
  const changed = [];
  armors.forEach((row, id) =>
  {
    if (JSON.stringify(row) === JSON.stringify(original[id])) return;

    changed.push(id);

    const before = {
      ...original[id],
      traits: null,
    };
    const after = {
      ...row,
      traits: null,
    };

    if (JSON.stringify(before) !== JSON.stringify(after))
    {
      throw new Error(`a${id} changed outside its traits; nothing was written.`);
    }

    const divider = row.traits.find(trait => trait.code === 63);

    if (divider === undefined)
    {
      throw new Error(`a${id} lost its code-63 transfer divider; nothing was written.`);
    }

    if (row.traits.length !== original[id].traits.length)
    {
      throw new Error(`a${id} gained or lost a trait; nothing was written.`);
    }
  });

  const expected = edits.map(edit => edit.id);

  if (JSON.stringify(changed) !== JSON.stringify(expected))
  {
    throw new Error(`changed rows ${changed.join(',')} do not match the intended ${expected.join(',')}.`);
  }

  const body = armors.map(row => JSON.stringify(row)).join(',\n');

  await Bun.write(ARMORS_PATH, `[\n${body}\n]`);

  console.log(`rewrote ${edits.length} payload trait(s) across rows ${changed.join(', ')}.`);
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
  console.log('usage: bun tools/armor-retrait.js plan | apply');
}
