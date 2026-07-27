//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 CMS_E] A redesign of the equip menu.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-CMS
 * @orderAfter J-Base
 * @orderAfter J-CMS
 * @help
 * ============================================================================
 * This is a redesign of the equipment menu.
 * It includes the ability to see more parameters when changing equips.
 * You can also now press the square button (or equivalent of) to view the
 * detailed information relating to JABS (if applicable).
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it is purely a scene/window
 * redesign of the native equip menu.
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Added a context action on the equip slot list to unequip the
 *    currently-selected slot directly, without opening the item list.
 *    Renamed slot-window handler symbols pagedown/pageup to
 *    actor-next/actor-prev.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//#region src/plugins/cms/ext/equip/_metadata/_pluginMetadata.js
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
//#region src/plugins/cms/ext/equip/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
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
J.CMS_E.Metadata = new J_CmsEquip_PluginMetadata("J-CMS-Equip", "1.1.0");
J.CMS_E.Aliased = {
	Scene_Equip: new Map(),
	Window_EquipItem: new Map(),
	Window_EquipSlot: new Map()
};

//#endregion
//#region src/plugins/cms/ext/equip/windows/Window_MoreEquipData.js
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
		this.addHitsCommand();
		this.addEquipmentTraitData();
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
		const paramTraitCodes = [
			J.BASE.Traits.B_PARAMETER,
			J.BASE.Traits.X_PARAMETER,
			J.BASE.Traits.S_PARAMETER
		];
		const allTraits = this.item.traits.filter((trait) => paramTraitCodes.includes(trait.code) === false);
		if (!allTraits.length) return;
		const hasDivider = allTraits.some((trait) => trait.code === J.BASE.Traits.NO_DISAPPEAR);
		if (hasDivider) {
			this.addCommand(`BASE TRAITS`, null, true, null, 16, 30);
		}
		allTraits.forEach((t) => {
			const convertedTrait = new JAFTING_Trait(t.code, t.dataId, t.value);
			let commandName = convertedTrait.nameAndValue;
			let commandColor = 0;
			if (convertedTrait._code === J.BASE.Traits.NO_DISAPPEAR) {
				commandName = convertedTrait.name;
				commandColor = 30;
			}
			const commandIcon = IconManager.trait(convertedTrait);
			this.addCommand(commandName, null, true, null, commandIcon, commandColor);
		});
	}
};

//#endregion
//#region src/plugins/cms/ext/equip/windows/Window_EquipActorRibbon.js
/**
* A ribbon window for the equip scene that displays the currently equipped actor's face and name.
* Replaces the old full face portrait that vanilla `Window_EquipStatus` drew internally, freeing
* up most of that window's vertical space for the parameter catalog.
*/
var Window_EquipActorRibbon = class extends Window_ActorRibbon {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
	/**
	* Extends {@link Window_ActorRibbon#drawContent}.<br/>
	* Also draws the actor name beside the face.
	*/
	drawContent() {
		super.drawContent();
		this.drawActorName();
	}
	/**
	* Draws the actor name centered vertically beside the face graphic.
	*/
	drawActorName() {
		if (!this._actor) return;
		const textX = this.faceWidth() + 8;
		const textWidth = this.innerWidth - textX;
		const textY = Math.floor((this.innerHeight - this.lineHeight()) / 2);
		this.drawText(this._actor.name(), textX, textY, textWidth, "left");
	}
};

