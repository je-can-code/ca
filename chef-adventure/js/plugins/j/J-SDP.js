//region Introduction
/* eslint-disable */
/*:
 * @target MZ
 * @plugindesc
 * [v1.3.0 SDP] Enables the SDP system, aka Stat Distribution Panels.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @base J-DropsControl
 * @orderAfter J-ABS
 * @orderAfter J-Base
 * @orderAfter J-DropsControl
 * @help
 * ============================================================================
 * This plugin is a form of "stat distribution"- an alternative to the standard
 * of leveling up to raise an actor's stats.
 *
 * Integrates with others of mine plugins:
 * - J-ControlledDrops; enables usage of item-as-panel drops.
 * - J-CriticalFactors; enables usage of CDM/CDR as parameters on panels.
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
 * - Stat Distribution Panels being leveled or maxed can unlock other SDPs.
 *
 * ============================================================================
 *
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
 * @param SDP Switch
 * @parent SDPconfigs
 * @type switch
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 1
 *
 * @param SDP Icon
 * @parent SDPconfigs
 * @type number
 * @desc The default iconIndex to represent "SDP points".
 * @default 306
 *
 * @param SDP Gained Text
 * @parent SDPconfigs
 * @type string
 * @desc The text displayed after a battle is won alongside stuff like "X exp earned!".
 * @default SDP points earned!
 *
 * @param JABSconfigs
 * @text JABS-ONLY CONFIG
 * @desc Without JABS, these configurations are irrelevant.
 *
 * @param SDP JABS Menu Icon
 * @parent JABSconfigs
 * @type number
 * @desc The icon to show next to the command in the JABS quick menu.
 * @default 2563
 *
 * @param Show In Both
 * @parent JABSconfigs
 * @type boolean
 * @desc If ON, then show in both JABS quick menu and main menu, otherwise only JABS quick menu.
 * @default false
 *
 * @param SDPs
 * @parent SDPconfigs
 * @text Stat Distribution Panels
 * @type struct<SDPStruct>[]
 * @desc All available Stat Distribution Panels that are available to be unlocked.
 * @default ["{\"overview\":\"\",\"key\":\"SCP_1\",\"name\":\"Sword Cutslash Panel\",\"iconIndex\":\"1622\",\"unlocked\":\"false\",\"topFlavorText\":\"Learn various sword beam techniques as you level this panel up.\",\"description\":\"A panel that has a super-comprehensive list of how to be a badass swordsman.|You should probably read this if you have the time.\",\"panelData\":\"\",\"panelParameters\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"25.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"4.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"2.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"8\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"19\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"15\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"4.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"16\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"2.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"17\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"1.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\"]\",\"rankupRewards\":\"[\\\"{\\\\\\\"rankRequired\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"effect\\\\\\\":\\\\\\\"a.learnSkill(50);\\\\\\\"}\\\",\\\"{\\\\\\\"rankRequired\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"effect\\\\\\\":\\\\\\\"a.learnSkill(31);\\\\\\\"}\\\",\\\"{\\\\\\\"rankRequired\\\\\\\":\\\\\\\"12\\\\\\\",\\\\\\\"effect\\\\\\\":\\\\\\\"a.learnSkill(34);\\\\\\\"}\\\"]\",\"cost\":\"\",\"maxRank\":\"20\",\"baseCost\":\"110\",\"flatGrowthCost\":\"40\",\"multGrowthCost\":\"1.2\"}","{\"overview\":\"\",\"key\":\"SDP_1\",\"name\":\"Some Dumb Panel\",\"iconIndex\":\"2\",\"unlocked\":\"true\",\"topFlavorText\":\"This is probably the most worthless panel you ever encountered.\",\"description\":\"Some really dumb panel that does likely nothing good for you.|I mean, look at it, it kills all your stats!\",\"panelData\":\"\",\"panelParameters\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"-5.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"-5.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"-2.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"false\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"-2.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"false\\\\\\\"}\\\"]\",\"rankupRewards\":\"[]\",\"cost\":\"\",\"maxRank\":\"100\",\"baseCost\":\"10\",\"flatGrowthCost\":\"10\",\"multGrowthCost\":\"1.20\"}","{\"overview\":\"\",\"key\":\"SEP_1\",\"name\":\"Simple Evil Porpoise\",\"iconIndex\":\"14\",\"unlocked\":\"false\",\"topFlavorText\":\"This panel was dropped from an enemy. Pretty cool, huh?\",\"description\":\"This panel uses a single vertical bar to signal that|the text should slide to the second line in the help window.\",\"panelData\":\"\",\"panelParameters\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"5.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"false\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"5.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"15\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"30.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"27\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\"]\",\"rankupRewards\":\"[\\\"{\\\\\\\"rankRequired\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"effect\\\\\\\":\\\\\\\"$gameSystem.unlockSdp(\\\\\\\\\\\\\\\"SEP_2\\\\\\\\\\\\\\\");\\\\\\\"}\\\"]\",\"cost\":\"\",\"maxRank\":\"10\",\"baseCost\":\"110\",\"flatGrowthCost\":\"40\",\"multGrowthCost\":\"1.2\"}","{\"overview\":\"\",\"key\":\"SEP_2\",\"name\":\"Super Evil Porpoise\",\"iconIndex\":\"30\",\"unlocked\":\"false\",\"topFlavorText\":\"This panel is the result of maxing out the previous panel.\",\"description\":\"Rank 0 corresponds to whatever the max level of a panel is.|That allows you to change the max level later without having to change rewards.\",\"panelData\":\"\",\"panelParameters\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"15.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"false\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"10.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"8\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"19\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"10.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\"]\",\"rankupRewards\":\"[]\",\"cost\":\"\",\"maxRank\":\"20\",\"baseCost\":\"250\",\"flatGrowthCost\":\"150\",\"multGrowthCost\":\"2.25\"}","{\"overview\":\"\",\"key\":\"CASH_1\",\"name\":\"Cash Munny💰🤑\",\"iconIndex\":\"2048\",\"unlocked\":\"true\",\"topFlavorText\":\"Rank this panel up to just gain tons of money!\",\"description\":\"Rewards can be anything you want them to be (or at least, can code in javascript).|For instance, this panel's rewards all include cashmunnyblingbling💲.\",\"panelData\":\"\",\"panelParameters\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"25.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"perRank\\\\\\\":\\\\\\\"10.00\\\\\\\",\\\\\\\"isFlat\\\\\\\":\\\\\\\"false\\\\\\\"}\\\"]\",\"rankupRewards\":\"[\\\"{\\\\\\\"rankRequired\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"effect\\\\\\\":\\\\\\\"SoundManager.playShop();\\\\\\\\nconst c = $gameSystem.getRankByActorAndKey(a.actorId(), \\\\\\\\\\\\\\\"CASH_1\\\\\\\\\\\\\\\") + 1;\\\\\\\\nconst munny = Math.round(Math.random(10+c) * 1000);\\\\\\\\n$gameParty.gainGold(munny);\\\\\\\"}\\\"]\",\"cost\":\"\",\"maxRank\":\"10\",\"baseCost\":\"15\",\"flatGrowthCost\":\"10\",\"multGrowthCost\":\"1.05\"}"]
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
/*~struct~SDPStruct:
 * @param overview
 * @text MAIN DATA
 *
 * @param key
 * @parent overview
 * @type string
 * @text Unique Key
 * @desc A unique identifier for this panel.
 * Only letters, numbers, and underscores are recognized.
 * @default SCP_1
 *
 * @param name
 * @parent overview
 * @type string
 * @text Name
 * @desc The name of the panel.
 * Displayed in the list of panels on the left.
 * @default Some Cool Panel
 *
 * @param iconIndex
 * @parent overview
 * @type number
 * @text Icon Index
 * @desc The index of the icon to represent this panel.
 * @default 1
 *
 * @param rarity
 * @parent overview
 * @text Panel Rarity
 * @desc The rarity of a panel determines its color in the SDP list. This determines the SDP name color.
 * @type select
 * @option Common
 * @option Magical
 * @option Rare
 * @option Epic
 * @option Legendary
 * @option Godlike
 * @default Common
 *
 * @param unlocked
 * @parent overview
 * @text Is Unlocked
 * @type boolean
 * @desc If this is ON/true, then this panel will be unlocked when a new game is started.
 * @default false
 *
 * @param topFlavorText
 * @parent overview
 * @type string
 * @text Top Flavor Text
 * @desc An extra line for flavor text, or whatever you want.
 * Shows up in the details window below the name.
 * @default Learn the skill "Lunge" when this panel is maxed.
 *
 * @param description
 * @parent overview
 * @type string
 * @text Help Window Text
 * @desc Some text maybe describing the panel.
 * Shows up in the bottom help window.
 * @default Some really cool panel that has lots of hardcore powers.
 *
 * @param panelData
 * @text Panel Details
 *
 * @param panelParameters
 * @parent panelData
 * @type struct<PanelParameterStruct>[]
 * @text Panel Parameters
 * @desc Add one or more parameters here that will grow as this panel ranks up. Per rank can be negative.
 * @default []
 *
 * @param rankupRewards
 * @parent panelData
 * @type struct<PanelRankupRewardStruct>[]
 * @text Rank-up Rewards
 * @desc A collection of all rewards given to the player while ranking up this SDP.
 * @default []
 *
 *
 * @param cost
 * @text RANK UP DATA
 *
 * @param maxRank
 * @parent cost
 * @type number
 * @text Maximum Rank
 * @desc The maximum rank this panel can reach.
 * @default 10
 *
 * @param baseCost
 * @parent cost
 * @type number
 * @text COST: Base Component
 * @desc The base formula is:
 * baseCost + (multGrowthCost * (flatGrowthCost * rank))
 * @default 110
 *
 * @param flatGrowthCost
 * @parent cost
 * @type number
 * @text COST: Flat Component
 * @desc The base formula is:
 * baseCost + (multGrowthCost * (flatGrowthCost * rank))
 * @default 40
 *
 * @param multGrowthCost
 * @parent cost
 * @type number
 * @text COST: Multiplier Component
 * @desc The base formula is:
 * baseCost + (multGrowthCost * (flatGrowthCost * rank))
 * @decimals 2
 * @default 1.2
 */
