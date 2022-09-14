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
  Name: `J-Base`,

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
   * Defines the basic attack skill id.
   * For weapons and enemies, this represents the skill used for attacking.
   * For armor, this does nothing directly- but when used in the context of
   * JAFTING's refinement, it can redefine the skill used when a weapon attacks.
   */
  ATTACK_SKILLID: 35,

  /**
   * Defines the addition/learning of a new skill category/type by means of trait.
   * The `dataId` for this trait represents the skill type id being learned.
   */
  ADD_SKILLTYPE: 41,

  /**
   * Defines the removal/forgetting of a previous skill category/type by means of trait.
   * The `dataId` for this trait represents the skill type id being forgotten.
   */
  SEAL_SKILLTYPE: 42,

  /**
   * Defines the addition/learning of a new skill by means of trait.
   * The `dataId` for this trait represents the skill id being learned.
   */
  ADD_SKILL: 43,

  /**
   * Defines the removal/forgetting of a previous skill by means of trait.
   * The `dataId` for this trait represents the skill id being forgotten.
   */
  SEAL_SKILL: 44,

  /**
   * The `DIVIDER` trait, specifically for JAFTING's refinement functionality.
   */
  NO_DISAPPEAR: 63,
};

/**
 * All regular expressions used by this plugin.
 */
J.BASE.RegExp = {};

/**
 * The definition of what a parsable comment in an event looks like.
 * This enforces a structure that enables the following tags to be valid:
 *  <pre>
 *    <someBooleanKey>
 *    <someKeyWithNumberValue:123>
 *    <someKeyWithArrayAndSingleNumberValue:[123]>
 *    <someKeyWithArrayAndManyNumberValues:[123,456]>
 *    <someKeyWithStringValue:someValue>
 *  </pre>
 * @type {RegExp}
 */
J.BASE.RegExp.ParsableComment = /^<[[\]\w :"',.!+\-*/\\]+>$/i;

/**
 * A collection of all aliased methods for this plugin.
 */
J.BASE.Aliased = {
  AudioManager: new Map(),
  DataManager: new Map(),
  Game_Character: {},
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_Enemy: new Map(),
  Game_Party: new Map(),
  Scene_Load: new Map(),
  SoundManager: new Map(),
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
 * Generates a vastly shorter version of the `uuid`.
 * @returns {string} The `uuid`.
 */
J.BASE.Helpers.shortUuid = function()
{
  return 'xxx-xxx'
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
 * Provides a random integer within the range.
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
 * @returns {RPG_BaseItem} The `RPG::Item` of the correct id and type.
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
 * @param {RPG_BaseItem} referenceData The reference data to parse.
 * @returns {JABS_OnChanceEffect[]}
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
      const skillChance = new JABS_OnChanceEffect(
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
 * Parses a object into whatever its given data type is.
 * @param {any} obj The unknown object to parse.
 * @returns {any|null}
 */
J.BASE.Helpers.parseObject = function(obj)
{
  // do not attempt to parse if the input is null.
  if (obj === null || obj === undefined) return null;

  // check if the object to parse is a string.
  if (typeof obj === "string")
  {
    // check if the string is an unparsed array.
    if (obj.startsWith("[") && obj.endsWith("]"))
    {
      // expose the stringified segments of the array.
      return this.parseArrayFromString(obj);
    }

    // no check for special string values.
    return this.parseString(obj);
  }

  // check if the object to parse is a collection.
  if (Array.isArray(obj))
  {
    // iterate over the array and parse each item.
    return obj.map(this.parseObject, this);
  }

  // number, boolean, or otherwise unidentifiable object.
  return obj;
}

/**
 * Parses a presumed array by peeling off the `[` and `]` and parsing the
 * exposed insides.
 *
 * This does not handle multiple nested arrays properly.
 * @param {string} strArr An string presumed to be an array.
 * @returns {any} The parsed exposed insides of the string array.
 */
J.BASE.Helpers.parseArrayFromString = function(strArr)
{
  // expose the stringified segments of the array.
  const exposedArray = strArr
    // peel off the outer brackets.
    .slice(1, strArr.length-1)
    // split string into an array by comma or space+comma.
    .split(/, |,/);

  // grab the index of any possible inner arrays.
  const innerArrayStartIndex = exposedArray.findIndex(element => element.startsWith("["));

  // check if we found an opening inner array bracket.
  if (innerArrayStartIndex > -1)
  {
    // grab the last closing inner array bracket.
    const outerArrayEndIndex = exposedArray.findLastIndex(element => element.endsWith("]"));

    // slice the array contents that we believe is an inner array.
    const slicedArrayString = exposedArray
      .slice(innerArrayStartIndex, outerArrayEndIndex+1)
      .toString();

    // convert the inner array contents into a proper array.
    const innerArray = this.parseArrayFromString(slicedArrayString);

    // splice the inner array into the original array replacing all elements.
    exposedArray.splice(
      innerArrayStartIndex,
      ((outerArrayEndIndex+1) - innerArrayStartIndex),
      innerArray);
  }

  // with the content exposed, attempt to continue parsing.
  return this.parseObject(exposedArray);
};

/**
 * Parses a metadata object from a string into possibly a boolean or number.
 * If the conversion to those fail, then it'll proceed as a string.
 * @param {string} str The string object to parse.
 * @returns {boolean|number|string}
 */
J.BASE.Helpers.parseString = function(str)
{
  // check if its actually boolean true.
  if (str.toLowerCase() === "true") return true;
  // check if its actually boolean false.
  else if (str.toLowerCase() === "false") return false;

  // check if its actually a number.
  if (!Number.isNaN(parseFloat(str))) return parseFloat(str);

  // it must just be a word or something.
  return str;
}

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
 * @param {undefined|any=} thisArg What represents "this" in the `.forEach()`; defaults to undefined.
 */
Array.iterate = function(times, func, thisArg = undefined)
{
  [...Array(times)].forEach(func, thisArg);
};
//#endregion Helpers