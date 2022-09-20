//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 PASSIVE] Grants skills the ability to provide passive state effects.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @help
 * ============================================================================
 * This plugin enables the ability to have a skill provide passive effects just
 * by knowing the skill in the form of states.
 *
 * By extending the .traitObjects() function, we have added new functionality:
 * - Just knowing a skill can grant passive state effects.
 * - Just having an item/weapon/armor can grant passive state effects.
 *
 * ============================================================================
 * PASSIVE SKILL STATES:
 * Have you ever wanted a battler to be able to learn skills that grant passive
 * effects from states? Well now you can! By adding the correct tags to your
 * skills' notes in the database, you too can make your battlers learn passive
 * skills!
 *
 * NOTE:
 * Under the covers, this plugin scans all skills learned by the battler and
 * parses any of the listed state ids matching the tag format. Any states that
 * are added in this manner are tracked as "passive", and thus always active
 * regardless of duration specifications in the database. These states also
 * cannot be removed, cannot be applied/re-applied while possessing a
 * passive state id of the same state, and cannot be stacked.
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <passive:[NUM]>          (for one passive state)
 *  <passive:[NUM,NUM,...]>  (for many passive states)
 *
 * TAG EXAMPLES:
 *  <passive:[10]>
 * If this battler has learned this skill, then state of id 10 is applied
 * as a passive state.
 *
 *  <passive:[10,11,12]>
 * If a battler has learned this skill, then they will have states of id
 * 10, 11, and 12 applied as passive states.
 *
 *  <passive:[10]>
 *  <passive:[10,11,12]>
 * If a battler had two separate skills learned matching the above two tags,
 * then the states of id 10, 11, and 12 would be applied as passive states.
 * The duplicate 10 passive state would be ignored.
 *
 * ============================================================================
 * PASSIVE ITEMS/WEAPONS/ARMORS STATES:
 * Have you ever wanted the player's party to be able to gain passive effects
 * just by having an item in their possession? Well now you can! By adding the
 * correct tags to the various entries in the database, you too can make your
 * party gain passive effects from holding stuff! Additionally, unlike the
 * skill passives above, item passive effects will stack! If you have multiple
 * of the item with a non-unique passive on it, it'll stack that many times!
 *
 * NOTE ABOUT STACKING PASSIVES WITH UNIQUE:
 * Under the covers, this plugin will scan all currently owned items and equips
 * in search of the various passives tags. All unique tags are scanned and
 * added to the list first, then any stackable tags will be added if there are
 * no unique call outs first.
 *
 * NOTE ABOUT UNIQUE ITEMS WITH SKILL PASSIVES:
 * Unique passive states granted by items do not consider uniqueness in regards
 * to passive states granted by skills.
 *
 * TAG USAGE:
 * - Items
 * - Weapons
 * - Armors
 *
 * TAG FORMAT:
 *  <passive:[NUM]>                 (for one passive state)
 *  <passive:[NUM,NUM,...]>         (for many passive states)
 *  <uniquePassive:[NUM]>           (for one unique passive state)
 *  <uniquePassive:[NUM,NUM,...]>   (for many unique passive states)
 *
 * TAG EXAMPLES:
 *  <passive:[10]>
 * If this object is in the party's possession, then the state of id 10 will be
 * applied to the entire party at all times.
 *
 *  <passive:[10,11,12]>
 * If this object is in the party's possession, then all states ids of 10,11,12
 * will be applied to the entire party at all times.
 *
 *  <uniquePassive:[10]>
 * If this object is in the party's possession, then the party will have the
 * effects of exactly 1 instance of the state with id 10 at any given time. No
 * other items that grant passive state id 10 will apply.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Added passives for items as well.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */