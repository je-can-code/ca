//#region Window_AbsMenuSelect
/**
 * Extends the initialization to include the actor id for ai management.
 */
J.ALLYAI.Aliased.Window_AbsMenuSelect.initialize = Window_AbsMenuSelect.prototype.initialize;
Window_AbsMenuSelect.prototype.initialize = function(rect, type)
{
  J.ALLYAI.Aliased.Window_AbsMenuSelect.initialize.call(this, rect, type);
  this._j._chosenActorId = 0;
};

/**
 * Sets the actor id assigned to this window.
 * @param {number} actorId The new actor id for this window.
 */
Window_AbsMenuSelect.prototype.setActorId = function(actorId)
{
  this._j._chosenActorId = actorId;
};

/**
 * Gets the actor id assigned to this window, if any.
 * @returns {number}
 */
Window_AbsMenuSelect.prototype.getActorId = function()
{
  return this._j._chosenActorId;
};

/**
 * Extends the JABS quick menu select to also handle ai management.
 */
J.ALLYAI.Aliased.Window_AbsMenuSelect.makeCommandList = Window_AbsMenuSelect.prototype.makeCommandList;
Window_AbsMenuSelect.prototype.makeCommandList = function()
{
  J.ALLYAI.Aliased.Window_AbsMenuSelect.makeCommandList.call(this);
  switch (this._j._menuType)
  {
    case "ai-party-list":
      this.makeAllyList();
      break;
    case "select-ai":
      this.makeAllyAiModeList();
      break;
  }
};

/**
 * Draws the list of available AI modes that an ally can use.
 */
Window_AbsMenuSelect.prototype.makeAllyList = function()
{
  const party = $gameParty.allMembers();
  party.forEach(member =>
  {
    this.addCommand(member.name(), "party-member", true, member.actorId());
  });

  const aggroPassiveCommandName = $gameParty.isAggro()
    ? J.ALLYAI.Metadata.PartyAiAggressiveText
    : J.ALLYAI.Metadata.PartyAiPassiveText;
  const aggroPassiveCommandIcon = $gameParty.isAggro()
    ? J.ALLYAI.Metadata.PartyAiAggressiveIconIndex
    : J.ALLYAI.Metadata.PartyAiPassiveIconIndex;
  this.addCommand(aggroPassiveCommandName, "aggro-passive-toggle", true, null, aggroPassiveCommandIcon);
};

/**
 * Draws the list of available AI modes that an ally can use.
 */
Window_AbsMenuSelect.prototype.makeAllyAiModeList = function()
{
  const currentActor = $gameActors.actor(this.getActorId());
  if (!currentActor) return;

  const modes = JABS_AllyAI.getModes();
  const currentAi = currentActor.getAllyAI();

  modes.forEach(mode =>
  {
    const isEquipped = currentAi.getMode().key === mode.key;
    const iconIndex = isEquipped
      ? J.ALLYAI.Metadata.AiModeEquippedIconIndex
      : J.ALLYAI.Metadata.AiModeNotEquippedIconIndex;
    this.addCommand(mode.name, "select-ai", true, mode, iconIndex);
  });
};
//#endregion Window_AbsMenuSelect