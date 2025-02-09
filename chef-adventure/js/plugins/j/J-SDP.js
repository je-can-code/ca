//region SDP_Parameter
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
  parameterId, perRank, isFlat = false, isCore = false,
})
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
//endregion SDP_Parameter

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

  /**
   *
   * @type {boolean}
   */
  this._isUnlocked = false;
};

/**
 * Determines whether or not the associated panel is unlocked.
 * @returns {boolean}
 */
PanelRanking.prototype.isUnlocked = function()
{
  return this._isUnlocked;
};

/**
 * Flags the associated panel as "unlocked".
 */
PanelRanking.prototype.unlock = function()
{
  this._isUnlocked = true;
};

/**
 * Ranks up this panel.
 * If it is at max rank, then perform the max effect exactly once
 * and then max the panel out.
 */
PanelRanking.prototype.rankUp = function()
{
  const panel = J.SDP.Metadata.panelsMap.get(this.key);
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

PanelRanking.prototype.normalizeRank = function()
{
  const panel = J.SDP.Metadata.panelsMap.get(this.key);
  const { maxRank } = panel;
  if (this.currentRank > maxRank)
  {
    this.currentRank = maxRank;
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
  // identify the rewards.
  const rewardEffects = J.SDP.Metadata.panelsMap.get(this.key)
    .getPanelRewardsByRank(newRank);

  // if there are no rewards, then stop processing.
  if (rewardEffects.length === 0) return;

  // establish that "a" is the actor performing the rank up.
  const a = $gameActors.actor(this.actorId);

  // iterate over each of the rewards and execute them.
  rewardEffects.forEach(rewardEffect =>
  {
    // these are raw javascript rewards, so execute them as safely as we can lol.
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
  this.maxed = true;
  SoundManager.playRecovery();
  this.performRankupEffects(0);
};
//endregion SDP_Ranking

//region SDP_RankupReward
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
 * @param {string} rewardName The name to display for this reward.
 * @param {number} rankRequired The rank required.
 * @param {string} effect The effect to execute.
 */
PanelRankupReward.prototype.initialize = function(rewardName, rankRequired, effect)
{
  /**
   * The name of this reward that shows up in the SDP scene.
   * @type {string}
   */
  this.rewardName = rewardName;

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
//endregion SDP_RankupReward

//region PanelRarity
class PanelRarity
{
  /**
   * Common SDPs that bring few pros and many cons.
   * @type {"Common"}
   */
  static Common = "Common";

  /**
   * Magical SDPs that are usually fairly balanced.
   * @type {"Magical"}
   */
  static Magical = "Magical";

  /**
   * Rare SDPs that are skewed in favor of the player granting many positives.
   * @type {"Rare"}
   */
  static Rare = "Rare";

  /**
   * Epic SDPs that make a significant difference if the player chooses to
   * master it.
   * @type {"Epic"}
   */
  static Epic = "Epic";

  /**
   * Legendary SDPs that can easily make-or-break the flow of battle with the
   * immense boons they bring.
   * @type {"Legendary"}
   */
  static Legendary = "Legendary";

  /**
   * Godlike SDPs that are few and far between, because they are tremendously
   * imbalanced in favor of the player. The player would be a fool to not master
   * this as soon as possible.
   * @type {string}
   */
  static Godlike = "Godlike";

  /**
   * Convert the string form of an SDP's rarity into a color index.
   * @param {string} rarity The word associated with the rarity.
   * @returns {number}
   */
  static fromRarityToColor(rarity)
  {
    switch (rarity)
    {
      case this.Common:
        return 0;
      case this.Magical:
        return 3;
      case this.Rare:
        return 23;
      case this.Epic:
        return 31;
      case this.Legendary:
        return 20;
      case this.Godlike:
        return 25;
      default:
        console.warn("if modifying the rarity dropdown options, be sure to fix them here, too.");
        console.warn(`${rarity} was not an implemented option.`);
        return 0;
    }
  }
}

//endregion PanelRarity

//region SDP_RankupReward
/**
 * A class that represents a single tracking of a panel being unlocked.
 */
function PanelTracking(key, unlockedByDefault)
{
  this.initialize(...arguments);
}

PanelTracking.prototype = {};
PanelTracking.prototype.constructor = PanelTracking;

/**
 * Initializes a single panel tracking.
 * @param {string} panelKey The key of the panel tracked.
 * @param {boolean} unlockedByDefault Whether or not unlocked by default.
 */
PanelTracking.prototype.initialize = function(panelKey, unlockedByDefault)
{
  /**
   * The key of this panel that is being tracked.
   * @type {string}
   */
  this.key = panelKey;

  /**
   * True if the panel associated with this key is unlocked,
   * false otherwise.
   * @type {boolean}
   */
  this.unlocked = unlockedByDefault;
};

/**
 * Checks whether or not this tracked panel has been unlocked.
 * @return {boolean}
 */
PanelTracking.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Unlocks this panel in tracking, allowing party members to put points
 * towards it and rank it up.
 */
PanelTracking.prototype.unlock = function()
{
  this.unlocked = true;
};

/**
 * Locks this panel in tracking, preventing party members from putting
 * any additional points into it.
 */
PanelTracking.prototype.lock = function()
{
  this.unlocked = false;
};
//endregion SDP_RankupReward

//region SDP_Panel
/**
 * The class that governs the details of a single SDP.
 */
class StatDistributionPanel
{
  constructor(name,
    key,
    iconIndex,
    rarity,
    unlockedByDefault,
    description,
    topFlavorText,
    maxRank,
    baseCost,
    flatGrowthCost,
    multGrowthCost,
    panelParameters,
    panelRewards)
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
     * Gets whether or not this SDP is unlocked by default.
     * @type {boolean}
     */
    this.unlockedByDefault = unlockedByDefault;

    /**
     * Gets the description for this SDP.
     * @type {string}
     */
    this.description = description;

    /**
     * The description that shows up underneath the name in the details window.
     * @type {string}
     */
    this.topFlavorText = topFlavorText;

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
     * The collection of all parameters that this panel affects when ranking it up.
     * @returns {PanelParameter[]}
     */
    this.panelParameters = panelParameters;

    /**
     * The collection of all rewards this panel can grant by ranking it up.
     * @type {PanelRankupReward[]}
     */
    this.panelRewards = panelRewards;
  }

  /**
   * Calculates the cost of SDP points to rank this panel up.
   * @param {number} currentRank The current ranking of this panel for a given actor.
   * @returns {number}
   */
  rankUpCost(currentRank)
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
  }

  /**
   * Retrieves all panel parameters associated with a provided `paramId`.
   * @param {number} paramId The `paramId` to find parameters for.
   * @returns {PanelParameter[]}
   */
  getPanelParameterById(paramId)
  {
    const { panelParameters } = this;
    return panelParameters.filter(panelParameter => panelParameter.parameterId === paramId);
  }

  /**
   * Gets the panel rewards attached to the provided `rank`.
   * @param {number} rank The rank to check and see if there are any rewards for.
   * @returns {PanelRankupReward[]}
   */
  getPanelRewardsByRank(rank)
  {
    const { panelRewards } = this;
    return panelRewards.filter(reward => reward.rankRequired === rank);
  }

  /**
   * Gets whether or not this SDP is unlocked.
   * @returns {boolean} True if this SDP is unlocked, false otherwise.
   */
  isUnlocked()
  {
    return $gameParty.getSdpTrackingByKey(this.key)
      .isUnlocked();
  }

  /**
   * Sets this SDP to be unlocked.
   */
  unlock()
  {
    $gameParty.unlockSdp(this.key);
  }

  /**
   * Sets this SDP to be locked.
   */
  lock()
  {
    $gameParty.lockSdp(this.key);
  }

  calculateBonusByRank(paramId, currentRank, baseParam = 0, fractional = false)
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
  }

  /**
   * Gets the rarity, aka the color index of the rarity of this panel.
   * @returns {number}
   */
  getPanelRarityColorIndex()
  {
    return this.rarity;
  }

  /**
   * Gets the text associated with the rarity of this panel.
   * @returns {string}
   */
  getPanelRarityText()
  {
    switch (this.rarity)
    {
      case 0:
        return "Common";
      case 3:
        return "Magical";
      case 23:
        return "Rare";
      case 31:
        return "Epic";
      case 20:
        return "Legendary";
      case 25:
        return "Godlike";
      default:
        return `unknown rarity: [ ${this.rarity} ]`;
    }
  }

  static Builder = class SDPBuilder
  {
    //region properties
    static #name = String.empty;
    static #key = String.empty;
    static #iconIndex = 0;
    static #rarity = 0;
    static #unlockedByDefault = false;
    static #description = String.empty;
    static #flavorText = String.empty;
    static #maxRank = 1;
    static #baseCost = 0;
    static #flatGrowth = 0;
    static #multGrowth = 1.0;
    static #parameters = [];
    static #rewards = [];

    //endregion properties

    /**
     * Builds the WIP SDP.
     * @return {StatDistributionPanel}
     */
    static build()
    {
      // build the panel based off current parameters.
      const sdp = new StatDistributionPanel(this.#name,
        this.#key,
        this.#iconIndex,
        this.#rarity,
        this.#unlockedByDefault,
        this.#description,
        this.#flavorText,
        this.#maxRank,
        this.#baseCost,
        this.#flatGrowth,
        this.#multGrowth,
        this.#parameters,
        this.#rewards);

      // wipe all the existing parameters.
      this.#clear();

      // return the built object.
      return sdp;
    }

    //region setters
    static #clear()
    {
      this.#name = String.empty;
      this.#key = String.empty;
      this.#iconIndex = 0;
      this.#unlockedByDefault = false;
      this.#description = String.empty;
      this.#flavorText = String.empty;
      this.#maxRank = 1;
      this.#baseCost = 0;
      this.#flatGrowth = 0;
      this.#multGrowth = 1.0;
      this.#rarity = 0;
      this.#parameters = [];
      this.#rewards = [];
    }

    static name(name)
    {
      this.#name = name;
      return this;
    }

    static key(key)
    {
      this.#key = key;
      return this;
    }

    static iconIndex(iconIndex)
    {
      this.#iconIndex = iconIndex;
      return this;
    }

    static unlockedByDefault(unlockedByDefault)
    {
      this.#unlockedByDefault = unlockedByDefault;
      return this;
    }

    static description(description)
    {
      this.#description = description;
      return this;
    }

    static flavorText(flavorText)
    {
      this.#flavorText = flavorText;
      return this;
    }

    static maxRank(maxRank)
    {
      this.#maxRank = maxRank;
      return this;
    }

    static baseCost(baseCost)
    {
      this.#baseCost = baseCost;
      return this;
    }

    static flatGrowth(flatGrowth)
    {
      this.#flatGrowth = flatGrowth;
      return this;
    }

    static multGrowth(multGrowth)
    {
      this.#multGrowth = multGrowth;
      return this;
    }

    static rarity(rarity)
    {
      this.#rarity = rarity;
      return this;
    }

    static parameters(parameters)
    {
      this.#parameters = parameters;
      return this;
    }

    static rewards(rewards)
    {
      this.#rewards = rewards;
      return this;
    }

    //endregion setters
  }
}

//endregion SDP_Panel

//region Introduction
/* eslint-disable */
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.1 SDP] Enables the SDP system, aka Stat Distribution Panels.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-DropsControl
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-Speed
 * @orderAfter J-DropsControl
 * @orderAfter J-CriticalFactors
 * @orderAfter J-Proficiency
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is a form of "stat distribution"- an alternative to the standard
 * of leveling up to raise an actor's stats.
 *
 * Integrates with others of mine plugins:
 * - J-DropsControl; enables usage of item-as-panel drops.
 * - J-ABS; enemies will individually drop their points and panels.
 * - J-ABS-Speed; enables usage of Movespeed Boost as a parameter on panels.
 * - J-CriticalFactors; enables usage of CDM/CDR as parameters on panels.
 * - J-Proficiency; enables usage of Proficiency+ as a parameter on panels.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This system allows the player's party to unlock "stat distribution panels"
 * (aka SDPs), by means of plugin command.
 *
 * The scene to manage unlocked SDPs is accessible via the menu, the JABS
 * quick menu, or via plugin command.
 *
 * Each SDP has the following:
 * - 1+ parameters (of the 27 available in RMMZ) with flat/percent growth.
 * - A fixed rank max.
 * - A relatively customizable formula to determine cost to rank up.
 * - Customizable name/icon/description1/description2.
 * - Rank up rewards for any/every/max rank, which can be most anything.
 *
 * In order to rank up these SDPs, you'll need to use SDP points. These can be
 * acquired by using the tags below, or by using plugin commands.
 *
 * NOTES:
 * - SDP points gained from enemies are earned for all members of the party.
 * - SDP points are stored and spent on a per-actor basis.
 * - SDP points for an actor cannot be reduced below 0.
 * - Stat Distribution Panels are unlocked for all members of the party.
 * - Stat Distribution Panel rewards can unlock other panels.
 *
 * IMPORTANT NOTE:
 * The SDP data is derived from an external file rather than the plugin's
 * parameters. This file lives in the "/data" directory of your project, and
 * is called "config.sdp.json". You can absolutely generate/modify this file
 * by hand, but you'll probably want to visit my github and swipe the
 * rmmz-data-editor project I've built that provides a convenient GUI for
 * generating and modifying SDPs in just about every way you could need.
 *
 * If this configuration file is missing, the game will not run.
 *
 * Additionally, due to the way RMMZ base code is designed, by loading external
 * files for configuration like this, a project made with this plugin will
 * simply crash when attempting to load in a web context with an error akin to:
 *    "ReferenceError require is not defined"
 * This error is a result of attempting to leverage nodejs's "require" loader
 * to load the "fs" (file system) library to then load the plugin's config
 * file. Normally a web deployed game will alternatively use "forage" instead
 * to handle things that need to be read or saved, but because the config file
 * is just that- a file sitting in the /data directory rather than loaded into
 * forage storage- it becomes unaccessible.
 * ----------------------------------------------------------------------------
 * NOTE ABOUT PANEL NAMES:
 * Generally speaking, you can name your chosen panels (described in the
 * configuration file mentioned above) whatever you want- with a couple of
 * exceptions for organizational purposes within the JMZ Data Editor.
 *
 * If a panel starts with any of the following characters:
 * - "__" (double underscore)
 * - "--" (double hyphen/dash)
 * - "==" (double equals)
 * Then the panel will not be included in the list that is parsed from the
 * configuration file upon starting the game.
 * ============================================================================
 * SDP POINTS:
 * Ever want enemies to drop SDP Points? Well now they can! By applying the
 * appropriate tag to the enemy/enemies in question, you can have enemies drop
 * as little or as much as you want them to.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <sdp:POINTS>
 *
 * TAG EXAMPLES:
 *  <sdp:10>
 * The party will gain 10 SDP points from defeating this enemy.
 *
 *  <sdp:123456>
 * The party will gain 123456 SDP points from defeating this enemy.
 * ============================================================================
 * SDP MULTIPLIERS:
 * Ever want allies to gain some percentage amount more (or less) of the SDP
 * points earned from enemies? Well now you can! By applying the appropriate
 * tag to the various database locations applicable, you can gain a percentage
 * bonus/penalty amount of SDP points obtained!
 *
 * NOTE:
 * The format implies that you will be providing whole numbers and not actual
 * multipliers, like 1.3 or something. If multiple tags are present across the
 * various database locations on a single actor, they will stack additively.
 * SDP points cannot be reduced below 0 for an actor, but they most certainly
 * can receive negative amounts if the tags added up like that.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <sdpMultiplier:AMOUNT>    (for positive)
 *  <sdpMultiplier:-AMOUNT>   (for negative)
 *
 * TAG EXAMPLES:
 *  <sdpMultiplier:25>
 * An actor with something equipped/applied that has the above tag will now
 * gain 25% increased SDP points.
 *
 *  <sdpMultiplier:80>
 *  <sdpMultiplier:-30>
 * An actor with something equipped/applied that has both of the above tags
 * will now gain 50% increased SDP points (80 - 30 = 50).
 * ============================================================================
 * CHANGELOG:
 * - 2.0.1
 *    Added filter for skipping panels that start with particular characters.
 *    Retroactively added note about breaking web deploys for this plugin.
 * - 2.0.0
 *    THIS UPDATE BREAKS WEB DEPLOY FUNCTIONALITY FOR YOUR GAME.
 *    Major breaking changes related to plugin parameters.
 *    Updated to extend common plugin metadata patterns.
 *    Panel data is now strictly data.
 *    Rankings of panels are stored on the actor as save data.
 *    Now loads panel data from external file.
 *    Panels being unlocked/locked are stored on the party.
 *    Updated SDP scene to display rewards.
 *    Updated SDP rewards to have names.
 * - 1.3.0
 *    Added new tag for unlocking panels on use of item.
 * - 1.2.3
 *    Updated JABS menu integration with help text.
 * - 1.2.2
 *    Updated sdp drop production to use drop item builder.
 * - 1.2.1
 *    Update to add tracking for total gained sdp points.
 *    Update to add tracking for total spent sdp points.
 * - 1.2.0
 *    Update to include Max TP as a valid panel parameter.
 * - 1.1.0
 *    Update to accommodate J-CriticalFactors.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param SDPconfigs
 * @text SDP SETUP
 *
 * @param menuSwitch
 * @parent SDPconfigs
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 104
 *
 * @param sdpIcon
 * @parent SDPconfigs
 * @type number
 * @text Points Icon
 * @desc The default icon index to represent "SDP points".
 * Use the context menu to easily select an index.
 * @default 306
 *
 * @param victoryText
 * @parent SDPconfigs
 * @type string
 * @text Victory Text
 * @desc The text appended to text as seen in the default.
 * This text usually shows up after a battle is won.
 * @default SDP points earned!
 *
 * @param menuCommandName
 * @parent SDPconfigs
 * @type string
 * @text Menu Name
 * @desc The text to show as the name of this command in menus.
 * @default Distribute
 *
 * @param menuCommandIcon
 * @parent SDPconfigs
 * @type number
 * @text Menu Icon
 * @desc The icon to show next to the command in the menu.
 * Use the context menu to easily select an index.
 * @default 2563
 *
 *
 * @param JABSconfigs
 * @text JABS-ONLY CONFIG
 * @desc Without JABS, these configurations are irrelevant.
 *
 * @param showInBoth
 * @parent JABSconfigs
 * @type boolean
 * @desc If ON, then show in both JABS quick menu and main menu, otherwise only JABS quick menu.
 * @default false
 *
 * @command Call SDP Menu
 * @text Access the SDP Menu
 * @desc Calls the SDP Menu directly via plugin command.
 *
 * @command Unlock SDP
 * @text Unlock Panel(s)
 * @desc Unlocks a new panel for the player to level up by its key. Key must exist in the SDPs list above.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the SDPs that will be unlocked.
 *
 * @command Lock SDP
 * @text Lock Panel(s)
 * @desc Locks a SDP by its key. Locked panels do not appear in the list nor affect the player's parameters.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the SDPs that will be locked.
 *
 * @command Modify SDP points
 * @text Add/Remove SDP points
 * @desc Adds or removes a designated amount of points from an actor.
 * @arg actorId
 * @type actor
 * @desc The actor to modify the points of.
 * @arg sdpPoints
 * @type number
 * @min -99999999
 * @desc The number of points to modify by. Negative will remove points. Cannot go below 0.
 *
 * @command Modify party SDP points
 * @text Add/Remove party's SDP points
 * @desc Adds or removes a designated amount of points from all members of the current party.
 * @arg sdpPoints
 * @type number
 * @min -99999999
 * @desc The number of points to modify by. Negative will remove points. Cannot go below 0.
 */
/* eslint-enable */

//region plugin metadata
class J_SdpPluginMetadata extends PluginMetadata
{
  /**
   * The path where the config for panels is located.
   * @type {string}
   */
  static CONFIG_PATH = 'data/config.sdp.json';

  /**
   * Converts the JSON-parsed blob into classified {@link StatDistributionPanel}s.
   * @param {any} parsedBlob The already-parsed JSON blob.
   * @return {StatDistributionPanel[]} The blob with all data converted into proper classes.
   */
  static classifyPanels(parsedBlob)
  {
    const parsedPanels = [];

    const foreacher = parsedPanel =>
    {
      // validate the name is not one of the organizational names for the editor-only.
      const panelName = parsedPanel.name;
      if (panelName.startsWith("__")) return;
      if (panelName.startsWith("==")) return;
      if (panelName.startsWith("--")) return;

      // destructure the details we care about.
      const { panelParameters, panelRewards } = parsedPanel;

      // parse and assign all the various panel parameters.
      const parsedPanelParameters = [];
      panelParameters.forEach(paramBlob =>
      {
        const parsedParameter = paramBlob;
        const panelParameter = new PanelParameter({
          parameterId: parseInt(parsedParameter.parameterId),
          perRank: parseFloat(parsedParameter.perRank),
          isFlat: parsedParameter.isFlat,
          isCore: parsedParameter.isCore,
        });
        parsedPanelParameters.push(panelParameter);
      });

      // parse out all the panel rewards if there are any.
      const parsedPanelRewards = [];
      if (panelRewards)
      {
        panelRewards.forEach(reward =>
        {
          const parsedReward = reward;
          const panelReward = new PanelRankupReward(parsedReward.rewardName,
            parseInt(parsedReward.rankRequired),
            parsedReward.effect);
          parsedPanelRewards.push(panelReward);
        });
      }

      // create the panel.
      const panel = StatDistributionPanel.Builder
        .name(parsedPanel.name)
        .key(parsedPanel.key)
        .iconIndex(parseInt(parsedPanel.iconIndex))
        .rarity(parsedPanel.rarity)
        .unlockedByDefault(parsedPanel.unlockedByDefault)
        .description(parsedPanel.description)
        .flavorText(parsedPanel.topFlavorText)
        .maxRank(parseInt(parsedPanel.maxRank))
        .baseCost(parseInt(parsedPanel.baseCost))
        .flatGrowth(parseInt(parsedPanel.flatGrowthCost))
        .multGrowth(parseFloat(parsedPanel.multGrowthCost))
        .parameters(parsedPanelParameters)
        .rewards(parsedPanelRewards)
        .build();

      parsedPanels.push(panel);
    }

    // build an SDP from each parsed item provided.
    parsedBlob.forEach(foreacher, this);

    return parsedPanels;
  }

  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize the panels from plugin configuration.
    this.initializePanels();

    // initialize the other miscellaneous plugin configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the SDPs that exist in the SDP configuration.
   */
  initializePanels()
  {
    // parse the files as an actual list of objects from the JSON configuration.
    const parsedPanels = JSON.parse(StorageManager.fsReadFile(J_SdpPluginMetadata.CONFIG_PATH));
    if (parsedPanels === null)
    {
      console.error('no SDP configuration was found in the /data directory of the project.');
      console.error('Consider adding configuration using the J-MZ data editor, or hand-writing one.');
      throw new Error('SDP plugin is being used, but no config file is present.');
    }

    // classify each panel.
    const classifiedPanels = J_SdpPluginMetadata.classifyPanels(parsedPanels.sdps);

    /**
     * The collection of all defined SDPs.
     * @type {StatDistributionPanel[]}
     */
    this.panels = classifiedPanels;

    const panelMap = new Map();
    this.panels.forEach(panel => panelMap.set(panel.key, panel));

    /**
     * A key:panel map of all defined SDPs.
     * @type {Map<string, StatDistributionPanel>}
     */
    this.panelsMap = panelMap;

    console.log(`loaded:
      - ${this.panels.length} panels
      from file ${J_SdpPluginMetadata.CONFIG_PATH}.`);
  }

  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible
     * in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menuSwitch']);

    /**
     * The icon index that represents the system itself.
     * Used as the icon for costs and currency.
     * @type {number}
     */
    this.sdpIconIndex = parseInt(this.parsedPluginParameters['sdpIcon']);

    /**
     * The text displayed upon victory during a battle-end victory scene.
     */
    this.victoryText = this.parsedPluginParameters['victoryText'];

    /**
     * The name used for the command when visible in a menu.
     * @type {string}
     */
    this.commandName = this.parsedPluginParameters['menuCommandName'] ?? 'Distribute';

    /**
     * The icon used alongside the command's name when visible in the menu.
     * @type {number}
     */
    this.commandIconIndex = parseInt(this.parsedPluginParameters['menuCommandIcon']);

    /**
     * When JABS is enabled, this menu is removed from the main menu and added instead
     * to the quick menu. If this is set to true, then access to the menu will be re-added
     * to the main menu again.<br>
     *
     * Both menus are shown/hidden by the menu switch id.
     * @type {boolean}
     */
    this.jabsShowInBothMenus = this.parsedPluginParameters['showInBoth'] === "true";
  }
}

//endregion plugin metadata

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.3';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.SDP = {};

/**
 * The metadata associated with this plugin.
 */
J.SDP.Metadata = new J_SdpPluginMetadata('J-SDP', '2.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.SDP.Aliased = {
  BattleManager: new Map(),
  DataManager: new Map(),
  JABS_Engine: new Map(),
  TextManager: new Map(),
  IconManager: new Map(),

  Game_Action: new Map(),
  Game_Actor: new Map(),
  Game_Enemy: new Map(),
  Game_Party: new Map(),
  Game_Switches: new Map(),
  Game_System: new Map(),

  Scene_Map: new Map(),
  Scene_Menu: new Map(),

  Window_AbsMenu: new Map(),
  Window_MenuCommand: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.SDP.RegExp = {
  SdpPoints: /<sdpPoints:[ ]?([0-9]*)>/i,
  SdpMultiplier: /<sdpMultiplier:[ ]?([-.\d]+)>/i,
  SdpDropData: /<sdpDropData:[ ]?(\[[-\w]+,[ ]?\d+(:?,[ ]?\d+)?])>/i,
  SdpUnlockKey: /<sdpUnlock:(.+)>/i,
};
//endregion Introduction

//region plugin commands
/**
 * Plugin command for calling the SDP scene/menu.
 */
PluginManager.registerCommand(J.SDP.Metadata.name, "Call SDP Menu", () =>
{
  Scene_SDP.callScene();
});

/**
 * Plugin command for unlocking a SDP to be leveled.
 */
PluginManager.registerCommand(J.SDP.Metadata.name, "Unlock SDP", args =>
{
  const { keys } = args;
  const panelKeys = JSON.parse(keys);
  panelKeys.forEach(key => $gameParty.unlockSdp(key));
});

/**
 * Plugin command for locking a SDP to no longer be available for the player.
 */
PluginManager.registerCommand(J.SDP.Metadata.name, "Lock SDP", args =>
{
  const { keys } = args;
  const panelKeys = JSON.parse(keys);
  panelKeys.forEach(key => $gameParty.lockSdp(key));
});

/**
 * Plugin command for modifying an actor's SDP points.
 */
PluginManager.registerCommand(J.SDP.Metadata.name, "Modify SDP points", args =>
{
  const { actorId, sdpPoints } = args;
  const parsedActorId = parseInt(actorId);
  const parsedSdpPoints = parseInt(sdpPoints);
  $gameActors
    .actor(parsedActorId)
    .modSdpPoints(parsedSdpPoints);
});

/**
 * Plugin command for modifying all current party members' SDP points.
 */
PluginManager.registerCommand(J.SDP.Metadata.name, "Modify party SDP points", args =>
{
  const { sdpPoints } = args;
  const parsedSdpPoints = parseInt(sdpPoints);
  $gameParty.members()
    .forEach(member => member.modSdpPoints(parsedSdpPoints));
});
//endregion plugin commands

//region RPG_Item
/**
 * The SDP key of this item.
 * @type {string}
 */
Object.defineProperty(RPG_DropItem.prototype, "sdpKey", {
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

/**
 * Checks whether or not this drop item is a stat distribution panel drop.
 * @returns {boolean} True if this is a panel drop, false otherwise.
 */
RPG_DropItem.prototype.isSdpDrop = function()
{
  return !!this._sdpKey;
};
//endregion RPG_Item

//region RPG_Enemy
//region sdpPoints
/**
 * The number of SDP points this enemy will yield upon defeat.
 * @type {number|null}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpPoints", {
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
//endregion sdpPoints

//region sdpDropData
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
Object.defineProperty(RPG_Enemy.prototype, "sdpDropData", {
  get: function()
  {
    return this.getSdpDropData() ?? [ String.empty, 0, 0 ];
  },
});

/**
 * Gets the key of the panel being dropped.
 * @type {string}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropKey", {
  get: function()
  {
    return this.sdpDropData[0];
  },
});

/**
 * Gets the drop rate for this panel.
 * @type {number}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropChance", {
  get: function()
  {
    return this.sdpDropData[1];
  },
});

/**
 * Gets the id of the item associated with this panel, if any.
 * @type {number}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropItemId", {
  get: function()
  {
    return this.sdpDropData[2] ?? 0;
  },
});

/**
 * Gets the SDP data for this enemy.
 * @returns {[string, number, number]|null}
 */
RPG_Enemy.prototype.getSdpDropData = function()
{
  return this.extractSdpDropData();
};

/**
 * Extracts the value from the notes.
 * @returns {[string, number, number]|null}
 */
RPG_Enemy.prototype.extractSdpDropData = function()
{
  return this.getArrayFromNotesByRegex(J.SDP.RegExp.SdpDropData, true);
};
//endregion sdpDropData
//endregion RPG_Enemy

//region RPG_Item
/**
 * The SDP key that this item unlocks upon use.
 * @type {string}
 */
Object.defineProperty(RPG_Item.prototype, "sdpKey", {
  get: function()
  {
    return this.getSdpKey();
  },
});

/**
 * Gets the key of the SDP this item unlocks.
 * @returns {string}
 */
RPG_Item.prototype.getSdpKey = function()
{
  return this.getStringFromNotesByRegex(J.SDP.RegExp.SdpUnlockKey);
};
//endregion RPG_Item

//region BattleManager
/**
 * Extends {@link #makeRewards}.<br>
 * Also includes the SDP points earned.
 */
J.SDP.Aliased.BattleManager.set('makeRewards', BattleManager.makeRewards);
BattleManager.makeRewards = function()
{
  // perform original logic.
  J.SDP.Aliased.BattleManager.get('makeRewards')
    .call(this);

  // extend the rewards to include SDP points.
  this._rewards = {
    ...this._rewards, sdp: $gameTroop.sdpTotal(),
  };
};

/**
 * Extends {@link #gainRewards}.<br>
 * Also gain the SDP points earned.
 */
J.SDP.Aliased.BattleManager.set('gainRewards', BattleManager.gainRewards);
BattleManager.gainRewards = function()
{
  // perform original logic.
  J.SDP.Aliased.BattleManager.get('gainRewards')
    .call(this);

  // also gain the SDP rewards.
  this.gainSdpPoints();
};

/**
 * Performs a gain of the SDP points for all members of the party after battle.
 */
BattleManager.gainSdpPoints = function()
{
  // extract the SDP points earned.
  const { sdp } = this._rewards;

  // iterate over each member and add the points.
  $gameParty.members()
    .forEach(member => member.modSdpPoints(sdp));
};

/**
 * Extends {@link #displayRewards}.<br>
 * Also displays the SDP victory text.
 */
J.SDP.Aliased.BattleManager.set('displayRewards', BattleManager.displayRewards);
BattleManager.displayRewards = function()
{
  // also display SDP rewards.
  this.displaySdp();

  // perform original logic.
  J.SDP.Aliased.BattleManager.get('displayRewards')
    .call(this);
};

/**
 * Displays the SDP victory text in the victory log.
 */
BattleManager.displaySdp = function()
{
  // extract the SDP points earned.
  const { sdp } = this._rewards;

  // if there were no SDP rewards, don't display anything.
  if (sdp <= 0) return;

  // define the message to add.
  const text = `\\. ${sdp} ${J.SDP.Metadata.victoryText}`;

  // and add it to the log.
  $gameMessage.add(text);
};
//endregion BattleManager

//region IconManager
/**
 * Extend {@link #longParam}.<br>
 * First checks if the paramId was the SDP multiplier before checking others.
 */
J.SDP.Aliased.IconManager.set('longParam', IconManager.longParam)
IconManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 33:
      return this.sdpMultiplier(); // sdp
    default:
      return J.SDP.Aliased.IconManager.get('longParam')
        .call(this, paramId);
  }
};

/**
 * Gets the icon index for the SDP multiplier.
 * @return {number}
 */
IconManager.sdpMultiplier = function()
{
  return 2229;
};
//endregion IconManager

//region JABS_Engine
if (J.ABS)
{
  /**
   * Extends the basic rewards from defeating an enemy to also include SDP points.
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  J.SDP.Aliased.JABS_Engine.set('gainBasicRewards', JABS_Engine.prototype.gainBasicRewards);
  JABS_Engine.prototype.gainBasicRewards = function(enemy, actor)
  {
    // perform original logic.
    J.SDP.Aliased.JABS_Engine.get('gainBasicRewards')
      .call(this, enemy, actor);

    // grab the sdp points value.
    let sdpPoints = enemy.sdpPoints();

    // if we have no points, then no point in continuing.
    if (!sdpPoints) return;

    // get the scaling multiplier if any exists.
    const levelMultiplier = this.getRewardScalingMultiplier(enemy, actor);

    // round up in favor of the player to skip decimals from the multiplier.
    sdpPoints = Math.ceil(sdpPoints * levelMultiplier);

    // gain the value calculated.
    this.gainSdpReward(sdpPoints, actor);

    // generate a log for the SDP gain.
    this.createSdpLog(sdpPoints, actor);
  };

  /**
   * Gains SDP points from battle rewards.
   * @param {number} sdpPoints The SDP points to gain.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  JABS_Engine.prototype.gainSdpReward = function(sdpPoints, actor)
  {
    // don't do anything if the enemy didn't grant any sdp points.
    if (!sdpPoints) return;

    // sdp points are obtained by all members in the party.
    $gameParty.members()
      .forEach(member => member.modSdpPoints(sdpPoints));

    // get the true amount obtained after multipliers for the leader.
    const sdpMultiplier = actor.getBattler()
      .sdpMultiplier();
    const multipliedSdpPoints = Math.round(sdpMultiplier * sdpPoints);

    // generate the text popup for the obtained sdp points.
    this.generatePopSdpPoints(multipliedSdpPoints, actor.getCharacter());
  };

  /**
   * Generates a popup for the SDP points obtained.
   * @param {number} amount The amount to display.
   * @param {Game_Character} character The character to show the popup on.
   */
  JABS_Engine.prototype.generatePopSdpPoints = function(amount, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const sdpPop = this.configureSdpPop(amount);

    // add the pop to the caster's tracking.
    character.addTextPop(sdpPop);
    character.requestTextPop();
  };

  /**
   * Creates the text pop of the SDP points gained.
   * @param {number} sdpPoints The amount of experience gained.
   */
  JABS_Engine.prototype.configureSdpPop = function(sdpPoints)
  {
    return new TextPopBuilder(sdpPoints)
      .isSdpPoints()
      .build();
  };

  /**
   * Creates the log entry if using the J-LOG.
   * @param {number} sdpPoints The SDP ponts gained.
   * @param {JABS_Battler} battler The battler gaining the SDP points.
   */
  JABS_Engine.prototype.createSdpLog = function(sdpPoints, battler)
  {
    if (!J.LOG) return;

    const sdpLog = new ActionLogBuilder()
      .setupSdpAcquired(battler.battlerName(), sdpPoints)
      .build();
    $actionLogManager.addLog(sdpLog);
  };
}
//endregion JABS_Engine

//region TextManager
/**
 * Gets the proper name for the points used by the SDP system.
 * @returns {string}
 */
TextManager.sdpPoints = function()
{
  return "SDPs";
};

/**
 * Extends {@link #longParam}.<br>
 * First checks if it is the SDP multiplier paramId before searching for others.
 * @returns {string}
 */
J.SDP.Aliased.TextManager.set('longParam', TextManager.longParam);
TextManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 33:
      return this.sdpMultiplier(); // sdp multiplier
    default:
      // perform original logic.
      return J.SDP.Aliased.TextManager.get('longParam')
        .call(this, paramId);
  }
};

