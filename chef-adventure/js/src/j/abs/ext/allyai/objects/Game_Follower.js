//region Game_Follower
/**
 * OVERWRITE Adjust the chaseCharacter function to prevent chasing the player
 * while this follower is engaged.
 * @param {Game_Character} character The character this follower is following.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Follower.set('chaseCharacter', Game_Follower.prototype.chaseCharacter);
Game_Follower.prototype.chaseCharacter = function(character)
{
  // if this isn't a valid battler or followers aren't being shown, then don't control them.
  if (!this.canObeyJabsAi())
  {
    // perform original logic.
    J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('chaseCharacter').call(this, character);

    // stop processing.
    return;
  }

  // let the AI handle the chasing.
  this.obeyJabsAi(character);
};

/**
 * Determines whether or not this follower should be controlled by the {@link JABS_AiManager}.
 * @returns {boolean} True if this follower should be controlled, false otherwise.
 */
Game_Follower.prototype.canObeyJabsAi = function()
{
  // if we are not visible, then we should not be controlled by JABS AI.
  if (!this.isVisible()) return false;

  // if we do not have a JABS battler, then we should not be controlled by JABS AI.
  if (!this.getJabsBattler()) return false;

  // lets get controlled!
  return true;
};

/**
 * Determines how this character should move in consideration of JABS' own AI manager.
 * @param {Game_Character} character The character being chased.
 */
Game_Follower.prototype.obeyJabsAi = function(character)
{
  // check if we should be doing dead ai things.
  if (this.shouldObeyJabsDeadAi())
  {
    // handle dead jabs ai logic.
    this.handleJabsDeadAi(character);
  }

  // check if we should be doing combat ai things.
  if (this.shouldObeyJabsCombatAi())
  {
    // handle combat jabs ai logic.
    this.handleJabsCombatAi(character);
  }
};

/**
 * Determines whether or not this follower should be obeying the JABS DEAD AI.
 * @returns {boolean}
 */
Game_Follower.prototype.shouldObeyJabsDeadAi = function()
{
  // Are we dead?
  const isDead = this.getJabsBattler().isDead();

  // return the diagnostic.
  return isDead;
};

/**
 * Handles the repeated actions for when a battler is dead.
 *
 * If this follower is dead, this will be the only JABS AI available to follow.
 *
 * Some ideas are in the TODOs below:
 * - TODO: Add option for character sprite change.
 * - TODO: Add option for follow (default) or stay.
 * - TODO: Add option for character motion effects, try integration with moghunters?
 * @param {Game_Character} character The character being "followed".
 */
Game_Follower.prototype.handleJabsDeadAi = function(character)
{
  // TODO: handle logic for repeating whilst dead.
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('chaseCharacter').call(this, character);
};

/**
 * Determines whether or not this follower should be obeying the JABS COMBAT AI.
 * @returns {boolean}
 */
Game_Follower.prototype.shouldObeyJabsCombatAi = function()
{
  // you cannot be dead and also in combat.
  if (this.shouldObeyJabsDeadAi()) return false;

  // lets get to fighting!
  return true;
};

/**
 * Handles the flow of logic for the movement of this character while available
 * to do combat things according to the {@link JABS_AiManager}.
 * @param character
 */
Game_Follower.prototype.handleJabsCombatAi = function(character)
{
  // determine if this follower is in combat somehow.
  if (this.isInCombat())
  {
    // do active combat things!
    this.handleJabsCombatActiveAi(character);
  }
  // we are not actively engaged in any form of combat.
  else
  {
    // do non-combat things.
    this.handleJabsCombatInactiveAi(character);
  }
};

/**
 * Determines whether or not this battler is considered "in combat".
 * If a battler is "in combat", their movement is given to the JABS AI for combat purposes.
 * Default things that should allow movement include already being engaged in combat, or
 * having been alerted by a foe.
 * @returns {boolean}
 */
Game_Follower.prototype.isInCombat = function()
{
  // grab the battler data.
  const battler = this.getJabsBattler();

  // check if we are "in combat" in some way.
  const isInCombat = (battler.isEngaged() || battler.isAlerted());

  // return the result.
  return isInCombat;
};

/**
 * Handles the follower logic of things to do while this battler is in active combat.
 * @param {Game_Character} character The character being "followed".
 */
Game_Follower.prototype.handleJabsCombatActiveAi = function(character)
{
  // the battler is engaged, the AI will handle the movement.
  this.handleEngagementDistancing();

  // movement is relinquished to the jabs-ai-manager-senpai!
};

/**
 * Handles the repeated actions for when a battler is dead.
 *
 * If this follower is combat-ready but not alerted or engaged, they will just follow defaults.
 *
 * TODO: consider rapidly looping this when the character is far away?
 * @param {Game_Character} character The character being "followed".
 */
Game_Follower.prototype.handleJabsCombatInactiveAi = function(character)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('chaseCharacter').call(this, character);
};

/**
 * Extends {@link Game_Follower.update}.
 * If this follower should be controlled by JABS AI, then modify the way it updates.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Follower.set('update', Game_Follower.prototype.update);
Game_Follower.prototype.update = function()
{
  // check if this follower should be obeying jabs ai.
  if (!this.canObeyJabsAi())
  {
    // perform original logic if we are not.
    J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('update').call(this);

    // stop processing.
    return;
  }

  // update for the ally ai instead.
  this.updateAllyAi();
};

/**
 * A slightly modified update for followers controlled by JABS AI.
 */
Game_Follower.prototype.updateAllyAi = function()
{
  // TODO: rewrite this entirely.
  // perform superclass logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('update').call(this);
  //Game_Character.prototype.update.call(this);

  // update the various parameters accordingly for followers.
  this.setMoveSpeed($gamePlayer.realMoveSpeed());
  this.setOpacity($gamePlayer.opacity());
  this.setBlendMode($gamePlayer.blendMode());
  this.setWalkAnime($gamePlayer.hasWalkAnime());
  this.setStepAnime($gamePlayer.hasStepAnime());
  this.setTransparent($gamePlayer.isTransparent());
  // skip direction fix lock.

  // also handle engagement distancing.
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
  // don't manage engagement distancing if they are not valid JABS battlers ready for combat.
  if (!this.canObeyJabsAi()) return;

  // grab the underlying jabs battler.
  const battler = this.getJabsBattler();

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

// TODO: refactor handleEngagementDistancing().
//endregion Game_Follower