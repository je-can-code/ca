/**
 * armor-reorder — lay the material armor block out in parameter order.
 *
 * `a301-a455` holds the refinement materials as five-wide families, but their order is arbitrary:
 * `Pelt` grants `mrg` from a301 while `mmp`'s `Powder` sits thirty rows later. Nothing derives that
 * arrangement, so answering "which parameters still have no material?" means reading all eighty rows
 * and tallying them by hand.
 *
 * Ordering the block by parameter turns that question into arithmetic — parameter index is
 * `(id - 301) / 5` — and makes a gap describe itself. An empty a301-305 reads as "mhp has no family"
 * without consulting anything.
 *
 * The order is long-param id order with `mtp` inserted between `mmp` and `atk`, so the three resource
 * pools read together. That is 29 parameters, since `mtp` is long-param 30 while the rest are 0-27.
 *
 * **This moves rows and edits nothing.** The two families that needed a change of meaning were handled
 * separately by `tools/armor-retrait.js`, which is what lets the check below be the strongest one
 * available: the output block must be a byte-for-byte permutation of the input block. Had a retrait
 * ridden along, two rows would legitimately differ and the check would need exemptions - which is
 * precisely where a bug would survive.
 *
 * Usage:
 *   bun tools/armor-reorder.js plan
 *   bun tools/armor-reorder.js apply
 */

const ROOT = `${import.meta.dir}/..`;
const ARMORS_PATH = `${ROOT}/chef-adventure/data/Armors.json`;

const BLOCK_START = 301;
const BLOCK_END = 455;
const FAMILY_SIZE = 5;

/**
 * Registry keys by long-param id, for decoding a payload trait back to a parameter.
 * @type {string[]}
 */
const PARAM_KEYS = [
  'mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk',
  'hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg',
  'tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr',
];

/**
 * The target layout, in order, one entry per five-row block.
 *
 * `from` is the block's current starting id, or null where no family grants that parameter yet. The
 * table is written out rather than derived because a layout that recomputes itself from the data it is
 * about to rewrite is a layout nobody can check against intent.
 * @type {Array<{ param: string, from: number|null }>}
 */
const LAYOUT = [
  { param: 'mhp', from: null },
  { param: 'mmp', from: 331 },  // Powder
  { param: 'mtp', from: null },
  { param: 'atk', from: 316 },  // Horn, already in place
  { param: 'def', from: 381 },  // Root
  { param: 'mat', from: 391 },  // Tongue
  { param: 'mdf', from: 376 },  // Scales
  { param: 'agi', from: null },
  { param: 'luk', from: null },
  { param: 'hit', from: 326 },  // Stinger
  { param: 'eva', from: null },
  { param: 'cri', from: 361 },  // Fangs
  { param: 'cev', from: 351 },  // Talon
  { param: 'mev', from: 451 },  // Core
  { param: 'mrf', from: 311 },  // Branch
  { param: 'cnt', from: 306 },  // Spines
  { param: 'hrg', from: null },
  { param: 'mrg', from: 301 },  // Pelt
  { param: 'trg', from: 441 },  // Ear
  { param: 'tgr', from: 406 },  // Veil
  { param: 'grd', from: 336 },  // Stone
  { param: 'rec', from: null },
  { param: 'pha', from: null },
  { param: 'mcr', from: null },
  { param: 'tcr', from: 366 },  // Bone
  { param: 'pdr', from: null },
  { param: 'mdr', from: null },
  { param: 'fdr', from: null },
  { param: 'exr', from: null },
];

/**
 * The parameter a payload trait grants, or null when the trait is not a parameter grant.
 *
 * `mtp` never appears here: it has no trait form, being long-param 30 while trait codes reach only 27.
 * A family granting it would carry the `<maxTp:N>` notetag instead.
 * @param {object} trait The trait to decode.
 * @returns {string|null}
 */
const decodeParam = trait =>
{
  if (trait.code === 21) return PARAM_KEYS[trait.dataId];
  if (trait.code === 22) return PARAM_KEYS[8 + trait.dataId];
  if (trait.code === 23) return PARAM_KEYS[18 + trait.dataId];

  return null;
};

