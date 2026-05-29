//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 RESOURCES-ABS] Damage-linked HP, MP, and TP resource effects.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Resources
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-Resources
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Resources, enabling resource mutations that
 * trigger during combat rather than at the moment a skill is cast.
 *
 * Integrates with others of mine plugins:
 * - J-Popups-Resources; on-attack and when-hit gains emit popups automatically.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Two new families of notetags are provided by this plugin:
 *
 *   ON-ATTACK tags live on skills. Every time that skill lands a hit on-map,
 *   the caster is granted some amount of HP, MP, or TP.
 *
 *   WHEN-HIT tags live on actors, classes, equips, or states. Every time that
 *   battler takes HP damage on-map, gains from all tagged sources are summed
 *   and applied to them.
 *
 * ============================================================================
 * ON-ATTACK GAINS
 * Have you ever wanted a skill that siphons a little bit of HP each time it
 * connects, or a technique that refunds TP on every successful hit? Well now
 * you can! By applying the appropriate tag(s) to a skill, the caster will
 * receive HP, MP, or TP every time that skill lands.
 *
 * NOTE:
 * Gains are scaled by the caster's REC stat.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT (flat):
 *  <on-attack-hp-gain:FLAT>
 *  <on-attack-mp-gain:FLAT>
 *  <on-attack-tp-gain:FLAT>
 *    Where FLAT is a fixed amount to restore on each hit.
 *
 * TAG FORMAT (percentage):
 *  <on-attack-hp-gain:PERCENT%>
 *  <on-attack-mp-gain:PERCENT%>
 *  <on-attack-tp-gain:PERCENT%>
 *    Where PERCENT is a percentage of the caster's maximum for that resource.
 *
 * TAG FORMAT (formula):
 *  <on-attack-hp-gain:[FORMULA]>
 *  <on-attack-mp-gain:[FORMULA]>
 *  <on-attack-tp-gain:[FORMULA]>
 *    Where FORMULA is an eval'd expression.
 *    `a` = the caster battler.
 *    `b` = flat + calculated-percent (the accumulated base before formula).
 *
 * TAG EXAMPLES:
 *  <on-attack-hp-gain:20>
 *    Restores 20 HP to the caster each time this skill lands.
 *
 *  <on-attack-mp-gain:5%>
 *    Restores 5% of the caster's max MP each time this skill lands.
 *
 *  <on-attack-tp-gain:[a.level / 10]>
 *    Restores TP equal to one-tenth the caster's level per hit.
 *
 * ============================================================================
 * WHEN-HIT GAINS
 * Have you ever wanted a battler that builds rage the more they get beaten
 * around, or an accessory that slowly replenishes MP for a stalwart defender?
 * Well now you can! By applying the appropriate tag(s) to the database object
 * in question, that battler will receive HP, MP, or TP each time they take HP
 * damage. All tagged sources are summed together automatically.
 *
 * NOTE:
 * Gains are scaled by the target's REC stat.
 *
 * NOTE:
 * In formula tags, `b` is the raw HP damage dealt rather than the accumulated
 * base value- this lets you write damage-proportional expressions like `b * 0.05`.
 *
 * TAG USAGE:
 * - Actors
 * - Enemies
 * - Classes
 * - Equips (weapons, armors)
 * - States
 *
 * TAG FORMAT (flat):
 *  <when-hit-hp-gain:FLAT>
 *  <when-hit-mp-gain:FLAT>
 *  <when-hit-tp-gain:FLAT>
 *
 * TAG FORMAT (percentage):
 *  <when-hit-hp-gain:PERCENT%>
 *  <when-hit-mp-gain:PERCENT%>
 *  <when-hit-tp-gain:PERCENT%>
 *    Where PERCENT is a percentage of the target's maximum for that resource.
 *
 * TAG FORMAT (formula):
 *  <when-hit-hp-gain:[FORMULA]>
 *  <when-hit-mp-gain:[FORMULA]>
 *  <when-hit-tp-gain:[FORMULA]>
 *    Where FORMULA is an eval'd expression.
 *    `a` = the target battler.
 *    `b` = the raw HP damage dealt by the hit.
 *
 * TAG EXAMPLES:
 *  <when-hit-tp-gain:5>
 *    Gain 5 TP each time this battler takes HP damage (great for a "Rage" state).
 *
 *  <when-hit-mp-gain:2%>
 *    Recover 2% of max MP each time this battler takes HP damage.
 *
 *  <when-hit-tp-gain:[b * 0.05]>
 *    Gain TP equal to 5% of the damage taken- scales with how hard the hit was.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 *    Added on-attack HP/MP/TP gains via flat, percent, and formula skill tags.
 *    Added when-hit HP/MP/TP gains aggregated across all traited sources.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/resources/ext/abs/_metadata/_pluginMetadata.js
