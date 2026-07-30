//region Introduction
 
/*:
 * @target MZ
 * @plugindesc [v3.0.0 SDP] Enables the SDP system, aka Stat Distribution Panels.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-DropsControl
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-Speed
 * @orderAfter J-DropsControl
 * @orderAfter J-Natural
 * @orderAfter J-Proficiency
 * @orderBefore J-CriticalFactors
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is a form of "stat distribution"- an alternative to the standard
 * of leveling up to raise an actor's stats.
 *
 * Integrates with others of mine plugins:
 * - J-ABS; enemies will individually drop their points and panels.
 * - J-ABS-Speed; enables usage of Movespeed Boost as a parameter on panels.
 * - J-CriticalFactors; enables usage of CDM/CDR as parameters on panels.
 * - J-DropsControl; enables usage of item-as-panel drops.
 * - J-Natural; enables SDP reward modifications.
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
 * - Rank-up costs driven by **rarity defaults** (plugin parameters) plus optional **per-panel offsets**
 *   in `config.sdp.json` (`baseCost`, `flatGrowthCost`, `multGrowthCost` — usually **0 / 0 / 1.0**).
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
 * FAMILIES AND SUBGROUPS:
 * Have you ever wanted to organize a large panel list into browsable
 * categories, or build a chain of panels where investing deep into one
 * grants a payoff that replaces the previous tier's? Well now you can! Two
 * new top-level blocks in `config.sdp.json`- `families` and `subgroups`-
 * let you group panels for menu browsing and for mastery progression.
 *
 * A FAMILY is a top-level menu category. In the SDP scene, the player
 * cycles between families with L2/R2, filtering the panel list down to just
 * that family's panels (or "All", or "Unsorted" for panels with no
 * subgroup/family enrollment). Each family row owns a list of subgroup
 * keys.
 *
 * A SUBGROUP is a tiered chain of panels that live inside a family. Panels
 * enroll in a subgroup individually (see their own `mastery` block below)
 * by referencing the subgroup's key and declaring their tier within it.
 * Subgroups themselves don't define the panels- they're just the
 * authoring/display metadata (name, key, icon, description) that panels
 * point back to.
 *
 * CONFIG SCHEMA (families):
 *    {
 *      "key": "elemental",
 *      "name": "Elemental Affinities",
 *      "iconIndex": 64,
 *      "description": "Mastery over the elements.",
 *      "subgroupKeys": ["fire-mastery", "ice-mastery"]
 *    }
 *  Where "key" uniquely identifies this family and is referenced by nothing
 *  else directly- families own subgroups, not the other way around.
 *  Where "subgroupKeys" lists every subgroup key that belongs to this family.
 *
 * CONFIG SCHEMA (subgroups):
 *    {
 *      "key": "fire-mastery",
 *      "name": "Fire Mastery",
 *      "iconIndex": 65,
 *      "description": "Deepen your command of flame."
 *    }
 *  Where "key" is referenced by panels via their own `mastery.subgroupKey`
 *  (see MASTERY below) and by a family's `subgroupKeys` list above.
 *
 * NOTE: A subgroup with no owning family (not listed in any family's
 * subgroupKeys) still functions for mastery purposes, but its panels fall
 * back to the "Unsorted" filter bucket in the family strip instead of a
 * named family.
 * ============================================================================
 * MASTERY:
 * Have you ever wanted maxing out a panel to grant a passive skill- and have
 * a deeper panel in the same progression line automatically replace that
 * skill with a better one? Well now you can! Any panel can opt into the
 * mastery program by adding a `mastery` block to its config row.
 *
 * NOTE ABOUT TWO INDEPENDENT FLAGS:
 * Subgroup ENROLLMENT (subgroupKey + subgroupTier) and mastery SKILL
 * GRANTING (masterySkillId) are independent- a panel can be enrolled in a
 * subgroup (participating in family filtering and occupying a tier slot)
 * without granting any skill at all (masterySkillId left at 0). This is
 * useful for "filler" tiers that exist purely to occupy a slot in the
 * progression without a payoff of their own.
 *
 * CONFIG SCHEMA (panel `mastery` block):
 *    "mastery": {
 *      "subgroupKey": "fire-mastery",
 *      "subgroupTier": 1,
 *      "masterySkillId": 501
 *    }
 *  Where "subgroupKey" enrolls this panel in a subgroup (must match a
 *  subgroups[].key entry above). Omit or leave empty to opt this panel out
 *  of the subgroup hierarchy entirely.
 *  Where "subgroupTier" is this panel's rank within the subgroup's
 *  progression- higher tiers win when reconciling which mastery skill is
 *  active. Boot validation rejects two panels sharing the same tier within
 *  one subgroup. Required (> 0) whenever subgroupKey is set.
 *  Where "masterySkillId" is the skill id granted to the actor when this
 *  panel reaches max rank. Leave at 0 (or omit) for an enrolled panel that
 *  should not grant a mastery skill of its own.
 *
 * HOW RECONCILIATION WORKS:
 * The instant a panel reaches max rank, every panel enrolled in that same
 * subgroup is re-evaluated: the actor's highest-tier MAXED panel in the
 * subgroup wins, its masterySkillId is learned if not already known, and
 * every other tier's masterySkillId in that subgroup is forgotten if
 * currently known. Only one mastery skill per subgroup is ever active on a
 * given actor at a time- deepening your investment upgrades the payoff
 * instead of stacking it.
 *
 * NOTE: Ranking a panel back down (if your project allows that) does not
 * un-grant a mastery skill by itself- reconciliation only runs when a panel
 * is freshly maxed. The mastery summary for whichever panel is currently
 * hovered in the SDP scene is shown read-only alongside the normal reward
 * list.
 * ============================================================================
 * SDP POINTS:
 * Ever wanted enemies to yield SDP points on defeat, or items that grant (or
 * consume) SDP points when used? Well now you can! By applying the same tag
 * to either an enemy or an item, you too can define exactly how many SDP
 * points that source is worth.
 *
 * NOTE ABOUT ENEMIES:
 * The value on an enemy is a straight reward yielded on defeat, same as exp
 * or gold.
 *
 * NOTE ABOUT ITEMS:
 * The value on an item is applied to the target actor when the item is used
 * on them- an item can only ever affect actors (using an SDP item on an
 * enemy target does nothing), and only non-skill usable items are eligible.
 * A negative VALUE consumes points from the target instead of granting them.
 *
 * TAG USAGE:
 * - Enemies
 * - Items
 *
 * TAG FORMAT:
 *  <sdpPoints:VALUE>
 *   Where VALUE is the integer number of SDP points yielded (enemies) or
 *   granted/consumed (items). Can be negative on items.
 *
 * TAG EXAMPLES:
 *  <sdpPoints:250>
 * This enemy yields 250 SDP points upon defeat.
 *
 *  <sdpPoints:100>
 * Using this item on an actor grants them 100 SDP points.
 *
 *  <sdpPoints:-50>
 * Using this item on an actor consumes 50 of their SDP points.
 *
 * ============================================================================
 * ENEMY SDP DROPS:
 * Ever want enemies to drop SDPs themselves for unlocking across the party?
 * Well now you can! By applying the appropriate tag to enemies in the
 * database, you can have enemies drop any singular SDP at any integer percent
 * chance you want them to.
 *
 * NOTE ABOUT SDP DROPS AND JABS:
 * This system was explicitly designed with JABS in mind. If you are not using
 * JABS, you probably instead should just use the SDP UNLOCK tag on an item
 * that the enemy drops for similar functionality. This functionality will
 * dynamically generate the loot for the SDP being unlocked with no database
 * backing and unlock it upon pickup- which would be incompatible outside of
 * JABS.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <sdpDropData:[SDP_KEY, DROP_CHANCE]>
 *   Where SDP_KEY is the unique string key for the SDP to unlock.
 *   Where DROP_CHANCE is the 1-100 percent chance that the SDP will drop.
 *
 * TAG EXAMPLES:
 *  <sdpDropData:[ORC_1, 5]>
 * The enemy with this tag will drop an SDP with the key of "ORC_1" upon defeat
 * 5% of the time.
 *
 *  <sdpDropData:[GOB_4, 100]>
 * The enemy with this tag will drop an SDP with the key of "GOB_4" upon defeat
 * 100% of the time- aka guaranteed drop upon defeat.
 *
 * ============================================================================
 * SDP UNLOCK:
 * Ever wanted items used to unlock SDPs? Well now you can! By applying the
 * necessary tags onto items in the database, you too can have items that will
 * function as SDP unlockers (in addition to whatever else they do).
 * 
 * TAG USAGE:
 * - Items only.
 * 
 * TAG FORMAT:
 *  <sdpUnlock:SDP_KEY>
 *   Where SDP_KEY is the unique string key for the SDP to unlock.
 *
 * TAG EXAMPLES:
 *  <sdpUnlock:ORC_1>
 * An item used with this tag on it will unlock the SDP with the key of "ORC_1"
 * upon use- in addition to its other effects.
 *
 *  <sdpUnlock:GOB_4>
 * An item used with this tag on it will unlock the SDP with the key of "GOB_4"
 * upon use- in addition to its other effects.
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
 *
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
 *
 * ============================================================================
 * SDP BONUS FORMULA:
 * Need to scale the SDP points an actor gains from a JS formula rather than
 * a flat percentage? Apply the sdpBonusFormula tag to any valid notetag source.
 * The formula is evaluated after the sdpMultiplier (SDR) step and its result
 * is treated as a bonus fraction — so a result of 0.20 means +20% more points.
 * Multiple tags across different sources sum their bonus fractions together
 * before the final multiply, consistent with how other formula tags work here.
 *
 * Formula context:
 *   a = the actor gaining SDP points
 *   b = 0 (unused; present for formula consistency)
 *   v = $gameVariables._data
 *
 * Useful formula helpers:
 *   a.getMasteryCount()   — number of subgroups the actor has currently mastered
 *   a.level               — actor level
 *   a.getTotalSdpRanks()  — sum of all ranked panel investments
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
 *  <sdpBonusFormula:[FORMULA]>
 *
 * TAG EXAMPLES:
 *  <sdpBonusFormula:[a.getMasteryCount() * 0.01]>
 * An actor with 20 mastered subgroups gains an extra 20% SDP points on top of
 * whatever the sdpMultiplier (SDR) already provided.
 *
 *  <sdpBonusFormula:[a.level * 0.005]>
 * An actor at level 50 gains an extra 25% SDP points from this source.
 *
 * ============================================================================
 * CHANGELOG:
 * - 3.0.0
 *    BREAKING: Rank-up cost spine is defined per **rarity** in plugin parameters; each panel’s `baseCost`,
 *    `flatGrowthCost`, and `multGrowthCost` in `config.sdp.json` are **offsets / scale** (defaults **0 / 0 / 1.0**).
 *    Retune plugin defaults or panel overrides when migrating from v2.x absolute triples.
 *    Added panel Families and Subgroups (`config.sdp.json` `families`/`subgroups` blocks): a
 *    Family is a top-level menu category cycled with L2/R2 in the SDP scene (Window_SdpFamilyStrip);
 *    a Subgroup is a tiered chain of panels within a Family whose masteries supersede each other.
 *    Added Mastery: a panel enrolled in a subgroup (via its `mastery` block: subgroupKey,
 *    subgroupTier, masterySkillId) grants that tier's wrapper skill to the actor when maxed.
 *    Maxing a higher tier in the same subgroup automatically forgets the previous tier's mastery
 *    skill and grants the new one (SdpMasteryManager) — only the highest maxed tier is ever active.
 *    Surfaced read-only in the SDP scene via Window_SdpMastery for whichever panel is hovered.
 * - 2.1.2
 *    Consumed `RPGManager` updates.
 * - 2.1.1
 *    Added flag for showing external file load info.
 * - 2.1.0
 *    Removed association of SDPs being backed by actual database items.
 *    Implemented JABS-centric basis for dynamically generating drops.
 * - 2.0.2
 *    Added new getTotalSdpRanks function to actors for a new data point.
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
 *
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
 * @param sdpUnitSingular
 * @parent SDPconfigs
 * @type string
 * @text Unit name (singular)
 * @desc Player-facing word for one rankable entry (panel, node, junction, etc.).
 * @default panel
 *
 * @param sdpUnitPlural
 * @parent SDPconfigs
 * @type string
 * @text Unit name (plural)
 * @desc Plural form for counts in confirmations (panels, nodes, …).
 * @default panels
 *
 * @param sdpPointsDisplayName
 * @parent SDPconfigs
 * @type string
 * @text Points name (short)
 * @desc Currency label in SDP UI (confirmation “Remaining …”, cart wallet header, TextManager.sdpPoints).
 * @default SDP
 *
 *
 * @param sdpPanelCostDefaults
 * @text Panel rank-up defaults (by rarity)
 * @desc Core base / flat coefficient / exponential base (**mult**) per rarity. Panel JSON adds offsets on top.
 *
 * @param sdpDefaultCommonBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Common · Base SDP
 * @default 0
 *
 * @param sdpDefaultCommonFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Common · Flat coefficient
 * @default 70
 *
 * @param sdpDefaultCommonMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Common · Mult base
 * @default 1.06
 *
 * @param sdpDefaultMagicalBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Magical · Base SDP
 * @default 0
 *
 * @param sdpDefaultMagicalFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Magical · Flat coefficient
 * @default 235
 *
 * @param sdpDefaultMagicalMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Magical · Mult base
 * @default 1.06
 *
 * @param sdpDefaultRareBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Rare · Base SDP
 * @default 0
 *
 * @param sdpDefaultRareFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Rare · Flat coefficient
 * @default 1180
 *
 * @param sdpDefaultRareMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Rare · Mult base
 * @default 1.06
 *
 * @param sdpDefaultEpicBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Epic · Base SDP
 * @default 0
 *
 * @param sdpDefaultEpicFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Epic · Flat coefficient
 * @default 4320
 *
 * @param sdpDefaultEpicMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Epic · Mult base
 * @default 1.06
 *
 * @param sdpDefaultLegendaryBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Legendary · Base SDP
 * @default 0
 *
 * @param sdpDefaultLegendaryFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Legendary · Flat coefficient
 * @default 11900
 *
 * @param sdpDefaultLegendaryMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Legendary · Mult base
 * @default 1.06
 *
 * @param sdpDefaultGodlikeBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Godlike · Base SDP
 * @default 0
 *
 * @param sdpDefaultGodlikeFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Godlike · Flat coefficient
 * @default 30500
 *
 * @param sdpDefaultGodlikeMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Godlike · Mult base
 * @default 1.06
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
 

//#region src/plugins/sdp/core/models/PanelFamily.js
/**
* Authoring metadata for a panel family — groups related subgroups for SDP menu browsing.
* Subgroups are assigned here; panels reference subgroups via {@link PanelMastery#subgroupKey}.
*/
var PanelFamily = class {
	/**
	* Friendly name for this family.
	* @type {string}
	*/
	name = String.empty;
	/**
	* Unique key for this family row.
	* @type {string}
	*/
	key = String.empty;
	/**
	* Icon index for editor chrome and the in-game family strip.
	* @type {number}
	*/
	iconIndex = -1;
	/**
	* Designer-facing description of the family fantasy.
	* @type {string}
	*/
	description = String.empty;
	/**
	* Subgroup keys owned by this family (must exist in config.sdp.json `subgroups`).
	* @type {string[]}
	*/
	subgroupKeys = [];
	/**
	* Constructor.
	* @param {string} name The name driving this step.
	* @param {string} key The key driving this step.
	* @param {number} iconIndex The icon index driving this step.
	* @param {string} description The description driving this step.
	* @param {string[]} subgroupKeys The subgroup keys driving this step.
	*/
	constructor(name, key, iconIndex, description, subgroupKeys) {
		this.name = name;
		this.key = key;
		this.iconIndex = iconIndex;
		this.description = description;
		this.subgroupKeys = subgroupKeys;
	}
};

