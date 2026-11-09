/**
 * configs — every id a plugin config names in an MZ-owned table, resolved against that table.
 *
 * jmz-data-editor writes the `config.*.json` files and keeps them consistent within themselves, so
 * nothing here re-checks a rule the editor already enforces on save: a recipe's category keys, a
 * quest's prerequisite keys, anything that points from one config row to another. Every duplicated
 * rule is a second place to update when the schema moves, and the copy in CI is the one that gets
 * forgotten.
 *
 * What the editor cannot police is the far end of an id. The rows these configs name live in tables
 * RPG Maker MZ owns, and MZ has never heard of a config file - it will blank, renumber or rename a row
 * that four thousand crafting slots still point at, and nothing notices. That seam is this check.
 *
 * Two rules live here because they live nowhere else:
 *
 * - **A crafting slot with categories names no row.** `"id": 0` beside a non-empty `categories` list
 *   is the category-match form - "anything carrying these ingredient types" - so its id is not read.
 *   With `categories` empty, the slot names one exact row and its id must resolve.
 * - **A quest objective only reads the fulfillment block for its own type.** Every objective carries
 *   all five blocks, and the ones for other types hold whatever the editor left in them. The plugin
 *   never reads those, so neither does this.
 */

import { resolveReference, TYPE_LETTER_TABLES } from '../resolve.js';

/**
 * A quest fetch objective names its table with a number rather than a letter.
 * @type {Object<number, string>}
 */
const FETCH_TYPE_TABLES = {
  0: 'Items',
  1: 'Weapons',
  2: 'Armors',
};

/**
 * Collects findings for one config, prefixing each with where in the config it came from.
 */
class Findings
{
  /**
   * Every finding recorded so far.
   * @type {string[]}
   */
  lines = [];

  /**
   * How many references were resolved, successfully or not.
   * @type {number}
   */
  checked = 0;

  /**
   * Resolves one reference and records a finding when it fails.
   * @param {object} project The loaded project.
   * @param {string} where Where the reference lives, for the report.
   * @param {string} table The table it points into.
   * @param {number|string} value The id.
   * @param {{ allowZero?: boolean }} [options] Whether zero means "none".
   */
  resolve(project, where, table, value, options = {})
  {
    this.checked++;

    const unresolved = resolveReference(project, table, value, options);
    if (unresolved !== '') this.lines.push(`${where} names ${unresolved}`);
  }

  /**
   * Records a finding that is not a failed lookup, such as a value no table answers to.
   * @param {string} line The finding.
   */
  add(line)
  {
    this.lines.push(line);
  }
}

/**
 * Resolves a component that names a row by type letter and id, as crafting and knowledge do.
 * @param {object} project The loaded project.
 * @param {Findings} findings Where failures go.
 * @param {string} where Where the component lives.
 * @param {{ id: number, type: string }} component The component.
 */
const resolveLettered = (project, findings, where, component) =>
{
  const table = TYPE_LETTER_TABLES[component.type];

  if (!table)
  {
    findings.add(`${where} has type "${component.type}", which names no table (expected i, w or a)`);

    return;
  }

  findings.resolve(project, where, table, component.id);
};

//region per config

/**
 * Crafting: every exact-row slot of every recipe, and every profession's scrap item.
 * @param {object} project The loaded project.
 * @param {object} crafting The parsed `config.crafting.json`.
 * @param {Findings} findings Where failures go.
 */
const checkCrafting = (project, crafting, findings) =>
{
  crafting.recipes.forEach(recipe =>
  {
    [ 'tools', 'ingredients', 'outputs', 'cost' ].forEach(slot => recipe[slot].forEach((component, index) =>
    {
      // a slot carrying categories matches by ingredient type, and its id is never read.
      if (component.categories.length > 0) return;

      resolveLettered(project, findings, `config.crafting.json recipe "${recipe.key}" ${slot}[${index}]`, component);
    }));
  });

  // a profession that sells nothing records its scrap item as 0.
  crafting.professions.forEach(profession => findings.resolve(project,
    `config.crafting.json profession "${profession.key}" scrapItemId`, 'Items', profession.scrapItemId, { allowZero: true }));
};

/**
 * Quests: the one fulfillment block each objective's type actually reads.
 * @param {object} project The loaded project.
 * @param {object} quest The parsed `config.quest.json`.
 * @param {Findings} findings Where failures go.
 */
