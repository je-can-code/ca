//#region Game_Event
/**
 * Hooks into the initialization to add our members for containing event data.
 */
J.ESCRIBE.Aliased.Game_Event.initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function()
{
  this._j = this._j || {};

  /**
   * The various data points for drawing text and icon.
   * @type {any}
   */
  this._j._event = {
    /**
     * The describe data for this event.
     * @type {Escription}
     */
    _describe: null,

    /**
     * Whether or not the player is in-proximity for the text.
     * @type {boolean}
     */
    _playerNearbyText: null,

    /**
     * Whether or not the player is in-proximity for the icon.
     * @type {boolean}
     */
    _playerNearbyIcon: null,
  };
  J.ESCRIBE.Aliased.Game_Event.initMembers.call(this);
};

/**
 * Extends the page settings for events and adds on custom parameters to this event.
 */
J.ESCRIBE.Aliased.Game_Event.setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function()
{
  this.parseEventComments();
  J.ESCRIBE.Aliased.Game_Event.setupPage.call(this);
};

/**
 * Parses the event comments to discern the describe data, if any.
 */
Game_Event.prototype.parseEventComments = function()
{
  // don't try to do things with actions- they are volatile.
  if (J.ABS && (this.isAction() || this.isLoot())) return;

  // don't try to parse events that aren't "present".
  if (this._pageIndex === -1 || this._pageIndex === -2) return;

  // initialize values.
  let text = "";
  let iconIndex = -1;
  let proximityText = -1;
  let proximityIcon = -1;

  // iterate over all commands to construct the event data.
  this.list().forEach(command =>
  {
    if (this.matchesControlCode(command.code))
    {
      const comment = command.parameters[0];
      switch (true)
      {
        case (/<text:([ ^*-.\w]+)>/i.test(comment)): // text
          text = RegExp.$1;
          break;
        case (/<icon:[ ]?([0-9]*)>/i.test(comment)): // icon index
          iconIndex = parseInt(RegExp.$1);
          break;
        case (/<proximityText[:]?(\d+\.?\d*|\.\d+)?>/i.test(comment)): // text proximity only?
          proximityText = RegExp.$1 ? parseInt(RegExp.$1) : 0;
          break;
        case (/<proximityIcon[:]?(\d+\.?\d*|\.\d+)?>/i.test(comment)): // icon proximity only?
          proximityIcon = RegExp.$1 ? parseInt(RegExp.$1) : 0;
          break;
      }
    }
  });

  if (text || (iconIndex > -1))
  {
    const describe = new Escription(text, iconIndex, proximityText, proximityIcon);
    this._j._event._describe = describe;
  }
};

/**
 * Gets the describe data for this event.
 * @returns {Escription}
 */
Game_Event.prototype.getDescribeData = function()
{
  return this._j._event._describe;
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
Game_Event.prototype.hasDescribeData = function()
{
  const describe = this.getDescribeData();
  return !!describe;
};

/**
 * Gets whether or not this event has a proximity describe associated with it.
 * @returns {boolean}
 */
Game_Event.prototype.hasProximityDescribeData = function()
{
  const describe = this.getDescribeData();
  if (!describe) return false;

  const hasProximity = (describe.proximityTextRange() > -1 || describe.proximityIconRange() > -1)
  return hasProximity;
};

/**
 * Hooks into the update function for this event to update the describe data.
 */
J.ESCRIBE.Aliased.Game_Event.update = Game_Event.prototype.update;
Game_Event.prototype.update = function()
{
  J.ESCRIBE.Aliased.Game_Event.update.call(this);
  if (this.hasProximityDescribeData())
  {
    this.updateDescribeTextProximity();
    this.updateDescribeIconProximity();
  }
};

/**
 * Updates whether or not the player is within proximity for the describe text to be visible.
 */
Game_Event.prototype.updateDescribeTextProximity = function()
{
  const describe = this.getDescribeData();
  // don't update for text if text proximity isn't being used.
  if (describe.proximityTextRange() < 0) return;

  if (describe.proximityTextRange() >= this.distanceFromPlayer())
  {
    this.setPlayerNearbyForText(true);
  }
  else
  {
    this.setPlayerNearbyForText(false);
  }
};

/**
 * Updates whether or not the player is within proximity for the describe icon to be visible.
 */
Game_Event.prototype.updateDescribeIconProximity = function()
{
  const describe = this.getDescribeData();
  // don't update for text if icon proximity isn't being used.
  if (describe.proximityIconRange() < 0) return;

  if (describe.proximityIconRange() >= this.distanceFromPlayer())
  {
    this.setPlayerNearbyForIcon(true);
  }
  else
  {
    this.setPlayerNearbyForIcon(false);
  }
};

/**
 * Gets the distance in tiles between this event and the player.
 * @returns {number} The distance.
 */
Game_Event.prototype.distanceFromPlayer = function()
{
  return Math.abs($gamePlayer.x - this.x) + Math.abs($gamePlayer.y - this.y);
};
//#endregion Game_Event