//#endregion
//#region src/plugins/sdp/core/models/PanelMastery.js
/**
* Subgroup enrollment and optional mastery-skill metadata for a single {@link StatDistributionPanel}.
* Serialized on each panel row in config.sdp.json as a nested `mastery` object.
*
* Hierarchy (family → subgroup → panel) uses {@link #enrolledInSubgroup}.
* Max-rank wrapper skills use {@link #grantsMasterySkill} only.
*/
var PanelMastery = class PanelMastery {
	/**
	* @param {string} subgroupKey The subgroup key driving this step.
	* @param {number} subgroupTier The subgroup tier driving this step.
	* @param {number} masterySkillId The mastery skill id driving this step.
	*/
	constructor(subgroupKey, subgroupTier, masterySkillId) {
		/**
		* Subgroup key from the SDP configuration registry (empty when not enrolled).
		* @type {string}
		*/
		this.subgroupKey = subgroupKey;
		/**
		* Tier within the subgroup used for intra-subgroup mastery replacement.
		* @type {number}
		*/
		this.subgroupTier = subgroupTier;
		/**
		* Wrapper skill id granted when this panel is maxed; J-Passive owns passive state(s).
		* Zero means the panel is organized under the subgroup but grants no mastery skill.
		* @type {number}
		*/
		this.masterySkillId = masterySkillId;
	}
	/**
	* Whether this panel is placed in the subgroup hierarchy (family filtering, tier slots).
	* @returns {boolean}
	*/
	enrolledInSubgroup() {
		return this.subgroupKey !== String.empty && this.subgroupTier > 0;
	}
	/**
	* Whether maxing this panel grants a subgroup mastery wrapper skill.
	* @returns {boolean}
	*/
	grantsMasterySkill() {
		return this.masterySkillId > 0;
	}
	/**
	* Whether this panel grants a mastery wrapper skill on max rank.
	* Alias for {@link #grantsMasterySkill} — kept for call sites that mean "mastery program" narrowly.
	* @returns {boolean}
	*/
	participates() {
		return this.grantsMasterySkill();
	}
	/**
	* Whether some mastery fields are set but the row is not valid.
	* @returns {boolean}
	*/
	hasPartialEnrollment() {
		const hasSubgroupKey = this.subgroupKey !== String.empty;
		const hasSubgroupTier = this.subgroupTier > 0;
		const hasMasterySkill = this.masterySkillId > 0;
		if (hasSubgroupKey === false && hasSubgroupTier === false && hasMasterySkill === false) {
			return false;
		}
		if (hasSubgroupKey !== hasSubgroupTier) {
			return true;
		}
		if (hasMasterySkill && this.enrolledInSubgroup() === false) {
			return true;
		}
		return false;
	}
	/**
	* Empty mastery row — panel is outside the subgroup hierarchy.
	* @returns {PanelMastery}
	*/
	static none() {
		return new PanelMastery(String.empty, 0, 0);
	}
	/**
	* Builds mastery metadata from flat configuration json fields.
	* @param {string} subgroupKey The subgroup key driving this step.
	* @param {number} subgroupTier The subgroup tier driving this step.
	* @param {number} masterySkillId The mastery skill id driving this step.
	* @returns {PanelMastery}
	*/
	static fromFlat(subgroupKey, subgroupTier, masterySkillId) {
		return new PanelMastery(subgroupKey, subgroupTier, masterySkillId);
	}
	/**
	* Hydrates mastery metadata from a parsed config.sdp.json panel row.
	* Accepts nested `mastery` (canonical) or legacy flat root fields during migration.
	* @param {object} parsedPanel The parsed panel driving this step.
	* @returns {PanelMastery}
	*/
	static fromConfigPanel(parsedPanel) {
		const nested = parsedPanel.mastery;
		if (nested) {
			return PanelMastery.fromFlat(nested.subgroupKey ?? String.empty, PanelMastery.#parseIntField(nested.subgroupTier, 0), PanelMastery.#parseIntField(nested.masterySkillId, 0));
		}
		return PanelMastery.fromFlat(parsedPanel.subgroupKey ?? String.empty, PanelMastery.#parseIntField(parsedPanel.subgroupTier, 0), PanelMastery.#parseIntField(parsedPanel.masterySkillId, 0));
	}
	/**
	* @param {string|number|null|undefined} value The value driving this step.
	* @param {number} defaultValue The default value driving this step.
	* @returns {number}
	*/
	static #parseIntField(value, defaultValue) {
		if (value === undefined || value === null || value === "") {
			return defaultValue;
		}
		const parsed = Number.parseInt(String(value), 10);
		if (Number.isNaN(parsed)) {
			return defaultValue;
		}
		return parsed;
	}
	/**
	* Serializes this mastery row for config.sdp.json.
	* @returns {{ subgroupKey: string, subgroupTier: number, masterySkillId: number }}
	*/
	toConfigJson() {
		return {
			subgroupKey: this.subgroupKey,
			subgroupTier: this.subgroupTier,
			masterySkillId: this.masterySkillId
		};
	}
};

//#endregion
//#region src/plugins/sdp/core/models/PanelParameter.js
/**
* A class that represents a single parameter and its growth for a SDP.
*/
var PanelParameter = class {
	/**
	* Initializes a single panel parameter.
	* @param {string} parameterKey The registry key this panel entry affects.
	* @param {number} perRank The amount per rank this parameter gives.
	* @param {boolean} isFlat True if it is flat growth, false if it is percent growth.
	* @param {boolean} isCore True if this is a core parameter, false otherwise.
	*/
	constructor(parameterKey, perRank, isFlat = true, isCore = false) {
		/**
		* The registry key of the parameter this class represents.
		* @type {string}
		*/
		this.parameterKey = parameterKey;
		/**
		* The amount per rank this parameter gives.
		* @type {number}
		*/
		this.perRank = perRank;
		/**
		* Whether or not the growth per rank for this parameter is flat or percent.
		* @type {boolean}
		*/
		this.isFlat = isFlat;
		/**
		* Whether or not this is a core parameter.
		* Core parameters are emphasized on the SDP scene.
		* @type {boolean}
		*/
		this.isCore = isCore;
	}
};

//#endregion
//#region src/plugins/sdp/core/models/PanelRankupReward.js
/**
* A class that represents a single reward for achieving a particular rank in a panel.
*/
var PanelRankupReward = class {
	/**
	* Initializes a single rankup reward.
	* @param {string} rewardName The name to display for this reward.
	* @param {number} rankRequired The rank required.
	* @param {string} effect The effect to execute.
	*/
	constructor(rewardName, rankRequired, effect) {
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
	}
};

//#endregion
//#region src/plugins/sdp/core/models/PanelIdentity.js
/**
* Presentation and unlock metadata for a single {@link StatDistributionPanel}.
* Serialized on each panel row in config.sdp.json as a nested `identity` object.
* {@link StatDistributionPanel#key} stays at the panel root for lookup and grep.
*/
var PanelIdentity = class PanelIdentity {
	/**
	* @param {string} name The name driving this step.
	* @param {number} iconIndex The icon index driving this step.
	* @param {boolean} unlockedByDefault The unlocked by default driving this step.
	* @param {string} description The description driving this step.
	* @param {string} topFlavorText The top flavor text driving this step.
	*/
	constructor(name, iconIndex, unlockedByDefault, description, topFlavorText) {
		/**
		* Friendly name for this SDP.
		* @type {string}
		*/
		this.name = name;
		/**
		* Icon index for this SDP.
		* @type {number}
		*/
		this.iconIndex = iconIndex;
		/**
		* Whether this SDP is unlocked by default.
		* @type {boolean}
		*/
		this.unlockedByDefault = unlockedByDefault;
		/**
		* Long description for the details window.
		* @type {string}
		*/
		this.description = description;
		/**
		* Short flavor line under the name in the details window.
		* @type {string}
		*/
		this.topFlavorText = topFlavorText;
	}
	/**
	* Blank identity row for builder defaults.
	* @returns {PanelIdentity}
	*/
	static empty() {
		return new PanelIdentity(String.empty, 0, false, String.empty, String.empty);
	}
	/**
	* Hydrates identity metadata from a parsed config.sdp.json panel row.
	* Accepts nested `identity` (canonical) or legacy flat root fields during migration.
	* @param {object} parsedPanel The parsed panel driving this step.
	* @returns {PanelIdentity}
	*/
	static fromConfigPanel(parsedPanel) {
		const nested = parsedPanel.identity;
		if (nested) {
			return new PanelIdentity(nested.name ?? String.empty, PanelIdentity.#parseIntField(nested.iconIndex, 0), nested.unlockedByDefault === true, nested.description ?? String.empty, nested.topFlavorText ?? String.empty);
		}
		return new PanelIdentity(parsedPanel.name ?? String.empty, PanelIdentity.#parseIntField(parsedPanel.iconIndex, 0), parsedPanel.unlockedByDefault === true, parsedPanel.description ?? String.empty, parsedPanel.topFlavorText ?? String.empty);
	}
	/**
	* @param {string|number|null|undefined} value The value driving this step.
	* @param {number} defaultValue The default value driving this step.
	* @returns {number}
	*/
	static #parseIntField(value, defaultValue) {
		if (value === undefined || value === null || value === "") {
			return defaultValue;
		}
		const parsed = Number.parseInt(String(value), 10);
		if (Number.isNaN(parsed)) {
			return defaultValue;
		}
		return parsed;
	}
	/**
	* Serializes this identity row for config.sdp.json.
	* @returns {{
	*   name: string,
	*   iconIndex: number,
	*   unlockedByDefault: boolean,
	*   description: string,
	*   topFlavorText: string
	* }}
	*/
	toConfigJson() {
		return {
			name: this.name,
			iconIndex: this.iconIndex,
			unlockedByDefault: this.unlockedByDefault,
			description: this.description,
			topFlavorText: this.topFlavorText
		};
	}
};

//#endregion
//#region src/plugins/sdp/core/models/PanelProgression.js
/**
* Rank cap, rarity tier, and rank-up cost offsets for a single {@link StatDistributionPanel}.
* Serialized on each panel row in config.sdp.json as a nested `progression` object.
*/
var PanelProgression = class PanelProgression {
	/**
	* @param {number} maxRank The max rank driving this step.
	* @param {number} rarity The rarity driving this step.
	* @param {number} baseCost The base cost driving this step.
	* @param {number} flatGrowthCost The flat growth cost driving this step.
	* @param {number} multGrowthCost The mult growth cost driving this step.
	*/
	constructor(maxRank, rarity, baseCost, flatGrowthCost, multGrowthCost) {
		/**
		* Maximum rank for this SDP.
		* @type {number}
		*/
		this.maxRank = maxRank;
		/**
		* Panel rarity (**0–5**, Common..Godlike).
		* @type {number}
		*/
		this.rarity = rarity;
		/**
		* Additive offset on top of the rarity default base SDP.
		* @type {number}
		*/
		this.baseCost = baseCost;
		/**
		* Additive offset on the rarity default exponential flat coefficient.
		* @type {number}
		*/
		this.flatGrowthCost = flatGrowthCost;
		/**
		* Multiplier applied to the rarity default mult (**1.0** = defaults only).
		* @type {number}
		*/
		this.multGrowthCost = multGrowthCost;
	}
	/**
	* Default progression row for builder defaults.
	* @returns {PanelProgression}
	*/
	static defaults() {
		return new PanelProgression(1, PanelRarity.RARITY_COMMON, 0, 0, 1);
	}
	/**
	* Hydrates progression metadata from a parsed config.sdp.json panel row.
	* Accepts nested `progression` (canonical) or legacy flat root fields during migration.
	* @param {object} parsedPanel The parsed panel driving this step.
	* @returns {PanelProgression}
	*/
	static fromConfigPanel(parsedPanel) {
		const nested = parsedPanel.progression;
		if (nested) {
			return new PanelProgression(PanelProgression.#parseIntField(nested.maxRank, 1), PanelRarity.normalizeRarityFromJson(nested.rarity), PanelProgression.#parseIntField(nested.baseCost, 0), PanelProgression.#parseIntField(nested.flatGrowthCost, 0), PanelProgression.#parseFloatField(nested.multGrowthCost, 1));
		}
		return new PanelProgression(PanelProgression.#parseIntField(parsedPanel.maxRank, 1), PanelRarity.normalizeRarityFromJson(parsedPanel.rarity), PanelProgression.#parseIntField(parsedPanel.baseCost, 0), PanelProgression.#parseIntField(parsedPanel.flatGrowthCost, 0), PanelProgression.#parseFloatField(parsedPanel.multGrowthCost, 1));
	}
	/**
	* @param {string|number|null|undefined} value The value driving this step.
	* @param {number} defaultValue The default value driving this step.
	* @returns {number}
	*/
	static #parseIntField(value, defaultValue) {
		if (value === undefined || value === null || value === "") {
			return defaultValue;
		}
		const parsed = Number.parseInt(String(value), 10);
		if (Number.isNaN(parsed)) {
			return defaultValue;
		}
		return parsed;
	}
	/**
	* @param {string|number|null|undefined} value The value driving this step.
	* @param {number} defaultValue The default value driving this step.
	* @returns {number}
	*/
	static #parseFloatField(value, defaultValue) {
		if (value === undefined || value === null || value === "") {
			return defaultValue;
		}
		const parsed = Number.parseFloat(String(value));
		if (Number.isNaN(parsed)) {
			return defaultValue;
		}
		return parsed;
	}
	/**
	* Serializes this progression row for config.sdp.json.
	* @returns {{
	*   maxRank: number,
	*   rarity: number,
	*   baseCost: number,
	*   flatGrowthCost: number,
	*   multGrowthCost: number
	* }}
	*/
	toConfigJson() {
		return {
			maxRank: this.maxRank,
			rarity: this.rarity,
			baseCost: this.baseCost,
			flatGrowthCost: this.flatGrowthCost,
			multGrowthCost: this.multGrowthCost
		};
	}
};

//#endregion
//#region src/plugins/sdp/core/models/StatDistributionPanelBuilder.js
/**
* A builder for creating {@link StatDistributionPanel}.
*/
var StatDistributionPanelBuilder = class {
	#key = String.empty;
	#identity = PanelIdentity.empty();
	#progression = PanelProgression.defaults();
	#parameters = [];
	#rewards = [];
	#mastery = PanelMastery.none();
	/**
	* Builds the configured panel.
	* @returns {StatDistributionPanel}
	*/
	build() {
		return new StatDistributionPanel(this.#key, this.#identity, this.#progression, this.#parameters, this.#rewards, this.#mastery);
	}
	name(name) {
		this.#identity.name = name;
		return this;
	}
	key(key) {
		this.#key = key;
		return this;
	}
	iconIndex(iconIndex) {
		this.#identity.iconIndex = iconIndex;
		return this;
	}
	unlockedByDefault(unlockedByDefault) {
		this.#identity.unlockedByDefault = unlockedByDefault;
		return this;
	}
	description(description) {
		this.#identity.description = description;
		return this;
	}
	flavorText(flavorText) {
		this.#identity.topFlavorText = flavorText;
		return this;
	}
	maxRank(maxRank) {
		this.#progression.maxRank = maxRank;
		return this;
	}
	baseCost(baseCost) {
		this.#progression.baseCost = baseCost;
		return this;
	}
	flatGrowth(flatGrowth) {
		this.#progression.flatGrowthCost = flatGrowth;
		return this;
	}
	multGrowth(multGrowth) {
		this.#progression.multGrowthCost = multGrowth;
		return this;
	}
	rarity(rarity) {
		this.#progression.rarity = PanelRarity.normalizeRarityFromJson(rarity);
		return this;
	}
	parameters(parameters) {
		this.#parameters = parameters;
		return this;
	}
	rewards(rewards) {
		this.#rewards = rewards;
		return this;
	}
	/**
	* Sets presentation and unlock metadata for this panel.
	* @param {PanelIdentity} identity The identity driving this step.
	* @returns {StatDistributionPanelBuilder}
	*/
	identity(identity) {
		this.#identity = identity;
		return this;
	}
	/**
	* Sets rank cap, rarity tier, and rank-up cost offsets for this panel.
	* @param {PanelProgression} progression The progression driving this step.
	* @returns {StatDistributionPanelBuilder}
	*/
	progression(progression) {
		this.#progression = progression;
		return this;
	}
	/**
	* Sets subgroup mastery enrollment for this panel.
	* @param {PanelMastery} mastery The mastery driving this step.
	* @returns {StatDistributionPanelBuilder}
	*/
	mastery(mastery) {
		this.#mastery = mastery;
		return this;
	}
};

//#endregion
//#region src/plugins/sdp/core/models/StatDistributionPanel.js
/**
* The class that governs the details of a single SDP.
* Use the {@link StatDistributionPanelBuilder} to fluently build these.
*/
var StatDistributionPanel = class {
	/**
	* @param {string} key The key driving this step.
	* @param {PanelIdentity} identity The identity driving this step.
	* @param {PanelProgression} progression The progression driving this step.
	* @param {PanelParameter[]} panelParameters The panel parameters driving this step.
	* @param {PanelRankupReward[]} panelRewards The panel rewards driving this step.
	* @param {PanelMastery} mastery The mastery driving this step.
	*/
	constructor(key, identity, progression, panelParameters, panelRewards, mastery) {
		/**
		* Unique identifier key that represents this SDP (root-level in config.sdp.json).
		* @type {string}
		*/
		this.key = key;
		/**
		* Presentation and unlock metadata for this panel.
		* @type {PanelIdentity}
		*/
		this.identity = identity;
		/**
		* Rank cap, rarity tier, and rank-up cost offsets for this panel.
		* @type {PanelProgression}
		*/
		this.progression = progression;
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
		/**
		* Subgroup mastery enrollment for this panel.
		* @type {PanelMastery}
		*/
		this.mastery = mastery;
	}
	/**
	* Friendly name for this SDP.
	* @returns {string}
	*/
	get name() {
		return this.identity.name;
	}
	/**
	* Icon index for this SDP.
	* @returns {number}
	*/
	get iconIndex() {
		return this.identity.iconIndex;
	}
	/**
	* Whether this SDP is unlocked by default.
	* @returns {boolean}
	*/
	get unlockedByDefault() {
		return this.identity.unlockedByDefault;
	}
	/**
	* Long description for the details window.
	* @returns {string}
	*/
	get description() {
		return this.identity.description;
	}
	/**
	* Short flavor line under the name in the details window.
	* @returns {string}
	*/
	get topFlavorText() {
		return this.identity.topFlavorText;
	}
	/**
	* Maximum rank for this SDP.
	* @returns {number}
	*/
	get maxRank() {
		return this.progression.maxRank;
	}
	/**
	* Panel rarity (**0–5**, Common..Godlike).
	* @returns {number}
	*/
	get rarity() {
		return this.progression.rarity;
	}
	/**
	* Additive offset on top of the rarity default base SDP.
	* @returns {number}
	*/
	get baseCost() {
		return this.progression.baseCost;
	}
	/**
	* Additive offset on the rarity default exponential flat coefficient.
	* @returns {number}
	*/
	get flatGrowthCost() {
		return this.progression.flatGrowthCost;
	}
	/**
	* Multiplier applied to the rarity default mult.
	* @returns {number}
	*/
	get multGrowthCost() {
		return this.progression.multGrowthCost;
	}
	/**
	* Whether this panel participates in the subgroup mastery program.
	* @returns {boolean}
	*/
	participatesInMasteryProgram() {
		return this.mastery.participates();
	}
	/**
	* Calculates the cost of SDP points to rank this panel up.
	*
	* Combines plugin-parameter rarity defaults with per-panel offsets from
	* **J.SDP.Metadata.resolveEffectiveRankUpCostParts** — effective cost is
	* `base + floor(flat * mult^(currentRank + 1))` with resolved **base**, **flat**, and **mult**.
	*
	* @param {number} currentRank The current ranking of this panel for a given actor.
	* @returns {number}
	*/
	rankUpCost(currentRank) {
		if (currentRank === this.maxRank) {
			return 0;
		} else {
			const rankExponent = currentRank + 1;
			const parts = J.SDP.Metadata.resolveEffectiveRankUpCostParts(this);
			const growth = Math.floor(parts.flatGrowthCost * parts.multGrowthCost ** rankExponent);
			return parts.baseCost + growth;
		}
	}
	/**
	* Retrieves all panel parameters associated with a provided registry key.
	* @param {string} parameterKey The registry key to find parameters for.
	* @returns {PanelParameter[]}
	*/
	getPanelParameterByKey(parameterKey) {
		const { panelParameters } = this;
		return panelParameters.filter((panelParameter) => panelParameter.parameterKey === parameterKey);
	}
	/**
	* Gets the panel rewards attached to the provided `rank`.
	* @param {number} rank The rank to check and see if there are any rewards for.
	* @returns {PanelRankupReward[]}
	*/
	getPanelRewardsByRank(rank) {
		const { panelRewards } = this;
		return panelRewards.filter((reward) => reward.rankRequired === rank);
	}
	/**
	* Gets whether or not this SDP is unlocked.
	* @returns {boolean} True if this SDP is unlocked, false otherwise.
	*/
	isUnlocked() {
		return $gameParty.isSdpUnlocked(this.key);
	}
	/**
	* Sets this SDP to be unlocked.
	*/
	unlock() {
		$gameParty.unlockSdp(this.key);
	}
	/**
	* Sets this SDP to be locked.
	*/
	lock() {
		$gameParty.lockSdp(this.key);
	}
	calculateBonusByRank(parameterKey, currentRank, baseParam = 0, fractional = false) {
		const panelParameters = this.panelParameters.filter((panelParameter) => panelParameter.parameterKey === parameterKey);
		if (!panelParameters.length) return 0;
		let val = 0;
		panelParameters.forEach((panelParameter) => {
			const { perRank, isFlat } = panelParameter;
			if (!isFlat) {
				const factor = currentRank * perRank / 100;
				val += baseParam * factor;
			} else {
				val += currentRank * perRank;
			}
		});
		if (fractional) {
			val /= 100;
		}
		return val;
	}
	/**
	* Window text color index for SDP chrome for this panel's rarity.
	*
	* @returns {number}
	*/
	getPanelRarityColorIndex() {
		return PanelRarity.rarityIndexToColorIndex(this.rarity);
	}
	/**
	* Gets the text associated with the rarity of this panel.
	*
	* @returns {string}
	*/
	getPanelRarityText() {
		switch (this.rarity) {
			case PanelRarity.RARITY_COMMON: return PanelRarity.Common;
			case PanelRarity.RARITY_MAGICAL: return PanelRarity.Magical;
			case PanelRarity.RARITY_RARE: return PanelRarity.Rare;
			case PanelRarity.RARITY_EPIC: return PanelRarity.Epic;
			case PanelRarity.RARITY_LEGENDARY: return PanelRarity.Legendary;
			case PanelRarity.RARITY_GODLIKE: return PanelRarity.Godlike;
			default: return `unknown rarity: [ ${this.rarity} ]`;
		}
	}
};
StatDistributionPanel.Builder = () => new StatDistributionPanelBuilder();

//#endregion
//#region src/plugins/sdp/core/models/PanelRarity.js
/**
* Panel rarity indices (**0–5**) and helpers for SDP UI drawing.
*/
var PanelRarity = class PanelRarity {
	/** Common (`rarity` **0**). */
	static RARITY_COMMON = 0;
	/** Magical (`rarity` **1**). */
	static RARITY_MAGICAL = 1;
	/** Rare (`rarity` **2**). */
	static RARITY_RARE = 2;
	/** Epic (`rarity` **3**). */
	static RARITY_EPIC = 3;
	/** Legendary (`rarity` **4**). */
	static RARITY_LEGENDARY = 4;
	/** Godlike (`rarity` **5**). */
	static RARITY_GODLIKE = 5;
	/** Highest valid {@link StatDistributionPanel.rarity} value ({@link PanelRarity.RARITY_GODLIKE}). */
	static RARITY_MAX = 5;
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
	/** Window text color index for Magical rarity chrome. */
	static WindowColorMagical = 3;
	/** Window text color index for Rare rarity chrome. */
	static WindowColorRare = 23;
	/** Window text color index for Epic rarity chrome. */
	static WindowColorEpic = 31;
	/** Window text color index for Legendary rarity chrome. */
	static WindowColorLegendary = 20;
	/** Window text color index for Godlike rarity chrome. */
	static WindowColorGodlike = 25;
	/**
	* Converts a rarity label ("Rare", …) into the integer stored as {@link StatDistributionPanel.rarity}.
	*
	* @param {string} label The rarity word from JSON or tooling.
	* @returns {number} {@link PanelRarity.RARITY_COMMON} .. {@link PanelRarity.RARITY_GODLIKE}.
	*/
	static rarityLabelToIndex(label) {
		switch (label) {
			case PanelRarity.Common: return PanelRarity.RARITY_COMMON;
			case PanelRarity.Magical: return PanelRarity.RARITY_MAGICAL;
			case PanelRarity.Rare: return PanelRarity.RARITY_RARE;
			case PanelRarity.Epic: return PanelRarity.RARITY_EPIC;
			case PanelRarity.Legendary: return PanelRarity.RARITY_LEGENDARY;
			case PanelRarity.Godlike: return PanelRarity.RARITY_GODLIKE;
			default: return PanelRarity.RARITY_COMMON;
		}
	}
	/**
	* Window text color index for SDP chrome for this rarity.
	*
	* @param {number} rarityIndex {@link PanelRarity.RARITY_COMMON} .. {@link PanelRarity.RARITY_GODLIKE}.
	* @returns {number}
	*/
	static rarityIndexToColorIndex(rarityIndex) {
		switch (rarityIndex) {
			case PanelRarity.RARITY_COMMON: return 0;
			case PanelRarity.RARITY_MAGICAL: return PanelRarity.WindowColorMagical;
			case PanelRarity.RARITY_RARE: return PanelRarity.WindowColorRare;
			case PanelRarity.RARITY_EPIC: return PanelRarity.WindowColorEpic;
			case PanelRarity.RARITY_LEGENDARY: return PanelRarity.WindowColorLegendary;
			case PanelRarity.RARITY_GODLIKE: return PanelRarity.WindowColorGodlike;
			default:
				console.warn(`PanelRarity.rarityIndexToColorIndex: unknown rarity index [ ${rarityIndex} ].`);
				return 0;
		}
	}
	/**
	* Coerces a numeric rarity value from config.sdp.json into {@link PanelRarity.RARITY_COMMON} .. {@link PanelRarity.RARITY_GODLIKE}.
	* The editor always writes rarity as a number; string inputs are not a supported format.
	*
	* @param {number} raw Integer from parsed JSON; 0–5 canonical or legacy window-color codes.
	* @returns {number}
	*/
	static normalizeRarityFromJson(raw) {
		switch (raw) {
			case PanelRarity.WindowColorRare: return PanelRarity.RARITY_RARE;
			case PanelRarity.WindowColorEpic: return PanelRarity.RARITY_EPIC;
			case PanelRarity.WindowColorLegendary: return PanelRarity.RARITY_LEGENDARY;
			case PanelRarity.WindowColorGodlike: return PanelRarity.RARITY_GODLIKE;
			default: break;
		}
		if (raw >= PanelRarity.RARITY_COMMON && raw <= PanelRarity.RARITY_MAX) {
			return raw;
		}
		console.warn(`PanelRarity.normalizeRarityFromJson: out-of-range rarity [ ${raw} ]; clamped to Common.`);
		return PanelRarity.RARITY_COMMON;
	}
	/**
	* Converts a rarity label string into a window text color index for SDP chrome.
	*
	* @param {string} rarity The rarity word.
	* @returns {number}
	*/
	static fromRarityToColor(rarity) {
		const rarityIndex = PanelRarity.rarityLabelToIndex(rarity);
		return PanelRarity.rarityIndexToColorIndex(rarityIndex);
	}
};

//#endregion
//#region src/plugins/sdp/core/models/PanelSubgroup.js
/**
* Authoring metadata for a panel subgroup (mirrors crafting categories).
* Subgroups group tiered panels whose masteries replace one another.
*/
var PanelSubgroup = class {
	/**
	* Friendly name for this subgroup.
	* @type {string}
	*/
	name = String.empty;
	/**
	* Unique key referenced by panels via {@link StatDistributionPanel#subgroupKey}.
	* @type {string}
	*/
	key = String.empty;
	/**
	* Icon index for editor chrome and future UI.
	* @type {number}
	*/
	iconIndex = -1;
	/**
	* Designer-facing description of the subgroup fantasy.
	* @type {string}
	*/
	description = String.empty;
	/**
	* Constructor.
	* @param {string} name The name driving this step.
	* @param {string} key The key driving this step.
	* @param {number} iconIndex The icon index driving this step.
	* @param {string} description The description driving this step.
	*/
	constructor(name, key, iconIndex, description) {
		this.name = name;
		this.key = key;
		this.iconIndex = iconIndex;
		this.description = description;
	}
};

//#endregion
//#region src/plugins/sdp/core/models/SdpConfiguration.js
/**
* Top-level SDP configuration model (panels + subgroup + family registries).
*/
var SdpConfiguration = class SdpConfiguration {
	/**
	* All panels defined in configuration.
	* @type {StatDistributionPanel[]}
	*/
	#panels = [];
	/**
	* All subgroups defined in configuration.
	* @type {PanelSubgroup[]}
	*/
	#subgroups = [];
	/**
	* All families defined in configuration.
	* @type {PanelFamily[]}
	*/
	#families = [];
	/**
	* Subgroup registry rows keyed for panel dropdowns and boot validation.
	* @type {Map<string, PanelSubgroup>}
	*/
	#subgroupsMap = new Map();
	/**
	* Family registry rows keyed for menu filtering.
	* @type {Map<string, PanelFamily>}
	*/
	#familiesMap = new Map();
	/**
	* Reverse lookup: subgroup key → owning family key (empty when unassigned).
	* @type {Map<string, string>}
	*/
	#familyKeyBySubgroupKey = new Map();
	/**
	* Mastery panels grouped by subgroup — used when reconciling learn/forget on max rank.
	* @type {Map<string, StatDistributionPanel[]>}
	*/
	#panelsBySubgroupKey = new Map();
	/**
	* Constructor.
	* @param {StatDistributionPanel[]} panels The panels driving this step.
	* @param {PanelSubgroup[]} subgroups The subgroups driving this step.
	* @param {PanelFamily[]} families The families driving this step.
	* @param {Map<string, PanelSubgroup>} subgroupsMap The subgroups map driving this step.
	* @param {Map<string, PanelFamily>} familiesMap The families map driving this step.
	* @param {Map<string, string>} familyKeyBySubgroupKey The family key by subgroup key driving this step.
	* @param {Map<string, StatDistributionPanel[]>} panelsBySubgroupKey The panels by subgroup key driving this step.
	*/
	constructor(panels, subgroups, families, subgroupsMap, familiesMap, familyKeyBySubgroupKey, panelsBySubgroupKey) {
		this.#panels = panels;
		this.#subgroups = subgroups;
		this.#families = families;
		this.#subgroupsMap = subgroupsMap;
		this.#familiesMap = familiesMap;
		this.#familyKeyBySubgroupKey = familyKeyBySubgroupKey;
		this.#panelsBySubgroupKey = panelsBySubgroupKey;
	}
	/**
	* Gets the SDP panels that are currently defined in configuration.
	* @returns {StatDistributionPanel[]}
	*/
	panels() {
		return this.#panels;
	}
	/**
	* Gets the panel subgroups that are currently defined in configuration.
	* @returns {PanelSubgroup[]}
	*/
	subgroups() {
		return this.#subgroups;
	}
	/**
	* Gets the panel families that are currently defined in configuration.
	* @returns {PanelFamily[]}
	*/
	families() {
		return this.#families;
	}
	/**
	* Gets the subgroup key map built during configuration validation.
	* @returns {Map<string, PanelSubgroup>}
	*/
	subgroupsMap() {
		return this.#subgroupsMap;
	}
	/**
	* Gets the family key map built during configuration validation.
	* @returns {Map<string, PanelFamily>}
	*/
	familiesMap() {
		return this.#familiesMap;
	}
	/**
	* Gets the reverse lookup from subgroup key to family key.
	* @returns {Map<string, string>}
	*/
	familyKeyBySubgroupKey() {
		return this.#familyKeyBySubgroupKey;
	}
	/**
	* Gets mastery panels grouped by subgroup key (sorted by tier).
	* @returns {Map<string, StatDistributionPanel[]>}
	*/
	panelsBySubgroupKey() {
		return this.#panelsBySubgroupKey;
	}
	/**
	* A builder class for fluently constructing new {@link SdpConfiguration}s.
	* @type {SdpConfigurationBuilder}
	*/
	static builder = new class SdpConfigurationBuilder {
		/**
		* Panel state for this builder.
		* @type {StatDistributionPanel[]}
		*/
		#panels = [];
		/**
		* Subgroup state for this builder.
		* @type {PanelSubgroup[]}
		*/
		#subgroups = [];
		/**
		* Family state for this builder.
		* @type {PanelFamily[]}
		*/
		#families = [];
		/**
		* Subgroup map state for this builder.
		* @type {Map<string, PanelSubgroup>}
		*/
		#subgroupsMap = new Map();
		/**
		* Family map state for this builder.
		* @type {Map<string, PanelFamily>}
		*/
		#familiesMap = new Map();
		/**
		* Subgroup-to-family reverse lookup for this builder.
		* @type {Map<string, string>}
		*/
		#familyKeyBySubgroupKey = new Map();
		/**
		* Subgroup panel groupings for this builder.
		* @type {Map<string, StatDistributionPanel[]>}
		*/
		#panelsBySubgroupKey = new Map();
		/**
		* Build the instance with the provided fluent parameters.
		* @returns {SdpConfiguration}
		*/
		build() {
			const newConfig = new SdpConfiguration(this.#panels, this.#subgroups, this.#families, this.#subgroupsMap, this.#familiesMap, this.#familyKeyBySubgroupKey, this.#panelsBySubgroupKey);
			this.#clear();
			return newConfig;
		}
		/**
		* Reverts the state of the builder to an empty builder.
		*/
		#clear() {
			this.#panels = [];
			this.#subgroups = [];
			this.#families = [];
			this.#subgroupsMap = new Map();
			this.#familiesMap = new Map();
			this.#familyKeyBySubgroupKey = new Map();
			this.#panelsBySubgroupKey = new Map();
		}
		/**
		* Sets the panels for the builder.
		* @param {StatDistributionPanel[]} panels The panels from configuration.
		* @returns {SdpConfigurationBuilder} This builder for fluent-chaining.
		*/
		panels(panels) {
			this.#panels = panels;
			return this;
		}
		/**
		* Sets the subgroups for the builder.
		* @param {PanelSubgroup[]} subgroups The subgroups from configuration.
		* @returns {SdpConfigurationBuilder} This builder for fluent-chaining.
		*/
		subgroups(subgroups) {
			this.#subgroups = subgroups;
			return this;
		}
		/**
		* Sets the families for the builder.
		* @param {PanelFamily[]} families The families from configuration.
		* @returns {SdpConfigurationBuilder}
		*/
		families(families) {
			this.#families = families;
			return this;
		}
		/**
		* Sets the subgroup map for the builder.
		* @param {Map<string, PanelSubgroup>} subgroupsMap The subgroups map driving this step.
		* @returns {SdpConfigurationBuilder}
		*/
		subgroupsMap(subgroupsMap) {
			this.#subgroupsMap = subgroupsMap;
			return this;
		}
		/**
		* Sets the family map for the builder.
		* @param {Map<string, PanelFamily>} familiesMap The families map driving this step.
		* @returns {SdpConfigurationBuilder}
		*/
		familiesMap(familiesMap) {
			this.#familiesMap = familiesMap;
			return this;
		}
		/**
		* Sets the subgroup-to-family reverse lookup for the builder.
		* @param {Map<string, string>} familyKeyBySubgroupKey The family key by subgroup key driving this step.
		* @returns {SdpConfigurationBuilder}
		*/
		familyKeyBySubgroupKey(familyKeyBySubgroupKey) {
			this.#familyKeyBySubgroupKey = familyKeyBySubgroupKey;
			return this;
		}
		/**
		* Sets the subgroup panel groupings for the builder.
		* @param {Map<string, StatDistributionPanel[]>} panelsBySubgroupKey The panels by subgroup key driving this step.
		* @returns {SdpConfigurationBuilder}
		*/
		panelsBySubgroupKey(panelsBySubgroupKey) {
			this.#panelsBySubgroupKey = panelsBySubgroupKey;
			return this;
		}
	}();
};

//#endregion
//#region src/plugins/sdp/core/managers/SdpMasteryManager.js
/**
* Applies subgroup mastery skills when panels are maxed.
* Mastery is inferred from maxed {@link PanelRanking}s — no separate actor ledger.
*/
var SdpMasteryManager = class SdpMasteryManager {
	/**
	* Reconciles mastery wrapper skills for every subgroup this actor has maxed.
	* Idempotent — safe when content or plugin wiring changes mid dev save.
	* @param {Game_Actor} actor The actor whose mastery skills are being reconciled.
	*/
	static reconcileAllForActor(actor) {
		if (!actor) return;
		const subgroupKeys = new Set();
		actor.getAllSdpRankings().filter((panelRanking) => panelRanking.isPanelMaxed()).forEach((panelRanking) => {
			const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
			if (!panel) return;
			if (panel.mastery.subgroupKey === String.empty) return;
			subgroupKeys.add(panel.mastery.subgroupKey);
		});
		subgroupKeys.forEach((subgroupKey) => {
			SdpMasteryManager.reconcileSubgroupMastery(actor, subgroupKey);
		});
	}
	/**
	* Reconciles mastery wrapper skills for every party member.
	*/
	static reconcileAllForParty() {
		$gameParty.members().forEach((actor) => SdpMasteryManager.reconcileAllForActor(actor));
	}
	/**
	* Reconciles which mastery skill should be active for a subgroup on an actor.
	* Forgets every lower-tier mastery skill in the subgroup, then learns the winner.
	* @param {Game_Actor} actor The actor whose mastery skills are being reconciled.
	* @param {string} subgroupKey The subgroup key to reconcile.
	*/
	static reconcileSubgroupMastery(actor, subgroupKey) {
		if (!subgroupKey) return;
		const panelsInSubgroup = J.SDP.Metadata.panelsBySubgroupKey.get(subgroupKey);
		if (!panelsInSubgroup || panelsInSubgroup.length === 0) return;
		const winningPanel = SdpMasteryManager.#resolveWinningMasteryPanel(actor, subgroupKey);
		let supersededPanel = null;
		panelsInSubgroup.forEach((panel) => {
			const { mastery } = panel;
			if (mastery.masterySkillId <= 0) return;
			const shouldKeepSkill = winningPanel !== null && panel.key === winningPanel.key;
			if (shouldKeepSkill === false && actor.isLearnedSkill(mastery.masterySkillId)) {
				actor.forgetSkill(mastery.masterySkillId);
				supersededPanel = panel;
			}
		});
		if (winningPanel === null) return;
		const winningMastery = winningPanel.mastery;
		if (actor.isLearnedSkill(winningMastery.masterySkillId) === false) {
			actor.learnSkill(winningMastery.masterySkillId);
			SdpMasteryManager.#handleMasteryLearnedLog(actor, winningPanel, supersededPanel);
		}
	}
	/**
	* Generates a dia log announcing that an actor gained a subgroup mastery.
	* Masteries supersede one another within a subgroup, so this distinguishes a first mastery from an
	* upgrade over a lower tier- the latter being the more common and more satisfying of the two, and
	* otherwise entirely invisible to the player. Reconciles that change nothing never reach this.
	* @param {Game_Actor} actor The actor who gained the mastery.
	* @param {StatDistributionPanel} winningPanel The panel whose mastery is now active.
	* @param {StatDistributionPanel|null} supersededPanel The panel this mastery grew out of, if any.
	*/
	static #handleMasteryLearnedLog(actor, winningPanel, supersededPanel) {
		if (!J.LOG) return;
		const skill = actor.skill(winningPanel.mastery.masterySkillId);
		const headline = skill.message1 || (supersededPanel !== null ? `\\C[1]${actor.name()}\\C[0] deepened their mastery: \\C[1]${skill.name}\\C[0] supersedes ${actor.skill(supersededPanel.mastery.masterySkillId).name}!` : `\\C[1]${actor.name()}\\C[0] achieved mastery of \\C[1]${skill.name}\\C[0]!`);
		const instruction = skill.message2 || "Equip it from the skills menu to use it.";
		const log = new DiaLogBuilder().addLine(headline).addLine(instruction).setFaceName(actor.faceName()).setFaceIndex(actor.faceIndex()).build();
		$diaLogManager.addLog(log);
	}
	/**
	* Finds the highest-tier maxed mastery panel for a subgroup on an actor.
	* @param {Game_Actor} actor The actor driving this step.
	* @param {string} subgroupKey The subgroup key driving this step.
	* @returns {StatDistributionPanel|null}
	*/
	static #resolveWinningMasteryPanel(actor, subgroupKey) {
		let winningPanel = null;
		actor.getAllSdpRankings().filter((panelRanking) => panelRanking.isPanelMaxed()).forEach((panelRanking) => {
			const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
			if (!panel) return;
			const { mastery } = panel;
			if (mastery.subgroupKey !== subgroupKey) return;
			if (mastery.masterySkillId <= 0) return;
			if (winningPanel === null || mastery.subgroupTier > winningPanel.mastery.subgroupTier) {
				winningPanel = panel;
			}
		});
		return winningPanel;
	}
};

//#endregion
//#region src/plugins/sdp/core/models/PanelRanking.js
/**
* A class for tracking an actor's ranking in a particular panel.
*/
var PanelRanking = class {
	/**
	* Initializes a single panel ranking for tracking on a given actor.
	* @param {string} key The unique key for the panel to be tracked.
	* @param {number} actorId The id of the actor.
	*/
	constructor(key, actorId) {
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
	}
	/**
	* Initializes all members of this class.
	*/
	initMembers() {
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
		* Whether or not this panel ranking is unlocked for investment.
		* @type {boolean}
		*/
		this._isUnlocked = false;
	}
	/**
	* Determines whether or not the associated panel is unlocked.
	* @returns {boolean}
	*/
	isUnlocked() {
		return this._isUnlocked;
	}
	/**
	* Flags the associated panel as "unlocked".
	*/
	unlock() {
		this._isUnlocked = true;
	}
	/**
	* Flags the associated panel as "locked".
	*/
	lock() {
		this._isUnlocked = false;
	}
	/**
	* Ranks up this panel.
	* If it is at max rank, then perform the max effect exactly once
	* and then max the panel out.
	*/
	rankUp() {
		const panel = J.SDP.Metadata.panelsMap.get(this.key);
		const { maxRank } = panel;
		if (this.currentRank < maxRank) {
			this.currentRank++;
			this.performRepeatRankupEffects();
			this.performCurrentRankupEffects();
		}
		if (this.currentRank === maxRank) {
			this.performMaxRankupEffects();
		}
	}
	/**
	* Clamps the current rank down to the configured max rank when data changes.
	*/
	normalizeRank() {
		const panel = J.SDP.Metadata.panelsMap.get(this.key);
		const { maxRank } = panel;
		if (this.currentRank > maxRank) {
			this.currentRank = maxRank;
		}
	}
	/**
	* Gets whether or not this panel is maxed out.
	* @returns {boolean} True if this panel is maxed out, false otherwise.
	*/
	isPanelMaxed() {
		return this.maxed;
	}
	/**
	* Upon reaching a given rank of this panel, try to perform this `javascript` effect.
	* @param {number} newRank The rank to inspect and execute effects for.
	*/
	performRankupEffects(newRank) {
		const rewardEffects = J.SDP.Metadata.panelsMap.get(this.key).getPanelRewardsByRank(newRank);
		if (rewardEffects.length === 0) return;
		const a = $gameActors.actor(this.actorId);
		rewardEffects.forEach((rewardEffect) => {
			try {
				new Function("a", rewardEffect.effect)(a);
			} catch (err) {
				console.error(`
        An error occurred while trying to execute the rank-${this.currentRank} 
        reward for panel: ${this.key}`);
				console.error(err);
			}
		});
	}
	/**
	* Executes any rewards associated with the current rank (used after ranking up typically).
	*/
	performCurrentRankupEffects() {
		this.performRankupEffects(this.currentRank);
	}
	/**
	* Executes any rewards that are defined as "repeat rankup effects", aka -1 rank.
	*/
	performRepeatRankupEffects() {
		this.performRankupEffects(-1);
	}
	/**
	* Executes any rewards that are defined as "max rankup effects", aka 0 rank.
	*/
	performMaxRankupEffects() {
		this.maxed = true;
		SoundManager.playRecovery();
		this.performRankupEffects(0);
		this.applySubgroupMastery();
	}
	/**
	* Reconciles subgroup mastery skills after this panel reaches max rank.
	*/
	applySubgroupMastery() {
		const panel = J.SDP.Metadata.panelsMap.get(this.key);
		if (!panel || panel.mastery.participates() === false) return;
		const actor = $gameActors.actor(this.actorId);
		SdpMasteryManager.reconcileSubgroupMastery(actor, panel.mastery.subgroupKey);
	}
};
SerializableRegistry.register(PanelRanking);

//#endregion
//#region src/plugins/sdp/core/models/PanelTracking.js
/**
* A class that represents a single tracking of a panel being unlocked.
*/
var PanelTracking = class {
	/**
	* Initializes a single panel tracking.
	* @param {string} panelKey The key of the panel tracked.
	* @param {boolean} unlockedByDefault Whether or not unlocked by default.
	*/
	constructor(panelKey, unlockedByDefault) {
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
	}
	/**
	* Checks whether or not this tracked panel has been unlocked.
	* @returns {boolean}
	*/
	isUnlocked() {
		return this.unlocked;
	}
	/**
	* Unlocks this panel in tracking, allowing party members to put points
	* towards it and rank it up.
	*/
	unlock() {
		this.unlocked = true;
	}
	/**
	* Locks this panel in tracking, preventing party members from putting
	* any additional points into it.
	*/
	lock() {
		this.unlocked = false;
	}
};

//#endregion
//#region src/plugins/sdp/core/_metadata/_pluginMetadata.js
var J_SdpPluginMetadata = class J_SdpPluginMetadata extends PluginMetadata {
	/**
	* Project-relative path to the SDP JSON configuration file.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.sdp.json";
	/**
	* Minimum Max HP after SDP panel downs (0 MHP bricks the actor).
	* @type {number}
	*/
	static PanelStatFloorMhp = 1;
	/**
	* Minimum value for every other stat after SDP panel downs.
	* @type {number}
	*/
	static PanelStatFloorDefault = 0;
	/**
	* Classifies the anonymous object from the parsed json into panels and subgroups.
	* @param {any} parsedJson The parsed json driving this step.
	* @returns {SdpConfiguration}
	*/
	static classifyConfiguration(parsedJson) {
		const sdpsBlob = Array.isArray(parsedJson) ? parsedJson : parsedJson.sdps;
		const subgroupsBlob = Array.isArray(parsedJson) ? [] : parsedJson.subgroups;
		const familiesBlob = Array.isArray(parsedJson) ? [] : parsedJson.families;
		const subgroups = J_SdpPluginMetadata.parseSubgroups(subgroupsBlob);
		const families = J_SdpPluginMetadata.parseFamilies(familiesBlob);
		const panels = J_SdpPluginMetadata.classifyPanels(sdpsBlob);
		const subgroupMaps = J_SdpPluginMetadata.validateMasteryMetadata(subgroups, panels);
		const familyMaps = J_SdpPluginMetadata.validateFamilyMetadata(families, subgroupMaps.subgroupsMap);
		return SdpConfiguration.builder.panels(panels).subgroups(subgroups).families(families).subgroupsMap(subgroupMaps.subgroupsMap).familiesMap(familyMaps.familiesMap).familyKeyBySubgroupKey(familyMaps.familyKeyBySubgroupKey).panelsBySubgroupKey(subgroupMaps.panelsBySubgroupKey).build();
	}
	/**
	* Converts the JSON-parsed blob into classified {@link PanelSubgroup}s.
	* @param {any[]|undefined|null} parsedSubgroupsBlob The parsed subgroups blob driving this step.
	* @returns {PanelSubgroup[]}
	*/
	static parseSubgroups(parsedSubgroupsBlob) {
		if (!parsedSubgroupsBlob || parsedSubgroupsBlob.length === 0) {
			return [];
		}
		const parsedSubgroups = [];
		parsedSubgroupsBlob.forEach((parsedSubgroup) => {
			const subgroupName = parsedSubgroup.name ?? String.empty;
			if (subgroupName.startsWith("==")) return;
			if (subgroupName.startsWith("--")) return;
			if (subgroupName.startsWith("__")) return;
			const subgroup = new PanelSubgroup(subgroupName, parsedSubgroup.key ?? String.empty, J.BASE.Helpers.parsePluginInt(parsedSubgroup.iconIndex, -1), parsedSubgroup.description ?? String.empty);
			parsedSubgroups.push(subgroup);
		});
		return parsedSubgroups;
	}
	/**
	* Converts the JSON-parsed blob into classified {@link PanelFamily}s.
	* @param {any[]|undefined|null} parsedFamiliesBlob The parsed families blob driving this step.
	* @returns {PanelFamily[]}
	*/
	static parseFamilies(parsedFamiliesBlob) {
		if (!parsedFamiliesBlob || parsedFamiliesBlob.length === 0) {
			return [];
		}
		const parsedFamilies = [];
		parsedFamiliesBlob.forEach((parsedFamily) => {
			const familyName = parsedFamily.name ?? String.empty;
			if (familyName.startsWith("==")) return;
			if (familyName.startsWith("--")) return;
			if (familyName.startsWith("__")) return;
			const subgroupKeys = Array.isArray(parsedFamily.subgroupKeys) ? parsedFamily.subgroupKeys.filter((key) => key !== String.empty) : [];
			const family = new PanelFamily(familyName, parsedFamily.key ?? String.empty, J.BASE.Helpers.parsePluginInt(parsedFamily.iconIndex, -1), parsedFamily.description ?? String.empty, subgroupKeys);
			parsedFamilies.push(family);
		});
		return parsedFamilies;
	}
	/**
	* Validates family metadata and builds subgroup → family reverse lookup.
	* @param {PanelFamily[]} families The families driving this step.
	* @param {Map<string, PanelSubgroup>} subgroupsMap The subgroups map driving this step.
	* @returns {{ familiesMap: Map<string, PanelFamily>, familyKeyBySubgroupKey: Map<string, string> }}
	*/
	static validateFamilyMetadata(families, subgroupsMap) {
		const familiesMap = new Map();
		const familyKeyBySubgroupKey = new Map();
		families.forEach((family) => {
			if (!family.key) {
				throw new Error("J-SDP: every family row must define a non-empty key.");
			}
			if (familiesMap.has(family.key)) {
				throw new Error(`J-SDP: duplicate family key [${family.key}] in config.sdp.json.`);
			}
			familiesMap.set(family.key, family);
			family.subgroupKeys.forEach((subgroupKey) => {
				if (subgroupsMap.has(subgroupKey) === false) {
					throw new Error(`J-SDP: family [${family.key}] references unknown subgroup [${subgroupKey}].`);
				}
				if (familyKeyBySubgroupKey.has(subgroupKey)) {
					const otherFamilyKey = familyKeyBySubgroupKey.get(subgroupKey);
					throw new Error(`J-SDP: subgroup [${subgroupKey}] is assigned to multiple families ` + `[${otherFamilyKey}] and [${family.key}].`);
				}
				familyKeyBySubgroupKey.set(subgroupKey, family.key);
			});
		});
		return {
			familiesMap,
			familyKeyBySubgroupKey
		};
	}
	/**
	* Validates mastery metadata and builds subgroup panel groupings for reverse lookup.
	* @param {PanelSubgroup[]} subgroups The subgroups driving this step.
	* @param {StatDistributionPanel[]} panels The panels driving this step.
	* @returns {{ subgroupsMap: Map<string, PanelSubgroup>, panelsBySubgroupKey: Map<string, StatDistributionPanel[]> }}
	*/
	static validateMasteryMetadata(subgroups, panels) {
		const subgroupsMap = new Map();
		const panelsBySubgroupKey = new Map();
		const tierBySubgroupKey = new Map();
		subgroups.forEach((subgroup) => {
			if (!subgroup.key) {
				throw new Error("J-SDP: every subgroup row must define a non-empty key.");
			}
			if (subgroupsMap.has(subgroup.key)) {
				throw new Error(`J-SDP: duplicate subgroup key [${subgroup.key}] in config.sdp.json.`);
			}
			subgroupsMap.set(subgroup.key, subgroup);
		});
		panels.forEach((panel) => {
			const { mastery } = panel;
			if (mastery.hasPartialEnrollment()) {
				throw new Error(`J-SDP: panel [${panel.key}] has incomplete mastery metadata ` + `(subgroupKey and subgroupTier must be set together; masterySkillId is optional but requires subgroup enrollment).`);
			}
			if (mastery.enrolledInSubgroup() === false) {
				return;
			}
			if (subgroupsMap.has(mastery.subgroupKey) === false) {
				throw new Error(`J-SDP: panel [${panel.key}] references unknown subgroup [${mastery.subgroupKey}].`);
			}
			const tierMap = tierBySubgroupKey.get(mastery.subgroupKey) ?? new Map();
			if (tierMap.has(mastery.subgroupTier)) {
				const otherPanelKey = tierMap.get(mastery.subgroupTier);
				throw new Error(`J-SDP: duplicate subgroup tier ${mastery.subgroupTier} in subgroup [${mastery.subgroupKey}] ` + `for panels [${otherPanelKey}] and [${panel.key}].`);
			}
			tierMap.set(mastery.subgroupTier, panel.key);
			tierBySubgroupKey.set(mastery.subgroupKey, tierMap);
			const subgroupPanels = panelsBySubgroupKey.get(mastery.subgroupKey) ?? [];
			subgroupPanels.push(panel);
			panelsBySubgroupKey.set(mastery.subgroupKey, subgroupPanels);
		});
		panelsBySubgroupKey.forEach((subgroupPanels) => {
			subgroupPanels.sort((left, right) => left.mastery.subgroupTier - right.mastery.subgroupTier);
		});
		return {
			subgroupsMap,
			panelsBySubgroupKey
		};
	}
	/**
	* Converts the JSON-parsed blob into classified {@link StatDistributionPanel}s.
	* @param {any} parsedBlob The already-parsed JSON blob.
	* @return {StatDistributionPanel[]} The blob with all data converted into proper classes.
	*/
	static classifyPanels(parsedBlob) {
		const parsedPanels = [];
		const foreacher = (parsedPanel) => {
			const panelName = parsedPanel.identity ? parsedPanel.identity.name : parsedPanel.name ?? String.empty;
			if (panelName.startsWith("__")) return;
			if (panelName.startsWith("--")) return;
			const { panelParameters, panelRewards } = parsedPanel;
			const parsedPanelParameters = [];
			panelParameters.forEach((paramBlob) => {
				const parsedParameter = paramBlob;
				const panelParameter = new PanelParameter(parsedParameter.parameterKey, parseFloat(parsedParameter.perRank), parsedParameter.isFlat, parsedParameter.isCore);
				parsedPanelParameters.push(panelParameter);
			});
			const parsedPanelRewards = [];
			if (panelRewards) {
				panelRewards.forEach((reward) => {
					const parsedReward = reward;
					const panelReward = new PanelRankupReward(parsedReward.rewardName, parseInt(parsedReward.rankRequired), parsedReward.effect);
					parsedPanelRewards.push(panelReward);
				});
			}
			const panel = StatDistributionPanel.Builder().key(parsedPanel.key ?? String.empty).identity(PanelIdentity.fromConfigPanel(parsedPanel)).progression(PanelProgression.fromConfigPanel(parsedPanel)).parameters(parsedPanelParameters).rewards(parsedPanelRewards).mastery(PanelMastery.fromConfigPanel(parsedPanel)).build();
			parsedPanels.push(panel);
		};
		parsedBlob.forEach(foreacher, this);
		return parsedPanels;
	}
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	*  Extends {@link #postInitialize}.<br>
	*  Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializePanelCostDefaultsByRarity();
		this.initializePanels();
		this.initializeMetadata();
	}
	/**
	* Parses plugin parameters into six rarity rows (**Common..Godlike**) used as the core rank-up cost spine.
	* Panel JSON fields layer additive / multiplicative offsets on top — see resolveEffectiveRankUpCostParts.
	*/
	initializePanelCostDefaultsByRarity() {
		const { parsedPluginParameters: p } = this;
		/**
		* One rarity tier: base SDP, exponential coefficient, and growth base (**mult**).
		* @type {{ baseCost: number, flatGrowthCost: number, multGrowthCost: number }}
		*/
		const row = (baseKey, flatKey, multKey, fbBase, fbFlat, fbMult) => {
			return {
				baseCost: J.BASE.Helpers.parsePluginInt(p[baseKey], fbBase),
				flatGrowthCost: J.BASE.Helpers.parsePluginInt(p[flatKey], fbFlat),
				multGrowthCost: J_SdpPluginMetadata.#parsePositiveFloatOr(p[multKey], fbMult)
			};
		};
		/**
		* Indexed **0–5** matching {@link PanelRarity} Common..Godlike.
		* @type {Array<{ baseCost: number, flatGrowthCost: number, multGrowthCost: number }>}
		*/
		this.panelCostDefaultsByRarity = [
			row("sdpDefaultCommonBase", "sdpDefaultCommonFlat", "sdpDefaultCommonMult", 0, 70, 1.06),
			row("sdpDefaultMagicalBase", "sdpDefaultMagicalFlat", "sdpDefaultMagicalMult", 0, 235, 1.06),
			row("sdpDefaultRareBase", "sdpDefaultRareFlat", "sdpDefaultRareMult", 0, 1180, 1.06),
			row("sdpDefaultEpicBase", "sdpDefaultEpicFlat", "sdpDefaultEpicMult", 0, 4320, 1.06),
			row("sdpDefaultLegendaryBase", "sdpDefaultLegendaryFlat", "sdpDefaultLegendaryMult", 0, 11900, 1.06),
			row("sdpDefaultGodlikeBase", "sdpDefaultGodlikeFlat", "sdpDefaultGodlikeMult", 0, 30500, 1.06)
		];
	}
	/**
	* @param {string|number|undefined|null} value The value driving this step.
	* @param {number} fallback The fallback driving this step.
	* @returns {number}
	*/
	static #parsePositiveFloatOr(value, fallback) {
		if (value === undefined || value === null || value === "") {
			return fallback;
		}
		const parsed = Number.parseFloat(String(value));
		if (Number.isFinite(parsed) && parsed > 0) {
			return parsed;
		}
		return fallback;
	}
	/**
	* Effective rank-up cost knobs after combining rarity defaults with per-panel overrides from `config.sdp.json`.
	*
	* @param {StatDistributionPanel} panel The panel driving this step.
	* @returns {{ baseCost: number, flatGrowthCost: number, multGrowthCost: number }}
	*/
	resolveEffectiveRankUpCostParts(panel) {
		const rarityIndex = PanelRarity.normalizeRarityFromJson(panel.rarity);
		const row = this.panelCostDefaultsByRarity[rarityIndex];
		const scale = panel.multGrowthCost;
		const safeScale = scale > 0 ? scale : 1;
		return {
			baseCost: row.baseCost + panel.baseCost,
			flatGrowthCost: row.flatGrowthCost + panel.flatGrowthCost,
			multGrowthCost: row.multGrowthCost * safeScale
		};
	}
	/**
	* Initializes the SDPs that exist in the SDP configuration.
	*/
	initializePanels() {
		const canLogLoadInfo = J_SdpPluginMetadata.#hasMinimumBaseVersion();
		const classifiedConfiguration = ExternalJsonConfigLoader.load(J_SdpPluginMetadata.CONFIG_PATH, ExternalJsonConfigLoaderOptions.Builder().pluginName("J-SDP").configName("sdp configuration").mapper((parsed) => J_SdpPluginMetadata.classifyConfiguration(parsed)).logSummary(canLogLoadInfo ? (result) => [
			`- ${result.panels().length} panels`,
			`- ${result.subgroups().length} subgroups`,
			`- ${result.families().length} families`
		] : null).build());
		/**
		* The collection of all defined SDPs.
		* @type {StatDistributionPanel[]}
		*/
		this.panels = classifiedConfiguration.panels();
		const panelMap = new Map();
		this.panels.forEach((panel) => panelMap.set(panel.key, panel));
		/**
		* A key:panel map of all defined SDPs.
		* @type {Map<string, StatDistributionPanel>}
		*/
		this.panelsMap = panelMap;
		/**
		* The collection of all defined panel subgroups.
		* @type {PanelSubgroup[]}
		*/
		this.subgroups = classifiedConfiguration.subgroups();
		/**
		* A key:subgroup map of all defined panel subgroups.
		* @type {Map<string, PanelSubgroup>}
		*/
		this.subgroupsMap = classifiedConfiguration.subgroupsMap();
		/**
		* Panels grouped by subgroup key, sorted ascending by {@link PanelMastery#subgroupTier}.
		* Built at boot so max-rank reconciliation can reverse-lookup without scanning every panel.
		* @type {Map<string, StatDistributionPanel[]>}
		*/
		this.panelsBySubgroupKey = classifiedConfiguration.panelsBySubgroupKey();
		/**
		* The collection of all defined panel families.
		* @type {PanelFamily[]}
		*/
		this.families = classifiedConfiguration.families();
		/**
		* A key:family map of all defined panel families.
		* @type {Map<string, PanelFamily>}
		*/
		this.familiesMap = classifiedConfiguration.familiesMap();
		/**
		* Reverse lookup from subgroup key to owning family key.
		* @type {Map<string, string>}
		*/
		this.familyKeyBySubgroupKey = classifiedConfiguration.familyKeyBySubgroupKey();
	}
	initializeMetadata() {
		/**
		* The id of a switch that represents whether or not this system is accessible
		* in the menu.
		* @type {number}
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menuSwitch"], 0);
		/**
		* The icon index that represents the system itself.
		* Used as the icon for costs and currency.
		* @type {number}
		*/
		this.sdpIconIndex = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["sdpIcon"], 0);
		/**
		* The text displayed upon victory during a battle-end victory scene.
		*/
		this.victoryText = this.parsedPluginParameters["victoryText"];
		/**
		* The name used for the command when visible in a menu.
		* @type {string}
		*/
		this.commandName = this.parsedPluginParameters["menuCommandName"] ?? "Distribute";
		/**
		* The icon used alongside the command's name when visible in the menu.
		* @type {number}
		*/
		this.commandIconIndex = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menuCommandIcon"], 0);
		/**
		* Singular player-facing name for one SDP row (confirmation copy, future labels).
		* @type {string}
		*/
		this.unitSingular = this.parsedPluginParameters["sdpUnitSingular"] ?? "panel";
		/**
		* Plural player-facing name for counts such as “4 upgrades on 2 …”.
		* @type {string}
		*/
		this.unitPlural = this.parsedPluginParameters["sdpUnitPlural"] ?? "panels";
		/**
		* Short label for spendable currency (“Remaining …”, cart wallet chip, {@link TextManager#sdpPoints}).
		* @type {string}
		*/
		this.sdpPointsDisplayName = this.parsedPluginParameters["sdpPointsDisplayName"] ?? "SDP";
		/**
		* Minimum Max HP after SDP panel downs (0 MHP bricks the actor).
		* @type {number}
		*/
		this.panelStatFloorMhp = J_SdpPluginMetadata.PanelStatFloorMhp;
		/**
		* Minimum value for every other stat after SDP panel downs.
		* @type {number}
		*/
		this.panelStatFloorDefault = J_SdpPluginMetadata.PanelStatFloorDefault;
	}
	/**
	* Checks if the BASE plugin meets the minimum version requirement for this plugin.
	* @return {boolean}
	*/
	static #hasMinimumBaseVersion() {
		const minimumVersion = this.#minimumBaseVersion();
		const actualVersion = new PluginVersion(J.BASE.Metadata.Version);
		const meetsThreshold = actualVersion.satisfiesPluginVersion(minimumVersion);
		if (!meetsThreshold) return false;
		return true;
	}
	/**
	* Gets the current minimum version of the J-BASE system this plugin requires.
	* @returns {PluginVersion}
	*/
	static #minimumBaseVersion() {
		return PluginVersion.builder.major("2").minor("3").patch("1").build();
	}
};

