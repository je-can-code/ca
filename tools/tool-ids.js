/**
 * tool-ids — capture where every crafting tool is referenced, then work out what moved.
 *
 * Crafting tools are ordinary items that recipes require and never consume, and their ids are spread
 * across three unrelated places: the item rows themselves, every recipe's `tools` array, and the map
 * events that sell or grant them. Renumbering the tool block therefore cannot be done by editing one
 * file, and a missed reference does not error - the shop simply starts selling the wrong thing.
 *
 * So the remap is done against **names**, never ids. `snapshot` records what each id meant at a moment
 * in time; `plan` reads the same references back afterwards and reports which ones now point somewhere
 * else. Neither subcommand writes to `chef-adventure/data`.
 *
 * Usage:
 *   bun tools/tool-ids.js snapshot [outPath]   # default docs/food/backup-tools.json
 *   bun tools/tool-ids.js plan                 # what moved, and which references were left behind
 *   bun tools/tool-ids.js diff <before> <after>
 *
 * `diff` is the check that proves a finished rewrite. `plan` reporting zero is ambiguous - it says the
 * same thing whether nothing moved or everything was rewritten correctly - so after applying a remap,
 * snapshot to a second path and diff the two. Every reference must resolve to the same tool name in the
 * same order while the ids underneath differ.
 */

const ROOT = `${import.meta.dir}/..`;
const DATA_DIR = `${ROOT}/chef-adventure/data`;
const DEFAULT_SNAPSHOT_PATH = `${ROOT}/docs/food/backup-tools.json`;

/**
 * Marks a name that could not be resolved to a real row.
 *
 * These must never be treated as ordinary names: an unresolvable name looks exactly like a reference
 * that needs no rewrite, so a blank tool slot would otherwise sail through every check unexamined.
 * @type {string}
 */
const UNRESOLVED_PREFIX = '<<';

//region data loading

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
 * Every map file that actually exists on disk, paired with the id it belongs to.
 *
 * `MapInfos.json` lists tree nodes rather than files, and grouping nodes have no map of their own, so
 * the existence check is load-bearing rather than defensive.
 * @returns {Promise<Array<{ mapId: number, filename: string, map: any }>>}
 */
const readAllMaps = async () =>
{
  const infos = await readData('MapInfos.json');
  const maps = [];

  for (const info of infos)
  {
    if (!info) continue;

    const filename = `Map${String(info.id).padStart(3, '0')}.json`;
    const file = Bun.file(`${DATA_DIR}/${filename}`);

    if (!(await file.exists())) continue;

    maps.push({
      mapId: info.id,
      filename,
      map: JSON.parse(await file.text()),
    });
  }

  return maps;
};

//endregion data loading

//region reference collection

/**
 * The item ids that any recipe treats as a tool.
 *
 * This is the honest definition of "tool" - membership is decided by how the data uses an item, not by
 * a hand-kept list that would drift the moment a new tool is authored.
 * @param {any} crafting The parsed `config.crafting.json`.
 * @returns {Set<number>}
 */
const collectToolIds = crafting =>
{
  const ids = new Set();

  crafting.recipes.forEach(recipe => recipe.tools.forEach(tool =>
  {
    // only item-type tools exist today, and a weapon-type tool would need its own name lookup.
    if (tool.type === 'i') ids.add(tool.id);
  }));

  return ids;
};

/**
 * Every place a recipe names a tool, addressed precisely enough to rewrite later.
 * @param {any} crafting The parsed `config.crafting.json`.
 * @param {any[]} items The parsed `Items.json`.
 * @returns {Array<object>}
 */
const collectRecipeReferences = (crafting, items) =>
{
  const references = [];

  crafting.recipes.forEach(recipe => recipe.tools.forEach((tool, toolIndex) =>
  {
    if (tool.type !== 'i') return;

    references.push({
      site: 'recipe',
      recipeKey: recipe.key,
      toolIndex,
      id: tool.id,
      name: nameOf(items, tool.id),
    });
  }));

  return references;
};

