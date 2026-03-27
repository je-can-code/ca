//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 SHIELD] A JABS extension that provides state-based HP shields.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Elementalistics
 * @orderAfter J-HUD-Party
 * @orderAfter J-TextPops
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin provides the ability to create state-based HP shields that can
 * be used to protect actors from damage.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; this plugin is an extension to JABS.
 * - J-Elementalistics; considers all elements for shield typing/bypassing.
 * - J-HUD-Party; the shield gauge will be rendered above the hp gauge.
 * - J-TextPops; shield damage popups will be generated.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Provides the standard in HP shield mechanics for JABS. States own the shield
 * and can be used to protect actors from damage in varying ways. The shields
 * always will have a maximum amount that it can absorb (cap).
 *
 * NOTE ABOUT SHIELD/STATE EXPIRATION:
 * When a shield breaks (as in, reduced to zero), the state will be removed.
 * This means one should probably make shield states unique from other effects
 * unless it is desired that the effects of the state are lost when the shield
 * breaks. Inversely, when a state owning a shield expires, the shield is
 * removed with the state.
 *
 * NOTE ABOUT STACKING:
 * Stacking works about like one might envision: a shield with stacks will be
 * multiple instances of the same shield. When damage is dealt to a battler
 * with a shield state applied having a stack greater than 1, the damage will
 * iterate through each stack until damage is fully absorbed, or until the
 * state's stacks are depleted. The exception to the "stack iteration" is when
 * a state also has the "shieldProtect" tag, in which case only one stack can
 * ever be removed per application of damage (because any overflow will be
 * negated by the protect functionality instead of carried to the next stack).
 * This means you could potentially apply a shield state with something like 10
 * stacks of 1 shield point, and it will effectively mitigate 10 hits-
 * assuming each hit deals at least 1 damage.
 *
 * NOTE ABOUT SLIP DAMAGE:
 * Currently, slip damage (aka damage over time) is not mitigated by shields.
 * It will apply directly to the battler, leaving shields intact.
 * This may change in a future update.
 *
 * ============================================================================
 * SHIELDING:
 * Have you ever wanted to apply some amount of shield points to a state to
 * protect against damage? Well now you can! By applying the appropriate tag
 * on your states, you too can apply shields to your heart's content.
 *
 * NOTE ABOUT FORMULA-BASED TAGS:
 * All formula-based tags are recalculated upon application of the state, and
 * again anytime the state refreshes. When a state is recalculated, the current
 * shield gets replaced with an updated shield, carrying over the previous
 * current amount along with adding it to the new base amount. The cap is
 * simply replaced with the updated value.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shield:[FORMULA]>
 *    Where FORMULA represents a damage-like formula calculating the amount to
 *    absorb. The variables 'a' and 'b' can be used in the formulas like you
 *    would in a damage formula, where 'a' represents the target afflicted
 *    with the shield state, and 'b' represents the RPG_State object.
 *
 * TAG EXAMPLES:
 *  <shield:[100]>
 * A shield to protect against 100 daamge will be supplied when afflicted with
 * the state bearing this tag.
 *
 *  <shield:[(a.atk * 3) + b.stepsToRemove]>
 * A shield to protect against damage based on triple the afflicted's attack
 * parameter as well as the value in the "steps to remove" field on the state.
 *
 * ============================================================================
 * SHIELD CAPS:
 * Have you ever wanted to have a cap on shields that was higher than the
 * initially applied amount? Well now you can! By applying the appropriate tag
 * on your states, you too can have shield caps as high as your heart desires!
 *
 * NOTE ABOUT OMITTING SHIELD CAPS:
 * If the shield cap is omitted from a shield state, then the cap will
 * automatically be set to the initial shield amount. This tag lets you create
 * states that can be reapplied to further increase the shield amount up to a
 * certain point- the cap.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shieldCap:[FORMULA]>
 *    Where FORMULA represents a damage-like formula calculating the cap shield
 *    amount. The variables 'a' and 'b' can be used in the formulas like you
 *    would in a damage formula, where 'a' represents the target afflicted
 *    with the shield state, and 'b' represents the RPG_State object.
 *
 * TAG EXAMPLES:
 *  <shieldCap:[100]>
 * A shield cap of 100 will be applied when afflicted with the state bearing this
 * tag.
 *
 *  <shieldCap:[(a.atk * 3) + b.stepsToRemove]>
 * A shield cap of (target's attack * 3) + (number of steps to remove) will be
 * applied when afflicted with the state bearing this tag.
 *
 * ============================================================================
 * SHIELD PRIORITY:
 * Have you ever wanted to force your shields to be consumed in a particular
 * order? Well now you can! By applying the shield priority tag to the various
 * shield states, you too can have deterministically controlled shield
 * consumption!
 *
 * NOTE ABOUT DUPLICATE PRIORITY:
 * If multiple shields have the same priority, then the timestamp at which
 * they were applied will be deferred to as a tie-breaker for determining
 * which should come first.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shieldPriority:PRIORITY>
 *    Where PRIORITY is an integer that represents the priority of the shield
 *    state. Shield states with higher priority will be consumed first.
 *
 * TAG EXAMPLES:
 *  <shieldPriority:5> (on stateA)
 *  <shieldPriority:10> (on stateB)
 *  <shieldPriority:1> (on stateC)
 * When afflicted with stateA, stateB, and stateC, the shields will be consumed
 * in the order of priority, with stateB consuming first, followed by stateA,
 * and finally stateC (because 10 > 5 > 1).
 *
 * ============================================================================
 * SHIELD PROTECT:
 * Have you ever wanted your shields to protect you from the overflow damage
 * after they break like they do in certain other games you might've played?
 * Well now you can! By applying the shield protect tag to the various shield
 * states, you too can have shields that will protect you from damage that
 * would otherwise overflow and deal damage after a shield is broken.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shieldProtect>
 *    This tag is used to indicate that the shield should protect you from
 *    damage that would otherwise overflow and deal damage after the shield
 *    is broken.
 *
 * TAG EXAMPLES:
 *  <shieldProtect>
 * Let us assume that a battler is afflicted with a shield state with the
 * <shield:[100]> tag as well, meaning they have a flat 100 shield points. If
 * this battler was struck with a blow that dealt 150 damage, normally 100 of
 * it would be soaked up by the shield leaving 50 to overflow back and damage
 * the battler's HP. If that same state also had the protect tag, then that
 * overflow of 50 would instead be nullified entirely.
 *
 * ============================================================================
 * SHIELD TYPE:
 * Have you ever wanted to have a shield that was explicitly designed to
 * protect the bearer from fire damage? Or even fire, ice, and lightning, but
 * nothing else? Well now you can! By applying the appropriate tag on your
 * states, you too can have elemental shields that are explicitly designed to
 * protect certain types of damage.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shieldType:[TYPES...]>
 *    Where TYPES... is a comma-delimited array of numbers that represent the
 *    element ids from your database of the elements that you want this shield
 *    to be typed with.
 *
 * TAG EXAMPLES:
 *  <shieldType:[1,2,3]>
 * A shield that will soak damage if damage is taken that is of elements 1, 2,
 * or 3.
 *
 *  <shieldType:[1]>
 * A shield that will soak damage if damage is taken that is of element 1.
 *
 * ============================================================================
 * SHIELD BYPASS:
 * Have you ever wanted to be able to ignore all those awesome shields that we
 * just setup from all the previous tags? Well now you can! By applying the
 * appropriate tag on your skills, you too can bypass shields as much as you
 * feel the player should.
 *
 * NOTE ABOUT TYPES AND BYPASS INTERSECTIONS:
 * Shield bypassing is expected to go hand-in-hand with shield typing. If a
 * shield has any types that intersect with the types of the skill AND the
 * bypass types also intersect with any of the shield types, then the result
 * is that the shield will be bypassed. That sounds confusing to write, but
 * in practice it'll probably be a lot less complicated since skills typically
 * only have one element associated with them. If you just want a skill that
 * totally bypasses shields, then use the typeless tag.
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <shieldBypass>
 *    This tag will indicate a skill will bypass any and all shields entirely.
 *
 *  <shieldBypass:[TYPES...]>
 *    Where TYPES... is a comma-delimited array of numbers that represent the
 *    element ids from your database of the elements that you want this skill
 *    to bypass shields for.
 *
 * TAG EXAMPLES:
 *  <shieldBypass>
 * This skill will entirely bypass all shields. There are no exceptions.
 *
 *  <shieldBypass:[1,2,3]>
 * This skill will bypass shields for elements with ids 1, 2, and 3.
 *
 * ============================================================================
 * SHIELD BONUS DAMAGE:
 * Have you ever wanted to be able to deal bonus damage to all those pesky
 * shields that the enemy has on them? Well now you can! By applying the
 * appropriate tags to skills, you too can create skills that are shield
 * destroyers!
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <shieldDamage:[FORMULA]>
 *    Where FORMULA represents a damage-like formula calculating the amount of
 *    bonus damage to deal. The variables 'a', 'b', and 'o' can be used in
 *    the formulas like you would in a damage formula, where 'a' represents
 *    the attacker executing the skill, 'b' represents target with the shield,
 *    and 'o' represents the pre-shielded amount of damage.
 *
 * TAG EXAMPLES:
 *  <shieldDamage:[100]>
 *    A skill with this tag will deal a flat 100 bonus damage to shields.
 *
 *  <shieldDamage:[o * 3]>
 *    A skill with this tag will deal triple the original damage to shields.
 *
 *  <shieldDamage:[b.currentShieldValue() / 2]>
 *    A skill with this tag will deal half of the current shield value as bonus
 *    damage to shields.
 *
 *  <shieldDamage:[a.hp + ($gameParty.gold() * 100)]>
 *    A skill with this tag will deal the amount equal to the attacker's
 *    current hp plus 100 times the party's gold.
 *    (a bizarre formula, but demonstrating availability to globals)
 *
 * ============================================================================
 * SHIELD BREAK SKILLS:
 * Have you ever wanted to be able to retaliate with particular skills when
 * your shield breaks? Well now you can! By applying the appropriate tags on
 * various applicable database objects, you too can customize your shield
 * break retaliation.
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
 *  <shieldBreak:[SKILL_IDS...]>
 *    Where SKILL_IDS... is a comma-delimited array of numbers that represent
 *    the ids of the skills that will be executed when any shield breaks.
 *
 * TAG EXAMPLES:
 *  <shieldBreak:[1,2,3]> (on the shield state applied to the battler)
 *    This actor will execute skill 1, 2, and 3 when their shield breaks.
 *
 * <shieldBreak:[1,2,3]> (on the battler)
 * <shieldBreak:[1,4]>   (on the shield state applied to the battler)
 *    This battler will execute skills 1 (once), 2, 3, and 4 when their shield
 *    breaks- the 1 only triggers once even though it shows up twice.
 *
 * ============================================================================
 * There are no plugin parameters/commands for this plugin.
 * They are mostly just states, so work with them as you would any other state.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//region plugin metadata
class JShield_PluginMetadata
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
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
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
    // no-op; no configuration to initialize.
  }
}

