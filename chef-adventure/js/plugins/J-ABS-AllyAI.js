//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 ALLYAI] Grants your allies AI and the will to fight alongside the player.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * It would be overwhelming to write everything here.
 * Do visit the URL attached to this plugin for documentation.
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() => {
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.Base.Helpers.satisfies(requiredBaseVersion, J.Base.Metadata.Version);
  if (!hasBaseRequirement) {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

// Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '2.3.0';
  const hasJabsRequirement = J.Base.Helpers.satisfies(requiredJabsVersion, J.ABS.Metadata.Version);
  if (!hasJabsRequirement) {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//#endregion version check

//#region plugin setup and configuration
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ALLYAI = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ALLYAI.Metadata = {};
J.ALLYAI.Metadata.Name = `J-ABS-AllyAI`;
J.ALLYAI.Metadata.Version = '1.0.0';

/**
 * A collection of all aliased methods for this plugin.
 */
J.ALLYAI.Aliased = {
  Game_Actor: {},
  Game_BattleMap: {},
  Game_Battler: {},
  Game_Follower: {},
  Game_Followers: {},
  Game_Interpreter: {},
  Game_Map: {},
  Game_Party: {},
  Game_Player: {},
  JABS_AiManager: {},
  JABS_Battler: {},
  Scene_Map: {},
  Window_AbsMenu: {},
  Window_AbsMenuSelect: {},
};
//#endregion plugin setup and configuration
//#endregion Introduction

//#region Game objects
//#region Game_Actor
/**
 * Adds in the jabs tracking object for ally ai.
 */
J.ALLYAI.Aliased.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
  J.ALLYAI.Aliased.Game_Actor.initMembers.call(this);
  this._j = this._j || {};
  /**
   * The current ally ai configuration for this actor.
   * @type {JABS_AllyAi}
   */
  this._j._allyAi = this._j._allyAi || null;
};

J.ALLYAI.Aliased.Game_Actor.setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
  J.ALLYAI.Aliased.Game_Actor.setup.call(this, actorId);
  this.initializeAllyAI();
};

/**
 * Initializes the ally ai for this battler.
 */
Game_Actor.prototype.initializeAllyAI = function() {
  if (!this.getAllyAI()) {
    const defaultAllyAiMode = this.getDefaultAllyAI();
    this._j._allyAi = new JABS_AllyAI(defaultAllyAiMode);
  }
};

/**
 * Gets the currently configured ally ai.
 * @returns {JABS_AllyAI}
 */
Game_Actor.prototype.getAllyAI = function() {
  return this._j._allyAi;
};

/**
 * Gets the default ally ai mode that is defined in the actor's notes
 * (or actor's class's notes).
 * @returns {string}
 */
Game_Actor.prototype.getDefaultAllyAI = function() {
  // if there is no actor id, then don't try this yet.
  if (!this._actorId) return null;

  let defaultAllyAi = JABS_AllyAI.modes.VARIETY;
  const structure = /<defaultAi:([-. \w+]*)>/i;
  const actorData = this.actor();

  // check the actor's notes first.
  const notedata = actorData.note.split(/[\r\n]+/);
  notedata.forEach(note => {
    if (note.match(structure)) {
      if (JABS_AllyAI.validateMode(RegExp.$1)) {
        defaultAllyAi = RegExp.$1;
      }
    }
  });

  // then check the class notes in case there is a more granular ai assignment.
  const classId = actorData.classId;
  const classData = $dataClasses[classId];
  const classNotedata = classData.note.split(/[\r\n]+/);
  classNotedata.forEach(note => {
    if (note.match(structure)) {
      if (JABS_AllyAI.validateMode(RegExp.$1)) {
        defaultAllyAi = RegExp.$1;
      }
    }
  });

  return defaultAllyAi;
};
//#endregion Game_Actor

//#region Game_BattleMap
/**
 * OVERWRITE Updates the party cycle functionality to cycle to the next follower instead
 * of generating a new player for every party cycle.
 */
J.ALLYAI.Aliased.Game_BattleMap.performPartyCycling = Game_BattleMap.prototype.performPartyCycling;
Game_BattleMap.prototype.performPartyCycling = function() {
  // if followers aren't enabled, then do it like normal.
  if (!$gamePlayer.followers().isVisible()) {
    J.ALLYAI.Aliased.Game_BattleMap.performPartyCycling.call(this);
    return;
  }

  // determine which battler in the party is the next living battler.
  const nextLivingAllyIndex = $gameParty._actors.findIndex((actorId, index) => {
    if (index === 0) return false; // don't look at the current leader.
    return !$gameActors.actor(actorId).isDead();
  });

  // can't cycle if there are no living/valid members.
  if (nextLivingAllyIndex === -1) return;

  // when cycling, jump all followers to the player.
  $gamePlayer.jumpFollowersToMe();

  // take a snapshot of the next battler for the player to control.
  const nextUuid = $gameParty.members()[nextLivingAllyIndex].getUuid();
  const nextJabsBattler = $gameBattleMap.getBattlerByUuid(nextUuid);
  if (!nextJabsBattler) {
    console.warn(`the next follower of uuid: [${nextUuid}], wasn't able to be retrieved.`);
    return;
  }

  // swap to the next party member in the sequence.
  $gameParty._actors = $gameParty._actors.concat($gameParty._actors.splice(0, nextLivingAllyIndex));
  $gamePlayer.refresh();
  $gamePlayer.requestAnimation(40, false);

  // recreate the JABS player battler and set it to the player character.
  nextJabsBattler.setCharacter($gamePlayer);
  this._playerBattler = nextJabsBattler;
  const newPlayer = this.getPlayerMapBattler().getCharacter();
  newPlayer.setMapBattler(this._playerBattler.getUuid());
  newPlayer.setThrough(false);

  // request the scene overlord to take notice and react accordingly (refresh hud etc).
  this.requestPartyRotation = true;
  if (J.TextLog && J.TextLog.Metadata.Enabled) {
    const battlerName = this.getPlayerMapBattler().battlerName();
    const log = new Map_TextLog(`Party cycled to ${battlerName}.`, -1);
    $gameTextLog.addLog(log);
  }

  // refresh all battlers on the map.
  $gameMap.updateAllies();
};
//#endregion Game_BattleMap

//#region Game_Followers
/**
 * OVERWRITE If you're using this, the followers always show up!
 * @returns {boolean}
 */
J.ALLYAI.Aliased.Game_Followers.show = Game_Followers.prototype.show;
Game_Followers.prototype.show = function() {
  J.ALLYAI.Aliased.Game_Followers.show.call(this);
  $gameMap.updateAllies();
  $gameBattleMap.requestJabsMenuRefresh = true;
};

/**
 * OVERWRITE If you're using this, the followers always show up!
 * @returns {boolean}
 */
J.ALLYAI.Aliased.Game_Followers.hide = Game_Followers.prototype.hide;
Game_Followers.prototype.hide = function() {
  J.ALLYAI.Aliased.Game_Followers.hide.call(this);
  $gameMap.updateAllies();
  $gameBattleMap.requestJabsMenuRefresh = true;
};
/**
 * OVERWRITE Adjust the jumpAll function to prevent jumping to the player
 * when the player is hit.
 */
Game_Followers.prototype.jumpAll = function() {
  if ($gamePlayer.isJumping()) {
    for (const follower of this._data) {
      // skip followers that don't exist.
      if (!follower || !follower.isVisible()) return;

      // don't jump to the player when the player gets hit.
      const battler = follower.getMapBattler();
      if (battler.isEngaged()) return;

      // if not engaged, then jumping to the player is OK.
      const sx = $gamePlayer.deltaXFrom(follower.x);
      const sy = $gamePlayer.deltaYFrom(follower.y);
      follower.jump(sx, sy);
    }
  }
};
//#endregion Game_Followers

//#region Game_Follower
/**
 * OVERWRITE Adjust the chaseCharacter function to prevent chasing the player
 * while this follower is engaged.
 * @param {Game_Character} character The character this follower is following.
 */
J.ALLYAI.Aliased.Game_Follower.chaseCharacter = Game_Follower.prototype.chaseCharacter;
Game_Follower.prototype.chaseCharacter = function(character) {
  // if we're just a ghost follower, or a dead battler, follow like a good little default follower.
  const battler = this.getMapBattler();
  if (!this.isVisible() || battler.isDead()) {
    J.ALLYAI.Aliased.Game_Follower.chaseCharacter.call(this, character);
    return;
  }

  const distanceToPlayer = $gameMap.distance(this._realX, this._realY, $gamePlayer._realX, $gamePlayer._realY);
  if (!battler.isEngaged() && !battler.isAlerted()) {
    // if the battler isn't engaged, still follow the player.
    J.ALLYAI.Aliased.Game_Follower.chaseCharacter.call(this, character);
    if (distanceToPlayer <= 5) {
      // if the ally is within range of the player, then re-enable the ability to engage.
      battler.unlockEngagement();
    }

    return;
  } else {
    // if the battler is engaged, make sure they stay within range of the player.
    if (distanceToPlayer > 10) {
      // when the ally is too far away from the player, disengage and prevent further engagement.
      battler.lockEngagement();
      battler.disengageTarget();
      battler.resetAllAggro(null, true);
      this.jumpToPlayer();
    }
  }
};

/**
 * OVERWRITE Removed the forced direction-fix upon followers when the player is guarding.
 */
J.ALLYAI.Aliased.Game_Follower.update = Game_Follower.prototype.update;
Game_Follower.prototype.update = function() {
  if (!this.isVisible()) {
    J.ALLYAI.Aliased.Game_Follower.update.call(this);
    return;
  } else {
    Game_Character.prototype.update.call(this);
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
    this.setOpacity($gamePlayer.opacity());
    this.setBlendMode($gamePlayer.blendMode());
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    this.setStepAnime($gamePlayer.hasStepAnime());
    this.setTransparent($gamePlayer.isTransparent());
  }
};

/**
 * Jump to the player from wherever you are.
 */
Game_Follower.prototype.jumpToPlayer = function() {
  const sx = $gamePlayer.deltaXFrom(this.x);
  const sy = $gamePlayer.deltaYFrom(this.y);
  this.jump(sx, sy);
};
//#endregion Game_Follower

//#region Game_Map
/**
 * Parses out all enemies from the array of events on the map.
 * @param {Game_Event[]} evs An array of events.
 * @returns {JABS_Battler[]}
 */
J.ALLYAI.Aliased.Game_Map.parseBattlers = Game_Map.prototype.parseBattlers;
Game_Map.prototype.parseBattlers = function() {
  const mapBattlers = J.ALLYAI.Aliased.Game_Map.parseBattlers.call(this);
  return mapBattlers.concat(this.parseAllyBattlers());
};

/**
 * Gets all ally battlers out of the collection of battlers.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllyBattlers = function() {
  return this._j._allBattlers.filter(battler => battler.isActor());
};

/**
 * Updates all ally battlers in-place.
 * For use with party-cycling.
 */
Game_Map.prototype.updateAllies = function() {
  // get all the ally battlers from the current collection.
  const allyJabsBattlers = this.getAllyBattlers();

  // first remove all battlers.
  this.removeBattlers(allyJabsBattlers);

  // then re-add the updated ones.
  const allies = this.parseAllyBattlers();
  this.addBattlers(allies);
};

Game_Map.prototype.addBattlers = function(battlers) {
  // don't bother processing if the addition is empty.
  if (!battlers.length) return;

  this._j._allBattlers.splice(0, 0, ...battlers);
};

/**
 * Removes all provided battlers from the battler tracking.
 * @param {JABS_Battler[]} battlers The battlers to be removed.
 */
Game_Map.prototype.removeBattlers = function(battlers) {
  // disengage and destroy all battlers.
  battlers.forEach(battler => {
    // disengage before destroying.
    battler.disengageTarget();
    // but do hold onto the event/sprite, because its a follower.
    $gameMap.destroyBattler(battler, true);
  });
};

/**
 * Parses all followers that are active into their battler form.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.parseAllyBattlers = function() {
  const followers = this.getActiveFollowers();
  return followers.map(this.convertOneFollower);
};

/**
 * Gets all followers that are active.
 * @returns {Game_Actor[]}
 */
Game_Map.prototype.getActiveFollowers = function() {
  const followers = $gamePlayer.followers().data();
  return followers.filter(follower => follower.isVisible());
};

/**
 * Converts a single follower into a `JABS_Battler`.
 * @param {Game_Follower} follower The follower to convert into a battler.
 * @returns {JABS_Battler}
 */
Game_Map.prototype.convertOneFollower = function(follower) {
  const battler = follower.actor();
  // TODO: dynamically fetch AI from the actor's page as default.
  const tempAI = new JABS_BattlerAI(true, true);
  const coreBattlerData = new JABS_BattlerCoreData(
    battler.actorId(),    // battler id
    0,                    // team id
    tempAI,               // battler AI
    4,                    // sight range
    6,                    // alerted sight boost
    10,                   // pursuit range
    10,                   // alerted pursuit boost
    300,                  // alert duration
    false,                // can move idly
    false,                // show hp bar
    false,                // show danger indicator
    false,                // show name
    false,                // is invincible
    false);               // is inanimate
  const mapBattler = new JABS_Battler(follower, battler, coreBattlerData);
  follower.setMapBattler(mapBattler.getUuid());
  return mapBattler;
};
//#endregion Game_Map

//#region Game_Party
/**
 * Extends initialization to include the ally AI configurations.
 */
J.ALLYAI.Aliased.Game_Party.initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
  J.ALLYAI.Aliased.Game_Party.initialize.call(this);
  this._j = this._j || {};
  this._j._allyAI = this._j._allyAI || {};
  this._j._allyAI._aggroPassiveToggle = this._j._allyAI._aggroPassiveToggle || false;
};

