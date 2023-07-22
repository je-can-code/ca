//region Scene_Omnipedia
//region root actions
/**
 * Extends {@link #onRootPediaSelection}.
 * When the monsterpedia is selected, open the monsterpedia.
 */
J.OMNI.EXT.MONSTER.Aliased.Scene_Omnipedia.set('onRootPediaSelection', Scene_Omnipedia.prototype.onRootPediaSelection);
Scene_Omnipedia.prototype.onRootPediaSelection = function()
{
  // grab which pedia was selected.
  const currentSelection = this.getRootOmnipediaKey();

  // check if the current selection is the monsterpedia.
  if (currentSelection === "monster-pedia")
  {
    // execute the monsterpedia.
    this.monsterpediaSelected();
  }
  // the current selection is not the monsterpedia.
  else
  {
    // possibly activate other choices.
    J.OMNI.EXT.MONSTER.Aliased.Scene_Omnipedia.get('onRootPediaSelection').call(this);
  }
}

/**
 * Switch to the monsterpedia when selected from the root omnipedia list.
 */
Scene_Omnipedia.prototype.monsterpediaSelected = function()
{
  // close the root omnipedia windows.
  this.closeRootPediaWindows();

  // call the monsterpedia scene.
  Scene_Monsterpedia.callScene();
}
//endregion root actions
//endregion Scene_Omnipedia