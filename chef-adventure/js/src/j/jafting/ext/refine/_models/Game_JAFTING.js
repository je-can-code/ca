//region Game_JAFTING
/**
 * A class for managing all things related to JAFTING.
 */
function Game_JAFTING()
{
  this.initialize(...arguments)
}
Game_JAFTING.prototype = {};
Game_JAFTING.prototype.constructor = Game_JAFTING;

/**
 * A collection of categories of equipment that are refinable.
 */
Game_JAFTING.RefinementTypes = {
  Armor: "armor",
  Weapon: "weapon",
};

/**
 * The starting index that we will start counting up from for both of
 * the $dataArmors and $dataWeapons arrays. This should never change once a game
 * has begun, or else we could end up with clobbered or missing data.
 * @type {number}
 */
Game_JAFTING.startingIndex = 2001;

/**
 * Initializes all members of this class.
 */
Game_JAFTING.prototype.initialize = function()
{
  /**
   * Whether or not this option is enabled in the JAFTING mode menu.
   * @type {boolean}
   */
  this._enabled = true;

  /**
   * Whether or not this option is rendered in the JAFTING mode menu.
   * @type {boolean}
   */
  this._hidden = false;

  /**
   * The starting index. I was going to make this configurable, but I figured since the
   * default max for the database was 2000, i'd lock this at 2001 and call it a day.
   *
   * This defines where the custom refined equips will be injected into the database
   * weapons/armors objects.
   * @type {number}
   */
  this._startingIndex = 2001;

  /**
   * A collection of all weapons that have been refined.
   * @type {RPG_EquipItem[]}
   */
  this._refinedWeapons = [];

  /**
   * A collection of all armors that have been refined.
   * @type {RPG_EquipItem[]}
   */
  this._refinedArmors = [];

  /**
   * A collection of all current increment indices for refinable equipment types.
   * This ensures no refined equipment gets overwritten by another refined equipment.
   * @type {number}
   */
  this._refinementIncrements ||= {};

  /**
   * The refinement increment index for armors.
   * @type {number}
   */
  this._refinementIncrements[Game_JAFTING.RefinementTypes.Armor] ||= Game_JAFTING.startingIndex;

  /**
   * The refinement increment index for weapons.
   * @type {number}
   */
  this._refinementIncrements[Game_JAFTING.RefinementTypes.Weapon] ||= Game_JAFTING.startingIndex;
};

/**
 * Enables the refine mode in the JAFTING mode selection menu.
 */
Game_JAFTING.prototype.enableRefinement = function()
{
  this._enabled = true;
};

/**
 * Disables the refine mode in the JAFTING mode selection menu.
 */
Game_JAFTING.prototype.disableRefinement = function()
{
  this._enabled = false;
};

/**
 * Gets whether or not the refine option is enabled in the JAFTING mode selection window.
 * @returns {boolean}
 */
Game_JAFTING.prototype.isRefinementEnabled = function()
{
  return this._enabled;
};

/**
 * Hides the refine option in the JAFTING mode selection menu.
 */
Game_JAFTING.prototype.hideRefinement = function()
{
  this._hidden = true;
};

/**
 * Shows the refine option in the JAFTING mode selection menu.
 */
Game_JAFTING.prototype.showRefinement = function()
{
  this._hidden = false;
};

/**
 * Gets whether or not the refine mode option is rendered in the JAFTING
 * mode selection menu.
 * @returns {boolean}
 */
Game_JAFTING.prototype.isRefinementHidden = function()
{
  return this._hidden;
};
/**
 * Increments the refinement index for a particular datastore.
 * @param {string} refinementType One of the refinement types.
 */
Game_JAFTING.prototype.incrementRefinementCounter = function(refinementType)
{
  this._refinementIncrements[refinementType]++;
};

/**
 * Gets the current increment for a particular datastore's latest index.
 * @param {string} refinementType One of the refinement types.
 * @returns {number}
 */
Game_JAFTING.prototype.getRefinementCounter = function(refinementType)
{
  return this._refinementIncrements[refinementType];
};

