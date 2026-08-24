//region Introduction
/*:
 * @target MZ
 * @plugindesc [v1.3.0 MESSAGE] Gives access to more message window functionality.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-SDP
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
 *  \param[PARAM_KEY]
 *
 * Where ID is the id of the entry in the database.
 * Where SDP_KEY is the key of the panel.
 * Where QUEST_KEY is the key of the quest.
 * Where PARAM_KEY is a registered J-Base ParameterRegistry key (e.g. "atk", "mcr", "hcr").
 * An unrecognized PARAM_KEY renders as an unmistakable "!!! UNKNOWN PARAM !!!" in red with a
 * question-mark icon instead of failing silently- this is always an authoring mistake, never a
 * legitimate zero/empty result.
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
 *  \param[atk]
 * The text of "\param[atk]" will be replaced with:
 * - the icon of the "atk" parameter from the ParameterRegistry.
 * - the label of the "atk" parameter from the ParameterRegistry.
 *
 *  \param[typo]
 * An unregistered key like "typo" will be replaced with a bright red
 * "!!! UNKNOWN PARAM !!!" and a question-mark icon instead of doing nothing.
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
 * - 1.3.0
 *    Added \param[PARAM_KEY] text code, pulling name/icon/color from the
 *    shared J-Base ParameterRegistry catalog. An unregistered key renders as
 *    a loud red "!!! UNKNOWN PARAM !!!" instead of failing silently.
 * - 1.2.1
 *    Added helper for applying text color to fragments.
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

//#region src/plugins/message/core/_metadata/_pluginMetadata.js
var J_MessageTextCodesPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/message/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.MESSAGE = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.MESSAGE.Metadata = new J_MessageTextCodesPluginMetadata("J-MessageTextCodes", "1.3.0");
/**
* A collection of all base aliases.
*/
J.MESSAGE.Aliased = {};
J.MESSAGE.Aliased.Game_Interpreter = new Map();
J.MESSAGE.Aliased.Game_Message = new Map();
J.MESSAGE.Aliased.Window_Base = new Map();
J.MESSAGE.Aliased.Window_ChoiceList = new Map();
J.MESSAGE.RegExp = {};
J.MESSAGE.RegExp.LeaderChoiceConditional = /<leaderChoiceCondition:[ ]?(\d+)>/i;
J.MESSAGE.RegExp.NotLeaderChoiceConditional = /<notLeaderChoiceCondition:[ ]?(\d+)>/i;
J.MESSAGE.RegExp.SwitchOnChoiceConditional = /<switchOnChoiceCondition:[ ]?(\d+)>/i;
J.MESSAGE.RegExp.SwitchOffChoiceConditional = /<switchOffChoiceCondition:[ ]?(\d+)>/i;

//#endregion
//#region src/plugins/message/core/__models/BasicChoiceConditional.js
/**
* A basic choice conditional that can be checked for choice validity based on current leader or switch state.
*/
var BasicChoiceConditional = class BasicChoiceConditional {
	/**
	* A static property containing the strings representing validation types supported.
	*/
	static Types = {
		Leader: "leader",
		NotLeader: "not-leader",
		SwitchOn: "switch-on",
		SwitchOff: "switch-off"
	};
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
	constructor(type, id) {
		this.type = type;
		this.id = id;
	}
	/**
	* Determines whether or not this {@link BasicChoiceConditional} is met.
	* @returns {boolean}
	*/
	isMet() {
		switch (this.type) {
			case BasicChoiceConditional.Types.Leader: return $gameParty.leader() && $gameParty.leader().actorId() === this.id;
			case BasicChoiceConditional.Types.NotLeader: return $gameParty.leader() && $gameParty.leader().actorId() !== this.id;
			case BasicChoiceConditional.Types.SwitchOn: return $gameSwitches.value(this.id) === true;
			case BasicChoiceConditional.Types.SwitchOff: return $gameSwitches.value(this.id) === false;
		}
		return true;
	}
};

