//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.1.0 LOG] A log window for viewing on the map.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @base J-MessageTextCodes
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-MessageTextCodes
 * @help
 * ============================================================================
 * This plugin enables the ability to add and view logs in a window while on
 * the map. By itself, this plugin only creates the log window and gives access
 * to a couple utilities to build logs and add them to the window.
 *
 * This plugin was designed for JABS, but doesn't require it.
 * If added while using JABS, the log window will automatically register all
 * actions taken, damage/healing dealth, and various other details that one
 * might expect to find in this sort of window.
 *
 * Additionally, the log window is a command window under the covers, so it
 * also supports scrolling via mouse or touch.
 *
 * Controller/keyboard support for the log window is not supported.
 *
 * This plugin has two dependencies that all must be present to work:
 * - J-Base (used for drawing the logs properly onto the window)
 * - J-MessageTextCodes (used for translating text codes in logging)
 * The MZ editor will inform you where this plugin needs to be relative to the
 * other plugins (above/below/etc).
 *
 * ============================================================================
 * CHANGELOG:
 * - 2.1.0
 *    Refactor the text log manager to use different syntax.
 * - 2.0.1
 *    Small refactor of creation method aliasing.
 * - 2.0.0
 *    Refactored heavily the setup of log window.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @param defaultInactivityTime
 * @type number
 * @text Inactivity Timer Duration
 * @desc The duration in frames of how long before the window autohides itself.
 * @default 300
 *
 *
 * @command showLog
 * @text Show Log Window
 * @desc Turns the log window visible to allow logs to be displayed.
 *
 * @command hideLog
 * @text Hide Log Window
 * @desc Turns the log window invisible. Logs still get logged, but can't be seen.
 *
 * @command addLog
 * @text Add Log
 * @desc Arbitrarily create a log for the log window. Respects text codes.
 * @arg text
 * @type string
 * @default One potion was found!
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.2';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.LOG = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.LOG.Metadata = {};
J.LOG.Metadata.Name = `J-Log`;
J.LOG.Metadata.Version = `2.1.0`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.LOG.PluginParameters = PluginManager.parameters(J.LOG.Metadata.Name);
J.LOG.Metadata.InactivityTimerDuration = Number(J.LOG.PluginParameters['defaultInactivityTime']);

/**
 * A collection of all aliased methods for this plugin.
 */
J.LOG.Aliased = {};
J.LOG.Aliased.DataManager = new Map();
J.LOG.Aliased.Scene_Map = new Map();

/**
 * Plugin command for enabling the text log and showing it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "showLog", () =>
{
  $mapLogManager.showMapLog();
});

/**
 * Plugin command for disabling the text log and hiding it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "hideLog", () =>
{
  $mapLogManager.hideMapLog();
});

/**
 * Plugin command for adding an arbitrary log to the log window.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "addLog", args =>
{
  const { text } = args;
  const log = new MapLogBuilder()
    .setMessage(text)
    .build();
  $mapLogManager.addLog(log);
});
//endregion introduction

//region Map_Log
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
  }

  /**
   * Sets the message for this log.
   * @param {string} message The message to set.
   * @private
   */
  #setMessage(message)
  {
    this.#message = message;
  }

  /**
   * Gets the message for this log.
   * @returns {string}
   */
  message()
  {
    return this.#message;
  }
}
//endregion Map_Log