/**
 * Adds a newly refined weapon to the collection for tracking purposes.
 * @param {RPG_EquipItem} weapon The newly refined weapon.
 */
Game_JAFTING.prototype.trackRefinedWeapon = function(weapon)
{
  this._refinedWeapons.push(weapon);
};

/**
 * Adds a newly refined armor to the collection for tracking purposes.
 * @param {RPG_EquipItem} armor The newly refined armor.
 */
Game_JAFTING.prototype.trackRefinedArmor = function(armor)
{
  this._refinedArmors.push(armor);
};

/**
 * Gets all tracked weapons that have been refined.
 * @returns {RPG_EquipItem[]}
 */
Game_JAFTING.prototype.getRefinedWeapons = function()
{
  return this._refinedWeapons;
};

/**
 * Gets all tracked armors that have been refined.
 * @returns {RPG_EquipItem[]}
 */
Game_JAFTING.prototype.getRefinedArmors = function()
{
  return this._refinedArmors;
};

/**
 * Updates the $dataWeapons collection to include the player's collection of
 * refined weapons.
 */
Game_JAFTING.prototype.updateDataWeapons = function()
{
  this.getRefinedWeapons().forEach(weapon =>
  {
    const updatedWeapon = new RPG_Weapon(weapon, weapon.index);
    $dataWeapons[updatedWeapon._key()] = updatedWeapon;
  });
};

/**
 * Updates the $dataArmors collection to include the player's collection of
 * refined armors.
 */
Game_JAFTING.prototype.updateDataArmors = function()
{
  this.getRefinedArmors().forEach(armor =>
  {
    const updatedArmor = new RPG_Armor(armor, armor.index);
    $dataArmors[updatedArmor._key()] = updatedArmor;
  });
};

/**
 * Determines the result of refining a given base with a given material.
 * @param {RPG_EquipItem} base An equip to parse traits off of.
 * @param {RPG_EquipItem} material An equip to parse traits off of.
 * @returns {RPG_EquipItem}
 */
Game_JAFTING.prototype.determineRefinementOutput = function(base, material)
{
  // don't process if we are missing a parameter.
  if (!base || !material) return null;

  let baseTraits = this.parseTraits(base);
  let materialTraits = this.parseTraits(material);

  [baseTraits, materialTraits] = this.removeIncompatibleTraits(baseTraits, materialTraits);

  [baseTraits, materialTraits] = this.overwriteAllOverwritableTraits(baseTraits, materialTraits);

  // copy of primary equip that represents the projected result.
  const output = base._generate(base, base._index());

  // if the primary equip doesn't have any transferrable traits, then it also won't have a divider.
  if (!baseTraits.length)
  {
    // add a divider trait at the end of the primary equip's trait list.
    output.traits.push(JAFTING_Trait.divider());
  }
  else
  {
    // determine the divider's index.
    const index = output.traits.findIndex(trait => trait.code === 63);

    // check if we have a valid divider index and there is stuff after the divider.
    if (index > -1 && !!output.traits[index])
    {
      // if we have stuff after the divider, get rid of it.
      output.traits.splice(index + 1);
    }

    // add our modified primary traits.
    baseTraits.forEach(trait => output.traits.push(trait.convertToRmTrait()));
  }

  // iterate over all the secondary traits that can be transferred to the refined primary equip.
  materialTraits.forEach(trait =>
  {
    // if the trait is non-transferable, then skip it.
    if (!this.isTransferableTrait(output, trait)) return;

    // create and add the new trait from the material onto the base.
    const newTrait = RPG_Trait.fromValues(trait._code, trait._dataId, trait._value);
    output.traits.push(newTrait);
  });

  if (material.jaftingRefinedCount > 0)
  {
    // the -1 at the end is to accommodate the default of +1 that occurs when an equip is refined.
    output.jaftingRefinedCount += material.jaftingRefinedCount - 1;
  }

  return output;
};

/**
 * Parses all traits off the equipment that are below the "divider".
 * The divider is NOT parameterized, the "collapse effect" trait is the perfect trait
 * to use for this purpose since it has 0 use on actor equipment.
 * @param {RPG_EquipItem} equip An equip to parse traits off of.
 * @returns {JAFTING_Trait[]}
 */