//#endregion
//#region src/plugins/sdp/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.SDP = {};
/**
* The metadata associated with this plugin.
*/
J.SDP.Metadata = new J_SdpPluginMetadata("J-SDP", "3.0.0");
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
	Game_Player: new Map(),
	Game_Switches: new Map(),
	Game_System: new Map(),
	Scene_Boot: new Map(),
	Scene_Map: new Map(),
	Scene_Menu: new Map(),
	Window_MenuCommand: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.SDP.RegExp = {
	SdpPoints: /<sdpPoints: ?-?([0-9]+)>/i,
	SdpMultiplier: /<sdpMultiplier: ?([-.\d]+)>/i,
	SdpBonusFormula: /<sdpBonusFormula:\[(.+?)]>/i,
	SdpDropData: /<sdpDropData: ?(\[[-\w]+,[ ]?\d+])>/i,
	SdpUnlockKey: /<sdpUnlock: ?(.+)>/i
};

//#endregion
//#region src/plugins/sdp/core/database/RPG_DropItem.js
/**
* The SDP key of this item.
* @type {string}
*/
Object.defineProperty(RPG_DropItem.prototype, "sdpKey", { get: function() {
	return this.getSdpKey();
} });
/**
* Gets the SDP key of this item.
* @returns {string}
*/
RPG_DropItem.prototype.getSdpKey = function() {
	return this._sdpKey;
};
/**
* Gets the key of this item.
* @param {string} key The key of the SDP.
*/
RPG_DropItem.prototype.setSdpKey = function(key) {
	this._sdpKey = key;
};
/**
* Checks whether or not this drop item is a stat distribution panel drop.
* @returns {boolean} True if this is a panel drop, false otherwise.
*/
RPG_DropItem.prototype.isSdpDrop = function() {
	return !!this.getSdpKey();
};

