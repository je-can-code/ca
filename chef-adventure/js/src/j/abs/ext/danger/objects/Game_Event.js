//region Game_Event
/**
 * Extends the binding of core battler data to the event.
 * Adds the danger indicator data to the core battler data.
 * @param {JABS_BattlerCoreData|null} battlerCoreData The core data of this battler.
 */
J.ABS.EXT.DANGER.Aliased.Game_Event.set('initializeCoreData', Game_Event.prototype.initializeCoreData);
Game_Event.prototype.initializeCoreData = function(battlerCoreData)
{
  // localize the variable to avoid reassigning the parameter.
  let localBattlerCoreData = battlerCoreData;

  // check to make sure the core data isn't null.
  if (battlerCoreData !== null)
  {
    // update the core data with the danger indicator.
    localBattlerCoreData = this.updateWithDangerIndicator(battlerCoreData);
  }

  // perform original logic, potentially with the modified core data.
  J.ABS.EXT.DANGER.Aliased.Game_Event.get('initializeCoreData').call(this, localBattlerCoreData);
};

/**
 * Updates the battler core data with the show danger indicator information.
 * @param {JABS_BattlerCoreData} battlerCoreData The core data of this battler.
 */
Game_Event.prototype.updateWithDangerIndicator = function(battlerCoreData)
{
  // determine whether or not to show the indicator.
  const showDangerIndicator = this.canShowDangerIndicator(battlerCoreData.battlerId());

  // assign the above determined boolean.
  battlerCoreData.setDangerIndicator(showDangerIndicator);

  // return the modified core data.
  return battlerCoreData;
};

/**
 * Gets whether or not to show the danger indicator on this battler.
 * @param {number} battlerId The id of the battler to check.
 * @returns {boolean} True if we should show the indicator, false otherwise.
 */
Game_Event.prototype.canShowDangerIndicator = function(battlerId)
{
  //TODO: add equipment that can hide/show the danger indicator?

  // start with the default of whether or not to show the danger indicator.
  let showDangerIndicator = $gameEnemies.enemy(battlerId).showDangerIndicator();

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then it must be false.
  if (!commentCommands.length) return showDangerIndicator;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const comment = command.parameters[0];

    // if we are explicitly saying to hide it, then hide it.
    if (/<noDangerIndicator>/i.test(comment))
    {
      showDangerIndicator = false;
    }
    // if we explicitly saying to show it, then show it.
    else if (/<showDangerIndicator>/i.test(comment))
    {
      showDangerIndicator = true;
    }
  });

  // return whether or not to show the danger indicator.
  return showDangerIndicator;
};
//endregion Game_Event