//region Game_Temp
/**
 * Extends {@link Game_Temp.initialize}.
 * Initializes all members of this class and adds our custom members.
 */
J.BASE.Aliased.Game_Temp.set('initialize', Game_Temp.prototype.initialize);
Game_Temp.prototype.initialize = function()
{
  // perform original logic.
  J.BASE.Aliased.Game_Temp.get('initialize').call(this);

  // initialize our class members.
  this.initMembers();
};

/**
 * A hook for initializing temporary members in {@link Game_Temp}.
 */
Game_Temp.prototype.initMembers = function()
{
};
//endregion Game_Temp