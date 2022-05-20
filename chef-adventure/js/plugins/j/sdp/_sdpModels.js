/*:
 * @target MZ
 * @plugindesc
 * [v1.1 SDP] The various custom models created for SDP.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-SDP
 * @orderBefore J-SDP
 * @help
 * ============================================================================
 * A component of the SDP system.
 * This is a cluster of all models that honestly deserved their own file, but
 * that is mighty inconvenient for plugin consumers, so now its all in one.
 * ============================================================================
 */

//#region RPG objects
//#region RPG_Enemy
//#region sdpPoints
/**
 * The expiration time in frames for this loot drop.
 * @type {number|null}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpPoints",
  {
    get: function()
    {
      return this.getSdpPoints();
    },
  });

/**
 * Gets the expiration time in frames.
 * @returns {number|null}
 */
RPG_Enemy.prototype.getSdpPoints = function()
{
  return this.extractSdpPoints();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Enemy.prototype.extractSdpPoints = function()
{
  return this.getNumberFromNotesByRegex(J.SDP.RegExp.SdpPoints);
};
//#endregion sdpPoints

//#region sdpDropData
/**
 * Gets the SDP drop data for this enemy.
 *
 * Panels that have already been dropped and collected will not
 * be dropped again.
 *
 * The zeroth index is the string key for the panel being dropped.
 * The first index is 1-100 percent chance for the panel to drop.
 * The second index is the numeric id of the item associated with the panel.
 * @type {[string, number, number]|null}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropData",
  {
    get: function()
    {
      return this.getSdpDropData() ?? [String.empty, 0, 0];
    },
  });

/**
 * Gets the key of the panel being dropped.
 * @type {string}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropKey",
  {
    get: function()
    {
      return this.sdpDropData[0];
    },
  });

/**
 * Gets the drop rate for this panel.
 * @type {number}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropChance",
  {
    get: function()
    {
      return this.sdpDropData[1];
    },
  });

/**
 * Gets the id of the item associated with this panel, if any.
 * @type {number}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropItemId",
  {
    get: function()
    {
      return this.sdpDropData[2] ?? 0;
    },
  });

/**
 * Gets the SDP data for this enemy.
 * @returns {number|null}
 */
RPG_Enemy.prototype.getSdpDropData = function()
{
  return this.extractSdpDropData();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_Enemy.prototype.extractSdpDropData = function()
{
  return this.getArrayFromNotesByRegex(J.SDP.RegExp.SdpDropData, true);
};
//#endregion sdpDropData
//#endregion RPG_Enemy

//#region RPG_Item
/**
 * The SDP key of this item.
 * @type {string}
 */
Object.defineProperty(RPG_DropItem.prototype, "sdpKey",
  {
    get: function()
    {
      return this.getSdpKey();
    },
  });

/**
 * Gets the SDP key of this item.
 * @returns {string}
 */
RPG_DropItem.prototype.getSdpKey = function()
{
  return this._sdpKey;
};

/**
 * Gets the key of this item.
 * @param {string} key The key of the SDP.
 */
RPG_DropItem.prototype.setSdpKey = function(key)
{
  this._sdpKey = key;
};
//#endregion RPG_Item
//#endregion RPG objects

//#region SDP_Panel
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
  const {panelParameters} = this;
  return panelParameters.filter(panelParameter => panelParameter.parameterId === paramId);
};

/**
 * Gets the panel rewards attached to the provided `rank`.
 * @param {number} rank The rank to check and see if there are any rewards for.
 * @returns {PanelRankupReward[]}
 */
StatDistributionPanel.prototype.getPanelRewardsByRank = function(rank) 
{
  const {panelRewards} = this;
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
//#endregion SDP_Panel

//#region SDP_Parameter
/**
 * A class that represents a single parameter and its growth for a SDP.
 */
function PanelParameter() 
{
 this.initialize(...arguments); 
}
PanelParameter.prototype = {};
PanelParameter.prototype.constructor = PanelParameter;

/**
 * Initializes a single panel parameter.
 * @param {number} parameterId The parameter this class represents.
 * @param {number} perRank The amount per rank this parameter gives.
 * @param {boolean} isFlat True if it is flat growth, false if it is percent growth.
 * @param {boolean} isCore True if this is a core parameter, false otherwise.
 */
PanelParameter.prototype.initialize = function({
  parameterId,
  perRank,
  isFlat = false,
  isCore = false,})
{
  /**
   * The id of the parameter this class represents.
   * @type {number}
   */
  this.parameterId = parameterId;

  /**
   * The amount per rank this parameter gives.
   * @type {number}
   */
  this.perRank = perRank;

  /**
   * Whether or not the growth per rank for this parameter is flat or percent.
   * @type {boolean} True if it is flat growth, false if it is percent growth.
   */
  this.isFlat = isFlat;

  /**
   * Whether or not this is a core parameter.
   * Core parameters are emphasized on the SDP scene.
   * @type {boolean} True if it is a core parameter, false otherwise.
   */
  this.isCore = isCore;
};
//#endregion SDP_Parameter

//#region SDP_Ranking
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
  const {maxRank} = panel;
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
//#endregion SDP_Ranking

//#region SDP_RankupReward
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
//#endregion SDP_RankupReward

//ENDOFFILE