//#region Scene_Difficulty
/**
 * The difficulty scene for managing the current difficulty.
 */
class Scene_Difficulty extends Scene_MenuBase
{
  constructor()
  {
    super();
    this.initialize();
  }

  /**
   * The entry point of this scene.
   */
  initialize()
  {
    super.initialize(this);
    this.initMembers();
  }

  /**
   * Initializes all properties for this scene.
   */
  initMembers()
  {
    this._j = {
      /**
       * The help window of the current action.
       * @type {Window_Help}
       */
      _difficultyHelpWindow: null,

      /**
       * The list of SDPs available.
       * @type {Window_DifficultyList}
       */
      _difficultyListWindow: null,

      /**
       * The details of a given SDP.
       * @type {Window_DifficultyDetails}
       */
      _difficultyDetailsWindow: null,
    };
  }

  /**
   * Extends `.create()` to include our window creation.
   */
  create()
  {
    super.create();
    this.createAllWindows();
  }

  /**
   * Extends `.start()` to include our post-window setup.
   */
  start()
  {
    super.start();
    const appliedDifficulty = $gameSystem.getAppliedDifficulty();

    // select the current difficulty if it is in the list and not locked.
    this._j._difficultyListWindow.selectExt(appliedDifficulty);
  }

  /**
   * Creates all windows associated with the difficulty scene.
   */
  createAllWindows()
  {
    this.createHelpWindow();
    this.createListWindow();
    this.createDetailsWindow();
  }

  /**
   * Creates the help window that provides contextual details to the player
   * about the difficulty difference between the selected and current.
   */
  createHelpWindow()
  {
    const width = Graphics.boxWidth;
    const height = 100;
    const x = 0;
    const y = 0;
    const rect = new Rectangle(x, y, width, height);
    this._j._difficultyHelpWindow = new Window_Help(rect);
    this.addWindow(this._j._difficultyHelpWindow);
  }

  /**
   * Creates the list of difficulties available to the player.
   */
  createListWindow()
  {
    const width = 400;
    const height = Graphics.boxHeight - this._j._difficultyHelpWindow.height;
    const x = 0;
    const y = this._j._difficultyHelpWindow.height;
    const rect = new Rectangle(x, y, width, height);
    this._j._difficultyListWindow = new Window_DifficultyList(rect);
    this._j._difficultyListWindow.setHandler('cancel', this.popScene.bind(this));
    this._j._difficultyListWindow.setHandler('ok', this.onSelectDifficulty.bind(this));
    this._j._difficultyListWindow.onIndexChange = this.onHoverChange.bind(this);
    this.addWindow(this._j._difficultyListWindow);
  }

  /**
   * Creates the details window that describes the selected difficulty
   * compared to the current difficulty.
   */
  createDetailsWindow()
  {
    const width = Graphics.boxWidth - this._j._difficultyListWindow.width;
    const height = Graphics.boxHeight - this._j._difficultyHelpWindow.height;
    const x = this._j._difficultyListWindow.width;
    const y = this._j._difficultyHelpWindow.height;
    const rect = new Rectangle(x, y, width, height);
    this._j._difficultyDetailsWindow = new Window_DifficultyDetails(rect);
    this.addWindow(this._j._difficultyDetailsWindow);
  }

  onHoverChange()
  {
    const hoveredDifficulty = this._j._difficultyListWindow.currentExt();
    this._j._difficultyDetailsWindow.setHoveredDifficulty(hoveredDifficulty);
    this._j._difficultyHelpWindow.setText(hoveredDifficulty.description);
  }

  /**
   * Runs when the user chooses one of the items in the difficulty list.
   */
  onSelectDifficulty()
  {
    $gameSystem.setAppliedDifficulty(this.hoveredDifficulty());
    this.refreshDifficultyWindows();
    this._j._difficultyListWindow.activate();
  }

  /**
   * Gets the difficulty being hovered over in the difficulty list.
   * @returns {Difficulty}
   */
  hoveredDifficulty()
  {
    return this._j._difficultyListWindow.hoveredDifficulty();
  }

  refreshDifficultyWindows()
  {
    this._j._difficultyListWindow.refresh();
    this._j._difficultyDetailsWindow.refresh();
    this._j._difficultyHelpWindow.refresh();
  }

  /**
   * Runs once per frame to update all things in this scene.
   */
  update()
  {
    super.update();
    this.updateDetailWindow();
  }

  updateDetailWindow()
  {
    this._j._difficultyDetailsWindow.setHoveredDifficulty(this.hoveredDifficulty());
  }
}
//#endregion Scene_Difficulty