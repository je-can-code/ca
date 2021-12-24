/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Mods/Adds for the various manager object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This is a cluster of all changes/overwrites/additions to the objects that
 * would otherwise be found in the rmmz_managers.js, such as DataManager.
 * ============================================================================
 */

//#region DataManager
/**
 * The global reference for the `Game_BattleMap` data object.
 * @type Game_BattleMap
 * @global
 */
var $gameBattleMap = null;

/**
 * The global reference for the `Game_Enemies` data object.
 * @type {Game_Enemies}
 * @global
 */
var $gameEnemies = null;

/**
 * The global reference for the `$dataMap` data object that contains all the replicable `JABS_Action`s.
 * @type {Object}
 * @global
 */
var $actionMap = null;

/**
 * Hooks into `1taManager` to create the game objects.
 */
J.ABS.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  J.ABS.Aliased.DataManager.createGameObjects.call(this);

  DataManager.getSkillMasterMap();
  $gameBattleMap = new Game_BattleMap();
  $gameEnemies = new Game_Enemies();
};

/**
 * Executes the retrieval of the skill master map from which we clone all action events.
 */
DataManager.getSkillMasterMap = function()
{
  const mapId = J.ABS.DefaultValues.ActionMap;
  if (mapId > 0)
  {
    const filename = "Map%1.json".format(mapId.padZero(3));
    this.loadSkillMasterMap("$dataMap", filename);
  }
  else
  {
    throw new Error("Missing skill master map.");
  }
};

/**
 * Retrieves the skill master map.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 */
DataManager.loadSkillMasterMap = function(name, src)
{
  const xhr = new XMLHttpRequest();
  const url = "data/" + src;
  xhr.open("GET", url);
  xhr.overrideMimeType("application/json");
  xhr.onload = () => this.onMapGet(xhr, name, src, url);
  xhr.onerror = () => this.gracefulFail(name, src, url);
  xhr.send();
};

/**
 * Retrieves the map data file from a given location.
 * @param {XMLHttpRequest} xhr The `xhr` service for fetching files from the local.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 * @param {string} url The path of the file to retrieve.
 */
DataManager.onMapGet = function(xhr, name, src, url)
{
  if (xhr.status < 400)
  {
    $actionMap = JSON.parse(xhr.responseText);
  }
  else
  {
    this.gracefulFail(name, src, url);
  }
};

/**
 * Gracefully fails and just logs it a missing file or whatever is the problem.
 * @param {string} name The name of the problemed file.
 * @param {string} src The source.
 * @param {string} url The path of the problemed file.
 */
DataManager.gracefulFail = function(name, src, url)
{
  console.error(name, src, url);
};

/**
 * Whether or not the extra data was loaded into the multiple databases.
 */
DataManager._j ||= {
  /**
   * Whether or not the jabs data from the database has been loaded yet.
   * @type {boolean}
   */
  _jabsDataLoaded: false
};

/**
 * Hooks into the database loading and loads our extra data from notes and such.
 */
J.ABS.Aliased.DataManager.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function()
{
  const result = J.ABS.Aliased.DataManager.isDatabaseLoaded.call(this);
  if (result)
  {
    this.loadExtraData();
  }

  return result;
};

/**
 * Loads all extra data from notes and such into the various database objects.
 */
DataManager.loadExtraData = function()
{
  if (!DataManager._j._jabsDataLoaded)
  {
    this.addJabsSkillData();
    this.addJabsWeaponData();
    this.addJabsArmorData();
    this.addJabsItemData();
    this.addJabsStateData();
    this._j._jabsDataLoaded = true;
  }
};

/**
 * Loads all extra data from the notes of skills.
 */
DataManager.addJabsSkillData = function()
{
  $dataSkills.forEach((skill, index) =>
  {
    if (!skill) return;
    skill._j = new JABS_SkillData(skill.note, skill.meta);
    skill.index = index;
  });
};

/**
 * Loads all extra data from the notes of weapons.
 */
DataManager.addJabsWeaponData = function()
{
  $dataWeapons.forEach(DataManager.parseWeaponData);
};

/**
 * The action to perform on each weapon.
 * This was separated out for extensibility if desired.
 * @param {rm.types.EquipItem} weapon The equip to modify.
 * @param {number} index The index of the equip.
 */
