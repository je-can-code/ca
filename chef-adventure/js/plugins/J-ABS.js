//#region Introduction
 /*:
 * @target MZ
 * @plugindesc 
 * Welcome to JABS,
 * J's Action Battle System!
 * @author JE
 * @url https://dev.azure.com/je-can-code/RPG%20Maker/_git/rmmz
 * @help
 * I'd recommend just peeking at the url attached to this plugin for details.
 * 
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Extensions
 * @default Modify Below
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param ABS System
 * @type boolean
 * @desc Turn on ABS?
 * @default true
 * 
 * @param Default Enemy Prepare Time
 * @type number
 * @desc The default number of frames for "prepare" time.
 * @default 180
 * 
 * @param Default Action Map Id
 * @type number
 * @desc The default id of the map used for cloning action events off of.
 * @default 2
 * 
 * @param Default Attack Animation Id
 * @type number
 * @desc The default id of the animation for battlers when none is defined.
 * @default 1
 * 
 * @param Default Dodge Skill Type Id
 * @type number
 * @desc The default id of the skill type that acts as a classification for dodge skills.
 * @default 1
 * 
 * @param Default Guard Skill Type Id
 * @type number
 * @desc The default id of the skill type that acts as a classification for guard skills.
 * @default 2
 * 
 * @param Default Tool Cooldown Time
 * @type number
 * @desc The default number of frames for an item's cooldown if one isn't specified.
 * @default 300
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
 */
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
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.Metadata = {};
J.ABS.Metadata.Name = `J-ABS`;
J.ABS.Metadata.Version = 1.00;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.PluginParameters = PluginManager.parameters(J.ABS.Metadata.Name);

J.ABS.Metadata.Enabled = Boolean(J.ABS.PluginParameters['ABS System']);
J.ABS.Metadata.DefaultEnemyPrepareTime = Number(J.ABS.PluginParameters['Default Enemy Prepare Time']);
J.ABS.Metadata.DefaultActionMapId = Number(J.ABS.PluginParameters['Default Action Map Id']);
J.ABS.Metadata.DefaultAttackAnimationId = Number(J.ABS.PluginParameters['Default Attack Animation Id']);
J.ABS.Metadata.DefaultDodgeSkillTypeId = Number(J.ABS.PluginParameters['Default Dodge Skill Type Id']);
J.ABS.Metadata.DefaultGuardSkillTypeId = Number(J.ABS.PluginParameters['Default Guard Skill Type Id']);
J.ABS.Metadata.DefaultToolCooldownTime = Number(J.ABS.PluginParameters['Default Tool Cooldown Time']);

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
  Game_Player: {},
  Game_Unit: {},
  Scene_Map: {},
  Spriteset_Map: {},
  Sprite_Character: {},
  Sprite_Damage: {},
  Sprite_Gauge: {},
};

/**
 * A collection of helpful functions for use within this plugin.
 */
J.ABS.Helpers = {};
//#endregion Plugin setup & configuration

//#region Plugin Command Registration
/**
 * A collection of helper functions for the use with the plugin manager commands.
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
};

/**
 * Extends `.setup()` and initializes the jabs equipped skills.
 */
J.ABS.Aliased.Game_Actor.setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
  J.ABS.Aliased.Game_Actor.setup.call(this, actorId);
  this.initAbsSkills();
  this.checkSpeedBoosts();
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
}

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
      ? parseInt(equips[0]._jabs.skillId)
      : 0);

  this.setEquippedSkill(
    Game_Actor.JABS_OFFHAND, 
    hasOffhand 
      ? parseInt(equips[1]._jabs.skillId)
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
  this.checkSpeedBoosts();
}

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
  const isLeader = $gameParty.leader() == this;
  if (isLeader) {
    $gameBattleMap.leaderLevelUp();
  }
};

/**
 * Updates the speed boost for this actor based on equipment.
 */
Game_Actor.prototype.checkSpeedBoosts = function() {
  const equips = this.equips();
  let speedBoosts = 0;

  equips.forEach(equip => {
    if (!equip) return;
    speedBoosts += equip._jabs.speedBoost;
  });

  this._j._speedBoosts = speedBoosts;
};

/**
 * Gets the current speed boosts for this actor.
 */
Game_Actor.prototype.getSpeedBoosts = function() {
  return this._j._speedBoosts;
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
 * Reduces 
 * @param {number} damage The amount of damage before damage reductions.
 * @param {JABS_Battler} player The player's `JABS_Battler`.
 * @returns {number} The amount of damage after damage reductions from guarding.
 */
Game_Action.prototype.handleGuardEffects = function(damage, player) {
  if (player.parrying) {
    const result = player.getBattler().result();
    result.parried = true;
    result.preciseParried = true;
    damage = 0;
    player.setParryWindow(0);
    player.getCharacter().requestAnimation(0, true, true);
  } else {
    if (player.guarding) {
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
  const reduction = parseFloat(player.flatGuardReduction);
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
  const reduction = parseFloat(base - ((100 + player.percGuardReduction) / 100) * base);
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
 * Gets the `JABS_Battler` associated with this character.
 * @returns {JABS_Battler}
 */
Game_Character.prototype.getMapBattler = function() {
  const asp = this.getActionSpriteProperties();
  const battler = $gameBattleMap.getBattlerByUuid(asp.battlerUuid);
  return battler;
};

/**
 * Sets the provided `JABS_Battler` to this character.
 * @param {JABS_Battler} battler The `JABS_Battler` to set to this character.
 */
Game_Character.prototype.setMapBattler = function(uuid) {
  const actionSpriteProperties = this.getActionSpriteProperties();

  //TODO: you cannot bind the whole battler, only a single identifying property or else SAVE DISABLED.
  actionSpriteProperties.battlerUuid = uuid;
};

Game_Character.prototype.hasJabsBattler = function() {
  const asp = this.getActionSpriteProperties();
  const uuid = asp.battlerUuid;
  const battler = $gameBattleMap.getBattlerByUuid(uuid);
  if (!uuid && !battler && asp.damagePops.length > 0) {
    console.log("failure");
  }
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
    return;
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
 * our custom real move speed instead.
 */
Game_CharacterBase.prototype.realMoveSpeed = function() {
  return this._realMoveSpeed;
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
  return player.getDodging();
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
   * The collection of controls that occur on-death of this event.
   */
  this._j._deathControls = {
    /**
     * The collection of switches that this event will execute on-death.
     */
    _switches: [],

    /**
     * The collection of self-switches that this event will execute on-death.
     */
    _selfSwitches: [],

    /**
     * The collection of variables that this event will modify on-death.
     */
    _variables: [],
  };

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
 * Modifies the `.event()` method of `Game_Event` to return the data from the
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
    const eventDatas = $dataMap.events.filter(event => !!event);
    const actionEventData = eventDatas.find(el => id == el.id);
    return actionEventData;
  }
};

/**
 * Extends the pagesettings for events and adds on custom parameters to this event.
 */
J.ABS.Aliased.Game_Event.setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function() {
  J.ABS.Aliased.Game_Event.setupPageSettings.call(this);
  this.configureCustomParameters();
};

/**
 * Populates multiple custom parameters for this event.
 */
Game_Event.prototype.configureCustomParameters = function() {
  this.setCustomMoveSpeed();
  this.assignDeathControls();
};

/**
 * Overwrites this event's move speed with a custom move speed value.
 * This speed can be a decimal/float.
 */
Game_Event.prototype.setCustomMoveSpeed = function() {
  const event = this.event();
  let speed = this.customMoveSpeed();

  // it wasn't assigned by notes, so just use the base event's movespeed.
  if (speed == 0) {
    speed = event.pages[0].moveSpeed;
  }

  this.setMoveSpeed(speed);
};

//#region Death controls
/**
 * Assigns on-death controls to this event on initialization.
 */
Game_Event.prototype.assignDeathControls = function() {
  let switches = [];
  let selfSwitches = [];
  let variables = [];
  this.list().forEach(command => {
    if (this.matchesControlCode(command.code)) {
      const line = command.parameters[0];
      if (line.match(J.ABS.Notetags.EventControl.Switch)) {
        switches.push(parseInt(RegExp.$1));
      } else if (line.match(J.ABS.Notetags.EventControl.SelfSwitch)) {
        const eventId = RegExp.$2 !== undefined
          ? parseInt(RegExp.$2)
          : this.eventId();
        selfSwitches.push([RegExp.$1.toUpperCase(), eventId]);
      } else if (line.match(J.ABS.Notetags.EventControl.Variable)) {
        variables.push([parseInt(RegExp.$1), parseInt(RegExp.$2)]);
      }
    }
  });

  if (switches.length) this.addDeathControls("switches", switches);
  if (selfSwitches.length) this.addDeathControls("selfswitches", selfSwitches);
  if (variables.length) this.addDeathControls("variables", variables);
};

/**
 * Adds a collection of controls to this event for on-death manipulation.
 * @param {string} type The type of controls.
 * @param {any[]} controls The control collection.
 */
Game_Event.prototype.addDeathControls = function(type, controls) {
  switch (type) {
    case "switches": 
      this.addDeathControlSwitches(controls);
      break;
    case "selfswitches":
      this.addDeathControlSelfSwitches(controls);
      break;
    case "variables":
      this.addDeathControlVariables(controls);
      break;
  };
};

/**
 * Adds switches to the on-death controls for this event.
 * @param {number[]} controls The switches to trigger.
 */
Game_Event.prototype.addDeathControlSwitches = function(controls) {
  controls.forEach(control => {
    this._j._deathControls._switches.push(control);
  });
};

/**
 * Adds self-switches to the on-death controls for this event.
 * @param {string[]} controls The self-switches to trigger.
 */
Game_Event.prototype.addDeathControlSelfSwitches = function(controls) {
  controls.forEach(control => {
    this._j._deathControls._selfSwitches.push(control);
  });
};

/**
 * Adds variables to the on-death controls for this event.
 * @param {[number, number][]} controls The key-value pair for manipulating variables.
 */
Game_Event.prototype.addDeathControlVariables = function(controls) {
  controls.forEach(control => {
    this._j._deathControls._variables.push(control);
  });
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
 * Gets all switch death controls for this event.
 */
Game_Event.prototype.getDeathControlSwitches = function() {
  return this._j._deathControls._switches;
};

/**
 * Gets all self-switch death controls for this event.
 */
Game_Event.prototype.getDeathControlSelfSwitches = function() {
  return this._j._deathControls._selfSwitches;
};

/**
 * Gets all variable death controls for this event.
 */
Game_Event.prototype.getDeathControlVariables = function() {
  return this._j._deathControls._variables;
};
//#endregion Death controls
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
 * Enables default battles with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
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
 * 
 */
J.ABS.Aliased.Game_Map.setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
  J.ABS.Aliased.Game_Map.setup.call(this, mapId);
  $gameBattleMap.initialize();
  this._j._allBattlers = this.parseBattlers();
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
  if (this._j._allBattlers == null) return [];

  const livingBattlers = this._j._allBattlers.filter(battler => !battler.isDead);
  return livingBattlers;
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
    const result = evs.filter(event => event.battlerId() > 0);
    const enemies = this.convertToEnemies(result);
    return enemies;
  } catch {
    // for a brief moment when leaving the menu, these are all null.
    return [];
  }
};

/**
 * Converts applicable `Game_Event`s into `Game_Enemy[]`.
 * @param {Game_Event[]} evs A `Game_Event[]`.
 * @returns {JABS_Battler[]} A `JABS_Battler[]`.
 */
Game_Map.prototype.convertToEnemies = function(events) {
  const mapBattlers = events.map(event => {
    const battlerId = event.battlerId();
    const battler = new Game_Enemy(battlerId, null, null);
    const mapBattler = new JABS_Battler(event, battler, 1);
    const uuid = mapBattler.getUuid();
    event.setMapBattler(uuid);
    return mapBattler;
  });

  return mapBattlers;
};

/**
 * Deletes and removes a `JABS_Battler` from this map's tracking.
 * @param {JABS_Battler} battler The map battler to destroy.
 */
Game_Map.prototype.destroyBattler = function(battler) {
  const uuid = battler.getUuid();
  let index = -1;
  this._j._allBattlers.find((el, i) => {
    const result = el.getUuid() == uuid;
    if (result) index = i;
    return result;
  });

  battler.getCharacter().setActionSpriteNeedsRemoving();

  if (index > -1) {
    this._j._allBattlers[index].getCharacter().erase();
    this._j._allBattlers.splice(index, 1);
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
//#endregion

//#region Game_Player
/**
 * If the Abs menu is pulled up, the player shouldn't be able to move.
 */
J.ABS.Aliased.Game_Player.canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function() {
  if ($gameBattleMap.requestAbsMenu) {
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
  if (scale === 0) return;

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
  $gameMap.removeEvent(lootEvent);
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
//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JABS objects for tracking.
 */
J.ABS.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
  J.ABS.Aliased.Scene_Map.initialize.call(this);
  this._j = this._j || {};
  this.initMembers();
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
 * Initializes all JABS components that require no external parameters.
 */
Scene_Map.prototype.initMembers = function() {
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
 * OVERWRITE Removes the buttons on the map/screen.
 */
Scene_Map.prototype.createButtons = function() {
  return;
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
  JABS_AiManager.update();

  if ($gameBattleMap.absPause) {
    this.manageAbsMenu();
  } else {
    this._j._absMenu._mainWindow.hide();
    this._j._absMenu._skillWindow.hide();
    this._j._absMenu._equipSkillWindow.hide();
    this._j._absMenu._toolWindow.hide();
    this._j._absMenu._equipToolWindow.hide();
    this._j._absMenu._dodgeWindow.hide();
    this._j._absMenu._equipDodgeWindow.hide();
  }
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
 * Toggles the visibility and functionality of the built-in JABS hud.
 * @param {boolean} toggle Whether or not to display the default hud.
 */
Scene_Map.prototype.toggleHud = function(toggle = true) {
  if (J.Hud.Metadata.Enabled) {
    this._j._hud.toggle(toggle);
  }
};

/**
 * Toggles the visibility and functionality of the externally managed text log.
 * @param {boolean} toggle Whether or not to display the external text log.
 */
Scene_Map.prototype.toggleLog = function(toggle = true) {
  if (J.TextLog.Metadata.Enabled) {
    this._j._mapTextLog.toggle(toggle);
  }
};

/**
 * Toggles the visibility and functionality of the externally managed action keys.
 * @param {boolean} toggle Whether or not to display the external action keys.
 */
Scene_Map.prototype.toggleKeys = function(toggle = true) {
  if (J.ActionKeys.Metadata.Enabled) {
    this._j._actionKeys.toggle(toggle);
  }
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
}

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
}

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
}

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
}

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
}

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
}

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
}

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
}

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
}

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
}

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
}

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
}

