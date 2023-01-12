//region Game_System
/**
 * Extends the `.initialize()` with our difficulty initialization.
 */
J.DIFFICULTY.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.DIFFICULTY.Aliased.Game_System.get('initialize').call(this);

  // initializes members for this plugin.
  this.initDifficultyMembers();
};

/**
 * Initializes the Difficulty System.
 */
Game_System.prototype.initDifficultyMembers = function()
{
  /**
   * The over-arching object that contains all properties for this plugin.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the difficulty system.
   */
  this._j._difficulty ||= {};

  /**
   * The collection of difficulty configurations tracked by this player.
   * @type {DifficultyConfig[]}
   */
  this._j._difficulty._configurations = [];

  /**
   * The max points available to allocate to difficulty layers.
   * @type {number}
   */
  this._j._difficulty._layerPointMax = J.DIFFICULTY.Metadata.DefaultLayerPointMax;

  /**
   * The current number of points allocated to difficulty layers.
   * @type {number}
   */
  this._j._difficulty._layerPoints = 0;
};

/**
 * Extends {@link #onAfterLoad}.
 * Updates the list of all available difficulties from the latest plugin metadata.
 */
J.DIFFICULTY.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.DIFFICULTY.Aliased.Game_System.get('onAfterLoad').call(this);

  // setup the difficulty layers in the temp data.
  $gameTemp.setupDifficultySystem();
};

/**
 * Get all current configurations for difficulties.
 * @returns {DifficultyConfig[]}
 */
Game_System.prototype.getAllDifficultyConfigs = function()
{
  return this._j._difficulty._configurations;
};

/**
 * Add a {@link DifficultyConfig} to the list of configurations.
 * @param {DifficultyConfig} config The config to add.
 */
Game_System.prototype.addDifficultyConfig = function(config)
{
  // grab all the configs.
  const difficultyConfigs = this.getAllDifficultyConfigs();

  // add the new config.
  difficultyConfigs.push(config);
};

/**
 * Gets the {@link DifficultyConfig} associated with the given key.
 * @param {string} key The key of the difficulty.
 * @returns {DifficultyConfig|undefined} The config if found, undefined otherwise.
 */
Game_System.prototype.getDifficultyConfigByKey = function(key)
{
  return this.getAllDifficultyConfigs().find(config => config.key === key);
};

/**
 * Registers a {@link DifficultyConfig} with the system if it is not already registered.
 * @param {DifficultyConfig} difficultyConfig The config to register.
 */
Game_System.prototype.registerDifficultyConfig = function(difficultyConfig)
{
  // grab the key from the config.
  const { key } = difficultyConfig;

  // determine the index of the config.
  const foundConfig = this.getDifficultyConfigByKey(key);

  // we haven't registered this config yet.
  if (!foundConfig)
  {
    // only register the config if it didn't exist previously.
    this.addDifficultyConfig(difficultyConfig);
  }
};

/**
 * Gets the number of max layer points the player has.
 * @returns {number}
 */
Game_System.prototype.getLayerPointMax = function()
{
  return this._j._difficulty._layerPointMax;
};

/**
 * Sets the max layer points to a designated amount.
 * @param {number} layerPointMax The new max layer point value.
 */
Game_System.prototype.setLayerPointMax = function(layerPointMax)
{
  this._j._difficulty._layerPointMax = layerPointMax;
};

/**
 * Modifies the max layer points by a given amount.
 * @param {number} modifier The modifier against the max layer points.
 */
Game_System.prototype.modLayerPointMax = function(modifier)
{
  this._j._difficulty._layerPointMax += modifier;
};

/**
 * Gets the number of current layer points the player has available.
 * @returns {number}
 */
Game_System.prototype.getLayerPoints = function()
{
  return this._j._difficulty._layerPoints;
};

/**
 * Sets the current number of layer points the player has available.
 * @param {number} layerPoints The new amount of layer points for the player.
 */
Game_System.prototype.setLayerPoints = function(layerPoints)
{
  this._j._difficulty._layerPoints = layerPoints;
};

/**
 * Modifies the current layer points by a given amount.
 * @param {number} modifier The modifier against the current layer points.
 */
Game_System.prototype.modLayerPoints = function(modifier)
{
  this._j._difficulty._layerPoints += modifier;
};

/**
 * Gets the remaining number of layer points available.
 * @returns {number}
 */
Game_System.prototype.getRemainingLayerPoints = function()
{
  return (this.getLayerPointMax() - this.getLayerPoints());
};
//endregion Game_System