//#endregion
//#region src/plugins/cms/ext/equip/windows/Window_EquipControlsHint.js
/**
* A single-line controller hint for the equip scene.
* Sits beside {@link Window_EquipActorRibbon} in the row above the parameter catalog.
*/
var Window_EquipControlsHint = class extends Window_Base {
	/**
	* @param {Rectangle} rect The dimensions of the window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
	/**
	* Re-renders the static controller hint.
	*/
	refresh() {
		this.contents.clear();
		this.drawControllerHint();
	}
	/**
	* Draws the controller-first legend for equip/unequip/back.
	*/
	drawControllerHint() {
		const padX = 12;
		this.resetFontSettings();
		this.modFontSize(-4);
		this.changeTextColor(ColorManager.normalColor());
		const text = "OK: Equip    Cancel: Back    Triangle: Unequip";
		const y = Math.max(0, Math.floor((this.innerHeight - this.lineHeight()) / 2));
		this.drawText(text, padX, y, this.innerWidth - padX * 2, "center");
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/cms/ext/equip/scenes/Scene_Equip.js
/**
* Initializes this scene.
*/
Scene_Equip.prototype.initialize = function() {
	Scene_MenuBase.prototype.initialize.call(this);
	this._j = this._j || {};
	this._j.moreVisible = false;
};
/**
* Overwrites {@link #createButtons}.<br/>
* Removes the buttons because fuck the buttons.
*/
Scene_Equip.prototype.createButtons = function() {};
/**
* Overwrites {@link #create}.<br/>
* Removes the command window, because who even uses optimize?
*/
Scene_Equip.prototype.create = function() {
	Scene_MenuBase.prototype.create.call(this);
	this.createHelpWindow();
	this.createActorRibbonWindow();
	this.createControlsHintWindow();
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
* Overwrites {@link #buttonAreaHeight}.<br/>
* Replaces the button area height with 0 because fuck buttons.
* @returns {number}
*/
Scene_Equip.prototype.buttonAreaHeight = () => 0;
/**
* Overwrites {@link #statusWidth}.<br/>
* Modifies the width of the equip status window — whatever {@link #rightColumnWidth} trims off
* the right-hand column (slot/item lists + controls hint) flows into this column instead, since
* the parameter grid is the one that actually needs the room.
* @returns {number}
*/
Scene_Equip.prototype.statusWidth = function() {
	return Graphics.boxWidth - this.rightColumnWidth();
};
/**
* The width of the right-hand column (slot list, item list, controls hint). Trimmed to ~70% of
* its original width (the full remainder past the old fixed 1024px status column) — still plenty
* of room for the controls hint text and the widest equipment names, without hogging space the
* parameter grid needs more.
* @returns {number}
*/
Scene_Equip.prototype.rightColumnWidth = function() {
	const originalRightWidth = Graphics.boxWidth - 1024;
	return Math.round(originalRightWidth * .7);
};
/**
* Overwrites {@link #helpWindowRect}.<br/>
* Stretches the help window across the full screen width along the bottom, instead of only the
* status column, since it's the one window in this scene that isn't scoped to either column.
* @returns {Rectangle}
*/
Scene_Equip.prototype.helpWindowRect = function() {
	const wx = 0;
	const wy = this.helpAreaTop();
	const ww = Graphics.boxWidth;
	const wh = this.helpAreaHeight();
	return new Rectangle(wx, wy, ww, wh);
};
/**
* The height of a one-line top row (actor ribbon on the left, controls hint on the right).
* @returns {number}
*/
Scene_Equip.prototype.topRowHeight = function() {
	return this.calcWindowHeight(1, false);
};
/**
* Gets the rectangle that defines the shape of the actor ribbon window.
* Spans the full width of the status column.
* @returns {Rectangle}
*/
Scene_Equip.prototype.actorRibbonRect = function() {
	const wx = 0;
	const wy = this.mainAreaTop();
	const ww = this.statusWidth();
	const wh = this.topRowHeight();
	return new Rectangle(wx, wy, ww, wh);
};
/**
* Gets the rectangle that defines the shape of the controls hint window.
* Sits directly above the slot window, since that's what its legend describes.
* @returns {Rectangle}
*/
Scene_Equip.prototype.controlsHintRect = function() {
	const wx = this.statusWidth();
	const wy = this.mainAreaTop();
	const ww = Graphics.boxWidth - this.statusWidth();
	const wh = this.topRowHeight();
	return new Rectangle(wx, wy, ww, wh);
};
/**
* Creates the actor ribbon window.
*/
Scene_Equip.prototype.createActorRibbonWindow = function() {
	const rect = this.actorRibbonRect();
	this._actorRibbonWindow = new Window_EquipActorRibbon(rect);
	this.addWindow(this._actorRibbonWindow);
};
/**
* Creates the controls hint window.
*/
Scene_Equip.prototype.createControlsHintWindow = function() {
	const rect = this.controlsHintRect();
	this._controlsHintWindow = new Window_EquipControlsHint(rect);
	this._controlsHintWindow.refresh();
	this.addWindow(this._controlsHintWindow);
};
/**
* Overwrites {@link #statusWindowRect}.<br/>
* Shrinks the status window to start below the actor-ribbon row instead of carving out space for
* a portrait internally.
* @returns {Rectangle}
*/
Scene_Equip.prototype.statusWindowRect = function() {
	const wx = 0;
	const wy = this.mainAreaTop() + this.topRowHeight();
	const ww = this.statusWidth();
	const wh = this.mainAreaHeight() - this.topRowHeight();
	return new Rectangle(wx, wy, ww, wh);
};
/**
* Overwrites {@link #slotWindowRect}.<br/>
* Modifies the size of the equip slots window, starting below the controls hint row.
* @returns {Rectangle}
*/
Scene_Equip.prototype.slotWindowRect = function() {
	const wx = this.statusWidth();
	const wy = this.mainAreaTop() + this.topRowHeight();
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
J.CMS_E.Aliased.Scene_Equip.set("createSlotWindow", Scene_Equip.prototype.createSlotWindow);
Scene_Equip.prototype.createSlotWindow = function() {
	J.CMS_E.Aliased.Scene_Equip.get("createSlotWindow").call(this);
	this._slotWindow.setHandler("more", this.switchToMoreDataFromEquipSlots.bind(this));
	this._slotWindow.setHandler("context", this.onContextUnequipSlot.bind(this));
	this._slotWindow.setHandler("actor-next", this.nextActor.bind(this));
	this._slotWindow.setHandler("actor-prev", this.previousActor.bind(this));
	this._slotWindow.setMoreDataWindow(this._moreDataWindow);
};
/**
* Handles the contextual unequip action from the slot window.
* Removes the item in the currently focused equip slot, if any.
*/
Scene_Equip.prototype.onContextUnequipSlot = function() {
	if (this._slotWindow.active === false) {
		return;
	}
	const slotId = this._slotWindow.index();
	this.actor().changeEquip(slotId, null);
	this._statusWindow.refresh();
	this._slotWindow.refresh();
	this._itemWindow.refresh();
	this.refreshActor();
	this._slotWindow.activate();
};
/**
* Overwrites {@link #createItemWindow}.<br/>
* Prevents hiding the item window.
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
	const wh = this.mainAreaBottom() - wy;
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
* Starts below the slot window and stops above the bottom help window, so it never runs behind it.
* @returns {Rectangle}
*/
Scene_Equip.prototype.itemWindowRect = function() {
	const wx = this.statusWidth();
	const wy = this.slotWindowRect().y + this._slotWindow.height;
	const ww = Graphics.boxWidth - this.statusWidth();
	const wh = this.mainAreaBottom() - wy;
	return new Rectangle(wx, wy, ww, wh);
};
/**
* Overwrites {@link #onSlotOk}.<br/>
* Prevents hiding the equip window.
*/
Scene_Equip.prototype.onSlotOk = function() {
	this._itemWindow.activate();
	this._itemWindow.select(0);
};
/**
* Overwrites {@link #onSlotCancel}.<br/>
* Replaces the slot cancel functionality with the end of the scene.
*/
Scene_Equip.prototype.onSlotCancel = function() {
	this.popScene();
};
/**
* Overwrites {@link #hideItemWindow}.<br/>
* Prevents hiding the item window.
*/
Scene_Equip.prototype.hideItemWindow = function() {
	this._slotWindow.activate();
	this._itemWindow.deselect();
};
/**
* Overwrites {@link #onActorChange}.<br/>
* Prevents trying to activate a window that was removed from the scene.
*/
Scene_Equip.prototype.onActorChange = function() {
	Scene_MenuBase.prototype.onActorChange.call(this);
	this.refreshActor();
	this.hideItemWindow();
};
/**
* Extends the actor refresh to include the more data window.
*/
J.CMS_E.Aliased.Scene_Equip.set("refreshActor", Scene_Equip.prototype.refreshActor);
Scene_Equip.prototype.refreshActor = function() {
	J.CMS_E.Aliased.Scene_Equip.get("refreshActor").call(this);
	const actor = this.actor();
	this._moreDataWindow.setActor(actor);
	this._actorRibbonWindow.setActor(actor);
};

//#endregion
//#region src/plugins/cms/ext/equip/windows/Window_EquipItem.js
/**
* Extends the `.initialize()` to include tracking for the more equip data window.
*/
J.CMS_E.Aliased.Window_EquipItem.set("initialize", Window_EquipItem.prototype.initialize);
Window_EquipItem.prototype.initialize = function(rect) {
	J.CMS_E.Aliased.Window_EquipItem.get("initialize").call(this, rect);
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
//#region src/plugins/cms/ext/equip/windows/Window_EquipSlot.js
/**
* Extends the `.initialize()` to include tracking for the more equip data window.
*/
J.CMS_E.Aliased.Window_EquipSlot.set("initialize", Window_EquipSlot.prototype.initialize);
Window_EquipSlot.prototype.initialize = function(rect) {
	J.CMS_E.Aliased.Window_EquipSlot.get("initialize").call(this, rect);
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
//#region src/plugins/cms/ext/equip/windows/Window_EquipStatus.js
/**
* Overwrites {@link #lineHeight}.<br/>
* Matches the status scene's line height so both screens read identically.
* @returns {number}
*/
Window_EquipStatus.prototype.lineHeight = function() {
	return 32;
};
/**
* Overwrites {@link #makeFontSmaller}.<br/>
* Eases off the reduction step compared to the status scene — this window has a wider two-column
* layout with room to spare, so parameter names don't need to squeeze down as far to fit.
*/
Window_EquipStatus.prototype.makeFontSmaller = function() {
	if (this.contents.fontSize >= 20) {
		this.contents.fontSize -= 2;
	}
};
/**
* Overwrites {@link #makeFontBigger}.<br/>
* Matches the status scene's expanded font step.
*/
Window_EquipStatus.prototype.makeFontBigger = function() {
	if (this.contents.fontSize <= 96) {
		this.contents.fontSize += 6;
	}
};
/**
* Overwrites {@link #refresh}.<br/>
* Drops the vanilla name/face block — {@link Window_EquipActorRibbon} owns that now, in its own
* row above this window — so the parameter grid gets the full window instead of carving out space
* for a portrait internally.
*/
Window_EquipStatus.prototype.refresh = function() {
	this.contents.clear();
	if (this._actor) {
		this.drawAllParams();
	}
};
/**
* Overwrites {@link #drawAllParams}.<br/>
* Renders every registered parameter — vanilla b/x/s params and every custom one alike — through
* the shared {@link ParameterCatalogRenderer}, grouped and chromed identically to the status
* scene's page 1 (Combat/Vitality/Precision/Defensive/Haste/Fate/Support). This is the same catalog
* data the status scene reads, so nothing shown here can drift out of sync with what the player
* already knows from that screen.
*
* Unlike the status page, this window uses a two-column layout instead of three — there's no
* elements/ailments panel to reserve a third column for here, so the freed width goes toward
* wider, more legible name/value columns instead.
*
* When a `_tempActor` is present (the player is hovering a candidate piece of equipment), each row
* renders "current → projected" instead of a bare value, so the impact of the swap is visible
* without leaving this window.
*/
Window_EquipStatus.prototype.drawAllParams = function() {
	const { rowGap } = ParameterCatalogRenderer.PAGE_LAYOUT;
	const columnLayout = ParameterCatalogRenderer.computeTwoColumnLayout(this);
	let cursorY = 0;
	if (columnLayout) {
		const columnXs = [columnLayout.leftX, columnLayout.middleX];
		ParameterCatalogRenderer.PAGE_GROUP_ROW_GROUPS.forEach((rowGroups) => {
			const rowHeights = rowGroups.map((groupId, columnIndex) => {
				return ParameterCatalogRenderer.drawParameterGroup(this, columnXs[columnIndex], cursorY, groupId, columnLayout.columnWidth, this._actor, this._tempActor);
			});
			const tallestSection = Math.max(...rowHeights);
			cursorY += tallestSection + rowGap;
		});
		return;
	}
	const fallbackWidth = this.innerWidth;
	ParameterCatalogRenderer.PAGE_GROUP_ROW_GROUPS.forEach((rowGroups) => {
		rowGroups.forEach((groupId) => {
			const groupHeight = ParameterCatalogRenderer.drawParameterGroup(this, 0, cursorY, groupId, fallbackWidth, this._actor, this._tempActor);
			cursorY += groupHeight + rowGap;
		});
	});
};

//#endregion
//# sourceMappingURL=J-CMS-Equip.js.map