/**
 * Gets whether or not the party is allowed to actively engage enemies.
 * @returns {boolean}
 */
Game_Party.prototype.isAggro = function() {
  return this._j._allyAI._aggroPassiveToggle;
};

/**
 * Sets the party ally AI to be aggro.
 * Aggro party ally AI will have their own sight ranges and engage any enemies nearby.
 */
Game_Party.prototype.becomeAggro = function() {
  this._j._allyAI._aggroPassiveToggle = true;
};

/**
 * Sets the party ally AI to be passive.
 * Passive party ally AI will only fight if hit first or when the leader engages.
 */
Game_Party.prototype.becomePassive = function() {
  this._j._allyAI._aggroPassiveToggle = false;
};
//#endregion Game_Party

//#region Game_Player
/**
 * Jumps all followers of the player back to the player.
 */
Game_Player.prototype.jumpFollowersToMe = function() {
  this.followers().data().forEach(follower => follower.jumpToPlayer());
};
//#endregion Game_Player
//#endregion Game objects

//#region JABS objects
//#region JABS_AiManager
J.ALLYAI.Aliased.JABS_AiManager.aiPhase0 = JABS_AiManager.aiPhase0;
JABS_AiManager.aiPhase0 = function(battler) {
  battler.isEnemy()
    ? J.ALLYAI.Aliased.JABS_AiManager.aiPhase0.call(this, battler)
    : this.allyAiPhase0(battler);
};

