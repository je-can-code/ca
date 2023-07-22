//region Window_MoreEquipData
/**
 * A window designed to display "more" data associated with the equipment.
 */
class Window_MoreEquipData extends Window_MoreData
{
  constructor(rect)
  {
    super(rect);
    this.contentsBack.paintOpacity = 255;
  }

  /**
   * Compiles the "more data" for the currently selected equipment.
   */
  makeCommandList()
  {
    // perform base logic.
    super.makeCommandList();

    // check whether or not we can build commands.
    if (!this.canBuildCommands())
    {
      // at least adjust the window height for the no-commands.
      this.adjustWindowHeight();

      // stop processing.
      return;
    }

    // build all the various commands for this data window.
    this.buildCommands();

    // always adjust after determining the commands.
    this.adjustWindowHeight();
  }

  /**
   * Determines whether or not commands for the "more data" window can be built.
   * @returns {boolean} True if the commands can be built, false otherwise.
   */
  canBuildCommands()
  {
    // if there is no item, we cannot build commands.
    if (!this.item) return false;

    // if there is no actor, we cannot build commands.
    if (!this.actor) return false;

    // we can build commands!
    return true;
  }

  /**
   * Build all commands for this particular hovered item.
   */
  buildCommands()
  {
    // add jafting-related data.
    this.addJaftingRefinementData();

    // add all the b-params from the database.
    this.addBaseParameterData();

    // add all various JABS-related data from equipment.
    this.addJabsEquipmentData();

    // add all the traits from the database.
    this.addEquipmentTraitData();
  }

  /**
   * Add any applicable base parameter commands from the equipment.
   */
  addBaseParameterData()
  {
    // an iterator function for adding b-params to the list.
    const forEacher = (value, paramIdIndex) =>
    {
      // skip falsy values.
      if (!value) return;

      // determine the base parameter values for the item.
      const baseValue = this.item.params[paramIdIndex];

      // define the command name.
      const commandName = `${TextManager.param(paramIdIndex)}: ${baseValue}`;

      // build the command.
      const command = new WindowCommandBuilder(commandName)
        .setIconIndex(IconManager.param(paramIdIndex))
        .build();

      // add the skill command to the list.
      this.addBuiltCommand(command);
    };

    // add all valid b-params to the list.
    this.item.params.forEach(forEacher, this);
  }

  /**
   * Adds all commands related to JABS on the equipment.
   */
  addJabsEquipmentData()
  {
    // add the hit count.
    this.addHitsCommand();

    // add all added and combo skills.
    this.addSkillCommands();

    // add the move speed boost.
    this.addSpeedBoostCommand();
  }

  /**
   * Add the "bonus hits" command.
   * Usually goes on weapons, but if bonus hits exist on other
   * types of equipment, then we'll report those, too.
   */
  addHitsCommand()
  {
    // grab the bonus hits out of the item.
    const { jabsBonusHits } = this.item;

    // check if this is a weapon.
    const isWeapon = this.item.isWeapon();

    // weapons have a default bonus of +1 hits.
    let bonusHits = jabsBonusHits ?? 0;

    // if there is no bonus hits, and this isn't a weapon, don't list 0 hits.
    if (!(bonusHits || isWeapon)) return;

    // define the command name depending on whether or not we its a weapon.
    let commandName = `Bonus Hits`;

    // check if this is a weapon.
    if (isWeapon)
    {
      // weapons by default have a hit.
      bonusHits += 1;

      // weapons will instead have a hit count total including bonus hits.
      commandName = `Hit Count`;
    }

    // define the command name.
    const hitBonusCommand = `${commandName}: x${bonusHits}`;

    // its very long, so lets do that icon calculation here.
    const hitBonusIcon = IconManager.jabsParameterIcon(IconManager.JABS_PARAMETER.BONUS_HITS);

    // build the skill command.
    const command = new WindowCommandBuilder(hitBonusCommand)
      .setIconIndex(hitBonusIcon)
      .build();

    // add the skill command to the list.
    this.addBuiltCommand(command);
  }

  /**
   * Add the the appropriate skill and combo commands as-needed.
   */
  addSkillCommands()
  {
    // grab the skill id from the skill.
    const { jabsSkillId } = this.item;

    // if there is no skill, then there is no skill command.
    if (!jabsSkillId) return;

    // determine the skill.
    const skill = this.actor.skill(jabsSkillId);

    // build the combo list.
    const comboSkillList = skill.getComboSkillIdList(this.actor);

    // check if this is main or offhand slot.
    let baseAttackSkillCommand = this.item.isArmor()
      ? `Offhand Skill`
      : `Attack Skill`;

    // identify if there is a combo here or not.
    const hasCombo = comboSkillList.length > 0;

    // only modify the effect name if we have combos.
    if (hasCombo)
    {
      // rename the command to combo starter.
      baseAttackSkillCommand = `Combo Starter`;
    }

    // determine the actual skill.
    const { name, iconIndex } = skill;

    // define the command name.
    const attackSkillCommand = `${baseAttackSkillCommand}: \\C[2]${name}\\C[0]`;

    // build the skill command.
    const command = new WindowCommandBuilder(attackSkillCommand)
      .setIconIndex(iconIndex)
      .build();

    // add the skill command to the list.
    this.addBuiltCommand(command);

    // check if we have combos before we start trying to add them.
    if (hasCombo)
    {
      // an iterator function for building and adding combo commands to the list.
      const forEacher = (comboSkillId, index) =>
      {
        // grab the combo skill.
        const comboSkill = this.actor.skill(comboSkillId);

        // define the combo skill name.
        const comboSkillCommandName = `Combo Skill ${index + 1}: \\C[2]${comboSkill.name}\\C[0]`;

        // build the combo skill command.
        const comboCommand = new WindowCommandBuilder(comboSkillCommandName)
          .setIconIndex(iconIndex)
          .build();

        // add the combo skill command to the list.
        this.addBuiltCommand(comboCommand);
      };

      // iterate over the combos and add them.
      comboSkillList.forEach(forEacher, this);
    }
  }

