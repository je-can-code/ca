//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 ABS-SPEED] Enable modifying move speeds.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * Please refer to J-ABS-Speed's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/abs/ext/speed/index.md
 * ============================================================================
 */
//endregion annotations

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
	const requiredBaseVersion = "3.19.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.13.0";
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
J.ABS.EXT.SPEED.Metadata = new J_SpeedPluginMetadata("J-ABS-Speed", "1.2.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.SPEED.Aliased = {
	Scene_Boot: new Map(),
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
J.ABS.EXT.SPEED.RegExp = {
	WalkSpeedBoost: /<speedBoost:[ ]?([-]?\d+)>/gi,
	WalkSpeedBoostBuffPlus: /<msbBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	WalkSpeedBoostBuffRate: /<msbBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	WalkSpeedBoostGrowthPlus: /<msbGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	WalkSpeedBoostGrowthRate: /<msbGrowthRate:\[([+\-*/ ().\w]+)]>/gi
};

//#endregion
//#region src/plugins/abs/ext/speed/database/RPG_Base.js
/**
* The movement speed modifier from this from database object.
* @type {number|null}
*/
Object.defineProperty(RPG_Base.prototype, "jabsSpeedBoost", { get: function() {
	return RPGManager.getSumFromNoteByRegex(this, J.ABS.EXT.SPEED.RegExp.WalkSpeedBoost, true);
} });

//#endregion
//#region src/plugins/abs/ext/speed/managers/IconManager.js
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
* Gets the proper name of "move speed boost".
* @returns {string}
*/
TextManager.movespeed = function() {
	return "Move Boost";
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
* Extends {@link #onBattlerDataChange}.<br/>
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
* Extends {@link Game_Battler.initMembers}.<br/>
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
* Move speed boost from notes and SDP panels.
*/
Object.defineProperty(Game_BattlerBase.prototype, "msb", {
	get: function() {
		return 0;
	},
	configurable: true
});
Object.defineProperty(Game_Battler.prototype, "msb", {
	get: function() {
		const walkBoost = this.walkSpeedBoost();
		const naturalBonus = this.naturalBonus("msb");
		return walkBoost + naturalBonus;
	},
	configurable: true
});
/**
* Gets the walking speed boost this battler's own tags produce, before natural bonuses.<br/>
* This is what move speed's natural tags see as their base.
* @returns {number}
*/
Game_Battler.prototype.walkSpeedBoost = function() {
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
* Extends {@link Game_Character.distancePerFrame}.<br/>
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
	const scale = battler.getBattler().msb;
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
* Extends {@link #onBattlerDataChange}.<br/>
* Refreshes movement speed boosts when the battler's data changes.
*/
J.ABS.EXT.SPEED.Aliased.Game_Enemy.set("onBattlerDataChange", Game_Enemy.prototype.onBattlerDataChange);
Game_Enemy.prototype.onBattlerDataChange = function() {
	J.ABS.EXT.SPEED.Aliased.Game_Enemy.get("onBattlerDataChange").call(this);
	this.refreshSpeedBoosts();
};

//#endregion
//#region src/plugins/abs/ext/speed/core/registerSpeedParameters.js
/**
* Boot-time registration for J-ABS-Speed parameters in {@link ParameterRegistry}.
*/
var SpeedParameterRegistration = class {
	/**
	* Registers move speed boost with the parameter catalog.
	*/
	static registerAll() {
		const moveSpeedBoost = ParameterDefinition.Builder().key("msb").group(ParameterGroups.SUPPORT).sortOrder(2).label(() => TextManager.movespeed()).description(() => TextManager.moveSpeedDescription()).iconIndex(() => IconManager.movespeed()).format(ParameterFormat.FLAT).getValue((battler) => battler.msb).sdpBinding(SdpParameterBinding.byKey("msb", () => 0)).build();
		ParameterRegistry.register(moveSpeedBoost);
		const moveSpeedNatural = new NaturalParameterBinding(J.ABS.EXT.SPEED.RegExp.WalkSpeedBoostBuffPlus, J.ABS.EXT.SPEED.RegExp.WalkSpeedBoostBuffRate, J.ABS.EXT.SPEED.RegExp.WalkSpeedBoostGrowthPlus, J.ABS.EXT.SPEED.RegExp.WalkSpeedBoostGrowthRate, (battler) => battler.walkSpeedBoost());
		ParameterRegistry.bindNatural("msb", moveSpeedNatural);
	}
};

//#endregion
//#region src/plugins/abs/ext/speed/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Registers J-ABS-Speed stats with the parameter catalog after vanilla seeding.
*/
J.ABS.EXT.SPEED.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.ABS.EXT.SPEED.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	SpeedParameterRegistration.registerAll();
};

//#endregion
//# sourceMappingURL=J-ABS-Speed.js.map