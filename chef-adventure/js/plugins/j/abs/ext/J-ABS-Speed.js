//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.3 MOVE] Enable modifying move speeds.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables modifications of movespeed for characters on the map.
 *
 * This plugin requires JABS.
 * This plugin requires no plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The new parameter of "movement speed boost" is a calculated parameter that
 * gets cached when things change on battlers.
 * ============================================================================
 * MOVEMENT SPEED BOOST:
 * Have you ever wanted to have your battlers on the map move a little bit
 * slower or faster when afflicted with haste or wearing heavy boots, etc?
 * Well now you can! By applying the appropriate tag to various database
 * locations, you can control how fast or slow the battler's movement speed
 * is while on the map.
 *
 * NOTE1:
 * Multiple tags across multiple objects on a single battler will stack
 * additively.
 *
 * NOTE2:
 * There is no upper limit of move speed, so be careful!
 * There is a(n arbitrary) lower limit, of -90% move speed multiplier.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <speedBoost:NUM>
 * Where NUM is the positive/negative percent modifier against base movespeed.
 *
 * EXAMPLE:
 *  <speedBoost:40>
 * This battler's movement speed will be increased by ~40%.
 *
 *  <speedBoost:-26>
 * This battler's movement speed will be decreased by ~26%.
 *
 *  <speedBoost:11>
 * This battler's movement speed will be increased by ~11%.
 *
 *  <speedBoost:70>
 *  <speedBoost:-50>
 *  <speedBoost:-10>
 *  <speedBoost:30>
 * This battler's movement speed will be increased by ~40%.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.3
 *    Raised minimum J-ABS version requirement to 4.7.0.
 * - 1.0.2
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.1
 *    Consumed `RPGManager` update.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//#region src/plugins/abs/ext/speed/_metadata/_pluginMetadata.js
var J_SpeedPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/abs/ext/speed/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.6.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (!hasJabsRequirement) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension plugin.
*/
J.ABS.EXT.SPEED = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.SPEED.Metadata = new J_SpeedPluginMetadata("J-ABS-SpeedBoosts", "1.0.3");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.SPEED.Aliased = {
	Game_Actor: new Map(),
	Game_Character: new Map(),
	Game_Battler: new Map(),
	Game_Enemy: new Map(),
	TextManager: new Map(),
	IconManager: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.SPEED.RegExp = { WalkSpeedBoost: /<speedBoost:[ ]?([-]?\d+)>/gi };

//#endregion
//#region src/plugins/abs/ext/speed/database/RPG_Base.js
/**
* The movement speed modifier from this from database object.
* @type {number|null}
*/
Object.defineProperty(RPG_Base.prototype, "jabsSpeedBoost", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.SPEED.RegExp.WalkSpeedBoost, true);
} });

//#endregion
//#region src/plugins/abs/ext/speed/managers/IconManager.js
/**
* Extend {@link #longParam}.<br>
* First checks if the paramId was the move speed boost, then checks others.
*/
J.ABS.EXT.SPEED.Aliased.IconManager.set("longParam", IconManager.longParam);
IconManager.longParam = function(paramId) {
	switch (paramId) {
		case 31: return this.movespeed();
		default: return J.ABS.EXT.SPEED.Aliased.IconManager.get("longParam").call(this, paramId);
	}
};
/**
* Gets the icon index for the move speed boost.
* @returns {number}
*/
IconManager.movespeed = function() {
	return 978;
};

//#endregion
//#region src/plugins/abs/ext/speed/managers/TextManager.js
/**
* Extends {@link #longParam}.<br>
* First checks if this is the move speed parameter, then checks others.
*/
J.ABS.EXT.SPEED.Aliased.TextManager.set("longParam", TextManager.longParam);
TextManager.longParam = function(paramId) {
	switch (paramId) {
		case 31: return this.movespeed();
		default: return J.ABS.EXT.SPEED.Aliased.TextManager.get("longParam").call(this, paramId);
	}
};
/**
* Gets the proper name of "move speed boost".
* @returns {string}
*/
TextManager.movespeed = function() {
	return "Move Boost";
};
/**
* Extends {@link #longParamDescription}.<br>
* First checks if this is the move speed parameter, then checks others.
*/
J.ABS.EXT.SPEED.Aliased.TextManager.set("longParamDescription", TextManager.longParamDescription);
TextManager.longParamDescription = function(paramId) {
	switch (paramId) {
		case 31: return this.moveSpeedDescription();
		default: return J.ABS.EXT.SPEED.Aliased.TextManager.get("longParamDescription").call(this, paramId);
	}
};
/**
* Gets the description text for the move speed boost.
* @returns {string[]}
*/
TextManager.moveSpeedDescription = function() {
	return ["The percentage modifier against this character's base movespeed.", "Higher amounts of this result in faster walk and run speeds."];
};

