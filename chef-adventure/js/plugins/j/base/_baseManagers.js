/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] Mods/Adds for the various manager object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of BASE.
 * This is a cluster of all changes/overwrites to the objects that would
 * otherwise be found in the rmmz_managers.js, such as DataManager. Also, any
 * new things that follow the pattern that defines a manager object can be found
 * in here.
 * ============================================================================
 */

//#region Static objects
//#region DataManager
/**
* Whether or not the extra data was loaded into the multiple databases.
*/
DataManager._extraDataLoaded = false;

/**
 * Hooks into the database loading and loads our extra data from notes and such.
 */
J.BASE.Aliased.DataManager.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  let result = J.BASE.Aliased.DataManager.isDatabaseLoaded.call(this);
  if (result) {
    this.loadExtraData();
  }

  return result;
};

/**
 * Loads all extra data from notes and such into the various anonymous database objects.
 */
DataManager.loadExtraData = function() {
  if (!DataManager._extraDataLoaded) {
    this.addExtraSkillData();
    this.addExtraWeaponData();
    this.addExtraArmorData();
    this.addExtraItemData();
    this.addExtraStateData();
    this._extraDataLoaded = true;
  }
};

/**
 * Loads all extra data from the notes of skills.
 */
DataManager.addExtraSkillData = function() {
  $dataSkills.forEach((skill, index) => {
    if (!skill) return;
    skill._j = new JABS_SkillData(skill.note, skill.meta);
    skill.index = index;
  });
};

/**
 * Loads all extra data from the notes of weapons.
 */
DataManager.addExtraWeaponData = function() {
  $dataWeapons.forEach(DataManager.parseWeaponData);
};

/**
 * The action to perform on each weapon.
 * This was separated out for extensibility if desired.
 * @param {rm.types.EquipItem} weapon The equip to modify.
 * @param {number} index The index of the equip.
 */
DataManager.parseWeaponData = function(weapon, index) {
  if (!weapon) return;
  weapon._j = new JABS_EquipmentData(weapon.note, weapon.meta);
  weapon._jafting = new JAFTING_RefinementData(weapon.note, weapon.meta);
  weapon.index = index;
};

/**
 * Loads all extra data from the notes of armors.
 */
DataManager.addExtraArmorData = function() {
  $dataArmors.forEach(DataManager.parseArmorData);
};

/**
 * The action to perform on each armor.
 * This was separated out for extensibility if desired.
 * @param {rm.types.EquipItem} armor The equip to modify.
 * @param {number} index The index of the equip.
 */
DataManager.parseArmorData = function(armor, index) {
  if (!armor) return;
  armor._j = new JABS_EquipmentData(armor.note, armor.meta);
  armor._jafting = new JAFTING_RefinementData(armor.note, armor.meta);
  armor.index = index;
};

/**
 * Loads all extra data from the notes of items.
 */
DataManager.addExtraItemData = function() {
  $dataItems.forEach((item, index) => {
    if (!item) return;
    item._j = new JABS_ItemData(item.note, item.meta);
    item.index = index;
    item.refinedCount = 0;
  });
};

/**
 * Loads all extra data from the notes of states.
 */
DataManager.addExtraStateData = function() {
  $dataStates.forEach((state, index) => {
    if (!state) return;
    state._j = new JABS_StateData(state.note, state.meta);
    state.index = index;
  });
};
//#endregion DataManager

