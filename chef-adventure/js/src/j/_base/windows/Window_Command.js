//#region Window_Command
/**
 * OVERWRITE Draws the color and icon along with the item itself in the command window.
 */
Window_Command.prototype.drawItem = function(index)
{
  const rect = this.itemLineRect(index);
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
  let commandName = `${this.commandName(index)}`;
  commandName = this.handleColor(commandName, index);
  commandName = this.handleIcon(commandName, index);

  this.drawTextEx(commandName, rect.x + 4, rect.y, rect.width);

  const rightText = this.commandRightText(index)
  if (rightText)
  {
    const textWidth = this.textWidth(rightText);
    this.drawText(rightText, rect.width - textWidth, rect.y, textWidth, "right");
  }
};

/**
 * Wraps the command in color if a color index is provided.
 * @param {string} command The comman as raw text.
 * @param {number} index The index of this command in the window.
 * @returns {string}
 */
Window_Command.prototype.handleColor = function(command, index)
{
  const commandColor = this.commandColor(index);
  if (commandColor)
  {
    return `\\C[${commandColor}]${command}\\C[0]`;
  }

  return command;
};

/**
 * Prepends the icon for this command if applicable.
 * @param {string} command The comman as raw text.
 * @param {number} index The index of this command in the window.
 * @returns {string}
 */
Window_Command.prototype.handleIcon = function(command, index)
{
  const commandIcon = this.commandIcon(index);
  if (commandIcon)
  {
    return `\\I[${commandIcon}]${command}`;
  }

  return command;
};

/**
 * Retrieves the icon for the given command in the window if it exists.
 * @param {number} index the index of the command.
 * @returns {number} The icon index for the command, or 0 if it doesn't exist.
 */
Window_Command.prototype.commandIcon = function(index)
{
  return this._list.at(index).icon;
};

/**
 * Retrieves the color for the given command in the window if it exists.
 * @param {number} index the index of the command.
 * @returns {number} The color index for the command, or 0 if it doesn't exist.
 */
Window_Command.prototype.commandColor = function(index)
{
  return this._list.at(index).color;
};

Window_Command.prototype.commandRightText = function(index)
{
  return this._list.at(index).rightText;
};

/**
 * Gets all commands currently in this list.
 * @returns {BuiltWindowCommand[]}
 */
Window_Command.prototype.commandList = function()
{
  return this._list;
};

/**
 * Overwrites {@link #addCommand}.
 * Adds additional metadata to a command.
 * @param {string} name The visible name of this command.
 * @param {string} symbol The symbol for this command.
 * @param {boolean=} enabled Whether or not this command is enabled; defaults to true.
 * @param {object=} ext The extra data for this command; defaults to null.
 * @param {number=} icon The icon index for this command; defaults to 0.
 * @param {number=} color The color index for this command; defaults to 0.
 */
Window_Command.prototype.addCommand = function(
  name,
  symbol,
  enabled = true,
  ext = null,
  icon = 0,
  color = 0,
)
{
  this._list.push({name, symbol, enabled, ext, icon, color});
};

/**
 * Adds a pre-built command using the {@link BuiltWindowCommand} implementation.
 * @param {BuiltWindowCommand} command The command to be added.
 */
Window_Command.prototype.addBuiltCommand = function(command)
{
  this._list.push(command);
};

/**
 * Identical to {@link #addCommand}, except that this adds the new command to
 * the front of the list. This results in vertical lists having a new item prepended to
 * the top, and in horizontal lists having a new item prepended to the left.
 * @param {string} name The visible name of this command.
 * @param {string} symbol The symbol for this command.
 * @param {boolean=} enabled Whether or not this command is enabled; defaults to true.
 * @param {object=} ext The extra data for this command; defaults to null.
 * @param {number=} icon The icon index for this command; defaults to 0.
 * @param {number=} color The color index for this command; defaults to 0.
 */
Window_Command.prototype.shiftCommand = function(
  name,
  symbol,
  enabled = true,
  ext = null,
  icon = 0,
  color = 0,
)
{
  this._list.unshift({name, symbol, enabled, ext, icon, color});
};
//#endregion Window_Command