DataManager.parseWeaponData = function(weapon, index)
{
  if (!weapon) return;
  weapon._j = new JABS_EquipmentData(weapon.note, weapon.meta);
};

/**
 * Loads all extra data from the notes of armors.
 */
DataManager.addJabsArmorData = function()
{
  $dataArmors.forEach(DataManager.parseArmorData);
};

/**
 * The action to perform on each armor.
 * This was separated out for extensibility if desired.
 * @param {rm.types.EquipItem} armor The equip to modify.
 * @param {number} index The index of the equip.
 */
DataManager.parseArmorData = function(armor, index)
{
  if (!armor) return;
  armor._j = new JABS_EquipmentData(armor.note, armor.meta);
};

/**
 * Loads all extra data from the notes of items.
 */
DataManager.addJabsItemData = function()
{
  $dataItems.forEach((item, index) =>
  {
    if (!item) return;
    item._j = new JABS_ItemData(item.note, item.meta);
    item.index = index;
  });
};

/**
 * Loads all extra data from the notes of states.
 */
DataManager.addJabsStateData = function()
{
  $dataStates.forEach((state, index) =>
  {
    if (!state) return;
    state._j = new JABS_StateData(state.note, state.meta);
    state.index = index;
  });
};
//#endregion

//#region Input
/**
 * The mappings of the gamepad descriptions to their buttons.
 */
J.ABS.Input = {};
J.ABS.Input.DirUp = "up";
J.ABS.Input.DirDown = "down";
J.ABS.Input.DirLeft = "left";
J.ABS.Input.DirRight = "right";
J.ABS.Input.A = "ok";
J.ABS.Input.B = "cancel";
J.ABS.Input.X = "shift";
J.ABS.Input.Y = "tab";
J.ABS.Input.R1 = "pagedown";
J.ABS.Input.R2 = "r2";          // new!
J.ABS.Input.R3 = "r3";          // new!
J.ABS.Input.L1 = "pageup";
J.ABS.Input.L2 = "l2";          // new!
J.ABS.Input.L3 = "l3";          // new!
J.ABS.Input.Start = "start";    // new!
J.ABS.Input.Select = "select";  // new!
J.ABS.Input.Cheat = "cheat"     // new!

/**
 * OVERWRITE Defines gamepad button input to instead perform the various
 * actions that are expected in this ABS.
 *
 * This includes:
 * - D-Pad up, down, left, right
 * - A/cross, B/circle, X/square, Y/triangle
 * - L1/LB, R1/RB
 * - NEW: select/optoins, start/menu
 * - NEW: L2/LT, R2/RT
 * - NEW: L3/LSB, R3/RSB
 * - OVERWRITE: Y now is the tool button, and start is the menu.
 */
Input.gamepadMapper = {
  0: J.ABS.Input.A,
  1: J.ABS.Input.B,
  2: J.ABS.Input.X,
  3: J.ABS.Input.Y,
  4: J.ABS.Input.L1,
  5: J.ABS.Input.R1,
  6: J.ABS.Input.L2,
  7: J.ABS.Input.R2,
  8: J.ABS.Input.Select,
  9: J.ABS.Input.Start,
  10: J.ABS.Input.L3,
  11: J.ABS.Input.R3,
  12: J.ABS.Input.DirUp,
  13: J.ABS.Input.DirDown,
  14: J.ABS.Input.DirLeft,
  15: J.ABS.Input.DirRight,
}

/**
 * Extends the existing mapper for keyboards to accommodate for the
 * additional skill inputs that are used for gamepads.
 */
Input.keyMapper = {
  ...Input.keyMapper,

  // this is the new debug move-through for use with JABS.
  192: J.ABS.Input.Cheat,     // ` (backtick)

  // core keys.
  38: J.ABS.Input.DirUp,      // arrow up
  40: J.ABS.Input.DirDown,    // arrow down
  37: J.ABS.Input.DirLeft,    // arrow left
  39: J.ABS.Input.DirRight,   // arrow right
  90: J.ABS.Input.A,          // z
  88: J.ABS.Input.B,          // x
  16: J.ABS.Input.X,          // shift
  67: J.ABS.Input.Y,          // c
  81: J.ABS.Input.L1,         // q
  17: J.ABS.Input.L2,         // ctrl
  69: J.ABS.Input.R1,         // e
  9: J.ABS.Input.R2,         // tab
  13: J.ABS.Input.Start,      // enter
  46: J.ABS.Input.Select,     // del

  // keyboard alternative for the multi-button skills.
  49: "1",       // 1 = main
  50: "2",       // 2 = off
  51: "3",       // 3 = L1 + A
  52: "4",       // 4 = L1 + B
  53: "5",       // 5 = L1 + X
  54: "6",       // 6 = L1 + Y
  55: "7",       // 7 = R1 + A
  56: "8",       // 8 = R1 + B
  57: "9",       // 9 = R1 + X
  48: "0",       // 0 = R1 + Y
};
//#endregion Input

