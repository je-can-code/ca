//region Game_Player
/**
 * OVERWRITE Changes the button detection to look for a different button instead of SHIFT.
 */
Game_Player.prototype.isDashButtonPressed = function()
{
  // define the baseline for whether or not the player is dashing.
  const shift = Input.isPressed(J.ABS.Input.Dash);

  // figure out if we're inverting the baseline.
  if (ConfigManager.alwaysDash)
  {
    // invert the baseline.
    return !shift;
  }
  else
  {
    // keep with the baseline.
    return shift;
  }
};

/**
 * While JABS is enabled, don't try to interact with events if they are enemies.
 */
J.ABS.Aliased.Game_Player.set('startMapEvent', Game_Player.prototype.startMapEvent);
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal)
{
  // this is mostly the same logic as the original, except if JABS is enabled...
  // we skip detection of battle.
  if ($jabsEngine.absEnabled)
  {
    if (!$gameMap.isEventRunning())
    {
      for (const event of $gameMap.eventsXy(x, y))
      {
        if (
          !event.isErased() &&
          event.isTriggerIn(triggers) &&
          event.isNormalPriority() === normal &&
          !event.getJabsBattler()
        )
        {
          event.start();
        }
      }
    }
  }
  else
  {
    // perform original logic.
    J.ABS.Aliased.Game_Player.get('startMapEvent').call(this, x, y, triggers, normal);
  }
};

/**
 * If the Abs menu is pulled up, the player shouldn't be able to move.
 */
J.ABS.Aliased.Game_Player.set('canMove', Game_Player.prototype.canMove);
Game_Player.prototype.canMove = function()
{
  // check if something related to JABS is causing the player to stop moving.
  const isMenuRequested = $jabsEngine.requestAbsMenu;
  const isAbsPaused = $jabsEngine.absPause;
  const isPlayerCasting = $jabsEngine.getPlayer1().isCasting();

  // any of these will prevent the player from moving.
  const jabsDeniesMovement = (isMenuRequested || isAbsPaused || isPlayerCasting);

  // check if JABS is denying movement.
  if (jabsDeniesMovement)
  {
    // decline movement.
    return false;
  }
  // JABS isn't denying movement.
  else
  {
    // perform original logic.
    return J.ABS.Aliased.Game_Player.get('canMove').call(this);
  }
};

J.ABS.Aliased.Game_Player.set('isDebugThrough', Game_Player.prototype.isDebugThrough);
Game_Player.prototype.isDebugThrough = function()
{
  // check if JABS is enabled.
  if ($jabsEngine.absEnabled)
  {
    // the debug button is changed while JABS is active.
    return Input.isPressed(J.ABS.Input.Debug) && $gameTemp.isPlaytest();
  }
  // JABS is not enabled.
  else
  {
    // perform original logic.
    return J.ABS.Aliased.Game_Player.get('isDebugThrough').call(this);
  }
};

/**
 * Initializes the player's `JABS_Battler` if it was not already initialized.
 */
J.ABS.Aliased.Game_Player.set('refresh', Game_Player.prototype.refresh);
Game_Player.prototype.refresh = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Player.get('refresh').call(this);

  // initialize the player when the player is refreshed.
  // TODO: consider using $jabsEngine.refreshPlayer1(); ?
  $jabsEngine.initializePlayer1();
};

/**
 * Checks whether or not the player is picking up loot drops.
 */
J.ABS.Aliased.Game_Player.set('updateMove', Game_Player.prototype.updateMove);
Game_Player.prototype.updateMove = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Player.get('updateMove').call(this);

  // monitor for loot while moving about as the player.

  // TODO: lift this to Game_Character or something if wanting others to collect loot.
  this.checkForLoot();
};

/**
 * Checks to see if the player coordinates are intercepting with any loot
 * currently on the ground.
 */
Game_Player.prototype.checkForLoot = function()
{
  // get all the loot drops on the map.
  const lootDrops = $gameMap.getJabsLootDrops();

  // make sure we have any loot to work with before processing.
  if (lootDrops.length)
  {
    // process the loot collection.
    this.processLootCollection(lootDrops);
  }
};

/**
 * Processes a collection of loot to determine what to do with it.
 * @param {Game_Event[]} lootDrops The list of all loot drops.
 */
