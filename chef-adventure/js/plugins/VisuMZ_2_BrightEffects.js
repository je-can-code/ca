//=============================================================================
// VisuStella MZ - Bright Effects
// VisuMZ_2_BrightEffects.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_BrightEffects = true;

var VisuMZ = VisuMZ || {};
VisuMZ.BrightEffects = VisuMZ.BrightEffects || {};
VisuMZ.BrightEffects.version = 1.01;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.01] [BrightEffects]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Bright_Effects_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 
 * This RPG Maker MZ plugin allows you to add various bright effects to your
 * game's maps and battle system. These effects can make the game appear more
 * vivid, light, and gives you control over the color settings of a particular
 * map to make a more distinct feeling, too. The bright effects can be changed
 * midway through events in both maps and battles, too.
 *
 * Features include all (but not limited to) the following:
 * 
 * * A Bloom filter effect that can help soften the feel of a map by giving
 *   objects on the screen a slight hazy glow.
 * * Godrays can be used to show animated sunlight coming down from the sky
 *   above.
 * * The Color Adjustment filter allows you to alter the brightness, contrast,
 *   and saturation levels of your maps and battles.
 * * Plugin Commands that allow you to adjust these settings on the go.
 * * Notetags for maps to alter the Bloom, Godray, and Color Adjustments
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Required Plugin List ------
 *
 * * Pixi JS Filters*
 *
 * This plugin requires the above listed plugins to be installed inside your
 * game's Plugin Manager list in order to work. You cannot start your game with
 * this plugin enabled without the listed plugins.
 * 
 * *Note* You can download the Pixi JS Filters plugin library from the below
 * URL or from the Action Sequence Impact product page. Install it as a
 * Tier 0 plugin.
 * 
 * *Note2* Pixi JS Filters perform differently on different machines/devices.
 * Please understand that this is outside of VisuStella's control.
 * 
 * URL: https://filters.pixijs.download/v3.1.0/pixi-filters.js
 *
 * ------ Tier 2 ------
 *
 * This plugin is a Tier 2 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * New Effects
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Bloom
 * 
 * This filter puts a faint (or large) glow around lighter-colored objects on
 * the map to give them a softer, hazy, brighter feeling.
 * 
 * Properties:
 *
 * Scale: To adjust the strength of the bloom. Higher values is more
 * intense brightness.
 *
 * Brightness: The brightness, lower value is more subtle brightness, higher
 * value is blown-out.
 *
 * Threshold: Defines how bright a color needs to be to affect bloom.
 *
 * ---
 *
 * Godray
 * 
 * The Godray filter puts down rays of light coming from the sky at an angle.
 * This is often used to represent sunlight peaking from above the clouds.
 * 
 * Properties:
 *
 * Visible: If on, the godrays will be visible by default. If off, they won't.
 *
 * Speed: The speed at which the light flickers. Lower for slower rate.
 * Higher for faster speeds.
 *
 * Gain: General intensity of the effect.
 *
 * Lacunarity: The density of the fractal noise.
 *
 * Angle: The angle/light-source direction of the rays.
 *
 * ---
 *
 * Color Adjustment
 * 
 * The Color Adjustment filter allows you to control the colors on the screen
 * to be more/less bright, contrast more/less, and more/less saturated.
 * 
 * Properties:
 *
 * Brightness: Adjusts the overall brightness of the screen. Use lower numbers
 * to make it darker and higher numbers to increase the brightness.
 *
 * Contrast: Increases the separation between dark and bright. Darker colors
 * become darker. Lighter colors become lighter. Increase this number to make
 * the effect more intense or decrease it to lessen it.
 *
 * Saturate: Adjusts the intensity of color on the screen. User higher numbers
 * to make colors more intense and lower numbers to make it less.
 *
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 *
 * ---
 * 
 * === Bloom-Related Notetags ===
 * 
 * ---
 *
 * <Bloom Scale: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Changes the bloom scale to x for map/battle.
 * - Replace 'x' with a number to represent the value. Use decimals.
 *   - Lower - Less bloom
 *   - Higher - More bloom
 *
 * ---
 *
 * <Bloom Brightness: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Changes the bloom brightness to x for map/battle
 * - Replace 'x' with a number to represent the value. Use decimals.
 *   - Lower - Darker
 *   - Higher - Brighter
 *
 * ---
 *
 * <Bloom Threshold: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Changes the bloom threshold to x for map/battle.
 * - Replace 'x' with a number to represent the value. Use decimals.
 *   - Lower - Less picky
 *   - Higher - More picky
 *
 * ---
 *
 * <Bloom Horz Scale: x to y>
 * <Bloom Vert Scale: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Sets an adjusting scale when traveling left to right on the map
 *   (Horz) or up to down on the map (Vert).
 * - Replace 'x' and 'y' with numbers to represent the value. Use decimals.
 *   - Lower - Less bloom
 *   - Higher - More bloom
 *
 * ---
 *
 * <Bloom Horz Brightness: x to y>
 * <Bloom Vert Brightness: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Sets an adjusting brightness when traveling left to right on the
 *   map (Horz) or up to down on the map (Vert).
 * - Replace 'x' and 'y' with numbers to represent the value. Use decimals.
 *   - Lower - Darker
 *   - Higher - Brighter
 *
 * ---
 *
 * <Bloom Horz Threshold: x to y>
 * <Bloom Vert Threshold: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Sets an adjusting threshold when traveling left to right on the
 *   map (Horz) or up to down on the map (Vert).
 * - Replace 'x' and 'y' with numbers to represent the value. Use decimals.
 *   - Lower - Less picky
 *   - Higher - More picky
 *
 * ---
 * 
 * === Godray-Related Notetags ===
 * 
 * ---
 *
 * <Godray>
 * <No Godray>
 *
 * - Used for: Map Notetags and Troop Names
 * - Changes if there will be a godray on the map/battle regardless of the
 *   default settings in the plugin parameters.
 *
 * ---
 *
 * <Godray Speed: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Sets the flickering speed of the rays.
 * - Replace 'x' with a number to represent the value. Use decimals.
 *   - Lower - Slower
 *   - Higher - Faster
 *
 * ---
 *
 * <Godray Gain: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Sets the gain/intensity of the rays.
 * - Replace 'x' with a number to represent the value. Use decimals.
 *   - Lower - Lighter
 *   - Higher - Intense
 *
 * ---
 *
 * <Godray Lacunarity: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Sets the lacunarity/density of the rays.
 * - Replace 'x' with a number to represent the value. Use decimals.
 *   - Lower - Less dense
 *   - Higher - More dense
 *
 * ---
 *
 * <Godray Angle: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Sets the angle of the rays.
 * - Replace 'x' with a number to represent the value. Use a negative or
 *   positive integer value.
 *   - Negative - Coming from the left
 *   - Positive - Coming from the right
 *
 * ---
 *
 * <Godray Horz Speed: x to y>
 * <Godray Vert Speed: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Adjusts godray speed going left to right on a map (Horz) or up
 *   to down on a map (Vert). 
 * - Replace 'x' and 'y' with numbers to represent the value. Use decimals.
 *   - Lower - Slower
 *   - Higher - Faster
 *
 * ---
 *
 * <Godray Horz Gain: x to y>
 * <Godray Vert Gain: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Adjusts godray gain going left to right on a map (Horz) or up to
 *   down on a map (Vert).
 * - Replace 'x' and 'y' with numbers to represent the value. Use decimals.
 *   - Lower - Lighter
 *   - Higher - Intense
 *
 * ---
 *
 * <Godray Horz Lacunarity: x to y>
 * <Godray Vert Lacunarity: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Adjusts godray lacunarity going left to right on a map (Horz) or
 *   up to down on a map (Vert).
 * - Replace 'x' and 'y' with numbers to represent the value. Use decimals.
 *   - Lower - Less dense
 *   - Higher - More dense
 *
 * ---
 *
 * <Godray Horz Angle: x to y>
 * <Godray Vert Angle: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Adjusts godray angle going left to right on a map (Horz) or up
 *   to down on a map (Vert).
 * - Replace 'x' and 'y' with numbers to represent the value. Use a negative or
 *   positive integer values.
 *   - Negative - Coming from the left
 *   - Positive - Coming from the right
 *
 * ---
 * 
 * === Color Adjust-Related Notetags ===
 * 
 * ---
 *
 * <Color Adjust Brightness: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Alters the screen brightness for the map/battle.
 * - Replace 'x' with a number to represent the value. Use decimals.
 *   - Lower - Darker
 *   - Higher - Brighter
 *
 * ---
 *
 * <Color Adjust Contrast: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Adjusts the screen contrast for the map/battle.
 * - Replace 'x' with a number to represent the value. Use decimals.
 *   - Lower - Less contrast
 *   - Higher - More contrast
 *
 * ---
 *
 * <Color Adjust Saturate: x>
 *
 * - Used for: Map Notetags and Troop Names
 * - Adjusts the screen saturation for the map/battle.
 * - Replace 'x' with a number to represent the value. Use decimals.
 *   - Lower - Darker
 *   - Higher - Brighter
 *
 * ---
 *
 * <Color Adjust Horz Brightness: x to y>
 * <Color Adjust Vert Brightness: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Alters the screen brightness when moving left to right on a map
 *   (Horz) or up to down on a map (Vert).
 * - Replace 'x' and 'y' with numbers to represent the value. Use decimals.
 *   - Lower - Darker
 *   - Higher - Brighter
 *
 * ---
 *
 * <Color Adjust Horz Contrast: x to y>
 * <Color Adjust Vert Contrast: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Adjusts the screen contrast when moving left to right on a map
 *   (Horz) or up to down on a map (Vert).
 * - Replace 'x' and 'y' with numbers to represent the value. Use decimals.
 *   - Lower - Less contrast
 *   - Higher - More contrast
 *
 * ---
 *
 * <Color Adjust Horz Saturate: x to y>
 * <Color Adjust Vert Saturate: x to y>
 *
 * - Used for: Map Notetags
 * - Map only. Adjusts the screen saturation when moving left to right on a map
 *   (Horz) or up to down on a map (Vert).
 * - Replace 'x' and 'y' with numbers to represent the value. Use decimals.
 *   - Lower - Less intensity
 *   - Higher - More intensity
 *
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Bloom Plugin Commands ===
 * 
 * ---
 *
 * Bloom: Change Settings
 * - Change the Bloom filter settings for the screen.
 *
 *   Bloom Scale:
 *   - Change bloom scale for the screen.
 *
 *   Bloom Brightness:
 *   - Change bloom brightness for the screen.
 *
 *   Bloom Threshold:
 *   - Change bloom threshold for the screen.
 *
 *   Shift Duration:
 *   - The amount of time it takes for the change to occur.
 *
 * ---
 *
 * Bloom: Reset
 * - Reset the Bloom filter settings for the settings found in the Plugin
 *   Parameters or map notetags.
 *
 *   Shift Duration:
 *   - The amount of time it takes for the reset to occur.
 *
 * ---
 * 
 * === Godray Plugin Commands ===
 * 
 * ---
 *
 * Godray: Change Settings
 * - Change the Godray filter settings for the screen.
 *
 *   Visible?:
 *   - Show godrays on the screen?
 *   - Visibility changes are immediate.
 *
 *   Godray Speed:
 *   - Change godray speed for the screen.
 *
 *   Godray Gain:
 *   - Change godray gain for the screen.
 *
 *   Godray Lacunarity:
 *   - Change godray lacunarity for the screen.
 *
 *   Godray Angle:
 *   - Change godray angle for the screen.
 *
 *   Shift Duration:
 *   - The amount of time it takes for the change to occur.
 *   - Visibility changes are immediate.
 *
 * ---
 *
 * Godray: Reset
 * - Reset the Godray filter settings for the settings found in the Plugin
 *   Parameters or map notetags.
 *
 *   Shift Duration:
 *   - The amount of time it takes for the reset to occur.
 *   - Visibility changes are immediate.
 *
 * ---
 * 
 * === Color Adjust Plugin Commands ===
 * 
 * ---
 *
 * Color Adjust: Change Settings
 * - Change the Color Adjustment filter settings for the screen.
 *
 *   Adjust Brightness:
 *   - Change color adjust brightness for the screen.
 *
 *   Adjust Contrast:
 *   - Change color adjust contrast for the screen.
 *
 *   Adjust Saturation:
 *   - Change color adjust saturation for the screen.
 *
 *   Shift Duration:
 *   - The amount of time it takes for the change to occur.
 *
 * ---
 *
 * Color Adjust: Reset
 * - Reset the Color Adjustment filter settings for the settings found in the
 *   Plugin Parameters or map notetags.
 *
 *   Shift Duration:
 *   - The amount of time it takes for the reset to occur.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Bloom Settings
 * ============================================================================
 *
 * There are two versions of these plugin parameters. One of them are for the
 * Map Defaults and the other is for the Battle Defaults. These settings are
 * applied to the map and battle scenes respectively and will serve as the
 * stock setting when no map notetags, troop name tags, or Plugin Commands have
 * been used to alter them.
 *
 * ---
 *
 * Bloom Settings
 * 
 *   Bloom Scale:
 *   - Default bloom scale for the screen unless changed through tags.
 * 
 *   Bloom Brightness:
 *   - Default bloom brightness for the screen unless changed through tags.
 * 
 *   Bloom Threshold:
 *   - Default bloom threshold for the screen unless changed through tags.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Godray Settings
 * ============================================================================
 *
 * There are two versions of these plugin parameters. One of them are for the
 * Map Defaults and the other is for the Battle Defaults. These settings are
 * applied to the map and battle scenes respectively and will serve as the
 * stock setting when no map notetags, troop name tags, or Plugin Commands have
 * been used to alter them.
 *
 * ---
 *
 * Godray Settings
 * 
 *   Default Visible?:
 *   - Show godrays on all screens by default unless changed through tags?
 * 
 *   Godray Speed:
 *   - Default godray speed for all screens unless changed through tags.
 * 
 *   Godray Gain:
 *   - Default godray gain for all screens unless changed through tags.
 * 
 *   Godray Lacunarity:
 *   - Default godray lacunarity for all screens unless changed through tags.
 * 
 *   Godray Angle:
 *   - Default godray angle for all screens unless changed through tags.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Color Adjust Settings
 * ============================================================================
 *
 * There are two versions of these plugin parameters. One of them are for the
 * Map Defaults and the other is for the Battle Defaults. These settings are
 * applied to the map and battle scenes respectively and will serve as the
 * stock setting when no map notetags, troop name tags, or Plugin Commands have
 * been used to alter them.
 *
 * ---
 *
 * Color Adjust Settings
 * 
 *   Adjust Brightness:
 *   - Default color adjust brightness for all screens unless changed
 *     through tags.
 * 
 *   Adjust Contrast:
 *   - Default color adjust contrast for all screens unless changed
 *     through tags.
 * 
 *   Adjust Saturation:
 *   - Default color adjust saturation for all screens unless changed
 *     through tags.
 *
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 * 
 * 7. If this VisuStella MZ plugin is a paid product, all project team members
 * must purchase their own individual copies of the paid product if they are to
 * use it. Usage includes working on related game mechanics, managing related
 * code, and/or using related Plugin Commands and features. Redistribution of
 * the plugin and/or its code to other members of the team is NOT allowed
 * unless they own the plugin itself as that conflicts with Article 4.
 * 
 * 8. Any extensions and/or addendums made to this plugin's Terms of Use can be
 * found on VisuStella.com and must be followed.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * * Yanfly
 * * Arisu
 * * Olivia
 * * Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.01: December 25, 2021
 * * Bug Fixes!
 * ** Bright effects from battle should no longer carry back over into the
 *    map scene. Fix made by Yanfly.
 *
 * Version 1.00: January 18, 2021
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command BloomChange
 * @text Bloom: Change Settings
 * @desc Change the Bloom filter settings for the screen.
 *
 * @arg Scale:num
 * @text Bloom Scale
 * @desc Change bloom scale for the screen.
 * @default 0.5
 *
 * @arg Brightness:num
 * @text Bloom Brightness
 * @desc Change bloom brightness for the screen.
 * @default 1.0
 *
 * @arg Threshold:num
 * @text Bloom Threshold
 * @desc Change bloom threshold for the screen.
 * @default 0.5
 *
 * @arg Duration:num
 * @text Shift Duration
 * @type number
 * @desc The amount of time it takes for the change to occur.
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command BloomReset
 * @text Bloom: Reset
 * @desc Reset the Bloom filter settings for the settings found in
 * the Plugin Parameters or map notetags.
 *
 * @arg Duration:num
 * @text Shift Duration
 * @type number
 * @desc The amount of time it takes for the reset to occur.
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GodrayChange
 * @text Godray: Change Settings
 * @desc Change the Godray filter settings for the screen.
 *
 * @arg Visible:eval
 * @text Visible?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show godrays on the screen?
 * Visibility changes are immediate.
 * @default true
 *
 * @arg Speed:num
 * @text Godray Speed
 * @desc Change godray speed for the screen.
 * @default 0.01
 *
 * @arg Gain:num
 * @text Godray Gain
 * @desc Change godray gain for the screen.
 * @default 0.6
 *
 * @arg Lacunarity:num
 * @text Godray Lacunarity
 * @desc Change godray lacunarity for the screen.
 * @default 2.0
 *
 * @arg Angle:num
 * @text Godray Angle
 * @desc Change godray angle for the screen.
 * @default -30
 *
 * @arg Duration:num
 * @text Shift Duration
 * @type number
 * @desc The amount of time it takes for the change to occur.
 * Visibility changes are immediate.
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GodrayReset
 * @text Godray: Reset
 * @desc Reset the Godray filter settings for the settings
 * found in the Plugin Parameters or map notetags.
 *
 * @arg Duration:num
 * @text Shift Duration
 * @type number
 * @desc The amount of time it takes for the reset to occur.
 * Visibility changes are immediate.
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ColorAdjustChange
 * @text Color Adjust: Change Settings
 * @desc Change the Color Adjustment filter settings for the screen.
 *
 * @arg Brightness:num
 * @text Adjust Brightness
 * @desc Change color adjust brightness for the screen.
 * @default 1.0
 *
 * @arg Contrast:num
 * @text Adjust Contrast
 * @desc Change color adjust contrast for the screen.
 * @default 0.0
 *
 * @arg Saturate:num
 * @text Adjust Saturation
 * @desc Change color adjust saturation for the screen.
 * @default 0.0
 *
 * @arg Duration:num
 * @text Shift Duration
 * @type number
 * @desc The amount of time it takes for the change to occur.
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ColorAdjustReset
 * @text Color Adjust: Reset
 * @desc Reset the Color Adjustment filter settings for the settings
 * found in the Plugin Parameters or map notetags.
 *
 * @arg Duration:num
 * @text Shift Duration
 * @type number
 * @desc The amount of time it takes for the reset to occur.
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param BrightEffects
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param Map
 * @text Map Defaults
 *
 * @param MapBloom:struct
 * @text Bloom Settings
 * @parent Map
 * @type struct<Bloom>
 * @desc Default bloom settings for all maps.
 * @default {"Scale:num":"0.5","Brightness:num":"1.0","Threshold:num":"0.5"}
 *
 * @param MapGodray:struct
 * @text Godray Settings
 * @parent Map
 * @type struct<Godray>
 * @desc Default Godray settings for all maps.
 * @default {"Visible:eval":"false","Speed:num":"0.01","Gain:num":"0.6","Lacunarity:num":"2.0","Angle:num":"-30"}
 *
 * @param MapColorAdjust:struct
 * @text Color Adjust Settings
 * @parent Map
 * @type struct<ColorAdjust>
 * @desc Default color adjustment settings for all maps.
 * @default {"Brightness:num":"1.0","Contrast:num":"0.0","Saturate:num":"0.0"}
 * 
 * @param Battle
 * @text Battle Defaults
 *
 * @param BattleBloom:struct
 * @text Bloom Settings
 * @parent Battle
 * @type struct<Bloom>
 * @desc Default bloom settings for all battles.
 * @default {"Scale:num":"0.5","Brightness:num":"1.0","Threshold:num":"0.5"}
 *
 * @param BattleGodray:struct
 * @text Godray Settings
 * @parent Battle
 * @type struct<Godray>
 * @desc Default Godray settings for all battles.
 * @default {"Visible:eval":"false","Speed:num":"0.01","Gain:num":"0.6","Lacunarity:num":"2.0","Angle:num":"-30"}
 *
 * @param BattleColorAdjust:struct
 * @text Color Adjust Settings
 * @parent Battle
 * @type struct<ColorAdjust>
 * @desc Default color adjustment settings for all battles.
 * @default {"Brightness:num":"1.0","Contrast:num":"0.0","Saturate:num":"0.0"}
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
/* ----------------------------------------------------------------------------
 * Bloom Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Bloom:
 *
 * @param Scale:num
 * @text Bloom Scale
 * @desc Default bloom scale for the screen unless changed through tags.
 * @default 0.5
 *
 * @param Brightness:num
 * @text Bloom Brightness
 * @desc Default bloom brightness for the screen unless changed through tags.
 * @default 1.0
 *
 * @param Threshold:num
 * @text Bloom Threshold
 * @desc Default bloom threshold for the screen unless changed through tags.
 * @default 0.5
 *
 */