const checkQuests = (project, quest, findings) =>
{
  quest.quests.forEach(entry => entry.objectives.forEach(objective =>
  {
    const where = `config.quest.json quest "${entry.key}" objective #${objective.id}`;
    const { fetch, slay, destination } = objective.fulfillment;

    switch (objective.type)
    {
      case 'Fetch':
      {
        const table = FETCH_TYPE_TABLES[fetch.type];

        if (table)
        {
          findings.resolve(project, `${where} fetch`, table, fetch.id);
        }
        else
        {
          findings.add(`${where} fetch has type ${fetch.type}, which names no table (expected 0, 1 or 2)`);
        }

        break;
      }

      case 'Slay':
        findings.resolve(project, `${where} slay`, 'Enemies', slay.id);
        break;

      case 'Destination':
        findings.resolve(project, `${where} destination`, 'Maps', destination.mapId);
        break;

      // indiscriminate objectives are event-driven, and quest objectives point at other quests.
      default:
        break;
    }
  }));
};

/**
 * SDP: every panel's mastery skill. A panel enrolled in no subgroup records 0.
 * @param {object} project The loaded project.
 * @param {object} sdp The parsed `config.sdp.json`.
 * @param {Findings} findings Where failures go.
 */
const checkSdp = (project, sdp, findings) =>
{
  sdp.sdps.forEach(panel => findings.resolve(project,
    `config.sdp.json panel "${panel.key}" masterySkillId`, 'Skills', panel.mastery.masterySkillId, { allowZero: true }));
};

/**
 * Proficiency: who a conditional applies to, what it requires, what it rewards, and what knowledge
 * buys.
 * @param {object} project The loaded project.
 * @param {object} proficiency The parsed `config.proficiency.json`.
 * @param {Findings} findings Where failures go.
 */
const checkProficiency = (project, proficiency, findings) =>
{
  proficiency.conditionals.forEach(conditional =>
  {
    const where = `config.proficiency.json conditional "${conditional.key}"`;

    conditional.actorIds.forEach(actorId => findings.resolve(project, `${where} actorIds`, 'Actors', actorId));
    conditional.skillRewards.forEach(skillId => findings.resolve(project, `${where} skillRewards`, 'Skills', skillId));

    conditional.requirements.forEach((requirement, index) =>
    {
      findings.resolve(project, `${where} requirements[${index}] skillId`, 'Skills', requirement.skillId);

      requirement.secondarySkillIds.forEach(skillId =>
        findings.resolve(project, `${where} requirements[${index}] secondarySkillIds`, 'Skills', skillId));
    });
  });

  // the knowledge blocks are written only once a project authors one, so an absent list is empty.
  (proficiency.knowledgeExchanges ?? []).forEach(exchange => resolveLettered(project, findings,
    `config.proficiency.json knowledge exchange "${exchange.key}" output`, exchange.output));
};

/**
 * Checks one boss reference the way J-ABS-Boss does at the start of the fight: the id must resolve,
 * and when the author recorded the name it was authored against, the row must still carry it.
 *
 * The plugin throws on a mismatch, so a renamed row turns into a boss fight that refuses to start the
 * first time anyone reaches it. Catching it here moves that failure from the playtest to the commit.
 * @param {object} project The loaded project.
 * @param {Findings} findings Where failures go.
 * @param {string} where Where the reference lives.
 * @param {string} table The table it points into.
 * @param {number} id The id.
 * @param {string} expect The name recorded at authoring time, empty for no tripwire.
 */
const resolveExpected = (project, findings, where, table, id, expect) =>
{
  const before = findings.lines.length;
  findings.resolve(project, where, table, id);

  // a reference that failed to resolve has already been reported; the name check would only repeat it.
  if (findings.lines.length > before || expect === '') return;

  const actual = project.tables[table][id].name;
  if (actual !== expect) findings.add(`${where} was authored against "${expect}", but ${table} #${id} is now "${actual}"`);
};

/**
 * Where a boss encounter's body comes from: the J-ABS enemy clone map, in the slot matching its enemy
 * id, or in the template slot the participant names instead. The encounter spawns it from there when
 * the fight starts, so an empty slot is a boss that never arrives, and a slot holding some other enemy
 * stops the fight from starting.
 * @param {object} project The loaded project.
 * @param {number} slotId The clone map event the participant spawns from.
 * @param {number} enemyId The enemy the participant names, which the spawned body has to turn out to be.
 * @returns {string} Why the body cannot be spawned; empty when it can.
 */
