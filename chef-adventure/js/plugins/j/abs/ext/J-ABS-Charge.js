//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.4 CHARGE] Enable skills to be charged to perform other skills.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables the ability to charge certain skills by holding down
 * the input associated with the skill slot.
 *
 * This plugin requires JABS.
 * This plugin has minimal plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Actors can now "charge up" their skills to configurable degrees based on
 * the tags applied to the skills in question. This concept is basically a
 * JABS version of what Link can do when you charge up his sword to swing it
 * all around, instead of just swinging it by mashing the button.
 *
 * The functionality is defined by "charging tiers", which include data points
 * such as:
 * - how long to charge this tier.
 * - what skill will be executed if released when this tier is charged.
 * - the tier number of this tier.
 *
 * A skill can have multiple tiers of charging to represent the ability to
 * have different releasable abilities depending on how long you charge.
 * ----------------------------------------------------------------------------
 * PLUGIN PARAMETERS:
 * The plugin parameters provide some convenient defaults for the charging
 * functionality.
 * 
 * DefaultChargingAnimationId:
 * The animation that will play if none is specified while the player is
 * charging up a skill.
 * 
 * DefaultTierCompleteAnimationId:
 * The animation that will play upon completing a any non-final tier of
 * charging.
 * 
 * DefaultFullyChargedAnimationId:
 * The animation that will play upon completing the final tier of charging.
 * 
 * UseTierCompleteSE:
 * If you'd prefer to go purely by sound, there are sounds configured to play
 * instead of an animation.
 * 
 * AllowTierCompleteSEandAnimation:
 * Whether or not to allow both the animation and the sounds to play. This is
 * not recommended.
 * ----------------------------------------------------------------------------
 * LIMITATIONS:
 * While the reference above makes it sound like ANY skill can be charged, that
 * is only partially true. ANY skill can be charged, as long as it meets a few
 * criteria.
 *
 *  - It has to be one of the chargable skill slots.
 * Skill slots you CAN charge:
 *  - mainhand slot
 *  - offhand slot
 *  - combat skill 1 slot
 *  - combat skill 2 slot
 *  - combat skill 3 slot
 *  - combat skill 4 slot
 *
 * Skill slots you CANNOT charge:
 *  - dodge slot
 *  - item/tool slot
 *
 * - it has to be a valid chargable skill.
 * Skill situations that are not valid chargable skills:
 *  - tools cannot be charged, even if they have charge tier data.
 *  - guard skills cannot be charged, even if they have charge tier data.
 *
 * - the battler must know the skill somehow.
 * ============================================================================
 * CHARGING TIERS:
 * Have you ever wanted your player to be able to "charge" skills? Well now
 * you can! By applying the appropriate tags to skills, you can allow the
 * player to hold down a skill slot's input to "charge" up the skill!
 *
 * NOTE1:
 * To understand some of the nuances, do be sure to read the next section
 * below that describes in greater detail how the charging tiers work.
 *
 * NOTE2:
 * The two optional tags in the tag format below can be made uniform by
 * instead adjusting the configuration in the plugin parameters.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT:
 *  <chargeTier:[TIER,DURATION,RELEASED_SKILL,CHARGE_ANIM?,DONE_ANIM?]>
 * Where TIER represents the number of charge tier this defines.
 * Where DURATION is how long in frames the button must be held to charge.
 * Where RELEASED_SKILL is the skill to execute when released after charging.
 * Where CHARGE_ANIM? is the animation to play while charging (optional).
 * Where DONE_ANIM? is the animation to play when done charging (optional).
 *
 * EXAMPLE:
 *  <chargeTier:[1,30,175]>
 * The player can charge this skill up 1 tier by holding down the input for
 * this skill slot for 30 frames. When fully charged and released, it will
 * execute the skill of id 175.
 *
 *  <chargeTier:[1,30,175,10]>
 * The player can charge this skill up 1 tier by holding down the input for
 * this skill slot for 30 frames. While charging, the animation of id 10
 * will play on loop. When fully charged and released, it will execute the
 * skill of id 175.
 *
 *  <chargeTier:[1,30,175,10,25]>
 * The player can charge this skill up 1 tier by holding down the input for
 * this skill slot for 30 frames. While charging, the animation of id 10
 * will play on loop. Each tier completed will play the animation of id 25.
 * When fully charged and released, it will execute the skill of id 175.
 *
 *  <chargeTier:[1,60,0]>
 *  <chargeTier:[2,120,90]>
 * The player can charge this skill up 2 tiers by holding down the input for
 * this skill slot. The first tier requires the input held for 60 frames, but
 * will yield no skill when released. The second tier requires the input held
 * for an additional 120 frames, and when fully charged and released, it will
 * execute the skill id of 90.
 *
 *  <chargeTier:[1,60,125]>
 *  <chargeTier:[2,300,0]>
 *  <chargeTier:[7,150,90]>
 * (this is probably an unrealistic example, but illustrates the functionality)
 * The player can charge this skill up 7 tiers by holding down the input for
 * this skill slot. The first tier requires the input held for 60 frames, and
 * will execute skill of id 125 when released after charging for at minimum
 * the 60 frames. The second tier requires the input to be held for an
 * additional 300 frames (! roughly five seconds !), and when released after
 * charging, will execute the same skill as tier 1 because tier 2 has 0 set as
 * the skill id to execute. The tiers of (3/4/5/6) are all auto-generated and
 * each require 30 frames of holding the input. Finally, tier 7 requires the
 * input to be held for another 150 frames, and when fully charged and released
 * will execute skill id 90 instead. This skill requires a total of:
 * 60 + 300 + 30 + 30 + 30 + 30 + 150 = 630 aka ~10.5 seconds of holding the
 * input down to fully charge all the tiers!
 * ============================================================================
 * MORE ABOUT CHARGE TIERS:
 * In some cases, you may only want the player's charged ablity to release a
 * skill if it is charged multiple tiers. While you could just make a really
 * long charge tier, it may make more sense to charge up three tiers and only
 * the last tier will release a skill when fully charged. In this case, you
 * can only place the last tag on a skill (like a tier7 tag) and this engine
 * will auto-generate the prior tiers as 1/2 second charges per tier up
 * until the tier you defined is reached. None of the auto-generated tiers
 * will have releasable skills.
 *
 * If you manually created a gap, for example, by defining only charging tiers
 * 1 and 6, the auto-generated ones (2/3/4/5) would not have any releasable
 * skills, but if the tier1 you defined DOES have a releasable skill, releasing
 * anything after the first but before the 6th tier would end up releasing the
 * 1st tier charge skill as a result.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.4
 *    Raised minimum J-ABS version requirement to 4.7.0.
 * - 1.0.3
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.2
 *    Consumed `RPGManager` update.
 * - 1.0.1
 *    Updated to accommodate changes in J-ABS-InputManager.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param defaults
 * @text DEFAULTS
 *
 * @param defaultChargingAnimId
 * @parent defaults
 * @type animation
 * @text Charging Animation
 * @desc This will be the default animation to play when a
 * while charging up. 0 means no animation.
 * @default 0
 *
 * @param defaultTierCompleteAnimId
 * @parent defaults
 * @type animation
 * @text Tier Complete Animation
 * @desc This will be the default animation to play when a
 * charging tier is charged. 0 means no animation.
 * @default 0
 * 
 * @param defaultFullyChargedAnimId
 * @parent defaults
 * @type animation
 * @text Fully Charged Animation
 * @desc This will be the default animation to play when the
 * player can charge no further- aka the final tier completed.
 * @default 0
 * 
 * @param tierCompleteSE
 * @parent defaults
 * @type struct<soundEffect>
 * @text Charge Tier Complete SE
 * @desc This will be the default sound effect to play when a
 * charging tier is charged. Empty means no sound effect.
 * @default
 * 
 * @param chargeReadySE
 * @parent defaults
 * @type struct<soundEffect>
 * @text Max Charge Ready SE
 * @desc This will be the default sound effect to play when a
 * all tiers are charged and ready. Empty means no sound effect.
 * @default
 *
 * @param useDefaultChargingSE
 * @parent defaults
 * @type boolean
 * @text Use Tier Complete SE
 * @desc Whether or not to use the tierComplete and chargeReady
 * sound effects.
 * @default false
 *
 * @param allowTierCompleteSEandAnim
 * @parent defaults
 * @type boolean
 * @text Allow Tier Complete SE/Anim
 * @desc Whether or not to use both sound effects and the defined
 * animations when a charging tier completes.
 * @default false
 */
