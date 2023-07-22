//region introduction
/* eslint-disable */
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 DIFFICULTY] A layered difficulty system.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-DropsControl
 * @orderAfter J-SDP
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables the ability to apply one to many "difficulty layers",
 * defined as a collection of parameter modifications and bonuses against both
 * actors and enemies alike.
 * ----------------------------------------------------------------------------
 * NOTE:
 * There are no tags for this plugin, but all difficulty layers are defined in
 * the plugin parameters.
 * ============================================================================
 * CHANGELOG:
 * - 2.0.0
 *    Updated window layout of scene.
 *    Added multiple layer application support.
 *    Updated difficulty layers to also be applicable to actors if desired.
 *    Refactored a lot of underlying code.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param difficultyConfigs
 * @text DIFFICULTY SETUP
 *
 * @param initialPoints
 * @parent difficultyConfigs
 * @type number
 * @text Starting Points
 * @desc The number of points the player has available from the start of a new game.
 * @default 10
 *
 * @param defaultDifficulty
 * @parent difficultyConfigs
 * @type string
 * @text Default Difficulty
 * @desc The key of the starting or default difficulty before it is decided.
 * @default 000_default
 *
 * @param difficulties
 * @parent difficultyConfigs
 * @type struct<DifficultyStruct>[]
 * @text Difficulties
 * @desc All difficulties, locked or otherwise.
 * @default ["{\"key\":\"020_Normal\",\"name\":\"Normal\",\"iconIndex\":\"883\",\"enabled\":\"false\",\"unlocked\":\"true\",\"hidden\":\"false\",\"description\":\"Your expected gameplay difficulty. Nothing is modified.\",\"bparams\":\"[]\",\"xparams\":\"[]\",\"sparams\":\"[]\",\"bonuses\":\"[]\"}","{\"key\":\"010_Easy\",\"name\":\"Easy\",\"iconIndex\":\"881\",\"enabled\":\"false\",\"unlocked\":\"true\",\"hidden\":\"false\",\"description\":\"A mild experience for players that want to try less and fun more.\",\"bparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"110\\\\\\\"}\\\"]\",\"xparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"50\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"0\\\\\\\"}\\\"]\",\"sparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"6\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\",\"bonuses\":\"[\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\"}","{\"key\":\"030_Hard\",\"name\":\"Hard\",\"iconIndex\":\"885\",\"enabled\":\"false\",\"unlocked\":\"true\",\"hidden\":\"false\",\"description\":\"A more challenging experience where you might have to try more than button mashing to win.\",\"bparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\",\"xparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\"]\",\"sparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"6\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\"]\",\"bonuses\":\"[\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\"]\"}"]
 *
 *
 * @command callDifficultyMenu
 * @text Call Difficulty Menu
 * @desc Calls the difficulty menu regardless of the current scene.
 *
 * @command lockDifficulty
 * @text Lock Difficulty
 * @desc Locks a difficulty, making it unchoosable in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be locked.
 *
 * @command unlockDifficulty
 * @text Unlock Difficulty
 * @desc Unlocks a difficulty, making it choosable in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be unlocked.
 *
 * @command hideDifficulty
 * @text Hide Difficulty
 * @desc Hides a difficulty, preventing it from being added to the list in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be hidden.
 *
 * @command unhideDifficulty
 * @text Unhide Difficulty
 * @desc Shows a difficulty, forcing it to be added to the list in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be unhidden.
 *
 * @command enableDifficulty
 * @text Enable Difficulty
 * @desc Enables a difficulty, applying its effects.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be enabled.
 *
 * @command disableDifficulty
 * @text Disable Difficulty
 * @desc Disables a difficulty, rendering its effects inactive.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be disabled.
 *
 * @command modifyLayerMax
 * @text Modify Layer Max
 * @desc Modifies the maximum difficulty layer points by the given amount.
 * @arg amount
 * @type number
 * @desc The amount to modify the max layer points by. This can be negative.
 * @min -999999
 * @max 999999
 */