const findSpawnProblem = (project, slotId, enemyId) =>
{
  const { enemyMapId, maps } = project;

  if (enemyMapId === 0) return 'spawns from the enemy clone map, but J-ABS names no enemyMapId in js/plugins.js';

  const cloneMap = maps.get(enemyMapId);
  if (!cloneMap) return `spawns from the enemy clone map (Map #${enemyMapId}), which does not exist`;

  const template = slotId > 0 ? cloneMap.events[slotId] : null;
  if (!template) return `spawns from event #${slotId} of the enemy clone map (Map #${enemyMapId}), which holds no such event`;

  // the body J-ABS builds from the template is whichever enemy its first page names.
  const named = findTemplateEnemyId(template);
  if (named !== enemyId) return `spawns from event #${slotId} of the enemy clone map (Map #${enemyMapId}), which is enemy #${named}, not #${enemyId}`;

  return '';
};

/**
 * The enemy a clone map template turns into: the `<enemyId:N>` on its first page's comments.
 * @param {object} template The clone map event.
 * @returns {number} The enemy id it names, or 0 when it names none.
 */
const findTemplateEnemyId = template =>
{
  const [ page ] = template.pages;
  const comments = page.list.filter(command => command.code === 108 || command.code === 408);
  const tagged = comments.map(command => /<enemyId: ?(\d+)>/i.exec(command.parameters[0])).find(match => match);

  return tagged ? Number(tagged[1]) : 0;
};

/**
 * The verbs J-ABS-Boss implements. A step naming any other verb throws the moment the fight performs it.
 * @type {string[]}
 */
const BOSS_VERBS = [
  'forceSkill', 'addState', 'removeState', 'changeImage', 'quickenRoutine', 'spawn', 'tint', 'animation', 'dialogue',
];

/**
 * The moments of a fight a J-ABS-Boss reaction can answer.
 * @type {string[]}
 */
const BOSS_TRIGGERS = [ 'start', 'fallen', 'health' ];

/**
 * Where a tile sits relative to the arena a boss fight was placed for.
 * @param {object|undefined} arena The arena map, when it exists.
 * @param {number} mapId The arena's map id, for the report.
 * @param {number} x The tile's column.
 * @param {number} y The tile's row.
 * @returns {string} Why the tile is off the arena; empty when it is on it, or when there is no arena to measure.
 */
const findTileProblem = (arena, mapId, x, y) =>
{
  // a missing arena has already been reported against the encounter's map.
  if (!arena) return '';

  if (x >= 0 && y >= 0 && x < arena.width && y < arena.height) return '';

  return `appears at (${x}, ${y}), outside Map #${mapId} (${arena.width}x${arena.height})`;
};

/**
 * Whether a screen tone is one the engine can settle on: red, green and blue from -255 to 255, then gray
 * from 0 to 255. J-ABS-Boss refuses a tone that is not four channels; a channel out of range is clamped by
 * nothing and makes a color nobody chose.
 * @param {unknown} tone The tone a tint step names.
 * @returns {boolean}
 */
const isScreenTone = tone =>
{
  if (!Array.isArray(tone) || tone.length !== 4) return false;

  const [ red, green, blue, gray ] = tone;
  const isChannel = value => Number.isFinite(value) && value >= -255 && value <= 255;

  return isChannel(red) && isChannel(green) && isChannel(blue) && isChannel(gray) && gray >= 0;
};

/**
 * One step of a boss routine or reaction, judged by what its verb reads: the participant it acts on, and
 * the skill, state, routine, enemy, tone, animation or line it names. A changed look is left to the sprite
 * check, which knows the files.
 * @param {object} project The loaded project.
 * @param {Findings} findings Where failures go.
 * @param {object} encounter The encounter owning the step.
 * @param {object} step The step.
 * @param {string} where Where the step lives, for the report.
 */
