//region Game_Player
/**
 * Extends the canMove function to ensure the player can't move around while
 * in the JAFTING menu.
 */
J.JAFTING.Aliased.Game_Player.canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function()
{
  if ($gameSystem.isJafting())
  {
    return false;
  }
  else
  {
    return J.JAFTING.Aliased.Game_Player.canMove.call(this);
  }
};
//endregion Game_Player