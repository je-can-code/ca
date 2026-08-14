/**
 * armor-ids — capture where every material armor is referenced, then repoint them after they move.
 *
 * The material block `a301-a455` is a grid of five-wide families, and reordering it into parameter
 * order renumbers every row. Two places reference those ids and neither errors when one is wrong: a
 * recipe naming a moved row asks for whatever moved into its slot, and an enemy's `<drops:[a,ID,N]>`
 * tag drops whatever now lives there.
 *
 * So the remap runs on **names**. `snapshot` records what each id meant; `plan` reads the same places
 * back afterwards and works out what moved; `apply` rewrites them.
 *
 * Only the lines that change are rewritten. Both `Enemies.json` and the map files keep one record per
 * line, so re-serialising whole files would bury a handful of real edits under thousands of cosmetic
 * ones.
 *
 * Usage:
 *   bun tools/armor-ids.js snapshot [outPath]   # default docs/crafting/backup-armors.json
 *   bun tools/armor-ids.js plan
 *   bun tools/armor-ids.js apply
 */

const ROOT = `${import.meta.dir}/..`;
const DATA_DIR = `${ROOT}/chef-adventure/data`;
const DEFAULT_SNAPSHOT_PATH = `${ROOT}/docs/crafting/backup-armors.json`;

const BLOCK_START = 301;
const BLOCK_END = 455;

/**
 * Whether a row is an actual material rather than an empty or reserved slot.
 *
 * A reserved slot is named `=== TBD <param>`, marking which family still has to be designed for that
 * block. It is a label, not data: counting one as a material would put five identical names into the
 * snapshot and have every later run report them as lost.
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
 * The parameter a material grants, as `code/dataId`, or null when it has no payload.
 * @param {object} row The armor row.
 * @returns {string|null}
 */
const payloadOf = row =>
{
  const payload = (row.traits ?? []).find(trait => trait.code === 21 || trait.code === 22 || trait.code === 23);

  if (payload === undefined) return null;

  return `${payload.code}/${payload.dataId}=${payload.value}`;
};

/**
 * Reads and parses one file out of the shipped data directory.
 * @param {string} filename The filename within `chef-adventure/data`.
 * @returns {Promise<any>}
 */
const readData = async filename => JSON.parse(await Bun.file(`${DATA_DIR}/${filename}`).text());

/**
 * Every drop tag naming an armor, pulled out of one note.
 * @param {string} note The enemy's note field.
 * @returns {Array<{ raw: string, id: number }>}
 */
const armorDropsIn = note =>
{
  const drops = [];

  for (const match of (note ?? '').matchAll(/<drops:\[\s*a\s*,\s*(\d+)\s*,\s*([^\]]*)\]>/gi))
  {
    drops.push({
      raw: match[0],
      id: parseInt(match[1], 10),
    });
  }

  return drops;
};

/**
 * Collects every place a material armor is named.
 * @param {any} crafting The parsed crafting configuration.
 * @param {any[]} enemies The parsed enemy list.
 * @param {any[]} armors The parsed armor list.
 * @returns {{ recipes: object[], drops: object[] }}
 */
const collectReferences = (crafting, enemies, armors) =>
{
  const inBlock = id => id >= BLOCK_START && id <= BLOCK_END;
  const nameOf = id => (isMaterial(armors[id])
    ? armors[id].name
    : `<<blank a${id}>>`);

  const recipes = [];
  crafting.recipes.forEach(recipe => [ 'ingredients', 'tools', 'outputs', 'cost' ].forEach(slot =>
  {
    (recipe[slot] ?? []).forEach((component, index) =>
    {
      if (component.type !== 'a') return;
      if (inBlock(component.id) === false) return;

      recipes.push({
        recipeKey: recipe.key,
        slot,
        index,
        id: component.id,
        name: nameOf(component.id),
      });
    });
  }));

  const drops = [];
  enemies.forEach(enemy =>
  {
    if (!enemy) return;

    armorDropsIn(enemy.note)
      .forEach(drop =>
      {
        if (inBlock(drop.id) === false) return;

        drops.push({
          enemyId: enemy.id,
          enemyName: enemy.name,
          id: drop.id,
          name: nameOf(drop.id),
        });
      });
  });

  return {
    recipes,
    drops,
  };
};

/**
 * Builds name to current id, refusing to answer for a name held by more than one row.
 * @param {any[]} armors The parsed armor list.
 * @returns {Map<string, number>}
 */
const idByName = armors =>
{
  const counts = new Map();
  armors.forEach(row =>
  {
    if (isMaterial(row) === false) return;

    counts.set(row.name, (counts.get(row.name) ?? 0) + 1);
  });

  const map = new Map();
  armors.forEach(row =>
  {
    if (isMaterial(row) === false) return;
    if (counts.get(row.name) > 1) return;

    map.set(row.name, row.id);
  });

  return map;
};

//region subcommands

/**
 * Records what every material id currently means, and everything that refers to one.
 * @param {string} outPath Where to write the snapshot.
 * @returns {Promise<void>}
 */
