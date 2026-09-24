//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 HUD-TARGET] A HUD frame that displays your battle target.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @base J-Base
 * @base J-HUD
 * @orderAfter J-ABS
 * @orderAfter J-Base
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of the J-HUD plugin, designed for JABS.
 * It generates a window on the map displaying a given target.
 *
 * The following data points are currently supported:
 * - The enemy battler's name.
 * - The enemy battler's "text".
 * - An icon.
 * - The enemy's HP gauge.
 * - The enemy's MP gauge.
 * - The enemy's TP gauge.
 *
 * ============================================================================
 * SETUP:
 * This plugin creates a window, which contains gauges representing the target
 * that is currently set. No images are needed: the gauges are drawn the same
 * way as the rest of the HUD's gauges, trail and all- when the target loses
 * some of a gauge, the lost amount turns red and drains away, and when it
 * gains some back, the gained amount shows in green and the gauge fills in.
 * ============================================================================
 * TARGET FRAME TEXT:
 * Have you ever wanted your JABS battlers to have an extra line of text that
 * gives some sort of context to that particular enemy? Well now you can! By
 * applying the appropriate tags to either the enemy or the event that
 * represents the enemy on the map, you too can have meaningful text in your
 * target frame!
 *
 * NOTE 1:
 * If a tag exists on the enemy in the database AND on the event representing
 * the same enemy, the event tag will take priority and database tag will be
 * ignored.
 *
 * NOTE 2:
 * If no target frame text is available, the gauges will automatically move up
 * slightly to prevent it from looking strange with the extra space (if you
 * are using the gauges).
 *
 * TAG USAGE:
 * - Enemies
 * - Events on the map (only applicable to JABS battlers)
 *
 * TAG FORMAT:
 *  <targetFrameText:TEXT>
 *
 * TAG EXAMPLE:
 *  <targetFrameText:I'm the coolest ghosty ever.>
 * When this enemy is struck on the map, the target frame will display the
 * above provided text of "I'm the coolest ghosty ever." between the name and
 * the gauges (if present).
 * ============================================================================
 * TARGET FRAME ICON:
 * Have you ever wanted your JABS battlers to have an icon displayed in the
 * target frame? Well now you can! By applying the appropriate tags to either
 * the enemy or the event that represents the enemy on the map, you too can
 * have enemies with flashy and meaningful icons in your target frame!
 *
 * NOTE 1:
 * If a tag exists on the enemy in the database AND on the event representing
 * the same enemy, the event tag will take priority and database tag will be
 * ignored.
 *
 * NOTE 2:
 * The icon leads the target's name. If no target frame icon is available, the
 * name simply starts where the icon would have been.
 *
 * TAG USAGE:
 * - Enemies
 * - Events on the map (only applicable to JABS battlers)
 *
 * TAG FORMAT:
 *  <targetFrameIcon:ICON_INDEX>
 *
 * TAG EXAMPLE:
 *  <targetFrameIcon:25>
 * When this enemy is struck on the map, the target frame will display an icon
 * that matches the icon index of 25 ahead of the enemy's name.
 * ============================================================================
 * HIDING DATA:
 * Have you ever wanted to hide certain data points for some enemies, but not
 * ALL enemies? Well now you can! By applying the appropriate tags to either
 * the enemy or the event that represents an enemy on the map, you too can have
 * the chosen data points completely absent from the target frame when striking
 * the tagged enemy!
 *
 * DETAILS:
 * Below you'll find 5 tags for hiding the various data points of the target
 * frame, with the tag hopefully describing accurately what they accomplish.
 * Hiding the entire frame will take priority over any of the one elements.
 * Hiding with these tags via the event will take the highest priority over
 * showing via tags in the event or the database. Generally speaking, it is
 * probably recommended to enable and show all data points, and then hide
 * them selectively with the below tags.
 *
 * TAG USAGE:
 * - Enemies
 * - Events on the map (only applicable to JABS battlers)
 *
 * TAG FORMAT:
 *  <hideTargetFrame>     Hides the target frame and all text and gauges.
 *  <hideTargetFrameText> Hides the subtext in the target frame.
 *  <hideTargetHpBar>     Hides the HP gauge in the target frame.
 *  <hideTargetMpBar>     Hides the MP gauge in the target frame.
 *  <hideTargetTpBar>     Hides the TP gauge in the target frame.
 * ============================================================================
 * @param targetFrameData
 * @text Target Frame Window
 *
 * @param targetFrameX
 * @parent targetFrameData
 * @type number
 * @min 0
 * @text Origin X
 * @desc The x coordinate of the overarching target frame.
 * @default 400
 *
 * @param targetFrameY
 * @parent targetFrameData
 * @type number
 * @min 0
 * @text Origin Y
 * @desc The y coordinate of the overarching target frame.
 * @default 0
 *
 * @param targetFrameWidth
 * @parent targetFrameData
 * @type number
 * @min 0
 * @text Width
 * @desc The width in pixels of the target frame window.
 * @default 480
 *
 * @param targetFrameHeight
 * @parent targetFrameData
 * @type number
 * @min 0
 * @text Height
 * @desc The height in pixels of the target frame window.
 * @default 180
 *
 * @param settings
 * @text Target Settings
 *
 * @param hpSettings
 * @parent settings
 * @text For HP:
 *
 * @param enableHp
 * @parent hpSettings
 * @type boolean
 * @text Use Gauge
 * @desc Enables the HP gauge in the target frame.
 * @default true
 * @on Enable HP Gauge
 * @off Disable HP Gauge
 *
 * @param mpSettings
 * @parent settings
 * @text For MP:
 *
 * @param enableMp
 * @parent mpSettings
 * @type boolean
 * @text Use Gauge
 * @desc Enables the MP gauge in the target frame.
 * @default true
 * @on Enable MP Gauge
 * @off Disable MP Gauge
 *
 * @param tpSettings
 * @parent settings
 * @text For TP:
 *
 * @param enableTp
 * @parent tpSettings
 * @type boolean
 * @text Use Gauge
 * @desc Enables the TP gauge in the target frame.
 * @default true
 * @on Enable TP Gauge
 * @off Disable TP Gauge
 *
 * @param tpGaugeRotation
 * @parent tpSettings
 * @type number
 * @min -360
 * @max 360
 * @text Rotation
 * @desc The degree of rotation for the TP gauge. Between -360 and 360.
 * @default 270
 *
 * ============================================================================
 * CHANGELOG:
 * - 2.0.0
 *    The target frame no longer needs gauge images. Its gauges draw like the rest of
 *    the HUD's, trail and all, its afflictions share one compact row, and icons now
 *    lead the target's name. The image gauge parameters are gone.
 * - 1.2.0
 *    The target frame fades while the player is standing on top of it, through the
 *    shared resolver in J-HUD. This rides on top of the inactivity fade rather than
 *    competing with it - that one owns opacity, this one owns alpha.
 * - 1.1.0
 *    Target frame now renders the shared dual-row state affliction
 *    presenter from J-HUD core, wired via a new patch file.
 *    Fixed Game_Enemy#targetFrameIcon reading with the TargetFrameText
 *    regex instead of TargetFrameIcon, so the icon tag never matched.
 * - 1.0.1
 *    Adjusted target frame defaults for better readability.
 *    Improved gauge alignment logic for consistent HP/MP positioning.
 * - 1.0.0
 *    Initial release.
 */