//region MapLogBuilder
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
  }

  /**
   * Clears the current parameters for this log.<br/>
   * This automatically runs after `build()` is run.
   */
  #clear()
  {
    this.#message = String.empty;
  }

  /**
   * Sets the message of this log.
   * @param {string} message The message to set for this log to display.
   * @returns {this} This builder, for fluent chaining.
   */
  setMessage(message)
  {
    this.#message = message;
    return this;
  }

  /**
   * Wraps a name within a text coded color.
   * @param {string} name The name to wrap.
   * @param {number} textColorIndex The text color index to wrap the name in.
   * @returns {string} The wrapped name with the text coded color.
   */
  #wrapName(name, textColorIndex)
  {
    return `\\C[${textColorIndex}]${name}\\C[0]`;
  }

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
    // eslint-disable-next-line max-len
    const message = `${aggressor} ${hurtOrHeal} ${defender} with \\Skill[${skillId}] for \\C[${color}]${amount}\\C[0]${reduction}!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
    // eslint-disable-next-line max-len
    const message = `\\C[16]${casterName}\\C[0] used \\Skill[${skillId}], but it had no effect on \\C[2]${targetName}\\C[0].`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

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
    const message = `Party cycled to ${defender}.<br>`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }
}
//endregion MapLogBuilder

//region DataManager
/**
 * The global text logger.
 * @type {MapLogManager}
 */
var $mapLogManager = null;

/**
 * Hooks into `DataManager` to create the game objects.
 */
J.LOG.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.LOG.Aliased.DataManager.get('createGameObjects').call(this);

  // generate a new instance of the text log.
  $mapLogManager = new MapLogManager();
};
//endregion DataManager

//region MapLogManager
class MapLogManager
{
  //region properties
  /**
   * The logs currently being managed.
   * @type {Map_Log[]}
   */
  #logs = [];

  /**
   * Whether or not we have an unattended log.
   * @type {boolean}
   */
  #needsProcessing = false;

  /**
   * Whether or not the log window should be visible.
   * @type {boolean}
   */
  #visible = true;
  //endregion properties

  /**
   * Gets all logs that are currently being tracked by this log manager.<br>
   * The logs will be in reverse order from that of which they are displayed in the window.
   * @returns {Map_Log[]}
   */
  getLogs()
  {
    return this.#logs;
  };

  /**
   * Adds a new log to this log manager's log tracker.<br>
   * If there are more than the maximum capacity of logs currently being tracked,
   * this will also start dropping logs from the tail until the limit is reached.
   * @param {Map_Log} log The new log to add.
   */
  addLog(log)
  {
    // add a log to the collection.
    this.#logs.push(log);

    // make sure we don't have too many logs to work with.
    this.handleLogCount();

    // alert any listeners that we have a new log.
    this.flagForProcessing();
  };

  /**
   * Maintains this log manager's the log tracker to stay under the max log count.
   */
  handleLogCount()
  {
    // check if we have too many logs.
    while (this.hasTooManyLogs())
    {
      // remove from the front until we are within the threshold.
      this.#logs.shift();
    }
  }

  /**
   * Checks whether or not this log manager has more logs than it can retain in memory.
   * @returns {boolean}
   */
  hasTooManyLogs()
  {
    return (this.#logs.length > this._maxLogCount());
  }

  /**
   * Returns the maximum count of logs that this log manager will retain in memory.
   *
   * NOTE: This is probably the only method that would ever require any overriding.
   * @returns {number}
   * @private
   */
  _maxLogCount()
  {
    return 100;
  }

  /**
   * Checks whether or not this log manager is currently in need of processing.
   */
  needsProcessing()
  {
    return this.#needsProcessing;
  }

  /**
   * Indicates this log manager has logs needing processing.
   */
  flagForProcessing()
  {
    this.#needsProcessing = true;
  }

  /**
   * Informs this log manager that logs have been processed.
   */
  acknowledgeProcessing()
  {
    this.#needsProcessing = false;
  }

  /**
   * Clears all logs currently stored by this log manager.
   */
  clearLogs()
  {
    this.#logs.splice(0, this.#logs.length);
  }

  /**
   * Returns if this log manager is currently visible.
   * @returns {boolean}
   */
  isVisible()
  {
    return this.#visible;
  }

  /**
   * Returns if this log manager is currently hidden.
   * @returns {boolean}
   */
  isHidden()
  {
    return !this.#visible;
  }

  /**
   * Hides this log manager.
   */
  hideMapLog()
  {
    this.#visible = false;
  }

  /**
   * Reveals this log manager.
   */
  showMapLog()
  {
    this.#visible = true;
  }
}
//endregion MapLogManager

//region Scene_Map
/**
 * Hooks into `initialize` to add our log.
 */
J.LOG.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.LOG.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with this plugin.
   */
  this._j._log = {};

  /**
   * The action log for the map.
   * @type {Window_MapLog}
   */
  this._j._log._actionLog = null;
};

/**
 * Extends {@link #createAllWindows}.<br>
 * Creates the action log as well.
 */
J.LOG.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.LOG.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the log.
  this.createActionLogWindow();
};

//region action log
/**
 * Creates the action log window and adds it to tracking.
 */
Scene_Map.prototype.createActionLogWindow = function()
{
  // create the window.
  const window = this.buildActionLogWindow();

  // update the tracker with the new window.
  this.setActionLogWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the action log window.
 * @returns {Window_MapLog}
 */
Scene_Map.prototype.buildActionLogWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.actionLogWindowRect();

  // create the window with the rectangle.
  const window = new Window_MapLog(rectangle);

  // deselect/deactivate the window so we don't have it look interactable.
  window.deselect();
  window.deactivate();

  // return the built and configured window.
  return window;
}

/**
 * Creates the rectangle representing the window for the action log.
 * @returns {Rectangle}
 */
Scene_Map.prototype.actionLogWindowRect = function()
{
  // an arbitrary number of rows.
  const rows = 8;

  // define the width of the window.
  const width = 600;

  // define the height of the window.
  const height = (Window_MapLog.rowHeight * (rows + 2)) - 8;

  // define the origin x of the window.
  const x = Graphics.boxWidth - width;

  // define the origin y of the window.
  const y = Graphics.boxHeight - height - 72;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked action log window.
 * @returns {Window_MapLog}
 */
Scene_Map.prototype.getActionLogWindow = function()
{
  return this._j._log._actionLog;
}

/**
 * Set the currently tracked action log window to the given window.
 * @param {Window_MapLog} window The window to track.
 */
Scene_Map.prototype.setActionLogWindow = function(window)
{
  this._j._log._actionLog = window;
}
//endregion action log
//endregion Scene_Map

//region Window_MapLog
/**
 * A window containing the logs.
 */
class Window_MapLog extends Window_Command
{
  /**
   * The height of one row; 16.
   * @type {number}
   * @static
   */
  static rowHeight = 16;

  /**
   * The in-window tracking of how long before we reduce opacity for inactivity.
   * @type {number}
   */
  inactivityTimer = 300;

  /**
   * The duration of which the inactivity timer will be refreshed to.
   * @type {number}
   */
  defaultInactivityDuration = J.LOG.Metadata.InactivityTimerDuration;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Sets the default inactivity max duration. Changing this will change how long
   * the logs remain visible.
   * @param {number} duration The new duration for how long logs remain visible.
   */
  setDefaultInactivityDuration(duration)
  {
    this.defaultInactivityDuration = duration;
  }

  /**
   * OVERWRITE Initialize this class, but with our things, too.
   * @param {Rectangle} rect The rectangle representing the shape of this window.
   */
  initialize(rect)
  {
    // perform original logic.
    super.initialize(rect);

    // run our one-time setup and configuration.
    this.configure();
  }

  /**
   * Performs the one-time setup and configuration per instantiation.
   */
  configure()
  {
    // make the window's background opacity transparent.
    this.opacity = 0;

    // fix the arrows presence to be false by default.
    this.downArrowVisible = false;
    this.upArrowVisible = false;
  }

  //region overwrites
  /**
   * Extends {@link #isScrollEnabled}.<br>
   * Also requires the this window to not be hidden for scrolling to be enabled.
   * @returns {boolean}
   * @extends
   */
  isScrollEnabled()
  {
    if ($mapLogManager.isHidden()) return false;

    return super.isScrollEnabled();
  }

  /**
   * Overrides {@link #updateArrows}
   * Forces the arrows that appear in scrollable windows to not be visible.
   * @override
   */
  updateArrows()
  {
  }

  /**
   * Extends {@link #smoothScrollTo}.<br>
   * Also refreshes the timer to prevent this window from going invisible
   * while scrolling around through the logs.
   * @param {number} x The x coordinate to scroll to.
   * @param {number} y The y coordinate to scroll to.
   * @extends
   */
  smoothScrollTo(x, y)
  {
    // perform original logic.
    super.smoothScrollTo(x, y);

    // forces the window to show if scrolling through it.
    this.showWindow();
  }

  /**
   * Overrides {@link #itemHeight}.<br>
   * Reduces the item height further to allow for more rows to be visible at once
   * within a smaller window.
   * @returns {number} The adjusted height of each row.
   * @override
   */
  itemHeight()
  {
    return Window_MapLog.rowHeight;
  }

  /**
   * Overrides {@link #drawBackgroundRect}.<br>
   * Prevents the rendering of the backdrop of each line in the window.
   * @param {Rectangle} _ The rectangle to draw the background for.
   * @override
   */
  drawBackgroundRect(_)
  {
  }

  /**
   * Extends {@link #itemRectWithPadding}.<br>
   * Shifts the rect slightly to the left to give a cleaner look.
   * @param {number} index The index of the item in the window.
   * @returns {Rectangle}
   * @override
   */
  itemRectWithPadding(index)
  {
    const rect = super.itemRectWithPadding(index);
    rect.x -= 16;
    return rect;
  }

  /**
   * Overrides {@link #drawIcon}.<br>
   * Reduces the size of the icons being drawn in the log window.
   * @param {number} iconIndex The index of the icon to draw.
   * @param {number} x The x coordinate to draw the icon at.
   * @param {number} y The y coordinate to draw the icon at.
   * @override
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
  }

  /**
   * Extends {@link #processDrawIcon}.<br>
   * Accommodates the other icon-related adjustments by manually shifting the
   * {@link textState} around before and after executing the super method execution.
   *
   * The goal of these shifts are to center the now-smaller icon inline with the text.
   * @param {number} iconIndex The index of the icon to draw.
   * @param {rm.types.TextState} textState The rolling state of the text being drawn.
   * @extends
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
  }
  //endregion overwrites

  /**
   * Update this window's drawing and the like.
   */
  update()
  {
    // process original update logic.
    super.update();

    // update our log data.
    this.updateMapLog();
  }

  /**
   * Perform the update logic that maintains this window.
   */
  updateMapLog()
  {
    // manage the incoming logging.
    this.updateLogging();

    // manage the visibility of this window.
    this.updateVisibility();
  }

  //region update logging
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
      $mapLogManager.acknowledgeProcessing();
    }
  }

  /**
   * Determines whether or not this window should update.
   * @returns {boolean} True if we need to redraw the contents, false otherwise.
   */
  shouldUpdate()
  {
    // check if we have a new log.
    return $mapLogManager.needsProcessing();
  }

  /**
   * Process all new logs.
   */
  processNewLogs()
  {
    // perform any logic for when a new log is added.
    this.onLogChange();

    // refreshing will redraw based on the updated list.
    this.refresh();
  }

  /**
   * Processes effects whenever a change in the logs occurs.
   * Occurs before the window is refreshed.
   * Open for extension.
   */
  onLogChange()
  {
    this.showWindow();
  }

  /**
   * Draws all items in the log.
   */
  makeCommandList()
  {
    this.drawLogs();
  }

  /**
   * Draws all items from the log tracker into our command window.
   */
  drawLogs()
  {
    // iterate over each log.
    $mapLogManager.getLogs().forEach((log, index) =>
    {
      // add the message as a "command" into the log window.
      this.addCommand(`\\FS[14]${log.message()}`, `log-${index}`, true, null, null, 0);
    });

    // after drawing all the logs, scroll to the bottom.
    this.smoothScrollDown(this._list.length);
  }
  //endregion update logging

  //region update visibility
  /**
   * Updates the visibility of the window.
   * Uses an inactivity timer to countdown and eventually reduce opacity once
   * a certain threshold is reached.
   */
  updateVisibility()
  {
    // if the text log is flagged as hidden, then don't show it.
    if ($mapLogManager.isHidden() || $gameMessage.isBusy())
    {
      // hide the window.
      this.hideWindow();

      // stop processing.
      return;
    }

    // decrement the timer.
    this.decrementInactivityTimer();

    // first priority check is if the timer is at or below 1 second remaining.
    if (this.inactivityTimer <= 60)
    {
      // it is, so lets fade the window accordingly.
      this.handleWindowFade();
    }

    // second priority check, if the player is interfering with the window.
    else if (this.playerInterference())
    {
      // drastically reduce visibility of the this log window while the player is overlapped.
      this.handlePlayerInterference();
    }
    // otherwise, it must be regular visibility processing.
    else
    {
      // handle opacity based on the time remaining on the inactivity timer.
      this.handleNonInterferenceOpacity(this.inactivityTimer);
    }
  }

  /**
   * Determines whether or not the player is in the way (or near it) of this window.
   * @returns {boolean} True if the player is in the way, false otherwise.
   */
  playerInterference()
  {
    const playerX = $gamePlayer.screenX();
    const playerY = $gamePlayer.screenY();
    return (playerX < this.width) && (playerY > this.y);
  }

  /**
   * Manages opacity for the window while the player is interfering with the visibility.
   */
  handlePlayerInterference()
  {
    // if we are above 64, rapidly decrement by -15 until we get below 64.
    if (this.contentsOpacity > 64) this.contentsOpacity -= 15;
    // if we are below 64, increment by +1 until we get to 64.
    else if (this.contentsOpacity < 64) this.contentsOpacity += 1;
  }

  /**
   * Reverts the opacity changes associated with the player getting in the way.
   */
  handleNonInterferenceOpacity(currentDuration)
  {
    // ensure the window is visible for the current duration.
    this.showWindow();

    this.setInactivityTimer(currentDuration);
  }

  /**
   * Decrements the inactivity timer, by 1 by default.
   */
  decrementInactivityTimer(amount = 1)
  {
    // decrement the timer.
    this.inactivityTimer -= amount;
  }

  /**
   * Sets the duration of the inactivity timer.
   * @param {number} duration The duration to set the inactivity timer to; 300 by default.
   */
  setInactivityTimer(duration = this.defaultInactivityDuration)
  {
    this.inactivityTimer = duration;
  }

  /**
   * Fades this window out based on the inactivity timer.
   */
  handleWindowFade()
  {
    // do nothing if we are where we want to be already.
    if (this.isHidden()) return;

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
  }

  /**
   * Determines whether or not this window is already hidden.
   * @returns {boolean}
   */
  isHidden()
  {
    // check if we're currently invisible.
    if (this.contentsOpacity !== 0)
    {
      // we must be invisible to be hidden.
      return false;
    }

    // check if we're out of time.
    if (this.inactivityTimer === 0)
    {
      // we must be out of time to be hidden.
      return false;
    }

    // we're hidden!
    return true;
  }

  /**
   * Hides this window entirely.
   */
  hideWindow()
  {
    // force the timer to 0.
    this.setInactivityTimer(0);

    // hide the contents.
    this.contentsOpacity = 0;
  }

  /**
   * Shows this window.
   * Refreshes the inactivity timer to 5 seconds.
   * Typically used after the log window was hidden.
   */
  showWindow()
  {
    // if the text log is flagged as hidden, then we shouldn't show it again.
    if ($mapLogManager.isHidden()) return;

    // refresh the timer back to 5 seconds.
    this.setInactivityTimer(this.defaultInactivityDuration);

    // refresh the opacity so the logs can be seen again.
    this.contentsOpacity = 255;
  }
  //endregion update visibility
}
//endregion Window_MapLog