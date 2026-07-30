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
	* Gets the actor.
	* @returns {*} The actor.
	*/
	actor() {
		return this._actor;
	}
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
		if (!this.actor()) return;
		const textX = this.faceWidth() + 8;
		const textWidth = this.innerWidth - textX;
		const textY = Math.floor((this.innerHeight - this.lineHeight()) / 2);
		this.drawText(this.actor().name(), textX, textY, textWidth, "left");
	}
};

//#endregion
//#region src/plugins/cms/ext/equip/scenes/Scene_Equip.js
/**
* Re-parents the engine's equip scene onto the shared actor facet skeleton.
*
* This scene is one of RPG Maker's own, declared as a function with a hand-built prototype chain, so
* there is no `extends` clause to change. Re-pointing that chain is real inheritance all the same: the
* base's rect math and ribbon handling arrive as inherited methods, `super` inside them still resolves
* correctly, this file's own definitions still shadow anything they mean to override, and the scene
* remains an instance of {@link Scene_MenuBase} for everything that checks.
*
* The base's chain already includes `Scene_MenuBase`, so nothing is lost by pointing at it instead.
*/
Object.setPrototypeOf(Scene_Equip.prototype, Scene_ActorFacetBase.prototype);
/**
* Initializes this scene.
*/
Scene_Equip.prototype.initialize = function() {
	Scene_ActorFacetBase.prototype.initialize.call(this);
};
/**
* Extends {@link Scene_ActorFacetBase.initMembers}.<br/>
* Also initializes this scene's own members.
*/
Scene_Equip.prototype.initMembers = function() {
	Scene_ActorFacetBase.prototype.initMembers.call(this);
	/**
	* Whether the extended equipment detail panel is currently showing.
	* @type {boolean}
	*/
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
	Scene_ActorFacetBase.prototype.create.call(this);
	this.createHelpWindow();
	this.createStatusWindow();
	this.createMoreDataWindow();
	this.createSlotWindow();
	this.createItemWindow();
	this.refreshActor();
	this.slotWindow().activate();
	this.slotWindow().select(0);
	this.slotWindow().onIndexChange();
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
	return this.contentAreaRect().width - this.rightColumnWidth();
};
/**
* The proportion of the region given to the right-hand column of slot and item lists.
* @returns {number}
*/
Scene_Equip.prototype.rightColumnRatio = function() {
	return .32;
};
/**
* The width of the right-hand column (slot list, item list). Deliberately the smaller share- it holds
* equipment names, while the parameter grid beside it holds everything those names change.
* @returns {number}
*/
Scene_Equip.prototype.rightColumnWidth = function() {
	return Math.round(this.contentAreaRect().width * this.rightColumnRatio());
};
/**
* Overrides {@link Scene_ActorFacetBase.buildActorRibbonWindow}.<br/>
* Supplies the equip ribbon; the base decides where it sits and how tall it is.
* @param {Rectangle} rectangle The rectangle to build the window within.
* @returns {Window_EquipActorRibbon}
*/
Scene_Equip.prototype.buildActorRibbonWindow = function(rectangle) {
	return new Window_EquipActorRibbon(rectangle);
};
/**
* Implements {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
* Describes the controls this scene responds to.
*
* Replaces `Window_EquipControlsHint`, which drew the same three controls as a fixed string with the
* button names spelled out in words. The legend resolves live glyphs for whichever device the player
* is holding, and sits in the same place it does in every other facet scene.
* @returns {{semantic: (string|string[]), label: string}[]}
*/
Scene_Equip.prototype.controlLegendEntries = function() {
	return [
		{
			semantic: "ok",
			label: "equip"
		},
		{
			semantic: "context",
			label: "unequip"
		},
		{
			semantic: ["actor-prev", "actor-next"],
			label: "switch character"
		},
		{
			semantic: "cancel",
			label: "back"
		}
	];
};
/**
* Overwrites {@link #statusWindowRect}.<br/>
* Shrinks the status window to start below the actor-ribbon row instead of carving out space for
* a portrait internally.
* @returns {Rectangle}
*/
Scene_Equip.prototype.statusWindowRect = function() {
	const contentArea = this.contentAreaRect();
	return new Rectangle(contentArea.x, contentArea.y, this.statusWidth(), contentArea.height);
};
/**
* Overwrites {@link #slotWindowRect}.<br/>
* Modifies the size of the equip slots window, starting below the controls hint row.
* @returns {Rectangle}
*/
Scene_Equip.prototype.slotWindowRect = function() {
	const contentArea = this.contentAreaRect();
	return new Rectangle(contentArea.x + this.statusWidth(), contentArea.y, this.rightColumnWidth(), this.slotWindowHeight(6));
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
		this.slotWindow().refreshMoreData();
		this.slotWindow().deactivate();
		this._moreDataWindow.setHandler("cancel", this.backToSlotsList.bind(this));
		this._moreDataWindow.show();
		this._moreDataWindow.activate();
		this._moreDataWindow.select(0);
	} else {
		this._moreDataWindow.hide();
		this._moreDataWindow.deactivate();
		this._moreDataWindow.deselect();
		this.slotWindow().activate();
	}
};
/**
* Toggles the visibility of the "more" window.
*/
Scene_Equip.prototype.switchToMoreDataFromEquipItems = function() {
	this._j.moreVisible = !this._j.moreVisible;
	if (this._j.moreVisible) {
		this.itemWindow().refreshMoreData();
		this.itemWindow().deactivate();
		this._moreDataWindow.setHandler("cancel", this.backToItemsList.bind(this));
		this._moreDataWindow.show();
		this._moreDataWindow.activate();
		this._moreDataWindow.select(0);
	} else {
		this._moreDataWindow.hide();
		this._moreDataWindow.deactivate();
		this._moreDataWindow.deselect();
		this.itemWindow().activate();
	}
};
/**
* Extends the slot window to include our additional actions.
*/
J.CMS_E.Aliased.Scene_Equip.set("createSlotWindow", Scene_Equip.prototype.createSlotWindow);
Scene_Equip.prototype.createSlotWindow = function() {
	J.CMS_E.Aliased.Scene_Equip.get("createSlotWindow").call(this);
	this.slotWindow().setHandler("more", this.switchToMoreDataFromEquipSlots.bind(this));
	this.slotWindow().setHandler("context", this.onContextUnequipSlot.bind(this));
	this.slotWindow().setHandler("actor-next", this.nextActor.bind(this));
	this.slotWindow().setHandler("actor-prev", this.previousActor.bind(this));
	this.slotWindow().setMoreDataWindow(this._moreDataWindow);
};
/**
* Handles the contextual unequip action from the slot window.
* Removes the item in the currently focused equip slot, if any.
*/
Scene_Equip.prototype.onContextUnequipSlot = function() {
	if (this.slotWindow().active === false) {
		return;
	}
	const slotId = this.slotWindow().index();
	this.actor().changeEquip(slotId, null);
	this.statusWindow().refresh();
	this.slotWindow().refresh();
	this.itemWindow().refresh();
	this.refreshActor();
	this.slotWindow().activate();
};
/**
* Overwrites {@link #createItemWindow}.<br/>
* Prevents hiding the item window.
*/
Scene_Equip.prototype.createItemWindow = function() {
	const rect = this.itemWindowRect();
	this.setItemWindow(new Window_EquipItem(rect));
	this.itemWindow().setHelpWindow(this.helpWindow());
	this.itemWindow().setStatusWindow(this.statusWindow());
	this.itemWindow().setHandler("more", this.switchToMoreDataFromEquipItems.bind(this));
	this.itemWindow().setHandler("ok", this.onItemOk.bind(this));
	this.itemWindow().setHandler("cancel", this.onItemCancel.bind(this));
	this.itemWindow().setMoreDataWindow(this._moreDataWindow);
	this.slotWindow().setItemWindow(this.itemWindow());
	this.addWindow(this.itemWindow());
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
	const contentArea = this.contentAreaRect();
	const width = 500;
	const wx = contentArea.x + this.statusWidth() - width - 4;
	const wy = this.slotWindowRect().y - 4;
	return new Rectangle(wx, wy, width, contentArea.y + contentArea.height - wy);
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
	const contentArea = this.contentAreaRect();
	const slotRect = this.slotWindowRect();
	const wy = slotRect.y + this.slotWindow().height;
	return new Rectangle(slotRect.x, wy, slotRect.width, contentArea.y + contentArea.height - wy);
};
/**
* Overwrites {@link #onSlotOk}.<br/>
* Prevents hiding the equip window.
*/
Scene_Equip.prototype.onSlotOk = function() {
	this.itemWindow().activate();
	this.itemWindow().select(0);
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
	this.slotWindow().activate();
	this.itemWindow().deselect();
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
	this.actorRibbonWindow().setActor(actor);
};
/**
* Gets the actor ribbon window.
*
* Kept as a name that reads in context; the base owns the window and its rectangle now, and the
* controls hint it used to sit beside is the shared control legend.
* @returns {Window_EquipActorRibbon}
*/
Scene_Equip.prototype.actorRibbonWindow = function() {
	return this.getActorRibbonWindow();
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
	if (this.actor()) {
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
* This window uses a two-column layout, and the elements and ailments the actor deviates from the
* baseline on are drawn beneath the grid rather than in a third column. Equipment is the main thing
* that moves those numbers, so this is where they belong- and only deviations are listed, so an actor
* wearing nothing unusual costs two short "all standard" lines rather than fifty rows.
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
				return ParameterCatalogRenderer.drawParameterGroup(this, columnXs[columnIndex], cursorY, groupId, columnLayout.columnWidth, this.actor(), this.tempActor());
			});
			const tallestSection = Math.max(...rowHeights);
			cursorY += tallestSection + rowGap;
		});
		this.drawAffiliations(columnXs, cursorY, columnLayout.columnWidth);
		return;
	}
	const fallbackWidth = this.innerWidth;
	ParameterCatalogRenderer.PAGE_GROUP_ROW_GROUPS.forEach((rowGroups) => {
		rowGroups.forEach((groupId) => {
			const groupHeight = ParameterCatalogRenderer.drawParameterGroup(this, 0, cursorY, groupId, fallbackWidth, this.actor(), this.tempActor());
			cursorY += groupHeight + rowGap;
		});
	});
	const stackedHalf = Math.floor((fallbackWidth - 16) / 2);
	this.drawAffiliations([0, stackedHalf + 16], cursorY, stackedHalf);
};
/**
* Draws the element and ailment affiliations beneath the parameter grid.
*
* Only entries deviating from the 100% baseline appear, so this occupies the space it earns- a
* character with no unusual resistances shows two short lines rather than an inventory of nothing.
* @param {number[]} columnXs The x coordinate of each column.
* @param {number} y The y coordinate to begin drawing at.
* @param {number} columnWidth The width of a single column.
*/
Window_EquipStatus.prototype.drawAffiliations = function(columnXs, y, columnWidth) {
	const affiliationY = y + 8;
	ParameterCatalogRenderer.drawElementAffiliations(this, this.actor(), columnXs[0], affiliationY, columnWidth);
	ParameterCatalogRenderer.drawAilmentAffiliations(this, this.actor(), columnXs[1], affiliationY, columnWidth);
};

//#endregion
//# sourceMappingURL=J-CMS-Equip.js.map