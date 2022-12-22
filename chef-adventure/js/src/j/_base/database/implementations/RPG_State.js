//region RPG_State
/**
 * An class representing a single state from the database.
 */
class RPG_State extends RPG_Traited
{
  //region properties
  /**
   * The automatic removal timing.
   * @type {0|1|2}
   */
  autoRemovalTiming = 0;

  /**
   * The percent chance that receiving damage will remove this state.
   * Requires `removeByDamage` to be true on this state.
   * @type {number}
   */
  chanceByDamage = 100;

  /**
   * OVERWRITE States do not normally have descriptions.
   * Rather than leaving it as `undefined`, lets be nice and keep it
   * an empty string.
   * @type {String.empty}
   */
  description = String.empty;

  /**
   * The maximum number of turns this state will persist.
   * Requires `restriction` to not be 0 to be leveraged.
   * @type {number}
   */
  maxTurns = 1;

  /**
   * "If an actor is inflicted with this state..."
   * @type {string}
   */
  message1 = String.empty;

  /**
   * "If an enemy is inflicted with this state..."
   * @type {string}
   */
  message2 = String.empty;

  /**
   * "If the state persists..."
   * @type {string}
   */
  message3 = String.empty;

  /**
   * "If the state is removed..."
   * @type {string}
   */
  message4 = String.empty;

  /**
   * The type of message this is.
   * (unsure)
   * @type {number}
   */
  messageType = 1;

  /**
   * The minimum number of turns this state will persist.
   * Requires `restriction` to not be 0 to be leveraged.
   * @type {number}
   */
  minTurns = 1;

  /**
   * The motion the sideview battler will take while afflicted
   * with this state.
   * @type {number}
   */
  motion = 0;

  /**
   * The state overlay id that shows on the battler while
   * this state is afflicted.
   * @type {number}
   */
  overlay = 0;

  /**
   * The priority of the skill.
   * @type {number}
   */
  priority = 50;

  /**
   * Whether or not this state will automatically be removed at
   * the end of the battle.
   * @type {boolean}
   */
  removeAtBattleEnd = false;

  /**
   * Whether or not this state can be removed simply by taking damage.
   * Leverages the `chanceByDamage` percent for whether or not to remove.
   * @type {boolean}
   */
  removeByDamage = false;

  /**
   * Whether or not this state can be removed by applying a different state
   * that has a higher `restriction` type.
   * @type {boolean}
   */
  removeByRestriction = false;

  /**
   * Whether or not this state can be removed by taking the `stepsToRemove` number
   * of steps on this state.
   * @type {boolean}
   */
  removeByWalking = false;

  /**
   * The type of restriction this state has.
   * @type {number}
   */
  restriction = 0;

  /**
   * The number of steps to remove this state.
   * Requires `removeByWalking` to be true on this state to be leveraged.
   * @type {number}
   */
  stepsToRemove = 100;
  //endregion properties

  /**
   * Constructor.
   * Maps the state's properties into this object.
   * @param {rm.types.State} state The underlying state object.
   * @param {number} index The index of the state in the database.
   */
  constructor(state, index)
  {
    // perform original logic.
    super(state, index);

    // map the states's data points 1:1.
    this.autoRemovalTiming = state.autoRemovalTiming;
    this.chanceByDamage = state.chanceByDamage;
    this.maxTurns = state.maxTurns;
    this.message1 = state.message1;
    this.message2 = state.message2;
    this.message3 = state.message3;
    this.message4 = state.message4;
    this.messageType = state.messageType;
    this.minTurns = state.minTurns;
    this.motion = state.motion;
    this.overlay = state.overlay;
    this.priority = state.priority;
    this.removeAtBattleEnd = state.removeAtBattleEnd;
    this.removeByDamage = state.removeByDamage;
    this.removeByRestriction = state.removeByRestriction;
    this.removeByWalking = state.removeByWalking;
    this.restriction = state.restriction;
    this.stepsToRemove = state.stepsToRemove;
  }
}
//endregion RPG_State