//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PASSIVE-CONDITIONAL] Applies passive states while runtime conditions hold (JABS map combat).
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Passive
 * @base J-Passive-Affix
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Passive
 * @orderAfter J-Passive-Affix
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is a J-Passive extension for JABS map combat.
 *
 * It evaluates tag-driven rules on battler passive sources and temporarily
 * treats additional states as passives while conditions are true.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Rules live on the same database objects that already feed J-Passive
 * (skills, states, actors, enemies, etc.). When a rule's condition passes,
 * the listed state id is merged into the battler's passive state tracker.
 *
 * Map battlers re-check on a throttled timer; any refresh of passive states
 * (equip change, skill learn, etc.) also re-evaluates conditions immediately.
 *
 * ============================================================================
 * CONDITIONAL PASSIVE TAGS:
 * Have you ever wanted "apply state 12 while HP is below 25%" without hand-
 * rolling common events? Well now you can! By applying the tag below to any
 * passive source note, you too can gate passive states on runtime context.
 *
 * TAG USAGE:
 * - Skills (mastery wrapper skills are the primary authoring surface)
 * - States, actors, enemies, classes, equipment — any J-Passive source
 *
 * TAG FORMAT:
 *  <conditionalPassive:[STATE_ID, CONDITION, PARAM?]>
 * Where STATE_ID is the passive state to apply while the condition holds.
 * Where CONDITION is the evaluator key (see supported list below).
 * Where PARAM is required for threshold-style conditions (percent 1–100, etc.).
 *
 * TAG EXAMPLES:
 *  <conditionalPassive:[42, hpBelow, 25]>
 * While HP is strictly below 25%, state 42 is treated as a passive state.
 *
 *  <conditionalPassive:[43, hpAbove, 50]>
 * While HP is strictly above 50%, state 43 is treated as a passive state.
 *
 * SUPPORTED CONDITIONS (v1 scaffold):
 *  hpBelow — PARAM = HP percent threshold (exclusive)
 *  hpAbove — PARAM = HP percent threshold (exclusive)
 *
 * Multiple tags may point at the same state id; each tag is evaluated on its own.
 * ============================================================================
 * PLUGIN PARAMETERS:
 *  - Reconcile Delay (frames):
 *      How often map battlers re-check conditional passives while ABS is active.
 *      Defaults to 15 (~4 times per second at 60 fps).
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release (scaffold + HP threshold conditions).
 * ============================================================================
 *
 * @param parentConfigPassiveConditional
 * @text PASSIVE CONDITIONAL
 *
 * @param reconcile-delay-frames
 * @parent parentConfigPassiveConditional
 * @type number
 * @min 1
 * @max 600
 * @text Reconcile Delay (frames)
 * @desc Frames between conditional passive re-checks per map battler.
 * @default 15
 */
//endregion annotations

