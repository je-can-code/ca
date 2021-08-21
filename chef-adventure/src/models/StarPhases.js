import { StarPhase } from "./StarPhase";

/**
 * "Disengaged" represents the state of which the player is
 * not in-battle at all. This is the default phase while the player wanders.
 * @type {StarPhase}
 */
const DISENGAGED = {
  name: "Disengaged",
  key: 0
};

/**
 * "Preparing" represents the state of which the player is
 * in-transition to battle from either a random or programmatic encounter.
 * @type {StarPhase}
 */
const PREPARING = {
  name: "Preparing",
  key: 1
};

/**
 * "In-battle" represents the state of which the player is
 * presently fighting the battle that they encountered.
 * @type {StarPhase}
 */
const INBATTLE = {
  name: "In-battle",
  key: 2
};

/**
 * "Finished" represents the state of which the player is
 * has reached an end-condition of battle.
 * @type {StarPhase}
 */
const FINISHED = {
  name: "Finished",
  key: 3
};

/**
 * "Clean-up" represents the state of which the player is
 * either reigning victorious, seeing the "you died" screen, or skipping
 * this phase altogether for programmatic (story/dev/etc.) reasons.
 * @type {StarPhase}
 */
const CLEANUP = {
  name: "Clean-up",
  key: 4
};

/**
 * "Back-to-map" represents the state of which the player is
 * the player didn't gameover, and is now in transition
 * @type {StarPhase}
 */
const BACKTOMAP = {
  name: "Back-to-map",
  key: 5
};

export { DISENGAGED, PREPARING, INBATTLE, FINISHED, CLEANUP, BACKTOMAP };

// in case something goes south:
/*
 BattleManager.starPhases = {
  DISENGAGED: {
    name: "Disengaged",
    key: 0
  },

  PREPARING: {
    name: "Preparing",
    key: 1
  },

  INBATTLE: {
    name: "In-battle",
    key: 2
  },

  FINISHED: {
    name: "Finished",
    key: 3
  },

  CLEANUP: {
    name: "Clean-up",
    key: 4
  },

  BACKTOMAP: {
    name: "Back-to-map",
    key: 5
  },
};
*/