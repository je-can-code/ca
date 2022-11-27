//#region Scene_Omnipedia
class Scene_Omnipedia extends Scene_MenuBase
{
  /**
   * Calls this scene to start processing.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  static unlockAllMonsterpediaEntries()
  {
    $dataEnemies.forEach(enemy =>
    {
      if (!enemy) return;

      const gameEnemy = $gameEnemies.enemy(enemy.id);

      gameEnemy.updateMonsterpediaObservation();
    });
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

  //#region init
  /**
   * Initialize the window and all properties required by the scene.
   */
  initialize()
  {
    // perform original logic.
    super.initialize(this);

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

    // initialize the main omnipedia base list of pedias.
    this.initPrimaryMembers();

    // initialize the nested pedias listed within the omnipedia.
    this.initSecondaryMembers();
  }

  /**
   * The core properties of this scene are the root namespace definitions for this plugin.
   */
  initCoreMembers()
  {
    /**
     * The over-arching J object to contain all additional plugin parameters.
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
     * The window that shows the list of available pedias.
     * @type {Window_OmnipediaList}
     */
    this._j._omni._pediaList = null;

    /**
     * The window that displays at the top while the omnipedia list is active.
     * @type {Window_OmnipediaListHeader}
     */
    this._j._omni._pediaListHeader = null;
  }

  /**
   * The secondary properties of the scene are the individual pedia property namespace setup,
   * such as the Monsterpedia.
   */
  initSecondaryMembers()
  {
    // initialize the monsterpedia members.
    this.initMonsterpediaMembers();
  }

  /**
   * Initializes all members of the monsterpedia.
   */
  initMonsterpediaMembers()
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
  //#endregion init

  //#region start
  start()
  {
    super.start();

    // on-ready logic goes here.
  }
  //#endregion start

  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Creates all windows associated with this scene.
   */
  createAllWindows()
  {
    // create all root windows for the main listing.
    this.createOmnipediaRootWindows();

    // create all monsterpedia windows.
    this.createMonsterpediaWindows();
  }

  //#region windows management
  //#region root windows
  /**
   * Creates the root-level omnipedia windows.
   */
  createOmnipediaRootWindows()
  {
    // create the root omnipedia list of pedias.
    this.createOmnipediaListWindow();

    // create the header window.
    this.createOmnipediaListHeaderWindow();
  }

