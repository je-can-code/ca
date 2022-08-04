//#region Game_Player
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
//#endregion Game_Player