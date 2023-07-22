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