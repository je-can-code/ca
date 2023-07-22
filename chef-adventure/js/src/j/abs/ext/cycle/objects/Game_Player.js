//region Game_Player
/**
 * If we're using cyclone movement, adjust their triggering of events to not interact
 * with battlers and such if they are also events that have event commands.
 */
J.ABS.EXT.CYCLE.Aliased.Game_Player.set('shouldTriggerEvent', Game_Player.prototype.shouldTriggerEvent);
Game_Player.prototype.shouldTriggerEvent = function(event, triggers, normal)
{
  // if the event is a battler, then we should never trigger events when mashing buttons.
  if (event.isJabsBattler()) return false;

  // perform original logic.
  return J.ABS.EXT.CYCLE.Aliased.Game_Player.get('shouldTriggerEvent').call(this, event, triggers, normal);
};

/**
 * Overwrites {@link #checkEventTriggerThere}.
 * Rounds the x2,y2 coordinates down so that counter-checks work properly.
 * @param {[number, number, number]} triggers The type of event triggers that are being used.
 */
Game_Player.prototype.checkEventTriggerThere = function(triggers)
{
  // if we cannot start events, then do not.
  if (!this.canStartLocalEvents()) return;

  // discern direction of the player.
  const direction = this.direction();

  // grab the player's current coordinates.
  const x1 = this.left;
  const y1 = this.top;

  // calculate the coordinates of the potential event to trigger.
  const x2 = CycloneMovement.roundXWithDirection(x1, direction);
  const y2 = CycloneMovement.roundYWithDirection(y1, direction);

  // trigger the event!
  this.startMapEvent(x2, y2, triggers, true);

  // extract counter differentiation of the following rounded-down coordinates.
  const isCounter = $gameMap.isCounter(Math.floor(x2), Math.floor(y2));

  // check if we need to look over a counter to trigger an event.
  if (!$gameMap.isAnyEventStarting() && isCounter)
  {
    // grab the coordinates of the event across the counter.
    const x3 = $gameMap.roundXWithDirection(x2, direction);
    const y3 = $gameMap.roundYWithDirection(y2, direction);

    // trigger the event across the counter.
    this.startMapEvent(x3, y3, triggers, true);
  }
}
//endregion Game_Player