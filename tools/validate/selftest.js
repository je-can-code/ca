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
import { checkMapTree } from './checks/maptree.js';
import { checkNotetags } from './checks/notetags.js';
import { checkParse } from './checks/parse.js';
import { checkPlugins } from './checks/plugins.js';
import { checkScripts } from './checks/scripts.js';
import { checkSprites } from './checks/sprites.js';
import { checkStart, REAL_START } from './checks/start.js';
import { checkTextCodes } from './checks/textcodes.js';
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
 * A copy of the project with some of `System.json`'s fields replaced.
 *
 * `System.json` is one object rather than a table of rows, so {@link withRow} cannot plant into it.
 * @param {object} project The loaded project.
 * @param {object} fields The fields to replace, such as `{ startMapId: 359 }`.
 * @returns {object}
 */
const withSystem = (project, fields) =>
{
  const System = { ...project.tables.System, ...fields };

  return { ...project, tables: { ...project.tables, System } };
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
 * A copy of the project with one command added to the front of the first page of a map event.
 * @param {object} project The loaded project.
 * @param {number} mapId The map holding the event.
 * @param {number} eventId The event to add the command to.
 * @param {object} command The event command.
 * @returns {object}
 */
const withFirstPageCommand = (project, mapId, eventId, command) =>
{
  const map = project.maps.get(mapId);
  const event = map.events[eventId];
  const [ firstPage, ...otherPages ] = event.pages;

  const page = { ...firstPage, list: [ command, ...firstPage.list ] };
  const events = [ ...map.events ];
  events[eventId] = { ...event, pages: [ page, ...otherPages ] };

  const maps = new Map(project.maps);
  maps.set(mapId, { ...map, events });

  return { ...project, maps };
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
  withFirstPageCommand(project, mapId, eventId, { code: 108, indent: 0, parameters: [ line ] });

/**
 * A copy of the project with one message line added to the first page of a map event.
 * @param {object} project The loaded project.
 * @param {number} mapId The map holding the event.
 * @param {number} eventId The event to add the line to.
 * @param {string} line The message line, text codes and all.
 * @returns {object}
 */
const withMessageLine = (project, mapId, eventId, line) =>
  withFirstPageCommand(project, mapId, eventId, { code: 401, indent: 0, parameters: [ line ] });

/**
 * A copy of the project with a map event's note replaced.
 * @param {object} project The loaded project.
 * @param {number} mapId The map holding the event.
 * @param {number} eventId The event whose note to replace.
 * @param {string} note The new note.
 * @returns {object}
 */
const withEventNote = (project, mapId, eventId, note) =>
{
  const map = project.maps.get(mapId);
  const events = [ ...map.events ];
  events[eventId] = { ...map.events[eventId], note };

  const maps = new Map(project.maps);
  maps.set(mapId, { ...map, events });

  return { ...project, maps };
};

/**
 * A copy of the project with the sprite on a map event's first page replaced.
 * @param {object} project The loaded project.
 * @param {number} mapId The map holding the event.
 * @param {number} eventId The event to dress.
 * @param {string} characterName The sprite's name, as an event would spell it.
 * @returns {object}
 */
const withFirstPageSprite = (project, mapId, eventId, characterName) =>
{
  const map = project.maps.get(mapId);
  const event = map.events[eventId];
  const [ firstPage, ...otherPages ] = event.pages;

  const page = { ...firstPage, image: { ...firstPage.image, characterName } };
  const events = [ ...map.events ];
  events[eventId] = { ...event, pages: [ page, ...otherPages ] };

  const maps = new Map(project.maps);
  maps.set(mapId, { ...map, events });

  return { ...project, maps };
};

/**
 * The first row of a table that exists but was never authored, which is what a dead reference points
 * at. When the table has none, an id past its end serves just as well.
 * @param {object[]} rows The table.
 * @returns {number}
 */
const findBlankRowId = rows =>
{
  const blank = rows.findIndex((row, id) => id > 0 && row && row.name === '');

  return blank > 0
    ? blank
    : rows.length;
};

/**
 * The first row of a table that is real, for the near miss.
 * @param {object[]} rows The table.
 * @returns {number}
 */
const findRealRowId = rows => rows.findIndex((row, id) => id > 0 && row && row.name !== '' && row.name.startsWith('===') === false);

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
  const blankArmorId = findBlankRowId(tables.Armors);
  const realArmorId = findRealRowId(tables.Armors);

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

  // the boss controls work the first encounter's first body: its clone map template taken away, and
  // the body moved one tile past its arena's far edge and then onto the arena's last tile.
  const jabsConfig = project.configs.get('jabs');
  const [ encounter ] = jabsConfig.bosses;
  const [ body ] = encounter.participants;
  const arena = project.maps.get(encounter.map);
  const moveBody = (x, y) =>
  {
    const participants = encounter.participants.map(participant => participant === body ? { ...body, x, y } : participant);
    const bosses = jabsConfig.bosses.map(entry => entry === encounter ? { ...encounter, participants } : entry);

    return withConfig(project, 'jabs', { ...jabsConfig, bosses });
  };
  const withoutTemplate = templateId =>
  {
    const cloneMap = project.maps.get(project.enemyMapId);
    const maps = new Map(project.maps);
    maps.set(project.enemyMapId, { ...cloneMap, events: cloneMap.events.map((event, id) => id === templateId ? null : event) });

    return { ...project, maps };
  };

  // the near miss takes away a template the body does not spawn from: its neighbour's.
  const neighbourTemplateId = body.enemyId - 1;

  // the defeat switch controls re-aim that same encounter's switch: one past the last switch the game
  // has, then onto that last switch, then onto zero, which turns no switch on at all.
  const lastSwitchId = tables.System.switches.length - 1;
  const withDefeatSwitch = defeatSwitch =>
  {
    const bosses = jabsConfig.bosses.map(entry => entry === encounter ? { ...encounter, defeatSwitch } : entry);

    return withConfig(project, 'jabs', { ...jabsConfig, bosses });
  };

  // the reaction and step controls give that same encounter one planted change at a time.
  const withEncounter = patch =>
  {
    const bosses = jabsConfig.bosses.map(entry => entry === encounter ? { ...encounter, ...patch } : entry);

    return withConfig(project, 'jabs', { ...jabsConfig, bosses });
  };
  const withReaction = reaction => withEncounter({ reactions: [ reaction ] });
  const reactionTo = (on, participants, steps = []) => ({ key: 'planted', on, participants, steps });
  const [ routine ] = encounter.routines;
  const blankStateId = findBlankRowId(tables.States);
  const realStateId = findRealRowId(tables.States);
  const stateStep = state => ({ verb: 'addState', participant: body.key, state, expect: '' });
  const imageStep = image => ({ verb: 'changeImage', participant: body.key, image, index: 0 });

  // the template controls dress the body from another clone map event: one that is somebody else, then
  // its own slot named outright.
  const otherTemplateId = project.maps.get(project.enemyMapId).events
    .findIndex((event, id) => event && id !== body.enemyId && event.pages.length > 0
      && event.pages[0].list.some(command => /<enemyId: ?\d+>/i.test(command.parameters[0] ?? '')));
  const withTemplate = template => withEncounter({
    participants: encounter.participants.map(participant => participant === body ? { ...body, template } : participant),
  });

  // the spawn, tint, animation and dialogue controls plant one step each as the fight opens, then its near miss.
  const spawnStep = patch => ({ verb: 'spawn', enemyId: body.enemyId, expect: '', x: body.x, y: body.y, ...patch });
  const tintStep = tone => ({ verb: 'tint', tone, seconds: 2 });
  const realAnimationId = findRealRowId(tables.Animations);
  const missingAnimationId = tables.Animations.length;
  const animationStep = animation => ({ verb: 'animation', animation, expect: '' });
  const dialogueStep = lines => ({ verb: 'dialogue', speaker: 'Planted', lines });
  const blinkStep = patch => ({ verb: 'blink', x: body.x, y: body.y, direction: 0, animation: realAnimationId, ...patch });
  const realSkillId = findRealRowId(tables.Skills);

  const [ someBuiltFile ] = project.pluginFiles.keys();

  // the gate control needs any event on any map; the first one found will do.
  const [ gateMapId, gateMap ] = [ ...project.maps ].find(([ , map ]) => map.events.some(event => event && event.pages.length > 0));
  const gateEvent = gateMap.events.find(event => event && event.pages.length > 0);

  // the text-code controls speak on that same event: a line naming a row, a bubble, an icon, a colour.
  const blankItemId = findBlankRowId(tables.Items);
  const realItemId = findRealRowId(tables.Items);
  const blankSkillId = findBlankRowId(tables.Skills);
  const describedSkill = tables.Skills.find(skill => skill && skill.name !== '');
  const absentEventId = gateMap.events.length;
  const offSheetIcon = project.iconSheet
    ? project.iconSheet.drawn.length
    : 0;
  const speak = line => withMessageLine(project, gateMapId, gateEvent.id, line);

  // the script controls run on that same event, as a one-line Script command.
  const runScript = line => withFirstPageCommand(project, gateMapId, gateEvent.id, { code: 355, indent: 0, parameters: [ line ] });

  // the sprite controls dress that same event: in a name no file has, in a real sprite's name with its
  // case changed, which is the mistake only Linux refuses, and in a real sprite's name spelled exactly.
  const absentSprite = '$m_no-such-sprite';
  const realSprite = [ ...project.characterImages ]
    .find(name => /[a-z]/.test(name) && project.characterImages.has(name.toUpperCase()) === false);
  const wrongCaseSprite = realSprite.toUpperCase();
  const dress = characterName => withFirstPageSprite(project, gateMapId, gateEvent.id, characterName);
  const routeTo = characterName => withFirstPageCommand(project, gateMapId, gateEvent.id, {
    code: 205,
    indent: 0,
    parameters: [ 0, { list: [ { code: 41, parameters: [ characterName, 0 ] }, { code: 0, parameters: [] } ], repeat: false, skippable: false, wait: true } ],
  });

  // the actor control re-dresses the first actor in the table.
  const firstActor = tables.Actors.find(actor => actor !== null);

  // the start controls aim at a map that is neither the real start nor wherever this tree starts today,
  // so the planted finding is always new even on a branch that points at a test map.
  const strayStartMapId = [ ...project.maps.keys() ]
    .find(mapId => mapId !== REAL_START.mapId && mapId !== tables.System.startMapId);
  const startOn = (mapId, x, y) => withSystem(project, { startMapId: mapId, startX: x, startY: y });

  // the map tree controls move the first map in the table, by a half step and then by a whole one.
  const placedMap = tables.MapInfos.find(info => info !== null);
  const reorder = order => withRow(project, 'MapInfos', { ...placedMap, order });

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
      label: `the map editor's blueprint link in an event's note (Map #${gateMapId} event #${gateEvent.id})`,
      check: checkNotetags,
      planted: withEventNote(project, gateMapId, gateEvent.id, `${gateEvent.note}\n<blueprint:[k3x9q2mf, 2]>`),
      expect: null,
    },
    {
      label: 'the same link in an event comment line, where the editor never writes it',
      check: checkNotetags,
      planted: withEventComment(project, gateMapId, gateEvent.id, '<blueprint:[k3x9q2mf,2]>'),
      expect: [ 'page 1 comment', '<blueprint:[k3x9q2mf,2]>' ],
    },
    {
      label: 'a link the editor would refuse to read, <blueprint:[k3x9q2mf]>, in an event\'s note',
      check: checkNotetags,
      planted: withEventNote(project, gateMapId, gateEvent.id, `${gateEvent.note}\n<blueprint:[k3x9q2mf]>`),
      expect: [ 'note', '<blueprint:[k3x9q2mf]> matches no tag any plugin declares' ],
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
      label: `a boss body whose clone map template is gone (boss "${encounter.key}", event #${body.enemyId})`,
      check: checkConfigs,
      planted: withoutTemplate(body.enemyId),
      expect: [ `participant "${body.key}"`, `spawns from event #${body.enemyId}`, 'holds no such event' ],
    },
    {
      label: `the clone map missing its neighbouring template instead (event #${neighbourTemplateId})`,
      check: checkConfigs,
      planted: withoutTemplate(neighbourTemplateId),
      expect: null,
    },
    {
      label: `a boss body one tile past its arena's far edge (Map #${encounter.map} at (${arena.width}, ${arena.height - 1}))`,
      check: checkConfigs,
      planted: moveBody(arena.width, arena.height - 1),
      expect: [ `participant "${body.key}" appears at (${arena.width}, ${arena.height - 1})`, `outside Map #${encounter.map}` ],
    },
    {
      label: `the same body on its arena's last tile (${arena.width - 1}, ${arena.height - 1})`,
      check: checkConfigs,
      planted: moveBody(arena.width - 1, arena.height - 1),
      expect: null,
    },
    {
      label: `a boss turning on a switch past the last one (boss "${encounter.key}", switch #${lastSwitchId + 1})`,
      check: checkConfigs,
      planted: withDefeatSwitch(lastSwitchId + 1),
      expect: [ `boss "${encounter.key}" defeatSwitch`, `Switches #${lastSwitchId + 1}, which does not exist` ],
    },
    {
      label: `the same boss turning on the last switch instead (switch #${lastSwitchId})`,
      check: checkConfigs,
      planted: withDefeatSwitch(lastSwitchId),
      expect: null,
    },
    {
      label: 'the same boss turning no switch on at all (0)',
      check: checkConfigs,
      planted: withDefeatSwitch(0),
      expect: null,
    },
    {
      label: `a boss with no bodies at all (boss "${encounter.key}")`,
      check: checkConfigs,
      planted: withEncounter({ participants: [] }),
      expect: [ `boss "${encounter.key}" has no participants`, 'won the moment it starts' ],
    },
    {
      label: `a boss body dressed from a template that is another enemy (event #${otherTemplateId})`,
      check: checkConfigs,
      planted: withTemplate(otherTemplateId),
      expect: [ `participant "${body.key}" spawns from event #${otherTemplateId}`, `not #${body.enemyId}` ],
    },
    {
      label: `the same body naming its own slot as its template (event #${body.enemyId})`,
      check: checkConfigs,
      planted: withTemplate(body.enemyId),
      expect: null,
    },
    {
      label: 'a reaction to a moment no fight has ("fell")',
      check: checkConfigs,
      planted: withReaction(reactionTo('fell', [ body.key ])),
      expect: [ 'reaction "planted" answers "fell"', 'not a moment a fight has' ],
    },
    {
      label: 'a reaction to bodies falling that waits on nobody',
      check: checkConfigs,
      planted: withReaction(reactionTo('fallen', [])),
      expect: [ 'reaction "planted" waits on nobody falling' ],
    },
    {
      label: 'a reaction waiting on a body the fight does not have ("ghost")',
      check: checkConfigs,
      planted: withReaction(reactionTo('fallen', [ body.key, 'ghost' ])),
      expect: [ 'reaction "planted" waits on participant "ghost"', 'nobody by that name' ],
    },
    {
      label: `the same reaction waiting on the real body alone ("${body.key}")`,
      check: checkConfigs,
      planted: withReaction(reactionTo('fallen', [ body.key ])),
      expect: null,
    },
    {
      label: 'a step doing something the plugin does not implement ("teleport")',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ { verb: 'teleport' } ])),
      expect: [ 'reaction "planted" steps[0] does "teleport"', 'does not implement' ],
    },
    {
      label: 'a step acting on a body the fight does not have ("ghost")',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ { ...stateStep(realStateId), participant: 'ghost' } ])),
      expect: [ 'steps[0] acts on participant "ghost"', 'nobody by that name' ],
    },
    {
      label: `a step putting a blank state on the boss (state #${blankStateId})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ stateStep(blankStateId) ])),
      expect: [ 'reaction "planted" steps[0] state', `States #${blankStateId}` ],
    },
    {
      label: `the same step putting a real state on the boss instead (state #${realStateId})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ stateStep(realStateId) ])),
      expect: null,
    },
    {
      label: 'a step speeding up a routine the fight does not have ("rokcs")',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ { verb: 'quickenRoutine', routine: 'rokcs', seconds: 1 } ])),
      expect: [ 'steps[0] speeds up routine "rokcs"', 'no routine by that name' ],
    },
    {
      label: `the same step speeding up the fight's real routine ("${routine.key}")`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ { verb: 'quickenRoutine', routine: routine.key, seconds: 1 } ])),
      expect: null,
    },
    {
      label: 'a reaction to the boss being worn down to 0%, which a fight never passes through',
      check: checkConfigs,
      planted: withReaction({ ...reactionTo('health', []), below: 0 }),
      expect: [ 'reaction "planted" waits for health at or below 0%', 'no turning point' ],
    },
    {
      label: 'the same reaction waiting for the boss at 66% instead',
      check: checkConfigs,
      planted: withReaction({ ...reactionTo('health', []), below: 66 }),
      expect: null,
    },
    {
      label: `a spawn copied from a template that is another enemy (event #${otherTemplateId})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ spawnStep({ template: otherTemplateId }) ])),
      expect: [ `reaction "planted" steps[0] spawns from event #${otherTemplateId}`, `not #${body.enemyId}` ],
    },
    {
      label: `a spawn one tile past its arena's far edge (Map #${encounter.map} at (${arena.width}, 0))`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ spawnStep({ x: arena.width, y: 0 }) ])),
      expect: [ 'reaction "planted" steps[0] appears at', `outside Map #${encounter.map}` ],
    },
    {
      label: `the same spawn from its enemy's own slot, on the arena's last tile (${arena.width - 1}, ${arena.height - 1})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ spawnStep({ x: arena.width - 1, y: arena.height - 1 }) ])),
      expect: null,
    },
    {
      label: 'a tint missing its gray channel ([17, -68, -68])',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ tintStep([ 17, -68, -68 ]) ])),
      expect: [ 'reaction "planted" steps[0] tints the screen to [17,-68,-68]' ],
    },
    {
      label: 'a tint with a channel past the range ([300, 0, 0, 0])',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ tintStep([ 300, 0, 0, 0 ]) ])),
      expect: [ 'reaction "planted" steps[0] tints the screen to [300,0,0,0]' ],
    },
    {
      label: 'the same tint with all four channels in range ([17, -68, -68, 0])',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ tintStep([ 17, -68, -68, 0 ]) ])),
      expect: null,
    },
    {
      label: `an animation the database does not have (animation #${missingAnimationId})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ animationStep(missingAnimationId) ])),
      expect: [ 'reaction "planted" steps[0] animation', `Animations #${missingAnimationId}` ],
    },
    {
      label: `the same step playing a real animation instead (animation #${realAnimationId})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ animationStep(realAnimationId) ])),
      expect: null,
    },
    {
      label: 'a participant given nothing to say',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ dialogueStep([]) ])),
      expect: [ 'reaction "planted" steps[0] has a participant say nothing at all' ],
    },
    {
      label: 'the same participant given a line',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ dialogueStep([ 'BRING IT' ]) ])),
      expect: null,
    },
    {
      label: 'a blink facing a way no character can face (5)',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ blinkStep({ direction: 5 }) ])),
      expect: [ 'reaction "planted" steps[0] blinks to face 5' ],
    },
    {
      label: `a blink landing one tile past its arena's far edge (Map #${encounter.map} at (${arena.width}, 0))`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ blinkStep({ x: arena.width, y: 0 }) ])),
      expect: [ 'reaction "planted" steps[0] appears at', `outside Map #${encounter.map}` ],
    },
    {
      label: `the same blink landing on the arena's last tile, facing right (${arena.width - 1}, ${arena.height - 1})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ blinkStep({ x: arena.width - 1, y: arena.height - 1, direction: 6 }) ])),
      expect: null,
    },
    {
      label: `a skill learned from a blank row (skill #${blankSkillId})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ { verb: 'learnSkill', skill: blankSkillId, expect: '' } ])),
      expect: [ 'reaction "planted" steps[0] skill', `Skills #${blankSkillId}` ],
    },
    {
      label: `the same step learning a real skill instead (skill #${realSkillId})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ { verb: 'learnSkill', skill: realSkillId, expect: '' } ])),
      expect: null,
    },
    {
      label: 'a step starting a routine the fight does not have ("wavse")',
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ { verb: 'startRoutine', routine: 'wavse' } ])),
      expect: [ 'steps[0] starts routine "wavse"', 'no routine by that name' ],
    },
    {
      label: `a dormant routine nothing ever starts ("${routine.key}")`,
      check: checkConfigs,
      planted: withEncounter({ routines: [ { ...routine, dormant: true } ], reactions: [] }),
      expect: [ `routine "${routine.key}" is dormant, but no step ever starts it` ],
    },
    {
      label: `the same dormant routine, started as the fight opens ("${routine.key}")`,
      check: checkConfigs,
      planted: withEncounter({
        routines: [ { ...routine, dormant: true } ],
        reactions: [ reactionTo('start', [], [ { verb: 'startRoutine', routine: routine.key } ]) ],
      }),
      expect: null,
    },
    {
      label: `a spawn arriving in an animation the database does not have (animation #${missingAnimationId})`,
      check: checkConfigs,
      planted: withReaction(reactionTo('start', [], [ spawnStep({ animation: missingAnimationId }) ])),
      expect: [ 'reaction "planted" steps[0] animation', `Animations #${missingAnimationId}` ],
    },
    {
      label: 'a boss changing into a sprite with no file ("$m_planted-nothing")',
      check: checkSprites,
      planted: withReaction(reactionTo('start', [], [ imageStep('$m_planted-nothing') ])),
      expect: [ `boss "${encounter.key}" reaction "planted" steps[0] image`, 'img/characters has no $m_planted-nothing.png' ],
    },
    {
      label: 'the same boss changing into its own sprite instead',
      check: checkSprites,
      planted: withReaction(reactionTo('start', [], [ imageStep('$m_sin-gluttonwolf-mayor') ])),
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
    {
      label: `a message line naming a blank item row (Map #${gateMapId} event #${gateEvent.id}, \\Item[${blankItemId}])`,
      check: checkTextCodes,
      planted: speak(`I miss the days of \\Item[${blankItemId}].`),
      expect: [ `Map #${gateMapId}`, `event #${gateEvent.id}`, `\\Item[${blankItemId}] names Items #${blankItemId}` ],
    },
    {
      label: `the same line naming a real item row (Items #${realItemId})`,
      check: checkTextCodes,
      planted: speak(`I miss the days of \\Item[${realItemId}].`),
      expect: null,
    },
    {
      label: `a skill description naming a blank skill row (Skills #${describedSkill.id} -> Skills #${blankSkillId})`,
      check: checkTextCodes,
      planted: withRow(project, 'Skills', { ...describedSkill, description: `Enhances \\Skill[${blankSkillId}].` }),
      expect: [ `Skills #${describedSkill.id}`, `\\Skill[${blankSkillId}] names Skills #${blankSkillId}` ],
    },
    {
      label: `a bubble aimed at an event the map does not hold (\\pop[e${absentEventId}])`,
      check: checkTextCodes,
      planted: speak(`\\pop[e${absentEventId}]Over here.`),
      expect: [ `\\pop[e${absentEventId}] names event #${absentEventId}, which Map #${gateMapId} does not hold` ],
    },
    {
      label: 'a text code nothing reads, \\Itme[1]',
      check: checkTextCodes,
      planted: speak('Have an \\Itme[1].'),
      expect: [ '\\Itme[1] matches no text code' ],
    },
    {
      label: `an icon past the end of the sheet (\\I[${offSheetIcon}])`,
      check: checkTextCodes,
      planted: speak(`\\I[${offSheetIcon}] Shiny.`),
      expect: [ `\\I[${offSheetIcon}] names icon ${offSheetIcon}, which is off the sheet` ],
    },
    {
      label: 'a colour outside the windowskin palette, \\C[32]',
      check: checkTextCodes,
      planted: speak('\\C[32]Loud\\C[0].'),
      expect: [ '\\C[32] names colour 32, which is outside the windowskin palette' ],
    },
    {
      label: `a script spreading its values into a call (Map #${gateMapId} event #${gateEvent.id})`,
      check: checkScripts,
      planted: runScript('$gameParty.updateVariableWithCraftedCountByCategories(9, ...categories);'),
      expect: [ `Map #${gateMapId}`, `event #${gateEvent.id}`, 'spreads arguments into $gameParty.updateVariableWithCraftedCountByCategories()' ],
    },
    {
      label: 'the same values spread into an array the call takes whole',
      check: checkScripts,
      planted: runScript('$gameParty.updateVariableWithCraftedCountByCategories(9, [ ...categories ]);'),
      expect: null,
    },
    {
      label: 'an ellipsis inside a string a call is handed, $gameMessage.add(\'Loading...\')',
      check: checkScripts,
      planted: runScript('$gameMessage.add(\'Loading...\');'),
      expect: null,
    },
    {
      label: `an event wearing a sprite no file has (Map #${gateMapId} event #${gateEvent.id} -> "${absentSprite}")`,
      check: checkSprites,
      planted: dress(absentSprite),
      expect: [ `event #${gateEvent.id}`, `draws "${absentSprite}"`, `has no ${absentSprite}.png` ],
    },
    {
      label: `the same event wearing a real sprite with its case changed ("${wrongCaseSprite}" for "${realSprite}")`,
      check: checkSprites,
      planted: dress(wrongCaseSprite),
      expect: [ `event #${gateEvent.id}`, `draws "${wrongCaseSprite}"`, 'differs only by case' ],
    },
    {
      label: `the same event wearing that real sprite, spelled exactly ("${realSprite}")`,
      check: checkSprites,
      planted: dress(realSprite),
      expect: null,
    },
    {
      label: `a Set Movement Route changing the same event's sprite to one no file has ("${absentSprite}")`,
      check: checkSprites,
      planted: routeTo(absentSprite),
      expect: [ 'Set Movement Route', `draws "${absentSprite}"` ],
    },
    {
      label: `an actor whose walking sprite no file has (Actors #${firstActor.id} -> "${absentSprite}")`,
      check: checkSprites,
      planted: withRow(project, 'Actors', { ...firstActor, characterName: absentSprite }),
      expect: [ `Actors #${firstActor.id}`, `draws "${absentSprite}"` ],
    },
    {
      label: `a new game started on another map (Map #${strayStartMapId})`,
      check: checkStart,
      planted: startOn(strayStartMapId, REAL_START.x, REAL_START.y),
      expect: [ `starts a new game on Map #${strayStartMapId}`, 'Set the player\'s starting position back' ],
    },
    {
      label: `the real start map with the player one tile over (Map #${REAL_START.mapId} at (${REAL_START.x + 1}, ${REAL_START.y}))`,
      check: checkStart,
      planted: startOn(REAL_START.mapId, REAL_START.x + 1, REAL_START.y),
      expect: [ `starts a new game on Map #${REAL_START.mapId}`, `at (${REAL_START.x + 1}, ${REAL_START.y})` ],
    },
    {
      label: `the real start itself (Map #${REAL_START.mapId} at (${REAL_START.x}, ${REAL_START.y}))`,
      check: checkStart,
      planted: startOn(REAL_START.mapId, REAL_START.x, REAL_START.y),
      expect: null,
    },
    {
      label: `a map slotted into the tree at a half step (Map #${placedMap.id} at order ${placedMap.order + 0.5})`,
      check: checkMapTree,
      planted: reorder(placedMap.order + 0.5),
      expect: [ `Map #${placedMap.id}`, `at order ${placedMap.order + 0.5}` ],
    },
    {
      label: `the same map moved a whole step (Map #${placedMap.id} at order ${placedMap.order + 1})`,
      check: checkMapTree,
      planted: reorder(placedMap.order + 1),
      expect: null,
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