/*~struct~soundEffect
 *
 * @param name
 * @type file
 * @text Sound Effect Name
 * @desc The name of the sound effect file to play.
 * @default ""
 * 
 * @param volume
 * @type number
 * @min 0
 * @max 100
 * @text Volume
 * @desc The volume at which to play the sound effect.
 * @default 90
 * 
 * @param pitch
 * @type number
 * @min 50
 * @max 150
 * @text Pitch
 * @desc The pitch of the sound effect- aka the speed of how the
 * sound effect is played. Higher is faster.
 * @default 100
 * 
 * @param pan
 * @type number
 * @min -100
 * @max 100
 * @text Volume
 * @desc The directional pan of the sound effect.
 * Negative is played to the left, positive to the right.
 * @default 0
 * 
 */

//#region src/plugins/abs/ext/charge/_metadata/_pluginMetadata.js
var J_ChargePluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps charging animation and sound defaults from plugin parameters.
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
		* The default charging animation id.
		* 0 will yield no default animation.
		* @type {number}
		*/
		this.DefaultChargingAnimationId = parseInt(this.parsedPluginParameters["defaultChargingAnimId"]);
		/**
		* The default tier complete animation id.
		* 0 will yield no default animation.
		* @type {number}
		*/
		this.DefaultTierCompleteAnimationId = parseInt(this.parsedPluginParameters["defaultTierCompleteAnimId"]);
		/**
		* The default fully charged animation id.
		* 0 will yield no default animation.
		* @type {number}
		*/
		this.DefaultFullyChargedAnimationId = parseInt(this.parsedPluginParameters["defaultFullyChargedAnimId"]);
		/**
		* The sound effect to play when the a charging tier has completed.
		* @type {RPG_SoundEffect}
		*/
		this.TierCompleteSE = this.parsedPluginParameters["tierCompleteSE"];
		/**
		* The sound effect to play when the final charge tier has completed charging.
		* @type {RPG_SoundEffect}
		*/
		this.ChargeReadySE = this.parsedPluginParameters["chargeReadySE"];
		/**
		* Whether or not to use the charging tier complete sound effect.
		* @type {boolean}
		*/
		this.UseTierCompleteSE = this.parsedPluginParameters["useDefaultChargingSE"] === "true";
		/**
		* Whether or not to use the charging tier complete sound effect when there is an animation present.
		* @type {boolean}
		*/
		this.AllowTierCompleteSEandAnimation = this.parsedPluginParameters["allowTierCompleteSEandAnim"] === "true";
	}
};