//#region src/plugins/hud/ext/target/_metadata/_pluginMetadata.js
var JHudTarget_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The x coordinate of the target frame window.
		* @type {number}
		*/
		this.TargetFrameX = Number(this.parsedPluginParameters["targetFrameX"]);
		/**
		* The y coordinate of the target frame window.
		* @type {number}
		*/
		this.TargetFrameY = Number(this.parsedPluginParameters["targetFrameY"]);
		/**
		* The width of the target frame window.
		* @type {number}
		*/
		this.TargetFrameWidth = Number(this.parsedPluginParameters["targetFrameWidth"]);
		/**
		* The height of the target frame window.
		* @type {number}
		*/
		this.TargetFrameHeight = Number(this.parsedPluginParameters["targetFrameHeight"]);
		/**
		* Whether or not the hp gauge is enabled by default.
		* @type {boolean}
		*/
		this.EnableHP = this.parsedPluginParameters["enableHp"] === "true";
		/**
		* Whether or not the mp gauge is enabled by default.
		* @type {boolean}
		*/
		this.EnableMP = this.parsedPluginParameters["enableMp"] === "true";
		/**
		* Whether or not the tp gauge is enabled by default.
		* @type {boolean}
		*/
		this.EnableTP = this.parsedPluginParameters["enableTp"] === "true";
		/**
		* The rotation of the tp gauge sprite in degrees.
		* @type {number}
		*/
		this.TpGaugeRotation = Number(this.parsedPluginParameters["tpGaugeRotation"]);
	}
};

//#endregion
//#region src/plugins/hud/ext/target/_metadata/initialization.js
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
	const requiredHudVersion = "2.4.0";
	const hasHudRequirement = J.BASE.Helpers.satisfies(J.HUD.Metadata.version.version(), requiredHudVersion);
	if (hasHudRequirement === false) {
		throw new Error(`Either missing J-HUD or has a lower version than the required: ${requiredHudVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension plugin.
*/
J.HUD.EXT.TARGET = {};
/**
* The `metadata` associated with this plugin, such as version.
* @type {JHudTarget_PluginMetadata}
*/
J.HUD.EXT.TARGET.Metadata = new JHudTarget_PluginMetadata("J-HUD-TargetFrame", "2.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.HUD.EXT.TARGET.Aliased = {
	Game_System: new Map(),
	Hud_Manager: new Map(),
	JABS_Battler: new Map(),
	Scene_Map: new Map(),
	Window_TargetFrame: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.HUD.EXT.TARGET.RegExp = {
	TargetFrameText: /<targetFrameText:([\w :"'.!+\-*/\\]*)>/i,
	TargetFrameIcon: /<targetFrameIcon:(\d+)>/i,
	HideTargetFrame: /<hideTargetFrame>/i,
	HideTargetText: /<hideTargetFrameText>/i,
	HideTargetHP: /<hideTargetHpBar>/i,
	HideTargetMP: /<hideTargetMpBar>/i,
	HideTargetTP: /<hideTargetTpBar>/i
};

//#endregion
//#region src/plugins/hud/ext/target/_models/FramedTargetConfiguration.js
/**
* A configuration object for whether to show/hide various target data points.
*/
var FramedTargetConfiguration = class {
	/**
	* Whether or not to show the target's name.
	* @type {boolean}
	*/
	showName = true;
	/**
	* Whether or not to show the target's HP.
	* @type {boolean}
	*/
	showHp = true;
	/**
	* Whether or not to show the target's MP.
	* @type {boolean}
	*/
	showMp = true;
	/**
	* Whether or not to show the target's TP.
	* @type {boolean}
	*/
	showTp = true;
	/**
	* Whether or not to show the target text.
	* @type {boolean}
	*/
	showText = true;
	/**
	* Constructor.
	* @param {boolean} showName Whether or not to show the name.
	* @param {boolean} showText Whether or not to show the name.
	* @param {boolean} showHp Whether or not to show the name.
	* @param {boolean} showMp Whether or not to show the name.
	* @param {boolean} showTp Whether or not to show the name.
	*/
	constructor(showName = true, showText = true, showHp = J.HUD.EXT.TARGET.Metadata.EnableHP, showMp = J.HUD.EXT.TARGET.Metadata.EnableMP, showTp = J.HUD.EXT.TARGET.Metadata.EnableTP) {
		this.showName = showName;
		this.showText = showText;
		this.showHp = showHp;
		this.showMp = showMp;
		this.showTp = showTp;
	}
};

//#endregion
//#region src/plugins/hud/ext/target/_models/FramedTarget.js
/**
* The shape of a target for the target frame.
*/
var FramedTarget = class {
	/**
	* The name of the target.
	* @type {string|String.empty}
	*/
	name = String.empty;
	/**
	* The additional text of the target.
	* @type {string|String.empty}
	*/
	text = String.empty;
	/**
	* The icon to place on the target.
	* @type {number}
	*/
	icon = 0;
	/**
	* Icons an extension wants shown ahead of the target's name, drawn after {@link #icon}.<br/>
	* Held apart from {@link #name} so the frame decides where they go- and what goes between them and the
	* name- rather than finding them baked into the name's text.
	* @type {number[]}
	*/
	nameIconIndices = [];
	/**
	* The battler data of the target.
	* @type {Game_Enemy|null}
	*/
	battler = null;
	/**
	* The configuration of this target.
	* @type {FramedTargetConfiguration|null}
	*/
	configuration = null;
	/**
	* Optional `#RRGGBB` for the name row; a passive extension may set this so the HUD tints the target name.
	* Empty means use the window default text color.
	* @type {string|String.empty}
	*/
	nameColorHex = String.empty;
	/**
	* Constructor.
	* @param {string} name The name of the target.
	* @param {string=} text The additional text for the target; defaults to an empty string.
	* @param {number=} icon The icon to place on this target; defaults to 0.
	* @param {Game_Enemy=} battler The battler data of the target; defaults to null.
	* @param {FramedTargetConfiguration=} configuration The configuration of this target; defaults to null.
	* @param {string=} nameColorHex Optional hex tint for {@link #drawTargetName}; defaults to empty (no override).
	*/
	constructor(name, text = String.empty, icon = 0, battler = null, configuration = null, nameColorHex = String.empty) {
		this.name = name;
		this.text = text;
		this.icon = icon;
		this.battler = battler;
		this.configuration = configuration;
		this.nameColorHex = nameColorHex;
	}
};

//#endregion
//#region src/plugins/hud/ext/target/objects/Game_Enemy.js
/**
* Gets the extra text from this enemy for the target frame.
* @returns {string}
*/
Game_Enemy.prototype.targetFrameText = function() {
	return RPGManager.getStringFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.TargetFrameText);
};
/**
* Gets the icon index of the target frame icon.
* If none are present or valid, then the default will be 0 (no icon).
* @returns {number}
*/
Game_Enemy.prototype.targetFrameIcon = function() {
	return RPGManager.getNumberFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.TargetFrameIcon);
};
/**
* Gets whether or not the battler can show the target frame.
* The default is to show.
* @returns {boolean}
*/
Game_Enemy.prototype.showTargetFrame = function() {
	return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetFrame);
};
/**
* Gets whether or not the battler can show its mp bar.
* The default is to show.
* @returns {boolean}
*/
Game_Enemy.prototype.showTargetHpBar = function() {
	return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetHP);
};
/**
* Gets whether or not the battler can show its mp bar.
* The default is to show.
* @returns {boolean}
*/
Game_Enemy.prototype.showTargetMpBar = function() {
	return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetMP);
};
/**
* Gets whether or not the battler can show its tp bar.
* The default is to show.
* @returns {boolean}
*/
Game_Enemy.prototype.showTargetTpBar = function() {
	return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetTP);
};
/**
* Gets whether or not the battler can show its target text.
* The default is to show.
* @returns {boolean}
*/
Game_Enemy.prototype.showTargetText = function() {
	return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetText);
};