JABS_AiManager.allyAiPhase0 = function(allyBattler) {
  const character = allyBattler.getCharacter();
  const isStopped = character.isStopping();
  const alerted = allyBattler.isAlerted();
  if (isStopped && alerted) {
    this.seekForAlerter(allyBattler);
  }
};

/**
 * Extend the pre-action movement decision phase to also handle ally movement.
 */
J.ALLYAI.Aliased.JABS_AiManager.decideAiPhase1Movement = JABS_AiManager.decideAiPhase1Movement;
JABS_AiManager.decideAiPhase1Movement = function(battler) {
  battler.isEnemy()
    ? J.ALLYAI.Aliased.JABS_AiManager.decideAiPhase1Movement.call(this, battler)
    : this.decideAllyAiPhase1Movement(battler);
};

/**
 * Executes a movement based on phase and ally AI against it's target.
 * @param {JABS_Battler} battler The battler deciding it's phase 1 movement.
 */
JABS_AiManager.decideAllyAiPhase1Movement = function(battler) {
  const distance = battler.distanceToCurrentTarget();
  if (distance === null) return;

  // will try to maintain a comfortable distance from the target.
  if (JABS_Battler.isClose(distance)) {
    battler.moveAwayFromTarget();
  } else if (JABS_Battler.isFar(distance)) {
    battler.smartMoveTowardTarget();
  }

  battler.turnTowardTarget();
};

/**
 * Extend the action decision phase to also handle ally decision-making.
 */
J.ALLYAI.Aliased.JABS_AiManager.decideAiPhase2Action = JABS_AiManager.decideAiPhase2Action;
JABS_AiManager.decideAiPhase2Action = function(battler) {
  battler.isEnemy()
    ? J.ALLYAI.Aliased.JABS_AiManager.decideAiPhase2Action.call(this, battler)
    : this.decideAllyAiPhase2Action(battler);
};

/**
 * The ally battler decides what action to take.
 * Based on it's AI traits, it will make a decision on an action to take.
 * @param {JABS_Battler} allyBattler The ally battler deciding the action.
 */
JABS_AiManager.decideAllyAiPhase2Action = function(allyBattler) {
  const battler = allyBattler.getBattler();
  const allyAi = allyBattler.getAllyAiMode();

  // get all slots that have skills in them.
  const validSkillSlots = battler.getValidEquippedSkillSlots();

  // convert the slots into their respective skill ids.
  const currentlyEquippedSkillIds = validSkillSlots.map(slotKey => battler.getEquippedSkill(slotKey));

  // decide the action based on the ally ai mode currently assigned.
  const decidedSkillId = allyAi.decideAction(currentlyEquippedSkillIds, allyBattler, allyBattler.getTarget());
  if (!decidedSkillId || !battler.canPaySkillCost($dataSkills[decidedSkillId])) {
    allyBattler.setPhase(1);
    allyBattler.resetPhases();
    return;
  }

  // determine the slot to apply the cooldown to.
  const decidedSkillSlot = battler.findSlotForSkillId(decidedSkillId);

  // setup the action for use!
  this.setupAllyActionForNextPhase(allyBattler, decidedSkillId, decidedSkillSlot);
};

/**
 * Sets up the battler and the action in preparation for the next phase.
 * For allies, this also applies the cooldown as-expected.
 * @param {JABS_Battler} battler The battler performing the action.
 * @param {number} chosenSkillId The id of the skill to perform the action for.
 * @param {string} chosenSkillSlot The slot of the skill to perform the action for.
 */
JABS_AiManager.setupAllyActionForNextPhase = function(battler, chosenSkillId, chosenSkillSlot) {
  const mapActions = battler.createMapActionFromSkill(chosenSkillId);
  const primaryMapAction = mapActions[0];
  mapActions.forEach(action => action.setCooldownType(chosenSkillSlot));
  battler.setDecidedAction(mapActions);
  if (primaryMapAction.isSupportAction()) {
    battler.showAnimation(J.ABS.Metadata.SupportDecidedAnimationId)
  } else {
    battler.showAnimation(J.ABS.Metadata.AttackDecidedAnimationId)
  }

  battler.setWaitCountdown(20);
  battler.setCastCountdown(primaryMapAction.getCastTime());
};
//#endregion JABS_AiManager

//#region JABS_AllyAI
/**
 * A class representing the AI-decision-making functionality for allies.
 */
function JABS_AllyAI() { this.initialize(...arguments); }
JABS_AllyAI.prototype = {};
JABS_AllyAI.prototype.constructor = JABS_AllyAI;

//#region statics
/**
 * The strict enumeration of what ai modes are available for ally ai.
 */
JABS_AllyAI.modes = {
  /**
   * When this mode is assigned, the battler will take no action.
   */
  DO_NOTHING: "do-nothing",

  /**
   * When this mode is assigned, the battler will only use their mainhand attack skill.
   * If no skill is equipped in their main hand, they will do nothing.
   */
  BASIC_ATTACK: "basic-attack",

  /**
   * When this mode is assigned, the battler will intelligently decide from any skill they have equipped.
   */
  VARIETY: "variety",

  /**
   * When this mode is assigned, the battler will use the biggest and strongest skills available.
   */
  FULL_FORCE: "full-force",

  /**
   * When this mode is assigned, the battler will prioritize supporting and healing allies.
   */
  SUPPORT: "support"
};