Game_Player.prototype.processLootCollection = function(lootDrops)
{
  // for events picked up and stored all at once.
  const lootCollected = [];

  // iterate over each of the loots to see what we can do with them.
  lootDrops.forEach(lootDrop =>
  {
    // don't pick it up if we cannot pick it up.
    if (!this.canCollectLoot(lootDrop)) return;

    // grab the underlying loot drop.
    const jabsLootDrop = lootDrop.getJabsLoot();

    // check if the loot is to be used immediately on-pickup.
    if (jabsLootDrop.useOnPickup)
    {
      // use and remove it from tracking if it is.
      this.useOnPickup(jabsLootDrop.lootData);

      // remove the loot drop from the map.
      this.removeLoot(lootDrop);

      // stop processing the loot.
      return;
    }

    // add it to our group pickup tracker for additional processing.
    lootCollected.push(lootDrop);
  });

  // don't try to pick up collections that don't exist.
  if (!lootCollected.length) return;

  // pick up all the remaining loot.
  this.pickupLootCollection(lootCollected);
};

/**
 * Determines whether or not the player can collect this event's loot.
 * @param {Game_Event} lootEvent The event potentially containing loot.
 * @returns {boolean} True if it can be collected, false otherwise.
 */
Game_Player.prototype.canCollectLoot = function(lootEvent)
{
  // we cannot collect loot events that have already been erased.
  if (lootEvent.isErased()) return false;

  // we cannot collect loot that isn't close enough.
  if (!this.isTouchingLoot(lootEvent)) return false;

  // we can pick it up!
  return true;
};

/**
 * Picks up all loot at the same time that is to be stored.
 * @param {Game_Event[]} lootCollected The list of loot that was collected.
 */
Game_Player.prototype.pickupLootCollection = function(lootCollected)
{
  const lootPickedUp = [];

  // iterate over and pickup all loot collected.
  lootCollected.forEach(loot =>
  {
    // get the underlying loot item.
    const { lootData } = loot.getJabsLoot();

    // store the loot on-pickup.
    this.storeOnPickup(lootData);

    // note that the loot was picked up.
    lootPickedUp.push(lootData);

    // remove loot now that we're done with it.
    this.removeLoot(loot);
  });

  // generate all popups for the loot collected.
  $jabsEngine.generatePopItemBulk(lootPickedUp, this);

  // oh yeah, and play a sound because you picked things up.
  SoundManager.playUseItem();
};

/**
 * Whether or not the player is "touching" the this loot drop.
 * @param {Game_Event} lootDrop The event representing the loot drop.
 * @returns {boolean}
 */
Game_Player.prototype.isTouchingLoot = function(lootDrop)
{
  const distance = $gameMap.distance(lootDrop._realX, lootDrop._realY, this._realX, this._realY);
  return distance <= J.ABS.Metadata.LootPickupRange;
};

/**
 * Collects the loot drop off the ground.
 * @param {Game_Event} lootEvent The event representing this loot.
 */
Game_Player.prototype.pickupLoot = function(lootEvent)
{
  // extract the loot data.
  const lootMetadata = lootEvent.getJabsLoot();
  const { lootData } = lootMetadata;
  lootMetadata.useOnPickup
    ? this.useOnPickup(lootData)
    : this.storeOnPickup(lootData);
};

/**
 * Uses the loot as soon as it is collected.
 * @param {RPG_BaseItem} lootData An object representing the loot.
 */
Game_Player.prototype.useOnPickup = function(lootData)
{
  const player = $jabsEngine.getPlayer1();
  player.applyToolEffects(lootData.id, true);
};

/**
 * Picks up the loot and stores it in the player's inventory.
 * @param {RPG_BaseItem} lootData The loot database data itself.
 */
Game_Player.prototype.storeOnPickup = function(lootData)
{
  // add the loot to your inventory.
  $gameParty.gainItem(lootData, 1, true);

  // generate a log for the loot collected.
  $jabsEngine.createLootLog(lootData);
};

/**
 * Removes the loot drop event from the map.
 * @param {Game_Event} lootEvent The loot to remove from the map.
 */
Game_Player.prototype.removeLoot = function(lootEvent)
{
  lootEvent.setLootNeedsRemoving(true);
  $jabsEngine.requestClearLoot = true;
};
//endregion Game_Player