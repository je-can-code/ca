//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.2.0 LOG] A log window for viewing on the map.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-MessageTextCodes
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-MessageTextCodes
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables logging functionality.
 * It has three built in logging managers:
 * - Action Log
 * - Loot Log
 * - DiaLog
 *
 * Each of the logging managers is responsible for different types of logging
 * for the player to observe.
 *
 * This plugin was designed for JABS, but doesn't require it.
 * If added while using JABS, the log window will automatically register all
 * actions taken, damage/healing dealth, loot and such picked up, and more.
 *
 * Additionally, the log window is a command window under the covers, so it
 * also supports scrolling via mouse/touch.
 *
 * Controller/keyboard support for the log window is not supported.
 *
 * Depends on other plugins of mine:
 * - J-Base (used for drawing the logs properly onto the window)
 * - J-MessageTextCodes (used for translating text codes in logging)
 *
 * Integrates with others of mine plugins:
 * - J-ABS; enables logging of the player/allies/enemies' actions.
 * - J-SDP; enables logging of SDP gains.
 * ============================================================================
 * THE ACTION LOG
 * This log is designed for the player to view various interactions that happen
 * through the course of playing the game. While this plugin doesn't require
 * it, it was designed to be used with JABS.
 *
 * Things that get reported to the Action Log (with JABS):
 * - a skill being used (player/allies/enemies)
 * - a target being defeated (player/allies/enemies)
 * - a skill being learned (player/allies/enemies)
 * - a level up (player/allies)
 * - a state being applied to oneself (player/allies/enemies)
 * - a retaliation (player/allies/enemies)
 * - a skill being parried (player/allies/enemies)
 * - a skill being dodged (player/allies/enemies)
 * - a skill not affecting a target (player/allies/enemies)
 * - the act of party cycling (player)
 * - the experience gained (the leader, others gain it, but no logs are added)
 * - the sdp points found (the leader, others gain it, but no logs are added)
 *
 * Without JABS, nothing is added by default and must be woven into wherever
 * a developer wants it to show up since most usages and executions would
 * happen in a non-Scene_Map context.
 *
 * This window is effectively just a Window_Command under the covers, which
 * means it is nothing more special than your average Show Choices window or
 * what have you. However, it is not accessible to the keyboard or controller,
 * which means only a mouse may interact with it (due to the fact that it
 * cannot be "selected").
 *
 * ============================================================================
 * THE LOOT LOG
 * This log is designed for the player to exclusively messages related to items
 * and their acquisition or loss.
 *
 * Things that get reported to the Loot Log (with JABS):
 * - the gold found (on enemy defeat)
 * - an item being used (player)
 *   - also if the last item in the party's possession was used (player)
 *
 * Without JABS, nothing is added by default. It was a conscious decision not
 * to integrate the loot log with the Game_Party#gainItem() function- so that
 * other devs may have control over when it the logs are added, in case there
 * were items that should be added silently.
 *
 * ============================================================================
 * THE DIALOG
 * This log is designed for the player to view messages that occur while things
 * on the map are still executing. This portion of the plugin has nothing to do
 * with JABS and is not influenced by it.
 *
 * To add messages to the DiaLog, you'll need to utilize a plugin command.
 * In it, you will find the parameters are similar to that of a regular message
 * window, except that it is smaller, and in the upper right corner. You can
 * specify the message (max of three lines), and optionally a face image and
 * index to accompany the message to enable chatter that doesn't interrupt the
 * flow of gameplay.
 *
 * It is worth noting that the DiaLog window is an extended version of the
 * Action Log window, and bears many of the same sorts of functionality,
 * including the ability to scroll with the mouse and not control it with the
 * keyboard/controller. It will automagically become invisible after lack of
 * interaction.
 *
 * When setting up events that add to the DiaLog, it is encouraged to consider
 * using parallel events that add the messages with Waits in between each
 * message to give it a proper dialogue-like effect rather than dumping all the
 * messages in at once, but not being able to see them because the player has
 * to scroll up.
 *
 * ============================================================================
 * CHANGELOG:
 * - 2.2.0
 *    Added DiaLog functionality, enabling passive chats to happen on the map.
 *    Added Loot Log functionality, where loot-related logs now show up.
 *    Refactored around the various log-related classes.
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
 * @command showActionLog
 * @text Show Action Log Window
 * @desc Turns the action log window visible to allow logs to be displayed.
 *
 * @command hideActionLog
 * @text Hide Action Log Window
 * @desc Turns the action log window invisible. Logs still get logged, but can't be seen.
 *
 * @command addActionLog
 * @text Add Log
 * @desc Arbitrarily create a log for the log window. Respects text codes.
 * @arg text
 * @type string
 * @default One potion was found!
 *
 * @command clearActionLog
 * @text Clear Action Logs
 * @desc Clears all the logs out of the action log.
 *
 *
 * @command showDiaLog
 * @text Show DiaLog Window
 * @desc Turns the adialog window visible to allow logs to be displayed.
 *
 * @command hideDiaLog
 * @text Hide DiaLog Window
 * @desc Turns the dialog window invisible. Logs still get logged, but can't be seen.
 *
 * @command addDiaLog
 * @text Add DiaLog
 * @desc Adds a single DiaLog into the DiaLog Window. Respects text codes.
 * @arg lines
 * @type multiline_string
 * @text Message
 * @desc The message for the window; it should never be more than 3 lines.
 * @default Hello World!
 * @arg faceName
 * @type file
 * @text Face Filename
 * @desc The filename for the face to use; use empty string for no face.
 * @default
 * @arg faceIndex
 * @type number
 * @text Face Index
 * @desc The index of the face on the given face file; use -1 for no face.
 * @min -1
 * @max 7
 * @default -1
 *
 * @command clearDiaLog
 * @text Clear DiaLog
 * @desc Clears all the logs out of the dialog log.
 *
 *
 * @command showLootLog
 * @text Show Loot Log Window
 * @desc Turns the action log window visible to allow logs to be displayed.
 *
 * @command hideLootLog
 * @text Hide Loot Log Window
 * @desc Turns the action log window invisible. Logs still get logged, but can't be seen.
 *
 * @command addLootLog
 * @text Add Loot Log
 * @desc Arbitrarily create a log for the log window. Respects text codes.
 * @arg lootId
 * @type number
 * @default 1
 * @arg lootType
 * @type select
 * @option Item
 * @value item
 * @option Weapon
 * @value weapon
 * @option Armor
 * @value armor
 *
 * @command clearLootLog
 * @text Clear Loot Logs
 * @desc Clears all the logs out of the action log.
 *
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
 * One of the log managers that are for {@link Scene_Map}.<br/>
 * This manager handles the window that contains the combat and loot interactions.
 * @type {MapLogManager}
 */
