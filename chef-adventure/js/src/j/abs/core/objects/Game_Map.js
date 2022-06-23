//#region Game_Map
/**
 * Hooks into `Game_Map.initialize()` to add the JABS object for tracking
 * all things related to the ABS system.
 */
J.ABS.Aliased.Game_Map.set('initialize', Game_Map.prototype.initialize);
Game_Map.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Map.get('initialize').call(this);

  // initialize jabs properties.
  this.initJabsMembers();
};

/**
 * Initializes properties of this class related to JABS.
 */
Game_Map.prototype.initJabsMembers = function()
{
  /**
   * The over-arching J object to contain all additional plugin parameters.
   */
  this._j ||= {};

  /**
   * A tracking list of all current battlers on this map.
   * @type {JABS_Battler[]}
   */
  this._j._allBattlers = [];
};

/**
 * Extends `Game_Map.setup()` to parse out battlers and populate enemies.
 */
J.ABS.Aliased.Game_Map.set('setup', Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Map.get('setup').call(this, mapId);

  // initialize all JABS-related data.
  this.initJabsEngine();
};

/**
 * Initializes all enemies and the battle map for JABS.
 */
Game_Map.prototype.initJabsEngine = function()
{
  // don't do things if we aren't using JABS.
  if (!$jabsEngine.absEnabled) return;

  // initialize the battle map for this map.
  $jabsEngine.initialize();

  // refresh all the battlers on this map.
  this.refreshAllBattlers();
};

/**
 * Refresh all battlers on the map. This only affects existing enemies on the map.
 * If an enemy was defeated and thus removed, that enemy is gone until the map is
 * reinitialized.
 */
Game_Map.prototype.refreshAllBattlers = function()
{
  /**
   * A collection of all existing battlers on the current map.
   * @type {JABS_Battler[]}
   */
  this._j._allBattlers = this.parseBattlers();
};

/**
 * Refreshes a single battler on this map. Only affects existing enemies on the map.
 * This is used almost exclusively with conditional event rendering.
 * @param {Game_Event} event The event to refresh.
 */
Game_Map.prototype.refreshOneBattler = function(event)
{
  // get the index of the battler by uuid, assuming they exist in the collection.
  const [battler, targetIndex] = this.findBattlerByUuid(event.getJabsBattlerUuid());

  // if we found a match, it is update/delete.
  const newBattler = this.convertOneToEnemy(event);
  if (battler)
  {
    // check to see if the new page is an enemy.
    if (newBattler === null)
    {
      // if not an enemy, delete it from the battler tracking.
      this.destroyBattler(battler, true);
    }
    else
    {
      // if it is an enemy, update the old enemy with the new one.
      this._j._allBattlers[targetIndex] = newBattler;
    }
  }

  // if we didn't find a match, then its create or do nothing.
  else
  {
    // the next page is an enemy, create a new one and add to the list.
    if (!(newBattler === null))
    {
      this._j._allBattlers.push(newBattler);
    }
    // the next page is not an enemy, do nothing.
  }
};

/**
 * Hooks into `Game_Map.update()` to add the battle map's update.
 */
J.ABS.Aliased.Game_Map.set('update', Game_Map.prototype.update);
Game_Map.prototype.update = function(sceneActive)
{
  // perform original logic.
  J.ABS.Aliased.Game_Map.get('update').call(this, sceneActive);

  // update JABS-related things.
  this.updateJabs();
};

/**
 * Updates things related to JABS.
 */
Game_Map.prototype.updateJabs = function()
{
  // update JABS battle map.
  $jabsEngine.update();
};

/**
 * Gets all action events that have yet to have a `Sprite_Character` generated for them.
 * @returns {Game_Event[]} A list of all newly added action events.
 */
Game_Map.prototype.newActionEvents = function()
{
  // the filter function for only retrieving newly-added action events.
  const filtering = event =>
  {
    // we only care about actions that also need adding.
    if (event.getActionSpriteNeedsAdding()) return true;

    // it must have already had a sprite created for this action.
    return false;
  };

  // return the new-action-filtered event list.
  return this.actionEvents().filter(filtering);
};

