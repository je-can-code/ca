/*:
* @target MZ
* @plugindesc
* [v1.0 LOG] A non-battle-reliant text log (designed for JABS, though).
* @author JE
* @url https://github.com/je-can-code/rmmz
* @base J-BASE
* @base J-MessageTextCodes
* @orderAfter J-BASE
* @orderAfter J-ABS
* @orderAfter J-MessageTextCodes
* @orderBefore J-SDP
* @help
* ============================================================================
* This plugin creates a window on the screen that will act as a log of sorts.
* It was initially designed as a battle log for JABS, but it can do things
* without the help of JABS if you really want it to.
*
* If not using this with JABS, then you'll need to leverage the plugin
* commands to add logs manually where applicable.
*
* Icons were initially a part of the design, but that was never implemented
* due to lack of popularity of the plugin and never really needing it myself.
* If this starts to pick up traction and people like it, I'll refactor it to
* be more feature-complete.
* ============================================================================
* @param Enabled
* @type boolean
* @text Enable Log?
* @desc True if you want the log to be enabled, false otherwise.
* @default true
*
*
* @command Enable Text Log
* @text Enable the Text Log
* @desc Enables the text log and displays it on the screen.
*
* @command Disable Text Log
* @text Disable the Text Log
* @desc Disables the text log and renders it invisible.
*
* @command Add Text Log
* @text Add a text log
* @desc Create a new entry and add it to the text log window.
* @arg Text
* @type string
* @default One potion was found!
* @arg Icon
* @type number
* @default 1
*/

//#region plugin setup and configuration
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.LOG = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.LOG.Metadata = {};
J.LOG.Metadata.Name = `J-LOG`;
J.LOG.Metadata.Version = 1.00;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.LOG.PluginParameters = PluginManager.parameters(J.LOG.Metadata.Name);
J.LOG.Metadata.Active = Boolean(J.LOG.PluginParameters['Enabled']);
J.LOG.Metadata.Enabled = true;

/**
 * A collection of all aliased methods for this plugin.
 */
J.LOG.Aliased = {};
J.LOG.Aliased.DataManager = {};
J.LOG.Aliased.Scene_Map = {};

/**
 * Plugin command for enabling the text log and showing it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "Enable Text Log", () =>
{
  J.LOG.Metadata.Active = true;
});

/**
 * Plugin command for disabling the text log and hiding it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "Disable Text Log", () =>
{
  J.LOG.Metadata.Active = false;
});

/**
 * Plugin command for disabling the text log and hiding it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "Add Text Log", args =>
{
  const {Text, Icon} = args;
  const log = new MapLogBuilder()
    .setMessage(Text)
    .build();
  $gameTextLog.addLog(log);
});
//#endregion

//#region DataManager

/**
 * The global text logger.
 * @type {Game_TextLog}
 */
var $gameTextLog = null;

/**
 * Hooks into `DataManager` to create the game objects.
 */
J.LOG.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  J.LOG.Aliased.DataManager.createGameObjects.call(this);
  $gameTextLog = new Game_TextLog();
};
//#endregion DataManager

//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JABS objects for tracking.
 */
