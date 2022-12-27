//region JABS_AllyAI
/**
 * A class representing the AI-decision-making functionality for allies.
 */
function JABS_AllyAI()
{
  this.initialize(...arguments);
}

JABS_AllyAI.prototype = Object.create(JABS_AI.prototype);
JABS_AllyAI.prototype.constructor = JABS_AllyAI;

//region statics
/**
 * The strict enumeration of what ai modes are available for ally ai.
 * @type {any}
 */
JABS_AllyAI.modes = {
  /**
   * When this mode is assigned, the battler will take no action.
   */
  DO_NOTHING: {
    key: "do-nothing",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeDoNothingText,
  },

  /**
   * When this mode is assigned, the battler will only use their mainhand attack skill.
   * If no skill is equipped in their main hand, they will do nothing.
   */
  BASIC_ATTACK: {
    key: "basic-attack",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeOnlyAttackText,
  },

  /**
   * When this mode is assigned, the battler will intelligently decide from any skill they have equipped.
   */
  VARIETY: {
    key: "variety",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeVarietyText
  },

  /**
   * When this mode is assigned, the battler will use the biggest and strongest skills available.
   */
  FULL_FORCE: {
    key: "full-force",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeFullForceText
  },

  /**
   * When this mode is assigned, the battler will prioritize supporting and healing allies.
   */
  SUPPORT: {
    key: "support",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeSupportText
  },
};

/**
 * Gets all valid values of the possible modes currently implemented.
 * @returns {any[]}
 */
JABS_AllyAI.getModes = () => Object
  .keys(JABS_AllyAI.modes)
  .map(key => JABS_AllyAI.modes[key]);

/**
 * Validates the input of a mode to ensure it is one of the available and implemented ally ai modes.
 * @param {string} potentialMode The mode to validate.
 * @returns {boolean}
 */
JABS_AllyAI.validateMode = potentialMode => JABS_AllyAI
  .getModes()
  .find(mode => mode.key === potentialMode);
//endregion statics

//region initialize
/**
 * Initializes this class.
 * @param {string} initialMode The mode to start out in.
 */
JABS_AllyAI.prototype.initialize = function(initialMode)
{
  this.mode = initialMode;
  this.initMembers();
};

/**
 * Initializes all default members of this class.
 */
JABS_AllyAI.prototype.initMembers = function()
{
  /**
   * The collection of memories this ally ai possesses.
   * @type {JABS_BattleMemory[]}
   */
  this.memory = [];
};
//endregion initialize

//region mode
/**
 * Gets the current mode this ally's AI is set to.
 * @returns {string}
 */
JABS_AllyAI.prototype.getMode = function()
{
  return this.mode;
};

/**
 * Changes the current AI mode this ally is set to.
 * @param {string} newMode
 */
JABS_AllyAI.prototype.changeMode = function(newMode)
{
  if (!JABS_AllyAI.validateMode(newMode))
  {
    console.error(`Attempted to assign ally ai mode: [${newMode}], but is not a valid ai mode.`);
    return;
  }

  this.mode = newMode;
};
//endregion mode

//region decide action
/**
 * Decides an action based on this battler's AI, the target, and the given available skills.
 * @param {JABS_Battler} user The battler of the AI deciding a skill.
 * @param {JABS_Battler} target The target battler to decide an action against.
 * @param {number[]} availableSkills A collection of all skill ids to potentially pick from.
 * @returns {number|null} The skill id chosen to use, or null if none were valid choices for this AI.
 */
JABS_AllyAI.prototype.decideAction = function(user, target ,availableSkills)
{
  // filter out the unusable or invalid skills.
  const usableSkills = this.filterUncastableSkills(user, availableSkills);

  // determine which AI mode the ally is assigned.
  const currentMode = this.getMode();

  // pivot on the ai mode selected to decide what skill to use.
  switch (currentMode)
  {
    case JABS_AllyAI.modes.DO_NOTHING.key:
      return this.decideDoNothing(user);
    case JABS_AllyAI.modes.BASIC_ATTACK.key:
      return this.decideBasicAttack(usableSkills, user);
    case JABS_AllyAI.modes.VARIETY.key:
      return this.decideVariety(usableSkills, user, target);
    case JABS_AllyAI.modes.FULL_FORCE.key:
      return this.decideFullForce(usableSkills, user, target);
    case JABS_AllyAI.modes.SUPPORT.key:
      return this.decideSupport(usableSkills, user);
    default:
      return usableSkills.at(0);
  }
};

