//region Game_Switches
/**
 * Extends {@link #onChange}.
 * Also refreshes the JABS menu when a switch is toggled.
 */
J.ABS.Aliased.Game_Switches.set('onChange', Game_Switches.prototype.onChange);
Game_Switches.prototype.onChange = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Switches.get('onChange').call(this);

  // also refresh the JABS menu.
  $jabsEngine.requestJabsMenuRefresh = true;
};
//endregion Game_Switches