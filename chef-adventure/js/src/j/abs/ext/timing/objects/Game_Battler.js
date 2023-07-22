//region Game_Battler
/**
 * Extends `initMembers()` to include initialization of our new parameters.
 */
J.ABS.EXT.TIMING.Aliased.Game_Battler.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.TIMING.Aliased.Game_Battler.get('initMembers').call(this);

  // initialize the extra members.
  this.initActionUpgrades1();
};

/**
 * Initializes the extra properties for the action upgrades..
 */
Game_Battler.prototype.initActionUpgrades1 = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  /**
   * A grouping of all JABS properties associated with the set-1 of action upgrades.
   */
  this._j._abs._timing = {};

  /**
   * The cached value for fast cooldown's base modifier.
   * @type {number}
   */
  this._j._abs._timing._baseFastCooldown = 0;

  /**
   * The cached value for fast cooldown's flat modifier.
   * @type {number}
   */
  this._j._abs._timing._fastCooldownFlat = 0;

  /**
   * The cached value for the fast cooldown's multiplicative modifier.
   * @type {number}
   */
  this._j._abs._timing._fastCooldownRate = 0;

  /**
   * The cached value for the cast speed's base modifier.
   * @type {number}
   */
  this._j._abs._timing._baseCastSpeed = 0;

  /**
   * The cached value for the cast speed's flat modifier.
   * @type {number}
   */
  this._j._abs._timing._castSpeedFlat = 0;

  /**
   * The cached value for the cast speed's multiplicative modifier.
   * @type {number}
   */
  this._j._abs._timing._castSpeedRate = 0;
};

//region getters & setters & updates
/**
 * Gets the cached fast cooldown base value.
 * @returns {number}
 */
Game_Battler.prototype.getBaseFastCooldown = function()
{
  return this._j._abs._timing._baseFastCooldown;
};

/**
 * Sets the cached fast cooldown base value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setBaseFastCooldown = function(amount)
{
  this._j._abs._timing._baseFastCooldown = amount;
};

/**
 * Updates the cached fast cooldown base value with the latest.
 */
Game_Battler.prototype.updateBaseFastCooldown = function()
{
  // get the current fast cooldown base modifier.
  const currentFastCooldownFlat = this.baseFastCooldown();

  // update the fast cooldown base modifier.
  this.setBaseFastCooldown(currentFastCooldownFlat);
};


/**
 * Gets the cached fast cooldown flat value.
 * @returns {number}
 */
Game_Battler.prototype.getFastCooldownFlat = function()
{
  return this._j._abs._timing._fastCooldownFlat;
};

/**
 * Sets the cached fast cooldown flat value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setFastCooldownFlat = function(amount)
{
  this._j._abs._timing._fastCooldownFlat = amount;
};

/**
 * Updates the cached fast cooldown flat value with the latest.
 */
Game_Battler.prototype.updateFastCooldownFlat = function()
{
  // get the current fast cooldown flat modifier.
  const currentFastCooldownFlat = this.fastCooldownFlat();

  // update the fast cooldown flat modifier.
  this.setFastCooldownFlat(currentFastCooldownFlat);
};

/**
 * Gets the cached fast cooldown rate value.
 * @returns {number}
 */
Game_Battler.prototype.getFastCooldownRate = function()
{
  return this._j._abs._timing._fastCooldownRate;
};

/**
 * Sets the cached fast cooldown rate value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setFastCooldownRate = function(amount)
{
  this._j._abs._timing._fastCooldownRate = amount;
};

/**
 * Updates the cached fast cooldown rate value with the latest.
 */
Game_Battler.prototype.updateFastCooldownRate = function()
{
  // get the current fast cooldown rate modifier.
  const currentFastCooldownRate = this.fastCooldownRate();

  // update the fast cooldown rate modifier.
  this.setFastCooldownRate(currentFastCooldownRate);
};

/**
 * Gets the cached cast speed base value.
 * @returns {number}
 */
Game_Battler.prototype.getBaseCastSpeed = function()
{
  return this._j._abs._timing._baseCastSpeed;
};