//#region src/plugins/passive/ext/conditional/_metadata/_pluginMetadata.js
var JPassiveConditional_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
	* Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Parses the plugin parameters and assigns them to the metadata.
	*/
	initializeMetadata() {
		/**
		* Frames between map-side conditional passive reconciles per {@link JABS_Battler}.
		* @type {number}
		*/
		const parsed = parseInt(this.parsedPluginParameters["reconcile-delay-frames"], 10);
		this.reconcileDelayFrames = Number.isNaN(parsed) ? 15 : parsed;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs conditional passive states on the map.
*/
J.PASSIVE.EXT.CONDITIONAL = {};
/**
* The metadata associated with this plugin.
*/
J.PASSIVE.EXT.CONDITIONAL.Metadata = new JPassiveConditional_PluginMetadata("J-Passive-Conditional", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased = {};
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler = new Map();
/**
* All regular expressions used by this plugin.
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp = {};
J.PASSIVE.EXT.CONDITIONAL.RegExp.ConditionalPassive = /<conditionalPassive:\[\s*(\d+)\s*,\s*(\w+)\s*(?:,\s*([\d.]+))?\s*\]>/gi;

//#endregion
//#region src/plugins/passive/ext/conditional/__models/ConditionalPassiveRule.js
/**
* One parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.ConditionalPassive} rule from a passive source note.
*/
var ConditionalPassiveRule = class {
	/**
	* @param {number} stateId Passive state to treat as active while the condition holds.
	* @param {string} conditionKind Evaluator key (hpBelow, hpAbove, …).
	* @param {number|null} paramValue Optional numeric parameter for the evaluator.
	*/
	constructor(stateId, conditionKind, paramValue) {
		/**
		* @type {number}
		*/
		this.stateId = stateId;
		/**
		* @type {string}
		*/
		this.conditionKind = conditionKind;
		/**
		* @type {number|null}
		*/
		this.paramValue = paramValue;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/ConditionalPassiveManager.js
/**
* Parses, evaluates, and reconciles conditional passive state rules for map battlers.
*/
var ConditionalPassiveManager = class ConditionalPassiveManager {
	/**
	* Re-checks whether conditional passives changed; refreshes passive state tracking when they did.
	* @param {Game_Battler} battler
	*/
	static reconcile(battler) {
		const nextIds = ConditionalPassiveManager.resolveActiveStateIds(battler);
		const previousIds = battler.getConditionalPassiveSnapshot();
		if (ConditionalPassiveManager.#snapshotsEqual(previousIds, nextIds)) {
			return;
		}
		battler.refreshPassiveStates();
	}
	/**
	* Appends currently satisfied conditional passive state ids after J-Passive finishes a refresh.
	* @param {Game_Battler} battler
	*/
	static appendActiveConditionalPassives(battler) {
		const activeStateIds = ConditionalPassiveManager.resolveActiveStateIds(battler);
		battler.setConditionalPassiveSnapshot(activeStateIds);
		activeStateIds.forEach((stateId) => {
			battler.addPassiveStateId(stateId, false);
		});
	}
	/**
	* Collects every conditional passive rule declared on this battler's passive sources.
	* @param {Game_Battler} battler
	* @returns {ConditionalPassiveRule[]}
	*/
	static collectRules(battler) {
		const rules = [];
		const seen = new Set();
		battler.getPassiveStateSources().forEach((source) => {
			if (!source || !source.note) return;
			ConditionalPassiveManager.#parseRulesFromNote(source.note).forEach((rule) => {
				const dedupeKey = `${rule.stateId}:${rule.conditionKind}:${rule.paramValue}`;
				if (seen.has(dedupeKey)) return;
				seen.add(dedupeKey);
				rules.push(rule);
			});
		});
		return rules;
	}
	/**
	* Returns passive state ids whose conditions currently pass on this battler.
	* @param {Game_Battler} battler
	* @returns {number[]}
	*/
	static resolveActiveStateIds(battler) {
		const activeStateIds = [];
		ConditionalPassiveManager.collectRules(battler).forEach((rule) => {
			if (ConditionalPassiveManager.evaluateRule(battler, rule) === false) return;
			activeStateIds.push(rule.stateId);
		});
		return activeStateIds;
	}
	/**
	* Evaluates a single rule against the battler's current runtime context.
	* @param {Game_Battler} battler
	* @param {ConditionalPassiveRule} rule
	* @returns {boolean}
	*/
	static evaluateRule(battler, rule) {
		switch (rule.conditionKind) {
			case "hpBelow": return ConditionalPassiveManager.#evaluateHpBelow(battler, rule.paramValue);
			case "hpAbove": return ConditionalPassiveManager.#evaluateHpAbove(battler, rule.paramValue);
			default: return false;
		}
	}
	/**
	* @param {string} note
	* @returns {ConditionalPassiveRule[]}
	*/
	static #parseRulesFromNote(note) {
		const rules = [];
		const regex = J.PASSIVE.EXT.CONDITIONAL.RegExp.ConditionalPassive;
		const scan = new RegExp(regex.source, regex.flags.replace("g", ""));
		note.split(/[\r\n]+/).forEach((line) => {
			scan.lastIndex = 0;
			const match = scan.exec(line);
			if (match === null) return;
			const stateId = parseInt(match[1], 10);
			const conditionKind = match[2];
			const paramValue = match[3] !== undefined ? parseFloat(match[3]) : null;
			rules.push(new ConditionalPassiveRule(stateId, conditionKind, paramValue));
		});
		return rules;
	}
	/**
	* @param {Game_Battler} battler
	* @param {number|null} thresholdPercent
	* @returns {boolean}
	*/
	static #evaluateHpBelow(battler, thresholdPercent) {
		if (thresholdPercent === null || Number.isNaN(thresholdPercent)) return false;
		const hpRatePercent = ConditionalPassiveManager.#hpRatePercent(battler);
		return hpRatePercent < thresholdPercent;
	}
	/**
	* @param {Game_Battler} battler
	* @param {number|null} thresholdPercent
	* @returns {boolean}
	*/
	static #evaluateHpAbove(battler, thresholdPercent) {
		if (thresholdPercent === null || Number.isNaN(thresholdPercent)) return false;
		const hpRatePercent = ConditionalPassiveManager.#hpRatePercent(battler);
		return hpRatePercent > thresholdPercent;
	}
	/**
	* @param {Game_Battler} battler
	* @returns {number}
	*/
	static #hpRatePercent(battler) {
		const mhp = battler.mhp;
		if (mhp <= 0) return 0;
		return battler.hp / mhp * 100;
	}
	/**
	* @param {number[]} left
	* @param {number[]} right
	* @returns {boolean}
	*/
	static #snapshotsEqual(left, right) {
		if (left.length !== right.length) return false;
		for (let i = 0; i < left.length; i++) {
			if (left[i] !== right[i]) return false;
		}
		return true;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/objects/Game_Battler.js
