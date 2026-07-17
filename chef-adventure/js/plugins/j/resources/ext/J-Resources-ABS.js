//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 RESOURCES-ABS] Damage-linked HP, MP, and TP resource effects.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Resources
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-Resources
 * @orderAfter J-ABS
 *
 * @param healChainDepth
 * @text Heal Chain Depth
 * @type number
 * @min 0
 * @max 20
 * @default 5
 * @desc Maximum number of cascade rounds a single heal event can trigger.
 * 0 disables all cascades. Higher values allow deeper empathy-bond chains.
 *
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
 * STEAL RATES (LST / MST / TST)
 * Have you ever wanted a weapon that siphons life with every strike, or a
 * vampiric state that converts damage dealt into mana? Well now you can! By
 * applying the appropriate tag(s) across the database, a battler can recover
 * HP, MP, or TP equal to a percentage of the HP damage they deal, on every
 * hit.
 *
 * NOTE:
 * These are battler-wide percent-point stats, not per-skill tags- they're
 * summed from every note source on the battler (actor, class, weapons,
 * armors, states) and combined with any SDP panel bonus for the same
 * parameter key.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <lst:VALUE>
 *    Lifesteal- VALUE percent of HP damage dealt is recovered as HP.
 *
 *  <mst:VALUE>
 *    Manasteal- VALUE percent of HP damage dealt is recovered as MP.
 *
 *  <tst:VALUE>
 *    Techsteal- VALUE percent of HP damage dealt is recovered as TP.
 *
 * TAG EXAMPLES:
 *  <lst:10>
 *    This battler recovers 10% of all HP damage they deal as HP.
 *
 *  <mst:5>
 *  <tst:5>
 *    This battler recovers 5% of all HP damage they deal as both MP and TP
 *    simultaneously (the three steal rates are independent and can stack).
 *
 * ============================================================================
 * ============================================================================
 * HEAL EVENTS
 * When a battler receives positive HP, MP, or TP recovery, a cascade of
 * secondary heals can be triggered based on notetags placed on any traited
 * source (actor, class, equip, state, skill).
 *
 * Two families:
 *
 *   onSelf tags — when THIS battler's trigger resource is healed, also heal
 *   PERCENT% of the heal amount as the output resource. Self always receives
 *   it; if RANGE > 0, allies within RANGE tiles also receive it.
 *
 *   onAlly tags — when an ally within RANGE tiles has their trigger resource
 *   healed, this battler (the observer) receives PERCENT% of that heal amount
 *   as the output resource.
 *
 * Cascades are limited by the healChainDepth plugin parameter (default 5).
 * Secondary heals themselves fire onHeal again, so chains of empathy bonds and
 * jelly transfusions can propagate naturally up to the depth limit.
 *
 * TAG USAGE:
 * - Actors, Enemies, Classes, Equips, States, Skills
 *
 * TAG FORMAT (onSelf):
 *  <onSelf{Trigger}Heal{Output}:[PERCENT, RANGE]>
 *  <onSelf{Trigger}Heal{Output}:[PERCENT, RANGE, MAX_DEPTH]>
 *    Trigger:   Hp | Mp | Tp | Any
 *    Output:    Hp | Mp | Tp
 *    PERCENT:   integer percentage of the heal amount to apply as secondary
 *    RANGE:     tile radius; 0 = self only, >0 includes allies within radius
 *    MAX_DEPTH: max cross-battler cascade hops (default: healChainDepth plugin param).
 *               The tag never echoes itself on the same battler regardless of this value.
 *
 * TAG FORMAT (onAlly):
 *  <onAlly{Trigger}Heal{Output}:[PERCENT, RANGE]>
 *  <onAlly{Trigger}Heal{Output}:[PERCENT, RANGE, MAX_DEPTH]>
 *    Trigger:   Hp | Mp | Tp | Any
 *    Output:    Hp | Mp | Tp
 *    PERCENT:   integer percentage of the ally's heal to apply to self
 *    RANGE:     tile radius; observer only reacts if healed ally is within range
 *    MAX_DEPTH: max cross-battler cascade hops (default: healChainDepth plugin param)
 *
 * TAG EXAMPLES:
 *  <onSelfHpHealMp:[50, 0]>
 *    When this battler receives HP healing, also recover 50% of that amount as
 *    MP. Self only (Jelly Mana Transfusion).
 *
 *  <onSelfHpHealHp:[25, 3]>
 *    When this battler is healed for HP, also heal self and allies within
 *    3 tiles for 25% of the same amount (Empathic Splash).
 *
 *  <onAllyHpHealHp:[30, 4]>
 *    Whenever an ally within 4 tiles receives HP healing, this battler also
 *    gains 30% of that heal amount as HP (Emotion Empathic Bond).
 *
 *  <onSelfAnyHealTp:[10, 0]>
 *    Any resource recovery on this battler also grants 10% as TP
 *    (Momentum from healing).
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Added HEAL EVENTS system with onSelf and onAlly resource cascade tags.
 *    24 notetag variants (4 triggers × 3 outputs × 2 families).
 *    New plugin parameter: healChainDepth (default 5) caps cascade depth.
 *    Fixed: Scene_Boot import was missing from entry.js, so parameter
 *    registration was never called. Now fixed.
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
		this.healChainDepth = parseInt(this.parsedPluginParameters["healChainDepth"]) || 5;
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
J.RESOURCES.EXT.ABS.Metadata = new JResourcesAbs_PluginMetadata("J-Resources-ABS", "1.1.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.RESOURCES.EXT.ABS.Aliased = {};
J.RESOURCES.EXT.ABS.Aliased.JABS_Engine = new Map();
J.RESOURCES.EXT.ABS.Aliased.Game_Battler = new Map();
J.RESOURCES.EXT.ABS.Aliased.Scene_Boot = new Map();
/**
* All regular expressions used by this plugin.
*/
J.RESOURCES.EXT.ABS.RegExp = {};
J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFlat = /<on-attack-hp-gain:(-?\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainPercent = /<on-attack-hp-gain:(-?\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFormula = /<on-attack-hp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFlat = /<on-attack-mp-gain:(-?\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainPercent = /<on-attack-mp-gain:(-?\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFormula = /<on-attack-mp-gain:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFlat = /<on-attack-tp-gain:(-?\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainPercent = /<on-attack-tp-gain:(-?\d+)%>/gi;
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
J.RESOURCES.EXT.ABS.RegExp.OnSelfHpHealHp = /<onSelfHpHealHp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfHpHealMp = /<onSelfHpHealMp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfHpHealTp = /<onSelfHpHealTp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfMpHealHp = /<onSelfMpHealHp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfMpHealMp = /<onSelfMpHealMp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfMpHealTp = /<onSelfMpHealTp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfTpHealHp = /<onSelfTpHealHp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfTpHealMp = /<onSelfTpHealMp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfTpHealTp = /<onSelfTpHealTp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfAnyHealHp = /<onSelfAnyHealHp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfAnyHealMp = /<onSelfAnyHealMp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnSelfAnyHealTp = /<onSelfAnyHealTp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyHpHealHp = /<onAllyHpHealHp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyHpHealMp = /<onAllyHpHealMp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyHpHealTp = /<onAllyHpHealTp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyMpHealHp = /<onAllyMpHealHp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyMpHealMp = /<onAllyMpHealMp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyMpHealTp = /<onAllyMpHealTp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyTpHealHp = /<onAllyTpHealHp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyTpHealMp = /<onAllyTpHealMp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyTpHealTp = /<onAllyTpHealTp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyAnyHealHp = /<onAllyAnyHealHp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyAnyHealMp = /<onAllyAnyHealMp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAllyAnyHealTp = /<onAllyAnyHealTp:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+)?])>/gi;
/** Legacy SDP panel parameter ids for on-attack drain stats. */
J.RESOURCES.EXT.ABS.SdpParamId = {
	LST: 35,
	MST: 36,
	TST: 37
};

//#endregion
//#region src/plugins/resources/ext/abs/managers/TextManager.js
/**
* Display label for lifesteal — HP recovered from HP damage dealt.
* @returns {string}
*/
TextManager.lst = function() {
	return "Lifesteal";
};
/**
* Help text explaining lifesteal recovery on successful ABS hits.
* @returns {string[]}
*/
TextManager.lstDescription = function() {
	return ["Percent of HP damage dealt recovered as HP on a successful hit.", "Stacks with on-attack skill resource tags."];
};
/**
* Display label for manasteal — MP recovered from HP damage dealt.
* @returns {string}
*/
TextManager.mst = function() {
	return "Magisteal";
};
/**
* Help text explaining manasteal recovery on successful ABS hits.
* @returns {string[]}
*/
TextManager.mstDescription = function() {
	return ["Percent of HP damage dealt recovered as MP on a successful hit.", "Stacks with on-attack skill resource tags."];
};
/**
* Display label for techsteal — TP recovered from HP damage dealt.
* @returns {string}
*/
TextManager.tst = function() {
	return "Techsteal";
};
/**
* Help text explaining techsteal recovery on successful ABS hits.
* @returns {string[]}
*/
TextManager.tstDescription = function() {
	return ["Percent of HP damage dealt recovered as TP on a successful hit.", "Stacks with on-attack skill resource tags."];
};

//#endregion
//#region src/plugins/resources/ext/abs/managers/IconManager.js
/**
* Icon index for lifesteal on-hit resource recovery in ABS parameter UI.
* @returns {number}
*/
IconManager.lst = function() {
	return 928;
};
/**
* Icon index for manasteal on-hit resource recovery in ABS parameter UI.
* @returns {number}
*/
IconManager.mst = function() {
	return 929;
};
/**
* Icon index for techsteal on-hit resource recovery in ABS parameter UI.
* @returns {number}
*/
IconManager.tst = function() {
	return 930;
};

//#endregion
//#region src/plugins/resources/ext/abs/managers/HealEventManager.js
/**
* Manages the dispatch of secondary resource cascades triggered by healing events.
*
* When a battler is healed (via the onHeal hook in J-Base), this manager reads
* onSelf and onAlly tags from the relevant battlers' notes and applies proportional
* secondary resource gains. Cascades are capped by the healChainDepth plugin parameter
* to prevent runaway chains.
*/
var HealEventManager = class {
	/**
	* Tracks how many cascade rounds are currently in flight.
	* Incremented at the start of each dispatch round and decremented on exit.
	* @type {number}
	*/
	static _currentDepth = 0;
	/**
	* Tracks which (outputKey + battler uuid) combinations are currently mid-dispatch
	* for their own secondary self-heal, preventing a tag from echoing itself.
	* Key format: "${outputKey}:${uuid}" — e.g. "Hp:abc123".
	* @type {Set<string>}
	*/
	static _selfBlockedTags = new Set();
	/**
	* The three output resource keys used for looping over possible output resources.
	* @type {string[]}
	*/
	static #outputKeys = [
		"Hp",
		"Mp",
		"Tp"
	];
	/**
	* Entry point from the onHeal alias in Game_Battler.js.
	* Converts the J.BASE.Resource string into a PascalCase trigger key and starts dispatch.
	* @param {Game_Battler} recipient The battler that received the heal.
	* @param {string} resource One of J.BASE.Resource.HP / MP / TP.
	* @param {number} amount The positive amount that was recovered.
	*/
	static dispatch(recipient, resource, amount) {
		this.#dispatch(recipient, this.#resourceToKey(resource), amount);
	}
	/**
	* Internal dispatch entry; enforces the chain depth cap.
	* @param {Game_Battler} recipient The battler that received the heal.
	* @param {string} triggerKey PascalCase resource key ('Hp', 'Mp', 'Tp').
	* @param {number} amount The positive amount that was recovered.
	*/
	static #dispatch(recipient, triggerKey, amount) {
		if (this._currentDepth >= J.RESOURCES.EXT.ABS.Metadata.healChainDepth) return;
		this._currentDepth++;
		try {
			this.#dispatchOnSelf(recipient, triggerKey, amount);
			this.#dispatchOnAlly(recipient, triggerKey, amount);
		} finally {
			this._currentDepth--;
		}
	}
	/**
	* Converts a J.BASE.Resource string to the PascalCase suffix used in RegExp key lookups.
	* @param {string} resource One of J.BASE.Resource.HP / MP / TP.
	* @returns {string} 'Hp', 'Mp', or 'Tp'.
	*/
	static #resourceToKey(resource) {
		if (resource === J.BASE.Resource.HP) return "Hp";
		if (resource === J.BASE.Resource.MP) return "Mp";
		return "Tp";
	}
	/**
	* Reads onSelf tags from the recipient's notes and applies secondary heals.
	* Self always receives the secondary heal; allies within the tag's range also receive it.
	*
	* Self-echo prevention: the secondary self-heal is applied under a block keyed by
	* "${outputKey}:${uuid}". If that key is already blocked when we try to apply the
	* self-heal, we skip it — preventing a tag from infinitely echoing itself. The block
	* is cleared before ally-heals are applied so cross-battler ping-pong is still allowed
	* up to the per-tag MAX_DEPTH limit.
	*
	* @param {Game_Battler} recipient The battler whose onSelf tags are evaluated.
	* @param {string} triggerKey PascalCase trigger resource ('Hp', 'Mp', 'Tp').
	* @param {number} amount The amount that triggered this event.
	*/
	static #dispatchOnSelf(recipient, triggerKey, amount) {
		const notes = recipient.getAllNotes();
		for (const outputKey of this.#outputKeys) {
			const tuples = this.#getTuples(notes, false, triggerKey, outputKey);
			for (const [percent, range, maxDepth] of tuples) {
				if (this._currentDepth > maxDepth) continue;
				const secondary = Math.floor(amount * percent / 100);
				if (secondary <= 0) continue;
				const selfBlockKey = `${outputKey}:${recipient.getUuid()}`;
				if (!this._selfBlockedTags.has(selfBlockKey)) {
					this._selfBlockedTags.add(selfBlockKey);
					try {
						this.#applySecondaryHeal(recipient, outputKey, secondary);
					} finally {
						this._selfBlockedTags.delete(selfBlockKey);
					}
				}
				if (range > 0) {
					const jabsBattler = JABS_AiManager.getBattlerByUuid(recipient.getUuid());
					if (jabsBattler === undefined) continue;
					const nearbyAllies = JABS_AiManager.getAlliedBattlersWithinRange(jabsBattler, range);
					for (const allyJabs of nearbyAllies) {
						const ally = allyJabs.getBattler();
						if (ally === recipient) continue;
						this.#applySecondaryHeal(ally, outputKey, secondary);
					}
				}
			}
		}
	}
	/**
	* Reads onAlly tags from all allied observers and applies secondary heals to observers
	* whose tag range includes the healed battler.
	* @param {Game_Battler} healTarget The battler that received the original heal.
	* @param {string} triggerKey PascalCase trigger resource ('Hp', 'Mp', 'Tp').
	* @param {number} amount The amount that triggered this event.
	*/
	static #dispatchOnAlly(healTarget, triggerKey, amount) {
		const jabsTarget = JABS_AiManager.getBattlerByUuid(healTarget.getUuid());
		if (jabsTarget === undefined) return;
		const alliedBattlers = JABS_AiManager.getAlliedBattlers(jabsTarget);
		for (const observerJabs of alliedBattlers) {
			const observer = observerJabs.getBattler();
			if (observer === healTarget) continue;
			const distance = jabsTarget.distanceToDesignatedTarget(observerJabs);
			const notes = observer.getAllNotes();
			for (const outputKey of this.#outputKeys) {
				const tuples = this.#getTuples(notes, true, triggerKey, outputKey);
				for (const [percent, range, maxDepth] of tuples) {
					if (this._currentDepth > maxDepth) continue;
					if (distance > range) continue;
					const secondary = Math.floor(amount * percent / 100);
					if (secondary <= 0) continue;
					this.#applySecondaryHeal(observer, outputKey, secondary);
				}
			}
		}
	}
	/**
	* Routes a secondary heal to the appropriate gain method on the battler.
	* Fires onHeal again, allowing cascades to propagate naturally up to the depth cap.
	* @param {Game_Battler} battler The battler receiving the secondary heal.
	* @param {string} outputKey PascalCase output resource ('Hp', 'Mp', 'Tp').
	* @param {number} amount The positive amount to recover.
	*/
	static #applySecondaryHeal(battler, outputKey, amount) {
		if (outputKey === "Hp") battler.gainHpFromResource(amount);
		else if (outputKey === "Mp") battler.gainMpFromResource(amount);
		else battler.gainTpFromResource(amount);
	}
	/**
	* Collects all [percent, range, maxDepth] tuples from notes for a given family/trigger/output combination.
	* Checks both the specific trigger regexp and the "Any" trigger variant.
	* maxDepth defaults to the healChainDepth plugin parameter when the tag omits the third value.
	* @param {RPG_BaseItem[]} notes The array of database objects to scan.
	* @param {boolean} isAlly True when looking for onAlly tags; false for onSelf tags.
	* @param {string} triggerKey PascalCase trigger resource ('Hp', 'Mp', 'Tp').
	* @param {string} outputKey PascalCase output resource ('Hp', 'Mp', 'Tp').
	* @returns {Array<[number, number, number]>} Array of [percent, range, maxDepth] triples.
	*/
	static #getTuples(notes, isAlly, triggerKey, outputKey) {
		const family = isAlly ? "Ally" : "Self";
		const specificKey = `On${family}${triggerKey}Heal${outputKey}`;
		const anyKey = `On${family}AnyHeal${outputKey}`;
		const specificRegexp = J.RESOURCES.EXT.ABS.RegExp[specificKey];
		const anyRegexp = J.RESOURCES.EXT.ABS.RegExp[anyKey];
		const globalMaxDepth = J.RESOURCES.EXT.ABS.Metadata.healChainDepth;
		const tuples = [];
		for (const databaseData of notes) {
			if (specificRegexp) {
				const results = RPGManager.getArraysFromNotesByRegex(databaseData, specificRegexp);
				for (const result of results) {
					if (Array.isArray(result) && result.length >= 2) {
						const maxDepth = result.length >= 3 ? Number(result[2]) : globalMaxDepth;
						tuples.push([
							Number(result[0]),
							Number(result[1]),
							maxDepth
						]);
					}
				}
			}
			if (anyRegexp) {
				const results = RPGManager.getArraysFromNotesByRegex(databaseData, anyRegexp);
				for (const result of results) {
					if (Array.isArray(result) && result.length >= 2) {
						const maxDepth = result.length >= 3 ? Number(result[2]) : globalMaxDepth;
						tuples.push([
							Number(result[0]),
							Number(result[1]),
							maxDepth
						]);
					}
				}
			}
		}
		return tuples;
	}
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
		return rate;
	},
	configurable: true
});
Object.defineProperty(Game_Battler.prototype, "mst", {
	get: function() {
		let rate = this.baseMstRate();
		if (this.getSdpBonusForParameterKey) {
			rate += this.getSdpBonusForParameterKey("mst", 1);
		}
		return rate;
	},
	configurable: true
});
Object.defineProperty(Game_Battler.prototype, "tst", {
	get: function() {
		let rate = this.baseTstRate();
		if (this.getSdpBonusForParameterKey) {
			rate += this.getSdpBonusForParameterKey("tst", 1);
		}
		return rate;
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
/**
* Extends {@link #onHeal}.<br/>
* Dispatches resource cascade effects tagged on this battler and its allies
* whenever positive resource recovery is applied.
*/
J.RESOURCES.EXT.ABS.Aliased.Game_Battler.set("onHeal", Game_Battler.prototype.onHeal);
Game_Battler.prototype.onHeal = function(resource, amount) {
	J.RESOURCES.EXT.ABS.Aliased.Game_Battler.get("onHeal").call(this, resource, amount);
	HealEventManager.dispatch(this, resource, amount);
};

//#endregion
//#region src/plugins/resources/ext/abs/managers/ResourceHitManager.js
/**
* Manages damage-linked resource mutations for J-Resources-ABS.
*
* On-attack effects aggregate tags from both the executing skill and the caster's
* traited sources (actor/class/equip/states) and apply gains to the caster.
* When-hit effects aggregate tags from the target's traited sources and apply
* gains to the target. Negative net totals are clamped by the engine's own
* gainHp/Mp/Tp calls.
*/
var ResourceHitManager = class ResourceHitManager {
	/**
	* Applies all on-attack resource gains to the caster.
	* Called after a successful hit has been confirmed.
	* Tags are read from both the executing skill and the caster's traited sources
	* (actor/class/equip/states), then summed before being applied.
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
	* Calculates the HP gain for the caster from on-attack tags.
	* Aggregates from both the executing skill and the caster's traited sources.
	* @param {Game_Actor|Game_Enemy} caster The caster of the skill.
	* @param {RPG_Skill} skill The skill that landed the hit.
	* @returns {number}
	*/
	static onAttackHpGain(caster, skill) {
		return ResourceHitManager.#gainBySkillAndSources(caster, skill, J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFlat, J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainPercent, J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFormula, caster.mhp);
	}
	/**
	* Calculates the MP gain for the caster from on-attack tags.
	* Aggregates from both the executing skill and the caster's traited sources.
	* @param {Game_Actor|Game_Enemy} caster The caster of the skill.
	* @param {RPG_Skill} skill The skill that landed the hit.
	* @returns {number}
	*/
	static onAttackMpGain(caster, skill) {
		return ResourceHitManager.#gainBySkillAndSources(caster, skill, J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFlat, J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainPercent, J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFormula, caster.mmp);
	}
	/**
	* Calculates the TP gain for the caster from on-attack tags.
	* Aggregates from both the executing skill and the caster's traited sources.
	* @param {Game_Actor|Game_Enemy} caster The caster of the skill.
	* @param {RPG_Skill} skill The skill that landed the hit.
	* @returns {number}
	*/
	static onAttackTpGain(caster, skill) {
		return ResourceHitManager.#gainBySkillAndSources(caster, skill, J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFlat, J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainPercent, J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFormula, caster.mtp);
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
	* @param {Game_Actor|Game_Enemy} caster The caster driving this step.
	* @param {RPG_Skill} skill The skill driving this step.
	* @param {RegExp} flatRegex The flat regex driving this step.
	* @param {RegExp} percentRegex The percent regex driving this step.
	* @param {RegExp} formulaRegex The formula regex driving this step.
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
	* Calculates a resource gain for the on-attack path by combining the executing skill's
	* own tags with tags on the caster's traited sources (actor/class/equip/states).
	* REC is applied independently to each component before they are summed.
	* @param {Game_Actor|Game_Enemy} caster The caster driving this step.
	* @param {RPG_Skill} skill The skill driving this step.
	* @param {RegExp} flatRegex The flat regex driving this step.
	* @param {RegExp} percentRegex The percent regex driving this step.
	* @param {RegExp} formulaRegex The formula regex driving this step.
	* @param {number} maxStat The battler's maximum for the relevant resource (mhp/mmp/mtp).
	* @returns {number}
	*/
	static #gainBySkillAndSources(caster, skill, flatRegex, percentRegex, formulaRegex, maxStat) {
		const fromSkill = ResourceHitManager.#gainBySkill(caster, skill, flatRegex, percentRegex, formulaRegex, maxStat);
		const fromSources = ResourceHitManager.#gainBySources(caster, flatRegex, percentRegex, formulaRegex, maxStat, 0);
		return fromSkill + fromSources;
	}
	/**
	* Aggregates a resource gain across all of the target's traited sources (when-hit path).
	* Sources are the same set used for HCR (actor/class/equip/states for actors,
	* enemy data/states for enemies).
	* The formula receives `a` = targetBattler and `b` = damage dealt.
	* REC is applied to the total before returning.
	* @param {Game_Actor|Game_Enemy} targetBattler The target battler driving this step.
	* @param {RegExp} flatRegex The flat regex driving this step.
	* @param {RegExp} percentRegex The percent regex driving this step.
	* @param {RegExp} formulaRegex The formula regex driving this step.
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
* Boot-time registration for J-Resources-ABS drain stats in {@link ParameterRegistry}.
*/
var ResourcesAbsParameterRegistration = class {
	/**
	* Registers on-attack drain stats with the parameter catalog.
	*/
	static registerAll() {
		ParameterRegistry.register(ParameterDefinition.Builder().key("lst").group(ParameterGroups.COMBAT).sortOrder(4).label(() => TextManager.lst()).description(() => TextManager.lstDescription()).iconIndex(() => IconManager.lst()).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.lst).sdpBinding(SdpParameterBinding.byKey("lst", () => 1)).build());
		ParameterRegistry.register(ParameterDefinition.Builder().key("mst").group(ParameterGroups.COMBAT).sortOrder(6).label(() => TextManager.mst()).description(() => TextManager.mstDescription()).iconIndex(() => IconManager.mst()).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.mst).sdpBinding(SdpParameterBinding.byKey("mst", () => 1)).build());
		ParameterRegistry.register(ParameterDefinition.Builder().key("tst").group(ParameterGroups.COMBAT).sortOrder(8).label(() => TextManager.tst()).description(() => TextManager.tstDescription()).iconIndex(() => IconManager.tst()).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.tst).sdpBinding(SdpParameterBinding.byKey("tst", () => 1)).build());
	}
};

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
//#region src/plugins/resources/ext/abs/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Registers J-Resources-ABS drain stats with the parameter catalog after vanilla seeding.
*/
J.RESOURCES.EXT.ABS.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.RESOURCES.EXT.ABS.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	ResourcesAbsParameterRegistration.registerAll();
};

//#endregion
//# sourceMappingURL=J-Resources-ABS.js.map