const checkBossStep = (project, findings, encounter, step, where) =>
{
  if (!BOSS_VERBS.includes(step.verb))
  {
    findings.add(`${where} does "${step.verb}", which J-ABS-Boss does not implement, so the fight throws when it gets there`);

    return;
  }

  // a step naming nobody acts on the boss, who always exists.
  const participant = step.participant ?? '';
  if (participant !== '' && !encounter.participants.some(body => body.key === participant))
  {
    findings.add(`${where} acts on participant "${participant}", but the encounter has nobody by that name`);
  }

  if (step.verb === 'forceSkill') resolveExpected(project, findings, `${where} skill`, 'Skills', step.skill, step.expect ?? '');

  if (step.verb === 'addState' || step.verb === 'removeState')
  {
    resolveExpected(project, findings, `${where} state`, 'States', step.state ?? 0, step.expect ?? '');
  }

  if (step.verb === 'quickenRoutine' && !encounter.routines.some(routine => routine.key === step.routine))
  {
    findings.add(`${where} speeds up routine "${step.routine}", but the encounter has no routine by that name`);
  }

  if (step.verb === 'spawn') checkBossSpawn(project, findings, encounter, step, where);

  if (step.verb === 'tint' && !isScreenTone(step.tone))
  {
    findings.add(`${where} tints the screen to ${JSON.stringify(step.tone ?? null)}, which is not red, green and blue from -255 to 255 and gray from 0 to 255`);
  }

  if (step.verb === 'animation')
  {
    resolveExpected(project, findings, `${where} animation`, 'Animations', step.animation ?? 0, step.expect ?? '');
  }

  // an empty line still opens a window and holds the fight until it is dismissed, and the plugin refuses it.
  if (step.verb === 'dialogue' && (step.lines ?? []).length === 0)
  {
    findings.add(`${where} has a participant say nothing at all, so the fight refuses to start`);
  }
};

/**
 * A spawn step, checked the way a participant is: the enemy it names, the clone map slot its body is copied
 * from, and the tile it appears on.
 * @param {object} project The loaded project.
 * @param {Findings} findings Where failures go.
 * @param {object} encounter The encounter owning the step.
 * @param {object} step The spawn step.
 * @param {string} where Where the step lives, for the report.
 */
const checkBossSpawn = (project, findings, encounter, step, where) =>
{
  const enemyId = step.enemyId ?? 0;
  resolveExpected(project, findings, `${where} enemyId`, 'Enemies', enemyId, step.expect ?? '');

  // copied from its enemy's own slot, unless it names a template of its own, exactly like a participant.
  const template = step.template ?? 0;
  const slotId = template === 0 ? enemyId : template;
  const spawnProblem = findSpawnProblem(project, slotId, enemyId);
  if (spawnProblem !== '') findings.add(`${where} ${spawnProblem}`);

  const tileProblem = findTileProblem(project.maps.get(encounter.map), encounter.map, step.x ?? 0, step.y ?? 0);
  if (tileProblem !== '') findings.add(`${where} ${tileProblem}`);
};

/**
 * One reaction of a boss encounter: a moment a fight actually has, the bodies a fallen reaction waits on,
 * and each of its steps.
 * @param {object} project The loaded project.
 * @param {Findings} findings Where failures go.
 * @param {object} encounter The encounter owning the reaction.
 * @param {object} reaction The reaction.
 * @param {string} where Where the reaction lives, for the report.
 */
const checkBossReaction = (project, findings, encounter, reaction, where) =>
{
  if (!BOSS_TRIGGERS.includes(reaction.on))
  {
    findings.add(`${where} answers "${reaction.on}", which is not a moment a fight has, so the fight refuses to start`);
  }

  // a reaction to bodies falling has to wait on somebody real, or it fires at once or never.
  const waitsOn = reaction.participants ?? [];
  if (reaction.on === 'fallen' && waitsOn.length === 0)
  {
    findings.add(`${where} waits on nobody falling, so the fight refuses to start`);
  }

  // a health reaction at a hundred is met before the fight begins, and at zero never: the boss has fallen by then.
  const below = reaction.below ?? 0;
  if (reaction.on === 'health' && !(below > 0 && below < 100))
  {
    findings.add(`${where} waits for health at or below ${below}%, which is no turning point a fight has, so the fight refuses to start`);
  }

  waitsOn
    .filter(key => !encounter.participants.some(body => body.key === key))
    .forEach(key => findings.add(`${where} waits on participant "${key}", but the encounter has nobody by that name`));

  reaction.steps.forEach((step, index) => checkBossStep(project, findings, encounter, step, `${where} steps[${index}]`));
};

/**
 * JABS boss encounters: the map, the switch turned on when the fight is won, each participant's enemy,
 * the clone map slot it spawns from and the tile it appears on, and each step of every routine and
 * reaction.
 * @param {object} project The loaded project.
 * @param {object} jabs The parsed `config.jabs.json`.
 * @param {Findings} findings Where failures go.
 */
