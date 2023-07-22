//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CHARGE] Enable skills to be charged to perform other skills.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables the ability to charge certain skills by holding down
 * the input associated with the skill slot.
 *
 * This plugin requires JABS.
 * This plugin has minimal plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Actors can now "charge up" their skills to configurable degrees based on
 * the tags applied to the skills in question. This concept is basically a
 * JABS version of what Link can do when you charge up his sword to swing it
 * all around, instead of just swinging it by mashing the button.
 *
 * The functionality is defined by "charging tiers", which include data points
 * such as:
 * - how long to charge this tier.
 * - what skill will be executed if released when this tier is charged.
 * - the tier number of this tier.
 *
 * A skill can have multiple tiers of charging to represent the ability to
 * have different releasable abilities depending on how long you charge.
 * ----------------------------------------------------------------------------
 * LIMITATIONS:
 * While the reference above makes it sound like ANY skill can be charged, that
 * is only partially true. ANY skill can be charged, as long as it meets a few
 * criteria.
 *
 *  - It has to be one of the chargable skill slots.
 * Skill slots you CAN charge:
 *  - mainhand slot
 *  - offhand slot
 *  - combat skill 1 slot
 *  - combat skill 2 slot
 *  - combat skill 3 slot
 *  - combat skill 4 slot
 *
 * Skill slots you CANNOT charge:
 *  - dodge slot
 *  - item/tool slot
 *
 * - it has to be a valid chargable skill.
 * Skill situations that are not valid chargable skills:
 *  - tools cannot be charged, even if they have charge tier data.
 *  - guard skills cannot be charged, even if they have charge tier data.
 *
 * - the battler must know the skill somehow.
 * ============================================================================
 * CHARGING TIERS:
 * Have you ever wanted your player to be able to "charge" skills? Well now
 * you can! By applying the appropriate tags to skills, you can allow the
 * player to hold down a skill slot's input to "charge" up the skill!
 *
 * NOTE1:
 * To understand some of the nuances, do be sure to read the next section
 * below that describes in greater detail how the charging tiers work.
 *
 * NOTE2:
 * The two optional tags in the tag format below can be made uniform by
 * instead adjusting the configuration in the plugin parameters.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT:
 *  <chargeTier:[TIER,DURATION,RELEASED_SKILL,CHARGE_ANIM?,DONE_ANIM?]>
 * Where TIER represents the number of charge tier this defines.
 * Where DURATION is how long in frames the button must be held to charge.
 * Where RELEASED_SKILL is the skill to execute when released after charging.
 * Where CHARGE_ANIM? is the animation to play while charging (optional).
 * Where DONE_ANIM? is the animation to play when done charging (optional).
 *
 * EXAMPLE:
 *  <chargeTier:[1,30,175]>
 * The player can charge this skill up 1 tier by holding down the input for
 * this skill slot for 30 frames. When fully charged and released, it will
 * execute the skill of id 175.
 *
 *  <chargeTier:[1,30,175,10]>
 * The player can charge this skill up 1 tier by holding down the input for
 * this skill slot for 30 frames. While charging, the animation of id 10
 * will play on loop. When fully charged and released, it will execute the
 * skill of id 175.
 *
 *  <chargeTier:[1,30,175,10,25]>
 * The player can charge this skill up 1 tier by holding down the input for
 * this skill slot for 30 frames. While charging, the animation of id 10
 * will play on loop. Each tier completed will play the animation of id 25.
 * When fully charged and released, it will execute the skill of id 175.
 *
 *  <chargeTier:[1,60,0]>
 *  <chargeTier:[2,120,90]>
 * The player can charge this skill up 2 tiers by holding down the input for
 * this skill slot. The first tier requires the input held for 60 frames, but
 * will yield no skill when released. The second tier requires the input held
 * for an additional 120 frames, and when fully charged and released, it will
 * execute the skill id of 90.
 *
 *  <chargeTier:[1,60,125]>
 *  <chargeTier:[2,300,0]>
 *  <chargeTier:[7,150,90]>
 * (this is probably an unrealistic example, but illustrates the functionality)
 * The player can charge this skill up 7 tiers by holding down the input for
 * this skill slot. The first tier requires the input held for 60 frames, and
 * will execute skill of id 125 when released after charging for at minimum
 * the 60 frames. The second tier requires the input to be held for an
 * additional 300 frames (! roughly five seconds !), and when released after
 * charging, will execute the same skill as tier 1 because tier 2 has 0 set as
 * the skill id to execute. The tiers of (3/4/5/6) are all auto-generated and
 * each require 30 frames of holding the input. Finally, tier 7 requires the
 * input to be held for another 150 frames, and when fully charged and released
 * will execute skill id 90 instead. This skill requires a total of:
 * 60 + 300 + 30 + 30 + 30 + 30 + 150 = 630 aka ~10.5 seconds of holding the
 * input down to fully charge all the tiers!
 * ============================================================================
 * MORE ABOUT CHARGE TIERS:
 * In some cases, you may only want the player's charged ablity to release a
 * skill if it is charged multiple tiers. While you could just make a really
 * long charge tier, it may make more sense to charge up three tiers and only
 * the last tier will release a skill when fully charged. In this case, you
 * can only place the last tag on a skill (like a tier7 tag) and this engine
 * will auto-generate the prior tiers as 1/2 second charges per tier up
 * until the tier you defined is reached. None of the auto-generated tiers
 * will have releasable skills.
 *
 * If you manually created a gap, for example, by defining only charging tiers
 * 1 and 6, the auto-generated ones (2/3/4/5) would not have any releasable
 * skills, but if the tier1 you defined DOES have a releasable skill, releasing
 * anything after the first but before the 6th tier would end up releasing the
 * 1st tier charge skill as a result.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param defaults
 * @text DEFAULTS
 *
 * @param defaultChargingAnimId
 * @parent defaults
 * @type animation
 * @text Charging Animation
 * @desc This will be the default animation to play when a
 * while charging up. 0 means no animation.
 * @default 0
 *
 * @param defaultTierCompleteAnimId
 * @parent defaults
 * @type animation
 * @text Tier Complete Animation
 * @desc This will be the default animation to play when a
 * charging tier is charged. 0 means no animation.
 * @default 0
 *
 * @param useTierCompleteSE
 * @parent defaults
 * @type boolean
 * @text Use Tier Complete SE
 * @desc Whether or not to use the charging tier complete sound
 * effects.
 * @default false
 *
 * @param allowTierCompleteSEandAnim
 * @parent defaults
 * @type boolean
 * @text Allow Tier Complete SE/Anim
 * @desc Whether or not to use both sound effects and the defined
 * animations when a charging tier completes.
 * @default false
 */