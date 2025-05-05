//region ProficiencyConditional
/**
 * A collection of requirements associated with a collection of actors that will grant one or more rewards upon
 * satisfying all requirements.
 */
class ProficiencyConditional
{
  /**
   * The key of this conditional.
   * @type {string}
   */
  key = String.empty;

  /**
   * The actor's id of which this conditional applies to.
   * @type {number[]}
   */
  actorIds = Array.empty;

  /**
   * The requirements for this conditional.
   * @type {ProficiencyRequirement[]}
   */
  requirements = Array.empty;

  /**
   * The skills rewarded when all requirements are fulfilled.
   * @type {number[]}
   */
  skillRewards = Array.empty;

  /**
   * The javascript to execute when all requirements are fulfilled.
   * @type {string}
   */
  jsRewards = String.empty;

  /**
   * Constructor.
   * @param {string} key The unique identifier of this skill proficiency conditional.
   * @param {number[]} actorIds The ids of all actors this conditional applies to.
   * @param {ProficiencyRequirement[]} requirements All requirements that must be satisfied to grant the rewards.
   * @param {number[]} skillRewards The skills rewarded upon satisfying all requirements.
   * @param {string} jsRewards The raw javascript to execute upon satisfying all requirements.
   */
  constructor(key, actorIds, requirements, skillRewards, jsRewards)
  {
    this.key = key;
    this.actorIds = actorIds;
    this.requirements = requirements;
    this.skillRewards = skillRewards;
    this.jsRewards = jsRewards;
  }
}

//endregion ProficiencyConditional

//region proficiencyRequirement
/**
 * A single requirement of a skill proficiency conditional.
 */
class ProficiencyRequirement
{
  /**
   * The skill id for this requirement.
   * @type {number}
   */
  skillId = 0;

  /**
   * The level of proficiency required to consider this requirement fulfilled.
   * @type {number}
   */
  proficiency = 0;

  /**
   * The skill ids for this requirement.
   * @type {number[]}
   */
  secondarySkillIds = [];

  /**
   * Constructor.
   * @param {number} skillId The primary skill id of the requirement.
   * @param {number} proficiency The proficiency required.
   * @param {number[]} secondarySkillIds The secondary skill ids for the requirement.
   */
  constructor(skillId, proficiency, secondarySkillIds)
  {
    this.skillId = skillId;
    this.proficiency = proficiency;
    this.secondarySkillIds = secondarySkillIds;
  }

  /**
   * Check the total proficiency for this requirement to be unlocked by battler.
   * @param {Game_Actor|Game_Enemy} battler The battler whose proficiency this is being checked for.
   * @returns {number}
   */
  totalProficiency(battler)
  {
    // identify the proficiency of the primary skill.
    const skillProficiency = battler.tryGetSkillProficiencyBySkillId(this.skillId);

    // grab the current proficiency of the skill for the battler.
    const primaryProficiency = skillProficiency.proficiency;

    // accumulate the primary proficiency plus all the secondary proficiencies.
    return this.secondarySkillIds
      .reduce((accumulator, secondarySkillId) =>
      {
        // check if there is any proficiency for the primary skill associated with the requirement.
        const secondaryProficiency = battler.tryGetSkillProficiencyBySkillId(secondarySkillId);

        // add the additional proficiency onto the accumulation.
        return accumulator + secondaryProficiency.proficiency;

        // the base proficiency is this requirement's known proficiency.
      }, primaryProficiency);
  };
}

//endregion proficiencyRequirement

//region SkillProficiency
/**
 * A data model for saving skill usage/proficiency for battlers.
 */
function SkillProficiency()
{
  this.initialize(...arguments);
}

SkillProficiency.prototype = {};
SkillProficiency.prototype.constructor = SkillProficiency;

/**
 * Initializes this class with the given parameters.
 */
SkillProficiency.prototype.initialize = function(skillId, initialProficiency = 0)
{
  /**
   * The skill id of the skill for this prof.
   * @type {number}
   */
  this.skillId = skillId;

  /**
   * The prof the owning battler bears with this skill.
   * @type {number}
   */
  this.proficiency = initialProficiency;
};

/**
 * Gets the underlying skill of this prof.
 * @returns {RPG_Skill}
 */
SkillProficiency.prototype.skill = function()
{
  return $dataSkills[this.skillId];
};

/**
 * Adds a given amount of prof to the skill's current prof.
 * @param {number} value The amount of prof to add.
 */
SkillProficiency.prototype.improve = function(value)
{
  this.proficiency += value;
  if (this.proficiency < 0)
  {
    this.proficiency = 0;
  }
};
//endregion SkillProficiency

