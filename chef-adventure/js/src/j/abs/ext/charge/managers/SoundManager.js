//region SoundManager
/**
 * Extends {@link SoundManager.preloadImportantSounds}.
 * Also preloads the charging-related sound effects.
 */
J.ABS.EXT.CHARGE.Aliased.SoundManager.set('preloadImportantSounds', SoundManager.preloadImportantSounds);
SoundManager.preloadImportantSounds = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.SoundManager.get('preloadImportantSounds').call(this);

  // load our charging sounds.
  this.loadJabsChargingSounds();
};

/**
 * Adds the charging-related sound effects to the list of preloaded sound effects.
 */
SoundManager.loadJabsChargingSounds = function()
{
  // grab the sound effect for charging tier complete.
  const chargeTierComplete = this.chargeTierCompleteSE();

  // grab the sound effect for max charge becoming ready.
  const maxChargeReady = this.maxChargeReadySE();

  // preload em.
  AudioManager.loadStaticSe(chargeTierComplete);
  AudioManager.loadStaticSe(maxChargeReady);
};

/**
 * Plays the sound effect for when a charging tier has completed charging.
 */
SoundManager.playChargeTierCompleteSE = function()
{
  // grab the sound effect for charging tier complete.
  const se = this.chargeTierCompleteSE();

  // play the effect.
  this.playSoundEffect(se);
};

/**
 * Plays the sound effect for when the max charge effect is ready.
 */
SoundManager.playMaxChargeReadySE = function()
{
  // grab the sound effect for the max charge becoming ready.
  const se = this.maxChargeReadySE();

  // play the effect.
  this.playSoundEffect(se);
};

/**
 * The sound effect to play when a charging tier has completed charging.
 * @returns {RPG_SoundEffect}
 */
SoundManager.chargeTierCompleteSE = function()
{
  return new RPG_SoundEffect("Heal6", 40, 130, 0);
};

/**
 * The sound effect to play when the max charge effect is ready.
 * @returns {RPG_SoundEffect}
 */
SoundManager.maxChargeReadySE = function()
{
  return new RPG_SoundEffect("Item3", 50, 110, 0);
};
//endregion SoundManager