Game_JAFTING.prototype.parseTraits = function(equip)
{
  const allTraits = [...equip.traits];//JsonEx.makeDeepCopy(equip.traits);
  const divider = allTraits.findIndex(trait => trait.code === 63);
  if (divider > -1)
  {
    const availableTraits = allTraits.splice(divider + 1);

    // if we have no leftover traits after splicing off the stuff after, then stop.
    if (!availableTraits.length) return [];

    let jaftingTraits = availableTraits.map(t => new JAFTING_Trait(t.code, t.dataId, t.value));
    jaftingTraits = this.combineAllParameterTraits(jaftingTraits);
    return jaftingTraits;
  }
  else
  {
    return [];
  }
};

/**
 * Determines whether or not a trait should be transfered to the refined base equip.
 * @param {RPG_EquipItem} output The to-be refined base equip.
 * @param {JAFTING_Trait} jaftingTrait The new trait to be potentially transferred.
 * @returns {boolean}
 */
Game_JAFTING.prototype.isTransferableTrait = (output, jaftingTrait) =>
{
  switch (jaftingTrait._code)
  {
    case 11: // elemental damage rate - stackable.
    case 12: // debuff rate - stackable.
    case 13: // state rate - stackable.
    case 14: // state immunity - don't add the same twice.
    case 21: // base parameter rate - stackable.
    case 22: // ex-parameter rate - stackable.
    case 23: // sp-parameter rate - stackable.
    case 31: // attack element - uniquely stackable.
    case 32: // apply state chance - stackable.
    case 33: // skill speed - stackable.
    case 34: // repeat times - stackable.
    case 35: // change basic attack skill - overwrite.
    case 41: // unlock skill type - one or the other or none.
    case 42: // lock skill type - one or the other or none.
    case 43: // learn skill while equipped - one or the other or none.
    case 44: // unlearn skill while equipped - one or the other or none.
    case 51: // can use new weapon type - don't add the same twice.
    case 52: // can use new armor type - don't add the same twice.
    case 53: // (lock)cannot change equipment from slot.
    case 55: // enable/disable dual-wielding - overwrite.
    case 61: // action times percent boost - stackable.
    case 62: // special flag - don't add the same twice.
    case 64: // party ability - don't add the same twice.
      return true;

    case 54: // (seal) slot is not equippable while equipped.
      const sealingOwnEquipType = (jaftingTrait._dataId === output.etypeId);
      // don't transfer over slot sealing if it would seal the slot the equip is on.
      return !sealingOwnEquipType;
    default:
      console.error(`all traits are accounted for- is this a custom trait code: [${jaftingTrait._code}]?`);
      return false;
  }
};

/**
 * Compares traits on the base item against those on the material, and purges
 * all conflicting traits from the result.
 * @param {JAFTING_Trait[]} baseTraits The traits from the base item.
 * @param {JAFTING_Trait[]} materialTraits The traits from the material.
 * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
 */
Game_JAFTING.prototype.removeIncompatibleTraits = function(baseTraits, materialTraits)
{
  // a list of traits that should be purged from the secondary list if found.
  const noDuplicateTraitCodes = [14, 31, 41, 42, 43, 44, 51, 52, 53, 54, 55, 62, 64];
  baseTraits.forEach(jaftingTrait =>
  {
    if (noDuplicateTraitCodes.includes(jaftingTrait._code))
    {
      this.purgeDuplicateTrait(jaftingTrait, materialTraits, jaftingTrait._code);
    }
  });

  // handle lock/unlock skills types.
  [baseTraits, materialTraits] = this.removeOppositeTrait(baseTraits, materialTraits, 41, 42);

  // handle lock/unlock skills.
  [baseTraits, materialTraits] = this.removeOppositeTrait(baseTraits, materialTraits, 43, 44);

  // overwrite basic attack skill.
  [baseTraits, materialTraits] = this.replaceTrait(baseTraits, materialTraits, 35);

  // overwrite enable/disable of dual-wield (unique case!)
  [baseTraits, materialTraits] = this.replaceTrait(baseTraits, materialTraits, 55);

  return [baseTraits, materialTraits];
};

