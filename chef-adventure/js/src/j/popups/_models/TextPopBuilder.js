//region TextPopBuilder
/**
 * The fluent-builder for text pops on the map.
 */
class TextPopBuilder
{
  //region properties
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
  //endregion properties

  /**
   * Constructor.
   * @param {number|string} value The text or value to be displayed in the popup.
   */
  constructor(value)
  {
    // initializes the builder with a value.
    this.setValue(value);
  }

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
  }

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
  }

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
  }

  /**
   * Puts together the x and y coordinate variances into a single `[x,y]` array.
   * @returns {[number, number]}
   */
  #makeCoordinateVariance()
  {
    return [this.#xVariance, this.#yVariance];
  }

  //region setters
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
  }

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
  }

  /**
   * Sets whether or not this popup is a critical skill usage.
   * @param {boolean} isCritical Whether or not this popup is critical.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setCritical(isCritical = true)
  {
    this.#isCritical = isCritical;
    return this;
  }

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
  }

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
  }

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
  }

  /**
   * Sets the popup type of the popup to the provided type.
   * @param {Map_TextPop.Types} popupType The type of popup this is.
   * @returns {TextPopBuilder}
   */
  setPopupType(popupType)
  {
    this.#popupType = popupType;
    return this;
  }

  /**
   * Set the prefix of the text popup to the given value.
   * @param {string} prefix The prefix to prepend to the value.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setPrefix(prefix)
  {
    this.#prefix = prefix;
    return this;
  }

  /**
   * Set the suffix of the text popup to the given value.
   * @param {string} suffix The suffix to append to the value.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setSuffix(suffix)
  {
    this.#suffix += suffix;
    return this;
  }

  /**
   * Sets the x variance coordinate for this popup.
   * @param {number} xVariance The x variance.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setXVariance(xVariance)
  {
    this.#xVariance = xVariance;
    return this;
  }

  /**
   * Sets the y variance coordinate for this popup.
   * @param {number} yVariance The y variance.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  setYVariance(yVariance)
  {
    this.#yVariance = yVariance;
    return this;
  }

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
  }
  //endregion setters

  //region presets
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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }
  //endregion presents
}
//endregion TextPopBuilder