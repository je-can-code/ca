//region Introduction
/*:
 * @target MZ
 * @plugindesc [v1.3.1 ELEM] Enables greater control over elements.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * ============================================================================
 * This plugin enables the ability to modify skills with note tags to to
 * further control a skill's elemental properties in the context of battle.
 *
 * By overwriting the .calcElementRate() function, we have added new
 * functionality to elemental processing:
 * - Skills can now possess more than one element.
 * - Elements can now be absorbed.
 * - Elements can now be boosted.
 * - Actors/Enemies can now whitelist effective elements.
 *
 * NOTE:
 * Combining multiple elements together is done multiplicatively for all
 * the various operations below.
 * ============================================================================
 * ADDITIONAL ELEMENTS:
 * Have you ever wanted a skill to be both fire and ice typed? Well now you
 * can! By applying the appropriate tag to the skill(s) in question, you can
 * add one or more "attack elements" to a given skill.
 *
 * NOTE:
 * If you use "normal attack" as the base element on a skill, you will apply
 * all elements that your normal attack should include AND all elements you
 * add with this tag.
 *
 * TAG USAGE:
 * - Skills Only
 *
 * TAG FORMAT:
 *  <attackElements:[NUM]>          (for one extra element)
 *  <attackElements:[NUM,NUM,...]>  (for many extra elements)
 *
 * TAG EXAMPLE(S):
 *  <attackElements:[22]>
 * Adds the element of 22 to the skill, in addition to any other attack
 * elements the skill has.
 *
 *  <attackElements:[1,2,5]>
 * Adds elements 1, 2, and 5 to the skill, in addition to any other attack
 * elements the skill has.
 * ============================================================================
 * ABSORB ELEMENTS:
 * Have you ever wanted a battler to completely absorb lightning type skills?
 * Well now you can! By applying the appropriate note tag to the various
 * database locations applicable, you can absorb one or more "absorb elements"
 * from anything that performs elemental calculations (mostly skills/items).
 *
 * DETAILS:
 * When a skill lands on a battler, all relevant notes will be checked to see
 * if the incoming skill elements have any overlap with the elements that this
 * battler absorbs. If there are ANY elements absorbed, then all non-absorbed
 * elements will be removed from consideration and all elements being absorbed
 * will have their rates multiplied together. Absorption is prioritized over
 * handling elements with 0% rate (null elements).
 *
 * EXAMPLE 1:
 * If an enemy was weak to fire, but absorbed ice, and you hit them with a
 * fire+ice element skill, the weakness would be ignored and the skill would
 * be absorbed at the rate provided for ice.
 *
 * EXAMPLE 2:
 * If an enemy was immune to fire, but absorbed ice, and you hit them with a
 * fire+ice element skill, the immunity would be ignored, and the skill would
 * be absorbed at the rate provided.
 *
 * EXAMPLE 3:
 * If an enemy absorbed both fire at 200% (or no rate specified) and ice at
 * the rate of 300%, and you hit them with a fire+ice element skill, the
 * rates would be multiplied together and the rate would be 600% damage
 * absorbed.
 *
 * NOTE:
 * Defining the same element on two different sources does nothing extra.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <absorbElements:[NUM]>          (for one absorbed element)
 *  <absorbElements:[NUM,NUM,...]>  (for many absorbed elements)
 * Where NUM is the element id from the "types" tab.
 *
 * TAG EXAMPLES:
 *  <absorbElements:[4]>
 * This battler now absorbs element id of 4.
 *
 *  <absorbElements:[10,18]>
 * This battler now absorbs elements 10 and 18.
 *
 *  <absorbElements:[3,7]> on battler (either actor or enemy)
 *  <absorbElements:[4,7,9,12]> on armor (only applicable to actors)
 *  <absorbElements:[10]> on state
 * This actor now absorbs elements 3, 4, 7, 9, 10, and 12.
 * ============================================================================
 * BOOST ELEMENTS:
 * Have you ever wanted a battler to temporarily (or permanently) become more
 * effective with skills of a particular element? Well now you can! By applying
 * the appropriate note tag to the various database locations applicable, you
 * can "boost" one or more elements (more requires multiple tags) by as little
 * or as much as your heart desires!
 *
 * DETAILS:
 * When a skill's elemental calculation is performed, all relevant notes will
 * be checked to see if the the caster has any boosts for any of the elements
 * that a skill possesses. If there are ANY elemental boosts found, it applies
 * to the total damage that would've been dealt. The general use case for this
 * tag would be to give an actor/enemy a passive bonus to a particular element
 * that the actor/enemy would have access to cast in some way.
 *
 * NOTE:
 * Absorb and null and strict rules still apply!
 *
 * EXAMPLE 1:
 * If a skill has element id 1 on it, and the caster has a tag on it that
 * boosts element 1 by 30%, then that skill would deal 130% of its original
 * damage.
 *
 * EXAMPLE 2:
 * If a skill has multiple elements 1, 2, and 3 on it, and the caster has a tag
 * that boosts element 2 by 50% and element 3 by 50%, then the result would be
 * the product of the two resulting in the skill dealing 225% of its original
 * damage.
 *
 * TAG USAGE:
 * - Actors
 * - Enemies
 * - Weapons
 * - Armors
 * - Skills
 * - States
 * - Classes
 *
 * TAG FORMAT:
 *  <boostElement:[ELEMENT_ID, PERCENT_BOOST]>
 * PERCENT_BOOST accepts negative numbers too, for a penalty instead of a boost.
 * Repeatable — one tag per boosted element.
 *
 * TAG EXAMPLES:
 *  <boostElement:[1, 50]>
 * This battler has a +50% boost to skills bearing element id 1.
 *
 *  <boostElement:[1, -30]>
 * This battler deals 30% LESS damage with skills bearing element id 1- useful
 * for a curse/debuff state rather than a buff.
 *
 * ============================================================================
 * STRICT ELEMENTS:
 * Have you ever wanted a battler to be completely immunte to all elemental
 * damage with the exception of just one or more elements? Well now you can!
 * By applying the appropriate note tag to the various database locations
 * applicable, you can restrict incoming damage to be limited to only a
 * subset of the available elements.
 *
 * DETAILS:
 * All sources are checked and a list of all "strict" elements are combined
 * to define for a given battler. Effectively, this is a whitelist of all
 * elements a battler can be hurt by. If there are no tags found on any
 * sources, then all elements are added to the list as a default. Similar
 * to absorption, only the elements that a skill has that overlap with the
 * "strict" elements of a battler are considered for calculation.
 *
 * NOTE:
 * Defining the same element on two different sources does nothing extra.
 * Additionally, this effect could also be done without this plugin by just
 * adding a 0%-rate for all elements except the one you want, but if you
 * have a ton of elements, that might get unwieldly, which is the exact
 * reason I created this functionality.
 *
 * TAG USAGE:
 * - Actors
 * - Enemies
 * - Weapons
 * - Armors
 * - States
 * - Classes
 *
 * TAG FORMAT:
 *  <strictElements:[NUM]>          (for one strict element)
 *  <strictElements:[NUM,NUM,...]>  (for many strict elements)
 *
 * TAG EXAMPLES:
 *  <strictElements:[8]>
 * This battler now can only receive damage from skills with element id of 8.
 *
 *  <strictElements:[3,5,6]>
 * This battler now can only receive damage from skills that include the
 * element id of 3, 5, or 6.
 *
 *  <strictElements:[1,2,3,4,5,6]> on state applied to battler.
 *  <strictElements:[1,8]> on battler (either actor or enemy).
 * This battler now can only receive damage from skills that include the
 * element id of 1, 2, 3, 4, 5, 6, or 8.
 * ============================================================================
 * PIERCE ELEMENTS:
 * Have you ever wanted a battler to partially ignore an enemy's elemental
 * resistance — punching through fire immunity to deal real damage? Well now
 * you can! By applying the appropriate tag(s) to any notetag source, you can
 * reduce the target's effective element rate for one or more elements,
 * nudging it toward neutral (1.0x) damage.
 *
 * DETAILS:
 * When a skill's elemental calculation is performed, all relevant pierce tags
 * are summed for the element being used. The target's effective rate is then
 * raised by that sum, capped at 1.0 (neutral). Pierce never turns a resistance
 * into a weakness, and it never affects elements the target is already weak to
 * or absorbs.
 *
 * Two scopes are available:
 *
 *   pierceElement tags are read from the ATTACKER's full getAllNotes() sources
 *   (actor, class, equips, states, and learned skills). If placed on a skill,
 *   the attacker passively benefits from the pierce on ALL skills they cast for
 *   as long as they know that skill.
 *
 *   thisPierceElement tags are read from the SKILL being cast RIGHT NOW only.
 *   This is the right tag when the pierce should only apply to one specific
 *   attack rather than granting a global passive benefit.
 *
 * EXAMPLE 1:
 * Target has 0% fire rate (immune). Attacker has 50 total fire pierce.
 * Effective rate = min(1.0, 0.0 + 0.50) = 0.50 → target takes 50% fire damage.
 *
 * EXAMPLE 2:
 * Target has 50% fire rate (resistant). Attacker has 30 fire pierce.
 * Effective rate = min(1.0, 0.50 + 0.30) = 0.80 → target takes 80% fire damage.
 *
 * EXAMPLE 3:
 * Target has 200% fire rate (weak). Pierce is irrelevant — weakness unchanged.
 *
 * EXAMPLE 4:
 * Target absorbs fire. Pierce is irrelevant — absorption unchanged.
 *
 * NOTE:
 * Multiple pierce tags on the same element are summed together. A state with
 * <pierceElement:[4, 30]> and an armor with <pierceElement:[4, 20]> together
 * give 50 total pierce on element 4.
 *
 * TAG USAGE (pierceElement — global, any skill):
 * - Actors
 * - Enemies
 * - Classes
 * - Skills (knowing the skill passively grants the pierce to all casts)
 * - Weapons
 * - Armors
 * - States
 *
 * TAG USAGE (thisPierceElement — this skill only):
 * - Skills only
 *
 * TAG FORMAT:
 *  <pierceElement:[ELEMENT_ID, PIERCE_PERCENT]>
 *  <thisPierceElement:[ELEMENT_ID, PIERCE_PERCENT]>
 * Where ELEMENT_ID is the numeric element id from the Types tab,
 * and PIERCE_PERCENT is an integer (30 = 30 pierce, raising effective rate by 0.30).
 *
 * TAG EXAMPLES:
 *  <pierceElement:[4, 30]>
 * The attacker pierces 30% of the target's fire (element 4) resistance on all skills.
 * If placed on a passive mastery state, it is always active while the state is applied.
 *
 *  <pierceElement:[4, 50]> on actor, <pierceElement:[4, 20]> on equipped ring:
 * Combined 70 fire pierce. A fully immune target takes 70% fire damage.
 *
 *  <thisPierceElement:[4, 100]>
 * Only when casting THIS specific skill does it fully pierce fire immunity.
 * Other skills the caster uses are unaffected.
 *
 *  <thisPierceElement:[4, 40]> combined with <pierceElement:[4, 30]> from a state:
 * 70 total fire pierce on this skill (40 skill-specific + 30 passive global).
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.3.1
 *    Fixed Game_Actor#elementRate capturing its own original into the actor
 *    alias map and then invoking the enemy's chain instead. Harmless only by
 *    coincidence, since vanilla defines elementRate on Game_BattlerBase alone
 *    and both maps held the same inherited function; the moment either
 *    subclass gained its own, actors would have silently run the enemy's.
 * - 1.3.0
 *    Changed <boostElement:ELEMENT_ID:PERCENT_BOOST> to <boostElement:[ELEMENT_ID, PERCENT_BOOST]>.
 *    The old colon-separated shape required a bespoke, ad-hoc capture-group reader
 *    (RPGManager.getAllCapturesFromNoteByRegex) instead of the standardized bracket-array
 *    family used by every other multi-value tag; the bracket form now reads through
 *    getArraysFromNotesByRegex like the rest. Existing game data must be migrated.
 * - 1.2.0
 *    evalDamageFormula now delegates formula evaluation to Game_Action#evalFormulaWithContext.
 *    The hardcoded p (proficiency) setup and J.PROF conditional block have been removed;
 *    J-Proficiency registers p independently via Game_Action.registerFormulaContext.
 *    All registered context variables (p, s, and any future additions) are automatically
 *    available in damage formulas without J-Elementalistics needing to know about them.
 * - 1.1.0
 *    Added resistance piercing via pierceElement and thisPierceElement tags.
 *    Pierce applies to the target's base element rate before the attacker's
 *    boost multiplier, nudging resistances toward neutral (1.0). Weaknesses
 *    and absorbed elements are never affected.
 * - 1.0.1
 *    Consumed `RPGManager` updates.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */

