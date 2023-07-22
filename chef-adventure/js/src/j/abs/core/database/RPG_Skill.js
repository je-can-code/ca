//region RPG_Skill effects
//region range
/**
 * The JABS range for this skill.
 * This range determines the number of tiles the skill can reach in the
 * context of collision with targets.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsRadius",
  {
    get: function()
    {
      return this.getJabsRadius();
    },
  });

/**
 * Gets the JABS range for this skill.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsRadius = function()
{
  return this.extractJabsRadius();
};

/**
 * Extracts the JABS range for this skill from its notes.
 */
RPG_Skill.prototype.extractJabsRadius = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Range, true);
};
//endregion range

//region proximity
/**
 * A new property for retrieving the JABS proximity from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsProximity",
  {
    get: function()
    {
      return this.getJabsProximity();
    },
  });

/**
 * Gets the JABS proximity this skill.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsProximity = function()
{
  return this.extractJabsProximity();
};

/**
 * Extracts the JABS proximity for this skill from its notes.
 */
RPG_Skill.prototype.extractJabsProximity = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Proximity, true);
};
//endregion proximity

//region actionId
/**
 * A new property for retrieving the JABS actionId from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsActionId",
  {
    get: function()
    {
      return this.getJabsActionId();
    },
  });

/**
 * Gets the JABS actionId this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsActionId = function()
{
  return this.extractJabsActionId();
};

/**
 * Extracts the JABS actionId for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsActionId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.ActionId, true);
};
//endregion actionId

//region duration
/**
 * A new property for retrieving the JABS duration from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDuration",
  {
    get: function()
    {
      return this.getJabsDuration();
    },
  });

/**
 * Gets the JABS duration this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsDuration = function()
{
  return this.extractJabsDuration();
};

/**
 * Extracts the JABS duration for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsDuration = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Duration, true);
};
//endregion duration

//region shape
/**
 * A new property for retrieving the JABS shape from this skill.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsShape",
  {
    get: function()
    {
      return this.getJabsShape();
    },
  });

/**
 * Gets the JABS shape this skill.
 * @returns {string|null}
 */
RPG_Skill.prototype.getJabsShape = function()
{
  return this.extractJabsShape();
};

/**
 * Extracts the JABS shape for this skill from its notes.
 * @returns {string|null}
 */
RPG_Skill.prototype.extractJabsShape = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.Shape, true);
};
//endregion shape

