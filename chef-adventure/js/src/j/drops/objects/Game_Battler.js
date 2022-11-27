//#region Game_Battler
/**
 * Parses the given reference data to extract any extra drops that may be present.
 * @param {RPG_BaseItem} referenceData The database object to parse.
 * @returns {RPG_DropItem[]}
 */
Game_Battler.prototype.extractExtraDrops = function(referenceData)
{
  // initialize the extra drops collection.
  const extraDrops = [];

  // get the note data associated with the database object.
  const notedata = referenceData.note.split(/[\r\n]+/);

  // iterate over each line of the note and check if we have extra drops.
  notedata.forEach(line =>
  {
    // extract the relevant drop from this line.
    const extraDrop = this.extractExtraDrop(line);

    // if there was a drop found on this line...
    if (extraDrop)
    {
      // ...then add it to the running collection.
      extraDrops.push(extraDrop);
    }
  }, this);

  // TODO: we can optimize this data extraction, right?
  // const test = referenceData.getArraysFromNotesByRegex(J.DROPS.RegExp.BaseDrop, true);

  // return the found extra drops.
  return extraDrops;
};

/**
 * Extracts the extra drop from a single note line, if one is present.
 * @param {string} line The line from a note to extract from.
 * @returns {RPG_DropItem|null}
 */
Game_Battler.prototype.extractExtraDrop = function(line)
{
  // the regex structure for extra drops.
  const structure = J.DROPS.RegExp.BaseDrop;

  // if we have a relevant note tag...
  if (line.match(structure))
  {
    // ...identify the categorical "kind" of drop it is...
    let kind = 0;
    switch (RegExp.$1)
    {
      case ("i" || "item"):
        kind = 1;
        break;
      case ("w" || "weapon"):
        kind = 2;
        break;
      case ("a" || "armor"):
        kind = 3;
        break;
    }

    // ...and build the drop result based on the note data.
    const dropItem = new RPG_DropItemBuilder()
      .setId(RegExp.$2)
      .setChance(RegExp.$3)
      .build();

    // return the built drop result.
    return dropItem;
  }

  // if we didn't find anything on this line, then return a null.
  return null;
};
//#endregion Game_Battler