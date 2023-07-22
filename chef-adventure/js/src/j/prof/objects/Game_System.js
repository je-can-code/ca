//region Game_System
/**
 * Hooks in and initializes the SDP system.
 */
J.PROF.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.PROF.Aliased.Game_System.get('initialize').call(this);

  // initializes members for this plugin.
  this.initProficiencyMembers();
};

Game_System.prototype.initProficiencyMembers = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the proficiency system.
   */
  this._j._proficiency ||= {};

  /**
   * The master collection of proficiency conditionals.
   * @type {ProficiencyConditional[]}
   */
  this._j._proficiency._conditionals = J.PROF.Helpers
    .TranslateProficiencyRequirements(J.PROF.PluginParameters.conditionals);
};

/**
 * Updates the list of all available proficiency conditionals from the latest plugin metadata.
 */
J.PROF.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.PROF.Aliased.Game_System.get('onAfterLoad').call(this);

  // update from the latest plugin metadata.
  this.updateProficienciesFromPluginMetadata();
};

/**
 * Updates the proficiency conditional list from the latest plugin metadata.
 * Also updates all actors' conditionals in case something changed.
 */
Game_System.prototype.updateProficienciesFromPluginMetadata = function()
{
  // refresh the proficiency conditional list from the latest plugin metadata.
  this._j._proficiency._conditionals = J.PROF.Helpers
    .TranslateProficiencyRequirements(J.PROF.PluginParameters.conditionals);

  // iterate over all the actors and update their conditionals based on this data change.
  $gameActors._data.forEach(actor =>
  {
    // the first actor in this array is null, just skip it.
    if (!actor) return;

    // update all their conditionals with the latest.
    actor.updateOwnConditionals();
  });
};

/**
 * Gets all defined proficiency conditionals.
 * @returns {ProficiencyConditional[]}
 */
Game_System.prototype.proficiencyConditionals = function()
{
  return this._j._proficiency._conditionals;
};