//#region Game_Map
/**
 * Parses out all enemies from the array of events on the map.
 * @param {Game_Event[]} evs An array of events.
 * @returns {JABS_Battler[]}
 */
J.ALLYAI.Aliased.Game_Map.parseBattlers = Game_Map.prototype.parseBattlers;
Game_Map.prototype.parseBattlers = function()
{
  const mapBattlers = J.ALLYAI.Aliased.Game_Map.parseBattlers.call(this);
  return mapBattlers.concat(this.parseAllyBattlers());
};

/**
 * Gets all ally battlers out of the collection of battlers.
 * This does not include the player.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getFollowerBattlers = function()
{
  return this._j._allBattlers.filter(battler => battler.isActor());
};

/**
 * Updates all ally battlers in-place.
 * For use with party-cycling.
 */
Game_Map.prototype.updateAllies = function()
{
  // get all the ally battlers from the current collection.
  const allyJabsBattlers = this.getFollowerBattlers();

  // first remove all battlers.
  this.removeBattlers(allyJabsBattlers);

  // then re-add the updated ones.
  const allies = this.parseAllyBattlers();
  this.addBattlers(allies);
};

Game_Map.prototype.addBattlers = function(battlers)
{
  // don't bother processing if the addition is empty.
  if (!battlers.length) return;

  this._j._allBattlers.splice(0, 0, ...battlers);
};

/**
 * Removes all provided battlers from the battler tracking.
 * @param {JABS_Battler[]} battlers The battlers to be removed.
 */
Game_Map.prototype.removeBattlers = function(battlers)
{
  // disengage and destroy all battlers.
  battlers.forEach(battler =>
  {
    this.removeBattler(battler, true);
  });
};

/**
 * Purges a single battler from tracking.
 * @param battler {JABS_Battler} The battler to be removed.
 * @param hold {boolean} Whether or not to hold the sprite.
 */
Game_Map.prototype.removeBattler = function(battler, hold = false)
{
  // disengage before destroying.
  battler.disengageTarget();
  // but do hold onto the event/sprite, because its a follower.
  $gameMap.destroyBattler(battler, hold);
};

/**
 * Parses all followers that are active into their battler form.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.parseAllyBattlers = function()
{
  const followers = this.getActiveFollowers();
  return followers.map(this.convertOneFollower, this);
};

/**
 * Gets all followers that are active.
 * @returns {Game_Follower[]}
 */
Game_Map.prototype.getActiveFollowers = function()
{
  const followers = $gamePlayer.followers().data();
  return followers.filter(follower => follower.isVisible());
};

/**
 * Converts a single follower into a `JABS_Battler`.
 * @param {Game_Follower} follower The follower to convert into a battler.
 * @returns {JABS_Battler}
 */
Game_Map.prototype.convertOneFollower = function(follower)
{
  // grab the battler of the follower.
  const battler = follower.actor();

  // create a builder to step through for this battler.
  const builder = new JABS_CoreDataBuilder(0);

  // set the battler.
  builder.setBattler(battler);

  // check if we're using the danger indicators.
  if (J.DANGER)
  {
    // never show the danger indicator for allies.
    builder.setShowDangerIndicator(false)
  }

  // build the core data.
  const coreData = builder.build();

  // instantiate the battler.
  const mapBattler = new JABS_Battler(follower, battler, coreData);

  // assign the map battler to the follower.
  follower.setMapBattler(mapBattler.getUuid());

  // return the built ally map battler.
  return mapBattler;
};
//#endregion Game_Map