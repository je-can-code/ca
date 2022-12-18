//#region Window_MoreEquipData
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
    super.makeCommandList();
    if (!this.item)
    {
      this.adjustWindowHeight();
      return;
    }

    // add all the various additional data from equipment.
    this.addJaftingRefinementData();
    this.addBaseParameterData();
    this.addJabsEquipmentData();
    this.addEquipmentTraitData();

    // always adjust after determining the commands.
    this.adjustWindowHeight();
  }

  /**
   * Add any applicable base parameter commands from the equipment.
   */
  addBaseParameterData()
  {
    this.item.params.forEach((value, index) =>
    {
      if (!value) return;

      this.addBaseParameterCommand(index);
    });
  }

  /**
   * Adds a command to the list based on the base parameter matching the given id.
   * @param {number} paramId The id of the base parameter.
   */
  addBaseParameterCommand(paramId)
  {
    const baseValue = this.item.params[paramId];
    const commandName = `${TextManager.param(paramId)}: ${baseValue}`;
    this.addCommand(commandName, null, true, null, IconManager.param(paramId), 0);
  }

  /**
   * Adds all commands related to JABS on the equipment.
   */
  addJabsEquipmentData()
  {
    if (!this.item._j) return;

    this.addHitsCommand();
    this.addSkillCommands();
    this.addSpeedBoostCommand();
  }

  /**
   * Add the "bonus hits" command. Usually goes on weapons, but if bonus hits exist on other
   * types of equipment, then we'll report those, too.
   */
  addHitsCommand()
  {
    const { bonusHits } = this.item._j;
    const isWeapon = this.item.etypeId === 1;
    if (bonusHits || isWeapon)
    {
      const bonus = isWeapon ? 1 : 0;
      const command = isWeapon ? `Hit Count` : `Bonus Hits`;
      const hitBonusCommand = `${command}: x${bonusHits + bonus}`;
      const hitBonusIcon = IconManager.jabsParameterIcon(IconManager.JABS_PARAMETER.BONUS_HITS);
      this.addCommand(hitBonusCommand, null, true, null, hitBonusIcon, 0);
    }
  }

  /**
   * Add the the appropriate skill and combo commands as-needed.
   */
  addSkillCommands()
  {
    const { skillId } = this.item._j;
    const { actor } = this;
    if (skillId)
    {
      const baseAttackskill = OverlayManager.getExtendedSkill(actor, skillId);
      const comboSkillList = this.recursivelyFindAllComboSkillIds(skillId);
      let baseAttackSkillCommand = (this.item.etypeId === 2) ? `Offhand Skill` : `Attack Skill`;
      if (comboSkillList.length)
      {
        baseAttackSkillCommand = `Combo Starter`;
      }

      const attackSkillCommand = `${baseAttackSkillCommand}: \\C[2]${baseAttackskill.name}\\C[0]`;
      this.addCommand(attackSkillCommand, null, true, null, baseAttackskill.iconIndex);
      if (comboSkillList.length)
      {
        comboSkillList.forEach((comboSkillId, index) =>
        {
          const skill = $dataSkills[comboSkillId];
          const commandName = `Combo Skill ${index + 1}: \\C[2]${skill.name}\\C[0]`;
          this.addCommand(commandName, null, true, null, skill.iconIndex);
        });
      }
    }
  }

  /**
   * Add any speed boost adjustments from the equipment.
   */
  addSpeedBoostCommand()
  {
    const { speedBoost } = this.item._j;
    if (speedBoost)
    {
      const speedBoostCommand = `Speed Boost: ${speedBoost}`;
      const speedBoostIcon = IconManager.jabsParameterIcon(IconManager.JABS_PARAMETER.SPEED_BOOST)
      this.addCommand(speedBoostCommand, null, true, null, speedBoostIcon, 0);
    }
  }

  /**
   * Recursively finds the complete combo of an equip starting at a particular
   * skill id and building the collection of skill ids that this skill combos into.
   * @param {number} skillId The id to recursively interpret the combo of.
   * @param {number[]} list The running list of combo skill ids.
   * @returns {number[]} The full combo of the starting skill id.
   */
  recursivelyFindAllComboSkillIds(skillId, list = [])
  {
    // start our list from what was passed in.
    const skillIdList = list;

    // grab the database skill.
    const skill = this.actor.skill(skillId);
    const shouldRecurse = (s) => (s && s.jabsComboAction && !s.jabsFreeCombo);
    if (shouldRecurse(skill))
    {
      const foundComboSkill = skill.jabsComboSkillId;
      skillIdList.push(foundComboSkill);
      return this.recursivelyFindAllComboSkillIds(foundComboSkill, skillIdList);
    }
    else
    {
      return skillIdList;
    }
  }

  /**
   * Adds all commands related to JAFTING on the equipment.
   */
  addJaftingRefinementData()
  {
    if (!this.item._jafting) return;

    const {
      maxRefineCount,
      maxTraitCount,
      notRefinementBase,
      notRefinementMaterial,
      refinedCount,
      unrefinable
    } = this.item._jafting;

    if (unrefinable)
    {
      const unrefinableCommand = `Unrefinable`;
      const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.UNREFINABLE);
      const unrefinableColor = 2;
      this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
      return;
    }

    if (notRefinementBase)
    {
      const unrefinableCommand = `Only Refine as Material`;
      const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.NOT_BASE);
      const unrefinableColor = 2;
      this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
    }

    if (notRefinementMaterial)
    {
      const unrefinableCommand = `Only Refine as Base`;
      const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.NOT_MATERIAL);
      const unrefinableColor = 2;
      this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
    }

    let maxRefineIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.TIMES_REFINED);
    let maxRefineCommand = `Refinement: ${refinedCount}`;
    if (maxRefineCount)
    {
      maxRefineCommand += ` / ${maxRefineCount}`;
      if (maxRefineCount === refinedCount)
      {
        maxRefineIcon = 91;
      }
    }

    this.addCommand(maxRefineCommand, null, true, null, maxRefineIcon);

    const maxTraitIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.MAX_TRAITS);
    const currentTraitCount = $gameJAFTING.parseTraits(this.item).length;
    let maxTraitCommand = `Transferable Traits: ${currentTraitCount}`;
    if (maxTraitCount)
    {
      maxTraitCommand += ` / ${maxTraitCount}`;
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
//#endregion Window_MoreEquipData