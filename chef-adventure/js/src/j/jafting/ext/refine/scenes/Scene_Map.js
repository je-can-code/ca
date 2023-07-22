//region Scene_Map
//region window initialization
/**
 * Extends the initialization of the JAFTING menu to include the refinment windows.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.initJaftingMenu = Scene_Map.prototype.initJaftingMenu;
Scene_Map.prototype.initJaftingMenu = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.initJaftingMenu.call(this);

  // create empty refinement windows.
  this._j._jaftingMenu._refinePrimaryEquipWindow = null;
  this._j._jaftingMenu._refineSecondaryEquipWindow = null;
  this._j._jaftingMenu._refineProjectedResultsWindow = null;
  this._j._jaftingMenu._refineGuidingWindow = null;
  this._j._jaftingMenu._refineConfirmationWindow = null;

  // create empty slots for target and material equipment.
  this._j._jaftingMenu._refinePrimarySlot = null;
  this._j._jaftingMenu._refineSecondarySlot = null;
  this._j._jaftingMenu._refineHoverForDetails = null;
  this._j._jaftingMenu._refineProjectedOutput = null;
};

/**
 * Extends the creation of the JAFTING windows to include the refinement windows.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.createJaftingMenu = Scene_Map.prototype.createJaftingMenu;
Scene_Map.prototype.createJaftingMenu = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.createJaftingMenu.call(this);
  this.createJaftingRefinementModeWindows();
};

/**
 * Creates the mode selection window used to determine which type of JAFTING
 * that the player will perform.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.createJaftingModeWindow = Scene_Map.prototype.createJaftingModeWindow;
Scene_Map.prototype.createJaftingModeWindow = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.createJaftingModeWindow.call(this);
  this._j._jaftingMenu._modeWindow.setHandler('refine-mode', this.chooseJaftingRefineMode.bind(this));
};

/**
 * The actions to perform when selecting the "refinement" mode.
 * Opens up the equipment-only window for picking a base item to refine further.
 */
Scene_Map.prototype.chooseJaftingRefineMode = function()
{
  this.setWindowFocus("refine-primary");
  this.setGuidingWindowText(J.JAFTING.EXT.REFINE.Messages.ChooseRefinementBase);
};

/**
 * Initializes all the windows for use in refinement mode.
 */
Scene_Map.prototype.createJaftingRefinementModeWindows = function()
{
  this.createJaftingRefinementPrimaryEquipWindow();
  this.createJaftingRefinementSecondaryEquipWindow();
  this.createJaftingRefinementProjectedResultsWindow();
  this.createJaftingRefinementGuidingWindow();
  this.createJaftingRefinementConfirmationWindow();
};

/**
 * Creates the "choose refinement target" window.
 */
Scene_Map.prototype.createJaftingRefinementPrimaryEquipWindow = function()
{
  const w = 350;
  const h = Graphics.height - this._j._jaftingMenu._helpWindow.height - 72;
  const x = 0;
  const y = this._j._jaftingMenu._helpWindow.height + 64;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingEquip(rect);
  wind.isPrimary = true;
  wind.setHandler('cancel', this.closeJaftingWindow.bind(this, "refine-primary"));
  wind.setHandler('refine-object', this.choosePrimaryEquip.bind(this));
  this._j._jaftingMenu._refinePrimaryEquipWindow = wind;
  this._j._jaftingMenu._refinePrimaryEquipWindow.close();
  this._j._jaftingMenu._refinePrimaryEquipWindow.hide();
  this.addWindow(this._j._jaftingMenu._refinePrimaryEquipWindow);
};

/**
 * Creates the "choose refinement materials" window.
 */
Scene_Map.prototype.createJaftingRefinementSecondaryEquipWindow = function()
{
  const w = 350;
  const h = Graphics.height - this._j._jaftingMenu._helpWindow.height - 72;
  const x = 0;
  const y = this._j._jaftingMenu._helpWindow.height + 64;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingEquip(rect);
  wind.setHandler('cancel', this.closeJaftingWindow.bind(this, "refine-secondary"));
  wind.setHandler('refine-object', this.chooseSecondaryEquip.bind(this));
  this._j._jaftingMenu._refineSecondaryEquipWindow = wind;
  this._j._jaftingMenu._refineSecondaryEquipWindow.close();
  this._j._jaftingMenu._refineSecondaryEquipWindow.hide();
  this.addWindow(this._j._jaftingMenu._refineSecondaryEquipWindow);
};

