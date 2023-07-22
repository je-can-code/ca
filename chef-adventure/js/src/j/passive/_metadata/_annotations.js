//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 PASSIVE] Grants passive states from various database objects.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables the ability to have a various database objects provide
 * passive effects in the form of states.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * All database objects with notes can now provide the effects of a state
 * within a given scope (usually just a single battler, but in some cases the
 * whole party) to the target by having or equipping said objects. Passive
 * states are simply states that are perpetually in effect while the condition
 * is met, that condition varying depending on the tag.
 *
 * ============================================================================
 * PASSIVE STATES:
 * Have you ever wanted a battler to be able to be in possession of some object
 * like a skill or equipment, and have that object grant passive effects? Well
 * now you can! By adding the correct tags to the various database objects, you
 * too can have passive states!
 *
 * DETAILS:
 * The means of application are specific to what type of database object the
 * tag lives on, as well as the scope of the effect.
 *
 * DETAILS ON-SKILL:
 * If the tag lives on a skill, then the battler only needs to know the skill
 * for it to apply the passive state(s).
 * The effects of this are applied to the battler that knows the skill.
 *
 * DETAILS ON-ITEM/WEAPON/ARMOR:
 * If the tag lives on an item/weapon/armor, then the party only needs to have
 * the object in their possession for it to apply the passive state(s).
 * The effects for this are applied to the entire party.
 *
 * DETAILS ON-ACTOR/ENEMY:
 * If the tag lives on an actor/class/enemy, then the actor or enemy would only
 * need to exist for it to apply the passive state(s).
 * The effects for this are applied only to the battler the tag is on.
 *
 * DETAILS ON-CLASS:
 * If the tag lives on a class, then an actor would need the class to be
 * currently applied for it to apply the passive state(s).
 * The effects for this are applied only to the actor using the class.
 *
 * DETAILS ON-STATE:
 * If the tag lives on a state, then the battler would need to be afflicted
 * with the given state in order to apply the passive state(s).
 * The effects for this are applied only to the battler afflicted with the
 * original state bearing the tag.
 *
 * DETAILS "EQUIPPED" TAG FORMATS:
 * If the "equipped" version of the tags live on an equip, the effects of the
 * passive state(s) will only be applied while it is equipped.
 * The effects for this are applied only to the actor using the class.
 *
 * NOTE ABOUT ADDING/REMOVING PASSIVE STATES:
 * Any states that are added in this manner are tracked as "passive", and thus
 * always active regardless of duration specifications in the database. These
 * states also cannot be removed, cannot be applied/re-applied by normal means
 * while possessing a passive state id of the same state.
 *
 * NOTE ABOUT JABS INTERACTIONS:
 * If using JABS with this plugin, it is important to keep in mind that all
 * formula-based slip effects will use the afflicted battler as both the
 * source AND target battlers in the context of "a" and "b" in the formula.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Enemies
 * - Skills
 * - Items
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <passive:[STATE_IDS]>
 *  <uniquePassive:[STATE_IDS]>
 *  <equippedPassive:[STATE_IDS]>
 *  <uniqueEquippedPassive:[STATE_IDS]>
 * Where STATE_IDS is a comma-delimited list of state ids to be applied.
 *
 * TAG EXAMPLES:
 *  <passive:[10]>
 * If the battler has possession of a database object with this tag, then the
 * state of id 10 is applied.
 *
 *  <passive:[10,11,12]>
 * If the battler has possession of a database object with this tag, then the
 * state ids of 10, 11, and 12, will all be applied.
 *
 *  <passive:[10]>
 *  <passive:[10,11,12]>
 * If a battler had two separate database objects in their possession each
 * bearing one of the above two tags, then the state id of 10 would be applied
 * twice, while 11, 12, and 13 would be applied only once.
 *
 *  <uniquePassive:[10]>
 *  <passive:[10,11,12]>
 * If a battler had two separate database objects in their possession each
 * bearing one of the above two tags, then the state id of 10 would be applied
 * once due to uniqueness, along with 11 and 12 being applied once, too.
 *
 *  <equippedPassive:[10,11]>
 * If the battler has a piece of equipment equipped with this tag, then the
 * state ids of 10 and 11 would be applied. If the battler did not have this
 * equipment equipped, it would do nothing.
 *
 *  <uniqueEquippedPassive:[10]>
 *  <equippedPassive:[10,11,12]>
 * If a battler had two separate equipped equips each bearing one of the above
 * two tags, then the state id of 10 would be applied once due to uniqueness,
 * along with 11 and 12 being applied once, too.
 *
 * ============================================================================
 * CHANGELOG:
 * - 2.0.0
 *    Refactored the entire passive state implementation.
 *    Added passive states for all database objects with notes.
 *    Added support for only-while-equipped passive states.
 * - 1.1.0
 *    Added passives for items/weapons/armors as well.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion Introduction