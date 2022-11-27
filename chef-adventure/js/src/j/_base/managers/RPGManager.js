//#region RPGManager
/**
 * A utility class for handling common database-related translations.
 */
class RPGManager
{
  /**
   * Gets the sum of all values from the notes of a collection of database objects.
   * @param {RPG_BaseItem[]} databaseDatas The collection of database objects.
   * @param {RegExp} structure The RegExp structure to find values for.
   * @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
   * @returns {number|null} A number if "nullIfEmpty=false", null otherwise.
   */
  static getSumFromAllNotesByRegex(databaseDatas, structure, nullIfEmpty = false)
  {
    // check to make sure we have a collection to work with.
    if (!databaseDatas.length)
    {
      // short circuit with null if we are using the flag, or 0 otherwise.
      return nullIfEmpty ? null : 0;
    }

    // initialize the value to 0.
    let val = 0;

    // iterate over each database object to get the values.
    databaseDatas.forEach(databaseData =>
    {
      // add the value from all the notes of each database object.
      val += databaseData.getNumberFromNotesByRegex(structure);
    });

    // check if we turned up empty and are using the nullIfEmpty flag.
    if (!val && nullIfEmpty)
    {
      // we are both, so return null.
      return null;
    }

    // return the value, or 0.
    return val;
  }

  /**
   * Gets the eval'd formulai of all values from the notes of a collection of database objects.
   * @param {RPG_BaseItem[]} databaseDatas The collection of database objects.
   * @param {RegExp} structure The RegExp structure to find values for.
   * @param {number} baseParam The base parameter value for use within the formula(s) as the "b"; defaults to 0.
   * @param {RPG_BaseBattler=} context The context of which the formula(s) are using as the "a"; defaults to null.
   * @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
   * @returns {number|null} The calculated result from all formula summed together.
   */
  static getResultsFromAllNotesByRegex(
    databaseDatas,
    structure,
    baseParam = 0,
    context = null,
    nullIfEmpty = false)
  {
    // check to make sure we have a collection to work with.
    if (!databaseDatas.length)
    {
      // short circuit with null if we are using the flag, or 0 otherwise.
      return nullIfEmpty ? null : 0;
    }

    // initialize the value to 0.
    let val = 0;

    // scan all the database datas.
    databaseDatas.forEach(databaseData =>
    {
      // add the eval'd formulas from all the notes of each database object.
      val += databaseData.getResultsFromNotesByRegex(structure, baseParam, context);
    });

    // check if we turned up empty and are using the nullIfEmpty flag.
    if (!val && nullIfEmpty)
    {
      // we are both, so return null.
      return null;
    }

    // return the value, or 0.
    return val;
  }

  /**
   * Collects all {@link JABS_OnChanceEffect}s from the list of database objects.
   * @param {RPG_Base[]} databaseDatas The list of database objects to parse.
   * @param {RegExp} structure The on-chance-effect-templated regex structure to parse for.
   * @returns {JABS_OnChanceEffect[]}
   */
  static getOnChanceEffectsFromDatabaseObjects(databaseDatas, structure)
  {
    // initialize the collection.
    const onChanceEffects = [];

    // scan all the database datas.
    databaseDatas.forEach(databaseData =>
    {
      // build concrete on-chance-effects for each instance on the checkable.
      const onChanceEffectList = J.BASE.Helpers.parseSkillChance(structure, databaseData);

      // add it to the collection.
      onChanceEffects.push(...onChanceEffectList);
    });

    // return what was found.
    return onChanceEffects;
  }

  /**
   * Checks if any of the database datas containing notes matches the regex structure provided.
   * @param {RPG_Base[]} databaseDatas The list of database objects to parse.
   * @param {RegExp} structure The boolean regex structure to parse for.
   * @returns {boolean|null} True if the regex was found, false otherwise.
   */
  static checkForBooleanFromAllNotesByRegex(databaseDatas, structure)
  {
    // a predicate for checking if the regex existed on the given database data.
    const regexMatchExists = databaseData => databaseData.getBooleanFromNotesByRegex(structure, true);

    // scan all the database datas.
    return databaseDatas.some(regexMatchExists);
  }

  static getArrayOfArraysFromDatabaseObjects(databaseDatas, structure)
  {

  }
}
//#endregion RPGManager