//#endregion
//#region src/plugins/sdp/core/database/RPG_Item.js
/**
* The SDP key that this item unlocks upon use.
* @type {string}
*/
Object.defineProperty(RPG_Item.prototype, "sdpKey", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.SDP.RegExp.SdpUnlockKey);
} });

//#endregion
//#region src/plugins/sdp/core/database/RPG_Enemy.js
/**
* The number of SDP points this enemy will yield upon defeat.
* @type {number|null}
*/
Object.defineProperty(RPG_Enemy.prototype, "sdpPoints", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.SDP.RegExp.SdpPoints);
} });
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
Object.defineProperty(RPG_Enemy.prototype, "sdpDropData", { get: function() {
	const sdpData = RPGManager.getArrayFromNotesByRegex(this, J.SDP.RegExp.SdpDropData, true, true);
	return sdpData ?? [String.empty, 0];
} });
/**
* Gets the key of the panel being dropped.
* @type {string}
*/
Object.defineProperty(RPG_Enemy.prototype, "sdpDropKey", { get: function() {
	return this.sdpDropData[0];
} });
/**
* Gets the drop rate for this panel.
* @type {number}
*/
Object.defineProperty(RPG_Enemy.prototype, "sdpDropChance", { get: function() {
	return this.sdpDropData[1];
} });

