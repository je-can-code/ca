//region FormulaEffect
/**
 * Represents a single multi-formula packet declared on a skill/item.
 */
class FormulaEffect
{
  //region static constants and helpers
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
    USE: "use",
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
    ALL: "all",
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
    TP: "tp",
  };

  /**
   * A collection of mode literals that can appear in tags.
   * SKILL => additional authored skill execution
   * FORMULA => inline formula magnitude routed to a resource
   */
  static Mode = {
    SKILL: "skill",
    FORMULA: "formula",
  };

  /**
   * All allowed trigger values in a Set for quick membership checks.
   * @type {Set<string>}
   */
  static #TRIGGERS = new Set([
    FormulaEffect.Trigger.HIT, FormulaEffect.Trigger.USE, ]);

  /**
   * All allowed affect values in a Set for quick membership checks.
   * @type {Set<string>}
   */
  static #AFFECTS = new Set([
    FormulaEffect.Affect.SELF,
    FormulaEffect.Affect.ALLIES,
    FormulaEffect.Affect.TARGET,
    FormulaEffect.Affect.ENEMIES,
    FormulaEffect.Affect.ALL, ]);

  /**
   * All allowed resource values in a Set for quick membership checks.
   * @type {Set<string>}
   */
  static #RESOURCES = new Set([
    FormulaEffect.Resource.HP, FormulaEffect.Resource.MP, FormulaEffect.Resource.TP, ]);

  /**
   * All allowed mode values in a Set for quick membership checks.
   * @type {Set<string>}
   */
  static #MODES = new Set([
    FormulaEffect.Mode.SKILL, FormulaEffect.Mode.FORMULA, ]);

  /**
   * Determines if a string is a valid trigger literal.
   * @param {string} trigger The trigger string to test.
   * @returns {boolean} True if valid, false otherwise.
   */
  static isValidTrigger(trigger)
  {
    // Check membership in the triggers set.
    return this.#TRIGGERS.has(String(trigger ?? "")
      .toLowerCase());
  }

  /**
   * Determines if a string is a valid affect literal.
   * @param {string} affect The affect string to test.
   * @returns {boolean} True if valid, false otherwise.
   */
  static isValidAffect(affect)
  {
    // Check membership in the affects set.
    return this.#AFFECTS.has(String(affect ?? "")
      .toLowerCase());
  }

  /**
   * Determines if a string is a valid resource literal.
   * @param {string} resource The resource string to test.
   * @returns {boolean} True if valid, false otherwise.
   */
  static isValidResource(resource)
  {
    // Check membership in the resources set.
    return this.#RESOURCES.has(String(resource ?? "")
      .toLowerCase());
  }

  /**
   * Determines if a string is a valid mode literal.
   * @param {string} mode The mode string to test.
   * @returns {boolean} True if valid, false otherwise.
   */
  static isValidMode(mode)
  {
    // Check membership in the modes set.
    return this.#MODES.has(String(mode ?? "")
      .toLowerCase());
  }

  /**
   * Normalizes a candidate trigger string to a valid constant (lowercased), or returns null.
   * @param {string} trigger The candidate trigger string.
   * @returns {string|null} The normalized trigger, or null if invalid.
   */
  static normalizeTrigger(trigger)
  {
    // Coerce to lowercase string for matching.
    const t = String(trigger ?? "")
      .toLowerCase();

    // Delegate validity check to avoid duplication.
    return this.isValidTrigger(t)
      ? t
      : null;
  }

  /**
   * Normalizes a candidate affect string to a valid constant (lowercased), or returns null.
   * @param {string} affect The candidate affect string.
   * @returns {string|null} The normalized affect, or null if invalid.
   */
  static normalizeAffect(affect)
  {
    // Coerce to lowercase string for matching.
    const a = String(affect ?? "")
      .toLowerCase();

    // Delegate validity check to avoid duplication.
    return this.isValidAffect(a)
      ? a
      : null;
  }

  /**
   * Normalizes a candidate resource string to a valid constant (lowercased), or returns null.
   * @param {string} resource The candidate resource string.
   * @returns {string|null} The normalized resource, or null if invalid.
   */
  static normalizeResource(resource)
  {
    // Coerce to lowercase string for matching.
    const r = String(resource ?? "")
      .toLowerCase();

    // Delegate validity check to avoid duplication.
    return this.isValidResource(r)
      ? r
      : null;
  }

  /**
   * Normalizes a candidate mode string to a valid constant (lowercased), or returns null.
   * @param {string} mode The candidate mode string.
   * @returns {string|null} The normalized mode, or null if invalid.
   */
  static normalizeMode(mode)
  {
    // Coerce to lowercase string for matching.
    const m = String(mode ?? "")
      .toLowerCase();

    // Delegate validity check to avoid duplication.
    return this.isValidMode(m)
      ? m
      : null;
  }

  /**
   * Creates a {@link FormulaEffect} from a capture-tuple like
   * [trigger, affect, resource, formula] for by-formula tags.
   * @param {string[]} tuple The [trigger, affect, resource, formula] tuple.
   * @returns {FormulaEffect} A new effect instance.
   */
  static fromFormulaTuple(tuple)
  {
    // destructure the expected values from the tuple.
    const [ trigger, affect, resource, formula ] = tuple;

    // build an effect using the constructor for normalization.
    return new FormulaEffect({
      trigger,
      affect,
      mode: FormulaEffect.Mode.FORMULA,
      resource,
      formula,
    });
  }

  /**
   * Creates a {@link FormulaEffect} from a capture-tuple like
   * [trigger, affect, skillIdString] for by-skill tags.
   * @param {string[]} tuple The [trigger, affect, skillIdString] tuple.
   * @returns {FormulaEffect} A new effect instance.
   */
  static fromSkillTuple(tuple)
  {
    // destructure the expected values from the tuple.
    const [ trigger, affect, skillIdString ] = tuple;

    // parse the id defensively.
    const skillId = parseInt(skillIdString);

    // build an effect using the constructor for normalization.
    return new FormulaEffect({
      trigger,
      affect,
      mode: FormulaEffect.Mode.SKILL,
      skillId,
    });
  }

  //endregion static constants and helpers

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
  constructor(init)
  {
    // normalize and assign trigger or default to HIT.
    this.trigger = FormulaEffect.normalizeTrigger(init.trigger) ?? FormulaEffect.Trigger.HIT;

    // normalize and assign affect or default to TARGET.
    this.affect = FormulaEffect.normalizeAffect(init.affect) ?? FormulaEffect.Affect.TARGET;

    // normalize and assign mode or default to FORMULA.
    this.mode = FormulaEffect.normalizeMode(init.mode) ?? FormulaEffect.Mode.FORMULA;

    // determine if a resource value was actually provided (strict presence check).
    const hasResource = (init.resource !== null) && (init.resource !== undefined);

    // only normalize resource when provided; resource is meaningful only for by-formula.
    const normalizedResource = hasResource
      ? FormulaEffect.normalizeResource(init.resource)
      : null;

    // assign the resource for formula mode; default to HP if provided value was invalid.
    this.resource = (this.mode === FormulaEffect.Mode.FORMULA)
      ? (normalizedResource ?? FormulaEffect.Resource.HP)
      : null;

    // store the formula for by-formula, or empty string.
    this.formula = (this.mode === FormulaEffect.Mode.FORMULA)
      ? String(init.formula ?? String.empty)
      : String.empty;

    // store the skill id for by-skill, or 0.
    this.skillId = (this.mode === FormulaEffect.Mode.SKILL)
      ? (parseInt(init.skillId ?? 0) || 0)
      : 0;
  }
}

