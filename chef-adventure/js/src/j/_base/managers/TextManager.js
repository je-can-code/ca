//#region TextManager
/**
 * Gets the proper name of "SDP Multiplier".
 * @returns {string}
 */
TextManager.sdpMultiplier = function()
{
  return "SDP Multiplier";
};

/**
 * Gets the proper name of "proficiency bonus", which is quite long, really.
 * @returns {string}
 */
TextManager.proficiencyBonus = function()
{
  return "Proficiency+";
};

/**
 * Gets the proper name of "move speed boost".
 * @returns {string}
 */
TextManager.movespeed = function()
{
  return "Move Boost";
};

/**
 * Gets the proper name of "max tp".
 * @returns {string} The name of the parameter.
 */
TextManager.maxTp = function()
{
  return "Max Tech";
};

/**
 * Gets the name of the given sp-parameter.
 * @param {number} sParamId The id of the sp-param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.sparam = function(sParamId)
{
  switch (sParamId)
  {
    case 0:
      return "Aggro";// J.Param.TGR_text;
    case 1:
      return "Parry";//J.Param.GRD_text;
    case 2:
      return "Healing Rate"; //J.Param.REC_text;
    case 3:
      return "Item Effects"; //J.Param.PHA_text;
    case 4:
      return "Magi Cost"; //J.Param.MCR_text;
    case 5:
      return "Tech Cost"; //J.Param.TCR_text;
    case 6:
      return "Phys Dmg Rate"; //J.Param.PDR_text;
    case 7:
      return "Magi Dmg Rate"; //J.Param.MDR_text;
    case 8:
      return "Light-footed"; //J.Param.FDR_text;
    case 9:
      return "Experience UP"; //J.Param.EXR_text;
  }
};

/**
 * Gets the name of the given ex-parameter.
 * @param {number} xParamId The id of the ex-param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.xparam = function(xParamId)
{
  switch (xParamId)
  {
    case 0:
      return "Accuracy";// J.Param.HIT_text;
    case 1:
      return "Parry Extend";//J.Param.EVA_text;
    case 2:
      return "Crit Strike"; //J.Param.CRI_text;
    case 3:
      return "Crit Dodge"; //J.Param.CEV_text;
    case 4:
      return "Magic Evade"; //J.Param.MEV_text;
    case 5:
      return "Magic Reflect"; //J.Param.MRF_text;
    case 6:
      return "Autocounter"; //J.Param.CNT_text;
    case 7:
      return "HP Regen"; //J.Param.HRG_text;
    case 8:
      return "MP Regen"; //J.Param.MRG_text;
    case 9:
      return "TP Regen"; //J.Param.TRG_text;
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
// eslint-disable-next-line complexity
TextManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case  0:
      return this.param(paramId); // mhp
    case  1:
      return this.param(paramId); // mmp
    case  2:
      return this.param(paramId); // atk
    case  3:
      return this.param(paramId); // def
    case  4:
      return this.param(paramId); // mat
    case  5:
      return this.param(paramId); // mdf
    case  6:
      return this.param(paramId); // agi
    case  7:
      return this.param(paramId); // luk
    case  8:
      return this.xparam(paramId - 8); // hit
    case  9:
      return this.xparam(paramId - 8); // eva (parry boost)
    case 10:
      return this.xparam(paramId - 8); // cri
    case 11:
      return this.xparam(paramId - 8); // cev
    case 12:
      return this.xparam(paramId - 8); // mev (unused)
    case 13:
      return this.xparam(paramId - 8); // mrf
    case 14:
      return this.xparam(paramId - 8); // cnt (autocounter)
    case 15:
      return this.xparam(paramId - 8); // hrg
    case 16:
      return this.xparam(paramId - 8); // mrg
    case 17:
      return this.xparam(paramId - 8); // trg
    case 18:
      return this.sparam(paramId - 18); // trg (aggro)
    case 19:
      return this.sparam(paramId - 18); // grd (parry)
    case 20:
      return this.sparam(paramId - 18); // rec
    case 21:
      return this.sparam(paramId - 18); // pha
    case 22:
      return this.sparam(paramId - 18); // mcr (mp cost)
    case 23:
      return this.sparam(paramId - 18); // tcr (tp cost)
    case 24:
      return this.sparam(paramId - 18); // pdr
    case 25:
      return this.sparam(paramId - 18); // mdr
    case 26:
      return this.sparam(paramId - 18); // fdr
    case 27:
      return this.sparam(paramId - 18); // exr
    case 30:
      return this.maxTp();              // max tp
    case 31:
      return this.movespeed();          // move speed boost
    case 32:
      return this.proficiencyBonus();   // proficiency boost
    case 33:
      return this.sdpMultiplier();      // sdp multiplier
    default:
      console.warn(`paramId:${paramId} didn't map to any of the default parameters.`);
      return String.empty;
  }
};

/**
 * Gets the armor type name from the database.
 * @param {number} id The 1-based index of the armor type to get the name of.
 * @returns {string} The name of the armor type.
 */
