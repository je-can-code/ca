//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.1 SDP] Enables the SDP system, allowing for distribution of points into panels that
 * contain various stats.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * This plugin is a form of "stat distribution"- an alternative to the standard
 * of leveling up to raise an actor's stats.
 * 
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
 * @desc The number of points to modify by. Negative will remove points. Cannot go below 0.
 * 
 * @command Modify party SDP points
 * @text Add/Remove party's SDP points
 * @desc Adds or removes a designated amount of points from all members of the current party.
 * @arg sdpPoints
 * @type number
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
 * @option Crit Evasion
 * @value 11
 * @option Magic Evasion
 * @value 12
 * @option Magic Reflect Rate
 * @value 13
 * @option Counter Rate
 * @value 14
 * @option HP Regen
 * @value 15
 * @option MP Regen
 * @value 16
 * @option TP Regen
 * @value 17
 * @option Targeting Rate
 * @value 18
 * @option Guard Rate
 * @value 19
 * @option Recovery Rate
 * @value 20
 * @option Pharmacy Rate
 * @value 21
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
 * @option Experience Rate
 * @value 27
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

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.SDP = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.SDP.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-SDP`,
};

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
    let parsedPanel = JSON.parse(panelBlob);

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
    let rarity = 0;
    switch (parsedPanel.rarity)
    {
      case "Common":
        rarity = 0;
        break;
      case "Magical":
        rarity = 3;
        break;
      case "Rare":
        rarity = 23;
        break;
      case "Epic":
        rarity = 31;
        break;
      case "Legendary":
        rarity = 20;
        break;
      case "Godlike":
        rarity = 25;
        break;
      default:
        rarity = 0;
        console.warn("if modifying the rarity dropdown options, be sure to fix them here, too.");
        console.warn(`${parsedPanel.rarity} was not an implemented option.`);
        break;
    }

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
      rarity: rarity,
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
   * The version of this plugin.
   * @type {number}
   */
  Version: '1.1.0',

  /**
   * The translated SDPs from the plugin parameters.
   */
  Panels: J.SDP.Helpers.TranslateSDPs(J.SDP.PluginParameters['SDPs']),

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
};

J.SDP.MenuCommand = isEnabled =>
{
  return {
    name: "Distribute",
    symbol: "sdp-menu",
    enabled: isEnabled,
    ext: null,
    icon: J.SDP.Metadata.JabsMenuIcon,
    color: 1,
  }
};

J.SDP.Aliased = {
  BattleManager: {},
  DataManager: {},
  Game_Actor: {},
  Game_BattleMap: {},
  Game_Enemy: new Map(),
  Game_Switches: {},
  Game_System: {},
  Scene_Map: {},
  Scene_Menu: {},
  Window_AbsMenu: {},
  Window_MenuCommand: {},
};

/**
 * Plugin command for calling the SDP scene/menu.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Call SDP Menu", () =>
{
  SceneManager.push(Scene_SDP);
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
//#endregion Introduction

//#region Static objects
//#region BattleManager
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
  const sdp = this._rewards.sdp;
  if (sdp > 0)
  {
    const text = `${sdp} ${J.SDP.Metadata.VictoryText}`;
    $gameMessage.add("\\." + text);
  }
};
//#endregion BattleManager

//#region DataManager
/**
 * Updates existing save files with the updated SDP plugin metadata.
 */
J.SDP.Aliased.DataManager.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  const fromPluginSettingsSdp = $gameSystem._j._sdp;
  const fromSaveFileSdp = contents.system._j._sdp;
  fromSaveFileSdp._panels.forEach(savedSdp =>
  {
    const updatedSdp = fromPluginSettingsSdp._panels
      .find(settingsSdp => settingsSdp.key === savedSdp.key);
    // if the SDP no longer exists, don't do anything with it.
    if (!updatedSdp) return;

    // if it was unlocked before, it stays unlocked.
    if (savedSdp.isUnlocked())
    {
      if (updatedSdp)
      {
        updatedSdp.unlock();
      }
    }
  });

  // update the save file data with the modified plugin settings JAFTING data.
  contents.system._j._sdp = fromPluginSettingsSdp;
  J.SDP.Aliased.DataManager.extractSaveContents.call(this, contents);
};
//#endregion DataManager
//#endregion Static objects

//#region Game objects
//#region Game_Actor
/**
 * Adds new properties to the actors that manage the SDP system.
 */
J.SDP.Aliased.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function()
{
  J.SDP.Aliased.Game_Actor.initMembers.call(this);
  /**
   * The J object where all my additional properties live.
   */
  this._j = this._j || {};

  /**
   * A grouping of all properties associated with the SDP system.
   */
  this._j._sdp = {
    /**
     * The points that this current actor has.
     * @type {number}
     */
    _points: 0,

    /**
     * A collection of the ranks for each panel that have had points invested.
     * @type {PanelRanking[]}
     */
    _ranks: [],
  };
};

/**
 * Adds a new panel ranking for tracking the progress of a given panel.
 * @param {string} key The less-friendly unique key that represents this SDP.
 */
Game_Actor.prototype.addNewPanelRanking = function(key)
{
  const ranking = this.getSdpByKey(key);
  if (ranking)
  {
    console.warn(`panel rankings are already being tracked for key: "${key}".`);
    return;
  }

  const panelRanking = new PanelRanking(key, this.actorId());
  this._j._sdp._ranks.push(panelRanking);
};

/**
 * Searches for a ranking in a given panel based on key and returns it.
 * @param {string} key The key of the panel we seek.
 * @returns {PanelRanking} The panel if found, `null` otherwise.
 */
Game_Actor.prototype.getSdpByKey = function(key)
{
  // don't try to search if there are no rankings at this time.
  if (!this._j._sdp._ranks.length) return null;

  return this._j._sdp._ranks.find(panelRanking => panelRanking.key === key);
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
  let gainedSdpPoints = points;

  // if the modification is a positive amount...
  if (gainedSdpPoints > 0)
  {
    // then add apply the multiplier to the gained points.
    gainedSdpPoints = Math.round(gainedSdpPoints * this.sdpMultiplier());
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
  const objectsToCheck = this.getEverythingWithNotes();

  // iterate over each of them and add the multiplier up.
  objectsToCheck.forEach(obj => (multiplier += this.extractSdpMultiplier(obj)), this);

  // return the factor form by now dividing by 100.
  return (multiplier / 100);
};

/**
 * Gets all multipliers that this database object contains.
 * @param {rm.types.BaseItem} referenceData The database data of the object.
 * @returns {number}
 */
Game_Actor.prototype.extractSdpMultiplier = function(referenceData)
{
  if (!referenceData || !referenceData.note) return 0;

  let sdpMultiplier = 0;
  const structure = /<sdpMultiplier:[ ]?([-.\d]+)>/i;
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
      .getSdp(panelRanking.key)
      .getPanelParameterById(paramId);
    if (panelParameters.length)
    {
      panelParameters.forEach(panelParameter =>
      {
        const perRank = panelParameter.perRank;
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
      .getSdp(panelRanking.key)
      .getPanelParameterById(sparamId + idExtra); // need +10 because sparams start higher.
    if (panelParameters.length)
    {
      panelParameters.forEach(panelParameter =>
      {
        const perRank = panelParameter.perRank;
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
J.SDP.Aliased.Game_Actor.param = Game_Actor.prototype.param;
Game_Actor.prototype.param = function(paramId)
{
  const baseParam = J.SDP.Aliased.Game_Actor.param.call(this, paramId);
  const panelModifications = this.getSdpBonusForCoreParam(paramId, baseParam);
  const result = baseParam + panelModifications;
  return result;
};

/**
 * Extends the ex-parameters with the SDP bonuses.
 */
J.SDP.Aliased.Game_Actor.xparam = Game_Actor.prototype.xparam;
Game_Actor.prototype.xparam = function(xparamId)
{
  const baseParam = J.SDP.Aliased.Game_Actor.xparam.call(this, xparamId);
  const panelModifications = this.getSdpBonusForNonCoreParam(xparamId, baseParam, 8);
  const result = baseParam + panelModifications;
  return result;
};

/**
 * Extends the sp-parameters with the SDP bonuses.
 */
J.SDP.Aliased.Game_Actor.sparam = Game_Actor.prototype.sparam;
Game_Actor.prototype.sparam = function(sparamId)
{
  const baseParam = J.SDP.Aliased.Game_Actor.sparam.call(this, sparamId);
  const panelModifications = this.getSdpBonusForNonCoreParam(sparamId, baseParam, 18);
  const result = baseParam + panelModifications;
  return result;
};
//#endregion Game_Actor

//#region Game_BattleMap
if (J.ABS)
{
  /**
   * Extends the basic rewards from defeating an enemy to also include SDP points.
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  J.SDP.Aliased.Game_BattleMap.gainBasicRewards = Game_BattleMap.prototype.gainBasicRewards;
  Game_BattleMap.prototype.gainBasicRewards = function(enemy, actor)
  {
    J.SDP.Aliased.Game_BattleMap.gainBasicRewards.call(this, enemy, actor);
    let sdpPoints = enemy.sdpPoints();

    if (!sdpPoints) return;

    const levelMultiplier = this.getRewardScalingMultiplier(enemy, actor);
    sdpPoints = Math.ceil(sdpPoints * levelMultiplier);

    this.gainSdpReward(sdpPoints, actor);
    this.createSdpLog(sdpPoints, actor);
  };

  /**
   * Gains SDP points from battle rewards.
   * @param {number} sdpPoints The SDP points to gain.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  Game_BattleMap.prototype.gainSdpReward = function(sdpPoints, actor)
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
  Game_BattleMap.prototype.generatePopSdpPoints = function(amount, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const sdpPop = this.configureSdpPop(amount);

    // add the pop to the caster's tracking.
    character.addTextPop(sdpPop);
    character.setRequestTextPop();
  };

  /**
   * Creates the text pop of the SDP points gained.
   * @param {number} sdpPoints The amount of experience gained.
   */
  Game_BattleMap.prototype.configureSdpPop = function(sdpPoints)
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
  Game_BattleMap.prototype.createSdpLog = function(sdpPoints, battler)
  {
    if (!J.LOG) return;

    const sdpLog = new MapLogBuilder()
      .setupSdpAcquired(battler.battlerName(), sdpPoints)
      .build();
    $gameTextLog.addLog(sdpLog);
  };
}
//#endregion Game_BattleMap

//#region Game_Battler
/**
 * Gets the SDP points multiplier for this battler.
 * @returns {number}
 */
Game_Battler.prototype.sdpMultiplier = function()
{
  return 1.0;
};
//#endregion Game_Battler

//#region Game_Enemy
if (J.DROPS)
{
  /**
   * Gets any additional drops from the notes of this particular enemy.
   * This allows for only gaining an SDP from enemies once.
   * @returns {rm.types.EnemyDropItem[]}
   */
  J.SDP.Aliased.Game_Enemy.set("extraDrops", Game_Enemy.prototype.extraDrops);
  Game_Enemy.prototype.extraDrops = function()
  {
    // get the original drop list.
    const dropList = J.SDP.Aliased.Game_Enemy.get("extraDrops").call(this);

    // if there is a panel that needs to be added to the list, then add it.
    const sdpDrop = this.needsSdpDrop();
    if (sdpDrop)
    {
      dropList.push(sdpDrop);
    }

    return dropList;
  };

  /**
   * Determines if there is an SDP to drop, and whether or not to drop it.
   * @returns {rm.types.EnemyDropItem}
   */
  Game_Enemy.prototype.needsSdpDrop = function()
  {
    const referenceData = this.enemy();
    const structure = /<sdpPanel:[ ]?"(.*?)":(\d+):(\d+)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);

    // get the panel key from this enemy if it exists.
    let panelKey = "";
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        panelKey = RegExp.$1;
      }
    });

    // if we don't have a panel key, then give up.
    if (!panelKey) return null;

    // if a panel exists to be earned, but we already have it, then give up.
    const alreadyEarned = $gameSystem.getSdp(panelKey).isUnlocked();
    if (alreadyEarned) return null;

    // create the new drop based on the SDP.
    return {
      kind: 1, // all SDP drops are assumed to be "items".
      dataId: parseInt(RegExp.$2),
      denominator: parseInt(RegExp.$3)
    };
  };
}
//#endregion Game_Enemy

//#region Game_Switches
/**
 * Hooks into the `onChange` function for updating the JABS quick menu when switches change.
 */
J.SDP.Aliased.Game_Switches.onChange = Game_Switches.prototype.onChange;
Game_Switches.prototype.onChange = function()
{
  $gameMap.requestRefresh();
  if (J.ABS)
  {
    $gameBattleMap.requestJabsMenuRefresh = true;
  }
};
//#endregion Game_Switches

//#region Game_System
/**
 * Hooks in and initializes the SDP system.
 */
J.SDP.Aliased.Game_System.initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function()
{
  this.initSdpMembers();
  J.SDP.Aliased.Game_System.initialize.call(this);
};

/**
 * Initializes the SDP system and binds earned panels to the `$gameSystem` object.
 */
Game_System.prototype.initSdpMembers = function()
{
  this._j = this._j || {};
  this._j._sdp = this._j._sdp || {};

  /**
   * The collection of all panels earned (though maybe not unlocked).
   * @type {StatDistributionPanel[]}
   */
  this._j._sdp._panels = J.SDP.Metadata.Panels;
};

/**
 * Gets a single panel based on the key provided.
 * @param {string} key The less-friendly unique key that represents this SDP.
 * @returns {StatDistributionPanel}
 */
Game_System.prototype.getSdp = function(key)
{
  // if we don't have panels to search through, don't do it.
  if (!this._j._sdp._panels.length) return null;

  const panel = this._j._sdp._panels.find(panel => panel.key === key);
  return panel;
};

/**
 * Gets all currently-unlocked `StatDistributionPanel`s.
 * @returns {StatDistributionPanel[]} All currently unlocked SDPs.
 */
Game_System.prototype.getUnlockedSdps = function()
{
  // if we don't have panels to search through, don't do it.
  if (!this._j._sdp._panels.length) return [];

  return this._j._sdp._panels.filter(panel => panel.isUnlocked());
};

/**
 * Gets the number of panels currently unlocked for the party.
 * @returns {number}
 */
Game_System.prototype.getUnlockedSdpsCount = function()
{
  return this._j._sdp._panels.length;
};

/**
 * Unlocks a SDP by its key.
 * @param {string} key The key of the SDP to unlock.
 */
Game_System.prototype.unlockSdp = function(key)
{
  const panel = this.getSdp(key);
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
  const panel = this.getSdp(key);
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
  ;

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
//#endregion Game_System

//#region Game_Troop
/**
 * Gets the amount of SDP points earned from all defeated enemies.
 * @returns {number}
 */
Game_Troop.prototype.sdpTotal = function()
{
  const members = this.deadMembers();

  let sdpPoints = 0;
  members.forEach(defeatedEnemy =>
  {
    sdpPoints += defeatedEnemy.sdpPoints();
  });
  return sdpPoints;
};
//#endregion Game_Troop
//#endregion Game objects

//#region Scene objects
//#region Scene_Map
/**
 * Adds the functionality for calling the SDP menu from the JABS quick menu.
 */
J.SDP.Aliased.Scene_Map.createJabsAbsMenuMainWindow = Scene_Map.prototype.createJabsAbsMenuMainWindow;
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  J.SDP.Aliased.Scene_Map.createJabsAbsMenuMainWindow.call(this);
  this._j._absMenu._mainWindow.setHandler("sdp-menu", this.commandSdp.bind(this));
};

/**
 * Brings up the SDP menu.
 */
Scene_Map.prototype.commandSdp = function()
{
  SceneManager.push(Scene_SDP);
};
//#endregion Scene_Map

//#region Scene_Menu
/**
 * Hooks into the command window creation of the menu to add functionality for the SDP menu.
 */
J.SDP.Aliased.Scene_Menu.createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function()
{
  J.SDP.Aliased.Scene_Menu.createCommandWindow.call(this);
  this._commandWindow.setHandler("sdp-menu", this.commandSdp.bind(this));
};

/**
 * Brings up the SDP menu.
 */
Scene_Menu.prototype.commandSdp = function()
{
  SceneManager.push(Scene_SDP);
  return;
};
//#endregion Scene_Menu

//#region Scene_SDP
class Scene_SDP
  extends Scene_MenuBase
{
  constructor()
  {
    super();
    this.initialize();
  };

  /**
   * The entry point of this scene.
   */
  initialize()
  {
    super.initialize(this);
    this.initMembers();
  };

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
  };

  /**
   * Hooks into the create parent function to create all windows after the window
   * layer has been established.
   */
  create()
  {
    super.create();
    this.createAllWindows();
  };

  /**
   * Runs once per frame to update all things in this scene.
   */
  update()
  {
    super.update();
    this.updateIndex();
    this.updateActor();
  };

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
      let msg = this._j._currentPanel.description.split("|");
      if (msg.length > 1)
      {
        this._j._sdpHelpWindow.setText(`${msg[0]}\n${msg[1]}`);
      }
      else
      {
        this._j._sdpHelpWindow.setText(`${this._j._currentPanel.description}`);
      }
    }
  };

  /**
   * OVERWRITE Determines the current actor.
   */
  updateActor()
  {
    this._j._currentActor = $gameParty.menuActor();
  };

  /**
   * OVERWRITE Removes the buttons on the map/screen.
   */
  createButtons()
  {
    return;
  };

  //#region SDP window creation
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
  };

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
    this._j._sdpListWindow.setHandler('pagedown', this.cycleMembers.bind(this, true));
    this._j._sdpListWindow.setHandler('pageup', this.cycleMembers.bind(this, false));
    this._j._sdpListWindow.setActor($gameParty.menuActor());
    this.addWindow(this._j._sdpListWindow);
  };

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
  };

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
  };

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
  };

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
  };

  //#endregion SDP window creation

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
  };

  /**
   * When selecting a panel, bring up the confirmation window.
   */
  onSelectPanel()
  {
    this._j._sdpConfirmationWindow.show();
    this._j._sdpConfirmationWindow.open();
    this._j._sdpConfirmationWindow.activate();
  };

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
  };

  /**
   * If the player opts to upgrade the existing panel, remove the points and rank up the panel.
   */
  onUpgradeConfirm()
  {
    const panel = this._j._currentPanel;
    const actor = this._j._currentActor;
    const panelRanking = actor.getSdpByKey(panel.key);
    const panelRankupCost = panel.rankUpCost(panelRanking.currentRank);
    actor.modSdpPoints(-panelRankupCost);
    actor.rankUpPanel(panel.key);
    this.refreshAllWindows();
    this._j._sdpDetailsWindow.setActor(this._j._currentActor);

    this._j._sdpConfirmationWindow.close();
    this._j._sdpListWindow.activate();
  };

  /**
   * If the player opts to cancel the upgrade process, return to the list window.
   */
  onUpgradeCancel()
  {
    this._j._sdpConfirmationWindow.close();
    this._j._sdpConfirmationWindow.hide();
    this._j._sdpListWindow.activate();
  };
};
//#endregion Scene_SDP
//#endregion Scene objects

//#region Window objects
//#region Window_AbsMenu
if (J.ABS)
{
  /**
   * Extends the make command list for the JABS quick menu to include SDP, if it meets the conditions.
   */
  J.SDP.Aliased.Window_AbsMenu.makeCommandList = Window_AbsMenu.prototype.makeCommandList;
  Window_AbsMenu.prototype.makeCommandList = function()
  {
    J.SDP.Aliased.Window_AbsMenu.makeCommandList.call(this);
    // if the SDP switch is not ON, then this menu command is not present.
    if (!$gameSwitches.value(J.SDP.Metadata.Switch)) return;

    // The menu shouldn't be accessible if there are no panels to work with.
    const enabled = $gameSystem.getUnlockedSdps().length;

    const sdpCommand = J.SDP.MenuCommand(enabled); //{ name: "Distribute", symbol: "sdp-menu", enabled, ext: null, icon: 0 };
    this._list.splice(this._list.length - 2, 0, sdpCommand);
  };
}
//#endregion Window_AbsMenu

//#region Window_MenuCommand
/**
 * Extends the make command list for the main menu to include SDP, if it meets the conditions.
 */
J.SDP.Aliased.Window_MenuCommand.makeCommandList = Window_MenuCommand.prototype.makeCommandList;
Window_MenuCommand.prototype.makeCommandList = function()
{
  J.SDP.Aliased.Window_MenuCommand.makeCommandList.call(this);
  // if the SDP switch is not ON, then this menu command is not present.
  if (!$gameSwitches.value(J.SDP.Metadata.Switch)) return;

  // if we're using JABS but not allowing to show this command in both menus, then skip.
  if (J.ABS && !J.SDP.Metadata.JabsShowBoth) return;

  // The menu shouldn't be accessible if there are no panels to work with.
  const enabled = $gameSystem.getUnlockedSdps().length;

  const sdpCommand = J.SDP.MenuCommand(enabled); //{ name: "Distribute", symbol: "sdp-menu", enabled, ext: null, icon: 0 };
  const lastCommand = this._list[this._list.length - 1];
  if (lastCommand.symbol === "gameEnd")
  {
    this._list.splice(this._list.length - 2, 0, sdpCommand);
  }
  else
  {
    this._list.splice(this._list.length - 1, 0, sdpCommand);
  }
};
//#endregion Window_MenuCommand

//#region Window_SDP_List
/**
 * The SDP window containing the list of all earned SDPs.
 */
class Window_SDP_List extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initMembers();
  };

  initMembers()
  {
    /**
     * The currently selected actor. Used for comparing points to cost to see if
     * the panel in the list window should be enabled or disabled.
     * @type {Game_Actor}
     */
    this.currentActor = null;
  };

  /**
   * Sets the actor for this window to the provided actor. Implicit refresh.
   * @param {Game_Actor} actor The actor to assign to this window.
   */
  setActor(actor)
  {
    this.currentActor = actor;
    this.refresh();
  };

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  };

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    /** @type {StatDistributionPanel[]} */
    const panels = $gameSystem.getUnlockedSdps();
    const actor = this.currentActor;
    if (!panels.length || !actor) return;

    const points = actor.getSdpPoints();

    // add all panels to the list.
    panels.forEach(panel =>
    {
      let panelRanking = actor.getSdpByKey(panel.key);
      // if this actor is missing any rankings for the panel, just make one.
      if (!panelRanking) actor.addNewPanelRanking(panel.key);

      const currentRank = actor.getSdpByKey(panel.key).currentRank;
      const hasEnoughPoints = panel.rankUpCost(currentRank) <= points;
      const isMaxRank = panel.maxRank === currentRank;
      const enabled = hasEnoughPoints && !isMaxRank;
      this.addCommand(panel.name, panel.key, enabled, panel, panel.iconIndex, panel.rarity);

      /*
        common: 0
        uncommon: 3
        rare: 23
        epic: 31
        legendary: 21
        godly: 25
      */
    });
  };
};
//#endregion Window_SDP_List

//#region Window_SDP_Details
/**
 * The window that displays all details of how a panel would affect the actor's parameters.
 */
class Window_SDP_Details
  extends Window_Base
{
  constructor(rect)
  {
    super(rect);
    this.initMembers();
    this.refresh();
  };

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
  };

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    // don't refresh if there is no panel to refresh the contents of.
    if (!this.currentPanel || !this.currentActor) return;

    this.contents.clear();
    this.drawPanelInfo();
  };

  /**
   * Sets the panel that this window is displaying info for.
   * @param {StatDistributionPanel} panel The panel to display info for.
   */
  setPanel(panel)
  {
    this.currentPanel = panel;
    this.refresh();
  };

  /**
   * Sets the stat comparison actor to be this actor.
   * @param {Game_Actor} actor The actor to perform stat comparisons against.
   */
  setActor(actor)
  {
    this.currentActor = actor;
  };

  /**
   * Draws all the data associated with the currently selected panel.
   */
  drawPanelInfo()
  {
    this.drawHeaderDetails();
    this.drawLevelDetails();
    this.drawCostDetails();
    this.drawAllParameterDetails();
  };

  /**
   * Draws the top-level information of the panel.
   */
  drawHeaderDetails()
  {
    const panel = this.currentPanel;
    const lh = this.lineHeight();
    this.drawTextEx(`\\I[${panel.iconIndex}]\\C[${panel.rarity}]${panel.name}\\C[0]`, 0, lh * 0, 300);
    this.drawTextEx(`${panel.topFlavorText}`, 20, lh * 1, 600);
  };

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
  };

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
  };

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
  };

  /**
   * Determines the color of the "current rank" number text.
   * @param {number} currentRank The current rank of this panel.
   * @param {number} maxRank The maximum rank of this panel.
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
  };

  /**
   * Draws the parameters and how they are affected by this panel.
   */
  drawAllParameterDetails()
  {
    const panel = this.currentPanel;
    const lh = this.lineHeight();
    const panelParameters = panel.panelParameters;
    this.drawParameterHeaderRow(120);
    panelParameters.forEach((parameter, index) =>
    {
      this.drawParameterDetailsRow(parameter, 160 + lh * index);
    });
  };

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
  };

  /**
   * Draws a single row representing one potentially changed parameter by leveling this panel.
   * @param {PanelParameter} panelParameter The panel parameter information.
   * @param {number} y The `y` coordinate for this row.
   */
  drawParameterDetailsRow(panelParameter, y)
  {
    const {parameterId, perRank, isFlat, isCore} = panelParameter;
    const {name, value, iconIndex, smallerIsBetter, isPercentValue} = this.translateParameter(parameterId);
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
  };

  /**
   * Translates a parameter id into an object with its name, value, iconIndex, and whether or not
   * a parameter being smaller is an improvement..
   * @param {number} paramId The id to translate.
   * @returns {{name: string, value: number, iconIndex: number, smallerIsBetter: boolean, isPercentValue: boolean}}
   */
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
    }

    return {name, value, iconIndex, smallerIsBetter, isPercentValue};
  };

  /**
   * Determines whether or not the parameter should be suffixed with a % character.
   * This is specifically for parameters that truly are ranged between 0-100 and RNG.
   * @param {number} parameterId The paramId to check if is a percent.
   * @returns {boolean}
   */
  isPercentParameter(parameterId)
  {
    const isPercentParameterIds = [9, 14, 20, 21, 22, 23, 24, 25, 26, 27];
    const isPercent = isPercentParameterIds.includes(parameterId);
    return isPercent;
  };

  /**
   * Determines whether or not the parameter should be marked as "improved" if it is negative.
   * @param {number} parameterId The paramId to check if smaller is better for.
   * @returns {boolean} True if the smaller is better for this paramId, false otherwise.
   */
  isNegativeGood(parameterId)
  {
    const smallerIsBetterParameterIds = [18, 22, 23, 24, 25, 26];
    const smallerIsBetter = smallerIsBetterParameterIds.includes(parameterId);
    return smallerIsBetter;
  };
};
//#endregion Window_SDP_Details

//#region Window_SDP_Help
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
  };
};
//#endregion Window_SDP_Help

//#region Window_SDP_Points
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
  };

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    this._actor = null;
  };

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    this.contents.clear();
    this.drawPoints();
  };

  /**
   * Draws the SDP icon and number of points this actor has.
   */
  drawPoints()
  {
    this.drawSdpIcon();
    this.drawSdpPoints();
    this.drawSdpFace();
  };

  /**
   * Draws the "SDP icon" representing points.
   */
  drawSdpIcon()
  {
    const x = 200;
    const y = 2;
    const iconIndex = J.SDP.Metadata.PointsIcon;
    this.drawIcon(iconIndex, x, y);
  };

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
  };

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
  };

  /**
   * Sets the actor focus for the SDP points window. Implicit refresh.
   * @param {Game_Actor} actor The actor to display SDP info for.
   */
  setActor(actor)
  {
    this._actor = actor;
    this.refresh();
  };
};
//#endregion Window_SDP_Points

//#region Window_SDP_ConfirmUpgrade
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
  };

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
  };

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    this.addCommand(`Upgrade this panel`, `panel-upgrade-ok`, true, null, 91);
    this.addCommand(`Cancel`, `panel-upgrade-cancel`, true, null, 90);
  };
};
//#endregion Window_SDP_ConfirmUpgrade
//#endregion Window objects

//ENDOFFILE