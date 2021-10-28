/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Data structure of a JABS_Battler's AI.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This class represents an enemy's AI in the context of JABS.
 * Logic for determining skill choice for leaders/followers/individuals is
 * all mostly found here.
 * ============================================================================
 */

/**
 * An object representing the structure of the `JABS_Battler` AI.
 */
class JABS_BattlerAI {
  /**
   * @constructor
   * @param {boolean} basic Enable the most basic of AI (recommended).
   * @param {boolean} smart Add pathfinding pursuit and more.
   * @param {boolean} executor Add weakpoint targeting.
   * @param {boolean} defensive Add defending and support skills for allies.
   * @param {boolean} reckless Add skill spamming over attacking.
   * @param {boolean} healer Prioritize healing if health is low.
   * @param {boolean} follower Only attacks alone, obeys leaders.
   * @param {boolean} leader Enables ally coordination.
   */
  constructor(
    basic = true, 
    smart = false, 
    executor = false, 
    defensive = false, 
    reckless = false, 
    healer = false, 
    follower = false, 
    leader = false
  ) {
    /**
     * The most basic of AI: just move and take action.
     *
     * `10000000`, first bit.
     */
    this.basic = basic;

    /**
     * Adds an additional skillset; enabling intelligent pursuit among other things.
     *
     * `01000000`, second bit.
     */
    this.smart = smart;

    /**
     * Adds an additional skillset; targeting a foe's weakspots if available.
     *
     * `00100000`, third bit.
     */
    this.executor = executor;

    /**
     * Adds an additional skillset; allowing defending in place of action
     * and supporting allies with buff skills.
     *
     * `00010000`, fourth bit.
     */
    this.defensive = defensive;

    /**
     * Adds an additional skillset; forcing skills whenever available.
     *
     * `00001000`, fifth bit.
     */
    this.reckless = reckless;

    /**
     * Adds an additional skillset; prioritizing healing skills when either
     * oneself' or allies' current health reach below 66% of max health.
     *
     * `00000100`, sixth bit.
     */
    this.healer = healer;

    /**
     * Adds an additional skillset; performs only basic attacks when
     * engaged. If a leader is nearby, a leader will encourage actually
     * available skills intelligently based on the target.
     *
     * `00000010`, seventh bit.
     */
    this.follower = follower;

    /**
     * Adds an additional skillset; enables ally coordination.
     *
     * `00000001`, eighth bit.
     */
    this.leader = leader;
  };

  /**
   * Decides an action for the designated follower based on the leader's ai.
   * @param {JABS_Battler} leaderBattler The leader deciding the action.
   * @param {JABS_Battler} followerBattler The follower executing the decided action.
   * @returns {number} The skill id of the decided skill for the follower to perform.
   */
  decideActionForFollower(leaderBattler, followerBattler) {
    // all follower actions are decided based on the leader's ai.
    const { smart, executor, defensive, healer } = this;
    const basicAttackId = followerBattler.getEnemyBasicAttack()[0];
    let skillsToUse = followerBattler.getSkillIdsFromEnemy();
    if (skillsToUse.length) {
      const modifiedSightRadius = leaderBattler.getSightRadius() + followerBattler.getSightRadius();
      if (healer || defensive) {
        // get nearby allies with the leader's modified sight range of both battlers.
        const allies = $gameMap.getBattlersWithinRange(leaderBattler, modifiedSightRadius);
  
        // prioritize healing when self or allies are low on hp.
        if (healer) {
          skillsToUse = this.filterSkillsHealerPriority(followerBattler, skillsToUse, allies);
        }
  
        // find skill that has the most buffs on it.
        if (defensive) {
          skillsToUse = this.filterSkillsDefensivePriority(skillsToUse, allies);
        }
      } else if (smart || executor) {
        // focus on the leader's target instead of the follower's target.
        skillsToUse = this.decideAttackAction(leaderBattler, skillsToUse);  
      }
    } else {
      // if there are no actual skills on this enemy, just use it's basic attack.
      return basicAttackId;
    }

    let chosenSkillId = Array.isArray(skillsToUse)
      ? skillsToUse[0]
      : skillsToUse;
    const followerGameBattler = followerBattler.getBattler();
    const canPayChosenSkillCosts = followerGameBattler.canPaySkillCost($dataSkills[chosenSkillId]);
    if (!canPayChosenSkillCosts) {
      // if they can't pay the cost of the decided skill, check the basic attack.
      chosenSkillId = basicAttackId;
    }

    return chosenSkillId;
  };