const runSnapshot = async outPath =>
{
  const armors = await readData('Armors.json');
  const crafting = await readData('config.crafting.json');
  const enemies = await readData('Enemies.json');

  const materials = [];
  for (let id = BLOCK_START; id <= BLOCK_END; id++)
  {
    const row = armors[id];

    if (isMaterial(row) === false) continue;

    materials.push({
      id,
      name: row.name,
      atypeId: row.atypeId,
      payload: payloadOf(row),
    });
  }

  const references = collectReferences(crafting, enemies, armors);

  const snapshot = {
    _backup: `Material armors a${BLOCK_START}-a${BLOCK_END} and every reference to them, before the block was reordered.`,
    _captured: '2026-08-13',
    _source: 'chef-adventure/data/Armors.json, config.crafting.json, Enemies.json',
    _howToRemap: 'Run `bun tools/armor-ids.js plan` after reordering, then `apply`.',
    _counts: {
      materials: materials.length,
      recipeReferences: references.recipes.length,
      dropReferences: references.drops.length,
    },
    materials,
    references,
  };

  await Bun.write(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(`wrote ${outPath}`);
  console.log(`  materials:         ${materials.length}`);
  console.log(`  recipe references: ${references.recipes.length}`);
  console.log(`  drop references:   ${references.drops.length}`);

  const blanks = references.recipes.concat(references.drops)
    .filter(reference => reference.name.startsWith('<<'));

  if (blanks.length > 0)
  {
    console.log(`\n  ${blanks.length} reference(s) already point at a blank row and cannot be remapped:`);
    [ ...new Set(blanks.map(reference => reference.name)) ].forEach(name => console.log(`    ${name}`));
  }
};

/**
 * Works out what moved, from the snapshot's names.
 * @returns {Promise<{ moves: Map<number, number>, lost: object[], armors: any[] }>}
 */
const resolveMoves = async () =>
{
  const snapshotFile = Bun.file(DEFAULT_SNAPSHOT_PATH);

  if (!(await snapshotFile.exists()))
  {
    throw new Error(`no snapshot at ${DEFAULT_SNAPSHOT_PATH}; run snapshot first.`);
  }

  const snapshot = JSON.parse(await snapshotFile.text());
  const armors = await readData('Armors.json');
  const currentIdByName = idByName(armors);

  const moves = new Map();
  const lost = [];

  snapshot.materials.forEach(material =>
  {
    const now = currentIdByName.get(material.name);

    if (now === undefined)
    {
      lost.push(material);
      return;
    }

    if (now === material.id) return;

    moves.set(material.id, now);
  });

  return {
    moves,
    lost,
    armors,
  };
};

/**
 * Reports what moved and what still points at the old place.
 * @returns {Promise<void>}
 */
const runPlan = async () =>
{
  const { moves, lost, armors } = await resolveMoves();
  const crafting = await readData('config.crafting.json');
  const enemies = await readData('Enemies.json');

  console.log(`=== materials that moved: ${moves.size} ===`);
  [ ...moves.entries() ]
    .sort((a, b) => a[0] - b[0])
    .forEach(([ from, to ]) => console.log(`  a${from} -> a${to}  ${armors[to].name}`));

  if (lost.length > 0)
  {
    console.log(`\n=== ${lost.length} name(s) no longer present; these need a decision ===`);
    lost.forEach(material => console.log(`  was a${material.id} "${material.name}" (${material.payload})`));
  }

  const references = collectReferences(crafting, enemies, armors);
  const staleRecipes = references.recipes.filter(reference => moves.has(reference.id));
  const staleDrops = references.drops.filter(reference => moves.has(reference.id));

  console.log(`\n=== references needing a rewrite ===`);
  console.log(`  config.crafting.json: ${staleRecipes.length}`);
  console.log(`  enemy drop tags:      ${staleDrops.length}`);
};

/**
 * Rewrites every reference so it points where the material now lives.
 * @returns {Promise<void>}
 */
const runApply = async () =>
{
  const { moves } = await resolveMoves();

  const crafting = await readData('config.crafting.json');
  let recipeFixes = 0;

  crafting.recipes.forEach(recipe => [ 'ingredients', 'tools', 'outputs', 'cost' ].forEach(slot =>
  {
    (recipe[slot] ?? []).forEach(component =>
    {
      if (component.type !== 'a') return;
      if (moves.has(component.id) === false) return;

      component.id = moves.get(component.id);
      recipeFixes += 1;
    });
  }));

  await Bun.write(`${DATA_DIR}/config.crafting.json`, `${JSON.stringify(crafting, null, 2)}\n`);

  // enemy notes hold their drops as text, so only the lines whose tags change are rebuilt.
  const raw = await Bun.file(`${DATA_DIR}/Enemies.json`).text();
  const lines = raw.split('\n');
  let dropFixes = 0;

  lines.forEach((line, index) =>
  {
    if (line.startsWith('{"id":') === false) return;

    const hasComma = line.endsWith(',');
    const body = hasComma
      ? line.slice(0, -1)
      : line;

    const enemy = JSON.parse(body);
    const drops = armorDropsIn(enemy.note);
    const moving = drops.filter(drop => moves.has(drop.id));

    if (moving.length === 0) return;

    let note = enemy.note;
    moving.forEach(drop =>
    {
      const replacement = drop.raw.replace(/(<drops:\[\s*a\s*,\s*)(\d+)/i, `$1${moves.get(drop.id)}`);

      note = note.replace(drop.raw, replacement);
      dropFixes += 1;
    });

    enemy.note = note;

    const rebuilt = JSON.stringify(enemy);
    lines[index] = hasComma
      ? `${rebuilt},`
      : rebuilt;
  });

  await Bun.write(`${DATA_DIR}/Enemies.json`, lines.join('\n'));

  console.log(`rewrote ${recipeFixes} recipe component(s) and ${dropFixes} drop tag(s)`);
  console.log('run `plan` again to confirm nothing is left pointing at an old id.');
};

//endregion subcommands

const [ subcommand, outPath = DEFAULT_SNAPSHOT_PATH ] = process.argv.slice(2);

if (subcommand === 'snapshot')
{
  await runSnapshot(outPath);
}
else if (subcommand === 'plan')
{
  await runPlan();
}
else if (subcommand === 'apply')
{
  await runApply();
}
else
{
  console.log('usage: bun tools/armor-ids.js snapshot [outPath] | plan | apply');
}
