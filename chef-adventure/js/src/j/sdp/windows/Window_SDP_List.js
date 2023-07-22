//region Window_SDP_List
/**
 * The SDP window containing the list of all earned SDPs.
 */
class Window_SDP_List extends Window_Command
{
  /**
   * The currently selected actor. Used for comparing points to cost to see if
   * the panel in the list window should be enabled or disabled.
   * @type {Game_Actor}
   */
  currentActor = null;

  filterNoMaxedPanels = false;

  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
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
   * Gets whether or not the no-max-panels filter is enabled.
   * @returns {boolean}
   */
  usingNoMaxPanelsFilter()
  {
    return this.filterNoMaxedPanels;
  }

  /**
   * Sets whether or not the panel list should filter out already-maxed panels.
   * @param {boolean} useFilter True to filter out maxed panels, false otherwise.
   */
  setNoMaxPanelsFilter(useFilter)
  {
    this.filterNoMaxedPanels = useFilter;
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

    // add all panels to the list.
    panels.forEach(panel =>
    {
      // construct the SDP command.
      const command = this.makeCommand(panel);

      // if the command is invalid, do not add it.
      if (!command) return;

      // add the command.
      this.addBuiltCommand(command);
    }, this);
  }

  /**
   * Builds a single command for the SDP list based on a given panel.
   * @param {StatDistributionPanel} panel The panel to build a command for.
   * @returns {BuiltWindowCommand}
   */
  makeCommand(panel)
  {
    const actor = this.currentActor;
    const points = actor.getSdpPoints();
    const { name, key, iconIndex, rarity: colorIndex, maxRank } = panel;

    // get the ranking for a given panel by its key.
    const panelRanking = actor.getSdpByKey(key);

    // grab the current rank of the panel.
    const { currentRank } = panelRanking;

    // check if we're at max rank already.
    const isMaxRank = maxRank === currentRank;

    // check if the panel is max rank AND we're using the no max panels filter.
    if (isMaxRank && this.usingNoMaxPanelsFilter())
    {
      // don't render this panel.
      return null;
    }

    // check if we have enough points to rank up this panel.
    const hasEnoughPoints = panel.rankUpCost(currentRank) <= points;

    // determine whether or not the command is enabled.
    const enabled = hasEnoughPoints && !isMaxRank;

    // build the right text out.
    const rightText = isMaxRank
      ? "DONE"
      : `${currentRank} / ${maxRank}`;

    // construct the SDP command.
    const command = new WindowCommandBuilder(name)
      .setSymbol(key)
      .setEnabled(enabled)
      .setExtensionData(panel)
      .setIconIndex(iconIndex)
      .setColorIndex(colorIndex)
      .setRightText(rightText)
      .build();

    return command;
  }
}
//endregion Window_SDP_List