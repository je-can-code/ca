/**
 * Translates this drop item into its corresponding implemented class.
 * @returns {RPG_Item|RPG_Weapon|RPG_Armor}
 */
RPG_DropItem.prototype.toImplementation = function()
{
  // define the source to pull the item from.
  let source = [];

  // pivot on the kind of drop item this is.
  switch (this.kind)
  {
    case RPG_DropItem.Types.Item:
      source = $dataItems;
      break;
    case RPG_DropItem.Types.Weapon:
      source = $dataWeapons;
      break;
    case RPG_DropItem.Types.Armor:
      source = $dataArmors;
      break;
    default:
      throw new Error(`This drop item is missing properties to fulfill this request.`, this);
  }

  // return the id of the drop item from its corresponding source.
  return source.at(this.dataId);
};