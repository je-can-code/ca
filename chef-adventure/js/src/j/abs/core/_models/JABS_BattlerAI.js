//#region JABS_BattlerAI
/**
 * An object representing the structure of the `JABS_Battler` AI.
 */
class JABS_BattlerAI
{
  /**
   * @constructor
   * @param {boolean} careful Add pathfinding pursuit and more.
   * @param {boolean} executor Add weakpoint targeting.
   * @param {boolean} reckless Add skill spamming over attacking.
   * @param {boolean} healer Prioritize healing if health is low.
   * @param {boolean} follower Only attacks alone, obeys leaders.
   * @param {boolean} leader Enables ally coordination.
   */
  constructor(
    careful = false,
    executor = false,
    reckless = false,
    healer = false,
    follower = false,
    leader = false
  )
  {
    /**
     * An ai trait that prevents this user from executing skills that are
     * elementally ineffective against their target.
     */
    this.careful = careful;

    /**
     * An ai trait that encourages this user to always use the strongest
     * available skill.
     */
    this.executor = executor;

    /**
     * An ai trait that forces this user to always use skills if possible.
     */
    this.reckless = reckless;

    /**
     * An ai trait that prioritizes healing allies.
     * If combined with smart, the most effective healing skill will be used.
     * If combined with reckless, the healer will spam healing.
     * If combined with smart AND reckless, the healer will only use the biggest
     * healing spells available.
     */
    this.healer = healer;

    /**
     * An ai trait that prevents the user from executing anything other than
     * their basic attack while they lack a leader.
     */
    this.follower = follower;

    /**
     * An ai trait that gives a battler the ability to use its own ai to
     * determine skills for a follower. This is usually combined with other
     * ai traits.
     */
    this.leader = leader;
  }

  /**
   * Checks whether or not this AI has any bonus ai traits.
   * @returns {boolean} True if there is at least one bonus trait, false otherwise.
   */
  hasBonusAiTraits()
  {
    return (
      this.careful ||
      this.executor ||
      this.reckless ||
      this.healer ||
      this.follower ||
      this.leader);
  }

  /**
   * Decides an action for the designated follower based on the leader's ai.
   * @param {JABS_Battler} leaderBattler The leader deciding the action.
   * @param {JABS_Battler} followerBattler The follower executing the decided action.
   * @returns {number} The skill id of the decided skill for the follower to perform.
   */
  decideActionForFollower(leaderBattler, followerBattler)
  {
    // grab the basic attack skill id for this battler.
    const [basicAttackSkillId] = followerBattler.getEnemyBasicAttack();

    let skillsToUse = followerBattler.getSkillIdsFromEnemy();

    // if the enemy has no skills, then just basic attack.
    if (!skillsToUse.length)
    {
      // if there are no actual skills on this enemy, just use it's basic attack.
      return basicAttackSkillId;
    }

    // all follower actions are decided based on the leader's ai.
    const {careful, executor, healer} = this;

    // the leader calculates for the follower, so the follower gets the leader's sight as a bonus.
    const modifiedSightRadius = leaderBattler.getSightRadius() + followerBattler.getSightRadius();

    // healer AI takes priority.
    if (healer)
    {
      // get nearby allies with the leader's modified sight range of both battlers.
      const allies = $gameMap.getBattlersWithinRange(leaderBattler, modifiedSightRadius);

      // prioritize healing when self or allies are low on hp.
      if (healer)
      {
        skillsToUse = this.filterSkillsHealerPriority(followerBattler, skillsToUse, allies);
      }
    }
    else if (careful || executor)
    {
      // focus on the leader's target instead of the follower's target.
      skillsToUse = this.decideAttackAction(leaderBattler, skillsToUse);
    }

    // if the enemy has no skills after all the filtering, then just basic attack.
    if (!skillsToUse.length)
    {
      // basic attacking is always an option.
      return basicAttackSkillId;
    }

    // handle either collection or single skill.
    // TODO: probably should unify the responses of the above to return either a single OR collection.
    let chosenSkillId = Array.isArray(skillsToUse) ? skillsToUse[0] : skillsToUse;

    // grab the battler of the follower.
    const followerGameBattler = followerBattler.getBattler();

    // grab the skill.
    const skill = followerGameBattler.skill(chosenSkillId);

    // check if they can pay the costs of the skill.
    if (!followerGameBattler.canPaySkillCost(skill))
    {
      // if they can't pay the cost of the decided skill, you can always basic attack!
      chosenSkillId = basicAttackSkillId;
    }

    return chosenSkillId;
  }