/**
 * The parameter a material row grants, read off the trait that is not JAFTING's code-63 divider.
 * @param {object} row The armor row.
 * @returns {string|null}
 */
const paramOf = row =>
{
  const payload = row.traits.find(trait => trait.code !== 63);

  if (payload === undefined) return null;

  return decodeParam(payload);
};

/**
 * The name given to the rows of a block whose parameter has no family yet.
 *
 * The `===` prefix is this project's established marker for a reserved row that holds no real data -
 * `Enemies.json` uses it the same way - so a labelled gap announces what belongs there without ever
 * being mistaken for a material.
 * @param {string} param The parameter the block is reserved for.
 * @returns {string}
 */
const gapLabelFor = param => `=== TBD ${param}`;

/**
 * Whether a row is an actual material rather than an empty or reserved slot.
 * @param {object} row The armor row.
 * @returns {boolean}
 */
const isMaterial = row =>
{
  if (!row) return false;
  if (!row.name) return false;

  return row.name.startsWith('===') === false;
};

/**
 * A row's identity for permutation checking, which is everything about it except where it lives.
 * @param {object} row The armor row.
 * @returns {string}
 */
const identityOf = row => JSON.stringify({
  ...row,
  id: null,
});

/**
 * Builds the reordered armor list without writing it.
 * @param {any[]} armors The parsed armor list.
 * @returns {{ next: any[], blocks: object[] }}
 */
const buildLayout = armors =>
{
  // `from` names where each family sat *before* the reorder, so this may only run against a block that
  // has not been reordered yet. Once it has, those ids hold different families and a second run would
  // shuffle the block against a map that no longer describes it.
  const stale = LAYOUT.filter(entry =>
  {
    if (entry.from === null) return false;

    return paramOf(armors[entry.from]) !== entry.param;
  });

  if (stale.length > 0)
  {
    const example = stale[0];

    throw new Error(`a${example.from} no longer holds the ${example.param} family, so this block has ` +
      'already been reordered. The `from` column describes the original arrangement and is not a ' +
      'description of the file as it stands - re-running would scramble it. Use `label` instead.');
  }

  const next = JSON.parse(JSON.stringify(armors));

  // gap rows are cloned from a blank the file already contains, so their shape cannot drift from the
  // ones RMMZ wrote. The search runs past the block because once the gaps carry their labels there is
  // no unnamed row left inside it, and a second run must still find a template.
  let blankTemplate = null;
  for (let id = BLOCK_START; id < armors.length; id++)
  {
    if (armors[id] && armors[id].name === '')
    {
      blankTemplate = armors[id];
      break;
    }
  }

  if (blankTemplate === null)
  {
    throw new Error('no blank row exists in the block to use as a template for gaps.');
  }

  const blocks = [];
  let cursor = BLOCK_START;

  LAYOUT.forEach(entry =>
  {
    const rows = [];

    if (entry.from === null)
    {
      for (let offset = 0; offset < FAMILY_SIZE; offset++)
      {
        const gap = JSON.parse(JSON.stringify(blankTemplate));

        // the label is what makes the layout legible in the editor: an empty five-row run says nothing,
        // while "=== TBD agi" says exactly which family is missing.
        gap.name = gapLabelFor(entry.param);

        rows.push(gap);
      }
    }
    else
    {
      for (let offset = 0; offset < FAMILY_SIZE; offset++)
      {
        const source = armors[entry.from + offset];

        if (isMaterial(source) === false)
        {
          throw new Error(`a${entry.from + offset} holds no material, but ${entry.param} expects a family there.`);
        }

        rows.push(JSON.parse(JSON.stringify(source)));
      }
    }

    const family = entry.from === null
      ? ''
      : rows[0].name.split(' ').pop();

    rows.forEach((row, offset) =>
    {
      const id = cursor + offset;

      // an RMMZ row carries its own id, and one that disagrees with its array position is a lasting,
      // silent corruption.
      row.id = id;
      next[id] = row;
    });

    blocks.push({
      param: entry.param,
      from: entry.from,
      start: cursor,
      end: cursor + FAMILY_SIZE - 1,
      family,
      grants: entry.from === null
        ? null
        : paramOf(rows[0]),
      values: rows.filter(isMaterial)
        .map(row => row.traits.find(trait => trait.code !== 63).value),
    });

    cursor += FAMILY_SIZE;
  });

  // whatever remains of the block past the last parameter is left blank and spare.
  for (let id = cursor; id <= BLOCK_END; id++)
  {
    const spare = JSON.parse(JSON.stringify(blankTemplate));

    spare.id = id;
    next[id] = spare;
  }

  return {
    next,
    blocks,
    spareFrom: cursor,
  };
};

