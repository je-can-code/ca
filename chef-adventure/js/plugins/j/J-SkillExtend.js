//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 EXTEND] Extends the capabilities of skills/actions.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * ============================================================================
 * This plugin extends the functionality of skills. It features additional
 * functionality that allow you to leverage new strategies in skill learning
 * and game development.
 *
 * DETAILS:
 * The new functionalities available are as follows:
 * - Skills extending skills.
 * - On-hit self-state application.
 * - On-cast self-state application.
 * ============================================================================
 * SKILL EXTENSION:
 * Have you ever wanted to have a single skill gain additional effects by
 * learning other skills? Well now you can! By applying the appropriate tag to
 * the skill(s) in question, you too can have skills that can progressively
 * gain additional upgrades/capabilities as a battler learns more skills!
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <skillExtend:[NUM]>
 *  <skillExtend:[NUM,NUM,...]>
 * Where NUM is the skill id to extend.
 *
 * TAG EXAMPLES:
 *  <skillExtend:[40]>
 * This skill will act as an extension to skill of id 40.
 *
 *  <skillExtend:[7,8,9,10,11]>
 * This skill will act as an extension to all skills of id 7, 8, 9, 10, and 11.
 * ============================================================================
 * WHAT DOES "ACT AS AN EXTENSION" MEAN?
 * ============================================================================
 * This section of information is so important that it gets its own headline!
 *
 * Lets pretend that in our fictional example, skill id 40 maps to "Fireball".
 * We want to extend our "Fireball" skill in some way by using this skill's
 * data points. What might that look like? It can manifest in a variety of
 * ways, but with this plugin, we use extension skills as OVERRIDES or AUGMENTS
 * to the base skill. Thusly, if this skill were some kind of upgrade, you
 * could fill in the damage formula to maybe have higher multipliers, and
 * add some extra repeats (offset of +1). The changes in the skill will overlay
 * the base skill's parameters and apply BEFORE the skill's execution. You
 * can see below for a comprehensive list of what happens to the base skill
 * based on an extension skill.
 *
 * NOTE:
 * Effects are only added or updated. Tags cannot be removed by this plugin
 * with the single exception of the extend tag.
 *
 * Comprehensive breakdown of how things are overridden:
 *  If a damage type is checked:
 *    - yes/no critical option is replaced.
 *    - base element id is replaced.
 *    - allowed upgrade of "hp damage" >> "hp drain" (but not cross or reverse)
 *    - allowed upgrade of "mp damage" >> "mp drain" (but not cross or reverse)
 *    - damage variance is replaced.
 *    - the formula itself is replaced if it is not completely empty.
 *  Other sections include:
 *    - the "effects" section of the skill just adds right into the base skill.
 *    - the two "meta" objects are merged with the extension skill's priority.
 *    - the extension skill's "note" object is appended onto the base skill's.
 *    - the repeats are added onto the base (offset of +1).
 *    - the speed is added onto the base.
 *    - the success is added onto the base (only if not same or equal to 100).
 *    - the scope is replaced.
 *    - the mp cost is replaced.
 *    - the tp cost is replaced.
 *    - the tp gain is added onto the base.
 *    - if the hit type section is not "certain hit", then it replaces.
 *    - both message lines are replaced.
 *  Base data things of note:
 *    - the "occasion" is not changeable.
 *    - though "note" objects are appended, the tag for extension is removed
 *      to prevent recursive behaviors in skill extension. This removal is
 *      only for this execution of the skill for overlay purposes only.
 *    - the editor's speed cap of +/-2000 is not respected!
 *    - the editor's success cap of 0-100 is not respected!
 *  If using JABS, the following data points are added if missing or if
 * they already exist on the base skill, their values are updated:
 *  - moveType (???)
 *  - projectile
 *  - counterGuard (***)
 *  - counterParry (***)
 *  - parry (***)
 *  - guard (***)
 *  - bonusHits
 *  - aggroMultiplier
 *  - bonusAggro
 *  - combo (!!!)
 *  - castTime
 *  - castAnimation
 *  - poseSuffix
 *  - knockback
 *  - piercing
 *  - shape
 *  - duration
 *  - actionId (!!!)
 *  - proximity
 *  - range
 *  - cooldown
 * If using JABs, the following datapoints will simply continue to exist
 * because they are idempotent traits:
 *  - uniqueCooldown
 *  - direct (!!!)
 *  - freeCombo
 *
 * ???:
 *  The effects of adding the "moveType" tag onto a skill that didn't
 *  previously have it are completely untested, use at your own risk!
 * ***:
 *  The effects of adding the "counterGuard/counterParry" tags onto a skill
 *  that didn't previously have it are untested, though shouldn't cause any
 *  problems if they are added onto a skill with "guard & parry".
 * !!!:
 *  The effects of adding the "combo/actionId/direct" tags onto any skills is
 *  something to be careful about, as they very significantly change how
 *  the manager interacts with the actions. Replacing any of those values
 *  though should be totally fine if they already existed on the base skill.
 *
 * With that in mind, it is strongly recommended that you copy-paste the base
 * skill into the extension skill slot in your RMMZ editor database skill tab
 * to start your extension (or another skill extension of the same skill
 * perhaps)!
 * ============================================================================
 * SELF-STATE APPLICATION:
 * Have you ever wanted a battler to be able to inflict themselves with a state
 * upon execution of a skill? Well now you can! By applying the appropriate tag
 * to the skill(s) in question, you too can have battlers that are applying
 * states of any kind to themselves!
 *
 * NOTE 1:
 * State resistance is not taken into account in regards to the CHANCE of the
 * various self-state effects. It is assumed that the percent chance designated
 * in the tag is fully representative of the chance that the state will be
 * applied to the caster.
 *
 * NOTE 2:
 * In addition to JABS multiple projectiles triggering the on-hit effect
 * multiple times, having a skill "repeat", or in JABS have multiple hits on
 * the skill, will both result in triggering the on-hit effect multiple times.
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <onCastSelfState:[STATE_ID,CHANCE]>
 *  <onHitSelfState:[STATE_ID,CHANCE]>
 * Where STATE_ID is the id of the state to apply.
 * Where CHANCE is the percent chance between 0 and 100 that it'll apply.
 *
 * TAG EXAMPLES:
 *  <onCastSelfState:[3,40]>
 * The caster has a 40% chance of applying state w/ id of 3 to oneself.
 * When using JABS, this applies as soon as the skill/action is executed.
 * When using non-JABS, this applies in the same phase as you would gain TP
 * from executing a skill.
 *
 *  <onHitSelfState:[19,100]>
 * The caster has a 100% (always) chance of appling state id 19 to oneself.
 * This processes as soon as the skill is "applied" to the target.
 * When using JABS, this applies as soon as the skill/action connects with
 * a target of any kind. This will trigger multiple times if an action has
 * multiple projectiles.
 * When using non-JABS, this applies when a skill is being executed against a
 * target. This happens regardless the outcome of the skill.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Fixed reference error when attempting to extend skills w/ on-hit effects.
 *    Retroactively added this CHANGELOG.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//region Metadata
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
J.EXTEND.Metadata = {};

