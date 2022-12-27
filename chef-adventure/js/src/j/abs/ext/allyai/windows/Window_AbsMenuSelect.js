//region Window_AbsMenuSelect
/**
 * Extends the initialization to include the actor id for ai management.
 */
J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenuSelect.set('initialize', Window_AbsMenuSelect.prototype.initialize);
Window_AbsMenuSelect.prototype.initialize = function(rect, type)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenuSelect.get('initialize').call(this, rect, type);

  // TODO: init properly.
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
J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenuSelect.set('makeCommandList', Window_AbsMenuSelect.prototype.makeCommandList);
Window_AbsMenuSelect.prototype.makeCommandList = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenuSelect.get('makeCommandList').call(this);

  // pivot on the menu type.
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
  // an iterator function for building all the actor commands for changing ally AI.
  const forEacher = member =>
  {
    // build the command for this member of the party.
    const command = new WindowCommandBuilder(member.name())
      .setSymbol("party-member")
      .setExtensionData(member.actorId())
      .build();

    // add the built command to the list.
    this.addBuiltCommand(command);
  };

  // build all the commands.
  $gameParty.allMembers().forEach(forEacher, this);

  // define the icons for passive/aggressive ally AI aggro settings.
  const aggroPassiveCommandName = $gameParty.isAggro()
    ? J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveText
    : J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveText;
  const aggroPassiveCommandIcon = $gameParty.isAggro()
    ? J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveIconIndex
    : J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveIconIndex;

  // build the command for toggling ally AI aggro.
  const command = new WindowCommandBuilder(aggroPassiveCommandName)
    .setSymbol("aggro-passive-toggle")
    .setIconIndex(aggroPassiveCommandIcon)
    .build();

  // add the aggro toggle command.
  this.addBuiltCommand(command);
};

/**
 * Draws the list of available AI modes that an ally can use.
 */
Window_AbsMenuSelect.prototype.makeAllyAiModeList = function()
{
  // grab the currently selected actor.
  const currentActor = $gameActors.actor(this.getActorId());

  // if there is no actor, then there is no AI.
  if (!currentActor) return;

  // grab all available ally AI modes.
  const modes = JABS_AllyAI.getModes();

  // grab the currently selected AI.
  const currentAi = currentActor.getAllyAI();

  // an iterator function for building all ally AI modes as commands.
  const forEacher = mode =>
  {
    // extract some data from this ally AI mode.
    const { key, name } = mode;

    // check if the currently selected ally AI mode is this command.
    const isEquipped = currentAi.getMode() === key;

    // build the icon based on whether or not its equipped.
    const iconIndex = isEquipped
      ? J.ABS.EXT.ALLYAI.Metadata.AiModeEquippedIconIndex
      : J.ABS.EXT.ALLYAI.Metadata.AiModeNotEquippedIconIndex;

    // build the command.
    const command = new WindowCommandBuilder(name)
    .setSymbol("select-ai")
    .setIconIndex(iconIndex)
    .setExtensionData(mode)
    .build();

    // add the command to the list.
    this.addBuiltCommand(command);
  };

  // iterate over each mode and rebuild the commands.
  modes.forEach(forEacher, this);
};
//endregion Window_AbsMenuSelect