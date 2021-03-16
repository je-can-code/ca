//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v2.3 JABS] (J's Action Battle System)
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * It would be overwhelming to write everything here.
 * Do visit the URL attached to this plugin for documentation.
 * 
 * @param LineBreak1
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param baseConfigs
 * @text BASE SETUP
 * 
 * @param Action Map Id
 * @parent baseConfigs
 * @type number
 * @desc The default id of the map used for cloning action events off of.
 * @default 2
 * 
 * @param Dodge Skill Type Id
 * @parent baseConfigs
 * @type number
 * @desc The default id of the skill type that acts as a classification for dodge skills.
 * @default 1
 * 
 * @param Guard Skill Type Id
 * @parent baseConfigs
 * @type number
 * @desc The default id of the skill type that acts as a classification for guard skills.
 * @default 2
 * 
 * @param LineBreak2
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param defaultConfigs
 * @text WHEN UNASSIGNED
 * 
 * @param Default Enemy Prepare Time
 * @parent defaultConfigs
 * @type number
 * @desc The default number of frames for "prepare" time.
 * @default 180
 * 
 * @param Default Tool Cooldown Time
 * @parent defaultConfigs
 * @type number
 * @desc The default number of frames for an item's cooldown if one isn't specified.
 * @default 300
 * 
 * @param Default Attack Animation Id
 * @parent defaultConfigs
 * @type number
 * @desc The default id of the animation for battlers when none is defined.
 * @default 1
 * 
 * @param LineBreak3
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param iconConfigs
 * @text ICON CONFIGURATIONS
 * 
 * @param Use Elemental Icons
 * @parent iconConfigs
 * @type boolean
 * @desc Enable or disable the display of elemental icons on damage popups with this option.
 * @default true
 * 
 * @param Elemental Icons
 * @parent iconConfigs
 * @type struct<ElementalIconStruct>[]
 * @desc The collection of element ids and their icon indices.
 * @default ["{\"elementId\":\"0\",\"iconIndex\":\"127\"}","{\"elementId\":\"1\",\"iconIndex\":\"97\"}","{\"elementId\":\"2\",\"iconIndex\":\"107\"}","{\"elementId\":\"3\",\"iconIndex\":\"110\"}","{\"elementId\":\"4\",\"iconIndex\":\"64\"}","{\"elementId\":\"5\",\"iconIndex\":\"67\"}","{\"elementId\":\"6\",\"iconIndex\":\"69\"}","{\"elementId\":\"7\",\"iconIndex\":\"68\"}","{\"elementId\":\"8\",\"iconIndex\":\"70\"}","{\"elementId\":\"9\",\"iconIndex\":\"71\"}"]
 * 
 * @param Use Danger Indicator Icons
 * @parent iconConfigs
 * @type boolean
 * @desc Enable or disable the display of danger indicator icons beside enemy hp gauges with this option.
 * @default true
 *
 * @param Danger Indicator Icons
 * @parent iconConfigs
 * @type struct<DangerIconsStruct>
 * @desc The collection of icons to represent enemy danger levels beside their hp gauge.
 * @default {"Worthless":"880","Simple":"881","Easy":"882","Average":"883","Hard":"884","Grueling":"885","Deadly":"886"}
 * 
 * @param LineBreak4
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param animationConfigs
 * @text ACTION DECIDED ANIMATIONS
 * 
 * @param Attack Decided Animation Id
 * @parent animationConfigs
 * @type animation
 * @desc The animation id that plays on the ai-controlled battler when they decide an attack-action.
 * @default 135
 * 
 * @param Support Decided Animation Id
 * @parent animationConfigs
 * @type animation
 * @desc The animation id that plays on the ai-controlled battler when they decide a support-action.
 * @default 136
 * 
 * @param LineBreak5
 * @text --------------------------
 * @default ----------------------------------
 *
 *=================================================================================================
 * 
 * @command Enable JABS
 * @text Enable JABS
 * @desc Enables the JABS engine allowing battles on the map to take place.
 * 
 * @command Disable JABS
 * @text Disable JABS
 * @desc Disables the JABS engine.
 *
 * @command Set JABS Skill
 * @text Force-assign a JABS skill
 * @desc Forcefully assigns a specific skill id or (item id) to a designated slot.
 * @arg Id
 * @type number
 * @default 1
 * @arg Slot
 * @type select
 * @option Tool
 * @option Dodge
 * @option R1A
 * @option R1B
 * @option R1X
 * @option R1Y
 * @option L1A
 * @option L1B
 * @option L1X
 * @option L1Y
 * 
 * @command Unlock JABS Skill Slot
 * @text Unlock a single JABS skill slot
 * @desc Unlocks a single JABS skill slot for the leader.
 * @arg Slot
 * @type select
 * @option Tool
 * @option Dodge
 * @option R1A
 * @option R1B
 * @option R1X
 * @option R1Y
 * @option L1A
 * @option L1B
 * @option L1X
 * @option L1Y
 * 
 * @command Unlock All JABS Skill Slots
 * @text Unlock all JABS skill slots
 * @desc Unlocks all JABS skill slots for the leader.
 * 
 * @command Rotate Party Members
 * @text Cycle to next leader
 * @desc Cycles the leader to the back and shifts all members forward one slot.
 * 
 * @command Disable Party Rotation
 * @text Disable Party Rotation
 * @desc Disables the player from being able to rotate the party leader.
 * (This only affects the JABS party rotate functionality.)
 * 
 * @command Enable Party Rotation
 * @text Enable Party Rotation
 * @desc (Re-)Enables the ability to execute a party rotate.
 * Other conditions still apply (like not rotating to a dead member).
 * 
 * @command Refresh JABS Menu
 * @text Refresh JABS Menu
 * @desc Refreshes the JABS menu in case there were any adjustments made to it.
 */
//=================================================================================================
/*~struct~ElementalIconStruct:
 * @param elementId
 * @type number
 * @desc The id of the element to match an icon to.
 * @default 0
 * 
 * @param iconIndex
 * @type number
 * @desc The index of the icon for this element.
 * @default 64
*/
/*~struct~DangerIconsStruct:
 * @param Worthless
 * @type number
 * @text Extremely Easy <7
 * @desc When an enemy is more 7+ levels below the player, display this icon.
 * @default 591
 * 
 * @param Simple
 * @type number
 * @text Very Easy <5-6
 * @desc When an enemy is more 5-6 levels below the player, display this icon.
 * @default 583
 * 
 * @param Easy
 * @type number
 * @text Easy <3-4
 * @desc When an enemy is more 3-4 levels below the player, display this icon.
 * @default 581
 * 
 * @param Average
 * @type number
 * @text Normal +/- 2
 * @desc When the player and enemy are within 0-2 levels of eachother, display this icon.
 * @default 579
 * 
 * @param Hard
 * @type number
 * @text Hard >3-4
 * @desc When an player is more 3-4 levels below the enemy, display this icon.
 * @default 578
 * 
 * @param Grueling
 * @type number
 * @text Very Hard >5-6
 * @desc When an player is more 5-6 levels below the enemy, display this icon.
 * @default 577
 * 
 * @param Deadly
 * @type number
 * @text Extremely Hard >7+
 * @desc When an player is more 7+ levels below the enemy, display this icon.
 * @default 588
*/
//=================================================================================================
//#endregion Introduction

//#region Plugin metadata management
if (J.Base.Metadata.Version < 1.00) {
  let message = `In order to use JABS, `;
  message += `you gotta have the "J-Base.js" enabled, `;
  message += `placed above the JABS plugin, `;
  message += `and at version 1.00 or higher.`;
  throw Error(message);
}

//#region plugin setup and configuration
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS = {};

/**
 * A collection of helpful functions for use within this plugin.
 */
J.ABS.Helpers = {};

/**
 * A collection of helper functions for the use with the plugin manager.
 */
J.ABS.Helpers.PluginManager = {};

/**
 * A helpful function for translating a plugin command's slot to a valid slot.
 * @param {string} slot The slot from the plugin command to translate.
 * @returns {string} The translated slot.
 */
J.ABS.Helpers.PluginManager.TranslateOptionToSlot = slot => {
  switch (slot) {
    case "Tool": return Game_Actor.JABS_TOOLSKILL;
    case "Dodge": return Game_Actor.JABS_DODGESKILL;
    case "R1A": return Game_Actor.JABS_R1_A_SKILL;
    case "R1B": return Game_Actor.JABS_R1_B_SKILL;
    case "R1X": return Game_Actor.JABS_R1_X_SKILL;
    case "R1Y": return Game_Actor.JABS_R1_Y_SKILL;
    case "L1A": return Game_Actor.JABS_L1_A_SKILL;
    case "L1B": return Game_Actor.JABS_L1_B_SKILL;
    case "L1X": return Game_Actor.JABS_L1_X_SKILL;
    case "L1Y": return Game_Actor.JABS_L1_Y_SKILL;
  };
};

/**
 * A helpful function for translating a plugin command's slot to a valid slot.
 * @param {object} obj The slot from the plugin command to translate.
 * @returns {{element: number, icon: number}} The translated slot.
 */
J.ABS.Helpers.PluginManager.TranslateElementalIcons = obj => {
  // no element icons identified.
  if (!obj) return [];

  const arr = JSON.parse(obj);
  if (!obj.length) return [];
  const elementalIcons = arr.map(el => {
    const kvp = JSON.parse(el);
    const { elementId, iconIndex } = kvp;
    return { element: parseInt(elementId), icon: parseInt(iconIndex) };
  });

  return elementalIcons;
};

J.ABS.Helpers.PluginManager.TranslateDangerIndicatorIcons = obj => {
  // no danger indicator icons identified.
  if (!obj) return {};

  // parse the JSON and update the values to be actual numbers.
  const raw = JSON.parse(obj);
  Object.keys(raw).forEach(key => {
    raw[key] = parseInt(raw[key]);
  });

  return raw;
};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.Metadata = {};
J.ABS.Metadata.Name = `J-ABS`;
J.ABS.Metadata.Version = 2.3;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.PluginParameters = PluginManager.parameters(J.ABS.Metadata.Name);

J.ABS.Metadata.DefaultActionMapId = Number(J.ABS.PluginParameters['Action Map Id']);
J.ABS.Metadata.DefaultDodgeSkillTypeId = Number(J.ABS.PluginParameters['Dodge Skill Type Id']);
J.ABS.Metadata.DefaultGuardSkillTypeId = Number(J.ABS.PluginParameters['Guard Skill Type Id']);

J.ABS.Metadata.DefaultEnemyPrepareTime = Number(J.ABS.PluginParameters['Default Enemy Prepare Time']);
J.ABS.Metadata.DefaultToolCooldownTime = Number(J.ABS.PluginParameters['Default Tool Cooldown Time']);
J.ABS.Metadata.DefaultAttackAnimationId = Number(J.ABS.PluginParameters['Default Attack Animation Id']);

J.ABS.Metadata.UseElementalIcons = Boolean(J.ABS.PluginParameters['Use Elemental Icons'] == "true");
J.ABS.Metadata.ElementalIcons = J.ABS.Helpers.PluginManager.TranslateElementalIcons(J.ABS.PluginParameters['Elemental Icons']);
J.ABS.Metadata.UseDangerIndicatorIcons = Boolean(J.ABS.PluginParameters['Use Danger Indicator Icons'] == "true");
J.ABS.Metadata.DangerIndicatorIcons = J.ABS.Helpers.PluginManager.TranslateDangerIndicatorIcons(J.ABS.PluginParameters['Danger Indicator Icons']);

J.ABS.Metadata.AttackDecidedAnimationId = Number(J.ABS.PluginParameters['Attack Decided Animation Id']);
J.ABS.Metadata.SupportDecidedAnimationId = Number(J.ABS.PluginParameters['Support Decided Animation Id']);

/**
 * A collection of icons that represent the danger level of a given enemy relative to the player.
 */
J.ABS.DangerIndicatorIcons = {
  /**
   * Worthless enemies are 7+ levels below the player.
   * @type {number}
   */
  Worthless: J.ABS.Metadata.DangerIndicatorIcons.Worthless,

  /**
   * Simple enemies are 5-6 levels below the player.
   * @type {number}
   */
  Simple: J.ABS.Metadata.DangerIndicatorIcons.Simple,

  /**
   * Easy enemies are 3-4 levels below the player.
   * @type {number}
   */
  Easy: J.ABS.Metadata.DangerIndicatorIcons.Easy,

  /**
   * Average enemies are +/- 2 levels of the player.
   * @type {number}
   */
  Average: J.ABS.Metadata.DangerIndicatorIcons.Average,

  /**
   * Hard enemies are 3-4 levels above the player.
   * @type {number}
   */
  Hard: J.ABS.Metadata.DangerIndicatorIcons.Hard,

  /**
   * Grueling enemies are 5-6 levels above the player.
   * @type {number}
   */
  Grueling: J.ABS.Metadata.DangerIndicatorIcons.Grueling,

  /**
   * Deadly enemies are 7+ levels above the player.
   * @type {number}
   */
  Deadly: J.ABS.Metadata.DangerIndicatorIcons.Deadly,
};

/**
 * The various default values across the engine. Often configurable.
 */
J.ABS.DefaultValues = {
  /**
   * When an enemy JABS battler has no "prepare" defined.
   */
  EnemyNoPrepare: J.ABS.Metadata.DefaultEnemyPrepareTime,

  /**
   * The ID of the map that will contain the actions for replication.
   */
  ActionMap: J.ABS.Metadata.DefaultActionMapId,

  /**
   * The default animation id for skills when it is set to "normal attack".
   * Typically used for enemies or weaponless battlers.
   */
  AttackAnimationId: J.ABS.Metadata.DefaultAttackAnimationId,

  /**
   * The skill category that governs skills that are identified as "dodge" skills.
   */
  DodgeSkillTypeId: J.ABS.Metadata.DefaultDodgeSkillTypeId,

  /**
   * The skill category that governs skills that are identified as "guard" skills.
   */
  GuardSkillTypeId: J.ABS.Metadata.DefaultGuardSkillTypeId,

  /**
   * When an item has no cooldown defined.
   */
  CooldownlessItems: J.ABS.Metadata.DefaultToolCooldownTime,
};

/**
 * A collection of helpful mappings for emoji balloons
 * to their numeric ID.
 */
J.ABS.Balloons = {
  /**
   * An exclamation point balloon.
   */
  Exclamation: 1,

  /**
   * A question mark balloon.
   */
  Question: 2,

  /**
   * A music note balloon.
   */
  MusicNote: 3,

  /**
   * A heart balloon.
   */
  Heart: 4,

  /**
   * An anger balloon.
   */
  Anger: 5,

  /**
   * A sweat drop balloon.
   */
  Sweat: 6,

  /**
   * A frustrated balloon.
   */
  Frustration: 7,

  /**
   * A elipses (...) or triple-dot balloon.
   */
  Silence: 8,

  /**
   * A light bulb or realization balloon.
   */
  LightBulb: 9,

  /**
   * A double-Z (zz) balloon.
   */
  Asleep: 10,

  /**
   * A green checkmark.
   */
  Check: 11,
};

/**
 * A collection of helpful mappings for `Game_Character` directions 
 * to their numeric ID.
 */
J.ABS.Directions = {

  /**
   * Represents the UP direction, or 8.
   */
  UP: 8,

  /**
   * Represents the RIGTH direction, or 6.
   */
  RIGHT: 6,

  /**
   * Represents the LEFT direction, or 4.
   */
  LEFT: 4,

  /**
   * Represents the DOWN direction, or 2.
   */
  DOWN: 2,

  /**
   * Represents the diagonal LOWER LEFT direction, or 1.
   */
  LOWERLEFT: 1,

  /**
   * Represents the diagonal LOWER RIGHT direction, or 3.
   */
  LOWERRIGHT: 3,

  /**
   * Represents the diagonal UPPER LEFT direction, or 7.
   */
  UPPERLEFT: 7,

  /**
   * Represents the diagonal UPPER RIGHT direction, or 9.
   */
  UPPERRIGHT: 9,
};

/**
 * A collection of helpful mappings for `notes` that are placed in 
 * various locations, like events on the map, or in a database enemy.
 */
J.ABS.Notetags = {
  // battler-related (goes in database on enemy/actor).
  KnockbackResist: "knockbackResist",
  MoveType: {
    Forward: "forward",
    Backward: "backward",
    Directional: "directional",
  },
  EventControl: {
    /**
     * The regex structure for retrieving a switch to toggle.
     */
    Switch: /<switch:[ ]?(\d+)>/i,

    /**
     * The regex structure for retrieving a self-switch to toggle.
     */
    SelfSwitch: /<self[-]?switch:[ ]?(a|b|c|d):[ ]?(\d+)>/i,

    /**
     * The regex structure for retrieving a variable to add to.
     */
    Variable: /<variable:[ ]?(\d+)[ ]?:[ ]?([-]?[\d]+)>/i,
  },
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.Aliased = {
  DataManager: {},
  Game_Actor: {},
  Game_Action: {},
  Game_ActionResult: {},
  Game_Character: {},
  Game_CharacterBase: {},
  Game_Event: {},
  Game_Interpreter: {},
  Game_Map: {},
  Game_Party: {},
  Game_Player: {},
  Game_Unit: {},
  Scene_Load: {},
  Scene_Map: {},
  Spriteset_Map: {},
  Sprite_Character: {},
  Sprite_Damage: {},
  Sprite_Gauge: {},
};
//#endregion Plugin setup & configuration

//#region Plugin Command Registration
/**
 * Plugin command for enabling JABS.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Enable JABS", () => {
  $gameBattleMap.absEnabled = true;
});

/**
 * Plugin command for disabling JABS.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Disable JABS", () => {
  $gameBattleMap.absEnabled = false;
});

/**
 * Plugin command for assigning and locking a skill to a designated slot.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Set JABS Skill", args => {
  const leader = $gameParty.leader();
  if (!leader) {
    console.warn("There is no leader to manage skills for.");
    return;
  }

  const { Id, Slot } = args;
  const translation = J.ABS.Helpers.PluginManager.TranslateOptionToSlot(Slot);
  leader.setEquippedSkill(translation, Id, true);
});

/**
 * Plugin command for unlocking a specific JABS skill slot.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Unlock JABS Skill Slot", args => {
  const leader = $gameParty.leader();
  if (!leader) {
    console.warn("There is no leader to manage skills for.");
    return;
  }

  const { Slot } = args;
  const translation = J.ABS.Helpers.PluginManager.TranslateOptionToSlot(Slot);
  leader.unlockSlot(translation);
});

/**
 * Plugin command for unlocking all JABS skill slots.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Unlock All JABS Skill Slots", () => {
  const leader = $gameParty.leader();
  if (!leader) {
    console.warn("There is no leader to manage skills for.");
    return;
  }

  leader.unlockAllSlots();
});

/**
 * Plugin command for cycling through party members forcefully.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Rotate Party Members", () => {
  $gameBattleMap.rotatePartyMembers(true);
});

/**
 * Plugin command for disabling the ability to rotate party members.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Disable Party Rotation", () => {
  $gameParty.disablePartyCycling();
});

/**
 * Plugin command for enabling the ability to rotate party members.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Enable Party Rotation", () => {
  $gameParty.enablePartyCycling();
});

/**
 * Plugin command for updating the JABS menu.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Refresh JABS Menu", () => {
  $gameBattleMap.requestJabsMenuRefresh = true;
});
//#endregion Plugin Command Registration
//#endregion Plugin metadata management

//#region Static objects
//#region DataManager
/**
 * The global reference for the `Game_BattleMap` data object.
 * @type Game_BattleMap
 * @global
 */
var $gameBattleMap = null;

/**
 * The global reference for the `Game_Enemies` data object.
 * @type {Game_Enemies}
 * @global
 */
var $gameEnemies = null;

/**
 * The global reference for the `$dataMap` data object that contains all the replicable `JABS_Action`s.
 * @type {Object}
 * @global
 */
var $actionMap = null;

/**
 * Hooks into `DataManager` to create the game objects.
 */
J.ABS.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  J.ABS.Aliased.DataManager.createGameObjects.call(this);

  DataManager.getSkillMasterMap();

  $gameBattleMap = new Game_BattleMap();
  $gameEnemies = new Game_Enemies();
};

/**
 * Executes the retrieval of the skill master map from which we clone all action events.
 */
DataManager.getSkillMasterMap = function() {
  const mapId = J.ABS.DefaultValues.ActionMap;
  if (mapId > 0) {
    const filename = "Map%1.json".format(mapId.padZero(3));
    this.loadSkillMasterMap("$dataMap", filename);
  } else {
    throw new Error("Missing skill master map.");
  }
};

/**
 * Retrieves the skill master map.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 */
DataManager.loadSkillMasterMap = function(name, src) {
  const xhr = new XMLHttpRequest();
  const url = "data/" + src;
  xhr.open("GET", url);
  xhr.overrideMimeType("application/json");
  xhr.onload = () => this.onMapGet(xhr, name, src, url);
  xhr.onerror = () => this.gracefulFail(name, src, url);
  xhr.send();
};

/**
 * Retrieves the map data file from a given location.
 * @param {XMLHttpRequest} xhr The `xhr` service for fetching files from the local.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 * @param {string} url The path of the file to retrieve.
 */
DataManager.onMapGet = function(xhr, name, src, url) {
  if (xhr.status < 400) {
    const mapData = JSON.parse(xhr.responseText);
    $actionMap = mapData;
  } else {
    this.gracefulFail(name, src, url);
  }
};

/**
 * Gracefully fails and just logs it a missing file or whatever is the problem.
 * @param {string} name The name of the problemed file.
 * @param {string} src The source.
 * @param {string} url The path of the problemed file.
 */
DataManager.gracefulFail = function(name, src, url) {
  console.warn(name, src, url);
  return;
}

//#endregion

//#region Input
/**
 * The mappings of the gamepad descriptions to their buttons.
 */
J.ABS.Input = {};
J.ABS.Input.DirUp = "up";
J.ABS.Input.DirDown = "down";
J.ABS.Input.DirLeft = "left";
J.ABS.Input.DirRight = "right";
J.ABS.Input.A = "ok";
J.ABS.Input.B = "cancel";
J.ABS.Input.X = "shift";
J.ABS.Input.Y = "tab";
J.ABS.Input.R1 = "pagedown";
J.ABS.Input.R2 = "r2";          // new!
J.ABS.Input.R3 = "r3";          // new!
J.ABS.Input.L1 = "pageup";
J.ABS.Input.L2 = "l2";          // new!
J.ABS.Input.L3 = "l3";          // new!
J.ABS.Input.Start = "start";    // new!
J.ABS.Input.Select = "select";  // new!
J.ABS.Input.Cheat = "cheat"     // new!

/**
 * Rewrites gamepad button input to instead perform the various actions that
 * are expected in this ABS.
 * 
 * This includes:
 * - D-Pad up, down, left, right
 * - A/cross, B/circle, X/square, Y/triangle
 * - L1/LB, R1/RB
 * - NEW: select/optoins, start/menu
 * - NEW: L2/LT, R2/RT
 * - NEW: L3/LSB, R3/RSB
 * - OVERWRITE: Y now is the tool button, and start is the menu.
 */
Input.gamepadMapper = {
  0: J.ABS.Input.A,
  1: J.ABS.Input.B,
  2: J.ABS.Input.X,
  3: J.ABS.Input.Y,
  4: J.ABS.Input.L1,
  5: J.ABS.Input.R1,
  6: J.ABS.Input.L2,
  7: J.ABS.Input.R2,
  8: J.ABS.Input.Select,
  9: J.ABS.Input.Start,
  10: J.ABS.Input.L3,
  11: J.ABS.Input.R3,
  12: J.ABS.Input.DirUp,
  13: J.ABS.Input.DirDown,
  14: J.ABS.Input.DirLeft,
  15: J.ABS.Input.DirRight,
}

/**
 * Extends the existing mapper for keyboards to accommodate for the
 * additional skill inputs that are used for gamepads.
 */
Input.keyMapper = {
  ...Input.keyMapper,

  // this is the new debug move-through for use with JABS.
  192: J.ABS.Input.Cheat,     // ` (backtick)

  // core keys.
  38: J.ABS.Input.DirUp,      // arrow up
  40: J.ABS.Input.DirDown,    // arrow down
  37: J.ABS.Input.DirLeft,    // arrow left
  39: J.ABS.Input.DirRight,   // arrow right
  90: J.ABS.Input.A,          // z
  88: J.ABS.Input.B,          // x
  16: J.ABS.Input.X,          // shift
  67: J.ABS.Input.Y,          // c
  81: J.ABS.Input.L1,         // q
  17: J.ABS.Input.L2,         // ctrl
  69: J.ABS.Input.R1,         // e
  9:  J.ABS.Input.R2,         // tab
  13: J.ABS.Input.Start,      // enter
  46: J.ABS.Input.Select,     // del

  // keyboard alternative for the multi-button skills.
  49: "1",       // 1 = main
  50: "2",       // 2 = off
  51: "3",       // 3 = L1 + A
  52: "4",       // 4 = L1 + B
  53: "5",       // 5 = L1 + X
  54: "6",       // 6 = L1 + Y
  55: "7",       // 7 = R1 + A
  56: "8",       // 8 = R1 + B
  57: "9",       // 9 = R1 + X
  48: "0",       // 0 = R1 + Y
};
//#endregion
//#endregion Static objects

//#region Core MZ Game Objects
//#region Game_Actor
Game_Actor.JABS_MAINHAND = "Main";
Game_Actor.JABS_OFFHAND = "Off";
Game_Actor.JABS_TOOLSKILL = "Tool";
Game_Actor.JABS_DODGESKILL = "Dodge";
Game_Actor.JABS_L1_A_SKILL = "L1 + A";
Game_Actor.JABS_L1_B_SKILL = "L1 + B";
Game_Actor.JABS_L1_X_SKILL = "L1 + X";
Game_Actor.JABS_L1_Y_SKILL = "L1 + Y";
Game_Actor.JABS_R1_A_SKILL = "R1 + A";
Game_Actor.JABS_R1_B_SKILL = "R1 + B";
Game_Actor.JABS_R1_X_SKILL = "R1 + X";
Game_Actor.JABS_R1_Y_SKILL = "R1 + Y";

/**
 * Adds in the jabs tracking object for equipped skills.
 */
J.ABS.Aliased.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
  J.ABS.Aliased.Game_Actor.initMembers.call(this);
  this._j = {};
  this._j._equippedSkills = {};
  this._j._speedBoosts = 0;
  this._j._bonusHits = 0;
};

/**
 * Extends `.setup()` and initializes the jabs equipped skills.
 */
J.ABS.Aliased.Game_Actor.setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
  J.ABS.Aliased.Game_Actor.setup.call(this, actorId);
  this.initAbsSkills();
  this.refreshSpeedBoosts();
  this.refreshBonusHits();
};

/**
 * Initializes the jabs equipped skills based on equipment.
 */
Game_Actor.prototype.initAbsSkills = function() {
  this._j._equippedSkills[Game_Actor.JABS_TOOLSKILL]  = { id: 0, locked: false, };
  this._j._equippedSkills[Game_Actor.JABS_DODGESKILL] = { id: 0, locked: false, };
  this._j._equippedSkills[Game_Actor.JABS_L1_A_SKILL] = { id: 0, locked: false, };
  this._j._equippedSkills[Game_Actor.JABS_L1_B_SKILL] = { id: 0, locked: false, };
  this._j._equippedSkills[Game_Actor.JABS_L1_X_SKILL] = { id: 0, locked: false, };
  this._j._equippedSkills[Game_Actor.JABS_L1_Y_SKILL] = { id: 0, locked: false, };
  this._j._equippedSkills[Game_Actor.JABS_R1_A_SKILL] = { id: 0, locked: false, };
  this._j._equippedSkills[Game_Actor.JABS_R1_B_SKILL] = { id: 0, locked: false, };
  this._j._equippedSkills[Game_Actor.JABS_R1_X_SKILL] = { id: 0, locked: false, };
  this._j._equippedSkills[Game_Actor.JABS_R1_Y_SKILL] = { id: 0, locked: false, };
  this.updateEquipmentSkills();
};

/**
 * Disable built-in on-turn-end effects while JABS is active.
 * (built-in effects include regeneration and poison, but those are
 * already handled elsewhere in the engine)
 */
J.ABS.Aliased.Game_Actor.turnEndOnMap = Game_Actor.prototype.turnEndOnMap;
Game_Actor.prototype.turnEndOnMap = function() {
  if (!$gameBattleMap.absEnabled) {
    J.ABS.Aliased.Game_Actor.turnEndOnMap.call(this);
  }
};

/**
 * Retreives all skills that are currently equipped on this actor.
 */
Game_Actor.prototype.getAllEquippedSkills = function() {
  return this._j._equippedSkills;
};

/**
 * Gets the currently-equipped skill id in the specified slot.
 * @param {string} slot The slot to retrieve an equipped skill for.
 */
Game_Actor.prototype.getEquippedSkill = function(slot) {
  return this._j._equippedSkills[slot].id;
};

/**
 * Sets the skill id to the specified slot with an option to lock the skill into the slot.
 * @param {string} slot The slot to retrieve an equipped skill for.
 * @param {number} skillId The skill id to assign to the specified slot.
 * @param {boolean} locked Whether or not the skill is locked onto this slot.
 */
Game_Actor.prototype.setEquippedSkill = function(slot, skillId, locked = false) {
  if (this.isSlotLocked(slot)) {
    console.warn("This slot is forcefully assigned and must be unlocked first.");
    SoundManager.playBuzzer();
    return;
  }

  this._j._equippedSkills[slot] = this._j._equippedSkills[slot] || {};
  this._j._equippedSkills[slot].id = skillId;
  this._j._equippedSkills[slot].locked = locked;
};

/**
 * Checks if a slot is locked or not.
 * @param {string} slot The slot being checked to see if it is locked.
 */
Game_Actor.prototype.isSlotLocked = function(slot) {
  if (slot == Game_Actor.JABS_MAINHAND || slot == Game_Actor.JABS_OFFHAND) {
    return false;
  }

  return this._j._equippedSkills[slot].locked;
};

/**
 * Unlocks a slot that was forcefully assigned.
 * @param {string} slot The slot to unlock.
 */
Game_Actor.prototype.unlockSlot = function(slot) {
  this._j._equippedSkills[slot].locked = false;
}

/**
 * Unlocks all slots that were forcefully assigned.
 */
Game_Actor.prototype.unlockAllSlots = function() {
  const slots = Object.keys(this._j._equippedSkills);
  slots.forEach(slot => this._j._equippedSkills[slot].locked = false);
}

/**
 * Updates the latest equipped mainhand/offhand skill slots with whatever the
 * currently equipped gear provides.
 */
Game_Actor.prototype.updateEquipmentSkills = function() {
  const equips = this.equips();
  const hasMainhand = equips[0];
  const hasOffhand = equips[1];

  this.setEquippedSkill(
    Game_Actor.JABS_MAINHAND, 
    hasMainhand 
      ? parseInt(equips[0]._j.skillId)
      : 0);

  this.setEquippedSkill(
    Game_Actor.JABS_OFFHAND, 
    hasOffhand 
      ? parseInt(equips[1]._j.skillId)
      : 0);

  this.releaseUnequippableSkills();
};

/**
 * Automatically removes all skills that are no longer available.
 * This most commonly will occur when a skill is bound to equipment that is
 * no longer equipped to the character. Skills that are "forced" will not be removed.
 */
Game_Actor.prototype.releaseUnequippableSkills = function() {
  const equippedSkills = this.getAllEquippedSkills();
  Object.keys(equippedSkills).forEach(slot => {
    // we will only autoremove skills from the R1/L1/dodge slots.
    if (slot != Game_Actor.JABS_TOOLSKILL && 
    slot != Game_Actor.JABS_MAINHAND &&
    slot != Game_Actor.JABS_OFFHAND) {
      // only remove non-locked skills when gear is unequipped.
      if (!this.hasSkill(this.getEquippedSkill(slot)) && !this.isSlotLocked(slot)) {
        this.removeEquippedSkill(slot);
      }
    }
  });
};

/**
 * Removes the skill id in the specified slot.
 * @param {string} slot The slot to unequip a skill for.
 */
Game_Actor.prototype.removeEquippedSkill = function(slot) {
  this._j._equippedSkills[slot].id = 0;
  this._j._equippedSkills[slot].locked = false;
};

/**
 * Refreshes equipment-based skills every time the actor refreshes.
 */
J.ABS.Aliased.Game_Actor.refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function() {
  J.ABS.Aliased.Game_Actor.refresh.call(this);
  this.updateEquipmentSkills();
  this.refreshSpeedBoosts();
  this.refreshBonusHits();
};

/**
 * Overwrites the levelup display on the map to not display a message.
 */
Game_Actor.prototype.shouldDisplayLevelUp = function() {
  return false;
};

/**
 * Executes the JABS level up process if the leader is the one leveling up.
 */
J.ABS.Aliased.Game_Actor.levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
  J.ABS.Aliased.Game_Actor.levelUp.call(this);
  const isLeader = $gameParty.leader() === this;
  if (isLeader) {
    $gameBattleMap.requestSpriteRefresh = true;
    $gameBattleMap.leaderLevelUp();
  }
};

/**
 * Extends the level down function to refresh sprites' danger indicator.
 */
J.ABS.Aliased.Game_Actor.levelDown = Game_Actor.prototype.levelDown;
Game_Actor.prototype.levelDown = function() {
  J.ABS.Aliased.Game_Actor.levelDown.call(this);
  const isLeader = $gameParty.leader() === this;
  if (isLeader) {
    $gameBattleMap.requestSpriteRefresh = true;
  }
};

J.ABS.Aliased.Game_Actor.learnSkill = Game_Actor.prototype.learnSkill;
Game_Actor.prototype.learnSkill = function(skillId) {
  if (!this.isLearnedSkill(skillId)) {
    const isLeader = $gameParty.leader() == this;
    const skill = $dataSkills[skillId];
    if (isLeader && skill) {
      $gameBattleMap.leaderSkillLearn(skill);
      this.upgradeSkillIfUpgraded(skillId);
    }
  }
  
  J.ABS.Aliased.Game_Actor.learnSkill.call(this, skillId);
};

Game_Actor.prototype.upgradeSkillIfUpgraded = function(skillId) {
  const equippedSkills = this.getAllEquippedSkills();
  Object.keys(equippedSkills).forEach(slot => {
    // we will only manage assignable skills.
    if (slot != Game_Actor.JABS_TOOLSKILL && 
    slot != Game_Actor.JABS_MAINHAND &&
    slot != Game_Actor.JABS_OFFHAND) {
      // do nothing if the slot is locked.
      if (this.isSlotLocked(slot)) return;

      // do nothing if the slot is empty.
      const currentSkillId = this.getEquippedSkill(slot);
      if (!currentSkillId) return;

      // do nothing if the skill doesn't upgrade.
      const skillData = $dataSkills[currentSkillId]
      if (skillData.meta && skillData.meta["Hide if learned Skill"]) {
        const upgradeSkillId = parseInt(skillData.meta["Hide if learned Skill"]);
        if (upgradeSkillId === skillId) {
          this.setEquippedSkill(slot, skillId);
        }
      }
    }
  });
};

/**
 * Updates the speed boost scale for this actor based on equipment.
 */
Game_Actor.prototype.refreshSpeedBoosts = function() {
  const equips = this.equips();
  let speedBoosts = 0;

  equips.forEach(equip => {
    if (!equip) return;
    speedBoosts += equip._j.speedBoost;
  });

  this._j._speedBoosts = speedBoosts;
};

/**
 * Gets the current speed boost scale for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getSpeedBoosts = function() {
  return this._j._speedBoosts;
};

/**
 * Updates the bonus hit count for this actor based on equipment.
 */
Game_Actor.prototype.refreshBonusHits = function() {
  const equips = this.equips();
  let bonusHits = 0;

  equips.forEach(equip => {
    if (!equip) return;
    bonusHits += equip._j.bonusHits;
  });

  this._j._bonusHits = bonusHits;
};

/**
 * Gets the current number of bonus hits for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getBonusHits = function() {
  return this._j._bonusHits;
};

//#endregion

//#region Game_Action
/**
 * OVERWRITE In the context of this `Game_Action`, for non-allies, it should
 * instead return the $dataEnemies data instead of the $gameTroop data because
 * the troop doesn't exist on the map.
 */
Game_Action.prototype.subject = function() {
  let subject;
  if (this._subjectActorId > 0) {
    subject = $gameActors.actor(this._subjectActorId)
  } else {
    subject = $gameEnemies.enemy(this._subjectEnemyIndex);
  }
  return subject;
};

/**
 * OVERWRITE In the context of this `Game_Action`, overwrites the function for
 * setting the subject to reference the $dataEnemies, a new global object reference
 * for the database tab of enemies instead of referencing the troop.
 * @param {Game_Battler} subject The subject to work with.
 */
Game_Action.prototype.setSubject = function(subject) {
  if (subject.isActor()) {
    this._subjectActorId = subject.actorId();
    this._subjectEnemyIndex = -1;
  } else {
    this._subjectEnemyIndex = subject.enemyId();
    this._subjectActorId = 0;
  }
};

/**
 * Gets the parry rate for a given battler.
 * @param {Game_Battler} target The target to check the parry rate for.
 */
Game_Action.prototype.itemPar = function(target) {
  const parryRate = (target.grd - 1).toFixed(3);
  return parryRate;
};

/**
 * Rounds the result of the damage calculations when executing skills.
 */
J.ABS.Aliased.Game_Action.makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
  let base = J.ABS.Aliased.Game_Action.makeDamageValue.call(this, target, critical);

  const player = $gameBattleMap.getPlayerMapBattler();
  const isPlayer = player.getBattler() == target;
  if (isPlayer) {
    // currently, only the player can properly defend like this.
    base = this.handleGuardEffects(base, player);
  }

  base = Math.round(base);
  return base;
};

/**
 * Intercepts the action result and prevents adding states entirely if precise-parried
 * by the player.
 */
J.ABS.Aliased.Game_Action.itemEffectAddState = Game_Action.prototype.itemEffectAddState;
Game_Action.prototype.itemEffectAddState = function(target, effect) {
  const player = $gameBattleMap.getPlayerMapBattler();
  const isPlayer = player.getBattler() == target;
  if (isPlayer) {
    // if it is the player, peek at the result before applying.
    const result = player.getBattler().result();
    if (result.preciseParried) {
      // if the player precise-parried the action, no status effects applied.
      return;
    }
  }

  // if the precise-parry-state-prevention wasn't successful, apply as usual.
  J.ABS.Aliased.Game_Action.itemEffectAddState.call(this, target, effect);
};

/**
 * Reduces 
 * @param {number} damage The amount of damage before damage reductions.
 * @param {JABS_Battler} player The player's `JABS_Battler`.
 * @returns {number} The amount of damage after damage reductions from guarding.
 */
Game_Action.prototype.handleGuardEffects = function(damage, player) {
  if (player.parrying()) {
    const result = player.getBattler().result();
    result.parried = true; // make sure the engine knows its parried.
    result.preciseParried = true;
    damage = 0;
    player.setParryWindow(0);
    player.getCharacter().requestAnimation(0, true, true);
  } else {
    if (player.guarding()) {
      damage = this.percDamageReduction(damage, player);
      damage = this.flatDamageReduction(damage, player);
    }
  }

  return damage;
};

/**
 * Reduces damage of a value if defending- by a flat amount.
 * @param {number} base The base damage value to modify.
 * @param {JABS_Battler} player The player's JABS battler.
 */
Game_Action.prototype.flatDamageReduction = function(base, player) {
  const reduction = parseFloat(player.flatGuardReduction());
  const result = player.getBattler().result();
  result.reduced += reduction;
  base = Math.max((base + reduction), 0);
  return base;
};

/**
 * Reduces damage of a value if defending- by a percent amount.
 * @param {number} base The base damage value to modify.
 * @param {JABS_Battler} player The player's JABS battler.
 */
Game_Action.prototype.percDamageReduction = function(base, player) {
  const reduction = parseFloat(base - ((100 + player.percGuardReduction()) / 100) * base);
  const result = player.getBattler().result();
  result.reduced -= reduction;
  base = Math.max((base - reduction), 0);
  return base;
};

//#endregion

//#region Game_ActionResult
/**
 * Injects additional possible results into all `Game_ActionResult`s.
 */
J.ABS.Aliased.Game_ActionResult.initialize = Game_ActionResult.prototype.initialize;
Game_ActionResult.prototype.initialize = function() {
  this.parried = false;
  this.preciseParried = false;
  this.reduced = 0;
  J.ABS.Aliased.Game_ActionResult.initialize.call(this);
};

/**
 * Extends `.clear()` to include wiping the custom properties.
 */
J.ABS.Aliased.Game_ActionResult.clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function() {
  J.ABS.Aliased.Game_ActionResult.clear.call(this);
  this.parried = false;
  this.preciseParried = false;
  this.reduced = 0;
};

/**
 * OVERWRITE Removes the check for "hit vs rng", and adds in parry instead.
 */
Game_ActionResult.prototype.isHit = function() {
  return this.used && !this.parried && !this.evaded && !this.preciseParried;
};
//#endregion

//#region Game_Character
/**
 * Hooks into the `Game_Character.initMembers` and adds in action sprite properties.
 */
J.ABS.Aliased.Game_Character.initMembers = Game_Character.prototype.initMembers;
Game_Character.prototype.initMembers = function() {
  this._j = this._j || {};
  J.ABS.Aliased.Game_Character.initMembers.call(this);
  this.initActionSpriteProperties();
  this.initLootSpriteProperties();
};

/**
 * Initializes the action sprite properties for this character.
 */
Game_Character.prototype.initActionSpriteProperties = function() {
  this._j._actionSpriteProperties = {
    actionData: null,
    needsAdding: false,
    needsRemoving: false,
    requestDamagePop: false,
    battlerUuid: '',
    damagePops: [],
  }
};

/**
 * Initializes the loot sprite properties.
 */
Game_Character.prototype.initLootSpriteProperties = function() {
  this._j._loot = {
    _needsAdding: false,
    _needsRemoving: false,
    _data: null,
  };
};

/**
 * Gets the loot sprite properties for this event.
 * @returns {object}
 */
Game_Character.prototype.getLootSpriteProperties = function() {
  return this._j._loot;
};

/**
 * Whether or not this character is/has loot.
 */
Game_Character.prototype.isLoot = function() {
  const isLoot = !!this.getLootData();
  return isLoot;
};

/**
 * Gets whether or not this loot needs rendering onto the map.
 * @returns {boolean} True if needing rendering, false otherwise.
 */
Game_Character.prototype.getLootNeedsAdding = function() {
  const loot = this.getLootSpriteProperties();
  return loot._needsAdding;
};

/**
 * Sets the loot to need rendering onto the map.
 * @param {boolean} needsAdding Whether or not this loot needs adding.
 */
Game_Character.prototype.setLootNeedsAdding = function(needsAdding = true) {
  const loot = this.getLootSpriteProperties();
  loot._needsAdding = needsAdding;
};

/**
 * Gets whether or not this loot object is flagged for removal.
 */
Game_Character.prototype.getLootNeedsRemoving = function() {
  const loot = this.getLootSpriteProperties();
  return loot._needsRemoving;
};

/**
 * Sets the loot object to be flagged for removal.
 * @param {boolean} needsRemoving True if we want to remove the loot, false otherwise.
 */
Game_Character.prototype.setLootNeedsRemoving = function(needsRemoving = true) {
  const loot = this.getLootSpriteProperties();
  loot._needsRemoving = needsRemoving;
};

/**
 * Gets the loot data for this character/event.
 */
Game_Character.prototype.getLootData = function() {
  const loot = this.getLootSpriteProperties();
  return loot._data;
};

/**
 * Sets the loot data to the provided loot.
 * @param {object} data The loot data to assign to this character/event.
 */
Game_Character.prototype.setLootData = function(data) {
  const loot = this.getLootSpriteProperties();
  loot._data = data;
};

/**
 * Gets all action sprite properties for this event.
 */
Game_Character.prototype.getActionSpriteProperties = function() {
  return this._j._actionSpriteProperties;
};

/**
 * Gets whether or not this character is an action.
 * @returns {boolean} True if this is an action, false otherwise.
 */
Game_Character.prototype.isAction = function() {
  const isAction = this.getMapActionData();
  return !!isAction;
};

/**
 * Gets the `JABS_Battler` associated with this character.
 * @returns {JABS_Battler}
 */
Game_Character.prototype.getMapBattler = function() {
  const asp = this.getActionSpriteProperties();
  const uuid = asp.battlerUuid;
  const battler = $gameBattleMap.getBattlerByUuid(uuid);
  return battler;
};

/**
 * Gets the `uuid` of this `JABS_Battler`.
 */
Game_Character.prototype.getMapBattlerUuid = function() {
  const asp = this.getActionSpriteProperties();
  const uuid = asp.battlerUuid;
  return uuid;
};

/**
 * Sets the provided `JABS_Battler` to this character.
 * @param {JABS_Battler} battler The `JABS_Battler` to set to this character.
 */
Game_Character.prototype.setMapBattler = function(uuid) {
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.battlerUuid = uuid;
};

/**
 * Gets whether or not this character has a `JABS_Battler` attached to it.
 */
Game_Character.prototype.hasJabsBattler = function() {
  const asp = this.getActionSpriteProperties();
  const uuid = asp.battlerUuid;
  const battler = $gameBattleMap.getBattlerByUuid(uuid);
  return (uuid && battler) ? true : false;
};

/**
 * Gets the `needsAdding` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsAdding = function() {
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsAdding;
};

/**
 * Sets the `needsAdding` property from the `actionSpriteProperties` for this event.
 * @param {boolean} addSprite True if you want this event to be added, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsAdding = function(addSprite = true) {
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.needsAdding = addSprite;
};

/**
 * Gets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsRemoving = function() {
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsRemoving;
};

/**
 * Sets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 * @param {boolean} addSprite True if you want this event to be removed, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsRemoving = function(removeSprite = true) {
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsRemoving = removeSprite;
};

/**
 * Gets the `requestDamagePop` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getRequestTextPop = function() {
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.requestDamagePop;
};

/**
 * Sets the `requestDamagePop` property from the `actionSpriteProperties` for this event.
 * @param {boolean} damagePopRequest True to trigger damage pops, false otherwise (default: true).
 */
Game_Character.prototype.setRequestTextPop = function(damagePopRequest = true) {
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.requestDamagePop = damagePopRequest;
};

/**
 * Gets all current `damagePops` that this character has pending.
 * @returns {number[]} The currently pending `damagePops` for this character.
 */
Game_Character.prototype.getDamagePops = function() {
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.damagePops;
};

/**
 * Adds a damage pop to the pending `damagePops` array for this character.
 * @param {Map_DamagePop} damage A number representing the damage to pop.
 */
Game_Character.prototype.addTextPop = function(damage) {
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.damagePops.push(damage);
};

/**
 * Removes the current damage pop from the `damagePops` array.
 */
Game_Character.prototype.removeDamagePop = function() {
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.damagePops.shift();
};

/**
 * If the event has a `JABS_Action` associated with it, return that.
 * @returns {JABS_Action}
 */
Game_Character.prototype.getMapActionData = function() {
  const actionSpriteProperties = this.getActionSpriteProperties();
  if (actionSpriteProperties.actionData) {
    return actionSpriteProperties.actionData;
  } else {
    return null;
  }
};

/**
 * Execute an animation of a provided id upon this character.
 * @param {number} animationId The animation id to execute on this character.
 */
Game_Character.prototype.requestAnimation = function(animationId, parried = false, preciseParried = false) {
  if (parried) {
    const parryAnimationId = preciseParried ? 132 : 122;
    $gameTemp.requestAnimation([this], parryAnimationId);
  } else {
    $gameTemp.requestAnimation([this], animationId);
  }
};

J.ABS.Aliased.Game_Character.isMovementSucceeded = Game_Character.prototype.isMovementSucceeded;
Game_Character.prototype.isMovementSucceeded = function() {
  const battler = this.getMapBattler();
  if (battler && !battler.canBattlerMove()) {
    return false;
  } else {
    return J.ABS.Aliased.Game_Character.isMovementSucceeded.call(this);
  }
};
//#endregion

//#region Game_CharacterBase
/**
 * Extends the `initMembers()` to allow custom move speeds and dashing.
 */
J.ABS.Aliased.Game_CharacterBase.initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
  J.ABS.Aliased.Game_CharacterBase.initMembers.call(this);
  this._realMoveSpeed = 4;
  this._wasDodging = false;
  this._dodgeBoost = 0;
};

/**
 * OVERWRITE Replaces the "real move speed" value to return
 * our custom real move speed instead, along with dash boosts as necessary.
 * @returns {number} 
 */
Game_CharacterBase.prototype.realMoveSpeed = function() {
  let realMoveSpeed = this._realMoveSpeed;
  const dashBoost = (this.isDashing() 
    ? this.dashSpeed() 
    : 0);
  realMoveSpeed += dashBoost;
  return realMoveSpeed;
};

/**
 * Default speed boost for all characters.
 */
Game_CharacterBase.prototype.dashSpeed = function() {
  return 0.5;
};

/**
 * Extends the `setMoveSpeed()` to also modify custom move speeds.
 */
J.ABS.Aliased.Game_CharacterBase.setMoveSpeed = Game_CharacterBase.prototype.setMoveSpeed;
Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
  J.ABS.Aliased.Game_CharacterBase.setMoveSpeed.call(this, moveSpeed);
  this._realMoveSpeed = moveSpeed;
};

/**
 * Sets the boost gained when dodging to a specified amount.
 * @param {number} dodgeMoveSpeed The boost gained when dodging.
 */
Game_CharacterBase.prototype.setDodgeBoost = function(dodgeMoveSpeed) {
  this._dodgeBoost = dodgeMoveSpeed;
};

/**
 * Extends the update to allow for custom values while dashing.
 */
J.ABS.Aliased.Game_CharacterBase.update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
  J.ABS.Aliased.Game_CharacterBase.update.call(this);
  this.updateDodging();
};

/**
 * Whether or not the player has executed a dodge skill.
 */
Game_CharacterBase.prototype.isDodging = function() {
  const player = $gameBattleMap.getPlayerMapBattler();
  return player.isDodging();
};

/**
 * Alters the speed when dodging (and when dodging is finished).
 */
Game_CharacterBase.prototype.updateDodging = function() {
  const isDodging = this.isDodging();
  if (!this._wasDodging && isDodging) {
    this.setMoveSpeed(this._moveSpeed + this._dodgeBoost);
  }
  if (this._wasDodging && !isDodging) {
    this.setMoveSpeed(this._moveSpeed - this._dodgeBoost);
  }
  this._wasDodging = isDodging;
};
//#endregion

//#region Game_Enemies
/**
 * A class for retrieving a particular enemy.
 */
function Game_Enemies() { this.initialize(...arguments); }

/**
 * Initializes this `Game_Enemies` class.
 */
Game_Enemies.prototype.initialize = function() {
  this._data = [];
};

/**
 * Looks up an enemy of the given id.
 * @param {number} enemyId The id to look up an enemy for.
 * @returns {Game_Enemy}
 */
Game_Enemies.prototype.enemy = function(enemyId) {
  if ($dataEnemies[enemyId]) {
    if (!this._data[enemyId]) {
      this._data[enemyId] = new Game_Enemy(enemyId);
    }
    return this._data[enemyId];
  }
  return null;
};
//#endregion

//#region Game_Event
J.ABS.Aliased.Game_Event.initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function() {
  this._j = this._j || {};

  /**
   * The various parameters extracted from the event on the field.
   * These parameters describe a battler's core data points so that
   * their `JABS_Battler` can be constructed.
   * @type {JABS_BattlerCoreData}
   */
  this._j._battlerData = null;

  /**
   * The initial direction this event is facing.
   */
  this._j._initialDirection = 0;
  J.ABS.Aliased.Game_Event.initMembers.call(this);
};

/**
 * Binds a `JABS_Action` to a `Game_Event`.
 * @param {JABS_Action} action The action to assign to this `Game_Event`.
 */
Game_Event.prototype.setMapActionData = function(action) {
  this._j._actionSpriteProperties.actionData = action;
};

/**
 * Sets the initial direction being faced on this event's creation.
 * @param {number} direction The initial direction faced on creation.
 */
Game_Event.prototype.setInitialDirection = function(direction) {
  this._j._initialDirection = direction;
};

/**
 * Modifies the `.event` method of `Game_Event` to return the data from the
 * $actionMap if it isn't a normal event.
 */
J.ABS.Aliased.Game_Event.event = Game_Event.prototype.event;
Game_Event.prototype.event = function() {
  const base = J.ABS.Aliased.Game_Event.event.call(this);
  if (!!base) {
    // its a regular event or battler.
    return base;
  }
  else {
    // it's not a regular event on the map, it's an action!
    const id = this._eventId;
    const eventDatas = $dataMap.events.filter(event => {
      const isNotNull = !!event;
      const isAction = isNotNull && event.isAction;
      return (isNotNull && isAction);
    });

    const actionEventData = eventDatas.find(ev => id === ev.id);
    return actionEventData;
  }
};

/**
 * Adds an extra catch so that if there is a failure, then the failure is
 * silently ignored because bad timing is just bad luck!
 */
J.ABS.Aliased.Game_Event.findProperPageIndex = Game_Event.prototype.findProperPageIndex;
Game_Event.prototype.findProperPageIndex = function() {
  try {
    const test = J.ABS.Aliased.Game_Event.findProperPageIndex.call(this);
    if (Number.isInteger(test)) return test;
  } catch (err) {
    console.log($dataMap.events);
    console.log($gameMap._events);
    console.error(this);
    console.error("something went wrong", err);
    return -1;
  }
};

/**
 * OVERWRITE When an map battler is hidden by something like a switch or some
 * other condition, unveil it upon meeting such conditions. 
 */
J.ABS.Aliased.Game_Event.refresh = Game_Event.prototype.refresh;
Game_Event.prototype.refresh = function() {
  if ($gameBattleMap.absEnabled) {
    // don't refresh loot.
    if (this.isLoot()) return;

    const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
    if (this._pageIndex !== newPageIndex) {
      this._pageIndex = newPageIndex;
      this.setupPage();
      this.transformBattler();
    }
  } else {
    J.ABS.Aliased.Game_Event.refresh.call(this);
  }
};

/**
 * Reveals a battler that was hidden.
 */
Game_Event.prototype.transformBattler = function() {
  const battler = this.getMapBattler();
  if (battler) {
    battler.revealHiddenBattler();
  } 
  
  $gameMap.refreshOneBattler(this);
};

/**
 * Extends the pagesettings for events and adds on custom parameters to this event.
 */
J.ABS.Aliased.Game_Event.setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function() {
  J.ABS.Aliased.Game_Event.setupPageSettings.call(this);
  this.parseEnemyComments();
};

/**
 * Detects whether or not the event code is one that matches the "comment" code.
 * @param {number} code The code to match.
 * @returns {boolean}
 */
Game_Event.prototype.matchesControlCode = function(code) {
  return (code === 108 || code === 408);
};

/**
 * Parses the comments of this event to extract battler core data if available.
 */
Game_Event.prototype.parseEnemyComments = function() {
  // the defaults for battler core data.
  let battlerId = 0;
  let teamId = 1; // default enemy team
  let ai = null;
  let sightRange = 0;
  let alertedSightBoost = 0;
  let pursuitRange = 0;
  let alertedPursuitBoost = 0;
  let alertDuration = 0;
  let canIdle = true;
  let showHpBar = true;
  let showDangerIndicator = true;
  let showBattlerName = true;
  let isInvincible = false;
  let isInanimate = false;
  let customMoveSpeed = 0;

  const currentPageIndex = this.findProperPageIndex();
  if (currentPageIndex > -1) {
    customMoveSpeed = this.event().pages[currentPageIndex].moveSpeed;
  }

  // iterate over all commands to construct the battler core data.
  this.list().forEach(command => {
    if (this.matchesControlCode(command.code)) {
      const comment = command.parameters[0];
      if (comment.match(/^<[\.\w:-]+>$/i)) {
        switch (true) {
          case (/<e:[ ]?([0-9]*)>/i.test(comment)): // enemy id
            battlerId = parseInt(RegExp.$1);
            break;
          case (/<team:[ ]?([0-9]*)>/i.test(comment)): // enemy id
            teamId = parseInt(RegExp.$1);
            break;
          case (/<ai:[ ]?([0|1]{8})>/i.test(comment)): // ai code
            ai = JABS_Battler.translateAiCode(RegExp.$1);
            break;
          case (/<s:[ ]?([0-9]*)>/i.test(comment)): // sight range
            sightRange = parseInt(RegExp.$1);
            break;
          case (/<as:[ ]?([0-9]*)>/i.test(comment)): // alerted sight boost
            alertedSightBoost = parseInt(RegExp.$1);
            break;
          case (/<p:[ ]?([0-9]*)>/i.test(comment)): // pursuit range
            pursuitRange = parseInt(RegExp.$1);
            break;
          case (/<ap:[ ]?([0-9]*)>/i.test(comment)): // alerted pursuit boost
            alertedPursuitBoost = parseInt(RegExp.$1);
            break;
          case (/<ad:[ ]?([0-9]*)>/i.test(comment)): // alert duration
            alertDuration = parseInt(RegExp.$1);
            break;
          case (/<ms:((0|([1-9][0-9]*))(\.[0-9]+)?)>/i.test(comment)): // custom movespeed
            customMoveSpeed = parseFloat(RegExp.$1);
            this.setMoveSpeed(customMoveSpeed);
            break;
          case (/<noIdle>/i.test(comment)): // able to idle?
            canIdle = false;
            break;
          case (/<noHpBar>/i.test(comment)): // show hp bar?
            showHpBar = false;
            break;
          case (/<noDangerIndicator>/i.test(comment)):
            showDangerIndicator = false;
            break;
          case (/<noName>/i.test(comment)):
            showBattlerName = false;
            break;
          case (/<invincible>/i.test(comment)): // is invincible?
            isInvincible = true;
            break;
          case (/<inanimate>/i.test(comment)): // is inanimate?
            isInanimate = true;
            break;
        }
      }
    }
  });

  // if we don't have an enemy id, the rest doesn't even matter.
  if (battlerId > 0) {
    const battlerCoreData = new JABS_BattlerCoreData(
      battlerId,
      teamId,
      ai ?? new JABS_BattlerAI(),
      sightRange,
      alertedSightBoost,
      pursuitRange,
      alertedPursuitBoost,
      alertDuration,
      canIdle,
      showHpBar,
      showDangerIndicator,
      showBattlerName,
      isInvincible,
      isInanimate);
    this.setBattlerCoreData(battlerCoreData);
  } else {
    this.setBattlerCoreData(null);
    return;
  }
};

/**
 * Gets the core battler data for this event.
 * @returns {JABS_BattlerCoreData}
 */
Game_Event.prototype.getBattlerCoreData = function() {
  return this._j._battlerData;
};

/**
 * Sets the core battler data for this event.
 * @param {JABS_BattlerCoreData} data The core data of the battler this event represents.
 */
Game_Event.prototype.setBattlerCoreData = function(data) {
  this._j._battlerData = data;
};

/**
 * Gets whether or not this event is a JABS battler.
 * @returns {boolean}
 */
Game_Event.prototype.isJabsBattler = function() {
  const data = this.getBattlerCoreData();
  return !!data;
};

/**
 * Gets the battler's id from their core data.
 * @returns {number}
 */
Game_Event.prototype.getBattlerId = function() {
  const data = this.getBattlerCoreData();
  if (!data) return 0;

  const battlerId = data.battlerId();
  return battlerId;
};
//#endregion Game_Event

//#region Game_Interpreter
/**
 * Enables setting move routes of `Game_Character`s on the map with JABS.
 * @param {number} param The character/event id to get the data for.
 * @returns {Game_Character}
 */
J.ABS.Aliased.Game_Interpreter.character = Game_Interpreter.prototype.character;
Game_Interpreter.prototype.character = function(param) {
  if ($gameBattleMap.absEnabled) {
    if (param < 0) {
      return $gamePlayer;
    } else if (this.isOnCurrentMap()) {
      return $gameMap.event(param > 0 ? param : this._eventId);
    } else {
      return null;
    }
  } else {
    return J.ABS.Aliased.Game_Interpreter.character.call(this, param);
  }
};

/**
 * Enables transferring with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command201 = Game_Interpreter.prototype.command201;
Game_Interpreter.prototype.command201 = function(params) {
  if ($gameBattleMap.absEnabled) {
    if ($gameMessage.isBusy()) return false;

    let mapId;
    let x;
    let y;
    if (params[0] === 0) {
      mapId = params[1];
      x = params[2];
      y = params[3];
    } else {
      mapId = $gameVariables.value(params[1]);
      x = $gameVariables.value(params[2]);
      y = $gameVariables.value(params[3]);
    }

    $gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5]);
    this.setWaitMode("transfer");
    return true;
  } else {
   return J.ABS.Aliased.Game_Interpreter.command201.call(this, params);
  }
};

/**
 * Enables map scrolling with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command201 = Game_Interpreter.prototype.command201;
Game_Interpreter.prototype.command204 = function(params) {
  if ($gameBattleMap.absEnabled) {
    if ($gameMap.isScrolling()) {
      this.setWaitMode("scroll");
      return false;
    }

    $gameMap.startScroll(params[0], params[1], params[2]);
    if (params[3]) {
      this.setWaitMode("scroll");
    }

    return true;
  } else {
    return J.ABS.Aliased.Game_Interpreter.command201.call(this, params);
  }
};

/**
 * Enables the shop scene with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command302 = Game_Interpreter.prototype.command302;
Game_Interpreter.prototype.command302 = function(params) {
  if ($gameBattleMap.absEnabled) {
      const goods = [params];
      while (this.nextEventCode() === 605) {
        this._index++;
        goods.push(this.currentCommand().parameters);
      }

      SceneManager.push(Scene_Shop);
      SceneManager.prepareNextScene(goods, params[4]);
      return true;
  } else {
    return J.ABS.Aliased.Game_Interpreter.command302.call(this, params);
  }
};

/**
 * Enables saving with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command352 = Game_Interpreter.prototype.command352;
Game_Interpreter.prototype.command352 = function() {
  if ($gameBattleMap.absEnabled) {
    SceneManager.push(Scene_Save);
    return true;
  } else {
    return J.ABS.Aliased.Game_Interpreter.command352.call(this);
  }
};

/**
 * Enables default battles with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 * 
 * NOTE: Though the battling is enabled, the battles may not behave as one would
 * expect from a default battle system when using an ABS as well.
 */
J.ABS.Aliased.Game_Interpreter.command301 = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function(params) {
  if ($gameBattleMap.absEnabled) {
    let troopId;
    switch (params[0]) {
      case 0:
        // Direct designation
        troopId = params[1];
        break;
      case 1:
        // Designation with a variable
        troopId = $gameVariables.value(params[1]);
        break;
      default:
        // Same as Random Encounters
        troopId = $gamePlayer.makeEncounterTroopId();
        break;
    }

    if ($dataTroops[troopId]) {
      BattleManager.setup(troopId, params[2], params[3]);
      BattleManager.setEventCallback(n => this._branch[this._indent] = n);
      $gamePlayer.makeEncounterCount();
      SceneManager.push(Scene_Battle);
    }

    return true;
  } else {
    return J.ABS.Aliased.Game_Interpreter.command301.call(this, params);
  }
};
//#endregion

//#region Game_Map
/**
 * Hooks into `Game_Map.initialize()` to add the JABS object for tracking
 * all things related to the ABS system.
 */
J.ABS.Aliased.Game_Map.initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
  J.ABS.Aliased.Game_Map.initialize.call(this);
  this._j = {};
  this._j._allBattlers = [];
};

/**
 * Extends `Game_Map.setup()` to parse out battlers and populate enemies.
 */
J.ABS.Aliased.Game_Map.setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
  J.ABS.Aliased.Game_Map.setup.call(this, mapId);
  this.jabsInitialization();
};

/**
 * Initializes all enemies and the battle map for JABS.
 */
Game_Map.prototype.jabsInitialization = function() {
  $gameBattleMap.initialize();
  this.refreshAllBattlers();
};

/**
 * Refresh all battlers on the map. This only affects existing enemies on the map.
 * If an enemy was defeated and thus removed, that enemy is gone until the map is 
 * reinitialized.
 */
Game_Map.prototype.refreshAllBattlers = function() {
  this._j._allBattlers = this.parseBattlers();
};

/**
 * Refreshes a single battler on this map. Only affects existing enemies on the map.
 * This is used almost exclusively with conditional event rendering.
 * @param {Game_Event} event The event to refresh.
 */
Game_Map.prototype.refreshOneBattler = function(event) {
  let targetIndex = -1;

  // get the index of the battler by uuid, assuming they exist in the collection.
  const found = this._j._allBattlers.find((battler, index) => {
    if (battler.getUuid() === event.getMapBattlerUuid()) {
      targetIndex = index;
      return true;
    } else {
      return false;
    }
  });

  // if we found a match, it is update/delete.
  const newBattler = this.convertOneToEnemy(event);
  if (found) {
    // check to see if the new page is an enemy.
    if (newBattler === null) {
      // if not an enemy, delete it from the battler tracking.
      this.destroyBattler(found, true);
    } else {
      // if it is an enemy, update the old enemy with the new one.
      this._j._allBattlers[targetIndex] = newBattler;
    }
  // if we didn't find a match, then its create or do nothing.
  } else {
    // the next page is an enemy, create a new one and add to the list.
    if (!(newBattler === null)) {
      this._j._allBattlers.push(newBattler);
    // the next page is not an enemy, do nothing.
    } else { }
  }
};

/**
 * Hooks into `Game_Map.update()` to add the battle map's update.
 */
J.ABS.Aliased.Game_Map.update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
  J.ABS.Aliased.Game_Map.update.call(this, sceneActive);
  $gameBattleMap.update();
};

/**
 * Gets all battlers on the current battle map.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getBattlers = function() {
  if (this._j._allBattlers === null) return [];

  const livingBattlers = this._j._allBattlers.filter(battler => !!battler);

  return livingBattlers;
};

/**
 * Gets all battlers within a given range of another battler.
 * @param {JABS_Battler} user The user containing the base coordinates.
 * @param {number} maxDistance The maximum distance that we check battlers for.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getBattlersWithinRange = function(user, maxDistance) {
  const battlers = this.getBattlers();
  const nearbyBattlers = battlers.filter(battler => {
    const inRange = user.distanceToDesignatedTarget(battler) <= maxDistance;
    return inRange;
  });

  return nearbyBattlers;
};

/**
 * Gets all non-enemy battlers on the current battle map.
 * @returns {JABS_Battler[]} A list of allied battlers.
 */
Game_Map.prototype.getAlliedBattlers = function() {
  const battlers = this.getBattlers();
  const alliedBattlers = [];
  alliedBattlers.push($gameBattleMap.getPlayerMapBattler());
  battlers.forEach(battler => {
    if (battler.isActor()) {
      alliedBattlers.push(battler);
    }
  });

  return alliedBattlers;
};

/**
 * Gets all non-ally battlers on the current battle map.
 * @returns {JABS_Battler[]} A list of enemy battlers.
 */
Game_Map.prototype.getEnemyBattlers = function() {
  const battlers = this.getBattlers();
  const enemyBattlers = [];
  battlers.forEach(battler => {
    if (battler.isEnemy()) {
      enemyBattlers.push(battler);
    }
  });

  return enemyBattlers;
};

/**
 * Retrieves all events that are identified as loot on the map currently.
 */
Game_Map.prototype.getLootDrops = function() {
  const lootDrops = this.events().filter(event => event.isLoot());
  return lootDrops;
};

/**
 * Parses out all enemies from the array of events on the map.
 * @param {Game_Event[]} evs An array of events.
 * @returns {JABS_Battler[]} A `Game_Enemy[]`.
 */
Game_Map.prototype.parseBattlers = function() {
  const evs = this.events();
  if (evs === undefined || evs === null || evs.length < 1) {
    return [];
  };

  try {
    const result = evs.filter(event => event.isJabsBattler());
    const enemies = this.convertAllToEnemies(result);
    return enemies;
  } catch {
    // for a brief moment when leaving the menu, these are all null.
    return [];
  }
};

/**
 * Converts all provided `Game_Event`s into `Game_Enemy`s.
 * @param {Game_Event[]} events A `Game_Event[]`.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.convertAllToEnemies = function(events) {
  const mapBattlers = events
    .map(event => {
      const mapBattler = this.convertOneToEnemy(event);
      return mapBattler;
  });

  return mapBattlers;
};

/**
 * Converts a single `Game_Event` into a `Game_Enemy`.
 * @param {Game_Event} event The `Game_Event` to convert to a `JABS_Battler`.
 * @returns {JABS_Battler}
 */
Game_Map.prototype.convertOneToEnemy = function(event) {
  if (!event.isJabsBattler()) {
    // if the battler has no id, it is likely being hidden/transformed to non-battler.
    event.setMapBattler("");
    return null;
  }

  const battlerCoreData = event.getBattlerCoreData();
  const battlerId = event.getBattlerId();
  const battler = new Game_Enemy(battlerId, null, null);
  const mapBattler = new JABS_Battler(event, battler, battlerCoreData);
  const uuid = mapBattler.getUuid();
  event.setMapBattler(uuid);
  return mapBattler;
};

/**
 * Deletes and removes a `JABS_Battler` from this map's tracking.
 * @param {JABS_Battler} battler The map battler to destroy.
 */
Game_Map.prototype.destroyBattler = function(targetBattler, holdEvent = false) {
  const uuid = targetBattler.getUuid();
  let targetIndex = -1;
  this._j._allBattlers.find((battler, index) => {
    const result = battler.getUuid() === uuid;
    if (result) targetIndex = index;
    return result;
  });

  // if not holding the event's character, remove it.
  if (!holdEvent) {
    targetBattler.getCharacter().setActionSpriteNeedsRemoving();
  }

  if (targetIndex > -1) {
    // if not holding the event, remove it.
    if (!holdEvent) {
      this._j._allBattlers[targetIndex].getCharacter().erase();
    }

    this._j._allBattlers.splice(targetIndex, 1);
  }
};

/**
 * Adds a provided event to the current map's event list.
 * @param {Game_Event} event The `Game_Event` to add to this map.
 */
Game_Map.prototype.addEvent = function(event) {
  this._events.push(event);
};

/**
 * Removes a provided event from the current map's event list.
 * @param {Game_Event} event The `Game_Event` to remove from this map.
 */
Game_Map.prototype.removeEvent = function(event) {
  let index = -1;
  this._events.forEach((ev, i) => {
    if (ev == event) {
      index = i;
    }
  });

  if (index > -1) {
    // if the index is found, remove the event.
    event.erase();
    this._events.splice(index, 1);
    //$dataMap.events.splice(index+1, 1);
  }
};

/**
 * Removes all actions on the map that have been flagged for removal.
 */
Game_Map.prototype.clearStaleMapActions = function() {
  const eventSprites = this.events();

  // get all the game_event sprites that need removing.
  eventSprites.forEach(event => {
    if (event.getActionSpriteNeedsRemoving()) {
      this.removeEvent(event);
    }
  });
};

Game_Map.prototype.clearStaleLootDrops = function() {
  const eventSprites = this.events();

  // get all the game_event sprites that need removing.
  eventSprites.forEach(event => {
    if (event.getLootNeedsRemoving()) {
      this.removeEvent(event);
    }
  });
};
//#endregion

//#region Game_Party
/**
 * Extends the initialize to include additional objects for JABS.
 */
J.ABS.Aliased.Game_Party.initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
  J.ABS.Aliased.Game_Party.initialize.call(this);
  this.initJabsPartyData();
};

/**
 * Initializes the stuff related to tracking JABS party cycle capabilities.
 */
Game_Party.prototype.initJabsPartyData = function() {
  this._j = this._j || {};
  if (this._j._canPartyCycle === undefined) {
    this._j._canPartyCycle = true;
  }
};

/**
 * (re-)Enables the JABS party cycle functionality.
 */
Game_Party.prototype.enablePartyCycling = function() {
  this.initJabsPartyData();
  this._j._canPartyCycle = true;
};

/**
 * Disables the JABS party cycle functionality.
 */
Game_Party.prototype.disablePartyCycling = function() {
  this.initJabsPartyData();
  this._j._canPartyCycle = false;
};

/**
 * Gets whether or not the party can cycle between members.
 * @returns {boolean} True if party cycling is enabled, false otherwise.
 */
Game_Party.prototype.canPartyCycle = function() {
  if (this._j === undefined) {
    this.initJabsPartyData();
  }

  return this._j._canPartyCycle;
};
//#endregion Game_Party

//#region Game_Player
/**
 * The player may have different dash speed. 
 * That is determined in this function.
 * @returns {number} 
 */
Game_Player.prototype.dashSpeed = function() {
  return 0.5;
};

/**
 * OVERWRITE Changes the button detection to look for a different button instead of SHIFT.
 */
Game_Player.prototype.isDashButtonPressed = function() {
  const shift = Input.isPressed(J.ABS.Input.X);
  if (ConfigManager.alwaysDash) {
      return !shift;
  } else {
      return shift;
  }
};

/**
 * While JABS is enabled, don't try to interact with events if they are enemies.
 */
J.ABS.Aliased.Game_Player.startMapEvent = Game_Player.prototype.startMapEvent;
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
  if ($gameBattleMap.absEnabled) {
    if (!$gameMap.isEventRunning()) {
      for (const event of $gameMap.eventsXy(x, y)) {
        if (
          event.isTriggerIn(triggers) &&
          event.isNormalPriority() === normal &&
          !event.getMapBattler()
        ) {
          event.start();
        }
      }
    }
  } else {
    J.ABS.Aliased.Game_Player.startMapEvent.call(this, x, y, triggers, normal);
  }

};

/**
 * If the Abs menu is pulled up, the player shouldn't be able to move.
 */
J.ABS.Aliased.Game_Player.canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function() {
  if ($gameBattleMap.requestAbsMenu || $gameBattleMap.absPause) {
    return false;
  } else {
    return J.ABS.Aliased.Game_Player.canMove.call(this);
  }
};

J.ABS.Aliased.Game_Player.isDebugThrough = Game_Player.prototype.isDebugThrough;
Game_Player.prototype.isDebugThrough = function() {
  if ($gameBattleMap.absEnabled) {
    return Input.isPressed(J.ABS.Input.Cheat) && $gameTemp.isPlaytest();
  } else {
    return J.ABS.Aliased.Game_Player.isDebugThrough.call(this);
  }
};

/**
 * Initializes the player's `JABS_Battler` if it was not already initialized.
 */
J.ABS.Aliased.Game_Player.refresh = Game_Player.prototype.refresh;
Game_Player.prototype.refresh = function() {
  J.ABS.Aliased.Game_Player.refresh.call(this);
  $gameBattleMap.initializePlayerBattler();
};

/**
 * Hooks into the distance per frame algorithm and extends it for custom move speeds
 * based on equipment for the player.
 * @return {number} The modified distance per frame to move.
 */
J.ABS.Aliased.Game_Player.distancePerFrame = Game_Player.prototype.distancePerFrame;
Game_Player.prototype.distancePerFrame = function() {
  const base = J.ABS.Aliased.Game_Player.distancePerFrame.call(this);
  const bonus = this.calculateMovespeedMultiplier(base);
  return (base + bonus);
};

/**
 * Determines the bonus (or penalty) move speed for the player based on equipment.
 * @param {number} baseMoveSpeed The base distance per frame.
 */
Game_Player.prototype.calculateMovespeedMultiplier = function(baseMoveSpeed) {
  // if we don't have a player to work with, don't do this.
  const player = $gameBattleMap.getPlayerMapBattler();
  if (!player) return 0;

  const scale = player.getSpeedBoosts();
  if (scale === 0) return 0;

  const multiplier = (scale > 0)
    ? this.translatePositiveSpeedBoost(scale)
    : this.translateNegativeSpeedBoost(scale);

  const modifier = baseMoveSpeed * multiplier;
  return modifier;
};

/**
 * Translates a scale of positive points into bonus move speed multiplier.
 * @param {number} scale The scale of points to translate into bonus move speed.
 * @returns {number} The multiplier against the base move speed.
 */
Game_Player.prototype.translatePositiveSpeedBoost = function(scale) {
  let boost = 0.00000;

  // tier 1 boost = 10% per scale for 5 ranks (max +50%).
  if (scale > 5) {
    boost += 0.5;
    scale -= 5;
  } else {
    boost += (scale * 0.1);
    return boost;
  }

  // tier 2 boost = 5% per scale for 5 ranks (max +25%).
  if (scale > 5) {
    boost += 0.25;
    scale -= 5;
  } else {
    boost += (scale * 0.05);
    return boost;
  }

  // tier 3 boost = 2.5% per scale for all remaining ranks.
  boost += (scale * 0.025);
  return boost;
};

/**
 * Translates a scale of positive points into penalty move speed multiplier.
 * @param {number} scale The scale of points to translate into penalty move speed.
 * @returns {number} The multiplier against the base move speed.
 */
Game_Player.prototype.translateNegativeSpeedBoost = function(scale) {
  // normalize the scale because its easier that way.
  scale = Math.abs(scale);
  let boost = 0.00000;

  // tier 1 boost = 3% per scale for 5 ranks (max -15%).
  const t1scale = 0.03;
  if (scale > 5) {
    boost -= (t1scale * 5);
    scale -= 5;
  } else {
    boost -= (scale * t1scale);
    return boost;
  }

  // tier 2 boost = 2% per scale for 5 ranks (max -10%) again.
  const t2scale = 0.02;
  if (scale > 5) {
    boost -= (t2scale * 5);
    scale -= 5;
  } else {
    boost += (scale * t2scale);
    return boost;
  }

  // tier 3 boost = 1% per scale for all remaining ranks.
  const t3scale = 0.01;
  boost += (scale * t3scale);
  return boost;
};

/**
 * Checks whether or not the player is picking up loot drops.
 */
J.ABS.Aliased.Game_Player.updateMove = Game_Player.prototype.updateMove;
Game_Player.prototype.updateMove = function() {
  J.ABS.Aliased.Game_Player.updateMove.call(this);
  this.checkForLoot();
};

/**
 * Checks to see if the player coordinates are intercepting with any loot
 * currently on the ground.
 */
Game_Player.prototype.checkForLoot = function() {
  const lootDrops = $gameMap.getLootDrops();
  if (lootDrops.length) {
    lootDrops.forEach(lootDrop => {
      const isTouching = this.isTouchingLoot(lootDrop);
      if (isTouching) {
        this.pickupLoot(lootDrop);
        this.removeLoot(lootDrop);
      }
    });
  }
};

/**
 * Whether or not the player is "touching" the this loot drop.
 * @param {Game_Event} lootDrop The event representing the loot drop.
 * @returns {boolean}
 */
Game_Player.prototype.isTouchingLoot = function(lootDrop) {
  const isTouching = (lootDrop._x === this._x && lootDrop._y === this._y+1);
  return isTouching;
};

/**
 * Collects the loot drop off the ground.
 */
Game_Player.prototype.pickupLoot = function(lootEvent) {
  // extract the loot data.
  const lootMetadata = lootEvent.getLootData();
  const lootData = lootMetadata.lootData;
  lootMetadata.useOnPickup
    ? this.useOnPickup(lootData)
    : this.storeOnPickup(lootData);
};

/**
 * Uses the loot as soon as it is collected.
 * @param {object} lootData An object representing the loot.
 */
Game_Player.prototype.useOnPickup = function(lootData) {
  const player = $gameBattleMap.getPlayerMapBattler();
  player.applyToolEffects(lootData.id, true);
};

/**
 * Picks up the loot and stores it in the player's inventory.
 * @param {object} lootData An object representing the loot.
 */
Game_Player.prototype.storeOnPickup = function(lootData) {
  // add the loot to your inventory.
  $gameParty.gainItem(lootData, 1);
  SoundManager.playUseItem();

  // generate a log entry for the loot collected.
  $gameBattleMap.createLootLog(lootData);

  // generate a popup for the loot collected.
  const itemPop = $gameBattleMap.configureItemPop(lootData);
  this.addTextPop(itemPop);
  this.setRequestTextPop();
};

/**
 * Removes the loot drop event from the map.
 * @param {Game_Event} lootEvent The loot to remove from the map.
 */
Game_Player.prototype.removeLoot = function(lootEvent) {
  lootEvent.setLootNeedsRemoving(true);
  $gameBattleMap.requestClearLoot = true;
};
//#endregion

//#region Game_Unit
/**
 * OVERWRITE If Jabs is enabled, then you are always "in battle"!
 * Otherwise, it is dependent on the default method.
 */
J.ABS.Aliased.Game_Unit.inBattle = Game_Unit.prototype.inBattle;
Game_Unit.prototype.inBattle = function() {
  return $gameBattleMap.absEnabled
    ? true
    : J.ABS.Aliased.Game_Unit.inBattle.call(this);
}
//#endregion
//#endregion Core MZ Game Objects

//#region Scene objects
//#region Scene_Load
/**
 * OVERWRITE When loading, the map needs to be refreshed to load the enemies
 * properly.
 */
J.ABS.Aliased.Scene_Load.reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;
Scene_Load.prototype.reloadMapIfUpdated = function() {
  if ($gameBattleMap.absEnabled) {
    const mapId = $gameMap.mapId();
    const x = $gamePlayer.x;
    const y = $gamePlayer.y;
    $gamePlayer.reserveTransfer(mapId, x, y);
    $gamePlayer.requestMapReload();  
  } else {
    J.ABS.Aliased.Scene_Load.reloadMapIfUpdated.call(this);
  }
};
//#endregion Scene_Load

//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JABS objects for tracking.
 */
J.ABS.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
  J.ABS.Aliased.Scene_Map.initialize.call(this);
  this._j = this._j || {};
  this.initJabsMembers();
};

/**
 * Initializes the player's `JABS_Battler` if it was not already initialized.
 */
J.ABS.Aliased.Scene_Map.onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
  $gameBattleMap.initialize();
  $gameBattleMap.initializePlayerBattler();
  J.ABS.Aliased.Scene_Map.onMapLoaded.call(this);
};

/**
 * Initializes all JABS components.
 */
Scene_Map.prototype.initJabsMembers = function() {
  this.initJabsMenu();
};

/**
 * Initializes the JABS menu.
 */
Scene_Map.prototype.initJabsMenu = function() {
  this._j._absMenu = {};
  this._j._absMenu._windowFocus = null;
  this._j._absMenu._equipType = null;
  this._j._absMenu._mainWindow = null;
  this._j._absMenu._skillWindow = null;
  this._j._absMenu._toolWindow = null;
  this._j._absMenu._dodgeWindow = null;
  this._j._absMenu._equipSkillWindow = null;
  this._j._absMenu._equipToolWindow = null;
  this._j._absMenu._equipDodgeWindow = null;
};

/**
 * Create the Hud with all the rest of the windows.
 */
J.ABS.Aliased.Scene_Map.createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
  this.createJabsAbsMenu();
  J.ABS.Aliased.Scene_Map.createAllWindows.call(this);
};

/**
 * Update the `JABS_BattlerManager` while updating the regular scene map.
 */
J.ABS.Aliased.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  J.ABS.Aliased.Scene_Map.update.call(this);
  this.handleJabsWindowsVisibility();

  // if the ABS is disabled, then don't update it.
  if (!$gameBattleMap.absEnabled) return;

  // update the JABS engine!
  JABS_AiManager.update();

  // handle the JABS menu.
  if ($gameBattleMap.requestAbsMenu) {
    this.manageAbsMenu();
  } else {
    this.hideAllJabsWindows();
  }

  // handle rotation.
  if ($gameBattleMap.requestPartyRotation) {
    this.handlePartyRotation();
  }

  // handle requests for refreshing the JABS quick menu.
  if ($gameBattleMap.requestJabsMenuRefresh) {
    this.refreshJabsMenu();
  }
};

/**
 * Manages the party rotation.
 */
Scene_Map.prototype.handlePartyRotation = function() {
  $gameBattleMap.requestPartyRotation = false;
  this.refreshHud();
};

/**
 * Manages visibility for all extraneous windows that are used by JABS.
 */
Scene_Map.prototype.handleJabsWindowsVisibility = function() {
  if ($gameBattleMap.absEnabled && !$gameMessage.isBusy()) {
    this.toggleHud(true);
    this.toggleLog(true);
    this.toggleKeys(true);
  } else {
    this.toggleHud(false);
    this.toggleLog(false);
    this.toggleKeys(false);
  }
};

/**
 * Hides all windows of the JABS menu.
 */
Scene_Map.prototype.hideAllJabsWindows = function() {
  this._j._absMenu._mainWindow.hide();
  this._j._absMenu._skillWindow.hide();
  this._j._absMenu._equipSkillWindow.hide();
  this._j._absMenu._toolWindow.hide();
  this._j._absMenu._equipToolWindow.hide();
  this._j._absMenu._dodgeWindow.hide();
  this._j._absMenu._equipDodgeWindow.hide();
};

//#region JABS Menu
/**
 * OVERWRITE Disable the primary menu from being called.
 */
Scene_Map.prototype.callMenu = function() {
  return;
}

/**
 * Creates the Jabs quick menu for use.
 */
Scene_Map.prototype.createJabsAbsMenu = function() {
  // the main window that forks into the other three.
  this.createJabsAbsMenuMainWindow();

  // the three main windows of the ABS menu.
  this.createJabsAbsMenuSkillListWindow();
  this.createJabsAbsMenuToolListWindow();
  this.createJabsAbsMenuDodgeListWindow();
  
  // the assignment of the the windows.
  this.createJabsAbsMenuEquipSkillWindow();
  this.createJabsAbsMenuEquipToolWindow();
  this.createJabsAbsMenuEquipDodgeWindow();
};

Scene_Map.prototype.setupJabsAbsMenuMainWindow = function() {
  this.createJabsAbsMenuMainWindow();
};

/**
 * Creates the first/main window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuMainWindow = function() {
  const w = 400;
  const h = 250;
  const x = Graphics.boxWidth - w;
  const y = 100;
  const rect = new Rectangle(x, y, w, h);
  const mainMenu = new Window_AbsMenu(rect);
  mainMenu.setHandler("skill-assign", this.commandSkill.bind(this));
  mainMenu.setHandler("dodge-assign", this.commandDodge.bind(this));
  mainMenu.setHandler("item-assign", this.commandItem.bind(this));
  mainMenu.setHandler("main-menu", this.commandMenu.bind(this));
  mainMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "main"));
  this._j._absMenu._mainWindow = mainMenu;
  this._j._absMenu._mainWindow.close();
  this._j._absMenu._mainWindow.hide();
  this.addWindow(this._j._absMenu._mainWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuSkillListWindow = function() {
  const w = 400;
  const h = 300;
  const x = Graphics.boxWidth - (w);
  const y = 100;
  const rect = new Rectangle(x, y, w, h);
  const skillMenu = new Window_AbsMenuSelect(rect, "skill");
  skillMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "skill"));
  skillMenu.setHandler("skill", this.commandEquipSkill.bind(this));
  this._j._absMenu._skillWindow = skillMenu;
  this._j._absMenu._skillWindow.close();
  this._j._absMenu._skillWindow.hide();
  this.addWindow(this._j._absMenu._skillWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipSkillWindow = function() {
  const w = 400;
  const h = 380;
  const x = Graphics.boxWidth - (w);
  const y = 100;
  const rect = new Rectangle(x, y, w, h);
  const assignMenu = new Window_AbsMenuSelect(rect, "equip-skill");
  assignMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "assign"));
  assignMenu.setHandler("slot", this.commandAssign.bind(this));
  this._j._absMenu._equipSkillWindow = assignMenu;
  this._j._absMenu._equipSkillWindow.close();
  this._j._absMenu._equipSkillWindow.hide();
  this.addWindow(this._j._absMenu._equipSkillWindow);
};

/**
 * Creates the item assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuToolListWindow = function() {
  const w = 400;
  const h = 300;
  const x = Graphics.boxWidth - w;
  const y = 100;
  const rect = new Rectangle(x, y, w, h);
  const itemMenu = new Window_AbsMenuSelect(rect, "tool");
  itemMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "tool"));
  itemMenu.setHandler("tool", this.commandEquipTool.bind(this));
  this._j._absMenu._toolWindow = itemMenu;
  this._j._absMenu._toolWindow.close();
  this._j._absMenu._toolWindow.hide();
  this.addWindow(this._j._absMenu._toolWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipToolWindow = function() {
  const w = 400;
  const h = 70;
  const x = Graphics.boxWidth - (w);
  const y = 100;
  const rect = new Rectangle(x, y, w, h);
  const assignMenu = new Window_AbsMenuSelect(rect, "equip-tool");
  assignMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "assign"));
  assignMenu.setHandler("slot", this.commandAssign.bind(this));
  this._j._absMenu._equipToolWindow = assignMenu;
  this._j._absMenu._equipToolWindow.close();
  this._j._absMenu._equipToolWindow.hide();
  this.addWindow(this._j._absMenu._equipToolWindow);
};

/**
 * Creates the dodge assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuDodgeListWindow = function() {
  const w = 400;
  const h = 300;
  const x = Graphics.boxWidth - w;
  const y = 100;
  const rect = new Rectangle(x, y, w, h);
  const dodgeMenu = new Window_AbsMenuSelect(rect, "dodge");
  dodgeMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "dodge"));
  dodgeMenu.setHandler("dodge", this.commandEquipDodge.bind(this));
  this._j._absMenu._dodgeWindow = dodgeMenu;
  this._j._absMenu._dodgeWindow.close();
  this._j._absMenu._dodgeWindow.hide();
  this.addWindow(this._j._absMenu._dodgeWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipDodgeWindow = function() {
  const w = 400;
  const h = 70;
  const x = Graphics.boxWidth - (w);
  const y = 100;
  const rect = new Rectangle(x, y, w, h);
  const assignMenu = new Window_AbsMenuSelect(rect, "equip-dodge");
  assignMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "assign"));
  assignMenu.setHandler("slot", this.commandAssign.bind(this));
  this._j._absMenu._equipDodgeWindow = assignMenu;
  this._j._absMenu._equipDodgeWindow.close();
  this._j._absMenu._equipDodgeWindow.hide();
  this.addWindow(this._j._absMenu._equipDodgeWindow);
};

/**
 * Manages the ABS main menu's interactivity.
 */
Scene_Map.prototype.manageAbsMenu = function() {
  switch (this._j._absMenu._windowFocus) {
    case "main":
      this._j._absMenu._mainWindow.show();
      this._j._absMenu._mainWindow.open();
      this._j._absMenu._mainWindow.activate();
      break;
    case "skill":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._skillWindow.show();
      this._j._absMenu._skillWindow.open();
      this._j._absMenu._skillWindow.activate();
      break;
    case "tool":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._toolWindow.show();
      this._j._absMenu._toolWindow.open();
      this._j._absMenu._toolWindow.activate();
      break;
    case "dodge":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._dodgeWindow.show();
      this._j._absMenu._dodgeWindow.open();
      this._j._absMenu._dodgeWindow.activate();
      break;
    case null:
      this._j._absMenu._windowFocus = "main";
      break;
  }
};

/**
 * When the "assign skills" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandSkill = function() {
  this._j._absMenu._windowFocus = "skill";
  this._j._absMenu._skillWindow.refresh();
  this._j._absMenu._skillWindow.show();
  this._j._absMenu._skillWindow.open();
  this._j._absMenu._skillWindow.activate();
  this._j._absMenu._equipType = "skill";
  return;
};

/**
 * When the "assign items" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandItem = function() {
  this._j._absMenu._windowFocus = "tool";
  this._j._absMenu._toolWindow.refresh();
  this._j._absMenu._toolWindow.show();
  this._j._absMenu._toolWindow.open();
  this._j._absMenu._toolWindow.activate();
  this._j._absMenu._equipType = "tool";
  return;
};

/**
 * When the "assign dodge" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandDodge = function() {
  this._j._absMenu._windowFocus = "dodge";
  this._j._absMenu._dodgeWindow.refresh();
  this._j._absMenu._dodgeWindow.show();
  this._j._absMenu._dodgeWindow.open();
  this._j._absMenu._dodgeWindow.activate();
  this._j._absMenu._equipType = "dodge";
  return;
};

/**
 * Brings up the main menu.
 */
Scene_Map.prototype.commandMenu = function() {
  SceneManager.push(Scene_Menu);
  return;
};

Scene_Map.prototype.refreshJabsMenu = function() {
  $gameBattleMap.requestJabsMenuRefresh = false;
  this._j._absMenu._mainWindow.refresh();
};

/**
 * When a decision is made in skill assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipSkill = function() {
  this._j._absMenu._windowFocus = "assign";
  this._j._absMenu._skillWindow.close();
  this._j._absMenu._skillWindow.deactivate();
  this._j._absMenu._equipSkillWindow.refresh();
  this._j._absMenu._equipSkillWindow.show();
  this._j._absMenu._equipSkillWindow.open();
  this._j._absMenu._equipSkillWindow.activate();
  return;
};

/**
 * When a decision is made in tool assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipTool = function() {
  this._j._absMenu._windowFocus = "assign";
  this._j._absMenu._toolWindow.close();
  this._j._absMenu._toolWindow.deactivate();
  this._j._absMenu._equipToolWindow.refresh();
  this._j._absMenu._equipToolWindow.show();
  this._j._absMenu._equipToolWindow.open();
  this._j._absMenu._equipToolWindow.activate();
  return;
};

/**
 * When a decision is made in tool assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipDodge = function() {
  this._j._absMenu._windowFocus = "assign";
  this._j._absMenu._dodgeWindow.close();
  this._j._absMenu._dodgeWindow.deactivate();
  this._j._absMenu._equipDodgeWindow.refresh();
  this._j._absMenu._equipDodgeWindow.show();
  this._j._absMenu._equipDodgeWindow.open();
  this._j._absMenu._equipDodgeWindow.activate();
  return;
};

/**
 * When assigning a slot, determine the last opened window and use that.
 */
Scene_Map.prototype.commandAssign = function() {
  const actor = $gameParty.leader();
  let nextActionSkill = 0
  let equippedActionSlot = 0;
  switch (this._j._absMenu._equipType) {
    case "skill":
      equippedActionSlot = this._j._absMenu._equipSkillWindow.currentExt();
      nextActionSkill = this._j._absMenu._skillWindow.currentExt();
      break;
    case "tool":
      equippedActionSlot = this._j._absMenu._equipToolWindow.currentExt();
      nextActionSkill = this._j._absMenu._toolWindow.currentExt();
      break;
    case "dodge":
      equippedActionSlot = this._j._absMenu._equipDodgeWindow.currentExt();
      nextActionSkill = this._j._absMenu._dodgeWindow.currentExt();
      break;
    default:
      break;
  }

  actor.setEquippedSkill(equippedActionSlot, nextActionSkill);
  if (J.ActionKeys.Metadata.Enabled) {
    this._j._actionKeys.refresh();
  }

  this.closeAbsWindow("assign");
};

/**
 * Closes a given Abs menu window.
 * @param {string} absWindow The type of abs window being closed.
 */
Scene_Map.prototype.closeAbsWindow = function(absWindow) {
  switch (absWindow) {
    case "main":
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._mainWindow.close();
      this.closeAbsMenu();
      break;
    case "skill":
      this._j._absMenu._skillWindow.deactivate();
      this._j._absMenu._skillWindow.close();
      this._j._absMenu._windowFocus = "main";
      break;
    case "tool":
      this._j._absMenu._toolWindow.deactivate();
      this._j._absMenu._toolWindow.close();
      this._j._absMenu._windowFocus = "main";
      break;
    case "dodge":
      this._j._absMenu._dodgeWindow.deactivate();
      this._j._absMenu._dodgeWindow.close();
      this._j._absMenu._windowFocus = "main";
      break;
    case "assign":
      this._j._absMenu._equipSkillWindow.deactivate();
      this._j._absMenu._equipSkillWindow.close();
      this._j._absMenu._equipToolWindow.deactivate();
      this._j._absMenu._equipToolWindow.close();
      this._j._absMenu._equipDodgeWindow.deactivate();
      this._j._absMenu._equipDodgeWindow.close();
      this._j._absMenu._skillWindow.deactivate();
      this._j._absMenu._skillWindow.close();
      this._j._absMenu._toolWindow.deactivate();
      this._j._absMenu._toolWindow.close();
      this._j._absMenu._dodgeWindow.deactivate();
      this._j._absMenu._dodgeWindow.close();
      this._j._absMenu._mainWindow.activate();
      this._j._absMenu._mainWindow.open();      
      this._j._absMenu._mainWindow.show();      
      this._j._absMenu._windowFocus = "main"
      break;
  }
};

/**
 * Close out from the Abs menu.
 */
Scene_Map.prototype.closeAbsMenu = function() {
  this._j._absMenu._mainWindow.closeMenu();
  return;
};
//#endregion JABS Menu
//#endregion
//#endregion Scene objects

//#region Sprite objects
//#region Spriteset_Map
/**
 * Hooks into the `update` function to also update any active action sprites.
 */
J.ABS.Aliased.Spriteset_Map.spritesetUpdate = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
  J.ABS.Aliased.Spriteset_Map.spritesetUpdate.call(this);
  this.updateJabsSprites();
};

/**
 * Updates all existing actionSprites on the map.
 */
Spriteset_Map.prototype.updateJabsSprites = function() {
  if ($gameBattleMap.requestActionRendering) {
    this.addActionSprites();
  }

  if ($gameBattleMap.requestLootRendering) {
    this.addLootSprites();
  }

  if ($gameBattleMap.requestClearMap) {
    this.removeActionSprites();
  }

  if ($gameBattleMap.requestClearLoot) {
    this.removeLootSprites();
  }

  if ($gameBattleMap.requestSpriteRefresh) {
    console.log("request received!");
    this.refreshAllCharacterSprites();
  }
};

/**
 * Adds all needing-to-be-added action sprites to the map and renders.
 */
Spriteset_Map.prototype.addActionSprites = function() {
  $gameBattleMap.requestActionRendering = false;
  const events = $gameMap.events();
  events.forEach(event => {
    const shouldAddActionSprite = event.getActionSpriteNeedsAdding();
    if (shouldAddActionSprite) {
      event.setActionSpriteNeedsAdding(false);
      const actionSprite = event.getMapActionData().getActionSprite();
      const sprite = new Sprite_Character(actionSprite);
      this._characterSprites.push(sprite);
      this._tilemap.addChild(sprite);
    }
  }, this);
};

/**
 * Adds all needing-to-be-added loot sprites to the map and renders.
 */
Spriteset_Map.prototype.addLootSprites = function() {
  $gameBattleMap.requestLootRendering = false;
  const events = $gameMap.events();
  events.forEach(event => {
    const shouldAddLootSprite = event.getLootNeedsAdding();
    if (shouldAddLootSprite) {
      event.setLootNeedsAdding(false);
      const sprite = new Sprite_Character(event);
      this._characterSprites.push(sprite);
      this._tilemap.addChild(sprite);
    }
  }, this);
};

/**
 * Removes all needing-to-be-removed action sprites from the map.
 */
Spriteset_Map.prototype.removeActionSprites = function() {
  const events = $gameMap.events();
  events.forEach(event => {
    // if they aren't an action, this function doesn't care.
    const isAction = event.isAction();
    if (!isAction) return;

    const actionEvent = event.getMapActionData();
    const shouldRemoveActionEvent = !!actionEvent && actionEvent.getNeedsRemoval()
    if (shouldRemoveActionEvent) {
      event.setActionSpriteNeedsRemoving();
      this._characterSprites.forEach((sprite, index) => {
        const actionSprite = sprite._character;
        const needsRemoval = actionSprite.getActionSpriteNeedsRemoving();
        if (needsRemoval) {
          this._characterSprites.splice(index, 1);
          actionSprite.erase();
          return;
        }
      });
      $gameMap.clearStaleMapActions();
    }
  });

  $gameBattleMap.requestClearMap = false;
};

/**
 * Removes all needing-to-be-removed loot sprites from the map.
 */
Spriteset_Map.prototype.removeLootSprites = function() {
  const events = $gameMap.events();
  events.forEach(event => {
    // if they aren't loot, this function doesn't care.
    const isLoot = event.isLoot();
    if (!isLoot) return;

    const shouldRemoveLoot = event.getLootNeedsRemoving();
    if (shouldRemoveLoot) {
      this._characterSprites.forEach((sprite, index) => {
        const lootSprite = sprite._character;
        const needsRemoval = lootSprite.getLootNeedsRemoving();
        if (needsRemoval) {
          sprite.deleteLootSprite();
          this._characterSprites.splice(index, 1);
          lootSprite.erase();
          return;
        }
      });

      $gameMap.clearStaleLootDrops();
    }
  });

  $gameBattleMap.requestClearLoot = false;
};

Spriteset_Map.prototype.refreshAllCharacterSprites = function() {
  this._characterSprites.forEach(sprite => {
    if (sprite.isJabsBattler()) {
      sprite.setupDangerIndicator();
    }
  });

  $gameBattleMap.requestSpriteRefresh = false;
};
//#endregion

//#region Sprite_Character
/**
 * Hooks into `Sprite_Character.initMembers` and adds our initiation for damage sprites.
 */
J.ABS.Aliased.Sprite_Character.initMembers = Sprite_Character.prototype.initMembers;
Sprite_Character.prototype.initMembers = function() {
  this._damages = [];
  this._nonDamages = [];
  this._stateOverlaySprite = null;
  this._hpGauge = null;
  this._dangerIndicator = null;
  this._battlerName = null;
  this._loot = {};
  this._loot._img = null;
  this._loot._swing = false;
  this._loot._ox = 0;
  this._loot._oy = 0;
  J.ABS.Aliased.Sprite_Character.initMembers.call(this);
};

/**
 * If the "character" is actually a loot drop, don't identify it as empty for the purposes
 * of drawing the loot icon on the map.
 * @returns {boolean} True if the character should be drawn, false otherwise.
 */
J.ABS.Aliased.Sprite_Character.isEmptyCharacter = Sprite_Character.prototype.isEmptyCharacter;
Sprite_Character.prototype.isEmptyCharacter = function() {
  if (this.isLoot()) {
    return false;
  } else {
    return J.ABS.Aliased.Sprite_Character.isEmptyCharacter.call(this);
  }
};

/**
 * Hooks into the `Sprite_Character.setCharacter` and sets up the battler sprite.
 */
J.ABS.Aliased.Sprite_Character.setCharacter = Sprite_Character.prototype.setCharacter;
Sprite_Character.prototype.setCharacter = function(character) {
  J.ABS.Aliased.Sprite_Character.setCharacter.call(this, character);
  // if this is a battler, configure the visual components of the battler.
  if (this._character.hasJabsBattler()) {
    this.setupMapSprite();
  }

  if (this.isLoot()) {
    this.setupLootSprite();
  }
};

/**
 * If this is loot, then treat it as loot instead of a regular character.
 */
J.ABS.Aliased.Sprite_Character.setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {
	if (this.isLoot()) {
    if (!this.children.length) {
      this.setupLootSprite();
    }
    
		return;
  };
  
	J.ABS.Aliased.Sprite_Character.setCharacterBitmap.call(this);
};

/**
 * If this is loot, then treat it as loot instead of a tilemap.
 */
J.ABS.Aliased.Sprite_Character.setTileBitmap = Sprite_Character.prototype.setTileBitmap;
Sprite_Character.prototype.setTileBitmap = function() {
	if (this.isLoot()) {
    if (!this.children.length) {
      this.setupLootSprite();
    }

		return;
  };
  
  J.ABS.Aliased.Sprite_Character.setTileBitmap.call(this);
};

/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupMapSprite = function() {
  this.setupStateOverlay();
  this.setupHpGauge();
  this.setupDangerIndicator();
  this.setupBattlerName();
};

/**
 * Sets up this character's state overlay, to show things like poison or paralysis.
 */
Sprite_Character.prototype.setupStateOverlay = function() {
  const battler = this.getBattler();
  this._stateOverlaySprite = this.createStateOverlaySprite();
  if (battler) {
    this._stateOverlaySprite.setup(battler);
  }

  this.addChild(this._stateOverlaySprite);
};

/**
 * Creates the sprite representing the overlay of the state on the field.
 * @returns {Sprite_StateOverlay} The state overlay for this character.
 */
Sprite_Character.prototype.createStateOverlaySprite = function() {
  const sprite = new Sprite_StateOverlay();
  return sprite;
};

/**
 * Sets up this character's hp gauge, to show the hp bar as-needed.
 */
Sprite_Character.prototype.setupHpGauge = function() {
  const battler = this.getBattler();
  this._hpGauge = this.createGenericSpriteGauge();
  if (battler) {
    this._hpGauge.setup(battler, "hp");
  }

  this.addChild(this._hpGauge);
};

/**
 * Creates an on-the-map HP gauge for this battler.
 */
 Sprite_Character.prototype.createGenericSpriteGauge = function() {
  const sprite = new Sprite_MapGauge();
  const x = this.x - (sprite.width / 1.5);
  const y = this.y - 12;
  sprite.move(x, y);
  return sprite;
};

//#region danger indicator icon
/**
 * Sets up the danger indicator sprite for this battler.
 */
Sprite_Character.prototype.setupDangerIndicator = function() {
  this._dangerIndicator = this.createDangerIndicatorSprite();
  this.addChild(this._dangerIndicator);
};

/**
 * Creates the danger indicator sprite for this battler.
 * @returns {Sprite_Icon} The icon representing this danger indicator.
 */
Sprite_Character.prototype.createDangerIndicatorSprite = function() {
  const dangerIndicatorIcon = this.getDangerIndicatorIcon();
  const sprite = new Sprite_Icon(dangerIndicatorIcon);
  sprite.scale.x = 0.5;
  sprite.scale.y = 0.5;
  sprite.move(-50, 8);
  return sprite;
};

/**
 * Determines the iconIndex that indicates the danger level relative to the player and enemy.
 * @returns The icon index of the danger indicator icon.
 */
Sprite_Character.prototype.getDangerIndicatorIcon = function() {
  // if we aren't using them, don't give an icon.
  if (!J.ABS.Metadata.UseDangerIndicatorIcons) return -1;

  // if a battler isn't on this sprite, then don't do it.
  const battler = this.getBattler();
  if (!battler) return -1;

  // calculate the level difference.
  const player = $gameBattleMap.getPlayerMapBattler().getBattler();
  const diff = Math.abs(battler.level - player.level);
  const isPlayerBigger = player.level > battler.level;

  // player or enemy, same icon.
  if (diff <= 2) { // 0-2
    return J.ABS.DangerIndicatorIcons.Average;
  // the player is bigger, so set the icons to be nicer (blue-er).
  } else if (isPlayerBigger) {
    switch (true) {
      case (diff > 2 && diff <= 4): // 3-4
        return J.ABS.DangerIndicatorIcons.Easy;
      case (diff > 4 && diff <= 6): // 5-6
        return J.ABS.DangerIndicatorIcons.Simple;
      case (diff > 6): // 7+
        return J.ABS.DangerIndicatorIcons.Worthless;
    }
  // the enemy is bigger, so set the icons to be scarier (red-der).
  } else {
    switch (true) {
      case (diff > 2 && diff <= 4): // 3-4
        return J.ABS.DangerIndicatorIcons.Hard;
      case (diff > 4 && diff <= 6): // 5-6
        return J.ABS.DangerIndicatorIcons.Grueling;
      case (diff > 6): // 7+
        return J.ABS.DangerIndicatorIcons.Deadly;
    }
  }
};
//#endregion danger indicator icon

//#region battler name
/**
 * Sets up this battler's name as a sprite below the character.
 */
Sprite_Character.prototype.setupBattlerName = function() {
  this._battlerName = this.createBattlerNameSprite();
  this.addChild(this._battlerName);
};

/**
 * Creates the sprite that contains this battler's name.
 * @returns {Sprite_Text} The battlers name, as a sprite.
 */
 Sprite_Character.prototype.createBattlerNameSprite = function() {
  const battlerName = this.getBattlerName();
  const sprite = new Sprite_Text(battlerName, null, -12, "left");
  sprite.move(-30, 8);
  return sprite;
};

/**
 * 
 * @returns {string} The battlers name.
 */
Sprite_Character.prototype.getBattlerName = function() {
  const battler = this.getBattler();
  if (!battler) return "";

  return battler.opponentsUnit() === $gameParty
    ? battler.enemy().name
    : battler.actor().name;
};
//#endregion battler name

//#region loot
/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupLootSprite = function() {
  if (this._loot._img) return;

  this._character._through = true;
  this._loot._img = this.createLootSprite();
  this.addChild(this._loot._img);
};

/**
 * Creates the loot sprite based on the loot the enemy drop.
 */
Sprite_Character.prototype.createLootSprite = function() {
  const lootData = this.getLootData();
  const iconIndex = lootData.lootIcon;
  const lootSprite = new Sprite_Icon(iconIndex);
  const xOffset = J.Base.Helpers.getRandomNumber(-30, 0);
  const yOffset = J.Base.Helpers.getRandomNumber(-90, -70);
  lootSprite.move(xOffset, yOffset);
  return lootSprite;
};

/**
 * Deletes a loot sprite from the screen.
 */
Sprite_Character.prototype.deleteLootSprite = function() {
  if (this.children.length > 0) {
    this.children.splice(0, this.children.length);
  }
};

/**
 * Gets whether or not this sprite is actually just some loot to be gathered.
 * @returns {boolean} True if this sprite represents a loot object, false otherwise.
 */
 Sprite_Character.prototype.isLoot = function() {
  return this._character.isLoot();
};

/**
 * Gets the loot data associated with this sprite.
 * @returns {JABS_LootDrop}
 */
Sprite_Character.prototype.getLootData = function() {
  return this._character.getLootData();
};
//#endregion loot

/**
 * Returns the `Game_Battler` associated with the current sprite.
 * @returns {Game_Battler} The battler this sprite is bound to.
 */
Sprite_Character.prototype.getBattler = function() {
  if (!this._character || 
    this._character instanceof Game_Vehicle || 
    this._character instanceof Game_Follower) {
      return null;
  } else {
    if (this._character.hasJabsBattler()) {
      const battler = this._character.getMapBattler().getBattler();
      return battler;
    } else {
      return null;
    }
  }
};

/**
 * Gets whether or not this sprite belongs to a battler.
 * @returns {boolean} True if this sprite belongs to a battler, false otherwise.
 */
Sprite_Character.prototype.isJabsBattler = function() {
  return !!this._character.hasJabsBattler();
};

/**
 * Hooks into the `Sprite_Character.update` and adds our ABS updates.
 */
J.ABS.Aliased.Sprite_Character.update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
	J.ABS.Aliased.Sprite_Character.update.call(this);
	if (this.bitmap) {
    if (this.getBattler()) {
      this.updateStateOverlay();
      this.updateMapPopups();
      this.updateGauges();
      this.updateDangerIndicator();
      this.updateBattlerName();
    } else {
      // if the conditions changed for an event that used to have an hp gauge
      // now hide the gauge.
      if (this._hpGauge) {
        this.hideHpGauge();
      }
    }
  }
};

/**
 * Updates the all gauges associated with this battler
 */
Sprite_Character.prototype.updateGauges = function() {
  const mapBattler = this._character.getMapBattler();
  if (mapBattler) {
    if (this.canUpdate() && mapBattler.showHpBar()) {
      if (!this._hpGauge) {
        this.setupMapSprite();
        this._hpGauge.move(0 - (this._hpGauge.width / 1.5), 0 - 12);
      }
      this._hpGauge._battler = this.getBattler();
      this._hpGauge.update();
      this.showHpGauge();
    } else {
      this.hideHpGauge();
    }
  }
};

/**
 * Updates the danger indicator associated with this battler
 */
 Sprite_Character.prototype.updateDangerIndicator = function() {
  const mapBattler = this._character.getMapBattler();
  if (mapBattler) {
    if (this.canUpdate() && mapBattler.showDangerIndicator()) {
      if (!this._dangerIndicator) {
        this.setupMapSprite();
      }

      this.showDangerIndicator();
    } else {
      this.hideDangerIndicator();
    }
  }
};

/**
 * Updates this battler's name.
 */
 Sprite_Character.prototype.updateBattlerName = function() {
  const mapBattler = this._character.getMapBattler();
  if (mapBattler) {
    if (this.canUpdate() && mapBattler.showBattlerName()) {
      if (!this._battlerName) {
        this.setupMapSprite();
      }

      this.showBattlerName();
    } else {
      this.hideBattlerName();
    }
  }
};

/**
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
 Sprite_Character.prototype.canUpdate = function() {
  if (!$gameBattleMap.absEnabled) {
    return false;
  }

  return true;
};

/**
 * Shows the hp gauge if it exists.
 */
Sprite_Character.prototype.showHpGauge = function() {
  if (this._hpGauge) {
    this._hpGauge.opacity = 255;
  }
};

/**
 * Hides the hp gauge if it exists.
 */
Sprite_Character.prototype.hideHpGauge = function() {
  if (this._hpGauge) {
    this._hpGauge.opacity = 0;
  }
};

/**
 * Shows the danger indicator if it exists.
 */
Sprite_Character.prototype.showDangerIndicator = function() {
  if (this._dangerIndicator) {
    this._dangerIndicator.opacity = 255;
  }
};

/**
 * Hides the danger indicator if it exists.
 */
Sprite_Character.prototype.hideDangerIndicator = function() {
  if (this._dangerIndicator) {
    this._dangerIndicator.opacity = 0;
  }
};

/**
 * Shows the battler's name if it exists.
 */
 Sprite_Character.prototype.showBattlerName = function() {
  if (this._battlerName) {
    this._battlerName.opacity = 255;
  }
};

/**
 * Hides the battler's name if it exists.
 */
 Sprite_Character.prototype.hideBattlerName = function() {
  if (this._battlerName) {
    this._battlerName.opacity = 0;
  }
};

/**
 * Intercepts the update frame for loot and performs the things we need to
 * make the loot look like its floating in-place.
 */
J.ABS.Aliased.Sprite_Character.updateFrame = Sprite_Character.prototype.updateFrame;
Sprite_Character.prototype.updateFrame = function() {
	if (this.isLoot()) {
    this.updateLootFloat();
    return;
  }
  
	J.ABS.Aliased.Sprite_Character.updateFrame.call(this);
};

/**
 * Updates the loot to give the effect that it is floating in place.
 */
Sprite_Character.prototype.updateLootFloat = function() {
  const lootData = this.getLootData();
  lootData.countdownDuration();
  // TODO: implement expiring loot.
  //console.log(lootData.expired); // works!
  const { _img: lootSprite, _swing: swingDown } = this._loot;

  swingDown
    ? this.lootFloatDown(lootSprite)
    : this.lootFloatUp(lootSprite);
};

/**
 * The downswing of a loot sprite while floating.
 * @param {Sprite} lootSprite The sprite to give a float effect.
 */
Sprite_Character.prototype.lootFloatDown = function(lootSprite) {
  this._loot._oy += 0.3;
  lootSprite.y += 0.3;
  if (this._loot._oy > 5) this._loot._swing = false;
};

/**
 * The upswing of a loot sprite while floating.
 * @param {Sprite} lootSprite The sprite give a float effect.
 */
Sprite_Character.prototype.lootFloatUp = function(lootSprite) {
  this._loot._oy -= 0.3;
  lootSprite.y -= 0.3;
  if (this._loot._oy < -5) this._loot._swing = true;
};

/**
 * Updates the battler's overlay for states (if applicable).
 */
Sprite_Character.prototype.updateStateOverlay = function() {
  this._stateOverlaySprite.update();
};

/**
 * If one doesn't already exist, creates a blank state icon for the character.
 */
Sprite_Character.prototype.createStateIconSprite = function() {
  this._stateIconSprite = new Sprite_StateIcon();
  this._stateIconSprite.setup(this.getBattler());
  this.addChild(this._stateIconSprite);
};

/**
 * Updates the state sprite for this character.
 */
Sprite_Character.prototype.updateStateSprite = function() {
  if (this.getBattler()) {
    this._stateIconSprite.y = -this.getBattler().iconStateY;
  } else {
	  var ph = this._isBigCharacter ? 4 : 8; 
    this._stateIconSprite.y = -Math.floor(this.bitmap.height / ph) - 24;
	};
};

/**
 * Updates the sprites for all current damage popups.
 */
Sprite_Character.prototype.updateMapPopups = function() {
  this.buildPopupsIfAny();
  this.updateDamagePopups();
  this.updateNonDamagePopups();
  this._character.setRequestTextPop(false);
};

/**
 * Updates all damage popup sprites on this character.
 */
Sprite_Character.prototype.updateDamagePopups = function() {
  if (this._damages.length > 0) {
    this._damages.forEach(damage => {
      damage.update();
      damage.x = this.x + 150 + damage._xVariance;
      damage.y = this.y + damage._yVariance;
    })

    if (!this._damages[0].isPlaying()) {
      this.parent.removeChild(this._damages[0]);
      this._damages[0].destroy();
      this._damages.shift();
    }
  }
};

/**
 * Updates all non-damage popup sprites on this character.
 */
Sprite_Character.prototype.updateNonDamagePopups = function() {
  if (this._nonDamages.length > 0) {
    this._nonDamages.forEach(nonDamage => {
      nonDamage.update();
      nonDamage.x = this.x + 150 + nonDamage._xVariance;
      nonDamage.y = this.y + nonDamage._yVariance;
    })

    if (!this._nonDamages[0].isPlaying()) {
      this.parent.removeChild(this._nonDamages[0]);
      this._nonDamages[0].destroy();
      this._nonDamages.shift();
    }
  }
};

/**
 * Constructs a damage popup if one is requested.
 */
Sprite_Character.prototype.buildPopupsIfAny = function() {
  if (this._character.getRequestTextPop()) {
    do {
      const popup = this._character.getDamagePops().shift();
      const sprite = this.configurePopup(popup);
      sprite._isDamage 
        ? this._damages.push(sprite)
        : this._nonDamages.push(sprite);
      this.parent.addChild(sprite);
    } while (this._character.getDamagePops().length);
  }
};

/**
 * Configures a text popup based on it's type.
 * @param {JABS_TextPop} popup The popup details.
 * @returns {Sprite_Damage} The completely configured sprite of the popup.
 */
Sprite_Character.prototype.configurePopup = function(popup) {
  const getRandomNumber = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min))
  }

  let sprite = new Sprite_Damage();

  if (popup.getIcon() > 0) {
    sprite.addIcon(popup.getIcon());
  }

  switch (popup.getType()) {
    case "damage":
      sprite._xVariance = getRandomNumber(-30, 30);
      sprite._yVariance = getRandomNumber(-30, 30);
      this.buildDamagePopSprite(sprite, popup);
      break;
    case "exp":
      sprite._xVariance = -40;
      sprite._yVariance = 20;
      sprite._duration += 180;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case "gold":
      sprite._xVariance = -40;
      sprite._yVariance = 40;
      sprite._duration += 180;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case "sdp":
      sprite._xVariance = -40;
      sprite._yVariance = 60;
      sprite._duration += 180;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case "item":
      sprite._xVariance = 60;
      sprite._yVariance = getRandomNumber(-30, 30);
      sprite._duration += 60;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case "levelup":
      sprite._xVariance = 0;
      sprite._yVariance = getRandomNumber(-30, 30);
      sprite._duration += 120;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case "skillLearn":
      sprite._xVariance = 0;
      sprite._yVariance = getRandomNumber(-30, 30);
      sprite._duration += 210;
      this.buildBasicPopSprite(sprite, popup);
      break;
  }

  return sprite;
};

/**
 * Configures the values for this damage popup.
 * @param {Sprite_Damage} sprite The sprite to configure for this damage pop.
 * @param {JABS_TextPop} popup The popup details.
 */
Sprite_Character.prototype.buildDamagePopSprite = function(sprite, popup) {
  sprite._isDamage = true;
  sprite._duration = 120;
  let damageValue;

  // handle damage pop based on Game_ActionResult from the target.
  const result = popup.getBaseActionResult();
  if (result) {
    // if we have an action result to work with, then use it.
    if (result.evaded) {
      // if they evaded because high evasion, then say so.
      sprite._colorType = 7;
      sprite.createValue("Evade!");
      return;  
    } else if (result.parried) {
      sprite._flashColor = [96, 96, 255, 192];
      sprite._flashDuration = 60;
      sprite._colorType = 8;
      sprite.createValue("Parry!");
      return;
    }
  
    if (result.hpAffected) {
      // if hp-centric.
      sprite._colorType = result.hpDamage >= 0 
        ? 0 // hp damage
        : 3;// hp healing
      damageValue = Math.round(result.hpDamage).toString();
    } else if (result.mpDamage !== 0) {
      // if mp-centric.
      sprite._colorType = result.mpDamage >= 0 
        ? 5 // mp damage
        : 4;// mp healing
      damageValue = Math.round(result.mpDamage).toString();
    } else if (result.tpDamage !== 0) {
      // if tp-centric.
      sprite._colorType = result.tpDamage >= 0 
        ? 19 // tp damage
        : 18;// tp healing
      damageValue = Math.round(result.tpDamage).toString();
    }

    // handle visual alterations if critical.
    if (result.critical) {
      sprite._flashColor = [255, 0, 0, 240];
      sprite._flashDuration = 100;
      sprite._isCritical = true;
      sprite._duration += 60;
    }
  } else {
    damageValue = popup.getDirectValue();
    sprite._colorType = popup.getTextColor() || 0;
  }

  // stringify the damage and if its `undefined`, just clean that up.
  damageValue = `${damageValue}`;
  if (damageValue.includes(`undefined`)) {
    damageValue = ``;
  }

  // remove the `-` from healing popups.
  if (damageValue.indexOf(`-`) != -1) {
    damageValue = damageValue.substring(damageValue.indexOf(`-`) + 1);
  }

  // handle visual alterations if elementally strong/weak.
  if (popup.getIsStrength()) {
    damageValue = `${damageValue}!!!`;
  } else if (popup.getIsWeakness()) {
    damageValue = `${damageValue}...`;
  }

  sprite.createValue(damageValue.toString());
};

/**
 * Configures the values for a basic text popup.
 * @param {Sprite_Damage} sprite The sprite to configure for this experience pop.
 * @param {JABS_TextPop} popup The data for this pop.
 */
Sprite_Character.prototype.buildBasicPopSprite = function(sprite, popup) {
  const value = popup.getDirectValue();
  sprite._colorType = popup.getTextColor();
  sprite.createValue(`${value}`);
};
//#endregion

//#region Sprite_Damage
/**
 * Extends this `.initialize()` function to include our parameters for all damage sprites.
 */
J.ABS.Aliased.Sprite_Damage.initialize = Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function() {
  J.ABS.Aliased.Sprite_Damage.initialize.call(this);
  this._xVariance = 0;
  this._yVariance = 0;
  this._isCritical = false;
  this._isDamage = false;
  this._icon = null;
  this._persist = false;
};

/**
 * Assigns the provided value to be the text of this popup.
 * @param {string} value The value to display in the popup. 
 */
Sprite_Damage.prototype.createValue = function(value) {
  const h = this.fontSize();
  const w = 400;
  const sprite = this.createChildSprite(w, h);
  let fontSize = 20;
  if (this._isCritical) {
    fontSize += 12;
    sprite.bitmap.fontBold = true;
  } else if (value.includes("Missed") || value.includes("Evaded") || value.includes("Parry")) {
    fontSize -= 6;
    sprite.bitmap.fontItalic = true;
  } 

  sprite.bitmap.fontSize = fontSize;
  sprite.bitmap.drawText(value, 32, 0, w, h, "left");
  sprite.dy = 0;
}

/**
 * Adds an icon to the damage sprite.
 * @param {number} iconIndex The id/index of the icon on the iconset.
 */
Sprite_Damage.prototype.addIcon = function(iconIndex) {
  const sprite = this.createChildSprite(32, 32);
  const bitmap = ImageManager.loadSystem("IconSet");
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (iconIndex % 16) * pw;
  const sy = Math.floor(iconIndex / 16) * ph;
  sprite.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
  sprite.scale.x = 0.75;
  sprite.scale.y = 0.75;
  sprite.y += 15;
  sprite.x -= 180;
  sprite.dy = 0;
}

/**
 * OVERWRITE
 * 
 * Updates the duration to start fading later, and for longer.
 */
Sprite_Damage.prototype.updateOpacity = function() {
  if (this._duration < 60 && this._persist == false) {
    this.opacity = (255 * this._duration) / 60;
  }
}

/**
 * OVERWRITE
 * 
 * Updates the damage color to be any color on the system palette.
 */
Sprite_Damage.prototype.damageColor = function() {
  return ColorManager.textColor(this._colorType);
}
//#endregion

//#region Sprite_Gauge
/**
 * Due to JABS' slip effects, we have fractional hp/mp/tp values.
 * This rounds up the values for the sprite gauge if they are a number.
 */
J.ABS.Aliased.Sprite_Gauge.currentValue = Sprite_Gauge.prototype.currentValue;
Sprite_Gauge.prototype.currentValue = function() {
  let base = J.ABS.Aliased.Sprite_Gauge.currentValue.call(this);
  if (base != NaN) {
    base = Math.ceil(base);
  }

  return base;
};
//#endregion Sprite_Gauge
//#endregion Sprite objects

//#region Window objects
//#region Window_AbsMenu
/**
 * The window representing what is called and manages the player's assigned skill slots.
 */
class Window_AbsMenu extends Window_Command {
  /**
   * @constructor
   * @param {Rectangle} rect The shape of the window.
   */
  constructor(rect) { 
    super(rect);
    this.initialize(rect);
  };
  
  /**
   * Initializes this window.
   * @param {Rectangle} rect The shape of the window.
   */
  initialize(rect) {
    super.initialize(rect);
    this.refresh();
    this.select(0);
    this.activate();
  };

  /**
   * Generates the command list for the JABS menu.
   */
  makeCommandList() {
    this.addCommand("Equip Combat Skills", "skill-assign", true, null, 77);
    this.addCommand("Equip Dodge Skills", "dodge-assign", true, null, 82);
    this.addCommand("Equip Tools", "item-assign", true, null, 83);
    this.addCommand("Main Menu", "main-menu", true, null, 189);
    this.addCommand("Cancel", "cancel", true, null, 73);
  };

  /**
   * Closes the Abs menu.
   */
  closeMenu() {
    if (!this.isClosed()) {
      this.close();
      $gameBattleMap.absPause = false;
      $gameBattleMap.requestAbsMenu = false;
    }
  };

};

//#endregion

//#region Window_AbsMenuSelect
/**
 * A window that is reused to draw all the subwindows of the JABS menu.
 */
class Window_AbsMenuSelect extends Window_Command {
  /**
   * @constructor
   * @param {Rectangle} rect The shape of the window.
   * @param {string} type The type of window this is, such as "dodge" or "skill".
   */
  constructor(rect, type) {
    super(rect, type);
    this.initialize(rect, type);
  };

  /**
   * Initializes this window.
   * @param {Rectangle} rect The window dimensions.
   * @param {string} type The type of abs menu selection this is.
   */
  initialize(rect, type) {
    this._j = {};
    this._j._menuType = type;
    super.initialize(rect);
    this.refresh();
    this.select(0);
    this.activate();
  };

  /**
   * Draws all commands of this select window.
   */
  makeCommandList() {
    switch (this._j._menuType) {
      case "skill":
        // the list of all equippable combat skills this actor knows.
        this.makeSkillList();
        break;
      case "tool":
        // the list of all items/tools in the party's possession.
        this.makeToolList();
        break;
      case "dodge":
        // the list of all equippable dodge skills this actor knows.
        this.makeDodgeList();
        break;
      case "equip-skill":
        // the combat skill equip menu, where all the combat skills can be equipped.
        this.makeEquippedSkillList();
        break;
      case "equip-tool":
        // the tool equip menu, where the items/tools can be equipped.
        this.makeEquippedToolList();
        break;
      case "equip-dodge":
        // the dodge skill equip menu, where all the dodge skills can be equipped.
        this.makeEquippedDodgeList();
        break;
    }
  };

  /**
   * Fills the list with learned skills to assign.
   */
  makeSkillList() {
    const actor = $gameParty.leader();
    const skills = actor.skills().filter(skill => {
      const isDodgeSkillType = JABS_Battler.isDodgeSkillById(skill.id);
      const isGuardSkillType = JABS_Battler.isGuardSkillById(skill.id);
      let needsHiding = false;
      if (skill.meta && skill.meta["Hide if learned Skill"]) {
        const nextSkillId = parseInt(skill.meta["Hide if learned Skill"]);
        needsHiding = actor.isLearnedSkill(nextSkillId);
      }

      const addSkillToList = !isDodgeSkillType && !isGuardSkillType && !needsHiding;
      return addSkillToList;
    });

    this.addCommand("Clear Slot...", "skill", true, 0, 16);
    skills.forEach(skill => {
      this.addCommand(skill.name, "skill", true, skill.id, skill.iconIndex);
    });
  };

  /**
   * Fills the list with items in the player's possession to assign.
   */
  makeToolList() {
    const items = $gameParty.allItems().filter(item => {
      const isItem = DataManager.isItem(item) && item.itypeId === 1;
      const isUsable = isItem && (item.occasion === 0);
      return isItem && isUsable;
    });

    this.addCommand("Clear Slot...", "tool", true, 0, 16);
    items.forEach(item => {
      const name = `${item.name}: ${$gameParty.numItems(item)}`;
      this.addCommand(name, "tool", true, item.id, item.iconIndex);
    });
  };

  /**
   * Fills the list with the currently assigned dodge.
   */
  makeDodgeList() {
    const actor = $gameParty.leader();
    const skills = actor.skills();
    const dodgeSkills = skills.filter(skill => {
      return skill.stypeId == 1;
    });

    this.addCommand("Clear Slot...", "dodge", true, 0, 16);
    dodgeSkills.forEach(dodge => {
      this.addCommand(dodge.name, "dodge", true, dodge.id, dodge.iconIndex);
    });
  };

  /**
   * Fills the list with the currently assigned items.
   */
  makeEquippedSkillList() {
    const actor = $gameParty.leader();
    const equippedActions = actor.getAllEquippedSkills();
    const keys = Object.keys(equippedActions).filter(key => {
      return (
        key != Game_Actor.JABS_MAINHAND &&
        key != Game_Actor.JABS_OFFHAND &&
        key != Game_Actor.JABS_TOOLSKILL &&
        key != Game_Actor.JABS_DODGESKILL);
    });

    keys.forEach(key => {
      const skillSlot = equippedActions[key];
      let name = `${key}: - unassigned -`;
      let iconIndex = 0;
      if (skillSlot.id !== 0) {
        const equippedSkill = $dataSkills[skillSlot.id];
        name = `${equippedSkill.name}`;
        iconIndex = equippedSkill.iconIndex;
      }

      this.addCommand(name, "slot", true, key, iconIndex);
    });
  };

  /**
   * Fills the list with the currently assigned items.
   */
  makeEquippedToolList() {
    const actor = $gameParty.leader();
    const equippedActions = actor.getAllEquippedSkills();
    const keys = Object.keys(equippedActions).filter(key => {
      return key == Game_Actor.JABS_TOOLSKILL;
    });

    keys.forEach(key => {
      const toolSlot = equippedActions[key];
      let name = `${key}: - unassigned -`;
      let iconIndex = 0;
      if (toolSlot.id !== 0) {
        const equippedTool = $dataItems[toolSlot.id];
        name = `${equippedTool.name}: ${$gameParty.numItems(equippedTool)}`;
        iconIndex = equippedTool.iconIndex;
      }

      this.addCommand(name, "slot", true, key, iconIndex);
    });
  };

  /**
   * Fills the list with the currently assigned items.
   */
  makeEquippedDodgeList() {
    const actor = $gameParty.leader();
    const equippedActions = actor.getAllEquippedSkills();
    const keys = Object.keys(equippedActions).filter(key => {
      return key == Game_Actor.JABS_DODGESKILL;
    });

    keys.forEach(key => {
      const dodgeSlot = equippedActions[key];
      let name = `${key}: - unassigned -`;
      let iconIndex = 0;
      if (dodgeSlot.id !== 0) {
        const equippedDodgeSkill = $dataSkills[dodgeSlot.id];
        name = `${equippedDodgeSkill.name}`;
        iconIndex = equippedDodgeSkill.iconIndex;
      }

      this.addCommand(name, "slot", true, key, iconIndex);
    });
  };
}
//#endregion
//#endregion Window objects

//#region New Game objects

//#region Game_BattleMap
/**
 * This class handles how non-player `JABS_Battler`s interact with others.
 */
class Game_BattleMap {
  /**
   * @constructor
   */
  constructor() { 
    this.initialize();
  };

  /**
   * Creates all members available in this class.
   */
  initialize() {
    /**
     * The `JABS_Battler` representing the player.
     * @type {JABS_Battler}
     */
    this._playerBattler = null;

    /**
     * The number of frames passed since last reset.
     * @type {number}
     */
    this._absFrames = 0;

    /**
     * True if we want to review available events for rendering, false otherwise.
     * @type {boolean}
     */
    this._requestActionRendering = false;

    /**
     * True if we want to review available loot for rendering, false otherwise.
     * @type {boolean}
     */
    this._requestLootRendering = false;

    /**
     * True if we want to cycle through our party members, false otherwise.
     * @type {boolean}
     */
    this._requestPartyRotation = false;

    /**
     * True if we want to render additional sprites to the screen, false otherwise.
     * @type {boolean}
     */
    this._requestRendering = false;

    /**
     * True if we want to empty the map of all action sprites, false otherwise.
     * @type {boolean}
     */
    this._requestClearMap = false;

    /**
     * True if we want to empty the map of all stale loot sprites, false otherwise.
     * @type {boolean}
     */
    this._requestClearLoot = false;

    /**
     * True if we want to refresh all sprites and their add-ons, false otherwise.
     * @type {boolean}
     */
    this._requestSpriteRefresh = false;

    /**
     * A collection to manage all `JABS_Action`s on this battle map.
     * @type {JABS_Action[]}
     */
    this._actionEvents = [];

    /**
     * True if we want to call the ABS-specific menu, false otherwise.
     * @type {boolean}
     */
    this._requestAbsMenu = false;

    /**
     * True if we want to refresh the commands of the JABS menu, false otherwise.
     * @type {boolean}
     */
    this._requestJabsMenuRefresh = false;

    /**
     * Whether or not this ABS is enabled.
     * If disabled, button input and enemy AI will be disabled.
     * Enemy battlers on the map will instead act like their
     * regularly programmed events.
     *
     * This will most likely be used for when the dev enters a town and the
     * populace is peaceful.
     * @type {boolean}
     */
    this._absEnabled = true;

    /**
     * Whether or not this ABS is temporarily paused.
     * If paused, all battlers on the map including the player will halt
     * movement, though timers will still tick.
     * @type {boolean}
     */
    this._absPause = false;
    this.initializePlayerBattler();
  };

  //#region getters/setters of the battle map
  /**
   * Retrieves whether or not the ABS is currently enabled.
   * @returns {boolean} True if enabled, false otherwise.
   */
  get absEnabled() {
    return this._absEnabled;
  };

  /**
   * Sets the ABS enabled switch to a new boolean value.
   * @param {boolean} enabled Whether or not the ABS is enabled (default = true).
   */
  set absEnabled(enabled) {
    return this._absEnabled = enabled;
  };

  /**
   * Retrieves whether or not the ABS is currently paused.
   * @returns {boolean} True if paused, false otherwise.
   */
  get absPause() {
    return this._absPause;
  };

  /**
   * Sets the ABS pause switch to a new boolean value.
   * @param {boolean} paused Whether or not the ABS is paused (default = true).
   */
  set absPause(paused) {
    this._absPause = paused;
  }

  /**
   * Checks whether or not we have a need to request the ABS-specific menu.
   * @returns {boolean} True if menu requested, false otherwise.
   */
  get requestAbsMenu() {
    return this._requestAbsMenu;
  };

  /**
   * Sets the current request for calling the ABS-specific menu.
   * @param {boolean} requested Whether or not we want to request the menu (default: true).
   */
  set requestAbsMenu(requested) {
    return this._requestAbsMenu = requested;
  };

  /**
   * Returns all current events being managed on this battle map.
   * @returns {JABS_Action[]} The collection of `JABS_Action`s on this battle map.
   */
  get actionEvents() {
    return this._actionEvents;
  };

  /**
   * Gets whether or not there is a request to cycle through party members.
   * @returns {boolean}
   */
  get requestPartyRotation() {
    return this._requestPartyRotation;
  };

  /**
   * Sets the request for party rotation.
   * @param {boolean} rotate True if we want to rotate party members, false otherwise.
   */
  set requestPartyRotation(rotate) {
    this._requestPartyRotation = rotate;
  };

  /**
   * Gets whether or not there is a request to refresh the JABS menu.
   * The most common use case for this is adding new commands to the menu.
   * @returns {boolean}
   */
  get requestJabsMenuRefresh() {
    return this._requestJabsMenuRefresh;
  };

  /**
   * Sets the request for refreshing the JABS menu.
   * @param {boolean} rotate True if we want to refresh the JABS menu, false otherwise.
   */
  set requestJabsMenuRefresh(requested) {
    this._requestJabsMenuRefresh = requested;
  };

  /**
   * Adds a new `JABS_Action` to this battle map for tracking.
   * @param {JABS_Action} actionEvent The `JABS_Action` to add.
   */
  addActionEvent(actionEvent) {
    this._actionEvents.push(actionEvent);
  };

  /**
   * Clears all currently managed `JABS_Action`s on this battle map that are marked
   * for removal.
   */
  clearActionEvents() {
    const actionEvents = this.actionEvents;
    const updatedActionEvents = actionEvents.filter(action => {
      return !action.getNeedsRemoval();
    });

    if (actionEvents.length != updatedActionEvents) {
      this.requestClearMap = true;
    }

    this._actionEvents = updatedActionEvents;
  };

  /**
   * Checks for how many living enemies there are present on the map.
   * "Enemies" is defined as "number of `Game_Battler`s that are `Game_Enemy`s".
   * @returns {boolean} True if there are any living enemies on this map, false otherwise.
   */
  anyLivingEnemies() {
    const anyEnemies = $gameMap
      .getBattlers()
      .find(battler => battler.isEnemy() && !battler.isInanimate());
    return !!anyEnemies;
  };

  /**
   * Checks whether or not we have a need to request rendering for new actions.
   * @returns {boolean} True if needing to render actions, false otherwise.
   */
  get requestActionRendering() {
    return this._requestActionRendering;
  };

  /**
   * Issues a request to render actions on the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestActionRendering(request) {
    this._requestActionRendering = request;
  };

  /**
   * Checks whether or not we have a need to request rendering for new loot sprites.
   * @returns {boolean} True if needing to render loot, false otherwise.
   */
  get requestLootRendering() {
    return this._requestLootRendering;
  };

  /**
   * Issues a request to render loot onto the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestLootRendering(request) {
    this._requestLootRendering = request;
  };

  /**
   * Checks whether or not we have a need to request a clearing of the action sprites
   * on the current map.
   * @returns {boolean} True if clear map requested, false otherwise.
   */
  get requestClearMap() {
    return this._requestClearMap;
  };

  /**
   * Issues a request to clear the map of all stale actions.
   * @param {boolean} request Whether or not we want to clear the battle map (default = true).
   */
  set requestClearMap(request) {
    this._requestClearMap = request;
  };

  /**
   * Checks whether or not we have a need to request a clearing of the loot sprites
   * on the current map.
   * @returns {boolean} True if clear loot requested, false otherwise.
   */
  get requestClearLoot() {
    return this._requestClearLoot;
  }

  /**
   * Issues a request to clear the map of any collected loot.
   * @param {boolean} request True if clear loot requested, false otherwise.
   */
  set requestClearLoot(request) {
    this._requestClearLoot = request;
  };

  /**
   * Checks whether or not we have a need to refresh all character sprites on the current map.
   * @returns {boolean} True if refresh is requested, false otherwise.
   */
  get requestSpriteRefresh() {
    return this._requestSpriteRefresh;
  };

  /**
   * Issues a request to refresh all character sprites on the current map.
   * @param {boolean} request True if we want to refresh all sprites, false otherwise.
   */
  set requestSpriteRefresh(request) {
    this._requestSpriteRefresh = request;
  };

  /**
   * Whether or not the player is ready to attack using the mainhand skill slot.
   * @returns {boolean} True if the mainhand skill is off cooldown, false otherwise.
   */
  isMainhandActionReady() {
    const player = this.getPlayerMapBattler();
    const attackReady = player.isBaseCooldownReady(Game_Actor.JABS_MAINHAND);
    const comboReady = player.isComboCooldownReady(Game_Actor.JABS_MAINHAND);
    const ready = attackReady || comboReady;
    return ready;
  };

  /**
   * Whether or not the player is ready to attack using the offhand skill slot.
   * @returns {boolean} True if the offhand skill is off cooldown, false otherwise.
   */
  isOffhandActionReady() {
    const player = this.getPlayerMapBattler();
    const attackReady = player.isBaseCooldownReady(Game_Actor.JABS_OFFHAND);
    const comboReady = player.isComboCooldownReady(Game_Actor.JABS_OFFHAND);
    const ready = attackReady || comboReady;
    return ready;
  };

  /**
   * Retrieves the `JABS_Action` associated with the skill type.
   * If the skill is not off cooldown or simply unassigned, return `null`.
   * @param {JABS_Battler} battler The battler executing the action.
   * @param {string} skillType The slot this skill is associated with.
   * @returns {(JABS_Action|null)}
   */
  getSkillActionData(battler, skillType) {
    if (!battler.isSkillTypeCooldownReady(skillType)) return null;

    const mapActions = battler.getAttackData(skillType);
    if (!mapActions || !mapActions.length) return null;

    mapActions.forEach(action => action.setCooldownType(skillType))
    return mapActions;
  };

  /**
   * Determines the animation id for this particular attack.
   * @param {object} skill The $dataSkills object for this skill.
   * @param {JABS_Battler} caster The caster of this skill.
   */
  getAnimationId(skill, caster) {
    let animationId = skill.animationId;
    if (animationId == -1) {
      if (caster.isEnemy()) {
        animationId = J.ABS.DefaultValues.AttackAnimationId;
      } else {
        const weapons = caster.getBattler().weapons();
        if (weapons.length > 0) {
          animationId = weapons[0].animationId;
        } else {
          animationId = J.ABS.DefaultValues.AttackAnimationId;
        }
      }
    }

    return animationId;
  };

  /**
   * Returns the `JABS_Battler` associated with the player.
   * @returns {JABS_Battler} The battler associated with the player.
   */
  getPlayerMapBattler() {
    return this._playerBattler;
  };

  //#endregion getters/setters of the battle map
  
  /**
   * Initializes the player properties associated with this battle map.
   */
  initializePlayerBattler() {
    if (this._playerBattler == null || !this._playerBattler.getUuid()) {
      this._playerBattler = JABS_Battler.createPlayer();
      const uuid = this._playerBattler.getUuid();
      $gamePlayer.setMapBattler(uuid);
    }
  };

  /**
   * Updates all the battlers on the current map.
   * Also, this includes managing player input and updating active `JABS_Action`s.
   */
  update() {
    this.updatePlayerBattler();
    this.updateNonPlayerBattlers();
    this.updateActions();
  };

  //#region base battle updates
  /**
   * Cycles through and updates all things related to the player.
   */
  updatePlayerBattler() {
    const player = this.getPlayerMapBattler();
    if (player == null) return;
    if (player.getBattler().isDead()) {
      this.handleDefeatedPlayer();
    }

    this.handleInput();
    player.update();
  };

  //#region Player input and handling
  /**
   * Handles the player input if the menu isn't requested.
   */
  handleInput() {
    if (this.requestAbsMenu || this.absPause) {
      return;
    } else {
      this.handleAbsInput();
    }
  };

  /**
   * Handles the player input and executes actions on the map.
   */
  handleAbsInput() {
    // don't swing all willy nilly while events are executing.
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) return;

    // strafing can be done concurrently to other actions.
    if (Input.isPressed(J.ABS.Input.L2)) {
      this.performStrafe(true);
    } else {
      this.performStrafe(false);
    }

    // dodge roll
    if (Input.isTriggered(J.ABS.Input.R2)) {
      this.performDodgeRoll();
      return;
    }

    // track for L1 + ABXY
    if (Input.isPressed(J.ABS.Input.L1)) {
      if (Input.isTriggered(J.ABS.Input.A)) {
        this.performSkillAction(1);
      } else if (Input.isTriggered(J.ABS.Input.B)) {
        this.performSkillAction(2);
      } else if (Input.isTriggered(J.ABS.Input.X)) {
        this.performSkillAction(3);
      } else if (Input.isTriggered(J.ABS.Input.Y)) {
        this.performSkillAction(4);
      }

      return;
    }

    // track for R1 + ABXY
    if (Input.isPressed(J.ABS.Input.R1)) {
      if (Input.isTriggered(J.ABS.Input.A)) {
        this.performSkillAction(5);
      } else if (Input.isTriggered(J.ABS.Input.B)) {
        this.performSkillAction(6);
      } else if (Input.isTriggered(J.ABS.Input.X)) {
        this.performSkillAction(7);
      } else if (Input.isTriggered(J.ABS.Input.Y)) {
        this.performSkillAction(8);
      } else {
        // if pressing R1, but not any keys, defend instead.
        this.performRotate(true);
      }

      return;
    } else {
      // not defending now.
      this.performRotate(false);
    }

    // track for keyboard-exclusive input for skills.
    if (Input.isTriggered("1")) {
      this.performSkillAction(1);
      return;
    }
    if (Input.isTriggered("2")) {
      this.performSkillAction(2);
      return;
    }

    if (Input.isTriggered("3")) {
      this.performSkillAction(3);
      return;
    }

    if (Input.isTriggered("4")) {
      this.performSkillAction(4);
      return;
    }

    if (Input.isTriggered("5")) {
      this.performSkillAction(5);
      return;
    }

    if (Input.isTriggered("6")) {
      this.performSkillAction(6);
      return;
    }

    if (Input.isTriggered("7")) {
      this.performSkillAction(7);
      return;
    }

    if (Input.isTriggered("8")) {
      this.performSkillAction(8);
      return;
    }

    // mainhand action
    if (Input.isTriggered(J.ABS.Input.A)) {
      // if we are about to interact with an NPC, don't cut them down pls.
      if (this.isNonBattlerEventInFrontOfPlayer()) {
        return;
      }

      this.performMainhandAction();
    }

    // combat offhand action
    // only able to perform this if the player doesn't have a guard skill in their offhand.
    if (!this.getPlayerMapBattler().isGuardSkillByKey(Game_Actor.JABS_OFFHAND) && 
      (Input.isTriggered(J.ABS.Input.B) || Input.isTriggered("control"))) {
        this.performOffhandAction();
    }

    // tool action
    if (Input.isTriggered(J.ABS.Input.Y)) {
      this.performToolAction();
    }

    // menu
    if (Input.isTriggered(J.ABS.Input.Start) || Input.isTriggered("escape")) {
      this.performMenuAction();
    }

    // party rotation
    if (Input.isTriggered(J.ABS.Input.Select)) {
      this.rotatePartyMembers();
    }
  };

  /**
   * 
   * @returns {boolean} True if there is an event infront of the player, false otherwise.
   */
  isNonBattlerEventInFrontOfPlayer() {
    const player = this.getPlayerMapBattler().getCharacter();
    const direction = player.direction();
    const x1 = player.x;
    const y1 = player.y;
    const x2 = $gameMap.roundXWithDirection(x1, direction);
    const y2 = $gameMap.roundYWithDirection(y1, direction);
    const triggers = [0, 1, 2];
    for (const event of $gameMap.eventsXy(x2, y2)) {
      // if the player is mashing the button at an enemy, let them continue.
      if (event.isJabsBattler()) return false;

      if (event.isTriggerIn(triggers) && event.isNormalPriority() === true) {
        return true;
      }
    }

    if ($gameMap.isCounter(x2, y2)) {
      const x3 = $gameMap.roundXWithDirection(x2, direction);
      const y3 = $gameMap.roundYWithDirection(y2, direction);

      for (const event in $gameMap.eventsXy(x3, y3)) {
        // if the player is mashing the button at an enemy, let them continue.
        if (event.isJabsBattler()) return false;

        if (event.isTriggerIn(triggers) && event.isNormalPriority() === true) {
          return true;
        }
      }
    }

    return false;
  };

  /**
   * Rotates the leader out to the back and pulls in the next-in-line.
   */
  rotatePartyMembers(force = false) {
    // if rotating is disabled, then skip- forced cycling bypasses this check.
    if (!$gameParty.canPartyCycle() && !force) return;

    // you can't rotate if there is no party to rotate through.
    if ($gameParty._actors.length === 1) return;

    this.performPartyCycling();
  };

  /**
   * Actually executes the party cycling and swaps to the next living member.
   */
  performPartyCycling() {
    //const isNextAllyDead = $gameParty._actors.find(actorId => {
    //  return !$gameActors.actor(actorId).isDead();
    //});

    // if next member is dead, then don't rotate.
    const isNextMemberDead = $gameActors.actor($gameParty._actors[1]).isDead();
    if (isNextMemberDead) return;

    // swap to the next party member in the sequence.
    $gameParty._actors.push($gameParty._actors.shift());
    $gamePlayer.refresh();
    $gamePlayer.requestAnimation(40, false);

    // recreate the JABS player battler and set it to the player character.
    this._playerBattler = JABS_Battler.createPlayer();
    const newPlayer = this.getPlayerMapBattler().getCharacter();
    newPlayer.setMapBattler(this._playerBattler.getUuid());

    // request the scene overlord to take notice and react accordingly (refresh hud etc).
    this.requestPartyRotation = true;
    const battlerName = this.getPlayerMapBattler().battlerName();
    const log = new Map_TextLog(`Party cycled to ${battlerName}.`, -1);
    $gameTextLog.addLog(log);
  };

  /**
   * Executes an action on the map based on the mainhand skill slot.
   */
  performMainhandAction() {
    const battler = this.getPlayerMapBattler();
    if (!this.isMainhandActionReady() || !battler.canBattlerUseAttacks()) {
      return;
    }
    const actions = battler.getAttackData(Game_Actor.JABS_MAINHAND);
    if (!actions || !actions.length) return;

    actions.forEach(action => action.setCooldownType(Game_Actor.JABS_MAINHAND));
    this.executeMapActions(battler, actions);
  };

  /**
   * Executes an action on the map based on the offhand skill slot.
   */
  performOffhandAction() {
    const battler = this.getPlayerMapBattler();
    if (!battler.hasOffhandSkill() ||
      !this.isOffhandActionReady() ||
      !battler.canBattlerUseAttacks()) {
      return;
    }

    const actions = battler.getAttackData(Game_Actor.JABS_OFFHAND);
    if (!actions || !actions.length) return;

    actions.forEach(action => action.setCooldownType(Game_Actor.JABS_OFFHAND));
    this.executeMapActions(battler, actions);
  };

  /**
   * Begins the execution of a tool. Depending on the equipped tool,
   * this can perform a variety of types of actions.
   */
  performToolAction() {
    const battler = this.getPlayerMapBattler();
    const cooldownReady = battler.isSkillTypeCooldownReady(Game_Actor.JABS_TOOLSKILL);
    const toolId = battler.getBattler().getEquippedSkill(Game_Actor.JABS_TOOLSKILL);
    if (cooldownReady && toolId) {
      battler.applyToolEffects(toolId);
    }
  };

  /**
   * Begins execution of a skill based on any of the L1/R1 + ABXY skill slots.
   * @param {number} inputCombo The input combination to execute a skill.
   */
  performSkillAction(inputCombo) {
    const battler = this.getPlayerMapBattler();
    if (!battler.canBattlerUseSkills()) {
      SoundManager.playCancel();
      return;
    }

    let mapActions = [];

    switch (inputCombo) {
      case 1: // L1 + A
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_L1_A_SKILL);
        break;
      case 2: // L1 + B
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_L1_B_SKILL);
        break;
      case 3: // L1 + X
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_L1_X_SKILL);
        break;
      case 4: // L1 + Y
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_L1_Y_SKILL);
        break;
      case 5: // R1 + A
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_R1_A_SKILL);
        break;
      case 6: // R1 + B
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_R1_B_SKILL);
        break;
      case 7: // R1 + X
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_R1_X_SKILL);
        break;
      case 8: // R1 + Y
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_R1_Y_SKILL);
        break;
    }

    if (mapActions && mapActions.length) {
      this.executeMapActions(battler, mapActions);
    } else {
      // either no skill equipped in that slot, or its not off cooldown.
      SoundManager.playCancel();
    }
  };

  /**
   * Calls the Abs menu.
   */
  performMenuAction() {
    this.absPause = true;
    this.requestAbsMenu = true;
  };

  /**
   * Locks the player's facing direction while allowing movement.
   */
  performStrafe(strafing) {
    const player = this.getPlayerMapBattler().getCharacter();
    player.setDirectionFix(strafing);
  };

  /**
   * Locks the player's movement so they may rotate in-place without movement.
   * If the player has a guard skill for their offhand, then also perform a guard.
   * @param {boolean} rotating True if the player is rotating, false otherwise.
   */
  performRotate(rotating) {
    const player = this.getPlayerMapBattler();
    player.setMovementLock(rotating);

    // if the player also has a guard skill equipped in their offhand, guard!
    if (player.isGuardSkillByKey(Game_Actor.JABS_OFFHAND)) {
      player.executeGuard(rotating, Game_Actor.JABS_OFFHAND);
    }
  };

  /**
   * Executes the battler's dodge skill.
   */
  performDodgeRoll() {
    const player = this.getPlayerMapBattler();
    if (player.isSkillTypeCooldownReady(Game_Actor.JABS_DODGESKILL) && player.canBattlerMove()) {
      player.tryDodgeSkill();
    }
  };

  //#endregion perform actions

  /**
   * Cycles through and updates all things related to battlers other than the player.
   */
  updateNonPlayerBattlers() {
    const player = $gameBattleMap.getPlayerMapBattler();
    const visibleBattlers = $gameMap.getBattlersWithinRange(player, 20);

    //const battlers = $gameMap.getBattlers();
    visibleBattlers.forEach(battler => {
      battler.update();
      if (battler.getBattler().isDead() && !battler.isDying()) {
        battler.setInvincible();
        this.handleDefeatedTarget(battler, this.getPlayerMapBattler());
      }
    });
  };

  //#endregion player input and handling
  /**
   * Updates all `JABS_Action`s currently on the battle map. This includes checking for collision,
   * checking piercing information, and applying effects against the map.
   */
  updateActions() {
    const actionEvents = this.actionEvents;
    actionEvents.forEach(action => {
      // if the duration of the action expires, remove it.
      action.countdownDuration();
      if (action.isActionExpired()) {
        this.cleanupAction(action);
        return;
      }

      // if there are no more hits left on this action, remove it.
      const hits = action.getPiercingTimes();
      if (hits <= 0) {
        this.cleanupAction(action);
        return;
      }

      // if there is a delay between hits, count down on it.
      const delay = action.getPiercingDelay();
      if (delay > 0) {
        action.modPiercingDelay();
        return;
      }

      // determine targets that this action collided with.
      const targets = this.getCollisionTargets(action);
      if (targets.length > 0) {
        targets.forEach(target => {
          this.applyPrimaryBattleEffects(action, target);
        });

        // if the target can pierce enemies, adjust those values.
        action.resetPiercingDelay();
        action.modPiercingTimes();
      }
    });
  };

  /**
   * Cleans up a `JABS_Action` assuming the minimum duration has passed.
   * @param {JABS_Action} action The action to be cleaned up.
   */
  cleanupAction(action) {
    if (action.getDuration() >= JABS_Action.getMinimumDuration()) {
      action.setNeedsRemoval();
      this.clearActionEvents();
    }
  };

  //#endregion base battle updates
  /**
   * Find a battler on this map by their `uuid`.
   * @param {string} uuid The unique identifier of a battler to find.
   * @returns {(JABS_Battler|null)}
   */
  getBattlerByUuid(uuid) {
    const battlers = $gameMap.getBattlers();
    const player = $gameBattleMap.getPlayerMapBattler();
    battlers.push(player);
    const jabsBattler = battlers.find(battler => {
      const result = battler.getUuid() === uuid;
      return result
    });
    return jabsBattler
      ? jabsBattler
      : null;
  };

  /**
   * Clears leader data from another battler by it's `uuid`.
   * @param {string} uuid The `uuid` of the battler to clear leader data for.
   */
  clearLeaderDataByUuid(uuid) {
    const battler = this.getBattlerByUuid(uuid);
    if (battler) {
      battler.clearLeaderData();
    }
  };

  /**
   * Gets all nearby battlers that have an ai trait of `follower`.
   * @param {JABS_Battler} leaderBattler The battler to get all nearby followers for.
   * @returns {JABS_Battler[]} All ai-traited `follower` battlers. 
   */
  getNearbyFollowers(leaderBattler) {
    // TODO: optimize the range parameter passed in here?
    const range = leaderBattler.getSightRadius() + leaderBattler.getPursuitRadius();
    const nearbyBattlers = $gameMap.getBattlersWithinRange(leaderBattler, range);
    const nearbyFollowers = nearbyBattlers.filter(battler => {
      const ai = battler.getAiMode();
      const canLead = !battler.hasLeader() || (leaderBattler.getUuid() === battler.getLeader());
      return (ai.follower && !ai.leader && canLead);
    });
    return nearbyFollowers;
  };

  /**
   * Generates a new `JABS_Action` based on a skillId, and executes the skill.
   * This overrides the need for costs or cooldowns, and is intended to be
   * used from the map, within an event's custom move routes.
   * @param {JABS_Battler} battler The battler executing the skill.
   * @param {number} skillId The skill to be executed.
   * @param {boolean} isRetaliation Whether or not this skill is from a retaliation.
   */
  forceMapAction(battler, skillId, isRetaliation = false) {
    const actions = battler.createMapActionFromSkill(skillId, isRetaliation);

    // if no actions, then don't actually do anything.
    if (!actions || !actions.length) return;

    this.executeMapActions(battler, actions);
  };

  /**
   * Iterates over all actions provided and executes them.
   * @param {JABS_Battler} battler The battler executing the action.
   * @param {JABS_Action[]} actions All actions to perform.
   */
  executeMapActions(battler, actions) {
    // if no actions, then don't actually do anything.
    if (!actions) return;

    actions.forEach(action => {
      this.executeMapAction(battler, action);
    });
  };

  /**
   * Executes the provided `JABS_Action`.
   * It generates a copy of an event from the "ActionMap" and fires it off
   * based on it's moveroute.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  executeMapAction(caster, action) {
    const character = caster.getCharacter();
    const baseSkill = action.getBaseSkill();
    const { casterAnimation, freeCombo } = baseSkill._j;

    // apply cooldowns and pay costs.
    this.applyCooldownCounters(caster, action);
    this.paySkillCosts(caster, action);
    if (freeCombo) {
      this.checkComboSequence(caster, action)
    }

    // perform self-animation and pose.
    caster.performActionPose(baseSkill);
    if (casterAnimation && !character.isAnimationPlaying()) {
      character.requestAnimation(casterAnimation);
    }

    if (action.isDirectAction()) {
      // if the skill is actually a direct action, then perform that logic instead.
      this.addActionEvent(action);
    } else {
      // actually perform the event creation for spawning a new action on the map.
      const eventId = action.getActionId();
      const actionEventData = JsonEx.makeDeepCopy($actionMap.events[eventId]);
      actionEventData.x = caster.getX();
      actionEventData.y = caster.getY();
      actionEventData.isAction = true;
      actionEventData.id += 1000;

      this.addMapActionToMap(actionEventData, action);
      this.addActionEvent(action);
    }
  };

  /**
   * Determines the directions of all projectiles.
   * @param {number} direction The base direction the battler is facing.
   * @param {number} projectile The pattern/number of projectiles to generate directions for.
   * @returns {number[]} The collection of directions to fire projectiles off in.
   */
  determineActionDirections(facing, projectile) {
    const directions = [];
    switch (projectile) {
      case 1:
        directions.push(facing);
        break;
      case 2:
        directions.push(this.rotate45degrees(facing, true));
        directions.push(this.rotate45degrees(facing, false));
        break;
      case 3:
        directions.push(facing);
        directions.push(this.rotate45degrees(facing, true));
        directions.push(this.rotate45degrees(facing, false));
        break;
      case 4:
        directions.push(facing);
        directions.push(this.rotate90degrees(facing, true));
        directions.push(this.rotate90degrees(facing, false));
        directions.push(this.rotate180degrees(facing));
        break;
      case 8:
        directions.push(
          1, 3, 7, 9,   // diagonal
          2, 4, 6, 8);  // cardinal
        break;
    }

    return directions;
  };

  /**
   * Rotates the direction provided 45 degrees.
   * @param {number} direction The base direction to rotate from.
   * @param {boolean} clockwise True if rotating clockwise, false otherwise.
   * @returns {number} The direction after rotation.
   */
  rotate45degrees(direction, clockwise) {
    let newDirection = direction;
    switch (direction) {
      case J.ABS.Directions.UP:
        newDirection = clockwise ? 9 : 7;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = clockwise ? 3 : 9;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = clockwise ? 7 : 1;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = clockwise ? 1 : 3;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = clockwise ? 4 : 2;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = clockwise ? 2 : 6;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = clockwise ? 8 : 4;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = clockwise ? 6 : 8;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  };

  /**
   * Rotates the direction provided 90 degrees.
   * @param {number} direction The base direction to rotate from.
   * @param {boolean} clockwise True if rotating clockwise, false otherwise.
   * @returns {number} The direction after rotation.
   */
  rotate90degrees(direction, clockwise) {
    let newDirection = direction;
    switch (direction) {
      case J.ABS.Directions.UP:
        newDirection = clockwise ? 6 : 4;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = clockwise ? 2 : 8;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = clockwise ? 8 : 2;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = clockwise ? 4 : 6;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = clockwise ? 7 : 3;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = clockwise ? 1 : 9;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = clockwise ? 9 : 1;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = clockwise ? 3 : 7;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }
    
    return newDirection;
  };

  /**
   * Rotates the direction provided 180 degrees.
   * @param {number} direction The base direction to rotate from.
   * @param {boolean} clockwise True if rotating clockwise, false otherwise.
   * @returns {number} The direction after rotation.
   */
  rotate180degrees(direction) {
    let newDirection = direction;
    switch (direction) {
      case J.ABS.Directions.UP:
        newDirection = 2;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = 4;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = 6;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = 8;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = 9;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = 7;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = 3;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = 1;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }
    
    return newDirection;
  };

  /**
   * Applies the cooldowns to the battler.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  applyCooldownCounters(caster, action) {
    const cooldownType = action.getCooldownType();
    const cooldownValue = action.getCooldown();
    if (!caster.isPlayer()) {
      caster.modCooldownCounter(cooldownType, cooldownValue);
    } else {
      const skill = action.getBaseSkill();
      if (skill._j.uniqueCooldown || this.isBasicAttack(cooldownType)) {
        // if the skill is unique, only apply the cooldown to the slot assigned.
        //caster.modCooldownCounter(cooldownType, cooldownValue);
        caster.setCooldownCounter(cooldownType, cooldownValue);
        return;
      }

      const equippedSkills = caster.getBattler().getAllEquippedSkills();
      Object.keys(equippedSkills).forEach(key => {
        const equippedSkillId = equippedSkills[key].id;
        if (equippedSkillId == skill.id) {
          caster.setCooldownCounter(key, cooldownValue);
        }
      });
    }
  };

  /**
   * Checks whether or not this skill is a basic attack.
   * @param {string} cooldownKey The cooldown key to check.
   * @returns {boolean} True if the skill is a basic attack, false otherwise.
   */
  isBasicAttack(cooldownKey) {
    const isMainHand = cooldownKey === Game_Actor.JABS_MAINHAND;
    const isOffHand = cooldownKey === Game_Actor.JABS_OFFHAND;
    const isBasicAttack = (isMainHand || isOffHand);
    return isBasicAttack;
  };

  /**
   * Pays the costs for the skill (mp/tp default) if applicable.
   * @param {JABS_Battler} caster The battler casting the action.
   * @param {JABS_Action} action The action(skill) to pay the cost for.
   */
  paySkillCosts(caster, action) {
    const battler = caster.getBattler();
    const skill = action.getBaseSkill();
    battler.paySkillCost(skill);
  };

  /**
   * Creates a new `JABS_Action` and adds it to the map and tracking.
   * @param {object} actionEventData An object representing the data of a `Game_Event`.
   * @param {number} direction The direction this action should be facing.
   * @param {JABS_Action} action An object representing the data of a `Game_Event`.
   */
  addMapActionToMap(actionEventData, action) {
    // add the data to the datamap list of events
    $dataMap.events[$dataMap.events.length] = actionEventData;
    const newIndex = $dataMap.events.length - 1;

    // create the event by hand with this new data
    const actionEventSprite = new Game_Event(
      J.ABS.DefaultValues.ActionMap,
      newIndex);
    
    // on rare occasions, the timing of adding an action to the map coincides
    // with the removal of the caster which breaks the ordering of the events.
    // the result will throw an error and break. This should catch that, and if
    // not, then the try-catch will.
    if (!actionEventData || !actionEventData.pages.length) {
      console.error("that rare error occurred!");
      return;
    }

    const pageIndex = actionEventSprite.findProperPageIndex();
    const { characterIndex, characterName } = actionEventData.pages[pageIndex].image;

    try {
      actionEventSprite.setActionSpriteNeedsAdding();
      actionEventSprite._eventId = actionEventData.id;
      actionEventSprite._characterName = characterName;
      actionEventSprite._characterIndex = characterIndex;
      const pageData = actionEventData.pages[pageIndex];
      actionEventSprite.setMoveFrequency(pageData.moveFrequency);
      actionEventSprite.setMoveRoute(pageData.moveRoute);
      actionEventSprite.setDirection(action.direction);
      actionEventSprite.setInitialDirection(action.direction);
      actionEventSprite.setMapActionData(action);
  
      // overwrites the "start" of the event for this event to be nothing.
      // this prevents the player from accidentally interacting with the
      // sword swing or whatever is generated by the action.
      actionEventSprite.start = () => false;
  
      action.setActionSprite(actionEventSprite);
      this.requestActionRendering = true;
      $gameMap.addEvent(actionEventSprite);
    } catch (err) {
      console.error(err);
      console.error("The action event sprite: ", actionEventSprite);
    }
  };

  /**
   * Adds the loot to the map.
   * @param {JABS_Battler} target The battler dropped this loot.
   * @param {object} item The loot's raw data object.
   */
  addLootDropToMap(target, item) {
    // create 
    const lootEventData = JsonEx.makeDeepCopy($actionMap.events[1]);
    lootEventData.x = target.getX();
    lootEventData.y = target.getY();

    // add the loot event to the datamap list of events.
    $dataMap.events[$dataMap.events.length] = lootEventData;

    // create the loot event by hand with this new data.
    const jabsLootData = new JABS_LootDrop(item);
    const eventId = $dataMap.events.length - 1;
    const lootEvent = new Game_Event($gameMap.mapId(), eventId);
    lootEvent.setLootNeedsAdding();
    lootEvent.setLootData(jabsLootData);

    // add loot event to map.
    this.requestLootRendering = true;
    $gameMap.addEvent(lootEvent);
  };

  /**
   * Applies an action against a designated target battler.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyPrimaryBattleEffects(action, target) {
    const targetSprite = target.getCharacter();
    const targetUuid = target.getUuid();
    const skill = action.getBaseSkill();
    const gameAction = action.getAction();
    const casterMapBattler = action.getCaster();

    // manually perform this application.
    const result = this.executeSkillEffects(action, target);

    // determine animation id based on skill and user.
    const animationId = this.getAnimationId(skill, casterMapBattler);

    // apply effects that require landing a successful hit.
    if (result.isHit() || result.parried) {
      // apply the animation against the target's map character.
      //const isAnimating = action.getAnimating(targetUuid);
      //if (!isAnimating) {
      targetSprite.requestAnimation(animationId, result.parried);
      //  action.setAnimating(targetUuid, true);
      //}

      // if freecombo-ing, then we already checked for combo when executing the action.
      if (!skill._j.freeCombo) {
        this.checkComboSequence(casterMapBattler, action);
      }

      this.checkKnockback(action, target);
      this.triggerAlert(casterMapBattler, target);
    }

    // checks for retaliation from the target.
    this.checkRetaliate(action, target);

    // generate log for this action.
    this.createAttackLog(action, skill, result, casterMapBattler, target);

    // generate the text popup for this action.
    const damagePop = this.configureDamagePop(gameAction, skill, casterMapBattler, target);
    targetSprite.addTextPop(damagePop);
    targetSprite.setRequestTextPop();
  };

  /**
   * Attempts to execute the skill effects of this action against the target.
   * @param {JABS_Action} action The action being executed.
   * @param {JABS_Battler} target The target to apply skill effects against.
   * @returns {Game_ActionResult}
   */
  executeSkillEffects(action, target) {
    const caster = action.getCaster();
    const targetBattler = target.getBattler();
    const gameAction = action.getAction();
    const skill = action.getBaseSkill();
    let unparryable = false;
    if (skill._j.ignoreParry === -1) {
      unparryable = true;
    }
    const isParried = unparryable
      ? false // parry is cancelled because the skill ignores it.
      : this.checkParry(caster, target);
    if (!unparryable && isParried) {
      const result = targetBattler.result();
      result.clear();
      result.parried = true;
      return result;
    }

    gameAction.apply(targetBattler);
    const result = targetBattler.result();
    return result;
  };

  /**
   * Forces the target hit to be knocked back.
   * @param {JABS_Action} action The action potentially knocking the target back.
   * @param {JABS_Battler} target The map battler to potentially knockback.
   */
  checkKnockback(action, target) {
    // don't knockback if already being knocked back.
    const targetSprite = target.getCharacter();
    if (targetSprite.isJumping())
      return;

    // get the knockback resist for this target.
    const targetReferenceData = target.getReferenceData();
    const targetMeta = targetReferenceData.meta;
    let knockbackResist = 1.00;
    if (targetMeta && targetMeta[J.ABS.Notetags.KnockbackResist]) {
      let metaResist = parseInt(targetMeta[J.ABS.Notetags.KnockbackResist]);
      knockbackResist = (100 - metaResist) / 100;
    }

    // don't even knock them up or around at all, they are immune to knockback.
    if (knockbackResist <= 0) {
      return;
    }

    // get the knockback value from the skill if applicable.
    const skill = action.getBaseSkill();
    let knockback = skill._j.knockback;
    if (knockback == null)
      return;
    knockback *= knockbackResist;

    // if the knockback is 0, just hop in place.
    if (knockback == 0) {
      targetSprite.jump(0, 0);
      return;
    }

    // calculate where the knockback would send the target.
    const actionSprite = action.getActionSprite();
    const knockbackDirection = actionSprite.direction();
    let xPlus = 0;
    let yPlus = 0;
    switch (knockbackDirection) {
      case J.ABS.Directions.UP:
        yPlus -= Math.ceil(knockback);
        break;
      case J.ABS.Directions.DOWN:
        yPlus += Math.ceil(knockback);
        break;
      case J.ABS.Directions.LEFT:
        xPlus -= Math.ceil(knockback);
        break;
      case J.ABS.Directions.RIGHT:
        xPlus += Math.ceil(knockback);
        break;
    }

    const maxX = targetSprite.x + xPlus;
    const maxY = targetSprite.y + yPlus;
    let realX = targetSprite.x;
    let realY = targetSprite.y;
    let canPass = true;

    // dynamically test each square to ensure you don't cross any unpassable tiles.
    while (canPass && (realX != maxX || realY != maxY)) {
      switch (knockbackDirection) {
        case J.ABS.Directions.UP:
          realY--;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realY++;
          break;
        case J.ABS.Directions.DOWN:
          realY++;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realY--;
          break;
        case J.ABS.Directions.LEFT:
          realX--;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realX++;
          break;
        case J.ABS.Directions.RIGHT:
          realX++;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realX--;
          break;
        default:
          canPass = false;
          break;
      }
    }

    // execute the jump to the new destination.
    targetSprite.jump(realX - targetSprite.x, realY - targetSprite.y);
  };

  /**
   * Determines if there is a combo action that should succeed this skill.
   * @param {JABS_Battler} caster The battler that casted this skill.
   * @param {JABS_Action} action The action that contains the skill to check for combos.
   */
  checkComboSequence(caster, action) {
    const skill = action.getBaseSkill();
    if (!skill._j.combo) {
      if (!action.getCooldownChecked()) {
        // if the cooldown has not yet been applied, apply it.
        caster.setCooldownCounter(action.getCooldownType(), action.getCooldown());
        action.setCooldownChecked();
      }
      return;
    } else {
      const combo = skill._j.combo;
      if (combo) {
        const cooldownKey = action.getCooldownType();
        if (!(caster.getComboNextActionId(cooldownKey) == combo[0])) {
          caster.modCooldownCounter(cooldownKey, combo[1]);
        }

        caster.setComboFrames(cooldownKey, combo[1]);
        caster.setComboNextActionId(cooldownKey, combo[0]);
      }
    }
  };

  /**
   * Calculates whether or not the attack was parried.
   * @param {JABS_Battler} action The action being executed.
   * @param {JABS_Battler} target The target the action is against.
   */
  checkParry(caster, target) {
    const isFacing = caster.isFacingTarget(target.getCharacter());
    // cannot parry if not facing target.
    if (!isFacing) return false;

    const casterBattler = caster.getBattler();
    const targetBattler = target.getBattler();

    // gain bonus chance to bypass parry.
    const bonusHit = casterBattler.hit * 0.1;
    const hit = (Math.random() + bonusHit).toFixed(3);
    const parryRate = (targetBattler.grd - 1).toFixed(3);
    const isParried = hit < parryRate;
    return isParried;
  };

  /**
   * If the battler is hit from outside of it's engagement range,
   * trigger the alert state.
   * @param {JABS_Battler} attacker The battler triggering the alert.
   * @param {JABS_Battler} target The battler entering the alert state.
   */
  triggerAlert(attacker, target) {
    // check if the target can actually be alerted first.
    if (!this.canBeAlerted(target))
      return;

    // alert the target!
    target.showBalloon(J.ABS.Balloons.Question);
    target.setAlertedCoordinates(attacker.getX(), attacker.getY());
    const alertDuration = target.getAlertDuration();
    target.setAlertedCounter(alertDuration);

    // a brief pause the first time entering the alerted state.
    if (!target.isAlerted()) {
      target.setWaitCountdown(45);
    }
  };

  /**
   * Checks if the battler can even be alerted in the first place.
   * @param {JABS_Battler} battler The battler to be alerted.
   * @return {boolean} True if they can be alerted, false otherwise.
   */
  canBeAlerted(battler) {
    // cannot alert the player.
    if (battler.isPlayer())
      return false;

    // cannot alert battlers that are already engaged.
    if (battler.isEngaged())
      return false;

    // cannot alert inanimate objects.
    if (battler.isInanimate())
      return false;

    return true;
  };

  /**
   * Executes a retalation if necessary on receiving a hit.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} battler The target having the action applied against.
   */
  checkRetaliate(action, battler) {
    // do not retaliate against other battler's retaliations.
    if (action.isRetaliation()) return;

    if (battler.isPlayer()) {
      // handle player retaliations.
      this.handlePlayerRetaliation(battler);
    } else {
      // handle non-player retaliations.
      this.handleNonPlayerRetaliation(battler);
    }
  };

  /**
   * Executes any retaliation the player may have when receiving a hit while guarding/parrying.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} battler The player's `JABS_Battler`.
   */
  handlePlayerRetaliation(battler) {
    const result = battler.getBattler().result();
    const needsCounterParry = result.preciseParried && battler.counterParry();
    const needsCounterGuard = !needsCounterParry && battler.guarding() && battler.counterGuard();

    if (needsCounterParry) {
      this.forceMapAction(battler, battler.counterParry(), true);
    }

    if (needsCounterGuard) {
      this.forceMapAction(battler, battler.counterGuard(), true);
    }
  };

  /**
   * Executes any retaliation the enemy may have when receiving a hit at any time.
   * @param {JABS_Battler} enemy The enemy's `JABS_Battler`.
   */
  handleNonPlayerRetaliation(enemy) {
    // only work with enemies- for now.
    if (!enemy.isEnemy()) return;

    // assumes enemy battler is enemy.
    const enemyBattler = enemy.getBattler();
    const needsRetaliation = enemyBattler.retaliationSkillId();
    if (needsRetaliation) {
      this.forceMapAction(enemy, needsRetaliation);
    }
  };

  /**
   * Generates a log in the `Map_TextLog` if applicable.
   * @param {JABS_Action} action The action affecting the target.
   * @param {object} skill The database object of the skill executed.
   * @param {Game_ActionResult} result The result of the executed action.
   * @param {JABS_Battler} caster The `JABS_Battler` who used the action.
   * @param {JABS_Battler} target The `JABS_Battler` who was the target of the action.
   */
  createAttackLog(action, skill, result, caster, target) {
    // if not enabled, skip this.
    if (!J.TextLog.Metadata.Enabled) return;

    const skillName = skill.name;
    const casterName = caster.getReferenceData().name;
    const targetName = target.getReferenceData().name;

    let message = "";
    if (result.parried) {
      const preciseParriedPrefix = result.preciseParried ? "precise-" : "";
      const preciseParriedSuffix = result.preciseParried ? " with finesse!" : ".";
      message = `${targetName} ${preciseParriedPrefix}parried ${casterName}'s ${skillName}${preciseParriedSuffix}`;
    } else if (result.evaded) {
      message = `${targetName} dodged ${casterName}'s ${skillName}.`;
    } else {
      const roundedDamage = Math.round(result.hpDamage);
      const damageReduction = Math.round(result.reduced);
      let reducedAmount = "";
      if (damageReduction) {
        reducedAmount = `(${parseInt(damageReduction)})`;
      }

      if (result.critical) {
        message = `${casterName} landed a critical ${skillName} on ${targetName} for ${roundedDamage}${reducedAmount}!`;
      } else {
        message = `${casterName} hit ${targetName} with ${skillName} for ${roundedDamage}${reducedAmount}.`;
      }
    }

    if (action.isRetaliation()) {
      const retaliationLog = new Map_TextLog(`${casterName} retaliated!`, -1);
      $gameTextLog.addLog(retaliationLog);
    }

    const log = new Map_TextLog(message, -1);
    $gameTextLog.addLog(log);
  };

  /**
   * Configures this damage popup based on the action result against the target.
   * @param {Game_Action} gameAction The action this popup is based on.
   * @param {object} skill The skill reference data itself.
   * @param {JABS_Battler} caster The battler who casted this skill.
   * @param {JABS_Battler} target The target battler the popup is placed on.
   */
  configureDamagePop(gameAction, skill, caster, target) {
    const targetBattler = target.getBattler();
    const actionResult = targetBattler.result();
    const elementalRate = gameAction.calcElementRate(targetBattler);
    const elementalIcon = this.determineElementalIcon(skill, caster);
    const iconId = actionResult.parried
      ? 128
      : elementalIcon; // TODO: decide on icons.
    const textColor = 0; // TODO: decide on text colors based on dmg type?
    const popup = new JABS_TextPop(
      actionResult,
      iconId,
      textColor,
      elementalRate < 1,
      elementalRate > 1,
      "damage");
    return popup;
  };

  /**
   * Translates a skill's elemental affiliation into the icon id representing it.
   * @param {number} skill The skill possessing the elemental affiliation.
   * @returns {number} The icon index to use for this popup.
   */
  determineElementalIcon(skill, caster) {
    // if not using the elemental icons, don't return one.
    if (!J.ABS.Metadata.UseElementalIcons) return 0;

    let elementId = skill.damage.elementId;

    // if the battler is an actor and the action is based on the weapon's elements
    // probe the weapon's traits for its actual element.
    if (elementId == -1 && caster.isActor()) {
      const attackElements = caster.getBattler().attackElements();
      if (attackElements.length) {
        // we pick only the first element!
        elementId = attackElements[0];
      } else {
        elementId = 0;
      }
    }

    // if its an item, then use the item's icon index.
    if (DataManager.isItem(skill)) {
      const itemIconIndex = $dataItems[skill.id].iconIndex;
      return itemIconIndex;
    }

    const iconData = J.ABS.Metadata.ElementalIcons;
    const elementalIcon = iconData.find(data => data.element === elementId);
    return elementalIcon ? elementalIcon.icon : 0;
  };

  /**
   * Checks this `JABS_Action` against all map battlers to determine collision.
   * If there is a collision, then a `Game_Action` is applied.
   * @param {JABS_Action} action The `JABS_Action` to check against all battlers.
   * @returns {JABS_Battler[]} A collection of `JABS_Battler`s that this action hit.
   */
  getCollisionTargets(action) {
    const actionSprite = action.getActionSprite();
    const range = action.getRange();
    const shape = action.getShape();
    const casterJabsBattler = action.getCaster();
    const caster = casterJabsBattler.getCharacter();
    const battlers = $gameMap.getBattlers();
    battlers.push(this.getPlayerMapBattler());
    let hitOne = false;
    let targetsHit = [];

    const allyTarget = casterJabsBattler.getAllyTarget();
    if (allyTarget && action.getAction().isForOne()) {
      if (allyTarget.canActionConnect() && allyTarget.isWithinScope(action, allyTarget, hitOne)) {
        targetsHit.push(allyTarget);
        return targetsHit;
      }
    }

    battlers.forEach(battler => {
      // this battler is untargetable.
      if (!battler.canActionConnect()) return;
      
      // the action's scopes don't meet the criteria for this target.
      if (!battler.isWithinScope(action, battler, hitOne)) return;

      // if the action is a direct-targeting action,
      // then only check distance between the caster and target.
      if (action.isDirectAction()) {
        const maxDistance = action.getProximity();
        const distance = casterJabsBattler.distanceToDesignatedTarget(battler);
        if (distance <= maxDistance) {
          targetsHit.push(battler);
          hitOne = true;
        }
        
      // if the action is a standard projectile-based action,
      // then check to see if this battler is now in range.
      } else {
        const sprite = battler.getCharacter();
        let dx = actionSprite.x - sprite.x;
        let dy = actionSprite.y - sprite.y;
        dx = dx >= 0 ? Math.max(dx, 0) : Math.min(dx, 0);
        dy = dy >= 0 ? Math.max(dy, 0) : Math.min(dy, 0);
        const result = this.isTargetWithinRange(caster.direction(), dx, dy, range, shape);
        if (result) {
          targetsHit.push(battler);
          hitOne = true;
        }
      }
    });

    return targetsHit;
  };

  /**
   * Determines collision of a given shape vs coordinates.
   * @param {Game_Character} caster The caster of this action.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {string} shape The collision formula based on shape.
   */
  isTargetWithinRange(facing, dx, dy, range, shape) {
    let hit = false;

    switch (shape) {
      case J.Base.Shapes.Rhombus:
        hit = this.collisionRhombus(Math.abs(dx), Math.abs(dy), range);
        break;
      case J.Base.Shapes.Square:
        hit = this.collisionSquare(Math.abs(dx), Math.abs(dy), range);
        break;
      case J.Base.Shapes.FrontSquare:
        hit = this.collisionFrontSquare(dx, dy, range, facing);
        break;
      case J.Base.Shapes.Line:
        hit = this.collisionLine(dx, dy, range, facing);
        break;
      case J.Base.Shapes.Arc:
        hit = this.collisionArc(dx, dy, range, facing);
        break;
      case J.Base.Shapes.Wall:
        hit = this.collisionWall(dx, dy, range, facing);
        break;
      case J.Base.Shapes.Cross:
        hit = this.collisionCross(dx, dy, range);
        break;
    }

    return hit;
  };

  /**
   * A rhombus-shaped (aka diamond) collision.
   * Range determines the size of the rhombus surrounding the action.
   * This is typically used for AOE around the caster type skills, but could also
   * be used for very large objects, or as an explosion radius.
   * @param {number} absDx The absolute value of the distance between target and actions' `X` value.
   * @param {number} absDy The absolute value of the distance between target and actions' `Y` value.
   * @param {number} range How big the collision shape is.
   */
  collisionRhombus(absDx, absDy, range) {
    const result = (absDx + absDy) <= range;
    return result;
  };

  /**
   * A square-shaped collision.
   * Range determines the size of the square around the action.
   * The use cases for this are similar to that of rhombus, but instead of a diamond-shaped
   * hitbox, its a plain ol' square.
   * @param {number} absDx The absolute value of the distance between target and actions' `X` value.
   * @param {number} absDy The absolute value of the distance between target and actions' `Y` value.
   * @param {number} range How big the collision square is.
   */
  collisionSquare(absDx, absDy, range) {
    const inHorzRange = absDx <= range;
    const inVertRange = absDy <= range;
    const result = inHorzRange && inVertRange;
    return result;
  };

  /**
   * A square-shaped collision infront of the caster.
   * Range determines the size of the square infront of the action.
   * For when you want a square that doesn't affect targets behind the action. It would be
   * more accurate to call this a "half-square", really.
   * @param {number} dx The distance between target and actions' `X` value.
   * @param {number} dy The distance between target and actions' `Y` value.
   * @param {number} range How big the collision square is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionFrontSquare(dx, dy, range, facing) {
    const inHorzRange = Math.abs(dx) <= range;
    const inVertRange = Math.abs(dy) <= range;
    let result = false;
    let isFacing = true;

    switch (facing) {
      case J.ABS.Directions.DOWN:
        isFacing = dy <= 0;
        break;
      case J.ABS.Directions.LEFT:
        isFacing = dx >= 0;
        break;
      case J.ABS.Directions.RIGHT:
        isFacing = dx <= 0;
        break;
      case J.ABS.Directions.UP:
        isFacing = dy >= 0;
        break;
    }

    result = inHorzRange && inVertRange && isFacing;
    return result;
  };

  /**
   * A line-shaped collision.
   * Range the distance of the of the line.
   * This is typically used for spears and other stabby attacks.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionLine(dx, dy, range, facing) {
    let result = false;
    switch (facing) {
      case J.ABS.Directions.DOWN:
        result = (dx == 0) && (dy >= 0) && (dy <= range);
        break;
      case J.ABS.Directions.UP:
        result = (dx == 0) && (dy <= 0) && (dy >= -range);
        break;
      case J.ABS.Directions.RIGHT:
        result = (dy == 0) && (dx >= 0) && (dx <= range);
        break;
      case J.ABS.Directions.LEFT:
        result = (dy == 0) && (dx <= 0) && (dx >= -range);
        break;
    }

    return result;
  };

  /**
   * An arc-shaped collision.
   * Range determines the reach and area of arc.
   * This is what could be considered a standard 180 degree slash-shape, the basic attack.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionArc(dx, dy, range, facing) {
    const inRange = (Math.abs(dx) + Math.abs(dy)) <= range;
    let isFacing = true;
    let result = false;
    switch (facing) {
      case J.ABS.Directions.DOWN:
        isFacing = dy <= 0;
        break;
      case J.ABS.Directions.UP:
        isFacing = dy >= 0;
        break;
      case J.ABS.Directions.RIGHT:
        isFacing = dx <= 0;
        break;
      case J.ABS.Directions.LEFT:
        isFacing = dx >= 0;
        break;
    }

    result = inRange && isFacing;
    return result;
  };

  /**
   * A wall-shaped collision.
   * Range determines how wide the wall is.
   * Typically used for hitting targets to the side of the caster.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionWall(dx, dy, range, facing) {
    let result = false;
    switch (facing) {
      case J.ABS.Directions.DOWN:
      case J.ABS.Directions.UP:
        result = Math.abs(dx) <= range && dy == 0;
        break;
      case J.ABS.Directions.RIGHT:
      case J.ABS.Directions.LEFT:
        result = Math.abs(dy) <= range && dx == 0;
        break;
    }

    return result;
  };

  /**
   * A cross shaped collision.
   * Range determines how far the cross reaches from the action.
   * Think bomb explosions from the game bomberman.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   */
  collisionCross(dx, dy, range) {
    const inVertRange = Math.abs(dy) <= range && dx == 0;
    const inHorzRange = Math.abs(dx) <= range && dy == 0;
    const result = inVertRange || inHorzRange;
    return result;
  };

  //#region defeated target aftermath
  /**
   * Handles the defeat of a given `Game_Battler` on the map.
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  handleDefeatedTarget(target, caster) {
    switch (true) {
      case (target.isPlayer()):
        this.handleDefeatedPlayer();
        return;
      case (target.isActor() && !target.isPlayer()):
        this.handleDefeatedAlly();
        return;
      case (target.isEnemy()):
        this.handleDefeatedEnemy(target, caster);
        break;
      default:
        break;
    }
  };

  /**
   * Handles the defeat of the battler the player is currently controlling.
   */
  handleDefeatedPlayer() {
    console.log("player has died.");
    this.rotatePartyMembers();
  };

  /**
   * Handles a non-player ally that was defeated.
   */
  handleDefeatedAlly() {
    console.log("if non-player ally defeated, handle this!");
  };

  /**
   * Handles an enemy that was defeated, including dolling out exp/gold and loot drops.
   * @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
   * @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
   */
  handleDefeatedEnemy(defeatedTarget, caster) {
    // remove all leader/follower data the battler may have.
    defeatedTarget.clearFollowers();
    defeatedTarget.clearLeader();

    // perform the death cry if they are dunzo.
    const targetCharacter = defeatedTarget.getCharacter();
    if (!defeatedTarget.isInanimate()) {
      SoundManager.playEnemyCollapse();
    }

    // if the defeated target is an enemy, check for death controls.
    if (defeatedTarget.hasEventActions()) {
      targetCharacter.start();
    }

    // if the caster is player/actor, gain aftermath.
    if (caster && caster.isActor()) {
      const targetBattler = defeatedTarget.getBattler();
      this.gainBasicRewards(targetBattler, caster);
      this.createLootDrops(defeatedTarget, caster);
    }

    // remove the target's character from the map.
    defeatedTarget.setDying(true);
  };

  /**
   * Grants experience/gold/loot rewards to the battler that defeated the target.
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  gainBasicRewards(enemy, actor) {
    let experience = enemy.exp();
    let gold = enemy.gold();
    const userSprite = actor.getCharacter();

    const levelMultiplier = this.getRewardScalingMultiplier(enemy, actor);
    experience = Math.ceil(experience * levelMultiplier);
    gold = Math.ceil(gold * levelMultiplier);

    this.gainExperienceReward(experience, userSprite);
    this.gainGoldReward(gold, userSprite);
    this.createRewardsLog(experience, gold, actor);
  };

  /**
   * Gets the multiplier based on difference in level between attacker and
   * target to determine if the battle was "too easy" or "very hard", resulting
   * in reduced or increased numeric rewards (excludes loot drops).
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  getRewardScalingMultiplier(enemy, actor) {
    let multiplier = 1.0;
    if (J.LevelScaling && J.LevelScaling.Metadata.Enabled) {
      multiplier = J.LevelScaling.Utilities.determineScalingMultiplier(
        actor.getBattler().level,
        enemy.level);
    }

    return multiplier;
  };

  /**
   * Gains experience from battle rewards.
   * @param {number} experience The experience to be gained as a reward.
   * @param {Game_Character} casterSprite The character who defeated the target.
   */
  gainExperienceReward(experience, casterSprite) {
    // don't do anything if the enemy didn't grant any experience.
    if (!experience) return;

    const activeParty = $gameParty.battleMembers();
    activeParty.forEach(member => member.gainExp(experience));
    const expPop = this.configureExperiencePop(experience);
    casterSprite.addTextPop(expPop);
    casterSprite.setRequestTextPop();
  };

  /**
   * Creates the text pop of the experienced gained.
   * @param {number} exp The amount of experience gained.
   */
  configureExperiencePop(exp) {
    const iconId = 125;
    const textColor = 6;
    const popup = new JABS_TextPop(
      null,
      iconId,
      textColor,
      null,
      null,
      "exp",
      exp);
    return popup;
  };

  /**
   * Gains gold from battle rewards.
   * @param {number} gold The gold to be gained as a reward.
   * @param {Game_Character} casterSprite The character who defeated the target.
   */
  gainGoldReward(gold, casterSprite) {
    // don't do anything if the enemy didn't grant any gold.
    if (!gold) return;

    $gameParty.gainGold(gold);
    const goldPop = this.configureGoldPop(gold);
    casterSprite.addTextPop(goldPop);
    casterSprite.setRequestTextPop();
  };

  /**
   * Creates the text pop of the gold gained.
   * @param {number} gold The amount of gold gained.
   */
  configureGoldPop(gold) {
    const iconId = 314;
    const textColor = 14;
    const popup = new JABS_TextPop(
      null,
      iconId,
      textColor,
      null,
      null,
      "gold",
      gold);
    return popup;
  };

  /**
   * Create a log entry for both experience earned and gold dropped.
   * @param {number} experience The amount of experience gained.
   * @param {number} gold The gold to be gained as a reward.
   * @param {JABS_Battler} caster The ally gaining the experience and gold.
   */
  createRewardsLog(experience, gold, caster) {
    if (!J.TextLog.Metadata.Enabled || !J.TextLog.Metadata.Active) return;

    if (experience != 0) {
      const casterData = caster.getReferenceData();
      const expMessage = `${casterData.name} gained ${experience} experience.`;
      const expLog = new Map_TextLog(expMessage, -1);
      $gameTextLog.addLog(expLog);  
    }

    if (gold != 0) {
      const goldMessage = `The party gained ${gold} G.`;
      const goldLog = new Map_TextLog(goldMessage, -1);
      $gameTextLog.addLog(goldLog);
    }
  };

  /**
   * Create all drops for a defeated enemy and gain them.
   * @param {JABS_Battler} target The enemy dropping the loot.
   * @param {JABS_Battler} caster The ally that defeated the enemy.
   */
  createLootDrops(target, caster) {
    // actors don't drop loot.
    if (target.isActor()) return;

    // if we have no drops, don't bother.
    const items = target.getBattler().makeDropItems();
    if (items.length == 0) return;

    items.forEach(item => this.addLootDropToMap(target, item));
  };

  /**
   * Creates a log for an item earned as a loot drop from an enemy.
   * @param {JABS_Battler} caster The ally who defeated the target.
   * @param {object} item The reference data for the item loot that was picked up.
   */
  createLootLog(item) {
    if (!J.TextLog.Metadata.Enabled || !J.TextLog.Metadata.Active) return;

    // the player is always going to be the one collecting the loot- for now.
    const casterName = this.getPlayerMapBattler().getReferenceData().name;
    const lootMessage = `${casterName} picked up the ${item.name}.`;
    const lootLog = new Map_TextLog(lootMessage, -1);
    $gameTextLog.addLog(lootLog);
  };

  /**
   * Creates the text pop of the gold gained.
   * @param {object} item The reference data for the item loot that was picked up.
   */
  configureItemPop(item) {
    const name = item.name;
    const iconId = item.iconIndex;
    const textColor = 1; // TODO: implement item rarity color here?
    const popup = new JABS_TextPop(
      null,
      iconId,
      textColor,
      null,
      null,
      "item",
      name);
    return popup;
  };

  /**
   * Handles a level up for the leader while on the map.
   */
  leaderLevelUp() {
    const player = this.getPlayerMapBattler();
    const character = player.getCharacter();

    this.createLevelUpPop(character);
    this.createLevelUpLog(player);
    this.playLevelUpAnimation(character);
  };

  /**
   * Creates a text pop of the level up.
   * @param {Game_Character} character The character to show the popup on.
   */
  createLevelUpPop(character) {
    const text = "LEVEL UP";
    const iconId = 249;
    const textColor = 24;
    const popup = new JABS_TextPop(
      null,
      iconId,
      textColor,
      null,
      null,
      "levelup",
      text);
    character.addTextPop(popup);
    character.setRequestTextPop();
  };

  /**
   * Creates a level up log for the player.
   * @param {JABS_Battler} player The player.
   */
  createLevelUpLog(player) {
    if (!J.TextLog.Metadata.Enabled || !J.TextLog.Metadata.Active) return;

    const leaderData = player.getReferenceData();
    const leaderName = leaderData.name;
    const leaderBattler = player.getBattler();
    const leaderLevel = leaderBattler.level;
    const levelupMessage = `${leaderName} has reached level ${leaderLevel}!`;
    const levelupLog = new Map_TextLog(levelupMessage, -1);
    $gameTextLog.addLog(levelupLog);
  };

  /**
   * Plays the level up animation on the character.
   * @param {Game_Character} character The player's `Game_Character`.
   */
  playLevelUpAnimation(character) {
    character.requestAnimation(49);
  };

  /**
   * Handles a skill being learned for the leader while on the map.
   * @param {object} skill The skill being learned.
   */
  leaderSkillLearn(skill) {
    const player = this.getPlayerMapBattler();
    const character = player.getCharacter();

    this.createSkillLearnPop(skill, character);
    this.createSkillLearnLog(skill, player);
  };

  /**
   * Creates a text pop of the skill being learned.
   * @param {object} skill The skill being learned.
   * @param {Game_Player} character The player's character.
   */
  createSkillLearnPop(skill, character) {
    const text = `${skill.name} learned!`;
    const iconId = skill.iconIndex;
    const textColor = 27;
    const popup = new JABS_TextPop(
      null,
      iconId,
      textColor,
      null,
      null,
      "skillLearn",
      text);
    character.addTextPop(popup);
    character.setRequestTextPop();
  };

  /**
   * Creates a skill learning log for the player.
   * @param {object} skill The skill being learned.
   * @param {JABS_Battler} character The player's `JABS_Battler`.
   */
  createSkillLearnLog(skill, player) {
    if (!J.TextLog.Metadata.Enabled || !J.TextLog.Metadata.Active) return;

    const leaderData = player.getReferenceData();
    const leaderName = leaderData.name;
    const skillName = skill.name;
    const skillLearnedMessage = `${leaderName} learned the skill [${skillName}]!`;
    const skillLearnLog = new Map_TextLog(skillLearnedMessage, -1);
    $gameTextLog.addLog(skillLearnLog);
  };
//#endregion defeated target aftermath
};

//#endregion

//#endregion New Game objects

//#region JABS objects
//#region JABS_AiManager
/**
 * This static class manages all ai-controlled `JABS_Battler`s. 
 * 
 * It orchestrates how Battlers interact with one another and the player.
 */
class JABS_AiManager {
  /**
   * The constructor is not designed to be called. 
   * This is a static class.
   * @constructor
   */
  constructor() { throw new Error("The JABS_AiManager is a static class."); };

  //#region JABS Ai Update Loop
  /**
   * Handles updating all the logic of the JABS engine.
   */
  static update() {
    // if there is a message up, an event running, or the ABS is paused, freeze!
    if (!this.canUpdate()) return;

    if ($gameMap.getBattlers()) {
      this.manageAi();
    }
  };

  /**
   * Whether or not the battle manager can process an update.
   * @return {boolean} True if the manager can update, false otherwise.
   */
  static canUpdate() {
    const isPaused = $gameBattleMap.absPause;
    const isMessageVisible = $gameMessage.isBusy();
    const isEventRunning = $gameMap.isEventRunning();
    const updateBlocked = isPaused || isMessageVisible || isEventRunning;
    return updateBlocked ? false : true;  
  };

  /**
   * Define whether or not the player is engaged in combat with any of the current battlers.
   */
  static manageAi() {
    const battlers = $gameMap.getBattlers();
    battlers.forEach(battler => {
      if (battler._team === 0) {
        // act accordingly to being on the same team.
      } else if (battler.isHidden() || battler.isInanimate()) {
        // do nothing, because you're hidden by switches or something!
      } else {
        // act as though against, default.
        this.executeAi(battler);
      }
    });  
  };

  /**
   * Executes the interactions specified by the combination of the AI mode bits.
   * @param {JABS_Battler} battler The battler executing on the AI mode.
   */
  static executeAi(battler) {
    // no AI is executed when waiting.
    if (battler.isWaiting()) return;

    if (battler.isEngaged()) {
      battler.setIdle(false);
      const phase = battler.getPhase();
      switch (phase) {
        case 1:
          this.aiPhase1(battler);
          break;
        case 2:
          this.aiPhase2(battler);
          break;
        case 3: 
          this.aiPhase3(battler);
          break;
        default:
          this.aiPhase0(battler);
          break;
      }

    } else {
      // the battler is not engaged, instead just idle about.
      this.aiPhase0(battler);
    }
  };
  //#endregion JABS Ai Update Loop

  //#region Phase 0 - Idle Phase
  /**
   * The zero-th phase, when the battler is not engaged- it's idle action.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase0(battler) {
    const character = battler.getCharacter();
    if (!battler.canIdle()) return;
  
    const isIdle = battler.isIdle();
    const isStopped = character.isStopping();
    const alerted = battler.isAlerted();
  
    if (isStopped) {
      if (alerted) {
        // what was that over there?
        this.seekForAlerter(battler);
        return;
      } else if (!isIdle && !battler.isHome()) {
        // im not home, need to go home.
        this.goHome(battler);
      } else if (isIdle) {
        // im home, do my idle things.
        this.moveIdly(battler);
      }
    }
  };

  /**
   * If a battler is idle but alerted, then they will try to seek out what
   * disturbed their idling.
   * @param {JABS_Battler} battler The battler seeking for the alerter.
   */
  static seekForAlerter(battler) {
    const coordinates = battler.getAlertedCoordinates();
    battler.smartMoveTowardCoordinates(coordinates[0], coordinates[1]);
  };

  /**
   * Progresses the battler towards their home coordinates.
   * @param {JABS_Battler} battler The battler going home.
   */
  static goHome(battler) {
    const event = battler.getCharacter();
    const nextDir = event.findDirectionTo(battler.getHomeX(), battler.getHomeY());
    event.moveStraight(nextDir);
    if (battler.isHome()) {
      battler.setIdle(true);
    }
  };

  /**
   * Executes whatever the idle action is for this battler.
   * @param {JABS_Battler} battler The battler moving idly.
   */
  static moveIdly(battler) {
    if (battler.isIdleActionReady()) {
      const rng = Math.randomInt(4) + 1;
      if (rng == 1) {
        const distanceToHome = battler.distanceToHome();
        const event = battler.getCharacter();
        if (JABS_Battler.isClose(distanceToHome)) {
          event.moveRandom();
        } else {
          const nextDir = event.findDiagonalDirectionTo(
            battler.getX(), battler.getY(),
            battler.getHomeX(), battler.getHomeY());
          event.moveStraight(nextDir);
        }
      } else {
        // do nothing;
      }
  
      battler.resetIdleAction();
    }
  };
  //#endregion Phase 0 - Idle Phase

  //#region Phase 1 - Pre-Action Movement Phase
  /**
   * This is the pre-phase, when the battler is waiting for their action
   * to be ready. This includes charging their `_actionCounter` and depending
   * on the AI, maybe doing more.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase1(battler) {
    // hold for prep time OR skip if the battler has a leader and wait for their commands.
    if (battler.isActionReady()) {
      battler.setPhase(2);
      return;
    }
  
    // AI to decide movement strategy...
    if (!battler._event.isMoving() && battler.canBattlerMove()) {
      this.decideAiPhase1Movement(battler);
      return;
    }
  };

  /**
   * Executes a movement based on phase and AI against it's target.
   * @param {JABS_Battler} battler The battler deciding it's phase 1 movement.
   */
  static decideAiPhase1Movement(battler) {
    const distance = battler.distanceToCurrentTarget();
    if (distance === null) return;
  
    const ai = (battler.getLeaderAiMode() !== null)
      ? battler.getLeaderAiMode()
      : battler.getAiMode();
  
    if (ai.basic) {
      // basic AI phase 1:
      // just kinda watches the target and doesn't move.
      battler.turnTowardTarget();
    } 
    
    if (ai.smart) {
      // smart AI phase 1:
      // will try to maintain a comfortable distance from the target.
      if (JABS_Battler.isClose(distance)) {
        battler.moveAwayFromTarget();
      } else if (JABS_Battler.isFar(distance)) {
        battler.smartMoveTowardTarget();
      }
      battler.turnTowardTarget();
    } 
    
    else if (ai.defensive) {
      // defensive AI phase 1:
      // will try to maintain a great distance from the target.
      // NOTE: does not combine with smart.
    }
  };
//#endregion Phase 1 - Pre-Action Movement Phase

  //#region Phase 2 - Execute Action Phase
  /**
   * This is the action-ready phase, when the battler has an action available to use.
   * @param {JABS_Battler} battler The `JABS_Battler`.
   */
  static aiPhase2(battler) {
    if (!battler.isActionDecided()) {
      this.decideAiPhase2Action(battler);
    }
  
    if (!battler._event.isMoving() && !battler.isInPosition() && battler.canBattlerMove()) {
      this.decideAiPhase2Movement(battler);
    }
  
    if (battler.isInPosition()) {
      const decidedAction = battler.getDecidedAction();
      battler.turnTowardTarget();
      $gameBattleMap.executeMapActions(battler, decidedAction);
      battler.setPhase(3);
    }
  };

  /**
   * The battler decides what action to execute.
   * The order of AI here is important, as some earlier and
   * less-prominent AI traits are overridden by the later
   * much more prominent AI traits.
   * @param {JABS_Battler} battler The `JABS_Battler` deciding the actions.
   */
  static decideAiPhase2Action(battler) {
    let ai = battler.getAiMode();
    const basicAttack = battler.getEnemyBasicAttack();
    let shouldUseBasicAttack = false;
    let chosenSkillId;
    let skillsToUse = battler.getSkillIdsFromEnemy();
    skillsToUse.sort();

    const { basic, smart, executor, defensive, reckless, healer, follower, leader } = ai;

    // only basic attacks alone, if controlled by a leader,
    // the follower will be told to execute skills based on
    // the leader's decision.
    if (follower) {
      shouldUseBasicAttack = true;

      // do nothing while waiting for leader to decide action.
      if (battler.hasLeader() && battler.getLeaderBattler() && battler.getLeaderBattler().isEngaged()) {
        if (battler.hasLeaderDecidedActions()) {
          // the leader told me what to do, now do it!
          const nextLeaderDecidedAction = battler.getNextLeaderDecidedAction();
          battler.showBalloon(J.ABS.Balloons.Check);
          chosenSkillId = nextLeaderDecidedAction;
          skillsToUse = nextLeaderDecidedAction;
          const canPerformAction = battler.canExecuteSkill(chosenSkillId);
          if (canPerformAction) {
            this.setupActionForNextPhase(battler, nextLeaderDecidedAction);
            return;  
          } else {
            // cannot perform the action due to state restrictions.
            battler.setDecidedAction(null);
            return;
          }
        } else {
          // hold on the leader's decision.
          battler.setDecidedAction(null);
          return;  
        }
      }
    }
    // if non-aggressive ai traits, then figure out some healing skills or something to use.
    if (healer || defensive) {
      skillsToUse = ai.decideSupportAction(battler, skillsToUse);

    // if aggressive ai traits, then figure out the skill to defeat the target with.
    } else if (smart || executor) {
      skillsToUse = ai.decideAttackAction(battler, skillsToUse);
    }

    // if basic but not reckless, then 50:50 chance of just basic attacking instead.
    if (basic && !reckless) {
      shouldUseBasicAttack = true;
    }
    
    // rewrite followers' action decisions that meet criteria.
    // acts intelligently in addition to controlling followers
    // into acting intelligently as well.
    if (leader) {
      const nearbyFollowers = $gameBattleMap.getNearbyFollowers(battler);
      nearbyFollowers.forEach(follower => {
        // leaders can't control other leaders' followers.
        if (follower.hasLeader() && follower.getLeader() !== battler.getUuid()) {
          return;
        }

        // assign the follower to this leader.
        if (!follower.hasLeader()) {
          follower.setLeader(battler.getUuid());
        }

        // decide the action of the follower for them.
        const followerAction = ai.decideActionForFollower(battler, follower);
        if (followerAction) {
          follower.setLeaderDecidedAction(followerAction);
        }
      });
    }

    // 50:50 chance of just basic attacking instead.
    let basicAttackInstead = false;
    if (shouldUseBasicAttack && !battler.hasLeader()) {
      basicAttackInstead = Math.randomInt(2) === 0 
        ? true
        : false;

      // followers ALWAYS basic attack instead.
      if (follower && !battler.hasLeader()) {
        basicAttackInstead = true;
      }
    }
  
    if (basicAttackInstead || skillsToUse.length === 0 || !skillsToUse) {
      // skip the formula, only basic attack.
      chosenSkillId = basicAttack[0];
    } else {
      if (Array.isArray(skillsToUse)) {
        if (skillsToUse.length === 1) {
          chosenSkillId = skillsToUse[0];
        } else {
          const randomId = Math.randomInt(skillsToUse.length);
          chosenSkillId = skillsToUse[randomId];
        }
      } else {
        // otherwise just set the skill to use to be this.
        chosenSkillId = skillsToUse;
      }
    }
  
    // if the battler cannot perform their decided skill, do nothing.
    if (!chosenSkillId || !battler.canExecuteSkill(chosenSkillId)) {
      battler.setDecidedAction(null);
      return;
    }

    this.setupActionForNextPhase(battler, chosenSkillId);
  };

  /**
   * Sets up the battler and the action in preparation for the next phase.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {number} chosenSkillId The id of the skill to perform the action for.
   */
  static setupActionForNextPhase(battler, chosenSkillId) {
    const mapActions = battler.createMapActionFromSkill(chosenSkillId);
    const cooldownName = `${mapActions[0].getBaseSkill().name}`;
    mapActions.forEach(action => action.setCooldownType(cooldownName));
    battler.setDecidedAction(mapActions);
    if (mapActions[0].isSupportAction()) {
      battler.showAnimation(J.ABS.Metadata.SupportDecidedAnimationId)
    } else {
      battler.showAnimation(J.ABS.Metadata.AttackDecidedAnimationId)
    }

    battler.setWaitCountdown(15);
  };

  /**
   * The battler attempts to move into a position where they can execute
   * their decided skill and land a hit.
   * @param {JABS_Battler} battler The battler trying to get into position.
   */
  static decideAiPhase2Movement(battler) {
    const actions = battler.getDecidedAction();

    // if for reasons, they have null set as their action, don't do things with it.
    if (!actions || !actions.length) return;
  
    const proximity = actions[0].getProximity();
    const distanceToTarget = battler.distanceToCurrentTarget();

    if (distanceToTarget > proximity) {
      battler.smartMoveTowardTarget();
    } else {
      battler.setInPosition();
    }
  };
  //#endregion Phase 2 - Execute Action Phase

  //#region Phase 3 - Post-Action Cooldown Phase
  /**
   * This is the post-action phase, when the battler has executed an action but not
   * yet restarted the cycle.
   */
  static aiPhase3(battler) {
    if (!battler.isPostActionCooldownComplete()) {
      if (!battler._event.isMoving() && battler.canBattlerMove()) {
        // move around while you're waiting for the cooldown.
        this.decideAiPhase3Movement(battler);
        return;
      }

      return;
    }
  
    // done with cooling down, lets start over back to phase 1!
    battler.setPhase(1);
    battler.resetPhases();
  };

  /**
   * Decides where to move while waiting for cooldown to complete from the skill.
   * @param {JABS_Battler} battler The battler in this cooldown phase. 
   */
  static decideAiPhase3Movement(battler) {
    const distance = battler.distanceToCurrentTarget();
    if (distance === null) return;
  
    const ai = battler.getAiMode();
  
    if (ai.basic) {
      // basic AI phase 3:
      // just kinda watches the target and doesn't move.
      if (JABS_Battler.isClose(distance) || JABS_Battler.isSafe(distance)) {
        battler.moveAwayFromTarget();
      } else {
        battler.smartMoveTowardTarget();
      }
  
      battler.turnTowardTarget();
    } 
    
    if (ai.smart) {
      // smart AI phase 1:
      // will try to maintain a comfortable distance from the target.
      if (JABS_Battler.isClose(distance)) {
        battler.moveAwayFromTarget();
      } else if (JABS_Battler.isFar(distance)) {
        battler.smartMoveTowardTarget();
      }
      battler.turnTowardTarget();
    } 
    
    else if (ai.defensive) {
      // defensive AI phase 1:
      // will try to maintain a great distance from the target.
      // NOTE: does not combine with smart.
    }
  };
  //#endregion Post-Action Cooldown Phase
};
//#endregion JABS_AiManager

//#region JABS_Battler
/**
 * An object that represents the binding of a `Game_Event` to a `Game_Battler`.
 * This can be for either the player, an ally, or an enemy.
 */
function JABS_Battler() { this.initialize(...arguments); }
//#region initialize battler
JABS_Battler.prototype = {};
JABS_Battler.prototype.constructor = JABS_Battler;

/**
 * Initializes this JABS battler.
 * @param {Game_Event} event The event the battler is bound to.
 * @param {Game_Battler} battler The battler data itself.
 * @param {JABS_BattlerCoreData} battlerCoreData The core data for the battler.
 * @param {boolean} hidden Whether or not this battler is "hidden".
 */
JABS_Battler.prototype.initialize = function(event, battler, battlerCoreData) {
  /**
   * The character/sprite that represents this battler on the map.
   * @type {Game_Character}
   */
  this._event = event;

  /**
   * The battler data that represents this battler's stats and information.
   * @type {Game_Battler}
   */
  this._battler = battler;

  /**
   * Whether or not the battler is hidden.
   * Hidden AI-controlled battlers (like enemies) will not take action, nor will they
   * be targetable.
   * @type {boolean}
   */
  this._hidden = false;
  this.initCoreData(battlerCoreData);
  this.initFromNotes();
  this.initGeneralInfo();
  this.initBattleInfo();
  this.initIdleInfo();
  this.initAnimationInfo();
};

/**
 * Initializes the battler's core data from the comments.
 * @param {JABS_BattlerCoreData} battlerCoreData 
 */
JABS_Battler.prototype.initCoreData = function(battlerCoreData) {
  /**
   * The team that this battler fights for.
   * @type {number}
   */
  this._team = battlerCoreData.team();

  /**
   * The distance this battler requires before it will engage with a non-allied target.
   * @type {number}
   */
  this._sightRadius = battlerCoreData.sightRange();

  /**
   * The boost this battler gains to their sight range while alerted.
   * @type {number}
   */
  this._alertedSightBoost = battlerCoreData.alertedSightBoost();

  /**
   * The distance this battler will allow for its target to be from itself before it disengages.
   * @type {number}
   */
  this._pursuitRadius = battlerCoreData.pursuitRange();

  /**
   * The boost this battler gains to their pursuit range while alerted.
   * @type {number}
   */
  this._alertedPursuitBoost = battlerCoreData.alertedPursuitBoost();

  /**
   * The duration in frames that this battler remains in an alerted state.
   * @type {number}
   */
  this._alertDuration = battlerCoreData.alertDuration();

  /**
   * The `JABS_BattlerAI` of this battler.
   * Only utilized by AI (duh).
   * @type {JABS_BattlerAI}
   */
  this._aiMode = battlerCoreData.ai();

  /**
   * Whether or not this battler is allowed to move around while idle.
   * @type {boolean}
   */
  this._canIdle = battlerCoreData.isInanimate() 
    ? false // don't move idly if inanimate.
    : battlerCoreData.canIdle();

  /**
   * Whether or not this battler's hp bar is visible.
   * Inanimate battlers do not show their hp bar by default.
   * @type {boolean}
   */
  this._showHpBar = battlerCoreData.isInanimate() 
    ? false // don't show hp bar if inanimate.
    : battlerCoreData.showHpBar();

  /**
   * Whether or not this battler's danger indicator is visible.
   * Inanimate battlers do not show their danger indicator by default.
   * @type {boolean}
     */
  this._showDangerIndicator = battlerCoreData.isInanimate() 
    ? false // don't show danger indicator if inanimate.
    : battlerCoreData.showDangerIndicator();

  /**
   * Whether or not this battler's name is visible.
   * Inanimate battlers do not show their name by default.
   * @type {boolean}
   */
  this._showBattlerName = battlerCoreData.isInanimate() 
    ? false // don't show battler name if inanimate.
    : battlerCoreData.showBattlerName();

  /**
   * Whether or not this battler is invincible, rendering them unable
   * to be collided with by map actions.
   * @type {boolean}
   */
  this._invincible = battlerCoreData.isInvincible();

  /**
   * Whether or not this battler is inanimate.
   * Inanimate battlers don't move, can't be alerted, and have no hp bar.
   * Ideal for destructibles like crates or traps.
   * @type {boolean}
   */
  this._inanimate = battlerCoreData.isInanimate();
};

/**
 * Initializes the properties of this battler that are directly derived from notes.
 */
JABS_Battler.prototype.initFromNotes = function() {
  /**
   * The number of frames to fulfill the "prepare" phase of a battler's engagement.
   * Only utilized by AI.
   * @type {number}
   */
  this._prepareMax = this.getPrepareTime();
};

/**
 * Initializes the properties of this battler that are not related to anything in particular.
 */
JABS_Battler.prototype.initGeneralInfo = function() {
  /**
   * The universally unique identifier for this `JABS_Battler`.
   */
  this._uuid = J.Base.Helpers.generateUuid();

  /**
   * Whether or not the movement for this battler is locked.
   * @type {boolean}
   */
  this._movementLock = false;

  /**
   * Whether or not this battler is waiting.
   * @type {boolean} True if battler is waiting, false otherwise.
   */
  this._waiting = false;

  /**
   * The counter for how long this battler is waiting.
   * @type {number}
   */
  this._waitCounter = 0;
};

/**
 * Initializes all properties that don't require input parameters.
 */
JABS_Battler.prototype.initBattleInfo = function() {
  /**
   * An object to track cooldowns within.
   * @type {object}
   */
  this._cooldowns = {};
  this.initCooldowns();

  /**
   * The collection of all states for this battler.
   * @type {object}
   */
  this._stateTracker = {};

  /**
   * The current phase of AI battling that this battler is in.
   * Only utilized by AI.
   * @type {number}
   */
  this._phase = 1;

  /**
   * The counter for preparing an action to execute for the AI.
   * Only utilized by AI.
   * @type {number}
   */
  this._prepareCounter = 0;

  /**
   * Whether or not this battler is finished with its "prepare" time and ready to
   * advance to phase 2 of combat.
   * @type {boolean}
   */
  this._prepareReady = false;

  /**
   * The counter for after a battler's action is executed.
   * Only utilized by AI.
   * @type {number}
   */
  this._postActionCooldown = 0;

  /**
   * The number of frames a skill requires as cooldown when executed by AI.
   * Only utilized by AI.
   * @type {number}
   */
  this._postActionCooldownMax = 0;

  /**
   * Whether or not this battler is ready to return to it's prepare phase.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._postActionCooldownComplete = true;
      
  /**
   * Whether or not this battler is engaged in combat with a target.
   * @type {boolean}
   */
  this._engaged = false;

  /**
   * The targeted `JABS_Battler` that this battler is attempting to battle with.
   * @type {JABS_Battler}
   */
  this._target = null;

  /**
   * The targeted `JABS_Battler` that this battler is aiming to support.
   * @type {JABS_Battler}
   */
  this._allyTarget = null;

  /**
   * Whether or not this target is alerted. Alerted targets have an expanded
   * sight and pursuit range.
   * @type {boolean}
   */
  this._alerted = false;

  /**
   * The counter for managing alertedness.
   * @type {number}
   */
  this._alertedCounter = 0;

  /**
   * A snapshot of the coordinates of the battler who triggered the alert
   * at the time this battler was alerted.
   * @type {[number, number]}
   */
  this._alertedCoordinates = [0, 0];

  /**
   * Whether or not the battler is in position to execute an action.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._inPosition = false;

  /**
   * The action decided by this battler. Remains `null` until an action is selected
   * in combat.
   * Only utilized by AI.
   * @type {JABS_Action}
   */
  this._decidedAction = null;

  /**
   * A queue of actions pending execution from a designated leader.
   * @type {JABS_Action[]}
   */
  this._leaderDecidedAction = [];

  /**
   * The `uuid` of the leader that is leading this battler.
   * This is only used for followers to prevent multiple leaders for commanding them.
   * @type {string}
   */
  this._leaderUuid = "";

  /**
   * A collection of `uuid`s from all follower battlers this battler is leading.
   * If this battler's AI does not contain the "leader" trait, this is unused.
   * @type {string[]}
   */
  this._followers = [];

  /**
   * The number of frames until the combo action is ready.
   * This is **ALWAYS** shorter than the base action being combo'd off of.
   * @type {number}
   */
  this._comboFrames = 0;

  /**
   * The id of the skill that is set to be the next combo action.
   * Defaults to `0` if there is no combo available for a skill.
   * @type {number}
   */
  this._comboNextActionId = 0;

  /**
   * Whether or not the combo action is ready.
   * @type {boolean}
   */
  this._comboReady = false;

  /**
   * The counter that governs slip effects like regeneration or poison.
   * @type {number}
   */
  this._regenCounter = 1;

  /**
   * The distance in steps/tiles/squares that the dodge will move the battler.
   * @type {number}
   */
  this._dodgeSteps = 0;

  /**
   * Whether or not this battler is dodging.
   * @type {boolean}
   */
  this._dodging = false;

  /**
   * The direction of which this battler is dodging.
   * Always `0` until a dodge is executed.
   * @type {number}
   */
  this._dodgeDirection = 0;

  /**
   * Whether or not this battler is guarding.
   * @type {boolean}
   */
  this._isGuarding = false;

  /**
   * The flat amount to reduce damage by when guarding.
   * @type {number}
   */
  this._guardFlatReduction = 0;

  /**
   * The percent amount to reduce damage by when guarding.
   * @type {number}
   */
  this._guardPercReduction = 0;

  /**
   * The number of frames at the beginning of activating guarding where
   * the first hit will be parried instead.
   * @type {number}
   */
  this._parryWindow = 0;

  /**
   * The id of the skill to retaliate with when successfully precise-parrying.
   * @type {number}
   */
  this._counterParryId = 0;

  /**
   * The id of the skill to retaliate with when successfully guarding.
   * @type {number}
   */
  this._counterGuardId = 0;

  /**
   * Whether or not this battler is in a state of dying.
   * @type {boolean}
   */
  this._dying = false;
};

/**
 * Initializes the properties of this battler that are related to idling/phase0.
 */
JABS_Battler.prototype.initIdleInfo = function() {
  /**
   * The initial `x` coordinate of where this battler was placed in the RMMZ editor or
   * was when the map was recreated (in the instance the RM user is leveraging a plugin that persists
   * event location after a map transfer).
   * @type {number}
   */
  this._homeX = this._event._x;
  
  /**
   * The initial `y` coordinate of where this battler was placed in the RMMZ editor or
   * was when the map was recreated (in the instance the RM user is leveraging a plugin that persists
   * event location after a map transfer).
   * @type {number}
   */
  this._homeY = this._event._y;

  /**
   * Whether or not this battler is identified as idle. Idle battlers are not
   * currently engaged, but instead executing their phase 0 movement pattern based on AI.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._idle = true;

  /**
   * The counter for frames until this battler's idle action is ready.
   * Only utilized by AI.
   * @type {number}
   */
  this._idleActionCount = 0;

  /**
   * The number of frames until this battler's idle action is ready.
   * Only utilized by AI.
   * @type {number}
   */
  this._idleActionCountMax = 30;

  /**
   * Whether or not the idle action is ready to execute.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._idleActionReady = false;
};

/**
 * Initializes the properties of this battler that are related to the character graphics.
 */
JABS_Battler.prototype.initAnimationInfo = function() {
  /**
   * The number of frames to animate for.
   * @type {number}
   */
  this._animationFrames = 0;

  /**
   * Whether or not this battler is currently animating.
   * @type {boolean}
   */
  this._animating = false;

  /**
   * The name of the file that contains this battler's character sprite (without extension).
   * @type {string}
   */
  this._baseSpriteImage = "";

  /**
   * The index of this battler's character sprite in the `_baseSpriteImage`.
   * @type {number} 
   */
  this._baseSpriteIndex = 0;
  this.captureBaseSpriteInfo();
};

/**
 * Initializes the cooldowns for this battler.
 */
JABS_Battler.prototype.initCooldowns = function() {
  this.initializeCooldown("global", 0);
  if (this.isEnemy()) {
    // initialize all the skills assigned from the database.
    const skills = this.getSkillIdsFromEnemy();
    if (skills) {
      skills.forEach(skillIdAndRating => {
        const skill = $dataSkills[skillIdAndRating];
        this.initializeCooldown(skill.name, 0);
      })
    }

    // initialize the basic attack skill if identified.
    const basicAttackSkillAndRating = this.getEnemyBasicAttack();
    if (basicAttackSkillAndRating) {
      const basicAttack = $dataSkills[basicAttackSkillAndRating[0]];
      this.initializeCooldown(basicAttack.name, 0);
    }
  } else {
    // players don't need skills initialized, but they do need cooldown slots.
    this.initializeCooldown(Game_Actor.JABS_MAINHAND, 0);
    this.initializeCooldown(Game_Actor.JABS_OFFHAND, 0);
    this.initializeCooldown(Game_Actor.JABS_TOOLSKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_DODGESKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_L1_A_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_L1_B_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_L1_X_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_L1_Y_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_R1_A_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_R1_B_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_R1_X_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_R1_Y_SKILL, 0);
  }
};
//#endregion initialize battler

//#region statics
/**
 * Generates the player character.
 */
JABS_Battler.createPlayer = function() {
  const battler = $gameParty.leader();
  const coreBattlerData = new JABS_BattlerCoreData(
    0,                  // battler id
    0,                  // team id
    null,               // battler AI
    0,                  // sight range
    0,                  // alerted sight boost
    0,                  // pursuit range
    0,                  // alerted pursuit boost
    0,                  // alert duration
    false,              // can move idly
    false,              // show hp bar
    false,              // show danger indicator
    false,              // show name
    false,              // is invincible
    false);             // is inanimate
  const player = new JABS_Battler($gamePlayer, battler, coreBattlerData);
  return player;
};

/**
 * Determines if the battler is close to the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isClose = function(distance) {
  const isClose = distance <= 1.7;
  return isClose;
};

/**
 * Determines if the battler is at a safe range from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isSafe = function(distance) {
  const isSafe = (distance >= 1.8) && (distance <= 3.5);
  return isSafe;
};

/**
 * Determines if the battler is far away from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isFar = function(distance) {
  const isFar = distance >= 3.6;
  return isFar;
};

/**
 * Determines whether or not the skill id is a guard-type skill or not.
 * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.isGuardSkillById = function(id) {
  if (!id) return false;

  const isGuardSkillType = $dataSkills[id].stypeId == J.ABS.DefaultValues.GuardSkillTypeId;
  return isGuardSkillType;
};

/**
 * Determines whether or not the skill id is a dodge-type skill or not.
 * @returns {boolean} True if it is a dodge skill, false otherwise.
 */
JABS_Battler.isDodgeSkillById = function(id) {
  if (!id) return false;

  const isDodgeSkillType = $dataSkills[id].stypeId == J.ABS.DefaultValues.DodgeSkillTypeId;
  return isDodgeSkillType;
};

/**
 * Translates the AI attribute codes in `binary` form to a `JABS_BattlerAI`.
 * @param {string} code The code assigned in the notes that determines AI.
 * @returns {JABS_BattlerAI} The AI built off the provided attributes.
 */
JABS_Battler.translateAiCode = function(code) {
  const aiMode = new JABS_BattlerAI(
    Boolean(code[0] == 1) || false, // basic
    Boolean(code[1] == 1) || false, // smart
    Boolean(code[2] == 1) || false, // executor
    Boolean(code[3] == 1) || false, // defensive
    Boolean(code[4] == 1) || false, // reckless
    Boolean(code[5] == 1) || false, // healer
    Boolean(code[6] == 1) || false, // follower
    Boolean(code[7] == 1) || false, // leader
  );

  return aiMode;
};
//#endregion statics

//#region updates
/**
 * Things that are battler-respective and should be updated on their own.
 */
JABS_Battler.prototype.update = function() {
  // don't update map battlers if JABS is disabled.
  if (!$gameBattleMap.absEnabled) return;

  this.updateAnimations();
  this.updateCooldowns();
  this.updateEngagement();
  this.updateStates();
  this.updateRG();
  this.updateDodging();
  this.updateDeathHandling();
};

/**
 * Update all character sprite animations executing on this battler.
 */
JABS_Battler.prototype.updateAnimations = function() {
  if (this._animating) {
    this.countdownAnimation();
  }
};

/**
 * Updates all cooldowns for this battler.
 */
JABS_Battler.prototype.updateCooldowns = function() {
  const keys = Object.keys(this._cooldowns);
  keys.forEach(cooldownKey => {
    this.countdownBaseCooldown(cooldownKey);
    this.countdownComboCooldown(cooldownKey);
  });

  if (this.isWaiting()) {
    this.countdownWait();
  }

  if (this.isAlerted()) {
    this.countdownAlert();
  }

  if (this.parrying()) {
    this.getCharacter().requestAnimation(131, false);
    this.countdownParryWindow();
  }
};

/**
 * Monitors all other battlers and determines if they are engaged or not.
 */
JABS_Battler.prototype.updateEngagement = function() {
  if (this.isPlayer() || $gameBattleMap.absPause || this.isHidden()) return;

  // inanimate characters cannot engage.
  if (this.isInanimate()) return;

  const targetResult = this.closestEnemyTarget();
  if (!targetResult[0]) return;

  const target = targetResult[0];
  const distance = targetResult[1];
  if (this.isEngaged()) {
    if (distance > this.getPursuitRadius()) {
      this.disengageTarget();
    }
  } else {
    if (distance < this.getSightRadius()) {
      this.engageTarget(target);
      return;
    }
  }
};

/**
 * Updates all states currently applied against this battler.
 */
JABS_Battler.prototype.updateStates = function() {
  const battler = this.getBattler();
  const states = battler.states();
  if (states.length) {
    states.forEach(state => {
      if (!this._stateTracker[state.id] || 
        !this._stateTracker[state.id].active) {
          this.addMissingState(state);
      }

      this.stateCountdown(state.id);
      this.removeExpiredState(battler, state.id);
    })
  }
};

/**
 * Updates all regenerations and ticks four times per second.
 */
JABS_Battler.prototype.updateRG = function() {
  if (this.isRegenReady()) {
    this.slipHp();
    this.slipMp();
    this.slipTp();
    this.setRegenCounter(15);
  }
};

/**
 * Updates the dodge skill.
 * Currently only used by the player.
 */
JABS_Battler.prototype.updateDodging = function() {
  if (!this.isPlayer()) return;

  // cancel the dodge if we got locked down.
  if (!this.canBattlerMove()) {
    this._dodging = false;
    this._dodgeSteps = 0;
  }

  // force dodge move while dodging.
  const player = this.getCharacter();
  if (!player.isMoving() && 
    this.canBattlerMove() &&
    this._dodgeSteps > 0 &&
    this._dodging) {
      player.moveStraight(this._dodgeDirection);
      this._dodgeSteps--;
  }

  // if the dodge is over, end the dodging.
  if (this._dodgeSteps <= 0 && !player.isMoving()) {
    this._dodging = false;
    this._dodgeSteps = 0;
    this.setInvincible(false);
  }
};

/**
 * Handles when this battler is dying.
 */
JABS_Battler.prototype.updateDeathHandling = function() {
  // don't do this for actors/players.
  if (this.isActor()) return;

  // do nothing if we are waiting.
  if (this.isWaiting()) return;

  // if we are dying, self-destruct.
  if (this.isDying() && !$gameMap._interpreter.isRunning()) {
    this.destroy();
  }
};
//#endregion updates

//#region update helpers
/**
 * Counts down the duration for this battler's wait time.
 */
JABS_Battler.prototype.countdownWait = function() {
  if (this._waitCounter > 0) {
    this._waitCounter--;
    return;
  }

  if (this._waitCounter <= 0) {
    this._waiting = false;
    this._waitCounter = 0;
  }
};

/**
 * Sets the battler's wait duration to a number. If this number is greater than
 * zero, then the battler must wait before doing anything else.
 * @param {number} wait The duration for this battler to wait.
 */
JABS_Battler.prototype.setWaitCountdown = function(wait) {
  this._waitCounter = wait;
  if (this._waitCounter > 0) {
    this._waiting = true;
  }

  if (this._waitCounter <= 0) {
    this._waiting = false;
    this._waitCounter = 0;
  }
};

/**
 * Gets whether or not this battler is currently waiting.
 * @returns {boolean} True if waiting, false otherwise.
 */
JABS_Battler.prototype.isWaiting = function() {
  return this._waiting;
};

/**
 * Counts down the alertedness of this battler.
 */
JABS_Battler.prototype.countdownAlert = function() {
  if (this._alertedCounter > 0) {
    this._alertedCounter--;
    return;
  }

  if (this._alertedCounter <= 0) {
    this.showBalloon(J.ABS.Balloons.Silence);
    this.setAlerted(false);
    this._alertedCounter = 0;
  }
};

/**
 * Gets whether or not this battler is dodging.
 * @returns {boolean} True if currently dodging, false otherwise.
 */
JABS_Battler.prototype.isDodging = function() {
  return this._dodging;
};

/**
 * Sets whether or not this battler is dodging.
 * @param {boolean} dodging Whether or not the battler is dodging (default = true).
 */
JABS_Battler.prototype.setDodging = function(dodging = true) {
  this._dodging = dodging;
};

/**
 * Tries to execute the battler's dodge skill.
 * Checks to see if costs are payable before executing.
 */
JABS_Battler.prototype.tryDodgeSkill = function() {
  const battler = this.getBattler();
  const skillId = battler.getEquippedSkill(Game_Actor.JABS_DODGESKILL);
  if (!skillId) return;

  const skill = $dataSkills[skillId];
  const canPay = battler.canPaySkillCost(skill);
  if (canPay && skill._j.moveType) {
    this.executeDodgeSkill(skill);
  }
};

/**
 * Executes the provided dodge skill.
 * @param {object} skill The RPG item representing the dodge skill.
 */
JABS_Battler.prototype.executeDodgeSkill = function(skill) {
  const { moveType, range, cooldown, invincible } = skill._j;
  const player = this.getCharacter();

  this.setInvincible(invincible);
  this.performActionPose(skill);
  const dodgeSpeed = 2;
  const direction = this.determineDodgeDirection(moveType);
  player.setDodgeBoost(dodgeSpeed);

  this._dodgeSteps = range;
  this._dodgeDirection = direction;
  this._dodging = true;

  const battler = this.getBattler();
  battler.paySkillCost(skill);
  this.modCooldownCounter(Game_Actor.JABS_DODGESKILL, cooldown);
};

/**
 * Translates a dodge skill type into a direction to move.
 * @param {string} moveType The type of dodge skill the player is using.
 */
JABS_Battler.prototype.determineDodgeDirection = function(moveType) {
  const player = this.getCharacter();
  let direction = 0;
  switch (moveType) {
    case J.ABS.Notetags.MoveType.Forward:
      direction = player.direction();
      break;
    case J.ABS.Notetags.MoveType.Backward:
      direction = player.reverseDir(player.direction());
      break;
    case J.ABS.Notetags.MoveType.Directional:
      if (Input.isPressed("up")) {
        direction = J.ABS.Directions.UP;
      } else if (Input.isPressed("right")) {
        direction = J.ABS.Directions.RIGHT;
      } else if (Input.isPressed("left")) {
        direction = J.ABS.Directions.LEFT;
      } else if (Input.isPressed("down")) {
        direction = J.ABS.Directions.DOWN;
      } else {
        direction = player.direction();
      }
      break;
    default:
      direction = player.direction();
      break;
  }

  return direction;
};

/**
 * Whether or not the regen tick is ready.
 * @returns {boolean} True if its time for a regen tick, false otherwise.
 */
JABS_Battler.prototype.isRegenReady = function() {
  if (this.getRegenCounter() <= 0) {
    this.setRegenCounter(0);
    return true;
  } else {
    this._regenCounter--;
    return false;
  }
};

/**
 * Gets the current count on the regen counter.
 * @returns {number}
 */
JABS_Battler.prototype.getRegenCounter = function() {
  return this._regenCounter;
};

/**
 * Sets the regen counter to a given number.
 * @param {number} count The count to set the regen counter to.
 */
JABS_Battler.prototype.setRegenCounter = function(count) {
  this._regenCounter = count;
};

/**
 * Manages hp regeneration/poison from a battler's HRG and current states.
 */
JABS_Battler.prototype.slipHp = function() {
  const battler = this.getBattler();
  const hrg = battler.hrg * 100;
  let hp5 = hrg / 4 / 5; // regen 4x per second, for 5 seconds == rg.
  let hp5mod = 0;
  let needPop = false;
  const states = battler.states();
  if (states.length) {
    states.forEach(state => {
      if (state.meta) {
        const { slipHpFlat, slipHpPerc } = state._j;
        if (slipHpFlat) {
          hp5mod += slipHpFlat;
          needPop = true;
        }
        
        if (slipHpPerc) {
          const perc = slipHpPerc;
          const factor = battler.mhp * (perc / 100);
          hp5mod += factor;
          needPop = true;
        }

        hp5mod /= 4;
        hp5mod /= 5;    
      }
    });
  }

  hp5 += hp5mod;
  battler.gainHp(hp5);

  if (needPop) {
    const character = this.getCharacter();
    const textColor = (hp5 > 0) ? 3 : 0;
    const iconId = 0;
    const actionResult = null;
    const directValue = Math.ceil(hp5);
    const popup = new JABS_TextPop(
      actionResult,
      iconId,
      textColor,
      false,
      false,
      "damage",
      directValue);
    character.addTextPop(popup);
    character.setRequestTextPop();
  }
};

/**
 * Manages mp regeneration/poison from a battler's MRG and current states.
 */
JABS_Battler.prototype.slipMp = function() {
  const battler = this.getBattler();
  const mrg = battler.mrg * 100;
  let mp5 = mrg / 4 / 5; // regen 4x per second, for 5 seconds == rg.
  let mp5mod = 0;
  let needPop = false;
  const states = battler.states();
  if (states.length) {
    states.forEach(state => {
      if (state.meta) {
        const { slipMpFlat, slipMpPerc } = state._j;
        if (slipMpFlat) {
          mp5mod += slipMpFlat;
        }
        
        if (slipMpPerc) {
          const perc = slipMpPerc;
          const factor = battler.mhp * (perc / 100);
          mp5mod += factor;
        }

        mp5mod /= 4;
        mp5mod /= 5;    
      }
    });
  }

  mp5 += mp5mod;
  battler.gainMp(mp5);

  if (needPop) {
    const character = this.getCharacter();
    const textColor = (mp5 > 0) ? 3 : 0;
    const iconId = 0;
    const actionResult = null;
    const directValue = Math.ceil(mp5);
    const popup = new JABS_TextPop(
      actionResult,
      iconId,
      textColor,
      false,
      false,
      "damage",
      directValue);
    character.addTextPop(popup);
    character.setRequestTextPop();
  }
};

/**
 * Manages tp regeneration/poison from a battler's TRG and current states.
 */
JABS_Battler.prototype.slipTp = function() {
  const battler = this.getBattler();
  const trg = battler.trg * 100;
  let tp5 = trg / 4 / 5; // regen 4x per second, for 5 seconds == rg.
  let tp5mod = 0;
  let needPop = false;
  const states = battler.states();
  if (states.length) {
    states.forEach(state => {
      if (state.meta) {
        const { slipTpFlat, slipTpPerc } = state._j;
        if (slipTpFlat) {
          tp5mod += slipTpFlat;
        }
        
        if (slipTpPerc) {
          const perc = slipTpPerc;
          const factor = battler.mhp * (perc / 100);
          tp5mod += factor;
        }

        tp5mod /= 4;
        tp5mod /= 5;    
      }
    });
  }

  tp5 += tp5mod;
  battler.gainTp(tp5);

  if (needPop) {
    const character = this.getCharacter();
    const textColor = (tp5 > 0) ? 3 : 0;
    const iconId = 0;
    const actionResult = null;
    const directValue = Math.ceil(tp5);
    const popup = new JABS_TextPop(
      actionResult,
      iconId,
      textColor,
      false,
      false,
      "damage",
      directValue);
    character.addTextPop(popup);
    character.setRequestTextPop();
  }
};

/**
 * Determines the closest enemy target.
 * @returns {[JABS_Battler, number]}
 */
JABS_Battler.prototype.closestEnemyTarget = function() {
  const battlers = $gameMap.getBattlers();
  battlers.push($gameBattleMap.getPlayerMapBattler());
  let currentClosest = null;
  let closestDistanceYet = 1000;
  battlers.forEach(battler => {
    if (this.isSameTeam(battler.getTeam()) ||// don't target same team
      this.getUuid() === battler.getUuid())  // dont' target self
        return;

    const distance = this.distanceToDesignatedTarget(battler);
    if (distance < closestDistanceYet) {
      // track and capture the closest
      closestDistanceYet = distance;
      currentClosest = battler;
    }
  })

  const result = [currentClosest, closestDistanceYet];
  return result;
};

/**
 * Gets whether or not this battler's movement is locked.
 * @returns {boolean} True if the battler's movement is locked, false otherwise.
 */
JABS_Battler.prototype.isMovementLocked = function() {
  return this._movementLock;
};

/**
 * Sets the battler's movement lock.
 * @param {boolean} locked Whether or not the battler's movement is locked (default = true).
 */
JABS_Battler.prototype.setMovementLock = function(locked = true) {
  this._movementLock = locked;
};

/**
 * Adds the state into the state tracking object for this battler if missing.
 * @param {object} state The reference data of the state.
 */
JABS_Battler.prototype.addMissingState = function(state) {
  // TODO: modify here for handling state refresh/renewals/stacking/etc.
  this._stateTracker[state.id] = this._stateTracker[state.id] || {};
  this._stateTracker[state.id].active = true;
  this._stateTracker[state.id].duration = state.stepsToRemove;
};

/**
 * Removes a state from the battler.
 * @param {Game_Battler} battler The battler that has the state to remove.
 * @param {number} stateId The id of the state to remove.
 */
JABS_Battler.prototype.removeExpiredState = function(battler, stateId) {
  if (!this._stateTracker[stateId].active) return;

  if (this._stateTracker[stateId].duration <= 0) {
    this._stateTracker[stateId].active = false;
    this._stateTracker[stateId].duration = 0;
    battler.removeState(stateId);
  }
};

/**
 * Counts down the state counter to removal.
 * @param {number} stateId The id of the state to countdown for.
 */
JABS_Battler.prototype.stateCountdown = function(stateId) {
  if (this._stateTracker[stateId].active) {
    this._stateTracker[stateId].duration--;
  }
};

/**
 * Retrieves the entire state tracking object.
 * @returns {object} The object containing all state data for this battler.
 */
JABS_Battler.prototype.getAllStateData = function() {
  return this._stateTracker;
};

/**
 * Gets the tracking data associated with a given state.
 * @param {number} stateId The id of the state to get tracking data for.
 * @returns {object} The object containing the specified state data for this battler.
 */
JABS_Battler.prototype.getStateData = function(stateId) {
  return this._stateTracker[stateId];
};

/**
 * Whether or not the battler is able to move.
 * A variety of things can impact the ability for a battler to move.
 * @returns {boolean} True if the battler can move, false otherwise.
 */
JABS_Battler.prototype.canBattlerMove = function() {
  if (this.isMovementLocked()) {
    return false;
  }

  const states = this.getBattler().states();
  if (!states.length) {
    return true;
  } else {
    const rooted = states.find(state => {
      if (state._j.rooted || state._j.paralyzed) {
        return true;
      } else {
        return false;
      }
    });

    return !rooted;
  }
};

/**
 * Whether or not the battler is able to use attacks based on states.
 * @returns {boolean} True if the battler can attack, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseAttacks = function() {
  const states = this.getBattler().states();
  if (!states.length) {
    return true;
  } else {
    const disabled = states.find(state => {
      if (state._j.disabled || state._j.paralyzed) {
        return true;
      } else {
        return false;
      }
    })

    return !disabled;
  }
};

/**
 * Whether or not the battler is able to use skills based on states.
 * @returns {boolean} True if the battler can use skills, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseSkills = function() {
  const states = this.getBattler().states();
  if (!states.length) {
    return true;
  } else {
    const muted = states.find(state => {
      if (state._j.muted || state._j.paralyzed) {
        return true;
      } else {
        return false;
      }
    })

    return !muted;
  }
};

/**
 * Initializes the sprite info for this battler.
 */
JABS_Battler.prototype.captureBaseSpriteInfo = function() {
  this.setBaseSpriteName(this.getCharacterSpriteName());
  this.setBaseSpriteIndex(this.getCharacterSpriteIndex());
};

/**
 * Gets the name of this battler's current character sprite.
 * @returns {string}
 */
JABS_Battler.prototype.getCharacterSpriteName = function() {
  return this.getCharacter()._characterName;
};

/**
 * Gets the index of this battler's current character sprite.
 * @returns {number}
 */
JABS_Battler.prototype.getCharacterSpriteIndex = function() {
  return this.getCharacter()._characterIndex;
};

/**
 * Sets the name of this battler's original character sprite.
 * @param {string} name The name to set.
 */
JABS_Battler.prototype.setBaseSpriteName = function(name) {
  this._baseSpriteImage = name;
};

/**
 * Sets the index of this battler's original character sprite.
 * @param {number} index The index to set.
 */
JABS_Battler.prototype.setBaseSpriteIndex = function(index) {
  this._baseSpriteIndex = index;
};
//#endregion update helpers

//#region reference helpers
/**
 * Destroys this battler and removes it from the current battle map.
 */
JABS_Battler.prototype.battlerName = function() {
  const name = this.getReferenceData().name;
  return name;
};

/**
 * Events that have no actual conditions associated with them may have a -1 index.
 * Ignore that if thats the case.
 */
JABS_Battler.prototype.hasEventActions = function() {
  // allies and the player don't have event commands.
  if (this.isActor()) return false;

  const event = this.getCharacter();
  const hasEventcommands = event._pageIndex !== -1;
  return hasEventcommands;
};

/**
 * Whether or not the battler has an "offhand" piece of gear equipped.
 * This can either be a dual-wielded second weapon, or the first armor equipped.
 * @returns {boolean} True if the battler has offhand equip with a skill, false otherwise.
 */
JABS_Battler.prototype.hasOffhandSkill = function() {
  const battler = this.getBattler();
  const offhandGear = battler.equips()[1];
  if (offhandGear && offhandGear._j.skillId) {
    return true;
  } else {
    return false;
  }
};

/**
 * Destroys this battler and removes it from the current battle map.
 */
JABS_Battler.prototype.destroy = function() {
  this.setInvincible();
  $gameMap.destroyBattler(this);
};

/**
 * Reveals this battler onto the map.
 */
JABS_Battler.prototype.revealHiddenBattler = function() {
  this._hidden = false;
};

/**
 * Hides this battler from the current battle map.
 */
JABS_Battler.prototype.hideBattler = function() {
  this._hidden = true;
};

/**
 * Whether or not this battler is hidden on the current battle map.
 */
JABS_Battler.prototype.isHidden = function() {
  return this._hidden;
};

/**
 * Whether or not this battler is in a state of dying.
 * @returns {boolean}
 */
JABS_Battler.prototype.isDying = function() {
  return this._dying;
};

/**
 * Sets whether or not this battler is in a state of dying.
 * @param {boolean} dying The new state of dying.
 */
JABS_Battler.prototype.setDying = function(dying) {
  this._dying = dying;
};

/**
 * Gets this battler's unique identifier.
 * @returns {string}
 */
JABS_Battler.prototype.getUuid = function() {
  return this._uuid;
};

/**
 * Gets whether or not this battler has any pending actions decided
 * by this battler's leader.
 */
JABS_Battler.prototype.hasLeaderDecidedActions = function() {
  // if you don't have a leader, you don't perform the actions.
  if (!this.hasLeader()) return false;

  return this._leaderDecidedAction;
};

/**
 * Gets the next action from the queue of leader-decided actions.
 * Also removes it from the current queue.
 * @returns {JABS_Action}
 */
JABS_Battler.prototype.getNextLeaderDecidedAction = function() {
  const action = this._leaderDecidedAction;
  this.clearLeaderDecidedActionsQueue();
  return action;
};

/**
 * Adds a new action decided by the leader for the follower to perform.
 * @param {JABS_Action} action The action decided by the leader.
 */
JABS_Battler.prototype.setLeaderDecidedAction = function(action) {
  this._leaderDecidedAction = action;
};

/**
 * Clears all unused leader-decided actions that this follower had pending.
 */
JABS_Battler.prototype.clearLeaderDecidedActionsQueue = function() {
  this._leaderDecidedAction = null;
};

/**
 * Gets the leader's `uuid` of this battler.
 */
JABS_Battler.prototype.getLeader = function() {
  return this._leaderUuid;
};

JABS_Battler.prototype.getLeaderBattler = function() {
  if (this._leaderUuid) {
    const leader = $gameBattleMap.getBattlerByUuid(this._leaderUuid);
    return leader;
  } else {
    return null;
  }
};

/**
 * Sets the `uuid` of the leader of this battler.
 * @param {string} newLeader The leader's `uuid`.
 */
JABS_Battler.prototype.setLeader = function(newLeader) {
  const leader = $gameBattleMap.getBattlerByUuid(newLeader);
  if (leader) {
    this._leaderUuid = newLeader;
    leader.addFollower(this.getUuid());
  }
};

/**
 * Gets whether or not this battler has a leader.
 * Only battlers with the ai-trait of `follower` can have leaders.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasLeader = function() {
  return !!this._leaderUuid;
};

/**
 * Gets all followers associated with this battler.
 * Only leaders can have followers.
 * @return {string[]} The `uuid`s of all followers.
 */
JABS_Battler.prototype.getFollowers = function() {
  return this._followers;
};

/**
 * Gets the whole battler of the follower matching the `uuid` provided.
 * @param {string} followerUuid The `uuid` of the follower to find.
 * @returns {JABS_Battler} 
 */
JABS_Battler.prototype.getFollowerByUuid = function(followerUuid) {
  // if we don't have followers, just return null.
  if (!this.hasFollowers()) return null;

  // search through the followers to find the matching battler.
  const foundUuid = this._followers.find(uuid => uuid === followerUuid);
  if (foundUuid) {
    const battler = $gameBattleMap.getBattlerByUuid(foundUuid);
    return battler;
  }
  else {
    return null;
  }
};

/**
 * 
 * @param {string} newFollowerUuid The new uuid of the follower now being tracked.
 */
JABS_Battler.prototype.addFollower = function(newFollowerUuid) {
  const found = this.getFollowerByUuid(newFollowerUuid);
  if (found) {
    console.error("this follower already existed within the follower list.");
  } else {
    this._followers.push(newFollowerUuid);
  }
};

/**
 * Removes the follower from 
 * @param {string} oldFollowerUuid The `uuid` of the follower to remove from tracking.
 */
JABS_Battler.prototype.removeFollower = function(oldFollowerUuid) {
  const index = this._followers.indexOf(uuid => uuid === oldFollowerUuid);
  if (index !== -1) {
    this._followers.splice(index, 1);
  } else {
    console.error("could not find follower to remove from the list.", oldFollowerUuid);
  }
};

/**
 * Clears all current followers from this battler.
 */
JABS_Battler.prototype.clearFollowers = function() {
  // first de-assign leadership from all followers for this leader...
  this._followers.forEach(followerUuid => {
    $gameBattleMap.clearLeaderDataByUuid(followerUuid);
  });

  // ...then empty the collection.
  this._followers.splice(0, this._followers.length);
};

/**
 * Removes this follower's leader.
 */
JABS_Battler.prototype.clearLeader = function() {
  // get the leader's uuid for searching.
  const leaderUuid = this.getLeader();
  if (leaderUuid) {
    // if found, remove this follower from that leader.
    const uuid = this.getUuid();
    const leader = $gameBattleMap.getBattlerByUuid(leaderUuid);
    leader.removeFollowerByUuid(uuid);
  }
};

/**
 * Removes a follower from it's current leader.
 * @param {string} uuid The `uuid` of the follower to remove from the leader.
 */
JABS_Battler.prototype.removeFollowerByUuid = function(uuid) {
  const index = this._followers.indexOf(uuid);
  if (index !== -1) {
    this._followers.splice(index, 1);
  }
};

/**
 * Removes the leader data from this battler.
 */
JABS_Battler.prototype.clearLeaderData = function() {
  this.setLeader("");
  this.clearLeaderDecidedActionsQueue();
};

/**
 * Gets whether or not this battler has followers.
 * Only battlers with the AI trait of "leader" will have followers.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasFollowers = function() {
  // if you're not a leader, you can't have followers.
  if (!this.getAiMode().leader) return false;

  return this._followers.length > 0;
};

/**
 * Gets the database data for this battler.
 * @returns {(Game_Actor|Game_Enemy)} The battler data.
 */
JABS_Battler.prototype.getReferenceData = function() {
  if (this.isActor()) {
    return this.getBattler().actor();
  } else if (this.getBattler().isEnemy()) {
    return this.getBattler().enemy();
  }
};

/**
 * Determines if this battler is facing its target.
 * @param {Game_Character} target The target `Game_Character` to check facing for.
 */
JABS_Battler.prototype.isFacingTarget = function(target) {
  const userDir = this.getCharacter().direction();
  const targetDir = target.direction();

  switch (userDir) {
    case J.ABS.Directions.DOWN:
      return targetDir == J.ABS.Directions.UP;
    case J.ABS.Directions.UP:
      return targetDir == J.ABS.Directions.DOWN;
    case J.ABS.Directions.LEFT:
      return targetDir == J.ABS.Directions.RIGHT;
    case J.ABS.Directions.RIGHT:
      return targetDir == J.ABS.Directions.LEFT;
  }

  return false;
};

/**
 * Whether or not this battler is actually the `Game_Player`.
 * @returns {boolean}
 */
JABS_Battler.prototype.isPlayer = function() {
  return (this.getCharacter() instanceof Game_Player);
};

/**
 * Whether or not this battler is a `Game_Actor`. 
 * The player counts as a `Game_Actor`, too.
 * @returns {boolean}
 */
JABS_Battler.prototype.isActor = function() {
  return (this.isPlayer() || this.getBattler() instanceof Game_Actor)
};

/**
 * Whether or not this battler is a `Game_Enemy`.
 * @returns {boolean}
 */
JABS_Battler.prototype.isEnemy = function() {
  return (this.getBattler() instanceof Game_Enemy);
};

/**
 * Compares the user with a provided target team to see if they are the same.
 * @param {boolean} targetTeam The team you are checking with.
 * @returns {boolean} True if the user and target are on the same team, false otherwise.
 */
JABS_Battler.prototype.isSameTeam = function(targetTeam) {
  return (this.getTeam() == targetTeam);
};

/**
 * Gets this battler's team id.
 * @returns {number}
 */
JABS_Battler.prototype.getTeam = function() {
  return this._team;
};

/**
 * Gets the phase of battle this battler is currently in.
 * The player does not have any phases.
 * @returns {number} The phase this `JABS_Battler` is in. 
 */
JABS_Battler.prototype.getPhase = function() {
  return this._phase;
};

/**
 * Gets whether or not this battler is invincible.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInvincible = function() {
  return this._invincible;
};

/**
 * Gets whether or not this battler is inanimate.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInanimate = function() {
  return this._inanimate;
};

/**
 * Sets this battler to be invincible, rendering them unable to be collided
 * with by map actions of any kind.
 * @param {boolean} invincible True if uncollidable, false otherwise (default: true).
 */
JABS_Battler.prototype.setInvincible = function(invincible = true) {
  this._invincible = invincible;
};

/**
 * Sets the phase of battle that this battler should be in.
 * @param {number} newPhase The new phase the battler is entering.
 */
JABS_Battler.prototype.setPhase = function(newPhase) {
  this._phase = newPhase;
};

/**
 * Resets the phase of this battler back to one and resets all flags.
 */
JABS_Battler.prototype.resetPhases = function() {
  this._phase = 1; // reset to the planning phase
  this._prepareReady = false;
  this._postActionCooldownComplete = false;
  this.setDecidedAction(null);
  this.setInPosition(false);
};

/**
 * Gets whether or not this battler is in position for a given skill.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInPosition = function() {
  return this._inPosition;
};

/**
 * Sets this battler to be identified as "in position" to execute their
 * decided skill.
 * @param {boolean} inPosition 
 */
JABS_Battler.prototype.setInPosition = function(inPosition = true) {
  this._inPosition = inPosition;
};

/**
 * Gets whether or not this battler has decided an action.
 * @returns {boolean}
 */
JABS_Battler.prototype.isActionDecided = function() {
  return this._decidedAction !== null;
};

/**
 * Gets the battler's decided action.
 * @returns {JABS_Action}
 */
JABS_Battler.prototype.getDecidedAction = function() {
  return this._decidedAction;
};

/**
 * Sets this battler's decided action to this action.
 * @param {JABS_Action} action The action this battler has decided on.
 */
JABS_Battler.prototype.setDecidedAction = function(action) {
  this._decidedAction = action;
};

/**
 * Resets the idle action back to a not-ready state.
 */
JABS_Battler.prototype.resetIdleAction = function() {
  this._idleActionReady = false;
};

/**
 * Returns the `Game_Character` that this `JABS_Battler` is bound to.
 * For the player, it'll return a subclass instead: `Game_Player`.
 * @returns {Game_Character} The event this `JABS_Battler` is bound to.
 */
JABS_Battler.prototype.getCharacter = function() {
  return this._event;
};

/**
 * Returns the `Game_Battler` that this `JABS_Battler` represents. 
 * 
 * This may be either a `Game_Actor`, or `Game_Enemy`.
 * @returns {Game_Battler} The `Game_Battler` this battler represents.
 */
JABS_Battler.prototype.getBattler = function() {
  return this._battler;
};

/**
   * Whether or not the event is actually loaded and valid.
   * @returns {boolean} True if the event is valid (non-player) and loaded, false otherwise.
 */
JABS_Battler.prototype.isEventReady = function() {
  const character = this.getCharacter();
  if (character instanceof Game_Player) {
    return false;
  } else {
    return character.event() ? true : false;
  }
};

/**
 * The radius a battler of a different team must enter to cause this unit to engage.
 * @returns {number} The sight radius for this `JABS_Battler`.
 */
JABS_Battler.prototype.getSightRadius = function() {
  let sight = this._sightRadius;
  if (this.isAlerted()) {
    sight += this._alertedSightBoost;
  }

  return sight;
};

/**
 * The maximum distance a battler of a different team may reach before this unit disengages.
 * @returns {number} The pursuit radius for this `JABS_Battler`.
 */
JABS_Battler.prototype.getPursuitRadius = function() {
  let pursuit = this._pursuitRadius;
  if (this.isAlerted()) {
    pursuit += this._alertedPursuitBoost;
  }

  return pursuit;
};

/**
 * Whether or not this `JABS_Battler` is currently engaged in battle with a target.
 * @returns {boolean} Whether or not this battler is engaged.
 */
JABS_Battler.prototype.isEngaged = function() {
  return this._engaged;
};

/**
 * Engage battle with the target battler.
 * @param {JABS_Battler} target The target this battler is engaged with.
 */
JABS_Battler.prototype.engageTarget = function(target) {
  this._engaged = true;
  this.setTarget(target);
  this.isIdle(false);
  this._event.lock();
  this.showBalloon(J.ABS.Balloons.Exclamation);
};

/**
 * Disengage from the target.
 */
JABS_Battler.prototype.disengageTarget = function() {
  this._event.unlock();
  this.setTarget(null);
  this._engaged = false;
  this.clearFollowers();
  this.clearLeaderData();
  this.showBalloon(J.ABS.Balloons.Frustration);
};

/**
 * Gets the current target of this battler.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getTarget = function() {
  return this._target;
};

/**
 * Sets the target of this battler.
 * @param {JABS_Battler} newTarget The new target.
 */
JABS_Battler.prototype.setTarget = function(newTarget) {
  this._target = newTarget;
};

/**
 * Gets the current allied target of this battler.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getAllyTarget = function() {
  return this._allyTarget;
};

/**
 * Sets the allied target of this battler.
 * @param {JABS_Battler} newAlliedTarget The new target.
 */
JABS_Battler.prototype.setAllyTarget = function(newAlliedTarget) {
  this._allyTarget = newAlliedTarget;
};

/**
 * Determines the distance from this battler and the point.
 * @param {number} x The x coordinate to check.
 * @param {number} y The y coordinate to check.
 * @returns {number} The distance from the battler to the point.
 */
JABS_Battler.prototype.distancetoPoint = function(x, y) {
  if ((x ?? y) === null) return null;
  const x1 = this.getX();
  const x2 = x;
  const y1 = this.getY();
  const y2 = y;
  const distance = Math
    .hypot(x2 - x1, y2 - y1)
    .toFixed(2);
    return distance;
};

/**
 * Determines distance from this battler and the target.
 * @param {Game_Character} target The target that this battler is checking distance against.
 * @returns {number} The distance from this battler to the provided target.
 */
JABS_Battler.prototype.distanceToDesignatedTarget = function(target) {
  if (!target) return null;

  return this.distancetoPoint(target.getX(), target.getY());
};

/**
 * Determines distance from this battler and the current target.
 * @returns {number} The distance.
 */
JABS_Battler.prototype.distanceToCurrentTarget = function() {
  const target = this.getTarget();
  if (!target) return null;

  return this.distancetoPoint(target.getX(), target.getY());
};

/**
 * A shorthand reference to the distance this battler is from it's home.
 * @returns {number} The distance.
 */
JABS_Battler.prototype.distanceToHome = function() {
  return this.distancetoPoint(this._homeX, this._homeY);
};

/**
 * Gets whether or not this battler will move around while idle.
 * @returns {boolean}
 */
JABS_Battler.prototype.canIdle = function() {
  return this._canIdle;
};

/**
 * Gets whether or not this battler should show its hp bar.
 * @returns {boolean}
 */
JABS_Battler.prototype.showHpBar = function() {
  return this._showHpBar;
};

/**
 * Gets whether or not this battler should show its danger indicator.
 * @returns {boolean}
 */
 JABS_Battler.prototype.showDangerIndicator = function() {
  return this._showDangerIndicator;
};

/**
 * Gets whether or not this battler should show its name.
 * @returns {boolean}
 */
 JABS_Battler.prototype.showBattlerName = function() {
  return this._showBattlerName;
};

/**
 * Gets whether or not this battler is in an `alerted` state.
 * @returns {boolean} True if this battler is alerted, false otherwise.
 */
JABS_Battler.prototype.isAlerted = function() {
  return this._alerted;
};

/**
 * Sets the alerted state for this battler.
 * @param {boolean} alerted The new alerted state (default = true).
 */
JABS_Battler.prototype.setAlerted = function(alerted = true) {
  this._alerted = alerted;
};

/**
 * Gets whether or not this battler is in an `alerted` state.
 * @returns {boolean} True if this battler is alerted, false otherwise.
 */
JABS_Battler.prototype.getAlertDuration = function() {
  return this._alertDuration;
};

/**
 * Sets the alerted counter to this number of frames.
 * @param {number} alertedFrames The duration in frames for how long to be alerted.
 */
JABS_Battler.prototype.setAlertedCounter = function(alertedFrames) {
  this._alertedCounter = alertedFrames;
  if (this._alertedCounter > 0) {
    this.setIdle(false);
    this.setAlerted();
    return;
  }

  if (this._alertedCounter <= 0) {
    this.setAlerted(false);
    return;
  }
};

/**
 * Gets the alerted coordinates.
 * @returns {[number, number]} The `[x, y]` of the alerter.
 */
JABS_Battler.prototype.getAlertedCoordinates = function() {
  return this._alertedCoordinates;
};

/**
 * Sets the alerted coordinates.
 * @param {number} x The `x` of the alerter.
 * @param {number} y The `y` of the alerter.
 */
JABS_Battler.prototype.setAlertedCoordinates = function(x, y) {
  this._alertedCoordinates = [x, y];
};

/**
 * Whether or not this battler is at it's home coordinates.
 * @returns {boolean} True if the battler is home, false otherwise.
 */
JABS_Battler.prototype.isHome = function() {
  return (this._event.x == this._homeX && this._event.y == this._homeY);
};

/**
 * Returns the X coordinate of the event portion's initial placement.
 * @returns {number} The X coordinate of this event's home.
 */
JABS_Battler.prototype.getHomeX = function() {
  return this._homeX;
};

/**
 * Returns the Y coordinate of the event portion's initial placement.
 * @returns {number} The Y coordinate of this event's home.
 */
JABS_Battler.prototype.getHomeY = function() {
  return this._homeY;
};

/**
 * Returns the X coordinate of the event.
 * @returns {number} The X coordinate of this event.
 */
JABS_Battler.prototype.getX = function() {
  return this.getCharacter().x;
};

/**
 * Returns the Y coordinate of the event.
 * @returns {number} The Y coordinate of this event.
 */
JABS_Battler.prototype.getY = function() {
  return this.getCharacter().y;
};

/**
 * Retrieves the AI associated with this battler.
 * @returns {JABS_BattlerAI} This battler's AI.
 */
JABS_Battler.prototype.getAiMode = function() {
  return this._aiMode;
};

/**
 * Gets this follower's leader's AI.
 * @returns {JABS_BattlerAI} This battler's leader's AI.
 */
JABS_Battler.prototype.getLeaderAiMode = function() {
  // if we don't have a leader, don't.
  if (!this.hasLeader()) return null;

  const leaderAi = $gameBattleMap.getBattlerByUuid(this.getLeader()).getAiMode();
  return leaderAi;
};

/**
 * Tries to move this battler away from its current target.
 * This may fail if the battler is pinned in a corner or something.
 */
JABS_Battler.prototype.moveAwayFromTarget = function() {
  const battler = this.getCharacter();
  const target = this.getTarget().getCharacter();
  battler.moveAwayFromCharacter(target);
};

/**
 * Tries to move this battler away from its current target.
 * 
 * There is no pathfinding away, but if its not able to move directly
 * away, it will try a different direction to wiggle out of corners.
 */
JABS_Battler.prototype.smartMoveAwayFromTarget = function() {
  const battler = this.getCharacter();
  const target = this.getTarget();
  battler.moveAwayFromCharacter(target.getCharacter());
  if (!battler.isMovementSucceeded()) {
    const threatDir = battler.reverseDir(battler.direction());
    let newDir = (Math.randomInt(4) + 1) * 2;
    while (newDir == threatDir) {
      newDir = (Math.randomInt(4) + 1) * 2;
    }
    battler.moveStraight(newDir);
  }
};

/**
 * Tries to move this battler towards its current target.
 */
JABS_Battler.prototype.smartMoveTowardTarget = function() {
  const target = this.getTarget();
  this.smartMoveTowardCoordinates(target.getX(), target.getY());
};

/**
 * Tries to move this battler toward a set of coordinates.
 * @param {number} x The `x` coordinate to reach.
 * @param {number} y The `y` coordinate to reach.
 */
JABS_Battler.prototype.smartMoveTowardCoordinates = function(x, y) {
  const character = this.getCharacter();
  const nextDir = character.findDiagonalDirectionTo(x, y);

  if (character.isMoveDiagonally(nextDir)) {
    const horzvert = character.getDiagonallyMovement(nextDir);
    character.moveDiagonally(horzvert[0], horzvert[1]);
  } else {
    character.moveStraight(nextDir);
  }
};

/**
 * Turns this battler towards it's current target.
 */
JABS_Battler.prototype.turnTowardTarget = function() {
  const character = this.getCharacter();
  const target = this.getTarget();
  character.turnTowardCharacter(target.getCharacter());
};

/**
 * Turns this battler towards it's current target.
 * @param {JABS_Battler} target The battler to face.
 */
JABS_Battler.prototype.turnTowardDesignatedTarget = function(target) {
  const character = this.getCharacter();
  character.turnTowardCharacter(target.getCharacter());
};

//#endregion reference helpers

//#region isReady & cooldowns
/**
 * Initializes a cooldown with the given key.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration to initialize this cooldown with.
 */
JABS_Battler.prototype.initializeCooldown = function(cooldownKey, duration) {
  if (!this._cooldowns[cooldownKey]) {
    this._cooldowns[cooldownKey] = {};
    this._cooldowns[cooldownKey].frames = duration;
    this._cooldowns[cooldownKey].ready = true;
    this._cooldowns[cooldownKey].comboNextActionId = 0;
    this._cooldowns[cooldownKey].comboFrames = 0;
    this._cooldowns[cooldownKey].comboReady = false;
  }
};

/**
 * Gets the cooldown data for a given cooldown key.
 * @param {string} cooldownKey The cooldown to lookup.
 */
JABS_Battler.prototype.getCooldown = function(cooldownKey) {
  return this._cooldowns[cooldownKey];
};

/**
 * Whether or not this battler has finished it's post-action cooldown phase.
 * @returns {boolean} True if the battler is cooled down, false otherwise.
 */
JABS_Battler.prototype.isPostActionCooldownComplete = function() {
  if (this._postActionCooldownComplete) {
    // we are ready to do idle things.
    return true;
  } else {
    if (this._postActionCooldown <= this._postActionCooldownMax) {
      // we are still charging up...
      this._postActionCooldown++;
      return false;
    }
    this._postActionCooldownComplete = true;
    this._postActionCooldown = 0;

    // we are ready to finish phase3!
    return true;
  }
};

/**
 * Retrieves the battler's idle state.
 * @returns {boolean} True if the battler is idle, false otherwise.
 */
JABS_Battler.prototype.isIdle = function() {
  return this._idle;
};

/**
 * Sets whether or not this battler is idle.
 * @param {boolean} isIdle True if this battler is idle, false otherwise.
 */
JABS_Battler.prototype.setIdle = function(isIdle) {
  this._idle = isIdle;
};

/**
 * Whether or not this battler is ready to perform an idle action.
 * @returns {boolean} True if the battler is idle-ready, false otherwise.
 */
JABS_Battler.prototype.isIdleActionReady = function() {
  if (this._idleActionReady) {
    // we are ready to do idle things.
    return true;
  } else {
    if (this._idleActionCount <= this._idleActionCountMax) {
      // we are still charging up...
      this._idleActionCount++;
      return false;
    }
    this._idleActionReady = true;
    this._idleActionCount = 0;

    // we are ready to idle!
    return true;
  }
};

/**
 * Whether or not the skilltype has a base or combo cooldown ready.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @returns {boolean} True if the given skilltype is ready, false otherwise.
 */
JABS_Battler.prototype.isSkillTypeCooldownReady = function(cooldownKey) {
  return this.isBaseCooldownReady(cooldownKey) || this.isComboCooldownReady(cooldownKey);
};

/**
 * Counts down the base action cooldown for this key.
 * @param {string} cooldownKey The key of this cooldown.
 */
JABS_Battler.prototype.countdownBaseCooldown = function(cooldownKey) {
  if (this._cooldowns[cooldownKey].ready) {
    // if the base cooldown is ready, then clear the combo data.
    this._cooldowns[cooldownKey].comboReady = false;
    this._cooldowns[cooldownKey].comboNextActionId = 0;
    return true;
  } else {
    if (this._cooldowns[cooldownKey].frames > 0) {
      this._cooldowns[cooldownKey].frames--;
      return false;
    }

    this._cooldowns[cooldownKey].ready = true;
    this._cooldowns[cooldownKey].frames = 0;
  }
};

/**
 * Whether or not the regular action's cooldown is ready.
 * @param {string} cooldownKey The key of this cooldown.
 * @returns {boolean} True if the base cooldown is ready, false otherwise.
 */
JABS_Battler.prototype.isBaseCooldownReady = function(cooldownKey) {
  if (!this._cooldowns[cooldownKey]) {
    // this cooldown was never initialized for some reason- initialize it.
    this.initializeCooldown(cooldownKey, 120); // TODO: parameterize default value?
    return false;
  } else {
    return this._cooldowns[cooldownKey].ready;
  }
};

/**
 * Counts down the combo action cooldown for this key.
 * @param {string} cooldownKey The key of this cooldown.
 */
JABS_Battler.prototype.countdownComboCooldown = function(cooldownKey) {
  if (!this._cooldowns[cooldownKey].comboNextActionId) return;

  if (this._cooldowns[cooldownKey].comboReady) {
    return;
  } else {
    if (this._cooldowns[cooldownKey].comboFrames > 0) {
      this._cooldowns[cooldownKey].comboFrames--;
      return;
    }

    this._cooldowns[cooldownKey].comboReady = true;
    this._cooldowns[cooldownKey].comboFrames = 0;
  }
};

/**
 * Whether or not the combo action for this skill is ready.
 * @param {string} cooldownKey The key of this cooldown.
 * @returns {boolean} True if the combo cooldown is ready, false otherwise.
 */
JABS_Battler.prototype.isComboCooldownReady = function(cooldownKey) {
  if (!this._cooldowns[cooldownKey].comboNextActionId) return false;
  return this._cooldowns[cooldownKey].comboReady;
};

/**
 * Modifies the cooldown for this key by a given amount.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.modCooldownCounter = function(cooldownKey, duration) {
  this._cooldowns[cooldownKey].frames += duration;
  if (this._cooldowns[cooldownKey].frames > 0) {
    this._cooldowns[cooldownKey].ready = false;
  }

  if (this._cooldowns[cooldownKey].frames <= 0) {
    this._cooldowns[cooldownKey].ready = true;
    this._cooldowns[cooldownKey].frames = 0;
  }
};

/**
 * Set the cooldown timer to a designated number.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.setCooldownCounter = function(cooldownKey, duration) {
  this._cooldowns[cooldownKey].frames = duration;
  if (this._cooldowns[cooldownKey].frames == 0) {
    this._cooldowns[cooldownKey].ready = true;
  }

  if (this._cooldowns[cooldownKey].frames > 0) {
    this._cooldowns[cooldownKey].ready = false;
  }
};

/**
 * Resets this battler's combo information.
 * @param {string} cooldownKey The key of this cooldown.
 */
JABS_Battler.prototype.resetComboData = function(cooldownKey) {
  this._cooldowns[cooldownKey].comboFrames = 0;
  this._cooldowns[cooldownKey].comboNextActionId = 0;
  this._cooldowns[cooldownKey].comboReady = false;
};

/**
 * Sets the combo frames to be a given value.
 * @param {string} cooldownKey The key associated with the cooldown.
 * @param {number} frames The number of frames until this combo action is ready.
 */
JABS_Battler.prototype.setComboFrames = function(cooldownKey, frames) {
  this._cooldowns[cooldownKey].comboFrames = frames;
  if (this._cooldowns[cooldownKey].comboFrames > 0) {
    this._cooldowns[cooldownKey].comboReady = false;
  }

  if (this._cooldowns[cooldownKey].comboFrames <= 0) {
    this._cooldowns[cooldownKey].comboReady = true;
    this._cooldowns[cooldownKey].comboFrames = 0;
  }
};

/**
 * Whether or not this battler is ready to take action of any kind.
 * @returns {boolean} True if the battler is ready, false otherwise.
 */
JABS_Battler.prototype.isActionReady = function() {
  if (this._prepareReady) {
    // we are ready to take action.
    return true;
  } else {
    if (this._prepareCounter < this._prepareMax) {
      // we are still charging up...
      this._prepareCounter++;
      return false;
    }

    this._prepareReady = true;
    this._prepareCounter = 0;
    // we are charged up now!
    return true;
  }
};

/**
 * Determines the number of frames between opportunity to take the next action.
 * This maps to time spent in phase1 of JABS AI.
 * @returns {number} The number of frames between actions.
 */
JABS_Battler.prototype.getPrepareTime = function() {
  if (!this.isPlayer()) {
    const prepareTime = this.getBattler().prepareTime();
    return prepareTime;
  }
};

/**
 * Determines whether or not a skill can be executed based on restrictions or not.
 * @param {number} chosenSkillId The skill id to be executed.
 * @returns {boolean} True if this skill can be executed, false otherwise.
 */
JABS_Battler.prototype.canExecuteSkill = function(chosenSkillId) {
  const canUseSkills = this.canBattlerUseSkills();
  const canUseAttacks = this.canBattlerUseAttacks();
  const basicAttackId = this.getEnemyBasicAttack()[0];

  // if can't use basic attacks or skills, then autofail.
  if (!canUseSkills && !canUseAttacks) {
    return false;
  }

  // if the skill is a basic attack, but the battler can't attack, then fail.
  const isBasicAttack = chosenSkillId === basicAttackId;
  if (!canUseAttacks && isBasicAttack) {
    return false;
  }

  // if the skill is an assigned skill, but the battler can't use skills, then fail.
  if (!canUseSkills && !isBasicAttack) {
    return false;
  }

  // if the skill cost is more than the battler has resources for, then fail.
  const battler = this.getBattler();
  if (!battler.canPaySkillCost($dataSkills[chosenSkillId])) {
    return false;
  }

  // all criteria are met! this skill can be cast 🌞.
  return true;
};
//#endregion isReady & cooldowns

//#region get data
/**
 * Gets the skill id of the next combo action in the sequence.
 * @returns {number} The skill id of the next combo action.
 */
JABS_Battler.prototype.getComboNextActionId = function(cooldownKey) {
  return this._cooldowns[cooldownKey].comboNextActionId;
};

/**
 * Sets the skill id for the next combo action in the sequence.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @param {number} nextComboId The skill id for the next combo action.
 */
JABS_Battler.prototype.setComboNextActionId = function(cooldownKey, nextComboId) {
  this._cooldowns[cooldownKey].comboNextActionId = nextComboId;
};

/**
 * Gets all skills that are available to this enemy battler.
 * @returns {[number, number][]} The skill ids available to this enemy.
 */
JABS_Battler.prototype.getSkillIdsFromEnemy = function() {
  const battler = this.getBattler();
  const battlerData = $dataEnemies[battler.enemyId()];
  if (battlerData.actions.length > 0) {
    const skillIdRatings = battlerData.actions.map(action => {
      //return [action.skillId, action.rating];
      return action.skillId;
    })

    return skillIdRatings;
  } else {
    return [];
  }
};

/**
 * Retrieves the `[skillId, rating]` of the basic attack for this enemy.
 * @returns {[number, number]} The `[skillId, rating]` of the basic attack.
 */
JABS_Battler.prototype.getEnemyBasicAttack = function() {
  const battler = this.getBattler();
  const basicAttackSkill = battler.skillId();
  return [basicAttackSkill, 5];
};

/**
 * Gets the number of additional/bonus hits per basic attack.
 * Skills (such as magic) do not receive bonus hits at this time.
 * @param {object} skill The skill to consider regarding bonus hits.
 * @param {boolean} isBasicAttack True if this is a basic attack, false otherwise.
 * @returns {number} The number of bonus hits per attack.
 */
JABS_Battler.prototype.getAdditionalHits = function(skill, isBasicAttack) {
  // TODO: enemies don't get bonus hits (yet).
  if (this.isEnemy()) return 0;

  let bonusHits = 0;
  const battler = this.getBattler();
  if (isBasicAttack) {
    // TODO: split "basic attack" bonus hits from "skill" and "all" bonus hits.
    bonusHits += battler.getBonusHits();
  } else {
    // check for skills that may have non-pierce-related bonus hits?
  }

  return bonusHits;
};

/**
 * Gets the speedboost values for this battler.
 * @returns {number} The speedboost value.
 */
JABS_Battler.prototype.getSpeedBoosts = function() {
  // only calculate for the player (and allies).
  if (this.isEnemy()) return 0;

  let speedBoosts = this.getBattler().getSpeedBoosts();
  return speedBoosts;
};
//#endregion get data

//#region create/apply effects
/**
 * Performs a preliminary check to see if the target is actually able to be hit.
 * @returns {boolean} True if actions can potentially connect, false otherwise.
 */
JABS_Battler.prototype.canActionConnect = function() {
  // this battler is untargetable.
  if (this.isInvincible() || this.isHidden()) return false;

  // the player cannot be targeted while holding the DEBUG button.
  if (this.isPlayer() && Input.isPressed(J.ABS.Input.Cheat)) return false;

  // precise timing allows for battlers to hit other battlers the instant they
  // meet event conditions, and that is not grounds to hit enemies.
  if (this.getCharacter().isAction()) return false;

  // passes all the criteria.
  return true;
};

/**
 * Determines whether or not this battler is available as a target based on the
 * provided action's scopes.
 * @param {JABS_Action} action The action to check validity for.
 * @param {JABS_Battler} target The potential candidate for hitting with this action.
 * @param {boolean} alreadyHitOne Whether or not this action has already hit a target.
 */
JABS_Battler.prototype.isWithinScope = function(action, target, alreadyHitOne) {
  const user = action.getCaster();
  const gameAction = action.getAction();
  const scopeAlly = gameAction.isForFriend();
  const scopeOpponent = gameAction.isForOpponent();
  const scopeSingle = gameAction.isForOne();
  const scopeSelf = gameAction.isForUser();
  const scopeMany = gameAction.isForAll();
  const scopeEverything = gameAction.isForEveryone();
  const scopeAllAllies = scopeAlly && scopeMany;
  const scopeAllOpponents = scopeOpponent && scopeMany;

  const targetIsSelf = user.getUuid() === target.getUuid();
  const actionIsSameTeam = user.getTeam() === this.getTeam();
  const targetIsOpponent = !user.isSameTeam(this.getTeam());

  // scope is for 1 target, and we already found one.
  if (scopeSingle && alreadyHitOne) {
    return false;
  }

  // the caster and target are the same.
  if (targetIsSelf && (scopeSelf || scopeAlly || scopeAllAllies || scopeEverything)) {
    return true;
  }

  // action is from one of the target's allies.
  if (actionIsSameTeam && (scopeAlly || scopeAllAllies || scopeEverything)) {
    return true;
  }

  // action is for enemy battlers and scope is for opponents.
  if (targetIsOpponent && (scopeOpponent || scopeAllOpponents || scopeEverything)) {
    return true;
  }

  // meets no criteria, target is not within scope of this action.
  return false;
};

/**
 * Creates a new `JABS_Action` from a skill id.
 * @param {number} skillId The id of the skill to create a `JABS_Action` from.
 * @param {boolean} isRetaliation True if this is a retaliation action, false otherwise.
 * @param {string} cooldownKey The cooldown key associated with this action.
 * @returns {JABS_Action[]} The `JABS_Action` based on the skill id provided.
 */
JABS_Battler.prototype.createMapActionFromSkill = function(
  skillId, 
  isRetaliation = false, 
  cooldownKey = null) {
    const battler = this.getBattler();
    const skill = $dataSkills[skillId];
    const action = new Game_Action(battler);
    action.setSkill(skill.id);
    const isSupportAction = action.isForFriend();

    let { cooldown, range, actionId, duration, shape, piercing, projectile, proximity, direct } = skill._j;
    let isBasicAttack = false;
    if (this.isActor() && cooldownKey) {
      isBasicAttack = (cooldownKey === Game_Actor.JABS_MAINHAND || cooldownKey === Game_Actor.JABS_OFFHAND);
      const bonusHits = this.getAdditionalHits(skill, isBasicAttack);
      piercing[0] += bonusHits;
    }

    if (!duration) {
      duration = JABS_Action.getMinimumDuration();
    }

    let actions = [];

    const projectileDirections = $gameBattleMap.determineActionDirections(
      this.getCharacter().direction(), 
      projectile);
    
    projectileDirections.forEach(direction => {
      const mapAction = new JABS_Action(
        skill,          // the skill data
        this.getTeam(), // the caster's team id
        cooldown,       // cooldown frames
        range,          // the aoe range of the skill (affects collision)
        proximity,      // the proximity required to use this skill
        shape,          // the collision hitbox
        action,         // the Game_Action itself
        this,           // the JABS_Battler caster
        actionId,       // the action id to use
        duration,       // the duration this action persists on the map
        piercing,       // the piercing data
        isRetaliation,  // whether or not this is a retaliation
        direction,      // the direction this action is initially facing
        isBasicAttack,  // whether or not this is a basic attack
        isSupportAction,// whether or not this is a support action
        direct,         // whether or not this is a direct-targeting action
      );

      actions.push(mapAction);
    });

    return actions;
};

/**
 * Constructs the attack data from this battler's skill slot.
 * @param {string} cooldownKey The key to build the combat action from.
 * @returns {JABS_Action[]} The constructed `JABS_Action`.
 */
JABS_Battler.prototype.getAttackData = function(cooldownKey) {
  const battler = this.getBattler()
  const id = battler.getEquippedSkill(cooldownKey);
  if (!id) return null;

  const canUse = battler.canUse($dataSkills[id]);
  if (!canUse) {
    return null;
  }

  const comboActionId = this.getComboNextActionId(cooldownKey);
  this.resetComboData(cooldownKey);
  if (comboActionId != 0) {
    const canUseCombo = battler.canUse($dataSkills[comboActionId]);
    if (!canUseCombo) {
      return null;
    }

    const comboMapActions = this.createMapActionFromSkill(comboActionId, false, cooldownKey);
    return comboMapActions;
  }

  const attackMapActions = this.createMapActionFromSkill(id, false, cooldownKey);
  return attackMapActions;
};

/**
 * Consumes an item and performs its effects.
 * @param {number} toolId The id of the tool/item to be used.
 * @param {boolean} isLoot Whether or not this is a loot pickup.
 */
JABS_Battler.prototype.applyToolEffects = function(toolId, isLoot = false) {
  const item = $dataItems[toolId];
  const playerBattler = this.getBattler();
  playerBattler.consumeItem(item);
  const gameAction = new Game_Action(playerBattler);
  gameAction.setItem(toolId);

  // handle scopes of the tool.
  const scopeSelf = gameAction.isForUser();
  const scopeAlly = gameAction.isForFriend();
  const scopeOpponent = gameAction.isForOpponent();
  const scopeSingle = gameAction.isForOne();
  const scopeAll = gameAction.isForAll();
  const scopeEverything = gameAction.isForEveryone();

  const scopeAllAllies = scopeEverything || (scopeAll && scopeAlly);
  const scopeAllOpponents = scopeEverything || (scopeAll && scopeOpponent);
  const scopeOneAlly = (scopeSingle && scopeAlly);
  const scopeOneOpponent = (scopeSingle && scopeOpponent);

  // apply tool effects based on scope.
  if (scopeSelf || scopeOneAlly) {
    this.applyToolToPlayer(toolId);
  } else if (scopeEverything) {
    this.applyToolForAllAllies(toolId);
    this.applyToolForAllOpponents(toolId);
  } else if (scopeOneOpponent) {
    // TODO: do things related to a single opponent... but we need a target?
  } else if (scopeAllAllies) {
    this.applyToolForAllAllies(toolId);
  } else if (scopeAllOpponents) {
    this.applyToolForAllOpponents(toolId);
  } else {
    console.warn("unhandled scope for tool!", gameAction.item().scope);
  }

  // applies common events that may be a part of an item's effect.
  gameAction.applyGlobal();

  // create the log for the tool use.
  this.createToolLog(item);

  const { cooldown: itemCooldown, skillId: itemSkillId } = item._j;

  // it is an item with a custom cooldown.
  if (itemCooldown) {
    if (!isLoot) this.modCooldownCounter(Game_Actor.JABS_TOOLSKILL, itemCooldown);
  }

  // it was an item with a skill attached.
  if (itemSkillId) {
    const mapAction = this.createMapActionFromSkill(itemSkillId);
    if (Array.isArray(mapAction)) {
      mapAction.forEach(action => {
        action.setCooldownType(Game_Actor.JABS_TOOLSKILL);
        $gameBattleMap.executeMapAction(this, action);
      });
    } else {
      mapAction.setCooldownType(Game_Actor.JABS_TOOLSKILL);
      $gameBattleMap.executeMapAction(this, mapAction);
    }
  }

  // it was an item, didn't have a skill attached, and didn't have a cooldown.
  if (!itemCooldown && !itemSkillId) {
    if (!isLoot) {
      this.modCooldownCounter(
        Game_Actor.JABS_TOOLSKILL, 
        J.ABS.DefaultValues.CooldownlessItems);
    }
  }

  // if the last item was consumed, unequip it.
  if (!isLoot && !$gameParty.items().includes(item)) {
    playerBattler.setEquippedSkill(Game_Actor.JABS_TOOLSKILL, 0);
    const lastItemMessage = `The last ${item.name} was consumed and unequipped.`;
    const log = new Map_TextLog(lastItemMessage, -1);
    $gameTextLog.addLog(log);
  }
};

/**
 * Applies the effects of the tool against the leader.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolToPlayer = function(toolId) {
  // apply tool effects against player.
  const playerBattler = this.getBattler();
  const playerGameAction = new Game_Action(playerBattler);
  playerGameAction.setItem(toolId);
  playerGameAction.apply(playerBattler);

  // display popup from item.
  const tool = $dataItems[toolId];
  const playerCharacter = this.getCharacter();
  const popup = $gameBattleMap.configureDamagePop(playerGameAction, tool, this, this);
  playerCharacter.addTextPop(popup);
  playerCharacter.setRequestTextPop();

  // show tool animation.
  playerCharacter.requestAnimation(tool.animationId, false);
};

/**
 * Applies the effects of the tool against all allies on the team.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForAllAllies = function(toolId) {
  const battlers = $gameParty.battleMembers();
  if (battlers.length > 1) {
    battlers.shift(); // remove the leader, because thats the player.
    battlers.forEach(battler => {
      const gameAction = new Game_Action(battler);
      gameAction.setItem(toolId);
      gameAction.apply(battler);
    });
  }

  // also apply effects to player/leader.
  this.applyToolToPlayer(toolId);
};

/**
 * Applies the effects of the tool against all opponents on the map.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForAllOpponents = function(toolId) {
  const item = $dataItems[toolId];
  const battlers = $gameMap.getEnemyBattlers();
  battlers.forEach(jabsBattler => {
    const battler = jabsBattler.getBattler();
    const gameAction = new Game_Action(battler);
    gameAction.apply(battler);
    const battlerSprite = jabsBattler.getCharacter();
    const popup = $gameBattleMap.configureDamagePop(gameAction, item, this, jabsBattler);
    battlerSprite.addTextPop(popup);
    battlerSprite.setRequestTextPop();
  });
};

/**
 * Creates the text log entry for executing an tool effect.
 */
JABS_Battler.prototype.createToolLog = function(item) {
  // if not enabled, skip this.
  if (!J.TextLog.Metadata.Active) return;

  const battleMessage = `${this.getReferenceData().name} used the ${item.name}.`;
  const log = new Map_TextLog(battleMessage, -1);
  $gameTextLog.addLog(log);
};
//#endregion apply effects

//#region guarding
/**
 * Whether or not the precise-parry window is active.
 * @returns {boolean}
 */
JABS_Battler.prototype.parrying = function() {
  return this._parryWindow > 0;
};

/**
 * Sets the battlers precise-parry window frames.
 * @param {number} parryFrames The number of frames available for precise-parry.
 */
JABS_Battler.prototype.setParryWindow = function(parryFrames) {
  if (parryFrames < 0) {
    this._parryWindow = 0;
  } else {
    this._parryWindow = parryFrames;
  }
};

/**
 * Get whether or not this battler is currently guarding.
 * @returns {boolean}
 */
JABS_Battler.prototype.guarding = function() {
  return this._isGuarding;
};

/**
 * Set whether or not this battler is currently guarding.
 * @param {boolean} isGuarding True if the battler is guarding, false otherwise.
 */
JABS_Battler.prototype.setGuarding = function(isGuarding) {
  this._isGuarding = isGuarding;
};

/**
 * The flat amount to reduce damage by when guarding.
 * @returns {number}
 */
JABS_Battler.prototype.flatGuardReduction = function() {
  if (!this.guarding()) return 0;

  return this._guardFlatReduction;
};

/**
 * Sets the battler's flat reduction when guarding.
 * @param {number} flatReduction The flat amount to reduce when guarding.
 */
JABS_Battler.prototype.setFlatGuardReduction = function(flatReduction) {
  this._guardFlatReduction = flatReduction;
};

/**
 * The flat amount to reduce damage by when guarding.
 * @returns {number}
 */
JABS_Battler.prototype.percGuardReduction = function() {
  if (!this.guarding()) return 0;

  return this._guardPercReduction;
};

/**
 * Sets the battler's flat reduction when guarding.
 * @param {number} flatReduction The flat amount to reduce when guarding.
 */
JABS_Battler.prototype.setPercGuardReduction = function(percReduction) {
  this._guardPercReduction = percReduction;
};

/**
 * Gets the id of the skill to retaliate with when successfully guarding.
 * @returns {number}
 */
JABS_Battler.prototype.counterGuard = function() {
  return this.guarding()
  ? this._counterGuardId
  : 0;
};

/**
 * Sets the battler's retaliation id for guarding.
 * @param {number} counterGuardSkillId The skill id to counter with while guarding.
 */
JABS_Battler.prototype.setCounterGuard = function(counterGuardSkillId) {
  this._counterGuardId = counterGuardSkillId;
};

/**
 * Gets the id of the skill to retaliate with when successfully precise-parrying.
 * @returns {number}
 */
JABS_Battler.prototype.counterParry = function() {
  return this.guarding()
  ? this._counterParryId
  : 0;
};

/**
 * Constructs the guard data from this battler's skill slot.
 * @param {string} cooldownKey The key to build the guard data from.
 * @returns {[number, boolean, number, number, number]}
 */
JABS_Battler.prototype.setCounterParry = function(counterParrySkillId) {
  this._counterParryId = counterParrySkillId;
};

/**
 * Gets the id of the skill to retaliate with when successfully precise-parrying.
 * @returns {number}
 */
JABS_Battler.prototype.getGuardData = function(cooldownKey) {
  const battler = this.getBattler()
  const id = battler.getEquippedSkill(cooldownKey);
  if (!id) return null;

  const canUse = battler.canUse($dataSkills[id]);
  if (!canUse) {
    return null;
  }

  const skill = $dataSkills[id];
  const { guard, parry, counterGuard, counterParry } = skill._j;
  return [guard[0], guard[1], parry, counterGuard, counterParry];
};

/**
 * Determines whether or not the skill slot is a guard-type skill or not.
 * @param {string} cooldownKey The key to determine if its a guard skill or not.
  * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.prototype.isGuardSkillByKey = function(cooldownKey) {
  const battler = this.getBattler();
  const id = battler.getEquippedSkill(cooldownKey);
  if (!id) return false;

  const isGuardSkillType = JABS_Battler.isGuardSkillById(id);
  return isGuardSkillType;
};

/**
 * Triggers and maintains the guard state.
 * @param {boolean} guarding True if the battler is guarding, false otherwise.
 * @param {string} skillSlot The skill slot to build guard data from.
 */
JABS_Battler.prototype.executeGuard = function(guarding, skillSlot) {
  // if we're still guarding, and already in a guard state, don't reset.
  if (guarding && this.guarding()) return;

  // if not guarding anymore, turn off the guard state.
  if (!guarding && this.guarding()) {
    this.setGuarding(false);
    this.setParryWindow(0);
    this.endAnimation();
    return;
  }

  // if we aren't guarding, and weren't guarding, don't do anything.
  if (!guarding) return;

  // if not guarding, wasn't guarding before, but want to guard, then let's guard!
  const guardData = this.getGuardData(skillSlot);
  
  // if there is no guard data, don't try to guard.
  if (!guardData || !guardData.length) return;

  // begin guarding!
  this.setGuarding(true);
  this.setFlatGuardReduction(guardData[0]);
  this.setPercGuardReduction(guardData[1]);
  this.setCounterGuard(guardData[3]);
  this.setCounterParry(guardData[4]);

  // if the guarding skill has a parry window, apply those frames once.
  if (guardData[2]) this.setParryWindow(guardData[2]);

  // set the pose!
  const skill = $dataSkills[this.getBattler().getEquippedSkill(skillSlot)];
  this.performActionPose(skill);
};

/**
 * Counts down the parry window that occurs when guarding is first activated.
 */
JABS_Battler.prototype.countdownParryWindow = function() {
  if (this.parrying()) {
    this._parryWindow--;
  }

  if (this._parryWindow < 0) {
    this._parryWindow = 0;
  }
};
//#endregion guarding

//#region actionposes/animations
/**
 * Executes an action pose.
 * @param {skill} skill The skill to pose for.
 */
JABS_Battler.prototype.performActionPose = function(skill) {
  if (this._animating) {
    this.endAnimation();
  }

  const character = this.getCharacter();
  const baseSpriteName = this.getCharacterSpriteName();
  let newCharacterSprite = "";
  let suffix = "";
  let index = this.getCharacterSpriteIndex();
  let duration = 0;
  if (skill._j.poseSuffix) {
    const notedata = skill._j.poseSuffix;
    suffix = notedata[0];
    index = notedata[1];
    duration = notedata[2];
    newCharacterSprite = `${baseSpriteName}${suffix}`;
    this.captureBaseSpriteInfo();
    this.setAnimationCount(duration);
  } else {
    return;
  }

  const exists = J.Base.Helpers.checkFile(`img/characters/${newCharacterSprite}.png`);
  if (exists) {
    character.setImage(newCharacterSprite, index);
  } else {
    //console.info(`Character image: [${newCharacterSprite}] w/ suffix of [${suffix}] is missing.`); 
  }
};

/**
 * Forcefully ends the pose animation.
 */
JABS_Battler.prototype.endAnimation = function() {
  this.setAnimationCount(0);
  this.resetAnimation();
};

/**
 * Sets the pose animation count to a given amount.
 * @param {number} count The number of frames to animate for.
 */
JABS_Battler.prototype.setAnimationCount = function(count) {
  this._animationFrames = count;
  if (this._animationFrames > 0) {
    this._animating = true;
  }

  if (this._animationFrames <= 0) {
    this._animating = false;
    this._animationFrames = 0;
  }
};

/**
 * Resets the pose animation for this battler.
 */
JABS_Battler.prototype.resetAnimation = function() {
  if (!this._baseSpriteImage && !this._baseSpriteIndex) return;
  if (this._animating) {
    this.endAnimation();
  }

  const originalImage = this._baseSpriteImage;
  const originalIndex = this._baseSpriteIndex;
  const currentImage = this.getCharacterSpriteName();
  const currentIndex = this.getCharacterSpriteIndex();
  const character = this.getCharacter();
  if (originalImage != currentImage || originalIndex != currentIndex) {
    character.setImage(originalImage, originalIndex);
  }
};

/**
 * Whether or not this battler is ready to take action of any kind.
 * @returns {boolean} True if the battler is ready, false otherwise.
 */
JABS_Battler.prototype.countdownAnimation = function() {
  // if guarding, then it must be a guard animation.
  if (this.guarding()) return;

  if (this._animationFrames > 0) {
    this._animationFrames--;
    if (this._animationFrames < 4) {
      this.getCharacter()._pattern = 0;
    } else if (this._animationFrames > 10) {
      this.getCharacter()._pattern = 2;
    } else {
      this.getCharacter()._pattern = 1;
    }
  } else {
    this.resetAnimation();
  }
};
//#endregion actionposes/animations

//#region utility helpers
/**
 * Forces a display of a emoji balloon above this battler's head.
 * @param {number} balloonId The id of the balloon to display on this character.
 */
JABS_Battler.prototype.showBalloon = function(balloonId) {
  $gameTemp.requestBalloon(this._event, balloonId);
};

/**
 * Displays an animation on the battler.
 * @param {number} animationId The id of the animation to play on the battler.
 */
JABS_Battler.prototype.showAnimation = function(animationId) {
  this.getCharacter().requestAnimation(animationId);
};
//#endregion utility helpers

//#endregion JABS_Battler

//#region JABS_BattlerAI
/**
 * An object representing the structure of the `JABS_Battler` AI.
 */
class JABS_BattlerAI {
  /**
   * @constructor
   * @param {boolean} basic Enable the most basic of AI (recommended).
   * @param {boolean} smart Add pathfinding pursuit and more.
   * @param {boolean} executor Add weakpoint targeting.
   * @param {boolean} defensive Add defending and support skills for allies.
   * @param {boolean} reckless Add skill spamming over attacking.
   * @param {boolean} healer Prioritize healing if health is low.
   * @param {boolean} follower Only attacks alone, obeys leaders.
   * @param {boolean} leader Enables ally coordination.
   */
  constructor(
    basic = true, 
    smart = false, 
    executor = false, 
    defensive = false, 
    reckless = false, 
    healer = false, 
    follower = false, 
    leader = false) {
      /**
       * The most basic of AI: just move and take action. 
       * 
       * `10000000`, first bit.
       */
      this.basic = basic;

      /**
       * Adds an additional skillset; enabling intelligent pursuit among other things.
       * 
       * `01000000`, second bit.
       */
      this.smart = smart;

      /**
       * Adds an additional skillset; targeting a foe's weakspots if available.
       * 
       * `00100000`, third bit.
       */
      this.executor = executor;

      /**
       * Adds an additional skillset; allowing defending in place of action
       * and supporting allies with buff skills.
       * 
       * `00010000`, fourth bit.
       */
      this.defensive = defensive;
      
      /**
       * Adds an additional skillset; forcing skills whenever available.
       * 
       * `00001000`, fifth bit.
       */
      this.reckless = reckless;

      /**
       * Adds an additional skillset; prioritizing healing skills when either
       * oneself' or allies' current health reach below 66% of max health.
       * 
       * `00000100`, sixth bit.
       */
      this.healer = healer;

      /**
       * Adds an additional skillset; performs only basic attacks when
       * engaged. If a leader is nearby, a leader will encourage actually
       * available skills intelligently based on the target.
       * 
       * `00000010`, seventh bit.
       */
      this.follower = follower;

      /**
       * Adds an additional skillset; enables ally coordination.
       * 
       * `00000001`, eighth bit.
       */
      this.leader = leader;
  };

  /**
   * Decides an action for the designated follower based on the leader's ai.
   * @param {JABS_Battler} leaderBattler The leader deciding the action.
   * @param {JABS_Battler} followerBattler The follower executing the decided action.
   * @returns {JABS_Action} The decided action from the 
   */
  decideActionForFollower(leaderBattler, followerBattler) {
    // all follower actions are decided based on the leader's ai.
    const { smart, executor, defensive, healer } = this;
    const basicAttackId = followerBattler.getEnemyBasicAttack()[0];
    let skillsToUse = followerBattler.getSkillIdsFromEnemy();
    if (skillsToUse.length) {
      const modifiedSightRadius = leaderBattler.getSightRadius() + followerBattler.getSightRadius();
      if (healer || defensive) {
        // get nearby allies with the leader's modified sight range of both battlers.
        const allies = $gameMap.getBattlersWithinRange(leaderBattler, modifiedSightRadius);
  
        // prioritize healing when self or allies are low on hp.
        if (healer) {
          skillsToUse = this.filterSkillsHealerPriority(followerBattler, skillsToUse, allies);
        }
  
        // find skill that has the most buffs on it.
        if (defensive) {
          skillsToUse = this.filterSkillsDefensivePriority(skillsToUse, allies);
        }
      } else if (smart || executor) {
        // focus on the leader's target instead of the follower's target.
        skillsToUse = this.decideAttackAction(leaderBattler, skillsToUse);  
      }
    } else {
      // if there are no actual skills on this enemy, just use it's basic attack.
      return basicAttackId;
    }

    let chosenSkillId = Array.isArray(skillsToUse)
      ? skillsToUse[0]
      : skillsToUse;
    const followerGameBattler = followerBattler.getBattler();
    console.log(skillsToUse);
    const canPayChosenSkillCosts = followerGameBattler.canPaySkillCost($dataSkills[chosenSkillId]);
    if (!canPayChosenSkillCosts) {
      // if they can't pay the cost of the decided skill, check the basic attack.
      chosenSkillId = basicAttackId;
    }

    return chosenSkillId;
  };

  /**
   * Decides a support-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideSupportAction(user, skillsToUse) {
    const { healer, defensive } = this;
    const allies = $gameMap.getBattlersWithinRange(user, user.getSightRadius());

    // prioritize healing when self or allies are low on hp.
    if (healer) {
      skillsToUse = this.filterSkillsHealerPriority(user, skillsToUse, allies);
    }

    // find skill that has the most buffs on it.
    if (defensive) {
      skillsToUse = this.filterSkillsDefensivePriority(user, skillsToUse, allies);
    }

    return skillsToUse;
  }

  /**
   * Decides an attack-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {[skillId: number, weight: number][]} skillsToUse The available skills to use.
   */
  decideAttackAction(user, skillsToUse) {
    const { smart, executor } = this;
    const target = user.getTarget();

    // filter out skills that are elementally ineffective.
    if (smart) {
      skillsToUse = this.filterElementallyIneffectiveSkills(skillsToUse, target);
    }
  
    // find most elementally effective skill vs the target.
    if (executor) {
      skillsToUse = this.findMostElementallyEffectiveSkill(skillsToUse, target);
    }

    return skillsToUse;
  };

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will purge all elementally ineffective skills from the collection.
   * @param {object[]} skillsToUse The current collection of skills available.
   * @param {JABS_Battler} target The battler to decide the action about.
   * @returns {[skillId: number, weight: number][]}
   */
  filterElementallyIneffectiveSkills(skillsToUse, target) {
    if (skillsToUse.length > 1) {
      const smartSkills = skillsToUse.filter(skillId => {
        const testAction = new Game_Action(target.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        if (rate < 1) {
          return false;
        } else {
          return true;
        }
      });
      
      skillsToUse = smartSkills;
    }

    return skillsToUse;
  };

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will choose the skill that has the highest elemental effectiveness.
   * @param {object[]} skillsToUse The current collection of skills available.
   * @param {JABS_Battler} target The battler to decide the action about.
   * @returns {[skillId: number, rate: number]} The `[skillId, elementalRate]`.
   */
  findMostElementallyEffectiveSkill(skillsToUse, target) {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    if (skillsToUse.length > 1) {
      let elementalSkillCollection = [];
      skillsToUse.forEach(skillId => {
        const testAction = new Game_Action(target.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        elementalSkillCollection.push([skillId, rate]);
      });

      // sorts the skills by their elemental effectiveness.
      elementalSkillCollection.sort((a, b) => {
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
      });

      // only use the highest elementally effective skill.
      skillsToUse = elementalSkillCollection[0][0];
    }

    return skillsToUse;
  };

  filterSkillsDefensivePriority(user, skillsToUse, allies) {
    return skillsToUse;
  };

  filterSkillsHealerPriority(user, skillsToUse, allies) {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    // if we have no ai traits that affect skill-decision-making, then don't perform the logic.
    const { basic, smart, defensive, reckless } = this;
    if (!basic && !smart && !defensive && !reckless) return skillsToUse;

    let mostWoundedAlly = null;
    let lowestHpRatio = 1.01;
    let actualHpDifference = 0;
    let alliesBelow66 = 0;
    let alliesMissingAnyHp = 0;

    // iterate over allies to determine the ally with the lowest hp%
    allies.forEach(ally => {
      const battler = ally.getBattler();
      const hpRatio = battler.hp / battler.mhp;
      
      // if it is lower than the last-tracked-lowest, then update the lowest.
      if (lowestHpRatio > hpRatio) {
        lowestHpRatio = hpRatio;
        mostWoundedAlly = ally;
        actualHpDifference = battler.mhp - battler.hp;

        // count all allies below the "heal all" threshold.
        if (hpRatio <= 0.66) {
          alliesBelow66++;
        }
      }

      // count all allies missing any amount of hp.
      if (hpRatio < 1) {
        alliesMissingAnyHp++;
      }
    });

    // if there are no allies that are missing hp, then just return... unless we're reckless 🌚.
    if (!alliesMissingAnyHp && !reckless ) return skillsToUse;

    user.setAllyTarget(mostWoundedAlly);
    const mostWoundedAllyBattler = mostWoundedAlly.getBattler();

    // filter out the skills that aren't for allies.
    const healingTypeSkills = skillsToUse.filter(skillId => {
      const testAction = new Game_Action(mostWoundedAllyBattler);
      testAction.setSkill(skillId);
      return (testAction.isForAliveFriend() &&  // must target living allies.
        testAction.isRecover() &&               // must recover something.
        testAction.isHpEffect());               // must affect hp.
    });

    // if we have 0 or 1 skills left after healing, just return that.
    if (healingTypeSkills.length < 2) {
      return healingTypeSkills;
    }

    // determine the best skill based on AI traits.
    let bestSkillId = null;
    let runningBiggestHealAll = 0;
    let runningBiggestHealOne = 0;
    let runningClosestFitHealAll = 0;
    let runningClosestFitHealOne = 0;
    let runningBiggestHeal = 0;
    let biggestHealSkill = null;
    let biggestHealAllSkill = null;
    let biggestHealOneSkill = null;
    let closestFitHealAllSkill = null;
    let closestFitHealOneSkill = null;
    let firstSkill = false;
    healingTypeSkills.forEach(skillId => {
      const skill = $dataSkills[skillId];
      const testAction = new Game_Action(mostWoundedAllyBattler);
      testAction.setItemObject(skill);
      const healAmount = testAction.makeDamageValue(mostWoundedAllyBattler, false);
      if (Math.abs(runningBiggestHeal) < Math.abs(healAmount)) {
        biggestHealSkill = skillId;  
        runningBiggestHeal = healAmount;
      }

      // if this is our first skill in the possible heal skills available, write to all skills.
      if (!firstSkill) {
        biggestHealAllSkill = skillId;
        runningBiggestHealAll = healAmount;
        closestFitHealAllSkill = skillId;
        runningClosestFitHealAll = healAmount;
        biggestHealOneSkill = skillId;
        runningBiggestHealOne = healAmount;
        closestFitHealOneSkill = skillId;
        runningClosestFitHealOne = healAmount;
        firstSkill = true;
      }

      // analyze the heal all skills for biggest and closest fits.
      if (testAction.isForAll()) {
        // if this heal amount is bigger than the running biggest heal-all amount, then update.
        if (runningBiggestHealAll < healAmount) {
          biggestHealAllSkill = skillId;
          runningBiggestHealAll = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-all amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealAll - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference) {
          closestFitHealAllSkill = skillId;
          runningClosestFitHealAll = healAmount;
        }
      }

      // analyze the heal one skills for biggest and closest fits.
      if (testAction.isForOne()) {
        // if this heal amount is bigger than the running biggest heal-one amount, then update.
        if (runningBiggestHealOne < healAmount) {
          biggestHealOneSkill = skillId;
          runningBiggestHealOne = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-one amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealOne - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference) {
          closestFitHealOneSkill = skillId;
          runningClosestFitHealOne = healAmount;
        }
      }
    });

    // basic will just pick a random one from the four skill options.
    // basic will get overwritten if there are additional ai traits.
    if (basic) {
      const skillOptions = [biggestHealAllSkill, biggestHealOneSkill, closestFitHealAllSkill, closestFitHealOneSkill];
      const randomSkill = skillOptions[Math.randomInt(skillOptions.length)];
      bestSkillId = randomSkill;
    }

    // smart will decide in this order: 
    if (smart) {
      // - if any below 40%, then prioritize heal-one of most wounded.
      if (lowestHpRatio <= 0.40) {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;

      // - if none below 40% but multiple wounded, prioritize closest-fit heal-all.
      } else if (alliesMissingAnyHp > 1 && lowestHpRatio < 0.80) {
        bestSkillId = defensive ? biggestHealAllSkill : closestFitHealAllSkill;

      // - if only one wounded, then heal them.
      } else if (alliesMissingAnyHp === 1 && lowestHpRatio < 0.80) {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;
      // - if none wounded, or none below 80%, then don't heal.
      } else { }
    }

    // defensive will decide in this order:
    if (defensive && !smart) {
      // - if there is only one wounded ally, prioritize biggest heal-one skill.
      if (alliesMissingAnyHp === 1) {
        bestSkillId = biggestHealOneSkill;
      // - if there is more than one wounded ally, prioritize biggest heal-all skill.
      } else if (alliesMissingAnyHp > 1) {
        bestSkillId = biggestHealAllSkill;
      // - if none wounded, don't heal.
      } else { }
    }

    // reckless will decide in this order:
    if (reckless) {
      // - if there are any wounded allies, always use biggest heal skill, for one or all.
      if (alliesMissingAnyHp > 0) {
        bestSkillId = biggestHealSkill;
      // - if none wounded, don't heal.
      } else { }
    }

    return bestSkillId;
  };
}
//#endregion

//#region JABS_Action
/**
 * An object that binds a `Game_Action` to a `Game_Event` and `JABS_Battler`
 * on the map.
 */
class JABS_Action {
  /**
   * The minimum duration a `JABS_Action` must exist visually before cleaning it up.
   * 
   * All actions should exist visually for at least 1/5 of a second.
   */
  static getMinimumDuration = () => 8;

  /**
   * @constructor
   * @param {object} baseSkill The skill retrieved from `$dataSkills[id]`. 
   * @param {number} teamId A shorthand for the team id this skill belongs to.
   * @param {number} cooldownFrames The number of frames until the caster can act again.
   * @param {number} range The range of collision for this `JABS_Action`.
   * @param {number} proximity The proximity to the target required for using this `JABS_Action`.
   * @param {string} shape The shape of the range for this `JABS_Action`.
   * @param {JABS_Battler} caster The `JABS_Battler` who created this `JABS_Action`.
   * @param {number} actionId The id of the skill master map event representing this `JABS_Action`.
   * @param {number} duration The duration in frames of how long this event should exist.
   * @param {array} piercing The piercing data associated with the skill this `JABS_Action` represents.
   * @param {boolean} isRetaliation Whether or not this is a retaliation action.
   * @param {number} direction The direction this action will face initially.
   * @param {boolean} isBasicAttack Whether or not this is a basic attack action.
   * @param {boolean} isSupportAction Whether or not this is a support action for allies.
   */
  constructor(baseSkill, teamId, cooldownFrames, range, proximity, shape, 
    gameAction, caster, actionId, duration, piercing, isRetaliation, direction,
    isBasicAttack, isSupportAction, isDirect) {
      /**
       * The base skill object, in case needed for something.
       * @type {object}
       */
      this._baseSkill = baseSkill;

      /**
       * The team the owner of this skill is a part of.
       * @type {number}
       */
      this._teamId = teamId;

      /**
       * The number of frames before the battler using this action can act again.
       * @type {number}
       */
      this._cooldownFrames = cooldownFrames;

      /**
       * The range of collision for this action.
       * @type {number}
       */
      this._range = range;

      /**
       * The proximity required to use this skill.
       */
      this._proximity = proximity;

      /**
       * The shape of this action.
       * @type {string}
       */
      this._shape = shape;

      /**
       * The `Game_Action` to bind to the `Game_Event` and `JABS_Battler`.
       * @type {Game_Action}
       */
      this._gameAction = gameAction;

      /**
       * The `JABS_Battler` that used created this `JABS_Action`. 
       * @type {JABS_Battler}
       */
      this._caster = caster;
      
      /**
       * The id of the event that maps to this skill from the skill master map.
       * @type {number}
       */
      this._actionId = actionId;

      /**
       * The duration in frames for how long this event should last on
       * the battle map.
       * @type {number}
       */
      this._maxDuration = duration;

      /**
       * The object that defines the various properties associated with "piercing" for this `JABS_Action`.
       * `times` = if piercing, then this represents how many times this action can repeatedly hit.
       * `delay` = the number of frames between each individual hit for this action.
       * @type {object} Including properties: `times`, and `delay`.
       */
      this._piercingData = this.initPiercingData(piercing[0]);

      /**
       * The base pierce delay in frames.
       * @type {number}
       */
      this._basePierceDelay = piercing[1];

      /**
       * Whether or not this action was generated as a retaliation to another battler's action.
       * @type {boolean}
       */
      this._isRetaliation = isRetaliation;

      /**
       * The direction this projectile will initially face and move.
       * @type {number}
       */
      this._facing = direction;

      /**
       * Whether or not this action was generated from a mainhand or offhand skill.
       * @type {boolean}
       */
      this._isBasicAttack = isBasicAttack;

      /**
       * Whether or not this action is a support type skill, for targeting allies.
       * @type {boolean}
       */
      this._isSupportAction = isSupportAction;

      /**
       * Whether or not this action is a direct-targeting skill, for bypassing projectile movement.
       * @type {boolean}
       */
      this._isDirect = isDirect;
      this.initialize();
  }

  /**
   * Initializes all properties that don't require input parameters.
   */
  initialize = () => {
      /**
       * The type of action this is. Used for mapping cooldowns to the appropriate slot on the caster.
       * @type {string}
       */
      this._actionCooldownType = "global";
      
      /**
       * Whether or not this action has already begun animating.
       * @type {boolean}
       */
      this._animating = {};
      
      /**
       * The current timer on this particular action.
       * @type {number}
       */
      this._currentDuration = 0;
      
      /**
       * Whether or not the visual of this map action needs rendering.
       * @type {boolean}
       */
      this._needsCreation = true;
      
      /**
       * Whether or not the visual of this map action needs removing.
       * @type {boolean}
       */
      this._needsRemoval = false;

      /**
       * The `Game_Event` this `JABS_Action` is bound to. Represents the visual aspect on the map.
       * @type {Game_Event}
       */
      this._actionSprite = null;

      /**
       * Whether or not this action has had it's cooldown checked from a previous pierced hit.
       * @type {boolean}
       */
      this._cooldownChecked = false;
  }

  /**
   * Initializes the piercing data for this action.
   * @param {object} data The array of data.
   */
  initPiercingData = times => {
    const piercing = {
      times,
      delay: 0,
    };
    return piercing;
  };

  /**
   * Gets whether or not this action is a direct-targeting action.
   * @returns {boolean}
   */
  isDirectAction = () => this._isDirect;

  /**
   * Gets whether or not this action is a support action.
   * @returns {boolean}
   */
  isSupportAction = () => this._isSupportAction;

  /**
   * Gets whether or not this action is currently animating.
   * @param {string} targetKey The target's `uuid`.
   * @returns {boolean} True if it is currently animating, false otherwise.
   */
  getAnimating = targetKey => this._animating[targetKey];

  /**
   * Sets whether or not this action is currently animating against the target.
   * @param {string} targetKey The target's `uuid`.
   * @param {boolean} animating True if it is currently animating, false otherwise.
   */
  setAnimating = (targetKey, animating) => {
    this._animating[targetKey] = animating;
  };

  /**
   * Whether or not the cooldown has been applied.
   * @type {boolean} True if it has already been checked, false otherwise.
   */
  getCooldownChecked = () => this._cooldownChecked;

  /**
   * Prevents a single action that hits multiple times from applying cooldown multiple times.
   * @param {boolean} checked True if the cooldown has been checked, false otherwise (default = true).
   */
  setCooldownChecked = (checked = true) => this._cooldownChecked = checked;

  /**
   * Gets the name of the cooldown for this action.
   */
  getCooldownType = () => this._actionCooldownType;

  /**
   * Sets the name of the cooldown for tracking on the caster.
   * @param {string} type The name of the cooldown that this leverages.
   */
  setCooldownType = type => this._actionCooldownType = type;

  /**
   * Gets the base skill this `JABS_Action` is based on.
   * @returns {object} The base skill of this `JABS_Action`.
   */
  getBaseSkill = () => this._baseSkill;

  /**
   * A shorthand to retrieve this `JABS_Action`'s team it belongs to.
   * @returns {number} The team id of the caster of this `JABS_Action`.
   */
  getTeamId = () => this._teamId;

  /**
   * The number of frames until the caster of this `JABS_Action` may act again.
   * @returns {number} The cooldown frames of this `JABS_Action`.
   */
  getCooldown = () => {
    return this._cooldownFrames;
  };

  /**
   * Gets the range of which this `JABS_Action` will reach.
   * @returns {number} The range of this action.
   */
  getRange = () => this._range;

  /**
   * Gets the proximity to the target in order to use this `JABS_Action`.
   * @returns {number} The proximity required for this action.
   */
  getProximity = () => this._proximity;

  /**
   * The shape of the hitbox for this `JABS_Action`.
   */
  getShape = () => this._shape;

  /**
   * The base game action this `JABS_Action` is based on.
   * @returns {Game_Action} The base game action for this action.
   */
  getAction = () => this._gameAction;

  /**
   * Gets the `JABS_Battler` that created this `JABS_Action`.
   * @returns {JABS_Battler} The caster of this `JABS_Action`.
   */
  getCaster = () => this._caster;

  /**
   * Gets the event id associated with this `JABS_Action` from the action map.
   * @returns {number} The event id for this `JABS_Action`.
   */
  getActionId = () => this._actionId;

  /**
   * Gets the number of times this action can potentially hit a target.
   * @returns {number} The number of times remaining that this action can hit a target.
   */
  getPiercingTimes = () => this._piercingData.times;

  /**
   * Modifies the piercing times counter of this action by an amount (default = 1). If an action
   * reaches zero or less times, then it also sets it up for removal.
   * @param {number} decrement The number to decrement the times counter by for this action. 
   */
  modPiercingTimes = (decrement = 1) => {
    this._piercingData.times -= decrement;
    if (this._piercingData.times <= 0) {
      this.setNeedsRemoval();
    }
  };

  /**
   * Gets the delay between hits for this action.
   * @returns {number} The number of frames between repeated hits.
   */
  getPiercingDelay = () => this._piercingData.delay;

  /**
   * Modifies the piercing delay by this amount (default = 1). If a negative number is
   * provided, then this will increase the delay by that amount instead.
   * @param {number} decrement The amount to modify the delay by.
   */
  modPiercingDelay = (decrement = 1) => this._piercingData.delay -= decrement;

  /**
   * Resets the piercing delay of this action back to it's base.
   */
  resetPiercingDelay = () => this._piercingData.delay = this._basePierceDelay;

  /**
   * Gets whether or not this `JABS_Action` is a retaliation.
   * @returns {boolean} True if it is a retaliation, false otherwise.
   */
  isRetaliation = () => this._isRetaliation;

  /**
   * Gets whether or not this `JABS_Action` needs rendering.
   * @returns {boolean} Whether or not this action needs rendering.
   */
  getNeedsCreation = () => this._needsCreation;

  /**
   * Gets whether or not this `JABS_Action` needs removing.
   * @returns {boolean} Whether or not this action needs removing.
   */
  getNeedsRemoval = () => this._needsRemoval;

  /**
   * Sets whether or not this `JABS_Action` needs removing.
   * @param {boolean} remove Whether or not to remove this `JABS_Action`.
   */
  setNeedsRemoval = (remove = true) => this._needsRemoval = remove;

  /**
   * Gets the durations remaining on this `JABS_Action`.
   */
  getDuration = () => this._currentDuration;

  /**
   * Modifies the duration of this `JABS_Action` by a given amount.
   */
  modDuration = moreDuration => this._currentDuration += moreDuration;

  /**
   * Increments the duration for this `JABS_Action`. If the duration drops
   * to or below 0, then it will also flag this `JABS_Action` for removal.
   */
  countdownDuration = () => {
    this._currentDuration++;
    if (this._maxDuration <= this._currentDuration) {
      this.setNeedsRemoval();
    }
  };

  /**
   * Gets whether or not this action is expired and should be removed.
   * @returns {boolean} True if expired and past the minimum count, false otherwise.
   */
  isActionExpired = () => {
    const isExpired = this._maxDuration <= this._currentDuration;
    const minDurationElapsed = this._currentDuration > JABS_Action.getMinimumDuration();
    return (isExpired && minDurationElapsed) 
      ? true
      : false;
  };

  /**
   * Gets the `Game_Event` this `JABS_Action` is bound to.
   * The `Game_Event` represents the visual aspect of this action.
   * @returns {Game_Event}
   */
  getActionSprite = () => this._actionSprite;

  /**
   * Binds this `JABS_Action` to a provided `Game_Event`.
   * @param {Game_Event} actionSprite The `Game_Event` to bind to this `JABS_Action`.
   */
  setActionSprite = actionSprite => this._actionSprite = actionSprite;

  /**
   * Whether or not this action is a retaliation- meaning it will not invoke retaliation.
   * @returns {boolean} True if it is a retaliation, false otherwise.
   */
  get isRetaliation() {
    return this._isRetaliation;
  };

  /**
   * Gets the direction this action is facing.
   */
  get direction() {
    return this._facing || this.getActionSprite().direction();
  };

  /**
   * Gets whether or not this action is a basic attack (mainhand/offhand).
   * @returns {boolean} True if it is a basic attack, false otherwise.
   */
  get isBasicAttack() {
    return this._isBasicAttack;
  };
};
//#endregion

//#region JABS_TextPop
/**
 * The necessary data to construct a text popup on the map.
 */
class JABS_TextPop {
  /**
   * @constructor
   * @param {Game_ActionResult} baseActionResult The base action result.
   * @param {number} icon The icon to display alongside this popup.
   * @param {number} textColor The text color.
   * @param {boolean} isWeakness Whether or not this was weakness empowered.
   * @param {boolean} isStrength Whether or not this was strength reduced.
   * @param {string} type The type of popup this is.
   * @param {string} directValue If applicable, a direct value to popup.
   */
  constructor(
    baseActionResult,
    icon,
    textColor,
    isWeakness,
    isStrength,
    type,
    directValue = "") {
      /**
       * The base `Game_ActionResult` for this `JABS_TextPop`.
       * @type {Game_ActionResult} 
       */
      this._baseActionResult = baseActionResult;

      /**
       * The id of the icon to display alongside this `JABS_TextPop`.
       * @type {number} 
       */
      this._icon = icon;

      /**
       * The text color.
       * @type {number} 
       */
      this._textColor = textColor;

      /**
       * Whether or not this popup was multiplied by elemental weaknesses.
       * @type {boolean} 
       */
      this._isWeakness = isWeakness;

      /**
       * Whether or not this popup was reduced by elemental strengths.
       * @type {boolean} 
       */
      this._isStrength = isStrength;

      /**
       * The type of popup this is, such as damage, experience, loot, etc.
       * @type {string}
       */
      this._type = type;

      /**
       * The direct value to display. 
       * For use with non-battle-calculated popups.
       * @type {string}
       */
      this._directValue = directValue;
  }

  /**
   * Gets the base action result for the popup.
   * @returns {Game_ActionResult}
   */
  getBaseActionResult = () => this._baseActionResult;

  /**
   * Gets the icon id for the popup.
   * @returns {number}
   */
  getIcon = () => this._icon;

  /**
   * Gets the text color for the popup.
   * @returns {number}
   */
  getTextColor = () => this._textColor;

  /**
   * Gets the boolean for if this hit a weak spot.
   * @returns {boolean}
   */
  getIsWeakness = () => this._isWeakness;

  /**
   * Gets the boolean for if this was elementally resisted.
   * @returns {boolean}
   */
  getIsStrength = () => this._isStrength;

  /**
   * Gets the type of popup this is.
   * @returns {string}
   */
  getType = () => this._type;

  /**
   * Gets the direct value assigned to this popup.
   * @returns {string}
   */
  getDirectValue = () => this._directValue;
}
//#endregion

//#region JABS_LootDrop
/**
 * An object that represents the binding of a `Game_Event` to an item/weapon/armor.
 */
class JABS_LootDrop {
  constructor(object) {
    this._lootObject = object;
    this.initMembers();
  };

  /**
   * Initializes properties of this object that don't require parameters.
   */
  initMembers() {
    /**
     * The duration that this loot drop will exist on the map.
     * @type {number}
     */
    this._duration = 900;

    /**
     * The universally unique identifier for this loot drop.
     * @type {string}
     */
    this._uuid = J.Base.Helpers.generateUuid();
  };

  /**
   * Gets the duration remaining on this loot drop.
   * @returns {number}
   */
  get duration() {
    return this._duration;
  };

  /**
   * Sets the duration for this loot drop.
   */
  set duration(dur) {
    this._duration = dur;
  };

  /**
   * Whether or not this loot drop's duration is expired.
   * @returns {boolean} True if this loot is expired, false otherwise.
   */
  get expired() {
    return this._duration <= 0;
  };

  /**
   * Counts down the duration for this loot drop.
   */
  countdownDuration() {
    if (this._duration <= 0) return;

    this._duration--;
  };

  /**
   * Gets the underlying loot object.
   * @returns {object}
   */
  get lootData() {
    return this._lootObject;
  };

  /**
   * Gets the `iconIndex` for the underlying loot object.
   * @returns {number}
   */
  get lootIcon() {
    return this._lootObject.iconIndex;
  };

  /**
   * Gets whether or not this loot should be automatically consumed on pickup.
   * @returns {boolean}
   */
  get useOnPickup() {
    return this._lootObject._j.useOnPickup;
  }
};
//#endregion JABS_LootDrop

//#region JABS_BattlerCoreData
/**
 * A class containing all the data extracted from the comments of an event's
 * comments and contained with friendly methods to access and manipulate.
 */
function JABS_BattlerCoreData() { this.initialize(...arguments); }
//#region initialize battler
JABS_BattlerCoreData.prototype = {};
JABS_BattlerCoreData.prototype.constructor = JABS_BattlerCoreData;

/**
 * Initializes this battler data object.
 * @param {number} battlerId This enemy id.
 * @param {number} teamId This battler's team id.
 * @param {JABS_BattlerAI} battlerAI This battler's converted AI.
 * @param {number} sightRange The sight range.
 * @param {number} alertedSightBoost The boost to sight range while alerted.
 * @param {number} pursuitRange The pursuit range.
 * @param {number} alertedPursuitBoost The boost to pursuit range while alerted.
 * @param {number} alertDuration The duration in frames of how long to remain alerted.
 * @param {boolean} canIdle Whether or not this battler can idle.
 * @param {boolean} showHpBar Whether or not to show the hp bar.
 * @param {boolean} showDangerIndicator Whether or not to show the danger indiciator.
 * @param {boolean} showBattlerName Whether or not to show the battler's name.
 * @param {boolean} isInvincible Whether or not this battler is invincible.
 * @param {boolean} isInanimate Whether or not this battler is inanimate.
 */
JABS_BattlerCoreData.prototype.initialize = function(
  battlerId, teamId, battlerAI, sightRange, alertedSightBoost, pursuitRange, 
  alertedPursuitBoost, alertDuration, canIdle, showHpBar, showDangerIndicator,
  showBattlerName, isInvincible, isInanimate,
) {
  /**
   * The id of the enemy that this battler represents.
   * @type {number}
   */
  this._battlerId = battlerId;

  /**
   * The id of the team this battler belongs to.
   * @type {number}
   */
  this._teamId = teamId;

  /**
   * The converted-from-binary AI of this battler.
   * @type {JABS_BattlerAI}
   */
  this._battlerAI = battlerAI;

  /**
   * The base range that this enemy can and engage targets within.
   * @type {number}
   */
  this._sightRange = sightRange;

  /**
   * The boost to sight range this enemy gains while alerted.
   * @type {number}
   */
  this._alertedSightBoost = alertedSightBoost;

  /**
   * The base range that this enemy will pursue it's engaged target.
   * @type {number}
   */
  this._pursuitRange = pursuitRange;

  /**
   * The boost to pursuit range this enemy gains while alerted.
   * @type {number}
   */
  this._alertedPursuitBoost = alertedPursuitBoost;

  /**
   * The duration in frames that this enemy will remain alerted.
   * @type {number}
   */
  this._alertDuration = alertDuration;

  /**
   * Whether or not this battler will move around while idle.
   * @type {boolean} True if the battler can move while idle, false otherwise.
   */
  this._canIdle = canIdle;

  /**
   * Whether or not this battler's hp bar will be visible.
   * @type {boolean} True if the battler's hp bar should show, false otherwise.
   */
  this._showHpBar = showHpBar;

  /**
   * Whether or not this battler's danger indicator will be visible.
   * @type {boolean} True if the battler's danger indicator should show, false otherwise.
   */
   this._showDangerIndicator = showDangerIndicator;

  /**
   * Whether or not this battler's name will be visible.
   * @type {boolean} True if the battler's name should show, false otherwise.
   */
   this._showBattlerName = showBattlerName;

  /**
   * Whether or not this battler is invincible.
   * 
   * Invincible is defined as: `actions will not collide with this battler`.
   * @type {boolean} True if the battler is invincible, false otherwise.
   */
  this._isInvincible = isInvincible;

  /**
   * Whether or not this battler is inanimate. Inanimate battlers have a few
   * unique traits, those being: cannot idle, hp bar is hidden, cannot be alerted, 
   * does not play deathcry when defeated, and cannot engage in battle.
   * @type {boolean} True if the battler is inanimate, false otherwise.
   */
  this._isInanimate = isInanimate;
};

/**
 * Gets this battler's enemy id.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.battlerId = function() {
  return this._battlerId;
};

/**
 * Gets this battler's team id.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.team = function() {
  return this._teamId;
};

/**
 * Gets this battler's AI.
 * @returns {JABS_BattlerAI}
 */
JABS_BattlerCoreData.prototype.ai = function() {
  return this._battlerAI;
};

/**
 * Gets the base range that this enemy can engage targets within.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.sightRange = function() {
  return this._sightRange;
};

/**
 * Gets the boost to sight range while alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertedSightBoost = function() {
  return this._alertedSightBoost;
};

/**
 * Gets the base range that this enemy will pursue it's engaged target.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.pursuitRange = function() {
  return this._pursuitRange;
};

/**
 * Gets the boost to pursuit range while alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertedPursuitBoost = function() {
  return this._alertedPursuitBoost;
};

/**
 * Gets the duration in frames for how long this battler remains alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertDuration = function() {
  return this._alertDuration;
};

/**
 * Gets whether or not this battler will move around while idle.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.canIdle = function() {
  return this._canIdle;
};

/**
 * Gets whether or not this battler's hp bar will be visible.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.showHpBar = function() {
  return this._showHpBar;
};

/**
 * Gets whether or not this battler's danger indicator will be visible.
 * @returns {boolean}
 */
 JABS_BattlerCoreData.prototype.showDangerIndicator = function() {
  return this._showDangerIndicator;
};

/**
 * Gets whether or not this battler's name will be visible.
 * @returns {boolean}
 */
 JABS_BattlerCoreData.prototype.showBattlerName = function() {
  return this._showBattlerName;
};

/**
 * Gets whether or not this battler is `invincible`.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.isInvincible = function() {
  return this._isInvincible;
};

/**
 * Gets whether or not this battler is `inanimate`.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.isInanimate = function() {
  return this._isInanimate;
};
//#endregion JABS_BattlerCoreData
//#endregion JABS objects

//ENDFILE