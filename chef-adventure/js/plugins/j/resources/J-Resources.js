//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 RESOURCES] Extends skill cost/gain system to include HP, MP, and TP.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-Base-Save
 * @help
 * ============================================================================
 * Please refer to J-Resources's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/resources/core/index.md
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 101
 */
//endregion annotations

//#region src/plugins/resources/core/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-Resources.
*/
var JResources_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	*  Extends {@link #postInitialize}.<br>
	*  Includes translation of plugin parameters.
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
		* The id of a switch that represents whether or not this system is accessible in the menu.
		* @type {number}
		*/
		this.menuSwitchId = parseInt(this.parsedPluginParameters["menu-switch"]);
	}
};

//#endregion
//#region src/plugins/resources/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.RESOURCES = {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.RESOURCES.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.RESOURCES.Metadata = new JResources_PluginMetadata("J-Resources", "1.2.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.RESOURCES.Aliased = {};
J.RESOURCES.Aliased.IconManager = new Map();
J.RESOURCES.Aliased.TextManager = new Map();
J.RESOURCES.Aliased.Scene_Boot = new Map();
J.RESOURCES.Aliased.Game_BattlerBase = new Map();
J.RESOURCES.Aliased.Game_Battler = new Map();
/**
* All regular expressions used by this plugin.
*/
J.RESOURCES.RegExp = {};
J.RESOURCES.RegExp.HpCostReduction = /<hcr:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.HpCostRateBuffPlus = /<hcrBuffPlus:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.HpCostRateBuffRate = /<hcrBuffRate:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.HpCostRateGrowthPlus = /<hcrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.HpCostRateGrowthRate = /<hcrGrowthRate:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.HpCostFlat = /<hp-cost:(\d+)>/gi;
J.RESOURCES.RegExp.HpCostPercent = /<hp-cost:(\d+)%>/gi;
J.RESOURCES.RegExp.HpCostFormula = /<hp-cost:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.HpCostLethal = /<hp-cost-can-kill>/i;
J.RESOURCES.RegExp.HpGainFlat = /<hp-gain:(\d+)>/i;
J.RESOURCES.RegExp.HpGainPercent = /<hp-gain:(\d+)%>/i;
J.RESOURCES.RegExp.HpGainFormula = /<hp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.MpCostFlat = /<mp-cost:(\d+)>/gi;
J.RESOURCES.RegExp.MpCostPercent = /<mp-cost:(\d+)%>/gi;
J.RESOURCES.RegExp.MpCostFormula = /<mp-cost:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.MpGainFlat = /<mp-gain:(\d+)>/i;
J.RESOURCES.RegExp.MpGainPercent = /<mp-gain:(\d+)%>/i;
J.RESOURCES.RegExp.MpGainFormula = /<mp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.TpCostFlat = /<tp-cost:(\d+)>/gi;
J.RESOURCES.RegExp.TpCostPercent = /<tp-cost:(\d+)%>/gi;
J.RESOURCES.RegExp.TpCostFormula = /<tp-cost:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.TpGainFlat = /<tp-gain:(\d+)>/i;
J.RESOURCES.RegExp.TpGainPercent = /<tp-gain:(\d+)%>/i;
J.RESOURCES.RegExp.TpGainFormula = /<tp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.StackCost = /<stackCost:[ ]?(\[\d+,[ ]?\d+])>/i;
J.RESOURCES.RegExp.ItemCost = /<itemCost:[ ]?(\[\d+,[ ]?\d+])>/i;

//#endregion
//#region src/plugins/resources/core/database/RPG_Traited.js
/**
* Gets the hp cost reduction for this battler.
* @returns {number}
*/
RPG_Traited.prototype.hcr = function() {
	return RPGManager.getResultFromNoteByRegex(this, J.RESOURCES.RegExp.HpCostReduction, 0);
};

//#endregion
//#region src/plugins/resources/core/managers/ColorManager.js
/**
* Gets the color for HP costs.
* Mirrors the existing {@link ColorManager.mpCostColor} and {@link ColorManager.tpCostColor}.
* @returns {string} The hex color string for HP cost text.
*/
ColorManager.hpCostColor = function() {
	return this.textColor(18);
};

