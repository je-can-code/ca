/**
 * A model representing the shape of a phase of star battle.
 */
class StarPhase {
  /**
   * @constructor
   * @param {string} name The name of the phase.
   * @param {number} key The number of this phase.
   */
  constructor(name = "", key = 0) {
    this.name = name;
    this.key = key;
  }

  /**
   * The name of this star phase.
   * @type {string}
   */
  name = "";

  /**
   * The numeric order of phase this is.
   * @type {number}
   */
  key = 0;
}

export { StarPhase };