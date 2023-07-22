//region initialization
/**
 * The core where all of my extensions live = in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CAMods = {};

/**
 * The `metadata` associated with this plugin; such as version.
 */
J.CAMods.Metadata = {};
J.CAMods.Metadata.Name = `J-CA-Mods`;
J.CAMods.Metadata.Version = '1.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.CAMods.PluginParameters = PluginManager.parameters(J.CAMods.Metadata.Name);

/**
 * A collection of data points being tracked for CA.
 * Each of these data points represent a variableId to track data within.
 */
J.CAMods.Tracking = {};
J.CAMods.Tracking.EnemiesDefeated = 101;
J.CAMods.Tracking.DestructiblesDestroyed = 102;
J.CAMods.Tracking.TotalDamageDealt = 103;
J.CAMods.Tracking.HighestDamageDealt = 104;
J.CAMods.Tracking.NumberOfCritsDealt = 105;
J.CAMods.Tracking.BiggestCritDealt = 106;
J.CAMods.Tracking.NumberOfParries = 107;
J.CAMods.Tracking.NumberOfPreciseParries = 108;
J.CAMods.Tracking.TotalDamageTaken = 109;
J.CAMods.Tracking.HighestDamageTaken = 110;
J.CAMods.Tracking.NumberOfCritsTaken = 111;
J.CAMods.Tracking.BiggestCritTaken = 112;
J.CAMods.Tracking.MainhandSkillUsage = 113;
J.CAMods.Tracking.OffhandSkillUsage = 114;
J.CAMods.Tracking.AssignedSkillUsage = 115;
J.CAMods.Tracking.DodgeSkillUsage = 116;
J.CAMods.Tracking.NumberOfDeaths = 117;

/**
 * A collection of all aliased methods for this plugin.
 */
J.CAMods.Aliased = {};
J.CAMods.Aliased.JABS_Battler = new Map();
J.CAMods.Aliased.JABS_Engine = new Map();
J.CAMods.Aliased.Game_Actor = new Map();
J.CAMods.Aliased.Game_BattlerBase = new Map();
J.CAMods.Aliased.Game_Enemy = new Map();
J.CAMods.Aliased.Game_Map = new Map();
J.CAMods.Aliased.Scene_Boot = new Map();
//endregion initialization