//#endregion
//#region src/plugins/hud/ext/target/objects/Game_Event.js
/**
* Gets the icon index of the target frame icon.
* If none are present or valid, then the default will be 0 (no icon).
* @returns {string|String.empty}
*/
Game_Event.prototype.getTargetFrameText = function() {
	let targetFrameText = String.empty;
	const commentCommands = this.getValidCommentCommands();
	if (!commentCommands.length) return targetFrameText;
	const structure = J.HUD.EXT.TARGET.RegExp.TargetFrameText;
	commentCommands.forEach((command) => {
		const [comment] = command.parameters;
		if (structure.test(comment)) {
			targetFrameText = RegExp.$1;
		}
	});
	return targetFrameText;
};
/**
* Gets the icon index of the target frame icon.
* If none are present or valid, then the default will be 0 (no icon).
* @returns {number}
*/
Game_Event.prototype.getTargetFrameIcon = function() {
	let targetFrameIcon = 0;
	const commentCommands = this.getValidCommentCommands();
	if (!commentCommands.length) return targetFrameIcon;
	const structure = J.HUD.EXT.TARGET.RegExp.TargetFrameIcon;
	commentCommands.forEach((command) => {
		const [comment] = command.parameters;
		if (structure.test(comment)) {
			targetFrameIcon = parseInt(RegExp.$1);
		}
	});
	return targetFrameIcon;
};
/**
* Gets whether or not this event is explicitly hiding the target frame.
* The default is to show the frame.
* @returns {boolean} True if we should show the target frame, false otherwise.
*/
Game_Event.prototype.canShowTargetFrame = function() {
	let showTargetFrame = true;
	const commentCommands = this.getValidCommentCommands();
	if (!commentCommands.length) return showTargetFrame;
	const structure = J.HUD.EXT.TARGET.RegExp.HideTargetFrame;
	commentCommands.forEach((command) => {
		const [line] = command.parameters;
		if (structure.test(line)) {
			showTargetFrame = false;
		}
	});
	return showTargetFrame;
};
/**
* Gets whether or not this event is explicitly hiding the hp bar.
* The default is to show the bar.
* @returns {boolean} True if we should show the bar, false otherwise.
*/
Game_Event.prototype.showTargetHpBar = function() {
	let showHpBar = J.HUD.EXT.TARGET.Metadata.EnableHP;
	const commentCommands = this.getValidCommentCommands();
	if (!commentCommands.length) return showHpBar;
	const structure = J.HUD.EXT.TARGET.RegExp.HideTargetHP;
	commentCommands.forEach((command) => {
		const [line] = command.parameters;
		if (structure.test(line)) {
			showHpBar = false;
		}
	});
	return showHpBar;
};
/**
* Gets whether or not this event is explicitly hiding the mp bar.
* The default is to show the bar.
* @returns {boolean} True if we should show the bar, false otherwise.
*/
Game_Event.prototype.showTargetMpBar = function() {
	let showMpBar = J.HUD.EXT.TARGET.Metadata.EnableMP;
	const commentCommands = this.getValidCommentCommands();
	if (!commentCommands.length) return showMpBar;
	const structure = J.HUD.EXT.TARGET.RegExp.HideTargetMP;
	commentCommands.forEach((command) => {
		const [line] = command.parameters;
		if (structure.test(line)) {
			showMpBar = false;
		}
	});
	return showMpBar;
};
/**
* Gets whether or not this event is explicitly hiding the tp bar.
* The default is to show the bar.
* @returns {boolean} True if we should show the bar, false otherwise.
*/
Game_Event.prototype.showTargetTpBar = function() {
	let showTpBar = J.HUD.EXT.TARGET.Metadata.EnableTP;
	const commentCommands = this.getValidCommentCommands();
	if (!commentCommands.length) return showTpBar;
	const structure = J.HUD.EXT.TARGET.RegExp.HideTargetTP;
	commentCommands.forEach((command) => {
		const [line] = command.parameters;
		if (structure.test(line)) {
			showTpBar = false;
		}
	});
	return showTpBar;
};
/**
* Gets whether or not this event is explicitly hiding the target text.
* The default is to show the text.
* @returns {boolean} True if we should show the text, false otherwise.
*/
Game_Event.prototype.showTargetText = function() {
	let showText = true;
	const commentCommands = this.getValidCommentCommands();
	if (!commentCommands.length) return showText;
	const structure = J.HUD.EXT.TARGET.RegExp.HideTargetText;
	commentCommands.forEach((command) => {
		const [line] = command.parameters;
		if (structure.test(line)) {
			showText = false;
		}
	});
	return showText;
};