/**
 * Gets all action events that have reached their expiration and need removal.
 * @returns {Game_Event[]} A list of all expired action events.
 */
Game_Map.prototype.expiredActionEvents = function()
{
  // the filter function for only retrieving expired action events.
  const filtering = event =>
  {
    // we only care about actions that are past their prime.
    if (event.getJabsActionNeedsRemoving()) return true;

    // the action must still be valid.
    return false;
  };

  // return the expired-action-filtered event list.
  return this.actionEvents().filter(filtering);
};

/**
 * Gets all action events that have reached their expiration and need removal.
 * @returns {rm.types.Event[]} All relevant action metadatas.
 */
Game_Map.prototype.actionEventsFromDataMapByUuid = function(uuid)
{
  // the filter function for retrieving action metadatas from the datamap.
  /** @param {rm.types.Event} metadata */
  const filtering = metadata =>
  {
    // don't include invalid or non-action event metadatas.
    if (!metadata || !metadata.actionIndex) return false;

    // don't include actions metadatas that aren't related to the removed one.
    const actionMetadata = $jabsEngine.event(uuid);
    if (metadata.actionIndex !== actionMetadata.actionIndex) return false;

    // we want this metadata!
    return true;
  };

  // return the action-metadata-filtered event list.
  return $dataMap.events.filter(filtering);
};

/**
 * Gets all events that have a `JABS_Action` associated with them on the current map.
 * @returns {Game_Event[]} A list of events that have a `JABS_Action`.
 */
Game_Map.prototype.actionEvents = function()
{
  // the filter function for only retrieving action events.
  const filtering = event =>
  {
    // the only thing that matters is if we explicitly flagged it as an action.
    if (event.isAction) return true;

    // it must not be a real action.
    return false;
  };

  // return the action-filtered event list.
  return this.events().filter(filtering);
};

/**
 * Gets all loot events that have yet to have a `Sprite_Character` generated for them.
 * @returns {Game_Event[]} A list of all newly added loot events.
 */
Game_Map.prototype.newLootEvents = function()
{
  // the filter function for only retrieving newly-added loot events.
  const filtering = event =>
  {
    // we only care about loot that also needs adding.
    if (event.getLootNeedsAdding()) return true;

    // it must have already had a sprite created for this loot.
    return false;
  };

  // return the new-loot-filtered event list.
  return this.lootEvents().filter(filtering);
};

/**
 * Gets all loot events that have reached their expiration and need removal.
 * @returns {Game_Event[]} A list of all expired loot events.
 */
Game_Map.prototype.expiredLootEvents = function()
{
  // the filter function for only retrieving newly-added loot events.
  const filtering = event =>
  {
    // we only care about loot that is past its prime.
    if (event.getLootNeedsRemoving()) return true;

    // the loot must still be valid.
    return false;
  };

  // return the expired-loot-filtered event list.
  return this.lootEvents().filter(filtering);
};

/**
 * Gets all loot event metadatas that bear the same `uuid` as requested.
 * @returns {rm.types.Event[]} All relevant loot metadatas.
 */
Game_Map.prototype.lootEventsFromDataMapByUuid = function(uuid)
{
  // the filter function for retrieving loot metadatas from the datamap.
  /** @param {rm.types.Event} metadata */
  const filtering = metadata =>
  {
    // don't include invalid or non-action event metadatas.
    if (!metadata || !metadata.uuid) return false;

    // don't include loot metadatas that aren't related to the removed one.
    if (metadata.uuid !== uuid) return false;

    // we want this metadata!
    return true;
  };

  // return the action-metadata-filtered event list.
  return $dataMap.events.filter(filtering);
};

/**
 * Gets all events that have a `JABS_LootDrop` associated with them on the current map.
 * @returns {Game_Event[]} A list of events that have a `JABS_LootDrop`.
 */
Game_Map.prototype.lootEvents = function()
{
  // the filter function for only retrieving action events.
  const filtering = event =>
  {
    // only check if they are loot.
    if (event.isLoot()) return true;

    // it must not be loot.
    return false;
  };

  // return the loot-filtered event list.
  return this.events().filter(filtering);
};