//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '3.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '4.5.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT ||= {};

/**
 * The plugin umbrella that governs all extensions related to the parent.
 */
J.ABS.EXT.SHIELD ||= {};

/**
 * The metadata associated with this plugin.
 */
J.ABS.EXT.SHIELD.Metadata = new JShield_PluginMetadata('J-ABS-Shield', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.SHIELD.Aliased = {
  Game_Action: new Map(),
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  JABS_Engine: new Map(),
  JABS_State: new Map(),
  JABS_StateBuilder: new Map(),
  Sprite_ActorValue: new Map(),
  Sprite_Character: new Map(),
  Window_PartyFrame: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.SHIELD.RegExp = {
  /**
   * Represents the shield points derived from a damage formula.
   * 'a' is the attacker, 'b' is the shielded battler.
   */
  ShieldPointsFormula: /<shield:\[([+\-*/ ().\w]+)]>/gi,

  /**
   * Represents the shield cap derived from a damage formula.
   * 'a' is the attacker, 'b' is the shielded battler.
   */
  ShieldCapFormula: /<shieldCap:\[([+\-*/ ().\w]+)]>/gi,

  /**
   * Represents the priority of a shield.
   */
  Priority: /<shieldPriority:[ ]?(\d+)>/i,

  /**
   * Dictates if the shield should prevent overflow damage upon breaking.
   */
  Protect: /<shieldProtect>/i,

  /**
   * Represents the type of shield.
   */
  Type: /<shieldType:[ ]?(\[[\d, ]+])>/gi,

  /**
   * On an action, this means it will bypass either all shields or specific shields.
   */
  Bypass: /<shieldBypass(?::[ ]?(\[[\d, ]+]))?>/gi,

  /**
   * Represents an additional damage formula for shield-only damage from the action.
   * 'a' is the attacker, 'b' is the shielded battler, 'o' is the original damage before mitigation.
   */
  ShieldDamage: /<shieldDamage:\[([+\-*/ ().\w]+)]>/gi,

  /**
   * Represents one or many skills to fire when this state’s shield breaks.
   */
  Break: /<shieldBreak:[ ]?(\[[\d, ]+])>/i,
};
//endregion initialization

//region JABS_Shield
/**
 * Represents a state-owned shield pool for a {@link JABS_State}.
 */
class JABS_Shield
{
  /**
   * Derives a {@link JABS_Shield} from a state id.
   * @param {number} stateId The id of the state we should derive a shield from.
   * @param {Game_Actor|Game_Enemy} target The battler that will have the shield.
   * @param {Game_Actor|Game_Enemy} attacker The battler that is applying the state.
   * @returns {JABS_Shield|null} The shield data, or null if the state is not a shield state.
   */
  static fromStateId(stateId, target, attacker)
  {
    // TODO: implement shield bonuses from target.

    // grab the state we're working with.
    const state = target.state(stateId);

    // grab all the formulas that the
    const pointFormulas = RPGManager.getStringsFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.ShieldPointsFormula);

    // allows access to the attacker and target.
    /* eslint-disable no-unused-vars */
    const a = attacker ?? target;
    const b = target;
    /* eslint-enable no-unused-vars */

    /**
     * A safe reduce function that wears a diaper during evaluation.
     * @param {number} total The current total value.
     * @param {string} formula The formula to evaluate.
     * @returns {number} The new total value.
     */
    const safeReduce = (total, formula) =>
    {
      try
      {
        return total + eval(formula);
      }
      catch (e)
      {
        console.error(`Error evaluating shield formula: ${formula}`, target, attacker, e);
        return total;
      }
    };

    // combine all the point formulas into a single value.
    const totalPoints = pointFormulas
      .reduce(safeReduce, 0);

    // if we have no shield points, then nothing else matters.
    if (totalPoints === 0) return null;

    // grab all the formulas that make up the cap.
    const capFormulas = RPGManager.getStringsFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.ShieldCapFormula);

    // combine all the cap formulas into a single value and add the flat cap points.
    const totalCap = capFormulas
      .reduce(safeReduce, 0);

    // if no cap was specified, then use the total points as the cap by default.
    const normalizedCap = totalCap === 0
      ? totalPoints
      : totalCap;

    // determine the priority, or default to 0.
    const priority = RPGManager.getNumberFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.Priority);

    // see if this shield protects all overflow damage when breaking.
    const isProtect = RPGManager.checkForBooleanFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.Protect) === true;

    // epoch timestamp in milliseconds for when this shield was applied.
    const appliedAt = Date.now();

    // grab the shield types from the state.
    // NOTE: if no types are present, then "bypass" only works if its also a typeless bypass.
    const shieldTypes = RPGManager.getArrayFromNotesByRegex(state, J.ABS.EXT.SHIELD.RegExp.Type, true);

    // derive the new state!
    return new JABS_Shield(totalPoints, normalizedCap, priority, shieldTypes, isProtect, appliedAt);
  }

  //region properties
  /**
   * The maximum amount of shield points this shield can hold.
   * @type {number}
   */
  #cap = 0;

  /**
   * The original amount of shield points when this state was instantiated.
   * @type {number}
   */
  #originalAmount = 0;

  /**
   * The current amount of shield points remaining.
   * @type {number}
   */
  #current = 0;

  /**
   * The priority of this shield.
   * @type {number}
   */
  #priority = 0;

  /**
   * The element types this shield protects against.
   * @type {number[]}
   */
  #types = [];

  /**
   * Whether or not this shield negates overflow when broken.
   * @type {boolean}
   */
  #protect = false;

  /**
   * The epoch timestamp in milliseconds for when this shield was applied.
   * @type {number}
   */
  #appliedAt = 0;

  //endregion properties

  /**
   * Constructor.
   * @param {number} shields The amount of shields provided by this state initially.
   * @param {number} cap The accumulation cap for add-and-clamp refresh behavior (often equals `max`).
   * @param {number} priority A numeric priority; higher values resolve earlier.
   * @param {number[]} shieldTypes The element types this shield protects against.
   * @param {boolean} protect When true, breaking this shield nullifies the remainder of the hit.
   * @param {number} appliedAt The frame index when this shield was created (for FIFO tiebreakers).
   */
  constructor(shields, cap, priority, shieldTypes, protect, appliedAt)
  {
    this.#cap = cap;
    this.#originalAmount = shields;
    this.#current = shields;
    this.#priority = priority;
    this.#types = shieldTypes;
    this.#protect = protect === true;
    this.#appliedAt = appliedAt;
  }

  /**
   * Gets the accumulation cap used when adding via refresh (non-stackable add-and-clamp).
   * @returns {number} The accumulation cap.
   */
  getCap()
  {
    // return the add-and-clamp cap value.
    return this.#cap;
  }

  /**
   * Gets the current amount of shield points remaining.
   * @returns {number} The current shield points.
   */
  getCurrent()
  {
    // return the current remaining shield points.
    return this.#current;
  }

  /**
   * Sets the current shield points.
   * The amount set can never be more than the shield cap.
   * @param {number} value The desired new current value.
   */
  setCurrent(value)
  {
    // clamp the value to the valid range.
    this.#current = Math.round(Math.max(0, Math.min(this.#cap, value)));
  }

  /**
   * Damages the shield by a given amount and returns the overflow, if any.
   * @param {number} amount The amount of damage to be deducted.
   * @returns {number} The amount of damage that overflowed the shield.
   */
  applyShieldDamage(amount)
  {
    // if the damage amount is greater than the current shield, we have overflow.
    const shieldAfterDamage = this.#current - amount;

    // update the shield value.
    this.#current = Math.round(Math.max(0, shieldAfterDamage));

    // if we have damage left, then the remainder would be overflow.
    if (shieldAfterDamage < 0)
    {
      // return the overflow amount.
      return Math.round(Math.abs(shieldAfterDamage));
    }

    // we have no overflow.
    return 0;
  }

  /**
   * Gets this shield's resolution priority; higher resolves earlier.
   * @returns {number} The priority value.
   */
  getPriority()
  {
    // return the priority of this shield.
    return this.#priority;
  }

  /**
   * Gets the element types this shield protects against.
   * @returns {number[]} The elementIds for this shield.
   */
  getShieldTypes()
  {
    return this.#types;
  }

  /**
   * Gets whether this shield has protected-break semantics.
   * @returns {boolean} True if breaking this shield nullifies hit remainder; otherwise false.
   */
  isProtected()
  {
    // return whether or not this shield is protected.
    return this.#protect === true;
  }

  /**
   * Gets the frame index when this shield was first applied.
   * @returns {number} The application frame index used for FIFO ordering.
   */
  getAppliedAt()
  {
    // return the applied-at frame.
    return this.#appliedAt;
  }

  /**
   * Determines whether this shield is currently depleted.
   * @returns {boolean} True if `current` is zero; otherwise false.
   */
  isBroken()
  {
    // return whether the shield is at zero.
    return this.#current === 0;
  }

  /**
   * Refreshes the shields current value to whatever its original application amount was.
   */
  refresh()
  {
    // project the new current by adding a full pool amount.
    const projected = this.#current + this.#originalAmount;

    // clamp the projected value to the add-and-clamp cap.
    this.#current = Math.max(0, Math.min(this.#cap, projected));
  }
}

