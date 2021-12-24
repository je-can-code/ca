//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 PROF] Enables skill prof and condition triggers.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ============================================================================
 * This plugin enables the ability to have actors grow in prof when
 * using skills. Additionally, triggers can now be configured to execute
 * against these new proficiencies (and other things).
 * ============================================================================
 * PROFICIENCY BONUSES:
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
 * PROFICIENCY BLOCKING:
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
 *
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
/*~struct~ProficiencyConditionalStruct:
 * @param key
 * @type string
 * @text Key
 * @desc The conditional unique key so no actor can achieve the same conditional twice!
 * @default 1H-SWD_COMBO-3
 *
 * @param actorIds
 * @type actor[]
 * @text Actors
 * @desc The actors of which this proficiency conditional applies to.
 * @default []
 * 
 * @param requirements
 * @type struct<ProficiencyRequirementStruct>[]
 * @text Requirements
 * @desc A set of requirements required to fulfill this condition.
 * @default []
 *
 * @param skillRewards
 * @type skill[]
 * @text Skill Rewards
 * @desc All skills chosen here will be learned for fulfilling this condition. Stacks with JS rewards.
 * @default [1]
 * 
 * @param jsRewards
 * @type multiline_string
 * @text JS Rewards
 * @desc Use Javascript to define the reward for fulfilling this condition. Stacks with skill rewards.
 * @default a.learnSkill(5);
 */
/*~struct~ProficiencyRequirementStruct:
 * @param skillId
 * @type skill
 * @text Skill
 * @desc The skill to base this requirement on.
 * @default 1
 * 
 * @param proficiency
 * @type number
 * @text Proficiency Required
 * @desc The prof required in the designated skill to fulfill this requirement.
 * @default 100
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.PROF = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.PROF.Metadata =
  {
    /**
     * The version of this plugin.
     */
    Name: `J-Proficiency`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

J.PROF.Helpers = new Map();
J.PROF.Helpers.TranslateProficiencyRequirements = function(obj)
{
  const parsedBlob = JSON.parse(obj);
  const conditionals = [];
  parsedBlob.forEach(conditionalBlob =>
  {
    const parsedConditional = JSON.parse(conditionalBlob);

    const key = parsedConditional.key;
    const actorIdBlob = JSON.parse(parsedConditional.actorIds);
    const actorIds = actorIdBlob.map(parseInt);
    const skillrewardBlob = JSON.parse(parsedConditional.skillRewards);
    const skillRewards = skillrewardBlob.map(parseInt);
    const reward = parsedConditional.jsRewards;
    const requirements = [];

    const parsedRequirements = JSON.parse(parsedConditional.requirements);
    parsedRequirements.forEach(requirementBlob =>
    {
      const parsedRequirement = JSON.parse(requirementBlob);
      const requirement = new ProficiencyRequirement(
        parseInt(parsedRequirement.skillId),
        parseInt(parsedRequirement.proficiency))
      requirements.push(requirement);
    });

    const conditional = new ProficiencyConditional(key, actorIds, requirements, skillRewards, reward);
    conditionals.push(conditional);
  })

  return conditionals;
};

/**
 * The plugin's parameters extracted from the plugin manager.
 * @type {string}
 */
J.PROF.PluginParameters = PluginManager.parameters(J.PROF.Metadata.Name);
J.PROF.Metadata =
  {
    ...J.PROF.Metadata,

    /**
     * The master collection from the plugin metadata that represents all unlockable
     * prof requirements.
     * @type {ProficiencyConditional[]}
     */
    ProficiencyConditionals: J.PROF.Helpers.TranslateProficiencyRequirements(J.PROF.PluginParameters['conditionals'])
  };

/**
 * The various aliases associated with this plugin.
 */
J.PROF.Aliased =
  {
    DataManager: new Map(),
    Game_Actor: new Map(),
    Game_Action: new Map(),
    Game_Battler: new Map(),
    Game_Enemy: new Map(),
    Game_Party: new Map(),
  };
