//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * A menu rewrite.
 * @author JE
 * @url https://dev.azure.com/je-can-code/RPG%20Maker/_git/rmmz
 * @help
 * # Start of Help
 * 
 * # End of Help
 */

 /**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CMS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CMS.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-CMS-MainMenu`,

  /**
   * The version of this plugin.
   */
  Version: 1.00,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.CMS.PluginParameters = PluginManager.parameters(J.CMS.Metadata.Name);

class Scene_JCMS extends Scene_Base {
  constructor() {
    super();
  };
};

class Window_JCMS_Main extends Window_HorzCommand {
  constructor(rect) {
    super(rect);
    this.initialize(rect);
  };

  initialize(rect) {
    super.initialize(rect);
    // ...
  };

  makeCommandList() {
    // ...
  };
};