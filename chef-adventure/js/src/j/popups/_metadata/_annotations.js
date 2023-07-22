//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 POPUPS] Enable text pops on the map.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * This plugin enables the ability to display text popups on the map.
 *
 * The text pops themselves were designed for use within JABS, but the
 * functionality was abstracted out and no longer relies on JABS to operate.
 * ============================================================================
 * BASIC USAGE:
 * If you are using JABS, then JABS already knows what to do to make use of
 * this functionality. Just add this plugin after/below JABS, and it'll work
 * with no additional adjustments.
 * ============================================================================
 * PLUGIN DEVELOPER USAGE:
 * If you want to leverage these text popups on the map to display your own
 * custom popup, either in an event or in your plugin, then the below steps
 * will help you accomplish that.
 *
 * Step 1) Get the Game_Character or subclass of Game_Character.
 * The character is the focal point of where a popup is displayed on the map.
 *
 * Step 1a) Getting the character inside an event command.
 * If you're in an event using the event command "Script", then you can use
 * this line:
 *    const character = $gameMap.event(this._eventId);
 * to retrieve the character for reference. "this._eventId" references the
 * executing event. If you wanted it to be on some other particular event, you
 * can swap in another event id instead.
 *
 * Step 1b) Getting the character inside a plugin.
 * If you're in a plugin, I'm afraid you'll need to sort out how to gain access
 * to the character you want yourself. You can peek into JABS code to see some
 * examples of how I fetched characters for display.
 *
 * Step 2) Building the popup.
 * Building the popup is fairly straight forward. You can use the
 * "TextPopBuilder" class to "build" a popup. It uses the builder pattern for
 * piecing together the relevant parts of the popup in a way that makes sense.
 * It also has some convenience presets for more commonly used popups, like
 * hp damage. A basic example of the textpopbuilder in-use would look like:
 *    const customPop = new TextPopBuilder("hello")
 *      .setIconIndex(87)
 *      .setTextColorIndex(27)
 *      .build();
 * which would result in the "customPop" variable to now contain a built
 * popup with the value of "hello", an icon to the left of index 87, and a
 * text color of 27 (see your message window for text color indices).
 *
 * Step 3) Add the pop and flag the character.
 * Once you have the character and built the text pop, you only need to add it
 * to the character and flag them for processing. Going with the above
 * examples, an end result from start to finish could look something like this:
 *
 *    const character = $gameMap.event(this._eventId);
 *    const customPop = new TextPopBuilder("hello")
 *      .setIconIndex(87)
 *      .setTextColorIndex(27)
 *      .build();
 *    character.addTextPop(customPop);
 *    character.requestTextPop();
 *
 * Or if you're in a plugin, the only real difference would be how the
 * character is retrieved, with the rest being the same.
 * ============================================================================
 */