//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.3 ABS-TIMING] Enable modifying cooldowns/casting for actions.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * Please refer to J-ABS-Timing's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/abs/ext/timing/index.md
 * ============================================================================
 *
 * @param castTimeConfigs
 * @text CAST TIME DEFAULTS
 *
 * @param baseCastSpeed
 * @parent castTimeConfigs
 * @type number
 * @text Base Cast Speed
 * @desc The base cast speed modifier applied to all battlers before tags. Positive = slower, negative = faster.
 * @default 0
 *
 * @param minimumCastTime
 * @parent castTimeConfigs
 * @type number
 * @text Minimum Cast Time
 * @desc The minimum number of frames a cast time can be reduced to.
 * @default 0
 *
 * @param cooldownConfigs
 * @text COOLDOWN DEFAULTS
 *
 * @param baseFastCooldown
 * @parent cooldownConfigs
 * @type number
 * @text Base Fast Cooldown
 * @desc The base fast cooldown modifier applied to all battlers before tags. Positive = slower, negative = faster.
 * @default 0
 *
 * @param minimumCooldown
 * @parent cooldownConfigs
 * @type number
 * @text Minimum Cooldown
 * @desc The minimum number of frames a cooldown can be reduced to.
 * @default 0
 */
//endregion annotations

//#region src/plugins/abs/ext/timing/_metadata/_pluginMetadata.js
var J_TimingPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps cast/cooldown tuning from plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The base cast speed modifier applied globally before notetags.
		* @type {number}
		*/
		this.BaseCastSpeed = Number(this.parsedPluginParameters["baseCastSpeed"] ?? 0);
		/**
		* The minimum cast time in frames.
		* @type {number}
		*/
		this.MinimumCastTime = Number(this.parsedPluginParameters["minimumCastTime"] ?? 0);
		/**
		* The base fast cooldown modifier applied globally before notetags.
		* @type {number}
		*/
		this.BaseFastCooldown = Number(this.parsedPluginParameters["baseFastCooldown"] ?? 0);
		/**
		* The minimum cooldown in frames.
		* @type {number}
		*/
		this.MinimumCooldown = Number(this.parsedPluginParameters["minimumCooldown"] ?? 0);
	}
};