TextManager.armorType = function(id)
{
  // return the armor type name.
  return this.getTypeNameByIdAndType(id, $dataSystem.armorTypes);
};

/**
 * Gets the weapon type name from the database.
 * @param {number} id The 1-based index of the weapon type to get the name of.
 * @returns {string} The name of the weapon type.
 */
TextManager.weaponType = function(id)
{
  // return the weapon type name.
  return this.getTypeNameByIdAndType(id, $dataSystem.weaponTypes);
};

/**
 * Gets the skill type name from the database.
 * @param {number} id The 1-based index of the skill type to get the name of.
 * @returns {string} The name of the skill type.
 */
TextManager.skillType = function(id)
{
  // return the skill type name.
  return this.getTypeNameByIdAndType(id, $dataSystem.skillTypes);
};

/**
 * Gets the equip type name from the database.
 * @param {number} id The 1-based index of the equip type to get the name of.
 * @returns {string} The name of the equip type.
 */
TextManager.equipType = function(id)
{
  // return the equip type name.
  return this.getTypeNameByIdAndType(id, $dataSystem.equipTypes);
};

/**
 * Gets the element name from the database.
 * `-1` and `0` are special cases,
 * the former being for weapon attack elements,
 * the latter being for "none" element.
 * @param {number} id The index of the element to get the name of.
 * @returns {string} The name of the element type.
 */
TextManager.element = function(id)
{
  switch (true)
  {
    case (id === -1):
      return this.weaponElementsName();
    case (id === 0):
      return this.neutralElementName();
    default:
      return this.getTypeNameByIdAndType(id, $dataSystem.elements);
  }
};

/**
 * The name for the element which is governed by all elements currently
 * applied to your weapon.
 * @returns {string}
 */
TextManager.weaponElementsName = function()
{
  return '(Basic Attack)';
};

/**
 * The name for the element which is supposed to be "None" in the database,
 * @returns {string}
 */
TextManager.neutralElementName = function()
{
  return 'Neutral';
};

/**
 * Gets a type name by its type collect and index.
 * @param {number} id The 1-based index to get the type name of.
 * @param {string[]} type The collection of names for a given type.
 * @returns {string|String.empty} The requested type name, or an empty string if invalid.
 */
TextManager.getTypeNameByIdAndType = function(id, type)
{
  // if the type is invalid, return an empty string and check the logs.
  if (!this.isValidTypeId(id, type)) return String.empty;

  // return what we found.
  return type.at(id);
};

/**
 * Determines whether or not the id is a valid index for types.
 * @param {number} id The 1-based index of the type to get the name of.
 * @param {string[]} types The array of types to extract the name from.
 * @returns {boolean} True if we can get the name, false otherwise.
 */
TextManager.isValidTypeId = function(id, types)
{
  // check if the id was zero, then it was probably a mistake for 1.
  if (id === 0 && types !== $dataSystem.elements)
  {
    console.error(`requested type id of [0] is always blank, and thus invalid.`);
    return false;
  }

  // check if the id was higher than the number of types even available.
  if (id >= types.length)
  {
    console.error(`requested type id of [${id}] is higher than the number of types.`);
    return false;
  }

  // get the name!
  return true;
}
//#endregion TextManager