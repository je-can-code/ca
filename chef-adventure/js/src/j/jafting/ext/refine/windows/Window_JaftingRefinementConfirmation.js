//region Window_JaftingRefinementConfirmation
/**
 * A window that gives the player a chance to confirm or cancel their
 * refinement before executing.
 */
class Window_JaftingRefinementConfirmation
  extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
  }

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    this.addCommand(`${J.JAFTING.EXT.REFINE.Messages.ExecuteRefinementCommandName}`, `ok`, true, null, 91);
    this.addCommand(`${J.JAFTING.EXT.REFINE.Messages.CancelRefinementCommandName}`, `cancel`, true, null, 90);
  }
}
//endregion Window_JaftingRefinementConfirmation