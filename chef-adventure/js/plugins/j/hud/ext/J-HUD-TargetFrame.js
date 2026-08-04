//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 HUD-TARGET] A HUD frame that displays your battle target.
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
 * that is currently set. These gauges are not default window gauges, but
 * images loaded from disk instead. You must add two images matching these file
 * names into a new directory called "hud" inside your images directory:
 *  /img/hud/target-gauge-background.png
 *  /img/hud/target-gauge-foreground.png
 * ============================================================================
 * ABOUT THE IMAGES:
 * As mentioned above, there are two images required to construct the gauges in
 * the target frame.
 *
 * FIRST IMAGE:
 *  The first image, the background image, is typically a darker image that is
 *  drawn as a backdrop to the gauge.
 *
 * SECOND IMAGE:
 *  The second image makes up the middleground and foreground of the gauge.
 *  The format is two horizontal gauges of equal height stacked ontop of
 *  eachother. The top of these two gauges is the "foreground", representing
 *  the actual value of the gauge. The bottom of these two gauges is the
 *  "middleground", representing the "current" value of the gauge. This spends
 *  time in-transition a lot, and typically isn't ever fully displayed.
 *
 * In both images' cases, you can swap out the images to whatever other gauge
 * imagery you would like, though you'll likely need to fiddle with the x:y
 * plugin parameters of the various gauges to get it just right. You only need
 * to make sure that the file names remain the same, as those are hard-coded.
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
 * If no target frame icon is available, the gauges will automatically move to
 * the left to fill the empty space that would've been left otherwise by the
 * missing icon.
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
 * that matches the icon index of 25 to the left of the gauges (if applicable).
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
 * @param targetFrameGauge
 * @text Target Frame Gauge
 *
 * @param backgroundGauge
 * @parent targetFrameGauge
 * @text Background Settings
 *
 * @param backgroundImageFilename
 * @parent backgroundGauge
 * @type file
 * @text Background Image File
 * @desc The file that represents the background image; see plugin description for details.
 * @default img/hud/target-gauge-background
 *
 * @param backgroundGaugeImageX
 * @parent backgroundGauge
 * @type number
 * @min 0
 * @text Background Image X
 * @desc The x coordinate correction of the backdrop gauge image, aka the background.
 * @default 0
 *
 * @param backgroundGaugeImageY
 * @parent backgroundGauge
 * @type number
 * @min 0
 * @text Background Image Y
 * @desc The y coordinate correction of the backdrop gauge image, aka the background.
 * @default 0
 *
 * @param middlegroundGauge
 * @parent targetFrameGauge
 * @text Middleground Settings
 *
 * @param middlegroundGaugeImageX
 * @parent middlegroundGauge
 * @type number
 * @min 0
 * @text Middleground Image X
 * @desc Horizontal position is set from the measured backdrop trough at runtime so HP/MP stay aligned; Y still uses this block.
 * @default 2
 *
 * @param middlegroundGaugeImageY
 * @parent middlegroundGauge
 * @type number
 * @min 0
 * @text Middleground Image Y
 * @desc The y coordinate correction of the "current" gauge image, aka the middleground.
 * @default 2
 *
 * @param foregroundGauge
 * @parent targetFrameGauge
 * @text Foreground Settings
 *
 * @param foregroundImageFilename
 * @parent foregroundGauge
 * @type file
 * @text Background Image File
 * @desc The file that represents the foreground image; see plugin description for details.
 * @default img/hud/target-gauge-foreground
 *
 * @param foregroundGaugeImageX
 * @parent foregroundGauge
 * @type number
 * @min 0
 * @text Foreground Image X
 * @desc Horizontal position is set from the measured backdrop trough at runtime so HP/MP stay aligned; Y still uses this block.
 * @default 2
 *
 * @param foregroundGaugeImageY
 * @parent foregroundGauge
 * @type number
 * @min 0
 * @text Foreground Image Y
 * @desc The y coordinate correction of the "current" gauge image, aka the foreground.
 * @default 3
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
 * @param hpGaugeScaleX
 * @parent hpSettings
 * @type number
 * @decimals 2
 * @min -10.00
 * @max 10.00
 * @text Horizontal Scaling
 * @desc The scaling for how wide the HP gauge is.
 * @default 2.00
 *
 * @param hpGaugeScaleY
 * @parent hpSettings
 * @type number
 * @decimals 2
 * @min -10.00
 * @max 10.00
 * @text Vertical Scaling
 * @desc The scaling for how tall the HP gauge is.
 * @default 1.00
 *
 * @param hpGaugeRotation
 * @parent hpSettings
 * @type number
 * @min -360
 * @max 360
 * @text Rotation
 * @desc The degree of rotation for the HP gauge. Between -360 and 360.
 * @default 0
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
 * @param mpGaugeScaleX
 * @parent mpSettings
 * @type number
 * @decimals 2
 * @min -10.00
 * @max 10.00
 * @text Horizontal Scaling
 * @desc The scaling for how wide the MP gauge is.
 * @default 1.00
 *
 * @param mpGaugeScaleY
 * @parent mpSettings
 * @type number
 * @decimals 2
 * @min -10.00
 * @max 10.00
 * @text Vertical Scaling
 * @desc The scaling for how tall the MP gauge is.
 * @default 0.50
 *
 * @param mpGaugeRotation
 * @parent mpSettings
 * @type number
 * @min -360
 * @max 360
 * @text Rotation
 * @desc The degree of rotation for the MP gauge. Between -360 and 360.
 * @default 0
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
 * @param tpGaugeScaleX
 * @parent tpSettings
 * @type number
 * @decimals 2
 * @min -10.00
 * @max 10.00
 * @text Horizontal Scaling
 * @desc The scaling for how wide the TP gauge is.
 * @default 0.30
 *
 * @param tpGaugeScaleY
 * @parent tpSettings
 * @type number
 * @decimals 2
 * @min -10.00
 * @max 10.00
 * @text Vertical Scaling
 * @desc The scaling for how tall the TP gauge is.
 * @default 0.40
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
		* The x coordinate of the background gauge image.
		* @type {number}
		*/
		this.BackgroundGaugeImageX = Number(this.parsedPluginParameters["backgroundGaugeImageX"]);
		/**
		* The y coordinate of the background gauge image.
		* @type {number}
		*/
		this.BackgroundGaugeImageY = Number(this.parsedPluginParameters["backgroundGaugeImageY"]);
		/**
		* The x coordinate of the middleground gauge image.
		* @type {number}
		*/
		this.MiddlegroundGaugeImageX = Number(this.parsedPluginParameters["middlegroundGaugeImageX"]);
		/**
		* The y coordinate of the middleground gauge image.
		* @type {number}
		*/
		this.MiddlegroundGaugeImageY = Number(this.parsedPluginParameters["middlegroundGaugeImageY"]);
		/**
		* The x coordinate of the foreground gauge image.
		* @type {number}
		*/
		this.ForegroundGaugeImageX = Number(this.parsedPluginParameters["foregroundGaugeImageX"]);
		/**
		* The y coordinate of the foreground gauge image.
		* @type {number}
		*/
		this.ForegroundGaugeImageY = Number(this.parsedPluginParameters["foregroundGaugeImageY"]);
		/**
		* The filename of the background gauge image.
		* @type {string}
		*/
		this.BackgroundFilename = this.parsedPluginParameters["backgroundImageFilename"];
		/**
		* The filename of the foreground gauge image.
		* @type {string}
		*/
		this.ForegroundFilename = this.parsedPluginParameters["foregroundImageFilename"];
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
		* The x scale of the hp gauge sprite.
		* @type {number}
		*/
		this.HpGaugeScaleX = Number(this.parsedPluginParameters["hpGaugeScaleX"]);
		/**
		* The y scale of the hp gauge sprite.
		* @type {number}
		*/
		this.HpGaugeScaleY = Number(this.parsedPluginParameters["hpGaugeScaleY"]);
		/**
		* The rotation of the hp gauge sprite in degrees.
		* @type {number}
		*/
		this.HpGaugeRotation = Number(this.parsedPluginParameters["hpGaugeRotation"]);
		/**
		* The x scale of the mp gauge sprite.
		* @type {number}
		*/
		this.MpGaugeScaleX = Number(this.parsedPluginParameters["mpGaugeScaleX"]);
		/**
		* The y scale of the mp gauge sprite.
		* @type {number}
		*/
		this.MpGaugeScaleY = Number(this.parsedPluginParameters["mpGaugeScaleY"]);
		/**
		* The rotation of the mp gauge sprite in degrees.
		* @type {number}
		*/
		this.MpGaugeRotation = Number(this.parsedPluginParameters["mpGaugeRotation"]);
		/**
		* The x scale of the tp gauge sprite.
		* @type {number}
		*/
		this.TpGaugeScaleX = Number(this.parsedPluginParameters["tpGaugeScaleX"]);
		/**
		* The y scale of the tp gauge sprite.
		* @type {number}
		*/
		this.TpGaugeScaleY = Number(this.parsedPluginParameters["tpGaugeScaleY"]);
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
	const requiredHudVersion = "2.0.0";
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
J.HUD.EXT.TARGET.Metadata = new JHudTarget_PluginMetadata("J-HUD-TargetFrame", "1.1.0");
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
//#region src/plugins/hud/ext/target/sprites/Sprite_FlowingGauge.js
/**
* A gauge that acts like a regular `Sprite_Gauge` that is instead based
* on images and also "flows".
*/
var Sprite_FlowingGauge = class Sprite_FlowingGauge extends Sprite {
	/**
	* Gets the background bitmap.
	* @returns {Bitmap|null} The backgroundBitmap.
	*/
	backgroundBitmap() {
		return this._backgroundBitmap;
	}
	/**
	* Sets the is ready.
	* @param {boolean} newIsReady The new isReady.
	*/
	setIsReady(newIsReady) {
		this._isReady = newIsReady;
	}
	/**
	* Gets the gauge bitmap.
	* @returns {Bitmap|null} The gaugeBitmap.
	*/
	gaugeBitmap() {
		return this._gaugeBitmap;
	}
	/**
	* Sets the gauge bitmap.
	* @param {Bitmap|null} newGaugeBitmap The new gaugeBitmap.
	*/
	setGaugeBitmap(newGaugeBitmap) {
		this._gaugeBitmap = newGaugeBitmap;
	}
	/**
	* Gets the gauge background.
	* @returns {Sprite} The gaugeBackground.
	*/
	gaugeBackground() {
		return this._gaugeBackground;
	}
	/**
	* Sets the gauge background.
	* @param {Sprite} newGaugeBackground The new gaugeBackground.
	*/
	setGaugeBackground(newGaugeBackground) {
		this._gaugeBackground = newGaugeBackground;
	}
	/**
	* Gets the gauge current sprite.
	* @returns {Sprite} The gaugeCurrentSprite.
	*/
	gaugeCurrentSprite() {
		return this._gaugeCurrentSprite;
	}
	/**
	* Sets the gauge current sprite.
	* @param {Sprite} newGaugeCurrentSprite The new gaugeCurrentSprite.
	*/
	setGaugeCurrentSprite(newGaugeCurrentSprite) {
		this._gaugeCurrentSprite = newGaugeCurrentSprite;
	}
	/**
	* Gets the gauge actual sprite.
	* @returns {Sprite} The gaugeActualSprite.
	*/
	gaugeActualSprite() {
		return this._gaugeActualSprite;
	}
	/**
	* Sets the gauge actual sprite.
	* @param {Sprite} newGaugeActualSprite The new gaugeActualSprite.
	*/
	setGaugeActualSprite(newGaugeActualSprite) {
		this._gaugeActualSprite = newGaugeActualSprite;
	}
	/**
	* Gets the gauge current.
	* @returns {number} The gaugeCurrent.
	*/
	gaugeCurrent() {
		return this._gaugeCurrent;
	}
	/**
	* Sets the gauge current.
	* @param {number} newGaugeCurrent The new gaugeCurrent.
	*/
	setGaugeCurrent(newGaugeCurrent) {
		this._gaugeCurrent = newGaugeCurrent;
	}
	/**
	* Gets the gauge target.
	* @returns {number} The gaugeTarget.
	*/
	gaugeTarget() {
		return this._gaugeTarget;
	}
	/**
	* Sets the gauge target.
	* @param {number} newGaugeTarget The new gaugeTarget.
	*/
	setGaugeTarget(newGaugeTarget) {
		this._gaugeTarget = newGaugeTarget;
	}
	/**
	* Gets the gauge max.
	* @returns {number} The gaugeMax.
	*/
	gaugeMax() {
		return this._gaugeMax;
	}
	/**
	* Sets the gauge max.
	* @param {number} newGaugeMax The new gaugeMax.
	*/
	setGaugeMax(newGaugeMax) {
		this._gaugeMax = newGaugeMax;
	}
	/**
	* Gets the battler.
	* @returns {Game_Enemy|null} The battler.
	*/
	battler() {
		return this._battler;
	}
	/**
	* Sets the battler.
	* @param {Game_Enemy|null} newBattler The new battler.
	*/
	setBattler(newBattler) {
		this._battler = newBattler;
	}
	/**
	* Gets the gauge type.
	* @returns {Sprite_FlowingGauge.Types} The gaugeType.
	*/
	gaugeType() {
		return this._gaugeType;
	}
	/**
	* Sets the gauge type.
	* @param {Sprite_FlowingGauge.Types} newGaugeType The new gaugeType.
	*/
	setGaugeType(newGaugeType) {
		this._gaugeType = newGaugeType;
	}
	/**
	* Gets the gauge slice fill min x.
	* @returns {number} The gaugeSliceFillMinX.
	*/
	gaugeSliceFillMinX() {
		return this._gaugeSliceFillMinX;
	}
	/**
	* Sets the gauge slice fill min x.
	* @param {number} newGaugeSliceFillMinX The new gaugeSliceFillMinX.
	*/
	setGaugeSliceFillMinX(newGaugeSliceFillMinX) {
		this._gaugeSliceFillMinX = newGaugeSliceFillMinX;
	}
	/**
	* Gets the gauge slice fill inner width.
	* @returns {number} The gaugeSliceFillInnerWidth.
	*/
	gaugeSliceFillInnerWidth() {
		return this._gaugeSliceFillInnerWidth;
	}
	/**
	* Sets the gauge slice fill inner width.
	* @param {number} newGaugeSliceFillInnerWidth The new gaugeSliceFillInnerWidth.
	*/
	setGaugeSliceFillInnerWidth(newGaugeSliceFillInnerWidth) {
		this._gaugeSliceFillInnerWidth = newGaugeSliceFillInnerWidth;
	}
	/**
	* Gets the gauge actual flow limit.
	* @returns {number} The gaugeActualFlowLimit.
	*/
	gaugeActualFlowLimit() {
		return this._gaugeActualFlowLimit;
	}
	/**
	* Sets the gauge actual flow limit.
	* @param {number} newGaugeActualFlowLimit The new gaugeActualFlowLimit.
	*/
	setGaugeActualFlowLimit(newGaugeActualFlowLimit) {
		this._gaugeActualFlowLimit = newGaugeActualFlowLimit;
	}
	/**
	* Gets the gauge actual flow current.
	* @returns {number} The gaugeActualFlowCurrent.
	*/
	gaugeActualFlowCurrent() {
		return this._gaugeActualFlowCurrent;
	}
	/**
	* Sets the gauge actual flow current.
	* @param {number} newGaugeActualFlowCurrent The new gaugeActualFlowCurrent.
	*/
	setGaugeActualFlowCurrent(newGaugeActualFlowCurrent) {
		this._gaugeActualFlowCurrent = newGaugeActualFlowCurrent;
	}
	/**
	* Gets the gauge background track min x.
	* @returns {number} The gaugeBackgroundTrackMinX.
	*/
	gaugeBackgroundTrackMinX() {
		return this._gaugeBackgroundTrackMinX;
	}
	/**
	* Sets the gauge background track min x.
	* @param {number} newGaugeBackgroundTrackMinX The new gaugeBackgroundTrackMinX.
	*/
	setGaugeBackgroundTrackMinX(newGaugeBackgroundTrackMinX) {
		this._gaugeBackgroundTrackMinX = newGaugeBackgroundTrackMinX;
	}
	/**
	* Gets the gauge background track inner width.
	* @returns {number} The gaugeBackgroundTrackInnerWidth.
	*/
	gaugeBackgroundTrackInnerWidth() {
		return this._gaugeBackgroundTrackInnerWidth;
	}
	/**
	* Sets the gauge background track inner width.
	* @param {number} newGaugeBackgroundTrackInnerWidth The new gaugeBackgroundTrackInnerWidth.
	*/
	setGaugeBackgroundTrackInnerWidth(newGaugeBackgroundTrackInnerWidth) {
		this._gaugeBackgroundTrackInnerWidth = newGaugeBackgroundTrackInnerWidth;
	}
	static Types = {
		HP: "hp",
		MP: "mp",
		TP: "tp"
	};
	/**
	* The bitmap for the background sprite.
	* @type {Bitmap|null}
	* @private
	*/
	_backgroundBitmap = null;
	/**
	* The sprite background of this gauge.
	* @type {Sprite}
	*/
	_gaugeBackground = null;
	/**
	* The bitmap of the file that makes up this gauge.
	* It is expected to be a pair of horizontal gauges equal in height.
	* @type {Bitmap|null}
	*/
	_gaugeBitmap = null;
	/**
	* The sprite representing the "current" value of this gauge.
	* It slides gradually over a couple seconds to the target value.
	* @type {Sprite}
	*/
	_gaugeCurrentSprite = null;
	/**
	* The sprite representing the "actual" value of this gauge.
	* It does not slide, it is instantly changed.
	* @type {Sprite}
	*/
	_gaugeActualSprite = null;
	/**
	* The battler this gauge is representing when in use.
	* @type {Game_Enemy|null}
	*/
	_battler = null;
	/**
	* The "current" value of the gauge in numeric form.
	* @type {number}
	*/
	_gaugeCurrent = 0;
	/**
	* The "target" value of the gauge in numeric form.
	* @type {number}
	*/
	_gaugeTarget = 0;
	/**
	* The "max" value of the gauge in numeric form.
	* @type {number}
	*/
	_gaugeMax = 0;
	/**
	* The type of gauge this is, such as HP, MP, or TP.
	* @type {Sprite_FlowingGauge.Types}
	*/
	_gaugeType = String.empty;
	/**
	* Whether or not this gauge is setup and ready to be drawn.
	* @type {boolean}
	*/
	_isReady = false;
	/**
	* Left edge (in texture pixels) of the painted fill inside one gauge slice.
	* @type {number}
	*/
	_gaugeSliceFillMinX = 0;
	/**
	* Width (in texture pixels) of the painted fill inside one gauge slice.
	* @type {number}
	*/
	_gaugeSliceFillInnerWidth = 0;
	/**
	* Left edge (in texture pixels) of the background track interior.
	* @type {number}
	*/
	_gaugeBackgroundTrackMinX = 0;
	/**
	* Width (in texture pixels) of the background track interior.
	* @type {number}
	*/
	_gaugeBackgroundTrackInnerWidth = 0;
	/**
	* Initializes all properties of this class.
	*/
	initialize(bitmap) {
		super.initialize(bitmap);
		this.initializeGauges();
	}
	/**
	* Initializes the gauges based on bitmaps loaded from file.
	*/
	initializeGauges() {
		this.resetValues();
		const backgroundFilename = this.extractFileName(J.HUD.EXT.TARGET.Metadata.BackgroundFilename);
		const backgroundPromise = ImageManager.loadHudBitmap(backgroundFilename);
		backgroundPromise.then((bitmap) => this.setBackgroundBitmap(bitmap)).catch(() => {
			throw new Error("background bitmap failed to load.");
		});
		const foregroundFilename = this.extractFileName(J.HUD.EXT.TARGET.Metadata.ForegroundFilename);
		const foregroundPromise = ImageManager.loadHudBitmap(foregroundFilename);
		foregroundPromise.then((bitmap) => this.setForegroundBitmap(bitmap)).catch(() => {
			throw new Error("background bitmap failed to load.");
		});
		Promise.all([backgroundPromise, foregroundPromise]).then(() => this.onReady());
	}
	/**
	* Extracts the filename out of the extended path.
	* @param {string} longFileName The filename with the path in it.
	* @returns {string} Just the filename.
	*/
	extractFileName(longFileName) {
		const lastSlash = longFileName.lastIndexOf("/") + 1;
		return longFileName.substring(lastSlash);
	}
	/**
	* Sets the background bitmap to the given value.
	* @param {Bitmap} bitmap The bitmap to set to the background.
	*/
	setBackgroundBitmap(bitmap) {
		this._backgroundBitmap = bitmap;
	}
	/**
	* Sets the foreground bitmap to the given value.
	* @param {Bitmap} bitmap The bitmap to set to the foreground.
	*/
	setForegroundBitmap(bitmap) {
		this.setGaugeBitmap(bitmap);
	}
	/**
	* Creates gauge's background sprite.
	*/
	createGaugeBackground() {
		this.setGaugeBackground(new Sprite(this.backgroundBitmap()));
		this.gaugeBackground().x = J.HUD.EXT.TARGET.Metadata.BackgroundGaugeImageX;
		this.gaugeBackground().y = J.HUD.EXT.TARGET.Metadata.BackgroundGaugeImageY;
		this.addChild(this.gaugeBackground());
	}
	/**
	* Creates gauge's foreground sprite.
	*/
	createGaugeForeground() {
		this.setGaugeCurrentSprite(new Sprite(this.gaugeBitmap()));
		this.gaugeCurrentSprite().x = J.HUD.EXT.TARGET.Metadata.MiddlegroundGaugeImageX;
		this.gaugeCurrentSprite().y = J.HUD.EXT.TARGET.Metadata.MiddlegroundGaugeImageY;
		this.addChild(this.gaugeCurrentSprite());
		this.setGaugeActualSprite(new Sprite(this.gaugeBitmap()));
		this.gaugeActualSprite().x = J.HUD.EXT.TARGET.Metadata.ForegroundGaugeImageX;
		this.gaugeActualSprite().y = J.HUD.EXT.TARGET.Metadata.ForegroundGaugeImageY;
		this.addChild(this.gaugeActualSprite());
	}
	/**
	* Resets all gauge values to 0.
	*/
	resetValues() {
		this.setGaugeCurrent(0);
		this.setGaugeTarget(0);
		this.setGaugeMax(0);
	}
	/**
	* Clears the battler of this gauge.
	*/
	clearBattler() {
		this.setBattler(null);
	}
	/**
	* The "current" value of the gauge.
	* This is spends a lot of time in flux due to gradual change for visual enjoyment.
	* If you need the real current value, use `.target()`.
	* @returns {number}
	*/
	current() {
		return this.gaugeCurrent();
	}
	/**
	* The "target" value of the gauge.
	* This is what the "current" is striving to reach.
	* @returns {number}
	*/
	target() {
		if (this.battler()) {
			return this.#targetByType();
		} else {
			return 0;
		}
	}
	/**
	* Gets the target value for this gauge by its gauge type.
	* @returns {number}
	*/
	#targetByType() {
		switch (this.gaugeType()) {
			case Sprite_FlowingGauge.Types.HP: return this.battler().hp;
			case Sprite_FlowingGauge.Types.MP: return this.battler().mp;
			case Sprite_FlowingGauge.Types.TP: return this.battler().tp;
			default: return 0;
		}
	}
	/**
	* The "max" value of the gauge.
	* This is simply the maximum amount that the gauge represents when full.
	* @returns {number}
	*/
	max() {
		if (this.battler()) {
			return this.#maxByType();
		} else {
			return 0;
		}
	}
	/**
	* Gets the max value for this gauge by its gauge type.
	* @returns {number}
	*/
	#maxByType() {
		switch (this.gaugeType()) {
			case Sprite_FlowingGauge.Types.HP: return this.battler().mhp;
			case Sprite_FlowingGauge.Types.MP: return this.battler().mmp;
			case Sprite_FlowingGauge.Types.TP: return this.battler().maxTp();
			default: return 0;
		}
	}
	/**
	* Sets up this gauge with the given enemy battler.
	* @param {Game_Enemy} battler The enemy battler.
	* @param {Sprite_FlowingGauge.Types} gaugeType The type of gauge this is.
	*/
	setup(battler, gaugeType = Sprite_FlowingGauge.Types.HP) {
		this.setBattler(battler);
		this.setGaugeType(gaugeType);
		this.setupGaugeByType();
		this.show();
	}
	/**
	* Sets up the gauge based on the gauge type.
	*/
	setupGaugeByType() {
		this.gaugeCurrentSprite().setColorTone(this.greyTone());
		switch (this.gaugeType()) {
			case Sprite_FlowingGauge.Types.HP:
				this.setupGaugeAsHp();
				break;
			case Sprite_FlowingGauge.Types.MP:
				this.setupGaugeAsMp();
				break;
			case Sprite_FlowingGauge.Types.TP:
				this.setupGaugeAsTp();
				break;
		}
	}
	/**
	* Sets up the gauge as an hp gauge.
	*/
	setupGaugeAsHp() {
		this.setGaugeCurrent(this.battler().hp);
		this.setGaugeTarget(this.battler().hp);
		this.setGaugeMax(this.battler().mhp);
		this.gaugeActualSprite().setHue(this.hpGaugeHue());
	}
	hpGaugeHue() {
		return 0;
	}
	/**
	* Sets up the gauge as an mp gauge.
	*/
	setupGaugeAsMp() {
		this.setGaugeCurrent(this.battler().mp);
		this.setGaugeTarget(this.battler().mp);
		this.setGaugeMax(this.battler().mmp);
		this.gaugeActualSprite().setHue(this.mpGaugeHue());
	}
	mpGaugeHue() {
		return -180;
	}
	/**
	* Sets up the gauge as a tp gauge.
	*/
	setupGaugeAsTp() {
		this.setGaugeCurrent(this.battler().tp);
		this.setGaugeTarget(this.battler().tp);
		const maxTp = this.battler().maxTp();
		this.setGaugeMax(maxTp);
		this.gaugeActualSprite().setHue(this.tpGaugeHue());
	}
	tpGaugeHue() {
		return 80;
	}
	/**
	* Refresh this gauge by redrawing it.
	*/
	refresh() {
		this.drawGauge();
	}
	/**
	* The update loop of this gauge.
	*/
	update() {
		super.update();
		if (!this.isReady()) return;
		this.updateCurrent();
		this.updateFlow();
		this.drawGauge();
	}
	/**
	* Checks if this gauge is ready for drawing.
	* If it is not, then updating will not take place.
	* @returns {boolean} True if this gauge is ready, false otherwise.
	*/
	isReady() {
		return this._isReady;
	}
	/**
	* Executes one-time actions once the gauge is ready.
	*/
	onReady() {
		this.createGaugeBackground();
		this.createGaugeForeground();
		this.measureGaugeArtExtents();
		this.alignGaugeForegroundToBackgroundTrack();
		this.updateFlowMax();
		this.setIsReady(true);
	}
	/**
	* Updates the current and max values of the flow effect.
	*/
	updateFlowMax() {
		const sliceW = this.gaugeWidth();
		const maxFlow = sliceW - this.gaugeSliceFillMinX() - this.gaugeSliceFillInnerWidth();
		this.setGaugeActualFlowLimit(Math.max(1, maxFlow));
		this.setGaugeActualFlowCurrent(Math.floor(Math.random() * this.gaugeActualFlowLimit()));
	}
	/**
	* Updates the current value of the fore-most gauge.
	* This is the background gauge that is a bit slower.
	*/
	updateCurrent() {
		if (!this.canUpdateCurrent()) return;
		if (this.isHpGaugeEmpty()) {
			this.onDefeat();
			return;
		}
		if (this.current() !== this.target()) {
			this.handleCurrentValueUpdate();
		} else {
			this.handleCurrentValueUnchanged();
		}
	}
	/**
	* Handles the update to the "current" value while it is changing either up or down.
	*/
	handleCurrentValueUpdate() {
		const changeRate = this.changeRate();
		if (this.target() < this.current()) {
			this.processCurrentValueIncrease(changeRate);
		} else if (this.target() > this.current()) {
			this.processCurrentValueDecrease(changeRate);
		}
	}
	/**
	* Processes the decrease of the current value and changes the tone.
	*/
	processCurrentValueIncrease(changeRate) {
		this.setGaugeCurrent(this.gaugeCurrent() - changeRate);
		if (this.current() < this.target()) {
			this.setGaugeCurrent(this.gaugeTarget());
		}
		this.gaugeCurrentSprite().setColorTone(this.downTone());
	}
	/**
	* Processes the increase of the current value and changes the tone.
	*/
	processCurrentValueDecrease(changeRate) {
		this.setGaugeCurrent(this.gaugeCurrent() + changeRate);
		if (this.current() > this.target()) {
			this.setGaugeCurrent(this.gaugeTarget());
		}
		this.gaugeCurrentSprite().setColorTone(this.upTone());
	}
	/**
	* Handles the update to the "current" value while it is unchanging.
	*/
	handleCurrentValueUnchanged() {
		this.gaugeCurrentSprite().setColorTone(this.greyTone());
	}
	/**
	* Whether or not we can update the
	* @returns {boolean}
	*/
	canUpdateCurrent() {
		if (!this.battler()) return false;
		return true;
	}
	/**
	* Whether or not this HP gauge is empty.
	* Not applicable to non-HP gauges.
	* @returns {boolean} True if the HP gauge target is 0, false if not HP gauge or not 0.
	*/
	isHpGaugeEmpty() {
		if (this.gaugeType() !== Sprite_FlowingGauge.Types.HP) return false;
		if (this.target() !== 0) return false;
		return true;
	}
	/**
	* Logic to execute when this target is defeated.
	*/
	onDefeat() {
		this.clearBattler();
		this.resetValues();
	}
	/**
	* The hue to alter the image by when the middleground gauge is going up.
	* The gauge goes up when you're healing, so this defaults to green.
	* @returns {[number, number, number, number]} The color tone: [red, green, blue, grey].
	*/
	upTone() {
		return [
			0,
			255,
			0,
			128
		];
	}
	/**
	* The hue to alter the image by when the middleground gauge is going down.
	* @returns {[number, number, number, number]} The color tone: [red, green, blue, grey].
	*/
	downTone() {
		return [
			255,
			0,
			0,
			0
		];
	}
	/**
	* The color tone to turn the sprite greyscale.
	* @returns {[number, number, number, number]} The color tone: [red, green, blue, grey].
	*/
	greyTone() {
		return [
			0,
			0,
			0,
			255
		];
	}
	/**
	* Calculates the rate of which to increment/decrement the current gauge.
	* The gauge goes down when they are hurting, so this defaults to red.
	* @returns {number}
	*/
	changeRate() {
		const divisor = 10;
		const rate = Math.abs((this.target() - this.current()) / divisor);
		return rate;
	}
	/**
	* Update the flow meter to give the flowy aesthetic.
	*/
	updateFlow() {
		this.setGaugeActualFlowCurrent(this.gaugeActualFlowCurrent() + .3);
		if (this.gaugeActualFlowCurrent() > this.gaugeActualFlowLimit()) {
			this.setGaugeActualFlowCurrent(0);
		}
	}
	/**
	* Draws this gauge.
	*/
	drawGauge() {
		this.drawCurrentGauge();
		this.drawActualGauge();
	}
	/**
	* Draws the "current" gauge, the gauge drawn in the middleground that
	* represents the amount that the enemy looks like they have. This extra
	* bar is drawn mostly for effect, and will spend a lot of time in-flux.
	*/
	drawCurrentGauge() {
		const gaugeHeight = this.gaugeHeight();
		const factor = this.current() / this.max() * this.gaugeSliceFillInnerWidth();
		const frameX = this.gaugeActualFlowCurrent() + this.gaugeSliceFillMinX();
		this.gaugeCurrentSprite().setFrame(frameX, gaugeHeight, factor, gaugeHeight);
	}
	/**
	* Draws the "actual" gauge, the gauge drawn in the foremost-ground that
	* represents the amount that the enemy currently has.
	*/
	drawActualGauge() {
		const gaugeHeight = this.gaugeHeight();
		const factor = this.target() / this.max() * this.gaugeSliceFillInnerWidth();
		const frameX = this.gaugeActualFlowCurrent() + this.gaugeSliceFillMinX();
		this.gaugeActualSprite().setFrame(frameX, 0, factor, gaugeHeight);
	}
	/**
	* The width of the gauge.
	* @returns {number}
	*/
	gaugeWidth() {
		return Math.floor(this.gaugeBitmap().width / 3);
	}
	/**
	* The height of the gauge.
	* @returns {number}
	*/
	gaugeHeight() {
		return Math.floor(this.gaugeBitmap().height / 2);
	}
	/**
	* Measures the interior track on the background and the interior fill band on the foreground slice.
	* This keeps HP/MP bars inside the frame art when `scale.x` is cranked up.
	*/
	measureGaugeArtExtents() {
		this.setGaugeSliceFillMinX(0);
		this.setGaugeSliceFillInnerWidth(1);
		this.setGaugeBackgroundTrackMinX(0);
		this.setGaugeBackgroundTrackInnerWidth(1);
		if (!this.gaugeBitmap()) return;
		const sliceW = this.gaugeWidth();
		const sliceH = this.gaugeHeight();
		if (sliceW === 0 || sliceH === 0) return;
		this.setGaugeSliceFillInnerWidth(sliceW);
		this.setGaugeBackgroundTrackInnerWidth(this.backgroundBitmap() ? this.backgroundBitmap().width : sliceW);
		if (!this.backgroundBitmap()) return;
		const bgTrack = this.measureLongestOpaqueDarkHorizontalRun(this.backgroundBitmap(), 0, 0, this.backgroundBitmap().width, this.backgroundBitmap().height, 80);
		const topTrack = this.measureBrightHorizontalExtent(this.gaugeBitmap(), 0, 0, sliceW, sliceH, 24);
		const bottomTrack = this.measureBrightHorizontalExtent(this.gaugeBitmap(), 0, sliceH, sliceW, sliceH, 24);
		const fillMinX = Math.min(topTrack.minX, bottomTrack.minX);
		const fillMaxX = Math.max(topTrack.maxX, bottomTrack.maxX);
		const fillInnerW = Math.max(1, fillMaxX - fillMinX + 1);
		const trackInnerW = Math.max(1, bgTrack.maxX - bgTrack.minX + 1);
		this.setGaugeSliceFillMinX(fillMinX);
		this.setGaugeSliceFillInnerWidth(fillInnerW);
		this.setGaugeBackgroundTrackMinX(bgTrack.minX);
		this.setGaugeBackgroundTrackInnerWidth(trackInnerW);
	}
	/**
	* Positions and scales the bar sprites so the measured fill maps onto the measured background track.
	*/
	alignGaugeForegroundToBackgroundTrack() {
		if (!this.gaugeCurrentSprite() || !this.gaugeActualSprite()) return;
		if (this.gaugeSliceFillInnerWidth() <= 0 || this.gaugeBackgroundTrackInnerWidth() <= 0) return;
		const bgX = J.HUD.EXT.TARGET.Metadata.BackgroundGaugeImageX;
		const fillLeftX = bgX + this.gaugeBackgroundTrackMinX();
		const troughRightExclusive = bgX + this.gaugeBackgroundTrackMinX() + this.gaugeBackgroundTrackInnerWidth();
		const effectiveBarWidth = Math.max(1, Math.min(this.gaugeBackgroundTrackInnerWidth(), troughRightExclusive - fillLeftX));
		const ratio = effectiveBarWidth / this.gaugeSliceFillInnerWidth();
		this.gaugeCurrentSprite().scale.x = ratio;
		this.gaugeActualSprite().scale.x = ratio;
		this.gaugeCurrentSprite().x = fillLeftX;
		this.gaugeActualSprite().x = fillLeftX;
	}
	/**
	* Finds the horizontal span of "bright enough" pixels inside a bitmap rectangle.
	* Used to ignore near-black border pixels that are still opaque.
	* @param {Bitmap} bitmap The bitmap to scan.
	* @param {number} rectX The left of the scan rectangle.
	* @param {number} rectY The top of the scan rectangle.
	* @param {number} rectW The width of the scan rectangle.
	* @param {number} rectH The height of the scan rectangle.
	* @param {number} minBrightSum Minimum r+g+b sum to count as interior content.
	* @returns {{minX:number,maxX:number}}
	*/
	measureBrightHorizontalExtent(bitmap, rectX, rectY, rectW, rectH, minBrightSum) {
		let minX = rectW;
		let maxX = -1;
		for (let y = 0; y < rectH; y++) {
			for (let x = 0; x < rectW; x++) {
				const px = rectX + x;
				const py = rectY + y;
				if (bitmap.getAlphaPixel(px, py) < 8) continue;
				const hex = bitmap.getPixel(px, py);
				const bright = this.sumRgbFromHexString(hex);
				if (bright <= minBrightSum) continue;
				minX = Math.min(minX, x);
				maxX = Math.max(maxX, x);
			}
		}
		if (maxX < 0) {
			return {
				minX: 0,
				maxX: rectW - 1
			};
		}
		return {
			minX,
			maxX
		};
	}
	/**
	* Finds the longest horizontal run of opaque "dark" pixels in a rectangle (row by row).
	* Used for capsule-style gauge frames where the playable trough is darker than the end caps.
	* @param {Bitmap} bitmap The bitmap to scan.
	* @param {number} rectX The left of the scan rectangle.
	* @param {number} rectY The top of the scan rectangle.
	* @param {number} rectW The width of the scan rectangle.
	* @param {number} rectH The height of the scan rectangle.
	* @param {number} maxDarkSum Inclusive ceiling on r+g+b for a pixel to count as trough (caps sit above this).
	* @returns {{minX:number,maxX:number}} Inclusive span of the best run in the same local x space as
	* {@link measureBrightHorizontalExtent}.
	*/
	measureLongestOpaqueDarkHorizontalRun(bitmap, rectX, rectY, rectW, rectH, maxDarkSum) {
		let bestMinX = 0;
		let bestMaxX = rectW - 1;
		let bestLen = 0;
		for (let y = 0; y < rectH; y++) {
			const py = rectY + y;
			let runStart = -1;
			for (let x = 0; x <= rectW; x++) {
				const atEnd = x === rectW;
				let isDark = false;
				if (atEnd === false) {
					const px = rectX + x;
					if (bitmap.getAlphaPixel(px, py) < 8) {
						isDark = false;
					} else {
						const sum = this.sumRgbFromHexString(bitmap.getPixel(px, py));
						isDark = sum <= maxDarkSum;
					}
				}
				if (isDark && runStart < 0) {
					runStart = x;
				}
				if ((isDark === false || atEnd) && runStart >= 0) {
					const runEnd = x - 1;
					const len = runEnd - runStart + 1;
					if (len > bestLen) {
						bestLen = len;
						bestMinX = runStart;
						bestMaxX = runEnd;
					}
					runStart = -1;
				}
			}
		}
		if (bestLen === 0) {
			return {
				minX: 0,
				maxX: rectW - 1
			};
		}
		return {
			minX: bestMinX,
			maxX: bestMaxX
		};
	}
	/**
	* Parses `#RRGGBB` from {@link Bitmap#getPixel} and sums the channels.
	* @param {string} hex The color string.
	* @returns {number}
	*/
	sumRgbFromHexString(hex) {
		if (!hex || hex.length < 7) return 0;
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return r + g + b;
	}
};

