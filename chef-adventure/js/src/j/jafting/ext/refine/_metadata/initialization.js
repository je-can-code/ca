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

  // Check to ensure we have the minimum required version of the J-JAFTING plugin.
  const requiredJaftingVersion = '2.0.0';
  const hasJaftingRequirement = J.BASE.Helpers.satisfies(J.JAFTING.Metadata.Version, requiredJaftingVersion);
  if (!hasJaftingRequirement)
  {
    throw new Error(`Either missing J-JAFTING or has a lower version than the required: ${requiredJaftingVersion}`);
  }
})();
//#endregion version check

/**
 * A helpful mapping of the various messages that we use in JAFTING.
 */
J.JAFTING.Messages = {
  /**
   * The name of the command for Refinement on the JAFTING mode menu.
   */
  RefineCommandName: "Refine",

  /**
   * The name of the command that executes refinement.
   */
  ExecuteRefinementCommandName: "Execute Refinement",

  /**
   * The name of the command that cancels the refinement process.
   */
  CancelRefinementCommandName: "Cancel",

  /**
   * When an item hasn't been selected somehow, this message shows in the help window.
   */
  NoItemSelected: "Nothing is selected.",

  /**
   * When the item being hovered over cannot be used in refinement as a base, show this.
   */
  CannotUseAsBase: "This cannot be used as a base for refinement.",

  /**
   * When the item being hovered over cannot be used in refinement as a material, show this.
   */
  CannotUseAsMaterial: "This cannot be used as a material for refinement.",

  /**
   * When the list window is the selection of a base to refine, this shows up in the mini window.
   */
  ChooseRefinementBase: "Choose Refinement Base",

  /**
   * When the list window is the selection of a material to add, this shows up in the mini window.
   */
  ChooseRefinementMaterial: "Choose Material to Add",

  /**
   * When a material has no traits, this message shows up in the help window.
   */
  NoTraitsOnMaterial: "This material has no traits to refine the base with.",

  /**
   * When the refinement would result in going over the base's max refine count, this shows up.
   */
  ExceedRefineCount: "Refining with this would result in exceeding refine count max:",

  /**
   * When the refinement would result in going over the base's max trait count, this shows up.
   */
  ExceedTraitCount: "Refining with this would result in exceeding trait count max:",

  /**
   * When the player hovers over an equip that has already reached it's max refine count, this shows up.
   */
  AlreadyMaxRefineCount: "This has already been refined the maximum number of times.",

  /**
   * When the player hovers over an equip that has already reached it's max trait count, this shows up.
   */
  AlreadyMaxTraitCount: "This has already been refined with as many traits as it can hold.",

  /**
   * This shows up over the base equip during refinement.
   */
  TitleBase: "Refinement Base",

  /**
   * This shows up over the material equip during refinement.
   */
  TitleMaterial: "Refinement Material",

  /**
   * This shows up over the output equip during refinement.
   */
  TitleOutput: "Refinement Output",

  /**
   * Shown when a material is disabled because it has no traits to grant the base equip.
   */
  NoTransferableTraits: "No transferable traits.",
};

/**
 * A helpful mapping of all the various RMMZ classes being extended.
 */
J.JAFTING.Aliased = {
  ...J.JAFTING.Aliased,
  Game_Item: {},
  Window_JaftingModeMenu: {},
};

/**
 * A global object for storing data related to JAFTING.
 * @global
 * @type {Game_JAFTING}
 */
var $gameJAFTING = null;

/**
 * Plugin command for hiding the refinement option in the JAFTING mode selection window.
 */
PluginManager.registerCommand(`${J.JAFTING.Metadata.Name}-Refinement`, "hideJaftingRefinement", () =>
{
  $gameJAFTING.hideRefinement();
});

/**
 * Plugin command for showing the refinement option in the JAFTING mode selection window.
 */
PluginManager.registerCommand(`${J.JAFTING.Metadata.Name}-Refinement`, "showJaftingRefinement", () =>
{
  $gameJAFTING.showRefinement();
});

/**
 * Plugin command for disabling the refinement option in the JAFTING mode selection window.
 */
PluginManager.registerCommand(`${J.JAFTING.Metadata.Name}-Refinement`, "disableJaftingRefinement", () =>
{
  $gameJAFTING.disableRefinement();
});

/**
 * Plugin command for enabling the refinement option in the JAFTING mode selection window.
 */
PluginManager.registerCommand(`${J.JAFTING.Metadata.Name}-Refinement`, "enableJaftingRefinement", () =>
{
  $gameJAFTING.enableRefinement();
});
//#endregion Introduction