/*~struct~PanelParameterStruct:
 * @param parameterId
 * @text Parameter Id
 * @desc 0-7 are core parameters, 8-17 are ex-parameters, 18-27 are sp-parameters.
 * @type number
 * @type select
 * @option Max HP
 * @value 0
 * @option Max MP
 * @value 1
 * @option Max TP
 * @value 30
 * @option HP Regen
 * @value 15
 * @option MP Regen
 * @value 16
 * @option TP Regen
 * @value 17
 * @option Power
 * @value 2
 * @option Endurance
 * @value 3
 * @option Force
 * @value 4
 * @option Resist
 * @value 5
 * @option Speed
 * @value 6
 * @option Luck
 * @value 7
 * @option Hit Rate
 * @value 8
 * @option Evasion Rate
 * @value 9
 * @option Crit Chance
 * @value 10
 * @option Crit Damage Multiplier
 * @value 28
 * @option Crit Damage Reduction
 * @value 29
 * @option Crit Evasion
 * @value 11
 * @option Magic Evasion
 * @value 12
 * @option Magic Reflect Rate
 * @value 13
 * @option Counter Rate
 * @value 14
 * @option Targeting Rate
 * @value 18
 * @option Guard Rate
 * @value 19
 * @option Recovery Rate
 * @value 20
 * @option Pharmacy Rate
 * @value 21
 * @option Experience Rate
 * @value 27
 * @option MP Cost Reduction
 * @value 22
 * @option TP Cost Reduction
 * @value 23
 * @option Phys DMG Reduction
 * @value 24
 * @option Magi DMG Reduction
 * @value 25
 * @option Floor DMG Reduction
 * @value 26
 * @default 0
 *
 * @param perRank
 * @text Growth per Rank
 * @type number
 * @decimals 2
 * @min -999999
 * @desc The amount that will this parameter will grow per rank.
 * This can be negative.
 * @default 10
 *
 * @param isFlat
 * @text Growth Type
 * @desc Flat growth is a fixed amount per rank.
 * Percent growth is percent of the base parameter per rank.
 * @type boolean
 * @on Flat
 * @off Percent
 * @default true
 *
 * @param isCore
 * @text Is Core Parameter
 * @desc Core parameters are emphasized on the SDP scene, but do nothing special.
 * @type boolean
 * @on Core
 * @off Regular
 * @default false
 */
/*~struct~PanelRankupRewardStruct:
 * @param rankRequired
 * @type number
 * @min -1
 * @text Rank Required
 * @desc The rank required for this reward to be executed. Rank 0 is the same as the max rank.
 * @default 0
 *
 * @param effect
 * @type multiline_string
 * @text Reward Effect
 * @desc Use Javascript to execute code when the panel reaches the given rank. a = the actor leveling the panel.
 * @default a.learnSkill(10);
 */
/* eslint-enable */

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
 * The `metadata` associated with this plugin.
 */
