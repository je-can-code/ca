//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CMS_E] A redesign of the equip menu.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * This is a redesign of the equipment menu.
 * It includes the ability to see more parameters when changing equips.
 * You can also now press the square button (or equivalent of) to view the
 * detailed information relating to JABS (if applicable).
 * ============================================================================
 */

//#region src/plugins/cms/equip/_metadata/_pluginMetadata.js
var J_CmsEquip_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/cms/equip/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "2.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.CMS_E = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.CMS_E.Metadata = new J_CmsEquip_PluginMetadata("J-CMS-Equip", "1.0.0");
J.CMS_E.Aliased = {
	Scene_Equip: {},
	Window_EquipItem: {},
	Window_EquipSlot: {}
};

//#endregion
//#region src/plugins/cms/equip/windows/Window_MoreEquipData.js
/**
* A window designed to display "more" data associated with the equipment.
*/
var Window_MoreEquipData = class extends Window_MoreData {
	constructor(rect) {
		super(rect);
		this.contentsBack.paintOpacity = 255;
	}
	/**
	* Compiles the "more data" for the currently selected equipment.
	*/
	makeCommandList() {
		super.makeCommandList();
		if (!this.canBuildCommands()) {
			this.adjustWindowHeight();
			return;
		}
		this.buildCommands();
		this.adjustWindowHeight();
	}
	/**
	* Determines whether or not commands for the "more data" window can be built.
	* @returns {boolean} True if the commands can be built, false otherwise.
	*/
	canBuildCommands() {
		if (!this.item) return false;
		if (!this.actor) return false;
		return true;
	}
	/**
	* Build all commands for this particular hovered item.
	*/
	buildCommands() {
		this.addJaftingRefinementData();
		this.addBaseParameterData();
		this.addJabsEquipmentData();
		this.addEquipmentTraitData();
	}
	/**
	* Add any applicable base parameter commands from the equipment.
	*/
	addBaseParameterData() {
		const forEacher = (value, paramIdIndex) => {
			if (!value) return;
			const baseValue = this.item.params[paramIdIndex];
			const commandName = `${TextManager.param(paramIdIndex)}: ${baseValue}`;
			const command = new WindowCommandBuilder(commandName).setIconIndex(IconManager.param(paramIdIndex)).build();
			this.addBuiltCommand(command);
		};
		this.item.params.forEach(forEacher, this);
	}
	/**
	* Adds all commands related to JABS on the equipment.
	*/
	addJabsEquipmentData() {
		this.addHitsCommand();
		this.addSkillCommands();
		this.addSpeedBoostCommand();
	}
	/**
	* Adds per-connection bonus hit lines from scoped JABS tags, plus a weapon hit-count summary.
	*/
	addHitsCommand() {
		const { item } = this;
		const isWeapon = item.isWeapon();
		const globalHits = item.jabsBonusHitsScopeGlobal;
		const basicHits = item.jabsBonusHitsScopeBasic;
		const skillHits = item.jabsBonusHitsScopeSkill;
		const hasAnyScope = globalHits > 0 || basicHits > 0 || skillHits > 0;
		if (hasAnyScope === false && isWeapon === false) return;
		const hitBonusIcon = IconManager.jabsParameterIcon(IconManager.JABS_PARAMETER.BONUS_HITS);
		const pushScopeRow = (label, value) => {
			const text = `${label}: +${value}`;
			const row = new WindowCommandBuilder(text).setIconIndex(hitBonusIcon).build();
			this.addBuiltCommand(row);
		};
		if (globalHits > 0) pushScopeRow("Bonus hits (global)", globalHits);
		if (basicHits > 0) pushScopeRow("Bonus hits (basic)", basicHits);
		if (skillHits > 0) pushScopeRow("Bonus hits (skill)", skillHits);
		if (isWeapon) {
			const weaponHitTotal = 1 + globalHits + basicHits;
			const hitCountRow = new WindowCommandBuilder(`Hit count: x${weaponHitTotal}`).setIconIndex(hitBonusIcon).build();
			this.addBuiltCommand(hitCountRow);
		}
	}
	/**
	* Add the the appropriate skill and combo commands as-needed.
	*/
	addSkillCommands() {
		const { jabsSkillId } = this.item;
		if (!jabsSkillId) return;
		const skill = this.actor.skill(jabsSkillId);
		const comboSkillList = skill.getComboSkillIdList(this.actor);
		let baseAttackSkillCommand = this.item.isArmor() ? `Offhand Skill` : `Attack Skill`;
		const hasCombo = comboSkillList.length > 0;
		if (hasCombo) {
			baseAttackSkillCommand = `Combo Starter`;
		}
		const { name, iconIndex } = skill;
		const attackSkillCommand = `${baseAttackSkillCommand}: \\C[2]${name}\\C[0]`;
		const command = new WindowCommandBuilder(attackSkillCommand).setIconIndex(iconIndex).build();
		this.addBuiltCommand(command);
		if (hasCombo) {
			const forEacher = (comboSkillId, index) => {
				const comboSkill = this.actor.skill(comboSkillId);
				const comboSkillCommandName = `Combo Skill ${index + 1}: \\C[2]${comboSkill.name}\\C[0]`;
				const comboCommand = new WindowCommandBuilder(comboSkillCommandName).setIconIndex(iconIndex).build();
				this.addBuiltCommand(comboCommand);
			};
			comboSkillList.forEach(forEacher, this);
		}
	}
	/**
	* Add any speed boost adjustments from the equipment.
	*/
	addSpeedBoostCommand() {
		const { jabsSpeedBoost } = this.item;
		if (!jabsSpeedBoost) return;
		const speedBoostCommand = `Speed Boost: ${jabsSpeedBoost}`;
		const speedBoostIcon = IconManager.jabsParameterIcon(IconManager.JABS_PARAMETER.SPEED_BOOST);
		const command = new WindowCommandBuilder(speedBoostCommand).setIconIndex(speedBoostIcon).build();
		this.addBuiltCommand(command);
	}
	/**
	* Adds all commands related to JAFTING on the equipment.
	*/
	addJaftingRefinementData() {
		const { jaftingMaxRefineCount, jaftingMaxTraitCount, jaftingNotRefinementBase, jaftingNotRefinementMaterial, jaftingRefinedCount, jaftingUnrefinable } = this.item;
		if (jaftingUnrefinable) {
			const unrefinableCommand = `Unrefinable`;
			const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.UNREFINABLE);
			const unrefinableColor = 2;
			this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
			return;
		}
		if (jaftingNotRefinementBase) {
			const unrefinableCommand = `Only Refine as Material`;
			const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.NOT_BASE);
			const unrefinableColor = 2;
			this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
		}
		if (jaftingNotRefinementMaterial) {
			const unrefinableCommand = `Only Refine as Base`;
			const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.NOT_MATERIAL);
			const unrefinableColor = 2;
			this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
		}
		let maxRefineCommand = `Refinement: ${jaftingRefinedCount}`;
		let maxRefineIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.TIMES_REFINED);
		if (jaftingMaxRefineCount) {
			maxRefineCommand += ` / ${jaftingMaxRefineCount}`;
			if (jaftingMaxRefineCount === jaftingRefinedCount) {
				maxRefineIcon = 91;
			}
		}
		this.addCommand(maxRefineCommand, null, true, null, maxRefineIcon);
		const maxTraitIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.MAX_TRAITS);
		const currentTraitCount = JaftingManager.parseTraits(this.item).length;
		let maxTraitCommand = `Transferable Traits: ${currentTraitCount}`;
		if (jaftingMaxTraitCount) {
			maxTraitCommand += ` / ${jaftingMaxTraitCount}`;
		}
		this.addCommand(maxTraitCommand, null, true, null, maxTraitIcon);
	}
	/**
	* Adds all trait commands on the equipment.
	*/
	addEquipmentTraitData() {
		const allTraits = this.item.traits;
		if (!allTraits.length) return;
		const xparamNoPercents = [
			0,
			2,
			7,
			8,
			9
		];
		const sparamNoPercents = [1];
		const dividerIndex = allTraits.findIndex((trait) => trait.code === J.BASE.Traits.NO_DISAPPEAR);
		const hasDivider = dividerIndex !== -1;
		if (hasDivider) {
			this.addCommand(`BASE TRAITS`, null, true, null, 16, 30);
		}
		allTraits.forEach((t) => {
			const convertedTrait = new JAFTING_Trait(t.code, t.dataId, t.value);
			let commandName = convertedTrait.nameAndValue;
			let commandColor = 0;
			switch (convertedTrait._code) {
				case 21:
					const paramId = convertedTrait._dataId;
					const paramBase = this.actor.paramBase(paramId);
					const bonus = paramBase * (convertedTrait._value - 1);
					const sign = bonus >= 0 ? "+" : "-";
					commandName += ` \\C[6](${sign}${bonus.toFixed(2)})\\C[0]`;
					break;
				case 22:
					const xparamId = convertedTrait._dataId;
					if (xparamNoPercents.includes(xparamId)) {
						commandName = commandName.replace("%", String.empty);
					}
					break;
				case 23:
					const sparamId = convertedTrait._dataId;
					if (sparamNoPercents.includes(sparamId)) {
						commandName = commandName.replace("%", String.empty);
					}
					break;
				case 63:
					commandName = convertedTrait.name;
					commandColor = 30;
					break;
			}
			const commandIcon = IconManager.trait(convertedTrait);
			this.addCommand(commandName, null, true, null, commandIcon, commandColor);
		});
	}
};