/**
 * Gets the proper name of "SDP Multiplier".
 * @returns {string}
 */
TextManager.sdpMultiplier = function()
{
  return "SDP Multiplier";
};

/**
 * Extends {@link #longParamDescription}.<br>
 * First checks if it is the SDP multiplier paramId before searching for others.
 * @returns {string[]}
 */
J.SDP.Aliased.TextManager.set('longParamDescription', TextManager.longParamDescription);
TextManager.longParamDescription = function(paramId)
{
  switch (paramId)
  {
    case 33:
      return this.sdpMultiplierDescription(); // sdp multiplier
    default:
      // perform original logic.
      return J.SDP.Aliased.TextManager.get('longParamDescription')
        .call(this, paramId);
  }
};

/**
 * Gets the description text for the SDP multiplier.
 * @returns {string[]}
 */
TextManager.sdpMultiplierDescription = function()
{
  return [
    "The percentage bonuses being applied against SDP point gain.",
    "Higher amounts of this yields greater SDP point generation." ];
};
//endregion TextManager

//region Game_Action
/**
 * Extends {@link #applyGlobal}.<br>
 * Also handles any SDP effects such as unlocking.
 */
J.SDP.Aliased.Game_Action.set('applyGlobal', Game_Action.prototype.applyGlobal);
Game_Action.prototype.applyGlobal = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_Action.get('applyGlobal')
    .call(this);

  // apply the SDP effects if appropriate.
  this.handleSdpEffects();
};