  /**
   * Decides a support-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideSupportAction(user, skillsToUse) {
    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return skillsToUse;

    const { healer, defensive } = this;
    const allies = $gameMap.getAllyBattlersWithinRange(user, user.getSightRadius());

    // prioritize healing when self or allies are low on hp.
    if (healer) {
      skillsToUse = this.filterSkillsHealerPriority(user, skillsToUse, allies);
    }

    // find skill that has the most buffs on it.
    if (defensive) {
      skillsToUse = this.filterSkillsDefensivePriority(user, skillsToUse, allies);
    }

    // if we ended up not picking a skill, then clear any ally targeting.
    if (!skillsToUse.length) {
      user.setAllyTarget(null);
    }

    return skillsToUse;
  }

  /**
   * Decides an attack-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideAttackAction(user, skillsToUse) {
    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return skillsToUse;

    const { smart, executor } = this;
    const target = user.getTarget();

    // filter out skills that are elementally ineffective.
    if (smart) {
      skillsToUse = this.filterElementallyIneffectiveSkills(skillsToUse, target);
    }
  
    // find most elementally effective skill vs the target.
    if (executor) {
      skillsToUse = this.findMostElementallyEffectiveSkill(skillsToUse, target);
    }

    return skillsToUse;
  };

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will purge all elementally ineffective skills from the collection.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler} target The battler to decide the action about.
   */
  filterElementallyIneffectiveSkills(skillsToUse, target) {
    if (skillsToUse.length > 1) {
      skillsToUse = skillsToUse.filter(skillId => {
        const testAction = new Game_Action(target.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        return rate >= 1
      });
    }

    return skillsToUse;
  };

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will choose the skill that has the highest elemental effectiveness.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler} target The battler to decide the action about.
   * @param {number[]} skillsToUse The available skills to use.
   */
  findMostElementallyEffectiveSkill(skillsToUse, target) {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    if (skillsToUse.length > 1) {
      let elementalSkillCollection = [];
      skillsToUse.forEach(skillId => {
        const testAction = new Game_Action(target.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        elementalSkillCollection.push([skillId, rate]);
      });

      // sorts the skills by their elemental effectiveness.
      elementalSkillCollection.sort((a, b) => {
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
      });

      // only use the highest elementally effective skill.
      skillsToUse = elementalSkillCollection[0][0];
    }

    return skillsToUse;
  };

  /**
   * Filters skills by a defensive priority.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler[]} allies 
   * @returns 
   */
  filterSkillsDefensivePriority(user, skillsToUse, allies) {
    return skillsToUse;
  };

  /**
   * Filters skills by a healing priority.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler[]} allies 
   * @returns 
   */
  filterSkillsHealerPriority(user, skillsToUse, allies) {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    // if we have no ai traits that affect skill-decision-making, then don't perform the logic.
    const { basic, smart, defensive, reckless } = this;
    if (!basic && !smart && !defensive && !reckless) return skillsToUse;

    let mostWoundedAlly = null;
    let lowestHpRatio = 1.01;
    let actualHpDifference = 0;
    let alliesBelow66 = 0;
    let alliesMissingAnyHp = 0;

    // iterate over allies to determine the ally with the lowest hp%
    allies.forEach(ally => {
      const battler = ally.getBattler();
      const hpRatio = battler.hp / battler.mhp;
      
      // if it is lower than the last-tracked-lowest, then update the lowest.
      if (lowestHpRatio > hpRatio) {
        lowestHpRatio = hpRatio;
        mostWoundedAlly = ally;
        actualHpDifference = battler.mhp - battler.hp;

        // count all allies below the "heal all" threshold.
        if (hpRatio <= 0.66) {
          alliesBelow66++;
        }
      }

      // count all allies missing any amount of hp.
      if (hpRatio < 1) {
        alliesMissingAnyHp++;
      }
    });

    // if there are no allies that are missing hp, then just return... unless we're reckless 🌚.
    if (!alliesMissingAnyHp && !reckless ) return skillsToUse;

    user.setAllyTarget(mostWoundedAlly);
    const mostWoundedAllyBattler = mostWoundedAlly.getBattler();

    // filter out the skills that aren't for allies.
    const healingTypeSkills = skillsToUse.filter(skillId => {
      const testAction = new Game_Action(user.getBattler());
      testAction.setSkill(skillId);
      return (testAction.isForAliveFriend() &&  // must target living allies.
        testAction.isRecover() &&               // must recover something.
        testAction.isHpEffect());               // must affect hp.
    });

    // if we have 0 or 1 skills left after healing, just return that.
    if (healingTypeSkills.length < 2) {
      return healingTypeSkills;
    }

    // determine the best skill based on AI traits.
    let bestSkillId = null;
    let runningBiggestHealAll = 0;
    let runningBiggestHealOne = 0;
    let runningClosestFitHealAll = 0;
    let runningClosestFitHealOne = 0;
    let runningBiggestHeal = 0;
    let biggestHealSkill = null;
    let biggestHealAllSkill = null;
    let biggestHealOneSkill = null;
    let closestFitHealAllSkill = null;
    let closestFitHealOneSkill = null;
    let firstSkill = false;
    healingTypeSkills.forEach(skillId => {
      const skill = $dataSkills[skillId];
      const testAction = new Game_Action(user.getBattler());
      testAction.setItemObject(skill);
      const healAmount = testAction.makeDamageValue(mostWoundedAllyBattler, false);
      if (Math.abs(runningBiggestHeal) < Math.abs(healAmount)) {
        biggestHealSkill = skillId;  
        runningBiggestHeal = healAmount;
      }

      // if this is our first skill in the possible heal skills available, write to all skills.
      if (!firstSkill) {
        biggestHealAllSkill = skillId;
        runningBiggestHealAll = healAmount;
        closestFitHealAllSkill = skillId;
        runningClosestFitHealAll = healAmount;
        biggestHealOneSkill = skillId;
        runningBiggestHealOne = healAmount;
        closestFitHealOneSkill = skillId;
        runningClosestFitHealOne = healAmount;
        firstSkill = true;
      }

      // analyze the heal all skills for biggest and closest fits.
      if (testAction.isForAll()) {
        // if this heal amount is bigger than the running biggest heal-all amount, then update.
        if (runningBiggestHealAll < healAmount) {
          biggestHealAllSkill = skillId;
          runningBiggestHealAll = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-all amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealAll - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference) {
          closestFitHealAllSkill = skillId;
          runningClosestFitHealAll = healAmount;
        }
      }

      // analyze the heal one skills for biggest and closest fits.
      if (testAction.isForOne()) {
        // if this heal amount is bigger than the running biggest heal-one amount, then update.
        if (runningBiggestHealOne < healAmount) {
          biggestHealOneSkill = skillId;
          runningBiggestHealOne = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-one amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealOne - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference) {
          closestFitHealOneSkill = skillId;
          runningClosestFitHealOne = healAmount;
        }
      }
    });

    // basic will just pick a random one from the four skill options.
    // basic will get overwritten if there are additional ai traits.
    if (basic) {
      const skillOptions = [biggestHealAllSkill, biggestHealOneSkill, closestFitHealAllSkill, closestFitHealOneSkill];
      bestSkillId = skillOptions[Math.randomInt(skillOptions.length)];
    }

    // smart will decide in this order: 
    if (smart) {
      // - if any below 40%, then prioritize heal-one of most wounded.
      if (lowestHpRatio <= 0.40) {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;

      // - if none below 40% but multiple wounded, prioritize closest-fit heal-all.
      } else if (alliesMissingAnyHp > 1 && lowestHpRatio < 0.80) {
        bestSkillId = defensive ? biggestHealAllSkill : closestFitHealAllSkill;

      // - if only one wounded, then heal them.
      } else if (alliesMissingAnyHp === 1 && lowestHpRatio < 0.80) {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;
      // - if none wounded, or none below 80%, then don't heal.
      } else { }
    }

    // defensive will decide in this order:
    if (defensive && !smart) {
      // - if there is only one wounded ally, prioritize biggest heal-one skill.
      if (alliesMissingAnyHp === 1) {
        bestSkillId = biggestHealOneSkill;
      // - if there is more than one wounded ally, prioritize biggest heal-all skill.
      } else if (alliesMissingAnyHp > 1) {
        bestSkillId = biggestHealAllSkill;
      // - if none wounded, don't heal.
      } else { }
    }

    // reckless will decide in this order:
    if (reckless) {
      // - if there are any wounded allies, always use biggest heal skill, for one or all.
      if (alliesMissingAnyHp > 0) {
        bestSkillId = biggestHealSkill;
      // - if none wounded, don't heal.
      } else { }
    }

    return bestSkillId;
  };
};
//ENDFILE