/**
 * Creates the projected results window for the refinement process.
 */
Scene_Map.prototype.createJaftingRefinementProjectedResultsWindow = function()
{
  const w = this._j._jaftingMenu._helpWindow.width - (this._j._jaftingMenu._refinePrimaryEquipWindow.width);
  const h = Graphics.height - this._j._jaftingMenu._helpWindow.height - 8;
  const x = this._j._jaftingMenu._recipeListWindow.width;
  const y = this._j._jaftingMenu._helpWindow.height;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingRefinementOutput(rect);
  this._j._jaftingMenu._refineProjectedResultsWindow = wind;
  this._j._jaftingMenu._refineProjectedResultsWindow.close();
  this._j._jaftingMenu._refineProjectedResultsWindow.hide();
  this.addWindow(this._j._jaftingMenu._refineProjectedResultsWindow);
};

/**
 * Creates a small window to show some text above the equipment select list.
 * Guides the player with text like "Choose Refinement Base".
 */
Scene_Map.prototype.createJaftingRefinementGuidingWindow = function()
{
  const w = 350;
  const h = 64;
  const x = 0;
  const y = this._j._jaftingMenu._helpWindow.height;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_Help(rect);
  this._j._jaftingMenu._refineGuidingWindow = wind;
  this._j._jaftingMenu._refineGuidingWindow.close();
  this._j._jaftingMenu._refineGuidingWindow.hide();
  this.addWindow(this._j._jaftingMenu._refineGuidingWindow);
};

/**
 * Creates a window that acts as a safety net in case the player was mashing buttons.
 * Requires confirmation to execute a refinement and potentially losing an equip forever.
 */
Scene_Map.prototype.createJaftingRefinementConfirmationWindow = function()
{
  const w = 350;
  const h = 120;
  const x = (Graphics.boxWidth - w) / 2;
  const y = (Graphics.boxHeight - h) / 2;
  const rect = new Rectangle(x, y, w, h);
  this._j._jaftingMenu._refineConfirmationWindow = new Window_JaftingRefinementConfirmation(rect);
  this._j._jaftingMenu._refineConfirmationWindow.setHandler('ok', this.onRefineConfirm.bind(this));
  this._j._jaftingMenu._refineConfirmationWindow.setHandler('cancel', this.onRefineCancel.bind(this));
  this._j._jaftingMenu._refineConfirmationWindow.hide();
  this.addWindow(this._j._jaftingMenu._refineConfirmationWindow);
};
//endregion window initialization

/**
 * When a refinement target is selected, perform this logic.
 */
Scene_Map.prototype.choosePrimaryEquip = function()
{
  this.setPrimaryRefineSlot(this.getHoverForDetails().data);
  this.setGuidingWindowText(J.JAFTING.EXT.REFINE.Messages.ChooseRefinementMaterial);
  this.setWindowFocus("refine-secondary");
};

/**
 * When a refinement material is selected, perform this logic.
 */
Scene_Map.prototype.chooseSecondaryEquip = function()
{
  this.setSecondaryRefineSlot(this.getHoverForDetails().data);
  this.setWindowFocus("refine-confirm");
};

/**
 * When the player confirms they want to refine, then execute refinement!
 */
Scene_Map.prototype.onRefineConfirm = function()
{
  this.executeRefinement();
  this.closeJaftingWindow("refine-confirm-okay");
};

/**
 * If the player cancels the refinement, return back to the material selection.
 */
Scene_Map.prototype.onRefineCancel = function()
{
  this.closeJaftingWindow("refine-confirm-cancel");
};

/**
 * Executes the refinement, including removing old equips, creating the new equip, and refreshing.
 */
Scene_Map.prototype.executeRefinement = function()
{
  this.removeRefinementEquips();
  this.generateRefinementOutput();
  this.refreshJafting();
};

/**
 * Removes the two equips used to perform the refinement from the player's inventory.
 */
