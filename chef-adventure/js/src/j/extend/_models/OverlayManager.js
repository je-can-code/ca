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
      console.warn(`no caster was provided to check skill extensions for skillId: ${skillId}.`);
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