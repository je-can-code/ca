//region Window_EquipItem
/**
 * Extends {@link #postEquipSetupActorClone}.
 * Updates the buffs associated with the cloned actor so that it reflects in the
 * status window comparison.
 * @param {Game_Actor} actorClone The clone of the actor.
 */
J.NATURAL.Aliased.Window_EquipItem.set('postEquipSetupActorClone', Window_EquipItem.prototype.postEquipSetupActorClone);
Window_EquipItem.prototype.postEquipSetupActorClone = function(actorClone)
{
  actorClone.refreshAllParameterBuffs();
};
//endregion Window_EquipItem