/**
 * The name of this plugin.
 */
J.EXTEND.Metadata.Name = `J-SkillExtend`;

/**
 * The version of this plugin.
 */
J.EXTEND.Metadata.Version = '1.0.0';

/**
 * A collection of all aliased methods for this plugin.
 */
J.EXTEND.Aliased = {};
J.EXTEND.Aliased.Game_Action = new Map();
J.EXTEND.Aliased.Game_Item = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.EXTEND.RegExp = {};
J.EXTEND.RegExp.OnHitSelfState = /<onHitSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
J.EXTEND.RegExp.OnCastSelfState = /<onCastSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
//endregion Metadata

//region OverlayManager
/**
 * A static class for managing the overlaying of one skill onto another.
 * The methods are divided by the attribute they overlay.
 */
class OverlayManager
{
  constructor()
  {
    throw new Error('The OverlayManager is a static class.');
  }

  /**
   * Gets the extended skill based on the caster's learned skills.
   * @param caster {Game_Actor|Game_Enemy} The caster of the skill.
   * @param skillId {number} The base skill to extend.
   * @returns {RPG_Skill}
   */
  static getExtendedSkill(caster, skillId)
  {
    // if we don't have a caster for some reason, don't process anything.
    if (!caster)
    {
      console.warn(`no caster was provided to check skill extensions for skillId: ${skillId}.<br>`);
      return $dataSkills[skillId];
    }

    // make a copy of the original skill to be overlayed.
    const baseSkill = $dataSkills[skillId]._clone();

    // the filter for filtering whether or not a skill is an extension skill.
    /** @param {RPG_Skill} skill */
    const skillExtendFilter = (skill) =>
    {
      // if the skill isn't an extension skill, skip it.
      const isExtensionSkill = (skill.metadata('skillExtend'));
      if (!isExtensionSkill) return false;

      const skillsExtended = JSON.parse(skill.metadata('skillExtend')).map(parseInt);
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
      case 0:
        return baseSkill;

      // we found one skill to extend with.
      case 1:
        return this.extendSkill(baseSkill, skillExtendSkills[0]);

      // there are many skills to extend with sequentially.
      default:
        const reducer = (skillPreviously, skillOverlay) => this.extendSkill(skillPreviously, skillOverlay);
        return skillExtendSkills.reduce(reducer, baseSkill);
    }
  }

