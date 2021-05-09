//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 JAFT-REFINE] Extends JAFTING to include refinement.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @base J-JAFTING
 * @orderAfter J-BASE
 * @orderAfter J-JAFTING
 * @help
 * ============================================================================
 * This is an extension of the JAFTING plugin to enable the ability to "refine"
 * equipment.
 * 
 * "Refinement" is defined as "transfering the traits of an item onto another".
 * This functionality's exclusive target is equipment.
 * ============================================================================
 * 
 * 
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() => {
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement) {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
 
  // Check to ensure we have the minimum required version of the J-JAFTING plugin.
  const requiredJaftingVersion = '2.0.0';
  const hasJaftingRequirement = J.BASE.Helpers.satisfies(J.JAFTING.Metadata.Version, requiredJaftingVersion);
  if (!hasJaftingRequirement) {
    throw new Error(`Either missing J-JAFTING or has a lower version than the required: ${requiredJaftingVersion}`);
  }
})();
//#endregion version check

/**
 * A helpful mapping of all the various RMMZ classes being extended.
 */
J.JAFTING.Aliased = {
  ...J.JAFTING.Aliased,
  Window_JaftingModeMenu: {},
};
//#endregion Introduction

//#region Window objects
//#region Window_JaftingModeMenu
J.JAFTING.Aliased.Window_JaftingModeMenu.makeCommandList = Window_JaftingModeMenu.prototype.makeCommandList;
Window_JaftingModeMenu.prototype.makeCommandList = function() {
  J.JAFTING.Aliased.Window_JaftingModeMenu.makeCommandList.call(this);
};
//#endregion Window_JaftingModeMenu
//#endregion Window objects