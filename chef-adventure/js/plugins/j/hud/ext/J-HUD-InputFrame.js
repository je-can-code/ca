//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 HUD-INPUT] A HUD frame that displays your leader's buttons data.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-HUD
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of the J-HUD system.
 *
 * This is the Input Frame, which displays the various action keys and their
 * corresponding cooldown and cost data points for the leader of the party.
 *
 * This plugin requires JABS.
 * This plugin requires the base HUD.
 * See plugin parameters below for configuration options.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This includes the following data points for the currently selected leader:
 * - mainhand, offhand, tool, and dodge/sprint action keys.
 * - while holding the skill trigger, skill keys show instead.
 * - ability costs for all keys, or item count remaining for tool.
 * ============================================================================
 * CHANGELOG
 * ----------------------------------------------------------------------------
 * - 1.2.0
 *    Cooldown overlay icon: a configurable icon renders over skill slots that
 *    are currently on cooldown, making unavailability obvious at a glance.
 *    Pulse animation: a brief scale pop fires whenever a slot becomes newly
 *    available (base cooldown finished or combo window opens).
 *    Combo expire gauge: the cooldown gauge switches to a warm orange-to-yellow
 *    color and counts down the combo expiry window while a follow-up is live,
 *    then returns to the base cooldown display after the window closes.
 * - 1.1.2
 *    Combo cooldown gauge merges J-ABS global cooldown (GCD) for GCD-subject
 *    skill slots (not tool/dodge).
 * - 1.1.1
 *    Wired HP skill cost into Sprite_SkillCost for display on action slots
 *    (requires J-Resources).
 * - 1.1.0
 *    Changed input to reflect a switch-view diamond in the center.
 *    Retroactively added this changelog.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param cooldownOverlayIconIndex
 * @type number
 * @text Cooldown Overlay Icon
 * @desc Icon index to overlay on skill slots that are currently on cooldown.
 * @default 90
 */

//#region src/plugins/hud/ext/input/_metadata/_pluginMetadata.js
var JHudInput_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link PluginMetadata.postInitialize}.<br/>
	* Reads plugin parameters and stores them as typed metadata properties.
	*/
	postInitialize() {
		this.CooldownOverlayIconIndex = Number(this.parsedPluginParameters["cooldownOverlayIconIndex"]) || 90;
	}
};

