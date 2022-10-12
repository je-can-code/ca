//#region ColorManager
/**
 * Gets the color index from the "long" parameter id.
 *
 * "Long" parameter ids are used in the context of 0-27, rather than
 * 0-7 for param, 0-9 for xparam, and 0-9 for sparam.
 * @param {number} paramId The "long" parameter id.
 * @returns {number} The color index of the given parameter.
 */
ColorManager.longParam = function(paramId)
{
  switch (paramId)
  {
    // currently there are no special colors for parameters, but just in case...
    default:
      return 0;
  }
};

/**
 *
 * @param {number} elementId The element id to get a color for.
 * @returns {rm.types.Color}
 */
// eslint-disable-next-line
ColorManager.element = function(elementId)
{
  switch (elementId)
  {
    case -1:    // inherits element from parent.
      return this.textColor(0);
    case 0:     // true
      return this.textColor(17);
    case 1:     // cut
      return this.textColor(7);
    case 2:     // poke
      return this.textColor(8);
    case 3:     // blunt
      return this.textColor(25);
    case 4:     // heat
      return this.textColor(18);
    case 5:     // liquid
      return this.textColor(23);
    case 6:     // air
      return this.textColor(8);
    case 7:     // ground
      return this.textColor(25);
    case 8:     // energy
      return this.textColor(6);
    case 9:     // void
      return this.textColor(26);
    case 10:    // typeless
      return this.textColor(0);
    case 11:    // vs undead
      return this.textColor(2);
    case 12:    // vs reptile
      return this.textColor(2);
    case 13:    // vs aquatic
      return this.textColor(2);
    case 14:    // vs slime
      return this.textColor(2);
    case 15:    // vs plants
      return this.textColor(2);
    case 16:    // vs beast
      return this.textColor(2);
    case 17:    // vs insect
      return this.textColor(2);
    case 18:    // vs humanoid
      return this.textColor(2);
    case 19:    // vs construct
      return this.textColor(2);
    case 20:    // vs deity
      return this.textColor(2);
    case 21:    // x weaponry
      return this.textColor(27);
    case 22:    // x flying
      return this.textColor(27);
    case 23:    // x shields
      return this.textColor(27);
    case 24:    // x aura
      return this.textColor(27);
    case 25:    // tool shatter
      return this.textColor(20);
    case 26:    // tool crush
      return this.textColor(20);
    case 27:    // tool ignite
      return this.textColor(20);
    case 28:    // tool overload
      return this.textColor(20);
    default:
      return this.textColor(0);
  }
};

/**
 * Gets the color index of the given skill type.
 * @param {number} skillTypeId The id to get the color for.
 * @returns {rm.types.Color}
 */
ColorManager.skillType = function(skillTypeId)
{
  return this.textColor(1);
};

/**
 * Gets the color index of the given weapon type.
 * @param {number} weaponTypeId The id to get the color for.
 * @returns {rm.types.Color}
 */
ColorManager.weaponType = function(weaponTypeId)
{
  return this.textColor(2);
};

/**
 * Gets the color index of the given armor type.
 * @param {number} armorTypeId The id to get the color for.
 * @returns {rm.types.Color}
 */
ColorManager.armorType = function(armorTypeId)
{
  return this.textColor(3);
};

/**
 * Gets the color index of the given equip type.
 * @param {number} equipTypeId The id to get the color for.
 * @returns {rm.types.Color}
 */
ColorManager.equipType = function(equipTypeId)
{
  return this.textColor(4);
};
//#endregion ColorManager