//region knockback
/**
 * A new property for retrieving the JABS knockback from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsKnockback",
  {
    get: function()
    {
      return this.getJabsKnockback();
    },
  });

/**
 * Gets the JABS knockback this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsKnockback = function()
{
  return this.extractJabsKnockback();
};

/**
 * Extracts the JABS knockback for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsKnockback = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Knockback, true);
};
//endregion knockback

//region castAnimation
/**
 * A new property for retrieving the JABS castAnimation id from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCastAnimation",
  {
    get: function()
    {
      return this.getJabsCastAnimation();
    },
  });

/**
 * Gets the JABS castAnimation this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsCastAnimation = function()
{
  return this.extractJabsCastAnimation();
};

/**
 * Extracts the JABS castAnimation for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsCastAnimation = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.CastAnimation, true);
};
//endregion castAnimation

//region castTime
/**
 * A new property for retrieving the JABS castTime from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCastTime",
  {
    get: function()
    {
      return this.getJabsCastTime();
    },
  });

/**
 * Gets the JABS castTime this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsCastTime = function()
{
  return this.extractJabsCastTime();
};

/**
 * Extracts the JABS castTime for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsCastTime = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.CastTime, true);
};
//endregion castTime

//region direct
/**
 * A new property for retrieving the JABS direct from this skill.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDirect",
  {
    get: function()
    {
      return this.getJabsDirect();
    },
  });

/**
 * Gets the JABS direct this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsDirect = function()
{
  return this.extractJabsDirect();
};

/**
 * Extracts the JABS direct for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsDirect = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Direct, true);
};
//endregion direct

//region bonusAggro
/**
 * A new property for retrieving the JABS bonusAggro from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsBonusAggro",
  {
    get: function()
    {
      return this.getJabsBonusAggro();
    },
  });

/**
 * Gets the JABS bonusAggro this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsBonusAggro = function()
{
  return this.extractJabsBonusAggro();
};

/**
 * Extracts the JABS bonusAggro for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsBonusAggro = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusAggro, true);
};
//endregion bonusAggro

//region aggroMultiplier
/**
 * A new property for retrieving the JABS aggroMultiplier from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsAggroMultiplier",
  {
    get: function()
    {
      return this.getJabsAggroMultiplier();
    },
  });

/**
 * Gets the JABS aggroMultiplier this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsAggroMultiplier = function()
{
  return this.extractJabsAggroMultiplier();
};

/**
 * Extracts the JABS aggroMultiplier for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsAggroMultiplier = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AggroMultiplier, true);
};
//endregion aggroMultiplier

//region jabsGuardData
/**
 * The `JABS_GuardData` of this skill.
 * Will return null if there is no guard tag available on this
 * @type {JABS_GuardData}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuardData",
  {
    get: function()
    {
      return this.getJabsGuardData();
    },
  });

/**
 * Gets the JABS guard this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsGuardData = function()
{
  return new JABS_GuardData(
    this.id,
    this.jabsGuardFlat,
    this.jabsGuardPercent,
    this.jabsCounterGuard,
    this.jabsCounterParry,
    this.jabsParry)
};
//endregion jabsGuardData

//region guard
/**
 * A new property for retrieving the JABS guard from this skill.
 * @type {[number, number]}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuard",
  {
    get: function()
    {
      return this.getJabsGuard() ?? [0, 0];
    },
  });

/**
 * The flat amount of damage reduced by this skill when guarding.
 * Should be negative.
 * If positive, this flat damage will instead be added on while guarding.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuardFlat",
  {
    get: function()
    {
      return this.jabsGuard[0];
    },
  });

/**
 * The percent amount of damage reduced by this skill when guarding.
 * Should be negative.
 * If positive, this percent damage will instead be added on while guarding.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuardPercent",
  {
    get: function()
    {
      return this.jabsGuard[1];
    },
  });

/**
 * Gets the JABS guard this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsGuard = function()
{
  return this.extractJabsGuard();
};

/**
 * Extracts the JABS guard for this skill from its notes.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.extractJabsGuard = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.Guard);
};
//endregion guard

//region parry
/**
 * The number of frames that the precise-parry window is available
 * when first guarding.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsParry",
  {
    get: function()
    {
      return this.getJabsParryFrames();
    },
  });

/**
 * Gets the JABS parry this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsParryFrames = function()
{
  return this.extractJabsParryFrames();
};

/**
 * Extracts the JABS parry for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsParryFrames = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Parry, true);
};
//endregion parry

//region counterParry
/**
 * When performing a precise-parry, this skill id will be automatically
 * executed in retaliation.
 * @type {number[]}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCounterParry",
  {
    get: function()
    {
      return this.getJabsCounterParry();
    },
  });

/**
 * Gets the JABS counterParry this skill.
 * @returns {number[]}
 */
RPG_Skill.prototype.getJabsCounterParry = function()
{
  return this.extractJabsCounterParry();
};

/**
 * Extracts the JABS counterParry for this skill from its notes.
 * @returns {number[]}
 */
RPG_Skill.prototype.extractJabsCounterParry = function()
{
  return this.getNumberArrayFromNotesByRegex(J.ABS.RegExp.CounterParry);
};
//endregion counterParry

//region counterGuard
/**
 * While guarding, this skill id will be automatically executed in retaliation.
 * @type {number[]}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCounterGuard",
  {
    get: function()
    {
      return this.getJabsCounterGuard();
    },
  });

/**
 * Gets the JABS counterGuard this skill.
 * @returns {number[]}
 */
RPG_Skill.prototype.getJabsCounterGuard = function()
{
  return this.extractJabsCounterGuard();
};

/**
 * Extracts the JABS counterGuard for this skill from its notes.
 * @returns {number[]}
 */
RPG_Skill.prototype.extractJabsCounterGuard = function()
{
  return this.getNumberArrayFromNotesByRegex(J.ABS.RegExp.CounterGuard);
};
//endregion counterGuard