//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 PROF] Enables skill proficiency tracking.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables the ability to have actors grow in prof when using
 * skills. Additionally, triggers can now be configured to execute
 * against these new proficiencies (and other things).
 *
 * Integrates with others of mine plugins:
 * - J-ABS; actions performed in JABS will accrue proficiency.
 * - J-Elem; enables damage formula integration for proficiency.
 * ----------------------------------------------------------------------------
 * DETAILS
 * This plugin tracks all skill usage for all battlers (actors and enemies,
 * though with enemies it is much less meaningful since they are short-lived).
 * By defining "proficiency conditionals", you can enable actors to unlock new
 * skills or gain other javascript-based rewards by using their skills.
 *
 * WHEN USING J-ELEMENTALISTICS
 * Additionally, a new parameter is exposed in the "damage formula" for "p"
 * which represents the attacker's proficiency in the skill being used. For
 * example, consider the following formula:
 *
 *  ((a.atk * 4) + p) - (b.def * 2)
 *
 * We would now translate that as:
 * 4X attacker ATK + attacker's proficiency in this skill
 * minus
 * 2X defender DEF
 *
 * Which gives this skill the ability to scale the more the attacker uses this
 * skill. Be aware there is no practical upper limit on proficiency, so if the
 * game is intended to go on for a long while, such scaling could be difficult
 * to balance in the long run. Use it in damage formulas wisely!
 * ----------------------------------------------------------------------------
 * !              IMPORTANT NOTE ABOUT CONFIGURATION DATA                     !
 * The configuration data for this plugin is derived from an external file
 * rather than the plugin's parameters. This file lives in the "/data"
 * directory of your project, and is called "config.proficiency.json". You can
 * absolutely generate/modify this file by hand, but you'll probably want to
 * visit my github and swipe the jmz-data-editor project I've built that
 * provides a convenient GUI for generating and modifying the configuration.
 *
 * If this configuration file is missing, the game will not run.
 *
 * Additionally, due to the way RMMZ base code is designed, by loading external
 * files for configuration like this, a project made with this plugin will
 * simply crash when attempting to load in a web context with an error akin to:
 *    "ReferenceError require is not defined"
 * This error is a result of attempting to leverage nodejs's "require" loader
 * to load the "fs" (file system) library to then load the plugin's config
 * file. Normally a web deployed game will alternatively use "forage" instead
 * to handle things that need to be read or saved, but because the config file
 * is just that- a file sitting in the /data directory rather than loaded into
 * forage storage- it becomes unaccessible.
 * ============================================================================
 * PROFICIENCY BONUSES
 * Have you ever wanted a battler to be able to gain some bonus proficiency by
 * means of something from the database? Well now you can! By applying the
 * appropriate tag to the various database locations, you too can have your
 * battlers gain bonus proficiency!
 *
 * NOTE:
 * Bonuses are flat bonuses that get added to the base amount, not percentage.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <proficiencyBonus:NUM>
 *
 * TAG EXAMPLES:
 *  <proficiencyBonus:3>
 * The attacker now gains +3 bonus proficiency for any skill used.
 *
 *  <proficiencyBonus:50>
 * The attacker now gains +50 bonus proficiency for any skill used.
 * ============================================================================
 * PROFICIENCY BLOCKING
 * Have you ever wanted a battler to NOT be able to gain proficiency? Well now
 * you can! By applying the appropriate tags to the various database locations,
 * you too can block any battler from giving or gaining proficiency!
 *
 * NOTE:
 * It is important to recognize that there are two tags that both block the
 * gain of proficiency in different ways. One tag is designed to prevent the
 * GIVING of proficiency, for most commonly being placed on enemies or states
 * that enemies can be placed in. The second tag is designed to prevent the
 * GAINING of proficiency, most commonly being placed on actors or states that
 * actors can be placed in... though either tag can go on anything as long as
 * you understand what you're doing.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <proficiencyGivingBlock>
 * or
 *  <proficiencyGainingBlock>
 *
 * TAG EXAMPLES:
 *  <proficiencyGivingBlock>
 * The battler that has this tag will not GIVE proficiency to any opposing
 * battlers that hit this battler with skills.
 *
 *  <proficiencyGainingBlock>
 * The battler that has this tag will not be able to GAIN proficiency from any
 * battlers that this battler uses skills against.
 * ============================================================================
 * PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 * COMMAND:
 * "Modify Actor's Proficiency"
 * This command will allow you to increase or decrease a single actor's
 * proficiency for a given skill. You only need choose the actor, skill, and
 * the amount to increase/decrease by.
 *
 * COMMAND:
 * "Modify Party's Proficiency"
 * This command will do the same as the single actor's command above, but
 * instead apply against the whole party.
 *
 * NOTES:
 * - You cannot reduce a skill's proficiency in a skill below 0.
 * - Increasing the proficiency can trigger rewards for the skill.
 * - Decreasing the proficiency will NOT undo rewards gained.
 * ============================================================================
 * CHANGELOG:
 * - 2.0.0
 *    THIS UPDATE BREAKS WEB DEPLOY FUNCTIONALITY FOR YOUR GAME.
 *    Updated to extend common plugin metadata patterns.
 *    Loads configuration data from external file.
 *    Proficiency conditional data is no longer saved to the actor.
 *    Retroactively added this changelog.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @param conditionals
 * @type struct<ProficiencyConditionalStruct>[]
 * @text Proficiency Conditionals
 * @desc A set of conditions that when met reward the player.
 * @default []
 *
 * @command modifyActorSkillProficiency
 * @text Modify Actor's Proficiency
 * @desc Increase/decrease one or more actor's proficiency with one or more skills.
 * @arg actorIds
 * @type actor[]
 * @text Actor Id
 * @desc Choose one or more actors to modify the proficiency for.
 * @arg skillIds
 * @type skill[]
 * @text Skill Id
 * @desc Choose one or more skills to modify the proficiency for.
 * @arg amount
 * @type number
 * @text Modifier
 * @desc This modifier can be negative or positive.
 * @min -999999
 * @max 999999
 *
 * @command modifyPartySkillProficiency
 * @text Modify Party's Proficiency
 * @desc Increase/decrease every member in the current party's proficiency with a particular skill.
 * @arg skillIds
 * @type skill[]
 * @text Skill Id
 * @desc Choose one or more skills to modify the proficiency for.
 * @arg amount
 * @type number
 * @text Modifier
 * @desc This modifier can be negative or positive.
 * @min -999999
 * @max 999999
 *
 */

