//region RPG_Item
/**
 * The SDP key of this item.
 * @type {string}
 */
Object.defineProperty(RPG_DropItem.prototype, "sdpKey",
  {
    get: function()
    {
      return this.getSdpKey();
    },
  });

/**
 * Gets the SDP key of this item.
 * @returns {string}
 */
RPG_DropItem.prototype.getSdpKey = function()
{
  return this._sdpKey;
};

/**
 * Gets the key of this item.
 * @param {string} key The key of the SDP.
 */
RPG_DropItem.prototype.setSdpKey = function(key)
{
  this._sdpKey = key;
};

/**
 * Checks whether or not this drop item is a stat distribution panel drop.
 * @returns {boolean} True if this is a panel drop, false otherwise.
 */
RPG_DropItem.prototype.isSdpDrop = function()
{
  return !!this._sdpKey;
};
//endregion RPG_Item