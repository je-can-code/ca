//region Game_Battler
/**
 * Determines whether or not the {@link OneTimeItemBoost} has been unlocked yet.
 * @param {number} itemId The id of the item granting the boost.
 * @returns {boolean} True if already unlocked, false otherwise.
 */
Game_Battler.prototype.isOtibUnlocked = function(itemId)
{
  return false;
};

/**
 * Unlocks the {@link OneTimeItemBoost} associated with the item's id.
 * @param {number} itemId The id of the item granting the boost.
 */
Game_Battler.prototype.unlockOtib = function(itemId)
{
};

/**
 * Consume the item AND unlock the boost if it is not already unlocked.
 * @param {object} item The item being consumed.
 */
J.OTIB.Aliased.Game_Actor.set('consumeItem', Game_Battler.prototype.consumeItem)
Game_Battler.prototype.consumeItem = function(item)
{
  // perform original logic.
  J.OTIB.Aliased.Game_Actor.get('consumeItem').call(this, item);

  // handle the otib logic.
  this.handleOtibUnlock(item);
};

/**
 * Handles the {@link OneTimeItemBoost} unlock if applicable.
 * @param {RPG_Item} item The item potentially containing a boost.
 */
Game_Battler.prototype.handleOtibUnlock = function(item)
{
  // parse out the item's id.
  const { id } = item;

  // check if we have yet to unlock this boost.
  if (!this.isOtibUnlocked(id))
  {
    // unlock the boost.
    this.unlockOtib(id);
  }
};
//endregion Game_Battler