//#endregion
//#region src/plugins/sdp/core/objects/Game_BattlerBase.js
/**
* Gets all SDP bonuses for the given crit parameter id.
* @param {number} critParamId The id of the crit parameter.
* @param {number} baseParam The base value of the crit parameter in question.
* @returns {number}
*/
Game_BattlerBase.prototype.critSdpBonuses = function(critParamId, baseParam) {
	return 0;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Battler.js
/**
* SDP points multiplier for this battler.
*/
Object.defineProperty(Game_BattlerBase.prototype, "sdpMultiplier", {
	get: function() {
		return 1;
	},
	configurable: true
});

//#endregion
//#region src/plugins/sdp/core/objects/Game_Actor.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the SDP members.
*/
J.SDP.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function() {
	J.SDP.Aliased.Game_Actor.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the SDP system.
	*/
	this._j._sdp ||= {};
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
Game_Actor.prototype.getOrCreateSdpRankByKey = function(key) {
	const rankings = this.getAllSdpRankings();
	const existingRanking = rankings.find((panelRank) => panelRank.key === key);
	if (existingRanking) {
		return existingRanking;
	}
	const newRanking = new PanelRanking(key, this.actorId());
	rankings.push(newRanking);
	return newRanking;
};
/**
* Searches for a ranking in a given panel based on key and returns it.
* @param {string} key The key of the panel we seek.
* @returns {PanelRanking} The sdp ranking.
*/
Game_Actor.prototype.getSdpByKey = function(key) {
	return this.getOrCreateSdpRankByKey(key);
};
/**
* Gets all rankings that this actor has.
* @returns {PanelRanking[]}
*/
Game_Actor.prototype.getAllSdpRankings = function() {
	return this._j._sdp._ranks;
};
/**
* Sum of all panel current ranks for this actor (convenience for menus / reporting).
* @returns {number}
*/
Game_Actor.prototype.getTotalSdpRanks = function() {
	return this.getAllSdpRankings().reduce((total, panelRanking) => total + panelRanking.currentRank, 0);
};
/**
* The number of panels this actor has reached max rank on.
* @returns {number}
*/
Game_Actor.prototype.getMasteryCount = function() {
	return this.getAllSdpRankings().filter((panelRanking) => panelRanking.isPanelMaxed() === true).length;
};
/**
* Gets all unlocked panels for this actor.
* @returns {PanelRanking[]}
*/
Game_Actor.prototype.getAllUnlockedSdps = function() {
	return this.getAllSdpRankings().filter((panelRanking) => panelRanking.isUnlocked());
};
/**
* Unlocks a panel by its key.
* @param {string} key The key of the panel to unlock.
*/
Game_Actor.prototype.unlockSdpByKey = function(key) {
	const panelRanking = this.getSdpByKey(key);
	panelRanking.unlock();
};
/**
* Checks if a particular panel is unlocked.
* @param {string} key The key of the panel to check.
* @returns {boolean}
*/
Game_Actor.prototype.isSdpUnlocked = function(key) {
	return this.getSdpByKey(key).isUnlocked();
};
/**
* Check if this actor has any unlocked panels.
* @returns {boolean}
*/
Game_Actor.prototype.hasAnyUnlockedSdps = function() {
	return this.getAllUnlockedSdps().length > 0;
};
/**
* Locks a panel by its key.
* @param {string} key The key of the panel to lock.
*/
Game_Actor.prototype.lockSdpByKey = function(key) {
	const panelRanking = this.getSdpByKey(key);
	panelRanking.lock();
};
/**
* Gets the accumulative total of points this actor has ever gained.
* @returns {number}
*/
Game_Actor.prototype.getAccumulatedTotalSdpPoints = function() {
	return this._j._sdp._pointsEverGained;
};
/**
* Increase the amount of accumulated total points for this actor by a given amount.
* This amount should never be reduced.
* @param {number} points The number of points to increase the total by.
*/
Game_Actor.prototype.modAccumulatedTotalSdpPoints = function(points) {
	if (points > 0) {
		this._j._sdp._pointsEverGained += points;
	}
};
/**
* Gets the accumulative total of points this actor has ever spent.
* @returns {number}
*/
Game_Actor.prototype.getAccumulatedSpentSdpPoints = function() {
	return this._j._sdp._pointsSpent;
};
/**
* Increase the amount of accumulated spent points for this actor by a given amount.
* This number is designed to not be reduced except when refunding.
* @param {number} points The number of points to increase the spent by.
*/
Game_Actor.prototype.modAccumulatedSpentSdpPoints = function(points) {
	this._j._sdp._pointsSpent += points;
};
/**
* Gets the amount of SDP points this actor has.
*/
Game_Actor.prototype.getSdpPoints = function() {
	return this._j._sdp._points;
};
/**
* Increase the amount of SDP points the actor has by a given amount.
* If the parameter provided is negative, it will reduce the actor's points instead.
*
* NOTE: An actor's SDP points cannot be less than 0.
* @param {number} points The number of points we are adding/removing from this actor.
*/
Game_Actor.prototype.modSdpPoints = function(points) {
	let gainedSdpPoints = points;
	if (gainedSdpPoints > 0) {
		gainedSdpPoints = Math.round(gainedSdpPoints * this.sdpMultiplier);
		const formulaBonus = RPGManager.getResultsFromAllNotesByRegex(this.getAllNotes(), J.SDP.RegExp.SdpBonusFormula, 0, this);
		if (formulaBonus !== 0) {
			gainedSdpPoints = Math.round(gainedSdpPoints * (1 + formulaBonus));
		}
		this.modAccumulatedTotalSdpPoints(gainedSdpPoints);
	}
	this._j._sdp._points += gainedSdpPoints;
	if (this._j._sdp._points < 0) {
		this._j._sdp._points = 0;
	}
	return gainedSdpPoints;
};
/**
* SDP points multiplier for this actor.
*/
Object.defineProperty(Game_Actor.prototype, "sdpMultiplier", {
	get: function() {
		const multiplier = 100;
		const objectsToCheck = this.getAllNotes();
		const sdpMultiplierBonus = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.SDP.RegExp.SdpMultiplier);
		const sdpPanelBonus = this.getSdpBonusForParameterKey ? this.getSdpBonusForParameterKey("sdr", 1) : 0;
		return (multiplier + sdpMultiplierBonus + sdpPanelBonus) / 100;
	},
	configurable: true
});
/**
* Ranks up this actor's panel by key.
* @param {string} panelKey The key of the panel to rank up.
*/
Game_Actor.prototype.rankUpPanel = function(panelKey) {
	this.getSdpByKey(panelKey).rankUp();
};
/**
* Calculates SDP panel bonuses for a catalog parameter key (cdm, lst, mtp, etc.).
* @param {string} parameterKey The registry key to accumulate panel growth for.
* @param {number} baseParam The base value used for percent-based panel growth.
* @returns {number}
*/
Game_Actor.prototype.getSdpBonusForParameterKey = function(parameterKey, baseParam) {
	if (!J.SDP) return 0;
	if (!parameterKey) return 0;
	const panelRankings = this.getAllSdpRankings();
	if (!panelRankings.length) return 0;
	let val = 0;
	panelRankings.forEach((panelRanking) => {
		const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
		if (!panel) return;
		val += panel.calculateBonusByRank(parameterKey, panelRanking.currentRank, baseParam, false);
	});
	return val;
};
/**
* Calculates SDP panel bonuses for a custom catalog parameter (legacy numeric id wrapper).
* @param {number} paramId The legacy panel parameter id.
* @param {number} baseParam The base value used for percent-based panel growth.
* @returns {number}
*/
Game_Actor.prototype.getSdpBonusForCustomParam = function(paramId, baseParam) {
	const parameterKey = ParameterKeys.legacyLongParamKey(paramId);
	return this.getSdpBonusForParameterKey(parameterKey, baseParam);
};
/**
* Calculates the value of the bonus stats for a designated core parameter.
* @param {number} paramId The id of the parameter to get the bonus for.
* @param {number} baseParam The base value of the designated parameter.
* @returns {number}
*/
Game_Actor.prototype.getSdpBonusForCoreParam = function(paramId, baseParam) {
	const parameterKey = ParameterKeys.bparamKey(paramId);
	const panelRankings = this.getAllSdpRankings();
	if (!panelRankings.length) return 0;
	if (!parameterKey) return 0;
	let panelModifications = 0;
	panelRankings.forEach((panelRanking) => {
		const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
		if (!panel) {
			return;
		}
		const panelParameters = panel.getPanelParameterByKey(parameterKey);
		if (!panelParameters.length) return;
		panelParameters.forEach((panelParameter) => {
			const { perRank } = panelParameter;
			const curRank = panelRanking.currentRank;
			if (!panelParameter.isFlat) {
				panelModifications += Math.floor(baseParam * (curRank * perRank) / 100);
			} else {
				panelModifications += curRank * perRank;
			}
		});
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
Game_Actor.prototype.getSdpBonusForNonCoreParam = function(sparamId, baseParam, idExtra) {
	const parameterKey = idExtra === 8 ? ParameterKeys.xparamKey(sparamId) : ParameterKeys.sparamKey(sparamId);
	const panelRankings = this.getAllSdpRankings();
	if (!panelRankings.length) return 0;
	if (!parameterKey) return 0;
	let panelModifications = 0;
	panelRankings.forEach((panelRanking) => {
		const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
		if (!panel) {
			return;
		}
		const panelParameters = panel.getPanelParameterByKey(parameterKey);
		if (!panelParameters.length) return;
		panelParameters.forEach((panelParameter) => {
			const { perRank } = panelParameter;
			const curRank = panelRanking.currentRank;
			if (!panelParameter.isFlat) {
				panelModifications += baseParam * (curRank * perRank) / 100;
			} else {
				panelModifications += curRank * perRank / 100;
			}
		});
	});
	return panelModifications;
};
/**
* Combines pre-SDP base with panel delta and enforces stat floors after downs.
* @param {number} baseParam Pre-SDP base.
* @param {number} panelModifications Net SDP panel delta.
* @param {number} minResult Minimum allowed total (MHP uses {@link J.SDP.Metadata#panelStatFloorMhp}).
* @returns {number}
*/
Game_Actor.prototype.applySdpPanelStatFloor = function(baseParam, panelModifications, minResult) {
	const raw = baseParam + panelModifications;
	if (raw >= minResult) {
		return raw;
	}
	return minResult;
};
/**
* Extends the base parameters with the SDP bonuses.
*/
J.SDP.Aliased.Game_Actor.set("param", Game_Actor.prototype.param);
Game_Actor.prototype.param = function(paramId) {
	const baseParam = J.SDP.Aliased.Game_Actor.get("param").call(this, paramId);
	const panelModifications = this.getSdpBonusForCoreParam(paramId, baseParam);
	const minResult = paramId === 0 ? J.SDP.Metadata.panelStatFloorMhp : J.SDP.Metadata.panelStatFloorDefault;
	return this.applySdpPanelStatFloor(baseParam, panelModifications, minResult);
};
/**
* Extends the ex-parameters with the SDP bonuses.
*/
J.SDP.Aliased.Game_Actor.set("xparam", Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId) {
	const baseParam = J.SDP.Aliased.Game_Actor.get("xparam").call(this, xparamId);
	const panelModifications = this.getSdpBonusForNonCoreParam(xparamId, baseParam, 8);
	return this.applySdpPanelStatFloor(baseParam, panelModifications, J.SDP.Metadata.panelStatFloorDefault);
};
/**
* Extends the sp-parameters with the SDP bonuses.
*/
J.SDP.Aliased.Game_Actor.set("sparam", Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId) {
	const baseParam = J.SDP.Aliased.Game_Actor.get("sparam").call(this, sparamId);
	const panelModifications = this.getSdpBonusForNonCoreParam(sparamId, baseParam, 18);
	return this.applySdpPanelStatFloor(baseParam, panelModifications, J.SDP.Metadata.panelStatFloorDefault);
};
/**
* Extends {@link #maxTp}.<br/>
* Includes bonuses from panels as well.
* @returns {number}
*/
J.SDP.Aliased.Game_Actor.set("maxTp", Game_Actor.prototype.maxTp);
Game_Actor.prototype.maxTp = function() {
	const baseMaxTp = J.SDP.Aliased.Game_Actor.get("maxTp").call(this);
	const bonusMaxTpFromSdp = this.maxTpSdpBonuses(baseMaxTp);
	return this.applySdpPanelStatFloor(baseMaxTp, bonusMaxTpFromSdp, J.SDP.Metadata.panelStatFloorDefault);
};
/**
* Calculates the bonuses for Max TP from the actor's currently ranked SDPs.
* @param {number} baseMaxTp The base max TP for this actor.
* @returns {number}
*/
Game_Actor.prototype.maxTpSdpBonuses = function(baseMaxTp) {
	const panelRankings = this.getAllSdpRankings();
	if (!panelRankings.length) return 0;
	let panelModifications = 0;
	panelRankings.forEach((panelRanking) => {
		const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
		if (!panel) {
			return;
		}
		const panelParameters = panel.getPanelParameterByKey("mtp");
		if (panelParameters.length) {
			panelParameters.forEach((panelParameter) => {
				const { perRank, isFlat } = panelParameter;
				const { currentRank } = panelRanking;
				if (isFlat) {
					panelModifications += currentRank * perRank;
				} else {
					panelModifications += Math.floor(baseMaxTp * (currentRank * perRank) / 100);
				}
			});
		}
	});
	return panelModifications;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Enemy.js
/**
* Gets any additional drops from the notes of this particular enemy.
* This allows for only gaining an SDP from enemies once.
* @returns {RPG_DropItem[]}
*/
J.SDP.Aliased.Game_Enemy.set("extraDrops", Game_Enemy.prototype.extraDrops);
Game_Enemy.prototype.extraDrops = function() {
	const dropList = J.SDP.Aliased.Game_Enemy.get("extraDrops").call(this);
	if (!this.canDropSdp()) return dropList;
	const sdpDrop = this.makeSdpDrop();
	dropList.push(sdpDrop);
	return dropList;
};
/**
* Determines if there is an SDP to drop, and whether or not to drop it.
* @returns {RPG_DropItem}
*/
Game_Enemy.prototype.canDropSdp = function() {
	if (!this.hasSdpDropData()) return false;
	const panel = J.SDP.Metadata.panelsMap.get(this.enemy().sdpDropKey);
	if (!panel) {
		console.warn(`Panel of key ${this.enemy().sdpDropKey} is not defined, but was trying to be dropped.`);
		console.warn(`Consider defining a panel with the key of ${this.enemy().sdpDropKey}.<br>`);
		return false;
	}
	if ($gameParty.isSdpUnlocked(panel.key)) return false;
	return true;
};
/**
* Makes the new drop item for the SDP based on the data from this enemy.
* @returns {RPG_Item}
*/
Game_Enemy.prototype.makeSdpDrop = function() {
	const [key, chance, itemId] = this.getSdpDropData();
	const debugChance = $gameSystem.shouldForceDropSdp() ? 1e7 : chance;
	const sdpDrop = new RPG_DropItemBuilder().itemLoot(itemId, debugChance);
	sdpDrop.setSdpKey(key);
	return sdpDrop;
};
/**
* Gets the SDP drop data from this enemy.
* @returns {[string,number,number]}
*/
Game_Enemy.prototype.getSdpDropData = function() {
	return this.enemy().sdpDropData;
};
/**
* Gets whether or not this enemy has an SDP to drop.
* @returns {boolean}
*/
Game_Enemy.prototype.hasSdpDropData = function() {
	return this.enemy().sdpDropData[0] !== String.empty;
};
/**
* Extends {@link #findLoot}.<br/>
* Custom handles SDP drops to enable potentially item-less SDP relations.
* @param {RPG_DropItem} drop The drop being found.
* @param {RPG_BaseItem} itemsFound The running list of items that have been found.
*/
J.SDP.Aliased.Game_Enemy.set("findLoot", Game_Enemy.prototype.findLoot);
Game_Enemy.prototype.findLoot = function(drop, itemsFound) {
	if (drop.isSdpDrop()) {
		const sdpLoot = this.buildSdpLoot(drop);
		itemsFound.push(sdpLoot);
		return;
	}
	J.SDP.Aliased.Game_Enemy.get("findLoot").call(this, drop, itemsFound);
};
/**
* Dynamically generates a custom drop exclusive for picking up and unlocking an SDP without a backing item.
* @param {RPG_DropItem} drop The SDP loot to build.
* @returns {{
*   name: string,
*   iconIndex: number,
*   description: string,
*   itypeId: number,
*   sdpKey: string,
*   jabsUseOnPickup: boolean,
* }}
*/
Game_Enemy.prototype.buildSdpLoot = function(drop) {
	const panel = J.SDP.Metadata.panelsMap.get(drop.sdpKey);
	const dynamicLoot = {
		id: 0,
		meta: {},
		note: String.empty,
		name: panel.name,
		iconIndex: panel.iconIndex ?? J.SDP.Metadata.sdpIconIndex,
		description: panel.description ?? "",
		itypeId: 1,
		animationId: 119,
		sdpKey: panel.key,
		jabsUseOnPickup: true
	};
	return dynamicLoot;
};
/**
* Gets the base amount of SDP points this enemy grants.
* @returns {number}
*/
Game_Enemy.prototype.sdpPoints = function() {
	return this.enemy().sdpPoints;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Party.js
/**
* Extends {@link #initialize}.<br/>
* Also initializes our SDP members.
*/
J.SDP.Aliased.Game_Party.set("initialize", Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function() {
	J.SDP.Aliased.Game_Party.get("initialize").call(this);
	this.initSdpMembers();
};
/**
* Initializes all members of the sdp system.
*/
Game_Party.prototype.initSdpMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the sdp system.
	*/
	this._j._sdp ||= {};
};
/**
* Checks if any member of the party has any unlocked panels.
* @returns {boolean} True if at least one member has at least one panel unlocked, false otherwise.
*/
Game_Party.prototype.hasAnyUnlockedSdps = function() {
	return $gameActors.actors().some((actor) => actor.hasAnyUnlockedSdps());
};
/**
* Unlocks an SDP being tracked by its key.
* @param {string} key The key of the SDP to unlock.
*/
Game_Party.prototype.unlockSdp = function(key) {
	if (J.SDP.Metadata.panelsMap.has(key) === false) {
		console.error(`The SDP key of ${key} was not found in the list of panels to unlock.`);
		return;
	}
	$gameActors.actors().forEach((member) => member.unlockSdpByKey(key));
};
/**
* Unlocks every defined SDP panel for all actors returned by {@link Game_Actors#actors}
* (database actors with valid names). Intended for dev / testing.
*/
Game_Party.prototype.unlockAllSdpsForEveryone = function() {
	J.SDP.Metadata.panelsMap.forEach((panel, key) => {
		this.unlockSdp(key);
	});
};
/**
* Checks if a particular panel is unlocked for the whole party.
* @param {string} key The key of the panel to check.
* @returns {boolean} True if every actor has it unlocked, false otherwise.
*/
Game_Party.prototype.isSdpUnlocked = function(key) {
	return $gameActors.actors().every((actor) => actor.isSdpUnlocked(key));
};
/**
* Locks a panel for all party members.
* @param {string} key The key of the panel unlock.
*/
Game_Party.prototype.lockSdp = function(key) {
	if (J.SDP.Metadata.panelsMap.has(key) === false) {
		console.error(`The SDP key of ${key} was not found in the list of panels to lock.`);
		return;
	}
	$gameActors.actors().forEach((member) => member.lockSdpByKey(key));
};
/**
* Gets the rank of a given SDP for an actor by its key.
* @param {number} actorId The id of the actor to get the rank from.
* @param {string} key The key of the SDP to get the rank for.
* @return {number} The rank of the SDP for the given actor.
*/
Game_Party.prototype.getSdpRankByActorAndKey = function(actorId, key) {
	const actor = $gameActors.actor(actorId);
	if (!actor) {
		console.error(`The actor id of ${actorId} was invalid.`);
		return 0;
	}
	const panelRanking = actor.getSdpByKey(key);
	if (panelRanking) {
		return panelRanking.currentRank;
	} else {
		return 0;
	}
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Player.js
/**
* Extends {@link #useOnPickup}.<br/>
* If the loot being picked up is actually an SDP, then support the possibility of there not being a backing item from
* the database to execute effects on.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} lootData An object representing the loot.
*/
J.SDP.Aliased.Game_Player.set("useOnPickup", Game_Player.prototype.useOnPickup);
Game_Player.prototype.useOnPickup = function(lootData) {
	if (lootData.sdpKey) {
		$gameParty.unlockSdp(lootData.sdpKey);
		$jabsEngine.onSdpPanelUnlocked(lootData.sdpKey, this);
		$jabsEngine.createSdpUnlockLog(lootData.sdpKey);
		this.requestAnimation(lootData.animationId ?? 119);
		return;
	}
	J.SDP.Aliased.Game_Player.get("useOnPickup").call(this, lootData);
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Troop.js
/**
* Gets the amount of SDP points earned from all defeated enemies.
* @returns {number}
*/
Game_Troop.prototype.sdpTotal = function() {
	let sdpPoints = 0;
	this.deadMembers().forEach((enemy) => sdpPoints += enemy.sdpPoints());
	return sdpPoints;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_System.js
/**
* Extends {@link #initialize}.<br/>
* Also initializes the debug features for the SDP system.
*/
J.SDP.Aliased.Game_System.set("initialize", Game_System.prototype.initialize);
Game_System.prototype.initialize = function() {
	J.SDP.Aliased.Game_System.get("initialize").call(this);
	this.initSdpMembers();
};
/**
* Initializes the SDP system and binds earned panels to the `$gameSystem` object.
*/
Game_System.prototype.initSdpMembers = function() {
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
Game_System.prototype.enableForcedSdpDrops = function() {
	this._j._sdp._forceDropPanels = true;
};
/**
* Disables a DEBUG functionality for forcing the drop of panels where applicable.
*/
Game_System.prototype.disableForcedSdpDrops = function() {
	this._j._sdp._forceDropPanels = false;
};
/**
* Determines whether or not the DEBUG functionality of forced-panel-dropping is active.
* @returns {boolean|*|boolean}
*/
Game_System.prototype.shouldForceDropSdp = function() {
	return this._j._sdp._forceDropPanels;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Action.js
/**
* Extends {@link #applyGlobal}.<br/>
* Also handles any SDP effects such as unlocking.
*/
J.SDP.Aliased.Game_Action.set("applyGlobal", Game_Action.prototype.applyGlobal);
Game_Action.prototype.applyGlobal = function() {
	J.SDP.Aliased.Game_Action.get("applyGlobal").call(this);
	this.applySdpUnlock();
};
/**
* Handles any SDP-related effects for this action.
* @param {Game_Actor|Game_Enemy} target The target to apply the SDP-related effect to.
*/
Game_Action.prototype.applySdpUnlock = function(target) {
	if (this.canUnlockSdp()) {
		this.applySdpUnlockEffect();
	}
};
/**
* Determines whether or not the SDP on this action can be unlocked.
* @returns {boolean} True if the SDP can be unlocked, false otherwise.
*/
Game_Action.prototype.canUnlockSdp = function() {
	const item = this.item();
	if (!item) return false;
	if (item.isSkill()) return false;
	if (!item.sdpKey) return false;
	return true;
};
/**
* Performs any unlock effects associated with the attached item's SDP tag.
*/
Game_Action.prototype.applySdpUnlockEffect = function() {
	const item = this.item();
	$gameParty.unlockSdp(item.sdpKey);
};
/**
* Extends {@link #apply}.<br/>
* Also applies SDP point modifications as a result of the action execution.
*/
J.SDP.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
	J.SDP.Aliased.Game_Action.get("apply").call(this, target);
	this.applySdpPointMod(target);
};
/**
* Handles SDP point modification from action execution.
* @param {Game_Actor|Game_Enemy} target The target to apply the SDP point modification to.
*/
Game_Action.prototype.applySdpPointMod = function(target) {
	if (this.isSdpPointMod(target)) {
		this.modSdpPointsOnApply(target);
	}
};
/**
* Determines whether or not this action grants SDP points.
* @param {Game_Actor|Game_Enemy} target The target to apply the SDP point modification to.
* @returns {boolean}
*/
Game_Action.prototype.isSdpPointMod = function(target) {
	const item = this.item();
	if (!item) return false;
	if (item.isSkill()) return false;
	if (target.isEnemy()) return false;
	if (RPGManager.getNumberFromNoteByRegex(item, J.SDP.RegExp.SdpPoints) === 0) return false;
	return true;
};
/**
* Gains (or loses) the points from the pickup against the target actor.
* @param {Game_Actor|Game_Enemy} target The target to apply the SDP point modification to.
*/
Game_Action.prototype.modSdpPointsOnApply = function(target) {
	const item = this.item();
	const points = RPGManager.getNumberFromNoteByRegex(item, J.SDP.RegExp.SdpPoints);
	target.modSdpPoints(points);
};

//#endregion
//#region src/plugins/sdp/core/managers/BattleManager.js
/**
* Extends {@link #makeRewards}.<br/>
* Also includes the SDP points earned.
*/
J.SDP.Aliased.BattleManager.set("makeRewards", BattleManager.makeRewards);
BattleManager.makeRewards = function() {
	J.SDP.Aliased.BattleManager.get("makeRewards").call(this);
	this.setRewards({
		...this.rewards(),
		sdp: $gameTroop.sdpTotal()
	});
};
/**
* Extends {@link #gainRewards}.<br/>
* Also gain the SDP points earned.
*/
J.SDP.Aliased.BattleManager.set("gainRewards", BattleManager.gainRewards);
BattleManager.gainRewards = function() {
	J.SDP.Aliased.BattleManager.get("gainRewards").call(this);
	this.gainSdpPoints();
};
/**
* Performs a gain of the SDP points for all members of the party after battle.
*/
BattleManager.gainSdpPoints = function() {
	const { sdp } = this.rewards();
	$gameParty.members().forEach((member) => member.modSdpPoints(sdp));
};
/**
* Extends {@link #displayRewards}.<br/>
* Also displays the SDP victory text.
*/
J.SDP.Aliased.BattleManager.set("displayRewards", BattleManager.displayRewards);
BattleManager.displayRewards = function() {
	this.displaySdp();
	J.SDP.Aliased.BattleManager.get("displayRewards").call(this);
};
/**
* Displays the SDP victory text in the victory log.
*/
BattleManager.displaySdp = function() {
	const { sdp } = this.rewards();
	if (sdp <= 0) return;
	const text = `\\. ${sdp} ${J.SDP.Metadata.victoryText}`;
	$gameMessage.add(text);
};

//#endregion
//#region src/plugins/sdp/core/managers/JABS_Engine.js
if (J.ABS) {
	/**
	* Extends the basic rewards from defeating an enemy to also include SDP points.
	* @param {Game_Battler} enemy The target battler that was defeated.
	* @param {JABS_Battler} actor The map battler that defeated the target.
	*/
	J.SDP.Aliased.JABS_Engine.set("gainBasicRewards", JABS_Engine.prototype.gainBasicRewards);
	JABS_Engine.prototype.gainBasicRewards = function(enemy, actor) {
		J.SDP.Aliased.JABS_Engine.get("gainBasicRewards").call(this, enemy, actor);
		const sdpPoints = this.determineSdpGained(enemy, actor);
		if (!sdpPoints) return;
		this.gainSdpReward(sdpPoints, actor);
		this.createSdpLog(sdpPoints, actor);
	};
	/**
	* Determines how many SDP points the defeated enemy yielded.
	* @param {Game_Enemy} defeatedEnemy The enemy that was defeated.
	* @param {JABS_Battler} actor The map battler that defeated the target.
	* @returns {number} The SDP points gained.
	*/
	JABS_Engine.prototype.determineSdpGained = function(defeatedEnemy, actor) {
		if (this.canGainReward(defeatedEnemy, actor.getBattler()) === false) return 0;
		const sdpPoints = defeatedEnemy.sdpPoints();
		if (!sdpPoints) return 0;
		const levelMultiplier = this.getRewardScalingMultiplier(defeatedEnemy, actor);
		return Math.ceil(sdpPoints * levelMultiplier);
	};
	/**
	* Gains SDP points from battle rewards.
	* @param {number} sdpPoints The SDP points to gain.
	* @param {JABS_Battler} actor The map battler that defeated the target.
	*/
	JABS_Engine.prototype.gainSdpReward = function(sdpPoints, actor) {
		if (!sdpPoints) return;
		const battler = actor.getBattler();
		let multipliedSdpPoints = 0;
		$gameParty.members().forEach((member) => {
			const gained = member.modSdpPoints(sdpPoints);
			if (member === battler) multipliedSdpPoints = gained;
		});
		this.onSdpRewardGranted(multipliedSdpPoints, actor.getCharacter());
	};
	/**
	* Lifecycle event: SDP points were awarded to the party leader's character.
	* Extended by optional plugins (e.g. J-Popups-SDP) to surface map feedback.
	* @param {number} sdpPoints The scaled SDP points granted.
	* @param {Game_Character} character The character who received the reward.
	*/
	JABS_Engine.prototype.onSdpRewardGranted = function(sdpPoints, character) {};
	/**
	* Lifecycle event: an SDP panel was unlocked for a character on the map.
	* Extended by optional plugins (e.g. J-Popups-SDP) to surface map feedback.
	* @param {string} sdpKey The key of the SDP panel that was unlocked.
	* @param {Game_Character} character The character who unlocked the panel.
	*/
	JABS_Engine.prototype.onSdpPanelUnlocked = function(sdpKey, character) {};
	/**
	* Creates the log entry if using the J-LOG.
	* @param {number} sdpPoints The SDP ponts gained.
	* @param {JABS_Battler} battler The battler gaining the SDP points.
	*/
	JABS_Engine.prototype.createSdpLog = function(sdpPoints, battler) {
		if (!J.LOG) return;
		const sdpLog = new ActionLogBuilder().setupSdpAcquired(battler.battlerName(), sdpPoints).build();
		$actionLogManager.addLog(sdpLog);
	};
	/**
	* Creates the log entry if using the J-LOG.
	* @param {string} sdpKey The SDP panel key that was unlocked.
	*/
	JABS_Engine.prototype.createSdpUnlockLog = function(sdpKey) {
		if (!J.LOG) return;
		const sdpLog = new ActionLogBuilder().setupSdpUnlocked(sdpKey).build();
		$actionLogManager.addLog(sdpLog);
	};
}

//#endregion
//#region src/plugins/sdp/core/managers/IconManager.js
/**
* Gets the icon index for the SDP multiplier.
* @return {number}
*/
IconManager.sdpMultiplier = function() {
	return 2229;
};

//#endregion
//#region src/plugins/sdp/core/managers/TextManager.js
/**
* Gets the proper name for the points used by the SDP system.
* @returns {string}
*/
TextManager.sdpPoints = function() {
	return J.SDP.Metadata.sdpPointsDisplayName;
};
/**
* Gets the proper name of "SDP Multiplier".
* @returns {string}
*/
TextManager.sdpMultiplier = function() {
	return "Node Points UP";
};
/**
* Gets the description text for the SDP multiplier.
* @returns {string[]}
*/
TextManager.sdpMultiplierDescription = function() {
	return ["The percentage bonuses being applied against SDP point gain.", "Higher amounts of this yields greater SDP point generation."];
};

//#endregion
//#region src/plugins/sdp/core/core/registerSdpParameters.js
/**
* Boot-time registration for J-SDP parameters in {@link ParameterRegistry}.
*/
var SdpParameterRegistration = class {
	/**
	* Registers the SDP reward multiplier with the parameter catalog.
	*/
	static registerAll() {
		ParameterRegistry.register(ParameterDefinition.Builder().key("sdr").group(ParameterGroups.FATE).sortOrder(5).label(() => TextManager.sdpMultiplier()).description(() => TextManager.sdpMultiplierDescription()).iconIndex(() => IconManager.sdpMultiplier()).format(ParameterFormat.PERCENT_CENTERED).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.sdpMultiplier).sdpBinding(SdpParameterBinding.byKey("sdr", () => 1)).build());
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_MenuCommand.js
/**
* Extends the make command list for the main menu to include SDP, if it meets the conditions.
*/
J.SDP.Aliased.Window_MenuCommand.set("makeCommandList", Window_MenuCommand.prototype.makeCommandList);
Window_MenuCommand.prototype.makeCommandList = function() {
	J.SDP.Aliased.Window_MenuCommand.get("makeCommandList").call(this);
	if (!this.canAddSdpCommand()) return;
	const command = new WindowCommandBuilder(J.SDP.Metadata.commandName).setSymbol("sdp-menu").setHelpText("Spend earned points to grow this character's parameters.").setMenuSection(MenuSection.Actor).setEnabled($gameParty.hasAnyUnlockedSdps()).setIconIndex(J.SDP.Metadata.commandIconIndex).setColorIndex(1).build();
	const lastCommand = this.commandList().at(-1);
	if (lastCommand.symbol === "gameEnd") {
		this.commandList().splice(this.commandList().length - 2, 0, command);
	} else {
		this.addBuiltCommand(command);
	}
};
/**
* Determines whether or not the sdp command can be added to the main menu.
*
* Formerly also refused to render whenever JABS was installed, unless a parameter opted back in. That
* made sense while the JABS quick menu carried its own copy of this command and the two would have
* duplicated each other- but the quick menu no longer offers anything except a way into this one, so
* the check had quietly become the reason the scene was reachable from nowhere at all.
* @returns {boolean} True if the command should be added, false otherwise.
*/
Window_MenuCommand.prototype.canAddSdpCommand = function() {
	return $gameSwitches.value(J.SDP.Metadata.menuSwitchId);
};

//#endregion
//#region src/plugins/sdp/core/managers/SdpFamilyFilter.js
/**
* Family-filter symbols and helpers for the SDP panel list.
* Cycle order is built per actor: All → Unsorted (when non-empty) → families with unlocked panels.
*/
var SdpFamilyFilter = class SdpFamilyFilter {
	/**
	* Shows every unlocked panel regardless of subgroup/family enrollment.
	* @type {string}
	*/
	static ALL = "__all__";
	/**
	* Panels with no subgroup enrollment, or whose subgroup is not assigned to a family.
	* @type {string}
	*/
	static UNKNOWN = "__unknown__";
	/**
	* Resolves which family-filter bucket a panel belongs in.
	* @param {StatDistributionPanel} panel The panel driving this step.
	* @returns {string} {@link SdpFamilyFilter.ALL} is never returned here — only UNKNOWN or a family key.
	*/
	static resolvePanelFamilyFilterKey(panel) {
		if (panel.mastery.enrolledInSubgroup() === false) {
			return SdpFamilyFilter.UNKNOWN;
		}
		const familyKey = J.SDP.Metadata.familyKeyBySubgroupKey.get(panel.mastery.subgroupKey);
		if (!familyKey) {
			return SdpFamilyFilter.UNKNOWN;
		}
		return familyKey;
	}
	/**
	* Whether a panel should appear under the active family filter.
	* @param {StatDistributionPanel} panel The panel driving this step.
	* @param {string} filterKey The filter key driving this step.
	* @returns {boolean}
	*/
	static panelMatchesFilter(panel, filterKey) {
		if (filterKey === SdpFamilyFilter.ALL) {
			return true;
		}
		return SdpFamilyFilter.resolvePanelFamilyFilterKey(panel) === filterKey;
	}
	/**
	* Builds the L2/R2 cycle for the current actor.
	* Unsorted and family tabs with no unlocked panels for this actor are omitted.
	* @param {Game_Actor} actor The actor driving this step.
	* @returns {string[]}
	*/
	static buildCycleForActor(actor) {
		const cycle = [SdpFamilyFilter.ALL];
		const familiesWithUnlockedPanels = new Set();
		let hasUnknownPanels = false;
		actor.getAllUnlockedSdps().forEach((panelRanking) => {
			const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
			if (!panel) {
				return;
			}
			const filterKey = SdpFamilyFilter.resolvePanelFamilyFilterKey(panel);
			if (filterKey === SdpFamilyFilter.UNKNOWN) {
				hasUnknownPanels = true;
				return;
			}
			familiesWithUnlockedPanels.add(filterKey);
		});
		if (hasUnknownPanels) {
			cycle.push(SdpFamilyFilter.UNKNOWN);
		}
		J.SDP.Metadata.families.forEach((family) => {
			if (familiesWithUnlockedPanels.has(family.key)) {
				cycle.push(family.key);
			}
		});
		return cycle;
	}
	/**
	* Ordinal position of a family within the authored family list.
	* Unresolved/unknown families sort after every known family.
	* @param {string} familyKey The family key driving this step.
	* @returns {number}
	*/
	static familyOrderIndex(familyKey) {
		const index = J.SDP.Metadata.families.findIndex((family) => family.key === familyKey);
		return index === -1 ? Number.MAX_SAFE_INTEGER : index;
	}
	/**
	* Ordinal position of a subgroup within its owning family's authored subgroup list.
	* Unresolved/unknown subgroups sort after every known subgroup.
	* @param {string} familyKey The family key driving this step.
	* @param {string} subgroupKey The subgroup key driving this step.
	* @returns {number}
	*/
	static subgroupOrderIndex(familyKey, subgroupKey) {
		const family = J.SDP.Metadata.familiesMap.get(familyKey);
		if (!family) {
			return Number.MAX_SAFE_INTEGER;
		}
		const index = family.subgroupKeys.indexOf(subgroupKey);
		return index === -1 ? Number.MAX_SAFE_INTEGER : index;
	}
	/**
	* Orders two panels by family, then subgroup, then subgroup tier.
	* Falls back to alphabetical-by-key when the hierarchy can't fully disambiguate
	* (e.g. panels sitting entirely outside the family/subgroup hierarchy).
	* @param {StatDistributionPanel} panelA The first panel driving this step.
	* @param {StatDistributionPanel} panelB The second panel driving this step.
	* @returns {number}
	*/
	static comparePanels(panelA, panelB) {
		const familyKeyA = SdpFamilyFilter.resolvePanelFamilyFilterKey(panelA);
		const familyKeyB = SdpFamilyFilter.resolvePanelFamilyFilterKey(panelB);
		const familyIndexA = SdpFamilyFilter.familyOrderIndex(familyKeyA);
		const familyIndexB = SdpFamilyFilter.familyOrderIndex(familyKeyB);
		if (familyIndexA !== familyIndexB) {
			return familyIndexA - familyIndexB;
		}
		const subgroupIndexA = SdpFamilyFilter.subgroupOrderIndex(familyKeyA, panelA.mastery.subgroupKey);
		const subgroupIndexB = SdpFamilyFilter.subgroupOrderIndex(familyKeyB, panelB.mastery.subgroupKey);
		if (subgroupIndexA !== subgroupIndexB) {
			return subgroupIndexA - subgroupIndexB;
		}
		if (panelA.mastery.subgroupTier !== panelB.mastery.subgroupTier) {
			return panelA.mastery.subgroupTier - panelB.mastery.subgroupTier;
		}
		return panelA.key.localeCompare(panelB.key);
	}
	/**
	* Display label for a family-filter key in the menu strip.
	* @param {string} filterKey The filter key driving this step.
	* @returns {string}
	*/
	static displayNameForFilterKey(filterKey) {
		if (filterKey === SdpFamilyFilter.ALL) {
			return "All families";
		}
		if (filterKey === SdpFamilyFilter.UNKNOWN) {
			return "Unsorted";
		}
		const family = J.SDP.Metadata.familiesMap.get(filterKey);
		return family ? family.name : filterKey;
	}
	/**
	* Icon index for a family-filter key in the menu strip.
	* @param {string} filterKey The filter key driving this step.
	* @returns {number}
	*/
	static iconIndexForFilterKey(filterKey) {
		if (filterKey === SdpFamilyFilter.ALL) {
			return J.SDP.Metadata.sdpIconIndex;
		}
		if (filterKey === SdpFamilyFilter.UNKNOWN) {
			return 8;
		}
		const family = J.SDP.Metadata.familiesMap.get(filterKey);
		if (family && family.iconIndex >= 0) {
			return family.iconIndex;
		}
		return J.SDP.Metadata.sdpIconIndex;
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpList.js
/**
* The SDP window containing the list of all unlocked panels.
*/
var Window_SdpList = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes the members of this window.
	*
	* These cannot be class field declarations: JavaScript applies those only after `super()` returns,
	* by which point the command list has already been built from them and found them undefined.
	*/
	initMembers() {
		/**
		* The currently selected actor for listing unlocked panels and drawing ranks/costs.
		* @type {Game_Actor}
		*/
		this.currentActor = null;
		/**
		* Whether panels already at max rank are hidden from the list.
		* @type {boolean}
		*/
		this.filterNoMaxedPanels = false;
		/**
		* Active family-filter key for the panel list.
		* @type {string}
		*/
		this.familyFilterKey = SdpFamilyFilter.ALL;
		/**
		* The queued cart levels by panel key.
		* @type {Map<string, number>}
		*/
		this.cart = new Map();
	}
	/**
	* Sets the actor for this window to the provided actor. Implicit refresh.
	* @param {Game_Actor} actor The actor to assign to this window.
	*/
	setActor(actor) {
		this.currentActor = actor;
		this.refresh();
	}
	/**
	* Sets the cart map to show queued levels in the list.
	* @param {Map<string, number>} cart The cart mapping.
	*/
	setCart(cart) {
		this.cart = cart;
		this.refresh();
	}
	/**
	* Gets whether or not the no-max-panels filter is enabled.
	* @returns {boolean}
	*/
	usingNoMaxPanelsFilter() {
		return this.filterNoMaxedPanels;
	}
	/**
	* Toggles the "hide max panels" filter for this window.
	*/
	toggleNoMaxPanelsFilter() {
		this.filterNoMaxedPanels = !this.filterNoMaxedPanels;
	}
	/**
	* Sets the active family filter and refreshes the list.
	* @param {string} familyFilterKey The family filter key driving this step.
	*/
	setFamilyFilterKey(familyFilterKey) {
		if (this.familyFilterKey === familyFilterKey) return;
		this.familyFilterKey = familyFilterKey;
		this.refresh();
	}
	/**
	* Gets the active family filter key.
	* @returns {string}
	*/
	getFamilyFilterKey() {
		return this.familyFilterKey;
	}
	/**
	* Overwrites {@link #itemTextAlign}.<br/>
	* Sets the alignment for this command window to be left-aligned.
	*/
	itemTextAlign() {
		return "left";
	}
	/**
	* Overwrites {@link #makeCommandList}.<br/>
	* Creates the command list for this window.
	*/
	makeCommandList() {
		const actor = this.currentActor;
		if (!actor) return;
		const panelRankings = actor.getAllUnlockedSdps();
		if (panelRankings.length === 0) return;
		const commands = panelRankings.map((panelRanking) => {
			const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
			const command = this.makeCommand(panel);
			if (!command) return null;
			return command;
		}, this).filter((command) => command !== null);
		commands.sort((left, right) => SdpFamilyFilter.comparePanels(left.ext, right.ext));
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds a single command for the SDP list based on a given panel.
	* @param {StatDistributionPanel} panel The panel to build a command for.
	* @returns {BuiltWindowCommand}
	*/
	makeCommand(panel) {
		const actor = this.currentActor;
		const { name, key, iconIndex, maxRank } = panel;
		const colorIndex = panel.getPanelRarityColorIndex();
		const panelRanking = actor.getSdpByKey(key);
		const { currentRank } = panelRanking;
		const isMaxRank = maxRank <= currentRank;
		if (isMaxRank && this.usingNoMaxPanelsFilter()) {
			return null;
		}
		if (SdpFamilyFilter.panelMatchesFilter(panel, this.familyFilterKey) === false) {
			return null;
		}
		const enabled = !isMaxRank;
		const command = new WindowCommandBuilder(name).setSymbol(key).setEnabled(enabled).setExtensionData(panel).setIconIndex(iconIndex).setColorIndex(colorIndex).build();
		return command;
	}
	/**
	* Overwrites {@link #drawItem}.<br/>
	* Renders SDP list rows with styled padded ranks.
	* @param {number} index The command index.
	*/
	drawItem(index) {
		this.preDrawItem(index);
		const { x: rectX, y: rectY, width: rectWidth } = this.itemLineRect(index);
		const commandIcon = this.commandIcon(index);
		if (commandIcon) {
			this.drawIcon(commandIcon, rectX + 4, rectY);
		}
		const commandNameX = rectX + 40;
		this.drawTextEx(this.buildCommandName(index), commandNameX, rectY, rectWidth);
		this.drawRankDetails(index, rectX, rectY, rectWidth);
	}
	/**
	* Draws the rank block flush right (`CC / MM`). With cart, the left number becomes a preview
	* (`min(max, current + queued)`) in palette **24** (power-up) — no extra ` +NN` column.
	* @param {number} index The command index.
	* @param {number} x The row x.
	* @param {number} y The row y.
	* @param {number} width The row width.
	*/
	drawRankDetails(index, x, y, width) {
		const command = this.commandEntryAt(index);
		const panel = command ? command.ext : null;
		if (!panel) {
			return;
		}
		const actor = this.currentActor;
		const { key, maxRank } = panel;
		const { currentRank } = actor.getSdpByKey(key);
		const isMaxRank = maxRank <= currentRank;
		const cartLevels = this.cart.get(key) ?? 0;
		const pad = 12;
		const rightEdge = x + width - pad;
		if (isMaxRank) {
			const done = "DONE";
			const doneW = this.textWidth(done);
			this.drawText(done, rightEdge - doneW, y, doneW, Window_Base.TextAlignments.Left);
			return;
		}
		const rankW = this.textWidth("00");
		const slashText = " / ";
		const slashW = this.textWidth(slashText);
		const maxX = rightEdge - rankW;
		const slashX = maxX - slashW;
		const curX = slashX - rankW;
		const hasCart = cartLevels > 0;
		const previewCurrent = Math.min(maxRank, currentRank + cartLevels);
		const currentColor = hasCart ? 24 : 0;
		this.drawStyledZeroPaddedNumber(curX, y, hasCart ? previewCurrent : currentRank, rankW, 2, 8, currentColor);
		this.drawText(slashText, slashX, y, slashW, Window_Base.TextAlignments.Left);
		this.drawStyledZeroPaddedNumber(maxX, y, maxRank, rankW, 2, 8, 0);
	}
	/**
	* Extends {@link #cursorLeft}.<br/>
	* Enables tab-switching via left input (controller-first).
	*/
	cursorLeft(wrap) {
		if (this.isHandled("cart-dec")) {
			this.callHandler("cart-dec");
			return;
		}
		Window_Selectable.prototype.cursorLeft.call(this, wrap);
	}
	/**
	* Extends {@link #cursorRight}.<br/>
	* Enables tab-switching via right input (controller-first).
	*/
	cursorRight(wrap) {
		if (this.isHandled("cart-inc")) {
			this.callHandler("cart-inc");
			return;
		}
		Window_Selectable.prototype.cursorRight.call(this, wrap);
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpHeader.js
/**
* A single-line, help-like header that summarizes the hovered panel.
* Name + rarity + flavor in one readable sentence, controller-first.
*/
var Window_SdpHeader = class extends Window_Base {
	/**
	* @type {StatDistributionPanel|null}
	*/
	#panel = null;
	/**
	* Binds the hovered panel to this header.
	* @param {StatDistributionPanel|null} panel The hovered panel.
	*/
	setPanel(panel) {
		this.#panel = panel;
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Renders the single-line summary for the hovered panel.
	*/
	drawContent() {
		const panel = this.#panel;
		if (!panel) {
			return;
		}
		const { name } = panel;
		const { topFlavorText: flavor } = panel;
		this.resetFontSettings();
		const rarityCx = panel.getPanelRarityColorIndex();
		const boldName = `\\*${name}\\*`;
		const tintedName = this.colorizeText(rarityCx, boldName);
		const sizedName = this.modFontSizeForText(2, tintedName);
		this.drawTextEx(sizedName, 0, 0, this.innerWidth);
		this.resetFontSettings();
		this.resetFontSettings();
		const sizedFlavor = this.modFontSizeForText(-1, flavor);
		this.drawTextEx(sizedFlavor, 0, this.lineHeight(), this.innerWidth);
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpParameterList.js
var Window_SdpParameterList = class extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes the members of this window.
	*
	* These cannot be class field declarations: JavaScript applies those only after `super()` returns,
	* by which point the command list has already been built from them and found them undefined.
	*/
	initMembers() {
		/**
		* The current parameters on the panel being hovered over.
		* @type {PanelParameter[]}
		*/
		this.panelParameters = [];
		/**
		* The current actor to compare parameters against the panel parameters for.
		* @type {Game_Actor}
		*/
		this.currentActor = null;
	}
	/**
	* Sets the current actor to compare parameters for.
	* @param {Game_Actor} actor The actor to set.
	*/
	setActor(actor) {
		this.currentActor = actor;
	}
	/**
	* Sets the parameters that are defined in this list.
	* @param {PanelParameter[]} parameters The collection of parameters for this panel.
	*/
	setParameters(parameters) {
		this.panelParameters = parameters;
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Creates the command list of parameters affected by this SDP.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* Adds all omnipedia commands to the list that are available.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		if (this.panelParameters.length === 0) return [];
		const commands = this.panelParameters.map(this.#buildPanelParameterCommand, this);
		return commands;
	}
	#buildPanelParameterCommand(panelParameter) {
		const { parameterKey, isCore } = panelParameter;
		const definition = ParameterRegistry.get(parameterKey);
		const colorIndex = isCore ? 14 : 0;
		const paramName = definition ? definition.label() : parameterKey;
		const paramIcon = definition ? definition.iconIndex() : 0;
		const paramValue = this.currentActor.parameter(parameterKey);
		const paramDescription = definition ? definition.description() : [String.empty];
		const prettyValue = definition ? definition.prettyValue(paramValue, false, this.currentActor) : Math.trunc(paramValue).toString();
		const { modifierColorIndex, modifierText } = this.#determineModifierData(panelParameter);
		const commandName = `${paramName} ( ${prettyValue} )`;
		const command = new WindowCommandBuilder(commandName).setSymbol(parameterKey).addTextLines(paramDescription).setIconIndex(paramIcon).setColorIndex(colorIndex).setRightText(modifierText).setRightColorIndex(modifierColorIndex).setExtensionData(panelParameter).build();
		return command;
	}
	#determineModifierData(panelParameter) {
		const calculateAfterRankUpValue = (paramValue, modifier, isFlat) => {
			return isFlat ? Number((paramValue + modifier).toFixed(2)) : paramValue + paramValue * (modifier / 100);
		};
		const determineModifierColorIndex = (parameterKey, isCore, paramValue, afterRankupValue) => {
			const upColor = 24;
			const upCoreColor = 28;
			const downColor = 20;
			const downCoreColor = 18;
			const smallerIsBetter = this.isNegativeGood(parameterKey);
			let colorIndex = 0;
			if (paramValue > afterRankupValue && !smallerIsBetter) {
				colorIndex = isCore ? downCoreColor : downColor;
			} else if (paramValue < afterRankupValue && !smallerIsBetter) {
				colorIndex = isCore ? upCoreColor : upColor;
			} else if (paramValue > afterRankupValue && smallerIsBetter) {
				colorIndex = isCore ? upCoreColor : upColor;
			} else if (paramValue < afterRankupValue && smallerIsBetter) {
				colorIndex = isCore ? downCoreColor : downColor;
			}
			return colorIndex;
		};
		const buildModifierText = (modifier, isFlat) => {
			const isPercent = isFlat ? `` : `%`;
			const isPositive = modifier >= 0 ? "+" : String.empty;
			return `(${isPositive}${modifier}${isPercent})`;
		};
		const { parameterKey, perRank: modifier, isFlat, isCore } = panelParameter;
		const paramValue = this.currentActor.parameter(parameterKey);
		const afterRankupValue = calculateAfterRankUpValue(paramValue, modifier, isFlat);
		const modifierColorIndex = determineModifierColorIndex(parameterKey, isCore, paramValue, afterRankupValue);
		const modifierText = buildModifierText(modifier, isFlat);
		return {
			modifierColorIndex,
			modifierText
		};
	}
	/**
	* Determines whether or not the parameter should be marked as "improved" if it is negative.
	* @param {string} parameterKey The registry key to check if smaller is better for.
	* @returns {boolean} True if the smaller is better for this key, false otherwise.
	*/
	isNegativeGood(parameterKey) {
		return ParameterKeys.SDP_SMALLER_IS_BETTER.includes(parameterKey);
	}
	/**
	* Overwrites {@link #itemHeight}.<br/>
	* Makes the command rows bigger so there can be additional lines.
	* @returns {number}
	*/
	itemHeight() {
		return this.lineHeight() * 2;
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpRewardList.js
var Window_SdpRewardList = class extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes the members of this window.
	*
	* This cannot be a class field declaration: JavaScript applies those only after `super()` returns,
	* by which point the command list has already been built from it and found it undefined.
	*/
	initMembers() {
		/**
		* The list of rewards for the currently-selected panel.
		* @type {PanelRankupReward[]}
		*/
		this.panelRewards = [];
	}
	setRewards(rewards) {
		this.panelRewards = rewards;
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Creates the command list of rewards granted by this SDP.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* Adds all SDP rewards as commands to the list.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const commands = [];
		if (!this.panelRewards) return commands;
		if (this.panelRewards.length === 0) {
			const command = new WindowCommandBuilder("No rewards.").setSymbol("no-rewards").setEnabled(false).setColorIndex(8).build();
			commands.push(command);
			return commands;
		}
		this.panelRewards.forEach((panelReward) => {
			const { rewardName, rankRequired } = panelReward;
			let iconIndex;
			switch (rankRequired) {
				case -1:
					iconIndex = 75;
					break;
				case 0:
					iconIndex = 73;
					break;
				default:
					iconIndex = 86;
					break;
			}
			const command = new WindowCommandBuilder(rewardName).setSymbol(rewardName).setIconIndex(iconIndex).setExtensionData({
				panelReward,
				rankRequired
			}).build();
			commands.push(command);
		});
		return commands;
	}
	/**
	* Overwrites {@link #drawItem}.<br/>
	* Renders reward rows with styled padded ranks.
	* @param {number} index The command index.
	*/
	drawItem(index) {
		this.preDrawItem(index);
		const { x: rectX, y: rectY, width: rectWidth } = this.itemLineRect(index);
		const commandIcon = this.commandIcon(index);
		if (commandIcon) {
			this.drawIcon(commandIcon, rectX + 4, rectY);
		}
		const commandNameX = rectX + 40;
		this.drawTextEx(this.buildCommandName(index), commandNameX, rectY, rectWidth);
		this.drawRewardRankRequirement(index, rectX, rectY, rectWidth);
	}
	/**
	* Draws the reward rank requirement on the right side.
	* @param {number} index The command index.
	* @param {number} x The row x.
	* @param {number} y The row y.
	* @param {number} width The row width.
	*/
	drawRewardRankRequirement(index, x, y, width) {
		const command = this.commandEntryAt(index);
		const ext = command ? command.ext : null;
		if (!ext) {
			return;
		}
		const { rankRequired } = ext;
		const pad = 12;
		const rightEdge = x + width - pad;
		const label = "Rank: ";
		const labelW = this.textWidth(label);
		let valueText = String.empty;
		if (rankRequired === -1) valueText = "EACH";
		else if (rankRequired === 0) valueText = "MAX";
		if (valueText) {
			const valueW = this.textWidth(valueText);
			const valueX = rightEdge - valueW;
			const labelX = valueX - labelW;
			this.drawText(label, labelX, y, labelW, Window_Base.TextAlignments.Left);
			this.drawText(valueText, valueX, y, valueW, Window_Base.TextAlignments.Left);
			return;
		}
		const valueW = this.textWidth("00");
		const valueX = rightEdge - valueW;
		const labelX = valueX - labelW;
		this.drawText(label, labelX, y, labelW, Window_Base.TextAlignments.Left);
		this.drawStyledZeroPaddedNumber(valueX, y, rankRequired, valueW, 2, 8, 0);
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpMastery.js
/**
* Read-only mastery summary for the hovered panel.
* Mastery is separate from {@link Window_SdpRewardList} — it reflects subgroup tier
* replacement skills granted at max rank, not panelRewards eval rows.
*/
var Window_SdpMastery = class extends Window_Base {
	/**
	* @type {StatDistributionPanel|null}
	*/
	#panel = null;
	/**
	* Binds the hovered panel to this mastery strip.
	* @param {StatDistributionPanel|null} panel The hovered panel.
	*/
	setPanel(panel) {
		this.#panel = panel;
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br>
	* Renders subgroup mastery enrollment for the hovered panel.
	*/
	drawContent() {
		const panel = this.#panel;
		if (!panel) {
			return;
		}
		const { mastery } = panel;
		if (mastery.participates() === false) {
			this.changeTextColor(ColorManager.textColor(8));
			this.drawText("No mastery.", 0, 0, this.innerWidth, Window_Base.TextAlignments.Left);
			this.resetTextColor();
			return;
		}
		const subgroup = J.SDP.Metadata.subgroupsMap.get(mastery.subgroupKey);
		const subgroupName = subgroup ? subgroup.name : mastery.subgroupKey;
		const subgroupIcon = subgroup && subgroup.iconIndex >= 0 ? subgroup.iconIndex : J.SDP.Metadata.sdpIconIndex;
		const iconPad = 4;
		const textX = subgroupIcon >= 0 ? ImageManager.iconWidth + iconPad : 0;
		if (subgroupIcon >= 0) {
			this.drawIcon(subgroupIcon, iconPad, 0);
		}
		this.resetFontSettings();
		const tintedSubgroup = this.colorizeText(14, subgroupName);
		this.drawTextEx(tintedSubgroup, textX, 0, this.innerWidth - textX);
		this.resetFontSettings();
		const skillLine = `\\Skill[${mastery.masterySkillId}] \\C[8]· Tier ${mastery.subgroupTier} · Rank MAX\\C[0]`;
		this.drawTextEx(skillLine, 0, this.lineHeight(), this.innerWidth);
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpCart.js
/**
* A controller-first "shopping cart" window for queued SDP rankups.
* This window is display-only; selection happens in {@link Window_SdpList}.
*/
var Window_SdpCart = class Window_SdpCart extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes the members of this window.
	*
	* These cannot be class field declarations: JavaScript applies those only after `super()` returns,
	* by which point the command list has already been built from them and found them undefined.
	*/
	initMembers() {
		/**
		* The actor whose wallet + rankings apply.
		* @type {Game_Actor|null}
		*/
		this.actor = null;
		/**
		* The queued cart levels by panel key.
		* @type {Map<string, number>}
		*/
		this.cart = new Map();
		/**
		* The cached wallet value for the pinned row.
		* @type {number}
		*/
		this.wallet = 0;
		/**
		* The cached total cost for the pinned row.
		* @type {number}
		*/
		this.totalCost = 0;
	}
	/**
	* Binds the cart context to this window.
	* @param {Game_Actor} actor The actor whose SDP points will be spent.
	* @param {Map<string, number>} cart The queued levels by panel key.
	*/
	setCart(actor, cart) {
		this.actor = actor;
		this.cart = cart;
	}
	/**
	* Overwrites {@link #isCurrentItemEnabled}.<br/>
	* No commands are selectable in this window.
	*/
	isCurrentItemEnabled() {
		return false;
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Draws the contents of the cart and the total cost.
	*/
	makeCommandList() {
		const { actor } = this;
		if (!actor) {
			return;
		}
		if (this.cart.size === 0) {
			const empty = new WindowCommandBuilder("Cart: empty").setSymbol("cart-empty").setEnabled(false).setColorIndex(8).build();
			this.addBuiltCommand(empty);
			return;
		}
		let totalCost = 0;
		this.cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			const { currentRank } = actor.getSdpByKey(key);
			const cost = Window_SdpCart.#calculateQueuedCost(panel, currentRank, levels);
			totalCost += cost;
		});
		const wallet = actor.getSdpPoints();
		this.wallet = wallet;
		this.totalCost = totalCost;
		const walletRow = new WindowCommandBuilder(J.SDP.Metadata.sdpPointsDisplayName).setSymbol("cart-wallet").setEnabled(false).setIconIndex(J.SDP.Metadata.sdpIconIndex).build();
		this.addBuiltCommand(walletRow);
		this.cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			const { currentRank } = actor.getSdpByKey(key);
			const cost = Window_SdpCart.#calculateQueuedCost(panel, currentRank, levels);
			const command = new WindowCommandBuilder(panel.name).setSymbol(`cart-${key}`).setEnabled(false).setIconIndex(panel.iconIndex).setExtensionData({
				levels,
				cost
			}).build();
			this.addBuiltCommand(command);
		});
	}
	/**
	* Overwrites {@link #drawItem}.<br/>
	* Renders the cart rows with styled padded numbers.
	* @param {number} index The command index.
	*/
	drawItem(index) {
		this.preDrawItem(index);
		const { x: rectX, y: rectY, width: rectWidth } = this.itemLineRect(index);
		const commandIcon = this.commandIcon(index);
		if (commandIcon) {
			this.drawIcon(commandIcon, rectX + 4, rectY);
		}
		const commandNameX = rectX + 40;
		this.drawTextEx(this.buildCommandName(index), commandNameX, rectY, rectWidth);
		const symbol = this.commandSymbol(index);
		if (symbol === "cart-wallet") {
			this.drawCartWalletRow(rectX, rectY, rectWidth);
		} else if (symbol.startsWith("cart-")) {
			this.drawCartLineItemRow(index, rectX, rectY, rectWidth);
		}
	}
	/**
	* Draws the pinned wallet row with styled numbers.
	* @param {number} x The row x.
	* @param {number} y The row y.
	* @param {number} width The row width.
	*/
	drawCartWalletRow(x, y, width) {
		const pad = 12;
		const gap = 12;
		const spendW = this.textWidth("(-00000000)");
		const amountW = this.textWidth("00000000");
		const spendX = x + width - spendW - pad;
		const amountX = spendX - gap - amountW;
		this.drawStyledZeroPaddedNumber(amountX, y, this.wallet, amountW, 8, 8, 0);
		const canAfford = this.totalCost <= this.wallet;
		let spendColor = 0;
		if (this.totalCost > 0) {
			spendColor = canAfford ? 24 : 18;
		}
		this.drawStyledZeroPaddedCost(spendX, y, this.totalCost, spendW, 8, 8, spendColor);
	}
	/**
	* Draws a cart line item row with `+NN | 00000000` formatting.
	* @param {number} index The command index.
	* @param {number} x The row x.
	* @param {number} y The row y.
	* @param {number} width The row width.
	*/
	drawCartLineItemRow(index, x, y, width) {
		const command = this.commandEntryAt(index);
		const ext = command ? command.ext : null;
		if (!ext) {
			return;
		}
		const { levels, cost } = ext;
		const pad = 12;
		const gap = 8;
		const costW = this.textWidth("00000000");
		const costX = x + width - costW - pad;
		this.drawStyledZeroPaddedNumber(costX, y, cost, costW, 8, 8, 0);
		const prefix = "+";
		const pipe = " |";
		const pipeW = this.textWidth(pipe);
		const plusW = this.textWidth(prefix);
		const levelsW = this.textWidth("00");
		const pipeX = costX - gap - pipeW;
		const levelsX = pipeX - levelsW;
		const plusX = levelsX - plusW;
		this.drawText(prefix, plusX, y, plusW, Window_Base.TextAlignments.Left);
		this.drawStyledZeroPaddedNumber(levelsX, y, levels, levelsW, 2, 8, 0);
		this.drawText(pipe, pipeX, y, pipeW, Window_Base.TextAlignments.Left);
	}
	/**
	* Calculates the total cost of a queued number of rankups for a panel.
	* @param {StatDistributionPanel} panel The panel being purchased.
	* @param {number} currentRank The current rank of the panel.
	* @param {number} levels The queued levels.
	* @returns {number}
	*/
	static #calculateQueuedCost(panel, currentRank, levels) {
		let cost = 0;
		for (let i = 0; i < levels; i++) {
			cost += panel.rankUpCost(currentRank + i);
		}
		return cost;
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpConfirmation.js
/**
* The window that prompts the user to confirm/cancel the upgrading of a chosen panel.
* Long panel names must not become {@link Window_Command} labels: {@link Window_Command#drawItem}
* feeds names through {@link Window_Base#drawTextEx}, which wraps and stacks multiple lines inside
* a single-row {@link Window_Selectable#itemRect}, producing overlapping unreadable text.
*/
var Window_SdpConfirmation = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
		this.opacity = 255;
		this.contentsBack.opacity = 255;
		this.contents.opacity = 255;
	}
	updateBackOpacity() {
		this.backOpacity = 255;
	}
	/**
	* Initializes all members of this window.
	*/
	initMembers() {
		/**
		* The current mode of this confirmation window.
		* - single: upgrade hovered panel once.
		* - cart: checkout the queued cart.
		* @type {string}
		*/
		this.mode = "single";
		/**
		* The summary of the current cart checkout, if applicable.
		* @type {{
		*   panelCount: number,
		*   levelCount: number,
		*   totalCost: number,
		*   wallet: number,
		*   remaining: number,
		*   canAfford: boolean,
		*   solePanelName: string|null
		* }|null}
		*/
		this.cartSummary = null;
		/**
		* The summary of the current single-panel upgrade, if applicable.
		* @type {{ panelName: string, cost: number, wallet: number, remaining: number, canAfford: boolean }|null}
		*/
		this.singleSummary = null;
	}
	/**
	* The amount of columns this command window uses.
	* @returns {number}
	*/
	maxCols() {
		return 2;
	}
	/**
	* The width of each command cell.
	* @returns {number}
	*/
	itemWidth() {
		const spacing = this.colSpacing();
		return Math.floor((this.innerWidth - spacing) / 2);
	}
	/**
	* Keep the choice row tight; the summary above does the heavy lifting.
	* @returns {number}
	*/
	numVisibleRows() {
		return 1;
	}
	/**
	* Keep the two choices separated but not wasteful.
	* @returns {number}
	*/
	colSpacing() {
		return 12;
	}
	/**
	* Sets the mode of this confirmation window.
	* @param {string} mode The mode key.
	*/
	setMode(mode) {
		this.mode = mode;
	}
	/**
	* Sets the cart summary for this confirmation window.
	* @param {{
	*   panelCount: number,
	*   levelCount: number,
	*   totalCost: number,
	*   wallet: number,
	*   remaining: number,
	*   canAfford: boolean,
	*   solePanelName: string|null
	* }} summary The cart summary.
	*/
	setCartSummary(summary) {
		this.cartSummary = summary;
	}
	/**
	* Sets the single-upgrade summary for this confirmation window.
	* @param {string} panelName The name of the panel being upgraded.
	* @param {number} cost The cost of the rank-up.
	* @param {number} wallet The actor wallet.
	*/
	setSingleSummary(panelName, cost, wallet) {
		const remaining = wallet - cost;
		const canAfford = remaining >= 0;
		this.singleSummary = {
			panelName,
			cost,
			wallet,
			remaining,
			canAfford
		};
	}
	/**
	* Vertical space reserved for the summary block above command rows.
	* Must stay in sync with {@link #drawConfirmationSummary}.
	* @returns {number}
	*/
	confirmationSummaryHeight() {
		const topPad = this.itemPadding();
		const lh = this.lineHeight();
		const gapBeforeCommands = 8;
		return topPad + lh * 4 + gapBeforeCommands;
	}
	/**
	* Shifts command rows below the summary block so list geometry stays coherent.
	* @param {number} index The command index.
	* @returns {Rectangle}
	*/
	itemRect(index) {
		const rect = Window_Selectable.prototype.itemRect.call(this, index);
		rect.y += this.confirmationSummaryHeight();
		return rect;
	}
	/**
	* Paints summary text first, then command rows (default {@link Window_Selectable#paint} omits summary).
	*/
	paint() {
		if (!this.contents) {
			return;
		}
		this.contents.clear();
		if (this.contentsBack) {
			this.contentsBack.clear();
		}
		this.drawConfirmationSummary();
		this.drawAllItems();
	}
	/**
	* Draws the checkout / upgrade context above the OK and Cancel lines.
	*/
	drawConfirmationSummary() {
		const padX = this.itemPadding();
		const w = this.innerWidth - padX * 2;
		let y = this.itemPadding();
		this.resetFontSettings();
		/**
		* Draws a labeled row with a right-aligned numeric amount.
		* @param {number} iconIndex The icon index, or 0 for none.
		* @param {string} label The left-aligned label.
		* @param {number} amount The right-aligned amount.
		* @param {number} colorIndex The right-text color index.
		*/
		const drawLabeledAmountRow = (iconIndex, label, amount, colorIndex = 0) => {
			const hasIcon = iconIndex > 0;
			const iconSpace = hasIcon ? 40 : 0;
			const textX = padX + iconSpace;
			const textW = w - iconSpace;
			if (hasIcon) {
				this.drawIcon(iconIndex, padX, y + 2);
			}
			this.drawText(label, textX, y, textW, "left");
			this.drawStyledZeroPaddedNumber(textX, y, amount, textW, 8, 8, colorIndex);
			y += this.lineHeight();
		};
		if (this.mode === "cart") {
			const summary = this.cartSummary;
			if (!summary) {
				return;
			}
			let lineA;
			if (summary.panelCount === 1 && summary.solePanelName) {
				const levelWord = summary.levelCount === 1 ? "rank" : "ranks";
				const nameMarked = this.boldenText(summary.solePanelName);
				lineA = `${nameMarked} will be upgraded by ${summary.levelCount} ${levelWord}.`;
			} else {
				const { unitPlural } = J.SDP.Metadata;
				const upgradeWord = summary.levelCount === 1 ? "upgrade" : "upgrades";
				lineA = `${summary.levelCount} ${upgradeWord} on ${summary.panelCount} ${unitPlural}; confirm?`;
			}
			this.drawTextEx(lineA, padX, y, w);
			y += this.lineHeight();
			drawLabeledAmountRow(J.SDP.Metadata.sdpIconIndex, "Current Amount", summary.wallet);
			drawLabeledAmountRow(0, "Cost to pay", summary.totalCost, 18);
			y -= 8;
			this.drawHorizontalLine(padX, y, w);
			y += 10;
			drawLabeledAmountRow(0, `Remaining ${J.SDP.Metadata.sdpPointsDisplayName}`, summary.remaining);
		} else {
			const summary = this.singleSummary;
			if (!summary) {
				return;
			}
			const nameMarked = this.boldenText(summary.panelName);
			const lineA = `${nameMarked} will be upgraded by 1 rank.`;
			this.drawTextEx(lineA, padX, y, w);
			y += this.lineHeight();
			drawLabeledAmountRow(J.SDP.Metadata.sdpIconIndex, "Current Amount", summary.wallet);
			drawLabeledAmountRow(0, "Cost to pay", summary.cost, 18);
			y -= 8;
			this.drawHorizontalLine(padX, y, w);
			y += 10;
			drawLabeledAmountRow(0, `Remaining ${J.SDP.Metadata.sdpPointsDisplayName}`, summary.remaining);
		}
		this.resetFontSettings();
	}
	/**
	* Overwrites {@link #makeCommandList}.<br/>
	* Creates the command list for this window.
	*/
	makeCommandList() {
		const isCart = this.mode === "cart";
		const summary = isCart ? this.cartSummary : this.singleSummary;
		const canAfford = summary ? summary.canAfford : false;
		const upgrade = new WindowCommandBuilder("Upgrade").setSymbol(isCart ? "panel-cart-ok" : "panel-upgrade-ok").setEnabled(canAfford).setIconIndex(91).build();
		this.addBuiltCommand(upgrade);
		const cancel = new WindowCommandBuilder("Cancel").setSymbol("panel-upgrade-cancel").setEnabled(true).setIconIndex(90).build();
		this.addBuiltCommand(cancel);
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpPoints.js
/**
* The SDP ribbon: menu actor identity and always-visible wallet balance.
*
* This is the scene's actor ribbon, and now says so by inheriting one. It previously extended
* {@link Window_Base} and reimplemented the whole of {@link Window_ActorRibbon} alongside it- its own
* `_actor` field, its own `actor()` and `setActor()`, and its own face drawing- which is the drift the
* shared ribbon exists to prevent. All that remains here is what is genuinely particular to SDP: the
* name beside the face, and the wallet on the right edge.
*
* Note that {@link Window_SdpHeader} is *not* the counterpart to this window despite the name. That one
* describes the hovered panel, not the actor.
*/
var Window_SdpPoints = class extends Window_ActorRibbon {
	/**
	* Overrides {@link Window_ActorRibbon.faceWidth}.<br/>
	* Widens the face so the identity block reads as a band rather than a thumbnail.
	* @returns {number}
	*/
	faceWidth() {
		return 128;
	}
	/**
	* Overrides {@link Window_ActorRibbon.faceHeight}.<br/>
	* Crops the face to a single band of height.
	* @returns {number}
	*/
	faceHeight() {
		return 40;
	}
	/**
	* Extends {@link Window_ActorRibbon.drawContent}.<br/>
	* Also draws the actor's name and their SDP wallet.
	*/
	drawContent() {
		super.drawContent();
		this.drawActorName();
		this.drawSdpWallet();
	}
	/**
	* Draws the menu actor name beside the face graphic.
	*/
	drawActorName() {
		if (!this.actor()) return;
		const nameX = this.faceWidth() + 12;
		const y = this.ribbonTextY();
		const nameMaxWidth = this.sdpWalletAnchorX() - nameX - 8;
		this.drawText(this.actor().name(), nameX, y, nameMaxWidth, "left");
	}
	/**
	* Draws the actor's SDP balance on the right edge of the ribbon.
	*/
	drawSdpWallet() {
		if (!this.actor()) return;
		const y = this.ribbonTextY();
		const pad = 12;
		const gap = 8;
		const wallet = this.actor().getSdpPoints();
		const amountW = this.textWidth("00000000");
		const amountX = this.innerWidth - amountW - pad;
		this.drawStyledZeroPaddedNumber(amountX, y, wallet, amountW, 8, 8, 0);
		const iconX = amountX - gap - ImageManager.iconWidth;
		this.drawIcon(J.SDP.Metadata.sdpIconIndex, iconX, y);
	}
	/**
	* Left edge x for the wallet chrome; the name column stops before this point.
	* @returns {number}
	*/
	sdpWalletAnchorX() {
		const pad = 12;
		const gap = 8;
		const amountW = this.textWidth("00000000");
		const iconW = ImageManager.iconWidth;
		const amountX = this.innerWidth - amountW - pad;
		return amountX - gap - iconW;
	}
	/**
	* Vertically centers single-line ribbon text beside the face graphic.
	* @returns {number}
	*/
	ribbonTextY() {
		return Math.floor((this.innerHeight - this.lineHeight()) / 2);
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpHelp.js
/**
* The window that displays the help text associated with a panel.
*/
var Window_SdpHelp = class extends Window_Help {
	/**
	* @constructor
	* @param {Rectangle} rect The dimensions of the window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpFamilyStrip.js
/**
* Thin strip above the SDP panel list showing the active family filter.
* Updated by {@link Scene_SDP} when the player cycles with L2/R2.
*/
var Window_SdpFamilyStrip = class extends Window_Base {
	/**
	* Active family-filter key ({@link SdpFamilyFilter.ALL}, {@link SdpFamilyFilter.UNKNOWN}, or a family key).
	* @type {string}
	*/
	#filterKey = SdpFamilyFilter.ALL;
	/**
	* @param {Rectangle} rect The dimensions of the window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
	/**
	* Sets the active family filter and redraws.
	* @param {string} filterKey The filter key driving this step.
	*/
	setFilterKey(filterKey) {
		this.#filterKey = filterKey;
		this.refresh();
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Renders the current family filter label and icon.
	*/
	drawContent() {
		const filterKey = this.#filterKey;
		const label = SdpFamilyFilter.displayNameForFilterKey(filterKey);
		const iconIndex = SdpFamilyFilter.iconIndexForFilterKey(filterKey);
		const iconPad = 4;
		const textX = iconIndex >= 0 ? ImageManager.iconWidth + iconPad : 0;
		if (iconIndex >= 0) {
			this.drawIcon(iconIndex, iconPad, 0);
		}
		this.resetFontSettings();
		this.drawText(label, textX, 0, this.innerWidth - textX, Window_Base.TextAlignments.Left);
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/sdp/core/scenes/Scene_SDP.js
/**
* The scene for managing SDPs that the player has acquired.
*
* Layout is inherited from {@link Scene_ActorFacetBase}: the help window across the top, the actor ribbon
* beneath it, the control legend across the bottom, and {@link Scene_ActorFacetBase.contentAreaRect} as
* the region left over for the three columns.
*
* This was the furthest-evolved of the actor scenes and the template the shared base was extracted from,
* so it is fitting that it is the last to actually sit on it. Its rects previously chained through each
* other rather than deriving from a common region- one of them read the points rect, the family strip
* height, the help rect *and* the controls hint height to produce a single number- which meant every
* rectangle had to be right for any rectangle to be right.
*/
var Scene_SDP = class extends Scene_ActorFacetBase {
	/**
	* Calls this scene.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Initializes all properties for this scene.
	*/
	initMembers() {
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
		* Header strip for the hovered SDP (single-line name/rarity/flavor).
		* @type {Window_SdpHeader}
		*/
		this._j._sdp._windows._sdpHeader = null;
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
		* Subgroup mastery summary for the hovered panel (separate from rank rewards).
		* @type {Window_SdpMastery}
		*/
		this._j._sdp._windows._sdpMastery = null;
		/**
		* The shopping cart window for planned rank-ups.
		* @type {Window_SdpCart}
		*/
		this._j._sdp._windows._sdpCart = null;
		/**
		* The confirmation window that allows the user to confirm the rankup of a panel.
		* @type {Window_SdpConfirmation}
		*/
		this._j._sdp._windows._sdpConfirmation = null;
		/**
		* The help window that displays the description of the currently hovered SDP.
		* @type {Window_SdpHelp}
		*/
		this._j._sdp._windows._sdpHelp = null;
		/**
		* Family-filter strip above the panel list.
		* @type {Window_SdpFamilyStrip}
		*/
		this._j._sdp._windows._sdpFamilyStrip = null;
		/**
		* The controller-first shopping cart of queued rankups by panel key.
		* @type {Map<string, number>}
		*/
		this._j._sdp._cart = new Map();
		/**
		* L2/R2 family-filter cycle keys for the current menu actor.
		* @type {string[]}
		*/
		this._j._sdp._familyFilterCycle = [];
		/**
		* Index into {@link this._j._sdp._familyFilterCycle}.
		* @type {number}
		*/
		this._j._sdp._familyFilterIndex = 0;
	}
	/**
	* Gets the j.
	* @returns {*} The j.
	*/
	j() {
		return this._j;
	}
	/**
	* Initialize all resources required for this scene.
	*/
	create() {
		super.create();
		this.createDisplayObjects();
	}
	/**
	* Creates the display objects for this scene.
	*/
	createDisplayObjects() {
		this.createAllWindows();
	}
	/**
	* Overwrites {@link #createButtons}.<br/>
	* Removes the rendering of buttons from this scene.
	*/
	createButtons() {}
	/**
	* Creates all windows associated with the SDP scene.
	*/
	createAllWindows() {
		this.createSdpFamilyStripWindow();
		this.createSdpHeaderWindow();
		this.createSdpHelpWindow();
		this.createSdpListWindow();
		this.createSdpParameterListWindow();
		this.createSdpMasteryWindow();
		this.createSdpRewardListWindow();
		this.createSdpCartWindow();
		this.createSdpConfirmationWindow();
		this.rebuildFamilyFilterCycle();
		this.applyActiveFamilyFilter(false);
		this.onPanelHoveredChange();
	}
	/**
	* Pixel height for the family strip above the panel list.
	* @returns {number}
	*/
	sdpFamilyStripHeight() {
		const lineHeight = Window_Base.prototype.lineHeight();
		const pad = $gameSystem.windowPadding();
		return lineHeight + pad * 2;
	}
	/**
	* Creates the family-filter strip above the panel list.
	*/
	createSdpFamilyStripWindow() {
		const window = this.buildSdpFamilyStripWindow();
		this.setSdpFamilyStripWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the family-filter strip window.
	* @returns {Window_SdpFamilyStrip}
	*/
	buildSdpFamilyStripWindow() {
		const rectangle = this.sdpFamilyStripRectangle();
		return new Window_SdpFamilyStrip(rectangle);
	}
	/**
	* Rectangle for the family strip sitting under the points ribbon.
	* @returns {Rectangle}
	*/
	sdpFamilyStripRectangle() {
		const contentArea = this.contentAreaRect();
		return new Rectangle(contentArea.x, contentArea.y, this.sdpListColumnWidth(), this.sdpFamilyStripHeight());
	}
	/**
	* Gets the tracked family strip window.
	* @returns {Window_SdpFamilyStrip}
	*/
	getSdpFamilyStripWindow() {
		return this.j()._sdp._windows._sdpFamilyStrip;
	}
	/**
	* Sets the tracked family strip window.
	* @param {Window_SdpFamilyStrip} familyStripWindow The family strip window driving this step.
	*/
	setSdpFamilyStripWindow(familyStripWindow) {
		this.j()._sdp._windows._sdpFamilyStrip = familyStripWindow;
	}
	/**
	* Rebuilds the L2/R2 family cycle for the current menu actor.
	*/
	rebuildFamilyFilterCycle() {
		const actor = $gameParty.menuActor();
		const cycle = SdpFamilyFilter.buildCycleForActor(actor);
		const previousKey = this.getActiveFamilyFilterKey();
		let nextIndex = cycle.indexOf(previousKey);
		if (nextIndex < 0) {
			nextIndex = 0;
		}
		this.j()._sdp._familyFilterCycle = cycle;
		this.j()._sdp._familyFilterIndex = nextIndex;
	}
	/**
	* Gets the active family-filter key from scene state.
	* @returns {string}
	*/
	getActiveFamilyFilterKey() {
		const cycle = this.j()._sdp._familyFilterCycle;
		if (cycle.length === 0) {
			return SdpFamilyFilter.ALL;
		}
		return cycle[this.j()._sdp._familyFilterIndex | 0] ?? SdpFamilyFilter.ALL;
	}
	/**
	* Applies the active family filter to the strip and panel list.
	* @param {boolean} clampSelection When true, clamp list selection after refresh.
	*/
	applyActiveFamilyFilter(clampSelection = true) {
		const filterKey = this.getActiveFamilyFilterKey();
		const listWindow = this.getSdpListWindow();
		this.getSdpFamilyStripWindow().setFilterKey(filterKey);
		listWindow.setFamilyFilterKey(filterKey);
		if (clampSelection === false) {
			return;
		}
		this.clampSdpListSelection();
	}
	/**
	* Keeps the panel list selection in bounds after a filter refresh.
	*/
	clampSdpListSelection() {
		const listWindow = this.getSdpListWindow();
		const commandCount = listWindow.commandList().length;
		if (commandCount === 0) {
			listWindow.deselect();
			return;
		}
		const index = listWindow.index();
		if (index < 0 || index >= commandCount) {
			listWindow.select(Math.max(0, Math.min(index, commandCount - 1)));
		}
	}
	/**
	* Cycles the family filter forward or backward.
	* @param {boolean} isForward The is forward driving this step.
	*/
	cycleFamilyFilters(isForward = true) {
		const cycle = this.j()._sdp._familyFilterCycle;
		if (cycle.length <= 1) {
			SoundManager.playBuzzer();
			this.getSdpListWindow().activate();
			return;
		}
		const currentIndex = this.j()._sdp._familyFilterIndex | 0;
		const delta = isForward ? 1 : -1;
		const nextIndex = (currentIndex + delta + cycle.length) % cycle.length;
		this.j()._sdp._familyFilterIndex = nextIndex;
		this.applyActiveFamilyFilter();
		this.onPanelHoveredChange();
		this.getSdpListWindow().activate();
	}
	/**
	* Creates the list of SDPs available to the player.
	*/
	createSdpListWindow() {
		const window = this.buildSdpListWindow();
		this.setSdpListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp listing window.
	* @returns {Window_SdpList}
	*/
	buildSdpListWindow() {
		const rectangle = this.sdpListRectangle();
		const window = new Window_SdpList(rectangle);
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("ok", this.onSelectPanel.bind(this));
		window.setHandler("context", this.onFilterPanels.bind(this));
		window.setHandler("cart-dec", this.onCartLevelDecrease.bind(this));
		window.setHandler("cart-inc", this.onCartLevelIncrease.bind(this));
		window.setHandler("content-next", this.cycleFamilyFilters.bind(this, true));
		window.setHandler("content-prev", this.cycleFamilyFilters.bind(this, false));
		window.setHandler("actor-next", this.cycleMembers.bind(this, true));
		window.setHandler("actor-prev", this.cycleMembers.bind(this, false));
		window.onIndexChange = this.onPanelHoveredChange.bind(this);
		window.setActor($gameParty.menuActor());
		return window;
	}
	/**
	* Gets the rectangle associated with the sdp list command window.
	* @returns {Rectangle}
	*/
	sdpListRectangle() {
		const contentArea = this.contentAreaRect();
		const stripHeight = this.sdpFamilyStripHeight();
		return new Rectangle(contentArea.x, contentArea.y + stripHeight, this.sdpListColumnWidth(), contentArea.height - stripHeight);
	}
	/**
	* Gets the currently tracked sdp list window.
	* @returns {Window_SdpList}
	*/
	getSdpListWindow() {
		return this.j()._sdp._windows._sdpList;
	}
	/**
	* Set the currently tracked parameter list window to the given window.
	* @param {Window_SdpList} listWindow The parameter list window to track.
	*/
	setSdpListWindow(listWindow) {
		this.j()._sdp._windows._sdpList = listWindow;
	}
	/**
	* Creates the window for all parameters associated with the hovered SDP.
	*/
	createSdpParameterListWindow() {
		const window = this.buildSdpParameterListWindow();
		this.setSdpParameterListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp parameter listing window.
	* @returns {Window_SdpParameterList}
	*/
	buildSdpParameterListWindow() {
		const rectangle = this.sdpParameterListRectangle();
		const window = new Window_SdpParameterList(rectangle);
		window.deselect();
		window.deactivate();
		window.setActor($gameParty.menuActor());
		return window;
	}
	/**
	* Gets the rectangle associated with the parameter list command window.
	* @returns {Rectangle}
	*/
	sdpParameterListRectangle() {
		const contentArea = this.contentAreaRect();
		const headerRect = this.sdpHeaderRectangle();
		const width = Math.round(contentArea.width * this.sdpCenterColumnRatio());
		return new Rectangle(headerRect.x, headerRect.y + headerRect.height, width, contentArea.height - headerRect.height);
	}
	/**
	* Gets the currently tracked parameter list window.
	* @returns {Window_SdpParameterList}
	*/
	getSdpParameterListWindow() {
		return this.j()._sdp._windows._sdpParameterList;
	}
	/**
	* Set the currently tracked parameter list window to the given window.
	* @param {Window_SdpParameterList} listWindow The parameter list window to track.
	*/
	setSdpParameterListWindow(listWindow) {
		this.j()._sdp._windows._sdpParameterList = listWindow;
	}
	/**
	* Creates the window for all rewards associated with the hovered SDP.
	*/
	createSdpRewardListWindow() {
		const window = this.buildSdpRewardListWindow();
		this.setSdpRewardListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp reward listing window.
	* @returns {Window_SdpRewardList}
	*/
	buildSdpRewardListWindow() {
		const rectangle = this.sdpRewardListRectangle();
		const window = new Window_SdpRewardList(rectangle);
		window.deselect();
		window.deactivate();
		return window;
	}
	/**
	* Gets the currently tracked reward list window.
	* @returns {Window_SdpRewardList}
	*/
	getSdpRewardListWindow() {
		return this.j()._sdp._windows._sdpRewardList;
	}
	/**
	* Set the currently tracked reward list window to the given window.
	* @param {Window_SdpRewardList} listWindow The reward list window to track.
	*/
	setSdpRewardListWindow(listWindow) {
		this.j()._sdp._windows._sdpRewardList = listWindow;
	}
	/**
	* Creates the mastery summary window above rank rewards.
	*/
	createSdpMasteryWindow() {
		const window = this.buildSdpMasteryWindow();
		this.setSdpMasteryWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the read-only mastery strip for the hovered panel.
	* @returns {Window_SdpMastery}
	*/
	buildSdpMasteryWindow() {
		const rectangle = this.sdpMasteryRectangle();
		const window = new Window_SdpMastery(rectangle);
		return window;
	}
	/**
	* Gets the tracked mastery window.
	* @returns {Window_SdpMastery}
	*/
	getSdpMasteryWindow() {
		return this.j()._sdp._windows._sdpMastery;
	}
	/**
	* Sets the tracked mastery window.
	* @param {Window_SdpMastery} masteryWindow The mastery window to track.
	*/
	setSdpMasteryWindow(masteryWindow) {
		this.j()._sdp._windows._sdpMastery = masteryWindow;
	}
	/**
	* Creates the window for planned ("cart") panel rankups.
	*/
	createSdpCartWindow() {
		const window = this.buildSdpCartWindow();
		this.setSdpCartWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the cart window (shares the right column with rewards).
	* @returns {Window_SdpCart}
	*/
	buildSdpCartWindow() {
		const rectangle = this.sdpCartRectangle();
		const window = new Window_SdpCart(rectangle);
		window.deselect();
		window.deactivate();
		return window;
	}
	/**
	* Gets the tracked cart window.
	* @returns {Window_SdpCart}
	*/
	getSdpCartWindow() {
		return this.j()._sdp._windows._sdpCart;
	}
	/**
	* Sets the tracked cart window.
	* @param {Window_SdpCart} cartWindow The cart window to track.
	*/
	setSdpCartWindow(cartWindow) {
		this.j()._sdp._windows._sdpCart = cartWindow;
	}
	/**
	* Shared geometry for the right column (mastery, rewards, cart).
	* Cart height and y are pinned to the bottom half and must stay stable.
	* @returns {{ x: number, topY: number, width: number, cartY: number, cartHeight: number, topRegionHeight: number, gap: number }}
	*/
	sdpRightColumnMetrics() {
		const contentArea = this.contentAreaRect();
		const parameterRect = this.sdpParameterListRectangle();
		const headerRect = this.sdpHeaderRectangle();
		const x = parameterRect.x + parameterRect.width;
		const width = contentArea.x + contentArea.width - x;
		const bottom = this.sdpRightColumnBottom();
		const gap = this.sdpRightColumnSplitGap();
		const topY = headerRect.y + headerRect.height;
		const cartHeight = Math.floor((contentArea.height - gap) / 2);
		const cartY = bottom - cartHeight;
		const topRegionHeight = cartY - topY - gap;
		return {
			x,
			topY,
			width,
			cartY,
			cartHeight,
			topRegionHeight,
			gap
		};
	}
	/**
	* Pixel height for the mastery summary strip (two text rows + chrome).
	* @returns {number}
	*/
	sdpMasteryWindowHeight() {
		return this.calcWindowHeight(2, false);
	}
	/**
	* Rectangle for the mastery window at the top of the right column.
	* @returns {Rectangle}
	*/
	sdpMasteryRectangle() {
		const metrics = this.sdpRightColumnMetrics();
		const height = this.sdpMasteryWindowHeight();
		return new Rectangle(metrics.x, metrics.topY, metrics.width, height);
	}
	/**
	* Rectangle for the cart window, occupying the bottom half of the right column.
	* @returns {Rectangle}
	*/
	sdpCartRectangle() {
		const metrics = this.sdpRightColumnMetrics();
		return new Rectangle(metrics.x, metrics.cartY, metrics.width, metrics.cartHeight);
	}
	/**
	* Rectangle for the rewards window, filling the space between mastery and cart.
	* @returns {Rectangle}
	*/
	sdpRewardListRectangle() {
		const metrics = this.sdpRightColumnMetrics();
		const masteryHeight = this.sdpMasteryWindowHeight();
		const y = metrics.topY + masteryHeight + metrics.gap;
		const height = metrics.cartY - y - metrics.gap;
		return new Rectangle(metrics.x, y, metrics.width, height);
	}
	/**
	* The bottom boundary for the right column (rewards + cart).
	* @returns {number}
	*/
	sdpRightColumnBottom() {
		const contentArea = this.contentAreaRect();
		return contentArea.y + contentArea.height;
	}
	/**
	* The gap between rewards and cart windows.
	* @returns {number}
	*/
	sdpRightColumnSplitGap() {
		return 0;
	}
	/**
	* Creates the header window for the hovered SDP.
	*/
	createSdpHeaderWindow() {
		const window = this.buildSdpHeaderWindow();
		this.setSdpHeaderWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the header window.
	* @returns {Window_SdpHeader}
	*/
	buildSdpHeaderWindow() {
		const rectangle = this.sdpHeaderRectangle();
		return new Window_SdpHeader(rectangle);
	}
	/**
	* The rectangle for the header strip spanning the top row (right of points ribbon).
	* @returns {Rectangle}
	*/
	sdpHeaderRectangle() {
		const contentArea = this.contentAreaRect();
		const x = contentArea.x + this.sdpListColumnWidth();
		const height = this.calcWindowHeight(2, false);
		const width = contentArea.x + contentArea.width - x;
		return new Rectangle(x, contentArea.y, width, height);
	}
	/**
	* Gets the tracked header window.
	* @returns {Window_SdpHeader}
	*/
	getSdpHeaderWindow() {
		return this.j()._sdp._windows._sdpHeader;
	}
	/**
	* Sets the tracked header window.
	* @param {Window_SdpHeader} headerWindow The header window to track.
	*/
	setSdpHeaderWindow(headerWindow) {
		this.j()._sdp._windows._sdpHeader = headerWindow;
	}
	/**
	* Implements {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
	* Describes the controls this scene responds to.
	*
	* This replaces `Window_SdpControlsHint`, which was for a long time the only button help anywhere in
	* the game- and therefore the proof that the idea was worth generalising. The shared legend it became
	* renders live glyphs for whichever device the player is holding, which the bespoke one could not.
	* @returns {{semantic: (string|string[]), label: string}[]}
	*/
	controlLegendEntries() {
		return [
			{
				semantic: "ok",
				label: "add to cart"
			},
			{
				semantic: "context",
				label: "checkout"
			},
			{
				semantic: ["cart-dec", "cart-inc"],
				label: "ranks to buy"
			},
			{
				semantic: ["content-prev", "content-next"],
				label: "switch family"
			},
			{
				semantic: "more",
				label: "hide maxed"
			},
			{
				semantic: ["actor-prev", "actor-next"],
				label: "switch character"
			},
			{
				semantic: "cancel",
				label: "back"
			}
		];
	}
	/**
	* The proportion of the content area given to the panel list column.
	* @returns {number}
	*/
	sdpListColumnRatio() {
		return .25;
	}
	/**
	* The proportion of the content area given to the parameter column.
	* @returns {number}
	*/
	sdpCenterColumnRatio() {
		return .375;
	}
	/**
	* The width of the panel list column.
	* @returns {number}
	*/
	sdpListColumnWidth() {
		return Math.round(this.contentAreaRect().width * this.sdpListColumnRatio());
	}
	/**
	* Creates the help window that provides contextual details to the player about the panel.
	*/
	createSdpHelpWindow() {
		const window = this.buildSdpHelpWindow();
		this.setSdpHelpWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp help window.
	* @returns {Window_SdpHelp}
	*/
	buildSdpHelpWindow() {
		const rectangle = this.sdpHelpRectangle();
		const window = new Window_SdpHelp(rectangle);
		return window;
	}
	/**
	* Gets the rectangle associated with the sdp help window.
	* @returns {Rectangle}
	*/
	sdpHelpRectangle() {
		return this.helpWindowRect();
	}
	/**
	* Gets the currently tracked sdp help window.
	* @returns {Window_SdpHelp}
	*/
	getSdpHelpWindow() {
		return this.j()._sdp._windows._sdpHelp;
	}
	/**
	* Set the currently tracked help window to the given window.
	* @param {Window_SdpHelp} helpWindow The help window to track.
	*/
	setSdpHelpWindow(helpWindow) {
		this.j()._sdp._windows._sdpHelp = helpWindow;
	}
	/**
	* Overrides {@link Scene_ActorFacetBase.buildActorRibbonWindow}.<br/>
	* Supplies the SDP ribbon, which shows the actor plus their spendable point balance.
	*
	* The base decides where it sits and how wide it is. This used to be a 480px band pinned to the upper
	* left, whose width the panel list below then had to match by restating the same number.
	* @param {Rectangle} rectangle The rectangle to build the window within.
	* @returns {Window_SdpPoints}
	*/
	buildActorRibbonWindow(rectangle) {
		return new Window_SdpPoints(rectangle);
	}
	/**
	* Gets the currently tracked sdp points window.
	*
	* Kept as a name that reads in context; the base owns the window itself.
	* @returns {Window_SdpPoints}
	*/
	getSdpPointsWindow() {
		return this.getActorRibbonWindow();
	}
	/**
	* Creates the confirmation window for confirming the rankup of an SDP.
	*/
	createSdpConfirmationWindow() {
		const window = this.buildSdpConfirmationWindow();
		this.setSdpConfirmationWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp listing window.
	* @returns {Window_SdpConfirmation}
	*/
	buildSdpConfirmationWindow() {
		const rectangle = this.sdpConfirmationRectangle();
		const window = new Window_SdpConfirmation(rectangle);
		window.setHandler("cancel", this.onUpgradeCancel.bind(this));
		window.setHandler("panel-upgrade-ok", this.onUpgradeConfirm.bind(this));
		window.setHandler("panel-cart-ok", this.onCartCheckoutConfirm.bind(this));
		window.setHandler("panel-upgrade-cancel", this.onUpgradeCancel.bind(this));
		window.hide();
		return window;
	}
	/**
	* Gets the rectangle associated with the sdp confirmation window.
	* @returns {Rectangle}
	*/
	sdpConfirmationRectangle() {
		const windowPad = $gameSystem.windowPadding();
		const lh = Window_Base.prototype.lineHeight();
		const itemPad = 8;
		const summaryBlock = itemPad + lh * 4 + 8;
		const commandBlock = lh;
		const innerSlack = 16;
		const height = windowPad * 2 + summaryBlock + commandBlock + innerSlack;
		const width = Math.min(Graphics.boxWidth - 48, 710);
		const x = (Graphics.boxWidth - width) / 2;
		const y = (Graphics.boxHeight - height) / 2;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked sdp confirmation window.
	* @returns {Window_SdpConfirmation}
	*/
	getSdpConfirmationWindow() {
		return this.j()._sdp._windows._sdpConfirmation;
	}
	/**
	* Set the currently tracked sdp confirmation window to the given window.
	* @param {Window_SdpConfirmation} confirmationWindow The window to track.
	*/
	setSdpConfirmationWindow(confirmationWindow) {
		this.j()._sdp._windows._sdpConfirmation = confirmationWindow;
	}
	/**
	* When selecting a panel, bring up the confirmation window.
	*/
	onSelectPanel() {
		if (this.j()._sdp._cart.size > 0) {
			this.openCartCheckoutConfirmation();
			return;
		}
		this.openSingleUpgradeConfirmation();
	}
	/**
	* Opens the confirmation window for purchasing the queued cart.
	*/
	openCartCheckoutConfirmation() {
		const window = this.getSdpConfirmationWindow();
		window.setMode("cart");
		window.setCartSummary(this.buildCartSummary($gameParty.menuActor()));
		window.refresh();
		window.show();
		window.open();
		window.activate();
		this.showModalDimmer(Scene_Base.MODAL_DIMMER_CONTENTS_OPACITY_DEFAULT, this.getSdpConfirmationWindow());
	}
	/**
	* Opens the confirmation window for purchasing a single rank-up.
	*/
	openSingleUpgradeConfirmation() {
		const actor = $gameParty.menuActor();
		const panel = this.getSdpListWindow().currentExt();
		const { currentRank } = actor.getSdpByKey(panel.key);
		const cost = panel.rankUpCost(currentRank);
		const window = this.getSdpConfirmationWindow();
		window.setMode("single");
		window.setSingleSummary(panel.name, cost, actor.getSdpPoints());
		window.refresh();
		window.show();
		window.open();
		window.activate();
		this.showModalDimmer(Scene_Base.MODAL_DIMMER_CONTENTS_OPACITY_DEFAULT, this.getSdpConfirmationWindow());
	}
	/**
	* Queues one more level for the currently hovered panel.
	*/
	onCartLevelIncrease() {
		this.modifyHoveredPanelCartLevels(1);
	}
	/**
	* Removes one queued level for the currently hovered panel.
	*/
	onCartLevelDecrease() {
		this.modifyHoveredPanelCartLevels(-1);
	}
	/**
	* Adds or removes queued levels for the hovered panel.
	* @param {number} delta The amount to adjust by.
	*/
	modifyHoveredPanelCartLevels(delta) {
		const panel = this.getSdpListWindow().currentExt();
		if (!panel) {
			return;
		}
		const actor = $gameParty.menuActor();
		const { key, maxRank } = panel;
		const { currentRank } = actor.getSdpByKey(key);
		const maxQueue = Math.max(0, maxRank - currentRank);
		const cart = this.j()._sdp._cart;
		const existing = cart.get(key) ?? 0;
		const next = Math.max(0, Math.min(existing + delta, maxQueue));
		if (next === 0) {
			cart.delete(key);
		} else {
			cart.set(key, next);
		}
		this.onPanelHoveredChange();
		this.getSdpListWindow().activate();
	}
	/**
	* Toggle the filtering out of already-maxed panels.
	*/
	onFilterPanels() {
		const sdpListWindow = this.getSdpListWindow();
		sdpListWindow.toggleNoMaxPanelsFilter();
		this.onPanelHoveredChange();
		this.clampSdpListSelection();
	}
	/**
	* Attempts to execute all cart rankups in one go.
	* If the total cost cannot be afforded, nothing happens.
	*/
	checkoutCart() {
		const actor = $gameParty.menuActor();
		const cart = this.j()._sdp._cart;
		if (cart.size === 0) {
			return false;
		}
		let totalCost = 0;
		cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			const { currentRank } = actor.getSdpByKey(key);
			for (let i = 0; i < levels; i++) {
				totalCost += panel.rankUpCost(currentRank + i);
			}
		});
		const wallet = actor.getSdpPoints();
		if (totalCost > wallet) {
			SoundManager.playBuzzer();
			return false;
		}
		cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			const { currentRank } = actor.getSdpByKey(key);
			for (let i = 0; i < levels; i++) {
				const cost = panel.rankUpCost(currentRank + i);
				if (cost === 0) {
					return;
				}
				actor.modSdpPoints(-cost);
				actor.rankUpPanel(key);
				actor.modAccumulatedSpentSdpPoints(cost);
			}
		});
		this.j()._sdp._cart.clear();
		this.onPanelHoveredChange();
		this.getSdpListWindow().activate();
		return true;
	}
	/**
	* Builds a summarized view of the cart for display/confirmation.
	* @param {Game_Actor} actor The actor whose wallet and ranks apply.
	* @returns {{
	*   panelCount: number,
	*   levelCount: number,
	*   totalCost: number,
	*   wallet: number,
	*   remaining: number,
	*   canAfford: boolean,
	*   solePanelName: string|null
	* }}
	*/
	buildCartSummary(actor) {
		const cart = this.j()._sdp._cart;
		const wallet = actor.getSdpPoints();
		let totalCost = 0;
		let levelCount = 0;
		let panelCount = 0;
		cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			panelCount++;
			levelCount += levels;
			const { currentRank } = actor.getSdpByKey(key);
			for (let i = 0; i < levels; i++) {
				totalCost += panel.rankUpCost(currentRank + i);
			}
		});
		const remaining = wallet - totalCost;
		const canAfford = remaining >= 0;
		let solePanelName = null;
		if (panelCount === 1) {
			cart.forEach((_levels, key) => {
				const sole = J.SDP.Metadata.panelsMap.get(key);
				if (sole) {
					solePanelName = sole.name;
				}
			});
		}
		return {
			panelCount,
			levelCount,
			totalCost,
			wallet,
			remaining,
			canAfford,
			solePanelName
		};
	}
	/**
	* Clears the detail strip when the filter list is empty or nothing is selected.
	*/
	clearPanelDetailWindows() {
		this.getSdpHeaderWindow().setPanel(null);
		this.getSdpHeaderWindow().refresh();
		this.getSdpMasteryWindow().setPanel(null);
		this.getSdpMasteryWindow().refresh();
		const parameterListWindow = this.getSdpParameterListWindow();
		parameterListWindow.setParameters(null);
		parameterListWindow.refresh();
		const rewardListWindow = this.getSdpRewardListWindow();
		rewardListWindow.setRewards(null);
		rewardListWindow.refresh();
		this.getSdpHelpWindow().setText(String.empty);
	}
	/**
	* Refreshes all windows in this scene on change of index in the list.
	*/
	onPanelHoveredChange() {
		const hasPanels = this.getSdpListWindow().hasCommands();
		if (!hasPanels) {
			this.clearPanelDetailWindows();
			return;
		}
		/** @type {StatDistributionPanel} */
		const currentPanel = this.getSdpListWindow().currentExt();
		if (currentPanel === null) {
			this.clearPanelDetailWindows();
			return;
		}
		const currentActor = $gameParty.menuActor();
		this.getSdpListWindow().setActor(currentActor);
		this.getSdpListWindow().setCart(this.j()._sdp._cart);
		this.getSdpPointsWindow().setActor(currentActor);
		const parameterListWindow = this.getSdpParameterListWindow();
		parameterListWindow.setActor(currentActor);
		parameterListWindow.setParameters(currentPanel.panelParameters);
		parameterListWindow.refresh();
		const rewardListWindow = this.getSdpRewardListWindow();
		rewardListWindow.setRewards(currentPanel.panelRewards);
		rewardListWindow.refresh();
		this.getSdpMasteryWindow().setPanel(currentPanel);
		this.getSdpMasteryWindow().refresh();
		this.getSdpCartWindow().setCart(currentActor, this.j()._sdp._cart);
		this.getSdpCartWindow().refresh();
		this.getSdpHeaderWindow().setPanel(currentPanel);
		this.getSdpHeaderWindow().refresh();
		this.getSdpHelpWindow().setText(currentPanel.description);
	}
	/**
	* Cycles the currently selected member to the next in the party.
	* @param {boolean} isForward Whether or not to cycle to the next member or previous.
	*/
	cycleMembers(isForward = true) {
		if (this.j()._sdp._cart.size > 0) {
			SoundManager.playBuzzer();
			this.getSdpListWindow().activate();
			return;
		}
		isForward ? $gameParty.makeMenuActorNext() : $gameParty.makeMenuActorPrevious();
		this.rebuildFamilyFilterCycle();
		this.applyActiveFamilyFilter(false);
		this.onPanelHoveredChange();
		this.getSdpListWindow().activate();
	}
	/**
	* If the player opts to upgrade the existing panel, remove the points and rank up the panel.
	*/
	onUpgradeConfirm() {
		this.hideModalDimmer();
		const panel = this.getSdpListWindow().currentExt();
		const actor = $gameParty.menuActor();
		const panelRanking = actor.getSdpByKey(panel.key);
		const panelRankupCost = panel.rankUpCost(panelRanking.currentRank);
		actor.modSdpPoints(-panelRankupCost);
		actor.rankUpPanel(panel.key);
		actor.modAccumulatedSpentSdpPoints(panelRankupCost);
		this.onPanelHoveredChange();
		this.getSdpConfirmationWindow().close();
		this.getSdpListWindow().activate();
	}
	/**
	* Confirms and executes the queued cart rankups.
	*/
	onCartCheckoutConfirm() {
		const didCheckout = this.checkoutCart();
		if (didCheckout === false) {
			return;
		}
		this.hideModalDimmer();
		this.getSdpConfirmationWindow().close();
		this.getSdpConfirmationWindow().hide();
		this.getSdpListWindow().activate();
	}
	/**
	* If the player opts to cancel the upgrade process, return to the list window.
	*/
	onUpgradeCancel() {
		this.hideModalDimmer();
		const window = this.getSdpConfirmationWindow();
		window.close();
		window.hide();
		this.getSdpListWindow().activate();
	}
};

//#endregion
//#region src/plugins/sdp/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Registers J-SDP stats with the parameter catalog after vanilla seeding.
*/
J.SDP.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.SDP.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	SdpParameterRegistration.registerAll();
};

//#endregion
//#region src/plugins/sdp/core/scenes/Scene_Map.js
/**
* Reconciles subgroup mastery wrapper skills on map entry.<br/>
* Idempotent safety net when panel content or plugin wiring changes mid dev save.
*/
J.SDP.Aliased.Scene_Map.set("start", Scene_Map.prototype.start);
Scene_Map.prototype.start = function() {
	J.SDP.Aliased.Scene_Map.get("start").call(this);
	SdpMasteryManager.reconcileAllForParty();
};

//#endregion
//#region src/plugins/sdp/core/scenes/Scene_Menu.js
/**
* Hooks into the command window creation of the menu to add functionality for the SDP menu.
*/
J.SDP.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.SDP.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this.commandWindow().setHandler("sdp-menu", this.commandSdp.bind(this));
};
/**
* Brings up the SDP menu.
*/
Scene_Menu.prototype.commandSdp = function() {
	Scene_SDP.callScene();
};

//#endregion
//#region src/plugins/sdp/core/_metadata/pluginCommands.js
/**
* Plugin command for calling the SDP scene/menu.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Call SDP Menu", () => {
	Scene_SDP.callScene();
});
/**
* Plugin command for unlocking a SDP to be leveled.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Unlock SDP", (args) => {
	const { keys } = args;
	const panelKeys = JSON.parse(keys);
	panelKeys.forEach((key) => $gameParty.unlockSdp(key));
});
/**
* Plugin command for locking a SDP to no longer be available for the player.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Lock SDP", (args) => {
	const { keys } = args;
	const panelKeys = JSON.parse(keys);
	panelKeys.forEach((key) => $gameParty.lockSdp(key));
});
/**
* Plugin command for modifying an actor's SDP points.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Modify SDP points", (args) => {
	const { actorId, sdpPoints } = args;
	const parsedActorId = parseInt(actorId);
	const parsedSdpPoints = parseInt(sdpPoints);
	$gameActors.actor(parsedActorId).modSdpPoints(parsedSdpPoints);
});
/**
* Plugin command for modifying all current party members' SDP points.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Modify party SDP points", (args) => {
	const { sdpPoints } = args;
	const parsedSdpPoints = parseInt(sdpPoints);
	$gameParty.members().forEach((member) => member.modSdpPoints(parsedSdpPoints));
});

//#endregion
//# sourceMappingURL=J-SDP.js.map