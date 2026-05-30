//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.2 FORMULA] An extension for JABS that allows multiple damage formulas.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * ----------------------------------------------------------------------------
 * This extension enables a single skill to apply additional effects using one
 * or more "formula packets" or "child-skill packets". Each packet can:
 *   - Fire at a specific time (on use or on hit)
 *   - Affect a particular set of recipients (self, allies, target, enemies, all)
 *   - Either:
 *       1) Apply an inline formula to HP/MP/TP, or
 *       2) Execute another authored skill as a child
 *
 * Packets are defined via note tags on skills. Multiple packets can be declared
 * on the same skill by placing multiple tags on the skill’s note box.
 *
 * Requirements:
 *   - J-Base (required by all of my plugins)
 *   - J-ABS (Action Battle System)
 *
 * Scope:
 *   - These tags are read from Skills only.
 *   - Items are currently not parsed by this extension.
 *
 * ============================================================================
 * TAGS: BY-FORMULA PACKETS
 * ----------------------------------------------------------------------------
 * Use this to apply an inline formula result to a resource for one or more
 * recipients when the packet triggers.
 *
 * Tag format:
 *   <on-HH:to-AA:by-formula:for-RR:[FORMULA]>
 *
 * Where:
 *   - HH (trigger):
 *       hit  -> triggers after the parent skill successfully hits a target
 *       use  -> triggers immediately when the parent skill is used (even if it misses)
 *   - AA (affect):
 *       self     -> the user of the skill
 *       target   -> the primary target of the parent skill (falls back to self if none)
 *       allies   -> all allies of the user on the map
 *       enemies  -> all enemies of the user on the map
 *       all      -> all battlers on the map (living and animate only)
 *   - RR (resource):
 *       hp, mp, tp
 *   - FORMULA: A JavaScript expression evaluated with these variables in scope:
 *       a = source (the user/subject)
 *       b = recipient (the current entity being affected)
 *       v = $gameVariables._data (array-style access: v[10], etc.)
 *       i = the parent RPG_Skill (useful for metadata lookups)
 *     The formula may use standard JS math (e.g., Math.max, Math.floor).
 *
 * Semantics of the formula result:
 *   - Positive result => loss (damage to HP/MP/TP)
 *   - Negative result => gain (healing HP, or granting MP/TP)
 *   - Zero => no effect
 *
 * Battle pipeline adjustments (applied automatically):
 *   Damage path (positive results):
 *     - Element rate (from the parent skill)
 *     - Critical (on-hit packets only, mirrors the parent action’s crit)
 *     - Physical/Magical damage rate (based on parent skill’s phys/mag type)
 *     - Native guard
 *     - Variance
 *     - JABS guard/parry reductions
 *   Healing path (negative results turned positive internally):
 *     - Element rate
 *     - Physical/Magical damage rate (treats as the parent’s type)
 *     - Variance
 *     - REC (recovery) on the recipient
 *
 * Visuals and logs:
 *   - Popups (J-POPUPS): shows resource-specific damage/heal popups
 *   - Logs (J-LOG): writes action-log entries attributed to the parent skill
 *
 * Examples:
 *   - On hit, damage the original target’s HP for the user’s ATK x2 minus target DEF:
 *       <on-hit:to-target:by-formula:for-hp:[a.atk * 2 - b.def]>
 *
 *   - On use, grant self 25 TP immediately:
 *       <on-use:to-self:by-formula:for-tp:[25]>
 *
 *   - On hit, heal allies for 10% of the user’s max HP (negative = heal):
 *       <on-hit:to-allies:by-formula:for-hp:[-(a.mhp * 0.10)]>
 *
 *   - On use, drain 5 MP from all enemies (positive = loss):
 *       <on-use:to-enemies:by-formula:for-mp:[5]>
 *
 * ============================================================================
 * TAGS: BY-SKILL (CHILD SKILL) PACKETS
 * ----------------------------------------------------------------------------
 * Use this to execute another authored skill as a child of the parent action.
 * Child skill executions:
 *   - Do not consume cost, do not apply cooldown, and do not run common events.
 *   - Execute immediately as a JABS action (animations/effects/collisions/logs/threat apply).
 *   - Do not cascade further FORMULA/skill packets (one level only).
 *   - For on-hit packets, child damage can mirror the parent crit state when appropriate.
 *
 * Tag format:
 *   <on-HH:to-AA:by-skill:[SKILL_ID]>
 *
 * Where:
 *   - HH (trigger): hit | use
 *   - AA (affect): self | target | allies | enemies | all
 *   - SKILL_ID: the database ID of the skill to execute
 *
 * Examples:
 *   - On hit, also fire skill 123 at the original target:
 *       <on-hit:to-target:by-skill:[123]>
 *
 *   - On use, cast an aura skill 77 centered on self:
 *       <on-use:to-self:by-skill:[77]>
 *
 * Notes:
 *   - For target/allies/enemies/all, position bias uses the recipient’s current
 *     location when available, which is useful for ground-targeted child skills.
 *   - Child skill execution is compute/force-only (no costs/cooldowns/casts).
 *
 * ============================================================================
 * EXECUTION ORDER AND TIMING
 * ----------------------------------------------------------------------------
 * - on-use packets are applied immediately when the parent skill is used.
 * - on-hit packets are applied after the parent skill resolves hit/miss and damage.
 * - Multiple packets of the same timing are applied in the order they appear in notes.
 *
 * ============================================================================
 * VALIDATION AND SAFETY
 * ----------------------------------------------------------------------------
 * - Invalid tags (unknown trigger/affect/resource/mode) are ignored.
 * - Skills only: tags on other database objects are ignored by this extension.
 * - Recipients must be alive and animate (dead/inanimate are filtered out).
 * - If a child skill id does not exist, the packet is ignored.
 * - Inline formulas run under JS eval; keep them simple and deterministic.
 *
 * ============================================================================
 * COMPATIBILITY
 * ----------------------------------------------------------------------------
 * - J-Base: required; used for note parsing helpers.
 * - J-ABS: required; this is an ABS extension and depends on JABS context.
 * - J-POPUPS (optional): enables damage/heal popups for packets.
 * - J-LOG (optional): enables action-log entries for packets.
 *
 * ============================================================================
 * QUICK REFERENCE
 * ----------------------------------------------------------------------------
 * BY-FORMULA:
 *   <on-(hit|use):to-(self|target|allies|enemies|all):by-formula:for-(hp|mp|tp):[FORMULA]>
 *
 * BY-SKILL:
 *   <on-(hit|use):to-(self|target|allies|enemies|all):by-skill:[SKILL_ID]>
 *
 * Formula variables:
 *   a = user/subject, b = recipient, v = $gameVariables._data, i = RPG_Skill
 * Result sign:
 *   + => damage/loss, - => heal/gain
 *
 * ============================================================================
 * CHANGELOG
 * ----------------------------------------------------------------------------
 * - 1.0.2
 *   Raised minimum J-ABS version requirement to 4.7.0.
 * - 1.0.1
 *   Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.0
 *   Initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/abs/ext/formula/_metadata/_pluginMetadata.js