//#endregion
//#region src/plugins/cms/equip/scenes/Scene_Equip.js
/**
* Initializes this scene.
*/
Scene_Equip.prototype.initialize = function() {
	Scene_MenuBase.prototype.initialize.call(this);
	this._j = this._j || {};
	this._j.moreVisible = false;
};
/**
* OVERWRITE Removes the buttons because fuck the buttons.
*/
Scene_Equip.prototype.createButtons = function() {};
/**
* OVERWRITE Removes the command window, because who even uses optimize?
*/
Scene_Equip.prototype.create = function() {
	Scene_MenuBase.prototype.create.call(this);
	this.createHelpWindow();
	this.createStatusWindow();
	this.createMoreDataWindow();
	this.createSlotWindow();
	this.createItemWindow();
	this.refreshActor();
	this._slotWindow.activate();
	this._slotWindow.select(0);
	this._slotWindow.onIndexChange();
};
/**
* OVERWRITE Replaces the button area height with 0 because fuck buttons.
* @returns {number}
*/
Scene_Equip.prototype.buttonAreaHeight = () => 0;
/**
* OVERWRITE Modifies the width of the equip status window.
*/
Scene_Equip.prototype.statusWidth = () => 1024;
/**
* Overrides {@link #helpWindowRect}.<br/>
* Changes the width to be what we want it to be.
* @returns {Rectangle}
*/
Scene_Equip.prototype.helpWindowRect = function() {
	const wx = 0;
	const wy = this.helpAreaTop();
	const ww = this.statusWidth();
	const wh = this.helpAreaHeight();
	return new Rectangle(wx, wy, ww, wh);
};
/**
* OVERWRITE Modifies the size of the equip slots window.
* @returns {Rectangle}
*/
Scene_Equip.prototype.slotWindowRect = function() {
	const wx = this.statusWidth();
	const wy = this.mainAreaTop();
	const ww = Graphics.boxWidth - this.statusWidth();
	const wh = this.slotWindowHeight(6);
	return new Rectangle(wx, wy, ww, wh);
};
/**
* Calculates the slot window height based on slot count.
* @param {number} equipSlotCount The number of slots.
* @returns {number} The calculated height for the slot window.
*/
Scene_Equip.prototype.slotWindowHeight = (equipSlotCount) => 48 * equipSlotCount;
/**
* Toggles the visibility of the "more" window.
*/
Scene_Equip.prototype.switchToMoreDataFromEquipSlots = function() {
	this._j.moreVisible = !this._j.moreVisible;
	if (this._j.moreVisible) {
		this._slotWindow.refreshMoreData();
		this._slotWindow.deactivate();
		this._moreDataWindow.setHandler("cancel", this.backToSlotsList.bind(this));
		this._moreDataWindow.show();
		this._moreDataWindow.activate();
		this._moreDataWindow.select(0);
	} else {
		this._moreDataWindow.hide();
		this._moreDataWindow.deactivate();
		this._moreDataWindow.deselect();
		this._slotWindow.activate();
	}
};
/**
* Toggles the visibility of the "more" window.
*/
Scene_Equip.prototype.switchToMoreDataFromEquipItems = function() {
	this._j.moreVisible = !this._j.moreVisible;
	if (this._j.moreVisible) {
		this._itemWindow.refreshMoreData();
		this._itemWindow.deactivate();
		this._moreDataWindow.setHandler("cancel", this.backToItemsList.bind(this));
		this._moreDataWindow.show();
		this._moreDataWindow.activate();
		this._moreDataWindow.select(0);
	} else {
		this._moreDataWindow.hide();
		this._moreDataWindow.deactivate();
		this._moreDataWindow.deselect();
		this._itemWindow.activate();
	}
};
/**
* Extends the slot window to include our additional actions.
*/
J.CMS_E.Aliased.Scene_Equip.createSlotWindow = Scene_Equip.prototype.createSlotWindow;
Scene_Equip.prototype.createSlotWindow = function() {
	J.CMS_E.Aliased.Scene_Equip.createSlotWindow.call(this);
	this._slotWindow.setHandler("more", this.switchToMoreDataFromEquipSlots.bind(this));
	this._slotWindow.setHandler("pagedown", this.nextActor.bind(this));
	this._slotWindow.setHandler("pageup", this.previousActor.bind(this));
	this._slotWindow.setMoreDataWindow(this._moreDataWindow);
};
/**
* OVERWRITE Prevents hiding the item window.
*/
Scene_Equip.prototype.createItemWindow = function() {
	const rect = this.itemWindowRect();
	this._itemWindow = new Window_EquipItem(rect);
	this._itemWindow.setHelpWindow(this._helpWindow);
	this._itemWindow.setStatusWindow(this._statusWindow);
	this._itemWindow.setHandler("more", this.switchToMoreDataFromEquipItems.bind(this));
	this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
	this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
	this._itemWindow.setMoreDataWindow(this._moreDataWindow);
	this._slotWindow.setItemWindow(this._itemWindow);
	this.addWindow(this._itemWindow);
};
/**
* Creates the more data window.
*/
Scene_Equip.prototype.createMoreDataWindow = function() {
	const rect = this.moreDataRect();
	this._moreDataWindow = new Window_MoreEquipData(rect);
	this._moreDataWindow.hide();
	this._moreDataWindow.deactivate();
	this._moreDataWindow.deselect();
	this._moreDataWindow.opacity = 255;
	this.addWindow(this._moreDataWindow);
};
Scene_Equip.prototype.moreDataRect = function() {
	const width = 500;
	const wx = this.statusWidth() - width - 4;
	const wy = this.slotWindowRect().y - 4;
	const ww = width;
	const wh = Graphics.boxHeight - wy;
	return new Rectangle(wx, wy, ww, wh);
};
Scene_Equip.prototype.backToSlotsList = function() {
	this.switchToMoreDataFromEquipSlots();
};
Scene_Equip.prototype.backToItemsList = function() {
	this.switchToMoreDataFromEquipItems();
};
/**
* Gets the rectangle that defines the shape of this window.
* @returns {Rectangle}
*/
Scene_Equip.prototype.itemWindowRect = function() {
	const wx = this.statusWidth();
	const wy = this.mainAreaTop() + this._slotWindow.height;
	const ww = Graphics.boxWidth - this.statusWidth();
	const wh = Graphics.boxHeight - wy;
	return new Rectangle(wx, wy, ww, wh);
};
/**
* OVERWRITE Prevents hiding the equip window.
*/
Scene_Equip.prototype.onSlotOk = function() {
	this._itemWindow.activate();
	this._itemWindow.select(0);
};
/**
* OVERWRITE Replaces the slot cancel functionality with the end of the scene.
*/
Scene_Equip.prototype.onSlotCancel = function() {
	this.popScene();
};
/**
* OVERWRITE Prevents hiding the item window.
*/
Scene_Equip.prototype.hideItemWindow = function() {
	this._slotWindow.activate();
	this._itemWindow.deselect();
};
/**
* OVERWRITE Prevents trying to activate a window that was removed from the scene.
*/
Scene_Equip.prototype.onActorChange = function() {
	Scene_MenuBase.prototype.onActorChange.call(this);
	this.refreshActor();
	this.hideItemWindow();
};
/**
* Extends the actor refresh to include the more data window.
*/
J.CMS_E.Aliased.Scene_Equip.refreshActor = Scene_Equip.prototype.refreshActor;
Scene_Equip.prototype.refreshActor = function() {
	J.CMS_E.Aliased.Scene_Equip.refreshActor.call(this);
	const actor = this.actor();
	this._moreDataWindow.setActor(actor);
};