//region plugin metadata
class J_ProficiencyPluginMetadata
  extends PluginMetadata
{
  /**
   * The path where the external configuration file is located relative to the root of the project.
   * @type {string}
   */
  static CONFIG_PATH = 'data/config.proficiency.json';

  /**
   * Maps all the raw proficiency conditional data
   * @param {any} parsedBlob The JSON.parse()'d data blob of the config.
   * @returns {ProficiencyConditional[]}
   */
  static classifyConditionals(parsedBlob)
  {
    return parsedBlob.conditionals.map(conditional =>
    {
      const requirements = conditional.requirements
        .map(requirement => new ProficiencyRequirement(
          requirement.skillId,
          requirement.proficiency,
          requirement.secondarySkillIds));

      return new ProficiencyConditional(
        conditional.key,
        conditional.actorIds,
        requirements,
        conditional.skillRewards,
        conditional.jsRewards);
    });
  }

  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  postInitialize()
  {
    super.postInitialize();

    this.initializeProficiencies();
  }

  initializeProficiencies()
  {
    const parsedConditionals = JSON.parse(StorageManager.fsReadFile(J_ProficiencyPluginMetadata.CONFIG_PATH));
    if (parsedConditionals === null)
    {
      console.error('no proficiency configuration was found in the /data directory of the project.');
      console.error('Consider adding configuration using the J-MZ data editor, or hand-writing one.');
      throw new Error('Proficiency plugin is being used, but no config file is present.');
    }

    const classifiedConditionalData = J_ProficiencyPluginMetadata.classifyConditionals(parsedConditionals);

    /**
     * The collection of all defined skill proficiencies.
     * @type {ProficiencyConditional[]}
     */
    this.conditionals = classifiedConditionalData;

    /**
     * A map of actorId:conditional[] for more easily accessing all conditionals associated with a given actor.
     * @type {Map<number, ProficiencyConditional[]>}
     */
    this.actorConditionalsMap = new Map();
    // TODO: fix this!
    [ 1, 2, 3, 4, 5, 6 ].forEach(actorId =>
    {
      this.actorConditionalsMap.set(actorId, Array.empty);
    });


    this.conditionals.forEach(conditional =>
    {
      conditional.actorIds.forEach(actorId =>
      {
        const data = this.actorConditionalsMap.get(actorId);
        data.push(conditional);
        this.actorConditionalsMap.set(actorId, data);
      });
    })

    console.log(`loaded:
      - ${this.conditionals.length} proficiency conditionals
      from file ${J_ProficiencyPluginMetadata.CONFIG_PATH}.`);
  }
}

//endregion plugin metadata

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.PROF = {};

/**
 * The metadata associated with this plugin.
 * @type {J_ProficiencyPluginMetadata}
 */
J.PROF.Metadata = new J_ProficiencyPluginMetadata('J-Proficiency', '2.0.0');

/**
 * The various aliases associated with this plugin.
 */
J.PROF.Aliased = {
  Game_Actor: new Map(),
  Game_Action: new Map(),
  Game_Battler: new Map(),
  Game_Enemy: new Map(),
  Game_System: new Map(),

  IconManager: new Map(),
  TextManager: new Map(),
};

J.PROF.RegExp = {};
J.PROF.RegExp.ProficiencyBonus = /<proficiencyBonus:[ ]?(\d+)>/i;
J.PROF.RegExp.ProficiencyGivingBlock = /<proficiencyGivingBlock>/i;
J.PROF.RegExp.ProficiencyGainingBlock = /<proficiencyGainingBlock>/i;
//endregion Introduction