var JFORMULA_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Includes translation of plugin parameters.
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
		// policy step inside initialize metadata.
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-switch"], 0);
	}
};

//#endregion
//#region src/plugins/abs/ext/formula/_metadata/initialization.js
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
J.ABS.EXT.FORMULA = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.FORMULA.Metadata = new JFORMULA_PluginMetadata("J-ABS-Formula", "1.0.2");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.FORMULA.Aliased = {};
J.ABS.EXT.FORMULA.Aliased.Game_Action = new Map();
J.ABS.EXT.FORMULA.Aliased.JABS_Engine = new Map();
/**
* Execution-time context flags and helpers for this extension.
*/
J.ABS.EXT.FORMULA.Context = {
	/**
	* Whether sub-executions should suppress cascading of this extension.
	*/
	suppressCascades: false,
	/**
	* Whether to suppress applyGlobal() (i.e., skip child skill common events).
	*/
	suppressCommonEvents: false,
	/**
	* The active trigger while applying packets ("hit" | "use").
	*/
	activeTrigger: null,
	/**
	* Buffer for action log entries generated by this extension during
	* a single Game_Action application. Flushed by the wrapper.
	* @type {ActionLog[]}
	*/
	logBuffer: []
};
/**
* Runtime behavior for log flushing.
*/
J.ABS.EXT.FORMULA.Settings = {
	/**
	* When to flush buffered logs for this extension relative to the core flow.
	* Options: "after-base" | "before-base".
	* Note: for on-hit packets you generally want "after-base".
	*/
	logFlushTiming: "after-base",
	/**
	* Prefer appending if supported by the manager (so base logs remain visually first).
	*/
	preferAppend: true
};
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.FORMULA.RegExp = {};
J.ABS.EXT.FORMULA.RegExp.FormulaApply = /<on-(hit|use):to-(self|allies|target|enemies|all):by-formula:for-(hp|mp|tp):\[([+\-*/ ().\w]+)]>/gi;
J.ABS.EXT.FORMULA.RegExp.SkillApply = /<on-(hit|use):to-(self|allies|target|enemies|all):by-skill:\[(\d+)]>/gi;

