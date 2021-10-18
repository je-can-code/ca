//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 PROF] Enables skill proficiency and condition triggers.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ============================================================================
 * This plugin enables the ability to have actors grow in proficiency when
 * using skills. Additionally, triggers can now be configured to execute
 * against these new proficiencies (and other things).
 * ============================================================================
 * ============================================================================
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
J.PROF.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-Proficiency`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.PROF.PluginParameters = PluginManager.parameters(J.PROF.Metadata.Name);
J.PROF.Metadata.BaseTpMaxActors = Number(J.PROF.PluginParameters['actorBaseTp']);
J.PROF.Metadata.BaseTpMaxEnemies = Number(J.PROF.PluginParameters['enemyBaseTp']);

J.PROF.Aliased = {
  Game_Actor: new Map(),
  Game_Action: new Map(),
  Game_Battler: new Map(),
  Game_Enemy: new Map(),
};
//#endregion Introduction

//#region Game objects
//#region Game_Action
/**
 * Extends the .apply() to include consideration of proficiency.
 */
J.PROF.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
  J.PROF.Aliased.Game_Action.get("apply").call(this, target);

  const result = target.result();

  // we only process proficiency gains for actors- for now.
  const canIncreaseProficiency = this.subject().isActor() && result.isHit() && this.isSkill();
  if (canIncreaseProficiency) {
    this.increaseProficiency(result.critical);
  }
};

/**
 * Increases the skill proficiency for the actor with the given skill.
 * @param {boolean} isCritical Whether or not the action was a crit.
 */
Game_Action.prototype.increaseProficiency = function(isCritical) {
  const caster = this.subject();
  const skill = this.item();
  if (!caster || !skill) {
    console.warn('attempted to improve proficiency for an invalid caster or skill.');
    return;
  }

  const amount = caster.baseSkillProficiencyAmount(isCritical);
  caster.increaseSkillProficiency(skill.id, amount);
};

/**
 * Gets the skill proficiency from this action's skill of the caster.
 * @returns {number}
 */
Game_Action.prototype.skillProficiency = function() {
  if (this.isSkill() && this.subject().isActor()) {
    const skill = this.item();
    const proficiency = this.subject().skillProficiencyBySkillId(skill.id);
    if (proficiency) {
      const skillProficiency = this.subject().skillProficiencyBySkillId(skill.id).proficiency;
      return skillProficiency;
    }
  }

  return 0;
};

//#endregion Game_Action

//#region Game_Actor
/**
 * Adds new properties to the actors that manage the skill proficiency system.
 */
J.PROF.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function() {
  J.PROF.Aliased.Game_Actor.get("initMembers").call(this);

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
 * Gets all skill proficiencies for this actor.
 * @returns {SkillProficiency[]}
 */
Game_Actor.prototype.skillProficiencies = function() {
  return this._j._profs;
};

/**
 * Gets a skill proficiency by its skill id.
 * @param {number} skillId The skill id.
 * @returns {SkillProficiency?}
 */
Game_Actor.prototype.skillProficiencyBySkillId = function(skillId) {
  return this
    .skillProficiencies()
    .find(prof => prof.skillId === skillId);
};

/**
 * Adds a new skill proficiency to the collection.
 * @param {number} skillId The skill id.
 * @param {number} initialProficiency Optional. The starting proficiency.
 * @returns {SkillProficiency}
 */
Game_Actor.prototype.addSkillProficiency = function(skillId, initialProficiency = 0) {
  const exists = this.skillProficiencyBySkillId(skillId);
  if (exists) {
    console.warn(`Attempted to recreate skill proficiency for skillId: ${skillId}.`);
    return exists;
  }

  const proficiency = new SkillProficiency(skillId, initialProficiency);
  this._j._profs.push(proficiency);
  this._j._profs.sort();
  return proficiency;
};

/**
 * Extends skill learning to add new skill proficiencies if we learned new skills.
 */
J.PROF.Aliased.Game_Actor.set("learnSkill", Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId) {
  const beforeSkillCount = this._skills.length;
  J.PROF.Aliased.Game_Actor.get("learnSkill").call(this, skillId);
  const afterSkillCount = this._skills.length;
  if (beforeSkillCount !== afterSkillCount) {
    this.addSkillProficiency(skillId);
  }
};

/**
 * Improves the skill proficiency by a given amount (defaults to 1).
 * @param {number} skillId The skill id.
 * @param {number} amount The amount to improve the proficiency by.
 */
Game_Actor.prototype.increaseSkillProficiency = function(skillId, amount = 1) {
  let proficiency = this.skillProficiencyBySkillId(skillId);

  // if the proficiency doesn't exist, create it first then improve it.
  if (!proficiency) {
    proficiency = this.addSkillProficiency(skillId);
  }

  proficiency.improve(amount);
};

Game_Actor.prototype.baseSkillProficiencyAmount = function(isCritical) {
  let base = 1;
  if (isCritical) {
    base += 1;
  }

  return base;
};
//#endregion Game_Actor

//#region Game_Battler
Game_Battler.prototype.skillProficiencies = function() {
  return [];
};

Game_Battler.prototype.skillProficiencyBySkillId = function(/* skillId */) {
  return null;
};
//#endregion Game_Battler

//#region Game_Enemy
//#endregion Game_Enemy

//#endregion Game objects