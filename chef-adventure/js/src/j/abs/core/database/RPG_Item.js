//region RPG_Item
//region skillId
/**
 * The skill id associated with this item or tool.
 * @type {number|null}
 */
Object.defineProperty(RPG_Item.prototype, "jabsSkillId",
  {
    get: function()
    {
      return this.getJabsSkillId();
    },
  });

/**
 * Gets the JABS skill id for this item or tool.
 * @returns {number|null}
 */
RPG_Item.prototype.getJabsSkillId = function()
{
  return this.extractJabsSkillId();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Item.prototype.extractJabsSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SkillId, true);
};
//endregion skillId

//region useOnPickup
/**
 * Whether or not this item will be automatically executed upon being picked up.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_Item.prototype, "jabsUseOnPickup",
  {
    get: function()
    {
      return this.getJabsUseOnPickup();
    },
  });

/**
 * Gets whether or not this item will be used on pickup.
 * @returns {boolean|null}
 */
RPG_Item.prototype.getJabsUseOnPickup = function()
{
  return this.extractJabsUseOnPickup();
};

/**
 * Extracts the boolean from the notes.
 * @returns {boolean|null}
 */
RPG_Item.prototype.extractJabsUseOnPickup = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.UseOnPickup, true);
};
//endregion useOnPickup

//region expiration
/**
 * The expiration time in frames for this loot drop.
 * @type {number|null}
 */
Object.defineProperty(RPG_Item.prototype, "jabsExpiration",
  {
    get: function()
    {
      return this.getJabsExpirationFrames();
    },
  });

/**
 * Gets the expiration time in frames.
 * @returns {number|null}
 */
RPG_Item.prototype.getJabsExpirationFrames = function()
{
  return this.extractJabsExpirationFrames();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Item.prototype.extractJabsExpirationFrames = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Expires, true);
};
//endregion expiration
//endregion RPG_Item