  /**
   * Merges the skill overlay onto the base skill and returns the updated base skill.
   * @param baseSkill {RPG_Skill} The base skill to be overlayed.
   * @param skillOverlay {RPG_Skill} The skill to overlay with.
   * @returns {RPG_Skill} The base skill overlayed with the overlay skill.
   */
  static extendSkill(baseSkill, skillOverlay)
  {
    // merge all of the base skill data.
    baseSkill = this.baseSkillData(baseSkill, skillOverlay);

    // update all the JABS-specific data.
    baseSkill = this.overwrite(baseSkill, skillOverlay);

    // sanitize the skill extends out of the base skill to prevent recursive extensions.
    baseSkill = this.sanitizeBaseSkill(baseSkill);

    // return the base skill merged with the overlay.
    return baseSkill;
  }

  /**
   * Overlays `skillOverlay` onto the `baseSkill`.
   *
   * All parameters that the `skillOverlay` and `baseSkill` share will
   * be overridden by the `skillOverlay` values. Any parameters the
   * `skillOverlay` has that the `baseSkill` lacks will be added anew.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static overwrite(baseSkill, skillOverlay)
  {
    baseSkill = this.cooldown(baseSkill, skillOverlay);
    baseSkill = this.range(baseSkill, skillOverlay);
    baseSkill = this.proximity(baseSkill, skillOverlay);
    baseSkill = this.actionId(baseSkill, skillOverlay);
    baseSkill = this.duration(baseSkill, skillOverlay);
    baseSkill = this.shape(baseSkill, skillOverlay);
    baseSkill = this.knockback(baseSkill, skillOverlay);
    baseSkill = this.poseSuffix(baseSkill, skillOverlay);
    baseSkill = this.castAnimation(baseSkill, skillOverlay);
    baseSkill = this.castTime(baseSkill, skillOverlay);
    baseSkill = this.freeCombo(baseSkill, skillOverlay);
    baseSkill = this.direct(baseSkill, skillOverlay);
    baseSkill = this.bonusAggro(baseSkill, skillOverlay);
    baseSkill = this.aggroMultiplier(baseSkill, skillOverlay);
    baseSkill = this.bonusHits(baseSkill, skillOverlay);
    baseSkill = this.guard(baseSkill, skillOverlay);
    baseSkill = this.counterParry(baseSkill, skillOverlay);
    baseSkill = this.counterGuard(baseSkill, skillOverlay);
    baseSkill = this.projectile(baseSkill, skillOverlay);
    baseSkill = this.uniqueCooldown(baseSkill, skillOverlay);
    baseSkill = this.moveType(baseSkill, skillOverlay);
    baseSkill = this.invincibleDodge(baseSkill, skillOverlay);
    baseSkill = this.piercing(baseSkill, skillOverlay);
    baseSkill = this.combo(baseSkill, skillOverlay);

    return baseSkill;
  }

  //region overwrites
  /**
   * Overlays the base skill data.
   *
   * Effects, meta, note, and repeats are combined.
   *
   * Scope, mpCost, tpCost, and tpGain are replaced.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
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
          baseSkill.damage.type = 6;
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

    // combine repeats if they aren't just 1 (default).
    if (skillOverlay.repeats !== 1)
    {
      baseSkill.repeats += (skillOverlay.repeats - 1);
    }

    // combine speeds.
    if (skillOverlay.speed !== 0)
    {
      baseSkill.speed += skillOverlay.speed;
    }

    // if they aren't the same, and aren't 100 (default), then add them.
    if (baseSkill.successRate !== skillOverlay.successRate ||
      skillOverlay.successRate !== 100)
    {
      baseSkill.successRate += skillOverlay.successRate;
    }

    // overwrite message 1.
    if (baseSkill.message1 !== skillOverlay.message1)
    {
      baseSkill.message1 = skillOverlay.message1;
    }

    // overwrite message 2.
    if (baseSkill.message2 !== skillOverlay.message2)
    {
      baseSkill.message2 = skillOverlay.message2;
    }

    // overwrite scope if not "none" (0 = default) and not the same.
    const bothHaveScopes = baseSkill.scope !== 0 && skillOverlay.scope !== 0;
    const scopesHaveChanged = baseSkill.scope !== skillOverlay.scope;
    if (bothHaveScopes && scopesHaveChanged)
    {
      // TODO: extend, don't overwrite!
      baseSkill.scope = skillOverlay.scope;
    }

    // overwrite mp costs if not the same.
    if (baseSkill.mpCost !== skillOverlay.mpCost)
    {
      baseSkill.mpCost = skillOverlay.mpCost;
    }

    // overwrite tp costs if not the same.
    if (baseSkill.tpCost !== skillOverlay.tpCost)
    {
      baseSkill.tpCost = skillOverlay.tpCost;
    }

    // combine the tp gains.
    baseSkill.tpGain += skillOverlay.tpGain;

    // if both hit types are NOT "certain hit" (default), then overwrite them.
    if (baseSkill.hitType && skillOverlay.hitType)
    {
      baseSkill.hitType = skillOverlay.hitType;
    }

    // overwrite the animation if not 0 (default) and it changed.
    if (baseSkill.animationId !== 0 &&
      baseSkill.animationId !== skillOverlay.animationId)
    {
      baseSkill.animationId = skillOverlay.animationId;
    }

    /*
    NOTE:
      the 'occasion' should not be changed!
      that can result in unexpected/unwanted behavior!
    */