J.SDP.Metadata = {};
J.SDP.Metadata.Name =`J-SDP`;
J.SDP.Metadata.Version = '1.3.0';

/**
 * A collection of helpful functions to use throughout the plugin.
 */
J.SDP.Helpers = {};

/**
 * Translates the raw JSON from the plugin parameters into the SDPs available throughout
 * the game.
 * @param {string} obj The raw JSON extracted from the plugin parameters.
 * @returns {StatDistributionPanel[]} A collection of all potential SDPs.
 */
J.SDP.Helpers.TranslateSDPs = function(obj)
{
  const parsedBlob = JSON.parse(obj);
  const parsedPanels = [];

  parsedBlob.forEach(panelBlob =>
  {
    // parse and translate all properties to the correct type.
    const parsedPanel = JSON.parse(panelBlob);

    // parse and assign all the various panel parameters.
    const parsedPanelParameters = [];
    const panelParametersBlob = parsedPanel.panelParameters;
    const halfParsedParametersBlob = JSON.parse(panelParametersBlob);
    halfParsedParametersBlob.forEach(paramBlob =>
    {
      const parsedParameter = JSON.parse(paramBlob);
      const panelParameter = new PanelParameter({
        parameterId: parseInt(parsedParameter.parameterId),
        perRank: parseFloat(parsedParameter.perRank),
        isFlat: (parsedParameter.isFlat === "true"),
        isCore: (parsedParameter.isCore === "true"),
      });
      parsedPanelParameters.push(panelParameter);
    });

    // parse out all the panel rewards if there are any.
    const parsedPanelRewards = [];
    const panelRewardsBlob = parsedPanel.rankupRewards;
    if (panelRewardsBlob)
    {
      const halfParsedRewardsBlob = JSON.parse(panelRewardsBlob);
      halfParsedRewardsBlob.forEach(reward =>
      {
        const parsedReward = JSON.parse(reward);
        const panelReward = new PanelRankupReward(
          parseInt(parsedReward.rankRequired),
          parsedReward.effect);
        parsedPanelRewards.push(panelReward);
      });
    }

    // parse the rarity color.
    const rarityColorIndex = SDP_Rarity.fromRarityToColor(parsedPanel.rarity);

    // create the panel.
    const panel = new StatDistributionPanel({
      name: parsedPanel.name,
      key: parsedPanel.key,
      iconIndex: parseInt(parsedPanel.iconIndex),
      unlocked: (parsedPanel.unlocked === "true"),
      description: parsedPanel.description,
      maxRank: parseInt(parsedPanel.maxRank),
      baseCost: parseInt(parsedPanel.baseCost),
      flatGrowthCost: parseInt(parsedPanel.flatGrowthCost),
      multGrowthCost: parseFloat(parsedPanel.multGrowthCost),
      topFlavorText: parsedPanel.topFlavorText,
      panelRewards: parsedPanelRewards,
      panelParameters: parsedPanelParameters,
      rarity: rarityColorIndex,
    });

    parsedPanels.push(panel);
  });

  return parsedPanels;
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.SDP.PluginParameters = PluginManager.parameters(J.SDP.Metadata.Name);
J.SDP.Metadata = {
  ...J.SDP.Metadata,

  /**
   * The translated SDPs from the plugin parameters.
   */
  Panels: [],

  /**
   * The iconIndex that will be used to represent the SDP points earned for an actor.
   * @type {number}
   */
  PointsIcon: parseInt(J.SDP.PluginParameters['SDP Icon']),

  /**
   * The rewards text displayed after a battle is won.
   * @type {string}
   */
  VictoryText: (J.SDP.PluginParameters['SDP Gained Text']),

  /**
   * The switch id that adds visibility for this in menus.
   * @type {number}
   */
  Switch: parseInt(J.SDP.PluginParameters['SDP Switch']),

  /**
   * The icon index for the SDP option in the JABS quick menu.
   * @type {number}
   */
  JabsMenuIcon: parseInt(J.SDP.PluginParameters['SDP JABS Menu Icon']),

  /**
   * Whether or not to show this in both the JABS quick menu AND main menu, or just the JABS quick menu.
   * @type {boolean}
   */
  JabsShowBoth: J.SDP.PluginParameters['Show In Both'] === "true",

  /**
   * The command name for the SDP command.
   */
  CommandName: "Distribute",
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.SDP.Aliased = {
  BattleManager: {},
  DataManager: new Map(),
  JABS_Engine: new Map(),

  Game_Action: new Map(),
  Game_Actor: new Map(),
  Game_Enemy: new Map(),
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

//region plugin commands
/**
 * Plugin command for calling the SDP scene/menu.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Call SDP Menu", () =>
{
  Scene_SDP.callScene();
});

/**
 * Plugin command for unlocking a SDP to be leveled.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Unlock SDP", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    $gameSystem.unlockSdp(key);
  });
});

/**
 * Plugin command for locking a SDP to no longer be available for the player.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Lock SDP", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    $gameSystem.lockSdp(key);
  });
});

/**
 * Plugin command for modifying an actor's SDP points.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Modify SDP points", args =>
{
  let {actorId, sdpPoints} = args;
  actorId = parseInt(actorId);
  sdpPoints = parseInt(sdpPoints);
  $gameActors
    .actor(actorId)
    .modSdpPoints(sdpPoints);
});

/**
 * Plugin command for modifying all current party members' SDP points.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Modify party SDP points", args =>
{
  let {sdpPoints} = args;
  sdpPoints = parseInt(sdpPoints);
  $gameParty.members().forEach(member =>
  {
    member.modSdpPoints(sdpPoints);
  });
});
//endregion plugin commands
//endregion Introduction

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
//endregion SDP_RankupReward

//region SDP_Rarity
class SDP_Rarity
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
//endregion SDP_Rarity

//region RPG_Item
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
Object.defineProperty(RPG_Item.prototype, "sdpKey",
  {
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
 * Extends the creation of the rewards object to include SDP points.
 */
J.SDP.Aliased.BattleManager.makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function()
{
  J.SDP.Aliased.BattleManager.makeRewards.call(this);
  this._rewards = {
    ...this._rewards,
    sdp: $gameTroop.sdpTotal(),
  };
};

/**
 * Extends the gaining of rewards to also gain SDP points.
 */
J.SDP.Aliased.BattleManager.gainRewards = BattleManager.gainRewards;
BattleManager.gainRewards = function()
{
  J.SDP.Aliased.BattleManager.gainRewards.call(this);
  this.gainSdpPoints();
};

/**
 * Performs a gain of the SDP points for all members of the party after battle.
 */
BattleManager.gainSdpPoints = function()
{
  const sdpPoints = this._rewards.sdp;
  $gameParty.members().forEach(member =>
  {
    member.modSdpPoints(sdpPoints);
  });
};

J.SDP.Aliased.BattleManager.displayRewards = BattleManager.displayRewards;
BattleManager.displayRewards = function()
{
  this.displaySdp();
  J.SDP.Aliased.BattleManager.displayRewards.call(this);
};

BattleManager.displaySdp = function()
{
  const { sdp } = this._rewards;
  if (sdp > 0)
  {
    const text = `${sdp} ${J.SDP.Metadata.VictoryText}`;
    $gameMessage.add("\\." + text);
  }
};
//endregion BattleManager

//region DataManager
/**
 * Updates existing save files with the updated SDP plugin metadata.
 */
J.SDP.Aliased.DataManager.set('extractSaveContents', DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
  // grab the sdp data from the current plugin parameters and the save file.
  const fromPluginParamsPanels = J.SDP.Helpers.TranslateSDPs(J.SDP.PluginParameters['SDPs']);
  const fromSaveFilePanels = contents.system._j._sdp._panels;

  // iterate over all the panels in the save file.
  fromSaveFilePanels.forEach(savedSdp =>
  {
    // grab the most updated panel data from plugin parameters that matches this key.
    const updatedSdp = fromPluginParamsPanels.find(settingsSdp => settingsSdp.key === savedSdp.key);

    // if the panel no longer exists, stop processing.
    if (!updatedSdp)
    {
      console.warn('no SDP found for key', savedSdp.key);
      return;
    }

    // if it was unlocked before, it stays unlocked.
    if (savedSdp.isUnlocked())
    {
      updatedSdp.unlock();
    }
  });

  // update the save file data with the modified plugin settings SDP data.
  contents.system._j._sdp._panels = fromPluginParamsPanels;

  // perform original logic.
  J.SDP.Aliased.DataManager.get('extractSaveContents').call(this, contents);
};
//endregion DataManager

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
    J.SDP.Aliased.JABS_Engine.get('gainBasicRewards').call(this, enemy, actor);

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
    $gameParty.members().forEach(member => member.modSdpPoints(sdpPoints));

    // get the true amount obtained after multipliers for the leader.
    const sdpMultiplier = actor.getBattler().sdpMultiplier();
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

    const sdpLog = new MapLogBuilder()
      .setupSdpAcquired(battler.battlerName(), sdpPoints)
      .build();
    $gameTextLog.addLog(sdpLog);
  };
}
//endregion JABS_Engine

//region Game_Action
/**
 * Extends {@link #applyGlobal}.
 * Also handles any SDP effects such as unlocking.
 */
J.SDP.Aliased.Game_Action.set('applyGlobal', Game_Action.prototype.applyGlobal);
Game_Action.prototype.applyGlobal = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_Action.get('applyGlobal').call(this);

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
  $gameSystem.unlockSdp(item.sdpKey);
};
//endregion Game_Action