//endregion JABS_Shield

//region JABS_State

/**
 * The shield for this state.
 * @type {JABS_Shield|null}
 */
Object.defineProperty(
  JABS_State.prototype, 'shield',
  {
    get()
    {
      // Return null if the backing field hasn’t been set yet.
      if (this._shield === undefined)
      {
        return null;
      }

      // Return the current shield value.
      return this._shield;
    },
    set(v)
    {
      // Assign the shield backing field.
      this._shield = v;
    },
    enumerable: true,
    configurable: true,
  }
);

/**
 * Extends {@link #removeFromBattler}.<br/>
 * Also removes the shield when the state expires.
 */
J.ABS.EXT.SHIELD.Aliased.JABS_State.set('removeFromBattler', JABS_State.prototype.removeFromBattler);
JABS_State.prototype.removeFromBattler = function()
{
  // perform original logic.
  J.ABS.EXT.SHIELD.Aliased.JABS_State.get('removeFromBattler')
    .call(this);

  // also remove the shield.
  this.removeShield();
};

/**
 * An event hook fired when a shield is broken.
 */
JABS_State.prototype.onShieldBreak = function()
{
  // trigger the battler's shield break hook.
  this.battler.onShieldBreak();

  // force a decrement of stacks.
  this.decrementStacks(1);

  // check if we ran out of stacks.
  if (this.stackCount === 0)
  {
    // remove the state.
    this.removeFromBattler();

    // no more processing.
    return;
  }

  // we still have stacks, so refresh the shield.
  this.refreshShield();
};

/**
 * Zeroes out the shield for this state.
 * This does not count as "breaking" the shield.
 */
JABS_State.prototype.removeShield = function()
{
  // validate we have a shield to remove.
  if (this.shield === null || this.shield === undefined) return;

  // zero out the shield.
  this.shield.setCurrent(0);
};

/**
 * Recalculates the shield based on the current state of the battler.
 */
JABS_State.prototype.recalculateShield = function()
{
  // recalculates the shield based on the current state.
  const updatedShield = JABS_Shield.fromStateId(this.stateId, this.battler, this.source);

  // validate we have a shield to update.
  if (updatedShield === null || updatedShield === undefined) return;

  // sometimes, somehow, the shield is null at this stage.
  const current = this.shield
    ? this.shield.getCurrent()
    : 0;

  // update the updated shield with the current shield's current value.
  updatedShield.setCurrent(current);

  // updates the shield.
  this.shield = updatedShield;
};

/**
 * Refreshes the shield back to its original amount.
 */
JABS_State.prototype.refreshShield = function()
{
  // check if we can refresh the shield.
  if (this.canRefreshShield() === false) return;

  // pass-through to refresh the shield back to its original amount.
  this.shield.refresh();
};

/**
 * Determines whether or not this state can refresh its shield.
 * @returns {boolean} True if the shield can be refreshed, false otherwise.
 */
JABS_State.prototype.canRefreshShield = function()
{
  // if we don't have a shield, obviously don't try to refresh it.
  if (this.shield === null || this.shield === undefined) return false;

  // refresh that shield!
  return true;
};
//endregion JABS_State

//region JABS_StateBuilder

/**
 * The shield for this state.
 * @type {JABS_Shield|null}
 */
Object.defineProperty(
  JABS_StateBuilder.prototype, 'shield',
  {
    get()
    {
      // Return null if the backing field hasn’t been set yet.
      if (this._shield === undefined)
      {
        return null;
      }

      // Return the current shield value.
      return this._shield;
    },
    set(v)
    {
      // Assign the shield backing field.
      this._shield = v;
    },
    enumerable: true,
    configurable: true,
  }
);

J.ABS.EXT.SHIELD.Aliased.JABS_StateBuilder.set('build', JABS_StateBuilder.prototype.build);
JABS_StateBuilder.prototype.build = function()
{
  // perform original logic.
  const originalState = J.ABS.EXT.SHIELD.Aliased.JABS_StateBuilder.get('build')
    .call(this);

  // add the shield.
  originalState.shield = this.shield;

  // return the state.
  return originalState;
};

/**
 * Attaches a prebuilt {@link JABS_Shield} to the state after construction.
 * @param {JABS_Shield} shield The shield model to assign.
 * @returns {JABS_StateBuilder} This builder for chaining.
 */
JABS_StateBuilder.prototype.setShield = function(shield)
{
  // assign the shield to be applied post-construction.
  this.shield = shield;

  // return this for chaining.
  return this;
};
//endregion JABS_StateBuilder

//region Map_TextPop

if (J.POPUPS)
{
  /**
   * The popup type of "shield", for when a shield is damaged.
   */
  Map_TextPop.Types.Shield = 'shield';
}

//endregion Map_TextPop