//#endregion
//#region src/plugins/hud/ext/target/_models/JABS_Battler.js
/**
* Sets the last battler struck by this battler.
* @param {JABS_Battler} battlerLastHit The battler that is being set as last struck.
*/
J.HUD.EXT.TARGET.Aliased.JABS_Battler.set("setBattlerLastHit", JABS_Battler.prototype.setBattlerLastHit);
JABS_Battler.prototype.setBattlerLastHit = function(battlerLastHit) {
	if (this.canUpdateTargetFrame(battlerLastHit)) {
		const framedTarget = this.buildFramedTarget(battlerLastHit);
		$hudManager.setNewTarget(framedTarget);
	}
	J.HUD.EXT.TARGET.Aliased.JABS_Battler.get("setBattlerLastHit").call(this, battlerLastHit);
};
/**
* Determines whether or not the target frame should be updated.
* @param {JABS_Battler} potentialTarget The battler that is being set as last struck.
* @returns {boolean} True if we should update the target frame, false otherwise.
*/
JABS_Battler.prototype.canUpdateTargetFrame = function(potentialTarget) {
	if (!this.isPlayer()) return false;
	if (!potentialTarget) return false;
	if (!potentialTarget.canShowTargetFrame()) return false;
	$hudManager.requestTargetFrameRefresh();
	if (!this.getTarget()) {
		return true;
	}
	if (this.getTarget().getUuid() === potentialTarget.getUuid()) {
		return false;
	}
	return true;
};
/**
* Checks the last hit battler to build the target frame.
* @param {JABS_Battler} battlerLastHit The battler that is being set as last struck.
* @returns {FramedTarget}
*/
JABS_Battler.prototype.buildFramedTarget = function(battlerLastHit) {
	const battlerName = battlerLastHit.battlerName();
	const targetFrameText = battlerLastHit.getTargetFrameText();
	const targetFrameIcon = battlerLastHit.getTargetFrameIcon();
	const targetConfiguration = battlerLastHit.buildFramedTargetConfiguration();
	const framedTarget = new FramedTarget(battlerName, targetFrameText, targetFrameIcon, battlerLastHit.getBattler(), targetConfiguration, String.empty);
	this.decorateFramedTarget(framedTarget, battlerLastHit);
	return framedTarget;
};
/**
* Decorates a framed target once it is built: the hook extensions alias to add to how a target is shown.
* J-Passive-Affix adds a tier's name, icons, and color here. The boss frame runs its boss through this same
* hook, so whatever an extension adds shows up on the boss frame as well as the target frame.
* @param {FramedTarget} _framedTarget The framed target to decorate in place.
* @param {JABS_Battler} _framedBattler The battler the framed target shows.
*/
JABS_Battler.prototype.decorateFramedTarget = function(_framedTarget, _framedBattler) {};
/**
* Determines whether or not the target frame will show for the given target.
* @returns {boolean} True if we should show the target frame, false otherwise.
*/
JABS_Battler.prototype.canShowTargetFrame = function() {
	if (!this.isEnemy()) return false;
	if (!this.getCharacter() || this.getCharacter().isErased()) {
		return false;
	}
	const hiddenByEvent = !this.getCharacter().canShowTargetFrame();
	if (hiddenByEvent) return false;
	const hiddenByDatabase = !this.getBattler().showTargetFrame();
	if (hiddenByDatabase) return false;
	return true;
};
/**
* Builds the configuration for the target frame based on this battler.
* @returns {FramedTargetConfiguration}
*/
JABS_Battler.prototype.buildFramedTargetConfiguration = function() {
	const showName = this.showBattlerName();
	const showText = this.canShowTargetText();
	const showHpGauge = this.canShowTargetHp();
	const showMpGauge = this.canShowTargetMp();
	const showTpGauge = this.canShowTargetTp();
	return new FramedTargetConfiguration(showName, showText, showHpGauge, showMpGauge, showTpGauge);
};
/**
* Gets whether or not this battler can show their HP in the target frame window.
* @returns {boolean} True if it can show, false otherwise.
*/
JABS_Battler.prototype.canShowTargetHp = function() {
	if (!J.HUD.EXT.TARGET.Metadata.EnableHP) return false;
	if (!this.isEnemy()) return false;
	if (!this.getCharacter().showTargetHpBar()) {
		return false;
	}
	if (!this.getBattler().showTargetHpBar()) {
		return false;
	}
	return true;
};
/**
* Gets whether or not this battler can show their MP in the target frame window.
* @returns {boolean} True if it can show, false otherwise.
*/
JABS_Battler.prototype.canShowTargetMp = function() {
	if (!J.HUD.EXT.TARGET.Metadata.EnableMP) return false;
	if (!this.isEnemy()) return false;
	if (!this.getCharacter().showTargetMpBar()) {
		return false;
	}
	if (!this.getBattler().showTargetMpBar()) {
		return false;
	}
	if (this.getBattler().param(1) === 0) {
		return false;
	}
	return true;
};
/**
* Gets whether or not this battler can show their TP in the target frame window.
* @returns {boolean} True if it can show, false otherwise.
*/
JABS_Battler.prototype.canShowTargetTp = function() {
	if (!J.HUD.EXT.TARGET.Metadata.EnableTP) return false;
	if (!this.isEnemy()) return false;
	if (!this.getCharacter().showTargetTpBar()) {
		return false;
	}
	if (!this.getBattler().showTargetTpBar()) {
		return false;
	}
	if (this.getBattler().maxTp() === 0 || this.isInanimate()) {
		return false;
	}
	return true;
};
/**
* Gets whether or not this battler can show extra text in the target frame window.
* @returns {boolean} True if it can show, false otherwise.
*/
JABS_Battler.prototype.canShowTargetText = function() {
	if (!this.isEnemy()) return false;
	if (!this.getCharacter().showTargetText()) {
		return false;
	}
	if (!this.getBattler().showTargetText()) {
		return false;
	}
	return true;
};
/**
* Gets the target frame text for this enemy.
* @returns {string}
*/
JABS_Battler.prototype.getTargetFrameText = function() {
	if (!this.isEnemy()) return String.empty;
	let targetFrameText = this.getCharacter().getTargetFrameText();
	if (!targetFrameText) {
		targetFrameText = this.getBattler().targetFrameText();
	}
	return targetFrameText;
};
/**
* Gets the target frame icon from the underlying character.
* @returns {number}
*/
JABS_Battler.prototype.getTargetFrameIcon = function() {
	if (!this.isEnemy()) return 0;
	let targetFrameIcon = this.getCharacter().getTargetFrameIcon();
	if (!targetFrameIcon) {
		targetFrameIcon = this.getBattler().targetFrameIcon();
	}
	return targetFrameIcon;
};