//region Game_Actor
/**
 * Adds new properties to the actors that manage the SDP system.
 */
J.SDP.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_Actor.get('initMembers').call(this);

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

  // a find function for grabbing the appropriate sdp ranking by its key.
  const finding = panelRank => panelRank.key === key;

  // find the sdp ranking.
  const existingRanking = rankings.find(finding);

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

  // iterate over each of them and add the multiplier up.
  objectsToCheck.forEach(obj => (multiplier += this.extractSdpMultiplier(obj)), this);

  // return the factor form by now dividing by 100.
  return (multiplier / 100);
};

/**
 * Gets all multipliers that this database object contains.
 * @param {RPG_BaseItem} referenceData The database data of the object.
 * @returns {number}
 */
Game_Actor.prototype.extractSdpMultiplier = function(referenceData)
{
  if (!referenceData || !referenceData.note) return 0;

  let sdpMultiplier = 0;
  const structure = J.SDP.RegExp.SdpMultiplier;
  const notedata = referenceData.note.split(/[\r\n]+/);
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      sdpMultiplier += parseInt(RegExp.$1);
    }
  });

  return sdpMultiplier;
};

/**
 * Ranks up this actor's panel by key.
 * @param {string} panelKey The key of the panel to rank up.
 */
Game_Actor.prototype.rankUpPanel = function(panelKey)
{
  this.getSdpByKey(panelKey).rankUp();
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
    const panelParameters = $gameSystem
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
    const panelParameters = $gameSystem
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
  const baseParam = J.SDP.Aliased.Game_Actor.get("param").call(this, paramId);

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
  const baseParam = J.SDP.Aliased.Game_Actor.get("xparam").call(this, xparamId);

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
  const baseParam = J.SDP.Aliased.Game_Actor.get("sparam").call(this, sparamId);

  const panelModifications = this.getSdpBonusForNonCoreParam(sparamId, baseParam, 18);
  const result = baseParam + panelModifications;
  return result;
};

/**
 * Extends {@link #maxTp}.
 * Includes bonuses from panels as well.
 * @returns {number}
 */
