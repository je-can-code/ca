//region Game_ActionResult
/**
 * Extends {@link Game_ActionResult.initialize}.
 * Initializes additional members.
 */
J.ABS.Aliased.Game_ActionResult.set('initialize', Game_ActionResult.prototype.initialize);
Game_ActionResult.prototype.initialize = function()
{
  /**
   * Whether or not the result was guarded.
   * @type {boolean}
   */
  this.guarded = false;

  /**
   * Whether or not the result was parried.
   * @type {boolean}
   */
  this.parried = false;

  /**
   * The amount of damage reduced by guarding.
   * @type {number}
   */
  this.reduced = 0;

  // perform original logic.
  J.ABS.Aliased.Game_ActionResult.get('initialize').call(this);
};

/**
 * Extends `.clear()` to include wiping the custom properties.
 */
J.ABS.Aliased.Game_ActionResult.set('clear', Game_ActionResult.prototype.clear);
Game_ActionResult.prototype.clear = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_ActionResult.get('clear').call(this);

  // refresh our custom parameters.
  this.guarded = false;
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
//endregion Game_ActionResult