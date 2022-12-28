//region Scene_Difficulty
/**
 * The difficulty scene for managing the current difficulty.
 */
class Scene_Difficulty extends Scene_MenuBase
{
  constructor()
  {
    // perform original logic.
    super();

    // execute initialization.
    this.initialize();
  }

  /**
   * Initialize all members of this class.
   */
  initialize()
  {
    // perform original logic.
    super.initialize(this);

    // setup our class members.
    this.initMembers();
  }

  /**
   * Initializes all properties for this scene.
   */
  initMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with the difficulty layer system.
     */
    this._j._difficulty = {};

    /**
     * The window that shows the description of the difficulty layer.
     * @type {Window_Help}
     */
    this._j._difficulty._helpWindow = null;

    /**
     * The window for showing the difficulty layer point max, current, and projection.
     * @type {Window_DifficultyPoints}
     */
    this._j._difficulty._pointsWindow = null;

    /**
     * The window for displaying the list of difficulty layers the player has not-hidden.
     * @type {Window_DifficultyList}
     */
    this._j._difficulty._listWindow = null;

    /**
     * The window for displaying the details of the currently hovered difficulty.
     * @type {Window_DifficultyDetails}
     */
    this._j._difficulty._detailsWindow = null;
  }

  /**
   * Extends {@link #create}.
   * Creates our scene's windows.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Extends {@link #start}.
   * Handles the post-scene setup.
   */
  start()
  {
    // perform original logic.
    super.start();

    // grab the list window.
    const listWindow = this.getDifficultyListWindow();

    // select the applied layer from the list.
    listWindow.select(0);

    // also update what is being hovered.
    this.onHoverChange();
  }

  //region create windows
  /**
   * Creates all windows associated with the difficulty scene.
   */
  createAllWindows()
  {
    // build the points window first.
    this.createPointsWindow();

    // then build the help window based on the location of the points window.
    this.createHelpWindow();

    // then build the list window based on the location of the help window.
    this.createListWindow();

    // and lastly build the details window based on the location of the list window.
    this.createDetailsWindow();
  }

  //region points window
  /**
   * Creates the points window that displays information about your current point allocation.
   */
  createPointsWindow()
  {
    // create the window.
    const window = this.buildPointsWindow();

    // update the tracker with the new window.
    this.setPointsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the points window.
   * @returns {Window_DifficultyPoints}
   */
  buildPointsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.pointsRectangle();

    // create the window with the rectangle.
    return new Window_DifficultyPoints(rectangle);
  }

  /**
   * Gets the rectangle associated with the points window.
   * @returns {Rectangle}
   */
  pointsRectangle()
  {
    return new Rectangle(0, 0, 400, 100);
  }

  /**
   * Get the currently tracked points window.
   * @returns {Window_DifficultyPoints}
   */
  getPointsWindow()
  {
    return this._j._difficulty._pointsWindow;
  }

  /**
   * Set the currently tracked points window to the given window.
   * @param {Window_DifficultyPoints} pointsWindow The points window to track.
   */
  setPointsWindow(pointsWindow)
  {
    this._j._difficulty._pointsWindow = pointsWindow;
  }
  //endregion points window

  //region help window
  /**
   * Creates the help window that provides contextual details to the player
   * about the difficulty difference between the selected and current.
   */
  createHelpWindow()
  {
    // create the window.
    const window = this.buildHelpWindow();

    // update the tracker with the new window.
    this.setHelpWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the help window.
   * @returns {Window_Help}
   */
  buildHelpWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.helpRectangle();

    // create the window with the rectangle.
    return new Window_Help(rectangle);
  }

  /**
   * Gets the rectangle associated with the help window.
   * @returns {Rectangle}
   */
  helpRectangle()
  {
    // grab the width from the points window.
    const { width: pointsWidth } = this.getPointsWindow();

    // the help window should be as wide as the screen lesser the points window width.
    const width = Graphics.boxWidth - pointsWidth;

    // build the rectangle to return.
    return new Rectangle(pointsWidth, 0, width, 100);
  }

  /**
   * Get the currently tracked help window.
   * @returns {Window_Help}
   */
  getHelpWindow()
  {
    return this._j._difficultyHelpWindow;
  }

  /**
   * Set the currently tracked help window to the given window.
   * @param {Window_Help} helpWindow The help window to track.
   */
  setHelpWindow(helpWindow)
  {
    this._j._difficultyHelpWindow = helpWindow;
  }
  //endregion help window

  //region list window
  /**
   * Creates the list of difficulties available to the player.
   * This uses the help window's coordinates, and must be created after it.
   */
  createListWindow()
  {
    // create the window.
    const window = this.buildDifficultyListWindow();

    // update the tracker with the new window.
    this.setDifficultyListWindow(window)

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Gets the rectangle associated with the difficulty list command window.
   */
  difficultyListRectangle()
  {
    // grab the points window height.
    const { height: pointsHeight } = this.getPointsWindow();

    // define the width arbitrarily.
    const width = 400;

    // the height should meet the points window bottom.
    const height = Graphics.boxHeight - pointsHeight;

    // define the x coordinate arbitrarily.
    const x = 0;

    // the y coordinate starts at the bottom of the points window.
    const y = pointsHeight;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Sets up and defines the difficulty list window.
   * @returns {Window_DifficultyList}
   */
  buildDifficultyListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.difficultyListRectangle();

    // create the window with the rectangle.
    const window = new Window_DifficultyList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.popScene.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onSelectDifficulty.bind(this));

    // overwrite the onIndexChange hook with our local onHoverChange hook.
    window.onIndexChange = this.onHoverChange.bind(this);

    // return the built and configured difficulty list window.
    return window;
  }

  /**
   * Get the currently tracked difficulty list window.
   * @returns {Window_DifficultyList}
   */
  getDifficultyListWindow()
  {
    return this._j._difficulty._listWindow;
  }

  /**
   * Set the currently tracked difficulty list window to the given window.
   * @param {Window_DifficultyList} difficultyListWindow The difficulty list window to track.
   */
  setDifficultyListWindow(difficultyListWindow)
  {
    this._j._difficulty._listWindow = difficultyListWindow;
  }
  //endregion list window

  //region details window
  /**
   * Creates the details window that describes the selected difficulty
   * compared to the current difficulty.
   */
  createDetailsWindow()
  {
    // create the window.
    const window = this.buildDifficultyDetailsWindow();

    // update the tracker with the new window.
    this.setDifficultyDetailsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Gets the rectangle associated with the difficulty details window.
   * @returns {Rectangle}
   */
  difficultyDetailsRectangle()
  {
    // grab the width from the list window.
    const { width: listWidth } = this.getDifficultyListWindow();

    // grab the height from the help window.
    const { height: helpHeight } = this.getHelpWindow();

    // the width should be from the list window to the edge of the screen.
    const width = Graphics.boxWidth - listWidth;

    // the height should be from the bottom of the help window to the edge of the screen.
    const height = Graphics.boxHeight - helpHeight;

    // the x coordinate should be the right side of the list window.
    const x = listWidth;

    // the y coordinate should be the bottom side of the help window.
    const y = helpHeight;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Sets up and defines the difficulty details window.
   * @returns {Window_DifficultyDetails}
   */
  buildDifficultyDetailsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.difficultyDetailsRectangle();

    // return the built details window.
    return new Window_DifficultyDetails(rectangle);
  }

  /**
   * Gets the currently tracked difficulty details window.
   * @returns {Window_DifficultyDetails}
   */
  getDifficultyDetailsWindow()
  {
    return this._j._difficulty._detailsWindow;
  }

  /**
   * Sets the currently tracked difficulty details window to the given window.
   * @param {Window_DifficultyDetails} difficultyDetailsWindow The difficulty details window to track.
   */
  setDifficultyDetailsWindow(difficultyDetailsWindow)
  {
    this._j._difficulty._detailsWindow = difficultyDetailsWindow;
  }
  //endregion details window
  //endregion create windows

  /**
   * Gets the difficulty being hovered over in the difficulty list.
   * @returns {DifficultyLayer}
   */
  hoveredDifficulty()
  {
    // grab the list window.
    const listWindow = this.getDifficultyListWindow();

    // pull the item the cursor is hovering over from the list window.
    return listWindow.hoveredDifficulty();
  }

  //region on-hover
  /**
   * A hook to perform logic when the selected
   */
  onHoverChange()
  {
    // update the points window.
    this.onHoverUpdatePoints();

    // update the help window.
    this.onHoverUpdateHelp();

    // update the details window.
    this.onHoverUpdateDetails();
  }

  /**
   * Updates the details window when the hovered difficulty changes.
   */
  onHoverUpdateDetails()
  {
    // grab the hovered difficulty.
    const hoveredDifficulty = this.hoveredDifficulty();

    // grab the details window.
    const detailsWindow = this.getDifficultyDetailsWindow();

    // update the hovered difficulty for the details window.
    detailsWindow.setHoveredDifficulty(hoveredDifficulty);
  }

  /**
   * Updates the points window when the hovered difficulty changes.
   */
  onHoverUpdatePoints()
  {
    // grab the hovered difficulty.
    const hoveredDifficulty = this.hoveredDifficulty();

    // grab the points window.
    const pointsWindow = this.getPointsWindow();

    // update the hovered difficulty for the points window.
    pointsWindow.setHoveredDifficulty(hoveredDifficulty);

    // also refresh the points window.
    pointsWindow.refresh();
  }

  /**
   * Updates the help window when the hovered difficulty changes.
   */
  onHoverUpdateHelp()
  {
    // grab the hovered difficulty.
    const hoveredDifficulty = this.hoveredDifficulty();

    // grab the help window.
    const helpWindow = this.getHelpWindow();

    // set the text of the hovered difficulty for the help window.
    helpWindow.setText(hoveredDifficulty.description);
  }
  //endregion on-hover

  //region on-select
  /**
   * Runs when the user chooses one of the items in the difficulty list.
   */
  onSelectDifficulty()
  {
    // grab the hovered difficulty.
    const hovered = this.hoveredDifficulty();

    // check if the hovered difficulty is currently enabled.
    if (hovered.isEnabled())
    {
      // disable this difficulty.
      DifficultyManager.disableDifficulty(hovered.key);

      // run the disable difficulty hook.
      this.onDisableDifficulty(hovered);
    }
    else
    {
      // enable this difficulty.
      DifficultyManager.enableDifficulty(hovered.key);

      // run the enable difficulty hook.
      this.onEnableDifficulty(hovered);
    }

    // refresh the difficulty windows.
    this.refreshDifficultyWindows();

    // grab the list window to activate.
    const listWindow = this.getDifficultyListWindow();

    // redirect the player back to enable/disable another item.
    listWindow.activate();
  }

  /**
   * A hook for performing logic when a difficulty layer is disabled.
   * @param {DifficultyLayer} difficulty The difficulty layer being disabled.
   */
  onDisableDifficulty(difficulty)
  {
    // refund the difficulty cost.
    this.refundDifficultyCost(difficulty);

    // play a sound to indicate cancellation of the layer.
    SoundManager.playActorDamage();
  }

  /**
   * A hook for performing logic when a difficulty layer is disabled.
   * @param {DifficultyLayer} difficulty The difficulty layer being disabled.
   */
  refundDifficultyCost(difficulty)
  {
    // the refund is the inverse of the cost.
    const refund = (difficulty.cost * -1);

    // refund the layer points back.
    $gameSystem.modLayerPoints(refund);
  }

  /**
   * A hook for performing logic when a difficulty layer is enabled.
   * @param {DifficultyLayer} difficulty The difficulty layer being enabled.
   */
  onEnableDifficulty(difficulty)
  {
    // apply the difficulty cost.
    this.applyDifficultyCost(difficulty);

    // play a sound to indicate acceptance of the layer.
    SoundManager.playUseSkill();
  }

  /**
   * A hook for performing logic when a difficulty layer is disabled.
   * @param {DifficultyLayer} difficulty The difficulty layer being disabled.
   */
  applyDifficultyCost(difficulty)
  {
    // modify the layer points by the difficulty layer's cost.
    $gameSystem.modLayerPoints(difficulty.cost);
  }
  //endregion on-select

  /**
   * Refreshes all windows in the scene at once.
   */
  refreshDifficultyWindows()
  {
    // grab the windows to refresh.
    const listWindow = this.getDifficultyListWindow();
    const detailsWindow = this.getDifficultyDetailsWindow();
    const helpWindow = this.getHelpWindow();
    const pointsWindow = this.getPointsWindow();

    // refresh all the windows.
    listWindow.refresh();
    detailsWindow.refresh();
    helpWindow.refresh();
    pointsWindow.refresh();
  }

  /**
   * Extends {@link #update}.
   * Also keeps the details window in-sync with the list window.
   */
  update()
  {
    // perform original logic.
    super.update();

    // update the detail window, too.
    this.updateDetailWindow();
  }

  /**
   * Synchronizes the currently hovered difficulty into the details window.
   */
  updateDetailWindow()
  {
    // grab the details window.
    const detailsWindow = this.getDifficultyDetailsWindow();

    // grab the currently hovered difficulty.
    const hoveredDifficulty = this.hoveredDifficulty();

    // update the difficulty displayed in the details window.
    detailsWindow.setHoveredDifficulty(hoveredDifficulty);
  }
}
//endregion Scene_Difficulty