//region refinedCount
/**
 * The number of times this equip has been refined.
 * @type {number}
 */
RPG_EquipItem.prototype.jaftingRefinedCount ||= 0;
//endregion refinedCount

//region notRefinementBase
/**
 * Whether or not this equip is blocked from being used as a base for refinement.
 * @type {boolean}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingNotRefinementBase",
  {
    get: function()
    {
      return this.getJaftingNotRefinementBase();
    },
  });

/**
 * Gets whether or not this equip is blocked from being used as a base for refinement.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.getJaftingNotRefinementBase = function()
{
  return this.extractJaftingNotRefinementBase();
};

/**
 * Extracts the value from the notes.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.extractJaftingNotRefinementBase = function()
{
  return this.getBooleanFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.NotRefinementBase);
};
//endregion notRefinementBase

//region notRefinementMaterial
/**
 * Whether or not this equip is blocked from being used as a material for refinement.
 * @type {boolean}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingNotRefinementMaterial",
  {
    get: function()
    {
      return this.getJaftingNotRefinementBase();
    },
  });

/**
 * Gets whether or not this equip is blocked from being used as a material for refinement.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.getJaftingNotRefinementBase = function()
{
  return this.extractJaftingNotRefinementMaterial();
};

/**
 * Extracts the value from the notes.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.extractJaftingNotRefinementMaterial = function()
{
  return this.getBooleanFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.NotRefinementMaterial);
};
//endregion notRefinementMaterial

//region unrefinable
/**
 * Whether or not this equip is blocked from being used in refinement at all.
 * This is equivalent to {@link jaftingNotRefinementBase} and {@link jaftingNotRefinementMaterial}
 * existing on the same equip.
 * @type {boolean}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingUnrefinable",
  {
    get: function()
    {
      return this.getJaftingUnrefinable();
    },
  });

/**
 * Gets whether or not this equip is blocked from being used as a material for refinement.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.getJaftingUnrefinable = function()
{
  // check if the notes say this is explicitly unrefinable.
  let unrefinable = this.extractJaftingUnrefinable();

  // if the notes didn't have the tag, lets check for the other pair.
  if (!unrefinable)
  {
    // see if this equip cannot be used as both base and material for refinement.
    const notForBase = this.jaftingNotRefinementBase;
    const notForMaterial = this.jaftingNotRefinementMaterial;

    // check if it is alternatively unrefinable.
    if (notForBase && notForMaterial)
    {
      // flip the flag.
      unrefinable = true;
    }
  }

  // return our result.
  return unrefinable;
};

/**
 * Extracts the value from the notes.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.extractJaftingUnrefinable = function()
{
  return this.getBooleanFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.Unrefinable);
};
//endregion unrefinable

//region maxRefineCount
/**
 * The maximum number of times this equip can be refined.
 * @type {number}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingMaxRefineCount",
  {
    get: function()
    {
      return this.getJaftingMaxRefineCount();
    },
  });

/**
 * Gets how many times this equip can be refined.
 * @returns {number}
 */
RPG_EquipItem.prototype.getJaftingMaxRefineCount = function()
{
  return this.extractJaftingMaxRefineCount();
};

/**
 * Extracts the value from the notes.
 */
RPG_EquipItem.prototype.extractJaftingMaxRefineCount = function()
{
  return this.getNumberFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.MaxRefineCount);
};
//endregion maxRefineCount

//region maxTraitCount
/**
 * The maximum number of traits this equip can be gain as a result of refinement.
 * This is defined as the number of traits that come after the divider.
 * @type {number}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingMaxTraitCount",
  {
    get: function()
    {
      return this.getJaftingMaxTraitCount();
    },
  });

/**
 * Gets how many traits this equip can have from refinement.
 * @returns {number}
 */
RPG_EquipItem.prototype.getJaftingMaxTraitCount = function()
{
  return this.extractJaftingMaxTraitCount();
};

/**
 * Extracts the value from the notes.
 */
RPG_EquipItem.prototype.extractJaftingMaxTraitCount = function()
{
  return this.getNumberFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.MaxTraitCount);
};
//endregion maxRefineCount