/**
 * Every place a map event names a tool, addressed by command index so a rewrite lands exactly.
 *
 * Two command shapes carry an item id in a different slot: shop goods keep it in the second parameter
 * behind a type discriminator, while Change Items keeps it in the first.
 * @param {Array<{ mapId: number, filename: string, map: any }>} maps Every map that exists on disk.
 * @param {any[]} items The parsed `Items.json`.
 * @param {Set<number>} toolIds The ids being tracked.
 * @returns {Array<object>}
 */
const collectMapReferences = (maps, items, toolIds) =>
{
  const references = [];

  maps.forEach(({ mapId, filename, map }) => (map.events || []).forEach(event =>
  {
    if (!event) return;

    event.pages.forEach((page, pageIndex) => page.list.forEach((command, commandIndex) =>
    {
      const parameters = command.parameters;
      const isShopGoods = command.code === 302 || command.code === 605;

      // shop goods: [ goodsType, id, priceType, price, purchaseOnly ], where goodsType 0 means item.
      if (isShopGoods && parameters[0] === 0 && toolIds.has(parameters[1]))
      {
        references.push({
          site: 'map',
          kind: 'shopGoods',
          filename,
          mapId,
          eventId: event.id,
          eventName: event.name,
          pageIndex,
          commandIndex,
          code: command.code,
          parameterIndex: 1,
          id: parameters[1],
          name: nameOf(items, parameters[1]),
        });
      }

      // change items: [ id, operation, operandType, operand ].
      if (command.code === 126 && toolIds.has(parameters[0]))
      {
        references.push({
          site: 'map',
          kind: 'changeItems',
          filename,
          mapId,
          eventId: event.id,
          eventName: event.name,
          pageIndex,
          commandIndex,
          code: command.code,
          parameterIndex: 0,
          id: parameters[0],
          name: nameOf(items, parameters[0]),
        });
      }
    }));
  }));

  return references;
};

/**
 * The display name of an item row, or a loud placeholder when the row is blank.
 * @param {any[]} items The parsed `Items.json`.
 * @param {number} id The item id to resolve.
 * @returns {string}
 */
const nameOf = (items, id) =>
{
  const row = items[id];

  if (!row) return `<<NO ROW AT ${id}>>`;
  if (row.name === '') return `<<UNNAMED ROW AT ${id}>>`;

  return row.name;
};

//endregion reference collection

//region subcommands

/**
 * Writes the snapshot that a later remap is checked against.
 *
 * The full item row is kept rather than just the name, because a tool may be renamed in the same pass
 * that moves it - and when a name no longer resolves, the icon and description are what identify the
 * row it became.
 * @param {string} outPath Where to write the snapshot.
 * @returns {Promise<void>}
 */