//region do-nothing
/**
 * Decides to do nothing and waits a short amount of time before doing anything else.
 * @returns {null}
 */
JABS_AllyAI.prototype.decideDoNothing = function(attacker)
{
  // forces a short wait before thinking about what to do next.
  attacker.setWaitCountdown(20);

  // return nothing to indicate no action should be taken.
  return null;
};
//endregion do-nothing

//region basic-attack
/**
 * Decides a skill id based on the ai mode of "basic attack only".
 * @param {number[]} usableSkills The skill ids available to choose from.
 * @param {JABS_Battler} user The battler choosing the skill.
 * @returns {number|null}
 */
JABS_AllyAI.prototype.decideBasicAttack = function(usableSkills, user)
{
  // check first if we should follow with the next hit of the combo.
  if (this.shouldFollowWithCombo(user))
  {
    // we're doing the next combo in the chain!
    return this.followWithCombo(user);
  }

  // determine which skill of the skills available is the mainhand skill.
  const mainBasicAttackSkillId = usableSkills
    .find(id => user.getBattler().findSlotForSkillId(id).key === JABS_Button.Mainhand);

  // determine which skill of the skills available is the offhand skill.
  const offhandBasicAttackSkillId = usableSkills
    .find(id => user.getBattler().findSlotForSkillId(id).key === JABS_Button.Offhand);

  // if we have neither basic attack skills, then do not process.
  if (!mainBasicAttackSkillId && !offhandBasicAttackSkillId) return null;

  // check if we have to decide between using mainhand or offhand.
  if (mainBasicAttackSkillId && offhandBasicAttackSkillId)
  {
    // a 70% chance to use mainhand, 30% chance to use offhand by default.
    return RPGManager.chanceIn100(70)
      ? mainBasicAttackSkillId
      : offhandBasicAttackSkillId;
  }

  // check if we do not have a mainhand skill.
  if (!mainBasicAttackSkillId)
  {
    // in which case we return the offhand skill.
    return offhandBasicAttackSkillId;
  }
  // since we do have a mainhand skill.
  else
  {
    // lets return it.
    return mainBasicAttackSkillId;
  }
};
//endregion basic-attack

