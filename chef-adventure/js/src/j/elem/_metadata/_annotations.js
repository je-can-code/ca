//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 ELEM] Enables greater control over elements.
 * @author JE
 * @url https://github.com/je-can-code/ca
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