/**
 * Compare one trait with a rolling trait list to see if the list has any conflicting
 * traits with it. If so, remove them.
 * @param {JAFTING_Trait} potentialJaftingTrait The trait potentially to add if it doesn't already exist.
 * @param {JAFTING_Trait[]} rollingJaftingTraitList The trait list to compare against.
 */
Game_JAFTING.prototype.purgeDuplicateTrait = function(potentialJaftingTrait, rollingJaftingTraitList)
{
  let donePurging = false;
  while (!donePurging)
  {
    const index = rollingJaftingTraitList.findIndex(trait => trait._code === potentialJaftingTrait._code);
    if (index > -1 && rollingJaftingTraitList[index]._dataId === potentialJaftingTrait._dataId)
    {
      rollingJaftingTraitList.splice(index, 1);
    }
    else
    {
      donePurging = true;
    }
  }
};

/**
 * Compares two lists of traits and looks for a pair of codes that could possibly be
 * opposing one another. If one code is found in one list, and the opposing code is found
 * in the other list, the traits are removed from their respective lists. This will look
 * in both lists for both codes, so repeating this function for both orders is not necessary.
 * This will also retroactively remove both codes if they somehow live in the same list.
 * @param {JAFTING_Trait[]} baseTraitList The primary list of traits.
 * @param {JAFTING_Trait[]} materialTraitList The secondary list of traits.
 * @param {number} code One of the codes to compare.
 * @param {number} opposingCode The opposing code to compare.
 * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
 */
Game_JAFTING.prototype.removeOppositeTrait = function(baseTraitList, materialTraitList, code, opposingCode)
{
  const hasTraitCode = trait => trait._code === code;
  const hasOpposingTraitCode = trait => trait._code === opposingCode;
  const baseHasCode = baseTraitList.findIndex(hasTraitCode);
  const materialHasCode = materialTraitList.findIndex(hasTraitCode);
  const baseHasOpposingCode = baseTraitList.findIndex(hasOpposingTraitCode);
  const materialHasOpposingCode = materialTraitList.findIndex(hasOpposingTraitCode);

  // if the primary has the base code, and secondary has opposing, remove both.
  if (baseHasCode > -1 && materialHasOpposingCode > -1)
  {
    if (baseTraitList[baseHasCode]._dataId === materialTraitList[materialHasOpposingCode]._dataId)
    {
      baseTraitList.splice(baseHasCode, 1, null);
      materialTraitList.splice(materialHasOpposingCode, 1, null);
    }
  }

  // if the secondary has the base code, and primary has opposing, remove both.
  if (materialHasCode > -1 && baseHasOpposingCode > -1)
  {
    if (baseTraitList[baseHasOpposingCode]._dataId === materialTraitList[materialHasCode]._dataId)
    {
      baseTraitList.splice(baseHasOpposingCode, 1, null);
      materialTraitList.splice(materialHasCode, 1, null);
    }
  }

  // if the primary list has both codes, remove both traits.
  if (baseHasCode > -1 && baseHasOpposingCode > -1)
  {
    if (baseTraitList[baseHasCode]._dataId === baseTraitList[baseHasOpposingCode]._dataId)
    {
      baseTraitList.splice(baseHasCode, 1, null);
      baseTraitList.splice(baseHasOpposingCode, 1, null);
    }
  }

  // if the secondary list has both codes, remove both traits.
  if (materialHasCode > -1 && materialHasOpposingCode > -1)
  {
    if (materialTraitList[materialHasCode]._dataId === materialTraitList[materialHasOpposingCode]._dataId)
    {
      materialTraitList.splice(materialHasCode, 1, null);
      materialTraitList.splice(materialHasOpposingCode, 1, null);
    }
  }

  baseTraitList = baseTraitList.filter(trait => !!trait);
  materialTraitList = materialTraitList.filter(trait => !!trait);

  return [baseTraitList, materialTraitList];
};

/**
 * Combines all parameter-related traits where applicable.
 * @param {JAFTING_Trait[]} traitList The list of traits.
 * @returns {JAFTING_Trait[]}
 */
