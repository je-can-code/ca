/**
 * Extends {@link initMembers}.
 * Includes this plugin's extra properties as well.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('initMembers', Game_CharacterBase.prototype.initMembers);
Game_CharacterBase.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.get('initMembers').call(this);

  // initialize the additional members.
  this.initPixelMovementMembers();
};

/**
 * Initializes the new members related to this plugin.
 */
Game_CharacterBase.prototype.initPixelMovementMembers = function()
{
  /**
   * Whether or not one of the directional inputs are being held down.
   * @type {boolean} True if at least one direction is being held, false otherwise.
   */
  this._movePressing = false;

  /**
   * The collection for tracking the {@link Point} coordinates for all members.
   * @type {Point[]}
   */
  this._posRecords = [];
};

/**
 * Gets whether or not the move input is being pressed.
 * @returns {boolean}
 */
Game_CharacterBase.prototype.isMovePressed = function()
{
  return this._movePressing;
};

/**
 * Sets whether or not the move input is being held down.
 * @param {boolean} pressed The new value of whether or not the button is being pressed.
 */
Game_CharacterBase.prototype.setMovePressed = function(pressed)
{
  this._movePressing = pressed;
};

/**
 * Gets whether or not this character has the move input being held down.
 * @returns {boolean} True if it is, false otherwise.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('isMoving', Game_CharacterBase.prototype.isMoving);
Game_CharacterBase.prototype.isMoving = function ()
{
  // if our special tracker is pressed, then return true.
  if (this.isMovePressed()) return true;

  // otherwise, return the original logic's result.
  return J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.get('isMoving').call(this);
};

/**
 * Round the x,y coordinates of this character.
 */
Game_CharacterBase.prototype.roundCoordinates = function()
{
  // round the x,y coordinates.
  this._x = Math.round(this.x);
  this._y = Math.round(this.y);
};

/**
 * Clears/initializes the positional cache for characters on the map.
 */
Game_CharacterBase.prototype._resetCachePosition = function () 
{
  this._posRecords = [];
};

/**
 * Manages the coordinates for characters on the map.
 */
Game_CharacterBase.prototype._recordPosition = function () 
{
  // TODO: remove this unnecessary initialization in-method.
  // initialize if necessary.
  if (!this._posRecords) 
  {
    this._posRecords = [];
  }

  // TODO: extract this distance function or re-use another?
  // a short-hand function for calculating distance between two points.
  const distance = (a, b) =>
  {
    if (!a || !b) return 0;

    return $gameMap.distance(last.x, last.y, this.x, this.y);
  };

  // grab the most recently added point from the collection.
  const last = this._recentPosition();

  // calculate the distance between
  const dis = distance(last, this);

  // check if the distance has exceeded the threshold.
  if (dis > 2) 
  {
    // clear the cache.
    this._resetCachePosition();
  }
  // TODO: what is this checking?
  else if (!last || dis > 0.1) 
  {
    // TODO: use the Point class?
    const point = { x: this.x, y: this.y }; //new Point(this.x, this.y);

    // add the point to the tracking.
    this._posRecords.push(point);

    // TODO: what actually is the purpose of this tracker?
    // only keep the top ten tracking records for positioning.
    while (this._posRecords.length > 10) 
    {
      this._posRecords.shift();
    }
  }
};

/**
 * Gets the first-added record from the collection of coordinate tracking.
 * @returns {Point}
 */
Game_CharacterBase.prototype._lastPosition = function () 
{
  if (this._posRecords && this._posRecords.length > 0) 
  {
    return this._posRecords.at(0);
  }

  // there are no records to retrieve.
  return null;
};

/**
 * Gets the last-added record from the collection of coordinate tracking.
 * @returns {Point}
 */
Game_CharacterBase.prototype._recentPosition = function() 
{
  if (this._posRecords && this._posRecords.length > 0) 
  {
    return this._posRecords.at(-1);
  }
};

/**
 * Forcefully relocates this character to a different set of coordinates.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 */
Game_CharacterBase.prototype.relocate = function(x, y)
{
  // update the coordinates of this character.
  this._x = x;
  this._y = y;
};

/**
 * Enables the "pixel moving" state and updates pixel position.
 */
Game_CharacterBase.prototype.startPixelMoving = function()
{
  // this character is moving.
  this.setMovePressed(true);

  // update the position for this character.
  this._recordPosition();
};

/**
 * Disables the "pixel moving" state and updates pixel position.
 */
Game_CharacterBase.prototype.stopPixelMoving = function()
{
  // this character isn't moving.
  this.setMovePressed(false);

  // update the position for this character.
  this._recordPosition();
};