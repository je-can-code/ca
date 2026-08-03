//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.1.0 RESOURCES] Extends skill cost/gain system to include HP, MP, and TP.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin extends the skill cost and gain system to support HP, MP, and TP
 * costs and gains defined entirely through notetags.
 *
 * Integrates with others of mine plugins:
 * - J-ABS; JABS will use these costs/gains when executing skills.
 * - J-CMS-Skill; the skill detail window will display HP costs.
 * - J-HUD-InputFrame; the input frame will display HP costs on skill slots.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * By default, RMMZ supports MP and TP costs on skills via the editor.
 * This plugin adds HP cost and gain support, as well as tag-based flat,
 * percentage, and formula costs for MP and TP as well.
 *
 * HP cost reduction is registered in the parameter catalog as `hcr`.
 *
 * ============================================================================
 * HP COST
 * Have you ever wanted your skills to cost HP in addition to (or instead of)
 * MP and TP? Well now you can! By applying the appropriate tag(s) to a skill,
 * that skill will cost HP to execute. HP costs support flat amounts,
 * percentages of max HP, and formula expressions.
 *
 * NOTE:
 * By default, a battler cannot cast a skill if its HP cost would kill them.
 * Add the <hp-cost-can-kill> tag to allow casting even when it would be lethal.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT (flat):
 *  <hp-cost:FLAT>
 *    Where FLAT is the flat amount of HP to deduct.
 *
 * TAG FORMAT (percentage):
 *  <hp-cost:PERCENT%>
 *    Where PERCENT is the percentage of max HP to deduct.
 *
 * TAG FORMAT (formula):
 *  <hp-cost:[FORMULA]>
 *    Where FORMULA is an eval'd expression with access to `a` (the battler).
 *
 * TAG FORMAT (lethal / sacrifice):
 *  <hp-cost-can-kill>
 *    Allows casting even when the HP cost would reduce HP to 0.
 *
 * TAG EXAMPLES:
 *  <hp-cost:50>
 *    Costs exactly 50 HP.
 *
 *  <hp-cost:10%>
 *    Costs 10% of max HP.
 *
 *  <hp-cost:[a.mhp / 4]>
 *    Costs 25% of max HP via formula.
 *
 *  <hp-cost-can-kill>
 *    This skill can be cast even if it would reduce the caster to 0 HP.
 *
 * ============================================================================
 * HP COST REDUCTION (HCR)
 * Have you ever wanted to mitigate how much HP your skills cost, the same
 * way MCR and TCR work for MP and TP? Well now you can! By applying the
 * appropriate tag(s) to your database objects, you can reduce HP skill costs
 * across the board- because lets face it, raw HP costs can add up fast.
 *
 * NOTE:
 * Unlike MCR/TCR which are multipliers, HCR is additive subtraction from 100.
 * A tag of <hcr:[5]> means "reduce HP costs by 5 percentage points", making it
 * easy to read at-a-glance what each piece of equipment contributes.
 *
 * NOTE ABOUT THE FORMULA CONTEXT:
 * Unlike most formula tags in these plugins, this one is evaluated per note
 * source directly (not per-battler), so there is no `a` battler reference
 * available- only literal numeric expressions are safe here (e.g. `[5]`,
 * `[10 - 2]`). Referencing a battler property will throw.
 *
 * TAG USAGE:
 * - Actors
 * - Enemies
 * - Classes
 * - Equips (weapons, armors)
 * - States
 *
 * TAG FORMAT:
 *  <hcr:[VALUE]>
 *    Where VALUE is the integer percentage to reduce HP costs by.
 *
 * TAG EXAMPLES:
 *  <hcr:[5]>
 *    Reduces all HP skill costs by 5%.
 *
 * ============================================================================
 * HP GAIN
 * Have you ever wanted a skill that restores HP to the caster upon use,
 * separate from damage formulas? Well now you can! By applying the appropriate
 * tag(s) to a skill, the caster will recover HP when the skill is executed.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT (flat):
 *  <hp-gain:FLAT>
 *
 * TAG FORMAT (percentage):
 *  <hp-gain:PERCENT%>
 *
 * TAG FORMAT (formula):
 *  <hp-gain:[FORMULA]>
 *
 * ============================================================================
 * EXTRA MP / TP COSTS AND GAINS
 * Have you ever wanted more expressive MP and TP costs than the single integer
 * the editor provides? Well now you can! The same flat/percent/formula tag
 * system is available for MP and TP, layered on top of the editor's native
 * cost fields so you don't lose anything you've already set up.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT:
 *  <mp-cost:VALUE>  <mp-cost:PERCENT%>  <mp-cost:[FORMULA]>
 *  <tp-cost:VALUE>  <tp-cost:PERCENT%>  <tp-cost:[FORMULA]>
 *  <mp-gain:VALUE>  <mp-gain:PERCENT%>  <mp-gain:[FORMULA]>
 *  <tp-gain:VALUE>  <tp-gain:PERCENT%>  <tp-gain:[FORMULA]>
 *
 * ============================================================================
 * STACK COST / ITEM COST
 * Have you ever wanted a skill that costs something other than hp/mp/tp- like
 * charges banked up from an earlier proc, or literal ammo out of the party's
 * inventory? Well now you can! These feed directly into canPaySkillCost/
 * paySkillCost, so an unaffordable skill is refused to fire exactly like
 * insufficient MP already is- no separate UI wiring needed.
 *
 * NOTE:
 * Both tags live on the skill only (not on states/equips/etc.)- costs are
 * inherent to the skill. If more than one of the same tag is authored on one
 * note, only the last one found wins (same convention as flat/percent costs).
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT (stack cost):
 *  <stackCost:[STATE_ID,COUNT]>
 *    Requires J-ABS. The caster must hold at least COUNT stacks of STATE_ID
 *    to cast; COUNT stacks are consumed via decrementStateStacks on pay.
 *    Leave the state's own <stackMax:VAL> high/unset for an uncapped pool.
 *
 * TAG FORMAT (item cost):
 *  <itemCost:[ITEM_ID,COUNT]>
 *    ITEM_ID resolves against $dataItems only (not weapons/armors). The party
 *    must hold at least COUNT of the item to cast; COUNT are removed from
 *    the party's inventory via $gameParty.loseItem on pay.
 *
 * TAG EXAMPLES:
 *  <stackCost:[7,3]>
 * Costs 3 stacks of state 7 to cast; refuses to fire below that.
 *
 *  <itemCost:[12,2]>
 * Costs 2 of item 12 to cast; refuses to fire without them in stock.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Routed the _resources namespace into its own save section, so resource
 *    state lands in systems/resources.json rather than in the system blob.
 * - 1.0.0
 *    Initial release.
 *    Added HP/MP/TP costs and gains via flat, percent, and formula notetags.
 *    Added HCR (HP Cost Reduction) as an additive stat sourced from traits.
 *    Added <hp-cost-can-kill> tag to allow lethal HP costs.
 *    Registered {@code hcr} (HP Cost Reduction) in the parameter catalog.
 *    Added <stackCost:[STATE_ID,COUNT]> (requires J-ABS) and
 *    <itemCost:[ITEM_ID,COUNT]> skill costs, feeding directly into
 *    canPaySkillCost/paySkillCost alongside hp/mp/tp.
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
 *
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
J.RESOURCES.Metadata = new JResources_PluginMetadata("J-Resources", "1.1.0");
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
* HP cost reduction in decimal percent space (0 = none).
*/
Object.defineProperty(Game_Battler.prototype, "hcr", {
	get: function() {
		return Math.max(0, (100 - this._j._hcr) / 100);
	},
	configurable: true
});
/**
* Gets the hp cost reduction factor for this battler.
* This is the normalized fractional amount used in the math for hp cost reduction.
* Floored at zero — a negative factor would let ResourceManager's hp cost calculations go
* negative, which would refund hp on cast instead of just reducing the cost to free.
*/
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
Game_Battler.prototype.hcrFactor = function() {
	const hrcFactor = Math.max(0, this.hcrPercent() / 100);
	return hrcFactor;
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