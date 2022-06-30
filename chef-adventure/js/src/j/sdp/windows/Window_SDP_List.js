//#region Window_SDP_List
/**
 * The SDP window containing the list of all earned SDPs.
 */
class Window_SDP_List extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initMembers();
  }

  initMembers()
  {
    /**
     * The currently selected actor. Used for comparing points to cost to see if
     * the panel in the list window should be enabled or disabled.
     * @type {Game_Actor}
     */
    this.currentActor = null;
  }

  /**
   * Sets the actor for this window to the provided actor. Implicit refresh.
   * @param {Game_Actor} actor The actor to assign to this window.
   */
  setActor(actor)
  {
    this.currentActor = actor;
    this.refresh();
  }

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  }

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    const panels = $gameSystem.getUnlockedSdps();
    const actor = this.currentActor;
    if (!panels.length || !actor) return;

    const points = actor.getSdpPoints();

    // add all panels to the list.
    panels.forEach(panel =>
    {
      const panelRanking = actor.getSdpByKey(panel.key);
      // if this actor is missing any rankings for the panel, just make one.
      if (!panelRanking) actor.addNewPanelRanking(panel.key);

      const {currentRank} = actor.getSdpByKey(panel.key);
      const hasEnoughPoints = panel.rankUpCost(currentRank) <= points;
      const isMaxRank = panel.maxRank === currentRank;
      const enabled = hasEnoughPoints && !isMaxRank;
      this.addCommand(panel.name, panel.key, enabled, panel, panel.iconIndex, panel.rarity);

      /*
        common: 0
        uncommon: 3
        rare: 23
        epic: 31
        legendary: 21
        godly: 25
      */
    });
  }
}
//#endregion Window_SDP_List