    // sanitize the base skill from all skill extend shenanigans.
    baseSkill = this.sanitizeBaseSkill(baseSkill);

    return baseSkill;
  }

  /**
   * Purges all references to the skill extend tag from the `baseSkill`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static sanitizeBaseSkill(baseSkill)
  {
    // remove the skill extend from the metadata.
    baseSkill.deleteMetadata('skillExtend');

    // remove the skill extend from the notedata.
    baseSkill.deleteNotedata(/<skillExtend:\[[\d,]+]>/gmi);

    // return the base skill sans any reference to skill extension.
    return baseSkill;
  }

  /**
   * Overlays the `invincibleDodge`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static invincibleDodge(baseSkill, skillOverlay)
  {
    return this._overwriteAsBoolean(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.InvincibleDodge,
      skillOverlay.jabsInvincibleDodge);
  }

  /**
   * Overlays the `moveType`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static moveType(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.MoveType,
      skillOverlay.jabsMoveType);
  }

  /**
   * Overlays the `uniqueCooldown`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static uniqueCooldown(baseSkill, skillOverlay)
  {
    return this._overwriteAsBoolean(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.UniqueCooldown,
      skillOverlay.jabsUniqueCooldown);
  }

  /**
   * Overlays the `projectile`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static projectile(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Projectile,
      skillOverlay.jabsProjectile);
  }

  /**
   * Overlays the `parry`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static parry(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Parry,
      skillOverlay.jabsParry);
  }

  /**
   * Overlays the `counterParry`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static counterParry(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.CounterParry,
      skillOverlay.jabsCounterParry);
  }

  /**
   * Overlays the `guard`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static guard(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Guard,
      skillOverlay.jabsGuard);
  }

  /**
   * Overlays the `counterGuard`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static counterGuard(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.CounterGuard,
      skillOverlay.jabsCounterGuard);
  }

  /**
   * Overlays the `getBonusHits`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static bonusHits(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.BonusHits,
      skillOverlay.jabsBonusHits);
  }

  /**
   * Overlays the `aggroMultiplier`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static aggroMultiplier(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.AggroMultiplier,
      skillOverlay.jabsAggroMultiplier);
  }

  /**
   * Overlays the `bonusAggro`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static bonusAggro(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.BonusAggro,
      skillOverlay.jabsBonusAggro);
  }

  /**
   * Overlays the `direct`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static direct(baseSkill, skillOverlay)
  {
    return this._overwriteAsBoolean(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Direct,
      skillOverlay.jabsDirect);
  }

  /**
   * Overlays the `combo`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static combo(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.ComboAction,
      skillOverlay.jabsComboAction);
  }

  /**
   * Overlays the `freeCombo`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static freeCombo(baseSkill, skillOverlay)
  {
    return this._overwriteAsBoolean(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.FreeCombo,
      skillOverlay.jabsFreeCombo);
  }

  /**
   * Overlays the `castTime`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static castTime(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.CastTime,
      skillOverlay.jabsCastTime);
  }

  /**
   * Overlays the `castAnimation`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static castAnimation(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.CastAnimation,
      skillOverlay.jabsCastAnimation);
  }

  /**
   * Overlays the `poseSuffix`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static poseSuffix(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.PoseSuffix,
      skillOverlay.jabsPoseData);
  }

  /**
   * Overlays the `knockback`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static knockback(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Knockback,
      skillOverlay.jabsKnockback);
  }

  /**
   * Overlays the `piercing`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static piercing(baseSkill, skillOverlay)
  {
    // grab the overlay data.
    let overlayData = skillOverlay.jabsPiercingData;

    // check if the overlay data is just the default.
    if (overlayData.equals([1, 0]))
    {
      // replace the default with null so we get the proper kind of overwrite.
      overlayData = null;
    }

    // overwrite the value with the new one.
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.PiercingData,
      overlayData);
  }

  /**
   * Overlays the `shape`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static shape(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Shape,
      skillOverlay.jabsShape);
  }

  /**
   * Overlays the `duration`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static duration(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Duration,
      skillOverlay.jabsDuration);
  }

  /**
   * Overlays the `actionId`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static actionId(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.ActionId,
      skillOverlay.jabsActionId);
  }

  /**
   * Overlays the `proximity`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static proximity(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Proximity,
      skillOverlay.jabsProximity);
  }

  /**
   * Overlays the `range`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static range(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Range,
      skillOverlay.jabsRadius);
  }

  /**
   * Overlays the `cooldown`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static cooldown(baseSkill, skillOverlay)
  {
    return this._overwriteAsKvp(
      baseSkill,
      skillOverlay,
      J.ABS.RegExp.Cooldown,
      skillOverlay.jabsCooldown);
  }

  /**
   * An overlay type of which we overwrite whatever the existing data is with
   * the new data found on the skill overlay.
   *
   * This applies to numeric key-value pairs.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @param {RegExp} structure The regex structure being overwritten.
   * @param {number|null} value The value to overwrite with from the overlay; may be null.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static _overwriteAsKvp(baseSkill, skillOverlay, structure, value)
  {
    // if the value doesn't exist, don't overlay; return the base skill.
    if (value === null) return baseSkill;

    // strip out all tags that match the regex.
    baseSkill.deleteNotedata(structure);

    // determine the key from the regex.
    const key = J.BASE.Helpers.getKeyFromRegexp(structure);

    // rebuild the tag for the skill.
    let rebuiltTag;

    // check if the value is an array.
    if (Array.isArray(value))
    {
      // stuff arrays back in their brackets!
      rebuiltTag = `<${key}:[${value}]>`;
    }
    // it is not an array.
    else
    {
      // just place the value in there as-is.
      rebuiltTag = `<${key}:${value}>`;
    }

    // append the rebuilt tag to the note.
    baseSkill.note += rebuiltTag;

    // overwrite the meta object with the overwrite value.
    baseSkill.meta[key] = value;

    // return the overlayed base skill.
    return baseSkill;
  }

  /**
   * An overlay type of which we overwrite whatever the existing data is with
   * the new data found on the skill overlay.
   *
   * This applies to booleans, where there is no value, only a key.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @param {RegExp} structure The regex structure being overwritten.
   * @param {number|null} value The value to overwrite with from the overlay; may be null.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static _overwriteAsBoolean(baseSkill, skillOverlay, structure, value)
  {
    // if the value doesn't exist, don't overlay; return the base skill.
    if (value === null) return baseSkill;

    // strip out all tags that match the regex.
    baseSkill.note = baseSkill.note.replace(structure, String.empty);

    // determine the key from the regex.
    const key = J.BASE.Helpers.getKeyFromRegexp(structure, true);

    // rebuild the tag for the skill.
    const rebuiltTag = `<${key}>`;

    // append the rebuilt tag to the note.
    baseSkill.note += rebuiltTag;

    // overwrite the meta object with the overwrite value.
    baseSkill.meta[key] = value;

    // return the overlayed base skill.
    return baseSkill;
  }
//endregion overwrites
}

//endregion OverlayManager

//region Game_Action
/**
 * Overrides {@link #setSkill}.<br>
 * If a caster is available to this action, then update the udnerlying skill with
 * the overlayed skill instead.
 */