/**
 * Gets all battlers on the current battle map.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getBattlers = function()
{
  if (this._j._allBattlers === null) return [];

  return this._j._allBattlers.filter(battler =>
  {
    const exists = !!battler;
    return exists && !battler.getCharacter()._erased;
  });
};

/**
 * Gets all battlers on the current battle map, including the player.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllBattlers = function()
{
  const battlers = this.getBattlers();
  if ($jabsEngine.getPlayer1())
  {
    battlers.push($jabsEngine.getPlayer1());
  }
  return battlers;
};

/**
 * Gets all battlers on the current map, and orders them by distance in relation to
 * a given "origin" battler. It simply uses the given battler's coordinates as the
 * origin and calculates distance from there for all battlers present.
 * @param {JABS_Battler} originBattler
 * @returns
 */
Game_Map.prototype.getAllBattlersDistanceSortedFromPlayer = function(originBattler)
{
  const battlers = this.getAllBattlers();
  return this.orderBattlersByDistanceFromBattler(battlers, originBattler);
};

/**
 * Sorts a collection of battlers by their distance from an origin battler.
 * @param {JABS_Battler[]} battlers The collection of battlers to sort.
 * @param {JABS_Battler} originBattler The origin battler to check distance against.
 * @returns
 */
Game_Map.prototype.orderBattlersByDistanceFromBattler = function(battlers, originBattler)
{
  return battlers.sort((battlerA, battlerB) =>
  {
    const distanceA = originBattler.distanceToDesignatedTarget(battlerA);
    const distanceB = originBattler.distanceToDesignatedTarget(battlerB);
    return distanceA - distanceB;
  });
};

/**
 * Find a battler on this map by their `uuid`.
 * @param {string} uuid The unique identifier of a battler to find.
 * @returns {(JABS_Battler|null)}
 */
Game_Map.prototype.getBattlerByUuid = function(uuid)
{
  const battlers = this.getAllBattlers();
  const jabsBattler = battlers.find(battler => battler.getUuid() === uuid);
  return jabsBattler
    ? jabsBattler
    : null;
};

/**
 * Checks whether or not a particular battler exists on the map.
 * @param {JABS_Battler} battlerToCheck The battler to check the existence of.
 * @returns {boolean}
 */
Game_Map.prototype.battlerExists = function(battlerToCheck)
{
  return !!this.getAllBattlers()
  .find(battler => battler.getUuid() === battlerToCheck.getUuid());
};

/**
 * Gets all battlers within a given range of another battler.
 * @param {JABS_Battler} user The user containing the base coordinates.
 * @param {number} maxDistance The maximum distance that we check battlers for.
 * @param {boolean} includePlayer Whether or not to include the player among battlers within range.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getBattlersWithinRange = function(user, maxDistance, includePlayer = true)
{
  const battlers = this.getBattlers();
  if (includePlayer)
  {
    battlers.push($jabsEngine.getPlayer1());
  }

  return battlers.filter(battler => user.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all nearby battlers that have an ai trait of `follower`.
 * @param {JABS_Battler} jabsBattler The battler to get all nearby followers for.
 * @returns {JABS_Battler[]} All ai-traited `follower` battlers.
 */
Game_Map.prototype.getNearbyFollowers = function(jabsBattler)
{
  const range = jabsBattler.getSightRadius() + jabsBattler.getPursuitRadius();
  const nearbyBattlers = $gameMap.getBattlersWithinRange(jabsBattler, range);

  // the filter function for determining if a battler is a follower to this leader.
  const filtering = battler =>
  {
    // grab the ai of the nearby battler.
    const ai = battler.getAiMode();

    // check if they can become a follower to the designated leader.
    const canLead = !battler.hasLeader() || (jabsBattler.getUuid() === battler.getLeader());

    // return the answer to that.
    return (ai.follower && !ai.leader && canLead);
  };

  return nearbyBattlers.filter(filtering);
};

/**
 * Clears leader data from another battler by it's `uuid`.
 * @param {string} followerUuid The `uuid` of the battler to clear leader data for.
 */
Game_Map.prototype.clearLeaderDataByUuid = function(followerUuid)
{
  const battler = this.getBattlerByUuid(followerUuid);
  if (battler)
  {
    battler.clearLeaderData();
  }
};