J.LOG.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function()
{
  J.LOG.Aliased.Scene_Map.initialize.call(this);
  this._j ||= {};
  this._j._mapTextLog = null;

  /**
   * The log window on the map.
   * @type {Window_Log}
   * @private
   */
  this._j._log = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.LOG.Aliased.Scene_Map.onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function()
{
  J.LOG.Aliased.Scene_Map.onMapLoaded.call(this);
  this.createTextLog();
};

/**
 * Creates the log window and adds it to tracking.
 */
Scene_Map.prototype.createTextLog = function()
{
  const width = 768;
  const rows = 10;
  const height = (32 * rows) - 8;
  const x = 0;
  const y = Graphics.boxHeight - height;
  const rect = new Rectangle(x, y, width, height);
  this._j._log = new Window_Log(rect);
  this._j._log.deselect();
  this._j._log.deactivate();
  this.addWindow(this._j._log);
};

/**
 * Toggles the visibility and functionality of the externally managed text log.
 * @param {boolean} toggle Whether or not to display the external text log.
 */
Scene_Map.prototype.toggleLog = function(toggle = true)
{
  if (J.LOG.Metadata.Enabled)
  {
    // this._j._mapTextLog.toggle(toggle);
  }
};
//#endregion Scene_Map

//#region Game_TextLog
/**
 * The manager that handles all logs in the `Window_TextLog`.
 */
function Game_TextLog()
{
  this.initialize(...arguments);
}

Game_TextLog.prototype = {};
Game_TextLog.prototype.constructor = Game_TextLog;

/**
 * Initializes this class.
 */
Game_TextLog.prototype.initialize = function()
{
  this.initMembers();
};

/**
 * Gets whether or not we are tracking any logs.
 * @returns {boolean} True if we are, false otherwise.
 */
Game_TextLog.prototype.hasLogs = function()
{
  return this._logs.length > 0;
};

/**
 * Gets whether or not we have an unattended log.
 * @returns {boolean} True if we have unattended logs, false otherwise.
 */
Game_TextLog.prototype.hasNewLog = function()
{
  return this._hasNewLog;
};

/**
 * Sets whether or not we have an unattended log.
 * @param {boolean} hasNewLog True if we need to handle a new log, false otherwise.
 */
Game_TextLog.prototype.setHasNewLog = function(hasNewLog = true)
{
  this._hasNewLog = hasNewLog;
};

/**
 * Untoggles the flag and acknowledges the newly received log.
 */
Game_TextLog.prototype.acknowledgeNewLog = function()
{
  this._hasNewLog = false;
};

/**
 * Initializes all properties for this class.
 */
Game_TextLog.prototype.initMembers = function()
{
  /**
   * The logs currently being managed.
   * @type {Map_Log[]}
   */
  this._logs = [];

  /**
   * Whether or not we have an unattended log.
   * @type {boolean}
   */
  this._hasNewLog = false;

  /**
   * Whether or not the log window should be visible.
   * @type {boolean}
   */
  this._isVisible = true;
};

/**
 * Gets all currently pending logs.
 * @returns {Map_Log[]} All logs currently in queue.
 */
Game_TextLog.prototype.getLogs = function()
{
  return this._logs;
};

/**
 * Adds a new text log to the window.
 * @param {Map_Log} log The log to add to the window.
 */
Game_TextLog.prototype.addLog = function(log)
{
  // add a log to the collection.
  this._logs.push(log);

  // alert any listeners that we have a new log.
  this.setHasNewLog();
};

/**
 * Empties the currently pending logs.
 */
Game_TextLog.prototype.clearLogs = function()
{
  this._logs.splice(0, this._logs.length);
};

Game_TextLog.prototype.isVisible = function()
{
  return this._isVisible;
};

Game_TextLog.prototype.setLogVisibility = function(visible)
{
  this._isVisible = visible;
  return visible
    ? "Window_Log is now visible."
    : "Window_Log is now hidden."
};
//#endregion

//#region Window_Log
/**
 * A window containing the logs.
 */
class Window_Log extends Window_Command
{
  /**
   * The in-window tracking of how long before we reduce opacity for inactivity.
   * @type {number}
   */
  inactivityTimer = 300;

  /**
   * The duration of which the inactivity timer will be refreshed to.
   * @type {number}
   */
  defaultInactivityDuration = 300;

  /**
   *
   * @type {boolean}
   */
  forceHide = false;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  };

  /**
   * Sets the default inactivity max duration. Changing this will change how long
   * the logs remain visible.
   * @param {number} duration The new duration for how long logs remain visible.
   */
  setDefaultInactivityDuration(duration)
  {
    this.defaultInactivityDuration = duration;
  };

  /**
   * Sets whether or not this window should be forcefully hidden, regardless of logging.
   * @param {boolean} forceHide True if this window should be hidden, false otherwise.
   */
  setForceHide(forceHide)
  {
    this.forceHide = forceHide;
  };

  /**
   * OVERWRITE Initialize this class, but with our things, too.
   * @param {Rectangle} rect The rectangle representing the shape of this window.
   */
  initialize(rect)
  {
    // run our parent class's initialize.
    super.initialize(rect);

    // run our one-time setup and configuration.
    this.configure();
  };

  /**
   * Performs the one-time setup and configuration per instantiation.
   */
  configure()
  {
    // make the window's background opacity transparent.
    this.opacity = 0;
  };

  //#region overwrites
  /**
   * OVERWRITE Forces the arrows that appear in scrollable windows to not be visible.
   */
  updateArrows()
  {
    this.downArrowVisible = false;
    this.upArrowVisible = false;
  };

  /**
   * OVERWRITE Make our rows narrow-er.
   * @returns {number} The height of each row.
   */
  itemHeight()
  {
    return 16;
  };

  /**
   * OVERWRITE Removes the drawing of the background-per-row.
   * @param {Rectangle} rect The rectangle to draw the background for.
   */
  drawBackgroundRect(rect) { };

  /**
   * OVERWRITE Reduces the size of the icons being drawn in the log window.
   * @param {number} iconIndex The index of the icon to draw.
   * @param {number} x The x coordinate to draw the icon at.
   * @param {number} y The y coordinate to draw the icon at.
   */
  drawIcon(iconIndex, x, y)
  {
    // just copy-paste of the icon drawing variable math.
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;

    // the last two parameters reduce the size of the icon to a smaller size.
    // this allows the icons to not look so clumsy in the log.
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, 16, 16);
  };

  /**
   * Extends the draw-icon processing for this window to slightly adjust how
   * icons are drawn since we're also drawing em good and smol.
   * @param {number} iconIndex The index of the icon to draw.
   * @param {rm.types.TextState} textState The rolling state of the text being drawn.
   */
  processDrawIcon(iconIndex, textState)
  {
    // before drawing the icon, draw it a bit lower since its smaller.
    textState.y += 8;

    // draw the icon.
    super.processDrawIcon(iconIndex, textState);

    // move the text state back up to where it was before.
    textState.y -= 8;

    // because we didn't draw a full-sized icon, we move the textState.x back a bit.
    textState.x -= 16;
  };
  //#endregion overwrites

  /**
   * Update this window's drawing and the like.
   */
  update()
  {
    // process original update logic.
    super.update();

    // update our log data.
    this.updateMapLog();
  };

  /**
   * Perform the update logic that maintains this window.
   */
  updateMapLog()
  {
    // manage the incoming logging.
    this.updateLogging();

    // manage the visibility of this window.
    this.updateVisibility();
  };

  //#region update logging
  /**
   * The update of the logging.
   * The processing of incoming messages, and updating the contents of this window
   * occur thanks to this function.
   */
  updateLogging()
  {
    // check if we have a need to update.
    if (this.shouldUpdate())
    {
      // process the logs.
      this.processNewLogs();

      // acknowledge the new logs.
      $gameTextLog.acknowledgeNewLog();
    }
  };

  /**
   * Determines whether or not this window should update.
   * @returns {boolean} True if we need to redraw the contents, false otherwise.
   */
  shouldUpdate()
  {
    // check if we have a new log.
    return $gameTextLog.hasNewLog();
  };

  /**
   * Process all new logs.
   */
  processNewLogs()
  {
    // perform any logic for when a new log is added.
    this.onLogChange();

    // refreshing will redraw based on the updated list.
    this.refresh();
  };

  /**
   * Processes effects whenever a change in the logs occurs.
   * Occurs before the window is refreshed.
   * Open for extension.
   */
  onLogChange()
  {
    this.showWindow();
  };

  /**
   * Draws all items in the log.
   */
  makeCommandList()
  {
    this.drawLogs();
  };

  /**
   * Draws all items from the log tracker into our command window.
   */
  drawLogs()
  {
    // iterate over each log.
    $gameTextLog.getLogs().forEach((log, index) =>
    {
      // add the message as a "command" into the log window.
      this.addCommand(`\\FS[14]${log.message()}`, `log-${index}`, true, null, null, 0);
    });

    // after drawing all the logs, scroll to the bottom.
    this.smoothScrollDown(this._list.length);
  };
  //#endregion update logging

  //#region update visibility
  /**
   * Updates the visibility of the window.
   * Uses an inactivity timer to countdown and eventually reduce opacity once
   * a certain threshold is reached.
   */
  updateVisibility()
  {
    // if the text log is flagged as hidden, then don't show it.
    if (!$gameTextLog.isVisible())
    {
      this.hideWindow();
      return;
    }

    // decrement the timer.
    this.decrementInactivityTimer();

    // if the timer is at or below 100, then
    if (this.inactivityTimer <= 60)
    {
      // fade the window accordingly.
      this.fadeWindow();
    }
  };

  /**
   * Decrements the inactivity timer, by 1 by default.
   */
  decrementInactivityTimer(amount = 1)
  {
    // decrement the timer.
    this.inactivityTimer -= amount;
  };

  /**
   * Sets the duration of the inactivity timer.
   * @param {number} duration The duration to set the inactivity timer to; 300 by default.
   */
  setInactivityTimer(duration = this.defaultInactivityDuration)
  {
    this.inactivityTimer = duration;
  };

  /**
   * Fades this window out based on the inactivity timer.
   */
  fadeWindow()
  {
    // check if this is the "other" of every other frame.
    if (this.inactivityTimer % 2 === 0)
    {
      // reduce opacity if it is.
      this.contentsOpacity -= 12;
    }
    // otherwise, check if the timer is simply 0.
    else if (this.inactivityTimer === 0)
    {
      // and hide the window if it is.
      this.hideWindow();
    }
  };

  /**
   * Hides this window entirely.
   */
  hideWindow()
  {
    // force the timer to 0.
    this.setInactivityTimer(0);

    // hide the contents.
    this.contentsOpacity = 0;
  };

  /**
   * Shows this window.
   * Refreshes the inactivity timer to 5 seconds.
   * Typically used after the log window was hidden.
   */
  showWindow()
  {
    // if the text log is flagged as hidden
    if (!$gameTextLog.isVisible()) return;

    // refresh the timer back to 5 seconds.
    this.setInactivityTimer(this.defaultInactivityDuration);

    // refresh the opacity so the logs can be seen again.
    this.contentsOpacity = 255;
  };
  //#endregion update visibility
}
//#endregion Window_Log

