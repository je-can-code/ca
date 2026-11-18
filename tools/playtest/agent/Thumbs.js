//region Thumbs
/**
 * The bot's hands, and the only part of it allowed to touch the game's input.
 *
 * Buttons are written straight into `Input._currentState`, which is the same table a keyboard or a
 * gamepad writes to. Everything downstream of that table runs exactly as it does for a person, so the
 * bot cannot do anything a controller could not: it has no way to attack without pressing the button,
 * and a press during a cooldown is wasted the same way it is for a player.
 *
 * Nothing stays pressed by itself. Each frame starts with every button up, and whatever the bot wants
 * held has to be asked for again, so a decision that stops being made can never leave a button stuck.
 */
class Thumbs
{
  /**
   * Every button the bot can reach. These are the game's own symbols rather than physical keys.
   * @type {string[]}
   */
  static Buttons = [
    'ok', 'cancel', 'shift', 'tab',
    'up', 'down', 'left', 'right',
    'pageup', 'pagedown', 'l2', 'r2',
    'start', 'select',
  ];

  /**
   * The button that moves the character in each of the engine's four directions.
   * @type {Record<number, string>}
   */
  static DirectionButtons = { 2: 'down', 4: 'left', 6: 'right', 8: 'up' };

  /**
   * The buttons asked for so far this frame.
   * @type {Set<string>}
   */
  #asked = new Set();

  /**
   * The buttons that were down last frame.
   * @type {Set<string>}
   */
  #wasDown = new Set();

  /**
   * Keeps a button down for this frame.
   * @param {string} button The button to hold.
   */
  hold(button)
  {
    this.#asked.add(button);
  }

  /**
   * Presses a button for a single frame.
   * The engine only calls a press a trigger on its first frame, so a button already down has to come
   * back up before it can be tapped again. Asking anyway costs nothing and simply waits a frame.
   * @param {string} button The button to tap.
   */
  tap(button)
  {
    // a finger has to lift before it can press again.
    if (this.#wasDown.has(button)) return;

    this.#asked.add(button);
  }

  /**
   * Reads which way the d-pad has been pushed so far this frame.
   * @returns {{x: number, y: number}} -1, 0 or 1 on each axis, the same way round as the map.
   */
  pushed()
  {
    return {
      x: Number(this.#asked.has('right')) - Number(this.#asked.has('left')),
      y: Number(this.#asked.has('down')) - Number(this.#asked.has('up')),
    };
  }

  /**
   * Takes the thumb off the d-pad, whatever else has asked for it this frame.
   */
  releaseDirections()
  {
    Object.values(Thumbs.DirectionButtons)
      .forEach(button => this.#asked.delete(button));
  }

  /**
   * Writes this frame's buttons into the game's input. Has to run before `Input.update` for the game
   * to see the press on the same frame the bot decided on it.
   */
  apply()
  {
    // every button is written every frame, because a scene change wipes the table without warning.
    Thumbs.Buttons.forEach(button =>
    {
      Input._currentState[button] = this.#asked.has(button);
    });

    // what was asked for this frame is what the next frame sees as already down.
    this.#wasDown = this.#asked;
    this.#asked = new Set();
  }
}

export default Thumbs;
//endregion Thumbs
