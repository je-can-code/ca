//region Window_DifficultyEffects
class Window_DifficultyEffects extends Window_Command
{
  /**
   * The difficulty being hovered over from the list.
   * @type {DifficultyBattlerEffects}
   */
  hoveredEffects = null;

  hoveredBonuses = null;

  /**
   * The type of effects being displayed in this list.
   * @type {Window_DifficultyEffects.EffectsTypes}
   */
  hoveredEffectsType = String.empty;

  /**
   * Constructor.
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
   * The types of effects that can be listed in this window.
   */
  static EffectsTypes = {
    ACTOR: "actor",
    ENEMY: "enemy",
  };

  /**
   * Gets the list of battler effects that this window is displaying.
   * @returns {DifficultyBattlerEffects}
   */
  getEffectsList()
  {
    return this.hoveredEffects;
  }

  /**
   * Sets the list of effects that this window is displaying.
   * @param {DifficultyBattlerEffects} effectsList The new effects list.
   */
  setEffectsList(effectsList)
  {
    // don't update if it doesn't need updating.
    if (this.hoveredEffects === effectsList) return;

    // update the effects list.
    this.hoveredEffects = effectsList;
  }

  /**
   * Gets the type of battler effects that this window is displaying.
   * @returns {DifficultyBattlerEffects}
   */
  getEffectsType()
  {
    return this.hoveredEffectsType;
  }

  /**
   * Sets the type of effects that will display in this list.
   * @param {Window_DifficultyEffects.EffectsTypes} effectsType The new effects type.
   */
  setEffectsType(effectsType)
  {
    // don't update if it doesn't need updating.
    if (this.hoveredEffectsType === effectsType) return;

    // update the effects type.
    this.hoveredEffectsType = effectsType;
  }

  /**
   * Gets the effect bonuses that will display in this list.
   * @returns {DifficultyBonusEffects|null}
   */
  getEffectsBonuses()
  {
    return this.hoveredBonuses;
  }

  /**
   * Sets the effect bonuses that will display in this list.
   * @param {DifficultyBonusEffects} bonuses The new bonuses.
   */
  setEffectsBonuses(bonuses)
  {
    if (this.hoveredBonuses === bonuses) return;

    // update the effects bonuses.
    this.hoveredBonuses = bonuses;
  }

  /**
   * Updates the contents of this window with new data.
   * @param {DifficultyBattlerEffects} effectsList The new effects list.
   * @param {DifficultyBonusEffects} effectBonuses The new bonuses list.
   * @param {Window_DifficultyEffects.EffectsTypes} effectsType The new effects type.
   */
  updateEffects(effectsList, effectBonuses, effectsType)
  {
    // update the effects type.
    this.setEffectsType(effectsType);

    // update the effects list.
    this.setEffectsList(effectsList);

    // update the effects bonuses.
    this.setEffectsBonuses(effectBonuses);

    // refresh the window.
    this.refresh();
  }

