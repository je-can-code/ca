/**
 * A single phase in the stars battle.
 */
class StarPhase {
  /**
   * Constructor.
   * @param {string} name The name of the phase.
   * @param {number} key The number of this phase.
   */
  constructor(name, key) {
    this.name = name;
    this.key = key;
  }

  /**
   * The name of this star phase.
   * @type {string}
   */
  name = String.empty;

  /**
   * The numeric order of phase this is.
   * @type {number}
   */
  key = 0;
}