var JResourcesAbs_PluginMetadata = class extends PluginMetadata {
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
	}
};

//#endregion
//#region src/plugins/resources/ext/abs/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
J.RESOURCES ||= {};
J.RESOURCES.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this extension plugin.
*/
J.RESOURCES.EXT.ABS = {};
/**
* The metadata associated with this plugin.
*/
J.RESOURCES.EXT.ABS.Metadata = new JResourcesAbs_PluginMetadata("J-Resources-ABS", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.RESOURCES.EXT.ABS.Aliased = {};
J.RESOURCES.EXT.ABS.Aliased.JABS_Engine = new Map();
/**
* All regular expressions used by this plugin.
*/
J.RESOURCES.EXT.ABS.RegExp = {};
J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFlat = /<on-attack-hp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainPercent = /<on-attack-hp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFormula = /<on-attack-hp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFlat = /<on-attack-mp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainPercent = /<on-attack-mp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFormula = /<on-attack-mp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFlat = /<on-attack-tp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainPercent = /<on-attack-tp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFormula = /<on-attack-tp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainFlat = /<when-hit-hp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainPercent = /<when-hit-hp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainFormula = /<when-hit-hp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainFlat = /<when-hit-mp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainPercent = /<when-hit-mp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainFormula = /<when-hit-mp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainFlat = /<when-hit-tp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainPercent = /<when-hit-tp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainFormula = /<when-hit-tp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.Lifesteal = /<lst:(-?\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.Manasteal = /<mst:(-?\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.Techsteal = /<tst:(-?\d+)>/gi;
/** Legacy SDP panel parameter ids for on-attack drain stats. */
J.RESOURCES.EXT.ABS.SdpParamId = {
	LST: 35,
	MST: 36,
	TST: 37
};

//#endregion
//#region src/plugins/resources/ext/abs/managers/TextManager.js
TextManager.lst = function() {
	return "Lifesteal";
};
TextManager.lstDescription = function() {
	return ["Percent of HP damage dealt recovered as HP on a successful hit.", "Stacks additively with on-hit resource gain."];
};
TextManager.mst = function() {
	return "Manasteal";
};
TextManager.mstDescription = function() {
	return ["Percent of HP damage dealt recovered as MP on a successful hit.", "Stacks additively with on-hit resource gain."];
};
TextManager.tst = function() {
	return "Techsteal";
};
TextManager.tstDescription = function() {
	return ["Percent of HP damage dealt recovered as TP on a successful hit.", "Stacks additively with on-hit resource gain."];
};

//#endregion
//#region src/plugins/resources/ext/abs/managers/IconManager.js
IconManager.lst = function() {
	return 928;
};
IconManager.mst = function() {
	return 929;
};
IconManager.tst = function() {
	return 930;
};

//#endregion
//#region src/plugins/resources/ext/abs/objects/Game_Battler.js
Object.defineProperties(Game_BattlerBase.prototype, {
	/**
	* Lifesteal rate (% of HP damage dealt recovered as HP).
	*/
	lst: {
		get: function() {
			return 0;
		},
		configurable: true
	},
	/**
	* Manasteal rate (% of HP damage dealt recovered as MP).
	*/
	mst: {
		get: function() {
			return 0;
		},
		configurable: true
	},
	/**
	* Techsteal rate (% of HP damage dealt recovered as TP).
	*/
	tst: {
		get: function() {
			return 0;
		},
		configurable: true
	}
});
Object.defineProperty(Game_Battler.prototype, "lst", {
	get: function() {
		let rate = this.baseLstRate();
		if (this.getSdpBonusForParameterKey) {
			rate += this.getSdpBonusForParameterKey("lst", 1);
		}
		return Math.max(0, rate);
	},
	configurable: true
});
Object.defineProperty(Game_Battler.prototype, "mst", {
	get: function() {
		let rate = this.baseMstRate();
		if (this.getSdpBonusForParameterKey) {
			rate += this.getSdpBonusForParameterKey("mst", 1);
		}
		return Math.max(0, rate);
	},
	configurable: true
});
Object.defineProperty(Game_Battler.prototype, "tst", {
	get: function() {
		let rate = this.baseTstRate();
		if (this.getSdpBonusForParameterKey) {
			rate += this.getSdpBonusForParameterKey("tst", 1);
		}
		return Math.max(0, rate);
	},
	configurable: true
});
/**
* Sums lifesteal notetags into a decimal rate (5 → 0.05).
* @returns {number}
*/
Game_Battler.prototype.baseLstRate = function() {
	const bonus = RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.RESOURCES.EXT.ABS.RegExp.Lifesteal);
	return bonus / 100;
};
/**
* Sums manasteal notetags into a decimal rate.
* @returns {number}
*/
Game_Battler.prototype.baseMstRate = function() {
	const bonus = RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.RESOURCES.EXT.ABS.RegExp.Manasteal);
	return bonus / 100;
};
/**
* Sums techsteal notetags into a decimal rate.
* @returns {number}
*/
Game_Battler.prototype.baseTstRate = function() {
	const bonus = RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.RESOURCES.EXT.ABS.RegExp.Techsteal);
	return bonus / 100;
};