var $actionLogManager = null;

/**
 * One of the log managers that are for {@link Scene_Map}.<br/>
 * This manager handles the window that contains the various chat messages.
 * @type {MapLogManager}
 */
var $diaLogManager = null;

/**
 * One of the log managers that are for {@link Scene_Map}.<br/>
 * This manager handles the window that contains the various loot messages.
 * @type {MapLogManager}
 */
var $lootLogManager = null;
//endregion introduction

//region plugin commands
//region action log
/**
 * Plugin command for enabling the text log and showing it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "showActionLog", () =>
{
  $actionLogManager.showLog();
});

/**
 * Plugin command for disabling the text log and hiding it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "hideActionLog", () =>
{
  $actionLogManager.hideLog();
});

/**
 * Plugin command for adding an arbitrary log to the action log window.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "addActionLog", args =>
{
  const { text } = args;
  const customActionLog = new ActionLogBuilder()
    .setMessage(text)
    .build();
  $actionLogManager.addLog(customActionLog);
});

/**
 * Plugin command for adding an arbitrary log to the dialog window.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "clearActionLog", () =>
{
  $actionLogManager.clearLogs();
});

//endregion action log

//region dia log
/**
 * Plugin command for enabling the dialog and showing it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "showDiaLog", () =>
{
  $diaLogManager.showLog();
});

/**
 * Plugin command for disabling the dialog and hiding it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "hideDiaLog", () =>
{
  $diaLogManager.hideLog();
});

/**
 * Plugin command for adding an arbitrary log to the dialog window.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "addDiaLog", args =>
{
  const {
    lines, faceName, faceIndex
  } = args;
  const actualLines = lines.split(/[\r\n]+/);
  const log = new DiaLogBuilder()
    .setLines(actualLines)
    .setFaceName(faceName)
    .setFaceIndex(faceIndex)
    .build();
  $diaLogManager.addLog(log);
});

/**
 * Plugin command for adding an arbitrary log to the dialog window.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "clearDiaLog", () =>
{
  $diaLogManager.clearLogs();
});
//endregion dia log

//region loot log
/**
 * Plugin command for enabling the loot log and showing it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "showLootLog", () =>
{
  $lootLogManager.showLog();
});

/**
 * Plugin command for disabling the loot log and hiding it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "hideLootLog", () =>
{
  $lootLogManager.hideLog();
});

/**
 * Plugin command for adding an arbitrary log to the loot log window.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "addLootLog", args =>
{
  const {
    lootId, lootType
  } = args;
  const log = new LootLogBuilder()
    .setupLootObtained(lootType, lootId)
    .build();
  $lootLogManager.addLog(log);
});

/**
 * Plugin command for clearing the loot log window.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "clearLootLog", () =>
{
  $lootLogManager.clearLogs();
});
//endregion loot log

//endregion plugin commands

//region ActionLog
/**
 * A model representing a single log in the log window.
 */
