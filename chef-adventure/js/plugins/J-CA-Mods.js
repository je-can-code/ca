 //#region Initialization
 /*:
 * @target MZ
 * @plugindesc 
 * Mods exclusive to Chef Adventure.
 * @author JE
 * @url https://dev.azure.com/je-can-code/RPG%20Maker/_git/rmmz
 * @help
 * These modifications of code are exclusive to Chef Adventure.
 */
 /**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CAMods = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CAMods.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-CA-Mods`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.CAMods.PluginParameters = PluginManager.parameters(J.CAMods.Metadata.Name);
J.CAMods.Metadata = {
  ...J.CAMods.Metadata,
  /**
   * The version of this plugin.
   */
  Version: 1.00,
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.CAMods.Aliased = {
  Game_Actor: {},
  Game_Player: {},
};
//#endregion Initialization

//#region Game objects
//#region Game_Actor
/**
 * Extends the base slots provided to have a duplicate of the 5th type (accessory).
 */
J.CAMods.Aliased.Game_Actor.equipSlots = Game_Actor.prototype.equipSlots;
Game_Actor.prototype.equipSlots = function() {
  const baseSlots = J.CAMods.Aliased.Game_Actor.equipSlots.call(this);
  baseSlots.push(5);
  return baseSlots;
};
//#endregion Game_Actor

//#region Game_Player
/**
 * Hooks into the distance per frame algorithm and extends it for custom move speeds
 * based on equipment for the player.
 * @return {number} The modified distance per frame to move.
 */
J.CAMods.Aliased.Game_Player.distancePerFrame = Game_Player.prototype.distancePerFrame;
Game_Player.prototype.distancePerFrame = function() {
  const base = J.CAMods.Aliased.Game_Player.distancePerFrame.call(this);
  const caOnlyBonus = 1.12;
  return (base * caOnlyBonus);
};
//#endregion Game_Player

//#endregion Game objects

/**
 * OVERWRITE Removes the buttons on the map/screen.
 */
Scene_Map.prototype.createButtons = function() {
  return;
};