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
TextManager.sparam = function (sParamId) {
  switch (sParamId) {
    case 0: return "Aggro";// J.Param.TGR_text;
    case 1: return "Parry";//J.Param.GRD_text;
    case 2: return "Healing"; //J.Param.REC_text;
    case 3: return "Pharmacy"; //J.Param.PHA_text;
    case 4: return "Magi Reduce"; //J.Param.MCR_text;
    case 5: return "Tech Reduce"; //J.Param.TCR_text;
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
TextManager.xparam = function (xParamId) {
  switch (xParamId) {
    case 0: return "Hit Rate";// J.Param.HIT_text;
    case 1: return "Evasion Rate";//J.Param.EVA_text;
    case 2: return "Crit Rate"; //J.Param.CRI_text;
    case 3: return "Crit Evade"; //J.Param.CEV_text;
    case 4: return "Magic Evade"; //J.Param.MEV_text;
    case 5: return "Magic Reflect"; //J.Param.MRF_text;
    case 6: return "Counter Rate"; //J.Param.CNT_text;
    case 7: return "Life Regen"; //J.Param.HRG_text;
    case 8: return "Magi Regen"; //J.Param.MRG_text;
    case 9: return "Tech Regen"; //J.Param.TRG_text;
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
    * @returns {number}
    */
  static param(paramId) {
    switch (paramId) {
      case  0: return 247; // mhp
      case  1: return 248; // mmp
      case  2: return 2755; // atk
      case  3: return 251; // def
      case  4: return 252; // mat
      case  5: return 253; // mdf
      case  6: return 254; // agi
      case  7: return 255; // luk
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the x-param.
   * @param {number} paramId The id of the param.
   * @returns {number}
   */
  static xparam(paramId) {
    switch (paramId) {
      case  0: return 102; // hit
      case  1: return  82; // eva
      case  2: return 127; // cri
      case  3: return  81; // cev
      case  4: return  71; // mev
      case  5: return 222; // mrf
      case  6: return  15; // cnt
      case  7: return 2153; // hrg
      case  8: return 2245; // mrg
      case  9: return   13; // trg
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the s-param.
   * @param {number} paramId The id of the param.
   * @returns {number}
   */
  static sparam(paramId) {
    switch (paramId) {
      case  0: return  14; // trg (aggro)
      case  1: return 128; // grd (parry)
      case  2: return  84; // rec
      case  3: return 209; // pha
      case  4: return 189; // mcr (mp reduce)
      case  5: return 126; // tcr (tp reduce)
      case  6: return 129; // pdr
      case  7: return 147; // mdr
      case  8: return 141; // fdr
      case  9: return 156; // exr
    }
  };

  /**
   * Gets the corresponding `iconIndex` for the element.
   * @param {number} paramId The id of the element.
   * @returns {number}
   */
  static elementIcon(elementId) {
    switch(elementId) {
      case 0: return 127;
      case 1: return 912;
      case 2: return 913;
      case 3: return 914;
      case 4: return 915;
      case 5: return 916;
      case 6: return 917;
      case 7: return 918;
      case 8: return 919;
      case 9: return 920;
    }
  };
  
};
//#endregion IconManager
//ENDFILE