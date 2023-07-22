//region JABS_Engine
J.ABS.EXT.INPUT.Aliased.JABS_Engine.set('performPartyCycling', JABS_Engine.prototype.performPartyCycling);
/**
 * Extends `performPartyCycling()` to include reassigning the controller to the player.
 */
JABS_Engine.prototype.performPartyCycling = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.JABS_Engine.get('performPartyCycling').call(this);

  // when the player party cycles, update their controls to the updated battler.
  $jabsController1.battler = this.getPlayer1();
};

/**
 * Handles the player input.
 */
J.ABS.EXT.INPUT.Aliased.JABS_Engine.set('updateInput', JABS_Engine.prototype.updateInput);
JABS_Engine.prototype.updateInput = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.JABS_Engine.get('updateInput').call(this);

  // don't update if we aren't allowed to update.
  if (!this.canUpdateInput()) return;

  // update the input.
  $jabsController1.update();
};
//endregion JABS_Engine