  /**
   * Add any speed boost adjustments from the equipment.
   */
  addSpeedBoostCommand()
  {
    // grab the data out of the item.
    const { jabsSpeedBoost } = this.item;

    // if there is no speed boost, then do not render the data.
    if (!jabsSpeedBoost) return;

    // define the command name.
    const speedBoostCommand = `Speed Boost: ${jabsSpeedBoost}`;

    // its very long, so lets do that icon calculation here.
    const speedBoostIcon = IconManager.jabsParameterIcon(IconManager.JABS_PARAMETER.SPEED_BOOST);

    // build the speed boost command.
    const command = new WindowCommandBuilder(speedBoostCommand)
      .setIconIndex(speedBoostIcon)
      .build();

    // add the skill command to the list.
    this.addBuiltCommand(command);
  }

  /**
   * Adds all commands related to JAFTING on the equipment.
   */
  addJaftingRefinementData()
  {
    const {
      jaftingMaxRefineCount,
      jaftingMaxTraitCount,
      jaftingNotRefinementBase,
      jaftingNotRefinementMaterial,
      jaftingRefinedCount,
      jaftingUnrefinable,
    } = this.item;

    if (jaftingUnrefinable)
    {
      const unrefinableCommand = `Unrefinable`;
      const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.UNREFINABLE);
      const unrefinableColor = 2;
      this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
      return;
    }

    if (jaftingNotRefinementBase)
    {
      const unrefinableCommand = `Only Refine as Material`;
      const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.NOT_BASE);
      const unrefinableColor = 2;
      this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
    }

    if (jaftingNotRefinementMaterial)
    {
      const unrefinableCommand = `Only Refine as Base`;
      const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.NOT_MATERIAL);
      const unrefinableColor = 2;
      this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
    }

    let maxRefineCommand = `Refinement: ${jaftingRefinedCount}`;
    let maxRefineIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.TIMES_REFINED);
    if (jaftingMaxRefineCount)
    {
      maxRefineCommand += ` / ${jaftingMaxRefineCount}`;
      if (jaftingMaxRefineCount === jaftingRefinedCount)
      {
        maxRefineIcon = 91;
      }
    }

    this.addCommand(maxRefineCommand, null, true, null, maxRefineIcon);

    const maxTraitIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.MAX_TRAITS);
    const currentTraitCount = $gameJAFTING.parseTraits(this.item).length;
    let maxTraitCommand = `Transferable Traits: ${currentTraitCount}`;
    if (jaftingMaxTraitCount)
    {
      maxTraitCommand += ` / ${jaftingMaxTraitCount}`;
    }

    this.addCommand(maxTraitCommand, null, true, null, maxTraitIcon);
  }

  /**
   * Adds all trait commands on the equipment.
   */
  addEquipmentTraitData()
  {
    // we have no traits.
    const allTraits = this.item.traits;
    if (!allTraits.length) return;

    const xparamNoPercents = [0, 2, 7, 8, 9]; // code 22
    const sparamNoPercents = [1]; // code 23
    const dividerIndex = allTraits.findIndex(trait => trait.code === J.BASE.Traits.NO_DISAPPEAR);
    const hasDivider = dividerIndex !== -1;
    if (hasDivider)
    {
      this.addCommand(`BASE TRAITS`, null, true, null, 16, 30);
    }

    allTraits.forEach(t =>
    {
      const convertedTrait = new JAFTING_Trait(t.code, t.dataId, t.value);
      let commandName = convertedTrait.nameAndValue;
      let commandColor = 0;
      switch (convertedTrait._code)
      {
        case 21:
          const paramId = convertedTrait._dataId;
          const paramBase = this.actor.paramBase(paramId);
          const bonus = paramBase * (convertedTrait._value - 1);
          const sign = bonus >= 0 ? '+' : '-';
          commandName += ` \\C[6](${sign}${bonus.toFixed(2)})\\C[0]`;
          break;
        case 22:
          const xparamId = convertedTrait._dataId;
          if (xparamNoPercents.includes(xparamId))
          {
            commandName = commandName.replace("%", String.empty);
          }

          break;
        case 23:
          const sparamId = convertedTrait._dataId;
          if (sparamNoPercents.includes(sparamId))
          {
            commandName = commandName.replace("%", String.empty);
          }

          break;
        case 63:
          commandName = convertedTrait.name;
          commandColor = 30;
          break;
      }

      const commandIcon = IconManager.trait(convertedTrait);
      this.addCommand(commandName, null, true, null, commandIcon, commandColor);
    });
  }
}
//endregion Window_MoreEquipData