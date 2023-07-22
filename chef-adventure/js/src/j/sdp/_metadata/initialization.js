/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.3';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.SDP = {};

/**
 * The `metadata` associated with this plugin.
 */
J.SDP.Metadata = {};
J.SDP.Metadata.Name =`J-SDP`;
J.SDP.Metadata.Version = '1.3.0';

/**
 * A collection of helpful functions to use throughout the plugin.
 */
J.SDP.Helpers = {};

/**
 * Translates the raw JSON from the plugin parameters into the SDPs available throughout
 * the game.
 * @param {string} obj The raw JSON extracted from the plugin parameters.
 * @returns {StatDistributionPanel[]} A collection of all potential SDPs.
 */
J.SDP.Helpers.TranslateSDPs = function(obj)
{
  const parsedBlob = JSON.parse(obj);
  const parsedPanels = [];

  parsedBlob.forEach(panelBlob =>
  {
    // parse and translate all properties to the correct type.
    const parsedPanel = JSON.parse(panelBlob);

    // parse and assign all the various panel parameters.
    const parsedPanelParameters = [];
    const panelParametersBlob = parsedPanel.panelParameters;
    const halfParsedParametersBlob = JSON.parse(panelParametersBlob);
    halfParsedParametersBlob.forEach(paramBlob =>
    {
      const parsedParameter = JSON.parse(paramBlob);
      const panelParameter = new PanelParameter({
        parameterId: parseInt(parsedParameter.parameterId),
        perRank: parseFloat(parsedParameter.perRank),
        isFlat: (parsedParameter.isFlat === "true"),
        isCore: (parsedParameter.isCore === "true"),
      });
      parsedPanelParameters.push(panelParameter);
    });

    // parse out all the panel rewards if there are any.
    const parsedPanelRewards = [];
    const panelRewardsBlob = parsedPanel.rankupRewards;
    if (panelRewardsBlob)
    {
      const halfParsedRewardsBlob = JSON.parse(panelRewardsBlob);
      halfParsedRewardsBlob.forEach(reward =>
      {
        const parsedReward = JSON.parse(reward);
        const panelReward = new PanelRankupReward(
          parseInt(parsedReward.rankRequired),
          parsedReward.effect);
        parsedPanelRewards.push(panelReward);
      });
    }

    // parse the rarity color.
    const rarityColorIndex = SDP_Rarity.fromRarityToColor(parsedPanel.rarity);

    // create the panel.
    const panel = new StatDistributionPanel({
      name: parsedPanel.name,
      key: parsedPanel.key,
      iconIndex: parseInt(parsedPanel.iconIndex),
      unlocked: (parsedPanel.unlocked === "true"),
      description: parsedPanel.description,
      maxRank: parseInt(parsedPanel.maxRank),
      baseCost: parseInt(parsedPanel.baseCost),
      flatGrowthCost: parseInt(parsedPanel.flatGrowthCost),
      multGrowthCost: parseFloat(parsedPanel.multGrowthCost),
      topFlavorText: parsedPanel.topFlavorText,
      panelRewards: parsedPanelRewards,
      panelParameters: parsedPanelParameters,
      rarity: rarityColorIndex,
    });

    parsedPanels.push(panel);
  });

  return parsedPanels;
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.SDP.PluginParameters = PluginManager.parameters(J.SDP.Metadata.Name);
J.SDP.Metadata = {
  ...J.SDP.Metadata,

  /**
   * The translated SDPs from the plugin parameters.
   */
  Panels: [],

  /**
   * The iconIndex that will be used to represent the SDP points earned for an actor.
   * @type {number}
   */
  PointsIcon: parseInt(J.SDP.PluginParameters['SDP Icon']),

  /**
   * The rewards text displayed after a battle is won.
   * @type {string}
   */
  VictoryText: (J.SDP.PluginParameters['SDP Gained Text']),

  /**
   * The switch id that adds visibility for this in menus.
   * @type {number}
   */
  Switch: parseInt(J.SDP.PluginParameters['SDP Switch']),

  /**
   * The icon index for the SDP option in the JABS quick menu.
   * @type {number}
   */
  JabsMenuIcon: parseInt(J.SDP.PluginParameters['SDP JABS Menu Icon']),

  /**
   * Whether or not to show this in both the JABS quick menu AND main menu, or just the JABS quick menu.
   * @type {boolean}
   */
  JabsShowBoth: J.SDP.PluginParameters['Show In Both'] === "true",

  /**
   * The command name for the SDP command.
   */
  CommandName: "Distribute",
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.SDP.Aliased = {
  BattleManager: {},
  DataManager: new Map(),
  JABS_Engine: new Map(),

  Game_Action: new Map(),
  Game_Actor: new Map(),
  Game_Enemy: new Map(),
  Game_Switches: new Map(),
  Game_System: new Map(),

  Scene_Map: new Map(),
  Scene_Menu: new Map(),

  Window_AbsMenu: new Map(),
  Window_MenuCommand: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.SDP.RegExp = {
  SdpPoints: /<sdpPoints:[ ]?([0-9]*)>/i,
  SdpMultiplier: /<sdpMultiplier:[ ]?([-.\d]+)>/i,
  SdpDropData: /<sdpDropData:[ ]?(\[[-\w]+,[ ]?\d+(:?,[ ]?\d+)?])>/i,
  SdpUnlockKey: /<sdpUnlock:(.+)>/i,
};

//region plugin commands
/**
 * Plugin command for calling the SDP scene/menu.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Call SDP Menu", () =>
{
  Scene_SDP.callScene();
});

/**
 * Plugin command for unlocking a SDP to be leveled.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Unlock SDP", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    $gameSystem.unlockSdp(key);
  });
});

/**
 * Plugin command for locking a SDP to no longer be available for the player.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Lock SDP", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    $gameSystem.lockSdp(key);
  });
});

/**
 * Plugin command for modifying an actor's SDP points.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Modify SDP points", args =>
{
  let {actorId, sdpPoints} = args;
  actorId = parseInt(actorId);
  sdpPoints = parseInt(sdpPoints);
  $gameActors
    .actor(actorId)
    .modSdpPoints(sdpPoints);
});

/**
 * Plugin command for modifying all current party members' SDP points.
 */
PluginManager.registerCommand(J.SDP.Metadata.Name, "Modify party SDP points", args =>
{
  let {sdpPoints} = args;
  sdpPoints = parseInt(sdpPoints);
  $gameParty.members().forEach(member =>
  {
    member.modSdpPoints(sdpPoints);
  });
});
//endregion plugin commands
//endregion Introduction