//#endregion
//#region src/plugins/abs/ext/formula/__models/FormulaEffect.js
/**
* Represents a single multi-formula packet declared on a skill/item.
*/
var FormulaEffect = class FormulaEffect {
	/**
	* A collection of trigger literals that can appear in tags.
	*/
	static Trigger = {
		/**
		* Triggers after a successful hit is confirmed.
		*/
		HIT: "hit",
		/**
		* Triggers on use (regardless of hit).
		*/
		USE: "use"
	};
	/**
	* A collection of affect-scope literals that can appear in tags.
	*/
	static Affect = {
		/**
		* Affects the subject (user) of the action.
		*/
		SELF: "self",
		/**
		* Affects subject's allies (map-wide unless further filtered by caller).
		*/
		ALLIES: "allies",
		/**
		* Affects the primary target.
		*/
		TARGET: "target",
		/**
		* Affects subject's enemies (map-wide unless further filtered by caller).
		*/
		ENEMIES: "enemies",
		/**
		* Affects all battlers tracked by JABS.
		*/
		ALL: "all"
	};
	/**
	* A collection of resource literals that can appear in tags.
	*/
	static Resource = {
		/**
		* Applies to HP (positive => damage, negative => heal when using HP semantics).
		*/
		HP: "hp",
		/**
		* Applies to MP (positive => mp damage, negative => mp heal when using MP semantics).
		*/
		MP: "mp",
		/**
		* Applies to TP (positive => tp damage, negative => tp gain when using TP semantics).
		*/
		TP: "tp"
	};
	/**
	* A collection of mode literals that can appear in tags.
	* SKILL => additional authored skill execution
	* FORMULA => inline formula magnitude routed to a resource
	*/
	static Mode = {
		SKILL: "skill",
		FORMULA: "formula"
	};
	/**
	* All allowed trigger values in a Set for quick membership checks.
	* @type {Set<string>}
	*/
	static #TRIGGERS = new Set([FormulaEffect.Trigger.HIT, FormulaEffect.Trigger.USE]);
	/**
	* All allowed affect values in a Set for quick membership checks.
	* @type {Set<string>}
	*/
	static #AFFECTS = new Set([
		FormulaEffect.Affect.SELF,
		FormulaEffect.Affect.ALLIES,
		FormulaEffect.Affect.TARGET,
		FormulaEffect.Affect.ENEMIES,
		FormulaEffect.Affect.ALL
	]);
	/**
	* All allowed resource values in a Set for quick membership checks.
	* @type {Set<string>}
	*/
	static #RESOURCES = new Set([
		FormulaEffect.Resource.HP,
		FormulaEffect.Resource.MP,
		FormulaEffect.Resource.TP
	]);
	/**
	* All allowed mode values in a Set for quick membership checks.
	* @type {Set<string>}
	*/
	static #MODES = new Set([FormulaEffect.Mode.SKILL, FormulaEffect.Mode.FORMULA]);
	/**
	* Determines if a string is a valid trigger literal.
	* @param {string} trigger The trigger string to test.
	* @returns {boolean} True if valid, false otherwise.
	*/
	static isValidTrigger(trigger) {
		return this.#TRIGGERS.has(String(trigger ?? "").toLowerCase());
	}
	/**
	* Determines if a string is a valid affect literal.
	* @param {string} affect The affect string to test.
	* @returns {boolean} True if valid, false otherwise.
	*/
	static isValidAffect(affect) {
		return this.#AFFECTS.has(String(affect ?? "").toLowerCase());
	}
	/**
	* Determines if a string is a valid resource literal.
	* @param {string} resource The resource string to test.
	* @returns {boolean} True if valid, false otherwise.
	*/
	static isValidResource(resource) {
		return this.#RESOURCES.has(String(resource ?? "").toLowerCase());
	}
	/**
	* Determines if a string is a valid mode literal.
	* @param {string} mode The mode string to test.
	* @returns {boolean} True if valid, false otherwise.
	*/
	static isValidMode(mode) {
		return this.#MODES.has(String(mode ?? "").toLowerCase());
	}
	/**
	* Normalizes a candidate trigger string to a valid constant (lowercased), or returns null.
	* @param {string} trigger The candidate trigger string.
	* @returns {string|null} The normalized trigger, or null if invalid.
	*/
	static normalizeTrigger(trigger) {
		const t = String(trigger ?? "").toLowerCase();
		return this.isValidTrigger(t) ? t : null;
	}
	/**
	* Normalizes a candidate affect string to a valid constant (lowercased), or returns null.
	* @param {string} affect The candidate affect string.
	* @returns {string|null} The normalized affect, or null if invalid.
	*/
	static normalizeAffect(affect) {
		const a = String(affect ?? "").toLowerCase();
		return this.isValidAffect(a) ? a : null;
	}
	/**
	* Normalizes a candidate resource string to a valid constant (lowercased), or returns null.
	* @param {string} resource The candidate resource string.
	* @returns {string|null} The normalized resource, or null if invalid.
	*/
	static normalizeResource(resource) {
		const r = String(resource ?? "").toLowerCase();
		return this.isValidResource(r) ? r : null;
	}
	/**
	* Normalizes a candidate mode string to a valid constant (lowercased), or returns null.
	* @param {string} mode The candidate mode string.
	* @returns {string|null} The normalized mode, or null if invalid.
	*/
	static normalizeMode(mode) {
		const m = String(mode ?? "").toLowerCase();
		return this.isValidMode(m) ? m : null;
	}
	/**
	* Creates a {@link FormulaEffect} from a capture-tuple like
	* [trigger, affect, resource, formula] for by-formula tags.
	* @param {string[]} tuple The [trigger, affect, resource, formula] tuple.
	* @returns {FormulaEffect} A new effect instance.
	*/
	static fromFormulaTuple(tuple) {
		const [trigger, affect, resource, formula] = tuple;
		return new FormulaEffect({
			trigger,
			affect,
			mode: FormulaEffect.Mode.FORMULA,
			resource,
			formula
		});
	}
	/**
	* Creates a {@link FormulaEffect} from a capture-tuple like
	* [trigger, affect, skillIdString] for by-skill tags.
	* @param {string[]} tuple The [trigger, affect, skillIdString] tuple.
	* @returns {FormulaEffect} A new effect instance.
	*/
	static fromSkillTuple(tuple) {
		const [trigger, affect, skillIdString] = tuple;
		const skillId = parseInt(skillIdString);
		return new FormulaEffect({
			trigger,
			affect,
			mode: FormulaEffect.Mode.SKILL,
			skillId
		});
	}
	/**
	* The trigger of this formula effect.
	* @type {string}
	*/
	trigger = FormulaEffect.Trigger.HIT;
	/**
	* The target being affected by this formula effect.
	* @type {string}
	*/
	affect = FormulaEffect.Affect.TARGET;
	/**
	* The mode for this effect packet: "skill" | "formula".
	* @type {string}
	*/
	mode = FormulaEffect.Mode.FORMULA;
	/**
	* The resource this effect applies to (hp/mp/tp); null for by-skill.
	* @type {string|null}
	*/
	resource = null;
	/**
	* The inline formula to execute when this packet triggers (by-formula only).
	* @type {string}
	*/
	formula = String.empty;
	/**
	* The database id of the child skill to execute (by-skill only).
	* @type {number}
	*/
	skillId = 0;
	/**
	* Constructor.
	* @param {{
	*  trigger: string,
	*  affect: string,
	*  mode: string,
	*  resource?: string|null,
	*  formula?: string,
	*  skillId?: number,
	* }} init Initialization bag.
	*/
	constructor(init) {
		this.trigger = FormulaEffect.normalizeTrigger(init.trigger) ?? FormulaEffect.Trigger.HIT;
		this.affect = FormulaEffect.normalizeAffect(init.affect) ?? FormulaEffect.Affect.TARGET;
		this.mode = FormulaEffect.normalizeMode(init.mode) ?? FormulaEffect.Mode.FORMULA;
		const hasResource = init.resource !== null && init.resource !== undefined;
		const normalizedResource = hasResource ? FormulaEffect.normalizeResource(init.resource) : null;
		this.resource = this.mode === FormulaEffect.Mode.FORMULA ? normalizedResource ?? FormulaEffect.Resource.HP : null;
		this.formula = this.mode === FormulaEffect.Mode.FORMULA ? String(init.formula ?? String.empty) : String.empty;
		this.skillId = this.mode === FormulaEffect.Mode.SKILL ? parseInt(init.skillId ?? 0) || 0 : 0;
	}
};

