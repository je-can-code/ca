//region Spriteset_Map
/**
 * Extends `refreshAllCharacterSprites()` to also refresh danger indicators.
 */
J.ABS.EXT.DANGER.Aliased.Spriteset_Map.set('refreshAllCharacterSprites', Spriteset_Map.prototype.refreshAllCharacterSprites);
Spriteset_Map.prototype.refreshAllCharacterSprites = function()
{
  // iterate over each sprite and set up its danger indicators if necessary.
  this._characterSprites.forEach(sprite => sprite.setupDangerIndicator());

  // perform original logic.
  J.ABS.EXT.DANGER.Aliased.Spriteset_Map.get('refreshAllCharacterSprites').call(this);
};
//endregion Spriteset_Map