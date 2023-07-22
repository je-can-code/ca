//region Window_SDP_Details
/**
 * The window that displays all details of how a panel would affect the actor's parameters.
 */
class Window_SDP_Details extends Window_Base
{
  constructor(rect)
  {
    super(rect);
    this.initMembers();
    this.refresh();
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The panel currently being displayed in this window.
     * @type {StatDistributionPanel}
     */
    this.currentPanel = null;

    /**
     * The actor used for parameter comparisons.
     * @type {Game_Actor}
     */
    this.currentActor = null;
  }

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    // don't refresh if there is no panel to refresh the contents of.
    if (!this.currentPanel || !this.currentActor) return;

    this.contents.clear();
    this.drawPanelInfo();
  }

  /**
   * Sets the panel that this window is displaying info for.
   * @param {StatDistributionPanel} panel The panel to display info for.
   */
  setPanel(panel)
  {
    this.currentPanel = panel;
    this.refresh();
  }

  /**
   * Sets the stat comparison actor to be this actor.
   * @param {Game_Actor} actor The actor to perform stat comparisons against.
   */
  setActor(actor)
  {
    this.currentActor = actor;
  }

  /**
   * Draws all the data associated with the currently selected panel.
   */
  drawPanelInfo()
  {
    this.drawHeaderDetails();
    this.drawLevelDetails();
    this.drawCostDetails();
    this.drawAllParameterDetails();
  }

  /**
   * Draws the top-level information of the panel.
   */
  drawHeaderDetails()
  {
    const panel = this.currentPanel;
    const lh = this.lineHeight();
    this.drawTextEx(`\\I[${panel.iconIndex}]\\C[${panel.rarity}]${panel.name}\\C[0]`, 0, lh * 0, 300);
    this.drawTextEx(`${panel.topFlavorText}`, 20, lh * 1, 600);
  }

  /**
   * Draws the ranking information of the panel.
   */
  drawLevelDetails()
  {
    const panel = this.currentPanel;
    const actor = this.currentActor;
    const panelRanking = actor.getSdpByKey(panel.key);
    const lh = this.lineHeight();
    const ox = 360;
    this.drawText(`Rank:`, ox, lh * 0, 200, "left");
    this.changeTextColor(this.determinePanelRankColor(panelRanking.currentRank, panelRanking.maxRank));
    this.drawText(`${panelRanking.currentRank}`, ox + 55, lh * 0, 50, "right");
    this.resetTextColor();
    this.drawText(`/`, ox + 110, lh * 0, 30, "left");
    this.drawText(`${panel.maxRank}`, ox + 130, lh * 0, 50, "left");
  }

  /**
   * Determines the color of the "current rank" number text.
   * @param {number} currentRank The current rank of this panel.
   * @param {number} maxRank The maximum rank of this panel.
   * @returns {number} The id of the color.
   */
  determinePanelRankColor(currentRank, maxRank)
  {
    if (currentRank === 0)
    {
      return ColorManager.damageColor();
    }
    else if (currentRank < maxRank)
    {
      return ColorManager.crisisColor();
    }
    else if (currentRank >= maxRank)
    {
      return ColorManager.powerUpColor();
    }
    else
    {
      return ColorManager.normalColor();
    }
  }

  /**
   * Draws the cost information of ranking this panel up.
   */
  drawCostDetails()
  {
    const panel = this.currentPanel;
    const actor = this.currentActor;
    const panelRanking = actor.getSdpByKey(panel.key);
    const rankUpCost = panel.rankUpCost(panelRanking.currentRank);
    const lh = this.lineHeight();
    const ox = 560;
    const costColor = this.determineCostColor(rankUpCost);
    this.drawText(`Cost:`, ox, lh * 0, 200, "left");
    if (costColor)
    {
      this.changeTextColor(costColor);
      this.drawText(`${rankUpCost}`, ox + 100, lh * 0, 120, "left");
      this.resetTextColor();
    }
    else
    {
      this.drawText(`---`, ox + 100, lh * 0, 80, "left");
    }
  }

  /**
   * Determines the color of the "current rank" number text.
   * @param {number} rankUpCost The cost to rank up this panel.
   * @returns {number} The id of the color.
   */
  determineCostColor(rankUpCost)
  {
    // if the cost is 0, then just return, it doesn't matter.
    if (rankUpCost === 0) return null;

    const currentSdpPoints = this.currentActor.getSdpPoints();

    if (rankUpCost <= currentSdpPoints)
    {
      return ColorManager.powerUpColor();
    }
    else
    {
      return ColorManager.damageColor();
    }
  }

  /**
   * Draws the parameters and how they are affected by this panel.
   */
  drawAllParameterDetails()
  {
    const panel = this.currentPanel;
    const lh = this.lineHeight();
    const { panelParameters } = panel;
    this.drawParameterHeaderRow(120);
    panelParameters.forEach((parameter, index) =>
    {
      this.drawParameterDetailsRow(parameter, 160 + lh * index);
    });
  }

  /**
   * Draws the header row of the table that represents all parameters affected by
   * leveling the currently highlighted panel.
   */
  drawParameterHeaderRow(y)
  {
    const ox = 20;
    const rw = 200;
    this.drawTextEx(`Parameter`, ox + rw * 0, y, 100);
    this.drawText(`Current`, ox + rw * 1 + 100, y, 100, "left");
    this.drawText(`Effect`, ox + rw * 2 + 50, y, 100, "left");
    this.drawText(`Potential`, ox + rw * 3, y, 120, "left");
  }

  /**
   * Draws a single row representing one potentially changed parameter by leveling this panel.
   * @param {PanelParameter} panelParameter The panel parameter information.
   * @param {number} y The `y` coordinate for this row.
   */
  drawParameterDetailsRow(panelParameter, y)
  {
    const { parameterId, perRank, isFlat, isCore } = panelParameter;
    const { name, value, iconIndex, smallerIsBetter, isPercentValue } = this.translateParameter(parameterId);
    const ox = 20;
    const rw = 200;
    const isPositive = perRank >= 0 ? '+' : String.empty;
    const currentValue = parseFloat(value);
    let potentialValue = isFlat
      ? (currentValue + perRank).toFixed(2)
      : (currentValue + (currentValue * (perRank / 100)));
    potentialValue = Number(potentialValue);
    if (!Number.isInteger(potentialValue))
    {
      potentialValue = potentialValue.toFixed(2);
    }

    const upColor = ColorManager.textColor(24);
    const upCoreColor = ColorManager.textColor(28);
    const downColor = ColorManager.textColor(20);
    const downCoreColor = ColorManager.textColor(18);
    const modifier = isFlat
      ? perRank
      : (potentialValue - currentValue).toFixed(2);

    let potentialColor = ColorManager.normalColor();
    if (currentValue > potentialValue && !smallerIsBetter)
    {
      potentialColor = isCore
        ? downCoreColor
        : downColor;
    }
    else
    {
      potentialColor = isCore
        ? upCoreColor
        : upColor;
    }

    // if it is one of the parameters where smaller is better, then going up is bad.
    if (currentValue < potentialValue && smallerIsBetter)
    {
      potentialColor = isCore
        ? upCoreColor
        : upColor;
    }

    const isPercent = isFlat ? `` : `%`;

    // parameter name, drawn differently for core parameters.
    if (isCore)
    {
      this.drawTextEx(`\\I[${iconIndex}]\\C[14]${name}\\C[0]${isPercent}`, ox + rw * 0, y, 32);
    }
    else
    {
      this.drawTextEx(`\\I[${iconIndex}]${name}${isPercent}`, ox + rw * 0, y, 100);
    }

    // parameter current value.
    const needPercentSymbol = (isPercVal) => isPercVal ? '%' : String.empty;
    const basePercentSymbol = needPercentSymbol(isPercentValue);
    this.drawText(`${currentValue}${basePercentSymbol}`, ox + rw * 1 + 100, y, 100, "center");

    // parameter modifier by this panel.
    const modPercentSymbol = needPercentSymbol(isPercent);
    this.changeTextColor(potentialColor);
    if (isPercent)
    {
      this.drawText(`(${isPositive}${perRank}${isPercent})`, ox + rw * 2 + 50, y, 100, "center");
    }
    else
    {
      this.drawText(`(${isPositive}${modifier}${modPercentSymbol})`, ox + rw * 2 + 50, y, 100, "center");
    }

    // new parameter value if this panel is ranked up.
    this.drawText(`${potentialValue}${basePercentSymbol}`, ox + rw * 3, y, 100, "center");
    this.resetTextColor();
  }

  /**
   * Translates a parameter id into an object with its name, value, iconIndex, and whether or not
   * a parameter being smaller is an improvement..
   * @param {number} paramId The id to translate.
   * @returns {{name: string, value: number, iconIndex: number, smallerIsBetter: boolean, isPercentValue: boolean}}
   */
  // eslint-disable-next-line complexity
  translateParameter(paramId)
  {
    const smallerIsBetter = this.isNegativeGood(paramId);
    const isPercentValue = this.isPercentParameter(paramId);
    let name = String.empty;
    let value = 0;
    let iconIndex = 0;
    switch (paramId)
    {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        name = TextManager.param(paramId);
        value = this.currentActor.param(paramId).toFixed(2);
        iconIndex = IconManager.param(paramId);
        break;
      case  8:
      case  9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        name = TextManager.xparam(paramId - 8);
        value = (this.currentActor.xparam(paramId - 8) * 100).toFixed(2);
        iconIndex = IconManager.xparam(paramId - 8);
        break;
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
      case 25:
      case 26:
      case 27:
        name = TextManager.sparam(paramId - 18);
        value = (this.currentActor.sparam(paramId - 18) * 100).toFixed(2);
        iconIndex = IconManager.sparam(paramId - 18);
        break;
    }

    return {name, value, iconIndex, smallerIsBetter, isPercentValue};
  }

  /**
   * Determines whether or not the parameter should be suffixed with a % character.
   * This is specifically for parameters that truly are ranged between 0-100 and RNG.
   * @param {number} parameterId The paramId to check if is a percent.
   * @returns {boolean}
   */
  isPercentParameter(parameterId)
  {
    // grab the list of ids that qualify as "needs a % symbol".
    const isPercentParameterIds = this.getIsPercentParameterIds();

    // check to see if our id is in that special list.
    const isPercent = isPercentParameterIds.includes(parameterId);

    // return the check.
    return isPercent;
  }

  /**
   * The collection of long-form parameter ids that should be decorated with a `%` symbol.
   * @returns {number[]}
   */
  getIsPercentParameterIds()
  {
    return [
      9,    // eva
      14,   // cnt
      20,   // rec
      21,   // pha
      22,   // mcr
      23,   // tcr
      24,   // pdr
      25,   // mdr
      26,   // fdr
      27    // exr
    ];
  }

  /**
   * Determines whether or not the parameter should be marked as "improved" if it is negative.
   * @param {number} parameterId The paramId to check if smaller is better for.
   * @returns {boolean} True if the smaller is better for this paramId, false otherwise.
   */
  isNegativeGood(parameterId)
  {
    // grab the list of ids that qualify as "smaller is better".
    const smallerIsBetterParameterIds = this.getSmallerIsBetterParameterIds();

    // check to see if our id is in that special list.
    const smallerIsBetter = smallerIsBetterParameterIds.includes(parameterId);

    // return the check.
    return smallerIsBetter;
  }

  /**
   * The collection of long-form parameter ids that should have a positive color indicator
   * when there is a decrease of value in that parameter from the panel.
   * @returns {number[]}
   */
  getSmallerIsBetterParameterIds()
  {
    return [
      18,   // trg
      22,   // mcr
      23,   // tcr
      24,   // pdr
      25,   // mdr
      26    // fdr
    ];
  }
}
//endregion Window_SDP_Details