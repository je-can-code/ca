//region RPG_EquipItem
//region skillId
/**
 * The skill id associated with this equipment.
 * This is typically found on weapons and offhand armors.
 * @type {number|null}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsSkillId",
  {
    get: function()
    {
      return this.getJabsSkillId();
    },
  });

/**
 * Gets the JABS skill id for this equip.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.getJabsSkillId = function()
{
  return this.extractJabsSkillId();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.extractJabsSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SkillId, true);
};
//endregion skillId

//region offhand skillId
/**
 * The offhand skill id override from this equip.
 * @type {number}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsOffhandSkillId",
  {
    get: function()
    {
      return this.getJabsOffhandSkillId();
    },
  });

/**
 * Gets the JABS offhand skill id override for this equip.
 * @returns {number}
 */
RPG_EquipItem.prototype.getJabsOffhandSkillId = function()
{
  return this.extractJabsOffhandSkillId()
};

/**
 * Gets the value from its notes.
 */
RPG_EquipItem.prototype.extractJabsOffhandSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.OffhandSkillId, true);
};
//endregion offhand skillId



//region useOnPickup
/**
 * Normally defines whether or not an item will be automatically used
 * upon being picked up, however, equipment cannot be "used".
 * @type {false}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsUseOnPickup",
  {
    get: function()
    {
      return false;
    },
  });
//endregion useOnPickup

//region expiration
/**
 * The expiration time in frames for this equip drop.
 * @type {number|null}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsExpiration",
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
RPG_EquipItem.prototype.getJabsExpirationFrames = function()
{
  return this.extractJabsExpirationFrames();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.extractJabsExpirationFrames = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Expires, true);
};
//endregion expiration
//endregion RPG_EquipItem