/**
 * Handles any SDP-related effects for this action.
 */
Game_Action.prototype.handleSdpEffects = function()
{
  // check if the SDP can be unlocked.
  if (this.canUnlockSdp())
  {
    // perform the unlock.
    this.applySdpUnlockEffect();
  }
};

/**
 * Determines whether or not the SDP on this action can be unlocked.
 * @returns {boolean} True if the SDP can be unlocked, false otherwise.
 */
Game_Action.prototype.canUnlockSdp = function()
{
  // grab the item out.
  const item = this.item();

  // if there is no item, no unlocking panels.
  if (!item) return false;

  // if it is a skill, then no unlocking panels.
  if (item instanceof RPG_Skill) return false;

  // if this doesn't unlock a panel, then no unlocking panels.
  if (!item.sdpKey) return false;

  // unlock that sdp!
  return true;
};

/**
 * Performs any unlock effects associated with the attached item's SDP tag.
 */
Game_Action.prototype.applySdpUnlockEffect = function()
{
  // grab the item out.
  const item = this.item();

  // unlock the SDP.
  $gameParty.unlockSdp(item.sdpKey);
};
//endregion Game_Action

//region Game_Actor
/**
 * Extends {@link #initMembers}.<br>
 * Also initializes the SDP members.
 */
J.SDP.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_Actor.get('initMembers')
    .call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the SDP system.
   */
  this._j._sdp ||= {}

  /**
   * The accumulative total number of points this actor has ever gained.
   * @type {number}
   */
  this._j._sdp._pointsEverGained = 0;

  /**
   * The accumulative total number of points this actor has ever spent.
   * @type {number}
   */
  this._j._sdp._pointsSpent = 0;

  /**
   * The points that this current actor has.
   * @type {number}
   */
  this._j._sdp._points = 0;

  /**
   * A collection of the ranks for each panel that have had points invested.
   * @type {PanelRanking[]}
   */
  this._j._sdp._ranks = [];
};

