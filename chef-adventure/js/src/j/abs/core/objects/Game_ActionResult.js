
//#region Game_ActionResult
/**
 * Injects additional possible results into all `Game_ActionResult`s.
 */
J.ABS.Aliased.Game_ActionResult.initialize = Game_ActionResult.prototype.initialize;
Game_ActionResult.prototype.initialize = function()
{
  this.parried = false;
  this.reduced = 0;
  J.ABS.Aliased.Game_ActionResult.initialize.call(this);
};

/**
 * Extends `.clear()` to include wiping the custom properties.
 */
J.ABS.Aliased.Game_ActionResult.clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function()
{
  J.ABS.Aliased.Game_ActionResult.clear.call(this);
  this.parried = false;
  this.reduced = 0;
};

/**
 * OVERWRITE Removes the check for "hit vs rng", and adds in parry instead.
 */
Game_ActionResult.prototype.isHit = function()
{
  return this.used && !this.parried && !this.evaded;
};
//#endregion Game_ActionResult