//region RPG_Skill
Object.defineProperties(RPG_UsableItem.prototype, {
  /**
   * Gets the elementIds that this skill bypasses.
   *
   * Shapes supported:
   * - <shield-bypass> → universal bypass (handled by {@link isShieldBypassUniversal}); this getter returns null.
   * - <shield-bypass: [1, 5, 7]> → typed bypass list; returns an array of element ids.
   *
   * Notes:
   * - Returns null when no tag is present, or when the tag is parameterless (universal form).
   * - The parameterized list must contain only element ids (numbers); names are not supported for this tag.
   *
   * @type {number[]|null}
   */
  shieldBypassElements: {
    get: function()
    {
      // if there is no bypass tag at all, then nothing to parse.
      if (this.hasShieldBypass === false)
      {
        return null;
      }

      // reset the index.
      J.ABS.EXT.SHIELD.RegExp.Bypass.lastIndex = 0;

      // attempt to match the extension-provided bypass regex.
      const match = J.ABS.EXT.SHIELD.RegExp.Bypass.exec(this.note);

      // if somehow we didn't match (shouldn't happen), treat as no list.
      if (!match)
      {
        return null;
      }

      // when the capture group is missing/empty, this is the universal (parameterless) form.
      if (!match[1] || String(match[1])
        .trim().length === 0)
      {
        // universal bypass is handled by a separate boolean; return null here.
        return null;
      }

      // otherwise, parse the numeric list via RPGManager using the same regex.
      const list = RPGManager.getArrayFromNotesByRegex(this, J.ABS.EXT.SHIELD.RegExp.Bypass, true);

      // return the parsed numeric list.
      return list;
    },
    configurable: true
  },

  /**
   * Whether this skill/item declares a shield bypass of any kind.
   * Supports both parameterless and parameterized forms.
   * @type {boolean}
   */
  hasShieldBypass: {
    get: function()
    {
      // reset the index.
      J.ABS.EXT.SHIELD.RegExp.Bypass.lastIndex = 0;

      // simple presence check against the canonical regex.
      return J.ABS.EXT.SHIELD.RegExp.Bypass.test(this.note);
    },
    configurable: true
  },

  /**
   * True when the skill/item has the parameterless universal bypass form: <shield-bypass>
   * (no parameters after the colon). This means bypass ALL shields regardless of typing.
   * @type {boolean}
   */
  isShieldBypassUniversal: {
    get: function()
    {
      // if the tag doesn't exist at all, then it cannot be universal.
      if (this.hasShieldBypass === false)
      {
        return false;
      }

      // reset the index.
      J.ABS.EXT.SHIELD.RegExp.Bypass.lastIndex = 0;

      // exec to inspect the capture; universal form will have no usable group.
      const match = J.ABS.EXT.SHIELD.RegExp.Bypass.exec(this.note);

      // if present and no parameter payload, then it's universal.
      if (match && (!match[1] || String(match[1])
        .trim().length === 0))
      {
        return true;
      }

      // otherwise, it's the parameterized typed form.
      return false;
    },
    configurable: true
  },

  /**
   * A collection of damage formulas that contribute bonus SHIELD-ONLY damage.
   * Multiple tags are allowed; the results are summed when applying shields.
   * Ex: <shield-bonus:[a.atk*0.2]> or <shield-bonus:[p*0.5]> (where p is base HP damage).
   * @type {string[]}
   */
  shieldBonusFormulas: {
    get: function()
    {
      // reset the index.
      J.ABS.EXT.SHIELD.RegExp.ShieldDamage.lastIndex = 0;

      // Retrieve all matching formula strings from the note.
      const formulas = RPGManager.getStringsFromNoteByRegex(this, J.ABS.EXT.SHIELD.RegExp.ShieldDamage);

      // If no tags present, return an empty array for simpler consumers.
      return Array.isArray(formulas)
        ? formulas
        : [];
    },
    configurable: true
  },
});
//endregion RPG_Skill

//region ColorManager
/**
 * Gets the "shield gauge" color gradient 1 as hex.
 * @returns {string}
 */
ColorManager.shieldGauge1 = function()
{
  return this.textColor(7);
};

/**
 * Gets the "shield gauge" color gradient 2 as hex.
 * @returns {string}
 */
ColorManager.shieldGauge2 = function()
{
  return this.textColor(8);
};

//endregion ColorManager

//region JABS_Engine
/**
 * Extends {@link #refreshJabsState}.<br/>
 * Also refreshes the shield when a shield state is refreshed.
 */
J.ABS.EXT.SHIELD.Aliased.JABS_Engine.set('refreshJabsState', JABS_Engine.prototype.refreshJabsState);
JABS_Engine.prototype.refreshJabsState = function(jabsState, newJabsState)
{
  // recalculate the shield.
  jabsState.recalculateShield();

  // refresh the shield.
  jabsState.refreshShield();

  // perform original logic.
  J.ABS.EXT.SHIELD.Aliased.JABS_Engine.get('refreshJabsState')
    .call(this, jabsState, newJabsState);
};

/**
 * Extends {@link #extendJabsState}.<br/>
 * Also refreshes the shield when a shield state is refreshed.
 */
J.ABS.EXT.SHIELD.Aliased.JABS_Engine.set('extendJabsState', JABS_Engine.prototype.extendJabsState);
JABS_Engine.prototype.extendJabsState = function(jabsState, newJabsState)
{
  // recalculate the shield.
  jabsState.recalculateShield();

  // refresh the shield.
  jabsState.refreshShield();

  // perform original logic.
  J.ABS.EXT.SHIELD.Aliased.JABS_Engine.get('extendJabsState')
    .call(this, jabsState, newJabsState);
};

//endregion JABS_Engine

