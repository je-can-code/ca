//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 SKILL] Extends the capabilities of skills.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ============================================================================
 * This plugin enables the ability to have a single skill be represented by
 * one or more other skills a given battler has learned. Extended skills are
 * effectively skills that have the combined effects of multiple skills.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.EXTEND = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.EXTEND.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-SkillExtend`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.EXTEND.Aliased = {
  Game_Action: new Map(),
  Game_Item: new Map(),
};
//#endregion Introduction

//#region Game objects

//#region Game_Action
/**
 * Basically replaces `setSkill()` with setting the skill to instead set our extended skill.
 */
J.EXTEND.Aliased.Game_Action.set('setSkill', Game_Action.prototype.setSkill);
Game_Action.prototype.setSkill = function(skillId)
{
  if (!this.subject())// || !this.subject().isActor())
  {
    J.EXTEND.Aliased.Game_Action.get('setSkill').call(this, skillId);
    return;
  }

  const skillToSet = OverlayManager.getExtendedSkill(this.subject(), skillId);
  this._item.setObject(skillToSet);
};

/**
 * Extends `apply()` to include applying states to one-self.
 */
J.EXTEND.Aliased.Game_Action.set('apply', Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  J.EXTEND.Aliased.Game_Action.get('apply').call(this, target);
  this.applyOnHitSelfStates();
};

/**
 * Applies all applicable on-hit self states.
 */
Game_Action.prototype.applyOnHitSelfStates = function()
{
  const caster = this.subject();
  if (!caster)
  {
    // if we don't have a caster, then do nothing.
    return;
  }

  // check for all self-inflictable states on this skill.
  const selfStates = this.onHitSelfStates();
  this.applyStates(caster, selfStates);
};

/**
 * Applies all applicable on-cast self states.
 */
Game_Action.prototype.applyOnCastSelfStates = function()
{
  const caster = this.subject();
  if (!caster)
  {
    // if we don't have a caster, then do nothing.
    return;
  }

  // check for all self-inflictable states on this skill.
  const selfStates = this.onCastSelfStates();
  this.applyStates(caster, selfStates);
};

/**
 * Gets all possible states that could be self-inflicted
 * when this skill hits a target.
 * @returns {JABS_SkillChance[]}
 */
Game_Action.prototype.onHitSelfStates = function()
{
  // get the skill and its overlays.
  const skill = this.item();
  const structure = /<onHitSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
  const stateChances = [];

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  const chances = J.BASE.Helpers.parseSkillChance(structure, skill);
  stateChances.push(...chances);

  return stateChances;
};

/**
 * Gets all possible states that could be self-inflicted
 * when casting this skill.
 * @returns {JABS_SkillChance[]}
 */
Game_Action.prototype.onCastSelfStates = function()
{
  // get the skill and its overlays.
  const skill = this.item();
  const structure = /<onCastSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
  const stateChances = [];

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  const chances = J.BASE.Helpers.parseSkillChance(structure, skill);
  stateChances.push(...chances);

  return stateChances;
};

/**
 * Applies the given states to the target.
 * @param target {Game_Actor|Game_Enemy} The targe to apply states to.
 * @param stateChances {JABS_SkillChance[]} The various states to potentially apply.
 */
Game_Action.prototype.applyStates = function(target, stateChances)
{
  if (stateChances.length)
  {
    // iterate over each of them and see if we should apply them.
    stateChances.forEach(stateChance => {
      // if the RNG favors this caster...
      if (stateChance.shouldTrigger())
      {
        // ...then we apply the given state.
        target.addState(stateChance.skillId);
      }
    });
  }
};
//#endregion Game_Action

//#region Game_Item
/**
 * Extend `initialize()` to include our update of assigning the item.
 */
J.EXTEND.Aliased.Game_Item.set('initialize', Game_Item.prototype.initialize);
Game_Item.prototype.initialize = function(item) {
  J.EXTEND.Aliased.Game_Item.get('initialize').call(this, item);
  /**
   * The underlying object associated with this item.
   * @type {rm.types.EquipItem|rm.types.UsableItem}
   */
  this._item = null;
  if (item)
  {
    this._item = item;
  }
};

/**
 * Extends this function for actually writing the object to the item so
 * that it can be retrieved later if it was a custom object (like an extended skill).
 */
J.EXTEND.Aliased.Game_Item.set('setObject', Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(item)
{
  J.EXTEND.Aliased.Game_Item.get('setObject').call(this, item);
  if (!item) return;

  // for extending skills, if its a skill, we should assign the extended skill
  // for later retrieval.
  if (item.hasOwnProperty('stypeId'))
  {
    this._dataClass = 'skill';
    this._item = item;
  }
};

/**
 * Extends this function to return the underlying custom object (like an extended skill)
 * if it was assigned.
 */
J.EXTEND.Aliased.Game_Item.set('object', Game_Item.prototype.object);
Game_Item.prototype.object = function() {
  // if we have a custom object to return, return that.
  if (this._item)
  {
    return this._item;
  }

  return J.EXTEND.Aliased.Game_Item.get('object').call(this);
};
//#endregion Game_Item
//#endregion Game objects

//#region Custom objects

//#region OverlayManager
/**
 * A static class for managing the overlaying of one skill onto another.
 * The methods are divided by the attribute they overlay.
 */
class OverlayManager {
  constructor() { throw new Error('The OverlayManager is a static class.'); }

  /**
   * Gets the extended skill based on the caster's learned skills.
   * @param caster {Game_Actor|Game_Enemy} The caster of the skill.
   * @param skillId {number} The base skill to extend.
   * @returns {rm.types.Skill}
   */
  static getExtendedSkill(caster, skillId)
  {
    // if we don't have a caster for some reason, don't process anything.
    if (!caster)
    {
      console.warn(`no caster was provided to check skill extensions for skillId: ${skillId}.`);
      return $dataSkills[skillId];
    }

    // make a copy of the original skill to be overlayed.
    const baseSkill = JsonEx.makeDeepCopy($dataSkills[skillId]);

    // the filter for filtering whether or not a skill is an extension skill.
    const skillExtendFilter = (skill) => {
      // if the skill isn't an extension skill, skip it.
      const isExtensionSkill = !!(skill.meta && skill.meta['skillExtend']);
      if (!isExtensionSkill) return false;

      const skillsExtended = JSON.parse(skill.meta['skillExtend']).map(parseInt);
      return skillsExtended.includes(skillId);
    };

    // get all skills we can extend this skillId with.
    const filteredSkills = caster
      .skills()
      .filter(skillExtendFilter);
    const skillExtendSkills = [...filteredSkills];

    // based on the number of skill extend skills we have...
    switch (skillExtendSkills.length)
    {
      // there was no skills to extend with.
      case 0: return baseSkill;

      // we found one skill to extend with.
      case 1: return this.extendSkill(baseSkill, skillExtendSkills[0]);

      // there are many skills to extend with sequentially.
      default:
        const reducer = (skillPreviously, skillOverlay) => this.extendSkill(skillPreviously, skillOverlay);
        return skillExtendSkills.reduce(reducer, baseSkill);
    }
  };

  /**
   * Merges the skill overlay onto the base skill and returns the updated base skill.
   * @param baseSkill {rm.types.Skill} The base skill to be overlayed.
   * @param skillOverlay {rm.types.Skill} The skill to overlay with.
   * @returns {rm.types.Skill} The base skill overlayed with the overlay skill.
   */
  static extendSkill(baseSkill, skillOverlay)
  {
    // merge all of the base skill data.
    baseSkill = this.baseSkillData(baseSkill, skillOverlay);

    // if we both have JABS skill data...
    if (baseSkill._j && skillOverlay._j)
    {
      // lets merge them.
      baseSkill = this.overwrite(baseSkill, skillOverlay);
    }

    // sanitize the skill extends out of the base skill to prevent recursive extensions.
    baseSkill = this.sanitizeBaseSkill(baseSkill);

    // return the base skill merged with the overlay.
    return baseSkill;
  };

  /**
   * Overlays `skillOverlay` onto the `baseSkill`.
   *
   * All parameters that the `skillOverlay` and `baseSkill` share will
   * be overridden by the `skillOverlay` values. Any parameters the
   * `skillOverlay` has that the `baseSkill` lacks will be added anew.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static overwrite(baseSkill, skillOverlay)
  {
    baseSkill = this.cooldown(baseSkill, skillOverlay);
    baseSkill = this.range(baseSkill, skillOverlay);
    baseSkill = this.proximity(baseSkill, skillOverlay);
    baseSkill = this.actionId(baseSkill, skillOverlay);
    baseSkill = this.duration(baseSkill, skillOverlay);
    baseSkill = this.shape(baseSkill, skillOverlay);
    baseSkill = this.piercing(baseSkill, skillOverlay);
    baseSkill = this.knockback(baseSkill, skillOverlay);
    baseSkill = this.poseSuffix(baseSkill, skillOverlay);
    baseSkill = this.casterAnimation(baseSkill, skillOverlay);
    baseSkill = this.castTime(baseSkill, skillOverlay);
    baseSkill = this.freeCombo(baseSkill, skillOverlay);
    baseSkill = this.combo(baseSkill, skillOverlay);
    baseSkill = this.direct(baseSkill, skillOverlay);
    baseSkill = this.bonusAggro(baseSkill, skillOverlay);
    baseSkill = this.aggroMultiplier(baseSkill, skillOverlay);
    baseSkill = this.getBonusHits(baseSkill, skillOverlay);
    baseSkill = this.guard(baseSkill, skillOverlay);
    baseSkill = this.counterParry(baseSkill, skillOverlay);
    baseSkill = this.counterGuard(baseSkill, skillOverlay);
    baseSkill = this.projectile(baseSkill, skillOverlay);
    baseSkill = this.uniqueCooldown(baseSkill, skillOverlay);
    baseSkill = this.moveType(baseSkill, skillOverlay);

    return baseSkill;
  };

//#region overwrites
  /**
   * Overlays the base skill data.
   *
   * Effects, meta, note, and repeats are combined.
   *
   * Scope, mpCost, tpCost, and tpGain are replaced.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static baseSkillData(baseSkill, skillOverlay)
  {
    // if the overlay damage type isn't "none", then overlay those values.
    if (skillOverlay.damage.type)
    {
      // if the critical toggle doesn't match...
      if (baseSkill.damage.critical !== skillOverlay.damage.critical)
      {
        // overwrite the critical toggle.
        baseSkill.damage.critical = skillOverlay.damage.critical;
      }

      // overwrite the base element.
      if (baseSkill.damage.elementId !== skillOverlay.damage.elementId)
      {
        baseSkill.damage.elementId = skillOverlay.damage.elementId;
      }

      // overwrite damage type.
      if (baseSkill.damage.type !== skillOverlay.damage.type)
      {
        // allow upgrading hp-damage >> hp-drain.
        if (baseSkill.damage.type === 1 && skillOverlay.damage.type === 5)
        {
          baseSkill.damage.type = 5;
        }
        // allow upgrading mp-damage >> mp-drain.
        else if (baseSkill.damage.type === 2 && skillOverlay.damage.type === 6)
        {
          baseSkill.damage.type = 5;
        }

        // otherwise, overwrite damage type.
        // TODO: when stacking damage types, update here.
      }

      // overwrite the variance.
      if (baseSkill.damage.variance !== skillOverlay.damage.variance)
      {
        baseSkill.damage.variance = skillOverlay.damage.variance;
      }

      // if the overlay formula is present, and doesn't match the base skill...
      if (skillOverlay.damage.formula && baseSkill.damage.formula !== skillOverlay.damage.formula)
      {
        // overwrite the formula.
        baseSkill.damage.formula = skillOverlay.damage.formula;
      }
    }

    // combine the effects.
    baseSkill.effects = baseSkill.effects.concat(skillOverlay.effects);

    // combine the meta together.
    baseSkill.meta = {
      ...baseSkill.meta,
      ...skillOverlay.meta,
    }

    // append the notes.
    baseSkill.note += skillOverlay.note;

    // combine repeats.
    baseSkill.repeats += (skillOverlay.repeats - 1);

    // overwrite scope.
    if (baseSkill.scope !== skillOverlay.scope)
    {
      //! TODO: extend, don't overwrite!
      baseSkill.scope = skillOverlay.scope;
    }

    // overwrite mp costs.
    if (baseSkill.mpCost !== skillOverlay.mpCost)
    {
      baseSkill.mpCost = skillOverlay.mpCost;
    }

    // overwrite tp costs.
    if (baseSkill.tpCost !== skillOverlay.tpCost)
    {
      baseSkill.tpCost = skillOverlay.tpCost;
    }

    // combine the tp gains.
    baseSkill.tpGain += skillOverlay.tpGain;

    // if both hit types are NOT "certain hit", then overwrite them.
    if (baseSkill.hitType && skillOverlay.hitType)
    {
      baseSkill.hitType = skillOverlay.hitType;
    }

    /*
    NOTE:
      the 'occasion' should not be changed!
      that can result in unexpected/unwanted behavior!
    */

    // sanitize the base skill from all skill extend shenanigans.
    baseSkill = this.sanitizeBaseSkill(baseSkill);

    return baseSkill;
  };

  /**
   * Purges all references to the skill extend tag and functionality
   * from the `baseSkill`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static sanitizeBaseSkill(baseSkill)
  {
    // purge out the skill extends from the baseSkill.
    baseSkill.note.replace(/<skillExtend:\[[\d,]+]>/gmi, '');

    // purge out the skill extends from the baseSkill.
    if (baseSkill.meta && baseSkill.meta['skillExtend'])
    {
      delete baseSkill.meta['skillExtend'];
    }

    // purge out the skill extends from the JABS skill data.
    if (baseSkill._j)
    {
      // if it exists in the meta object, delete it.
      if (baseSkill._j._meta && baseSkill._j._meta['skillExtend'])
      {
        delete baseSkill._j._meta['skillExtend'];
      }

      // if it exists in the note object, splice it.
      const skillExtendNoteIndex = baseSkill._j._notes.findIndex(note => note.includes('skillExtend'))
      if (skillExtendNoteIndex !== -1)
      {
        baseSkill._j._notes.splice(skillExtendNoteIndex, 1);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `moveType`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static moveType(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.moveType())
    {
      const parameterName = J.BASE.Notetags.MoveType;
      const parameterValue = `<${parameterName}:${skillOverlay._j.moveType()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `uniqueCooldown`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static uniqueCooldown(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.uniqueCooldown())
    {
      const parameterName = J.BASE.Notetags.UniqueCooldown;
      const parameterValue = `<${parameterName}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        // the skill already has unique cooldowns, so don't do anything.
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `projectile`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static projectile(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.projectile())
    {
      const parameterName = J.BASE.Notetags.Projectile;
      const parameterValue = `<${parameterName}:${skillOverlay._j.projectile()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `counterGuard`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static counterGuard(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.counterGuard())
    {
      const parameterName = J.BASE.Notetags.CounterGuard;
      const parameterValue = `<${parameterName}:${skillOverlay._j.counterGuard()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `counterParry`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static counterParry(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.counterParry())
    {
      const parameterName = J.BASE.Notetags.CounterParry;
      const parameterValue = `<${parameterName}:${skillOverlay._j.counterParry()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `parry`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static parry(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.parry())
    {
      const parameterName = J.BASE.Notetags.Parry;
      const parameterValue = `<${parameterName}:${skillOverlay._j.parry()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `guard`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static guard(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.guard())
    {
      const parameterName = J.BASE.Notetags.Guard;
      const parameterValue = `<${parameterName}:[${skillOverlay._j.guard()}]>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `getBonusHits`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static getBonusHits(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.getBonusHits())
    {
      const parameterName = J.BASE.Notetags.BonusHits;
      const parameterValue = `<${parameterName}:${skillOverlay._j.getBonusHits()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `aggroMultiplier`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static aggroMultiplier(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.aggroMultiplier())
    {
      const parameterName = J.BASE.Notetags.AggroMultiplier;
      const parameterValue = `<${parameterName}:${skillOverlay._j.aggroMultiplier().toFixed(2)}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `bonusAggro`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static bonusAggro(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.bonusAggro())
    {
      const parameterName = J.BASE.Notetags.Aggro;
      const parameterValue = `<${parameterName}:${skillOverlay._j.bonusAggro()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `direct`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static direct(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.direct())
    {
      const parameterName = J.BASE.Notetags.DirectSkill;
      const parameterValue = `<${parameterName}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        // the skill is already direct, so don't do anything.
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `combo`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static combo(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.combo())
    {
      const parameterName = J.BASE.Notetags.Combo;
      const parameterValue = `<${parameterName}:[${skillOverlay._j.combo()}]>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `freeCombo`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static freeCombo(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.freeCombo())
    {
      const parameterName = J.BASE.Notetags.FreeCombo;
      const parameterValue = `<${parameterName}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        // the skill is already free combo, so don't do anything.
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `castTime`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static castTime(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.castTime())
    {
      const parameterName = J.BASE.Notetags.CastTime;
      const parameterValue = `<${parameterName}:${skillOverlay._j.castTime()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `casterAnimation`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static casterAnimation(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.casterAnimation())
    {
      const parameterName = J.BASE.Notetags.CastAnimation;
      const parameterValue = `<${parameterName}:${skillOverlay._j.casterAnimation()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `poseSuffix`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static poseSuffix(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.poseSuffix())
    {
      const parameterName = J.BASE.Notetags.PoseSuffix;
      const parameterValue = `<${parameterName}:[${skillOverlay._j.poseSuffix()}]>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `knockback`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static knockback(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.knockback())
    {
      const parameterName = J.BASE.Notetags.Knockback;
      const parameterValue = `<${parameterName}:${skillOverlay._j.knockback()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `piercing`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static piercing(baseSkill, skillOverlay)
  {
    const piercing = skillOverlay._j.piercing();

    // the piercing is pointless if it is only one [1,#].
    const shouldOverlay = piercing[0] !== 1;
    if (shouldOverlay)
    {
      const parameterName = J.BASE.Notetags.Piercing;
      const parameterValue = `<${parameterName}:[${piercing}]>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `shape`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static shape(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.shape())
    {
      const parameterName = J.BASE.Notetags.Shape;
      const parameterValue = `<${parameterName}:${skillOverlay._j.shape()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        // add the shape modifier.
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `duration`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static duration(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.duration())
    {
      const parameterName = J.BASE.Notetags.Duration;
      const parameterValue = `<${parameterName}:${skillOverlay._j.duration()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `actionId`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static actionId(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.actionId() > 1)
    {
      const parameterName = J.BASE.Notetags.ActionId;
      const parameterValue = `<${parameterName}:${skillOverlay._j.actionId()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `proximity`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static proximity(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.proximity())
    {
      const parameterName = J.BASE.Notetags.Proximity;
      const parameterValue = `<${parameterName}:${skillOverlay._j.proximity()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `range`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static range(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.range())
    {
      const parameterName = J.BASE.Notetags.Range;
      const parameterValue = `<${parameterName}:${skillOverlay._j.range()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };

  /**
   * Overlays the `cooldown`.
   * @param baseSkill {rm.types.Skill} The base skill.
   * @param skillOverlay {rm.types.Skill} The overlay skill.
   * @returns {rm.types.Skill} The overlayed base skill.
   */
  static cooldown(baseSkill, skillOverlay)
  {
    if (skillOverlay._j.cooldown())
    {
      const parameterName = J.BASE.Notetags.Cooldown;
      const parameterValue = `<${parameterName}:${skillOverlay._j.cooldown()}>`;
      const noteIndex = baseSkill._j._notes.findIndex(note => note.includes(parameterName));
      if (noteIndex !== -1)
      {
        baseSkill._j._notes[noteIndex] = parameterValue;
      }
      else
      {
        baseSkill._j._notes.push(parameterValue);
      }
    }

    return baseSkill;
  };
//#endregion overwrites
}
//#endregion OverlayManager

//#endregion Custom objects
