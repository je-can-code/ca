//region IconManager
/**
 * A static class that manages the icon to X correlation, such as stats and elements.
 */
class IconManager
{
  /**
   * The constructor is not designed to be called.
   * This is a static class.
   */
  constructor()
  {
    throw new Error("The IconManager is a static class.");
  }

  /**
   * Gets the iconIndex for levels.
   * @returns {number}
   */
  static level()
  {
    return 86;
  }

  /**
   * Gets the `iconIndex` for SDP Multiplier.
   * @returns {number}
   */
  static sdpMultiplier()
  {
    return 2229;
  }

  /**
   * Gets the `iconIndex` for proficiency boost.
   * @returns {number}
   */
  static proficiencyBoost()
  {
    return 979;
  }

  /**
   * Gets the `iconIndex` for move speed boost.
   * @returns {number}
   */
  static movespeed()
  {
    return 978;
  }

  /**
   * Gets the `iconIndex` for max tp.
   * @returns {number} The `iconIndex`.
   */
  static maxTp()
  {
    return 930;
  }

  /**
   * Gets the iconIndex for a given reward parameter.
   * @param {number} paramId The param id to get the icon index for.
   * @returns {number}
   */
  static rewardParam(paramId)
  {
    switch (paramId)
    {
      case  0:
        return 87; // exp
      case  1:
        return 2048; // gold
      case  2:
        return 208; // drops
      case  3:
        return 914; // encounters
      case  4:
        return 445; // sdp
    }
  }

  /**
   * Gets the corresponding `iconIndex` for the param.
   * @param {number} paramId The id of the param.
   * @returns {number} The `iconIndex`.
   */
  static param(paramId)
  {
    switch (paramId)
    {
      case  0:
        return 928; // mhp
      case  1:
        return 929; // mmp
      case  2:
        return 931; // atk
      case  3:
        return 932; // def
      case  4:
        return 933; // mat
      case  5:
        return 934; // mdf
      case  6:
        return 935; // agi
      case  7:
        return 936; // luk
    }
  }

  /**
   * Gets the corresponding `iconIndex` for the x-param.
   * @param {number} paramId The id of the param.
   * @returns {number} The `iconIndex`.
   */
  static xparam(paramId)
  {
    switch (paramId)
    {
      case  0:
        return 944; // hit
      case  1:
        return 945; // eva (parry boost)
      case  2:
        return 946; // cri
      case  3:
        return 947; // cev
      case  4:
        return 948; // mev
      case  5:
        return 949; // mrf
      case  6:
        return 950; // cnt (autocounter)
      case  7:
        return 951; // hrg
      case  8:
        return 952; // mrg
      case  9:
        return 953; // trg
    }
  }

  /**
   * Gets the corresponding `iconIndex` for the s-param.
   * @param {number} paramId The id of the param.
   * @returns {number} The `iconIndex`.
   */
  static sparam(paramId)
  {
    switch (paramId)
    {
      case  0:
        return 960; // trg (aggro)
      case  1:
        return 961; // grd (parry)
      case  2:
        return 962; // rec
      case  3:
        return 963; // pha
      case  4:
        return 964; // mcr (mp cost)
      case  5:
        return 965; // tcr (tp cost)
      case  6:
        return 966; // pdr
      case  7:
        return 967; // mdr
      case  8:
        return 968; // fdr
      case  9:
        return 969; // exr
    }
  }

