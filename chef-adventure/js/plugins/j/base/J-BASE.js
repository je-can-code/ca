//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] The base class for all J plugins.
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
 * - 2.0.0 (breaking change!)
 *    Broke apart the entire plugin into a collection of pieces, to leverage
 *    the new "plugin in a nested folder" functionality of RMMZ.
 * 
 *    NOTE: If you, the RM dev, do not like this new layout, you are free to
 *    manually copy paste all the various pieces back together into a single
 *    plugin, as the dependencies between plugins have not changed- this is
 *    purely for my developer sanity.
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
   Version: '2.0.0',
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
//ENDFILE