//endregion FormulaEffect

//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 FORMULA] An extension for JABS that allows multiple damage formulas.
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
 * - 1.0.0
 *   Initial release.
 * ============================================================================
 */
//endregion annotations

//region plugin metadata
class JFORMULA_PluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   * Extends {@link #postInitialize}.<br>
   * Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);
  }
}

//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

J.ABS.EXT.FORMULA = {};

/**
 * The metadata associated with this plugin.
 */
J.ABS.EXT.FORMULA.Metadata = new JFORMULA_PluginMetadata('J-ABS-Formula', '1.0.0');

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
  /** Whether sub-executions should suppress cascading of this extension. */
  suppressCascades: false,

  /** Whether to suppress applyGlobal() (i.e., skip child skill common events). */
  suppressCommonEvents: false,

  /** The active trigger while applying packets ("hit" | "use"). */
  activeTrigger: null,

  /**
   * Buffer for action log entries generated by this extension during
   * a single Game_Action application. Flushed by the wrapper.
   * @type {ActionLog[]}
   */
  logBuffer: [],
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

  /** Prefer appending if supported by the manager (so base logs remain visually first). */
  preferAppend: true,
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.FORMULA.RegExp = {};
J.ABS.EXT.FORMULA.RegExp.FormulaApply =
  /<on-(hit|use):to-(self|allies|target|enemies|all):by-formula:for-(hp|mp|tp):\[([+\-*/ ().\w]+)]>/gi;
