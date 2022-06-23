/**
 * A collection of {@link StarPhase}s that represent the flow of a star battle.
 * @type {StarPhases}
 */
 BattleManager.starPhases = new StarPhases();

/**
 * A constellation of phases in the stars of battle.
 */
class StarPhases
{
  /**
   * "Disengaged" represents the state of which the player is
   * not in-battle at all. This is the default phase while the player wanders.
   * @type {StarPhase}
   */
  static DISENGAGED = new StarPhase("Disengaged", 0);

  /**
   * "Preparing" represents the state of which the player is
   * in-transition to battle from either a random or programmatic encounter.
   * @type {StarPhase}
   */
  static PREPARING = new StarPhase("Preparing", 1);

  /**
   * "In-battle" represents the state of which the player is
   * presently fighting the battle that they encountered.
   * @type {StarPhase}
   */
  static INBATTLE = new StarPhase("In-battle", 2);

  /**
   * "Finished" represents the state of which the player is
   * has reached an end-condition of battle.
   * @type {StarPhase}
   */
  static FINISHED = new StarPhase("Finished", 3);

  /**
   * "Clean-up" represents the state of which the player is
   * either reigning victorious, seeing the "you died" screen, or skipping
   * this phase altogether for programmatic (story/dev/etc.) reasons.
   * @type {StarPhase}
   */
  static CLEANUP = new StarPhase("Clean-up", 4);

  /**
   * "Back-to-map" represents the state of which the player is
   * the player didn't gameover, and is now in transition
   * @type {StarPhase}
   */
  static BACKTOMAP = new StarPhase("Back-to-map", 5);
}