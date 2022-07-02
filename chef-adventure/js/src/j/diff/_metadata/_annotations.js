//#region introduction
/* eslint-disable */
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 DIFF] A difficulty engine.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-BASE
 * @orderAfter _diffModels
 * @help
 * ============================================================================
 * This plugin grants you the ability to define a "difficulty system",
 * defined by globally manipulating enemy parameters to be higher or lower as
 * well as modifying basic things like experience gained or gold found.
 * ============================================================================
 *
 * @param systemConfigs
 * @text DIFFICULTY SETUP
 *
 * @param menuSwitch
 * @parent systemConfigs
 * @type switch
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 1
 *
 * @param difficultyConfigs
 * @text DIFFICULTY SETUP
 *
 * @param defaultDifficulty
 * @parent difficultyConfigs
 * @type string
 * @text Default Difficulty
 * @desc The starting or default difficulty before it is decided.
 * @default 020_Normal
 *
 * @param difficulties
 * @parent difficultyConfigs
 * @type struct<DifficultyStruct>[]
 * @text Difficulties
 * @desc All difficulties, locked or otherwise.
 * @default ["{\"key\":\"010_Easy\",\"name\":\"Easy\",\"iconIndex\":\"881\",\"unlocked\":\"true\",\"description\":\"A mild experience for players that want to try less and fun more.\",\"bparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\"]\",\"xparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"50\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"0\\\\\\\"}\\\"]\",\"sparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"6\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\",\"bonuses\":\"[\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\"}","{\"key\":\"020_Normal\",\"name\":\"Normal\",\"iconIndex\":\"883\",\"unlocked\":\"true\",\"description\":\"Your expected gameplay difficulty. Nothing is modified.\",\"bparams\":\"[]\",\"xparams\":\"[]\",\"sparams\":\"[]\",\"bonuses\":\"[]\"}","{\"key\":\"030_Hard\",\"name\":\"Hard\",\"iconIndex\":\"885\",\"unlocked\":\"true\",\"description\":\"A more challenging experience where you might have to try more than button mashing to win.\",\"bparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\",\"xparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\"]\",\"sparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"6\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\"]\",\"bonuses\":\"[\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\"]\"}"]
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
 *
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
 * @param unlocked
 * @parent overview
 * @text Is Unlocked
 * @type boolean
 * @desc If this is ON/true, then this panel will be unlocked when a new game is started.
 * @default false
 *
 * @param description
 * @parent overview
 * @type string
 * @text Help Window Text
 * @desc Some text maybe describing the panel.
 * Shows up in the bottom help window.
 * @default Some really cool panel that has lots of hardcore powers.
 *
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
/* eslint-enable */