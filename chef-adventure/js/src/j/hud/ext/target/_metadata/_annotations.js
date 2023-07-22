//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 HUD-TARGET] A HUD frame that displays your battle target.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-ABS
 * @base J-Base
 * @base J-HUD
 * @orderAfter J-ABS
 * @orderAfter J-Base
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * OVERVIEW:
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