//#region src/plugins/elem/core/_metadata/_pluginMetadata.js
var J_ElementalisticsPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/elem/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ELEM = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.ELEM.Metadata = new J_ElementalisticsPluginMetadata("J-Elementalistics", "1.3.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.ELEM.Aliased = {
	Game_Action: new Map(),
	Game_Actor: new Map(),
	Game_Enemy: new Map()
};
J.ELEM.RegExp = {};
J.ELEM.RegExp.AttackElementIds = /<attackElements:[ ]?(\[[\d, ]+])>/i;
J.ELEM.RegExp.AbsorbElementIds = /<absorbElements:[ ]?(\[[\d, ]+])>/i;
J.ELEM.RegExp.StrictElementIds = /<strictElements:[ ]?(\[[\d, ]+])>/i;
J.ELEM.RegExp.BoostElement = /<boostElement:[ ]?(\[\d+,[ ]?-?\+?\d+])>/gi;
J.ELEM.RegExp.PierceElement = /<pierceElement:[ ]?(\[\d+,[ ]?\d+])>/gi;
J.ELEM.RegExp.ThisPierceElement = /<thisPierceElement:[ ]?(\[\d+,[ ]?\d+])>/gi;

//#endregion
//#region src/plugins/elem/core/objects/Game_Battler.js
/**
* Determines whether or not a given element id is absorbed by this battler.
* @param {number} elementId The element id.
* @returns {boolean}
*/
Game_Battler.prototype.isElementAbsorbed = function(elementId) {
	return this.elementsAbsorbed().includes(elementId);
};
/**
* Determines whether or not a given element id can affect this battler in the
* context of "strict" elements. If the target has no strict elements, then this
* will automatically return true. Otherwise, it'll check elements.
* @param {number} elementId The element id.
* @returns {boolean}
*/
Game_Battler.prototype.isElementStrict = function(elementId) {
	const strict = this.strictElements();
	if (!strict.length) {
		return true;
	}
	return strict.includes(elementId);
};
/**
* Gets all elements this battler absorbs.
* @returns {number[]}
*/
Game_Battler.prototype.elementsAbsorbed = function() {
	return [];
};
/**
* Gets all absorbed element ids from a given object on this battler.
*
* @param {RPG_BaseItem} databaseObject The database data object.
* @returns {number[]}
*/
Game_Battler.prototype.extractAbsorbedElements = function(databaseObject) {
	return RPGManager.getNumbersFromNoteByRegex(databaseObject, J.ELEM.RegExp.AbsorbElementIds);
};
/**
* Gets the strict elements for this battler, if any.
* "Strict" elements are the only elements this battler can be affected by.
*
* If none are found, the default is all elements (to negate this feature).
* @returns {number[]}
*/
Game_Battler.prototype.strictElements = function() {
	return $dataSystem.elements.map((_, index) => index);
};
/**
* Gets the strict element ids from a given object on this battler.
*
* @param {RPG_BaseItem} databaseObject The database data object.
* @returns {number[]}
*/
Game_Battler.prototype.extractStrictElements = function(databaseObject) {
	return RPGManager.getNumbersFromNoteByRegex(databaseObject, J.ELEM.RegExp.StrictElementIds);
};
/**
* Gets the element rate boost for this element for this battler.
* @param {number} elementId The element id to check.
*/
Game_Battler.prototype.elementRateBoost = function(elementId) {
	return 1;
};
/**
* Gets the element boosts associated with the provided element id.
* @param {RPG_BaseItem} referenceData The reference data with a note to parse.
* @returns {[number, number][]}
*/
Game_Battler.prototype.extractElementRateBoosts = function(referenceData) {
	if (!referenceData.note) return [];
	return RPGManager.getArraysFromNotesByRegex(referenceData, J.ELEM.RegExp.BoostElement);
};