/**
 * When the "assign dodge" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandMenu = function() {
  SceneManager.push(Scene_Menu);
  return;
}

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
}

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
}

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
}

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
}

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
}

/**
 * Close out from the Abs menu.
 */
Scene_Map.prototype.closeAbsMenu = function() {
  this._j._absMenu._mainWindow.closeMenu();
  return;
}
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
      const sprite = new Sprite_Character(event);
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
//#endregion

//#region Sprite_Character
/**
 * Hooks into `Sprite_Character.initMembers` and adds our initiation for damage sprites.
 */
J.ABS.Aliased.Sprite_Character.initMembers = Sprite_Character.prototype.initMembers;
Sprite_Character.prototype.initMembers = function() {
  this._damages = [];
  this._nonDamages = [];
  this._stateOverlaySprite = new Sprite_StateOverlay();
  this._hpGauge = null;
  this._loot = {};
  this._loot._img = null;
  this._loot._swing = false;
  this._loot._ox = 0;
  this._loot._oy = 0;
  J.ABS.Aliased.Sprite_Character.initMembers.call(this);
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
    this.setCharacterBitmap();
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
  // initializes the state overlay for tracking this battler's states.
  this._stateOverlaySprite.setup(this.getBattler());
  this.addChild(this._stateOverlaySprite);

  // initializes a gauge for this battler to monitor their hp.
  this._hpGauge = this.createSpriteGauge();
  this.addChild(this._hpGauge);
};

/**
 * Creates an on-the-map HP gauge for this battler.
 */
Sprite_Character.prototype.createSpriteGauge = function() {
  const battler = this.getBattler();
  const hpGauge = new Sprite_MapGauge();
  hpGauge.setup(battler, "hp");
  hpGauge.x = this.x  - (hpGauge.width / 1.5);
  hpGauge.y = this.y - 72;
  return hpGauge;
};

/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupLootSprite = function() {
  // don't recreate it if it already exists!
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
    }
  }
};

/**
 * Updates the all gauges associated with this battler
 */
Sprite_Character.prototype.updateGauges = function() {
  if (this._character.getMapBattler()) {
    if (this.canUpdate() && this._character.showHpBar()) {
      this._hpGauge._battler = this.getBattler();
      this._hpGauge.update();  
    } else {
      this._hpGauge.opacity = 0;
    }
  }
};

J.ABS.Aliased.Sprite_Character.updateFrame = Sprite_Character.prototype.updateFrame;
Sprite_Character.prototype.updateFrame = function() {
	if (this.isLoot()) {
    this.updateLootFloat();
    return;
  }
  
	J.ABS.Aliased.Sprite_Character.updateFrame.call(this);
};

Sprite_Character.prototype.updateLootFloat = function() {
  const lootData = this.getLootData();
  lootData.countdownDuration();
  //console.log(lootData.expired); // works!
  const { _img: lootSprite, _swing: swingDown } = this._loot;

  swingDown
    ? this.lootFloatDown(lootSprite)
    : this.lootFloatUp(lootSprite);
};

Sprite_Character.prototype.lootFloatDown = function(lootSprite) {
  this._loot._oy += 0.3;
  lootSprite.y += 0.3;
  if (this._loot._oy > 5) this._loot._swing = false;
};

Sprite_Character.prototype.lootFloatUp = function(lootSprite) {
  this._loot._oy -= 0.3;
  lootSprite.y -= 0.3;
  if (this._loot._oy < -5) this._loot._swing = true;
};

/**
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
Sprite_Character.prototype.canUpdate = function() {
  if (!$gameBattleMap.absEnabled) {
    return false;
  }

  this._hpGauge.opacity = 255;
  return true;
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
      damage.x = this.x + damage._xVariance;
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
      nonDamage.x = this.x + nonDamage._xVariance;
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
  sprite.x = this.x;
  sprite.y = this.y;

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
      this.buildExperiencePopSprite(sprite, popup);
      break;
    case "gold":
      sprite._xVariance = -40;
      sprite._yVariance = 40;
      this.buildGoldPopSprite(sprite, popup);
      break;
    case "item":
      sprite._xVariance = 60;
      sprite._yVariance = getRandomNumber(-30, 30);
      this.buildItemPopSprite(sprite, popup);
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
 * Configures the values for this experience popup.
 * @param {Sprite_Damage} sprite The sprite to configure for this experience pop.
 * @param {JABS_TextPop} popup The data for this pop.
 */
Sprite_Character.prototype.buildExperiencePopSprite = function(sprite, popup) {
  const exp = popup.getDirectValue();
  sprite._colorType = popup.getTextColor();
  sprite._duration += 180;
  sprite.createValue(`E +${exp}`);
};

/**
 * Configures the values for this gold popup.
 * @param {Sprite_Damage} sprite The sprite to configure for this gold pop.
 * @param {JABS_TextPop} popup The data for this pop.
 */