/**
 * Gets all valid values of the possible modes currently implemented.
 * @returns {string[]}
 */
JABS_AllyAI.getModes = () => Object.keys(JABS_AllyAI.modes).map(key => JABS_AllyAI.modes[key]);

/**
 * Validates the input of a mode to ensure it is one of the available and implemented ally ai modes.
 * @param {string} potentialMode The mode to validate.
 * @returns {boolean}
 */
JABS_AllyAI.validateMode = potentialMode => JABS_AllyAI.getModes().includes(potentialMode);
//#endregion statics

//#region initialize
/**
 * Initializes this class.
 * @param {string} initialMode The mode to start out in.
 */
JABS_AllyAI.prototype.initialize = function(initialMode) {
  this.mode = initialMode;
  this.initMembers();
};

/**
 * Initializes all default members of this class.
 */
JABS_AllyAI.prototype.initMembers = function() {
  /**
   * The collection of memories this ally ai possesses.
   * @type {JABS_BattleMemory[]}
   */
  this.memory = [];
};
//#endregion initialize

//#region mode
/**
 * Gets the current mode this ally's AI is set to.
 * @returns {string}
 */
JABS_AllyAI.prototype.getMode = function() {
  return this.mode;
};

/**
 * Changes the current AI mode this ally is set to.
 * @param {string} newMode 
 */
JABS_AllyAI.prototype.changeMode = function(newMode) {
  if (!JABS_AllyAI.validateMode(newMode)) {
    console.error(`Attempted to assign ally ai mode: [${newMode}], but is not a valid ai mode.`);
    return;
  }

  this.mode = newMode;
};
//#endregion mode

//#region decide action
/**
 * Decides a skill id based on this ally's current AI mode.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} attacker The battler choosing the skill.
 * @param {JABS_Battler} target The targeted battler to use the skill against.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideAction = function(availableSkills, attacker, target) {
  const currentMode = this.getMode();
  switch (currentMode) {
    case JABS_AllyAI.modes.DO_NOTHING:
      return this.decideDoNothing();
    case JABS_AllyAI.modes.BASIC_ATTACK:
      return this.decideBasicAttack(availableSkills, attacker);
    case JABS_AllyAI.modes.VARIETY:
      return this.decideVariety(availableSkills, attacker, target);
    case JABS_AllyAI.modes.FULL_FORCE:
      return this.decideFullForce(availableSkills, attacker, target);
    case JABS_AllyAI.modes.SUPPORT:
      return this.decideSupport(availableSkills, attacker);
  }

  console.warn(`The currently selected AI mode of [${currentMode}] is not yet implemented.`);
  return availableSkills[0];
};

//#region nothing
/**
 * Decides to do nothing.
 * @returns {null}
 */
JABS_AllyAI.prototype.decideDoNothing = function() {
  return null;
};
//#endregion nothing

//#region basic-attack
/**
 * Decides a skill id based on the ai mode of "basic attack only".
 * Only uses the "mainhand" slotted skill. If no skill is equipped in that slot, then returns nothing.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} attacker The battler choosing the skill.
 * @param {JABS_Battler} target The targeted battler to use the skill against.
 * @returns {number?}
 */
JABS_AllyAI.prototype.decideBasicAttack = function(availableSkills, attacker) {
  // determine which skill of the skills available is the mainhand skill.
  const basicAttackSkillId = availableSkills
    .find(id => attacker.getBattler().findSlotForSkillId(id) === Game_Actor.JABS_MAINHAND);
  
  // if the battler doesn't have a mainhand equipped, then do nothing.
  if (!basicAttackSkillId) return null;

  // return the mainhand attack skill id only.
  return basicAttackSkillId;
};
//#endregion basic-attack

//#region variety
/**
 * Decides a skill id based on the ai mode of "variety".
 * If no allies are in danger, then simply chooses a random skill.
 * Will learn over time which skills are effective and ineffective against targets.
 * May use a support skill if allies are below half health.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} attacker The battler choosing the skill.
 * @param {JABS_Battler} target The targeted battler to use the skill against.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideVariety = function(availableSkills, attacker, target) {
  let chosenSkillId = 0;
  let tempAvailableSkills = availableSkills;

  // check if any nearby allies are "in danger".
  const nearbyAllies = attacker.getAllNearbyAllies();
  const anyAlliesInDanger = nearbyAllies.some(battler => battler.getBattler().currentHpPercent() < 0.6);

  // if they are, 50:50 chance to instead prioritize a support action.
  if (anyAlliesInDanger && Math.randomInt(2) === 0) {
    return this.decideSupport(availableSkills, attacker);
  }

  // grab all memories that this battler has of the target.
  const memoriesOfTarget = this.memory.filter(mem => mem.battlerId === target.getBattlerId());

  // filter all available skills down to what we recall as effective.
  tempAvailableSkills = tempAvailableSkills.filter(skillId => {
    const priorMemory = memoriesOfTarget.find(mem => mem.skillId === skillId);
    return (priorMemory && priorMemory.wasEffective());
  });

  // if no skill was effective, or there were no memories, just pick a random skill and call it good.
  if (tempAvailableSkills.length === 0) {
    chosenSkillId = availableSkills[Math.randomInt(availableSkills.length)];
  }

  // if the memories yielded a single effective skill, then 50/50 between that and a random skill.
  if (tempAvailableSkills.length === 1) {
    chosenSkillId = Math.randomInt(2) === 0
      ? tempAvailableSkills[0]
      : availableSkills[Math.randomInt(availableSkills.length)];
  }

  // if there were multiple memories of effective skills against the target, then randomly pick one.
  if (tempAvailableSkills.length > 1) {
    chosenSkillId = tempAvailableSkills[Math.randomInt(tempAvailableSkills.length)];
  }

  return chosenSkillId;
};
//#endregion variety

//#region full-force
/**
 * Decides a skill id based on the ai mode of "full-force".
 * Always looks to choose the skill that will deal the most damage.
 * If we developed effective memories, then we may leverage those instead.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} attacker The battler choosing the skill.
 * @param {JABS_Battler} target The targeted battler to use the skill against.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideFullForce = function(availableSkills, attacker, target) {
  let chosenSkillId = 0;
  let tempAvailableSkills = availableSkills;

  // grab all memories that this battler has of the target.
  const memoriesOfTarget = this.memory.filter(mem => mem.battlerId === target.getBattlerId());

  // filter all available skills down to what we recall as effective.
  tempAvailableSkills = tempAvailableSkills.filter(skillId => {
    const priorMemory = memoriesOfTarget.find(mem => mem.skillId === skillId);
    return (priorMemory && priorMemory.wasEffective());
  });

  // if no skill was effective, or there were no memories, just pick a random skill and call it good.
  if (tempAvailableSkills.length === 0) {
    chosenSkillId = this.determineStrongestSkill(availableSkills, attacker, target);
  } else if (tempAvailableSkills.length === 1) {
    // determine the strongest skill available.
    const strongestSkillId = this.determineStrongestSkill(availableSkills, attacker, target);

    // compare the freshly calculated strongest skill with one that was proven to be effective.
    if (strongestSkillId === tempAvailableSkills[0]) {
      // if the strongest skill that was just calculated is the effective skill, then just use that.
      chosenSkillId = strongestSkillId;
    } else {
      // if it wasn't the effective skill, then either use that or use the newly calculated skill.
      chosenSkillId = Math.randomInt(2) === 0
        ? strongestSkillId
        : tempAvailableSkills[0];
    }
  } else {
    // if we have multiple previously proven-effective skills, then just pick one of those.
    chosenSkillId = tempAvailableSkills[Math.randomInt(tempAvailableSkills.length)];
  }

  return chosenSkillId;
};

/**
 * Determines which skill would deal the greatest amount of damage to the target.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} attacker The battler choosing the skill.
 * @param {JABS_Battler} target The targeted battler to use the skill against.
 * @returns {number}
 */