//#endregion
//#region src/plugins/cms/equip/windows/Window_EquipItem.js
/**
* Extends the `.initialize()` to include tracking for the more equip data window.
*/
J.CMS_E.Aliased.Window_EquipItem.initialize = Window_EquipItem.prototype.initialize;
Window_EquipItem.prototype.initialize = function(rect) {
	J.CMS_E.Aliased.Window_EquipItem.initialize.call(this, rect);
	/**
	* The more data window to manipulate.
	* @type {Window_MoreEquipData}
	*/
	this._moreDataWindow = null;
};
/**
* Refreshes the more data window.
*/
Window_EquipItem.prototype.refreshMoreData = function() {
	this.onIndexChange();
};
/**
* Updates the "more" window to point to the new index's item.
*/
Window_EquipItem.prototype.onIndexChange = function() {
	this._moreDataWindow.setItem(this.item());
};
/**
* Associates the more equip data window to this one for observation.
* @param {Window_MoreEquipData} moreDataWindow The window to attach to this.
*/
Window_EquipItem.prototype.setMoreDataWindow = function(moreDataWindow) {
	this._moreDataWindow = moreDataWindow;
};

//#endregion
//#region src/plugins/cms/equip/windows/Window_EquipSlot.js
/**
* Extends the `.initialize()` to include tracking for the more equip data window.
*/
J.CMS_E.Aliased.Window_EquipSlot.initialize = Window_EquipSlot.prototype.initialize;
Window_EquipSlot.prototype.initialize = function(rect) {
	J.CMS_E.Aliased.Window_EquipSlot.initialize.call(this, rect);
	/**
	* The more data window to manipulate.
	* @type {Window_MoreEquipData}
	*/
	this._moreDataWindow = null;
};
/**
* Refreshes the more data window.
*/
Window_EquipSlot.prototype.refreshMoreData = function() {
	this.onIndexChange();
};
/**
* Updates the "more" window to point to the new index's item.
*/
Window_EquipSlot.prototype.onIndexChange = function() {
	this._moreDataWindow.setItem(this.item());
};
/**
* Associates the more equip data window to this one for observation.
* @param {Window_MoreEquipData} moreDataWindow The window to attach to this.
*/
Window_EquipSlot.prototype.setMoreDataWindow = function(moreDataWindow) {
	this._moreDataWindow = moreDataWindow;
};

