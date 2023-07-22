/**
 * Extends {@link #initialize}.
 * Adds extension for initializing custom members for scenes.
 */
J.BASE.Aliased.Scene_Base.set('initialize', Scene_Base.prototype.initialize);
Scene_Base.prototype.initialize = function()
{
  // perform original logic.
  J.BASE.Aliased.Scene_Base.get('initialize').call(this);

  // also add custom members to this class.
  this.initMembers();
};

/**
 * Initialize any additional custom members for this scene.
 */
Scene_Base.prototype.initMembers = function()
{
};

/**
 * Pushes this current scene onto the stack, forcing it into action.
 */
Scene_Base.prototype.callScene = function()
{
  SceneManager.push(this);
};