//#endregion
//#region src/plugins/resources/core/managers/IconManager.js
/**
* Icon index for HP cost rate reduction in resource parameter UI.
* @returns {number}
*/
IconManager.hcr = function() {
	return 964;
};

//#endregion
//#region src/plugins/resources/core/managers/TextManager.js
/**
* Display label for HP cost rate — percent reduction on life-cost skills.
* @returns {string}
*/
TextManager.hcr = function() {
	return "Life Cost";
};
/**
* Help text explaining how HP cost rate makes life-cost skills cheaper.
* @returns {string[]}
*/
TextManager.hcrDescription = function() {
	return ["Percent reduction applied to HP skill costs.", "Higher values make life-cost skills cheaper to use."];
};

//#endregion
//#region src/plugins/resources/core/managers/ResourceManager.js
var ResourceCostManager = class ResourceCostManager {
	/**
	* Determines the individual cost components for a skill's HP cost.
	* All component values are post-HCR.
	* @param {Game_Actor|Game_Enemy} battler The battler to check.
	* @param {RPG_Skill} skill The skill to check.
	* @returns {{ flat: number, percent: number, calculatedPercent: number, formula: number }}
	*/
	static hpCostBreakdown(battler, skill) {
		const flatRaw = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.HpCostFlat);
		const percent = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.HpCostPercent);
		const calculatedPercentRaw = battler.mhp * (percent / 100);
		const formulaRaw = RPGManager.getResultFromNoteByRegex(skill, J.RESOURCES.RegExp.HpCostFormula, flatRaw + calculatedPercentRaw, battler);
		const hcr = battler.hcrFactor();
		return {
			flat: flatRaw * hcr,
			percent,
			calculatedPercent: calculatedPercentRaw * hcr,
			formula: formulaRaw * hcr
		};
	}
	/**
	* Determines the amount of HP cost for a skill.
	* @param {Game_Actor|Game_Enemy} battler The battler to check.
	* @param {RPG_Skill} skill The skill to check.
	* @returns {number}
	*/
	static hpCostBySkill(battler, skill) {
		const { flat, calculatedPercent, formula } = ResourceCostManager.hpCostBreakdown(battler, skill);
		if (flat === 0 && calculatedPercent === 0 && formula === 0) return 0;
		return flat + calculatedPercent + formula;
	}
	/**
	* Determines the individual extra-tag cost components for a skill's MP cost.
	* All component values are post-MCR.
	* @param {Game_Actor|Game_Enemy} battler The battler to check.
	* @param {RPG_Skill} skill The skill to check.
	* @returns {{ flat: number, percent: number, calculatedPercent: number, formula: number }}
	*/
	static extraMpCostBreakdown(battler, skill) {
		const flatRaw = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.MpCostFlat);
		const percent = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.MpCostPercent);
		const calculatedPercentRaw = battler.mmp * (percent / 100);
		const formulaRaw = RPGManager.getResultFromNoteByRegex(skill, J.RESOURCES.RegExp.MpCostFormula, flatRaw + calculatedPercentRaw, battler);
		const { mcr } = battler;
		return {
			flat: flatRaw * mcr,
			percent,
			calculatedPercent: calculatedPercentRaw * mcr,
			formula: formulaRaw * mcr
		};
	}
	/**
	* Determines the additional amount of MP cost for a skill.
	* @param {Game_Actor|Game_Enemy} battler The battler to check.
	* @param {RPG_Skill} skill The skill to check.
	* @returns {number}
	*/
	static extraMpCostBySkill(battler, skill) {
		const { flat, calculatedPercent, formula } = ResourceCostManager.extraMpCostBreakdown(battler, skill);
		if (flat === 0 && calculatedPercent === 0 && formula === 0) return 0;
		return flat + calculatedPercent + formula;
	}
	/**
	* Determines the individual extra-tag cost components for a skill's TP cost.
	* All component values are post-TCR.
	* @param {Game_Actor|Game_Enemy} battler The battler to check.
	* @param {RPG_Skill} skill The skill to check.
	* @returns {{ flat: number, percent: number, calculatedPercent: number, formula: number }}
	*/
	static extraTpCostBreakdown(battler, skill) {
		const flatRaw = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.TpCostFlat);
		const percent = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.TpCostPercent);
		const calculatedPercentRaw = battler.mtp * (percent / 100);
		const formulaRaw = RPGManager.getResultFromNoteByRegex(skill, J.RESOURCES.RegExp.TpCostFormula, flatRaw + calculatedPercentRaw, battler);
		const { tcr } = battler;
		return {
			flat: flatRaw * tcr,
			percent,
			calculatedPercent: calculatedPercentRaw * tcr,
			formula: formulaRaw * tcr
		};
	}
	/**
	* Determines the additional amount of TP cost for a skill.
	* @param {Game_Actor|Game_Enemy} battler The battler to check.
	* @param {RPG_Skill} skill The skill to check.
	* @returns {number}
	*/
	static extraTpCostBySkill(battler, skill) {
		const { flat, calculatedPercent, formula } = ResourceCostManager.extraTpCostBreakdown(battler, skill);
		if (flat === 0 && calculatedPercent === 0 && formula === 0) return 0;
		return flat + calculatedPercent + formula;
	}
	/**
	* Calculate the amount of HP gained from a skill.
	* @param {Game_Actor|Game_Enemy} battler The battler to gain hp.
	* @param {RPG_Skill} skill The skill to gain hp from.
	* @returns {number}
	*/
	static skillGainHp(battler, skill) {
		const battlerSkill = battler.skill(skill.id);
		const flatGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.HpGainFlat);
		const percentGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.HpGainPercent);
		const calculatedPercentGain = battler.mhp * (percentGain / 100);
		const formulaGains = RPGManager.getResultFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.HpGainFormula, flatGain + calculatedPercentGain, battler);
		if (flatGain === 0 && calculatedPercentGain === 0 && formulaGains === 0) return 0;
		const gains = (flatGain + calculatedPercentGain + formulaGains) * battler.rec;
		return gains;
	}
	/**
	* Calculate the amount of MP gained from a skill.
	* @param {Game_Actor|Game_Enemy} battler The battler to gain mp.
	* @param {RPG_Skill} skill The skill to gain mp from.
	* @returns {number}
	*/
	static skillGainMp(battler, skill) {
		const battlerSkill = battler.skill(skill.id);
		const flatGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.MpGainFlat);
		const percentGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.MpGainPercent);
		const calculatedPercentGain = battler.mmp * (percentGain / 100);
		const formulaGains = RPGManager.getResultFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.MpGainFormula, flatGain + calculatedPercentGain, battler);
		if (flatGain === 0 && calculatedPercentGain === 0 && formulaGains === 0) return 0;
		const gains = (flatGain + calculatedPercentGain + formulaGains) * battler.rec;
		return gains;
	}
	/**
	* Calculate the amount of TP gained from a skill.
	* @param {Game_Actor|Game_Enemy} battler The battler to gain tp.
	* @param {RPG_Skill} skill The skill to gain tp from.
	* @returns {number}
	*/
	static skillGainTp(battler, skill) {
		const battlerSkill = battler.skill(skill.id);
		const flatGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.TpGainFlat);
		const percentGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.TpGainPercent);
		const calculatedPercentGain = battler.mtp * (percentGain / 100);
		const formulaGains = RPGManager.getResultFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.TpGainFormula, flatGain + calculatedPercentGain, battler);
		if (flatGain === 0 && calculatedPercentGain === 0 && formulaGains === 0) return 0;
		const gains = (flatGain + calculatedPercentGain + formulaGains) * battler.rec;
		return gains;
	}
};

