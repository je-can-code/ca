//#region Sprite_Character
/**
 * Hooks into the initmembers function to add our properties.
 */
J.ESCRIBE.Aliased.Sprite_Character.initMembers = Sprite_Character.prototype.initMembers;
Sprite_Character.prototype.initMembers = function()
{
  this._j = this._j || {};

  this._j._event = {
    _textDescribe: {
      _text: "",
      _sprite: null,
      _proximity: false,
    },
    _iconDescribe: {
      _iconIndex: -1,
      _sprite: null,
      _proximity: false,
    },
  };

  J.ESCRIBE.Aliased.Sprite_Character.initMembers.call(this);
};

/**
 * If the "character" has describe data, don't make it invisible for the time being.
 * @returns {boolean} True if the character should be drawn, false otherwise.
 */
J.ESCRIBE.Aliased.Sprite_Character.isEmptyCharacter = Sprite_Character.prototype.isEmptyCharacter;
Sprite_Character.prototype.isEmptyCharacter = function()
{
  if (this._character.hasDescribeData() && !this._character._erased)
  {
    return false;
  }
  else
  {
    return J.ESCRIBE.Aliased.Sprite_Character.isEmptyCharacter.call(this);
  }
};

//#region setup describe sprites
/**
 * Hooks into the `Sprite_Character.setCharacter` and sets up the visual components
 * of the describe for this event..
 */
J.ESCRIBE.Aliased.Sprite_Character.setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function()
{
  J.ESCRIBE.Aliased.Sprite_Character.setCharacterBitmap.call(this);
  this._character.parseEventComments();
  if (this._character.hasDescribeData())
  {
    this.setupDescribeSprites();
  }
};

/**
 * Sets up the visual components of the describe for this event.
 */
Sprite_Character.prototype.setupDescribeSprites = function()
{
  this.setupDescribeText();
  this.setupDescribeIcon();
};

/**
 * Sets up the describe text for this event.
 */
Sprite_Character.prototype.setupDescribeText = function()
{
  if (this.children.includes(this._j._event._textDescribe._sprite))
  {
    this._j._event._textDescribe._sprite.destroy();
  }

  this._j._event._textDescribe._sprite = this.createDescribeTextSprite();
  this.addChild(this._j._event._textDescribe._sprite);
};

/**
 * Creates the describe text sprite for this event.
 * @returns {Sprite_Text}
 */
Sprite_Character.prototype.createDescribeTextSprite = function()
{
  const describe = this._character.getDescribeData();
  const describeText = describe.text();
  this._j._event._textDescribe._text = describeText;
  this._j._event._textDescribe._proximity = describe.proximityTextRange();
  const sprite = new Sprite_Text(describeText, null, -4, "center", 100, 10);
  const x = -(sprite.width / 2);
  const y = ImageManager.isBigCharacter(this._character._characterName)
    ? -128
    : -80;
  sprite.move(x, y);
  if (this._j._event._textDescribe._proximity > -1)
  {
    sprite.opacity = 0;
  }
  return sprite;
};

/**
 * Sets up the describe icon for this event.
 */
Sprite_Character.prototype.setupDescribeIcon = function()
{
  if (this.children.includes(this._j._event._iconDescribe._sprite))
  {
    this._j._event._iconDescribe._sprite.destroy();
  }

  this._j._event._iconDescribe._sprite = this.createDescribeIconSprite();
  this.addChild(this._j._event._iconDescribe._sprite);
};

/**
 * Creates the describe icon sprite for this event.
 * @returns {Sprite_Icon}
 */
Sprite_Character.prototype.createDescribeIconSprite = function()
{
  const describe = this._character.getDescribeData();
  const describeIconIndex = describe.iconIndex();
  this._j._event._iconDescribe._iconIndex = describeIconIndex;
  this._j._event._iconDescribe._proximity = describe.proximityIconRange();
  const sprite = new Sprite_Icon(describeIconIndex);
  const x = -(sprite.width / 2);
  let y = ImageManager.isBigCharacter(this._character._characterName)
    ? -128
    : -80;
  if (this._j._event._textDescribe._text)
  {
    y -= 24;
  }
  sprite.move(x, y);
  if (this._j._event._iconDescribe._proximity > -1)
  {
    sprite.opacity = 0;
  }

  return sprite;
};
//#endregion setup describe sprites

//#region update describe sprites
/**
 * Hooks into the update function to update our describe sprites.
 */
J.ESCRIBE.Aliased.Sprite_Character.update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function()
{
  J.ESCRIBE.Aliased.Sprite_Character.update.call(this);
  if (this._character.hasDescribeData())
  {
    this.updateDescribe();
  }
};

/**
 * Updates all describe sprites where applicable.
 */
Sprite_Character.prototype.updateDescribe = function()
{
  this.updateTextDescribe();
  this.updateIconDescribe();
};

/**
 * Manages the visibility of the describe text on this sprite's event.
 */
Sprite_Character.prototype.updateTextDescribe = function()
{
  // don't try to update text without any text.
  if (!this._j._event._textDescribe._text) return;

  // don't worry about updating for non-proximity-based describe texts.
  if (this._j._event._textDescribe._proximity < 0) return;

  if (this._character.getPlayerNearbyForText())
  {
    this.fadeInDescribeText();
  }
  else
  {
    this.fadeOutDescribeText();
  }
};

/**
 * Fades out the describe text.
 */
Sprite_Character.prototype.fadeOutDescribeText = function()
{
  const sprite = this._j._event._textDescribe._sprite;
  if (sprite.opacity === 0) return;

  if (sprite.opacity < 0)
  {
    sprite.opacity = 0;
    return;
  }

  sprite.opacity -= 17;
};

/**
 * Fades in the describe text.
 */
Sprite_Character.prototype.fadeInDescribeText = function()
{
  const sprite = this._j._event._textDescribe._sprite;
  if (sprite.opacity === 255) return;

  if (sprite.opacity > 255)
  {
    sprite.opacity = 255;
    return;
  }

  sprite.opacity += 17;
};

/**
 * Manages visibility of the describe icon on this sprite's event.
 */
Sprite_Character.prototype.updateIconDescribe = function()
{
  // don't try to update icon without any icon.
  if (this._j._event._iconDescribe._iconIndex < 0) return;

  // don't worry about updating for non-proximity-based describe icons.
  if (this._j._event._iconDescribe._proximity < 0) return;

  if (this._character.getPlayerNearbyForIcon())
  {
    this.fadeInDescribeIcon();
  }
  else
  {
    this.fadeOutDescribeIcon();
  }
};

/**
 * Fades in the describe icon.
 */
Sprite_Character.prototype.fadeOutDescribeIcon = function()
{
  const sprite = this._j._event._iconDescribe._sprite;
  if (sprite.opacity === 0) return;

  if (sprite.opacity < 0)
  {
    sprite.opacity = 0;
    return;
  }

  sprite.opacity -= 17;
};

/**
 * Fades out the describe icon.
 */
Sprite_Character.prototype.fadeInDescribeIcon = function()
{
  const sprite = this._j._event._iconDescribe._sprite;
  if (sprite.opacity === 255) return;

  if (sprite.opacity > 255)
  {
    sprite.opacity = 255;
    return;
  }

  sprite.opacity += 17;
};
//#endregion update describe sprites
//#endregion Sprite_Character