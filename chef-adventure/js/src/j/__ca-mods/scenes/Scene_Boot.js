//region Scene_Boot
/**
 * Extends {@link #start}.
 * Also shows the devtools window because I need that to do dev things.
 */
J.CAMods.Aliased.Scene_Boot.set('start', Scene_Boot.prototype.start);
Scene_Boot.prototype.start = function()
{
  // perform original logic.
  J.CAMods.Aliased.Scene_Boot.get('start').call(this);

  // show the dev tools automatically.
  SceneManager.showDevTools();

  // set a timer for after the devtools has loaded to focus the game window.
  setTimeout(() => nw.Window.get().focus(), 1000);
};
//endregion Scene_Boot