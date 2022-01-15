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
 * The global reference for the `JABS_Engine` data object.
 * @type {JABS_Engine}
 * @global
 */
var $jabsEngine = null;

/**
 * The global reference for the `Game_Enemies` data object.<br/>
 *
 * Unlike `$gameActors`, this is effectively a `Game_Enemy` factory rather than
 * a getter for `Game_Actor`s.
 * @type {Game_Enemies}
 * @global
 */
var $gameEnemies = null;

/**
 * The global reference for the `$dataMap` data object that contains all the replicable `JABS_Action`s.
 * @type {Map}
 * @global
 */
var $actionMap = null;

/**
 * The global reference for the player's input manager.
 * This interprets and manages incoming inputs for JABS-related functionality.
 * @type {JABS_InputManager}
 * @global
 */
var $jabsController1 = null;

/**
 * Hooks into `1taManager` to create the game objects.
 */
J.ABS.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  J.ABS.Aliased.DataManager.createGameObjects.call(this);

  DataManager.getSkillMasterMap();
  $jabsController1 = new JABS_InputManager();
  $jabsEngine = new JABS_Engine();
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
 * This static class manages all ai-controlled battlers while on the map.
 */
class JABS_AiManager
{
  /**
   * Constructor.
   * This is a static class.
   */
  constructor() { throw new Error("The JABS_AiManager is a static class."); };

  //#region update loop
  /**
   * Handles updating all the logic of the JABS engine.
   */
  static update()
  {
    // check if the AI manager can execute.
    if (!this.canUpdate()) return;

    // execute AI management.
    this.manageAi();
  };

  /**
   * Whether or not the ai manager can process an update.
   * @return {boolean} True if the manager can update, false otherwise.
   */
  static canUpdate()
  {
    // do not manage if the engine is paused.
    if ($jabsEngine.absPause) return false;

    // do not manage if the message window is up.
    if ($gameMessage.isBusy()) return false;

    // do not manage if the map is handling an event.
    if ($gameMap.isEventRunning()) return false;

    // update!
    return true;
  };

  /**
   * Define whether or not the player is engaged in combat with any of the current battlers.
   */
  static manageAi()
  {
    // grab all available battlers within a fixed range.
    const battlers = $gameMap.getBattlersWithinRange(
      $jabsEngine.getPlayerJabsBattler(),
      J.ABS.Metadata.MaxAiUpdateRange);

    // if we have no battlers, then do not process AI.
    if (!battlers.length) return;

    // iterate over each battler available.
    battlers.forEach(this.handleBattlerAi, this);
  };

  /**
   * Handles the AI management of this battler.
   * @param {JABS_Battler} battler The battler to potentially handle AI of.
   */
  static handleBattlerAi(battler)
  {
    // check if we can manage the AI of this battler.
    if (!this.canManageAi(battler)) return;

    // execute the AI loop for this battler.
    this.executeAi(battler);
  };

