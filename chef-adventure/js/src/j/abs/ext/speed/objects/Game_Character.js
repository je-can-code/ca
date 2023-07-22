//region Game_Character
/**
 * Extends {@link Game_Character.distancePerFrame}.
 * Enables modification of the character's movement speed on the map.
 * @return {number} The modified distance per frame to move.
 */
J.ABS.EXT.SPEED.Aliased.Game_Character.set('distancePerFrame', Game_Character.prototype.distancePerFrame);
Game_Character.prototype.distancePerFrame = function()
{
  // determine base distance per frame.
  const base = J.ABS.EXT.SPEED.Aliased.Game_Character.get('distancePerFrame').call(this);

  // calculate the speed boost bonus based on the base.
  const bonus = this.calculateSpeedBoostBonus(base);

  // determine the sum of base + bonus.
  const total = (base + bonus);

  // make sure the total is within our minimum threshold so we don't moonwalk.
  // seriously, disable this line and get the result to be negative and see what happens.
  const constrainedTotal = Math.max(total, this.minimumDistancePerFrame());

  // return the sum.
  return constrainedTotal;
};

/**
 * Determines the bonus (or penalty) move speed for the player based on equipment.
 * @param {number} baseMoveSpeed The base distance per frame.
 */
Game_Character.prototype.calculateSpeedBoostBonus = function(baseMoveSpeed)
{
  // grab the battler that is moving.
  const battler = this.getJabsBattler();

  // if we have no player, then do not move
  if (!battler) return 0;

  // get the current speed boosts associated with the battler.
  const scale = battler.getBattler().getWalkSpeedBoosts();

  // if we have no boosts, then don't process.
  if (scale === 0) return 0;

  // constrained scale, to prevent going into moonwalk mode; defaults to minimum -90% penalty.
  const constrainedScale = Math.max(this.minimumWalkSpeedBoost(), scale);

  // get the multiplier.
  const multiplier = (constrainedScale / 100);

  // calculate the move speed.
  const calculatedMoveSpeed = baseMoveSpeed * multiplier;

  // return the product.
  return calculatedMoveSpeed;
};

Game_Character.prototype.minimumWalkSpeedBoost = function()
{
  return -90;
};

/**
 * Gets the minimum distance to move per frame.
 * @returns {number}
 */
Game_Character.prototype.minimumDistancePerFrame = function()
{
  // the minimum speed is "2" aka "4x slower" according to events.
  // remove comment to let it go lower, but be careful, thats really low!
  const minimumDistance = 0.015625; // / 2;

  // return the calculated amount.
  return minimumDistance;
};
//endregion Game_Character