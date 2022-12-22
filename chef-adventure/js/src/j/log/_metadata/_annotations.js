//region introduction
/*:
* @target MZ
* @plugindesc
* [v2.0.0 LOG] A log window for viewing on the map.
* @author JE
* @url https://github.com/je-can-code/ca
* @base J-Base
* @base J-MessageTextCodes
* @orderAfter J-Base
* @orderAfter J-ABS
* @orderAfter J-MessageTextCodes
* @help
* ============================================================================
* This plugin enables the ability to add and view logs in a window while on
* the map. By itself, this plugin only creates the log window and gives access
* to a couple utilities to build logs and add them to the window.
*
* This plugin was designed for JABS, but doesn't require it.
* If added while using JABS, the log window will automatically register all
* actions taken, damage/healing dealth, and various other details that one
* might expect to find in this sort of window.
*
* Additionally, the log window is a command window under the covers, so it
* also supports scrolling via mouse or touch.
*
* Controller/keyboard support for the log window is not supported.
*
* This plugin has two dependencies that all must be present to work:
* - J-Base (used for drawing the logs properly onto the window)
* - J-MessageTextCodes (used for translating text codes in logging)
* The MZ editor will inform you where this plugin needs to be relative to the
* other plugins (above/below/etc).
* ============================================================================
* @param defaultInactivityTime
* @type number
* @text Inactivity Timer Duration
* @desc The duration in frames of how long before the window autohides itself.
* @default 300
*
*
* @command showLog
* @text Show Log Window
* @desc Turns the log window visible to allow logs to be displayed.
*
* @command hideLog
* @text Hide Log Window
* @desc Turns the log window invisible. Logs still get logged, but can't be seen.
*
* @command addLog
* @text Add Log
* @desc Arbitrarily create a log for the log window. Respects text codes.
* @arg text
* @type string
* @default One potion was found!
*/