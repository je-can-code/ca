//#region Game_Actor
/**
 * Adds new properties to the actors that manage the SDP system.
 */
J.SDP.Aliased.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function()
{
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

    _sdpBoosts: {},
  };
};

/**
 * Adds a new panel ranking for tracking the progress of a given panel.
 * @param {string} key The less-friendly unique key that represents this SDP.
 */
Game_Actor.prototype.addNewPanelRanking = function(key)
{
  const ranking = this.getSdpByKey(key);
  if (ranking)
  {
    console.warn(`panel rankings are already being tracked for key: "${key}".`);
    return;
  }

  const panelRanking = new PanelRanking(key, this.actorId());
  this._j._sdp._ranks.push(panelRanking);
};

/**
 * Searches for a ranking in a given panel based on key and returns it.
 * @param {string} key The key of the panel we seek.
 * @returns {PanelRanking} The panel if found, `null` otherwise.
 */
Game_Actor.prototype.getSdpByKey = function(key)
{
  // don't try to search if there are no rankings at this time.
  if (!this._j._sdp._ranks.length) return null;

  return this._j._sdp._ranks.find(panelRanking => panelRanking.key === key);
};

/**
 * Gets all rankings that this actor has.
 * @returns {PanelRanking[]}
 */
Game_Actor.prototype.getAllSdpRankings = function()
{
  return this._j._sdp._ranks;
};

/**
 * Gets the amount of SDP points this actor has.
 */
Game_Actor.prototype.getSdpPoints = function()
{
  return this._j._sdp._points;
};

/**
 * Increase the amount of SDP points the actor has by a given amount.
 * If the parameter provided is negative, it will reduce the actor's points instead.
 *
 * NOTE: An actor's SDP points cannot be less than 0.
 * @param {number} points The number of points we are adding/removing from this actor.
 */
Game_Actor.prototype.modSdpPoints = function(points)
{
  let gainedSdpPoints = points;

  // if the modification is a positive amount...
  if (gainedSdpPoints > 0)
  {
    // then add apply the multiplier to the gained points.
    gainedSdpPoints = Math.round(gainedSdpPoints * this.sdpMultiplier());
  }

  // add the points onto the actor.
  this._j._sdp._points += gainedSdpPoints;

  // if the actor's points were reduced below zero...
  if (this._j._sdp._points < 0)
  {
    // return it back to 0.
    this._j._sdp._points = 0;
  }
};

/**
 * OVERWRITE Gets the SDP points multiplier for this actor.
 * @returns {number}
 */
Game_Actor.prototype.sdpMultiplier = function()
{
  // initializing with base 100, representing 1x.
  let multiplier = 100;

  // get all the objects to scan for possible sdp multipliers.
  const objectsToCheck = this.getAllNotes();

  // iterate over each of them and add the multiplier up.
  objectsToCheck.forEach(obj => (multiplier += this.extractSdpMultiplier(obj)), this);

  // return the factor form by now dividing by 100.
  return (multiplier / 100);
};

/**
 * Gets all multipliers that this database object contains.
 * @param {RPG_BaseItem} referenceData The database data of the object.
 * @returns {number}
 */
Game_Actor.prototype.extractSdpMultiplier = function(referenceData)
{
  if (!referenceData || !referenceData.note) return 0;

  let sdpMultiplier = 0;
  const structure = J.SDP.RegExp.SdpMultiplier;
  const notedata = referenceData.note.split(/[\r\n]+/);
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      sdpMultiplier += parseInt(RegExp.$1);
    }
  });

  return sdpMultiplier;
};

/**
 * Ranks up this actor's panel by key.
 * @param {string} panelKey The key of the panel to rank up.
 */
Game_Actor.prototype.rankUpPanel = function(panelKey)
{
  this.getSdpByKey(panelKey).rankUp();
};

/**
 * Calculates the value of the bonus stats for a designated core parameter.
 * @param {number} paramId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @returns {number}
 */
Game_Actor.prototype.getSdpBonusForCoreParam = function(paramId, baseParam)
{
  const panelRankings = this.getAllSdpRankings();
  if (!panelRankings.length) return 0;

  let panelModifications = 0;
  // for each of the panel rankings this actor has established-
  panelRankings.forEach(panelRanking =>
  {
    // get the corresponding SDP's panel parameters.
    const panelParameters = $gameSystem
      .getSdpByKey(panelRanking.key)
      .getPanelParameterById(paramId);
    if (panelParameters.length)
    {
      panelParameters.forEach(panelParameter =>
      {
        const {perRank} = panelParameter;
        const curRank = panelRanking.currentRank;
        if (!panelParameter.isFlat)
        {
          panelModifications += Math.floor(baseParam * (curRank * perRank) / 100);
        }
        else
        {
          panelModifications += curRank * perRank;
        }
      });
    }
  });

  return panelModifications;
};

/**
 * Calculates the value of the bonus stats for a designated [sp|ex]-parameter.
 * @param {number} sparamId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @param {number} idExtra The id modifier for s/x params.
 * @returns {number}
 */
Game_Actor.prototype.getSdpBonusForNonCoreParam = function(sparamId, baseParam, idExtra)
{
  const panelRankings = this.getAllSdpRankings();
  if (!panelRankings.length) return 0;

  let panelModifications = 0;
  // for each of the panel rankings this actor has established-
  panelRankings.forEach(panelRanking =>
  {
    // get the corresponding SDP's panel parameters.
    const panelParameters = $gameSystem
      .getSdpByKey(panelRanking.key)
      .getPanelParameterById(sparamId + idExtra); // need +10 because sparams start higher.
    if (panelParameters.length)
    {
      panelParameters.forEach(panelParameter =>
      {
        const {perRank} = panelParameter;
        const curRank = panelRanking.currentRank;
        if (!panelParameter.isFlat)
        {
          panelModifications += baseParam * (curRank * perRank) / 100;
        }
        else
        {
          panelModifications += (curRank * perRank) / 100;
        }
      });
    }
  });

  return panelModifications;
};

/**
 * Extends the base parameters with the SDP bonuses.
 */
J.SDP.Aliased.Game_Actor.param = Game_Actor.prototype.param;
Game_Actor.prototype.param = function(paramId)
{
  const baseParam = J.SDP.Aliased.Game_Actor.param.call(this, paramId);
  const panelModifications = this.getSdpBonusForCoreParam(paramId, baseParam);
  const result = baseParam + panelModifications;
  return result;
};

/**
 * Extends the ex-parameters with the SDP bonuses.
 */
J.SDP.Aliased.Game_Actor.xparam = Game_Actor.prototype.xparam;
Game_Actor.prototype.xparam = function(xparamId)
{
  const baseParam = J.SDP.Aliased.Game_Actor.xparam.call(this, xparamId);
  const panelModifications = this.getSdpBonusForNonCoreParam(xparamId, baseParam, 8);
  const result = baseParam + panelModifications;
  return result;
};

/**
 * Extends the sp-parameters with the SDP bonuses.
 */
J.SDP.Aliased.Game_Actor.sparam = Game_Actor.prototype.sparam;
Game_Actor.prototype.sparam = function(sparamId)
{
  const baseParam = J.SDP.Aliased.Game_Actor.sparam.call(this, sparamId);
  const panelModifications = this.getSdpBonusForNonCoreParam(sparamId, baseParam, 18);
  const result = baseParam + panelModifications;
  return result;
};
//#endregion Game_Actor