//#endregion Introduction

//#region Static objects
//#region PluginManager
/**
 * Plugin command for modifying proficiency for one or more actors for one or more skills by a given amount.
 */
PluginManager.registerCommand(J.PROF.Metadata.Name, "modifyActorSkillProficiency", args =>
{
  let {actorIds, skillIds, amount} = args;
  const parsedActorIds = JSON.parse(actorIds).map(num => parseInt(num));
  const parsedSkillIds = JSON.parse(skillIds).map(num => parseInt(num));
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
  let {skillIds, amount} = args;
  const parsedSkillIds = JSON.parse(skillIds).map(num => parseInt(num));
  amount = parseInt(amount);
  $gameParty.members().forEach(actor =>
  {
    parsedSkillIds.forEach(skillId =>
    {
      actor.increaseSkillProficiency(skillId, amount);
    });
  });
});
//#endregion PluginManager

//#region DataManager
/**
 * Extends the save content extraction to include updating to the latest plugin metadata.
 */
J.PROF.Aliased.DataManager.set("extractSaveContents", DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
  J.PROF.Aliased.DataManager.get("extractSaveContents").call(this, contents);
  $gameParty._j._conditionals = J.PROF.Metadata.ProficiencyConditionals;
  $gameActors._data.forEach(actor =>
  {
    // the first actor in this array is null, just skip it.
    if (!actor) return;

    // update all their conditionals with the latest.

    actor.updateOwnConditionals();
  });

};
//#endregion DataManager
//#endregion Static objects

//#region Game objects
//#region Game_Action
/**
 * Extends the .apply() to include consideration of prof.
 */
J.PROF.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  J.PROF.Aliased.Game_Action.get("apply").call(this, target);

  const result = target.result();

  // we only process prof gains for actors- for now.
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
  const isHit = target.result().isHit();
  if (!isHit) return false;

  // only gain proficiency if the target allows it.
  const canGiveProficiency = target.canGiveProficiency();
  if (!canGiveProficiency) return false;

  // only gain proficiency if the attacker allows it.
  const canGainProficiency = this.subject().canGainProficiency();
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
    const skillProficiency = this.subject().skillProficiencyBySkillId(skill.id);
    if (skillProficiency)
    {
      return skillProficiency.proficiency;
    }
  }

  return 0;
};

//#endregion Game_Action

//#region Game_Actor
/**
 * Adds new properties to the actors that manage the skill prof system.
 */
J.PROF.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  J.PROF.Aliased.Game_Actor.get("initMembers").call(this);
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all boosts this actor has can potentially consume.
   * @type {SkillProficiency[]}
   */
  this._j._proficiencies ||= [];

  /**
   *
   * @type {ProficiencyConditional[]}
   */
  this._j._ownConditionals = [];

  /**
   * All conditionals that have been unlocked by this actor.
   * @type {string[]}
   */
  this._j._unlockedConditionals ||= [];
};

/**
 * Extends the setup of an actor to include setting up all the skill
 * proficiency conditionals for this actor.
 */
J.PROF.Aliased.Game_Actor.set("setup", Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId)
{
  J.PROF.Aliased.Game_Actor.get("setup").call(this, actorId);
  this.updateOwnConditionals();
};

/**
 * Updates this actor's own conditionals with the latest ones from the plugin metadata.
 */
Game_Actor.prototype.updateOwnConditionals = function()
{
  this._j._ownConditionals = $gameParty
    .proficiencyConditionals()
    .filter(conditional => conditional.actorIds.includes(this.actorId()));
};

/**
 * Gets all of this actor's skill proficiency conditionals, locked and unlocked.
 * @returns {ProficiencyConditional[]}
 */
Game_Actor.prototype.proficiencyConditionals = function()
{
  return this._j._ownConditionals;
};