/* ----------------------------------------------------------------------------
 * Godray Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Godray:
 *
 * @param Visible:eval
 * @text Default Visible?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show godrays on all screens by default unless changed through tags?
 * @default false
 *
 * @param Speed:num
 * @text Godray Speed
 * @desc Default godray speed for all screens unless changed through tags.
 * @default 0.01
 *
 * @param Gain:num
 * @text Godray Gain
 * @desc Default godray gain for all screens unless changed through tags.
 * @default 0.6
 *
 * @param Lacunarity:num
 * @text Godray Lacunarity
 * @desc Default godray lacunarity for all screens unless changed through tags.
 * @default 2.0
 *
 * @param Angle:num
 * @text Godray Angle
 * @desc Default godray angle for all screens unless changed through tags.
 * @default -30
 *
 */
/* ----------------------------------------------------------------------------
 * Color Adjust Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ColorAdjust:
 *
 * @param Brightness:num
 * @text Adjust Brightness
 * @desc Default color adjust brightness for all screens unless changed through tags.
 * @default 1.0
 *
 * @param Contrast:num
 * @text Adjust Contrast
 * @desc Default color adjust contrast for all screens unless changed through tags.
 * @default 0.0
 *
 * @param Saturate:num
 * @text Adjust Saturation
 * @desc Default color adjust saturation for all screens unless changed through tags.
 * @default 0.0
 *
 */
