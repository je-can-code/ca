//region Game_Enemy
/**
 * Gets whether or not an enemy has a visible danger indicator from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.showDangerIndicator = function()
{
  let val = J.ABS.EXT.DANGER.Metadata.DefaultEnemyShowDangerIndicator;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoDangerIndicator])
  {
    // if its in the metadata, then grab it from there.
    val = false;
  }
  else
  {
    const structure = /<noDangerIndicator>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = false;
      }
    });
  }

  return val;
};
//endregion Game_Enemy