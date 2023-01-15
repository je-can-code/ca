//region Sprite_Character
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

//region incoming subscription
/**
 * Listens for a notification to process any new popups.
 */
Sprite_Character.prototype.processIncomingTextPops = function()
{
  // get the character we're working with.
  const character = this.character();

  // listen for notification to process any incoming popups.
  if (character.hasTextPops())
  {
    // create all incoming text pops!
    this.createIncomingTextPops();

    // end notification for new incoming popups.
    character.acknowledgeTextPops();
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
//endregion incoming subscription

//region handle text pops
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

//region damage pops
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
//endregion damage pops

//region non-damage pops
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
//endregion non-damage pops
//endregion handle text pops
//endregion Sprite_Character