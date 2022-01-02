//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 POPUPS] Enable text pops on the map.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * This plugin enables the ability to display text popups on the map.
 *
 * The text pops themselves were designed for use within JABS, but the
 * functionality was abstracted out and no longer relies on JABS to operate.
 * ============================================================================
 * BASIC USAGE:
 * If you are using JABS, then JABS already knows what to do to make use of
 * this functionality. Just add this plugin after/below JABS, and it'll work
 * with no additional adjustments.
 * ============================================================================
 * PLUGIN DEVELOPER USAGE:
 * If you want to leverage these text popups on the map to display your own
 * custom popup, either in an event or in your plugin, then the below steps
 * will help you accomplish that.
 *
 * Step 1) Get the Game_Character or subclass of Game_Character.
 * The character is the focal point of where a popup is displayed on the map.
 *
 * Step 1a) Getting the character inside an event command.
 * If you're in an event using the event command "Script", then you can use
 * this line:
 *    const character = $gameMap.event(this._eventId);
 * to retrieve the character for reference. "this._eventId" references the
 * executing event. If you wanted it to be on some other particular event, you
 * can swap in another event id instead.
 *
 * Step 1b) Getting the character inside a plugin.
 * If you're in a plugin, I'm afraid you'll need to sort out how to gain access
 * to the character you want yourself. You can peek into JABS code to see some
 * examples of how I fetched characters for display.
 *
 * Step 2) Building the popup.
 * Building the popup is fairly straight forward. You can use the
 * "TextPopBuilder" class to "build" a popup. It uses the builder pattern for
 * piecing together the relevant parts of the popup in a way that makes sense.
 * It also has some convenience presets for more commonly used popups, like
 * hp damage. A basic example of the textpopbuilder in-use would look like:
 *    const customPop = new TextPopBuilder("hello")
 *      .setIconIndex(87)
 *      .setTextColorIndex(27)
 *      .build();
 * which would result in the "customPop" variable to now contain a built
 * popup with the value of "hello", an icon to the left of index 87, and a
 * text color of 27 (see your message window for text color indices).
 *
 * Step 3) Add the pop and flag the character.
 * Once you have the character and built the text pop, you only need to add it
 * to the character and flag them for processing. Going with the above
 * examples, an end result from start to finish could look something like this:
 *
 *    const character = $gameMap.event(this._eventId);
 *    const customPop = new TextPopBuilder("hello")
 *      .setIconIndex(87)
 *      .setTextColorIndex(27)
 *      .build();
 *    character.addTextPop(customPop);
 *    character.setRequestTextPop();
 *
 * Or if you're in a plugin, the only real difference would be how the
 * character is retrieved, with the rest being the same.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.POPUPS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.POPUPS.Metadata =
  {
    /**
     * The name of this plugin.
     */
    Name: `J-ABS-TextPops`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

J.POPUPS.Aliased =
  {
    Game_Character: new Map(),
    Sprite_Character: new Map(),
    Sprite_Damage: new Map(),
  };
//#endregion Introduction

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

//#region Sprite_Character
/**
 * Hooks into `Sprite_Character.initMembers` and adds our initiation for damage sprites.
 */
J.POPUPS.Aliased.Sprite_Character.set('initMembers', Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function()
{
  /**
   * The master reference to the `_j` object containing all plugin properties.
   * @type {{}}
   */
  this._j ||= {};

  /**
   * This plugins' relevant data points.
   * @type {{}}
   */
  this._j._popups ||= {};

  /**
   * The currently tracked damage pops, like weapon attacks or skills.
   * @type {Sprite_Damage[]}
   */
  this._j._popups._damagePopSprites = [];

  /**
   * The currently tracked non-damage pops, like found loot or earned experience.
   * @type {Sprite_Damage[]}
   */
  this._j._popups._nonDamagePopSprites = [];

  J.POPUPS.Aliased.Sprite_Character.get('initMembers').call(this);
};

/**
 * Gets the underlying `Game_Character` that this sprite represents on the map.
 * @returns {Game_Character}
 */
Sprite_Character.prototype.character = function()
{
  return this._character;
};

/**
 * Determines whether or not this character has damage pops.
 * @returns {boolean} True if we have any, false otherwise.
 */
Sprite_Character.prototype.hasDamagePops = function()
{
  return this._j._popups._damagePopSprites.length > 0;
};

/**
 * Gets all damage pop sprites currently being tracked.
 * @returns {Sprite_Damage[]}
 */
Sprite_Character.prototype.getDamagePops = function()
{
  return this._j._popups._damagePopSprites;
};

/**
 * Determines whether or not this character has non damage pops.
 * @returns {boolean} True if we have any, false otherwise.
 */
Sprite_Character.prototype.hasNonDamagePops = function()
{
  return this._j._popups._nonDamagePopSprites.length > 0;
};

/**
 * Gets all non damage pop sprites currently being tracked.
 * @returns {Sprite_Damage[]}
 */
Sprite_Character.prototype.getNonDamagePops = function()
{
  return this._j._popups._nonDamagePopSprites;
};

/**
 * Cleans up the `undefined` or `null` damage pop sprites that are invalid.
 */
Sprite_Character.prototype.cleanupDamagePops = function()
{
  this._j._popups._damagePopSprites = this._j._popups._damagePopSprites.filter(pop => !!pop);
};

/**
 * Cleans up the `undefined` or `null` non damage pop sprites that are invalid.
 */
Sprite_Character.prototype.cleanupNonDamagePops = function()
{
  this._j._popups._nonDamagePopSprites = this._j._popups._nonDamagePopSprites.filter(pop => !!pop);
};

/**
 * Hooks into the `Sprite_Character.update` and adds our ABS updates.
 */
J.POPUPS.Aliased.Sprite_Character.set('update', Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function()
{
  // execute original update processing.
  J.POPUPS.Aliased.Sprite_Character.get('update').call(this);

  // effectively a subscription for creating new text pops on this character.
  this.processIncomingTextPops();

  // and perform the update for popups if it is.
  this.updateTextPops();
};

//#region incoming subscription
/**
 * Listens for a notification to process any new popups.
 */
Sprite_Character.prototype.processIncomingTextPops = function()
{
  // get the character we're working with.
  const character = this.character();

  // listen for notification to process any incoming popups.
  if (character.getRequestTextPop())
  {
    // create all incoming text pops!
    this.createIncomingTextPops();

    // end notification for new incoming popups.
    character.setRequestTextPop(false);
  }
};

/**
 * Processes all of the popups that a `Game_Character` currently has on them.
 */
Sprite_Character.prototype.createIncomingTextPops = function()
{
  // get the character we're working with.
  const character = this.character();

  // get all the popups to create.
  const newPopups = character.getTextPops();

  // assuming we actually have popups to create, create them.
  if (newPopups.length)
  {
    // iterate over each of the new popups and create them.
    newPopups.forEach(this.createIncomingTextPop, this);

    // after processing, remove them all.
    character.emptyDamagePops();
  }
};

/**
 * Creates a single incoming text pop.
 * @param {Map_TextPop} popup The popup data.
 */
Sprite_Character.prototype.createIncomingTextPop = function(popup)
{
  // configure the sprite associated with the popup.
  const sprite = TextPopSpriteManager.convert(popup);

  // add the sprites to their corresponding collections for tracking.
  if (sprite.isDamage())
  {
    this._j._popups._damagePopSprites.push(sprite);
  }
  else
  {
    this._j._popups._nonDamagePopSprites.push(sprite);
  }

  // add the sprite to the parent for visual tracking.
  this.parent.addChild(sprite);
};
//#endregion incoming subscription

//#region handle text pops
/**
 * Handle the updating and processing of text popups.
 */
Sprite_Character.prototype.updateTextPops = function()
{
  // check first if we even have damage pops to deal with.
  if (this.hasDamagePops())
  {
    // update damage-related popups, like skill damage, or healing, etc.
    this.updateDamagePops();
  }

  // check first if we even have non damage pops to deal with.
  if (this.hasNonDamagePops())
  {
    // update non-damage-related popups, like loot found, or experience earned, etc.
    this.updateNonDamagePops();
  }
};

//#region damage pops
/**
 * Updates all damage popup sprites on this character.
 */
Sprite_Character.prototype.updateDamagePops = function()
{
  // get all damage pops currently being tracked.
  const damagePops = this.getDamagePops();

  // iterate over each of the damage pops.
  const deletedPops = damagePops.map(this.updateDamagePop, this);

  // if we deleted things out of the original array...
  if (deletedPops.some(pop => pop === true))
  {
    // then update the original array with the cleansed one.
    this.cleanupDamagePops();
  }
};

/**
 * Updates a single damage pop.
 * @param {Sprite_Damage} damagePop A sprite representing the popup.
 * @param {number} index The index of the popup in the tracking collection.
 * @returns {boolean} True if the popup was also removed, false otherwise.
 */
Sprite_Character.prototype.updateDamagePop = function(damagePop, index)
{
  // tracker for whether or not this damage pop ended up getting deleted.
  let deleted = false;

  // process the sprite update for the damage pop.
  damagePop.update();

  // handle the pattern for motion that this popup will experience.
  this.updateDamagePopLocation(damagePop);

  // if the damage pop isn't playing anymore, handle that.
  if (!damagePop.isPlaying())
  {
    // completely remove the damage pop from tracking.
    this.removeDamagePop(damagePop, index);

    // toggle the flag for indicating we need to cleanse the collection.
    deleted = true;
  }

  // return whether or not we ended up deleting this pop.
  return deleted;
};

/**
 * Handles the motion that a popup goes through.
 * Open for extension.
 * @param {Sprite_Damage} damageSprite The damage sprite that is moving.
 */
Sprite_Character.prototype.updateDamagePopLocation = function(damageSprite)
{
  // update their x coordinate with the variance.
  damageSprite.x = this.x + 150 + damageSprite.getXVariance();

  // update their y coordinate with the variance.
  damageSprite.y = this.y + damageSprite.getYVariance();
};

/**
 * Removes a single damage pop from tracking.
 * @param {Sprite_Damage} damagePop A sprite representing the popup.
 * @param {number} index The index of the popup in the tracking collection.
 */
Sprite_Character.prototype.removeDamagePop = function(damagePop, index)
{
  // get all damage pops currently being tracked.
  const damagePops = this.getDamagePops();

  // remove it from the parent so it no longer shows up.
  this.parent.removeChild(damagePop);

  // officially destroy the damage pop sprite.
  damagePop.destroy();

  // purge the item from the tracking.
  delete damagePops[index];
};
//#endregion damage pops

//#region non-damage pops
/**
 * Updates all non-damage popup sprites on this character.
 */
Sprite_Character.prototype.updateNonDamagePops = function()
{
  // get all non damage pops currently being tracked.
  const nonDamagePops = this.getNonDamagePops();

  // iterate over each of the pops.
  const deletedPops = nonDamagePops.map(this.updateNonDamagePop, this);

  // check to see if we deleted anything from the original array.
  if (deletedPops.some(pop => pop === true))
  {
    // then update the original array with the cleansed one.
    this.cleanupNonDamagePops();
  }
};

/**
 * Updates a single non damage pop.
 * @param {Sprite_Damage} popup A sprite representing the popup.
 * @param {number} index The index of the popup in the tracking collection.
 * @returns {boolean} True if the popup was also removed, false otherwise.
 */
Sprite_Character.prototype.updateNonDamagePop = function(popup, index)
{
  // tracker for whether or not this popup ended up getting deleted.
  let deleted = false;

  // process the sprite update for the popup.
  popup.update();

  // handle the pattern for motion that this popup will experience.
  this.updateNonDamagePopLocation(popup);

  // if the pop isn't playing anymore, handle that.
  if (!popup.isPlaying())
  {
    // completely remove the popupfrom tracking.
    this.removeNonDamagePop(popup, index);

    // toggle the flag for indicating we need to cleanse the collection.
    deleted = true;
  }

  // return whether or not we ended up deleting this pop.
  return deleted;
};

/**
 * Handles the motion that a popup goes through.
 * Open for extension.
 * @param {Sprite_Damage} nonDamageSprite The popup that is moving.
 */
Sprite_Character.prototype.updateNonDamagePopLocation = function(nonDamageSprite)
{
  // update their x coordinate with the variance.
  nonDamageSprite.x = this.x + 150 + nonDamageSprite.getXVariance();

  // update their y coordinate with the variance.
  nonDamageSprite.y = this.y + nonDamageSprite.getYVariance();
};

/**
 * Removes a single damage pop from tracking.
 * @param {Sprite_Damage} popup A sprite representing the popup.
 * @param {number} index The index of the popup in the tracking collection.
 */
Sprite_Character.prototype.removeNonDamagePop = function(popup, index)
{
  // get all damage pops currently being tracked.
  const nonDamagePops = this.getNonDamagePops();

  // remove it from the parent so it no longer shows up.
  this.parent.removeChild(popup);

  // officially destroy the damage pop sprite.
  popup.destroy();

  // purge the item from the tracking.
  delete nonDamagePops[index];
};
//#endregion non-damage pops
//#endregion handle text pops
//#endregion Sprite_Character

//#region Sprite_Damage
/**
 * Extends this `.initialize()` function to include our parameters for all damage sprites.
 */
J.POPUPS.Aliased.Sprite_Damage.set('initialize', Sprite_Damage.prototype.initialize);
Sprite_Damage.prototype.initialize = function()
{
  J.POPUPS.Aliased.Sprite_Damage.get('initialize').call(this);
  this.initMembers();
};

/**
 * Initializes all members of this class.
 */
Sprite_Damage.prototype.initMembers = function()
{
  /**
   * The master reference to the `_j` object containing all plugin properties.
   * @type {{}}
   */
  this._j ||= {};

  /**
   * This plugins' relevant data points.
   * @type {{}}
   */
  this._j._popups ||= {};

  /**
   * Whether or not this damage is flagged as critical.
   * @type {boolean}
   */
  this._j._popups._isCritical = false;

  /**
   * Whether or not this damage is flagged as healing.
   * @type {boolean}
   */
  this._j._popups._isHealing = false;

  /**
   * Whether or not this sprite is actually a damage popup, or a non-damage popup.
   * @type {boolean}
   */
  this._j._popups._isDamage = false;

  /**
   * The text color index for this sprite's text.
   * @type {number}
   */
  this._j._popups._damageColor = 0;

  /**
   * The x coordinate variance on this sprite.
   * @type {number}
   */
  this._j._popups._xVariance = 0;

  /**
   * The y coordinate variance on this sprite.
   * @type {number}
   */
  this._j._popups._yVariance = 0;
};

/**
 * Gets whether or not this sprite is a damage popup.
 * @returns {boolean} True if it is a damage popup, false if it is a non-damage popup.
 */
Sprite_Damage.prototype.isDamage = function()
{
  return this._j._popups._isDamage;
};

/**
 * Sets the damage flag to the specified value.
 * @param {boolean} isDamage True if it is a damage popup, false if it is a non-damage popup.
 */
Sprite_Damage.prototype.setDamageFlag = function(isDamage)
{
  this._j._popups._isDamage = isDamage;
};

/**
 * Gets whether or not this sprite is a healing damage popup.
 * @returns {boolean} True if it is a healing damage pop, false otherwise.
 */
Sprite_Damage.prototype.isHealing = function()
{
  return this._j._popups._isHealing;
};

/**
 * Sets the healing flag to the specified value.
 * @param {boolean} isHealing True if it is a healing popup, false otherwise.
 */
Sprite_Damage.prototype.setHealingFlag = function(isHealing)
{
  this._j._popups._isHealing = isHealing;
};

/**
 * Get the x coordinate variance.
 * @returns {number}
 */
Sprite_Damage.prototype.getXVariance = function()
{
  // check if this is a healing popup.
  return this.isHealing()
    // if it is, return the Y variance instead.
    ? (this._j._popups._yVariance - 48)
    // otherwise, return the x variance as expected.
    : this._j._popups._xVariance;
};

/**
 * Set the x variance for this damage sprite.
 * @param {number} xVariance The x coordinate variance.
 */
Sprite_Damage.prototype.setXVariance = function(xVariance)
{
  this._j._popups._xVariance = xVariance;
};

/**
 * Get the y coordinate variance.
 * @returns {number}
 */
Sprite_Damage.prototype.getYVariance = function()
{
  // check if this is a healing popup.
  return this.isHealing()
    // if it is, return the X variance instead.
    ? this._j._popups._xVariance
    // otherwise, return the y variance as expected.
    : this._j._popups._yVariance;
};

/**
 * Set the y variance for this damage sprite.
 * @param {number} yVariance The y coordinate variance.
 */
Sprite_Damage.prototype.setYVariance = function(yVariance)
{
  this._j._popups._yVariance = yVariance;
};

/**
 * Extends `createChildSprite()` to add the additional properties to the child sprite.
 */
J.POPUPS.Aliased.Sprite_Damage.set('createChildSprite', Sprite_Damage.prototype.createChildSprite);
Sprite_Damage.prototype.createChildSprite = function(width, height)
{
  const sprite = J.POPUPS.Aliased.Sprite_Damage.get('createChildSprite').call(this, width, height);
  this.setupMotionData(sprite);
  return sprite;
};

/**
 * Sets up some additional variables
 * @param sprite
 */
Sprite_Damage.prototype.setupMotionData = function(sprite)
{
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 1;
  sprite.y = -40;
  sprite.dy = 0;
  sprite.zt = 0;
  sprite.ry = sprite.y;
  sprite.yf = 0;
  sprite.yf2 = 0;
  sprite.yf3 = 0;
  sprite.ex = false;
  sprite.bounceMaxX = sprite.x + 60;
};

/**
 * Assigns the provided value to be the text of this popup.
 * @param {string} value The value to display in the popup.
 */
Sprite_Damage.prototype.createValue = function(value)
{
  // create a sprite of the designated size.
  const w = 400;
  const h = this.fontSize();
  const sprite = this.createChildSprite(w, h);

  // setup the fontsize for the font.
  let fontSize = 20;

  // check if this is a critical value.
  if (this._j._popups._isCritical)
  {
    // critical values look bigger and bolder.
    fontSize += 12;
    sprite.bitmap.fontBold = true;
  }

  // check if it was miss/evade/parry.
  else if (value.includes("Missed") || value.includes("Evaded") || value.includes("Parry"))
  {
    // miss/evade/parry are a bit smaller and italic for effect.
    fontSize -= 6;
    sprite.bitmap.fontItalic = true;
  }

  // assign the new size.
  sprite.bitmap.fontSize = fontSize;

  // draw the text.
  sprite.bitmap.drawText(value, 32, 0, w, h, "left");
  sprite.dy = 0;
};

/**
 * Adds an icon to the damage sprite.
 * @param {number} iconIndex The id/index of the icon on the iconset.
 */
Sprite_Damage.prototype.addIcon = function(iconIndex)
{
  // create the sprite for the icon.
  const sprite = this.createChildSprite(ImageManager.iconWidth, ImageManager.iconHeight);

  // generate the bitmap for it based on the iconset.
  const bitmap = ImageManager.loadSystem("IconSet");

  // crop the chosen icon to be the only one.
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (iconIndex % 16) * pw;
  const sy = Math.floor(iconIndex / 16) * ph;

  // blit the icon onto the sprite's bitmap directly.
  sprite.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);

  // scale down the icon to be only 75% of the size.
  sprite.scale.x = 0.75;
  sprite.scale.y = 0.75;

  // adjust the location a bit.
  sprite.x -= 180;
  sprite.bounceMaxX -= 180;
  sprite.y += 15;
  sprite.dy = 0;
};

/**
 * Extends the duration of this sprite by the given amount in frames.
 * @param {number} extraDuration The amount to extend in frames.
 */
Sprite_Damage.prototype.addDuration = function(extraDuration)
{
  this._duration += extraDuration;
};

/**
 * OVERWRITE Replaces the damage updating with our own motion management.
 * @param {Sprite} sprite The sprite to udpate.
 */
Sprite_Damage.prototype.updateChild = function(sprite)
{
  // flashing always happens, sorry!
  sprite.setBlendColor(this._flashColor);

  // check if we're working with damage or non-damage sprites.
  if (this.isDamage())
  {
    // update damage sprites to be kinda bouncy.
    this.updateDamageSpriteMotion(sprite);
  }
  else
  {
    // update non-damage sprites to be mostly motionless aside from a small bounce.
    this.updateNonDamageSpriteMotion(sprite);
  }
};

/**
 * Updates the motion for the child of the non-damage sprite.
 * NOTE: This is actually just copy-paste of the default bounce/motion that RMMZ uses.
 * @param {Sprite} sprite The sprite to update.
 */
Sprite_Damage.prototype.updateNonDamageSpriteMotion = function(sprite)
{
  sprite.dy += 0.5;
  sprite.ry += sprite.dy;
  if (sprite.ry >= 0)
  {
    sprite.ry = 0;
    sprite.dy *= -0.6;
  }

  sprite.y = Math.round(sprite.ry);
};

/**
 * Updates the motion for the child of the damage sprite.
 * @param {Sprite} sprite The sprite to update.
 */
Sprite_Damage.prototype.updateDamageSpriteMotion = function(sprite)
{
  // check if the damage sprite is a healing sprite.
  if (this.isHealing())
  {
    this.flyawayDamageSpriteMotion(sprite);
  }
  else
  {
    this.defaultDamageSpriteMotion(sprite);
  }
};

/**
 * The default motion for RMMZ's damage sprite children.
 * The sprite bounces a little, and thats it.
 * @param {Sprite} sprite The sprite to move.
 */
Sprite_Damage.prototype.defaultDamageSpriteMotion = function(sprite)
{
  sprite.dy += 0.1;
  sprite.ry += sprite.dy;
  if (sprite.ry >= 0)
  {
    sprite.ry = 0;
    sprite.dy *= -0.8;
  }

  if (sprite.x < sprite.bounceMaxX)
  {
    sprite.x -= -0.7;
  }

  sprite.y = Math.round(sprite.ry);
};

/**
 * A custom motion for damage sprites.
 * Causes the damage sprite to fly vertically up and fade away.
 * @param {Sprite} sprite The sprite to move.
 */
Sprite_Damage.prototype.flyawayDamageSpriteMotion = function(sprite)
{
  sprite.yf3 -= 1;
  sprite.y = -sprite.yf2 + sprite.yf3;
  if (this._duration > 30)
  {
    sprite.opacity += 10;
  }
  else
  {
    sprite.opacity -= 10;
  }
};

/**
 * OVERWRITE Updates the duration to start fading later, and for longer.
 */
Sprite_Damage.prototype.updateOpacity = function()
{
  if (this._duration < 60)
  {
    this.opacity = (255 * this._duration) / 60;
  }
};

/**
 * Sets the color of the damage pop to be any of the text color indexes available.
 * @param {number} damageColor The new color index.
 */
Sprite_Damage.prototype.setDamageColor = function(damageColor)
{
  this._j._popups._damageColor = damageColor;
};

/**
 * OVERWRITE Replaces the color with a designated color on-creation.
 */
Sprite_Damage.prototype.damageColor = function()
{
  return ColorManager.textColor(this._j._popups._damageColor);
};

/**
 * Applies the flash effects and extends duration of this sprite if the damage is critical.
 */
J.POPUPS.Aliased.Sprite_Damage.set('setupCriticalEffect', Sprite_Damage.prototype.setupCriticalEffect);
Sprite_Damage.prototype.setupCriticalEffect = function()
{
  J.POPUPS.Aliased.Sprite_Damage.get('setupCriticalEffect').call(this);

  // confirm this is indeed a critical popup.
  this._j._popups._isCritical = true;

  // make the critical red flash stronger.
  this._flashColor[3] = 240;

  // extend the duration for all to see your critical glory!
  this.addDuration(60);
};
//#endregion Sprite_Damage

//#region TextPopSpriteManager
/**
 * A builder class for converting text pops to sprites.
 */
class TextPopSpriteManager
{
  /**
   * Constructor.
   * A static class though, so don't construct it or you'll throw an error.
   */
  constructor()
  {
    throw new Error(`The TextPopSpriteManager is a static class. Just use the "convert()" function on it.`);
  };

  /**
   * Converts a `Map_TextPop` into a `Sprite_Damage`.
   * @param {Map_TextPop} popup The popup to convert.
   * @returns {Sprite_Damage} The converted sprite.
   */
  static convert(popup)
  {
    // start by creating a blank damage sprite.
    const sprite = new Sprite_Damage();

    // add the x variance to the x coordinate for the base sprite.
    sprite.setXVariance(popup.coordinateVariance[0]);

    // add the y variance to the y coordinate for the base sprite.
    sprite.setYVariance(popup.coordinateVariance[1]);

    // check if there is an iconIndex present.
    if (popup.iconIndex > -1)
    {
      // add the found icon to the sprite.
      sprite.addIcon(popup.iconIndex);
    }

    // add duration bonus onto sprite.
    sprite.addDuration(this.#getDurationByPopupType(popup.popupType));

    // designate whether or not its a damage popup.
    sprite.setDamageFlag(this.#isDamageFlagByPopupType(popup.popupType));

    // set the healing flag to be what the popup designates.
    sprite.setHealingFlag(popup.healing);

    // set the color of the damage for the sprite.
    sprite.setDamageColor(popup.textColorIndex);

    // check if the popup was actually a critical skill usage.
    if (popup.critical)
    {
      // apply the fancy critical effects, such as flash color and duration.
      sprite.setupCriticalEffect();
    }

    // assign the text value to be displayed as the popup of the sprite.
    sprite.createValue(popup.value);

    // return the constructed sprite for the popup.
    return sprite;
  };

  /**
   * Gets the bonus duration based on the type of popup this is.
   * @param {Map_TextPop.Types} popupType The type of popup this is.
   * @returns {number} The bonus duration for this type.
   */
  static #getDurationByPopupType(popupType)
  {
    switch (popupType)
    {
      case Map_TextPop.Types.HpDamage:
      case Map_TextPop.Types.MpDamage:
      case Map_TextPop.Types.TpDamage:
        return 60;
      case Map_TextPop.Types.Experience:
      case Map_TextPop.Types.Gold:
      case Map_TextPop.Types.Sdp:
      case Map_TextPop.Types.Item:
        return 120;
      case Map_TextPop.Types.Learn:
        return 120;
      case Map_TextPop.Types.Levelup:
        return 180;
      case Map_TextPop.Types.Parry:
      case Map_TextPop.Types.SkillUsage:
      case Map_TextPop.Types.Slip:
        return 0;
      default:
        console.warn(`unsupported popup type of [${popupType}] found.`);
        return 0;
    }
  };

  /**
   * Checks whether or not the popup type is damage.
   * @param {Map_TextPop.Types} popupType The type of popup this is.
   * @returns {boolean} True if it is damage, false otherwise.
   */
  static #isDamageFlagByPopupType(popupType)
  {
    switch (popupType)
    {
      case Map_TextPop.Types.HpDamage:
      case Map_TextPop.Types.MpDamage:
      case Map_TextPop.Types.TpDamage:
        return true;
      default:
        return false;
    }
  };
}
//#endregion TextPopSpriteManager

//#region TextPopBuilder
/**
 * The fluent-builder for text pops on the map.
 */
class TextPopBuilder
{
  //#region properties
  /**
   * Whether or not this popup is the result of a critical skill usage.
   * @type {boolean}
   * @private
   */
  #isCritical = false;

  /**
   * Whether or not this popup is healing of some sort.
   * @type {boolean}
   * @private
   */
  #isHealing = false;

  /**
   * The icon index of the popup.<br/>
   * If none is provided, then this defaults to 0, which is no icon.
   * @type {number}
   * @private
   */
  #iconIndex = 0;

  /**
   * The text color index of the popup.<br/>
   * This doesn't apply to icon-only popups.<br/>
   * This is the same color index used in message windows and the like.
   * @type {number}
   * @private
   */
  #textColorIndex = 0;

  /**
   * The type of popup this is.
   * @type {Map_TextPop.Types}
   * @private
   */
  #popupType = Map_TextPop.Types.HpDamage;

  /**
   * This text will be prepended to the "value" portion of the popup.
   * @type {string}
   * @private
   */
  #prefix = String.empty;

  /**
   * The underlying base numeric value.
   * This is only applicable for numeric/damage popups.
   * @type {number}
   * @private
   */
  #baseValue = 0;

  /**
   * The base text value of the popup.<br/>
   * This may look like a number, but it will be treated as a string.
   * @type {string}
   * @private
   */
  #value = String.empty;

  /**
   * This text will be appended to the "value" portion of the popup.
   * @type {string}
   * @private
   */
  #suffix = String.empty;

  /**
   * The variance on the X coordinate for this popup.
   * @type {number}
   * @private
   */
  #xVariance = 0;

  /**
   * The variance on the Y coordinate for this popup.
   * @type {number}
   * @private
   */
  #yVariance = 0;
  //#endregion properties

  /**
   * Constructor.
   * @param {number|string} value The text or value to be displayed in the popup.
   */
  constructor(value)
  {
    // initializes the builder with a value.
    this.setValue(value);
  };

  /**
   * Builds the popup based on the currently provided info.
   * @returns {Map_TextPop}
   */
  build()
  {
    // actually construct the popup with whatever the current values are.
    const popup = new Map_TextPop({
      iconIndex: this.#iconIndex,
      textColorIndex: this.#textColorIndex,
      popupType: this.#popupType,
      critical: this.#isCritical,
      value: this.#makePopupValue(),
      coordinateVariance: this.#makeCoordinateVariance(),
      healing: this.#isHealing,
    });

    // clear out the just-built popup.
    this.#clear();

    // and return it.
    return popup;
  };

  /**
   * Clears the current parameters for this popup.<br/>
   * This automatically runs after `build()` is run.
   * @private
   */
  #clear()
  {
    this.#isCritical = false;
    this.#iconIndex = 0;
    this.#textColorIndex = 0;
    this.#popupType = Map_TextPop.Types.HpDamage;
    this.#prefix = String.empty;
    this.#value = String.empty;
    this.#suffix = String.empty;
    this.#xVariance = 0;
    this.#yVariance = 0;
  };

  /**
   * Creates the actual text value that will be on the popup.
   * Concatenates the prefix, value, and suffix, all together in that order.
   * @returns {string}
   * @private
   */
  #makePopupValue()
  {
    // if there is a hyphen in the value, it was probably a healing effect.
    if (this.#value.indexOf(`-`) !== -1)
    {
      // remove the hyphen.
      this.#value = this.#value.substring(1);
    }

    // concatenate the prefix + value + suffix to make the value.
    return `${this.#prefix}${this.#value}${this.#suffix}`;
  };

  /**
   * Puts together the x and y coordinate variances into a single `[x,y]` array.
   * @returns {[number, number]}
   */
  #makeCoordinateVariance()
  {
    return [this.#xVariance, this.#yVariance];
  };

  //#region setters
  /**
   * Sets the value of the text pop you are building.
   * @param {number|string} value The new value to replace the old one with.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setValue(value)
  {
    // setup the variable for the rounding if necessary.
    let underlyingValue;

    // check if the value is actually a number.
    if (Number(value) === value)
    {
      // if its a number, round it because javascript decimals are stupid.
      underlyingValue = value > 0
        ? Math.ceil(value)
        : Math.floor(value);

      // and update the base value with this new value for math reasons!
      this.#updateBaseValue(underlyingValue);
    }
    // if the check fails and its not a number...
    else
    {
      // then just leave it as-is.
      underlyingValue = value;

      // and assign the base value to be 0.
      this.#updateBaseValue(0);
    }

    // track the primary text value as a string.
    this.#value = underlyingValue.toString();

    // return this builder for fluent construction of pops.
    return this;
  };

  /**
   * Updates the underlying base value of the text popup.
   * This is only used by numeric/damage popups.
   * @param {number} value The base value.
   * @private
   */
  #updateBaseValue(value)
  {
    // update the base value with the value.
    // this has already been validated.
    this.#baseValue = value;

    // check if the value is negative.
    if (value < 0)
    {
      // set the healing flag for negative values.
      this.setHealing(true);
    }
  };

  /**
   * Sets whether or not this popup is a critical skill usage.
   * @param {boolean} isCritical Whether or not this popup is critical.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setCritical(isCritical = true)
  {
    this.#isCritical = isCritical;
    return this;
  };

  /**
   * Sets whether or not this popup is healing.
   * Normally this is set automatically by the constructor and/or by the `setValue()` call.
   * @param [isHealing=true] {boolean} isHealing True if this is healing, false otherwise.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setHealing(isHealing = true)
  {
    this.#isHealing = isHealing;
    return this;
  };

  /**
   * Sets the icon index of the popup to the provided index.
   * This is the same icon index you can find in the RM editor.
   * If none is set, there will be no icon displayed.
   * @param {number} iconIndex The icon index to set.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setIconIndex(iconIndex)
  {
    this.#iconIndex = iconIndex;
    return this;
  };

  /**
   * Sets the text color index of the popup to the provided index.
   * This is the same index used in message windows and the like.
   * @param {number} textColorIndex The text color index to set.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setTextColorIndex(textColorIndex)
  {
    this.#textColorIndex = textColorIndex;
    return this;
  };

  /**
   * Sets the popup type of the popup to the provided type.
   * @param {Map_TextPop.Types} popupType The type of popup this is.
   * @returns {TextPopBuilder}
   */
  setPopupType(popupType)
  {
    this.#popupType = popupType;
    return this;
  };

  /**
   * Set the prefix of the text popup to the given value.
   * @param {string} prefix The prefix to prepend to the value.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setPrefix(prefix)
  {
    this.#prefix = prefix;
    return this;
  };

  /**
   * Set the suffix of the text popup to the given value.
   * @param {string} suffix The suffix to append to the value.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setSuffix(suffix)
  {
    this.#suffix += suffix;
    return this;
  };

  /**
   * Sets the x variance coordinate for this popup.
   * @param {number} xVariance The x variance.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setXVariance(xVariance)
  {
    this.#xVariance = xVariance;
    return this;
  };

  /**
   * Sets the y variance coordinate for this popup.
   * @param {number} yVariance The y variance.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setYVariance(yVariance)
  {
    this.#yVariance = yVariance;
    return this;
  };

  /**
   * Sets both the x and y variance coordinates for this popup.
   * Under the covers, this simply executes both individual set functions
   * for the x and y coordinates.
   * @param {number} xVariance The x variance.
   * @param {number} yVariance The y variance.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setCoordinateVariance(xVariance, yVariance)
  {
    this.setXVariance(xVariance);
    this.setYVariance(yVariance);
    return this;
  };
  //#endregion setters

  //#region presets
  /**
   * Changes the suffix based on elemental efficicacy associated with a damage pop.
   * @param {number} elementalRate The elemental factor, such as 0.4 or 1.75.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isElemental(elementalRate)
  {
    // check if the rate is below 1, such as 0.3 aka 30% damage.
    if (elementalRate < 1)
    {
      // add an arbitrary elipses at the end of the damage.
      this.setSuffix("...");
    }
    // check if the rate is above 1, such as 1.5 aka 150% damage.
    else if (elementalRate > 1)
    {
      // add an arbitrary triple bang at the end of the damage.
      this.setSuffix("!!!");
    }

    // return the builder for continuous building.
    return this;
  };

  /**
   * An internal collection of hp/mp/tp damage and healing text color indices.
   */
  #textColors = {
    /**
     * The text color index for HP damage.
     * @returns {number}
     */
    hpDamage: 0,

    /**
     * The text color index for HP healing.
     * @returns {number}
     */
    hpHealing: 21,

    /**
     * The text color index for MP damage.
     * @returns {number}
     */
    mpDamage: 5,

    /**
     * The text color index for MP healing.
     * @returns {number}
     */
    mpHealing: 23,

    /**
     * The text color index for TP damage.
     * @returns {number}
     */
    tpDamage: 19,

    /**
     * The text color index for TP healing.
     * @returns {number}
     */
    tpHealing: 29,
  };

  /**
   * Add some convenient defaults for configuring hp damage.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isHpDamage()
  {
    // set the popup type to be hp damage.
    this.setPopupType(Map_TextPop.Types.HpDamage);

    // check if the underlying value is negative or positive to determine color.
    if (this.#baseValue !== 0)
    {
      // if positive, it must be damage.
      if (!this.#isHealing)
      {
        // set it to the hp damage color.
        this.setTextColorIndex(this.#textColors.hpDamage);

        // add no y variance when working with hp damage.
        this.setYVariance(0);
      }
      // if negative, it must be healing.
      else
      {
        // set it to the hp healing color.
        this.setTextColorIndex(this.#textColors.hpHealing);

        // add some y variance when working with hp damage.
        this.setYVariance(16);

        // add a plus because we know its healing.
        this.setPrefix(`+`);
      }
    }

    // return the builder for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuring mp damage.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isMpDamage()
  {
    // set the popup type to be mp damage.
    this.setPopupType(Map_TextPop.Types.MpDamage);

    // check if the underlying value is negative or positive to determine color.
    if (this.#baseValue !== 0)
    {
      // if positive, it must be damage.
      if (!this.#isHealing)
      {
        // set it to the hp damage color.
        this.setTextColorIndex(this.#textColors.mpDamage);

        // add some y variance when working with mp damage.
        this.setYVariance(32);
      }
      // if negative, it must be healing.
      else
      {
        // set it to the mp healing color.
        this.setTextColorIndex(this.#textColors.mpHealing);

        // add some y variance when working with mp healing.
        this.setYVariance(48);

        // add a plus because we know its healing.
        this.setPrefix(`+`);
      }
    }

    // return the builder for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuring tp damage.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isTpDamage()
  {
    // set the popup type to be tp damage.
    this.setPopupType(Map_TextPop.Types.TpDamage);

    // check if the underlying value is negative or positive to determine color.
    if (this.#baseValue !== 0)
    {
      // if positive, it must be damage.
      if (!this.#isHealing)
      {
        // set it to the tp damage color.
        this.setTextColorIndex(this.#textColors.tpDamage);

        // add some y variance when working with tp damage.
        this.setYVariance(64);
      }
      // if negative, it must be healing.
      else
      {
        // set it to the tp healing color.
        this.setTextColorIndex(this.#textColors.tpHealing);

        // add some y variance when working with tp healing.
        this.setYVariance(80);

        // add a plus because we know its healing.
        this.setPrefix(`+`);
      }
    }

    // return the builder for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuration earned experience popups.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isExperience()
  {
    // set the popup type to be experience.
    this.setPopupType(Map_TextPop.Types.Experience);

    // set the text color to be a light-yellow.
    this.setTextColorIndex(6);

    // set the icon to our experience icon.
    this.setIconIndex(125);

    // add some x variance when working with experience.
    this.setXVariance(-16);

    // add some y variance when working with experience.
    this.setYVariance(32);

    // return the builder for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuration found gold popups.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isGold()
  {
    // set the popup type to be experience.
    this.setPopupType(Map_TextPop.Types.Gold);

    // set the text color to be a dark-yellow.
    this.setTextColorIndex(14);

    // set the icon to our experience icon.
    this.setIconIndex(2048);

    // add some x variance when working with gold.
    this.setXVariance(-8);

    // add some y variance when working with gold.
    this.setYVariance(48);

    // return the builder for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuring SDP points popups.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isSdpPoints()
  {
    // set the popup type to be an SDP point acquisition.
    this.setPopupType(Map_TextPop.Types.Sdp);

    // set the text color to be lovely pink.
    this.setTextColorIndex(17);

    // set the icon index to the learned skill's icon.
    this.setIconIndex(306);

    // add no x variance when working with sdp points.
    this.setXVariance(0);

    // add some y variance when working with sdp points.
    this.setYVariance(64);

    // return the builder for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuration collected loot popups.
   * @param {number} y The y coordinate.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isLoot(y = 64)
  {
    // set the popup type to be experience.
    this.setPopupType(Map_TextPop.Types.Item);

    // set the text color to be system blue.
    this.setTextColorIndex(1);

    // add some x variance when working with experience.
    this.setXVariance(32);

    // add some y variance when working with experience.
    this.setYVariance(y);

    // return the builder for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuring level up popups.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isLevelUp()
  {
    // set the popup type to be a level up.
    this.setPopupType(Map_TextPop.Types.Levelup);

    // set the text color to be mint green.
    this.setTextColorIndex(24);

    // set the icon index to our level up icon.
    this.setIconIndex(86);

    // return the builder for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuring skill used popups.
   * @param {number} skillIconIndex The icon index of the skill.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isSkillUsed(skillIconIndex)
  {
    // set the popup type to be a skill used.
    this.setPopupType(Map_TextPop.Types.SkillUsage);

    // set the text color to be dark-grey.
    this.setTextColorIndex(7);

    // set the icon index to the used skill's icon.
    this.setIconIndex(skillIconIndex);

    // add some x variance when working with experience.
    this.setXVariance(64);

    // return the builder for fluent chaining.
    return this;
  };

  /**
   * Add some convenient defaults for configuring skill learned popups.
   * @param {number} skillIconIndex The icon index of the skill.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  isSkillLearned(skillIconIndex)
  {
    // set the popup type to be a skill learned.
    this.setPopupType(Map_TextPop.Types.Learn);

    // set the text color to be lovely pink.
    this.setTextColorIndex(27);

    // set the icon index to the learned skill's icon.
    this.setIconIndex(skillIconIndex);

    // add a suffix to indicate the skill was learned.
    this.setSuffix(` LEARNED!`);

    // add some y variance when working with experience.
    this.setYVariance(32);

    // return the builder for fluent chaining.
    return this;
  };
  //#endregion presents
}
//#endregion TextPopBuilder

//#region Map_TextPop
/**
 * A class representing a single popup on the map.
 */
function Map_TextPop()
{
  this.initialize(...arguments);
}
Map_TextPop.prototype = {};
Map_TextPop.prototype.constructor = Map_TextPop;

/**
 * A static collection of all types associated with text pops.
 */
Map_TextPop.Types = {
  /**
   * The popup type of "hp-damage", for displaying hp damage pops.
   */
  HpDamage: 'hp-damage',

  /**
   * The popup type of "mp-damage", for displaying mp damage pops.
   */
  MpDamage: 'mp-damage',

  /**
   * The popup type of "tp-damage", for displaying tp damage pops.
   */
  TpDamage: 'tp-damage',

  /**
   * The popup type of "evade", for evasion pops.
   * Though, these aren't officially supported by JABS.
   */
  Evade: 'evade',

  /**
   * The popup type of "parry", for when a skill was used, but also parried.
   */
  Parry: 'parry',

  /**
   * The popup type of "experience", for displaying gained experience pops.
   */
  Experience: 'exp',

  /**
   * The popup type of "gold", for displaying earned gold pops.
   */
  Gold: 'gold',

  /**
   * The popup type of "levelup", for displaying levelups pops.
   */
  Levelup: 'levelup',

  /**
   * The popup type of "item", for displaying loot pops.
   */
  Item: 'item',

  /**
   * The popup type of "slip", for displaying pops generated by slip damage/healing.
   */
  Slip: 'slip',

  /**
   * The popup type of "skillLearn", for displaying skills learned as a pop.
   */
  Learn: 'skillLearn',

  /**
   * The popup type of "sdp", for displaying SDP points earned after defeating foes.
   */
  Sdp: 'sdp',

  /**
   * The popup type of "skillUsage", for displaying used skills as popups off the battlers on the map.
   */
  SkillUsage: 'skillUsage',
};

/**
 * Builds the text pop based on the given parameters.
 */
Map_TextPop.prototype.initialize = function({
  iconIndex,
  textColorIndex,
  popupType,
  value,
  critical,
  coordinateVariance,
  healing,
}) {
  /**
   * The id of the icon to display alongside this `Map_TextPop`.
   * @type {number}
   */
  this.iconIndex = iconIndex;

  /**
   * The color index for the text color.
   * @type {number}
   */
  this.textColorIndex = textColorIndex;

  /**
   * The type of popup this is, such as damage, experience, loot, etc.
   * @type {Map_TextPop.Types}
   */
  this.popupType = popupType;

  /**
   * The value to display on the sprite for this popup.
   * @type {string}
   */
  this.value = value || String.empty;

  /**
   * Whether or not this popup is critical.
   * For non-damage popups, this is always false.
   * @type {boolean}
   */
  this.critical = critical || false;

  /**
   * The x and y coordinate variances into a single `[x,y]` array.
   * @type {[number, number]}
   */
  this.coordinateVariance = coordinateVariance;

  /**
   * Whether or not this popup is healing.
   * Healing popups' motion is handled a bit differently.
   * @type {boolean}
   */
  this.healing = healing;
};
//#endregion Map_TextPop

//ENDOFFILE