//#endregion
//#region src/plugins/abs/ext/timing/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
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
J.ABS.EXT.TIMING = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.TIMING.Metadata = new J_TimingPluginMetadata("J-ABS-Timing", "1.0.3");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.TIMING.Aliased = {
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	Game_BattlerBase: new Map(),
	Game_Enemy: new Map(),
	JABS_Action: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.TIMING.RegExp = {
	BaseCastSpeed: /<baseCastTime:\[([+\-*/ ().\w]+)]>/gi,
	CastSpeedFlat: /<castTimeFlat:\[([+\-*/ ().\w]+)]>/gi,
	CastSpeedRate: /<castSpeedRate:\[([+\-*/ ().\w]+)]>/gi,
	BaseFastCooldown: /<baseFastCooldown:\[([+\-*/ ().\w]+)]>/gi,
	FastCooldownFlat: /<fastCooldownFlat:\[([+\-*/ ().\w]+)]>/gi,
	FastCooldownRate: /<fastCooldownRate:\[([+\-*/ ().\w]+)]>/gi
};

//#endregion
//#region src/plugins/abs/ext/timing/_models/JABS_Action.js
/**
* Extends {@link JABS_Action.getCastTime}.<br/>
* Applies cast speed into the equation of determining cast time.
*/
J.ABS.EXT.TIMING.Aliased.JABS_Action.set("getCastTime", JABS_Action.prototype.getCastTime);
JABS_Action.prototype.getCastTime = function() {
	const skillCastTime = J.ABS.EXT.TIMING.Aliased.JABS_Action.get("getCastTime").call(this);
	const caster = this.getCaster().getBattler();
	if (!caster) return skillCastTime;
	const actualCastTime = caster.applyCastSpeed(skillCastTime);
	return actualCastTime;
};
/**
* Extends {@link JABS_Action.getCooldown}.<br/>
* Applies fast cooldown into the equation of determining cooldown time.
*/
J.ABS.EXT.TIMING.Aliased.JABS_Action.set("getCooldown", JABS_Action.prototype.getCooldown);
JABS_Action.prototype.getCooldown = function() {
	const skillCooldown = J.ABS.EXT.TIMING.Aliased.JABS_Action.get("getCooldown").call(this);
	const caster = this.getCaster().getBattler();
	if (!caster) return skillCooldown;
	const actualCooldown = caster.applyFastCooldown(skillCooldown);
	return actualCooldown;
};

//#endregion
//#region src/plugins/abs/ext/timing/objects/Game_Battler.js
/**
* Extends `initMembers()` to include initialization of our new parameters.
*/
J.ABS.EXT.TIMING.Aliased.Game_Battler.set("initMembers", Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function() {
	J.ABS.EXT.TIMING.Aliased.Game_Battler.get("initMembers").call(this);
	this.initActionUpgrades1();
};
/**
* Initializes the extra properties for the action upgrades..
*/
Game_Battler.prototype.initActionUpgrades1 = function() {
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with JABS.
	*/
	this._j._abs ||= {};
	/**
	* A grouping of all JABS properties associated with the set-1 of action upgrades.
	*/
	this._j._abs._timing = {};
	/**
	* The cached value for fast cooldown's base modifier.
	* @type {number}
	*/
	this._j._abs._timing._baseFastCooldown = 0;
	/**
	* The cached value for fast cooldown's flat modifier.
	* @type {number}
	*/
	this._j._abs._timing._fastCooldownFlat = 0;
	/**
	* The cached value for the fast cooldown's multiplicative modifier.
	* @type {number}
	*/
	this._j._abs._timing._fastCooldownRate = 0;
	/**
	* The cached value for the cast speed's base modifier.
	* @type {number}
	*/
	this._j._abs._timing._baseCastSpeed = 0;
	/**
	* The cached value for the cast speed's flat modifier.
	* @type {number}
	*/
	this._j._abs._timing._castSpeedFlat = 0;
	/**
	* The cached value for the cast speed's multiplicative modifier.
	* @type {number}
	*/
	this._j._abs._timing._castSpeedRate = 0;
};
/**
* Gets the cached fast cooldown base value.
* @returns {number}
*/
Game_Battler.prototype.getBaseFastCooldown = function() {
	return this._j._abs._timing._baseFastCooldown;
};
/**
* Sets the cached fast cooldown base value.
* @param {number} amount The new amount.
*/
Game_Battler.prototype.setBaseFastCooldown = function(amount) {
	this._j._abs._timing._baseFastCooldown = amount;
};
/**
* Updates the cached fast cooldown base value with the latest.
*/
Game_Battler.prototype.updateBaseFastCooldown = function() {
	const currentFastCooldownFlat = this.baseFastCooldown();
	this.setBaseFastCooldown(currentFastCooldownFlat);
};
/**
* Gets the cached fast cooldown flat value.
* @returns {number}
*/
Game_Battler.prototype.getFastCooldownFlat = function() {
	return this._j._abs._timing._fastCooldownFlat;
};
/**
* Sets the cached fast cooldown flat value.
* @param {number} amount The new amount.
*/
Game_Battler.prototype.setFastCooldownFlat = function(amount) {
	this._j._abs._timing._fastCooldownFlat = amount;
};
/**
* Updates the cached fast cooldown flat value with the latest.
*/
Game_Battler.prototype.updateFastCooldownFlat = function() {
	const currentFastCooldownFlat = this.fastCooldownFlat();
	this.setFastCooldownFlat(currentFastCooldownFlat);
};
/**
* Gets the cached fast cooldown rate value.
* @returns {number}
*/
Game_Battler.prototype.getFastCooldownRate = function() {
	return this._j._abs._timing._fastCooldownRate;
};
/**
* Sets the cached fast cooldown rate value.
* @param {number} amount The new amount.
*/
Game_Battler.prototype.setFastCooldownRate = function(amount) {
	this._j._abs._timing._fastCooldownRate = amount;
};
/**
* Updates the cached fast cooldown rate value with the latest.
*/
Game_Battler.prototype.updateFastCooldownRate = function() {
	const currentFastCooldownRate = this.fastCooldownRate();
	this.setFastCooldownRate(currentFastCooldownRate);
};
/**
* Gets the cached cast speed base value.
* @returns {number}
*/
Game_Battler.prototype.getBaseCastSpeed = function() {
	return this._j._abs._timing._baseCastSpeed;
};
/**
* Sets the cached cast speed base value.
* @param {number} amount The new amount.
*/
Game_Battler.prototype.setBaseCastSpeed = function(amount) {
	this._j._abs._timing._baseCastSpeed = amount;
};
/**
* Updates the cached cast speed base value with the latest.
*/
Game_Battler.prototype.updateBaseCastSpeed = function() {
	const currentBaseCastSpeed = this.baseCastSpeed();
	this.setBaseCastSpeed(currentBaseCastSpeed);
};
/**
* Gets the cached cast speed flat value.
* @returns {number}
*/
Game_Battler.prototype.getCastSpeedFlat = function() {
	return this._j._abs._timing._castSpeedFlat;
};
/**
* Sets the cached cast speed flat value.
* @param {number} amount The new amount.
*/
Game_Battler.prototype.setCastSpeedFlat = function(amount) {
	this._j._abs._timing._castSpeedFlat = amount;
};
/**
* Updates the cached cast speed flat value with the latest.
*/
Game_Battler.prototype.updateCastSpeedFlat = function() {
	const currentCastSpeedFlat = this.castSpeedFlat();
	this.setCastSpeedFlat(currentCastSpeedFlat);
};
/**
* Gets the cached cast speed rate value.
* @returns {number}
*/
Game_Battler.prototype.getCastSpeedRate = function() {
	return this._j._abs._timing._castSpeedRate;
};
/**
* Sets the cached cast speed rate value.
* @param {number} amount The new amount.
*/
Game_Battler.prototype.setCastSpeedRate = function(amount) {
	this._j._abs._timing._castSpeedRate = amount;
};
/**
* Updates the cached cast speed rate value with the latest.
*/
Game_Battler.prototype.updateCastSpeedRate = function() {
	const currentCastSpeedRate = this.castSpeedRate();
	this.setCastSpeedRate(currentCastSpeedRate);
};
/**
* The base cast speed multiplier.
* A battler's base cast speed defines the default multiplier for how long it takes to cast.
* @returns {number} The base multiplier for this battler.
*/
Game_Battler.prototype.baseCastSpeed = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = J.ABS.EXT.TIMING.Metadata.BaseCastSpeed;
	const baseCsp = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.ABS.EXT.TIMING.RegExp.BaseCastSpeed, baseParam, this);
	return baseCsp;
};
/**
* Gets the flat modifier for this battler's cast speed.
* @returns {number}
*/
Game_Battler.prototype.castSpeedFlat = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = this.baseCastSpeed();
	const cspFlat = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.ABS.EXT.TIMING.RegExp.CastSpeedFlat, baseParam, this);
	return cspFlat;
};
/**
* Gets the multiplier for this battler's cast speed.
* @returns {number}
*/
Game_Battler.prototype.castSpeedRate = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = this.baseCastSpeed();
	const cspRate = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.ABS.EXT.TIMING.RegExp.CastSpeedRate, baseParam, this);
	return cspRate;
};
/**
* Calculates the cast speed based on the various parameters.
* @param {number} originalCastTime The original cast time in frames.
* @returns {number} The new amount of frames to wait.
*/
Game_Battler.prototype.applyCastSpeed = function(originalCastTime) {
	if (!originalCastTime) return 0;
	const baseParam = this.baseCastSpeed();
	const flatModifier = this.castSpeedFlat();
	const multModifier = this.castSpeedRate();
	if (!baseParam && !flatModifier && !multModifier) return originalCastTime;
	const baseCastTime = baseParam + flatModifier;
	const castTimeMultiplier = (multModifier + 100) / 100;
	const calculatedCastTime = originalCastTime * castTimeMultiplier + baseCastTime;
	const minimumCastTime = this.minimumCastTime();
	const actualCastTime = Math.max(calculatedCastTime, minimumCastTime);
	return Math.round(actualCastTime);
};
/**
* The minimum cast time for this battler.
* @returns {number}
*/
Game_Battler.prototype.minimumCastTime = function() {
	return J.ABS.EXT.TIMING.Metadata.MinimumCastTime;
};
/**
* The base faster cooldown flat modifier.
* A battler's faster cooldown value will reduce the number of frames
* required to cooldown after a skill is executed.
*
* The mininum number of frames is 1 for a cooldown.
* @returns {number} The base modifier for this battler.
*/
Game_Battler.prototype.baseFastCooldown = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = J.ABS.EXT.TIMING.Metadata.BaseFastCooldown;
	const baseFcd = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.ABS.EXT.TIMING.RegExp.BaseFastCooldown, baseParam, this);
	return baseFcd;
};
/**
* Gets the flat modifier for this battler's fast cooldown.
* @returns {number}
*/
Game_Battler.prototype.fastCooldownFlat = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = this.baseFastCooldown();
	const fcdFlat = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.ABS.EXT.TIMING.RegExp.FastCooldownFlat, baseParam, this);
	return fcdFlat;
};
/**
* Gets the multiplicative modifier for this battler's fast cooldown.
* @returns {number}
*/
Game_Battler.prototype.fastCooldownRate = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = this.baseFastCooldown();
	const fcdRate = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.ABS.EXT.TIMING.RegExp.FastCooldownRate, baseParam, this);
	return fcdRate;
};
/**
* Calculates the cooldown time based on the various parameters.
* @param {number} originalCooldownTime The original cooldown time in frames.
* @returns {number} The new amount of frames to wait.
*/
Game_Battler.prototype.applyFastCooldown = function(originalCooldownTime) {
	if (!originalCooldownTime) return 0;
	const baseParam = this.baseFastCooldown();
	const flatModifier = this.fastCooldownFlat();
	const multModifier = this.fastCooldownRate();
	if (!baseParam && !flatModifier && !multModifier) return originalCooldownTime;
	const baseFastCooldown = baseParam + flatModifier;
	const cooldownMultiplier = (multModifier + 100) / 100;
	const minimumCooldown = this.minimumCooldown();
	const calculatedCooldown = originalCooldownTime * cooldownMultiplier + baseFastCooldown;
	const actualCooldown = Math.max(calculatedCooldown, minimumCooldown);
	return Math.round(actualCooldown);
};
/**
* The minimum cooldown for this battler.
* @returns {number}
*/
Game_Battler.prototype.minimumCooldown = function() {
	return J.ABS.EXT.TIMING.Metadata.MinimumCooldown;
};

//#endregion
//# sourceMappingURL=J-ABS-Timing.js.map