/**
 * Sets the cached cast speed base value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setBaseCastSpeed = function(amount)
{
  this._j._abs._timing._baseCastSpeed = amount;
};

/**
 * Updates the cached cast speed base value with the latest.
 */
Game_Battler.prototype.updateBaseCastSpeed = function()
{
  // get the current cast speed base modifier.
  const currentBaseCastSpeed = this.baseCastSpeed();

  // update the cast speed base modifier.
  this.setBaseCastSpeed(currentBaseCastSpeed);
};

/**
 * Gets the cached cast speed flat value.
 * @returns {number}
 */
Game_Battler.prototype.getCastSpeedFlat = function()
{
  return this._j._abs._timing._castSpeedFlat;
};

/**
 * Sets the cached cast speed flat value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setCastSpeedFlat = function(amount)
{
  this._j._abs._timing._castSpeedFlat = amount;
};

/**
 * Updates the cached cast speed flat value with the latest.
 */
Game_Battler.prototype.updateCastSpeedFlat = function()
{
  // get the current cast speed flat modifier.
  const currentCastSpeedFlat = this.castSpeedFlat();

  // update the cast speed flat modifier.
  this.setCastSpeedFlat(currentCastSpeedFlat);
};

/**
 * Gets the cached cast speed rate value.
 * @returns {number}
 */
Game_Battler.prototype.getCastSpeedRate = function()
{
  return this._j._abs._timing._castSpeedRate;
};

/**
 * Sets the cached cast speed rate value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setCastSpeedRate = function(amount)
{
  this._j._abs._timing._castSpeedRate = amount;
};

/**
 * Updates the cached cast speed rate value with the latest.
 */
Game_Battler.prototype.updateCastSpeedRate = function()
{
  // get the current cast speed rate modifier.
  const currentCastSpeedRate = this.castSpeedFlat();

  // update the cast speed rate modifier.
  this.setCastSpeedRate(currentCastSpeedRate);
};
//endregion getters & setters & updates

//region cast speed
/**
 * The base cast speed multiplier.
 * A battler's base cast speed defines the default multiplier for how long it takes to cast.
 * @returns {number} The base multiplier for this battler.
 */
Game_Battler.prototype.baseCastSpeed = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // TODO: add to plugin parameters?
  const baseParam = 0;

  // sum together all the csp flat modifiers.
  const baseFcd = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT.TIMING.RegExp.BaseCastSpeed,
    baseParam,
    this);

  // return the sum of base flat csp found.
  return baseFcd;
};

/**
 * Gets the flat modifier for this battler's cast speed.
 * @returns {number}
 */
Game_Battler.prototype.castSpeedFlat = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseCastSpeed();

  // sum together all the csp flat modifiers.
  const cspFlat = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT.TIMING.RegExp.CastSpeedFlat,
    baseParam,
    this);

  // return the sum of flat csp found.
  return cspFlat;
};

/**
 * Gets the multiplier for this battler's cast speed.
 * @returns {number}
 */
Game_Battler.prototype.castSpeedRate = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseCastSpeed();

  // grab the base parameter value.
  const cspRate = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT.TIMING.RegExp.CastSpeedRate,
    baseParam,
    this);

  // return the amount.
  return cspRate;
};

/**
 * Calculates the cast speed based on the various parameters.
 * @param {number} originalCastTime The original cast time in frames.
 * @returns {number} The new amount of frames to wait.
 */
