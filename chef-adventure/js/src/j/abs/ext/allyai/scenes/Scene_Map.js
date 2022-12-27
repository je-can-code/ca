//region Scene_Map
/**
 * Extends the JABS menu initialization to include the new ally ai management selection.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.initJabsMembers = Scene_Map.prototype.initJabsMembers;
Scene_Map.prototype.initJabsMembers = function()
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.initJabsMembers.call(this);
  this.initAllyAiSubmenu();
};

/**
 * Initializes the new windows for ally ai management.
 */
Scene_Map.prototype.initAllyAiSubmenu = function()
{
  this._j._absMenu._allyAiPartyWindow = null;
  this._j._absMenu._allyAiEquipWindow = null;
  this._j._absMenu._allyAiActorId = 0;
};

/**
 * Sets the chosen actor id to the provided id.
 * @param {number} chosenActorId The id of the chosen actor.
 */
Scene_Map.prototype.setAllyAiActorId = function(chosenActorId)
{
  this._j._absMenu._allyAiActorId = chosenActorId;
};

/**
 * Gets the chosen actor id.
 */
Scene_Map.prototype.getAllyAiActorId = function()
{
  return this._j._absMenu._allyAiActorId;
};

/**
 * Extends the JABS menu creation to include the new windows for ally ai management.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.createJabsAbsMenu = Scene_Map.prototype.createJabsAbsMenu;
Scene_Map.prototype.createJabsAbsMenu = function()
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.createJabsAbsMenu.call(this);
  this.createAllyAiPartyWindow();
  this.createAllyAiEquipWindow();
};

/**
 * Extends the JABS menu creation to include a new command handler for ally ai.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.createJabsAbsMenuMainWindow = Scene_Map.prototype.createJabsAbsMenuMainWindow;
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.createJabsAbsMenuMainWindow.call(this);
  this._j._absMenu._mainWindow.setHandler("ally-ai", this.commandManagePartyAi.bind(this));
};

/**
 * Creates the window that lists all active members of the party.
 */
Scene_Map.prototype.createAllyAiPartyWindow = function()
{
  const w = 400;
  const h = 250;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const aiPartyMenu = new Window_AbsMenuSelect(rect, "ai-party-list");
  aiPartyMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "ai-party-list"));
  aiPartyMenu.setHandler("party-member", this.commandSelectMemberAi.bind(this));
  aiPartyMenu.setHandler("aggro-passive-toggle", this.commandAggroPassiveToggle.bind(this));
  this._j._absMenu._allyAiPartyWindow = aiPartyMenu;
  this._j._absMenu._allyAiPartyWindow.close();
  this._j._absMenu._allyAiPartyWindow.hide();
  this.addWindow(this._j._absMenu._allyAiPartyWindow);
};

/**
 * Creates a window that lists all available ai modes that the chose ally can use.
 */
Scene_Map.prototype.createAllyAiEquipWindow = function()
{
  const w = 400;
  const h = 250;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const aiMemberMenu = new Window_AbsMenuSelect(rect, "select-ai");
  aiMemberMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "select-ai"));
  aiMemberMenu.setHandler("select-ai", this.commandEquipMemberAi.bind(this));
  this._j._absMenu._allyAiEquipWindow = aiMemberMenu;
  this._j._absMenu._allyAiEquipWindow.close();
  this._j._absMenu._allyAiEquipWindow.hide();
  this.addWindow(this._j._absMenu._allyAiEquipWindow);
};

/**
 * When the "manage ally ai" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandManagePartyAi = function()
{
  this._j._absMenu._windowFocus = "ai-party-list";
};

/**
 * When an individual party member is chosen, it prioritizes the AI mode selection window.
 */
Scene_Map.prototype.commandSelectMemberAi = function()
{
  this._j._absMenu._windowFocus = "select-ai";
  const actorId = this._j._absMenu._allyAiPartyWindow.currentExt();
  this.setAllyAiActorId(actorId);
  this._j._absMenu._allyAiEquipWindow.setActorId(actorId);
  this._j._absMenu._allyAiEquipWindow.refresh();
};

/**
 * Toggles the party-wide aggro/passive switch.
 * Passive switch will only target the leader's current target.
 * Aggro switch will enable full sight range and auto-engaging abilities.
 */
Scene_Map.prototype.commandAggroPassiveToggle = function()
{
  SoundManager.playRecovery();
  $gameParty.isAggro()
    ? $gameParty.becomePassive()
    : $gameParty.becomeAggro();
  this._j._absMenu._allyAiPartyWindow.refresh();
};

/**
 * When an ai mode is chosen, it replaces it for the actor.
 */
Scene_Map.prototype.commandEquipMemberAi = function()
{
  // grab the new ally AI mode from the window.
  const newMode = this._j._absMenu._allyAiEquipWindow.currentExt();

  // grab the current ally AI.
  const allyAi = $gameActors.actor(this.getAllyAiActorId()).getAllyAI();

  // change the mode of the AI to the new one by its key.
  allyAi.changeMode(newMode.key);

  // refresh the ally AI window to reflect the change.
  this._j._absMenu._allyAiEquipWindow.refresh();
};

/**
 * Manages the ABS main menu's interactivity.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.manageAbsMenu = Scene_Map.prototype.manageAbsMenu;
Scene_Map.prototype.manageAbsMenu = function()
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.manageAbsMenu.call(this);
  switch (this._j._absMenu._windowFocus)
  {
    case "ai-party-list":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._allyAiPartyWindow.show();
      this._j._absMenu._allyAiPartyWindow.open();
      this._j._absMenu._allyAiPartyWindow.activate();
      break;
    case "select-ai":
      this._j._absMenu._allyAiPartyWindow.hide();
      this._j._absMenu._allyAiPartyWindow.close();
      this._j._absMenu._allyAiPartyWindow.deactivate();
      this._j._absMenu._allyAiEquipWindow.show();
      this._j._absMenu._allyAiEquipWindow.open();
      this._j._absMenu._allyAiEquipWindow.activate();
      break;
  }
};

/**
 * Closes a given Abs menu window.
 * @param {string} absWindow The type of abs window being closed.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.closeAbsWindow = Scene_Map.prototype.closeAbsWindow;
Scene_Map.prototype.closeAbsWindow = function(absWindow)
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.closeAbsWindow.call(this, absWindow);
  switch (absWindow)
  {
    case "ai-party-list":
      this._j._absMenu._allyAiPartyWindow.hide();
      this._j._absMenu._allyAiPartyWindow.close();
      this._j._absMenu._allyAiPartyWindow.deactivate();
      this._j._absMenu._mainWindow.activate();
      this._j._absMenu._mainWindow.open();
      this._j._absMenu._mainWindow.show();
      this._j._absMenu._windowFocus = "main";
      break;
    case "select-ai":
      this._j._absMenu._allyAiEquipWindow.hide();
      this._j._absMenu._allyAiEquipWindow.close();
      this._j._absMenu._allyAiEquipWindow.deactivate();
      this._j._absMenu._allyAiPartyWindow.activate();
      this._j._absMenu._allyAiPartyWindow.open();
      this._j._absMenu._allyAiPartyWindow.show();
      this._j._absMenu._windowFocus = "ai-party-list";
      break;
  }
};
//endregion Scene_Map