//#endregion
//#region src/plugins/hud/ext/target/managers/ImageManager.js
/**
* Generates a promise based on the resolution of the bitmap.<br/>
* If the promise resolves successfully, it'll contain the bitmap.<br/>
* If the promise rejects, then it is up to the handler how to deal with that.<br/>
* @param {string} filename The name of the file without the file extension.
* @returns {Promise}
*/
ImageManager.loadHudBitmap = function(filename) {
	return this.loadBitmapPromise(filename, "img/hud/");
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
	return new FramedTarget(battlerName, targetFrameText, targetFrameIcon, battlerLastHit.getBattler(), targetConfiguration, String.empty);
};
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
	* _icon: number, _battler: Game_Battler|null, _requestTargetRefresh: boolean,
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
	* Creates an target gauge sprite for this window and caches it.
	* @returns {Sprite_FlowingGauge} The gauge sprite of the target.
	*/
	getOrCreateTargetHpGaugeSprite() {
		const key = `targetframe-enemy-hp-gauge`;
		if (this.j()._spriteCache.has(key)) {
			return this.j()._spriteCache.get(key);
		}
		const sprite = new Sprite_FlowingGauge();
		this.j()._spriteCache.set(key, sprite);
		sprite.hide();
		sprite.scale.x = J.HUD.EXT.TARGET.Metadata.HpGaugeScaleX;
		sprite.scale.y = J.HUD.EXT.TARGET.Metadata.HpGaugeScaleY;
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates an target gauge sprite for this window and caches it.
	* @returns {Sprite_FlowingGauge} The gauge sprite of the target.
	*/
	getOrCreateTargetMpGaugeSprite() {
		const key = `targetframe-enemy-mp-gauge`;
		if (this.j()._spriteCache.has(key)) {
			return this.j()._spriteCache.get(key);
		}
		const sprite = new Sprite_FlowingGauge();
		this.j()._spriteCache.set(key, sprite);
		sprite.hide();
		sprite.scale.x = J.HUD.EXT.TARGET.Metadata.MpGaugeScaleX;
		sprite.scale.y = J.HUD.EXT.TARGET.Metadata.MpGaugeScaleY;
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates an target gauge sprite for this window and caches it.
	* @returns {Sprite_FlowingGauge} The gauge sprite of the target.
	*/
	getOrCreateTargetTpGaugeSprite() {
		const key = `targetframe-enemy-tp-gauge`;
		if (this.j()._spriteCache.has(key)) {
			return this.j()._spriteCache.get(key);
		}
		const sprite = new Sprite_FlowingGauge();
		this.j()._spriteCache.set(key, sprite);
		sprite.hide();
		sprite.rotation = J.HUD.EXT.TARGET.Metadata.TpGaugeRotation * (Math.PI / 180);
		sprite.scale.x = J.HUD.EXT.TARGET.Metadata.TpGaugeScaleX;
		sprite.scale.y = J.HUD.EXT.TARGET.Metadata.TpGaugeScaleY;
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
	* Pixel width reserved for the level column (Lv.xxx).
	* @returns {number}
	*/
	targetFrameLevelColumnWidth() {
		return 96;
	}
	/**
	* Max draw width for the name row so the level column does not overlap long tier names.
	* @returns {number}
	*/
	targetFrameNameLineInnerWidth() {
		const gap = 8;
		const w = this.contentsWidth() - this.targetFrameLevelColumnWidth() - gap;
		return Math.max(200, w);
	}
	/**
	* X offset for the level text (right-hand column after the name).
	* @param {number} baseX Content-relative base x.
	* @returns {number}
	*/
	targetFrameLevelDrawX(baseX) {
		return baseX + this.targetFrameNameLineInnerWidth() + 4;
	}
	/**
	* Max width for subtext lines that span the window body.
	* @returns {number}
	*/
	targetFrameBodyTextWidth() {
		return Math.max(200, this.contentsWidth() - 8);
	}
	drawContent(x, y) {
		this.drawTargetName(x, y);
		this.drawTargetLevel(this.targetFrameLevelDrawX(x), y);
		this.drawTargetExtra(x, y + 24);
		this.drawTargetIcon(x, y + 48);
		this.drawTargetBattlerInfo(x + 32, y);
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
	* Fades out the target frame window along with all sprites and content.
	*/
	fadeOutWindow() {
		this.opacity -= 10;
		this.backOpacity -= 10;
		this.contentsOpacity -= 10;
		this.j()._spriteCache.forEach((sprite, _) => sprite.opacity -= 10);
	}
	/**
	* Fades in the target frame window along with all sprites and content.
	*/
	fadeInWindow() {
		this.opacity += 40;
		this.backOpacity += 40;
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
			name = `\\*` + name;
		}
		const hex = this.j()._nameColorHex;
		const useHex = hex !== String.empty && hex.length > 0;
		const w = this.targetFrameNameLineInnerWidth();
		this.contents.fontFace = $gameSystem.mainFontFace();
		this.contents.fontSize = $gameSystem.mainFontSize();
		if (useHex) {
			this.changeTextColor(hex);
			this.changeOutlineColor(ColorManager.outlineColor());
		} else {
			this.resetFontSettings();
		}
		const textState = this.createTextState(name, x, y, w);
		this.processAllText(textState);
		this.resetTextColor();
	}
	/**
	* Draws the target's level in the window.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetLevel(x, y) {
		if (!this.canDrawTargetLevel()) return;
		const { level } = this.j()._battler;
		if (level) {
			const levelString = `\\FS[14]Lv.${level.padZero(3)}`;
			this.drawTextEx(levelString, x, y, this.targetFrameLevelColumnWidth());
		}
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
	* Draws the target's icon in the window.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetIcon(x, y) {
		if (!this.hasTargetIcon()) return;
		this.drawIcon(this.targetIcon(), x, y + 4);
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
	* Calculate the X coordinate for gauges.
	* @returns {number}
	*/
	targetBattlerGaugesX() {
		if (this.hasTargetIcon()) {
			return ImageManager.iconWidth;
		}
		return -8;
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
	* Draws the target's various gauges.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetBattlerGauges(x, y) {
		this.drawTargetHpGauge(x, y);
		this.drawTargetMpGauge(x, y + 22);
		this.drawTargetTpGauge(x - 10, y + 32);
	}
	/**
	* Draws the hp gauge of the target.
	*/
	drawTargetHpGauge(x, y) {
		const gauge = this.getOrCreateTargetHpGaugeSprite();
		if (!this.targetConfiguration().showHp) {
			gauge.hide();
			return;
		}
		gauge.setup(this.j()._battler, Sprite_FlowingGauge.Types.HP);
		gauge.move(x, y);
	}
	/**
	* Draws the mp gauge of the target.
	*/
	drawTargetMpGauge(x, y) {
		const gauge = this.getOrCreateTargetMpGaugeSprite();
		if (!this.targetConfiguration().showMp) {
			gauge.hide();
			return;
		}
		gauge.setup(this.j()._battler, Sprite_FlowingGauge.Types.MP);
		gauge.move(x, y);
	}
	/**
	* Draws the tp gauge of the target.
	*/
	drawTargetTpGauge(x, y) {
		const gauge = this.getOrCreateTargetTpGaugeSprite();
		if (!this.targetConfiguration().showTp) {
			gauge.hide();
			return;
		}
		gauge.setup(this.j()._battler, Sprite_FlowingGauge.Types.TP);
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
	* Builds the layout spec for target frame affliction rows.
	* @returns {StateAfflictionHudLayoutSpec}
	*/
	Window_TargetFrame.prototype.targetAfflictionLayoutSpec = function() {
		const layout = new StateAfflictionHudLayoutSpec();
		layout.originX = 32;
		if (this.hasTargetIcon()) {
			layout.originX += ImageManager.iconWidth;
		}
		layout.originY = this.targetBattlerGaugesY() + 44;
		layout.rowGap = 24;
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