//region TextPopBuilder
if (J.POPUPS)
{
  /**
   * Add some convenient defaults for configuring a shield damage popup.
   * @returns {TextPopBuilder}
   */
  TextPopBuilder.prototype.isShieldDamage = function()
  {
    // set the popup type to be experience.
    this.setPopupType(Map_TextPop.Types.Shield);

    // randomize the variance a bit.
    this.setXVariance(0);
    this.setYVariance(64);

    // set the text color to be metallic grey.
    this.setTextColorIndex(8);

    // set the icon index to a shield icon.
    this.setIconIndex(448);

    // return this for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuring a shield break popup.
   * @returns {TextPopBuilder}
   */
  TextPopBuilder.prototype.isShieldBreak = function()
  {
    // set the popup type to be experience.
    this.setPopupType(Map_TextPop.Types.Shield);

    // randomize the variance a bit.
    this.setXVariance(20);
    this.setYVariance(64);

    // set the text color to be metallic grey.
    this.setTextColorIndex(7);

    // set the icon index to an X icon.
    this.setIconIndex(448);

    // return this for fluent chaining.
    return this;
  };
}
//endregion TextPopBuilder

//region Game_Battler
/**
 * Extends {@link #createJabsState}.<br/>
 * Also includes shield data.
 * @param {Game_Battler} target the battler being affected by the state.
 * @param {number} stateId The id of the state being applied.
 * @param {number} iconIndex The icon index of the state being applied.
 * @param {number} totalDuration The total duration in frames of the state being applied.
 * @param {number} stacks The number of stacks of the state being applied.
 * @param {Game_Battler} attacker The battler applying the state.
 * @returns {JABS_StateBuilder} The builder with all the parameters of the state being applied.
 */
J.ABS.EXT.SHIELD.Aliased.Game_Battler.set('createJabsState', Game_Battler.prototype.createJabsState);
Game_Battler.prototype.createJabsState = function(target, stateId, iconIndex, totalDuration, stacks, attacker)
{
  // perform original logic.
  const builder = J.ABS.EXT.SHIELD.Aliased.Game_Battler.get('createJabsState')
    .call(this, target, stateId, iconIndex, totalDuration, stacks, attacker);

  // determine the shield.
  const shield = JABS_Shield.fromStateId(stateId, target);

  // set the shield.
  builder.setShield(shield);

  // return the builder.
  return builder;
};

/**
 * Gets the array of states containing non-broken shields and their values, sorted in priority order.
 * @returns {JABS_State[]}
 */
Game_Battler.prototype.getShieldStates = function()
{
  // grab all of this battler's states.
  const jabsStates = $jabsEngine.getJabsStatesByUuid(this.getUuid());

  // convert them to a proper array.
  const states = Array.from(jabsStates.values());

  return states
    .filter(state =>
    {
      // require a shield model to be present.
      if (!state.shield)
      {
        return false;
      }

      // require the shield to not be broken.
      if (state.shield.isBroken())
      {
        return false;
      }

      // include this state in the results.
      return true;
    })
    .sort((a, b) =>
    {
      // destructure the shields for access.
      const aShield = a.shield;
      const bShield = b.shield;

      // compare priorities numerically, higher first.
      const aPri = aShield.getPriority() || 0;
      const bPri = bShield.getPriority() || 0;
      if (aPri !== bPri)
      {
        // dESC.
        return bPri - aPri;
      }

      // tie-breaker: FIFO by appliedAt (earlier first).
      // aSC.
      return aShield.getAppliedAt() - bShield.getAppliedAt();
    });
};

/**
 * Gets the highest priority shield state currently applied to this battler, or null if there are no shields.
 * @returns {JABS_State|null}
 */
Game_Battler.prototype.currentShieldState = function()
{
  // grab all the shield states currently applied.
  const shieldStates = this.getShieldStates();

  // if there are no shield states, then there are no shields.
  if (shieldStates.length === 0) return null;

  // return the top priority shield's value.
  return shieldStates.at(0);
};

/**
 * Gets the highest priority shield value currently applied to this battler, or 0 if there are no shields.
 * @returns {number}
 */
Game_Battler.prototype.currentShieldValue = function()
{
  // grab all the shield states currently applied.
  const shieldState = this.currentShieldState();

  // if there are no shield states, then there are no shields.
  if (shieldState === null) return 0;

  // return the shield's value.
  return shieldState
    .shield
    .getCurrent();
};

/**
 * Gets the highest priority shield cap currently applied to this battler, or 0 if there are no shields.
 * @returns {number}
 */
Game_Battler.prototype.currentShieldCap = function()
{
  // grab all the shield states currently applied.
  const shieldState = this.currentShieldState();

  // if there are no shield states, then there are no shields.
  if (shieldState === null) return 0;

  // return the shield's value.
  return shieldState
    .shield
    .getCap();
};

/**
 * Gets the highest priority shield stacks currently applied to this battler, or 0 if there are no shields.
 * @returns {number}
 */
Game_Battler.prototype.currentShieldStacks = function()
{
  // grab all the shield states currently applied.
  const shieldState = this.currentShieldState();

  // if there are no shield states, then there are no shields.
  if (shieldState === null) return 0;

  // return the number of stacks on this shield state.
  return shieldState.stackCount;
};

/**
 * An event hook fired when a shield is broken.
 */
Game_Battler.prototype.onShieldBreak = function()
{
  // Resolve the bearer’s JABS battler.
  const caster = JABS_AiManager.getBattlerByUuid(this.getUuid());

  // check if we have a valid caster.
  if (!caster) return;

  // identify all the sources from which shield break skills can be pulled from.
  const sources = this.shieldBreakSources().filter(source => !!source);

  /**
   * A reducer function to grab all the shield break skills.
   * @param {number[]} accumulator The accumulator of skill ids.
   * @param {RPG_Base} source The source from which to pull shield break skills.
   */
  const reducer = (accumulator, source) =>
  {
    // grab all the skill ids.
    const skillIds = RPGManager.getArrayFromNotesByRegex(source, J.ABS.EXT.SHIELD.RegExp.Break, true);

    // concat them onto the accumulation.
    return accumulator.concat(...skillIds);
  };

  // grab all the shield break skills.
  const breakSkillIds = sources.reduce(reducer, []);

  // if no skillIds were found, then we can skip processing.
  if (breakSkillIds.length === 0) return;

  // trigger all skills in succession.
  breakSkillIds.forEach(skillId => $jabsEngine.forceMapAction(caster, skillId, true));
};

/**
 * Gets all the sources from which shield break skills can be pulled from.
 * @returns {[RPG_Actor|RPG_Enemy|RPG_State]}
 */
Game_Battler.prototype.shieldBreakSources = function()
{
  return [
    this.databaseData(), ...this.states(),
  ];
};
//endregion Game_Battler

//region Game_Action
/**
 * Extends {@link #executeDamage}.<br/>
 * Considers shields when executing damage.
 */
J.ABS.EXT.SHIELD.Aliased.Game_Action.set('executeDamage', Game_Action.prototype.executeDamage);
Game_Action.prototype.executeDamage = function(target, value)
{
  // reduce damage by shields where applicable.
  const updatedValue = this.applyShields(target, value);

  // perform original logic.
  J.ABS.EXT.SHIELD.Aliased.Game_Action.get('executeDamage')
    .call(this, target, updatedValue);
};

/**
 * Potentially applies shields to the damage value.
 * @param {Game_Actor|Game_Enemy} target The target of the action.
 * @param {number} value The damage value to be applied.
 * @returns {number} The updated damage value after applying shields.
 */
Game_Action.prototype.applyShields = function(target, value)
{
  // don't bother with shield processing if there is no damage.
  if (value === 0) return value;

  // grab the actionable data.
  const skillOrItem = this.item();

  // valid damage types are HP Damage and HP Drain.
  const validDamageTypes = [ 1, 5 ];

  // if the damage type is not valid, then we can skip shield processing.
  if (validDamageTypes.includes(skillOrItem.damage.type) === false) return value;

  // grab the currently active shields.
  const shieldStates = target.getShieldStates();

  // if there are no shields, then we can skip shield processing.
  if (shieldStates.length === 0) return value;

  // declare a modifiable damage value for shield processing.
  let updatedValue = value;

  // iterate over the shields and apply them to the damage value.
  for (const shieldState of shieldStates)
  {
    // update the value and mitigate damage.
    updatedValue = this.applyShield(shieldState, target, updatedValue);

    // if we have no damage left, then we can stop processing shields.
    if (updatedValue === 0) break;
  }

  // return the updated value after processing shields.
  return updatedValue;
};

/**
 * Applies the shield to the damage value against the target.
 * Also applies any shield-only bonus damage from this action.
 * @param {JABS_State} shieldState The state bearing the shield.
 * @param {Game_Actor|Game_Enemy} target The target of the action.
 * @param {number} value The damage value to be applied.
 * @returns {number} The leftover damage value after applying the shield.
 */
Game_Action.prototype.applyShield = function(shieldState, target, value)
{
  // validate we have a shield to work with.
  const { shield } = shieldState;

  // if there is no shield, then there is nothing to apply.
  if (!shield)
  {
    return value;
  }

  // resolve the elements for this action for relevance checks.
  const skillOrItem = this.item();
  const actionElements = this.getActionElementsForShieldChecks(this.subject(), skillOrItem);

  // if the shield is typed but does not match the action, the shield is not relevant to this hit.
  if (this.isShieldRelevantToAction(shield, actionElements) === false)
  {
    return value;
  }

  // check if we should bypass shields for this hit (typed or universal).
  if (this.shouldBypassShield(shield))
  {
    return value;
  }

  // compute shield-only damage bonus for this target.
  // this bonus can only be absorbed by shields; it will never spill into HP.
  const pendingBonusInitial = this.calculateShieldBonusDamage(target, value);

  // delegate the absorption into a helper that mutates the pools and handles break logic.
  const postAbsorption = this.absorbDamageIntoShield(shieldState, target, value, pendingBonusInitial);

  // return whatever HP damage remains after shield absorption.
  return postAbsorption;
};

/**
 * Determines whether or not a shield should be bypassed by this action.
 * @param {JABS_Shield} shield The shield to check.
 * @returns {boolean} True if the shield should be bypassed, false otherwise.
 */
Game_Action.prototype.shouldBypassShield = function(shield)
{
  // no shield means there is nothing to bypass.
  if (!shield)
  {
    return false;
  }

  // grab the actionable data.
  const skillOrItem = this.item();

  // you cannot bypass shields without any bypass tag.
  if (skillOrItem.hasShieldBypass === false)
  {
    return false;
  }

  // parameterless form bypasses ALL shields regardless of typing.
  if (skillOrItem.isShieldBypassUniversal === true)
  {
    return true;
  }

  // read the shield's typed elements and the typed bypass elements from the action.
  const shieldElements = shield.getShieldTypes();
  const bypassElements = skillOrItem.shieldBypassElements;

  // typing needs to be present on both sides of the bypass, or it won't bypass.
  if (!bypassElements || bypassElements.length === 0 || shieldElements.length === 0)
  {
    return false;
  }

  // typed bypass applies when the action's bypass list targets this shield's types.
  const bypassesThisShield = ArrayHelper.hasAnyIntersection(shieldElements, bypassElements);
  if (bypassesThisShield === false)
  {
    return false;
  }

  // typed bypass conditions satisfied: bypass this shield for this hit.
  return true;
};

/**
 * Calculates the SHIELD-ONLY bonus damage for this action against a specific target.
 * The result may be absorbed by shields but can never spill into HP damage.
 *
 * Variables available to formulas:
 * - a: the subject/caster of this action.
 * - b: the target receiving this action.
 * - o: the HP damage value for this hit (pre-shield processing).
 *
 * @param {Game_Actor|Game_Enemy} target The target of the action.
 * @param {number} baseDamage The base HP damage value (pre-shield).
 * @returns {number} The total non-negative, rounded shield-only bonus value.
 */
Game_Action.prototype.calculateShieldBonusDamage = function(target, baseDamage)
{
  // Grab the action data.
  const skillOrItem = this.item();

  // Pull all shield-bonus formulas.
  const formulas = skillOrItem.shieldBonusFormulas;

  // If no formulas are present, then there is no bonus.
  if (formulas.length === 0)
  {
    return 0;
  }

  // Provide common variables for evaluation.
  /* eslint-disable no-unused-vars */
  const a = this.subject();
  const b = target;
  const o = baseDamage;
  /* eslint-enable no-unused-vars */

  // Sum the evaluated formulas (clamped to non-negative, rounded).
  const sum = formulas.reduce((total, f) =>
  {
    // Evaluate the formula in the action context.
    const result = eval(f);

    // Coerce to number and clamp to non-negative.
    const n = Number(result) || 0;

    // Accumulate the rounded non-negative value.
    return total + Math.max(0, Math.round(n));
  }, 0);

  // Return the computed sum.
  return sum;
};

/**
 * Absorbs as much of the provided damage as possible into the provided shield state.
 * This will also consume any shield-only bonus damage, display pops, and handle break logic.
 * If the shield is protected, the remainder of the hit is nullified.
 *
 * @param {JABS_State} shieldState The state bearing the shield to absorb damage.
 * @param {Game_Actor|Game_Enemy} target The target receiving the action.
 * @param {number} overflowDamage The current remaining HP damage to be applied to the target.
 * @param {number} bonusDamage The current remaining SHIELD-ONLY bonus damage available.
 * @returns {number} The leftover HP damage after absorption (0 if shield protected and nullified).
 */
Game_Action.prototype.absorbDamageIntoShield = function(shieldState, target, overflowDamage, bonusDamage)
{
  // assign locally.
  let remainingDamage = overflowDamage;
  let pendingBonusDamage = bonusDamage;

  // continue absorbing while there is remaining HP damage OR pending shield-bonus,
  // and this state still has a shield pool (handle stacked state refresh).
  while ((remainingDamage > 0 || pendingBonusDamage > 0))
  {
    // re-resolve the shield reference (it may have been refreshed on a prior break in this loop).
    const { shield: updatedShield } = shieldState;

    // if there is no shield to absorb, stop processing this state.
    if (!updatedShield || updatedShield.getCurrent() <= 0)
    {
      break;
    }

    // how much could be absorbed this iteration when considering the bonus?
    const before = updatedShield.getCurrent();

    // the maximum absorb this tick is limited by the pool.
    const maxAbsorbThisTick = before;

    // our available absorb power combines real damage + pendingBonus.
    const absorbPower = remainingDamage + pendingBonusDamage;

    // determine absorption this iteration.
    const absorbed = Math.min(absorbPower, maxAbsorbThisTick);

    // split the absorption between real damage and bonus.
    const useFromReal = Math.min(remainingDamage, absorbed);
    const useFromBonus = absorbed - useFromReal;

    // deduct from the shield first.
    updatedShield.setCurrent(before - absorbed);

    // reduce the pools accordingly.
    remainingDamage -= useFromReal;
    pendingBonusDamage -= useFromBonus;

    // show a shield damage popup for the amount absorbed (real + bonus).
    if (absorbed > 0)
    {
      this.generateShieldDamagePop(target, absorbed);
    }

    // determine whether this shield broke on this application.
    const brokeThisHit = (before > 0 && updatedShield.getCurrent() === 0);

    // if the shield broke on this hit, handle the break lifecycle.
    if (brokeThisHit)
    {
      // show a popup indicating the shield broke.
      this.generateShieldBreakPop(target);

      // consume a stack, refill if stacks remain, or remove the state if none remain.
      shieldState.onShieldBreak();

      // if this shield is protected, the remainder of this hit is nullified.
      if (updatedShield.isProtected())
      {
        // stop processing entirely for this hit.
        return 0;
      }

      // loop again: if stacks remain, the state refilled and we keep absorbing.
      continue;
    }

    // if the pool did not break and we still have either remaining HP damage or pending bonus,
    // the next shield state (outer loop) will handle it; break out for this state.
    break;
  }

  // return whatever HP damage remains after rolling through this state's stacks.
  // note: pendingBonus never affects returned HP damage.
  return remainingDamage;
};

/**
 * Resolves the element ids that should be considered for shield relevance checks.
 * Falls back to the skill/item's element, expands via J.ELEM when present,
 * or uses the subject's normal attack elements when the element id is -1.
 * @param {Game_Battler} subject The acting battler.
 * @param {RPG_UsableItem} skillOrItem The action being executed.
 * @returns {number[]} The collection of element ids for this action.
 */
Game_Action.prototype.getActionElementsForShieldChecks = function(subject, skillOrItem)
{
  // start with the database-declared element id.
  const declaredId = skillOrItem.damage.elementId;

  // if using the elementalistics plugin, gather all applicable elements.
  if (J.ELEM)
  {
    // gather all elements applicable for this action from the subject.
    return [ ...this.getApplicableElements(subject) ];
  }

  // if the element is "normal attack", use the subject's attack elements.
  if (declaredId === -1)
  {
    // include all the subject's normal attack elements.
    return [ ...subject.attackElements() ];
  }

  // otherwise just use the declared element id.
  return [ declaredId ];
};

/**
 * Determines whether or not the provided shield is relevant to the action's elements.
 * Untyped shields are always relevant. Typed shields must intersect with the action's elements.
 * @param {JABS_Shield} shield The shield being checked for relevance.
 * @param {number[]} actionElements The elements associated with the action.
 * @returns {boolean} True if the shield is relevant to this action, false otherwise.
 */
Game_Action.prototype.isShieldRelevantToAction = function(shield, actionElements)
{
  // read the shield's typed elements.
  const shieldElements = shield.getShieldTypes();

  // untyped shields are always relevant.
  if (shieldElements.length === 0)
  {
    return true;
  }

  // typed shields are only relevant if the action elements overlap the shield types.
  const matches = ArrayHelper.hasAnyIntersection(actionElements, shieldElements);
  if (matches === false)
  {
    return false;
  }

  // the shield is relevant to this action.
  return true;
};

/**
 * Generates a damage pop showing how much damage was mitigated by shields.
 * @param {Game_Actor|Game_Enemy} target The battler doing the mitigating.
 * @param {number} value The amount of damage mitigated.
 */
Game_Action.prototype.generateShieldDamagePop = function(target, value)
{
  // if we are not using popups, then don't do this.
  if (!J.POPUPS) return;

  // grab the character on the field.
  const character = JABS_AiManager.getBattlerByUuid(target.getUuid())
    .getCharacter();

  // build the popup.
  const textPop = new TextPopBuilder(`  -${Math.round(value)}`)
    .isShieldDamage()
    .build();

  // add the popup to the character.
  character.addTextPop(textPop);
  character.requestTextPop();
};

/**
 * Generates a damage pop indicating a shield broke.
 * @param {Game_Actor|Game_Enemy} target The battler with the shield breaking.
 */
Game_Action.prototype.generateShieldBreakPop = function(target)
{
  // if we are not using popups, then don't do this.
  if (!J.POPUPS) return;

  // grab the character on the field.
  const character = JABS_AiManager.getBattlerByUuid(target.getUuid())
    .getCharacter();

  // build the popup.
  const textPop = new TextPopBuilder(`B R E A K`)
    .isShieldBreak()
    .build();

  // add the popup to the character.
  character.addTextPop(textPop);
  character.requestTextPop();
};
//endregion Game_Action

//region Game_Actor
/**
 * Extends {@link #shieldBreakSources}.<br/>
 * Also adds actor-specific shield break skill sources.
 */
J.ABS.EXT.SHIELD.Aliased.Game_Actor.set('shieldBreakSources', Game_Actor.prototype.shieldBreakSources);
Game_Actor.prototype.shieldBreakSources = function()
{
  // get the original sources.
  const originalSources = J.ABS.EXT.SHIELD.Aliased.Game_Actor.get('shieldBreakSources')
    .call(this);

  // return all sources for shield break skills.
  return [
    // start with the original sources.
    ...originalSources,

    // the actor's class is also considered.
    this.class(),

    // all equips on the actor are also considered.
    ...this.equips(),
  ];
};
//endregion Game_Actor

//region Sprite_ActorValue
/**
 * Extends {@link #initMembers}.<br/>
 * Also initializes the shield value.
 */
J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.set('initMembers', Sprite_ActorValue.prototype.initMembers);
Sprite_ActorValue.prototype.initMembers = function(actor, parameter, fontSizeMod)
{
  // perform original logic.
  J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.get('initMembers')
    .call(this, actor, parameter, fontSizeMod);

  /**
   * The last tracked shield value.
   * @type {string}
   */
  this._j._last._shields = this.makeShieldValue();
};

/**
 * A factory method to create the shield value string.
 * @param {Game_Actor} actor The actor to generate the shield value for.
 * @returns {string} The shield value as a string 'current / (total)'.
 */
Sprite_ActorValue.prototype.makeShieldValue = function(actor)
{
  // if there is no actor for some reason, return an empty string.
  if (!actor) return String.empty;

  // grab the current shield value.
  const currentShields = actor.currentShieldValue();

  // if there are no shields, return an empty string.
  if (currentShields === 0) return String.empty;

  // return the shield value.
  let shieldLabel = `(${Math.round(currentShields)})`;

  // check if there are multiple stacks on the shield.
  if (actor.currentShieldStacks() > 1)
  {
    // append the stack count.
    shieldLabel += `${actor.currentShieldStacks()}x🛡`
  }

  // return the shield value.
  return shieldLabel;
};

/**
 * Gets the last tracked shield value.
 * @returns {string}
 */
Sprite_ActorValue.prototype.getLastShieldValue = function()
{
  return this._j._last._shields;
};

/**
 * Sets the last tracked shield value.
 * @param {string} value The shield value as a string 'current / (total)'.
 */
Sprite_ActorValue.prototype.setLastShieldValue = function(value)
{
  this._j._last._shields = value;
};

/**
 * Extends {@link #hasParameterChanged}.<br/>
 * Also considers the shield values for change.
 */
J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.set('hasParameterChanged', Sprite_ActorValue.prototype.hasParameterChanged);
Sprite_ActorValue.prototype.hasParameterChanged = function()
{
  // perform original logic.
  const originalChange = J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.get('hasParameterChanged')
    .call(this);

  // if something else changed, then return true.
  if (originalChange === true) return true;

  // only consider if this is a shield gauge.
  if (this.getParameter() === Window_PartyFrame.gaugeTypes.Shield)
  {
    // determine the current shield value.
    const currentShieldValue = this.makeShieldValue(this.getActor());

    // compare current against the previous shield value.
    if (this.getLastShieldValue() !== currentShieldValue)
    {
      // update the shield value.
      this.setLastShieldValue(currentShieldValue);

      // reflect it changed.
      return true;
    }
  }

  // nothing changed.
  return false;
};

/**
 * Extends {@link #getActorValue}.<br/>
 * Also gets the shield value if applicable.
 */
J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.set('getActorValue', Sprite_ActorValue.prototype.getActorValue);
Sprite_ActorValue.prototype.getActorValue = function()
{
  // perform original logic.
  const originalValue = J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.get('getActorValue')
    .call(this);

  // return the original value if it is present.
  if (originalValue !== null) return originalValue;

  // check if the parameter is the shield.
  if (this.getParameter() === Window_PartyFrame.gaugeTypes.Shield)
  {
    // return the shield value.
    return this.makeShieldValue(this.getActor());
  }

  // otherwise return null- its something else.
  return null;
};

//endregion Sprite_ActorValue

//region Sprite_Character
/**
 * Extends {@link #initGaugeMembers}.<br/>
 * Adds the shield gauge slot to the gauge group.
 */
J.ABS.EXT.SHIELD.Aliased.Sprite_Character.set('initGaugeMembers', Sprite_Character.prototype.initGaugeMembers);
Sprite_Character.prototype.initGaugeMembers = function()
{
  // perform original logic.
  J.ABS.EXT.SHIELD.Aliased.Sprite_Character.get('initGaugeMembers')
    .call(this);

  /**
   * The shield gauge for this sprite.
   * @type {Sprite_ShieldMapGauge|null}
   */
  this._j._abs._gauges._shieldGauge = null;
};

/**
 * Extends {@link #setupMapSprite}.<br/>
 * Also sets up the on-map shield gauge.
 */
J.ABS.EXT.SHIELD.Aliased.Sprite_Character.set('setupMapSprite', Sprite_Character.prototype.setupMapSprite);
Sprite_Character.prototype.setupMapSprite = function()
{
  // perform original logic.
  J.ABS.EXT.SHIELD.Aliased.Sprite_Character.get('setupMapSprite')
    .call(this);

  // setup the shield gauge above the hp gauge.
  this.setupShieldGauge();
};

/**
 * Sets up this character's shield gauge, to show shields as-needed.
 */
Sprite_Character.prototype.setupShieldGauge = function()
{
  // if we already have a shield gauge sprite available, just (re)bind and reposition it.
  if (this._j._abs._gauges._shieldGauge)
  {
    // bind the current battler to the shield gauge sprite.
    this._j._abs._gauges._shieldGauge.setup(this.getBattler(), 'shield');

    // ensure it’s ready to update when needed (visibility is controlled elsewhere).
    this._j._abs._gauges._shieldGauge.activateGauge();

    // reposition in case dimensions changed (defensive; typically unchanged).
    const sprite = this._j._abs._gauges._shieldGauge;

    // center it horizontally, stack it between Cast (-28) and HP (-12).
    const x = -Math.round(sprite.bitmapWidth() / 2);
    const y = 0;
    sprite.move(x, y);

    // finished (no need to recreate).
    return;
  }

  // create a dedicated shield gauge sprite and keep it activated.
  const baseWidth = 96;
  const baseHeight = 6;
  const sprite = new Sprite_ShieldMapGauge(baseWidth, baseHeight, 6);

  // bind the battler and status type for the MapGauge internals.
  sprite.setup(this.getBattler(), 'shield');
  sprite.activateGauge();

  // assign for later access.
  this._j._abs._gauges._shieldGauge = sprite;

  // position between the cast and hp gauges (centered like cast).
  const x = -Math.round(sprite.bitmapWidth() / 2);
  const y = 0;
  sprite.move(x, y);

  // add to this character's sprite.
  this.addChild(sprite);
};

/**
 * Extends {@link #updateGauges}.<br/>
 * Also updates the shield gauge using the same pattern as HP/Cast.
 */
J.ABS.EXT.SHIELD.Aliased.Sprite_Character.set('updateGauges', Sprite_Character.prototype.updateGauges);
Sprite_Character.prototype.updateGauges = function()
{
  // perform original logic (HP + Cast branches).
  J.ABS.EXT.SHIELD.Aliased.Sprite_Character.get('updateGauges')
    .call(this);

  // check if we can update the shield gauge.
  if (this.canUpdateShieldGauge())
  {
    // update it.
    this.updateShieldGauge();
  }
  // otherwise, if we can't update it...
  else
  {
    // then hide it.
    this.hideShieldGauge();
  }
};

/**
 * Determines whether or not we can update the shield gauge.
 * @returns {boolean} True if we can update the shield gauge, false otherwise.
 */
Sprite_Character.prototype.canUpdateShieldGauge = function()
{
  // if we're not using JABS, then it shouldn't update.
  if (!this.canUpdate()) return false;

  // if this sprite doesn't have a battler, then it shouldn't update.
  if (!this.isJabsBattler()) return false;

  // if we don't have a shield gauge sprite, we can't update it.
  if (!this._j._abs._gauges._shieldGauge) return false;

  // require some shield to be present to show on the map.
  const battler = this.getBattler();
  if (!battler) return false;
  if (battler.currentShieldValue() <= 0) return false;

  // ready to update this frame.
  return true;
};

/**
 * Updates the shield gauge sprite.
 */
Sprite_Character.prototype.updateShieldGauge = function()
{
  // make sure we show it while shields exist (we only get here when canUpdateShieldGauge() is true).
  this.showShieldGauge();

  // ensure the gauge rebinds if battler swapped underneath (post-swap safe).
  const gauge = this._j._abs._gauges._shieldGauge;
  if (gauge)
  {
    // keep the underlying base battler fresh for Sprite_Gauge internals.
    gauge._battler = this.getBattler();
  }
};

/**
 * Shows the shield gauge if it exists.
 */
Sprite_Character.prototype.showShieldGauge = function()
{
  const gauge = this._j._abs._gauges._shieldGauge;
  if (gauge)
  {
    gauge.activateGauge();
    gauge.show();
  }
};

/**
 * Hides the shield gauge if it exists.
 */
Sprite_Character.prototype.hideShieldGauge = function()
{
  const gauge = this._j._abs._gauges._shieldGauge;
  if (gauge)
  {
    gauge.hide();
  }
};

//endregion Sprite_Character

//region Sprite_ShieldMapGauge
/**
 * An implementation of the {@link Sprite_MapGauge} that renders shields.
 */
class Sprite_ShieldMapGauge
  extends Sprite_MapGauge
{
  /**
   * Constructor.
   * @param {number} bitmapWidth The width of the bitmap.
   * @param {number} bitmapHeight The height of the bitmap.
   * @param {number} gaugeHeight The actual visual gauge height.
   */
  constructor(bitmapWidth, bitmapHeight, gaugeHeight)
  {
    // perform original logic.
    super(bitmapWidth, bitmapHeight, gaugeHeight);
  }

  /**
   * Determines if this gauge can be updated.
   * @returns {boolean} True if the gauge can be updated, false otherwise.
   */
  canUpdateShieldGauge()
  {
    // if there is no battler, then we cannot update the shield gauge.
    if (!this.getBattler()) return false;

    // update the gauge.
    return true;
  }

  /**
   * Gets the current value for this gauge.
   * For shield gauges: returns the total current shield across all active shield states.
   * For all other types: defers to the base implementation.
   * @returns {number}
   */
  currentValue()
  {
    // grab the battler.
    const battler = this.getBattler();

    // if no battler is bound yet, report 0 so the gauge can still render its back track.
    if (!battler)
    {
      // return no shield value.
      return NaN;
    }

    // grab the current shield value.
    const currentShieldValue = battler.currentShieldValue();

    // check if the shield value is 0.
    if (currentShieldValue === 0)
    {
      // return no shield value.
      return NaN;
    }

    // return the shield value.
    return currentShieldValue;
  }

  /**
   * Gets the max value for this gauge.
   * For shield gauges: returns the HP reference (mhp) so shield scale matches HP gauge.
   * For all other types: defers to the base implementation.
   * @returns {number}
   */
  currentMaxValue()
  {
    // grab the battler.
    const battler = this.getBattler();

    // if no battler is bound, report 0 to avoid NaN math.
    if (!battler)
    {
      // return no shield cap.
      return NaN;
    }

    // grab the shield cap value.
    const capShieldValue = battler.currentShieldCap();

    // check if the shield cap is 0.
    if (capShieldValue === 0)
    {
      // return no shield cap.
      return NaN;
    }

    // return the shield cap value.
    return capShieldValue;
  }

  /**
   * Overrides {@link #gaugeColor1}.<br/>
   * Returns the shield gauge color gradient 1.
   * @returns {string}
   */
  gaugeColor1()
  {
    return ColorManager.shieldGauge1();
  }

  /**
   * Overrides {@link #gaugeColor2}.<br/>
   * Returns the shield gauge color gradient 2.
   * @returns {string}
   */
  gaugeColor2()
  {
    return ColorManager.shieldGauge2();
  }

  /**
   * Explicitly return an empty label for shield map gauges.
   * This isn’t strictly required once gaugeX() is 0, but adds clarity.
   * @returns {string}
   */
  label()
  {
    return String.empty;
  }
}

//endregion Sprite_ShieldMapGauge

if (J.HUD && J.HUD.EXT.PARTY)
{
  /**
   * The type of gauge for shields.
   */
  Window_PartyFrame.gaugeTypes.Shield = 'shield';

  //region caching
  /**
   * Creates the key for an actor's shield gauge sprite based on the parameters.
   * @param {Game_Actor} actor The actor to draw a composite shield gauge for.
   * @param {boolean} isFull Whether or not this is for a full-sized sprite.
   * @returns {string} The key for this shield gauge sprite.
   */
  Window_PartyFrame.prototype.makeShieldGaugeSpriteKey = function(actor, isFull)
  {
    // identify the size variant for cache keying.
    const gaugeSize = isFull
      ? 'full'
      : 'mini';

    // return a deterministic cache key for this actor + size.
    return `shield-${gaugeSize}-${actor.name()}-${actor.actorId()}`;
  };

  /**
   * Creates a full-sized composite shield gauge sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a shield gauge sprite for.
   * @returns {Sprite_ShieldMapGauge} The shield gauge sprite.
   */
  Window_PartyFrame.prototype.getOrCreateFullSizeShieldGaugeSprite = function(actor)
  {
    // the key for this actor's full gauge sprite.
    const key = this.makeShieldGaugeSpriteKey(actor, true);

    // check if the key already maps to a cached sprite.
    if (this._hudSprites.has(key))
    {
      // if it does, just return that.
      return this._hudSprites.get(key);
    }

    // determine gauge width based on gauge type.
    const hpGauge = this.getOrCreateFullSizeGaugeSprite(actor, Window_PartyFrame.gaugeTypes.HP);
    const bitmapWidth = hpGauge.bitmapWidth();
    const bitmapHeight = 8;
    const gaugeHeight = 8;

    // create a new full-width short-height gauge sprite of the actor.
    const sprite = new Sprite_ShieldMapGauge(bitmapWidth, bitmapHeight, gaugeHeight);

    // setup the gauge sprite to point to the actor.
    sprite.setup(actor, Window_PartyFrame.gaugeTypes.Shield);

    // deactivate the gauge to prevent updating until its necessary.
    sprite.deactivateGauge();

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  };

  /**
   * Creates a mini-sized composite shield gauge sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a shield gauge sprite for.
   * @returns {Sprite_ShieldMapGauge} The shield gauge sprite.
   */
  Window_PartyFrame.prototype.getOrCreateMiniSizeShieldGaugeSprite = function(actor)
  {
    // build the cache key for this actor's mini-size shield sprite.
    const key = this.makeShieldGaugeSpriteKey(actor, false);

    // if we already have one cached, reuse it.
    if (this._hudSprites.has(key))
    {
      // return the cached instance.
      return this._hudSprites.get(key);
    }

    // create the shield gauge using the mini HP gauge’s nominal width and a thin height.
    const hpGauge = this.getOrCreateMiniSizeGaugeSprite(actor, Window_PartyFrame.gaugeTypes.HP);
    const bitmapWidth = hpGauge.bitmapWidth();
    const bitmapHeight = 4;
    const gaugeHeight = 4;

    // create a new full-width short-height gauge sprite of the actor.
    const sprite = new Sprite_ShieldMapGauge(bitmapWidth, bitmapHeight, gaugeHeight);

    // setup the gauge sprite to point to the actor.
    sprite.setup(actor, Window_PartyFrame.gaugeTypes.Shield);

    // deactivate the gauge to prevent updating until its necessary.
    sprite.deactivateGauge();

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  };

  /**
   * Creates the key for an actor's shield value sprite.
   * @param {Game_Actor} actor The actor to draw a shield value sprite for.
   * @returns {string} The key for this shield value sprite.
   */
  Window_PartyFrame.prototype.makeShieldValueSpriteKey = function(actor)
  {
    // return a deterministic cache key for this actor’s shield values.
    return `shield-values-full-${actor.name()}-${actor.actorId()}`;
  };

  /**
   * Creates a full-sized shield value sprite for the given actor and caches it.
   * Only used for the party leader.
   * @param {Game_Actor} actor The actor to draw a shield value sprite for.
   * @returns {Sprite_ActorValue} The shield value sprite.
   */
  Window_PartyFrame.prototype.getOrCreateShieldValueSprite = function(actor)
  {
    // build the cache key for this actor's shield value sprite.
    const key = this.makeShieldValueSpriteKey(actor);

    // check cache.
    if (this._hudSprites.has(key))
    {
      return this._hudSprites.get(key);
    }

    // create and set up the value sprite for shields.
    const sprite = new Sprite_ActorValue(actor, Window_PartyFrame.gaugeTypes.Shield, -6);

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  };

  /**
   * Creates all sprites for this hud and caches them.
   */
  J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.set('createCache', Window_PartyFrame.prototype.createCache);
  Window_PartyFrame.prototype.createCache = function()
  {
    // establish the gauge types we will create.
    J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.get('createCache')
      .call(this);

    // iterate over each of the battle members in the party.
    $gameParty.battleMembers()
      .forEach(actor =>
      {
        // cache the full-sized shield gauges for each actor.
        this.getOrCreateFullSizeShieldGaugeSprite(actor);

        // cache the mini-sized shield gauges for each actor.
        this.getOrCreateMiniSizeShieldGaugeSprite(actor);
      });
  };
  //endregion caching

  /**
   * Extends {@link #drawLeaderResourceGauges}.<br/>
   * Calls original, then overlays the composite shield gauge on the HP gauge.
   * @param {number} x The x coordinate of the leader resource gauge group.
   * @param {number} y The y coordinate of the leader resource gauge group.
   */
  J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.set(
    'drawLeaderResourceGauges',
    Window_PartyFrame.prototype.drawLeaderResourceGauges
  );
  Window_PartyFrame.prototype.drawLeaderResourceGauges = function(x, y)
  {
    // perform original logic for drawing HP/MP/TP and numbers.
    J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.get('drawLeaderResourceGauges')
      .call(this, x, y);

    // draw the shield gauge as well.
    this.drawLeaderShieldGauge(x, y);
  };

  /**
   * Draws the composite shield gauge on the HP gauge.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  Window_PartyFrame.prototype.drawLeaderShieldGauge = function(x, y)
  {
    // grab the party leader.
    const leader = $gameParty.leader();

    // acquire the HP gauge sprite used for size/position reference.
    const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.HP);

    // define the overlay height (thin strip) for full-size HP.
    const overlayH = 4;

    // center the overlay vertically on the HP gauge's height.
    const overlayY = y + Math.floor((hpGauge.bitmapHeight() - overlayH) / 2) - 14;

    // create or reuse the composite shield gauge sized to the HP bar.
    const shield = this.getOrCreateFullSizeShieldGaugeSprite(leader);

    // sprites must be activated to draw.
    shield.activateGauge();

    // position to match HP bar.
    const shieldX = x;
    shield.move(shieldX, overlayY);
    shield.show();

    // get or create the shield value sprite for the leader.
    const shieldValues = this.getOrCreateShieldValueSprite(leader);

    // activate and position the numbers near the HP numbers.
    const shieldValuesX = x + 12;
    shieldValues.move(shieldValuesX, overlayY - 12);
    shieldValues.show();
  };

  /**
   * Extends/Overrides {@link #drawAllyGauges}.<br/>
   * Calls original, then overlays the composite shield gauge on the ally HP gauge.
   * @param {Game_Actor} ally The ally to draw the gauges for.
   * @param {number} x The x coordinate.
   * @param {number} oy The original y coordinate.
   */
  J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.set('drawAllyGauges', Window_PartyFrame.prototype.drawAllyGauges);
  Window_PartyFrame.prototype.drawAllyGauges = function(ally, x, oy)
  {
    // perform original logic for drawing mini HP/MP/TP.
    J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.get('drawAllyGauges')
      .call(this, ally, x, oy);

    // draw the shield gauge as well.
    this.drawAllyShieldGauge(ally, x, oy);
  };

  /**
   * Draws the composite shield gauge on the ally HP gauge.
   * @param {Game_Actor} ally The ally to draw the shield gauge for.
   * @param {number} x The x coordinate.
   * @param {number} oy The original y coordinate.
   */
  Window_PartyFrame.prototype.drawAllyShieldGauge = function(ally, x, oy)
  {
    // determine the line height for mini gauges.
    const lh = 12;

    // acquire the mini HP gauge sprite used for size/position reference.
    const hpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.HP);

    // define the overlay height (thin strip) for mini-size HP.
    const overlayH = 3;

    // compute the top y of the mini HP gauge line.
    const hpY = oy + (lh * 0);

    // center the overlay vertically on the mini HP gauge's height.
    const overlayY = hpY + Math.floor((hpGauge.bitmapHeight() - overlayH) / 2) - 6;

    // create or reuse the composite shield gauge sized to the mini HP bar.
    const shield = this.getOrCreateMiniSizeShieldGaugeSprite(ally);

    // sprites must be activated to draw.
    shield.activateGauge();

    // Position to match HP bar.
    const shieldX = x;
    shield.move(shieldX, overlayY);
    shield.show();
  };
}