//region plugin commands
/**
 * Plugin command for modifying proficiency for one or more actors for one or more skills by a given amount.
 */
PluginManager.registerCommand(J.PROF.Metadata.Name, "modifyActorSkillProficiency", args =>
{
  const {
    actorIds,
    skillIds
  } = args;

  const parsedActorIds = JSON.parse(actorIds)
    .map(num => parseInt(num));
  const parsedSkillIds = JSON.parse(skillIds)
    .map(num => parseInt(num));
  let { amount } = args;
  amount = parseInt(amount);
  parsedSkillIds.forEach(skillId =>
  {
    parsedActorIds.forEach(actorId =>
    {
      $gameActors
        .actor(actorId)
        .increaseSkillProficiency(skillId, amount);
    });
  });
});

/**
 * Plugin command for modifying proficiency of the whole party for one or more skills by a given amount.
 */
PluginManager.registerCommand(J.PROF.Metadata.Name, "modifyPartySkillProficiency", args =>
{
  const { skillIds } = args;
  let { amount } = args;
  const parsedSkillIds = JSON.parse(skillIds)
    .map(num => parseInt(num));
  amount = parseInt(amount);
  $gameParty.members()
    .forEach(actor =>
    {
      parsedSkillIds.forEach(skillId =>
      {
        actor.increaseSkillProficiency(skillId, amount);
      });
    });
});
//endregion plugin commands

//region IconManager
/**
 * Extend {@link #longParam}.<br>
 * First checks if the paramId was the proficiency boost before checking others.
 */
J.PROF.Aliased.IconManager.set('longParam', IconManager.longParam)
IconManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 32:
      return this.proficiencyBoost(); // prof
    default:
      return J.PROF.Aliased.IconManager.get('longParam')
        .call(this, paramId);
  }
};

/**
 * Gets the icon index for the proficiency boost.
 * @return {number}
 */
IconManager.proficiencyBoost = function()
{
  return 979;
};
//endregion IconManager

//region TextManager
/**
 * Extends {@link #longParam}.<br>
 * First checks if it is the proficiency paramId before searching for others.
 * @returns {string}
 */
J.PROF.Aliased.TextManager.set('longParam', TextManager.longParam);
TextManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 32:
      return this.proficiencyBonus(); // proficiency boost
    default:
      // perform original logic.
      return J.PROF.Aliased.TextManager.get('longParam')
        .call(this, paramId);
  }
};

/**
 * Gets the proper name of "proficiency bonus", which is quite long, really.
 * @returns {string}
 */
TextManager.proficiencyBonus = function()
{
  return "Proficiency+";
};

/**
 * Extends {@link #longParamDescription}.<br>
 * First checks if it is the proficiency paramId before searching for others.
 * @returns {string[]}
 */
J.PROF.Aliased.TextManager.set('longParamDescription', TextManager.longParamDescription);
TextManager.longParamDescription = function(paramId)
{
  switch (paramId)
  {
    case 32:
      return this.proficiencyDescription(); // proficiency boost
    default:
      // perform original logic.
      return J.PROF.Aliased.TextManager.get('longParamDescription')
        .call(this, paramId);
  }
};

/**
 * Gets the description text for the proficiency boost.
 * @returns {string[]}
 */
TextManager.proficiencyDescription = function()
{
  return [
    "The numeric bonus of proficiency gained when gaining proficiency.",
    "Higher amounts of this means achieving proficiency mastery faster." ];
};
//endregion TextManager

//region Game_Action
/**
 * Extends the .apply() to include consideration of prof.
 */
J.PROF.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  J.PROF.Aliased.Game_Action.get("apply")
    .call(this, target);

  const result = target.result();

  // determine if the battler can increase proficiency against the target.
  if (this.canIncreaseProficiency(target))
  {
    this.increaseProficiency(result.critical);
  }
};

/**
 * Whether or not increasing the attacker's proficiency is a valid course of action
 * based on various requirements.
 * @param {Game_Battler} target The result of the action.
 * @returns {boolean}
 */
Game_Action.prototype.canIncreaseProficiency = function(target)
{
  // only gain proficiency if this is a skill, not an item or something.
  const isSkill = this.isSkill();
  if (!isSkill) return false;

  // only gain proficiency if we hit the target.
  const isHit = target.result()
    .isHit();
  if (!isHit) return false;

  // only gain proficiency if the target allows it.
  const canGiveProficiency = target.canGiveProficiency();
  if (!canGiveProficiency) return false;

  // only gain proficiency if the attacker allows it.
  const canGainProficiency = this.subject()
    .canGainProficiency();
  if (!canGainProficiency) return false;

  // if we made it this far, then we can gain proficiency!
  return true;
};

/**
 * Increases the skill prof for the actor with the given skill.
 */
Game_Action.prototype.increaseProficiency = function()
{
  const caster = this.subject();
  const skill = this.item();
  if (!caster || !skill)
  {
    console.warn('attempted to improve prof for an invalid caster or skill.');
    return;
  }

  const amount = caster.skillProficiencyAmount();
  caster.increaseSkillProficiency(skill.id, amount);
};

