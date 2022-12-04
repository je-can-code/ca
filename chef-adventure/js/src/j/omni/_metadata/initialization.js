//#region Metadata
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.OMNI = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.OMNI.Metadata = {};

/**
 * The name of this plugin.
 */
J.OMNI.Metadata.Name = 'J-Omnipedia';

/**
 * The version of this plugin.
 */
J.OMNI.Metadata.Version = '1.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.OMNI.PluginParameters = PluginManager.parameters(J.OMNI.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.OMNI.Aliased = {};
J.OMNI.Aliased.DataManager = new Map();
J.OMNI.Aliased.Game_Enemy = new Map();
J.OMNI.Aliased.Game_Party = new Map();
J.OMNI.Aliased.Game_System = new Map();
J.OMNI.Aliased.JABS_Engine = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.OMNI.RegExp = {};
J.OMNI.RegExp.HideFromMonsterpedia = /<hideFromMonsterpedia>/i;
J.OMNI.RegExp.MonsterpediaFamilyIcon = /<monsterFamilyIcon:[ ]?(\d+)>/i;
J.OMNI.RegExp.MonsterpediaRegion = /<region:[ ]?([\w\s.?!,'"]+)>/i;
J.OMNI.RegExp.MonsterpediaDescription = /<descriptionLine:[ ]?([\w\s.?!,'"]+)>/i;
//#endregion Metadata