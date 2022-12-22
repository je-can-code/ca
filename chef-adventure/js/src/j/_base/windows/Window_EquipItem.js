//region Window_EquipItem
/**
 * Overwrites {@link #updateHelp}.
 * Enables extension of the method's logic for various menu needs.
 */
Window_EquipItem.prototype.updateHelp = function()
{
  // perform parent logic.
  Window_ItemList.prototype.updateHelp.call(this);

  // validate we can update the actor comparison data.
  if (this._actor && this._statusWindow && this._slotId >= 0)
  {
    // update the actor comparison.
    this.updateActorComparison();
  }
};

/**
 * Updates the actor comparison of the status window by duplicating the actor
 * and forcefully equipping it with the hovered item.
 */
Window_EquipItem.prototype.updateActorComparison = function()
{
  // duplicate the actor.
  const actorClone = this.getActorClone(this._actor);

  // perform setup before force-equipping the hovered item.
  this.preEquipSetupActorClone(actorClone);

  // force the duplicate actor to equip the hovered item.
  actorClone.forceChangeEquip(this._slotId, this.item());

  // perform setup after force-equipping the hovered item.
  this.postEquipSetupActorClone(actorClone);

  // update the status window with this new item.
  this._statusWindow.setTempActor(actorClone);
};

/**
 * Duplicates a given actor.
 *
 * The duplicate is not a real version of the {@link Game_Actor} class, but
 * will have access to its prototypical inheritance.
 * @param {Game_Actor} actorToCopy The actor to make a copy of.
 * @returns {Game_Actor} A non-referenced duplicate of the given actor.
 */
Window_EquipItem.prototype.getActorClone = function(actorToCopy)
{
  return JsonEx.makeDeepCopy(actorToCopy);
};

/**
 * A hook for performing logic on the clone of the actor for the status window.
 * This is fired before equipping the actor clone with the equipment.
 * @param {Game_Actor} actorClone The clone of the actor.
 */
// eslint-disable-next-line no-unused-vars
Window_EquipItem.prototype.preEquipSetupActorClone = function(actorClone)
{
};

/**
 * A hook for performing logic on the clone of the actor for the status window.
 * This is fired after equipping the actor clone with the equipment.
 * @param {Game_Actor} actorClone The clone of the actor.
 */
// eslint-disable-next-line no-unused-vars
Window_EquipItem.prototype.postEquipSetupActorClone = function(actorClone)
{
};
//endregion Window_EquipItem