//#region Map_Log
/**
 * A model representing a single log in the log window.
 */
class Map_Log
{
  /**
   * The message of this log.
   * @type {string}
   * @private
   */
  #message = String.empty;

  /**
   * Constructor.
   * @param {string} message The message of this log.
   */
  constructor(message)
  {
    this.#setMessage(message);
  };

  /**
   * Sets the message for this log.
   * @param {string} message The message to set.
   * @private
   */
  #setMessage(message)
  {
    this.#message = message;
  };

  /**
   * Gets the message for this log.
   * @returns {string}
   */
  message()
  {
    return this.#message;
  };
}
//#endregion Map_Log

//#region MapLogBuilder
/**
 * A fluent-builder for the logger on the map.
 */
class MapLogBuilder
{
  /**
   * The current message that this log contains.
   * @type {string}
   */
  #message = "message-unset";

  /**
   * Builds the log based on the currently provided info.
   * @returns {Map_Log} The built log.
   */
  build()
  {
    // instantiate the log.
    const log = new Map_Log(this.#message);

    // clear this builder of its instance data.
    this.#clear();

    // return the log.
    return log;
  };

  /**
   * Clears the current parameters for this log.<br/>
   * This automatically runs after `build()` is run.
   */
  #clear()
  {
    this.#message = String.empty;
  };

  /**
   * Sets the message of this log.
   * @param {string} message The message to set for this log to display.
   * @returns {this} This builder, for fluent chaining.
   */
  setMessage(message)
  {
    this.#message = message;
    return this;
  };

  /**
   * Wraps a name within a text coded color.
   * @param {string} name The name to wrap.
   * @param {number} textColorIndex The text color index to wrap the name in.
   * @returns {string} The wrapped name with the text coded color.
   */
  #wrapName(name, textColorIndex)
  {
    return `\\C[${textColorIndex}]${name}\\C[0]`;
  };

  /**
   * Sets up a message based on the context of a target battler being hit by a caster's skill.
   * @param {string} targetName The name of the target battler hit by the skill.
   * @param {string} casterName The name of the battler who casted the skill.
   * @param {number} skillId The id of the skill the target was hit by.
   * @param {string} amount The amount of damage (as string) the target battler was hit for.
   * @param {string} reduction The amount of damage (as string) the target battler mitigated.
   * @param {boolean} isHealing True if this is healing, false otherwise.
   * @param {boolean} isCritical True if this is critical, false otherwise.
   * @returns {this} This builder, for fluent chaining.
   */
  setupExecution(targetName, casterName, skillId, amount, reduction, isHealing, isCritical)
  {
    // the caster's name, wrapped in an aggressive color.
    const aggressor = this.#wrapName(casterName, 2);

    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // determine the type of execution this is, hurting or healing.
    let hurtOrHeal;
    if (isCritical)
    {
      hurtOrHeal = isHealing ? "critically healed" : "landed a critical";
    }
    else
    {
      hurtOrHeal = isHealing ? "healed" : "hit";
    }

    // the text color index is based on whether or not its flagged as healing.
    const color = isHealing ? 29 : 10;

    // construct the message.
    const message = `${aggressor} ${hurtOrHeal} ${defender} with \\Skill[${skillId}] for \\C[${color}]${amount}\\C[0]${reduction}!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of a battler being defeated.
   * @param {string} targetName The name of the battler defeated.
   * @returns {this} This builder, for fluent chaining.
   */
  setupTargetDefeated(targetName)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} was defeated.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of an actor learning a skill.
   * @param {string} targetName The name of the actor learning the skill.
   * @param {number} skillIdLearned The id of the skill being learned.
   * @returns {this} This builder, for fluent chaining.
   */
  setupSkillLearn(targetName, skillIdLearned)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} learned \\Skill[${skillIdLearned}]!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of an actor leveling up.
   * @param {string} targetName The name of the actor reaching a new level.
   * @param {number} levelReached The level newly reached.
   * @returns {this} This builder, for fluent chaining.
   */
  setupLevelUp(targetName, levelReached)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} has reached level \\*${levelReached}\\*!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of a battler becoming afflicted with a state.
   * @param {string} targetName The name of the battler becoming afflicted.
   * @param {number} stateId The state id of the state being afflicted.
   * @returns {this} This builder, for fluent chaining.
   */
  setupStateAfflicted(targetName, stateId)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} became afflicted with \\State[${stateId}].`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of a battler retaliating.
   * @param {string} targetName The name of the battler retaliating.
   * @returns {this} This builder, for fluent chaining.
   */
  setupRetaliation(targetName)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} retaliated!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of a battler parrying a caster's skill.
   * @param {string} targetName The name of the battler parrying.
   * @param {string} casterName The name of the battler being parried.
   * @param {number} skillId The id of the skill being parried.
   * @param {boolean} isPreciseParry True if the parry is a precise parry, false otherwise.
   * @returns {this} This builder, for fluent chaining.
   */
  setupParry(targetName, casterName, skillId, isPreciseParry)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const prefix = isPreciseParry ? "precise-" : "";
    const suffix = isPreciseParry ? " with finesse!" : ".";
    const message = `${defender} ${prefix}parried ${casterName}'s \\Skill[${skillId}]${suffix}`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of a battler dodging the caster's skill.
   * @param {string} targetName The name of the battler dodging.
   * @param {string} casterName The name of the battler being dodged.
   * @param {number} skillId The id of the skill being dodged.
   * @returns {this} This builder, for fluent chaining.
   */
  setupDodge(targetName, casterName, skillId)
  {
    // the caster's name, wrapped in an aggressive color.
    const aggressor = this.#wrapName(casterName, 2);

    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} dodged ${aggressor}'s \\Skill[${skillId}].`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of a battler landing a skill on another battler,
   * but the spell did no damage and applied no states.
   * @param {string} targetName The name of the battler dodging.
   * @param {string} casterName The name of the battler being dodged.
   * @param {number} skillId The id of the skill being dodged.
   * @returns {this} This builder, for fluent chaining.
   */
  setupUndamaged(targetName, casterName, skillId)
  {
    // construct the message.
    const message = `\\C[16]${casterName}\\C[0] used \\Skill[${skillId}], but it had no effect on \\C[2]${targetName}\\C[0].`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of party cycling to a given battler.
   * @param {string} targetName The name of the battler being party cycled to.
   * @returns {this} This builder, for fluent chaining.
   */
  setupPartyCycle(targetName)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `Party cycled to ${defender}.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of a battler using an item.
   * @param {string} targetName The name of the battler being party cycled to.
   * @param {number} itemId The id of the item we're using the last of.
   * @returns {this} This builder, for fluent chaining.
   */
  setupUsedItem(targetName, itemId)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} used the \\Item[${itemId}].`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of using the last item/tool and unequipping it.
   * @param {number} itemId The id of the item we're using the last of.
   * @returns {this} This builder, for fluent chaining.
   */
  setupUsedLastItem(itemId)
  {
    // construct the message.
    const message = `The last \\Item[${itemId}] was consumed and unequipped.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on teh context of a battler earning experience.
   * @param {string} targetName The name of the battler earning experience.
   * @param {number} expGained The amount of experience earned by the battler.
   * @returns {this} This builder, for fluent chaining.
   */
  setupExperienceGained(targetName, expGained)
  {
    // wrap the amount in the appropriate color.
    const exp = this.#translateReward("exp", expGained);

    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} gained \\*${exp}\\* experience.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Sets up a message based on the context of the party finding gold.
   * @param {number} goldFound The amount of gold found by the party.
   * @returns {this} This builder, for fluent chaining.
   */
  setupGoldFound(goldFound)
  {
    // wrap the amount in the appropriate color.
    const gold = this.#translateReward("gold", goldFound);

    // construct the message.
    const message = `The party found \\*${gold}\\* gold.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  #translateReward(rewardType, amount)
  {
    switch (rewardType)
    {
      case "exp":
        return `\\C[6]${amount}\\C[0]`;
      case "gold":
        return `\\C[14]${amount}\\C[0]`;
      default:
        return amount;
    }
  };

  /**
   * Sets up a message based on the context of the player picking up loot.
   * @param {string} targetName The name of the player.
   * @param {"armor"|"weapon"|"item"} lootType One of "armor", "weapon", or "item".
   * @param {number} lootId The id of the loot from the database.
   * @returns {this} This builder, for fluent chaining.
   */
  setupLootObtained(targetName, lootType, lootId)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // translate the loot based on type and id.
    const loot = this.#translateLoot(lootType, lootId);

    // construct the message.
    const message = `${defender} obtained the \\*${loot}\\*.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };

  /**
   * Translates into the proper text code based on loot type and id.
   * @param {"armor"|"weapon"|"item"} lootType One of "armor", "weapon", or "item".
   * @param {number} lootId The id of the loot from the database.
   * @returns {string} The compiled wrapped text code of the loot.
   */
  #translateLoot(lootType, lootId)
  {
    switch (lootType)
    {
      case "armor":
        return `\\Armor[${lootId}]`;
      case "weapon":
        return `\\Weapon[${lootId}]`;
      case "item":
        return `\\Item[${lootId}]`;
      default:
        return String.empty;
    }
  };

  /**
   * Sets up a message based on the context of a battler earning SDP points.
   * @param {string} targetName The name of the battler earning points.
   * @param {number} amount The amount of SDP points earned.
   * @returns {this} This builder, for fluent chaining.
   */
  setupSdpAcquired(targetName, amount)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} acquired \\*${amount}\\* SDP points.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  };
}
//#endregion MapLogBuilder
//ENDOFFILE