//#endregion
//#region src/plugins/cms/equip/windows/Window_EquipStatus.js
/**
* Gets the parameter bitmap width.
* @returns {number} The parameter bitmap width.
*/
Window_EquipStatus.prototype.paramWidth = () => 64;
/**
* Draws all parameters.
*/
Window_EquipStatus.prototype.drawAllParams = function() {
	this.drawAllBParams(0, 192);
	this.drawAllXParams(360, 0);
	this.drawAllSParams(360, 380);
};
/**
* Draws all b-parameters and their changed values.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawAllBParams = function(ox, oy) {
	const params = [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7
	];
	params.forEach((_, paramId) => {
		this.drawBParamName(paramId, ox, oy);
		this.drawCurrentBParam(paramId, ox, oy);
		this.drawNextBParam(paramId, ox, oy);
	});
};
/**
* Draws the name of the parameter.
* @param {number} paramId The parameter id.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawBParamName = function(paramId, ox, oy) {
	const paramWidth = this.paramWidth();
	const row = paramId;
	const rowY = this.lineHeight() * row + oy;
	const paramIcon = IconManager.param(paramId);
	const paramName = TextManager.param(paramId);
	this.drawIcon(paramIcon, ox, rowY);
	this.resetTextColor();
	this.drawText(paramName, ox + 32, rowY, paramWidth * 2, "left");
};
/**
* Draws the current value that the parameter is now.
* @param {number} paramId The parameter id.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawCurrentBParam = function(paramId, ox, oy) {
	const paramWidth = this.paramWidth();
	const row = paramId;
	const rowX = ox + 100 + paramWidth;
	const rowY = this.lineHeight() * row + oy;
	this.resetTextColor();
	const current = this._actor.param(paramId);
	this.drawText(current, rowX, rowY, paramWidth, "right");
};
/**
* Draws the projected value that the parameter will be if equipped.
* @param {number} paramId The parameter id.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawNextBParam = function(paramId, ox, oy) {
	if (!this._tempActor) return;
	const paramWidth = this.paramWidth();
	const row = paramId;
	const rowX = ox + 160 + paramWidth;
	const rowY = this.lineHeight() * row + oy;
	const newValue = this._tempActor.param(paramId);
	const diffValue = newValue - this._actor.param(paramId);
	this.drawModifierArrow(rowX + 16, rowY, diffValue);
	this.changeTextColor(ColorManager.paramchangeTextColor(diffValue));
	this.drawText(newValue, rowX + 56, rowY, paramWidth, "left");
};
/**
* Draws all x-params.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawAllXParams = function(ox, oy) {
	const xparams = [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9
	];
	xparams.forEach((_, xparamId) => {
		this.drawXParamName(xparamId, ox, oy);
		this.drawCurrentXParam(xparamId, ox, oy);
		this.drawNextXParam(xparamId, ox, oy);
	});
};
/**
* Draws the name of the parameter.
* @param {number} xparamId The parameter id.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawXParamName = function(xparamId, ox, oy) {
	const paramWidth = this.paramWidth();
	const row = xparamId;
	const rowY = this.lineHeight() * row + oy;
	const paramIcon = IconManager.xparam(xparamId);
	const paramName = TextManager.xparam(xparamId);
	this.drawIcon(paramIcon, ox, rowY);
	this.resetTextColor();
	this.drawText(paramName, ox + 32, rowY, paramWidth * 2, "left");
};
/**
* Draws the current value that the parameter is now.
* @param {number} xparamId The parameter id.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawCurrentXParam = function(xparamId, ox, oy) {
	const paramWidth = this.paramWidth();
	const row = xparamId;
	const rowX = ox + 100 + paramWidth;
	const rowY = this.lineHeight() * row + oy;
	this.resetTextColor();
	const current = (this._actor.xparam(xparamId) * 100).toFixed(0);
	this.drawText(current, rowX, rowY, paramWidth, "right");
};
/**
* Draws the projected value that the parameter will be if equipped.
* @param {number} xparamId The parameter id.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawNextXParam = function(xparamId, ox, oy) {
	if (!this._tempActor) return;
	const paramWidth = this.paramWidth();
	const row = xparamId;
	const rowX = ox + 160 + paramWidth;
	const rowY = this.lineHeight() * row + oy;
	const newValue = this._tempActor.xparam(xparamId);
	const displayedNewValue = (newValue * 100).toFixed(0);
	const diffValue = newValue - this._actor.xparam(xparamId);
	this.drawModifierArrow(rowX + 16, rowY, diffValue);
	this.changeTextColor(ColorManager.paramchangeTextColor(diffValue));
	this.drawText(displayedNewValue, rowX + 56, rowY, paramWidth, "left");
};
/**
* Draws all s-params.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawAllSParams = function(ox, oy) {
	const sparams = [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9
	];
	sparams.forEach((_, xparamId) => {
		this.drawSParamName(xparamId, ox, oy);
		this.drawCurrentSParam(xparamId, ox, oy);
		this.drawNextSParam(xparamId, ox, oy);
	});
};
/**
* Draws the name of the parameter.
* @param {number} sparamId The parameter id.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawSParamName = function(sparamId, ox, oy) {
	const paramWidth = this.paramWidth();
	const row = sparamId;
	const rowY = this.lineHeight() * row + oy;
	const paramIcon = IconManager.sparam(sparamId);
	const paramName = TextManager.sparam(sparamId);
	this.drawIcon(paramIcon, ox, rowY);
	this.resetTextColor();
	this.drawText(paramName, ox + 32, rowY, paramWidth * 2, "left");
};
/**
* Draws the current value that the parameter is now.
* @param {number} sparamId The parameter id.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawCurrentSParam = function(sparamId, ox, oy) {
	const paramWidth = this.paramWidth();
	const row = sparamId;
	const rowX = ox + 100 + paramWidth;
	const rowY = this.lineHeight() * row + oy;
	this.resetTextColor();
	const current = (this._actor.sparam(sparamId) * 100 - 100).toFixed(0);
	this.drawText(current, rowX, rowY, paramWidth, "right");
};
/**
* Draws the projected value that the parameter will be if equipped.
* @param {number} sparamId The parameter id.
* @param {number} ox The origin x.
* @param {number} oy The origin y.
*/
Window_EquipStatus.prototype.drawNextSParam = function(sparamId, ox, oy) {
	if (!this._tempActor) return;
	const paramWidth = this.paramWidth();
	const row = sparamId;
	const rowX = ox + 160 + paramWidth;
	const rowY = this.lineHeight() * row + oy;
	const newValue = this._tempActor.sparam(sparamId);
	const displayedNewValue = (newValue * 100 - 100).toFixed(0);
	const diffValue = newValue - this._actor.sparam(sparamId);
	this.drawModifierArrow(rowX + 16, rowY, diffValue);
	this.changeTextColor(ColorManager.paramchangeTextColor(diffValue));
	this.drawText(displayedNewValue, rowX + 56, rowY, paramWidth, "left");
};
Window_EquipStatus.prototype.drawModifierArrow = function(x, y, diffValue) {
	const rightArrowWidth = this.rightArrowWidth();
	this.changeTextColor(ColorManager.systemColor());
	const character = this.arrowCharacter(diffValue);
	this.drawText(character, x, y, rightArrowWidth, "center");
};
Window_EquipStatus.prototype.arrowCharacter = function(diffValue) {
	if (diffValue > 0) {
		return "↗️";
	} else if (diffValue < 0) {
		return "↘️";
	} else {
		return "→";
	}
};

//#endregion
//# sourceMappingURL=J-CMS-Equip.js.map