/*~struct~DifficultyStruct:
 * @param key
 * @parent overview
 * @type string
 * @text Unique Key
 * @desc A unique identifier for this difficulty.
 * Only letters, numbers, and underscores are recognized.
 * @default 010_Easy
 *
 * @param name
 * @parent overview
 * @type string
 * @text Name
 * @desc The name of the difficulty.
 * Displayed in the list of difficulties on the left.
 * @default Normal
 *
 * @param iconIndex
 * @parent overview
 * @type number
 * @text Icon Index
 * @desc The index of the icon to represent this difficulty.
 * @default 1
 *
 * @param description
 * @parent overview
 * @type string
 * @text Help Window Text
 * @desc Some text maybe describing the panel.
 * Shows up in the bottom help window.
 * @default Some really cool panel that has lots of hardcore powers.
 *
 * @param cost
 * @parent overview
 * @type number
 * @text Cost
 * @desc The cost required to enable this difficulty.
 * @default 0
 *
 * @param enabled
 * @parent overview
 * @text Is Enabled
 * @type boolean
 * @desc If this is ON/true, then this difficulty will be enabled when a new game starts.
 * @default false
 *
 * @param unlocked
 * @parent overview
 * @text Is Unlocked
 * @type boolean
 * @desc If this is ON/true, then this difficulty will be unlocked when a new game is started.
 * @default false
 *
 * @param hidden
 * @parent overview
 * @text Is Hidden
 * @type boolean
 * @desc If this is ON/true, then this difficulty will be hidden when a new game is started.
 * @default false
 *
 * @param enemyEffects
 * @parent data
 * @type struct<BattlerEffectsStruct>
 * @text Enemy Effects
 * @desc The effects that are applied to enemy battlers.
 * @default {"bparams":"[]","xparams":"[]","sparams":"[]"}
 *
 * @param actorEffects
 * @parent data
 * @type struct<BattlerEffectsStruct>
 * @text Actor Effects
 * @desc The effects that are applied to actor battlers.
 * @default {"bparams":"[]","xparams":"[]","sparams":"[]"}
 *
 * @param bonuses
 * @parent data
 * @type struct<BonusStruct>[]
 * @text Bonus Modifiers
 * @desc Bonuses listed here will be modified by the their respective provided rates.
 * @default []
 */
/*~struct~BParamStruct:
 * @param parameterId
 * @text Parameter Id
 * @desc 0-7 are core parameters.
 * @type number
 * @type select
 * @option All params
 * @value -1
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
 * @default 0
 *
 * @param parameterRate
 * @text Parameter Rate
 * @type number
 * @desc The percent multiplier that the given parameter will be modified by.
 * @default 100
 */
/*~struct~XParamStruct:
 * @param parameterId
 * @text X-Parameter Id
 * @desc This x-parameter to be modified.
 * @type select
 * @option All params
 * @value -1
 * @option Hit Rate
 * @value 0
 * @option Evasion Rate
 * @value 1
 * @option Crit Chance
 * @value 2
 * @option Crit Evasion
 * @value 3
 * @option Magic Evasion
 * @value 4
 * @option Magic Reflect Rate
 * @value 5
 * @option Counter Rate
 * @value 6
 * @option HP Regen
 * @value 7
 * @option MP Regen
 * @value 8
 * @option TP Regen
 * @value 9
 * @default 0
 *
 * @param parameterRate
 * @text Parameter Rate
 * @type number
 * @desc The percent multiplier that the given parameter will be modified by.
 * @default 100
 */
/*~struct~SParamStruct:
 * @param parameterId
 * @text S-Parameter Id
 * @desc This s-parameter to be modified.
 * @type select
 * @option All params
 * @value -1
 * @option Targeting Rate
 * @value 0
 * @option Guard Rate
 * @value 1
 * @option Recovery Rate
 * @value 2
 * @option Pharmacy Rate
 * @value 3
 * @option MP Cost Reduction
 * @value 4
 * @option TP Cost Reduction
 * @value 5
 * @option Phys DMG Reduction
 * @value 6
 * @option Magi DMG Reduction
 * @value 7
 * @option Floor DMG Reduction
 * @value 8
 * @option Experience Rate
 * @value 9
 * @default 0
 *
 * @param parameterRate
 * @text Parameter Rate
 * @type number
 * @desc The percent multiplier that the given parameter will be modified by.
 * @default 100
 */
/*~struct~BonusStruct:
 * @param bonusId
 * @text Bonus Modifier
 * @desc This bonus rate to be modified.
 * @type select
 * @option Experience Earned
 * @value 0
 * @option Gold Found
 * @value 1
 * @option Loot Dropped
 * @value 2
 * @option SDP Acquired
 * @value 3
 * @default 0
 *
 * @param bonusRate
 * @text Bonus Rate
 * @type number
 * @desc The percent multiplier that the given bonus will be modified by.
 * @default 100
 */
/*~struct~BattlerEffectsStruct:
 * @param bparams
 * @parent data
 * @type struct<BParamStruct>[]
 * @text B-Parameter Modifiers
 * @desc Parameters listed here will be modified by the their respective provided rates.
 * @default []
 *
 * @param xparams
 * @parent data
 * @type struct<XParamStruct>[]
 * @text X-Parameter Modifiers
 * @desc Parameters listed here will be modified by the their respective provided rates.
 * @default []
 *
 * @param sparams
 * @parent data
 * @type struct<SParamStruct>[]
 * @text S-Parameter Modifiers
 * @desc Parameters listed here will be modified by the their respective provided rates.
 * @default []
 *
 */
/*
 * ==============================================================================
 * CHANGELOG:
 * - 2.0.0
 *    Updated to enable toggling one to many difficulties on at once.
 * - 1.0.0
 *    Initial release.
 * ==============================================================================
 */
/* eslint-enable */