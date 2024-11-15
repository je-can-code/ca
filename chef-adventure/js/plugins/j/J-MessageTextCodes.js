//region BasicChoiceConditional
/**
 * A basic choice conditional that can be checked for choice validity based on current leader or switch state.
 */
class BasicChoiceConditional
{
  /**
   * A static property containing the strings representing validation types supported.
   */
  static Types = {
    Leader: 'leader', NotLeader: 'not-leader', SwitchOn: 'switch-on', SwitchOff: 'switch-off',
  }

  /**
   * The {@link BasicChoiceConditional.Types} that this conditional is.
   * @type {string}
   */
  type = String.empty;

  /**
   * The id corresponding with the conditional being validated.
   * @type {number}
   */
  id = 0;

  /**
   * @constructor
   * @param {string} type The {@link BasicChoiceConditional.Types} that this conditional is.
   * @param {number} id The id that corresponds with the designated {@link BasicChoiceConditional.Types}.
   */
  constructor(type, id)
  {
    this.type = type;
    this.id = id;
  }

  /**
   * Determines whether or not this {@link BasicChoiceConditional} is met.
   * @returns {boolean}
   */
  isMet()
  {
    switch (this.type)
    {
      // validate the leader is in fact the correct leader.
      case BasicChoiceConditional.Types.Leader:
        return ($gameParty.leader() && $gameParty.leader()
          ?.actorId() === this.id);

      // validate the leader is in fact the not the specified leader.
      case BasicChoiceConditional.Types.NotLeader:
        return ($gameParty.leader() && $gameParty.leader()
          ?.actorId() !== this.id);

      // validate the conditional switch is ON.
      case BasicChoiceConditional.Types.SwitchOn:
        return $gameSwitches.value(this.id) === true;

      // validate the conditional switch is OFF.
      case BasicChoiceConditional.Types.SwitchOff:
        return $gameSwitches.value(this.id) === false;
    }
    return true;
  }
}

//endregion BasicChoiceConditional

//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 MESSAGE] Gives access to more message window functionality.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin grants additional message functionality.
 * - Adds new text codes for various database objects.
 * - Adds new conditionals for showing/hiding choices.
 *
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
 *  From their own respectively named tabs
 *  \Weapon[ID]
 *  \Armor[ID]
 *  \Item[ID]
 *  \State[ID]
 *  \Skill[ID]
 *  \Enemy[ID]
 *
 *  From the "Types" tab:
 *  \element[ID]
 *  \equipType[ID]
 *  \weaponType[ID]
 *  \armorType[ID]
 *  \skillType[ID]
 *
 *  From mine other plugins:
 *  \sdp[SDP_KEY]
 *  \quest[QUEST_KEY]
 *
 * Where ID is the id of the entry in the database.
 * Where SDP_KEY is the key of the panel.
 * Where QUEST_KEY is the key of the quest.
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
 *
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
 * In the passage above, the words "at last" would be italicized.
 *
 * ============================================================================
 * NEW CHOICE CONDITIONALS
 * Have you ever wanted to be able to conditionally make choices appear based
 * on a situation like a switch or who the leader currently is? Well now you
 * can! By adding tags into the comments of your 'Show Choices' branches, you
 * too can have conditionally appearing choices in events!
 *
 * NOTE:
 * It is untested how well this functions with nested 'Show Choices' commands,
 * if it functions at all as-intended. It is recommended to avoid nesting the
 * switches.
 *
 * TAG USAGE:
 * - Event Commands - specifically in a 'Show Choices' branch/choice.
 *
 * TAG FORMAT:
 *  <leaderChoiceCondition:ACTOR_ID>
 *  <notLeaderChoiceCondition:ACTOR_ID>
 *    Where ACTOR_ID represents the id of the actor
 *    to condition this choice for.
 *
 * <switchOnChoiceCondition:SWITCH_ID>
 * <switchOffChoiceCondition:SWITCH_ID>
 *    Where SWITCH_ID represents the id of the switch
 *    to condition this choice for.
 *
 * TAG EXAMPLES:
 *  <leaderChoiceCondition:4>
 * The choice with this in its branch will be visible only while the actor of
 * ACTOR_ID 4 is the leader when this event gets triggered.
 *
 *  <notLeaderChoiceCondition:17>
 * The choice with this in its branch will be hidden only while the actor of
 * ACTOR_ID 17 is the leader when this event gets triggered.
 *
 *  <switchOnChoiceCondition:222>
 * The choice with this in its branch will be visible only while the switch of
 * SWITCH_ID 222 is ON when this event gets triggered.
 *
 *  <switchOffChoiceCondition:74>
 * The choice with this in its branch will be visible only while the switch of
 * SWITCH_ID 74 is OFF when this event gets triggered.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.2.0
 *    Embedded a modified version of HIME's choice conditionals into this.
 *      Said plugin was added and modified and extended for other purposes.
 *    Implemented questopedia text code format.
 *    Added basic choice conditionals for switches and leader for choices.
 * - 1.1.0
 *    Implemented element, the four "types" from database data.
 *    Added plugin dependency of J-Base.
 *    Implemented SDP panel text code format.
 * - 1.0.0
 *    Initial release.
 *    Implemented style toggles for bold and italics.
 *    Implemented weapon/armor/item/state/skill/enemy names from database data.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.MESSAGE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.MESSAGE.Metadata = {};
