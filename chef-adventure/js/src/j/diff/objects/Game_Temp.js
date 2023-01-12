//region Game_Temp
/**
 * Intializes all additional members of this class.
 */
J.DIFFICULTY.Aliased.Game_Temp.set('initMembers', Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function()
{
  // perform original logic.
  J.DIFFICULTY.Aliased.Game_Temp.get('initMembers').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._difficulty ||= {};

  /**
   * All difficulties that were defined in the plugin metadata.
   * @type {Map<string, DifficultyMetadata>}
   */
  this._j._difficulty._metadata = J.DIFFICULTY.Helpers.toDifficultiesMap(
    J.DIFFICULTY.PluginParameters['difficulties']);

  /**
   * All difficulties available for use.
   * @type {Map<string, DifficultyLayer>}
   */
  this._j._difficulty._allLayers = new Map();

  /**
   * All difficulties' default configurations.
   * @type {Map<string, DifficultyConfig>}
   */
  this._j._difficulty._allConfigs = new Map();

  /**
   * The "applied" difficulty.
   * This is effectively a combination of all currently enabled difficulties as
   * a single {@link DifficultyLayer}.
   * @type {DifficultyLayer}
   */
  this._j._difficulty._appliedDifficulty = DifficultyLayer.defaultLayer;
};

/**
 * Gets all difficulties that have been defined by plugin metadata.
 * @returns {Map<string, DifficultyLayer>}
 */
Game_Temp.prototype.getAllDifficultyLayers = function()
{
  return this._j._difficulty._allLayers;
};

/**
 * Finds the {@link DifficultyLayer} that matches the given key.
 * @param {string} key The key of the difficulty to find.
 * @returns {DifficultyLayer|undefined} The difficulty if it existed, `undefined` otherwise;
 */
Game_Temp.prototype.findDifficultyLayerByKey = function(key)
{
  // grab all the difficulties.
  const difficulties = this.getAllDifficultyLayers();

  // return what was found.
  return difficulties.get(key);
};

/**
 * Sets up the difficulty layers based on the plugin parameters.
 */
Game_Temp.prototype.setupDifficultySystem = function()
{
  // iterate over each of the metadatas.
  this._j._difficulty._metadata.forEach((difficultyMetadata, key) =>
  {
    // create the difficulty from metadata.
    const difficultyLayer = DifficultyLayer.fromMetadata(difficultyMetadata);

    // add the difficulty layer to the list of available layers.
    this._j._difficulty._allLayers.set(key, difficultyLayer);

    // create the config from metadata.
    const difficultyConfig = DifficultyConfig.fromMetadata(difficultyMetadata);

    // add the difficulty config to the list of available configs.
    this._j._difficulty._allConfigs.set(key, difficultyConfig);

    // also register the configuration with the system for tracking.
    $gameSystem.registerDifficultyConfig(difficultyConfig);
  });

  // refresh the applied difficulty.
  this.refreshAppliedDifficulty();
};

/**
 * Gets the applied difficulty.
 * If somehow there is no applied difficulty in-place, then the default will be used.
 * @returns {DifficultyLayer}
 */
Game_Temp.prototype.getAppliedDifficulty = function()
{
  return this._j._difficulty._appliedDifficulty ?? DifficultyLayer.defaultLayer;
};

/**
 * Sets the applied difficulty to the given difficulty.
 * @param {DifficultyLayer} difficulty The new applied difficulty.
 */
Game_Temp.prototype.setAppliedDifficulty = function(difficulty)
{
  this._j._difficulty._appliedDifficulty = difficulty;
};

/**
 * Refreshes the applied difficulty based on the currently enabled layers.
 */
Game_Temp.prototype.refreshAppliedDifficulty = function()
{
  // build the applied difficulty.
  const appliedDifficulty = this.buildAppliedDifficulty();

  // set the new layer.
  this.setAppliedDifficulty(appliedDifficulty);
};

/**
 * Builds the applied difficulty based on the currently enabled layers.
 * @returns {DifficultyLayer}
 */
Game_Temp.prototype.buildAppliedDifficulty = function()
{
  /** @type {DifficultyLayer[]} */
  const enabledDifficulties = $gameSystem
    .getAllDifficultyConfigs()
    .filter(config => config.enabled)
    .map(config => this.findDifficultyLayerByKey(config.key));

  // check if we have no enabled difficulties.
  if (enabledDifficulties.length === 0)
  {
    // we'll just apply the default layer.
    return DifficultyLayer.defaultLayer;
  }

  // initialize the battler effects.
  const enabledActorEffects = new DifficultyBattlerEffects();
  const enabledEnemyEffects = new DifficultyBattlerEffects();

  // destructure the direct values out.
  let { exp, gold, drops, encounters, sdp, cost } = DifficultyLayer.defaultLayer;

  // iterate over each difficulty layer and apply it multiplicatively to the running amounts.
  enabledDifficulties.forEach(layer =>
  {
    // extract the effects data.
    const { actorEffects, enemyEffects } = layer;

    // iterate over each of the b-params.
    actorEffects.bparams.forEach((bparam, bIndex) =>
    {
      // calculate the factor.
      const bParamFactor = parseFloat((bparam / 100).toFixed(3));

      // apply the multiplier.
      enabledActorEffects.bparams[bIndex] *= bParamFactor;
    });

    // iterate over each of the s-params.
    actorEffects.sparams.forEach((sparam, sIndex) =>
    {
      // calculate the factor.
      const sParamFactor = parseFloat((sparam / 100).toFixed(3));

      // apply the multiplier.
      enabledActorEffects.sparams[sIndex] *= sParamFactor;
    });

    // iterate over each of the x-params.
    actorEffects.xparams.forEach((xparam, xIndex) =>
    {
      // calculate the factor.
      const xParamFactor = parseFloat((xparam / 100).toFixed(3));

      // apply the multiplier.
      enabledActorEffects.xparams[xIndex] *= xParamFactor;
    });

    // iterate over each of the b-params.
    enemyEffects.bparams.forEach((bparam, bIndex) =>
    {
      // calculate the factor.
      const bParamFactor = parseFloat((bparam / 100).toFixed(3));

      // apply the multiplier.
      enabledEnemyEffects.bparams[bIndex] *= bParamFactor;
    });

    // iterate over each of the s-params.
    enemyEffects.sparams.forEach((sparam, sIndex) =>
    {
      // calculate the factor.
      const sParamFactor = parseFloat((sparam / 100).toFixed(3));

      // apply the multiplier.
      enabledEnemyEffects.sparams[sIndex] *= sParamFactor;
    });

    // iterate over each of the x-params.
    enemyEffects.xparams.forEach((xparam, xIndex) =>
    {
      // calculate the factor.
      const xParamFactor = parseFloat((xparam / 100).toFixed(3));

      // apply the multiplier.
      enabledEnemyEffects.xparams[xIndex] *= xParamFactor;
    });

    // calculate the factor.
    const expFactor = parseFloat((layer.exp / 100).toFixed(3));

    // apply the multiplier.
    exp *= expFactor;

    // calculate the factor.
    const goldFactor = parseFloat((layer.gold / 100).toFixed(3));

    // apply the multiplier.
    gold *= goldFactor;

    // calculate the factor.
    const dropsFactor = parseFloat((layer.drops / 100).toFixed(3));

    // apply the multiplier.
    drops *= dropsFactor;

    // calculate the factor.
    const encountersFactor = parseFloat((layer.encounters / 100).toFixed(3));

    // apply the multiplier.
    encounters *= encountersFactor;

    // calculate the factor.
    const sdpFactor = parseFloat((layer.sdp / 100).toFixed(3));

    // apply the multiplier.
    sdp *= sdpFactor;

    // accumulate the cost.
    cost += layer.cost;
  }, this);

  // find the default layer.
  const defaultLayer = enabledDifficulties.find(layer => layer.isDefaultLayer());

  // validate the layer's definition.
  if (defaultLayer)
  {
    // update the default layer with this one.
    DifficultyLayer.defaultLayer = defaultLayer;
  }
  // we do not have a defined default layer.
  else
  {
    throw new Error(`Must have a default difficulty defined in plugin parameters.`);
  }

  // build the new applied difficulty layer.
  const newDifficulty = new DifficultyLayer(DifficultyLayer.appliedKey);
  newDifficulty.name = "Applied Difficulty";
  newDifficulty.description = "The combined effects of all enabled difficulties.";
  newDifficulty.cost = cost;

  // params.
  newDifficulty.actorEffects = enabledActorEffects;
  newDifficulty.enemyEffects = enabledEnemyEffects;

  // bonuses.
  newDifficulty.exp = exp;
  newDifficulty.gold = gold;
  newDifficulty.drops = drops;
  newDifficulty.encounters = encounters;
  newDifficulty.sdp = sdp;

  // return the compiled difficulty.
  return newDifficulty;
};
//endregion Game_Temp