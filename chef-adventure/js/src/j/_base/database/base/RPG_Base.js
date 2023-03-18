//region RPG_Base
/**
 * A class representing the foundation of all database objects.
 * In addition to doing all the things that a database object normally does,
 * there are now some useful helper functions available for meta and note access,
 * and additionally a means to access the original database object directly in case
 * there are other things that aren't supported by this class that need accessing.
 */
class RPG_Base
{
  //region properties
  /**
   * The original object that this data was built from.
   * @type {any}
   */
  #original = null;

  /**
   * The index of this entry in the database.
   * @type {number}
   */
  #index = 0;

  /**
   * The entry's id in the database.
   */
  id = 0;

  /**
   * The `meta` object of this skill, containing a dictionary of
   * key value pairs translated from this skill's `note` object.
   * @type {{ [k: string]: any }}
   */
  meta = {};

  /**
   * The entry's name.
   */
  name = String.empty;

  /**
   * The note field of this entry in the database.
   * @type {string}
   */
  note = String.empty;
  //endregion properties

  //region base
  /**
   * Constructor.
   * Maps the base item's properties into this object.
   * @param {any} baseItem The underlying database object.
   * @param {number} index The index of the entry in the database.
   */
  constructor(baseItem, index)
  {
    this.#original = baseItem;
    this.index = index;

    // map the core data that all database objects have.
    this.id = baseItem.id;
    this.meta = baseItem.meta;
    this.name = baseItem.name;
    this.note = baseItem.note;
  }

  /**
   * Retrieves the index of this entry in the database.
   * @returns {number}
   */
  _index()
  {
    return this.index;
  }

  /**
   * Updates the index of this entry in the database.
   * @param {number} newIndex The new index to set.
   */
  _updateIndex(newIndex)
  {
    this.index = newIndex;
  }

  /**
   * Retrieves the original underlying data that was passed to this
   * wrapper from the database.
   * @returns {any}
   */
  _original()
  {
    return this.#original;
  }

  /**
   * Creates a new instance of this wrapper class with all the same
   * database data that this one contains.
   * @returns {this}
   */
  _clone()
  {
    // generate a new instance with the same data as the original.
    const clone = new this.constructor(this, this._index());

    // return the newly created copy.
    return clone;
  }

  /**
   * Generates an instance of this object off of the values of another.
   *
   * This is mostly used for "cloning" based on some other values.
   * @param {RPG_Base} overrides The overriding object.
   * @param {number} index The new index.
   * @returns {this}
   */
  _generate(overrides, index)
  {
    return new this.constructor(overrides, index);
  }


  /**
   * The unique key that is used to register this object against
   * its corresponding container when the party has one or more of these
   * in their possession. By default, this is just the index of the item's entry
   * from the database, but you can change it if you need a more unique means
   * of identifying things.
   * @returns {any}
   */
  _key()
  {
    return this._index();
  }
  //endregion base

  //region meta
  /**
   * Gets the metadata of a given key from this entry as whatever value RMMZ stored it as.
   * Only returns null if there was no underlying data associated with the provided key.
   * @param {string} key The key to the metadata.
   * @returns {any|null} The value as RMMZ translated it, or null if the value didn't exist.
   */
  metadata(key)
  {
    // pull the metadata of a given key.
    const result = this.#getMeta(key);

    // check if we have a result that isn't undefined.
    if (result !== undefined)
    {
      // return that result.
      return result;
    }

    return null;
  }

  /**
   * Gets the value of the given key from this entry's meta object.
   * @param key
   * @returns {string|number|boolean|undefined}
   */
  #getMeta(key)
  {
    return this.meta[key];
  }

  /**
   * Deletes the metadata key from the entry entirely.
   * @param key
   */
  deleteMetadata(key)
  {
    delete this.meta[key]
  }