J.MESSAGE.Metadata.Name = `J-MessageTextCodes`;
J.MESSAGE.Metadata.Version = '1.2.0';

/**
 * A collection of all base aliases.
 */
J.MESSAGE.Aliased = {};
J.MESSAGE.Aliased.Game_Interpreter = new Map();
J.MESSAGE.Aliased.Game_Message = new Map();
J.MESSAGE.Aliased.Window_Base = new Map();
J.MESSAGE.Aliased.Window_ChoiceList = new Map();
J.MESSAGE.Aliased.Window_ChoiceList = new Map();

J.MESSAGE.RegExp = {};
J.MESSAGE.RegExp.LeaderChoiceConditional = /<leaderChoiceCondition:[ ]?(\d+)>/i;
J.MESSAGE.RegExp.NotLeaderChoiceConditional = /<notLeaderChoiceCondition:[ ]?(\d+)>/i;
J.MESSAGE.RegExp.SwitchOnChoiceConditional = /<switchOnChoiceCondition:[ ]?(\d+)>/i;
J.MESSAGE.RegExp.SwitchOffChoiceConditional = /<switchOffChoiceCondition:[ ]?(\d+)>/i;
//endregion introduction

//region Game_Event
/**
 * A filter function for only including comment event commands relevant to choice conditionals.
 * @param {rm.types.EventCommand} command The command being evaluated.
 * @returns {boolean}
 */
Game_Event.filterCommentCommandsForBasicConditionals = function(command)
{
  // identify the actual comment being evaluated.
  const [ comment, ] = command.parameters;

  // in case the command isn't even valid for comment-validation.
  if (!comment) return false;

  // extract the types of regex we will be considering.
  const {
    LeaderChoiceConditional, NotLeaderChoiceConditional, SwitchOnChoiceConditional, SwitchOffChoiceConditional
  } = J.MESSAGE.RegExp;

  return [
    LeaderChoiceConditional, NotLeaderChoiceConditional, SwitchOnChoiceConditional, SwitchOffChoiceConditional ].some(
    regex => regex.test(comment));
};

/**
 * Converts a known comment event command into a conditional for basic control.
 * @param {rm.types.EventCommand} commentCommand The comment command to parse into a conditional.
 * @returns {BasicChoiceConditional}
 */
