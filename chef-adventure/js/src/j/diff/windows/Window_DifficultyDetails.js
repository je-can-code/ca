//#region Window_DifficultyDetails
class Window_DifficultyDetails extends Window_Base 
{
  /**
   * The difficulty being hovered over from the list.
   * @type {DifficultyLayer}
   */
  hoveredDifficulty = null;

  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect) 
  {
    // construct parent class.
    super(rect);

    // refresh this window.
    this.refresh();
  }

  /**
   * The types of comparison that are valid when comparing parameter values.
   */
  static ComparisonTypes = {
    SAME: "same",
    EASIER: "easier",
    HARDER: "harder",
  };

  /**
   * Gets the difficulty currently applied to the player.
   * @returns {DifficultyLayer}
   */
  getAppliedDifficulty()
  {
    return $gameTemp.getAppliedDifficulty();
  }

  /**
   * Gets the difficulty currently being hovered over in the list.
   * @returns {DifficultyLayer}
   */
  getHoveredDifficulty()
  {
    return this.hoveredDifficulty;
  }

  /**
   * Sets the hovered difficulty.
   * @param {DifficultyLayer} difficulty The new hovered difficulty.
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
   * Draws the information of the compared difficulties.
   */
  drawDifficultyInfo() 
  {
    // check if the difficulty info can be drawn right now.
    if (this.canDrawDifficultyInfo())
    {
      // draw the difficulty.
      this.drawDifficulty();
    }
  }

  /**
   * Determines whether or not the difficulty info can be drawn.
   * @returns {boolean}
   */
  canDrawDifficultyInfo()
  {
    // we cannot draw difficulty info if we don't have at least an applied difficulty.
    if (!this.getAppliedDifficulty()) return false;

    // draw the difficulty info!
    return true;
  }

  /**
   * Draws a single difficulty layer and all its relevant information.
   */
  drawDifficulty()
  {
    // remove any residual formatting.
    this.resetFontSettings();

    // get the difficulties.
    const hoveredDifficulty = this.getHoveredDifficulty();

    // draw the names.
    this.drawDifficultyName(0, 0, 600, hoveredDifficulty);


    // establish some baselines for coordinates.
    const lh = this.lineHeight();
    const ox = 0;
    const oy = lh * 2;
    const bonusesOy = lh * 14;

    // draw all parameters.
    this.drawBParams(ox + 40, oy, hoveredDifficulty);
    this.drawSParams(ox + 320, oy, hoveredDifficulty);
    this.drawXParams(ox + 600, oy, hoveredDifficulty);

    // draw all bonus difficulty modifiers.
    this.drawDifficultyBonuses(ox + 40, bonusesOy, hoveredDifficulty);
  }

  /**
   * Draws the difficulty name with its icon.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {DifficultyLayer} difficulty The currently applied difficulty.
   */
  drawDifficultyName(x, y, w, difficulty)
  {
    // draw the icon for the difficulty.
    this.drawIcon(difficulty.iconIndex, x, y);

    // draw the name of the difficulty.
    this.drawText(`${difficulty.name}`, x + 32, y, w, "left");
  }

  /**
   * Draws all the b-parameters.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {DifficultyLayer} difficultyLayer The difficulty to display data for.
   */
  drawBParams(x, oy, difficultyLayer)
  {
    // if we have no difficulty, then do not draw.
    if (!difficultyLayer) return;

    // shorthand the height.
    const lh = this.lineHeight();

    // iterate over each of the params.
    difficultyLayer.bparams.forEach((bparam, index) =>
    {
      // determine the x:y for the applied rate.
      const paramY = (index * lh) + oy;
      const paramWidth = 120;

      // get the icon index.
      const paramIconIndex = IconManager.param(index);

      // get the param name.
      const paramName = TextManager.param(index);

      // get the current param rate we're drawing.
      const paramValue = bparam;

      // determine if bigger is better for this parameter.
      const biggerIsBetter = this.biggerIsBetterBParameters(index);

      // draw the parameter.
      this.drawDifficultyParam(
        x,
        paramY,
        paramWidth,
        paramIconIndex,
        paramName,
        paramValue,
        biggerIsBetter);
    });
  }

  /**
   * Draws all the s-parameters.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {DifficultyLayer} difficultyLayer The difficulty to display data for.
   */
  drawSParams(x, oy, difficultyLayer)
  {
    // if we have no difficulty, then do not draw.
    if (!difficultyLayer) return;

    // shorthand the height.
    const lh = this.lineHeight();

    // iterate over each of the params.
    difficultyLayer.sparams.forEach((sparam, index) =>
    {
      // determine the x:y for the rate.
      const paramY = (index * lh) + oy;
      const paramWidth = 120;

      // get the icon index.
      const paramIconIndex = IconManager.sparam(index);

      // get the param name.
      const paramName = TextManager.sparam(index);

      // get the current xparam rate we're drawing.
      const paramValue = sparam;

      // determine if bigger is better for this parameter.
      const biggerIsBetter = this.biggerIsBetterSParameters(index);

      // draw the parameter.
      this.drawDifficultyParam(
        x,
        paramY,
        paramWidth,
        paramIconIndex,
        paramName,
        paramValue,
        biggerIsBetter);
    });
  }

  /**
   * Draws all the x-parameters.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {DifficultyLayer} difficultyLayer The difficulty to display data for.
   */
  drawXParams(x, oy, difficultyLayer)
  {
    // if we have no difficulty, then do not draw.
    if (!difficultyLayer) return;

    // shorthand the height.
    const lh = this.lineHeight();

    // iterate over each of the params.
    difficultyLayer.xparams.forEach((xparam, index) =>
    {
      // determine the x:y for the rate.
      const paramY = (index * lh) + oy;
      const paramWidth = 120;

      // get the icon index.
      const paramIconIndex = IconManager.xparam(index);

      // get the param name.
      const paramName = TextManager.xparam(index);

      // get the current param rate we're drawing.
      const paramValue = xparam;

      // determine if bigger is better for this parameter.
      const biggerIsBetter = this.biggerIsBetterXParameters(index);

      // draw the parameter.
      this.drawDifficultyParam(
        x,
        paramY,
        paramWidth,
        paramIconIndex,
        paramName,
        paramValue,
        biggerIsBetter);
    });
  }

  /**
   * Draws all difficulty bonuses.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {DifficultyLayer} difficultyLayer The difficulty to display data for.
   */
  drawDifficultyBonuses(x, oy, difficultyLayer)
  {
    // if we have no difficulty, then do not draw.
    if (!difficultyLayer) return;

    // shorthand the height.
    const lh = this.lineHeight();

    // all bonuses have the same width.
    const w = 120;

    // coordinate exp.
    const expRateY = oy + (lh * 0);
    this.drawDifficultyBonusExperience(x, expRateY, w, difficultyLayer);

    // coordinate gold.
    const goldRateY = oy + (lh * 1);
    this.drawDifficultyBonusGold(x, goldRateY, w, difficultyLayer);

    // coordinate sdp.
    const sdpRateY = oy + (lh * 2);
    this.drawDifficultyBonusSdp(x, sdpRateY, w, difficultyLayer);

    // coordinate drops.
    const dropsRateY = oy + (lh * 3);
    this.drawDifficultyBonusDrops(x, dropsRateY, w, difficultyLayer);

    //const encountersRateY = oy + (lh * 4);
    //this.drawDifficultyBonusEncounters(x, encountersRateY, w, difficultyLayer);
  }

  /**
   * Draws the bonus data for experience earned by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {DifficultyLayer} difficultyLayer The difficulty to display data for.
   */
  drawDifficultyBonusExperience(x, y, w, difficultyLayer)
  {
    // determine the icon for this bonus.
    const rateIconIndex = IconManager.rewardParam(0);

    // determine the name for this bonus.
    const rateName = `${TextManager.rewardParam(0)} RATE`;

    // grab the rate.
    const { exp } = difficultyLayer;

    // draw the parameter.
    this.drawDifficultyParam(x, y, w, rateIconIndex, rateName, exp, true);
  }

  /**
   * Draws the bonus data for gold found by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {DifficultyLayer} difficultyLayer The difficulty to display data for.
   */
  drawDifficultyBonusGold(x, y, w, difficultyLayer)
  {
    // determine the icon for this bonus.
    const rateIconIndex = IconManager.rewardParam(1);

    // determine the name for this bonus.
    const rateName = `${TextManager.rewardParam(1)} RATE`;

    // grab the rate.
    const { gold } = difficultyLayer;

    // draw the parameter.
    this.drawDifficultyParam(x, y, w, rateIconIndex, rateName, gold, true);
  }

  /**
   * Draws the bonus data for drop rates gained by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {DifficultyLayer} difficultyLayer The difficulty to display data for.
   */
  drawDifficultyBonusDrops(x, y, w, difficultyLayer)
  {
    // determine the icon for this bonus.
    const rateIconIndex = IconManager.rewardParam(2);

    // determine the name for this bonus.
    const rateName = `${TextManager.rewardParam(2)} RATE`;

    // grab the rate.
    const { drops } = difficultyLayer;

    // draw the parameter.
    this.drawDifficultyParam(x, y, w, rateIconIndex, rateName, drops, true);
  }

  /**
   * Draws the bonus data for encountering enemies by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {DifficultyLayer} difficultyLayer The difficulty to display data for.
   */
  drawDifficultyBonusEncounters(x, y, w, difficultyLayer)
  {
    // determine the icon for this bonus.
    const rateIconIndex = IconManager.rewardParam(3);

    // determine the name for this bonus.
    const rateName = `${TextManager.rewardParam(3)} RATE`;

    // grab the rate.
    const { encounters } = difficultyLayer;

    // draw the parameter.
    this.drawDifficultyParam(x, y, w, rateIconIndex, rateName, encounters, true);
  }

  /**
   * Draws the bonus data for sdp acquired by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {DifficultyLayer} difficultyLayer The difficulty to display data for.
   */
  drawDifficultyBonusSdp(x, y, w, difficultyLayer)
  {
    // determine the icon for this bonus.
    const rateIconIndex = IconManager.rewardParam(4);

    // determine the name for this bonus.
    const rateName = `${TextManager.rewardParam(4)} RATE`;

    // grab the rate.
    const { sdp } = difficultyLayer;

    // draw the parameter.
    this.drawDifficultyParam(x, y, w, rateIconIndex, rateName, sdp, true);
  }

  /**
   * Draws a single parameter in the context of difficulty modifiers.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} paramIconIndex The icon index to render with the modifier.
   * @param {string} paramName The name of the parameter.
   * @param {number} paramValue The value of the modifier.
   * @param {boolean} biggerIsBetter True if bigger is better, false otherwise.
   */
  drawDifficultyParam(x, y, w, paramIconIndex, paramName, paramValue, biggerIsBetter)
  {
    // reset font for this text.
    this.resetFontSettings();

    // draw the icon.
    this.drawIcon(paramIconIndex, x-40, y);

    // draw the param name.
    this.drawText(paramName, x, y, w, "left");

    // determine the compared color against the default.
    const comparedColor = this.getComparedColor(biggerIsBetter, paramValue, 100);

    // change the text color.
    this.changeTextColor(comparedColor);

    // initialize the parameter value's sign to indicate increase/decrease from default.
    let paramSign = String.empty;

    // check if greater than default.
    if (paramValue > 100)
    {
      // add a plus.
      paramSign = `+`;
    }

    // draw the currently applied rate with its sign if applicable.
    this.drawText(`${paramSign}${paramValue-100}`, x+150, y, w, "left");

    // cleanup font settings.
    this.resetFontSettings();
  }

  /**
   * Gets the text color for the compared/hovered parameter value.
   * @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
   * @param {number} paramValue The currently applied parameter.
   * @param {number} comparisonValue The potential parameter to change to.
   * @returns {string} The color string.
   */
  getComparedColor(biggerIsBetter, paramValue, comparisonValue)
  {
    const comparison = this.determineComparisonType(biggerIsBetter, paramValue, comparisonValue);
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
   * @param {number} baseValue The currently applied parameter.
   * @param {number} comparisonValue The potential parameter to change to.
   * @returns {Window_DifficultyDetails.ComparisonTypes} One of "SAME", "EASIER", or "HARDER".
   */
  determineComparisonType(biggerIsBetter, baseValue, comparisonValue)
  {
    const isSame = (baseValue === comparisonValue);
    const baseIsBigger = (baseValue > comparisonValue);
    const isImprovement = (biggerIsBetter === baseIsBigger);
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

    return biggerIsBetterBParameters.at(bparamId) ?? false;
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