//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 RESOURCES-ABS] Damage-linked HP, MP, and TP resource effects.
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
 * Please refer to J-Resources-ABS's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/resources/ext/abs/index.md
 * ============================================================================
 *
 * @param healChainDepth
 * @type number
 * @min 0
 * @max 20
 * @text Heal Chain Depth
 * @desc Maximum number of cascade rounds a single heal event can trigger.
 * 0 disables all cascades. Higher values allow deeper empathy-bond chains.
 * @default 5
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
J.RESOURCES.EXT.ABS.Metadata = new JResourcesAbs_PluginMetadata("J-Resources-ABS", "1.2.0");
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
J.RESOURCES.EXT.ABS.RegExp.LifestealBuffPlus = /<lstBuffPlus:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.LifestealBuffRate = /<lstBuffRate:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.LifestealGrowthPlus = /<lstGrowthPlus:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.LifestealGrowthRate = /<lstGrowthRate:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.ManastealBuffPlus = /<mstBuffPlus:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.ManastealBuffRate = /<mstBuffRate:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.ManastealGrowthPlus = /<mstGrowthPlus:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.ManastealGrowthRate = /<mstGrowthRate:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.TechstealBuffPlus = /<tstBuffPlus:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.TechstealBuffRate = /<tstBuffRate:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.TechstealGrowthPlus = /<tstGrowthPlus:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.EXT.ABS.RegExp.TechstealGrowthRate = /<tstGrowthRate:\[([+\-*/ ().\w]+)]>/gi;
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
	* Gets the current depth.
	* @returns {number} The currentDepth.
	*/
	static currentDepth() {
		return this._currentDepth;
	}
	/**
	* Sets the current depth.
	* @param {number} newCurrentDepth The new currentDepth.
	*/
	static setCurrentDepth(newCurrentDepth) {
		this._currentDepth = newCurrentDepth;
	}
	/**
	* Gets the self blocked tags.
	* @returns {Set<string>} The selfBlockedTags.
	*/
	static selfBlockedTags() {
		return this._selfBlockedTags;
	}
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
		if (this.currentDepth() >= J.RESOURCES.EXT.ABS.Metadata.healChainDepth) return;
		this.setCurrentDepth(this.currentDepth() + 1);
		try {
			this.#dispatchOnSelf(recipient, triggerKey, amount);
			this.#dispatchOnAlly(recipient, triggerKey, amount);
		} finally {
			this.setCurrentDepth(this.currentDepth() - 1);
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
				if (this.currentDepth() > maxDepth) continue;
				const secondary = Math.floor(amount * percent / 100);
				if (secondary <= 0) continue;
				const selfBlockKey = `${outputKey}:${recipient.getUuid()}`;
				if (!this.selfBlockedTags().has(selfBlockKey)) {
					this.selfBlockedTags().add(selfBlockKey);
					try {
						this.#applySecondaryHeal(recipient, outputKey, secondary);
					} finally {
						this.selfBlockedTags().delete(selfBlockKey);
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
					if (this.currentDepth() > maxDepth) continue;
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
			[specificRegexp, anyRegexp].forEach((regexp) => {
				const results = RPGManager.getArraysFromNotesByRegex(databaseData, regexp);
				results.forEach((result) => {
					if (Array.isArray(result) && result.length >= 2) {
						const maxDepth = result.length >= 3 ? Number(result[2]) : globalMaxDepth;
						tuples.push([
							Number(result[0]),
							Number(result[1]),
							maxDepth
						]);
					}
				});
			});
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
		rate += this.naturalBonus("lst");
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
		rate += this.naturalBonus("mst");
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
		rate += this.naturalBonus("tst");
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
		const lifeSteal = ParameterDefinition.Builder().key("lst").group(ParameterGroups.COMBAT).sortOrder(4).label(() => TextManager.lst()).description(() => TextManager.lstDescription()).iconIndex(() => IconManager.lst()).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.lst).sdpBinding(SdpParameterBinding.byKey("lst", () => 1)).build();
		ParameterRegistry.register(lifeSteal);
		const lifeStealNatural = new NaturalParameterBinding(J.RESOURCES.EXT.ABS.RegExp.LifestealBuffPlus, J.RESOURCES.EXT.ABS.RegExp.LifestealBuffRate, J.RESOURCES.EXT.ABS.RegExp.LifestealGrowthPlus, J.RESOURCES.EXT.ABS.RegExp.LifestealGrowthRate, (battler) => battler.baseLstRate());
		ParameterRegistry.bindNatural("lst", lifeStealNatural);
		const magiSteal = ParameterDefinition.Builder().key("mst").group(ParameterGroups.COMBAT).sortOrder(6).label(() => TextManager.mst()).description(() => TextManager.mstDescription()).iconIndex(() => IconManager.mst()).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.mst).sdpBinding(SdpParameterBinding.byKey("mst", () => 1)).build();
		ParameterRegistry.register(magiSteal);
		const magiStealNatural = new NaturalParameterBinding(J.RESOURCES.EXT.ABS.RegExp.ManastealBuffPlus, J.RESOURCES.EXT.ABS.RegExp.ManastealBuffRate, J.RESOURCES.EXT.ABS.RegExp.ManastealGrowthPlus, J.RESOURCES.EXT.ABS.RegExp.ManastealGrowthRate, (battler) => battler.baseMstRate());
		ParameterRegistry.bindNatural("mst", magiStealNatural);
		const techSteal = ParameterDefinition.Builder().key("tst").group(ParameterGroups.COMBAT).sortOrder(8).label(() => TextManager.tst()).description(() => TextManager.tstDescription()).iconIndex(() => IconManager.tst()).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.tst).sdpBinding(SdpParameterBinding.byKey("tst", () => 1)).build();
		ParameterRegistry.register(techSteal);
		const techStealNatural = new NaturalParameterBinding(J.RESOURCES.EXT.ABS.RegExp.TechstealBuffPlus, J.RESOURCES.EXT.ABS.RegExp.TechstealBuffRate, J.RESOURCES.EXT.ABS.RegExp.TechstealGrowthPlus, J.RESOURCES.EXT.ABS.RegExp.TechstealGrowthRate, (battler) => battler.baseTstRate());
		ParameterRegistry.bindNatural("tst", techStealNatural);
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