Game_Event.toBasicConditional = function(commentCommand)
{
  // shorthand the comment into a variable.
  const [ comment, ] = commentCommand.parameters;

  let result = null;

  let type = String.empty;

  switch (true)
  {
    // check if the leader is in fact the desired leader.
    case J.MESSAGE.RegExp.LeaderChoiceConditional.test(comment):
      result = J.MESSAGE.RegExp.LeaderChoiceConditional.exec(comment);
      type = BasicChoiceConditional.Types.Leader;
      break;
    // check if the leader is in fact not the desired leader.
    case J.MESSAGE.RegExp.NotLeaderChoiceConditional.test(comment):
      result = J.MESSAGE.RegExp.NotLeaderChoiceConditional.exec(comment);
      type = BasicChoiceConditional.Types.NotLeader;
      break;

    // check if a particular switch is currently ON.
    case J.MESSAGE.RegExp.SwitchOnChoiceConditional.test(comment):
      result = J.MESSAGE.RegExp.SwitchOnChoiceConditional.exec(comment);
      type = BasicChoiceConditional.Types.SwitchOn;
      break;
    // check if a particular switch is currently ON.
    case J.MESSAGE.RegExp.SwitchOffChoiceConditional.test(comment):
      result = J.MESSAGE.RegExp.SwitchOffChoiceConditional.exec(comment);
      type = BasicChoiceConditional.Types.SwitchOff;
      break;
  }

  // parse the value out of the regex capture group.
  const [ , val ] = result;
  const parsedVal = JsonMapper.parseObject(val);

  // derive the conditional from the designated regex.
  return new BasicChoiceConditional(type, parsedVal);
};
//endregion Game_Event

//region Game_Interpreter
/**
 * Extends {@link setupChoices}.<br/>
 * Backs up the original choices identified by the completed setup.
 */
J.MESSAGE.Aliased.Game_Interpreter.set('setupChoices', Game_Interpreter.prototype.setupChoices);
Game_Interpreter.prototype.setupChoices = function(params)
{
  // perform original choice setup logic.
  J.MESSAGE.Aliased.Game_Interpreter.get('setupChoices')
    .call(this, params);

  // also backup the original options.
  $gameMessage.backupChoices();

  // add a hook for evaluating visibility of choices.
  this.evaluateChoicesForVisibility(params);
};

/**
 * A hook for evaluating visibility of choices programmatically.
 * @param {rm.types.EventCommand[]} params The choices parameters being setup.
 */
Game_Interpreter.prototype.evaluateChoicesForVisibility = function(params)
{
  // also hide the unmet quest conditional choices.
  this.hideSpecificChoiceBranches(params);
};

/**
 * Hide all the choices that don't meet the criteria.
 * @param {rm.types.EventCommand} params The event command parameters.
 */
Game_Interpreter.prototype.hideSpecificChoiceBranches = function(params)
{
  // identify some event metadata.
  const currentCommand = this.currentCommand();
  const eventMetadata = $gameMap.event(this.eventId());
  const currentPageCommands = !!eventMetadata
    ? eventMetadata.page().list
    : $dataCommonEvents.at(this._commonEventId).list;

  // 102 = start show choice
  // 402 = one of the show choice options
  // 404 = end show choice

  // identify the start and end of the choice branches.
  const startShowChoiceIndex = currentPageCommands.findIndex(item => item === currentCommand);
  const endShowChoiceIndex = currentPageCommands.findIndex((item,
    index) => (index > startShowChoiceIndex && item.indent === currentCommand.indent && item.code === 404));

  // build an array of indexes that align with the options.
  const showChoiceIndices = currentPageCommands
    .map((command, index) =>
    {
      if (index < startShowChoiceIndex || index > endShowChoiceIndex) return null;

      if (currentCommand.indent !== command.indent) return null;

      if (command.code === 402 || command.code === 404) return index;

      return null;
    })
    .filter(choiceIndex => choiceIndex !== null);

  // convert the indices into an array of arrays that represent the actual choice code embedded within the choices.
  const choiceGroups = showChoiceIndices.reduce((runningCollection, choiceIndex, index) =>
  {
    if (showChoiceIndices.length < index) return;
    const startIndex = choiceIndex;
    const endIndex = showChoiceIndices.at(index + 1);

    let counterIndex = startIndex;
    const choiceGroup = [];
    while (counterIndex < endIndex)
    {
      choiceGroup.push(counterIndex);
      counterIndex++;
    }

    runningCollection.push(choiceGroup);

    return runningCollection;
  }, []);

  // an array of booleans where the index aligns with a choice, true being hidden, false being visible.
  const choiceGroupsHidden = choiceGroups.map(choiceGroup => choiceGroup.some(this.shouldHideChoiceBranch, this), this);

  // hide the groups accordingly.
  choiceGroupsHidden
    .forEach((isGroupHidden, choiceIndex) => this.setChoiceHidden(choiceIndex, isGroupHidden), this);
};