/**
 * Gets all battlers that are on a different team from the designated battler.
 * @param {JABS_Battler} user The battler to find opponents for.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getOpposingBattlers = function(user)
{
  const battlers = this.getBattlers();
  const player = $jabsEngine.getPlayer1();
  if (!user.isSameTeam(player.getTeam()))
  {
    battlers.push(player);
  }

  return battlers.filter(battler =>
  {
    const isNotSameTeam = !user.isSameTeam(battler.getTeam());
    const isNotNeutral = battler.getTeam() !== JABS_Battler.neutralTeamId();
    return isNotSameTeam && isNotNeutral;
  });
};

/**
 * Gets all battlers that are on a different team from the designated battler
 * within a given range.
 * @param {JABS_Battler} user The battler to find opponents for.
 * @param {number} maxDistance The max range to find opponents within.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getOpposingBattlersWithinRange = function(user, maxDistance)
{
  const battlers = this.getOpposingBattlers(user);
  return battlers.filter(battler => user.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all non-enemy battlers on the current battle map.
 * @returns {JABS_Battler[]} A list of allied battlers.
 */
Game_Map.prototype.getActorBattlers = function()
{
  return this.getAllBattlers()
  .filter(battler => battler.isActor());
};

/**
 * Gets all battlers that share the same team as the target.
 * @param {JABS_Battler} target The battler to compare for allies.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllyBattlers = function(target)
{
  const battlers = this.getAllBattlers();
  return battlers.filter(battler => target.isSameTeam(battler.getTeam()));
};

/**
 * Gets all battlers that share the same team as the target within a given range.
 * @param {JABS_Battler} target The battler to find opponents for.
 * @param {number} maxDistance The max range to find opponents within.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllyBattlersWithinRange = function(target, maxDistance)
{
  const battlers = this.getAllyBattlers(target);
  return battlers.filter(battler => target.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all non-ally battlers on the current battle map.
 * @returns {JABS_Battler[]} A list of enemy battlers.
 */
Game_Map.prototype.getEnemyBattlers = function()
{
  const battlers = this.getBattlers();
  const enemyBattlers = [];
  battlers.forEach(battler =>
  {
    if (battler.isEnemy())
    {
      enemyBattlers.push(battler);
    }
  });

  return enemyBattlers;
};

/**
 * Retrieves all events that are identified as loot on the map currently.
 */
Game_Map.prototype.getLootDrops = function()
{
  return this.events()
  .filter(event => event.isLoot());
};

/**
 * Parses out all enemies from the array of events on the map.
 * @returns {JABS_Battler[]} A `Game_Enemy[]`.
 */
Game_Map.prototype.parseBattlers = function()
{
  const evs = this.events();
  if (evs === undefined || evs === null || evs.length < 1)
  {
    return [];
  }

  try
  {
    const battlerEvents = evs.filter(event => event.isJabsBattler());
    return this.convertAllToEnemies(battlerEvents);
  }
  catch (err)
  {
    console.error(err);
    // for a brief moment when leaving the menu, these are all null.
    return [];
  }
};

/**
 * Converts all provided `Game_Event`s into `Game_Enemy`s.
 * @param {Game_Event[]} events A `Game_Event[]`.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.convertAllToEnemies = function(events)
{
  return events.map(event => this.convertOneToEnemy(event));
};

/**
 * Converts a single `Game_Event` into a `Game_Enemy`.
 * @param {Game_Event} event The `Game_Event` to convert to a `JABS_Battler`.
 * @returns {JABS_Battler}
 */
Game_Map.prototype.convertOneToEnemy = function(event)
{
  if (!event.isJabsBattler())
  {
    // if the battler has no id, it is likely being hidden/transformed to non-battler.
    event.setMapBattler("");
    return null;
  }

  const battlerCoreData = event.getBattlerCoreData();
  const battlerId = event.getBattlerId();
  const battler = new Game_Enemy(battlerId, null, null);
  const mapBattler = new JABS_Battler(event, battler, battlerCoreData);
  const uuid = mapBattler.getUuid();
  event.setMapBattler(uuid);
  return mapBattler;
};