/**
 * Gets the skill prof from this action's skill of the caster.
 * @returns {number}
 */
Game_Action.prototype.skillProficiency = function()
{
  if (this.isSkill() && this.subject())
  {
    const skill = this.item();
    const skillProficiency = this.subject()
      .skillProficiencyBySkillId(skill.id);
    if (skillProficiency)
    {
      return skillProficiency.proficiency;
    }
  }

  return 0;
};

// this stuff only applies to JABS.
if (J.ABS)
{
  /**
   * Extends {@link Game_Action.onParry}.<br>
   * Also gains proficiency for the parry if possible.
   * @param {JABS_Battler} jabsBattler The battler that is parrying.
   */
  J.PROF.Aliased.Game_Action.set('onParry', Game_Action.prototype.onParry);
  Game_Action.prototype.onParry = function(jabsBattler)
  {
    // perform original logic.
    J.PROF.Aliased.Game_Action.get('onParry')
      .call(this, jabsBattler);

    // gain some proficiency from guarding.
    this.gainProficiencyFromGuarding(jabsBattler);
  };

  /**
   * Extends {@link Game_Action.onGuard}.<br>
   * Also gains proficiency for the guard if possible.
   * @param {JABS_Battler} jabsBattler The battler that is guarding.
   */
  J.PROF.Aliased.Game_Action.set('onGuard', Game_Action.prototype.onGuard);
  Game_Action.prototype.onGuard = function(jabsBattler)
  {
    // perform original logic.
    J.PROF.Aliased.Game_Action.get('onGuard')
      .call(this, jabsBattler);

    // gain some proficiency from guarding.
    this.gainProficiencyFromGuarding(jabsBattler);
  };

  /**
   * Gains proficiency when guarding.
   * @param jabsBattler
   */
  Game_Action.prototype.gainProficiencyFromGuarding = function(jabsBattler)
  {
    // don't gain proficiency if we cannot.
    if (!this.canGainProficiencyFromGuarding(jabsBattler)) return;

    // handle tp generation from the guard skill.
    const skillId = jabsBattler.getGuardSkillId();

    // gain some proficiency for the parry skill.
    jabsBattler.getBattler()
      .increaseSkillProficiency(skillId, 1);
  };

  /**
   * Determines whether or not this battle can gain proficiency for the guard skill.
   * @param {JABS_Battler} jabsBattler The battler that is guarding/parrying.
   * @returns {boolean} True if we can gain proficiency, false otherwise.
   */
  Game_Action.prototype.canGainProficiencyFromGuarding = function(jabsBattler)
  {
    // determine whether or not this battler can gain proficiency.
    const canGainProficiency = jabsBattler.getBattler()
      .canGainProficiency();

    // if the battler is blocked from gaining proficiency don't gain proficiency.
    if (!canGainProficiency) return false;

    // get the guard skill id.
    const skillId = jabsBattler.getGuardSkillId();

    // if there is no skill id, don't gain proficiency.
    if (!skillId) return false;

    // gain proficiency!
    return true;
  };
}
//endregion Game_Action

//region Game_Actor
/**
 * Adds new properties to the actors that manage the skill prof system.
 */
J.PROF.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.PROF.Aliased.Game_Actor.get("initMembers")
    .call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the proficiency system.
   */
  this._j._proficiency ||= {};

  /**
   * All skill proficiencies earned by completing conditionals.
   * @type {SkillProficiency[]}
   */
  this._j._proficiency._proficiencies ||= [];

  /**
   * All conditionals that have been unlocked by this actor.
   * @type {string[]}
   */
  this._j._proficiency._unlockedConditionals ||= [];

  this._j._proficiency._bonusSkillProficiencyGains = 0;
};

/**
 * Gets all skill proficiencies for this actor.
 * @returns {SkillProficiency[]}
 */
Game_Actor.prototype.skillProficiencies = function()
{
  return this._j._proficiency._proficiencies;
};

/**
 * Adds a newly acquired proficiency to this actor.
 * @param {SkillProficiency} skillProficiency The newly acquired proficiency.
 */
Game_Actor.prototype.addNewSkillProficiency = function(skillProficiency)
{
  // add the new proficiency.
  this._j._proficiency._proficiencies.push(skillProficiency);

  // sort them after adding in case the order changed.
  this._j._proficiency._proficiencies.sort();
};

/**
 * Gets all of this actor's skill proficiency conditionals, locked and unlocked.
 * @returns {ProficiencyConditional[]}
 */
Game_Actor.prototype.proficiencyConditionals = function()
{
  return J.PROF.Metadata.actorConditionalsMap.get(this.actorId());
};

/**
 * Gets all of this actor's skill proficiency conditionals that have been unlocked.
 * @returns {string[]}
 */