Game_Battler.prototype.applyCastSpeed = function(originalCastTime)
{
  // short circuit for no cast times.
  if (!originalCastTime) return 0;

  // get the base multiplier.
  const baseParam = this.baseCastSpeed();

  // grab the flat modifier.
  const flatModifier = this.castSpeedFlat();

  // grab the multiplier from effective locations.
  const multModifier = this.castSpeedRate();

  // short circuit before calculations if we have no values.
  if (!baseParam && !flatModifier && !multModifier) return originalCastTime;

  // determine the true base value.
  const baseCastTime = (baseParam + flatModifier);

  // determine the true multiplicative value.
  const castTimeMultiplier = ((multModifier + 100) / 100);

  // grab the minimum cooldown value.
  const minimumCastTime = this.minimumCastTime();

  // perform calculation- minimum of 1 frame cooldown time.
  const calculatedCastTime = (originalCastTime * castTimeMultiplier) + baseCastTime;

  // the actual cast time considering the minimum.
  const actualCastTime = Math.max(calculatedCastTime, minimumCastTime);

  // no fractions of frames!
  return Math.round(actualCastTime);
};

/**
 * The minimum cast time for this battler.
 * @returns {number}
 */
Game_Battler.prototype.minimumCastTime = function()
{
  // TODO: parameterize minimum into plugin parameter.
  return 0;
};
//endregion castspeed

//region fast cooldown
/**
 * The base faster cooldown flat modifier.
 * A battler's faster cooldown value will reduce the number of frames
 * required to cooldown after a skill is executed.
 *
 * The mininum number of frames is 1 for a cooldown.
 * @returns {number} The base modifier for this battler.
 */
Game_Battler.prototype.baseFastCooldown = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // TODO: add to plugin parameters?
  const baseParam = 0;

  // sum together all the fcd flat modifiers.
  const baseFcd = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT.TIMING.RegExp.BaseFastCooldown,
    baseParam,
    this);

  // return the sum of base flat fcd found.
  return baseFcd;
};

/**
 * Gets the flat modifier for this battler's fast cooldown.
 * @returns {number}
 */
Game_Battler.prototype.fastCooldownFlat = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseFastCooldown();

  // sum together all the fcd flat modifiers.
  const fcdFlat = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT.TIMING.RegExp.FastCooldownFlat,
    baseParam,
    this);

  // return the sum of flat fcd found.
  return fcdFlat;
};

/**
 * Gets the multiplicative modifier for this battler's fast cooldown.
 * @returns {number}
 */
Game_Battler.prototype.fastCooldownRate = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseFastCooldown();

  // grab the base parameter value.
  const fcdRate = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT.TIMING.RegExp.FastCooldownRate,
    baseParam,
    this);

  // return the amount.
  return fcdRate;
};

/**
 * Calculates the cooldown time based on the various parameters.
 * @param {number} originalCooldownTime The original cooldown time in frames.
 * @returns {number} The new amount of frames to wait.
 */
Game_Battler.prototype.applyFastCooldown = function(originalCooldownTime)
{
  // short circuit before parameter checks if no required cooldown value.
  if (!originalCooldownTime) return 0;

  // get the base value.
  const baseParam = this.baseFastCooldown(); // this.getBaseFastCooldown();

  // grab the flat modifier.
  const flatModifier = this.fastCooldownFlat(); //this.getFastCooldownFlat();

  // grab the multiplicative modifier, and add the base-100 to the value.
  const multModifier = this.fastCooldownRate(); //this.getFastCooldownRate();

  // short circuit before calculations if we have no values.
  if (!baseParam && !flatModifier && !multModifier) return originalCooldownTime;

  // determine the true base value.
  const baseFastCooldown = (baseParam + flatModifier);

  // determine the true multiplicative value.
  const cooldownMultiplier = ((multModifier + 100) / 100);

  // grab the minimum cooldown value.
  const minimumCooldown = this.minimumCooldown();

  // determine the true cooldown value.
  const calculatedCooldown = (originalCooldownTime * cooldownMultiplier) + baseFastCooldown;

  // perform calculation- minimum of 1 frame cooldown time.
  const actualCooldown = Math.max(calculatedCooldown, minimumCooldown);

  // no fractions of frames!
  return Math.round(actualCooldown);
};

/**
 * The minimum cooldown for this battler.
 * @returns {number}
 */
Game_Battler.prototype.minimumCooldown = function()
{
  // TODO: parameterize minimum into plugin parameter.
  return 0;
};
//endregion fast cooldown
//endregion Game_Battler