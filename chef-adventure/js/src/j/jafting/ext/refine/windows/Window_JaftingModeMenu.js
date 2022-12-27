//region Window_JaftingModeMenu
/**
 * Extends the mode command creation to include a new command for refinement.
 */
J.JAFTING.EXT.REFINE.Aliased.Window_JaftingModeMenu.makeCommandList = Window_JaftingModeMenu.prototype.makeCommandList;
Window_JaftingModeMenu.prototype.makeCommandList = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Window_JaftingModeMenu.makeCommandList.call(this);
  if ($gameJAFTING.isRefinementHidden()) return;

  const hasEquipment = $gameParty.equipItems().length > 1; // need at least 2 items to refine.
  const refineAllowed = $gameJAFTING.isRefinementEnabled();
  const canRefine = hasEquipment && refineAllowed;
  const refineCommand = {
    name: J.JAFTING.EXT.REFINE.Messages.RefineCommandName,
    symbol: `refine-mode`,
    enabled: canRefine,
    ext: null,
    icon: 223
  };
  this._list.splice(1, 0, refineCommand);
};
//endregion Window_JaftingModeMenu