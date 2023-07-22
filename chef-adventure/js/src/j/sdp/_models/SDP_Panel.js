//region SDP_Panel
/**
 * The class that governs the details of a single SDP.
 */
function StatDistributionPanel()
{
  this.initialize(...arguments);
}
StatDistributionPanel.prototype = {};
StatDistributionPanel.prototype.constructor = StatDistributionPanel;

/**
 * Initializes a single stat distribution panel.
 * @param {string} name The name that displays in the menu for this panel.
 * @param {string} key The unique identifier for this panel.
 * @param {number} iconIndex The icon index that represents this panel.
 * @param {boolean} unlocked Whether or not this panel is unlocked.
 * @param {string} description The description for this panel.
 * @param {number} maxRank The maximum rank this panel can reach.
 * @param {number} baseCost The base component of the cost formula.
 * @param {number} flatGrowthCost The flat component of the cost formula.
 * @param {number} multGrowthCost The multiplier component of the cost formula.
 * @param {string} topFlavorText The flavor text for this panel, if any.
 * @param {PanelRankupReward[]} panelRewards All rewards associated with this panel.
 * @param {PanelParameter[]} panelParameters All parameters this panel affects.
 * @param {number} rarity The color index representing this panel's rarity.
 */
StatDistributionPanel.prototype.initialize = function({
  name,
  key,
  iconIndex,
  unlocked,
  description,
  maxRank,
  baseCost,
  flatGrowthCost,
  multGrowthCost,
  topFlavorText,
  panelRewards,
  panelParameters,
  rarity,
})
{
  /**
   * Gets the friendly name for this SDP.
   * @type {string}
   */
  this.name = name;

  /**
   * Gets the unique identifier key that represents this SDP.
   * @type {string}
   */
  this.key = key;

  /**
   * Gets the icon index for this SDP.
   * @type {number}
   */
  this.iconIndex = iconIndex;

  /**
   * Gets the color index representing this SDP's rarity.
   * @type {number}
   */
  this.rarity = rarity;

  /**
   * Gets whether or not this SDP is unlocked.
   * @type {boolean}
   */
  this.unlocked = unlocked;

  /**
   * Gets the description for this SDP.
   * @type {string}
   */
  this.description = description;

  /**
   * Gets the maximum rank for this SDP.
   * @type {number}
   */
  this.maxRank = maxRank;

  /**
   * The base cost to rank up this panel.
   * @type {number}
   */
  this.baseCost = baseCost;

  /**
   * The flat amount per rank that the cost will grow.
   * @type {number}
   */
  this.flatGrowthCost = flatGrowthCost;

  /**
   * The multiplicative amount per rank that the cost will grow.
   * @type {number}
   */
  this.multGrowthCost = multGrowthCost;

  /**
   * The description that shows up underneath the name in the details window.
   * @type {string}
   */
  this.topFlavorText = topFlavorText;

  /**
   * The collection of all rewards this panel can grant by ranking it up.
   * @type {PanelRankupReward[]}
   */
  this.panelRewards = panelRewards;

  /**
   * The collection of all parameters that this panel affects when ranking it up.
   * @returns {PanelParameter[]}
   */
  this.panelParameters = panelParameters;
};

/**
 * Calculates the cost of SDP points to rank this panel up.
 * @param {number} currentRank The current ranking of this panel for a given actor.
 * @returns {number}
 */
StatDistributionPanel.prototype.rankUpCost = function(currentRank)
{
  if (currentRank === this.maxRank)
  {
    return 0;
  }
  else
  {
    const growth = Math.floor(this.multGrowthCost * (this.flatGrowthCost * (currentRank + 1)));
    return this.baseCost + growth;
  }
};

/**
 * Retrieves all panel parameters associated with a provided `paramId`.
 * @param {number} paramId The `paramId` to find parameters for.
 * @returns {PanelParameter[]}
 */
StatDistributionPanel.prototype.getPanelParameterById = function(paramId)
{
  const { panelParameters } = this;
  return panelParameters.filter(panelParameter => panelParameter.parameterId === paramId);
};

/**
 * Gets the panel rewards attached to the provided `rank`.
 * @param {number} rank The rank to check and see if there are any rewards for.
 * @returns {PanelRankupReward[]}
 */
StatDistributionPanel.prototype.getPanelRewardsByRank = function(rank)
{
  const { panelRewards } = this;
  return panelRewards.filter(reward => reward.rankRequired === rank);
};

/**
 * Gets whether or not this SDP is unlocked.
 * @returns {boolean} True if this SDP is unlocked, false otherwise.
 */
StatDistributionPanel.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Sets this SDP to be unlocked.
 */
StatDistributionPanel.prototype.unlock = function()
{
  this.unlocked = true;
};

/**
 * Sets this SDP to be locked.
 */
StatDistributionPanel.prototype.lock = function()
{
  this.unlocked = false;
};

StatDistributionPanel.prototype.calculateBonusByRank = function(
  paramId,
  currentRank,
  baseParam = 0,
  fractional = false)
{
  // determine all the applicable panel parameters.
  const panelParameters = this.panelParameters.filter(panelParameter => panelParameter.parameterId === paramId);

  // short circuit if we have no applicable parameters.
  if (!panelParameters.length) return 0;

  // initialize the running value.
  let val = 0;

  // iterate over each matching panel parameter.
  panelParameters.forEach(panelParameter =>
  {
    // grab the per-rank bonus on this panel.
    const { perRank, isFlat } = panelParameter;

    // check if the panel should use the percent or flat formula.
    if (!isFlat)
    {
      // calculate the factor per panel rank.
      const factor = (currentRank * perRank) / 100;

      // add the product to the running total.
      val += (baseParam * factor);
    }
    // it is flat.
    else
    {
      // the flat formula.
      val += (currentRank * perRank);
    }
  });

  // check if this is a non-base parameter like CRI or HRG.
  if (fractional)
  {
    // divide by 100 to create a factor out of it.
    val /= 100;
  }

  // return the total.
  return val;
};
//endregion SDP_Panel