/**
 * Every check that must hold before the reordered list may be written.
 * @param {any[]} armors The original armor list.
 * @param {any[]} next The reordered armor list.
 * @param {object[]} blocks The per-block report.
 * @returns {void}
 */
const assertSound = (armors, next, blocks) =>
{
  // the block is a pure permutation: every occupied row survives, once, unedited.
  const before = [];
  const after = [];
  for (let id = BLOCK_START; id <= BLOCK_END; id++)
  {
    if (isMaterial(armors[id])) before.push(identityOf(armors[id]));
    if (isMaterial(next[id])) after.push(identityOf(next[id]));
  }

  if (before.length !== after.length)
  {
    throw new Error(`the block held ${before.length} materials but would hold ${after.length}.`);
  }

  const remaining = [ ...after ];
  before.forEach(identity =>
  {
    const index = remaining.indexOf(identity);

    if (index === -1)
    {
      const name = JSON.parse(identity).name;

      throw new Error(`"${name}" is missing from the output or was altered in transit.`);
    }

    remaining.splice(index, 1);
  });

  // nothing outside the block may move or change at all.
  next.forEach((row, id) =>
  {
    if (id >= BLOCK_START && id <= BLOCK_END) return;

    if (JSON.stringify(row) !== JSON.stringify(armors[id]))
    {
      throw new Error(`a${id} changed, but it lives outside the block.`);
    }
  });

  // every row in the file must agree with its own position.
  next.forEach((row, id) =>
  {
    if (row === null) return;

    if (row.id !== id)
    {
      throw new Error(`a${id} carries id ${row.id}.`);
    }
  });

  if (next.length !== armors.length)
  {
    throw new Error(`row count changed from ${armors.length} to ${next.length}.`);
  }

  // each placed family must actually grant the parameter its block is named for.
  blocks.forEach(block =>
  {
    if (block.from === null) return;

    if (block.grants !== block.param)
    {
      throw new Error(`a${block.start}-${block.end} is the ${block.param} block but ${block.family} grants ${block.grants}.`);
    }
  });
};

/**
 * Labels every reserved block with the parameter that belongs there.
 *
 * Unlike the reorder this reads position rather than the `from` column, which is exactly what the
 * reorder bought: once the block is in parameter order, `(id - 301) / 5` names the parameter, so the
 * labels can be derived from where a row sits instead of from a record of where it came from. That
 * makes this safe to re-run at any time.
 * @param {any[]} armors The parsed armor list.
 * @returns {{ next: any[], labels: object[] }}
 */
const buildLabels = armors =>
{
  const next = JSON.parse(JSON.stringify(armors));
  const labels = [];

  LAYOUT.forEach((entry, index) =>
  {
    const start = BLOCK_START + index * FAMILY_SIZE;
    const rows = [];

    for (let offset = 0; offset < FAMILY_SIZE; offset++)
    {
      rows.push(armors[start + offset]);
    }

    const held = rows.filter(isMaterial);

    // a block holding real materials is a family already designed, and is never relabelled.
    if (held.length > 0)
    {
      const grants = paramOf(held[0]);

      if (grants !== entry.param)
      {
        throw new Error(`a${start}-${start + FAMILY_SIZE - 1} should be the ${entry.param} block ` +
          `but holds a family granting ${grants}; the block is not in parameter order.`);
      }

      return;
    }

    const label = gapLabelFor(entry.param);
    const already = rows.every(row => row.name === label);

    if (already) return;

    rows.forEach((row, offset) =>
    {
      const id = start + offset;
      const labelled = JSON.parse(JSON.stringify(row));

      labelled.name = label;
      next[id] = labelled;
    });

    labels.push({
      param: entry.param,
      start,
      end: start + FAMILY_SIZE - 1,
      label,
    });
  });

  return {
    next,
    labels,
  };
};