J.EXTEND.Aliased.Game_Action.set('setSkill', Game_Action.prototype.setSkill);
Game_Action.prototype.setSkill = function(skillId)
{
  // check if we are missing a caster.
  if (!this.subject())
  {
    // perform original logic.
    J.EXTEND.Aliased.Game_Action.get('setSkill').call(this, skillId);

    // stop processing.
    return;
  }

  // build the extended skill.
  const skillToSet = OverlayManager.getExtendedSkill(this.subject(), skillId);

  // assign the overlayed skill to the object instead.
  this._item.setObject(skillToSet);
};

/**
 * Overrides {@link #setItemObject}.<br>
 * If a caster is available to this action, then update the underlying item with the data.
 */
J.EXTEND.Aliased.Game_Action.set('setItemObject', Game_Action.prototype.setItemObject);
Game_Action.prototype.setItemObject = function(itemObject)
{
  // check if we are missing a caster.
  if (!this.subject())
  {
    // perform original logic.
    J.EXTEND.Aliased.Game_Action.get('setItemObject').call(this, itemObject);

    // stop processing.
    return;
  }

  // TODO: sort out how to manage this when both skills AND items come through this way.
  this._item.setObject(itemObject);
};

/**
 * Extends {@link #apply}.<br>
 * Also applies on-hit states.
 */