/**
 * Gets all of this actor's skill proficiency conditionals
 * that include a requirement of the provided skillId.
 * @param {number} skillId The skill id to find conditionals for.
 * @returns {ProficiencyConditional[]}
 */
Game_Actor.prototype.proficiencyConditionalBySkillId = function(skillId)
{
  const filtering = (conditional) => conditional.requirements.some(requirement => requirement.skillId === skillId);
  return this.proficiencyConditionals().filter(filtering);
};

/**
 * Checks whether or not a conditional has been unlocked by its key.
 * @param key {string} The key of the conditional.
 * @returns {boolean}
 */
Game_Actor.prototype.isConditionalLocked = function(key)
{
  return this._j._unlockedConditionals.includes(key);
};

/**
 * Gets all currently locked skill proficiency conditionals.
 * @returns {ProficiencyConditional[]}
 */
Game_Actor.prototype.lockedConditionals = function()
{
  const filtering = (conditional) => !this._j._unlockedConditionals.includes(conditional.key);
  return this._j._ownConditionals.filter(filtering);
};

/**
 * Unlocks a skill proficiency conditional by its key.
 * @param key {string} The key of the conditional.
 */
Game_Actor.prototype.unlockConditional = function(key)
{
  if (this._j._unlockedConditionals.includes(key))
  {
    console.warn(`Attempted to unlock conditional: [${key}], but it was already unlocked.`);
    return;
  }

  this._j._unlockedConditionals.push(key);
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
  const skillRewards = conditional.skillRewards;

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
  const jsRewards = c.jsRewards;
  try
  {
    eval(jsRewards);
  }
  catch (error)
  {
    console.error(`there was an error executing the reward for: ${c.key}.`);
    console.log(error);
  }
};

/**
 * Gets all skill proficiencies for this actor.
 * @returns {SkillProficiency[]}
 */
Game_Actor.prototype.skillProficiencies = function()
{
  return this._j._proficiencies;
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
    .find(prof => prof.skillId === skillId);
};

/**
 * A safe means of attempting to retrieve a skill proficiency. If the proficiency
 * does not exist, then it will be created.
 * @param skillId
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
 * Adds a new skill prof to the collection.
 * @param {number} skillId The skill id.
 * @param {number} initialProficiency Optional. The starting prof.
 * @returns {SkillProficiency}
 */
Game_Actor.prototype.addSkillProficiency = function(skillId, initialProficiency = 0)
{
  const exists = this.skillProficiencyBySkillId(skillId);
  if (exists)
  {
    console.warn(`Attempted to recreate skill proficiency for skillId: ${skillId}.`);
    return exists;
  }

  const proficiency = new SkillProficiency(skillId, initialProficiency);
  this._j._proficiencies.push(proficiency);
  this._j._proficiencies.sort();
  return proficiency;
};

/**
 * Extends skill learning to add new skill proficiencies if we learned new skills.
 */
J.PROF.Aliased.Game_Actor.set("learnSkill", Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId)
{
  const beforeSkillCount = this.skills().length;
  J.PROF.Aliased.Game_Actor.get("learnSkill").call(this, skillId);
  const afterSkillCount = this.skills().length;
  if (beforeSkillCount !== afterSkillCount)
  {
    this.addSkillProficiency(skillId);
  }
};

/**
 * Improves the skill prof by a given amount (defaults to 1).
 * @param {number} skillId The skill id.
 * @param {number} amount The amount to improve the prof by.
 */
Game_Actor.prototype.increaseSkillProficiency = function(skillId, amount = 1)
{
  let proficiency = this.skillProficiencyBySkillId(skillId);

  // if the proficiency doesn't exist, create it first.
  if (!proficiency)
  {
    proficiency = this.addSkillProficiency(skillId);
  }

  proficiency.improve(amount);
  this.checkProficiencyConditionals();
};

/**
 * Check all proficiency conditionals to see if any of them are now met.
 */