Scene_Map.prototype.removeRefinementEquips = function()
{
  $gameParty.gainItem(this.getPrimaryRefineSlot(), -1);
  $gameParty.gainItem(this.getSecondaryRefineSlot(), -1);
};

/**
 * Generates the equip and adds it to the player's inventory.
 */
Scene_Map.prototype.generateRefinementOutput = function()
{
  $gameJAFTING.createRefinedOutput(this._j._jaftingMenu._refineProjectedResultsWindow.outputEquip);
};

/**
 * Gets the projected result of refinement.
 * @returns {RPG_EquipItem}
 */
Scene_Map.prototype.getRefinementProjectedResult = function()
{
  return this._j._jaftingMenu._refineProjectedOutput;
};

/**
 * Sets the projected result of refinement to the designated equip.
 * @param {RPG_EquipItem} output The equip to set as the projected result.
 */
Scene_Map.prototype.setRefinementProjectedResult = function(output)
{
  this._j._jaftingMenu._refineProjectedOutput = output;
};

/**
 * Gets the object that is "being hovered over" in the equip lists.
 * @returns {RPG_EquipItem}
 */
Scene_Map.prototype.getHoverForDetails = function()
{
  return this._j._jaftingMenu._refineHoverForDetails;
};

/**
 * Sets the object that is "being hovered over" in the equip lists.
 * @param {RPG_EquipItem} equip The equip to set for viewing in the output window.
 */
Scene_Map.prototype.setHoverForDetails = function(equip)
{
  this._j._jaftingMenu._refineHoverForDetails = equip;
};

/**
 * Sets the given equipment to the primary refinement slot.
 * @param {RPG_EquipItem} equip The equip to set the primary refinement slot to.
 */
Scene_Map.prototype.setPrimaryRefineSlot = function(equip)
{
  this._j._jaftingMenu._refinePrimarySlot = equip;
  this._j._jaftingMenu._refineProjectedResultsWindow.primaryEquip = equip;

  // also assign the same thing to the secondary window to prevent using the same item twice.
  this._j._jaftingMenu._refineSecondaryEquipWindow.baseSelection = equip;
  this._j._jaftingMenu._refineSecondaryEquipWindow.refresh();
};

/**
 * Gets the equipment in the primary refinement slot.
 * @returns {RPG_EquipItem}
 */
Scene_Map.prototype.getPrimaryRefineSlot = function()
{
  return this._j._jaftingMenu._refinePrimarySlot;
};

/**
 * Sets the given equipment to the secondary refinement slot.
 * @param {RPG_EquipItem} equip The equip to set the primary refinement slot to.
 */
Scene_Map.prototype.setSecondaryRefineSlot = function(equip)
{
  this._j._jaftingMenu._refineSecondarySlot = equip;
  this._j._jaftingMenu._refineProjectedResultsWindow.secondaryEquip = equip;
};

/**
 * Gets the equipment in the secondary refinement slot.
 * @returns {RPG_EquipItem}
 */
Scene_Map.prototype.getSecondaryRefineSlot = function()
{
  return this._j._jaftingMenu._refineSecondarySlot;
};

/**
 * Sets the text in the refinement guiding window.
 * @param {string} text The text to display in the guiding window.
 */
Scene_Map.prototype.setGuidingWindowText = function(text)
{
  this._j._jaftingMenu._refineGuidingWindow.setText(text);
};