class ActionLog
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

//endregion ActionLog

//region MapLogBuilder
/**
 * A fluent-builder for building action-related logs for the {@link Window_MapLog}.
 */
class ActionLogBuilder
{
  /**
   * The current message that this log contains.
   * @type {string}
   */
  #message = "message-unset";

  /**
   * Builds the log based on the currently provided info.
   * @returns {ActionLog} The built log.
   */
  build()
  {
    // instantiate the log.
    const log = new ActionLog(this.#message);

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
      hurtOrHeal = isHealing
        ? "critically healed"
        : "landed a critical";
    }
    else
    {
      hurtOrHeal = isHealing
        ? "healed"
        : "hit";
    }

    // the text color index is based on whether or not its flagged as healing.
    const color = isHealing
      ? 29
      : 10;

    // construct the message.
    // eslint-disable-next-line max-len
    const message = `${aggressor} ${hurtOrHeal} ${defender} with \\Skill[${skillId}] for \\C[${color}]${amount}\\C[0]${reduction}!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  setupTerrainDamage(targetName, skillId, amount, reduction, isHealing, isCritical)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // determine the type of execution this is, hurting or healing.
    let hurtOrHeal;
    if (isCritical)
    {
      hurtOrHeal = isHealing
        ? "critically healed"
        : "devastatingly damaged";
    }
    else
    {
      hurtOrHeal = isHealing
        ? "restored"
        : "struck";
    }

    // the text color index is based on whether or not its flagged as healing.
    const color = isHealing
      ? 29
      : 10;

    // construct the message.
    // eslint-disable-next-line max-len
    const message = `${defender} was ${hurtOrHeal} by \\Skill[${skillId}] for \\C[${color}]${amount}\\C[0]${reduction}!`;

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
    const prefix = isPreciseParry
      ? "precise-"
      : "";
    const suffix = isPreciseParry
      ? " with finesse!"
      : ".";
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
    const message = `Party cycled to ${defender}.`;

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
    const exp = `\\C[6]${expGained}\\C[0]`;

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

//region DiaLog
/**
 * A single log message designed for the {@link Window_DiaLog} to display.
 */
class DiaLog
{
  /**
   * The lines that make up the text for this log.
   * @type {string[]}
   */
  #lines = [];

  /**
   * The filename of the face image associated with this log.
   * @type {string|String.empty}
   */
  #faceName = String.empty;

  /**
   * The index of the face image associated with this log.
   * @type {number}
   */
  #faceIndex = -1;

  /**
   * Constructor.<br/>
   * All parameters have defaults.
   * @param {string[]=} messageLines The lines that make up the message portion of this log.
   * @param {string=} faceName The filename that contains the face for this log.
   * @param {number=} faceIndex The index that maps to the face for this log.
   */
  constructor(messageLines = [], faceName = "", faceIndex = -1)
  {
    this.#setLines(messageLines);
    this.#setFaceName(faceName);
    this.#setFaceIndex(faceIndex);
  }

  /**
   * Sets the lines that make up this message log.
   * @param {string[]} lines The lines of the message.
   */
  #setLines(lines)
  {
    if (!Array.isArray(lines))
    {
      console.warn('Attempted to set the lines of a DiaLog with a non-array.');
      console.warn(lines);
    }

    this.#lines = lines;
  }

  /**
   * Gets the lines that make up this message log.
   * @returns {string[]}
   */
  lines()
  {
    return this.#lines;
  }

  /**
   * Sets the filename of the face image associated with this message.
   * @param {string} faceName The filename of the face image for this message.
   */
  #setFaceName(faceName)
  {
    this.#faceName = faceName;
  }

  /**
   * Gets the filename of the face associated with this message.
   * @returns {string}
   */
  faceName()
  {
    return this.#faceName;
  }

  /**
   * Sets the face index to the given index.
   * @param {number} faceIndex The face index for this message.
   */
  #setFaceIndex(faceIndex)
  {
    this.#faceIndex = faceIndex;
  }

  /**
   * Gets the face index associated with this message.
   * @returns {number}
   */
  faceIndex()
  {
    return this.#faceIndex;
  }
}

//endregion DiaLog

//region DiaLogBuilder
/**
 * A fluent-builder for building chat-related logs for the {@link Window_DiaLog}.
 */
class DiaLogBuilder
{
  /**
   * The lines that make up the text for this log.
   * @type {string[]}
   */
  #lines = [];

  /**
   * The filename of the face image associated with this log.
   * @type {string|String.empty}
   */
  #faceName = String.empty;

  /**
   * The index of the face image associated with this log.
   * @type {number}
   */
  #faceIndex = -1;

  /**
   * Builds the log in its current state and clears it.
   * @returns {ActionLog}
   */
  build()
  {
    // build the log.
    const log = new DiaLog(// copy the lines over.
      [ ...this.#lines ], // assign the face information.
      this.#faceName, this.#faceIndex);

    // empty out the data from the builder.
    this.clear();

    // return what was built.
    return log;
  }

  /**
   * Clears the log data to a blank slate.
   * @returns {DiaLogBuilder}
   */
  clear()
  {
    this.#lines = [];
    this.#faceIndex = -1;
    this.#faceName = String.empty;
    return this;
  }

  /**
   * Adds a line to this dialog builder.
   * @param {string} line The line to add.
   * @returns {this}
   */
  addLine(line)
  {
    this.#lines.push(line);
    return this;
  }

  /**
   * Sets the lines for this dialog builder.
   * @param {string[]} lines The lines to set.
   * @returns {this} This builder for fluent chaining.
   */
  setLines(lines)
  {
    this.#lines = lines;
    return this;
  }

  /**
   * Sets the filename (without the extension) for the face image of this dialog builder.
   * @param {string} faceName The filename.
   * @returns {this}
   */
  setFaceName(faceName)
  {
    this.#faceName = faceName;
    return this;
  }

  /**
   * Sets the index for which face to use in the face sheet.
   * @param {number} faceIndex The index of the face.
   * @returns {this}
   */
  setFaceIndex(faceIndex)
  {
    this.#faceIndex = faceIndex;
    return this;
  }
}

//endregion DiaLogBuilder

//region LootLogBuilder
/**
 * A fluent-builder for building loot-related logs for the {@link Window_LootLog}.
 */
class LootLogBuilder
{
  /**
   * The current message that this log contains.
   * @type {string}
   */
  #message = "message-unset";

  /**
   * Builds the log based on the currently provided info.
   * @returns {ActionLog} The built log.
   */
  build()
  {
    // instantiate the log.
    const log = new ActionLog(this.#message);

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
   * Sets up a message based on the usage of an item.
   * @param {number} itemId The id of the item we're using the last of.
   * @returns {this} This builder, for fluent chaining.
   */
  setupUsedItem(itemId)
  {
    // construct the message.
    const message = `Used the \\Item[${itemId}].`;

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
    const message = `The last \\Item[${itemId}] was used.`;

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
    const gold = `\\C[14]${goldFound}\\C[0]`;

    // construct the message.
    const message = `Found \\*${gold}\\* gold.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of the player picking up loot.
   * @param {"armor"|"weapon"|"item"} lootType One of "armor", "weapon", or "item".
   * @param {number} lootId The id of the loot from the database.
   * @returns {this} This builder, for fluent chaining.
   */
  setupLootObtained(lootType, lootId)
  {
    // translate the loot based on type and id.
    const lootName = this.#translateLoot(lootType, lootId);

    // construct the bold message.
    const message = `\\*${lootName}\\* acquired.`;

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
        return `\\Armor[${lootId}] (${$gameParty.numItems($dataArmors.at(lootId))})`;
      case "weapon":
        return `\\Weapon[${lootId}] (${$gameParty.numItems($dataWeapons.at(lootId))})`;
      case "item":
        return `\\Item[${lootId}] (${$gameParty.numItems($dataItems.at(lootId))})`;
      default:
        return String.empty;
    }
  }
}