J.EXTEND.Aliased.Game_Action.set('apply', Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Action.get('apply').call(this, target);

  // apply our on-hit self-states if we have any.
  this.applyOnHitSelfStates();
};

/**
 * Applies all applicable on-hit self states.
 */
Game_Action.prototype.applyOnHitSelfStates = function()
{
  // apply all on-hit states to oneself.
  this.applyStates(this.subject(), this.onHitSelfStates());
};

/**
 * Gets all possible states that could be self-inflicted when this skill hits a target.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Action.prototype.onHitSelfStates = function()
{
  // grab all the self-state sources.
  const sources = this.selfStateSources();

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(
    sources,
    J.EXTEND.RegExp.OnHitSelfState);

  // return what we found.
  return stateChances;
};

/**
 * Extends {@link #applyItemUserEffect}.<br>
 * Also applies on-cast states.
 */
J.EXTEND.Aliased.Game_Action.set('applyItemUserEffect', Game_Action.prototype.applyItemUserEffect);
Game_Action.prototype.applyItemUserEffect = function(target)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Action.get('applyItemUserEffect').call(this, target);

  // apply our on-cast self-states if we have any.
  this.applyOnCastSelfStates();
};

/**
 * Applies all applicable on-cast self states.
 */
Game_Action.prototype.applyOnCastSelfStates = function()
{
  // apply all self-inflictable states to oneself.
  this.applyStates(this.subject(), this.onCastSelfStates());
};

/**
 * Gets all possible states that could be self-inflicted when casting this skill.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Action.prototype.onCastSelfStates = function()
{
  // grab all the self-state sources.
  const sources = this.selfStateSources();

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(
    sources,
    J.EXTEND.RegExp.OnCastSelfState);

  // return what we found.
  return stateChances;
};

/**
 * All sources to derive self-applied states from.
 * @returns {(RPG_UsableItem|RPG_State)[]}
 */
