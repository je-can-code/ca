//#region Game_Follower
/**
 * OVERWRITE Adjust the chaseCharacter function to prevent chasing the player
 * while this follower is engaged.
 * @param {Game_Character} character The character this follower is following.
 */
J.ALLYAI.Aliased.Game_Follower.chaseCharacter = Game_Follower.prototype.chaseCharacter;
Game_Follower.prototype.chaseCharacter = function(character)
{
  // if we're just a ghost follower, or a dead battler, follow like a good little default follower.
  const battler = this.getJabsBattler();
  if (!this.isVisible() || battler.isDead())
  {
    J.ALLYAI.Aliased.Game_Follower.chaseCharacter.call(this, character);
    return;
  }

  if (!battler.isEngaged() && !battler.isAlerted())
  {
    // if the battler isn't engaged, still follow the player.
    J.ALLYAI.Aliased.Game_Follower.chaseCharacter.call(this, character);
    this.handleEngagementDistancing();
  }
  else
  {
    // if the battler is engaged, make sure they stay within range of the player.
    this.handleEngagementDistancing();
  }
};

/**
 * OVERWRITE Removed the forced direction-fix upon followers when the player is guarding.
 */
J.ALLYAI.Aliased.Game_Follower.update = Game_Follower.prototype.update;
Game_Follower.prototype.update = function()
{
  // check to make sure we're working with valid followers.
  if (!this.isVisible())
  {
    // perform original logic if we are not.
    J.ALLYAI.Aliased.Game_Follower.update.call(this);

    // stop processing.
    return;
  }

  // perform superclass logic.
  Game_Character.prototype.update.call(this);

  // update the various parameters accordingly for followers.
  this.setMoveSpeed($gamePlayer.realMoveSpeed());
  this.setOpacity($gamePlayer.opacity());
  this.setBlendMode($gamePlayer.blendMode());
  this.setWalkAnime($gamePlayer.hasWalkAnime());
  this.setStepAnime($gamePlayer.hasStepAnime());
  this.setTransparent($gamePlayer.isTransparent());
  this.handleEngagementDistancing();
};

/**
 * Jump to the player from wherever you are.
 */
Game_Follower.prototype.jumpToPlayer = function()
{
  const sx = $gamePlayer.deltaXFrom(this.x);
  const sy = $gamePlayer.deltaYFrom(this.y);
  this.jump(sx, sy);
};

/**
 * If the battler is too far from the player, jump to them.
 */
Game_Follower.prototype.handleEngagementDistancing = function()
{
  // grab the underlying jabs battler.
  const battler = this.getJabsBattler();

  // if there is no battler, don't process engagement.
  if (!battler) return;

  // calculate the distance to the player.
  const distanceToPlayer = $gameMap.distance(this._realX, this._realY, $gamePlayer._realX, $gamePlayer._realY);

  // check if we are not engaged and not alerted.
  if (!battler.isEngaged() && !battler.isAlerted())
  {
    // determine if we are close enough to the player to allow engagement.
    if (distanceToPlayer <= Math.round(JABS_Battler.allyRubberbandRange() / 2))
    {
      // if the ally is within range of the player, then re-enable the ability to engage.
      battler.unlockEngagement();
    }

    // if the battler is engaged, make sure they stay within range of the player.
  }

  // determine if we have exceeded the distance allowed to be apart from the player.
  if (distanceToPlayer > JABS_Battler.allyRubberbandRange())
  {
    // when the ally is too far away from the player, disengage and prevent further engagement.
    battler.lockEngagement();
    battler.disengageTarget();
    battler.resetAllAggro(null, true);
    this.jumpToPlayer();
  }
};
//#endregion Game_Follower