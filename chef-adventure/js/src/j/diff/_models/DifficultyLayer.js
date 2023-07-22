//region DifficultyLayer
/**
 * A class governing a single difficulty and the way it impacts the game parameters.
 */
class DifficultyLayer
{
  /**
   * Creates a new instance of {@link DifficultyLayer} from a {@link DifficultyMetadata}.
   * @param {DifficultyMetadata} difficultyMetadata The metadata to build from.
   * @returns {DifficultyLayer} The new difficulty based on the metadata.
   */
  static fromMetadata(difficultyMetadata)
  {
    // initialize the difficulty.
    const difficultyLayer = new DifficultyLayer(difficultyMetadata.key);

    // core information.
    difficultyLayer.name = difficultyMetadata.name;
    difficultyLayer.description = difficultyMetadata.description;
    difficultyLayer.iconIndex = difficultyMetadata.iconIndex;
    difficultyLayer.cost = difficultyMetadata.cost;

    // combat modifiers.
    difficultyLayer.actorEffects = difficultyMetadata.actorEffects;
    difficultyLayer.enemyEffects = difficultyMetadata.enemyEffects;

    // reward modifiers.
    difficultyLayer.exp = difficultyMetadata.exp;
    difficultyLayer.gold = difficultyMetadata.gold;
    difficultyLayer.drops = difficultyMetadata.drops;
    difficultyLayer.encounters = difficultyMetadata.encounters;

    // custom modifiers.
    difficultyLayer.sdp = difficultyMetadata.sdp;

    // return our translated metadata.
    return difficultyLayer;
  }

  /**
   * A default {@link DifficultyLayer} with all unmodified parameters and bonuses.
   * When all layers are disabled, this is the default layer used.
   * @type {DifficultyLayer}
   */
  static defaultLayer = new DifficultyLayer(J.DIFFICULTY.Metadata.DefaultDifficulty);

  /**
   * The key associated with the applied difficulty.
   * @type {string}
   */
  static appliedKey = `000_applied-difficulty`;

  /**
   * Constructor to instantiate a layer of difficulty with a key.
   * @param {string} key The key of this layer.
   */
  constructor(key)
  {
    this.key = key;
  }

  /**
   * Checks whether or not this difficulty layer is actually the default layer.
   * @returns {boolean}
   */
  isDefaultLayer()
  {
    return this.key === J.DIFFICULTY.Metadata.DefaultDifficulty;
  }

  /**
   * Checks whether or not this difficulty layer is actually the applied difficulty layer.
   * @returns {boolean}
   */
  isAppliedLayer()
  {
    return this.key === DifficultyLayer.appliedKey;
  }

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

  /**
   * The various parameter effects that apply to actors.
   * @type {DifficultyBattlerEffects}
   */
  actorEffects = new DifficultyBattlerEffects();

  /**
   * The various parameter effects that apply to enemies.
   * @type {DifficultyBattlerEffects}
   */
  enemyEffects = new DifficultyBattlerEffects();

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
  //endregion properties

  //region access
  /**
   * Whether or not this difficulty's cost can be covered by the remaining layer points.
   * @returns {boolean} True if the cost can be paid, false otherwise.
   */
  canPayCost()
  {
    // payment is defined by having at least this layer's cost remaining
    const canPay = this.cost <= $gameSystem.getRemainingLayerPoints();

    // return our determination.
    return canPay;
  }

  /**
   * Determines whether or not this difficulty is unlocked.
   * @returns {boolean}
   */
  isUnlocked()
  {
    // grab whether or not the the difficulty was unlocked.
    const { unlocked } = $gameSystem.getDifficultyConfigByKey(this.key);

    // return what we found.
    return unlocked;
  }

  /**
   * Locks this difficulty, making it unavailable for the player to enable/disable.
   */
  lock()
  {
    // grab the configuration to lock.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // lock it.
    config.unlocked = false;
  }

  /**
   * Unlocks this difficulty, making it available for the player to enable/disable.
   */
  unlock()
  {
    // grab the configuration to unlock.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // unlock it.
    config.unlocked = true;
  }

  /**
   * Determines whether or not this difficulty is hidden in the list.
   * @returns {boolean}
   */
  isHidden()
  {
    // grab whether or not the difficulty was hidden.
    const { hidden } = $gameSystem.getDifficultyConfigByKey(this.key);

    // return what we found.
    return hidden;
  }

  /**
   * Hides this difficulty, making it no longer listed in the difficulty list.
   */
  hide()
  {
    // grab the configuration to hide.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // hide it.
    config.hidden = true;
  }

  /**
   * Unhides this difficulty, making it visible in the difficulty list.
   */
  unhide()
  {
    // grab the configuration to unhide.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // unhide it.
    config.hidden = false;
  }

  /**
   * Determines whether or not this difficulty is currently enabled.
   * @returns {boolean} True if this difficulty is enabled, false otherwise.
   */
  isEnabled()
  {
    // grab whether or not the difficulty was enabled.
    const { enabled } = $gameSystem.getDifficultyConfigByKey(this.key);

    // return what we found.
    return enabled;
  }

  /**
   * Enables this difficulty layer.
   */
  enable()
  {
    // grab the configuration to enable.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // enable it.
    config.enabled = true;
  }

  /**
   * Disables this difficulty layer.
   */
  disable()
  {
    // grab the configuration to disable.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // disable it.
    config.enabled = false;
  }
  //endregion access
}
//endregion DifficultyLayer