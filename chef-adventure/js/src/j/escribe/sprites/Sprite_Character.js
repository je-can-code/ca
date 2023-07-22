//region Sprite_Character
/**
 * Hooks into the initmembers function to add our properties.
 */
J.ESCRIBE.Aliased.Sprite_Character.set('initMembers', Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function()
{
  // perform original logic.
  J.ESCRIBE.Aliased.Sprite_Character.get('initMembers').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with escriptions.
   */
  this._j._event = {
    /**
     * A grouping of all properties associated with text-based escriptions.
     */
    _textDescribe: {
      /**
       * The text.
       * @type {string}
       */
      _text: String.empty,

      /**
       * The text sprite.
       * @type {Sprite_BaseText}
       */
      _sprite: null,

      /**
       * The proximity required to see this text.
       * -1 proximity means the text will always be visible while the character exists.
       * @type {number}
       */
      _proximity: -1,
    },
    /**
     * A grouping of all properties associated with icon-based escriptions.
     */
    _iconDescribe: {
      /**
       * The icon index.
       * @type {number}
       */
      _iconIndex: -1,

      /**
       * The icon sprite.
       * @type {Sprite_Icon}
       */
      _sprite: null,

      /**
       * The proximity required to see this icon.
       * -1 proximity means the icon will always be visible while the character exists.
       * @type {number}
       */
      _proximity: -1,
    },
  };
};

//region properties
/**
 * Gets the data related to the escription members.
 */
Sprite_Character.prototype.allEscriptionData = function()
{
  return this._j._event;
};

//region text properties
/**
 * Gets the data related to the text escription information.
 */
Sprite_Character.prototype.escribeTextData = function()
{
  const escriptionData = this.allEscriptionData();
  return escriptionData._textDescribe;
};

/**
 * Gets the text associated with the text escription.
 * @returns {string}
 */
Sprite_Character.prototype.escriptionText = function()
{
  const escriptionTextData = this.escribeTextData();
  return escriptionTextData._text;
};

/**
 * Sets the text associated with the text escription.
 * @params {string} text The new escription text.
 */
Sprite_Character.prototype.setEscriptionText = function(text)
{
  const escriptionTextData = this.escribeTextData();
  escriptionTextData._text = text;
};

/**
 * Gets the sprite associated with the text escription.
 * @returns {Sprite_BaseText|null}
 */
Sprite_Character.prototype.escriptionTextSprite = function()
{
  const escriptionTextData = this.escribeTextData();
  return escriptionTextData._sprite;
};

/**
 * Sets the sprite associated with the text escription.
 * @param {Sprite_BaseText} textSprite The new sprite containing the text.
 */
Sprite_Character.prototype.setEscriptionTextSprite = function(textSprite)
{
  const escriptionTextData = this.escribeTextData();
  escriptionTextData._sprite = textSprite;
};

/**
 * Gets the distance the player must be within in order for the text to be rendered.
 * If the value is -1, then the text can be seen from any distance.
 * @returns {number}
 */
Sprite_Character.prototype.escriptionTextProximity = function()
{
  const escriptionTextData = this.escribeTextData();
  return escriptionTextData._proximity;
};

/**
 * Sets the distance the player must be within in order for the text to be rendered.
 * If the value is -1, then the text can be seen from any distance.
 * @param {number} textProximity The proximity to see this text.
 */
Sprite_Character.prototype.setEscriptionTextProximity = function(textProximity)
{
  const escriptionTextData = this.escribeTextData();
  escriptionTextData._proximity = textProximity;
};
//endregion text properties

//region icon properties
/**
 * Gets the data related to the icon escription information.
 */
Sprite_Character.prototype.escribeIconData = function()
{
  const escriptionData = this.allEscriptionData();
  return escriptionData._iconDescribe;
};

/**
 * Gets the icon index associated with the icon escription.
 * @returns {number}
 */
Sprite_Character.prototype.escriptionIconIndex = function()
{
  const escriptionIconData = this.escribeIconData();
  return escriptionIconData._iconIndex;
};

/**
 * Gets the icon index associated with the icon escription.
 * @param {number} iconIndex The new icon index.
 */
Sprite_Character.prototype.setEscriptionIconIndex = function(iconIndex)
{
  const escriptionIconData = this.escribeIconData();
  escriptionIconData._iconIndex = iconIndex;
};

/**
 * Gets the sprite associated with the icon escription.
 * @returns {Sprite_Icon|null}
 */
Sprite_Character.prototype.escriptionIconSprite = function()
{
  const escriptionIconData = this.escribeIconData();
  return escriptionIconData._sprite;
};

/**
 * Sets the sprite associated with the icon escription.
 * @param {Sprite_Icon} iconSprite The new sprite containing the icon.
 */
Sprite_Character.prototype.setEscriptionIconSprite = function(iconSprite)
{
  const escriptionIconData = this.escribeIconData();
  escriptionIconData._sprite = iconSprite;
};

/**
 * Gets whether or not the player is in proximity to view the icon portion of the escription.
 * @returns {number}
 */
Sprite_Character.prototype.escriptionIconProximity = function()
{
  const escriptionIconData = this.escribeIconData();
  return escriptionIconData._proximity;
};

/**
 * Sets whether or not the player is in proximity to view the icon portion of the escription.
 * @param {number} iconProximity The proximity to see this icon.
 */
Sprite_Character.prototype.setEscriptionIconProximity = function(iconProximity)
{
  const escriptionIconData = this.escribeIconData();
  escriptionIconData._proximity = iconProximity;
};
//endregion icon properties
//endregion properties

//region helpers
/**
 * Checks whether or not this sprite has a character with escription data.
 * @returns {boolean}
 */
Sprite_Character.prototype.hasCharacterEscriptionData = function()
{
  // grab the character.
  const character = this.character();

  // if there is no character, then there is no escription data.
  if (!character) return false;

  // return the character's escription data.
  return character.hasEscribeData();
};

Sprite_Character.prototype.needsEscribeAdding = function()
{
  // grab the character.
  const character = this.character();

  // you cannot escribe non-existant characters.
  if (!character) return false;

  // you cannot escribe non-events.
  if (!character.isEvent()) return false;

  // if the character isn't an event, then there is no data.
  if (!(character instanceof Game_Event)) return false;

  // return whether or not the character needs escription adding.
  return character.needsEscribeAdding();
};

Sprite_Character.prototype.needsEscribeRemoval = function()
{
  // grab the character.
  const character = this.character();

  // if we no longer have a character and previously had escribe data, remove it.
  if ((this.escribeTextData() || this.escribeIconData()) && !character) return true;

  // if we no longer have a character, then remove it.
  if (!character) return true;

  // you cannot escribe non-events.
  if (!character.isEvent()) return false;

  // return whether or not the character needs escription removal.
  return character.needsEscribeRemoval();
};

/**
 * Gets this sprite's underlying character's escription data.
 * @returns {Escription|null}
 */
Sprite_Character.prototype.characterEscriptionData = function()
{
  // grab the character.
  const character = this.character();

  // if there is no character, then there is no escription data.
  if (!character) return null;

  // return the character's escription data.
  return character.escribeData();
};

/**
 * Checks whether or not this sprite's text is visible based on the player's proximity.
 * @returns {boolean}
 */
Sprite_Character.prototype.characterCanSeeText = function()
{
  // grab the character.
  const character = this.character();

  // if there is no character, then there is no text.
  if (!character) return false;

  // return based on proximity.
  return character.getPlayerNearbyForText();
};

/**
 * Checks whether or not this sprite's icon is visible based on the player's proximity.
 * @returns {boolean}
 */
Sprite_Character.prototype.characterCanSeeIcon = function()
{
  // grab the character.
  const character = this.character();

  // if there is no character, then there is no icon.
  if (!character) return false;

  // return based on proximity.
  return character.getPlayerNearbyForIcon();
};

/**
 * Extends {@link Sprite_Character.isEmptyCharacter}.
 * If the character has describe data, don't make it invisible for the time being.
 * @returns {boolean} True if the character should be drawn, false otherwise.
 */
J.ESCRIBE.Aliased.Sprite_Character.set('isEmptyCharacter', Sprite_Character.prototype.isEmptyCharacter);
Sprite_Character.prototype.isEmptyCharacter = function()
{
  // if we have describe data and the character is not erased, then we are not empty.
  if (this.hasCharacterEscriptionData() && !this.isErased()) return false;

  // perform original logic.
  return J.ESCRIBE.Aliased.Sprite_Character.get('isEmptyCharacter').call(this);
};

/**
 * Parses the event comments on the character that belongs to this sprite.
 */
Sprite_Character.prototype.refreshCharacterEscription = function()
{
  // grab the character.
  const character = this.character();

  // if there is no character, then there is no data.
  if (!character) return;

  // you cannot escribe non-events.
  if (!character.isEvent()) return;

  // parse the comments if there are any.
  character.refreshEscription();
};
//endregion helpers

//region setup describe sprites
/**
 * Extends {@link Sprite_Character.setCharacterBitmap}.
 * Sets up the initial escription sprites and renders them as applicable.
 */
J.ESCRIBE.Aliased.Sprite_Character.set('setCharacterBitmap', Sprite_Character.prototype.setCharacterBitmap);
Sprite_Character.prototype.setCharacterBitmap = function()
{
  // perform original logic.
  J.ESCRIBE.Aliased.Sprite_Character.get('setCharacterBitmap').call(this);

  // parse all the comments from the underlying sprite's character.
  this.refreshCharacterEscription();

  // check if they have describe data after parsing.
  if (this.hasCharacterEscriptionData())
  {
    // then also setup their escription sprites.
    this.setupEscribeSprites();
  }
};

/**
 * Sets up the visual components of the describe for this event.
 */
Sprite_Character.prototype.setupEscribeSprites = function()
{
  // setup the escription text and icon.
  this.setupDescribeText();
  this.setupDescribeIcon();

  // grab the character.
  const character = this.character();

  // acknowledge the addition of the escribe data.
  character.acknowledgeEscribeAddition();
};

/**
 * Sets up the describe text for this event.
 */
Sprite_Character.prototype.setupDescribeText = function()
{
  // check if we already have the sprite.
  if (this.children.includes(this.escriptionTextSprite()))
  {
    // destroy it before creating anew.
    this.removeEscriptionTextData();
  }

  // create the sprite.
  const sprite = this.createDescribeTextSprite();

  // set our sprite to this character.
  this.setEscriptionTextSprite(sprite);

  // add the sprite to tracking.
  this.addChild(sprite);
};

/**
 * Creates the describe text sprite for this event.
 * @returns {Sprite_BaseText}
 */
Sprite_Character.prototype.createDescribeTextSprite = function()
{
  // determine the describe data.
  const describe = this.characterEscriptionData();
  const describeText = describe.text();
  this.setEscriptionText(describeText);
  this.setEscriptionTextProximity(describe.proximityTextRange());

  // extract the x and character name from the underlying character.
  const { _realX, _characterName } = this.character();

  // build the text sprite.
  const sprite = new Sprite_BaseText()
    .setText(describeText)
    .setFontSize(14)
    .setAlignment(Sprite_BaseText.Alignments.Center)
    .setColor("#ffffff");

  // determine the location of the sprite.
  const x = _realX - (sprite.width / 2);
  const y = ImageManager.isBigCharacter(_characterName) ? -128 : -80;

  // relocate the sprite.
  sprite.move(x, y);

  // check if we need to handle proximity.
  if (this.escriptionTextProximity() > -1)
  {
    // turn the sprite invisible.
    sprite.opacity = 0;
  }

  // return the built sprite.
  return sprite;
};

/**
 * Sets up the describe icon for this event.
 */
Sprite_Character.prototype.setupDescribeIcon = function()
{
  // check if we already have the sprite.
  if (this.children.includes(this.escriptionIconSprite()))
  {
    // destroy it before creating anew.
    this.removeEscriptionIconData();
  }

  // create the sprite.
  const sprite = this.createDescribeIconSprite();

  // set our sprite to this character.
  this.setEscriptionIconSprite(sprite);

  // add the sprite to tracking.
  this.addChild(sprite);
};

/**
 * Creates the describe icon sprite for this event.
 * @returns {Sprite_Icon}
 */
Sprite_Character.prototype.createDescribeIconSprite = function()
{
  // determine the describe data.
  const describe = this.characterEscriptionData();
  const describeIconIndex = describe.iconIndex();
  this.setEscriptionIconIndex(describeIconIndex);
  this.setEscriptionIconProximity(describe.proximityIconRange());

  // extract the x and character name from the underlying character.
  const { _characterName } = this.character();

  // determine the location of the sprite.
  const x = 0 - (ImageManager.iconWidth / 2) - 4;
  let y = ImageManager.isBigCharacter(_characterName) ? -128 : -80;
  y -= 32;

  // build the sprite.
  const sprite = new Sprite_Icon(describeIconIndex);

  // relocate the sprite.
  sprite.move(x, y);

  // check if we need to handle proximity.
  if (this.escriptionIconProximity() > -1)
  {
    // turn the sprite invisible.
    sprite.opacity = 0;
  }

  // return the built sprite.
  return sprite;
};
//endregion setup describe sprites

/**
 * Refreshes the escription data for the underlying character's escription data.
 */
Sprite_Character.prototype.refreshEscriptionIfNeeded = function()
{
  // check if this sprite needs to remove the escription data.
  if (this.needsEscribeRemoval())
  {
    // remove it.
    this.removeEscriptions();
  }

  // check if this sprite needs to be added based on its escription data.
  if (this.needsEscribeAdding())
  {
    // add it.
    this.setupEscribeSprites();
  }
};

//region update describe sprites
/**
 * Hooks into the update function to update our describe sprites.
 */
J.ESCRIBE.Aliased.Sprite_Character.set('update', Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function()
{
  // perform original logic.
  J.ESCRIBE.Aliased.Sprite_Character.get('update').call(this);

  // manage the updates of the escriptions.
  this.updateEscriptions();
};

/**
 * The update loop for managing the addition/removal/visibility of escriptions.
 */
Sprite_Character.prototype.updateEscriptions = function()
{
  // refresh the escription data tracked on this sprite.
  this.refreshEscriptionIfNeeded();

  // check if the character has escribe data.
  if (this.hasCharacterEscriptionData())
  {
    // update the escription as-needed.
    this.updateEscribe();
  }
};

/**
 * Removes all escription data from this character sprite.
 */
Sprite_Character.prototype.removeEscriptions = function()
{
  // remove the text data.
  this.removeEscriptionTextData();

  // remove the icon data.
  this.removeEscriptionIconData();

  // grab the character.
  const character = this.character();

  // validate we have one before working on it.
  if (character)
  {
    // acknowledge the removal.
    character.acknowledgeEscribeRemoval();
  }
};

/**
 * Removes all escription text data.
 */
Sprite_Character.prototype.removeEscriptionTextData = function()
{
  // check if we already have the sprite.
  if (this.escriptionTextSprite())
  {
    // destroy it before removal.
    this.escriptionTextSprite().destroy();
  }

  // set the sprite back to null.
  this.setEscriptionTextSprite(null);

  // set the text to blank.
  this.setEscriptionText(String.empty);

  // set the proximity back to -1.
  this.setEscriptionTextProximity(-1);
};

/**
 * Removes all escription icon data.
 */
Sprite_Character.prototype.removeEscriptionIconData = function()
{
  // check if we already have the sprite.
  if (this.escriptionIconSprite())
  {
    // destroy it before removal.
    this.escriptionIconSprite().destroy();
  }

  // set the sprite back to null.
  this.setEscriptionIconSprite(null);

  // set the icon index back to default -1.
  this.setEscriptionIconIndex(-1);

  // set the proximity back to -1.
  this.setEscriptionIconProximity(-1);
};

/**
 * Updates all describe sprites where applicable.
 */
Sprite_Character.prototype.updateEscribe = function()
{
  // update the text escribe data.
  this.updateTextEscribe();

  // update the icon escribe data.
  this.updateIconEscribe();
};

/**
 * Manages the visibility of the describe text on this sprite's event.
 */
Sprite_Character.prototype.updateTextEscribe = function()
{
  // don't try to update text without any text.
  if (!this.escriptionText()) return;

  // don't worry about updating for non-proximity-based describe texts.
  if (this.escriptionIconProximity() < 0) return;

  if (this.characterCanSeeText())
  {
    this.fadeInEscribeText();
  }
  else
  {
    this.fadeOutEscribeText();
  }
};

/**
 * Fades out the describe text.
 */
Sprite_Character.prototype.fadeOutEscribeText = function()
{
  const sprite = this.escriptionTextSprite();
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
Sprite_Character.prototype.fadeInEscribeText = function()
{
  const sprite = this.escriptionTextSprite();
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
Sprite_Character.prototype.updateIconEscribe = function()
{
  // don't try to update icon without any icon.
  if (this.escriptionIconIndex() < 0) return;

  // don't worry about updating for non-proximity-based describe icons.
  if (this.escriptionIconProximity() < 0) return;

  if (this.characterCanSeeIcon())
  {
    this.fadeInEscribeIcon();
  }
  else
  {
    this.fadeOutEscribeIcon();
  }
};

/**
 * Fades in the describe icon.
 */
Sprite_Character.prototype.fadeOutEscribeIcon = function()
{
  const sprite = this.escriptionIconSprite();
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
Sprite_Character.prototype.fadeInEscribeIcon = function()
{
  const sprite = this.escriptionIconSprite();
  if (sprite.opacity === 255) return;

  if (sprite.opacity > 255)
  {
    sprite.opacity = 255;
    return;
  }

  sprite.opacity += 17;
};
//endregion update describe sprites
//endregion Sprite_Character