/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] SDP Rankup Reward part.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of the SDP system.
 * This class represents a single SDP rankup reward.
 * The reward is defined as a string, but it is expected that you, the RM dev,
 * will leverage a single-line javascript command if anything as the reward.
 * ============================================================================
 */

/**
 * A class that represents a single reward for achieving a particular rank in a panel.
 */
function PanelRankupReward()
{
  this.initialize(...arguments);
}

PanelRankupReward.prototype = {};
PanelRankupReward.prototype.constructor = PanelRankupReward;

/**
 * Initializes a single rankup reward.
 * @param {number} rankRequired The rank required.
 * @param {string} effect The effect to execute.
 */
PanelRankupReward.prototype.initialize = function(rankRequired, effect)
{
  /**
   * The rank required for this panel rankup reward to be executed.
   * @type {number}
   */
  this.rankRequired = rankRequired;

  /**
   * The effect to be executed upon reaching the rank required.
   * The effect is captured as javascript.
   * @type {string}
   */
  this.effect = effect;
};
//ENDFILE