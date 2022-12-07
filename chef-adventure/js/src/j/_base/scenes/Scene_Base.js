/**
 * Pushes this current scene onto the stack, forcing it into action.
 */
Scene_Base.prototype.callScene = function()
{
  SceneManager.push(this);
};