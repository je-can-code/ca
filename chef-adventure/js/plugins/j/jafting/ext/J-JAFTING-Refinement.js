//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 JAFT-REFINE] Extends JAFTING to include refinement.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @base J-JAFTING
 * @orderAfter J-Base
 * @orderAfter J-JAFTING
 * @help
 * ============================================================================
 * [INTRODUCTION]:
 * This is an extension of the JAFTING plugin to enable the ability to "refine"
 * equipment. "Refinement" is defined as "transfering the traits of one item
 * onto another". It is also important to note that "transferable traits" are
 * defined as "all traits on an equip in the database that are below the
 * divider".
 *
 * The "divider" is another trait: 'Collapse Effect'. It doesn't matter which
 * option you select in the dropdown for this (for now). Traits that are above
 * the "divider" are considered "passive" traits that cannot be transfered.
 *
 * This plugin does not handle trait removal, so do keep that in mind.
 *
 * [DESCRIPTION]:
 * This functionality's exclusive target is equipment. The most common use case
 * for this type of plugin is to repeatedly upgrade a weapon or armor of a
 * given type with new/improved traits, allowing the player to keep their
 * equipment relevant longer (or hang onto stuff for sentimental reasons, I
 * guess). It works in tandem with a basic crafting system (the JAFTING base
 * system) to allow you, the RM dev, to come up with fun ways to allow not only
 * you, but the player as well, to flex creativity by using recipes to make
 * stuff, then using refinement to upgrade it. With a wide variety of traits
 * spread across various equipment, combined with the notetags below, this
 * extension on JAFTING can make for some interesting situations in-game (good
 * and bad).
 *
 * [NOTE TAGS]:
 * Obviously, being able to willy nilly refine any equips with any equips could
 * be volatile for the RM dev being able to keep control on what the player
 * should be doing (such as refining a unique equipment onto another and there
 * by losing said unique equipment that could've been required for story!).
 *
 * As such, I've introduced a few tags that can be applied onto weapons/armor:
 *
 * <noRefine>
 * Placing this tag onto equipment renders it unavailable to be refined at all.
 * That means it simply won't show up in the refinement menu's equip lists.
 *
 * <notRefinementBase>
 * Placing this tag onto equipment means it will be a disabled option when
 * selecting a base equip to refine. This most commonly would be used by
 * perhaps some kind of "fragile" types of equipment, or for equipment you
 * designed explicitly as a material.
 *
 * <notRefinementMaterial>
 * Placing this tag onto equipment means it will be a disabled option when
 * selecting a material equip to refine onto the base. This most commonly would
 * be used for preventing the player from sacrificing an equipment that is
 * required for story purposes.
 *
 * <maxRefineCount:NUM>
 * Where NUM is a number that represents how many times this can be refined.
 * Placing this tag onto equipment means it can only be used as a base for
 * refinement NUM number of times.
 *
 * <maxRefinedTraits:NUM>
 * Where NUM is a number that represents how many combined traits it can have.
 * Placing this tag onto equipment means it can only be used as a base as long
 * as the number of combined trait slots (see the screen while refining) is
 * lesser than or equal to NUM. This most commonly would be used to prevent
 * the player from adding an unreasonable number of traits onto an equip.
 *
 * [PLUGIN PARAMETERS]:
 * There are just a couple that will control the visibility of the actual
 * command that shows up for refinement in the JAFTING mode select window.
 *
 * I debated on putting all the various text bits that show up
 * throughout the menu here for translation, but instead I captured them all
 * and put them in the J.JAFTING.EXT.REFINE.Messages object. If you want to change the
 * text, feel free to edit that instead. Additionally, for the various traits
 * text, you can find that text hard-coded english starting at line 2164 by
 * trait code.
 * ============================================================================
 * CHANGELOG:
 *
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @command hideJaftingRefinement
 * @text Hide Refinement Option
 * @desc Removes the "refinement" option from the JAFTING mode selection window.
 *
 * @command showJaftingRefinement
 * @text Show Refinement Option
 * @desc Adds the "refinement" option to the JAFTING mode selection window.
 *
 * @command disableJaftingRefinement
 * @text Disable Refinement Option
 * @desc Disables the "refinement" option in the JAFTING mode selection window.
 *
 * @command enableJaftingRefinement
 * @text Enable Refinement Option
 * @desc Enables the "refinement" option in the JAFTING mode selection window.
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};
//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.2';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-JAFTING plugin.
  const requiredJaftingVersion = '2.0.0';
  const hasJaftingRequirement = J.BASE.Helpers.satisfies(J.JAFTING.Metadata.Version, requiredJaftingVersion);
  if (!hasJaftingRequirement)
  {
    throw new Error(`Either missing J-JAFTING or has a lower version than the required: ${requiredJaftingVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.JAFTING.EXT.REFINE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.JAFTING.EXT.REFINE.Metadata = {};
J.JAFTING.EXT.REFINE.Metadata.Version = '1.0.0';
J.JAFTING.EXT.REFINE.Metadata.Name = `J-JAFTING-Refinement`;

/**
 * A helpful mapping of the various messages that we use in JAFTING.
 */
J.JAFTING.EXT.REFINE.Messages = {
  /**
   * The name of the command for Refinement on the JAFTING mode menu.
   */
  RefineCommandName: "Refine",

  /**
   * The name of the command that executes refinement.
   */
  ExecuteRefinementCommandName: "Execute Refinement",

  /**
   * The name of the command that cancels the refinement process.
   */
  CancelRefinementCommandName: "Cancel",

  /**
   * When an item hasn't been selected somehow, this message shows in the help window.
   */
  NoItemSelected: "Nothing is selected.",

  /**
   * When the item being hovered over cannot be used in refinement as a base, show this.
   */
  CannotUseAsBase: "This cannot be used as a base for refinement.",

  /**
   * When the item being hovered over cannot be used in refinement as a material, show this.
   */
  CannotUseAsMaterial: "This cannot be used as a material for refinement.",

  /**
   * When the list window is the selection of a base to refine, this shows up in the mini window.
   */
  ChooseRefinementBase: "Choose Refinement Base",

  /**
   * When the list window is the selection of a material to add, this shows up in the mini window.
   */
  ChooseRefinementMaterial: "Choose Material to Add",

  /**
   * When a material has no traits, this message shows up in the help window.
   */
  NoTraitsOnMaterial: "This material has no traits to refine the base with.",

  /**
   * When the refinement would result in going over the base's max refine count, this shows up.
   */
  ExceedRefineCount: "Refining with this would result in exceeding refine count max:",

  /**
   * When the refinement would result in going over the base's max trait count, this shows up.
   */
  ExceedTraitCount: "Refining with this would result in exceeding trait count max:",

  /**
   * When the player hovers over an equip that has already reached it's max refine count, this shows up.
   */
  AlreadyMaxRefineCount: "This has already been refined the maximum number of times.",

  /**
   * When the player hovers over an equip that has already reached it's max trait count, this shows up.
   */
  AlreadyMaxTraitCount: "This has already been refined with as many traits as it can hold.",

  /**
   * This shows up over the base equip during refinement.
   */
  TitleBase: "Refinement Base",

  /**
   * This shows up over the material equip during refinement.
   */
  TitleMaterial: "Refinement Material",

  /**
   * This shows up over the output equip during refinement.
   */
  TitleOutput: "Refinement Output",

  /**
   * Shown when a material is disabled because it has no traits to grant the base equip.
   */
  NoTransferableTraits: "No transferable traits.",
};

/**
 * A helpful mapping of all the various RMMZ classes being extended.
 */
J.JAFTING.EXT.REFINE.Aliased = {
  DataManager: new Map(),

  RPG_Base: new Map(),

  Game_Item: new Map(),

  Scene_Map: new Map(),

  Window_JaftingModeMenu: {},
};

/**
 * All regular expressions used by this plugin.
 */
J.JAFTING.EXT.REFINE.RegExp = {};
J.JAFTING.EXT.REFINE.RegExp.NotRefinementBase = /<notRefinementBase>/i;
J.JAFTING.EXT.REFINE.RegExp.NotRefinementMaterial = /<notRefinementMaterial>/i;
J.JAFTING.EXT.REFINE.RegExp.Unrefinable = /<unrefinable>/i;
J.JAFTING.EXT.REFINE.RegExp.MaxRefineCount = /<maxRefineCount:[ ]?(\d+)>/i;
J.JAFTING.EXT.REFINE.RegExp.MaxTraitCount = /<maxTraitCount:[ ]?(\d+)>/i;

/**
 * A global object for storing data related to JAFTING.
 * @global
 * @type {Game_JAFTING}
 */
var $gameJAFTING = null;

/**
 * Plugin command for hiding the refinement option in the JAFTING mode selection window.
 */
PluginManager.registerCommand(`${J.JAFTING.EXT.REFINE.Metadata.Name}-Refinement`, "hideJaftingRefinement", () =>
{
  $gameJAFTING.hideRefinement();
});

/**
 * Plugin command for showing the refinement option in the JAFTING mode selection window.
 */
PluginManager.registerCommand(`${J.JAFTING.EXT.REFINE.Metadata.Name}-Refinement`, "showJaftingRefinement", () =>
{
  $gameJAFTING.showRefinement();
});

/**
 * Plugin command for disabling the refinement option in the JAFTING mode selection window.
 */
PluginManager.registerCommand(`${J.JAFTING.EXT.REFINE.Metadata.Name}-Refinement`, "disableJaftingRefinement", () =>
{
  $gameJAFTING.disableRefinement();
});

/**
 * Plugin command for enabling the refinement option in the JAFTING mode selection window.
 */
PluginManager.registerCommand(`${J.JAFTING.EXT.REFINE.Metadata.Name}-Refinement`, "enableJaftingRefinement", () =>
{
  $gameJAFTING.enableRefinement();
});
//endregion Introduction

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

//region JAFT_RefinementData
/**
 * A class containing all the various data points extracted from notes.
 */
class JAFTING_RefinementData
{
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta)
  {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
    this.refinedCount = 0;
    this.maxRefineCount = this.getMaxRefineCount();
    this.maxTraitCount = this.getMaxTraitCount();
    this.notRefinementMaterial = this.isNotMaterial();
    this.notRefinementBase = this.isNotBase();
    this.unrefinable = this.isNotRefinable();
  }

  /**
   * The number of times this piece of equipment can be refined.
   * @returns {number}
   */
  getMaxRefineCount()
  {
    let count = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MaxRefineCount])
    {
      count = parseInt(this._meta[J.BASE.Notetags.MaxRefineCount]) || count;
    }
    else
    {
      const structure = /<maxRefineCount:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          count = parseInt(RegExp.$1);
        }
      })
    }

    return count;
  }

  /**
   * The number of transferable traits that this piece of equipment can have at any one time.
   * @returns {number}
   */
  getMaxTraitCount()
  {
    let count = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MaxRefineTraits])
    {
      count = parseInt(this._meta[J.BASE.Notetags.MaxRefineTraits]) || count;
    }
    else
    {
      const structure = /<maxRefinedTraits:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          count = parseInt(RegExp.$1);
        }
      })
    }

    return count;
  }

  /**
   * Gets whether or not this piece of equipment can be used in refinement as a material.
   * @returns {boolean}
   */
  isNotMaterial()
  {
    let notMaterial = false;
    if (this._meta && this._meta[J.BASE.Notetags.NotRefinementMaterial])
    {
      notMaterial = true;
    }
    else
    {
      const structure = /<notRefinementMaterial>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          notMaterial = true;
        }
      })
    }

    return notMaterial;
  }

  /**
   * Gets whether or not this piece of equipment can be used in refinement as a base.
   * @returns {boolean}
   */
  isNotBase()
  {
    let notBase = false;
    if (this._meta && this._meta[J.BASE.Notetags.NotRefinementBase])
    {
      notBase = true;
    }
    else
    {
      const structure = /<notRefinementBase>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          notBase = true;
        }
      })
    }

    return notBase;
  }

  /**
   * Gets whether or not this piece of equipment can be used in refinement.
   * If this is true, this will mean this cannot be used in refinement as base or material.
   * @returns
   */
  isNotRefinable()
  {
    let noRefine = false;
    if (this._meta && this._meta[J.BASE.Notetags.NoRefinement])
    {
      noRefine = true;
    }
    else
    {
      const structure = /<noRefine>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          noRefine = true;
        }
      })
    }

    return noRefine;
  }
}
//endregion JAFT_RefinementData

//region JAFTING_Trait
/**
 * A class representing a single trait on a piece of equipment that can be potentially
 * transferred by means of JAFTING's refinement mode.
 */
function JAFTING_Trait()
{
  this.initialize(...arguments);
}
JAFTING_Trait.prototype = {};
JAFTING_Trait.prototype.constructor = JAFTING_Trait;

/**
 * Initializes the members of this class.
 * @param {number} code The code of the trait.
 * @param {number} dataId The dataId of the trait.
 * @param {number} value The value of the trait.
 */
JAFTING_Trait.prototype.initialize = function(code, dataId, value)
{
  this._code = code;
  this._dataId = dataId;
  this._value = value;
};

/**
 * The defacto of what JAFTING considers a "divider" trait.
 * All traits defined AFTER this trait are considered transferable.
 * @returns {RPG_Trait}
 */
JAFTING_Trait.divider = function()
{
  return RPG_Trait.fromValues(J.BASE.Traits.NO_DISAPPEAR, 3, 1);
};

/**
 * Gets a standardized concatenation of the name and value for a given trait.
 * @returns {string}
 */
Object.defineProperty(JAFTING_Trait.prototype, "nameAndValue", {
  get()
  {
    return `${this.name} ${this.value}`;
  },
  configurable: true,
});

/**
 * Gets the friendly name of the trait based on the trait code.
 * @returns {string}
 */
Object.defineProperty(JAFTING_Trait.prototype, "name", {
  get()
  {
    switch (this._code)
    {
      // first tab.
      case 11:
        return `${$dataSystem.elements[this._dataId]} dmg`;
      case 12:
        return `${TextManager.param(this._dataId)} debuff rate`;
      case 13:
        return `${$dataStates[this._dataId].name} resist`;
      case 14:
        return `Immune to`;

      // second tab.
      case 21:
        return `${TextManager.param(this._dataId)}`;
      case 22:
        return `${TextManager.xparam(this._dataId)}`;
      case 23:
        return `${TextManager.sparam(this._dataId)}`;

      // third tab.
      case 31:
        return `Attack Element:`;
      case 32:
        return `${$dataStates[this._dataId].name} on-hit`;
      case 33:
        return `Skill Speed`;
      case 34:
        return `Times`;
      case 35:
        return `Basic Attack w/`;

      // fourth tab.
      case 41:
        return `Unlock:`;
      case 42:
        return `Lock:`;
      case 43:
        return `Learn:`;
      case 44:
        return `Seal:`;

      // fifth tab.
      case 51:
        return `${$dataSystem.weaponTypes[this._dataId]}`;
      case 52:
        return `${$dataSystem.armorTypes[this._dataId]}`;
      case 53:
        return `${$dataSystem.equipTypes[this._dataId]}`;
      case 54:
        return `${$dataSystem.equipTypes[this._dataId]}`;
      case 55:
        return `${this._dataId ? "Enable" : "Disable"}`;

      // sixth tab.
      case 61:
        return `Another turn chance:`;
      case 62:
        return `${this.translateSpecialFlag()}`;
      case 64:
        return `${this.translatePartyAbility()}`;

      case 63:
        return `TRANSFERABLE TRAITS`;
      default:
        return "All traits were implemented,";
    }
  },
  configurable: true,
});

/**
 * Gets the friendly value of the trait based on the trait code and value.
 * @returns {string}
 */
Object.defineProperty(JAFTING_Trait.prototype, "value", {
  get()
  {
    switch (this._code)
    {
      // first tab.
      case 11:
        const calculatedElementalRate = Math.round(100 - (this._value * 100));
        return `${calculatedElementalRate > 0 ? "-" : "+"}${calculatedElementalRate}%`;
      case 12:
        const calculatedDebuffRate = Math.round((this._value * 100) - 100);
        return `${calculatedDebuffRate > 0 ? "+" : "-"}${calculatedDebuffRate}%`;
      case 13:
        const calculatedStateRate = Math.round(100 - (this._value * 100));
        return `${calculatedStateRate > 0 ? "+" : "-"}${calculatedStateRate}%`;
      case 14:
        return `${$dataStates[this._dataId].name}`;

      // second tab.
      case 21:
        const calculatedBParam = Math.round((this._value * 100) - 100);
        return `${calculatedBParam >= 0 ? "+" : ""}${calculatedBParam}%`;
      case 22:
        const calculatedXParam = Math.round((this._value * 100));
        return `${calculatedXParam >= 0 ? "+" : ""}${calculatedXParam}%`;
      case 23:
        const calculatedSParam = Math.round((this._value * 100) - 100);
        return `${calculatedSParam >= 0 ? "+" : ""}${calculatedSParam}%`;

      // third tab.
      case 31:
        return `${$dataSystem.elements[this._dataId]}`;
      case 32:
        return `${(this._value * 100)}%`;
      case 33:
        return `${this._value > 0 ? "+" : "-"}${this._value}`;
      case 34:
        return `${this._value > 0 ? "+" : "-"}${this._value}`;
      case 35:
        return `${$dataSkills[this._value].name}`;

      // fourth tab.
      case 41:
        return `${$dataSystem.skillTypes[this._dataId]}`;
      case 42:
        return `${$dataSystem.skillTypes[this._dataId]}`;
      case 43:
        return `${$dataSkills[this._dataId].name}`;
      case 44:
        return `${$dataSkills[this._dataId].name}`;

      // fifth tab.
      case 51:
        return `proficiency`;
      case 52:
        return `proficiency`;
      case 53:
        return `is locked`;
      case 54:
        return `is sealed`;
      case 55:
        return `Dual-wield`;

      // sixth tab.
      case 61:
        return `${Math.round(this._value * 100)}%`;
      case 62:
        return ``;
      case 64:
        return ``;
      case 63:
        return ``;
      default:
        return "is this a custom trait?";
    }
  },
  configurable: true,
});

/**
 * Translates the data id of the trait into what it represents according to RMMZ.
 * @returns {string}
 */
JAFTING_Trait.prototype.translateSpecialFlag = function()
{
  switch (this._dataId)
  {
    case 0:
      return `Autobattle`;
    case 1:
      return `Empowered Guard`;
    case 2:
      return `Cover/Substitute`;
    case 3:
      return `Preserve TP`;
  }
};

/**
 * Translates the data id of the trait into what it represents according to RMMZ.
 * @returns {string}
 */
JAFTING_Trait.prototype.translatePartyAbility = function()
{
  switch (this._dataId)
  {
    case 0:
      return `Encounter Half`;
    case 1:
      return `Encounter None`;
    case 2:
      return `Prevent Surprise`;
    case 3:
      return `Frequent Pre-emptive`;
    case 4:
      return `Gold Dropped 2x`;
    case 5:
      return `Item Drop Chance 2x`;
  }
};

/**
 * Gets the original RM trait associated with this JAFTING trait.
 * @returns {RPG_Trait}
 */
JAFTING_Trait.prototype.convertToRmTrait = function()
{
  return RPG_Trait.fromValues(this._code, this._dataId, this._value);
};
//endregion JAFTING_Trait

J.JAFTING.EXT.REFINE.Aliased.RPG_Base.set('_generate', RPG_Base.prototype._generate);
/**
 * Extends {@link RPG_Base._generate}.
 *
 * Also mirrors additional JAFTING-related values to the new object.
 * @param {RPG_Base} overrides The overriding object.
 * @param {number} index The new index.
 * @returns {this}
 */
RPG_Base.prototype._generate = function(overrides, index)
{
  // perform original logic.
  const original = J.JAFTING.EXT.REFINE.Aliased.RPG_Base.get('_generate').call(this, overrides, index);

  // update the refined count to the latest.
  original.jaftingRefinedCount = overrides.jaftingRefinedCount;

  // return the modificaiton.
  return original;
};

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

//region DataManager
//region save/load data
/**
 * Extends the game object creation to include creating the JAFTING manager.
 */
J.JAFTING.EXT.REFINE.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  J.JAFTING.EXT.REFINE.Aliased.DataManager.createGameObjects.call(this);
  $gameJAFTING = new Game_JAFTING();
};

/**
 * Extends the save content creation to include creating JAFTING data.
 */
J.JAFTING.EXT.REFINE.Aliased.DataManager.makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function()
{
  const contents = J.JAFTING.EXT.REFINE.Aliased.DataManager.makeSaveContents.call(this);
  contents.jafting = $gameJAFTING;
  return contents;
};

/**
 * Extends the save content extraction to include extracting JAFTING data.
 *
 * NOTE: This is the first function encountered where I actually extend it _twice_.
 * As such, we accommodated that by numbering it.
 *
 * TODO: change this plugin to use EXT_REFINE so there is no collision.
 */
J.JAFTING.EXT.REFINE.Aliased.DataManager.extractSaveContents2 = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  // perform original logic.
  J.JAFTING.EXT.REFINE.Aliased.DataManager.extractSaveContents2.call(this, contents);

  // grab the jafting contents out.
  $gameJAFTING = contents.jafting;

  // update the weapons & armor.
  $gameJAFTING.updateDataWeapons();
  $gameJAFTING.updateDataArmors();
};
//endregion save/load data
//endregion DataManager

//region Game_Item
/**
 * Largely overwrites this function to instead leverage an item's index value over
 * it's ID for setting objects to the item slot.
 */
J.JAFTING.EXT.REFINE.Aliased.Game_Item.set('setObject', Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(item)
{
  // perform original logic.
  J.JAFTING.EXT.REFINE.Aliased.Game_Item.get('setObject').call(this, item);

  // assign the item id to here.
  this._itemId = item
    ? item._key()
    : 0;
};
//endregion Game_Item

//region Scene_Map
//region window initialization
/**
 * Extends the initialization of the JAFTING menu to include the refinment windows.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.initJaftingMenu = Scene_Map.prototype.initJaftingMenu;
Scene_Map.prototype.initJaftingMenu = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.initJaftingMenu.call(this);

  // create empty refinement windows.
  this._j._jaftingMenu._refinePrimaryEquipWindow = null;
  this._j._jaftingMenu._refineSecondaryEquipWindow = null;
  this._j._jaftingMenu._refineProjectedResultsWindow = null;
  this._j._jaftingMenu._refineGuidingWindow = null;
  this._j._jaftingMenu._refineConfirmationWindow = null;

  // create empty slots for target and material equipment.
  this._j._jaftingMenu._refinePrimarySlot = null;
  this._j._jaftingMenu._refineSecondarySlot = null;
  this._j._jaftingMenu._refineHoverForDetails = null;
  this._j._jaftingMenu._refineProjectedOutput = null;
};

/**
 * Extends the creation of the JAFTING windows to include the refinement windows.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.createJaftingMenu = Scene_Map.prototype.createJaftingMenu;
Scene_Map.prototype.createJaftingMenu = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.createJaftingMenu.call(this);
  this.createJaftingRefinementModeWindows();
};

/**
 * Creates the mode selection window used to determine which type of JAFTING
 * that the player will perform.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.createJaftingModeWindow = Scene_Map.prototype.createJaftingModeWindow;
Scene_Map.prototype.createJaftingModeWindow = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.createJaftingModeWindow.call(this);
  this._j._jaftingMenu._modeWindow.setHandler('refine-mode', this.chooseJaftingRefineMode.bind(this));
};

/**
 * The actions to perform when selecting the "refinement" mode.
 * Opens up the equipment-only window for picking a base item to refine further.
 */
Scene_Map.prototype.chooseJaftingRefineMode = function()
{
  this.setWindowFocus("refine-primary");
  this.setGuidingWindowText(J.JAFTING.EXT.REFINE.Messages.ChooseRefinementBase);
};

/**
 * Initializes all the windows for use in refinement mode.
 */
Scene_Map.prototype.createJaftingRefinementModeWindows = function()
{
  this.createJaftingRefinementPrimaryEquipWindow();
  this.createJaftingRefinementSecondaryEquipWindow();
  this.createJaftingRefinementProjectedResultsWindow();
  this.createJaftingRefinementGuidingWindow();
  this.createJaftingRefinementConfirmationWindow();
};

/**
 * Creates the "choose refinement target" window.
 */
Scene_Map.prototype.createJaftingRefinementPrimaryEquipWindow = function()
{
  const w = 350;
  const h = Graphics.height - this._j._jaftingMenu._helpWindow.height - 72;
  const x = 0;
  const y = this._j._jaftingMenu._helpWindow.height + 64;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingEquip(rect);
  wind.isPrimary = true;
  wind.setHandler('cancel', this.closeJaftingWindow.bind(this, "refine-primary"));
  wind.setHandler('refine-object', this.choosePrimaryEquip.bind(this));
  this._j._jaftingMenu._refinePrimaryEquipWindow = wind;
  this._j._jaftingMenu._refinePrimaryEquipWindow.close();
  this._j._jaftingMenu._refinePrimaryEquipWindow.hide();
  this.addWindow(this._j._jaftingMenu._refinePrimaryEquipWindow);
};

/**
 * Creates the "choose refinement materials" window.
 */
Scene_Map.prototype.createJaftingRefinementSecondaryEquipWindow = function()
{
  const w = 350;
  const h = Graphics.height - this._j._jaftingMenu._helpWindow.height - 72;
  const x = 0;
  const y = this._j._jaftingMenu._helpWindow.height + 64;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingEquip(rect);
  wind.setHandler('cancel', this.closeJaftingWindow.bind(this, "refine-secondary"));
  wind.setHandler('refine-object', this.chooseSecondaryEquip.bind(this));
  this._j._jaftingMenu._refineSecondaryEquipWindow = wind;
  this._j._jaftingMenu._refineSecondaryEquipWindow.close();
  this._j._jaftingMenu._refineSecondaryEquipWindow.hide();
  this.addWindow(this._j._jaftingMenu._refineSecondaryEquipWindow);
};

/**
 * Creates the projected results window for the refinement process.
 */
Scene_Map.prototype.createJaftingRefinementProjectedResultsWindow = function()
{
  const w = this._j._jaftingMenu._helpWindow.width - (this._j._jaftingMenu._refinePrimaryEquipWindow.width);
  const h = Graphics.height - this._j._jaftingMenu._helpWindow.height - 8;
  const x = this._j._jaftingMenu._recipeListWindow.width;
  const y = this._j._jaftingMenu._helpWindow.height;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingRefinementOutput(rect);
  this._j._jaftingMenu._refineProjectedResultsWindow = wind;
  this._j._jaftingMenu._refineProjectedResultsWindow.close();
  this._j._jaftingMenu._refineProjectedResultsWindow.hide();
  this.addWindow(this._j._jaftingMenu._refineProjectedResultsWindow);
};

/**
 * Creates a small window to show some text above the equipment select list.
 * Guides the player with text like "Choose Refinement Base".
 */
Scene_Map.prototype.createJaftingRefinementGuidingWindow = function()
{
  const w = 350;
  const h = 64;
  const x = 0;
  const y = this._j._jaftingMenu._helpWindow.height;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_Help(rect);
  this._j._jaftingMenu._refineGuidingWindow = wind;
  this._j._jaftingMenu._refineGuidingWindow.close();
  this._j._jaftingMenu._refineGuidingWindow.hide();
  this.addWindow(this._j._jaftingMenu._refineGuidingWindow);
};

/**
 * Creates a window that acts as a safety net in case the player was mashing buttons.
 * Requires confirmation to execute a refinement and potentially losing an equip forever.
 */
Scene_Map.prototype.createJaftingRefinementConfirmationWindow = function()
{
  const w = 350;
  const h = 120;
  const x = (Graphics.boxWidth - w) / 2;
  const y = (Graphics.boxHeight - h) / 2;
  const rect = new Rectangle(x, y, w, h);
  this._j._jaftingMenu._refineConfirmationWindow = new Window_JaftingRefinementConfirmation(rect);
  this._j._jaftingMenu._refineConfirmationWindow.setHandler('ok', this.onRefineConfirm.bind(this));
  this._j._jaftingMenu._refineConfirmationWindow.setHandler('cancel', this.onRefineCancel.bind(this));
  this._j._jaftingMenu._refineConfirmationWindow.hide();
  this.addWindow(this._j._jaftingMenu._refineConfirmationWindow);
};
//endregion window initialization

/**
 * When a refinement target is selected, perform this logic.
 */
Scene_Map.prototype.choosePrimaryEquip = function()
{
  this.setPrimaryRefineSlot(this.getHoverForDetails().data);
  this.setGuidingWindowText(J.JAFTING.EXT.REFINE.Messages.ChooseRefinementMaterial);
  this.setWindowFocus("refine-secondary");
};

/**
 * When a refinement material is selected, perform this logic.
 */
Scene_Map.prototype.chooseSecondaryEquip = function()
{
  this.setSecondaryRefineSlot(this.getHoverForDetails().data);
  this.setWindowFocus("refine-confirm");
};

/**
 * When the player confirms they want to refine, then execute refinement!
 */
Scene_Map.prototype.onRefineConfirm = function()
{
  this.executeRefinement();
  this.closeJaftingWindow("refine-confirm-okay");
};

/**
 * If the player cancels the refinement, return back to the material selection.
 */
Scene_Map.prototype.onRefineCancel = function()
{
  this.closeJaftingWindow("refine-confirm-cancel");
};

/**
 * Executes the refinement, including removing old equips, creating the new equip, and refreshing.
 */
Scene_Map.prototype.executeRefinement = function()
{
  this.removeRefinementEquips();
  this.generateRefinementOutput();
  this.refreshJafting();
};

/**
 * Removes the two equips used to perform the refinement from the player's inventory.
 */
Scene_Map.prototype.removeRefinementEquips = function()
{
  $gameParty.gainItem(this.getPrimaryRefineSlot(), -1);
  $gameParty.gainItem(this.getSecondaryRefineSlot(), -1);
};

/**
 * Generates the equip and adds it to the player's inventory.
 */
Scene_Map.prototype.generateRefinementOutput = function()
{
  $gameJAFTING.createRefinedOutput(this._j._jaftingMenu._refineProjectedResultsWindow.outputEquip);
};

/**
 * Gets the projected result of refinement.
 * @returns {RPG_EquipItem}
 */
Scene_Map.prototype.getRefinementProjectedResult = function()
{
  return this._j._jaftingMenu._refineProjectedOutput;
};

/**
 * Sets the projected result of refinement to the designated equip.
 * @param {RPG_EquipItem} output The equip to set as the projected result.
 */
Scene_Map.prototype.setRefinementProjectedResult = function(output)
{
  this._j._jaftingMenu._refineProjectedOutput = output;
};

/**
 * Gets the object that is "being hovered over" in the equip lists.
 * @returns {RPG_EquipItem}
 */
Scene_Map.prototype.getHoverForDetails = function()
{
  return this._j._jaftingMenu._refineHoverForDetails;
};

/**
 * Sets the object that is "being hovered over" in the equip lists.
 * @param {RPG_EquipItem} equip The equip to set for viewing in the output window.
 */
Scene_Map.prototype.setHoverForDetails = function(equip)
{
  this._j._jaftingMenu._refineHoverForDetails = equip;
};

/**
 * Sets the given equipment to the primary refinement slot.
 * @param {RPG_EquipItem} equip The equip to set the primary refinement slot to.
 */
Scene_Map.prototype.setPrimaryRefineSlot = function(equip)
{
  this._j._jaftingMenu._refinePrimarySlot = equip;
  this._j._jaftingMenu._refineProjectedResultsWindow.primaryEquip = equip;

  // also assign the same thing to the secondary window to prevent using the same item twice.
  this._j._jaftingMenu._refineSecondaryEquipWindow.baseSelection = equip;
  this._j._jaftingMenu._refineSecondaryEquipWindow.refresh();
};

/**
 * Gets the equipment in the primary refinement slot.
 * @returns {RPG_EquipItem}
 */
Scene_Map.prototype.getPrimaryRefineSlot = function()
{
  return this._j._jaftingMenu._refinePrimarySlot;
};

/**
 * Sets the given equipment to the secondary refinement slot.
 * @param {RPG_EquipItem} equip The equip to set the primary refinement slot to.
 */
Scene_Map.prototype.setSecondaryRefineSlot = function(equip)
{
  this._j._jaftingMenu._refineSecondarySlot = equip;
  this._j._jaftingMenu._refineProjectedResultsWindow.secondaryEquip = equip;
};

/**
 * Gets the equipment in the secondary refinement slot.
 * @returns {RPG_EquipItem}
 */
Scene_Map.prototype.getSecondaryRefineSlot = function()
{
  return this._j._jaftingMenu._refineSecondarySlot;
};

/**
 * Sets the text in the refinement guiding window.
 * @param {string} text The text to display in the guiding window.
 */
Scene_Map.prototype.setGuidingWindowText = function(text)
{
  this._j._jaftingMenu._refineGuidingWindow.setText(text);
};

/**
 * Refreshes all windows that could possibly require refreshing when requested.
 * As an example, if the player gains/loses an item, all windows will need refreshing
 * to reflect the change in quantity.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.refreshJafting = Scene_Map.prototype.refreshJafting;
Scene_Map.prototype.refreshJafting = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.refreshJafting.call(this);
  this._j._jaftingMenu._refinePrimaryEquipWindow.refresh();
  this._j._jaftingMenu._refineSecondaryEquipWindow.refresh();
  this._j._jaftingMenu._refineProjectedResultsWindow.refresh();
};

/**
 * Extends the jafting window focus management to accommodate refinement mode.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.manageJaftingMenu = Scene_Map.prototype.manageJaftingMenu;
Scene_Map.prototype.manageJaftingMenu = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.manageJaftingMenu.call(this);

  // extend for refinement focuses.
  switch (this.getWindowFocus())
  {
    case "refine-primary":
      this.toggleJaftingModeWindow(false);
      this.toggleJaftingRefinePrimaryWindow(true);
      this.toggleJaftingRefineSecondaryWindow(false);
      this.toggleJaftingRefineOutputWindow(true);
      this.toggleJaftingRefineGuidingWindow(true);
      this.determineRefinementHelpWindowText();
      break;
    case "refine-secondary":
      this.toggleJaftingRefinePrimaryWindow(false);
      this.toggleJaftingRefineSecondaryWindow(true);
      this.toggleJaftingRefineOutputWindow(true);
      this.determineRefinementHelpWindowText();
      break;
    case "refine-confirm":
      this.toggleJaftingRefineConfirmationWindow(true);
      break;
  }
};

/**
 * Extends the jafting window closing-by-tag function to accommodate refinement mode.
 * @param {string} jaftingWindowToClose The type of window we're closing.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.closeJaftingWindow = Scene_Map.prototype.closeJaftingWindow;
Scene_Map.prototype.closeJaftingWindow = function(jaftingWindowToClose)
{
  J.JAFTING.EXT.REFINE.Aliased.Scene_Map.closeJaftingWindow.call(this, jaftingWindowToClose);
  switch (jaftingWindowToClose)
  {
    case "refine-primary":
      this.setPrimaryRefineSlot(null);
      this.setHoverForDetails(null);
      this.toggleJaftingRefinePrimaryWindow(false);
      this.toggleJaftingRefineOutputWindow(false);
      this.toggleJaftingModeWindow(true);
      this.setGuidingWindowText("");
      this.toggleJaftingRefineGuidingWindow(false);
      this.toggleJaftingRefineConfirmationWindow(false);
      this.setWindowFocus("main");
      break;
    case "refine-secondary":
      this.setSecondaryRefineSlot(null);
      this.setHoverForDetails(null);
      this.toggleJaftingRefineSecondaryWindow(false);
      this.setGuidingWindowText(J.JAFTING.EXT.REFINE.Messages.ChooseRefinementBase);
      this.toggleJaftingRefineConfirmationWindow(false);
      this.setWindowFocus("refine-primary");
      break;
    case "refine-confirm-okay":
      this.toggleJaftingRefineConfirmationWindow(false);
      this.setPrimaryRefineSlot(null);
      this.setSecondaryRefineSlot(null);
      this.setHoverForDetails(null);
      this.setGuidingWindowText(J.JAFTING.EXT.REFINE.Messages.ChooseRefinementBase);
      this.setWindowFocus("refine-primary");
      break;
    case "refine-confirm-cancel":
      this.toggleJaftingRefineConfirmationWindow(false);
      this.setWindowFocus("refine-secondary");
      break;
  }
};

/**
 * Sets the text of the help window for the mode selection based on
 * the currently selected category.
 */
Scene_Map.prototype.determineRefinementHelpWindowText = function()
{
  if (this._j._jaftingMenu._refinePrimaryEquipWindow.active)
  {
    this.drawRefinementPrimaryHelpWindowText()
  }
  else if (this._j._jaftingMenu._refineSecondaryEquipWindow.active)
  {
    this.drawRefinementSecondaryHelpWindowText();
  }

  // draws the help text based on the hovered item.
  this.drawRefineHelpText();
};

/**
 * Handles the help window text during refinement when the target is being selected.
 */
Scene_Map.prototype.drawRefinementPrimaryHelpWindowText = function()
{
  const index = this._j._jaftingMenu._refinePrimaryEquipWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._refinePrimaryEquipWindow.currentIndex) return;

  this.setRefinementProjectedResult(null);

  // sets the currently hovered over equipItem for the help and output windows.
  const hoveredOver = this._j._jaftingMenu._refinePrimaryEquipWindow.currentExt();
  if (!hoveredOver?.data) return;

  this.setHoverForDetails(hoveredOver);
  this._j._jaftingMenu._refinePrimaryEquipWindow.currentIndex = index;
  this._j._jaftingMenu._refineProjectedResultsWindow.primaryEquip = hoveredOver.data;
};

/**
 * Handles the help window text during refinement when the material is being selected.
 */
Scene_Map.prototype.drawRefinementSecondaryHelpWindowText = function()
{
  const index = this._j._jaftingMenu._refineSecondaryEquipWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._refineSecondaryEquipWindow.currentIndex) return;

  // sets the currently hovered over equipItem for the help and output windows.
  const hoveredOver = this._j._jaftingMenu._refineSecondaryEquipWindow.currentExt();
  if (!hoveredOver?.data) return;

  this.setHoverForDetails(hoveredOver);

  this._j._jaftingMenu._refineSecondaryEquipWindow.currentIndex = index;
  this._j._jaftingMenu._refineProjectedResultsWindow.secondaryEquip = hoveredOver.data;
};

/**
 * Draws the actual text into the top help window.
 */
Scene_Map.prototype.drawRefineHelpText = function()
{
  const item = this.getHoverForDetails();
  if (item && item.data)
  {
    if (item.data.jaftingNotRefinementBase && this._j._jaftingMenu._refinePrimaryEquipWindow.active)
    {
      this._j._jaftingMenu._helpWindow.setText(J.JAFTING.EXT.REFINE.Messages.CannotUseAsBase);
    }
    else if (item.data.jaftingNotRefinementMaterial && this._j._jaftingMenu._refineSecondaryEquipWindow.active)
    {
      this._j._jaftingMenu._helpWindow.setText(J.JAFTING.EXT.REFINE.Messages.CannotUseAsMaterial);
    }
    else if (item.error !== "")
    {
      this._j._jaftingMenu._helpWindow.setText(item.error);
    }
    else
    {
      this._j._jaftingMenu._helpWindow.setItem(item.data);
    }
  }
  else
  {
    this._j._jaftingMenu._helpWindow.setText(J.JAFTING.EXT.REFINE.Messages.NoItemSelected);
  }
};

/**
 * Toggles the visibility for the refinement target selection while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefinePrimaryWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refinePrimaryEquipWindow.show();
    this._j._jaftingMenu._refinePrimaryEquipWindow.open();
    this._j._jaftingMenu._refinePrimaryEquipWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refinePrimaryEquipWindow.close();
    this._j._jaftingMenu._refinePrimaryEquipWindow.hide();
    this._j._jaftingMenu._refinePrimaryEquipWindow.deactivate();
    this._j._jaftingMenu._refinePrimaryEquipWindow.forceSelect(0);
    this._j._jaftingMenu._refinePrimaryEquipWindow.currentIndex = null;
  }
};

/**
 * Toggles the visibility for the refinement material selection while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefineSecondaryWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refineSecondaryEquipWindow.show();
    this._j._jaftingMenu._refineSecondaryEquipWindow.open();
    this._j._jaftingMenu._refineSecondaryEquipWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refineSecondaryEquipWindow.close();
    this._j._jaftingMenu._refineSecondaryEquipWindow.hide();
    this._j._jaftingMenu._refineSecondaryEquipWindow.deactivate();
    this._j._jaftingMenu._refineSecondaryEquipWindow.forceSelect(0);
    this._j._jaftingMenu._refineSecondaryEquipWindow.currentIndex = null;
  }
};

/**
 * Toggles the visibility for the refinement output window while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefineOutputWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refineProjectedResultsWindow.show();
    this._j._jaftingMenu._refineProjectedResultsWindow.open();
    this._j._jaftingMenu._refineProjectedResultsWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refineProjectedResultsWindow.close();
    this._j._jaftingMenu._refineProjectedResultsWindow.hide();
    this._j._jaftingMenu._refineProjectedResultsWindow.deactivate();
  }
};

/**
 * Toggles the visibility for the refinement help window while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefineGuidingWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refineGuidingWindow.show();
    this._j._jaftingMenu._refineGuidingWindow.open();
    this._j._jaftingMenu._refineGuidingWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refineGuidingWindow.close();
    this._j._jaftingMenu._refineGuidingWindow.hide();
    this._j._jaftingMenu._refineGuidingWindow.deactivate();
  }
};

/**
 * Toggles the visibility for the refinement confirmation window while JAFTING.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRefineConfirmationWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._refineConfirmationWindow.show();
    this._j._jaftingMenu._refineConfirmationWindow.open();
    this._j._jaftingMenu._refineConfirmationWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._refineConfirmationWindow.close();
    this._j._jaftingMenu._refineConfirmationWindow.hide();
    this._j._jaftingMenu._refineConfirmationWindow.deactivate();
  }
};
//endregion Scene_Map

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

//region Window_JaftingModeMenu
/**
 * Extends the mode command creation to include a new command for refinement.
 */
J.JAFTING.EXT.REFINE.Aliased.Window_JaftingModeMenu.makeCommandList = Window_JaftingModeMenu.prototype.makeCommandList;
Window_JaftingModeMenu.prototype.makeCommandList = function()
{
  J.JAFTING.EXT.REFINE.Aliased.Window_JaftingModeMenu.makeCommandList.call(this);
  if ($gameJAFTING.isRefinementHidden()) return;

  const hasEquipment = $gameParty.equipItems().length > 1; // need at least 2 items to refine.
  const refineAllowed = $gameJAFTING.isRefinementEnabled();
  const canRefine = hasEquipment && refineAllowed;
  const refineCommand = {
    name: J.JAFTING.EXT.REFINE.Messages.RefineCommandName,
    symbol: `refine-mode`,
    enabled: canRefine,
    ext: null,
    icon: 223
  };
  this._list.splice(1, 0, refineCommand);
};
//endregion Window_JaftingModeMenu

//region Window_JaftingRefinementConfirmation
/**
 * A window that gives the player a chance to confirm or cancel their
 * refinement before executing.
 */
class Window_JaftingRefinementConfirmation
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
  }

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    this.addCommand(`${J.JAFTING.EXT.REFINE.Messages.ExecuteRefinementCommandName}`, `ok`, true, null, 91);
    this.addCommand(`${J.JAFTING.EXT.REFINE.Messages.CancelRefinementCommandName}`, `cancel`, true, null, 90);
  }
}
//endregion Window_JaftingRefinementConfirmation

//region Window_JaftingRefinementOutput
/**
 * The window containing the chosen equips for refinement and also the projected results.
 */
class Window_JaftingRefinementOutput
  extends Window_Base
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
    this.opacity = 220;
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The primary equip that is the refinement target.
     * Traits from the secondary equip will be transfered to this equip.
     * @type {RPG_EquipItem}
     */
    this._primaryEquip = null;

    /**
     * The secondary equip that is the refinement material.
     * The transferable traits on this equip will be transfered to the target.
     * @type {RPG_EquipItem}
     */
    this._secondaryEquip = null;

    /**
     * The output of what would be the result from refining these items.
     * @type {RPG_EquipItem}
     */
    this._resultingEquip = null;
  }

  /**
   * Gets the primary equip selected, aka the refinement target.
   * @returns {RPG_EquipItem}
   */
  get primaryEquip()
  {
    return this._primaryEquip;
  }

  /**
   * Sets the primary equip selected, aka the refinement target.
   * @param {RPG_EquipItem} equip The equip to set as the target.
   */
  set primaryEquip(equip)
  {
    this._primaryEquip = equip;
    this.refresh();
  }

  /**
   * Gets the secondary equip selected, aka the refinement material.
   * @returns {RPG_EquipItem}
   */
  get secondaryEquip()
  {
    return this._secondaryEquip;
  }

  /**
   * Sets the secondary equip selected, aka the refinement material.
   * @param {RPG_EquipItem} equip The equip to set as the material.
   */
  set secondaryEquip(equip)
  {
    this._secondaryEquip = equip;
    this.refresh();
  }

  /**
   * Gets the resulting equip from the output.
   */
  get outputEquip()
  {
    return this._resultingEquip;
  }

  /**
   * Sets the resulting equip to the output to allow for the scene to grab the data.
   * @param {RPG_EquipItem} equip The equip to set.
   */
  set outputEquip(equip)
  {
    this._resultingEquip = equip;
  }

  lineHeight()
  {
    return 32;
  }

  refresh()
  {
    // redraw all the contents.
    this.contents.clear();
    this.drawContent();
  }

  /**
   * Draws all content in this window.
   */
  drawContent()
  {
    // if we don't have anything in the target slot, do not draw anything.
    if (!this.primaryEquip) return;

    this.drawRefinementTarget();
    this.drawRefinementMaterial();
    this.drawRefinementResult();
  }

  /**
   * Draws the primary equip that is being used as a base for refinement.
   * Will draw whatever is being hovered over if nothing is selected.
   */
  drawRefinementTarget()
  {
    this.drawEquip(this.primaryEquip, 0, "base");
  }

  /**
   * Draws the secondary equip that is being used as a material for refinement.
   * Will draw whatever is being hovered over if nothing is selected.
   */
  drawRefinementMaterial()
  {
    if (!this.secondaryEquip) return;

    this.drawEquip(this.secondaryEquip, 350, "material");
  }

  /**
   * Draws one column of a piece of equip and it's traits.
   * @param {RPG_EquipItem} equip The equip to draw details for.
   * @param {number} x The `x` coordinate to start drawing at.
   * @param {string} type Which column this is.
   */
  drawEquip(equip, x, type)
  {
    if (type === "output")
    {
      console.log();
    }
    const parsedTraits = $gameJAFTING.parseTraits(equip);
    const jaftingTraits = $gameJAFTING.combineBaseParameterTraits(parsedTraits);
    this.drawEquipTitle(equip, x, type);
    this.drawEquipTraits(jaftingTraits, x);
  }

  /**
   * Draws the title for this portion of the equip details.
   * @param {RPG_EquipItem} equip The equip to draw details for.
   * @param {number} x The `x` coordinate to start drawing at.
   * @param {string} type Which column this is.
   */
  drawEquipTitle(equip, x, type)
  {
    const lh = this.lineHeight();
    const cw = 300;
    switch (type)
    {
      case "base":
        this.drawTextEx(`\\PX[16]${J.JAFTING.EXT.REFINE.Messages.TitleBase}`, x + (cw * 0), lh * 0, 200);
        break;
      case "material":
        this.drawTextEx(`\\PX[16]${J.JAFTING.EXT.REFINE.Messages.TitleMaterial}`, x + (cw * 1), lh * 0, 200);
        break;
      case "output":
        this.drawTextEx(`\\PX[16]${J.JAFTING.EXT.REFINE.Messages.TitleOutput}`, x + (cw * 2), lh * 0, 200);
        break;
    }

    if (type === "output")
    {
      if (equip.jaftingRefinedCount === 0)
      {
        this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${equip.name} +1\\C[0]`, x, lh * 1, 200);
      }
      else
      {
        const suffix = `+${equip.jaftingRefinedCount + 1}`;
        const index = equip.name.lastIndexOf("+");
        if (index > -1)
        {
          // if we found a +, then strip it out and add the suffix to it.
          const name = `${equip.name.slice(0, index)}${suffix}`;
          this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${name}\\C[0]`, x, lh * 1, 200);
        }
        else
        {
          // in cases where a refined equip is being used as a material for a never-before refined
          // equip, then there won't be any string manipulation for it's name.
          const name = `${equip.name} ${suffix}`;
          this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${name}\\C[0]`, x, lh * 1, 200);
        }
      }
    }
    else
    {
      this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${equip.name}\\C[0]`, x, lh * 1, 200);
    }
  }

  /**
   * Draws all transferable traits on this piece of equipment.
   * @param {RPG_Trait[]} traits A list of transferable traits.
   * @param {number} x The `x` coordinate to start drawing at.
   */
  drawEquipTraits(traits, x)
  {
    const lh = this.lineHeight();
    if (!traits.length)
    {
      this.drawTextEx(`${J.JAFTING.EXT.REFINE.Messages.NoTransferableTraits}`, x, lh * 2, 250);
      return;
    }

    traits.sort((a, b) => a._code - b._code);

    traits.forEach((trait, index) =>
    {
      const y = (lh * 2) + (index * lh);
      this.drawTextEx(`${trait.nameAndValue}`, x, y, 250);
    });
  }

  /**
   * Draws the projected refinement result of fusing the material into the base.
   */
  drawRefinementResult()
  {
    // don't try to draw the result if the player hasn't made it to the material yet.
    if (!this.primaryEquip || !this.secondaryEquip) return;

    // produce the potential result if confirmed.
    const result = $gameJAFTING.determineRefinementOutput(this.primaryEquip, this.secondaryEquip);

    // render the projected merge results.
    this.drawEquip(result, 700, "output");

    // assign it for ease of retrieving from the scene.
    this.outputEquip = result;
  }

}
//endregion Window_JaftingRefinementOutput