Game_Actor.prototype.checkProficiencyConditionals = function()
{
  const lockedConditionals = this.lockedConditionals();

  // if we don't have any locked conditionals, then don't process.
  if (!lockedConditionals.length)
  {
    return;
  }

  // check each locked conditional to see if we can unlock it.
  lockedConditionals.forEach(conditional =>
  {
    // check all requirements to see if we met them all.
    const requirementCount = conditional.requirements.length;
    let requirementsMet = 0;
    for (const requirement of conditional.requirements)
    {
      const currentProficiency = this.skillProficiencyBySkillId(requirement.skillId);
      if (!currentProficiency)
      {
        break;
      }

      // check if the proficiency for the skill has reached or exceeded the conditional.
      if (currentProficiency.proficiency >= requirement.proficiency)
      {
        requirementsMet++;
      }
    }

    // check if the requirement count equals the requirements now met.
    if (requirementsMet === requirementCount)
    {
      this.unlockConditional(conditional.key);
      this.executeConditionalReward(conditional);
    }
  });
};

/**
 * Calculates total amount of bonus proficiency gain when gaining skill proficiency.
 * @returns {number}
 */
Game_Actor.prototype.bonusSkillProficiencyGains = function()
{
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<proficiencyBonus:[ ]?([0-9]*)>/i;
  let bonusProficiency = 0;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        bonusProficiency += parseInt(RegExp.$1);
      }
    });
  });

  return bonusProficiency;
};
//#endregion Game_Actor

//#region Game_Battler
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
 * @returns {number}
 */
Game_Battler.prototype.skillProficiencyBySkillId = function(skillId)
{
  return 0;
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
  // get whether or not they are blocked from giving proficiency.
  const canGiveProficiency = this.extractProficiencyGivingBlock();

  // return the outcome.
  return canGiveProficiency;
};

/**
 * Determines whether or not this battler can give proficiency gains.
 * @returns {number}
 */
Game_Battler.prototype.extractProficiencyGivingBlock = function()
{
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<proficiencyGivingBlock>/i;
  let canGiveProficiency = true;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        canGiveProficiency = false;
      }
    });
  });

  return canGiveProficiency;
};

/**
 * Whether or not this battler can gain proficiency from using skills.
 * @returns {boolean} True if the battler can gain proficiency, false otherwise.
 */
Game_Battler.prototype.canGainProficiency = function()
{
  // get whether or not they are blocked from gaining proficiency.
  const canGainProficiency = this.extractProficiencyGainingBlock();

  // return the outcome.
  return canGainProficiency;
};

/**
 * Determines whether or not this battler can gain proficiency.
 * @returns {number}
 */
Game_Battler.prototype.extractProficiencyGainingBlock = function()
{
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<proficiencyGainingBlock>/i;
  let canGainProficiency = true;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        canGainProficiency = false;
      }
    });
  });

  return canGainProficiency;
};
//#endregion Game_Battler

//#region Game_Enemy
J.PROF.Aliased.Game_Enemy.set("initMembers", Game_Enemy.prototype.initMembers);
Game_Enemy.prototype.initMembers = function()
{
  J.PROF.Aliased.Game_Enemy.get("initMembers").call(this);

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
//#endregion Game_Enemy

//#region Game_Party
J.PROF.Aliased.Game_Party.set("initialize", Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  J.PROF.Aliased.Game_Party.get("initialize").call(this);
  /**
   * The j object where my extensions live.
   */
  this._j ||= {};

  /**
   * The master collection of proficiency conditionals.
   * @type {ProficiencyConditional[]}
   */
  this._j._conditionals = J.PROF.Metadata.ProficiencyConditionals;
};

/**
 * Gets all proficiency conditionals available to the party.
 * @returns {ProficiencyConditional[]}
 */
Game_Party.prototype.proficiencyConditionals = function()
{
  return this._j._conditionals;
};
//#endregion Game_Party
//#endregion Game objects