/**
 * The structure of the data points required to play a sound effect using the {@link SoundManager}.
 */
class RPG_SoundEffect
{
  /**
   * The name of the sound effect.
   * @type {string}
   */
  name = String.empty;

  /**
   * The L/R adjustment of the sound effect.
   * @type {number}
   */
  pan = 0;

  /**
   * The high/low pitch of the sound effect.
   * @type {number}
   */
  pitch = 100;

  /**
   * The volume of the sound effect.
   * @type {number}
   */
  volume = 100;

  /**
   * Constructor.
   * @param {string} name The name of the sound effect.
   * @param {number} volume The volume of the sound effect.
   * @param {number} pitch The high/low pitch of the sound effect.
   * @param {number} pan The L/R adjustment of the sound effect.
   */
  constructor(name, volume = 100, pitch = 100, pan = 0)
  {
    this.name = name;
    this.pan = pan;
    this.pitch = pitch;
    this.volume = volume;
  }
}