Game_JAFTING.prototype.combineAllParameterTraits = function(traitList)
{
  traitList = this.combineBaseParameterTraits(traitList);
  traitList = this.combineExParameterTraits(traitList);
  traitList = this.combineSpParameterTraits(traitList);
  return traitList;
};

/**
 * Combines all b-parameter-traits that are applicable.
 * @param {JAFTING_Trait[]} traitList The list of traits.
 * @returns {JAFTING_Trait[]}
 */
Game_JAFTING.prototype.combineBaseParameterTraits = function(traitList)
{
  const canCombineCode = 21;
  let tempTraitList = JsonEx.makeDeepCopy(traitList);
  const traitTracker = {};
  const indices = [];
  traitList.forEach((trait, index) =>
  {
    if (trait._code !== canCombineCode) return;

    if (!traitTracker[trait._dataId])
    {
      // if we haven't started tracking it yet, add it.
      traitTracker[trait._dataId] = trait._value;
    }
    else
    {
      // if we have started tracking it, then increase the value by the bonus amount.
      traitTracker[trait._dataId] += trait._value - 1;
    }

    // mark the index to be removed and replaced later.
    indices.push(index);
  });

  // if we didn't have any traits to combine, then we're done.
  if (!indices.length)
  {
    return traitList;
  }

  // get rid of all the old traits.
  indices.forEach(i => tempTraitList.splice(i, 1, null));
  tempTraitList = tempTraitList.filter(element => !!element);

  // make the new combined traits and add them to the list.
  for (const dataId in traitTracker)
  {
    const value = parseFloat(traitTracker[dataId].toFixed(2));
    const newTrait = new JAFTING_Trait(canCombineCode, parseInt(dataId), value);
    tempTraitList.push(newTrait);
  }

  return tempTraitList;
};

/**
 * Combines all ex-parameter-traits that are applicable.
 * @param {JAFTING_Trait[]} traitList The list of traits.
 * @returns {JAFTING_Trait[]}
 */
Game_JAFTING.prototype.combineExParameterTraits = function(traitList)
{
  const canCombineCode = 22;
  let tempTraitList = JsonEx.makeDeepCopy(traitList);
  const traitTracker = {};
  const indices = [];
  traitList.forEach((trait, index) =>
  {
    if (trait._code !== canCombineCode) return;

    if (!traitTracker[trait._dataId])
    {
      // if we haven't started tracking it yet, add it.
      traitTracker[trait._dataId] = trait._value;
    }
    else
    {
      // if we have started tracking it, then increase the value by the bonus amount.
      traitTracker[trait._dataId] += trait._value;
    }

    // mark the index to be removed and replaced later.
    indices.push(index);
  });

  // if we didn't have any traits to combine, then we're done.
  if (!indices.length)
  {
    return traitList;
  }

  // get rid of all the old traits.
  indices.forEach(i => tempTraitList.splice(i, 1, null));
  tempTraitList = tempTraitList.filter(element => !!element);

  // make the new combined traits and add them to the list.
  for (const dataId in traitTracker)
  {
    const value = parseFloat(traitTracker[dataId].toFixed(2));
    const newTrait = new JAFTING_Trait(canCombineCode, parseInt(dataId), value);
    tempTraitList.push(newTrait);
  }

  return tempTraitList;
};

/**
 * Combines all sp-parameter-traits that are applicable.
 * @param {JAFTING_Trait[]} traitList The list of traits.
 * @returns {JAFTING_Trait[]}
 */