  /**
   * Gets the metadata of a given key from this entry as a string.
   * Only returns `null` if there was no underlying data associated with the provided key.
   * @param {string} key The key to the metadata.
   * @returns {boolean|null} The value as a string, or null if the value didn't exist.
   */
  metaAsString(key)
  {
    // grab the metadata for this skill.
    const fromMeta = this.#getMeta(key);

    // check to make sure we actually got a value.
    if (fromMeta)
    {
      // return the stringified value.
      return fromMeta.toString();
    }

    return null;
  }

  /**
   * Gets the metadata of a given key from this entry as a number.
   * Only returns `null` if the underlying data wasn't a number or numeric string.
   * @param {string} key The key to the metadata.
   * @returns {boolean|null} The number value, or null if the number wasn't valid.
   */
  metaAsNumber(key)
  {
    // grab the metadata for this skill.
    const fromMeta = this.#getMeta(key);

    // check to make sure we actually got a value.
    if (fromMeta)
    {
      // return the parsed and possibly floating point value.
      return parseFloat(fromMeta);
    }

    return null;
  }

  /**
   * Gets the metadata of a given key from this skill as a boolean.
   * Only returns `null` if the underlying data wasn't a truthy or falsey value.
   * @param {string} key The key to the metadata.
   * @returns {boolean|null} True if the value was true, false otherwise; or null if invalid.
   */
  metaAsBoolean(key)
  {
    // grab the metadata for this skill.
    const fromMeta = this.#getMeta(key);

    // check to make sure we actually got a value.
    if (fromMeta)
    {
      // check if the value was a truthy value.
      if (fromMeta === true || fromMeta.toLowerCase() === "true")
      {
        return true;
      }
      // check if the value was a falsey value.
      else if (fromMeta === false || fromMeta.toLowerCase() === "false")
      {
        return false;
      }
    }

    return null;
  }

  /**
   * Retrieves the metadata for a given key on this skill.
   * This is mostly designed for providing intellisense.
   * @param {string} key The key to the metadata.
   * @returns {any|null}
   */
  metaAsObject(key)
  {
    // grab the metadata for this skill.
    const fromMeta = this.metadata(key);

    // check to make sure we actually got a value.
    if (fromMeta)
    {
      // parse out the underlying data.
      return this.#parseObject(fromMeta);
    }

    return null;
  }