J.SDP.Aliased.Game_Actor.set("maxTp", Game_Actor.prototype.maxTp);
Game_Actor.prototype.maxTp = function()
{
  // perform original logic.
  const baseMaxTp = J.SDP.Aliased.Game_Actor.get("maxTp").call(this);

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
    const panelParameters = $gameSystem
      .getSdpByKey(panelRanking.key)
      .getPanelParameterById(30); // TODO: generalize this whole thing.

    // validate we have any parameters from this panel.
    if (panelParameters.length)
    {
      // iterate over each panel parameter.
      panelParameters.forEach(panelParameter =>
      {
        // extract the relevant details.
        const { perRank, isFlat } = panelParameter;
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
  const dropList = J.SDP.Aliased.Game_Enemy.get("extraDrops").call(this);

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
  const panel = $gameSystem.getSdpByKey(this.enemy().sdpDropKey);

  // if the enemy has a panel that isn't defined, then don't drop it.
  if (!panel)
  {
    console.warn(`Panel of key ${this.enemy().sdpDropKey} is not defined, but was trying to be dropped.`);
    console.warn(`Consider defining a panel with the key of ${this.enemy().sdpDropKey}.`);
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
  const [key, chance, itemId] = this.getSdpDropData();

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

//region Game_System
/**
 * Hooks in and initializes the SDP system.
 */
J.SDP.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_System.get('initialize').call(this);

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
   * The collection of all defined SDPs.
   * @type {StatDistributionPanel[]}
   */
  this._j._sdp._panels = J.SDP.Helpers.TranslateSDPs(J.SDP.PluginParameters['SDPs']);

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
 * Updates the list of all available difficulties from the latest plugin metadata.
 */
J.SDP.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_System.get('onAfterLoad').call(this);

  // update from the latest plugin metadata.
  this.updateSdpsFromPluginMetadata();
};

/**
 * Updates the panel list from the latest plugin metadata.
 */
Game_System.prototype.updateSdpsFromPluginMetadata = function()
{
  // refresh the panel list from the plugin metadata.
  this._j._sdp._panels ??= J.SDP.Helpers.TranslateSDPs(J.SDP.PluginParameters['SDPs']);
};

/**
 * Gets all panels currently built from the plugin parameters.
 * @returns {StatDistributionPanel[]}
 */
Game_System.prototype.getAllSdps = function()
{
  return this._j._sdp._panels;
};

/**
 * Gets a single panel based on the key provided.
 * @param {string} key The less-friendly unique key that represents this SDP.
 * @returns {StatDistributionPanel}
 */
Game_System.prototype.getSdpByKey = function(key)
{
  // if we don't have panels to search through, don't do it.
  if (!this.getAllSdps().length) return null;

  const foundPanel = this.getAllSdps().find(panel => panel.key === key);
  return foundPanel;
};

/**
 * Gets all panels that match the keys provided.
 * @param {string[]} keys The list of keys to find panels for.
 * @returns {StatDistributionPanel[]}
 */
Game_System.prototype.getSdpsByKeys = function(keys)
{
  // if we don't have panels to search through, don't do it.
  if (!this.getAllSdps().length) return [];

  return this.getAllSdps().filter(sdp => keys.includes(sdp.key));
};

/**
 * Gets all currently-unlocked `StatDistributionPanel`s.
 * @returns {StatDistributionPanel[]} All currently unlocked SDPs.
 */
Game_System.prototype.getUnlockedSdps = function()
{
  // if we don't have panels to search through, don't do it.
  if (!this.getAllSdps().length) return [];

  const panels = this.getAllSdps();

  const unlockedPanels = panels.filter(panel => panel.isUnlocked());

  return unlockedPanels;
};

/**
 * Gets the number of panels currently unlocked for the party.
 * @returns {number}
 */
Game_System.prototype.getUnlockedSdpsCount = function()
{
  return this.getUnlockedSdps().length;
};

/**
 * Unlocks a SDP by its key.
 * @param {string} key The key of the SDP to unlock.
 */
Game_System.prototype.unlockSdp = function(key)
{
  const panel = this.getSdpByKey(key);
  if (panel)
  {
    panel.unlock();
  }
  else
  {
    console.error(`The SDP key of ${key} was not found in the list of panels to unlock.`);
  }
};

/**
 * Unlocks all SDPs currently in the plugin parameters.
 *
 * This is primarily a debug utility.
 */
Game_System.prototype.unlockAllSdps = function()
{
  this._j._sdp._panels.forEach(panel => panel.unlock());
};

/**
 * Locks a SDP by its key.
 * @param {string} key The key of the SDP to lock.
 */
Game_System.prototype.lockSdp = function(key)
{
  const panel = this.getSdpByKey(key);
  if (panel)
  {
    panel.lock();
  }
  else
  {
    console.error(`The SDP key of ${key} was not found in the list of panels to lock.`);
  }
};

/**
 * Gets the ranking of a specific SDP for one of the actors.
 * @param {number} actorId The id of the actor you want to get a ranking for.
 * @param {string} key The unique key of the SDP to get the ranking for.
 * @returns {number} The rank of the panel that the actor is at.
 */
Game_System.prototype.getRankByActorAndKey = function(actorId, key)
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
  this.deadMembers().forEach(enemy => sdpPoints += enemy.sdpPoints());

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
  J.SDP.Aliased.Scene_Map.get('createJabsAbsMenuMainWindow').call(this);

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
  J.SDP.Aliased.Scene_Menu.get('createCommandWindow').call(this);

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
class Scene_SDP extends Scene_MenuBase
{
  /**
   * Calls this scene.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  constructor()
  {
    super();
    this.initialize();
  }

  /**
   * The entry point of this scene.
   */
  initialize()
  {
    super.initialize(this);
    this.initMembers();
  }

  /**
   * Initializes all properties for this scene.
   */
  initMembers()
  {
    /**
     * The object encapsulating all things related to this plugin.
     */
    this._j = {
      /**
       * The list of SDPs available.
       * @type {Window_SDP_List}
       */
      _sdpListWindow: null,

      /**
       * The details of a given SDP.
       * @type {Window_SDP_Details}
       */
      _sdpDetailsWindow: null,

      /**
       * The help window of the current action.
       * @type {Window_SDP_Help}
       */
      _sdpHelpWindow: null,

      /**
       * The points window for how many SDP points are available.
       * @type {Window_SDP_Points}
       */
      _sdpPointsWindow: null,

      /**
       * The confirmation window to confirm an upgrade.
       * @type {Window_SDP_ConfirmUpgrade}
       */
      _sdpConfirmationWindow: null,

      /**
       * The latest index of the list window.
       * @type {number}
       */
      _index: null,

      /**
       * The data of the panel for the current index.
       * @type {StatDistributionPanel}
       */
      _currentPanel: null,

      /**
       * The actor that is currently selected.
       * @type {Game_Actor}
       */
      _currentActor: null,

      /**
       * Whether or not this scene has been initialized.
       * @type {boolean}
       */
      _initialized: false,
    };
  }

  /**
   * Hooks into the create parent function to create all windows after the window
   * layer has been established.
   */
  create()
  {
    super.create();
    this.createAllWindows();
  }

  /**
   * Runs once per frame to update all things in this scene.
   */
  update()
  {
    super.update();
    this.updateIndex();
    this.updateActor();
  }

  /**
   * Updates the index to keep in sync with the window's currently-selected index.
   */
  updateIndex()
  {
    if (this._j._sdpListWindow._list.length === 0) return;

    const currentIndex = this._j._index;
    const newIndex = this._j._sdpListWindow.index();
    if (currentIndex !== newIndex || currentIndex === null)
    {
      this._j._index = this._j._sdpListWindow.index();
      this._j._currentPanel = this._j._sdpListWindow._list[this._j._index].ext;
      this._j._sdpDetailsWindow.setPanel(this._j._currentPanel);
      this._j._sdpHelpWindow.setText(`${this._j._currentPanel.description}`);
    }
  }

  /**
   * OVERWRITE Determines the current actor.
   */
  updateActor()
  {
    this._j._currentActor = $gameParty.menuActor();
  }

  /**
   * OVERWRITE Removes the buttons on the map/screen.
   */
  createButtons()
  {
  }

  //region window creation
  /**
   * Creates all windows associated with the SDP scene.
   */
  createAllWindows()
  {
    this.createPointsWindow();
    this.createHelpWindow();
    this.createDetailsWindow();
    this.createListWindow();
    this.createConfirmationWindow();
  }

  /**
   * Creates the list of SDPs available to the player.
   */
  createListWindow()
  {
    const width = 400;
    const heightFit = (this._j._sdpPointsWindow.height + this._j._sdpHelpWindow.height) + 8;
    const height = Graphics.height - heightFit;
    const x = 0;
    const y = this._j._sdpPointsWindow.height;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpListWindow = new Window_SDP_List(rect);
    this._j._sdpListWindow.setHandler('cancel', this.popScene.bind(this));
    this._j._sdpListWindow.setHandler('ok', this.onSelectPanel.bind(this));
    this._j._sdpListWindow.setHandler('more', this.onFilterPanels.bind(this));
    this._j._sdpListWindow.setHandler('pagedown', this.cycleMembers.bind(this, true));
    this._j._sdpListWindow.setHandler('pageup', this.cycleMembers.bind(this, false));
    this._j._sdpListWindow.setActor($gameParty.menuActor());
    this.addWindow(this._j._sdpListWindow);
  }

  /**
   * Creates the details window that describes a panel and what leveling it does.
   */
  createDetailsWindow()
  {
    const width = Graphics.boxWidth - 400;
    const height = Graphics.boxHeight - 100;
    const x = 400;
    const y = 0;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpDetailsWindow = new Window_SDP_Details(rect);
    this._j._sdpDetailsWindow.setActor($gameParty.menuActor());
    this.addWindow(this._j._sdpDetailsWindow);
  }

  /**
   * Creates the help window that provides contextual details to the player about the panel.
   */
  createHelpWindow()
  {
    const width = Graphics.boxWidth;
    const height = 100;
    const x = 0;
    const y = Graphics.boxHeight - height;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpHelpWindow = new Window_SDP_Help(rect);
    this.addWindow(this._j._sdpHelpWindow);
  }

  /**
   * Creates the points window that tracks how many SDP points the player has.
   */
  createPointsWindow()
  {
    const width = 400;
    const height = 60;
    const x = 0;
    const y = 0;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpPointsWindow = new Window_SDP_Points(rect);
    this._j._sdpPointsWindow.setActor($gameParty.menuActor());
    this.addWindow(this._j._sdpPointsWindow);
  }

  /**
   * Creates the list of SDPs available to the player.
   */
  createConfirmationWindow()
  {
    const width = 350;
    const height = 120;
    const x = (Graphics.boxWidth - width) / 2;
    const y = (Graphics.boxHeight - height) / 2;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpConfirmationWindow = new Window_SDP_ConfirmUpgrade(rect);
    this._j._sdpConfirmationWindow.setHandler('cancel', this.onUpgradeCancel.bind(this));
    this._j._sdpConfirmationWindow.setHandler('ok', this.onUpgradeConfirm.bind(this));
    this._j._sdpConfirmationWindow.hide();
    this.addWindow(this._j._sdpConfirmationWindow);
  }
  //endregion SDP window creation

  /**
   * Refreshes all windows in this scene.
   */
  refreshAllWindows()
  {
    this._j._sdpListWindow.setActor(this._j._currentActor);
    this._j._sdpDetailsWindow.setActor(this._j._currentActor);
    this._j._sdpDetailsWindow.refresh();
    this._j._sdpPointsWindow.setActor(this._j._currentActor);

    this._j._sdpHelpWindow.refresh();
  }

  /**
   * When selecting a panel, bring up the confirmation window.
   */
  onSelectPanel()
  {
    this._j._sdpConfirmationWindow.show();
    this._j._sdpConfirmationWindow.open();
    this._j._sdpConfirmationWindow.activate();
  }

  onFilterPanels()
  {
    const sdpListWindow = this._j._sdpListWindow;
    const usingFilter = sdpListWindow.usingNoMaxPanelsFilter();

    if (usingFilter)
    {
      sdpListWindow.setNoMaxPanelsFilter(false);
    }
    else
    {
      sdpListWindow.setNoMaxPanelsFilter(true);
    }

    this.refreshAllWindows();

    if (sdpListWindow.index() > sdpListWindow.commandList().length)
    {
      sdpListWindow.select(sdpListWindow.commandList().length - 1);
    }
  }

  /**
   * Cycles the currently selected member to the next in the party.
   * @param {boolean} isForward Whether or not to cycle to the next member or previous.
   */
  cycleMembers(isForward = true)
  {
    isForward
      ? $gameParty.makeMenuActorNext()
      : $gameParty.makeMenuActorPrevious();
    this._j._currentActor = $gameParty.menuActor();
    this.refreshAllWindows();
    this._j._sdpListWindow.activate();
  }

  /**
   * If the player opts to upgrade the existing panel, remove the points and rank up the panel.
   */
  onUpgradeConfirm()
  {
    // grab the panel we're working with.
    const panel = this._j._currentPanel;

    // grab the actor we're working with.
    const actor = this._j._currentActor;

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
    this.refreshAllWindows();

    // update the detail window to use the current actor.
    this._j._sdpDetailsWindow.setActor(this._j._currentActor);

    // close the confirmation window.
    this._j._sdpConfirmationWindow.close();

    // refocus back to the list window.
    this._j._sdpListWindow.activate();
  }

  /**
   * If the player opts to cancel the upgrade process, return to the list window.
   */
  onUpgradeCancel()
  {
    this._j._sdpConfirmationWindow.close();
    this._j._sdpConfirmationWindow.hide();
    this._j._sdpListWindow.activate();
  }
}
//endregion Scene_SDP

//region Window_AbsMenu
if (J.ABS)
{
  /**
   * Extends {@link #buildCommands}.
   * Adds the sdp command at the end of the list.
   * @returns {BuiltWindowCommand[]}
   */
  J.SDP.Aliased.Window_AbsMenu.set('buildCommands', Window_AbsMenu.prototype.buildCommands);
  Window_AbsMenu.prototype.buildCommands = function()
  {
    // perform original logic to get the base commands.
    const originalCommands = J.SDP.Aliased.Window_AbsMenu.get('buildCommands').call(this);

    // if the SDP switch is not ON, then this menu command is not present.
    if (!this.canAddSdpCommand()) return originalCommands;

    // The menu shouldn't be accessible if there are no panels to work with?
    const enabled = $gameSystem.getAllSdps().length > 0;

    // build the command.
    const command = new WindowCommandBuilder(J.SDP.Metadata.CommandName)
      .setSymbol("sdp-menu")
      .setEnabled(enabled)
      .setIconIndex(J.SDP.Metadata.JabsMenuIcon)
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
    if (!$gameSwitches.value(J.SDP.Metadata.Switch)) return false;

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
      "Junction points can be spent here to modify your stats- permanently."
    ];

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
  J.SDP.Aliased.Window_MenuCommand.get('makeCommandList').call(this);

  // if we cannot add the command, then do not.
  if (!this.canAddSdpCommand()) return;

  // The menu shouldn't be accessible if there are no panels to work with.
  const enabled = $gameSystem.getUnlockedSdps().length;

  // build the command.
  const command = new WindowCommandBuilder(J.SDP.Metadata.CommandName)
    .setSymbol("sdp-menu")
    .setEnabled(enabled)
    .setIconIndex(J.SDP.Metadata.JabsMenuIcon)
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
  if (!$gameSwitches.value(J.SDP.Metadata.Switch)) return false;

  // if we're using JABS but not allowing to show this command in both menus, then skip.
  if (J.ABS && !J.SDP.Metadata.JabsShowBoth) return false;

  // render the command!
  return true;
};
//endregion Window_MenuCommand

//region Window_SDP_ConfirmUpgrade
/**
 * The window that prompts the user to confirm/cancel the upgrading of a chosen panel.
 */
class Window_SDP_ConfirmUpgrade
  extends Window_Command
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
//endregion Window_SDP_ConfirmUpgrade
//endregion Window objects

//region Window_SDP_Details
/**
 * The window that displays all details of how a panel would affect the actor's parameters.
 */
class Window_SDP_Details extends Window_Base
{
  constructor(rect)
  {
    super(rect);
    this.initMembers();
    this.refresh();
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The panel currently being displayed in this window.
     * @type {StatDistributionPanel}
     */
    this.currentPanel = null;

    /**
     * The actor used for parameter comparisons.
     * @type {Game_Actor}
     */
    this.currentActor = null;
  }

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    // don't refresh if there is no panel to refresh the contents of.
    if (!this.currentPanel || !this.currentActor) return;

    this.contents.clear();
    this.drawPanelInfo();
  }

  /**
   * Sets the panel that this window is displaying info for.
   * @param {StatDistributionPanel} panel The panel to display info for.
   */
  setPanel(panel)
  {
    this.currentPanel = panel;
    this.refresh();
  }

  /**
   * Sets the stat comparison actor to be this actor.
   * @param {Game_Actor} actor The actor to perform stat comparisons against.
   */
  setActor(actor)
  {
    this.currentActor = actor;
  }

  /**
   * Draws all the data associated with the currently selected panel.
   */
  drawPanelInfo()
  {
    this.drawHeaderDetails();
    this.drawLevelDetails();
    this.drawCostDetails();
    this.drawAllParameterDetails();
  }

  /**
   * Draws the top-level information of the panel.
   */
  drawHeaderDetails()
  {
    const panel = this.currentPanel;
    const lh = this.lineHeight();
    this.drawTextEx(`\\I[${panel.iconIndex}]\\C[${panel.rarity}]${panel.name}\\C[0]`, 0, lh * 0, 300);
    this.drawTextEx(`${panel.topFlavorText}`, 20, lh * 1, 600);
  }

  /**
   * Draws the ranking information of the panel.
   */
  drawLevelDetails()
  {
    const panel = this.currentPanel;
    const actor = this.currentActor;
    const panelRanking = actor.getSdpByKey(panel.key);
    const lh = this.lineHeight();
    const ox = 360;
    this.drawText(`Rank:`, ox, lh * 0, 200, "left");
    this.changeTextColor(this.determinePanelRankColor(panelRanking.currentRank, panelRanking.maxRank));
    this.drawText(`${panelRanking.currentRank}`, ox + 55, lh * 0, 50, "right");
    this.resetTextColor();
    this.drawText(`/`, ox + 110, lh * 0, 30, "left");
    this.drawText(`${panel.maxRank}`, ox + 130, lh * 0, 50, "left");
  }

  /**
   * Determines the color of the "current rank" number text.
   * @param {number} currentRank The current rank of this panel.
   * @param {number} maxRank The maximum rank of this panel.
   * @returns {number} The id of the color.
   */
  determinePanelRankColor(currentRank, maxRank)
  {
    if (currentRank === 0)
    {
      return ColorManager.damageColor();
    }
    else if (currentRank < maxRank)
    {
      return ColorManager.crisisColor();
    }
    else if (currentRank >= maxRank)
    {
      return ColorManager.powerUpColor();
    }
    else
    {
      return ColorManager.normalColor();
    }
  }

  /**
   * Draws the cost information of ranking this panel up.
   */
  drawCostDetails()
  {
    const panel = this.currentPanel;
    const actor = this.currentActor;
    const panelRanking = actor.getSdpByKey(panel.key);
    const rankUpCost = panel.rankUpCost(panelRanking.currentRank);
    const lh = this.lineHeight();
    const ox = 560;
    const costColor = this.determineCostColor(rankUpCost);
    this.drawText(`Cost:`, ox, lh * 0, 200, "left");
    if (costColor)
    {
      this.changeTextColor(costColor);
      this.drawText(`${rankUpCost}`, ox + 100, lh * 0, 120, "left");
      this.resetTextColor();
    }
    else
    {
      this.drawText(`---`, ox + 100, lh * 0, 80, "left");
    }
  }

  /**
   * Determines the color of the "current rank" number text.
   * @param {number} rankUpCost The cost to rank up this panel.
   * @returns {number} The id of the color.
   */
  determineCostColor(rankUpCost)
  {
    // if the cost is 0, then just return, it doesn't matter.
    if (rankUpCost === 0) return null;

    const currentSdpPoints = this.currentActor.getSdpPoints();

    if (rankUpCost <= currentSdpPoints)
    {
      return ColorManager.powerUpColor();
    }
    else
    {
      return ColorManager.damageColor();
    }
  }

  /**
   * Draws the parameters and how they are affected by this panel.
   */
  drawAllParameterDetails()
  {
    const panel = this.currentPanel;
    const lh = this.lineHeight();
    const { panelParameters } = panel;
    this.drawParameterHeaderRow(120);
    panelParameters.forEach((parameter, index) =>
    {
      this.drawParameterDetailsRow(parameter, 160 + lh * index);
    });
  }

  /**
   * Draws the header row of the table that represents all parameters affected by
   * leveling the currently highlighted panel.
   */
  drawParameterHeaderRow(y)
  {
    const ox = 20;
    const rw = 200;
    this.drawTextEx(`Parameter`, ox + rw * 0, y, 100);
    this.drawText(`Current`, ox + rw * 1 + 100, y, 100, "left");
    this.drawText(`Effect`, ox + rw * 2 + 50, y, 100, "left");
    this.drawText(`Potential`, ox + rw * 3, y, 120, "left");
  }

  /**
   * Draws a single row representing one potentially changed parameter by leveling this panel.
   * @param {PanelParameter} panelParameter The panel parameter information.
   * @param {number} y The `y` coordinate for this row.
   */
  drawParameterDetailsRow(panelParameter, y)
  {
    const { parameterId, perRank, isFlat, isCore } = panelParameter;
    const { name, value, iconIndex, smallerIsBetter, isPercentValue } = this.translateParameter(parameterId);
    const ox = 20;
    const rw = 200;
    const isPositive = perRank >= 0 ? '+' : String.empty;
    const currentValue = parseFloat(value);
    let potentialValue = isFlat
      ? (currentValue + perRank).toFixed(2)
      : (currentValue + (currentValue * (perRank / 100)));
    potentialValue = Number(potentialValue);
    if (!Number.isInteger(potentialValue))
    {
      potentialValue = potentialValue.toFixed(2);
    }

    const upColor = ColorManager.textColor(24);
    const upCoreColor = ColorManager.textColor(28);
    const downColor = ColorManager.textColor(20);
    const downCoreColor = ColorManager.textColor(18);
    const modifier = isFlat
      ? perRank
      : (potentialValue - currentValue).toFixed(2);

    let potentialColor = ColorManager.normalColor();
    if (currentValue > potentialValue && !smallerIsBetter)
    {
      potentialColor = isCore
        ? downCoreColor
        : downColor;
    }
    else
    {
      potentialColor = isCore
        ? upCoreColor
        : upColor;
    }

    // if it is one of the parameters where smaller is better, then going up is bad.
    if (currentValue < potentialValue && smallerIsBetter)
    {
      potentialColor = isCore
        ? upCoreColor
        : upColor;
    }

    const isPercent = isFlat ? `` : `%`;

    // parameter name, drawn differently for core parameters.
    if (isCore)
    {
      this.drawTextEx(`\\I[${iconIndex}]\\C[14]${name}\\C[0]${isPercent}`, ox + rw * 0, y, 32);
    }
    else
    {
      this.drawTextEx(`\\I[${iconIndex}]${name}${isPercent}`, ox + rw * 0, y, 100);
    }

    // parameter current value.
    const needPercentSymbol = (isPercVal) => isPercVal ? '%' : String.empty;
    const basePercentSymbol = needPercentSymbol(isPercentValue);
    this.drawText(`${currentValue}${basePercentSymbol}`, ox + rw * 1 + 100, y, 100, "center");

    // parameter modifier by this panel.
    const modPercentSymbol = needPercentSymbol(isPercent);
    this.changeTextColor(potentialColor);
    if (isPercent)
    {
      this.drawText(`(${isPositive}${perRank}${isPercent})`, ox + rw * 2 + 50, y, 100, "center");
    }
    else
    {
      this.drawText(`(${isPositive}${modifier}${modPercentSymbol})`, ox + rw * 2 + 50, y, 100, "center");
    }

    // new parameter value if this panel is ranked up.
    this.drawText(`${potentialValue}${basePercentSymbol}`, ox + rw * 3, y, 100, "center");
    this.resetTextColor();
  }

  /**
   * Translates a parameter id into an object with its name, value, iconIndex, and whether or not
   * a parameter being smaller is an improvement..
   * @param {number} paramId The id to translate.
   * @returns {{name: string, value: number, iconIndex: number, smallerIsBetter: boolean, isPercentValue: boolean}}
   */
  // eslint-disable-next-line complexity
  translateParameter(paramId)
  {
    const smallerIsBetter = this.isNegativeGood(paramId);
    const isPercentValue = this.isPercentParameter(paramId);
    let name = String.empty;
    let value = 0;
    let iconIndex = 0;
    switch (paramId)
    {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        name = TextManager.param(paramId);
        value = this.currentActor.param(paramId).toFixed(2);
        iconIndex = IconManager.param(paramId);
        break;
      case  8:
      case  9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        name = TextManager.xparam(paramId - 8);
        value = (this.currentActor.xparam(paramId - 8) * 100).toFixed(2);
        iconIndex = IconManager.xparam(paramId - 8);
        break;
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
      case 25:
      case 26:
      case 27:
        name = TextManager.sparam(paramId - 18);
        value = (this.currentActor.sparam(paramId - 18) * 100).toFixed(2);
        iconIndex = IconManager.sparam(paramId - 18);
        break;
    }

    return {name, value, iconIndex, smallerIsBetter, isPercentValue};
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
}
//endregion Window_SDP_Details

//region Window_SDP_Help
/**
 * The window that displays the help text associated with a panel.
 */
class Window_SDP_Help
  extends Window_Help
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
//endregion Window_SDP_Help

//region Window_SDP_List
/**
 * The SDP window containing the list of all earned SDPs.
 */
class Window_SDP_List extends Window_Command
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
   * Sets whether or not the panel list should filter out already-maxed panels.
   * @param {boolean} useFilter True to filter out maxed panels, false otherwise.
   */
  setNoMaxPanelsFilter(useFilter)
  {
    this.filterNoMaxedPanels = useFilter;
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
    const panels = $gameSystem.getUnlockedSdps();
    const actor = this.currentActor;
    if (!panels.length || !actor) return;

    // add all panels to the list.
    panels.forEach(panel =>
    {
      // construct the SDP command.
      const command = this.makeCommand(panel);

      // if the command is invalid, do not add it.
      if (!command) return;

      // add the command.
      this.addBuiltCommand(command);
    }, this);
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
    const { name, key, iconIndex, rarity: colorIndex, maxRank } = panel;

    // get the ranking for a given panel by its key.
    const panelRanking = actor.getSdpByKey(key);

    // grab the current rank of the panel.
    const { currentRank } = panelRanking;

    // check if we're at max rank already.
    const isMaxRank = maxRank === currentRank;

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
//endregion Window_SDP_List

//region Window_SDP_Points
/**
 * The SDP window containing the amount of SDP points a given actor has.
 */
class Window_SDP_Points
  extends Window_Base
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
    const iconIndex = J.SDP.Metadata.PointsIcon;
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

    this.drawFace(
      this._actor.faceName(),
      this._actor.faceIndex(),
      0, 0,   // x,y
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
//endregion Window_SDP_Points