//#region JABS_AiManager
/**
 * This static class manages all ai-controlled `JABS_Battler`s.
 *
 * It orchestrates how Battlers interact with one another and the player.
 */
class JABS_AiManager
{
  /**
   * The constructor is not designed to be called.
   * This is a static class.
   * @constructor
   */
  constructor()
  {
    throw new Error("The JABS_AiManager is a static class.");
  };

  //#region JABS Ai Update Loop
  /**
   * Handles updating all the logic of the JABS engine.
   */
  static update()
  {
    // if there is a message up, an event running, or the ABS is paused, freeze!
    if (!this.canUpdate()) return;

    this.manageAi();
  };

  /**
   * Whether or not the battle manager can process an update.
   * @return {boolean} True if the manager can update, false otherwise.
   */
  static canUpdate()
  {
    const isPaused = $gameBattleMap.absPause;
    const isMessageVisible = $gameMessage.isBusy();
    const isEventRunning = $gameMap.isEventRunning();
    const updateBlocked = isPaused || isMessageVisible || isEventRunning;
    return !updateBlocked;
  };

  /**
   * Define whether or not the player is engaged in combat with any of the current battlers.
   */
  static manageAi()
  {
    const battlers = $gameMap.getBattlersWithinRange(
      $gameBattleMap.getPlayerMapBattler(),
      J.ABS.Metadata.MaxAiUpdateRange);
    if (!battlers.length) return;

    // iterate over each battler available and process it's AI.
    battlers.forEach(battler =>
    {
      // no necromancers or ninjas please!
      if (battler.isDead() || battler.isPlayer() || battler.isHidden() || battler.isInanimate()) return;

      // act as though against, default.
      this.executeAi(battler);
    });
  };

  /**
   * Executes the interactions specified by the combination of the AI mode bits.
   * @param {JABS_Battler} battler The battler executing on the AI mode.
   */
  static executeAi(battler)
  {
    // no AI is executed when waiting.
    if (battler.isWaiting()) return;

    // if the battler is engaged, then do AI things.
    if (battler.isEngaged())
    {
      // adjust the targets based on aggro and presence.
      battler.adjustTargetByAggro();

      // if we are no longer engaged due to removing dead aggros, then stop.
      if (!battler.isEngaged()) return;

      // don't idle while engaged.
      battler.setIdle(false);

      // determine the phase and perform actions accordingly.
      const phase = battler.getPhase();
      switch (phase)
      {
        case 1:
          this.aiPhase1(battler);
          break;
        case 2:
          this.aiPhase2(battler);
          break;
        case 3:
          this.aiPhase3(battler);
          break;
        default:
          this.aiPhase0(battler);
          break;
      }
    }
    else
    {
      // the battler is not engaged, instead just idle about.
      this.aiPhase0(battler);
    }
  };

  //#endregion JABS Ai Update Loop

  //#region Phase 0 - Idle Phase
  /**
   * The zero-th phase, when the battler is not engaged- it's idle action.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase0(battler)
  {
    if (!battler.canIdle()) return;

    const character = battler.getCharacter();
    const isStopped = character.isStopping();
    const isIdle = battler.isIdle();

    if (isStopped)
    {
      if (battler.isAlerted())
      {
        // what was that over there?
        this.seekForAlerter(battler);
        return;
      }
      else if (!isIdle && !battler.isHome())
      {
        // im not home, need to go home.
        this.goHome(battler);
      }
      else if (isIdle)
      {
        // im home, do my idle things.
        this.moveIdly(battler);
      }
    }
  };

  /**
   * If a battler is idle but alerted, then they will try to seek out what
   * disturbed their idling.
   * @param {JABS_Battler} battler The battler seeking for the alerter.
   */
  static seekForAlerter(battler)
  {
    const coordinates = battler.getAlertedCoordinates();
    battler.smartMoveTowardCoordinates(coordinates[0], coordinates[1]);
  };

