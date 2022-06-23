//#region Game_CharacterBase
/**
 * Extends the `initMembers()` to allow custom move speeds and dashing.
 */
J.ABS.Aliased.Game_CharacterBase.initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function()
{
  J.ABS.Aliased.Game_CharacterBase.initMembers.call(this);

  /**
   * The real
   * @type {number}
   * @private
   */
  this._realMoveSpeed = 4;
  this._wasDodging = false;
  this._dodgeBoost = 0;
};

/**
 * OVERWRITE Replaces the "real move speed" value to return
 * our custom real move speed instead, along with dash boosts as necessary.
 * @returns {number}
 */
Game_CharacterBase.prototype.realMoveSpeed = function()
{
  const dashBoost = (this.isDashing()
    ? this.dashSpeed()
    : 0);
  const realMoveSpeed = this._realMoveSpeed + dashBoost;
  return realMoveSpeed;
};

/**
 * Default speed boost for all characters when dashing.
 */
Game_CharacterBase.prototype.dashSpeed = function()
{
  return J.ABS.Metadata.DashSpeedBoost;
};

/**
 * Extends the `setMoveSpeed()` to also modify custom move speeds.
 */
J.ABS.Aliased.Game_CharacterBase.setMoveSpeed = Game_CharacterBase.prototype.setMoveSpeed;
Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed)
{
  // perform original logic.
  J.ABS.Aliased.Game_CharacterBase.setMoveSpeed.call(this, moveSpeed);

  // set the underlying real move speed to this.
  this._realMoveSpeed = moveSpeed;
};

/**
 * Sets the boost gained when dodging to a specified amount.
 * @param {number} dodgeMoveSpeed The boost gained when dodging.
 */
Game_CharacterBase.prototype.setDodgeBoost = function(dodgeMoveSpeed)
{
  this._dodgeBoost = dodgeMoveSpeed;
};

/**
 * Extends the update to allow for custom values while dashing.
 */
J.ABS.Aliased.Game_CharacterBase.update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function()
{
  J.ABS.Aliased.Game_CharacterBase.update.call(this);
  this.updateDodging();
};

/**
 * Whether or not the player has executed a dodge skill.
 */
Game_CharacterBase.prototype.isDodging = function()
{
  const player = $jabsEngine.getPlayer1();
  return player.isDodging();
};

/**
 * Alters the speed when dodging (and when dodging is finished).
 */
Game_CharacterBase.prototype.updateDodging = function()
{
  // get the current state of the player's dodge.
  const isDodging = this.isDodging();

  this.handleDodgeStart(isDodging);
  this.handleDodgeEnd(isDodging);

  this._wasDodging = isDodging;
};

/**
 * Handles the start of dodging, if necessary.
 * If the player's current dodge state is active, then modify the move speed accordingly.
 * @param {boolean} isDodging True if the player is dodging right now, false otherwise.
 */
Game_CharacterBase.prototype.handleDodgeStart = function(isDodging)
{
  // if are currently dodging, update our move speed to the dodge speed instead.
  if (!this._wasDodging && isDodging)
  {
    this.setMoveSpeed(this._moveSpeed + this._dodgeBoost);
  }
};

/**
 * Handles the end of dodging, if necessary.
 * If the player's current dodge state is inactive, then return the move speed to normal.
 * @param {boolean} isDodging True if the player is dodging right now, false otherwise.
 */
Game_CharacterBase.prototype.handleDodgeEnd = function(isDodging)
{
  // if we are no longer doding, but were before, reduce the move speed back to normal.
  if (this._wasDodging && !isDodging)
  {
    this.setMoveSpeed(this._moveSpeed - this._dodgeBoost);
  }
};
//#endregion Game_CharacterBase