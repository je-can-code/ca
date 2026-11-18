//region Menus
/**
 * Gets the bot through every scene that is not the map, by pressing buttons at them.
 *
 * Nothing here calls a scene's own methods to move things along. Choosing New Game by calling
 * `commandNewGame` would prove nothing about the title screen, and the point of having thumbs is that
 * every screen between here and the credits gets pressed the way a person presses it.
 */
class Menus
{
  /**
   * How many frames apart presses come in a menu. Menus swallow input while they open and close.
   * @type {number}
   */
  static PressEvery = 8;

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
   * The scene being dealt with, which shows when a new one has opened.
   * @type {Scene_Base|null}
   */
  #scene = null;

  /**
   * How many frames have gone by in the current scene.
   * @type {number}
   */
  #frames = 0;

  /**
   * Whether the save screen has already done what it was opened for.
   * @type {boolean}
   */
  #isDoneWithFiles = false;

  /**
   * Whether a game has been saved this run, which is what Continue on the title screen depends on.
   * @type {boolean}
   */
  #hasSave = false;

  /**
   * @param {Thumbs} thumbs The hands doing the pressing.
   * @param {Journal} journal Where lines go.
   */
  constructor(thumbs, journal)
  {
    this.#thumbs = thumbs;
    this.#journal = journal;
  }

  /**
   * Determines whether a game has been saved this run.
   * @returns {boolean}
   */
  hasSave()
  {
    return this.#hasSave;
  }

  /**
   * Moves a command window's cursor one press closer to a symbol, and presses ok once it is there.
   * @param {Window_Command} commands The window to work.
   * @param {string} symbol The command to choose.
   */
  #choose(commands, symbol)
  {
    if (commands.currentSymbol() === symbol)
    {
      this.#thumbs.tap('ok');
      return;
    }

    this.#thumbs.tap('down');
  }

  /**
   * Starts the game, or carries on with the saved one if there is one.
   * @param {Scene_Title} scene The title scene.
   */
  #title(scene)
  {
    const { _commandWindow: commands } = scene;

    if (commands.active === false || commands.isOpen() === false) return;

    this.#choose(commands, this.#hasSave ? 'continue' : 'newGame');
  }

  /**
   * Works the save screen. It opens on a column of commands, the chosen command opens a list of slots,
   * and a slot may ask for confirmation. It stays open after saving, so leaving is a step of its own.
   * @param {Scene_Files} scene The save scene.
   */
  #files(scene)
  {
    const commands = scene.commandWindow();
    const list = scene.listWindow();
    const confirm = scene.confirmWindow();

    if (confirm.active)
    {
      this.#thumbs.tap(confirm.currentSymbol() === confirm.confirmSymbol() ? 'ok' : 'up');
      return;
    }

    if (list.active)
    {
      this.#isDoneWithFiles = true;
      this.#hasSave = true;
      this.#journal.note('saves the game.');
      this.#thumbs.tap('ok');
      return;
    }

    if (commands.active === false) return;

    if (this.#isDoneWithFiles)
    {
      this.#thumbs.tap('cancel');
      return;
    }

    // a save platform offers saving, and the title screen only offers loading.
    const offersSaving = commands.findSymbol('save') !== -1;
    this.#choose(commands, offersSaving ? 'save' : 'load');
  }

  /**
   * Backs out of anything the bot does not know about, and says so once, because a screen nobody taught
   * it about is worth knowing about.
   * @param {Scene_Base} scene The scene.
   */
  #unknown(scene)
  {
    if (this.#frames === Menus.PressEvery)
    {
      this.#journal.note(`does not know this screen: ${scene.constructor.name}`);
      this.#journal.snap('unknown-screen');
    }

    this.#thumbs.tap('cancel');
  }

  /**
   * Deals with the current scene for a frame.
   * @param {Scene_Base} scene The current scene.
   */
  update(scene)
  {
    if (scene !== this.#scene)
    {
      this.#scene = scene;
      this.#frames = 0;
      this.#isDoneWithFiles = false;
    }

    this.#frames += 1;

    // the game is still loading, or something is fading.
    if (this.#frames % Menus.PressEvery !== 0 || scene.isActive() === false) return;

    switch (scene.constructor.name)
    {
      case 'Scene_Boot':
        return;
      case 'Scene_Title':
        this.#title(scene);
        return;
      case 'Scene_Files':
        this.#files(scene);
        return;
      case 'Scene_Gameover':
        this.#thumbs.tap('ok');
        return;
      default:
        this.#unknown(scene);
    }
  }
}

export default Menus;
//endregion Menus
