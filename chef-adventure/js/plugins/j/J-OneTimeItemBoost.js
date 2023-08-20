//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 OTIB] Enables items to grant a one time item boost, permanently.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-TpGrowth
 * @help
 * ============================================================================
 * This plugin allows items to grant a permanent one time bonus when used.
 *
 * - One time item boosts affect actors independently.
 * - The effects are triggered instantly upon consuming an item.
 *
 * Use the configuration on the right to pick the items and their boost.
 *
 * NOTE: If multiple entries for a single item id exist, only the first one
 * parsed will be used.
 * ============================================================================
 *
 * @param OTIBs
 * @text Item Boost List
 * @type struct<OneTimeItemBoostStruct>[]
 * @desc A collection of all items that have these one time item boosts on them.
 * @default []
 *
*/
/*~struct~OneTimeItemBoostStruct:
 * @param itemId
 * @type item
 * @text Item
 * @desc The item being consumed that will grant these permanent one time boosts.
 * @default 1
 *
 * @param boosts
 * @type struct<OneTimeItemBoostParamStruct>[]
 * @text Parameter Boosts
 * @desc The collection of all boosts that this item grants once.
 * @default []
 */
/*~struct~OneTimeItemBoostParamStruct:
 * @param parameterId
 * @text Parameter Id
 * @desc 0-7 are core parameters, 8-17 are ex-parameters, 18-27 are sp-parameters.
 * @type number
 * @type select
 * @option Max HP
 * @value 0
 * @option Max MP
 * @value 1
 * @option Max TP
 * @value 28
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
 * @param boost
 * @type number
 * @min -9999999
 * @text Boost Value
 * @desc The value that will be added to this parameter id.
 * If this parameter is ex/sp, then this value will be /= 100.
 * @default 0
 *
 * @param isPercent
 * @type boolean
 * @text Is Percent Boost
 * @desc If this is true, then the boost will be percent.
 * If this is false, then the boost will be flat.
 * @default false
 *
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.OTIB = {};

/**
 * A collection of helpful functions used throughout this plugin.
 */
J.OTIB.Helpers = {};

/**
 * Translates the raw JSON into the OneTimeItemBoosts.
 * @param {JSON} rawJson The raw JSON to translate boosts from.
 * @returns {OneTimeItemBoost[]}
 */
