//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v2.1.0 BASE] The base class for all J plugins.
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
 * - 2.1.0
 *    Added wrapper objects for many database objects to ease plugin dev coding.
 *    Added "More data" window base class.
 *
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
  Version: '2.1.0',
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
  AlertDuration: "ad",
  AlertSightBoost: "as",
  AlertPursuitBoost: "ap",
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
  DataManager: new Map(),
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
 * Captures everything between the `<` and `:`.
 *
 * If the optional `asBoolean` is provided as true, then it will instead
 * capture everything between the `<` and `>`.
 *
 * This assumes it is one of the following formats:<br/>
 *  `<someKey:someValue>`<br/>
 *  `<someBooleanKey>`
 * @param {RegExp} structure The structure of the regular expression.
 * @param {boolean} asBoolean True if we want everything between `<` and `>`, false if only `<` and `:`.
 * @returns {string}
 */
J.BASE.Helpers.getKeyFromRegexp = function(structure, asBoolean = false)
{
  const stringifiedStructure = structure.toString();
  const openChar = '<';
  const closeChar = asBoolean ? '>' : ':';
  return stringifiedStructure
    .substring(
      stringifiedStructure.indexOf(openChar) + 1,
      stringifiedStructure.indexOf(closeChar));
};

/**
 * An empty static constant string variable.
 */
String.empty = '';
Object.defineProperty(String, "empty", { writable: false });

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
//#region DataManager

/**
 * The over-arching object containing all of my added parameters.
 */
DataManager._j ||= {};

/**
 * Whether or not the database JSON data has been wrapped yet or not.
 * @type {boolean}
 */
DataManager._j._databaseRewriteProcessed = false;

/**
 * Determines whether or not the database wrapjob has been processed.
 * @returns {boolean}
 */
DataManager.isRewriteProcessed = function()
{
  return this._j._databaseRewriteProcessed;
};

/**
 * Flips the flag to indicate that the database wrapper rewrite
 * has been processed.
 */
DataManager.rewriteProcessed = function()
{
  this._j._databaseRewriteProcessed = true;
};

/**
 * Hooks into the database loading and loads our extra data from notes and such.
 */
J.BASE.Aliased.DataManager.set('isDatabaseLoaded', DataManager.isDatabaseLoaded);
DataManager.isDatabaseLoaded = function()
{
  const isLoaded = J.BASE.Aliased.DataManager.get('isDatabaseLoaded').call(this);
  if (isLoaded)
  {
    this.rewriteDatabaseData();
  }

  return isLoaded;
};

/**
 * Rewrites the JSON objects extracted from the database and replaces them
 * with proper extendable classes.
 */
DataManager.rewriteDatabaseData = function()
{
  // check if we've already wrapped all the JSON objects yet.
  if (!this.isRewriteProcessed())
  {
    // add all the wrappers around the JSON objects from the database.
    this.rewriteActorData();
    this.rewriteArmorData();
    this.rewriteClassData();
    this.rewriteEnemyData();
    this.rewriteItemData();
    this.rewriteSkillData();
    this.rewriteStateData();
    this.rewriteWeaponData();

    // flip the flag so we don't try to wrap them all again.
    this.rewriteProcessed();
  }
};

/**
 * Overwrites all actors used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with actors.
 */