  /**
   * Determines whether or not this battler can have its AI managed.
   * @param {JABS_Battler} battler The battler to check if AI is manageable.
   * @returns {boolean} True if the AI should be managed, false otherwise.
   */
  static canManageAi(battler)
  {
    // do not manage dead battlers.
    if (battler.isDead()) return false;

    // do not manage the player.
    if (battler.isPlayer()) return false;

    // do not manage inanimate battlers.
    if (battler.isInanimate()) return false;

    // manage that AI!
    return true;
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

      // don't try to idle while engaged.
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
  //#endregion update loop

  //#region Phase 0 - Idle Phase
  /**
   * The zero-th phase, when the battler is not engaged- it's idle action.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase0(battler)
  {
    // if the battler cannot idle, then do not idle.
    if (!battler.canIdle()) return;

    // grab whether or not the battler is currently idle.
    const isIdle = battler.isIdle();

    // check if the battler is currently not in-motion.
    if (battler.getCharacter().isStopping())
    {
      // check if the battler is alerted.
      if (battler.isAlerted())
      {
        // if stopped and alerted, then go try to find the one triggering the alert.
        this.seekForAlerter(battler);
        return;
      }
      // check if we aren't idle, and also aren't home.
      else if (!isIdle && !battler.isHome())
      {
        // try to go back towards the home coordinates.
        this.goHome(battler);
      }
      // check if we are idle (implicitly also home)
      else if (isIdle)
      {
        // move about idly.
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
    // grab the x:y coordinates that we last "heard" the one triggering the alert from.
    const [alertX, alertY] = battler.getAlertedCoordinates();

    // attempt to move intelligently towards those coordiantes.
    battler.smartMoveTowardCoordinates(alertX, alertY);
  };

  /**
   * Progresses the battler towards their home coordinates.
   * @param {JABS_Battler} battler The battler going home.
   */
  static goHome(battler)
  {
    // grab the character of the battler trying to go home.
    const character = battler.getCharacter();

    // determine the next direction to face when going home.
    const nextDir = character.findDirectionTo(battler.getHomeX(), battler.getHomeY());

    // take a step in the right direction.
    character.moveStraight(nextDir);

    // check if we've made it home.
    if (battler.isHome())
    {
      // flag this battler as being idle.
      battler.setIdle(true);
    }
  };

  /**
   * Executes whatever the idle action is for this battler.
   * @param {JABS_Battler} battler The battler moving idly.
   */
  static moveIdly(battler)
  {
    // if we're not able to move idly, then do not.
    if (!this.canMoveIdly(battler)) return;

    // grab the character of the battler.
    const character = battler.getCharacter();

    // check if they are "close" to their home point.
    if (JABS_Battler.isClose(battler.distanceToHome()))
    {
      // move randomly.
      character.moveRandom();
    }
    // they are not "close" to their home point.
    else
    {
      // determine the direction to face to move towards home.
      const nextDir = character.findDirectionTo(battler.getHomeX(), battler.getHomeY());

      // move towards home.
      character.moveStraight(nextDir);
    }

    // reset the idle action counter.
    battler.resetIdleAction();
  };

  /**
   * Determiens whether or not this battler can move idly.
   * @param {JABS_Battler} battler The battler trying to move idly.
   * @returns {boolean} True if this battler can movie idly, false otherwise.
   */
  static canMoveIdly(battler)
  {
    // if we're not able to move idly, then do not.
    if (!battler.isIdleActionReady()) return false;

    // 1/5 chance to move idly; if we didn't score, then do not.
    if ((Math.randomInt(4) + 1) !== 1) return false;

    // idle about!
    return true;
  };
  //#endregion Phase 0 - Idle Phase

  //#region Phase 1 - Pre-Action Movement Phase
  /**
   * Phase 1 for AI is the phase where the battler will count down its "prepare" timer.
   * While in this phase, the battler will make an effort to maintain a "safe" distance
   * from its current target.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase1(battler)
  {
    // check if the battler has their prepare timer ready for action.
    // if this battler is a follower that has a leader, it will automatically proceed.
    if (this.canTransitionToPhase2(battler))
    {
      // move to the next phase of AI.
      this.transitionToPhase2(battler);

      // stop processing.
      return;
    }

    // check if the battler is able to move and isn't moving.
    if (this.canDecidePhase1Movement(battler))
    {
      // move around as-necessary.
      this.decideAiMovement(battler);

      // stop processing.
      return;
    }

    // otherwise, we must be processing a movement command from before.
  };

  /**
   * Determines whether or not this battler is ready to transition to AI phase 2.
   * @param {JABS_Battler} battler The battler to transition.
   * @returns {boolean} True if this battler should transition, false otherwise.
   */
  static canTransitionToPhase2(battler)
  {
    // check if the battler has decided an action yet.
    if (!battler.isActionReady()) return false;

    // move to phase 2!
    return true;
  };

  /**
   * Determines whether or not this battler can perform pre-action movement.
   * @param {JABS_Battler} battler The battler to move.
   * @returns {boolean} True if this battler should move, false otherwise.
   */
  static canDecidePhase1Movement(battler)
  {
    // check if the battler is currently moving.
    if (battler._event.isMoving()) return false;

    // check if the battler is unable to move.
    if (!battler.canBattlerMove()) return false;

    // move!
    return true;
  };

  /**
   * Transitions this battler to AI phase 2, action decision and repositioning.
   * @param {JABS_Battler} battler The battler to transition.
   */
  static transitionToPhase2(battler)
  {
    // move to the next phase of AI.
    battler.setPhase(2);
  };

  /**
   * Moves the battler around in an effort to maintain a "comfortable" distance
   * away from their current target.
   * @param {JABS_Battler} battler The battler deciding movement strategy.
   */
  static decideAiMovement(battler)
  {
    // check if the distance is invalid or too great.
    if (this.shouldDisengageTarget(battler))
    {
      // just give up on this target.
      battler.disengageTarget();

      // stop processing.
      return;
    }

    // check if the battler is "close".
    this.maintainSafeDistance(battler);

    // check if we should turn towards the target.
    // NOTE: this prevents 100% always facing the target, preventing perma-parry.
    if (Math.randomInt(100) < 5)
    {
      // turn towards the target.
      //battler.turnTowardTarget();
    }
  };

  /**
   * Determines whether or not this battler should disengage from its target
   * due to distancing concerns.
   * @param {JABS_Battler} battler The battler to disengage.
   * @returns {boolean} True if this battler needs to disengage, false otherwise.
   */
  static shouldDisengageTarget(battler)
  {
    // calculate the distance to this battler's current target.
    const distance = battler.distanceToCurrentTarget();

    // check if the distance is invalid.
    if (distance === null) return true;

    // check if the distance arbitrarily is too great.
    if (distance > 15) return true;

    // do not disengage.
    return false;
  };

  /**
   * This battler will attempt to keep a "safe" distance of not-too-far and
   * not-too-close to its target.
   * @param {JABS_Battler} battler The battler to do the distancing.
   */
  static maintainSafeDistance(battler)
  {
    // calculate the distance to this battler's current target.
    const distance = battler.distanceToCurrentTarget();

    // check if the battler is "close".
    if (JABS_Battler.isClose(distance))
    {
      // move away from the target.
      battler.moveAwayFromTarget();
    }
    // check if the battler is "far".
    else if (JABS_Battler.isFar(distance))
    {
      // move intelligently towards the target (uses smart pathfinding).
      battler.smartMoveTowardTarget();
    }
  };
  //#endregion Phase 1 - Pre-Action Movement Phase

  //#region Phase 2 - Execute Action Phase
  /**
   * Phase 2 for AI is the phase where the battler will decide adn execute its action.
   * While in this phase, the battler will decide its action, and attempt to move
   * into the required range to execute the action if necessary and execute it.
   * @param {JABS_Battler} battler The `JABS_Battler`.
   */
  static aiPhase2(battler)
  {
    // check if the battler has decided their action yet.
    if (this.needsActionDecision(battler))
    {
      // make a decision about what to do.
      this.decideAiPhase2Action(battler);

      // stop processing.
      return;
    }

    // check if we need to reposition.
    if (this.needsRepositioning(battler))
    {
      // move into a better position based on the decided action.
      this.decideAiPhase2Movement(battler);

      // stop processing.
      return;
    }

    // check if we're ready to execute actions.
    if (this.needsActionExecution(battler))
    {
      // execute the decided action.
      this.executeAiPhase2Action(battler);
    }
  };

  /**
   * Determines whether or not this battler needs to decide an action.
   * @param {JABS_Battler} battler The battler to decide an action.
   * @returns {boolean} True if this battler needs to decide, false otherwise.
   */
  static needsActionDecision(battler)
  {
    // check if the battler has not yet decided an action.
    if (!battler.isActionDecided()) return true;

    // battler already has already made a decision.
    return false;
  };

  /**
   * Determines whether or not this battler needs to get into position.
   * @param {JABS_Battler} battler The battler to reposition.
   * @returns {boolean} True if this battler needs to move, false otherwise.
   */
  static needsRepositioning(battler)
  {
    // check if the battler isn't moving.
    // check also if the battler isn't in position.
    // check also if the battler can move.
    if (!battler._event.isMoving() && !battler.isInPosition() && battler.canBattlerMove()) return true;

    // battler is fine where they are at.
    return false;
  };

  /**
   * Determines whether or not this battler needs to execute queued actions.
   * @param {JABS_Battler} battler The battler to take action.
   * @returns {boolean} True if this battler needs to take action, false otherwise.
   */
  static needsActionExecution(battler)
  {
    // check if this battler has decided on an action to take.
    if (!battler.isActionDecided()) return false;

    // check if this battler is in position.
    if (!battler.isInPosition()) return false;

    // check if the battler is still casting.
    if (battler.isCasting()) return false;

    // we need action!
    return true;
  };

  /**
   * Execute the decided queued actions for this battler.
   * @param {JABS_Battler} battler The battler to take action.
   */
  static executeAiPhase2Action(battler)
  {
    // face the target to execute the action.
    battler.turnTowardTarget();

    // execute the queued action.
    battler.processQueuedActions();

    // force a wait of 1/3 a second.
    battler.setWaitCountdown(20);

    // switch to cooldown phase.
    battler.setPhase(3);
  };

  /**
   * The battler decides what action to execute.
   * @param {JABS_Battler} battler The battler deciding the actions.
   */
  static decideAiPhase2Action(battler)
  {
    this.decideEnemyAiPhase2Action(battler);
  };

  /**
   * The enemy battler decides what action to take.
   * Based on it's AI traits, it will make a decision on an action to take.
   * @param {JABS_Battler} battler The enemy battler deciding the action.
   */
  static decideEnemyAiPhase2Action(battler)
  {
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
      const nearbyFollowers = $gameMap.getNearbyFollowers(battler);
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
    // generate the actions based on the given skill id.
    const actions = battler.createJabsActionFromSkill(chosenSkillId);

    // determine the enemy's cooldown key of "skillId-skillName".
    const cooldownName = `${actions[0].getBaseSkill().id}-${actions[0].getBaseSkill().name}`;

    // set the cooldown type for all actions.
    actions.forEach(action => action.setCooldownType(cooldownName));

    // grab the primary action
    const primaryAction = actions[0];

    // perform the execution animation.
    this.performExecutionAnimation(battler, primaryAction);

    // set an arbitrary 1/3 second wait after setup.
    battler.setWaitCountdown(20);

    // set the cast time of this skill.
    battler.setCastCountdown(primaryAction.getCastTime());

    // set the decided action.
    battler.setDecidedAction(actions);
  };

  /**
   * Performs a brief animation to indicate that the battler has decided an action.
   * The animation depends on whether or not the action was a support action or not.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {JABS_Action} action The action used to gauge which animation to show.
   */
  static performExecutionAnimation(battler, action)
  {
    // check if this action is a support action.
    if (action.isSupportAction())
    {
      // show the "support decision" animation on the battler.
      battler.showAnimation(J.ABS.Metadata.SupportDecidedAnimationId)
    }
    // the action is not a support action.
    else
    {
      // show the "attack decision" animation on the battler.
      battler.showAnimation(J.ABS.Metadata.AttackDecidedAnimationId)
    }
  };

  /**
   * The battler attempts to move into a position where they can execute
   * their decided skill and land a hit.
   * @param {JABS_Battler} battler The battler trying to get into position.
   */
  static decideAiPhase2Movement(battler)
  {
    // check if we can actually perform phase 2 movement.
    if (!this.canPerformPhase2Movement(battler)) return;

    // check if we need to move closer.
    if (this.needsToMoveCloser(battler))
    {
      // get closer to the target so we can execute the skill.
      this.phase2MoveCloser(battler);
    }
    // the battler is close enough.
    else
    {
      // flag this battler as in-position to execute.
      battler.setInPosition();
    }
  };

  /**
   * Determines whether or not this battler can (or needs to) perform ai phase 2 movement.
   * @param {JABS_Battler} battler The battler to check if movement is needed.
   * @returns {boolean} True if this battler needs to move closer, false otherwise.
   */
  static canPerformPhase2Movement(battler)
  {
    // check if this battler has decided on an action yet.
    if (!battler.isActionDecided()) return false;

    // check if we're already in position.
    if (battler.isInPosition()) return false;

    // move closer!
    return true;
  };

  /**
   * Determines whether or not to move closer in AI phase 2.
   * @param {JABS_Battler} battler The battler to check if movement is needed.
   * @returns {boolean} True if this battler needs to move closer, false otherwise.
   */
  static needsToMoveCloser(battler)
  {
    // grab the action.
    const action = battler.getDecidedAction()[0];

    // calculate distance to target to determine if we need to get closer.
    const distanceToTarget = battler.getAllyTarget()
      ? battler.distanceToAllyTarget()
      : battler.distanceToCurrentTarget();

    // check if we are further away than the minimum proximity.
    if (distanceToTarget > action.getProximity()) return true;

    // no need to move.
    return false;
  };

  /**
   * Moves this battler closer to the relevant target.
   * @param {JABS_Battler} battler The battler to move.
   */
  static phase2MoveCloser(battler)
  {
    if (battler.getAllyTarget())
    {
      battler.smartMoveTowardAllyTarget();
    }
    else
    {
      battler.smartMoveTowardTarget();
    }
  };
  //#endregion Phase 2 - Execute Action Phase

  //#region Phase 3 - Post-Action Cooldown Phase
  /**
   * Phase 3 for AI is the phase where the battler is cooling down from its skill usage.
   * While in this phase, the battler will attempt to maintain a "safe" distance from
   * its current target.
   * @param {JABS_Battler} battler The battler for this AI.
   */
  static aiPhase3(battler)
  {
    // check if we are ready for a phase reset.
    if (this.canResetAiPhases(battler))
    {
      // AI loop complete, reset back to phase 1.
      this.resetAiPhases(battler);
    }
    // the battler's post-action cooldown is not finished.
    else
    {
      // check if they are able to move while cooling down.
      if (!this.canPerformPhase3Movement(battler))
      {
        // move around while you're waiting for the cooldown.
        this.decideAiPhase3Movement(battler);
      }
    }
  };

  /**
   * Determines wehther or not this battler is ready to reset its AI phases.
   * @param {JABS_Battler} battler The battler to reset phases for.
   * @returns {boolean} True if the battler is ready to reset, false otherwise.
   */
  static canResetAiPhases(battler)
  {
    // check if the battler's cooldown is complete.
    if (!battler.isPostActionCooldownComplete()) return false;

    // ready for reset!
    return true;
  };

  /**
   * Resets the phases for this battler back to phase 1.
   * @param {JABS_Battler} battler The battler to reset phases for.
   */
  static resetAiPhases(battler)
  {
    // AI loop complete, reset back to phase 1.
    battler.resetPhases();
  };

  /**
   * Determines whether or not this battler can move around while waiting for
   * its AI phase reset.
   * @param {JABS_Battler} battler The battler to move.
   * @returns {boolean} True if the battler can move, false otherwise.
   */
  static canPerformPhase3Movement(battler)
  {
    // check if the battler is able to move.
    if (!battler.canBattlerMove()) return false;

    // check if the battler is currently moving.
    if (battler._event.isMoving()) return false;

    // move!
    return true;
  };

  /**
   * Decides where to move while waiting for cooldown to complete from the skill.
   * @param {JABS_Battler} battler The battler in this cooldown phase.
   */
  static decideAiPhase3Movement(battler)
  {
    // move around as-necessary.
    this.decideAiMovement(battler);
  };

  //#endregion Phase 3 - Post-Action Cooldown Phase
};
//#endregion JABS_AiManager
//ENDFILE