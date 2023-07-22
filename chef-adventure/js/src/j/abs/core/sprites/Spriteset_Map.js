//region Spriteset_Map
/**
 * Hooks into the `update` function to also update any active action sprites.
 */
J.ABS.Aliased.Spriteset_Map.set('update', Spriteset_Map.prototype.update);
Spriteset_Map.prototype.update = function()
{
  // perform original logic.
  J.ABS.Aliased.Spriteset_Map.get('update').call(this);

  // perform jabs-related sprite updates.
  this.updateJabsSprites();
};

/**
 * Updates all existing actionSprites on the map.
 */
Spriteset_Map.prototype.updateJabsSprites = function()
{
  // manage action sprites.
  this.handleActionSprites();

  // manage loot sprites.
  this.handleLootSprites();

  // manage full-screen sprite refreshes.
  this.handleSpriteRefresh();
};

/**
 * Processes incoming requests to add/remove action sprites.
 */
Spriteset_Map.prototype.handleActionSprites = function()
{
  // check if we have incoming requests to add new action sprites.
  if ($jabsEngine.requestActionRendering)
  {
    // add the new action sprites.
    this.addActionSprites();
  }

  // check if we have incoming requests to remove old action sprites.
  if ($jabsEngine.requestClearMap)
  {
    // remove the old action sprites.
    this.removeActionSprites();
  }
};

/**
 * Processes incoming requests to add/remove loot sprites.
 */
Spriteset_Map.prototype.handleLootSprites = function()
{
  // check if we have incoming requests to add new loot sprites.
  if ($jabsEngine.requestLootRendering)
  {
    // add the new loot sprites.
    this.addLootSprites();
  }

  // check if we have incoming requests to remove old loot sprites.
  if ($jabsEngine.requestClearLoot)
  {
    // remove the old loot sprites.
    this.removeLootSprites();
  }
};

/**
 * Processes incoming requests to add/remove loot sprites.
 */
Spriteset_Map.prototype.handleSpriteRefresh = function()
{
  // check if we have incoming requests to do a sprite refresh.
  if ($jabsEngine.requestSpriteRefresh)
  {
    // refresh all character sprites.
    this.refreshAllCharacterSprites();
  }
};

/**
 * Adds all needing-to-be-added action sprites to the map and renders.
 */
Spriteset_Map.prototype.addActionSprites = function()
{
  // grab all the newly-added action events.
  const newActionEvents = $gameMap.newActionEvents();

  // scan each of them and add new action sprites as-needed.
  newActionEvents.forEach(this.addActionSprite, this);

  // acknowledge that action sprites were added.
  $jabsEngine.requestActionRendering = false;
};

/**
 * Processes a single event and adds its corresponding action sprite if necessary.
 * @param {Game_Event} actionEvent The event that may require a new sprite added.
 */
Spriteset_Map.prototype.addActionSprite = function(actionEvent)
{
  // get the underlying character associated with this action.
  const character = actionEvent.getJabsAction().getActionSprite();

  // generate the new sprite based on the action's character.
  const sprite = new Sprite_Character(character);

  // add the sprite to tracking.
  this._characterSprites.push(sprite);
  this._tilemap.addChild(sprite);

  // acknowledge that the sprite was added.
  actionEvent.setActionSpriteNeedsAdding(false);
};

/**
 * Scans all events on the map and adds new loot sprites accordingly.
 */
Spriteset_Map.prototype.addLootSprites = function()
{
  // grab all the newly-added loot events.
  const events = $gameMap.newLootEvents();

  // scan each of them and add new loot sprites.
  events.forEach(this.addLootSprite, this);

  // acknowledge that loot sprites were added.
  $jabsEngine.requestLootRendering = false;
};

/**
 * Processes a single event and adds its corresponding loot sprite if necessary.
 * @param {Game_Event} lootEvent The event that may require a new sprite added.
 */
Spriteset_Map.prototype.addLootSprite = function(lootEvent)
{
  // generate the new sprite based on the loot's character.
  const sprite = new Sprite_Character(lootEvent);

  // add the sprite to tracking.
  this._characterSprites.push(sprite);
  this._tilemap.addChild(sprite);

  // acknowledge that the sprite was added.
  lootEvent.setLootNeedsAdding(false);
};

/**
 * Removes all expired action sprites from the map.
 */
Spriteset_Map.prototype.removeActionSprites = function()
{
  // grab all expired action events.
  const events = $gameMap.expiredActionEvents();

  // remove them.
  events.forEach(this.removeActionSprite, this);

  // acknowledge that expired action sprites were cleared.
  $jabsEngine.requestClearMap = false;
};

/**
 * Processes a single action event and removes its corresponding sprite(s).
 * @param {Game_Event} actionEvent The action event that requires removal.
 */
Spriteset_Map.prototype.removeActionSprite = function(actionEvent)
{
  // get the sprite index for the action event.
  const spriteIndex = this._characterSprites.findIndex(sprite =>
  {
    // if the character doesn't match the event, then keep looking.
    if (sprite.character() !== actionEvent) return false;

    // we found a match!
    return true;
  });

  // confirm we did indeed find the sprite's index for removal.
  if (spriteIndex !== -1)
  {
    // purge the sprite from tracking.
    this._characterSprites.splice(spriteIndex, 1);
  }

  // flag the Game_Event for removal from Game_Map's tracking.
  actionEvent.setActionSpriteNeedsRemoving();

  // delete the now-removed sprite for this action.
  $gameMap.clearExpiredJabsActionEvents();
};

/**
 * Removes all needing-to-be-removed loot sprites from the map.
 */
Spriteset_Map.prototype.removeLootSprites = function()
{
  // grab all expired loot events.
  const events = $gameMap.expiredLootEvents();

  // remove them.
  events.forEach(this.removeLootSprite, this);

  // acknowledge that expired loot sprites were cleared.
  $jabsEngine.requestClearLoot = false;
};

/**
 * Processes a single loot event and removes its corresponding sprite(s).
 * @param {Game_Event} lootEvent The loot event that requires removal.
 */
Spriteset_Map.prototype.removeLootSprite = function(lootEvent)
{
  const spriteIndex = this._characterSprites.findIndex(sprite =>
  {
    // if the character doesn't match the event, then keep looking.
    if (sprite.character() !== lootEvent) return false;

    // we found a match!
    return true;
  });

  // confirm we did indeed find the sprite's index for removal.
  if (spriteIndex !== -1)
  {
    // delete that sprite's loot.
    this._characterSprites[spriteIndex].deleteLootSprite();

    // purge the sprite from tracking.
    this._characterSprites.splice(spriteIndex, 1);
  }

  // delete the now-removed sprite for this action.
  $gameMap.clearExpiredLootEvents();
};

/**
 * Refreshes all character sprites on the map.
 * Does nothing in this plugin, but leaves open for extension.
 */
Spriteset_Map.prototype.refreshAllCharacterSprites = function()
{
  $jabsEngine.requestSpriteRefresh = false;
};
//endregion Spriteset_Map