  //#region header window
  /**
   * Creates a header window for the omnipedia list.
   */
  createOmnipediaListHeaderWindow()
  {
    // create the window.
    const window = this.buildOmnipediaListHeaderWindow();

    // update the tracker with the new window.
    this.setOmnipediaListHeaderWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the omnipedia list header window.
   * @returns {Window_OmnipediaListHeader}
   */
  buildOmnipediaListHeaderWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.omnipediaListHeaderRectangle();

    // create the window with the rectangle.
    const window = new Window_OmnipediaListHeader(rectangle);

    window.refresh();

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the omnipedia list header window.
   * @returns {Rectangle}
   */
  omnipediaListHeaderRectangle()
  {
    // define the width of the list.
    const width = 1000;

    // determine the x based on the width.
    const x = (Graphics.boxWidth / 2) - (width * 0.5);

    // define the height of the rectangle.
    const height = 100;

    // arbitrarily decide the y.
    const y = 100;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked omnipedia list header window.
   * @returns {Window_OmnipediaListHeader}
   */
  getOmnipediaListHeaderWindow()
  {
    return this._j._omni._pediaListHeader;
  }

  /**
   * Set the currently tracked omnipedia list header window to the given window.
   * @param {Window_OmnipediaListHeader} listHeaderWindow The omnipedia list header window to track.
   */
  setOmnipediaListHeaderWindow(listHeaderWindow)
  {
    this._j._omni._pediaListHeader = listHeaderWindow;
  }

  /**
   * Opens the root header window.
   */
  openRootHeaderWindow()
  {
    // grab the root header window.
    const rootHeaderWindow = this.getOmnipediaListHeaderWindow();

    // open and show the root header window.
    rootHeaderWindow.open();
    rootHeaderWindow.show();
  }

  /**
   * Closes the root header window.
   */
  closeRootHeaderWindow()
  {
    // grab the root header window.
    const rootHeaderWindow = this.getOmnipediaListHeaderWindow();

    // close and hide the root header window.
    rootHeaderWindow.close();
    rootHeaderWindow.hide();
  }
  //#endregion header window

  //#region list window
  /**
   * Creates the list of pedias available to the player to peruse.
   */
  createOmnipediaListWindow()
  {
    // create the window.
    const window = this.buildOmnipediaListWindow();

    // update the tracker with the new window.
    this.setOmnipediaListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the omnipedia listing window.
   * @returns {Window_OmnipediaList}
   */
  buildOmnipediaListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.omnipediaListRectangle();

    // create the window with the rectangle.
    const window = new Window_OmnipediaList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.popScene.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onRootPediaSelection.bind(this));

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the omnipedia list command window.
   * @returns {Rectangle}
   */
  omnipediaListRectangle()
  {
    // define the width of the list.
    const width = 800;

    // calculate the X for where the origin of the list window should be.
    const x = (Graphics.boxWidth / 2) - (width * 0.5);

    // define the height of the list.
    const height = 400;

    // calculate the Y for where the origin of the list window should be.
    const y = (Graphics.boxHeight / 2) - (height * 0.5);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked omnipedia list window.
   * @returns {Window_OmnipediaList}
   */
  getOmnipediaListWindow()
  {
    return this._j._omni._pediaList;
  }

  /**
   * Set the currently tracked omnipedia list window to the given window.
   * @param {Window_OmnipediaList} listWindow The omnipedia list window to track.
   */
  setOmnipediaListWindow(listWindow)
  {
    this._j._omni._pediaList = listWindow;
  }

  /**
   * Opens the root list window and activates it.
   */
  openRootListWindow()
  {
    // grab the root omnipedia list window.
    const rootListWindow = this.getOmnipediaListWindow();

    // open, show, and activate the root list window.
    rootListWindow.open();
    rootListWindow.show();
    rootListWindow.activate();
  }

  /**
   * Closes the root list window.
   */
  closeRootListWindow()
  {
    // grab the root omnipedia list window.
    const rootListWindow = this.getOmnipediaListWindow();

    // close and deactivate the root list window.
    rootListWindow.close();
    rootListWindow.deactivate();
  }

  /**
   * Gets the current symbol of the root omnipedia.
   * This is effectively the currently highlighted selection's key of that window.
   * @returns {string}
   */
  getRootOmnipediaKey()
  {
    return this.getOmnipediaListWindow().currentSymbol();
  }
  //#endregion list window

  /**
   * Opens all windows associated with the root omnipedia.
   */
  openRootPediaWindows()
  {
    // open the root list window.
    this.openRootListWindow();

    // open the root header window.
    this.openRootHeaderWindow();
  }

  /**
   * Closes all windows associated with the root omnipedia.
   */
  closeRootPediaWindows()
  {
    // close the list window.
    this.closeRootListWindow();

    // close the header window.
    this.closeRootHeaderWindow();
  }
  //#endregion root windows

  //#region monsterpedia windows
  /**
   * Creates all windows for the monsterpedia.
   */
  createMonsterpediaWindows()
  {
    // create the list of monsters that have been perceived.
    this.createMonsterpediaListWindow();

    // create the detail of a highlighted monster that has been perceived.
    this.createMonsterpediaDetailWindow();

    // by default we do not start on the monsterpedia.
    this.closeMonsterpediaWindows();
  }

  //#region monsterpedia list window
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
   * @returns {Window_OmnipediaList}
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

  /**
   * Opens the monsterpedia list window.
   */
  openMonsterpediaListWindow()
  {
    // grab the monsterpedia list window.
    const pediaListWindow = this.getMonsterpediaListWindow();

    // open, show, and activate the monsterpedia list.
    pediaListWindow.open();
    pediaListWindow.show();
    pediaListWindow.activate();
  }

  /**
   * Closes the monsterpedia list window.
   */
  closeMonsterpediaListWindow()
  {
    // grab the monsterpedia list window.
    const pediaListWindow = this.getMonsterpediaListWindow();

    // close, hide, and deactivate the monsterpedia list.
    pediaListWindow.close();
    pediaListWindow.hide();
    pediaListWindow.deactivate();
  }
  //#endregion monsterpedia list window

  //#region monsterpedia detail window
  /**
   * Creates the detail of a single monster the player has perceived.
   */
  createMonsterpediaDetailWindow()
  {
    // create the window.
    const window = this.buildMonsterpediaDetailWindow();

    // update the tracker with the new window.
    this.setMonsterpediaDetailWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the monsterpedia detail window.
   * @returns {Window_OmnipediaList}
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
  //#endregion monsterpedia detail window

  /**
   * Opens all windows associated with the monsterpedia.
   */
  openMonsterpediaWindows()
  {
    // open the monsterpedia list window.
    this.openMonsterpediaListWindow();

    // open the monsterpedia detail window.
    this.openMonsterpediaDetailWindow();
  }

  /**
   * Closes all windows associated with the monsterpedia.
   */
  closeMonsterpediaWindows()
  {
    // close the monsterpedia list window.
    this.closeMonsterpediaListWindow();

    // close the monsterpedia detail window.
    this.closeMonsterpediaDetailWindow();
  }
  //#endregion monsterpedia windows
  //#endregion windows management

  //#region actions
  //#region root actions
  /**
   * When a choice is made, execute this logic.
   */
  onRootPediaSelection()
  {
    // grab which pedia was selected.
    const currentSelection = this.getRootOmnipediaKey();

    // determine which of the pedias to open.
    switch (currentSelection)
    {
      case "monster-pedia":
        this.monsterpediaSelected();
        break;
      default:
        this.invalidSelected(currentSelection);
        break;
    }
  }

  /**
   * Switch to the monsterpedia when selected from the root omnipedia list.
   */
  monsterpediaSelected()
  {
    // close the root omnipedia windows.
    this.closeRootPediaWindows();

    // open up the monsterpedia windows.
    this.openMonsterpediaWindows();

    // grab the monsterpedia's list window.
    const monsterpediaListWindow = this.getMonsterpediaListWindow();

    // initial refresh the detail window by way of force-changing the index.
    monsterpediaListWindow.onIndexChange();
  }

  /**
   * When an invalid selection occurs from the root omnipedia list, do nothing.
   * @param {any} currentSelection The given selection that was invalid.
   */
  invalidSelected(currentSelection)
  {
    console.warn(`The invalid symbol of: [${currentSelection.toString()}] was selected.`);
    SoundManager.playBuzzer();
    this.getOmnipediaListWindow().activate();
  }
  //#endregion root actions

  //#region monsterpedia actions
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
    // close the monsterpedia windows.
    this.closeMonsterpediaWindows();

    // open and activate the root omnipedia windows.
    this.openRootPediaWindows();
  }
  //#endregion monsterpedia actions
  //#endregion actions
}
//#endregion Scene_Omnipedia