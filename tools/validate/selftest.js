/**
 * selftest — prove every check catches the bug it exists for, against the real project.
 *
 * A validator that reports a clean tree is indistinguishable from one that is quietly broken, so this
 * plants each kind of bug in memory, reruns the check, and demands exactly one new finding naming it.
 * Nothing on disk is touched. The dead-drop control is the one that matters most: it is the exact bug
 * that shipped 274 times, and a suite that cannot catch it on purpose has not been tested.
 *
 * Every resolution control is paired with a near miss - the same edit pointed at a row that does
 * exist - which must produce nothing. Without it, a check that flagged every id it saw would pass.
 */

import { checkConfigs } from './checks/configs.js';
import { checkHousekeeping } from './checks/housekeeping.js';
import { checkNotetags } from './checks/notetags.js';
import { checkParse } from './checks/parse.js';
import { checkPlugins } from './checks/plugins.js';
import { parseJson } from './project.js';

/**
 * An armor drop tag, with the armor id captured.
 * @type {RegExp}
 */
const ARMOR_DROP = /<drops:\[\s*a(?:rmor)?\s*,\s*(\d+)/i;

//region planting

/**
 * A copy of the project with one table row replaced.
 * @param {object} project The loaded project.
 * @param {string} table The table holding the row.
 * @param {object} row The replacement row, whose id says where it goes.
 * @returns {object}
 */
const withRow = (project, table, row) =>
{
  const rows = [ ...project.tables[table] ];
  rows[row.id] = row;

  return { ...project, tables: { ...project.tables, [table]: rows } };
};

/**
 * A copy of the project with one plugin config replaced.
 * @param {object} project The loaded project.
 * @param {string} name The config's name, such as `crafting`.
 * @param {object} config The replacement config.
 * @returns {object}
 */
const withConfig = (project, name, config) =>
{
  const configs = new Map(project.configs);
  configs.set(name, config);

  return { ...project, configs };
};

/**
 * A copy of the project with its mirrored plugin list rewritten.
 * @param {object} project The loaded project.
 * @param {(files: Map<string, string>) => void} edit Changes the copied list in place.
 * @returns {object}
 */
const withPluginFiles = (project, edit) =>
{
  const pluginFiles = new Map(project.pluginFiles);
  edit(pluginFiles);

  return { ...project, pluginFiles };
};

/**
 * A copy of the project with one comment line added to the first page of a map event.
 * @param {object} project The loaded project.
 * @param {number} mapId The map holding the event.
 * @param {number} eventId The event to add the line to.
 * @param {string} line The comment line.
 * @returns {object}
 */
const withEventComment = (project, mapId, eventId, line) =>
{
  const map = project.maps.get(mapId);
  const event = map.events[eventId];
  const [ firstPage, ...otherPages ] = event.pages;

  const page = { ...firstPage, list: [ { code: 108, indent: 0, parameters: [ line ] }, ...firstPage.list ] };
  const events = [ ...map.events ];
  events[eventId] = { ...event, pages: [ page, ...otherPages ] };

  const maps = new Map(project.maps);
  maps.set(mapId, { ...map, events });

  return { ...project, maps };
};

/**
 * The first armor row that exists but was never authored, which is what a dead drop points at. When
 * the table has none, an id past its end serves just as well.
 * @param {object[]} armors The armor table.
 * @returns {number}
 */
const findBlankArmorId = armors =>
{
  const blank = armors.findIndex((row, id) => id > 0 && row && row.name === '');

  return blank > 0
    ? blank
    : armors.length;
};

/**
 * The first armor row that is real, for the near miss.
 * @param {object[]} armors The armor table.
 * @returns {number}
 */
const findRealArmorId = armors => armors.findIndex((row, id) => id > 0 && row && row.name !== '');

//endregion planting

/**
 * The findings a check produces on a planted project that it did not produce on the real one.
 * @param {Function} check The check to rerun.
 * @param {object} project The real project.
 * @param {object} planted The planted copy.
 * @returns {string[]}
 */
const newFindings = (check, project, planted) =>
{
  const before = new Set(check(project).findings);

  return check(planted).findings.filter(finding => before.has(finding) === false);
};

/**
 * Builds every control against the real project. Each one names what it plants, the check that must
 * notice, the planted copy, and the pieces of text the one new finding must contain - or none at all
 * for a near miss, which must produce nothing.
 * @param {object} project The loaded project.
 * @returns {{ label: string, check: Function, planted: object, expect: string[] | null }[]}
 */
const buildControls = project =>
{
  const { tables } = project;
  const blankArmorId = findBlankArmorId(tables.Armors);
  const realArmorId = findRealArmorId(tables.Armors);

  // any enemy that already drops an armor is a real row to re-aim at a dead one.
  const dropper = tables.Enemies.find(enemy => enemy && ARMOR_DROP.test(enemy.note));
  const [ dropTag, droppedId ] = ARMOR_DROP.exec(dropper.note);
  const reaim = armorId => ({ ...dropper, note: dropper.note.replace(dropTag, dropTag.replace(droppedId, String(armorId))) });

  // the crafting control needs an exact-row armor output, the shape of four hundred real slots.
  const crafting = project.configs.get('crafting');
  const recipe = crafting.recipes.find(entry => entry.outputs.some(output => output.type === 'a' && output.categories.length === 0));
  const outputIndex = recipe.outputs.findIndex(output => output.type === 'a' && output.categories.length === 0);
  const withOutput = armorId =>
  {
    const outputs = recipe.outputs.map((output, index) => index === outputIndex ? { ...output, id: armorId } : output);
    const recipes = crafting.recipes.map(entry => entry === recipe ? { ...recipe, outputs } : entry);

    return withConfig(project, 'crafting', { ...crafting, recipes });
  };

  const [ someBuiltFile ] = project.pluginFiles.keys();

  // the gate control needs any event on any map; the first one found will do.
  const [ gateMapId, gateMap ] = [ ...project.maps ].find(([ , map ]) => map.events.some(event => event && event.pages.length > 0));
  const gateEvent = gateMap.events.find(event => event && event.pages.length > 0);

  return [
    {
      label: `a drop re-aimed at a blank armor row (Enemies #${dropper.id} -> Armors #${blankArmorId})`,
      check: checkNotetags,
      planted: withRow(project, 'Enemies', reaim(blankArmorId)),
      expect: [ `Enemies #${dropper.id}`, `names Armors #${blankArmorId}` ],
    },
    {
      label: `the same drop re-aimed at a real armor row (Armors #${realArmorId})`,
      check: checkNotetags,
      planted: withRow(project, 'Enemies', reaim(realArmorId)),
      expect: null,
    },
    {
      label: 'a typo\'d tag, <sght:5>',
      check: checkNotetags,
      planted: withRow(project, 'Enemies', { ...dropper, note: `${dropper.note}\n<sght:5>` }),
      expect: [ `Enemies #${dropper.id}`, '<sght:5> matches no tag any plugin declares' ],
    },
    {
      label: 'a known tag with a payload its pattern rejects, <drops:[z,1,10]>',
      check: checkNotetags,
      planted: withRow(project, 'Enemies', { ...dropper, note: `${dropper.note}\n<drops:[z,1,10]>` }),
      expect: [ '<drops:[z,1,10]> matches none of the patterns declared for <drops>' ],
    },
    {
      label: `an event comment line J-Base's gate drops, <text:salt & pepper> (Map #${gateMapId} event #${gateEvent.id})`,
      check: checkNotetags,
      planted: withEventComment(project, gateMapId, gateEvent.id, '<text:salt & pepper>'),
      expect: [ '"<text:salt & pepper>" never reaches a plugin' ],
    },
    {
      label: 'the same line spelled so the gate lets it through, <text:salt and pepper>',
      check: checkNotetags,
      planted: withEventComment(project, gateMapId, gateEvent.id, '<text:salt and pepper>'),
      expect: null,
    },
    {
      label: `a crafting output re-aimed at a blank armor row (recipe "${recipe.key}")`,
      check: checkConfigs,
      planted: withOutput(blankArmorId),
      expect: [ `recipe "${recipe.key}" outputs[${outputIndex}]`, `names Armors #${blankArmorId}` ],
    },
    {
      label: 'the same crafting output re-aimed at a real armor row',
      check: checkConfigs,
      planted: withOutput(realArmorId),
      expect: null,
    },
    {
      label: 'a mirrored plugin no build produced',
      check: checkPlugins,
      planted: withPluginFiles(project, files => files.set('planted/J-Planted.js', 'a planted hash')),
      expect: [ 'planted/J-Planted.js is not part of the build' ],
    },
    {
      label: `a mirrored plugin edited by hand (${someBuiltFile})`,
      check: checkPlugins,
      planted: withPluginFiles(project, files => files.set(someBuiltFile, 'a planted hash')),
      expect: [ `${someBuiltFile} differs from the build` ],
    },
    {
      label: `a built plugin that was never mirrored (${someBuiltFile})`,
      check: checkPlugins,
      planted: withPluginFiles(project, files => files.delete(someBuiltFile)),
      expect: [ `${someBuiltFile} is missing` ],
    },
    {
      label: 'a committed backup, Planted.old.json',
      check: checkHousekeeping,
      planted: { ...project, trackedFiles: [ ...project.trackedFiles, 'chef-adventure/data/Planted.old.json' ] },
      expect: [ 'Planted.old.json is a committed backup (*.old.json)' ],
    },
    {
      label: 'a committed backup, Planted.json.bak',
      check: checkHousekeeping,
      planted: { ...project, trackedFiles: [ ...project.trackedFiles, 'chef-adventure/data/Planted.json.bak' ] },
      expect: [ 'Planted.json.bak is a committed backup (*.bak*)' ],
    },
    {
      label: 'a committed backup, Planted.backup-0922.json',
      check: checkHousekeeping,
      planted: { ...project, trackedFiles: [ ...project.trackedFiles, 'chef-adventure/data/Planted.backup-0922.json' ] },
      expect: [ 'Planted.backup-0922.json is a committed backup (*.backup*)' ],
    },
    {
      label: 'a file merely named like one, inside a folder named like one (drafts.bak/Bakery.png)',
      check: checkHousekeeping,
      planted: { ...project, trackedFiles: [ ...project.trackedFiles, 'docs/drafts.bak/Bakery.png' ] },
      expect: null,
    },
    {
      label: 'a data file that does not parse',
      check: checkParse,
      planted: { ...project, parseFailures: [ { file: 'Planted.json', error: parseJson('{"truncated": [1, 2').error } ] },
      expect: [ 'Planted.json does not parse' ],
    },
  ];
};

/**
 * Judges one control.
 * @param {object} project The real project.
 * @param {object} control The control to judge.
 * @returns {string} Why the control failed; empty when it behaved.
 */
const judgeControl = (project, control) =>
{
  const found = newFindings(control.check, project, control.planted);

  // a near miss must leave the findings exactly as they were.
  if (control.expect === null)
  {
    return found.length === 0
      ? ''
      : `expected no new finding, got: ${found.join(' | ')}`;
  }

  if (found.length !== 1) return `expected exactly one new finding, got ${found.length}: ${found.join(' | ')}`;

  const missing = control.expect.filter(piece => found[0].includes(piece) === false);

  return missing.length === 0
    ? ''
    : `the finding "${found[0]}" does not mention ${missing.map(piece => `"${piece}"`).join(', ')}`;
};

/**
 * Runs every control and reports each one.
 * @param {object} project The loaded project.
 * @returns {number} Exit code - 0 when every control behaved, 1 otherwise.
 */
export const runSelftest = project =>
{
  // the parser itself has to reject a truncated file before the parse control means anything.
  if (parseJson('{"truncated": [1, 2').error === '') throw new Error('selftest: a truncated file parsed without complaint.');

  const controls = buildControls(project);
  let failed = 0;

  controls.forEach(control =>
  {
    const problem = judgeControl(project, control);

    if (problem === '')
    {
      console.log(`  ok    ${control.label}`);

      return;
    }

    failed++;
    console.log(`  FAIL  ${control.label}\n        ${problem}`);
  });

  console.log(failed === 0
    ? `validate selftest: OK (${controls.length} control(s), every planted bug caught, every near miss left alone).`
    : `validate selftest: FAILED (${failed} of ${controls.length} control(s)).`);

  return failed === 0
    ? 0
    : 1;
};