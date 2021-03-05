//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * Enables the SDP system, allowing for distribution of points into panels that
 * contain various stats.
 * @author JE
 * @url https://dev.azure.com/je-can-code/RPG%20Maker/_git/rmmz
 * @help
 * This should go below both J-Base and J-ABS.
 * 
 * @param SDP Icon
 * @type number
 * @desc The default iconIndex to represent "SDP points".
 * @default 306
 * 
 * @command Call SDP Menu
 * @text Access the SDP Menu
 * @desc Calls the SDP Menu directly via plugin command.
 * 
 * @command Add New SDP
 * @text Adding a new panel
 * @desc Add a new panel to the collection.
 * @arg name
 * @type string
 * @desc The name of the panel.
 * Displayed in the list of panels on the left.
 * @default "Some Cool Panel"
 * @arg key
 * @type string
 * @desc A unique identifier for this panel.
 * Only letters, numbers, and underscores are recognized.
 * @default "SCP_1"
 * @arg iconIndex
 * @type number
 * @desc The index of the icon to represent this panel.
 * @default 1
 * @arg description
 * @type string
 * @desc The description of the panel.
 * Shows up in the bottom help window.
 * @default Some really cool panel that has lots of hardcore powers.
 * @arg maxRank
 * @type number
 * @desc The maximum rank this panel can reach.
 * @default 10
 * @arg baseCost
 * @type number
 * @desc The base formula is:
 * baseCost + (multGrowthCost * (flatGrowthCost * rank))
 * @default 110
 * @arg flatGrowthCost
 * @type number
 * @desc The base formula is:
 * baseCost + (multGrowthCost * (flatGrowthCost * rank))
 * @default 40
 * @arg multGrowthCost
 * @type number
 * @desc The base formula is:
 * baseCost + (multGrowthCost * (flatGrowthCost * rank))
 * @decimals 2
 * @default 1.2
 * @arg panelParameters
 * @type struct<PanelParameterStruct>[]
 * @desc Add one or more parameters here that will grow as this panel ranks up.
 * @default []
 * @arg maxReward
 * @type multiline_string
 * @desc Use Javascript to execute code when the panel is maxed.
 * a = the actor leveling the panel.
 * @default a.learnSkill(52);
 * @arg maxRewardDescription
 * @type string
 * @desc An extra line for flavor text, or whatever you want.
 * Designed for describing the reward for maxing this panel.
 * @default Learn the skill "Lunge" when this panel is maxed.
 */
/*~struct~PanelParameterStruct:
 *
 * @param parameterId
 * @text Parameter Id
 * @desc 0-7 are core parameters, 8-17 are ex-parameters, 18-27 are sp-parameters.
 * @type number
 * @type select
 * @option Max HP
 * @value 0
 * @option Max MP
 * @value 1
 * @option Power
 * @value 2
 * @option Endurance
 * @value 3
 * @option Force
 * @value 4
 * @option Resist
 * @value 5
 * @option Speed
 * @value 6
 * @option Luck
 * @value 7
 * @option Hit Rate
 * @value 8
 * @option Evasion Rate
 * @value 9
 * @option Crit Chance
 * @value 10
 * @option Crit Evasion
 * @value 11
 * @option Magic Evasion
 * @value 12
 * @option Magic Reflect Rate
 * @value 13
 * @option Counter Rate
 * @value 14
 * @option HP Regen
 * @value 15
 * @option MP Regen
 * @value 16
 * @option TP Regen
 * @value 17
 * @option Targeting Rate
 * @value 18
 * @option Guard Rate
 * @value 19
 * @option Recovery Rate
 * @value 20
 * @option Pharmacy Rate
 * @value 21
 * @option MP Cost Reduction
 * @value 22
 * @option TP Cost Reduction
 * @value 23
 * @option Phys DMG Reduction
 * @value 24
 * @option Magi DMG Reduction
 * @value 25
 * @option Floor DMG Reduction
 * @value 26
 * @option Experience Rate
 * @value 27
 * @default 0
 * 
 * @param perRank
 * @text Growth per Rank
 * @type number
 * @decimals 2
 * @min -99999999
 * @desc The amount that will this parameter will grow per rank.
 * This can be negative.
 * @default 10
 * 
 * @param isFlat
 * @text Growth Type
 * @desc Flat growth is a fixed amount per rank.
 * Percent growth is percent of the base parameter per rank.
 * @type boolean
 * @on Flat
 * @off Percent
 * @default true
 */
