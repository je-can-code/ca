/**
 * Determines whether or not this event has any gap close target overrides.
 * @returns {boolean} True if this event has a gap close override, false otherwise.
 */
Game_Event.prototype.isGapClosable = function()
{
  // initialize the data.
  let gapCloseTarget = false;

  // check all the valid event commands to see if this target is gap closable.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if it is a gap closable target.
    if (J.ABS.EXT.TOOLS.RegExp.GapCloseTarget.test(comment))
    {
      // flag it as such.
      gapCloseTarget = true;
    }
  });

  // return what we found.
  return gapCloseTarget;
};