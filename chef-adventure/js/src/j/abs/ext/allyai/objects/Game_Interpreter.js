//#region Game_Interpreter
/**
 * Extends the "Set Moveroute" event command.
 * Sets all follower's direction-fix to be whatever the player's is after a moveroute.
 * This accommodates the other adjustment regarding the player direction locking and allowing
 * the allies to stay agnostic to that input.
 */
J.ALLYAI.Aliased.Game_Interpreter.command205 = Game_Interpreter.prototype.command205;
Game_Interpreter.prototype.command205 = function(params)
{
  // execute the move route command.
  const result = J.ALLYAI.Aliased.Game_Interpreter.command205.call(this, params);

  // then check the player's lock status and set all followers to be the same.
  $gamePlayer.followers()
    .setDirectionFixAll($gamePlayer.isDirectionFixed());
  $gamePlayer.jumpFollowersToMe();
  return result;
};
//#endregion Game_Interpreter