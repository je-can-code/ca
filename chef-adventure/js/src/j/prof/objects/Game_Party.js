//#region Game_Party
J.PROF.Aliased.Game_Party.set("initialize", Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  J.PROF.Aliased.Game_Party.get("initialize").call(this);
  /**
   * The j object where my extensions live.
   */
  this._j ||= {};

  /**
   * The master collection of proficiency conditionals.
   * @type {ProficiencyConditional[]}
   */
  this._j._conditionals = J.PROF.Metadata.ProficiencyConditionals;
};

/**
 * Gets all proficiency conditionals available to the party.
 * @returns {ProficiencyConditional[]}
 */
Game_Party.prototype.proficiencyConditionals = function()
{
  return this._j._conditionals;
};
//#endregion Game_Party