/**
 * Finds the battler and its index in the collection by its `uuid`.
 *
 * The result of this is intended to be destructured from the array.
 * @param {string} uuid The `uuid` of the battler to find.
 * @returns {[JABS_Battler, number]}
 */
Game_Map.prototype.findBattlerByUuid = function(uuid)
{
  let targetIndex = -1;
  const foundBattler = this._j._allBattlers.find((battler, index) =>
  {
    const result = battler.getUuid() === uuid;
    if (result) targetIndex = index;
    return result;
  });

  return [foundBattler, targetIndex];
};

/**
 * Finds the battler and its index in the collection by its `_eventId`.
 *
 * The result of this is intended to be destructured from the array.
 * If no result is found, the battler will be null, and index will be -1.
 * @param {number} eventId The `_eventId` of the battler to find.
 * @returns {[JABS_Battler, number]}
 */
Game_Map.prototype.findBattlerByEventId = function(eventId)
{
  let targetIndex = -1;
  const foundBattler = this._j._allBattlers.find((battler, index) =>
  {
    // do not process non-enemies.
    if (!battler.isEnemy()) return false;

    // check if the enemy matches the event we're looking for.
    const isTargetEvent = battler.getCharacter().eventId() === eventId;

    // if it isn't the event we're looking for, keep looking.
    if (!isTargetEvent) return false;

    // grab the index in the collection.
    targetIndex = index;

    // we found a match!
    return true;
  });

  // return the results.
  return [foundBattler, targetIndex];
};

/**
 * Removes a battler from tracking by its index in the master tracking list.
 * @param {number} index The index to splice away.
 */
Game_Map.prototype.deleteBattlerByIndex = function(index)
{
  this._j._allBattlers.splice(index, 1);
};

/**
 * Deletes and removes a `JABS_Battler` from this map's tracking.
 * @param {JABS_Battler} targetBattler The map battler to destroy.
 * @param {boolean} holdSprite Whether or not to actually destroy the sprite of the battler.
 */
Game_Map.prototype.destroyBattler = function(targetBattler, holdSprite = false)
{
  const uuid = targetBattler.getUuid();
  const targetIndex = this._j._allBattlers.findIndex(battler => battler.getUuid() === uuid);

  // if the battler exists, then lets handle it.
  if (targetIndex > -1)
  {
    // shorthand reference to the event/sprite of the battler.
    const event = targetBattler.getCharacter();

    if (!holdSprite)
    {
      // if we're not holding the sprite, then erase it.
      event.erase();

      // set the visual component to be removed, too.
      event.setActionSpriteNeedsRemoving();
    }

    // we always remove the battler from tracking when destroying.
    this.deleteBattlerByIndex(targetIndex);
  }
};

/**
 * Adds a provided event to the current map's event list.
 * @param {Game_Event} event The `Game_Event` to add to this map.
 */
Game_Map.prototype.addEvent = function(event)
{
  this._events.push(event);
};

/**
 * Removes a provided event from the current map's event list.
 * @param {Game_Event} eventToRemove The `Game_Event` to remove from this map.
 */
Game_Map.prototype.removeEvent = function(eventToRemove)
{
  // find the index of the event we're trying to remove.
  const eventIndex = this._events.findIndex(event => event === eventToRemove);

  // confirm we found the event to remove.
  if (eventIndex > -1)
  {
    // remove it if it's an action event.
    this.handleActionEventRemoval(eventToRemove);

    // remove it if it's a loot event.
    this.handleLootEventRemoval(eventToRemove);

    // delete the event from tracking.
    delete this._events[eventIndex];
  }
};

/**
 * Handles the removal of events with an underlying `JABS_Action` from the map.
 * @param {Game_Event} actionToRemove The `Game_Event` to remove from this map.
 */