JABS_AllyAI.prototype.determineStrongestSkill = function(availableSkills, attacker, target) {
  let strongestSkillId = 0;
  let highestDamage = 0;
  let biggestCritDamage = 0;
  availableSkills.forEach(skillId => {
    const skill = $dataSkills[skillId];

    // setup a game action for testing damage.
    const testAction = new Game_Action(attacker.getBattler());
    testAction.setItemObject(skill);

    // test the base and crit damage values for this skill against the target.
    const baseDamageValue = testAction.makeDamageValue(target.getBattler(), false);
    const critDamageValue = testAction.makeDamageValue(target.getBattler(), true);

    // we live risky- if the crit damage is bigger due to crit damage modifiers, then try that.
    if (critDamageValue > biggestCritDamage) {
      strongestSkillId = skillId;
      highestDamage = baseDamageValue;
      biggestCritDamage = critDamageValue;
      return;
    } 
    
    // if the crit isn't modified, then just go based on best base damage.
    if (baseDamageValue > highestDamage) {
      strongestSkillId = skillId;
      highestDamage = baseDamageValue;
      biggestCritDamage = critDamageValue;
    }
  });

  return strongestSkillId;
};
//#endregion full-force

//#region support
/**
 * Decides a skill id based on this ally's current AI mode.
 * This mode prioritizes keeping allies alive.
 * Support priorities = cleansing > healing > buffing.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number} The chosen support skill id to perform.
 */
JABS_AllyAI.prototype.decideSupport = function(availableSkills, healer) {
  let supportSkillId = 0;

  // if any have status ailments, prioritize that (including death).
  if (!supportSkillId) {
    supportSkillId = this.decideSupportCleansing(availableSkills, healer);
  }

  // then check the health of allies and prioritize that.
  if (!supportSkillId) {
    supportSkillId = this.decideSupportHealing(availableSkills, healer);
  }

  // lastly, if neither status nor health are necessary, check for and apply buffs/states.
  if (!supportSkillId) {
    supportSkillId = this.decideSupportBuffing(availableSkills, healer);
  }

  // if we still have no skill decided, then just do nothing.
  if (!supportSkillId) {
    return this.decideDoNothing();
  }
};

//#region support-cleansing
/**
 * Decides on the best cleansing skill from the selection of skills available.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideSupportCleansing = function(availableSkills, healer) {
  const nearbyAllies = healer.getAllNearbyAllies();
  let bestSkillId = 0;

  // iterate over all nearby allies.
  nearbyAllies.forEach(ally => {
    const allyBattler = ally.getBattler();

    // and check each of their states.
    const allyStates = allyBattler.states();
    if (allyStates.length > 0) {

      // the find the first one that we can cleanse.
      const cleansableState = allyStates.find(state => {
        const isNegative = state._j.negative; // skills to be cleansed have a "negative" tag.
        const canBeCleansed = this.determineBestSkillForStateCleansing(availableSkills, state.id);
        return isNegative && canBeCleansed;
      });

      // if we have a cleansable state, then return the best skill for it.
      if (cleansableState) {
        bestSkillId = this.determineBestSkillForStateCleansing(availableSkills, cleansableState.id);
      }
    }
  });

  return bestSkillId;
};

/**
 * Determines which skill of the available skills is the most effective for cleansing a given state.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {number} stateIdToBeCleansed The id of the state to be cleansed.
 * @returns {number}
 */
JABS_AllyAI.prototype.determineBestSkillForStateCleansing = function(availableSkills, stateIdToBeCleansed) {
   let bestSkillForStateCleansing = null;
   let highestCleanseRate = 0.0;

   // iterate over all skills available to find the best rate of state removal for the target state.
   availableSkills.forEach(skillId => {
    const skill = $dataSkills[skillId];

    // find all effects from a skill that remove states.
    const stateCleansingEffects = skill.effects.filter(fx => fx.code === 22 && fx.dataId === stateIdToBeCleansed);

    // if we have effects...
    if (stateCleansingEffects.length > 0) {

      // ...iterate over them to find the best rate of state removal.
      stateCleansingEffects.forEach(effect => {
        if (highestCleanseRate < effect.value1) {
          bestSkillForStateCleansing = skillId;
          highestCleanseRate = effect.value1;
        }
      });
    }
  });

  return bestSkillForStateCleansing;
};
//#endregion support-cleansing

