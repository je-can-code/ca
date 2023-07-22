/**
 * OVERWRITES {@link Scene_Map.onMapTouch}.
 * Disables auto-movement when clicking a tile on the map.
 * Logs event data of clicked events.
 */
Scene_Map.prototype.onMapTouch = function()
{
  const x = $gameMap.canvasToMapX(TouchInput.x);
  const y = $gameMap.canvasToMapY(TouchInput.y);

  // disable the auto-move functionality by removing it.
  //$gameTemp.setDestination(x, y);

  // log the event data at the given coordinates.
  this.logClickedTarget(x, y);
};

Scene_Map.prototype.logClickedTarget = function(x, y)
{
  // don't log if we aren't allowed to.
  if (!$gameTemp.canClickToLogEvent()) return;

  // log all events/player/allies clicked.
  this.logClickedEvents(x, y);
  this.logClickedPlayer(x, y);
  this.logClickedAnyAllies(x, y);
};

Scene_Map.prototype.logClickedEvents = function(x, y)
{
  // grab the clicked event list at the target x:y.
  const clickedEvents = $gameMap.eventsXy(x, y);

  // iterate over each of the events at the location to log their data.
  clickedEvents.forEach(event =>
  {
    // log out the data as-applicable.
    this.extractAndLogBattlerData(event, x, y);
  });
};

Scene_Map.prototype.logClickedPlayer = function(x, y)
{
  // make sure the player was clicked.
  if ($gamePlayer.pos(x, y))
  {
    // log the output.
    this.extractAndLogBattlerData($gamePlayer, x, y);
  }
};

Scene_Map.prototype.logClickedAnyAllies = function(x, y)
{
  // if we aren't showing followers, don't try to log their data.
  if (!$gamePlayer.followers().isVisible()) return;

  // iterate over the followers.
  $gamePlayer.followers().data().forEach(follower =>
  {
    // make sure the follower was clicked.
    if (follower.pos(x, y))
    {
      // log the output.
      this.extractAndLogBattlerData(follower, x, y);
    }
  });
};

Scene_Map.prototype.extractAndLogBattlerData = function(target, x, y)
{
  // if there is no target, then don't try.
  if (!target) return;

  // grab the battler of the target.
  const battler = target.getJabsBattler();

  // if the target doesn't have a battler, then don't try.
  if (!battler)
  {
    // if it isn't a battler, we can still log the event data.
    console.log(`[x:${x}, y:${y}]`, 'NOT A JABS BATTLER', target);

    // and stop processing.
    return;
  }

  // otherwise, log the jabs battler data.
  console.log(`[x:${x}, y:${y}]\n[uuid:${battler.getUuid()}]\n[name:${battler.getBattler().name()}]\n`, battler);
};