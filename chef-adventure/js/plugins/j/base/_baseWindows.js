/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] Mods/Adds for the various window object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of BASE.
 * This is a cluster of all changes/overwrites to the objects that would
 * otherwise be found in the rmmz_windows.js, such as Window_Gold. Also, any
 * new things that follow the pattern that defines a window object can be found
 * in here.
 * ============================================================================
 */

//#region Window_Command
/**
 * Draws the icon along with the item itself in the command window.
 */
J.BASE.Aliased.Window_Command.drawItem = Window_Command.prototype.drawItem;
Window_Command.prototype.drawItem = function(index) {
  J.BASE.Aliased.Window_Command.drawItem.call(this, index);
  const commandIcon = this.commandIcon(index);
  if (commandIcon) {
    const rect = this.itemLineRect(index);
    this.drawIcon(commandIcon, rect.x-32, rect.y+2)
  }
};

/**
 * Overwrites the `itemLineRect` (x starting coordinate for drawing) if there
 * is an icon to draw at the start of a command.
 * @returns {Rectangle}
 */
J.BASE.Aliased.Window_Command.itemLineRect = Window_Command.prototype.itemLineRect;
Window_Command.prototype.itemLineRect = function(index) {
  const commandIcon = this.commandIcon(index);
  if (commandIcon) {
    let baseRect = J.BASE.Aliased.Window_Command.itemLineRect.call(this, index);
    baseRect.x += 32;
    return baseRect;
  } else {
    return J.BASE.Aliased.Window_Command.itemLineRect.call(this, index);
  }
};

/**
 * Retrieves the icon for the given command in the window if it exists.
 * @param {number} index the index of the command.
 * @returns {number} The icon index for the command, or 0 if it doesn't exist.
 */
Window_Command.prototype.commandIcon = function(index) {
  return this._list[index].icon;
};

/**
 * An overload for the `addCommand()` function that allows adding an icon to a command.
 * @param {string} name The visible name of this command.
 * @param {string} symbol The symbol for this command.
 * @param {boolean} enabled Whether or not this command is enabled.
 * @param {object} ext The extra data for this command.
 * @param {number} icon The icon index for this command.
 */
Window_Command.prototype.addCommand = function(name, symbol, enabled = true, ext = null, icon = 0) {
  this._list.push({ name, symbol, enabled, ext, icon });
};
//#endregion Window_Command
//ENDFILE