//region projectile
/**
 * A new property for retrieving the JABS projectile frames from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsProjectile",
  {
    get: function()
    {
      return this.getJabsProjectile();
    },
  });

/**
 * Gets the JABS projectile this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsProjectile = function()
{
  return this.extractJabsProjectile();
};

/**
 * Extracts the JABS projectile for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsProjectile = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Projectile, true);
};
//endregion projectile

//region uniqueCooldown
/**
 * A new property for retrieving the JABS uniqueCooldown from this skill.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsUniqueCooldown",
  {
    get: function()
    {
      return this.getJabsUniqueCooldown();
    },
  });

/**
 * Gets the JABS uniqueCooldown this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsUniqueCooldown = function()
{
  return this.extractJabsUniqueCooldown();
};

/**
 * Extracts the JABS uniqueCooldown for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsUniqueCooldown = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.UniqueCooldown, true);
};
//endregion uniqueCooldown

//region moveType
/**
 * The direction that this dodge skill will move.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsMoveType",
  {
    get: function()
    {
      return this.getJabsMoveType();
    },
  });

/**
 * Gets the JABS moveType this skill.
 * @returns {string|null}
 */
RPG_Skill.prototype.getJabsMoveType = function()
{
  return this.extractJabsMoveType();
};

/**
 * Extracts the JABS moveType for this skill from its notes.
 * @returns {string|null}
 */
RPG_Skill.prototype.extractJabsMoveType = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.MoveType, true);
};
//endregion moveType

//region invincibleDodge
/**
 * Whether or not the battler is invincible for the duration of this
 * skill's dodge movement.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsInvincibleDodge",
  {
    get: function()
    {
      return this.getJabsInvincibileDodge();
    },
  });

/**
 * Gets the dodge invincibility flag for this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsInvincibileDodge = function()
{
  return this.extractJabsInvincibleDodge();
};

/**
 * Extracts the JABS invincibleDodge for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsInvincibleDodge = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.InvincibleDodge, true);
};
//endregion invincibleDodge

//region freeCombo
/**
 * Whether or not this skill has the "free combo" trait on it.
 * Skills with "free combo" can continuously be executed regardless of
 * the actual timing factor for combos.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsFreeCombo",
  {
    get: function()
    {
      return this.getJabsFreeCombo();
    },
  });

/**
 * Gets the JABS freeCombo this skill.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.getJabsFreeCombo = function()
{
  return this.extractJabsFreeCombo();
};

/**
 * Extracts the JABS freeCombo for this skill from its notes.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.extractJabsFreeCombo = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.FreeCombo, true);
};
//endregion freeCombo

//region comboAction
/**
 * The JABS combo data for this skill.
 *
 * The zeroth index is the combo skill id
 * The first index is the delay in frames until the combo can be triggered.
 *
 * Will be null if the combo tag is missing from the skill.
 * @type {[number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboAction",
  {
    get: function()
    {
      return this.getJabsComboAction();
    },
  });

/**
 * Whether or not this skill can be used to engage in a combo.
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboStarter",
  {
    get: function()
    {
      return this.getJabsComboStarter();
    },
  });

/**
 * Checks the skill's metadata for the presence of the combo starter.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.getJabsComboStarter = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ComboStarter);
};

/**
 * Whether or not this skill is a "skill extend" skill.
 * @returns {boolean} True if this is a "skill extend" skill, false otherwise.
 */
Object.defineProperty(RPG_Skill.prototype, "isSkillExtender",
  {
    get: function()
    {
      return !!this.getSkillExtender();
    },
  });

/**
 * Checks the skill's metadata for the presence of the JABS AI skill exclusion tag.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.getSkillExtender = function()
{
  return this.metadata('skillExtend');
};

/**
 * Whether or not this skill can be chosen at all by the JABS AI.
 * Combo skills can still be executed as they are chosen by different means.
 */
Object.defineProperty(RPG_Skill.prototype, "jabsAiSkillExclusion",
  {
    get: function()
    {
      return this.getAiSkillExclusion();
    },
  });

/**
 * Checks the skill's metadata for the presence of the JABS AI skill exclusion tag.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.getAiSkillExclusion = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiSkillExclusion);
};

/**
 * The JABS combo skill id that this skill can lead into if the skill is learned
 * by the caster.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboSkillId",
  {
    get: function()
    {
      return this.jabsComboAction[0];
    },
  });

/**
 * The JABS combo delay in frames before the combo skill can be triggered.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboDelay",
  {
    get: function()
    {
      return this.jabsComboAction[1];
    },
  });

/**
 * Gets the JABS combo this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsComboAction = function()
{
  return this.extractJabsComboAction();
};

/**
 * Extracts the JABS combo for this skill from its notes.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.extractJabsComboAction = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.ComboAction);
};
//endregion comboAction

/**
 * Gets the list of skill ids in order that this skill going forward can
 * combo into. This will not include combo skills prior to this skill.
 * @returns {number[]}
 */