if (J.Base.Metadata.Version < 1.00) {
  let message = `In order to use JABS, `;
  message += `you gotta have the "J-Base.js" enabled, `;
  message += `placed above the SDP plugin, `;
  message += `and at version 1.00 or higher.`;
  throw Error(message);
}
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.SDP = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.SDP.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-SDP`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.SDP.PluginParameters = PluginManager.parameters(J.SDP.Metadata.Name);
J.SDP.Metadata = {
  ...J.SDP.Metadata,
  /**
   * The version of this plugin.
   * @type {number}
   */
  Version: 1.00,

  /**
   * The icon that will be used to represent the SDP points earned for an actor.
   * @type {number}
   */
  PointsIcon: parseInt(J.SDP.PluginParameters['SDP Icon']),
};

J.SDP.Aliased = {
  BattleManager: {},
  Game_Actor: {},
  Game_BattleMap: {},
  Game_System: {},
};

/**
 * Plugin command for assigning and locking a skill to a designated slot.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Call SDP Menu", () => {
  SceneManager.push(Scene_SDP);
});

/**
 * Adds a new panel to the list of available panels. 
 * Does nothing if a panel with the same key already exists.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Add New SDP", args => {
  const { 
    name,
    key, 
    iconIndex,
    description,
    maxRank, 
    baseCost,
    flatGrowthCost,
    multGrowthCost,
    maxReward,
    maxRewardDescription,
    panelParameters } = args;
  const parsedParams = JSON.parse(panelParameters);
  const newPanelParams = Object.values(parsedParams).map(param => {
    const parsed = JSON.parse(param);
    const panelParam = new PanelParameter(
      parseInt(parsed.parameterId), 
      parseFloat(parsed.perRank), 
      parsed.isFlat === 'true');
    return panelParam;
  })

  $gameSystem.addSdpPanel(
    name, 
    key, 
    parseInt(iconIndex), 
    description, 
    parseInt(maxRank),
    parseInt(baseCost), 
    parseInt(flatGrowthCost), 
    parseFloat(multGrowthCost), 
    maxReward,
    maxRewardDescription,
    ...newPanelParams
  );
});
//#endregion Introduction

//#region Static objects

//#region BattleManager
/**
 * Extends the creation of the rewards object to include SDP points.
 */
J.SDP.Aliased.BattleManager.makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function() {
  J.SDP.Aliased.BattleManager.makeRewards.call(this);
  this._rewards = {
    ...this._rewards,
    sdp: $gameTroop.sdpTotal(),
  };
};

/**
 * Extends the gaining of rewards to also gain SDP points.
 */
J.SDP.Aliased.BattleManager.gainRewards = BattleManager.gainRewards;
BattleManager.gainRewards = function() {
  J.SDP.Aliased.BattleManager.gainRewards.call(this);
  this.gainSdpPoints();
};

BattleManager.gainSdpPoints = function() {
  const sdpPoints = this._rewards.sdp;
  $gameParty.members().forEach(member => {
    member.modSdpPoints(sdpPoints);
  });
};
//#endregion BattleManager

//#endregion Static objects

//#region Game objects
//#region Game_Actor
/**
 * Adds new properties to the actors that manage the SDP system.
 */
J.SDP.Aliased.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
  J.SDP.Aliased.Game_Actor.initMembers.call(this);
  /**
   * The J object where all my additional properties live.
   */
  this._j = this._j || {};
  /**
   * A grouping of all properties associated with the SDP system.
   */
  this._j._sdp = {
    /**
     * The points that this current actor has.
     * @type {number}
     */
    _points: 0,

    /**
     * A collection of the ranks for each panel that have had points invested.
     * @type {PanelRanking[]}
     */
    _ranks: [],
  };
};

/**
 * Adds a new panel ranking for tracking the progress of a given panel.
 * @param {string} key The less-friendly unique key that represents this SDP.
 * @param {number} maxRank The maximum rank that this panel can reach.
 */
Game_Actor.prototype.addNewPanelRanking = function(key, maxRank) {
  const ranking = this.getSdpByKey(key);
  if (ranking) {
    console.warn(`panel rankings are already being tracked for key: "${key}".`);
    return;
  }

  const panelRanking = new PanelRanking(key, maxRank);
  this._j._sdp._ranks.push(panelRanking);
};

/**
 * Searches for a ranking in a given panel based on key and returns it.
 * @param {string} key The key of the panel we seek.
 * @returns {PanelRanking} The panel if found, `null` otherwise.
 */
Game_Actor.prototype.getSdpByKey = function(key) {
  // don't try to search if there are no rankings at this time.
  if (!this._j._sdp._ranks.length) return null;

  const ranking = this._j._sdp._ranks.find(panelRanking => panelRanking.key === key);
  return ranking;
};

/**
 * Gets all rankings that this actor has.
 * @returns {PanelRanking[]}
 */
Game_Actor.prototype.getAllSdpRankings = function() {
  return this._j._sdp._ranks;
};

/**
 * Gets the amount of SDP points this actor has.
 */
Game_Actor.prototype.getSdpPoints = function() {
  return this._j._sdp._points;
};

/**
 * Increase the amount of SDP points the actor has by a given amount.
 * If the parameter provided is negative, it will reduce the actor's points instead.
 * 
 * NOTE: An actor's SDP points cannot be less than 0.
 * @param {number} points The number of points we are adding/removing from this actor.
 */
Game_Actor.prototype.modSdpPoints = function(points) {
  this._j._sdp._points += points;
  if (this._j._sdp._points < 0) {
    console.warn('SDP points were reduced below zero. Returned to 0.')
    this._j._sdp._points = 0;
  }
};

/**
 * Ranks up this actor's panel by key.
 * @param {string} panelKey The key of the panel to rank up.
 */
Game_Actor.prototype.rankUpPanel = function(panelKey) {
  this.getSdpByKey(panelKey).rankUp();
};

/**
 * Calculates the value of the bonus stats for a designated core parameter.
 * @param {number} paramId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @returns {number}
 */
Game_Actor.prototype.getSdpBonusForCoreParam = function(paramId, baseParam) {
  const panelRankings = this.getAllSdpRankings();
  if (!panelRankings.length) return 0;

  let panelModifications = 0;
  // for each of the panel rankings this actor has established-
  panelRankings.forEach(panelRanking => {
    // get the corresponding SDP's panel parameters.
    const panelParameters = $gameSystem
      .getSdpPanel(panelRanking.key)
      .getPanelParameterById(paramId);
    if (panelParameters.length) {
      panelParameters.forEach(panelParameter => {
        const perRank = panelParameter.perRank;
        const curRank = panelRanking.currentRank;
        if (!panelParameter.isFlat) {
          panelModifications += Math.floor(baseParam * (curRank * perRank) / 100);
        } else {
          panelModifications += curRank * perRank;
        }
      });
    }
  });

  return panelModifications;
};

/**
 * Calculates the value of the bonus stats for a designated [sp|ex]-parameter.
 * @param {number} paramId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @param {number} idExtra The id modifier for s/x params.
 * @returns {number}
 */
Game_Actor.prototype.getSdpBonusForNonCoreParam = function(sparamId, baseParam, idExtra) {
  const panelRankings = this.getAllSdpRankings();
  if (!panelRankings.length) return 0;

  let panelModifications = 0;
  // for each of the panel rankings this actor has established-
  panelRankings.forEach(panelRanking => {
    // get the corresponding SDP's panel parameters.
    const panelParameters = $gameSystem
      .getSdpPanel(panelRanking.key)
      .getPanelParameterById(sparamId + idExtra); // need +10 because sparams start higher.
    if (panelParameters.length) {
      panelParameters.forEach(panelParameter => {
        const perRank = panelParameter.perRank;
        const curRank = panelRanking.currentRank;
        if (!panelParameter.isFlat) {
          panelModifications += baseParam * (curRank * perRank) / 100;
        } else {
          panelModifications += (curRank * perRank) / 100;
        }
      });
    }
  });

  return panelModifications;
};

J.SDP.Aliased.Game_Actor.param = Game_Actor.prototype.param;
Game_Actor.prototype.param = function(paramId) {
  const baseParam = J.SDP.Aliased.Game_Actor.param.call(this, paramId);
  const panelModifications = this.getSdpBonusForCoreParam(paramId, baseParam);
  const result = baseParam + panelModifications;
  return result;
};

J.SDP.Aliased.Game_Actor.xparam = Game_Actor.prototype.xparam;
Game_Actor.prototype.xparam = function(xparamId) {
  const baseParam = J.SDP.Aliased.Game_Actor.xparam.call(this, xparamId);
  const panelModifications = this.getSdpBonusForNonCoreParam(xparamId, baseParam, 8);
  const result = baseParam + panelModifications;
  return result;
};

J.SDP.Aliased.Game_Actor.sparam = Game_Actor.prototype.sparam;
Game_Actor.prototype.sparam = function(sparamId) {
  const baseParam = J.SDP.Aliased.Game_Actor.sparam.call(this, sparamId);
  const panelModifications = this.getSdpBonusForNonCoreParam(sparamId, baseParam, 18);
  const result = baseParam + panelModifications;
  return result;
};
//#endregion Game_Actor

//#region Game_BattleMap
/**
 * Extends the basic rewards from defeating an enemy to also include SDP points.
 */
J.SDP.Aliased.Game_BattleMap.gainBasicRewards = Game_BattleMap.prototype.gainBasicRewards;
Game_BattleMap.prototype.gainBasicRewards = function(enemy, actor) {
  J.SDP.Aliased.Game_BattleMap.gainBasicRewards.call(this, enemy, actor);
  let sdpPoints = enemy.sdpPoints();

  if (!sdpPoints) return;

  const actorSprite = actor.getCharacter();
  const levelMultiplier = this.getRewardScalingMultiplier(enemy, actor);
  sdpPoints = Math.ceil(sdpPoints * levelMultiplier);

  this.gainSdpReward(sdpPoints, actorSprite);
  this.createSdpLog(sdpPoints, actor);
};

/**
 * Gains SDP points from battle rewards.
 * @param {number} sdpPoints The SDP points to gain.
 * @param {Game_Character} actorSprite The sprite that visually represents the actor.
 */
Game_BattleMap.prototype.gainSdpReward = function(sdpPoints, actorSprite) {
  // don't do anything if the enemy didn't grant any sdp points.
  if (!sdpPoints) return;

  $gameParty.members().forEach(member => member.modSdpPoints(sdpPoints));
  const sdpPop = this.configureSdpPop(sdpPoints);
  actorSprite.addTextPop(sdpPop);
  actorSprite.setRequestTextPop();
};

/**
 * Creates the text pop of the SDP points gained.
 * @param {number} exp The amount of experience gained.
 */
Game_BattleMap.prototype.configureSdpPop = function(sdpPoints) {
  const iconId = 306;
  const textColor = 17;
  const popup = new JABS_TextPop(
    null,
    iconId,
    textColor,
    null,
    null,
    "sdp",
    sdpPoints);
  return popup;
};

Game_BattleMap.prototype.createSdpLog = function(sdpPoints, battler) {
  if (!J.TextLog.Metadata.Enabled || !J.TextLog.Metadata.Active) return;

  const battlerData = battler.getReferenceData();
  const sdpMessage = `${battlerData.name} earned ${sdpPoints} SDP points.`;
  const sdpLog = new Map_TextLog(sdpMessage, -1);
  $gameTextLog.addLog(sdpLog);
};
//#endregion Game_BattleMap

//#region Game_System
/**
 * Hooks in and initializes the SDP system.
 */
J.SDP.Aliased.Game_System.initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  this.initSdpMembers();
  J.SDP.Aliased.Game_System.initialize.call(this);
};

/**
 * Initializes the SDP system and binds earned panels to the `$gameSystem` object.
 */
Game_System.prototype.initSdpMembers = function() {
  this._j = this._j || {};
  this._j._sdp = this._j._sdp || {};
  /**
   * The collection of all panels earned (though maybe not unlocked).
   * @type {StatDistributionPanel[]}
   */
  this._j._sdp._panels = this._j._sdp._panels || [];
};

/**
 * Gets all the currently earned panels.
 * @returns {StatDistributionPanel[]}
 */
Game_System.prototype.getSdpPanels = function() {
  return this._j._sdp._panels;
};

/**
 * Gets a single panel based on the key provided.
 * @param {string} key The less-friendly unique key that represents this SDP.
 * @returns {StatDistributionPanel}
 */
Game_System.prototype.getSdpPanel = function(key) {
  // if we don't have panels to search through, don't do it.
  if (!this._j._sdp._panels.length) return null;

  const panel = this._j._sdp._panels.find(panel => panel.key === key);
  return panel;
};

/**
 * Creates and adds a panel to the currently available list.
 * @param {string} name The friendly name for this SDP.
 * @param {string} key The less-friendly unique key that represents this SDP.
 * @param {number} iconIndex The icon index for this panel.
 * @param {string} description The description for this panel. Can include escape characters.
 * @param {number} maxRank The maximum rank for this SDP.
 * @param {number} baseCost The base cost for this SDP.
 * @param {number} flatGrowthCost The flat cost increase per rank.
 * @param {number} multGrowthCost The multiplicative cost increase per rank.
 * @param {string} maxReward The effects performed when a panel is maxed out.
 * @param {string} maxRewardDescription The description of the effect for maxing this panel.
 * @param {...PanelParameter} panelParameters The parameters that this SDP affects.
 */
Game_System.prototype.addSdpPanel = function(
  name, key, iconIndex, description, maxRank, 
  baseCost, flatGrowthCost, multGrowthCost, maxReward, maxRewardDescription,
  ...panelParameters) {
    const exists = this.getSdpPanel(key);
    if (exists) {
      console.error('Panel with that key already exists.');
      return;
    }

    const newPanel = new StatDistributionPanel(
      name,
      key,
      iconIndex,
      description,
      maxRank,
      baseCost,
      flatGrowthCost,
      multGrowthCost,
      maxReward,
      maxRewardDescription,
      ...panelParameters
    );

    this._j._sdp._panels.push(newPanel);
};

/**
 * Create a single parameter to add to a SDP.
 * @param {number} parameterId The parameter this class represents.
 * @param {number} perRank The amount per rank this parameter gives.
 * @param {boolean} isFlat True if it is flat growth, false if it is percent growth.
 */
Game_System.prototype.createPanelParam = function(parameterId, perRankAmount, isFlatGrowth) {
  const panelParam = new PanelParameter(parameterId, perRankAmount, isFlatGrowth);
  return panelParam;
};
//#endregion Game_System

//#region Game_Troop
/**
 * Gets the amount of SDP points earned from all defeated enemies.
 * @returns {number}
 */
Game_Troop.prototype.sdpTotal = function() {
  const members = this.deadMembers();
  const sdpPoints = members.reduce((r, enemy) => r.concat(enemy.sdpPoints()), 0);
  return sdpPoints;
};
//#endregion Game_Troop
//#endregion Game objects

//#region Scene objects
//#region Scene_SDP
class Scene_SDP extends Scene_MenuBase {
  constructor() {
    super();
    this.initialize();
  };

  /**
   * The entry point of this scene.
   */
  initialize() {
    super.initialize(this);
    this.initMembers();
  };

  /**
   * Initializes all properties for this scene.
   */
  initMembers() {
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
    };
  };

  /**
   * Hooks into the create parent function to create all windows after the window
   * layer has been established.
   */
  create() {
    super.create();
    this.createAllWindows();
  };

  /**
   * Runs once per frame to update all things in this scene.
   */
  update() {
    super.update();
    this.updateIndex();
    this.updateActor();
  };

  /**
   * Updates the index to keep in sync with the window's currently-selected index.
   */
  updateIndex() {
    const currentIndex = this._j._index;
    const newIndex = this._j._sdpListWindow.index()
    if (currentIndex !== newIndex) {
      this._j._index = this._j._sdpListWindow.index();
      this._j._currentPanel = this._j._sdpListWindow._list[this._j._index].ext;
      this._j._sdpDetailsWindow.setPanel(this._j._currentPanel);
      this._j._sdpHelpWindow.setText(this._j._currentPanel.description);
    }
  };

  /**
   * OVERWRITE Determines the current actor.
   */
  updateActor() {
    this._j._currentActor = $gameParty.leader();
  };

  /**
   * OVERWRITE Removes the buttons on the map/screen.
   */
  createButtons() {
    return;
  };

  //#region SDP window creation
  /**
   * Creates all windows associated with the SDP scene.
   */
  createAllWindows() {
    this.createPointsWindow();
    this.createHelpWindow();
    this.createDetailsWindow();
    this.createListWindow();
    this.createConfirmationWindow();
  };

  /**
   * Creates the list of SDPs available to the player.
   */
  createListWindow() {
    const width = 400;
    const heightFit = (this._j._sdpPointsWindow.height + this._j._sdpHelpWindow.height) + 8;
    const height = Graphics.height - heightFit;
    const x = 0;
    const y = this._j._sdpPointsWindow.height;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpListWindow = new Window_SDP_List(rect);
    this._j._sdpListWindow.setHandler('cancel', this.popScene.bind(this));
    this._j._sdpListWindow.setHandler('ok', this.onSelectPanel.bind(this));
    this._j._sdpListWindow.setActor($gameParty.leader());
    this.addWindow(this._j._sdpListWindow);
  };

  /**
   * Creates the details window that describes a panel and what leveling it does.
   */
  createDetailsWindow() {
    const width = Graphics.boxWidth - 400;
    const height = Graphics.boxHeight - 100;
    const x = 400;
    const y = 0;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpDetailsWindow = new Window_SDP_Details(rect);
    this._j._sdpDetailsWindow.setActor($gameParty.leader());
    this.addWindow(this._j._sdpDetailsWindow);
  };

  /**
   * Creates the help window that provides contextual details to the player about the panel.
   */
  createHelpWindow() {
    const width = Graphics.boxWidth;
    const height = 100;
    const x = 0;
    const y = Graphics.boxHeight - height;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpHelpWindow = new Window_SDP_Help(rect);
    this.addWindow(this._j._sdpHelpWindow);
  };

  /**
   * Creates the points window that tracks how many SDP points the player has.
   */
  createPointsWindow() {
    const width = 400;
    const height = 60;
    const x = 0;
    const y = 0;
    const rect = new Rectangle(x, y, width, height);
    this._j._sdpPointsWindow = new Window_SDP_Points(rect);
    this._j._sdpPointsWindow.setActor($gameParty.leader());
    this.addWindow(this._j._sdpPointsWindow);
  };

  /**
   * Creates the list of SDPs available to the player.
   */
  createConfirmationWindow() {
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
  };
  //#endregion SDP window creation
  
  /**
   * Refreshes all windows in this scene.
   */
  refreshAllWindows() {
    this._j._sdpDetailsWindow.refresh();
    this._j._sdpHelpWindow.refresh();
    this._j._sdpPointsWindow.refresh();
    this._j._sdpListWindow.refresh();
    //this._j._sdpConfirmationWindow.refresh();
  };

  /**
   * When selecting a panel, bring up the confirmation window.
   */
  onSelectPanel() {
    this._j._sdpConfirmationWindow.show();
    this._j._sdpConfirmationWindow.open();
    this._j._sdpConfirmationWindow.activate();
  };

  /**
   * If the player opts to upgrade the existing panel, remove the points and rank up the panel.
   */
  onUpgradeConfirm() {
    const panel = this._j._currentPanel;
    const actor = this._j._currentActor;
    const panelRanking = actor.getSdpByKey(panel.key);
    const panelRankupCost = panel.rankUpCost(panelRanking.currentRank);
    actor.modSdpPoints(-panelRankupCost);
    actor.rankUpPanel(panel.key);
    this.refreshAllWindows();
    this._j._sdpDetailsWindow.setActor(this._j._currentActor);

    this._j._sdpConfirmationWindow.close();
    this._j._sdpListWindow.activate();
  };

  /**
   * If the player opts to cancel the upgrade process, return to the list window.
   */
  onUpgradeCancel() {
    this._j._sdpConfirmationWindow.close();
    this._j._sdpConfirmationWindow.hide();
    this._j._sdpListWindow.activate();
  };
};
//#endregion Scene_SDP
//#endregion Scene objects

//#region Window objects
//#region Window_SDP_List
/**
 * The SDP window containing the list of all earned SDPs.
 */
class Window_SDP_List extends Window_Command {
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect) {
    super(rect);
    this.initialize(rect);
    this.initMembers();
  };

  initMembers() {
    /**
     * The currently selected actor. Used for comparing points to cost to see if
     * the panel in the list window should be enabled or disabled.
     * @type {Game_Actor}
     */
    this.currentActor = null;
  };

  /**
   * Sets the actor for this window to the provided actor.
   * @param {Game_Actor} actor The actor to assign to this window.
   */
  setActor(actor) {
    this.currentActor = actor;
    this.refresh();
  };

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign() {
    return "left";
  };

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList() {
    const panels = $gameSystem.getSdpPanels();
    const actor = this.currentActor;
    if (!panels.length || !actor) return;
    
    const points = actor.getSdpPoints();
    
    // add all panels to the list.
    panels.forEach(panel => {
      let panelRanking = actor.getSdpByKey(panel.key);
      // if this actor is missing any rankings for the panel, just make one.
      if (!panelRanking) actor.addNewPanelRanking(panel.key, panel.maxRank);

      const currentRank = actor.getSdpByKey(panel.key).currentRank;
      const hasEnoughPoints = panel.rankUpCost(currentRank) <= points;
      const isMaxRank = panel.maxRank === currentRank;
      const enabled = hasEnoughPoints && !isMaxRank;
      this.addCommand(panel.name, panel.key, enabled, panel, panel.iconIndex);
    });
  };
};
//#endregion Window_SDP_List

//#region Window_SDP_Details
class Window_SDP_Details extends Window_Base {
  constructor(rect) {
    super(rect);
    this.initialize(rect);
    this.initMembers();
    this.refresh();
  };

  /**
   * Initializes all members of this window.
   */
  initMembers() {
    /**
     * The panel currently being displayed in this window.
     * @type {StatDistributionPanel}
     */
    this.currentPanel = null;

    /**
     * The actor used for parameter comparisons.
     * @type {Game_Actor}
     */
    this.currentActor = null;
  };

  /**
   * Refreshes this window and all its content.
   */
  refresh() {
    // don't refresh if there is no panel to refresh the contents of.
    if (!this.currentPanel && !this.currentActor) return;

    this.contents.clear();
    this.drawPanelInfo();
  };


  /**
   * Sets the panel that this window is displaying info for.
   * @param {StatDistributionPanel} panel The panel to display info for.
   */
  setPanel(panel) {
    this.currentPanel = panel;
    this.refresh();
  };

  /**
   * Sets the stat comparison actor to be this actor.
   * @param {Game_Actor} actor The actor to perform stat comparisons against.
   */
  setActor(actor) {
    this.currentActor = actor;
  };

  /**
   * Draws all the data associated with the currently selected panel.
   */
  drawPanelInfo() {
    this.drawHeaderDetails();
    this.drawLevelDetails();
    this.drawCostDetails();
    this.drawAllParameterDetails();
  };

  /**
   * Draws the top-level information of the panel.
   */
  drawHeaderDetails() {
    const panel = this.currentPanel;
    const lh = this.lineHeight();
    this.drawTextEx(`\\I[${panel.iconIndex}]${panel.name}`, 0, lh*0, 300);
    this.drawTextEx(`${panel.maxRewardDescription}`, 20, lh*1, 600);
  };

  /**
   * Draws the ranking information of the panel.
   */
  drawLevelDetails() {
    const panel = this.currentPanel;
    const actor = this.currentActor;
    const panelRanking = actor.getSdpByKey(panel.key);
    const lh = this.lineHeight();
    const ox = 360;
    this.drawText(`Rank:`, ox, lh*0, 200, "left");
    this.changeTextColor(this.determinePanelRankColor(panelRanking.currentRank, panelRanking.maxRank));
    this.drawText(`${panelRanking.currentRank}`, ox+55, lh*0, 50, "right");
    this.resetTextColor();
    this.drawText(`/`, ox+110, lh*0, 30, "left");
    this.drawText(`${panel.maxRank}`, ox+130, lh*0, 50, "left");
  };

  /**
   * Determines the color of the "current rank" number text.
   * @param {number} currentRank The current rank of this panel.
   * @param {number} maxRank The maximum rank of this panel.
   * @returns {number} The id of the color.
   */
  determinePanelRankColor(currentRank, maxRank) {
    if (currentRank === 0) return ColorManager.damageColor();
    else if (currentRank < maxRank) return ColorManager.crisisColor();
    else if (currentRank >= maxRank) return ColorManager.powerUpColor();
    else return ColorManager.normalColor();
  };

  /**
   * Draws the cost information of ranking this panel up.
   */
  drawCostDetails() {
    const panel = this.currentPanel;
    const actor = this.currentActor;
    const panelRanking = actor.getSdpByKey(panel.key);
    const rankUpCost = panel.rankUpCost(panelRanking.currentRank);
    const lh = this.lineHeight();
    const ox = 560;
    const costColor = this.determineCostColor(rankUpCost);
    this.drawText(`Cost:`, ox, lh*0, 200, "left");
    if (costColor) {
      this.changeTextColor(costColor);
      this.drawText(`${rankUpCost}`, ox + 100, lh*0, 120, "left");
      this.resetTextColor();  
    } else {
      this.drawText(`---`, ox + 100, lh*0, 80, "left");
    }
  };

  /**
   * Determines the color of the "current rank" number text.
   * @param {number} currentRank The current rank of this panel.
   * @param {number} maxRank The maximum rank of this panel.
   * @returns {number} The id of the color.
   */
  determineCostColor(rankUpCost) {
    // if the cost is 0, then just return, it doesn't matter.
    if (rankUpCost === 0) return null;

    const currentSdpPoints = this.currentActor.getSdpPoints();

    if (rankUpCost <= currentSdpPoints) return ColorManager.powerUpColor();
    else return ColorManager.damageColor();
  };

  /**
   * Draws the parameters and how they are affected by this panel.
   */
  drawAllParameterDetails() {
    const panel = this.currentPanel;
    const lh = this.lineHeight();
    const panelParameters = panel.panelParameters;
    this.drawParameterHeaderRow(120);
    panelParameters.forEach((parameter, index) => {
      this.drawParameterDetailsRow(parameter, 160+lh*index);
    });
  };

  /**
   * Draws the header row of the table that represents all parameters affected by
   * leveling the currently highlighted panel.
   */
  drawParameterHeaderRow(y) {
    const ox = 20;
    const rw = 200;
    this.drawTextEx(`Parameter`, ox+rw*0, y, 100); // TODO: determine icon for params.
    this.drawText(`Current`, ox+rw*1, y, 100, "left");
    this.drawText(`Effect`, ox+rw*2, y, 100, "left");
    this.drawText(`Potential`, ox+rw*3, y, 120, "left");
  };

  /**
   * Draws a single row representing one potentially changed parameter by leveling this panel.
   * @param {PanelParameter} panelParameter The panel parameter information.
   * @param {number} y The `y` coordinate for this row.
   */
  drawParameterDetailsRow(panelParameter, y) {
    const actor = this.currentActor;
    const { parameterId, perRank, isFlat } = panelParameter;
    const { name, value, iconIndex } = this.translateParameter(parameterId);
    const ox = 20;
    const rw = 200;
    const isPositive = perRank >= 0 ? '+' : '';
    const currentValue = parseFloat(value);
    const potentialValue = isFlat
      ? (currentValue + perRank)
      : (currentValue + (currentValue * (perRank / 100)));
    const modifier = isFlat
      ? perRank
      : (potentialValue - currentValue);
    const potentialColor = (currentValue > potentialValue) 
      ? ColorManager.deathColor() 
      : ColorManager.powerUpColor();

    // parameter name.
    this.drawTextEx(`\\I[${iconIndex}]${name}`, ox+rw*0, y, 100);

    // parameter current value.
    this.drawText(currentValue, ox+rw*1, y, 100, "center");

    // parameter modifier by this panel.
    this.changeTextColor(potentialColor);
    this.drawText(`(${isPositive}${modifier})`, ox+rw*2, y, 100, "center");

    // new parameter value if this panel is ranked up.
    this.drawText(`${potentialValue}`, ox+rw*3, y, 100, "center");
    this.resetTextColor();    
  };

  /**
   * Translates a parameter id into an object with its name and value.
   * @param {number} paramId The id to translate.
   * @returns {{name:string, value:number}} An object containing the name and value.
   */
  translateParameter(paramId) {
    const actor = this.currentActor;
    let name = '';
    let value = 0;
    let difference = 0;
    switch (paramId) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: 
        name = TextManager.param(paramId);
        value = actor.param(paramId);
        break;
      case  8: case  9: case 10: case 11: case 12:
      case 13: case 14: case 15: case 16: case 17: 
        name = TextManager.xparam(paramId-8);
        value = (actor.xparam(paramId-8) * 100).toFixed(2);
        break;
      case 18: case 19: case 20: case 21: case 22:
      case 23: case 24: case 25: case 26: case 27:
        name = TextManager.sparam(paramId-18);
        value = (actor.sparam(paramId-18) * 100).toFixed(2);
    }

    const iconIndex = this.getIconByParameterId(paramId);

    return { name, value, iconIndex };
  };

  /**
   * Gets the icon index of the given parameter.
   * TODO: move this to the base plugin.
   * @param {number} parameterId The id of a parameter to get the icon for.
   * @returns {number} The `iconIndex` of this parameter.
   */
  getIconByParameterId(parameterId) {
    switch (parameterId) {
      // core params
      case  0: return 247; // mhp
      case  1: return 248; // mmp
      case  2: return 2755; // atk
      case  3: return 251; // def
      case  4: return 252; // mat
      case  5: return 253; // mdf
      case  6: return 254; // agi
      case  7: return 255; // luk

      // ex params
      case  8: return 102; // hit
      case  9: return  82; // eva
      case 10: return 127; // cri
      case 11: return  81; // cev
      case 12: return  71; // mev
      case 13: return 222; // mrf
      case 14: return  15; // cnt
      case 15: return 2153; // hrg
      case 16: return 2245; // mrg
      case 17: return   13; // trg

      // sp params
      case 18: return  14; // trg (aggro)
      case 19: return 128; // grd (parry)
      case 20: return  84; // rec
      case 21: return 209; // pha
      case 22: return 189; // mcr (mp reduce)
      case 23: return 126; // tcr (tp reduce)
      case 24: return 129; // pdr
      case 25: return 147; // mdr
      case 26: return 141; // fdr
      case 27: return 156; // exr

      default: 
        console.error(`no icon is mapped for id: [${parameterId}].`);
        return 0;
    };
  };
};
//#endregion Window_SDP_Details

//#region Window_SDP_Help
class Window_SDP_Help extends Window_Help {
  constructor(rect) {
    super(rect);
    this.initialize(rect);
  };
};
//#endregion Window_SDP_Help

//#region Window_SDP_Points
/**
 * The SDP window containing the amount of SDP points a given actor has.
 */
class Window_SDP_Points extends Window_Base {
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that defines this window's shape.
   */
  constructor(rect) {
    super(rect);
    this.initialize(rect);
    this.initMembers();
    this.refresh();
  };

  /**
   * Initializes all members of this window.
   */
  initMembers() {
    this._actor = null;
  };

  /**
   * Refreshes this window and all its content.
   */
  refresh() {
    this.contents.clear();
    this.drawPoints();
  };

  /**
   * Draws the SDP icon and number of points this actor has.
   */
  drawPoints() {
    this.drawSdpIcon();
    this.drawSdpPoints();
  };

  /**
   * Draws the "SDP icon" representing points.
   */
  drawSdpIcon() {
    const x = 0;
    const y = 2;
    const iconIndex = J.SDP.Metadata.PointsIcon;
    this.drawIcon(iconIndex, x, y);
  };

  /**
   * Draws the SDP points the actor currently has.
   */
  drawSdpPoints() {
    // don't draw the points if the actor is unavailable.
    if (!this._actor) return;

    const points = this._actor.getSdpPoints();
    const x = 40;
    const y = 0;
    const textWidth = 300;
    const alignment = "left";
    this.drawText(points, x, y, textWidth, alignment);
  };

  /**
   * Sets the actor focus for the SDP points window.
   * @param {Game_Actor} actor The actor to display SDP info for.
   */
  setActor(actor) {
    this._actor = actor;
    this.refresh();
  };
};
//#endregion Window_SDP_Points

//#region Window_SDP_ConfirmUpgrade
class Window_SDP_ConfirmUpgrade extends Window_Command {
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect) {
    super(rect);
    this.initialize(rect);
    this.initMembers();
  };

  /**
   * Initializes all members of this window.
   */
  initMembers() {
    /**
     * The cost of this panel to execute an upgrade.
     * @type {number}
     */
    this.cost = 0;

    /**
     * The actor to reduce the points of if the player chooses to upgrade the panel.
     * @type {Game_Actor}
     */
    this.actor = null;
  };

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList() {
    this.addCommand(`Upgrade this panel`, `panel-upgrade-ok`, true, null, 91);
    this.addCommand(`Cancel`, `panel-upgrade-cancel`, true, null, 90);
  };
};
//#endregion Window_SDP_ConfirmUpgrade

//#endregion Window objects

//#region Custom classes
//#region StatDistributionPanel
function StatDistributionPanel() { this.initialize(...arguments); }
StatDistributionPanel.prototype = {};
StatDistributionPanel.prototype.constructor = StatDistributionPanel;
StatDistributionPanel.prototype.initialize = function(
  name,
  key, 
  iconIndex,
  description,
  maxRank, 
  baseCost,
  flatGrowthCost,
  multGrowthCost,
  maxReward,
  maxRewardDescription,
  ...panelParameters) {
    /**
     * Gets the friendly name for this SDP.
     * @type {string}
     */
    this.name = name;
    
    /**
     * Gets the unique identifier key that represents this SDP.
     * @type {string}
     */
    this.key = key;

    /**
     * Gets the icon index for this SDP.
     * @type {number}
     */
    this.iconIndex = iconIndex;

    /**
     * Gets the description for this SDP.
     * @type {string}
     */
    this.description = description;

    /**
     * Gets the maximum rank for this SDP.
     * @type {number}
     */
    this.maxRank = maxRank;

    /**
     * The base cost to rank up this panel.
     * @type {number}
     */
    this.baseCost = baseCost;

    /**
     * The flat amount per rank that the cost will grow.
     * @type {number}
     */
    this.flatGrowthCost = flatGrowthCost;

    /**
     * The multiplicative amount per rank that the cost will grow.
     * @type {number}
     */
    this.multGrowthCost = multGrowthCost;

    /**
     * The effect of what happens when this panel is maxed out.
     * @type {string}
     */
    this.maxReward = maxReward;

    /**
     * The description of the what happens when you max out this panel.
     * @type {string}
     */
    this.maxRewardDescription = maxRewardDescription;

    /**
     * Gets all parameters that this SDP affects.
     * @returns {PanelParameter[]}
     */
    this.panelParameters = panelParameters;
};

/**
 * Calculates the cost of SDP points to rank this panel up.
 * @param {number} currentRank The current ranking of this panel for a given actor.
 * @returns {number}
 */
StatDistributionPanel.prototype.rankUpCost = function(currentRank) {
  if (currentRank === this.maxRank) {
    return 0;
  } else {
    const growth = Math.floor(this.multGrowthCost * (this.flatGrowthCost * (currentRank + 1)));
    const cost = this.baseCost + growth;
    return cost;
  }
};

/**
 * Retrieves all panel parameters associated with a provided `paramId`.
 * @param {number} paramId The `paramId` to find parameters for.
 * @returns {PanelParameter[]}
 */
StatDistributionPanel.prototype.getPanelParameterById = function(paramId) {
  const panelParameters = this.panelParameters;
  const result = panelParameters.filter(panelParameter => panelParameter.parameterId === paramId);
  return result;
};
//#endregion StatDistributionPanel

//#region PanelParameter
/**
 * A class that represents a single parameter and its growth for a `StatDistributionPanel`.
 */
function PanelParameter() { this.initialize(...arguments); }
PanelParameter.prototype = {};
PanelParameter.prototype.constructor = PanelParameter;

/**
 * 
 * @param {number} parameterId The parameter this class represents.
 * @param {number} perRank The amount per rank this parameter gives.
 * @param {boolean} isFlat True if it is flat growth, false if it is percent growth.
 */
PanelParameter.prototype.initialize = function(parameterId, perRank, isFlat) {
  /**
   * The id of the parameter this class represents.
   * @type {number}
   */
  this.parameterId = parameterId;

  /**
   * The amount per rank this parameter gives.
   * @type {number}
   */
  this.perRank = perRank;

  /**
   * Whether or not the growth per rank for this parameter is flat or percent.
   * @type {boolean} True if it is flat growth, false if it is percent growth.
   */
  this.isFlat = isFlat;
};
//#endregion PanelParameter

//#region PanelRanking
/**
 * A class for tracking an actor's ranking in a particular panel.
 */
function PanelRanking() { this.initialize(...arguments); }
PanelRanking.prototype = {};
PanelRanking.prototype.constructor = PanelRanking;

PanelRanking.prototype.initialize = function(key, maxRank) {
    /**
     * The key for this panel ranking.
     */
    this.key = key;

    /**
     * The maximum rank for this panel.
     */
    this.maxRank = maxRank;
    this.initMembers();
};

/**
 * Initializes all members of this class.
 */
PanelRanking.prototype.initMembers = function() {
    /**
     * The current rank for this panel ranking.
     */
    this.currentRank = 0;
};

/**
 * Ranks up this panel.
 */
PanelRanking.prototype.rankUp = function() {
  if (this.currentRank < this.maxRank) {
    this.currentRank++;
    if (this.currentRank === this.maxRank) {
      this.performMaxEffect();
    }
  } else {
    // can't rank up beyond max.
  }
};

/**
 * Upon maxing the panel, try to perform this `javascript` effect.
 */
PanelRanking.prototype.performMaxEffect = function() {
  const a = $gameParty.leader();
  SoundManager.playMagicEvasion();
  const rewardEffect = $gameSystem.getSdpPanel(this.key).maxReward;
  try {
    eval(rewardEffect);
  } catch (err) {
    console.error(`An error occurred while trying to execute the maxreward for panel: ${this.key}`);
    console.error(err);
  }
};
//#endregion PanelRanking
//#endregion Custom classes

//ENDOFFILE