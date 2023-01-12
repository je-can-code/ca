//region Difficulty
/**
 * A class governing a single difficulty and the way it impacts the game parameters.
 */
class DifficultyMetadata
{
  //region properties
  /**
   * The name of the difficulty, visually to the player.
   * @type {string}
   */
  name = String.empty;

  /**
   * The unique identifier of the difficulty, used for lookup and reference.
   * @type {string}
   */
  key = String.empty;

  /**
   * The description of the difficulty, displayed in the help window at the top.
   * @type {string}
   */
  description = String.empty;

  /**
   * The icon used when the name of the difficulty is displayed in the scene.
   * @type {number}
   */
  iconIndex = 0;

  /**
   * The cost required to enable this difficulty.
   * @type {number}
   */
  cost = 0;
  //endregion properties

  //region params
  /**
   * The various battler effects that apply against actors.
   * @type {DifficultyBattlerEffects}
   */
  actorEffects = new DifficultyBattlerEffects();

  /**
   * The various battler effects that apply against enemies.
   * @type {DifficultyBattlerEffects}
   */
  enemyEffects = new DifficultyBattlerEffects();
  //endregion params

  //region bonuses
  /**
   * The bonus multiplier for experience earned by the player.
   * @type {number}
   */
  exp = 100;

  /**
   * The bonus multiplier for gold found by the player.
   * @type {number}
   */
  gold = 100;

  /**
   * The bonus multiplier for sdp acquired by the player.
   * @type {number}
   */
  sdp = 100;

  /**
   * The bonus multiplier for drops (potentially) gained by the player.
   * @type {number}
   */
  drops = 100;

  /**
   * The bonus multiplier for the encounter rate for the player.
   * @type {number}
   */
  encounters = 100;
  //endregion bonuses

  //region access
  /**
   * Whether or not this difficulty is enabled.
   * When a difficulty is enabled, its global effects are applied.
   * @type {boolean}
   */
  enabled = false;

  /**
   * Whether or not this difficulty is unlocked and can be enabled/disabled.
   * @type {boolean}
   */
  unlocked = true;

  /**
   * Whether or not this difficulty is hidden from selection.
   * @type {boolean}
   */
  hidden = false;
  //endregion access
}
//endregion Difficulty