//endregion LootLogBuilder

//region DataManager
/**
 * Hooks into `DataManager` to create the game objects.
 */
J.LOG.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.LOG.Aliased.DataManager.get('createGameObjects')
    .call(this);

  // generate a new instance of the action log manager.
  $actionLogManager = new MapLogManager();
  $actionLogManager.setMaxLogCount(30);

  // generate a new instance of the dia log manager.
  $diaLogManager = new MapLogManager();
  $diaLogManager.setMaxLogCount(10);

  // generate a new instance of the loot log manager.
  $lootLogManager = new MapLogManager();
  $lootLogManager.setMaxLogCount(100);
};
//endregion DataManager

//region MapLogManager
class MapLogManager
{
  //region properties
  /**
   * The logs currently being managed.
   * @type {ActionLog[]|DiaLog[]}
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

  #maxLogCount = 100;

  //endregion properties

  /**
   * Gets all logs that are currently being tracked by this log manager.<br>
   * The logs will be in reverse order from that of which they are displayed in the window.
   * @returns {ActionLog[]|DiaLog[]|LootLog[]}
   */
  getLogs()
  {
    return this.#logs;
  }

  /**
   * Adds a new log to this log manager's log tracker.<br>
   * If there are more than the maximum capacity of logs currently being tracked,
   * this will also start dropping logs from the tail until the limit is reached.
   * @param {ActionLog} log The new log to add.
   */
  addLog(log)
  {
    // add a log to the collection.
    this.#logs.push(log);

    // make sure we don't have too many logs to work with.
    this.handleLogCount();

    // alert any listeners that we have a new log.
    this.flagForProcessing();
  }

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
    return (this.#logs.length > this.maxLogCount());
  }