//#endregion
//#region src/plugins/abs/ext/speed/objects/Game_Actor.js
/**
* Extends {@link #onBattlerDataChange}.<br>
* Refreshes movement speed boosts when the battler's data changes.
*/
J.ABS.EXT.SPEED.Aliased.Game_Actor.set("onBattlerDataChange", Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function() {
	J.ABS.EXT.SPEED.Aliased.Game_Actor.get("onBattlerDataChange").call(this);
	this.refreshSpeedBoosts();
};

//#endregion
//#region src/plugins/abs/ext/speed/objects/Game_Battler.js
/**
* Extends {@link Game_Battler.initMembers}.<br>
*/
J.ABS.EXT.SPEED.Aliased.Game_Battler.set("initMembers", Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function() {
	J.ABS.EXT.SPEED.Aliased.Game_Battler.get("initMembers").call(this);
	this.initSpeedBoosts();
};
/**
* Initializes the members for movement speed boosts.
*/
Game_Battler.prototype.initSpeedBoosts = function() {
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with JABS.
	*/
	this._j._abs ||= {};
	/**
	* A grouping of all JABS properties associated with the speed boosts.
	*/
	this._j._abs._speed = {};
	/**
	* The cached value for speed boosts modifier.
	* @type {number}
	*/
	this._j._abs._speed._walkBoost = 0;
};
/**
* Gets the current walking speed boost scale for this battler.
* @returns {number}
*/
Game_Battler.prototype.getWalkSpeedBoosts = function() {
	return this._j._abs._speed._walkBoost;
};
/**
* Sets the current speed bost scale for this battler.
* @param {number} amount The new walking speed boost amount.
*/
Game_Battler.prototype.setWalkSpeedBoost = function(amount) {
	this._j._abs._speed._walkBoost = amount;
};
/**
* Updates the speed boost scale for this battler based on available notes.
*/
Game_Battler.prototype.refreshSpeedBoosts = function() {
	let speedBoosts = 0;
	const objectsToCheck = this.getAllNotes();
	objectsToCheck.filter((obj) => obj.jabsSpeedBoost).forEach((obj) => speedBoosts += obj.jabsSpeedBoost);
	this.setWalkSpeedBoost(speedBoosts);
};

//#endregion
//#region src/plugins/abs/ext/speed/objects/Game_Character.js
/**
* Extends {@link Game_Character.distancePerFrame}.<br>
* Enables modification of the character's movement speed on the map.
* @return {number} The modified distance per frame to move.
*/
J.ABS.EXT.SPEED.Aliased.Game_Character.set("distancePerFrame", Game_Character.prototype.distancePerFrame);
Game_Character.prototype.distancePerFrame = function() {
	const base = J.ABS.EXT.SPEED.Aliased.Game_Character.get("distancePerFrame").call(this);
	const bonus = this.calculateSpeedBoostBonus(base);
	const total = base + bonus;
	const constrainedTotal = Math.max(total, this.minimumDistancePerFrame());
	return constrainedTotal;
};
/**
* Determines the bonus (or penalty) move speed for the player based on equipment.
* @param {number} baseMoveSpeed The base distance per frame.
*/
Game_Character.prototype.calculateSpeedBoostBonus = function(baseMoveSpeed) {
	const battler = this.getJabsBattler();
	if (!battler) return 0;
	const scale = battler.getBattler().getWalkSpeedBoosts();
	if (scale === 0) return 0;
	const constrainedScale = Math.max(this.minimumWalkSpeedBoost(), scale);
	const multiplier = constrainedScale / 100;
	const calculatedMoveSpeed = baseMoveSpeed * multiplier;
	return calculatedMoveSpeed;
};
Game_Character.prototype.minimumWalkSpeedBoost = function() {
	return -90;
};
/**
* Gets the minimum distance to move per frame.
* @returns {number}
*/
Game_Character.prototype.minimumDistancePerFrame = function() {
	const minimumDistance = .015625;
	return minimumDistance;
};

//#endregion
//#region src/plugins/abs/ext/speed/objects/Game_Enemy.js
/**
* Extends {@link #onBattlerDataChange}.<br>
* Refreshes movement speed boosts when the battler's data changes.
*/
J.ABS.EXT.SPEED.Aliased.Game_Enemy.set("onBattlerDataChange", Game_Enemy.prototype.onBattlerDataChange);
Game_Enemy.prototype.onBattlerDataChange = function() {
	J.ABS.EXT.SPEED.Aliased.Game_Enemy.get("onBattlerDataChange").call(this);
	this.refreshSpeedBoosts();
};

//#endregion
//# sourceMappingURL=J-ABS-Speed.js.map