//region SoundManager
/**
 * Plays the sound effect provided.
 * @param {RPG_SoundEffect} se The sound effect to play.
 */
SoundManager.playSoundEffect = function(se)
{
  AudioManager.playStaticSe(se);
};
//endregion SoundManager