  /**
   * Returns the maximum count of logs that this log manager will retain in memory.
   *
   * NOTE: This is probably the only method that would ever require any overriding.
   * @returns {number}
   * @private
   */
  maxLogCount()
  {
    return this.#maxLogCount;
  }

  /**
   * Sets the max log count to a given amount.
   * @param newMaxLogCount
   */
  setMaxLogCount(newMaxLogCount)
  {
    this.#maxLogCount = newMaxLogCount;
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
    this.flagForProcessing();
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
  hideLog()
  {
    this.#visible = false;
  }

  /**
   * Reveals this log manager.
   */
  showLog()
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
  J.LOG.Aliased.Scene_Map.get('initialize')
    .call(this);

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

  /**
   * The chat-centric log for the map.
   * @type {Window_DiaLog}
   */
  this._j._log._diaLog = null;
};

/**
 * Extends {@link #createAllWindows}.<br>
 * Creates the action log as well.
 */
J.LOG.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.LOG.Aliased.Scene_Map.get('createAllWindows')
    .call(this);

  // create the actions log.
  this.createActionLogWindow();

  // create the chat log.
  this.createDiaLogWindow();

  // create the loot log.
  this.createLootLogWindow();
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
  const window = new Window_MapLog(rectangle, $actionLogManager);