/**
 * Refreshes all windows that could possibly require refreshing when requested.
 * As an example, if the player gains/loses an item, all windows will need refreshing
 * to reflect the change in quantity.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.refreshJafting = Scene_Map.prototype.refreshJafting;
Scene_Map.prototype.refreshJafting = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.refreshJafting.call(this);
  this._j._jaftingMenu._refinePrimaryEquipWindow.refresh();
  this._j._jaftingMenu._refineSecondaryEquipWindow.refresh();
  this._j._jaftingMenu._refineProjectedResultsWindow.refresh();
};

/**
 * Extends the jafting window focus management to accommodate refinement mode.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.manageJaftingMenu = Scene_Map.prototype.manageJaftingMenu;
Scene_Map.prototype.manageJaftingMenu = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.manageJaftingMenu.call(this);

  // extend for refinement focuses.
  switch (this.getWindowFocus())
  {
    case "refine-primary":
      this.toggleJaftingModeWindow(false);
      this.toggleJaftingRefinePrimaryWindow(true);
      this.toggleJaftingRefineSecondaryWindow(false);
      this.toggleJaftingRefineOutputWindow(true);
      this.toggleJaftingRefineGuidingWindow(true);
      this.determineRefinementHelpWindowText();
      break;
    case "refine-secondary":
      this.toggleJaftingRefinePrimaryWindow(false);
      this.toggleJaftingRefineSecondaryWindow(true);
      this.toggleJaftingRefineOutputWindow(true);
      this.determineRefinementHelpWindowText();
      break;
    case "refine-confirm":
      this.toggleJaftingRefineConfirmationWindow(true);
      break;
  }
};

/**
 * Extends the jafting window closing-by-tag function to accommodate refinement mode.
 * @param {string} jaftingWindowToClose The type of window we're closing.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.closeJaftingWindow = Scene_Map.prototype.closeJaftingWindow;
Scene_Map.prototype.closeJaftingWindow = function(jaftingWindowToClose)
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.closeJaftingWindow.call(this, jaftingWindowToClose);
  switch (jaftingWindowToClose)
  {
    case "refine-primary":
      this.setPrimaryRefineSlot(null);
      this.setHoverForDetails(null);
      this.toggleJaftingRefinePrimaryWindow(false);
      this.toggleJaftingRefineOutputWindow(false);
      this.toggleJaftingModeWindow(true);
      this.setGuidingWindowText("");
      this.toggleJaftingRefineGuidingWindow(false);
      this.toggleJaftingRefineConfirmationWindow(false);
      this.setWindowFocus("main");
      break;
    case "refine-secondary":
      this.setSecondaryRefineSlot(null);
      this.setHoverForDetails(null);
      this.toggleJaftingRefineSecondaryWindow(false);
      this.setGuidingWindowText(J.JAFTING.EXT.REFINE.Messages.ChooseRefinementBase);
      this.toggleJaftingRefineConfirmationWindow(false);
      this.setWindowFocus("refine-primary");
      break;
    case "refine-confirm-okay":
      this.toggleJaftingRefineConfirmationWindow(false);
      this.setPrimaryRefineSlot(null);
      this.setSecondaryRefineSlot(null);
      this.setHoverForDetails(null);
      this.setGuidingWindowText(J.JAFTING.EXT.REFINE.Messages.ChooseRefinementBase);
      this.setWindowFocus("refine-primary");
      break;
    case "refine-confirm-cancel":
      this.toggleJaftingRefineConfirmationWindow(false);
      this.setWindowFocus("refine-secondary");
      break;
  }
};

/**
 * Sets the text of the help window for the mode selection based on
 * the currently selected category.
 */
Scene_Map.prototype.determineRefinementHelpWindowText = function()
{
  if (this._j._jaftingMenu._refinePrimaryEquipWindow.active)
  {
    this.drawRefinementPrimaryHelpWindowText()
  }
  else if (this._j._jaftingMenu._refineSecondaryEquipWindow.active)
  {
    this.drawRefinementSecondaryHelpWindowText();
  }

  // draws the help text based on the hovered item.
  this.drawRefineHelpText();
};

/**
 * Handles the help window text during refinement when the target is being selected.
 */
Scene_Map.prototype.drawRefinementPrimaryHelpWindowText = function()
{
  const index = this._j._jaftingMenu._refinePrimaryEquipWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._refinePrimaryEquipWindow.currentIndex) return;

  this.setRefinementProjectedResult(null);

  // sets the currently hovered over equipItem for the help and output windows.
  const hoveredOver = this._j._jaftingMenu._refinePrimaryEquipWindow.currentExt();
  if (!hoveredOver?.data) return;

  this.setHoverForDetails(hoveredOver);
  this._j._jaftingMenu._refinePrimaryEquipWindow.currentIndex = index;
  this._j._jaftingMenu._refineProjectedResultsWindow.primaryEquip = hoveredOver.data;
};

/**
 * Handles the help window text during refinement when the material is being selected.
 */
