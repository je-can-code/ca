/**
 * A scene containing access to all available and implemented pedia entries.
 */
class Scene_Monsterpedia extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  /**
   * A debug function that unlocks everything in the monsterpedia.
   */
  static unlockAllMonsterpediaEntries()
  {
    // an iterator function for unlocking all observations associated with all monsters in the database.
    const forEacher = enemy =>
    {
      // skip null enemies.
      if (!enemy) return;

      // grab the database data of the enemy.
      const gameEnemy = $gameEnemies.enemy(enemy.id);

      // update their respective monsterpedia observations.
      gameEnemy.updateMonsterpediaObservation();

      // grab their observations.
      const observations = $gameParty.getOrCreateMonsterpediaObservationsById(enemy.id);

      // grab all drops available from this enemy.
      const allDrops = gameEnemy.getDropItems();

      // iterate over each potential drop and add it as being observed.
      allDrops.forEach(drop => observations.addKnownDrop(drop.kind, drop.dataId), this);

      // iterate over all standard elements in the context of CA.
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(id => observations.addKnownElementalistic(id), this);
    };

    // iterate over every enemy.
    $dataEnemies.forEach(forEacher, this);
  }

  /**
   * Constructor.
   */
  constructor()
  {
    // call super when having extended constructors.
    super();

    // jumpstart initialization on creation.
    this.initialize();
  }

  //region init
  /**
   * Initialize the window and all properties required by the scene.
   */
  initialize()
  {
    // perform original logic.
    super.initialize();

    // also initialize our scene properties.
    this.initMembers();
  }

  /**
   * Initialize all properties for our omnipedia.
   */
  initMembers()
  {
    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the monsterpedia members.
    this.initPrimaryMembers();
  }

  /**
   * The core properties of this scene are the root namespace definitions for this plugin.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with the omnipedia.
     */
    this._j._omni = {};
  }

  /**
   * The primary properties of the scene are the initial properties associated with
   * the main list containing all pedias unlocked by the player along with some subtext of
   * what the pedia entails.
   */
  initPrimaryMembers()
  {
    /**
     * A grouping of all properties associated with the monsterpedia.
     * The monsterpedia is a subcategory of the omnipedia..
     */
    this._j._omni._monster = {};

    /**
     * The window that shows the list of percieved monsters.
     * @type {Window_MonsterpediaList}
     */
    this._j._omni._monster._pediaList = null;

    /**
     * The window that shows the details observed of a perceived monster.
     * @type {Window_MonsterpediaDetail}
     */
    this._j._omni._monster._pediaDetail = null;

    /**
     * The window that shows the teriary information of a perceived monster.
     * @type {Window_MonsterpediaList}
     */
    this._j._omni._monster._pediaHelp = null;
  }
  //endregion init

  //region create
  /**
   * Initialize all resources required for this scene.
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

  /**
   * Creates all monsterpedia windows.
   */
  createAllWindows()
  {
    // create the list of monsters that have been perceived.
    this.createMonsterpediaListWindow();

    // create the detail of a highlighted monster that has been perceived.
    this.createMonsterpediaDetailWindow();

    // grab the list window for refreshing.
    const listWindow = this.getMonsterpediaListWindow();

    // initial refresh the detail window by way of force-changing the index.
    listWindow.onIndexChange();
  }

  /**
   * Overwrites {@link Scene_MenuBase.prototype.createBackground}.
   * Changes the filter to a different type from {@link PIXI.filters}.
   */
  createBackground()
  {
    this._backgroundFilter = new PIXI.filters.AlphaFilter(0.1);
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    //this.setBackgroundOpacity(220);
  }
  //endregion create

  //region windows
  //region list window
  /**
   * Creates the list of monsters the player has perceived.
   */
  createMonsterpediaListWindow()
  {
    // create the window.
    const window = this.buildMonsterpediaListWindow();
  
    // update the tracker with the new window.
    this.setMonsterpediaListWindow(window);
  
    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the monsterpedia listing window.
   * @returns {Window_OmnipediaList}
   */
  buildMonsterpediaListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.monsterpediaListRectangle();
  
    // create the window with the rectangle.
    const window = new Window_MonsterpediaList(rectangle);
  
    // assign cancel functionality.
    window.setHandler('cancel', this.onCancelMonsterpedia.bind(this));
  
    // assign on-select functionality.
    window.setHandler('ok', this.onMonsterpediaListSelection.bind(this));
  
    // overwrite the onIndexChange hook with our local onMonsterpediaIndexChange hook.
    window.onIndexChange = this.onMonsterpediaIndexChange.bind(this);
  
    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the monsterpedia list command window.
   * @returns {Rectangle}
   */
  monsterpediaListRectangle()
  {
    // the list window's origin coordinates are the box window's origin as well.
    const [x, y] = Graphics.boxOrigin;
  
    // define the width of the list.
    const width = 400;
  
    // define the height of the list.
    const height = Graphics.boxHeight - (Graphics.verticalPadding * 2);
  
    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked monsterpedia list window.
   * @returns {Window_MonsterpediaList}
   */
  getMonsterpediaListWindow()
  {
    return this._j._omni._monster._pediaList;
  }

  /**
   * Set the currently tracked monsterpedia list window to the given window.
   * @param {Window_MonsterpediaList} listWindow The monsterpedia list window to track.
   */
  setMonsterpediaListWindow(listWindow)
  {
    this._j._omni._monster._pediaList = listWindow;
  }
  //endregion list window

  //region detail window
  /**
   * Creates the detail of a single monster the player has perceived.
   */
  createMonsterpediaDetailWindow()
  {
    // create the window.
    const window = this.buildMonsterpediaDetailWindow();
  
    // update the tracker with the new window.
    this.setMonsterpediaDetailWindow(window);
  
    // populate all image sprites used in this window.
    window.populateImageCache();
  
    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the monsterpedia detail window.
   * @returns {Window_MonsterpediaDetail}
   */
  buildMonsterpediaDetailWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.monsterpediaDetailRectangle();
  
    // create the window with the rectangle.
    const window = new Window_MonsterpediaDetail(rectangle);
  
    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the monsterpedia detail command window.
   * @returns {Rectangle}
   */
  monsterpediaDetailRectangle()
  {
    // grab the monsterpedia list window.
    const listWindow = this.getMonsterpediaListWindow();
  
    // calculate the X for where the origin of the list window should be.
    const x = listWindow.x + listWindow.width;
  
    // calculate the Y for where the origin of the list window should be.
    const y = Graphics.verticalPadding;
  
    // define the width of the list.
    const width = Graphics.boxWidth - listWindow.width - (Graphics.horizontalPadding * 2);
  
    // define the height of the list.
    const height = Graphics.boxHeight - (Graphics.verticalPadding * 2);
  
    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked monsterpedia detail window.
   * @returns {Window_MonsterpediaDetail}
   */
  getMonsterpediaDetailWindow()
  {
    return this._j._omni._monster._pediaDetail;
  }

  /**
   * Set the currently tracked monsterpedia detail window to the given window.
   * @param {Window_MonsterpediaDetail} detailWindow The monsterpedia detail window to track.
   */
  setMonsterpediaDetailWindow(detailWindow)
  {
    this._j._omni._monster._pediaDetail = detailWindow;
  }

  /**
   * Opens the monsterpedia detail window.
   */
  openMonsterpediaDetailWindow()
  {
    // grab the window.
    const window = this.getMonsterpediaDetailWindow();

    // open and show the window.
    window.open();
    window.show();
  }

  /**
   * Closes the monsterpedia detail window.
   */
  closeMonsterpediaDetailWindow()
  {
    // grab the monsterpedia list window.
    const window = this.getMonsterpediaDetailWindow();

    // close and hide the window.
    window.close();
    window.hide();
  }
  //endregion detail window
  //endregion windows

  //region actions
  /**
   * Synchronize the detail window with the list window of the monsterpedia.
   */
  onMonsterpediaIndexChange()
  {
    // grab the list window.
    const listWindow = this.getMonsterpediaListWindow();
  
    // grab the detail window.
    const detailWindow = this.getMonsterpediaDetailWindow();
  
    // grab the highlighted enemy's extra data, their observations.
    const highlightedEnemyObservations = listWindow.currentExt();
  
    // sync the detail window with the currently-highlighted enemy.
    detailWindow.setObservations(highlightedEnemyObservations);
  
    // refresh the window for the content update.
    detailWindow.refresh();
  }

  /**
   * TODO: do something when a monster is selected?
   */
  onMonsterpediaListSelection()
  {
    const listWindow = this.getMonsterpediaListWindow();
  
    console.log(`monster selected index: [${listWindow.index()}].`);
  
    listWindow.activate();
  }

  /**
   * Close the monsterpedia and return to the main omnipedia.
   */
  onCancelMonsterpedia()
  {
    // revert to the previous scene.
    SceneManager.pop();
  }
  //endregion actions
}