//#endregion
//#region src/plugins/abs/ext/charge/_metadata/initialization.js
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
J.ABS.EXT.CHARGE = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.CHARGE.Metadata = new J_ChargePluginMetadata("J-ABS-Charge", "1.0.4");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.CHARGE.Aliased = {
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	Game_BattlerBase: new Map(),
	Game_Enemy: new Map(),
	JABS_Action: new Map(),
	JABS_Battler: new Map(),
	JABS_StandardController: new Map(),
	SoundManager: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.CHARGE.RegExp = { ChargeData: /<chargeTier:[ ]?(\[\d+,[ ]?\d+,[ ]?\d+(,[ ]?\d+(,[ ]?\d+)?)?])>/gi };

//#endregion
//#region src/plugins/abs/ext/charge/_models/JABS_ChargingTier.js
/**
* A single charging tier derived from a skill in a slot to be charged.
*/
var JABS_ChargingTier = class JABS_ChargingTier {
	/**
	* The number of frames that this tier has already been charged.
	* @type {number}
	*/
	duration = 0;
	/**
	* The number of frames that this tier must be charged to be completed.
	* @type {number}
	*/
	maxDuration = 0;
	/**
	* The tier number for this {@link JABS_ChargingTier}.
	* @type {number}
	*/
	tier = 0;
	/**
	* The skill id that can be executed when this tier is charged.
	* @type {number}
	*/
	skillId = 0;
	/**
	* Whether or not this tier has completed charging.
	* @type {boolean}
	*/
	completed = false;
	/**
	* The animation id to be played while this tier is being charged.
	* If it is set to 0 or missing, no animation will be played.
	* @type {number}
	*/
	whileChargingAnimationId = 0;
	/**
	* The animation id to be played when this tier has finished charging.
	* If it is set to 0 or missing, no animation will be played.
	* @type {number}
	*/
	chargeTierCompleteAnimationId = 0;
	/**
	* Constructor.
	* @param {number} tier The number of tier this is.
	* @param {number} maxDuration The duration for this tier.
	* @param {number} skillId The skill to be executed on charge-up.
	* @param {number} whileChargingAnimationId The animation to be played while charging this skill.
	* @param {number} maxChargeReadyAnimationId The animation to be played when max charge is ready.
	*/
	constructor(tier, maxDuration, skillId, whileChargingAnimationId, maxChargeReadyAnimationId) {
		this.maxDuration = maxDuration;
		this.tier = tier;
		this.skillId = skillId;
		this.whileChargingAnimationId = whileChargingAnimationId;
		this.chargeTierCompleteAnimationId = maxChargeReadyAnimationId;
	}
	/**
	* The default for a tier that is missing from a skill but needed to
	* fill the gaps between other tiers that were defined.
	* @param {number} fillerTier The tier number to be filled.
	* @returns {JABS_ChargingTier} The default filler tier.
	*/
	static defaultTier(fillerTier = 1) {
		return new JABS_ChargingTier(fillerTier, 30, 0, 0, 0);
	}
	/**
	* Updates this charging tier.
	*/
	update() {
		if (!this.completed) {
			this.duration++;
			if (this.duration >= this.maxDuration) {
				this.completed = true;
				this.onComplete();
			}
		}
	}
	/**
	* An event hook for when a tier has reached max charge.
	*/
	onComplete() {}
};

//#endregion
//#region src/plugins/abs/ext/charge/_models/JABS_Battler.js
/**
* Extends {@link JABS_Battler.initBattleInfo}.<br/>
* Also initializes the charge-related data.
*/
J.ABS.EXT.CHARGE.Aliased.JABS_Battler.set("initBattleInfo", JABS_Battler.prototype.initBattleInfo);
JABS_Battler.prototype.initBattleInfo = function() {
	J.ABS.EXT.CHARGE.Aliased.JABS_Battler.get("initBattleInfo").call(this);
	this.initChargeData();
};
/**
* Initialize the properties associated with charging skills.
*/
JABS_Battler.prototype.initChargeData = function() {
	/**
	* Whether or not this battler is charging up a skill for use.
	* @type {boolean}
	*/
	this._charging = false;
	/**
	* The slot associated with the current charging.
	* @type {null|string}
	*/
	this._chargeSlot = null;
	/**
	* The tiers of charging that are currently being managed.
	* @type {JABS_ChargingTier[]}
	*/
	this._chargingTiers = [];
};
/**
* Gets whether or not this battler is charging a skill.
* @returns {boolean}
*/
JABS_Battler.prototype.isCharging = function() {
	return this._charging;
};
/**
* Begins the charging process.
*/
JABS_Battler.prototype.beginCharging = function() {
	this._charging = true;
};
/**
* Stops the charging process.
*/
JABS_Battler.prototype.stopCharging = function() {
	this._charging = false;
};
/**
* Gets the slot that is currently being charged.
* @returns {string|null} The slot being charged, or `null` if nothing is being charged.
*/
JABS_Battler.prototype.getChargingSlot = function() {
	return this._chargeSlot;
};
/**
* Gets the charging tier data for the current slot.
* @returns {JABS_ChargingTier[]}
*/
JABS_Battler.prototype.getChargingTierData = function() {
	return this._chargingTiers;
};
/**
* Whether or not charging tier data exists for this charge.
* @returns {boolean} True if it exists, false otherwise.
*/
JABS_Battler.prototype.hasChargingTierData = function() {
	return this._chargingTiers.length > 0;
};
/**
* Sets the charging tier data to the given data.
* @param {JABS_ChargingTier[]} tiers The new tier data.
*/
JABS_Battler.prototype.setChargingTierData = function(tiers) {
	this._chargingTiers = tiers;
};
/**
* Gets the current charging tier to be charged.
* Returns `null` if there is no charging data, or all tiers are fully charged.
* @returns {null|JABS_ChargingTier}
*/
JABS_Battler.prototype.getCurrentChargingTier = function() {
	const tiers = this.getChargingTierData();
	if (!tiers.length) {
		return null;
	}
	const sortedFilteredTiers = tiers.filter((chargeTier) => !chargeTier.completed).sort((chargeTierLeft, chargeTierRight) => chargeTierLeft.tier - chargeTierRight.tier);
	if (!sortedFilteredTiers.length) return null;
	const [currentTier] = sortedFilteredTiers;
	return currentTier;
};
/**
* Gets the highest completed charging tier.
* Returns `null` if there is no charging data, or no tiers are fully charged.
* @returns {null|JABS_ChargingTier}
*/
JABS_Battler.prototype.getHighestChargedTier = function() {
	const tiers = this.getChargingTierData();
	if (!tiers.length) {
		return null;
	}
	const sortedFilteredtiers = tiers.filter((chargeTier) => chargeTier.completed).sort((chargeTierLeft, chargeTierRight) => chargeTierRight.tier - chargeTierLeft.tier);
	if (!sortedFilteredTiers.length) return null;
	const [highestChargedTier] = sortedFilteredtiers;
	return highestChargedTier;
};
/**
* Gets the highest completed charging tier that contains a skill id.
* Returns `null` if there is no charging data, or no tiers are fully charged with skill ids.
* @returns {null|JABS_ChargingTier}
*/
JABS_Battler.prototype.getHighestChargedTierWithSkillId = function() {
	const tiers = this.getChargingTierData();
	if (!tiers.length) {
		return null;
	}
	const sortedFilteredTiers = tiers.filter((chargeTier) => chargeTier.completed).filter((chargeTier) => chargeTier.skillId).sort((chargeTierLeft, chargeTierRight) => chargeTierRight.tier - chargeTierLeft.tier);
	if (!sortedFilteredTiers.length) return null;
	const [highestChargedTier] = sortedFilteredTiers;
	return highestChargedTier;
};
/**
* Sets the slot that is currently being charged.
* @param {string} slot The slot being charged.
*/
JABS_Battler.prototype.setChargingSlot = function(slot) {
	this._chargeSlot = slot;
};
/**
* Resets all charge-related data back to default values.
*/
JABS_Battler.prototype.resetChargeData = function() {
	this.setChargingSlot(null);
	this.setChargingTierData([]);
	this.stopCharging();
};
/**
* Handles the charging of a given action.
* @param {string} slot The slot being charged.
* @param {boolean} charging Whether or not the slot is being charged.
*/
JABS_Battler.prototype.executeChargeAction = function(slot, charging) {
	if (!this.canChargeSlot(slot)) return;
	const isCurrentlyCharging = this.isCharging();
	const currentSlot = this.getChargingSlot();
	const isDifferentSlot = slot !== currentSlot;
	if (isCurrentlyCharging && !charging && isDifferentSlot) {
		return;
	}
	const isSameSlot = slot === currentSlot;
	if (!charging && isCurrentlyCharging) {
		this.endCharging();
		return;
	}
	if (!charging) return;
	const isStillCharging = isCurrentlyCharging && isSameSlot;
	if (isStillCharging) return;
	const isSwitchingChargingSlot = isStillCharging && !isSameSlot;
	if (isSwitchingChargingSlot) {
		this.endCharging();
		return;
	}
	const isChargingAnew = !isStillCharging && charging;
	if (isChargingAnew) {
		const chargingTiers = this.getChargingTiers(slot);
		if (!chargingTiers) return;
		this.setupCharging(slot, chargingTiers);
	}
};
/**
* Determines whether or not the given slot can be charged.
* @param {string} slot The slot to potentially be charged.
* @returns {boolean} True if it can be charged, false otherwise.
*/
JABS_Battler.prototype.canChargeSlot = function(slot) {
	if (!slot) return false;
	const skillSlot = this.getBattler().getSkillSlotManager().getSkillSlotByKey(slot);
	if (!skillSlot) return false;
	if (!this.getBattler().hasSkill(skillSlot.id)) {
		return false;
	}
	return true;
};
/**
* Begins charging the given slot after seeding tier data and guards.
* @param {string} slot The slot to be charged.
* @param {JABS_ChargingTier[]} chargingTiers The charging tier data.
*/
JABS_Battler.prototype.setupCharging = function(slot, chargingTiers) {
	if (this.isCharging()) return;
	this.setChargingSlot(slot);
	this.setChargingTierData(chargingTiers);
	this.beginCharging();
};
/**
* Ends the charging for this battler, releasing the charged skill.
*/
JABS_Battler.prototype.endCharging = function() {
	this.releaseHighestChargedSkill();
	this.resetChargeData();
};
/**
* Releases the highest charged skill available.
*/
JABS_Battler.prototype.releaseHighestChargedSkill = function() {
	const highestChargedTier = this.getHighestChargedTierWithSkillId();
	if (!highestChargedTier) return;
	const { skillId } = highestChargedTier;
	if (!this.canReleaseChargedSkill(skillId)) return;
	const actions = this.createJabsActionFromSkill(skillId);
	this.setDecidedAction(actions);
	this.setCastCountdown(actions[0].getCastTime());
};
/**
* Determines whether or not the battler can actually execute the skill to be released.
* @param {number} skillId The id of the skill to be released.
* @returns {boolean} True if we can release the skill, false otherwise.
*/
JABS_Battler.prototype.canReleaseChargedSkill = function(skillId) {
	const battler = this.getBattler();
	if (!battler.hasSkill(skillId)) return false;
	const skill = battler.skill(skillId);
	if (!battler.meetsSkillConditions(skill)) return false;
	return true;
};
/**
* Extracts the charging tier data out of the skill in the given slot.
* @param {string} slot The slot to extract charging data out of.
* @returns {JABS_ChargingTier[]|null} The charging data if it existed, `null` otherwise.
*/
JABS_Battler.prototype.getChargingTiers = function(slot) {
	const battler = this.getBattler();
	let skillId;
	if (this.getLastUsedSkillId()) {
		skillId = this.getLastUsedSkillId();
	} else {
		skillId = battler.getEquippedSkillId(slot);
	}
	if (!skillId) return null;
	const skill = battler.skill(skillId);
	const chargingTierData = skill.jabsChargeData;
	if (!chargingTierData || !chargingTierData.length) return null;
	const convertedData = chargingTierData.map((tierData) => {
		const [chargeTier, maxDuration, chargeSkillId, whileChargingAnimationId, chargeTierCompleteAnimationId] = tierData;
		return new JABS_ChargingTier(chargeTier, maxDuration, chargeSkillId, whileChargingAnimationId ?? 0, chargeTierCompleteAnimationId ?? 0);
	});
	const normalizedData = this.normalizeChargeTierData(convertedData);
	return normalizedData;
};
/**
* Normalizes the charge tier data, accommodating for missing tiers between defined tiers.
* @param {JABS_ChargingTier[]} chargeTierData The current state of charging data.
* @returns {JABS_ChargingTier[]} The normalized and complete list of charging tiers.
*/
JABS_Battler.prototype.normalizeChargeTierData = function(chargeTierData) {
	const sortedTiers = chargeTierData.sort((chargeTierLeft, chargeTierRight) => chargeTierLeft.tier - chargeTierRight.tier);
	const [firstTier] = sortedTiers;
	if (firstTier.tier !== 1) {
		sortedTiers.unshift(JABS_ChargingTier.defaultTier(1));
	}
	for (let index = 0; index < sortedTiers.length; index++) {
		if (index === 0) continue;
		const currentTier = sortedTiers.at(index);
		const previousTier = sortedTiers.at(index - 1);
		const expectedTier = previousTier.tier + 1;
		if (currentTier.tier !== expectedTier) {
			const filler = JABS_ChargingTier.defaultTier(expectedTier);
			sortedTiers.splice(index, 0, filler);
		}
	}
	if (sortedTiers.at(-1).chargeTierCompleteAnimationId === 0 && J.ABS.EXT.CHARGE.Metadata.DefaultFullyChargedAnimationId) {
		sortedTiers.at(-1).chargeTierCompleteAnimationId = J.ABS.EXT.CHARGE.Metadata.DefaultFullyChargedAnimationId;
	}
	return sortedTiers;
};
/**
* Extends {@link JABS_Battler.update}.<br/>
* Also updates charging as-needed.
*/
J.ABS.EXT.CHARGE.Aliased.JABS_Battler.set("update", JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function() {
	J.ABS.EXT.CHARGE.Aliased.JABS_Battler.get("update").call(this);
	this.updateCharging();
};
/**
* Updates the charging for this battler.
*/
JABS_Battler.prototype.updateCharging = function() {
	if (!this.canUpdateCharging()) return;
	const currentTier = this.getCurrentChargingTier();
	this.preUpdateCharging(currentTier);
	currentTier.update();
	this.postUpdateCharging(currentTier);
};
/**
* Determines whether or not charging can be updated.
* @returns {boolean} True if we can update charging, false otherwise.
*/
JABS_Battler.prototype.canUpdateCharging = function() {
	if (!this.isCharging()) return false;
	if (!this.getCurrentChargingTier()) return false;
	return true;
};
/**
* Processes the pre-update charging effects.
* This defines
* @param {JABS_ChargingTier} currentTier The current tier about to be charged.
*/
JABS_Battler.prototype.preUpdateCharging = function(currentTier) {
	if (this.canShowPreChargingAnimation(currentTier)) {
		const animationId = currentTier.whileChargingAnimationId === 0 ? J.ABS.EXT.CHARGE.Metadata.DefaultChargingAnimationId : currentTier.whileChargingAnimationId;
		this.showAnimation(animationId);
	}
};
/**
* Determines whether or not to show the charging animation.
* @param {JABS_ChargingTier} currentTier The current tier about to be charged.
*/
JABS_Battler.prototype.canShowPreChargingAnimation = function(currentTier) {
	const hasNoAnimationId = currentTier.whileChargingAnimationId === 0;
	const usingDefault = J.ABS.EXT.CHARGE.Metadata.DefaultChargingAnimationId !== 0;
	if (hasNoAnimationId && !usingDefault) return false;
	if (currentTier.duration % 15 !== 0) return false;
	return true;
};
/**
* Processes the post-update charging effects.
* This defines the hooks for on-max charge and the like.
* @param {JABS_ChargingTier} currentTier The most recent charging tier that was updated.
*/
JABS_Battler.prototype.postUpdateCharging = function(currentTier) {
	const afterUpdateTier = this.getCurrentChargingTier();
	if (!afterUpdateTier) {
		this.onMaxCharge(currentTier);
		return;
	}
	if (!currentTier.completed) {
		return;
	}
	if (currentTier.tier < afterUpdateTier.tier) {
		this.onChargeTierComplete(currentTier, afterUpdateTier);
	}
};
/**
* Determines whether or not to show the charging animation.
* @param {JABS_ChargingTier} currentTier The current tier about to be charged.
*/
JABS_Battler.prototype.canShowTierCompletionAnimation = function(currentTier) {
	const hasNoAnimationId = currentTier.chargeTierCompleteAnimationId === 0;
	const usingDefault = J.ABS.EXT.CHARGE.Metadata.DefaultTierCompleteAnimationId !== 0;
	if (hasNoAnimationId && !usingDefault) return false;
	return true;
};
/**
* Processes the max charge ready effects.
* Either this or {@link JABS_Battler.onChargeTierComplete} will execute, not both.
* @param {JABS_ChargingTier} finalChargeTier The last tier that completed charging.
*/
JABS_Battler.prototype.onMaxCharge = function(finalChargeTier) {
	const canShowAnimation = this.canShowTierCompletionAnimation(finalChargeTier);
	const canPlaySE = J.ABS.EXT.CHARGE.Metadata.UseTierCompleteSE;
	const canPlaySEwithAnimation = canPlaySE && J.ABS.EXT.CHARGE.Metadata.AllowTierCompleteSEandAnimation;
	const animationId = finalChargeTier.chargeTierCompleteAnimationId === 0 ? J.ABS.EXT.CHARGE.Metadata.DefaultTierCompleteAnimationId : finalChargeTier.chargeTierCompleteAnimationId;
	if (canShowAnimation) {
		this.showAnimation(animationId);
		if (canPlaySEwithAnimation) {
			SoundManager.playMaxChargeReadySE();
		}
	} else if (canPlaySE) {
		SoundManager.playMaxChargeReadySE();
	}
};
/**
* Processes the charge tier complete effects.
* Either this or {@link JABS_Battler.onMaxCharge} will execute, not both.
* @param {JABS_ChargingTier} completedChargeTier The most recent charging tier completed.
* @param {JABS_ChargingTier} nextChargeTier The next charging tier.
*/
JABS_Battler.prototype.onChargeTierComplete = function(completedChargeTier, nextChargeTier) {
	const canShowAnimation = this.canShowTierCompletionAnimation(completedChargeTier);
	const canPlaySE = J.ABS.EXT.CHARGE.Metadata.UseTierCompleteSE;
	const canPlaySEwithAnimation = canPlaySE && J.ABS.EXT.CHARGE.Metadata.AllowTierCompleteSEandAnimation;
	const animationId = completedChargeTier.chargeTierCompleteAnimationId === 0 ? J.ABS.EXT.CHARGE.Metadata.DefaultTierCompleteAnimationId : completedChargeTier.chargeTierCompleteAnimationId;
	if (canShowAnimation) {
		this.showAnimation(animationId);
		if (canPlaySEwithAnimation) {
			SoundManager.playChargeTierCompleteSE();
		}
	} else if (canPlaySE) {
		SoundManager.playChargeTierCompleteSE();
	}
};

//#endregion
//#region src/plugins/abs/ext/charge/_models/JABS_InputAdapter.js
/**
* Executes the charging of the mainhand slot.
* @param {boolean} charging True if we are charging this slot, false otherwise.
* @param {JABS_Battler} jabsBattler The battler doing the charging.
*/
JABS_InputAdapter.performMainhandActionCharging = function(charging, jabsBattler) {
	if (!this.canPerformMainhandActionCharging(jabsBattler)) return;
	jabsBattler.executeChargeAction(JABS_Button.Mainhand, charging);
};
/**
* Determines wehether or not the player can try to charge their mainhand action.
* @param {JABS_Battler} jabsBattler The battler doing the charging.
* @returns {boolean} True if we can charge with this slot, false otherwise.
*/
JABS_InputAdapter.canPerformMainhandActionCharging = function(jabsBattler) {
	if (!jabsBattler.canBattlerUseAttacks()) return false;
	if (jabsBattler.isCasting()) return false;
	return true;
};
/**
* Executes the charging of the offhand slot.
* @param {boolean} charging True if we are charging this slot, false otherwise.
* @param {JABS_Battler} jabsBattler The battler doing the charging.
*/
JABS_InputAdapter.performOffhandActionCharging = function(charging, jabsBattler) {
	if (!this.canPerformOffhandActionCharging(jabsBattler)) return;
	jabsBattler.executeChargeAction(JABS_Button.Offhand, charging);
};
/**
* Determines wehether or not the player can try to charge their offhand action.
* Guard skills cannot be charged.
* @param {JABS_Battler} jabsBattler The battler doing the charging.
* @returns {boolean} True if we can charge with this slot, false otherwise.
*/
JABS_InputAdapter.canPerformOffhandActionCharging = function(jabsBattler) {
	if (jabsBattler.isGuardSkillByKey(JABS_Button.Offhand)) return false;
	if (!jabsBattler.canBattlerUseAttacks()) return false;
	if (jabsBattler.isCasting()) return false;
	return true;
};
/**
* Executes the charging of the combat skill slot.
* @param {boolean} charging True if we are charging this slot, false otherwise.
* @param {JABS_Battler} jabsBattler The battler doing the charging.
* @param {string} slot The combat skill slot being charged.
*/
JABS_InputAdapter.performCombatSkillCharging = function(charging, jabsBattler, slot) {
	if (!this.canPerformCombatSkillCharging(jabsBattler)) return;
	jabsBattler.executeChargeAction(slot, charging);
};
/**
* Determines whether or not the player can try to charge their combat skill 1.
* @param {JABS_Battler} jabsBattler The battler doing the charging.
* @returns {boolean} True if we can charge with this slot, false otherwise.
*/
JABS_InputAdapter.canPerformCombatSkillCharging = function(jabsBattler) {
	if (!jabsBattler.canBattlerUseSkills()) return false;
	if (jabsBattler.isCasting()) return false;
	return true;
};

//#endregion
//#region src/plugins/abs/ext/charge/_models/JABS_InputController.js
/**
* Extends {@link JABS_StandardController.initMembers}.<br/>
* Adds per-slot charge input delay timers for hold-to-charge skills.
*/
J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.set("initMembers", JABS_StandardController.prototype.initMembers);
JABS_StandardController.prototype.initMembers = function() {
	J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.get("initMembers").call(this);
	/**
	* The input delay between when the button is pressed down and when the charging can begin.
	* @type {number}
	*/
	this._chargeInputDelayMax = 24;
	/**
	* A map of {@link JABS_Timer}s.
	* @type {Map<string, JABS_Timer>}
	*/
	this._chargeInputDelay = new Map();
	this.initInputDelays();
};
/**
* Gets the input delay for charging.
* @returns {number} The delay in number of frames.
*/
JABS_StandardController.prototype.getChargeInputDelayAmount = function() {
	return this._chargeInputDelayMax;
};
/**
* Initializes the input delays for this controller.
*/
JABS_StandardController.prototype.initInputDelays = function() {
	this._chargeInputDelay.clear();
	this._chargeInputDelay.set(JABS_Button.Mainhand, new JABS_Timer(this.getChargeInputDelayAmount(), true));
	this._chargeInputDelay.set(JABS_Button.Offhand, new JABS_Timer(this.getChargeInputDelayAmount(), true));
	this._chargeInputDelay.set(JABS_Button.CombatSkill1, new JABS_Timer(this.getChargeInputDelayAmount(), true));
	this._chargeInputDelay.set(JABS_Button.CombatSkill2, new JABS_Timer(this.getChargeInputDelayAmount(), true));
	this._chargeInputDelay.set(JABS_Button.CombatSkill3, new JABS_Timer(this.getChargeInputDelayAmount(), true));
	this._chargeInputDelay.set(JABS_Button.CombatSkill4, new JABS_Timer(this.getChargeInputDelayAmount(), true));
};
/**
* Gets the {@link JABS_Timer} associated with the charge input delay of the given slot.
* @param {string} slot The slot to retrieve the charge input delay timer for.
* @returns {JABS_Timer}
*/
JABS_StandardController.prototype.getChargeInputDelayBySlot = function(slot) {
	return this._chargeInputDelay.get(slot);
};
/**
* Updates the charge input delay in the given slot.
* @param {string} slot The slot to update the charge input delay timer for.
*/
JABS_StandardController.prototype.updateChargeInputDelayBySlot = function(slot) {
	this.getChargeInputDelayBySlot(slot).update();
};
/**
* Resets the charge input delay in the given slot back to default.
* @param {string} slot The slot to refresh the charge input delay timer for.
*/
JABS_StandardController.prototype.resetChargeInputDelayBySlot = function(slot) {
	this.getChargeInputDelayBySlot(slot).reset();
};
/**
* Checks if the timer in the given slot is completed.
* @param {string} slot The slot to refresh the charge input delay timer for.
* @returns {boolean} True if the slot's timer is complete, false otherwise.
*/
JABS_StandardController.prototype.isTimerCompleteBySlot = function(slot) {
	return this.getChargeInputDelayBySlot(slot).isTimerComplete();
};
/**
* Extends {@link JABS_StandardController.updateMainhandAction}.<br/>
* Handles charging capability for this input.
*/
J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.set("updateMainhandAction", JABS_StandardController.prototype.updateMainhandAction);
JABS_StandardController.prototype.updateMainhandAction = function() {
	J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.get("updateMainhandAction").call(this);
	this.handleMainhandCharging();
};
/**
* Handles the charging detection and interaction for the mainhand.
*/
JABS_StandardController.prototype.handleMainhandCharging = function() {
	if (this.isMainhandActionCharging()) {
		this.performMainhandChargeAction();
	} else {
		this.performMainhandChargeAlterAction();
	}
};
/**
* Checks the inputs of the mainhand action currently assigned (A default).
* @returns {boolean}
*/
JABS_StandardController.prototype.isMainhandActionCharging = function() {
	if (!this.canChargeMainhandAction()) return false;
	if (Input.isPressed(J.ABS.EXT.INPUT.Symbols.Mainhand)) return true;
	return false;
};
/**
* Determines whether or not the mainhand action can be charged.
* @returns {boolean}
*/
JABS_StandardController.prototype.canChargeMainhandAction = function() {
	if (this.isMainhandActionTriggered()) return false;
	if (this.isCombatSkillUsageEnabled()) return false;
	return true;
};
/**
* Determines whether or not the charging is ready.
* @returns {boolean} True if the charging is ready, false otherwise.
*/
JABS_StandardController.prototype.isMainhandChargeActionReady = function() {
	if (!this.isTimerCompleteBySlot(JABS_Button.Mainhand)) return false;
	return true;
};
/**
* Begins charging up the mainhand action.
*/
JABS_StandardController.prototype.performMainhandChargeAction = function() {
	if (this.isMainhandChargeActionReady()) {
		JABS_InputAdapter.performMainhandActionCharging(true, $jabsEngine.getPlayer1());
	} else {
		this.updateChargeInputDelayBySlot(JABS_Button.Mainhand);
	}
};
/**
* When the mainhand is not charging, then cancel the charge.
*/
JABS_StandardController.prototype.performMainhandChargeAlterAction = function() {
	JABS_InputAdapter.performMainhandActionCharging(false, $jabsEngine.getPlayer1());
	this.resetChargeInputDelayBySlot(JABS_Button.Mainhand);
};
/**
* Extends {@link JABS_StandardController.updateOffhandAction}.<br/>
* Handles charging capability to the offhand.
*/
J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.set("updateOffhandAction", JABS_StandardController.prototype.updateOffhandAction);
JABS_StandardController.prototype.updateOffhandAction = function() {
	J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.get("updateOffhandAction").call(this);
	this.handleOffhandCharging();
};
/**
* Handles the charging detection and interaction for the mainhand.
*/
JABS_StandardController.prototype.handleOffhandCharging = function() {
	if (this.isOffhandActionCharging()) {
		this.performOffhandChargeAction();
	} else {
		this.performOffhandChargeAlterAction();
	}
};
/**
* Checks the inputs of the offhand action currently assigned (B default).
* @returns {boolean}
*/
JABS_StandardController.prototype.isOffhandActionCharging = function() {
	if (!this.canChargeOffhandAction()) return false;
	if (Input.isPressed(J.ABS.EXT.INPUT.Symbols.Offhand)) return true;
	return false;
};
/**
* Determines whether or not the offhand action can be charged.
* @returns {boolean}
*/
JABS_StandardController.prototype.canChargeOffhandAction = function() {
	if (this.isOffhandActionTriggered()) return false;
	if (this.isCombatSkillUsageEnabled()) return false;
	return true;
};
/**
* Determines whether or not the charging is ready.
* @returns {boolean} True if the charging is ready, false otherwise.
*/
JABS_StandardController.prototype.isOffhandChargeActionReady = function() {
	if (!this.isTimerCompleteBySlot(JABS_Button.Offhand)) return false;
	return true;
};
/**
* Begins charging up the offhand action.
*/
JABS_StandardController.prototype.performOffhandChargeAction = function() {
	if (this.isOffhandChargeActionReady()) {
		JABS_InputAdapter.performOffhandActionCharging(true, $jabsEngine.getPlayer1());
	} else {
		this.updateChargeInputDelayBySlot(JABS_Button.Offhand);
	}
};
/**
* When the offhand is not charging, then cancel the charge.
*/
JABS_StandardController.prototype.performOffhandChargeAlterAction = function() {
	JABS_InputAdapter.performOffhandActionCharging(false, $jabsEngine.getPlayer1());
};
/**
* Determines whether or not the charging is ready.
* @returns {boolean} True if the charging is ready, false otherwise.
*/
JABS_StandardController.prototype.isCombatActionChargeReady = function(slot) {
	if (!this.isTimerCompleteBySlot(slot)) return false;
	return true;
};
/**
* Begins charging up the combat skill action.
* @param {string} slot The slot to charge alter action with.
*/
JABS_StandardController.prototype.performCombatSkillChargeAction = function(slot) {
	if (this.isCombatActionChargeReady(slot)) {
		JABS_InputAdapter.performCombatSkillCharging(true, $jabsEngine.getPlayer1(), slot);
	} else {
		this.updateChargeInputDelayBySlot(slot);
	}
};
/**
* If the combat skill is not charging, then cancel the charge.
* @param {string} slot The slot to charge alter action with.
*/
JABS_StandardController.prototype.performCombatSkillChargeAlterAction = function(slot) {
	JABS_InputAdapter.performCombatSkillCharging(false, $jabsEngine.getPlayer1(), slot);
	this.resetChargeInputDelayBySlot(slot);
};
/**
* Extends {@link JABS_StandardController.updateCombatAction1}.<br/>
* Handles charging capability for this input.
*/
J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.set("updateCombatAction1", JABS_StandardController.prototype.updateCombatAction1);
JABS_StandardController.prototype.updateCombatAction1 = function() {
	J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.get("updateCombatAction1").call(this);
	this.handleCombatAction1Charging();
};
/**
* Handles the charging detection and interaction for this input.
*/
JABS_StandardController.prototype.handleCombatAction1Charging = function() {
	if (this.isCombatAction1Charging()) {
		this.performCombatSkillChargeAction(JABS_Button.CombatSkill1);
	} else {
		this.performCombatSkillChargeAlterAction(JABS_Button.CombatSkill1);
	}
};
/**
* Determines if the inputs are being pressed to charge this combat skill.
* @returns {boolean}
*/
JABS_StandardController.prototype.isCombatAction1Charging = function() {
	if (!this.canChargeCombatAction1()) return false;
	if (!this.isCombatSkillUsageEnabled()) return false;
	if (Input.isPressed(J.ABS.EXT.INPUT.Symbols.Mainhand) || Input.isPressed(J.ABS.EXT.INPUT.Symbols.CombatSkill1)) {
		return true;
	}
	return false;
};
/**
* Determines whether or not the combat action can be charged.
* @returns {boolean}
*/
JABS_StandardController.prototype.canChargeCombatAction1 = function() {
	if (this.isCombatAction1Triggered()) return false;
	return true;
};
/**
* Extends {@link JABS_StandardController.updateCombatAction2}.<br/>
* Handles charging capability for this input.
*/
J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.set("updateCombatAction2", JABS_StandardController.prototype.updateCombatAction2);
JABS_StandardController.prototype.updateCombatAction2 = function() {
	J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.get("updateCombatAction2").call(this);
	this.handleCombatAction2Charging();
};
/**
* Handles the charging detection and interaction for this input.
*/
JABS_StandardController.prototype.handleCombatAction2Charging = function() {
	if (this.isCombatAction2Charging()) {
		this.performCombatSkillChargeAction(JABS_Button.CombatSkill2);
	} else {
		this.performCombatSkillChargeAlterAction(JABS_Button.CombatSkill2);
	}
};
/**
* Determines if the inputs are being pressed to charge this combat skill.
* @returns {boolean}
*/
JABS_StandardController.prototype.isCombatAction2Charging = function() {
	if (!this.canChargeCombatAction2()) return false;
	if (!this.isCombatSkillUsageEnabled()) return false;
	if (Input.isPressed(J.ABS.EXT.INPUT.Symbols.Offhand) || Input.isPressed(J.ABS.EXT.INPUT.Symbols.CombatSkill2)) {
		return true;
	}
	return false;
};
/**
* Determines whether or not the combat action can be charged.
* @returns {boolean}
*/
JABS_StandardController.prototype.canChargeCombatAction2 = function() {
	if (this.isCombatAction2Triggered()) return false;
	return true;
};
/**
* Extends {@link JABS_StandardController.updateCombatAction3}.<br/>
* Handles charging capability for this input.
*/
J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.set("updateCombatAction3", JABS_StandardController.prototype.updateCombatAction3);
JABS_StandardController.prototype.updateCombatAction3 = function() {
	J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.get("updateCombatAction3").call(this);
	this.handleCombatAction3Charging();
};
/**
* Handles the charging detection and interaction for this input.
*/
JABS_StandardController.prototype.handleCombatAction3Charging = function() {
	if (this.isCombatAction3Charging()) {
		this.performCombatSkillChargeAction(JABS_Button.CombatSkill3);
	} else {
		this.performCombatSkillChargeAlterAction(JABS_Button.CombatSkill3);
	}
};
/**
* Determines if the inputs are being pressed to charge this combat skill.
* @returns {boolean}
*/
JABS_StandardController.prototype.isCombatAction3Charging = function() {
	if (!this.canChargeCombatAction3()) return false;
	if (!this.isCombatSkillUsageEnabled()) return false;
	if (Input.isPressed(J.ABS.EXT.INPUT.Symbols.Dash) || Input.isPressed(J.ABS.EXT.INPUT.Symbols.CombatSkill3)) {
		return true;
	}
	return false;
};
/**
* Determines whether or not the combat action can be charged.
* @returns {boolean}
*/
JABS_StandardController.prototype.canChargeCombatAction3 = function() {
	if (this.isCombatAction3Triggered()) return false;
	return true;
};
/**
* Extends {@link JABS_StandardController.updateCombatAction4}.<br/>
* Handles charging capability for this input.
*/
J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.set("updateCombatAction4", JABS_StandardController.prototype.updateCombatAction4);
JABS_StandardController.prototype.updateCombatAction4 = function() {
	J.ABS.EXT.CHARGE.Aliased.JABS_StandardController.get("updateCombatAction4").call(this);
	this.handleCombatAction4Charging();
};
/**
* Handles the charging detection and interaction for this input.
*/
JABS_StandardController.prototype.handleCombatAction4Charging = function() {
	if (this.isCombatAction4Charging()) {
		this.performCombatSkillChargeAction(JABS_Button.CombatSkill4);
	} else {
		this.performCombatSkillChargeAlterAction(JABS_Button.CombatSkill4);
	}
};
/**
* Determines if the inputs are being pressed to charge this combat skill.
* @returns {boolean}
*/
JABS_StandardController.prototype.isCombatAction4Charging = function() {
	if (!this.canChargeCombatAction4()) return false;
	if (!this.isCombatSkillUsageEnabled()) return false;
	if (Input.isPressed(J.ABS.EXT.INPUT.Symbols.Tool) || Input.isPressed(J.ABS.EXT.INPUT.Symbols.CombatSkill4)) {
		return true;
	}
	return false;
};
/**
* Determines whether or not the combat action can be charged.
* @returns {boolean}
*/
JABS_StandardController.prototype.canChargeCombatAction4 = function() {
	if (this.isCombatAction4Triggered()) return false;
	return true;
};

//#endregion
//#region src/plugins/abs/ext/charge/database/RPG_Skill.js
/**
* The charge tier data associated with a skill.
* @type {[number, number, number, number][]|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsChargeData", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.ABS.EXT.CHARGE.RegExp.ChargeData, true);
} });

//#endregion
//#region src/plugins/abs/ext/charge/managers/SoundManager.js
/**
* Extends {@link SoundManager.preloadImportantSounds}.<br/>
* Also preloads the charging-related sound effects.
*/
J.ABS.EXT.CHARGE.Aliased.SoundManager.set("preloadImportantSounds", SoundManager.preloadImportantSounds);
SoundManager.preloadImportantSounds = function() {
	J.ABS.EXT.CHARGE.Aliased.SoundManager.get("preloadImportantSounds").call(this);
	this.loadJabsChargingSounds();
};
/**
* Adds the charging-related sound effects to the list of preloaded sound effects.
*/
SoundManager.loadJabsChargingSounds = function() {
	const chargeTierComplete = this.chargeTierCompleteSE();
	const maxChargeReady = this.maxChargeReadySE();
	AudioManager.loadStaticSe(chargeTierComplete);
	AudioManager.loadStaticSe(maxChargeReady);
};
/**
* Plays the sound effect for when a charging tier has completed charging.
*/
SoundManager.playChargeTierCompleteSE = function() {
	const se = this.chargeTierCompleteSE();
	this.playSoundEffect(se);
};
/**
* Plays the sound effect for when the max charge effect is ready.
*/
SoundManager.playMaxChargeReadySE = function() {
	const se = this.maxChargeReadySE();
	this.playSoundEffect(se);
};
/**
* The sound effect to play when a charging tier has completed charging.
* @returns {RPG_SoundEffect}
*/
SoundManager.chargeTierCompleteSE = function() {
	return J.ABS.EXT.CHARGE.Metadata.TierCompleteSE ?? new RPG_SoundEffect("Heal6", 40, 130, 0);
};
/**
* The sound effect to play when the max charge effect is ready.
* @returns {RPG_SoundEffect}
*/
SoundManager.maxChargeReadySE = function() {
	return J.ABS.EXT.CHARGE.Metadata.ChargeReadySE ?? new RPG_SoundEffect("Item3", 50, 110, 0);
};

//#endregion
//# sourceMappingURL=J-ABS-Charge.js.map