  /**
   * Decides a support-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideSupportAction(user, skillsToUse)
  {
    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return [];

    const allies = $gameMap.getAllyBattlersWithinRange(user, user.getSightRadius());

    // prioritize healing when self or allies are low on hp.
    if (this.healer)
    {
      skillsToUse = this.filterSkillsHealerPriority(user, skillsToUse, allies);
    }

    // if we ended up not picking a skill, then clear any ally targeting.
    if (!skillsToUse.length)
    {
      user.setAllyTarget(null);
    }

    // handle the possibility of none or many skills still remaining.
    return this.decideFromNoneToManySkills(user, skillsToUse);
  }

  /**
   * Decides an attack-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideAttackAction(user, skillsToUse)
  {
    // reduce the list to only castable skills.
    skillsToUse = this.filterUncastableSkills(user, skillsToUse);

    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return [];

    const {careful, executor} = this;
    const target = user.getTarget();

    // filter out skills that are elementally ineffective.
    if (careful)
    {
      skillsToUse = this.filterElementallyIneffectiveSkills(skillsToUse, target);
    }

    // find most elementally effective skill vs the target.
    if (executor)
    {
      skillsToUse = this.findMostElementallyEffectiveSkill(skillsToUse, user, target);
    }

    // handle the possibility of none or many skills still remaining.
    return this.decideFromNoneToManySkills(user, skillsToUse);
  }

  /**
   * Filters out skills that cannot be executed at this time by the battler.
   * This prevents the user from continuously picking a skill they cannot execute.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @returns {number[]}
   */
  filterUncastableSkills(user, skillsToUse)
  {
    // check to make sure we have skills to filter.
    if (!skillsToUse || !skillsToUse.length) return [];

    // filter the skills by whether or not they can be executed.
    return skillsToUse.filter(user.canExecuteSkill, user);
  }

