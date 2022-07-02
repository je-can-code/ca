//#region Game_Battler
/**
 * Consume the item AND unlock the boost if it is not already unlocked.
 * @param {object} item The item being consumed.
 */
J.OTIB.Aliased.Game_Actor.consumeItem = Game_Battler.prototype.consumeItem
Game_Battler.prototype.consumeItem = function(item)
{
  J.OTIB.Aliased.Game_Actor.consumeItem.call(this, item);

  if (!this.isOtibUnlocked(item.id))
  {
    this.unlockOtib(item.id);
  }
};
//#endregion Game_Battler