//region variety
/**
 * Decides a skill id based on the ai mode of "variety".
 * If no allies are in danger, then simply chooses a random skill.
 * Will learn over time which skills are effective and ineffective against targets.
 * May use a support skill if allies are below half health.
 * @param {number[]} usableSkills The skill ids available to choose from.
 * @param {JABS_Battler} user The battler choosing the skill.
 * @param {JABS_Battler} target The targeted battler to use the skill against.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideVariety = function(usableSkills, user, target)
{
  // check first if we should follow with the next hit of the combo.
  if (this.shouldFollowWithCombo(user))
  {
    // we're doing the next combo in the chain!
    return this.followWithCombo(user);
  }

  // initialize the chosen skill id.
  let chosenSkillId = 0;

  // locally capture the list of usable skills for modification.
  let tempAvailableSkills = usableSkills;

  // check if any nearby allies are "in danger".
  const nearbyAllies = user.getAllNearbyAllies();
  const anyAlliesInDanger = nearbyAllies.some(battler => battler.getBattler().currentHpPercent() < 0.6);

  // if they are allies in danger, 50:50 chance to instead prioritize a support action.
  if (anyAlliesInDanger && Math.randomInt(2) === 0)
  {
    return this.decideSupport(usableSkills, user);
  }

  // grab all memories that this battler has of the target.
  const memoriesOfTarget = this.memory.filter(mem => mem.battlerId === target.getBattlerId());

  // filter all available skills down to what we recall as effective.
  if (memoriesOfTarget.length)
  {
    tempAvailableSkills = this.filterMemoriesByEffectiveness(tempAvailableSkills);
  }

  // if no skill was effective, or there were no memories, just pick a random skill and call it good.
  if (tempAvailableSkills.length === 0)
  {
    chosenSkillId = usableSkills.at(Math.randomInt(usableSkills.length));
  }

  // if the memories yielded a single effective skill, then 50/50 between that and a random skill.
  if (tempAvailableSkills.length === 1)
  {
    chosenSkillId = Math.randomInt(2) === 0
      ? tempAvailableSkills[0]
      : usableSkills[Math.randomInt(usableSkills.length)];
  }

  // if there were multiple memories of effective skills against the target, then randomly pick one.
  if (tempAvailableSkills.length > 1)
  {
    chosenSkillId = tempAvailableSkills[Math.randomInt(tempAvailableSkills.length)];
  }

  // return the decided skill id.
  return chosenSkillId;
};
//endregion variety

//region full-force
/**
 * Decides a skill id based on the ai mode of "full-force".
 * Always looks to choose the skill that will deal the most damage.
 * If we developed effective memories, then we may leverage those instead.
 * @param {number[]} usableSkills The skill ids available to choose from.
 * @param {JABS_Battler} user The battler choosing the skill.
 * @param {JABS_Battler} target The targeted battler to use the skill against.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideFullForce = function(usableSkills, user, target)
{
  // check first if we should follow with the next hit of the combo.
  if (this.shouldFollowWithCombo(user))
  {
    // we're doing the next combo in the chain!
    return this.followWithCombo(user);
  }

  let chosenSkillId = 0;
  let tempAvailableSkills = usableSkills;

  // determine the strongest skill available that this user can execute.
  const strongestSkillId = this.determineStrongestSkill(usableSkills, user, target);

  // grab all memories that this battler has of the target.
  const memoriesOfTarget = this.memory.filter(mem => mem.battlerId === target.getBattlerId());

  // check to make sure we have memories before analyzing them.
  if (memoriesOfTarget.length)
  {
    // filter the available skills by what was remembered to be effective.
    tempAvailableSkills = this.filterMemoriesByEffectiveness(tempAvailableSkills);
  }

  // check if we have no known effective skills.
  if (tempAvailableSkills.length === 0)
  {
    // if we no longer have any skills to pick from after filtering, then pick the strongest.
    chosenSkillId = this.determineStrongestSkill(usableSkills, user, target);
  }
  // we found exactly 1 effective skill.
  else if (tempAvailableSkills.length === 1)
  {
    // grab the known effective skill.
    const knownEffectiveSkill = tempAvailableSkills.at(0);

    // check if the strongest skill available is also the already-known effective skill.
    if (strongestSkillId === knownEffectiveSkill)
    {
      // if the strongest skill that was just calculated is the effective skill, then just use that.
      chosenSkillId = strongestSkillId;
    }
    // the strongest skill is different than the known effective skill.
    else
    {
      // 50% chance of picking either the strongest or the already-known effective skill.
      chosenSkillId = RPGManager.chanceIn100(50)
        ? strongestSkillId
        : knownEffectiveSkill;
    }
  }
  // we have more than 1 effective skill to work with.
  else
  {
    // if we have multiple previously proven-effective skills, then just pick one of those.
    chosenSkillId = tempAvailableSkills.at(Math.randomInt(tempAvailableSkills.length));
  }

  // return the chosen skill.
  return chosenSkillId;
};
//endregion full-force

//region support
/**
 * Decides a skill id based on this ally's current AI mode.
 * This mode prioritizes keeping allies alive.
 * Support priorities = cleansing > healing > buffing.
 * @param {number[]} usableSkills The skill ids available to choose from.
 * @param {JABS_Battler} user The battler choosing the skill.
 * @returns {number} The chosen support skill id to perform.
 */
JABS_AllyAI.prototype.decideSupport = function(usableSkills, user)
{
  // check first if we should follow with the next hit of the combo.
  if (this.shouldFollowWithCombo(user))
  {
    // we're doing the next combo in the chain!
    return this.followWithCombo(user);
  }

  // initialize our support skill id.
  let supportSkillId = 0;

  // first priority is cleansing status ailments, including death, from allies.
  supportSkillId = this.decideSupportCleansing(usableSkills, user);

  // check if there was no need for cleansing.
  if (!supportSkillId)
  {
    // prioritize recovering missing health for allies.
    supportSkillId = this.decideSupportHealing(usableSkills, user);
  }

  // check if there was no need for healing.
  if (!supportSkillId)
  {
    // prioritize status buffing on allies.
    supportSkillId = this.decideSupportBuffing(usableSkills, user);
  }

  // check if there was no need for any healing.
  if (!supportSkillId)
  {
    // do nothing.
    return this.decideDoNothing(user);
  }

  // return the chosen skill id.
  return supportSkillId;
};