Game_JAFTING.prototype.combineSpParameterTraits = function(traitList)
{
  const canCombineCode = 23;
  let tempTraitList = JsonEx.makeDeepCopy(traitList);
  const traitTracker = {};
  const indices = [];
  traitList.forEach((trait, index) =>
  {
    if (trait._code !== canCombineCode) return;

    if (!traitTracker[trait._dataId])
    {
      // if we haven't started tracking it yet, add it.
      traitTracker[trait._dataId] = trait._value - 1;
    }
    else
    {
      // if we have started tracking it, then increase the value by the bonus amount.
      traitTracker[trait._dataId] += trait._value - 1;
    }

    // mark the index to be removed and replaced later.
    indices.push(index);
  });

  // if we didn't have any traits to combine, then we're done.
  if (!indices.length)
  {
    return traitList;
  }

  // get rid of all the old traits.
  indices.forEach(i => tempTraitList.splice(i, 1, null));
  tempTraitList = tempTraitList.filter(element => !!element);

  // make the new combined traits and add them to the list.
  for (const dataId in traitTracker)
  {
    const value = parseFloat(traitTracker[dataId].toFixed(2)) + 1;
    const newTrait = new JAFTING_Trait(canCombineCode, parseInt(dataId), value);
    tempTraitList.push(newTrait);
  }

  return tempTraitList;
};

/**
 * Removes a trait from the primary list if the same trait also lives on the secondary
 * list. This gives the illusion of overwriting the trait with the new one.
 * @param {JAFTING_Trait[]} baseTraitList The primary list of traits.
 * @param {JAFTING_Trait[]} materialTraitList The secondary list of traits.
 * @param {number} code The code to overwrite if it exists in both lists.
 * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
 */
Game_JAFTING.prototype.replaceTrait = function(baseTraitList, materialTraitList, code)
{
  const hasTraitCode = trait => trait._code === code;
  const baseHasCode = baseTraitList.findIndex(hasTraitCode);
  const materialHasCode = materialTraitList.findIndex(hasTraitCode);

  // if both lists have the same trait, remove from base list.
  if (baseHasCode > -1 && materialHasCode > -1)
  {
    baseTraitList.splice(baseHasCode, 1, null);
  }

  baseTraitList = baseTraitList.filter(trait => !!trait);
  return [baseTraitList, materialTraitList];
};

/**
 * Overwrites all traits from the two lists depending on which is better as applicable.
 * @param {JAFTING_Trait[]} baseTraits The primary list of traits.
 * @param {JAFTING_Trait[]} materialTraits The secondary list of traits.
 * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
 */
Game_JAFTING.prototype.overwriteAllOverwritableTraits = function(baseTraits, materialTraits)
{
  const overwritableCodes = [11, 12, 13, 32, 33, 34, 61];
  overwritableCodes.forEach(code =>
  {
    [baseTraits, materialTraits] = this.overwriteIfBetter(baseTraits, materialTraits, code);
  });

  return [baseTraits, materialTraits];
};

/**
 * Checks the material trait list to see if better versions of the traits in the base
 * trait list are already there. If so, purges them from the base to allow for "overwriting"
 * from the material.
 * @param {JAFTING_Trait[]} baseTraitList The primary list of traits.
 * @param {JAFTING_Trait[]} materialTraitList The secondary list of traits.
 * @param {number} code The code to overwrite if it exists in both lists.
 * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
 */