//#region support-healing
/**
 * Decides on the best healing skill from the selection of skills available.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideSupportHealing = function(availableSkills, healer) {
  // filter out the skills that aren't for allies.
  const healingTypeSkills = availableSkills.filter(skillId => {
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

  // if there is only one healing-type skill, then just use that.
  if (healingTypeSkills.length === 1) {
    return healingTypeSkills[0];
  }

  // get all the low hp allies.
  let below60 = this.countLowHpAllies(healer);
  const lowestAllyBattler = lowestAlly.getBattler();
  const healerBattler = healer.getBattler();

  // depending on how many wounded targets we have, determine the best healing skill to use.
  if (below60 === 0) {
    // if we have no targets in need of healing, then don't.
    return bestSkillId;
  }

  if (below60 === 1) {
    // find the best fit healing skill for a single target.
    bestSkillId = this.bestFitHealingOneSkill(healingTypeSkills, healerBattler, lowestAllyBattler);
  } else if (below60 >= 2) {
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
JABS_AllyAI.prototype.determineLowestHpAlly = function(healer) {
  const nearbyAllies = healer.getAllNearbyAllies();

  // determine the lowest ally within range.
  let lowestAlly = null;
  nearbyAllies.forEach(ally => {
    if (!lowestAlly) {
      // if we don't yet have a lowest ally, assign it.
      lowestAlly = ally;
    } else if (ally.getBattler().currentHpPercent() < lowestAlly.getBattler().currentHpPercent()) {
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
JABS_AllyAI.prototype.countLowHpAllies = function(healer, threshold = 0.6) {
  const nearbyAllies = healer.getAllNearbyAllies();
  let belowThreshold = 0;
    // tally up the allies below the threshold % hp.
    nearbyAllies.forEach(ally => {
    if (ally.getBattler().currentHpPercent() < threshold) {
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
JABS_AllyAI.prototype.bestFitHealingOneSkill = function(healingTypeSkills, healerBattler, lowestAllyBattler) {
  let bestSkillId = 0;
  let smallestDifference = 99999999; // need it to be an unrealistically high difference to start.
  healingTypeSkills.forEach(skillId => {
    const skill = $dataSkills[skillId];
    const testAction = new Game_Action(healerBattler);
    testAction.setItemObject(skill);

    // get the test heal amount for this skill against the ally.
    const healAmount = Math.abs(testAction.makeDamageValue(lowestAllyBattler, false));

    // determine the difference between the closest healing to full and 
    const differenceFromMax = Math.abs((lowestAllyBattler.hp + healAmount) - lowestAllyBattler.mhp);
    if (differenceFromMax < smallestDifference) {
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
 JABS_AllyAI.prototype.bestFitHealingAllSkill = function(healingTypeSkills, healerBattler, lowestAllyBattler) {
  let bestSkillId = 0;

  // filter out all skills that are not for multiple targets.
  const multiTargetHealingTypeSkills = healingTypeSkills.filter(skillId => {
    const testAction = new Game_Action(healerBattler);
    testAction.setItemObject($dataSkills[skillId]);
    return testAction.isForAll();
  });

  // if we have no skills that are multi-targeting, then instead find the best single target.
  if (multiTargetHealingTypeSkills.length === 0) return this.bestFitHealingOneSkill();

  // if there is only one skill that multi-targets, then use that.
  if (multiTargetHealingTypeSkills.length === 1) return multiTargetHealingTypeSkills[0];

  let smallestDifference = 99999999; // need it to be an unrealistically high difference to start.
  multiTargetHealingTypeSkills.forEach(skillId => {
    const skill = $dataSkills[skillId];
    const testAction = new Game_Action(healerBattler);
    testAction.setItemObject(skill);

    // get the test heal amount for this skill against the ally.
    const healAmount = Math.abs(testAction.makeDamageValue(lowestAllyBattler, false));

    // determine the difference between the closest healing to full and 
    const differenceFromMax = Math.abs((lowestAllyBattler.hp + healAmount) - lowestAllyBattler.mhp);
    if (differenceFromMax < smallestDifference) {
      bestSkillId = skillId;
      smallestDifference = differenceFromMax;
    }
  });

  return bestSkillId;
};
//#endregion support-healing

//#region support-buffing
/**
 * Decides on the best buffing skill from the selection of skills available.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideSupportBuffing = function(availableSkills, healer) {
  const nearbyAllies = healer.getAllNearbyAllies();

  // iterate over all skills available to find a state that would benefit your allies.
  let bestSkillId = 0;
  let chosenAlly = null;
  availableSkills.forEach(skillId => {
    const skill = $dataSkills[skillId];

    // find all effects from a skill that add states.
    const stateAddingEffects = skill.effects.filter(fx => fx.code === 21);

    // if we have effects...
    if (stateAddingEffects.length > 0) {

      // ...iterate over them...
      let ready = false;
      stateAddingEffects.forEach(effect => {
        if (ready) return;

        // ...and check each ally and see if they have it yet.
        nearbyAllies.forEach(ally => {

          // see if the state for this ally is 
          const trackedState = $gameBattleMap.findStateTrackerByBattlerAndState(ally.getBattler(), effect.dataId);
          if (!trackedState || trackedState.isAboutToExpire()) {
            ready = true; // stop looking and use the below skill and target ally.
            bestSkillId = skillId;
            chosenAlly = ally;
          }
        });
      });
    }
  });

  // if we ended up deciding an ally, then set them for targeting.
  if (chosenAlly) {
    healer.setAllyTarget(chosenAlly);
  }

  return bestSkillId;
};
//#endregion support-buffing
//#endregion support

//#endregion decide action

//#region battle memory
/**
 * Handles a new memory for this battler's ally ai.
 * @param {JABS_BattleMemory} newMemory The new memory to handle.
 */
JABS_AllyAI.prototype.applyMemory = function(newMemory) {
  const memory = this.getMemory(newMemory.battlerId, newMemory.skillId);
  if (!memory) {
    this.addMemory(newMemory);
  } else {
    this.updateMemory(newMemory);
  }
};

/**
 * Gets a memory for a given battler id and skill id.
 * @param {number} battlerId The composite key of the battler id to find a memory for.
 * @param {number} skillId The composite key of the skill id to find a memory for.
 * @returns {JABS_BattleMemory}
 */
JABS_AllyAI.prototype.getMemory = function(battlerId, skillId) {
  return this.memory.find(mem => mem.battlerId === battlerId && mem.skillId === skillId);
};

/**
 * Adds a new battle memory to this ally ai.
 * @param {JABS_BattleMemory} newMemory The new memory to add to the collection.
 */
JABS_AllyAI.prototype.addMemory = function(newMemory) {
  this.memory.push(newMemory);
  this.memory.sort();
};

/**
 * Updates a battle memory with the new one.
 * @param {JABS_BattleMemory} newMemory The new memory to replace the old.
 */
JABS_AllyAI.prototype.updateMemory = function(newMemory) {
  let memory = this.getMemory(newMemory.battlerId, newMemory.skillId);
  memory = newMemory;
  this.memory.sort();
};
//#endregion battle memory
//#endregion JABS_AllyAI

//#region JABS_BattleMemory
/**
 * A class representing a single battle memory.
 * Battle memories are simply a mapping of the battler targeted, the skill used, and
 * the effectiveness of the skill on the target.
 * This is used when the AI decides which action to use.
 */
function JABS_BattleMemory() { this.initialize(...arguments); }
JABS_BattleMemory.prototype = {};
JABS_BattleMemory.prototype.constructor = JABS_BattleMemory;

/**
 * Initializes this class.
 * @param {number} battlerId The id of the battler the memory is built on.
 * @param {number} skillId The skill id executed against the battler.
 * @param {number} effectiveness The level of effectiveness of the skill used on this battler.
 * @param {boolean} damageApplied The damage applied to the target.
 */
