//region Metadata
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
J.OMNI.Metadata.Version = '1.0.1';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.OMNI.PluginParameters = PluginManager.parameters(J.OMNI.Metadata.Name);

/**
 * The various data points that define the command for the Omnipedia.
 */
J.OMNI.Metadata.Command = {};
J.OMNI.Metadata.Command.Name = "The Omnipedia";
J.OMNI.Metadata.Command.Symbol = "omni-menu";
J.OMNI.Metadata.Command.IconIndex = 232;
J.OMNI.Metadata.Command.ColorIndex = 5;

/**
 * The id of the switch that will represent whether or not the command
 * should be visible in the JABS menu.
 * @type {number}
 */
J.OMNI.Metadata.InJabsMenuSwitch = 102;

/**
 * The id of the switch that will represent whether or not the command
 * should be visible in the main menu.
 * @type {number}
 */
J.OMNI.Metadata.InMainMenuSwitch = 102;

/**
 * A collection of all aliased methods for this plugin.
 */
J.OMNI.Aliased = {};
J.OMNI.Aliased.Game_Party = new Map();
J.OMNI.Aliased.Scene_Map = new Map();
J.OMNI.Aliased.Scene_Menu = new Map();
J.OMNI.Aliased.Window_AbsMenu = new Map();
J.OMNI.Aliased.Window_MenuCommand = new Map();
//endregion Metadata