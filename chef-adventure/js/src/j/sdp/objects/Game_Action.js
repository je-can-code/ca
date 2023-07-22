//region Game_Action
/**
 * Extends {@link #applyGlobal}.
 * Also handles any SDP effects such as unlocking.
 */
J.SDP.Aliased.Game_Action.set('applyGlobal', Game_Action.prototype.applyGlobal);
Game_Action.prototype.applyGlobal = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_Action.get('applyGlobal').call(this);

  // apply the SDP effects if appropriate.
  this.handleSdpEffects();
};

/**
 * Handles any SDP-related effects for this action.
 */
Game_Action.prototype.handleSdpEffects = function()
{
  // check if the SDP can be unlocked.
  if (this.canUnlockSdp())
  {
    // perform the unlock.
    this.applySdpUnlockEffect();
  }
};

/**
 * Determines whether or not the SDP on this action can be unlocked.
 * @returns {boolean} True if the SDP can be unlocked, false otherwise.
 */
Game_Action.prototype.canUnlockSdp = function()
{
  // grab the item out.
  const item = this.item();

  // if there is no item, no unlocking panels.
  if (!item) return false;

  // if it is a skill, then no unlocking panels.
  if (item instanceof RPG_Skill) return false;

  // if this doesn't unlock a panel, then no unlocking panels.
  if (!item.sdpKey) return false;

  // unlock that sdp!
  return true;
};

/**
 * Performs any unlock effects associated with the attached item's SDP tag.
 */
Game_Action.prototype.applySdpUnlockEffect = function()
{
  // grab the item out.
  const item = this.item();

  // unlock the SDP.
  $gameSystem.unlockSdp(item.sdpKey);
};
//endregion Game_Action