//#endregion
//#region src/plugins/abs/ext/formula/_metadata/pluginCommands.js
/**
* Plugin command for doing the thing.
*/
PluginManager.registerCommand(J.ABS.EXT.FORMULA.Metadata.name, "do-the-thing", (args) => {
	console.log("did the thing.");
});

//#endregion
//#region src/plugins/abs/ext/formula/database/RPG_Skill.js
/**
* Gets all FormulaEffect packets defined on this skill via J.ABS.EXT.FORMULA.
* Parsed once and cached on the skill instance.
* @returns {FormulaEffect[]}
*/
RPG_Skill.prototype.jabsFormulaEffects = function() {
	this._j ||= {};
	this._j._abs ||= {};
	if (!this._j._abs._formulaEffects) {
		this._j._abs._formulaEffects = this.extractJabsFormulaEffects();
	}
	return this._j._abs._formulaEffects;
};
/**
* Parses the notes for all formula effects using the extension regex and central model.
* Consumes both the "by-formula" and "by-skill" tag families.
* @returns {FormulaEffect[]}
*/
RPG_Skill.prototype.extractJabsFormulaEffects = function() {
	const formulaTuples = RPGManager.getAllCapturesFromNoteByRegex(this, J.ABS.EXT.FORMULA.RegExp.FormulaApply, false) || [];
	const skillTuples = RPGManager.getAllCapturesFromNoteByRegex(this, J.ABS.EXT.FORMULA.RegExp.SkillApply, false) || [];
	const formulaEffects = formulaTuples.map(FormulaEffect.fromFormulaTuple, FormulaEffect);
	const skillEffects = skillTuples.map(FormulaEffect.fromSkillTuple, FormulaEffect);
	return [...formulaEffects, ...skillEffects];
};

