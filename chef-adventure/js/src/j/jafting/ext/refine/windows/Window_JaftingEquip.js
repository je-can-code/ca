//region Window_JaftingEquip
/**
 * A window that shows a list of all equipment.
 */
class Window_JaftingEquip
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
   * Initializes the properties of this class.
   */
  initMembers()
  {
    /**
     * The currently selected index of this equip selection window.
     * @type {number}
     */
    this._currentIndex = null;

    /**
     * Whether or not this equip list window is the primary equip or not.
     * @type {boolean}
     */
    this._isPrimaryEquipWindow = false;

    /**
     * The current equip that is selected as the base for refinement.
     * @type {RPG_EquipItem}
     */
    this._primarySelection = null;

    /**
     * The projected result of refining the base item with the selected material.
     * @type {RPG_EquipItem}
     */
    this._projectedOutput = null;
  }

  /**
   * Gets the current index that was last assigned of this window.
   * @returns {number}
   */
  get currentIndex()
  {
    return this._currentIndex;
  }

  /**
   * Sets the current index to a given value.
   */
  set currentIndex(index)
  {
    this._currentIndex = index;
  }

  /**
   * Gets whether or not this equip list window is the primary equip or not.
   * @returns {boolean}
   */
  get isPrimary()
  {
    return this._isPrimaryEquipWindow;
  }

  /**
   * Sets whether or not this equip list window is the base equip or not.
   */
  set isPrimary(primary)
  {
    this._isPrimaryEquipWindow = primary;
    this.refresh();
  }

  /**
   * Gets the base selection.
   * Always null if this is the primary equip window.
   * @returns {RPG_EquipItem}
   */
  get baseSelection()
  {
    return this._primarySelection;
  }

  /**
   * Sets the primary selection.
   */
  set baseSelection(equip)
  {
    this._primarySelection = equip;
  }

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  }

  /**
   * Creates a list of all available equipment in the inventory.
   */
  makeCommandList()
  {
    // this command list is based purely off of all equipment.
    let equips = $gameParty.equipItems();

    // don't make the list if we have nothing to draw.
    if (!equips.length) return;

    // if this is the primary equip window, don't show the "materials" equipment type.
    if (this.isPrimary)
    {
      // TODO: parameterize this.
      // omit armor type 5, which is "- materials -".
      equips = equips.filter(equip => equip.atypeId !== 5);
    }

    // sort equips first by weapons > armor, then by id in descending order to group equips.
    equips.sort((a, b) =>
    {
      if (a.etypeId > b.etypeId) return 1;
      if (a.etypeId < b.etypeId) return -1;
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
    });

    // iterate over each equip the party has in their inventory.
    equips.forEach(equip =>
    {
      // don't render equipment that are totally unrefinable. That's a tease!
      if (equip.jaftingUnrefinable) return;

      const hasDuplicatePrimary = $gameParty.numItems(this.baseSelection) > 1;
      const isBaseSelection = equip === this.baseSelection;
      const canSelectBaseAgain = (isBaseSelection && hasDuplicatePrimary) || !isBaseSelection;
      let enabled = this.isPrimary
        ? true
        : canSelectBaseAgain; // only select the base again if you have 2+ copies of it.

      let {iconIndex} = equip;

      let errorText = "";

      // if the equipment is completely unable to
      if (equip.jaftingUnrefinable)
      {
        enabled = false;
        iconIndex = 90;
      }

      // if this is the second equip window...
      if (!this.isPrimary)
      {
        // and the equipment has no transferable traits, then disable it.
        if (!$gameJAFTING.parseTraits(equip).length)
        {
          enabled = false;
          errorText += `${J.JAFTING.EXT.REFINE.Messages.NoTraitsOnMaterial}\n`;
        }

        // prevent equipment explicitly marked as "not usable as material" from being used.
        if (equip.jaftingNotRefinementMaterial)
        {
          enabled = false;
          iconIndex = 90;
        }

        // or the projected equips combined would result in over the max refined count, then disable it.
        if (this.baseSelection)
        {
          const primaryHasMaxRefineCount = this.baseSelection.jaftingMaxRefineCount > 0;
          if (primaryHasMaxRefineCount)
          {
            const primaryMaxRefineCount = this.baseSelection.jaftingMaxRefineCount
            const projectedCount = this.baseSelection.jaftingRefinedCount + equip.jaftingRefinedCount;
            const overRefinementCount = primaryMaxRefineCount < projectedCount;
            if (overRefinementCount)
            {
              enabled = false;
              iconIndex = 90;
              errorText += `${J.JAFTING.EXT.REFINE.Messages.ExceedRefineCount} ${projectedCount}/${primaryMaxRefineCount}.\n`;
            }
          }

          // check the max traits of the base equip and compare with the projected result of this item.
          // if the count is greater than the max (if there is a max), then prevent this item from being used.
          const baseMaxTraitCount = this.baseSelection.jaftingMaxTraitCount;
          const projectedResult = $gameJAFTING.determineRefinementOutput(this.baseSelection, equip);
          const projectedResultTraitCount = $gameJAFTING.parseTraits(projectedResult).length;
          const overMaxTraitCount = baseMaxTraitCount > 0 && projectedResultTraitCount > baseMaxTraitCount;
          if (overMaxTraitCount)
          {
            enabled = false;
            iconIndex = 92
            errorText += `${J.JAFTING.EXT.REFINE.Messages.ExceedTraitCount} ${projectedResultTraitCount}/${baseMaxTraitCount}.\n`;
          }
        }

        // if this is the primary equip window...
      }
      else
      {
        const equipIsMaxRefined = (equip.jaftingMaxRefineCount === 0)
          ? false // 0 max refinements means you can refine as much as you want.
          : equip.jaftingMaxRefineCount <= equip.jaftingRefinedCount;
        const equipHasMaxTraits = equip.jaftingMaxTraitCount === 0
          ? false // 0 max traits means you can have as many as you want.
          : equip.jaftingMaxTraitCount <= $gameJAFTING.parseTraits(equip).length;
        if (equipIsMaxRefined)
        {
          enabled = false;
          iconIndex = 92;
          errorText += `${J.JAFTING.EXT.REFINE.Messages.AlreadyMaxRefineCount}\n`;
        }

        if (equipHasMaxTraits)
        {
          enabled = false;
          iconIndex = 92;
          errorText += `${J.JAFTING.EXT.REFINE.Messages.AlreadyMaxTraitCount}\n`;
        }

        // prevent equipment explicitly marked as "not usable as base" from being used.
        if (equip.jaftingNotRefinementBase)
        {
          enabled = false;
          iconIndex = 92;
        }
      }

      // finally, if we are using this as the base, give it a check regardless.
      if (isBaseSelection)
      {
        iconIndex = 91;
      }

      const extData = {data: equip, error: errorText};

      this.addCommand(equip.name, 'refine-object', enabled, extData, iconIndex);
    });
  }
}
//endregion Window_JaftingEquip