/**
 * Determines whether a choice group- as in, a branch in a "Show Choices" event command, should be hidden from view.
 * If this value returns false, it will be displayed. If it returns true, the choice branch will be hidden.
 * @param {number} subChoiceCommandIndex The index in the list of commands of an event that represents this branch.
 * @returns {boolean}
 */
Game_Interpreter.prototype.shouldHideChoiceBranch = function(subChoiceCommandIndex)
{
  // grab some metadata about the event.
  const eventMetadata = $gameMap.event(this.eventId());
  const currentPageCommands = !!eventMetadata
    ? eventMetadata.page().list
    : $dataCommonEvents.at(this._commonEventId).list;

  // grab the event subcommand.
  const subEventCommand = currentPageCommands.at(subChoiceCommandIndex);

  // ignore non-comment event commands.
  if (!Game_Event.filterInvalidEventCommand(subEventCommand)) return false;

  // ignore non-relevant comment commands.
  if (!Game_Event.filterCommentCommandsForBasicConditionals(subEventCommand)) return false;

  // build the conditional.
  const conditional = Game_Event.toBasicConditional(subEventCommand);

  // if the condition is met, then we don't need to hide.
  const met = conditional.isMet();
  if (met) return false;

  // the conditional isn't met, hide the group.
  return true;
};

/**
 * Sets a choice to be hidden- or not. The choiceIndex parameter is 0-based. Set the shouldHide parameter to true for a
 * given choice to hide it.
 * @param {number} choiceIndex The 1-based number of the choice.
 * @param {boolean=} shouldHide Whether or not the choice should be hidden; defaults to true.
 */
Game_Interpreter.prototype.setChoiceHidden = function(choiceIndex, shouldHide = true)
{
  // hide it- or don't.
  $gameMessage.hideChoice(choiceIndex, shouldHide);
};
//endregion Game_Interpreter

//region Game_Message
/**
 * Extends {@link clear}.<br/>
 * Also clears the custom choice data.
 */
J.MESSAGE.Aliased.Game_Message.set('clear', Game_Message.prototype.clear);
Game_Message.prototype.clear = function()
{
  // perform original logic.
  J.MESSAGE.Aliased.Game_Message.get('clear')
    .call(this);

  /**
   * An object tracking key:value (index:boolean) pairs for whether or not an index of a choice is hidden.
   * @type {Map<number, boolean>}
   */
  this._hiddenChoiceConditions = new Map();

  /**
   * A container for backing up the choice collection.
   * @type {string[]}
   */
  this._oldChoices = [];
};

/**
 * Clones the original choice data into a backup for later use.
 */
Game_Message.prototype.backupChoices = function()
{
  this._oldChoices = this._choices.clone();
};

/**
 * Restores the cloned original choice data from backup.
 */
Game_Message.prototype.restoreChoices = function()
{
  this._choices = this._oldChoices.clone();
};

/* Returns whether the specified choice is hidden */
/**
 * Determines whether or not this choice is actually hidden.
 * @param {number} choiceIndex The index of the option to check.
 * @returns {boolean}
 */