  /**
   * Parses a object into whatever its given data type is.
   * @param {any} obj The unknown object to parse.
   * @returns {any}
   */
  #parseObject(obj)
  {
    // check if the object to parse is a string.
    if (typeof obj === "string")
    {
      // check if the string is an unparsed array.
      if (obj.startsWith("[") && obj.endsWith("]"))
      {
        // expose the stringified segments of the array.
        const exposedArray = obj
          // peel off the outer brackets.
          .slice(1, obj.length-1)
          // split string into an array by comma or space+comma.
          .split(/, |,/);
        return this.#parseObject(exposedArray);
      }

      // no check for special string values.
      return this.#parseString(obj);
    }

    // check if the object to parse is a collection.
    if (Array.isArray(obj))
    {
      // iterate over the array and parse each item.
      return obj.map(this.#parseObject, this);
    }

    // number, boolean, or otherwise unidentifiable object.
    return obj;
  }

  /**
   * Parses a metadata object from a string into possibly a boolean or number.
   * If the conversion to those fail, then it'll proceed as a string.
   * @param {string} str The string object to parse.
   * @returns {boolean|number|string}
   */
  #parseString(str)
  {
    // check if its actually boolean true.
    if (str.toLowerCase() === "true") return true;
    // check if its actually boolean false.
    else if (str.toLowerCase() === "false") return false;

    // check if its actually a number.
    if (!Number.isNaN(parseFloat(str))) return parseFloat(str);

    // it must just be a word or something.
    return str;
  }
  //endregion meta

  //region note
  /**
   * Gets the note data of this baseitem split into an array by `\r\n`.
   * If this baseitem has no note data, it will return an empty array.
   * @returns {string[]|null} The value as RMMZ translated it, or null if the value didn't exist.
   */
  notedata()
  {
    // pull the note data of this baseitem.
    const fromNote = this.#formattedNotedata();

    // checks if we have note data.
    if (fromNote)
    {
      // return the note data as an array of strings.
      return fromNote;
    }

    // if we returned no data from this baseitem, then return an empty array.
    return [];
  }

  /**
   * Returns a formatted array of strings as output from the note data of this baseitem.
   * @returns {string[]}
   */
  #formattedNotedata()
  {
    // split the notes by new lines.
    const formattedNotes = this.note
      .split(/[\r\n]+/)
    // filter out invalid note data.
      .filter(this.invalidNoteFilter, this);

    // if we have no length left after filtering, then there is no note data.
    if (formattedNotes.length === 0) return null;

    // return our array of notes!
    return formattedNotes;
  }

  /**
   * A filter function for defining what is invalid when it comes to a note data.
   * @param {string} note A single line in the note data.
   * @returns {boolean} True if the note data is valid, false otherwise.
   */
  invalidNoteFilter(note)
  {
    // empty strings are not valid notes.
    if (note === String.empty) return false;

    // everything else is.
    return true;
  }

  /**
   * Removes all regex matches in the raw note data string.
   * @param {RegExp} regex The regular expression to find matches for removal.
   */
  deleteNotedata(regex)
  {
    // remove the regex matches from the note.
    this.note = this.note.replace(regex, String.empty);

    // cleanup the line endings that may have been messed up.
    this.#cleanupLineEndings();
  }

  /**
   * Reformats the note data to remove any invalid line endings, including those
   * that may be at the beginning because stuff was removed, or the duplicates that
   * may live throughout the note after modification.
   */
  #cleanupLineEndings()
  {
    // cleanup any duplicate newlines.
    this.note = this.note.replace(/\n\n/gmi, '\n');
    this.note = this.note.replace(/\r\r/gmi, '\r');

    // cleanup any leading newlines.
    if (this.note.startsWith('\r') || this.note.startsWith('\n'))
    {
      this.note = this.note.slice(2);
    }
  }

  /**
   * Gets an accumulated numeric value based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is an numeric value,
   * and adds all values together from each line in the notes that match the provided
   * regex structure.
   *
   * If the optional flag `nullIfEmpty` receives true passed in, then the result of
   * this will be `null` instead of the default 0 as an indicator we didn't find
   * anything from the notes of this skill.
   *
   * This can handle both integers and decimal numbers.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean=} nullIfEmpty Whether or not to return 0 if not found, or null.
   * @returns {number|null} The combined value added from the notes of this object, or zero/null.
   */
  getNumberFromNotesByRegex(structure, nullIfEmpty = false)
  {
    // get the note data from this skill.
    const lines = this.getFilteredNotesByRegex(structure);

    // if we have no matching notes, then short circuit.
    if (!lines.length)
    {
      // return null or 0 depending on provided options.
      return nullIfEmpty ? null : 0;
    }

    // initialize the value.
    let val = 0;

    // iterate over each valid line of the note.
    lines.forEach(line =>
    {
      // extract the captured formula.
      // eslint-disable-next-line prefer-destructuring
      const result = structure.exec(line)[1];

      // regular parse it and add it to the running total.
      val += parseFloat(result);
    });

    // return the
    return val;
  }

  /**
   * Gets all numbers matching the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is a numeric value,
   * and concats all values together from each line in the notes that match the provided
   * regex structure.
   *
   * If the optional flag `nullIfEmpty` receives true passed in, then the result of
   * this will be `null` instead of the default empty array [] as an indicator we didn't find
   * anything from the notes of this object.
   *
   * This can handle both integers and decimal numbers.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean=} nullIfEmpty Whether or not to return 0 if not found, or null.
   * @returns {number[]|null} The concat'd array of all found numbers, or null if flagged.
   */
  getNumberArrayFromNotesByRegex(structure, nullIfEmpty = false)
  {
    // get the note data from this skill.
    const lines = this.getFilteredNotesByRegex(structure);

    // if we have no matching notes, then short circuit.
    if (!lines.length)
    {
      // return null or 0 depending on provided options.
      return nullIfEmpty ? null : [];
    }

    // initialize the value.
    const val = [];

    // iterate over each valid line of the note.
    lines.forEach(line =>
    {
      // extract the captured formula.
      const [,result] = structure.exec(line);

      // parse out the array of stringified numbers, and parse the strings.
      const parsed = JSON.parse(result).map(parseFloat);

      // destructure the array and add its bits to the running collection.
      val.push(...parsed);
    });

    // return the concat'd array of all numbers found in the matching regex.
    return val;
  }

  /**
   * Evaluates formulai into a numeric value based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is an formula,
   * and adds all results together from each line in the notes that match the provided
   * regex structure.
   *
   * If the optional flag `nullIfEmpty` receives true passed in, then the result of
   * this will be `null` instead of the default 0 as an indicator we didn't find
   * anything from the notes of this skill.
   *
   * This can handle both integers and decimal numbers.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {number=} baseParam The base parameter value used as the "b" in the formula.
   * @param {RPG_BaseBattler=} context The contextual battler used as the "a" in the formula.
   * @param {boolean=} nullIfEmpty Whether or not to return 0 if not found, or null.
   * @returns {number|null} The combined value added from the notes of this object, or zero/null.
   */
  getResultsFromNotesByRegex(structure, baseParam = 0, context = null, nullIfEmpty = false)
  {
    // get the note data from this skill.
    const lines = this.getFilteredNotesByRegex(structure);

    // if we have no matching notes, then short circuit.
    if (!lines.length)
    {
      // return null or 0 depending on provided options.
      return nullIfEmpty ? null : 0;
    }

    // initialize the value.
    let val = 0;

    // establish a variable to be used as "a" in the formula- the battler.
    // eslint-disable-next-line no-unused-vars
    const a = context;

    // establish a variable to be used as "b" in the formula- the base parameter value.
    // eslint-disable-next-line no-unused-vars
    const b = baseParam;

    // establish a variable to be used as "v" in the formula- access to variables if needed.
    // eslint-disable-next-line no-unused-vars
    const v = $gameVariables._data;

    // iterate over each valid line of the note.
    lines.forEach(line =>
    {
      // extract the captured formula.
      // eslint-disable-next-line prefer-destructuring
      const formula = structure.exec(line)[1];

      // evaluate the formula/value.
      const result = eval(formula).toFixed(3);

      // add it to the running total.
      val += parseFloat(result);
    });

    // return the calculated summed value.
    return val;
  }

  /**
   * Gets the last string value based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is a string value.
   * If multiple tags are found, only the last one will be returned.
   *
   * If the optional flag `nullIfEmpty` receives true passed in, then the result of
   * this will be `null` instead of the default empty string as an indicator we didn't find
   * anything from the notes of this database object.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} nullIfEmpty Whether or not to return an empty string if not found, or null.
   * @returns {string|null} The found value from the notes of this object, or empty/null.
   */
  getStringFromNotesByRegex(structure, nullIfEmpty = false)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

    // initialize the value.
    let val = String.empty;

    // default to not having a match.
    let hasMatch = false;

    // iterate the note data array.
    fromNote.forEach(note =>
    {
      // check if this line matches the given regex structure.
      if (note.match(structure))
      {
        // parse the value out of the regex capture group.
        val = RegExp.$1;

        // flag that we found a match.
        hasMatch = true;
      }
    });

    // check if we didn't find a match, and we want null instead of empty.
    if (!hasMatch && nullIfEmpty)
    {
      // return null.
      return null;
    }
    // we want an empty string or the found value.
    else
    {
      // return the found value.
      return val;
    }
  }

