/**
 * Overwrites {@link Game_Follower.chaseCharacter}.
 * Prevents the follower from chasing after the player while they are in combat.
 * @param {Game_Character} character The character this follower is following.
 */
J.ABS.EXT.CYCLE.Aliased.Game_Follower.set('chaseCharacter', Game_Follower.prototype.chaseCharacter);
Game_Follower.prototype.chaseCharacter = function(character)
{
  // if we are
  if (this.isDoingJabsAllyAiThings())
  {
    // let the AI handle the chasing.
    this.obeyJabsAi(character);

    // stop processing.
    return;
  }

  // perform original logic.
  J.ABS.EXT.CYCLE.Aliased.Game_Follower.get('chaseCharacter').call(this, character);
};

/**
 * Determine if this follower is being controlled by JABS AI in some way.
 * @returns {boolean}
 */
Game_Follower.prototype.isDoingJabsAllyAiThings = function()
{
  // check if we can obey JABS AI.
  const canObey = this.canObeyJabsAi();

  // if we cannot obey, we are not doing JABS AI things.
  if (!canObey) return false;

  // check if we are in combat.
  const isInCombat = this.isInCombat();

  // if we are not in combat, then we are not doing JABS AI things.
  if (!isInCombat) return false;

  // we must be doing JABS AI things!
  return true;
};