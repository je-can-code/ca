//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 JAFT-REFINE] Extends JAFTING to include refinement.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @base J-JAFTING
 * @orderAfter J-Base
 * @orderAfter J-JAFTING
 * @help
 * ============================================================================
 * [INTRODUCTION]:
 * This is an extension of the JAFTING plugin to enable the ability to "refine"
 * equipment. "Refinement" is defined as "transfering the traits of one item
 * onto another". It is also important to note that "transferable traits" are
 * defined as "all traits on an equip in the database that are below the
 * divider".
 *
 * The "divider" is another trait: 'Collapse Effect'. It doesn't matter which
 * option you select in the dropdown for this (for now). Traits that are above
 * the "divider" are considered "passive" traits that cannot be transfered.
 *
 * This plugin does not handle trait removal, so do keep that in mind.
 *
 * [DESCRIPTION]:
 * This functionality's exclusive target is equipment. The most common use case
 * for this type of plugin is to repeatedly upgrade a weapon or armor of a
 * given type with new/improved traits, allowing the player to keep their
 * equipment relevant longer (or hang onto stuff for sentimental reasons, I
 * guess). It works in tandem with a basic crafting system (the JAFTING base
 * system) to allow you, the RM dev, to come up with fun ways to allow not only
 * you, but the player as well, to flex creativity by using recipes to make
 * stuff, then using refinement to upgrade it. With a wide variety of traits
 * spread across various equipment, combined with the notetags below, this
 * extension on JAFTING can make for some interesting situations in-game (good
 * and bad).
 *
 * [NOTE TAGS]:
 * Obviously, being able to willy nilly refine any equips with any equips could
 * be volatile for the RM dev being able to keep control on what the player
 * should be doing (such as refining a unique equipment onto another and there
 * by losing said unique equipment that could've been required for story!).
 *
 * As such, I've introduced a few tags that can be applied onto weapons/armor:
 *
 * <noRefine>
 * Placing this tag onto equipment renders it unavailable to be refined at all.
 * That means it simply won't show up in the refinement menu's equip lists.
 *
 * <notRefinementBase>
 * Placing this tag onto equipment means it will be a disabled option when
 * selecting a base equip to refine. This most commonly would be used by
 * perhaps some kind of "fragile" types of equipment, or for equipment you
 * designed explicitly as a material.
 *
 * <notRefinementMaterial>
 * Placing this tag onto equipment means it will be a disabled option when
 * selecting a material equip to refine onto the base. This most commonly would
 * be used for preventing the player from sacrificing an equipment that is
 * required for story purposes.
 *
 * <maxRefineCount:NUM>
 * Where NUM is a number that represents how many times this can be refined.
 * Placing this tag onto equipment means it can only be used as a base for
 * refinement NUM number of times.
 *
 * <maxRefinedTraits:NUM>
 * Where NUM is a number that represents how many combined traits it can have.
 * Placing this tag onto equipment means it can only be used as a base as long
 * as the number of combined trait slots (see the screen while refining) is
 * lesser than or equal to NUM. This most commonly would be used to prevent
 * the player from adding an unreasonable number of traits onto an equip.
 *
 * [PLUGIN PARAMETERS]:
 * There are just a couple that will control the visibility of the actual
 * command that shows up for refinement in the JAFTING mode select window.
 *
 * I debated on putting all the various text bits that show up
 * throughout the menu here for translation, but instead I captured them all
 * and put them in the J.JAFTING.EXT.REFINE.Messages object. If you want to change the
 * text, feel free to edit that instead. Additionally, for the various traits
 * text, you can find that text hard-coded english starting at line 2164 by
 * trait code.
 * ============================================================================
 * CHANGELOG:
 *
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @command hideJaftingRefinement
 * @text Hide Refinement Option
 * @desc Removes the "refinement" option from the JAFTING mode selection window.
 *
 * @command showJaftingRefinement
 * @text Show Refinement Option
 * @desc Adds the "refinement" option to the JAFTING mode selection window.
 *
 * @command disableJaftingRefinement
 * @text Disable Refinement Option
 * @desc Disables the "refinement" option in the JAFTING mode selection window.
 *
 * @command enableJaftingRefinement
 * @text Enable Refinement Option
 * @desc Enables the "refinement" option in the JAFTING mode selection window.
 */