/**
 * Adds a new panel ranking for tracking the progress of a given panel.
 * @param {string} key The less-friendly unique key that represents this SDP.
 * @return {PanelRanking} The created panel ranking.
 */
Game_Actor.prototype.getOrCreateSdpRankByKey = function(key)
{
  // grab all the rankings this actor has.
  const rankings = this.getAllSdpRankings();

  // find the sdp ranking.
  const existingRanking = rankings.find(panelRank => panelRank.key === key);

  // check if we already have the ranking.
  if (existingRanking)
  {
    // return what already exists, no need to recreate it!
    return existingRanking;
  }

  // build a new sdp ranking.
  const newRanking = new PanelRanking(key, this.actorId());

  // add it to the running list.
  rankings.push(newRanking);

  // return the newly created ranking.
  return newRanking;
};

/**
 * Searches for a ranking in a given panel based on key and returns it.
 * @param {string} key The key of the panel we seek.
 * @returns {PanelRanking} The sdp ranking.
 */
Game_Actor.prototype.getSdpByKey = function(key)
{
  return this.getOrCreateSdpRankByKey(key);
};

/**
 * Gets all rankings that this actor has.
 * @returns {PanelRanking[]}
 */
Game_Actor.prototype.getAllSdpRankings = function()
{
  return this._j._sdp._ranks;
};

/**
 * Gets all unlocked panels for this actor.
 * @returns {PanelRanking[]}
 */
Game_Actor.prototype.getAllUnlockedSdps = function()
{
  return this.getAllSdpRankings()
    .filter(panelRanking => panelRanking.isUnlocked());
};

/**
 * Unlocks a panel by its key.
 * @param {string} key The key of the panel to unlock.
 */
Game_Actor.prototype.unlockSdpByKey = function(key)
{
  // grab the panel ranking by its key.
  const panelRanking = this.getSdpByKey(key);

  // unlock the ranking.
  panelRanking.unlock();
};

/**
 * Gets the accumulative total of points this actor has ever gained.
 * @returns {number}
 */
Game_Actor.prototype.getAccumulatedTotalSdpPoints = function()
{
  return this._j._sdp._pointsEverGained;
};

/**
 * Increase the amount of accumulated total points for this actor by a given amount.
 * This amount should never be reduced.
 * @param {number} points The number of points to increase the total by.
 */
Game_Actor.prototype.modAccumulatedTotalSdpPoints = function(points)
{
  // ensure the points are positive- you cannot decrease the accumulative total.
  if (points > 0)
  {
    // add the points to the accumulative total.
    this._j._sdp._pointsEverGained += points;
  }
};

/**
 * Gets the accumulative total of points this actor has ever spent.
 * @returns {number}
 */
Game_Actor.prototype.getAccumulatedSpentSdpPoints = function()
{
  return this._j._sdp._pointsEverGained;
};

/**
 * Increase the amount of accumulated spent points for this actor by a given amount.
 * This number is designed to not be reduced except when refunding.
 * @param {number} points The number of points to increase the spent by.
 */
Game_Actor.prototype.modAccumulatedSpentSdpPoints = function(points)
{
  // add the points to the accumulative spent.
  this._j._sdp._pointsSpent += points;
};

/**
 * Gets the amount of SDP points this actor has.
 */
Game_Actor.prototype.getSdpPoints = function()
{
  return this._j._sdp._points;
};

/**
 * Increase the amount of SDP points the actor has by a given amount.
 * If the parameter provided is negative, it will reduce the actor's points instead.
 *
 * NOTE: An actor's SDP points cannot be less than 0.
 * @param {number} points The number of points we are adding/removing from this actor.
 */
Game_Actor.prototype.modSdpPoints = function(points)
{
  // initialize the gained points.
  let gainedSdpPoints = points;

  // if the modification is a positive amount...
  if (gainedSdpPoints > 0)
  {
    // then add apply the multiplier to the gained points.
    gainedSdpPoints = Math.round(gainedSdpPoints * this.sdpMultiplier());

    // add to the running accumulative total.
    this.modAccumulatedTotalSdpPoints(gainedSdpPoints);
  }

  // add the points onto the actor.
  this._j._sdp._points += gainedSdpPoints;

  // if the actor's points were reduced below zero...
  if (this._j._sdp._points < 0)
  {
    // return it back to 0.
    this._j._sdp._points = 0;
  }
};

/**
 * OVERWRITE Gets the SDP points multiplier for this actor.
 * @returns {number}
 */
Game_Actor.prototype.sdpMultiplier = function()
{
  // initializing with base 100, representing 1x.
  let multiplier = 100;

  // get all the objects to scan for possible sdp multipliers.
  const objectsToCheck = this.getAllNotes();

  // get the vision multiplier from anything this battler has available.
  const sdpMultiplierBonus = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.SDP.RegExp.SdpMultiplier);

  // get the sum of the base and bonus multipliers.
  const sdpMultiplier = (multiplier + sdpMultiplierBonus);

  // return the factor form by now dividing by 100.
  return (sdpMultiplier / 100);
};

/**
 * Ranks up this actor's panel by key.
 * @param {string} panelKey The key of the panel to rank up.
 */
Game_Actor.prototype.rankUpPanel = function(panelKey)
{
  this.getSdpByKey(panelKey)
    .rankUp();
};

/**
 * Calculates the value of the bonus stats for a designated core parameter.
 * @param {number} paramId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @returns {number}
 */
Game_Actor.prototype.getSdpBonusForCoreParam = function(paramId, baseParam)
{
  const panelRankings = this.getAllSdpRankings();
  if (!panelRankings.length) return 0;

  let panelModifications = 0;
  // for each of the panel rankings this actor has established-
  panelRankings.forEach(panelRanking =>
  {
    // get the corresponding SDP's panel parameters.
    const panelParameters = $gameParty
      .getSdpByKey(panelRanking.key)
      .getPanelParameterById(paramId);
    if (panelParameters.length)
    {
      panelParameters.forEach(panelParameter =>
      {
        const { perRank } = panelParameter;
        const curRank = panelRanking.currentRank;
        if (!panelParameter.isFlat)
        {
          panelModifications += Math.floor(baseParam * (curRank * perRank) / 100);
        }
        else
        {
          panelModifications += curRank * perRank;
        }
      });
    }
  });

  return panelModifications;
};

/**
 * Calculates the value of the bonus stats for a designated [sp|ex]-parameter.
 * @param {number} sparamId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @param {number} idExtra The id modifier for s/x params.
 * @returns {number}
 */
Game_Actor.prototype.getSdpBonusForNonCoreParam = function(sparamId, baseParam, idExtra)
{
  const panelRankings = this.getAllSdpRankings();
  if (!panelRankings.length) return 0;

  let panelModifications = 0;
  // for each of the panel rankings this actor has established-
  panelRankings.forEach(panelRanking =>
  {
    // get the corresponding SDP's panel parameters.
    const panelParameters = $gameParty
      .getSdpByKey(panelRanking.key)
      .getPanelParameterById(sparamId + idExtra); // need +10 because sparams start higher.
    if (panelParameters.length)
    {
      panelParameters.forEach(panelParameter =>
      {
        const { perRank } = panelParameter;
        const curRank = panelRanking.currentRank;
        if (!panelParameter.isFlat)
        {
          panelModifications += baseParam * (curRank * perRank) / 100;
        }
        else
        {
          panelModifications += (curRank * perRank) / 100;
        }
      });
    }
  });

  return panelModifications;
};

/**
 * Extends the base parameters with the SDP bonuses.
 */
J.SDP.Aliased.Game_Actor.set("param", Game_Actor.prototype.param);
Game_Actor.prototype.param = function(paramId)
{
  // perform original logic.
  const baseParam = J.SDP.Aliased.Game_Actor.get("param")
    .call(this, paramId);

  const panelModifications = this.getSdpBonusForCoreParam(paramId, baseParam);
  const result = baseParam + panelModifications;
  return result;
};

/**
 * Extends the ex-parameters with the SDP bonuses.
 */
J.SDP.Aliased.Game_Actor.set("xparam", Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId)
{
  // perform original logic.
  const baseParam = J.SDP.Aliased.Game_Actor.get("xparam")
    .call(this, xparamId);

  const panelModifications = this.getSdpBonusForNonCoreParam(xparamId, baseParam, 8);
  const result = baseParam + panelModifications;
  return result;
};

/**
 * Extends the sp-parameters with the SDP bonuses.
 */
J.SDP.Aliased.Game_Actor.set("sparam", Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId)
{
  // perform original logic.
  const baseParam = J.SDP.Aliased.Game_Actor.get("sparam")
    .call(this, sparamId);

  const panelModifications = this.getSdpBonusForNonCoreParam(sparamId, baseParam, 18);
  const result = baseParam + panelModifications;
  return result;
};

/**
 * Extends {@link #maxTp}.<br>
 * Includes bonuses from panels as well.
 * @returns {number}
 */
J.SDP.Aliased.Game_Actor.set("maxTp", Game_Actor.prototype.maxTp);
Game_Actor.prototype.maxTp = function()
{
  // perform original logic.
  const baseMaxTp = J.SDP.Aliased.Game_Actor.get("maxTp")
    .call(this);

  // calculate the bonus max tp from the panels.
  const bonusMaxTpFromSdp = this.maxTpSdpBonuses(baseMaxTp);

  // combine the two for the total max tp.
  const result = bonusMaxTpFromSdp + baseMaxTp;

  // return our calculations.
  return result;
};

/**
 * Calculates the bonuses for Max TP from the actor's currently ranked SDPs.
 * @param {number} baseMaxTp The base max TP for this actor.
 * @returns {number}
 */
Game_Actor.prototype.maxTpSdpBonuses = function(baseMaxTp)
{
  // grab the current rankings of panels for the party.
  const panelRankings = this.getAllSdpRankings();

  // if we have no rankings, then there is no bonuses from SDP.
  if (!panelRankings.length) return 0;

  // initialize the modifier to 0.
  let panelModifications = 0;

  // iterate over each ranking this actor has.
  panelRankings.forEach(panelRanking =>
  {
    // get the corresponding SDP's panel parameters.
    const panelParameters = $gameParty
      .getSdpByKey(panelRanking.key)
      .getPanelParameterById(30); // TODO: generalize this whole thing.

    // validate we have any parameters from this panel.
    if (panelParameters.length)
    {
      // iterate over each panel parameter.
      panelParameters.forEach(panelParameter =>
      {
        // extract the relevant details.
        const {
          perRank,
          isFlat
        } = panelParameter;
        const { currentRank } = panelRanking;

        // check if the panel parameter growth is flat.
        if (isFlat)
        {
          // add it additively.
          panelModifications += currentRank * perRank;
        }
        // the panel parameter growth is percent.
        else
        {
          // add the percent of the base parameter.
          panelModifications += Math.floor(baseMaxTp * (currentRank * perRank) / 100);
        }
      });
    }
  });

  // return the modifier.
  return panelModifications;
};
//endregion Game_Actor

//region Game_Battler
/**
 * Gets the SDP points multiplier for this battler.
 * @returns {number}
 */
Game_Battler.prototype.sdpMultiplier = function()
{
  return 1.0;
};
//endregion Game_Battler

//region Game_BattlerBase
/**
 * Gets all SDP bonuses for the given crit parameter id.
 * @param {number} critParamId The id of the crit parameter.
 * @param {number} baseParam The base value of the crit parameter in question.
 * @returns {number}
 */
Game_BattlerBase.prototype.critSdpBonuses = function(critParamId, baseParam)
{
  // by default, there are no crit bonuses at the root level.
  return 0;
};
//endregion Game_BattlerBase

//region Game_Enemy
/**
 * Gets any additional drops from the notes of this particular enemy.
 * This allows for only gaining an SDP from enemies once.
 * @returns {RPG_DropItem[]}
 */
J.SDP.Aliased.Game_Enemy.set("extraDrops", Game_Enemy.prototype.extraDrops);
Game_Enemy.prototype.extraDrops = function()
{
  // get the original drop list.
  const dropList = J.SDP.Aliased.Game_Enemy.get("extraDrops")
    .call(this);

  // if we cannot drop the SDP for some reason, then return the unmodified drop list.
  if (!this.canDropSdp()) return dropList;

  // add the drop to the list of possible drops.
  const sdpDrop = this.makeSdpDrop();
  dropList.push(sdpDrop);

  // return the list with the added SDP.
  return dropList;
};

/**
 * Determines if there is an SDP to drop, and whether or not to drop it.
 * @returns {RPG_DropItem}
 */
Game_Enemy.prototype.canDropSdp = function()
{
  // if we do not have a panel to drop, then don't drop it.
  if (!this.hasSdpDropData()) return false;

  // grab the panel for shorthand reference below.
  const panel = J.SDP.Metadata.panelsMap.get(this.enemy().sdpDropKey);

  // if the enemy has a panel that isn't defined, then don't drop it.
  if (!panel)
  {
    console.warn(`Panel of key ${this.enemy().sdpDropKey} is not defined, but was trying to be dropped.`);
    console.warn(`Consider defining a panel with the key of ${this.enemy().sdpDropKey}.<br>`);
    return false;
  }

  // if we have already unlocked the droppable panel, then don't drop it.
  if (panel.isUnlocked()) return false;

  // drop the panel!
  return true;
};