//region support-cleansing
/**
 * Decides on the best cleansing skill from the selection of skills available.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideSupportCleansing = function(availableSkills, healer)
{
  const nearbyAllies = healer.getAllNearbyAllies();
  let bestSkillId = 0;

  // iterate over all nearby allies.
  nearbyAllies.forEach(ally =>
  {
    const allyBattler = ally.getBattler();

    // and check each of their states.
    const allyStates = allyBattler.states();
    if (allyStates.length > 0)
    {

      // the find the first one that we can cleanse.
      const cleansableState = allyStates.find(state =>
      {
        const isNegative = state.jabsNegative; // skills to be cleansed have a "negative" tag.
        const canBeCleansed = this.determineBestSkillForStateCleansing(availableSkills, state.id, healer);
        return isNegative && canBeCleansed;
      });

      // if we have a cleansable state, then return the best skill for it.
      if (cleansableState)
      {
        bestSkillId = this.determineBestSkillForStateCleansing(availableSkills, cleansableState.id, healer);
      }
    }
  });

  return bestSkillId;
};

/**
 * Determines which skill of the available skills is the most effective for cleansing a given state.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {number} stateIdToBeCleansed The id of the state to be cleansed.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.determineBestSkillForStateCleansing = function(availableSkills, stateIdToBeCleansed, healer)
{
  let bestSkillForStateCleansing = null;
  let highestCleanseRate = 0.0;

  // iterate over all skills available to find the best rate of state removal for the target state.
  availableSkills.forEach(skillId =>
  {
    const skill = healer.getSkill(skillId);

    // find all effects from a skill that remove states.
    const stateCleansingEffects = skill.effects.filter(fx => fx.code === 22 && fx.dataId === stateIdToBeCleansed);

    // if we have effects...
    if (stateCleansingEffects.length > 0)
    {

      // ...iterate over them to find the best rate of state removal.
      stateCleansingEffects.forEach(effect =>
      {
        if (highestCleanseRate < effect.value1)
        {
          bestSkillForStateCleansing = skillId;
          highestCleanseRate = effect.value1;
        }
      });
    }
  });

  return bestSkillForStateCleansing;
};
//endregion support-cleansing

//region support-healing
/**
 * Decides on the best healing skill from the selection of skills available.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideSupportHealing = function(availableSkills, healer)
{
  // filter out the skills that aren't for allies.
  const healingTypeSkills = availableSkills.filter(skillId =>
  {
    const testAction = new Game_Action(healer.getBattler());
    testAction.setSkill(skillId);
    return (testAction.isForAliveFriend() &&  // must target living allies.
      testAction.isRecover() &&               // must recover something.
      testAction.isHpEffect());               // must affect hp.
  });

  let bestSkillId = 0;

  // if we have no healing type skills, then do nothing.
  if (healingTypeSkills.length === 0) return bestSkillId;

  // set the lowest hp ally as your target for supporting with one of our skills.
  const lowestAlly = this.determineLowestHpAlly(healer);
  healer.setAllyTarget(lowestAlly);

  // get all the low hp allies.
  const below60 = this.countLowHpAllies(healer);
  const lowestAllyBattler = lowestAlly.getBattler();
  const healerBattler = healer.getBattler();

  // depending on how many wounded targets we have, determine the best healing skill to use.
  if (below60 === 0)
  {
    // if we have no targets in need of healing, then don't.
    return bestSkillId;
  }

  if (below60 === 1)
  {
    // find the best fit healing skill for a single target.
    bestSkillId = this.bestFitHealingOneSkill(healingTypeSkills, healerBattler, lowestAllyBattler);
  }
  else if (below60 >= 2)
  {
    // find the best fit healing skill for all targets.
    bestSkillId = this.bestFitHealingAllSkill(healingTypeSkills, healerBattler, lowestAllyBattler);
  }

  return bestSkillId;
};

/**
 * Gets the lowest hp ally nearby.
 * @param {JABS_Battler} healer The battler performing the healing.
 * @returns {JABS_Battler}
 */
JABS_AllyAI.prototype.determineLowestHpAlly = function(healer)
{
  const nearbyAllies = healer.getAllNearbyAllies();

  // determine the lowest ally within range.
  let lowestAlly = null;
  nearbyAllies.forEach(ally =>
  {
    if (!lowestAlly)
    {
      // if we don't yet have a lowest ally, assign it.
      lowestAlly = ally;
    }
    else if (ally.getBattler()
      .currentHpPercent() < lowestAlly.getBattler()
      .currentHpPercent())
    {
      // update the ally to determine the lowest ally with the lowest hp.
      lowestAlly = ally;
    }
  });

  return lowestAlly;
};

