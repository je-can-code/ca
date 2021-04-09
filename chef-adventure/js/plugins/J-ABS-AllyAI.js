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
J.ALLYAI.Metadata.Name = `J-AllyAI`;
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
};
//#endregion plugin setup and configuration

//#region Game objects
//#region Game_Map
/**
 * Parses out all enemies from the array of events on the map.
 * @param {Game_Event[]} evs An array of events.
 * @returns {JABS_Battler[]} A `Game_Enemy[]`.
 */
J.ALLYAI.Aliased.Game_Map.parseBattlers = Game_Map.prototype.parseBattlers;
Game_Map.prototype.parseBattlers = function() {
  const original = J.ALLYAI.Aliased.Game_Map.parseBattlers.call(this);
  const allies = this.convertAllFollowers();
  const allyBattlers = allies.map(this.convertOneFollower);
  console.log(allyBattlers);
  return original;
};

Game_Map.prototype.convertAllFollowers = function() {
  const followers = $gamePlayer.followers().data();
return followers.filter(follower => follower.actor());
};

Game_Map.prototype.convertOneFollower = function(follower) {
  const battler = follower.actor();
  const coreBattlerData = new JABS_BattlerCoreData(
    battler.actorId(),    // battler id
    0,                    // team id
    new JABS_BattlerAI(), // battler AI
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
  return mapBattler;
};
//#endregion Game_Map
//#endregion Game objects

//ENDOFFILE