//#endregion
//#region src/plugins/message/core/objects/Game_Message.js
/**
* Extends {@link clear}.<br/>
* Also clears the custom choice data.
*/
J.MESSAGE.Aliased.Game_Message.set("clear", Game_Message.prototype.clear);
Game_Message.prototype.clear = function() {
	J.MESSAGE.Aliased.Game_Message.get("clear").call(this);
	/**
	* An object tracking key:value (index:boolean) pairs for whether or not an index of a choice is hidden.
	* @type {Map<number, boolean>}
	*/
	this.setHiddenChoiceConditions(new Map());
	/**
	* A container for backing up the choice collection.
	* @type {string[]}
	*/
	this.setOldChoices([]);
};
/**
* Clones the original choice data into a backup for later use.
*/
Game_Message.prototype.backupChoices = function() {
	const backup = this.choices().clone();
	this.setOldChoices(backup);
};
/**
* Restores the cloned original choice data from backup.
*/
Game_Message.prototype.restoreChoices = function() {
	this._choices = this.oldChoices().clone();
};
/**
* Determines whether or not this choice is actually hidden.
* @param {number} choiceIndex The index of the option to check.
* @returns {boolean}
*/
Game_Message.prototype.isChoiceHidden = function(choiceIndex) {
	if (this.hiddenChoiceConditions().has(choiceIndex)) {
		return this.hiddenChoiceConditions().get(choiceIndex);
	}
	return false;
};
/**
* Sets a choice to be hidden or not.
* @param {number} choiceIndex The index of the option to set.
* @param {boolean} isHidden Whether or not this choice is hidden.
*/
Game_Message.prototype.hideChoice = function(choiceIndex, isHidden) {
	this.hiddenChoiceConditions().set(choiceIndex, isHidden);
};
/**
* Gets the hidden choice conditions.
* @returns {Map<number, boolean>} The hiddenChoiceConditions.
*/
Game_Message.prototype.hiddenChoiceConditions = function() {
	return this._hiddenChoiceConditions;
};
/**
* Sets the hidden choice conditions.
* @param {Map<number, boolean>} newHiddenChoiceConditions The new hiddenChoiceConditions.
*/
Game_Message.prototype.setHiddenChoiceConditions = function(newHiddenChoiceConditions) {
	this._hiddenChoiceConditions = newHiddenChoiceConditions;
};
/**
* Gets the old choices.
* @returns {string[]} The oldChoices.
*/
Game_Message.prototype.oldChoices = function() {
	return this._oldChoices;
};
/**
* Sets the old choices.
* @param {string[]} newOldChoices The new oldChoices.
*/
Game_Message.prototype.setOldChoices = function(newOldChoices) {
	this._oldChoices = newOldChoices;
};