/**
 * Gets how many of the nearby allies are BELOW the given hp threshold.
 * The default threshold is 60% of max hp.
 * @param {JABS_Battler} healer The battler performing the healing.
 * @param {number} threshold The percent (decimal between 0-1) of what is defined as "low" hp.
 * @returns {number}
 */
JABS_AllyAI.prototype.countLowHpAllies = function(healer, threshold = 0.6)
{
  const nearbyAllies = healer.getAllNearbyAllies();
  let belowThreshold = 0;
  // tally up the allies below the threshold % hp.
  nearbyAllies.forEach(ally =>
  {
    if (ally.getBattler()
      .currentHpPercent() < threshold)
    {
      belowThreshold++;
    }
  });

  return belowThreshold;
};

/**
 * Finds the best-fit healing skill for the target.
 * This is agnostic to whether or not the skill is a multi-target healing skill.
 * @param {number[]} healingTypeSkills The collection of skills that heal hp.
 * @param {Game_Battler} healerBattler The battler choosing the skill.
 * @param {Game_Battler} lowestAllyBattler The ally battler who has the lowest hp.
 * @returns {number}
 */
JABS_AllyAI.prototype.bestFitHealingOneSkill = function(healingTypeSkills, healerBattler, lowestAllyBattler)
{
  let bestSkillId = 0;
  let smallestDifference = Number.MAX_SAFE_INTEGER; // need it to be an unrealistically high difference to start.
  healingTypeSkills.forEach(skillId =>
  {
    const skill = healerBattler.skill(skillId);
    const testAction = new Game_Action(healerBattler);
    testAction.setItemObject(skill);

    // if the lowest ally isn't yourself, and this skill only targets yourself, don't consider it.
    if (healerBattler !== lowestAllyBattler && testAction.isForUser()) return;

    // if the skill doesn't target 1 or all or dead allies, then don't use it (omit random).
    if (!testAction.isForOne() && !testAction.isForAll() && !testAction.isForDeadFriend()) return;

    // get the test heal amount for this skill against the ally.
    const healAmount = Math.abs(testAction.makeDamageValue(lowestAllyBattler, false));

    // determine the difference between the closest healing to full and
    const differenceFromMax = Math.abs((lowestAllyBattler.hp + healAmount) - lowestAllyBattler.mhp);
    if (differenceFromMax < smallestDifference)
    {
      bestSkillId = skillId;
      smallestDifference = differenceFromMax;
    }
  });

  return bestSkillId;
};

/**
 * Finds the best-fit healing skill for multiple targets.
 * If there are no multi-target healing skills available, will instead choose the best single-target.
 * If
 * @param {number[]} healingTypeSkills The collection of skills that heal hp.
 * @param {Game_Battler} healerBattler The battler choosing the skill.
 * @param {Game_Battler} lowestAllyBattler The ally battler who has the lowest hp.
 * @returns {number}
 */
JABS_AllyAI.prototype.bestFitHealingAllSkill = function(healingTypeSkills, healerBattler, lowestAllyBattler)
{
  let bestSkillId = 0;

  // filter out all skills that are not for multiple targets.
  const multiTargetHealingTypeSkills = healingTypeSkills.filter(skillId =>
  {
    const skill = healerBattler.skill(skillId);
    const testAction = new Game_Action(healerBattler);
    testAction.setItemObject(skill);
    return testAction.isForAll();
  });

  // if we have no skills that are multi-targeting, then instead find the best single target.
  if (multiTargetHealingTypeSkills.length === 0) return this.bestFitHealingOneSkill();

  // if there is only one skill that multi-targets, then use that.
  if (multiTargetHealingTypeSkills.length === 1) return multiTargetHealingTypeSkills[0];

  let smallestDifference = 99999999; // need it to be an unrealistically high difference to start.
  multiTargetHealingTypeSkills.forEach(skillId =>
  {
    const skill = healerBattler.skill(skillId);
    const testAction = new Game_Action(healerBattler);
    testAction.setItemObject(skill);

    // get the test heal amount for this skill against the ally.
    const healAmount = Math.abs(testAction.makeDamageValue(lowestAllyBattler, false));

    // determine the difference between the closest healing to full and
    const differenceFromMax = Math.abs((lowestAllyBattler.hp + healAmount) - lowestAllyBattler.mhp);
    if (differenceFromMax < smallestDifference)
    {
      bestSkillId = skillId;
      smallestDifference = differenceFromMax;
    }
  });

  return bestSkillId;
};
//endregion support-healing