Game_Actor.prototype.unlockedConditionals = function()
{
  return this._j._proficiency._unlockedConditionals;
};

/**
 * Registers a conditional as unlocked by its key.
 * @param {string} conditional The key of the conditional to unlock.
 */
Game_Actor.prototype.addUnlockedConditional = function(conditional)
{
  this._j._proficiency._unlockedConditionals.push(conditional);
};

/**
 * Gets all of this actor's skill proficiency conditionals that include a requirement of the provided skillId.
 * @param {number} skillId The skill id to find conditionals for.
 * @returns {ProficiencyConditional[]}
 */
Game_Actor.prototype.proficiencyConditionalBySkillId = function(skillId)
{
  return this.proficiencyConditionals()
    .filter(conditional => conditional.requirements.some(requirement => requirement.skillId === skillId));
};

/**
 * Checks whether or not a conditional has been unlocked by its key.
 * @param key {string} The key of the conditional.
 * @returns {boolean}
 */
Game_Actor.prototype.isConditionalUnlocked = function(key)
{
  return this.unlockedConditionals()
    .includes(key);
};

/**
 * Gets all currently locked skill proficiency conditionals.
 * @returns {ProficiencyConditional[]}
 */
Game_Actor.prototype.lockedConditionals = function()
{
  return this.proficiencyConditionals()
    .filter(conditional => this.isConditionalUnlocked(conditional.key) === false);
};

/**
 * Unlocks a skill proficiency conditional by its key.
 * @param key {string} The key of the conditional.
 */
Game_Actor.prototype.unlockConditional = function(key)
{
  if (this.isConditionalUnlocked(key))
  {
    console.warn(`Attempted to unlock conditional: [${key}], but it was already unlocked.`);
    return;
  }

  this.addUnlockedConditional(key);
};

/**
 * Executes the reward listed in the skill proficiency conditional.
 * @param conditional {ProficiencyConditional} The conditional containing the reward.
 */
Game_Actor.prototype.executeConditionalReward = function(conditional)
{
  this.executeSkillRewards(conditional);
  this.executeJsRewards(conditional);
};

/**
 * Teaches this actor all skills listed (if any) in the skill rewards
 * of a skill proficiency conditional.
 * @param conditional {ProficiencyConditional} The conditional containing the reward.
 */
Game_Actor.prototype.executeSkillRewards = function(conditional)
{
  // grab the skill rewards for the conditional.
  const { skillRewards } = conditional;

  // if we don't have any skills to learn, then skip.
  if (!skillRewards.length) return;

  // teach all skills in the list to this actor from this conditional.
  skillRewards.forEach(this.learnSkill, this);
};

/**
 * Performs the arbitrary javascript provided in the skill proficiency conditional-
 * but with guardrails to ensure it doesn't blow up the game.
 * @param conditional {ProficiencyConditional} The conditional containing the reward.
 */
Game_Actor.prototype.executeJsRewards = function(conditional)
{
  // if we don't actually have any javascript to execute, then don't bother.
  if (!conditional.jsRewards) return;

  const a = this;         // the actor reference.
  const c = conditional;  // the conditional reference.
  const { jsRewards } = c;
  try
  {
    eval(jsRewards);
  }
  catch (error)
  {
    console.error(`there was an error executing the reward for: ${c.key}.<br>`);
    console.log(error);
  }
};

/**
 * Gets a skill proficiency by its skill id.
 *
 * This will return `undefined` if the skill proficiency
 * has not yet been generated.
 * @param {number} skillId The skill id.
 * @returns {SkillProficiency|null}
 */
Game_Actor.prototype.skillProficiencyBySkillId = function(skillId)
{
  return this
    .skillProficiencies()
    .find(skillProficiency => skillProficiency.skillId === skillId);
};

/**
 * A safe means of attempting to retrieve a skill proficiency. If the proficiency
 * does not exist, then it will be created with the default of zero starting proficiency.
 * @param {number} skillId The skill id to identify the proficiency for.
 * @returns {SkillProficiency}
 */
Game_Actor.prototype.tryGetSkillProficiencyBySkillId = function(skillId)
{
  // look up the proficiency; this could be undefined
  // if we didn't learn it directly via .learnSkill() somehow.
  const exists = this.skillProficiencyBySkillId(skillId);
  if (exists)
  {
    // if we did find it, then return it.
    return exists;
  }
  else
  {
    // if we didn't find the proficiency, just add it.
    return this.addSkillProficiency(skillId);
  }
};

/**
 * Adds a new skill proficiency to the collection.
 * @param {number} skillId The skill id.
 * @param {number=} initialProficiency Optional. The starting prof.
 * @returns {SkillProficiency} The skill proficiency added.
 */
Game_Actor.prototype.addSkillProficiency = function(skillId, initialProficiency = 0)
{
  const exists = this.skillProficiencyBySkillId(skillId);
  if (exists)
  {
    console.warn(`Attempted to recreate skill proficiency for skillId: ${skillId}.`);
    return exists;
  }

  // generate the new proficiency.
  const proficiency = new SkillProficiency(skillId, initialProficiency);

  // add it to the collection.
  this.addNewSkillProficiency(proficiency);

  // return the newly generated proficiency.
  return proficiency;
};