//=============================================================================

var _0x3335=['map','troop','name','registerCommand','bloomScale','toUpperCase','_BrightEffectsGodrayFilter','NUM','BrightEffects','return\x200','setupBrightEffectsGodrayFilter','getBrightEffectsGodraySettings','_realY','_BrightEffectsAdvBloomSettingsMap','ARRAYSTR','_BrightEffectsColorAdjustSettingsMap','_BrightEffectsAdvBloomSettingsBattle','Contrast','createBrightEffectsAdvBloomFilter','EVAL','currentSaturate','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','_BrightEffectsColorAdjustSettingsBattle','updateMapBrightEffectsGodray','getBrightEffectsAdvBloomSettings','_brightEffectsBloomVertBrightness','BattleGodray','gain','updateBrightEffectsGodrayFilter','Angle','Visible','getBrightEffectsColorAdjustSettings','_brightEffectsBloomVertScale','contrast','GodrayReset','setup','start','description','_brightEffectsBloomHorzThreshold','JSON','setupBrightEffectsAdvBloomFilter','note','MapColorAdjust','visible','ARRAYJSON','_brightEffectsColorAdjustHorzSaturate','_brightEffectsBloomHorzBrightness','_brightEffectsColorAdjustVertBrightness','includes','currentBrightness','isSceneMap','_brightEffectsColorAdjustVertContrast','BattleBloom','update','_brightEffectsGodrayVertGain','threshold','updateBrightEffectsAdvBloomFilter','match','Duration','brightness','_brightEffectsGodrayHorzSpeed','lacunarity','BloomChange','enabled','_brightEffectsColorAdjustHorzContrast','width','_BrightEffectsGodraySettingsMap','setBrightEffectsGodraySettings','_BrightEffectsColorAdjustFilter','MapGodray','_brightEffectsGodrayHorzGain','filter','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','STR','Spriteset_Base_update','parameters','updateMapBrightEffects','Settings','createBrightEffectsFilters','_BrightEffectsAdvBloomFilter','_brightEffectsGodrayHorzLacunarity','createBrightEffectsGodrayFilter','updateMapBrightEffectsColorAdjust','_scene','Lacunarity','updateMapBrightEffectsAdvBloom','isSceneBattle','_realX','GodrayChange','prototype','status','setBrightEffectsColorAdjustSettings','filters','createOverallFilters','Saturate','push','_brightEffectsGodrayVertAngle','updateBrightEffectsFilters','ConvertParams','version','_brightEffectsColorAdjustVertSaturate','Brightness','_brightEffectsBloomHorzScale','_brightEffectsBloomVertThreshold','ARRAYFUNC','_brightEffectsColorAdjustHorzBrightness','format','duration','GodrayFilter','createBrightEffectsColorAdjustFilter','Speed','angle','Spriteset_Base_createOverallFilters','_BrightEffectsGodraySettingsBattle','Gain','call','updateBrightEffectsColorAdjustFilter','height','Threshold','ARRAYSTRUCT','setupBrightEffectsFilters','saturate','Scene_Battle_start','setBrightEffectsAdvBloomSettings','speed','setupBrightEffectsColorAdjustFilter','currentContrast','exit','_brightEffectsGodrayHorzAngle','_brightEffectsGodrayVertSpeed','locate','BattleColorAdjust','constructor','_brightEffectsGodrayVertLacunarity','Game_Player_update','parse','ARRAYEVAL','ARRAYNUM','Game_Map_setup','max'];(function(_0x5ad7c0,_0x1f99f7){var _0x3335bf=function(_0x5151f4){while(--_0x5151f4){_0x5ad7c0['push'](_0x5ad7c0['shift']());}};_0x3335bf(++_0x1f99f7);}(_0x3335,0x10e));var _0x5151=function(_0x5ad7c0,_0x1f99f7){_0x5ad7c0=_0x5ad7c0-0xdd;var _0x3335bf=_0x3335[_0x5ad7c0];return _0x3335bf;};var _0x29161a=_0x5151,label=_0x29161a(0xef),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x29161a(0x12e)](function(_0x221140){var _0x5f0faf=_0x29161a;return _0x221140[_0x5f0faf(0x141)]&&_0x221140[_0x5f0faf(0x10c)][_0x5f0faf(0x117)]('['+label+']');})[0x0];VisuMZ[label]['Settings']=VisuMZ[label][_0x29161a(0x134)]||{},VisuMZ[_0x29161a(0x149)]=function(_0x55622e,_0xe4ee22){var _0x469106=_0x29161a;for(const _0x101b0f in _0xe4ee22){if(_0x101b0f[_0x469106(0x120)](/(.*):(.*)/i)){const _0x1b0eb5=String(RegExp['$1']),_0xcbdcd8=String(RegExp['$2'])[_0x469106(0xec)]()['trim']();let _0x4bc9b4,_0x509a28,_0x27528d;switch(_0xcbdcd8){case _0x469106(0xee):_0x4bc9b4=_0xe4ee22[_0x101b0f]!==''?Number(_0xe4ee22[_0x101b0f]):0x0;break;case _0x469106(0xe4):_0x509a28=_0xe4ee22[_0x101b0f]!==''?JSON['parse'](_0xe4ee22[_0x101b0f]):[],_0x4bc9b4=_0x509a28['map'](_0x2d2d90=>Number(_0x2d2d90));break;case _0x469106(0xfa):_0x4bc9b4=_0xe4ee22[_0x101b0f]!==''?eval(_0xe4ee22[_0x101b0f]):null;break;case _0x469106(0xe3):_0x509a28=_0xe4ee22[_0x101b0f]!==''?JSON[_0x469106(0xe2)](_0xe4ee22[_0x101b0f]):[],_0x4bc9b4=_0x509a28[_0x469106(0xe7)](_0x241e84=>eval(_0x241e84));break;case _0x469106(0x10e):_0x4bc9b4=_0xe4ee22[_0x101b0f]!==''?JSON[_0x469106(0xe2)](_0xe4ee22[_0x101b0f]):'';break;case _0x469106(0x113):_0x509a28=_0xe4ee22[_0x101b0f]!==''?JSON['parse'](_0xe4ee22[_0x101b0f]):[],_0x4bc9b4=_0x509a28[_0x469106(0xe7)](_0x1a6ce2=>JSON[_0x469106(0xe2)](_0x1a6ce2));break;case'FUNC':_0x4bc9b4=_0xe4ee22[_0x101b0f]!==''?new Function(JSON['parse'](_0xe4ee22[_0x101b0f])):new Function(_0x469106(0xf0));break;case _0x469106(0x14f):_0x509a28=_0xe4ee22[_0x101b0f]!==''?JSON[_0x469106(0xe2)](_0xe4ee22[_0x101b0f]):[],_0x4bc9b4=_0x509a28['map'](_0x2eade5=>new Function(JSON[_0x469106(0xe2)](_0x2eade5)));break;case _0x469106(0x130):_0x4bc9b4=_0xe4ee22[_0x101b0f]!==''?String(_0xe4ee22[_0x101b0f]):'';break;case _0x469106(0xf5):_0x509a28=_0xe4ee22[_0x101b0f]!==''?JSON[_0x469106(0xe2)](_0xe4ee22[_0x101b0f]):[],_0x4bc9b4=_0x509a28[_0x469106(0xe7)](_0x24b2ed=>String(_0x24b2ed));break;case'STRUCT':_0x27528d=_0xe4ee22[_0x101b0f]!==''?JSON['parse'](_0xe4ee22[_0x101b0f]):{},_0x4bc9b4=VisuMZ['ConvertParams']({},_0x27528d);break;case _0x469106(0x15e):_0x509a28=_0xe4ee22[_0x101b0f]!==''?JSON['parse'](_0xe4ee22[_0x101b0f]):[],_0x4bc9b4=_0x509a28[_0x469106(0xe7)](_0x1c1dcb=>VisuMZ[_0x469106(0x149)]({},JSON['parse'](_0x1c1dcb)));break;default:continue;}_0x55622e[_0x1b0eb5]=_0x4bc9b4;}}return _0x55622e;},(_0x25633d=>{var _0x58b059=_0x29161a;const _0x4254e3=_0x25633d[_0x58b059(0xe9)];for(const _0x9f84bf of dependencies){if(!Imported[_0x9f84bf]){alert(_0x58b059(0x12f)[_0x58b059(0x151)](_0x4254e3,_0x9f84bf)),SceneManager[_0x58b059(0x166)]();break;}}const _0x2d94ac=_0x25633d['description'];if(_0x2d94ac['match'](/\[Version[ ](.*?)\]/i)){const _0x23188a=Number(RegExp['$1']);_0x23188a!==VisuMZ[label][_0x58b059(0x14a)]&&(alert(_0x58b059(0xfc)[_0x58b059(0x151)](_0x4254e3,_0x23188a)),SceneManager[_0x58b059(0x166)]());}if(_0x2d94ac[_0x58b059(0x120)](/\[Tier[ ](\d+)\]/i)){const _0x1155fa=Number(RegExp['$1']);_0x1155fa<tier?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0x58b059(0x151)](_0x4254e3,_0x1155fa,tier)),SceneManager['exit']()):tier=Math[_0x58b059(0xe6)](_0x1155fa,tier);}VisuMZ[_0x58b059(0x149)](VisuMZ[label]['Settings'],_0x25633d[_0x58b059(0x132)]);})(pluginData),PluginManager['registerCommand'](pluginData[_0x29161a(0xe9)],_0x29161a(0x125),_0x4995c8=>{var _0x58b22b=_0x29161a;VisuMZ[_0x58b22b(0x149)](_0x4995c8,_0x4995c8);const _0x38fd0a=$gameScreen[_0x58b22b(0xff)]();_0x38fd0a[_0x58b22b(0xeb)]=_0x4995c8['Scale'],_0x38fd0a[_0x58b22b(0x122)]=_0x4995c8['Brightness'],_0x38fd0a[_0x58b22b(0x11e)]=_0x4995c8[_0x58b22b(0x15d)],_0x38fd0a[_0x58b22b(0x152)]=_0x4995c8[_0x58b22b(0x121)],!SceneManager[_0x58b22b(0x13d)]()&&($gameMap[_0x58b22b(0x115)]=undefined,$gameMap[_0x58b22b(0x100)]=undefined);}),PluginManager[_0x29161a(0xea)](pluginData[_0x29161a(0xe9)],'BloomReset',_0x46a239=>{var _0x4eefdd=_0x29161a;VisuMZ[_0x4eefdd(0x149)](_0x46a239,_0x46a239);SceneManager['isSceneBattle']()?$gameTroop[_0x4eefdd(0x10f)]():$gameMap['setupBrightEffectsAdvBloomFilter']();const _0x13328f=$gameScreen['getBrightEffectsAdvBloomSettings']();_0x13328f['duration']=_0x46a239['Duration'];}),PluginManager[_0x29161a(0xea)](pluginData[_0x29161a(0xe9)],_0x29161a(0x13f),_0x2976d9=>{var _0x38ad9c=_0x29161a;VisuMZ['ConvertParams'](_0x2976d9,_0x2976d9);const _0x156a84=$gameScreen[_0x38ad9c(0xf2)]();_0x156a84[_0x38ad9c(0x112)]=_0x2976d9[_0x38ad9c(0x105)],_0x156a84[_0x38ad9c(0x163)]=_0x2976d9[_0x38ad9c(0x155)],_0x156a84[_0x38ad9c(0x102)]=_0x2976d9[_0x38ad9c(0x159)],_0x156a84['lacunarity']=_0x2976d9['Lacunarity'],_0x156a84[_0x38ad9c(0x156)]=_0x2976d9['Angle'],_0x156a84['duration']=_0x2976d9['Duration'],!SceneManager[_0x38ad9c(0x13d)]()&&($gameMap[_0x38ad9c(0x123)]=undefined,$gameMap['_brightEffectsGodrayVertSpeed']=undefined);}),PluginManager['registerCommand'](pluginData[_0x29161a(0xe9)],_0x29161a(0x109),_0x53efe4=>{var _0x3d0005=_0x29161a;VisuMZ[_0x3d0005(0x149)](_0x53efe4,_0x53efe4);SceneManager[_0x3d0005(0x13d)]()?$gameTroop[_0x3d0005(0xf1)]():$gameMap['setupBrightEffectsGodrayFilter']();const _0xabb13e=$gameScreen[_0x3d0005(0xf2)]();_0xabb13e['duration']=_0x53efe4[_0x3d0005(0x121)];}),PluginManager[_0x29161a(0xea)](pluginData[_0x29161a(0xe9)],'ColorAdjustChange',_0x3abec7=>{var _0x5ed821=_0x29161a;VisuMZ[_0x5ed821(0x149)](_0x3abec7,_0x3abec7);const _0x348160=$gameScreen[_0x5ed821(0x106)]();_0x348160[_0x5ed821(0x122)]=_0x3abec7[_0x5ed821(0x14c)],_0x348160['contrast']=_0x3abec7['Contrast'],_0x348160['saturate']=_0x3abec7[_0x5ed821(0x145)],_0x348160['duration']=_0x3abec7[_0x5ed821(0x121)],!SceneManager[_0x5ed821(0x13d)]()&&($gameMap[_0x5ed821(0x114)]=undefined,$gameMap[_0x5ed821(0x14b)]=undefined);}),PluginManager['registerCommand'](pluginData[_0x29161a(0xe9)],'ColorAdjustReset',_0x582862=>{var _0x322aec=_0x29161a;VisuMZ['ConvertParams'](_0x582862,_0x582862);SceneManager[_0x322aec(0x13d)]()?$gameTroop[_0x322aec(0x164)]():$gameMap['setupBrightEffectsColorAdjustFilter']();const _0x35f670=$gameScreen[_0x322aec(0x106)]();_0x35f670[_0x322aec(0x152)]=_0x582862[_0x322aec(0x121)];}),SceneManager['isSceneBattle']=function(){var _0x5ad686=_0x29161a;return this[_0x5ad686(0x13a)]&&this[_0x5ad686(0x13a)][_0x5ad686(0xdf)]===Scene_Battle;},SceneManager[_0x29161a(0x119)]=function(){var _0x13e468=_0x29161a;return this[_0x13e468(0x13a)]&&this[_0x13e468(0x13a)]['constructor']===Scene_Map;},Game_Screen[_0x29161a(0x140)][_0x29161a(0x162)]=function(_0x3fdb30,_0x40696e,_0xe61fd6,_0x4415dd){var _0x22f0eb=_0x29161a;SceneManager[_0x22f0eb(0x13d)]()?this[_0x22f0eb(0xf7)]={'bloomScale':_0x3fdb30,'brightness':_0x40696e,'threshold':_0xe61fd6,'duration':_0x4415dd||0x0}:this[_0x22f0eb(0xf4)]={'bloomScale':_0x3fdb30,'brightness':_0x40696e,'threshold':_0xe61fd6,'duration':_0x4415dd||0x0};},Game_Screen[_0x29161a(0x140)][_0x29161a(0x12a)]=function(_0x3858f7,_0x3e41a9,_0x24fe00,_0x21d61e,_0x41f449,_0x181224){var _0x3a9847=_0x29161a;SceneManager['isSceneBattle']()?this[_0x3a9847(0x158)]={'visible':_0x3858f7,'speed':_0x3e41a9,'gain':_0x24fe00,'lacunarity':_0x21d61e,'angle':_0x41f449,'duration':_0x181224||0x0}:this[_0x3a9847(0x129)]={'visible':_0x3858f7,'speed':_0x3e41a9,'gain':_0x24fe00,'lacunarity':_0x21d61e,'angle':_0x41f449,'duration':_0x181224||0x0};},Game_Screen[_0x29161a(0x140)][_0x29161a(0x142)]=function(_0x73f4c0,_0x5d58bd,_0x2eb2e5,_0x2b328c){var _0x3db427=_0x29161a;SceneManager[_0x3db427(0x13d)]()?this['_BrightEffectsColorAdjustSettingsBattle']={'brightness':_0x73f4c0,'contrast':_0x5d58bd,'saturate':_0x2eb2e5,'duration':_0x2b328c||0x0}:this[_0x3db427(0xf6)]={'brightness':_0x73f4c0,'contrast':_0x5d58bd,'saturate':_0x2eb2e5,'duration':_0x2b328c||0x0};},Game_Screen[_0x29161a(0x140)][_0x29161a(0xff)]=function(){var _0x194899=_0x29161a;return SceneManager['isSceneBattle']()?(this[_0x194899(0xf7)]===undefined&&$gameTroop[_0x194899(0x10f)](),this[_0x194899(0xf7)]):(this[_0x194899(0xf4)]===undefined&&$gameMap['setupBrightEffectsAdvBloomFilter'](),this[_0x194899(0xf4)]);},Game_Screen[_0x29161a(0x140)][_0x29161a(0xf2)]=function(){var _0x45a3d4=_0x29161a;return SceneManager[_0x45a3d4(0x13d)]()?(this[_0x45a3d4(0x158)]===undefined&&$gameTroop[_0x45a3d4(0xf1)](),this[_0x45a3d4(0x158)]):(this[_0x45a3d4(0x129)]===undefined&&$gameMap[_0x45a3d4(0xf1)](),this[_0x45a3d4(0x129)]);},Game_Screen[_0x29161a(0x140)][_0x29161a(0x106)]=function(){var _0x347e91=_0x29161a;return SceneManager[_0x347e91(0x13d)]()?(this[_0x347e91(0xfd)]===undefined&&$gameTroop['setupBrightEffectsColorAdjustFilter'](),this[_0x347e91(0xfd)]):(this[_0x347e91(0xf6)]===undefined&&$gameMap[_0x347e91(0x164)](),this['_BrightEffectsColorAdjustSettingsMap']);},VisuMZ[_0x29161a(0xef)][_0x29161a(0x161)]=Scene_Battle[_0x29161a(0x140)][_0x29161a(0x10b)],Scene_Battle[_0x29161a(0x140)][_0x29161a(0x10b)]=function(){var _0x590675=_0x29161a;VisuMZ['BrightEffects'][_0x590675(0x161)][_0x590675(0x15a)](this),$gameTroop[_0x590675(0x15f)]();},Game_Troop[_0x29161a(0x140)][_0x29161a(0x15f)]=function(){var _0x82ec69=_0x29161a;this[_0x82ec69(0x10f)](),this['setupBrightEffectsGodrayFilter'](),this[_0x82ec69(0x164)]();},Game_Troop[_0x29161a(0x140)][_0x29161a(0x10f)]=function(){var _0x2f7648=_0x29161a;const _0x26fae6=VisuMZ['BrightEffects'][_0x2f7648(0x134)][_0x2f7648(0x11b)];var _0x5b213a=_0x26fae6['Scale'],_0x2b14b0=_0x26fae6[_0x2f7648(0x14c)],_0x433a57=_0x26fae6[_0x2f7648(0x15d)];if(!!this[_0x2f7648(0xe8)]()){var _0x2a0010=this[_0x2f7648(0xe8)]()[_0x2f7648(0xe9)];if(_0x2a0010[_0x2f7648(0x120)](/<BLOOM SCALE: (.*)>/i))var _0x5b213a=Number(RegExp['$1'])||0x0;if(_0x2a0010['match'](/<BLOOM BRIGHTNESS: (.*)>/i))var _0x2b14b0=Number(RegExp['$1'])||0x0;if(_0x2a0010['match'](/<BLOOM THRESHOLD: (.*)>/i))var _0x433a57=Number(RegExp['$1'])||0x0;}$gameScreen[_0x2f7648(0x162)](_0x5b213a,_0x2b14b0,_0x433a57,0x0);},Game_Troop[_0x29161a(0x140)][_0x29161a(0xf1)]=function(){var _0x3b13e0=_0x29161a;const _0xadab80=VisuMZ[_0x3b13e0(0xef)][_0x3b13e0(0x134)][_0x3b13e0(0x101)];var _0x28f484=_0xadab80[_0x3b13e0(0x105)],_0x5c2a95=_0xadab80[_0x3b13e0(0x155)],_0x1d6fe5=_0xadab80[_0x3b13e0(0x159)],_0x496189=_0xadab80[_0x3b13e0(0x13b)],_0x200888=_0xadab80[_0x3b13e0(0x104)];if(!!this[_0x3b13e0(0xe8)]()){var _0x21788d=this[_0x3b13e0(0xe8)]()[_0x3b13e0(0xe9)];if(_0x21788d[_0x3b13e0(0x120)](/<GODRAY>/i))_0x28f484=!![];else _0x21788d[_0x3b13e0(0x120)](/<NO GODRAY>/i)&&(_0x28f484=![]);_0x21788d['match'](/<GODRAY SPEED: (.*)>/i)&&(_0x5c2a95=Number(RegExp['$1'])||0x0),_0x21788d[_0x3b13e0(0x120)](/<GODRAY GAIN: (.*)>/i)&&(_0x1d6fe5=Number(RegExp['$1'])||0x0),_0x21788d['match'](/<GODRAY LACUNARITY: (.*)>/i)&&(_0x496189=Number(RegExp['$1'])||0x0),_0x21788d[_0x3b13e0(0x120)](/<GODRAY ANGLE: (.*)>/i)&&(_0x200888=Number(RegExp['$1'])||0x0);}$gameScreen[_0x3b13e0(0x12a)](_0x28f484,_0x5c2a95,_0x1d6fe5,_0x496189,_0x200888,0x0);},Game_Troop[_0x29161a(0x140)][_0x29161a(0x164)]=function(){var _0x48107e=_0x29161a;const _0x4bccab=VisuMZ['BrightEffects']['Settings'][_0x48107e(0xde)];var _0x3a3929=_0x4bccab[_0x48107e(0x14c)],_0x5c3b8c=_0x4bccab[_0x48107e(0xf8)],_0x1644f4=_0x4bccab[_0x48107e(0x145)];if(!!this[_0x48107e(0xe8)]()){var _0x50cbe0=this[_0x48107e(0xe8)]()[_0x48107e(0xe9)];if(_0x50cbe0[_0x48107e(0x120)](/<COLOR ADJUST BRIGHTNESS: (.*)>/i))var _0x3a3929=Number(RegExp['$1'])||0x0;if(_0x50cbe0[_0x48107e(0x120)](/<COLOR ADJUST CONTRAST: (.*)>/i))var _0x5c3b8c=Number(RegExp['$1'])||0x0;if(_0x50cbe0[_0x48107e(0x120)](/<COLOR ADJUST SATURATE: (.*)>/i))var _0x1644f4=Number(RegExp['$1'])||0x0;}$gameScreen['setBrightEffectsColorAdjustSettings'](_0x3a3929,_0x5c3b8c,_0x1644f4,0x0);},VisuMZ['BrightEffects']['Game_Map_setup']=Game_Map[_0x29161a(0x140)][_0x29161a(0x10a)],Game_Map[_0x29161a(0x140)][_0x29161a(0x10a)]=function(_0x5b2145){var _0x2384dd=_0x29161a;VisuMZ[_0x2384dd(0xef)][_0x2384dd(0xe5)][_0x2384dd(0x15a)](this,_0x5b2145),!!$dataMap&&this[_0x2384dd(0x15f)]();},Game_Map[_0x29161a(0x140)][_0x29161a(0x15f)]=function(){var _0x19c572=_0x29161a;this['setupBrightEffectsAdvBloomFilter'](),this['setupBrightEffectsGodrayFilter'](),this[_0x19c572(0x164)](),$gamePlayer[_0x19c572(0x133)]();},Game_Map[_0x29161a(0x140)][_0x29161a(0x10f)]=function(){var _0x3b44d9=_0x29161a;const _0x523739=VisuMZ[_0x3b44d9(0xef)][_0x3b44d9(0x134)]['MapBloom'];var _0x20193f=_0x523739['Scale'],_0x2ad155=_0x523739[_0x3b44d9(0x14c)],_0x2c462a=_0x523739['Threshold'];this[_0x3b44d9(0x14d)]=undefined,this[_0x3b44d9(0x107)]=undefined,this[_0x3b44d9(0x115)]=undefined,this[_0x3b44d9(0x100)]=undefined,this[_0x3b44d9(0x10d)]=undefined,this[_0x3b44d9(0x14e)]=undefined;if($dataMap){var _0x400eec=$dataMap['note'];if(_0x400eec[_0x3b44d9(0x120)](/<BLOOM SCALE: (.*)>/i))var _0x20193f=Number(RegExp['$1'])||0x0;if(_0x400eec[_0x3b44d9(0x120)](/<BLOOM BRIGHTNESS: (.*)>/i))var _0x2ad155=Number(RegExp['$1'])||0x0;if(_0x400eec[_0x3b44d9(0x120)](/<BLOOM THRESHOLD: (.*)>/i))var _0x2c462a=Number(RegExp['$1'])||0x0;_0x400eec[_0x3b44d9(0x120)](/<BLOOM (?:HORZ|HORIZONTAL) SCALE: (.*) TO (.*)>/i)&&(this[_0x3b44d9(0x14d)]=[Number(RegExp['$1']),Number(RegExp['$2'])],this[_0x3b44d9(0x107)]=undefined),_0x400eec[_0x3b44d9(0x120)](/<BLOOM (?:VERT|VERTICAL) SCALE: (.*) TO (.*)>/i)&&(this[_0x3b44d9(0x14d)]=undefined,this[_0x3b44d9(0x107)]=[Number(RegExp['$1']),Number(RegExp['$2'])]),_0x400eec['match'](/<BLOOM (?:HORZ|HORIZONTAL) BRIGHTNESS: (.*) TO (.*)>/i)&&(this[_0x3b44d9(0x115)]=[Number(RegExp['$1']),Number(RegExp['$2'])],this['_brightEffectsBloomVertBrightness']=undefined),_0x400eec[_0x3b44d9(0x120)](/<BLOOM (?:VERT|VERTICAL) BRIGHTNESS: (.*) TO (.*)>/i)&&(this[_0x3b44d9(0x115)]=undefined,this[_0x3b44d9(0x100)]=[Number(RegExp['$1']),Number(RegExp['$2'])]),_0x400eec[_0x3b44d9(0x120)](/<BLOOM (?:HORZ|HORIZONTAL) THRESHOLD: (.*) TO (.*)>/i)&&(this[_0x3b44d9(0x10d)]=[Number(RegExp['$1']),Number(RegExp['$2'])],this[_0x3b44d9(0x14e)]=undefined),_0x400eec[_0x3b44d9(0x120)](/<BLOOM (?:VERT|VERTICAL) THRESHOLD: (.*) TO (.*)>/i)&&(this['_brightEffectsBloomHorzThreshold']=undefined,this[_0x3b44d9(0x14e)]=[Number(RegExp['$1']),Number(RegExp['$2'])]);}$gameScreen['setBrightEffectsAdvBloomSettings'](_0x20193f,_0x2ad155,_0x2c462a,0x0);},Game_Map[_0x29161a(0x140)][_0x29161a(0xf1)]=function(){var _0x5e78d1=_0x29161a;const _0x3efc17=VisuMZ['BrightEffects'][_0x5e78d1(0x134)][_0x5e78d1(0x12c)];var _0x409417=_0x3efc17[_0x5e78d1(0x105)],_0x1c128d=_0x3efc17[_0x5e78d1(0x155)],_0x59cdce=_0x3efc17['Gain'],_0x553ce2=_0x3efc17[_0x5e78d1(0x13b)],_0x517ff3=_0x3efc17[_0x5e78d1(0x104)];this['_brightEffectsGodrayHorzSpeed']=undefined,this[_0x5e78d1(0x168)]=undefined,this[_0x5e78d1(0x12d)]=undefined,this[_0x5e78d1(0x11d)]=undefined,this[_0x5e78d1(0x137)]=undefined,this[_0x5e78d1(0xe0)]=undefined,this[_0x5e78d1(0x167)]=undefined,this[_0x5e78d1(0x147)]=undefined;if($dataMap){var _0x48c53d=$dataMap[_0x5e78d1(0x110)];if(_0x48c53d[_0x5e78d1(0x120)](/<GODRAY>/i))_0x409417=!![];else _0x48c53d['match'](/<NO GODRAY>/i)&&(_0x409417=![]);_0x48c53d[_0x5e78d1(0x120)](/<GODRAY SPEED: (.*)>/i)&&(_0x1c128d=Number(RegExp['$1'])||0x0),_0x48c53d[_0x5e78d1(0x120)](/<GODRAY GAIN: (.*)>/i)&&(_0x59cdce=Number(RegExp['$1'])||0x0),_0x48c53d[_0x5e78d1(0x120)](/<GODRAY LACUNARITY: (.*)>/i)&&(_0x553ce2=Number(RegExp['$1'])||0x0),_0x48c53d[_0x5e78d1(0x120)](/<GODRAY ANGLE: (.*)>/i)&&(_0x517ff3=Number(RegExp['$1'])||0x0),_0x48c53d[_0x5e78d1(0x120)](/<GODRAY (?:HORZ|HORIZONTAL) SPEED: (.*) TO (.*)>/i)&&(this[_0x5e78d1(0x123)]=[Number(RegExp['$1']),Number(RegExp['$2'])],this[_0x5e78d1(0x168)]=undefined),_0x48c53d[_0x5e78d1(0x120)](/<GODRAY (?:VERT|VERTICAL) SPEED: (.*) TO (.*)>/i)&&(this['_brightEffectsGodrayHorzSpeed']=undefined,this[_0x5e78d1(0x168)]=[Number(RegExp['$1']),Number(RegExp['$2'])]),_0x48c53d[_0x5e78d1(0x120)](/<GODRAY (?:HORZ|HORIZONTAL) GAIN: (.*) TO (.*)>/i)&&(this[_0x5e78d1(0x12d)]=[Number(RegExp['$1']),Number(RegExp['$2'])],this['_brightEffectsGodrayVertGain']=undefined),_0x48c53d[_0x5e78d1(0x120)](/<GODRAY (?:VERT|VERTICAL) GAIN: (.*) TO (.*)>/i)&&(this[_0x5e78d1(0x12d)]=undefined,this[_0x5e78d1(0x11d)]=[Number(RegExp['$1']),Number(RegExp['$2'])]),_0x48c53d['match'](/<GODRAY (?:HORZ|HORIZONTAL) LACUNARITY: (.*) TO (.*)>/i)&&(this[_0x5e78d1(0x137)]=[Number(RegExp['$1']),Number(RegExp['$2'])],this[_0x5e78d1(0xe0)]=undefined),_0x48c53d[_0x5e78d1(0x120)](/<GODRAY (?:VERT|VERTICAL) LACUNARITY: (.*) TO (.*)>/i)&&(this[_0x5e78d1(0x137)]=undefined,this['_brightEffectsGodrayVertLacunarity']=[Number(RegExp['$1']),Number(RegExp['$2'])]),_0x48c53d['match'](/<GODRAY (?:HORZ|HORIZONTAL) ANGLE: (.*) TO (.*)>/i)&&(this[_0x5e78d1(0x167)]=[Number(RegExp['$1']),Number(RegExp['$2'])],this['_brightEffectsGodrayVertAngle']=undefined),_0x48c53d['match'](/<GODRAY (?:VERT|VERTICAL) ANGLE: (.*) TO (.*)>/i)&&(this[_0x5e78d1(0x167)]=undefined,this[_0x5e78d1(0x147)]=[Number(RegExp['$1']),Number(RegExp['$2'])]);}$gameScreen['setBrightEffectsGodraySettings'](_0x409417,_0x1c128d,_0x59cdce,_0x553ce2,_0x517ff3,0x0);},Game_Map['prototype'][_0x29161a(0x164)]=function(){var _0x1a41d7=_0x29161a;const _0x80f10a=VisuMZ[_0x1a41d7(0xef)][_0x1a41d7(0x134)][_0x1a41d7(0x111)];var _0x2948f=_0x80f10a['Brightness'],_0x196e09=_0x80f10a[_0x1a41d7(0xf8)],_0x1eb844=_0x80f10a[_0x1a41d7(0x145)];this['_brightEffectsColorAdjustHorzBrightness']=undefined,this[_0x1a41d7(0x116)]=undefined,this['_brightEffectsColorAdjustHorzContrast']=undefined,this['_brightEffectsColorAdjustVertContrast']=undefined,this[_0x1a41d7(0x114)]=undefined,this[_0x1a41d7(0x14b)]=undefined;if($dataMap){var _0x6abd1f=$dataMap[_0x1a41d7(0x110)];if(_0x6abd1f[_0x1a41d7(0x120)](/<COLOR ADJUST BRIGHTNESS: (.*)>/i))var _0x2948f=Number(RegExp['$1'])||0x0;if(_0x6abd1f[_0x1a41d7(0x120)](/<COLOR ADJUST CONTRAST: (.*)>/i))var _0x196e09=Number(RegExp['$1'])||0x0;if(_0x6abd1f[_0x1a41d7(0x120)](/<COLOR ADJUST SATURATE: (.*)>/i))var _0x1eb844=Number(RegExp['$1'])||0x0;_0x6abd1f[_0x1a41d7(0x120)](/<COLOR ADJUST (?:HORZ|HORIZONTAL) BRIGHTNESS: (.*) TO (.*)>/i)&&(this[_0x1a41d7(0x150)]=[Number(RegExp['$1']),Number(RegExp['$2'])],this['_brightEffectsColorAdjustVertBrightness']=undefined),_0x6abd1f['match'](/<COLOR ADJUST (?:VERT|VERTICAL) BRIGHTNESS: (.*) TO (.*)>/i)&&(this[_0x1a41d7(0x150)]=undefined,this[_0x1a41d7(0x116)]=[Number(RegExp['$1']),Number(RegExp['$2'])]),_0x6abd1f[_0x1a41d7(0x120)](/<COLOR ADJUST (?:HORZ|HORIZONTAL) CONTRAST: (.*) TO (.*)>/i)&&(this[_0x1a41d7(0x127)]=[Number(RegExp['$1']),Number(RegExp['$2'])],this[_0x1a41d7(0x11a)]=undefined),_0x6abd1f[_0x1a41d7(0x120)](/<COLOR ADJUST (?:VERT|VERTICAL) CONTRAST: (.*) TO (.*)>/i)&&(this[_0x1a41d7(0x127)]=undefined,this[_0x1a41d7(0x11a)]=[Number(RegExp['$1']),Number(RegExp['$2'])]),_0x6abd1f['match'](/<COLOR ADJUST (?:HORZ|HORIZONTAL) SATURATE: (.*) TO (.*)>/i)&&(this['_brightEffectsColorAdjustHorzSaturate']=[Number(RegExp['$1']),Number(RegExp['$2'])],this[_0x1a41d7(0x14b)]=undefined),_0x6abd1f[_0x1a41d7(0x120)](/<COLOR ADJUST (?:VERT|VERTICAL) SATURATE: (.*) TO (.*)>/i)&&(this[_0x1a41d7(0x114)]=undefined,this[_0x1a41d7(0x14b)]=[Number(RegExp['$1']),Number(RegExp['$2'])]);}$gameScreen[_0x1a41d7(0x142)](_0x2948f,_0x196e09,_0x1eb844,0x0);},VisuMZ[_0x29161a(0xef)]['Game_CharacterBase_locate']=Game_CharacterBase[_0x29161a(0x140)][_0x29161a(0xdd)],Game_CharacterBase['prototype']['locate']=function(_0x22d05d,_0x4103a3){var _0x1afcec=_0x29161a;VisuMZ[_0x1afcec(0xef)]['Game_CharacterBase_locate'][_0x1afcec(0x15a)](this,_0x22d05d,_0x4103a3),this===$gamePlayer&&this[_0x1afcec(0x133)]();},VisuMZ[_0x29161a(0xef)][_0x29161a(0xe1)]=Game_Player['prototype']['update'],Game_Player['prototype'][_0x29161a(0x11c)]=function(_0x31c3b9){var _0x18dc0b=_0x29161a;VisuMZ[_0x18dc0b(0xef)]['Game_Player_update'][_0x18dc0b(0x15a)](this,_0x31c3b9),this[_0x18dc0b(0x133)]();},Game_Player['prototype'][_0x29161a(0x133)]=function(){var _0x5a6348=_0x29161a;this[_0x5a6348(0x13c)](),this[_0x5a6348(0xfe)](),this['updateMapBrightEffectsColorAdjust']();},Game_Player[_0x29161a(0x140)][_0x29161a(0x13c)]=function(){var _0x3ead16=_0x29161a,_0x564297=$gameScreen[_0x3ead16(0xff)](),_0x2ec14c=_0x564297[_0x3ead16(0xeb)],_0x48a164=_0x564297['brightness'],_0x41458f=_0x564297[_0x3ead16(0x11e)];if($gameMap[_0x3ead16(0x14d)]!==undefined)var _0x7d715c=$gameMap[_0x3ead16(0x14d)][0x0],_0x3cff38=$gameMap[_0x3ead16(0x14d)][0x1]-_0x7d715c,_0x3834e1=$gamePlayer[_0x3ead16(0x13e)]/$gameMap['width'](),_0x2ec14c=_0x7d715c+_0x3cff38*_0x3834e1;else{if($gameMap[_0x3ead16(0x107)]!==undefined)var _0x7d715c=$gameMap[_0x3ead16(0x107)][0x0],_0x3cff38=$gameMap[_0x3ead16(0x107)][0x1]-_0x7d715c,_0x3834e1=$gamePlayer['_realY']/$gameMap['height'](),_0x2ec14c=_0x7d715c+_0x3cff38*_0x3834e1;}if($gameMap[_0x3ead16(0x115)]!==undefined)var _0x7d715c=$gameMap['_brightEffectsBloomHorzBrightness'][0x0],_0x3cff38=$gameMap[_0x3ead16(0x115)][0x1]-_0x7d715c,_0x3834e1=$gamePlayer[_0x3ead16(0x13e)]/$gameMap[_0x3ead16(0x128)](),_0x48a164=_0x7d715c+_0x3cff38*_0x3834e1;else{if($gameMap[_0x3ead16(0x100)]!==undefined)var _0x7d715c=$gameMap[_0x3ead16(0x100)][0x0],_0x3cff38=$gameMap[_0x3ead16(0x100)][0x1]-_0x7d715c,_0x3834e1=$gamePlayer[_0x3ead16(0xf3)]/$gameMap[_0x3ead16(0x15c)](),_0x48a164=_0x7d715c+_0x3cff38*_0x3834e1;}if($gameMap[_0x3ead16(0x10d)]!==undefined)var _0x7d715c=$gameMap[_0x3ead16(0x10d)][0x0],_0x3cff38=$gameMap[_0x3ead16(0x10d)][0x1]-_0x7d715c,_0x3834e1=$gamePlayer['_realX']/$gameMap['width'](),_0x41458f=_0x7d715c+_0x3cff38*_0x3834e1;else{if($gameMap['_brightEffectsBloomVertThreshold']!==undefined)var _0x7d715c=$gameMap[_0x3ead16(0x14e)][0x0],_0x3cff38=$gameMap[_0x3ead16(0x14e)][0x1]-_0x7d715c,_0x3834e1=$gamePlayer[_0x3ead16(0xf3)]/$gameMap[_0x3ead16(0x15c)](),_0x41458f=_0x7d715c+_0x3cff38*_0x3834e1;}$gameScreen[_0x3ead16(0x162)](_0x2ec14c,_0x48a164,_0x41458f,_0x564297[_0x3ead16(0x152)]);},Game_Player['prototype'][_0x29161a(0xfe)]=function(){var _0x5d1ac2=_0x29161a,_0x52e360=$gameScreen['getBrightEffectsGodraySettings'](),_0x4f3f80=_0x52e360[_0x5d1ac2(0x112)],_0x3e0932=_0x52e360[_0x5d1ac2(0x163)],_0x3ec5ae=_0x52e360[_0x5d1ac2(0x102)],_0x9b69ec=_0x52e360['lacunarity'],_0x233c6f=_0x52e360[_0x5d1ac2(0x156)];if($gameMap[_0x5d1ac2(0x123)]!==undefined)var _0x1f9e2c=$gameMap[_0x5d1ac2(0x123)][0x0],_0x416ace=$gameMap[_0x5d1ac2(0x123)][0x1]-_0x1f9e2c,_0x4d08d1=$gamePlayer['_realX']/$gameMap[_0x5d1ac2(0x128)](),_0x3e0932=_0x1f9e2c+_0x416ace*_0x4d08d1;else{if($gameMap[_0x5d1ac2(0x107)]!==undefined)var _0x1f9e2c=$gameMap[_0x5d1ac2(0x168)][0x0],_0x416ace=$gameMap['_brightEffectsGodrayVertSpeed'][0x1]-_0x1f9e2c,_0x4d08d1=$gamePlayer[_0x5d1ac2(0xf3)]/$gameMap[_0x5d1ac2(0x15c)](),_0x3e0932=_0x1f9e2c+_0x416ace*_0x4d08d1;}if($gameMap[_0x5d1ac2(0x12d)]!==undefined)var _0x1f9e2c=$gameMap['_brightEffectsGodrayHorzGain'][0x0],_0x416ace=$gameMap[_0x5d1ac2(0x12d)][0x1]-_0x1f9e2c,_0x4d08d1=$gamePlayer[_0x5d1ac2(0x13e)]/$gameMap['width'](),_0x3ec5ae=_0x1f9e2c+_0x416ace*_0x4d08d1;else{if($gameMap['_brightEffectsGodrayVertGain']!==undefined)var _0x1f9e2c=$gameMap[_0x5d1ac2(0x11d)][0x0],_0x416ace=$gameMap[_0x5d1ac2(0x11d)][0x1]-_0x1f9e2c,_0x4d08d1=$gamePlayer[_0x5d1ac2(0xf3)]/$gameMap[_0x5d1ac2(0x15c)](),_0x3ec5ae=_0x1f9e2c+_0x416ace*_0x4d08d1;}if($gameMap['_brightEffectsGodrayHorzLacunarity']!==undefined)var _0x1f9e2c=$gameMap[_0x5d1ac2(0x137)][0x0],_0x416ace=$gameMap[_0x5d1ac2(0x137)][0x1]-_0x1f9e2c,_0x4d08d1=$gamePlayer['_realX']/$gameMap[_0x5d1ac2(0x128)](),_0x9b69ec=_0x1f9e2c+_0x416ace*_0x4d08d1;else{if($gameMap[_0x5d1ac2(0xe0)]!==undefined)var _0x1f9e2c=$gameMap[_0x5d1ac2(0xe0)][0x0],_0x416ace=$gameMap[_0x5d1ac2(0xe0)][0x1]-_0x1f9e2c,_0x4d08d1=$gamePlayer[_0x5d1ac2(0xf3)]/$gameMap[_0x5d1ac2(0x15c)](),_0x9b69ec=_0x1f9e2c+_0x416ace*_0x4d08d1;}if($gameMap[_0x5d1ac2(0x167)]!==undefined)var _0x1f9e2c=$gameMap['_brightEffectsGodrayHorzAngle'][0x0],_0x416ace=$gameMap[_0x5d1ac2(0x167)][0x1]-_0x1f9e2c,_0x4d08d1=$gamePlayer[_0x5d1ac2(0x13e)]/$gameMap[_0x5d1ac2(0x128)](),_0x233c6f=_0x1f9e2c+_0x416ace*_0x4d08d1;else{if($gameMap[_0x5d1ac2(0x147)]!==undefined)var _0x1f9e2c=$gameMap[_0x5d1ac2(0x147)][0x0],_0x416ace=$gameMap[_0x5d1ac2(0x147)][0x1]-_0x1f9e2c,_0x4d08d1=$gamePlayer[_0x5d1ac2(0xf3)]/$gameMap[_0x5d1ac2(0x15c)](),_0x233c6f=_0x1f9e2c+_0x416ace*_0x4d08d1;}$gameScreen[_0x5d1ac2(0x12a)](_0x4f3f80,_0x3e0932,_0x3ec5ae,_0x9b69ec,_0x233c6f,_0x52e360[_0x5d1ac2(0x152)]);},Game_Player[_0x29161a(0x140)][_0x29161a(0x139)]=function(){var _0x92ccc1=_0x29161a,_0x4660ea=$gameScreen['getBrightEffectsColorAdjustSettings'](),_0x5376bd=_0x4660ea['brightness'],_0x2131df=_0x4660ea[_0x92ccc1(0x108)],_0x5ecc1e=_0x4660ea[_0x92ccc1(0x160)];if($gameMap['_brightEffectsColorAdjustHorzBrightness']!==undefined)var _0x1b1397=$gameMap['_brightEffectsColorAdjustHorzBrightness'][0x0],_0x201a9a=$gameMap['_brightEffectsColorAdjustHorzBrightness'][0x1]-_0x1b1397,_0x163c71=$gamePlayer[_0x92ccc1(0x13e)]/$gameMap[_0x92ccc1(0x128)](),_0x5376bd=_0x1b1397+_0x201a9a*_0x163c71;else{if($gameMap[_0x92ccc1(0x116)]!==undefined)var _0x1b1397=$gameMap['_brightEffectsColorAdjustVertBrightness'][0x0],_0x201a9a=$gameMap[_0x92ccc1(0x116)][0x1]-_0x1b1397,_0x163c71=$gamePlayer['_realY']/$gameMap[_0x92ccc1(0x15c)](),_0x5376bd=_0x1b1397+_0x201a9a*_0x163c71;}if($gameMap[_0x92ccc1(0x127)]!==undefined)var _0x1b1397=$gameMap['_brightEffectsColorAdjustHorzContrast'][0x0],_0x201a9a=$gameMap['_brightEffectsColorAdjustHorzContrast'][0x1]-_0x1b1397,_0x163c71=$gamePlayer[_0x92ccc1(0x13e)]/$gameMap['width'](),_0x2131df=_0x1b1397+_0x201a9a*_0x163c71;else{if($gameMap[_0x92ccc1(0x11a)]!==undefined)var _0x1b1397=$gameMap[_0x92ccc1(0x11a)][0x0],_0x201a9a=$gameMap['_brightEffectsColorAdjustVertContrast'][0x1]-_0x1b1397,_0x163c71=$gamePlayer[_0x92ccc1(0xf3)]/$gameMap['height'](),_0x2131df=_0x1b1397+_0x201a9a*_0x163c71;}if($gameMap[_0x92ccc1(0x114)]!==undefined)var _0x1b1397=$gameMap[_0x92ccc1(0x114)][0x0],_0x201a9a=$gameMap['_brightEffectsColorAdjustHorzSaturate'][0x1]-_0x1b1397,_0x163c71=$gamePlayer[_0x92ccc1(0x13e)]/$gameMap[_0x92ccc1(0x128)](),_0x5ecc1e=_0x1b1397+_0x201a9a*_0x163c71;else{if($gameMap['_brightEffectsColorAdjustVertSaturate']!==undefined)var _0x1b1397=$gameMap[_0x92ccc1(0x14b)][0x0],_0x201a9a=$gameMap[_0x92ccc1(0x14b)][0x1]-_0x1b1397,_0x163c71=$gamePlayer[_0x92ccc1(0xf3)]/$gameMap[_0x92ccc1(0x15c)](),_0x5ecc1e=_0x1b1397+_0x201a9a*_0x163c71;}$gameScreen[_0x92ccc1(0x142)](_0x5376bd,_0x2131df,_0x5ecc1e,_0x4660ea[_0x92ccc1(0x152)]);},VisuMZ[_0x29161a(0xef)]['Spriteset_Base_createOverallFilters']=Spriteset_Base[_0x29161a(0x140)][_0x29161a(0x144)],Spriteset_Base['prototype'][_0x29161a(0x144)]=function(){var _0x4bfbf2=_0x29161a;VisuMZ[_0x4bfbf2(0xef)][_0x4bfbf2(0x157)][_0x4bfbf2(0x15a)](this),this[_0x4bfbf2(0x135)]();},Spriteset_Base['prototype'][_0x29161a(0x135)]=function(){var _0x160a7b=_0x29161a;this[_0x160a7b(0x143)]=this[_0x160a7b(0x143)]||[],this[_0x160a7b(0xf9)](),this[_0x160a7b(0x138)](),this[_0x160a7b(0x154)](),this[_0x160a7b(0x148)]();},Spriteset_Base['prototype'][_0x29161a(0xf9)]=function(){var _0x2a28ce=_0x29161a;this[_0x2a28ce(0x136)]=new PIXI['filters']['AdvancedBloomFilter'](),this['filters']['push'](this[_0x2a28ce(0x136)]);},Spriteset_Base[_0x29161a(0x140)][_0x29161a(0x138)]=function(){var _0x284428=_0x29161a;this[_0x284428(0xed)]=new PIXI[(_0x284428(0x143))][(_0x284428(0x153))](),this['_BrightEffectsGodrayFilter']['enabled']=![],this[_0x284428(0x143)][_0x284428(0x146)](this[_0x284428(0xed)]);},Spriteset_Base[_0x29161a(0x140)][_0x29161a(0x154)]=function(){var _0x4396b3=_0x29161a;this['_BrightEffectsColorAdjustFilter']=new PIXI['filters']['ColorMatrixFilter'](),this[_0x4396b3(0x143)]['push'](this['_BrightEffectsColorAdjustFilter']);},VisuMZ[_0x29161a(0xef)][_0x29161a(0x131)]=Spriteset_Base[_0x29161a(0x140)]['update'],Spriteset_Base[_0x29161a(0x140)]['update']=function(){var _0x468a51=_0x29161a;VisuMZ['BrightEffects']['Spriteset_Base_update'][_0x468a51(0x15a)](this),this[_0x468a51(0x148)]();},Spriteset_Base[_0x29161a(0x140)]['updateBrightEffectsFilters']=function(){var _0x5925be=_0x29161a;this[_0x5925be(0x11f)](),this[_0x5925be(0x103)](),this['updateBrightEffectsColorAdjustFilter']();},Spriteset_Base['prototype'][_0x29161a(0x11f)]=function(){var _0x5ab11a=_0x29161a;if(!!this['_BrightEffectsAdvBloomFilter']){var _0x5927ef=$gameScreen[_0x5ab11a(0xff)](),_0x1673ee=_0x5927ef['duration'];_0x1673ee<=0x0?(this['_BrightEffectsAdvBloomFilter'][_0x5ab11a(0xeb)]=_0x5927ef[_0x5ab11a(0xeb)],this[_0x5ab11a(0x136)][_0x5ab11a(0x122)]=_0x5927ef[_0x5ab11a(0x122)],this['_BrightEffectsAdvBloomFilter'][_0x5ab11a(0x11e)]=_0x5927ef[_0x5ab11a(0x11e)]):(_0x5927ef[_0x5ab11a(0x152)]--,this[_0x5ab11a(0x136)][_0x5ab11a(0xeb)]=(this[_0x5ab11a(0x136)][_0x5ab11a(0xeb)]*(_0x1673ee-0x1)+_0x5927ef['bloomScale'])/_0x1673ee,this[_0x5ab11a(0x136)][_0x5ab11a(0x122)]=(this['_BrightEffectsAdvBloomFilter'][_0x5ab11a(0x122)]*(_0x1673ee-0x1)+_0x5927ef['brightness'])/_0x1673ee,this[_0x5ab11a(0x136)][_0x5ab11a(0x11e)]=(this[_0x5ab11a(0x136)]['threshold']*(_0x1673ee-0x1)+_0x5927ef[_0x5ab11a(0x11e)])/_0x1673ee);}},Spriteset_Base[_0x29161a(0x140)][_0x29161a(0x103)]=function(){var _0x3480ca=_0x29161a;if(!!this[_0x3480ca(0xed)]){var _0x3fc3a7=$gameScreen[_0x3480ca(0xf2)](),_0x3341dc=_0x3fc3a7[_0x3480ca(0x152)];_0x3341dc<=0x0?(this['_BrightEffectsGodrayFilter']['speed']=_0x3fc3a7[_0x3480ca(0x163)],this[_0x3480ca(0xed)][_0x3480ca(0x102)]=_0x3fc3a7[_0x3480ca(0x102)],this[_0x3480ca(0xed)][_0x3480ca(0x124)]=_0x3fc3a7[_0x3480ca(0x124)],this[_0x3480ca(0xed)]['angle']=_0x3fc3a7[_0x3480ca(0x156)]):(_0x3fc3a7[_0x3480ca(0x152)]--,this[_0x3480ca(0xed)]['speed']=(this[_0x3480ca(0xed)]['speed']*(_0x3341dc-0x1)+_0x3fc3a7[_0x3480ca(0x163)])/_0x3341dc,this[_0x3480ca(0xed)][_0x3480ca(0x102)]=(this['_BrightEffectsGodrayFilter'][_0x3480ca(0x102)]*(_0x3341dc-0x1)+_0x3fc3a7['gain'])/_0x3341dc,this[_0x3480ca(0xed)][_0x3480ca(0x124)]=(this[_0x3480ca(0xed)][_0x3480ca(0x124)]*(_0x3341dc-0x1)+_0x3fc3a7[_0x3480ca(0x124)])/_0x3341dc,this['_BrightEffectsGodrayFilter']['angle']=(this[_0x3480ca(0xed)][_0x3480ca(0x156)]*(_0x3341dc-0x1)+_0x3fc3a7['angle'])/_0x3341dc),this[_0x3480ca(0xed)]['time']+=this[_0x3480ca(0xed)][_0x3480ca(0x163)],this['_BrightEffectsGodrayFilter'][_0x3480ca(0x126)]=_0x3fc3a7[_0x3480ca(0x112)];}},Spriteset_Base[_0x29161a(0x140)][_0x29161a(0x15b)]=function(){var _0x562eac=_0x29161a;if(!!this[_0x562eac(0x12b)]){var _0xf293f=$gameScreen[_0x562eac(0x106)](),_0x38e456=_0xf293f[_0x562eac(0x152)];_0x38e456<=0x0?(this[_0x562eac(0x12b)][_0x562eac(0x118)]=_0xf293f['brightness'],this['_BrightEffectsColorAdjustFilter']['currentContrast']=_0xf293f['contrast'],this['_BrightEffectsColorAdjustFilter'][_0x562eac(0xfb)]=_0xf293f[_0x562eac(0x160)]):(_0xf293f[_0x562eac(0x152)]--,this[_0x562eac(0x12b)][_0x562eac(0x118)]=(this[_0x562eac(0x12b)][_0x562eac(0x118)]*(_0x38e456-0x1)+_0xf293f[_0x562eac(0x122)])/_0x38e456,this['_BrightEffectsColorAdjustFilter'][_0x562eac(0x165)]=(this[_0x562eac(0x12b)][_0x562eac(0x165)]*(_0x38e456-0x1)+_0xf293f[_0x562eac(0x108)])/_0x38e456,this[_0x562eac(0x12b)][_0x562eac(0xfb)]=(this['_BrightEffectsColorAdjustFilter'][_0x562eac(0xfb)]*(_0x38e456-0x1)+_0xf293f[_0x562eac(0x160)])/_0x38e456),this[_0x562eac(0x12b)][_0x562eac(0x122)](this[_0x562eac(0x12b)][_0x562eac(0x118)]),this[_0x562eac(0x12b)]['contrast'](this[_0x562eac(0x12b)][_0x562eac(0x165)],!![]),this['_BrightEffectsColorAdjustFilter'][_0x562eac(0x160)](this[_0x562eac(0x12b)]['currentSaturate'],!![]);}};