Sprite_Character.prototype.buildGoldPopSprite = function(sprite, popup) {
  const gold = popup.getDirectValue();
  sprite._colorType = popup.getTextColor();
  sprite._duration += 180;
  sprite.createValue(`G +${gold}`);
};

/**
 * Configures the values for this item popup.
 * @param {Sprite_Damage} sprite The sprite to configure for this item pop.
 * @param {JABS_TextPop} popup The data for this pop.
 */
Sprite_Character.prototype.buildItemPopSprite = function(sprite, popup) {
  const itemName = popup.getDirectValue();
  sprite._colorType = popup.getTextColor();
  sprite._duration += 60;
  sprite.createValue(`+${itemName}`);
};

/**
 * Configures the values for this levelup popup.
 * @param {Sprite_Damage} sprite The sprite to configure for this item pop.
 * @param {JABS_TextPop} popup The data for this pop.
 */
Sprite_Character.prototype.buildLevelUpPopSprite = function(sprite, popup) {
  const itemName = popup.getDirectValue();
  sprite._colorType = popup.getTextColor();
  sprite._duration += 120;
  sprite.createValue(`+${itemName}`);
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
  const w = value.length * this.fontSize() + 32;
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
  sprite.x -= 30;
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
    this.addCommand("Main Menu", "main-menu", true, null, 79);
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
      const addSkillToList = !isDodgeSkillType && !isGuardSkillType;
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
      return DataManager.isItem(item) && item.itypeId === 1;
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
  set absEnabled(enabled = true) {
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
  set absPause(paused = true) {
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
  set requestAbsMenu(requested = true) {
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
    const anyEnemies = $gameMap.getBattlers().find(battler => battler.isEnemy());
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
   * @param {boolean} rendering Whether or not we want to render actions (default = true).
   */
  set requestActionRendering(rendering = true) {
    this._requestActionRendering = rendering;
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
   * @param {boolean} rendering Whether or not we want to render actions (default = true).
   */
  set requestLootRendering(rendering = true) {
    this._requestLootRendering = rendering;
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
   * @param {boolean} clearing Whether or not we want to clear the battle map (default = true).
   */
  set requestClearMap(clearing = true) {
    return this._requestClearMap = clearing;
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
    if (this._playerBattler == null || !this._playerBattler.getUuid()) {// || !this._playerBattler.getCharacterSpriteName()) {
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
    if (player.getBattler().isDead()) return;

    this.handleInput();
    player.update();
  };

  //#region Player input and handling
  /**
   * Handles the player input if the menu isn't requested.
   */
  handleInput() {
    if (this.requestAbsMenu) {
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
    if ($gameMap.isEventRunning()) return;

    // strafing can be done concurrently to other actions.
    if (Input.isPressed(J.ABS.Input.L2)) {
      this.performStrafe(true);
    } else {
      this.performStrafe(false);
    }

    // rotating can be done concurrently to other actions.
    if (Input.isPressed(J.ABS.Input.X)) {
      this.performRotate(true);
    } else {
      this.performRotate(false);
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
      }

      return;
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
      player.executeDodgeSkill();
    }
  };

  /**
   * Cycles through and updates all things related to battlers other than the player.
   */
  updateNonPlayerBattlers() {
    const battlers = $gameMap.getBattlers();
    battlers.forEach(battler => {
      battler.update();
      if (battler.getBattler().isDead()) {
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
          if (target.getBattler().isDead()) {
            this.handleDefeatedTarget(target, action.getCaster());
            target.setInvincible();
          }
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
    battlers.push($gameBattleMap.getPlayerMapBattler());
    const jabsBattler = battlers.find(battler => battler.getUuid() === uuid);
    return jabsBattler
      ? jabsBattler
      : null;
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
    const { casterAnimation, freeCombo } = baseSkill._jabs;

    this.applyCooldownCounters(caster, action);
    this.paySkillCosts(caster, action);
    if (freeCombo) {
      this.checkComboSequence(caster, action)
    }

    caster.performActionPose(baseSkill);
    if (casterAnimation && !character.isAnimationPlaying()) {
      character.requestAnimation(casterAnimation);
    }

    const eventId = action.getActionId();
    const actionEventData = JsonEx.makeDeepCopy($actionMap.events[eventId]);
    actionEventData.x = caster.getX();
    actionEventData.y = caster.getY();

    this.addMapActionToMap(actionEventData, action);
    this.addActionEvent(action);  
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
    if (!caster.isPlayer()) {
      caster.modCooldownCounter(action.getCooldownType(), action.getCooldown());
    } else {
      const skill = action.getBaseSkill();
      if (skill._jabs.uniqueCooldown) {
        // if the skill is unique, only apply the cooldown to the slot assigned.
        caster.modCooldownCounter(action.getCooldownType(), action.getCooldown());
        return;
      }

      const equippedSkills = caster.getBattler().getAllEquippedSkills();
      Object.keys(equippedSkills).forEach(key => {
        const equippedSkillId = equippedSkills[key].id;
        if (equippedSkillId == skill.id) {
          caster.setCooldownCounter(key, action.getCooldown());
        }
      });
    }
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

    // create the event by hand with this new data
    const actionEventSprite = new Game_Event(
      J.ABS.DefaultValues.ActionMap,
      $dataMap.events.length - 1);
    actionEventSprite.setActionSpriteNeedsAdding();
    actionEventSprite._eventId = actionEventData.id;
    const pageData = actionEventData.pages[0];
    actionEventSprite.setMoveFrequency(pageData.moveFrequency);
    actionEventSprite.setMoveRoute(pageData.moveRoute);
    actionEventSprite.setDirection(action.direction);
    actionEventSprite.setInitialDirection(action.direction);
    actionEventSprite.setMapActionData(action);

    // overwrites the "start" of the event for this event to be nothing.
    actionEventSprite.start = () => false;

    action.setActionSprite(actionEventSprite);
    this.requestActionRendering = true;
    $gameMap.addEvent(actionEventSprite);
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
    if (result.isHit()) {
      // apply the animation against the target's map character.
      const isAnimating = action.getAnimating(targetUuid);
      if (!isAnimating) {
        targetSprite.requestAnimation(animationId, result.parried);
        action.setAnimating(targetUuid, true);
      }

      // if freecombo-ing, then we already checked for combo when executing the action.
      if (!skill._jabs.freeCombo) {
        this.checkComboSequence(casterMapBattler, action);
      }

      this.checkKnockback(action, target);
      this.triggerAlert(casterMapBattler, target);
    }

    // checks for retaliation from the target.
    this.checkRetaliate(action, target);

    // generate log for this action.
    // TODO: lift this higher to capture entire result?
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
   */
  executeSkillEffects(action, target) {
    const caster = action.getCaster();
    const targetBattler = target.getBattler();
    const gameAction = action.getAction();
    const skill = action.getBaseSkill();
    let unparryable = false;
    if (skill._jabs.ignoreParry === -1) {
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

    // TODO: add guarding manipulation here?
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
    let knockback = skill._jabs.knockback;
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
    if (!skill._jabs.combo) {
      if (!action.getCooldownChecked()) {
        // if the cooldown has not yet been applied, apply it.
        caster.setCooldownCounter(action.getCooldownType(), action.getCooldown());
        action.setCooldownChecked();
      }
      return;
    } else {
      const combo = skill._jabs.combo;
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
    if (!isFacing)
      return false;

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
   */
  triggerAlert(attacker, target) {
    // check if the target can actually be alerted first.
    if (!this.canBeAlerted(target))
      return;

    // alert the target!
    target.showBalloon(J.ABS.Balloons.Question);
    target.setAlertedCoordinates(attacker.getX(), attacker.getY());
    const alertDuration = target.getCharacter().alertedDuration();
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
    if (battler.getCharacter().isInanimate())
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
    const needsCounterParry = result.preciseParried && battler.counterParry;
    const needsCounterGuard = !needsCounterParry && battler.guarding && battler.counterGuard;

    if (needsCounterParry) {
      this.forceMapAction(battler, battler.counterParry, true);
    }

    if (needsCounterGuard) {
      console.log(battler.counterGuard);
      this.forceMapAction(battler, battler.counterGuard, true);
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

    if (DataManager.isItem(skill)) {
      return 208;
    }

    // hard-coded element-to-icon relationships.
    switch (elementId) {
      case 0: return 78; // none / non-elemental
      case 1: return 77; // physical
      case 2: return 64; // fire
      case 3: return 67; // water
      case 4: return 68; // ground
      case 5: return 69; // air
      case 6: return 66; // electric
      case 7: return 65; // ice
      case 8: return 183; // nature
      case 9: return 118; // magma
      case 10: return 70; // energy
      case 11: return 71; // void
      default: return 0;
    }
  };

  /**
   * Checks this `JABS_Action` against all map battlers to determine collision.
   * If there is a collision, then a `Game_Action` is applied.
   * @param {JABS_Action} action The `JABS_Action` to check against all battlers.
   * @returns {JABS_Battler[]} A collection of `JABS_Battler`s that this action hit.
   */
  getCollisionTargets(action) {
    const myTeam = action.getTeamId();
    const actionSprite = action.getActionSprite();
    const range = action.getRange();
    const shape = action.getShape();
    const casterMapBattler = action.getCaster();
    const caster = casterMapBattler.getCharacter();
    const battlers = $gameMap.getBattlers();
    battlers.push(this.getPlayerMapBattler());
    const gameAction = action.getAction();

    // handle scopes of the map action.
    const scopeAlly = gameAction.isForFriend();
    const scopeSingle = gameAction.isForOne();
    let hitOne = false;
    const scopeSelf = gameAction.isForUser();
    const scopeEverything = gameAction.isForEveryone();
    let targetsHit = [];
    battlers.forEach(battler => {
      // likely already dead, skip this battler.
      if (battler.getInvincible())
        return;

      // the character itself is invincible, skip this battler.
      const character = battler.getCharacter();
      if (character.isInvincible())
        return;

      // scope is for 1 target and we found one, stop finding targets.
      if (scopeSingle && hitOne)
        return;

      // can only hit self if scope is for ally/self/everything.
      if (casterMapBattler.getUuid() == battler.getUuid() &&
        (!scopeSelf || !scopeAlly || !scopeEverything)) {
        return;
      }

      // scope doesn't include allies. NOTE: "allies" include yourself.
      if ((myTeam == battler.getTeam() && !scopeAlly))
        return;

      // hit this battler!
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
    if (target.isPlayer()) {
      console.log("TODO: if player defeated, gameover? switch?");
      return;
    } else if (target.isActor()) {
      console.log("TODO: if ally defeated, handle this!");
    } else {
      const targetBattler = target.getBattler();
      const targetCharacter = target.getCharacter();
      if (!targetCharacter.isInanimate()) {
        SoundManager.playEnemyCollapse();
      }

      //J.Base.Helpers.modVariable(2, 1);
      this.processDeathControls(targetCharacter);
      this.gainBasicRewards(targetBattler, caster);
      this.createLootDrops(target, caster);
    }

    target.destroy();
  };

  /**
   * Modifies game event control like switches, variables, or self-switches
   * when the target enemy is defeated.
   * @param {Game_Event} event The event to process.
   */
  processDeathControls(event) {
    this.processDeathSwitches(event);
    this.processDeathSelfSwitches(event);
    this.processDeathVariables(event);
  };

  /**
   * Modifies switches based on comments in the dying enemy.
   * @param {Game_Event} event The event to process.
   */
  processDeathSwitches(event) {
    const deathSwitches = event.getDeathControlSwitches();
    if (!deathSwitches.length)
      return;

    deathSwitches.forEach(switchId => {
      $gameSwitches.setValue(switchId, true);
    });
  };

  /**
   * Modifies self-switches based on comments in the dying enemy.
   * @param {Game_Event} event The event to process.
   */
  processDeathSelfSwitches(event) {
    const deathSelfSwitches = event.getDeathControlSelfSwitches();
    if (!deathSelfSwitches.length)
      return;

    deathSelfSwitches.forEach(selfSwitchData => {
      // key = [mapId, eventId, self-switch]
      const mapId = $gameMap.mapId();
      const selfSwitchId = selfSwitchData[0].toUpperCase();
      const eventId = selfSwitchData[1];
      const key = [mapId, eventId, selfSwitchId];
      console.log(key);
      $gameSelfSwitches.setValue(key, true);
    });
  };

  /**
   * Modifies variables based on comments in the dying enemy.
   * @param {Game_Event} event The event to process.
   */
  processDeathVariables(event) {
    const deathVariables = event.getDeathControlVariables();
    if (!deathVariables.length)
      return;

    deathVariables.forEach(varData => {
      const variableId = varData[0];
      const oldValue = $gameVariables.value(variableId);
      const newValue = varData[1] + oldValue;
      $gameVariables.setValue(varData[0], newValue);
    });
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

    // if using the level scaling plugin, then add in the multiplier.
    if (J.LevelScaling && J.LevelScaling.Metadata.Enabled) {
      const levelMultiplier = J.LevelScaling.Utilities.determineScalingMultiplier(
        actor.getBattler().level,
        enemy.level);
      experience = Math.ceil(experience * levelMultiplier);
      gold = Math.ceil(gold * levelMultiplier);
    }

    this.gainExperienceReward(experience, userSprite);
    this.gainGoldReward(gold, userSprite);
    this.createRewardsLog(experience, gold, actor);
  };

  /**
   * Gains experience from battle rewards.
   * @param {number} experience The experience to be gained as a reward.
   * @param {Game_Character} casterSprite The character who defeated the target.
   */
  gainExperienceReward(experience, casterSprite) {
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
    const iconId = 0; // TODO: decide on icons.
    const textColor = 6; // TODO: decide on text colors based on dmg type?
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
    const iconId = 0; // TODO: decide on icons.
    const textColor = 14; // TODO: decide on text colors based on dmg type?
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
    if (!J.TextLog.Metadata.Enabled || !J.TextLog.Metadata.Active)
      return;

    // if an enemy is the one who defeated a battler, also skip this.
    if (caster.isEnemy())
      return;

    const casterData = caster.getReferenceData();
    const expMessage = `${casterData.name} gained ${experience} experience.`;
    const expLog = new Map_TextLog(expMessage, -1);
    $gameTextLog.addLog(expLog);
    const goldMessage = `The party gained ${gold} G.`;
    const goldLog = new Map_TextLog(goldMessage, -1);
    $gameTextLog.addLog(goldLog);
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
    const text = "LEVEL+1";
    const iconId = 348;
    const textColor = 24;
    const popup = new JABS_TextPop(
      null,
      iconId,
      textColor,
      null,
      null,
      "item",
      text);
    character.addTextPop(popup);
    character.setRequestTextPop();
  };

  /**
   * Creates a level up log for the player.
   * @param {JABS_Battler} player The player.
   */
  createLevelUpLog(player) {
    if (!J.TextLog.Metadata.Enabled || !J.TextLog.Metadata.Active)
      return;

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

};

//#endregion defeated target aftermath

//#endregion

//#endregion New Game objects

//#region JABS objects
//#region JABS_BattlerManager
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
  constructor() { throw new Error("The JABS_BattleManager is a static class."); };

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
    if (!character.canIdle()) return;
  
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
  
    const ai = battler.getAiMode();
  
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
      battler.turnTowardTarget();
      $gameBattleMap.executeMapActions(battler, battler.getDecidedAction());
      battler.setPhase(3);
    }
  };

  /**
   * The battler decides what action to execute.
   * The order of AI here is important, as some earlier and
   * less-prominent AI traits are overridden by the later
   * much more prominent AI traits.
   * @param {JABS_Battler} battler The `JABS_Battler`.
   */
  static decideAiPhase2Action(battler) {
    const ai = battler.getAiMode();
    const basicAttack = battler.getEnemyBasicAttack();
    let target = battler.getTarget();
    let shouldUseBasicAttack = false;
    let skillsToUse = [];
    let chosenSkillId;
    const allSkillsAvailable = battler.getSkillIdsFromEnemy();
    skillsToUse.push(...allSkillsAvailable);
  
    // enable optional 50/50 basic attack override.
    if (ai.basic) {
      shouldUseBasicAttack = true;
    }
  
    // filter out skills that are elementally ineffective.
    if (ai.smart) {
      if (skillsToUse.length > 1) {
        const smartSkills = skillsToUse.filter(skill => {
          const testAction = new Game_Action(target.getBattler());
          testAction.setSkill(skill[0]);
          const rate = testAction.calcElementRate(target.getBattler());
          if (rate < 1) {
            return false;
          } else {
            return true;
          }
        });
        
        skillsToUse = smartSkills;
      }
    }
  
    // find most elementally effective skill vs the target.
    if (ai.executor) {
      if (skillsToUse.length > 1) {
        let elementalSkillCollection = [];
        skillsToUse.forEach(skill => {
          const testAction = new Game_Action(target.getBattler());
          testAction.setSkill(skill[0]);
          const rate = testAction.calcElementRate(target.getBattler());
          elementalSkillCollection.push([skill[0], rate]);
        });
  
        // sorts the skills by their elemental effectiveness.
        elementalSkillCollection.sort((a, b) => {
          if (a[1] < b[1]) return -1;
          if (a[1] > b[1]) return 1;
          return 0;
        });
  
        // only use the highest elementally effective skill.
        skillsToUse = [elementalSkillCollection[0][0]];
      }
    }
  
    // find skill that has the most buffs on it.
    if (ai.defensive) { }
  
    // disable using basic attacks, always fire off skills!
    if (ai.reckless) {
      shouldUseBasicAttack = false;
    }
  
    // prioritize healing when self or allies are low on hp.
    if (ai.healer) { }
  
    // only basic attacks alone, if controlled by a leader,
    // the follower will be told to execute skills based on
    // the leader's decision.
    if (ai.follower) {
      shouldUseBasicAttack = true;
    }
  
    // rewrite followers' action decisions that meet criteria.
    // acts intelligently in addition to controlling followers
    // into acting intelligently as well.
    if (ai.leader) { }
  
    // 50:50 chance of just basic attacking instead.
    let basicAttackInstead = false;
    if (shouldUseBasicAttack) {
      basicAttackInstead = Math.randomInt(2) == 0 
      ? true
      : false;
    }
  
    if (basicAttackInstead || skillsToUse.length == 0 || !skillsToUse) {
      // skip the formula, only basic attack.
      chosenSkillId = basicAttack[0];
    } else {
      if (skillsToUse.length == 1) {
        chosenSkillId = skillsToUse[0][0];
      } else {
        // TODO: use rating to determine weighting of skill.
        const randomId = Math.randomInt(skillsToUse.length);
        chosenSkillId = skillsToUse[randomId][0];
      }
    }
  
    // if the battler is unable to use skills due to states, but can attack, do that.
    if (!battler.canBattlerUseSkills() && 
      battler.canBattlerUseAttacks() &&
      chosenSkillId != basicAttack[0]) {
        chosenSkillId = basicAttack[0];
    }
  
    // if the battler is unable to use basic attacks due to states, but can use skills,
    // just use a skill instead.
    if (!battler.canBattlerUseAttacks() && 
      battler.canBattlerUseSkills() &&
      chosenSkillId == basicAttack[0]) {
        const randomId = Math.randomInt(skillsToUse.length);
        chosenSkillId = skillsToUse[randomId][0];
    }
  
    // if the battler is unable to use attacks or skills due to states, then do nothing.
    if ((!battler.canBattlerUseAttacks() && !battler.canBattlerUseSkills()) ||
      !chosenSkillId) {
      battler.setDecidedAction(null);
      return;
    }
  
    // if for some reason, its still an array after all the processing, convert it.
    if (Array.isArray(chosenSkillId)) {
      chosenSkillId = chosenSkillId[0];
    }
  
    // create and set the map action based on the AI above.
    const mapActions = battler.createMapActionFromSkill(chosenSkillId);
    const cooldownName = `${mapActions[0].getBaseSkill().name}`;
    mapActions.forEach(action => action.setCooldownType(cooldownName));
    battler.setDecidedAction(mapActions);
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
//#endregion JABS_BattleManager

//#region JABS_Battler
/**
 * An object that represents the binding of a `Game_Event` to a `Game_Battler`.
 * This can be for either the player, an ally, or an enemy.
 * 
 * NOTE: When generating new battlers, use the static `create*` methods.
 */
class JABS_Battler {
  //#region Initialize battler
  /**
   * @constructor
   * @param {Game_Event} event The event the battler is bound to.
   * @param {Game_Battler} battler The battler data itself.
   * @param {number} teamId The team the battler is associated with.
   */
  constructor(event, battler, teamId) {
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
     * The team that this battler fights for.
     * @type {number}
     */
    this._team = teamId;
    this.initialize();
  }

  /**
   * Initializes all properties that don't require input parameters.
   */
  initialize = () => {
    this.initFromNotes();
    this.initGeneralInfo();
    this.initBattleInfo();
    this.initIdleInfo();
    this.initAnimationInfo();
  };

  /**
   * Initializes the properties of this battler that are not related to anything in particular.
   */
  initGeneralInfo = () => {
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
     * Whether or not this battler is invincible, rendering them unable
     * to be collided with by map actions.
     * @type {boolean}
     */
    this._invincible = false;

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
   * Initializes the properties of this battler that are directly derived from notes.
   */
  initFromNotes = () => {
    /**
     * The distance this battler requires before it will engage with a non-allied target.
     * @type {number}
     */
    this._sightRadius = this.isEventReady()
      ? this.getCharacter().sightRadius()
      : 0;

    /**
     * The distance this battler will allow for its target to be from itself before it gives up
     * and disengages.
     * @type {number}
     */
    this._pursuitRadius = this.isEventReady() 
      ? this.getCharacter().pursuitRadius()
      : 0;

    /**
     * The number of frames to fulfill the "prepare" phase of a battler's engagement.
     * Only utilized by AI.
     * @type {number}
     */
    this._prepareMax = this.getPrepareTime();

    /**
     * The `JABS_BattlerAI` of this battler.
     * Only utilized by AI (duh).
     * @type {JABS_BattlerAI}
     */
    this._aiMode = this.parseAi();
  };

  /**
   * Initializes the properties of this battler that are related to battling and the like.
   */
  initBattleInfo = () => {
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
  };

  /**
   * Initializes the properties of this battler that are related to idling/phase0.
   */
  initIdleInfo = () => {
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
  initAnimationInfo = () => {
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
  initCooldowns = () => {
    this.initializeCooldown("global", 0);
    if (this.isEnemy()) {
      // initialize all the skills assigned from the database.
      const skills = this.getSkillIdsFromEnemy();
      if (skills) {
        skills.forEach(skillIdAndRating => {
          const skill = $dataSkills[skillIdAndRating[0]];
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

  //#endregion Initialize battler

  //#region statics
  /**
   * Generates the player character.
   */
  static createPlayer = () => {
    const player = new JABS_Battler($gamePlayer, $gameParty.leader(), 0);
    return player;
  };

  /**
   * Generates a non-player battler.
   * @param {number} eventId The id of the event we are binding the battler to.
   * @param {number} battlerId The id of the battler in the database.
   * @param {number} teamId The team the battler is associated with.
   * @returns {JABS_Battler} The new `JABS_Battler` based on provided parameters.
   */
  static createBattler = (eventId, battlerId, team = 1) => {
    const battler = team === 0
      ? new Game_Actor(battlerId)
      : new Game_Enemy(battlerId, null, null);

    const event = $gameMap.event(eventId);
    const mapBattler = new JABS_Battler(event, battler, team);
    return mapBattler;
  };

  /**
   * Determines if the battler is close to the target based on distance.
   * @param {number} distance The distance away from the target.
   */
  static isClose = distance => distance <= 1.7;

  /**
   * Determines if the battler is at a safe range from the target based on distance.
   * @param {number} distance The distance away from the target.
   */
  static isSafe = distance => distance >= 1.8 && distance <= 3.5;

  /**
   * Determines if the battler is far away from the target based on distance.
   * @param {number} distance The distance away from the target.
   */
  static isFar = distance => distance >= 3.6;

  /**
   * Determines whether or not the skill id is a guard-type skill or not.
   * @returns {boolean} True if it is a guard skill, false otherwise.
   */
  static isGuardSkillById = id => {
    if (!id) return false;

    const isGuardSkillType = $dataSkills[id].stypeId == J.ABS.DefaultValues.GuardSkillTypeId;
    return isGuardSkillType;
  };

  /**
   * Determines whether or not the skill id is a dodge-type skill or not.
   * @returns {boolean} True if it is a dodge skill, false otherwise.
   */
  static isDodgeSkillById = id => {
    if (!id) return false;

    const isDodgeSkillType = $dataSkills[id].stypeId == J.ABS.DefaultValues.DodgeSkillTypeId;
    return isDodgeSkillType;
  };
  //#endregion

  /**
   * Things that are battler-respective and should be updated on their own.
   */
  update = () => {
    // don't update map battlers if JABS is disabled.
    if (!$gameBattleMap.absEnabled) return;

    this.updateAnimations();
    this.updateCooldowns();
    this.updateEngagement();
    this.updateStates();
    this.updateRG();
    this.updateDodging();
  };

  /**
   * Update all character sprite animations executing on this battler.
   */
  updateAnimations = () => {
    if (this._animating) {
      this.countdownAnimation();
    }
  };

  /**
   * Updates all cooldowns for this battler.
   */
  updateCooldowns = () => {
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

    if (this.parrying) {
      this.getCharacter().requestAnimation(131, false);
      this.countdownParryWindow();
    }
  };

  /**
   * Counts down the duration for this battler's wait time.
   */
  countdownWait = () => {
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
  setWaitCountdown = wait => {
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
  isWaiting = () => this._waiting;

  /**
   * Counts down the alertedness of this battler.
   */
  countdownAlert = () => {
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
  getDodging = () => this._dodging;

  /**
   * Sets whether or not this battler is dodging.
   * @param {boolean} dodging Whether or not the battler is dodging (default = true).
   */
  setDodging = (dodging = true) => this._dodging = dodging;

  /**
   * Executes the currently equipped dodge skill.
   * This includes paying the cost and setting cooldowns.
   */
  executeDodgeSkill = () => {
    const battler = this.getBattler();
    const skillId = battler.getEquippedSkill(Game_Actor.JABS_DODGESKILL);
    if (!skillId) return;

    const skill = $dataSkills[skillId];
    const canPay = battler.canPaySkillCost(skill);
    if (canPay && skill._jabs.moveType) {
      const { moveType, range, cooldown, invincible } = skill._jabs;
      const player = this.getCharacter();

      this.setInvincible(invincible);
      this.performActionPose(skill);
      const dodgeSpeed = 2;
      const direction = this.determineDodgeDirection(moveType);
      player.setDodgeBoost(dodgeSpeed);

      this._dodgeSteps = range;
      this._dodgeDirection = direction;
      this._dodging = true;

      battler.paySkillCost(skill);
      this.modCooldownCounter(Game_Actor.JABS_DODGESKILL, cooldown);
      return;
    } else {
      // no movement pattern detected, skip dodge.
      console.info("not enough resources or dodge skill setup incorrectly.");
      return;
    }
  };

  /**
   * Translates a dodge skill type into a direction to move.
   * @param {string} moveType The type of dodge skill the player is using.
   */
  determineDodgeDirection = moveType => {
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
   * Counts down all regenerations and ticks four times per second.
   */
  updateRG = () => {
    if (this.isRegenReady()) {
      this.slipHp();
      this.slipMp();
      this.slipTp();
      this.setRegenCounter(15);
    }
  };

  /**
   * Whether or not the regen tick is ready.
   * @returns {boolean} True if its time for a regen tick, false otherwise.
   */
  isRegenReady = () => {
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
  getRegenCounter = () => this._regenCounter;

  /**
   * Sets the regen counter to a given number.
   * @param {number} count The count to set the regen counter to.
   */
  setRegenCounter = count => this._regenCounter = count;

  /**
   * Manages hp regeneration/poison from a battler's HRG and current states.
   */
  slipHp = () => {
    const battler = this.getBattler();
    const hrg = battler.hrg * 100;
    let hp5 = hrg / 4 / 5; // regen 4x per second, for 5 seconds == rg.
    let hp5mod = 0;
    let needPop = false;
    const states = battler.states();
    if (states.length) {
      states.forEach(state => {
        if (state.meta) {
          const { slipHpFlat, slipHpPerc } = state._jabs;
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
  slipMp = () => {
    const battler = this.getBattler();
    const mrg = battler.mrg * 100;
    let mp5 = mrg / 4 / 5; // regen 4x per second, for 5 seconds == rg.
    let mp5mod = 0;
    let needPop = false;
    const states = battler.states();
    if (states.length) {
      states.forEach(state => {
        if (state.meta) {
          const { slipMpFlat, slipMpPerc } = state._jabs;
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
   * Manages mp regeneration/poison from a battler's MRG and current states.
   */
  slipTp = () => {
    const battler = this.getBattler();
    const trg = battler.trg * 100;
    let tp5 = trg / 4 / 5; // regen 4x per second, for 5 seconds == rg.
    let tp5mod = 0;
    let needPop = false;
    const states = battler.states();
    if (states.length) {
      states.forEach(state => {
        if (state.meta) {
          const { slipTpFlat, slipTpPerc } = state._jabs;
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
   * Manages the dodge skill for the player.
   */
  updateDodging = () => {
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
   * Monitors all battlers and determines if they are engaged or not.
   */
  updateEngagement = () => {
    if (this.isPlayer() || $gameBattleMap.absPause) return;

    // inanimate characters cannot engage.
    const character = this.getCharacter();
    if (character.isInanimate()) return;

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
   * Determines the closest enemy target.
   */
  closestEnemyTarget = () => {
    const battlers = $gameMap.getBattlers();
    battlers.push($gameBattleMap.getPlayerMapBattler());
    let currentClosest = null;
    let closestDistanceYet = 1000;
    battlers.forEach(battler => {
      if (this.isSameTeam(battler.getTeam()) ||// don't target same team
        this.getUuid() === battler.getUuid())   // dont' target self
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
  getMovementLock = () => this._movementLock;

  /**
   * Sets the battler's movement lock.
   * @param {boolean} locked Whether or not the battler's movement is locked (default = true).
   */
  setMovementLock = (locked = true) => this._movementLock = locked;

  /**
   * Updates all states currently applied against this battler.
   */
  updateStates = () => {
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
   * Adds the state into the state tracking object for this battler if missing.
   * @param {object} state The reference data of the state.
   */
  addMissingState = state => {
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
  removeExpiredState = (battler, stateId) => {
    if (!this._stateTracker[stateId].active) return;

    if (this._stateTracker[stateId].duration <= 0) {
      this._stateTracker[stateId].active = false;
      this._stateTracker[stateId].duration = 0;
      //delete this._stateTracker[stateId];
      battler.removeState(stateId);
    }
  };

  /**
   * Counts down the state counter to removal.
   * @param {number} stateId The id of the state to countdown for.
   */
  stateCountdown = stateId => {
    if (this._stateTracker[stateId].active) {
      this._stateTracker[stateId].duration--;
    }
  };

  /**
   * Retrieves the entire state tracking object.
   */
  getAllStateData = () => this._stateTracker;

  /**
   * Gets the tracking data associated with a given state.
   * @param {number} stateId The id of the state to get tracking data for.
   */
  getStateData = stateId => {
    return this._stateTracker[stateId];
  };

  /**
   * Whether or not the battler is able to move.
   * A variety of things can impact the ability for a battler to move.
   * @returns {boolean} True if the battler can move, false otherwise.
   */
  canBattlerMove = () => {
    if (this.getMovementLock()) return false;

    const states = this.getBattler().states();
    if (!states.length) {
      return true;
    } else {
      const rooted = states.find(state => {
        if (state._jabs.rooted || state._jabs.paralyzed) {
          return true;
        } else {
          return false;
        }
      })

      return !rooted;
    }
  };

  /**
   * Whether or not the battler is able to use attacks based on states.
   */
  canBattlerUseAttacks = () => {
    const states = this.getBattler().states();
    if (!states.length) {
      return true;
    } else {
      const disabled = states.find(state => {
        if (state._jabs.disabled || state._jabs.paralyzed) {
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
   */
  canBattlerUseSkills = () => {
    const states = this.getBattler().states();
    if (!states.length) {
      return true;
    } else {
      const muted = states.find(state => {
        if (state._jabs.muted || state._jabs.paralyzed) {
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
  captureBaseSpriteInfo = () => {
    this._baseSpriteImage = this.setBaseSpriteName(this.getCharacterSpriteName());
    this._baseSpriteIndex = this.setBaseSpriteIndex(this.getCharacterSpriteIndex());
  };

  /**
   * Gets the name of this battler's current character sprite.
   * @returns {string}
   */
  getCharacterSpriteName = () => this.getCharacter()._characterName;

  /**
   * Gets the index of this battler's current character sprite.
   * @returns {number}
   */
  getCharacterSpriteIndex = () => this.getCharacter()._characterIndex;

  /**
   * Sets the name of this battler's original character sprite.
   * @param {string} name The name to set.
   */
  setBaseSpriteName = name => this._baseSpriteImage = name;

  /**
   * Sets the index of this battler's original character sprite.
   * @param {number} index The index to set.
   */
  setBaseSpriteIndex = index => this._baseSpriteIndex = index;

  /**
   * Whether or not the battler has an "offhand" piece of gear equipped.
   * This can either be a dual-wielded second weapon, or the first armor
   * equipped.
   */
  hasOffhandSkill = () => {
    const battler = this.getBattler();
    const offhandGear = battler.equips()[1];
    if (offhandGear && offhandGear._jabs.skillId) {
        return true;
    } else {
      return false;
    }
  };

  /**
   * Destroys this battler and removes it from the current battle map.
   */
  destroy = () => {
    this.setInvincible();
    $gameMap.destroyBattler(this);
  };

  /**
   * Gets this `JABS_Battler`'s unique identifier.
   * @returns {string}
   */
  getUuid = () => this._uuid;

  /**
   * Gets the database data for this battler.
   * @returns {(Game_Actor|Game_Enemy)} The battler data.
   */
  getReferenceData = () => {
    if (this.isActor()) {
      return $dataActors[this.getBattler().actorId()];
    } else if (this.getBattler().isEnemy()) {
      return $dataEnemies[this.getBattler().enemyId()];
    }
  };

  /**
   * Determines if this battler is facing its target.
   * @param {Game_Character} target The target `Game_Character` to check facing for.
   */
  isFacingTarget = target => {
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
   * Whether or not this battler has finished it's post-action cooldown phase.
   * @returns {boolean} True if the battler is cooled down, false otherwise.
   */
  isPostActionCooldownComplete = () => {
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
   * Whether or not this battler is ready to perform an idle action.
   * @returns {boolean} True if the battler is idle-ready, false otherwise.
   */
  isIdleActionReady = () => {
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
   * Whether or not this battler is actually the player.
   * @returns {boolean}
   */
  isPlayer = () => (this.getCharacter() instanceof Game_Player);

  /**
   * Whether or not this battler is a `Game_Actor`. 
   * The player counts as a `Game_Actor`, too.
   * @returns {boolean}
   */
  isActor = () => 
    (this.getBattler() instanceof Game_Actor || this.getCharacter() instanceof Game_Player);

  /**
   * Whether or not this battler is a `Game_Enemy`.
   * @returns {boolean}
   */
  isEnemy = () => (this.getBattler() instanceof Game_Enemy);

  /**
   * Compares team A (the battler) against team B (the target) to see
   * if the two share the same team id.
   * @param {boolean} targetTeam The team you are checking with. 
   */
  isSameTeam = targetTeam => this.getTeam() == targetTeam;

  /**
   * Gets this battler's team id.
   * @returns {number}
   */
  getTeam = () => this._team;

  /**
   * Gets the phase of battle this battler is currently in.
   * @returns {number} The phase this `JABS_Battler` is in. 
   */
  getPhase = () => this._phase;

  /**
   * Gets whether or not this battler is invincible.
   * @returns {boolean}
   */
  getInvincible = () => this._invincible;

  /**
   * Sets this battler to be invincible, rendering them unable to be collided
   * with by map actions of any kind.
   * @param {boolean} invincible True if uncollidable, false otherwise (default: true).
   */
  setInvincible = (invincible = true) => this._invincible = invincible;

  /**
   * Sets the phase of battle that this battler should be in.
   * @param {number} newPhase The new phase the battler is entering.
   */
  setPhase = newPhase => {
    this._phase = newPhase;
  };

  /**
   * Resets the phase of this battler back to one and resets all flags.
   */
  resetPhases = () => {
    this._phase = 1; // reset to first one
    this._prepareReady = false;
    this._postActionCooldownComplete = false;
    this.setDecidedAction(null);
    this.setInPosition(false);
  };

  /**
   * Gets whether or not this battler is in position for a given skill.
   * @returns {boolean}
   */
  isInPosition = () => this._inPosition;

  /**
   * Sets this battler to be identified as "in position" to execute their
   * decided skill.
   * @param {boolean} inPosition 
   */
  setInPosition = (inPosition = true) => this._inPosition = inPosition;

  /**
   * Gets whether or not this battler has decided an action.
   * @returns {boolean}
   */
  isActionDecided = () => this._decidedAction !== null;

  /**
   * Gets the battler's decided action.
   * @returns {JABS_Action}
   */
  getDecidedAction = () => this._decidedAction;

  /**
   * Sets this battler's decided action to this action.
   * @param {JABS_Action} action The action this battler has decided on.
   */
  setDecidedAction = action => this._decidedAction = action;

  /**
   * Resets the idle action back to a not-ready state.
   */
  resetIdleAction = () => {
    this._idleActionReady = false;
  };

  /**
   * Initializes a cooldown with the given key.
   * @param {string} cooldownKey The key of this cooldown.
   * @param {number} duration The duration to initialize this cooldown with.
   */
  initializeCooldown = (cooldownKey, duration) => {
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
  getCooldown = cooldownKey => this._cooldowns[cooldownKey];

  /**
   * Whether or not the skilltype has a base or combo cooldown ready.
   * @param {string} cooldownKey The cooldown key to check readiness for.
   */
  isSkillTypeCooldownReady = cooldownKey => {
    return this.isBaseCooldownReady(cooldownKey) || this.isComboCooldownReady(cooldownKey);
  };

  /**
   * Counts down the base action cooldown for this key.
   * @param {string} cooldownKey The key of this cooldown.
   */
  countdownBaseCooldown = cooldownKey => {
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
  isBaseCooldownReady = cooldownKey => {
    if (!this._cooldowns[cooldownKey]) {
      // this cooldown was never initialized for some reason- initialize it.
      this.initializeCooldown(cooldownKey, 120); // default value?
      return false;
    } else {
      return this._cooldowns[cooldownKey].ready;
    }
  };

  /**
   * Counts down the combo action cooldown for this key.
   * @param {string} cooldownKey The key of this cooldown.
   */
  countdownComboCooldown = cooldownKey => {
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
  isComboCooldownReady = cooldownKey => {
    if (!this._cooldowns[cooldownKey].comboNextActionId) return false;
    return this._cooldowns[cooldownKey].comboReady;
  };

  /**
   * Modifies the cooldown for this key by a given amount.
   * @param {string} cooldownKey The key of this cooldown.
   * @param {number} duration The duration of this cooldown.
   */
  modCooldownCounter = (cooldownKey, duration) => {
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
  setCooldownCounter = (cooldownKey, duration) => {
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
   */
  resetComboData = cooldownKey => {
    this._cooldowns[cooldownKey].comboFrames = 0;
    this._cooldowns[cooldownKey].comboNextActionId = 0;
    this._cooldowns[cooldownKey].comboReady = false;
  };

  /**
   * Gets the skill id of the next combo action in the sequence.
   * @returns {number} The skill id of the next combo action.
   */
  getComboNextActionId = cooldownKey => {
    return this._cooldowns[cooldownKey].comboNextActionId;
  };

  /**
   * Sets the skill id for the next combo action in the sequence.
   * @param {number} nextComboId The skill id for the next combo action.
   */
  setComboNextActionId = (cooldownKey, nextComboId) => {
    this._cooldowns[cooldownKey].comboNextActionId = nextComboId;
  };

  /**
   * Sets the combo frames to be a given value.
   * @param {string} cooldownKey The key associated with the cooldown.
   * @param {number} frames The number of frames until this combo action is ready.
   */
  setComboFrames = (cooldownKey, frames) => {
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
   * Gets all skills that are available to this enemy battler.
   */
  getSkillIdsFromEnemy = () => {
    const battler = this.getBattler();
    const battlerData = $dataEnemies[battler._enemyId];
    if (battlerData.actions.length > 0) {
      const skillIdRatings = battlerData.actions.map(action => {
        return [action.skillId, action.rating];
      })

      return skillIdRatings;
    } else {
      return [];
    }
  };

  /**
   * Retrieves the `[skillId, rating]` of the basic attack for this enemy.
   * @returns {number[]} The `[skillId, rating]` of the basic attack.
   */
  getEnemyBasicAttack = () => {
    const battler = this.getBattler();
    const basicAttackSkill = battler.skillId();
    return [basicAttackSkill, 5];
  };

  /**
   * Creates a new `JABS_Action` from a skill id.
   * @param {number} skillId The id of the skill to create a `JABS_Action` from.
   * @returns {JABS_Action[]} The `JABS_Action` based on the skill id provided.
   */
  createMapActionFromSkill = (skillId, isRetaliation = false) => {
    const skill = $dataSkills[skillId];
    const action = new Game_Action(this.getBattler());
    action.setSkill(skill.id);

    const { 
      cooldown, range, actionId, duration, shape, piercing, projectile, proximity
    } = skill._jabs;

    let actions = [];

    const projectileDirections = $gameBattleMap.determineActionDirections(
      this.getCharacter().direction(), 
      projectile);
    
    projectileDirections.forEach(direction => {
      const mapAction = new JABS_Action(
        skill,          // the skill data
        this.getTeam(), // the caster's team id
        cooldown,       // cooldown
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
      );

      actions.push(mapAction);
    });

    return actions;
  };

  /**
   * Consumes an item and performs its effects on the user.
   * @param {number} toolId The id of the tool/item to be used.
   * @param {boolean} isLoot Whether or not this is a loot pickup.
   */
  applyToolEffects = (toolId, isLoot = false) => {
    const item = $dataItems[toolId];
    const battler = this.getBattler();
    const character = this.getCharacter();
    let cooldown = 0;

    character.requestAnimation(item.animationId, false);

    const gameAction = new Game_Action(battler);
    gameAction.setItem(toolId);
    gameAction.apply(battler);
    battler.consumeItem(item);
    const popup = $gameBattleMap.configureDamagePop(gameAction, item, this, this);
    character.addTextPop(popup);
    character.setRequestTextPop();

    // create the log for the tool use.
    this.createToolLog(item);
  
    // it is an item with a custom cooldown.
    if (item._jabs.cooldown) {
      cooldown = item._jabs.cooldown;
      if (!isLoot) this.modCooldownCounter(Game_Actor.JABS_TOOLSKILL, cooldown);
    }

    // it was an item with a skill attached.
    if (item._jabs.skillId) {
      const mapAction = this.createMapActionFromSkill(item._jabs.skillId);
      mapAction.setCooldownType(Game_Actor.JABS_TOOLSKILL);
      $gameBattleMap.executeMapAction(this, mapAction);
    }

    // it was an item, didn't have a skill attached, and didn't have a cooldown.
    if (!item._jabs.cooldown && !item._jabs.skillId) {
      if (!isLoot) this.modCooldownCounter(Game_Actor.JABS_TOOLSKILL, J.ABS.DefaultValues.CooldownlessItems);
    }

    // if the last item was consumed, unequip it.
    if (!isLoot && !$gameParty.items().includes(item)) {
      battler.setEquippedSkill(Game_Actor.JABS_TOOLSKILL, 0);
      const lastItemMessage = `The last ${item.name} was consumed and unequipped.`;
      const log = new Map_TextLog(lastItemMessage, -1);
      $gameTextLog.addLog(log);
    }
  };

  /**
   * Creates the text log entry for executing an tool effect.
   */
  createToolLog = item => {
    // if not enabled, skip this.
    if (!J.TextLog.Metadata.Active) return;

    const battleMessage = `${this.getReferenceData().name} used the ${item.name}.`;
    const log = new Map_TextLog(battleMessage, -1);
    $gameTextLog.addLog(log);
  };

  /**
   * Constructs the attack data from this battler's skill slot.
   * @param {string} cooldownKey The key to build the combat action from.
   * @returns {JABS_Action[]} The constructed `JABS_Action`.
   */
  getAttackData = cooldownKey => {
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

      const comboMapActions = this.createMapActionFromSkill(comboActionId);
      return comboMapActions;
    }

    const attackMapActions = this.createMapActionFromSkill(id);
    return attackMapActions;
  };

  //#region Guarding
  /**
   * Whether or not this battler is currently guarding.
   * @returns {boolean}
   */
  get guarding() {
    return this._isGuarding;
  };

  /**
   * Sets the battler's guarding state.
   */
  set guarding(isGuarding) {
    this._isGuarding = isGuarding;
  };

  /**
   * The flat amount to reduce damage by when guarding.
   * @returns {number}
   */
  get flatGuardReduction() {
    if (!this.guarding) return 0;

    return this._guardFlatReduction;
  };

  /**
   * Sets the battler's flat reduction when guarding.
   */
  set flatGuardReduction(flatReduction) {
    this._guardFlatReduction = flatReduction;
  };

  /**
   * The percent amount to reduce damage by when guarding.
   * @returns {number}
   */
  get percGuardReduction() {
    if (!this.guarding) return 0;

    return this._guardPercReduction;
  };

  /**
   * Sets the battler's percent reduction when guarding.
   */
  set percGuardReduction(percReduction) {
    this._guardPercReduction = percReduction;
  };

  /**
   * Whether or not the precise-parry window is active.
   * @returns {boolean}
   */
  get parrying() {
    return this._parryWindow > 0;
  };

  /**
   * Sets the battlers precise-parry window frames.
   */
  setParryWindow(parryFrames) {
    if (parryFrames < 0) {
      this._parryWindow = 0;
    } else {
      this._parryWindow = parryFrames;
    }
  };

  /**
   * Gets the id of the skill to retaliate with when successfully guarding.
   * @returns {number}
   */
  get counterGuard() {
    return this.guarding
      ? this._counterGuardId
      : 0;
  };

  /**
   * Sets the battler's retaliation id for guarding.
   */
  set counterGuard(id) {
    this._counterGuardId = id;
  };

  /**
   * Gets the id of the skill to retaliate with when successfully precise-parrying.
   * @returns {number}
   */
  get counterParry() {
    return this.guarding
      ? this._counterParryId
      : 0;
  };

  /**
   * Sets the battler's retaliation id for precise-parrying.
   */
  set counterParry(id) {
    this._counterParryId = id;
  };

  /**
   * Constructs the guard data from this battler's skill slot.
   * @param {string} cooldownKey The key to build the guard data from.
   * @returns {[number, boolean, number, number, number]}
   */
  getGuardData = cooldownKey => {
    const battler = this.getBattler()
    const id = battler.getEquippedSkill(cooldownKey);
    if (!id) return null;

    const canUse = battler.canUse($dataSkills[id]);
    if (!canUse) {
      return null;
    }

    const skill = $dataSkills[id];
    const { guard, parry, counterGuard, counterParry } = skill._jabs;
    return [guard[0], guard[1], parry, counterGuard, counterParry];
  };

  /**
   * Determines whether or not the skill slot is a guard-type skill or not.
   * @returns {boolean} True if it is a guard skill, false otherwise.
   */
  isGuardSkillByKey = cooldownKey => {
    const battler = this.getBattler();
    const id = battler.getEquippedSkill(cooldownKey);
    if (!id) return false;

    const isGuardSkillType = JABS_Battler.isGuardSkillById(id);
    return isGuardSkillType;
  };

  /**
   * Triggers and maintains the guard state.
   */
  executeGuard = (guarding, skillSlot) => {
    // if we're still guarding, and already in a guard state, don't reset.
    if (guarding && this.guarding) return;

    // if not guarding anymore, turn off the guard state.
    if (!guarding && this.guarding) {
      this.guarding = false;
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
    this.guarding = true;
    this.flatGuardReduction = guardData[0];
    this.percGuardReduction = guardData[1];
    this.counterGuard = guardData[3];
    this.counterParry = guardData[4];

    // if the guarding skill has a parry window, apply those frames once.
    if (guardData[2]) this.setParryWindow(guardData[2]);

    // set the pose!
    const skill = $dataSkills[this.getBattler().getEquippedSkill(skillSlot)];
    this.performActionPose(skill);
  };

  /**
   * Counts down the parry window that occurs when guarding is first activated.
   */
  countdownParryWindow = () => {
    if (this.parrying) {
      this._parryWindow--;
    }

    if (this._parryWindow < 0) {
      this._parryWindow = 0;
    }
  };
  //#endregion

  /**
   * Executes an action pose.
   * @param {skill} skill The skill to pose for.
   */
  performActionPose = skill => {
    if (this._animating) {
      this.endAnimation();
    }

    const character = this.getCharacter();
    const baseSpriteName = this.getCharacterSpriteName();
    let newCharacterSprite = "";
    let suffix = "";
    let index = this.getCharacterSpriteIndex();
    let duration = 0;
    if (skill._jabs.poseSuffix) {
      const notedata = skill._jabs.poseSuffix;
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
  endAnimation = () => {
    this.setAnimationCount(0);
    this.resetAnimation();
  };

  /**
   * Sets the pose animation count to a given amount.
   */
  setAnimationCount = count => {
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
  resetAnimation = () => {
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
  countdownAnimation = () => {
    // if guarding, then it must be a guard animation.
    if (this.guarding) return;

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

  /**
   * Whether or not this battler is ready to take action of any kind.
   * @returns {boolean} True if the battler is ready, false otherwise.
   */
  isActionReady = () => {
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
   * @returns {number} The number of frames between actions.
   */
  getPrepareTime = () => {
    if (!this.isPlayer()) {
      const prepareTime = this.getBattler().prepareTime();
      return prepareTime;
    }
  };

  /**
   * Returns the `Game_Character` that this `JABS_Battler` is bound to. 
   * 
   * If this is the player, it will be a `Game_Player`, but otherwise, it'll be a `Game_Event`.
   * @returns {Game_Character} The event this `JABS_Battler` is bound to.
   */
  getCharacter = () => {
    return this._event;
  };

  /**
   * Returns the `Game_Battler` that this `JABS_Battler` represents. 
   * 
   * This may be either a `Game_Actor`, or `Game_Enemy`.
   * @returns {Game_Battler} The `Game_Battler` this battler represents.
   */
  getBattler = () => {
    return this._battler;
  };

  /**
   * Whether or not the event is actually loaded and valid.
   * @returns {boolean} True if the event is valid (non-player) and loaded, false otherwise.
   */
  isEventReady = () => {
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
  getSightRadius = () => {
    let sight = this._sightRadius;
    if (this.isAlerted()) {
      sight += this.getCharacter().alertedSightBoost();
    }

    return sight;
  };

  /**
   * The maximum distance a battler of a different team may reach before this unit disengages.
   * @returns {number} The pursuit radius for this `JABS_Battler`.
   */
  getPursuitRadius = () => {
    let pursuit = this._pursuitRadius;
    if (this.isAlerted()) {
      pursuit += this.getCharacter().alertedPursuitBoost();
    }
    return pursuit;
  };

  /**
   * Gets whether or not this battler is in an `alerted` state.
   */
  isAlerted = () => this._alerted;

  /**
   * Sets the alerted state for this battler.
   * @param {boolean} alerted The new alerted state (default = true).
   */
  setAlerted = (alerted = true) => this._alerted = alerted;

  /**
   * Sets the alerted counter to this number of frames.
   * @param {number} alertedFrames The duration in frames for how long to be alerted.
   */
  setAlertedCounter = alertedFrames => {
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
  getAlertedCoordinates = () => this._alertedCoordinates;

  /**
   * Sets the alerted coordinates.
   * @param {number} x The `x` of the alerter.
   * @param {number} y The `y` of the alerter.
   */
  setAlertedCoordinates = (x, y) => {
    this._alertedCoordinates = [x, y];
  };

  /**
   * Returns the X coordinate of the event portion's initial placement.
   * @returns {number} The X coordinate of this event's home.
   */
  getHomeX = () => this._homeX;

  /**
   * Returns the Y coordinate of the event portion's initial placement.
   * @returns {number} The Y coordinate of this event's home.
   */
  getHomeY = () => this._homeY;

  /**
   * Returns the X coordinate of the event at the present.
   */
  getX = () =>  this.getCharacter().x;

  /**
   * Returns the Y coordinate of the event at the present.
   */
  getY = () => this.getCharacter().y;

  /**
   * Tries to move this battler away from its current target.
   * This may fail if the battler is pinned in a corner or something.
   */
  moveAwayFromTarget = () => {
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
  smartMoveAwayFromTarget = () => {
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
  smartMoveTowardTarget = () => {
    const target = this.getTarget();
    this.smartMoveTowardCoordinates(target.getX(), target.getY());
  };

  /**
   * Tries to move this battler toward a set of coordinates.
   * @param {number} x The `x` coordinate to reach.
   * @param {number} y The `y` coordinate to reach.
   */
  smartMoveTowardCoordinates = (x, y) => {
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
  turnTowardTarget = () => {
    const character = this.getCharacter();
    const target = this.getTarget();
    character.turnTowardCharacter(target.getCharacter());
  };

  /**
   * Retrieves the battler's idle state.
   * @returns {boolean} True if the battler is idle, false otherwise.
   */
  isIdle = () => this._idle;

  /**
   * Retrieves the AI associated with this battler.
   * @returns {JABS_BattlerAI} This battler's AI.
   */
  getAiMode = () => this._aiMode;

  /**
   * Sets whether or not this battler is idle.
   * @param {boolean} isIdle True if this battler is idle, false otherwise.
   */
  setIdle = isIdle => {
    this._idle = isIdle;
  };

  /**
   * Whether or not this battler is at it's home coordinates.
   * @returns {boolean} True if the battler is home, false otherwise.
   */
  isHome = () => (this._event.x == this._homeX && this._event.y == this._homeY);

  /**
   * Whether or not this `JABS_Battler` is currently engaged in battle with a target.
   * @returns {boolean} Whether or not this battler is engaged.
   */
  isEngaged = () => {
    return this._engaged;
  };

  /**
   * Engage battle with the target battler.
   * @param {JABS_Battler} target The target this battler is engaged with.
   */
  engageTarget = target => {
    this._engaged = true;
    this.setTarget(target);
    //this._target = target;
    this.isIdle(false);
    this._event.lock();
    this.showBalloon(J.ABS.Balloons.Exclamation);
  };

  /**
   * Disengage from the target.
   */
  disengageTarget = () => {
    this._event.unlock();
    this.setTarget(null);
    //this._target = null;
    this._engaged = false;
    this.showBalloon(J.ABS.Balloons.Frustration);
  };

  /**
   * Returns the current target of this battler.
   * @returns {JABS_Battler}
   */
  getTarget = () => this._target;

  /**
   * Sets the target of this battler.
   * @param {JABS_Battler} newTarget The new target.
   */
  setTarget = newTarget => this._target = newTarget;

  /**
   * Determines the distance from this battler and the point.
   * @param {number} x The x coordinate to check.
   * @param {number} y The y coordinate to check.
   * @returns {number} The distance from the battler to the point.
   */
  distancetoPoint = (x, y) => {
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
   */
  distanceToDesignatedTarget = target => {
    if (!target) return null;
    return this.distancetoPoint(target.getX(), target.getY());
  };

  /**
   * Determines distance from this battler and the target.
   * @param {Game_Character} target The target that this battler is checking distance against.
   */
  distanceToCurrentTarget = () => {
    const target = this.getTarget();
    if (!target) return null;
    return this.distancetoPoint(target.getX(), target.getY());
  };

  /**
   * A shorthand reference to the distance this battler is from it's home.
   * @returns {number} The distance this battler is from home.
   */
  distanceToHome = () => {
    return this.distancetoPoint(this._homeX, this._homeY);
  };

  /**
   * Forces a display of a emoji balloon above this battler's head.
   * @param {number} balloonId The id of the balloon to display on this event.
   */
  showBalloon = balloonId => {
    $gameTemp.requestBalloon(this._event, balloonId);
  };

  /**
   * Parses the AI code string in the notes into an `JABS_BattlerAI`.
   * @returns {JABS_BattlerAI} The AI built off the provided attributes.
   */
  parseAi = () => {
    const character = this.getCharacter();
    if (character instanceof Game_Player) return null;

    const aiCode = character.aiCode();
    const aiMode = this.translateAiCode(aiCode);
    return aiMode;
  };

  /**
   * Translates the AI attribute codes in `string` form to a `JABS_BattlerAI`.
   * @param {string} code The code assigned in the notes that determines AI.
   * @returns {JABS_BattlerAI} The AI built off the provided attributes.
   */
  translateAiCode = code => {
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

  /**
   * Gets the speedboost values for this battler.
   * @returns {number} The speedboost value.
   */
  getSpeedBoosts = () => {
    // only calculate for the player (and allies).
    if (this.isEnemy()) return 0;

    let speedBoosts = this.getBattler().getSpeedBoosts();
    return speedBoosts;
  };

};
//#endregion

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
       * `00000001`, eigth bit.
       */
      this.leader = leader;
  }
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
   * All actions should exist visually for at least 1/4 of a second.
   */
  static getMinimumDuration = () => 15;

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
   */
  constructor(baseSkill, teamId, cooldownFrames, range, proximity, shape, 
    gameAction, caster, actionId, duration, piercing, isRetaliation, direction) {
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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }
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

  get useOnPickup() {
    return this._lootObject._jabs.useOnPickup;
  }
};
//#endregion JABS_LootDrop
//#endregion JABS objects

//ENDFILE