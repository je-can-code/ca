//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0.2 BASE] The base class for all J plugins.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ==============================================================================
 * This is the base class that is required for basically ALL of J-* plugins.
 * Please be sure this is above all other J-* plugins, and keep it up to date!
 * ==============================================================================
 * This contains little innate functionality on its own, but does keep within it
 * all the various classes and objects that other plugins use but needed to be
 * declared ahead of time.
 * ==============================================================================
 * Additionally, most of the note-reading and such takes place here as well.
 * ==============================================================================
 * CHANGELOG:
 * 
 * - 1.0.3
 *    Added "on-own-death" and "on-target-death" tag for battlers.
 *    Changed "retaliate" tag structure to allow a chance for triggering.
 * 
 * - 1.0.2
 *    Added an "IconManager" for consistent icon indexing between all my plugins.
 * 
 * - 1.0.1
 *    Updates for new models leveraged by the JAFTING system (refinement).
 *    All equipment now have a ._jafting property available on them.
 * 
 * - 1.0.0
 *    First proper actual release where I'm leveraging and enforcing versioning.
 * ==============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.BASE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.BASE.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-BASE`,

  /**
   * The version of this plugin.
   */
   Version: '1.0.3',
};

/**
 * A collection of helpful mappings for `notes` that are placed in 
 * various locations, like events on the map, or in a database enemy.
 */
J.BASE.Notetags = {
  // on actors in database.
  HitGrowth: "hitGrowth",
  GuardGrowth: "grdGrowth",
  KnockbackResist: "knockbackResist",
  NoSwitch: "noSwitch",

  // on skills in database.
  ActionId: "actionId",
  Aggro: "aggro",
  AggroMultiplier: "aggroMultiplier",
  AggroInAmp: "aggroInAmp",
  AggroOutAmp: "aggroOutAmp",
  AggroLock: "aggroLock",
  AiCooldown: "aiCooldown",
  CastAnimation: "castAnimation",
  CastTime: "castTime",
  Combo: "combo",
  Cooldown: "cooldown",
  CounterParry: "counterParry",
  CounterGuard: "counterGuard",
  Delay: "delay",
  DirectSkill: "direct",
  Duration: "duration",
  FreeCombo: "freeCombo",
  Guard: "guard",
  IgnoreParry: "ignoreParry",
  Knockback: "knockback",
  MoveType: "moveType",
  Parry: "parry",
  Piercing: "pierce",
  PoseSuffix: "poseSuffix",
  Projectile: "projectile",
  Proximity: "proximity",
  Range: "range",
  Retaliate: "retaliate",
  Shape: "shape",
  UniqueCooldown: "unique",

  // on items in database
  UseOnPickup: "useOnPickup",
  LootExpiration: "expires",

  // on equipment in database.
  BonusHits: "bonusHits",
  SkillId: "skillId",
  SpeedBoost: "speedBoost",

  MaxRefineCount: "maxRefine",
  MaxRefineTraits: "maxRefinedTraits",
  NotRefinementBase: "notRefinementBase",
  NotRefinementMaterial: "notRefinementMaterial",
  NoRefinement: "noRefine",

  // on enemies in database.
  Drops: "drops",
  EnemyLevel: "level",
  OnOwnDefeat: "onOwnDefeat",
  OnTargetDefeat: "onTargetDefeat",
  PrepareTime: "prepare",
  SdpPoints: "sdp",

  // on events on map.
  BattlerId: "e",
  AiCode: "ai",
  Team: "team",
  Sight: "s",
  Pursuit: "p",
  MoveSpeed: "ms",
  NoIdle: "noIdle",
  NoHpBar: "noHpBar",
  NoDangerIndicator: "noDangerIndicator",
  NoBattlerName: "noName",
  Inanimate: "inanimate",
  Invincible: "invincible", // also on dodge skills
  AlertDuration: "ad",
  AlertSightBoost: "as",
  AlertPursuitBoost: "ap",

  // on states in database.
  Paralyzed: "paralyzed",
  Rooted: "rooted",
  Muted: "muted",
  Disabled: "disabled",
  NegativeState: "negative",
  HpFlat: "hpFlat",
  MpFlat: "mpFlat",
  TpFlat: "tpFlat",
  HpPerc: "hpPerc",
  MpPerc: "mpPerc",
  TpPerc: "tpPerc",
};

/**
 * The various collision shapes an attack can be for JABS.
 */
J.BASE.Shapes = {
  /**
   * A rhombus (aka diamond) shaped hitbox.
   */
  Rhombus: "rhombus",

  /**
   * A square around the target hitbox.
   */
  Square: "square",

  /**
   *  A square in front of the target hitbox.
   */
  FrontSquare: "frontsquare",

  /**
   * A line from the target hitbox.
   */
  Line: "line",

  /**
   * An arc shape hitbox in front of the action.
   */
  Arc: "arc",

  /**
   * A wall in front of the target hitbox.
   */
  Wall: "wall",

  /**
   * A cross from the target hitbox.
   */
  Cross: "cross"
};

J.BASE.Traits = {
  /**
   * Defines a modification to one of the base parameters.
   * `.dataId` represents the parameter id, while `.value` represents the % modifier.
   */
  B_PARAMETER: 21,

  /**
   * Defines a modification to one of the ex parameters.
   * `.dataId` represents the parameter id, while `.value` represents the % modifier.
   */
  X_PARAMETER: 22,

  /**
   * Defines a modification to one of the sp parameters.
   * `.dataId` represents the parameter id, while `.value` represents the % modifier.
   */
  S_PARAMETER: 23,

  /**
   * Defines the element associated with a skill/equipment/enemy.
   * `.dataId` represents the id of the element.
   */
  ATTACK_ELEMENT: 31,

  /**
   * Defines the speed of deciding what action to take.
   * Caps at 1000 in the editor.
   */
  ATTACK_SPEED: 33,

  /**
   * Defines the skill id.
   * For weapons and enemies, this represents the skill used for attacking.
   * For armor, this does nothing directly- but when used in the context of
   * JAFTING's refinement, it can redefine the skill used when a weapon attacks.
   */
  ATTACK_SKILLID: 35,

  /**
   * The `DIVIDER` trait, specifically for JAFTING's refinement functionality.
   */
  NO_DISAPPEAR: 63,

};

/**
 * A collection of all aliased methods for this plugin.
 */
J.BASE.Aliased = {
  DataManager: {},
  Game_Character: {},
  Window_Command: {},
};

//#region Helpers
/**
 * The helper functions used commonly throughout my plugins.
 */
J.BASE.Helpers = {};

/**
 * Generates a `uuid`- a universally unique identifier- for this battler.
 * @returns {string} The `uuid`.
 */
J.BASE.Helpers.generateUuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};

/**
 * Confirms the existence of a given file.
 * @param {string} path The path of the file we're checking.
 * @returns {boolean} True if the file exists, false otherwise.
 */
J.BASE.Helpers.checkFile = function(path) {
  const fs = require('fs');
  return fs.existsSync(path);
};

/**
 * Updates the value of a numeric variable by a given amount.
 *
 * NOTE: This assumes the variable contains only a number.
 * @param {number} variableId The id of the variable to modify.
 * @param {number} amount The amount to modify the variable by.
 */
J.BASE.Helpers.modVariable = function(variableId, amount) {
  const oldValue = $gameVariables.value(variableId);
  const newValue = oldValue + amount;
  $gameVariables.setValue(variableId, newValue);
};

/**
 * Provides a random integer within the range
 * @param {number} min The lower bound for random numbers (inclusive).
 * @param {number} max The upper bound for random numbers (exclusive).
 */
J.BASE.Helpers.getRandomNumber = function(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min))
};

/**
 * Translates the id and type into a proper `RPG::Item`.
 * @param {number} id The id of the item in the database.
 * @param {string} type An abbreviation for the type of item this is.
 * @returns {object} The `RPG::Item` of the correct id and type.
 */
J.BASE.Helpers.translateItem = function(id, type) {
  switch (type) {
    case "i":
      return $dataItems[id];
    case "w":
      return $dataWeapons[id];
    case "a":
      return $dataArmors[id];
  }
};

/**
 * Quick and dirty semver without having access to the full nodejs ecosystem.
 * Checks to ensure the version meets the required version- same as `semver.satisfies()`.
 * Double tilda is shorthand for `parseInt()`.
 * @param {string} currentVersion String representation of the version being checked.
 * @param {string} minimumVersion String representation of the minimum required version.
 * @returns {boolean}
 */
J.BASE.Helpers.satisfies = function (currentVersion, minimumVersion) {
  const currentVersionParts = currentVersion.split('.');
  const minimumVersionParts = minimumVersion.split('.');
  for (const i in currentVersionParts) {
    const a = ~~currentVersionParts[i];
    const b = ~~minimumVersionParts[i];
    if (a > b) return true;
    if (a < b) return false;
  }

  return true; // must be the same
};

/**
 * Parses out a skill chance based on the regex from the reference data.
 * @param {RegExp} structure The RegExp expression to match.
 * @param {rm.types.BaseItem} referenceData The reference data to parse.
 * @returns {JABS_SkillChance}
 */
J.BASE.Helpers.parseSkillChance = function(structure, referenceData) {
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const notedata = referenceData.note.split(/[\r\n]+/);
  const skills = [];
  notedata.forEach(line => {
    if (line.match(structure)) {
      const data = JSON.parse(RegExp.$1);
      const skillChance = new JABS_SkillChance(
        parseInt(data[0]),
        parseInt(data[1]),
        J.BASE.Helpers.getKeyFromRegexp(structure));
      skills.push(skillChance);
    }
  });

  return skills;
};

/**
 * Extracts the key portion from a tag.
 * @param {RegExp} structure The structure of the regular expression.
 * @returns {string}
 */
J.BASE.Helpers.getKeyFromRegexp = function(structure) {
  const stringifiedStructure = structure.toString();
  return stringifiedStructure
    .substring(stringifiedStructure.indexOf('<') + 1, stringifiedStructure.indexOf(':'));
};
//#endregion Helpers
//#endregion Introduction

//#region Static objects
//#region DataManager
/**
* Whether or not the extra data was loaded into the multiple databases.
*/
DataManager._extraDataLoaded = false;

/**
 * Hooks into the database loading and loads our extra data from notes and such.
 */
J.BASE.Aliased.DataManager.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  let result = J.BASE.Aliased.DataManager.isDatabaseLoaded.call(this);
  if (result) {
    this.loadExtraData();
  }

  return result;
};

/**
 * Loads all extra data from notes and such into the various anonymous database objects.
 */
DataManager.loadExtraData = function() {
  if (!DataManager._extraDataLoaded) {
    this.addExtraSkillData();
    this.addExtraWeaponData();
    this.addExtraArmorData();
    this.addExtraItemData();
    this.addExtraStateData();
    this._extraDataLoaded = true;
  }
};

/**
 * Loads all extra data from the notes of skills.
 */
DataManager.addExtraSkillData = function() {
  $dataSkills.forEach((skill, index) => {
    if (!skill) return;
    skill._j = new JABS_SkillData(skill.note, skill.meta);
    skill.index = index;
  });
};

/**
 * Loads all extra data from the notes of weapons.
 */
DataManager.addExtraWeaponData = function() {
  $dataWeapons.forEach(DataManager.parseWeaponData);
};

/**
 * The action to perform on each weapon.
 * This was separated out for extensibility if desired.
 * @param {rm.types.EquipItem} weapon The equip to modify.
 * @param {number} index The index of the equip.
 */
DataManager.parseWeaponData = function(weapon, index) {
  if (!weapon) return;
  weapon._j = new JABS_EquipmentData(weapon.note, weapon.meta);
  weapon._jafting = new JAFTING_RefinementData(weapon.note, weapon.meta);
  weapon.index = index;
};

/**
 * Loads all extra data from the notes of armors.
 */
DataManager.addExtraArmorData = function() {
  $dataArmors.forEach(DataManager.parseArmorData);
};

/**
 * The action to perform on each armor.
 * This was separated out for extensibility if desired.
 * @param {rm.types.EquipItem} armor The equip to modify.
 * @param {number} index The index of the equip.
 */
DataManager.parseArmorData = function(armor, index) {
  if (!armor) return;
  armor._j = new JABS_EquipmentData(armor.note, armor.meta);
  armor._jafting = new JAFTING_RefinementData(armor.note, armor.meta);
  armor.index = index;
};

/**
 * Loads all extra data from the notes of items.
 */
DataManager.addExtraItemData = function() {
  $dataItems.forEach((item, index) => {
    if (!item) return;
    item._j = new JABS_ItemData(item.note, item.meta);
    item.index = index;
    item.refinedCount = 0;
  });
};

/**
 * Loads all extra data from the notes of states.
 */
DataManager.addExtraStateData = function() {
  $dataStates.forEach((state, index) => {
    if (!state) return;
    state._j = new JABS_StateData(state.note, state.meta);
    state.index = index;
  });
};
//#endregion DataManager

//#region TextManager
/**
 * Gets the name of the given sp-parameter.
 * @param {number} sParamId The id of the sp-param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.sparam = function (sParamId) {
  switch (sParamId) {
    case 0: return "Aggro";// J.Param.TGR_text;
    case 1: return "Parry";//J.Param.GRD_text;
    case 2: return "Healing"; //J.Param.REC_text;
    case 3: return "Pharmacy"; //J.Param.PHA_text;
    case 4: return "Magi Reduce"; //J.Param.MCR_text;
    case 5: return "Tech Reduce"; //J.Param.TCR_text;
    case 6: return "Phys Dmg Rate"; //J.Param.PDR_text;
    case 7: return "Magi Dmg Rate"; //J.Param.MDR_text;
    case 8: return "Light-footed"; //J.Param.FDR_text;
    case 9: return "Experience UP"; //J.Param.EXR_text;
  }
};

/**
 * Gets the name of the given ex-parameter.
 * @param {number} xParamId The id of the ex-param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.xparam = function (xParamId) {
  switch (xParamId) {
    case 0: return "Hit Rate";// J.Param.HIT_text;
    case 1: return "Evasion Rate";//J.Param.EVA_text;
    case 2: return "Crit Rate"; //J.Param.CRI_text;
    case 3: return "Crit Evade"; //J.Param.CEV_text;
    case 4: return "Magic Evade"; //J.Param.MEV_text;
    case 5: return "Magic Reflect"; //J.Param.MRF_text;
    case 6: return "Counter Rate"; //J.Param.CNT_text;
    case 7: return "Life Regen"; //J.Param.HRG_text;
    case 8: return "Magi Regen"; //J.Param.MRG_text;
    case 9: return "Tech Regen"; //J.Param.TRG_text;
  }
};
//#endregion TextManager

//#region IconManager
// Assigns icons to B-parameter ID's based on icon number provided in default params.
class IconManager {
  /**
   * The constructor is not designed to be called. 
   * This is a static class.
   * @constructor
   */
   constructor() { throw new Error("The IconManager is a static class."); };

   /**
    * Gets the corresponding `iconIndex` for the param.
    * @param {number} paramId The id of the param.
    * @returns {number}
    */
  static param(paramId) {
    switch (paramId) {
      case  0: return 247; // mhp
      case  1: return 248; // mmp
      case  2: return 2755; // atk
      case  3: return 251; // def
      case  4: return 252; // mat
      case  5: return 253; // mdf
      case  6: return 254; // agi
      case  7: return 255; // luk
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the x-param.
   * @param {number} paramId The id of the param.
   * @returns {number}
   */
  static xparam(paramId) {
    switch (paramId) {
      case  0: return 102; // hit
      case  1: return  82; // eva
      case  2: return 127; // cri
      case  3: return  81; // cev
      case  4: return  71; // mev
      case  5: return 222; // mrf
      case  6: return  15; // cnt
      case  7: return 2153; // hrg
      case  8: return 2245; // mrg
      case  9: return   13; // trg
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the s-param.
   * @param {number} paramId The id of the param.
   * @returns {number}
   */
  static sparam(paramId) {
    switch (paramId) {
      case  0: return  14; // trg (aggro)
      case  1: return 128; // grd (parry)
      case  2: return  84; // rec
      case  3: return 209; // pha
      case  4: return 189; // mcr (mp reduce)
      case  5: return 126; // tcr (tp reduce)
      case  6: return 129; // pdr
      case  7: return 147; // mdr
      case  8: return 141; // fdr
      case  9: return 156; // exr
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the element.
   * @param {number} paramId The id of the element.
   * @returns {number}
   */
  static elementIcon(elementId) {
    switch(elementId) {
      case 0: return 127;
      case 1: return 912;
      case 2: return 913;
      case 3: return 914;
      case 4: return 915;
      case 5: return 916;
      case 6: return 917;
      case 7: return 918;
      case 8: return 919;
      case 9: return 920;
    }
  };
  
};
//#endregion IconManager
//#endregion Static objects

//#region Game objects
//#region Game_Actor
/**
 * Gets all skills that are executed when this actor is defeated.
 * @returns {JABS_SkillChance[]}
 */
Game_Actor.prototype.onOwnDefeatSkillIds = function() {
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const skills = [];
  objectsToCheck.forEach(obj => {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * Gets all skills that are executed when this actor defeats a target.
 * @returns {JABS_SkillChance[]}
 */
Game_Actor.prototype.onTargetDefeatSkillIds = function() {
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const skills = [];
  objectsToCheck.forEach(obj => {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * Checks all possible places for whether or not the actor is able to
 * be switched to.
 * @returns {boolean}
 */
Game_Actor.prototype.switchLocked = function() {
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<noSwitch>/i;
  let switchLocked = false;
  objectsToCheck.forEach(obj => {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line => {
      if (line.match(structure)) {
        switchLocked = true;
      }
    });
  });

  return switchLocked;
};

/**
 * Gets all things the things that this actor has that can possibly have
 * notes on it at the present moment. This includes the actor itself, the
 * actor's class, their skills, their equips, and their current states.
 * @returns {rm.types.BaseItem[]}
 */
Game_Actor.prototype.getEverythingWithNotes = function() {
  const objectsWithNotes = [];
  objectsWithNotes.push(this.actor());
  objectsWithNotes.push(this.currentClass());
  objectsWithNotes.push(...this.skills());
  objectsWithNotes.push(...this.equips().filter(equip => !!equip));
  objectsWithNotes.push(...this.states());
  return objectsWithNotes;
};

/**
 * Gets how much bonus HIT this actor has based on level.
 * @returns {number} The amount of growth in HIT for this actor.
 */
Game_Actor.prototype.hitGrowth = function() {
  let hitGrowthPerLevel = 0;
  if (this._meta && this._meta[J.BASE.Notetags.HitGrowth]) {
    hitGrowthPerLevel = parseFloat(this._meta[J.BASE.Notetags.HitGrowth]);
  } else {
    const structure = /<hitGrowth:[ ]?([.\d]+)>/i;
    this.actor().note.split(/[\r\n]+/).forEach(note => {
      if (note.match(structure)) {
        hitGrowthPerLevel = parseFloat(RegExp.$1);
      }
    });
  }

  return parseFloat(((hitGrowthPerLevel * this.level) / 100).toFixed(2));
};

/**
 * Gets how much bonus GRD this actor has based on level.
 * @returns {number} The amount of growth in GRD for this actor.
 */
Game_Actor.prototype.grdGrowth = function() {
  let grdGrowthPerLevel = 0;
  if (this._meta && this._meta[J.BASE.Notetags.GuardGrowth]) {
    grdGrowthPerLevel = parseFloat(this._meta[J.BASE.Notetags.GuardGrowth]);
  } else {
    const structure = /<grdGrowth:[ ]?([.\d]+)>/i;
    this.actor().note.split(/[\r\n]+/).forEach(note => {
      if (note.match(structure)) {
        grdGrowthPerLevel = parseFloat(RegExp.$1);
      }
    });
  }

  return parseFloat(((grdGrowthPerLevel * this.level) / 100).toFixed(2));
};

/**
 * Gets the prepare time for this actor.
 * Actors are not gated by prepare times, only by post-action cooldowns.
 * @returns {number}
 */
 Game_Actor.prototype.prepareTime = function() {
  return 1;
};

/**
 * Gets the skill id for this actor.
 * Actors don't use this functionality, they have equipped skills instead.
 * @returns {null}
 */
Game_Actor.prototype.skillId = function() {
  return null;
};

/**
 * Gets the sight range for this actor.
 * Looks first to the class, then the actor for the tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.sightRange = function() {
  let val = Game_Battler.prototype.sightRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Sight]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Sight]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Sight]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Sight]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<s:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alerted sight boost for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.alertedSightBoost = function() {
  let val = Game_Battler.prototype.alertedSightBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertSightBoost]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertSightBoost]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<as:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alerted pursuit boost for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.pursuitRange = function() {
  let val = Game_Battler.prototype.pursuitRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Pursuit]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Pursuit]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Pursuit]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Pursuit]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<p:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alerted pursuit boost for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.alertedPursuitBoost = function() {
  let val = Game_Battler.prototype.alertedPursuitBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertPursuitBoost]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertPursuitBoost]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ap:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alert duration for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.alertDuration = function() {
  let val = Game_Battler.prototype.alertDuration.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertDuration]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertDuration]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertDuration]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertDuration]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ad:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the team id for this actor.
 * Actors are ALWAYS on team id of 0.
 * @returns {number}
 */
Game_Actor.prototype.teamId = function() {
  if (J.ABS) {
    return JABS_Battler.allyTeamId();
  }

  return 0;
};

/**
 * Gets the ai of the actor.
 * Though allies leverage ally ai for action decision making, this AI does
 * have one effect: how to move around and stuff throughout the phases.
 * @returns {null}
 */
Game_Actor.prototype.ai = function() {
  return new JABS_BattlerAI(true, true);
};

/**
 * Gets whether or not the actor can idle.
 * Actors can never idle.
 * @returns {boolean}
 */
Game_Actor.prototype.canIdle = function() {
  return false;
};

/**
 * Gets whether or not the actor's hp bar will show.
 * Actors never show their hp bar (they use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showHpBar = function() {
  return false;
};

/**
 * Gets whether or not the actor's danger indicator will show.
 * Danger indicator is not applicable to actors (since it is relative to the player).
 * @returns {boolean}
 */
Game_Actor.prototype.showDangerIndicator = function() {
  return false;
};

/**
 * Gets whether or not the actor's name will show below their character.
 * Actors never show their name (the use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showBattlerName = function() {
  return false;
};

/**
 * Gets whether or not the actor is invincible.
 * Actors are never invincible by this means.
 * @returns {boolean}
 */
Game_Actor.prototype.isInvincible = function() {
  return false;
};

/**
 * Gets whether or not the actor is inanimate.
 * Actors are never inanimate (duh).
 * @returns {boolean}
 */
Game_Actor.prototype.isInanimate = function() {
  return false;
};

/**
 * Gets the retaliation skill ids for this actor.
 * Will retrieve from actor, class, all equipment, and states.
 * @returns {JABS_SkillChance[]}
 */
Game_Actor.prototype.retaliationSkills = function() {
  const structure = /<retaliate:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const objectsToCheck = this.getEverythingWithNotes();
  const skills = [];
  objectsToCheck.forEach(obj => {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * All battlers have a prepare time.
 * At this level, returns default 180 frames.
 * @returns {number}
 */
Game_Battler.prototype.prepareTime = function() {
  return 180;
};

/**
 * All battlers have a skill id for their basic attack.
 * At this level, returns the default skill id of 1.
 * @returns {number}
 */
Game_Battler.prototype.skillId = function() {
  return 1;
};

/**
 * All battlers have a default sight range.
 * @returns {number}
 */
Game_Battler.prototype.sightRange = function() {
  return 4;
};

/**
 * All battlers have a default alerted sight boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedSightBoost = function() {
  return 2;
};

/**
 * All battlers have a default pursuit range.
 * @returns {number}
 */
Game_Battler.prototype.pursuitRange = function() {
  return 6;
};

/**
 * All battlers have a default alerted pursuit boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedPursuitBoost = function() {
  return 4;
};

/**
 * All battlers have a default alert duration.
 * @returns {number}
 */
Game_Battler.prototype.alertDuration = function() {
  return 300;
};

/**
 * All battlers have a default team id.
 * At this level, the default team id is 1 (the default for enemies).
 * @returns {number}
 */
Game_Battler.prototype.teamId = function() {
  if (J.ABS) return JABS_Battler.enemyTeamId();

  return 1;
};

/**
 * All battlers have a default AI.
 * @returns {JABS_BattlerAI}
 */
Game_Battler.prototype.ai = function() {
  if (J.ABS) return new JABS_BattlerAI();

  return null;
};

/**
 * All battlers can idle by default.
 * @returns {boolean}
 */
Game_Battler.prototype.canIdle = function() {
  return true;
};

/**
 * All battlers will show their hp bar by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showHpBar = function() {
  return true;
};

/**
 * All battlers will show their danger indicator by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showDangerIndicator = function() {
  return true;
};

/**
 * All battlers will show their database name by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showBattlerName = function() {
  return true;
};

/**
 * All battlers can be invincible, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInvincible = function() {
  return false;
};

/**
 * All battlers can be inanimate, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInanimate = function() {
  return false;
};

/**
 * All battlers have a default of no retaliation skills.
 * @returns {JABS_SkillChance[]}
 */
Game_Battler.prototype.retaliationSkills = function() {
  const structure = /<retaliate:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const objectsToCheck = this.getEverythingWithNotes();
  const skills = [];
  objectsToCheck.forEach(obj => {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * All battlers have a default of no on-own-defeat skill ids.
 * @returns {number[]}
 */
Game_Battler.prototype.onOwnDefeatSkillIds = function() {
  return [];
};

/**
 * All battlers have a default of no on-defeating-a-target skill ids.
 * @returns {number[]}
 */
Game_Battler.prototype.onTargetDefeatSkillIds = function() {
  return [];
};

/**
 * All battlers have this, but actors and enemies perform this function differently.
 * @returns {rm.types.BaseItem[]}
 */
Game_Battler.prototype.getEverythingWithNotes = function() {
  return [];
};

/**
 * Gets whether or not the aggro is locked for this battler.
 * Locked aggro means their aggro cannot be modified in any way.
 * @returns {boolean}
 */
Game_Battler.prototype.isAggroLocked = function() {
  return this.states().some(state => state._j.aggroLock);
};

/**
 * Gets the multiplier for received aggro for this battler.
 * @returns {number}
 */
Game_Battler.prototype.aggroInAmp = function() {
  let inAmp = 1.0;
  this.states().forEach(state => inAmp += state._j.aggroInAmp);
  return inAmp;
};

/**
 * Gets the multiplier for dealt aggro for this battler.
 * @returns {number}
 */
Game_Battler.prototype.aggroOutAmp = function() {
  let outAmp = 1.0;
  this.states().forEach(state => outAmp += state._j.aggroOutAmp);
  return outAmp;
};
//#endregion Game_Battler

//#region Game_Character
/**
 * Gets the `aiCode` for this character.
 * If no code is specified, return `10000000`.
 * @returns {string}
 */
Game_Character.prototype.aiCode = function() {
  let aiCode = "10000000";
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AiCode]) {
    aiCode = referenceData.meta[J.BASE.Notetags.AiCode] || aiCode;
  } else {
    const structure = /<ai:[ ]?([0|1]{8})>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        aiCode = RegExp.$1;
      }
    })
  }

  return aiCode;
};

/**
 * Gets the `battlerId` for this character.
 * If no id is specified, return `0`.
 * @returns {number}
 */
Game_Character.prototype.battlerId = function() {
  let battlerId = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.BattlerId]) {
    // if its in the metadata, then grab it from there.
    battlerId = referenceData.meta[J.BASE.Notetags.BattlerId] || battlerId;
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<e:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        battlerId = RegExp.$1;
      }
    });
  }

  return parseInt(battlerId);
};

/**
 * Gets the `sightRange` for this character.
 * If no sight is specified, return `0`.
 * @returns {number}
 */
Game_Character.prototype.sightRadius = function() {
  let sightRadius = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Sight]) {
    sightRadius = referenceData.meta[J.BASE.Notetags.Sight] || sightRadius;
  } else {
    const structure = /<s:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        sightRadius = RegExp.$1;
      }
    })
  }

  return parseInt(sightRadius);
};

/**
 * Gets the boost to `sightRange` for this character when alerted.
 * @returns {number}
 */
Game_Character.prototype.alertedSightBoost = function() {
  let sightBoost = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertSightBoost]) {
    sightBoost = referenceData.meta[J.BASE.Notetags.AlertSightBoost] || sightBoost;
  } else {
    const structure = /<as:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        sightBoost = RegExp.$1;
      }
    })
  }

  return parseInt(sightBoost);
};

/**
 * Gets the `pursuitRange` for this character.
 * If no pursuit is specified, return `0`.
 * @returns {number}
 */
Game_Character.prototype.pursuitRadius = function() {
  let pursuitRadius = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Pursuit]) {
    pursuitRadius = referenceData.meta[J.BASE.Notetags.Pursuit] || pursuitRadius;
  } else {
    const structure = /<p:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        pursuitRadius = RegExp.$1;
      }
    })
  }

  return parseInt(pursuitRadius);
};

/**
 * Gets the boost to `pursuitRange` for this character when alerted.
 * @returns {number}
 */
Game_Character.prototype.alertedPursuitBoost = function() {
  let pursuitBoost = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertPursuitBoost]) {
    pursuitBoost = referenceData.meta[J.BASE.Notetags.AlertPursuitBoost] || pursuitBoost;
  } else {
    const structure = /<ap:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        pursuitBoost = RegExp.$1;
      }
    })
  }

  return parseInt(pursuitBoost);
};

/**
 * Gets the duration of which this battler will spend alerted.
 * @returns {number}
 */
Game_Character.prototype.alertedDuration = function() {
  let alertDuration = 300;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertDuration]) {
    alertDuration = referenceData.meta[J.BASE.Notetags.AlertDuration] || alertDuration;
  } else {
    const structure = /<ad:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        alertDuration = RegExp.$1;
      }
    })
  }

  return parseInt(alertDuration);
};

/**
 * Gets the `pursuitRange` for this character.
 * If no pursuit is specified, return `0`.
 * @returns {number}
 */
Game_Character.prototype.customMoveSpeed = function() {
  let customMoveSpeed = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.MoveSpeed]) {
    customMoveSpeed = referenceData.meta[J.BASE.Notetags.MoveSpeed] || customMoveSpeed;
  } else {
    const structure =/<ms:((0|([1-9][0-9]*))(\.[0-9]+)?)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        customMoveSpeed = RegExp.$1;
      }
    })
  }

  return parseFloat(customMoveSpeed);
};

/**
 * Gets the `idle` boolean for this battler.
 * `True` by default.
 * @returns {boolean}
 */
Game_Character.prototype.canIdle = function() {
  let canIdle = true;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoIdle]) {
    canIdle = false;
  } else {
    const structure =/<noIdle>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        canIdle = false;
      }
    })
  }

  if (this.isInanimate()) canIdle = false;
  return canIdle;
};

/**
 * Gets the boolean for whether or not to show the hp bar.
 * `True` by default.
 * @returns {boolean}
 */
Game_Character.prototype.showHpBar = function() {
  if (!(this instanceof Game_Event)) return false;

  let showHpBar = true;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoHpBar]) {
    showHpBar = false;
  } else {
    const structure =/<noHpBar>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        showHpBar = false;
      }
    })
  }

  if (this.isInanimate()) showHpBar = false;
  return showHpBar;
};

/**
 * Gets the boolean for whether or not this battler is invincible.
 * Invincible is defined as "not able to be collided with".
 * `False` by default.
 * @returns {boolean}
 */
Game_Character.prototype.isInvincible = function() {
  if (!(this instanceof Game_Event)) return;

  let invincible = false;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Invincible]) {
    invincible = true;
  } else {
    const structure =/<invincible>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        invincible = true;
      }
    })
  }

  return invincible;
};

/**
 * Gets the boolean for whether or not this is an inanimate object.
 * Inanimate objects have no hp bar, don't move idly, and cannot engage.
 * This is typically used for things like traps that perform actions.
 * `False` by default.
 * @returns {boolean}
 */
Game_Character.prototype.isInanimate = function() {
  if (!(this instanceof Game_Event)) return;

  let inanimate = false;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Inanimate]) {
    inanimate = true;
  } else {
    const structure =/<inanimate>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        inanimate = true;
      }
    })
  }

  return inanimate;
};
//#endregion Game_Character

//#region Game_Enemy
/**
 * Gets the enemy's level.
 * If no level is specified, return `0`.
 * @returns {number}
 */
Object.defineProperty(Game_Enemy.prototype, "level", {
  get() {
    let level = 0;

    const referenceData = $dataEnemies[this.enemyId()];
    if (referenceData.meta && referenceData.meta[J.BASE.Notetags.EnemyLevel]) {
      level = parseInt(referenceData.meta[J.BASE.Notetags.EnemyLevel]) || level;
    } else {
      const structure = /<level:[ ]?([0-9]*)>/i;
      const notedata = referenceData.note.split(/[\r\n]+/);
      notedata.forEach(note => {
        if (note.match(structure)) {
          level = RegExp.$1;
        }
      })
    }

    return parseInt(level);
  },
  configurable: true,
});

/**
 * Gets any additional drops from the notes of this particular enemy.
 * @returns {[string, number, number][]}
 */
Game_Enemy.prototype.extraDrops = function() {
  const referenceData = this.enemy();
  const dropList = [];
  const structure = /<drops:[ ]?\[(i|item|w|weapon|a|armor),[ ]?(\d+),[ ]?(\d+)]>/i;
  const notedata = referenceData.note.split(/[\r\n]+/);
  notedata.forEach(note => {
    if (note.match(structure)) {
      let kind = 0;
      switch (RegExp.$1) {
        case ("i" || "item"):
          kind = 1;
          break;
        case ("w" || "weapon"):
          kind = 2;
          break;
        case ("a" || "armor"):
          kind = 3;
          break;
      }

      const result = { 
        kind, 
        dataId: parseInt(RegExp.$2), 
        denominator: parseInt(RegExp.$3)
      };
      dropList.push(result);
    }
  });

  // if there is a panel that needs to be added to the list, then add it.
  const sdpDrop = this.needsSdpDrop();
  if (sdpDrop) dropList.push(sdpDrop);

  return dropList;
};

/**
 * Determines if there is an SDP to drop, and whether or not to drop it.
 * @returns {{kind, dataId, denominator}}
 */
Game_Enemy.prototype.needsSdpDrop = function() {
  // doesn't matter if we aren't even using the SDP system.
  if (!J.SDP) return null;

  const referenceData = this.enemy();
  const structure = /<sdpPanel:[ ]?"(.*?)":(\d+):(\d+)>/i;
  const notedata = referenceData.note.split(/[\r\n]+/);

  // get the panel key from this enemy if it exists.
  let panelKey = "";
  notedata.forEach(note => {
    if (note.match(structure)) {
      panelKey = RegExp.$1;
    }
  });

  // if we don't have a panel key, then give up.
  if (!panelKey) return null;

  // if a panel exists to be earned, but we already have it, then give up.
  const alreadyEarned = $gameSystem.getSdp(panelKey).isUnlocked();
  if (alreadyEarned) return null;

  // create the new drop based on the SDP.
  return {
    kind: 1, // all SDP drops are assumed to be "items".
    dataId: parseInt(RegExp.$2),
    denominator: parseInt(RegExp.$3)
  };
};

/**
 * Gets the amount of sdp points granted by this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.sdpPoints = function() {
  let points = 0;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.SdpPoints]) {
    // if its in the metadata, then grab it from there.
    points = referenceData.meta[J.BASE.Notetags.SdpPoints];
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<sdpPoints:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        points = RegExp.$1;
      }
    })
  }

  return parseInt(points);
};

/**
 * Gets all skills that are executed by this enemy when it is defeated.
 * @returns {JABS_SkillChance[]}
 */
Game_Enemy.prototype.onOwnDefeatSkillIds = function() {
  const structure = /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};

/**
 * Gets all skills that are executed by this enemy when it defeats its target.
 * @returns {JABS_SkillChance[]}
 */
Game_Enemy.prototype.onTargetDefeatSkillIds = function() {
  const structure = /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};



Game_Enemy.prototype.getEverythingWithNotes = function() {
  const objectsWithNotes = [];
  objectsWithNotes.push(this.enemy());
  objectsWithNotes.push(...this.skills());
  objectsWithNotes.push(...this.states());
  return objectsWithNotes;
};
//#endregion Game_Enemy

//#region Game_Event
/**
 * Detects whether or not the event code is one that matches the "comment" code.
 * @param {number} code The code to match.
 * @returns {boolean}
 */
Game_Event.prototype.matchesControlCode = function(code) {
  return (code === 108 || code === 408);
};
//#endregion Game_Event
//#endregion Game objects

//#region Sprite objects
//#region Sprite_Icon
/**
 * A sprite that displays a single icon.
 */
function Sprite_Icon() { this.initialize(...arguments); }
Sprite_Icon.prototype = Object.create(Sprite.prototype);
Sprite_Icon.prototype.constructor = Sprite_Icon;
Sprite_Icon.prototype.initialize = function(iconIndex) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(iconIndex);
  this.loadBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {Bitmap} iconIndex The index of the icon this sprite represents.
 */
Sprite_Icon.prototype.initMembers = function(iconIndex) {
  this._j = {
    _iconIndex: iconIndex,
  };
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Icon.prototype.loadBitmap = function() {
  this.bitmap = ImageManager.loadSystem("IconSet");
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (this._j._iconIndex % 16) * pw;
  const sy = Math.floor(this._j._iconIndex / 16) * ph;
  this.setFrame(sx, sy, pw, ph);
};
//#endregion Sprite_Icon

//#region Sprite_Face
/**
 * A sprite that displays a single face.
 */
function Sprite_Face() { this.initialize(...arguments); }
Sprite_Face.prototype = Object.create(Sprite.prototype);
Sprite_Face.prototype.constructor = Sprite_Face;
Sprite_Face.prototype.initialize = function(faceName, faceIndex) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(faceName, faceIndex);
  this.loadBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {string} faceName The name of the face file.
 * @param {number} faceIndex The index of the face.
 */
Sprite_Face.prototype.initMembers = function(faceName, faceIndex) {
  this._j = {
    _faceName: faceName,
    _faceIndex: faceIndex,
  };
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Face.prototype.loadBitmap = function() {
  this.bitmap = ImageManager.loadFace(this._j._faceName);
  const pw = ImageManager.faceWidth;
  const ph = ImageManager.faceHeight;
  const width = pw;
  const height = ph;
  const sw = Math.min(width, pw);
  const sh = Math.min(height, ph);
  const sx = Math.floor((this._j._faceIndex % 4) * pw + (pw - sw) / 2);
  const sy = Math.floor(Math.floor(this._j._faceIndex / 4) * ph + (ph - sh) / 2);
  this.setFrame(sx, sy, pw, ph);
};
//#endregion Sprice_Face

//#region Sprite_MapGauge
/**
 * The sprite for displaying an hp gauge over a character's sprite.
 */
function Sprite_MapGauge() { this.initialize(...arguments); }
Sprite_MapGauge.prototype = Object.create(Sprite_Gauge.prototype);
Sprite_MapGauge.prototype.constructor = Sprite_MapGauge;
Sprite_MapGauge.prototype.initialize = function(
  bitmapWidth = 96, bitmapHeight = 24, gaugeHeight = 6,
  label = "", value = null, iconIndex = -1) {
    this._duration = 0;
    this._gauge = {};
    this._gauge._bitmapWidth = bitmapWidth;
    this._gauge._bitmapHeight = bitmapHeight;
    this._gauge._gaugeHeight = gaugeHeight;
    this._gauge._label = label;
    this._gauge._value = value;
    this._gauge._iconIndex = iconIndex;

    Sprite_Gauge.prototype.initialize.call(this);
    this.initMembers();
    this.createBitmap();
};

/**
 * Hook into the superclass update to do more things.
 */
Sprite_MapGauge.prototype.update = function() {
  Sprite_Gauge.prototype.update.call(this);
  //this.manageGaugeVisibility();
};

/**
 * Handles the visibility of this hp bar based on interactivity.
 */
Sprite_MapGauge.prototype.manageGaugeVisibility = function() {
  if (this._duration > 0) {
    this._duration--;
  }

  if (this._duration <= 60) {
    this.opacity -= 4.25;
  }
};

/**
 * Enforces the bitmap's width to be this value.
 */
Sprite_MapGauge.prototype.bitmapWidth = function() {
  return this._gauge._bitmapWidth;
};

/**
 * Enforces the bitmap's height to be this value.
 */
Sprite_MapGauge.prototype.bitmapHeight = function() {
  return this._gauge._bitmapHeight;
};

/**
 * Enforces the map gauge's height to be this value.
 */
Sprite_MapGauge.prototype.gaugeHeight = function() {
  return this._gauge._gaugeHeight;
};

/**
 * Set this gauge's label.
 * @param {string} label The label to set this gauge to.
 */
Sprite_MapGauge.prototype.setLabel = function(label) {
  this._gauge._label = label;
  this.redraw();
};

/**
 * Gets this gauge's label.
 */
Sprite_MapGauge.prototype.drawLabel = function() {
  if (this._gauge._label) {
    const x = 32;
    const y = 0;
    this.bitmap.fontSize = 12;
    this.bitmap.drawText(this._gauge._label, x, y, this.bitmapWidth(), this.bitmapHeight(), "left");
  }
};

/**
 * Set this gauge's iconIndex.
 * @param {number} iconIndex The index/id of the icon to assign.
 */
Sprite_MapGauge.prototype.setIcon = function(iconIndex) {
  this._gauge._iconIndex = iconIndex;
  this.redraw();
};

/**
 * Draws the icon associated with this gauge.
 */
Sprite_MapGauge.prototype.drawIcon = function() {
  if (this._gauge._iconIndex > 0 && !this.children.length) {
    const sprite = this.createIconSprite();
    sprite.move(10, 20);
    this.addChild(sprite);
  }
};

Sprite_MapGauge.prototype.createIconSprite = function() {
  const sprite = new Sprite_Icon(this._gauge._iconIndex);
  sprite.scale.x = 0.5;
  sprite.scale.y = 0.5;
  return sprite;
};

/**
 * Don't draw values for gauges on the map.
 * TODO: consider implementing values only when the enemy has been defeated.
 */
Sprite_MapGauge.prototype.drawValue = function() {
  return this._gauge._value;
};

/**
 * OVERWRITE Rescopes `this` to point to the `Sprite_MapGauge` intead of the base
 * `Sprite_Gauge`. Otherwise, this is identical to the base `Sprite_Gauge.redraw()`.
 */
Sprite_MapGauge.prototype.redraw = function() {
  this.bitmap.clear();
  const currentValue = this.currentValue();
  if (!isNaN(currentValue)) {
    this.drawGauge();
    if (this._statusType !== "time") {
      this.drawLabel();
      this.drawIcon();
      if (this.isValid()) {
        this.drawValue();
      }
    }
  }
};

/**
 * OVERWRITE Adjusts the value for drawing the EXP gauge instead.
 * This is only used by the J-HUD plugin.
 * @returns {number}
 */
Sprite_MapGauge.prototype.currentValue = function() {
  if (this._battler) {
      switch (this._statusType) {
          case "hp":
              return this._battler.hp;
          case "mp":
              return this._battler.mp;
          case "tp":
              return this._battler.tp;
          case "time":
              return this._battler.currentExp() - this._battler.currentLevelExp();
      }
  }
  return NaN;
};

/**
 * OVERWRITE Adjusts the max value for drawing the EXP gauge instead.
 * This is only used by the J-HUD plugin.
 * @returns {number}
 */
Sprite_MapGauge.prototype.currentMaxValue = function() {
  if (this._battler) {
      switch (this._statusType) {
          case "hp":
              return this._battler.mhp;
          case "mp":
              return this._battler.mmp;
          case "tp":
              return this._battler.maxTp();
          case "time":
              return this._battler.nextLevelExp() - this._battler.currentLevelExp();
      }
  }
  return NaN;
};
//#endregion

//#region Sprite_Text
/**
 * A sprite that displays some static text.
 */
function Sprite_Text() { this.initialize(...arguments); }
Sprite_Text.prototype = Object.create(Sprite.prototype);
Sprite_Text.prototype.constructor = Sprite_Text;
Sprite_Text.prototype.initialize = function(
  text, color = null, fontSizeMod = 0, alignment = "center", widthMod = 0, heightMod = 0
) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(text, color, fontSizeMod, alignment, widthMod, heightMod);
  this.loadBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {string} text The static text to display for this sprite.
 * @param {any} color The color of the text.
 * @param {number} fontSizeMod The font size modifier for this instance of text.
 * @param {string} alignment The alignment of this sprite's text.
 * @param {number} widthMod The bitmap width modifier for this sprite.
 * @param {number} heightMod The bitmap height modifier for this sprite.
 */
Sprite_Text.prototype.initMembers = function(
  text, color, fontSizeMod, alignment, widthMod, heightMod
) {
  this._j = {
    _text: text,
    _color: color,
    _fontSizeMod: fontSizeMod,
    _alignment: alignment,
    _widthMod: widthMod,
    _heightMod: heightMod,
  };
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Text.prototype.loadBitmap = function() {
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
  this.bitmap.fontFace = this.fontFace();
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.textColor = this.textColor();
  this.bitmap.drawText(
    this._j._text, 
    0, 0, 
    this.bitmapWidth(), this.bitmapHeight(), 
    this.textAlignment());
};

/**
 * Hooks into the update to call the superclass update.
 */
Sprite_Text.prototype.update = function() {
  Sprite.prototype.update.call(this);
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_Text.prototype.bitmapWidth = function() {
  return 128 + this._j._widthMod;
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_Text.prototype.bitmapHeight = function() {
  return 24 + this._j._heightMod;
};

/**
 * Determines the font size for text in this sprite.
 */
Sprite_Text.prototype.fontSize = function() {
  return $gameSystem.mainFontSize() + this._j._fontSizeMod;
};

/**
 * Determines the font face for text in this sprite.
 */
Sprite_Text.prototype.fontFace = function() {
  return $gameSystem.mainFontFace();
};

/**
 * Determines the font color for text in this sprite.
 * If no color is designated, then the default (white) is used.
 * @returns {number}
 */
Sprite_Text.prototype.textColor = function() {
  return this._j._color
    ? ColorManager.textColor(this._j._color)
    : ColorManager.normalColor();
};

/**
 * Determines the alignment for text in this sprite.
 * @returns {string}
 */
Sprite_Text.prototype.textAlignment = function() {
  return this._j._alignment;
};
//#endregion
//#endregion Sprite objects

//#region Window objects
//#region Window_Command
/**
 * Draws the icon along with the item itself in the command window.
 */
J.BASE.Aliased.Window_Command.drawItem = Window_Command.prototype.drawItem;
Window_Command.prototype.drawItem = function(index) {
  J.BASE.Aliased.Window_Command.drawItem.call(this, index);
  const commandIcon = this.commandIcon(index);
  if (commandIcon) {
    const rect = this.itemLineRect(index);
    this.drawIcon(commandIcon, rect.x-32, rect.y+2)
  }
};

/**
 * Overwrites the `itemLineRect` (x starting coordinate for drawing) if there
 * is an icon to draw at the start of a command.
 * @returns {Rectangle}
 */
J.BASE.Aliased.Window_Command.itemLineRect = Window_Command.prototype.itemLineRect;
Window_Command.prototype.itemLineRect = function(index) {
  const commandIcon = this.commandIcon(index);
  if (commandIcon) {
    let baseRect = J.BASE.Aliased.Window_Command.itemLineRect.call(this, index);
    baseRect.x += 32;
    return baseRect;
  } else {
    return J.BASE.Aliased.Window_Command.itemLineRect.call(this, index);
  }
};

/**
 * Retrieves the icon for the given command in the window if it exists.
 * @param {number} index the index of the command.
 * @returns {number} The icon index for the command, or 0 if it doesn't exist.
 */
Window_Command.prototype.commandIcon = function(index) {
  return this._list[index].icon;
};

/**
 * An overload for the `addCommand()` function that allows adding an icon to a command.
 * @param {string} name The visible name of this command.
 * @param {string} symbol The symbol for this command.
 * @param {boolean} enabled Whether or not this command is enabled.
 * @param {object} ext The extra data for this command.
 * @param {number} icon The icon index for this command.
 */
Window_Command.prototype.addCommand = function(name, symbol, enabled = true, ext = null, icon = 0) {
  this._list.push({ name, symbol, enabled, ext, icon });
};
//#endregion Window_Command
//#endregion Window objects

//#region JABS classes
//#region JABS_SkillChance
/**
 * A class defining the structure of an on-death skill, either for ally or enemy.
 */
class JABS_SkillChance {
  constructor(skillId, chance, key) {
    this.skillId = skillId;
    this.chance = chance;
    this.key = key;
  }

  /**
   * Gets the underlying skill.
   * @returns {rm.types.Skill}
   */
  baseSkill() {
    return $dataSkills[this.skillId];
  };

  /**
   * Gets whether or not the skill this chance is associated with should cast from the
   * target instead of the user.
   * @returns {boolean}
   */
  appearOnTarget() {
    const skill = this.baseSkill();
    return !!skill.meta["onDefeatedTarget"];
  };

  /**
   * Rolls for whether or not this skill should proc.
   * @returns {boolean}
   */
  shouldTrigger() {
    const chance = Math.randomInt(100) + 1;
    return chance <= this.chance;
  };
}
//#endregion JABS_SkillChance

//#region JABS_SkillData
/**
 * A class that contains all custom data for JABS skills.
 * 
 * This class was created because skills do not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
class JABS_SkillData {
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta) {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
  };

  /**
   * Gets the duration of the delay for this action and whether or not it can be triggered
   * by colliding with it.
   * @returns {{duration: number, touchToTrigger: boolean}}
   */
  get delay() {
    let temp = [0, false];
    if (this._meta && this._meta[J.BASE.Notetags.Delay]) {
      temp = JSON.parse(this._meta[J.BASE.Notetags.Delay]);
    } else {
      const structure = /<delay:[ ]?(\[-?\d+,[ ]?(true|false))\]>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          temp = JSON.parse(RegExp.$1);
        }
      });
    }

    return { duration: parseInt(temp[0]) ?? 0, touchToTrigger: temp[1] };
  }

  /**
   * Gets the bonus aggro this skill generates.
   * @returns {number}
   */
  get bonusAggro() {
    let aggro = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Aggro]) {
      aggro = parseInt(this._meta[J.BASE.Notetags.Aggro]);
    } else {
      const structure = /<aggro:[ ]?(-?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aggro += parseInt(RegExp.$1);
        }
      })
    }

    return aggro;
  };

  /**
   * Gets the aggro multiplier that this skill performs.
   * Used for skills specifically that increase/decrease by a percent (or reset).
   * @returns {number}
   */
  get aggroMultiplier() {
    let multiplier = 1.0;
    if (this._meta && this._meta[J.BASE.Notetags.AggroMultiplier]) {
      multiplier = parseFloat(this._meta[J.BASE.Notetags.AggroMultiplier]);
    } else {
      const structure = /<aggroMultiply:[ ]?(\d+[.]?\d+)?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          multiplier += parseFloat(RegExp.$1);
        }
      });
    }

    return multiplier;
  };

  /**
   * Gets whether or not this skill is a direct-targeting skill.
   * @returns {boolean} True if it is a direct-targeting skill, false otherwise.
   */
  get direct() {
    let isDirect = false;
    if (this._meta && this._meta[J.BASE.Notetags.DirectSkill]) {
      isDirect = true;
    } else {
      const structure = /<direct>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          isDirect = true;
        }
      });
    }

    return isDirect;
  };

  /**
   * Gets the number of bonus hits this skill grants.
   * @returns {number} The number of bonus hits.
   */
  get bonusHits() {
    let bonusHits = 0;
    if (this._meta && this._meta[J.BASE.Notetags.BonusHits]) {
      bonusHits = parseInt(this._meta[J.BASE.Notetags.BonusHits]);
    } else {
      const structure = /<bonusHits:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          bonusHits = parseInt(RegExp.$1);
        }
      });
    }

    return bonusHits;
  };

  /**
   * Gets the amount of parry to ignore.
   * @type {number} The amount of parry to ignore; will be `-1` if should always ignores.
   */
  get ignoreParry() {
    let ignore = 0;
    if (this._meta && this._meta[J.BASE.Notetags.IgnoreParry]) {
      ignore = (typeof this._meta[J.BASE.Notetags.IgnoreParry] === "boolean")
        ? -1
        : parseInt(this._meta[J.BASE.Notetags.IgnoreParry]) || 0;
    } else {
      const structure = /<ignoreParry([:]?[ ]?((\d+)[%])?)?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          ignore = !RegExp.$1
            ? -1                    // if parameter left out, then always ignore parry.
            : parseInt(RegExp.$3);  // if parameter exists, use the number.
        }
      });
    }

    return ignore;
  }

  /**
   * Gets the amount of damage being reduced by guarding.
   * @returns {[number, boolean]} [damage reduction, true if reduction is %-based, false otherwise].
   */
  get guard() {
    let guard = [0, false];
    if (this._meta && this._meta[J.BASE.Notetags.Guard]) {
      guard = JSON.parse(this._meta[J.BASE.Notetags.Guard]);
    } else {
      const structure = /<guard:[ ]?(\[\d+,[ ]?\d+])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          guard = JSON.parse(RegExp.$1);
        }
      });
    }

    return guard;
  }

  /**
   * Gets the number of frames that a precise-guard is available for.
   * @returns {number} The number of frames for precise-guard.
   */
  get parry() {
    let parry = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Parry]) {
      parry = parseInt(this._meta[J.BASE.Notetags.Parry]);
    } else {
      const structure = /<parry:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          parry = parseInt(RegExp.$1);
        }
      });
    }

    return parry;
  }

  /**
   * Gets the id of the skill to retaliate with when executing a precise-parry.
   * @returns {number} The skill id.
   */
  get counterParry() {
    let id = 0;
    if (this._meta && this._meta[J.BASE.Notetags.CounterParry]) {
      id = parseInt(this._meta[J.BASE.Notetags.CounterParry]);
    } else {
      const structure = /<counterParry:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          id = parseInt(RegExp.$1);
        }
      });
    }

    return id;
  }

  /**
   * Gets the id of the skill to retaliate with when guarding.
   * @returns {number} The skill id.
   */
  get counterGuard() {
    let id = 0;
    if (this._meta && this._meta[J.BASE.Notetags.CounterGuard]) {
      id = parseInt(this._meta[J.BASE.Notetags.CounterGuard]);
    } else {
      const structure = /<counterGuard:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          id = parseInt(RegExp.$1);
        }
      });
    }

    return id;
  }

  /**
   * Gets the animation id to show when executing a skill.
   * @returns {number} The animation id for casting (default = 1)
   */
  get casterAnimation() {
    let animationId = 0;
    if (this._meta && this._meta[J.BASE.Notetags.CastAnimation]) {
      animationId = parseInt(this._meta[J.BASE.Notetags.CastAnimation]);
    } else {
      const structure = /<castAnimation:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          animationId = parseInt(RegExp.$1);
        }
      });
    }

    return animationId;
  }

  /**
   * Gets the cast time for this skill.
   * @returns {number} The cast time in frames (default = 0).
   */
  get castTime() {
    let castTime = 1;
    if (this._meta && this._meta[J.BASE.Notetags.CastTime]) {
      castTime = parseInt(this._meta[J.BASE.Notetags.CastTime]) || 1;
    } else {
      const structure = /<castTime:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          castTime = parseInt(RegExp.$1);
        }
      });
    }

    return castTime;
  }

  /**
   * Gets the cooldown for this skill.
   * @returns {number} The cooldown in frames (default = 0).
   */
  get cooldown() {
    let cooldown = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Cooldown]) {
      cooldown = parseInt(this._meta[J.BASE.Notetags.Cooldown]) || 0;
    } else {
      const structure = /<cooldown:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          cooldown = parseInt(RegExp.$1);
        }
      });
    }

    return cooldown;
  }

  /**
   * Gets the cooldown for this skill when performed by AI.
   * If this is also an actor using the skill, the base cooldown will
   * still be applied to the cooldown slot.
   * @returns {number} The cooldown in frames (default = 0).
   */
  get aiCooldown() {
    let aiCooldown = -1;
    if (this._meta && this._meta[J.BASE.Notetags.AiCooldown]) {
      aiCooldown = parseInt(this._meta[J.BASE.Notetags.AiCooldown]);
    } else {
      const structure = /<aiCooldown:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aiCooldown = parseInt(RegExp.$1);
        }
      });
    }

    return aiCooldown;
  }

  /**
   * Gets the range for this skill.
   * @returns {number} The range in tiles/spaces/squares (default = 0).
   */
  get range() {
    let range = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Range]) {
      range = parseInt(this._meta[J.BASE.Notetags.Range]) || 0;
    } else {
      const structure = /<range:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          range = parseInt(RegExp.$1);
        }
      });
    }

    return range;
  }

  /**
   * Gets the action id for this skill.
   * @returns {number} The action id (default = 1).
   */
  get actionId() {
    let actionId = 1;
    if (this._meta && this._meta[J.BASE.Notetags.ActionId]) {
      actionId = parseInt(this._meta[J.BASE.Notetags.ActionId]) || 1;
    } else {
      const structure = /<actionId:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          actionId = parseInt(RegExp.$1);
        }
      });
    }

    return actionId;
  }

  /**
   * Gets the duration this skill persists on the map.
   * @returns {number} The duration in frames (default = 60).
   */
  get duration() {
    let duration = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Duration]) {
      duration = parseInt(this._meta[J.BASE.Notetags.Duration]) || duration;
    } else {
      const structure = /<duration:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          duration = parseInt(RegExp.$1);
        }
      });
    }

    return duration;
  }

  /**
   * Gets the hitbox shape for this skill.
   * @returns {string} The hitbox shape (default = rhombus).
   */
  get shape() {
    let shape = 'rhombus';
    const possibleShapes = ['rhombus', 'square', 'frontsquare', 'line', 'arc', 'wall', 'cross'];
    if (this._meta && this._meta[J.BASE.Notetags.Shape]) {
      if (possibleShapes.includes(this._meta[J.BASE.Notetags.Shape].toLowerCase())) {
        shape = this._meta[J.BASE.Notetags.Shape].toLowerCase();
      } else {
        console.warn('invalid shape provided- defaulted to "rhombus".');
      }
    } else {
      const structure = /<shape:[ ]?(rhombus|square|frontsquare|line|arc|wall|cross)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          shape = RegExp.$1.toLowerCase();
        }
      });
    }

    return shape;
  }

  /**
   * Gets the number of projectiles for this skill.
   * @returns {string} The hitbox shape (default = rhombus).
   */
  get projectile() {
    let projectile = 1;
    const possible = [1, 2, 3, 4, 8];
    if (this._meta && this._meta[J.BASE.Notetags.Projectile]) {
      if (possible.includes(parseInt(this._meta[J.BASE.Notetags.Projectile]))) {
        projectile = parseInt(this._meta[J.BASE.Notetags.Projectile]);
      } else {
        console.warn('invalid projectile provided- defaulted to "1".');
      }
    } else {
      const structure = /<projectile:[ ]?([12348])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          projectile = parseInt(RegExp.$1);
        }
      });
    }

    return projectile;
  }

  /**
   * Gets the piercing data for this skill.
   * @returns {[number, number]} The piercing data (default = [1, 0]).
   */
  get piercing() {
    let piercing = [1, 0];
    if (this._meta && this._meta[J.BASE.Notetags.Piercing]) {
      piercing = JSON.parse(this._meta[J.BASE.Notetags.Piercing]);
    } else {
      const structure = /<pierce:[ ]?(\[\d+,[ ]?\d+\])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          piercing = JSON.parse(RegExp.$1);
        }
      });
    }

    return piercing;
  }

  /**
   * Gets the combo data for this skill.
   * @returns {[number, number]} The combo data (default = null).
   */
  get combo() {
    let combo = null;
    if (this._meta && this._meta[J.BASE.Notetags.Combo]) {
      combo = JSON.parse(this._meta[J.BASE.Notetags.Combo]);
    } else {
      const structure = /<combo:[ ]?(\[\d+,[ ]?\d+])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          combo = JSON.parse(RegExp.$1);
        }
      });
    }

    return combo;
  }

  /**
   * Gets the free combo boolean for this skill. "Free Combo" skills do not
   * require the hit to land to continue combo-ing.
   * @returns {boolean} True if free combo, false otherwise.
   */
  get freeCombo() {
    let freeCombo = false;
    if (this._meta && this._meta[J.BASE.Notetags.FreeCombo]) {
      freeCombo = true;
    } else {
      const structure = /<freeCombo>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          freeCombo = true;
        }
      });
    }

    return freeCombo;
  }

  /**
   * Gets the proximity required for this skill.
   * @returns {number} The proximity (default = 1).
   */
  get proximity() {
    let proximity = 1;
    if (this._meta && this._meta[J.BASE.Notetags.Proximity]) {
      proximity = parseInt(this._meta[J.BASE.Notetags.Proximity]);
    } else {
      const structure = /<proximity:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          proximity = parseInt(RegExp.$1);
        }
      });
    }

    return proximity;
  }

  /**
   * Gets the knockback for this skill. Unlike many other numeric parameters,
   * if there is no knockback, the default is `null` instead of `0` because `0`
   * knockback will still knock up the battler.
   * @returns {number} The knockback (default = null).
   */
  get knockback() {
    let knockback = null;
    if (this._meta && this._meta[J.BASE.Notetags.Knockback]) {
      knockback = parseInt(this._meta[J.BASE.Notetags.Knockback]);
    } else {
      const structure = /<knockback:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          knockback = parseInt(RegExp.$1);
        }
      });
    }

    return knockback;
  }

  /**
   * Gets the animation id to show when executing a skill.
   * @returns {number} The animation id for casting.
   */
  get invincible() {
    let invincible = false;
    if (this._meta && this._meta[J.BASE.Notetags.Invincible]) {
      invincible = true;
    } else {
      const structure = /<invincible>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          invincible = true;
        }
      });
    }

    return invincible;
  }

  /**
   * Gets the unique cooldown boolean. Unique cooldown means that the skill
   * can be assigned to multiple slots and cooldowns are impacted independently
   * of one another.
   * @returns {boolean} True if this skill is unique, false otherwise.
   */
  get uniqueCooldown() {
    let uniqueCooldown = false;
    if (this._meta && this._meta[J.BASE.Notetags.UniqueCooldown]) {
      uniqueCooldown = true;
    } else {
      const structure = /<unique>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          uniqueCooldown = true;
        }
      });
    }

    return uniqueCooldown;
  }

  /**
   * Gets the animation id to show when executing a skill.
   * @returns {number} The animation id for casting.
   */
  get moveType() {
    let moveType = "forward";
    if (this._meta && this._meta[J.BASE.Notetags.MoveType]) {
      moveType = this._meta[J.BASE.Notetags.MoveType];
    } else {
      const structure = /<moveType:[ ]?(forward|backward|directional)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          moveType = RegExp.$1;
        }
      });
    }

    return moveType;
  }

  /**
   * Gets the action pose data for this skill.
   * @returns {[string, number, number]} The action pose data (default = null).
   */
  get poseSuffix() {
    let actionPoseData = null;
    if (this._meta && this._meta[J.BASE.Notetags.PoseSuffix]) {
      actionPoseData = JSON.parse(this._meta[J.BASE.Notetags.PoseSuffix]);
    } else {
      const structure = /<poseSuffix:[ ]?(\["[-_]?\w+",[ ]?\d+,[ ]?\d+])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          actionPoseData = JSON.parse(RegExp.$1);
        }
      });
    }

    return actionPoseData;
  }
}
//#endregion JABS_SkillData

//#region JABS_EquipmentData
/**
 * A class that contains all custom data for JABS equipment.
 * 
 * This class was created because equipment does not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
class JABS_EquipmentData {
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta) {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
    this.skillId = this.skillId();
    this.speedBoost = this.speedBoost();
    this.bonusHits = this.bonusHits();
  }

  /**
   * Gets the skill id associated with this piece of equipment.
   * @returns {number} The skill id.
   */
  skillId() {
    let skillId = 0;
    if (this._meta && this._meta[J.BASE.Notetags.SkillId]) {
      skillId = parseInt(this._meta[J.BASE.Notetags.SkillId]) || 0;
    } else {
      const structure = /<skillId:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          skillId = parseInt(RegExp.$1);
        }
      });
    }

    return skillId;
  };

  /**
   * Gets the speed boost value associated with this piece of equipment.
   * @returns {number} The speed boost value.
   */
  speedBoost() {
    let speedBoost = 0;
    if (this._meta && this._meta[J.BASE.Notetags.SpeedBoost]) {
      speedBoost = parseInt(this._meta[J.BASE.Notetags.SpeedBoost]) || 0;
    } else {
      const structure = /<speedBoost:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          speedBoost = parseInt(RegExp.$1);
        }
      });
    }

    return speedBoost;
  };

  /**
   * Gets the number of bonus hits this skill grants.
   * @returns {number} The number of bonus hits.
   */
  bonusHits() {
    let bonusHits = 0;
    if (this._meta && this._meta[J.BASE.Notetags.BonusHits]) {
      bonusHits = parseInt(this._meta[J.BASE.Notetags.BonusHits]);
    } else {
      const structure = /<bonusHits:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          bonusHits = parseInt(RegExp.$1);
        }
      });
    }

    return bonusHits;
  };
}
//#endregion JABS_EquipmentData

//#region JABS_ItemData
/**
 * A class that contains all custom data for JABS items.
 * 
 * This class was created because items do not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
class JABS_ItemData {
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta) {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
  };

  /**
   * Gets the skill id associated with this item/tool.
   * @returns {number} The skill id, or `0` if none is present.
   */
  get skillId() {
    let skillId = 0;
    if (this._meta && this._meta[J.BASE.Notetags.SkillId]) {
      skillId = parseInt(this._meta[J.BASE.Notetags.SkillId]) || 0;
    } else {
      const structure = /<skillId:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          skillId = parseInt(RegExp.$1);
        }
      })
    }

    return skillId;
  };

  /**
   * Gets the cooldown for this item.
   * @returns {number} The cooldown in frames (default = 0).
   */
  get cooldown() {
    let cooldown = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Cooldown]) {
      cooldown = parseInt(this._meta[J.BASE.Notetags.Cooldown]);
    } else {
      const structure = /<cooldown:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          cooldown = parseInt(RegExp.$1);
        }
      });
    }

    return cooldown;
  };

  /**
   * Gets whether or not this item will be used instantly on-pickup.
   * @returns {boolean} True if this is an instant-use item, false otherwise.
   */
  get useOnPickup() {
    let useOnPickup = false;
    if (this._meta && this._meta[J.BASE.Notetags.UseOnPickup]) {
      useOnPickup = true;
    } else {
      const structure = /<useOnPickup>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          useOnPickup = true;
        }
      });
    }

    return useOnPickup;
  };

  /**
   * Gets the duration in frames of how long this loot will persist on the map.
   * If none is specified, the default will be used.
   * @returns {number}
   */
  get expires() {
    let expires = 0;
    if (this._meta && this._meta[J.BASE.Notetags.LootExpiration]) {
      expires = parseInt(this._meta[J.BASE.Notetags.LootExpiration]);
    } else {
      const structure = /<expires:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          expires = parseInt(RegExp.$1);
        }
      });
    }

    return expires;
  };
}
//#endregion JABS_ItemData

//#region JABS_StateData
/**
* A class that contains all custom data for JABS states.
* 
* This class was created because states do not inherently have a class to hook into
* for extensions, like `Game_Actor` or `Game_Map`.
*/
class JABS_StateData {
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta) {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
  };

  /**
   * Gets whether or not this state is identified as a "negative" state.
   * @returns {boolean}
   */
  get negative() {
    let negative = false;
    if (this._meta && this._meta[J.BASE.Notetags.NegativeState]) {
      negative = true;
    } else {
      const structure = /<negative>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          negative = true;
        }
      })
    }

    return negative;
  };

  /**
   * Gets whether or not this state locks aggro modification.
   * @returns {boolean}
   */
  get aggroLock() {
    let aggroLocked = false;
    if (this._meta && this._meta[J.BASE.Notetags.AggroLock]) {
      aggroLocked = true;
    } else {
      const structure = /<aggroLock>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aggroLocked = true;
        }
      })
    }

    return aggroLocked;
  };

  /**
   * Gets the aggro dealt amp multiplier bonus for this state.
   * @returns {number}
   */
  get aggroOutAmp() {
    let aggroOutAmp = 1.0;
    if (this._meta && this._meta[J.BASE.Notetags.AggroOutAmp]) {
      aggroOutAmp = parseFloat(this._meta[J.BASE.Notetags.AggroOutAmp]);
    } else {
      const structure = /<aggroOutAmp:[ ]?[+]?([-]?\d+[.]?\d+)?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aggroOutAmp = parseFloat(RegExp.$1);
        }
      })
    }

    return aggroOutAmp;
  };

  /**
   * Gets the aggro received amp multiplier bonus for this state.
   * @returns {number}
   */
  get aggroInAmp() {
    let aggroInAmp = 1.0;
    if (this._meta && this._meta[J.BASE.Notetags.AggroInAmp]) {
      aggroInAmp = parseFloat(this._meta[J.BASE.Notetags.AggroInAmp]);
    } else {
      const structure = /<aggroInAmp:[ ]?[+]?([-]?\d+[.]?\d+)?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aggroInAmp = parseFloat(RegExp.$1);
        }
      })
    }

    return aggroInAmp;
  };

  /**
   * Gets whether or not this state inflicts JABS paralysis.
   * @returns {boolean} True if it inflicts JABS paralysis, false otherwise.
   */
  get paralyzed() {
    let paralyzed = false;
    if (this._meta && this._meta[J.BASE.Notetags.Paralyzed]) {
      paralyzed = true;
    } else {
      const structure = /<paralyzed>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          paralyzed = true;
        }
      })
    }

    return paralyzed;
  };

  /**
   * Gets whether or not this state inflicts JABS root.
   * @returns {boolean} True if it inflicts JABS root, false otherwise.
   */
  get rooted() {
    let rooted = false;
    if (this._meta && this._meta[J.BASE.Notetags.Rooted]) {
      rooted = true;
    } else {
      const structure = /<rooted>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          rooted = true;
        }
      })
    }

    return rooted;
  };

  /**
   * Gets whether or not this state inflicts JABS mute.
   * @returns {boolean} True if it inflicts JABS mute, false otherwise.
   */
  get muted() {
    let muted = false;
    if (this._meta && this._meta[J.BASE.Notetags.Muted]) {
      muted = true;
    } else {
      const structure = /<muted>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          muted = true;
        }
      })
    }

    return muted;
  };

  /**
   * Gets whether or not this state inflicts JABS disable.
   * @returns {boolean} True if it inflicts JABS disable, false otherwise.
   */
  get disabled() {
    let disabled = false;
    if (this._meta && this._meta[J.BASE.Notetags.Disabled]) {
      disabled = true;
    } else {
      const structure = /<disabled>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          disabled = true;
        }
      })
    }

    return disabled;
  };

  /**
   * Gets the flat hp5 for this state.
   * @returns {number} The flat hp5.
   */
  get slipHpFlat() {
    let hpFlat = 0;
    if (this._meta && this._meta[J.BASE.Notetags.HpFlat]) {
      hpFlat = parseInt(this._meta[J.BASE.Notetags.HpFlat]);
    } else {
      const structure = /<hpFlat:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          hpFlat = parseInt(RegExp.$1);
        }
      });
    }

    return hpFlat;
  };

  /**
   * Gets the percentage hp5 for this state.
   * @returns {number} The percentage hp5.
   */
  get slipHpPerc() {
    let hpPerc = 0;
    if (this._meta && this._meta[J.BASE.Notetags.HpPerc]) {
      hpPerc = parseFloat(this._meta[J.BASE.Notetags.HpPerc]);
    } else {
      const structure = /<hpPerc:[ ]?([-]?\d+)[%]?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          hpPerc = parseFloat(RegExp.$1);
        }
      });
    }

    return hpPerc;
  };

  /**
   * Gets the flat mp5 for this state.
   * @returns {number} The flat mp5.
   */
  get slipMpFlat() {
    let mpFlat = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MpFlat]) {
      mpFlat = parseInt(this._meta[J.BASE.Notetags.MpFlat]);
    } else {
      const structure = /<mpFlat:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          mpFlat = parseInt(RegExp.$1);
        }
      });
    }

    return mpFlat;
  };

  /**
   * Gets the percentage mp5 for this state.
   * @returns {number} The percentage mp5.
   */
  get slipMpPerc() {
    let mpPerc = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MpPerc]) {
      mpPerc = parseFloat(this._meta[J.BASE.Notetags.MpPerc]);
    } else {
      const structure = /<mpPerc:[ ]?([-]?\d+)[%]?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          mpPerc = parseFloat(RegExp.$1);
        }
      });
    }

    return mpPerc;
  };

  /**
   * Gets the flat tp5 for this state.
   * @returns {number} The flat tp5.
   */
  get slipTpFlat() {
    let tpFlat = 0;
    if (this._meta && this._meta[J.BASE.Notetags.TpFlat]) {
      tpFlat = parseInt(this._meta[J.BASE.Notetags.TpFlat]);
    } else {
      const structure = /<tpFlat:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          tpFlat = parseInt(RegExp.$1);
        }
      });
    }

    return tpFlat;
  };

  /**
   * Gets the percentage tp5 for this state.
   * @returns {number} The percentage tp5.
   */
  get slipTpPerc() {
    let tpPerc = 0;
    if (this._meta && this._meta[J.BASE.Notetags.TpPerc]) {
      tpPerc = parseFloat(this._meta[J.BASE.Notetags.TpPerc]);
    } else {
      const structure = /<tpPerc:[ ]?([-]?\d+)[%]?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          tpPerc = parseFloat(RegExp.$1);
        }
      });
    }

    return tpPerc;
  };
}
//#endregion JABS_StateData
//#endregion JABS Classes

//#region OTIB classes

//#region OneTimeItemBoost
/**
 * A class representing the permanent data of a one time boost from a single item.
 */
function OneTimeItemBoost() { this.initialize(...arguments); }
OneTimeItemBoost.prototype = {};
OneTimeItemBoost.prototype.constructor = OneTimeItemBoost;
OneTimeItemBoost.prototype.initialize = function(itemId, parameterData) {
  /**
   * The item id this one time item boost represents.
   * @type {number}
   */
  this.itemId = itemId;

  /**
   * The parameter data this boost will grant permanently upon consumption.
   * @type {OneTimeItemBoostParam[]}
   */
  this.parameterData = parameterData;
  this.initMembers();
};

/**
 * Initializes the rest of the members of this class with default parameters.
 */
OneTimeItemBoost.prototype.initMembers = function() {
  /**
   * Whether or not this boost has been unlocked.
   * @type {boolean}
   */
  this.unlocked = false;
};

/**
 * Gets whether or not this boost is unlocked.
 * @returns {boolean}
 */
OneTimeItemBoost.prototype.isUnlocked = function() {
  return this.unlocked;
};

/**
 * Unlocks this boost.
 */
OneTimeItemBoost.prototype.unlock = function() {
  this.unlocked = true;
};

/**
 * Locks this boost.
 */
OneTimeItemBoost.prototype.lock = function() {
  this.unlocked = false;
};

/**
 * A class representing the permanent data of a one time boost from a single item.
 */
function OneTimeItemBoostParam() { this.initialize(...arguments); }
OneTimeItemBoostParam.prototype = {};
OneTimeItemBoostParam.prototype.constructor = OneTimeItemBoostParam;
OneTimeItemBoostParam.prototype.initialize = function(paramId, boost, isPercent) {
  /**
   * The parameter id this parameter boost represents.
   * @type {number}
   */
  this.paramId = paramId;

  /**
   * The value of the parameter boost.
   * @type {number}
   */
  this.boost = boost;

  /**
   * Whether or not this boost is a multiplicative parameter boost or not.
   * @type {boolean}
   */
  this.isPercent = isPercent;
};
//#endregion OneTimeItemBoost

//#endregion OTIB classes

//#region JAFTING classes
//#region JAFTING_Component
/**
 * A single instance of a particular crafting component, such as an ingredient/tool/output,
 * for use in JAFTING.
 */
function JAFTING_Component() { this.initialize(...arguments); }
JAFTING_Component.prototype = {};
JAFTING_Component.prototype.constructor = JAFTING_Component;
JAFTING_Component.prototype.initialize = function(id, type, count, isTool) {
  /**
   * The id of the underlying component.
   * @type {number}
   */
  this.id = id;

  /**
   * The type of component this is, such as `i`/`w`/`a`.
   * @type {string}
   */
  this.type = type;

  /**
   * How many of this component is required.
   * @type {number}
   */
  this.count = count;

  /**
   * Whether or not this component is a non-consumable tool that is required
   * to perform crafting for particular recipes.
   * @type {boolean}
   */
  this.isTool = isTool;
};

/**
 * Gets the underlying RPG:Item that this component represents.
 */
JAFTING_Component.prototype.getItem = function() {
  switch (this.type) {
    case `i`:
      return $dataItems[this.id];
    case `w`:
      return $dataWeapons[this.id];
    case `a`:
      return $dataArmors[this.id];
    default:
      console.error("attempted to craft an invalid item.");
      console.log(this);
      throw new Error("The output's type of a recipe was invalid. Check your recipes' output types again.");
  }
};

/**
 * Crafts this particular component based on it's type.
 */
JAFTING_Component.prototype.craft = function() {
  $gameParty.gainItem(this.getItem(), this.count);
};

/**
 * Consumes this particular component based on it's type.
 */
JAFTING_Component.prototype.consume = function() {
  $gameParty.loseItem(this.getItem(), this.count);
};
//#endregion JAFTING_Component

//#region JAFTING_Recipe
/**
* The data that makes up what defines a crafting recipe for use with JAFTING.
*/
function JAFTING_Recipe() { this.initialize(...arguments); }
JAFTING_Recipe.prototype = {};
JAFTING_Recipe.prototype.constructor = JAFTING_Recipe;
JAFTING_Recipe.prototype.initialize = function(
  name, key, description, categories, iconIndex, tools, ingredients, output, masked) {
    /**
    * The name of this crafting recipe.
    * @type {string}
    */
    this.name = name;

    /**
     * The unique key associated with this crafting recipe.
     * @type {string}
     */
    this.key = key;

    /**
    * The description of this crafting recipe.
    * @type {string}
    */
    this.description = description;

    /**
    * The category keys that this crafting recipe belongs to.
    * @type {string[]}
    */
    this.categories = categories;

    /**
    * The icon that will display in the type selection window next to this category.
    * @type {number}
    */
    this.iconIndex = iconIndex;

    /**
    * The list of required tools not consumed but required to execute the recipe.
    * @type {JAFTING_Component[]}
    */
    this.tools = tools;

    /**
    * The list of ingredients that make up this recipe that will be consumed.
    * @type {JAFTING_Component[]}
    */
    this.ingredients = ingredients;

    /**
    * The list of `JAFTING_Component`s that would be generated when this recipe is successfully crafted.
    * @type {JAFTING_Component[]}
    */
    this.output = output;

    /**
     * Whether or not this recipe is masked by default until crafted the first time.
     * Masked recipes show up as all question marks in place of their name.
     * @type {boolean}
     */
    this.maskedUntilCrafted = masked;
    this.initMembers();
};

/**
 * Initializes all members that do not require parameters for this class.
 */
JAFTING_Recipe.prototype.initMembers = function() {
  /**
   * Whether or not this recipe has been unlocked for JAFTING.
   * @type {boolean}
   */
  this.unlocked = false;

  /**
   * Whether or not this recipe has been JAFTED before.
   * @type {boolean}
   */
  this.crafted = false;
};

/**
 * Gets whether or not this JAFTING recipe has been unlocked or not.
 * @returns {boolean}
 */
JAFTING_Recipe.prototype.isUnlocked = function() {
  return this.unlocked;
};

/**
 * Locks this JAFTING recipe.
 */
JAFTING_Recipe.prototype.lock = function() {
  this.unlocked = false;
};

/**
 * Unlocks this JAFTING recipe. Does not unlock the category this recipe belongs to.
 */
JAFTING_Recipe.prototype.unlock = function() {
  this.unlocked = true;
};

/**
 * Creates all output of this JAFTING recipe and marks the recipe as "crafted".
 */
JAFTING_Recipe.prototype.craft = function() {
  this.output.forEach(component => component.craft());
  this.ingredients.forEach(component => component.consume());
  this.setCrafted();
};

/**
 * Gets whether or not this recipe is craftable based on the ingredients and tools on-hand.
 * @returns {boolean}
 */
JAFTING_Recipe.prototype.canCraft = function() {
  let hasIngredients = true;
  let hasTools = true;

  // check over all ingredients to see if we have enough to JAFT this recipe.
  this.ingredients.forEach(component => {
    const count = $gameParty.numItems(component.getItem());
    if (component.count > count) {
      hasIngredients = false;
    }
  });

  // check over all tools to see if we have them on-hand to JAFT this recipe.
  this.tools.forEach(component => {
    const count = $gameParty.numItems(component.getItem());
    if (component.count > count) {
      hasTools = false;
    }
  });

  return hasIngredients && hasTools;
};

/**
 * Gets whether or not this recipe has been crafted before.
 * @returns {boolean}
 */
JAFTING_Recipe.prototype.hasBeenCrafted = function() {
  return this.crafted;
};

/**
 * Sets this recipe to a "crafted" state.
 * @param {boolean} crafted Whether or not this item has been crafted.
 */
JAFTING_Recipe.prototype.setCrafted = function(crafted = true) {
  this.crafted = crafted;
};

/**
 * Gets the primary output of this recipe.
 * Primary output is defined as the first item in the list of all output
 * that this recipe creates.
 * @returns {any}
 */
JAFTING_Recipe.prototype.getPrimaryOutput = function() {
  return this.output[0].getItem();
};

/**
 * Gets the name of this recipe.
 * If none was specified, then the primary output's name will be used.
 * @returns {string}
 */
JAFTING_Recipe.prototype.getRecipeName = function() {
  let name = "";
  if (!this.name.length) {
    const primaryOutput = this.getPrimaryOutput();
    name = primaryOutput.name;
  } else {
    name = this.name;
  }

  if (this.maskedUntilCrafted && !this.crafted) {
    name = name.replace(/[A-Za-z\-!?',.]/ig, "?");
  }

  return name;
};

/**
 * Gets the icon index of this recipe.
 * If none was specified, then the primary output's icon index will be used.
 * @returns {number}
 */
JAFTING_Recipe.prototype.getRecipeIconIndex = function() {
  if (this.iconIndex === -1) {
    const primaryOutput = this.getPrimaryOutput();
    return primaryOutput.iconIndex;
  } else {
    return this.iconIndex;
  }
};

/**
 * Gets the description of this recipe.
 * If none was specified, then the primary output's description will be used.
 * @returns {string}
 */
JAFTING_Recipe.prototype.getRecipeDescription = function() {
  let description = "";
  if (!this.description.length) {
    const primaryOutput = this.getPrimaryOutput();
    description = primaryOutput.description;
  } else {
    description = this.description;
  }

  if (this.maskedUntilCrafted && !this.crafted) {
    description = description.replace(/[A-Za-z\-!?',.]/ig, "?");
  }

  return description;
};
//#endregion JAFTING_Recipe

//#region JAFTING_Category
/**
 * Represents the category details for this recipe.
 * A single recipe can live in multiple categories.
 */
function JAFTING_Category() { this.initialize(...arguments); }
JAFTING_Category.prototype = {};
JAFTING_Category.prototype.constructor = JAFTING_Category;
JAFTING_Category.prototype.initialize = function(name, key, iconIndex, description) {
  /**
   * The name of this crafting category.
   * @type {string}
   */
  this.name = name;

  /**
   * The unique key of this crafting category.
   * @type {string}
   */
  this.key = key;

  /**
   * The icon that will display in the type selection window next to this category.
   * @type {number}
   */
  this.iconIndex = iconIndex;

  /**
   * The description that shows up in the help window.
   * @type {string}
   */
  this.description = description;
  this.initMembers();
};

/**
 * Initializes all members in this class with defaults.
 */
JAFTING_Category.prototype.initMembers = function() {
  /**
   * Whether or not this category is unlocked.
   * @type {boolean}
   */
  this.unlocked = false;
};

/**
 * Gets whether or not this JAFTING category is unlocked.
 * @returns {boolean}
 */
JAFTING_Category.prototype.isUnlocked = function() {
  return this.unlocked;
};

/**
 * Locks this JAFTING category.
 */
JAFTING_Category.prototype.lock = function() {
  this.unlocked = false;
};

/**
 * Unlocks this JAFTING category.
 */
JAFTING_Category.prototype.unlock = function() {
  this.unlocked = true;
};
//#endregion JAFTING_Category

//#region JAFTING_RefinementData
/**
 * A class containing all the various data points extracted from notes.
 */
class JAFTING_RefinementData {
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta) {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
    this.refinedCount = 0;
    this.maxRefineCount = this.getMaxRefineCount();
    this.maxTraitCount = this.getMaxTraitCount();
    this.notRefinementMaterial = this.isNotMaterial();
    this.notRefinementBase = this.isNotBase();
    this.unrefinable = this.isNotRefinable();
  };

  /**
   * The number of times this piece of equipment can be refined.
   * @returns {number}
   */
  getMaxRefineCount() {
    let count = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MaxRefineCount]) {
      count = parseInt(this._meta[J.BASE.Notetags.MaxRefineCount]) || count;
    } else {
      const structure = /<maxRefine:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          count = parseInt(RegExp.$1);
        }
      })
    }

    return count;
  };

  /**
   * The number of transferable traits that this piece of equipment can have at any one time.
   * @returns {number}
   */
   getMaxTraitCount() {
    let count = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MaxRefineTraits]) {
      count = parseInt(this._meta[J.BASE.Notetags.MaxRefineTraits]) || count;
    } else {
      const structure = /<maxRefinedTraits:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          count = parseInt(RegExp.$1);
        }
      })
    }

    return count;
  };

  /**
   * Gets whether or not this piece of equipment can be used in refinement as a material.
   * @returns {boolean}
   */
  isNotMaterial() {
    let notMaterial = false;
    if (this._meta && this._meta[J.BASE.Notetags.NotRefinementMaterial]) {
      notMaterial = true;
    } else {
      const structure = /<notRefinementMaterial>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          notMaterial = true;
        }
      })
    }

    return notMaterial;
  };

  /**
   * Gets whether or not this piece of equipment can be used in refinement as a base.
   * @returns {boolean}
   */
  isNotBase() {
    let notBase = false;
    if (this._meta && this._meta[J.BASE.Notetags.NotRefinementBase]) {
      notBase = true;
    } else {
      const structure = /<notRefinementBase>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          notBase = true;
        }
      })
    }

    return notBase;
  };

  /**
   * Gets whether or not this piece of equipment can be used in refinement.
   * If this is true, this will mean this cannot be used in refinement as base or material.
   * @returns 
   */
  isNotRefinable() {
    let noRefine = false;
    if (this._meta && this._meta[J.BASE.Notetags.NoRefinement]) {
      noRefine = true;
    } else {
      const structure = /<noRefine>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          noRefine = true;
        }
      })
    }

    return noRefine;
  };
};
//#endregion JAFTING_RefinementData
//#endregion JAFTING classes

//#region SDP classes
//#region StatDistributionPanel
/**
 * The class that governs the details of a single SDP.
 */
function StatDistributionPanel() { this.initialize(...arguments); }
StatDistributionPanel.prototype = {};
StatDistributionPanel.prototype.constructor = StatDistributionPanel;

/**
 * Initializes a single stat distribution panel.
 * @param {string} name The name that displays in the menu for this panel.
 * @param {string} key The unique identifier for this panel.
 * @param {number} iconIndex The icon index that represents this panel.
 * @param {boolean} unlocked Whether or not this panel is unlocked.
 * @param {string} description The description for this panel.
 * @param {number} maxRank The maximum rank this panel can reach.
 * @param {number} baseCost The base component of the cost formula.
 * @param {number} flatGrowthCost The flat component of the cost formula.
 * @param {number} multGrowthCost The multiplier component of the cost formula.
 * @param {string} topFlavorText The flavor text for this panel, if any.
 * @param {PanelRankupReward[]} panelRewards All rewards associated with this panel.
 * @param {PanelParameter[]} panelParameters All parameters this panel affects.
 */
StatDistributionPanel.prototype.initialize = function(
  name,
  key, 
  iconIndex,
  unlocked,
  description,
  maxRank,
  baseCost,
  flatGrowthCost,
  multGrowthCost,
  topFlavorText,
  panelRewards,
  panelParameters) {
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
   * Gets whether or not this SDP is unlocked.
   * @type {boolean}
   */
  this.unlocked = unlocked;

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
   * The description that shows up underneath the name in the details window.
   * @type {string}
   */
  this.topFlavorText = topFlavorText;

  /**
   * The collection of all rewards this panel can grant by ranking it up.
   * @type {PanelRankupReward[]}
   */
  this.panelRewards = panelRewards;

  /**
   * The collection of all parameters that this panel affects when ranking it up.
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
    return this.baseCost + growth;
  }
};

/**
 * Retrieves all panel parameters associated with a provided `paramId`.
 * @param {number} paramId The `paramId` to find parameters for.
 * @returns {PanelParameter[]}
 */
StatDistributionPanel.prototype.getPanelParameterById = function(paramId) {
  const panelParameters = this.panelParameters;
  return panelParameters.filter(panelParameter => panelParameter.parameterId === paramId);
};

/**
 * Gets the panel rewards attached to the provided `rank`.
 * @param {number} rank The rank to check and see if there are any rewards for.
 * @returns {PanelRankupReward[]}
 */
StatDistributionPanel.prototype.getPanelRewardsByRank = function(rank) {
  const panelRewards = this.panelRewards;
  return panelRewards.filter(reward => reward.rankRequired === rank);
};

/**
 * Gets whether or not this SDP is unlocked.
 * @returns {boolean} True if this SDP is unlocked, false otherwise.
 */
StatDistributionPanel.prototype.isUnlocked = function() {
  return this.unlocked;
};

/**
 * Sets this SDP to be unlocked.
 */
StatDistributionPanel.prototype.unlock = function() {
  this.unlocked = true;
};

/**
 * Sets this SDP to be locked.
 */
StatDistributionPanel.prototype.lock = function() {
  this.unlocked = false;
};
//#endregion StatDistributionPanel

//#region PanelRankupReward
/**
 * A class that represents a single reward for achieving a particular rank in a panel.
 */
function PanelRankupReward() { this.initialize(...arguments); }
PanelRankupReward.prototype = {};
PanelRankupReward.prototype.constructor = PanelRankupReward;

/**
 * Initializes a single rankup reward.
 * @param {number} rankRequired The rank required.
 * @param {string} effect The effect to execute.
 */
PanelRankupReward.prototype.initialize = function(rankRequired, effect) {
  /**
   * The rank required for this panel rankup reward to be executed.
   * @type {number}
   */
  this.rankRequired = rankRequired;

  /**
   * The effect to be executed upon reaching the rank required.
   * The effect is captured as javascript.
   * @type {string}
   */
  this.effect = effect;
};
//#endregion PanelRankupReward

//#region PanelParameter
/**
 * A class that represents a single parameter and its growth for a SDP.
 */
function PanelParameter() { this.initialize(...arguments); }
PanelParameter.prototype = {};
PanelParameter.prototype.constructor = PanelParameter;

/**
 * Initializes a single panel parameter.
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

/**
 * Initializes a single panel ranking for tracking on a given actor.
 * @param {string} key The unique key for the panel to be tracked.
 */
PanelRanking.prototype.initialize = function(key) {
  /**
   * The key for this panel ranking.
   */
  this.key = key;
  this.initMembers();
};

/**
 * Initializes all members of this class.
 */
PanelRanking.prototype.initMembers = function() {
  /**
   * The current rank for this panel ranking.
   * @type {number}
   */
  this.currentRank = 0;

  /**
   * Whether or not this panel is maxed out.
   * @type {boolean}
   */
  this.maxed = false;
};

/**
 * Ranks up this panel.
 * If it is at max rank, then perform the max effect exactly once
 * and then max the panel out.
 */
PanelRanking.prototype.rankUp = function() {
  const panel = $gameSystem.getSdp(this.key);
  const maxRank = panel.maxRank;
  if (this.currentRank < maxRank) {
    this.currentRank++;
    this.performRepeatRankupEffects();
    this.performCurrentRankupEffects();
  }

  if (this.currentRank === maxRank) {
    this.performMaxRankupEffects();
  }
};

/**
 * Gets whether or not this panel is maxed out.
 * @returns {boolean} True if this panel is maxed out, false otherwise.
 */
PanelRanking.prototype.isPanelMaxed = function() {
  return this.maxed;
};

/**
 * Upon reaching a given rank of this panel, try to perform this `javascript` effect.
 * @param {number} newRank The rank to inspect and execute effects for.
 */
PanelRanking.prototype.performRankupEffects = function(newRank) {
  const a = $gameParty.leader();
  const rewardEffects = $gameSystem
    .getSdp(this.key)
    .getPanelRewardsByRank(newRank);
  if (rewardEffects.length > 0) {
    rewardEffects.forEach(rewardEffect => {
      try {
        eval(rewardEffect.effect);
      } catch (err) {
        console.error(`An error occurred while trying to execute the rank-${this.currentRank} reward for panel: ${this.key}`);
        console.error(err);
      }
    });
  }
};

/**
 * Executes any rewards associated with the current rank (used after ranking up typically).
 */
PanelRanking.prototype.performCurrentRankupEffects = function() {
  this.performRankupEffects(this.currentRank);
};

/**
 * Executes any rewards that are defined as "repeat rankup effects", aka -1 rank.
 */
PanelRanking.prototype.performRepeatRankupEffects = function() {
  this.performRankupEffects(-1);
};

/**
 * Executes any rewards that are defined as "max rankup effects", aka 0 rank.
 */
PanelRanking.prototype.performMaxRankupEffects = function() {
  this.performRankupEffects(0);
};
//#endregion PanelRanking
//#endregion SDP classes
//ENDOFFILE