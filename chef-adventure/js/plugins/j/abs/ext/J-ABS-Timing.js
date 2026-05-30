//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.2 TIMING] Enable modifying cooldowns/casting for actions.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables modifications for cast times and cooldowns for actions.
 *
 * Enables:
 * - NEW! added param "Fast Cooldown", for modifying cooldown times.
 * - NEW! added param "Cast Speed", for modifying cast speeds.
 *
 * This plugin requires JABS.
 * This plugin requires no plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The new parameters of fast cooldown and cast speed are both cached to
 * minimize processing time. The cache is refreshed on the following events:
 *
 * For all battlers:
 * - a new state is added.
 * - a current state is removed.
 * For only actors:
 * - new equipment is equipped.
 * - existing equipment is unequipped.
 * - leveling up.
 * - leveling down.
 * ----------------------------------------------------------------------------
 * NEW PARAMETERS:
 * When using this plugin, there are two additional parameters that become
 * defined on battlers, but they are computed values that are applied to JABS
 * related parameters, so they don't have shorthand properties like "atk".
 *
 * USAGE IN JABS:
 * In the context of JABS, these two parameters have very specific functions
 * by default:
 * - Fast Cooldown:
 *    Modifies the cooldown associated with a JABS Action.
 * - Cast Speed:
 *    Modifies the cast speed associated with a JABS Action.
 * "JABS Action" usually just refers to the execution of an equipped skill...
 * which means that in actuality, this can be applied to various states and
 * equipment to penalize or reward the player:
 * - Fast Cooldown:
 *    Used to penalize with longer cooldowns from cursed states or equipment.
 *    Used to reward with reduced cooldowns from equipment or states.
 * - Cast Speed:
 *    Used to penalize with longer cast times due to bad states or equipment.
 *    Used to reward with reduced or removed cast times from sagely equipment!
 *
 * FORMULA BREAKDOWN:
 * Knowing the usage described of these two parameters, you'll be pleased to
 * know they are calculated in exactly the same way, but applied to the two
 * separate values, cooldown and cast speed.
 *
 * First, a base parameter for the value is established:
 * "base fast cooldown" or "base cast speed" in this plugin's case.
 * If there is no base parameter values found, then zero is assumed the base
 * parameter value.
 * The same is assumed if all found values summed together to equal zero.
 * If any values are found, they are added together as one.
 * This sum represents a flat addition or subtraction against the calculated
 * parameter- in frames.
 *
 * Second, the flat modifier is evaluated:
 * "cast speed flat" or "fast cooldown flat" in this plugin's case.
 * If there are no flat parameter values found, then zero is assumed to be the
 * flat modifier value.
 * The same is assumed if all found values summed together to equal zero.
 * If any values are found, they are added together as one.
 * This summed value represents a flat modifier against the base parameter
 * when being combined with the multiplier.
 * Higher of this will increase the time required.
 * Lower of this will reduce the time required.
 * Being a flat modifier, this can have great impact if your skills have low
 * cooldowns consiering this amount is directly being added to the
 * cast time/cooldown values recorded by the JABS Action.
 *
 * Third, the multiplicitive modifier is evaluated:
 * "cast speed rate" or "fast cooldown rate" in this plugin's case.
 * If there are no rate parameter values found, then zero is assumed to be the
 * rate modifier value.
 * The same is assumed if all found values summed together to equal zero.
 * If any values are found, they are added together as one.
 * This summed value represents a "factor multiplier"* against the original
 * cast time derived from the action itself.
 *
 * Fourth, and finally, the product of the original cast time being combined
 * with the factor multiplier from step three is added to the sum of the flat
 * modifier derived from step two, resulting in a single new value that
 * represents the new cast time. There is validation logic that will ensure
 * this amount didn't go below the "minimum" cast time (defaults to 0). This
 * amount- rounded- is returned as the REAL cast time.
 *
 * | WHAT IS A FACTOR MULTIPLIER?
 * | A "factor multiplier" is a number that usually begins as a base-100 integer,
 * | such as 150, that is later divided by 100 to get a "multiplier" that
 * | indicates a percentage multiplier against another value. In the case of 150,
 * | the "factor multiplier" would be 1.5, aka +50% more than the base.
 *
 *
 * ============================================================================
 * FAST COOLDOWN:
 * Have you ever wanted skills to have a base cooldown time, but maybe when
 * a battler has a particular state applied or equipment equipped, they now
 * have even faster cooldown times (or slower???)? Well now you can! By
 * applying the appropriate tag to various database locations, you can control
 * how fast (or slow) a battler's cooldown times are!
 *
 * DETAILS:
 * Considering the value is evaluated() in javascript (similar to how a skill
 * formula box is calculated), there are also a few letter variables available
 * for use when building the formula:
 * - "a": as seen in the example of "a.level", refers to the battler itself.
 *
 * - "b": as seen in the example of "-1 * (b * 5)" refers to
 *      the base parameter.
 *      This defaults to 0 unless otherwise uncalculated.
 *
 * NOTE1:
 * By constructing tags using the format described below, you are given access
 * to a "Formula" box that behaves similar to a "Formula" box that defines the
 * damage of a skill. None of the tags are case sensitive, but the order is
 * specific. If you find yourself having trouble building the tags, you can
 * peek at the source code of this file and search for
 * "J.ABS.EXT.TIMING.RegExp =" to find the grand master list of all
 * combinations of tags. Do note that the hard brackets of [] are required to
 * wrap the formula in the note tag.
 *
 * NOTE2:
 * If you want faster cooldowns, the formula should result in a NEGATIVE value.
 * If you want slower cooldowns, the formula should result in a POSITIVE value.
 *
 * NOTE3:
 * The minimum amount of time for cooldowns is 0 frames.
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
 *  <baseFastCooldown:[FORMULA]>
 *  <fastCooldownFlat:[FORMULA]>
 *  <fastCooldownRate:[FORMULA]>
 * Where [FORMULA] is the formula to produce the fast cooldown value.
 *
 * EXAMPLE:
 *  <baseFastCooldown:[3]>
 * Base fast cooldown will be set to +3 frames.
 *
 *  <fastCooldownFlat:[(a.level * -2)]>
 * All cooldowns are reduced by 2 frames per level.
 *
 *  <fastCooldownRate:[-1 * (b * 5)]>
 * All cooldowns will be reduced by 5% per point of base fast cooldown.
 * (not a practical formula, but demonstrating use)
 * ============================================================================
 * CAST SPEED:
 * Have you ever wanted skills to have a base cast speed, but maybe when
 * a battler has a particular state applied or equipment equipped, they now
 * have even faster cast times (or slower???)? Well now you can! By
 * applying the appropriate tag to various database locations, you can control
 * how fast (or slow) a battler's cast times are!
 *
 * NOTE1:
 * By constructing tags using the format described below, you are given access
 * to a "Formula" box that behaves similar to a "Formula" box that defines the
 * damage of a skill. None of the tags are case sensitive, but the order is
 * specific. If you find yourself having trouble building the tags, you can
 * peek at the source code of this file and search for
 * "J.ABS.EXT.TIMING.RegExp =" to find the grand master list of all
 * combinations of tags. Do note that the hard brackets of [] are required to
 * wrap the formula in the note tag.
 *
 * NOTE2:
 * If you want faster casting, the formula should result in a NEGATIVE value.
 * If you want slower casting, the formula should result in a POSITIVE value.
 *
 * NOTE3:
 * The minimum amount of time for casting is 0 frames.
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
 *  <baseCastSpeed:[FORMULA]>
 *  <castSpeedFlat:[FORMULA]>
 *  <castSpeedRate:[FORMULA]>
 * Where [FORMULA] is the formula to produce the fast cooldown value.
 *
 * EXAMPLE:
 *  <baseCastSpeed:[3]>
 * Base cast speed will be set to +3 frames.
 *
 *  <castSpeedFlat:[(a.level * 2) * -1]>
 * All cast times are reduced by 2 frames per level.
 *
 *  <castSpeedRate:[b * -5]>
 * All cast times will be reduced by 5% per point of base fast cooldown.
 * (not a practical formula, but demonstrating use)
 * ==============================================================================
 * CHANGELOG:
 * - 1.0.2
 *    Raised minimum J-ABS version requirement to 4.7.0.
 * - 1.0.1
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.0
 *    Initial release.
 * ==============================================================================
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
 *
 */

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
		// policy step inside initialize metadata.
		*/
		this.BaseCastSpeed = Number(this.parsedPluginParameters["baseCastSpeed"] ?? 0);
		/**
		* The minimum cast time in frames.
		* @type {number}
		// policy step inside initialize metadata.
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
J.ABS.EXT.TIMING = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.TIMING.Metadata = new J_TimingPluginMetadata("J-ABS-Timing", "1.0.2");
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
	CastSpeedRate: /<castTimePercent:\[([+\-*/ ().\w]+)]>/gi,
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
	const currentCastSpeedRate = this.castSpeedFlat();
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