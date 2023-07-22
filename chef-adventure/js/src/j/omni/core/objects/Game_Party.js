J.OMNI.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.OMNI.Aliased.Game_Party.get('initialize').call(this);

  // initialize all omnipedia-related members.
  this.initOmnipediaMembers();
};

/**
 * Initializes all members related to the omnipedia.
 */
Game_Party.prototype.initOmnipediaMembers = function()
{
};