/**
 * Determines whether or not this battler is a gap close target.
 * @returns {boolean} True if this battler is a gap close target, false otherwise.
 */
Game_Battler.prototype.isGapClosable = function()
{
  // grab all the note objects.
  const objectsToCheck = this.getAllNotes();

  // initialize the data.
  let gapCloseTarget = false;

  // iterate over all the note objects.
  objectsToCheck.forEach(obj =>
  {
    // split up the notes.
    const notedata = obj.note.split(/[\r\n]+/);

    // iterate over all the lines of the note object.
    notedata.forEach(line =>
    {
      // check if it is a gap closable target.
      if (J.ABS.EXT.TOOLS.RegExp.GapCloseTarget.test(line))
      {
        // flag it as such.
        gapCloseTarget = true;
      }
    });
  });

  // return what we found.
  return gapCloseTarget;
};