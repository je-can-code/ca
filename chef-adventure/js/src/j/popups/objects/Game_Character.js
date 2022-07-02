//#region Game_Character
/**
 * Hooks into the `Game_Character.initMembers` and adds in action sprite properties.
 */
J.POPUPS.Aliased.Game_Character.set('initMembers', Game_Character.prototype.initMembers);
Game_Character.prototype.initMembers = function()
{
  /**
   * The master reference to the `_j` object containing all plugin properties.
   * @type {{}}
   */
  this._j ||= {};

  /**
   * The text pops that are pending processing.
   * @type {Map_TextPop[]}
   */
  this._j._textPops = [];

  /**
   * Whether or not this character has a request for generating damage pops.
   * @type {boolean}
   */
  this._j._textPopRequest = false;

  // run the rest of the original logic.
  J.POPUPS.Aliased.Game_Character.get('initMembers').call(this);
};

/**
 * Gets the `requestDamagePop` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getRequestTextPop = function()
{
  // don't do this if popups are disabled by JABS.
  if (J.ABS && J.ABS.Metadata.DisableTextPops) return false;

  return this._j._textPopRequest;
};

/**
 * Flags this character for requiring a text pop.
 * @param {boolean} textPopRequest True to process all current text pops on this character, false otherwise.
 */
Game_Character.prototype.setRequestTextPop = function(textPopRequest = true)
{
  // don't do this if popups are disabled by JABS.
  if (J.ABS && J.ABS.Metadata.DisableTextPops) return;

  // assign the request.
  this._j._textPopRequest = textPopRequest;
};

/**
 * Adds a text pop to this character.
 * @param {Map_TextPop} textPop A text pop that will be displayed on the map.
 */
Game_Character.prototype.addTextPop = function(textPop)
{
  // don't do this if popups are disabled by JABS.
  if (J.ABS && J.ABS.Metadata.DisableTextPops) return;

  // add the text pop to the tracking.
  this._j._textPops.push(textPop);
};

/**
 * Gets all currently waiting-to-be-processed text pops.
 * @returns {Map_TextPop[]}
 */
Game_Character.prototype.getTextPops = function()
{
  return this._j._textPops;
};

/**
 * Remove all text pops from the collection.
 */
Game_Character.prototype.emptyDamagePops = function()
{
  // empty the contents of the array for all references to see.
  this._j._textPops.splice(0, this._j._textPops.length);
};
//#endregion Game_Character