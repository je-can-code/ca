//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PASSIVE] Grants skills the ability to provide passive state effects.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @help
 * ============================================================================
 * This plugin enables the ability to have a skill provide passive effects just
 * by knowing the skill in the form of states.
 *
 * By extending the .traitObjects() function, we have added new functionality:
 * - Just knowing a skill can grant a passive state effect.
 *
 * ============================================================================
 * PASSIVE SKILL STATES:
 * Have you ever wanted a battler to be able to have passive skills? Well now
 * you can! By applying the appropriate tag to the skill(s) in question, you
 * can add one or more "passive states" just by having the battler know the
 * skill!
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
 *  <passive:[NUM]>          (for one passive state on this skill)
 *  <passive:[NUM,NUM,...]>  (for many passive states on this skill)
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
 * ============================================================================
 */