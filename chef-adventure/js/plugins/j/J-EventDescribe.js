//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 DESC] Enables "describing" the event with some text and/or an icon.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This plugin allows the functionality to have events with text and/or icons
 * over them. These can also be only visible when the player is within a
 * specified distance from the event.
 * 
 * In order to utilize this functionality, add a comment to an event with one
 * of the following tags below to create text/icons that show up on the event:
 * 
 * <text:EVENT_TEXT>
 * Where EVENT_TEXT is whatever text you want to show on this event.
 * 
 * <icon:ICON_INDEX>
 * Where ICON_INDEX is the icon index of the icon to show on this event.
 * 
 * <proximityText>
 * or
 * <proximityText:DISTANCE>
 * Where DISTANCE is the distance in tiles/squares that the player must be 
 * within in order to see the text on this event. If using the tag without
 * DISTANCE, then the DISTANCE will default to 0, meaning the player must be 
 * standing ontop of the event in order for the text to show up.
 * 
 * <proximityIcon>
 * or
 * <proximityIcon:DISTANCE>
 * Where DISTANCE is the distance in tiles/squares that the player must be 
 * within in order to see the icon on this event. If using the tag without
 * DISTANCE, then the DISTANCE will default to 0, meaning the player must be 
 * standing ontop of the event in order for the icon to show up.
 * ============================================================================
 * NOTE:
 * Proximity tags are optional. If they are not added to the event alongside
 * the text or icon tag, then the text/icon will always be visible while the
 * event is visible on the map.
 * ============================================================================
*/

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DESCRIBE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DESCRIBE.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-EventDescribe`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The collection of all aliased classes for extending.
 */
J.DESCRIBE.Aliased = {
  Game_Character: {},
  Game_Event: {},
  Game_Player: {},
  Sprite_Character: {},
};
//#endregion Introduction

//#region Game objects
//#region Game_Character
/**
 * Creates the method for overwriting by subclasses.
 * At this level, it will return false for non-events.
 * @returns {boolean}
 */
Game_Character.prototype.hasDescribeData = function()
{
  return false;
};

/**
 * Creates the method for overwriting by subclasses.
 * At this level, it will return null for non-events.
 * @returns {boolean}
 */
Game_Character.prototype.getDescribeData = function()
{
  return null;
};

/**
 * Creates the method for overwriting by subclasses.
 * At this level, it will do nothing.
 */
Game_Character.prototype.parseEventComments = function()
{
  // do nothing.
};
//#endregion Game_Character

//#region Game_Event
/**
 * Hooks into the initialization to add our members for containing event data.
 */
J.DESCRIBE.Aliased.Game_Event.initMembers = Game_Event.prototype.initMembers;
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
     * @type {Event_Describe}
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
  J.DESCRIBE.Aliased.Game_Event.initMembers.call(this);
};

/**
 * Extends the page settings for events and adds on custom parameters to this event.
 */
J.DESCRIBE.Aliased.Game_Event.setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function()
{
  this.parseEventComments();
  J.DESCRIBE.Aliased.Game_Event.setupPage.call(this);
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
    const describe = new Event_Describe(text, iconIndex, proximityText, proximityIcon);
    this._j._event._describe = describe;
  }
};

/**
 * Gets the describe data for this event.
 * @returns {Event_Describe}
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
J.DESCRIBE.Aliased.Game_Event.update = Game_Event.prototype.update;
Game_Event.prototype.update = function()
{
  J.DESCRIBE.Aliased.Game_Event.update.call(this);
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
//#endregion Game objects

//#region Sprite objects
//#region Sprite_Character
/**
 * Hooks into the initmembers function to add our properties.
 */
J.DESCRIBE.Aliased.Sprite_Character.initMembers = Sprite_Character.prototype.initMembers;
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

  J.DESCRIBE.Aliased.Sprite_Character.initMembers.call(this);
};

/**
 * If the "character" has describe data, don't make it invisible for the time being.
 * @returns {boolean} True if the character should be drawn, false otherwise.
 */
J.DESCRIBE.Aliased.Sprite_Character.isEmptyCharacter = Sprite_Character.prototype.isEmptyCharacter;
Sprite_Character.prototype.isEmptyCharacter = function()
{
  if (this._character.hasDescribeData() && !this._character._erased)
  {
    return false;
  }
  else
  {
    return J.DESCRIBE.Aliased.Sprite_Character.isEmptyCharacter.call(this);
  }
};

//#region setup describe sprites
/**
 * Hooks into the `Sprite_Character.setCharacter` and sets up the visual components
 * of the describe for this event..
 */
J.DESCRIBE.Aliased.Sprite_Character.setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function()
{
  J.DESCRIBE.Aliased.Sprite_Character.setCharacterBitmap.call(this);
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
J.DESCRIBE.Aliased.Sprite_Character.update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function()
{
  J.DESCRIBE.Aliased.Sprite_Character.update.call(this);
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
//#endregion Sprite objects

//#region Custom classes
//#region Event_Describe
/**
 * A single "describe" class which contains various data to describe this event on the map.
 */
function Event_Describe()
{
  this.initialize(...arguments);
};
Event_Describe.prototype = {};
Event_Describe.prototype.constructor = Event_Describe;

/**
 * Initializes the data about the event's describe.
 * @param {string} text The text to show on this event.
 * @param {number} iconIndex The index of the icon to show on this event.
 * @param {number} proximityTextRange The distance required for the describe text to be visible.
 * @param {number} proximityIconRange The distance required for the describe icon to be visible.
 */
Event_Describe.prototype.initialize = function(
  text, iconIndex, proximityTextRange, proximityIconRange
)
{
  this._text = text;
  this._iconIndex = iconIndex;
  this._proximityText = proximityTextRange;
  this._proximityIcon = proximityIconRange;
};

/**
 * Gets the text associated with this describe.
 * @returns {string}
 */
Event_Describe.prototype.text = function()
{
  return this._text;
};

/**
 * Gets the icon index associated with this describe.
 * @returns {number}
 */
Event_Describe.prototype.iconIndex = function()
{
  return this._iconIndex;
};

/**
 * Gets the distance required for this describe text to be visible.
 * Returns -1 when there is no proximity requirement.
 * @returns {number}
 */
Event_Describe.prototype.proximityTextRange = function()
{
  return this._proximityText;
};

/**
 * Gets the distance required for this describe icon to be visible.
 * Returns -1 when there is no proximity requirement.
 * @returns {number}
 */
Event_Describe.prototype.proximityIconRange = function()
{
  return this._proximityIcon;
};
//#endregion Event_Describe
//#endregion Custom classes

//ENDOFFILE