//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.1.0 BASE] The base class for all J plugins.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @help
 * ==============================================================================
 * This is the base class that is required for basically ALL of J-* plugins.
 * Please be sure this is above all other J-* plugins, and keep it up to date!
 * ==============================================================================
 * This contains little innate functionality on its own, but does keep within it
 * all the various classes and objects that other plugins use but needed to be
 * declared ahead of time.
 * ==============================================================================
 * Additionally, most of the note-reading and such takes place here as well.
 * ==============================================================================
 * CHANGELOG:
 * - 2.1.0
 *    Added wrapper objects for many database objects to ease plugin dev coding.
 *    Added "More data" window base class.
 *    Reverted the break-apart because that caused grief.
 *    Shuffled ownership of various functions.
 *
 * - 2.0.0 (breaking change!)
 *    Broke apart the entire plugin into a collection of pieces, to leverage
 *    the new "plugin in a nested folder" functionality of RMMZ.
 *
 * - 1.0.3
 *    Added "on-own-death" and "on-target-death" tag for battlers.
 *    Changed "retaliate" tag structure to allow a chance for triggering.
 *
 * - 1.0.2
 *    Added an "IconManager" for consistent icon indexing between all my plugins.
 *
 * - 1.0.1
 *    Updates for new models leveraged by the JAFTING system (refinement).
 *    All equipment now have a ._jafting property available on them.
 *
 * - 1.0.0
 *    First proper actual release where I'm leveraging and enforcing versioning.
 * ==============================================================================
 */