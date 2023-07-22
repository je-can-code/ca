//region Scene_Omnipedia
/**
 * A scene containing access to all available and implemented pedia entries.
 */
class Scene_Omnipedia extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
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
   * Initialize all properties for our omnipedia.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the main omnipedia base list of pedias.
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
   * Creates all windows associated with this scene.
   */
  createAllWindows()
  {
    // create all root windows for the main listing.
    this.createOmnipediaRootWindows();
  }
  //endregion create

  //region windows
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

  //region header window
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
  //endregion header window

  //region list window
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
  //endregion list window

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
  //endregion windows

  //region actions
  //region root actions
  /**
   * When an pedia choice is made, execute this logic.
   * This is only implemented/extended by the pedias.
   */
  onRootPediaSelection()
  {
    console.debug(`selected "${this.getRootOmnipediaKey()}" option.`);
  }
  //endregion root actions
  //endregion actions
}
//endregion Scene_Omnipedia