//region Sprite_InputKeySlot
/**
 * A single sprite that owns the drawing and management of a single input key slot.
 */
class Sprite_InputKeySlot extends Sprite
{
  /**
   * Extend initialization of the sprite to assign a skill slot for tracking.
   * @param {JABS_SkillSlot|null} skillSlot The skill slot to track the name of.
   * @param {Game_Actor|Game_Enemy|null} battler The battler that owns this slot.
   */
  initialize(skillSlot = null, battler = null)
  {
    // perform original logic.
    super.initialize();

    // add our extra data points to track.
    this.initMembers();

    // setup this input key slot sprite.
    this.setup(skillSlot, battler);
  }

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * The skill slot associated with this sprite.
     * @type {JABS_SkillSlot|null}
     */
    this._j._skillSlot = null;

    /**
     * The battler associated with the skill slot.
     * Used for deriving skill costs and skill extensions.
     * @type {Game_Actor|Game_Enemy|null}
     */
    this._j._battler = null;

    /**
     * The cached collection of sprites.
     * @type {Map<string, Sprite_SkillSlotIcon|Sprite_SkillName|Sprite_SkillCost|Sprite_CooldownGauge>}
     */
    this._j._spriteCache = new Map();
  }

  /**
   * Sets up this sprite with the given skill slot and owning battler.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track.
   * @param {JABS_Battler} battler The battler owning the skill slot.
   */
  setup(skillSlot, battler)
  {
    // assign the given skill slot.
    this.setSkillSlot(skillSlot);

    // assign the given battler.
    this.setBattler(battler);

    // draw the sprite!
    this.drawInputKey();
  }

  //region getters & setters
  /**
   * Gets the assigned skill slot.
   * @returns {JABS_SkillSlot|null}
   */
  skillSlot()
  {
    return this._j._skillSlot;
  }

  /**
   * Checks whether or not there is a skill slot currently assigned.
   * @returns {boolean}
   */
  hasSkillSlot()
  {
    return !!this._j._skillSlot;
  }

  /**
   * Assigns the given skill slot to this sprite.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track.
   */
  setSkillSlot(skillSlot)
  {
    this._j._skillSlot = skillSlot;
  }

  /**
   * Get the cooldown data associated with the battler that owns
   * this skill slot.
   * @returns {JABS_Cooldown|null}
   */
  cooldownData()
  {
    // if we have no slot data, then we have no cooldown data.
    if (!this.hasSkillSlot()) return null;

    const jabsBattler = this.jabsBattler();

    if (!jabsBattler) return null;

    const inputType = this.skillSlot().key;

    // grab the cooldown data from the leader based on this slot.
    return jabsBattler.getCooldown(inputType);
  }

  /**
   * Gets the skill (or item) id of the assigned ability of this skill slot.
   * Accommodates the possibility of
   * @returns {number}
   */
  skillId()
  {
    // the base id is of the skill slot's id.
    const skillId = this.skillSlot().id;

    // if it is an item, then the base skill id is the only id.
    if (this.skillSlot().isItem()) return skillId;

    // grab the cooldown data for this skill.
    const cooldownData = this.cooldownData();

    // if there is none, then return the default.
    if (!cooldownData) return skillId;

    // see if we should be grabbing the next combo skill, or this skill.
    const hasNextSkill = cooldownData.comboNextActionId > 0;
    return hasNextSkill
      ? cooldownData.comboNextActionId  // return the next skill in the combo.
      : skillId;                        // return the current skill.
  }

  /**
   * Gets the `JABS_Battler` this input key slot is associated with.
   * @returns {JABS_Battler|null}
   */
  jabsBattler()
  {
    return this._j._battler;
  }

  /**
   * Gets the `Game_Battler` associated with the `JABS_Battler` assigned to this sprite.
   * @returns {Game_Actor|Game_Enemy}
   */
  battler()
  {
    return this.jabsBattler().getBattler();
  }

  /**
   * Checks whether or not there is a battler currently assigned.
   * @returns {boolean}
   */
  hasBattler()
  {
    return !!this._j._battler;
  }

  /**
   * Assigns the given battler to this sprite.
   * @param {JABS_Battler} battler The battler owning the skill slot.
   */
  setBattler(battler)
  {
    this._j._battler = battler;
  }
  //endregion getters & setters

  //region caching
  /**
   * Ensures all sprites are created and available for use.
   */
  createCache()
  {
    // with no leader, we have no inputs to make a cache.
    if (!$gameParty.leader()) return;

    // grab the leader and their battler for doing things.
    const leader = $gameParty.leader();
  }

  /**
   * Creates the key for the input key icon sprite based on the parameters.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyIconSpriteKey(skillSlot, inputType)
  {
    return `icon-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
  }

  /**
   * Creates an icon sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_Icon}
   */
  getOrCreateInputKeyIconSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeyIconSpriteKey(skillSlot, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillSlotIcon(0, skillSlot);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key ability cost sprite based on the parameters.
   * @param {number} amount The amount that is this cost.
   * @param {number} colorIndex The color index to draw this cost in.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyAbilityCostSpriteKey(amount, colorIndex, inputType)
  {
    return `cost-${this.battler().name()}-${this.battler().battlerId()}-${inputType}-${amount}-${colorIndex}`;
  }

  /**
   * Creates an ability cost sprite for the given input key and caches it.
   * @param {number} amount The amount that is this cost.
   * @param {number} colorIndex The color index to draw this cost in.
   * @param {JABS_Button} inputType The type of input for this key.
   * @param {number} itemId If this is an item, then the item id can be passed for tracking.
   * @returns {Sprite_SkillCost}
   */
  getOrCreateInputKeyAbilityCostSprite(amount, colorIndex, inputType, itemId = 0)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeyAbilityCostSpriteKey(amount, colorIndex, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillCost(amount, colorIndex, itemId);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key ability cost sprite based on the parameters.
   * @param {Sprite_SkillCost.Types} costType The type of cost for this key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySkillCostSpriteKey(costType, inputType)
  {
    return `skillcost-${this.battler().name()}-${this.battler().battlerId()}-${costType}-${inputType}`;
  }

  /**
   * Creates an skill cost sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The slot associated with this skill.
   * @param {Sprite_SkillCost.Types} costType The type of cost this sprite is.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_SkillCost}
   */
  getOrCreateInputKeySkillCostSprite(skillSlot, costType, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySkillCostSpriteKey(costType, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillCost(skillSlot, costType);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key cooldown timer sprite based on the parameters.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {JABS_Button} inputType The type of input for this key.
   * @param {boolean} isItem Whether or not this cooldown timer is for the item slot.
   * @returns {string}
   */
  makeInputKeyCooldowntTimerSpriteKey(cooldownData, inputType, isItem)
  {
    return `cooldown-${this.battler().name()}-${this.battler().battlerId()}-${inputType}-${isItem}`;
  }

  /**
   * Creates a cooldown timer sprite for the given input key and caches it.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {string} inputType The type of input for this key.
   * @returns {Sprite_CooldownTimer}
   */
  getOrCreateInputKeyCooldownTimerSprite(cooldownData, inputType)
  {
    // we always are working with items when assigning
    const isItem = inputType === JABS_Button.Tool;

    // determine the key for this sprite.
    const key = this.makeInputKeyCooldowntTimerSpriteKey(cooldownData, inputType, isItem);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_CooldownTimer(inputType, cooldownData, isItem);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key combo gauge sprite based on the parameters.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyComboGaugeSpriteKey(cooldownData, inputType)
  {
    return `combo-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
  }

  /**
   * Creates a combo gauge sprite for the given input key and caches it.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_CooldownGauge}
   */
  getOrCreateInputKeyComboGaugeSprite(cooldownData, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeyComboGaugeSpriteKey(cooldownData, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_CooldownGauge(cooldownData);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // configure the sprite per our unique needs.
    sprite.rotation = 270 * (Math.PI / 180);
    sprite.scale.x = 0.6;
    sprite.scale.y = 1.1;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key skill name sprite based on the parameters.
   * @param {string} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySkillNameSpriteKey(inputType)
  {
    return `skillname-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
  }

  /**
   * Creates a skill name sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The slot associated with this skill.
   * @param {string} inputType The type of input for this key.
   * @returns {Sprite_SkillName}
   */
  getOrCreateInputKeySkillNameSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySkillNameSpriteKey(inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillName(skillSlot)
      .setFontSize(12)
      .setAlignment(Sprite_BaseText.Alignments.Center);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key skill name sprite based on the parameters.
   * @param {string} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySlotNameSpriteKey(inputType)
  {
    return `slotname-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
  }

  /**
   * Creates a slot name sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The slot to create a name for.
   * @param {string} inputType The type of input for this key.
   * @returns {Sprite_BaseText}
   */
  getOrCreateInputKeySlotNameSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySlotNameSpriteKey(inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // push for uppercase for cleanliness.
    let labelText = inputType.toUpperCase();

    // check if this is a combat skill.
    if (skillSlot.isSecondarySlot())
    {
      // parse out the word "combat" from the input if it exists.
      labelText = labelText.replace("COMBAT", String.empty);
    }

    // create a new sprite.
    const sprite = new Sprite_BaseText(labelText)
      .setFontSize(12)
      .setAlignment(Sprite_BaseText.Alignments.Center)
      .setBold(true);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }
  //endregion caching

  //region drawing
  /**
   * Draws the input key sprite based on the currently assigned data.
   */
  drawInputKey()
  {
    // if we cannot draw, do not.
    if (!this.canDrawInputKey()) return;

    // our origin is 0:0.
    const x = 0;
    const y = 0;

    // draw skill icon.
    this.drawInputKeySkillIcon(x, y);

    if (!this.skillSlot().isItem())
    {
      this.drawInputKeyHpCost(x, y);
      this.drawInputKeyMpCost(x, y);
      this.drawInputKeyTpCost(x, y);
    }
    // if this is a tool, then draw the item cost.
    else
    {
      this.drawInputKeyItemCost(x, y);
    }

    // draw skill combo gauge and cooldown timer.
    this.drawInputKeyComboGauge(x, y);
    this.drawInputKeyCooldownTimer(x, y);

    // draw skill name.
    this.drawInputKeySkillName(x, y);

    // draw the slot name.
    this.drawInputKeySlotName(x, y);
  }

  /**
   * Checks whether or not this input key has the necessary data in order
   * to draw the sprite.
   * @returns {boolean}
   */
  canDrawInputKey()
  {
    // we require a skill slot to draw the skill slot data.
    if (!this.hasSkillSlot()) return false;

    // we require a battler to draw the battler's skill slot data.
    if (!this.hasBattler()) return false;

    // we require a skill in the slot to draw the skill slot data.
    if (!this.skillId()) return false;

    // let's draw!
    return true;
  }

  /**
   * Draws the input key's associated skill icon.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeySkillIcon(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeyIconSprite(skillSlot, inputType);
    sprite.show();
    sprite.move(x+6, y+20);
  }

  /**
   * Draws the input key's associated mp cost.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyHpCost(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.HP,
      inputType);
    sprite.show();
    sprite.move(x-2, y-10);
  }

  /**
   * Draws the input key's associated mp cost.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyMpCost(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.MP,
      inputType);
    sprite.show();
    sprite.move(x-2, y);
  }

  /**
   * Draws the input key's associated tp cost.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyTpCost(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.TP,
      inputType);
    sprite.show();
    sprite.move(x-2, y+10);
  }

  /**
   * Draws the input key's associated item cost.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyItemCost(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.Item,
      inputType);
    sprite.show();
    sprite.move(x+36, y+10);
  }

  /**
   * Draws the input key's associated combo gauge.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyComboGauge(x, y)
  {
    // grab data for building the sprite.
    const cooldownData = this.cooldownData();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeyComboGaugeSprite(cooldownData, inputType);
    sprite.show();
    sprite.move(x+32, y+32);
  }

  /**
   * Draws the input key's associated cooldown data in text.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyCooldownTimer(x, y)
  {
    // grab data for building the sprite.
    const cooldownData = this.cooldownData();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeyCooldownTimerSprite(cooldownData, inputType);
    sprite.show();
    sprite.move(x+28, y+16);
  }

  /**
   * Draws the input key's skill's name.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeySkillName(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillNameSprite(skillSlot, inputType);
    sprite.show();
    sprite.move(x, y+36);
  }

  drawInputKeySlotName(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySlotNameSprite(skillSlot, inputType);
    sprite.show();
    sprite.move(x, y+48);
  }
  //endregion drawing
}
//endregion Sprite_InputKeySlot