//#endregion
//#region src/plugins/resources/ext/abs/managers/ResourceHitManager.js
/**
* Manages damage-linked resource mutations for J-Resources-ABS.
*
* On-attack effects read tags from the skill and apply gains to the caster.
* When-hit effects aggregate tags from the target's traited sources and apply
* gains to the target. Negative net totals are clamped by the engine's own
* gainHp/Mp/Tp calls.
*/
var ResourceHitManager = class ResourceHitManager {
	/**
	* Applies all on-attack resource gains to the caster.
	* Called after a successful hit has been confirmed.
	* @param {JABS_Action} action The action that landed.
	* @param {JABS_Battler} target The battler that was hit.
	*/
	static applyOnAttackEffects(action, target) {
		const caster = action.getCaster().getBattler();
		const skill = action.getBaseSkill();
		const targetBattler = target.getBattler();
		const result = targetBattler.result();
		let hpGain = ResourceHitManager.onAttackHpGain(caster, skill);
		let mpGain = ResourceHitManager.onAttackMpGain(caster, skill);
		let tpGain = ResourceHitManager.onAttackTpGain(caster, skill);
		if (result.hpDamage > 0) {
			const damage = result.hpDamage;
			hpGain += Math.floor(damage * caster.lst);
			mpGain += Math.floor(damage * caster.mst);
			tpGain += Math.floor(damage * caster.tst);
		}
		if (hpGain !== 0) caster.gainHpFromResource(hpGain);
		if (mpGain !== 0) caster.gainMpFromResource(mpGain);
		if (tpGain !== 0) caster.gainTpFromResource(tpGain);
	}
	/**
	* Applies all when-hit resource gains to the target.
	* Called after a damaging hit has been confirmed (hpDamage > 0).
	* @param {JABS_Action} action The action that landed.
	* @param {JABS_Battler} target The battler that was hit.
	*/
	static applyWhenHitEffects(action, target) {
		const targetBattler = target.getBattler();
		const damage = targetBattler.result().hpDamage;
		const hpGain = ResourceHitManager.whenHitHpGain(targetBattler, damage);
		const mpGain = ResourceHitManager.whenHitMpGain(targetBattler, damage);
		const tpGain = ResourceHitManager.whenHitTpGain(targetBattler, damage);
		if (hpGain !== 0) targetBattler.gainHpFromResource(hpGain);
		if (mpGain !== 0) targetBattler.gainMpFromResource(mpGain);
		if (tpGain !== 0) targetBattler.gainTpFromResource(tpGain);
	}
	/**
	* Calculates the HP gain for the caster from a skill's on-attack tags.
	* @param {Game_Actor|Game_Enemy} caster The caster of the skill.
	* @param {RPG_Skill} skill The skill that landed the hit.
	* @returns {number}
	*/
	static onAttackHpGain(caster, skill) {
		return ResourceHitManager.#gainBySkill(caster, skill, J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFlat, J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainPercent, J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFormula, caster.mhp);
	}
	/**
	* Calculates the MP gain for the caster from a skill's on-attack tags.
	* @param {Game_Actor|Game_Enemy} caster The caster of the skill.
	* @param {RPG_Skill} skill The skill that landed the hit.
	* @returns {number}
	*/
	static onAttackMpGain(caster, skill) {
		return ResourceHitManager.#gainBySkill(caster, skill, J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFlat, J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainPercent, J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFormula, caster.mmp);
	}
	/**
	* Calculates the TP gain for the caster from a skill's on-attack tags.
	* @param {Game_Actor|Game_Enemy} caster The caster of the skill.
	* @param {RPG_Skill} skill The skill that landed the hit.
	* @returns {number}
	*/
	static onAttackTpGain(caster, skill) {
		return ResourceHitManager.#gainBySkill(caster, skill, J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFlat, J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainPercent, J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFormula, caster.mtp);
	}
	/**
	* Aggregates the HP gain for the target from all traited sources' when-hit tags.
	* @param {Game_Actor|Game_Enemy} targetBattler The battler that was hit.
	* @param {number} damage The raw HP damage dealt (used as `b` in formulas).
	* @returns {number}
	*/
	static whenHitHpGain(targetBattler, damage) {
		return ResourceHitManager.#gainBySources(targetBattler, J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainFlat, J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainPercent, J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainFormula, targetBattler.mhp, damage);
	}
	/**
	* Aggregates the MP gain for the target from all traited sources' when-hit tags.
	* @param {Game_Actor|Game_Enemy} targetBattler The battler that was hit.
	* @param {number} damage The raw HP damage dealt (used as `b` in formulas).
	* @returns {number}
	*/
	static whenHitMpGain(targetBattler, damage) {
		return ResourceHitManager.#gainBySources(targetBattler, J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainFlat, J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainPercent, J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainFormula, targetBattler.mmp, damage);
	}
	/**
	* Aggregates the TP gain for the target from all traited sources' when-hit tags.
	* @param {Game_Actor|Game_Enemy} targetBattler The battler that was hit.
	* @param {number} damage The raw HP damage dealt (used as `b` in formulas).
	* @returns {number}
	*/
	static whenHitTpGain(targetBattler, damage) {
		return ResourceHitManager.#gainBySources(targetBattler, J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainFlat, J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainPercent, J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainFormula, targetBattler.mtp, damage);
	}
	/**
	* Calculates a resource gain from tags on a single skill (on-attack path).
	* The formula receives `a` = caster and `b` = (flat + calculatedPercent).
	* REC is applied to the total before returning.
	* @param {Game_Actor|Game_Enemy} caster
	* @param {RPG_Skill} skill
	* @param {RegExp} flatRegex
	* @param {RegExp} percentRegex
	* @param {RegExp} formulaRegex
	* @param {number} maxStat The battler's maximum for the relevant resource (mhp/mmp/mtp).
	* @returns {number}
	*/
	static #gainBySkill(caster, skill, flatRegex, percentRegex, formulaRegex, maxStat) {
		const flat = RPGManager.getNumberFromNoteByRegex(skill, flatRegex);
		const percent = RPGManager.getNumberFromNoteByRegex(skill, percentRegex);
		const calculatedPercent = maxStat * (percent / 100);
		const formula = RPGManager.getResultFromNoteByRegex(skill, formulaRegex, flat + calculatedPercent, caster);
		const total = flat + calculatedPercent + formula;
		if (total === 0) return 0;
		return total * caster.rec;
	}
	/**
	* Aggregates a resource gain across all of the target's traited sources (when-hit path).
	* Sources are the same set used for HCR (actor/class/equip/states for actors,
	* enemy data/states for enemies).
	* The formula receives `a` = targetBattler and `b` = damage dealt.
	* REC is applied to the total before returning.
	* @param {Game_Actor|Game_Enemy} targetBattler
	* @param {RegExp} flatRegex
	* @param {RegExp} percentRegex
	* @param {RegExp} formulaRegex
	* @param {number} maxStat The battler's maximum for the relevant resource (mhp/mmp/mtp).
	* @param {number} damage The raw HP damage from the action result.
	* @returns {number}
	*/
	static #gainBySources(targetBattler, flatRegex, percentRegex, formulaRegex, maxStat, damage) {
		const sources = targetBattler.hcrSources();
		const totalFlat = sources.reduce((acc, source) => acc + RPGManager.getNumberFromNoteByRegex(source, flatRegex), 0);
		const totalPercent = sources.reduce((acc, source) => acc + RPGManager.getNumberFromNoteByRegex(source, percentRegex), 0);
		const calculatedPercent = maxStat * (totalPercent / 100);
		const totalFormula = sources.reduce((acc, source) => acc + RPGManager.getResultFromNoteByRegex(source, formulaRegex, damage, targetBattler), 0);
		const total = totalFlat + calculatedPercent + totalFormula;
		if (total === 0) return 0;
		return total * targetBattler.rec;
	}
};

