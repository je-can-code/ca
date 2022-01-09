//#region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 HUD-INPUT] A HUD frame that displays your leader's buttons data.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-HUD
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * This plugin is an extension of the J-HUD system.
 *
 * This is the Input Frame, which displays the various action keys and their
 * corresponding cooldown and cost data points for the leader of the party.
 *
 * This includes the following data points for the currently selected leader:
 * - main and offhand action keys
 * - tool and dodge action keys
 * - R1 + A/B/X/Y action keys
 * - L1 + A/B/X/Y action keys
 * - ability costs for all action keys, or item count remaining for tool.
 *
 * Optionally, this can instead be displayed in a keyboard layout.
 * ============================================================================
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

//#region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.HUD.EXT_INPUT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT_INPUT = {};
J.HUD.EXT_INPUT.Metadata = {};
J.HUD.EXT_INPUT.Metadata.Version = '1.0.0';
J.HUD.EXT_INPUT.Metadata.Name = `J-HUD-InputFrame`;

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT_INPUT.Aliased = {
  Scene_Map: new Map(),
};
//#endregion metadata

//#region plugin commands
/**
 * Plugin command for hiding the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "hideHud", () =>
{
  $hudManager.requestHideHud();
});

/**
 * Plugin command for showing the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "showHud", () =>
{
  $hudManager.requestShowHud();
});

/**
 * Plugin command for hiding allies in the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "hideAllies", () =>
{
  $hudManager.requestHideAllies();
});

/**
 * Plugin command for showing allies in the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "showAllies", () =>
{
  $hudManager.requestShowAllies();
});

/**
 * Plugin command for refreshing the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "refreshHud", () =>
{
  $hudManager.requestRefreshHud();
});

/**
 * Plugin command for refreshing the hud's image cache.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "refreshImageCache", () =>
{
  $hudManager.requestRefreshImageCache();
});
//#endregion plugin commands

//#endregion introduction

//#region Scene objects
//#region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.EXT_INPUT.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.EXT_INPUT.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * All encompassing _j object for storing this plugin's properties.
   * @type {{}}
   * @private
   */
  this._j ||= {};

  /**
   * The input frame window on the map.
   * @type {Window_InputFrame}
   */
  this._j._inputFrame = null;
};

/**
 * Creates the log window and adds it to tracking.
 */
Scene_Map.prototype.createMapHud = function()
{
  // create the rectangle of the window.
  const rect = this.inputFrameWindowRect();

  // assign the window to our reference.
  this._j._inputFrame = new Window_InputFrame(rect);

  // add window to tracking.
  this.addWindow(this._j._inputFrame);
};

/**
 * Creates the rectangle representing the window for the map hud.
 * @returns {Rectangle}
 */
Scene_Map.prototype.inputFrameWindowRect = function()
{
  const width = 320;
  const height = 290;
  const x = 0;
  const y = 0;
  return new Rectangle(x, y, width, height);
};

/**
 * Extend the update loop for the input frame.
 */
J.HUD.EXT_INPUT.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT_INPUT.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages hud refreshes.
  this.handleInputFrameUpdate();
};

Scene_Map.prototype.handleInputFrameUpdate = function()
{
};

//ENDOFFILE