Game_Action.prototype.selfStateSources = function()
{
  // define the sources for this action.
  const sources = [
    // this action itself is a source (the underlying item/skill).
    this.item(),

    // the caster's states also apply as a source.
    ...this.subject().allStates(),
  ];

  // return what we found.
  return sources;
};

/**
 * Applies the given states to the target.
 * @param target {Game_Actor|Game_Enemy} The target to apply states to.
 * @param jabsOnChanceEffects {JABS_OnChanceEffect[]} The various states to potentially apply.
 */
Game_Action.prototype.applyStates = function(target, jabsOnChanceEffects)
{
  if (jabsOnChanceEffects.length)
  {
    // iterate over each of them and see if we should apply them.
    jabsOnChanceEffects.forEach(jabsOnChanceEffect =>
    {
      // roll the dice to see if the on-chance effect applies.
      if (jabsOnChanceEffect.shouldTrigger())
      {
        // apply the given state to the caster, with the caster as the attacker.
        target.addState(jabsOnChanceEffect.skillId, this.subject());
      }
    });
  }
};
//endregion Game_Action

//region Game_Actor
/**
 * OVERWRITE Gets the skill associated with the given skill id.
 * By abstracting this, we can modify the underlying skill before it reaches its destination.
 * @param {number} skillId The skill id to get the skill for.
 * @returns {RPG_Skill}
 */
Game_Actor.prototype.skill = function(skillId)
{
  return OverlayManager.getExtendedSkill(this, skillId);
};
//endregion Game_Actor

//region Game_Item
/**
 * Extend `initialize()` to include our update of assigning the item.
 */
J.EXTEND.Aliased.Game_Item.set('initialize', Game_Item.prototype.initialize);
Game_Item.prototype.initialize = function(item)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Item.get('initialize').call(this, item);

  /**
   * The underlying object associated with this item.
   * @type {RPG_EquipItem|rm.types.UsableItem}
   */
  this._item = null;
  if (item)
  {
    this._item = item;
  }
};

/**
 * Gets the underlying object for this `Game_Item`.
 * Normally this can be retrieved by using {@link Game_Item.object}, but that function limits
 * the possibility of retrieval to only stuff in the database, which extended skills will
 * not be in the database.
 */
Game_Item.prototype.underlyingObject = function()
{
  return this._item;
};

/**
 * Extends `setObject()` to enable setting custom skills and items.
 * @param {RPG_UsableItem|RPG_EquipItem}
 */
J.EXTEND.Aliased.Game_Item.set('setObject', Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(obj)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Item.get('setObject').call(this, obj);

  // check to make sure we have something to work with.
  if (!obj) return;

  // check to ensure it has a skill category property.
  if (obj.hasOwnProperty('stypeId'))
  {
    // assign the data.
    this._dataClass = 'skill';
    this._item = obj;
  }
  // check to ensure it has an item category property.
  else if (obj.hasOwnProperty('itypeId'))
  {
    // assign the data.
    this._dataClass = 'item';
    this._item = obj;
  }
};

/**
 * Extends this function to return the underlying custom object (like an extended skill)
 * if it was assigned.
 */
J.EXTEND.Aliased.Game_Item.set('object', Game_Item.prototype.object);
Game_Item.prototype.object = function()
{
  // if we have a custom object to return, return that.
  if (this._item)
  {
    return this._item;
  }

  return J.EXTEND.Aliased.Game_Item.get('object').call(this);
};
//endregion Game_Item

//region Game_Party
Game_Party.prototype.extraOnHitSelfStateSources = function()
{
  const extraSources = [];

  // if we're using passive skill states...
  if (J.PASSIVE)
  {
    // get all the members of the battle party.
    const members = $gameParty.battleMembers();
    members.forEach(member =>
    {
      // and shove their current array of states into the sources to check.
      extraSources.push(...member.allStates());
    });
  }

  // return all found sources.
  return extraSources;
};

Game_Party.prototype.extraOnCastSelfStateSources = function()
{
  const extraSources = [];

  // if we're using passive skill states...
  if (J.PASSIVE)
  {
    // get all the members of the battle party.
    const members = $gameParty.battleMembers();
    members.forEach(member =>
    {
      // and shove their current array of states into the sources to check.
      extraSources.push(...member.allStates());
    });
  }

  // return all found sources.
  return extraSources;
};
//endregion Game_Party