//#endregion
//#region src/plugins/message/core/objects/Game_Interpreter.js
/**
* Extends {@link setupChoices}.<br/>
* Backs up the original choices identified by the completed setup.
*/
J.MESSAGE.Aliased.Game_Interpreter.set("setupChoices", Game_Interpreter.prototype.setupChoices);
Game_Interpreter.prototype.setupChoices = function(params) {
	J.MESSAGE.Aliased.Game_Interpreter.get("setupChoices").call(this, params);
	$gameMessage.backupChoices();
	this.evaluateChoicesForVisibility(params);
};
/**
* A hook for evaluating visibility of choices programmatically.
* @param {RPG_EventListCommand[]} params The choices parameters being setup.
*/
Game_Interpreter.prototype.evaluateChoicesForVisibility = function(params) {
	this.hideSpecificChoiceBranches(params);
};
/**
* Hide all the choices that don't meet the criteria.
* @param {RPG_EventListCommand} params The event command parameters.
*/
Game_Interpreter.prototype.hideSpecificChoiceBranches = function(params) {
	const currentCommand = this.currentCommand();
	const eventMetadata = $gameMap.event(this.eventId());
	const currentPageCommands = eventMetadata ? eventMetadata.page().list : $dataCommonEvents.at(this.commonEventId()).list;
	const startShowChoiceIndex = currentPageCommands.findIndex((item) => item === currentCommand);
	const endShowChoiceIndex = currentPageCommands.findIndex((item, index) => index > startShowChoiceIndex && item.indent === currentCommand.indent && item.code === 404);
	const showChoiceIndices = currentPageCommands.map((command, index) => {
		if (index < startShowChoiceIndex || index > endShowChoiceIndex) return null;
		if (currentCommand.indent !== command.indent) return null;
		if (command.code === 402 || command.code === 404) return index;
		return null;
	}).filter((choiceIndex) => choiceIndex !== null);
	const choiceGroups = showChoiceIndices.reduce((runningCollection, choiceIndex, index) => {
		const startIndex = choiceIndex;
		const endIndex = showChoiceIndices.at(index + 1);
		let counterIndex = startIndex;
		const choiceGroup = [];
		while (counterIndex < endIndex) {
			choiceGroup.push(counterIndex);
			counterIndex++;
		}
		runningCollection.push(choiceGroup);
		return runningCollection;
	}, []);
	const choiceGroupsHidden = choiceGroups.map((choiceGroup) => choiceGroup.some(this.shouldHideChoiceBranch, this), this);
	choiceGroupsHidden.forEach((isGroupHidden, choiceIndex) => this.setChoiceHidden(choiceIndex, isGroupHidden), this);
};
/**
* Determines whether a choice group- as in, a branch in a "Show Choices" event command, should be hidden from view.
* If this value returns false, it will be displayed. If it returns true, the choice branch will be hidden.
* @param {number} subChoiceCommandIndex The index in the list of commands of an event that represents this branch.
* @returns {boolean}
*/
Game_Interpreter.prototype.shouldHideChoiceBranch = function(subChoiceCommandIndex) {
	const eventMetadata = $gameMap.event(this.eventId());
	const currentPageCommands = eventMetadata ? eventMetadata.page().list : $dataCommonEvents.at(this.commonEventId()).list;
	const subEventCommand = currentPageCommands.at(subChoiceCommandIndex);
	if (!Game_Event.filterInvalidEventCommand(subEventCommand)) return false;
	if (!Game_Event.filterCommentCommandsForBasicConditionals(subEventCommand)) return false;
	const conditional = Game_Event.toBasicConditional(subEventCommand);
	const met = conditional.isMet();
	if (met) return false;
	return true;
};
/**
* Sets a choice to be hidden- or not. The choiceIndex parameter is 0-based. Set the shouldHide parameter to true for a
* given choice to hide it.
* @param {number} choiceIndex The 1-based number of the choice.
* @param {boolean=} shouldHide Whether or not the choice should be hidden; defaults to true.
*/
Game_Interpreter.prototype.setChoiceHidden = function(choiceIndex, shouldHide = true) {
	$gameMessage.hideChoice(choiceIndex, shouldHide);
};
/**
* Gets the common event id.
* @returns {number} The commonEventId.
*/
Game_Interpreter.prototype.commonEventId = function() {
	return this._commonEventId;
};

//#endregion
//#region src/plugins/message/core/objects/Game_Event.js
/**
* A filter function for only including comment event commands relevant to choice conditionals.
* @param {RPG_EventListCommand} command The command being evaluated.
* @returns {boolean}
*/
Game_Event.filterCommentCommandsForBasicConditionals = function(command) {
	const [comment] = command.parameters;
	if (!comment) return false;
	const { LeaderChoiceConditional, NotLeaderChoiceConditional, SwitchOnChoiceConditional, SwitchOffChoiceConditional } = J.MESSAGE.RegExp;
	return [
		LeaderChoiceConditional,
		NotLeaderChoiceConditional,
		SwitchOnChoiceConditional,
		SwitchOffChoiceConditional
	].some((regex) => regex.test(comment));
};
/**
* Converts a known comment event command into a conditional for basic control.
* @param {RPG_EventListCommand} commentCommand The comment command to parse into a conditional.
* @returns {BasicChoiceConditional}
*/
Game_Event.toBasicConditional = function(commentCommand) {
	const [comment] = commentCommand.parameters;
	let result = null;
	let type = String.empty;
	switch (true) {
		case J.MESSAGE.RegExp.LeaderChoiceConditional.test(comment):
			result = J.MESSAGE.RegExp.LeaderChoiceConditional.exec(comment);
			type = BasicChoiceConditional.Types.Leader;
			break;
		case J.MESSAGE.RegExp.NotLeaderChoiceConditional.test(comment):
			result = J.MESSAGE.RegExp.NotLeaderChoiceConditional.exec(comment);
			type = BasicChoiceConditional.Types.NotLeader;
			break;
		case J.MESSAGE.RegExp.SwitchOnChoiceConditional.test(comment):
			result = J.MESSAGE.RegExp.SwitchOnChoiceConditional.exec(comment);
			type = BasicChoiceConditional.Types.SwitchOn;
			break;
		case J.MESSAGE.RegExp.SwitchOffChoiceConditional.test(comment):
			result = J.MESSAGE.RegExp.SwitchOffChoiceConditional.exec(comment);
			type = BasicChoiceConditional.Types.SwitchOff;
			break;
	}
	const [, val] = result;
	const parsedVal = JsonMapper.parseObject(val);
	return new BasicChoiceConditional(type, parsedVal);
};

