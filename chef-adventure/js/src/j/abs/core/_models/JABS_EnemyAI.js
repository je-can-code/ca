//region JABS_EnemyAI
/**
 * An object representing the structure of the `JABS_Battler` AI.
 */
class JABS_EnemyAI extends JABS_AI
{
  /**
   * An ai trait that prevents this user from executing skills that are
   * elementally ineffective against their target.
   */
  careful = false;

  /**
   * An ai trait that encourages this user to always use the strongest
   * available skill.
   */
  executor = false;

  /**
   * An ai trait that forces this user to always use skills if possible.
   */
  reckless = false;

  /**
   * An ai trait that prioritizes healing allies.
   * If combined with smart, the most effective healing skill will be used.
   * If combined with reckless, the healer will spam healing.
   * If combined with smart AND reckless, the healer will only use the biggest
   * healing spells available.
   */
  healer = false;

  /**
   * An ai trait that prevents the user from executing anything other than
   * their basic attack while they lack a leader.
   */
  follower = false;

  /**
   * An ai trait that gives a battler the ability to use its own ai to
   * determine skills for a follower. This is usually combined with other
   * ai traits.
   */
  leader = false;

  /**
   * Constructor.
   * @param {boolean} careful Add pathfinding pursuit and more.
   * @param {boolean} executor Add weakpoint targeting.
   * @param {boolean} reckless Add skill spamming over attacking.
   * @param {boolean} healer Prioritize healing if health is low.
   * @param {boolean} follower Only attacks alone, obeys leaders.
   * @param {boolean} leader Enables ally coordination.
   */
  constructor(careful = false, executor = false, reckless = false, healer = false, follower = false, leader = false)
  {
    // perform original initialization.
    super();

    // assign the AI.
    this.careful = careful;
    this.executor = executor;
    this.reckless = reckless;
    this.healer = healer;
    this.follower = follower;
    this.leader = leader;
  }

  /**
   * Decides an action based on this battler's AI, the target, and the given available skills.
   * @param {JABS_Battler} user The battler of the AI deciding a skill.
   * @param {JABS_Battler} target The target battler to decide an action against.
   * @param {number[]} availableSkills A collection of all skill ids to potentially pick from.
   * @returns {number|null} The skill id chosen to use, or null if none were valid choices for this AI.
   */
  decideAction(user, target, availableSkills)
  {
    // filter out the unusable or invalid skills.
    const usableSkills = this.filterUncastableSkills(user, availableSkills);

    // extract the AI data points out.
    const { careful, executor, reckless, healer, follower, leader } = this;

    // check if this is a "leader" battler.
    if (leader)
    {
      // "leader" battlers decide actions for nearby "follower" battlers before their own actions.
      this.decideActionsForFollowers(user);
    }

    // check if we need to warn the RM dev that they chose reckless but assigned no skills.
    if (reckless && usableSkills.length === 0)
    {
      console.warn('a battler with the "reckless" trait was found with no skills.', user);
    }

    // pivot on the ai traits available to decide what skill to use.
    switch (this)
    {
      case follower:
        return this.decideFollowerAi(user);
      case healer:
        return this.decideSupportAction(user, usableSkills);
      case (careful || executor || reckless):
        return this.decideAttackAction(user, usableSkills);
      default:
        return this.decideGenericAction(user, usableSkills);
    }
  }

  //region leader
  /**
   * Decides the next action for all applicable followers.
   * @param {JABS_Battler} leader The leader to make decisions with.
   */
  decideActionsForFollowers(leader)
  {
    // grab all nearby followers.
    const nearbyFollowers = JABS_AiManager.getLeaderFollowers(leader);

    // iterate over each found follower.
    nearbyFollowers.forEach(follower => this.decideFollowerAction(leader, follower));
  }

  /**
   * Decides the next action for a follower.
   * @param {JABS_Battler} leader The leader battler.
   * @param {JABS_Battler} follower The follower battler potentially being lead.
   */
  decideFollowerAction(leader, follower)
  {
    // leaders can't control other leaders' followers.
    if (!this.canDecideActionForFollower(leader, follower)) return;

    // assign the follower to this leader.
    if (!follower.hasLeader())
    {
      // update the follower's leader.
      follower.setLeader(leader.getUuid());
    }

    // decide the action of the follower for them.
    const decidedFollowerSkillId = leader.getAiMode().decideActionForFollower(leader, follower);

    // validate the skill chosen.
    if (this.isSkillIdValid(decidedFollowerSkillId))
    {
      // set it as their next action.
      follower.setLeaderDecidedAction(decidedFollowerSkillId);
    }
  }

