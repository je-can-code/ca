//region Game_Battler
/**
 * Parses the given reference data to extract any extra drops that may be present.
 * @param {RPG_BaseItem} referenceData The database object to parse.
 * @returns {RPG_DropItem[]}
 */
Game_Battler.prototype.extractExtraDrops = function(referenceData)
{
  // get the drops found on this enemy.
  const moreDrops = referenceData.getArraysFromNotesByRegex(J.DROPS.RegExp.ExtraDrop, true) ?? [];

  // a mapping function to build proper drop items from the arrays.
  const mapper = drop =>
  {
    // deconstruct the array into drop properties.
    const [ dropType, dropId, chance ] = drop;

    // build the new drop item.
    return new RPG_DropItemBuilder()
      .setType(RPG_DropItem.TypeFromLetter(dropType))
      .setId(dropId)
      .setChance(chance)
      .build();
  };

  // map the converted drops.
  const convertedDrops = moreDrops.map(mapper, this);

  // return the found extra drops.
  return convertedDrops;
};
//endregion Game_Battler