  /**
   * Progresses the battler towards their home coordinates.
   * @param {JABS_Battler} battler The battler going home.
   */
  static goHome(battler)
  {
    const event = battler.getCharacter();
    const nextDir = event.findDirectionTo(battler.getHomeX(), battler.getHomeY());
    event.moveStraight(nextDir);
    if (battler.isHome())
    {
      battler.setIdle(true);
    }
  };

  /**
   * Executes whatever the idle action is for this battler.
   * @param {JABS_Battler} battler The battler moving idly.
   */
  static moveIdly(battler)
  {
    if (battler.isIdleActionReady())
    {
      const rng = Math.randomInt(4) + 1;
      if (rng === 1)
      {
        const distanceToHome = battler.distanceToHome();
        const event = battler.getCharacter();
        if (JABS_Battler.isClose(distanceToHome))
        {
          event.moveRandom();
        }
        else
        {
          const nextDir = event.findDirectionTo(battler.getHomeX(), battler.getHomeY());
          event.moveStraight(nextDir);
        }
      }
      else
      {
        // do nothing;
      }

      battler.resetIdleAction();
    }
  };

  //#endregion Phase 0 - Idle Phase

  //#region Phase 1 - Pre-Action Movement Phase
  /**
   * This is the pre-phase, when the battler is waiting for their action
   * to be ready. This includes charging their `_actionCounter` and depending
   * on the AI, maybe doing more.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase1(battler)
  {
    // hold for prep time OR skip if the battler has a leader and wait for their commands.
    if (battler.isActionReady())
    {
      battler.setPhase(2);
      return;
    }

    // AI to decide movement strategy...
    if (!battler._event.isMoving() && battler.canBattlerMove())
    {
      this.decideAiPhase1Movement(battler);
      return;
    }
  };

  /**
   * Executes a movement based on phase and AI against it's target.
   * @param {JABS_Battler} battler The battler deciding it's phase 1 movement.
   */
  static decideAiPhase1Movement(battler)
  {
    const distance = battler.distanceToCurrentTarget();
    if (distance === null || distance > 15)
    {
      // if the battler is beyond a fixed distance, just give up.
      battler.disengageTarget();
    }
    ;

    const ai = (battler.getLeaderAiMode() !== null)
      ? battler.getLeaderAiMode()
      : battler.getAiMode();

    if (ai.basic)
    {
      // basic AI phase 1:
      // just kinda watches the target and doesn't move.
      battler.turnTowardTarget();
    }

    if (ai.smart)
    {
      // smart AI phase 1:
      // will try to maintain a comfortable distance from the target.
      if (JABS_Battler.isClose(distance))
      {
        battler.moveAwayFromTarget();
      }
      else if (JABS_Battler.isFar(distance))
      {
        battler.smartMoveTowardTarget();
      }
      battler.turnTowardTarget();
    }

    else if (ai.defensive)
    {
      // defensive AI phase 1:
      // will try to maintain a great distance from the target.
      // NOTE: does not combine with smart.
    }
  };

  //#endregion Phase 1 - Pre-Action Movement Phase

  //#region Phase 2 - Execute Action Phase
  /**
   * This is the action-ready phase, when the battler has an action available to use.
   * @param {JABS_Battler} battler The `JABS_Battler`.
   */
  static aiPhase2(battler)
  {
    // step 1: decide your action.
    if (!battler.isActionDecided())
    {
      this.decideAiPhase2Action(battler);
    }

    // step 2: get into position.
    if (!battler._event.isMoving() && !battler.isInPosition() && battler.canBattlerMove())
    {
      this.decideAiPhase2Movement(battler);
    }

    // step 3: hold for cast time.
    if (battler.isCasting())
    {
      battler.countdownCastTime();
      return;
    }

    // step 4: execute your action.
    if (battler.isInPosition())
    {
      const decidedAction = battler.getDecidedAction();
      battler.turnTowardTarget();
      $gameBattleMap.executeMapActions(battler, decidedAction);
      battler.setWaitCountdown(20);
      battler.setPhase(3);
    }
  };

