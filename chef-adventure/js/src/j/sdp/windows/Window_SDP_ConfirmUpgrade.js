//region Window_SDP_ConfirmUpgrade
/**
 * The window that prompts the user to confirm/cancel the upgrading of a chosen panel.
 */
class Window_SDP_ConfirmUpgrade
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
    this.initMembers();
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The cost of this panel to execute an upgrade.
     * @type {number}
     */
    this.cost = 0;

    /**
     * The actor to reduce the points of if the player chooses to upgrade the panel.
     * @type {Game_Actor}
     */
    this.actor = null;
  }

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    this.addCommand(`Upgrade this panel`, `panel-upgrade-ok`, true, null, 91);
    this.addCommand(`Cancel`, `panel-upgrade-cancel`, true, null, 90);
  }
}
//endregion Window_SDP_ConfirmUpgrade
//endregion Window objects