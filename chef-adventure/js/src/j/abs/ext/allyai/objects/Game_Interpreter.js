//region Game_Interpreter
/**
 * Extends the "Set Moveroute" event command.
 * Sets all follower's direction-fix to be whatever the player's is after a moveroute.
 * This accommodates the other adjustment regarding the player direction locking and allowing
 * the allies to stay agnostic to that input.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Interpreter.command205 = Game_Interpreter.prototype.command205;
Game_Interpreter.prototype.command205 = function(params)
{
  // if param[0] is -1, that is the player!
  // TODO: only jump to player if the player moves!
  // execute the move route command.
  const result = J.ABS.EXT.ALLYAI.Aliased.Game_Interpreter.command205.call(this, params);

  // check if we have a result and also the target is to move the character.
  if (result && params[0] === -1)
  {
    // then check the player's lock status and set all followers to be the same.
    $gamePlayer.followers().setDirectionFixAll($gamePlayer.isDirectionFixed());
    $gamePlayer.jumpFollowersToMe();
  }

  // return the outcome.
  return result;
};
//endregion Game_Interpreter