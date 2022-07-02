//#region Window_DifficultyDetails
class Window_DifficultyDetails extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initMembers();
    this.refresh();
  }

  static ComparisonTypes = {
    SAME: "same",
    EASIER: "easier",
    HARDER: "harder",
  };

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The difficulty being hovered over from the list.
     * @type {Difficulty}
     */
    this.hoveredDifficulty = null;
  }

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    // don't refresh if there is no difficulty to refresh the contents of.
    if (!this.hoveredDifficulty) return;

    this.contents.clear();
    this.drawDifficultyInfo();
  }

  /**
   * Gets the difficulty currently applied to the player.
   * @returns {Difficulty}
   */
  getAppliedDifficulty()
  {
    return $gameSystem.getAppliedDifficulty();
  }

  /**
   * Gets the difficulty currently being hovered over in the list.
   * @returns {Difficulty}
   */
  getHoveredDifficulty()
  {
    return this.hoveredDifficulty;
  }

  /**
   * Sets the hovered difficulty.
   * @param {Difficulty} difficulty The new hovered difficulty.
   */
  setHoveredDifficulty(difficulty)
  {
    if (this.hoveredDifficulty !== difficulty)
    {
      this.hoveredDifficulty = difficulty;
      this.refresh();
    }
  }

  /**
   * Draws the information of the compared difficulties.
   */
  drawDifficultyInfo()
  {
    if (this.getAppliedDifficulty())
    {
      this.drawComparedDifficulties();
    }
  }

  /**
   * Draws the comparison between two difficulties, the one applied and the one being hovered
   * over by the cursor in the list.
   */
  drawComparedDifficulties()
  {
    // remove any residual formatting.
    this.resetFontSettings();

    // get the difficulties.
    const appliedDifficulty = this.getAppliedDifficulty();
    const hoveredDifficulty = this.getHoveredDifficulty();

    // draw the names.
    this.drawComparedDifficultyNames(0, 0, 600, appliedDifficulty, hoveredDifficulty);

    // establish some baselines for coordinates.
    const lh = this.lineHeight();
    const ox = 0;
    const oy = lh * 3;
    const bonusesOy = lh * 14;

    // draw all parameters.
    this.drawBParams(ox+40, oy, appliedDifficulty, hoveredDifficulty);
    this.drawSParams(ox+400, oy, appliedDifficulty, hoveredDifficulty);
    this.drawXParams(ox+800, oy, appliedDifficulty, hoveredDifficulty);

    // draw all bonus difficulty modifiers.
    this.drawDifficultyBonuses(ox+40, bonusesOy, appliedDifficulty, hoveredDifficulty);
  }

  /**
   * Draws the names of the two difficulties being compared.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawComparedDifficultyNames(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const lh = this.lineHeight();
    const modifiedX = x + 100;

    const currentY = lh * 0;
    this.drawText("Current:", x, currentY, w, "left");
    this.drawComparedDifficultyName(modifiedX, currentY, w, appliedDifficulty.iconIndex, appliedDifficulty.name);

    //this.drawText("→", x+150, y, w, "left");

    const hoveredY = lh * 1;
    this.drawText("Hovered:", x, hoveredY, w, "left");
    this.drawComparedDifficultyName(modifiedX, hoveredY, w, hoveredDifficulty.iconIndex, hoveredDifficulty.name);
  }

  /**
   * Draws the difficulty name at the designated location with its icon.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} iconIndex The index of the icon for the difficulty.
   * @param {string} difficultyName The name for the difficulty.
   */
  drawComparedDifficultyName(x, y, w, iconIndex, difficultyName)
  {
    this.drawIcon(iconIndex, x, y);
    this.drawText(`${difficultyName}`, x+32, y, w, "left");
  }

  /**
   * Draws all the b-parameters.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {Difficulty} appliedDifficulty The applied difficulty.
   * @param {Difficulty} hoveredDifficulty The hovered/potential difficulty.
   */
  drawBParams(x, oy, appliedDifficulty, hoveredDifficulty = null)
  {
    const lh = this.lineHeight();
    const {bparams} = appliedDifficulty;
    const hoveredBparams = hoveredDifficulty.bparams ?? [];
    bparams.forEach((bparam, index) =>
    {
      // determine the x:y for the applied rate.
      const paramY = (index * lh) + oy;
      const parameterWidth = 120;

      // get the icon index.
      const paramIconIndex = IconManager.param(index);

      // get the current param rate we're drawing.
      const appliedParamRate = bparam;

      // get the param name.
      const paramName = TextManager.param(index);

      // get the potential param rate to draw.
      const hoveredParamRate = hoveredBparams[index] ?? bparam;

      // determine if bigger is better for this parameter.
      const biggerIsBetter = this.biggerIsBetterBParameters(index);

      this.drawComparedParameters(
        x,
        paramY,
        parameterWidth,
        paramIconIndex,
        paramName,
        appliedParamRate,
        hoveredParamRate,
        biggerIsBetter);
    });
  }

  /**
   * Draws all the s-parameters.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {Difficulty} appliedDifficulty The applied difficulty.
   * @param {Difficulty} hoveredDifficulty The hovered/potential difficulty.
   */
  drawSParams(x, oy, appliedDifficulty, hoveredDifficulty = null)
  {
    const lh = this.lineHeight();
    const {sparams} = appliedDifficulty;
    const hoveredSparams = hoveredDifficulty.sparams ?? [];
    sparams.forEach((sparam, index) =>
    {
      // determine the x:y for the rate.
      const paramY = (index * lh) + oy;
      const parameterWidth = 120;

      // get the icon index.
      const paramIconIndex = IconManager.sparam(index);

      // get the param name.
      const paramName = TextManager.sparam(index);

      // get the current xparam rate we're drawing.
      const appliedParamRate = sparam;

      // get the potential xparam rate to draw.
      const hoveredParamRate = hoveredSparams[index] ?? sparam;

      // determine if bigger is better for this parameter.
      const biggerIsBetter = this.biggerIsBetterSParameters(index);

      this.drawComparedParameters(
        x,
        paramY,
        parameterWidth,
        paramIconIndex,
        paramName,
        appliedParamRate,
        hoveredParamRate,
        biggerIsBetter);
    });
  }

  /**
   * Draws all the x-parameters.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {Difficulty} appliedDifficulty The applied difficulty.
   * @param {Difficulty} hoveredDifficulty The hovered/potential difficulty.
   */
  drawXParams(x, oy, appliedDifficulty, hoveredDifficulty = null)
  {
    const lh = this.lineHeight();
    const {xparams} = appliedDifficulty;
    const hoveredXparams = hoveredDifficulty.xparams ?? [];
    xparams.forEach((xparam, index) =>
    {
      // determine the x:y for the rate.
      const paramY = (index * lh) + oy;
      const parameterWidth = 120;

      // get the icon index.
      const paramIconIndex = IconManager.xparam(index);

      // get the param name.
      const paramName = TextManager.xparam(index);

      // get the current param rate we're drawing.
      const appliedParamRate = xparam;

      // get the potential param rate to draw.
      const hoveredParamRate = hoveredXparams[index] ?? xparam;

      // determine if bigger is better for this parameter.
      const biggerIsBetter = this.biggerIsBetterXParameters(index);

      this.drawComparedParameters(
        x,
        paramY,
        parameterWidth,
        paramIconIndex,
        paramName,
        appliedParamRate,
        hoveredParamRate,
        biggerIsBetter);
    });
  }

  /**
   * Draws all difficulty bonuses.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {Difficulty} appliedDifficulty The applied difficulty.
   * @param {Difficulty} hoveredDifficulty The hovered/potential difficulty.
   */
  drawDifficultyBonuses(x, oy, appliedDifficulty, hoveredDifficulty = null)
  {
    const lh = this.lineHeight();
    const w = 120;

    const expRateY = oy + (lh * 0);
    this.drawDifficultyBonusExperience(x, expRateY, w, appliedDifficulty, hoveredDifficulty);

    const goldRateY = oy + (lh * 1);
    this.drawDifficultyBonusGold(x, goldRateY, w, appliedDifficulty, hoveredDifficulty);

    const sdpRateY = oy + (lh * 2);
    this.drawDifficultyBonusSdp(x, sdpRateY, w, appliedDifficulty, hoveredDifficulty);

    const dropsRateY = oy + (lh * 3);
    this.drawDifficultyBonusDrops(x, dropsRateY, w, appliedDifficulty, hoveredDifficulty);

    const encountersRateY = oy + (lh * 4);
    this.drawDifficultyBonusEncounters(x, encountersRateY, w, appliedDifficulty, hoveredDifficulty);
  }

  /**
   * Draws the bonus data for experience earned by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusExperience(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 87;
    const rateName = "EXP RATE";
    const appliedRate = appliedDifficulty.exp;
    const hoveredRate = hoveredDifficulty.exp ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws the bonus data for gold found by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusGold(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 2048;
    const rateName = "GOLD RATE";
    const appliedRate = appliedDifficulty.gold;
    const hoveredRate = hoveredDifficulty.gold ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws the bonus data for sdp acquired by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusSdp(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 445;
    const rateName = "SDP RATE";
    const appliedRate = appliedDifficulty.sdp;
    const hoveredRate = hoveredDifficulty.sdp ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws the bonus data for drop rates gained by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusDrops(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 208;
    const rateName = "DROP RATE";
    const appliedRate = appliedDifficulty.drops;
    const hoveredRate = hoveredDifficulty.drops ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws the bonus data for encountering enemies by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusEncounters(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 914;
    const rateName = "ENCOUNTER RATE";
    const appliedRate = appliedDifficulty.encounters;
    const hoveredRate = hoveredDifficulty.encounters ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws a pair of two compared parameters at the designated coordinates.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} paramIconIndex The icon index for the parameter.
   * @param {string} paramName The name of this parameter.
   * @param {number} appliedParameter The applied parameter- on the left.
   * @param {number} hoveredParameter The hovered/potential parameter- on the right.
   * @param {boolean} biggerIsBetter Whether or not bigger is better.
   */
  drawComparedParameters(x, y, w, paramIconIndex, paramName, appliedParameter, hoveredParameter, biggerIsBetter)
  {
    // draw the icon.
    this.drawComparedIcon(x, y, paramIconIndex);

    // draw the param name.
    this.drawComparedParamName(x, y, w, paramName);

    // draw the applied parameter- on the left.
    this.drawComparedAppliedParameter(x+150, y, w, appliedParameter);

    // draw the symbol representing the change- in the center.
    this.drawComparisonSymbol(x+150, y, w, appliedParameter, hoveredParameter, biggerIsBetter);

    // draw the hovered parameter- on the right.
    this.drawComparedHoveredParameter(x+150, y, w, appliedParameter, hoveredParameter, biggerIsBetter);
  }

  /**
   * Draws the icon for the parameter.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} paramIconIndex The icon index for the parameter.
   */
  drawComparedIcon(x, y, paramIconIndex)
  {
    // draw the icon first.
    this.drawIcon(paramIconIndex, x-40, y);
  }

  /**
   * Draws the name for the parameter.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {string} paramName The name of this parameter.
   */
  drawComparedParamName(x, y, w, paramName)
  {
    this.drawText(paramName, x, y, w, "left");
  }

  /**
   * Draws the currently applied parameter value.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} appliedParameter The value of the currently applied parameter.
   */
  drawComparedAppliedParameter(x, y, w, appliedParameter)
  {
    // reset font for this text.
    this.resetFontSettings();

    // draw the currently applied rate.
    this.drawText(`${appliedParameter}`, x, y, w, "left");

    // cleanup font settings.
    this.resetFontSettings();
  }

  /**
   * Draws the comparison symbol for two compared parameters.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} appliedParameter The applied parameter- on the left.
   * @param {number} hoveredParameter The hovered/potential parameter- on the right.
   * @param {boolean} biggerIsBetter Whether or not bigger is better.
   */
  drawComparisonSymbol(x, y, w, appliedParameter, hoveredParameter, biggerIsBetter)
  {
    // reset font for this text.
    this.resetFontSettings();

    // draw the symbol representing the change.
    const comparisonSymbol = this.getComparisonSymbol(biggerIsBetter, appliedParameter, hoveredParameter);
    this.drawText(`${comparisonSymbol}`, x, y, w, "center");

    // cleanup font settings.
    this.resetFontSettings();
  }

  /**
   * Draws the hovered/potential parameter on the left.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} appliedParameter The applied parameter- on the left.
   * @param {number} hoveredParameter The hovered/potential parameter- on the right.
   * @param {boolean} biggerIsBetter Whether or not bigger is better.
   */
  drawComparedHoveredParameter(x, y, w, appliedParameter, hoveredParameter, biggerIsBetter)
  {
    // swap the color to indicate at-a-glance the impact of this difficulty change.
    const hoveredColor = this.getComparedColor(biggerIsBetter, appliedParameter, hoveredParameter);
    this.changeTextColor(hoveredColor);

    // draw the currently hovered rate.
    this.drawText(`${hoveredParameter}`, x, y, w, "right");

    // cleanup font settings.
    this.resetFontSettings();
  }

  /**
   * Gets the symbol displayed between two compared parameters to indicate whether there is no
   * change, the change makes it easier, or the change makes it harder.
   * @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
   * @param {number} appliedParameter The currently applied parameter.
   * @param {number} targetParameter The potential parameter to change to.
   * @returns {string} A single character representing this change; could also just be a string.
   */
  getComparisonSymbol(biggerIsBetter, appliedParameter, targetParameter)
  {
    return "→";

    // TODO: maybe implement this someday.
    // const comparison = this.determineComparisonType(biggerIsBetter, appliedParameter, targetParameter);
    // switch (comparison)
    // {
    //   case Window_DifficultyDetails.ComparisonTypes.SAME:
    //     return '=';
    //   case Window_DifficultyDetails.ComparisonTypes.EASIER:
    //     return '😀';
    //   case Window_DifficultyDetails.ComparisonTypes.HARDER:
    //     return '😡';
    // }
  }

  /**
   * Gets the text color for the compared/hovered parameter value.
   * @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
   * @param {number} appliedParameter The currently applied parameter.
   * @param {number} targetParameter The potential parameter to change to.
   * @returns {string} The color string.
   */
  getComparedColor(biggerIsBetter, appliedParameter, targetParameter)
  {
    const comparison = this.determineComparisonType(biggerIsBetter, appliedParameter, targetParameter);
    switch (comparison)
    {
      case Window_DifficultyDetails.ComparisonTypes.SAME:
        return ColorManager.normalColor();
      case Window_DifficultyDetails.ComparisonTypes.EASIER:
        return "rgba(0, 192, 0, 0.8)";
      case Window_DifficultyDetails.ComparisonTypes.HARDER:
        return "rgba(192, 0, 0, 0.8)";
    }
  }

  /**
   * Determines whether or not one parameter is "better" than the other.
   * Contextually, this determines whether or not it would become easier for the player if said
   * parameter was changed to the next parameter. In most cases, reducing a parameter would make it
   * easier, so the boolean is typically set to false- but not always.
   * @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
   * @param {number} appliedParameter The currently applied parameter.
   * @param {number} targetParameter The potential parameter to change to.
   * @returns {Window_DifficultyDetails.ComparisonTypes} One of "SAME", "EASIER", or "HARDER".
   */
  determineComparisonType(biggerIsBetter, appliedParameter, targetParameter)
  {
    const isSame = (appliedParameter === targetParameter);
    const targetParameterBigger = (appliedParameter < targetParameter);
    const isImprovement = (biggerIsBetter === targetParameterBigger);
    if (isSame)
    {
      return Window_DifficultyDetails.ComparisonTypes.SAME;
    }
    else if (isImprovement)
    {
      // the hovered parameter is changed color to indicate it will become easier.
      return Window_DifficultyDetails.ComparisonTypes.EASIER;
    }
    else if (!isImprovement)
    {
      // the hovered parameter is changed color to indicate it will become harder.
      return Window_DifficultyDetails.ComparisonTypes.HARDER;
    }

  }

  /**
   * Get whether or not bigger is better for a b-parameter contextually for the player.
   * @param {number} bparamId The b-parameter id.
   * @returns {boolean} True if it is better for the player when bigger, false otherwise.
   */
  biggerIsBetterBParameters(bparamId)
  {
    const biggerIsBetterBParameters = [
      false, // mhp
      false, // mmp
      false, // atk
      false, // def
      false, // mat
      false, // mdf
      false, // agi
      false, // luk
    ];

    return biggerIsBetterBParameters[bparamId] ?? false;
  }

  /**
   * Get whether or not bigger is better for an s-parameter contextually for the player.
   * @param {number} sparamId The s-parameter id.
   * @returns {boolean} True if it is better for the player when bigger, false otherwise.
   */
  biggerIsBetterSParameters(sparamId)
  {
    const biggerIsBetterSParameters = [
      false,  // tgr - aggro rate - used by JABS.
      false,  // grd - guard rate - parry rate in JABS.
      false,  // rec - recovery effectiveness rate.
      false,  // pha - item effectiveness rate - not usually used by enemies.
      true,   // mcr - mp cost reduction.
      true,   // tcr - tp cost reduction - not usually used by enemies.
      true,   // pdr - physical damage reduction.
      true,   // mdr - magic damage reduction.
      true,   // fdr - floor damage rate - not usually used by enemies.
      false,  // exr - experience rate - not usually used by enemies.
    ];

    return biggerIsBetterSParameters[sparamId] ?? true;
  }

  /**
   * Get whether or not bigger is better for an s-parameter contextually for the player.
   * @param {number} xparamId The x-parameter id.
   * @returns {boolean} True if it is better for the player when bigger, false otherwise.
   */
  biggerIsBetterXParameters(xparamId)
  {
    const biggerIsBetterXParameters = [
      false, // hit - hit rate
      false, // eva - parry rate boost %
      false, // cri - crit rate
      false, // cev - crit evade
      false, // mev - magic evade ; not used in JABS
      false, // mrf - magic reflect ; not used in JABS
      false, // cnt - counter rate
      false, // hrg - hp regen per 5
      false, // mrg - mp regen per 5
      false, // trg - tp regen per 5
    ];

    return biggerIsBetterXParameters[xparamId] ?? true;
  }
}
//#endregion Window_DifficultyDetails