//#endregion
//#region src/plugins/hud/ext/input/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "2.3.1";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredHudVersion = "2.0.0";
	const hasHudRequirement = J.BASE.Helpers.satisfies(J.HUD.Metadata.version.version(), requiredHudVersion);
	if (hasHudRequirement === false) {
		throw new Error(`Either missing J-HUD or has a lower version than the required: ${requiredHudVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.HUD.EXT.INPUT = {};
/**
* The `metadata` associated with this plugin, such as version.
* @type {JHudInput_PluginMetadata}
*/
J.HUD.EXT.INPUT.Metadata = new JHudInput_PluginMetadata("J-HUD-InputFrame", "1.2.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.HUD.EXT.INPUT.Aliased = { Scene_Map: new Map() };

//#endregion
//#region src/plugins/hud/ext/input/sprites/Sprite_BaseSkillSlot.js
/**
* A sprite that represents a skill slot.
* This is a base class for other things that need data from a skill slot.
*/
var Sprite_BaseSkillSlot = class extends Sprite_BaseText {
	/**
	* Extend initialization of the sprite to assign a skill slot for tracking.
	* @param {JABS_SkillSlot} skillSlot The skill slot to track the name of.
	*/
	initialize(skillSlot) {
		super.initialize(String.empty);
		this.setSkillSlot(skillSlot);
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		super.initMembers();
		/**
		* The skill slot associated with this sprite.
		* @type {JABS_SkillSlot|null}
		*/
		this._j._skillSlot = null;
	}
	/**
	* Gets the skill slot associated with this sprite.
	* @returns {JABS_SkillSlot|null}
	*/
	skillSlot() {
		return this._j._skillSlot;
	}
	/**
	* Gets whether or not there is a skill slot presently
	* assigned to this sprite.
	* @returns {boolean}
	*/
	hasSkillSlot() {
		return !!this._j._skillSlot;
	}
	/**
	* Sets the skill slot for this sprite.
	* @param {JABS_SkillSlot} skillSlot The skill slot to assign.
	*/
	setSkillSlot(skillSlot) {
		this._j._skillSlot = skillSlot;
		this.setText(this.skillName());
	}
	/**
	* Gets whether or not this slot is for an item instead of a skill.
	* @returns {boolean}
	*/
	isItem() {
		return this.skillSlot().isItem();
	}
	/**
	* Get the cooldown data associated with the battler that owns
	* this skill slot.
	* @returns {JABS_Cooldown|null}
	*/
	cooldownData() {
		if (!this.hasSkillSlot()) return null;
		const jabsBattler = this.targetJabsBattler();
		if (!jabsBattler) return null;
		const inputType = this.skillSlot().key;
		return jabsBattler.getCooldown(inputType);
	}
	/**
	* Gets the target `JABS_Battler` associated with this sprite.
	* @returns {JABS_Battler|null}
	*/
	targetJabsBattler() {
		return $jabsEngine.getPlayer1();
	}
	/**
	* Gets the target `Game_Actor` or `Game_Enemy`
	* @returns {Game_Actor|Game_Enemy|null}
	*/
	targetBattler() {
		const jabsBattler = this.targetJabsBattler();
		if (!jabsBattler) return null;
		return jabsBattler.getBattler();
	}
	/**
	* Gets the skill currently assigned to the skill slot.
	* @returns {RPG_Skill|null}
	*/
	skill() {
		if (!this.hasSkillSlot()) return null;
		const cooldownData = this.cooldownData();
		if (!cooldownData) return null;
		return this.skillSlot().data(this.targetBattler(), this.skillId());
	}
	/**
	* Gets the effective skill (or item) id for this slot, accounting for active skill transforms
	* and any queued combo follow-up.
	*
	* Resolution order:
	*  1. Item slots return the raw item id unchanged — transforms do not apply to items.
	*  2. When a combo follow-up is queued, its id is returned directly; combo chains are
	*     sourced from the resolved (transformed) starter skill and are not re-transformed.
	*  3. Otherwise the slot's base skill id is passed through the transform resolver so the
	*     HUD displays the skill that will actually fire, not the raw equipped id.
	* @returns {number}
	*/
	skillId() {
		if (this.skillSlot().isItem()) {
			return this.skillSlot().id;
		}
		const cooldownData = this.cooldownData();
		if (cooldownData && cooldownData.comboNextActionId > 0) {
			return cooldownData.comboNextActionId;
		}
		const battler = this.targetBattler();
		if (!battler) {
			return this.skillSlot().id;
		}
		return battler.getResolvedSkillId(this.skillSlot().key);
	}
	/**
	* Gets the skill name of the skill currently in the slot.
	* This accommodates the possibility of combos and skill extensions.
	* @returns {string} The name of the skill.
	*/
	skillName() {
		const skill = this.skill();
		if (!skill) return String.empty;
		return skill.name;
	}
};

//#endregion
//#region src/plugins/hud/ext/input/sprites/Sprite_CooldownGauge.js
/**
* A simple calculated gauge representing the current cooldown of an action.
* While the skill is ready, this gauge is invisible.
*/
var Sprite_CooldownGauge = class extends Sprite {
	constructor(cooldownData) {
		super();
		this.initMembers();
		this.createBitmap();
		this.setup(cooldownData);
	}
	/**
	* Initializes all members of this class.
	*/
	initMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j = {
			/**
			* The cooldown data this gauge is associated with.
			* @type {JABS_Cooldown|null}
			*/
			_cooldownData: null,
			/**
			* The current value of the gauge.
			* @type {number}
			*/
			_valueCurrent: 0,
			/**
			* The maximum value of the gauge.
			* @type {number}
			*/
			_valueMax: 0,
			/**
			* Highest recent combined cooldown (slot vs GCD) so the bar does not shrink when GCD outlasts the per-skill
			* timer.
			* @type {number}
			*/
			_gcdHudPeak: 0,
			/**
			* Leader battler whose {@link J.ABS.Globals.GlobalCooldownKey} may be reflected on this input-slot gauge.
			* @type {JABS_Battler|null}
			*/
			_gcdMergeBattler: null,
			/**
			* Skill id assigned to this HUD slot; used with
			* {@link JABS_GlobalCooldown.skillIsSubjectToGlobalCooldown} to decide if GCD should merge.
			* @type {number}
			*/
			_gcdMergeSkillId: 0
		};
	}
	/**
	* Binds this gauge to show remaining GCD alongside the slot cooldown when the slot maps to a GCD-subject skill.
	* Clears merge state for tool, dodge, and item slots so those inputs never display the shared timer.
	* @param {JABS_Battler|null} jabsBattler The leader JABS battler.
	* @param {JABS_SkillSlot|null} skillSlot Slot shown on this input key.
	*/
	setHudGcdMerge(jabsBattler, skillSlot) {
		this._j._gcdMergeBattler = null;
		this._j._gcdMergeSkillId = 0;
		if (!jabsBattler || !skillSlot) return;
		const { key } = skillSlot;
		if (key === JABS_Button.Tool || key === JABS_Button.UsableItem || key === JABS_Button.Dodge) return;
		if (skillSlot.isItem()) return;
		this._j._gcdMergeBattler = jabsBattler;
		this._j._gcdMergeSkillId = skillSlot.id;
	}
	/**
	* Remaining frames on the battler-wide GCD for HUD purposes when merge is armed and the slotted skill is
	* GCD-subject.
	* Returns zero if J-ABS or {@link JABS_GlobalCooldown} is unavailable, the slot is not merged, or the global timer
	* is ready.
	* @returns {number} Frames left on {@link J.ABS.Globals.GlobalCooldownKey}, or 0 when not applicable.
	*/
	globalHudFrames() {
		if (!this._j._gcdMergeBattler || !this._j._gcdMergeSkillId) return 0;
		const sk = $dataSkills[this._j._gcdMergeSkillId];
		if (JABS_GlobalCooldown.skillIsSubjectToGlobalCooldown(sk) === false) return 0;
		const globalCd = this._j._gcdMergeBattler.getCooldown(J.ABS.Globals.GlobalCooldownKey);
		if (!globalCd) return 0;
		if (globalCd.isBaseReady() === true) return 0;
		return globalCd.frames;
	}
	/**
	* Gets whether or not this gauge is currently showing the combo expiry countdown.
	* While true, the gauge reflects the shrinking follow-up window rather than the base cooldown.
	* @returns {boolean}
	*/
	isInComboExpireMode() {
		return this.cooldownData().comboExpireFrames > 0;
	}
	/**
	* Gets whether or not this gauge has a max value currently.
	* In combo expire mode the max is always the original window size, so we never treat it as unassigned.
	* @returns {boolean}
	*/
	isMaxUnassigned() {
		if (this.isInComboExpireMode()) return false;
		return this._j._valueMax === 0;
	}
	/**
	* Gets the cooldown data associated with this gauge.
	* @returns {JABS_Cooldown}
	*/
	cooldownData() {
		return this._j._cooldownData;
	}
	/**
	* Sets the cooldown data associated with this gauge.
	* @param {JABS_Cooldown} cooldownData The new cooldown data to set.
	*/
	setCooldownData(cooldownData) {
		this._j._cooldownData = cooldownData;
	}
	/**
	* Gets the current value for this gauge.
	* During the combo expiry window this is the remaining frames of that window rather than the base cooldown,
	* so the gauge reads as "time left to press the follow-up."
	* @returns {number}
	*/
	currentValue() {
		if (this.isInComboExpireMode()) return this.cooldownData().comboExpireFrames;
		const cd = this.cooldownData();
		const g = this.globalHudFrames();
		return Math.max(cd.frames, g);
	}
	/**
	* Gets the max value for this gauge.
	* During the combo expiry window this is the original window size rather than the base cooldown peak.
	* @returns {number}
	*/
	maxValue() {
		if (this.isInComboExpireMode()) return this.cooldownData().comboExpireFramesMax;
		return this._j._valueMax;
	}
	/**
	* Sets the max value for this gauge.
	* @param {number} maxValue The max value to set.
	*/
	setMaxValue(maxValue) {
		this._j._valueMax = maxValue;
	}
	/**
	* The width of the bitmap.
	*/
	bitmapWidth() {
		return 32;
	}
	/**
	* The height of the bitmap.
	*/
	bitmapHeight() {
		return 20;
	}
	/**
	* The height of this gauge.
	*/
	gaugeHeight() {
		return 10;
	}
	/**
	* The color to gradient from.
	* Defaults to blue; switches to orange during the combo expiry window.
	* @returns {string}
	*/
	gaugeColor1() {
		if (this.isInComboExpireMode()) return "rgba(255, 165, 0, 1)";
		return "rgba(0, 0, 255, 1)";
	}
	/**
	* The color to gradient into.
	* Defaults to green; switches to yellow during the combo expiry window.
	* @returns {string}
	*/
	gaugeColor2() {
		if (this.isInComboExpireMode()) return "rgba(255, 255, 0, 1)";
		return "rgba(0, 255, 0, 1)";
	}
	/**
	* The backdrop color.
	* Defaults to black with 50% opacity.
	* @returns {string}
	*/
	gaugeBackColor() {
		return "rgba(0, 0, 0, 0.5)";
	}
	/**
	* The percent/decimal representing how full this gauge is currently is.
	* @returns {number} A number between 0 and 1.
	*/
	gaugeRate() {
		if (this.isMaxUnassigned()) return 0;
		const value = this.currentValue();
		const maxValue = this.maxValue();
		const rate = maxValue > 0 ? value / maxValue : 0;
		const parsedRate = parseFloat(rate.toFixed(3));
		return parsedRate;
	}
	/**
	* Sets up the gauge based on the cooldown data.
	* @param {JABS_Cooldown} cooldownData The cooldown data for this gauge.
	*/
	setup(cooldownData) {
		this.setCooldownData(cooldownData);
	}
	/**
	* Generates the bitmap for this gauge.
	*/
	createBitmap() {
		this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
	}
	/**
	* Disables the gauge, clears the GCD peak used for merged display, and makes it invisible.
	*/
	disableGauge() {
		this.setMaxValue(0);
		this._j._gcdHudPeak = 0;
		this.bitmap.paintOpacity = 0;
	}
	/**
	* Enables the gauge and sets the max value from the greater of the slot cooldown and merged GCD so the bar matches
	* the longer wait.
	* Tracks a peak so the fill rate stays stable when GCD extends past the per-skill countdown.
	*/
	enableGauge() {
		const cd = this.cooldownData();
		const g = this.globalHudFrames();
		const eff = Math.max(cd.frames, g);
		if (this._j._gcdHudPeak < eff) {
			this._j._gcdHudPeak = eff;
		}
		this.setMaxValue(this._j._gcdHudPeak);
		this.bitmap.paintOpacity = 255;
	}
	/**
	* Extends {@link Sprite.update}.<br/>
	* Also updates the drawing of this gauge.
	*/
	update() {
		super.update();
		if (!this.canUpdate()) return;
		this.handleActionReadiness();
		this.redraw();
	}
	/**
	* Whether or not this gauge can be updated.
	* @returns {boolean} True if this gauge can be updated, false otherwise.
	*/
	canUpdate() {
		if (Number.isNaN(this.currentValue())) return false;
		return true;
	}
	/**
	* Shows or hides the gauge and updates its max from slot cooldown and optional merged GCD.
	* Hides only when both the slot base cooldown and merged GCD are finished; otherwise keeps the peak max for a smooth
	* drain.
	* During a combo expiry window the gauge stays visible in expire-mode colors; the peak is still tracked so the
	* base-cooldown display resumes correctly once the window closes.
	*/
	handleActionReadiness() {
		const cooldown = this.cooldownData();
		const g = this.globalHudFrames();
		const eff = Math.max(cooldown.frames, g);
		if (eff > this._j._gcdHudPeak) {
			this._j._gcdHudPeak = eff;
		}
		if (this.isInComboExpireMode()) {
			this.bitmap.paintOpacity = 255;
			return;
		}
		if (cooldown.isComboReady() && this.isMaxUnassigned()) {
			this.enableGauge();
		}
		if (cooldown.isBaseReady() === true && g <= 0) {
			this.disableGauge();
			return;
		}
		if (cooldown.isBaseReady() === false || g > 0) {
			this.setMaxValue(this._j._gcdHudPeak);
			this.bitmap.paintOpacity = 255;
		}
	}
	/**
	* Clears the bitmap to redraw the gauge anew.
	*/
	redraw() {
		this.bitmap.clear();
		this.drawGauge();
	}
	/**
	* Draws this gauge.
	*/
	drawGauge() {
		const x = 0;
		const y = this.bitmapHeight() - this.gaugeHeight();
		const w = this.bitmapWidth() - x;
		const h = this.gaugeHeight();
		this.drawGaugeRect(x, y, w, h);
	}
	/**
	* Actually draws the gauge based on the given parameters.
	* @param {number} x The x of the origin for this gauge.
	* @param {number} y The y of the origin for this gauge.
	* @param {number} w The width of the gauge.
	* @param {number} h The height of this gauge.
	*/
	drawGaugeRect(x, y, w, h) {
		const rate = this.gaugeRate();
		const fillW = Math.floor((w - 2) * rate);
		const fillH = h - 2;
		this.bitmap.fillRect(x, y, w, h, this.gaugeBackColor());
		const [borderedX, borderedY] = [x + 1, y + 1];
		this.bitmap.gradientFillRect(borderedX, borderedY, fillW, fillH, this.gaugeColor1(), this.gaugeColor2());
	}
};

//#endregion
//#region src/plugins/hud/ext/input/sprites/Sprite_CooldownTimer.js
/**
* A sprite that displays a timer representing the cooldown time for a JABS action.
*/
var Sprite_CooldownTimer = class extends Sprite {
	/**
	* Constructor.
	* @param {...*} args Forwarded to {@link #initialize}.
	*/
	constructor(...args) {
		super();
		this.initialize(...args);
	}
	/**
	* Initializes this cooldown timer sprite.
	* @param {string} skillType The slot that this skill maps to.
	* @param {object} cooldownData The cooldown data associated with this cooldown sprite.
	* @param {boolean} isItem Whether or not this cooldown timer is for an item.
	*/
	initialize(skillType, cooldownData, isItem = false) {
		super.initialize();
		this.initMembers(skillType, cooldownData, isItem);
		this.loadBitmap();
	}
	/**
	* Initializes the properties associated with this sprite.
	* @param {string} skillType The slot that this skill maps to.
	* @param {object} cooldownData The cooldown data associated with this cooldown sprite.
	* @param {boolean} isItem Whether or not this cooldown timer is for an item.
	*/
	initMembers(skillType, cooldownData, isItem) {
		this._j = {};
		this._j._skillType = skillType;
		this._j._cooldownData = cooldownData;
		this._j._isItem = isItem;
	}
	/**
	* Loads the bitmap into the sprite.
	*/
	loadBitmap() {
		this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
		this.bitmap.fontFace = this.fontFace();
		this.bitmap.fontSize = this.fontSize();
		this.bitmap.drawText(this._j._text, 0, 0, this.bitmapWidth(), this.bitmapHeight(), "center");
	}
	update() {
		super.update();
		this.updateCooldownText();
	}
	updateCooldownText() {
		this.bitmap.clear();
		const baseCooldown = (this._j._cooldownData.frames / 60).toFixed(1);
		const cooldownBaseText = baseCooldown > 0 ? baseCooldown : String.empty;
		this.bitmap.drawText(cooldownBaseText, 0, 0, this.bitmapWidth(), this.bitmapHeight(), "center");
	}
	/**
	* Determines the width of the bitmap accordingly to the length of the string.
	*/
	bitmapWidth() {
		return 40;
	}
	/**
	* Determines the width of the bitmap accordingly to the length of the string.
	*/
	bitmapHeight() {
		return this.fontSize() * 3;
	}
	/**
	* Determines the font size for text in this sprite.
	*/
	fontSize() {
		return $gameSystem.mainFontSize() - 10;
	}
	/**
	* determines the font face for text in this sprite.
	*/
	fontFace() {
		return $gameSystem.numberFontFace();
	}
};

//#endregion
//#region src/plugins/hud/ext/input/sprites/Sprite_SkillCost.js
/**
* A sprite that represents a skill slot's assigned skill's mp cost.
*/
var Sprite_SkillCost = class Sprite_SkillCost extends Sprite_BaseSkillSlot {
	/**
	* The supported types of skill costs for this sprite.
	*/
	static Types = {
		HP: "hp",
		MP: "mp",
		TP: "tp",
		Item: "item"
	};
	/**
	* Extend initialization of the sprite to assign a skill slot for tracking.
	* @param {JABS_SkillSlot} skillSlot The skill slot to track the name of.
	* @param {Sprite_SkillCost.Types} skillCostType The skillcost type for this sprite.
	*/
	initialize(skillSlot, skillCostType) {
		super.initialize(skillSlot);
		this.setSkillCostType(skillCostType);
		this.synchronizeCost();
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		super.initMembers();
		/**
		* The skill cost type.
		* @type {Sprite_SkillCost.Types}
		*/
		this._j._skillCostType = Sprite_SkillCost.Types.MP;
	}
	/**
	* Gets the skill cost type of this sprite.
	* @returns {Sprite_SkillCost.Types}
	*/
	skillCostType() {
		return this._j._skillCostType;
	}
	/**
	* Gets the skill cost of this sprite.
	* @returns {number}
	*/
	skillCost() {
		return this.skillCostByType();
	}
	/**
	* Calculates the skill cost according to the type of this sprite.
	*
	* The resolved (post-transform) skill id is used so cost display reflects the
	* skill that will actually fire rather than the raw base skill in the slot.
	* @returns {number}
	*/
	skillCostByType() {
		const leader = $gameParty.leader();
		if (!leader) return 0;
		const resolvedId = leader.getResolvedSkillId(this.skillSlot().key);
		const ability = this.skillSlot().data(leader, resolvedId);
		if (!ability) return 0;
		switch (this.skillCostType()) {
			case Sprite_SkillCost.Types.HP: return leader.skillHpCost(ability);
			case Sprite_SkillCost.Types.MP: return leader.skillMpCost(ability);
			case Sprite_SkillCost.Types.TP: return leader.skillTpCost(ability);
			case Sprite_SkillCost.Types.Item: return $gameParty.numItems(ability);
		}
	}
	/**
	* Sets the skill cost type for this sprite.
	* @param {Sprite_SkillCost.Types} skillCostType The skill type to assign to this sprite.
	*/
	setSkillCostType(skillCostType) {
		if (this.skillCostType() !== skillCostType) {
			this._j._skillCostType = skillCostType;
			this.refresh();
		}
	}
	/**
	* Overwrites {@link #color}.<br/>
	* Gets the color of the text for this sprite based on the
	* type of skill cost for this sprite, instead of the assigned color.
	* @returns {string}
	*/
	color() {
		return this.colorBySkillCostType();
	}
	/**
	* Gets the hex color based on the type of skill cost this is.
	* @returns {string}
	*/
	colorBySkillCostType() {
		switch (this.skillCostType()) {
			case Sprite_SkillCost.Types.HP: return "#ff0000";
			case Sprite_SkillCost.Types.MP: return "#0077ff";
			case Sprite_SkillCost.Types.TP: return "#33ff33";
			default: return "#ffffff";
		}
	}
	/**
	* Overwrites {@link #fontSize}.<br/>
	* Gets the font size for this sprite's text.
	* Skill costs are hard-coded to be a fixed size, 12.
	* @returns {number}
	*/
	fontSize() {
		return 12;
	}
	/**
	* Extends the `update()` to also synchronize the text to
	* match the skill slot it is
	*/
	update() {
		super.update();
		if (this.needsSynchronization()) {
			this.synchronizeCost();
		}
	}
	/**
	* Checks whether or not this slot is in need of cost synchronization.
	* @returns {boolean}
	*/
	needsSynchronization() {
		const skillslot = this.skillSlot();
		if (!skillslot) return false;
		if (!skillslot.needsVisualCostRefreshByType(this.skillCostType())) return false;
		return true;
	}
	/**
	* Synchronizes the text with the underlying skill inside the
	* tracked skill slot. This allows dynamic updating when the slot
	* changes skill due to combos and such.
	*/
	synchronizeCost() {
		let skillCost = this.skillCost().toFixed(0);
		if (this.text() !== skillCost) {
			if (skillCost === "0") {
				skillCost = String.empty;
			}
			this.setText(skillCost);
		}
		this.skillSlot().acknowledgeCostRefreshByType(this.skillCostType());
	}
};

//#endregion
//#region src/plugins/hud/ext/input/sprites/Sprite_SkillName.js
/**
* A sprite that represents a skill slot's assigned skill's name.
*/
var Sprite_SkillName = class extends Sprite_BaseSkillSlot {
	/**
	* Extends the `update()` to also synchronize the text to
	* match the skill slot it is
	*/
	update() {
		super.update();
		if (this.needsSynchronization()) {
			this.synchronizeText();
		}
	}
	/**
	* Checks whether or not this slot is in need of name synchronization.
	* @returns {boolean}
	*/
	needsSynchronization() {
		return this.hasSkillSlot() && this.skillSlot().needsVisualNameRefresh();
	}
	/**
	* Synchronizes the text with the underlying skill inside the
	* tracked skill slot. This allows dynamic updating when the slot
	* changes skill due to combos and such.
	*/
	synchronizeText() {
		if (this.text() !== this.skillName()) {
			this.setText(this.skillName());
		}
		this.skillSlot().acknowledgeNameRefresh();
	}
};

//#endregion
//#region src/plugins/hud/ext/input/sprites/Sprite_SkillSlotIcon.js
/**
* A sprite that displays the icon represented by the assigned skill slot.
*/
var Sprite_SkillSlotIcon = class extends Sprite_Icon {
	/**
	* Initializes this sprite with the designated icon.
	* @param {number} iconIndex The icon index of the icon for this sprite.
	* @param {JABS_SkillSlot} skillSlot The skill slot to monitor.
	*/
	initialize(iconIndex = 0, skillSlot = null) {
		super.initialize(iconIndex);
		this.setSkillSlot(skillSlot);
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		super.initMembers();
		/**
		* The skill slot that this sprite is watching.
		* @type {JABS_SkillSlot|null}
		*/
		this._j._skillSlot = null;
		/**
		* The icon sprite rendered over the skill icon while the slot is on cooldown.
		* Created lazily on first use and then cached here.
		* @type {Sprite_Icon|null}
		*/
		this._j._cooldownOverlaySprite = null;
		/**
		* Whether the base cooldown was ready on the previous frame.
		* Initialized to true so no pulse fires on HUD setup before any skill is used.
		* @type {boolean}
		*/
		this._j._prevBaseReady = true;
		/**
		* Whether the combo window was ready (open) on the previous frame.
		* @type {boolean}
		*/
		this._j._prevComboReady = false;
		/**
		* Remaining frames of the ready-pulse scale animation.
		* Zero means no pulse is currently active.
		* @type {number}
		*/
		this._j._pulseFrames = 0;
	}
	/**
	* Sets the skill slot for this sprite's icon.
	* @param {JABS_SkillSlot} skillSlot The skill slot being assigned.
	*/
	setSkillSlot(skillSlot) {
		this._j._skillSlot = skillSlot;
	}
	/**
	* Gets whether or not there is a skill slot currently being tracked.
	* @returns {boolean}
	*/
	hasSkillSlot() {
		return !!this._j._skillSlot;
	}
	/**
	* Gets the skill slot currently assigned to this sprite.
	* @returns {JABS_SkillSlot|null}
	*/
	skillSlot() {
		return this._j._skillSlot;
	}
	/**
	* Gets the icon associated with the tracked skill slot.
	*
	* The resolved (post-transform) skill id is used so the icon reflects the skill that
	* will actually fire rather than the raw equipped skill in the slot.
	* @returns {number}
	*/
	skillSlotIcon() {
		if (!this.hasSkillSlot()) return this._j._iconIndex;
		const leader = $gameParty.leader();
		if (!leader) return this._j._iconIndex;
		const resolvedId = leader.getResolvedSkillId(this.skillSlot().key);
		const skill = this.skillSlot().data(leader, resolvedId);
		if (!skill) return 0;
		return skill.iconIndex;
	}
	/**
	* The `JABS_Button` key that this skill slot belongs to.
	* @returns {string}
	*/
	skillSlotKey() {
		return this._j._skillSlot.key;
	}
	/**
	* Extends the `update()` to monitor the icon index in case it changes,
	* and to drive the cooldown overlay and ready-pulse animations.
	*/
	update() {
		super.update();
		if (this.needsSynchronization()) {
			this.synchronizeIconIndex();
		}
		if (!this.hasSkillSlot()) return;
		const jabsBattler = $jabsEngine?.getPlayer1();
		if (!jabsBattler) return;
		const cooldown = jabsBattler.getCooldown(this.skillSlotKey());
		if (!cooldown) return;
		this.updateCooldownOverlay(cooldown);
		this.updateReadyPulse(cooldown);
	}
	/**
	* Returns the cached cooldown overlay sprite, creating and attaching it on first call.
	* @returns {Sprite_Icon}
	*/
	getOrCreateCooldownOverlaySprite() {
		if (this._j._cooldownOverlaySprite) return this._j._cooldownOverlaySprite;
		const overlay = new Sprite_Icon(J.HUD.EXT.INPUT.Metadata.CooldownOverlayIconIndex);
		overlay.opacity = 160;
		overlay.hide();
		this.addChild(overlay);
		this._j._cooldownOverlaySprite = overlay;
		return overlay;
	}
	/**
	* Synchronizes the cooldown overlay icon's visibility with the slot's base-ready state.
	*
	* Visibility is driven by {@link JABS_Cooldown.comboMode}, stamped at skill-fire time:
	*   'none'     — no combo link; overlay shows immediately while the slot is on cooldown.
	*   'expiring' — combo with an authored expire window; overlay hidden while the window is live,
	*                then shown for the remaining base cooldown once the window closes.
	*   'infinite' — combo with no expire window; overlay never shown (the entire CD is the window).
	*
	* @param {JABS_Cooldown} cooldown The cooldown data for this slot.
	*/
	updateCooldownOverlay(cooldown) {
		const overlay = this.getOrCreateCooldownOverlaySprite();
		if (cooldown.isBaseReady() === true) {
			overlay.hide();
			return;
		}
		switch (cooldown.comboMode) {
			case "infinite":
				overlay.hide();
				break;
			case "expiring":
				if (cooldown.comboExpireFrames > 0) {
					overlay.hide();
				} else {
					overlay.show();
				}
				break;
			default:
				overlay.show();
				break;
		}
	}
	/**
	* Detects when the base cooldown or combo window becomes newly available and triggers a brief
	* scale pop to signal "new skill ready" to the player.
	* @param {JABS_Cooldown} cooldown The cooldown data for this slot.
	*/
	updateReadyPulse(cooldown) {
		const baseReady = cooldown.isBaseReady();
		const comboReady = cooldown.isComboReady();
		if (!this._j._prevBaseReady && baseReady) {
			this._j._pulseFrames = 12;
		}
		if (!this._j._prevComboReady && comboReady) {
			this._j._pulseFrames = 12;
		}
		this._j._prevBaseReady = baseReady;
		this._j._prevComboReady = comboReady;
		if (this._j._pulseFrames > 0) {
			const t = this._j._pulseFrames / 12;
			const s = 1 + Math.sin(t * Math.PI) * .25;
			this.scale.x = s;
			this.scale.y = s;
			this._j._pulseFrames--;
		} else {
			this.scale.x = 1;
			this.scale.y = 1;
		}
	}
	/**
	* Checks whether or not this slot is in need of name synchronization.
	* @returns {boolean}
	*/
	needsSynchronization() {
		return this.hasSkillSlot() && this.skillSlot().needsVisualIconRefresh();
	}
	/**
	* Synchronize the icon index for this skill slot.
	* Updates it if necessary.
	*/
	synchronizeIconIndex() {
		if (this.iconIndex() !== this.skillSlotIcon()) {
			this.setIconIndex(this.skillSlotIcon());
		}
		this.skillSlot().acknowledgeIconRefresh();
	}
	/**
	* Upon becoming ready, execute this logic.
	* In this sprite's case, we render ourselves.
	* @param {number} iconIndex The icon index of this sprite.
	*/
	onReady(iconIndex = 0) {
		super.onReady(iconIndex);
		if (this.hasSkillSlot()) {
			this.setIconIndex(this.skillSlotIcon());
		}
	}
};

//#endregion
//#region src/plugins/hud/ext/input/sprites/Sprite_InputKeySlot.js
/**
* A single sprite that owns the drawing and management of a single input key slot.
*/
var Sprite_InputKeySlot = class extends Sprite {
	/**
	* Extend initialization of the sprite to assign a skill slot for tracking.
	* @param {JABS_SkillSlot|null} skillSlot The skill slot to track the name of.
	* @param {Game_Actor|Game_Enemy|null} battler The battler that owns this slot.
	*/
	initialize(skillSlot = null, battler = null) {
		super.initialize();
		this.initMembers();
		this.setup(skillSlot, battler);
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* The skill slot associated with this sprite.
		* @type {JABS_SkillSlot|null}
		*/
		this._j._skillSlot = null;
		/**
		* The battler associated with the skill slot.
		* Used for deriving skill costs and skill extensions.
		* @type {Game_Actor|Game_Enemy|null}
		*/
		this._j._battler = null;
		/**
		* The cached collection of sprites.
		* @type {Map<string, Sprite_SkillSlotIcon|Sprite_SkillName|Sprite_SkillCost|Sprite_CooldownGauge>}
		*/
		this._j._spriteCache = new Map();
	}
	/**
	* Sets up this sprite with the given skill slot and owning battler.
	* @param {JABS_SkillSlot} skillSlot The skill slot to track.
	* @param {JABS_Battler} battler The battler owning the skill slot.
	*/
	setup(skillSlot, battler) {
		this.setSkillSlot(skillSlot);
		this.setBattler(battler);
		this.drawInputKey();
	}
	/**
	* Gets the assigned skill slot.
	* @returns {JABS_SkillSlot|null}
	*/
	skillSlot() {
		return this._j._skillSlot;
	}
	/**
	* Checks whether or not there is a skill slot currently assigned.
	* @returns {boolean}
	*/
	hasSkillSlot() {
		return !!this._j._skillSlot;
	}
	/**
	* Assigns the given skill slot to this sprite.
	* @param {JABS_SkillSlot} skillSlot The skill slot to track.
	*/
	setSkillSlot(skillSlot) {
		this._j._skillSlot = skillSlot;
	}
	/**
	* Get the cooldown data associated with the battler that owns
	* this skill slot.
	* @returns {JABS_Cooldown|null}
	*/
	cooldownData() {
		if (!this.hasSkillSlot()) return null;
		const jabsBattler = this.jabsBattler();
		if (!jabsBattler) return null;
		const inputType = this.skillSlot().key;
		return jabsBattler.getCooldown(inputType);
	}
	/**
	* Gets the skill (or item) id of the assigned ability of this skill slot.
	* Accommodates the possibility of
	* @returns {number}
	*/
	skillId() {
		const skillId = this.skillSlot().id;
		if (this.skillSlot().isItem()) {
			return skillId;
		}
		const cooldownData = this.cooldownData();
		if (!cooldownData) return skillId;
		const hasNextSkill = cooldownData.comboNextActionId > 0;
		return hasNextSkill ? cooldownData.comboNextActionId : skillId;
	}
	/**
	* Gets the `JABS_Battler` this input key slot is associated with.
	* @returns {JABS_Battler|null}
	*/
	jabsBattler() {
		return this._j._battler;
	}
	/**
	* Gets the `Game_Battler` associated with the `JABS_Battler` assigned to this sprite.
	* @returns {Game_Actor|Game_Enemy}
	*/
	battler() {
		return this.jabsBattler().getBattler();
	}
	/**
	* Checks whether or not there is a battler currently assigned.
	* @returns {boolean}
	*/
	hasBattler() {
		return !!this._j._battler;
	}
	/**
	* Assigns the given battler to this sprite.
	* @param {JABS_Battler} battler The battler owning the skill slot.
	*/
	setBattler(battler) {
		this._j._battler = battler;
	}
	/**
	* Ensures all sprites are created and available for use.
	*/
	createCache() {
		if (!$gameParty.leader()) return;
	}
	/**
	* Creates the key for the input key icon sprite based on the parameters.
	* @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
	* @param {JABS_Button} inputType The type of input for this key.
	* @returns {string}
	*/
	makeInputKeyIconSpriteKey(skillSlot, inputType) {
		return `icon-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
	}
	/**
	* Creates an icon sprite for the given input key and caches it.
	* @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
	* @param {JABS_Button} inputType The type of input for this key.
	* @returns {Sprite_Icon}
	*/
	getOrCreateInputKeyIconSprite(skillSlot, inputType) {
		const key = this.makeInputKeyIconSpriteKey(skillSlot, inputType);
		if (this._j._spriteCache.has(key)) {
			return this._j._spriteCache.get(key);
		}
		const sprite = new Sprite_SkillSlotIcon(0, skillSlot);
		this._j._spriteCache.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates the key for the input key ability cost sprite based on the parameters.
	* @param {number} amount The amount that is this cost.
	* @param {number} colorIndex The color index to draw this cost in.
	* @param {JABS_Button} inputType The type of input for this key.
	* @returns {string}
	*/
	makeInputKeyAbilityCostSpriteKey(amount, colorIndex, inputType) {
		return `cost-${this.battler().name()}-${this.battler().battlerId()}-${inputType}-${amount}-${colorIndex}`;
	}
	/**
	* Creates an ability cost sprite for the given input key and caches it.
	* @param {number} amount The amount that is this cost.
	* @param {number} colorIndex The color index to draw this cost in.
	* @param {JABS_Button} inputType The type of input for this key.
	* @param {number} itemId If this is an item, then the item id can be passed for tracking.
	* @returns {Sprite_SkillCost}
	*/
	getOrCreateInputKeyAbilityCostSprite(amount, colorIndex, inputType, itemId = 0) {
		const key = this.makeInputKeyAbilityCostSpriteKey(amount, colorIndex, inputType);
		if (this._j._spriteCache.has(key)) {
			return this._j._spriteCache.get(key);
		}
		const sprite = new Sprite_SkillCost(amount, colorIndex, itemId);
		this._j._spriteCache.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates the key for the input key ability cost sprite based on the parameters.
	* @param {Sprite_SkillCost.Types} costType The type of cost for this key.
	* @param {JABS_Button} inputType The type of input for this key.
	* @returns {string}
	*/
	makeInputKeySkillCostSpriteKey(costType, inputType) {
		return `skillcost-${this.battler().name()}-${this.battler().battlerId()}-${costType}-${inputType}`;
	}
	/**
	* Creates an skill cost sprite for the given input key and caches it.
	* @param {JABS_SkillSlot} skillSlot The slot associated with this skill.
	* @param {Sprite_SkillCost.Types} costType The type of cost this sprite is.
	* @param {JABS_Button} inputType The type of input for this key.
	* @returns {Sprite_SkillCost}
	*/
	getOrCreateInputKeySkillCostSprite(skillSlot, costType, inputType) {
		const key = this.makeInputKeySkillCostSpriteKey(costType, inputType);
		if (this._j._spriteCache.has(key)) {
			return this._j._spriteCache.get(key);
		}
		const sprite = new Sprite_SkillCost(skillSlot, costType);
		this._j._spriteCache.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates the key for the input key cooldown timer sprite based on the parameters.
	* @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
	* @param {JABS_Button} inputType The type of input for this key.
	* @param {boolean} isItem Whether or not this cooldown timer is for the item slot.
	* @returns {string}
	*/
	makeInputKeyCooldownTimerSpriteKey(cooldownData, inputType, isItem) {
		return `cooldown-${this.battler().name()}-${this.battler().battlerId()}-${inputType}-${isItem}`;
	}
	/**
	* Creates a cooldown timer sprite for the given input key and caches it.
	* @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
	* @param {string} inputType The type of input for this key.
	* @returns {Sprite_CooldownTimer}
	*/
	getOrCreateInputKeyCooldownTimerSprite(cooldownData, inputType) {
		const isItem = this.hasSkillSlot() && this.skillSlot().isItem();
		const key = this.makeInputKeyCooldownTimerSpriteKey(cooldownData, inputType, isItem);
		if (this._j._spriteCache.has(key)) {
			return this._j._spriteCache.get(key);
		}
		const sprite = new Sprite_CooldownTimer(inputType, cooldownData, isItem);
		this._j._spriteCache.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates the key for the input key combo gauge sprite based on the parameters.
	* @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
	* @param {JABS_Button} inputType The type of input for this key.
	* @returns {string}
	*/
	makeInputKeyComboGaugeSpriteKey(cooldownData, inputType) {
		return `combo-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
	}
	/**
	* Creates a combo gauge sprite for the given input key and caches it.
	* @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
	* @param {JABS_Button} inputType The type of input for this key.
	* @returns {Sprite_CooldownGauge}
	*/
	getOrCreateInputKeyComboGaugeSprite(cooldownData, inputType) {
		const key = this.makeInputKeyComboGaugeSpriteKey(cooldownData, inputType);
		if (this._j._spriteCache.has(key)) {
			return this._j._spriteCache.get(key);
		}
		const sprite = new Sprite_CooldownGauge(cooldownData);
		this._j._spriteCache.set(key, sprite);
		sprite.hide();
		sprite.rotation = 270 * (Math.PI / 180);
		sprite.scale.x = .6;
		sprite.scale.y = 1.1;
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates the key for the input key skill name sprite based on the parameters.
	* @param {string} inputType The type of input for this key.
	* @returns {string}
	*/
	makeInputKeySkillNameSpriteKey(inputType) {
		return `skillname-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
	}
	/**
	* Creates a skill name sprite for the given input key and caches it.
	* @param {JABS_SkillSlot} skillSlot The slot associated with this skill.
	* @param {string} inputType The type of input for this key.
	* @returns {Sprite_SkillName}
	*/
	getOrCreateInputKeySkillNameSprite(skillSlot, inputType) {
		const key = this.makeInputKeySkillNameSpriteKey(inputType);
		if (this._j._spriteCache.has(key)) {
			return this._j._spriteCache.get(key);
		}
		const sprite = new Sprite_SkillName(skillSlot).setFontSize(12).setAlignment(Sprite_BaseText.Alignments.Center);
		this._j._spriteCache.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates the key for the input key skill name sprite based on the parameters.
	* The offhand slot includes the equipped skill id so that swapping between a guard
	* skill and an action skill produces a fresh sprite with the correct label.
	* @param {JABS_SkillSlot} skillSlot The slot being labelled.
	* @param {string} inputType The type of input for this key.
	* @returns {string}
	*/
	makeInputKeySlotNameSpriteKey(skillSlot, inputType) {
		const slotId = inputType === JABS_Button.Offhand ? skillSlot.id : 0;
		return `slotname-${this.battler().name()}-${this.battler().battlerId()}-${inputType}-${slotId}`;
	}
	/**
	* Creates a slot name sprite for the given input key and caches it.
	* @param {JABS_SkillSlot} skillSlot The slot to create a name for.
	* @param {string} inputType The type of input for this key.
	* @returns {Sprite_BaseText}
	*/
	getOrCreateInputKeySlotNameSprite(skillSlot, inputType) {
		const key = this.makeInputKeySlotNameSpriteKey(skillSlot, inputType);
		if (this._j._spriteCache.has(key)) {
			return this._j._spriteCache.get(key);
		}
		let labelText = inputType.toUpperCase();
		if (skillSlot.isSecondarySlot()) {
			labelText = labelText.replace("COMBAT", String.empty);
		}
		if (inputType === JABS_Button.Offhand && skillSlot.id && JABS_Battler.isGuardSkillById(skillSlot.id)) {
			labelText = "GUARD";
		}
		const sprite = new Sprite_BaseText(labelText).setFontSize(12).setAlignment(Sprite_BaseText.Alignments.Center).setBold(true);
		this._j._spriteCache.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Draws the input key sprite based on the currently assigned data.
	*/
	drawInputKey() {
		if (!this.canDrawInputKey()) return;
		const x = 0;
		const y = 0;
		this.drawInputKeySkillIcon(x, y);
		if (!this.skillSlot().isItem()) {
			this.drawInputKeyHpCost(x, y);
			this.drawInputKeyMpCost(x, y);
			this.drawInputKeyTpCost(x, y);
		} else {
			this.drawInputKeyItemCost(x, y);
		}
		this.drawInputKeyComboGauge(x, y);
		this.drawInputKeyCooldownTimer(x, y);
		this.drawInputKeySkillName(x, y);
		this.drawInputKeySlotName(x, y);
	}
	/**
	* Checks whether or not this input key has the necessary data in order
	* to draw the sprite.
	* @returns {boolean}
	*/
	canDrawInputKey() {
		if (!this.hasSkillSlot()) return false;
		if (!this.hasBattler()) return false;
		if (!this.skillId()) return false;
		return true;
	}
	/**
	* Draws the input key's associated skill icon.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawInputKeySkillIcon(x, y) {
		const skillSlot = this.skillSlot();
		const inputType = this.skillSlot().key;
		const sprite = this.getOrCreateInputKeyIconSprite(skillSlot, inputType);
		sprite.show();
		sprite.move(x + 6, y + 20);
	}
	/**
	* Draws the input key's associated mp cost.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawInputKeyHpCost(x, y) {
		const skillSlot = this.skillSlot();
		const inputType = this.skillSlot().key;
		const sprite = this.getOrCreateInputKeySkillCostSprite(skillSlot, Sprite_SkillCost.Types.HP, inputType);
		sprite.show();
		sprite.move(x - 2, y - 10);
	}
	/**
	* Draws the input key's associated mp cost.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawInputKeyMpCost(x, y) {
		const skillSlot = this.skillSlot();
		const inputType = this.skillSlot().key;
		const sprite = this.getOrCreateInputKeySkillCostSprite(skillSlot, Sprite_SkillCost.Types.MP, inputType);
		sprite.show();
		sprite.move(x - 2, y);
	}
	/**
	* Draws the input key's associated tp cost.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawInputKeyTpCost(x, y) {
		const skillSlot = this.skillSlot();
		const inputType = this.skillSlot().key;
		const sprite = this.getOrCreateInputKeySkillCostSprite(skillSlot, Sprite_SkillCost.Types.TP, inputType);
		sprite.show();
		sprite.move(x - 2, y + 10);
	}
	/**
	* Draws the input key's associated item cost.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawInputKeyItemCost(x, y) {
		const skillSlot = this.skillSlot();
		const inputType = this.skillSlot().key;
		const sprite = this.getOrCreateInputKeySkillCostSprite(skillSlot, Sprite_SkillCost.Types.Item, inputType);
		sprite.show();
		sprite.move(x + 42, y + 24);
	}
	/**
	* Draws the input key's associated combo gauge.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawInputKeyComboGauge(x, y) {
		const cooldownData = this.cooldownData();
		const inputType = this.skillSlot().key;
		const sprite = this.getOrCreateInputKeyComboGaugeSprite(cooldownData, inputType);
		sprite.setHudGcdMerge(this.jabsBattler(), this.skillSlot());
		sprite.show();
		sprite.move(x + 32, y + 32);
	}
	/**
	* Draws the input key's associated cooldown data in text.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawInputKeyCooldownTimer(x, y) {
		const cooldownData = this.cooldownData();
		const inputType = this.skillSlot().key;
		const sprite = this.getOrCreateInputKeyCooldownTimerSprite(cooldownData, inputType);
		sprite.show();
		sprite.move(x + 28, y + 16);
	}
	/**
	* Draws the input key's skill's name.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawInputKeySkillName(x, y) {
		const skillSlot = this.skillSlot();
		const inputType = this.skillSlot().key;
		const sprite = this.getOrCreateInputKeySkillNameSprite(skillSlot, inputType);
		sprite.show();
		sprite.move(x, y + 36);
	}
	drawInputKeySlotName(x, y) {
		const skillSlot = this.skillSlot();
		const inputType = this.skillSlot().key;
		const sprite = this.getOrCreateInputKeySlotNameSprite(skillSlot, inputType);
		sprite.show();
		sprite.move(x, y + 48);
	}
};

//#endregion
//#region src/plugins/hud/ext/input/windows/Window_InputFrame.js
/**
* A window displaying available skills and button inputs.
*/
var Window_InputFrame = class Window_InputFrame extends Window_Frame {
	/**
	* Modes for how the input diamond should render.
	* @type {{ Base: string, Skills: string }}
	*/
	static Modes = {
		Base: "base",
		Skills: "skills"
	};
	/**
	* The visual gap (in pixels) between the top and bottom bodies of the diamond.
	* Also used by the scene’s window sizing to keep things in sync.
	* Tweak this to 4/6/etc to fiddle the spacing.
	* @returns {number}
	*/
	static get DiamondGap() {
		return 6;
	}
	/**
	* Constructor.
	* @param {Rectangle} rect The shape of this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* The rough estimate of width for a single input key and all its subsprites.
	* @returns {number}
	*/
	inputKeyWidth() {
		return 72;
	}
	/**
	* The rough estimate of height for a single input key and all its subsprites.
	* @returns {number}
	*/
	inputKeyHeight() {
		return 72;
	}
	/**
	* Initializes all members of this class.
	*/
	initMembers() {
		super.initMembers();
		/**
		* The battler of which to track inputs for.
		* @type {Game_Actor}
		*/
		this._j._battler = null;
		/**
		* Whether or not the window needs a refresh internally.
		* This is toggled after all draws are executed and tracked to
		* prevent unnecessary redraws.
		* @type {boolean}
		*/
		this._j._needsRefresh = true;
		/**
		* A grouping for tracking last-known values used to determine
		* if this HUD requires a refresh.
		*/
		this._j._last ||= {};
		/**
		* Tracks whether SkillTrigger was held on the last processed frame.
		* Used to request refreshes only when the held state changes so we
		* preserve the "draw only when needed" behavior.
		* @type {boolean}
		*/
		this._j._last._skillTriggerHeld = false;
		/**
		* Tracks whether the party was considered in combat on the last processed frame.
		* Used to request refresh on combat context changes so the left node can
		* swap between Sprint (out of combat) and Mobility/Dodge (in combat).
		* @type {boolean}
		*/
		this._j._last._partyInCombat = false;
		/**
		* A grouping for tracking the flip progress and direction.
		*/
		this._j._flip ||= {};
		/**
		* The current progress for the flip animation.
		* @type {number}
		*/
		this._j._flip._progress = 0;
		/**
		* The maximum duration for the flip animation.
		* @type {number}
		*/
		this._j._flip._max = 10;
		/**
		* The current direction of the flip animation.
		* @type {number}
		*/
		this._j._flip._direction = 0;
	}
	/**
	* Gets whether or not the skill trigger is held.
	* @returns {boolean}
	*/
	skillTriggerHeld() {
		return this._j._last._skillTriggerHeld;
	}
	/**
	* Sets whether or not the skill trigger is held.
	* @param {boolean} value True if the skill trigger is held, false otherwise.
	*/
	setSkillTriggerHeld(value) {
		this._j._last._skillTriggerHeld = value;
	}
	/**
	* Gets whether or not the party is in combat.
	* @returns {boolean}
	*/
	partyInCombat() {
		return this._j._last._partyInCombat;
	}
	/**
	* Sets whether or not the party is in combat.
	* @param {boolean} value True if the party is in combat, false otherwise.
	*/
	setPartyInCombat(value) {
		this._j._last._partyInCombat = value;
	}
	/**
	* Gets the current flip progress (0..max).
	* @returns {number}
	*/
	getFlipProgress() {
		return this._j._flip._progress;
	}
	/**
	* Sets the current flip progress (0..max).
	* @param {number} value The new progress.
	*/
	setFlipProgress(value) {
		this._j._flip._progress = Math.max(0, value);
	}
	/**
	* Gets the maximum flip duration in frames.
	* @returns {number}
	*/
	getFlipMax() {
		return this._j._flip._max;
	}
	/**
	* Sets the maximum flip duration in frames.
	* @param {number} value The new max duration.
	*/
	setFlipMax(value) {
		this._j._flip._max = Math.max(0, value);
	}
	/**
	* Gets the current flip direction (-1, 0, +1).
	* @returns {number}
	*/
	getFlipDirection() {
		return this._j._flip._direction;
	}
	/**
	* Sets the current flip direction (-1, 0, +1).
	* @param {number} value The new direction.
	*/
	setFlipDirection(value) {
		const dir = value;
		if (dir < 0) {
			this._j._flip._direction = -1;
		} else if (dir > 0) {
			this._j._flip._direction = 1;
		} else {
			this._j._flip._direction = 0;
		}
	}
	/**
	* Executes any one-time configuration required for this window.
	*/
	configure() {
		super.configure();
		this.opacity = 0;
	}
	/**
	* Ensures all sprites are created and available for use.
	*/
	createCache() {
		super.createCache();
	}
	/**
	* Creates the key for the input key icon sprite based on the parameters.
	* @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
	* @param {JABS_Button} inputType The type of input for this key.
	* @returns {string}
	*/
	makeInputKeySlotSpriteKey(skillSlot, inputType) {
		return `inputkey-${$gameParty.leader().actorId()}-${inputType}`;
	}
	/**
	* Creates the input key sprite for the given slot.
	* @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
	* @param {JABS_Button} inputType The type of input for this key.
	* @returns {Sprite_InputKeySlot}
	*/
	getOrCreateInputKeySlotSprite(skillSlot, inputType) {
		const key = this.makeInputKeySlotSpriteKey(skillSlot, inputType);
		if (this._j._spriteCache.has(key)) {
			return this._j._spriteCache.get(key);
		}
		const sprite = new Sprite_InputKeySlot(skillSlot, $jabsEngine.getPlayer1());
		this._j._spriteCache.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Requests this window to clear and redraw its contents.
	*/
	requestInternalRefresh() {
		this._j._needsRefresh = true;
	}
	/**
	* Gets whether or not this window needs refresh.
	* @returns {boolean}
	*/
	needsInternalRefresh() {
		return this._j._needsRefresh;
	}
	/**
	* Flags internally this window for successfully refreshing text.
	*/
	acknowledgeInternalRefresh() {
		this._j._needsRefresh = false;
	}
	/**
	* Refreshes the contents of this window.
	*/
	refresh() {
		this.contents.clear();
		this.requestInternalRefresh();
	}
	/**
	* Hide all sprites for the hud.
	*/
	hideSprites() {
		this._j._spriteCache.forEach((sprite, _) => sprite.hide());
		this.requestInternalRefresh();
	}
	/**
	* Updates the logic for this window frame.
	*/
	updateFrame() {
		super.updateFrame();
		this.manageVisibility();
		this.checkSkillTrigger();
		this.checkCombatContext();
		this.advanceFlipAnimator();
		this.drawInputFrame();
	}
	/**
	* Checks if the player is holding the SkillTrigger and updates the internal state accordingly.
	*/
	checkSkillTrigger() {
		const currentlyHeld = this.isSkillTriggerHeld();
		if (this.skillTriggerHeld() !== currentlyHeld) {
			this.setSkillTriggerHeld(currentlyHeld);
			this.setFlipDirection(currentlyHeld ? +1 : -1);
			this.requestInternalRefresh();
		}
	}
	/**
	* Checks if the party combat context changed and updates internal state.
	*/
	checkCombatContext() {
		const currentlyInCombat = $gameParty.anyMemberInCombat();
		if (this.partyInCombat() !== currentlyInCombat) {
			this.setPartyInCombat(currentlyInCombat);
			this.requestInternalRefresh();
		}
	}
	/**
	* Manages visibility for the hud.
	*/
	manageVisibility() {
		this.handleMessageWindowInterference();
		if (this.playerInterference()) {
			this.handlePlayerInterference();
		} else {
			this.revertInterferenceOpacity();
		}
	}
	/**
	* Close and open the window based on whether or not the message window is up.
	*/
	handleMessageWindowInterference() {
		if ($gameMessage.isBusy() || $gameMap.isEventRunning()) {
			if (!this.isClosed()) {
				this.hideSprites();
				this.close();
			}
		} else {
			this.open();
		}
	}
	/**
	* Determines whether or not the player is in the way (or near it) of this window.
	* @returns {boolean} True if the player is in the way, false otherwise.
	*/
	playerInterference() {
		const playerX = $gamePlayer.screenX();
		const playerY = $gamePlayer.screenY();
		return playerX < this.width + 100 && playerY < this.height + 100;
	}
	/**
	* Manages opacity for all sprites while the player is interfering with the visibility.
	*/
	handlePlayerInterference() {
		this._j._spriteCache.forEach((sprite, _) => {
			if (sprite.opacity > 64) {
				sprite.opacity -= 15;
			} else if (sprite.opacity < 64) sprite.opacity += 1;
		});
	}
	/**
	* Reverts the opacity changes associated with the player getting in the way.
	*/
	revertInterferenceOpacity() {
		this._j._spriteCache.forEach((sprite, _) => {
			if (sprite.opacity < 255) {
				sprite.opacity += 15;
			} else if (sprite.opacity > 255) sprite.opacity = 255;
		});
	}
	/**
	* Advances the flip animator when active; requests refresh while animating.
	* Uses only accessors for state changes.
	*/
	advanceFlipAnimator() {
		if (this.getFlipDirection() === 0) {
			return;
		}
		const next = this.getFlipProgress() + this.getFlipDirection();
		const max = this.getFlipMax();
		if (next <= 0) {
			this.setFlipProgress(0);
			this.setFlipDirection(0);
		} else if (next >= max) {
			this.setFlipProgress(max);
			this.setFlipDirection(0);
		} else {
			this.setFlipProgress(next);
		}
		this.requestInternalRefresh();
	}
	/**
	* Computes current alphas for base and skills diamonds from the flip animator.
	* @returns {{alphaBase:number, alphaSkills:number}}
	*/
	computeFlipAlphas() {
		if (this.getFlipDirection() === 0) {
			const skillsActive = this.isSkillTriggerHeld();
			return {
				alphaBase: skillsActive ? 0 : 255,
				alphaSkills: skillsActive ? 255 : 0
			};
		}
		const max = this.getFlipMax();
		const prog = this.getFlipProgress();
		const t = max > 0 ? prog / max : 1;
		const alphaSkills = Math.round(255 * t);
		const alphaBase = 255 - alphaSkills;
		return {
			alphaBase,
			alphaSkills
		};
	}
	/**
	* Draws the input frame window in its entirety.
	*/
	drawInputFrame() {
		if (!this.canDrawInputFrame()) return;
		this.contents.clear();
		this.contentsBack.clear();
		this._j._spriteCache.forEach(((sprite) => {
			sprite.hide();
			sprite.drawInputKey();
		}));
		const alphas = this.computeFlipAlphas();
		const { alphaBase, alphaSkills } = alphas;
		if (alphaBase > 0) {
			this.contents.paintOpacity = alphaBase;
			this.drawDiamond(Window_InputFrame.Modes.Base, alphaBase);
		}
		if (alphaSkills > 0) {
			this.contents.paintOpacity = alphaSkills;
			this.drawDiamond(Window_InputFrame.Modes.Skills, alphaSkills);
		}
		this.contents.paintOpacity = 255;
		this.drawUsableItemSlot();
		this.drawModeLabels(alphaBase, alphaSkills);
		this.acknowledgeInternalRefresh();
	}
	/**
	* Determines whether or not we can draw the input frame.
	* @returns {boolean} True if we can, false otherwise.
	*/
	canDrawInputFrame() {
		if (!$gameParty.leader()) return false;
		if (!$hudManager.canShowHud()) return false;
		if (!this.needsInternalRefresh()) return false;
		return true;
	}
	/**
	* Checks the current bindings for SkillTrigger and returns true if any bound
	* physical symbol is currently pressed. This is remap‑aware.
	* @returns {boolean}
	*/
	isSkillTriggerHeld() {
		const allBindings = Input.getAllBindings("JABS");
		const bound = allBindings && allBindings[JABS_Button.SkillTrigger] ? allBindings[JABS_Button.SkillTrigger] : [];
		for (let i = 0; i < bound.length; i++) {
			const symbol = bound[i];
			if (Input.isPressed(symbol)) {
				return true;
			}
		}
		return false;
	}
	/**
	* Draws the “Actions” and “Skills” labels with matching crossfade alphas.
	* @param {number} alphaBase The opacity (0..255) for the Actions label.
	* @param {number} alphaSkills The opacity (0..255) for the Skills label.
	*/
	drawModeLabels(alphaBase, alphaSkills) {
		const prevSize = this.contents.fontSize;
		const prevOutlineW = this.contents.outlineWidth;
		const prevOutlineC = this.contents.outlineColor;
		const prevPaint = this.contents.paintOpacity;
		this.contents.fontSize = prevSize + 2;
		this.contents.outlineWidth = 4;
		this.contents.outlineColor = "rgba(0, 0, 0, 0.85)";
		const leftMargin = 8;
		const rightMargin = 8;
		const topMargin = 2;
		if (alphaBase > 0) {
			this.contents.paintOpacity = alphaBase;
			const text = "Actions";
			this.drawText(text, leftMargin, topMargin, 160, "left");
		}
		if (alphaSkills > 0) {
			this.contents.paintOpacity = alphaSkills;
			const text = "Skills";
			const tw = this.textSizeEx(text).width;
			const x = Math.max(0, this.contentsWidth() - rightMargin - tw);
			this.drawText(text, x, topMargin, tw, "right");
		}
		this.contents.fontSize = prevSize;
		this.contents.outlineWidth = prevOutlineW;
		this.contents.outlineColor = prevOutlineC;
		this.contents.paintOpacity = prevPaint;
	}
	/**
	* Draws a multi-layer HUD panel background that looks richer than a flat gradient.
	* Renders shadow to contentsBack, then gradient/border/gloss/tint to contents.
	* @param {number} x The left of the panel (contents space).
	* @param {number} y The top of the panel (contents space).
	* @param {number} w The width of the panel.
	* @param {number} h The height of the panel.
	* @param {{
	*   tint?: string,
	*   tintAlpha?: number,
	*   cornerPad?: number,
	* }} [options] Optional styling overrides.
	*/
	drawHudPanelFancy(x, y, w, h, options) {
		const opts = options || {};
		const tint = opts.tint || null;
		const tintAlpha = Number(opts.tintAlpha || 0);
		const radius = Math.max(0, Number(opts.cornerPad || 0));
		const back1 = ColorManager.itemBackColor1();
		const back2 = ColorManager.itemBackColor2();
		if (w <= 0 || h <= 0) return;
		const roundRectPath = (ctx, rx, ry, rw, rh, r) => {
			const rr = Math.min(r, Math.floor(Math.min(rw, rh) / 2));
			if (rr <= 0) {
				ctx.rect(rx, ry, rw, rh);
				return;
			}
			const r2 = rr * 2;
			ctx.moveTo(rx + rr, ry);
			ctx.lineTo(rx + rw - rr, ry);
			ctx.arc(rx + rw - rr, ry + rr, rr, Math.PI * 1.5, 0);
			ctx.lineTo(rx + rw, ry + rh - rr);
			ctx.arc(rx + rw - rr, ry + rh - rr, rr, 0, Math.PI * .5);
			ctx.lineTo(rx + rr, ry + rh);
			ctx.arc(rx + rr, ry + rh - rr, rr, Math.PI * .5, Math.PI);
			ctx.lineTo(rx, ry + rr);
			ctx.arc(rx + rr, ry + rr, rr, Math.PI, Math.PI * 1.5);
		};
		{
			const sb = this.contentsBack;
			const ctx = sb.context;
			ctx.save();
			ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
			for (let i = 1; i <= 3; i++) {
				ctx.beginPath();
				roundRectPath(ctx, x + i, y + i + 1, w, h, radius);
				ctx.fill();
			}
			ctx.restore();
			sb._baseTexture.update();
		}
		const c = this.contents;
		const ctx = c.context;
		ctx.save();
		const grad = ctx.createLinearGradient(0, y + h, 0, y);
		grad.addColorStop(0, back1);
		grad.addColorStop(.5, back2);
		grad.addColorStop(1, back1);
		ctx.fillStyle = grad;
		ctx.beginPath();
		roundRectPath(ctx, x, y, w, h, radius);
		ctx.fill();
		const midH = Math.max(6, Math.floor(h * .25));
		const midY = y + Math.floor((h - midH) / 2);
		const midGrad = ctx.createLinearGradient(0, midY + midH, 0, midY);
		midGrad.addColorStop(0, "rgba(255,255,255,0.00)");
		midGrad.addColorStop(1, "rgba(255,255,255,0.06)");
		ctx.fillStyle = midGrad;
		ctx.beginPath();
		roundRectPath(ctx, x + 1, midY, w - 2, midH, Math.max(0, radius - 1));
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
		ctx.beginPath();
		roundRectPath(ctx, x + .5, y + .5, w - 1, h - 1, Math.max(0, radius - .5));
		ctx.stroke();
		const glossH = Math.max(4, Math.floor(h * .2));
		const glossGrad = ctx.createLinearGradient(0, y + glossH, 0, y);
		glossGrad.addColorStop(0, "rgba(255,255,255,0.18)");
		glossGrad.addColorStop(1, "rgba(255,255,255,0.00)");
		ctx.fillStyle = glossGrad;
		ctx.beginPath();
		roundRectPath(ctx, x + 1, y + 1, w - 2, glossH, Math.max(0, radius - 1));
		ctx.fill();
		if (tint && tintAlpha > 0) {
			ctx.globalAlpha = Math.max(0, Math.min(1, tintAlpha));
			ctx.fillStyle = tint;
			ctx.beginPath();
			roundRectPath(ctx, x, y, w, h, radius);
			ctx.fill();
		}
		ctx.restore();
		c._baseTexture.update();
	}
	/**
	* Renders a diamond from the window's upper-left using shared coordinates.
	* The parent computes x/y once per node and draws exactly four buttons.
	* @param {string} mode One of {@link Window_InputFrame.Modes}.
	* @param {number} slotOpacity The opacity to apply to slot sprites (0..255).
	*/
	drawDiamond(mode, slotOpacity) {
		const ikw = this.inputKeyWidth();
		const ikh = this.inputKeyHeight();
		const cx = Math.floor(this.width / 2) + 4;
		const cy = Math.floor(this.height / 2) - 10;
		const desiredGap = Window_InputFrame.DiamondGap;
		const halfIkw = Math.floor(ikw / 2);
		const halfIkh = Math.floor(ikh / 2);
		const verticalCenterDistance = ikh + desiredGap;
		const topCenterY = cy - Math.floor(verticalCenterDistance / 2);
		const bottomCenterY = cy + Math.floor(verticalCenterDistance / 2);
		const topY = topCenterY - halfIkh - 20;
		const bottomY = bottomCenterY - halfIkh - 20;
		const sideCenterOffset = ikw + desiredGap;
		const leftCenterX = cx - sideCenterOffset;
		const rightCenterX = cx + sideCenterOffset;
		const leftX = leftCenterX - halfIkw;
		const rightX = rightCenterX - halfIkw;
		const sideY = cy - halfIkh - 20;
		const topX = cx - halfIkw;
		const bottomX = cx - halfIkw;
		switch (mode) {
			case Window_InputFrame.Modes.Skills: {
				this.drawButton(topX, topY, JABS_Button.CombatSkill4, slotOpacity);
				this.drawButton(leftX, sideY, JABS_Button.CombatSkill3, slotOpacity);
				this.drawButton(rightX, sideY, JABS_Button.CombatSkill2, slotOpacity);
				this.drawButton(bottomX, bottomY, JABS_Button.CombatSkill1, slotOpacity);
				break;
			}
			case Window_InputFrame.Modes.Base:
			default: {
				const leftButton = this.partyInCombat() ? JABS_Button.Dodge : JABS_Button.Sprint;
				this.drawButton(topX, topY, JABS_Button.Tool, slotOpacity);
				this.drawButton(leftX, sideY, leftButton, slotOpacity);
				this.drawButton(rightX, sideY, JABS_Button.Offhand, slotOpacity);
				this.drawButton(bottomX, bottomY, JABS_Button.Mainhand, slotOpacity);
				break;
			}
		}
	}
	/**
	* Draw a single button at x,y.
	* Sprint is a special case (not a skillslot), everything else uses drawInputKey().
	* @param {number} x The x coordinate (CONTENTS space).
	* @param {number} y The y coordinate (CONTENTS space).
	* @param {string} button The logical button (from {@link JABS_Button}).
	* @param {number} opacity The per-pass opacity (0..255) for slot sprites.
	*/
	drawButton(x, y, button, opacity) {
		if (button === JABS_Button.Sprint) {
			this.drawSprintNode(x, y);
			return;
		}
		this.drawInputKey(button, x, y, opacity);
	}
	/**
	* Draws a Sprint node styled like a skill slot: a panel,
	* a centered icon, and a small label reading "dash".
	* @param {number} x The x coordinate for the node (contents space).
	* @param {number} y The y coordinate for the node (contents space).
	*/
	drawSprintNode(x, y) {
		const ikw = this.inputKeyWidth();
		const ikh = this.inputKeyHeight();
		const panelX = x - 10;
		const panelY = y + 20;
		const panelW = ikw - 10;
		const panelH = ikh;
		this.drawHudPanelFancy(panelX, panelY, panelW, panelH, {
			tint: null,
			tintAlpha: 0
		});
		const iconIndex = 140;
		const iconW = ImageManager.iconWidth;
		const iconH = ImageManager.iconHeight;
		const labelReserve = 18;
		const iconX = panelX + Math.floor((panelW - iconW) / 2);
		const iconY = panelY + Math.max(0, Math.floor((panelH - labelReserve - iconH) / 2));
		this.drawIcon(iconIndex, iconX, iconY);
		const originalSize = this.contents.fontSize;
		const originalOutlineW = this.contents.outlineWidth;
		const originalOutlineC = this.contents.outlineColor;
		this.setFontSize(originalSize - 10);
		this.contents.outlineWidth = 4;
		this.contents.outlineColor = "rgba(0, 0, 0, 0.85)";
		const text = "Dash";
		const tw = this.textSizeEx(text).width;
		const labelX = panelX + Math.floor((panelW - tw) / 2) - 5;
		const labelY = panelY + panelH - labelReserve - 16;
		this.drawText(text, labelX, labelY, tw, "left");
		this.setFontSize(originalSize);
		this.contents.outlineWidth = originalOutlineW;
		this.contents.outlineColor = originalOutlineC;
	}
	/**
	* Draws the usable-item slot to the right of the diamond's rightmost node.
	* Uses the same coordinate geometry as {@link drawDiamond} to stay in sync.
	* The panel is always visible; an empty slot shows a placeholder icon and label.
	*/
	drawUsableItemSlot() {
		const ikw = this.inputKeyWidth();
		const ikh = this.inputKeyHeight();
		const desiredGap = Window_InputFrame.DiamondGap;
		const cx = Math.floor(this.width / 2) + 4;
		const cy = Math.floor(this.height / 2) - 10;
		const halfIkw = Math.floor(ikw / 2);
		const halfIkh = Math.floor(ikh / 2);
		const rightCenterX = cx + (ikw + desiredGap);
		const usableItemX = rightCenterX + halfIkw + desiredGap;
		const sideY = cy - halfIkh - 20;
		const panelWidth = ikw - 10;
		const panelHeight = ikh;
		const panelX = usableItemX - 10;
		const panelY = sideY + 20;
		this.drawHudPanelFancy(panelX, panelY, panelWidth, panelHeight, {
			tint: null,
			tintAlpha: 0
		});
		const leader = $gameParty.leader();
		if (!leader) {
			this.drawEmptyUsableItemSlotContent(panelX, panelY, panelWidth, panelHeight);
			return;
		}
		const skillSlot = leader.getUsableItemSkillSlot();
		if (!skillSlot) {
			this.drawEmptyUsableItemSlotContent(panelX, panelY, panelWidth, panelHeight);
			return;
		}
		const sprite = this.getOrCreateInputKeySlotSprite(skillSlot, JABS_Button.UsableItem);
		if (skillSlot.isEmpty()) {
			sprite.hide();
			this.drawEmptyUsableItemSlotContent(panelX, panelY, panelWidth, panelHeight);
			return;
		}
		this.drawInputKeySlotSprite(skillSlot, JABS_Button.UsableItem, usableItemX, sideY, 255, true);
	}
	/**
	* Draws placeholder contents inside an empty usable-item slot panel.
	* @param {number} panelX The panel left edge in contents space.
	* @param {number} panelY The panel top edge in contents space.
	* @param {number} panelWidth The panel width.
	* @param {number} panelHeight The panel height.
	*/
	drawEmptyUsableItemSlotContent(panelX, panelY, panelWidth, panelHeight) {
		const iconW = ImageManager.iconWidth;
		const iconH = ImageManager.iconHeight;
		const labelReserve = 18;
		const iconX = panelX + Math.floor((panelWidth - iconW) / 2);
		const iconY = panelY + Math.max(0, Math.floor((panelHeight - labelReserve - iconH) / 2));
		this.drawIcon(0, iconX, iconY);
		const originalSize = this.contents.fontSize;
		const originalOutlineW = this.contents.outlineWidth;
		const originalOutlineC = this.contents.outlineColor;
		this.setFontSize(originalSize - 10);
		this.contents.outlineWidth = 4;
		this.contents.outlineColor = "rgba(0, 0, 0, 0.85)";
		this.changeTextColor(ColorManager.dimColor1());
		const text = "Item";
		const tw = this.textSizeEx(text).width;
		const labelX = panelX + Math.floor((panelWidth - tw) / 2) - 5;
		const labelY = panelY + panelHeight - labelReserve - 16;
		this.drawText(text, labelX, labelY, tw, "left");
		this.resetTextColor();
		this.setFontSize(originalSize);
		this.contents.outlineWidth = originalOutlineW;
		this.contents.outlineColor = originalOutlineC;
	}
	/**
	* Draws a single input key of the input frame.
	* @param {string} inputType The type of input key this is.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} opacity The per-pass opacity (0..255) for slot sprites.
	*/
	drawInputKey(inputType, x, y, opacity) {
		const jabsPlayer = $jabsEngine.getPlayer1();
		const actionKeyData = jabsPlayer.getActionKeyData(inputType);
		if (!actionKeyData) return;
		const skillSlot = actionKeyData.skillslot;
		this.drawInputKeySlotSprite(skillSlot, inputType, x, y, opacity);
	}
	/**
	* Draw the input key associated with a given skill slot.
	* @param {JABS_SkillSlot} skillSlot The skill slot to draw.
	* @param {string} inputType The type of input key this is.
	* @param {number} x The x coordinate (CONTENTS space).
	* @param {number} y The y coordinate (CONTENTS space).
	* @param {number} opacity The per-pass opacity (0..255) for the slot sprite.
	* @param {boolean} skipPanel When true, the caller already drew the HUD panel (usable-item slot).
	*/
	drawInputKeySlotSprite(skillSlot, inputType, x, y, opacity, skipPanel = false) {
		const sprite = this.getOrCreateInputKeySlotSprite(skillSlot, inputType);
		if (skipPanel === false && !skillSlot.isEmpty()) {
			const width = this.inputKeyWidth() - 10;
			const height = this.inputKeyHeight();
			this.drawHudPanelFancy(x - 10, y + 20, width, height, {
				tint: null,
				tintAlpha: 0
			});
		}
		const px = this.padding + x - 4;
		const py = this.padding + y + 14;
		sprite.show();
		sprite.move(px, py);
		sprite.opacity = Math.max(0, Math.min(255, opacity || 255));
	}
};

//#endregion
//#region src/plugins/hud/ext/input/scenes/Scene_Map.js
/**
* Hooks into `initialize` to add our hud.
*/
J.HUD.EXT.INPUT.Aliased.Scene_Map.set("initHudMembers", Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function() {
	J.HUD.EXT.INPUT.Aliased.Scene_Map.get("initHudMembers").call(this);
	/**
	* The input frame window on the map.
	* @type {Window_InputFrame}
	*/
	this._j._hud._inputFrame = null;
};
/**
* Once the map is loaded, create the text log.
*/
J.HUD.EXT.INPUT.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.HUD.EXT.INPUT.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createInputFrameWindow();
};
/**
* Creates the input frame window and adds it to tracking.
*/
Scene_Map.prototype.createInputFrameWindow = function() {
	const window = this.buildInputFrameWindow();
	this.setInputFrameWindow(window);
	this.addWindow(window);
};
/**
* Sets up and defines the input frame window.
* @returns {Window_InputFrame}
*/
Scene_Map.prototype.buildInputFrameWindow = function() {
	const rectangle = this.inputFrameWindowRect();
	const window = new Window_InputFrame(rectangle);
	return window;
};
/**
* Creates the rectangle representing the window for the input frame.
* @returns {Rectangle}
*/
Scene_Map.prototype.inputFrameWindowRect = function() {
	const ikw = 72;
	const ikh = 72;
	const bodyGap = Window_InputFrame.DiamondGap;
	const diamondBodyWidth = 3 * ikw + 2 * bodyGap;
	const diamondBodyHeight = 2 * ikh + bodyGap;
	const labelReserveEachSide = 48;
	const marginX = 24;
	const marginY = 24;
	const usableItemSlotReserve = ikw + 16;
	const width = Math.ceil(diamondBodyWidth + labelReserveEachSide * 2 + marginX + usableItemSlotReserve);
	const height = Math.ceil(diamondBodyHeight + marginY);
	const x = Math.floor((Graphics.boxWidth - width) / 2);
	const y = Graphics.boxHeight - height;
	return new Rectangle(x, y, width, height);
};
/**
* Gets the currently tracked input frame window.
* @returns {Window_InputFrame}
*/
Scene_Map.prototype.getInputFrameWindow = function() {
	return this._j._hud._inputFrame;
};
/**
* Set the currently tracked input frame window to the given window.
* @param {Window_InputFrame} window The window to track.
*/
Scene_Map.prototype.setInputFrameWindow = function(window) {
	this._j._hud._inputFrame = window;
};
/**
* Extend the update loop for the input frame.
*/
J.HUD.EXT.INPUT.Aliased.Scene_Map.set("updateHudFrames", Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function() {
	J.HUD.EXT.INPUT.Aliased.Scene_Map.get("updateHudFrames").call(this);
	this.handleInputFrameUpdate();
};
/**
* Processes incoming requests regarding the input frame.
*/
Scene_Map.prototype.handleInputFrameUpdate = function() {
	this.handleRefreshInputFrame();
	this.handleVisibilityInputFrame();
};
/**
* Processes incoming requests regarding refreshing the input frame.
*/
Scene_Map.prototype.handleRefreshInputFrame = function() {
	if ($hudManager.hasRequestRefreshInputFrame()) {
		this.getInputFrameWindow().refresh();
		$hudManager.acknowledgeRefreshInputFrame();
	}
};
/**
* Processes incoming requests regarding the input frame.
*/
Scene_Map.prototype.handleVisibilityInputFrame = function() {
	const inputFrameWindow = this.getInputFrameWindow();
	if ($hudManager.canShowHud()) {
		inputFrameWindow.show();
	} else {
		inputFrameWindow.hide();
		inputFrameWindow.hideSprites();
	}
};
/**
* Refreshes the hud on-command.
*/
J.HUD.EXT.INPUT.Aliased.Scene_Map.set("refreshHud", Scene_Map.prototype.refreshHud);
Scene_Map.prototype.refreshHud = function() {
	J.HUD.EXT.INPUT.Aliased.Scene_Map.get("refreshHud").call(this);
	const inputFrameWindow = this.getInputFrameWindow();
	inputFrameWindow.refreshCache();
	inputFrameWindow.refresh();
};

//#endregion
//# sourceMappingURL=J-HUD-InputFrame.js.map