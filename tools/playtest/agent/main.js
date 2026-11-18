//region main
import Brain from './Brain.js';
import Journal from './Journal.js';

/**
 * The bot, bundled into one script and injected into the frozen copy of the game before any of the
 * game's own scripts run. `tools/playtest/run.js` does the bundling and the injecting, and fills in the
 * config below.
 */
const config = JSON.parse(__PLAYTEST_CONFIG__);
const journal = new Journal(config.runDirectory);

/**
 * How often to check whether the engine has come up, in milliseconds.
 * @type {number}
 */
const ENGINE_CHECK_MS = 50;

/**
 * Takes away the two things a headless run has that a player's machine does not.
 * Software rendering gets refused unless PIXI's objection to it is taken out of the request, and the
 * machine's real controllers are still plugged in, so a drifting stick would otherwise walk the bot
 * through menus. Both go in now, because the game reaches for them during its own boot.
 */
const adjustPeripherals = () =>
{
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.getContext = function(type, attributes)
  {
    if (attributes) attributes.failIfMajorPerformanceCaveat = false;

    return originalGetContext.call(this, type, attributes);
  };

  navigator.getGamepads = () => [];
};

/**
 * Listens for the game complaining. Plugin diagnostics go through the console, and an anomaly a plugin
 * thought worth reporting is exactly what a playtest should bring home.
 */
const listenForComplaints = () =>
{
  const { warn: originalWarn, error: originalError } = console;
  const textOf = values => values.map(String)
    .join(' ');

  console.warn = function(...values)
  {
    journal.complain('warning', textOf(values));
    return originalWarn.apply(console, values);
  };

  console.error = function(...values)
  {
    journal.complain('error', textOf(values));
    return originalError.apply(console, values);
  };

  window.addEventListener('error', event => journal.complain('uncaught', event.message));
  window.addEventListener('unhandledrejection', event => journal.complain('rejected', String(event.reason)));
};

/**
 * Waits for the engine and every plugin to finish loading, then hands the game over to the bot. A scene
 * existing is the signal: plugins load before the first one is ever made.
 */
const waitForEngine = () =>
{
  const check = setInterval(() =>
  {
    if (globalThis.SceneManager === undefined || SceneManager._scene === null) return;

    clearInterval(check);
    new Brain(config, journal).install();
    journal.note('the bot has the controller.');
  }, ENGINE_CHECK_MS);
};

adjustPeripherals();
listenForComplaints();
waitForEngine();
//endregion main
