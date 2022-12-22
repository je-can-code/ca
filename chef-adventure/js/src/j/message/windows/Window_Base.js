//region Window_Base
//region more database text codes
/**
 * Extends {@link #convertEscapeCharacters}.
 * Adds handling for new text codes for various database objects.
 */
J.MESSAGE.Aliased.Window_Base.set('convertEscapeCharacters', Window_Base.prototype.convertEscapeCharacters);
Window_Base.prototype.convertEscapeCharacters = function(text)
{
  // capture the text in a local variable for good practices!
  let textToModify = text;

  // handle weapon string replacements.
  textToModify = this.translateWeaponTextCode(textToModify);

  // handle armor string replacements.
  textToModify = this.translateArmorTextCode(textToModify);

  // handle item string replacements.
  textToModify = this.translateItemTextCode(textToModify);

  // handle state string replacements.
  textToModify = this.translateStateTextCode(textToModify);

  // handle skill string replacements.
  textToModify = this.translateSkillTextCode(textToModify);

  // handle enemy string replacements.
  textToModify = this.translateEnemyTextCode(textToModify);

  // handle element string replacements.
  textToModify = this.translateElementTextCode(textToModify);

  // handle skill type string replacements.
  textToModify = this.translateSkillTypeTextCode(textToModify);

  // handle weapon string replacements.
  textToModify = this.translateWeaponTypeTextCode(textToModify);

  // handle armor string replacements.
  textToModify = this.translateArmorTypeTypeTextCode(textToModify);

  // handle equip type string replacements.
  textToModify = this.translateEquipTypeTypeTextCode(textToModify);

  // let the rest of the conversion occur with the newly modified text.
  return J.MESSAGE.Aliased.Window_Base.get('convertEscapeCharacters').call(this, textToModify);
};

/**
 * Translates the text code into the name and icon of the weapon.
 * @param {string} text The text that has a text code in it.
 * @returns {*}
 */