  // deselect/deactivate the window so we don't have it look interactable.
  window.deselect();
  window.deactivate();

  // return the built and configured window.
  return window;
};

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
};

/**
 * Set the currently tracked action log window to the given window.
 * @param {Window_MapLog} window The window to track.
 */
Scene_Map.prototype.setActionLogWindow = function(window)
{
  this._j._log._actionLog = window;
};
//endregion action log

//region dia log
/**
 * Creates the dia log window and adds it to tracking.
 */
Scene_Map.prototype.createDiaLogWindow = function()
{
  // create the window.
  const window = this.buildDiaLogWindow();

  // update the tracker with the new window.
  this.setDiaLogWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the dia log window.
 * @returns {Window_DiaLog}
 */
Scene_Map.prototype.buildDiaLogWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.diaLogWindowRect();

  // create the window with the rectangle.
  const window = new Window_DiaLog(rectangle, $diaLogManager);

  // deselect/deactivate the window so we don't have it look interactable.
  window.deselect();
  window.deactivate();

  // return the built and configured window.
  return window;
};

/**
 * Creates the rectangle representing the window for the dia log.
 * @returns {Rectangle}
 */
Scene_Map.prototype.diaLogWindowRect = function()
{
  // an arbitrary number of rows.
  const rows = 3;

  // define the width of the window.
  const width = 700;

  // define the height of the window.
  const height = (Window_DiaLog.rowHeight * (rows)) + 24;

  // define the origin x of the window.
  const x = Graphics.boxWidth - width;

  // define the origin y of the window.
  const y = Graphics.verticalPadding;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked dia log window.
 * @returns {Window_DiaLog}
 */
Scene_Map.prototype.getDiaLogWindow = function()
{
  return this._j._log._diaLog;
};

/**
 * Set the currently tracked dia log window to the given window.
 * @param {Window_DiaLog} window The window to track.
 */
Scene_Map.prototype.setDiaLogWindow = function(window)
{
  this._j._log._diaLog = window;
};
//endregion dia log

//region loot log
/**
 * Creates the dia log window and adds it to tracking.
 */
Scene_Map.prototype.createLootLogWindow = function()
{
  // create the window.
  const window = this.buildLootLogWindow();

  // update the tracker with the new window.
  this.setLootLogWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the loot log window.
 * @returns {Window_LootLog}
 */
Scene_Map.prototype.buildLootLogWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.lootLogWindowRect();

  // create the window with the rectangle.
  const window = new Window_LootLog(rectangle, $lootLogManager);

  // deselect/deactivate the window so we don't have it look interactable.
  window.deselect();
  window.deactivate();

  // return the built and configured window.
  return window;
};

/**
 * Creates the rectangle representing the window for the loot log.
 * @returns {Rectangle}
 */
Scene_Map.prototype.lootLogWindowRect = function()
{
  // an arbitrary number of rows.
  const rows = 12;

  // define the width of the window.
  const width = 350;

  // define the height of the window.
  const height = (Window_LootLog.rowHeight * (rows)) + 24;

  // define the origin x of the window.
  const x = Graphics.boxWidth - width;

  // define the origin y of the window.
  const y = (Graphics.boxHeight / 2) - (height / 2);

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked loot log window.
 * @returns {Window_LootLog}
 */
Scene_Map.prototype.getLootLogWindow = function()
{
  return this._j._log._diaLog;
};

/**
 * Set the currently tracked loot log window to the given window.
 * @param {Window_LootLog} window The window to track.
 */
Scene_Map.prototype.setLootLogWindow = function(window)
{
  this._j._log._diaLog = window;
};
//endregion loot log
//endregion Scene_Map

/* NOTE: the file is prefixed with an underscore explicitly because the build script I use concats files in order of
  which they are found alphabetically in their folders. This class is being extended by the Window_DiaLog class, and
  so it must be ordered to be found ahead of that.
*/

//region Window_MapLog
/**
 * A base window that manages standard log management in a command window.<br/>
 * The default {@link Window_MapLog} is used for the action log.
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
   * The underlying data source that logs are derived from.
   * @type {MapLogManager}
   */
  logManager = null;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   * @param {MapLogManager} logManager the manager that this window leverages to get logs from.
   */
  constructor(rect, logManager)
  {
    super(rect);

    // bind this log manager.
    this.logManager = logManager;
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
   * Extends {@link #initialize}.<br/>
   * Initialize this class, but with our things, too.
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
    if (this.logManager.isHidden()) return false;

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

    // validate there are commands in this window, first.
    if (this.hasCommands())
    {
      // forces the window to show if scrolling through it.
      this.showWindow();
    }
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
      this.logManager.acknowledgeProcessing();
    }
  }

  /**
   * Determines whether or not this window should update.
   * @returns {boolean} True if we need to redraw the contents, false otherwise.
   */
  shouldUpdate()
  {
    // check if we have a new log.
    return this.logManager.needsProcessing();
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
    // empty the current list.
    this.clearCommandList();

    // grab all the listings available.
    const commands = this.buildCommands();

    // add all the built commands into the list.
    commands.forEach(this.addBuiltCommand, this);

    // after drawing all the logs, scroll to the bottom.
    this.smoothScrollDown(this.commandList().length);
  }

  /**
   * Builds all commands for this action log window.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // do nothing if the log manager is not yet set.
    if (!this.logManager) return [];

    // iterate over each log and build a command for them.
    // return the built commands.
    return this.logManager.getLogs()
      .map((log, index) =>
      {
        // add the message as a "command" into the log window.
        return new WindowCommandBuilder(`\\FS[14]${log.message()}`)
          .setSymbol(`log-${index}`)
          .setEnabled(true)
          .build();
      });
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
    if (this.logManager.isHidden() || $gameMessage.isBusy())
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
    // identify where on the screen the player is.
    const playerX = $gamePlayer.screenX();
    const playerY = $gamePlayer.screenY();

    // check if the player is to the right of this window's origin X
    // check if the player is below this window's origin Y.
    const xInterference = (playerX > this.x) && playerX < (this.x + this.width);
    const yInterference = (playerY > this.y) && playerY < (this.y + this.height);

    // return what we deduced.
    return (xInterference) && (yInterference);
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
      this.fadeContentsOpacityTick();
    }
    // otherwise, check if the timer is simply 0.
    else if (this.inactivityTimer === 0)
    {
      // and hide the window if it is.
      this.hideWindow();
    }
  }

  fadeContentsOpacityTick()
  {
    // reduce opacity if it is.
    this.contentsOpacity -= 12;
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
    if (this.logManager.isHidden()) return;

    // refresh the timer back to 5 seconds.
    this.setInactivityTimer(this.defaultInactivityDuration);

    // refresh the opacity so the logs can be seen again.
    this.contentsOpacity = 255;
  }

  //endregion update visibility
}

//endregion Window_MapLog

//region Window_DiaLog
/**
 * An extension/modification of the base {@link Window_MapLog}.<br/>
 * The {@link Window_DiaLog} is used for the chatter log.
 */
class Window_DiaLog extends Window_MapLog
{
  /**
   * The height of one row; 64.<br/>
   * This is intended to be equivalent to four regular log lines.
   * @type {number}
   */
  static rowHeight = 64;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   * @param {MapLogManager} logManager the manager that this window leverages to get logs from.
   */
  constructor(rect, logManager)
  {
    super(rect, logManager);
  }

  //region overwrites
  /**
   * Overrides {@link drawFace}.<br/>
   * Blits the face image at a size fitted to each row instead of the full image size.
   */
  drawFace(faceName, faceIndex, x, y, width, height)
  {
    // copy pasta of the original face drawing techniques.
    const actualWidth = width || ImageManager.faceWidth;
    const actualHeight = height || ImageManager.faceHeight;
    const bitmap = ImageManager.loadFace(faceName);
    const pw = ImageManager.faceWidth;
    const ph = ImageManager.faceHeight;
    const sw = Math.min(actualWidth, pw);
    const sh = Math.min(actualHeight, ph);
    const dx = Math.floor(x + Math.max(actualWidth - pw, 0) / 2);
    const dy = Math.floor(y + Math.max(actualHeight - ph, 0) / 2);
    const sx = Math.floor((faceIndex % 4) * pw + (pw - sw) / 2);
    const sy = Math.floor(Math.floor(faceIndex / 4) * ph + (ph - sh) / 2);

    // designate that the image should be rendered at a smaller w:h size.
    const widthHeight = Window_DiaLog.rowHeight;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, widthHeight, widthHeight);
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
    return Window_DiaLog.rowHeight;
  }

  //endregion overwrites

  /**
   * Builds all commands for this dialog window.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // do nothing if the log manager is not yet set.
    if (!this.logManager) return [];

    // build all the commands from the dia logs.
    // return the built commands.
    return this.logManager.getLogs()
      .map((log, index) =>
      {
        /** @type {DiaLog} */
        const currentLog = log;

        // use the first line for the "main" line of the message.
        const commandName = currentLog.lines()
          .at(0);

        // use everything after the first line for the rest of the message.
        const dialogLines = currentLog.lines()
          .slice(1);

        // build the new "command".
        return new WindowCommandBuilder(commandName)
          .setSymbol(`log-${index}`)
          .setEnabled(true)
          .setTextLines(dialogLines)
          .flagAsMultiline()
          .setFaceName(currentLog.faceName())
          .setFaceIndex(currentLog.faceIndex())
          .build();
      });
  }
}

//endregion Window_DiaLog

//region Window_LootLog
/**
 * An extension/modification of the base {@link Window_MapLog}.<br/>
 * The {@link Window_DiaLog} is used for the chatter log.
 */
class Window_LootLog extends Window_MapLog
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   * @param {MapLogManager} logManager the manager that this window leverages to get logs from.
   */
  constructor(rect, logManager)
  {
    super(rect, logManager);
  }

  /**
   * Builds all commands for this action log window.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // do nothing if the log manager is not yet set.
    if (!this.logManager) return [];

    // iterate over each log and build a command for them.
    const commands = this.logManager.getLogs()
      .map((log, index) =>
      {
        // add the message as a "command" into the log window.
        return new WindowCommandBuilder(`\\FS[14]${log.message()}`)
          .setSymbol(`log-${index}`)
          .setEnabled(true)
          .build();
      });

    // return the built commands.
    return commands;
  }
}

//endregion Window_LootLog