//region support-buffing
/**
 * Decides on the best buffing skill from the selection of skills available.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideSupportBuffing = function(availableSkills, healer)
{
  const nearbyAllies = healer.getAllNearbyAllies();

  // iterate over all skills available to find a state that would benefit your allies.
  let bestSkillId = 0;
  let chosenAlly = null;
  availableSkills.forEach(skillId =>
  {
    const skill = healer.getSkill(skillId);

    // find all effects from a skill that add states.
    const stateAddingEffects = skill.effects.filter(fx => fx.code === 21);

    // if we have effects...
    if (stateAddingEffects.length > 0)
    {
      // ...iterate over them...
      let ready = false;
      stateAddingEffects.forEach(effect =>
      {
        if (ready) return;

        // ...and check each ally and see if they have it yet.
        nearbyAllies.forEach(ally =>
        {
          // see if the state for this ally is expired or about to expire.
          const trackedState = $jabsEngine.getJabsStateByUuidAndStateId(ally.getUuid(), effect.dataId);
          if (!trackedState || trackedState.isAboutToExpire())
          {
            // stop looking and use the below skill and target ally.
            ready = true;
            bestSkillId = skillId;
            chosenAlly = ally;
          }
        });
      });
    }
  });

  // if we ended up deciding an ally, then set them for targeting.
  if (chosenAlly)
  {
    healer.setAllyTarget(chosenAlly);
  }

  return bestSkillId;
};
//endregion support-buffing
//endregion support

/**
 * Overwrites {@link #aiComboChanceModifier}.
 * Adjusts the bonus combo chance modifier based on the selected ally AI mode.
 * @returns {number}
 */
JABS_AllyAI.prototype.aiComboChanceModifier = function()
{
  // determine which AI mode the ally is assigned.
  const currentMode = this.getMode().key;

  // modify the combo chance based on the selected AI mode.
  switch (currentMode)
  {
    case JABS_AllyAI.modes.BASIC_ATTACK.key:
      return 30;
    case JABS_AllyAI.modes.VARIETY.key:
      return 20;
    case JABS_AllyAI.modes.FULL_FORCE.key:
      return 50;
    case JABS_AllyAI.modes.SUPPORT.key:
      return 10;
    default:
      return 0;
  }
};
//endregion decide action

//region battle memory
/**
 * Handles a new memory for this battler's ally ai.
 * @param {JABS_BattleMemory} newMemory The new memory to handle.
 */
JABS_AllyAI.prototype.applyMemory = function(newMemory)
{
  const memory = this.getMemory(newMemory.battlerId, newMemory.skillId);
  if (!memory)
  {
    this.addMemory(newMemory);
  }
  else
  {
    this.updateMemory(newMemory);
  }
};

/**
 * Gets a memory for a given battler id and skill id.
 * @param {number} battlerId The composite key of the battler id to find a memory for.
 * @param {number} skillId The composite key of the skill id to find a memory for.
 * @returns {JABS_BattleMemory}
 */
JABS_AllyAI.prototype.getMemory = function(battlerId, skillId)
{
  return this.memory.find(mem => mem.battlerId === battlerId && mem.skillId === skillId);
};

/**
 * Adds a new battle memory to this ally ai.
 * @param {JABS_BattleMemory} newMemory The new memory to add to the collection.
 */
JABS_AllyAI.prototype.addMemory = function(newMemory)
{
  this.memory.push(newMemory);
  this.memory.sort();
};

/**
 * Updates a battle memory with the new one.
 * @param {JABS_BattleMemory} newMemory The new memory to replace the old.
 */
JABS_AllyAI.prototype.updateMemory = function(newMemory)
{
  let memory = this.getMemory(newMemory.battlerId, newMemory.skillId);
  memory = newMemory;
  this.memory.sort();
};

JABS_AllyAI.prototype.filterMemoriesByEffectiveness = function(usableSkills)
{
  // a filtering function for filtering out unknown or ineffective skill ids.
  const filtering = skillId =>
  {
    // grab the prior memory based on the skill id.
    const priorMemory = memoriesOfTarget.find(mem => mem.skillId === skillId);

    // if there was no prior memory, then this skill isn't known to be effective.
    if (!priorMemory) return false;

    // if the memory exists and was effective, then include this skill.
    if (priorMemory.wasEffective()) return true;

    // the memory existed, but wasn't effective, so disclude this skill.
    return false;
  };

  // return the filtered list of skills.
  return usableSkills.filter(filtering);
};
//endregion battle memory
//endregion JABS_AllyAI