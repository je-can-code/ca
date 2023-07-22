//region Scene_Difficulty
/**
 * The difficulty scene for managing the current difficulty.
 */
class Scene_Difficulty extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  constructor()
  {
    // perform original logic.
    super();

    // execute initialization.
    this.initialize();
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
     * The window for displaying the various enemy effects this difficulty applies.
     * @type {Window_DifficultyEffects}
     */
    this._j._difficulty._enemyEffects = null;

    /**
     * The window for displaying the various actor effects this difficulty applies.
     * @type {Window_DifficultyEffects}
     */
    this._j._difficulty._actorEffects = null;
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

  /**
   * Extends {@link #create}.
   * Creates our scene's windows.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();
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

    // create the list of enemy effects.
    this.createEnemyEffectsWindow();

    // create the list of actor effects.
    this.createActorEffectsWindow();
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

  //region enemy effects window
  /**
   * Creates the window displaying various battler effects applied to enemies.
   */
  createEnemyEffectsWindow()
  {
    // create the window.
    const window = this.buildDifficultyEnemyEffectsWindow();

    // deselect the command of the window.
    window.deselect();
    window.deactivate();

    // update the tracker with the new window.
    this.setDifficultyEnemyEffectsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the difficulty enemy effects window.
   * @returns {Window_DifficultyEffects}
   */
  buildDifficultyEnemyEffectsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.difficultyEnemyEffectsRectangle();

    // return the built details window.
    return new Window_DifficultyEffects(rectangle);
  }

  /**
   * Gets the rectangle associated with the difficulty enemy effects window.
   * @returns {Rectangle}
   */
  difficultyEnemyEffectsRectangle()
  {
    // grab the width from the list window.
    const { width: listWidth } = this.getDifficultyListWindow();

    // grab the height from the help window.
    const { height: helpHeight } = this.getHelpWindow();

    // the width should be from the list window to the edge of the screen.
    const width = (Graphics.boxWidth - listWidth) / 2;

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
   * Gets the currently tracked window.
   * @returns {Window_DifficultyEffects}
   */
  getDifficultyEnemyEffectsWindow()
  {
    return this._j._difficulty._enemyEffects;
  }

  /**
   * Sets the currently tracked window to the given window.
   * @param {Window_DifficultyEffects} window The window to track.
   */
  setDifficultyEnemyEffectsWindow(window)
  {
    this._j._difficulty._enemyEffects = window;
  }
  //endregion enemy effects window

  //region actor effects window
  /**
   * Creates the window displaying various battler effects applied to actors.
   */
  createActorEffectsWindow()
  {
    // create the window.
    const window = this.buildDifficultyActorEffectsWindow();

    // deselect the command of the window.
    window.deselect();
    window.deactivate();

    // update the tracker with the new window.
    this.setDifficultyActorEffectsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the difficulty actor effects window.
   * @returns {Window_DifficultyEffects}
   */
  buildDifficultyActorEffectsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.difficultyActorEffectsRectangle();

    // return the built details window.
    return new Window_DifficultyEffects(rectangle);
  }

  /**
   * Gets the rectangle associated with the difficulty actor effects window.
   * @returns {Rectangle}
   */
  difficultyActorEffectsRectangle()
  {
    // grab the width and x of the effects for calculating x of the actor effects.
    const { x: enemyEffectsX, width: effectsEffectsWidth } = this.getDifficultyEnemyEffectsWindow();

    // grab the height from the help window.
    const { height: helpHeight } = this.getHelpWindow();

    const leftSideOfEnemyEffects = enemyEffectsX + effectsEffectsWidth;

    // the width should be from the list window to the edge of the screen.
    const width = (Graphics.boxWidth - leftSideOfEnemyEffects);

    // the height should be from the bottom of the help window to the edge of the screen.
    const height = Graphics.boxHeight - helpHeight;

    // the x coordinate should be the right side of the list window.
    const x = leftSideOfEnemyEffects;

    // the y coordinate should be the bottom side of the help window.
    const y = helpHeight;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked window.
   * @returns {Window_DifficultyEffects}
   */
  getDifficultyActorEffectsWindow()
  {
    return this._j._difficulty._actorEffects;
  }

  /**
   * Sets the currently tracked window to the given window.
   * @param {Window_DifficultyEffects} window The window to track.
   */
  setDifficultyActorEffectsWindow(window)
  {
    this._j._difficulty._actorEffects = window;
  }
  //endregion actor effects window
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
    this.onHoverUpdateEffects();
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

  /**
   * Updates the details window when the hovered difficulty changes.
   */
  onHoverUpdateEffects()
  {
    // grab the currently hovered difficulty.
    const hoveredDifficulty = this.hoveredDifficulty();

    // if there is no difficulty, then do not update.
    if (!hoveredDifficulty) return;

    // extract the data points from the window.
    const { actorEffects, enemyEffects } = hoveredDifficulty;

    // update the actor effects.
    this.updateActorEffectsWindow(actorEffects);

    // update the enemy effects.
    this.updateEnemyEffectsWindow(enemyEffects);
  }

  updateActorEffectsWindow(newActorEffects)
  {
    // grab the actor window.
    const actorEffectsWindow = this.getDifficultyActorEffectsWindow();

    // check if the hovered difficulty is the same as the assigned one.
    if (actorEffectsWindow.getEffectsList() !== newActorEffects)
    {
      // extract the data points from the window.
      const {
        exp, gold, sdp, drops, encounters
      } = this.hoveredDifficulty();

      // build the bonus effects.
      const bonusEffects = new DifficultyBonusEffects();
      bonusEffects.exp = exp;
      bonusEffects.gold = gold;
      bonusEffects.drops = drops;
      bonusEffects.sdp = sdp;
      bonusEffects.encounters = encounters;

      // update the effects list in the window.
      actorEffectsWindow.updateEffects(
        newActorEffects,
        bonusEffects,
        Window_DifficultyEffects.EffectsTypes.ACTOR);
    }
  }

  updateEnemyEffectsWindow(newEnemyEffects)
  {
    // grab the enemy effects window.
    const enemyEffectsWindow = this.getDifficultyEnemyEffectsWindow();

    // check if the hovered difficulty is the same as the assigned one.
    if (enemyEffectsWindow.getEffectsList() !== newEnemyEffects)
    {
      // extract the data points from the window.
      const {
        exp, gold, sdp, drops, encounters
      } = this.hoveredDifficulty();

      // build the bonus effects.
      const bonusEffects = new DifficultyBonusEffects();
      bonusEffects.exp = exp;
      bonusEffects.gold = gold;
      bonusEffects.drops = drops;
      bonusEffects.sdp = sdp;
      bonusEffects.encounters = encounters;

      // update the effects list in the window.
      enemyEffectsWindow.updateEffects(
        newEnemyEffects,
        bonusEffects,
        Window_DifficultyEffects.EffectsTypes.ENEMY);
    }
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
    this.refreshCoreDifficultyWindows();

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
  refreshCoreDifficultyWindows()
  {
    // grab the windows to refresh.
    const listWindow = this.getDifficultyListWindow();
    const helpWindow = this.getHelpWindow();
    const pointsWindow = this.getPointsWindow();

    // refresh all the windows.
    listWindow.refresh();
    helpWindow.refresh();
    pointsWindow.refresh();
  }
}
//endregion Scene_Difficulty