//#endregion
//#region src/plugins/elem/core/objects/Game_Actor.js
/**
* Modifies the element rate to accommodate elemental absorption tags on an actor.
*/
J.ELEM.Aliased.Game_Actor.set("elementRate", Game_Actor.prototype.elementRate);
Game_Actor.prototype.elementRate = function(elementId) {
	const baseRate = J.ELEM.Aliased.Game_Actor.get("elementRate").call(this, elementId);
	const isAbsorbed = this.isElementAbsorbed(elementId) ? -1 : 1;
	return baseRate * isAbsorbed;
};
/**
* Gets all elements this actor absorbs.
* @returns {number[]}
*/
Game_Actor.prototype.elementsAbsorbed = function() {
	const objectsToCheck = this.getAllNotes();
	const absorbed = [];
	objectsToCheck.forEach((referenceData) => {
		const elementsFromObject = this.extractAbsorbedElements(referenceData);
		absorbed.push(...elementsFromObject);
	});
	return absorbed;
};
/**
* Gets the only elements this actor can be affected by.
* @returns {number[]}
*/
Game_Actor.prototype.strictElements = function() {
	const objectsToCheck = this.getAllNotes();
	const strict = [];
	objectsToCheck.forEach((referenceData) => {
		const elementsFromObject = this.extractStrictElements(referenceData);
		strict.push(...elementsFromObject);
	});
	if (!strict.length) {
		strict.push(...Game_Battler.prototype.strictElements.call(this));
	}
	return strict;
};
/**
* Gets the element rate boost for this element for this battler.
* @param {number} elementId The element id to check.
* @returns {number}
*/
Game_Actor.prototype.elementRateBoost = function(elementId) {
	const objectsToCheck = this.getAllNotes();
	const boosts = [];
	objectsToCheck.forEach((referenceData) => {
		const boost = this.extractElementRateBoosts(referenceData);
		if (!boost.length) return;
		boosts.push(...boost);
	});
	const filteredBoosts = boosts.filter((boost) => {
		return boost[0] === elementId;
	});
	const factoredBoosts = filteredBoosts.map((boost) => boost[1] / 100);
	return factoredBoosts.reduce((previousAmount, nextAmount) => previousAmount + nextAmount, 1);
};