  /**
   * The battler decides what action to execute.
   * The order of AI here is important, as some earlier and
   * less-prominent AI traits are overridden by the later
   * much more prominent AI traits.
   * @param {JABS_Battler} battler The `JABS_Battler` deciding the actions.
   */
  static decideAiPhase2Action(battler)
  {
    this.decideEnemyAiPhase2Action(battler);
  };

  /**
   * The enemy battler decides what action to take.
   * Based on it's AI traits, it will make a decision on an action to take.
   * @param {JABS_Battler} enemyBattler The enemy battler deciding the action.
   */
  static decideEnemyAiPhase2Action(enemyBattler)
  {
    const battler = enemyBattler;
    let ai = battler.getAiMode();
    const basicAttack = battler.getEnemyBasicAttack();
    let shouldUseBasicAttack = false;
    let chosenSkillId;
    let skillsToUse = battler.getSkillIdsFromEnemy();
    skillsToUse.sort();

    const {basic, smart, executor, defensive, reckless, healer, follower, leader} = ai;

    // only basic attacks alone, if controlled by a leader,
    // the follower will be told to execute skills based on
    // the leader's decision.
    if (follower)
    {
      shouldUseBasicAttack = true;
      // do nothing while waiting for leader to decide action.
      if (battler.hasLeader() && battler.getLeaderBattler() && battler.getLeaderBattler().isEngaged())
      {
        if (battler.hasLeaderDecidedActions())
        {
          // the leader told me what to do, now do it!
          const nextLeaderDecidedAction = battler.getNextLeaderDecidedAction();
          battler.showBalloon(J.ABS.Balloons.Check);
          chosenSkillId = nextLeaderDecidedAction;
          const canPerformAction = battler.canExecuteSkill(chosenSkillId);
          if (canPerformAction)
          {
            this.setupEnemyActionForNextPhase(battler, nextLeaderDecidedAction);
            return;
          }
          else
          {
            // cannot perform the action due to state restrictions.
            battler.setDecidedAction(null);
            return;
          }
        }
        else
        {
          // hold on the leader's decision.
          battler.setDecidedAction(null);
          return;
        }
      }
    }

    // if non-aggressive ai traits, then figure out some healing skills or something to use.
    if (healer || defensive)
    {
      skillsToUse = ai.decideSupportAction(battler, skillsToUse);

      // if aggressive ai traits, then figure out the skill to defeat the target with.
    }
    else if (smart || executor)
    {
      skillsToUse = ai.decideAttackAction(battler, skillsToUse);
    }

    // if basic but not reckless, then 50:50 chance of just basic attacking instead.
    if (basic && !reckless)
    {
      shouldUseBasicAttack = true;
    }

    // rewrite followers' action decisions that meet criteria.
    // acts intelligently in addition to controlling followers
    // into acting intelligently as well.
    if (leader)
    {
      const nearbyFollowers = $gameBattleMap.getNearbyFollowers(battler);
      nearbyFollowers.forEach(follower =>
      {
        // leaders can't control other leaders' followers.
        if (follower.hasLeader() && follower.getLeader() !== battler.getUuid())
        {
          return;
        }

        // assign the follower to this leader.
        if (!follower.hasLeader())
        {
          follower.setLeader(battler.getUuid());
        }

        // decide the action of the follower for them.
        const followerAction = ai.decideActionForFollower(battler, follower);
        if (followerAction)
        {
          follower.setLeaderDecidedAction(followerAction);
        }
      });
    }

    // 50:50 chance of just basic attacking instead.
    let basicAttackInstead = false;
    if (shouldUseBasicAttack && !battler.hasLeader())
    {
      basicAttackInstead = Math.randomInt(2) === 0;

      // followers ALWAYS basic attack instead.
      if (follower && !battler.hasLeader())
      {
        basicAttackInstead = true;
      }
    }

    if (basicAttackInstead || !skillsToUse || skillsToUse.length === 0)
    {
      // skip the formula, only basic attack.
      chosenSkillId = basicAttack[0];
    }
    else
    {
      if (Array.isArray(skillsToUse))
      {
        if (skillsToUse.length === 1)
        {
          chosenSkillId = skillsToUse[0];
        }
        else
        {
          const randomId = Math.randomInt(skillsToUse.length);
          chosenSkillId = skillsToUse[randomId];
        }
      }
      else
      {
        // otherwise just set the skill to use to be this.
        chosenSkillId = skillsToUse;
      }
    }

    // if the battler cannot perform their decided skill, do nothing.
    if (!chosenSkillId || !battler.canExecuteSkill(chosenSkillId))
    {
      battler.setDecidedAction(null);
      return;
    }

    this.setupEnemyActionForNextPhase(battler, chosenSkillId);
  };

