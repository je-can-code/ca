//region Sprite_Character
/**
 * Extends the `initMembers()` function to include our new data.
 */
J.ABS.EXT.DANGER.Aliased.Sprite_Character.set('initMembers', Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * The danger indicator sprite for this character.
   * @type {Sprite_Icon}
   */
  this._j._dangerIndicator = null;

  // perform original logic.
  J.ABS.EXT.DANGER.Aliased.Sprite_Character.get('initMembers').call(this);
};

/**
 * Setup this `Sprite_Character` with the additional JABS-related functionalities.
 */
J.ABS.EXT.DANGER.Aliased.Sprite_Character.set('setupJabsSprite', Sprite_Character.prototype.setupJabsSprite);
Sprite_Character.prototype.setupJabsSprite = function()
{
  // perform original logic.
  J.ABS.EXT.DANGER.Aliased.Sprite_Character.get('setupJabsSprite').call(this);

  // if this is a battler, configure the visual components of the battler.
  this.handleBattlerSetup();

  // setup the danger indicator.
  this.setupDangerIndicator();
};

/**
 * Sets up the danger indicator sprite for this battler.
 */
Sprite_Character.prototype.setupDangerIndicator = function()
{
  // determine the icon index for this battler.
  const dangerIndicatorIcon = this.getDangerIndicatorIcon();

  // check if we already have an indicator present.
  if (this._j._dangerIndicator)
  {
    // overwrite the icon on it.
    this._j._dangerIndicator.setIconIndex(dangerIndicatorIcon);
  }
  // if we don't have an indicator, then build it.
  else
  {
    // create and assign the danger indicator sprite.
    this._j._dangerIndicator = this.createDangerIndicatorSprite(dangerIndicatorIcon);

    // add it to this sprite's tracking.
    this.addChild(this._j._dangerIndicator);
  }
};

/**
 * Creates the danger indicator sprite for this battler.
 * @returns {Sprite_Icon} The icon representing this danger indicator.
 */
Sprite_Character.prototype.createDangerIndicatorSprite = function(dangerIndicatorIcon)
{
  // instantiate the new sprite and hide it.
  const sprite = new Sprite_Icon(dangerIndicatorIcon);
  sprite.hide();

  // reduces scaling to draw the sprite smaller.
  sprite.scale.x = 0.5;
  sprite.scale.y = 0.5;

  // relocates the sprite to a better position.
  sprite.move(-50, 8);

  // return this created sprite.
  return sprite;
};

/**
 * Determines the iconIndex that indicates the danger level relative to the player and enemy.
 * @returns The icon index of the danger indicator icon.
 */
Sprite_Character.prototype.getDangerIndicatorIcon = function()
{
  // if a battler isn't on this sprite, then don't do it.
  const battler = this.getBattler();
  if (!battler) return -1;

  // if the sprite belongs to the player, then don't do it.
  const player = $jabsEngine.getPlayer1().getBattler();
  if (player === battler) return -1;

  // calculate the icon.
  return battler.getDangerIndicatorIcon();
};

/**
 * Extends `update()` to update the danger indicator.
 */
J.ABS.EXT.DANGER.Aliased.Sprite_Character.set('update', Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function()
{
  // perform original logic.
  J.ABS.EXT.DANGER.Aliased.Sprite_Character.get('update').call(this);

  // check if we can update the indicator.
  if (this.canUpdateDangerIndicator())
  {
    // update it.
    this.updateDangerIndicator();
  }
  // otherwise, if we can't update it...
  else
  {
    // hide it.
    this.hideDangerIndicator();
  }
};

/**
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
Sprite_Character.prototype.canUpdateDangerIndicator = function()
{
  // if we're not using JABS, then it shouldn't update.
  if (!this.canUpdate()) return false;

  // if this sprite doesn't have a battler, then it shouldn't update.
  if (!this.isJabsBattler()) return false;

  // if we aren't allowed to show the indicator, then it shouldn't update.
  if (!this._character.getJabsBattler().showDangerIndicator()) return false;

  // we should update!
  return true;
};

/**
 * Updates the danger indicator associated with this battler
 */
Sprite_Character.prototype.updateDangerIndicator = function()
{
  // show the indicator if we should be showing it.
  this.showDangerIndicator();
};

/**
 * Shows the danger indicator if it exists.
 */
Sprite_Character.prototype.showDangerIndicator = function()
{
  this._j._dangerIndicator.show();
};

/**
 * Hides the danger indicator if it exists.
 */
Sprite_Character.prototype.hideDangerIndicator = function()
{
  this._j._dangerIndicator.hide();
};
//endregion Sprite_Character