  /**
   * Gets the `iconIndex` based on the "long" parameter id.
   *
   * "Long" parameter ids are used in the context of 0-27, rather than
   * 0-7 for param, 0-9 for xparam, and 0-9 for sparam.
   * @param {number} paramId The "long" parameter id.
   * @returns {number} The `iconIndex`.
   */
  // eslint-disable-next-line complexity
  static longParam(paramId)
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
        return this.xparam(paramId - 8); // eva (jabs: parry boost)
      case 10:
        return this.xparam(paramId - 8); // cri
      case 11:
        return this.xparam(paramId - 8); // cev
      case 12:
        return this.xparam(paramId - 8); // mev (jabs: unused)
      case 13:
        return this.xparam(paramId - 8); // mrf
      case 14:
        return this.xparam(paramId - 8); // cnt (jabs: autocounter)
      case 15:
        return this.xparam(paramId - 8); // hrg
      case 16:
        return this.xparam(paramId - 8); // mrg
      case 17:
        return this.xparam(paramId - 8); // trg
      case 18:
        return this.sparam(paramId - 18); // trg (jabs: aggro)
      case 19:
        return this.sparam(paramId - 18); // grd (jabs: parry)
      case 20:
        return this.sparam(paramId - 18); // rec
      case 21:
        return this.sparam(paramId - 18); // pha
      case 22:
        return this.sparam(paramId - 18); // mcr
      case 23:
        return this.sparam(paramId - 18); // tcr
      case 24:
        return this.sparam(paramId - 18); // pdr
      case 25:
        return this.sparam(paramId - 18); // mdr
      case 26:
        return this.sparam(paramId - 18); // fdr
      case 27:
        return this.sparam(paramId - 18); // exr
      case 30:
        return this.maxTp(); // mtp
      case 31:
        return this.movespeed(); // move
      case 32:
        return this.proficiencyBoost(); // prof
      case 33:
        return this.sdpMultiplier(); // sdp
      default:
        console.warn(`paramId:${paramId} didn't map to any of the default parameters.`);
        return 0;
    }
  }

  /**
   * Gets the corresponding `iconIndex` for the element based on their id.
   * @param {number} elementId The id of the element.
   * @returns {number}
   */
  // eslint-disable-next-line complexity
  static element(elementId)
  {
    switch (elementId)
    {
      case -1:
        return 76;  // inherits element from parent.
      case  0:
        return 70;  // true
      case  1:
        return 912; // cut
      case  2:
        return 913; // poke
      case  3:
        return 914; // blunt
      case  4:
        return 915; // heat
      case  5:
        return 916; // liquid
      case  6:
        return 917; // air
      case  7:
        return 918; // ground
      case  8:
        return 919; // energy
      case  9:
        return 920; // void
      case 10:
        return 127; // typeless
      case 11:
        return 302; // vs undead
      case 12:
        return 321; // vs reptile
      case 13:
        return 345; // vs aquatic
      case 14:
        return 342; // vs slime
      case 15:
        return 184; // vs plants
      case 16:
        return 2112;// vs beast
      case 17:
        return 348; // vs insect
      case 18:
        return 82;  // vs humanoid
      case 19:
        return 83;  // vs construct
      case 20:
        return 2192;// vs deity
      case 21:
        return 403; // x weaponry
      case 22:
        return 364; // x flying
      case 23:
        return 453; // x shields
      case 24:
        return 72;  // x aura
      case 25:
        return 200; // tool shatter
      case 26:
        return 218; // tool crush
      case 27:
        return 1904;// tool ignite
      case 28:
        return 119; // tool overload
      default:
        return 93;  // a question mark for the unknown.
    }
  }

  /**
   * Gets the icon for the skill type.
   * @param {number} skillTypeId The id of the skill type.
   * @returns {number} The corresponding icon index.
   */
  static skillType(skillTypeId)
  {
    switch (skillTypeId)
    {
      case  1:
        return 82;   // dodging skills
      case  2:
        return 2592; // guarding skills
      case  3:
        return 77;   // techniques (jerald)
      case  4:
        return 79;   // magecraft (rupert)
      case  5:
        return 188;  // panelogy
      case  6:
        return 227;  // tool skills
      case  7:
        return 76;   // weapon skills
      case  8:
        return 68;   // geology (earthie)
      case  9:
        return 69;   // nephology (skye)
      case 10:
        return 64;   // magmology (cynder)
      case 11:
        return 67;   // hydrology (aqualocke)
      case 12:
        return 2192; // superlatives
      default:
        return 0;
    }
  }

  /**
   * Gets the icon for the weapon type.
   * @param {number} weaponTypeId The id of the weapon type.
   * @returns {number} The corresponding icon index.
   */
  static weaponType(weaponTypeId)
  {
    switch (weaponTypeId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  }

  /**
   * Gets the icon for the armor type.
   * @param {number} armorTypeId The id of the armor type.
   * @returns {number} The corresponding icon index.
   */
  static armorType(armorTypeId)
  {
    switch (armorTypeId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  }

  /**
   * Gets the icon for the equip type.
   * @param {number} equipTypeId The id of the equip type.
   * @returns {number} The corresponding icon index.
   */
  static equipType(equipTypeId)
  {
    switch (equipTypeId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  }

  /**
   * Gets the icon for the special flag of a trait.
   * @param {number} flagId The id of the special flag.
   * @returns {number} The corresponding icon index.
   */
  static specialFlag(flagId)
  {
    switch (flagId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  }

  /**
   * Gets the icon for the party ability of a trait.
   * @param {number} partyAbilityId The id of the party ability.
   * @returns {number} The corresponding icon index.
   */
  static partyAbility(partyAbilityId)
  {
    switch (partyAbilityId)
    {
      case 1:
        return 16;
      default:
        return 16;
    }
  }

  /**
   * Gets the icon for a trait.
   * @param {JAFTING_Trait} trait The target trait.
   * @returns {number} The corresponding icon index.
   */
  // eslint-disable-next-line complexity
  static trait(trait)
  {
    switch (trait._code)
    {
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
        return $dataSkills[trait._dataId].iconIndex;
      case 41: // unlock skill type - one or the other or none.
        return this.skillType(trait._dataId);
      case 42: // lock skill type - one or the other or none.
        return this.skillType(trait._dataId);
      case 43: // learn skill while equipped - one or the other or none.
        return $dataSkills[trait._dataId].iconIndex;
      case 44: // unlearn skill while equipped - one or the other or none.
        return $dataSkills[trait._dataId].iconIndex;
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
      case 63: // the collapse, also known as the divider between transferable traits.
        return 25;
      case 62: // special flag - don't add the same twice.
        return this.specialFlag(trait._dataId);
      case 64: // party ability - don't add the same twice.
        return this.partyAbility(trait._dataId);

      default:
        console.error(`all traits are accounted for- is this a custom trait code: [${jaftingTrait._code}]?`);
        return false;
    }
  }

  /**
   * A tag for correlating a JABS parameter to an icon.
   */
  static JABS_PARAMETER =
    {
      BONUS_HITS: "bonus-hits",
      ATTACK_SKILL: "attack-skill",
      SPEED_BOOST: "speed-boost",
    };

  /**
   * Gets the JABS-related icon based on parameter type.
   * @param {string} type The type of JABS parameter.
   * @returns {number} The corresponding icon index.
   */
  static jabsParameterIcon(type)
  {
    switch (type)
    {
      case this.JABS_PARAMETER.BONUS_HITS:
        return 399;
      case this.JABS_PARAMETER.SPEED_BOOST:
        return 82;
      case this.JABS_PARAMETER.ATTACK_SKILL:
        return 76;
    }
  }

  /**
   * A tag for correlating a JAFTING parameter to an icon.
   */
  static JAFTING_PARAMETER =
    {
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
  static jaftingParameterIcon(type)
  {
    switch (type)
    {
      case this.JAFTING_PARAMETER.MAX_REFINE:
        return 86;
      case this.JAFTING_PARAMETER.MAX_TRAITS:
        return 86;
      case this.JAFTING_PARAMETER.NOT_BASE:
        return 90;
      case this.JAFTING_PARAMETER.NOT_MATERIAL:
        return 90;
      case this.JAFTING_PARAMETER.TIMES_REFINED:
        return 223;
      case this.JAFTING_PARAMETER.UNREFINABLE:
        return 90;
    }
  }

  /**
   * Gets the icon representing the team id provided.
   * @param {number} teamId The team id.
   * @returns {number} The corresponding icon index.
   */
  static team(teamId)
  {
    switch (teamId)
    {
      case 0: // ally
        return 38;
      case 1: // enemy
        return 21;
      case 2: // neutral
        return 91;
    }
  }
}
//endregion IconManager