/**
 * Makes the new drop item for the SDP based on the data from this enemy.
 * @returns {RPG_Item}
 */
Game_Enemy.prototype.makeSdpDrop = function()
{
  // grab all the data points to build the SDP drop.
  const [ key, chance, itemId ] = this.getSdpDropData();

  // if debug is enabled, panels should always drop.
  const debugChance = $gameSystem.shouldForceDropSdp()
    ? 10000000
    : chance;

  // build the sdp drop item.
  const sdpDrop = new RPG_DropItemBuilder().itemLoot(itemId, debugChance);

  // assign the drop item the key for the panel.
  sdpDrop.setSdpKey(key);

  // return the custom item.
  return sdpDrop;
};

/**
 * Gets the SDP drop data from this enemy.
 * @returns {[string,number,number]}
 */
Game_Enemy.prototype.getSdpDropData = function()
{
  return this.enemy().sdpDropData;
};

/**
 * Gets whether or not this enemy has an SDP to drop.
 * @returns {boolean}
 */
Game_Enemy.prototype.hasSdpDropData = function()
{
  return this.enemy().sdpDropData[0] !== String.empty;
};

/**
 * Gets the base amount of SDP points this enemy grants.
 * @returns {number}
 */
Game_Enemy.prototype.sdpPoints = function()
{
  return this.enemy().sdpPoints;
};
//endregion Game_Enemy

//region Game_Party
/**
 * Extends {@link #initialize}.<br>
 * Also initializes our SDP members.
 */
J.SDP.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_Party.get('initialize')
    .call(this);

  // init sdp members.
  this.initSdpMembers();

  // populate the trackings.
  this.populateSdpTrackings();
};

/**
 * Initializes all members of the sdp system.
 */
Game_Party.prototype.initSdpMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the sdp system.
   */
  this._j._sdp ||= {};

  /**
   * A collection of all panels being tracked by this party.
   * There should always be one for every panel imported from the
   * configuration.
   * @type {PanelTracking[]}
   */
  this._j._sdp._trackings = [];
};

/**
 * Populates all SDP trackings from the current plugin metadata.
 */
Game_Party.prototype.populateSdpTrackings = function()
{
  this._j._sdp._trackings = J.SDP.Metadata.panels
    .map(panel => new PanelTracking(panel.key, panel.unlockedByDefault));
};

/**
 * Updates the {@link PanelTracking}s with any new ones found from the metadata.
 */
Game_Party.prototype.updateSdpTrackingsFromConfig = function()
{
  // grab the current list of trackings by reference.
  const trackings = this.getAllSdpTrackings();

  J.SDP.Metadata.panels.forEach(panel =>
  {
    // skip ones that we shouldn't be adding.
    if (!this.canGainEntry(panel.name)) return;

    // find one by the same key in the existing trackings.
    const foundTracking = trackings.find(tracking => tracking.key === panel.key);

    // check if we found a tracking that has had its default unlock status changed.
    if (foundTracking && !foundTracking.unlocked && panel.unlockedByDefault)
    {
      // unlock it.
      panel.unlock();
      return;
    }

    // check if we actually didn't find any panel by that key.
    if (!foundTracking)
    {
      // add it anew.
      const newTracking = new PanelTracking(panel.key, panel.unlockedByDefault);
      trackings.push(newTracking);
      console.log(`adding new sdp: ${newTracking.key}`);
    }
  });

  // sort them.
  trackings.sort((a, b) => a.key - b.key);
};

/**
 * Gets all SDP trackings.
 * @return {PanelTracking[]}
 */
Game_Party.prototype.getAllSdpTrackings = function()
{
  return this._j._sdp._trackings;
};

/**
 * Get all unlocked SDP trackings.
 * @return {PanelTracking[]}
 */
Game_Party.prototype.getUnlockedSdpTrackings = function()
{
  return this.getAllSdpTrackings()
    .filter(panel => panel.isUnlocked());
};

/**
 * Gets the SDP tracking associated with a specific key.
 * @param {string} key The key of the SDP tracking to find.
 * @return {PanelTracking}
 */
Game_Party.prototype.getSdpTrackingByKey = function(key)
{
  return this.getAllSdpTrackings()
    .find(tracked => (tracked.key === key));
};

/**
 * Get a current list of all panels that are unlocked.
 * @return {StatDistributionPanel[]}
 */
Game_Party.prototype.getUnlockedSdps = function()
{
  // start our tracking with an empty array.
  const unlockedSdps = [];

  // iterate over each of the unlocked trackings.
  this.getUnlockedSdpTrackings()
    .forEach(tracking =>
    {
      // grab the panel associated with the key.
      const panel = this.getSdpByKey(tracking.key);

      // skip unfound keys if we have those somehow.
      if (!panel) return;

      // add the panel to the list.
      unlockedSdps.push(panel);
    }, this);

  // return what we found.
  return unlockedSdps;
};

/**
 * Unlocks an SDP being tracked by its key.
 * @param {string} key The key of the SDP to unlock.
 */
Game_Party.prototype.unlockSdp = function(key)
{
  // validate the panel exists before unlocking.
  if (J.SDP.Metadata.panelsMap.has(key) === false)
  {
    // stop processing.
    console.error(`The SDP key of ${key} was not found in the list of panels to unlock.`);
    return;
  }

  // unlock the panel.
  this.allMembers()
    .forEach(member => member.unlockSdpByKey(key));
};

/**
 * Unlocks all defined SDPs.
 */
Game_Party.prototype.unlockAllSdps = function()
{
  // unlock the panel.
  this.getAllSdpTrackings()
    .forEach(tracking => this.unlockSdp(tracking.key));
};

Game_Party.prototype.translatePartySdpsToActorSdps = function()
{
  const unlockedSdps = this.getUnlockedSdps();
  this.allMembers().forEach(member =>
  {
    unlockedSdps.forEach(tracking => member.unlockSdpByKey(tracking.key));
  });
};

/**
 * Locks an SDP being tracked by its key.
 * @param {string} key The key of the SDP to unlock.
 */
Game_Party.prototype.lockSdp = function(key)
{
  const panelTracking = this.getSdpTrackingByKey(key);

  if (!panelTracking)
  {
    // stop processing.
    console.error(`The SDP key of ${key} was not found in the list of panels to lock.`);
    return;
  }

  // lock the panel.
  panelTracking.lock();
};

/**
 * Locks all SDPs defined.
 */
Game_Party.prototype.lockAllSdps = function()
{
  this.getAllSdpTrackings()
    .forEach(tracking => tracking.lock());
};

/**
 * Returns a map of all SDPs keyed by the SDP's key with the value
 * being the SDP itself.
 * @return {Map<string, StatDistributionPanel>}
 */
Game_Party.prototype.getAllSdpsAsMap = function()
{
  return J.SDP.Metadata.panelsMap;
};

/**
 * Gets the {@link StatDistributionPanel} matching the given key.
 * @param {string} key The key of the SDP to find.
 * @return {StatDistributionPanel}
 */
Game_Party.prototype.getSdpByKey = function(key)
{
  return this.getAllSdpsAsMap()
    .get(key);
};

/**
 * Gets the rank of a given SDP for an actor by its key.
 * @param {number} actorId The id of the actor to get the rank from.
 * @param {string} key The key of the SDP to get the rank for.
 * @return {number} The rank of the SDP for the given actor.
 */
Game_Party.prototype.getSdpRankByActorAndKey = function(actorId, key)
{
  // make sure the actor id is valid.
  const actor = $gameActors.actor(actorId);
  if (!actor)
  {
    console.error(`The actor id of ${actorId} was invalid.`);
    return 0;
  }

  // make sure the actor has ranks in the panel and return the rank.
  const panelRanking = actor.getSdpByKey(key);
  if (panelRanking)
  {
    return panelRanking.currentRank;
  }
  else
  {
    return 0;
  }
};

Game_Party.prototype.normalizeSdpRankings = function()
{
  this.allMembers()
    .forEach(member =>
    {
      member._j._sdp._ranks.forEach(ranking => ranking.normalizeRank())
    });
};
//endregion Game_Party

//region Game_System
/**
 * Extends {@link #initialize}.<br>
 * Also initializes the debug features for the SDP system.
 */
J.SDP.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_System.get('initialize')
    .call(this);

  // initializes members for this plugin.
  this.initSdpMembers();
};

/**
 * Initializes the SDP system and binds earned panels to the `$gameSystem` object.
 */
Game_System.prototype.initSdpMembers = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the SDP system.
   */
  this._j._sdp ||= {};

  /**
   * Whether or not to force any enemy that can drop a panel to drop a panel.
   * @type {boolean}
   */
  this._j._sdp._forceDropPanels = false;
};

/**
 * Enables a DEBUG functionality for forcing the drop of panels where applicable.
 */
Game_System.prototype.enableForcedSdpDrops = function()
{
  this._j._sdp._forceDropPanels = true;
};

/**
 * Disables a DEBUG functionality for forcing the drop of panels where applicable.
 */
Game_System.prototype.disableForcedSdpDrops = function()
{
  this._j._sdp._forceDropPanels = false;
};

/**
 * Determines whether or not the DEBUG functionality of forced-panel-dropping is active.
 * @returns {boolean|*|boolean}
 */
Game_System.prototype.shouldForceDropSdp = function()
{
  return this._j._sdp._forceDropPanels ?? false;
};

/**
 * Extends {@link #onAfterLoad}.<br>
 * Updates the list of all available panels from the latest plugin metadata.
 */
J.SDP.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_System.get('onAfterLoad')
    .call(this);

  // setup the difficulty layers in the temp data.
  $gameParty.updateSdpTrackingsFromConfig();
};
//endregion Game_System

//region Game_Troop
/**
 * Gets the amount of SDP points earned from all defeated enemies.
 * @returns {number}
 */
Game_Troop.prototype.sdpTotal = function()
{
  // initialize total to zero.
  let sdpPoints = 0;

  // iterate over each dead enemy and sum their total SDP points.
  this.deadMembers()
    .forEach(enemy => sdpPoints += enemy.sdpPoints());

  // return the summed value.
  return sdpPoints;
};
//endregion Game_Troop

//region Scene_Map
/**
 * Adds the functionality for calling the SDP menu from the JABS quick menu.
 */
J.SDP.Aliased.Scene_Map.set('createJabsAbsMenuMainWindow', Scene_Map.prototype.createJabsAbsMenuMainWindow);
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  // perform original logic.
  J.SDP.Aliased.Scene_Map.get('createJabsAbsMenuMainWindow')
    .call(this);

  // grab the list window.
  const mainMenuWindow = this.getJabsMainListWindow();

  // add an additional handler for the new menu.
  mainMenuWindow.setHandler("sdp-menu", this.commandSdp.bind(this));
};

/**
 * Brings up the SDP menu.
 */
Scene_Map.prototype.commandSdp = function()
{
  Scene_SDP.callScene();
};
//endregion Scene_Map

//region Scene_Menu
/**
 * Hooks into the command window creation of the menu to add functionality for the SDP menu.
 */
