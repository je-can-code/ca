//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 ESCRIBE] Enables "describing" the event with some text and/or an icon.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * This plugin allows the functionality to have events with text and/or icons
 * over them. These can also be only visible when the player is within a
 * specified distance from the event.
 *
 * In order to utilize this functionality, add a comment to an event with one
 * of the following tags below to create text/icons that show up on the event:
 *
 * <text:EVENT_TEXT>
 * Where EVENT_TEXT is whatever text you want to show on this event.
 *
 * <icon:ICON_INDEX>
 * Where ICON_INDEX is the icon index of the icon to show on this event.
 *
 * <proximityText>
 * or
 * <proximityText:DISTANCE>
 * Where DISTANCE is the distance in tiles/squares that the player must be
 * within in order to see the text on this event. If using the tag without
 * DISTANCE, then the DISTANCE will default to 0, meaning the player must be
 * standing ontop of the event in order for the text to show up.
 *
 * <proximityIcon>
 * or
 * <proximityIcon:DISTANCE>
 * Where DISTANCE is the distance in tiles/squares that the player must be
 * within in order to see the icon on this event. If using the tag without
 * DISTANCE, then the DISTANCE will default to 0, meaning the player must be
 * standing ontop of the event in order for the icon to show up.
 * ============================================================================
 * NOTE:
 * Proximity tags are optional. If they are not added to the event alongside
 * the text or icon tag, then the text/icon will always be visible while the
 * event is visible on the map.
 * ============================================================================
*/