//#endregion
//#region src/plugins/elem/core/objects/Game_Enemy.js
/**
* Modifies the element rate to accommodate elemental absorption tags on an actor.
*/
J.ELEM.Aliased.Game_Enemy.set("elementRate", Game_Enemy.prototype.elementRate);
Game_Enemy.prototype.elementRate = function(elementId) {
	const baseRate = J.ELEM.Aliased.Game_Enemy.get("elementRate").call(this, elementId);
	const isAbsorbed = this.isElementAbsorbed(elementId) ? -1 : 1;
	return baseRate * isAbsorbed;
};
/**
* Gets all elements this enemy absorbs.
* @returns {number[]}
*/
Game_Enemy.prototype.elementsAbsorbed = function() {
	const objectsToCheck = this.getAllNotes();
	const absorbed = [];
	objectsToCheck.forEach((referenceData) => {
		const elementsFromObject = this.extractAbsorbedElements(referenceData);
		absorbed.push(...elementsFromObject);
	});
	return absorbed;
};
/**
* Gets the only elements this enemy can be affected by.
* @returns {number[]}
*/
Game_Enemy.prototype.strictElements = function() {
	const objectsToCheck = this.getAllNotes();
	const strict = [];
	objectsToCheck.forEach((referenceData) => {
		const elementsFromObject = this.extractStrictElements(referenceData);
		strict.push(...elementsFromObject);
	});
	if (!strict.length) {
		strict.push(...Game_Battler.prototype.strictElements.call(this));
	}
	return strict;
};
/**
* Gets the element rate boost for this element for this enemy.
* @param {number} elementId The element id to check.
* @returns {number}
*/
Game_Enemy.prototype.elementRateBoost = function(elementId) {
	const objectsToCheck = this.getAllNotes();
	const boosts = [];
	objectsToCheck.forEach((referenceData) => {
		const boost = this.extractElementRateBoosts(referenceData);
		if (!boost.length) return;
		boosts.push(...boost);
	});
	const filteredBoosts = boosts.filter((boost) => {
		return boost[0] === elementId;
	});
	const factoredBoosts = filteredBoosts.map((boost) => boost[1] / 100);
	const boostAmount = factoredBoosts.reduce((previousAmount, nextAmount) => previousAmount + nextAmount, 1);
	return boostAmount;
};

