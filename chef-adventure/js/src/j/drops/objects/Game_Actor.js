//region Game_Actor
/**
 * Gets this actor's bonus drop multiplier.
 * @returns {number}
 */
Game_Actor.prototype.getDropMultiplier = function()
{
  let dropMultiplier = 0;
  const objectsToCheck = this.getAllNotes();
  objectsToCheck.forEach(obj => (dropMultiplier += this.extractDropMultiplier(obj)));
  return (dropMultiplier / 100);
};

/**
 * Gets the bonus drop multiplier from a given database object.
 * @param {RPG_BaseItem} referenceData The database object in question.
 * @returns {number}
 */
Game_Actor.prototype.extractDropMultiplier = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return 0;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<dropMultiplier:[ ]?(-?[\d]+)>/i;
  let dropMultiplier = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      const multiplier = parseInt(RegExp.$1);
      dropMultiplier += multiplier;
    }
  });

  return dropMultiplier;
};

/**
 * Gets this actor's bonus gold multiplier.
 * @returns {number}
 */
Game_Actor.prototype.getGoldMultiplier = function()
{
  let goldMultiplier = 0;
  const objectsToCheck = this.getAllNotes();
  objectsToCheck.forEach(obj => (goldMultiplier += this.extractGoldMultiplier(obj)));
  return (goldMultiplier / 100);
};

/**
 * Gets the bonus gold multiplier from a given database object.
 * @param {RPG_BaseItem} referenceData The database object in question.
 * @returns {number}
 */
Game_Actor.prototype.extractGoldMultiplier = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return 0;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<goldMultiplier:[ ]?(-?[\d]+)>/i;
  let goldMultiplier = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      const multiplier = parseInt(RegExp.$1);
      goldMultiplier += multiplier;
    }
  });

  return goldMultiplier;
};
//endregion Game_Actor