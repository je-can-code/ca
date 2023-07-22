//region Scene_Equip
/**
 * Extends {@link #executeEquipChange}.
 * Also refreshes all natural parameter data.
 */
J.NATURAL.Aliased.Scene_Equip.set('executeEquipChange', Scene_Equip.prototype.executeEquipChange);
Scene_Equip.prototype.executeEquipChange = function() 
{
  // perform original logic.
  J.NATURAL.Aliased.Scene_Equip.get('executeEquipChange').call(this);

  // refresh the actor's parameter buffs after changing equips.
  this.actor().refreshAllParameterBuffs();
};
//endregion Scene_Equip