//#endregion
//#region src/plugins/message/core/windows/Window_Base.js
/**
* Extends {@link #convertEscapeCharacters}.<br/>
* Adds handling for new text codes for various database objects.
*/
J.MESSAGE.Aliased.Window_Base.set("convertEscapeCharacters", Window_Base.prototype.convertEscapeCharacters);
Window_Base.prototype.convertEscapeCharacters = function(text) {
	let textToModify = text;
	textToModify = this.translateQuestTextCode(textToModify);
	textToModify = this.translateWeaponTextCode(textToModify);
	textToModify = this.translateArmorTextCode(textToModify);
	textToModify = this.translateItemTextCode(textToModify);
	textToModify = this.translateStateTextCode(textToModify);
	textToModify = this.translateSkillTextCode(textToModify);
	textToModify = this.translateEnemyTextCode(textToModify);
	textToModify = this.translateElementTextCode(textToModify);
	textToModify = this.translateEquipTypeTextCode(textToModify);
	textToModify = this.translateWeaponTypeTextCode(textToModify);
	textToModify = this.translateArmorTypeTextCode(textToModify);
	textToModify = this.translateSkillTypeTextCode(textToModify);
	textToModify = this.translateSdpTextCode(textToModify);
	textToModify = this.translateParamTextCode(textToModify);
	return J.MESSAGE.Aliased.Window_Base.get("convertEscapeCharacters").call(this, textToModify);
};
/**
* Translates the text code into the name and icon of the weapon.
* @param {string} text The text that has a text code in it.
* @returns {string}
*/
Window_Base.prototype.translateWeaponTextCode = function(text) {
	return text.replace(/\\weapon\[(\d+)]/gi, (_, p1) => {
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
Window_Base.prototype.translateArmorTextCode = function(text) {
	return text.replace(/\\armor\[(\d+)]/gi, (_, p1) => {
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
Window_Base.prototype.translateItemTextCode = function(text) {
	return text.replace(/\\item\[(\d+)]/gi, (_, p1) => {
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
Window_Base.prototype.translateStateTextCode = function(text) {
	return text.replace(/\\state\[(\d+)]/gi, (_, p1) => {
		const stateColor = 6;
		const stateId = parseInt(p1);
		let name = "(Basic Attack)";
		let iconIndex = 0;
		if (stateId > 0) {
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
Window_Base.prototype.translateSkillTextCode = function(text) {
	return text.replace(/\\skill\[(\d+)]/gi, (_, p1) => {
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
Window_Base.prototype.translateEnemyTextCode = function(text) {
	return text.replace(/\\enemy\[(\d+)]/gi, (_, p1) => {
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
Window_Base.prototype.translateElementTextCode = function(text) {
	return text.replace(/\\element\[(\d+)]/gi, (_, p1) => {
		const elementId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.element(elementId);
		const colorId = ColorManager.elementColorIndex(elementId);
		const name = TextManager.element(elementId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the skill type.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateSkillTypeTextCode = function(text) {
	return text.replace(/\\skillType\[(\d+)]/gi, (_, p1) => {
		const skillTypeId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.skillType(skillTypeId);
		const colorId = ColorManager.skillType(skillTypeId);
		const name = TextManager.skillType(skillTypeId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the weapon type.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateWeaponTypeTextCode = function(text) {
	return text.replace(/\\weaponType\[(\d+)]/gi, (_, p1) => {
		const weaponTypeId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.weaponType(weaponTypeId);
		const colorId = ColorManager.weaponType(weaponTypeId);
		const name = TextManager.weaponType(weaponTypeId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the armor type.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateArmorTypeTextCode = function(text) {
	return text.replace(/\\armorType\[(\d+)]/gi, (_, p1) => {
		const armorTypeId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.armorType(armorTypeId);
		const colorId = ColorManager.armorType(armorTypeId);
		const name = TextManager.armorType(armorTypeId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the equip type.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateEquipTypeTextCode = function(text) {
	return text.replace(/\\equipType\[(\d+)]/gi, (_, p1) => {
		const equipTypeId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.equipType(equipTypeId);
		const colorId = ColorManager.equipType(equipTypeId);
		const name = TextManager.equipType(equipTypeId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the corresponding SDP.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateSdpTextCode = function(text) {
	if (!J.SDP) return text;
	return text.replace(/\\sdp\[(.*)]/gi, (_, p1) => {
		const sdpKey = p1 ?? String.empty;
		if (!sdpKey) return text;
		const sdp = J.SDP.Metadata.panelsMap.get(sdpKey);
		if (!sdp) return text;
		const { name, rarity: colorIndex, iconIndex } = sdp;
		return `\\I[${iconIndex}]\\C[${colorIndex}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the corresponding catalog parameter.<br/>
* Unlike the other lookups in this file, an unresolvable key is never silently swallowed- an
* unregistered STRING_KEY is always an authoring mistake (a typo, or a plugin whose registration
* didn't load), so it renders as an unmistakable red "!!! UNKNOWN PARAM !!!" with a question-mark
* icon instead of passing through untouched or vanishing quietly.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateParamTextCode = function(text) {
	return text.replace(/\\param\[([\w-]+)]/gi, (_, p1) => {
		const parameterKey = p1 ?? String.empty;
		if (!TextManager.hasParameter(parameterKey)) {
			const unknownIconIndex = 93;
			const unknownColorIndex = 18;
			return `\\I[${unknownIconIndex}]\\C[${unknownColorIndex}]!!! UNKNOWN PARAM !!!\\C[0]`;
		}
		const name = TextManager.parameterLabel(parameterKey);
		const iconIndex = IconManager.parameterIcon(parameterKey);
		const colorIndex = ColorManager.parameterColor(parameterKey);
		return `\\I[${iconIndex}]\\C[${colorIndex}]${name}\\C[0]`;
	});
};
/**
* Translates the quest text code into the quest's name and icon.
*
* Core does not know what a quest is- this is a no-op hook that J-Omnipedia's quest extension
* overrides to supply the real behavior. Core never probes for extensions.
* @param {string} text The text that may contain a quest text code.
* @returns {string} The text, unchanged.
*/
Window_Base.prototype.translateQuestTextCode = function(text) {
	return text;
};

//#endregion
//#region src/plugins/message/core/windows/Window_ChoiceList.js
/**
* Extends {@link makeCommandList}.<br/>
* Post-modifies the commands to remove "hidden" choices.
*/
J.MESSAGE.Aliased.Window_ChoiceList.set("makeCommandList", Window_ChoiceList.prototype.makeCommandList);
Window_ChoiceList.prototype.makeCommandList = function() {
	$gameMessage.restoreChoices();
	this.clearChoiceMap();
	J.MESSAGE.Aliased.Window_ChoiceList.get("makeCommandList").call(this);
	let needsUpdate = false;
	for (let i = this.commandList().length; i > -1; i--) {
		if ($gameMessage.isChoiceHidden(i)) {
			this.commandList().splice(i, 1);
			$gameMessage._choices.splice(i, 1);
			needsUpdate = true;
		} else {
			this.choiceMap().unshift(i);
		}
	}
	if (needsUpdate === true) {
		this.updatePlacement();
	}
};
Window_ChoiceList.prototype.clearChoiceMap = function() {
	this.setChoiceMap([]);
};
/**
* Overwrites {@link callOkHandler}.<br/>
* Uses the index of our custom list instead of the original list.
*/
Window_ChoiceList.prototype.callOkHandler = function() {
	$gameMessage.onChoice(this.choiceMap()[this.index()]);
	this.messageWindow().terminateMessage();
	this.close();
};
/**
* Gets the choice map.
* @returns {number[]} The choiceMap.
*/
Window_ChoiceList.prototype.choiceMap = function() {
	return this._choiceMap;
};
/**
* Sets the choice map.
* @param {number[]} newChoiceMap The new choiceMap.
*/
Window_ChoiceList.prototype.setChoiceMap = function(newChoiceMap) {
	this._choiceMap = newChoiceMap;
};

//#endregion
//# sourceMappingURL=J-MessageTextCodes.js.map