JABS_BattleMemory.prototype.initialize = function(battlerId, skillId, effectiveness, damageApplied) {
  /**
   * The id of the battler targeted.
   * @type {number}
   */
  this.battlerId = battlerId;

  /**
   * The id of the skill executed.
   * @type {number}
   */
  this.skillId = skillId;

  /**
   * How elementally effective the skill was that was used on the given battler id.
   * @type {boolean}
   */
  this.effectiveness = effectiveness;

  /**
   * The damage dealt from this action.
   */
  this.damageApplied = damageApplied;
};

/**
 * Checks if this memory was an effective one.
 * @returns {boolean}
 */
JABS_BattleMemory.prototype.wasEffective = function() {
  return this.effectiveness >= 1;
};
//#endregion JABS_BattleMemory

//#region JABS_Battler
/**
 * Extends the engagement determination to handle aggro/passive party toggling.
 * @returns {boolean}
 */
J.ALLYAI.Aliased.JABS_Battler.shouldEngage = JABS_Battler.prototype.shouldEngage;
JABS_Battler.prototype.shouldEngage = function(distance) {
  if (this.isEnemy() || $gameParty.isAggro()) {
    // if this is an enemy, or the party is aggro and this isn't the player, do nothing different.
    return J.ALLYAI.Aliased.JABS_Battler.shouldEngage.call(this, distance);
  } else {
    // if this is an ally, use the ally engagement determination to see if this ally should engage.
    return this.shouldAllyEngage(distance);
  }
};

/**
 * A custom determination for seeing if an ally should engage it's nearest target or not.
 * @param {number} distance The distance from this battler to the nearest potential target.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldAllyEngage = function(distance) {
  const inSight = this.inSightRange(distance);
  const shouldEngage = (this.isAlerted() || $gameBattleMap.getPlayerMapBattler().hasBattlerLastHit());
  return inSight && shouldEngage;
};
//#endregion JABS_Battler
//#endregion JABS objects

//#region Scene objects
/**
 * Extends the JABS menu initialization to include the new ally ai management selection.
 */
J.ALLYAI.Aliased.Scene_Map.initJabsMembers = Scene_Map.prototype.initJabsMembers;
Scene_Map.prototype.initJabsMembers = function() {
  J.ALLYAI.Aliased.Scene_Map.initJabsMembers.call(this);
  this.initAllyAiSubmenu();
};

/**
 * Initializes the new windows for ally ai management.
 */
Scene_Map.prototype.initAllyAiSubmenu = function() {
  this._j._absMenu._allyAiPartyWindow = null;
  this._j._absMenu._allyAiEquipWindow = null;
  this._j._absMenu._allyAiActorId = 0;
};

/**
 * Sets the chosen actor id to the provided id.
 * @param {number} chosenActorId The id of the chosen actor.
 */
Scene_Map.prototype.setAllyAiActorId = function(chosenActorId) {
  this._j._absMenu._allyAiActorId = chosenActorId;
};

/**
 * Gets the chosen actor id.
 */
Scene_Map.prototype.getAllyAiActorId = function() {
  return this._j._absMenu._allyAiActorId;
};

/**
 * Extends the JABS menu creation to include the new windows for ally ai management.
 */
J.ALLYAI.Aliased.Scene_Map.createJabsAbsMenu = Scene_Map.prototype.createJabsAbsMenu;
Scene_Map.prototype.createJabsAbsMenu = function() {
  J.ALLYAI.Aliased.Scene_Map.createJabsAbsMenu.call(this);
  this.createAllyAiPartyWindow();
  this.createAllyAiEquipWindow();
};

/**
 * Extends the JABS menu creation to include a new command handler for ally ai.
 */
J.ALLYAI.Aliased.Scene_Map.createJabsAbsMenuMainWindow = Scene_Map.prototype.createJabsAbsMenuMainWindow;
Scene_Map.prototype.createJabsAbsMenuMainWindow = function() {
  J.ALLYAI.Aliased.Scene_Map.createJabsAbsMenuMainWindow.call(this);
  this._j._absMenu._mainWindow.setHandler("ally-ai", this.commandManagePartyAi.bind(this));
};

/**
 * Creates the window that lists all active members of the party.
 */
Scene_Map.prototype.createAllyAiPartyWindow = function() {
  const w = 400;
  const h = 250;
  const x = Graphics.boxWidth - w;
  const y = 100;
  const rect = new Rectangle(x, y, w, h);
  const aiPartyMenu = new Window_AbsMenuSelect(rect, "ai-party-list");
  aiPartyMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "ai-party-list"));
  aiPartyMenu.setHandler("party-member", this.commandSelectMemberAi.bind(this));
  aiPartyMenu.setHandler("aggro-passive-toggle", this.commandAggroPassiveToggle.bind(this));
  this._j._absMenu._allyAiPartyWindow = aiPartyMenu;
  this._j._absMenu._allyAiPartyWindow.close();
  this._j._absMenu._allyAiPartyWindow.hide();
  this.addWindow(this._j._absMenu._allyAiPartyWindow);
};

/**
 * Creates a window that lists all available ai modes that the chose ally can use.
 */
Scene_Map.prototype.createAllyAiEquipWindow = function() {
  const w = 400;
  const h = 250;
  const x = Graphics.boxWidth - w;
  const y = 100;
  const rect = new Rectangle(x, y, w, h);
  const aiMemberMenu = new Window_AbsMenuSelect(rect, "select-ai");
  aiMemberMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "select-ai"));
  aiMemberMenu.setHandler("select-ai", this.commandEquipMemberAi.bind(this));
  this._j._absMenu._allyAiEquipWindow = aiMemberMenu;
  this._j._absMenu._allyAiEquipWindow.close();
  this._j._absMenu._allyAiEquipWindow.hide();
  this.addWindow(this._j._absMenu._allyAiEquipWindow);
};

/**
 * When the "manage ally ai" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandManagePartyAi = function() {
  this._j._absMenu._windowFocus = "ai-party-list";
  return;
};

/**
 * When an individual party member is chosen, it prioritizes the AI mode selection window.
 */
Scene_Map.prototype.commandSelectMemberAi = function() {
  this._j._absMenu._windowFocus = "select-ai";
  const actorId = this._j._absMenu._allyAiPartyWindow.currentExt();
  this.setAllyAiActorId(actorId);
  this._j._absMenu._allyAiEquipWindow.setActorId(actorId);
  this._j._absMenu._allyAiEquipWindow.refresh();
  return;
};

/**
 * Toggles the party-wide aggro/passive switch.
 * Passive switch will only target the leader's current target.
 * Aggro switch will enable full sight range and auto-engaging abilities.
 */