J.ABS.EXT.FORMULA.RegExp.SkillApply =
  /<on-(hit|use):to-(self|allies|target|enemies|all):by-skill:\[(\d+)]>/gi;
//endregion initialization

//region plugin commands
/**
 * Plugin command for doing the thing.
 */
PluginManager.registerCommand(J.ABS.EXT.FORMULA.Metadata.name, "do-the-thing", args =>
{
  console.log('did the thing.');
});
//endregion plugin commands

//region RPG_Skill
/**
 * Gets all FormulaEffect packets defined on this skill via J.ABS.EXT.FORMULA.
 * Parsed once and cached on the skill instance.
 * @returns {FormulaEffect[]}
 */
RPG_Skill.prototype.jabsFormulaEffects = function()
{
  // initialize cache location if missing.
  this._j ||= {}; // shared J root.
  this._j._abs ||= {}; // JABS root.

  // build and cache on first access.
  if (!this._j._abs._formulaEffects)
  {
    this._j._abs._formulaEffects = this.extractJabsFormulaEffects();
  }

  // return cached (possibly empty) effects.
  return this._j._abs._formulaEffects;
};

/**
 * Parses the notes for all formula effects using the extension regex and central model.
 * Consumes both the "by-formula" and "by-skill" tag families.
 * @returns {FormulaEffect[]}
 */
RPG_Skill.prototype.extractJabsFormulaEffects = function()
{
  // capture tuples for by-formula (trigger, affect, resource, formula).
  const formulaTuples = RPGManager.getAllCapturesFromNoteByRegex(
    this,
    J.ABS.EXT.FORMULA.RegExp.FormulaApply,
    false) || [];

  // capture tuples for by-skill (trigger, affect, skillIdString).
  const skillTuples = RPGManager.getAllCapturesFromNoteByRegex(
    this,
    J.ABS.EXT.FORMULA.RegExp.SkillApply,
    false) || [];

  // map to FormulaEffect instances.
  const formulaEffects = formulaTuples.map(FormulaEffect.fromFormulaTuple, FormulaEffect);
  const skillEffects = skillTuples.map(FormulaEffect.fromSkillTuple, FormulaEffect);

  // combine and return (possibly empty).
  return [ ...formulaEffects, ...skillEffects ];
};
//endregion RPG_Skill

//region JABS_Engine
J.ABS.EXT.FORMULA.Aliased.JABS_Engine ||= new Map();

/**
 * Extends {@link JABS_Engine.applyOnExecutionEffects}.<br/>
 * Fires on-use packets at action launch time (normal execution path).
 * @param {JABS_Battler} caster The battler executing the skill.
 * @param {JABS_Action} primaryAction The 0th index action for this launch.
 */
J.ABS.EXT.FORMULA.Aliased.JABS_Engine.set("applyOnExecutionEffects", JABS_Engine.prototype.applyOnExecutionEffects);
JABS_Engine.prototype.applyOnExecutionEffects = function(caster, primaryAction)
{
  // perform original launch-time responsibilities (costs, cooldowns, etc.).
  J.ABS.EXT.FORMULA.Aliased.JABS_Engine.get("applyOnExecutionEffects")
    .call(this, caster, primaryAction);

  // fire on-use packets at launch time.
  this.applyOnUseFormulaPackets(caster, primaryAction);
};

/**
 * Applies J.ABS.EXT.FORMULA on-use packets for the underlying Game_Action
 * of the provided primary JABS action. Executed at action launch time.
 * @param {JABS_Battler} caster The JABS battler launching the action.
 * @param {JABS_Action} primaryAction The primary JABS action (index 0).
 */
