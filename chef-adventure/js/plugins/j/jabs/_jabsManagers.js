/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Mods/Adds for the various manager object classes.
 * @author JE
 * @url https://github.com/je-can-code/ca
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
 * Extends `createGameObjects()` to include creation of our global game objects
 */
J.ABS.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.ABS.Aliased.DataManager.createGameObjects.call(this);

  // update the skill master map to have data.
  DataManager.getSkillMasterMap();

  // instantiate the engine itself.
  $jabsEngine = new JABS_Engine();

  // setup the global access to the enemies database data.
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
//#endregion

//TODO: move these to the input manager?
//#region Input
/**
 * The mappings of the gamepad descriptions to their buttons.
 */
J.ABS.Input = {};

// this section of inputs is an attempt to align with the internal RMMZ mapping convention.
J.ABS.Input.DirUp = "up";
J.ABS.Input.DirDown = "down";
J.ABS.Input.DirLeft = "left";
J.ABS.Input.DirRight = "right";
J.ABS.Input.Mainhand = "ok";
J.ABS.Input.Offhand = "cancel";
J.ABS.Input.Dash = "shift";
J.ABS.Input.Tool = "tab";
J.ABS.Input.GuardTrigger = "pagedown";
J.ABS.Input.SkillTrigger = "pageup";

// this section of inputs are newly implemented, and thus shouldn't
J.ABS.Input.MobilitySkill = "r2";
J.ABS.Input.StrafeTrigger = "l2";
J.ABS.Input.Quickmenu = "start";
J.ABS.Input.PartyCycle = "select";
J.ABS.Input.Debug = "cheat";

// for gamepads, these buttons are tracked, but aren't used by JABS right now.
J.ABS.Input.R3 = "r3";
J.ABS.Input.L3 = "l3";

// for keyboards, these buttons are for direct combatskill usage.
J.ABS.Input.CombatSkill1 = "combat-skill-1";
J.ABS.Input.CombatSkill2 = "combat-skill-2";
J.ABS.Input.CombatSkill3 = "combat-skill-3";
J.ABS.Input.CombatSkill4 = "combat-skill-4";

/**
 * OVERWRITE Defines gamepad button input to instead perform the various
 * actions that are expected in this ABS.
 *
 * This includes:
 * - D-Pad up, down, left, right
 * - A/cross, B/circle, X/square, Y/triangle
 * - L1/LB, R1/RB
 * - NEW: select/options, start/menu
 * - NEW: L2/LT, R2/RT
 * - NEW: L3/LSB, R3/RSB
 * - OVERWRITE: Y now is the tool button, and start is the menu.
 */
Input.gamepadMapper = {
  0: J.ABS.Input.Mainhand,      // cross
  1: J.ABS.Input.Offhand,        // circle
  2: J.ABS.Input.Dash,          // square
  3: J.ABS.Input.Tool,          // triangle

  4: J.ABS.Input.SkillTrigger,  // left bumper
  5: J.ABS.Input.GuardTrigger,  // right bumper
  6: J.ABS.Input.StrafeTrigger, // left trigger
  7: J.ABS.Input.MobilitySkill, // right trigger

  8: J.ABS.Input.PartyCycle,        // select
  9: J.ABS.Input.Quickmenu,         // start

  10: J.ABS.Input.L3,           // left stick button
  11: J.ABS.Input.R3,           // right stick button

  12: J.ABS.Input.DirUp,        // d-pad up
  13: J.ABS.Input.DirDown,      // d-pad down
  14: J.ABS.Input.DirLeft,      // d-pad left
  15: J.ABS.Input.DirRight,     // d-pad right
  // the analog stick should be natively supported for movement.
};

/**
 * Extends the existing mapper for keyboards to accommodate for the
 * additional skill inputs that are used for gamepads.
 */