//#endregion
//#region src/plugins/resources/ext/abs/core/registerResourcesAbsParameters.js
/**
* Registers on-attack drain stats with the parameter catalog.
*/
function registerResourcesAbsParameters() {
	ParameterRegistry.register(ParameterDefinition.Builder().key("lst").group(ParameterGroups.COMBAT).sortOrder(4).label(() => TextManager.lst()).description(() => TextManager.lstDescription()).iconIndex(() => IconManager.lst()).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.lst).sdpBinding(SdpParameterBinding.byKey("lst", () => 1)).build());
	ParameterRegistry.register(ParameterDefinition.Builder().key("mst").group(ParameterGroups.COMBAT).sortOrder(6).label(() => TextManager.mst()).description(() => TextManager.mstDescription()).iconIndex(() => IconManager.mst()).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.mst).sdpBinding(SdpParameterBinding.byKey("mst", () => 1)).build());
	ParameterRegistry.register(ParameterDefinition.Builder().key("tst").group(ParameterGroups.COMBAT).sortOrder(8).label(() => TextManager.tst()).description(() => TextManager.tstDescription()).iconIndex(() => IconManager.tst()).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.tst).sdpBinding(SdpParameterBinding.byKey("tst", () => 1)).build());
}
registerResourcesAbsParameters();

//#endregion
//#region src/plugins/resources/ext/abs/managers/JABS_Engine.js
/**
* Extends {@link #postPrimaryBattleEffects}.<br/>
* Also applies on-attack resource gains to the caster and when-hit resource
* gains to the target, provided the action landed a damaging hit.
*/
J.RESOURCES.EXT.ABS.Aliased.JABS_Engine.set("postPrimaryBattleEffects", JABS_Engine.prototype.postPrimaryBattleEffects);
JABS_Engine.prototype.postPrimaryBattleEffects = function(action, target) {
	J.RESOURCES.EXT.ABS.Aliased.JABS_Engine.get("postPrimaryBattleEffects").call(this, action, target);
	const result = target.getBattler().result();
	if (result.isHit() === false) return;
	ResourceHitManager.applyOnAttackEffects(action, target);
	if (result.hpDamage <= 0) return;
	ResourceHitManager.applyWhenHitEffects(action, target);
};

//#endregion
//# sourceMappingURL=J-Resources-ABS.js.map