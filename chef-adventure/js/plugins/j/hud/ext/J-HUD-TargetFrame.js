//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 HUD-TARGET] A HUD frame that displays your battle target.
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
 * @default 320
 *
 * @param targetFrameHeight
 * @parent targetFrameData
 * @type number
 * @min 0
 * @text Height
 * @desc The height in pixels of the target frame window.
 * @default 120
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
 * @desc The x coordinate correction of the "current" gauge image, aka the middleground.
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
 * @desc The x coordinate correction of the "current" gauge image, aka the foreground.
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
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.2';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-HUD plugin.
  const requiredHudVersion = '2.0.0';
  const hasHudRequirement = J.BASE.Helpers.satisfies(J.HUD.Metadata.Version, requiredHudVersion);
  if (!hasHudRequirement)
  {
    throw new Error(`Either missing J-HUD or has a lower version than the required: ${requiredHudVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.HUD.EXT.TARGET = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT.TARGET.Metadata = {};
J.HUD.EXT.TARGET.Metadata.Version = '1.0.0';
J.HUD.EXT.TARGET.Metadata.Name = `J-HUD-TargetFrame`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD.EXT.TARGET.PluginParameters = PluginManager.parameters(J.HUD.EXT.TARGET.Metadata.Name);

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.HUD.EXT.TARGET.Metadata = {
  // the previously defined metadata.
  ...J.HUD.EXT.TARGET.Metadata,

  // our configurable data points.
  TargetFrameX: Number(J.HUD.EXT.TARGET.PluginParameters['targetFrameX']),
  TargetFrameY: Number(J.HUD.EXT.TARGET.PluginParameters['targetFrameY']),
  TargetFrameWidth: Number(J.HUD.EXT.TARGET.PluginParameters['targetFrameWidth']),
  TargetFrameHeight: Number(J.HUD.EXT.TARGET.PluginParameters['targetFrameHeight']),
  BackgroundGaugeImageX: Number(J.HUD.EXT.TARGET.PluginParameters['backgroundGaugeImageX']),
  BackgroundGaugeImageY: Number(J.HUD.EXT.TARGET.PluginParameters['backgroundGaugeImageY']),
  MiddlegroundGaugeImageX: Number(J.HUD.EXT.TARGET.PluginParameters['middlegroundGaugeImageX']),
  MiddlegroundGaugeImageY: Number(J.HUD.EXT.TARGET.PluginParameters['middlegroundGaugeImageY']),
  ForegroundGaugeImageX: Number(J.HUD.EXT.TARGET.PluginParameters['foregroundGaugeImageX']),
  ForegroundGaugeImageY: Number(J.HUD.EXT.TARGET.PluginParameters['foregroundGaugeImageY']),
  BackgroundFilename: J.HUD.EXT.TARGET.PluginParameters['backgroundImageFilename'],
  ForegroundFilename: J.HUD.EXT.TARGET.PluginParameters['foregroundImageFilename'],
  EnableHP: J.HUD.EXT.TARGET.PluginParameters['enableHp'] === "true",
  EnableMP: J.HUD.EXT.TARGET.PluginParameters['enableMp'] === "true",
  EnableTP: J.HUD.EXT.TARGET.PluginParameters['enableTp'] === "true",
  HpGaugeScaleX: Number(J.HUD.EXT.TARGET.PluginParameters['hpGaugeScaleX']),
  HpGaugeScaleY: Number(J.HUD.EXT.TARGET.PluginParameters['hpGaugeScaleY']),
  HpGaugeRotation: Number(J.HUD.EXT.TARGET.PluginParameters['hpGaugeRotation']),
  MpGaugeScaleX: Number(J.HUD.EXT.TARGET.PluginParameters['mpGaugeScaleX']),
  MpGaugeScaleY: Number(J.HUD.EXT.TARGET.PluginParameters['mpGaugeScaleY']),
  MpGaugeRotation: Number(J.HUD.EXT.TARGET.PluginParameters['mpGaugeRotation']),
  TpGaugeScaleX: Number(J.HUD.EXT.TARGET.PluginParameters['tpGaugeScaleX']),
  TpGaugeScaleY: Number(J.HUD.EXT.TARGET.PluginParameters['tpGaugeScaleY']),
  TpGaugeRotation: Number(J.HUD.EXT.TARGET.PluginParameters['tpGaugeRotation']),
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT.TARGET.Aliased = {
  Game_System: new Map(),
  Hud_Manager: new Map(),
  JABS_Battler: new Map(),
  Scene_Map: new Map(),
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
  HideTargetTP: /<hideTargetTpBar>/i,
};
//endregion introduction

//region FramedTarget
/**
 * The shape of a target for the target frame.
 */
class FramedTarget
{
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
   * Constructor.
   * @param {string} name The name of the target.
   * @param {string=} text The additional text for the target; defaults to an empty string.
   * @param {number=} icon The icon to place on this target; defaults to 0.
   * @param {Game_Enemy=} battler The battler data of the target; defaults to null.
   * @param {FramedTargetConfiguration=} configuration The configuration of this target; defaults to null.
   */
  constructor(name, text = String.empty, icon = 0, battler = null, configuration = null)
  {
    this.name = name;
    this.text = text;
    this.icon = icon;
    this.battler = battler;
    this.configuration = configuration;
  }
}

//endregion FramedTarget

//region FramedTargetConfiguration
/**
 * A configuration object for whether to show/hide various target data points.
 */
class FramedTargetConfiguration
{
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
  constructor(
    showName = true,
    showText = true,
    showHp = J.HUD.EXT.TARGET.Metadata.EnableHP,
    showMp = J.HUD.EXT.TARGET.Metadata.EnableMP,
    showTp = J.HUD.EXT.TARGET.Metadata.EnableTP)
  {
    this.showName = showName;
    this.showText = showText;
    this.showHp = showHp;
    this.showMp = showMp;
    this.showTp = showTp;
  }
}

//endregion FramedTargetConfiguration

//region JABS_Battler
/**
 * Sets the last battler struck by this battler.
 * @param {JABS_Battler} battlerLastHit The battler that is being set as last struck.
 */
J.HUD.EXT.TARGET.Aliased.JABS_Battler.set('setBattlerLastHit', JABS_Battler.prototype.setBattlerLastHit);
JABS_Battler.prototype.setBattlerLastHit = function(battlerLastHit)
{
  // check if we can update the target frame based on the provided data.
  if (this.canUpdateTargetFrame(battlerLastHit))
  {
    // create the target frame data.
    const framedTarget = this.buildFramedTarget(battlerLastHit);

    // set the new target to be picked up by the hud manager.
    $hudManager.setNewTarget(framedTarget);
  }

  // perform original logic.
  J.HUD.EXT.TARGET.Aliased.JABS_Battler.get('setBattlerLastHit')
    .call(this, battlerLastHit);
};

/**
 * Determines whether or not the target frame should be updated.
 * @param {JABS_Battler} potentialTarget The battler that is being set as last struck.
 * @returns {boolean} True if we should update the target frame, false otherwise.
 */
JABS_Battler.prototype.canUpdateTargetFrame = function(potentialTarget)
{
  // if this battler is not the player, then do not update the target frame.
  if (!this.isPlayer()) return false;

  // if the potential target is invalid, do not update the target frame.
  if (!potentialTarget) return false;

  // if this target does not permit showing the target frame, then do not.
  if (!potentialTarget.canShowTargetFrame()) return false;

  // at this point, if we're considering it seriously, refresh the window.
  $hudManager.requestTargetFrameRefresh();

  // always update the target frame if we didn't have a last-hit before.
  if (!this.getTarget())
  {
    return true;
  }

  // don't re-update the last hit if they haven't changed.
  if (this.getTarget()
    .getUuid() === potentialTarget.getUuid())
  {
    return false;
  }

  // time to update target frame!
  return true;
};

/**
 * Checks the last hit battler to build the target frame.
 * @param {JABS_Battler} battlerLastHit The battler that is being set as last struck.
 * @returns {FramedTarget}
 */
JABS_Battler.prototype.buildFramedTarget = function(battlerLastHit)
{
  // determine the name of the battler.
  const battlerName = battlerLastHit.battlerName();

  // extract the target frame text.
  const targetFrameText = battlerLastHit.getTargetFrameText();

  // extract the target frame icon.
  const targetFrameIcon = battlerLastHit.getTargetFrameIcon();

  // extract the target configuration.
  const targetConfiguration = battlerLastHit.buildFramedTargetConfiguration();

  // create the new framed target for this battler.
  return new FramedTarget(
    battlerName,
    targetFrameText,
    targetFrameIcon,
    battlerLastHit.getBattler(),
    targetConfiguration);
};

/**
 * Determines whether or not the target frame will show for the given target.
 * @returns {boolean} True if we should show the target frame, false otherwise.
 */
JABS_Battler.prototype.canShowTargetFrame = function()
{
  // if this isn't an enemy, then they don't show the target frame.
  if (!this.isEnemy()) return false;

  // if there isn't an event or character remaining, don't bother.
  if (!this.getCharacter() || this.getCharacter()
    .isErased())
  {
    return false;
  }

  // check the event to see if we can show the target frame.
  const hiddenByEvent = !this.getCharacter()
    .canShowTargetFrame();

  // if the event prevents showing the target frame, then don't show it.
  if (hiddenByEvent) return false;

  // check the enemy to see if the enemy in the database prevents showing.
  const hiddenByDatabase = !this.getBattler()
    .showTargetFrame();

  // if one or the other are indicating not to show, then don't.
  if (hiddenByDatabase) return false;

  // show the target frame!
  return true;
};

/**
 * Builds the configuration for the target frame based on this battler.
 * @returns {FramedTargetConfiguration}
 */
JABS_Battler.prototype.buildFramedTargetConfiguration = function()
{
  // showing the target's name reuses existing logic to check.
  const showName = this.showBattlerName();

  // check to see if we should show the target text.
  const showText = this.canShowTargetText();

  // check to see if we should show HP.
  const showHpGauge = this.canShowTargetHp();

  // check to see if we should show MP.
  const showMpGauge = this.canShowTargetMp();

  // check to see if we should show TP.
  const showTpGauge = this.canShowTargetTp();

  // return the built configuration.
  return new FramedTargetConfiguration(showName, showText, showHpGauge, showMpGauge, showTpGauge);
};

/**
 * Gets whether or not this battler can show their HP in the target frame window.
 * @returns {boolean} True if it can show, false otherwise.
 */
JABS_Battler.prototype.canShowTargetHp = function()
{
  // if the defaults hide the HP, then don't show it.
  if (!J.HUD.EXT.TARGET.Metadata.EnableHP) return false;

  // we do not show hp bars for non-enemies.
  if (!this.isEnemy()) return false;

  // if the event says don't show it, then don't show it.
  if (!this.getCharacter()
    .showTargetHpBar())
  {
    return false;
  }

  // if the enemy in the database says don't show it, then don't show it.
  if (!this.getBattler()
    .showTargetHpBar())
  {
    return false;
  }

  // show what the defaults are.
  return true;
};

/**
 * Gets whether or not this battler can show their MP in the target frame window.
 * @returns {boolean} True if it can show, false otherwise.
 */
JABS_Battler.prototype.canShowTargetMp = function()
{
  // if the defaults hide the MP, then don't show it.
  if (!J.HUD.EXT.TARGET.Metadata.EnableMP) return false;

  // we do not show hp bars for non-enemies.
  if (!this.isEnemy()) return false;

  // if the event says don't show it, then don't show it.
  if (!this.getCharacter()
    .showTargetMpBar())
  {
    return false;
  }

  // if the enemy in the database says don't show it, then don't show it.
  if (!this.getBattler()
    .showTargetMpBar())
  {
    return false;
  }

  // TODO: should we hide the bar if the max value is 0?
  if (this.getBattler()
    .param(1) === 0)
  {
    return false;
  }

  // show what the defaults are.
  return true;
};

/**
 * Gets whether or not this battler can show their TP in the target frame window.
 * @returns {boolean} True if it can show, false otherwise.
 */
JABS_Battler.prototype.canShowTargetTp = function()
{
  // if the defaults hide the TP, then don't show it.
  if (!J.HUD.EXT.TARGET.Metadata.EnableTP) return false;

  // we do not show hp bars for non-enemies.
  if (!this.isEnemy()) return false;

  // if the event says don't show it, then don't show it.
  if (!this.getCharacter()
    .showTargetTpBar())
  {
    return false;
  }

  // if the enemy in the database says don't show it, then don't show it.
  if (!this.getBattler()
    .showTargetTpBar())
  {
    return false;
  }

  // TODO: should we hide the bar if the max value is 0?
  if (this.getBattler()
    .maxTp() === 0 || this.isInanimate())
  {
    return false;
  }

  // show what the defaults are.
  return true;
};

/**
 * Gets whether or not this battler can show extra text in the target frame window.
 * @returns {boolean} True if it can show, false otherwise.
 */
JABS_Battler.prototype.canShowTargetText = function()
{
  // we do not show hp bars for non-enemies.
  if (!this.isEnemy()) return false;

  // if the event says don't show it, then don't show it.
  if (!this.getCharacter()
    .showTargetText())
  {
    return false;
  }

  // if the enemy in the database says don't show it, then don't show it.
  if (!this.getBattler()
    .showTargetText())
  {
    return false;
  }

  // show it.
  return true;
};

/**
 * Gets the target frame text for this enemy.
 * @returns {string}
 */
JABS_Battler.prototype.getTargetFrameText = function()
{
  // if this isn't an enemy, then they don't get target frame extra text.
  if (!this.isEnemy()) return String.empty;

  // extract the text from the event.
  let targetFrameText = this.getCharacter()
    .getTargetFrameText();

  // if there wasn't any on the event, check the enemy.
  if (!targetFrameText)
  {
    // extract the icon index from the enemy.
    targetFrameText = this.getBattler()
      .targetFrameText();
  }

  // and return it.
  return targetFrameText;
};

/**
 * Gets the target frame icon from the underlying character.
 * @returns {number}
 */
JABS_Battler.prototype.getTargetFrameIcon = function()
{
  // if this isn't an enemy, then they don't get target frame icons.
  if (!this.isEnemy()) return 0;

  // extract the icon index from the event.
  let targetFrameIcon = this.getCharacter()
    .getTargetFrameIcon();

  // if there wasn't one on the event, check the enemy.
  if (!targetFrameIcon)
  {
    // extract the icon index from the enemy.
    targetFrameIcon = this.getBattler()
      .targetFrameIcon();
  }

  // and return it.
  return targetFrameIcon;
};
//endregion JABS_Battler

//region ImageManager
/**
 * Generates a promise based on the resolution of the bitmap.<br/>
 * If the promise resolves successfully, it'll contain the bitmap.<br/>
 * If the promise rejects, then it is up to the handler how to deal with that.<br/>
 * @param {string} filename The name of the file without the file extension.
 * @returns {Promise}
 */
ImageManager.loadHudBitmap = function(filename)
{
  // return the created promise.
  return this.loadBitmapPromise(filename, 'img/hud/');
};
//endregion ImageManager

//region Game_Enemy
/**
 * Gets the extra text from this enemy for the target frame.
 * @returns {string}
 */
Game_Enemy.prototype.targetFrameText = function()
{
  // return the extracted the target frame extra text from this enemy.
  return RPGManager.getStringFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.TargetFrameText);
};

/**
 * Gets the icon index of the target frame icon.
 * If none are present or valid, then the default will be 0 (no icon).
 * @returns {number}
 */
Game_Enemy.prototype.targetFrameIcon = function()
{
  // extract the target icon from this enemy.
  return RPGManager.getNumberFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.TargetFrameText);
};

/**
 * Gets whether or not the battler can show the target frame.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetFrame = function()
{
  // extract whether or not the target frame for this enemy is hidden.
  return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetFrame);
};

/**
 * Gets whether or not the battler can show its mp bar.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetHpBar = function()
{
  // extract whether or not to show the target HP for this enemy.
  return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetHP);
};

/**
 * Gets whether or not the battler can show its mp bar.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetMpBar = function()
{
  // extract whether or not to show the target MP for this enemy.
  return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetMP);
};

/**
 * Gets whether or not the battler can show its tp bar.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetTpBar = function()
{
  // extract whether or not to show the target TP for this enemy.
  return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetTP);
};

/**
 * Gets whether or not the battler can show its target text.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetText = function()
{
  // extract whether or not to show the target text from this enemy.
  return !RPGManager.checkForBooleanFromNoteByRegex(this.enemy(), J.HUD.EXT.TARGET.RegExp.HideTargetText);
};
//endregion Game_Enemy

//region Game_Event
/**
 * Gets the icon index of the target frame icon.
 * If none are present or valid, then the default will be 0 (no icon).
 * @returns {string|String.empty}
 */
Game_Event.prototype.getTargetFrameText = function()
{
  // start with the default empty string.
  let targetFrameText = String.empty;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no text.
  if (!commentCommands.length) return targetFrameText;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.TargetFrameText;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const comment = command.parameters[0];

    // check if any comment matches the structure.
    if (structure.test(comment))
    {
      // parse the found tag.
      targetFrameText = RegExp.$1;
    }
  });

  // return the found text.
  return targetFrameText;
};

/**
 * Gets the icon index of the target frame icon.
 * If none are present or valid, then the default will be 0 (no icon).
 * @returns {number}
 */
Game_Event.prototype.getTargetFrameIcon = function()
{
  // start with the default icon index of 0.
  let targetFrameIcon = 0;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return targetFrameIcon;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.TargetFrameIcon;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const comment = command.parameters[0];

    // check if any comment matches the structure.
    if (structure.test(comment))
    {
      // parse the found tag.
      targetFrameIcon = parseInt(RegExp.$1);
    }
  });

  // return the found icon.
  return targetFrameIcon;
};

/**
 * Gets whether or not this event is explicitly hiding the target frame.
 * The default is to show the frame.
 * @returns {boolean} True if we should show the target frame, false otherwise.
 */
Game_Event.prototype.canShowTargetFrame = function()
{
  // start with the default of true.
  let showTargetFrame = true;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showTargetFrame;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetFrame;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide the target frame.
      showTargetFrame = false;
    }
  });

  // return the truth.
  return showTargetFrame;
};

/**
 * Gets whether or not this event is explicitly hiding the hp bar.
 * The default is to show the bar.
 * @returns {boolean} True if we should show the bar, false otherwise.
 */
Game_Event.prototype.showTargetHpBar = function()
{
  // start with the default of true.
  let showHpBar = J.HUD.EXT.TARGET.Metadata.EnableHP;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showHpBar;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetHP;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide it.
      showHpBar = false;
    }
  });

  // return the truth.
  return showHpBar;
};

/**
 * Gets whether or not this event is explicitly hiding the mp bar.
 * The default is to show the bar.
 * @returns {boolean} True if we should show the bar, false otherwise.
 */
Game_Event.prototype.showTargetMpBar = function()
{
  // start with the default of true.
  let showMpBar = J.HUD.EXT.TARGET.Metadata.EnableMP;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showMpBar;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetMP;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide it.
      showMpBar = false;
    }
  });

  // return the truth.
  return showMpBar;
};

/**
 * Gets whether or not this event is explicitly hiding the tp bar.
 * The default is to show the bar.
 * @returns {boolean} True if we should show the bar, false otherwise.
 */
Game_Event.prototype.showTargetTpBar = function()
{
  // start with the default of true.
  let showTpBar = J.HUD.EXT.TARGET.Metadata.EnableTP;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showTpBar;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetTP;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide it.
      showTpBar = false;
    }
  });

  // return the truth.
  return showTpBar;
};

/**
 * Gets whether or not this event is explicitly hiding the target text.
 * The default is to show the text.
 * @returns {boolean} True if we should show the text, false otherwise.
 */
Game_Event.prototype.showTargetText = function()
{
  // start with the default of true.
  let showText = true;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showText;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetText;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide it.
      showText = false;
    }
  });

  // return the truth.
  return showText;
};
//endregion Game_Event

//region Scene_Map
/**
 * Extends {@link #initHudMembers}.<br>
 * Includes initialization of the target frame members.
 */
J.HUD.EXT.TARGET.Aliased.Scene_Map.set('initHudMembers', Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function()
{
  // perform original logic.
  J.HUD.EXT.TARGET.Aliased.Scene_Map.get('initHudMembers')
    .call(this);

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
 * Extends {@link #createAllWindows}.<br>
 * Includes creation of the target frame window.
 */
J.HUD.EXT.TARGET.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT.TARGET.Aliased.Scene_Map.get('createAllWindows')
    .call(this);

  // create the target frame.
  this.createTargetFrameWindow();
};

//region target frame
/**
 * Creates the target frame window and adds it to tracking.
 */
Scene_Map.prototype.createTargetFrameWindow = function()
{
  // create the window.
  const window = this.buildTargetFrameWindow();

  // update the tracker with the new window.
  this.setTargetFrameWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the target frame window.
 * @returns {Window_TargetFrame}
 */
Scene_Map.prototype.buildTargetFrameWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.targetFrameWindowRect();

  // create the window with the rectangle.
  const window = new Window_TargetFrame(rectangle);

  // return the built and configured window.
  return window;
}

/**
 * Creates the rectangle representing the window for the target frame.
 * @returns {Rectangle}
 */
Scene_Map.prototype.targetFrameWindowRect = function()
{
  // define the width of the window.
  const width = J.HUD.EXT.TARGET.Metadata.TargetFrameWidth;

  // define the height of the window.
  const height = J.HUD.EXT.TARGET.Metadata.TargetFrameHeight;

  // define the origin x of the window.
  const x = J.HUD.EXT.TARGET.Metadata.TargetFrameX;

  // define the origin y of the window.
  const y = J.HUD.EXT.TARGET.Metadata.TargetFrameY;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked target frame window.
 * @returns {Window_TargetFrame}
 */
Scene_Map.prototype.getTargetFrameWindow = function()
{
  return this._j._hud._target._targetFrame;
}

/**
 * Set the currently tracked target frame window to the given window.
 * @param {Window_TargetFrame} window The window to track.
 */
Scene_Map.prototype.setTargetFrameWindow = function(window)
{
  this._j._hud._target._targetFrame = window;
}
//endregion target frame

/**
 * Extends {@link #updateHudFrames}.<br>
 * Includes updating the target frame.
 */
J.HUD.EXT.TARGET.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.TARGET.Aliased.Scene_Map.get('updateHudFrames')
    .call(this);

  // manages target frame assignments.
  this.handleAssignTarget();
};

/**
 * Handles incoming requests to assign a target to the target frame.
 */
Scene_Map.prototype.handleAssignTarget = function()
{
  // if there is no request, then don't process.
  if (!$hudManager.hasRequestAssignTarget()) return;

  // grab the new target.
  const newTarget = $hudManager.getNewTarget();

  // set the target frame's target to this new target.
  this.getTargetFrameWindow()
    .setTarget(newTarget);

  // let the hud manager know we've done the deed.
  $hudManager.acknowledgeAssignedTarget();
};
//endregion Scene_Map

// TODO: move this to J-Base.
//region Sprite_FlowingGauge
/**
 * A gauge that acts like a regular `Sprite_Gauge` that is instead based
 * on images and also "flows".
 */
class Sprite_FlowingGauge
  extends Sprite
{
  //region properties
  static Types = {
    HP: "hp",
    MP: "mp",
    TP: "tp",
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

  //endregion properties

  /**
   * Initializes all properties of this class.
   */
  initialize(bitmap)
  {
    // perform original logic; we don't need the underlying sprite to have a bitmap.
    super.initialize(bitmap);

    // initialize the gauge sprites from file.
    this.initializeGauges();
  }

  /**
   * Initializes the gauges based on bitmaps loaded from file.
   */
  initializeGauges()
  {
    // reset all gauges to baseline/defaults.
    this.resetValues();

    // establish a promise for loading the gauge background into memory.
    const backgroundFilename = this.extractFileName(J.HUD.EXT.TARGET.Metadata.BackgroundFilename);
    const backgroundPromise = ImageManager.loadHudBitmap(backgroundFilename);

    // manage the completion and error handling of the bitmap loading.
    backgroundPromise
      .then(bitmap => this.setBackgroundBitmap(bitmap))
      .catch(() =>
      {
        throw new Error('background bitmap failed to load.');
      });

    // establish a promise for loading the gauge foreground into memory.
    const foregroundFilename = this.extractFileName(J.HUD.EXT.TARGET.Metadata.ForegroundFilename);
    const foregroundPromise = ImageManager.loadHudBitmap(foregroundFilename);

    // manage the completion and error handling of the bitmap loading.
    foregroundPromise
      .then(bitmap => this.setForegroundBitmap(bitmap))
      .catch(() =>
      {
        throw new Error('background bitmap failed to load.');
      });

    // when both back and foreground are done loading, let this gauge know we're ready.
    Promise
      .all([ backgroundPromise, foregroundPromise ])
      .then(() => this.onReady());
  }

  /**
   * Extracts the filename out of the extended path.
   * @param {string} longFileName The filename with the path in it.
   * @returns {string} Just the filename.
   */
  extractFileName(longFileName)
  {
    // get the character after the last slash.
    const lastSlash = longFileName.lastIndexOf('/') + 1;

    // return only the filename.
    return longFileName.substring(lastSlash);
  }

  /**
   * Sets the background bitmap to the given value.
   * @param {Bitmap} bitmap The bitmap to set to the background.
   */
  setBackgroundBitmap(bitmap)
  {
    // assign the bitmap for re-use.
    this._backgroundBitmap = bitmap;
  }

  /**
   * Sets the foreground bitmap to the given value.
   * @param {Bitmap} bitmap The bitmap to set to the foreground.
   */
  setForegroundBitmap(bitmap)
  {
    // assign the bitmap for re-use.
    this._gaugeBitmap = bitmap;
  }

  /**
   * Creates gauge's background sprite.
   */
  createGaugeBackground()
  {
    // establish the new sprite based on the given bitmap.
    this._gaugeBackground = new Sprite(this._backgroundBitmap);
    this._gaugeBackground.x = J.HUD.EXT.TARGET.Metadata.BackgroundGaugeImageX;
    this._gaugeBackground.y = J.HUD.EXT.TARGET.Metadata.BackgroundGaugeImageY;
    this.addChild(this._gaugeBackground);
  }

  /**
   * Creates gauge's foreground sprite.
   */
  createGaugeForeground()
  {
    // generate the middleground of the gauge.
    this._gaugeCurrentSprite = new Sprite(this._gaugeBitmap);
    this._gaugeCurrentSprite.x = J.HUD.EXT.TARGET.Metadata.MiddlegroundGaugeImageX;
    this._gaugeCurrentSprite.y = J.HUD.EXT.TARGET.Metadata.MiddlegroundGaugeImageY;
    this.addChild(this._gaugeCurrentSprite);

    // generate the foreground of the gauge
    this._gaugeActualSprite = new Sprite(this._gaugeBitmap);
    this._gaugeActualSprite.x = J.HUD.EXT.TARGET.Metadata.ForegroundGaugeImageX;
    this._gaugeActualSprite.y = J.HUD.EXT.TARGET.Metadata.ForegroundGaugeImageY;
    this.addChild(this._gaugeActualSprite);
  }

  /**
   * Resets all gauge values to 0.
   */
  resetValues()
  {
    this._gaugeCurrent = 0;
    this._gaugeTarget = 0;
    this._gaugeMax = 0;
  }

  /**
   * Clears the battler of this gauge.
   */
  clearBattler()
  {
    this._battler = null;
  }

  /**
   * The "current" value of the gauge.
   * This is spends a lot of time in flux due to gradual change for visual enjoyment.
   * If you need the real current value, use `.target()`.
   * @returns {number}
   */
  current()
  {
    return this._gaugeCurrent;
  }

  /**
   * The "target" value of the gauge.
   * This is what the "current" is striving to reach.
   * @returns {number}
   */
  target()
  {
    if (this._battler)
    {
      return this.#targetByType();
    }
    else
    {
      return 0;
    }
  }

  /**
   * Gets the target value for this gauge by its gauge type.
   * @returns {number}
   */
  #targetByType()
  {
    switch (this._gaugeType)
    {
      case Sprite_FlowingGauge.Types.HP:
        return this._battler.hp;
      case Sprite_FlowingGauge.Types.MP:
        return this._battler.mp;
      case Sprite_FlowingGauge.Types.TP:
        return this._battler.tp;
      default:
        return 0;
    }
  }

  /**
   * The "max" value of the gauge.
   * This is simply the maximum amount that the gauge represents when full.
   * @returns {number}
   */
  max()
  {
    if (this._battler)
    {
      return this.#maxByType();
    }
    else
    {
      return 0;
    }
  }

  /**
   * Gets the max value for this gauge by its gauge type.
   * @returns {number}
   */
  #maxByType()
  {
    switch (this._gaugeType)
    {
      case Sprite_FlowingGauge.Types.HP:
        return this._battler.mhp;
      case Sprite_FlowingGauge.Types.MP:
        return this._battler.mmp;
      case Sprite_FlowingGauge.Types.TP:
        return this._battler.maxTp();
      default:
        return 0;
    }
  }

  /**
   * Sets up this gauge with the given enemy battler.
   * @param {Game_Enemy} battler The enemy battler.
   * @param {Sprite_FlowingGauge.Types} gaugeType The type of gauge this is.
   */
  setup(battler, gaugeType = Sprite_FlowingGauge.Types.HP)
  {
    // assign the battler.
    this._battler = battler;

    // assign the gauge type and setup accordingly.
    this._gaugeType = gaugeType;
    this.setupGaugeByType();

    // show the gauge when it is setup for battle.
    this.show();
  }

  /**
   * Sets up the gauge based on the gauge type.
   */
  setupGaugeByType()
  {
    this._gaugeCurrentSprite.setColorTone(this.greyTone());

    switch (this._gaugeType)
    {
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
  setupGaugeAsHp()
  {
    this._gaugeCurrent = this._battler.hp;
    this._gaugeTarget = this._battler.hp;
    this._gaugeMax = this._battler.mhp;
    this._gaugeActualSprite.setHue(this.hpGaugeHue());
  }

  hpGaugeHue()
  {
    return 0;
  }

  /**
   * Sets up the gauge as an mp gauge.
   */
  setupGaugeAsMp()
  {
    this._gaugeCurrent = this._battler.mp;
    this._gaugeTarget = this._battler.mp;
    this._gaugeMax = this._battler.mmp;
    this._gaugeActualSprite.setHue(this.mpGaugeHue());
  }

  mpGaugeHue()
  {
    return -180;
  }

  /**
   * Sets up the gauge as a tp gauge.
   */
  setupGaugeAsTp()
  {
    this._gaugeCurrent = this._battler.tp;
    this._gaugeTarget = this._battler.tp;
    this._gaugeMax = this._battler.maxTp();
    this._gaugeActualSprite.setHue(this.tpGaugeHue());
  }

  tpGaugeHue()
  {
    return 80;
  }

  /**
   * Refresh this gauge by redrawing it.
   */
  refresh()
  {
    this.drawGauge();
  }

  /**
   * The update loop of this gauge.
   */
  update()
  {
    // perform original logic.
    super.update();

    if (!this.isReady()) return;

    // update the current value for this.
    this.updateCurrent();

    // update the visual flow.
    this.updateFlow();

    // redraw the gauge.
    this.drawGauge();
  }

  /**
   * Checks if this gauge is ready for drawing.
   * If it is not, then updating will not take place.
   * @returns {boolean} True if this gauge is ready, false otherwise.
   */
  isReady()
  {
    // if we are already ready, then just carry on.
    return this._isReady;
  }

  /**
   * Executes one-time actions once the gauge is ready.
   */
  onReady()
  {
    // create the background of the gauge.
    this.createGaugeBackground();

    // create the foreground of the gauge ("two" bars).
    this.createGaugeForeground();

    // update the flow now that we have all our gauges.
    this.updateFlowMax();

    // and now we are ready to draw gauges.
    this._isReady = true;
  }

  /**
   * Updates the current and max values of the flow effect.
   */
  updateFlowMax()
  {
    // update the limit based on the sprite width.
    this._gaugeActualFlowLimit = this.gaugeWidth();
    this._gaugeActualFlowCurrent = Math.floor(Math.random() * this._gaugeActualFlowLimit);
  }

  /**
   * Updates the current value of the fore-most gauge.
   * This is the background gauge that is a bit slower.
   */
  updateCurrent()
  {
    // if we have no battler, then don't update.
    if (!this.canUpdateCurrent()) return;

    // check if the target died.
    if (this.isHpGaugeEmpty())
    {
      // run on-defeat logic.
      this.onDefeat();
      return;
    }

    // check if there is a different between the current and target values.
    if (this.current() !== this.target())
    {
      // if something has changed, then update the current value.
      this.handleCurrentValueUpdate();
    }
    // if no difference, then it isn't changing.
    else
    {
      // handle what happens when the value isn't changing.
      this.handleCurrentValueUnchanged();
    }
  }

  /**
   * Handles the update to the "current" value while it is changing either up or down.
   */
  handleCurrentValueUpdate()
  {
    // calculate a rate of change for the gauge.
    const changeRate = this.changeRate();

    // check if the target amount is less than the current.
    if (this.target() < this.current())
    {
      this.processCurrentValueIncrease(changeRate);
    }
    // check if the target amount is greater than the current.
    else if (this.target() > this.current())
    {
      this.processCurrentValueDecrease(changeRate);
    }
  }

  /**
   * Processes the decrease of the current value and changes the tone.
   */
  processCurrentValueIncrease(changeRate)
  {
    // if so, reduce the current by the change rate until we hit the target.
    this._gaugeCurrent -= changeRate;

    // check to make sure we didn't pass the target with the incremental change rate.
    if (this.current() < this.target())
    {
      // if we did, just re-assign that.
      this._gaugeCurrent = this._gaugeTarget;
    }

    // if the gauge is going down, set the tone to be red.
    this._gaugeCurrentSprite.setColorTone(this.downTone());
  }

  /**
   * Processes the increase of the current value and changes the tone.
   */
  processCurrentValueDecrease(changeRate)
  {
    // if so, increase the current by the change rate until we hit the target.
    this._gaugeCurrent += changeRate;

    // check to make sure we didn't pass the target with the incremental change rate.
    if (this.current() > this.target())
    {
      // if we did, just re-assign that.
      this._gaugeCurrent = this._gaugeTarget;
    }

    // if the gauge is going up, set the tone to be green.
    this._gaugeCurrentSprite.setColorTone(this.upTone());
  }

  /**
   * Handles the update to the "current" value while it is unchanging.
   */
  handleCurrentValueUnchanged()
  {
    // if the gauge isn't going anywhere, then set it to grey.
    this._gaugeCurrentSprite.setColorTone(this.greyTone());
  }

  /**
   * Whether or not we can update the
   * @returns {boolean}
   */
  canUpdateCurrent()
  {
    if (!this._battler) return false;

    return true;
  }

  /**
   * Whether or not this HP gauge is empty.
   * Not applicable to non-HP gauges.
   * @returns {boolean} True if the HP gauge target is 0, false if not HP gauge or not 0.
   */
  isHpGaugeEmpty()
  {
    if (!this._gaugeType === Sprite_FlowingGauge.Types.HP) return false;

    if (this.target() !== 0) return false;

    return true;
  }

  /**
   * Logic to execute when this target is defeated.
   */
  onDefeat()
  {
    // remove the battler from tracking.
    this.clearBattler();

    // reset the gauge values.
    this.resetValues();
  }

  /**
   * The hue to alter the image by when the middleground gauge is going up.
   * The gauge goes up when you're healing, so this defaults to green.
   * @returns {[number, number, number, number]} The color tone: [red, green, blue, grey].
   */
  upTone()
  {
    // [red, green, blue, grey].
    return [ 0, 255, 0, 128 ];
  }

  /**
   * The hue to alter the image by when the middleground gauge is going down.
   * @returns {[number, number, number, number]} The color tone: [red, green, blue, grey].
   */
  downTone()
  {
    // [red, green, blue, grey].
    return [ 255, 0, 0, 0 ];
  }

  /**
   * The color tone to turn the sprite greyscale.
   * @returns {[number, number, number, number]} The color tone: [red, green, blue, grey].
   */
  greyTone()
  {
    // [red, green, blue, grey].
    return [ 0, 0, 0, 255 ];
  }

  /**
   * Calculates the rate of which to increment/decrement the current gauge.
   * The gauge goes down when they are hurting, so this defaults to red.
   * @returns {number}
   */
  changeRate()
  {
    const divisor = 10;
    const rate = Math.abs((this.target() - this.current()) / divisor);
    return rate;
  }

  /**
   * Update the flow meter to give the flowy aesthetic.
   */
  updateFlow()
  {
    // update the x coordinate of where to set the frame to emulate "flowing" gauges.
    this._gaugeActualFlowCurrent += 0.3;

    // if the current flow exceeds the limit, reset it.
    if (this._gaugeActualFlowCurrent > this._gaugeActualFlowLimit)
    {
      // reset the current flow to 0.
      this._gaugeActualFlowCurrent = 0;
    }
  }

  /**
   * Draws this gauge.
   */
  drawGauge()
  {
    // draw the in-flux "current" gauge.
    this.drawCurrentGauge();

    // draw the accurate "actual" gauge.
    this.drawActualGauge();
  }

  /**
   * Draws the "current" gauge, the gauge drawn in the middleground that
   * represents the amount that the enemy looks like they have. This extra
   * bar is drawn mostly for effect, and will spend a lot of time in-flux.
   */
  drawCurrentGauge()
  {
    // get the width of the gauge.
    const gaugeWidth = this.gaugeWidth();

    // get the height of the gauge.
    const gaugeHeight = this.gaugeHeight();

    // determine the actual width to draw.
    const factor = (this.current() / this.max()) * gaugeWidth;

    // set the flowed-frame of the gauge.
    this._gaugeCurrentSprite.setFrame(this._gaugeActualFlowCurrent, gaugeHeight, factor, gaugeHeight);
  }

  /**
   * Draws the "actual" gauge, the gauge drawn in the foremost-ground that
   * represents the amount that the enemy currently has.
   */
  drawActualGauge()
  {
    // get the width of the gauge.
    const gaugeWidth = this.gaugeWidth();

    // get the height of the gauge.
    const gaugeHeight = this.gaugeHeight();

    // determine the actual width to draw.
    const factor = (this.target() / this.max()) * gaugeWidth;

    // set the flowed-frame of the gauge.
    this._gaugeActualSprite.setFrame(this._gaugeActualFlowCurrent, 0, factor, gaugeHeight);
  }

  /**
   * The width of the gauge.
   * @returns {number}
   */
  gaugeWidth()
  {
    return Math.floor(this._gaugeBitmap.width / 3);
  }

  /**
   * The height of the gauge.
   * @returns {number}
   */
  gaugeHeight()
  {
    return Math.floor(this._gaugeBitmap.height / 2);
  }
}

//endregion Sprite_FlowingGauge

//region Window_TargetFrame
/**
 * A window that displays a target and their relevant information.
 */
class Window_TargetFrame
  extends Window_Base
{
  /**
   * The maximum possible duration in frames.
   * @type {number}
   */
  static MaxDuration = 180;

  /**
   * Constructor.
   * @param {Rectangle} rect The shape of this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Initializes the properties of this class.
   * @param {Rectangle} rect The rectangle representing this window.
   */
  initialize(rect)
  {
    // perform original logic.
    super.initialize(rect);

    // add our extra data points to track.
    this.initMembers();

    // run any one-time configuration changes.
    this.configure();
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
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
   * Executes any one-time configuration required for this window.
   */
  configure()
  {
    // make the window's background opacity transparent.
    this.opacity = 0;

    // build the image cache for the first time.
    this.refreshCache();
  }

  //region caching
  /**
   * Empties and recreates the entire cache of sprites.
   */
  refreshCache()
  {
    // destroy and empty all sprites within the cache.
    this.emptyCache();

    // recreate all sprites for the cache.
    this.createCache();
  }

  /**
   * Empties the cache of all sprites.
   */
  emptyCache()
  {
    // iterate over each sprite and destroy it properly.
    this._j._spriteCache.forEach((value, _) => value.destroy());

    // empty the collection of all references.
    this._j._spriteCache.clear();
  }

  /**
   * Ensures all sprites are created and available for use.
   */
  createCache()
  {
    // cache the target hp gauge.
    this.getOrCreateTargetHpGaugeSprite();

    // cache the target mp gauge.
    this.getOrCreateTargetMpGaugeSprite();

    // cache the target tp gauge.
    this.getOrCreateTargetTpGaugeSprite();
  }

  /**
   * Creates an target gauge sprite for this window and caches it.
   * @returns {Sprite_FlowingGauge} The gauge sprite of the target.
   */
  getOrCreateTargetHpGaugeSprite()
  {
    // the key for this actor's full face sprite.
    const key = `targetframe-enemy-hp-gauge`;

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new enemy gauge sprite.
    const sprite = new Sprite_FlowingGauge();

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();
    sprite.scale.x = J.HUD.EXT.TARGET.Metadata.HpGaugeScaleX;
    sprite.scale.y = J.HUD.EXT.TARGET.Metadata.HpGaugeScaleY;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates an target gauge sprite for this window and caches it.
   * @returns {Sprite_FlowingGauge} The gauge sprite of the target.
   */
  getOrCreateTargetMpGaugeSprite()
  {
    // the key for this actor's full face sprite.
    const key = `targetframe-enemy-mp-gauge`;

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new enemy gauge sprite.
    const sprite = new Sprite_FlowingGauge();

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();
    sprite.scale.x = J.HUD.EXT.TARGET.Metadata.MpGaugeScaleX;
    sprite.scale.y = J.HUD.EXT.TARGET.Metadata.MpGaugeScaleY;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates an target gauge sprite for this window and caches it.
   * @returns {Sprite_FlowingGauge} The gauge sprite of the target.
   */
  getOrCreateTargetTpGaugeSprite()
  {
    // the key for this actor's full face sprite.
    const key = `targetframe-enemy-tp-gauge`;

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new enemy gauge sprite.
    const sprite = new Sprite_FlowingGauge();

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();
    sprite.rotation = J.HUD.EXT.TARGET.Metadata.TpGaugeRotation * (Math.PI / 180);
    sprite.scale.x = J.HUD.EXT.TARGET.Metadata.TpGaugeScaleX;
    sprite.scale.y = J.HUD.EXT.TARGET.Metadata.TpGaugeScaleY;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  //endregion caching

  /**
   * Sets the target that this window should be tracking.
   * @param {FramedTarget} target The name of the target.
   */
  setTarget(target)
  {
    // assign the newly provided data.
    this._j._name = target.name;
    this._j._text = target.text;
    this._j._icon = target.icon;
    this._j._battler = target.battler;
    this._j._configuration = target.configuration;

    // refresh the contents of the window to reflect the changes.
    this.refresh();
  }

  /**
   * Sets whether or not this window needs to refresh its target.
   */
  requestTargetRefresh()
  {
    this._j._requestTargetRefresh = true;
  }

  /**
   * Gets whether or not this window needs to refresh its target.
   * @returns {boolean}
   */
  hasRequestTargetRefresh()
  {
    return this._j._requestTargetRefresh;
  }

  /**
   * Acknowledges the request to refresh the target of this window.
   */
  acknowledgeTargetRefresh()
  {
    this._j._requestTargetRefresh = false;
  }

  /**
   * Gets the name of the current target of this window.
   * @returns {string}
   */
  targetName()
  {
    return this._j._name;
  }

  /**
   * Gets the extra line of information for the current target of this window.
   * @returns {string|String.empty}
   */
  targetText()
  {
    return this._j._text;
  }

  /**
   * Gets the icon of the current target of this window.
   * @returns {number}
   */
  targetIcon()
  {
    return this._j._icon;
  }

  /**
   * Gets the configuration of the current target.
   * @returns {FramedTargetConfiguration|null}
   */
  targetConfiguration()
  {
    return this._j._configuration;
  }

  /**
   * Refreshes the contents of this window.
   */
  refresh()
  {
    // clear out the window contents.
    this.contents.clear();

    // reset the timer for fading.
    this.resetInactivityTimer();

    // request a refresh of the target of this window.
    this.requestTargetRefresh();

    // rebuilds the contents of the window.
    this.updateTarget();
  }

  /**
   * Resets the inactivity timer back to max.
   */
  resetInactivityTimer()
  {
    this._j._inactivityTimer = Window_TargetFrame.MaxDuration;
  }

  /**
   * Hooks into the update cycle for updating this window.
   */
  update()
  {
    // perform original logic.
    super.update();

    // update the window logic.
    this.updateTarget();
  }

  /**
   * Updates the target of this window as-necessary.
   */
  updateTarget()
  {
    // check if we have a request to refresh this target frame inactivity timer.
    if ($hudManager.hasRequestTargetFrameRefreshInactivityTimer())
    {
      // reset it if we do.
      this.resetInactivityTimer();

      // acknowledge the request.
      $hudManager.acknowledgeTargetFrameInactivityTimerRefresh();
    }

    // manage inactivity timers and visibility.
    this.handleInactivity();

    // check if the target this window is tracking needs updating.
    if (this.needsTargetUpdate())
    {
      // determine base coordinates.
      const x = 0;
      const y = 0;

      // draw the target data.
      this.drawContent(x, y);

      // acknowledge the request to refresh the target.
      this.acknowledgeTargetRefresh();
    }
  }

  drawContent(x, y)
  {
    // draw the name of the target.
    this.drawTargetName(x, y);

    // draw the level of the target.
    this.drawTargetLevel(x + 220, y);

    // draw the extra data for the target.
    this.drawTargetExtra(x, y + 24);

    // draw the relation of the target.
    this.drawTargetIcon(x, y + 48);

    // draw the battler data of the target- if available.
    this.drawTargetBattlerInfo(x + 32, y);
  }

  /**
   * Handles inactivity of this window.
   * Counts down the inactivity timer and manages visibility as-necessary.
   */
  handleInactivity()
  {
    // countdown the timer.
    this._j._inactivityTimer--;

    // check if we have <1 second left before this goes inactive.
    if (this._j._inactivityTimer < 60)
    {
      this.fadeOutWindow();
    }
    else
    {
      this.fadeInWindow();
    }
  }

  /**
   * Fades out the target frame window along with all sprites and content.
   */
  fadeOutWindow()
  {
    this.opacity -= 10;
    this.backOpacity -= 10;
    this.contentsOpacity -= 10;
    this._j._spriteCache.forEach((sprite, _) => sprite.opacity -= 10);
  }

  /**
   * Fades in the target frame window along with all sprites and content.
   */
  fadeInWindow()
  {
    this.opacity += 40;
    this.backOpacity += 40;
    this.contentsOpacity += 40;
    this._j._spriteCache.forEach((sprite, _) => sprite.opacity += 40);
  }

  /**
   * Determines whether or not the target data should be updated.
   * @returns {boolean} True if it needs an update, false otherwise.
   */
  needsTargetUpdate()
  {
    if (!this.hasRequestTargetRefresh()) return false;

    return true;
  }

  /**
   * Draws the target's name in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetName(x, y)
  {
    let name = `\\FS[24]${this.targetName()}`;
    if (J.MESSAGE)
    {
      name = `\\*` + name;
    }

    this.drawTextEx(name, x, y, 200);
  }

  /**
   * Draws the target's level in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetLevel(x, y)
  {
    // don't draw level if we can't.
    if (!this.canDrawTargetLevel()) return;

    // get the level from the battler.
    const { level } = this._j._battler;

    // check to see if the enemy is leveled.
    if (level)
    {
      // build the level string.
      const levelString = `\\FS[14]Lv.${level.padZero(3)}`;

      // and draw it to the window.
      this.drawTextEx(levelString, x, y, 200);
    }
  }

  /**
   * Determines whether or not we can draw the level of the target.
   * @returns {boolean} True if we can draw levels, false otherwise.
   */
  canDrawTargetLevel()
  {
    // if we don't have our level system, then don't draw levels.
    if (!J.LEVEL) return false;

    // if we don't have a battler as the target, then don't draw levels.
    if (!this._j._battler) return false;

    // draw levels!
    return true;
  }

  /**
   * Draws the target's extra information in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetExtra(x, y)
  {
    // if there is no text to draw, don't try to draw it.
    if (!this.hasTargetText()) return;

    // draw the extra text.
    this.drawTextEx(`\\FS[14]${this.targetText()}`, x, y, 200);
  }

  /**
   * Determine whether or not we have extra text to draw for the current target.
   * @returns {boolean}
   */
  hasTargetText()
  {
    // if we have an empty string for the text, then lets not draw it.
    if (!this.targetText()) return false;

    // return the truth.
    return true;
  }

  /**
   * Draws the target's icon in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetIcon(x, y)
  {
    // check if we have an icon to draw.
    if (!this.hasTargetIcon()) return;

    // draw the target's icon.
    this.drawIcon(this.targetIcon(), x, y + 4);
  }

  /**
   * Determines whether or not we have an icon to draw for the current target.
   * @returns {boolean}
   */
  hasTargetIcon()
  {
    // if we have 0 icon index, then lets not draw one.
    if (!this.targetIcon()) return false;

    // return the truth.
    return true;
  }

  /**
   * Draws the target's battler data- if present- in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetBattlerInfo(x, y)
  {
    // validate that we have a battler to draw data for.
    if (this._j._battler)
    {
      // determine the corrected X coordinate.
      const currentX = x + this.targetBattlerGaugesX();

      // determine the corrected Y coordinate.
      const currentY = y + this.targetBattlerGaugesY();

      // draw the gauges at the desginated coordinates.
      this.drawTargetBattlerGauges(currentX, currentY);
    }
    // if we do not have a battler, then hide everything.
    else
    {
      // clear/hide the gauge data.
      this._j._spriteCache.forEach(value => value.hide());
    }
  }

  /**
   * Calculate the X coordinate for gauges.
   * @returns {number}
   */
  targetBattlerGaugesX()
  {
    // if there is an icon in the way, then move the gauges out.
    if (this.hasTargetIcon())
    {
      // move it respectively to the icon width.
      return ImageManager.iconWidth;
    }

    // otherwise, we have no modifiers.
    return -8;
  }

  /**
   * Calculate the Y coordinate for gauges.
   * @returns {number}
   */
  targetBattlerGaugesY()
  {
    // if this target had extra text, then move the gauges down
    if (this.hasTargetText())
    {
      // move it down a bit more than usual.
      return 64;
    }

    // don't move it down as much..
    return 44;
  }

  /**
   * Draws the target's various gauges.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetBattlerGauges(x, y)
  {
    // draw all three of the primary gauges.
    this.drawTargetHpGauge(x, y);
    this.drawTargetMpGauge(x, y + 22);
    this.drawTargetTpGauge(x - 10, y + 32);
  }

  /**
   * Draws the hp gauge of the target.
   */
  drawTargetHpGauge(x, y)
  {
    // grab the gauge to draw.
    const gauge = this.getOrCreateTargetHpGaugeSprite();

    // don't draw the gauge if its disabled.
    if (!this.targetConfiguration().showHp)
    {
      gauge.hide();
      return;
    }

    // setup the gauge with the battler.
    gauge.setup(this._j._battler, Sprite_FlowingGauge.Types.HP);

    // relocate the gauge sprite.
    gauge.move(x, y);
  }

  /**
   * Draws the mp gauge of the target.
   */
  drawTargetMpGauge(x, y)
  {
    // grab the gauge to draw.
    const gauge = this.getOrCreateTargetMpGaugeSprite();

    // don't draw the gauge if its disabled.
    if (!this.targetConfiguration().showMp)
    {
      gauge.hide();
      return;
    }

    // setup the gauge with the battler.
    gauge.setup(this._j._battler, Sprite_FlowingGauge.Types.MP);

    // relocate the gauge sprite.
    gauge.move(x, y);
  }

  /**
   * Draws the tp gauge of the target.
   */
  drawTargetTpGauge(x, y)
  {
    // grab the gauge to draw.
    const gauge = this.getOrCreateTargetTpGaugeSprite();

    // don't draw the gauge if its disabled.
    if (!this.targetConfiguration().showTp)
    {
      gauge.hide();
      return;
    }

    // setup the gauge with the battler.
    gauge.setup(this._j._battler, Sprite_FlowingGauge.Types.TP);

    // relocate the gauge sprite.
    gauge.move(x, y);
  }
}

//endregion Window_TargetFrame