//region Game_Troop
/**
 * Gets the amount of SDP points earned from all defeated enemies.
 * @returns {number}
 */
Game_Troop.prototype.sdpTotal = function()
{
  // initialize total to zero.
  let sdpPoints = 0;

  // iterate over each dead enemy and sum their total SDP points.
  this.deadMembers().forEach(enemy => sdpPoints += enemy.sdpPoints());

  // return the summed value.
  return sdpPoints;
};
//endregion Game_Troop