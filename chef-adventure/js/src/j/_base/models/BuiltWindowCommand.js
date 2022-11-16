/**
 * An implementation of a class surrounding the data for a singular window command.
 */
class BuiltWindowCommand
{
  //#region properties
  /**
   * The name of the command.
   * This is what visibly shows up in the list of commands.
   * @type {string}
   */
  #name = String.empty;

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
   * The index of the icon that will be rendered on the left side of this command.
   * @type {number}
   */
  #iconIndex = 0;

  /**
   * The text color index this command will be rendered with.
   * @type {number}
   */
  #colorIndex = 0;
  //#endregion properties

  constructor(
    name,
    symbol,
    enabled = true,
    extensionData = null,
    iconIndex = 0,
    colorIndex = 0,
    rightText = String.empty)
  {
    this.#name = name;
    this.#key = symbol;
    this.#enabled = enabled;
    this.#extensionData = extensionData;
    this.#iconIndex = iconIndex;
    this.#colorIndex = colorIndex;
    this.#rightText = rightText;
  }

  //#region getters
  /**
   * Gets the name for this command.
   * @returns {string}
   */
  get name()
  {
    return this.#name;
  }

  /**
   * Gets the right-aligned text for this command.
   * @returns {string}
   */
  get rightText()
  {
    return this.#rightText;
  }

  /**
   * Gets the symbol for this command.
   * @returns {string}
   */
  get symbol()
  {
    return this.#key;
  }

  /**
   * Gets whether or not this command is enabled.
   * @returns {boolean}
   */
  get enabled()
  {
    return this.#enabled;
  }

  /**
   * Gets the underlying extension data for this command, if any is available.
   * @returns {*|null}
   */
  get ext()
  {
    return this.#extensionData;
  }

  /**
   * Gets the icon index of this command, if one is available.
   * @returns {number}
   */
  get icon()
  {
    return this.#iconIndex;
  }

  /**
   * Gets the color index of this command, if one is available.
   * @returns {number}
   */
  get color()
  {
    return this.#colorIndex;
  }
  //#endregion getters
}