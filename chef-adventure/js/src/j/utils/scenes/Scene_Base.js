//region Scene_Base
/**
 * Extends the `.update()` to include a watcher for whether or not
 * the volume toggle button is pressed.
 */
J.UTILS.Aliased.Scene_Base.set('update', Scene_Base.prototype.update);
Scene_Base.prototype.update = function()
{
  // perform original logic.
  J.UTILS.Aliased.Scene_Base.get('update').call(this);

  // check if the volume toggling is happening.
  if (this.isVolumeToggling())
  {
    // then toggle the volume on/off.
    this.toggleVolume();
  }
};

/**
 * Gets whether or not the player is pressing the "volume toggle" button.
 *
 * This button is F6 by default.
 * @returns {boolean}
 */
Scene_Base.prototype.isVolumeToggling = function()
{
  return Input.isTriggered('volumeToggle');
};

/**
 * Flips the volume on or off.
 */
Scene_Base.prototype.toggleVolume = function()
{
  const { bgmVolume, bgsVolume, meVolume, seVolume } = ConfigManager;
  const isMuted = !bgmVolume || !bgsVolume || !meVolume || !seVolume;
  if (isMuted)
  {
    // if one of the channels is muted, unmute everything.
    ConfigManager.bgmVolume = 100;
    ConfigManager.bgsVolume = 100;
    ConfigManager.meVolume = 100;
    ConfigManager.seVolume = 100;
  }
  else
  {
    // otherwise, mute everything.
    ConfigManager.bgmVolume = 0;
    ConfigManager.bgsVolume = 0;
    ConfigManager.meVolume = 0;
    ConfigManager.seVolume = 0;
  }
};
//endregion Scene_Base