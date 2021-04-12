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
//#endregion Introduction

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
  Game_Battler: {},
  Game_Character: {},
  Game_CharacterBase: {},
  Game_Event: {},
  Game_Follower: {},
  Game_Followers: {},
  Game_Map: {},
  Game_Player: {},
  JABS_AiManager: {},
};
//#endregion plugin setup and configuration

//#region Game objects
Game_Actor.prototype.prepareTime = function() {

};
//#region Game_BattleMap
J.ALLYAI.Aliased.Game_Follower.chaseCharacter = Game_Follower.prototype.chaseCharacter;
Game_BattleMap.prototype.performPartyCycling = function() {
  // determine which battler in the party is the next living battler.
  const nextLivingAllyIndex = $gameParty._actors.findIndex((actorId, index) => {
    if (index === 0) return false; // don't look at the current leader.
    return !$gameActors.actor(actorId).isDead();
  });

  // can't cycle if there are no living/valid members.
  if (nextLivingAllyIndex === -1) return;

  // when cycling, jump all followers to the player.
  $gamePlayer.followers().data().forEach(follower => follower.jumpToPlayer());

  // swap to the next party member in the sequence.
  const nextUuid = $gameParty.members()[nextLivingAllyIndex].getUuid();
  const nextJabsBattler = $gameBattleMap.getBattlerByUuid(nextUuid);
  $gameParty._actors = $gameParty._actors.concat($gameParty._actors.splice(0, nextLivingAllyIndex));
  $gamePlayer.refresh();
  $gamePlayer.requestAnimation(40, false);

  // recreate the JABS player battler and set it to the player character.
  nextJabsBattler.setCharacter($gamePlayer);
  this._playerBattler = nextJabsBattler;
  const newPlayer = this.getPlayerMapBattler().getCharacter();
  newPlayer.setMapBattler(this._playerBattler.getUuid());

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
Game_Followers.prototype.isVisible = function() {
  // TODO: update this to be OK with toggling followers.
  return true;
};

/**
 * OVERWRITE Adjust the jumpAll function to prevent jumping to the player
 * when the player is hit.
 */
Game_Followers.prototype.jumpAll = function() {
  if ($gamePlayer.isJumping()) {
    for (const follower of this._data) {
      // skip followers that don't exist.
      if (!follower || !follower.actor()) return;

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
 *
 * TODO: Update this to disengage if the player is too far away.
 * @param {Game_Character} character The character this follower is following.
 */
J.ALLYAI.Aliased.Game_Follower.chaseCharacter = Game_Follower.prototype.chaseCharacter;
Game_Follower.prototype.chaseCharacter = function(character) {
  // if we're talking about the ghost followers, then let them do default things.
  if (!this.isVisible()) {
    J.ALLYAI.Aliased.Game_Follower.chaseCharacter.call(this, character);
    return;
  }

  const distanceToPlayer = $gameMap.distance(this._realX, this._realY, $gamePlayer._realX, $gamePlayer._realY);
  const battler = this.getMapBattler();
  if (!this.getMapBattler().isEngaged()) {
    // if the battler isn't engaged, still follow the player.
    J.ALLYAI.Aliased.Game_Follower.chaseCharacter.call(this, character);
    if (distanceToPlayer <= 5) {
      // if the ally is within
      battler.unlockEngagement();
    }
    return;
  } else {
    // if the battler is engaged, make sure they stay within range of the player.
    if (distanceToPlayer > 10) {
      // when the ally is too far away from the player, disengage and prevent further engagement.
      battler.disengageTarget();
      battler.lockEngagement();
      battler.resetAllAggro();
      this.jumpToPlayer();
    }
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

J.ALLYAI.Aliased.Game_Follower.update = Game_Follower.prototype.update;
Game_Follower.prototype.update = function() {
  J.ALLYAI.Aliased.Game_Follower.update.call(this);
  if ($gameBattleMap.requestPartyRotation) {
    console.log("rotating!");
  }
};
//#endregion Game_Follower

//#region Game_Map
/**
 * Parses out all enemies from the array of events on the map.
 * @param {Game_Event[]} evs An array of events.
 * @returns {JABS_Battler[]} A `Game_Enemy[]`.
 */
J.ALLYAI.Aliased.Game_Map.parseBattlers = Game_Map.prototype.parseBattlers;
Game_Map.prototype.parseBattlers = function() {
  const mapBattlers = J.ALLYAI.Aliased.Game_Map.parseBattlers.call(this);
  return mapBattlers.concat(this.parseAllyBattlers());
};

/**
 * Updates all ally battlers in-place.
 * For use with party-cycling.
 */
Game_Map.prototype.updateAllies = function() {
  const allyJabsBattlers = this._j._allBattlers.filter(battler => battler.isActor());
  if (!allyJabsBattlers.length) return;

  // first remove all battlers.
  this.removeBattlers(allyJabsBattlers);

  // then re-add the updated ones.
  this.addBattlers(this.parseAllyBattlers());
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
  battlers.forEach(battler => {
    const foundIndex = this._j._allBattlers.findIndex(allBattler => allBattler.getUuid() === battler.getUuid());
    if (foundIndex) {
      this._j._allBattlers.splice(foundIndex, 1);
    }
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
  return followers.filter(follower => follower.actor());
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
    4,                    // alerted sight boost
    6,                    // pursuit range
    6,                    // alerted pursuit boost
    300,                  // alert duration
    false,                // can move idly
    true,                 // show hp bar
    false,                // show danger indicator
    false,                // show name
    false,                // is invincible
    false);               // is inanimate
  const mapBattler = new JABS_Battler(follower, battler, coreBattlerData);
  follower.setMapBattler(mapBattler.getUuid());
  return mapBattler;
};
//#endregion Game_Map
//#endregion Game objects

//#region JABS objects
//#region JABS_AiManager
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
 * @param {JABS_Battler} enemyBattler The ally battler deciding the action.
 */
JABS_AiManager.decideAllyAiPhase2Action = function(allyBattler) {
  // TODO: setup logic for allies to decide actions.
  const battler = allyBattler.getBattler();
  const validSkillSlots = battler.getValidEquippedSkillSlots();
  const chosenSkillSlot = validSkillSlots[Math.randomInt(validSkillSlots.length)];
  const chosenSkillId = battler.getEquippedSkill(chosenSkillSlot);
  this.setupAllyActionForNextPhase(allyBattler, chosenSkillId, chosenSkillSlot);
};

/**
 * Sets up the battler and the action in preparation for the next phase.
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
//#endregion JABS objects

//ENDOFFILE