J.SDP.Aliased.Scene_Menu.set('createCommandWindow', Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function()
{
  // perform original logic.
  J.SDP.Aliased.Scene_Menu.get('createCommandWindow')
    .call(this);

  // add an additional handler for the new menu.
  this._commandWindow.setHandler("sdp-menu", this.commandSdp.bind(this));
};

/**
 * Brings up the SDP menu.
 */
Scene_Menu.prototype.commandSdp = function()
{
  Scene_SDP.callScene();
};
//endregion Scene_Menu

//region Scene_SDP
/**
 * The scene for managing SDPs that the player has acquired.
 */
class Scene_SDP extends Scene_MenuBase
{
  /**
   * Calls this scene.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  //region init
  constructor()
  {
    // call super when having extended constructors.
    super();

    // jumpstart initialization on creation.
    this.initialize();
  }

  /**
   * Initializes all properties for this scene.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    this._j ||= {};

    /**
     * A grouping of all properties associated with the sdp system.
     */
    this._j._sdp = {};

    /**
     * A grouping of all windows associated with this scene.
     */
    this._j._sdp._windows = {};

    /**
     * All panels that are unlocked by the party and available for ranking up.
     * @type {Window_SdpList}
     */
    this._j._sdp._windows._sdpList = null;

    /**
     * The list of parameters associated with the currently selected SDP.
     * @type {Window_SdpParameterList}
     */
    this._j._sdp._windows._sdpParameterList = null;

    /**
     * The list of rewards associated with the currently selected SDP.
     * @type {Window_SdpRewardList}
     */
    this._j._sdp._windows._sdpRewardList = null;

    /**
     * The confirmation window that allows the user to confirm the rankup of a panel.
     * @type {Window_SdpPoints}
     */
    this._j._sdp._windows._sdpConfirmation = null;

    /**
     * The points window that displays the current menu actor's SDP points.
     * @type {Window_SdpPoints}
     */
    this._j._sdp._windows._sdpPoints = null;

    /**
     * The help window that displays the description of the currently hovered SDP.
     * @type {Window_SdpHelp}
     */
    this._j._sdp._windows._sdpHelp = null;

    /**
     * The rank data window that displays the varioud rank-related details for
     * the currently hovered SDP.
     * @type {Window_SdpRankData}
     */
    this._j._sdp._windows._sdpRankData = null;
  }

  //endregion init

  //region create
  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Overrides {@link #createButtons}.<br>
   * Removes the rendering of buttons from this scene.
   */
  createButtons()
  {
  }

  //endregion create

  //region windows
  /**
   * Creates all windows associated with the SDP scene.
   */
  createAllWindows()
  {
    // display data windows.
    this.createSdpPointsWindow();
    this.createSdpHelpWindow();
    this.createSdpRankDataWindow();

    // selectable data windows.
    this.createSdpListWindow();
    this.createSdpParameterListWindow();
    this.createSdpRewardListWindow();

    // this is last to ensure it shows up above other windows.
    this.createSdpConfirmationWindow();

    // the initial refresh to load all windows.
    this.onPanelHoveredChange();
  }

  //region sdp list window
  /**
   * Creates the list of SDPs available to the player.
   */
  createSdpListWindow()
  {
    // create the window.
    const window = this.buildSdpListWindow();

    // update the tracker with the new window.
    this.setSdpListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the sdp listing window.
   * @returns {Window_SdpList}
   */
  buildSdpListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.sdpListRectangle();

    // create the window with the rectangle.
    const window = new Window_SdpList(rectangle);

    // configure the window input handlers.
    window.setHandler('cancel', this.popScene.bind(this));
    window.setHandler('ok', this.onSelectPanel.bind(this));
    window.setHandler('more', this.onFilterPanels.bind(this));
    window.setHandler('pagedown', this.cycleMembers.bind(this, true));
    window.setHandler('pageup', this.cycleMembers.bind(this, false));
    window.onIndexChange = this.onPanelHoveredChange.bind(this);

    // initialize with the current menu actor.
    window.setActor($gameParty.menuActor());

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with the sdp list command window.
   * @returns {Rectangle}
   */
  sdpListRectangle()
  {
    // grab the points rectangle for reference.
    const pointsRectangle = this.sdpPointsRectangle();

    // arbitrarily define the width.
    const width = 400;

    // determine the modifier of the height for fitting properly..
    const heightFit = (pointsRectangle.height + this.sdpHelpRectangle().height) + 8;
    const height = Graphics.height - heightFit;

    // determine the x:y coordinates.
    const x = 0;
    const y = pointsRectangle.height;

    // return the built rectangle.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked sdp list window.
   * @returns {Window_SdpList}
   */
  getSdpListWindow()
  {
    return this._j._sdp._windows._sdpList;
  }

  /**
   * Set the currently tracked parameter list window to the given window.
   * @param {Window_SdpList} listWindow The parameter list window to track.
   */
  setSdpListWindow(listWindow)
  {
    this._j._sdp._windows._sdpList = listWindow;
  }

  //endregion sdp list window

  //region parameter list window
  /**
   * Creates the window for all parameters associated with the hovered SDP.
   */
  createSdpParameterListWindow()
  {
    // create the window.
    const window = this.buildSdpParameterListWindow();

    // update the tracker with the new window.
    this.setSdpParameterListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the sdp parameter listing window.
   * @returns {Window_SdpParameterList}
   */
  buildSdpParameterListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.sdpParameterListRectangle();

    // create the window with the rectangle.
    const window = new Window_SdpParameterList(rectangle);

    window.deselect();
    window.deactivate();
    window.setActor($gameParty.menuActor());

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the parameter list command window.
   * @returns {Rectangle}
   */
  sdpParameterListRectangle()
  {
    // define the width of the list.
    const width = 600;

    // calculate the X for where the origin of the list window should be.
    const x = this.sdpListRectangle().width;

    // define the height of the list.
    const height = Graphics.boxHeight - this.sdpHelpRectangle().height;

    // calculate the Y for where the origin of the list window should be.
    const y = 0;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked parameter list window.
   * @returns {Window_SdpParameterList}
   */
  getSdpParameterListWindow()
  {
    return this._j._sdp._windows._sdpParameterList;
  }

  /**
   * Set the currently tracked parameter list window to the given window.
   * @param {Window_SdpParameterList} listWindow The parameter list window to track.
   */
  setSdpParameterListWindow(listWindow)
  {
    this._j._sdp._windows._sdpParameterList = listWindow;
  }

  //endregion parameter list window

  //region reward list window
  /**
   * Creates the window for all rewards associated with the hovered SDP.
   */
  createSdpRewardListWindow()
  {
    // create the window.
    const window = this.buildSdpRewardListWindow();

    // update the tracker with the new window.
    this.setSdpRewardListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the sdp reward listing window.
   * @returns {Window_SdpParameterList}
   */
  buildSdpRewardListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.sdpRewardListRectangle();

    // create the window with the rectangle.
    const window = new Window_SdpRewardList(rectangle);

    window.deselect();
    window.deactivate();

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the reward list command window.
   * @returns {Rectangle}
   */
  sdpRewardListRectangle()
  {
    const sdpListRect = this.sdpListRectangle();
    const parameterListRect = this.sdpParameterListRectangle();
    const helpRect = this.sdpHelpRectangle();

    // define the width of the list.
    const width = Graphics.boxWidth - parameterListRect.width - sdpListRect.width;

    // the rewards should render on the right side of the parameters.
    const x = parameterListRect.x + parameterListRect.width;

    // the shared modifier defining the height and y of this rectangle.
    const ymod = 200;

    // define the height of the list.
    const height = Graphics.boxHeight - helpRect.height - ymod;

    // calculate the Y for where the origin of the list window should be.
    const y = ymod;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked reward list window.
   * @returns {Window_SdpRewardList}
   */
  getSdpRewardListWindow()
  {
    return this._j._sdp._windows._sdpRewardList;
  }

  /**
   * Set the currently tracked reward list window to the given window.
   * @param {Window_SdpRewardList} listWindow The reward list window to track.
   */
  setSdpRewardListWindow(listWindow)
  {
    this._j._sdp._windows._sdpRewardList = listWindow;
  }

  //endregion reward list window

  //region rank data window
  /**
   * Creates the rank data window that displays data related to the current
   * menu actor's ranking in the hovered SDP..
   */
  createSdpRankDataWindow()
  {
    // create the window.
    const window = this.buildSdpRankDataWindow();

    // update the tracker with the new window.
    this.setSdpRankDataWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the sdp rank data window.
   * @returns {Window_SdpRankData}
   */
  buildSdpRankDataWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.sdpRankDataRectangle();

    // create the window with the rectangle.
    const window = new Window_SdpRankData(rectangle);

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with the rank data window.
   * @returns {Rectangle}
   */
  sdpRankDataRectangle()
  {
    const parametersRect = this.sdpParameterListRectangle();

    const width = Graphics.boxWidth - (parametersRect.x + parametersRect.width);
    const height = Graphics.boxHeight - (this.sdpHelpRectangle().height + this.sdpRewardListRectangle().height);
    const x = (parametersRect.x + parametersRect.width);
    const y = 0;
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked rank data window.
   * @returns {Window_SdpRankData}
   */
  getSdpRankDataWindow()
  {
    return this._j._sdp._windows._sdpRankData;
  }

  /**
   * Set the currently tracked rank data window to the given window.
   * @param {Window_SdpRankData} rankDataWindow The rank data window to track.
   */
  setSdpRankDataWindow(rankDataWindow)
  {
    this._j._sdp._windows._sdpRankData = rankDataWindow;
  }

  //endregion rank data window

  //region help window
  /**
   * Creates the help window that provides contextual details to the player about the panel.
   */
  createSdpHelpWindow()
  {
    // create the window.
    const window = this.buildSdpHelpWindow();

    // update the tracker with the new window.
    this.setSdpHelpWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the sdp listing window.
   * @returns {Window_SdpHelp}
   */
  buildSdpHelpWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.sdpHelpRectangle();

    // create the window with the rectangle.
    const window = new Window_SdpHelp(rectangle);

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with the sdp help window.
   * @returns {Rectangle}
   */
  sdpHelpRectangle()
  {
    const width = Graphics.boxWidth;
    const height = 100;
    const x = 0;
    const y = Graphics.boxHeight - height;
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked sdp help window.
   * @returns {Window_SdpHelp}
   */
  getSdpHelpWindow()
  {
    return this._j._sdp._windows._sdpHelp;
  }

  /**
   * Set the currently tracked help window to the given window.
   * @param {Window_SdpHelp} helpWindow The help window to track.
   */
  setSdpHelpWindow(helpWindow)
  {
    this._j._sdp._windows._sdpHelp = helpWindow;
  }

  // endregion help window

  //region points window
  /**
   * Creates the points window for displaying how many points the current actor has.
   */
  createSdpPointsWindow()
  {
    // create the window.
    const window = this.buildSdpPointsWindow();

    // update the tracker with the new window.
    this.setSdpPointsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the sdp points window.
   * @returns {Window_SdpPoints}
   */
  buildSdpPointsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.sdpPointsRectangle();

    // create the window with the rectangle.
    const window = new Window_SdpPoints(rectangle);

    // also set the menu actor.
    window.setActor($gameParty.menuActor());

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with the sdp confirmation window.
   * @returns {Rectangle}
   */
  sdpPointsRectangle()
  {
    // the sdp points window sits in the upper-right-most corner.
    const width = 400;
    const height = 60;
    const x = 0;
    const y = 0;
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked sdp points window.
   * @returns {Window_SdpPoints}
   */
  getSdpPointsWindow()
  {
    return this._j._sdp._windows._sdpPoints;
  }

  /**
   * Set the currently tracked sdp points window to the given window.
   * @param {Window_SdpPoints} pointsWindow The window to track.
   */
  setSdpPointsWindow(pointsWindow)
  {
    this._j._sdp._windows._sdpPoints = pointsWindow;
  }

  //endregion points window

  //region confirmation window
  /**
   * Creates the confirmation window for confirming the rankup of an SDP.
   */
  createSdpConfirmationWindow()
  {
    // create the window.
    const window = this.buildSdpConfirmationWindow();

    // update the tracker with the new window.
    this.setSdpConfirmationWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the sdp listing window.
   * @returns {Window_SdpConfirmation}
   */
  buildSdpConfirmationWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.sdpConfirmationRectangle();

    // create the window with the rectangle.
    const window = new Window_SdpConfirmation(rectangle);

    // configure the window input handlers.
    window.setHandler('cancel', this.onUpgradeCancel.bind(this));
    window.setHandler('ok', this.onUpgradeConfirm.bind(this));

    // hide it by default.
    window.hide();

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with the sdp confirmation window.
   * @returns {Rectangle}
   */
  sdpConfirmationRectangle()
  {
    const width = 350;
    const height = 120;
    const x = (Graphics.boxWidth - width) / 2;
    const y = (Graphics.boxHeight - height) / 2;
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked sdp confirmation window.
   * @returns {Window_SdpConfirmation}
   */
  getSdpConfirmationWindow()
  {
    return this._j._sdp._windows._sdpConfirmation;
  }

  /**
   * Set the currently tracked sdp confirmation window to the given window.
   * @param {Window_SdpConfirmation} confirmationWindow The window to track.
   */
  setSdpConfirmationWindow(confirmationWindow)
  {
    this._j._sdp._windows._sdpConfirmation = confirmationWindow;
  }

  //endregion confirmation window
  //endregion windows

  //region actions
  /**
   * When selecting a panel, bring up the confirmation window.
   */
  onSelectPanel()
  {
    // grab the confirmation window.
    const window = this.getSdpConfirmationWindow();

    // enable interaction with it.
    window.show();
    window.open();
    window.activate();
  }

  /**
   * Toggle the filtering out of already-maxed panels.
   */
  onFilterPanels()
  {
    // grab the window with the list of sdps.
    const sdpListWindow = this.getSdpListWindow();

    // toggle the filter.
    sdpListWindow.toggleNoMaxPanelsFilter();

    // trigger a refresh of windows.
    this.onPanelHoveredChange();

    // check if the index became out of bounds.
    if (sdpListWindow.index() >= sdpListWindow.commandList().length)
    {
      // correct the index to the last item.
      sdpListWindow.select(sdpListWindow.commandList().length - 1);
    }
  }

  /**
   * Refreshes all windows in this scene on change of index in the list.
   */
  onPanelHoveredChange()
  {
    // validate panels are present before updating everything.
    const hasPanels = this.getSdpListWindow()
      .hasCommands();
    if (!hasPanels) return;

    // grab the current panel.
    /** @type {StatDistributionPanel} */
    const currentPanel = this.getSdpListWindow()
      .currentExt();

    // grab the current actor of the menu.
    const currentActor = $gameParty.menuActor();

    // update the actor associated with the sdp listing.
    this.getSdpListWindow()
      .setActor(currentActor);

    // update the actor associated with the sdp point tracking.
    this.getSdpPointsWindow()
      .setActor(currentActor);

    // update the parameter list with the latest panel parameters.
    const parameterListWindow = this.getSdpParameterListWindow();
    parameterListWindow.setActor(currentActor);
    parameterListWindow.setParameters(currentPanel.panelParameters);
    parameterListWindow.refresh();

    // update the reward list with the latest panel rewards.
    const rewardListWindow = this.getSdpRewardListWindow();
    rewardListWindow.setRewards(currentPanel.panelRewards);
    rewardListWindow.refresh();

    // update the text in the help window to reflect the description of the panel.
    this.getSdpHelpWindow()
      .setText(currentPanel.description);

    // update the cost data window.
    const panelRanking = currentActor.getSdpByKey(currentPanel.key);
    this.getSdpRankDataWindow()
      .setRankData(currentPanel.getPanelRarityColorIndex(),
        currentPanel.getPanelRarityText(),
        panelRanking.currentRank,
        currentPanel.maxRank,
        currentPanel.rankUpCost(panelRanking.currentRank),
        currentActor.getSdpPoints());
    this.getSdpRankDataWindow()
      .refresh();
  }

  /**
   * Cycles the currently selected member to the next in the party.
   * @param {boolean} isForward Whether or not to cycle to the next member or previous.
   */
  cycleMembers(isForward = true)
  {
    // cycle the menu actors either forward or backward.
    isForward
      ? $gameParty.makeMenuActorNext()
      : $gameParty.makeMenuActorPrevious();

    // refresh everything.
    this.onPanelHoveredChange();

    // re-activate the list window.
    this.getSdpListWindow()
      .activate();
  }

  /**
   * If the player opts to upgrade the existing panel, remove the points and rank up the panel.
   */
  onUpgradeConfirm()
  {
    // grab the panel we're working with.
    const panel = this.getSdpListWindow()
      .currentExt();

    // grab the actor we're working with.
    const actor = $gameParty.menuActor();

    // get the panel ranking from the actor.
    const panelRanking = actor.getSdpByKey(panel.key);

    // determine the cost to rank up the panel.
    const panelRankupCost = panel.rankUpCost(panelRanking.currentRank);

    // reduce the points by a negative variant of the amount.
    actor.modSdpPoints(-panelRankupCost);

    // rank up the panel.
    actor.rankUpPanel(panel.key);

    // update the total spent points for this actor.
    actor.modAccumulatedSpentSdpPoints(panelRankupCost);

    // refresh all the windows after upgrading the panel.
    this.onPanelHoveredChange();

    // close the confirmation window.
    this.getSdpConfirmationWindow()
      .close();

    // refocus back to the list window.
    this.getSdpListWindow()
      .activate();
  }

  /**
   * If the player opts to cancel the upgrade process, return to the list window.
   */
  onUpgradeCancel()
  {
    // grab the confirmation window.
    const window = this.getSdpConfirmationWindow();

    // disable it from interaction.
    window.close();
    window.hide();

    // re-activate the main list window.
    this.getSdpListWindow()
      .activate();
  }

  //endregion actions
}

//endregion Scene_SDP

//region Window_AbsMenu
if (J.ABS)
{
  /**
   * Extends {@link #buildCommands}.<br>
   * Adds the sdp command at the end of the list.
   * @returns {BuiltWindowCommand[]}
   */
  J.SDP.Aliased.Window_AbsMenu.set('buildCommands', Window_AbsMenu.prototype.buildCommands);
  Window_AbsMenu.prototype.buildCommands = function()
  {
    // perform original logic to get the base commands.
    const originalCommands = J.SDP.Aliased.Window_AbsMenu.get('buildCommands')
      .call(this);

    // if the SDP switch is not ON, then this menu command is not present.
    if (!this.canAddSdpCommand()) return originalCommands;

    // The menu shouldn't be accessible if there are no panels to work with?
    const enabled = $gameParty.getAllSdpTrackings().length > 0;

    // build the command.
    const command = new WindowCommandBuilder(J.SDP.Metadata.commandName)
      .setSymbol("sdp-menu")
      .setEnabled(enabled)
      .setIconIndex(J.SDP.Metadata.commandIconIndex)
      .setColorIndex(1)
      .setHelpText(this.sdpHelpText())
      .build();

    // add the new command.
    originalCommands.push(command);

    // return the updated command list.
    return originalCommands;
  };

  /**
   * Determines whether or not the sdp command can be added to the JABS menu.
   * @returns {boolean} True if the command should be added, false otherwise.
   */
  Window_AbsMenu.prototype.canAddSdpCommand = function()
  {
    // if the necessary switch isn't ON, don't render the command at all.
    if (!$gameSwitches.value(J.SDP.Metadata.menuSwitchId)) return false;

    // render the command!
    return true;
  };

  /**
   * The help text for the JABS sdp menu.
   * @returns {string}
   */
  Window_AbsMenu.prototype.sdpHelpText = function()
  {
    const description = [
      "The ever-growing list of stat distribution panels, aka your junction system.",
      "Junction points can be spent here to modify your stats- permanently." ];

    return description.join("\n");
  };
}
//endregion Window_AbsMenu

//region Window_MenuCommand
/**
 * Extends the make command list for the main menu to include SDP, if it meets the conditions.
 */
J.SDP.Aliased.Window_MenuCommand.set('makeCommandList', Window_MenuCommand.prototype.makeCommandList);
Window_MenuCommand.prototype.makeCommandList = function()
{
  // perform original logic.
  J.SDP.Aliased.Window_MenuCommand.get('makeCommandList')
    .call(this);

  // if we cannot add the command, then do not.
  if (!this.canAddSdpCommand()) return;

  // The menu shouldn't be accessible if there are no panels to work with.
  const enabled = $gameParty.getUnlockedSdpTrackings().length > 0;

  // build the command.
  const command = new WindowCommandBuilder(J.SDP.Metadata.commandName)
    .setSymbol("sdp-menu")
    .setEnabled(enabled)
    .setIconIndex(J.SDP.Metadata.commandIconIndex)
    .setColorIndex(1)
    .build();

  // determine what the last command is.
  const lastCommand = this._list.at(-1);

  // check if the last command is the "End Game" command.
  if (lastCommand.symbol === "gameEnd")
  {
    // add it before the "End Game" command.
    this._list.splice(this._list.length - 2, 0, command);
  }
  // the last command is something else.
  else
  {
    // just add it to the end.
    this.addBuiltCommand(command);
  }
};

/**
 * Determines whether or not the sdp command can be added to the JABS menu.
 * @returns {boolean} True if the command should be added, false otherwise.
 */
Window_MenuCommand.prototype.canAddSdpCommand = function()
{
  // if the necessary switch isn't ON, don't render the command at all.
  if (!$gameSwitches.value(J.SDP.Metadata.menuSwitchId)) return false;

  // if we're using JABS but not allowing to show this command in both menus, then skip.
  if (J.ABS && !J.SDP.Metadata.jabsShowInBothMenus) return false;

  // render the command!
  return true;
};
//endregion Window_MenuCommand

//region Window_SdpConfirmation
/**
 * The window that prompts the user to confirm/cancel the upgrading of a chosen panel.
 */
class Window_SdpConfirmation extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The cost of this panel to execute an upgrade.
     * @type {number}
     */
    this.cost = 0;

    /**
     * The actor to reduce the points of if the player chooses to upgrade the panel.
     * @type {Game_Actor}
     */
    this.actor = null;
  }

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    this.addCommand(`Upgrade this panel`, `panel-upgrade-ok`, true, null, 91);
    this.addCommand(`Cancel`, `panel-upgrade-cancel`, true, null, 90);
  }
}

//endregion Window_SdpConfirmation

//region Window_SdpHelp
/**
 * The window that displays the help text associated with a panel.
 */
class Window_SdpHelp extends Window_Help
{
  /**
   * @constructor
   * @param {Rectangle} rect The dimensions of the window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
  }
}

//endregion Window_SdpHelp

//region Window_SdpList
/**
 * The SDP window containing the list of all unlocked panels.
 */
class Window_SdpList
  extends Window_Command
{
  /**
   * The currently selected actor. Used for comparing points to cost to see if
   * the panel in the list window should be enabled or disabled.
   * @type {Game_Actor}
   */
  currentActor = null;

  filterNoMaxedPanels = false;

  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Sets the actor for this window to the provided actor. Implicit refresh.
   * @param {Game_Actor} actor The actor to assign to this window.
   */
  setActor(actor)
  {
    this.currentActor = actor;
    this.refresh();
  }

  /**
   * Gets whether or not the no-max-panels filter is enabled.
   * @returns {boolean}
   */
  usingNoMaxPanelsFilter()
  {
    return this.filterNoMaxedPanels;
  }

  /**
   * Toggles the "hide max panels" filter for this window.
   */
  toggleNoMaxPanelsFilter()
  {
    this.filterNoMaxedPanels = !this.filterNoMaxedPanels;
  }

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  }

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    // grab the actor.
    const actor = this.currentActor;

    // don't render the list of there is no actor.
    if (!actor) return;

    // grab all the panelRankings the actor has unlocked.
    const panelRankings = actor.getAllUnlockedSdps();

    // check if there even are any panels unlocked.
    if (panelRankings.length === 0) return;

    // iterate over each of the unlocked rankings to render the panel in the list.
    const commands = panelRankings
      .map(panelRanking =>
      {
        // grab the actual panel for its data.
        const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);

        // construct the SDP command.
        const command = this.makeCommand(panel);

        // if the command is invalid, do not add it.
        if (!command) return null;

        // add the command.
        return command;
      }, this)
      .filter(command => command !== null)
      .sort((a, b) => a.ext.key.localeCompare(b.ext.key));

    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds a single command for the SDP list based on a given panel.
   * @param {StatDistributionPanel} panel The panel to build a command for.
   * @returns {BuiltWindowCommand}
   */
  makeCommand(panel)
  {
    const actor = this.currentActor;
    const points = actor.getSdpPoints();
    const {
      name,
      key,
      iconIndex,
      rarity: colorIndex,
      maxRank
    } = panel;

    // get the ranking for a given panel by its key.
    const panelRanking = actor.getSdpByKey(key);

    // grab the current rank of the panel.
    const { currentRank } = panelRanking;

    // check if we're at max rank already.
    const isMaxRank = maxRank <= currentRank;

    // check if the panel is max rank AND we're using the no max panels filter.
    if (isMaxRank && this.usingNoMaxPanelsFilter())
    {
      // don't render this panel.
      return null;
    }

    // check if we have enough points to rank up this panel.
    const hasEnoughPoints = panel.rankUpCost(currentRank) <= points;

    // determine whether or not the command is enabled.
    const enabled = hasEnoughPoints && !isMaxRank;

    // build the right text out.
    const rightText = isMaxRank
      ? "DONE"
      : `${currentRank} / ${maxRank}`;

    // construct the SDP command.
    const command = new WindowCommandBuilder(name)
      .setSymbol(key)
      .setEnabled(enabled)
      .setExtensionData(panel)
      .setIconIndex(iconIndex)
      .setColorIndex(colorIndex)
      .setRightText(rightText)
      .build();

    return command;
  }
}

//endregion Window_SdpList

//region Window_SdpParameterList
class Window_SdpParameterList extends Window_Command
{
  /**
   * The current parameters on the panel being hovered over.
   * @type {PanelParameter[]}
   */
  panelParameters = [];

  /**
   * The current actor to compare parameters against the panel parameters for.
   * @type {Game_Actor}
   */
  currentActor = null;

  /**
   * Constructor.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Sets the current actor to compare parameters for.
   * @param {Game_Actor} actor The actor to set.
   */
  setActor(actor)
  {
    this.currentActor = actor;
  }

  /**
   * Sets the parameters that are defined in this list.
   * @param {PanelParameter[]} parameters The collection of parameters for this panel.
   */
  setParameters(parameters)
  {
    this.panelParameters = parameters;
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Creates the command list of parameters affected by this SDP.
   */
  makeCommandList()
  {
    // grab all the omnipedia listings available.
    const commands = this.buildCommands();

    // add all the built commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all omnipedia commands to the list that are available.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    if (!this.panelParameters) return [];

    const commands = this.panelParameters.map(this.#buildPanelParameterCommand, this);

    return commands;
  }

  #buildPanelParameterCommand(panelParameter)
  {
    // extract a couple parameter data points for building the display information.
    const { parameterId, isCore } = panelParameter;

    // determine the item color.
    const colorIndex = isCore
      ? 14
      : 0;

    // determine the parameter data to display.
    const paramName = TextManager.longParam(parameterId);
    const paramIcon = IconManager.longParam(parameterId);
    let paramValue = this.currentActor.longParam(parameterId);
    const isPercentParamValue = this.isPercentParameter(parameterId);
    const percentValue = isPercentParamValue
      ? '%'
      : String.empty;

    // non-base parameters (and not max tp) get multiplied by 100.
    if (!Game_BattlerBase.isBaseParam(parameterId) && parameterId !== 30)
    {
      paramValue *= 100;
    }

    const paramDescription = TextManager.longParamDescription(parameterId);

    // determine the modifier data to display.
    const { modifierColorIndex, modifierText } = this.#determineModifierData(panelParameter);

    // build the command name.
    const commandName = `${paramName} ( ${Math.trunc(paramValue)}${percentValue} )`;

    // construct the command.
    const command = new WindowCommandBuilder(commandName)
      .setSymbol(parameterId)
      .addTextLines(paramDescription)
      .setIconIndex(paramIcon)
      .setColorIndex(colorIndex)
      .setRightText(modifierText)
      .setRightColorIndex(modifierColorIndex)
      .setExtensionData(panelParameter)
      .build();

    // return the built command.
    return command;
  }

  /**
   * Translates a parameter id into an object with its name, value, iconIndex, and whether or not
   * a parameter being smaller is an improvement..
   * @param {PanelParameter} panelParameter The id to translate.
   */
  // eslint-disable-next-line complexity
  #determineModifierData(panelParameter)
  {
    // a small helper function for calculating the next rank's value.
    const calculateAfterRankUpValue = (paramValue, modifier, isFlat) =>
    {
      return isFlat
        ? Number((paramValue + modifier).toFixed(2))
        : (paramValue + (paramValue * (modifier / 100)));
    };

    // a messy helper function for determining the modifier's color index.
    const determineModifierColorIndex = (paramId, isCore, paramValue, afterRankupValue) =>
    {
      // define some colors.
      const upColor = 24; // ColorManager.textColor(24);
      const upCoreColor = 28; // ColorManager.textColor(28);
      const downColor = 20; // ColorManager.textColor(20);
      const downCoreColor = 18; // ColorManager.textColor(18);

      // determine if smaller is better.
      const smallerIsBetter = this.isNegativeGood(paramId);

      let colorIndex = 0;

      // check if the parameter is going down when we want it to go up.
      if (paramValue > afterRankupValue && !smallerIsBetter)
      {
        // mark it as "a bad thing" color.
        colorIndex = isCore
          ? downCoreColor
          : downColor;
      }
      // check if the parameter is going up when we want it to go up.
      else if (paramValue < afterRankupValue && !smallerIsBetter)
      {
        // mark it as "a good thing" color.
        colorIndex = isCore
          ? upCoreColor
          : upColor;
      }
      // check if the parameter is going doing when smaller is indeed better.
      else if (paramValue > afterRankupValue && smallerIsBetter)
      {
        // mark it as "a good thing" color.
        colorIndex = isCore
          ? upCoreColor
          : upColor;
      }
      // check if the parameter is going up when we want it to go down.
      else if (paramValue < afterRankupValue && smallerIsBetter)
      {
        // mark it as "a bad thing" color.
        colorIndex = isCore
          ? downCoreColor
          : downColor;
      }

      // NOTE:
      // if none of the above chained if-conditions triggered, it could be a non-change.

      // return the calculated color index.
      return colorIndex;
    };

    // a small helper function for building the modifier's text.
    const buildModifierText = (modifier, isFlat) =>
    {
      const isPercent = isFlat
        ? ``
        : `%`;
      const isPositive = modifier >= 0
        ? '+'
        : String.empty;
      return `(${isPositive}${modifier}${isPercent})`;
    };

    // deconstruct the info we need from the panel parameter.
    const { parameterId: paramId, perRank: modifier, isFlat, isCore } = panelParameter;

    // determine the current value of the parameter.
    const paramValue = this.currentActor.longParam(paramId);

    // calculate the post-rankup amount.
    const afterRankupValue = calculateAfterRankUpValue(paramValue, modifier, isFlat);

    // calculate the color index.
    const modifierColorIndex = determineModifierColorIndex(paramId, isCore, paramValue, afterRankupValue);

    // build the modifier's text.
    const modifierText = buildModifierText(modifier, isFlat);

    // return our values.
    return { modifierColorIndex, modifierText };
  }

  /**
   * Determines whether or not the parameter should be marked as "improved" if it is negative.
   * @param {number} parameterId The paramId to check if smaller is better for.
   * @returns {boolean} True if the smaller is better for this paramId, false otherwise.
   */
  isNegativeGood(parameterId)
  {
    // grab the list of ids that qualify as "smaller is better".
    const smallerIsBetterParameterIds = this.getSmallerIsBetterParameterIds();

    // check to see if our id is in that special list.
    const smallerIsBetter = smallerIsBetterParameterIds.includes(parameterId);

    // return the check.
    return smallerIsBetter;
  }

  /**
   * The collection of long-form parameter ids that should have a positive color indicator
   * when there is a decrease of value in that parameter from the panel.
   * @returns {number[]}
   */
  getSmallerIsBetterParameterIds()
  {
    return [
      18,   // trg
      22,   // mcr
      23,   // tcr
      24,   // pdr
      25,   // mdr
      26    // fdr
    ];
  }

  /**
   * Determines whether or not the parameter should be suffixed with a % character.
   * This is specifically for parameters that truly are ranged between 0-100 and RNG.
   * @param {number} parameterId The paramId to check if is a percent.
   * @returns {boolean}
   */
  isPercentParameter(parameterId)
  {
    // grab the list of ids that qualify as "needs a % symbol".
    const isPercentParameterIds = this.getIsPercentParameterIds();

    // check to see if our id is in that special list.
    const isPercent = isPercentParameterIds.includes(parameterId);

    // return the check.
    return isPercent;
  }

  /**
   * The collection of long-form parameter ids that should be decorated with a `%` symbol.
   * @returns {number[]}
   */
  getIsPercentParameterIds()
  {
    return [
      9,    // eva
      14,   // cnt
      20,   // rec
      21,   // pha
      22,   // mcr
      23,   // tcr
      24,   // pdr
      25,   // mdr
      26,   // fdr
      27    // exr
    ];
  }

  /**
   * Overrides {@link #itemHeight}.<br>
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 2;
  }
}

//endregion Window_SdpParameterList

//region Window_SdpPoints
/**
 * The SDP window containing the amount of SDP points a given actor has.
 */
class Window_SdpPoints extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that defines this window's shape.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    this._actor = null;
  }

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    this.contents.clear();
    this.drawPoints();
  }

  /**
   * Draws the SDP icon and number of points this actor has.
   */
  drawPoints()
  {
    this.drawSdpIcon();
    this.drawSdpPoints();
    this.drawSdpFace();
  }

  /**
   * Draws the "SDP icon" representing points.
   */
  drawSdpIcon()
  {
    const x = 200;
    const y = 2;
    const iconIndex = J.SDP.Metadata.sdpIconIndex;
    this.drawIcon(iconIndex, x, y);
  }

  /**
   * Draws the SDP points the actor currently has.
   */
  drawSdpPoints()
  {
    // don't draw the points if the actor is unavailable.
    if (!this._actor) return;

    const points = this._actor.getSdpPoints();
    const x = 240;
    const y = 0;
    const textWidth = 300;
    const alignment = "left";
    this.drawText(points, x, y, textWidth, alignment);
  }

  /**
   * A wrapper around the drawing of the actor's face- in case we need logic.
   */
  drawSdpFace()
  {
    // don't draw the points if the actor is unavailable.
    if (!this._actor) return;

    this.drawFace(this._actor.faceName(), this._actor.faceIndex(), 0, 0,   // x,y
      128, 40);// w,h
  }

  /**
   * Sets the actor focus for the SDP points window. Implicit refresh.
   * @param {Game_Actor} actor The actor to display SDP info for.
   */
  setActor(actor)
  {
    this._actor = actor;
    this.refresh();
  }
}

//endregion Window_SdpPoints

//region Window_SdpRankData
class Window_SdpRankData extends Window_Base
{
  /**
   * The color index of the rarity of the panel selected.
   * @type {number}
   */
  rarityColorIndex = 0;

  /**
   * The text describing the rarity of this panel.
   * @type {string}
   */
  rarityText = String.empty;

  /**
   * The current rank of the panel selected.
   * @type {number}
   */
  currentRank = 0;

  /**
   * The max rank of the panel selected.
   * @type {number}
   */
  maxRank = 0;

  /**
   * The calculated amount to rank up the selected panel.
   * @type {number}
   */
  costToNext = 0;

  /**
   * The currently-available SDP points the actor has.
   * @type {number}
   */
  #availableSdpPoints = 0;

  /**
   * Constructor.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Sets all the various data points for the window.
   */
  setRankData(rarityColor, rarityText, currentRank, maxRank, costToNext, sdpPoints)
  {
    this.rarityColorIndex = rarityColor;
    this.rarityText = rarityText;
    this.currentRank = currentRank;
    this.maxRank = maxRank;
    this.costToNext = costToNext;
    this.#availableSdpPoints = sdpPoints;
  }

  /**
   * Implements {@link Window_Base.drawContent}.<br>
   * Draws the various SDP rank-related details.
   */
  drawContent()
  {
    // draw the rarity information.
    this.drawPanelRarity(0);

    // draw the cost-to-next-rank data, colorized.
    this.drawCostDetails(1);

    // draw the current/max rank data.
    this.drawRankDetails(2);
  }

  /**
   * Draws the rarity information for this panel.
   * @param {number} rowCount The row number this should be drawn on.
   */
  drawPanelRarity(rowCount)
  {
    // define some variables.
    const lh = this.lineHeight();
    const ox = 0;
    const rowY = lh * rowCount;

    const rarityColor = ColorManager.textColor(this.rarityColorIndex);
    this.changeTextColor(rarityColor);
    this.toggleBold();
    this.toggleItalics();
    this.modFontSize(16);
    this.drawText(this.rarityText, ox, rowY, 200, "left");
    this.resetFontSettings();
  }

  /**
   * Draws the cost information of ranking this panel up.
   * @param {number} rowCount The row number this should be drawn on.
   */
  drawCostDetails(rowCount)
  {
    // define some variables.
    const lh = this.lineHeight();
    const ox = 0;
    const rowY = lh * rowCount;

    // calculate the color (not-index) for the cost.
    const costColor = this.#determineCostColor(this.costToNext);

    // draw the cost to rank up this panel.
    this.drawText(`Cost:`, ox, rowY, 200, "left");
    if (costColor)
    {
      this.changeTextColor(costColor);
      this.drawText(`${this.costToNext}`, ox + 100, rowY, 120, "left");
      this.resetTextColor();
    }
    else
    {
      this.drawText(`---`, ox + 100, rowY, 80, "left");
    }
  }

  /**
   * Draws the current rank information for this panel.
   * @param {number} rowCount The row number this should be drawn on.
   */
  drawRankDetails(rowCount)
  {
    // define some variables.
    const lh = this.lineHeight();
    const ox = 0;
    const rowY = lh * rowCount;

    // draw the current and max rank, colorized.
    this.drawText(`Rank:`, ox, rowY, 200, "left");
    this.changeTextColor(this.#determinePanelRankColor(this.currentRank, this.maxRank));
    this.drawText(`${this.currentRank}`, ox + 55, rowY, 50, "right");
    this.resetTextColor();
    this.drawText(`/`, ox + 110, rowY, 30, "left");
    this.drawText(`${this.maxRank}`, ox + 130, rowY, 50, "left");
  }

  /**
   * Determines the color of the "current rank" number text.
   * @param {number} currentRank The current rank of this panel.
   * @param {number} maxRank The maximum rank of this panel.
   * @returns {number} The id of the color.
   */
  #determinePanelRankColor(currentRank, maxRank)
  {
    // if there is no ranks in this panel, then use this color.
    if (currentRank === 0) return ColorManager.damageColor();

    // if we have ranks, but still aren't max, use this color.
    if (currentRank < maxRank) return ColorManager.crisisColor();

    // we have exceeded the max rank, so use this color.
    if (currentRank >= maxRank) return ColorManager.powerUpColor();

    // who knows what situation this happens in, but return normal if we do.
    return ColorManager.normalColor();
  }

  /**
   * Determines the color of the "current rank" number text.
   * @param {number} rankUpCost The cost to rank up this panel.
   * @returns {number} The id of the color.
   */
  #determineCostColor(rankUpCost)
  {
    // if the cost is 0, then just return, it doesn't matter.
    if (rankUpCost === 0) return null;

    const currentSdpPoints = this.#availableSdpPoints;

    if (rankUpCost <= currentSdpPoints)
    {
      return ColorManager.powerUpColor();
    }
    else
    {
      return ColorManager.damageColor();
    }
  }
}

//endregion Window_SdpRankData

//region Window_SdpRewardList
class Window_SdpRewardList extends Window_Command
{
  /**
   * The list of rewards for the currently-selected panel.
   * @type {PanelRankupReward[]}
   */
  panelRewards = [];

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  setRewards(rewards)
  {
    this.panelRewards = rewards;
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Creates the command list of rewards granted by this SDP.
   */
  makeCommandList()
  {
    // grab all the omnipedia listings available.
    const commands = this.buildCommands();

    // add all the built commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all SDP rewards as commands to the list.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    const commands = [];

    if (!this.panelRewards) return commands;

    this.panelRewards.forEach(panelReward =>
    {
      const { rewardName, rankRequired } = panelReward;

      // determine the icon for the reward..
      let rankText = String.empty;
      let iconIndex = 0;
      switch (rankRequired)
      {
        case -1:
          iconIndex = 75;
          rankText = 'EACH';
          break;
        case 0:
          iconIndex = 73;
          rankText = 'MAX';
          break;
        default:
          iconIndex = 86;
          rankText = rankRequired.padZero(3);
          break;
      }


      // identify the right-aligned current and bonus amounts.
      let parameterData = `Rank: ${rankText}`;

      // construct the command.
      const command = new WindowCommandBuilder(rewardName)
        .setSymbol(rewardName)
        .setIconIndex(iconIndex)
        .setRightText(parameterData)
        .setExtensionData(panelReward)
        .build();

      commands.push(command);
    });

    return commands;
  }
}

//endregion Window_SdpRewardList