//#endregion
//#region src/plugins/hud/ext/target/windows/Window_TargetFrame.js
/**
* A window that displays a target and their relevant information.
*/
var Window_TargetFrame = class Window_TargetFrame extends Window_Base {
	/**
	* The maximum possible duration in frames.
	* @type {number}
	*/
	static MaxDuration = 180;
	/**
	* The size of each of the frame's gauges, in pixels. Each gauge's bar fills its whole bitmap, so the height is
	* both.
	* @type {{hp: {width: number, height: number}, mp: {width: number, height: number},
	* tp: {width: number, height: number}}}
	*/
	static GaugeSizes = {
		hp: {
			width: 200,
			height: 12
		},
		mp: {
			width: 200,
			height: 6
		},
		tp: {
			width: 30,
			height: 6
		}
	};
	/**
	* Constructor.
	* @param {Rectangle} rect The shape of this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Initializes the properties of this class.
	* @param {Rectangle} rect The rectangle representing this window.
	*/
	initialize(rect) {
		super.initialize(rect);
		this.initMembers();
		this.configure();
	}
	/**
	* Initializes all members of this class.
	*/
	initMembers() {
		/**
		* The over-arching object that contains all properties for this plugin.
		*/
		this._j ||= {};
		/**
		* The cached collection of sprites.
		* @type {Map<string, Sprite_Icon|Sprite>}
		*/
		this._j._spriteCache = new Map();
		/**
		* The name to display in the name field.
		*
		* NOTE:
		* This is separated out from the battler data itself so that it can be
		* separately assigned to something different if the dev wanted to.
		* @type {string}
		*/
		this._j._name = String.empty;
		/**
		* When set, {@link #drawTargetName} tints the line with this `#RRGGBB` before `drawTextEx`.
		* Populated when a passive extension is active and supplies a name color for the target.
		* @type {string|String.empty}
		*/
		this._j._nameColorHex = String.empty;
		/**
		* The second line associated with the target.
		* Optional.
		* @type {string}
		*/
		this._j._text = String.empty;
		/**
		* The icon that this target has.
		* @type {number}
		*/
		this._j._icon = 0;
		/**
		* Icons an extension placed ahead of the target's name, drawn after the target's own icon.
		* @type {number[]}
		*/
		this._j._nameIconIndices = [];
		/**
		* The battler of the target.
		* @type {Game_Actor|Game_Enemy}
		*/
		this._j._battler = null;
		/**
		* Whether or not this window requires a target update.
		* @type {boolean}
		*/
		this._j._requestTargetRefresh = true;
		/**
		* The duration until this window is deemed inactive.
		* @type {number}
		*/
		this._j._inactivityTimer = 0;
	}
	/**
	* Gets the j.
	* @returns {{_spriteCache: Map<string, Sprite>, _name: string, _nameColorHex: string, _text: string,
	* _icon: number, _nameIconIndices: number[], _battler: Game_Battler|null, _requestTargetRefresh: boolean,
	* _inactivityTimer: number}} The j.
	*/
	j() {
		return this._j;
	}
	/**
	* Executes any one-time configuration required for this window.
	*/
	configure() {
		this.opacity = 0;
		this.refreshCache();
	}
	/**
	* Empties and recreates the entire cache of sprites.
	*/
	refreshCache() {
		this.emptyCache();
		this.createCache();
	}
	/**
	* Empties the cache of all sprites.
	*/
	emptyCache() {
		this.j()._spriteCache.forEach((value, _) => value.destroy());
		this.j()._spriteCache.clear();
	}
	/**
	* Ensures all sprites are created and available for use.
	*/
	createCache() {
		this.getOrCreateTargetHpGaugeSprite();
		this.getOrCreateTargetMpGaugeSprite();
		this.getOrCreateTargetTpGaugeSprite();
	}
	/**
	* Creates the target's hp gauge sprite for this window and caches it.
	* @returns {Sprite_MapGauge} The gauge sprite of the target.
	*/
	getOrCreateTargetHpGaugeSprite() {
		return this.getOrCreateGaugeSprite("targetframe-enemy-hp-gauge", Window_TargetFrame.GaugeSizes.hp);
	}
	/**
	* Creates the target's mp gauge sprite for this window and caches it.
	* @returns {Sprite_MapGauge} The gauge sprite of the target.
	*/
	getOrCreateTargetMpGaugeSprite() {
		return this.getOrCreateGaugeSprite("targetframe-enemy-mp-gauge", Window_TargetFrame.GaugeSizes.mp);
	}
	/**
	* Creates the target's tp gauge sprite for this window and caches it.<br/>
	* The tp gauge stands on end beside the others, turned however far the plugin settings say.
	* @returns {Sprite_MapGauge} The gauge sprite of the target.
	*/
	getOrCreateTargetTpGaugeSprite() {
		const sprite = this.getOrCreateGaugeSprite("targetframe-enemy-tp-gauge", Window_TargetFrame.GaugeSizes.tp);
		sprite.rotation = J.HUD.EXT.TARGET.Metadata.TpGaugeRotation * (Math.PI / 180);
		return sprite;
	}
	/**
	* Creates a gauge sprite of the given size for this window and caches it under the given key- or hands back
	* the one already cached there.
	* @param {string} key The key the gauge is cached under.
	* @param {{width: number, height: number}} size The size of the gauge, in pixels.
	* @returns {Sprite_MapGauge}
	*/
	getOrCreateGaugeSprite(key, size) {
		if (this.j()._spriteCache.has(key)) {
			return this.j()._spriteCache.get(key);
		}
		const { width, height } = size;
		const sprite = new Sprite_MapGauge(width, height, height);
		this.j()._spriteCache.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Sets the target that this window should be tracking.
	* @param {FramedTarget} target The name of the target.
	*/
	setTarget(target) {
		this.j()._name = target.name;
		this.j()._nameColorHex = target.nameColorHex;
		this.j()._text = target.text;
		this.j()._icon = target.icon;
		this.j()._nameIconIndices = target.nameIconIndices;
		this.j()._battler = target.battler;
		this.j()._configuration = target.configuration;
		this.refresh();
	}
	/**
	* Sets whether or not this window needs to refresh its target.
	*/
	requestTargetRefresh() {
		this.j()._requestTargetRefresh = true;
	}
	/**
	* Gets whether or not this window needs to refresh its target.
	* @returns {boolean}
	*/
	hasRequestTargetRefresh() {
		return this.j()._requestTargetRefresh;
	}
	/**
	* Acknowledges the request to refresh the target of this window.
	*/
	acknowledgeTargetRefresh() {
		this.j()._requestTargetRefresh = false;
	}
	/**
	* Gets the name of the current target of this window.
	* @returns {string}
	*/
	targetName() {
		return this.j()._name;
	}
	/**
	* Gets the extra line of information for the current target of this window.
	* @returns {string|String.empty}
	*/
	targetText() {
		return this.j()._text;
	}
	/**
	* Gets the icon of the current target of this window.
	* @returns {number}
	*/
	targetIcon() {
		return this.j()._icon;
	}
	/**
	* Gets the icons an extension placed ahead of the current target's name.
	* @returns {number[]}
	*/
	targetNameIconIndices() {
		return this.j()._nameIconIndices;
	}
	/**
	* Gets the configuration of the current target.
	* @returns {FramedTargetConfiguration|null}
	*/
	targetConfiguration() {
		return this.j()._configuration;
	}
	/**
	* Refreshes the contents of this window.
	*/
	refresh() {
		this.contents.clear();
		this.resetInactivityTimer();
		this.requestTargetRefresh();
		this.updateTarget();
	}
	/**
	* Resets the inactivity timer back to max.
	*/
	resetInactivityTimer() {
		this.j()._inactivityTimer = Window_TargetFrame.MaxDuration;
	}
	/**
	* Hooks into the update cycle for updating this window.
	*/
	update() {
		super.update();
		this.updateTarget();
		this.alpha = HudInterferenceResolver.nextFrameAlpha(this);
	}
	/**
	* Updates the target of this window as-necessary.
	*/
	updateTarget() {
		if ($hudManager.hasRequestTargetFrameRefreshInactivityTimer()) {
			this.resetInactivityTimer();
			$hudManager.acknowledgeTargetFrameInactivityTimerRefresh();
		}
		this.handleInactivity();
		if (this.needsTargetUpdate()) {
			const x = 0;
			const y = 0;
			this.drawContent(x, y);
			this.acknowledgeTargetRefresh();
		}
	}
	/**
	* Max width for subtext lines that span the window body.
	* @returns {number}
	*/
	targetFrameBodyTextWidth() {
		return Math.max(200, this.contentsWidth() - 8);
	}
	/**
	* Lays out the target frame, top to bottom: a name row of icons, level, and name; the target's extra
	* text beneath that, when it has any; then the gauges.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawContent(x, y) {
		this.drawTargetNameRow(x, y);
		this.drawTargetExtra(x, y + 24);
		this.drawTargetBattlerInfo(x, y);
	}
	/**
	* Draws the name row: the target's icons, then its level, then its name, left to right.<br/>
	* Each piece is drawn on its own, so each keeps its own size and color, and each is centered on the
	* name's line- the name being the tallest thing on it.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetNameRow(x, y) {
		const iconsWidth = this.drawTargetRowIcons(x, y);
		const levelX = x + iconsWidth;
		const levelWidth = this.drawTargetLevel(levelX, y + 5);
		const levelSpan = levelWidth > 0 ? levelWidth + 6 : 0;
		this.drawTargetName(levelX + levelSpan, y);
	}
	/**
	* Draws the icons that lead the name row: the target's own icon, then any an extension set ahead of
	* its name.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate of the row.
	* @returns {number} The width the icons took, including the gap after them; 0 when there were none.
	*/
	drawTargetRowIcons(x, y) {
		const iconIndices = this.targetRowIconIndices();
		if (iconIndices.length === 0) return 0;
		const iconY = y + 1;
		const pitch = ImageManager.iconWidth + 2;
		iconIndices.forEach((iconIndex, index) => {
			this.drawIcon(iconIndex, x + index * pitch, iconY);
		});
		return iconIndices.length * pitch + 4;
	}
	/**
	* The icon indices that lead the name row, in the order they are drawn.
	* @returns {number[]}
	*/
	targetRowIconIndices() {
		const ownIcons = this.hasTargetIcon() ? [this.targetIcon()] : [];
		return [...ownIcons, ...this.targetNameIconIndices()];
	}
	/**
	* Handles inactivity of this window.
	* Counts down the inactivity timer and manages visibility as-necessary.
	*/
	handleInactivity() {
		this.j()._inactivityTimer--;
		if (this.j()._inactivityTimer < 60) {
			this.fadeOutWindow();
		} else {
			this.fadeInWindow();
		}
	}
	/**
	* Fades out the target frame's contents and sprites.<br/>
	* The frame floats over the map with no window drawn behind it, so there is no window frame or background
	* to fade- {@link #configure} hid those for good.
	*/
	fadeOutWindow() {
		this.contentsOpacity -= 10;
		this.j()._spriteCache.forEach((sprite, _) => sprite.opacity -= 10);
	}
	/**
	* Fades in the target frame's contents and sprites.<br/>
	* Only those two- the window frame and background stay hidden, so the frame keeps floating.
	*/
	fadeInWindow() {
		this.contentsOpacity += 40;
		this.j()._spriteCache.forEach((sprite, _) => sprite.opacity += 40);
	}
	/**
	* Determines whether or not the target data should be updated.
	* @returns {boolean} True if it needs an update, false otherwise.
	*/
	needsTargetUpdate() {
		if (!this.hasRequestTargetRefresh()) return false;
		return true;
	}
	/**
	* Draws the target's name in the window.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetName(x, y) {
		let name = `\\FS[24]${this.targetName()}`;
		if (J.MESSAGE) {
			name = `\\*${name}`;
		}
		const color = this.targetNameColor();
		const width = this.contentsWidth() - x;
		this.drawTextExInColor(name, x, y, width, color);
	}
	/**
	* The color the target's name is drawn in.<br/>
	* The color an extension asked for on the framed target, when it asked for one- J-Passive-Affix asks for a
	* tier's color- and the normal text color otherwise.
	* @returns {string}
	*/
	targetNameColor() {
		const hex = this.j()._nameColorHex;
		if (hex !== String.empty) return hex;
		return ColorManager.normalColor();
	}
	/**
	* Draws text-coded text starting in the given color, and reports how wide it drew.<br/>
	* {@link Window_Base#drawTextEx} opens by resetting the font, and that reset returns the text color to
	* normal- so a color set before calling it never survives into the draw. This takes the same steps with
	* the color applied after the reset instead.
	* @param {string} text The text to draw, escape codes included.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} width The width the text may take.
	* @param {string} color The color the text starts in.
	* @returns {number}
	*/
	drawTextExInColor(text, x, y, width, color) {
		this.resetFontSettings();
		this.changeTextColor(color);
		const textState = this.createTextState(text, x, y, width);
		this.processAllText(textState);
		this.resetTextColor();
		return textState.outputWidth;
	}
	/**
	* Draws the target's level in the window.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @returns {number} The width the level took; 0 when there was no level to draw.
	*/
	drawTargetLevel(x, y) {
		if (!this.canDrawTargetLevel()) return 0;
		const { level } = this.j()._battler;
		if (!level) return 0;
		const levelString = `\\FS[14]Lv.${level.padZero(3)}`;
		return this.drawTargetLevelText(levelString, x, y);
	}
	/**
	* Draws the already-built level string at the given spot, in the level's color.<br/>
	* Kept apart from {@link #drawTargetLevel} so a frame with a different layout can decide where the
	* level goes without re-deciding whether there is a level to draw at all.
	* @param {string} levelString The level text, escape codes included.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @returns {number} The width the level took.
	*/
	drawTargetLevelText(levelString, x, y) {
		const color = this.targetLevelColor();
		const width = this.contentsWidth() - x;
		return this.drawTextExInColor(levelString, x, y, width, color);
	}
	/**
	* The color the target's level is drawn in.<br/>
	* The normal text color by default. This is the hook for extensions that have something to say about a
	* level- J-Level-Sync marks a synced level in its own color- so they can color the level without building
	* or drawing it themselves.
	* @returns {string}
	*/
	targetLevelColor() {
		return ColorManager.normalColor();
	}
	/**
	* Determines whether or not we can draw the level of the target.
	* @returns {boolean} True if we can draw levels, false otherwise.
	*/
	canDrawTargetLevel() {
		if (!J.LEVEL) return false;
		if (!this.j()._battler) return false;
		return true;
	}
	/**
	* Draws the target's extra information in the window.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetExtra(x, y) {
		if (!this.hasTargetText()) return;
		this.drawTextEx(`\\FS[14]${this.targetText()}`, x, y, this.targetFrameBodyTextWidth());
	}
	/**
	* Determine whether or not we have extra text to draw for the current target.
	* @returns {boolean}
	*/
	hasTargetText() {
		if (!this.targetText()) return false;
		return true;
	}
	/**
	* Determines whether or not we have an icon to draw for the current target.
	* @returns {boolean}
	*/
	hasTargetIcon() {
		if (!this.targetIcon()) return false;
		return true;
	}
	/**
	* Draws the target's battler data- if present- in the window.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetBattlerInfo(x, y) {
		if (this.j()._battler) {
			const currentX = x + this.targetBattlerGaugesX();
			const currentY = y + this.targetBattlerGaugesY();
			this.drawTargetBattlerGauges(currentX, currentY);
		} else {
			this.j()._spriteCache.forEach((value) => value.hide());
		}
	}
	/**
	* Calculate the X coordinate for gauges.<br/>
	* The gauges are children of the window rather than of its contents, and the contents start the window's
	* padding in from its edge- so shifting by the padding is what lines the gauges up with the name row.
	* @returns {number}
	*/
	targetBattlerGaugesX() {
		return this.padding;
	}
	/**
	* Calculate the Y coordinate for gauges.
	* @returns {number}
	*/
	targetBattlerGaugesY() {
		if (this.hasTargetText()) {
			return 64;
		}
		return 44;
	}
	/**
	* How far below the top of the gauges the afflictions start.<br/>
	* The mp gauge hangs beneath the hp gauge when it is shown, so the gauges run deeper with it than without.
	* @returns {number}
	*/
	targetGaugeStackHeight() {
		const { hp, mp } = Window_TargetFrame.GaugeSizes;
		if (this.targetConfiguration().showMp) return hp.height + 2 + mp.height + 4;
		return hp.height + 4;
	}
	/**
	* Draws the target's various gauges.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetBattlerGauges(x, y) {
		const mpY = y + Window_TargetFrame.GaugeSizes.hp.height + 2;
		this.drawTargetHpGauge(x, y);
		this.drawTargetMpGauge(x, mpY);
		this.drawTargetTpGauge(x - 10, y + 32);
	}
	/**
	* Draws the hp gauge of the target.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetHpGauge(x, y) {
		const gauge = this.getOrCreateTargetHpGaugeSprite();
		const { showHp } = this.targetConfiguration();
		this.placeTargetGauge(gauge, "hp", showHp, x, y);
	}
	/**
	* Draws the mp gauge of the target.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetMpGauge(x, y) {
		const gauge = this.getOrCreateTargetMpGaugeSprite();
		const { showMp } = this.targetConfiguration();
		this.placeTargetGauge(gauge, "mp", showMp, x, y);
	}
	/**
	* Draws the tp gauge of the target.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetTpGauge(x, y) {
		const gauge = this.getOrCreateTargetTpGaugeSprite();
		const { showTp } = this.targetConfiguration();
		this.placeTargetGauge(gauge, "tp", showTp, x, y);
	}
	/**
	* Points one of the target's gauges at the framed battler and puts it on screen- or hides it, when the target
	* does not show that gauge.<br/>
	* A map gauge that has been hidden also stops updating, and showing it again does not start it back up, so
	* both happen here explicitly. Without that, the gauge would draw once and then freeze.
	* @param {Sprite_MapGauge} gauge The gauge to place.
	* @param {string} statusType The resource the gauge shows, such as "hp".
	* @param {boolean} isShown Whether the target shows this gauge at all.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	placeTargetGauge(gauge, statusType, isShown, x, y) {
		if (!isShown) {
			gauge.hide();
			return;
		}
		gauge.setup(this.j()._battler, statusType);
		gauge.show();
		gauge.activateGauge();
		gauge.move(x, y);
	}
};

//#endregion
//#region src/plugins/hud/ext/target/patches/Window_TargetFrame.js
if (J.HUD && J.HUD.EXT.TARGET) {
	J.HUD.EXT.TARGET.Aliased.Window_TargetFrame.set("initialize", Window_TargetFrame.prototype.initialize);
	/**
	* Extends {@link Window_TargetFrame#initialize}.<br/>
	* Wires the shared affliction presenter after the target frame cache exists.
	* @param {Rectangle} rect The shape representing this window.
	*/
	Window_TargetFrame.prototype.initialize = function(rect) {
		J.HUD.EXT.TARGET.Aliased.Window_TargetFrame.get("initialize").call(this, rect);
		/**
		* Shared affliction presenter for the framed battler.
		* @type {StateAfflictionHudPresenter}
		*/
		this._afflictionPresenter = new StateAfflictionHudPresenter(this, this._j._spriteCache);
	};
	/**
	* Builds the layout spec for the target frame's affliction strip.<br/>
	* The frame keeps it compact: one row shared by debuffs and buffs, half-size icons, and a colored square
	* behind each icon to tell the two apart.
	* @returns {StateAfflictionHudLayoutSpec}
	*/
	Window_TargetFrame.prototype.targetAfflictionLayoutSpec = function() {
		const layout = new StateAfflictionHudLayoutSpec();
		layout.originX = this.targetBattlerGaugesX();
		layout.originY = this.targetBattlerGaugesY() + this.targetGaugeStackHeight();
		layout.singleRow = true;
		layout.iconScale = .5;
		layout.polarityBacking = true;
		layout.iconPitch = 30;
		layout.timerOffsetY = 5;
		layout.timerFontSizeReduction = 12;
		layout.stackFontSizeReduction = 12;
		return layout;
	};
	/**
	* Updates affliction rows every frame while a battler is framed.
	*/
	Window_TargetFrame.prototype.updateTargetAfflictions = function() {
		if (!this.afflictionPresenter()) {
			return;
		}
		if (!this.battler()) {
			return;
		}
		if (this.inactivityTimer() < 60) {
			return;
		}
		const layout = this.targetAfflictionLayoutSpec();
		this.afflictionPresenter().render(this.battler(), layout);
	};
	J.HUD.EXT.TARGET.Aliased.Window_TargetFrame.set("updateTarget", Window_TargetFrame.prototype.updateTarget);
	Window_TargetFrame.prototype.updateTarget = function() {
		J.HUD.EXT.TARGET.Aliased.Window_TargetFrame.get("updateTarget").call(this);
		this.updateTargetAfflictions();
	};
}
/**
* Gets the affliction presenter.
* @returns {StateAfflictionHudPresenter} The afflictionPresenter.
*/
Window_TargetFrame.prototype.afflictionPresenter = function() {
	return this._afflictionPresenter;
};
/**
* Gets the battler currently displayed in the target frame.
* @returns {JABS_Battler} The displayed battler.
*/
Window_TargetFrame.prototype.battler = function() {
	return this._j._battler;
};
/**
* Gets the inactivity timer.
* @returns {number} The inactivityTimer.
*/
Window_TargetFrame.prototype.inactivityTimer = function() {
	return this._j._inactivityTimer;
};

//#endregion
//#region src/plugins/hud/ext/target/scenes/Scene_Map.js
/**
* Extends {@link #initHudMembers}.<br/>
* Includes initialization of the target frame members.
*/
J.HUD.EXT.TARGET.Aliased.Scene_Map.set("initHudMembers", Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function() {
	J.HUD.EXT.TARGET.Aliased.Scene_Map.get("initHudMembers").call(this);
	/**
	* A grouping of all properties that belong to target extension
	* of the HUD.
	*/
	this._j._hud._target = {};
	/**
	* The target frame showing enemy data.
	* @type {Window_TargetFrame}
	*/
	this._j._hud._target._targetFrame = null;
	/**
	* The target frame showing boss data.
	* This is much bigger than the regular target frame.
	* @type {Window_TargetFrame}
	* @private
	*/
	this._j._hud._target._bossFrame = null;
};
/**
* Extends {@link #createAllWindows}.<br/>
* Includes creation of the target frame window.
*/
J.HUD.EXT.TARGET.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.HUD.EXT.TARGET.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createTargetFrameWindow();
};
/**
* Creates the target frame window and adds it to tracking.
*/
Scene_Map.prototype.createTargetFrameWindow = function() {
	const window = this.buildTargetFrameWindow();
	this.setTargetFrameWindow(window);
	this.addWindow(window);
};
/**
* Sets up and defines the target frame window.
* @returns {Window_TargetFrame}
*/
Scene_Map.prototype.buildTargetFrameWindow = function() {
	const rectangle = this.targetFrameWindowRect();
	const window = new Window_TargetFrame(rectangle);
	return window;
};
/**
* Creates the rectangle representing the window for the target frame.
* @returns {Rectangle}
*/
Scene_Map.prototype.targetFrameWindowRect = function() {
	const width = J.HUD.EXT.TARGET.Metadata.TargetFrameWidth;
	const height = J.HUD.EXT.TARGET.Metadata.TargetFrameHeight;
	const x = J.HUD.EXT.TARGET.Metadata.TargetFrameX;
	const y = J.HUD.EXT.TARGET.Metadata.TargetFrameY;
	return new Rectangle(x, y, width, height);
};
/**
* Gets the currently tracked target frame window.
* @returns {Window_TargetFrame}
*/
Scene_Map.prototype.getTargetFrameWindow = function() {
	return this._j._hud._target._targetFrame;
};
/**
* Set the currently tracked target frame window to the given window.
* @param {Window_TargetFrame} window The window to track.
*/
Scene_Map.prototype.setTargetFrameWindow = function(window) {
	this._j._hud._target._targetFrame = window;
};
/**
* Extends {@link #updateHudFrames}.<br/>
* Includes updating the target frame.
*/
J.HUD.EXT.TARGET.Aliased.Scene_Map.set("updateHudFrames", Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function() {
	J.HUD.EXT.TARGET.Aliased.Scene_Map.get("updateHudFrames").call(this);
	this.handleAssignTarget();
};
/**
* Handles incoming requests to assign a target to the target frame.
*/
Scene_Map.prototype.handleAssignTarget = function() {
	if (!$hudManager.hasRequestAssignTarget()) return;
	const newTarget = $hudManager.getNewTarget();
	this.getTargetFrameWindow().setTarget(newTarget);
	$hudManager.acknowledgeAssignedTarget();
};

//#endregion
//# sourceMappingURL=J-HUD-TargetFrame.js.map