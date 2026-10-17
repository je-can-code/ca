//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.5.0 ELEM] Enables greater control over elements.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * ============================================================================
 * Please refer to J-Elementalistics's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/elem/core/index.md
 * ============================================================================
 */
//endregion annotations

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
	const requiredBaseVersion = "4.0.0";
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
J.ELEM.Metadata = new J_ElementalisticsPluginMetadata("J-Elementalistics", "1.5.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.ELEM.Aliased = {
	Game_Action: new Map(),
	Game_Actor: new Map(),
	Game_Enemy: new Map(),
	Scene_Boot: new Map()
};
J.ELEM.RegExp = {};
J.ELEM.RegExp.AttackElementIds = /<attackElements:[ ]?(\[[\d, ]+])>/i;
J.ELEM.RegExp.AbsorbElementIds = /<absorbElements:[ ]?(\[[\d, ]+])>/i;
J.ELEM.RegExp.StrictElementIds = /<strictElements:[ ]?(\[[\d, ]+])>/i;
J.ELEM.RegExp.BoostElement = /<boostElement:[ ]?(\[\d+,[ ]?-?\+?\d+])>/gi;
J.ELEM.RegExp.PierceElement = /<pierceElement:[ ]?(\[\d+,[ ]?\d+])>/gi;
J.ELEM.RegExp.ThisPierceElement = /<thisPierceElement:[ ]?(\[\d+,[ ]?\d+])>/gi;
/**
* A bonus to damage dealt against targets belonging to a particular elemental family.
*
* Unlike every other tag in this table, this one is keyed on **what the target is** rather than on
* what the attack is made of. The attacker never has to carry the element to benefit- studying
* undead makes you better at killing undead regardless of what you are swinging.
*
* <pre>
* Structure:
*  <slayer:[ELEMENT_ID, PERCENT]>
*
* Example:
*  <slayer:[11, 50]>
*
* Translation:
*  Deal 50% more damage to targets weak to element 11.
* </pre>
* @type {RegExp}
*/
J.ELEM.RegExp.Slayer = /<slayer:[ ]?(\[\d+,[ ]?-?\+?\d+])>/gi;

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
/**
* The slayer bonuses this battler has learned, as raw `[ELEMENT_ID, PERCENT]` tuples.
*
* Read from every note-bearing source on the battler, so a bonus can be granted by a state, a piece
* of equipment, a class or the battler's own row without any of those needing to know about the
* others. In practice these land on states and accessories.
* @returns {[number, number][]}
*/
Game_Battler.prototype.slayerBonuses = function() {
	return RPGManager.getArraysFromAllNotesByRegex(this.getAllNotes(), J.ELEM.RegExp.Slayer);
};
/**
* Whether a target belongs to the elemental family named by an element id.
*
* Membership is read off the target's own innate element rates: something that takes extra damage
* from `vs Undead` is, by that fact, undead. Neutral is a rate of exactly one, so any authored
* weakness at all counts and no tuning threshold is needed to decide what something *is*.
* @param {Game_Actor|Game_Enemy} target The target whose family is in question.
* @param {number} elementId The element id naming the family.
* @returns {boolean}
*/
Game_Battler.prototype.isTargetInElementalFamily = function(target, elementId) {
	const rates = target.databaseData().elementRates();
	return rates[elementId] > 1;
};
/**
* The combined slayer multiplier this battler applies when striking a particular target.
*
* Every learned bonus whose family the target belongs to contributes, and they compound- two
* separate 50% sources against the same target produce 2.25x rather than 2x. That matches how
* {@link Game_Battler#elementRateBoost} and the elemental rates themselves already stack, so a
* player who has studied a family from two directions is never surprised by the arithmetic.
*
* Answers exactly `1` when nothing applies, which is the identity for the multiplication it feeds.
* @param {Game_Actor|Game_Enemy} target The target being struck.
* @returns {number} The multiplier to apply on top of all other damage math.
*/
Game_Battler.prototype.slayerMultiplierAgainst = function(target) {
	const bonuses = this.slayerBonuses();
	return bonuses.reduce((multiplier, [elementId, percent]) => {
		if (this.isTargetInElementalFamily(target, elementId) === false) return multiplier;
		const bonusFactor = 1 + percent / 100;
		return multiplier * bonusFactor;
	}, 1);
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
		Diagnostics.error("J-Elementalistics", `error with the damage formula for item/skill id: ${item.id}.`, {
			item,
			error: e
		});
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
/**
* Extends {@link #makeDamageValue}.<br/>
* Also applies the attacker's slayer bonus against the target's elemental family.
*
* This deliberately sits outside every other piece of damage math rather than inside the elemental
* calculation, because a slayer bonus is not an elemental rate: it is keyed on what the target *is*,
* not on what the attack is made of, and the attacker never has to carry the element to earn it.
* Wrapping the finished number means it scales the whole result- elemental rates, critical, variance
* and guard alike- which is what "I have studied these things and I am simply better at killing
* them" should mean.
*/
J.ELEM.Aliased.Game_Action.set("makeDamageValue", Game_Action.prototype.makeDamageValue);
Game_Action.prototype.makeDamageValue = function(target, critical) {
	const baseDamage = J.ELEM.Aliased.Game_Action.get("makeDamageValue").call(this, target, critical);
	const attacker = this.subject();
	const slayerMultiplier = attacker.slayerMultiplierAgainst(target);
	const slainDamage = baseDamage * slayerMultiplier;
	return Math.round(slainDamage);
};

//#endregion
//#region src/plugins/elem/core/core/describeElemNotetags.js
/**
* The lines describing the notetags this plugin reads, registered with {@link NotetagDescriber} at boot.
*
* No words are written here. Each sentence is the game's, kept in its config under the tag's key; this class reads
* the tag and supplies what the sentence names.
*/
var ElemNotetagDescriptions = class {
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Registers the describer of every tag this plugin reads that has its words so far.
	*/
	static registerAll() {
		NotetagDescriber.register(J.ELEM.RegExp.AbsorbElementIds, (match) => this.absorbLines(match));
		NotetagDescriber.register(J.ELEM.RegExp.BoostElement, (match) => this.elementPercentLines(match, "boostElement"));
		NotetagDescriber.register(J.ELEM.RegExp.Slayer, (match) => this.elementPercentLines(match, "slayer"));
		NotetagDescriber.register(J.ELEM.RegExp.StrictElementIds, (match) => this.strictLines(match));
		NotetagDescriber.register(J.ELEM.RegExp.PierceElement, (match) => this.pierceLines(match, "pierceElement"));
		NotetagDescriber.register(J.ELEM.RegExp.ThisPierceElement, (match) => this.pierceLines(match, "thisPierceElement"));
	}
	/**
	* The line describing an absorb tag, in the sentence the game's config keeps under `absorbElements`: every listed
	* element heals whoever carries the tag instead of hurting them.
	*
	* The sentence may name `{elements}`, every listed element in the order the tag lists them, each as the text code
	* that draws its icon, color and name. Absorbing always helps whoever carries it.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is `[ELEMENT_ID, ...]`.
	* @returns {NotetagLine[]}
	*/
	static absorbLines(match) {
		const [, writtenIds] = match;
		const elementIds = JsonMapper.parseObject(writtenIds);
		return this.elementListLines("absorbElements", elementIds);
	}
	/**
	* The line describing a strict element tag, in the sentence the game's config keeps under `strictElements`: the
	* only elements whose attacks can harm whoever carries the tag, every other element hitting for nothing.
	*
	* Non-elemental attacks skip the element math entirely, so they still land. The sentence may name `{elements}`,
	* every listed element in the order the tag lists them, each as the text code that draws its icon, color and name.
	* Shrugging off every other element always helps whoever carries it.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is `[ELEMENT_ID, ...]`.
	* @returns {NotetagLine[]}
	*/
	static strictLines(match) {
		const [, writtenIds] = match;
		const elementIds = JsonMapper.parseObject(writtenIds);
		return this.elementListLines("strictElements", elementIds);
	}
	/**
	* The line for either tag listing elements its holder is protected by, led by the first element's face.
	* @param {string} templateKey The key of the tag's sentence.
	* @param {number[]} elementIds The elements, in the order the tag lists them.
	* @returns {NotetagLine[]}
	*/
	static elementListLines(templateKey, elementIds) {
		const [firstElementId] = elementIds;
		const iconIndex = IconManager.element(firstElementId);
		const elements = this.elementListToken(elementIds);
		const holderImpact = NotetagLine.Impacts.HELPS;
		return NotetagDescriber.line(templateKey, {
			iconIndex,
			holderImpact,
			tokens: { elements }
		});
	}
	/**
	* The line describing a tag multiplying damage by an element, in the sentence the game's config keeps under the
	* given key: an element boost multiplies every skill bearing the element, and a slayer multiplies every hit on
	* anything belonging to the element's family, whatever the hit is made of.
	*
	* The sentence may name `{value}`, the multiplier as a percentage (`+50%`), and `{element}`, the element as the
	* text code that draws its icon, color and name.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is `[ELEMENT_ID, PERCENT]`.
	* @param {string} templateKey The key of the tag's sentence.
	* @returns {NotetagLine[]}
	*/
	static elementPercentLines(match, templateKey) {
		const [, writtenPair] = match;
		const [elementId, percent] = JsonMapper.parseObject(writtenPair);
		const iconIndex = IconManager.element(elementId);
		const element = this.elementListToken([elementId]);
		const value = RPG_Trait.asDeltaPercent(percent);
		const holderImpact = this.amountImpact(percent);
		return NotetagDescriber.line(templateKey, {
			iconIndex,
			holderImpact,
			value,
			tokens: { element }
		});
	}
	/**
	* The line describing a resistance-negating tag, or its this-skill twin, in the sentence the game's config keeps
	* under the given key: how far a target's resistance to the element is pushed back toward neutral.
	*
	* The amount is points taken off the resistance rather than a share of it, and it never pushes past neutral, so
	* a weakness or an absorbed element is never touched. The sentence may name `{value}`, the amount (`5%`), and
	* `{element}`, the element as the text code that draws its icon, color and name.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is `[ELEMENT_ID, PERCENT]`.
	* @param {string} templateKey The key of the tag's sentence.
	* @returns {NotetagLine[]}
	*/
	static pierceLines(match, templateKey) {
		const [, writtenPair] = match;
		const [elementId, percent] = JsonMapper.parseObject(writtenPair);
		const iconIndex = IconManager.element(elementId);
		const element = this.elementListToken([elementId]);
		const value = `${percent}%`;
		const holderImpact = this.amountImpact(percent);
		return NotetagDescriber.line(templateKey, {
			iconIndex,
			holderImpact,
			value,
			tokens: { element }
		});
	}
	/**
	* Which way an element amount cuts for whoever carries it: one of {@link NotetagLine.Impacts}.
	*
	* A boost may be negative, a curse that softens every skill of the element; resistance negated never is.
	* @param {number} percent The amount, in percent.
	* @returns {number}
	*/
	static amountImpact(percent) {
		if (percent > 0) return NotetagLine.Impacts.HELPS;
		if (percent < 0) return NotetagLine.Impacts.HURTS;
		return NotetagLine.Impacts.NEITHER;
	}
	/**
	* A list of elements named in a line, each as the text code that draws its icon, color and name when the line is
	* drawn, set apart by commas.
	* @param {number[]} elementIds The elements' ids, in the order they are listed.
	* @returns {{text: string, kind: string}}
	*/
	static elementListToken(elementIds) {
		const codes = elementIds.map((elementId) => `\\element[${elementId}]`);
		return {
			text: codes.join(", "),
			kind: NotetagDescriber.TokenKinds.CODE
		};
	}
};

//#endregion
//#region src/plugins/elem/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Describes this plugin's tags once the database they are read from exists.
*/
J.ELEM.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.ELEM.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	ElemNotetagDescriptions.registerAll();
};

//#endregion
//# sourceMappingURL=J-Elementalistics.js.map