//#region TextManager
/**
 * Gets the name of the given sp-parameter.
 * @param {number} sParamId The id of the sp-param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.sparam = function(sParamId) {
  switch (sParamId) {
    case 0: return "Aggro";// J.Param.TGR_text;
    case 1: return "Parry";//J.Param.GRD_text;
    case 2: return "Healing Rate"; //J.Param.REC_text;
    case 3: return "Item Effects"; //J.Param.PHA_text;
    case 4: return "Magi Cost"; //J.Param.MCR_text;
    case 5: return "Tech Cost"; //J.Param.TCR_text;
    case 6: return "Phys Dmg Rate"; //J.Param.PDR_text;
    case 7: return "Magi Dmg Rate"; //J.Param.MDR_text;
    case 8: return "Light-footed"; //J.Param.FDR_text;
    case 9: return "Experience UP"; //J.Param.EXR_text;
  }
};

/**
 * Gets the name of the given ex-parameter.
 * @param {number} xParamId The id of the ex-param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.xparam = function(xParamId) {
  switch (xParamId) {
    case 0: return "Accuracy";// J.Param.HIT_text;
    case 1: return "Parry Extend";//J.Param.EVA_text;
    case 2: return "Critical Hit"; //J.Param.CRI_text;
    case 3: return "Crit Dodge"; //J.Param.CEV_text;
    case 4: return "Magic Evade"; //J.Param.MEV_text;
    case 5: return "Magic Reflect"; //J.Param.MRF_text;
    case 6: return "Autocounter"; //J.Param.CNT_text;
    case 7: return "HP Regen"; //J.Param.HRG_text;
    case 8: return "MP Regen"; //J.Param.MRG_text;
    case 9: return "TP Regen"; //J.Param.TRG_text;
  }
};
/**
* Gets the `parameter name` based on the "long" parameter id.
* 
* "Long" parameter ids are used in the context of 0-27, rather than
* 0-7 for param, 0-9 for xparam, and 0-9 for sparam.
* @param {number} paramId The "long" parameter id.
* @returns {string} The `name`.
*/
TextManager.longParam = function(paramId) {
  switch (paramId) {
    case  0: return   this.param(paramId); // mhp
    case  1: return   this.param(paramId); // mmp
    case  2: return   this.param(paramId); // atk
    case  3: return   this.param(paramId); // def
    case  4: return   this.param(paramId); // mat
    case  5: return   this.param(paramId); // mdf
    case  6: return   this.param(paramId); // agi
    case  7: return   this.param(paramId); // luk
    case  8: return  this.xparam(paramId-8); // hit
    case  9: return  this.xparam(paramId-8); // eva (parry boost)
    case 10: return  this.xparam(paramId-8); // cri
    case 11: return  this.xparam(paramId-8); // cev
    case 12: return  this.xparam(paramId-8); // mev (unused)
    case 13: return  this.xparam(paramId-8); // mrf 
    case 14: return  this.xparam(paramId-8); // cnt (autocounter)
    case 15: return  this.xparam(paramId-8); // hrg
    case 16: return  this.xparam(paramId-8); // mrg
    case 17: return  this.xparam(paramId-8); // trg
    case 18: return  this.sparam(paramId-18); // trg (aggro)
    case 19: return  this.sparam(paramId-18); // grd (parry)
    case 20: return  this.sparam(paramId-18); // rec
    case 21: return  this.sparam(paramId-18); // pha
    case 22: return  this.sparam(paramId-18); // mcr (mp cost)
    case 23: return  this.sparam(paramId-18); // tcr (tp cost)
    case 24: return  this.sparam(paramId-18); // pdr
    case 25: return  this.sparam(paramId-18); // mdr
    case 26: return  this.sparam(paramId-18); // fdr
    case 27: return  this.sparam(paramId-18); // exr
    default:
      console.warn(`paramId:${paramId} didn't map to any of the default parameters.`);
      return '';
  }
};
//#endregion TextManager

//#region IconManager
/**
 * A static class that manages the icon to X correlation, such as stats and elements.
 */
class IconManager {
  /**
   * The constructor is not designed to be called. 
   * This is a static class.
   * @constructor
   */
   constructor() { throw new Error("The IconManager is a static class."); };

