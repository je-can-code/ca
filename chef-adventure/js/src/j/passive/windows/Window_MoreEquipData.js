//region Window_MoreEquipData
/**
 * Extends {@link #addJabsEquipmentData}.
 * Includes additional entries about passive states provided by the equipment.
 */
J.PASSIVE.Aliased.Window_MoreEquipData.set('addJabsEquipmentData', Window_MoreEquipData.prototype.addJabsEquipmentData);
Window_MoreEquipData.prototype.addJabsEquipmentData = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Window_MoreEquipData.get('addJabsEquipmentData').call(this);

  // also add the passive state data.
  this.addPassiveStateData();
}

/**
 * Adds all passive states found across the item.
 */
Window_MoreEquipData.prototype.addPassiveStateData = function()
{
  // do not process if we are not allowed to.
  if (!this.canAddPassiveStateData()) return;

  // grab all the equipped passive state ids.
  const stackablePassiveIds = this.item.equippedPassiveStateIds;
  const uniquePassiveIds = this.item.uniqueEquippedPassiveStateIds;

  // combine the two groups of ids.
  const allIds = [...stackablePassiveIds, ...uniquePassiveIds].sort();

  // an iterator function for rendering a command based on the passive state id.
  const forEacher = passiveStateId =>
  {
    // extract the data from the state.
    const state = this.actor.state(passiveStateId);
    const { name, iconIndex } = state;

    // define the name of the command.
    const commandName = `Passive: ${name}`;

    // build the command with the data.
    const command = new WindowCommandBuilder(commandName)
      .setIconIndex(iconIndex)
      .setExtensionData(state)
      .build();

    // add the built command to the list.
    this.addBuiltCommand(command);
  };

  // render all the commands based on the ids.
  allIds.forEach(forEacher, this);
};

/**
 * Determines whether or not the passive state data for this item can be added.
 * @returns {boolean} True if allowed, false otherwise.
 */
Window_MoreEquipData.prototype.canAddPassiveStateData = function()
{
  // if there is no item to render, then do not render the passive states.
  if (!this.item) return false;

  // render the passive data!
  return true;
};
//endregion Window_MoreEquipData