Scene_Map.prototype.drawRefinementSecondaryHelpWindowText = function()
{
  const index = this._j._jaftingMenu._refineSecondaryEquipWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._refineSecondaryEquipWindow.currentIndex) return;

  // sets the currently hovered over equipItem for the help and output windows.
  const hoveredOver = this._j._jaftingMenu._refineSecondaryEquipWindow.currentExt();
  if (!hoveredOver?.data) return;

  this.setHoverForDetails(hoveredOver);

  this._j._jaftingMenu._refineSecondaryEquipWindow.currentIndex = index;
  this._j._jaftingMenu._refineProjectedResultsWindow.secondaryEquip = hoveredOver.data;
};

/**
 * Draws the actual text into the top help window.
 */
Scene_Map.prototype.drawRefineHelpText = function()
{
  const item = this.getHoverForDetails();
  if (item && item.data)
  {
    if (item.data.jaftingNotRefinementBase && this._j._jaftingMenu._refinePrimaryEquipWindow.active)
    {
      this._j._jaftingMenu._helpWindow.setText(J.JAFTING.EXT.REFINE.Messages.CannotUseAsBase);
    }
    else if (item.data.jaftingNotRefinementMaterial && this._j._jaftingMenu._refineSecondaryEquipWindow.active)
    {
      this._j._jaftingMenu._helpWindow.setText(J.JAFTING.EXT.REFINE.Messages.CannotUseAsMaterial);
    }
    else if (item.error !== "")
    {
      this._j._jaftingMenu._helpWindow.setText(item.error);
    }
    else
    {
      this._j._jaftingMenu._helpWindow.setItem(item.data);
    }
  }
  else
  {
    this._j._jaftingMenu._helpWindow.setText(J.JAFTING.EXT.REFINE.Messages.NoItemSelected);
  }
};

/**
 * Toggles the visibility for the refinement target selection while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefinePrimaryWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refinePrimaryEquipWindow.show();
    this._j._jaftingMenu._refinePrimaryEquipWindow.open();
    this._j._jaftingMenu._refinePrimaryEquipWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refinePrimaryEquipWindow.close();
    this._j._jaftingMenu._refinePrimaryEquipWindow.hide();
    this._j._jaftingMenu._refinePrimaryEquipWindow.deactivate();
    this._j._jaftingMenu._refinePrimaryEquipWindow.forceSelect(0);
    this._j._jaftingMenu._refinePrimaryEquipWindow.currentIndex = null;
  }
};

/**
 * Toggles the visibility for the refinement material selection while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefineSecondaryWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refineSecondaryEquipWindow.show();
    this._j._jaftingMenu._refineSecondaryEquipWindow.open();
    this._j._jaftingMenu._refineSecondaryEquipWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refineSecondaryEquipWindow.close();
    this._j._jaftingMenu._refineSecondaryEquipWindow.hide();
    this._j._jaftingMenu._refineSecondaryEquipWindow.deactivate();
    this._j._jaftingMenu._refineSecondaryEquipWindow.forceSelect(0);
    this._j._jaftingMenu._refineSecondaryEquipWindow.currentIndex = null;
  }
};

/**
 * Toggles the visibility for the refinement output window while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefineOutputWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refineProjectedResultsWindow.show();
    this._j._jaftingMenu._refineProjectedResultsWindow.open();
    this._j._jaftingMenu._refineProjectedResultsWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refineProjectedResultsWindow.close();
    this._j._jaftingMenu._refineProjectedResultsWindow.hide();
    this._j._jaftingMenu._refineProjectedResultsWindow.deactivate();
  }
};

/**
 * Toggles the visibility for the refinement help window while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefineGuidingWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refineGuidingWindow.show();
    this._j._jaftingMenu._refineGuidingWindow.open();
    this._j._jaftingMenu._refineGuidingWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refineGuidingWindow.close();
    this._j._jaftingMenu._refineGuidingWindow.hide();
    this._j._jaftingMenu._refineGuidingWindow.deactivate();
  }
};

/**
 * Toggles the visibility for the refinement confirmation window while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefineConfirmationWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refineConfirmationWindow.show();
    this._j._jaftingMenu._refineConfirmationWindow.open();
    this._j._jaftingMenu._refineConfirmationWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refineConfirmationWindow.close();
    this._j._jaftingMenu._refineConfirmationWindow.hide();
    this._j._jaftingMenu._refineConfirmationWindow.deactivate();
  }
};
//endregion Scene_Map