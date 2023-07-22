//region TextManager
/**
 * Gets the proper name for the points used by the SDP system.
 * @returns {string}
 */
TextManager.sdpPoints = function()
{
  return "SDPs";
};

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
 * Gets the name of the reward parameter.
 * @param {number} paramId The paramId to get the reward text for.
 * @returns {string}
 */
TextManager.rewardParam = function(paramId)
{
  switch (paramId)
  {
    case  0:
      return this.exp; // exp
    case  1:
      return this.currencyUnit; // gold
    case  2:
      return "Drop Rate"; // drops
    case  3:
      return "Encounter Rate"; // encounters
    case  4:
      return "SDP Point Rate"; // sdp
  }
};

/**
 * The double-line descriptions for various rewards.
 * @param {number} paramId The id of the reward parameter.
 * @returns {string[]}
 */
TextManager.rewardDescription = function(paramId)
{
  switch (paramId)
  {
    case 0:
      return [
        "The resource required to accumulate to rise in level.",
        "Levels give unseen advantages."
      ];
    case 1:
      return [
        "The primary currency of the universe.",
        "Most vendors happily take this in exchange for goods."
      ];
    case 2:
      return [
        "The rate at which enemies will drop loot.",
        "Higher rates yield more frequent drops."
      ];
    case 3:
      return [
        "The frequency of which the party will be engage in battles.",
        "Lower rates result in less random encounters."
      ];
    case 4:
      return [
        "The rate of SDP accumulation from any source.",
        "Bigger rates yield fatter stacks of them sweet SDP points."
      ];
  }
};

/**
 * The double-line descriptions for the b-parameters.
 * @param {number} paramId The id of the parameter.
 * @returns {string[]}
 */
TextManager.bparamDescription = function(paramId)
{
  switch (paramId)
  {
    case 0:
      return [
        "The base resource that defines life and death.",
        "Enemies and allies alike obey the rule of '0hp = dead'."
      ];
    case 1:
      return [
        "The base resource that most magic-based spells consume.",
        "Without this, spells typically cannot be cast."
      ];
    case 2:
      return [
        "The base stat that influences physical damage.",
        "Higher amounts of this yield higher physical damage output."
      ];
    case 3:
      return [
        "The base stat that reduces physical damage.",
        "Higher amounts of this will reduce incoming physical damage."
      ];
    case 4:
      return [
        "The base stat that influences magical damage.",
        "Higher amounts of this yield higher magical damage output."
      ];
    case 5:
      return [
        "The base stat that reduces magical damage.",
        "Higher amounts of this will reduce incoming magical damage."
      ];
    case 6:
      return [
        "The base stat that governs movement and agility.",
        "The effects of this are unknown at higher levels."
      ];
    case 7:
      return [
        "The base stat that governs fortune and luck.",
        "The effects of this are wide and varied."
      ];
  }
};

/**
 * The double-line descriptions for the x-parameters.
 * @param {number} paramId The id of the parameter.
 * @returns {string[]}
 */
