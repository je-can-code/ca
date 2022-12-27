//region JABS_Battler
if (J.HUD && J.HUD.EXT.TARGET)
{
  /**
   * Gets the target frame icon from the underlying character.
   * @returns {number}
   */
  J.OMNI.EXT.MONSTER.Aliased.JABS_Battler.set('getTargetFrameIcon', JABS_Battler.prototype.getTargetFrameIcon);
  JABS_Battler.prototype.getTargetFrameIcon = function()
  {
    // perform original logic to get the target frame icon.
    const originalTargetFrameIcon = J.OMNI.EXT.MONSTER.Aliased.JABS_Battler.get('getTargetFrameIcon').call(this);

    // if a target frame icon was provided, then just use that.
    if (originalTargetFrameIcon !== 0) return originalTargetFrameIcon;

    // if this isn't an enemy, then they don't get target frame icons.
    const enemy = this.getBattler().enemy();

    // check for a monster family icon instead.
    const monsterFamilyIconIndex = enemy.monsterFamilyIcon;

    // validate we have a monster family icon, too.
    if (monsterFamilyIconIndex)
    {
      // return the monster family icon by default.
      return monsterFamilyIconIndex;
    }

    // there is no freebie icons for this enemy.
    return 0;
  };
}
//endregion JABS_Battler