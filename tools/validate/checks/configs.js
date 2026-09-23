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
 * JABS boss encounters: the map, each participant's enemy and event, and each routine's skills.
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

    encounter.participants.forEach(participant =>
    {
      const participantWhere = `${where} participant "${participant.key}"`;

      resolveExpected(project, findings, `${participantWhere} enemyId`, 'Enemies', participant.enemyId, participant.expect);

      // the participant's body is an event on the encounter's map, found by id at runtime.
      if (bossMap && !bossMap.events[participant.eventId])
      {
        findings.add(`${participantWhere} eventId names event #${participant.eventId}, which Map #${encounter.map} does not hold`);
      }
    });

    encounter.routines.forEach(routine => routine.steps.forEach((step, index) =>
      resolveExpected(project, findings, `${where} routine "${routine.key}" steps[${index}] skill`, 'Skills', step.skill, step.expect)));
  });
};

/**
 * Difficulty: every affix state a layer grants weight to.
 * @param {object} project The loaded project.
 * @param {object[]} difficulty The parsed `config.difficulty.json`, a bare array of layers.
 * @param {Findings} findings Where failures go.
 */
const checkDifficulty = (project, difficulty, findings) =>
{
  difficulty.forEach(layer =>
  {
    // a layer that leaves affixes alone omits the block entirely.
    const grants = layer.affixEffects
      ? layer.affixEffects.grants ?? []
      : [];

    grants.forEach(grant => findings.resolve(project,
      `config.difficulty.json layer "${layer.key}" affix grant stateId`, 'States', grant.stateId));
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