//#endregion
//#region src/plugins/resources/core/objects/Game_BattlerBase.js
/**
* Gets the hp cost reduction factor for this battler.
* @returns {number}
*/
Game_BattlerBase.prototype.hcrFactor = function() {
	return 1;
};
/**
* HP cost reduction in decimal percent space (0 = none).
*/
Object.defineProperty(Game_BattlerBase.prototype, "hcr", {
	get: function() {
		return 0;
	},
	configurable: true
});
/**
* Determines the hp cost of a skill.
* @param {RPG_Skill} skill The skill being calculated.
* @returns {number}
*/
Game_BattlerBase.prototype.skillHpCost = function(skill) {
	return ResourceCostManager.hpCostBySkill(this, skill);
};
/**
* Determines the state-stack cost of a skill, if any.
* Skill-scoped only, same as every other cost tag- costs are inherent to the skill, not
* something a caster's states/equips should be able to silently inject.
* @param {RPG_Skill} skill The skill being calculated.
* @returns {[number, number]} A `[stateId, count]` tuple; `[0, 0]` when no tag is present.
*/
Game_BattlerBase.prototype.skillStackCost = function(skill) {
	const [stateId = 0, count = 0] = RPGManager.getArrayFromNotesByRegex(skill, J.RESOURCES.RegExp.StackCost);
	return [stateId, count];
};
/**
* Determines the inventory-item cost of a skill, if any.
* Skill-scoped only, same as every other cost tag.
* @param {RPG_Skill} skill The skill being calculated.
* @returns {[number, number]} An `[itemId, count]` tuple; `[0, 0]` when no tag is present.
*/
Game_BattlerBase.prototype.skillItemCost = function(skill) {
	const [itemId = 0, count = 0] = RPGManager.getArrayFromNotesByRegex(skill, J.RESOURCES.RegExp.ItemCost);
	return [itemId, count];
};
/**
* Extends {@link Game_BattlerBase.prototype.skillMpCost}.<br/>
* Includes extended MP costs from tags.
* @param {RPG_Skill} skill The skill cost being calculated.
* @returns {number}
*/
J.RESOURCES.Aliased.Game_BattlerBase.set("skillMpCost", Game_BattlerBase.prototype.skillMpCost);
Game_BattlerBase.prototype.skillMpCost = function(skill) {
	const baseCost = J.RESOURCES.Aliased.Game_BattlerBase.get("skillMpCost").call(this, skill);
	const extraCost = ResourceCostManager.extraMpCostBySkill(this, skill);
	const cost = Math.max(0, baseCost + extraCost);
	return cost;
};
/**
* Extends {@link Game_BattlerBase.prototype.skillTpCost}.<br/>
* Includes extended TP costs from tags.
* @param {RPG_Skill} skill The skill cost being calculated.
* @returns {number}
*/
J.RESOURCES.Aliased.Game_BattlerBase.set("skillTpCost", Game_BattlerBase.prototype.skillTpCost);
Game_BattlerBase.prototype.skillTpCost = function(skill) {
	const baseCost = J.RESOURCES.Aliased.Game_BattlerBase.get("skillTpCost").call(this, skill);
	const extraCost = ResourceCostManager.extraTpCostBySkill(this, skill);
	const cost = Math.max(0, (baseCost + extraCost) * this.tcr);
	return cost;
};

