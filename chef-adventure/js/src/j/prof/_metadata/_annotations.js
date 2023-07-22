//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PROF] Enables skill prof and condition triggers.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @help
 * ============================================================================
 * This plugin enables the ability to have actors grow in prof when
 * using skills. Additionally, triggers can now be configured to execute
 * against these new proficiencies (and other things).
 * ============================================================================
 * PROFICIENCY BONUSES:
 * Have you ever wanted a battler to be able to gain some bonus proficiency by
 * means of something from the database? Well now you can! By applying the
 * appropriate tag to the various database locations, you too can have your
 * battlers gain bonus proficiency!
 *
 * NOTE:
 * Bonuses are flat bonuses that get added to the base amount, not percentage.
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
 *  <proficiencyBonus:NUM>
 *
 * TAG EXAMPLES:
 *  <proficiencyBonus:3>
 * The attacker now gains +3 bonus proficiency for any skill used.
 *
 *  <proficiencyBonus:50>
 * The attacker now gains +50 bonus proficiency for any skill used.
 * ============================================================================
 * PROFICIENCY BLOCKING:
 * Have you ever wanted a battler to NOT be able to gain proficiency? Well now
 * you can! By applying the appropriate tags to the various database locations,
 * you too can block any battler from giving or gaining proficiency!
 *
 * NOTE:
 * It is important to recognize that there are two tags that both block the
 * gain of proficiency in different ways. One tag is designed to prevent the
 * GIVING of proficiency, for most commonly being placed on enemies or states
 * that enemies can be placed in. The second tag is designed to prevent the
 * GAINING of proficiency, most commonly being placed on actors or states that
 * actors can be placed in... though either tag can go on anything as long as
 * you understand what you're doing.
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
 *  <proficiencyGivingBlock>
 * or
 *  <proficiencyGainingBlock>
 *
 * TAG EXAMPLES:
 *  <proficiencyGivingBlock>
 * The battler that has this tag will not GIVE proficiency to any opposing
 * battlers that hit this battler with skills.
 *
 *  <proficiencyGainingBlock>
 * The battler that has this tag will not be able to GAIN proficiency from any
 * battlers that this battler uses skills against.
 * ============================================================================
 * PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 * COMMAND:
 * "Modify Actor's Proficiency"
 * This command will allow you to increase or decrease a single actor's
 * proficiency for a given skill. You only need choose the actor, skill, and
 * the amount to increase/decrease by.
 *
 * COMMAND:
 * "Modify Party's Proficiency"
 * This command will do the same as the single actor's command above, but
 * instead apply against the whole party.
 *
 * NOTES:
 * - You cannot reduce a skill's proficiency in a skill below 0.
 * - Increasing the proficiency can trigger rewards for the skill.
 * - Decreasing the proficiency will NOT undo rewards gained.
 *
 * ============================================================================
 * @param conditionals
 * @type struct<ProficiencyConditionalStruct>[]
 * @text Proficiency Conditionals
 * @desc A set of conditions that when met reward the player.
 * @default []
 *
 * @command modifyActorSkillProficiency
 * @text Modify Actor's Proficiency
 * @desc Increase/decrease one or more actor's proficiency with one or more skills.
 * @arg actorIds
 * @type actor[]
 * @text Actor Id
 * @desc Choose one or more actors to modify the proficiency for.
 * @arg skillIds
 * @type skill[]
 * @text Skill Id
 * @desc Choose one or more skills to modify the proficiency for.
 * @arg amount
 * @type number
 * @text Modifier
 * @desc This modifier can be negative or positive.
 * @min -999999
 * @max 999999
 *
 * @command modifyPartySkillProficiency
 * @text Modify Party's Proficiency
 * @desc Increase/decrease every member in the current party's proficiency with a particular skill.
 * @arg skillIds
 * @type skill[]
 * @text Skill Id
 * @desc Choose one or more skills to modify the proficiency for.
 * @arg amount
 * @type number
 * @text Modifier
 * @desc This modifier can be negative or positive.
 * @min -999999
 * @max 999999
 *
 */
/*~struct~ProficiencyConditionalStruct:
 * @param key
 * @type string
 * @text Key
 * @desc The conditional unique key so no actor can achieve the same conditional twice!
 * @default 1H-SWD_COMBO-3
 *
 * @param actorIds
 * @type actor[]
 * @text Actors
 * @desc The actors of which this proficiency conditional applies to.
 * @default []
 *
 * @param requirements
 * @type struct<ProficiencyRequirementStruct>[]
 * @text Requirements
 * @desc A set of requirements required to fulfill this condition.
 * @default []
 *
 * @param skillRewards
 * @type skill[]
 * @text Skill Rewards
 * @desc All skills chosen here will be learned for fulfilling this condition. Stacks with JS rewards.
 * @default [1]
 *
 * @param jsRewards
 * @type multiline_string
 * @text JS Rewards
 * @desc Use Javascript to define the reward for fulfilling this condition. Stacks with skill rewards.
 * @default a.learnSkill(5);
 */
/*~struct~ProficiencyRequirementStruct:
 * @param skillId
 * @type skill
 * @text Skill
 * @desc The skill to base this requirement on.
 * @default 1
 *
 * @param proficiency
 * @type number
 * @text Proficiency Required
 * @desc The prof required in the designated skill to fulfill this requirement.
 * @default 100
 */