//#endregion
//#region src/plugins/elem/core/objects/Game_Action.js
/**
* Overwrites {@link #calcElementRate}.<br/>
* Calculates the elemental rates of this action against the designated target.
* @param {Game_Actor|Game_Enemy} target The target of this action.
* @returns {number} The multiplier from elemental affiliation.
*/
Game_Action.prototype.calcElementRate = function(target) {
	const elements = this.getApplicableElements(target);
	if (elements.includes(0)) {
		return 1;
	}
	const targetStrictElements = target.strictElements();
	const attackElements = elements.filter((elementId) => targetStrictElements.includes(elementId));
	let factor;
	switch (attackElements.length) {
		case 0:
			factor = 0;
			break;
		case 1:
			factor = this.calculateBoostRate(attackElements[0], target);
			break;
		default:
			factor = this.multipleElementalRates(target, attackElements);
			break;
	}
	return factor;
};
/**
* Gets the raw element rate of this action against a particular target.
* @param {Game_Actor|Game_Enemy} target The target of this action.
* @returns {number} The non-caster-buffed elemental rate.
*/
Game_Action.prototype.calculateRawElementRate = function(target) {
	const elements = this.getApplicableElements(target);
	const result = this.calculateMultipleRawElementalRate(target, elements);
	return result;
};
/**
* Gets all applicable element ids that this action could have against this target.
* @param {Game_Battler} target The target battler to check elemental applicability.
* @returns {number[]} The list of element ids that this action has that are valid against the target.
*/
Game_Action.prototype.getApplicableElements = function(target) {
	const skillOrItem = this.item();
	const baseElement = skillOrItem.damage.elementId;
	const elements = [baseElement];
	const addedElements = Game_Action.extractElementsFromAction(skillOrItem);
	elements.push(...addedElements);
	const caster = this.subject();
	if (baseElement === -1) {
		elements.push(...caster.attackElements());
	}
	if (elements.includes(0)) {
		return [0];
	}
	const targetStrictElements = target.strictElements();
	const restrictedElements = elements.filter((attackElementId) => targetStrictElements.includes(attackElementId));
	return restrictedElements;
};
/**
* Extracts all extra attack elements from a skill's notes.
* @param {RPG_UsableItem} databaseObject The database object of this action.
* @returns {number[]} The additional attack elements.
*/
Game_Action.extractElementsFromAction = function(databaseObject) {
	return RPGManager.getNumbersFromNoteByRegex(databaseObject, J.ELEM.RegExp.AttackElementIds);
};
/**
* Calculates the elemental rate of this action against a specific target.
*
* It is important to recognize that we are working with three different number types
* in here: One is for "rates", which are positive integers that represent the
* already-calculated elemental rate of the target. The second is "factor form" as
* I call it, which represents the end result multiplier that this function returns.
* It is a direct multiplier that is applied to damage, so it should be a decimal
* typically ranging between 0.00 and maybe as high as 10.00. The third number is
* simply the element id that hasn't been calculated yet. These are used to start
* so you can calculate the rates of the action's elements against the target.
* @param {Game_Actor|Game_Enemy} target The target to calculate against.
* @param {number[]} elements The collection of elements we're attacking with.
* @returns {number} The decimal elemental rate.
*/
Game_Action.prototype.multipleElementalRates = function(target, elements) {
	const antiNullElementIds = this.getAntiNullElementIds();
	const hasAntiNullElementIds = antiNullElementIds.some((elementId) => elements.includes(elementId));
	if (hasAntiNullElementIds) {
		return this.calculateAntiNullElementalRate(target, elements);
	}
	const hasAbsorbRate = target.elementsAbsorbed().some((absorbed) => elements.includes(absorbed));
	if (hasAbsorbRate) {
		return this.calculateAbsorbRate(target, elements);
	}
	const hasNullRate = elements.some((attackElementId) => this.calculateBoostRate(attackElementId, target) === 0);
	if (hasNullRate) {
		return this.calculateNullRate(target, elements);
	}
	return this.calculateMultipleElementalRate(target, elements);
};
/**
* Calculates the anti-null elemental rate for the target in relation to the set of elements.
*
* If an attack element is present in
* @param {Game_Actor|Game_Enemy} target The target of this action.
* @param {number[]} attackElements The attacking list of elements.
* @returns {number} The "factor form" of the rate.
*/
Game_Action.prototype.calculateAntiNullElementalRate = function(target, attackElements) {
	const filtering = (attackElementId) => !(this.calculateBoostRate(attackElementId, target) === 0);
	const filteredElements = attackElements.filter(filtering);
	if (!filteredElements.length) return 1;
	const reducer = (value, attackElementId) => value * this.calculateBoostRate(attackElementId, target);
	const nonNullRate = filteredElements.reduce(reducer, 1);
	return nonNullRate;
};
/**
* Calculates the elemental rate for the target in relation to the set of elements.
*
* Though this implicitly handles 0-rate elements, it does not handle it explicitly,
* nor does it handle absorbed elements.
* @param {Game_Actor|Game_Enemy} target The target of this action.
* @param {number[]} attackElements The attacking list of elements.
* @returns {number} The "factor form" of the rate.
*/
Game_Action.prototype.calculateMultipleElementalRate = function(target, attackElements) {
	return attackElements.map((attackElementId) => this.calculateBoostRate(attackElementId, target), this).reduce((previousRate, currentRate) => previousRate * currentRate, 1);
};
/**
* Calculates the elemental rate for the target in relation to the set of elements.
*
* Though this implicitly handles 0-rate elements, it does not handle it explicitly,
* nor does it handle absorbed elements.
*
* This does not factor in the attacker's boost rates, only the raw elemental affiliations.
* @param {Game_Actor|Game_Enemy} target The target of this action.
* @param {number[]} attackElements The attacking list of elements.
* @returns {number} The "factor form" of the rate.
*/
Game_Action.prototype.calculateMultipleRawElementalRate = function(target, attackElements) {
	return attackElements.map((attackElementId) => target.elementRate(attackElementId), this).reduce((previousRate, currentRate) => previousRate * currentRate, 1);
};
/**
* Calculates the element's rate including applicable boosts and resistance piercing.
*
* This is effectively a wrapper around `target.elementRate(elementId)` that
* also includes all of our elemental boosts from various notes around the
* battlers, and now also applies resistance piercing before the boost multiplication.
* @param {number} attackElementId The element id.
* @param {Game_Actor|Game_Enemy} target The target being hit.
* @returns {number}
*/
Game_Action.prototype.calculateBoostRate = function(attackElementId, target) {
	const attacker = this.subject();
	const baseRate = target.elementRate(attackElementId);
	const piercedRate = this.applyElementPierce(attackElementId, target, baseRate);
	const elementBoostRate = attacker.elementRateBoost(attackElementId);
	return piercedRate * elementBoostRate;
};
/**
* Applies resistance piercing to a target's base element rate for a given element.
*
* Pierce nudges the rate toward 1.0 (neutral damage), hard-capped there.
* Weaknesses (rate >= 1.0) and absorbed elements are never affected.
* @param {number} attackElementId The element id being checked.
* @param {Game_Actor|Game_Enemy} target The target whose resistance may be pierced.
* @param {number} baseRate The raw element rate from the target's traits.
* @returns {number} The pierced element rate, or the original if pierce does not apply.
*/
Game_Action.prototype.applyElementPierce = function(attackElementId, target, baseRate) {
	if (baseRate >= 1) return baseRate;
	if (target.elementsAbsorbed().includes(attackElementId)) return baseRate;
	const totalPierce = this.getTotalElementPierce(attackElementId);
	if (totalPierce <= 0) return baseRate;
	return Math.min(1, baseRate + totalPierce);
};
/**
* Sums all element pierce contributions for the given element from two sources:
*  - {@code pierceElement} tags on the attacker's full getAllNotes() collection (global/passive).
*  - {@code thisPierceElement} tags on the specific skill being cast right now (skill-only).
* @param {number} attackElementId The element id to sum pierce for.
* @returns {number} Total pierce as a decimal rate (e.g. 0.30 for 30 pierce percent).
*/
Game_Action.prototype.getTotalElementPierce = function(attackElementId) {
	const attacker = this.subject();
	let totalPercent = 0;
	for (const source of attacker.getAllNotes()) {
		const pairs = RPGManager.getArraysFromNotesByRegex(source, J.ELEM.RegExp.PierceElement);
		for (const pair of pairs) {
			if (Array.isArray(pair) && pair.length === 2 && Number(pair[0]) === attackElementId) {
				totalPercent += Number(pair[1]);
			}
		}
	}
	const skillPairs = RPGManager.getArraysFromNotesByRegex(this.item(), J.ELEM.RegExp.ThisPierceElement);
	for (const pair of skillPairs) {
		if (Array.isArray(pair) && pair.length === 2 && Number(pair[0]) === attackElementId) {
			totalPercent += Number(pair[1]);
		}
	}
	return totalPercent / 100;
};
/**
* Calculates the absorb rate for the target in relation to a set of elements.
* @param {Game_Actor|Game_Enemy} target The target of this action.
* @param {number[]} attackElements The attacking list of elements.
* @returns {number} The "factor form" of the rate.
*/
Game_Action.prototype.calculateAbsorbRate = function(target, attackElements) {
	const reducer = (previousRate, currentRate) => previousRate * currentRate;
	const filteredAbsorbedIds = target.elementsAbsorbed().filter((absorbed) => attackElements.includes(absorbed));
	const absorbRates = filteredAbsorbedIds.map((attackElementId) => this.calculateBoostRate(attackElementId, target), this);
	const absorbRate = absorbRates.reduce(reducer, 1);
	return absorbRate;
};
/**
* Calculates the null rate for the target in relation to a set of elements.
* @param {Game_Actor|Game_Enemy} target The target of this action.
* @param {number[]} attackElements The attacking list of elements.
* @returns {number} The "factor form" of the rate.
*/
Game_Action.prototype.calculateNullRate = function(target, attackElements) {
	return 0;
};
/**
* If these elements are present in an elementId collection, then the calculation
* will omit any 0 rate elements.
* @returns {number[]} The ids to cause us to strip out all nulls.
*/
Game_Action.prototype.getAntiNullElementIds = function() {
	return [];
};
/**
* Overwrites {@link #evalDamageFormula}.<br/>
* Evaluates the damage formula provided by the dev to determine the damage.
* This also factors in elemental absorption for sign and floor handling.
* Formula evaluation is delegated to {@link Game_Action#evalFormulaWithContext}
* so all registered context variables (p, s, …) are available automatically.
* @param {Game_Actor|Game_Enemy} target The target battler; the `b` of the formula.
* @returns {number} The calculated damage value.
*/
Game_Action.prototype.evalDamageFormula = function(target) {
	const item = this.item();
	const attackElements = Game_Action.extractElementsFromAction(item).concat(item.damage.elementId);
	const absorbedElements = target.elementsAbsorbed();
	const targetAbsorbs = attackElements.some((elementId) => absorbedElements.includes(elementId));
	const a = this.subject();
	const b = target;
	const sign = this.healingFactor(targetAbsorbs);
	try {
		const raw = this.evalFormulaWithContext(item.damage.formula, a, b);
		let value = 0;
		if (targetAbsorbs) {
			value = raw * sign;
		} else {
			value = Math.max(raw, 0) * sign;
		}
		return isNaN(value) ? 0 : value;
	} catch (e) {
		console.warn(`Error with the damage formula for item/skill id: ${item.id}.`);
		console.warn(item);
		console.error(e);
		return 0;
	}
};
/**
* Determines the healing factor, and also considers whether or not the target
* absorbs any of the action's elements (which would otherwise flip the sign).
*
* If the target absorbs any of the attack elements, then the `-1` is not applied,
* however, the limit is lifted from formula damage evaluation.
* @param {boolean} targetAbsorbs Whether or not the target absorbed this element.
*/
Game_Action.prototype.healingFactor = function(targetAbsorbs) {
	const isHealingAction = [3, 4].includes(this.item().damage.type);
	return isHealingAction && !targetAbsorbs ? -1 : 1;
};

//#endregion
//# sourceMappingURL=J-Elementalistics.js.map