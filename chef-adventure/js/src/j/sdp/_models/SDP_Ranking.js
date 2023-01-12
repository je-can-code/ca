//region SDP_Ranking
/**
 * A class for tracking an actor's ranking in a particular panel.
 */
function PanelRanking()
{
  this.initialize(...arguments);
}

PanelRanking.prototype = {};
PanelRanking.prototype.constructor = PanelRanking;

/**
 * Initializes a single panel ranking for tracking on a given actor.
 * @param {string} key The unique key for the panel to be tracked.
 * @param {number} actorId The id of the actor.
 */
PanelRanking.prototype.initialize = function(key, actorId)
{
  /**
   * The key for this panel ranking.
   * @type {string}
   */
  this.key = key;

  /**
   * The id of the actor that owns this ranking.
   * @type {number}
   */
  this.actorId = actorId;
  this.initMembers();
};

/**
 * Initializes all members of this class.
 */
PanelRanking.prototype.initMembers = function()
{
  /**
   * The current rank for this panel ranking.
   * @type {number}
   */
  this.currentRank = 0;

  /**
   * Whether or not this panel is maxed out.
   * @type {boolean}
   */
  this.maxed = false;
};

/**
 * Ranks up this panel.
 * If it is at max rank, then perform the max effect exactly once
 * and then max the panel out.
 */
PanelRanking.prototype.rankUp = function()
{
  const panel = $gameSystem.getSdpByKey(this.key);
  const { maxRank } = panel;
  if (this.currentRank < maxRank)
  {
    this.currentRank++;
    this.performRepeatRankupEffects();
    this.performCurrentRankupEffects();
  }

  if (this.currentRank === maxRank)
  {
    this.performMaxRankupEffects();
  }
};

/**
 * Gets whether or not this panel is maxed out.
 * @returns {boolean} True if this panel is maxed out, false otherwise.
 */
PanelRanking.prototype.isPanelMaxed = function()
{
  return this.maxed;
};

/**
 * Upon reaching a given rank of this panel, try to perform this `javascript` effect.
 * @param {number} newRank The rank to inspect and execute effects for.
 */
PanelRanking.prototype.performRankupEffects = function(newRank)
{
  const a = $gameActors.actor(this.actorId);
  const rewardEffects = $gameSystem
    .getSdpByKey(this.key)
    .getPanelRewardsByRank(newRank);
  if (rewardEffects.length > 0)
  {
    rewardEffects.forEach(rewardEffect =>
    {
      try
      {
        eval(rewardEffect.effect);
      }
      catch (err)
      {
        console.error(`
        An error occurred while trying to execute the rank-${this.currentRank} 
        reward for panel: ${this.key}`);
        console.error(err);
      }
    });
  }
};

/**
 * Executes any rewards associated with the current rank (used after ranking up typically).
 */
PanelRanking.prototype.performCurrentRankupEffects = function()
{
  this.performRankupEffects(this.currentRank);
};

/**
 * Executes any rewards that are defined as "repeat rankup effects", aka -1 rank.
 */
PanelRanking.prototype.performRepeatRankupEffects = function()
{
  this.performRankupEffects(-1);
};

/**
 * Executes any rewards that are defined as "max rankup effects", aka 0 rank.
 */
PanelRanking.prototype.performMaxRankupEffects = function()
{
  SoundManager.playRecovery();
  this.performRankupEffects(0);
};
//endregion SDP_Ranking