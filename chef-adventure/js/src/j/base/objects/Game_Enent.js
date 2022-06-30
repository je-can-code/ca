//#region Game_Event
/**
 * Detects whether or not the event code is one that matches the "comment" code.
 * @param {number} code The code to match.
 * @returns {boolean}
 */
Game_Event.prototype.matchesControlCode = function(code)
{
  return (code === 108 || code === 408);
};
//#endregion Game_Event