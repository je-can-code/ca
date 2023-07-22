//region Game_Event
//region properties
/**
 * Hooks into the initialization to add our members for containing event data.
 */
J.ESCRIBE.Aliased.Game_Event.set('initMembers', Game_Event.prototype.initMembers);
Game_Event.prototype.initMembers = function()
{
  // perform original logic.
  J.ESCRIBE.Aliased.Game_Event.get('initMembers').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with escriptions.
   */
  this._j._event ||= {};

  /**
   * The describe data for this event.
   * @type {Escription}
   */
  this._j._event._describe = null;

  /**
   * Whether or not the player is in-proximity for the text.
   * @type {boolean}
   */
  this._j._event._playerNearbyText = null;

  /**
   * Whether or not the player is in-proximity for the icon.
   * @type {boolean}
   */
  this._j._event._playerNearbyIcon = null;

  /**
   * Whether or not the escription needs adding.
   * @type {boolean}
   */
  this._j._event._needsAdding = false;

  /**
   * Whether or not the escription needs removal.
   * @type {boolean}
   */
  this._j._event._needsRemoval = false;
};

/**
 * Gets the describe data for this event.
 * @returns {Escription}
 */
Game_Event.prototype.escribeData = function()
{
  return this._j._event._describe;
};

/**
 * Sets the describe data for this event.
 * @param {Escription} describeData The new describe data.
 */
Game_Event.prototype.setEscribeData = function(describeData)
{
  this._j._event._describe = describeData;
};

/**
 * Sets whether or not the player is witin the proximity to see the describe text.
 * @param {boolean} nearby True if the player is nearby, false otherwise.
 */
Game_Event.prototype.setPlayerNearbyForText = function(nearby)
{
  this._j._event._playerNearbyText = nearby;
};

/**
 * Gets whether or not the player is witin the proximity to see the describe text.
 * @returns {boolean} True if the player is close enough to see the describe text, false otherwise.
 */
Game_Event.prototype.getPlayerNearbyForText = function()
{
  return this._j._event._playerNearbyText;
};

/**
 * Sets whether or not the player is witin the proximity to see the describe icon.
 * @param {boolean} nearby True if the player is nearby, false otherwise.
 */
Game_Event.prototype.setPlayerNearbyForIcon = function(nearby)
{
  this._j._event._playerNearbyIcon = nearby;
};

/**
 * Gets whether or not the player is witin the proximity to see the describe icon.
 * @returns {boolean} True if the player is close enough to see the describe text, false otherwise.
 */
Game_Event.prototype.getPlayerNearbyForIcon = function()
{
  return this._j._event._playerNearbyIcon;
};

/**
 * Gets whether or not this event has non-empty describe data.
 * @returns {boolean}
 */
Game_Event.prototype.hasEscribeData = function()
{
  // grab the describe data.
  const describe = this.escribeData();

  // return whether or not it is valid.
  return !!describe;
};

Game_Event.prototype.needsEscribeAdding = function()
{
  return this._j._event._needsAdding;
};

Game_Event.prototype.flagForEscribeAddition = function()
{
  this._j._event._needsAdding = true;
};

Game_Event.prototype.acknowledgeEscribeAddition = function()
{
  this._j._event._needsAdding = false;
};

Game_Event.prototype.needsEscribeRemoval = function()
{
  return this._j._event._needsRemoval;
};

Game_Event.prototype.flagForEscribeRemoval = function()
{
  this._j._event._needsRemoval = true;
};

Game_Event.prototype.acknowledgeEscribeRemoval = function()
{
  this._j._event._needsRemoval = false;
};
//endregion properties

/**
 * Extends the page settings for events and adds on custom parameters to this event.
 */
J.ESCRIBE.Aliased.Game_Event.set('setupPage', Game_Event.prototype.setupPage);
Game_Event.prototype.setupPage = function()
{
  // perform original logic.
  J.ESCRIBE.Aliased.Game_Event.get('setupPage').call(this);

  // refresh the escription data for this event page.
  this.refreshEscription();
};

/**
 * Refreshes the escription data for this event based on the current page.
 */
Game_Event.prototype.refreshEscription = function()
{
  // also parse the event comments for the data points we care about.
  this.parseEscriptionComments();
};

/**
 * Parses the event comments to discern the describe data, if any.
 */
Game_Event.prototype.parseEscriptionComments = function()
{
  // if we cannot parse for event comments, then do not.
  if (!this.canParseEscriptionComments()) return;

  // extract the values from the comments of the event.
  const text = this.parseEscriptionTextValue();
  const iconIndex = this.parseEscriptionIconIndexValue();
  const proximityText = this.parseEscriptionTextProximityValue();
  const proximityIcon = this.parseEscriptionIconProximityValue();

  // check if we have valid text or icon values.
  if (text || (iconIndex > -1))
  {
    // build and set the escribe data.
    const describe = new Escription(text, iconIndex, proximityText, proximityIcon);
    this.setEscribeData(describe);

    // flag for adding/updating this escribe data.
    this.flagForEscribeAddition();
  }
  // we don't have valid text or icons.
  else
  {
    // remove the escribe data.
    this.setEscribeData(null);

    // flag for removal if there is currently escribe data.
    this.flagForEscribeRemoval();
  }
};

