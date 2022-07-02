//#region Difficulty
/**
 * A class governing a single difficulty and the way it impacts the game parameters.
 */
class Difficulty
{
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
   * The base/b-parameter multipliers.
   * The array aligns percent multipliers against the matching index's parameters.
   * @type {[number, number, number, number, number, number, number, number]}
   */
  bparams = [100, 100, 100, 100, 100, 100, 100, 100];

  /**
   * The secondary/s-parameter multipliers.
   * The array aligns percent multipliers against the matching index's parameters.
   * @type {[number, number, number, number, number, number, number, number, number, number]}
   */
  sparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  /**
   * The extraneous/x-parameter multipliers.
   * The array aligns percent multipliers against the matching index's parameters.
   * @type {[number, number, number, number, number, number, number, number, number, number]}
   */
  xparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

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

  /**
   * Whether or not this difficulty is unlocked and available for selection.
   * @type {boolean}
   */
  unlocked = true;

  /**
   * Whether or not this difficulty is hidden from selection.
   * @type {boolean}
   */
  hidden = false;

  /**
   * Gets the b-parameter multiplier for this difficulty.
   * The default is 100.
   * @param {number} paramId The id/index of the parameter.
   * @returns {number}
   */
  bparam(paramId)
  {
    return this.bparams[paramId];
  }

  /**
   * Gets the s-parameter multiplier for this difficulty.
   * The default is 100.
   * @param {number} paramId The id/index of the parameter.
   * @returns {number}
   */
  sparam(paramId)
  {
    return this.sparams[paramId];
  }

  /**
   * Gets the x-parameter multiplier for this difficulty.
   * The default is 100.
   * @param {number} paramId The id/index of the parameter.
   * @returns {number}
   */
  xparam(paramId)
  {
    return this.xparams[paramId];
  }

  /**
   * Determines whether or not this difficulty is unlocked.
   * @returns {boolean}
   */
  isUnlocked()
  {
    return this.unlocked;
  }

  /**
   * Locks this difficulty, making it unavailable for the player to select.
   */
  lock()
  {
    this.unlocked = false;
  }

  /**
   * Unlocks this difficulty, making it available for the player to select.
   */
  unlock()
  {
    this.unlocked = true;
  }

  /**
   * Determines whether or not this difficulty is hidden in the list.
   * @returns {boolean}
   */
  isHidden()
  {
    return this.hidden;
  }

  /**
   * Hides this difficulty, making it no longer listed in the difficulty list.
   */
  hide()
  {
    this.hidden = true;
  }

  /**
   * Unhides this difficulty, making it visible in the dififculty list.
   */
  unhide()
  {
    this.hidden = false;
  }
}
//#endregion Difficulty