/**
 * Extends skill learning to add new skill proficiencies if we learned new skills.
 */
J.PROF.Aliased.Game_Actor.set("onLearnNewSkill", Game_Actor.prototype.onLearnNewSkill);
Game_Actor.prototype.onLearnNewSkill = function(skillId)
{
  // perform original logic.
  J.PROF.Aliased.Game_Actor.get("onLearnNewSkill")
    .call(this, skillId);

  // add the skill proficiency.
  this.addSkillProficiency(skillId);
};

/**
 * Improves the skill prof by a given amount (defaults to 1).
 * @param {number} skillId The skill id.
 * @param {number} amount The amount to improve the prof by.
 */
Game_Actor.prototype.increaseSkillProficiency = function(skillId, amount = 1)
{
  // get or create anew the skill proficiency associated with the skill id.
  const proficiency = this.tryGetSkillProficiencyBySkillId(skillId);

  // improve the proficiency of the skill.
  proficiency.improve(amount);

  // re-evaluate all conditionals to see if this resulted in unlocking any.
  this.evaluateProficiencyConditionals();
};

/**
 * Check all proficiency conditionals to see if any of them are now met.
 */
Game_Actor.prototype.evaluateProficiencyConditionals = function()
{
  // grab all the currently-locked proficiency conditionals for this actor.
  const lockedConditionals = this.lockedConditionals();

  // if we don't have any locked conditionals, then don't process.
  if (!lockedConditionals.length) return;

  // check each locked conditional to see if we can unlock it.
  lockedConditionals.forEach(this.evaluateProficiencyConditional, this);
};

/**
 * Checks the conditional to see if requirements are met to unlock it.
 * @param {ProficiencyConditional} conditional The conditional being evaluated.
 */
Game_Actor.prototype.evaluateProficiencyConditional = function(conditional)
{
  const allRequirementsMet = conditional.requirements.every(this.isRequirementMet, this);

  // check if the requirements are all met for unlocking.
  if (allRequirementsMet)
  {
    this.unlockConditional(conditional.key);
    this.executeConditionalReward(conditional);
  }
};

/**
 * Validates whether or not a proficiency requirement is met.
 * @param {ProficiencyRequirement} requirement The requirement being evaluated.
 * @returns {boolean}
 */
Game_Actor.prototype.isRequirementMet = function(requirement)
{
  // compute the current accumulated proficiency for the requirement based on this actor.
  const accumulatedProficiency = requirement.totalProficiency(this);

  // check if the proficiency for the skill has reached or exceeded the conditional.
  return accumulatedProficiency >= requirement.proficiency;
};

/**
 * Extends {@link #onBattlerDataChange}.<br/>
 * Also updates bonus skill proficiency gains.
 */
J.PROF.Aliased.Game_Actor.set('onBattlerDataChange', Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.PROF.Aliased.Game_Actor.get('onBattlerDataChange')
    .call(this);

  // update the skill gains as well.
  this.updateBonusSkillProficiencyGains();
};

/**
 * Updates the skill proficiency gains for this actor.
 */
Game_Actor.prototype.updateBonusSkillProficiencyGains = function()
{
  // TEMPORARY FIX FOR UPDATING SAVES IN PROGRESS.
  if (this._j._proficiency._bonusSkillProficiencyGains === undefined
    || this._j._proficiency._bonusSkillProficiencyGains === null)
  {
    this._j._proficiency._bonusSkillProficiencyGains = 0;
  }

  this._j._proficiency._bonusSkillProficiencyGains = RPGManager.getSumFromAllNotesByRegex(
    this.getAllNotes(),
    J.PROF.RegExp.ProficiencyBonus)
};

/**
 * Calculates total amount of bonus proficiency gain when gaining skill proficiency.
 * @returns {number}
 */
Game_Actor.prototype.bonusSkillProficiencyGains = function()
{
  return this._j._proficiency._bonusSkillProficiencyGains;
};
//endregion Game_Actor

//region Game_Battler
/**
 * Gets all skill proficiencies for this battler.
 * @returns {SkillProficiency[]}
 */
Game_Battler.prototype.skillProficiencies = function()
{
  return [];
};

/**
 * Gets the prof of one particular skill for this battler.
 * @param {number} skillId The id of the skill to get proficiency for.
 * @returns {SkillProficiency|null}
 */
Game_Battler.prototype.skillProficiencyBySkillId = function(skillId)
{
  return null;
};

/**
 * Gets the total amount of proficiency gained from an action for this battler.
 * @returns {number}
 */
Game_Battler.prototype.skillProficiencyAmount = function()
{
  const base = this.baseSkillProficiencyAmount();
  const bonuses = this.bonusSkillProficiencyGains();
  return base + bonuses;
};