Game_Message.prototype.isChoiceHidden = function(choiceIndex)
{
  if (this._hiddenChoiceConditions.has(choiceIndex))
  {
    return this._hiddenChoiceConditions.get(choiceIndex);
  }

  return false;
};

/**
 * Sets a choice to be hidden or not.
 * @param {number} choiceIndex The index of the option to set.
 * @param {boolean} isHidden Whether or not this choice is hidden.
 */
Game_Message.prototype.hideChoice = function(choiceIndex, isHidden)
{
  this._hiddenChoiceConditions.set(choiceIndex, isHidden);
};
//endregion Game_Message

//region Window_Base
//region more database text codes
/**
 * Extends {@link #convertEscapeCharacters}.<br>
 * Adds handling for new text codes for various database objects.
 */
J.MESSAGE.Aliased.Window_Base.set('convertEscapeCharacters', Window_Base.prototype.convertEscapeCharacters);
Window_Base.prototype.convertEscapeCharacters = function(text)
{
  // capture the text in a local variable for good practices!
  let textToModify = text;

  // handle quest key replacements.
  textToModify = this.translateQuestTextCode(textToModify);

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

  // handle equip type string replacements.
  textToModify = this.translateEquipTypeTextCode(textToModify);

  // handle weapon string replacements.
  textToModify = this.translateWeaponTypeTextCode(textToModify);

  // handle armor string replacements.
  textToModify = this.translateArmorTypeTextCode(textToModify);

  // handle skill type string replacements.
  textToModify = this.translateSkillTypeTextCode(textToModify);

  // handle sdp key replacements.
  textToModify = this.translateSdpTextCode(textToModify);

  // let the rest of the conversion occur with the newly modified text.
  return J.MESSAGE.Aliased.Window_Base.get('convertEscapeCharacters')
    .call(this, textToModify);
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
    const colorId = ColorManager.elementColorIndex(elementId);
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
    const colorId = ColorManager.skillType(skillTypeId);
    const name = TextManager.skillType(skillTypeId);

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
Window_Base.prototype.translateArmorTypeTextCode = function(text)
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
Window_Base.prototype.translateEquipTypeTextCode = function(text)
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

/**
 * Translates the text code into the name and icon of the corresponding SDP.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateSdpTextCode = function(text)
{
  // if not using the SDP system, then don't try to process the text.
  if (!J.SDP) return text;

  return text.replace(/\\sdp\[(.*)]/gi, (_, p1) =>
  {
    // determine the sdp key.
    const sdpKey = p1 ?? String.empty;

    // if no key was provided, then do not parse the panel.
    if (!sdpKey) return text;

    // grab the panel by its key.
    const sdp = $gameParty.getSdpByKey(sdpKey);

    // if the panel doesn't exist, then do not parse the panel.
    if (!sdp) return text;

    // extract the necessary data from the SDP.
    const { name, rarity: colorIndex, iconIndex } = sdp;

    // return the constructed replacement string.
    return `\\I[${iconIndex}]\\C[${colorIndex}]${name}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the corresponding quest.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateQuestTextCode = function(text)
{
  // if not using the Questopedia system, then don't try to process the text.
  if (!J.OMNI?.EXT?.QUEST) return text;

  return text.replace(/\\quest\[([\w.-]+)]/gi, (_, p1) =>
  {
    // determine the quest key.
    const questKey = p1 ?? String.empty;

    // if no key was provided, then do not parse the quest.
    if (!questKey) return text;

    // grab the quest by its key.
    const quest = QuestManager.quest(questKey);

    // if the quest doesn't exist, then do not parse the quest.
    if (!quest) return text;

    // grab the name of the quest.
    const questName = quest.name()
    //   .replace(/[\\]{1}(.)/gi, originalText =>
    // {
    //   return `\\${originalText}`;
    // });

    // for quests, the icon displayed is the category icon instead.
    const questIconIndex = QuestManager.category(quest.categoryKey).iconIndex;

    // return the constructed replacement string.
    return `\\I[${questIconIndex}]\\C[1]${questName}\\C[0]`;
  });
};
//endregion more database text codes

//region font style
/**
 * Extends text analysis to check for our custom escape codes, too.
 */
J.MESSAGE.Aliased.Window_Base.set('obtainEscapeCode', Window_Base.prototype.obtainEscapeCode);
Window_Base.prototype.obtainEscapeCode = function(textState)
{
  const originalEscape = J.MESSAGE.Aliased.Window_Base.get('obtainEscapeCode')
    .call(this, textState);
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
  if (!textState) return String.empty;

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
  J.MESSAGE.Aliased.Window_Base.get('processEscapeCharacter')
    .call(this, code, textState);
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
 * @param {?boolean} force Optional. If provided, will force one way or the other.
 */
Window_Base.prototype.toggleItalics = function(force = null)
{
  this.contents.fontItalic = force ?? !this.contents.fontItalic;
};

/**
 * Wraps the given text with the message code for italics.
 * @param {string} text The text to italicize.
 * @returns {string} The italicized text like this: `\\_${text}\\_`
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
 * @param {?boolean} force Optional. If provided, will force one way or the other.
 */
Window_Base.prototype.toggleBold = function(force = null)
{
  this.contents.fontBold = force ?? !this.contents.fontBold;
};

/**
 * Wraps the given text with the message code for bold.
 * @param {string} text The text to bolden.
 * @returns {string} The bolded text like this: `\\*${text}\\*`
 */
Window_Base.prototype.boldenText = function(text)
{
  return `\\*${text}\\*`;
};

/**
 * Wraps the given text with a font-size modifier shorthand.
 * @param {number} modifier The size modification.
 * @param {string} text The text to modify size for.
 * @returns {string} The fontsize modified text like this: `\\FS[${number}]${string}\\FS[${number}]`
 */
Window_Base.prototype.modFontSizeForText = function(modifier, text)
{
  const currentFontSize = this.contents.fontSize;

  const modifiedFontSize = currentFontSize + modifier;

  return `\\FS[${modifiedFontSize}]${text}\\FS[${currentFontSize}]`;
};
//endregion font style
//endregion Window_Base

//region Window_ChoiceList
/**
 * Extends {@link makeCommandList}.<br/>
 * Post-modifies the commands to remove "hidden" choices.
 */
J.MESSAGE.Aliased.Window_ChoiceList.set('makeCommandList', Window_ChoiceList.prototype.makeCommandList);
Window_ChoiceList.prototype.makeCommandList = function()
{
  $gameMessage.restoreChoices();
  this.clearChoiceMap();

  // perform original logic.
  J.MESSAGE.Aliased.Window_ChoiceList.get('makeCommandList')
    .call(this);

  let needsUpdate = false;

  // iterate over all the choices in this list in reverse to avoid index issues.
  for (var i = this._list.length; i > -1; i--)
  {
    // check if the choice is hidden by its index.
    if ($gameMessage.isChoiceHidden(i))
    {
      // remove the hidden choice from this window.
      this._list.splice(i, 1);

      // remove the hidden choice from the message data.
      $gameMessage._choices.splice(i, 1);

      // flag for needing resizing at the end of the adjustments.
      needsUpdate = true;
    }
    else
    {
      // Add this to our choice map.
      this._choiceMap.unshift(i);
    }
  }

  // If any there were changes to the choices.
  if (needsUpdate === true)
  {
    // update this window's placement.
    this.updatePlacement();
  }
};

/* Stores the choice numbers at each index */
Window_ChoiceList.prototype.clearChoiceMap = function()
{
  this._choiceMap = [];
};

/**
 * Overwrites {@link callOkHandler}.<br/>
 * Uses the index of our custom list instead of the original list.
 */
Window_ChoiceList.prototype.callOkHandler = function()
{
  $gameMessage.onChoice(this._choiceMap[this.index()]);
  this._messageWindow.terminateMessage();
  this.close();
};
//endregion Window_ChoiceList