TextManager.xparamDescription = function(paramId)
{
  switch (paramId)
  {
    // HIT (HIT chance)
    case 0:
      return [
        "The stat representing one's skill of accuracy.",
        "Being more accurate will result in being parried less."
      ];

    // EVA (physical hit EVasion)
    case 1:
      return [
        // "The stat representing skill in physically evading attacks.",  // original function.
        // "Having higher evasion is often seen as a form of tanking.",   // original function.
        "The stat governing one's uncanny ability to parry precisely.",
        "An optional stat, but having more will make parrying easier."
      ];

    // CRI (CRItical hit chance)
    case 2:
      return [
        "A numeric value to one's chance of landing a critical hit.",
        "This is directly reduced by a target's critical evasion."
      ];

    // CEV (Critical hit Evasion)
    case 3:
      return [
        "A numeric value to one's chance of evading a critical hit.",
        "Enemy critical hit chance is directly reduced by this amount."
      ];

    // MEV (Magic attack EVasion)
    case 4:
      return [
        "A numeric value to one's chance of evading a magical hit.",
        "Enemy magical hit chance is directly reduced by this amount."
      ];

    // MRF (Magic attack ReFlection)
    case 5:
      return [
        // "The chance of reflecting a magical hit back to its caster.",  // original function
        "The chance of reflecting a skill back to its caster.",
        "Aside from it being reflected back, it is as if you casted it."
      ];

    // CNT (CouNTer chance)
    case 6:
      return [
        // "The chance of responding with a basic attack when hit.",  // original function
        "The chance of auto-executing counter skills when struck.",
        "Being un-reducable, 100 makes countering inevitable."
      ];

    // HRG (Hp ReGeneration)
    case 7:
      return [
        "The amount of Life restored over 5 seconds.",
        "Recovery Rate amplifies this effect."
      ];

    // MRG (Mp ReGeneration)
    case 8:
      return [
        "The amount of Magi rejuvenated over 5 seconds.",
        "Recovery Rate amplifies this effect."
      ];

    // TRG (Tp ReGeneration)
    case 9:
      return [
        "The amount of Tech recovered over 5 seconds.",
        "Recovery Rate amplifies this effect."
      ];
  }
};

/**
 * The double-line descriptions for the s-parameters.
 * @param {number} paramId The id of the parameter.
 * @returns {string[]}
 */
TextManager.sparamDescription = function(paramId)
{
  switch (paramId)
  {
    // TGR (TarGeting Rate)
    case 0:
      return [
        "The percentage of aggro that will be applied.",
        "Reduce for stealthing; increase for taunting."
      ];

    // GRD (GuaRD rate)
    case 1:
      return [
        // "Improves the damage reduction when guarding.",  // original function.
        // "This stat speaks for itself.",                  // original function.
        "A numeric value representing the frequency of parrying.",
        "More of this will result in auto-parrying faced foes."
      ];

    // REC (RECovery boost rate)
    case 2:
      return [
        "The percentage effectiveness of healing applied to oneself.",
        "Higher amounts of this will make healing need less effort."
      ];

    // PHA (PHArmacology rate)
    case 3:
      return [
        "The percentage effectiveness of items applied to oneself.",
        "Higher amounts of this will make items more potent."
      ];

    // MCR (Magic Cost Rate)
    case 4:
      return [
        "The percentage bonuses being applied to Magi costs.",
        "Enemy magical hit chance is directly reduced by this amount."
      ];

    // TCR (Tech ChaRge rate)
    case 5:
      return [
        "The percentage bonuses being applied to Tech generation.",
        "Taking and dealing damage in combat will earn more Tech."
      ];

    // PDR (Physical Damage Rate)
    case 6:
      return [
        "The percentage bonuses being applied to physical damage.",
        "-100 is immune while 100+ takes double+ physical damage."
      ];

    // MDR (Magic Damage Rate)
    case 7:
      return [
        "The percentage bonuses being applied to magical damage.",
        "-100 is immune while 100+ takes double+ magical damage."
      ];

    // FDR (Floor Damage Rate)
    case 8:
      return [
        "The percentage bonuses being applied to floor damage.",
        "-100 is immune while 100+ takes double+ floor damage."
      ];

    // EXR (EXperience Rate)
    case 9:
      return [
        "The percentage bonuses being applied to experience gain.",
        "Higher amounts of this result in faster level growth."
      ];
  }
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
      return "Accuracy"; //J.Param.HIT_text;
    case 1:
      return "Parry Extend"; //J.Param.EVA_text;
    case 2:
      return "Crit Rate"; //J.Param.CRI_text;
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
      return this.maxTp(); // max tp
    case 31:
      return this.movespeed(); // move speed boost
    case 32:
      return this.proficiencyBonus(); // proficiency boost
    case 33:
      return this.sdpMultiplier(); // sdp multiplier
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
//endregion TextManager