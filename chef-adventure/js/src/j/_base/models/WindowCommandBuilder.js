/**
 * A builder class for constructing {@link BuiltWindowCommand}.
 */
class WindowCommandBuilder
{
  //region properties
  /**
   * The name of the command.
   * This is what visibly shows up in the list of commands.
   * @type {string}
   */
  #name = String.empty;

  /**
   * Additional lines of text to render below the main command name.
   * @type {string[]}
   */
  #lines = [];

  /**
   * The text that will be right-aligned for this command.
   * @type {string}
   */
  #rightText = String.empty;

  /**
   * The symbol of this command.
   * This is normally invisible and used for connecting this command
   * to an event hook for logical processing.
   * @type {string}
   */
  #key = String.empty;

  /**
   * Whether or not this command is enabled.
   * @type {boolean}
   */
  #enabled = true;

  /**
   * The underlying data associated with this command.
   * Usually populated with whatever this command represents data-wise.
   * @type {null|any}
   */
  #extensionData = null;

  /**
   * Any special help text associated with this command.
   * @type {string}
   */
  #helpText = String.empty;

  /**
   * The index of the icon that will be rendered on the left side of this command.
   * @type {number}
   */
  #iconIndex = 0;

  /**
   * The text color index this command will be rendered with.
   * @type {number}
   */
  #colorIndex = 0;
  //endregion properties

  /**
   * Start by defining the name, and chain additional setter methods to
   * build out this window command.
   * @param {string} name The name of the command.
   */
  constructor(name)
  {
    this.setName(name);
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the current state of this builder.
   * @returns {BuiltWindowCommand}
   */
  build()
  {
    // construct the command.
    const command = new BuiltWindowCommand(
      this.#name,
      this.#key,
      this.#enabled,
      this.#extensionData,
      this.#iconIndex,
      this.#colorIndex,
      this.#rightText,
      this.#lines,
      this.#helpText
    );

    // return the built command.
    return command;
  }

  /**
   * Sets the name of this command.
   * @param {string} name The name of this command.
   * @returns {this} This builder for fluent-building.
   */
  setName(name)
  {
    this.#name = name;
    return this;
  }

  /**
   * Adds a single line of subtext to this command.
   * @param {string} line The line of subtext to add.
   * @returns {this} This builder for fluent-building.
   */
  addSubTextLine(line)
  {
    this.#lines.push(line);
    return this;
  }

  /**
   * Adds multiple lines of subtext to this command.
   * @param {string[]} lines The lines of subtext to add.
   * @returns {this} This builder for fluent-building.
   */
  addSubTextLines(lines)
  {
    this.#lines.push(...lines);
    return this;
  }

  /**
   * Sets the subtext to be the given lines.
   * @param {string[]} lines The lines of subtext to set.
   * @returns {this} This builder for fluent-building.
   */
  setSubtextLines(lines)
  {
    this.#lines = lines;
    return this;
  }

  /**
   * Sets the right-aligned text of this command.
   * @param {string} rightText The right-text of this command.
   * @returns {this} This builder for fluent-building.
   */
  setRightText(rightText)
  {
    this.#rightText = rightText;
    return this;
  }

  /**
   * Sets the key (symbol) of this command.
   * @param {string} symbol The key of this command.
   * @returns {this} This builder for fluent-building.
   */
  setSymbol(symbol)
  {
    this.#key = symbol;
    return this;
  }

  /**
   * Sets whether or not this command is enabled.
   * @param {boolean} enabled Whether or not this command is enabled.
   * @returns {this} This builder for fluent-building.
   */
  setEnabled(enabled)
  {
    this.#enabled = enabled;
    return this;
  }

  /**
   * Sets the underlying extension data for this command.
   * @param {any} ext The underlying extension data for this command.
   * @returns {this} This builder for fluent-building.
   */
  setExtensionData(ext)
  {
    this.#extensionData = ext;
    return this;
  }

  /**
   * Sets the icon index for this command.
   * @param {number} iconIndex The index of the icon for this command.
   * @returns {this} This builder for fluent-building.
   */
  setIconIndex(iconIndex)
  {
    this.#iconIndex = iconIndex;
    return this;
  }

  /**
   * Sets the color index for this command.
   * @param {number} colorIndex The index of the color for this command.
   * @returns {this} This builder for fluent-building.
   */
  setColorIndex(colorIndex)
  {
    this.#colorIndex = colorIndex;
    return this;
  }

  /**
   * Sets the help text for this command.
   * @param {string} helpText The help text.
   * @returns {this} This builder for fluent-building.
   */
  setHelpText(helpText)
  {
    this.#helpText = helpText;
    return this;
  }
}