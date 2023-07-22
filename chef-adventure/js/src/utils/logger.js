/**
 * A simple logger utility for my cute lil RMMZ dev helper scripts.
 */
class Logger
{
  /**
   * Whether or not to use this logger.
   * @type {boolean}
   */
  static #blocked = true;

  /**
   * Enables logging.
   * @returns {boolean}
   */
  static enableLogging = () => this.#blocked = false;

  /**
   * Disables logging.
   * @returns {boolean}
   */
  static disableLogging = () => this.#blocked = true;

  /**
   * Logs some text to the window via string interpolation.
   * Will not log if logging is not enabled.
   * @param {string} text The text to log.
   */
  static log(text)
  {
    // don't log if we're not using it.
    if (this.#blocked) return;

    // log!
    console.log(`🔊 ${text}`);
  }

  /**
   * Logs some text to the window via string interpolation, period.
   * @param {string} text The text to log.
   */
  static logAnyway(text)
  {
    console.log(`👊 ${text}`);
  }
}

// export this beast.
export default Logger;