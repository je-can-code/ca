//region Talker
/**
 * Gets through dialogue and answers choices.
 *
 * Reading is not something the bot does: it taps through text as fast as the window allows. Every line
 * still lands in the journal, so a run can be read back as the conversation it had.
 */
class Talker
{
  /**
   * How many frames between taps on an open message. A person mashing Cross is about this fast.
   * @type {number}
   */
  static TapEvery = 6;

  /**
   * The hands doing the pressing.
   * @type {Thumbs}
   */
  #thumbs;

  /**
   * Where lines go.
   * @type {Journal}
   */
  #journal;

  /**
   * Whether the bot wants to save when something offers.
   * @type {function(): boolean}
   */
  #wantsToSave;

  /**
   * Whether to take the story branch of a choice instead of skipping. Both branches ship, so a run of
   * each is how they both get walked.
   * @type {boolean}
   */
  #takesEveryOffer;

  /**
   * The last dialogue written down, so that a message is only copied out once.
   * @type {string}
   */
  #lastLines = '';

  /**
   * The last set of choices written down.
   * @type {string}
   */
  #lastChoices = '';

  /**
   * A count of frames spent with a message open, which paces the tapping.
   * @type {number}
   */
  #frames = 0;

  /**
   * @param {Thumbs} thumbs The hands doing the pressing.
   * @param {Journal} journal Where lines go.
   * @param {function(): boolean} wantsToSave Whether the bot wants to save when offered.
   * @param {boolean} takesEveryOffer Whether to take the story branch of a choice instead of skipping.
   */
  constructor(thumbs, journal, wantsToSave, takesEveryOffer)
  {
    this.#thumbs = thumbs;
    this.#journal = journal;
    this.#wantsToSave = wantsToSave;
    this.#takesEveryOffer = takesEveryOffer;
  }

  /**
   * Strips the control codes out of a line of dialogue, leaving what a player reads.
   * @param {string} text The raw line.
   * @returns {string}
   */
  #plainTextOf(text)
  {
    return text
      .replace(/\\[A-Za-z]+\[[^\]]*\]/g, '')
      .replace(/\\[.|^!<>{}$*_]/g, '')
      .trim();
  }

  /**
   * Copies the current message into the journal, once.
   */
  #writeDownMessage()
  {
    const lines = $gameMessage._texts
      .map(text => this.#plainTextOf(text))
      .join(' ');

    if (lines === '' || lines === this.#lastLines) return;

    this.#lastLines = lines;
    this.#journal.note(`says: ${lines}`);
  }

  /**
   * Picks which choice to take. A save prompt is answered the way the bot feels about saving right now.
   * Everything else in the tutorial offers to skip itself, and unless it was told to take every offer
   * the bot does, since a choice that can be cancelled is the game's way of saying the rest is optional.
   * @returns {number} The index of the choice, or -1 to back out with cancel instead.
   */
  #chooseAnswer()
  {
    const choices = $gameMessage.choices();

    if (choices.includes('Save'))
    {
      return this.#wantsToSave() ? choices.indexOf('Save') : -1;
    }

    // a choice with no way to cancel it needs an actual answer, and the first one is as good as any.
    return this.#takesEveryOffer === false && $gameMessage.choiceCancelType() >= 0 ? -1 : 0;
  }

  /**
   * Answers the open choice with real cursor movement, one press at a time.
   * @param {Window_ChoiceList} list The open choice window.
   */
  #answerChoice(list)
  {
    const choices = $gameMessage.choices();
    const written = choices.join(' / ');

    const answer = this.#chooseAnswer();

    if (written !== this.#lastChoices)
    {
      const said = answer === -1 ? 'backs out' : `takes ${choices[answer]}`;
      this.#lastChoices = written;
      this.#journal.note(`choice: ${written}, ${said}`);
    }

    if (answer === -1)
    {
      this.#thumbs.tap('cancel');
      return;
    }

    if (list.index() === answer)
    {
      this.#thumbs.tap('ok');
      return;
    }

    this.#thumbs.tap(list.index() < answer ? 'down' : 'up');
  }

  /**
   * Deals with whatever message is open for one frame.
   * @param {Scene_Map} scene The current scene.
   */
  update(scene)
  {
    const { _choiceListWindow: list } = scene;

    this.#frames += 1;
    this.#writeDownMessage();

    if ($gameMessage.isChoice())
    {
      // the list opens a moment after the question finishes, and presses before then go nowhere.
      if (list.active && list.isOpen() && this.#frames % 2 === 0) this.#answerChoice(list);

      return;
    }

    if (this.#frames % Talker.TapEvery === 0) this.#thumbs.tap('ok');
  }

  /**
   * Forgets the last choice, so that a question asked again gets written down again.
   */
  clearMemory()
  {
    this.#lastChoices = '';
  }
}

export default Talker;
//endregion Talker