RPG_Skill.prototype.getComboSkillIdList = function(battler)
{
  return this.recursivelyFindAllComboSkillIds(this.id, Array.empty, battler);
};

/**
 * Recursively finds the complete combo of an equip starting at a particular
 * skill id and building the collection of skill ids that this skill combos into.
 * @param {number} skillId The id to recursively interpret the combo of.
 * @param {number[]=} list The running list of combo skill ids; defaults to an empty list.
 * @param {Game_Battler=} battler The battler perceiving these skills; defaults to null.
 * @returns {number[]} The full combo of the starting skill id.
 */
RPG_Skill.prototype.recursivelyFindAllComboSkillIds = function(skillId, list = Array.empty, battler = null)
{
  // start our list from what was passed in.
  const skillIdList = list;

  // grab the database skill.
  const skill = battler
    ? battler.skill(skillId)
    : $dataSkills.at(skillId);

  // check if we should recurse this skill.
  if (this.shouldRecurseForComboSkills(skill, skillId))
  {
    // grab the combo skill id.
    const { jabsComboSkillId } = skill;

    // add it to the list.
    skillIdList.push(jabsComboSkillId);

    // continue finding more skills with the new combo skill id as the target.
    return this.recursivelyFindAllComboSkillIds(jabsComboSkillId, skillIdList, battler);
  }
  // that was the last combo skill to record.
  else
  {
    // return the complete combo list.
    return skillIdList;
  }
};

/**
 * Determines whether or not we need to recurse another time to continue
 * finding combo skills.
 * @param {RPG_Skill} skill The skill to determine if recursion is required for.
 * @param {number} lastSkillId The last skill id in the combo.
 * @returns {boolean} True if we should recurse another skill, false otherwise.
 */
RPG_Skill.prototype.shouldRecurseForComboSkills = function(skill, lastSkillId)
{
  // if there is no skill, then there is no recursion.
  if (!skill) return false;

  // if there is no combo, then there is no recursion.
  if (!skill.jabsComboAction) return false;

  // if the combo skill is the same as the last skill id, then don't infinitely recurse.
  if (skill.jabsComboSkillId === lastSkillId) return false;

  // we should recurse!
  return true;
};

//region piercing
/**
 * The JABS piercing data for this skill.
 *
 * The zeroth index is the number of times to repeatedly pierce targets.
 * The first index is the delay in frames between each pierce hit.
 *
 * Will be null if the piercing tag is missing from the skill.
 * @type {[number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPiercingData",
  {
    get: function()
    {
      const piercingData = this.getJabsPiercingData();
      if (!piercingData)
      {
        return [1, 0];
      }

      return piercingData;
    },
  });

/**
 * The number of times this skill can hit targets.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPierceCount",
  {
    get: function()
    {
      return this.jabsPiercingData.at(0);
    },
  });

/**
 * The delay in frames between each pierce hit on targets.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPierceDelay",
  {
    get: function()
    {
      return Math.max(this.jabsPiercingData.at(1), 5);
    },
  });

/**
 * Gets the JABS percing data this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsPiercingData = function()
{
  return this.extractJabsPiercingData();
};

/**
 * Extracts the data for this skill from its notes.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.extractJabsPiercingData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.PiercingData);
};
//endregion piercing

//region knockbackResist
//region RPG_BaseBattler
/**
 * A new property for retrieving the JABS castTime from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsKnockbackResist",
  {
    get: function()
    {
      return this.getJabsKnockbackResist();
    },
  });

/**
 * Gets the JABS castTime this skill.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsKnockbackResist = function()
{
  return this.extractJabsKnockbackResist();
};

/**
 * Extracts the JABS castTime for this skill from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsKnockbackResist = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.KnockbackResist, true);
};
//endregion RPG_BaseBattler

//region RPG_BaseItem
/**
 * A new property for retrieving the JABS castTime from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_BaseItem.prototype, "jabsKnockbackResist",
  {
    get: function()
    {
      return this.getJabsKnockbackResist();
    },
  });

/**
 * Gets the JABS castTime this skill.
 * @returns {number|null}
 */
RPG_BaseItem.prototype.getJabsKnockbackResist = function()
{
  return this.extractJabsKnockbackResist();
};