Window_Base.prototype.translateWeaponTextCode = function(text)
{
  return text.replace(/\\weapon\[(\d+)]/gi, (_, p1) =>
  {
    const weaponColor = 4;
    const weapon = $dataWeapons[parseInt(p1)];
    return `\\I[${weapon.iconIndex}]\\C[${weaponColor}]${weapon.name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the armor.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateArmorTextCode = function(text)
{
  return text.replace(/\\armor\[(\d+)]/gi, (_, p1) =>
  {
    const armorColor = 5;
    const armor = $dataArmors[parseInt(p1)];
    return `\\I[${armor.iconIndex}]\\C[${armorColor}]${armor.name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the item.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateItemTextCode = function(text)
{
  return text.replace(/\\item\[(\d+)]/gi, (_, p1) =>
  {
    const itemColor = 3;
    const item = $dataItems[parseInt(p1)];
    return `\\I[${item.iconIndex}]\\C[${itemColor}]${item.name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the state.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateStateTextCode = function(text)
{
  return text.replace(/\\state\[(\d+)]/gi, (_, p1) =>
  {
    const stateColor = 6;
    const stateId = parseInt(p1);
    let name = '(Basic Attack)';
    let iconIndex = 0;
    if (stateId > 0)
    {
      const state = $dataStates[parseInt(p1)];
      // eslint-disable-next-line prefer-destructuring
      name = state.name;
      // eslint-disable-next-line prefer-destructuring
      iconIndex = state.iconIndex;
    }

    return `\\I[${iconIndex}]\\C[${stateColor}]${name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the skill.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateSkillTextCode = function(text)
{
  return text.replace(/\\skill\[(\d+)]/gi, (_, p1) =>
  {
    const skillColor = 1;
    const skill = $dataSkills[parseInt(p1)];
    return `\\I[${skill.iconIndex}]\\C[${skillColor}]${skill.name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name of the enemy.
 * NOTE: No icon is assigned for enemies.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateEnemyTextCode = function(text)
{
  return text.replace(/\\enemy\[(\d+)]/gi, (_, p1) =>
  {
    const enemyColor = 2;
    const enemy = $dataEnemies[parseInt(p1)];
    return `\\C[${enemyColor}]${enemy.name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the element.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateElementTextCode = function(text)
{
  return text.replace(/\\element\[(\d+)]/gi, (_, p1) =>
  {
    // parse the element id; default to -1.
    const elementId = parseInt(p1) ?? -1;

    // TODO: make a static "menu item" class out of this?
    // get the replacement data.
    const iconIndex = IconManager.element(elementId);
    const colorId = ColorManager.element(elementId);
    const name = TextManager.element(elementId);

    // return the constructed replacement string.
    return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the skill type.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateSkillTypeTextCode = function(text)
{
  return text.replace(/\\skillType\[(\d+)]/gi, (_, p1) =>
  {
    // parse the skill type id.
    const skillTypeId = parseInt(p1) ?? -1;

    // TODO: make a static "menu item" class out of this?
    // get the replacement data.
    const iconIndex = IconManager.skillType(skillTypeId);
    const colorId = ColorManager.skillType(elementId);
    const name = TextManager.skillType(elementId);

    // return the constructed replacement string.
    return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the weapon type.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateWeaponTypeTextCode = function(text)
{
  return text.replace(/\\weaponType\[(\d+)]/gi, (_, p1) =>
  {
    // parse the weapon type id.
    const weaponTypeId = parseInt(p1) ?? -1;

    // TODO: make a static "menu item" class out of this?
    // get the replacement data.
    const iconIndex = IconManager.weaponType(weaponTypeId);
    const colorId = ColorManager.weaponType(weaponTypeId);
    const name = TextManager.weaponType(weaponTypeId);

    // return the constructed replacement string.
    return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the armor type.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateArmorTypeTypeTextCode = function(text)
{
  return text.replace(/\\armorType\[(\d+)]/gi, (_, p1) =>
  {
    // parse the armor type id.
    const armorTypeId = parseInt(p1) ?? -1;

    // TODO: make a static "menu item" class out of this?
    // get the replacement data.
    const iconIndex = IconManager.armorType(armorTypeId);
    const colorId = ColorManager.armorType(armorTypeId);
    const name = TextManager.armorType(armorTypeId);

    // return the constructed replacement string.
    return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the equip type.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateEquipTypeTypeTextCode = function(text)
{
  return text.replace(/\\equipType\[(\d+)]/gi, (_, p1) =>
  {
    // parse the equip type id.
    const equipTypeId = parseInt(p1) ?? -1;

    // TODO: make a static "menu item" class out of this?
    // get the replacement data.
    const iconIndex = IconManager.equipType(equipTypeId);
    const colorId = ColorManager.equipType(equipTypeId);
    const name = TextManager.equipType(equipTypeId);

    // return the constructed replacement string.
    return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
  });
};
//endregion more database text codes

//region bold and italics
/**
 * Extends text analysis to check for our custom escape codes, too.
 */
J.MESSAGE.Aliased.Window_Base.set('obtainEscapeCode', Window_Base.prototype.obtainEscapeCode);
Window_Base.prototype.obtainEscapeCode = function(textState)
{
  const originalEscape = J.MESSAGE.Aliased.Window_Base.get('obtainEscapeCode').call(this, textState);
  if (!originalEscape)
  {
    return this.customEscapeCodes(textState);
  }
  else
  {
    return originalEscape;
  }
};

/**
 * Retrieves additional escape codes that are our custom creation.
 * @param {any} textState The rolling text state.
 * @returns {string} The found escape code, if any.
 */
Window_Base.prototype.customEscapeCodes = function(textState)
{
  if (!textState) return;

  const regExp = this.escapeCodes();
  const arr = regExp.exec(textState.text.slice(textState.index));
  if (arr)
  {
    textState.index += arr[0].length;
    return arr[0].toUpperCase();
  }
  else
  {
    return String.empty;
  }
};

/**
 * Gets the regex escape code structure.
 *
 * This includes our added custom escape code symbols to look for.
 * @returns {RegExp}
 */
Window_Base.prototype.escapeCodes = function()
{
  return /^[$.|^!><{}*_\\]|^[A-Z]+/i;
};

/**
 * Extends the processing of escape codes to include our custom ones.
 *
 * This adds italics and bold to the possible list of escape codes.
 */
J.MESSAGE.Aliased.Window_Base.set('processEscapeCharacter', Window_Base.prototype.processEscapeCharacter);
Window_Base.prototype.processEscapeCharacter = function(code, textState)
{
  J.MESSAGE.Aliased.Window_Base.get('processEscapeCharacter').call(this, code, textState);
  switch (code)
  {
    case "_":
      this.toggleItalics();
      break;
    case "*":
      this.toggleBold();
      break;
  }
};

/**
 * Toggles the italics for the rolling text state.
 *
 * This does not apply to {@link Window_Base.prototype.drawTextEx}, but alternatively
 * you can interpolate `"\_"` before and after the text desired to be italics to
 * achieve the same effect.
 * @param {boolean} force Optional. If provided, will force one way or the other.
 */
Window_Base.prototype.toggleItalics = function(force = null)
{
  this.contents.fontItalic = force ?? !this.contents.fontItalic;
};

/**
 * Wraps the given text with the message code for italics.
 * @param {string} text The text to italicize.
 * @returns {`\\_${text}\\_`} The italicized text.
 */
Window_Base.prototype.italicizeText = function(text)
{
  return `\\_${text}\\_`;
};

/**
 * Toggles the bold for the rolling text state.
 *
 * This does not apply to {@link Window_Base.prototype.drawTextEx}, but alternatively
 * you can interpolate `"\*"` before and after the text desired to be bold to
 * achieve the same effect.
 * @param {boolean} force Optional. If provided, will force one way or the other.
 */
Window_Base.prototype.toggleBold = function(force = null)
{
  this.contents.fontBold = force ?? !this.contents.fontBold;
};

/**
 * Wraps the given text with the message code for bold.
 * @param {string} text The text to bolden.
 * @returns {`\\*${text}\\*`}
 */
Window_Base.prototype.boldenText = function(text)
{
  return `\\*${text}\\*`;
};
//endregion bold and italics
//endregion Window_Base