const checkBosses = (project, jabs, findings) =>
{
  jabs.bosses.forEach(encounter =>
  {
    const where = `config.jabs.json boss "${encounter.key}"`;
    const bossMap = project.maps.get(encounter.map);

    findings.resolve(project, `${where} map`, 'Maps', encounter.map);

    // the switch the story waits on once the boss falls. RPG Maker ignores a switch it does not have, so a
    // bad one is a boss that dies while the story waits forever; zero, or no switch at all, turns none on.
    findings.resolve(project, `${where} defeatSwitch`, 'Switches', encounter.defeatSwitch ?? 0, { allowZero: true });

    // a fight with no bodies counts as won on its first frame, since every one of its bodies has fallen.
    if (encounter.participants.length === 0) findings.add(`${where} has no participants, so it is won the moment it starts`);

    encounter.participants.forEach(participant =>
    {
      const participantWhere = `${where} participant "${participant.key}"`;

      resolveExpected(project, findings, `${participantWhere} enemyId`, 'Enemies', participant.enemyId, participant.expect);

      // the participant's body is spawned from the clone map when the fight starts, not found on any map:
      // from its enemy's own slot, unless it names a template of its own.
      const template = participant.template ?? 0;
      const slotId = template === 0 ? participant.enemyId : template;
      const spawnProblem = findSpawnProblem(project, slotId, participant.enemyId);
      if (spawnProblem !== '') findings.add(`${participantWhere} ${spawnProblem}`);

      // the tile it appears on has to be somewhere on the arena it was placed for.
      const tileProblem = findTileProblem(bossMap, encounter.map, participant.x, participant.y);
      if (tileProblem !== '') findings.add(`${participantWhere} ${tileProblem}`);
    });

    encounter.routines.forEach(routine => routine.steps.forEach((step, index) =>
      checkBossStep(project, findings, encounter, step, `${where} routine "${routine.key}" steps[${index}]`)));

    (encounter.reactions ?? []).forEach(reaction =>
      checkBossReaction(project, findings, encounter, reaction, `${where} reaction "${reaction.key}"`));
  });
};

/**
 * Difficulty: the two states every layer grants, and every affix state a layer grants weight to.
 * A layer that grants one side of every fight nothing records 0 for that side.
 * @param {object} project The loaded project.
 * @param {object[]} difficulty The parsed `config.difficulty.json`, a bare array of layers.
 * @param {Findings} findings Where failures go.
 */
const checkDifficulty = (project, difficulty, findings) =>
{
  difficulty.forEach(layer =>
  {
    const where = `config.difficulty.json layer "${layer.key}"`;

    // the states every actor and every enemy carry while the layer is enabled.
    findings.resolve(project, `${where} actorStateId`, 'States', layer.actorStateId, { allowZero: true });
    findings.resolve(project, `${where} enemyStateId`, 'States', layer.enemyStateId, { allowZero: true });

    // a layer that leaves affixes alone omits the block entirely.
    const grants = layer.affixEffects
      ? layer.affixEffects.grants ?? []
      : [];

    grants.forEach(grant => findings.resolve(project,
      `${where} affix grant stateId`, 'States', grant.stateId));
  });
};

//endregion per config

/**
 * Each config this check reads, and what reads it.
 * @type {{ name: string, check: Function }[]}
 */
const CONFIG_CHECKS = [
  { name: 'crafting', check: checkCrafting },
  { name: 'quest', check: checkQuests },
  { name: 'sdp', check: checkSdp },
  { name: 'proficiency', check: checkProficiency },
  { name: 'jabs', check: checkBosses },
  { name: 'difficulty', check: checkDifficulty },
];

/**
 * Checks every outbound id in every plugin config this validator knows the shape of.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkConfigs = project =>
{
  const findings = new Findings();

  CONFIG_CHECKS.forEach(({ name, check }) =>
  {
    const config = project.configs.get(name);

    // every one of these configs ships with the game, so a missing one is a finding, not a skip.
    if (!config)
    {
      findings.add(`config.${name}.json is missing`);

      return;
    }

    check(project, config, findings);
  });

  return {
    findings: findings.lines,
    summary: `${findings.checked} reference(s) across ${CONFIG_CHECKS.length} config files`,
  };
};