  /**
   * Determines whether or not this leader can lead the given follower.
   * @param {JABS_Battler} leader The leader battler.
   * @param {JABS_Battler} follower The follower battler potentially being lead.
   * @returns {boolean} True if this leader can lead this follower, false otherwise.
   */
  canDecideActionForFollower(leader, follower)
  {
    // check if the follower and the leader are actually the same.
    if (leader === follower)
    {
      // you are already in control, bro.
      return false;
    }

    // check if the follower exists.
    if (!follower)
    {
      // there is nothing to control.
      return false;
    }

    // check if the follower is a leader themself.
    if (follower.getAiMode().leader)
    {
      // leaders cannot control leaders.
      return false;
    }

    // check if the follower has a leader that is different than this leader.
    if (follower.hasLeader() && follower.getLeader() !== leader.getUuid())
    {
      // stop trying to boss other leader's followers around!
      leader.removeFollower(follower.getUuid());

      // they are already under control.
      return false;
    }

    // lead this follower!
    return true;

  }

  /**
   * Decides an action for the designated follower based on the leader's ai.
   * @param {JABS_Battler} leaderBattler The leader deciding the action.
   * @param {JABS_Battler} followerBattler The follower executing the decided action.
   * @returns {number} The skill id of the decided skill for the follower to perform.
   */
  decideActionForFollower(leaderBattler, followerBattler)
  {
    // check first if we should follow with the next hit of the combo.
    if (this.shouldFollowWithCombo(followerBattler))
    {
      // we're doing the next combo in the chain!
      return this.followWithCombo(followerBattler);
    }

    // grab the basic attack skill id for this battler.
    const basicAttackSkillId = followerBattler.getEnemyBasicAttack();

    // start with the follower's own list of skills.
    let skillsToUse = followerBattler.getSkillIdsFromEnemy();

    // if the enemy has no skills, then just basic attack.
    if (!skillsToUse.length)
    {
      // if there are no actual skills on this enemy, just use it's basic attack.
      return basicAttackSkillId;
    }

    // all follower actions are decided based on the leader's ai.
    const { careful, executor, healer } = this;

    // the leader calculates for the follower, so the follower gets the leader's sight as a bonus.
    const modifiedSightRadius = leaderBattler.getSightRadius() + followerBattler.getSightRadius();

    // healer AI takes priority.
    if (healer)
    {
      // get nearby allies with the leader's modified sight range of both battlers.
      const allies = JABS_AiManager.getAlliedBattlersWithinRange(leaderBattler, modifiedSightRadius);

      // update the collection based on healing skills.
      skillsToUse = this.filterSkillsHealerPriority(followerBattler, skillsToUse, allies);
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
    const chosenSkillId = Array.isArray(skillsToUse)
      ? skillsToUse.at(0)
      : skillsToUse;

    // grab the battler of the follower.
    const followerGameBattler = followerBattler.getBattler();

    // grab the skill.
    const skill = followerGameBattler.skill(chosenSkillId);

    // check if they can pay the costs of the skill.
    if (!followerGameBattler.canPaySkillCost(skill))
    {
      // basic attacking is always an option.
      return basicAttackSkillId;
    }

    return chosenSkillId;
  }
  //endregion leader

  //region follower
  /**
   * Handles how a follower decides its next action to take while engaged.
   *
   * NOTE:
   * If a follower has a leader, they will wait until the leader gives commands
   * to execute them. This means that the follower's turn speed will be reduced
   * to match the leader if necessary.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  decideFollowerAi(battler)
  {
    // check if we have a leader ready to guide us.
    if (this.hasLeaderReady(battler))
    {
      // let the leader decide what this battler should do.
      return this.decideFollowerAiByLeader(battler);
    }
    // we have no leader.
    else
    {
      // only basic attacks for this battler.
      return this.decideFollowerAiBySelf(battler);
    }
  }

  /**
   * Determines whether or not this battler has a leader ready to guide them.
   * @param {JABS_Battler} battler The battler deciding the action.
   * @returns {boolean} True if this battler has a ready leader, false otherwise.
   */
  hasLeaderReady(battler)
  {
    // check if we have a leader.
    if (!battler.hasLeader()) return false;

    // check to make sure we can actually retrieve the leader.
    if (!battler.getLeaderBattler()) return false;

    // check to make sure that leader is still engaged in combat.
    if (!battler.getLeaderBattler().isEngaged()) return false;

    // let the leader decide!
    return true;
  }

  /**
   * Allows the leader to decide this follower's next action to take.
   * @param {JABS_Battler} battler The follower that is allowing a leader to decide.
   */
  decideFollowerAiByLeader(battler)
  {
    // show the balloon that we are processing leader actions instead.
    battler.showBalloon(J.ABS.Balloons.Check);

    // we have an engaged leader.
    const leaderDecidedSkillId = battler.getNextLeaderDecidedAction();

    // validate the skill chosen.
    if (!this.isSkillIdValid(leaderDecidedSkillId))
    {
      // stop processing.
      return null;
    }

    // return the skill decided.
    return leaderDecidedSkillId;
  }

  /**
   * Allows the follower to decide their own next action to take.
   * It is always a basic attack when a follower decides for themselves.
   * @param {JABS_Battler} battler The follower that is deciding for themselves.
   */
  decideFollowerAiBySelf(battler)
  {
    // only basic attacks for this battler.
    const basicAttackSkillId = battler.getEnemyBasicAttack();

    // validate the skill chosen.
    if (!this.isSkillIdValid(basicAttackSkillId))
    {
      // stop processing.
      return null;
    }

    // return the skill decided.
    return basicAttackSkillId;
  }
  //endregion follower

  /**
   * Decides a support-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} usableSkills The available skills to use.
   */
  decideSupportAction(user, usableSkills)
  {
    // check first if we should follow with the next hit of the combo.
    if (this.shouldFollowWithCombo(user))
    {
      // we're doing the next combo in the chain!
      return this.followWithCombo(user);
    }

    // don't do things if we have no skills to work with.
    if (!usableSkills.length) return null;

    // grab all nearby allies that are visible.
    const allies = JABS_AiManager.getAlliedBattlersWithinRange(user, user.getPursuitRadius());

    // prioritize healing when self or allies are low on hp.
    if (this.healer)
    {
      usableSkills = this.filterSkillsHealerPriority(user, usableSkills, allies);
    }

    // check if we no longer have skills to potentially cast.
    if (!usableSkills.length)
    {
      // clear the ally targeting.
      user.setAllyTarget(null);
    }

    // handle the possibility of none or many skills still remaining.
    return this.decideFromNoneToManySkills(user, usableSkills);
  }

  /**
   * Decides an attack-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} usableSkills The available skills to use.
   */
  decideAttackAction(user, usableSkills)
  {
    // check first if we should follow with the next hit of the combo.
    if (this.shouldFollowWithCombo(user))
    {
      // we're doing the next combo in the chain!
      return this.followWithCombo(user);
    }

    // don't do things if we have no skills to work with.
    if (!usableSkills.length) return null;

    // grab the target of the attacker.
    const target = user.getTarget();

    // filter out skills that are elementally ineffective if "careful" trait is present.
    if (this.careful)
    {
      usableSkills = this.filterElementallyIneffectiveSkills(usableSkills, target);
    }

    // find most elementally effective skill vs the target if "executor" trait is present.
    if (this.executor)
    {
      usableSkills = this.findMostElementallyEffectiveSkill(usableSkills, user, target);
    }

    // handle the possibility of none or many skills still remaining.
    return this.decideFromNoneToManySkills(user, usableSkills);
  }

  /**
   * Decides an action with no particular AI influence.
   * RNG decides this AI-controlled battler's fate.
   * @param {JABS_Battler} user The battler of the AI deciding the action.
   * @param {number[]} usableSkills The possible skills this AI can choose from.
   * @returns {number} The decided skill id.
   */
  decideGenericAction(user, usableSkills)
  {
    // check first if we should follow with the next hit of the combo.
    if (this.shouldFollowWithCombo(user))
    {
      // we're doing the next combo in the chain!
      return this.followWithCombo(user);
    }

    // don't do things if we have no skills to work with.
    if (!usableSkills.length)
    {
      // no usable skills means just attack.
      return user.getEnemyBasicAttack();
    }

    // choose a random index based on the usable skills collection.
    const randomIndex = Math.randomInt(usableSkills.length);

    // grab that random skill id.
    const randomSkillId = usableSkills.at(randomIndex);

    // 50% chance of just using the basic attack instead.
    if (Math.randomInt(2) === 0)
    {
      // overwrite the random skill with the basic attack.
      return user.getEnemyBasicAttack();
    }

    // return the skill we rolled the dice for.
    return randomSkillId;
  }

  /**
   * Overwrites {@link #aiComboChanceModifier}.
   * Calculates the combo chance modifier based on the various AI traits that are
   * associated with this AI.
   * This is summed together with the {@link #baseComboChance} to determine whether or not
   * this AI will follow-up with combos when available.
   * @returns {number} An integer percent chance between 0-100.
   */
  aiComboChanceModifier()
  {
    // default the modifier to 0.
    let comboChanceModifier = 0;

    // extract out this AI's traits.
    const { careful, executor, reckless, leader, follower, healer } = this;

    // modify the combo chance based on the various traits.

    if (careful)
    {
      comboChanceModifier += 10;
    }

    if (executor)
    {
      comboChanceModifier += 30;
    }

    if (reckless)
    {
      comboChanceModifier -= 20;
    }

    if (follower)
    {
      comboChanceModifier += 10;
    }

    if (leader)
    {
      comboChanceModifier += 20;
    }

    if (healer)
    {
      comboChanceModifier -= 30;
    }

    return comboChanceModifier;
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
    return user.getEnemyBasicAttack();
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
    const { careful, reckless } = this;
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
}
//endregion JABS_EnemyAI