  /**
   * Gets all strings based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is a string value.
   * If multiple tags are found, only the last one will be returned.
   *
   * If the optional flag `nullIfEmpty` receives true passed in, then the result of
   * this will be `null` instead of the default empty array as an indicator we didn't find
   * anything from the notes of this database object.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} nullIfEmpty Whether or not to return an empty array if not found, or null.
   * @returns {string[]|null} The found strings from the notes of this object, or empty/null.
   */
  getStringsFromNotesByRegex(structure, nullIfEmpty = false)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

    // initialize the collection of values.
    const val = [];

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

    // check if we didn't find a match, and we want null instead of empty.
    if (!hasMatch && nullIfEmpty)
    {
      // return null.
      return null;
    }
    // we want an empty string or the found value.
    else
    {
      // return the found value.
      return val;
    }
  }

  /**
   * Gets whether or not there is a matching regex tag on this database entry.
   *
   * Do be aware of the fact that with this type of tag, we are checking only
   * for existence, not the value. As such, it will be `true` if found, and `false` if
   * not, which may not be accurate. Pass `true` to the `nullIfEmpty` to obtain a
   * `null` instead of `false` when missing, or use a string regex pattern and add
   * something like `<someKey:true>` or `<someKey:false>` for greater clarity.
   *
   * This accepts a regex structure, but does not leverage a capture group.
   *
   * If the optional flag `nullIfEmpty` receives true passed in, then the result of
   * this will be `null` instead of the default `false` as an indicator we didn't find
   * anything from the notes of this skill.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} nullIfEmpty Whether or not to return `false` if not found, or null.
   * @returns {boolean|null} The found value from the notes of this object, or empty/null.
   */
  getBooleanFromNotesByRegex(structure, nullIfEmpty = false)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

    // initialize the value.
    let val = false;

    // default to not having a match.
    let hasMatch = false;

    // iterate the note data array.
    fromNote.forEach(note =>
    {
      // check if this line matches the given regex structure.
      if (note.match(structure))
      {
        // parse the value out of the regex capture group.
        val = true;

        // flag that we found a match.
        hasMatch = true;
      }
    });

    // check if we didn't find a match, and we want null instead of empty.
    if (!hasMatch && nullIfEmpty)
    {
      // return null.
      return null;
    }
    // we want a "false" or the found value.
    else
    {
      // return the found value.
      return val;
    }
  }

  /**
   * Gets an array value based on the provided regex structure.
   *
   * This accepts a regex structure, assuming the capture group is an array of values
   * all wrapped in hard brackets [].
   *
   * If the optional flag `tryParse` is true, then it will attempt to parse out
   * the array of values as well, including translating strings to numbers/booleans
   * and keeping array structures all intact.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} tryParse Whether or not to attempt to parse the found array.
   * @returns {any[]|null} The array from the notes, or null.
   */
  getArrayFromNotesByRegex(structure, tryParse = true)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

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
        val = RegExp.$1;

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
      val = this.#parseObject(val);
    }

    // return the found value.
    return val;
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
   * @param {RegExp} structure The regular expression to filter notes by.
   * @param {boolean} tryParse Whether or not to attempt to parse the found array.
   * @returns {any[]|null} The array from the notes, or null.
   */
  getArraysFromNotesByRegex(structure, tryParse = true)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

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
      val = val.map(this.#parseObject, this);
    }

    // return the found value.
    return val;
  }

  /**
   * Gets all lines of data from the notedata that match the provided regex.
   *
   * This accepts a regex structure, and translates nothing; it is intended to
   * be used with the intent of translating the lines that match elsewhere.
   *
   * If nothing is found, then this will return an empty array.
   * @param {RegExp} structure The regular expression to filter notes by.
   * @returns {string[]} The data matching the regex from the notes.
   */
  getFilteredNotesByRegex(structure)
  {
    // get the note data from this skill.
    const fromNote = this.notedata();

    // initialize the value.
    const data = [];

    // iterate the note data array.
    fromNote.forEach(note =>
    {
      // check if this line matches the given regex structure.
      if (note.match(structure))
      {
        // parse the value out of the regex capture group.
        data.push(note);
      }
    });

    // return the found value.
    return data;
  }
  //endregion note
}
//endregion RPG_Base