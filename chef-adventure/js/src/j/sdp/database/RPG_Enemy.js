//region RPG_Enemy
//region sdpPoints
/**
 * The number of SDP points this enemy will yield upon defeat.
 * @type {number|null}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpPoints",
  {
    get: function()
    {
      return this.getSdpPoints();
    },
  });

/**
 * Gets the expiration time in frames.
 * @returns {number|null}
 */
RPG_Enemy.prototype.getSdpPoints = function()
{
  return this.extractSdpPoints();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Enemy.prototype.extractSdpPoints = function()
{
  return this.getNumberFromNotesByRegex(J.SDP.RegExp.SdpPoints);
};
//endregion sdpPoints

//region sdpDropData
/**
 * Gets the SDP drop data for this enemy.
 *
 * Panels that have already been dropped and collected will not
 * be dropped again.
 *
 * The zeroth index is the string key for the panel being dropped.
 * The first index is 1-100 percent chance for the panel to drop.
 * The second index is the numeric id of the item associated with the panel.
 * @type {[string, number, number]|null}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropData",
  {
    get: function()
    {
      return this.getSdpDropData() ?? [String.empty, 0, 0];
    },
  });

/**
 * Gets the key of the panel being dropped.
 * @type {string}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropKey",
  {
    get: function()
    {
      return this.sdpDropData[0];
    },
  });

/**
 * Gets the drop rate for this panel.
 * @type {number}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropChance",
  {
    get: function()
    {
      return this.sdpDropData[1];
    },
  });

/**
 * Gets the id of the item associated with this panel, if any.
 * @type {number}
 */
Object.defineProperty(RPG_Enemy.prototype, "sdpDropItemId",
  {
    get: function()
    {
      return this.sdpDropData[2] ?? 0;
    },
  });

/**
 * Gets the SDP data for this enemy.
 * @returns {[string, number, number]|null}
 */
RPG_Enemy.prototype.getSdpDropData = function()
{
  return this.extractSdpDropData();
};

/**
 * Extracts the value from the notes.
 * @returns {[string, number, number]|null}
 */
RPG_Enemy.prototype.extractSdpDropData = function()
{
  return this.getArrayFromNotesByRegex(J.SDP.RegExp.SdpDropData, true);
};
//endregion sdpDropData
//endregion RPG_Enemy