JABS_Engine.prototype.applyOnUseFormulaPackets = function(caster, primaryAction)
{
  // obtain the underlying Game_Action from the JABS action.
  const gameAction = primaryAction.getAction();
  if (!gameAction) return; // no underlying action => nothing to apply.

  // set context to on-use while evaluating packets.
  const ctx = J.ABS.EXT.FORMULA.Context;
  const prevTrigger = ctx.activeTrigger;
  const prevCascade = ctx.suppressCascades;
  ctx.activeTrigger = FormulaEffect.Trigger.USE; // "use"
  ctx.suppressCascades = false; // parent-level packets should execute.

  try
  {
    // fire all on-use packets for this action; parentTarget is not defined at launch.
    // NOTE: <on-use:to-target:...> resolves to [] by design. Prefer self/allies/enemies/all for on-use.
    gameAction.applyFormulaPackets(FormulaEffect.Trigger.USE, null);
  }
  finally
  {
    // restore context regardless of success.
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
JABS_Engine.prototype.forceMapAction = function(
  caster,
  skillId,
  isRetaliation = false,
  targetX = null,
  targetY = null,
  isMapDamage = false
)
{
  // build options based on inputs (to derive a primary action for on-use packets).
  const actionLocation = JABS_Location.Builder()
    .setX(targetX) // set the target x.
    .setY(targetY) // set the target y.
    .build(); // build the location.
  const actionOptions = JABS_ActionOptions.Builder()
    .setIsRetaliation(isRetaliation) // set if this is a retaliation.
    .setLocation(actionLocation) // apply the action location.
    .setIsTerrainDamage(isMapDamage) // set if this is environmental damage.
    .build(); // build the options.

  // generate the actions to obtain the primary action for on-use packet firing.
  // NOTE: this preview is used only to feed the on-use hook below; actual execution is
  // performed by the original method to avoid duplication and preserve core behavior.
  const previewActions = caster.createJabsActionFromSkill(skillId, actionOptions); // create preview.

  // if we cannot execute map actions, then do not proceed.
  if (!this.canExecuteMapActions(caster, previewActions)) return; // guard execution.

  // fire on-use packets at launch time for forced actions using the primary preview action.
  this.applyOnUseFormulaPackets(caster, previewActions[0]); // launch-time on-use.

  // delegate to the original forceMapAction (immediate execution path without costs/cooldowns/cast time),
  // preserving all core behavior (animations, collisions, effects, logs, threat, etc.).
  J.ABS.EXT.FORMULA.Aliased.JABS_Engine.get("forceMapAction")
    .call(this, caster, skillId, isRetaliation, targetX, targetY, isMapDamage); // call original.
};
//endregion JABS_Engine

//region Game_Action
//region Game_Action
/**
 * Extends {@link Game_Action.applyVirtualJabsAction}.<br/>
 * Injects on-use packets before the core apply flow, and on-hit packets after.
 * @param {Game_Battler} target The primary target for this action.
 */
J.ABS.EXT.FORMULA.Aliased.Game_Action.set("applyVirtualJabsAction", Game_Action.prototype.applyVirtualJabsAction);
Game_Action.prototype.applyVirtualJabsAction = function(target)
{
  // perform original logic.
  J.ABS.EXT.FORMULA.Aliased.Game_Action.get("applyVirtualJabsAction")
    .call(this, target);

  // 2) Apply on-hit packets after the core flow completes.
  const ctx = J.ABS.EXT.FORMULA.Context;
  const prevTrigger = ctx.activeTrigger;
  const prevCascade = ctx.suppressCascades;

  ctx.activeTrigger = FormulaEffect.Trigger.HIT;
  ctx.suppressCascades = false;

  // Apply all on-hit packets for this action with the provided primary target.
  this.applyFormulaPackets(FormulaEffect.Trigger.HIT, target);

  // Restore prior context settings.
  ctx.suppressCascades = prevCascade;
  ctx.activeTrigger = prevTrigger;
};

/**
 * Resolves and applies all formula packets on this.item() for a given trigger.
 * @param {"hit"|"use"} trigger The trigger timing to apply.
 * @param {Game_Battler} parentTarget The primary target (used for affect-target, and crit parity for child).
 */
Game_Action.prototype.applyFormulaPackets = function(trigger, parentTarget)
{
  // ensure we have an item/skill to check.
  const skill = this.item();
  if (!skill || !skill.isSkill()) return; // only skills for now.

  // gather all effects and filter by trigger.
  const allEffects = skill.jabsFormulaEffects();
  if (!allEffects.length) return;

  // evaluate only matching trigger.
  const effects = allEffects.filter(e => e.trigger === trigger);
  if (!effects.length) return;

  // for each effect, resolve recipients and apply.
  effects.forEach(effect => this.applyFormulaPacket(effect, parentTarget), this);
};

/**
 * Applies a single packet to all resolved recipients.
 * @param {FormulaEffect} effect The effect definition.
 * @param {Game_Battler} parentTarget The primary target from the parent action.
 */
Game_Action.prototype.applyFormulaPacket = function(effect, parentTarget)
{
  // if a child-skill execution is ongoing and cascading is suppressed, bail.
  if (J.ABS.EXT.FORMULA.Context.suppressCascades) return;

  // build recipients list per affect key.
  const recipients = this.resolveFormulaRecipients(effect.affect, parentTarget);
  if (!recipients.length) return;

  // branch by mode for each recipient.
  if (effect.mode === FormulaEffect.Mode.FORMULA)
  {
    recipients.forEach(recipient => this.applyFormulaModePacket(effect, recipient), this);
  }
  else if (effect.mode === FormulaEffect.Mode.SKILL && effect.skillId > 0)
  {
    recipients.forEach(recipient => this.executeChildSkillPacket(effect, recipient, parentTarget), this);
  }
};

/**
 * Resolves recipients for a packet based on its affect key.
 * @param {"self"|"allies"|"target"|"enemies"|"all"} affect The affect key.
 * @param {Game_Battler} parentTarget The current parent target (if relevant).
 * @returns {Game_Battler[]} Recipients for this packet.
 */
Game_Action.prototype.resolveFormulaRecipients = function(affect, parentTarget)
{
  // subject (user) is often needed.
  const subject = this.subject();

  // helper to get underlying battlers from JABS_Battlers.
  const mapToBattlers = jabsBattlers => jabsBattlers.map(j => j.getBattler());

  switch (affect)
  {
    case FormulaEffect.Affect.SELF:
      return [ subject ];

    case FormulaEffect.Affect.TARGET:
      return parentTarget
        ? [ parentTarget ]
        : [ subject ];

    case FormulaEffect.Affect.ALLIES:
    {
      const subjJabs = JABS_AiManager.getBattlerByUuid(subject.getUuid());
      if (!subjJabs) return [];
      const allies = JABS_AiManager.getAlliedBattlers(subjJabs);
      return mapToBattlers(allies)
        .filter(this._filterFormulaEligibleBattler, this);
    }

    case FormulaEffect.Affect.ENEMIES:
    {
      const subjJabs = JABS_AiManager.getBattlerByUuid(subject.getUuid());
      if (!subjJabs) return [];
      const foes = JABS_AiManager.getOpposingBattlers(subjJabs);
      return mapToBattlers(foes)
        .filter(this._filterFormulaEligibleBattler, this);
    }

    case FormulaEffect.Affect.ALL:
    {
      const all = JABS_AiManager.getAllBattlers();
      return mapToBattlers(all)
        .filter(this._filterFormulaEligibleBattler, this);
    }
  }

  // unknown => nothing.
  return [];
};

/**
 * Filters out battlers we shouldn’t affect (dead or inanimate).
 * @param {Game_Battler} battler The battler being considered.
 * @returns {boolean} True if eligible, false otherwise.
 */
Game_Action.prototype._filterFormulaEligibleBattler = function(battler)
{
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
Game_Action.prototype.evaluateFormula = function(formula, source, recipient, item)
{
  /* eslint-disable no-unused-vars */
  const a = source;
  const b = recipient;
  const v = $gameVariables._data;
  const i = item;
  /* eslint-enable no-unused-vars */

  let result = 0;
  try
  {
    result = eval(formula);
    if (!Number.isFinite(result)) throw new Error("Invalid formula output.");
  }
  catch (err)
  {
    console.warn(`J.FORMULA eval failed: [ ${formula} ]`);
    console.trace();
    throw err;
  }

  // smoother small decimals.
  return parseFloat(Number(result)
    .toFixed(3));
};

/**
 * Applies a by-formula packet to a single recipient using the full battle pipeline.
 * @param {FormulaEffect} effect The by-formula effect.
 * @param {Game_Battler} recipient The recipient.
 */
Game_Action.prototype.applyFormulaModePacket = function(effect, recipient)
{
  // compute signed amount from formula.
  const raw = this.evaluateFormula(effect.formula, this.subject(), recipient, this.item());
  if (!raw) return;

  const isDamage = raw > 0; // identify damage vs healing/gain.
  const baseMag = Math.abs(raw); // pipeline expects a positive magnitude.

  // run magnitude through battle pipeline (element/phys-mag/guard/variance/JABS guard; REC on heals).
  const piped = this.pipeFormulaThroughBattleCalculations(recipient, baseMag, effect, isDamage);

  // finalize and apply by resource.
  const mag = Math.max(0, Math.round(piped)); // enforce non-negative integer.
  if (mag === 0) return; // no net impact.

  // snapshot the current result so our packet doesn't overwrite the base action's result.
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
    drain: r.drain,
  };

  // apply resource change with correct sign.
  switch (effect.resource)
  {
    case FormulaEffect.Resource.HP:
      recipient.gainHp(isDamage
        ? -mag
        : +mag);
      break;
    case FormulaEffect.Resource.MP:
      recipient.gainMp(isDamage
        ? -mag
        : +mag);
      break;
    case FormulaEffect.Resource.TP:
      recipient.gainTp(isDamage
        ? -mag
        : +mag);
      break;
  }

  // mark success for this secondary packet.
  this.makeSuccess(recipient);

  // popup with signed amount semantics (negative => healing visuals).
  this.generateFormulaPopIfAvailable(
    recipient,
    isDamage
      ? mag
      : -mag,
    effect.resource);

  // action log for any resource, attributed to the parent skill id.
  const signed = isDamage
    ? mag
    : -mag; // negative => heal/gain, positive => damage/loss.
  const parentSkillId = this.item()
    ? this.item().id
    : 0;
  this.generateFormulaActionLogIfAvailable(recipient, signed, effect.resource, parentSkillId);

  // restore the original action result so the base action remains authoritative for engine/JABS visuals.
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
Game_Action.prototype.pipeFormulaThroughBattleCalculations = function(target, magnitude, effect, isDamage)
{
  let value = magnitude;

  // 1) element rate using this.item()’s element.
  value *= this.calcElementRate(target);

  // 2) critical only for damage and only if parent was critical (on-hit context).
  if (isDamage && J.ABS.EXT.FORMULA.Context.activeTrigger === FormulaEffect.Trigger.HIT && target.result()?.critical)
  {
    value = this.applyCritical(value);
  }

  // 3) phys/mag damage rate.
  if (this.isPhysical())
  {
    value *= target.pdr;
  }

  if (this.isMagical())
  {
    value *= target.mdr;
  }

  // 4) guard only for damage.
  if (isDamage)
  {
    value = this.applyGuard(value, target);
  }

  // 5) variance from the item’s damage settings.
  value = this.applyVariance(value, this.item().damage.variance);

  // 6) JABS guard/parry reductions only for damage.
  if (isDamage)
  {
    value = Math.round(value);
    if (this.canHandleGuardEffects(target))
    {
      const guardingJabsBattler = JABS_AiManager.getBattlerByUuid(target.getUuid());
      if (guardingJabsBattler)
      {
        value = this.handleGuardEffects(value, guardingJabsBattler);
      }
    }
  }

  // 7) REC for healing.
  if (!isDamage)
  {
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
Game_Action.prototype.applyResourceHealingWithRecovery = function(target, magnitude, resource)
{
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
Game_Action.prototype.executeChildSkillPacket = function(effect, recipient, parentTarget)
{
  // look up the child skill.
  const child = $dataSkills[effect.skillId];
  if (!child) return; // invalid skill id => nothing to do.

  // resolve the subject as a JABS battler; full JABS actions require a JABS_Battler caster.
  const subject = this.subject();
  const jabsSubject = JABS_AiManager.getBattlerByUuid(subject.getUuid());
  if (!jabsSubject) return; // subject must exist on-map as a JABS battler.

  // optionally bias execution with the recipient’s current coordinates (useful for target/ground casts).
  let targetX = null;
  let targetY = null;
  if (recipient)
  {
    const jabsRecipient = JABS_AiManager.getBattlerByUuid(recipient.getUuid());
    if (jabsRecipient)
    {
      targetX = jabsRecipient.getX();
      targetY = jabsRecipient.getY();
    }
  }

  // build JABS actions from the child skill for the same subject.
  const actions = jabsSubject.createJabsActionFromSkill(effect.skillId);
  if (!actions || !actions.length) return;

  // Execute immediately with no costs, cooldowns, or cast time.
  // forceMapAction:
  // - ignores costs and cooldowns
  // - executes the action right away (no casting delay)
  // - still runs full authored behavior (animations, collisions, effects, logs, popups, threat)
  $jabsEngine.forceMapAction(jabsSubject, effect.skillId, false, targetX, targetY);
};

/**
 * Generates a resource-specific damage/heal popup if the popups plugin is present.
 * The amount is signed (+ = damage, - = heal/gain).
 * @param {Game_Battler} recipient The battler who received the effect.
 * @param {number} amount The signed amount (positive => loss, negative => gain).
 * @param {"hp"|"mp"|"tp"} resource Which resource this packet targeted.
 */
Game_Action.prototype.generateFormulaPopIfAvailable = function(recipient, amount, resource)
{
  // only if popups plugin exists.
  if (!J.POPUPS) return;

  // get recipient’s JABS character to anchor the pop.
  const jabs = JABS_AiManager.getBattlerByUuid(recipient.getUuid());
  if (!jabs) return;

  // signed magnitude: negative indicates healing, positive indicates damage.
  const signed = Math.round(amount);
  const magnitude = Math.abs(signed);
  if (magnitude === 0) return;

  // Build with a signed value; negative for healing is supported by the builder.
  const popupValue = signed < 0
    ? -magnitude
    : magnitude;
  const textPopBuilder = new TextPopBuilder(popupValue);

  // Select damage style based on resource.
  switch (resource)
  {
    case FormulaEffect.Resource.HP:
      textPopBuilder.isHpDamage();
      break;
    case FormulaEffect.Resource.MP:
      textPopBuilder.isMpDamage();
      break;
    case FormulaEffect.Resource.TP:
      textPopBuilder.isTpDamage();
      break;
  }

  // Build and queue the popup.
  const pop = textPopBuilder.build();
  const chara = jabs.getCharacter();
  chara.addTextPop(pop);
  chara.requestTextPop();
};

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
Game_Action.prototype.generateFormulaActionLogIfAvailable = function(recipient, amount, resource, skillId, reduced)
{
  // if the logging plugin isn't present, skip logging.
  if (!J.LOG) return;

  // normalize signed amount and magnitude.
  const signed = Math.round(amount);
  const magnitude = Math.abs(signed);
  if (magnitude === 0) return;

  // derive display names for the caster and target.
  const caster = this.subject();
  const casterName = caster
    ? caster.name()
    : "Unknown";
  const targetName = recipient
    ? recipient.name()
    : "Unknown";

  // format reduced amount if provided and non-zero (HP mitigation display).
  let reducedAmount = String.empty;
  if (typeof reduced === "number" && reduced !== 0)
  {
    reducedAmount = `(${Math.round(Math.abs(reduced))})`;
  }

  // negative => heal/gain, positive => damage/loss.
  const isHeal = signed < 0;

  // heals can also be critical; use the recipient's current action result flag if present.
  const wasCrit = recipient.result()?.critical === true;

  // build and enqueue the action log entry using the standard execution line.
  const log = new ActionLogBuilder()
    .setupExecution(targetName, casterName, skillId || 0, magnitude, reducedAmount, isHeal, wasCrit)
    .build();

  // submit the built log entry to the manager (assumed present when J.LOG is true).
  $actionLogManager.addLog(log);
};

/**
 * Extends {@link Game_Action.applyGlobal}.<br/>
 * Suppresses common events while J.ABS.EXT.FORMULA.Context.suppressCommonEvents is true.
 */
J.ABS.EXT.FORMULA.Aliased.Game_Action.set("applyGlobal", Game_Action.prototype.applyGlobal);
Game_Action.prototype.applyGlobal = function()
{
  if (J.ABS.EXT.FORMULA.Context.suppressCommonEvents) return;

  // otherwise, perform original logic.
  J.ABS.EXT.FORMULA.Aliased.Game_Action.get("applyGlobal")
    .call(this);
};
//endregion Game_Action