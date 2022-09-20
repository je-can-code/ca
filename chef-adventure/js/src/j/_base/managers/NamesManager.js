/**
 * A static class that handles retrieval of names of various types in the database.
 */
class NamesManager
{
  /**
   * The constructor is not designed to be called.
   * This is a static class.
   */
  constructor()
  {
    throw new Error("The TypesManager is a static class.");
  }

  /**
   * Gets the armor type name from the database.
   * @param {number} id The 1-based index of the armor type to get the name of.
   * @returns {string} The name of the armor type.
   */
  static armorTypeName(id)
  {
    // return the armor type name.
    return this.#getTypeNameByIdAndType(id, $dataSystem.armorTypes);
  }

  /**
   * Gets the weapon type name from the database.
   * @param {number} id The 1-based index of the weapon type to get the name of.
   * @returns {string} The name of the weapon type.
   */
  static weaponTypeName(id)
  {
    // return the weapon type name.
    return this.#getTypeNameByIdAndType(id, $dataSystem.weaponTypes);
  }

  /**
   * Gets the skill type name from the database.
   * @param {number} id The 1-based index of the skill type to get the name of.
   * @returns {string} The name of the skill type.
   */
  static skillTypeName(id)
  {
    // return the skill type name.
    return this.#getTypeNameByIdAndType(id, $dataSystem.skillTypes);
  }

  /**
   * Gets the equip type name from the database.
   * @param {number} id The 1-based index of the equip type to get the name of.
   * @returns {string} The name of the equip type.
   */
  static equipTypeName(id)
  {
    // return the equip type name.
    return this.#getTypeNameByIdAndType(id, $dataSystem.equipTypes);
  }

  /**
   * Gets the equip type name from the database.
   * @param {number} id The 1-based index of the equip type to get the name of.
   * @returns {string} The name of the equip type.
   */
  static elementName(id)
  {
    // return the element name.
    return this.#getTypeNameByIdAndType(id, $dataSystem.elements);
  }

  /**
   * Gets a type name by its type collect and index.
   * @param {number} id The 1-based index to get the type name of.
   * @param {string[]} type The collection of names for a given type.
   * @returns {string|String.empty} The requested type name, or an empty string if invalid.
   */
  static #getTypeNameByIdAndType(id, type)
  {
    // if the type is invalid, return an empty string and check the logs.
    if (!this.#isValidTypeId(id, type)) return String.empty;

    // return what we found.
    return type.at(id);
  }


  /**
   * Determines whether or not the id is a valid index for types.
   * @param {number} id The 1-based index of the type to get the name of.
   * @param {string[]} types The array of types to extract the name from.
   * @returns {boolean} True if we can get the name, false otherwise.
   */
  static #isValidTypeId(id, types)
  {
    // check if the id was zero, then it was probably a mistake for 1.
    if (id === 0)
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
}