Scene_Map.prototype.commandAggroPassiveToggle = function() {
  SoundManager.playRecovery();
  $gameParty.isAggro()
    ? $gameParty.becomePassive()
    : $gameParty.becomeAggro();
  this._j._absMenu._allyAiPartyWindow.refresh();
};

/**
 * When an ai mode is chosen, it replaces it for the actor.
 */
Scene_Map.prototype.commandEquipMemberAi = function() {
  //this._j._absMenu._windowFocus = "select-ai";
  const newMode = this._j._absMenu._allyAiEquipWindow.currentExt();
  const allyAi = $gameActors.actor(this.getAllyAiActorId()).getAllyAI();
  allyAi.changeMode(newMode);
  this._j._absMenu._allyAiEquipWindow.refresh();
  return;
};

/**
 * Manages the ABS main menu's interactivity.
 */
J.ALLYAI.Aliased.Scene_Map.manageAbsMenu = Scene_Map.prototype.manageAbsMenu;
Scene_Map.prototype.manageAbsMenu = function() {
  J.ALLYAI.Aliased.Scene_Map.manageAbsMenu.call(this);
  switch (this._j._absMenu._windowFocus) {
    case "ai-party-list":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._allyAiPartyWindow.show();
      this._j._absMenu._allyAiPartyWindow.open();
      this._j._absMenu._allyAiPartyWindow.activate();
      break;
    case "select-ai":
      this._j._absMenu._allyAiPartyWindow.hide();
      this._j._absMenu._allyAiPartyWindow.close();
      this._j._absMenu._allyAiPartyWindow.deactivate();
      this._j._absMenu._allyAiEquipWindow.show();
      this._j._absMenu._allyAiEquipWindow.open();
      this._j._absMenu._allyAiEquipWindow.activate();
      break;
  }
};

/**
 * Closes a given Abs menu window.
 * @param {string} absWindow The type of abs window being closed.
 */
J.ALLYAI.Aliased.Scene_Map.closeAbsWindow = Scene_Map.prototype.closeAbsWindow;
Scene_Map.prototype.closeAbsWindow = function(absWindow) {
  J.ALLYAI.Aliased.Scene_Map.closeAbsWindow.call(this, absWindow);
  switch (absWindow) {
    case "ai-party-list":
      this._j._absMenu._allyAiPartyWindow.hide();
      this._j._absMenu._allyAiPartyWindow.close();
      this._j._absMenu._allyAiPartyWindow.deactivate();
      this._j._absMenu._mainWindow.activate();
      this._j._absMenu._mainWindow.open();
      this._j._absMenu._mainWindow.show();
      this._j._absMenu._windowFocus = "main";
      break;
    case "select-ai":
      this._j._absMenu._allyAiEquipWindow.hide();
      this._j._absMenu._allyAiEquipWindow.close();
      this._j._absMenu._allyAiEquipWindow.deactivate();
      this._j._absMenu._allyAiPartyWindow.activate();
      this._j._absMenu._allyAiPartyWindow.open();
      this._j._absMenu._allyAiPartyWindow.show();
      this._j._absMenu._windowFocus = "ai-party-list";
      break;
  }
};
//#endregion Scene objects

//#region Window objects
//#region Window_AbsMenu
/**
 * Extends the JABS quick menu to include ally ai management.
 */
J.ALLYAI.Aliased.Window_AbsMenu.makeCommandList = Window_AbsMenu.prototype.makeCommandList;
Window_AbsMenu.prototype.makeCommandList = function() {
  J.ALLYAI.Aliased.Window_AbsMenu.makeCommandList.call(this);
  if (!$dataSystem) return;

  // TODO: add a switch lever here for enable/disable the visibility of the command as a whole.

  // TODO: parameterize these defaults.
  // if followers aren't being used, then this command will be disabled.
  const enabled = $gamePlayer.followers().isVisible();
  const newCommand = { name: 'Assign Ally AI', symbol: 'ally-ai', enabled: enabled, ext: null, icon: 2564 };
  this._list.splice(this._list.length-2, 0, newCommand);
};
//#endregion Window_AbsMenu

//#region Window_AbsMenuSelect
/**
 * Extends the initialization to include the actor id for ai management.
 */
J.ALLYAI.Aliased.Window_AbsMenuSelect.initialize = Window_AbsMenuSelect.prototype.initialize;
Window_AbsMenuSelect.prototype.initialize = function(rect, type) {
  J.ALLYAI.Aliased.Window_AbsMenuSelect.initialize.call(this, rect, type);
  this._j._chosenActorId = 0;
};

/**
 * Sets the actor id assigned to this window.
 * @param {number} actorId The new actor id for this window.
 */
Window_AbsMenuSelect.prototype.setActorId = function(actorId) {
  this._j._chosenActorId = actorId;
};

/**
 * Gets the actor id assigned to this window, if any.
 * @returns {number}
 */
Window_AbsMenuSelect.prototype.getActorId = function() {
  return this._j._chosenActorId;
};

/**
 * Extends the JABS quick menu select to also handle ai management.
 */
J.ALLYAI.Aliased.Window_AbsMenuSelect.makeCommandList = Window_AbsMenuSelect.prototype.makeCommandList;
Window_AbsMenuSelect.prototype.makeCommandList = function() {
  J.ALLYAI.Aliased.Window_AbsMenuSelect.makeCommandList.call(this);
  switch (this._j._menuType) {
    case "ai-party-list":
      this.makeAllyList();
      break;
    case "select-ai":
      this.makeAllyAiModeList();
      break;
  }
};

/**
 * Draws the list of available AI modes that an ally can use.
 */
Window_AbsMenuSelect.prototype.makeAllyList = function() {
  const party = $gameParty.allMembers();
  party.forEach(member => {
    this.addCommand(member.name(), "party-member", true, member.actorId());
  });

  // TODO: parameterize these things.
  const aggroPassiveCommandName = $gameParty.isAggro() ? `Aggro Enabled` : `Passive Enabled`;
  const aggroPassiveCommandIcon = $gameParty.isAggro() ? 15 : 4;
  this.addCommand(aggroPassiveCommandName, "aggro-passive-toggle", true, null, aggroPassiveCommandIcon);
};

/**
 * Draws the list of available AI modes that an ally can use.
 */
Window_AbsMenuSelect.prototype.makeAllyAiModeList = function() {
  const currentActor = $gameActors.actor(this.getActorId());
  if (!currentActor) return;

  const modes = JABS_AllyAI.getModes();
  const equippedModeIcon = 91;
  const currentAi = currentActor.getAllyAI();

  modes.forEach(mode => {
    const isEquipped = currentAi.getMode() === mode;
    const iconIndex = isEquipped ? equippedModeIcon : 95;
    this.addCommand(mode, "select-ai", true, mode, iconIndex);
  });
};
//#endregion Window_AbsMenuSelect
//#endregion Window objects

//ENDOFFILE