J.OTIB.Helpers.translateOTIBs = rawJson =>
{
  const parsedJsonBlob = JSON.parse(rawJson);
  const oneTimeItemBoosts = [];
  parsedJsonBlob.forEach(rawOneTimeItemBoostBlob =>
  {
    const parsedOneTimeItemBoostBlob = JSON.parse(rawOneTimeItemBoostBlob);
    const parsedItemId = parseInt(parsedOneTimeItemBoostBlob.itemId);

    // if we already have a boost in the list with this itemId, skip it.
    if (oneTimeItemBoosts.findIndex(otib => otib.itemId === parsedItemId) !== -1) return;

    // parse out all boost parameters.
    const parsedBoostsBlob = JSON.parse(parsedOneTimeItemBoostBlob.boosts);
    const parsedBoosts = [];
    parsedBoostsBlob.forEach(rawBoostBlob =>
    {
      const parsedBoostBlob = JSON.parse(rawBoostBlob);
      const boostParam = new OneTimeItemBoostParam(
        parseInt(parsedBoostBlob.parameterId),
        parseFloat(parsedBoostBlob.boost),
        parsedBoostBlob.isPercent === "true"
      );
      parsedBoosts.push(boostParam);
    });

    // create a new OneTimeItemBoost and add it to the collection.
    const parsedOneTimeItemBoost = new OneTimeItemBoost(parsedItemId, parsedBoosts);
    oneTimeItemBoosts.push(parsedOneTimeItemBoost);
  });

  return oneTimeItemBoosts;
};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.OTIB.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-OneTimeItemBoost`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.OTIB.PluginParameters = PluginManager.parameters(J.OTIB.Metadata.Name);
J.OTIB.Metadata = {
  ...J.OTIB.Metadata,
  /**
   * The version of this plugin.
   */
  Version: 1.0,

  /**
   * A collection of all OneTimeItemBonuses from the plugin parameters.
   * @type {OneTimeItemBoost[]}
   */
  OneTimeItemBoosts: J.OTIB.Helpers.translateOTIBs(J.OTIB.PluginParameters["OTIBs"]),
};

/**
 * The collection of all aliased classes for extending.
 */
J.OTIB.Aliased = {
  DataManager: {},
  Game_Actor: new Map(),
  Game_Battler: new Map(),
};
//endregion Introduction

//region OneTimeItemBoost
/**
 * A class representing the permanent data of a one time boost from a single item.
 */
function OneTimeItemBoost()
{
  this.initialize(...arguments);
}

OneTimeItemBoost.prototype = {};
OneTimeItemBoost.prototype.constructor = OneTimeItemBoost;
OneTimeItemBoost.prototype.initialize = function(itemId, parameterData)
{
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
OneTimeItemBoost.prototype.initMembers = function()
{
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
OneTimeItemBoost.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Unlocks this boost.
 */
OneTimeItemBoost.prototype.unlock = function()
{
  this.unlocked = true;
};

/**
 * Locks this boost.
 */
OneTimeItemBoost.prototype.lock = function()
{
  this.unlocked = false;
};
//endregion OneTimeItemBoost

//region OneTimeItemBoostParam
/**
 * A class representing the permanent data of a one time boost from a single item.
 */
function OneTimeItemBoostParam()
{
  this.initialize(...arguments);
}

OneTimeItemBoostParam.prototype = {};
OneTimeItemBoostParam.prototype.constructor = OneTimeItemBoostParam;
OneTimeItemBoostParam.prototype.initialize = function(paramId, boost, isPercent)
{
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
//endregion OneTimeItemBoostParam

//region DataManager
/**
 * Update save data with new plugin metadata.
 */
J.OTIB.Aliased.DataManager.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  contents.actors._data.forEach(actor =>
  {
    // skip if no actor to work with.
    if (!actor) return;

    // if there are no boosts saved, but boosts in the plugin settings, then assign them.
    if (!actor._j._otibs || !actor._j._otibs.length)
    {
      actor._j._otibs = J.OTIB.Metadata.OneTimeItemBoosts;
      return;
    }

    // update all boosts parameter data with new parameter data.
    J.OTIB.Metadata.OneTimeItemBoosts.forEach(otib =>
    {
      const foundBoost = actor.getOtibById(otib.itemId);
      if (foundBoost)
      {
        foundBoost.parameterData = otib.parameterData;
      }
      else
      {
        actor._j._otibs.push(otib);
      }
    });

    // go through each of the actors boosts and check to make sure they are not
    // stale/removed in the plugin settings.
    actor._j._otibs.forEach(otib =>
    {
      const stillExists = J.OTIB.Metadata.OneTimeItemBoosts
        .findIndex(boost => boost.itemId === otib.itemId);

      if (stillExists === -1)
      {
        actor._j._otibs.splice(stillExists, 1);
      }
    });

    // sort when we're all done because we like to keep porganized.
    actor._j._otibs.sort();
  });

  J.OTIB.Aliased.DataManager.extractSaveContents.call(this, contents);
};
//endregion DataManager

//region Game_Actor
/**
 * Adds new properties to the actors that manage the SDP system.
 */
J.OTIB.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.OTIB.Aliased.Game_Actor.get('initMembers').call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all boosts this actor has can potentially consume.
   * @type {OneTimeItemBoost[]}
   */
  this._j._otibs ||= J.OTIB.Metadata.OneTimeItemBoosts;
};

/**
 * Gets all of this actor's boosts.
 * @returns {OneTimeItemBoost[]}
 */
Game_Actor.prototype.getAllOtibs = function()
{
  return this._j._otibs;
};

/**
 * Gets the boost associated with the itemId.
 * @param {number} itemId The itemId to find the boost for.
 * @returns {OneTimeItemBoost}
 */
Game_Actor.prototype.getOtibById = function(itemId)
{
  return this.getAllOtibs().find(otib => otib.itemId === itemId);
};

/**
 * Gets whether or not the boost associated with the given itemId is unlocked.
 * If the boost doesn't exist, we return true to skip processing.
 * @param {number} itemId The itemId to check if the boost is unlocked for.
 * @returns
 */
Game_Actor.prototype.isOtibUnlocked = function(itemId)
{
  const otib = this.getOtibById(itemId);

  // if there is no boost for this itemId, then return true to take no action.
  if (!otib) return true;

  return otib.isUnlocked();
};

/**
 * Unlocks a specific boost by it's itemId.
 * @param {number} itemId The itemId of the boost to unlock.
 */
Game_Actor.prototype.unlockOtib = function(itemId)
{
  // don't process an already unlocked boost.
  if (this.isOtibUnlocked(itemId)) return;

  // get the boost and unlock it.
  this.getOtibById(itemId).unlock();
};

/**
 * Calculates the value of the bonus stats for a designated core parameter.
 * @param {number} paramId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @returns {number}
 */
Game_Actor.prototype.getOtibBonusForCoreParam = function(paramId, baseParam)
{
  // if we have no boosts, then don't process.
  let otibs = this.getAllOtibs();
  if (!otibs.length) return 0;

  // filter to only the unlocked boosts.
  otibs = otibs.filter(otib => otib.isUnlocked());
  if (!otibs.length) return 0;

  let otibsModifications = 0;
  otibs.forEach(otib =>
  {
    otib.parameterData.forEach(otibParam =>
    {
      // don't process this boost param.
      if (!(otibParam.paramId === paramId)) return 0;

      const boost = parseFloat(otibParam.boost);
      if (otibParam.isPercent)
      {
        // if it is a percent, then add it as a percent of the base parameter.
        otibsModifications += Math.floor(baseParam * (boost / 100));
      }
      else
      {
        // otherwise it is a flat boost.
        otibsModifications += boost;
      }
    });
  });

  return otibsModifications;
};

/**
 * Calculates the value of the bonus stats for a designated [sp|ex]-parameter.
 * @param {number} spexParamId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @param {number} idExtra The id modifier for s/x params.
 * @returns {number}
 */
Game_Actor.prototype.getOtibBonusForNonCoreParam = function(spexParamId, baseParam, idExtra)
{
  // if we have no boosts, then don't process.
  let otibs = this.getAllOtibs();
  if (!otibs.length) return 0;

  // filter to only the unlocked boosts.
  otibs = otibs.filter(otib => otib.isUnlocked());
  if (!otibs.length) return 0;

  let otibsModifications = 0;
  otibs.forEach(otib =>
  {
    otib.parameterData.forEach(otibParam =>
    {
      // don't process this boost param.
      if (!(otibParam.paramId - idExtra === spexParamId)) return 0;

      const boost = parseFloat((otibParam.boost / 100).toFixed(2));
      if (otibParam.isPercent)
      {
        // if it is a percent, then multiply and divide
        otibsModifications += Math.floor(baseParam * (boost / 100));
      }
      else
      {
        // otherwise it is a flat boost.
        otibsModifications += boost;
      }
    });
  });

  return otibsModifications;
};

/**
 * Calculates the value of the bonus stats for this actor's max TP.
 * @returns {number}
 */
Game_Actor.prototype.getOtibBonusForMaxTp = function()
{
  // if we have no boosts, then don't process.
  let otibs = this.getAllOtibs();
  if (!otibs.length) return 0;

  // filter to only the unlocked boosts.
  otibs = otibs.filter(otib => otib.isUnlocked());
  if (!otibs.length) return 0;

  let otibsModifications = 0;
  otibs.forEach(otib =>
  {
    otib.parameterData.forEach(otibParam =>
    {
      // don't process this boost param.
      if (!(otibParam.paramId === 28)) return;

      const { boost } = otibParam;
      if (otibParam.isPercent)
      {
        // if it is a percent, then multiply and divide
        otibsModifications += Math.floor(baseParam * (boost / 100));
      }
      else
      {
        // otherwise it is a flat boost.
        otibsModifications += boost;
      }
    });
  });

  return otibsModifications;
};

/**
 * Extends the base parameters with the OTIB bonuses.
 */
J.OTIB.Aliased.Game_Actor.set('param', Game_Actor.prototype.param);
Game_Actor.prototype.param = function(paramId)
{
  // perform original logic.
  const baseParam = J.OTIB.Aliased.Game_Actor.get('param').call(this, paramId);

  // grab the modifications of this parameter.
  const otibModifications = this.getOtibBonusForCoreParam(paramId, baseParam);

  // combine the results.
  const result = baseParam + otibModifications;

  // return the result.
  return parseFloat(result.toFixed(3));
};

/**
 * Extends the ex-parameters with the OTIB bonuses.
 */
J.OTIB.Aliased.Game_Actor.set('xparam', Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId)
{
  // perform original logic.
  const baseParam = J.OTIB.Aliased.Game_Actor.get('xparam').call(this, xparamId);

  // grab the modifications of this parameter.
  const otibModifications = this.getOtibBonusForNonCoreParam(xparamId, baseParam, 8);

  // combine the results.
  const result = baseParam + otibModifications;

  // return the result.
  return result;
};

/**
 * Extends the sp-parameters with the OTIB bonuses.
 */
J.OTIB.Aliased.Game_Actor.set('sparam', Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId)
{
  // perform original logic.
  const baseParam = J.OTIB.Aliased.Game_Actor.get('sparam').call(this, sparamId);

  // grab the modifications of this parameter.
  const otibModifications = this.getOtibBonusForNonCoreParam(sparamId, baseParam, 18);

  // combine the results.
  const result = baseParam + otibModifications;

  // return the result.
  return result;
};

/**
 * Extends the max TP to include any bonuses for that, too.
 */
J.OTIB.Aliased.Game_Actor.set('maxTp', Game_Actor.prototype.maxTp);
Game_Actor.prototype.maxTp = function()
{
  // perform original logic.
  const baseMaxTp = J.OTIB.Aliased.Game_Actor.get('maxTp').call(this);

  // grab the modifications of this parameter.
  const otibModifications = this.getOtibBonusForMaxTp();

  // combine the results.
  const result = baseMaxTp + otibModifications;

  // return the result.
  return result;
};
//endregion Game_Actor

//region Game_Battler
/**
 * Determines whether or not the {@link OneTimeItemBoost} has been unlocked yet.
 * @param {number} itemId The id of the item granting the boost.
 * @returns {boolean} True if already unlocked, false otherwise.
 */
Game_Battler.prototype.isOtibUnlocked = function(itemId)
{
  return false;
};

/**
 * Unlocks the {@link OneTimeItemBoost} associated with the item's id.
 * @param {number} itemId The id of the item granting the boost.
 */
Game_Battler.prototype.unlockOtib = function(itemId)
{
};

/**
 * Consume the item AND unlock the boost if it is not already unlocked.
 * @param {object} item The item being consumed.
 */
J.OTIB.Aliased.Game_Actor.set('consumeItem', Game_Battler.prototype.consumeItem)
Game_Battler.prototype.consumeItem = function(item)
{
  // perform original logic.
  J.OTIB.Aliased.Game_Actor.get('consumeItem').call(this, item);

  // handle the otib logic.
  this.handleOtibUnlock(item);
};

/**
 * Handles the {@link OneTimeItemBoost} unlock if applicable.
 * @param {RPG_Item} item The item potentially containing a boost.
 */
Game_Battler.prototype.handleOtibUnlock = function(item)
{
  // parse out the item's id.
  const { id } = item;

  // check if we have yet to unlock this boost.
  if (!this.isOtibUnlocked(id))
  {
    // unlock the boost.
    this.unlockOtib(id);
  }
};
//endregion Game_Battler