  /**
   * A protection method for handling none, one, or many skills remaining after
   * filtering, and only returning a single skill id.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]|number|null} skillsToUse The available skills to use.
   * @returns {number}
   */
  decideFromNoneToManySkills(user, skillsToUse)
  {
    // check if "skills" is actually just one valid skill.
    if (Number.isInteger(skillsToUse))
    {
      // return that, this is fine.
      return skillsToUse;
    }
    // check if "skills" is indeed an array of skills with values.
    else if (Array.isArray(skillsToUse) && skillsToUse.length)
    {
      // pick one at random.
      return skillsToUse[Math.randomInt(skillsToUse.length)];
    }

    // always at least basic attack.
    return user.getEnemyBasicAttack()[0];
  }

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will purge all elementally ineffective skills from the collection.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler} target The battler to decide the action about.
   */
  filterElementallyIneffectiveSkills(skillsToUse, target)
  {
    if (skillsToUse.length > 1)
    {
      skillsToUse = skillsToUse.filter(skillId =>
      {
        const testAction = new Game_Action(target.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        return rate >= 1
      });
    }

    return skillsToUse;
  }

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will choose the skill that has the highest elemental effectiveness.
   * @param {number[]|number} skillsToUse The available skills to use.
   * @param {JABS_Battler} user The battler to decide the action.
   * @param {JABS_Battler} target The battler to decide the action about.
   */
  findMostElementallyEffectiveSkill(skillsToUse, user, target)
  {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    if (skillsToUse.length > 1)
    {
      const elementalSkillCollection = [];
      skillsToUse.forEach(skillId =>
      {
        const testAction = new Game_Action(user.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        elementalSkillCollection.push([skillId, rate]);
      });

      // sorts the skills by their elemental effectiveness.
      elementalSkillCollection.sort((a, b) =>
      {
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        return 0;
      });

      // only use the highest elementally effective skill.
      skillsToUse = elementalSkillCollection[0][0];
    }

    return skillsToUse;
  }

  /**
   * Filters skills by a healing priority.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler[]} allies
   * @returns {number} The best skill id for healing according to this battler.
   */
  filterSkillsHealerPriority(user, skillsToUse, allies)
  {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    // if we have no ai traits that affect skill-decision-making, then don't perform the logic.
    const {careful, reckless} = this;
    if (!careful && !reckless) return skillsToUse;

    let mostWoundedAlly = null;
    let lowestHpRatio = 1.01;
    let actualHpDifference = 0;
    let alliesBelow66 = 0;
    let alliesMissingAnyHp = 0;

    // iterate over allies to determine the ally with the lowest hp%
    allies.forEach(ally =>
    {
      const battler = ally.getBattler();
      const hpRatio = battler.hp / battler.mhp;

      // if it is lower than the last-tracked-lowest, then update the lowest.
      if (lowestHpRatio > hpRatio)
      {
        lowestHpRatio = hpRatio;
        mostWoundedAlly = ally;
        actualHpDifference = battler.mhp - battler.hp;

        // count all allies below the "heal all" threshold.
        if (hpRatio <= 0.66)
        {
          alliesBelow66++;
        }
      }

      // count all allies missing any amount of hp.
      if (hpRatio < 1)
      {
        alliesMissingAnyHp++;
      }
    });

    // if there are no allies that are missing hp, then just return... unless we're reckless 🌚.
    if (!alliesMissingAnyHp && !reckless) return skillsToUse;

    user.setAllyTarget(mostWoundedAlly);
    const mostWoundedAllyBattler = mostWoundedAlly.getBattler();

    // filter out the skills that aren't for allies.
    const healingTypeSkills = skillsToUse.filter(skillId =>
    {
      const testAction = new Game_Action(user.getBattler());
      testAction.setSkill(skillId);
      return (testAction.isForAliveFriend() &&  // must target living allies.
        testAction.isRecover() &&               // must recover something.
        testAction.isHpEffect());               // must affect hp.
    });

    // if we have 0 or 1 skills left after healing, just return that.
    if (healingTypeSkills.length < 2)
    {
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
    healingTypeSkills.forEach(skillId =>
    {
      const skill = $dataSkills[skillId];
      const testAction = new Game_Action(user.getBattler());
      testAction.setItemObject(skill);
      const healAmount = testAction.makeDamageValue(mostWoundedAllyBattler, false);
      if (Math.abs(runningBiggestHeal) < Math.abs(healAmount))
      {
        biggestHealSkill = skillId;
        runningBiggestHeal = healAmount;
      }

      // if this is our first skill in the possible heal skills available, write to all skills.
      if (!firstSkill)
      {
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
      if (testAction.isForAll())
      {
        // if this heal amount is bigger than the running biggest heal-all amount, then update.
        if (runningBiggestHealAll < healAmount)
        {
          biggestHealAllSkill = skillId;
          runningBiggestHealAll = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-all amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealAll - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference)
        {
          closestFitHealAllSkill = skillId;
          runningClosestFitHealAll = healAmount;
        }
      }

      // analyze the heal one skills for biggest and closest fits.
      if (testAction.isForOne())
      {
        // if this heal amount is bigger than the running biggest heal-one amount, then update.
        if (runningBiggestHealOne < healAmount)
        {
          biggestHealOneSkill = skillId;
          runningBiggestHealOne = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-one amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealOne - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference)
        {
          closestFitHealOneSkill = skillId;
          runningClosestFitHealOne = healAmount;
        }
      }
    });

    const skillOptions = [biggestHealAllSkill, biggestHealOneSkill, closestFitHealAllSkill, closestFitHealOneSkill];
    bestSkillId = skillOptions[Math.randomInt(skillOptions.length)];

    // careful will decide in this order:
    if (careful)
    {
      // - if any below 40%, then prioritize heal-one of most wounded.
      if (lowestHpRatio <= 0.40)
      {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;

        // - if none below 40% but multiple wounded, prioritize closest-fit heal-all.
      }
      else if (alliesMissingAnyHp > 1 && lowestHpRatio < 0.80)
      {
        bestSkillId = defensive ? biggestHealAllSkill : closestFitHealAllSkill;

        // - if only one wounded, then heal them.
      }
      else if (alliesMissingAnyHp === 1 && lowestHpRatio < 0.80)
      {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;
        // - if none wounded, or none below 80%, then don't heal.
      }
    }
    else
    {
      // - if there is only one wounded ally, prioritize biggest heal-one skill.
      if (alliesMissingAnyHp === 1)
      {
        bestSkillId = biggestHealOneSkill;
        // - if there is more than one wounded ally, prioritize biggest heal-all skill.
      }
      else if (alliesMissingAnyHp > 1)
      {
        bestSkillId = biggestHealAllSkill;
        // - if none wounded, don't heal.
      }
    }

    // reckless will decide in this order:
    if (reckless)
    {
      // - if there are any wounded allies, always use biggest heal skill, for one or all.
      if (alliesMissingAnyHp > 0)
      {
        bestSkillId = biggestHealSkill;
        // - if none wounded, don't heal.
      }
    }

    return bestSkillId;
  }
}
//#endregion JABS_BattlerAI