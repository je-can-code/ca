//region RPG_Item
/**
 * The SDP key that this item unlocks upon use.
 * @type {string}
 */
Object.defineProperty(RPG_Item.prototype, "sdpKey",
  {
    get: function()
    {
      return this.getSdpKey();
    },
  });

/**
 * Gets the key of the SDP this item unlocks.
 * @returns {string}
 */
RPG_Item.prototype.getSdpKey = function()
{
  return this.getStringFromNotesByRegex(J.SDP.RegExp.SdpUnlockKey);
};
//endregion RPG_Item