Game_Map.prototype.handleActionEventRemoval = function(actionToRemove)
{
  // don't process if this event isn't an action.
  if (!actionToRemove.isAction()) return;

  // get the relevant metadatas for the action.
  const actionMetadatas = this.actionEventsFromDataMapByUuid(actionToRemove.getActionUuid());

  // all removed events get erased.
  actionToRemove.erase();

  // command the battle map to cleanup the jabs action.
  $jabsEngine.cleanupAction(actionToRemove.getMapActionData());

  // and also to cleanup the current list of active jabs action events.
  $jabsEngine.clearActionEvents();

  // iterate over each of the metadatas for deletion.
  actionMetadatas.forEach(actionMetadata =>
  {
    // purge the action metadata from the datamap.
    delete $dataMap.events[actionMetadata.actionIndex];
  });
};

/**
 * Handles the removal of events with an underlying `JABS_LootDrop` from the map.
 * @param {Game_Event} lootToRemove The `Game_Event` to remove from this map.
 */
Game_Map.prototype.handleLootEventRemoval = function(lootToRemove)
{
  // don't process if this event isn't an action.
  if (!lootToRemove.isLoot()) return;

  // get the relevant metadatas for the loot.
  const lootMetadatas = this.lootEventsFromDataMapByUuid(lootToRemove.getLootData().uuid);

  // iterate over each of the metadatas for deletion.
  lootMetadatas.forEach(lootMetadata =>
  {
    // purge the loot metadata from the datamap.
    delete $dataMap.events[lootMetadata.lootIndex];
  });
};

/**
 * Removes all actions on the map that have been flagged for removal.
 */
Game_Map.prototype.clearExpiredJabsActionEvents = function()
{
  // grab the list of expired action events.
  const expiredActionEvents = this.expiredActionEvents();

  // get all the game_event sprites that need removing.
  expiredActionEvents.forEach(this.clearExpiredJabsActionEvent, this);
};

/**
 * Clears a particular action event from the map.
 * @param {Game_Event} event The action event to clear.
 */
Game_Map.prototype.clearExpiredJabsActionEvent = function(event)
{
  this.removeEvent(event);
};

/**
 * Removes all loot on the map that has been flagged for removal.
 */
Game_Map.prototype.clearExpiredLootEvents = function()
{
  // grab the list of expired loot events.
  const expiredLootEvents = this.expiredLootEvents();

  // get all the game_event sprites that need removing.
  expiredLootEvents.forEach(this.clearExpiredLootEvent, this);
};

/**
 * Clears a particular loot event from the map.
 * @param {Game_Event} lootEvent The loot event to clear.
 */
Game_Map.prototype.clearExpiredLootEvent = function(lootEvent)
{
  this.removeEvent(lootEvent);
};

/**
 * Handles event interaction for events in front of the player. If they exist,
 * and the player meets the criteria to interact with the event, then do so.
 * It also prevents the player from swinging their weapon willy nilly at NPCs.
 * @param {JABS_Battler} jabsBattler The battler to check the fore-facing events of.
 * @returns {boolean} True if there is an event infront of the player, false otherwise.
 */
Game_Map.prototype.hasInteractableEventInFront = function(jabsBattler)
{
  const player = jabsBattler.getCharacter();
  const direction = player.direction();
  const x1 = player.x;
  const y1 = player.y;
  const x2 = $gameMap.roundXWithDirection(x1, direction);
  const y2 = $gameMap.roundYWithDirection(y1, direction);
  const triggers = [0, 1, 2];

  // look over events directly infront of the player.
  for (const event of $gameMap.eventsXy(x2, y2))
  {
    // if the player is mashing the button at an enemy, let them continue.
    if (event.isJabsBattler()) return false;

    if (event.isTriggerIn(triggers) && event.isNormalPriority() === true)
    {
      return true;
    }
  }

  // if we're looking over a counter, address events a space away instead.
  if ($gameMap.isCounter(x2, y2))
  {
    const x3 = $gameMap.roundXWithDirection(x2, direction);
    const y3 = $gameMap.roundYWithDirection(y2, direction);
    for (const event of $gameMap.eventsXy(x3, y3))
    {
      // if the player is mashing the button at an enemy, let them continue.
      if (event.isJabsBattler()) return false;

      if (event.isTriggerIn(triggers) && event.isNormalPriority() === true)
      {
        return true;
      }
    }
  }

  return false;
};
//#endregion Game_Map