/**
 * Gets the base amount of proficiency gained from an action for this battler.
 * @returns {number}
 */
Game_Battler.prototype.baseSkillProficiencyAmount = function()
{
  return 1;
};

/**
 * Gets the base amount of proficiency gained from an action for this battler.
 * @returns {number}
 */
Game_Battler.prototype.bonusSkillProficiencyGains = function()
{
  return 0;
};

/**
 * Whether or not a battler can gain proficiency by using skills against this battler.
 * @returns {boolean} True if the battler can give proficiency, false otherwise.
 */
Game_Battler.prototype.canGiveProficiency = function()
{
  // return the inversion of whether or not we found any of the blocker tags.
  return !RPGManager.checkForBooleanFromAllNotesByRegex(this.getAllNotes(), J.PROF.RegExp.ProficiencyGivingBlock)
};

/**
 * Whether or not this battler can gain proficiency from using skills.
 * @returns {boolean} True if the battler can gain proficiency, false otherwise.
 */
Game_Battler.prototype.canGainProficiency = function()
{
  // return the inversion of whether or not we found any of the blocker tags.
  return !RPGManager.checkForBooleanFromAllNotesByRegex(this.getAllNotes(), J.PROF.RegExp.ProficiencyGainingBlock)
};
//endregion Game_Battler

//region Game_Enemy
J.PROF.Aliased.Game_Enemy.set("initMembers", Game_Enemy.prototype.initMembers);
Game_Enemy.prototype.initMembers = function()
{
  J.PROF.Aliased.Game_Enemy.get("initMembers")
    .call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all boosts this actor has can potentially consume.
   * @type {SkillProficiency[]}
   */
  this._j._profs ||= [];
};

/**
 * Gets all skill proficiencies for this enemy.
 * @returns {SkillProficiency[]}
 */
Game_Enemy.prototype.skillProficiencies = function()
{
  return this._j._profs;
};

/**
 * Gets a skill prof by its skill id.
 * @param {number} skillId The skill id.
 * @returns {SkillProficiency|null}
 */
Game_Enemy.prototype.skillProficiencyBySkillId = function(skillId)
{
  return this
    .skillProficiencies()
    .find(prof => prof.skillId === skillId);
};

/**
 * Adds a new skill prof to the collection.
 * @param {number} skillId The skill id.
 * @param {number} initialProficiency Optional. The starting prof.
 * @returns {SkillProficiency}
 */
Game_Enemy.prototype.addSkillProficiency = function(skillId, initialProficiency = 0)
{
  const exists = this.skillProficiencyBySkillId(skillId);
  if (exists)
  {
    console.warn(`Attempted to recreate skill proficiency for skillId: ${skillId}.`);
    return exists;
  }

  const proficiency = new SkillProficiency(skillId, initialProficiency);
  this._j._profs.push(proficiency);
  this._j._profs.sort();
  return proficiency;
};

/**
 * A safe means of attempting to retrieve a skill proficiency. If the proficiency
 * does not exist, then it will be created with the default of zero starting proficiency.
 * @param {number} skillId The skill id to identify the proficiency for.
 * @returns {SkillProficiency}
 */
Game_Enemy.prototype.tryGetSkillProficiencyBySkillId = function(skillId)
{
  // look up the proficiency; this could be undefined
  // if we didn't learn it directly via .learnSkill() somehow.
  const exists = this.skillProficiencyBySkillId(skillId);
  if (exists)
  {
    // if we did find it, then return it.
    return exists;
  }
  else
  {
    // if we didn't find the proficiency, just add it.
    return this.addSkillProficiency(skillId);
  }
};

/**
 * Improves the skill prof by a given amount (defaults to 1).
 * @param {number} skillId The skill id.
 * @param {number} amount The amount to improve the prof by.
 */
Game_Enemy.prototype.increaseSkillProficiency = function(skillId, amount = 1)
{
  let proficiency = this.skillProficiencyBySkillId(skillId);

  // if the prof doesn't exist, create it first then improve it.
  if (!proficiency)
  {
    proficiency = this.addSkillProficiency(skillId);
  }

  proficiency.improve(amount);
};
//endregion Game_Enemy

//region Game_System
/**
 * Updates the list of all available proficiency conditionals from the latest plugin metadata.
 */
J.PROF.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.PROF.Aliased.Game_System.get('onAfterLoad')
    .call(this);

  // update from the latest plugin metadata.
  this.updateProficienciesFromPluginMetadata();
};

/**
 * Updates the plugin metadata after the game data has loaded.
 */
Game_System.prototype.updateProficienciesFromPluginMetadata = function()
{
  $gameActors.actorIds()
    .forEach(actorId =>
    {
      const actorConditionals = J.PROF.Metadata.conditionals.filter(condition => condition.actorIds.includes(actorId));
      J.PROF.Metadata.actorConditionalsMap.set(actorId, actorConditionals);
    });
};