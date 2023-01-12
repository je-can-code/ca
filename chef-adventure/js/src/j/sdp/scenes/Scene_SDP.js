//region Scene_SDP
class Scene_SDP extends Scene_MenuBase
{
  /**
   * Calls this scene.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

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
    /**
     * The object encapsulating all things related to this plugin.
     */
    this._j = {
      /**
       * The list of SDPs available.
       * @type {Window_SDP_List}
       */
      _sdpListWindow: null,

      /**
       * The details of a given SDP.
       * @type {Window_SDP_Details}
       */
      _sdpDetailsWindow: null,

      /**
       * The help window of the current action.
       * @type {Window_SDP_Help}
       */
      _sdpHelpWindow: null,

      /**
       * The points window for how many SDP points are available.
       * @type {Window_SDP_Points}
       */
      _sdpPointsWindow: null,

      /**
       * The confirmation window to confirm an upgrade.
       * @type {Window_SDP_ConfirmUpgrade}
       */
      _sdpConfirmationWindow: null,

      /**
       * The latest index of the list window.
       * @type {number}
       */
      _index: null,

      /**
       * The data of the panel for the current index.
       * @type {StatDistributionPanel}
       */
      _currentPanel: null,

      /**
       * The actor that is currently selected.
       * @type {Game_Actor}
       */
      _currentActor: null,

      /**
       * Whether or not this scene has been initialized.
       * @type {boolean}
       */
      _initialized: false,
    };
  }

  /**
   * Hooks into the create parent function to create all windows after the window
   * layer has been established.
   */
  create()
  {
    super.create();
    this.createAllWindows();
  }

  /**
   * Runs once per frame to update all things in this scene.
   */
  update()
  {
    super.update();
    this.updateIndex();
    this.updateActor();
  }

  /**
   * Updates the index to keep in sync with the window's currently-selected index.
   */
  updateIndex()
  {
    if (this._j._sdpListWindow._list.length === 0) return;

    const currentIndex = this._j._index;
    const newIndex = this._j._sdpListWindow.index();
    if (currentIndex !== newIndex || currentIndex === null)
    {
      this._j._index = this._j._sdpListWindow.index();
      this._j._currentPanel = this._j._sdpListWindow._list[this._j._index].ext;
      this._j._sdpDetailsWindow.setPanel(this._j._currentPanel);
      this._j._sdpHelpWindow.setText(`${this._j._currentPanel.description}`);
    }
  }

  /**
   * OVERWRITE Determines the current actor.
   */
  updateActor()
  {
    this._j._currentActor = $gameParty.menuActor();
  }

  /**
   * OVERWRITE Removes the buttons on the map/screen.
   */
  createButtons()
  {
  }

  //region window creation
  /**
   * Creates all windows associated with the SDP scene.
   */
  createAllWindows()
  {
    this.createPointsWindow();
    this.createHelpWindow();
    this.createDetailsWindow();
    this.createListWindow();
    this.createConfirmationWindow();
  }

  /**
   * Creates the list of SDPs available to the player.
   */
  createListWindow()
  {
    const width = 400;
    const heightFit = (this._j._sdpPointsWindow.height + this._j._sdpHelpWindow.height) + 8;
    const height = Graphics.height - heightFit;
    const x = 0;
    const y = this._j._sdpPointsWindow.height;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpListWindow = new Window_SDP_List(rect);
    this._j._sdpListWindow.setHandler('cancel', this.popScene.bind(this));
    this._j._sdpListWindow.setHandler('ok', this.onSelectPanel.bind(this));
    this._j._sdpListWindow.setHandler('more', this.onFilterPanels.bind(this));
    this._j._sdpListWindow.setHandler('pagedown', this.cycleMembers.bind(this, true));
    this._j._sdpListWindow.setHandler('pageup', this.cycleMembers.bind(this, false));
    this._j._sdpListWindow.setActor($gameParty.menuActor());
    this.addWindow(this._j._sdpListWindow);
  }

  /**
   * Creates the details window that describes a panel and what leveling it does.
   */
  createDetailsWindow()
  {
    const width = Graphics.boxWidth - 400;
    const height = Graphics.boxHeight - 100;
    const x = 400;
    const y = 0;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpDetailsWindow = new Window_SDP_Details(rect);
    this._j._sdpDetailsWindow.setActor($gameParty.menuActor());
    this.addWindow(this._j._sdpDetailsWindow);
  }

  /**
   * Creates the help window that provides contextual details to the player about the panel.
   */
  createHelpWindow()
  {
    const width = Graphics.boxWidth;
    const height = 100;
    const x = 0;
    const y = Graphics.boxHeight - height;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpHelpWindow = new Window_SDP_Help(rect);
    this.addWindow(this._j._sdpHelpWindow);
  }

  /**
   * Creates the points window that tracks how many SDP points the player has.
   */
  createPointsWindow()
  {
    const width = 400;
    const height = 60;
    const x = 0;
    const y = 0;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpPointsWindow = new Window_SDP_Points(rect);
    this._j._sdpPointsWindow.setActor($gameParty.menuActor());
    this.addWindow(this._j._sdpPointsWindow);
  }

  /**
   * Creates the list of SDPs available to the player.
   */
  createConfirmationWindow()
  {
    const width = 350;
    const height = 120;
    const x = (Graphics.boxWidth - width) / 2;
    const y = (Graphics.boxHeight - height) / 2;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpConfirmationWindow = new Window_SDP_ConfirmUpgrade(rect);
    this._j._sdpConfirmationWindow.setHandler('cancel', this.onUpgradeCancel.bind(this));
    this._j._sdpConfirmationWindow.setHandler('ok', this.onUpgradeConfirm.bind(this));
    this._j._sdpConfirmationWindow.hide();
    this.addWindow(this._j._sdpConfirmationWindow);
  }
  //endregion SDP window creation

  /**
   * Refreshes all windows in this scene.
   */
  refreshAllWindows()
  {
    this._j._sdpListWindow.setActor(this._j._currentActor);
    this._j._sdpDetailsWindow.setActor(this._j._currentActor);
    this._j._sdpDetailsWindow.refresh();
    this._j._sdpPointsWindow.setActor(this._j._currentActor);

    this._j._sdpHelpWindow.refresh();
  }

  /**
   * When selecting a panel, bring up the confirmation window.
   */
  onSelectPanel()
  {
    this._j._sdpConfirmationWindow.show();
    this._j._sdpConfirmationWindow.open();
    this._j._sdpConfirmationWindow.activate();
  }

  onFilterPanels()
  {
    const sdpListWindow = this._j._sdpListWindow;
    const usingFilter = sdpListWindow.usingNoMaxPanelsFilter();

    if (usingFilter)
    {
      sdpListWindow.setNoMaxPanelsFilter(false);
    }
    else
    {
      sdpListWindow.setNoMaxPanelsFilter(true);
    }

    this.refreshAllWindows();

    if (sdpListWindow.index() > sdpListWindow.commandList().length)
    {
      sdpListWindow.select(sdpListWindow.commandList().length - 1);
    }
  }

  /**
   * Cycles the currently selected member to the next in the party.
   * @param {boolean} isForward Whether or not to cycle to the next member or previous.
   */
  cycleMembers(isForward = true)
  {
    isForward
      ? $gameParty.makeMenuActorNext()
      : $gameParty.makeMenuActorPrevious();
    this._j._currentActor = $gameParty.menuActor();
    this.refreshAllWindows();
    this._j._sdpListWindow.activate();
  }

  /**
   * If the player opts to upgrade the existing panel, remove the points and rank up the panel.
   */
  onUpgradeConfirm()
  {
    // grab the panel we're working with.
    const panel = this._j._currentPanel;

    // grab the actor we're working with.
    const actor = this._j._currentActor;

    // get the panel ranking from the actor.
    const panelRanking = actor.getSdpByKey(panel.key);

    // determine the cost to rank up the panel.
    const panelRankupCost = panel.rankUpCost(panelRanking.currentRank);

    // reduce the points by a negative variant of the amount.
    actor.modSdpPoints(-panelRankupCost);

    // rank up the panel.
    actor.rankUpPanel(panel.key);

    // update the total spent points for this actor.
    actor.modAccumulatedSpentSdpPoints(panelRankupCost);

    // refresh all the windows after upgrading the panel.
    this.refreshAllWindows();

    // update the detail window to use the current actor.
    this._j._sdpDetailsWindow.setActor(this._j._currentActor);

    // close the confirmation window.
    this._j._sdpConfirmationWindow.close();

    // refocus back to the list window.
    this._j._sdpListWindow.activate();
  }

  /**
   * If the player opts to cancel the upgrade process, return to the list window.
   */
  onUpgradeCancel()
  {
    this._j._sdpConfirmationWindow.close();
    this._j._sdpConfirmationWindow.hide();
    this._j._sdpListWindow.activate();
  }
}
//endregion Scene_SDP