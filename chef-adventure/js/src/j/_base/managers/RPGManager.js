//region RPGManager
/**
 * A utility class for handling common database-related translations.
 */
class RPGManager
{
  /**
   * A quick and re-usable means of rolling for a chance of success.
   * This will roll `rollForPositive` times in an effort to get a successful roll.
   * If success is found and `rollsForNegative` is greater than 0, additional rolls of success will
   * be required or the negative rolls will undo the success.
   * @param {number} percentOfSuccess The percent chance of success.
   * @param {number=} rollForPositive The number of positive rolls to find success; defaults to 1.
   * @param {number=} rollForNegative The number of negative rolls to follow success; defaults to 0.
   * @returns {boolean} True if success, false otherwise.
   */
  static chanceIn100(percentOfSuccess, rollForPositive = 1, rollForNegative = 0)
  {
    // 0% chance skills should never trigger.
    if (percentOfSuccess <= 0) return false;

    // default fail.
    let success = false;

    // keep rolling for positive while we have positive rolls and aren't already successful.
    while (rollForPositive && !success)
    {
      // roll for effect!
      const chance = Math.randomInt(100) + 1;

      // check if the roll meets the chance criteria.
      if (chance <= percentOfSuccess)
      {
        // flag for success!
        success = true;
      }

      // decrement the positive roll counter.
      // eslint-disable-next-line no-param-reassign
      rollForPositive--;
    }

    // if successful and we have negative rerolls, lets get fight RNG for success!
    if (success && rollForNegative)
    {
      // keep rolling for negative while we have negative rerolls and are still successful.
      while (rollForNegative && success)
      {
        // roll for effect!
        const chance = Math.randomInt(100) + 1;

        // check if the roll meets the chance criteria.
        if (chance <= percentOfSuccess)
        {
          // we keep our flag! (this time...)
          success = true;
        }
        // we didn't meet the chance criteria this time.
        else
        {
          // undo our success and stop rolling :(
          return false;
        }

        // decrement the negative reroll counter.
        // eslint-disable-next-line no-param-reassign
        rollForNegative--;
      }
    }

    // return our successes (or failure).
    return success;
  }

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
      const onChanceEffectList = this.getOnChanceEffectsFromDatabaseObject(databaseData, structure);

      // add it to the collection.
      onChanceEffects.push(...onChanceEffectList);
    });

    // return what was found.
    return onChanceEffects;
  }

  /**
   * Collects all {@link JABS_OnChanceEffect}s from a single database objects.
   * @param {RPG_Base} databaseData The database object to retrieve on-chance effects from.
   * @param {RegExp} structure The on-chance-effect-templated regex structure to parse for.
   * @returns {JABS_OnChanceEffect[]} All found on-chance effects on this database object.
   */
  static getOnChanceEffectsFromDatabaseObject(databaseData, structure)
  {
    // scan the object for matching on-chance data based on the given regex.
    const foundDatas = databaseData.getArraysFromNotesByRegex(structure);

    // if we found no data, then don't bother.
    if (!foundDatas) return [];

    // determine the key based on the regexp provided.
    const key = J.BASE.Helpers.getKeyFromRegexp(structure);

    // a mapper function for mapping array data points to an on-chance effect.
    const mapper = data =>
    {
      // extract the data points from the array found.
      const [skillId, chance] = data;

      // return the built on-chance effect with the given data.
      return new JABS_OnChanceEffect(skillId, chance ?? 100, key);
    };

    // map all the found on-chance effects.
    const mappedOnChanceEffects = foundDatas.map(mapper, this);

    // return what we found.
    return mappedOnChanceEffects;
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

  /**
   * Gets an array of arrays based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is an array of values
   * all wrapped in hard brackets [].
   *
   * If the optional flag `tryParse` is true, then it will attempt to parse out
   * the array of values as well, including translating strings to numbers/booleans
   * and keeping array structures all intact.
   * @param {string} noteObject The contents of the note of a given object.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} tryParse Whether or not to attempt to parse the found array.
   * @returns {any[][]|null} The array of arrays from the notes, or null.
   */
  static getArraysFromNotesByRegex(noteObject, structure, tryParse = true)
  {
    // get the note data from this skill.
    const fromNote = noteObject.split(/[\r\n]+/);

    // initialize the value.
    let val = [];

    // default to not having a match.
    let hasMatch = false;

    // iterate the note data array.
    fromNote.forEach(note =>
    {
      // check if this line matches the given regex structure.
      if (note.match(structure))
      {
        // parse the value out of the regex capture group.
        val.push(RegExp.$1);

        // flag that we found a match.
        hasMatch = true;
      }
    });

    // if we didn't find a match, return null instead of attempting to parse.
    if (!hasMatch) return null;

    // check if we're going to attempt to parse it, too.
    if (tryParse)
    {
      // attempt the parsing.
      val = val.map(J.BASE.Helpers.parseObject, J.BASE.Helpers);
    }

    // return the found value.
    return val;
  }

  /**
   * Gets a single array based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is an array of values
   * all wrapped in hard brackets [].
   *
   * If the optional flag `tryParse` is true, then it will attempt to parse out
   * the array of values as well, including translating strings to numbers/booleans
   * and keeping array structures all intact.
   * @param {string} noteObject The contents of the note of a given object.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} tryParse Whether or not to attempt to parse the found array.
   * @returns {any[]|null} The array from the notes, or null.
   */
  static getArrayFromNotesByRegex(noteObject, structure, tryParse = true)
  {
    // get the note data from this skill.
    const fromNote = noteObject.split(/[\r\n]+/);

    // initialize the value.
    let val = null;

    // default to not having a match.
    let hasMatch = false;

    // iterate the note data array.
    fromNote.forEach(note =>
    {
      // check if this line matches the given regex structure.
      if (note.match(structure))
      {
        // parse the value out of the regex capture group.
        val = JSON.parse(RegExp.$1);

        // flag that we found a match.
        hasMatch = true;
      }
    });

    // if we didn't find a match, return null instead of attempting to parse.
    if (!hasMatch) return null;

    // check if we're going to attempt to parse it, too.
    if (tryParse)
    {
      // attempt the parsing.
      val = val.map(J.BASE.Helpers.parseObject, J.BASE.Helpers);
    }

    // return the found value.
    return val;
  }
}
//endregion RPGManager