/**
* Extends {@link #initPassiveStatesMembers}.<br/>
* Adds conditional passive reconcile timer storage.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("initPassiveStatesMembers", Game_Battler.prototype.initPassiveStatesMembers);
Game_Battler.prototype.initPassiveStatesMembers = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("initPassiveStatesMembers").call(this);
	this.initConditionalPassiveMembers();
};
/**
* Initializes members used by the conditional passive extension.
*/
Game_Battler.prototype.initConditionalPassiveMembers = function() {
	/**
	* A grouping of conditional passive runtime data.
	*/
	this._j._passive._conditional ||= {};
	/**
	* Last resolved conditional passive state ids (sorted evaluation order).
	* @type {number[]}
	*/
	if (!this._j._passive._conditional._snapshot) {
		this._j._passive._conditional._snapshot = [];
	}
	/**
	* Throttled reconcile timer for map-side condition drift.
	* @type {JABS_Timer}
	*/
	if (!this._j._passive._conditional._timer) {
		const delay = J.PASSIVE.EXT.CONDITIONAL.Metadata.reconcileDelayFrames || 15;
		this._j._passive._conditional._timer = new JABS_Timer(delay);
	}
};
/**
* @returns {number[]}
*/
Game_Battler.prototype.getConditionalPassiveSnapshot = function() {
	this.initConditionalPassiveMembers();
	return this._j._passive._conditional._snapshot;
};
/**
* @param {number[]} stateIds
*/
Game_Battler.prototype.setConditionalPassiveSnapshot = function(stateIds) {
	this.initConditionalPassiveMembers();
	this._j._passive._conditional._snapshot = stateIds.slice();
};
/**
* @returns {JABS_Timer}
*/
Game_Battler.prototype.conditionalPassiveReconcileTimer = function() {
	this.initConditionalPassiveMembers();
	return this._j._passive._conditional._timer;
};
/**
* Advances the reconcile timer and triggers a passive refresh when conditions may have drifted.
*/
Game_Battler.prototype.updateConditionalPassiveTimer = function() {
	const timer = this.conditionalPassiveReconcileTimer();
	timer.update();
	if (timer.isTimerComplete() === false) return;
	timer.reset();
	ConditionalPassiveManager.reconcile(this);
};
/**
* Extends {@link #refreshPassiveStates}.<br/>
* Appends conditional passive state ids after the static passive rebuild completes.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("refreshPassiveStates", Game_Battler.prototype.refreshPassiveStates);
Game_Battler.prototype.refreshPassiveStates = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("refreshPassiveStates").call(this);
	ConditionalPassiveManager.appendActiveConditionalPassives(this);
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/JABS_Battler.js
/**
* Extends {@link JABS_Battler#update}.<br/>
* Throttles conditional passive reconciles while this battler is active on the map.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.set("update", JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.get("update").call(this);
	this.updateConditionalPassiveReconcile();
};
/**
* Delegates throttled conditional passive reconciliation to the underlying battler.
*/
JABS_Battler.prototype.updateConditionalPassiveReconcile = function() {
	const battler = this.getBattler();
	if (!battler) return;
	if (typeof battler.updateConditionalPassiveTimer !== "function") return;
	battler.updateConditionalPassiveTimer();
};

//#endregion
//# sourceMappingURL=J-Passive-Conditional.js.map