//#endregion
//#region src/plugins/abs/ext/formula/managers/JABS_Engine.js
J.ABS.EXT.FORMULA.Aliased.JABS_Engine ||= new Map();
/**
* Extends {@link JABS_Engine.applyOnExecutionEffects}.<br/>
* Fires on-use packets at action launch time (normal execution path).
* @param {JABS_Battler} caster The battler executing the skill.
* @param {JABS_Action} primaryAction The 0th index action for this launch.
*/
J.ABS.EXT.FORMULA.Aliased.JABS_Engine.set("applyOnExecutionEffects", JABS_Engine.prototype.applyOnExecutionEffects);
JABS_Engine.prototype.applyOnExecutionEffects = function(caster, primaryAction) {
	J.ABS.EXT.FORMULA.Aliased.JABS_Engine.get("applyOnExecutionEffects").call(this, caster, primaryAction);
	this.applyOnUseFormulaPackets(caster, primaryAction);
};
/**
* Applies J.ABS.EXT.FORMULA on-use packets for the underlying Game_Action
* of the provided primary JABS action. Executed at action launch time.
* @param {JABS_Battler} caster The JABS battler launching the action.
* @param {JABS_Action} primaryAction The primary JABS action (index 0).
*/
JABS_Engine.prototype.applyOnUseFormulaPackets = function(caster, primaryAction) {
	const gameAction = primaryAction.getAction();
	if (!gameAction) return;
	const ctx = J.ABS.EXT.FORMULA.Context;
	const prevTrigger = ctx.activeTrigger;
	const prevCascade = ctx.suppressCascades;
	ctx.activeTrigger = FormulaEffect.Trigger.USE;
	ctx.suppressCascades = false;
	try {
		gameAction.applyFormulaPackets(FormulaEffect.Trigger.USE, null);
	} finally {
		ctx.suppressCascades = prevCascade;
		ctx.activeTrigger = prevTrigger;
	}
};
/**
* Extends {@link JABS_Engine.forceMapAction}.<br/>
* Ensures on-use packets are also fired at launch time for forced/immediate actions.
* @param {JABS_Battler} caster The battler executing the skill.
* @param {number} skillId The skill to be executed.
* @param {boolean=} isRetaliation Whether this is a retaliation skill.
* @param {number=} targetX The target's x-coordinate.
* @param {number=} targetY The target's y-coordinate.
* @param {boolean=} isMapDamage Whether this is environmental damage.
*/
J.ABS.EXT.FORMULA.Aliased.JABS_Engine.set("forceMapAction", JABS_Engine.prototype.forceMapAction);
JABS_Engine.prototype.forceMapAction = function(caster, skillId, isRetaliation = false, targetX = null, targetY = null, isMapDamage = false) {
	const actionLocation = JABS_Location.Builder().setX(targetX).setY(targetY).build();
	const actionOptions = JABS_ActionOptions.Builder().setIsRetaliation(isRetaliation).setLocation(actionLocation).setIsTerrainDamage(isMapDamage).build();
	const previewActions = caster.createJabsActionFromSkill(skillId, actionOptions);
	if (!this.canExecuteMapActions(caster, previewActions)) return;
	this.applyOnUseFormulaPackets(caster, previewActions[0]);
	J.ABS.EXT.FORMULA.Aliased.JABS_Engine.get("forceMapAction").call(this, caster, skillId, isRetaliation, targetX, targetY, isMapDamage);
};