//region subcommands

/**
 * Writes a `=== TBD <param>` label onto every reserved block.
 * @param {boolean} write Whether to write the result or only report it.
 * @returns {Promise<void>}
 */
const runLabel = async write =>
{
  const armors = JSON.parse(await Bun.file(ARMORS_PATH).text());
  const { next, labels } = buildLabels(armors);

  labels.forEach(entry => console.log(`  a${entry.start}-${entry.end}   ${entry.label}`));

  if (labels.length === 0)
  {
    console.log('every reserved block is already labelled.');
    return;
  }

  console.log(`\n${labels.length} block(s), ${labels.length * FAMILY_SIZE} rows.`);

  if (write === false)
  {
    console.log('(dry run; pass `label-apply` to write)');
    return;
  }

  // only the name may differ, and only on rows that were empty to begin with.
  next.forEach((row, id) =>
  {
    if (JSON.stringify(row) === JSON.stringify(armors[id])) return;

    if (isMaterial(armors[id]))
    {
      throw new Error(`a${id} holds a material; nothing was written.`);
    }

    const before = {
      ...armors[id],
      name: null,
    };
    const after = {
      ...row,
      name: null,
    };

    if (JSON.stringify(before) !== JSON.stringify(after))
    {
      throw new Error(`a${id} changed outside its name; nothing was written.`);
    }
  });

  const body = next.map(row => JSON.stringify(row)).join(',\n');

  await Bun.write(ARMORS_PATH, `[\n${body}\n]`);

  console.log('written.');
};

/**
 * Reports the layout and runs every check, without writing.
 * @returns {Promise<void>}
 */
const runPlan = async () =>
{
  const armors = JSON.parse(await Bun.file(ARMORS_PATH).text());
  const { next, blocks, spareFrom } = buildLayout(armors);

  assertSound(armors, next, blocks);

  console.log('=== layout ===');
  blocks.forEach(block =>
  {
    if (block.from === null)
    {
      console.log(`  ${block.param.padEnd(4)} a${block.start}-${block.end}   -- GAP --`);
      return;
    }

    const moved = block.from === block.start
      ? 'stays'
      : `from a${block.from}`;

    console.log(`  ${block.param.padEnd(4)} a${block.start}-${block.end}   ${block.family.padEnd(8)} ` +
      `${moved.padEnd(10)} [${block.values.join(', ')}]`);
  });

  console.log(`  spare a${spareFrom}-${BLOCK_END}`);

  const placed = blocks.filter(block => block.from !== null);
  const gaps = blocks.filter(block => block.from === null);

  console.log(`\nfamilies placed: ${placed.length}, gaps: ${gaps.length}`);
  console.log(`gaps to design: ${gaps.map(block => block.param).join(', ')}`);
  console.log('\nall checks passed.');
};

/**
 * Writes the reordered block.
 *
 * `Armors.json` keeps one row per line and carries no trailing newline, so it is rebuilt in that shape
 * rather than pretty-printed.
 * @returns {Promise<void>}
 */
const runApply = async () =>
{
  const armors = JSON.parse(await Bun.file(ARMORS_PATH).text());
  const { next, blocks } = buildLayout(armors);

  assertSound(armors, next, blocks);

  const body = next.map(row => JSON.stringify(row)).join(',\n');

  await Bun.write(ARMORS_PATH, `[\n${body}\n]`);

  const moved = blocks.filter(block => block.from !== null && block.from !== block.start);

  console.log(`reordered the block; ${moved.length} of ${blocks.filter(b => b.from !== null).length} families moved.`);
  console.log('now run `bun tools/armor-ids.js plan` and `apply` to repair references.');
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
else if (subcommand === 'label')
{
  await runLabel(false);
}
else if (subcommand === 'label-apply')
{
  await runLabel(true);
}
else
{
  console.log('usage: bun tools/armor-reorder.js plan | apply | label | label-apply');
}