/**
 * Extracts the JABS castTime for this skill from its notes.
 * @returns {number|null}
 */
RPG_BaseItem.prototype.extractJabsKnockbackResist = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.KnockbackResist, true);
};
//endregion RPG_BaseItem
//endregion knockbackResist

//region poseSuffix
/**
 * Gets the JABS pose suffix data for this skill.
 *
 * The zeroth index is the string suffix itself (no quotes needed).
 * The first index is the index on the suffixed character sheet.
 * The second index is the number of frames to spend in this pose.
 * @type {[string, number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseData",
  {
    get: function()
    {
      return this.getJabsPoseData();
    },
  });

/**
 * Gets the JABS pose suffix for this skill.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseSuffix",
  {
    get: function()
    {
      return this.jabsPoseData[0];
    },
  });

/**
 * Gets the JABS pose index for this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseIndex",
  {
    get: function()
    {
      return this.jabsPoseData[1];
    },
  });

/**
 * Gets the JABS pose duration for this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseDuration",
  {
    get: function()
    {
      return this.jabsPoseData[2];
    },
  });

/**
 * Gets the JABS pose suffix data for this skill.
 * @returns {[string, number, number]|null}
 */
RPG_Skill.prototype.getJabsPoseData = function()
{
  return this.extractJabsPoseData();
};

/**
 * Extracts the JABS pose suffix data for this skill from its notes.
 * @returns {[string, number, number]|null}
 */
RPG_Skill.prototype.extractJabsPoseData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.PoseSuffix, true);
};
//endregion poseSuffix

//region ignoreParry
/**
 * The amount of parry rating ignored by this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsIgnoreParry",
  {
    get: function()
    {
      return this.getJabsIgnoreParry();
    },
  });

/**
 * Gets the ignore parry amount for this skill.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsIgnoreParry = function()
{
  return this.extractJabsIgnoreParry()
};

/**
 * Gets the value from the notes.
 */
RPG_Skill.prototype.extractJabsIgnoreParry = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.IgnoreParry, true);
};
//endregion ignoreParry

//region unparryable
//region RPG_Skill
/**
 * Whether or not this skill is completely unparryable by the target.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsUnparryable",
  {
    get: function()
    {
      return this.getJabsUnparryable();
    },
  });

/**
 * Gets whether or not this skill is unparryable.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.getJabsUnparryable = function()
{
  return this.extractJabsUnparryable();
};

/**
 * Extracts the boolean from the notes.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.extractJabsUnparryable = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Unparryable, true);
};
//endregion RPG_Skill
//endregion unparryable

//region selfAnimation
/**
 * The animation id to play on oneself when executing this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsSelfAnimationId",
  {
    get: function()
    {
      return this.getJabsSelfAnimationId();
    },
  });

/**
 * Gets the JABS self animation id.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsSelfAnimationId = function()
{
  return this.extractJabsSelfAnimationId();
};

/**
 * Extracts the value from the notes.
 */
RPG_Skill.prototype.extractJabsSelfAnimationId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SelfAnimationId, true);
};
//endregion range

//region delay
/**
 * The JABS delay data for this skill.
 *
 * The zeroth index is the number of frames to delay the execution of the skill by.
 * The first index is whether or not to execute regardless of delay by touch.
 *
 * Will be null if the delay tag is missing from the skill.
 * @type {[number, boolean]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDelayData",
  {
    get: function()
    {
      const delayData = this.getJabsDelayData();
      if (!delayData)
      {
        return [0, false];
      }

      return delayData;
    },
  });

/**
 * The duration in frames before this skill's action will trigger.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDelayDuration",
  {
    get: function()
    {
      return this.jabsDelayData[0];
    },
  });

/**
 * Whether or not the delay will be ignored if an enemy touches this skill's action.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDelayTriggerByTouch",
  {
    get: function()
    {
      return this.jabsDelayData[1];
    },
  });

/**
 * Gets the JABS delay data for this skill.
 * @returns {[number, boolean]|null}
 */
RPG_Skill.prototype.getJabsDelayData = function()
{
  return this.extractJabsDelayData();
};

/**
 * Extracts the data from the notes.
 * @returns {[number, boolean]|null}
 */
RPG_Skill.prototype.extractJabsDelayData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.DelayData);
};
//endregion delay
//endregion RPG_Skill effects