Input.keyMapper = {
  // define the original keyboard mapping.
  ...Input.keyMapper,

  // this is the new debug move-through for use with JABS.
  192: J.ABS.Input.Debug,       // ` (backtick)

  // core buttons.
  90: J.ABS.Input.Mainhand,     // z
  88: J.ABS.Input.Offhand,      // x
  16: J.ABS.Input.Dash,         // shift (overwrite)
  67: J.ABS.Input.Tool,         // c
  
  // functional buttons.
  81: J.ABS.Input.SkillTrigger, // q
  17: J.ABS.Input.StrafeTrigger,// ctrl
  69: J.ABS.Input.GuardTrigger, // e
   9: J.ABS.Input.MobilitySkill,// tab (overwrite)
  
  // quickmenu button.
  13: J.ABS.Input.Quickmenu,    // enter (overwrite)
  
  // party cycling button.
  46: J.ABS.Input.PartyCycle,   // del

  // movement buttons.
  38: J.ABS.Input.DirUp,        // arrow up
  40: J.ABS.Input.DirDown,      // arrow down
  37: J.ABS.Input.DirLeft,      // arrow left
  39: J.ABS.Input.DirRight,     // arrow right

  // keyboard alternative for the multi-button skills.
  49: J.ABS.Input.CombatSkill1,       // 1 = L1 + cross
  50: J.ABS.Input.CombatSkill2,       // 2 = L1 + circle
  51: J.ABS.Input.CombatSkill3,       // 3 = L1 + square
  52: J.ABS.Input.CombatSkill4,       // 4 = L1 + triangle
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
  constructor() 
{
 throw new Error("The JABS_AiManager is a static class."); 
}

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
  }

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
  }

  /**
   * Define whether or not the player is engaged in combat with any of the current battlers.
   */
  static manageAi()
  {
    // grab all available battlers within a fixed range.
    const battlers = $gameMap.getBattlersWithinRange(
      $jabsEngine.getPlayer1(),
      J.ABS.Metadata.MaxAiUpdateRange);

    // if we have no battlers, then do not process AI.
    if (!battlers.length) return;

    // iterate over each battler available.
    battlers.forEach(this.handleBattlerAi, this);
  }

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
  }

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
  }

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
  }
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
  }

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
  }

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
  }

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
  }

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
  }
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
  }

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
  }

  /**
   * Transitions this battler to AI phase 2, action decision and repositioning.
   * @param {JABS_Battler} battler The battler to transition.
   */
  static transitionToPhase2(battler)
  {
    // move to the next phase of AI.
    battler.setPhase(2);
  }

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
  }

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
    if (Math.randomInt(100) < 25)
    {
      // turn towards the target.
      battler.turnTowardTarget();
    }
  }

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
  }

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
      // move intelligently towards the target (uses careful pathfinding).
      battler.smartMoveTowardTarget();
    }
  }
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
  }

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
  }

  /**
   * Determines whether or not this battler needs to get into position.
   * @param {JABS_Battler} battler The battler to reposition.
   * @returns {boolean} True if this battler needs to move, false otherwise.
   */
  static needsRepositioning(battler)
  {
    // check if the battler is currently busy with another action like moving or casting.
    const isBusy = battler._event.isMoving() || battler.isCasting();

    // check if the battler is able to move.
    const isAble = battler.canBattlerMove();

    // check if the battler is already in-position.
    const alreadyInPosition = battler.isInPosition()

    // if the battler isn't busy, is able, and not already in position, then reposition!
    if (!isBusy && !alreadyInPosition && isAble) return true;

    // battler is fine where they are at.
    return false;
  }

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
  }

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
  }

  /**
   * The battler decides what action to execute.
   * @param {JABS_Battler} battler The battler deciding the actions.
   */
  static decideAiPhase2Action(battler)
  {
    this.decideEnemyAiPhase2Action(battler);
  }

  /**
   * The enemy battler decides what action to take.
   * Based on it's AI traits, it will make a decision on an action to take.
   * @param {JABS_Battler} battler The enemy battler deciding the action.
   */
  static decideEnemyAiPhase2Action(battler)
  {
    // grab the AI object belonging to this battler.
    const ai = battler.getAiMode();

    // extract the AI from this battler.
    const {careful, executor, reckless, healer, follower, leader} = ai;

    // check if the battler has the "leader" ai trait.
    if (leader)
    {
      // decide actions for all nearby followers.
      this.decideActionsForFollowers(battler);

      // fall through and continue with your own actions!
    }

    // check if the battler has the "follower" ai trait.
    if (follower)
    {
      // decide the skill and set it up for this follower.
      this.decideFollowerAi(battler);

      // stop processing.
      return;
    }

    // check if the battler has the "healer" ai trait.
    // battlers with "careful" will leverage that while deciding healing skills.
    if (healer)
    {
      // decide the skill and set it up for this battler.
      this.decideHealerAi(battler);

      // stop processing.
      return;
    }

    /*
    * It is important to note here that you can have "careful" and other above ai traits.
    * "careful" will impact how the above are decided.
    */

    // check if the battler has the "careful" or "executor" ai trait.
    if (careful || executor)
    {
      // decide an attack skill from the available skills.
      this.decideAggressiveAi(battler);

      // stop processing.
      return;
    }

    // check if the battler has the "reckless" ai trait.
    if (reckless)
    {
      // decide a random skill from the available skills.
      this.decideRecklessAi(battler);

      // stop processing.
      return;
    }

    // process generic AI decision making.
    this.decideGenericAi(battler);
  }

  //#region ai:leader
  /**
   * Decides the next action for all applicable followers.
   * @param {JABS_Battler} leader The leader to make decisions with.
   */
  static decideActionsForFollowers(leader)
  {
    // grab all nearby followers.
    const nearbyFollowers = $gameMap.getNearbyFollowers(leader);

    // iterate over each found follower.
    nearbyFollowers.forEach(follower => this.decideActionForFollower(leader, follower));
  }

  /**
   * Decides the next action for a follower.
   * @param {JABS_Battler} leader The leader battler.
   * @param {JABS_Battler} follower The follower battler potentially being lead.
   */
  static decideActionForFollower(leader, follower)
  {
    // leaders can't control other leaders' followers.
    if (!this.canDecideActionForFollower(leader, follower)) return;

    // assign the follower to this leader.
    if (!follower.hasLeader())
    {
      follower.setLeader(leader.getUuid());
    }

    // grab the leader's AI.
    const leaderAi = leader.getAiMode();

    // decide the action of the follower for them.
    const followerAction = leaderAi.decideActionForFollower(leader, follower);

    // check if we found a valid action for the follower.
    if (followerAction)
    {
      // set it as their next action.
      follower.setLeaderDecidedAction(followerAction);
    }
  }

  /**
   * Determines whether or not this leader can lead the given follower.
   * @param {JABS_Battler} leader The leader battler.
   * @param {JABS_Battler} follower The follower battler potentially being lead.
   * @returns {boolean} True if this leader can lead this follower, false otherwise.
   */
  static canDecideActionForFollower(leader, follower)
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
  //#endregion ai:leader

  //#region ai:follower
  /**
   * Handles how a follower decides its next action to take while engaged.
   *
   * NOTE:
   * If a follower has a leader, they will wait until the leader gives commands
   * to execute them. This means that the follower's turn speed will be reduced
   * to match the leader if necessary.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideFollowerAi(battler)
  {
    // check if we have a leader ready to guide us.
    if (this.hasLeaderReady(battler))
    {
      // let the leader decide what this battler should do.
      this.decideFollowerAiByLeader(battler);
    }
    // we have no leader.
    else
    {
      // only basic attacks for this battler.
      this.decideFollowerAiBySelf(battler);
    }
  }

  /**
   * Determines whether or not this battler has a leader ready to guide them.
   * @param {JABS_Battler} battler The battler deciding the action.
   * @returns {boolean} True if this battler has a ready leader, false otherwise.
   */
  static hasLeaderReady(battler)
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
  static decideFollowerAiByLeader(battler)
  {
    // show the balloon that we are processing leader actions instead.
    battler.showBalloon(J.ABS.Balloons.Check);

    // we have an engaged leader.
    const leaderDecidedSkillId = battler.getNextLeaderDecidedAction();

    // check if we decided on a skill.
    if (!leaderDecidedSkillId || leaderDecidedSkillId.length)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(leaderDecidedSkillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, leaderDecidedSkillId, cooldownKey);
  }

  /**
   * Allows the follower to decide their own next action to take.
   * It is always a basic attack.
   * @param {JABS_Battler} battler The follower that is deciding for themselves.
   */
  static decideFollowerAiBySelf(battler)
  {
    // only basic attacks for this battler.
    const [basicAttackSkillId] = battler.getEnemyBasicAttack();

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(basicAttackSkillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, basicAttackSkillId, cooldownKey);
  }
  //#endregion ai:follower

  //#region ai:healer
  /**
   * Handles how a healer decides its next action to take while engaged.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideHealerAi(battler)
  {
    // get all skills available to this enemy.
    const skillsToUse = battler.getSkillIdsFromEnemy();

    // determine the best support action to use.
    const skillId = battler.getAiMode().decideSupportAction(battler, skillsToUse);

    // check if we decided on a skill.
    if (!skillId)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(skillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, skillId, cooldownKey);
  }
  //#endregion ai:healer

  //#region ai:careful/executor
  /**
   * Handles how a batler decides its next action to take while engaged.
   * "Smart" battlers will try to use skills that are known to be strong/effective
   * against their targets.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideAggressiveAi(battler)
  {
    // get all skills available to this enemy.
    const skillsToUse = battler.getAllSkillIdsFromEnemy();

    // determine the best attack action to use.
    const skillId = battler.getAiMode().decideAttackAction(battler, skillsToUse) ?? 0;

    // check if we decided on a skill.
    if (!skillId)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(skillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, skillId, cooldownKey);
  }
  //#endregion ai:careful/executor

  //#region ai:reckless
  /**
   * Handles how a battler decides its next action while engaged.
   * "Reckless" battlers will always try to use a skill instead of their basic attack.
   * If an enemy with reckless does not have any skills to use, it will default to
   * its own basic attack instead.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideRecklessAi(battler)
  {
    // get all skills (excluding basic attack) available to this enemy.
    const skillsToUse = battler.getSkillIdsFromEnemy();

    // check if we decided on a skill.
    if (!skillsToUse || !skillsToUse.length)
    {
      console.warn('a battler with the "reckless" trait was found with no skills.', battler);
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // determine the best attack action to use.
    const skillId = battler.getAiMode().decideAttackAction(battler, skillsToUse);

    if (!this.isSkillIdValid(skillId))
    {
      // cancel the setup if we can't use any skills while being reckless!
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(skillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, skillId, cooldownKey);
  }

  /**
   *
   * @param {number|number[]} skillId The skill id or ids to validate.
   * @returns {boolean} True if the skill id is
   */
  static isSkillIdValid(skillId)
  {
    // if the skill id is something falsy like 0/null/undefined, not valid.
    if (!skillId) return false;

    // check if the "skill id" is actually an array of them.
    if (Array.isArray(skillId))
    {
      // the length of the skill id array is 0, not valid.
      if (!skillId.length) return false;
    }

    // skill id is valid!
    return true;
  }
  //#endregion ai:reckless

  //#region ai:unassigned
  /**
   * HAndles how a battler decides its next action while engaged.
   * When a battler has no special ai traits, it'll just pick a random skill
   * from its list of skills with a 50% chance of instead using its basic attack.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideGenericAi(battler)
  {
    // get all skills available to this enemy.
    const skillsToUse = battler.getSkillIdsFromEnemy();

    // determine the best attack action to use.
    let skillId = skillsToUse[Math.randomInt(skillsToUse.length)];

    // 50% chance of just using the basic attack instead.
    if (Math.randomInt(2) === 0)
    {
      // grab this enemy's basic attack.
      const [basicAttackSkillId] = battler.getEnemyBasicAttack();

      // overwrite the random skill with the basic attack.
      skillId = basicAttackSkillId;
    }

    // check if we decided on a skill.
    if (!skillId)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown key from the skill.
    const cooldownKey = this.buildEnemyCooldownType($dataSkills[skillId]);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, skillId, cooldownKey);
  }
  //#endregion ai:unassigned

  /**
   * Sets up the battler and the action in preparation for the next phase.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {number} skillId The id of the skill to perform the action for.
   * @param {string} cooldownKey The type of cooldown to set to the action.
   */
  static setupActionForNextPhase(battler, skillId, cooldownKey)
  {
    // check if we can setup this action.
    if (!this.canSetupActionForNextPhase(battler, skillId))
    {
      // cancel the action setup.
      this.cancelActionSetup(battler);

      // do not process.
      return;
    }

    // generate the actions based on the given skill id.
    const actions = battler.createJabsActionFromSkill(skillId);

    // set the cooldown type for all actions.
    actions.forEach(action => action.setCooldownType(cooldownKey));

    // determine the "primary" action.
    const action = actions[0];

    // perform the execution animation.
    this.performExecutionAnimation(battler, action);

    // set an arbitrary 1/3 second wait after setup.
    battler.setWaitCountdown(20);

    // set the cast time of this skill.
    battler.setCastCountdown(action.getCastTime());

    // set the decided action.
    battler.setDecidedAction(actions);
  }

  /**
   * Constructs a cooldown key based on the skill.
   * @param {RPG_Skill} skill The chosen skill to determine a cooldown type for.
   * @returns {string} The cooldown key.
   */
  static buildEnemyCooldownType(skill)
  {
    return `${skill.id}-${skill.name}`;
  }

  /**
   * Determines whether or not the given skill can be transformed into an action
   * by the given battler.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {number} skillId The id of the skill to perform the action for.
   * @returns {boolean} True if we can setup an action with this skill id, false otherwise.
   */
  static canSetupActionForNextPhase(battler, skillId)
  {
    // check if we even have a skill to setup.
    if (!skillId) return false;

    // check if this battler can execute this skill.
    if (!battler.canExecuteSkill(skillId)) return false;

    // setup the action!
    return true;
  }

  /**
   * Cancel the setup process for this battler.
   * @param {JABS_Battler} battler The battler canceling the action.
   */
  static cancelActionSetup(battler)
  {
    // set the decided action to null.
    battler.setDecidedAction(null);

    // if we can't setup this skill for some reason, then wait before trying again.
    battler.setWaitCountdown(20);
  }

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
  }

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
      battler.setInPosition(true);
    }
  }

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
  }

  /**
   * Determines whether or not to move closer in AI phase 2.
   * @param {JABS_Battler} battler The battler to check if movement is needed.
   * @returns {boolean} True if this battler needs to move closer, false otherwise.
   */
  static needsToMoveCloser(battler)
  {
    // grab the action.
    const action = battler.getDecidedAction()[0];

    // check if the action is self-targeting; we can cast these wherever.
    if (action.isForSelf()) return false;

    // calculate distance to target to determine if we need to get closer.
    const distanceToTarget = battler.getAllyTarget()
      ? battler.distanceToAllyTarget()
      : battler.distanceToCurrentTarget();

    // check if we are further away than the minimum proximity.
    if (distanceToTarget > action.getProximity()) return true;

    // no need to move.
    return false;
  }

  /**
   * Moves this battler closer to the relevant target.
   * @param {JABS_Battler} battler The battler to move.
   */
  static phase2MoveCloser(battler)
  {
    // check if this battler has an ally target first.
    if (battler.getAllyTarget())
    {
      // move towards the ally.
      battler.smartMoveTowardAllyTarget();
    }
    // this battler does not have an ally target.
    else
    {
      // move towards the target instead.
      battler.smartMoveTowardTarget();
    }
  }
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
      if (this.canPerformPhase3Movement(battler))
      {
        // move around while you're waiting for the cooldown.
        this.decideAiPhase3Movement(battler);
      }
    }
  }

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
  }

  /**
   * Resets the phases for this battler back to phase 1.
   * @param {JABS_Battler} battler The battler to reset phases for.
   */
  static resetAiPhases(battler)
  {
    // AI loop complete, reset back to phase 1.
    battler.resetPhases();
  }

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
  }

  /**
   * Decides where to move while waiting for cooldown to complete from the skill.
   * @param {JABS_Battler} battler The battler in this cooldown phase.
   */
  static decideAiPhase3Movement(battler)
  {
    // move around as-necessary.
    this.decideAiMovement(battler);
  }

  //#endregion Phase 3 - Post-Action Cooldown Phase
}
//#endregion JABS_AiManager
//ENDFILE