  /**
   * Sets up the battler and the action in preparation for the next phase.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {number} chosenSkillId The id of the skill to perform the action for.
   */
  static setupEnemyActionForNextPhase(battler, chosenSkillId)
  {
    const mapActions = battler.createMapActionFromSkill(chosenSkillId);
    const primaryMapAction = mapActions[0];
    const cooldownName = `${primaryMapAction.getBaseSkill().name}`;
    mapActions.forEach(action => action.setCooldownType(cooldownName));
    battler.setDecidedAction(mapActions);
    if (primaryMapAction.isSupportAction())
    {
      battler.showAnimation(J.ABS.Metadata.SupportDecidedAnimationId)
    }
    else
    {
      battler.showAnimation(J.ABS.Metadata.AttackDecidedAnimationId)
    }

    battler.setWaitCountdown(20);
    battler.setCastCountdown(primaryMapAction.getCastTime());
  };

  /**
   * The battler attempts to move into a position where they can execute
   * their decided skill and land a hit.
   * @param {JABS_Battler} battler The battler trying to get into position.
   */
  static decideAiPhase2Movement(battler)
  {
    const actions = battler.getDecidedAction();

    // if for reasons, they have null set as their action, don't do things with it.
    if (!actions || !actions.length) return;

    const proximity = actions[0].getProximity();
    const distanceToTarget = battler.getAllyTarget()
      ? battler.distanceToAllyTarget()
      : battler.distanceToCurrentTarget()

    if (distanceToTarget > proximity)
    {
      battler.getAllyTarget()
        ? battler.smartMoveTowardAllyTarget()
        : battler.smartMoveTowardTarget();
    }
    else
    {
      battler.setInPosition();
    }
  };

  //#endregion Phase 2 - Execute Action Phase

  //#region Phase 3 - Post-Action Cooldown Phase
  /**
   * This is the post-action phase, when the battler has executed an action but not
   * yet restarted the cycle.
   * @param {JABS_Battler} battler The battler for this AI.
   */
  static aiPhase3(battler)
  {
    if (!battler.isPostActionCooldownComplete())
    {
      if (!battler._event.isMoving() && battler.canBattlerMove())
      {
        // move around while you're waiting for the cooldown.
        this.decideAiPhase3Movement(battler);
        return;
      }

      return;
    }

    // done with cooling down, lets start over back to phase 1!
    battler.resetPhases();
  };

  /**
   * Decides where to move while waiting for cooldown to complete from the skill.
   * @param {JABS_Battler} battler The battler in this cooldown phase.
   */
  static decideAiPhase3Movement(battler)
  {
    const distance = battler.distanceToCurrentTarget();
    if (distance === null) return;

    const {basic, smart, defensive} = battler.getAiMode();

    if (basic && !smart)
    {
      // basic AI phase 3:
      // just kinda watches the target and doesn't move.
      if (JABS_Battler.isClose(distance) || JABS_Battler.isSafe(distance))
      {
        battler.moveAwayFromTarget();
      }

      battler.turnTowardTarget();
    }

    if (smart)
    {
      // smart AI phase 1:
      // will try to maintain a comfortable distance from the target.
      if (JABS_Battler.isClose(distance))
      {
        battler.moveAwayFromTarget();
      }
      else if (JABS_Battler.isFar(distance))
      {
        battler.smartMoveTowardTarget();
      }
      battler.turnTowardTarget();
    }

    else if (defensive)
    {
      // defensive AI phase 1:
      // will try to maintain a great distance from the target.
      // NOTE: does not combine with smart.
    }
  };

  //#endregion Post-Action Cooldown Phase
};
//#endregion JABS_AiManager
//ENDFILE