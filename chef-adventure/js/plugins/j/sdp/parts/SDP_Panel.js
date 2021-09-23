/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] SDP Panel part.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of the SDP system.
 * This class represents a single Stat Distribution Panel (SDP).
 * All data associated with the panels growth and parameters are found here.
 * ============================================================================
 */

/**
 * The class that governs the details of a single SDP.
 */
function StatDistributionPanel() { this.initialize(...arguments); }
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
 */
StatDistributionPanel.prototype.initialize = function(
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
  panelParameters) {
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
StatDistributionPanel.prototype.rankUpCost = function(currentRank) {
  if (currentRank === this.maxRank) {
    return 0;
  } else {
    const growth = Math.floor(this.multGrowthCost * (this.flatGrowthCost * (currentRank + 1)));
    return this.baseCost + growth;
  }
};

/**
 * Retrieves all panel parameters associated with a provided `paramId`.
 * @param {number} paramId The `paramId` to find parameters for.
 * @returns {PanelParameter[]}
 */
StatDistributionPanel.prototype.getPanelParameterById = function(paramId) {
  const panelParameters = this.panelParameters;
  return panelParameters.filter(panelParameter => panelParameter.parameterId === paramId);
};

/**
 * Gets the panel rewards attached to the provided `rank`.
 * @param {number} rank The rank to check and see if there are any rewards for.
 * @returns {PanelRankupReward[]}
 */
StatDistributionPanel.prototype.getPanelRewardsByRank = function(rank) {
  const panelRewards = this.panelRewards;
  return panelRewards.filter(reward => reward.rankRequired === rank);
};

/**
 * Gets whether or not this SDP is unlocked.
 * @returns {boolean} True if this SDP is unlocked, false otherwise.
 */
StatDistributionPanel.prototype.isUnlocked = function() {
  return this.unlocked;
};

/**
 * Sets this SDP to be unlocked.
 */
StatDistributionPanel.prototype.unlock = function() {
  this.unlocked = true;
};

/**
 * Sets this SDP to be locked.
 */
StatDistributionPanel.prototype.lock = function() {
  this.unlocked = false;
};
//ENDFILE