   /**
    * Gets the corresponding `iconIndex` for the param.
    * @param {number} paramId The id of the param.
    * @returns {number} The `iconIndex`.
    */
  static param(paramId) {
    switch (paramId) {
      case  0: return 32; // mhp
      case  1: return 33; // mmp
      case  2: return 34; // atk
      case  3: return 35; // def
      case  4: return 36; // mat
      case  5: return 37; // mdf
      case  6: return 38; // agi
      case  7: return 39; // luk
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the x-param.
   * @param {number} paramId The id of the param.
   * @returns {number} The `iconIndex`.
   */
  static xparam(paramId) {
    switch (paramId) {
      case  0: return 102; // hit
      case  1: return  82; // eva (parry boost)
      case  2: return 127; // cri
      case  3: return  81; // cev
      case  4: return  71; // mev
      case  5: return 222; // mrf
      case  6: return  15; // cnt (autocounter)
      case  7: return 2153; // hrg
      case  8: return 2245; // mrg
      case  9: return   13; // trg
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the s-param.
   * @param {number} paramId The id of the param.
   * @returns {number} The `iconIndex`.
   */
  static sparam(paramId) {
    switch (paramId) {
      case  0: return  14; // trg (aggro)
      case  1: return 128; // grd (parry)
      case  2: return  84; // rec
      case  3: return 209; // pha
      case  4: return 189; // mcr (mp cost)
      case  5: return 126; // tcr (tp cost)
      case  6: return 129; // pdr
      case  7: return 147; // mdr
      case  8: return 141; // fdr
      case  9: return 156; // exr
    }
  };

  /**
   * Gets the `iconIndex` based on the "long" parameter id.
   * 
   * "Long" parameter ids are used in the context of 0-27, rather than
   * 0-7 for param, 0-9 for xparam, and 0-9 for sparam.
   * @param {number} paramId The "long" parameter id.
   * @returns {number} The `iconIndex`.
   */
  static longParam(paramId) {
    switch (paramId) {
      case  0: return  this.param(paramId); // mhp
      case  1: return  this.param(paramId); // mmp
      case  2: return  this.param(paramId); // atk
      case  3: return  this.param(paramId); // def
      case  4: return  this.param(paramId); // mat
      case  5: return  this.param(paramId); // mdf
      case  6: return  this.param(paramId); // agi
      case  7: return  this.param(paramId); // luk
      case  8: return  this.xparam(paramId-8); // hit
      case  9: return  this.xparam(paramId-8); // eva (parry boost)
      case 10: return  this.xparam(paramId-8); // cri
      case 11: return  this.xparam(paramId-8); // cev
      case 12: return  this.xparam(paramId-8); // mev (unused)
      case 13: return  this.xparam(paramId-8); // mrf 
      case 14: return  this.xparam(paramId-8); // cnt (autocounter)
      case 15: return  this.xparam(paramId-8); // hrg
      case 16: return  this.xparam(paramId-8); // mrg
      case 17: return  this.xparam(paramId-8); // trg
      case 18: return  this.sparam(paramId-18); // trg (aggro)
      case 19: return  this.sparam(paramId-18); // grd (parry)
      case 20: return  this.sparam(paramId-18); // rec
      case 21: return  this.sparam(paramId-18); // pha
      case 22: return  this.sparam(paramId-18); // mcr (mp cost)
      case 23: return  this.sparam(paramId-18); // tcr (tp cost)
      case 24: return  this.sparam(paramId-18); // pdr
      case 25: return  this.sparam(paramId-18); // mdr
      case 26: return  this.sparam(paramId-18); // fdr
      case 27: return  this.sparam(paramId-18); // exr
      default:
        console.warn(`paramId:${paramId} didn't map to any of the default parameters.`);
        return 0;
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the element based on their id.
   * @param {number} elementId The id of the element.
   * @returns {number}
   */
  static element(elementId) {
    switch(elementId) {
      case -1: return 1;   // inherits element from parent.
      case  0: return 70;  // true
      case  1: return 912; // cut
      case  2: return 913; // poke
      case  3: return 914; // blunt
      case  4: return 915; // heat
      case  5: return 916; // liquid
      case  6: return 917; // air
      case  7: return 918; // ground
      case  8: return 919; // energy
      case  9: return 920; // void
      case 10: return 127; // typeless
      case 11: return 302; // vs undead
      case 12: return 321; // vs reptile
      case 13: return 345; // vs aquatic
      case 14: return 342; // vs slime
      case 15: return 184; // vs plants
      case 16: return 2112;// vs beast
      case 17: return 348; // vs insect
      case 18: return 82;  // vs humanoid
      case 19: return 83;  // vs construct
      case 20: return 2192;// vs deity
      case 21: return 403; // x weaponry
      case 22: return 364; // x flying
      case 23: return 453; // x shields
      case 24: return 72;  // x aura
      case 25: return 200; // tool shatter
      case 26: return 218; // tool crush
      case 27: return 1904;// tool ignite
      default: return 93;  // a question mark for the unknown.
    }
  };

  /**
   * Gets the icon for the skill type.
   * @param {number} skillTypeId The id of the skill type.
   * @returns {number} The corresponding icon index.
   */
  static skillType(skillTypeId) {
    switch (skillTypeId) {
      case  1: return 82;   // dodging skills
      case  2: return 2592; // guarding skills
      case  3: return 77;   // techniques (jerald)
      case  4: return 79;   // magecraft (rupert)
      case  5: return 188;  // panelogy
      case  6: return 227;  // tool skills
      case  7: return 76;   // weapon skills
      case  8: return 68;   // geology (earthie)
      case  9: return 69;   // nephology (skye)
      case 10: return 64;   // magmology (cynder)
      case 11: return 67;   // hydrology (aqualocke)
      default: return 0;
    }
  };

  /**
   * Gets the icon for the weapon type.
   * @param {number} weaponTypeId The id of the weapon type.
   * @returns {number} The corresponding icon index.
   */
  static weaponType(weaponTypeId) {
    switch (weaponTypeId) {
      case 1: return 16;
      default: return 16;
    }
  };

  /**
   * Gets the icon for the armor type.
   * @param {number} armorTypeId The id of the armor type.
   * @returns {number} The corresponding icon index.
   */
  static armorType(armorTypeId) {
    switch (armorTypeId) {
      case 1: return 16;
      default: return 16;
    }
  };

  /**
   * Gets the icon for the equip type.
   * @param {number} equipTypeId The id of the equip type.
   * @returns {number} The corresponding icon index.
   */
  static equipType(equipTypeId) {
    switch (equipTypeId) {
      case 1: return 16;
      default: return 16;
    }
  };

  /**
   * Gets the icon for the special flag of a trait.
   * @param {number} flagId The id of the special flag.
   * @returns {number} The corresponding icon index.
   */
  static specialFlag(flagId) {
    switch (flagId) {
      case 1: return 16;
      default: return 16;
    }
  };

  /**
   * Gets the icon for the party ability of a trait.
   * @param {number} partyAbilityId The id of the party ability.
   * @returns {number} The corresponding icon index.
   */
  static partyAbility(partyAbilityId) {
    switch (partyAbilityId) {
      case 1: return 16;
      default: return 16;
    }
  };

  /**
   * Gets the icon for a trait.
   * @param {JAFTING_Trait} trait The target trait.
   * @returns {number} The corresponding icon index.
   */
  static trait(trait) {
    switch (trait._code) {
      case 11: // elemental damage rate - stackable.
        return this.element(trait._dataId);
      case 12: // debuff rate - stackable.
        return this.param(trait._dataId);
      case 13: // state rate - stackable.
      case 14: // state immunity - don't add the same twice.
        return $dataStates[trait._dataId].iconIndex;
      case 21: // base parameter rate - stackable.
        return this.param(trait._dataId);
      case 22: // ex-parameter rate - stackable.
        return this.xparam(trait._dataId);
      case 23: // sp-parameter rate - stackable.
        return this.sparam(trait._dataId);
      case 31: // attack element - uniquely stackable.
        return this.element(trait._dataId);
      case 32: // apply state chance - stackable.
        return $dataStates[trait._dataId].iconIndex;
      case 33: // skill speed - stackable.
        return 79;
      case 34: // repeat times - stackable.
        return 399;
      case 35: // change basic attack skill - overwrite.
        return $dataSkills[trait._value].iconIndex;
      case 41: // unlock skill type - one or the other or none.
        return this.skillType(trait._dataId);
      case 42: // lock skill type - one or the other or none.
        return this.skillType(trait._dataId);
      case 43: // learn skill while equipped - one or the other or none.
        return $dataSkills[trait._value].iconIndex;
      case 44: // unlearn skill while equipped - one or the other or none.
        return $dataSkills[trait._value].iconIndex;
      case 51: // can use new weapon type - don't add the same twice.
        return this.weaponType(trait._dataId);
      case 52: // can use new armor type - don't add the same twice.
        return this.armorType(trait._dataId);
      case 53: // (lock)cannot change equipment from slot.
        return this.equipType(trait._dataId);
      case 54: // (seal) slot is not equippable while equipped.
        return this.equipType(trait._dataId);
      case 55: // enable/disable dual-wielding - overwrite.
        return 462;
      case 61: // action times percent boost - stackable.
        return 76;
      case 63: // the collase, also known as the divider between transferable traits.
        return 25;
      case 62: // special flag - don't add the same twice.
        return this.specialFlag(trait._dataId);
      case 64: // party ability - don't add the same twice.
        return this.partyAbility(trait._dataId);
  
      default:
        console.error(`all traits are accounted for- is this a custom trait code: [${jaftingTrait._code}]?`);
        return false;
    }
  };

  /**
   * A tag for correlating a JABS parameter to an icon.
   */
  static JABS_PARAMETER = {
    BONUS_HITS: "bonus-hits",
    ATTACK_SKILL: "attack-skill",
    SPEED_BOOST: "speed-boost",
  };

  /**
   * Gets the JABS-related icon based on parameter type.
   * @param {string} type The type of JABS parameter.
   * @returns {number} The corresponding icon index.
   */
  static jabsParameterIcon(type) {
    switch (type) {
      case this.JABS_PARAMETER.BONUS_HITS: return 399;
      case this.JABS_PARAMETER.SPEED_BOOST: return 82;
      case this.JABS_PARAMETER.ATTACK_SKILL: return 76;
    }
  };

  /**
   * A tag for correlating a JAFTING parameter to an icon.
   */
  static JAFTING_PARAMETER = {
    MAX_REFINE: "max-refine-count",
    MAX_TRAITS: "max-trait-count",
    NOT_BASE: "not-refinement-base",
    NOT_MATERIAL: "not-refinement-material",
    TIMES_REFINED: "refined-count",
    UNREFINABLE: "unrefinable"
  };

  /**
   * Gets the JAFTING-related icon based on parameter type.
   * @param {string} type The type of JAFTING parameter.
   * @returns {number} The corresponding icon index.
   */
  static jaftingParameterIcon(type) {
    switch (type) {
      case this.JAFTING_PARAMETER.MAX_REFINE: return 86;
      case this.JAFTING_PARAMETER.MAX_TRAITS: return 86;
      case this.JAFTING_PARAMETER.NOT_BASE: return 90;
      case this.JAFTING_PARAMETER.NOT_MATERIAL: return 90;
      case this.JAFTING_PARAMETER.TIMES_REFINED: return 223;
      case this.JAFTING_PARAMETER.UNREFINABLE: return 90;
    }
  };  
};
//#endregion IconManager
//ENDFILE