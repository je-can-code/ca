/**
 * Extends {@link Game_System.initialize}.
 * Initializes all members of this class and adds our custom members.
 */
J.BASE.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.BASE.Aliased.Game_System.get('initialize').call(this);

  // initialize our class members.
  this.initMembers();
};

/**
 * A hook for initializing additional members in {@link Game_System}.
 */
Game_System.prototype.initMembers = function()
{
};