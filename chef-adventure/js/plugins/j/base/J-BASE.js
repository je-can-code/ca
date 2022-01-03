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

/**
 * The various traits captured here by id with a more meaningful descriptor.
 */
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
   * Defines the number of times an action will repeat.
   * Caps at +/- 9 in the editor.
   *
   * In the context of JABS, this adds onto the number of bonus hits an
   * actor will have globally.
   */
  ATTACK_REPEATS: 34,

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
  Scene_Base: new Map(),
  Window_Base: {},
  Window_Command: {},
  Window_Selectable: {},
};
//#endregion Introduction

//#region Helpers
/**
 * The helper functions used commonly throughout my plugins.
 */
J.BASE.Helpers = {};

/**
 * Generates a `uuid`- a universally unique identifier- for this battler.
 * @returns {string} The `uuid`.
 */
J.BASE.Helpers.generateUuid = function()
{
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, c =>
    {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};

/**
 * Confirms the existence of a given file.
 * @param {string} path The path of the file we're checking.
 * @returns {boolean} True if the file exists, false otherwise.
 */
J.BASE.Helpers.checkFile = function(path)
{
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
J.BASE.Helpers.modVariable = function(variableId, amount)
{
  const oldValue = $gameVariables.value(variableId);
  const newValue = oldValue + amount;
  $gameVariables.setValue(variableId, newValue);
};

/**
 * Provides a random integer within the range
 * @param {number} min The lower bound for random numbers (inclusive).
 * @param {number} max The upper bound for random numbers (exclusive).
 */
J.BASE.Helpers.getRandomNumber = function(min, max)
{
  return Math.floor(min + Math.random() * (max + 1 - min))
};

/**
 * Translates the id and type into a proper `RPG::Item`.
 * @param {number} id The id of the item in the database.
 * @param {string} type An abbreviation for the type of item this is.
 * @returns {object} The `RPG::Item` of the correct id and type.
 */
J.BASE.Helpers.translateItem = function(id, type)
{
  switch (type)
  {
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
J.BASE.Helpers.satisfies = function(currentVersion, minimumVersion)
{
  const currentVersionParts = currentVersion.split('.');
  const minimumVersionParts = minimumVersion.split('.');
  for (const i in currentVersionParts)
  {
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
 * @returns {JABS_SkillChance[]}
 */
J.BASE.Helpers.parseSkillChance = function(structure, referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const notedata = referenceData.note.split(/[\r\n]+/);
  const skills = [];
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
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
J.BASE.Helpers.getKeyFromRegexp = function(structure)
{
  const stringifiedStructure = structure.toString();
  return stringifiedStructure
    .substring(stringifiedStructure.indexOf('<') + 1, stringifiedStructure.indexOf(':'));
};

/**
 * An empty static constant string variable.
 */
String.empty = '';

/**
 * Executes a given function a given number of `times`.
 * This uses `.forEach()` under the covers, so build your functions accordingly.
 * @param {number} times
 * @param {Function} func The function
 */
Array.iterate = function(times, func)
{
  [...Array(times)].forEach(func);
};
//#endregion Helpers

//#region Static objects
//#region ImageManager
/**
 * Checks to see if a character asset is present.
 * @param characterFileName
 * @returns {Promise}
 */
ImageManager.probeCharacter = function(characterFileName)
{
  return new Promise(function(resolve, reject)
  {
    var xhr = new XMLHttpRequest();
    const characterImageUrl = `img/characters/${Utils.encodeURI(characterFileName)}.png`;
    xhr.open("HEAD", characterImageUrl, true);
    xhr.onload = resolve;

    // we have nothing to do with a failure, so we do not process it.
    // xhr.onerror = reject;
    xhr.send();
  });
};
//#endregion ImageManager

//#region TextManager
/**
 * Gets the name of the given sp-parameter.
 * @param {number} sParamId The id of the sp-param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.sparam = function(sParamId)
{
  switch (sParamId)
  {
    case 0:
      return "Aggro";// J.Param.TGR_text;
    case 1:
      return "Parry";//J.Param.GRD_text;
    case 2:
      return "Healing Rate"; //J.Param.REC_text;
    case 3:
      return "Item Effects"; //J.Param.PHA_text;
    case 4:
      return "Magi Cost"; //J.Param.MCR_text;
    case 5:
      return "Tech Cost"; //J.Param.TCR_text;
    case 6:
      return "Phys Dmg Rate"; //J.Param.PDR_text;
    case 7:
      return "Magi Dmg Rate"; //J.Param.MDR_text;
    case 8:
      return "Light-footed"; //J.Param.FDR_text;
    case 9:
      return "Experience UP"; //J.Param.EXR_text;
  }
};

/**
 * Gets the name of the given ex-parameter.
 * @param {number} xParamId The id of the ex-param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.xparam = function(xParamId)
{
  switch (xParamId)
  {
    case 0:
      return "Accuracy";// J.Param.HIT_text;
    case 1:
      return "Parry Extend";//J.Param.EVA_text;
    case 2:
      return "Critical Hit"; //J.Param.CRI_text;
    case 3:
      return "Crit Dodge"; //J.Param.CEV_text;
    case 4:
      return "Magic Evade"; //J.Param.MEV_text;
    case 5:
      return "Magic Reflect"; //J.Param.MRF_text;
    case 6:
      return "Autocounter"; //J.Param.CNT_text;
    case 7:
      return "HP Regen"; //J.Param.HRG_text;
    case 8:
      return "MP Regen"; //J.Param.MRG_text;
    case 9:
      return "TP Regen"; //J.Param.TRG_text;
  }
};
/**
 * Gets the `parameter name` based on the "long" parameter id.
 *
 * "Long" parameter ids are used in the context of 0-27, rather than
 * 0-7 for param, 0-9 for xparam, and 0-9 for sparam.
 * @param {number} paramId The "long" parameter id.
 * @returns {string} The `name`.
 */
TextManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case  0:
      return this.param(paramId); // mhp
    case  1:
      return this.param(paramId); // mmp
    case  2:
      return this.param(paramId); // atk
    case  3:
      return this.param(paramId); // def
    case  4:
      return this.param(paramId); // mat
    case  5:
      return this.param(paramId); // mdf
    case  6:
      return this.param(paramId); // agi
    case  7:
      return this.param(paramId); // luk
    case  8:
      return this.xparam(paramId - 8); // hit
    case  9:
      return this.xparam(paramId - 8); // eva (parry boost)
    case 10:
      return this.xparam(paramId - 8); // cri
    case 11:
      return this.xparam(paramId - 8); // cev
    case 12:
      return this.xparam(paramId - 8); // mev (unused)
    case 13:
      return this.xparam(paramId - 8); // mrf
    case 14:
      return this.xparam(paramId - 8); // cnt (autocounter)
    case 15:
      return this.xparam(paramId - 8); // hrg
    case 16:
      return this.xparam(paramId - 8); // mrg
    case 17:
      return this.xparam(paramId - 8); // trg
    case 18:
      return this.sparam(paramId - 18); // trg (aggro)
    case 19:
      return this.sparam(paramId - 18); // grd (parry)
    case 20:
      return this.sparam(paramId - 18); // rec
    case 21:
      return this.sparam(paramId - 18); // pha
    case 22:
      return this.sparam(paramId - 18); // mcr (mp cost)
    case 23:
      return this.sparam(paramId - 18); // tcr (tp cost)
    case 24:
      return this.sparam(paramId - 18); // pdr
    case 25:
      return this.sparam(paramId - 18); // mdr
    case 26:
      return this.sparam(paramId - 18); // fdr
    case 27:
      return this.sparam(paramId - 18); // exr
    default:
      console.warn(`paramId:${paramId} didn't map to any of the default parameters.`);
      return '';
  }
};
//#endregion TextManager

//#region IconManager
/**
 * A static class that manages the icon to X correlation, such as stats and elements.
 */
class IconManager
{
  /**
   * The constructor is not designed to be called.
   * This is a static class.
   * @constructor
   */
  constructor()
  {
    throw new Error("The IconManager is a static class.");
  };

  /**
   * Gets the corresponding `iconIndex` for the param.
   * @param {number} paramId The id of the param.
   * @returns {number} The `iconIndex`.
   */
  static param(paramId)
  {
    switch (paramId)
    {
      case  0:
        return 32; // mhp
      case  1:
        return 33; // mmp
      case  2:
        return 34; // atk
      case  3:
        return 35; // def
      case  4:
        return 36; // mat
      case  5:
        return 37; // mdf
      case  6:
        return 38; // agi
      case  7:
        return 39; // luk
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the x-param.
   * @param {number} paramId The id of the param.
   * @returns {number} The `iconIndex`.
   */
  static xparam(paramId)
  {
    switch (paramId)
    {
      case  0:
        return 102; // hit
      case  1:
        return 82; // eva (parry boost)
      case  2:
        return 127; // cri
      case  3:
        return 81; // cev
      case  4:
        return 71; // mev
      case  5:
        return 222; // mrf
      case  6:
        return 15; // cnt (autocounter)
      case  7:
        return 2153; // hrg
      case  8:
        return 2245; // mrg
      case  9:
        return 13; // trg
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the s-param.
   * @param {number} paramId The id of the param.
   * @returns {number} The `iconIndex`.
   */
  static sparam(paramId)
  {
    switch (paramId)
    {
      case  0:
        return 14; // trg (aggro)
      case  1:
        return 128; // grd (parry)
      case  2:
        return 84; // rec
      case  3:
        return 209; // pha
      case  4:
        return 189; // mcr (mp cost)
      case  5:
        return 126; // tcr (tp cost)
      case  6:
        return 129; // pdr
      case  7:
        return 147; // mdr
      case  8:
        return 141; // fdr
      case  9:
        return 156; // exr
    }
  };

  /**
   * Gets the `iconIndex` based on the "long" parameter id.
   *
   * "Long" parameter ids are used in the context of 0-27, rather than
   * 0-7 for param, 0-9 for xparam, and 0-9 for sparam.
   * @param {number} paramId The "long" parameter id.
   * @returns {number} The `iconIndex`.
   */
  static longParam(paramId)
  {
    switch (paramId)
    {
      case  0:
        return this.param(paramId); // mhp
      case  1:
        return this.param(paramId); // mmp
      case  2:
        return this.param(paramId); // atk
      case  3:
        return this.param(paramId); // def
      case  4:
        return this.param(paramId); // mat
      case  5:
        return this.param(paramId); // mdf
      case  6:
        return this.param(paramId); // agi
      case  7:
        return this.param(paramId); // luk
      case  8:
        return this.xparam(paramId - 8); // hit
      case  9:
        return this.xparam(paramId - 8); // eva (parry boost)
      case 10:
        return this.xparam(paramId - 8); // cri
      case 11:
        return this.xparam(paramId - 8); // cev
      case 12:
        return this.xparam(paramId - 8); // mev (unused)
      case 13:
        return this.xparam(paramId - 8); // mrf
      case 14:
        return this.xparam(paramId - 8); // cnt (autocounter)
      case 15:
        return this.xparam(paramId - 8); // hrg
      case 16:
        return this.xparam(paramId - 8); // mrg
      case 17:
        return this.xparam(paramId - 8); // trg
      case 18:
        return this.sparam(paramId - 18); // trg (aggro)
      case 19:
        return this.sparam(paramId - 18); // grd (parry)
      case 20:
        return this.sparam(paramId - 18); // rec
      case 21:
        return this.sparam(paramId - 18); // pha
      case 22:
        return this.sparam(paramId - 18); // mcr (mp cost)
      case 23:
        return this.sparam(paramId - 18); // tcr (tp cost)
      case 24:
        return this.sparam(paramId - 18); // pdr
      case 25:
        return this.sparam(paramId - 18); // mdr
      case 26:
        return this.sparam(paramId - 18); // fdr
      case 27:
        return this.sparam(paramId - 18); // exr
      default:
        console.warn(`paramId:${paramId} didn't map to any of the default parameters.`);
        return 0;
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the element based on their id.
   * @param {number} elementId The id of the element.
   * @returns {number}
   */
  static element(elementId)
  {
    switch (elementId)
    {
      case -1:
        return 76;  // inherits element from parent.
      case  0:
        return 70;  // true
      case  1:
        return 912; // cut
      case  2:
        return 913; // poke
      case  3:
        return 914; // blunt
      case  4:
        return 915; // heat
      case  5:
        return 916; // liquid
      case  6:
        return 917; // air
      case  7:
        return 918; // ground
      case  8:
        return 919; // energy
      case  9:
        return 920; // void
      case 10:
        return 127; // typeless
      case 11:
        return 302; // vs undead
      case 12:
        return 321; // vs reptile
      case 13:
        return 345; // vs aquatic
      case 14:
        return 342; // vs slime
      case 15:
        return 184; // vs plants
      case 16:
        return 2112;// vs beast
      case 17:
        return 348; // vs insect
      case 18:
        return 82;  // vs humanoid
      case 19:
        return 83;  // vs construct
      case 20:
        return 2192;// vs deity
      case 21:
        return 403; // x weaponry
      case 22:
        return 364; // x flying
      case 23:
        return 453; // x shields
      case 24:
        return 72;  // x aura
      case 25:
        return 200; // tool shatter
      case 26:
        return 218; // tool crush
      case 27:
        return 1904;// tool ignite
      default:
        return 93;  // a question mark for the unknown.
    }
  };

  /**
   * Gets the icon for the skill type.
   * @param {number} skillTypeId The id of the skill type.
   * @returns {number} The corresponding icon index.
   */
  static skillType(skillTypeId)
  {
    switch (skillTypeId)
    {
      case  1:
        return 82;   // dodging skills
      case  2:
        return 2592; // guarding skills
      case  3:
        return 77;   // techniques (jerald)
      case  4:
        return 79;   // magecraft (rupert)
      case  5:
        return 188;  // panelogy
      case  6:
        return 227;  // tool skills
      case  7:
        return 76;   // weapon skills
      case  8:
        return 68;   // geology (earthie)
      case  9:
        return 69;   // nephology (skye)
      case 10:
        return 64;   // magmology (cynder)
      case 11:
        return 67;   // hydrology (aqualocke)
      case 12:
        return 2192; // superlatives
      default:
        return 0;
    }
  };

  /**
   * Gets the icon for the weapon type.
   * @param {number} weaponTypeId The id of the weapon type.
   * @returns {number} The corresponding icon index.
   */
  static weaponType(weaponTypeId)
  {
    switch (weaponTypeId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  };

  /**
   * Gets the icon for the armor type.
   * @param {number} armorTypeId The id of the armor type.
   * @returns {number} The corresponding icon index.
   */
  static armorType(armorTypeId)
  {
    switch (armorTypeId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  };

  /**
   * Gets the icon for the equip type.
   * @param {number} equipTypeId The id of the equip type.
   * @returns {number} The corresponding icon index.
   */
  static equipType(equipTypeId)
  {
    switch (equipTypeId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  };

  /**
   * Gets the icon for the special flag of a trait.
   * @param {number} flagId The id of the special flag.
   * @returns {number} The corresponding icon index.
   */
  static specialFlag(flagId)
  {
    switch (flagId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  };

  /**
   * Gets the icon for the party ability of a trait.
   * @param {number} partyAbilityId The id of the party ability.
   * @returns {number} The corresponding icon index.
   */
  static partyAbility(partyAbilityId)
  {
    switch (partyAbilityId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  };

  /**
   * Gets the icon for a trait.
   * @param {JAFTING_Trait} trait The target trait.
   * @returns {number} The corresponding icon index.
   */
  static trait(trait)
  {
    switch (trait._code)
    {
      case 11: // elemental damage rate - stackable.
        return this.element(trait._dataId);
      case 12: // debuff rate - stackable.
        return this.param(trait._dataId);
      case 13: // state rate - stackable.
      case 14: // state immunity - don't add the same twice.
        return $dataStates[trait._dataId].iconIndex;
      case 21: // base parameter rate - stackable.
        return this.param(trait._dataId);
      case 22: // ex-parameter rate - stackable.
        return this.xparam(trait._dataId);
      case 23: // sp-parameter rate - stackable.
        return this.sparam(trait._dataId);
      case 31: // attack element - uniquely stackable.
        return this.element(trait._dataId);
      case 32: // apply state chance - stackable.
        return $dataStates[trait._dataId].iconIndex;
      case 33: // skill speed - stackable.
        return 79;
      case 34: // repeat times - stackable.
        return 399;
      case 35: // change basic attack skill - overwrite.
        return $dataSkills[trait._value].iconIndex;
      case 41: // unlock skill type - one or the other or none.
        return this.skillType(trait._dataId);
      case 42: // lock skill type - one or the other or none.
        return this.skillType(trait._dataId);
      case 43: // learn skill while equipped - one or the other or none.
        return $dataSkills[trait._value].iconIndex;
      case 44: // unlearn skill while equipped - one or the other or none.
        return $dataSkills[trait._value].iconIndex;
      case 51: // can use new weapon type - don't add the same twice.
        return this.weaponType(trait._dataId);
      case 52: // can use new armor type - don't add the same twice.
        return this.armorType(trait._dataId);
      case 53: // (lock)cannot change equipment from slot.
        return this.equipType(trait._dataId);
      case 54: // (seal) slot is not equippable while equipped.
        return this.equipType(trait._dataId);
      case 55: // enable/disable dual-wielding - overwrite.
        return 462;
      case 61: // action times percent boost - stackable.
        return 76;
      case 63: // the collase, also known as the divider between transferable traits.
        return 25;
      case 62: // special flag - don't add the same twice.
        return this.specialFlag(trait._dataId);
      case 64: // party ability - don't add the same twice.
        return this.partyAbility(trait._dataId);

      default:
        console.error(`all traits are accounted for- is this a custom trait code: [${jaftingTrait._code}]?`);
        return false;
    }
  };

  /**
   * A tag for correlating a JABS parameter to an icon.
   */
  static JABS_PARAMETER =
    {
      BONUS_HITS: "bonus-hits",
      ATTACK_SKILL: "attack-skill",
      SPEED_BOOST: "speed-boost",
    };

  /**
   * Gets the JABS-related icon based on parameter type.
   * @param {string} type The type of JABS parameter.
   * @returns {number} The corresponding icon index.
   */
  static jabsParameterIcon(type)
  {
    switch (type)
    {
      case this.JABS_PARAMETER.BONUS_HITS:
        return 399;
      case this.JABS_PARAMETER.SPEED_BOOST:
        return 82;
      case this.JABS_PARAMETER.ATTACK_SKILL:
        return 76;
    }
  };

  /**
   * A tag for correlating a JAFTING parameter to an icon.
   */
  static JAFTING_PARAMETER =
    {
      MAX_REFINE: "max-refine-count",
      MAX_TRAITS: "max-trait-count",
      NOT_BASE: "not-refinement-base",
      NOT_MATERIAL: "not-refinement-material",
      TIMES_REFINED: "refined-count",
      UNREFINABLE: "unrefinable"
    };

  /**
   * Gets the JAFTING-related icon based on parameter type.
   * @param {string} type The type of JAFTING parameter.
   * @returns {number} The corresponding icon index.
   */
  static jaftingParameterIcon(type)
  {
    switch (type)
    {
      case this.JAFTING_PARAMETER.MAX_REFINE:
        return 86;
      case this.JAFTING_PARAMETER.MAX_TRAITS:
        return 86;
      case this.JAFTING_PARAMETER.NOT_BASE:
        return 90;
      case this.JAFTING_PARAMETER.NOT_MATERIAL:
        return 90;
      case this.JAFTING_PARAMETER.TIMES_REFINED:
        return 223;
      case this.JAFTING_PARAMETER.UNREFINABLE:
        return 90;
    }
  };
}
//#endregion IconManager
//#endregion Static objects

//#region Game objects
//#region Game_Actor
/**
 * Gets all skills that are executed when this actor is defeated.
 * @returns {JABS_SkillChance[]}
 */
Game_Actor.prototype.onOwnDefeatSkillIds = function()
{
  const objectsToCheck = this.getCurrentWithNotes();
  const structure = /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const skills = [];
  objectsToCheck.forEach(obj =>
  {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * Gets all skills that are executed when this actor defeats a target.
 * @returns {JABS_SkillChance[]}
 */
Game_Actor.prototype.onTargetDefeatSkillIds = function()
{
  const objectsToCheck = this.getCurrentWithNotes();
  const structure = /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+])>/i;
  const skills = [];
  objectsToCheck.forEach(obj =>
  {
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
Game_Actor.prototype.switchLocked = function()
{
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<noSwitch>/i;
  let switchLocked = false;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        switchLocked = true;
      }
    });
  });

  return switchLocked;
};

/**
 * Gets whether or not there are notes that indicate skills should be autoassigned
 * when leveling up.
 * @returns {boolean}
 */
Game_Actor.prototype.autoAssignOnLevelup = function()
{
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<autoAssignSkills>/i;
  let switchLocked = false;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        switchLocked = true;
      }
    });
  });

  return switchLocked;
};

/**
 * Gets all objects with notes on them currently for this actor.
 * This is very similar to the `traitObjects()` function.
 * @returns {rm.types.BaseItem[]}
 */
Game_Actor.prototype.getEverythingWithNotes = function()
{
  const objectsWithNotes = [];

  // get the actor object.
  objectsWithNotes.push(this.actor());

  // get their current class object.
  objectsWithNotes.push(this.currentClass());

  // get all their skill objects.
  objectsWithNotes.push(...this.skills());

  // get all their non-null equip objects.
  objectsWithNotes.push(...this.equips().filter(equip => !!equip));

  // get any currently applied normal states.
  objectsWithNotes.push(...this.states());

  // if we are using the passive skill-state system...
  if (J.PASSIVE)
  {
    // then add all those currently applied passive skill states, too.
    objectsWithNotes.push(...this.passiveSkillStates())
  }

  // return that potentially massive combination.
  return objectsWithNotes;
};

/**
 * Gets all things except skills that can possibly have notes on it at the
 * present moment. Skills are omitted on purpose.
 * @returns {rm.types.BaseItem[]}
 */
Game_Actor.prototype.getCurrentWithNotes = function()
{
  const objectsWithNotes = [];

  // get the actor object.
  objectsWithNotes.push(this.actor());

  // SKIP SKILLS.

  // get their current class object.
  objectsWithNotes.push(this.currentClass());

  // get all their non-null equip objects.
  objectsWithNotes.push(...this.equips().filter(equip => !!equip));

  // get any currently applied normal states.
  objectsWithNotes.push(...this.states());

  // if we are using the passive skill-state system...
  if (J.PASSIVE)
  {
    // then add all those currently applied passive skill states, too.
    objectsWithNotes.push(...this.passiveSkillStates())
  }

  // return that potentially slightly-less massive combination.
  return objectsWithNotes;
};

/**
 * Gets how much bonus HIT this actor has based on level.
 * @returns {number} The amount of growth in HIT for this actor.
 */
Game_Actor.prototype.hitGrowth = function()
{
  let hitGrowthPerLevel = 0;
  if (this._meta && this._meta[J.BASE.Notetags.HitGrowth])
  {
    hitGrowthPerLevel = parseFloat(this._meta[J.BASE.Notetags.HitGrowth]);
  }
  else
  {
    const structure = /<hitGrowth:[ ]?([.\d]+)>/i;
    this.actor().note.split(/[\r\n]+/).forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Actor.prototype.grdGrowth = function()
{
  let grdGrowthPerLevel = 0;
  if (this._meta && this._meta[J.BASE.Notetags.GuardGrowth])
  {
    grdGrowthPerLevel = parseFloat(this._meta[J.BASE.Notetags.GuardGrowth]);
  }
  else
  {
    const structure = /<grdGrowth:[ ]?([.\d]+)>/i;
    this.actor().note.split(/[\r\n]+/).forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Actor.prototype.prepareTime = function()
{
  return 1;
};

/**
 * Gets the skill id for this actor.
 * Actors don't use this functionality, they have equipped skills instead.
 * @returns {null}
 */
Game_Actor.prototype.skillId = function()
{
  return null;
};

/**
 * Gets the sight range for this actor.
 * Looks first to the class, then the actor for the tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.sightRange = function()
{
  let val = Game_Battler.prototype.sightRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Sight])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Sight]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Sight])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Sight]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<s:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Actor.prototype.alertedSightBoost = function()
{
  let val = Game_Battler.prototype.alertedSightBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertSightBoost])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertSightBoost]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<as:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Actor.prototype.pursuitRange = function()
{
  let val = Game_Battler.prototype.pursuitRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Pursuit])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Pursuit]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Pursuit])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Pursuit]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<p:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Actor.prototype.alertedPursuitBoost = function()
{
  let val = Game_Battler.prototype.alertedPursuitBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertPursuitBoost])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertPursuitBoost]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ap:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Actor.prototype.alertDuration = function()
{
  let val = Game_Battler.prototype.alertDuration.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertDuration])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertDuration]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertDuration])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertDuration]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ad:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Actor.prototype.teamId = function()
{
  if (J.ABS)
  {
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
Game_Actor.prototype.ai = function()
{
  return new JABS_BattlerAI(true, true);
};

/**
 * Gets whether or not the actor can idle.
 * Actors can never idle.
 * @returns {boolean}
 */
Game_Actor.prototype.canIdle = function()
{
  return false;
};

/**
 * Gets whether or not the actor's hp bar will show.
 * Actors never show their hp bar (they use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showHpBar = function()
{
  return false;
};

/**
 * Gets whether or not the actor's name will show below their character.
 * Actors never show their name (the use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showBattlerName = function()
{
  return false;
};

/**
 * Gets whether or not the actor is invincible.
 * Actors are never invincible by this means.
 * @returns {boolean}
 */
Game_Actor.prototype.isInvincible = function()
{
  return false;
};

/**
 * Gets whether or not the actor is inanimate.
 * Actors are never inanimate (duh).
 * @returns {boolean}
 */
Game_Actor.prototype.isInanimate = function()
{
  return false;
};

/**
 * Gets the retaliation skill ids for this actor.
 * Will retrieve from actor, class, all equipment, and states.
 * @returns {JABS_SkillChance[]}
 */
Game_Actor.prototype.retaliationSkills = function()
{
  const structure = /<retaliate:[ ]?(\[\d+,[ ]?\d+])>/i;
  const objectsToCheck = this.getEverythingWithNotes();
  const skills = [];
  objectsToCheck.forEach(obj =>
  {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * The underlying database data for this actor.
 * @returns {rm.types.Actor}
 */
Game_Actor.prototype.databaseData = function()
{
  return this.actor();
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * Gets the state associated with the given state id.
 * By abstracting this, we can modify the underlying state before it reaches its destination.
 * @param {number} stateId The state id to get data for.
 * @returns {rm.types.State}
 */
Game_Battler.prototype.state = function(stateId)
{
  return $dataStates[stateId];
};

/**
 * The underlying database data for this battler.
 *
 * This allows operations to be performed against both actor and enemy indifferently.
 * @returns {rm.types.Enemy|rm.types.Actor}
 */
Game_Battler.prototype.databaseData = function()
{
  return null;
};
/**
 * All battlers have a prepare time.
 * At this level, returns default 180 frames.
 * @returns {number}
 */
Game_Battler.prototype.prepareTime = function()
{
  return 180;
};

/**
 * All battlers have a skill id for their basic attack.
 * At this level, returns the default skill id of 1.
 * @returns {number}
 */
Game_Battler.prototype.skillId = function()
{
  return 1;
};

/**
 * All battlers have a default sight range.
 * @returns {number}
 */
Game_Battler.prototype.sightRange = function()
{
  return 4;
};

/**
 * All battlers have a default alerted sight boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedSightBoost = function()
{
  return 2;
};

/**
 * All battlers have a default pursuit range.
 * @returns {number}
 */
Game_Battler.prototype.pursuitRange = function()
{
  return 6;
};

/**
 * All battlers have a default alerted pursuit boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedPursuitBoost = function()
{
  return 4;
};

/**
 * All battlers have a default alert duration.
 * @returns {number}
 */
Game_Battler.prototype.alertDuration = function()
{
  return 300;
};

/**
 * All battlers have a default team id.
 * At this level, the default team id is 1 (the default for enemies).
 * @returns {number}
 */
Game_Battler.prototype.teamId = function()
{
  if (J.ABS) return JABS_Battler.enemyTeamId();

  return 1;
};

/**
 * All battlers have a default AI.
 * @returns {JABS_BattlerAI}
 */
Game_Battler.prototype.ai = function()
{
  if (J.ABS) return new JABS_BattlerAI();

  return null;
};

/**
 * All battlers can idle by default.
 * @returns {boolean}
 */
Game_Battler.prototype.canIdle = function()
{
  return true;
};

/**
 * All battlers will show their hp bar by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showHpBar = function()
{
  return true;
};

/**
 * All battlers will show their danger indicator by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showDangerIndicator = function()
{
  return true;
};

/**
 * All battlers will show their database name by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showBattlerName = function()
{
  return true;
};

/**
 * All battlers can be invincible, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInvincible = function()
{
  return false;
};

/**
 * All battlers can be inanimate, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInanimate = function()
{
  return false;
};

/**
 * All battlers have a default of no retaliation skills.
 * @returns {JABS_SkillChance[]}
 */
Game_Battler.prototype.retaliationSkills = function()
{
  const structure = /<retaliate:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const objectsToCheck = this.getEverythingWithNotes();
  const skills = [];
  objectsToCheck.forEach(obj =>
  {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * All battlers have a default of no on-own-defeat skill ids.
 * @returns {JABS_SkillChance[]}
 */
Game_Battler.prototype.onOwnDefeatSkillIds = function()
{
  return [];
};

/**
 * All battlers have a default of no on-defeating-a-target skill ids.
 * @returns {JABS_SkillChance[]}
 */
Game_Battler.prototype.onTargetDefeatSkillIds = function()
{
  return [];
};

/**
 * All battlers have this, but actors and enemies perform this function differently.
 * @returns {rm.types.BaseItem[]}
 */
Game_Battler.prototype.getEverythingWithNotes = function()
{
  return [];
};

/**
 * Gets whether or not the aggro is locked for this battler.
 * Locked aggro means their aggro cannot be modified in any way.
 * @returns {boolean}
 */
Game_Battler.prototype.isAggroLocked = function()
{
  return this.states().some(state => state._j.aggroLock);
};

/**
 * Gets the multiplier for received aggro for this battler.
 * @returns {number}
 */
Game_Battler.prototype.aggroInAmp = function()
{
  let inAmp = 1.0;
  this.states().forEach(state => inAmp += state._j.aggroInAmp);
  return inAmp;
};

/**
 * Gets the multiplier for dealt aggro for this battler.
 * @returns {number}
 */
Game_Battler.prototype.aggroOutAmp = function()
{
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
Game_Character.prototype.aiCode = function()
{
  let aiCode = "10000000";
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AiCode])
  {
    aiCode = referenceData.meta[J.BASE.Notetags.AiCode] || aiCode;
  }
  else
  {
    const structure = /<ai:[ ]?([0|1]{8})>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.battlerId = function()
{
  let battlerId = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.BattlerId])
  {
    // if its in the metadata, then grab it from there.
    battlerId = referenceData.meta[J.BASE.Notetags.BattlerId] || battlerId;
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<e:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.sightRadius = function()
{
  let sightRadius = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Sight])
  {
    sightRadius = referenceData.meta[J.BASE.Notetags.Sight] || sightRadius;
  }
  else
  {
    const structure = /<s:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.alertedSightBoost = function()
{
  let sightBoost = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertSightBoost])
  {
    sightBoost = referenceData.meta[J.BASE.Notetags.AlertSightBoost] || sightBoost;
  }
  else
  {
    const structure = /<as:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.pursuitRadius = function()
{
  let pursuitRadius = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Pursuit])
  {
    pursuitRadius = referenceData.meta[J.BASE.Notetags.Pursuit] || pursuitRadius;
  }
  else
  {
    const structure = /<p:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.alertedPursuitBoost = function()
{
  let pursuitBoost = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertPursuitBoost])
  {
    pursuitBoost = referenceData.meta[J.BASE.Notetags.AlertPursuitBoost] || pursuitBoost;
  }
  else
  {
    const structure = /<ap:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.alertedDuration = function()
{
  let alertDuration = 300;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertDuration])
  {
    alertDuration = referenceData.meta[J.BASE.Notetags.AlertDuration] || alertDuration;
  }
  else
  {
    const structure = /<ad:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        alertDuration = RegExp.$1;
      }
    })
  }

  return parseInt(alertDuration);
};

/**
 * Gets the custom move speed for this battler.
 * If no move speed is specified, return `0`, which will default to the event's movespeed.
 * @returns {number}
 */
Game_Character.prototype.customMoveSpeed = function()
{
  let customMoveSpeed = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.MoveSpeed])
  {
    customMoveSpeed = referenceData.meta[J.BASE.Notetags.MoveSpeed] || customMoveSpeed;
  }
  else
  {
    const structure = /<ms:((0|([1-9][0-9]*))(\.[0-9]+)?)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.canIdle = function()
{
  let canIdle = true;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoIdle])
  {
    canIdle = false;
  }
  else
  {
    const structure = /<noIdle>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.showHpBar = function()
{
  if (!(this instanceof Game_Event)) return false;

  let showHpBar = true;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoHpBar])
  {
    showHpBar = false;
  }
  else
  {
    const structure = /<noHpBar>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.isInvincible = function()
{
  if (!(this instanceof Game_Event)) return;

  let invincible = false;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Invincible])
  {
    invincible = true;
  }
  else
  {
    const structure = /<invincible>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
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
Game_Character.prototype.isInanimate = function()
{
  if (!(this instanceof Game_Event)) return;

  let inanimate = false;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Inanimate])
  {
    inanimate = true;
  }
  else
  {
    const structure = /<inanimate>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        inanimate = true;
      }
    })
  }

  return inanimate;
};
//#endregion Game_Character

//#region Game_Enemy
/**
 * Gets the amount of sdp points granted by this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.sdpPoints = function()
{
  let points = 0;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.SdpPoints])
  {
    // if its in the metadata, then grab it from there.
    points = referenceData.meta[J.BASE.Notetags.SdpPoints];
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<sdpPoints:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        points = RegExp.$1;
      }
    })
  }

  return parseInt(points);
};

/**
 * Gets all skills that are executed by this enemy when it is defeated.
 * @returns {JABS_SkillChance}
 */
Game_Enemy.prototype.onOwnDefeatSkillIds = function()
{
  const structure = /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};

/**
 * Gets all skills that are executed by this enemy when it defeats its target.
 * @returns {JABS_SkillChance}
 */
Game_Enemy.prototype.onTargetDefeatSkillIds = function()
{
  const structure = /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};

/**
 * Converts all "actions" from an enemy into their collection of known skills.
 * This includes both skills listed in their skill list, and any added skills via traits.
 * @returns {rm.types.Skill[]}
 */
Game_Enemy.prototype.skills = function()
{
  const actions = this.enemy().actions
    .map(action => $dataSkills[action.skillId]);
  const skillTraits = this.enemy().traits
    .filter(trait => trait.code === 35)
    .map(skillTrait => $dataSkills[skillTrait.dataId]);
  return actions
    .concat(skillTraits)
    .sort();
};

/**
 * Checks whether or not this enemy knows this skill.
 * @param skillId The id of the skill to check for.
 * @returns {boolean}
 */
Game_Enemy.prototype.hasSkill = function(skillId)
{
  return this.skills().includes($dataSkills[skillId]);
};

/**
 * Gets all objects with notes available to enemies.
 * @returns {rm.types.BaseItem[]}
 */
Game_Enemy.prototype.getEverythingWithNotes = function()
{
  const objectsWithNotes = [];
  objectsWithNotes.push(this.enemy());
  objectsWithNotes.push(...this.skills());
  objectsWithNotes.push(...this.states());
  return objectsWithNotes;
};

/**
 * Gets all objects with notes available to enemies.
 * @returns {rm.types.BaseItem[]}
 */
Game_Enemy.prototype.getCurrentWithNotes = function()
{
  const objectsWithNotes = [];
  objectsWithNotes.push(this.enemy());
  objectsWithNotes.push(...this.states());
  return objectsWithNotes;
};

/**
 * The underlying database data for this enemy.
 * @returns {rm.types.Enemy}
 */
Game_Enemy.prototype.databaseData = function()
{
  return this.enemy();
};
//#endregion Game_Enemy

//#region Game_Event
/**
 * Detects whether or not the event code is one that matches the "comment" code.
 * @param {number} code The code to match.
 * @returns {boolean}
 */
Game_Event.prototype.matchesControlCode = function(code)
{
  return (code === 108 || code === 408);
};
//#endregion Game_Event
//#endregion Game objects

//#region Sprite objects
//#region Sprite_ActorValue
/**
 * A sprite that monitors one of the primary fluctuating values (hp/mp/tp).
 */
function Sprite_ActorValue()
{
  this.initialize(...arguments);
}

Sprite_ActorValue.prototype = Object.create(Sprite.prototype);
Sprite_ActorValue.prototype.constructor = Sprite_ActorValue;
Sprite_ActorValue.prototype.initialize = function(actor, parameter, fontSizeMod = 0)
{
  this._j = {};
  Sprite.prototype.initialize.call(this);
  this.initMembers(actor, parameter, fontSizeMod);
  this.bitmap = this.createBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {object} actor The actor to track the value of.
 * @param {string} parameter The parameter to track of "hp"/"mp"/"tp"/"time".
 * @param {number} fontSizeMod The modification of the font size for this value.
 */
Sprite_ActorValue.prototype.initMembers = function(actor, parameter, fontSizeMod)
{
  this._j._parameter = parameter;
  this._j._actor = actor;
  this._j._fontSizeMod = fontSizeMod;
  this._j._last = {};
  this._j._last._hp = actor.hp;
  this._j._last._mp = actor.mp;
  this._j._last._tp = actor.tp;
  this._j._last._xp = actor.currentExp();
  this._j._last._lvl = actor.level;
  this._j._autoCounter = 60;
};

/**
 * Updates the bitmap if it needs updating.
 */
Sprite_ActorValue.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  if (this.hasParameterChanged())
  {
    this.refresh();
  }

  this.autoRefresh();
};

/**
 * Automatically refreshes the value being represented by this sprite
 * after a fixed amount of time.
 */
Sprite_ActorValue.prototype.autoRefresh = function()
{
  if (this._j._autoCounter <= 0)
  {
    this.refresh();
    this._j._autoCounter = 60;
  }

  this._j._autoCounter--;
};

/**
 * Refreshes the value being represented by this sprite.
 */
Sprite_ActorValue.prototype.refresh = function()
{
  this.bitmap = this.createBitmap();
};

/**
 * Checks whether or not a given parameter has changed.
 */
Sprite_ActorValue.prototype.hasParameterChanged = function()
{
  let changed = true;
  switch (this._j._parameter)
  {
    case "hp":
      changed = this._j._actor.hp !== this._j._last._hp;
      if (changed) this._j._last._hp = this._j._actor.hp;
      return changed;
    case "mp":
      changed = this._j._actor.mp !== this._j._last._mp;
      if (changed) this._j._last._mp = this._j._actor.mp;
      return changed;
    case "tp":
      changed = this._j._actor.tp !== this._j._last._tp;
      if (changed) this._j._last.tp = this._j._actor.tp;
      return changed;
    case "time":
      changed = this._j._actor.currentExp() !== this._j._last._xp;
      if (changed) this._j._last._xp = this._j._actor.currentExp();
      return changed;
    case "lvl":
      changed = this._j._actor.level !== this._j._last._lvl;
      if (changed) this._j._last._lvl = this._j._actor.level;
      return changed;
  }
};

/**
 * Creates a bitmap to attach to this sprite that shows the value.
 */
Sprite_ActorValue.prototype.createBitmap = function()
{
  let value = 0;
  const width = this.bitmapWidth();
  const height = this.fontSize() + 4;
  const bitmap = new Bitmap(width, height);
  bitmap.fontFace = this.fontFace();
  bitmap.fontSize = this.fontSize();
  switch (this._j._parameter)
  {
    case "hp":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(128, 24, 24, 1.0)";
      value = Math.floor(this._j._actor.hp);
      break;
    case "mp":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(24, 24, 192, 1.0)";
      value = Math.floor(this._j._actor.mp);
      break;
    case "tp":
      bitmap.outlineWidth = 2;
      bitmap.outlineColor = "rgba(64, 128, 64, 1.0)";
      value = Math.floor(this._j._actor.tp);
      break;
    case "time":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(72, 72, 72, 1.0)";
      const curExp = (this._j._actor.nextLevelExp() - this._j._actor.currentLevelExp());
      const nextLv = (this._j._actor.currentExp() - this._j._actor.currentLevelExp());
      value = curExp - nextLv;
      break;
    case "lvl":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(72, 72, 72, 1.0)";
      value = this._j._actor.level.padZero(3);
      break;
  }

  bitmap.drawText(value, 0, 0, bitmap.width, bitmap.height, "left");
  return bitmap;
};

/**
 * Defaults the bitmap width to be a fixed 200 pixels.
 */
Sprite_ActorValue.prototype.bitmapWidth = function()
{
  return 200;
};

/**
 * Defaults the font size to be an adjusted amount from the base font size.
 */
Sprite_ActorValue.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() + this._j._fontSizeMod;
};

/**
 * Defaults the font face to be the number font.
 */
Sprite_ActorValue.prototype.fontFace = function()
{
  return $gameSystem.numberFontFace();
};
//#endregion Sprite_ActorValue

//#region Sprite_Face
/**
 * A sprite that displays a single face.
 */
function Sprite_Face()
{
  this.initialize(...arguments);
}

Sprite_Face.prototype = Object.create(Sprite.prototype);
Sprite_Face.prototype.constructor = Sprite_Face;
Sprite_Face.prototype.initialize = function(faceName, faceIndex)
{
  Sprite.prototype.initialize.call(this);
  this.initMembers(faceName, faceIndex);
  this.loadBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {string} faceName The name of the face file.
 * @param {number} faceIndex The index of the face.
 */
Sprite_Face.prototype.initMembers = function(faceName, faceIndex)
{
  this._j = {
    _faceName: faceName,
    _faceIndex: faceIndex,
  };
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Face.prototype.loadBitmap = function()
{
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
//#endregion Sprite_Face

//#region Sprite_Icon
/**
 * A sprite that displays a single icon.
 */
function Sprite_Icon()
{
  this.initialize(...arguments);
}

Sprite_Icon.prototype = Object.create(Sprite.prototype);
Sprite_Icon.prototype.constructor = Sprite_Icon;

/**
 * Initializes this class.
 * @param {number} iconIndex The icon index this sprite should render.
 */
Sprite_Icon.prototype.initialize = function(iconIndex)
{
  // perform original logic.
  Sprite.prototype.initialize.call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * The icon index for this `Sprite_Icon` to render.
   * @type {number}
   */
  this._j._iconIndex = iconIndex;

  // load the bitmap.
  this.loadBitmap();
};

/**
 * Sets the icon index for this `Sprite_Icon`.
 * Redraws the sprite with the new index.
 * @param {number} iconIndex The icon index this sprite should render.
 */
Sprite_Icon.prototype.setIconIndex = function(iconIndex)
{
  // reassign the icon index.
  this._j._iconIndex = iconIndex;

  // loads the bitmap based on the new icon index.
  this.loadBitmap();
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Icon.prototype.loadBitmap = function()
{
  this.bitmap = ImageManager.loadSystem("IconSet");
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (this._j._iconIndex % 16) * pw;
  const sy = Math.floor(this._j._iconIndex / 16) * ph;
  this.setFrame(sx, sy, pw, ph);
};
//#endregion Sprite_Icon

//#region Sprite_MapGauge
/**
 * The sprite for displaying an hp gauge over a character's sprite.
 */
function Sprite_MapGauge()
{
  this.initialize(...arguments);
}

Sprite_MapGauge.prototype = Object.create(Sprite_Gauge.prototype);
Sprite_MapGauge.prototype.constructor = Sprite_MapGauge;
Sprite_MapGauge.prototype.initialize = function(
  bitmapWidth = 96,
  bitmapHeight = 24,
  gaugeHeight = 6,
  label = String.empty,
  value = null,
  iconIndex = -1
) {
  this._duration = 0;
  this._gauge = {};
  this._gauge._bitmapWidth = bitmapWidth;
  this._gauge._bitmapHeight = bitmapHeight;
  this._gauge._gaugeHeight = gaugeHeight;
  this._gauge._label = label;
  this._gauge._value = value;
  this._gauge._iconIndex = iconIndex;

  this._gauge._activated = true;

  Sprite_Gauge.prototype.initialize.call(this);
};

Sprite_MapGauge.prototype.activateGauge = function()
{
  this._gauge._activated = true;
};

Sprite_MapGauge.prototype.deactivateGauge = function()
{
  this._gauge._activated = false;
};

/**
 * Hook into the superclass update to do more things.
 */
Sprite_MapGauge.prototype.update = function()
{
  // don't update if its not activated.
  if (!this._gauge._activated) return;

  Sprite_Gauge.prototype.update.call(this);
  //this.manageGaugeVisibility();
};

/**
 * Handles the visibility of this hp bar based on interactivity.
 */
Sprite_MapGauge.prototype.manageGaugeVisibility = function()
{
  if (this._duration > 0)
  {
    this._duration--;
  }

  if (this._duration <= 60)
  {
    this.opacity -= 4.25;
  }
};

/**
 * Enforces the bitmap's width to be this value.
 */
Sprite_MapGauge.prototype.bitmapWidth = function()
{
  return this._gauge._bitmapWidth;
};

/**
 * Enforces the bitmap's height to be this value.
 */
Sprite_MapGauge.prototype.bitmapHeight = function()
{
  return this._gauge._bitmapHeight;
};

/**
 * Enforces the map gauge's height to be this value.
 */
Sprite_MapGauge.prototype.gaugeHeight = function()
{
  return this._gauge._gaugeHeight;
};

/**
 * Set this gauge's label.
 * @param {string} label The label to set this gauge to.
 */
Sprite_MapGauge.prototype.setLabel = function(label)
{
  this._gauge._label = label;
  this.redraw();
};

/**
 * Gets this gauge's label.
 */
Sprite_MapGauge.prototype.drawLabel = function()
{
  if (this._gauge._label)
  {
    const x = 32;
    const y = 0;
    this.bitmap.fontSize = 12;
    this.bitmap.drawText(
      this._gauge._label,
      x,
      y,
      this.bitmapWidth(),
      this.bitmapHeight(),
      "left");
  }
};

/**
 * Set this gauge's iconIndex.
 * @param {number} iconIndex The index/id of the icon to assign.
 */
Sprite_MapGauge.prototype.setIcon = function(iconIndex)
{
  this._gauge._iconIndex = iconIndex;
  this.redraw();
};

/**
 * Draws the icon associated with this gauge.
 */
Sprite_MapGauge.prototype.drawIcon = function()
{
  if (this._gauge._iconIndex > 0 && !this.children.length)
  {
    const sprite = this.createIconSprite();
    sprite.move(10, 20);
    this.addChild(sprite);
  }
};

Sprite_MapGauge.prototype.createIconSprite = function()
{
  const sprite = new Sprite_Icon(this._gauge._iconIndex);
  sprite.scale.x = 0.5;
  sprite.scale.y = 0.5;
  return sprite;
};

/**
 * Don't draw values for gauges on the map.
 * TODO: consider implementing values only when the enemy has been defeated.
 */
Sprite_MapGauge.prototype.drawValue = function()
{
  return this._gauge._value;
};

/**
 * OVERWRITE Rescopes `this` to point to the `Sprite_MapGauge` intead of the base
 * `Sprite_Gauge`. Otherwise, this is identical to the base `Sprite_Gauge.redraw()`.
 */
Sprite_MapGauge.prototype.redraw = function()
{
  this.bitmap.clear();
  const currentValue = this.currentValue();
  if (!isNaN(currentValue))
  {
    this.drawGauge();
    if (this._statusType !== "time")
    {
      this.drawLabel();
      this.drawIcon();
      if (this.isValid())
      {
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
Sprite_MapGauge.prototype.currentValue = function()
{
  if (this._battler)
  {
    switch (this._statusType)
    {
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
Sprite_MapGauge.prototype.currentMaxValue = function()
{
  if (this._battler)
  {
    switch (this._statusType)
    {
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
//#endregion Sprite_MapGauge

//#region Sprite_StateTimer
/**
 * A sprite that displays some static text.
 */
function Sprite_StateTimer()
{
  this.initialize(...arguments);
}

Sprite_StateTimer.prototype = Object.create(Sprite.prototype);
Sprite_StateTimer.prototype.constructor = Sprite_StateTimer;
Sprite_StateTimer.prototype.initialize = function(stateData)
{
  Sprite.prototype.initialize.call(this);
  this.initMembers(stateData);
  this.loadBitmap();
}

/**
 * Initializes the properties associated with this sprite.
 * @param {object} stateData The state data associated with this sprite.
 */
Sprite_StateTimer.prototype.initMembers = function(stateData)
{
  this._j = {};
  this._j._stateData = stateData;
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_StateTimer.prototype.loadBitmap = function()
{
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
  this.bitmap.fontFace = this.fontFace();
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.drawText(
    this._j._text,
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
}

Sprite_StateTimer.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  this.updateCooldownText();
};

Sprite_StateTimer.prototype.updateCooldownText = function()
{
  this.bitmap.clear();
  const durationRemaining = (this._j._stateData.duration / 60).toFixed(1);

  this.bitmap.drawText(
    durationRemaining.toString(),
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_StateTimer.prototype.bitmapWidth = function()
{
  return 40;
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_StateTimer.prototype.bitmapHeight = function()
{
  return this.fontSize() * 3;
};

/**
 * Determines the font size for text in this sprite.
 */
Sprite_StateTimer.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() - 10;
};

/**
 * determines the font face for text in this sprite.
 */
Sprite_StateTimer.prototype.fontFace = function()
{
  return $gameSystem.numberFontFace();
};
//#endregion Sprite_StateTimer

//#region Sprite_Text
/**
 * A sprite that displays some static text.
 */
function Sprite_Text()
{
  this.initialize(...arguments);
}

Sprite_Text.prototype = Object.create(Sprite.prototype);
Sprite_Text.prototype.constructor = Sprite_Text;
Sprite_Text.prototype.initialize = function(
  text, color = null, fontSizeMod = 0, alignment = "center", widthMod = 0, heightMod = 0
)
{
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
)
{
  this._j = {
    _text: text,
    _color: color,
    _fontSizeMod: fontSizeMod,
    _alignment: alignment,
    _widthMod: widthMod,
    _heightMod: heightMod,
  };
};

Sprite_Text.prototype.setText = function(newText)
{
  this.bitmap.clear();

  this._j._text = newText;

  this.loadBitmap();
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Text.prototype.loadBitmap = function()
{
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
Sprite_Text.prototype.update = function()
{
  Sprite.prototype.update.call(this);
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_Text.prototype.bitmapWidth = function()
{
  return 128 + this._j._widthMod;
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_Text.prototype.bitmapHeight = function()
{
  return 24 + this._j._heightMod;
};

/**
 * Determines the font size for text in this sprite.
 */
Sprite_Text.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() + this._j._fontSizeMod;
};

/**
 * Determines the font face for text in this sprite.
 */
Sprite_Text.prototype.fontFace = function()
{
  return $gameSystem.mainFontFace();
};

/**
 * Determines the font color for text in this sprite.
 * If no color is designated, then the default (white) is used.
 * @returns {number}
 */
Sprite_Text.prototype.textColor = function()
{
  return this._j._color
    ? ColorManager.textColor(this._j._color)
    : ColorManager.normalColor();
};

/**
 * Determines the alignment for text in this sprite.
 * @returns {string}
 */
Sprite_Text.prototype.textAlignment = function()
{
  return this._j._alignment;
};
//#endregion Sprite_Text
//#endregion Sprite objects

//#region TileMap
/**
 * OVERWRITE Fuck those autoshadows.
 */
Tilemap.prototype._addShadow = function(layer, shadowBits, dx, dy)
{
};
//#endregion TileMap

//#region Window objects
//#region WindowLayer
/**
 * OVERWRITE Renders windows, but WITH the ability to overlay.
 *
 * @param {PIXI.Renderer} renderer - The renderer.
 */
WindowLayer.prototype.render = function(renderer)
{
  if (!this.visible)
  {
    return;
  }

  const graphics = new PIXI.Graphics()
    , gl = renderer.gl
    , children = this.children.clone();

  renderer.framebuffer.forceStencil();
  graphics.transform = this.transform;
  renderer.batch.flush();
  gl.enable(gl.STENCIL_TEST);

  while (children.length > 0)
  {
    // draw from front to back instead of back to front.
    const win = children.shift();
    if (win._isWindow && win.visible && win.openness > 0)
    {
      gl.stencilFunc(gl.EQUAL, 0, ~0);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
      win.render(renderer);
      renderer.batch.flush();
      graphics.clear();
      // no "win.drawShape(graphics)" anymore.
      gl.stencilFunc(gl.ALWAYS, 1, ~0);
      gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
      gl.blendFunc(gl.ZERO, gl.ONE);
      graphics.render(renderer);
      renderer.batch.flush();
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
  }

  gl.disable(gl.STENCIL_TEST);
  gl.clear(gl.STENCIL_BUFFER_BIT);
  gl.clearStencil(0);
  renderer.batch.flush();

  for (const child of this.children)
  {
    if (!child._isWindow && child.visible)
    {
      child.render(renderer);
    }
  }

  renderer.batch.flush();
}
//#endregion WindowLayer

//#region Window_Command
/**
 * OVERWRITE Draws the color and icon along with the item itself in the command window.
 */
Window_Command.prototype.drawItem = function(index)
{
  const rect = this.itemLineRect(index);
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
  let commandName = `${this.commandName(index)}`;
  commandName = this.handleColor(commandName, index);
  commandName = this.handleIcon(commandName, index);

  this.drawTextEx(commandName, rect.x + 4, rect.y, rect.width);
};

/**
 * Wraps the command in color if a color index is provided.
 * @param {string} command The comman as raw text.
 * @param {number} index The index of this command in the window.
 * @returns {string}
 */
Window_Command.prototype.handleColor = function(command, index)
{
  const commandColor = this.commandColor(index);
  if (commandColor)
  {
    command = `\\C[${commandColor}]${command}\\C[0]`;
  }

  return command;
};

/**
 * Prepends the icon for this command if applicable.
 * @param {string} command The comman as raw text.
 * @param {number} index The index of this command in the window.
 * @returns {string}
 */
Window_Command.prototype.handleIcon = function(command, index)
{
  const commandIcon = this.commandIcon(index);
  if (commandIcon)
  {
    command = `\\I[${commandIcon}]${command}`;
  }

  return command;
};

/**
 * Retrieves the icon for the given command in the window if it exists.
 * @param {number} index the index of the command.
 * @returns {number} The icon index for the command, or 0 if it doesn't exist.
 */
Window_Command.prototype.commandIcon = function(index)
{
  return this._list[index].icon;
};

/**
 * Retrieves the color for the given command in the window if it exists.
 * @param {number} index the index of the command.
 * @returns {number} The color index for the command, or 0 if it doesn't exist.
 */
Window_Command.prototype.commandColor = function(index)
{
  return this._list[index].color;
};

/**
 * An overload for the `addCommand()` function that adds additional metadata to a command.
 * @param {string} name The visible name of this command.
 * @param {string} symbol The symbol for this command.
 * @param {boolean} enabled Whether or not this command is enabled.
 * @param {object} ext The extra data for this command.
 * @param {number} icon The icon index for this command.
 * @param {number} color The color index for this command.
 */
Window_Command.prototype.addCommand = function(
  name,
  symbol,
  enabled = true,
  ext = null,
  icon = 0,
  color = 0,
)
{
  this._list.push({name, symbol, enabled, ext, icon, color});
};
//#endregion Window_Command

//#region Window_MoreData
/**
 * A window designed to display "more" data.
 * "More" data is typically defined as parameters not found otherwise listed
 * in the screens these lists usually reside in.
 */
class Window_MoreData
  extends Window_Command
{
  /**
   * The various types supported by "more data" functionality.
   */
  static Types = {
    /** The weapon type. */
    Weapon: "Weapon",

    /** The armor type. */
    Armor: "Armor",

    /** The skill type. */
    Skill: "Skill",

    /** The item type. */
    Item: "Item",

    /** Unknown type, if somehow some other type found its way in there. */
    Unknown: "Unknown",
  };

  /**
   * @constructor
   * @param {Rectangle} rect A rectangle that represents the shape of this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
    this.refresh();
  };

  /**
   * Initializes all properties of this method.
   */
  initMembers()
  {
    /**
     * The item we're displaying more data for.
     */
    this.item = null;

    /**
     * The type of item we're displaying in the more data window.
     * @type {string}
     */
    this.type = null;

    /**
     * The actor used to perform parameter calculations against.
     * @type {Game_Actor}
     */
    this.actor = null;
  };

  /**
   * Sets an item to this window to display more data for.
   * @param {rm.types.BaseItem} newItem The item to set for this window.
   */
  setItem(newItem)
  {
    this.item = newItem;
    this.refresh();
  };

  /**
   * Sets the actor of this window for performing parameter calculations against.
   * @param {Game_Actor} newActor The new actor.
   */
  setActor(newActor)
  {
    this.actor = newActor;
    this.refresh();
  };

  /**
   * Refreshes this window by clearing it and redrawing all its contents.
   */
  refresh()
  {
    super.refresh();
    if (this.item)
    {
      this.determineItemType();
    }
  };

  /**
   * Updates the type of item this is.
   */
  determineItemType()
  {
    switch (true)
    {
      case DataManager.isItem(this.item):
        this.type = Window_MoreData.Types.Item;
        break;
      case DataManager.isSkill(this.item):
        this.type = Window_MoreData.Types.Skill;
        break;
      case DataManager.isArmor(this.item):
        this.type = Window_MoreData.Types.Armor;
        break;
      case DataManager.isWeapon(this.item):
        this.type = Window_MoreData.Types.Weapon;
        break;
      default:
        this.type = Window_MoreData.Types.Unknown;
        console.warn('was provided an unknown item type to display more data for.', this.item);
        break;
    }
  };

  /**
   * Determines whether or not the selected row is a weapon or not.
   * @returns {boolean}  True if this is a weapon, false otherwise.
   */
  weaponSelected()
  {
    return this.type === Window_MoreData.Types.Weapon;
  };

  /**
   * Determines whether or not the selected row is an armor or not.
   * @returns {boolean}  True if this is an armor, false otherwise.
   */
  armorSelected()
  {
    return this.type === Window_MoreData.Types.Armor;
  };

  /**
   * Determines whether or not the selected row is an item or not.
   * @returns {boolean}  True if this is an item, false otherwise.
   */
  itemSelected()
  {
    return this.type === Window_MoreData.Types.Item;
  };

  /**
   * Determines whether or not the selected row is a skill or not.
   * @returns {boolean}  True if this is a skill, false otherwise.
   */
  skillSelected()
  {
    return this.type === Window_MoreData.Types.Skill;
  };

  /**
   * Creates a command list for this menu.
   */
  makeCommandList()
  {
    if (this.item)
    {
      // this.addCommand(`More ${this.type} Data`, null, true, null, 2568, 1);
      // this.addCommand(`${this.item.name}`, null, true, null, this.item.iconIndex, 0);
      this.adjustWindowHeight();
    }
  };

  /**
   * Readjusts the height of the command window to match the number of commands.
   */
  adjustWindowHeight()
  {
    const magicHeight = 800;
    const calculatedHeight = (this._list.length + 1) * (this.lineHeight() + 8) - 16;
    if (calculatedHeight >= magicHeight)
    {
      this.height = magicHeight;
    }
    else
    {
      this.height = calculatedHeight;
    }
  };
};
//#endregion Window_MoreData

//#region Window_Selectable
/**
 * Weaves in the "more data window" at the highest level of selectable.
 *
 * It can be added to any window that extends this or its subclasses.
 */
J.BASE.Aliased.Window_Selectable.initialize = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function(rect)
{
  J.BASE.Aliased.Window_Selectable.initialize.call(this, rect);
  /**
   * The "more data" window. Used for further elaborating on a particular selection.
   *
   * @type {Window_MoreData}
   */
  this._moreDataWindow = null;
};

J.BASE.Aliased.Window_Selectable.processHandling = Window_Selectable.prototype.processHandling;
Window_Selectable.prototype.processHandling = function()
{
  if (this.isOpenAndActive())
  {
    if (this.isMoreEnabled() && this.isMoreTriggered())
    {
      return this.processMore();
    }
  }

  return J.BASE.Aliased.Window_Selectable.processHandling.call(this);
};

/**
 * Gets whether or not "more" data has been provided.
 * @returns {boolean}  True if "more" is handled, false otherwise.
 */
Window_Selectable.prototype.isMoreEnabled = function()
{
  return this.isHandled("more");
};

/**
 * Gets whether or not the "more" button is pressed/held.
 * @returns {boolean} True if the "more" button is pressed/held, false otherwise.
 */
Window_Selectable.prototype.isMoreTriggered = function()
{
  return this._canRepeat ? Input.isRepeated("shift") : Input.isTriggered("shift");
};

/**
 * Processes the "more" functionality.
 */
Window_Selectable.prototype.processMore = function()
{
  this.playCursorSound();
  this.updateInputData();
  this.callMoreHandler();
};

/**
 * Calls the given handler provided by the "more" symbol.
 */
Window_Selectable.prototype.callMoreHandler = function()
{
  this.callHandler("more");
};

/**
 * Extends the `.select()` to include a hook for executing logic onIndexChange.
 */
J.BASE.Aliased.Window_Selectable.select = Window_Selectable.prototype.select;
Window_Selectable.prototype.select = function(index)
{
  const previousIndex = this._index;
  J.BASE.Aliased.Window_Selectable.select.call(this, index);
  if (previousIndex !== this._index)
  {
    this.onIndexChange();
  }
};

/**
 * Designed for overriding to weave in functionality on-change of the index.
 */
Window_Selectable.prototype.onIndexChange = function()
{
};
//#endregion Window_Selectable
//#endregion Window objects

//ENDFILE