Game_JAFTING.prototype.overwriteIfBetter = function(baseTraitList, materialTraitList, code)
{
  const higherIsBetterCodes = [32, 33, 34, 61];
  const lowerIsBetterCodes = [11, 12, 13];

  // a quick function to use against each element of the base trait list
  // to check and see if the material trait list has any of the same codes with dataIds
  const hasTraitCodeAndDataIdWithBetterValue = trait =>
  {
    if (trait._code !== code) return false;

    // check if another version of the trait exists on the material.
    const index = materialTraitList.findIndex(jaftingTrait =>
      jaftingTrait._code === code &&
      jaftingTrait._dataId === trait._dataId);
    return index > -1;
  };

  // get all indices that return true for the above function and store them.
  const sameIndices = [];
  baseTraitList.forEach((jaftingTrait, index) =>
  {
    if (hasTraitCodeAndDataIdWithBetterValue(jaftingTrait))
    {
      sameIndices.push(index);
    }
  });

  // if we have no matches to combine, then just return the lists untouched.
  if (!sameIndices.length) return [baseTraitList, materialTraitList];

  // create copies for working with.
  let tempBaseList = JsonEx.makeDeepCopy(baseTraitList);
  let tempMaterialList = JsonEx.makeDeepCopy(materialTraitList);

  // iterate over all shared traits to analyze them further.
  sameIndices.forEach(i =>
  {
    const baseTrait = baseTraitList[i];
    const materialTraitIndex = materialTraitList
      .findIndex(t => t._code === baseTrait._code && t._dataId === baseTrait._dataId);
    const materialTrait = materialTraitList[materialTraitIndex];
    // if the trait code prefers higher values, then compare that way.
    if (higherIsBetterCodes.includes(baseTrait._code))
    {
      if (baseTrait._value > materialTrait._value)
      {
        // if better on the base, then remove it from the material.
        tempMaterialList.splice(materialTraitIndex, 1, null);
      }
      else
      {
        // if better on the material, then remove it from the base.
        tempBaseList.splice(i, 1, null);
      }
      // if the trait code prefers lower values, then compare that way.
    }
    else if (lowerIsBetterCodes.includes(baseTrait._code))
    {
      if (baseTrait._value < materialTrait._value)
      {
        // if better on the base, then remove it from the material.
        tempMaterialList.splice(materialTraitIndex, 1, null);
      }
      else
      {
        // if better on the material, then remove it from the base.
        tempBaseList.splice(i, 1, null);
      }
    }
  });

  tempBaseList = tempBaseList
    .filter(t => !!t)
    .map(t => new JAFTING_Trait(t._code, t._dataId, t._value));
  tempMaterialList = tempMaterialList
    .filter(t => !!t)
    .map(t => new JAFTING_Trait(t._code, t._dataId, t._value));

  return [tempBaseList, tempMaterialList];
};

/**
 * Takes the refinement result equip and creates it in the appropriate datastore, and adds it to
 * the player's inventory.
 * @param {RPG_EquipItem} outputEquip The equip to generate and add to the player's inventory.
 */
Game_JAFTING.prototype.createRefinedOutput = function(outputEquip)
{
  if (outputEquip.wtypeId)
  {
    this.generateRefinedEquip($dataWeapons, outputEquip, Game_JAFTING.RefinementTypes.Weapon);
  }
  else if (outputEquip.atypeId)
  {
    this.generateRefinedEquip($dataArmors, outputEquip, Game_JAFTING.RefinementTypes.Armor);
  }
};

/**
 * Generates the new entry in the corresponding datastore for the new equip data that was refined.
 * @param {RPG_Weapon[]|RPG_Armor[]} datastore The datastore to extend with new data.
 * @param {RPG_EquipItem} equip The equip to generate and add to the player's inventory.
 * @param {string} refinementType The type of equip this is; for incrementing the counter on custom data.
 * @returns {RPG_EquipItem}
 */
Game_JAFTING.prototype.generateRefinedEquip = function(datastore, equip, refinementType)
{
  equip.jaftingRefinedCount++;
  const suffix = `+${equip.jaftingRefinedCount}`;
  if (equip.jaftingRefinedCount === 1)
  {
    // first time refining, they don't have a name to replace.
    equip.name = `${equip.name} ${suffix}`;
  }
  else
  {
    // second or later time refining, they need to replace the suffix.
    const index = equip.name.indexOf("+");
    if (index > -1)
    {
      equip.name = `${equip.name.slice(0, index)}${suffix}`;
    }
    else
    {
      equip.name = `${equip.name} ${suffix}`;
    }
  }

  // generate the new entry in the database.
  const newIndex = this.getRefinementCounter(refinementType);
  equip._updateIndex(newIndex);
  datastore[newIndex] = equip;

  // gain the actual item.
  $gameParty.gainItem(datastore[newIndex], 1);

  // increment the index to ensure we don't overwrite it.
  this.incrementRefinementCounter(refinementType);

  // add it to our running list of everything we've literally ever created ever.
  if (equip.wtypeId)
  {
    this.trackRefinedWeapon(equip);
  }
  else if (equip.atypeId)
  {
    this.trackRefinedArmor(equip);
  }
  else
  {
    console.error(`The following equip failed to be captured because it was neither weapon nor armor.`);
    console.warn(equip);
    throw new Error("please stop crafting stuff that isn't valid.");
  }
};
//endregion Game_JAFTING