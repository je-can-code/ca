//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 ELEM] Enables greater control over elements.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
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
 * WARNING:
 * None of the note tags below support negative numbers and are white-space
 * sensitive. Follow the examples closely to achieve your desired effects.
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
 *  <boostElement:[ELEMENT_ID]:[PERCENT_BOOST]>
 *
 * TAG EXAMPLE:
 *  <boostElement:1:50>
 * This battler has a +50% boost to skills bearing element id 1.
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
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ELEM = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ELEM.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-Elementalistics`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.ELEM.Aliased = {
  Game_Action: new Map(),
  Game_Actor: new Map(),
  Game_Enemy: new Map(),
};
//#endregion Introduction

//#region Game objects
/**
 * OVERWRITE Calculates the elemental rates of this action against the designated target.
 * @param {Game_Actor|Game_Enemy} target The target of this action.
 * @returns {number} The multiplier from elemental affiliation.
 */
Game_Action.prototype.calcElementRate = function(target)
{
  // initialize elements collection for this action.
  const elements = this.getApplicableElements(target);

  // non-elemental skills perform no elemental calculations.
  if (elements.includes(0))
  {
    return 1.0
  }

  // check if the target's strict elements contain the attack elements.
  const targetStrictElements = target.strictElements();

  // filter the action's elements down by what is available according to the strict elements.
  const attackElements = elements.filter(elementId => targetStrictElements.includes(elementId));

  let factor;
  switch (attackElements.length)
  {
    // if we have no elements left, then the elemental calculation is 0.
    case 0:
      factor = 0;
      break;
    // if we still only have the one element, then just use that.
    case 1:
      factor = this.calculateBoostRate(attackElements[0], target);
      break;
    // if we have more than 1 element, then handle it accordingly.
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
Game_Action.prototype.calculateRawElementRate = function(target)
{
  const elements = this.getApplicableElements(target);
  const result = this.calculateMultipleRawElementalRate(target, elements);
  return result;
};

/**
 * Gets all applicable element ids that this action could have against this target.
 * @param {Game_Battler} target The target battler to check elemental applicability.
 * @returns {number[]} The list of element ids that this action has that are valid against the target.
 */
Game_Action.prototype.getApplicableElements = function(target)
{
  // the skill itself (or usable item).
  const skillOrItem = this.item();

  // the core element of the action.
  const baseElement = skillOrItem.damage.elementId;

  // initialize elements collection for this action.
  const elements = [baseElement];

  // add any extra elements the action has.
  const addedElements = Game_Action.extractElementsFromAction(skillOrItem);
  elements.push(...addedElements);

  // if the base element is -1 on the skill, then also add all the attacker's elements.
  const caster = this.subject();
  if (baseElement === -1)
  {
    elements.push(...caster.attackElements());
  }

  // if "none"-element is present, that is all that matters.
  if (elements.includes(0))
  {
    return [0];
  }

  // check if the target's strict elements contain the attack elements.
  const targetStrictElements = target.strictElements();

  // filter the action's elements down by what is available according to the strict elements.
  const restrictedElements = elements.filter(attackElementId => targetStrictElements.includes(attackElementId));

  return restrictedElements;
};

/**
 * Extracts all extra attack elements from a skill's notes.
 * @param {rm.types.UsableItem} referenceData The database object of this action.
 * @returns {number[]} The additional attack elements.
 */
Game_Action.extractElementsFromAction = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<attackElements:[ ]?(\[[\d, ]+])>/i;
  const elements = [];
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      const data = JSON.parse(RegExp.$1);
      elements.push(...data);
    }
  });

  return elements;
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
Game_Action.prototype.multipleElementalRates = function(target, elements)
{
  const antiNullElementIds = this.getAntiNullElementIds();
  const hasAntiNullElementIds = antiNullElementIds.some(elementId => elements.includes(elementId));

  // if we have anti-null elements, then strip out the null
  if (hasAntiNullElementIds)
  {
    return this.calculateAntiNullElementalRate(target, elements);
  }

  // if we have an absorb rate amidst the attack elements that the target absorbs... 
  const hasAbsorbRate = target.elementsAbsorbed().some(absorbed => elements.includes(absorbed));
  if (hasAbsorbRate)
  {
    return this.calculateAbsorbRate(target, elements);
  }

  // if we have a null rate amidst the attack elements that the target nullifies...
  const hasNullRate = elements.some(attackElementId => this.calculateBoostRate(attackElementId, target) === 0);
  if (hasNullRate)
  {
    return this.calculateNullRate(target, elements);
  }

  // otherwise, calculate all the available elements.
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
Game_Action.prototype.calculateAntiNullElementalRate = function(target, attackElements)
{
  // the filter against the attack element ids.
  const filtering = (attackElementId) => !(this.calculateBoostRate(attackElementId, target) === 0);

  // filter out all null rates for the attack elements.
  const filteredElements = attackElements.filter(filtering);

  // if we have nothing left after purging all null-elements, then its "true" damage.
  if (!filteredElements.length) return 1;

  // the reducer for multiplying together all the rates.
  const reducer = (value, attackElementId) => (value * this.calculateBoostRate(attackElementId, target));

  // multiply together all the null-avoidant rates and return its "factor form".
  const nonNullRate = filteredElements.reduce(reducer, 1,);

  // and return the "factor form" of the non-nullable elemental product.
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
Game_Action.prototype.calculateMultipleElementalRate = function(target, attackElements)
{
  return attackElements
    // calculate the rates for all the incoming attack elements.
    .map(attackElementId => this.calculateBoostRate(attackElementId, target), this)
    // multiply all rates together to get the "factor form".
    .reduce((previousRate, currentRate) => previousRate * currentRate, 1);
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
Game_Action.prototype.calculateMultipleRawElementalRate = function(target, attackElements)
{
  return attackElements
    // calculate the rates for all the incoming attack elements.
    .map(attackElementId => target.elementRate(attackElementId), this)
    // multiply all rates together to get the "factor form".
    .reduce((previousRate, currentRate) => previousRate * currentRate, 1);
};

/**
 * Calculates the element's rate including applicable boosts.
 *
 * This is effectively a wrapper around `target.elementRate(elementId)` that
 * also includes all of our elemental boosts from various notes around the
 * battlers.
 * @param {number} attackElementId The element id.
 * @param {Game_Actor|Game_Enemy} target The element id.
 * @returns {number}
 */
Game_Action.prototype.calculateBoostRate = function(attackElementId, target)
{
  // the attacker to gauge bonus element rates upon.
  const attacker = this.subject();

  // the base element rate.
  const baseRate = target.elementRate(attackElementId);

  // the boosted rate if the attacker has any.
  const elementBoostRate = attacker.elementRateBoost(attackElementId);

  // return the product.
  return baseRate * elementBoostRate;
};

/**
 * Calculates the absorb rate for the target in relation to a set of elements.
 * @param {Game_Actor|Game_Enemy} target The target of this action.
 * @param {number[]} attackElements The attacking list of elements.
 * @returns {number} The "factor form" of the rate.
 */
Game_Action.prototype.calculateAbsorbRate = function(target, attackElements)
{
  // the reducer for multiplying together all the rates.
  const reducer = (previousRate, currentRate) => previousRate * currentRate;

  // get all those element ids that the target absorbs.
  const filteredAbsorbedIds = target.elementsAbsorbed().filter(absorbed => attackElements.includes(absorbed));

  // translate the ids into rates.
  const absorbRates = filteredAbsorbedIds.map(attackElementId => this.calculateBoostRate(attackElementId, target),
    this);

  // multiply all the rates together.
  const absorbRate = absorbRates.reduce(reducer, 1);

  // return the product divided by 100 to get into "factor form".
  return absorbRate;
};

/**
 * Calculates the null rate for the target in relation to a set of elements.
 * @param {Game_Actor|Game_Enemy} target The target of this action.
 * @param {number[]} attackElements The attacking list of elements.
 * @returns {number} The "factor form" of the rate.
 */
Game_Action.prototype.calculateNullRate = function(target, attackElements)
{
  // ... open for extension.
  return 0;
};

/**
 * If these elements are present in an elementId collection, then the calculation
 * will omit any 0 rate elements.
 * @returns {number[]} The ids to cause us to strip out all nulls.
 */
Game_Action.prototype.getAntiNullElementIds = function()
{
  return [];
};

/**
 * OVERWRITE Evaluates the damage formula provided by the dev to determine the damage.
 * This now also factors in how to handle elemental absorption.
 * @param {Game_Actor|Game_Enemy} target The `b` of the formula.
 * @returns
 */
Game_Action.prototype.evalDamageFormula = function(target)
{
  const item = this.item();
  const attackElements = Game_Action.extractElementsFromAction(item);
  const absorbedElements = target.elementsAbsorbed();
  const targetAbsorbs = attackElements.some(elementId => absorbedElements.includes(elementId));

  // variables that are used for building damage formulai.
  const a = this.subject();
  const b = target;
  const v = $gameVariables._data;
  let p = 0;

  // if skill proficiency is present, the p variable represents that value.
  if (J.PROF)
  {
    p = this.skillProficiency();
  }

  // whether or not the damage should be multiplied by -1.
  const sign = this.healingFactor(targetAbsorbs);

  try
  {
    let value = 0;
    if (targetAbsorbs)
    {
      // if the target absorbs any of the elements being used, then lift the floor.
      value = eval(item.damage.formula) * sign;
    }
    else
    {
      // otherwise, calculate per usual.
      value = Math.max(eval(item.damage.formula), 0) * sign;
    }

    return isNaN(value) ? 0 : value;
  }
  catch (e)
  {
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
Game_Action.prototype.healingFactor = function(targetAbsorbs)
{
  const isHealingAction = [3, 4].includes(this.item().damage.type);
  return isHealingAction && !targetAbsorbs ? -1 : 1;
};
//#endregion Game_Action

//#region Game_Actor
/**
 * Modifies the element rate to accommodate elemental absorption tags on an actor.
 */
J.ELEM.Aliased.Game_Actor.set("elementRate", Game_Actor.prototype.elementRate);
Game_Actor.prototype.elementRate = function(elementId)
{
  const baseRate = J.ELEM.Aliased.Game_Enemy.get("elementRate").call(this, elementId);

  const isAbsorbed = this.isElementAbsorbed(elementId) ? -1 : 1;
  return baseRate * isAbsorbed;
};

/**
 * Gets all elements this actor absorbs.
 * @returns {number[]}
 */
Game_Actor.prototype.elementsAbsorbed = function()
{
  const objectsToCheck = this.getEverythingWithNotes();
  const absorbed = [];
  objectsToCheck.forEach(referenceData =>
  {
    const elementsFromObject = this.extractAbsorbedElements(referenceData);
    absorbed.push(...elementsFromObject);
  });

  return absorbed;
};

/**
 * Gets the only elements this actor can be affected by.
 * @returns {number[]}
 */
Game_Actor.prototype.strictElements = function()
{
  const objectsToCheck = this.getEverythingWithNotes();
  const strict = [];
  objectsToCheck.forEach(referenceData =>
  {
    const elementsFromObject = this.extractStrictElements(referenceData);
    strict.push(...elementsFromObject);
  });

  // if there were no "strict" elements found, then add all elements to
  // pass the "strict" check.
  if (!strict.length)
  {
    strict.push(...Game_Battler.prototype.strictElements.call(this));
  }

  return strict;
};

/**
 * Gets the element rate boost for this element for this battler.
 * @param {number} elementId The element id to check.
 * @returns {number}
 */
Game_Actor.prototype.elementRateBoost = function(elementId)
{
  const objectsToCheck = this.getEverythingWithNotes();
  const boosts = [];
  objectsToCheck.forEach(referenceData =>
  {
    const boost = this.extractElementRateBoosts(referenceData);
    if (!boost.length) return;

    boosts.push(...boost);
  });

  const filteredBoosts = boosts.filter(boost =>
  {
    return boost[0] === elementId;
  });
  const factoredBoosts = filteredBoosts.map(boost => boost[1] / 100);
  return factoredBoosts.reduce((previousAmount, nextAmount) => previousAmount + nextAmount, 1);
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * Determines whether or not a given element id is absorbed by this battler.
 * @param {number} elementId The element id.
 * @returns {boolean}
 */
Game_Battler.prototype.isElementAbsorbed = function(elementId)
{
  return this.elementsAbsorbed().includes(elementId);
};

/**
 * Determines whether or not a given element id can affect this battler in the
 * context of "strict" elements. If the target has no strict elements, then this
 * will automatically return true. Otherwise, it'll check elements.
 * @param {number} elementId The element id.
 * @returns {boolean}
 */
Game_Battler.prototype.isElementStrict = function(elementId)
{
  const strict = this.strictElements();

  // if we don't have any strict elements on this battler
  if (!strict.length)
  {
    // then strictness doesn't apply.
    return true;
  }

  // otherwise, check the strict elements to see if we have a match.
  return strict.includes(elementId);
};

/**
 * Gets all elements this battler absorbs.
 * @returns {number[]}
 */
Game_Battler.prototype.elementsAbsorbed = function()
{
  return [];
};

/**
 * Gets all absorbed element ids from a given object on this battler.
 *
 * @todo Potentially lift this to J.BASE.Helpers
 * @param {rm.types.BaseItem} referenceData The database data object.
 * @returns {number[]}
 */
Game_Battler.prototype.extractAbsorbedElements = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const lines = referenceData.note.split(/[\r\n]+/);
  const structure = /<absorbElements:[ ]?(\[\d+,?[ ]?\d*?])>/i;
  const elements = [];
  lines.forEach(line =>
  {
    if (line.match(structure))
    {
      const data = JSON.parse(RegExp.$1);
      elements.push(...data);
    }
  });

  return elements;
};

/**
 * Gets the strict elements for this battler, if any.
 * "Strict" elements are the only elements this battler can be affected by.
 *
 * If none are found, the default is all elements (to negate this feature).
 * @returns {number[]}
 */
Game_Battler.prototype.strictElements = function()
{
  return $dataSystem.elements.map((_, index) => index);
};

/**
 * Gets the strict element ids from a given object on this battler.
 *
 * @todo Potentially lift this to J.BASE.Helpers
 * @param {rm.types.BaseItem} referenceData The database data object.
 * @returns {number[]}
 */
Game_Battler.prototype.extractStrictElements = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const lines = referenceData.note.split(/[\r\n]+/);
  const structure = /<strictElements:[ ]?(\[\d+,?[ ]?\d*?])>/i;
  const elements = [];
  lines.forEach(line =>
  {
    if (line.match(structure))
    {
      const data = JSON.parse(RegExp.$1);
      elements.push(...data);
    }
  });

  return elements;
};

/**
 * Gets the element rate boost for this element for this battler.
 * @param {number} elementId The element id to check.
 */
Game_Battler.prototype.elementRateBoost = function(elementId)
{
  return 1;
};

/**
 * Gets the element boosts associated with the provided element id.
 * @param {rm.types.BaseItem} referenceData The reference data with a note to parse.
 * @returns {[number, number][]}
 */
Game_Battler.prototype.extractElementRateBoosts = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const lines = referenceData.note.split(/[\r\n]+/);
  const structure = /<boostElements:(\d+):(-?\+?[\d]+)>/i;
  const boostedElements = [];

  // get all the boosts first.
  lines.forEach(line =>
  {
    if (line.match(structure))
    {
      const id = parseInt(RegExp.$1);
      const boost = parseInt(RegExp.$2);
      boostedElements.push([id, boost]);
    }
  });

  return boostedElements;
};
//#endregion Game_Battler

//#region Game_Enemy
/**
 * Modifies the element rate to accommodate elemental absorption tags on an actor.
 */
J.ELEM.Aliased.Game_Enemy.set("elementRate", Game_Enemy.prototype.elementRate);
Game_Enemy.prototype.elementRate = function(elementId)
{
  const baseRate = J.ELEM.Aliased.Game_Enemy.get("elementRate").call(this, elementId);

  const isAbsorbed = this.isElementAbsorbed(elementId) ? -1 : 1;
  return baseRate * isAbsorbed;
};

/**
 * Gets all elements this enemy absorbs.
 * @returns {number[]}
 */
Game_Enemy.prototype.elementsAbsorbed = function()
{
  const objectsToCheck = this.getEverythingWithNotes();
  const absorbed = [];
  objectsToCheck.forEach(referenceData =>
  {
    const elementsFromObject = this.extractAbsorbedElements(referenceData);
    absorbed.push(...elementsFromObject);
  });

  return absorbed;
};

/**
 * Gets the only elements this enemy can be affected by.
 * @returns {number[]}
 */
Game_Enemy.prototype.strictElements = function()
{
  const objectsToCheck = this.getEverythingWithNotes();
  const strict = [];
  objectsToCheck.forEach(referenceData =>
  {
    const elementsFromObject = this.extractStrictElements(referenceData);
    strict.push(...elementsFromObject);
  });

  // if there were no "strict" elements found, then add all elements to
  // pass the "strict" check.
  if (!strict.length)
  {
    strict.push(...Game_Battler.prototype.strictElements.call(this));
  }

  return strict;
};

/**
 * Gets the element rate boost for this element for this enemy.
 * @param {number} elementId The element id to check.
 * @returns {number}
 */
Game_Enemy.prototype.elementRateBoost = function(elementId)
{
  const objectsToCheck = this.getCurrentWithNotes();
  const boosts = [];
  objectsToCheck.forEach(referenceData =>
  {
    const boost = this.extractElementRateBoosts(referenceData);
    if (!boost.length) return;

    boosts.push(...boost);
  });

  const filteredBoosts = boosts.filter(boost =>
  {
    return boost[0] === elementId;
  });
  const factoredBoosts = filteredBoosts.map(boost => boost[1] / 100);
  const boostAmount = factoredBoosts.reduce((previousAmount, nextAmount) => previousAmount + nextAmount, 1);
  return boostAmount;
};

//#endregion Game_Enemy
//#endregion Game objects