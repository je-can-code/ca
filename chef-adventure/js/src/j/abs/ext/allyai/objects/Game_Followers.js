//#region Game_Followers
/**
 * OVERWRITE If you're using this, the followers always show up!
 * @returns {boolean}
 */
J.ALLYAI.Aliased.Game_Followers.show = Game_Followers.prototype.show;
Game_Followers.prototype.show = function()
{
  J.ALLYAI.Aliased.Game_Followers.show.call(this);
  $gameMap.updateAllies();
  $jabsEngine.requestJabsMenuRefresh = true;
};

/**
 * OVERWRITE If you're using this, the followers always show up!
 * @returns {boolean}
 */
J.ALLYAI.Aliased.Game_Followers.hide = Game_Followers.prototype.hide;
Game_Followers.prototype.hide = function()
{
  J.ALLYAI.Aliased.Game_Followers.hide.call(this);
  $gameMap.updateAllies();
  $jabsEngine.requestJabsMenuRefresh = true;
};

/**
 * OVERWRITE Adjust the jumpAll function to prevent jumping to the player
 * when the player is hit.
 */
Game_Followers.prototype.jumpAll = function()
{
  if ($gamePlayer.isJumping())
  {
    for (const follower of this._data)
    {
      // skip followers that don't exist.
      if (!follower || !follower.isVisible()) return;

      // don't jump to the player when the player gets hit.
      const battler = follower.getJabsBattler();
      if (battler.isEngaged()) return;

      // if not engaged, then jumping to the player is OK.
      const sx = $gamePlayer.deltaXFrom(follower.x);
      const sy = $gamePlayer.deltaYFrom(follower.y);
      follower.jump(sx, sy);
    }
  }
};

/**
 * Sets whether or not all followers are direction-fixed.
 * @param {boolean} isFixed Whether or not the direction should be fixed.
 */
Game_Followers.prototype.setDirectionFixAll = function(isFixed)
{
  this._data.forEach(follower =>
  {
    // skip followers that don't exist.
    if (!follower) return;

    // set their direction to be whatever the player's is.
    follower.setDirection(isFixed);
  });
};
//#endregion Game_Followers