DataManager.rewriteActorData = function()
{
  // start up a new collection of actors.
  const classifiedActors = [];

  // iterate over each actor from the database.
  $dataActors.forEach((actor, index) =>
  {
    // check if the actor is null; index 0 always is.
    if (!actor)
    {
      // we should keep the same indexing structure.
      classifiedActors.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite enemies with.
    const actor_class = this.actorRewriteClass();

    // fill out this array like $dataActors normally is filled out.
    classifiedActors.push(new actor_class(actor, index));
  });

  // OVERWRITE the $dataActors object with this new actors array!
  $dataActors = classifiedActors;
};

/**
 * Gets the class reference to use when rewriting actors.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteActorData()` for an example.
 * @returns {RPG_Enemy} The class reference.
 */
DataManager.actorRewriteClass = function()
{
  return RPG_Actor;
};

/**
 * Overwrites all armors used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with armors.
 */
DataManager.rewriteArmorData = function()
{
  // start up a new collection of armors.
  const classifiedArmors = [];

  // iterate over each armor from the database.
  $dataArmors.forEach((armor, index) =>
  {
    // check if the entry is null; index 0 always is.
    if (!armor)
    {
      // we should keep the same indexing structure.
      classifiedArmors.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite armors with.
    const armor_class = this.armorRewriteClass();

    // fill out this array like $dataArmors normally is filled out.
    classifiedArmors.push(new armor_class(armor, index));
  });

  // OVERWRITE the $dataArmors object with this new armors array!
  $dataArmors = classifiedArmors;
};

/**
 * Gets the class reference to use when rewriting armors.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteArmorData()` for an example.
 * @returns {RPG_Armor} The class reference.
 */
DataManager.armorRewriteClass = function()
{
  return RPG_Armor;
};

/**
 * Overwrites all class used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with classes.
 */
DataManager.rewriteClassData = function()
{
  // start up a new collection of classes.
  const classifiedClasses = [];

  // iterate over each class from the database.
  $dataClasses.forEach((klass, index) =>
  {
    // check if the actor is null; index 0 always is.
    if (!klass)
    {
      // we should keep the same indexing structure.
      classifiedClasses.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite enemies with.
    const class_class = this.classRewriteClass();

    // fill out this array like $dataClasses normally is filled out.
    classifiedClasses.push(new class_class(klass, index));
  });

  // OVERWRITE the $dataClasses object with this new actors array!
  $dataClasses = classifiedClasses;
};

/**
 * Gets the class reference to use when rewriting classes.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteClassData()` for an example.
 * @returns {RPG_Class} The class reference.
 */
DataManager.classRewriteClass = function()
{
  return RPG_Class;
};

/**
 * Overwrites all enemies used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with enemies.
 */
DataManager.rewriteEnemyData = function()
{
  // start up a new collection of enemies.
  const classifiedEnemies = [];

  // iterate over each enemy from the database.
  $dataEnemies.forEach((enemy, index) =>
  {
    // check if the enemy is null; index 0 always is.
    if (!enemy)
    {
      // we should keep the same indexing structure.
      classifiedEnemies.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite enemies with.
    const enemy_class = this.enemyRewriteClass();

    // fill out this array like $dataEnemies normally is filled out.
    classifiedEnemies.push(new enemy_class(enemy, index));
  });

  // OVERWRITE the $dataEnemies object with this new enemies array!
  $dataEnemies = classifiedEnemies;
};

/**
 * Gets the class reference to use when rewriting enemies.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteEnemyData()` for an example.
 * @returns {RPG_Enemy} The class reference.
 */
DataManager.enemyRewriteClass = function()
{
  return RPG_Enemy;
};

/**
 * Overwrites all items used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with items.
 */
DataManager.rewriteItemData = function()
{
  // start up a new collection of items.
  const classifiedItems = [];

  // iterate over each item from the database.
  $dataItems.forEach((item, index) =>
  {
    // check if the enemy is null; index 0 always is.
    if (!item)
    {
      // we should keep the same indexing structure.
      classifiedItems.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite items with.
    const item_class = this.itemRewriteClass();

    // fill out this array like $dataItems normally is filled out.
    classifiedItems.push(new item_class(item, index));
  });

  // OVERWRITE the $dataItems object with this new enemies array!
  $dataItems = classifiedItems;
};

/**
 * Gets the class reference to use when rewriting enemies.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteItemData()` for an example.
 * @returns {RPG_Item} The class reference.
 */
DataManager.itemRewriteClass = function()
{
  return RPG_Item;
};

/**
 * Overwrites all skills used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with skills.
 */
DataManager.rewriteSkillData = function()
{
  // start up a new collection of skills.
  const classifiedSkills = [];

  // iterate over each skill from the database.
  $dataSkills.forEach((skill, index) =>
  {
    // check if the skill is null; index 0 always is.
    if (!skill)
    {
      // we should keep the same indexing structure.
      classifiedSkills.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite skills with.
    const skill_class = this.skillRewriteClass();

    // fill out this array like $dataSkills normally is filled out.
    classifiedSkills.push(new skill_class(skill, index));
  });

  // OVERWRITE the $dataSkills object with this new skills array!
  $dataSkills = classifiedSkills;
};

/**
 * Gets the class reference to use when rewriting skills.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteSkillData()` for an example.
 * @returns {RPG_Skill} The class reference.
 */
DataManager.skillRewriteClass = function()
{
  return RPG_Skill;
};

/**
 * Overwrites all states used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with states.
 */
DataManager.rewriteStateData = function()
{
  // start up a new collection of states.
  const classifiedStates = [];

  // iterate over each state from the database.
  $dataStates.forEach((state, index) =>
  {
    // check if the state is null; index 0 always is.
    if (!state)
    {
      // we should keep the same indexing structure.
      classifiedStates.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite states with.
    const state_class = this.stateRewriteClass();

    // fill out this array like $dataStates normally is filled out.
    classifiedStates.push(new state_class(state, index));
  });

  // OVERWRITE the $dataStates object with this new states array!
  $dataStates = classifiedStates;
};

/**
 * Gets the class reference to use when rewriting states.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteStateData()` for an example.
 * @returns {RPG_State} The class reference.
 */
DataManager.stateRewriteClass = function()
{
  return RPG_State;
};

/**
 * Overwrites all weapons used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with weapons.
 */
DataManager.rewriteWeaponData = function()
{
  // start up a new collection of weapons.
  const classifiedWeapons = [];

  // iterate over each weapon from the database.
  $dataWeapons.forEach((weapon, index) =>
  {
    // check if the skill is null; index 0 always is.
    if (!weapon)
    {
      // we should keep the same indexing structure.
      classifiedWeapons.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite weapons with.
    const weapon_class = this.weaponRewriteClass();

    // fill out this array like $dataWeapons normally is filled out.
    classifiedWeapons.push(new weapon_class(weapon, index));
  });

  // OVERWRITE the $dataWeapons object with this new skills array!
  $dataWeapons = classifiedWeapons;
};

/**
 * Gets the class reference to use when rewriting weapons.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteWeaponData()` for an example.
 * @returns {RPG_Weapon} The class reference.
 */
DataManager.weaponRewriteClass = function()
{
  return RPG_Weapon;
};
//#endregion DataManager

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

  /**
   * Gets the icon representing the team id provided.
   * @param {string} teamId The team id.
   * @returns {number} The corresponding icon index.
   */
  static team(teamId)
  {
    switch (teamId)
    {
      case 0: // ally
        return 38;
      case 1: // enemy
        return 21;
      case 2: // neutral
        return 91;
    }
  };
}
//#endregion IconManager

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
    const xhr = new XMLHttpRequest();
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
//#endregion Static objects

//#region Game objects
//#region Game_Actor
/**
 * The underlying database data for this battler.
 *
 * This allows operations to be performed against both actor and enemy indifferently.
 * @returns {number}
 */
Game_Actor.prototype.battlerId = function()
{
  return this.actorId();
};

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
 * @returns {RPG_BaseItem[]}
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
 * OVERWRITE Gets the skill associated with the given skill id.
 * By abstracting this, we can modify the underlying skill before it reaches its destination.
 * @param {number} skillId The skill id to get the skill for.
 * @returns {rm.types.Skill}
 */
Game_Actor.prototype.skill = function(skillId)
{
  return $dataSkills[skillId];
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
 * @returns {RPG_Actor}
 */
Game_Actor.prototype.databaseData = function()
{
  return this.actor();
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * Gets the skill associated with the given skill id.
 * By default, we simply get the skill from the database with no modifications.
 * @param {number} skillId The skill id to get the skill for.
 * @returns {RPG_Skill}
 */
Game_Battler.prototype.skill = function(skillId)
{
  return $dataSkills[skillId];
};

/**
 * Gets the state associated with the given state id.
 * By abstracting this, we can modify the underlying state before it reaches its destination.
 * @param {number} stateId The state id to get data for.
 * @returns {RPG_State}
 */
Game_Battler.prototype.state = function(stateId)
{
  return $dataStates[stateId];
};

/**
 * The underlying database data for this battler.
 *
 * This allows operations to be performed against both actor and enemy indifferently.
 * @returns {number}
 */
Game_Battler.prototype.battlerId = function()
{
  return 0;
};

/**
 * The underlying database data for this battler.
 *
 * This allows operations to be performed against both actor and enemy indifferently.
 * @returns {RPG_Enemy|RPG_Actor}
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
 * The underlying database data for this battler.
 *
 * This allows operations to be performed against both actor and enemy indifferently.
 * @returns {number}
 */
Game_Enemy.prototype.battlerId = function()
{
  return this.enemyId();
};

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
  const structure = /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};

/**
 * Gets all skills that are executed by this enemy when it defeats its target.
 * @returns {JABS_SkillChance}
 */
Game_Enemy.prototype.onTargetDefeatSkillIds = function()
{
  const structure = /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};

/**
 * Converts all "actions" from an enemy into their collection of known skills.
 * This includes both skills listed in their skill list, and any added skills via traits.
 * @returns {RPG_Skill[]}
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
 * @param {number} skillId The id of the skill to check for.
 * @returns {boolean}
 */
Game_Enemy.prototype.hasSkill = function(skillId)
{
  return this.skills().includes($dataSkills[skillId]);
};

/**
 * Gets all objects with notes available to enemies.
 * @returns {RPG_Enemy[]}
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
 * @returns {RPG_Enemy}
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

/**
 * Generates a promise based on the resolution of the bitmap.<br/>
 * If the promise resolves successfully, it'll contain the bitmap.<br/>
 * If the promise rejects, then it is up to the handler how to deal with that.<br/>
 * @param {string} filename The name of the file without the file extension.
 * @param {string} directory The name of the directory to find the filename in (include trailing slash!).
 * @returns {Promise}
 */
ImageManager.loadBitmapPromise = function(filename, directory)
{
  // create a promise for the bitmap.
  const bitmapPromise = new Promise((resolve, reject) =>
  {
    // load the bitmap from our designated location.
    const bitmap = this.loadBitmap(`${directory}`, filename, 0, true);

    // and add a listener to the bitmap to resolve _onLoad.
    bitmap.addLoadListener(thisBitmap =>
    {
      // if everything is clear, resolve with the loaded bitmap.
      if (thisBitmap.isReady()) resolve(thisBitmap);

      // if there were problems, then reject.
      else if (thisBitmap.isError()) reject();
    });
  });

  // return the created promise.
  return bitmapPromise;
};

ImageManager.iconColumns = 16;

//#region Sprite_Icon
/**
 * A customizable sprite that displays a single icon.
 *
 * Defaults to regular `ImageManager`'s defaults in size and columns,
 * but can be modified manually to different iconsets bitmaps and/or
 * different icon widths and heights.
 */
class Sprite_Icon extends Sprite
{
  /**
   * Initializes this sprite with the designated icon.
   * @param {number} iconIndex The icon index of the icon for this sprite.
   */
  initialize(iconIndex = 0)
  {
    // perform original logic.
    super.initialize();

    // initialize our properties.
    this.initMembers();

    // setups up the bitmap with the default iconset via promises.
    this.setupDefaultIconsetBitmap(iconIndex);
  };

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    /**
     * All encompassing _j object for storing my custom properties.
     */
    this._j ||= {};

    /**
     * Whether or not the sprite is ready to be drawn yet.
     * @type {boolean}
     */
    this._j._isReady = false;


    /**
     * The icon index that this sprite represents.
     * @type {number}
     */
    this._j._iconIndex = 0;

    /**
     * The width of our icon. Defaults to the image manager's width,
     * but it can be set higher or lower for different-sized iconsheets.
     * @type {number}
     */
    this._j._iconWidth = ImageManager.iconWidth;

    /**
     * The height of our icon. Defaults to the image manager's height,
     * but it can be set higher or lower for different-sized iconsheets.
     * @type {number}
     */
    this._j._iconHeight = ImageManager.iconHeight;

    /**
     * The number of columns on the iconset we're using. Defaults to 16,
     * which was also predefined by this plugin, but is just the number
     * of columns the default iconset.png file has.
     * @type {number}
     */
    this._j._iconColumns = ImageManager.iconColumns;
  };

  /**
   * Sets up the bitmap with the default iconset.
   * @param {number} iconIndex The icon index of the icon for this sprite.
   */
  setupDefaultIconsetBitmap(iconIndex)
  {
    // undoes the ready check flag.
    this.unReady();

    // setup a promise for when the bitmap loads.
    const bitmapPromise = ImageManager.loadBitmapPromise(`IconSet`,`img/system/`)
      .then(bitmap => this.setIconsetBitmap(bitmap))
      .catch(() => { throw new Error('default iconset bitmap failed to load.'); });

    // upon promise delivery, execute the rendering.
    Promise.all([bitmapPromise])
      // execute on-ready logic, such as setting the icon index of this sprite to render.
      .then(() => this.onReady(iconIndex))
  };

  /**
   * Sets the ready flag to false to prevent rendering further
   */
  unReady()
  {
    this._j._isReady = false;
  };

  /**
   * Gets whether or not this icon sprite is ready for rendering.
   * @returns {boolean}
   */
  isReady()
  {
    return this._j._isReady;
  };

  /**
   * Sets the bitmap to the designated bitmap.
   * @param {Bitmap} bitmap The base bitmap of this sprite.
   */
  setIconsetBitmap(bitmap)
  {
    this.bitmap = bitmap;
  };

  /**
   * Gets the icon index from the iconset for this sprite.
   * @returns {number}
   */
  iconIndex()
  {
    return this._j._iconIndex;
  };

  /**
   * Sets the icon index for this sprite.
   * @param {number} iconIndex The icon index this sprite should render.
   */
  setIconIndex(iconIndex)
  {
    // reassign the icon index.
    this._j._iconIndex = iconIndex;

    // if we are not ready to render, then do not.
    if (!this.isReady()) return;

    // (re)renders the sprite based on the icon index.
    this.drawIcon();
  };

  /**
   * Gets the width of this icon for this sprite.
   * @returns {number}
   */
  iconWidth()
  {
    return this._j._iconWidth;
  };

  /**
   * Sets the width of this sprite's icon.
   * @param width
   */
  setIconWidth(width)
  {
    this._j._iconWidth = width;
  };

  /**
   * Gets the height of this icon for this sprite.
   * @returns {number}
   */
  iconHeight()
  {
    return this._j._iconHeight;
  };

  /**
   * Sets the height of this sprite's icon.
   * @param height
   */
  setIconHeight(height)
  {
    this._j._iconHeight = height;
  };

  /**
   * Gets the number of columns for this sprite's iconset.
   * @returns {number}
   */
  iconColumns()
  {
    return this._j._iconColumns;
  };

  /**
   * Sets the number of columns for the sprite's iconset.
   * @param {number} columns The new number of columns in this sprite's iconset.
   */
  setIconColumns(columns)
  {
    this._j._iconColumns = columns;
  };

  /**
   * Upon becoming ready, execute this logic.
   * In this sprite's case, we render ourselves.
   * @param {number} iconIndex The icon index of this sprite.
   */
  onReady(iconIndex = 0)
  {
    // flag this sprite as being ready for rendering.
    this._j._isReady = true;

    // and also follow up with rendering an icon.
    this.setIconIndex(iconIndex);
  };

  /**
   * Sets the frame of the bitmap to be the icon we care about.
   */
  drawIcon()
  {
    // determine the universal shape of the icon and iconset.
    const iconWidth = this.iconWidth();
    const iconHeight = this.iconHeight();
    const iconsetColumns = this.iconColumns();
    const iconIndex = this.iconIndex();

    // calculate the x:y of the icon's origin based on index.
    const x = (iconIndex % iconsetColumns) * iconWidth;
    const y = Math.floor(iconIndex / iconsetColumns) * iconHeight;

    // set the frame of the bitmap to start at the x:y, and be as big as designated.
    this.setFrame(x, y, iconWidth, iconHeight);
  };
}
//#endregion Sprite_Icon

//#region Sprite_BaseText
/**
 * A sprite that displays some text.
 * This acts as a base class for a number of other text-based sprites.
 */
class Sprite_BaseText extends Sprite
{
  /**
   * The available supported text alignments.
   */
  static Alignments = {
    Left: "left",
    Center: "center",
    Right: "right",
  };

  /**
   * Extend initialization of the sprite to draw the text.
   * @param {string} text The text content for this sprite.
   */
  initialize(text = String.empty)
  {
    // perform original logic.
    super.initialize();

    // initialize our properties.
    this.initMembers();

    // set the text of the sprite.
    this.setText(text);
  };

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    /**
     * All encompassing _j object for storing my custom properties.
     */
    this._j ||= {};

    /**
     * A test bitmap for measuring text width upon.
     * @type {Bitmap}
     */
    this._j._testBitmap = new Bitmap(512, 128);

    /**
     * The text to render in this sprite.
     * @type {string}
     */
    this._j._text = String.empty;

    /**
     * The text color index of this sprite.
     * This should be a hexcode.
     * @type {string}
     */
    this._j._color = "#ffffff";

    /**
     * The alignment of text in this sprite.
     * @type {Sprite_BaseText.Alignments}
     */
    this._j._alignment = "left";

    /**
     * Whether or not the text should be italics.
     * @type {boolean}
     */
    this._j._italics = false;

    /**
     * Whether or not the text should be bolded.
     * @type {boolean}
     */
    this._j._bold = false;

    /**
     * The font face of the text in this sprite.
     * @type {string}
     */
    this._j._fontFace = $gameSystem.mainFontFace();

    /**
     * The font size of the text in this sprite.
     * @type {number}
     */
    this._j._fontSize = $gameSystem.mainFontSize();
  };

  /**
   * Sets up the bitmap based on the desired text content.
   */
  loadBitmap()
  {
    // check if a bitmap is already defined.
    if (this.bitmap)
    {
      // clear it if so.
      this.bitmap.clear();
    }

    // generate a new bitmap based on width and height.
    this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());

    // setup the bitmap with the current configuration.
    this.configureBitmap();
  };

  /**
   * Configures the bitmap with the current settings and configuration.
   */
  configureBitmap()
  {
    this.bitmap.clear();
    this.bitmap.fontFace = this.fontFace();
    this.bitmap.fontSize = this.fontSize();
    this.bitmap.fontBold = this.isBold();
    this.bitmap.fontItalic = this.isItalics();
    this.bitmap.textColor = this.color();
  };

  /**
   * Refresh the content of this sprite.
   * This completely reloads the sprite's bitmap and redraws the text.
   */
  refresh()
  {
    // check if we are missing a bitmap somehow.
    if (!this.bitmap)
    {
      // load the bitmap if so.
      this.loadBitmap();
    }
    else
    {
      // configure the bitmap based on current settings.
      this.configureBitmap();
    }

    // render the text onto the bitmap.
    this.renderText();
  };

  /**
   * The width of this bitmap.
   * Uses the bitmap measuring of text based on the current configuration.
   * @returns {number}
   */
  bitmapWidth()
  {
    // setup the test bitmap similar to the real one.
    this._j._testBitmap.fontFace = this._j._fontFace;
    this._j._testBitmap.fontSize = this._j._fontSize;
    this._j._testBitmap.fontItalic = this.isItalics();
    this._j._testBitmap.fontBold = this.isBold();

    // and return the measured text width.
    return this._j._testBitmap.measureTextWidth(this._j._text) * 2;
  };

  /**
   * The height of this bitmap.
   * This defaults to roughly 3 pixels per size of font.
   * @returns {number}
   */
  bitmapHeight()
  {
    return this._j._fontSize * 3;
  };

  /**
   * The text currently assigned to this sprite.
   * @returns {string|String.empty}
   */
  text()
  {
    return this._j._text;
  };

  /**
   * Assigns text to this sprite.
   * If the text has changed, it reloads the bitmap.
   * @param {string} text The text to assign to this sprite.
   */
  setText(text)
  {
    // check if the text has changed.
    if (this.text() !== text)
    {
      // assign the new text.
      this._j._text = text;

      // render the text to the bitmap.
      this.refresh();
    }

    // return this for chaining if desired.
    return this;
  };

  /**
   * Gets the current color assigned to this sprite's text.
   * @returns {string|*}
   */
  color()
  {
    return this._j._color;
  };

  /**
   * Sets the color of this sprite's text.
   * This should be a hexcode.
   * @param {string} color The hex color for this text.
   */
  setColor(color)
  {
    // if we do not have a valid hex color, then do not assign it.
    if (!this.isValidColor(color)) return;

    if (this.color() !== color)
    {
      this._j._color = color;
      this.refresh();
    }

    // return this for chaining if desired.
    return this;
  };

  /**
   * Validates the color to ensure it is a hex color.
   * @param {string} color The color to validate.
   * @returns {boolean} True if the hex color is valid, false otherwise.
   */
  isValidColor(color)
  {
    // use regex to validate the hex color.
    const structure = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    const isHexColor = structure.test(color);

    // check if we failed the validation.
    if (!isHexColor)
    {
      // and warn the user.
      console.error(`Attempted to assign ${color} as a hex color to this text sprite:`, this);
    }

    // return the result.
    return isHexColor;
  };

  /**
   * Gets the text alignment for this text sprite.
   * @returns {Sprite_BaseText.Alignments}
   */
  alignment()
  {
    return this._j._alignment;
  };

  /**
   * Sets the alignment of this sprite's text.
   * The alignment set must be one of the three valid options.
   * @param {Sprite_BaseText.Alignments} alignment The alignment to set.
   */
  setAlignment(alignment)
  {
    // if we do not have a valid alignment, then do not assign it.
    if (!this.isValidAlignment(alignment)) return;

    if (this.alignment() !== alignment)
    {
      this._j._alignment = alignment;
      this.refresh();
    }

    // return this for chaining if desired.
    return this;
  };

  /**
   * Validates the alignment to ensure it is a valid alignment.
   * @param {string} alignment The alignment to validate.
   * @returns {boolean} True if the alignment is valid, false otherwise.
   */
  isValidAlignment(alignment)
  {
    const validAlignments = [
      Sprite_BaseText.Alignments.Left,
      Sprite_BaseText.Alignments.Center,
      Sprite_BaseText.Alignments.Right
    ]

    return validAlignments.includes(alignment);
  };

  /**
   * Gets whether or not this sprite's text is bold.
   * @returns {boolean}
   */
  isBold()
  {
    return this._j._bold;
  };

  /**
   * Sets the bold for this sprite's text.
   * @param {boolean} bold True if we're using bold, false otherwise.
   */
  setBold(bold)
  {
    if (this.bold() !== bold)
    {
      this._j._bold = bold;
      this.refresh();
    }

    // return this for chaining if desired.
    return this;
  };

  /**
   * Gets whether or not this sprite's text is italics.
   * @returns {boolean}
   */
  isItalics()
  {
    return this._j._italics;
  };

  /**
   * Sets the italics for this sprite's text.
   * @param {boolean} italics True if we're using italics, false otherwise.
   */
  setItalics(italics)
  {
    if (this.isItalics() !== italics)
    {
      this._j._italics = italics;
      this.refresh();
    }

    // return this for chaining if desired.
    return this;
  };

  /**
   * Gets the current font face name.
   * @returns {string}
   */
  fontFace()
  {
    return this._j._fontFace;
  };

  /**
   * Sets the font face to the designated font.
   * This will not work if you set it to a font that you don't have
   * in the `/font` folder.
   * @param {string} fontFace The precise name of the font to change the text to.
   */
  setFontFace(fontFace)
  {
    if (this.fontFace() !== fontFace)
    {
      this._j._fontFace = fontFace;
      this.refresh();
    }

    // return this for chaining if desired.
    return this;
  };

  /**
   * Gets the current font size.
   * @returns {number}
   */
  fontSize()
  {
    return this._j._fontSize;
  };

  /**
   * Sets the font size to the designated number.
   * @param {number} fontSize The size of the font.
   */
  setFontSize(fontSize)
  {
    if (this.fontSize() !== fontSize)
    {
      this._j._fontSize = fontSize;
      this.refresh();
    }

    // return this for chaining if desired.
    return this;
  };

  /**
   * Renders the text of this sprite.
   */
  renderText()
  {
    // draw the text with the current settings onto the bitmap.
    this.bitmap.drawText(
      this.text(),
      0,
      0,
      this.bitmapWidth(),
      this.bitmapHeight(),
      this.alignment());
  };
}
//#endregion Sprite_BaseText

//#region Sprite_ComboGauge
/**
 * The gauge sprite for handling combo timing.
 */
function Sprite_ComboGauge()
{
  this.initialize(...arguments);
}

Sprite_ComboGauge.prototype = Object.create(Sprite.prototype);
Sprite_ComboGauge.prototype.constructor = Sprite_ComboGauge;
Sprite_ComboGauge.prototype.initialize = function(cooldownData)
{
  this._j = {};
  this._gauge = {};
  Sprite.prototype.initialize.call(this);
  this.initMembers(cooldownData);
  this.createBitmap();
}

/**
 * Initializes all parameters for this sprite.
 * @param {object} cooldownData The cooldown data for this combo gauge.
 */
Sprite_ComboGauge.prototype.initMembers = function(cooldownData)
{
  this._j._maxUnassigned = true;
  this._j._cooldownData = cooldownData;
  this._j._cooldownMax = 0;
  this._gauge._valueCurrent = 0;
  this._gauge._valueMax = 0;
}

/**
 * Creates the bitmap for this sprite.
 */
Sprite_ComboGauge.prototype.createBitmap = function()
{
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
}

/**
 * Updates this gauge.
 */
Sprite_ComboGauge.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  // don't draw if there isn't a combo available.
  if (!this._j._cooldownData.comboNextActionId)
  {
    this.bitmap.clear();
    return;
  }

  // if this gauge is uninitiated or the user is comboing, reset the max.
  const shouldInitialize = this._j._cooldownData.comboReady && this._j._maxUnassigned;
  const chainComboing = this._gauge._valueMax < this._j._cooldownData.frames;
  if (shouldInitialize || chainComboing)
  {
    this._j._maxUnassigned = false;
    this._gauge._valueMax = JsonEx.makeDeepCopy(this._j._cooldownData.frames);
  }

  // cooldown is ready, combo is no longer available.
  if (this._j._cooldownData.ready)
  {
    this._j._maxUnassigned = true;
    this._gauge._valueMax = 0;
  }
  this.redraw();
}

/**
 * The width of the whole bitmap.
 */
Sprite_ComboGauge.prototype.bitmapWidth = function()
{
  return 32;
}

/**
 * The height of the whole bitmap.
 */
Sprite_ComboGauge.prototype.bitmapHeight = function()
{
  return 20;
}

/**
 * The height of this gauge.
 */
Sprite_ComboGauge.prototype.gaugeHeight = function()
{
  return 10;
}

/**
 * The current value for this gauge.
 */
Sprite_ComboGauge.prototype.currentValue = function()
{
  return this._j._cooldownData.frames;
}

/**
 * The max value for this gauge.
 * @returns {number}
 */
Sprite_ComboGauge.prototype.currentMaxValue = function()
{
  return this._gauge._valueMax;
}

/**
 * OVERWRITE
 * Rescopes `this` to point to the `Sprite_MapGauge` intead of the base
 * `Sprite_Gauge`. Otherwise, this is identical to the base `Sprite_Gauge.redraw()`.
 */
Sprite_ComboGauge.prototype.redraw = function()
{
  this.bitmap.clear();
  const currentValue = this.currentValue();
  if (!isNaN(currentValue))
  {
    this.drawGauge();
  }
}

Sprite_ComboGauge.prototype.gaugeColor1 = function()
{
  return "rgba(0, 0, 255, 1)";
};

Sprite_ComboGauge.prototype.gaugeColor2 = function()
{
  return "rgba(0, 255, 0, 1)";
};

Sprite_ComboGauge.prototype.gaugeBackColor = function()
{
  return "rgba(0, 0, 0, 0.5)";
};

Sprite_ComboGauge.prototype.isValid = function()
{
  if (this.currentMaxValue())
  {
    return true;
  }
  else
  {
    return false;
  }
}

Sprite_ComboGauge.prototype.drawGauge = function()
{
  const gaugeX = 0;
  const gaugeY = this.bitmapHeight() - this.gaugeHeight();
  const gaugewidth = this.bitmapWidth() - gaugeX;
  const gaugeHeight = this.gaugeHeight();
  this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
}

Sprite_ComboGauge.prototype.drawGaugeRect = function(x, y, width, height)
{
  const rate = this.gaugeRate();
  const fillW = Math.floor((width - 2) * rate);
  const fillH = height - 2;
  this.bitmap.fillRect(x, y, width, height, this.gaugeBackColor());
  this.bitmap.gradientFillRect(
    x + 1, y + 1,
    fillW, fillH,
    this.gaugeColor1(), this.gaugeColor2());
}

Sprite_ComboGauge.prototype.gaugeRate = function()
{
  if (this.isValid())
  {
    const value = this.currentValue();
    const maxValue = this.currentMaxValue();
    return maxValue > 0 ? value / maxValue : 0;
  }
  else
  {
    return 0;
  }
}
//#endregion

//#region Sprite_CooldownTimer
/**
 * A sprite that displays a timer representing the cooldown time for a JABS action.
 */
function Sprite_CooldownTimer()
{
  this.initialize(...arguments);
}

Sprite_CooldownTimer.prototype = Object.create(Sprite.prototype);
Sprite_CooldownTimer.prototype.constructor = Sprite_CooldownTimer;
Sprite_CooldownTimer.prototype.initialize = function(skillType, cooldownData, isItem = false)
{
  Sprite.prototype.initialize.call(this);
  this.initMembers(skillType, cooldownData, isItem);
  this.loadBitmap();
}

/**
 * Initializes the properties associated with this sprite.
 * @param {string} skillType The slot that this skill maps to.
 * @param {object} cooldownData The cooldown data associated with this cooldown sprite.
 * @param {boolean} isItem Whether or not this cooldown timer is for an item.
 */
Sprite_CooldownTimer.prototype.initMembers = function(skillType, cooldownData, isItem)
{
  this._j = {};
  this._j._skillType = skillType;
  this._j._cooldownData = cooldownData;
  this._j._isItem = isItem;
}

/**
 * Loads the bitmap into the sprite.
 */
Sprite_CooldownTimer.prototype.loadBitmap = function()
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

Sprite_CooldownTimer.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  this.updateCooldownText();
}

Sprite_CooldownTimer.prototype.updateCooldownText = function()
{
  this.bitmap.clear();
  let baseCooldown = (this._j._cooldownData.frames / 60).toFixed(1);
  if (typeof baseCooldown === 'undefined')
  {
    baseCooldown = 0;
  }

  let cooldownBaseText = baseCooldown > 0
    ? baseCooldown
    : "✔";
  let cooldownComboText = (cooldownBaseText > 0 && this._j._cooldownData.comboNextActionId != 0)
    ? "COMBO!"
    : "❌";

  this.bitmap.drawText(
    cooldownBaseText,
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
  this.bitmap.fontSize = this.fontSize() - 8;
  this.bitmap.fontItalic = true;
  this.bitmap.drawText(
    cooldownComboText,
    0, this.fontSize(),
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.fontItalic = false;

}

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_CooldownTimer.prototype.bitmapWidth = function()
{
  return 40;
}

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_CooldownTimer.prototype.bitmapHeight = function()
{
  return this.fontSize() * 3;
}

/**
 * Determines the font size for text in this sprite.
 */
Sprite_CooldownTimer.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() - 10;
}

/**
 * determines the font face for text in this sprite.
 */
Sprite_CooldownTimer.prototype.fontFace = function()
{
  return $gameSystem.numberFontFace();
}
//#endregion

//#region Sprite_MapGauge
/**
 * The sprite for displaying a gauge over a character's sprite.
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

  // noinspection JSUnresolvedFunction
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

//#region RPG objects
//#region RPG data
//#region RPG_ClassLearning
/**
 * A class representing a single learning of a skill for a class from the database.
 */
class RPG_ClassLearning
{
  //#region properties
  /**
   * The level that the owning class will learn the given skill.
   * @type {number}
   */
  level = 0;

  /**
   * The skill to be learned when the owning class reaches the given level.
   * @type {number}
   */
  skillId = 0;

  /**
   * The note data for this given learning.
   * @type {string}
   */
  note = String.empty;
  //#endregion properties

  /**
   * Constructor.
   * @param {rm.types.ClassLearning} learning The class learning to parse.
   */
  constructor(learning)
  {
    // map the database data to this object.
    this.level = learning.level;
    this.skillId = learning.skillId;
    this.note = learning.note;
  };
}
//#endregion RPG_ClassLearning

//#region RPG_DropItem
/**
 * A class representing a single drop item of an enemy from the database.
 */
class RPG_DropItem
{
  //#region properties
  /**
   * The id of the underlying item's entry in the database.
   * @type {number}
   */
  dataId = 0;

  /**
   * The drop chance value numeric field in the database.
   * @type {number}
   */
  denominator = 0;

  /**
   * The type of drop this is:
   * 0 being item, 1 being weapon, 2 being armor.
   * @type {number}
   */
  kind = 0;
  //#endregion properties

  /**
   * Constructor.
   * @param {RPG_EnemyDropItem} enemyDropItem The drop item to parse.
   */
  constructor(enemyDropItem)
  {
    // map the enemy drop to this object.
    this.dataId = enemyDropItem.dataId;
    this.denominator = enemyDropItem.denominator;
    this.kind = enemyDropItem.kind;
  };
}
//#endregion RPG_DropItem

//#region RPG_EnemyAction
/**
 * A class representing a single enemy action from the database.
 */
class RPG_EnemyAction
{
  //#region properties
  /**
   * The first parameter of the condition configuration.
   * @type {number}
   */
  conditionParam1 = 0;

  /**
   * The second parameter of the condition configuration.
   * @type {number}
   */
  conditionParam2 = 0;

  /**
   * The type of condition it is.
   * @type {number}
   */
  conditionType = 0;

  /**
   * The weight or rating that this enemy will execute this skill.
   * @type {number}
   */
  rating = 5;

  /**
   * The skill id associated with the action.
   * @type {number}
   */
  skillId = 1;
  //endregion properties

  /**
   * Constructor.
   * @param {RPG_EnemyAction} enemyAction The action to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(enemyAction, index)
  {
    this.conditionParam1 = enemyAction.conditionParam1;
    this.conditionParam2 = enemyAction.conditionParam2;
    this.conditionType = enemyAction.conditionType;
    this.rating = enemyAction.rating;
    this.skillId = enemyAction.skillId;
  };
}
//#endregion RPG_EnemyAction

//#region RPG_SkillDamage
/**
 * The damage data for the skill, such as the damage formula or associated element.
 */
class RPG_SkillDamage
{
  //#region properties
  /**
   * Whether or not the damage can produce a critical hit.
   * @type {boolean}
   */
  critical = false;

  /**
   * The element id associated with this damage.
   * @type {number}
   */
  elementId = -1;

  /**
   * The formula to be evaluated in real time to determine damage.
   * @type {string}
   */
  formula = String.empty;

  /**
   * The damage type this is, such as HP damage or MP healing.
   * @type {1|2|3|4|5|6}
   */
  type = 1;

  /**
   * The % of variance this damage can have.
   * @type {number}
   */
  variance = 0;
  //#endregion properties

  /**
   * Constructor.
   * Maps the skill's damage properties into this object.
   * @param {rm.types.Damage} damage The original damage object to map.
   */
  constructor(damage)
  {
    this.critical = damage.critical;
    this.elementId = damage.elementId;
    this.formula = damage.formula;
    this.type = damage.type;
    this.variance = damage.variance;
  };
}
//#endregion RPG_SkillDamage

//#region RPG_Trait
/**
 * A class representing a single trait living on one of the many types
 * of database classes that leverage traits.
 */
class RPG_Trait
{
  /**
   * The code that designates what kind of trait this is.
   * @type {number}
   */
  code = 0;

  /**
   * The identifier that further defines the trait.
   * Data type and usage depends on the code.
   * @type {number}
   */
  dataId = 0;

  /**
   * The value of the trait, for traits that have numeric values.
   * Often is a floating point number to represent a percent multiplier.
   * @type {number}
   */
  value = 1.00;

  /**
   * Constructor.
   * @param {rm.types.Trait} trait The trait to parse.
   */
  constructor(trait)
  {
    this.code = trait.code;
    this.dataId = trait.dataId;
    this.value = trait.value;
  };
}
//#endregion RPG_Trait

//#region RPG_UsableEffect
/**
 * A class representing a single effect on an item or skill from the database.
 */
class RPG_UsableEffect
{
  //#region properties
  /**
   * The type of effect this is.
   * @type {number}
   */
  code = 0;

  /**
   * The dataId further defines what type of effect this is.
   * @type {number}
   */
  dataId = 0;

  /**
   * The first value parameter of the effect.
   * @type {number}
   */
  value1 = 0;

  /**
   * The second value parameter of the effect.
   * @type {number}
   */
  value2 = 0;
  //#endregion properties

  /**
   * Constructor.
   * @param {rm.types.Effect} effect The effect to parse.
   */
  constructor(effect)
  {
    // map the data.
    this.code = effect.code;
    this.dataId = effect.dataId;
    this.value1 = effect.value1;
    this.value2 = effect.value2;
  };
}
//#endregion RPG_UsableEffect
//#endregion RPG data

//#region RPG base classes
//#region RPG_Base
/**
 * A class representing the foundation of all database objects.
 * In addition to doing all the things that a database object normally does,
 * there are now some useful helper functions available for meta and note access,
 * and additionally a means to access the original database object directly in case
 * there are other things that aren't supported by this class that need accessing.
 */
class RPG_Base
{
  //#region properties
  /**
   * The original object that this data was built from.
   * @type {any}
   */
  #original = null;

  /**
   * The index of this entry in the database.
   * @type {number}
   */
  #index = 0;

  /**
   * The entry's id in the database.
   */
  id = 0;

  /**
   * The `meta` object of this skill, containing a dictionary of
   * key value pairs translated from this skill's `note` object.
   * @type {Record<string, string|number|boolean|any>}
   */
  meta = {};

  /**
   * The entry's name.
   */
  name = String.empty;

  /**
   * The note field of this entry in the database.
   * @type {string}
   */
  note = String.empty;
  //#endregion properties

  /**
   * Constructor.
   * Maps the base item's properties into this object.
   * @param {any} baseItem The underlying database object.
   * @param {number} index The index of the entry in the database.
   */
  constructor(baseItem, index)
  {
    this.#original = baseItem;
    this.#index = index;

    // map the core data that all database objects have.
    this.id = baseItem.id;
    this.meta = baseItem.meta;
    this.name = baseItem.name;
    this.note = baseItem.note;
  };

  /**
   * Retrieves the index of this entry in the database.
   * @returns {number}
   */
  _index()
  {
    return this.#index;
  };

  /**
   * Retrieves the original underlying data that was passed to this
   * wrapper from the database.
   * @returns {any}
   */
  _original()
  {
    return this.#original;
  };

  /**
   * Creates a new instance of this wrapper class with all the same
   * database data that this one contains.
   * @returns {this}
   */
  _clone()
  {
    // generate a new instance with the same data as the original.
    const clone = new this.constructor(this._original(), this._index());

    // check if there is an underlying _j data point.
    if (this._j)
    {
      // clone that too if it exists.
      clone._j = this._j;
    }

    // return the newly created copy.
    return clone;
  };

  //#region meta
  /**
   * Gets the metadata of a given key from this skill as whatever value RMMZ stored it as.
   * Only returns null if there was no underlying data associated with the provided key.
   * @param {string} key The key to the metadata.
   * @returns {any|null} The value as RMMZ translated it, or null if the value didn't exist.
   */
  metadata(key)
  {
    // pull the metadata of a given key.
    const result = this.#getMeta(key);

    // check if we have a result.
    if (result)
    {
      // return that result.
      return result;
    }

    console.warn(`key yielded no auto-parsed metadata: ${key}`);
    return null;
  };

  /**
   * Gets the value of the given key from this entry's meta object.
   * @param key
   * @returns {string|number|boolean|*}
   */
  #getMeta(key)
  {
    return this.meta[key];
  }

  /**
   * Gets the metadata of a given key from this entry as a string.
   * Only returns `null` if there was no underlying data associated with the provided key.
   * @param {string} key The key to the metadata.
   * @returns {boolean|null} The value as a string, or null if the value didn't exist.
   */
  metaAsString(key)
  {
    // grab the metadata for this skill.
    const fromMeta = this.#getMeta(key);

    // check to make sure we actually got a value.
    if (fromMeta)
    {
      // return the stringified value.
      return fromMeta.toString();
    }

    return null;
  };

  /**
   * Gets the metadata of a given key from this skill as a number.
   * Only returns `null` if the underlying data wasn't a number or numeric string.
   * @param {string} key The key to the metadata.
   * @returns {boolean|null} The number value, or null if the number wasn't valid.
   */
  metaAsNumber(key)
  {
    // grab the metadata for this skill.
    const fromMeta = this.#getMeta(key);

    // check to make sure we actually got a value.
    if (fromMeta)
    {
      // return the parsed and possibly floating point value.
      return parseFloat(fromMeta);
    }

    return null;
  };

  /**
   * Gets the metadata of a given key from this skill as a boolean.
   * Only returns `null` if the underlying data wasn't a truthy or falsey value.
   * @param {string} key The key to the metadata.
   * @returns {boolean|null} True if the value was true, false otherwise; or null if invalid.
   */
  metaAsBoolean(key)
  {
    // grab the metadata for this skill.
    const fromMeta = this.#getMeta(key);

    // check to make sure we actually got a value.
    if (fromMeta)
    {
      // check if the value was a truthy value.
      if (fromMeta === true || fromMeta.toLowerCase() === "true")
      {
        return true;
      }
      // check if the value was a falsey value.
      else if (fromMeta === false || fromMeta.toLowerCase() === "false")
      {
        return false;
      }
    }

    return null;
  };

  /**
   * Retrieves the metadata for a given key on this skill.
   * This is mostly designed for providing intellisense.
   * @param key
   * @returns {null|*}
   */
  metaAsObject(key)
  {
    // grab the metadata for this skill.
    const fromMeta = this.metadata(key);

    // check to make sure we actually got a value.
    if (fromMeta)
    {
      // parse out the underlying data.
      return this.#parseObject(fromMeta);
    }

    return null;
  };

  /**
   * Parses a object into whatever its given data type is.
   * @param {any} obj The unknown object to parse.
   * @returns {any}
   */
  #parseObject(obj)
  {
    // check if the object to parse is a string.
    if (typeof obj === "string")
    {
      // check if the string is an unparsed array.
      if (obj.startsWith("[") && obj.endsWith("]"))
      {
        // expose the stringified segments of the array.
        const exposedArray = obj
          // peel off the outer brackets.
          .slice(1, obj.length-1)
          // split string into an array by comma or space+comma.
          .split(/, |,/);
        return this.#parseObject(exposedArray);
      }

      // no check for special string values.
      return this.#parseString(obj);
    }

    // check if the object to parse is a collection.
    if (Array.isArray(obj))
    {
      // iterate over the array and parse each item.
      return obj.map(this.#parseObject, this);
    }

    // number, boolean, or otherwise unidentifiable object.
    return obj;
  };

  /**
   * Parses a metadata object from a string into possibly a boolean or number.
   * If the conversion to those fail, then it'll proceed as a string.
   * @param {string} str The string object to parse.
   * @returns {boolean|number|string}
   */
  #parseString(str)
  {
    // check if its actually boolean true.
    if (str.toLowerCase() === "true") return true;
    // check if its actually boolean false.
    else if (str.toLowerCase() === "false") return false;

    // check if its actually a number.
    if (!isNaN(parseFloat(str))) return parseFloat(str);

    // it must just be a word or something.
    return str;
  };
  //#endregion meta

  //#region note
  /**
   * Gets the note data of this baseitem split into an array by `\r\n`.
   * If this baseitem has no note data, it will return an empty array.
   * @returns {string[]|null} The value as RMMZ translated it, or null if the value didn't exist.
   */
  notedata()
  {
    // pull the note data of this baseitem.
    const fromNote = this.#formattedNotedata();

    // checks if we have note data.
    if (fromNote)
    {
      // return the note data as an array of strings.
      return fromNote;
    }

    // if we returned no data from this baseitem, then return an empty array.
    return [];
  };

  /**
   * Returns a formatted array of strings as output from the note data of this baseitem.
   * @returns {string[]}
   */
  #formattedNotedata()
  {
    // split the notes by new lines.
    const formattedNotes = this.note.split(/[\r\n]+/);

    // check if the note was actually empty and we got a false positive.
    if (formattedNotes.length === 1 && formattedNotes[0] === "")
    {
      // return null instead.
      return null;
    }

    // return our array of notes!
    return formattedNotes;
  };

  /**
   * Gets an accumulated numeric value based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is an integer value,
   * and adds all values together from each line in the notes that match the provided
   * regex structure.
   *
   * If the optional flag `nullIfEmpty` receives true passed in, then the result of
   * this will be `null` instead of the default 0 as an indicator we didn't find
   * anything from the notes of this skill.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} nullIfEmpty Whether or not to return 0 if not found, or null.
   * @returns {number|null} The combined value added from the notes of this object, or zero/null.
   */
  getNumberFromNotesByRegex(structure, nullIfEmpty = false)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

    // initialize the value.
    let val = 0;

    // default to not having a match.
    let hasMatch = false;

    // iterate the note data array.
    fromNote.forEach(note =>
    {
      // check if this line matches the given regex structure.
      if (note.match(structure))
      {
        // parse the value out of the regex capture group.
        val += parseFloat(RegExp.$1);

        // flag that we found a match.
        hasMatch = true;
      }
    });

    // check if we didn't find a match, and we want null instead of empty.
    if (!hasMatch && nullIfEmpty)
    {
      // return null.
      return null;
    }
    // we want zero or the found value.
    else
    {
      // return the found value.
      return val;
    }
  };

  /**
   * Gets the last string value based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is a string value.
   * If multiple tags are found, only the last one will be returned.
   *
   * If the optional flag `nullIfEmpty` receives true passed in, then the result of
   * this will be `null` instead of the default empty string as an indicator we didn't find
   * anything from the notes of this skill.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} nullIfEmpty Whether or not to return an empty string if not found, or null.
   * @returns {number|null} The found value from the notes of this object, or empty/null.
   */
  getStringFromNotesByRegex(structure, nullIfEmpty = false)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

    // initialize the value.
    let val = String.empty;

    // default to not having a match.
    let hasMatch = false;

    // iterate the note data array.
    fromNote.forEach(note =>
    {
      // check if this line matches the given regex structure.
      if (note.match(structure))
      {
        // parse the value out of the regex capture group.
        val = RegExp.$1;

        // flag that we found a match.
        hasMatch = true;
      }
    });

    // check if we didn't find a match, and we want null instead of empty.
    if (!hasMatch && nullIfEmpty)
    {
      // return null.
      return null;
    }
    // we want an empty string or the found value.
    else
    {
      // return the found value.
      return val;
    }
  };

  /**
   * Gets whether or not there is a matching regex tag on this skill.
   *
   * Do be aware of the fact that with this type of tag, we are checking only
   * for existence, not the value. As such, it will be `true` if found, and `false` if
   * not, which may not be accurate. Pass `true` to the `nullIfEmpty` to obtain a
   * `null` instead of `false` when missing, or use a string regex pattern and add
   * something like `<someKey:true>` or `<someKey:false>` for greater clarity.
   *
   * This accepts a regex structure, but does not leverage a capture group.
   *
   * If the optional flag `nullIfEmpty` receives true passed in, then the result of
   * this will be `null` instead of the default `false` as an indicator we didn't find
   * anything from the notes of this skill.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} nullIfEmpty Whether or not to return `false` if not found, or null.
   * @returns {boolean|null} The found value from the notes of this object, or empty/null.
   */
  getBooleanFromNotesByRegex(structure, nullIfEmpty = false)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

    // initialize the value.
    let val = false;

    // default to not having a match.
    let hasMatch = false;

    // iterate the note data array.
    fromNote.forEach(note =>
    {
      // check if this line matches the given regex structure.
      if (note.match(structure))
      {
        // parse the value out of the regex capture group.
        val = true;

        // flag that we found a match.
        hasMatch = true;
      }
    });

    // check if we didn't find a match, and we want null instead of empty.
    if (!hasMatch && nullIfEmpty)
    {
      // return null.
      return null;
    }
    // we want a "false" or the found value.
    else
    {
      // return the found value.
      return val;
    }
  };

  /**
   * Gets an accumulated numeric value based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is an array of values
   * all wrapped in hard brackets [].
   *
   * If the optional flag `tryParse` is true, then it will attempt to parse out
   * the array of values as well, including translating strings to numbers/booleans
   * and keeping array structures all intact.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} tryParse Whether or not to attempt to parse the found array.
   * @returns {any[]|null} The array from the notes, or null.
   */
  getArrayFromNotesByRegex(structure, tryParse = true)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

    // initialize the value.
    let val = null;

    // default to not having a match.
    let hasMatch = false;

    // iterate the note data array.
    fromNote.forEach(note =>
    {
      // check if this line matches the given regex structure.
      if (note.match(structure))
      {
        // parse the value out of the regex capture group.
        val = RegExp.$1;

        // flag that we found a match.
        hasMatch = true;
      }
    });

    // if we didn't find a match, return null instead of attempting to parse.
    if (!hasMatch) return null;

    // check if we're going to attempt to parse it, too.
    if (tryParse)
    {
      // attempt the parsing.
      val = this.#parseObject(val);
    }

    // return the found value.
    return val;
  };
  //#endregion note
}
//#endregion RPG_Base

//#region RPG_BaseItem
class RPG_BaseItem extends RPG_Base
{
  /**
   * The description of this entry.
   * @type {string}
   */
  description = String.empty;

  /**
   * The icon index of this entry.
   * @type {number}
   */
  iconIndex = 0;

  /**
   * Constructor.
   * Maps the base item's properties into this object.
   * @param {any} baseItem The underlying database object.
   * @param {number} index The index of the entry in the database.
   */
  constructor(baseItem, index)
  {
    // perform original logic.
    super(baseItem, index);

    // map the additional description and iconIndex as well for all base items.
    this.description = baseItem.description;
    this.iconIndex = baseItem.iconIndex;
  };
}
//#endregion RPG_BaseItem

//#region RPG_TraitItem
/**
 * A class representing a BaseItem from the database, but with traits.
 */
class RPG_TraitItem extends RPG_BaseItem
{
  /**
   * A collection of all traits this item possesses.
   * @type {RPG_Trait[]}
   */
  traits = [];

  /**
   * Constructor.
   * Maps the base item's traits into this object.
   * @param {RPG_BaseItem} baseItem The underlying database object.
   * @param {number} index The index of the entry in the database.
   */
  constructor(baseItem, index)
  {
    // perform original logic.
    super(baseItem, index);

    // map the base item's traits.
    this.traits = baseItem.traits.map(trait => new RPG_Trait(trait));
  };
}
//#endregion RPG_TraitItem

//#region RPG_EquipItem
/**
 * A base class representing containing common properties found in both
 * weapons and armors.
 */
class RPG_EquipItem extends RPG_TraitItem
{
  //#region properties
  /**
   * The type of equip this is.
   * This number is the index that maps to your equip types.
   * @type {number}
   */
  etypeId = 1;

  /**
   * The core parameters that all battlers have:
   * MHP, MMP, ATK, DEF, MAT, MDF, SPD, LUK,
   * in that order.
   * @type {[number, number, number, number, number, number, number, number]}
   */
  params = [1, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The price of this equip.
   * @type {number}
   */
  price = 0;
  //#endregion properties

  /**
   * Constructor.
   * @param {RPG_EquipItem} equip The equip to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(equip, index)
  {
    // supply the base class params.
    super(equip, index);

    // map the data.
    this.etypeId = equip.etypeId;
    this.params = equip.params;
    this.price = equip.price;
  };
}
//#endregion RPG_EquipItem

//#region RPG_UsableItem
/**
 * A class representing the base properties for any usable item or skill
 * from the database.
 */
class RPG_UsableItem extends RPG_BaseItem
{
  //#region properties
  /**
   * The animation id to execute for this skill.
   * @type {number}
   */
  animationId = -1;

  /**
   * The damage data for this skill.
   * @type {RPG_SkillDamage}
   */
  damage = null;

  /**
   * The various effects of this skill.
   * @type {RPG_UsableEffect[]}
   */
  effects = [];

  /**
   * The hit type of this skill.
   * @type {number}
   */
  hitType = 0;

  /**
   * The occasion type when this skill can be used.
   * @type {number}
   */
  occasion = 0;

  /**
   * The number of times this skill repeats.
   * @type {number}
   */
  repeats = 1;

  /**
   * The scope of this skill.
   * @type {number}
   */
  scope = 0;

  /**
   * The speed bonus of this skill.
   * @type {number}
   */
  speed = 0;

  /**
   * The % chance of success for this skill.
   * @type {number}
   */
  successRate = 100;

  /**
   * The amount of TP gained from executing this skill.
   * @type {number}
   */
  tpGain = 0;
  //#endregion properties

  /**
   * Constructor.
   * @param {rm.types.UsableItem} usableItem The usable item to parse.
   * @param {number} index The index of the skill in the database.
   */
  constructor(usableItem, index)
  {
    // supply the base class params.
    super(usableItem, index);

    // map the data.
    this.animationId = usableItem.animationId;
    this.damage = new RPG_SkillDamage(usableItem.damage);
    this.effects = usableItem.effects.map(effect => new RPG_UsableEffect(effect));
    this.hitType = usableItem.hitType;
    this.occasion = usableItem.occasion;
    this.repeats = usableItem.repeats;
    this.scope = usableItem.scope;
    this.speed = usableItem.speed;
    this.successRate = usableItem.successRate;
    this.tpGain = usableItem.tpGain;
  };
}
//#endregion RPG_UsableItem

//#region RPG_BaseBattler
/**
 * A class representing the groundwork for what all battlers
 * database data look like.
 */
class RPG_BaseBattler extends RPG_Base
{
  /**
   * The name of the battler while in battle.
   * @type {string}
   */
  battlerName = String.empty;

  /**
   * The collection of traits this battler has.
   * @type {RPG_Trait[]}
   */
  traits = [];

  /**
   * Constructor.
   * Maps the base battler data to the properties on this class.
   * @param {RPG_Enemy|rm.types.Actor} battler The battler to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(battler, index)
  {
    // perform original logic.
    super(battler, index);

    // map core battler data onto this object.
    this.battlerName = battler.battlerName;
    this.traits = battler.traits
      .map(trait => new RPG_Trait(trait));
  };
}
//#endregion RPG_BaseBattler
//#endregion RPG base classes

//#region RPG implementations
//#region RPG_Actor
/**
 * A class representing a single actor battler's data from the database.
 */
class RPG_Actor extends RPG_BaseBattler
{
  //#region properties
  /**
   * The index of the character sprite of the battler
   * on the spritesheet.
   * @type {number}
   */
  characterIndex = 0;

  /**
   * The name of the file that the character sprite
   * resides within.
   * @type {string}
   */
  characterName = String.empty;

  /**
   * The id of the class that this actor currently is.
   * @type {number}
   */
  classId = 0;

  /**
   * The ids of the equipment in the core equips slots
   * of the actors from the database.
   * @type {number[]}
   */
  equips = [0, 0, 0, 0, 0];

  /**
   * The index of the face sprite of this battler on
   * the spritesheet.
   * @type {number}
   */
  faceIndex = 0;

  /**
   * The name of the file that the face sprite resides
   * within.
   * @type {string}
   */
  faceName = String.empty;

  /**
   * The starting level for this actor in the database.
   * @type {number}
   */
  initialLevel = 1;

  /**
   * The maximum level of this actor from the database.
   * @type {number}
   */
  maxLevel = 99;

  /**
   * The nickname of this actor from the database.
   * @type {string}
   */
  nickName = String.empty;

  /**
   * The profile multiline text for this actor in the database.
   * @type {string}
   */
  profile = String.empty;
  //#endregion properties

  /**
   * Constructor.
   * @param {rm.types.Actor} actor The actor to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(actor, index)
  {
    // supply parameters to base class.
    super(actor, index);

    // map the data.
    this.initMembers(actor)
  };

  /**
   * Maps the data from the JSON to this object.
   * @param {rm.types.Actor} actor The actor to parse.
   */
  initMembers(actor)
  {
    // map actor-specific battler properties.
    this.characterIndex = actor.characterIndex;
    this.characterName = actor.characterName;
    this.classId = actor.classId;
    this.equips = actor.equips;
    this.faceIndex = actor.faceIndex;
    this.faceName = actor.faceName;
    this.initialLevel = actor.initialLevel;
    this.maxLevel = actor.maxLevel;
    this.nickName = actor.nickname;
    this.profile = actor.profile;
  };
}
//#endregion RPG_Actor

//#region RPG_Armor
/**
 * A class representing a single armor from the database.
 */
class RPG_Armor extends RPG_EquipItem
{
  //#region properties
  /**
   * The type of armor this is.
   * This number is the index that maps to your armor types.
   * @type {number}
   */
  atypeId = 1;
  //#endregion properties

  /**
   * Constructor.
   * @param {rm.types.Armor} armor The armor to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(armor, index)
  {
    // supply the base class params.
    super(armor, index);

    // map the data.
    this.atypeId = armor.atypeId;
  };
}
//#endregion RPG_Armor

//#region RPG_Class
/**
 * A class representing a RPG-relevant class from the database.
 */
class RPG_Class extends RPG_Base
{
  //#region properties
  /**
   * The four data points that comprise the EXP curve for this class.
   * @type {[number, number, number, number]}
   */
  expParams = [0, 0, 0, 0];

  /**
   * A collection of skill learning data points for this class.
   * @type {RPG_ClassLearning[]}
   */
  learnings = [];

  /**
   * A multi-dimensional array of the core parameters that all battlers have:
   * MHP, MMP, ATK, DEF, MAT, MDF, SPD, LUK,
   * in that order, but for all 100 of the base levels.
   * @type {[number, number, number, number, number, number, number, number]}
   */
  params = [[1], [0], [0], [0], [0], [0], [0], [0]];

  /**
   * A collection of traits this class has.
   * @type {RPG_Trait[]}
   */
  traits = [];
  //#endregion properties

  /**
   * Constructor.
   * @param {rm.types.RPGClass} classData The class data to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(classData, index)
  {
    // perform original logic.
    super(classData, index);

    // map the class data to this object.
    this.expParams = classData.expParams;
    this.learnings = classData.learnings
      .map(learning => new RPG_ClassLearning(learning));
    this.params = classData.params;
    this.traits = classData.traits
      .map(trait => new RPG_Trait(trait));
  };
}
//#endregion RPG_Class

//#region RPG_Enemy
/**
 * A class representing a single enemy battler's data from the database.
 */
class RPG_Enemy extends RPG_BaseBattler
{
  //#region properties
  /**
   * A collection of all actions that an enemy has assigned from the database.
   * @type {RPG_EnemyAction[]}
   */
  actions = [];

  /**
   * The -255-0-255 hue of the battler sprite.
   * @type {number}
   */
  battlerHue = 0;

  /**
   * A collection of all drop items this enemy can drop.
   * @type {RPG_DropItem[]}
   */
  dropItems = [];

  /**
   * The base amount of experience this enemy grants upon defeat.
   * @type {number}
   */
  exp = 0;

  /**
   * The base amount of gold this enemy grants upon defeat.
   * @type {number}
   */
  gold = 0;

  /**
   * The core parameters that all battlers have:
   * MHP, MMP, ATK, DEF, MAT, MDF, SPD, LUK,
   * in that order.
   * @type {[number, number, number, number, number, number, number, number]}
   */
  params = [1, 0, 0, 0, 0, 0, 0, 0];
  //#endregion properties

  /**
   * Constructor.
   * @param {RPG_Enemy} enemy The enemy to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(enemy, index)
  {
    // supply the base class params.
    super(enemy, index);

    // map the data.
    this.initMembers(enemy);
  };

  /**
   * Maps the data from the JSON to this object.
   * @param {RPG_Enemy} enemy The enemy to parse.
   */
  initMembers(enemy)
  {
    // map the data.
    this.actions = enemy.actions
      .map(enemyAction => new RPG_EnemyAction(enemyAction));
    this.battlerHue = enemy.battlerHue;
    this.dropItems = enemy.dropItems
      .map(dropItem => new RPG_DropItem(dropItem));
    this.exp = enemy.exp;
    this.gold = enemy.gold;
    this.params = enemy.params;
  };
}
//#endregion RPG_Enemy

//#region RPG_Item
/**
 * A class representing a single item entry from the database.
 */
class RPG_Item extends RPG_UsableItem
{
  //#region properties
  /**
   * Whether or not this item is removed after using it.
   * @type {boolean}
   */
  consumable = true;

  /**
   * The type of item this is:
   * 0 for regular item, 1 for key item, 2 for hiddenA, 3 for hiddenB.
   * @type {number}
   */
  itypeId = 1;

  /**
   * The price of this item.
   * @type {number}
   */
  price = 0;
  //#endregion properties

  /**
   * Constructor.
   * @param {rm.types.Item} item The item to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(item, index)
  {
    // supply the base class params.
    super(item, index);

    // map the data.
    this.consumable = item.consumable;
    this.itypeId = item.itypeId;
    this.price = item.price;
  };
}
//#endregion RPG_Item

//#region RPG_Skill
/**
 * An class representing a single skill from the database.
 */
class RPG_Skill extends RPG_UsableItem
{
  //#region properties
  /**
   * The first line of the message for this skill.
   * @type {string}
   */
  message1 = String.empty;

  /**
   * The second line of the message for this skill.
   * @type {string}
   */
  message2 = String.empty;

  /**
   * The type of message for this skill.
   * @type {number}
   */
  messageType = 0;

  /**
   * The amount of MP required to execute this skill.
   * @type {number}
   */
  mpCost = 0;

  /**
   * The first of two required weapon types to be equipped to execute this skill.
   * @type {number}
   */
  requiredWtypeId1 = 0;

  /**
   * The second of two required weapon types to be equipped to execute this skill.
   * @type {number}
   */
  requiredWtypeId2 = 0;

  /**
   * The skill type that this skill belongs to.
   * @type {number}
   */
  stypeId = 0;

  /**
   * The amount of TP required to execute this skill.
   * @type {number}
   */
  tpCost = 0;
  //#endregion properties

  /**
   * Constructor.
   * Maps the skill's properties into this object.
   * @param {rm.types.Skill} skill The underlying skill object.
   * @param {number} index The index of the skill in the database.
   */
  constructor(skill, index)
  {
    // supply the base class params.
    super(skill, index);

    // map the data.
    this.initMembers(skill);
  };

  /**
   * Maps all the data from the JSON to this object.
   * @param {rm.types.Skill} skill The underlying skill object.
   */
  initMembers(skill)
  {
    // map the data.
    this.message1 = skill.message1;
    this.message2 = skill.message2;
    this.messageType = skill.messageType;
    this.mpCost = skill.mpCost;
    this.requiredWtypeId1 = skill.requiredWtypeId1;
    this.requiredWtypeId2 = skill.requiredWtypeId2;
    this.stypeId = skill.stypeId;
    this.tpCost = skill.tpCost;
  };
}
//#endregion RPG_Skill

//#region RPG_State
/**
 * An class representing a single state from the database.
 */
class RPG_State extends RPG_TraitItem
{
  //#region properties
  /**
   * The automatic removal timing.
   * @type {0|1|2}
   */
  autoRemovalTiming = 0;

  /**
   * The percent chance that receiving damage will remove this state.
   * Requires `removeByDamage` to be true on this state.
   * @type {number}
   */
  chanceByDamage = 100;

  /**
   * OVERWRITE States do not normally have descriptions.
   * Rather than leaving it as `undefined`, lets be nice and keep it
   * an empty string.
   * @type {String.empty}
   */
  description = String.empty;

  /**
   * The maximum number of turns this state will persist.
   * Requires `restriction` to not be 0 to be leveraged.
   * @type {number}
   */
  maxTurns = 1;

  /**
   * "If an actor is inflicted with this state..."
   * @type {string}
   */
  message1 = String.empty;

  /**
   * "If an enemy is inflicted with this state..."
   * @type {string}
   */
  message2 = String.empty;

  /**
   * "If the state persists..."
   * @type {string}
   */
  message3 = String.empty;

  /**
   * "If the state is removed..."
   * @type {string}
   */
  message4 = String.empty;

  /**
   * The type of message this is.
   * (unsure)
   * @type {number}
   */
  messageType = 1;

  /**
   * The minimum number of turns this state will persist.
   * Requires `restriction` to not be 0 to be leveraged.
   * @type {number}
   */
  minTurns = 1;

  /**
   * The motion the sideview battler will take while afflicted
   * with this state.
   * @type {number}
   */
  motion = 0;

  /**
   * The state overlay id that shows on the battler while
   * this state is afflicted.
   * @type {number}
   */
  overlay = 0;

  /**
   * The priority of the skill.
   * @type {number}
   */
  priority = 50;

  /**
   * Whether or not this state will automatically be removed at
   * the end of the battle.
   * @type {boolean}
   */
  removeAtBattleEnd = false;

  /**
   * Whether or not this state can be removed simply by taking damage.
   * Leverages the `chanceByDamage` percent for whether or not to remove.
   * @type {boolean}
   */
  removeByDamage = false;

  /**
   * Whether or not this state can be removed by applying a different state
   * that has a higher `restriction` type.
   * @type {boolean}
   */
  removeByRestriction = false;

  /**
   * Whether or not this state can be removed by taking the `stepsToRemove` number
   * of steps on this state.
   * @type {boolean}
   */
  removeByWalking = false;

  /**
   * The type of restriction this state has.
   * @type {number}
   */
  restriction = 0;

  /**
   * The number of steps to remove this state.
   * Requires `removeByWalking` to be true on this state to be leveraged.
   * @type {number}
   */
  stepsToRemove = 100;
  //#endregion properties

  /**
   * Constructor.
   * Maps the state's properties into this object.
   * @param {rm.types.State} state The underlying state object.
   * @param {number} index The index of the state in the database.
   */
  constructor(state, index)
  {
    // perform original logic.
    super(state, index);

    // map the states's data points 1:1.
    this.autoRemovalTiming = state.autoRemovalTiming;
    this.chanceByDamage = state.chanceByDamage;
    this.maxTurns = state.maxTurns;
    this.message1 = state.message1;
    this.message2 = state.message2;
    this.message3 = state.message3;
    this.message4 = state.message4;
    this.messageType = state.messageType;
    this.minTurns = state.minTurns;
    this.motion = state.motion;
    this.overlay = state.overlay;
    this.priority = state.priority;
    this.removeAtBattleEnd = state.removeAtBattleEnd;
    this.removeByDamage = state.removeByDamage;
    this.removeByRestriction = state.removeByRestriction;
    this.removeByWalking = state.removeByWalking;
    this.restriction = state.restriction;
    this.stepsToRemove = state.stepsToRemove;
  };
}
//#endregion RPG_State

//#region RPG_Weapon
/**
 * A class representing a single weapon from the database.
 */
class RPG_Weapon extends RPG_EquipItem
{
  //#region properties
  /**
   * The animation id for this weapon.
   * @type {number}
   */
  animationId = -1;

  /**
   * The type of weapon this is.
   * This number is the index that maps to your weapon types.
   * @type {number}
   */
  wtypeId = 1;
  //#endregion properties

  /**
   * Constructor.
   * @param {rm.types.Weapon} weapon The weapon to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(weapon, index)
  {
    // supply the base class params.
    super(weapon, index);

    // map the data.
    this.animationId = weapon.animationId;
    this.wtypeId = weapon.wtypeId;
  };
}
//#endregion RPG_Weapon
//#endregion RPG implementations
//#endregion RPG objects
//ENDFILE