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