//#endregion
//#region src/plugins/abs/ext/formula/objects/Game_Action.js
/**
* Extends {@link Game_Action.applyVirtualJabsAction}.<br/>
* Injects on-use packets before the core apply flow, and on-hit packets after.
* @param {Game_Battler} target The primary target for this action.
*/
J.ABS.EXT.FORMULA.Aliased.Game_Action.set("applyVirtualJabsAction", Game_Action.prototype.applyVirtualJabsAction);
Game_Action.prototype.applyVirtualJabsAction = function(target) {
	J.ABS.EXT.FORMULA.Aliased.Game_Action.get("applyVirtualJabsAction").call(this, target);
	const ctx = J.ABS.EXT.FORMULA.Context;
	const prevTrigger = ctx.activeTrigger;
	const prevCascade = ctx.suppressCascades;
	ctx.activeTrigger = FormulaEffect.Trigger.HIT;
	ctx.suppressCascades = false;
	this.applyFormulaPackets(FormulaEffect.Trigger.HIT, target);
	ctx.suppressCascades = prevCascade;
	ctx.activeTrigger = prevTrigger;
};
/**
* Resolves and applies all formula packets on this.item() for a given trigger.
* @param {"hit"|"use"} trigger The trigger timing to apply.
* @param {Game_Battler} parentTarget The primary target (used for affect-target, and crit parity for child).
*/
Game_Action.prototype.applyFormulaPackets = function(trigger, parentTarget) {
	const skill = this.item();
	if (!skill || !skill.isSkill()) return;
	const allEffects = skill.jabsFormulaEffects();
	if (!allEffects.length) return;
	const effects = allEffects.filter((e) => e.trigger === trigger);
	if (!effects.length) return;
	effects.forEach((effect) => this.applyFormulaPacket(effect, parentTarget), this);
};
/**
* Applies a single packet to all resolved recipients.
* @param {FormulaEffect} effect The effect definition.
* @param {Game_Battler} parentTarget The primary target from the parent action.
*/
Game_Action.prototype.applyFormulaPacket = function(effect, parentTarget) {
	if (J.ABS.EXT.FORMULA.Context.suppressCascades) return;
	const recipients = this.resolveFormulaRecipients(effect.affect, parentTarget);
	if (!recipients.length) return;
	if (effect.mode === FormulaEffect.Mode.FORMULA) {
		recipients.forEach((recipient) => this.applyFormulaModePacket(effect, recipient), this);
	} else if (effect.mode === FormulaEffect.Mode.SKILL && effect.skillId > 0) {
		recipients.forEach((recipient) => this.executeChildSkillPacket(effect, recipient, parentTarget), this);
	}
};
/**
* Resolves recipients for a packet based on its affect key.
* @param {"self"|"allies"|"target"|"enemies"|"all"} affect The affect key.
* @param {Game_Battler} parentTarget The current parent target (if relevant).
* @returns {Game_Battler[]} Recipients for this packet.
*/
Game_Action.prototype.resolveFormulaRecipients = function(affect, parentTarget) {
	const subject = this.subject();
	const mapToBattlers = (jabsBattlers) => jabsBattlers.map((j) => j.getBattler());
	switch (affect) {
		case FormulaEffect.Affect.SELF: return [subject];
		case FormulaEffect.Affect.TARGET: return parentTarget ? [parentTarget] : [subject];
		case FormulaEffect.Affect.ALLIES: {
			const subjJabs = JABS_AiManager.getBattlerByUuid(subject.getUuid());
			if (!subjJabs) return [];
			const allies = JABS_AiManager.getAlliedBattlers(subjJabs);
			return mapToBattlers(allies).filter(this._filterFormulaEligibleBattler, this);
		}
		case FormulaEffect.Affect.ENEMIES: {
			const subjJabs = JABS_AiManager.getBattlerByUuid(subject.getUuid());
			if (!subjJabs) return [];
			const foes = JABS_AiManager.getOpposingBattlers(subjJabs);
			return mapToBattlers(foes).filter(this._filterFormulaEligibleBattler, this);
		}
		case FormulaEffect.Affect.ALL: {
			const all = JABS_AiManager.getAllBattlers();
			return mapToBattlers(all).filter(this._filterFormulaEligibleBattler, this);
		}
	}
	return [];
};
/**
* Filters out battlers we shouldn’t affect (dead or inanimate).
* @param {Game_Battler} battler The battler being considered.
* @returns {boolean} True if eligible, false otherwise.
*/
Game_Action.prototype._filterFormulaEligibleBattler = function(battler) {
	if (!battler) return false;
	if (battler.isDead()) return false;
	if (battler.isInanimate()) return false;
	return true;
};
/**
* Evaluates a formula with contextual variables.
*  a = source (subject), b = recipient, v = variables, i = current item/skill.
* @param {string} formula The formula text to eval.
* @param {Game_Battler} source The subject.
* @param {Game_Battler} recipient The recipient.
* @param {RPG_Skill|RPG_Item} item The item/skill.
* @returns {number} The result (positive => damage, negative => heal/gain).
*/
Game_Action.prototype.evaluateFormula = function(formula, source, recipient, item) {
	const a = source;
	const b = recipient;
	const v = $gameVariables._data;
	const i = item;
	let result;
	try {
		result = eval(formula);
		if (!Number.isFinite(result)) throw new Error("Invalid formula output.");
	} catch (err) {
		console.warn(`J.FORMULA eval failed: [ ${formula} ]`);
		console.trace();
		throw err;
	}
	return parseFloat(Number(result).toFixed(3));
};
/**
* Applies a by-formula packet to a single recipient using the full battle pipeline.
* @param {FormulaEffect} effect The by-formula effect.
* @param {Game_Battler} recipient The recipient.
*/
Game_Action.prototype.applyFormulaModePacket = function(effect, recipient) {
	const raw = this.evaluateFormula(effect.formula, this.subject(), recipient, this.item());
	if (!raw) return;
	const isDamage = raw > 0;
	const baseMag = Math.abs(raw);
	const piped = this.pipeFormulaThroughBattleCalculations(recipient, baseMag, effect, isDamage);
	const mag = Math.max(0, Math.round(piped));
	if (mag === 0) return;
	const r = recipient.result();
	const snapshot = {
		used: r.used,
		missed: r.missed,
		evaded: r.evaded,
		critical: r.critical,
		hpDamage: r.hpDamage,
		mpDamage: r.mpDamage,
		tpDamage: r.tpDamage,
		parried: r.parried,
		reduced: r.reduced,
		physical: r.physical,
		drain: r.drain
	};
	switch (effect.resource) {
		case FormulaEffect.Resource.HP:
			recipient.gainHp(isDamage ? -mag : +mag);
			break;
		case FormulaEffect.Resource.MP:
			recipient.gainMp(isDamage ? -mag : +mag);
			break;
		case FormulaEffect.Resource.TP:
			recipient.gainTp(isDamage ? -mag : +mag);
			break;
	}
	this.makeSuccess(recipient);
	this.onFormulaResourceDelta(recipient, isDamage ? mag : -mag, effect.resource);
	const signed = isDamage ? mag : -mag;
	const parentSkillId = this.item() ? this.item().id : 0;
	this.generateFormulaActionLogIfAvailable(recipient, signed, effect.resource, parentSkillId);
	r.used = snapshot.used;
	r.missed = snapshot.missed;
	r.evaded = snapshot.evaded;
	r.critical = snapshot.critical;
	r.hpDamage = snapshot.hpDamage;
	r.mpDamage = snapshot.mpDamage;
	r.tpDamage = snapshot.tpDamage;
	r.parried = snapshot.parried;
	r.reduced = snapshot.reduced;
	r.physical = snapshot.physical;
	r.drain = snapshot.drain;
};
/**
* Runs a packet’s magnitude (always positive) through the battle pipeline.
* Damage path:
*  - element rate
*  - critical (on-hit only if result.critical true)
*  - physical/magical damage rate
*  - native guard
*  - variance
*  - JABS guard/parry reductions
* Healing path:
*  - element rate
*  - physical/magical damage rate
*  - variance
*  - REC (recovery)
* @param {Game_Battler} target The recipient.
* @param {number} magnitude The base magnitude (>=0).
* @param {FormulaEffect} effect The effect definition.
* @param {boolean} isDamage Whether this is damage.
* @returns {number} The post-pipeline magnitude.
*/
Game_Action.prototype.pipeFormulaThroughBattleCalculations = function(target, magnitude, effect, isDamage) {
	let value = magnitude;
	value *= this.calcElementRate(target);
	const targetResult = target.result();
	if (isDamage && J.ABS.EXT.FORMULA.Context.activeTrigger === FormulaEffect.Trigger.HIT && targetResult && targetResult.critical) {
		value = this.applyCritical(value);
	}
	if (this.isPhysical()) {
		value *= target.pdr;
	}
	if (this.isMagical()) {
		value *= target.mdr;
	}
	if (isDamage) {
		value = this.applyGuard(value, target);
	}
	value = this.applyVariance(value, this.item().damage.variance);
	if (isDamage) {
		value = Math.round(value);
		if (this.canHandleGuardEffects(target)) {
			const guardingJabsBattler = JABS_AiManager.getBattlerByUuid(target.getUuid());
			if (guardingJabsBattler) {
				value = this.handleGuardEffects(value, guardingJabsBattler);
			}
		}
	}
	if (!isDamage) {
		value = this.applyResourceHealingWithRecovery(target, value, effect.resource);
	}
	return Math.max(0, value);
};
/**
* Applies REC to a healing magnitude (already positive) across resources.
* Mirrors native healing treatment (HP REC), generalized for MP/TP per project rules.
* @param {Game_Battler} target The recipient of healing.
* @param {number} magnitude The base positive healing amount.
* @param {"hp"|"mp"|"tp"} resource The resource being healed.
* @returns {number} The REC-adjusted, rounded healing amount.
*/
Game_Action.prototype.applyResourceHealingWithRecovery = function(target, magnitude, resource) {
	let healed = magnitude * target.rec;
	healed = Math.round(healed);
	return healed;
};
/**
* Executes a child skill compute-only against a single recipient.
* - No cost/cooldown/common events
* - No cascading of FORMULA/skill packets
* - Parity with crit on on-hit against parent target
* @param {FormulaEffect} effect The by-skill packet (skillId must be > 0).
* @param {Game_Battler} recipient The recipient of the child skill.
* @param {Game_Battler} parentTarget The original parent action’s primary target.
*/
Game_Action.prototype.executeChildSkillPacket = function(effect, recipient, parentTarget) {
	const child = $dataSkills[effect.skillId];
	if (!child) return;
	const subject = this.subject();
	const jabsSubject = JABS_AiManager.getBattlerByUuid(subject.getUuid());
	if (!jabsSubject) return;
	let targetX = null;
	let targetY = null;
	if (recipient) {
		const jabsRecipient = JABS_AiManager.getBattlerByUuid(recipient.getUuid());
		if (jabsRecipient) {
			targetX = jabsRecipient.getX();
			targetY = jabsRecipient.getY();
		}
	}
	const actions = jabsSubject.createJabsActionFromSkill(effect.skillId);
	if (!actions || !actions.length) return;
	$jabsEngine.forceMapAction(jabsSubject, effect.skillId, false, targetX, targetY);
};
/**
* Lifecycle event: a formula effect applied a resource delta to a recipient.
* Extended by optional plugins (e.g. J-Popups-ABS) to surface map feedback.
* The amount is signed (positive => damage/loss, negative => heal/gain).
* @param {Game_Battler} recipient The battler who received the effect.
* @param {number} amount The signed amount.
* @param {"hp"|"mp"|"tp"} resource Which resource this packet targeted.
*/
Game_Action.prototype.onFormulaResourceDelta = function(recipient, amount, resource) {};
/**
* Generates an action log entry for FORMULA and child-skill packets for any resource.
* Healing may also be critical depending on the action result.
* Only guards once against logging plugin presence.
* @param {Game_Battler} recipient The battler who received the effect.
* @param {number} amount The signed amount (positive => damage/loss, negative => heal/gain).
* @param {"hp"|"mp"|"tp"} resource Which resource this packet targeted.
* @param {number} skillId The skill id attributed to this packet (parent or child).
* @param {number=} reduced Optional reduced magnitude (HP typically) when known.
*/
Game_Action.prototype.generateFormulaActionLogIfAvailable = function(recipient, amount, resource, skillId, reduced) {
	if (!J.LOG) return;
	const signed = Math.round(amount);
	const magnitude = Math.abs(signed);
	if (magnitude === 0) return;
	const caster = this.subject();
	const casterName = caster ? caster.name() : "Unknown";
	const targetName = recipient ? recipient.name() : "Unknown";
	let reducedAmount = String.empty;
	if (typeof reduced === "number" && reduced !== 0) {
		reducedAmount = `(${Math.round(Math.abs(reduced))})`;
	}
	const isHeal = signed < 0;
	const recipientResult = recipient.result();
	const wasCrit = recipientResult ? recipientResult.critical === true : false;
	const log = new ActionLogBuilder().setupExecution(targetName, casterName, skillId || 0, magnitude, reducedAmount, isHeal, wasCrit).build();
	$actionLogManager.addLog(log);
};
/**
* Extends {@link Game_Action.applyGlobal}.<br/>
* Suppresses common events while J.ABS.EXT.FORMULA.Context.suppressCommonEvents is true.
*/
J.ABS.EXT.FORMULA.Aliased.Game_Action.set("applyGlobal", Game_Action.prototype.applyGlobal);
Game_Action.prototype.applyGlobal = function() {
	if (J.ABS.EXT.FORMULA.Context.suppressCommonEvents) return;
	J.ABS.EXT.FORMULA.Aliased.Game_Action.get("applyGlobal").call(this);
};

//#endregion
//# sourceMappingURL=J-ABS-Formula.js.map