/**
 * Determines whether or not we can parse the comments for escription data.
 * @returns {boolean} True if we can, false otherwise.
 */
Game_Event.prototype.canParseEscriptionComments = function()
{
  // don't try to do things with actions- they are volatile.
  if (J.ABS && (this.isJabsAction() || this.isJabsLoot())) return false;

  // don't try to parse events that aren't "present".
  if (this._pageIndex === -1 || this._pageIndex === -2) return false;

  // we can parse!
  return true;
};

/**
 * Extracts the escription text value from the comment event commands.
 * @returns {string|String.empty}
 */
Game_Event.prototype.parseEscriptionTextValue = function()
{
  // parse out the text.
  const text = this.extractValueByRegex(J.ESCRIBE.RegExp.Text, String.empty);

  // return what we found.
  return text;
};

/**
 * Extracts the escription icon index value from the comment event commands.
 * @returns {number|-1}
 */
Game_Event.prototype.parseEscriptionIconIndexValue = function()
{
  // parse out the icon index.
  const iconIndex = this.extractValueByRegex(J.ESCRIBE.RegExp.IconIndex, -1);

  // return what we found.
  return iconIndex;
};

/**
 * Extracts the escription text proximity value from the comment event commands.
 * @returns {number|-1}
 */
Game_Event.prototype.parseEscriptionTextProximityValue = function()
{
  // initialize variable.
  const textProximity = this.extractValueByRegex(J.ESCRIBE.RegExp.ProximityText, -1);

  // return what we found.
  return textProximity;
};

/**
 * Extracts the escription icon proximity value from the comment event commands.
 * @returns {number|-1}
 */
Game_Event.prototype.parseEscriptionIconProximityValue = function()
{
  // initialize variable.
  const iconProximity = this.extractValueByRegex(J.ESCRIBE.RegExp.ProximityIcon, -1);

  // return what we found.
  return iconProximity;
};

/**
 * Extends {@link Game_Event.update}.
 * Also updates the describe proximity information of the player for the describe data.
 */
J.ESCRIBE.Aliased.Game_Event.set('update', Game_Event.prototype.update);
Game_Event.prototype.update = function()
{
  // perform original logic.
  J.ESCRIBE.Aliased.Game_Event.get('update').call(this);

  if (this.eventId() === 3)
  {
    console.log();
  }

  // check if this event has describe data.
  if (this.hasProximityEscriptionData())
  {
    // update the proximity information for each.
    this.updateEscribeTextProximity();
    this.updateEscribeIconProximity();
  }
};

/**
 * Gets whether or not this event has a proximity describe associated with it.
 * @returns {boolean} True if there is something with proximity, false otherwise.
 */
Game_Event.prototype.hasProximityEscriptionData = function()
{
  // grab the describe data.
  const describe = this.escribeData();

  // if we don't have describe data, we don't have any proximity to work with.
  if (!describe) return false;

  // having proximity means text or icon proximity is greater than -1, the default.
  const hasProximity = (describe.proximityTextRange() > -1 || describe.proximityIconRange() > -1);

  // return our findings.
  return hasProximity;
};

/**
 * Updates whether or not the player is within proximity for the describe text to be visible.
 */
Game_Event.prototype.updateEscribeTextProximity = function()
{
  // grab the describe data.
  const describe = this.escribeData();

  // don't update for text if text proximity isn't being used.
  if (describe.proximityTextRange() < 0) return;

  // check if we're in proximity for the text.
  if (describe.proximityTextRange() >= this.distanceFromPlayer())
  {
    // enable the visibility of the text.
    this.setPlayerNearbyForText(true);
  }
  // we are not in proximity.
  else
  {
    // disable the visibility of the text.
    this.setPlayerNearbyForText(false);
  }
};

/**
 * Updates whether or not the player is within proximity for the describe icon to be visible.
 */
Game_Event.prototype.updateEscribeIconProximity = function()
{
  // grab the describe data.
  const describe = this.escribeData();

  // don't update for text if icon proximity isn't being used.
  if (describe.proximityIconRange() < 0) return;

  // check if we're in proximity for the icon.
  if (describe.proximityIconRange() >= this.distanceFromPlayer())
  {
    // enable the visibility of the icon.
    this.setPlayerNearbyForIcon(true);
  }
  // we are not in proximity.
  else
  {
    // disable the visibility of the icon.
    this.setPlayerNearbyForIcon(false);
  }
};
//endregion Game_Event