//#endregion
//#region src/plugins/resources/core/objects/Game_Battler.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the resources members.
*/
J.RESOURCES.Aliased.Game_Battler.set("initMembers", Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function() {
	J.RESOURCES.Aliased.Game_Battler.get("initMembers").call(this);
	this.initResourcesMembers();
};
/**
* Initializes the resources members.
*/
Game_Battler.prototype.initResourcesMembers = function() {
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with resources.
	*/
	this._j._resources ||= {};
	/**
	* The hp cost reduction for this battler.
	* @type {number}
	*/
	this._j._hcr = 100;
};
/**
* HP cost reduction in decimal percent space (0 = none).<br/>
* The mirror image of {@link #hcrFactor}: whatever share of the cost that factor removes.
*/
Object.defineProperty(Game_Battler.prototype, "hcr", {
	get: function() {
		return Math.max(0, 1 - this.hcrFactor());
	},
	configurable: true
});
/**
* Gets the raw hp-cost-reduction percentage as stored (100 means no reduction).
*
* This is deliberately not {@link Game_Battler#hcr}, which normalises the same value into the
* fractional multiplier the cost math consumes.
* @returns {number} The stored hcr percentage.
*/
Game_Battler.prototype.hcrPercent = function() {
	return this._j._hcr;
};
/**
* The hp cost factor this battler's own `<hcr>` tags produce, before natural bonuses.<br/>
* This is what life cost's natural tags see as their base.
* @returns {number}
*/
Game_Battler.prototype.baseHcrFactor = function() {
	return this.hcrPercent() / 100;
};
/**
* Gets the hp cost reduction factor for this battler.
* This is the normalized fractional amount used in the math for hp cost reduction.
* Floored at zero — a negative factor would let ResourceManager's hp cost calculations go
* negative, which would refund hp on cast instead of just reducing the cost to free.
* @returns {number}
*/
Game_Battler.prototype.hcrFactor = function() {
	const baseFactor = this.baseHcrFactor();
	const naturalBonus = this.naturalBonus("hcr");
	return Math.max(0, baseFactor + naturalBonus);
};
/**
* Sets the hp cost reduction for this battler.
* @param {number} value The new hp cost reduction.
*/
Game_Battler.prototype.setHcr = function(value) {
	this._j ||= {};
	this._j._hcr = value;
};
/**
* Extends {@link #onBattlerDataChange}.<br/>
* Also refreshes the hp cost reduction for this battler.
*/
J.RESOURCES.Aliased.Game_Battler.set("onBattlerDataChange", Game_Battler.prototype.onBattlerDataChange);
Game_Battler.prototype.onBattlerDataChange = function() {
	J.RESOURCES.Aliased.Game_Battler.get("onBattlerDataChange").call(this);
	this.refreshHcr();
};
/**
* Refreshes the hp cost reduction for this battler.
*/
Game_Battler.prototype.refreshHcr = function() {
	const sources = this.hcrSources();
	const hcr = sources.reduce((acc, source) => acc - source.hcr(), 100);
	const normalizedHcr = Math.max(0, hcr);
	this.setHcr(normalizedHcr);
};
/**
* Gets all sources that contribute to the hp cost reduction.
* @returns {[(RPG_Actor|RPG_Enemy), RPG_Class, RPG_EquipItem[], RPG_State[]]}
*/
Game_Battler.prototype.hcrSources = function() {
	return [];
};
/**
* Extends {@link Game_Battler.prototype.canPaySkillCost}.
* Now includes HP cost eligibility.
* @param {RPG_Skill} skill The skill to check.
* @returns {boolean}
*/
J.RESOURCES.Aliased.Game_BattlerBase.set("canPaySkillCost", Game_BattlerBase.prototype.canPaySkillCost);
Game_Battler.prototype.canPaySkillCost = function(skill) {
	if (J.RESOURCES.Aliased.Game_BattlerBase.get("canPaySkillCost").call(this, skill) === false) {
		return false;
	}
	const hpCost = this.skillHpCost(skill);
	if (hpCost > 0) {
		const allowSacrifice = RPGManager.checkForBooleanFromNoteByRegex(skill, J.RESOURCES.RegExp.HpCostLethal);
		if (allowSacrifice === false && this.hp <= hpCost) {
			return false;
		}
	}
	const [stackStateId, stackCount] = this.skillStackCost(skill);
	if (stackCount > 0 && this.stackCount(stackStateId) < stackCount) {
		return false;
	}
	const [itemId, itemCount] = this.skillItemCost(skill);
	if (itemCount > 0 && $gameParty.numItems($dataItems.at(itemId)) < itemCount) {
		return false;
	}
	return true;
};
/**
* Extends {@link Game_Battler.prototype.paySkillCost}.
* Now deducts HP, MP, TP, and any gains.
* @param {RPG_Skill} skill The skill being paid for.
*/
J.RESOURCES.Aliased.Game_BattlerBase.set("paySkillCost", Game_BattlerBase.prototype.paySkillCost);
Game_Battler.prototype.paySkillCost = function(skill) {
	J.RESOURCES.Aliased.Game_BattlerBase.get("paySkillCost").call(this, skill);
	const hpCost = this.skillHpCost(skill);
	this.paySkillHpCost(hpCost);
	const [stackStateId, stackCount] = this.skillStackCost(skill);
	if (stackCount > 0) {
		this.decrementStateStacks(stackStateId, stackCount);
	}
	const [itemId, itemCount] = this.skillItemCost(skill);
	if (itemCount > 0) {
		$gameParty.loseItem($dataItems.at(itemId), itemCount, false);
	}
	const hpGain = ResourceCostManager.skillGainHp(this, skill);
	const mpGain = ResourceCostManager.skillGainMp(this, skill);
	const tpGain = ResourceCostManager.skillGainTp(this, skill);
	this.gainHpFromResource(hpGain);
	this.gainMpFromResource(mpGain);
	this.gainTpFromResource(tpGain);
};
/**
* Pays the hp cost for a skill.
* @param {number} amount The amount of hp to pay.
*/
Game_Battler.prototype.paySkillHpCost = function(amount) {
	this.gainHp(-amount);
};
/**
* Gains the given amount of HP from the skill.
* @param {number} amount The amount of HP to gain.
*/
Game_Battler.prototype.gainHpFromResource = function(amount) {
	this.gainHp(amount);
};
/**
* Gains the given amount of MP from the skill.
* @param {number} amount The amount of MP to gain.
*/
Game_Battler.prototype.gainMpFromResource = function(amount) {
	this.gainMp(amount);
};
/**
* Gains the given amount of TP from the skill.
* @param {number} amount The amount of TP to gain.
*/
Game_Battler.prototype.gainTpFromResource = function(amount) {
	this.gainTp(amount);
};

//#endregion
//#region src/plugins/resources/core/objects/Game_Actor.js
/**
* Gets all sources that contribute to the hp cost reduction.
* @returns {[RPG_Actor, RPG_Class, RPG_EquipItem[], RPG_State[]]}
*/
Game_Actor.prototype.hcrSources = function() {
	return [
		this.databaseData(),
		this.currentClass(),
		...this.equippedEquips(),
		...this.allStates()
	];
};

//#endregion
//#region src/plugins/resources/core/objects/Game_Enemy.js
/**
* Gets all sources that contribute to the hp cost reduction.
* @returns {[RPG_Enemy, RPG_State[]]}
*/
Game_Enemy.prototype.hcrSources = function() {
	return [this.databaseData(), ...this.allStates()];
};

//#endregion
//#region src/plugins/resources/core/core/registerResourcesParameters.js
/**
* Boot-time registration for J-Resources parameters in {@link ParameterRegistry}.
*/
var ResourcesParameterRegistration = class {
	/**
	* Registers Life Cost (HCR) with the parameter catalog.
	*/
	static registerAll() {
		const hpCostReduction = ParameterDefinition.Builder().key("hcr").group(ParameterGroups.COMBAT).sortOrder(5).label(() => TextManager.hcr()).description(() => TextManager.hcrDescription()).iconIndex(() => IconManager.hcr()).format(ParameterFormat.PERCENT_CENTERED).displayPolicy(ParameterDisplayPolicy.COST_RATE).getValue((battler) => battler.hcrFactor()).sdpBinding(SdpParameterBinding.byKey("hcr", () => 100)).build();
		ParameterRegistry.register(hpCostReduction);
		const hpCostNatural = new NaturalParameterBinding(J.RESOURCES.RegExp.HpCostRateBuffPlus, J.RESOURCES.RegExp.HpCostRateBuffRate, J.RESOURCES.RegExp.HpCostRateGrowthPlus, J.RESOURCES.RegExp.HpCostRateGrowthRate, (battler) => battler.baseHcrFactor());
		ParameterRegistry.bindNatural("hcr", hpCostNatural);
	}
};

//#endregion
//#region src/plugins/resources/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Registers J-Resources stats with the parameter catalog after vanilla seeding.
*/
J.RESOURCES.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.RESOURCES.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	ResourcesParameterRegistration.registerAll();
};

//#endregion
//#region src/plugins/resources/core/registerResourcesSaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-Resources a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_resources", "resources");
}

//#endregion
//# sourceMappingURL=J-Resources.js.map