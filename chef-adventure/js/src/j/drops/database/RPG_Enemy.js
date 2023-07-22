/**
 * Gets the list of original drop items from the enemy in the database.
 *
 * This double-checks the actual drop items associated with an enemy in the
 * database as you can have invalid drop items if you set a drop up with a
 * denominator, but then changed your mind and flipped the drop type to "None".
 * @returns {RPG_DropItem[]}
 */
RPG_Enemy.prototype.originalDropItems = function()
{
  return this.dropItems
    .filter(this.validDropItemFilter, this);
};

/**
 * Determines whether or not a drop item is a valid drop.
 * @param {RPG_DropItem} dropItem The potential drop to check.
 * @returns {boolean} True if the drop is valid, false otherwise.
 */
RPG_Enemy.prototype.validDropItemFilter = function(dropItem)
{
  // if the drop item itself is falsey, it is not valid.
  if (!dropItem) return false;

  // if the drop item lacks an id or drop type, it is not valid.
  if (!dropItem.dataId || !dropItem.kind) return false;

  // the item is valid!
  return true;
};