  /**
   * Implements {@link #makeCommandList}.
   * Renders all the effect of the hovered difficulty layer.
   */
  makeCommandList()
  {
    // grab the applied difficulty
    const effectsList = this.getEffectsList();

    // if there is no hovered difficulty, then don't render this.
    if (!effectsList) return;

    // extract the data out of the hovered difficulty.
    const { bparams, xparams, sparams } = effectsList;

    // initialize our command collection for enemies.
    const battlerEffectsCommands = Array.empty;

    // build the command.
    const effectsTitleCommand = this.buildTitleCommand();

    // add the title command.
    battlerEffectsCommands.push(effectsTitleCommand);

    // build the various commands from the difficulty for enemies.
    const bparamCommands = bparams
      .map(this.buildBParamCommand, this)
      .filter(command => !!command);
    const xparamCommands = xparams
      .map(this.buildXParamCommand, this)
      .filter(command => !!command);
    const sparamCommands = sparams
      .map(this.buildSParamCommand, this)
      .filter(command => !!command);

    // add the commands to the running list.
    battlerEffectsCommands.push(...bparamCommands);
    battlerEffectsCommands.push(...xparamCommands);
    battlerEffectsCommands.push(...sparamCommands);

    const bonusCommands = this.bonusEffectsCommands();

    battlerEffectsCommands.push(...bonusCommands);

    // add all the commands to the enemy effects.
    battlerEffectsCommands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all bonus effects commands.
   * @returns {BuiltWindowCommand[]}
   */
  bonusEffectsCommands()
  {
    // pivot on effects type.
    switch (this.getEffectsType())
    {
      case Window_DifficultyEffects.EffectsTypes.ACTOR:
        return this.bonusActorEffects();
      case Window_DifficultyEffects.EffectsTypes.ENEMY:
        return this.bonusEnemyEffects();
    }
  }

  /**
   * Builds all bonus effects applicable to enemies.
   * @returns {BuiltWindowCommand[]}
   */
  bonusEnemyEffects()
  {
    // grab the current effects bonuses.
    const bonuses = this.getEffectsBonuses();

    // if there are no bonuses, then do not process.
    if (!bonuses) return Array.empty;

    // initialize the bonuses collection.
    const bonusCommands = Array.empty;

    // check if the experience bonus is modified.
    if (bonuses.exp !== 100)
    {
      // determine the value.
      const paramValue = bonuses.exp;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(0);

      // get the param name.
      const paramName = TextManager.rewardParam(0);

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(0);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // check if the gold bonus is modified.
    if (bonuses.gold !== 100)
    {
      // determine the value.
      const paramValue = bonuses.gold;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(1);

      // get the param name.
      const paramName = TextManager.rewardParam(1);

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(1);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // check if the drops bonus is modified.
    if (bonuses.drops !== 100)
    {
      // determine the value.
      const paramValue = bonuses.drops;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(2);

      // get the param name.
      const paramName = TextManager.rewardParam(2);

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(2);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // check if the sdp bonus is modified.
    if (bonuses.sdp !== 100)
    {
      // determine the value.
      const paramValue = bonuses.sdp;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(4);

      // get the param name.
      const paramName = TextManager.sdpPoints();

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(4);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // return the built bonus commands.
    return bonusCommands;
  }

  /**
   * Builds all bonus effects applicable to actors.
   * @returns {BuiltWindowCommand[]}
   */
  bonusActorEffects()
  {
    // grab the current effects bonuses.
    const bonuses = this.getEffectsBonuses();

    // if there are no bonuses, then do not process.
    if (!bonuses) return Array.empty;

    // initialize the bonuses collection.
    const bonusCommands = Array.empty;

    if (bonuses.encounters !== 100)
    {
      // determine the value.
      const paramValue = bonuses.encounters;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(3);

      // get the param name.
      const paramName = TextManager.rewardParam(3);

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(3);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // return the built bonus commands.
    return bonusCommands;
  }

  buildTitleCommand()
  {
    switch (this.getEffectsType())
    {
      case Window_DifficultyEffects.EffectsTypes.ACTOR:
        return this.buildActorTitleCommand();
      case Window_DifficultyEffects.EffectsTypes.ENEMY:
        return this.buildEnemyTitleCommand();
    }

    // build the command.
    return new WindowCommandBuilder("Effects")
      .setIconIndex(93)
      .setColorIndex(6)
      .build();
  }

  buildEnemyTitleCommand()
  {
    // build the command.
    return new WindowCommandBuilder("Enemy Effects")
      .setIconIndex(14)
      .setColorIndex(2)
      .build();
  }

  buildActorTitleCommand()
  {
    // build the command.
    return new WindowCommandBuilder("Actor Effects")
      .setIconIndex(82)
      .setColorIndex(1)
      .build();
  }

  buildBParamCommand(paramValue, index)
  {
    // don't render commands for unchanged parameters.
    if (paramValue === 100) return;

    // get the icon index.
    const paramIconIndex = IconManager.param(index);

    // get the param name.
    const paramName = TextManager.param(index);

    // get the description of the parameter.
    const paramDescription = TextManager.bparamDescription(index);

    // initialize the parameter value's sign to indicate increase/decrease from default.
    let paramSign = String.empty;

    // check if greater than default.
    if (paramValue > 100)
    {
      // add a plus.
      paramSign = `+`;
    }

    // determine the compared color against the default.
    const paramColorIndex = this.getComparedColor(
      this.biggerIsBetterBParameters(index),
      paramValue,
      100);

    // build the command.
    const paramCommand = new WindowCommandBuilder(paramName)
      .setIconIndex(paramIconIndex)
      .setRightText(`${paramSign}${paramValue-100}`)
      .setColorIndex(paramColorIndex)
      .addSubTextLines(paramDescription)
      .build();

    // return the built command.
    return paramCommand;
  }

  buildXParamCommand(paramValue, index)
  {
    // don't render commands for unchanged parameters.
    if (paramValue === 100) return;

    // get the icon index.
    const paramIconIndex = IconManager.xparam(index);

    // get the param name.
    const paramName = TextManager.xparam(index);

    // get the description of the parameter.
    const paramDescription = TextManager.xparamDescription(index);

    // initialize the parameter value's sign to indicate increase/decrease from default.
    let paramSign = String.empty;

    // check if greater than default.
    if (paramValue > 100)
    {
      // add a plus.
      paramSign = `+`;
    }

    // determine the compared color against the default.
    const paramColorIndex = this.getComparedColor(
      this.biggerIsBetterXParameters(index),
      paramValue,
      100);

    // build the command.
    const paramCommand = new WindowCommandBuilder(paramName)
      .setIconIndex(paramIconIndex)
      .setRightText(`${paramSign}${paramValue-100}`)
      .setColorIndex(paramColorIndex)
      .addSubTextLines(paramDescription)
      .build();

    // return the built command.
    return paramCommand;
  }

  buildSParamCommand(paramValue, index)
  {
    // don't render commands for unchanged parameters.
    if (paramValue === 100) return;

    // get the icon index.
    const paramIconIndex = IconManager.sparam(index);

    // get the param name.
    const paramName = TextManager.sparam(index);

    // get the description of the parameter.
    const paramDescription = TextManager.sparamDescription(index);

    // initialize the parameter value's sign to indicate increase/decrease from default.
    let paramSign = String.empty;

    // check if greater than default.
    if (paramValue > 100)
    {
      // add a plus.
      paramSign = `+`;
    }

    // determine the compared color against the default.
    const paramColorIndex = this.getComparedColor(
      this.biggerIsBetterSParameters(index),
      paramValue,
      100);

    // build the command.
    const paramCommand = new WindowCommandBuilder(paramName)
      .setIconIndex(paramIconIndex)
      .setRightText(`${paramSign}${paramValue-100}`)
      .setColorIndex(paramColorIndex)
      .addSubTextLines(paramDescription)
      .build();

    // return the built command.
    return paramCommand;
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

    if (this.getEffectsType() === Window_DifficultyEffects.EffectsTypes.ENEMY)
    {
      switch (comparison)
      {
        case Window_DifficultyEffects.ComparisonTypes.SAME:
          return 0;
        case Window_DifficultyEffects.ComparisonTypes.EASIER:
          return 29;
        case Window_DifficultyEffects.ComparisonTypes.HARDER:
          return 10;
      }
    }

    if (this.getEffectsType() === Window_DifficultyEffects.EffectsTypes.ACTOR)
    {
      switch (comparison)
      {
        case Window_DifficultyEffects.ComparisonTypes.SAME:
          return 0;
        case Window_DifficultyEffects.ComparisonTypes.HARDER:
          return 29;
        case Window_DifficultyEffects.ComparisonTypes.EASIER:
          return 10;
      }
    }
  }

  getComparedBonusColor(biggerIsBetter, paramValue, comparisonValue)
  {
    const comparison = this.determineComparisonType(biggerIsBetter, paramValue, comparisonValue);
    switch (comparison)
    {
      case Window_DifficultyEffects.ComparisonTypes.SAME:
        return 0;
      case Window_DifficultyEffects.ComparisonTypes.EASIER:
        return 29;
      case Window_DifficultyEffects.ComparisonTypes.HARDER:
        return 10;
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
   * @returns {Window_DifficultyEffects.ComparisonTypes} One of "SAME", "EASIER", or "HARDER".
   */
  determineComparisonType(biggerIsBetter, baseValue, comparisonValue)
  {
    const isSame = (baseValue === comparisonValue);
    const baseIsBigger = (baseValue > comparisonValue);
    const isImprovement = (biggerIsBetter === baseIsBigger);
    if (isSame)
    {
      return Window_DifficultyEffects.ComparisonTypes.SAME;
    }
    else if (isImprovement)
    {
      // the hovered parameter is changed color to indicate it will become easier.
      return Window_DifficultyEffects.ComparisonTypes.EASIER;
    }
    else if (!isImprovement)
    {
      // the hovered parameter is changed color to indicate it will become harder.
      return Window_DifficultyEffects.ComparisonTypes.HARDER;
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

  /**
   * Overwrites {@link #itemHeight}.
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 2;
  }
}
//endregion Window_DifficultyEffects