const runSnapshot = async outPath =>
{
  const items = await readData('Items.json');
  const crafting = await readData('config.crafting.json');
  const maps = await readAllMaps();

  const toolIds = collectToolIds(crafting);
  const sorted = [ ...toolIds ].sort((a, b) => a - b);

  const recipeReferences = collectRecipeReferences(crafting, items);
  const mapReferences = collectMapReferences(maps, items, toolIds);

  const snapshot = {
    _backup: 'Crafting tool item rows and every reference to them, captured before the tool ids were reorganised.',
    _captured: '2026-08-10',
    _source: 'chef-adventure/data/Items.json, config.crafting.json, Map*.json',
    _scope: 'All crafting tools, across every profession - not cooking only. A tool is any item a recipe requires without consuming.',
    _howToRemap: 'Run `bun tools/tool-ids.js plan` after moving the ids. It resolves each recorded name to its new id and lists every reference still pointing at the old one.',
    _counts: {
      tools: sorted.length,
      recipeReferences: recipeReferences.length,
      mapReferences: mapReferences.length,
    },
    tools: sorted.map(id =>
    {
      const row = items[id];

      return {
        id,
        name: row.name,
        iconIndex: row.iconIndex,
        price: row.price,
        description: row.description,
        note: row.note,
      };
    }),
    references: {
      recipes: recipeReferences,
      maps: mapReferences,
    },
  };

  await Bun.write(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(`wrote ${outPath}`);
  console.log(`  tools:             ${snapshot._counts.tools}`);
  console.log(`  recipe references: ${snapshot._counts.recipeReferences}`);
  console.log(`  map references:    ${snapshot._counts.mapReferences}`);
  console.log();
  snapshot.tools.forEach(tool => console.log(`  i${tool.id}  ${tool.name}`));

  const allReferences = [ ...recipeReferences, ...mapReferences ];
  const unnamed = allReferences.filter(reference => reference.name.startsWith(UNRESOLVED_PREFIX));

  // a reference pointing at a blank row cannot be verified later, so say so now rather than at remap time.
  if (unnamed.length > 0)
  {
    console.log();
    console.log(`WARNING: ${unnamed.length} reference(s) point at a blank or unnamed row and cannot be name-checked:`);
    unnamed.forEach(reference => console.log(`  ${reference.name}`));
  }
};

/**
 * Reports what the snapshot's names mean now, and which references were left behind.
 *
 * A reference is stale when the id recorded for it no longer resolves to the name recorded with it.
 * That is the only test that matters, and it catches the failure a pure id comparison cannot: a
 * renumber applied consistently to the wrong rows.
 * @returns {Promise<void>}
 */
const runPlan = async () =>
{
  const snapshotFile = Bun.file(DEFAULT_SNAPSHOT_PATH);

  if (!(await snapshotFile.exists()))
  {
    console.log(`no snapshot at ${DEFAULT_SNAPSHOT_PATH} - run \`bun tools/tool-ids.js snapshot\` first.`);
    return;
  }

  const snapshot = JSON.parse(await snapshotFile.text());
  const items = await readData('Items.json');

  // build name -> current id from the live rows, so a moved tool is found wherever it landed.
  const currentIdByName = new Map();
  items.forEach(row =>
  {
    if (!row) return;
    if (row.name === '') return;

    currentIdByName.set(row.name, row.id);
  });

  console.log('=== tool id movement ===');

  const movement = new Map();
  const unresolved = [];

  snapshot.tools.forEach(tool =>
  {
    const currentId = currentIdByName.get(tool.name);

    if (currentId === undefined)
    {
      unresolved.push(tool);
      console.log(`  i${tool.id}  ${tool.name.padEnd(24)} -> NOT FOUND (renamed or removed)`);
      return;
    }

    movement.set(tool.id, currentId);

    const marker = currentId === tool.id ? 'unchanged' : `-> i${currentId}`;
    console.log(`  i${tool.id}  ${tool.name.padEnd(24)} ${marker}`);
  });

  if (unresolved.length > 0)
  {
    console.log();
    console.log(`${unresolved.length} tool name(s) no longer resolve. These need a decision before any rewrite:`);
    unresolved.forEach(tool => console.log(`  was i${tool.id} "${tool.name}" (icon ${tool.iconIndex})`));
  }

  const allReferences = [ ...snapshot.references.recipes, ...snapshot.references.maps ];

  // separate the references that cannot be judged at all, so they are never mistaken for passing ones.
  const uncheckable = allReferences.filter(reference =>
  {
    if (reference.name.startsWith(UNRESOLVED_PREFIX)) return true;

    return !currentIdByName.has(reference.name);
  });

  const stale = allReferences.filter(reference =>
  {
    const expected = currentIdByName.get(reference.name);

    // a reference is stale when the slot it lives in no longer means what it meant.
    return expected !== undefined && expected !== reference.id;
  });

  if (uncheckable.length > 0)
  {
    console.log();
    console.log(`=== ${uncheckable.length} reference(s) cannot be checked ===`);
    console.log('  their recorded name resolves to no current row, so nothing here has been verified.');
    [ ...new Set(uncheckable.map(reference => reference.name)) ].forEach(name => console.log(`    ${name}`));
  }

  console.log();
  console.log('=== references needing a rewrite ===');
  console.log(`  ${stale.length} of ${allReferences.length}`);

  const byRecipe = stale.filter(reference => reference.site === 'recipe');
  const byMap = stale.filter(reference => reference.site === 'map');

  console.log(`  config.crafting.json: ${byRecipe.length}`);
  console.log(`  map events:           ${byMap.length}`);

  byMap.forEach(reference =>
  {
    const target = currentIdByName.get(reference.name);

    console.log(`    ${reference.filename} ev${reference.eventId} pg${reference.pageIndex + 1} cmd${reference.commandIndex}  ${reference.kind}  i${reference.id} -> i${target}  (${reference.name})`);
  });
};

/**
 * Proves a finished rewrite preserved meaning, by comparing two snapshots on names alone.
 *
 * Every reference must resolve to the same tool in the same order across both files. Ids are expected
 * to differ - that is the point of the exercise - so they are deliberately not compared. This is the
 * check `plan` cannot perform: a zero from `plan` reads identically whether nothing moved or the whole
 * remap landed correctly.
 * @param {string} beforePath The snapshot taken before the ids were moved.
 * @param {string} afterPath The snapshot taken after the rewrite was applied.
 * @returns {Promise<void>}
 */
const runDiff = async (beforePath, afterPath) =>
{
  const before = JSON.parse(await Bun.file(beforePath).text());
  const after = JSON.parse(await Bun.file(afterPath).text());

  /**
   * Flattens a snapshot's references into one comparable line per site.
   * @param {any} snapshot A parsed snapshot.
   * @returns {string[]}
   */
  const fingerprint = snapshot =>
  {
    const recipes = snapshot.references.recipes.map(r => `recipe ${r.recipeKey}#${r.toolIndex} = ${r.name}`);
    const maps = snapshot.references.maps.map(r =>
      `map ${r.filename} ev${r.eventId} pg${r.pageIndex} cmd${r.commandIndex} = ${r.name}`);

    return [ ...recipes, ...maps ];
  };

  const beforeLines = fingerprint(before);
  const afterLines = fingerprint(after);

  console.log(`before: ${beforeLines.length} references`);
  console.log(`after:  ${afterLines.length} references`);

  if (beforeLines.length !== afterLines.length)
  {
    console.log('MISMATCH: the two snapshots hold a different number of references.');
  }

  const mismatches = [];
  const limit = Math.min(beforeLines.length, afterLines.length);

  for (let index = 0; index < limit; index++)
  {
    if (beforeLines[index] !== afterLines[index])
    {
      mismatches.push(`  [${index}]\n    before: ${beforeLines[index]}\n    after:  ${afterLines[index]}`);
    }
  }

  console.log();

  if (mismatches.length === 0 && beforeLines.length === afterLines.length)
  {
    console.log('PASS - every reference resolves to the same tool, in the same order.');
    return;
  }

  console.log(`FAIL - ${mismatches.length} reference(s) changed meaning:`);
  mismatches.forEach(line => console.log(line));
};

//endregion subcommands

const [ subcommand, first, second ] = process.argv.slice(2);

if (subcommand === 'snapshot')
{
  await runSnapshot(first ?? DEFAULT_SNAPSHOT_PATH);
}
else if (subcommand === 'plan')
{
  await runPlan();
}
else if (subcommand === 'diff')
{
  if (!first || !second)
  {
    console.log('usage: bun tools/tool-ids.js diff <beforePath> <afterPath>');
  }
  else
  {
    await runDiff(first, second);
  }
}
else
{
  console.log('usage: bun tools/tool-ids.js snapshot [outPath] | plan | diff <before> <after>');
}
