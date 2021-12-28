//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 MSG] Gives access to more text codes in windows.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ============================================================================
 * This plugin extends the variety of text codes available in windows.
 *
 * The message window is the main area most would benefit from, but if you are
 * a plugin developer, these can also be used anywhere that leverages the
 * "Window_Base.drawTextEx()" function.
 * ============================================================================
 * NEW TEXT CODES:
 * Have you ever wanted to be able to reference a particular entry in the
 * database without having to hardcode the name of the entry and the icon into
 * the message window? Well now you can! By adding the correct text codes into
 * your message windows (or in your plugins using .drawTextEx()), you too can
 * leverage entries from the database without any significant difficulty!
 *
 * NOTE:
 * All new text codes except \Enemy[ID] will also prepend their corresponding
 * icon as well. This is because enemies don't have icons assigned to them.
 *
 * NEW TEXT CODES AVAILABLE:
 *  \Weapon[ID]
 *  \Armor[ID]
 *  \Item[ID]
 *  \State[ID]
 *  \Skill[ID]
 *  \Enemy[ID]
 * Where ID is the id of the entry in the database.
 *
 * NEW TEXT CODES EXAMPLES:
 *  \Weapon[4]
 * The text of "\Weapon[4]" will be replaced with:
 * - the icon of the weapon matching id 4 in the database.
 * - the name of the weapon matching id 4 in the database.
 *
 *  \Skill[101]
 * The text of "\Skill[101]" will be replaced with:
 * - the icon of the skill matching id 101 in the database.
 * - the name of the skill matching id 101 in the database.
 * ============================================================================
 * NEW TEXT STYLES:
 * Have you ever wanted to be able to style your already amazing comic sans ms
 * font with italics or bold? Well now you can! By adding the correct text
 * codes into your message windows (or in your plugins using .drawTextEx()),
 * you too can flourish with italics and/or stand stoic with bold!
 *
 * NOTE:
 * The following styles act as 'toggles', in the sense that all characters that
 * are surrounded by the text codes of \_ or \* would be of their corresponding
 * style- italics or bold respectively. See the examples for clarity.
 *
 * NEW TEXT STYLES AVAILABLE:
 *  \_      (italics)
 *  \*      (bold)
 *
 * NEW TEXT STYLES EXAMPLES:
 *  "so it is \*gilbert\*. We finally meet \_at last\_."
 * In the passage above, the word "gilbert" would be bolded.
 * In the passage above, the words "at least" would be italicized.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.MSG = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.MSG.Metadata =
  {
    /**
     * The name of this plugin.
     */
    Name: `J-MessageTextCodes`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

/**
 * A collection of all base aliases.
 */
J.MSG.Aliased =
  {
    Window_Base: new Map(),
  };
//#endregion introduction

//#region Window_Base
//#region more database text codes
/**
 * Adds handling for new text codes for various database objects.
 */
J.MSG.Aliased.Window_Base.set('convertEscapeCharacters', Window_Base.prototype.convertEscapeCharacters);
Window_Base.prototype.convertEscapeCharacters = function(text)
{
  // handle weapon string replacements.
  text = this.translateWeaponTextCode(text);

  // handle armor string replacements.
  text = this.translateArmorTextCode(text);

  // handle item string replacements.
  text = this.translateItemTextCode(text);

  // handle state string replacements.
  text = this.translateStateTextCode(text);

  // handle skill string replacements.
  text = this.translateSkillTextCode(text);

  // handle enemy string replacements.
  text = this.translateEnemyTextCode(text);

  // let the rest of the conversion occur with the newly modified text.
  return J.MSG.Aliased.Window_Base.get('convertEscapeCharacters').call(this, text);
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
      name = state.name;
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
//#endregion more database text codes

//#region bold and italics
/**
 * Extends the font settings reset to include bold and italics removal.
 */
J.MSG.Aliased.Window_Base.set('resetFontSettings', Window_Base.prototype.resetFontSettings);
Window_Base.prototype.resetFontSettings = function()
{
  J.MSG.Aliased.Window_Base.get('resetFontSettings').call(this);
  this.resetFontFormatting();
};

/**
 * Resets bold and italics for this bitmap.
 */
Window_Base.prototype.resetFontFormatting = function()
{
  this.contents.fontItalic = false;
  this.contents.fontBold = false;
};

/**
 * Extends text analysis to check for our custom escape codes, too.
 */
J.MSG.Aliased.Window_Base.set('obtainEscapeCode', Window_Base.prototype.obtainEscapeCode);
Window_Base.prototype.obtainEscapeCode = function(textState)
{
  const originalEscape = J.MSG.Aliased.Window_Base.get('obtainEscapeCode').call(this, textState);
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
J.MSG.Aliased.Window_Base.set('processEscapeCharacter', Window_Base.prototype.processEscapeCharacter);
Window_Base.prototype.processEscapeCharacter = function(code, textState)
{
  J.MSG.Aliased.Window_Base.get('processEscapeCharacter').call(this, code, textState);
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
 * @param {boolean} force Optional. If provided, will force one way or the other.
 */
Window_Base.prototype.toggleItalics = function(force = null)
{
  this.contents.fontItalic = force ?? !this.contents.fontItalic;
};

/**
 * Toggles the bold for the rolling text state.
 * @param {boolean} force Optional. If provided, will force one way or the other.
 */
Window_Base.prototype.toggleBold = function(force = null)
{
  this.contents.fontBold = force ?? !this.contents.fontBold;
};
//#endregion bold and italics
//#endregion Window_Base
//ENDOFFILE