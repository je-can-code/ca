/*  BUNDLED TIME: Thu Aug 04 2022 08:34:44 GMT-0700 (Pacific Daylight Time)  */

/* eslint-disable max-len */
/*:
 * @target MZ
 * @plugindesc
 * [v3.0.0 JABS] Enables combat to be carried out on the map.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin is JABS: J's Action Battle System.
 * Using this plugin will enable you to carry out combat directly on the map
 * in real-time, similar to popular game franchises like Zelda.
 *
 * ============================================================================
 * DETAILS:
 * Have you ever wanted to decorate events with tons of event comments and
 * watch them come to life as AI-controlled allies/enemies in an action battle
 * system for your button-mashing hack-n-slash pleasure? Well now you can! Just
 * slap some tags on the various everything across the entire RMMZ editor, and
 * you too can have a functional ABS, aka JABS!
 *
 * ============================================================================
 * FIRST TIME SETUP, THE ACTION MAP:
 * If you're not using the demo as a base, then you'll need to add a new map to
 * your project where all the "action events" will live. These events represent
 * the visual components of skills executed on the map and are mapped by adding
 * a tag to the skills that associate your skill with the designated event on
 * the action map. Once you've created the map, you'll need to take note of the
 * map id and align it in the plugin parameters with the "Action Map Id" param.
 *
 * ============================================================================
 * SETTING UP YOUR ENEMY EVENTS:
 * There are a lot of potential tags that you can place all across the database
 * to accomplish various goals, so lets get started with setting up an enemy
 * event.
 *
 * First and foremost, all tags will be living inside comment event commands:
 *    "Event Commands > Flow Control > Comment"
 *
 * NOTE ABOUT PRIORITY OF TAGS:
 * With the exception of the ENEMY ID tag and MOVE SPEED tag in an event, all
 * the rest are mostly optional. If you place the same tags for ENEMY EVENTS
 * in the database, then they will become the defaults for enemies, where the
 * tags in the ENEMY EVENTS will act as "overrides".
 * So the priority order looks like this:
 *    1st: tags in the ENEMY EVENT.
 *    2nd: tags in the database on that particular enemy.
 *    3rd: the defaults listed in the plugin parameters.
 * ----------------------------------------------------------------------------
 * ENEMY ID:
 * If you want an event to be tagged as an enemy, then the system needs a way
 * to associate the event with the enemy. To accomplish this, we'll use the
 * "enemy" tag:
 *    <enemyId:ENEMY_ID>
 *  Where ENEMY_ID is the id from the database of the enemy for this event.
 *
 * ----------------------------------------------------------------------------
 * SIGHT RADIUS:
 * The "sight" of an enemy, is the radius around the enemy that it can perceive
 * the player. When the player comes within this radius, the enemy will try to
 * attack the player. To define the "sight" radius of an enemy, we'll use the
 * "sight" tag:
 *    <sight:RADIUS>
 *  Where RADIUS is the distance in tiles this enemy can see.
 *
 * NOTE: Enemy sight ignores obstacles like walls. They have x-ray vision.
 *
 * This can also be placed in the database on the enemy to set it as a default.
 *
 * ----------------------------------------------------------------------------
 * PURSUIT RADIUS:
 * The "pursuit" of an enemy is the radius around the enemy that if will
 * pursue the player once in combat. Effectively, this is the enemy's sight
 * radius after it is engaged in combat. This is typically designed to be
 * bigger than the sight radius. To define the "pursuit" radius of an enemy,
 * we'll use the "pursuit" tag:
 *    <pursuit:RADIUS>
 *  Where RADIUS is the distance in tiles this enemy can pursue combatants.
 *
 * This can also be placed in the database on the enemy to set it as a default.
 *
 * ----------------------------------------------------------------------------
 * ALERTING:
 * When an enemy is struck with a skill from outside of its sight/pursuit
 * range, the enemy will enter an "alerted" state. While in said "alerted"
 * state, they can have heightened sight and pursuit, and will navigate to the
 * point of which they believe the attacker resides. It is encouraged to use
 * this functionality, or else enemies can be easily defeated with ranged
 * skills and no risk. To leverage this functionality, there are a few tags you
 * may want to use:
 *    <alertDuration:DURATION>
 *  Where DURATION is the duration in frames to remain alerted.
 *
 *    <alertedSightBoost:RADIUS_BOOST>
 *  Where RADIUS_BOOST is the amount of bonus sight gained while alerted.
 *
 *    <alertedPursuitBoost:RADIUS_BOOST>
 *  Where RADIUS_BOOST is the amount of bonus pursuit gained while alerted.
 *
 * This can also be placed in the database on the enemy to set it as a default.
 *
 * ----------------------------------------------------------------------------
 * MOVE SPEED:
 * Sometimes, you want an enemy to move somewhere between 3 and 4 movespeed,
 * because 3 to 4 movespeed is literally a 2x jump in movespeed. If you want
 * to assign a number like 3.7 as an enemy's move speed, you can use this tag:
 *    <moveSpeed:SPEED>
 *  Where SPEED is the numeric value to represent the move speed.
 *
 * NOTE: This will override whatever the native RMMZ event page is set to.
 * NOTE: I have found a good balance is between 3.5 and 4.5 for move speed.
 *
 * ----------------------------------------------------------------------------
 * AI TRAITS:
 * While the basic AI works, you may want to modify the AI a bit for various
 * enemies. To do this, I've built some tags that flex the various themes that
 * the AI can perform. These tags should be added alongside wherever you might
 * add the above tags for things like enemy id and sight radius.
 *
 * NOTE: Enemies have a default AI in the sense that they will still attack
 * and perform skills, but mostly its just at random if you don't slap some
 * ai traits on them. Though, skills still can only be used as often as their
 * cooldown and resources permit.
 *
 * ----------------------------------------------------------------------------
 * <aiTrait:careful>
 * Enemies with the Careful AI trait will be more calculating about their
 * strategies, and avoid using things that would benefit you, such as skills
 * that are elementally ineffective. This also influences decision-making for
 * other AI traits.
 *
 * ----------------------------------------------------------------------------
 * <aiTrait:executor>
 * Enemies with the Executor AI trait will prioritize leveraging skills that
 * maximize damage and target weak spots. They know everything and will
 * use every skill in their arsenal to destroy you.
 *
 * ----------------------------------------------------------------------------
 * <aiTrait:reckless>
 * Enemies with the Reckless AI trait will never use their basic attack, and
 * will spam their learned skills until they are out of resources instead.
 * This also influences decision-making for other AI traits.
 *
 * ----------------------------------------------------------------------------
 * <aiTrait:healer>
 * Enemies with the Healer AI trait will monitor their nearby allies while they
 * use their various skills and prioritize their own healing skills to keep
 * their allies alive. If an enemy has the Reckless AI trait alongside this,
 * they will disregard efficiency and just use the strongest healing skill to
 * heal their allies. If an enemy has the Careful AI trait, they will be more
 * calculating and use the "best fitted" healing skill for the situation.
 *
 * ----------------------------------------------------------------------------
 * <aiTrait:follower>
 * Enemies with the Follower AI trait are restricted to only using their basic
 * attack skill when without a leader. When another enemy is in the nearby
 * vicinity that has the Leader AI Trait, then the leader enemy will decide
 * actions on behalf of the follower enemy to perform. This AI trait is
 * typically used to create "dormant" enemies that awaken when a leader is
 * present and can utilize their skills. You can also gate healing skills
 * behind requiring a leader to leverage them.
 *
 * NOTE: Leader/Follower traits have not been heavily tested, use with care!
 *
 * ----------------------------------------------------------------------------
 * <aiTrait:leader>
 * Enemies with the Leader AI trait are just like normal enemies and will obey
 * their other AI traits, but also they will take over and make decisions on
 * behalf of any available followers in the nearby vicinity using their own
 * AI traits to decide what skills for the follower to use.
 *
 * NOTE: Leader/Follower traits have not been heavily tested, use with care!
 *
 * ============================================================================
 * TEAMS:
 * By default, when an enemy is created, they are assigned a numeric team value
 * of 1. When allied battlers (such as the player) are created, they are given
 * the team value of 0. Because these two battlers are on different teams, they
 * are able to deal damage to each other with skills. If your game is more
 * complex than "good guy" & "bad guy", you may require additional teams. While
 * it isn't greatly supported in the sense that there is team relationships
 * and associations you can create (such as two separate teams that consider
 * eachother allies, or neutral teams), you can still add a tag to enemies on
 * the map that will redefine their team id, to potentially allow enemies to
 * fight eachother.
 *
 * By default, the following teams are already setup:
 * - 0 is for the player/allies.
 * - 1 is for enemies/monsters.
 * - 2 is for "neutral", aka inanimate objects.
 *
 *    <teamId:TEAM>
 *  Where TEAM is the numeric id to assign.
 *
 * ============================================================================
 * CIRCUMSTANTIAL CONFIG OPTIONS:
 * There are a few more tags that you may want to be aware of that modify the
 * base functionality of how enemies on the map look or act. Add these to the
 * enemy somehow, and the defaults can be changed.
 *
 * ----------------------------------------------------------------------------
 * IDLING:
 * By default, enemies will kinda idle about in a 2-tile radius surrounding
 * wherever they are placed on the map. If you want to change this, or undo
 * your defaults, there are tags for that!
 *    <jabsConfig:noIdle>
 *    <jabsConfig:canIdle>
 *
 * ----------------------------------------------------------------------------
 * HP BAR:
 * Enemies by default will have small hp bars beneath them on the map. It is a
 * nice visual indicator that it is an enemy and displays their current health.
 * However, if you have a reason to hide it (or show it), you can use the tags
 * below to do this.
 *    <jabsConfig:noHpBar>
 *    <jabsConfig:showHpBar>
 *
 * ----------------------------------------------------------------------------
 * BATTLER NAME:
 * The name of enemies is shown beneath the battler's character itself. If you
 * want to conceal or reveal this name, you can use the below tags to do that.
 *    <jabsConfig:noName>
 *    <jabsConfig:showName>
 *
 * ----------------------------------------------------------------------------
 * INVINCIBLE:
 * Enemies don't always need to be defeatable. If you want to make an enemy
 * completely invincible (combat actions will not connect with this enemy), or
 * disable said invincibility, you can using the tags below.
 *    <jabsConfig:invincible>
 *    <jabsConfig:notInvincible>
 *
 * ----------------------------------------------------------------------------
 * INANIMATE:
 * Some enemies actually aren't enemies. They are pots, crates, bushes, or
 * other various inanimate objects that are just there to be chopped up. You
 * can disable an enemy's AI, movement, knockback, hp bar, etc., all from one
 * convenient tag!
 *    <jabsConfig:inanimate>
 *    <jabsConfig:notInanimate>
 *
 * ============================================================================
 * SETTING UP THE ENEMIES IN THE DATABASE:
 * While you may wish that the enemies would just... work out of the box as
 * soon as you set them up on the map, there is a bit more to it than that! We
 * still need to define a couple of the basics for them in the database. Rather
 * than tons of notes, it'll be a bit of trait management and clicking.
 *
 * NOTE:
 * Most configuration you want to universally apply to all enemies of a given
 * id can be applied to the notes of the enemies in the database instead of on
 * every single event you create of that enemy.
 *
 * ----------------------------------------------------------------------------
 * BASIC ATTACK:
 * All enemies probably should have a "basic attack".
 * This is defined by the "Attack Skill" trait, found on the top of the third
 * page in the trait picker for enemies.
 *
 * PREPARE SPEED:
 * To emulate a "turn speed" of sorts, enemies all have a fixed amount of time
 * that they must wait before they take action. This value is defined by the
 * "Attack Speed" trait, found in the middle of the third page in the trait
 * picker for enemies.
 * ----------------------------------------------------------------------------
 * AVAILABLE SKILLS:
 * Any skills listed in the "Action Patterns" section of an enemy in the
 * database will be considered an "available skill" for use. To create a skill
 * that is usable by battlers in JABS (actors or enemies), see the "SETTING UP
 * YOUR SKILLS" section below.
 *
 * NOTE ABOUT CONDITIONS:
 * Enemies do not currently obey any conditions; they will obey their AI in
 * combination with skill cooldowns and such.
 *
 * NOTE ABOUT SKILL EXTENSION FOR ENEMIES:
 * If you are leveraging my other plugin "J-SkillExtend", then something to
 * consider is that for a skill to be extended, it must be known to the enemy
 * in some way. If a skill has a skill extend tag, they will not be available
 * for enemies to choose as a skill to perform in combat, but it will still
 * apply any extension effects as applicable.
 *
 * ============================================================================
 * SETTING UP YOUR SKILLS:
 * In addition to setting up your enemies, you'll need to setup skills as well.
 * There are a huge variety of tags to be used, but there are a few that you'll
 * probably include on most skills, and we'll go over those below.
 *
 * NOTE: This is not a comprehensive list of all tags for skills.
 *
 * ----------------------------------------------------------------------------
 * ACTION ID:
 * You setup the action map, right?
 * Well, now that you did and defined some events in there, you'll need to pick
 * one to represent what this skill looks like on the map.
 *    <actionId:EVENT_ID>
 *  Where EVENT_ID is the id of the event from the action map for this skill.
 *
 * ----------------------------------------------------------------------------
 * DURATION:
 * The duration of a skill defines how long its corresponding action event will
 * remain on the map.
 *    <duration:FRAMES>
 *  Where FRAMES is the amount of time in frames this event will exist.
 *
 * NOTE ABOUT PIERCING:
 * Skills that have a "pierce" tag, will disappear as soon as all hits connect.
 *
 * NOTE ABOUT MIN DURATION:
 * Skills still have a minimum duration of 8 frames.
 *
 * ----------------------------------------------------------------------------
 * RADIUS:
 * The radius represents how big the "shape" of this skill using tiles as the
 * measurement. This must be a positive integer value.
 *    <radius:VAL>
 *  Where VAL is the radius value for this skill.
 *
 * ----------------------------------------------------------------------------
 * PROXIMITY:
 * The proximity represents how close an AI-controlled battler must get to the
 * target before they are able to execute a skill. This has a unique
 * interaction with "direct" skills.
 *    <proximity:VAL>
 *  Where VAL is the proximity value for this skill.
 *
 * ----------------------------------------------------------------------------
 * COOLDOWN:
 * The cooldown is probably what you think it is: an amount of time in frames
 * that must pass before the battler can use the skill again.
 *    <cooldown:VAL>
 *  Where VAL is the cooldown amount in frames for this skill.
 *
 * ----------------------------------------------------------------------------
 * DIRECT:
 * For a skill with the "direct" tag, there will be no projectile produced.
 * Instead, the skill will directly target the nearest foe that is within the
 * caster's PROXIMITY. The skill will still obey other tags like CAST TIME,
 * RADIUS, HITBOX, and so on. The most common use case I can think of would
 * probably be to use this tag for healing skills, or skills you don't want to
 * have a chance at being dodged.
 *    <direct>
 *
 * NOTE ABOUT PARRYING:
 * A "direct" skill can still be parried if the conditions are met.
 *
 * ----------------------------------------------------------------------------
 * HITBOX:
 * The hitbox defines the shape of the hitbox for this skill (surprise!).
 * The value for this must be selected from the given list, and each can
 * interact a bit differently with the "radius" tag.
 *
 * NOTE:
 * It is important to remember that while the hitbox defines the shape of
 * collision, the hitbox is always centered on the action event (with some
 * exceptions), and can definitely be moving.
 *
 * RHOMBUS:
 * The "rhombus" hitbox is effectively a diamond that grows in size the
 * greater the "radius" value is.
 *    <hitbox:rhombus>
 *
 * ARC:
 * The "arc" hitbox is similar to rhombus, but instead of being a full diamond
 * all around the action event, the side that is not the direction the action
 * event is facing is omitted.
 *    <hitbox:arc>
 *
 * SQUARE:
 * The "square" hitbox is an equal square, with the "radius" defining what the
 * length of the side of the square is.
 *    <hitbox:square>
 *
 * FRONTSQUARE:
 * The "frontsquare" hitbox is similar to square, but instead of being a full
 * square all around the action event, the side that is not the direction the
 * action event is facing is omitted.
 *    <hitbox:frontsquare>
 *
 * LINE:
 * The "line" hitbox is a single 1-width line with the "radius" defining what
 * the length of this line is.
 *    <hitbox:line>
 *
 * WALL:
 * The "wall" hitbox is a single 1-height line with the "radius" defining what
 * the width of this line is. This is kind of a strange one, but easy to
 * visualize if you think of it as an inverted line hitbox.
 *    <hitbox:wall>
 *
 * CROSS:
 * The "cross" hitbox is basically just the combination of both line and wall
 * hitboxes in one. The "radius" determines how far the cross will reach.
 *    <hitbox:cross>
 *
 * ----------------------------------------------------------------------------
 * CAST TIME:
 * The "cast time" is probably what you think: a number of frames that the
 * battler executing a skill must wait helplessly before a skill is performed.
 * While the battler is casting, the "cast animation" will loop if the skill
 * has a cast animation value.
 *    <castTime:VAL>
 *  Where VAL is the number of frames to cast this skill.
 *
 * ----------------------------------------------------------------------------
 * CAST ANIMATION:
 * The "cast animation" is simply a numeric value that represents an animation
 * that will play on the caster while the skill being casted.
 *    <castAnimation:VAL>
 *  Where VAL is the animation id to repeatedly loop while casting.
 *
 * ----------------------------------------------------------------------------
 * PIERCING:
 * The "pierce" tag is a tag that enables a skill to hit multiple targets
 * multiple times, potentially with a delay between each hit.
 *    <pierce:[TIMES,DELAY]>
 *  Where TIMES is the maximum number of times this skill can pierce.
 *  Where DELAY is the number of frames between each hit.
 *
 * NOTE: The most a skill can hit via "pierce" is once per frame. If the DELAY
 * is set to 0, then it will hit each frame that the skill's hitbox collides
 * with the target.
 *
 * NOTE: The "repeats" field from the database is added onto the TIMES value,
 * even if there is no "pierce" tag on the skill, meaning if you omit the
 * "pierce" tag and add "5 repeats" via the database editor, the skill will
 * effectively have this tag on it:
 *    <pierce:[6,0]>
 *
 * ----------------------------------------------------------------------------
 * POSE SUFFIX:
 * The "pose suffix" tag enables a sort of "animation" for battlers when
 * performing their skills. The engine will seek out a file that matches their
 * own character sprite's name along with the appended suffix in the tag and
 * if that matches a valid character set, it'll swap out the current set for
 * the "pose" for the defined amount of time and switch back after.
 *    <poseSuffix:[SUFFIX,INDEX,DURATION]>
 *  Where SUFFIX is the suffix of the filename you want to swap out for.
 *  Where INDEX is the index in the character file to become.
 *  Where DURATION is the amount of frames to remain in this pose.
 *
 * EXAMPLE:
 *    <poseSuffix:[-spell,0,25]>
 * As an example, if the character using the skill was a player with a
 * character sprite named "Actor1", the above tag would look for "Actor1-spell"
 * and swap to the 0th index (the upper left-most character) for 25 frames
 * (which is about a half second).
 *
 * WARNING:
 * This is not a highly tested feature of JABS and may not work as intended.
 *
 * ============================================================================
 * @param baseConfigs
 * @text BASE SETUP
 *
 * @param maxAiUpdateRange
 * @parent baseConfigs
 * @type number
 * @min 10
 * @text Max AI Update Range
 * @desc CHANGE THIS VALUE WITH CAUTION. MAKING THIS TOO HIGH WILL CAUSE LAG IF THERE ARE LOTS(30+) OF ENEMIES IN RANGE.
 * @default 15
 *
 * @param actionMapId
 * @parent baseConfigs
 * @type number
 * @text Action Map Id
 * @desc The default id of the map used for cloning action events off of.
 * @default 2
 *
 * @param dodgeSkillTypeId
 * @parent baseConfigs
 * @type number
 * @text Dodge Skill Type Id
 * @desc The default id of the skill type that acts as a classification for dodge skills.
 * @default 1
 *
 * @param guardSkillTypeId
 * @parent baseConfigs
 * @type number
 * @text Rotate Skill Type Id
 * @desc The default id of the skill type that acts as a classification for guard skills.
 * @default 2
 *
 * @param weaponSkillTypeId
 * @parent baseConfigs
 * @type number
 * @text Weapon Skill Type Id
 * @desc The default id of the skill type that acts as a classification for weapon skills.
 * @default 7
 *
 * @param enemyDefaultConfigs
 * @text ENEMY BATTLER DEFAULTS
 *
 * @param defaultEnemyPrepareTime
 * @parent enemyDefaultConfigs
 * @type number
 * @text Default Enemy Prepare Time
 * @desc The default number of frames for "prepare" time.
 * @default 180
 *
 * @param defaultEnemyAttackSkillId
 * @parent enemyDefaultConfigs
 * @type number
 * @min 1
 * @text Default Enemy Attack Skill
 * @desc The default skill id used for an enemy basic attack where their animation is "normal attack".
 * @default 1
 *
 * @param defaultEnemySightRange
 * @parent enemyDefaultConfigs
 * @type number
 * @min 1
 * @text Default Enemy Sight Range
 * @desc The default range from a battler that they can engage in combat from.
 * @default 4
 *
 * @param defaultEnemyPursuitRange
 * @parent enemyDefaultConfigs
 * @type number
 * @min 1
 * @text Default Enemy Pursuit Range
 * @desc The default range from a battler that they can remain in combat within.
 * @default 6
 *
 * @param defaultEnemyAlertedSightBoost
 * @parent enemyDefaultConfigs
 * @type number
 * @min 1
 * @text Default Enemy Alerted Sight Boost
 * @desc The default boost to sight an enemy gains while alerted (alerted: hit from out of combat).
 * @default 2
 *
 * @param defaultEnemyAlertedPursuitBoost
 * @parent enemyDefaultConfigs
 * @type number
 * @min 1
 * @text Default Enemy Alerted Pursuit Boost
 * @desc The default boost to pursuit an enemy gains while alerted (alerted: hit from out of combat).
 * @default 4
 *
 * @param defaultEnemyAlertDuration
 * @parent enemyDefaultConfigs
 * @type number
 * @min 60
 * @text Default Enemy Alert Duration
 * @desc The default number of frames an enemy remains alerted (alerted: hit from out of combat).
 * @default 300
 *
 * @param defaultEnemyCanIdle
 * @parent enemyDefaultConfigs
 * @type boolean
 * @text Default Enemy Can Idle
 * @desc The default for whether or not enemies can idle.
 * @default true
 *
 * @param defaultEnemyShowHpBar
 * @parent enemyDefaultConfigs
 * @type boolean
 * @text Default Enemy Show HP Bar
 * @desc The default for whether or not enemies' HP bars are visible.
 * @default true
 *
 * @param defaultEnemyShowBattlerName
 * @parent enemyDefaultConfigs
 * @type boolean
 * @text Default Enemy Show Battler Name
 * @desc The default for whether or not enemies' names are visible.
 * @default true
 *
 * @param defaultEnemyIsInvincible
 * @parent enemyDefaultConfigs
 * @type boolean
 * @text Default Enemy Is Invincible
 * @desc Setting this to true will cause all enemies to be invincible by default. USE WITH CAUTION.
 * @default false
 *
 * @param defaultEnemyIsInanimate
 * @parent enemyDefaultConfigs
 * @type boolean
 * @text Default Enemy Is Inanimate
 * @desc Setting this to true will cause all enemies to be inanimate by default. USE WITH CAUTION.
 * @default false
 *
 * @param defaultConfigs
 * @text WHEN UNASSIGNED
 *
 * @param defaultToolCooldownTime
 * @parent defaultConfigs
 * @type number
 * @text Default Tool Cooldown Time
 * @desc The default number of frames for an item's cooldown if one isn't specified.
 * @default 300
 *
 * @param defaultLootExpiration
 * @parent defaultConfigs
 * @type number
 * @min -1
 * @text Default Loot Duration
 * @desc The default number of frames before an item expires from the map. Set to -1 for no expiration.
 * @default 900
 *
 * @param defaultAttackAnimationId
 * @parent defaultConfigs
 * @type number
 * @text Default Attack Animation Id
 * @desc The default id of the animation for battlers when none is defined.
 * @default 1
 *
 * @param iconConfigs
 * @text ICON CONFIGURATIONS
 *
 * @param useElementalIcons
 * @parent iconConfigs
 * @type boolean
 * @text Use Elemental Icons
 * @desc Enable or disable the display of elemental icons on damage popups with this option.
 * @default true
 *
 * @param elementalIconData
 * @parent iconConfigs
 * @type struct<ElementalIconStruct>[]
 * @text Elemental Icon Data
 * @desc The collection of element ids and their icon indices.
 * @default ["{\"elementId\":\"0\",\"iconIndex\":\"127\"}","{\"elementId\":\"1\",\"iconIndex\":\"97\"}","{\"elementId\":\"2\",\"iconIndex\":\"107\"}","{\"elementId\":\"3\",\"iconIndex\":\"110\"}","{\"elementId\":\"4\",\"iconIndex\":\"64\"}","{\"elementId\":\"5\",\"iconIndex\":\"67\"}","{\"elementId\":\"6\",\"iconIndex\":\"69\"}","{\"elementId\":\"7\",\"iconIndex\":\"68\"}","{\"elementId\":\"8\",\"iconIndex\":\"70\"}","{\"elementId\":\"9\",\"iconIndex\":\"71\"}"]
 *
 * @param animationConfigs
 * @text ACTION DECIDED ANIMATIONS
 *
 * @param attackDecidedAnimationId
 * @parent animationConfigs
 * @type animation
 * @text Attack Decided Animation Id
 * @desc The animation id that plays on the ai-controlled battler when they decide an attack-action.
 * @default 135
 *
 * @param supportDecidedAnimationId
 * @parent animationConfigs
 * @type animation
 * @text Support Decided Animation Id
 * @desc The animation id that plays on the ai-controlled battler when they decide a support-action.
 * @default 136
 *
 * @param aggroConfigs
 * @text AGGRO DEFAULTS
 *
 * @param baseAggro
 * @parent aggroConfigs
 * @type number
 * @text Base Aggro
 * @desc The base amount of aggro generated by every action, in addition to the rest of the formula.
 * @default 100
 *
 * @param aggroPerHp
 * @parent aggroConfigs
 * @type number
 * @text Aggro per HP damage
 * @desc The amount of aggro generated per 1 HP damage dealt to a non-allied target.
 * @default 1
 *
 * @param aggroPerMp
 * @parent aggroConfigs
 * @type number
 * @text Aggro per MP damage
 * @desc The amount of aggro generated per 1 MP damage dealt to a non-allied target.
 * @default 2
 *
 * @param aggroPerTp
 * @parent aggroConfigs
 * @type number
 * @text Aggro per TP damage
 * @desc The amount of aggro generated per 1 TP damage dealt to a non-allied target.
 * @default 10
 *
 * @param aggroDrainMultiplier
 * @parent aggroConfigs
 * @type number
 * @text Aggro Drain Multiplier
 * @desc If the skill was an HP Drain, then generate an additional X aggro per HP drained.
 * @default 4
 *
 * @param aggroParryFlatAmount
 * @parent aggroConfigs
 * @type number
 * @min -999999
 * @text Aggro Parry Flat Amount
 * @desc If the skill didn't connect because it was parried, add this much instead. Can be negative.
 * @default -50
 *
 * @param aggroParryUserGain
 * @parent aggroConfigs
 * @type number
 * @text Aggro Parry User Gain
 * @desc If the skill didn't connect because it was parried, aggro the attacker this much.
 * @default 200
 *
 * @param aggroPlayerReduction
 * @parent aggroConfigs
 * @type number
 * @text Aggro Player Reduction
 * @desc The player can attack much faster than AI, so reducing their aggro output by default is sensible.
 * @decimals 2
 * @default 0.50
 *
 * @param miscConfigs
 * @text MISCELLANEOUS SETUP
 *
 * @param lootPickupDistance
 * @parent miscConfigs
 * @type number
 * @text Loot Pickup Distance
 * @desc The distance of which the player must be to collect loot on the ground.
 * @decimals 2
 * @default 1.50
 *
 * @param disableTextPops
 * @parent miscConfigs
 * @type boolean
 * @text Disable Text Pops
 * @desc Whether or not to disable the text popups, including: damage, rewards, parry, etc.
 * @default false
 *
 * @param lootPickupDistance
 * @parent miscConfigs
 * @type number
 * @decimals 2
 * @text Loot Pickup Distance
 * @desc The distance of which the player must be to collect loot on the ground.
 * @default 1.50
 *
 * @param allyRubberbandAdjustment
 * @parent miscConfigs
 * @type number
 * @decimals 2
 * @text Ally Rubberband Adjustment
 * @desc A modifier on the ally rubber band range (defaults of 10). This also affects the ally AI plugin if used.
 * @default 2.00
 *
 * @param dashSpeedBoost
 * @parent miscConfigs
 * @type number
 * @decimals 2
 * @text Dash Movespeed Boost
 * @desc The boost to movement speed when dashing. You may need to toy with this a bit to get it right.
 * @default 1.25
 *
 * @param quickmenuConfigs
 * @text QUICKMENU SETUP
 *
 * @param equipCombatSkillsText
 * @parent quickmenuConfigs
 * @type string
 * @text Equip Combat Skills Text
 * @desc The text that shows up in the JABS quickmenu for the "equip combat skills" command.
 * @default Equip Combat Skills
 *
 * @param equipDodgeSkillsText
 * @parent quickmenuConfigs
 * @type string
 * @text Equip Dodge Skills Text
 * @desc The text that shows up in the JABS quickmenu for the "equip dodge skills" command.
 * @default Equip Dodge Skills
 *
 * @param equipToolsText
 * @parent quickmenuConfigs
 * @type string
 * @text Equip Tools Text
 * @desc The text that shows up in the JABS quickmenu for the "equip tools" command.
 * @default Equip Tools
 *
 * @param mainMenuText
 * @parent quickmenuConfigs
 * @type string
 * @text Main MenuText
 * @desc The text that shows up in the JABS quickmenu for the "main menu" command.
 * @default Full Menu
 *
 * @param cancelText
 * @parent quickmenuConfigs
 * @type string
 * @text Cancel Text
 * @desc The text that shows up in the JABS quickmenu for the "cancel" command.
 * @default Cancel
 *
 * @param clearSlotText
 * @parent quickmenuConfigs
 * @type string
 * @text Clear Slot Text
 * @desc The text that shows up in the JABS quickmenu for the "clear slot" command.
 * @default Clear Slot...
 *
 * @param unassignedText
 * @parent quickmenuConfigs
 * @type string
 * @text UnassignedText
 * @desc The text that shows up in the JABS quickmenu for the "- unassigned -" command.
 * @default - unassigned -
 *
 *
 *
 *
 * @command Enable JABS
 * @text Enable JABS
 * @desc Enables the JABS engine allowing battles on the map to take place.
 *
 * @command Disable JABS
 * @text Disable JABS
 * @desc Disables the JABS engine.
 *
 * @command Set JABS Skill
 * @text Assign a JABS skill
 * @desc
 * Assigns a specific skill id or (item id) to a designated slot.
 * Assigned skills will be removed if not learned (unless locked).
 * @arg actorId
 * @type actor
 * @text Choose Actor
 * @desc
 * The actor to have the skill assigned to.
 * Please don't choose "none", that'll cause the game to crash.
 * @default 1
 *
 * @arg skillId
 * @type skill
 * @text Choose Skill
 * @desc
 * The skill to be assigned to the actor.
 * You may choose "none" if you want to unassign the slot.
 * @default 0
 *
 * @arg itemId
 * @type item
 * @text Choose Item
 * @desc
 * The item to be assigned to the actor.
 * This is only for use if assigning to the "tool" slot.
 * @default 0
 *
 * @arg slot
 * @type select
 * @text Choose Slot
 * @desc The slot to assign the skill to for this actor.
 * @option Tool
 * @option Dodge
 * @option L1A
 * @option L1B
 * @option L1X
 * @option L1Y
 * @default L1A
 * @arg locked
 * @type boolean
 * @on Lock Skill
 * @off Don't Lock
 * @desc Locked skills cannot be unequipped until unlocked.
 * @default false
 *
 * @command Unlock JABS Skill Slot
 * @text Unlock a single JABS skill slot
 * @desc Unlocks a single JABS skill slot for the leader.
 * @arg Slot
 * @type select
 * @option Tool
 * @option Dodge
 * @option L1A
 * @option L1B
 * @option L1X
 * @option L1Y
 *
 * @command Unlock All JABS Skill Slots
 * @text Unlock all JABS skill slots
 * @desc Unlocks all JABS skill slots for the leader.
 *
 * @command Rotate Party Members
 * @text Cycle to next leader
 * @desc Cycles the leader to the back and shifts all members forward one slot.
 *
 * @command Disable Party Rotation
 * @text Disable Party Rotation
 * @desc Disables the player from being able to rotate the party leader.
 * (This only affects the JABS party rotate functionality.)
 *
 * @command Enable Party Rotation
 * @text Enable Party Rotation
 * @desc (Re-)Enables the ability to execute a party rotate.
 * Other conditions still apply (like not rotating to a dead member).
 *
 * @command Refresh JABS Menu
 * @text Refresh JABS Menu
 * @desc Refreshes the JABS menu in case there were any adjustments made to it.
 */
//=================================================================================================
/*~struct~ElementalIconStruct:
 * @param elementId
 * @type number
 * @desc The id of the element to match an icon to.
 * @default 0
 *
 * @param iconIndex
 * @type number
 * @desc The index of the icon for this element.
 * @default 64
*/
//=================================================================================================
/* eslint-enable max-len */

//#region Introduction
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

//#region plugin setup and configuration
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS = {};

//#region helpers
/**
 * A collection of helpful functions for use within this plugin.
 */
J.ABS.Helpers = {};

/**
 * A collection of helper functions for the use with the plugin manager.
 */
J.ABS.Helpers.PluginManager = {};

/**
 * A helpful function for translating a plugin command's slot to a valid slot.
 * @param {string} slot The slot from the plugin command to translate.
 * @returns {string} The translated slot.
 */
J.ABS.Helpers.PluginManager.TranslateOptionToSlot = slot =>
{
  switch (slot)
  {
    case "Tool":
      return JABS_Button.Tool;
    case "Dodge":
      return JABS_Button.Dodge;
    case "L1A":
      return JABS_Button.CombatSkill1;
    case "L1B":
      return JABS_Button.CombatSkill2;
    case "L1X":
      return JABS_Button.CombatSkill3;
    case "L1Y":
      return JABS_Button.CombatSkill4;
  }
};

/**
 * A helpful function for translating raw JSON from the plugin settings into elemental icon objects.
 * @param {string} obj The raw JSON.
 * @returns {{element: number, icon: number}[]} The translated elemental icon objects.
 */
J.ABS.Helpers.PluginManager.TranslateElementalIcons = obj =>
{
  // no element icons identified.
  if (!obj) return [];

  const arr = JSON.parse(obj);
  if (!arr.length) return [];
  return arr.map(el =>
  {
    const kvp = JSON.parse(el);
    const {elementId, iconIndex} = kvp;
    return {element: parseInt(elementId), icon: parseInt(iconIndex)};
  });
};
//#endregion helpers

//#region metadata
/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.Metadata = {};
J.ABS.Metadata.Name = `J-ABS`;
J.ABS.Metadata.Version = '3.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.PluginParameters = PluginManager.parameters(J.ABS.Metadata.Name);

// the most important configuration!
J.ABS.Metadata.MaxAiUpdateRange = Number(J.ABS.PluginParameters['maxAiUpdateRange']) || 20;

// defaults configurations.
J.ABS.Metadata.DefaultActionMapId = Number(J.ABS.PluginParameters['actionMapId']);
J.ABS.Metadata.DefaultDodgeSkillTypeId = Number(J.ABS.PluginParameters['dodgeSkillTypeId']);
J.ABS.Metadata.DefaultGuardSkillTypeId = Number(J.ABS.PluginParameters['guardSkillTypeId']);
J.ABS.Metadata.DefaultWeaponSkillTypeId = Number(J.ABS.PluginParameters['weaponSkillTypeId']);
J.ABS.Metadata.DefaultToolCooldownTime = Number(J.ABS.PluginParameters['defaultToolCooldownTime']);
J.ABS.Metadata.DefaultAttackAnimationId = Number(J.ABS.PluginParameters['defaultAttackAnimationId']);
J.ABS.Metadata.DefaultLootExpiration = Number(J.ABS.PluginParameters['defaultLootExpiration']);

// enemy battler default configurations.
J.ABS.Metadata.DefaultEnemyPrepareTime = Number(J.ABS.PluginParameters['defaultEnemyPrepareTime']);
J.ABS.Metadata.DefaultEnemyAttackSkillId = Number(J.ABS.PluginParameters['defaultEnemyAttackSkillId']);
J.ABS.Metadata.DefaultEnemySightRange = Number(J.ABS.PluginParameters['defaultEnemySightRange']);
J.ABS.Metadata.DefaultEnemyPursuitRange = Number(J.ABS.PluginParameters['defaultEnemyPursuitRange']);
J.ABS.Metadata.DefaultEnemyAlertedSightBoost = Number(J.ABS.PluginParameters['defaultEnemyAlertedSightBoost']);
J.ABS.Metadata.DefaultEnemyAlertedPursuitBoost = Number(J.ABS.PluginParameters['defaultEnemyAlertedPursuitBoost']);
J.ABS.Metadata.DefaultEnemyAlertDuration = Number(J.ABS.PluginParameters['defaultEnemyAlertDuration']);
J.ABS.Metadata.DefaultEnemyCanIdle = Boolean(J.ABS.PluginParameters['defaultEnemyCanIdle'] === "true");
J.ABS.Metadata.DefaultEnemyShowHpBar = Boolean(J.ABS.PluginParameters['defaultEnemyShowHpBar'] === "true");
J.ABS.Metadata.DefaultEnemyShowBattlerName = Boolean(J.ABS.PluginParameters['defaultEnemyShowBattlerName'] === "true");
J.ABS.Metadata.DefaultEnemyIsInvincible = Boolean(J.ABS.PluginParameters['defaultEnemyIsInvincible'] === "true");
J.ABS.Metadata.DefaultEnemyIsInanimate = Boolean(J.ABS.PluginParameters['defaultEnemyIsInanimate'] === "true");

// custom data configurations.
J.ABS.Metadata.UseElementalIcons = J.ABS.PluginParameters['useElementalIcons'] === "true";
J.ABS.Metadata.ElementalIcons =
  J.ABS.Helpers.PluginManager.TranslateElementalIcons(J.ABS.PluginParameters['elementalIconData']);

// action decided configurations.
J.ABS.Metadata.AttackDecidedAnimationId = Number(J.ABS.PluginParameters['attackDecidedAnimationId']);
J.ABS.Metadata.SupportDecidedAnimationId = Number(J.ABS.PluginParameters['supportDecidedAnimationId']);

// aggro configurations.
J.ABS.Metadata.BaseAggro = Number(J.ABS.PluginParameters['baseAggro']);
J.ABS.Metadata.AggroPerHp = Number(J.ABS.PluginParameters['aggroPerHp']);
J.ABS.Metadata.AggroPerMp = Number(J.ABS.PluginParameters['aggroPerMp']);
J.ABS.Metadata.AggroPerTp = Number(J.ABS.PluginParameters['aggroPerTp']);
J.ABS.Metadata.AggroDrain = Number(J.ABS.PluginParameters['aggroDrainMultiplier']);
J.ABS.Metadata.AggroParryFlatAmount = Number(J.ABS.PluginParameters['aggroParryFlatAmount']);
J.ABS.Metadata.AggroParryUserGain = Number(J.ABS.PluginParameters['aggroParryUserGain']);
J.ABS.Metadata.AggroPlayerReduction = Number(J.ABS.PluginParameters['aggroPlayerReduction']);

// miscellaneous configurations.
J.ABS.Metadata.LootPickupRange = Number(J.ABS.PluginParameters['lootPickupDistance']);
J.ABS.Metadata.DisableTextPops = Boolean(J.ABS.PluginParameters['disableTextPops'] === "true");
J.ABS.Metadata.AllyRubberbandAdjustment = Number(J.ABS.PluginParameters['allyRubberbandAdjustment']);
J.ABS.Metadata.DashSpeedBoost = Number(J.ABS.PluginParameters['dashSpeedBoost']);

// quick menu commands configurations.
J.ABS.Metadata.EquipCombatSkillsText = J.ABS.PluginParameters['equipCombatSkillsText'];
J.ABS.Metadata.EquipDodgeSkillsText = J.ABS.PluginParameters['equipDodgeSkillsText'];
J.ABS.Metadata.EquipToolsText = J.ABS.PluginParameters['equipToolsText'];
J.ABS.Metadata.MainMenuText = J.ABS.PluginParameters['mainMenuText'];
J.ABS.Metadata.CancelText = J.ABS.PluginParameters['cancelText'];
J.ABS.Metadata.ClearSlotText = J.ABS.PluginParameters['clearSlotText'];
J.ABS.Metadata.UnassignedText = J.ABS.PluginParameters['unassignedText'];
//#endregion metadata

/**
 * The various default values across the engine. Often configurable.
 */
J.ABS.DefaultValues = {
  /**
   * When an enemy JABS battler has no "prepare" defined.
   * @type {number}
   */
  EnemyNoPrepare: J.ABS.Metadata.DefaultEnemyPrepareTime,

  /**
   * The ID of the map that will contain the actions for replication.
   * @type {number}
   */
  ActionMap: J.ABS.Metadata.DefaultActionMapId,

  /**
   * The default animation id for skills when it is set to "normal attack".
   * Typically used for enemies or weaponless battlers.
   * @type {number}
   */
  AttackAnimationId: J.ABS.Metadata.DefaultAttackAnimationId,

  /**
   * The skill category that governs skills that are identified as "dodge" skills.
   * @type {number}
   */
  DodgeSkillTypeId: J.ABS.Metadata.DefaultDodgeSkillTypeId,

  /**
   * The skill category that governs skills that are identified as "guard" skills.
   * @type {number}
   */
  GuardSkillTypeId: J.ABS.Metadata.DefaultGuardSkillTypeId,

  /**
   * The skill category that governs skills that are identified as "weapon" skills.
   * @type {number}
   */
  WeaponSkillTypeId: J.ABS.Metadata.DefaultWeaponSkillTypeId,

  /**
   * When an item has no cooldown defined.
   * @type {number}
   */
  CooldownlessItems: J.ABS.Metadata.DefaultToolCooldownTime,
};

/**
 * A collection of helpful mappings for emoji balloons
 * to their numeric ID.
 */
J.ABS.Balloons = {
  /**
   * An exclamation point balloon.
   */
  Exclamation: 1,

  /**
   * A question mark balloon.
   */
  Question: 2,

  /**
   * A music note balloon.
   */
  MusicNote: 3,

  /**
   * A heart balloon.
   */
  Heart: 4,

  /**
   * An anger balloon.
   */
  Anger: 5,

  /**
   * A sweat drop balloon.
   */
  Sweat: 6,

  /**
   * A frustrated balloon.
   */
  Frustration: 7,

  /**
   * A elipses (...) or triple-dot balloon.
   */
  Silence: 8,

  /**
   * A light bulb or realization balloon.
   */
  LightBulb: 9,

  /**
   * A double-Z (zz) balloon.
   */
  Asleep: 10,

  /**
   * A green checkmark.
   */
  Check: 11,
};

/**
 * A collection of helpful mappings for `Game_Character` directions
 * to their numeric ID.
 */
J.ABS.Directions = {

  /**
   * Represents the UP direction, or 8.
   * @type {8}
   */
  UP: 8,

  /**
   * Represents the RIGTH direction, or 6.
   * @type {6}
   */
  RIGHT: 6,

  /**
   * Represents the LEFT direction, or 4.
   * @type {4}
   */
  LEFT: 4,

  /**
   * Represents the DOWN direction, or 2.
   * @type {2}
   */
  DOWN: 2,

  /**
   * Represents the diagonal LOWER LEFT direction, or 1.
   * @type {1}
   */
  LOWERLEFT: 1,

  /**
   * Represents the diagonal LOWER RIGHT direction, or 3.
   * @type {3}
   */
  LOWERRIGHT: 3,

  /**
   * Represents the diagonal UPPER LEFT direction, or 7.
   * @type {7}
   */
  UPPERLEFT: 7,

  /**
   * Represents the diagonal UPPER RIGHT direction, or 9.
   * @type {9}
   */
  UPPERRIGHT: 9,
};

/**
 * The various collision shapes an attack can be.
 */
J.ABS.Shapes = {
  /**
   * A circle shaped hitbox.
   */
  Circle: "circle",

  /**
   * A rhombus (aka diamond) shaped hitbox.
   */
  Rhombus: "rhombus",

  /**
   * A square around the target hitbox.
   */
  Square: "square",

  /**
   *  A square in front of the target hitbox.
   */
  FrontSquare: "frontsquare",

  /**
   * A line from the target hitbox.
   */
  Line: "line",

  /**
   * An arc shape hitbox in front of the action.
   */
  Arc: "arc",

  /**
   * A wall in front of the target hitbox.
   */
  Wall: "wall",

  /**
   * A cross from the target hitbox.
   */
  Cross: "cross"
};

/**
 * A collection of helpful mappings for `notes` that are placed in
 * various locations, like events on the map, or in a database enemy.
 */
J.ABS.Notetags = {
  // battler-related (goes in database on enemy/actor).
  KnockbackResist: "knockbackResist",
  MoveType: {
    Forward: "forward",
    Backward: "backward",
    Directional: "directional",
  }
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.RegExp = {
  /* ON SKILLS */
  ActionId: /<actionId:[ ]?(\d+)>/gi,

  // pre-execution-related.
  CastTime: /<castTime:[ ]?(\d+)>/gi,
  CastAnimation: /<castAnimation:[ ]?(\d+)>/gi,

  // post-execution-related.
  Cooldown: /<cooldown:[ ]?(\d+)>/gi,
  UniqueCooldown: /<uniqueCooldown>/gi,

  // projectile-related.
  Range: /<radius:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/gi,
  Proximity: /<proximity:[ ]?(\d+)>/gi,
  Projectile: /<projectile:[ ]?([12348])>/gi,
  Shape: /<hitbox:[ ]?(circle|rhombus|square|frontsquare|line|arc|wall|cross)>/gi,
  Duration: /<duration:[ ]?(\d+)>/gi,
  Knockback: /<knockback:[ ]?(\d+)>/gi,
  DelayData: /<delay:[ ]?(\[-?\d+,[ ]?(true|false)])>/gi,

  // animation-related.
  SelfAnimationId: /<selfAnimationId:[ ]?(\d+)>/gi,
  PoseSuffix: /<poseSuffix:[ ]?(\[[-_]?\w+,[ ]?\d+,[ ]?\d+])>/gi,

  // skill-combo-related.
  ComboAction: /<combo:[ ]?(\[\d+,[ ]?\d+])>/gi,
  FreeCombo: /<freeCombo>/gi,
  Direct: /<direct>/gi,

  // aggro-related.
  BonusAggro: /<aggro:[ ]?(\d+)>/gi,
  AggroMultiplier: /<aggroMultiplier:[ ]?(\d+)>/gi,

  // hits-related.
  Unparryable: /<unparryable>/gi,
  BonusHits: /<bonusHits:[ ]?(\d+)>/gi,
  PiercingData: /<pierce:[ ]?(\[\d+,[ ]?\d+])>/gi,

  // guarding-related.
  Guard: /<guard:[ ]?(\[-?\d+,[ ]?-?\d+])>/gi,
  Parry: /<parry:[ ]?(\d+)>/gi,
  CounterParry: /<counterParry:[ ]?(\[\d+(?:\.\d+)?(?:,\s*\d+(?:\.\d+)?)*])>/gi,
  CounterGuard: /<counterGuard:[ ]?(\[\d+(?:\.\d+)?(?:,\s*\d+(?:\.\d+)?)*])>/gi,

  // dodge-related.
  MoveType: /<moveType:[ ]?(forward|backward|directional)>/gi,
  InvincibleDodge: /<invincibleDodge>/gi,

  // counter-related (on-chance-effect template)
  Retaliate: /<retaliate:[ ]?(\[\d+,[ ]?\d+])>/gi,
  OnOwnDefeat: /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+])>/gi,
  onTargetDefeat: /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+])>/gi,

  /* ON SKILLS */

  /* ON EQUIPS */
  // skill-related.
  SkillId: /<skillId:[ ]?(\d+)>/gi,
  OffhandSkillId: /<offhandSkillId:[ ]?(\d+)>/gi,

  // knockback-related.
  KnockbackResist: /<knockbackResist:[ ]?(\d+)>/gi,

  // parry-related.
  IgnoreParry: /<ignoreParry:[ ]?(\d+)>/gi,
  /* ON EQUIPS */

  /* ON ITEMS */
  UseOnPickup: /<useOnPickup>/gi,
  Expires: /<expires:[ ]?(\d+)>/gi,
  /* ON ITEMS */

  /* ON STATES */
  // definition-related.
  Negative: /<negative>/gi,

  // jabs core ailment functionalities.
  Paralyzed: /<paralyzed>/gi,
  Rooted: /<rooted>/gi,
  Disarmed: /<disabled>/gi,
  Muted: /<muted>/gi,

  // aggro-related.
  AggroLock: /<aggroLock>/gi,
  AggroOutAmp: /<aggroOutAmp:[ ]?[+]?([-]?\d+[.]?\d+)?>/gi,
  AggroInAmp: /<aggroInAmp:[ ]?[+]?([-]?\d+[.]?\d+)?>/gi,

  // slip hp/mp/tp effects.
  SlipHpFlat: /<hpFlat:[ ]?(-?\d+)>/gi,
  SlipMpFlat: /<mpFlat:[ ]?(-?\d+)>/gi,
  SlipTpFlat: /<tpFlat:[ ]?(-?\d+)>/gi,
  SlipHpPercent: /<hpPercent:[ ]?(-?\d+)%?>/gi,
  SlipMpPercent: /<mpPercent:[ ]?(-?\d+)%?>/gi,
  SlipTpPercent: /<tpPercent:[ ]?(-?\d+)%?>/gi,
  SlipHpFormula: /<hpFormula:\[([+\-*/ ().\w]+)]>/gi,
  SlipMpFormula: /<mpFormula:\[([+\-*/ ().\w]+)]>/gi,
  SlipTpFormula: /<tpFormula:\[([+\-*/ ().\w]+)]>/gi,

  // state duration-related.
  StateDurationFlatPlus: /<stateDurationFlat:[ ]?([-+]?\d+)>/gi,
  StateDurationPercentPlus: /<stateDurationPerc:[ ]?([-+]?\d+)>/gi,
  StateDurationFormulaPlus: /<stateDurationForm:\[([+\-*/ ().\w]+)]>/gi,
  /* ON STATES */

  /* ON EVENTS (for enemies) */
  // core concepts.
  EnemyId: /<enemyId:[ ]?([0-9]*)>/i,
  TeamId: /<teamId:[ ]?([0-9]*)>/g,
  Sight: /<sight:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
  Pursuit: /<pursuit:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
  MoveSpeed: /<moveSpeed:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
  PrepareTime: /<prepare:[ ]?([0-9]*)>/i,

  // alert-related.
  AlertDuration: /<alertDuration:[ ]?([0-9]*)>/i,
  AlertedSightBoost: /<alertedSightBoost:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
  AlertedPursuitBoost: /<alertedPursuitBoost:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,

  // ai traits.
  AiTraitCareful: /<aiTrait:[ ]?careful>/i,
  AiTraitExecutor: /<aiTrait:[ ]?executor>/i,
  AiTraitReckless: /<aiTrait:[ ]?reckless>/i,
  AiTraitHealer: /<aiTrait:[ ]?healer>/i,
  AiTraitFollower: /<aiTrait:[ ]?follower>/i,
  AiTraitLeader: /<aiTrait:[ ]?leader>/i,

  // miscellaneous combat configurables.
  ConfigNoIdle: /<jabsConfig:[ ]?noIdle>/i,
  ConfigCanIdle: /<jabsConfig:[ ]?canIdle>/i,
  ConfigNoHpBar: /<jabsConfig:[ ]?noHpBar>/i,
  ConfigShowHpBar: /<jabsConfig:[ ]?showHpBar>/i,
  ConfigInanimate: /<jabsConfig:[ ]?inanimate>/i,
  ConfigNotInanimate: /<jabsConfig[ ]?:notInanimate>/i,
  ConfigInvincible: /<jabsConfig:[ ]?invincible>/i,
  ConfigNotInvincible: /<jabsConfig:[ ]?notInvincible>/i,
  ConfigNoName: /<jabsConfig:[ ]?noName>/i,
  ConfigShowName: /<jabsConfig:[ ]?showName>/i,

  /* ON EVENTS (for enemies) */
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.Aliased = {
  DataManager: {},
  Game_Actor: new Map(),
  Game_Action: {},
  Game_ActionResult: new Map(),
  Game_Battler: {},
  Game_BattlerBase: {},
  Game_Character: {},
  Game_CharacterBase: {},
  Game_Enemy: new Map(),
  Game_Event: {},
  Game_Follower: {},
  Game_Followers: {},
  Game_Interpreter: {},
  Game_Map: new Map(),
  Game_Party: new Map(),
  Game_Player: {},
  Game_Unit: {},
  RPG_Actor: new Map(),
  RPG_Enemy: new Map(),
  RPG_Skill: new Map(),
  Scene_Load: {},
  Scene_Map: {},
  Spriteset_Map: {},
  Sprite_Character: new Map(),
  Sprite_Damage: {},
  Sprite_Gauge: {},
};
//#endregion Plugin setup & configuration

//#region Plugin Command Registration
/**
 * Plugin command for enabling JABS.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Enable JABS", () =>
{
  $jabsEngine.absEnabled = true;
});

/**
 * Plugin command for disabling JABS.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Disable JABS", () =>
{
  $jabsEngine.absEnabled = false;
});

/**
 * Plugin command for assigning and locking a skill to a designated slot.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Set JABS Skill", args =>
{
  // extract the values out of the various args.
  const {actorId, skillId, itemId, slot, locked} = args;

  // convert the text option to one of the available slots.
  const skillSlotKey = J.ABS.Helpers.PluginManager.TranslateOptionToSlot(slot);

  // determine the actor.
  const actor = $gameActors.actor(parseInt(actorId));

  // designate the default assigned id to be the skill id.
  let assignedId = parseInt(skillId);

  // check if we are assigning to the tool slot and have an item id available.
  if (itemId !== 0 && skillSlotKey === JABS_Button.Tool)
  {
    // overwrite any possible skill id with the item id instead.
    assignedId = parseInt(itemId);
  }

  // don't try to assign anything if we don't have an id to assign.
  if (assignedId === 0) return;

  // determine the locked state of the skill being assigned.
  const isLocked = locked === 'true';

  // assign the id to the slot.
  actor.setEquippedSkill(skillSlotKey, assignedId, isLocked);
});

/**
 * Plugin command for unlocking a specific JABS skill slot.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Unlock JABS Skill Slot", args =>
{
  const leader = $gameParty.leader();
  if (!leader)
  {
    console.warn("There is no leader to manage skills for.");
    return;
  }

  const {Slot} = args;
  const translation = J.ABS.Helpers.PluginManager.TranslateOptionToSlot(Slot);
  leader.unlockSlot(translation);
});

/**
 * Plugin command for unlocking all JABS skill slots.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Unlock All JABS Skill Slots", () =>
{
  const leader = $gameParty.leader();
  if (!leader)
  {
    console.warn("There is no leader to manage skills for.");
    return;
  }

  leader.unlockAllSlots();
});

/**
 * Plugin command for cycling through party members forcefully.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Rotate Party Members", () =>
{
  JABS_InputAdapter.performPartyCycling(true);
});

/**
 * Plugin command for disabling the ability to rotate party members.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Disable Party Rotation", () =>
{
  $gameParty.disablePartyCycling();
});

/**
 * Plugin command for enabling the ability to rotate party members.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Enable Party Rotation", () =>
{
  $gameParty.enablePartyCycling();
});

/**
 * Plugin command for updating the JABS menu.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Refresh JABS Menu", () =>
{
  $jabsEngine.requestJabsMenuRefresh = true;
});

/**
 * Registers a plugin command for dealing arbitrary damage to an enemy based
 * on the event id associated with the target.
 */
// PluginManager. registerCommand(J.ABS.Metadata.Name, "HP Damage to Enemy", args =>
// {
//   // extract the event ids and damage from the plugin args.
//   const { eventIds, dmg } = args;
//
//   // translate the damage.
//   const damageToDeal = parseInt(dmg) * -1;
//
//   // translate the event ids.
//   const targetEventIds = JSON.parse(eventIds);
//
//   // iterate over all parsed event ids.
//   targetEventIds.forEach(eventId =>
//   {
//     // scan the map for the matching event id.
//     const [targetEnemy] = $gameMap.findBattlerByEventId(eventId);
//
//     // check to see if we found one.
//     if (targetEnemy)
//     {
//       // apply the damage directly to the target's hp.
//       targetEnemy.getBattler().gainHp(damageToDeal);
//     }
//   });
// });

//#endregion Plugin Command Registration
//#endregion Introduction

//#region JABS_Action
/**
 * An object that binds a `Game_Action` to a `Game_Event` on the map.
 */
class JABS_Action
{
  /**
   * The minimum duration a `JABS_Action` must exist visually before cleaning it up.
   *
   * All actions should exist visually for at least 8 frames.
   * @returns {8} The minimum number of frames, 8.
   */
  static getMinimumDuration()
  {
    return 8;
  }

  /**
   * @constructor
   * @param {string} uuid This action's unique identifier.
   * @param {RPG_Skill} baseSkill The skill retrieved from `$dataSkills[id]`.
   * @param {number} teamId A shorthand for the team id this skill belongs to.
   * @param {Game_Action} gameAction The underlying action associated with this `JABS_Action`.
   * @param {JABS_Battler} caster The `JABS_Battler` who created this `JABS_Action`.
   * @param {boolean} isRetaliation Whether or not this is a retaliation action.
   * @param {number} direction The direction this action will face initially.
   * @param {string?} cooldownKey Whether or not this is a direct action.
   */
  constructor({uuid, baseSkill, teamId, gameAction, caster, isRetaliation, direction, cooldownKey})
  {
    /**
     * The unique identifier for this action.
     *
     * All actions that are bound to an event have this.
     * @type {string}
     */
    this._uuid = uuid;

    /**
     * The base skill object, in case needed for something.
     * @type {RPG_Skill}
     */
    this._baseSkill = gameAction.item();

    /**
     * The team the owner of this skill is a part of.
     * @type {number}
     */
    this._teamId = teamId;

    /**
     * The `Game_Action` to bind to the `Game_Event` and `JABS_Battler`.
     * @type {Game_Action}
     */
    this._gameAction = gameAction;

    /**
     * The `JABS_Battler` that used created this `JABS_Action`.
     * @type {JABS_Battler}
     */
    this._caster = caster;

    /**
     * Whether or not this action was generated as a retaliation to another battler's action.
     * @type {boolean}
     */
    this._isRetaliation = isRetaliation;

    /**
     * The direction this projectile will initially face and move.
     * @type {number}
     */
    this._facing = direction;

    /**
     * The type of action this is. Used for mapping cooldowns to the appropriate slot on the caster.
     * @type {string}
     */
    this._actionCooldownType = cooldownKey ?? "global";

    this.initMembers();
  }

  /**
   * Initializes all properties on this class.
   */
  initMembers()
  {
    /**
     * The current timer on this particular action.
     * @type {number}
     */
    this._currentDuration = 0;

    /**
     * Whether or not the visual of this map action needs removing.
     * @type {boolean}
     */
    this._needsRemoval = false;

    /**
     * The `Game_Event` this `JABS_Action` is bound to. Represents the visual aspect on the map.
     * @type {Game_Event}
     */
    this._actionSprite = null;

    /**
     * The duration remaining before this will action will autotrigger.
     * @type {number}
     */
    this._delayDuration = this._baseSkill.jabsDelayDuration ?? 0;

    /**
     * Whether or not this action will trigger when an enemy touches it.
     * @type {boolean}
     */
    this._triggerOnTouch = this._baseSkill.jabsDelayTriggerByTouch ?? false;

    /**
     * The remaining number of times this action can pierce a target.
     * @type {number}
     */
    this._pierceTimesLeft = this.makePiercingCount();

    /**
     * The base pierce delay in frames.
     * @type {number}
     */
    this._basePierceDelay = this._baseSkill.jabsPierceDelay;

    /**
     * The current pierce delay in frames.
     * @type {number}
     */
    this._currentPierceDelay = 0;

    /**
     * The animation id to be performed on the action itself upon execution.
     * @type {number}
     */
    this._selfAnimationId = this._baseSkill.jabsSelfAnimationId ?? 0;
  }

  /**
   * Combines from all available sources the bonus hits for this action.
   * @returns {number}
   */
  makePiercingCount()
  {
    let pierceCount = this._baseSkill.jabsPierceCount;

    // handle skill extension bonuses.
    if (J.EXTEND)
    {
      // check if there is an underlying item to parse repeats off of.
      pierceCount += this._gameAction._item
        // skill extensions borrow from the extended skill repeats instead.
        ? this._gameAction._item._item.repeats - 1
        // no extended skill, no bonus repeats.
        : 0;
    }


    // handle other bonus hits for basic attacks.
    const isBasicAttack = [JABS_Button.Mainhand, JABS_Button.Offhand].includes(this.getCooldownType());
    pierceCount += this._caster.getAdditionalHits(this._baseSkill, isBasicAttack);

    return pierceCount;
  }

  /**
   * Executes additional logic before this action is disposed.
   */
  preCleanupHook()
  {
    // handle self-targeted animations on cleanup.
    this.handleSelfAnimationOnDefeat();
  }

  /**
   * If the action has an animation to cast on oneself, then execute it.
   */
  handleSelfAnimationOnDefeat()
  {
    // handle self-targeted animations on cleanup.
    const event = this.getActionSprite();

    // check if the action has an animation to play before destroying.
    if (this.hasSelfAnimationId())
    {
      // play it on oneself.
      event.requestAnimation(this.getSelfAnimationId());
    }
  }

  /**
   * Gets whether or not this action has a self animation id.
   * @returns {boolean}
   */
  hasSelfAnimationId()
  {
    return this.getSelfAnimationId() !== 0;
  }

  /**
   * Gets the self animation id to display on oneself when
   * performing this action.
   * @returns {number}
   */
  getSelfAnimationId()
  {
    return this._selfAnimationId;
  }

  /**
   * Performs the self animation upon this action.
   */
  performSelfAnimation()
  {
    this.getActionSprite().requestAnimation(this.getSelfAnimationId());
  }

  /**
   * Gets the `uuid` of this action.
   *
   * If one is not returned, then it is probably a direct action with no event representing it.
   * @returns {string|null}
   */
  getUuid()
  {
    return this._uuid;
  }

  /**
   * Gets the base skill this `JABS_Action` is based on.
   * @returns {RPG_Skill} The base skill of this `JABS_Action`.
   */
  getBaseSkill()
  {
    return this._baseSkill;
  }

  /**
   * Gets the team id of the caster of this action.
   * @returns {number} The team id of the caster of this `JABS_Action`.
   */
  getTeamId()
  {
    return this.getCaster().getTeam();
  }

  /**
   * The base game action this `JABS_Action` is based on.
   * @returns {Game_Action} The base game action for this action.
   */
  getAction()
  {
    return this._gameAction;
  }

  /**
   * Gets the `JABS_Battler` that created this `JABS_Action`.
   * @returns {JABS_Battler} The caster of this `JABS_Action`.
   */
  getCaster()
  {
    return this._caster;
  }

  /**
   * Gets the cast animation id for this action.
   * @returns {number|null}
   */
  getCastAnimation()
  {
    return this.getBaseSkill().jabsCastAnimation;
  }

  /**
   * Gets whether or not this action is unparryable.
   * @returns {boolean}
   */
  isUnparryable()
  {
    return !!this.getBaseSkill().jabsUnparryable;
  }

  /**
   * Whether or not this action is a retaliation- meaning it will not invoke retaliation.
   * @returns {boolean} True if it is a retaliation, false otherwise.
   */
  isRetaliation()
  {
    return this._isRetaliation;
  }

  /**
   * Gets the direction this action is facing.
   * @returns {2|4|6|8|1|3|7|9}
   */
  direction()
  {
    return this._facing || this.getActionSprite().direction();
  }

  /**
   * Gets the name of the cooldown for this action.
   * @returns {string} The cooldown key for this action.
   */
  getCooldownType()
  {
    return this._actionCooldownType;
  }

  /**
   * Sets the name of the cooldown for tracking on the caster.
   * @param {string} type The name of the cooldown that this leverages.
   */
  setCooldownType(type)
  {
    this._actionCooldownType = type;
  }

  /**
   * Gets the durations remaining on this `JABS_Action`.
   */
  getDuration()
  {
    return this._currentDuration;
  }

  /**
   * Gets the max duration in frames that this action will exist on the map.
   * If the duration was unset, or is set but less than the minimum, it will be the minimum.
   * @returns {number} The max duration in frames (min 8).
   */
  getMaxDuration()
  {
    return Math.max(this.getBaseSkill().jabsDuration, JABS_Action.getMinimumDuration())
  }

  /**
   * Increments the duration for this `JABS_Action`. If the duration drops
   * to or below 0, then it will also flag this `JABS_Action` for removal.
   */
  countdownDuration()
  {
    this._currentDuration++;
    if (this.getMaxDuration() <= this._currentDuration)
    {
      this.setNeedsRemoval();
    }
  }

  /**
   * Gets whether or not this action is expired and should be removed.
   * @returns {boolean} True if expired and past the minimum count, false otherwise.
   */
  isActionExpired()
  {
    const isExpired = this.getMaxDuration() <= this._currentDuration;
    const minDurationElapsed = this._currentDuration > JABS_Action.getMinimumDuration();
    return (isExpired && minDurationElapsed);
  }

  /**
   * Gets whether or not this `JABS_Action` needs removing.
   * @returns {boolean} Whether or not this action needs removing.
   */
  getNeedsRemoval()
  {
    return this._needsRemoval;
  }

  /**
   * Sets whether or not this `JABS_Action` needs removing.
   * @param {boolean} remove Whether or not to remove this `JABS_Action`.
   */
  setNeedsRemoval(remove = true)
  {
    this._needsRemoval = remove;
  }

  /**
   * Gets the `Game_Event` this `JABS_Action` is bound to.
   * The `Game_Event` represents the visual aspect of this action.
   * @returns {Game_Event}
   */
  getActionSprite()
  {
    return this._actionSprite;
  }

  /**
   * Binds this `JABS_Action` to a provided `Game_Event`.
   * @param {Game_Event} actionSprite The `Game_Event` to bind to this `JABS_Action`.
   */
  setActionSprite(actionSprite)
  {
    this._actionSprite = actionSprite;
  }

  /**
   * Decrements the pre-countdown delay timer for this action. If the action does not
   * have `touchOnTrigger`, then the action will not affect anyone until the timer expires.
   */
  countdownDelay()
  {
    if (this._delayDuration > 0)
    {
      this._delayDuration--;
    }
  }

  /**
   * Gets whether or not the delay on this action has completed.
   *
   * This also includes if an action never had a delay to begin with.
   * @returns {boolean}
   */
  isDelayCompleted()
  {
    return this._delayDuration <= 0 && !this.isEndlessDelay();
  }

  /**
   * Automatically finishes the delay regardless of its current status.
   */
  endDelay()
  {
    this._delayDuration = 0;
  }

  /**
   * Gets whether or not this action will be delayed until triggered.
   * @returns {boolean}
   */
  isEndlessDelay()
  {
    return this._delayDuration === -1;
  }

  /**
   * Gets whether or not this action will be triggered by touch, regardless of its
   * delay counter.
   *
   * If `isEndlessDelay()` applies to this action, then it will automatically
   * trigger by touch regardless of configuration.
   * @returns {boolean}
   */
  triggerOnTouch()
  {
    return this._triggerOnTouch || this.isEndlessDelay();
  }

  /**
   * Gets the number of times this action can potentially hit a target.
   * @returns {number} The number of times remaining that this action can hit a target.
   */
  getPiercingTimes()
  {
    return this._pierceTimesLeft;
  }

  /**
   * Modifies the piercing times counter of this action by an amount (default = 1). If an action
   * reaches zero or less times, then it also sets it up for removal.
   * @param {number} decrement The number to decrement the times counter by for this action.
   */
  modPiercingTimes(decrement = 1)
  {
    this._pierceTimesLeft -= decrement;
    if (this._pierceTimesLeft <= 0)
    {
      this.setNeedsRemoval();
    }
  }

  /**
   * Gets the delay between hits for this action.
   * @returns {number} The number of frames between repeated hits.
   */
  getPiercingDelay()
  {
    return this._currentPierceDelay;
  }

  /**
   * Modifies the piercing delay by this amount (default = 1). If a negative number is
   * provided, then this will increase the delay by that amount instead.
   * @param {number} decrement The amount to modify the delay by.
   */
  modPiercingDelay(decrement = 1)
  {
    this._currentPierceDelay -= decrement;
  }

  /**
   * Resets the piercing delay of this action back to it's base.
   */
  resetPiercingDelay()
  {
    this._currentPierceDelay = this._basePierceDelay;
  }

  /**
   * Gets whether or not this action is a direct-targeting action.
   * @returns {boolean}
   */
  isDirectAction()
  {
    return this.getBaseSkill().jabsDirect ?? false;
  }

  /**
   * Gets whether or not this action is a support action.
   * @returns {boolean}
   */
  isSupportAction()
  {
    return this._gameAction.isForFriend();
  }

  /**
   * Gets the cooldown time for this skill.
   * @returns {number} The cooldown frames of this `JABS_Action`.
   */
  getCooldown()
  {
    return this.getBaseSkill().jabsCooldown ?? 0;
  }

  /**
   * Gets the range of which this `JABS_Action` will reach.
   * @returns {number} The range of this action.
   */
  getRange()
  {
    return this.getBaseSkill().jabsRadius;
  }

  /**
   * Gets the cast time for this skill.
   * @returns {number}
   */
  getCastTime()
  {
    return this.getBaseSkill().jabsCastTime ?? 0;
  }

  /**
   * Gets the proximity to the target in order to use this `JABS_Action`.
   * @returns {number} The proximity required for this action.
   */
  getProximity()
  {
    // check if the scope is "user".
    if (this.isForSelf())
    {
      // proximity for usable skills of scope "user" is unlimited.
      return 9999;
    }

    // return the proximity from the underlying skill.
    return this.getBaseSkill().jabsProximity;
  }

  /**
   * Whether or not the scope of this action is "User" or not.
   * @returns {boolean}
   */
  isForSelf()
  {
    return this.getBaseSkill().scope === 11;
  }

  /**
   * Gets the shape of the hitbox for this `JABS_Action`.
   * @returns {string} The designated shape of the action.
   */
  getShape()
  {
    return this.getBaseSkill().jabsShape;
  }

  /**
   * Gets the knockback of this action.
   * @returns {number|null}
   */
  getKnockback()
  {
    return this.getBaseSkill().jabsKnockback;
  }

  /**
   * Gets the event id associated with this `JABS_Action` from the action map.
   * This MUST have a numeric return value, and thus will default to eventId 1
   * on the action map if none is present.
   * @returns {number}
   */
  getActionId()
  {
    return this.getBaseSkill().jabsActionId ?? 1;
  }

  /**
   * Gets any additional aggro this skill generates.
   * @returns {number}
   */
  bonusAggro()
  {
    return this.getBaseSkill().jabsBonusAggro ?? 0;
  }

  /**
   * Gets the aggro multiplier from this skill.
   * @returns {number}
   */
  aggroMultiplier()
  {
    return this.getBaseSkill().jabsAggroMultiplier ?? 1.0;
  }
}
//#endregion JABS_Action

//#region JABS_Aggro
/**
 * A tracker for managing the aggro for this particular battler and its owner.
 */
function JABS_Aggro()
{
  this.initialize(...arguments);
}

JABS_Aggro.prototype = {};
JABS_Aggro.prototype.constructor = JABS_Aggro;

/**
 * Initializes this class and it's members.
 * @param {string} uuid The uuid of the battler.
 */
JABS_Aggro.prototype.initialize = function(uuid)
{
  /**
   * The unique identifier of the battler this aggro is tracked for.
   * @type {string}
   */
  this.battlerUuid = uuid;

  /**
   * The numeric measurement of aggro from this battler.
   * @type {number}
   */
  this.aggro = 0;

  /**
   * Whether or not the aggro is locked at it's current value.
   * @type {boolean}
   */
  this.locked = false;
};

/**
 * Gets the `uuid` of the battler this aggro is associated with.
 * @returns {string}
 */
JABS_Aggro.prototype.uuid = function()
{
  return this.battlerUuid;
};

/**
 * Sets a lock on this aggro to prevent any modification of the aggro
 * regarding this battler.
 */
JABS_Aggro.prototype.lock = function()
{
  this.locked = true;
};

/**
 * Removes the lock on this aggro to allow modification of the aggro
 * regarding this battler.
 */
JABS_Aggro.prototype.unlock = function()
{
  this.locked = false;
};

/**
 * Resets the aggro back to 0.
 * Will do nothing if aggro is locked unless forced.
 */
JABS_Aggro.prototype.resetAggro = function(forced = false)
{
  if (this.locked && !forced) return;
  this.aggro = 0;
};

/**
 * Sets the aggro to a specific value.
 * Will do nothing if aggro is locked unless forced.
 */
JABS_Aggro.prototype.setAggro = function(newAggro, forced = false)
{
  if (this.locked && !forced) return;

  this.aggro = newAggro;
};

/**
 * Modifies the aggro by a given amount.
 * Can be negative.
 * Will do nothing if aggro is locked unless forced.
 * @param {number} modAggro The amount to modify.
 * @param {boolean} forced Forced aggro modifications override "aggro lock".
 */
JABS_Aggro.prototype.modAggro = function(modAggro, forced = false)
{
  if (this.locked && !forced) return;

  this.aggro += modAggro;
  if (this.aggro < 0) this.aggro = 0;
};
//#endregion JABS_Aggro

//#region JABS_Battler
/**
 * An object that represents the binding of a `Game_Event` to a `Game_Battler`.
 * This can be for either the player, an ally, or an enemy.
 */
function JABS_Battler()
{
  this.initialize(...arguments);
}

//#region initialize battler
JABS_Battler.prototype = {};
JABS_Battler.prototype.constructor = JABS_Battler;

/**
 * Initializes this JABS battler.
 * @param {Game_Event} event The event the battler is bound to.
 * @param {Game_Actor|Game_Enemy} battler The battler data itself.
 * @param {JABS_BattlerCoreData} battlerCoreData The core data for the battler.
 */
JABS_Battler.prototype.initialize = function(event, battler, battlerCoreData)
{
  /**
   * The character/sprite that represents this battler on the map.
   * @type {Game_Event|Game_Player|Game_Follower}
   */
  this._event = event;

  /**
   * The battler data that represents this battler's stats and information.
   * @type {Game_Actor|Game_Enemy}
   */
  this._battler = battler;

  /**
   * Whether or not the battler is hidden.
   * Hidden AI-controlled battlers (like enemies) will not take action, nor will they
   * be targetable.
   * @type {boolean}
   */
  this._hidden = false;
  this.initCoreData(battlerCoreData);
  this.initFromNotes();
  this.initGeneralInfo();
  this.initBattleInfo();
  this.initIdleInfo();
  this.initPoseInfo();
  this.initCooldowns();
};

/**
 * Initializes the battler's core data from the comments.
 * @param {JABS_BattlerCoreData} battlerCoreData
 */
JABS_Battler.prototype.initCoreData = function(battlerCoreData)
{
  /**
   * The id of the battler in the database.
   * @type {number}
   */
  this._battlerId = battlerCoreData.battlerId();

  /**
   * The team that this battler fights for.
   * @type {number}
   */
  this._team = battlerCoreData.team();

  /**
   * The distance this battler requires before it will engage with a non-allied target.
   * @type {number}
   */
  this._sightRadius = battlerCoreData.sightRange();

  /**
   * The boost this battler gains to their sight range while alerted.
   * @type {number}
   */
  this._alertedSightBoost = battlerCoreData.alertedSightBoost();

  /**
   * The distance this battler will allow for its target to be from itself before it disengages.
   * @type {number}
   */
  this._pursuitRadius = battlerCoreData.pursuitRange();

  /**
   * The boost this battler gains to their pursuit range while alerted.
   * @type {number}
   */
  this._alertedPursuitBoost = battlerCoreData.alertedPursuitBoost();

  /**
   * The duration in frames that this battler remains in an alerted state.
   * @type {number}
   */
  this._alertDuration = battlerCoreData.alertDuration();

  /**
   * The `JABS_BattlerAI` of this battler.
   * Only utilized by AI (duh).
   * @type {JABS_BattlerAI}
   */
  this._aiMode = battlerCoreData.ai();

  /**
   * Whether or not this battler is allowed to move around while idle.
   * @type {boolean}
   */
  this._canIdle = battlerCoreData.isInanimate()
    ? false // don't move idly if inanimate.
    : battlerCoreData.canIdle();

  /**
   * Whether or not this battler's hp bar is visible.
   * Inanimate battlers do not show their hp bar by default.
   * @type {boolean}
   */
  this._showHpBar = battlerCoreData.isInanimate()
    ? false // don't show hp bar if inanimate.
    : battlerCoreData.showHpBar();

  /**
   * Whether or not this battler's name is visible.
   * Inanimate battlers do not show their name by default.
   * @type {boolean}
   */
  this._showBattlerName = battlerCoreData.isInanimate()
    ? false // don't show battler name if inanimate.
    : battlerCoreData.showBattlerName();

  /**
   * Whether or not this battler is invincible, rendering them unable
   * to be collided with by map actions.
   * @type {boolean}
   */
  this._invincible = battlerCoreData.isInvincible();

  /**
   * Whether or not this battler is inanimate.
   * Inanimate battlers don't move, can't be alerted, and have no hp bar.
   * Ideal for destructibles like crates or traps.
   * @type {boolean}
   */
  this._inanimate = battlerCoreData.isInanimate();
};

/**
 * Initializes the properties of this battler that are directly derived from notes.
 */
JABS_Battler.prototype.initFromNotes = function()
{
  /**
   * The number of frames to fulfill the "prepare" phase of a battler's engagement.
   * Only utilized by AI.
   * @type {number}
   */
  this._prepareMax = this.getPrepareTime();
};

/**
 * Initializes the properties of this battler that are not related to anything in particular.
 */
JABS_Battler.prototype.initGeneralInfo = function()
{
  /**
   * Whether or not the movement for this battler is locked.
   * @type {boolean}
   */
  this._movementLock = false;

  /**
   * Whether or not this battler is waiting.
   * @type {boolean} True if battler is waiting, false otherwise.
   */
  this._waiting = false;

  /**
   * The counter for how long this battler is waiting.
   * @type {number}
   */
  this._waitCounter = 0;
};

/**
 * Initializes all properties that don't require input parameters.
 */
JABS_Battler.prototype.initBattleInfo = function()
{
  /**
   * The id of the last skill that was executed by this battler.
   * @type {number}
   */
  this._lastUsedSkillId = 0;

  /**
   * The current phase of AI battling that this battler is in.
   * Only utilized by AI.
   * @type {number}
   */
  this._phase = 1;

  /**
   * The counter for preparing an action to execute for the AI.
   * Only utilized by AI.
   * @type {number}
   */
  this._prepareCounter = 0;

  /**
   * Whether or not this battler is finished with its "prepare" time and ready to
   * advance to phase 2 of combat.
   * @type {boolean}
   */
  this._prepareReady = false;

  /**
   * The counter for after a battler's action is executed.
   * Only utilized by AI.
   * @type {number}
   */
  this._postActionCooldown = 0;

  /**
   * The number of frames a skill requires as cooldown when executed by AI.
   * Only utilized by AI.
   * @type {number}
   */
  this._postActionCooldownMax = 0;

  /**
   * Whether or not this battler is ready to return to it's prepare phase.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._postActionCooldownComplete = true;

  /**
   * The number of frames a skill requires prior to execution.
   * @type {number}
   */
  this._castTimeCountdown = 0;

  /**
   * Whether or not this battler is currently in a casting state.
   * @type {boolean}
   */
  this._casting = false;

  /**
   * Whether or not this battler is engaged in combat with a target.
   * @type {boolean}
   */
  this._engaged = false;

  /**
   * Whether or not this battler can actually engage with any targets.
   * @type {boolean}
   */
  this._engagementLock = false;

  /**
   * The targeted `JABS_Battler` that this battler is attempting to battle with.
   * @type {JABS_Battler}
   */
  this._target = null;

  /**
   * The `JABS_Battler` that was last hit by any action from this battler.
   * @type {JABS_Battler}
   */
  this._lastHit = null;

  /**
   * The targeted `JABS_Battler` that this battler is aiming to support.
   * @type {JABS_Battler}
   */
  this._allyTarget = null;

  /**
   * Whether or not this target is alerted. Alerted targets have an expanded
   * sight and pursuit range.
   * @type {boolean}
   */
  this._alerted = false;

  /**
   * The counter for managing alertedness.
   * @type {number}
   */
  this._alertedCounter = 0;

  /**
   * A snapshot of the coordinates of the battler who triggered the alert
   * at the time this battler was alerted.
   * @type {[number, number]}
   */
  this._alertedCoordinates = [0, 0];

  /**
   * Whether or not the battler is in position to execute an action.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._inPosition = false;

  /**
   * The action decided by this battler. Remains `null` until an action is selected
   * in combat.
   * Only utilized by AI.
   * @type {JABS_Action[]}
   */
  this._decidedAction = null;

  /**
   * A queue of actions pending execution from a designated leader.
   * @type {number|null}
   */
  this._leaderDecidedAction = null;

  /**
   * The `uuid` of the leader that is leading this battler.
   * This is only used for followers to prevent multiple leaders for commanding them.
   * @type {string}
   */
  this._leaderUuid = String.empty;

  /**
   * A collection of `uuid`s from all follower battlers this battler is leading.
   * If this battler's AI does not contain the "leader" trait, this is unused.
   * @type {string[]}
   */
  this._followers = [];

  /**
   * The counter that governs slip effects like regeneration or poison.
   * @type {number}
   */
  this._regenCounter = 1;

  /**
   * The distance in steps/tiles/squares that the dodge will move the battler.
   * @type {number}
   */
  this._dodgeSteps = 0;

  /**
   * Whether or not this battler is dodging.
   * @type {boolean}
   */
  this._dodging = false;

  /**
   * The direction of which this battler is dodging.
   * Always `0` until a dodge is executed.
   * @type {number}
   */
  this._dodgeDirection = 0;

  /**
   * Whether or not this battler is guarding.
   * @type {boolean}
   */
  this._isGuarding = false;

  /**
   * The flat amount to reduce damage by when guarding.
   * @type {number}
   */
  this._guardFlatReduction = 0;

  /**
   * The percent amount to reduce damage by when guarding.
   * @type {number}
   */
  this._guardPercReduction = 0;

  /**
   * The number of frames at the beginning of activating guarding where
   * the first hit will be parried instead.
   * @type {number}
   */
  this._parryWindow = 0;

  /**
   * The id of the skill to retaliate with when successfully precise-parrying.
   * @type {number[]}
   */
  this._counterParryIds = [];

  /**
   * The id of the skill to retaliate with when successfully guarding.
   * @type {number}
   */
  this._counterGuardIds = 0;

  /**
   * The id of the skill associated with the guard data.
   * @type {number}
   */
  this._guardSkillId = 0;

  /**
   * Whether or not this battler is in a state of dying.
   * @type {boolean}
   */
  this._dying = false;

  /**
   * All currently tracked battler's aggro for this battler.
   * @type {JABS_Aggro[]}
   */
  this._aggros = [];
};

/**
 * Initializes the properties of this battler that are related to idling/phase0.
 */
JABS_Battler.prototype.initIdleInfo = function()
{
  /**
   * The initial `x` coordinate of where this battler was placed in the RMMZ editor or
   * was when the map was recreated (in the instance the RM user is leveraging a plugin that persists
   * event location after a map transfer).
   * @type {number}
   */
  this._homeX = this._event._x;

  /**
   * The initial `y` coordinate of where this battler was placed in the RMMZ editor or
   * was when the map was recreated (in the instance the RM user is leveraging a plugin that persists
   * event location after a map transfer).
   * @type {number}
   */
  this._homeY = this._event._y;

  /**
   * Whether or not this battler is identified as idle. Idle battlers are not
   * currently engaged, but instead executing their phase 0 movement pattern based on AI.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._idle = true;

  /**
   * The counter for frames until this battler's idle action is ready.
   * Only utilized by AI.
   * @type {number}
   */
  this._idleActionCount = 0;

  /**
   * The number of frames until this battler's idle action is ready.
   * Only utilized by AI.
   * @type {number}
   */
  this._idleActionCountMax = 30;

  /**
   * Whether or not the idle action is ready to execute.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._idleActionReady = false;
};

/**
 * Initializes the properties of this battler that are related to the character posing.
 */
JABS_Battler.prototype.initPoseInfo = function()
{
  /**
   * The number of frames to pose for.
   * @type {number}
   */
  this._poseFrames = 0;

  /**
   * Whether or not this battler is currently posing.
   * @type {boolean}
   */
  this._posing = false;

  /**
   * The name of the file that contains this battler's character sprite (without extension).
   * @type {string}
   */
  this._baseSpriteImage = "";

  /**
   * The index of this battler's character sprite in the `_baseSpriteImage`.
   * @type {number}
   */
  this._baseSpriteIndex = 0;
  this.captureBaseSpriteInfo();
};

/**
 * Initializes the cooldowns for this battler.
 */
JABS_Battler.prototype.initCooldowns = function()
{
  // grab the battler for use.
  const battler = this.getBattler();

  // setup the skill slots for the enemy.
  battler.getSkillSlotManager().setupSlots(battler);
};
//#endregion initialize battler

//#region statics
/**
 * Generates a `JABS_Battler` based on the current leader of the party.
 * Also assigns the controller inputs for the player.
 */
JABS_Battler.createPlayer = function()
{
  // grab the leader of the party.
  const battler = $gameParty.leader();

  // if they are ready to be initialized, then do so.
  const actorId = battler ? battler.actorId() : 0;
  const coreData = new JABS_CoreDataBuilder(actorId)
    .isPlayer()
    .build();

  // return the created player.
  return new JABS_Battler($gamePlayer, battler, coreData);
};

// TODO: parameterize this on a per-enemy basis?
/**
 * If a battler is less than this distance from the target, they are considered "close".
 * @type {number}
 */
JABS_Battler.closeDistance = 3.0;

/**
 * If a battler is more than this distance from the target, they are considered "far".
 * @type {number}
 */
JABS_Battler.farDistance = 5.0;

/**
 * Determines if the battler is close to the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isClose = function(distance)
{
  return distance <= JABS_Battler.closeDistance;
};

/**
 * Determines if the battler is at a safe range from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isSafe = function(distance)
{
  return (distance > JABS_Battler.closeDistance) && (distance <= JABS_Battler.farDistance);
};

/**
 * Determines if the battler is far away from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isFar = function(distance)
{
  return distance > JABS_Battler.farDistance;
};

/**
 * Determines whether or not the skill id is a guard-type skill or not.
 * @param id {number} The id of the skill to check.
 * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.isGuardSkillById = function(id)
{
  // if there is no id to check, then it is not a dodge skill.
  if (!id) return false;

  // if the skill type is not "guard skill", then this is not a guard skill.
  if ($dataSkills[id].stypeId !== J.ABS.DefaultValues.GuardSkillTypeId) return false;

  // its a guard skill!
  return true;
};

/**
 * Determines whether or not the skill id is a dodge-type skill or not.
 * @param id {number} The id of the skill to check.
 * @returns {boolean} True if it is a dodge skill, false otherwise.
 */
JABS_Battler.isDodgeSkillById = function(id)
{
  // if there is no id to check, then it is not a dodge skill.
  if (!id) return false;

  // if the skill type is not "dodge skill", then this is not a dodge skill.
  if ($dataSkills[id].stypeId !== J.ABS.DefaultValues.DodgeSkillTypeId) return false;

  // its a dodge skill!
  return true;
};

/**
 * Determines whether or not the skill id is a weapon-type skill or not.
 * @param id {number} The id of the skill to check.
 * @returns {boolean}
 */
JABS_Battler.isWeaponSkillById = function(id)
{
  // if there is no id to check, then it is not a weapon skill.
  if (!id) return false;

  // if the skill type is not "weapon skill", then this is not a weapon skill.
  if ($dataSkills[id].stypeId !== J.ABS.DefaultValues.WeaponSkillTypeId) return false;

  // its a weapon skill!
  return true;
};


/**
 * Determines whether or not a skill should be visible
 * in the jabs combat skill assignment menu.
 * @param skill {RPG_Skill} The skill to check.
 * @returns {boolean}
 */
JABS_Battler.isSkillVisibleInCombatMenu = function(skill)
{
  // invalid skills are not visible in the combat skill menu.
  if (!skill) return false;

  // explicitly hidden skills are not visible in the combat skill menu.
  if (skill.metaAsBoolean("hideFromJabsMenu")) return false;

  // dodge skills are not visible in the combat skill menu.
  if (JABS_Battler.isDodgeSkillById(skill.id)) return false;

  // guard skills are not visible in the combat skill menu.
  if (JABS_Battler.isGuardSkillById(skill.id)) return false;

  // weapon skills are not visible in the combat skill menu.
  if (JABS_Battler.isWeaponSkillById(skill.id)) return false;

  // show this skill!
  return true;
};

/**
 * Determines whether or not a skill should be visible
 * in the jabs dodge skill assignment menu.
 * @param skill {RPG_Skill} The skill to check.
 * @returns {boolean}
 */
JABS_Battler.isSkillVisibleInDodgeMenu = function(skill)
{
  // invalid skills are not visible in the dodge menu.
  if (!skill) return false;

  // explicitly hidden skills are not visible in the dodge menu.
  if (skill.metaAsBoolean("hideFromJabsMenu")) return false;

  // non-dodge skills are not visible in the dodge menu.
  if (!JABS_Battler.isDodgeSkillById(skill.id)) return false;

  // show this skill!
  return true;
};

/**
 * Determines whether or not an item should be visible
 * in the JABS tool assignment menu.
 * @param {RPG_Item} item The item to check if should be visible.
 * @returns {boolean}
 */
JABS_Battler.isItemVisibleInToolMenu = function(item)
{
  // invalid items are not visible in the item menu.
  if (!item) return false;

  // explicitly hidden skills are not visible in the item menu.
  if (item.metaAsBoolean("hideFromJabsMenu")) return false;

  // non-items or non-always-occasion items are not visible in the item menu.
  const isItem = DataManager.isItem(item) && item.itypeId === 1;
  const isUsable = isItem && (item.occasion === 0);
  if (!isItem || !isUsable) return false;

  // show this item!
  return true;
};

/**
 * Gets the team id for allies, including the player.
 * @returns {0}
 */
JABS_Battler.allyTeamId = function()
{
  return 0;
};

/**
 * Gets the team id for enemies.
 * @returns {1}
 */
JABS_Battler.enemyTeamId = function()
{
  return 1;
};

/**
 * Gets the team id for neutral parties.
 * @returns {2}
 */
JABS_Battler.neutralTeamId = function()
{
  return 2;
};

/**
 * Gets the distance that allies are detected and can extend away from the player.
 * @returns {number}
 */
JABS_Battler.allyRubberbandRange = function()
{
  return parseFloat(10 + J.ABS.Metadata.AllyRubberbandAdjustment);
};
//#endregion statics

//#region updates
/**
 * Things that are battler-respective and should be updated on their own.
 */
JABS_Battler.prototype.update = function()
{
  // don't update map battlers if JABS is disabled.
  if (!$jabsEngine.absEnabled) return;

  this.updatePoseEffects();
  this.updateCooldowns();
  this.updateTimers();
  this.updateEngagement();
  this.updateRG();
  this.updateDodging();
  this.updateDeathHandling();
};

/**
 * Process any queued actions and execute them.
 */
JABS_Battler.prototype.processQueuedActions = function()
{
  // if we cannot process actions, then do not.
  if (!this.canProcessQueuedActions()) return;

  const decidedActions = this.getDecidedAction();

  // execute the action.
  $jabsEngine.executeMapActions(this, decidedActions);

  // set the last skill used to be the skill we just used.
  this.setLastUsedSkillId(decidedActions[0].getBaseSkill().id);

  // clear the queued action.
  this.clearDecidedAction();
};

/**
 * Check if we can process any queued actions.
 * @returns {boolean}
 */
JABS_Battler.prototype.canProcessQueuedActions = function()
{
  // check if we have an action decided.
  if (!this.isActionDecided()) return false;

  // check if we're still casting actions.
  if (this.isCasting()) return false;

  // check if we're not a player.
  // check also if we're not in position.
  if (!this.isPlayer() && !this.isInPosition()) return false;

  // we can process all the actions!
  return true;
};

//#region update pose effects
/**
 * Update all character sprite animations executing on this battler.
 */
JABS_Battler.prototype.updatePoseEffects = function()
{
  // if we cannot update pose effects, then do not.
  if (!this.canUpdatePoseEffects()) return;

  // countdown the timer for posing.
  this.countdownPoseTimer();

  // manage the actual adjustments to the character's pose pattern.
  this.handlePosePattern();
};

/**
 * Determines whether or not this battler can update its own pose effects.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdatePoseEffects = function()
{
  // we need to be currently animating in order to update animations.
  if (!this.isPosing()) return false;

  // update animations!
  return true;
};

/**
 * Gets whether or not this battler is currently posing.
 * @returns {boolean}
 */
JABS_Battler.prototype.isPosing = function()
{
  return this._posing;
};

/**
 * Counts down the pose animation frames and manages the pose pattern.
 */
JABS_Battler.prototype.countdownPoseTimer = function()
{
  // if guarding, then do not countdown the pose frames.
  if (this.guarding()) return;

  // check if we are still posing.
  if (this._poseFrames > 0)
  {
    // decrement the pose frames.
    this._poseFrames--;
  }
};

/**
 * Manages whether or not this battler is posing based on pose frames.
 */
JABS_Battler.prototype.handlePosePattern = function()
{
  // check if we are still posing.
  if (this._poseFrames > 0)
  {
    // manage the current pose pattern based on the animation frame count.
    this.managePosePattern();
  }
  // we are done posing now.
  else
  {
    // reset the pose back to default.
    this.resetAnimation();
  }
};

/**
 * Watches the current pose frames and adjusts the pose pattern accordingly.
 */
JABS_Battler.prototype.managePosePattern = function()
{
  // if the battler has 4 or less frames left.
  if (this._poseFrames < 4)
  {
    // set the pose pattern to 0, the left side.
    this.setPosePattern(0);
  }
  // check fi the battler has more than 10 frames left.
  else if (this._poseFrames > 10)
  {
    // set the pose pattern to 2, the right side.
    this.setPosePattern(2);
  }
  // the battler is between 5-9 pose frames.
  else
  {
    // set the pose pattern to 1, the middle.
    this.setPosePattern(1);
  }
};

/**
 * Sets this battler's underlying character's pose pattern.
 * @param {number} pattern The pattern to set for this character.
 */
JABS_Battler.prototype.setPosePattern = function(pattern)
{
  this.getCharacter()._pattern = pattern;
};
//#endregion update pose effects

//#region update cooldowns
/**
 * Updates all cooldowns for this battler.
 */
JABS_Battler.prototype.updateCooldowns = function()
{
  this.getBattler().getSkillSlotManager().updateCooldowns();
};
//#endregion update cooldowns

//#region update timers
/**
 * Updates all timers for this battler.
 */
JABS_Battler.prototype.updateTimers = function()
{
  this.processWaitTimer();
  this.processAlertTimer();
  this.processParryTimer();
  this.processLastHitTimer();
  this.processCastingTimer();
};

/**
 * Updates the timer for "waiting".
 */
JABS_Battler.prototype.processWaitTimer = function()
{
  // if waiting, update the wait timer.
  if (this.isWaiting())
  {
    this.countdownWait();
  }
};

/**
 * Updates the timer for "alerted".
 */
JABS_Battler.prototype.processAlertTimer = function()
{
  // if alerted, update the alert timer.
  if (this.isAlerted())
  {
    this.countdownAlert();
  }
};

/**
 * Updates the timer for "parrying".
 */
JABS_Battler.prototype.processParryTimer = function()
{
  // if parrying, update the parry timer.
  if (this.parrying())
  {
    this.getCharacter().requestAnimation(131, false);
    this.countdownParryWindow();
  }
};

/**
 * Updates the timer for "last hit".
 */
JABS_Battler.prototype.processLastHitTimer = function()
{
  // if this battler has a last hit, update the last hit timer.
  if (this.hasBattlerLastHit())
  {
    this.countdownLastHit();
  }
};

/**
 * Updates the timer for "casting".
 */
JABS_Battler.prototype.processCastingTimer = function()
{
  // if casting, update the cast timer.
  if (this.isCasting())
  {
    this.countdownCastTime();
  }
};
//#endregion update timers

//#region update engagement
/**
 * Monitors all other battlers and determines if they are engaged or not.
 */
JABS_Battler.prototype.updateEngagement = function()
{
  // ai engagement is blocked for players and while the game is paused.
  if (!this.canUpdateEngagement()) return;

  // grab the nearest target to this battler.
  const [target, distance] = this.closestEnemyTarget();

  // if we're unable to engage the target, do not engage.
  if (!this.canEngageTarget(target)) return;

  // process engagement handling.
  this.handleEngagement(target, distance);
};

/**
 * If this battler is the player, a hidden battler, an inanimate battler, or the abs is paused, then
 * prevent engagement updates.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdateEngagement = function()
{
  if ($jabsEngine.absPause) return false;

  if (this.isPlayer()) return false;

  if (this.isInanimate()) return false;

  return true;
};

/**
 * Determines if this battler can engage the given target.
 * @param {JABS_Battler} target The potential target to engage.
 * @returns {boolean} True if we can engage this target, false otherwise.
 */
JABS_Battler.prototype.canEngageTarget = function(target)
{
  // you cannot engage with nothing.
  if (!target) return false;

  // you cannot engage with yourself.
  if (target.getUuid() === this.getUuid()) return false;

  // engage!
  return true;
};

/**
 * Process the engagement with the given target and distance.
 * @param {JABS_Battler} target The target in question for engagement.
 * @param {number} distance The distance between this battler and the target.
 */
JABS_Battler.prototype.handleEngagement = function(target, distance)
{
  // check if we're already engaged.
  if (this.isEngaged())
  {
    // if engaged already, check if maybe we should now disengage.
    if (this.shouldDisengage(target, distance))
    {
      // disengage combat with the target.
      this.disengageTarget();
    }
  }
  // we aren't engaged yet.
  else
  {
    // check if we should now engage this target based on the given distance.
    if (this.shouldEngage(target, distance))
    {
      // engage in combat with the target.
      this.engageTarget(target);
    }
  }
};

/**
 * Determines whether or not this battler should disengage from it's target.
 * @param {JABS_Battler} target The target to potentially disengage from.
 * @param {number} distance The distance in number of tiles.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldDisengage = function(target, distance)
{
  // check if we're out of pursuit range with this target.
  const isOutOfRange = !this.inPursuitRange(target, distance);

  // return the findings.
  return isOutOfRange;
};

/**
 * Determines whether or not this battler should engage to the nearest target.
 * @param {JABS_Battler} target The target to potentially engage.
 * @param {number} distance The distance in number of tiles.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldEngage = function(target, distance)
{
  // check if we're in range of sight with the target.
  const isInSightRange = this.inSightRange(target, distance);

  // return the findings.
  return isInSightRange;
};
//#endregion update engagement

//#region update dodging
/**
 * Updates the dodge skill.
 */
JABS_Battler.prototype.updateDodging = function()
{
  // if we cannot update dodge, do not.
  if (!this.canUpdateDodge()) return;

  // cancel the dodge if we got locked down.
  this.handleDodgeCancel();

  // force dodge move while dodging.
  this.handleDodgeMovement();

  // if the dodge is over, end the dodging.
  this.handleDodgeEnd();
};

/**
 * Determine whether or not this battler can update its dodging.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdateDodge = function()
{
  // if we are not a player, we cannot dodge.
  if (!this.isPlayer()) return false;

  // we can dodge!
  return true;
};

/**
 * Handles the ending of dodging if the battler is interrupted.
 */
JABS_Battler.prototype.handleDodgeCancel = function()
{
  // check if we really should cancel dodging.
  if (!this.shouldCancelDodge()) return;

  // end the dodging.
  this.setDodging(false);

  // set the dodge steps to 0.
  this._dodgeSteps = 0;
};

/**
 * Checks if we should cancel the dodge.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldCancelDodge = function()
{
  // if the battler cannot move, then we should cancel dodging.
  if (!this.canBattlerMove()) return true;

  // nothing is canceling the dodge.
  return false;
};

JABS_Battler.prototype.handleDodgeMovement = function()
{
  // if we cannot dodge move, do not.
  if (!this.canDodgeMove()) return;

  // perform the movement.
  this.executeDodgeMovement();
};

/**
 * Determines whether or not this character can be forced to dodge move.
 * @returns {boolean}
 */
JABS_Battler.prototype.canDodgeMove = function()
{
  // if the character is currently moving, don't dodge move.
  if (this.getCharacter().isMoving()) return false;

  // if the battler cannot move, don't dodge move.
  if (!this.canBattlerMove()) return false;

  // if we are out of dodge steps, don't dodge move.
  if (this._dodgeSteps <= 0) return false;

  // if we are not dodging, don't dodge move.
  if (!this._dodging) return false;

  // we can dodge move!
  return true;
};

/**
 * Performs the forced dodge movement in the direction of the dodge.
 */
JABS_Battler.prototype.executeDodgeMovement = function()
{
  // move the character.
  this.getCharacter().moveStraight(this._dodgeDirection);

  // reduce the dodge steps.
  this._dodgeSteps--;
};

/**
 * Handles the conclusion of the dodging if necessary.
 */
JABS_Battler.prototype.handleDodgeEnd = function()
{
  // check if we even should end the dodge.
  if (!this.shouldEndDodge()) return;

  // conclude the dodge.
  this.endDodge();
};

/**
 * Determines wehether or not to end the dodging.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldEndDodge = function()
{
  // if we are out of dodge steps and we're done moving, end the dodge.
  if (this._dodgeSteps <= 0 && !this.getCharacter().isMoving()) return true;

  // KEEP DODGING.
  return false;
};

/**
 * Stops the dodge and resets the values to default.
 */
JABS_Battler.prototype.endDodge = function()
{
  // stop the dodge.
  this.setDodging(false);

  // set dodge steps to 0 regardless of what they are.
  this._dodgeSteps = 0;

  // disable the invincibility from dodging.
  this.setInvincible(false);
};
//#endregion update dodging

//#region update death handling
/**
 * Handles when this enemy battler is dying.
 */
JABS_Battler.prototype.updateDeathHandling = function()
{
  // don't do this for actors/players.
  if (this.isActor()) return;

  // do nothing if we are waiting.
  if (this.isWaiting()) return;

  // if the event is erased officially, ignore it.
  if (this.getCharacter()._erased) return;

  // if we are dying, self-destruct.
  if (this.isDying() && !$gameMap.isEventRunning())
  {
    this.destroy();
  }
};
//#endregion update death handling
//#endregion updates

//#region update helpers

//#region timers
/**
 * Counts down the duration for this battler's wait time.
 */
JABS_Battler.prototype.countdownWait = function()
{
  if (this._waitCounter > 0)
  {
    this._waitCounter--;
    return;
  }

  if (this._waitCounter <= 0)
  {
    this._waiting = false;
    this._waitCounter = 0;
  }
};

/**
 * Sets the battler's wait duration to a number. If this number is greater than
 * zero, then the battler must wait before doing anything else.
 * @param {number} wait The duration for this battler to wait.
 */
JABS_Battler.prototype.setWaitCountdown = function(wait)
{
  this._waitCounter = wait;
  if (this._waitCounter > 0)
  {
    this._waiting = true;
  }

  if (this._waitCounter <= 0)
  {
    this._waiting = false;
    this._waitCounter = 0;
  }
};

/**
 * Gets whether or not this battler is currently waiting.
 * @returns {boolean} True if waiting, false otherwise.
 */
JABS_Battler.prototype.isWaiting = function()
{
  return this._waiting;
};

/**
 * Counts down the duration for this battler's cast time.
 */
JABS_Battler.prototype.countdownCastTime = function()
{
  this.performCastAnimation();
  if (this._castTimeCountdown > 0)
  {
    this._castTimeCountdown--;
    return;
  }

  if (this._castTimeCountdown <= 0)
  {
    this._casting = false;
    this._castTimeCountdown = 0;
  }
};

/**
 * Performs the cast animation if possible on this battler.
 */
JABS_Battler.prototype.performCastAnimation = function()
{
  // check if we can perform a cast animation.
  if (!this.canPerformCastAnimation()) return;

  // get the cast animation id.
  const animationId = this.getDecidedAction()[0].getCastAnimation();

  // show the animation.
  this.showAnimation(animationId);
};

/**
 * Determines whether or not we can perform a cast animation.
 * @returns {boolean}
 */
JABS_Battler.prototype.canPerformCastAnimation = function()
{
  // if we don't have a decided action somehow, then don't do cast animation things.
  if (!this.getDecidedAction()) return false;

  // if we don't have a cast animation, then don't do cast animation things.
  if (!this.getDecidedAction()[0].getCastAnimation()) return false;

  // don't show casting animations while other animations are playing on you.
  if (this.isShowingAnimation()) return false;

  // show cast animations!
  return true;
};

/**
 * Sets the cast time duration to a number. If this number is greater than
 * zero, then the battler must spend this duration in frames casting before
 * executing the skill.
 * @param {number} castTime The duration in frames to spend casting.
 */
JABS_Battler.prototype.setCastCountdown = function(castTime)
{
  this._castTimeCountdown = castTime;
  if (this._castTimeCountdown > 0)
  {
    this._casting = true;
  }

  if (this._castTimeCountdown <= 0)
  {
    this._casting = false;
    this._castTimeCountdown = 0;
  }
};

/**
 * Gets whether or not this battler is currently casting a skill.
 * @returns {boolean}
 */
JABS_Battler.prototype.isCasting = function()
{
  return this._casting;
};

/**
 * Counts down the alertedness of this battler.
 */
JABS_Battler.prototype.countdownAlert = function()
{
  if (this._alertedCounter > 0)
  {
    this._alertedCounter--;
    return;
  }

  if (this._alertedCounter <= 0)
  {
    this.clearAlert();
  }
};

/**
 * Removes and clears the alert state from this battler.
 */
JABS_Battler.prototype.clearAlert = function()
{
  this.setAlerted(false);
  this._alertedCounter = 0;
  // if (!this.isEngaged())
  // {
  //   this.showBalloon(J.ABS.Balloons.Silence);
  // }
};
//#endregion timers

//#region dodging
/**
 * Gets whether or not this battler is dodging.
 * @returns {boolean} True if currently dodging, false otherwise.
 */
JABS_Battler.prototype.isDodging = function()
{
  return this._dodging;
};

/**
 * Sets whether or not this battler is dodging.
 * @param {boolean} dodging Whether or not the battler is dodging (default = true).
 */
JABS_Battler.prototype.setDodging = function(dodging = true)
{
  this._dodging = dodging;
};

/**
 * Tries to execute the battler's dodge skill.
 * Checks to see if costs are payable before executing.
 */
JABS_Battler.prototype.tryDodgeSkill = function()
{
  // grab the battler.
  const battler = this.getBattler();

  // grab the skill id for the dodge slot.
  const skillId = battler.getEquippedSkill(JABS_Button.Dodge);

  // if we have no skill id in the dodge slot, then do not dodge.
  if (!skillId) return;

  // grab the skill for the given dodge skill id.
  const skill = this.getSkill(skillId);

  // determine if it can be paid.
  const canPay = battler.canPaySkillCost(skill);

  // check if the user can pay the cost and if there is a move type available.
  if (canPay && skill.jabsMoveType)
  {
    // execute the skill in the dodge slot.
    this.executeDodgeSkill(skill);
  }
};

/**
 * Executes the provided dodge skill.
 * @param {RPG_Skill} skill The RPG item representing the dodge skill.
 */
JABS_Battler.prototype.executeDodgeSkill = function(skill)
{
  // change over to the action pose for the skill.
  this.performActionPose(skill);

  // trigger invincibility for dodging if applicable.
  this.setInvincible(skill.jabsInvincibleDodge);

  // increase the move speed while dodging to give the illusion of "dodge-rolling".
  const dodgeSpeedBonus = 2;
  this.getCharacter().setDodgeBoost(dodgeSpeedBonus);

  // set the number of steps this dodge will roll you.
  this._dodgeSteps = skill.jabsRadius;

  // set the direction to be dodging in (front/back/specified).
  this._dodgeDirection = this.determineDodgeDirection(skill.jabsMoveType);

  // pay whatever costs are associated with the skill.
  this.getBattler().paySkillCost(skill);

  // apply the cooldowns for the dodge.
  this.modCooldownCounter(JABS_Button.Dodge, skill.jabsCooldown);

  // trigger the dodge!
  this.setDodging(true);
};

/**
 * Translates a dodge skill type into a direction to move.
 * @param {string} moveType The type of dodge skill the player is using.
 */
JABS_Battler.prototype.determineDodgeDirection = function(moveType)
{
  const player = this.getCharacter();
  let direction;
  switch (moveType)
  {
    case J.ABS.Notetags.MoveType.Forward:
      direction = player.direction();
      break;
    case J.ABS.Notetags.MoveType.Backward:
      direction = player.reverseDir(player.direction());
      break;
    case J.ABS.Notetags.MoveType.Directional:
      if (Input.isPressed("up"))
      {
        direction = J.ABS.Directions.UP;
      }
      else if (Input.isPressed("right"))
      {
        direction = J.ABS.Directions.RIGHT;
      }
      else if (Input.isPressed("left"))
      {
        direction = J.ABS.Directions.LEFT;
      }
      else if (Input.isPressed("down"))
      {
        direction = J.ABS.Directions.DOWN;
      }
      else
      {
        direction = player.direction();
      }
      break;
    default:
      direction = player.direction();
      break;
  }

  return direction;
};
//#endregion dodging

//#region regeneration
/**
 * Updates all regenerations and ticks four times per second.
 */
JABS_Battler.prototype.updateRG = function()
{
  // check if we are able to update the RG.
  if (!this.canUpdateRG()) return;

  //
  this.performRegeneration();
  this.setRegenCounter(15);
};

JABS_Battler.prototype.canUpdateRG = function()
{
  // check if the regen is even ready for this battler.
  if (!this.isRegenReady()) return false;

  // if its ready but
  if (this.getBattler().isDead()) return false;

  return true;
};

/**
 * Whether or not the regen tick is ready.
 * @returns {boolean} True if its time for a regen tick, false otherwise.
 */
JABS_Battler.prototype.isRegenReady = function()
{
  if (this._regenCounter <= 0)
  {
    this.setRegenCounter(0);
    return true;
  }

  this._regenCounter--;
  return false;
};

/**
 * Gets the current count on the regen counter.
 * @returns {number}
 */
JABS_Battler.prototype.getRegenCounter = function()
{
  return this._regenCounter;
};

/**
 * Sets the regen counter to a given number.
 * @param {number} count The count to set the regen counter to.
 */
JABS_Battler.prototype.setRegenCounter = function(count)
{
  this._regenCounter = count;
};

/**
 * Performs the full suite of possible regenerations handled by JABS.
 *
 * This includes both natural and tag/state-driven regenerations.
 */
JABS_Battler.prototype.performRegeneration = function()
{
  // if we have no battler, don't bother.
  const battler = this.getBattler();
  if (!battler) return;

  // handle our natural rgs since we have a battler.
  this.processNaturalRegens();

  // if we have no states, don't bother.
  let states = battler.states();
  if (!states.length) return;

  // clean-up all the states that are somehow applied but not tracked.
  states = states.filter(this.shouldProcessState, this);

  // handle all the tag-specific hp/mp/tp regenerations.
  this.processStateRegens(states);
};

/**
 * Processes the natural regeneration of this battler.
 *
 * This includes all HRG/MRG/TRG derived from any extraneous source.
 */
JABS_Battler.prototype.processNaturalRegens = function()
{
  this.processNaturalHpRegen();
  this.processNaturalMpRegen();
  this.processNaturalTpRegen();
};

/**
 * Processes the natural HRG for this battler.
 */
JABS_Battler.prototype.processNaturalHpRegen = function()
{
  // shorthand the battler.
  const battler = this.getBattler();

  // check if we need to regenerate.
  if (battler.hp < battler.mhp)
  {
    // extract the regens rates.
    const {hrg, rec} = battler;

    // calculate the bonus.
    const naturalHp5 = ((hrg * 100) * 0.05) * rec;

    // execute the gain.
    battler.gainHp(naturalHp5);
  }
};

/**
 * Processes the natural MRG for this battler.
 */
JABS_Battler.prototype.processNaturalMpRegen = function()
{
  // shorthand the battler.
  const battler = this.getBattler();

  // check if we need to regnerate.
  if (battler.mp < battler.mmp)
  {
    // extract the regens rates.
    const {mrg, rec} = battler;

    // calculate the bonus.
    const naturalMp5 = ((mrg * 100) * 0.05) * rec;

    // execute the gain.
    battler.gainMp(naturalMp5);
  }
};

/**
 * Processes the natural TRG for this battler.
 */
JABS_Battler.prototype.processNaturalTpRegen = function()
{
  // shorthand the battler.
  const battler = this.getBattler();

  // check if we need to regenerate.
  if (battler.tp < battler.maxTp())
  {
    // extract the regens rates.
    const {trg, rec} = battler;

    // calculate the bonus.
    const naturalTp5 = ((trg * 100) * 0.05) * rec;

    // execute the gain.
    battler.gainTp(naturalTp5);
  }
};

/**
 * Processes all regenerations derived from state tags.
 * @param {RPG_State[]} states The filtered list of states to parse.
 */
JABS_Battler.prototype.processStateRegens = function(states)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // default the regenerations to the battler's innate regens.
  const {rec} = battler;
  const regens = [0, 0, 0];

  // process each state for slip actions.
  for (const state of states)
  {
    // add the per-five hp slip.
    regens[0] += this.stateSlipHp(state);

    // add the per-five mp slip.
    regens[1] += this.stateSlipMp(state);

    // add the per-five tp slip.
    regens[2] += this.stateSlipTp(state);
  }

  // iterate over the above regens.
  regens.forEach((regen, index) =>
  {
    // if it wasn't modified, don't worry about it.
    if (!regen)
    {
      return;
    }

    // apply REC effects against all three regens.
    if (regen > 0)
    {
      regen *= rec;
    }

    // apply "per5" rate- 4 times per second, for 5 seconds, equals 20.
    regen /= 20;


    // if we have a non-zero amount, generate the popup.
    if (regen)
    {
      this.applySlipEffect(regen, index);

      // flip the sign for the regen for properly creating pops.
      regen *= -1;

      // generate the textpop.
      this.generatePopSlip(regen, index);
    }
  });
};

/**
 * Determines if a state should be processed or not for slip effects.
 * @param {RPG_State} state The state to check if needing processing.
 * @returns {boolean} True if we should process this state, false otherwise.
 */
JABS_Battler.prototype.shouldProcessState = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // grab the state we're working with.
  const trackedState = $jabsEngine.findStateTrackerByBattlerAndState(battler, state.id);
  if (!trackedState)
  {
    // when loading a file that was saved with a state, we encounter a weird issue
    // where the state is still on the battler but not in temporary memory as a
    // JABS tracked state. In this case, we remove it.
    battler.removeState(state.id);
    return false;
  }

  // don't process states if they have no metadata.
  // the RG from states is a part of the base, now.
  if (!state.meta) return false;

  return true;
};

/**
 * Processes a single state and returns its tag-based hp regen value.
 * @param {RPG_State} state The state to process.
 * @returns {number} The hp regen from this state.
 */
JABS_Battler.prototype.stateSlipHp = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // default slip to zero.
  let tagHp5 = 0;

  // if the flat tag exists, use it.
  tagHp5 += state.jabsSlipHpFlatPerFive;

  // if the percent tag exists, use it.
  tagHp5 += battler.mhp * (state.jabsSlipHpPercentPerFive / 100);

  // if the formula tag exists, use it.
  const hpPerFiveFormula = state.jabsSlipHpFormulaPerFive;
  if (hpPerFiveFormula)
  {
    // pull the state associated with the battler.
    const trackedState = $jabsEngine.findStateTrackerByBattlerAndState(battler, state.id);

    // variables for contextual eval().
    const a = trackedState.source;  // the one who applied the state.
    const b = trackedState.battler; // this battler, afflicted by the state.
    const v = $gameVariables._data; // access to variables if you need it.
    const s = state;                // access to the state itself if you need it.

    // eval the formula with the above context.
    const result = Math.round(eval(hpPerFiveFormula) * -1);

    // check to make sure we have a number.
    if (Number.isFinite(result))
    {
      // add the number onto the running total.
      tagHp5 += result;
    }
    // the eval failed and produced a NaN or otherwise.
    else
    {
      // warn them!
      console.warn(`The state of ${state.id} has an hp formula producing a result that isn't valid.`);
      console.warn(`formula parsed: ${hpPerFiveFormula}`);
      console.warn(`result produced: ${result}`);
    }
  }

  // return the per-five.
  return tagHp5;
};

/**
 * Processes a single state and returns its tag-based mp regen value.
 * @param {RPG_State} state The state to process.
 * @returns {number} The mp regen from this state.
 */
JABS_Battler.prototype.stateSlipMp = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // default slip to zero.
  let tagMp5 = 0;

  // if the flat tag exists, use it.
  tagMp5 += state.jabsSlipMpFlatPerFive;

  // if the percent tag exists, use it.
  tagMp5 += battler.mmp * (state.jabsSlipMpPercentPerFive / 100);

  // if the formula tag exists, use it.
  const mpPerFiveFormula = state.jabsSlipMpFormulaPerFive;
  if (mpPerFiveFormula)
  {
    // pull the state associated with the battler.
    const trackedState = $jabsEngine.findStateTrackerByBattlerAndState(battler, state.id);

    // variables for contextual eval().
    const a = trackedState.source;  // the one who applied the state.
    const b = trackedState.battler; // this battler, afflicted by the state.
    const v = $gameVariables._data; // access to variables if you need it.
    const s = state;                // access to the state itself if you need it.

    // eval the formula with the above context.
    const result = Math.round(eval(mpPerFiveFormula) * -1);

    // check to make sure we have a number.
    if (Number.isFinite(result))
    {
      // add the number onto the running total.
      tagMp5 += result;
    }
    // the eval failed and produced a NaN or otherwise.
    else
    {
      // warn them!
      console.warn(`The state of ${state.id} has an mp formula producing a result that isn't valid.`);
      console.warn(`formula parsed: ${mpPerFiveFormula}`);
      console.warn(`result produced: ${result}`);
    }
  }

  // return the per-five.
  return tagMp5;
};

/**
 * Processes a single state and returns its tag-based mp regen value.
 * @param {RPG_State} state The state to process.
 * @returns {number} The mp regen from this state.
 */
JABS_Battler.prototype.stateSlipTp = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // default slip to zero.
  let tagTp5 = 0;

  // if the flat tag exists, use it.
  tagTp5 += state.jabsSlipTpFlatPerFive;

  // if the percent tag exists, use it.
  tagTp5 += battler.maxTp() * (state.jabsSlipTpPercentPerFive / 100);

  // if the formula tag exists, use it.
  const tpPerFiveFormula = state.jabsSlipTpFormulaPerFive;
  if (tpPerFiveFormula)
  {
    // pull the state associated with the battler.
    const trackedState = $jabsEngine.findStateTrackerByBattlerAndState(battler, state.id);

    // variables for contextual eval().
    const a = trackedState.source;  // the one who applied the state.
    const b = trackedState.battler; // this battler, afflicted by the state.
    const v = $gameVariables._data; // access to variables if you need it.
    const s = state;                // access to the state itself if you need it.

    // eval the formula with the above context.
    const result = Math.round(eval(tpPerFiveFormula) * -1);

    // check to make sure we have a number.
    if (Number.isFinite(result))
    {
      // add the number onto the running total.
      tagTp5 += result;
    }
    // the eval failed and produced a NaN or otherwise.
    else
    {
      // warn them!
      console.warn(`The state of ${state.id} has a tp formula producing a result that isn't valid.`);
      console.warn(`formula parsed: ${tpPerFiveFormula}`);
      console.warn(`result produced: ${result}`);
    }
  }

  // return the per-five.
  return tagTp5;
};

/**
 * Creates the slip popup on this battler.
 * @param {number} amount The slip pop amount.
 * @param {number} type The slip parameter: 0=hp, 1=mp, 2=tp.
 */
JABS_Battler.prototype.generatePopSlip = function(amount, type)
{
  // if we are not using popups, then don't do this.
  if (!J.POPUPS) return;

  // gather shorthand variables for use.
  const character = this.getCharacter();

  // generate the textpop.
  const slipPop = this.configureSlipPop(amount, type);

  // add the pop to the target's tracking.
  character.addTextPop(slipPop);
  character.setRequestTextPop();
};

/**
 * Configures a popup based on the slip damage type and amount.
 * @param {number} amount The amount of the slip.
 * @param {0|1|2} type The slip parameter: 0=hp, 1=mp, 2=tp.
 * @returns {Map_TextPop}
 */
JABS_Battler.prototype.configureSlipPop = function(amount, type)
{
  // lets take our time with this text pop building.
  const textPopBuilder = new TextPopBuilder(amount);

  // based on the hp/mp/tp type, we apply different visual effects.
  switch (type)
  {
    case 0: // hp
      textPopBuilder.isHpDamage();
      break;
    case 1: // mp
      textPopBuilder.isMpDamage();
      break;
    case 2: // tp
      textPopBuilder.isTpDamage();
      break;
  }

  // build and return the popup.
  return textPopBuilder.build();
};

/**
 * Applies the regeneration amount to the appropriate parameter.
 * @param {number} amount The regen amount.
 * @param {number} type The regen type- identified by index.
 */
JABS_Battler.prototype.applySlipEffect = function(amount, type)
{
  const battler = this.getBattler();
  switch (type)
  {
    case 0:
      battler.gainHp(amount);
      break;
    case 1:
      battler.gainMp(amount);
      break;
    case 2:
      battler.gainTp(amount);
      break;
  }
};
//#endregion regeneration

/**
 * Determines the closest enemy target.
 * @returns {[JABS_Battler, number]}
 */
JABS_Battler.prototype.closestEnemyTarget = function()
{
  const battlers = $gameMap.getOpposingBattlersWithinRange(this, this.getSightRadius());
  let currentClosest = null;
  let closestDistanceYet = 1000;
  battlers.forEach(battler =>
  {
    // don't engage same team and don't engage self
    if (this.isSameTeam(battler.getTeam())) return;
    if (this.getUuid() === battler.getUuid()) return;

    const distance = this.distanceToDesignatedTarget(battler);
    if (distance < closestDistanceYet)
    {
      // track and capture the closest
      closestDistanceYet = distance;
      currentClosest = battler;
    }
  })

  return [currentClosest, closestDistanceYet];
};

/**
 * Gets whether or not this battler's movement is locked.
 * @returns {boolean} True if the battler's movement is locked, false otherwise.
 */
JABS_Battler.prototype.isMovementLocked = function()
{
  return this._movementLock;
};

/**
 * Sets the battler's movement lock.
 * @param {boolean} locked Whether or not the battler's movement is locked (default = true).
 */
JABS_Battler.prototype.setMovementLock = function(locked = true)
{
  this._movementLock = locked;
};

/**
 * Whether or not the battler is able to move.
 * A variety of things can impact the ability for a battler to move.
 * @returns {boolean} True if the battler can move, false otherwise.
 */
JABS_Battler.prototype.canBattlerMove = function()
{
  // battlers cannot move if they are movement locked by choice (rotating/guarding/etc).
  if (this.isMovementLocked()) return false;

  // battlers cannot move if they are movement locked by state.
  if (this.isMovementLockedByState()) return false;

  // battler can move!
  return true;
};

/**
 * Checks all states to see if any are movement-locking.
 * @returns {boolean} True if there is at least one locking movement, false otherwise.
 */
JABS_Battler.prototype.isMovementLockedByState = function()
{
  // grab the states to check for movement-blocking effects.
  const states = this.getBattler().states();

  // if we have no states,
  if (!states.length) return false;

  // check all our states to see if any are blocking movement.
  const lockedByState = states.some(state => (state.jabsRooted || state.jabsParalyzed));

  // return what we found.
  return lockedByState;
};

/**
 * Whether or not the battler is able to use attacks based on states.
 * @returns {boolean} True if the battler can attack, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseAttacks = function()
{
  const states = this.getBattler().states();
  if (!states.length)
  {
    return true;
  }

  const disabled = states.find(state => (state.jabsDisarmed || state.jabsParalyzed));
  return !disabled;

};

/**
 * Whether or not the battler is able to use skills based on states.
 * @returns {boolean} True if the battler can use skills, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseSkills = function()
{
  const states = this.getBattler().states();
  if (!states.length)
  {
    return true;
  }

  const muted = states.find(state => (state.jabsMuted || state.jabsParalyzed));
  return !muted;

};

/**
 * Initializes the sprite info for this battler.
 */
JABS_Battler.prototype.captureBaseSpriteInfo = function()
{
  this.setBaseSpriteName(this.getCharacterSpriteName());
  this.setBaseSpriteIndex(this.getCharacterSpriteIndex());
};

/**
 * Gets the name of this battler's current character sprite.
 * @returns {string}
 */
JABS_Battler.prototype.getCharacterSpriteName = function()
{
  return this.getCharacter()._characterName;
};

/**
 * Gets the index of this battler's current character sprite.
 * @returns {number}
 */
JABS_Battler.prototype.getCharacterSpriteIndex = function()
{
  return this.getCharacter()._characterIndex;
};

/**
 * Sets the name of this battler's original character sprite.
 * @param {string} name The name to set.
 */
JABS_Battler.prototype.setBaseSpriteName = function(name)
{
  this._baseSpriteImage = name;
};

/**
 * Sets the index of this battler's original character sprite.
 * @param {number} index The index to set.
 */
JABS_Battler.prototype.setBaseSpriteIndex = function(index)
{
  this._baseSpriteIndex = index;
};
//#endregion update helpers

//#region reference helpers
/**
 * Reassigns the character to something else.
 * @param {Game_Event|Game_Player|Game_Follower} newCharacter The new character to assign.
 */
JABS_Battler.prototype.setCharacter = function(newCharacter)
{
  this._event = newCharacter;
};

/**
 * Gets the battler's name.
 * @returns {string}
 */
JABS_Battler.prototype.battlerName = function()
{
  return this.getReferenceData().name;
};

/**
 * Events that have no actual conditions associated with them may have a -1 index.
 * Ignore that if that's the case.
 */
JABS_Battler.prototype.hasEventActions = function()
{
  // allies and the player don't have event commands.
  if (this.isActor()) return false;

  const event = this.getCharacter();
  return event._pageIndex !== -1;
};

/**
 * Destroys this battler and removes it from the current battle map.
 */
JABS_Battler.prototype.destroy = function()
{
  this.setInvincible();
  $gameMap.destroyBattler(this);
};

/**
 * Reveals this battler onto the map.
 */
JABS_Battler.prototype.revealHiddenBattler = function()
{
  this._hidden = false;
};

/**
 * Hides this battler from the current battle map.
 */
JABS_Battler.prototype.hideBattler = function()
{
  this._hidden = true;
};

/**
 * Whether or not this battler is hidden on the current battle map.
 */
JABS_Battler.prototype.isHidden = function()
{
  return this._hidden;
};

/**
 * Whether or not this battler is in a state of dying.
 * @returns {boolean}
 */
JABS_Battler.prototype.isDying = function()
{
  return this._dying;
};

/**
 * Sets whether or not this battler is in a state of dying.
 * @param {boolean} dying The new state of dying.
 */
JABS_Battler.prototype.setDying = function(dying)
{
  this._dying = dying;
};

/**
 * Calculates whether or not this battler should continue fighting it's target.
 * @param {JABS_Battler} target The target we're trying to see.
 * @param {number} distance The distance from this battler to the target.
 * @returns {boolean}
 */
JABS_Battler.prototype.inPursuitRange = function(target, distance)
{
  let pursuitRadius = this.getPursuitRadius();

  // apply the modification from the actor, if any.
  const visionMultiplier = target.getBattler().getVisionModifier();

  // apply the multiplier to the base.
  pursuitRadius *= visionMultiplier;

  return (distance <= pursuitRadius);
};

/**
 * Calculates whether or not this battler should engage the nearest battler.
 * @param {JABS_Battler} target The target we're trying to see.
 * @param {number} distance The distance from this battler to the target.
 * @returns {boolean}
 */
JABS_Battler.prototype.inSightRange = function(target, distance)
{
  // grab the sight for this battler.
  const sightRadius = this.getSightRadius();

  // apply the modification from the actor, if any.
  const modifiedSight = this.applyVisionMultiplier(target);

  // determine whether or not the target is in sight.
  const isInSightRange = (distance <= sightRadius);

  // return the answer.
  return isInSightRange;
};

/**
 * Applies the vision multiplier against the base vision radius in question.
 * @param {JABS_Battler} target The target we're trying to see.
 * @param {number} originalRadius The original vision radius.
 */
JABS_Battler.prototype.applyVisionMultiplier = function(target, originalRadius)
{
  // get this battler's vision multiplier factor.
  const visionMultiplier = target.getBattler().getVisionModifier();

  // calculate the new radius.
  const modifiedVisionRadius = (originalRadius * visionMultiplier);

  // return our calculation.
  return modifiedVisionRadius;
};

/**
 * Gets this battler's unique identifier.
 * @returns {string}
 */
JABS_Battler.prototype.getUuid = function()
{
  // if there is problems with the battler, return nothing.
  if (!this.getBattler()) return String.empty;

  return this.getBattler().getUuid();
};

/**
 * Gets whether or not this battler has any pending actions decided
 * by this battler's leader.
 */
JABS_Battler.prototype.hasLeaderDecidedActions = function()
{
  // if you don't have a leader, you don't perform the actions.
  if (!this.hasLeader()) return false;

  return this._leaderDecidedAction;
};

/**
 * Gets the next skill id from the queue of leader-decided actions.
 * Also removes it from the current queue.
 * @returns {number}
 */
JABS_Battler.prototype.getNextLeaderDecidedAction = function()
{
  const action = this._leaderDecidedAction;
  this.clearLeaderDecidedActionsQueue();
  return action;
};

/**
 * Adds a new action decided by the leader for the follower to perform.
 * @param {number} skillId The skill id decided by the leader.
 */
JABS_Battler.prototype.setLeaderDecidedAction = function(skillId)
{
  this._leaderDecidedAction = skillId;
};

/**
 * Clears all unused leader-decided actions that this follower had pending.
 */
JABS_Battler.prototype.clearLeaderDecidedActionsQueue = function()
{
  this._leaderDecidedAction = null;
};

/**
 * Gets the leader's `uuid` of this battler.
 */
JABS_Battler.prototype.getLeader = function()
{
  return this._leaderUuid;
};

/**
 * Gets the battler for this battler's leader.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getLeaderBattler = function()
{
  if (this._leaderUuid)
  {
    return $gameMap.getBattlerByUuid(this._leaderUuid);
  }

  return null;

};

/**
 * Sets the `uuid` of the leader of this battler.
 * @param {string} newLeader The leader's `uuid`.
 */
JABS_Battler.prototype.setLeader = function(newLeader)
{
  const leader = $gameMap.getBattlerByUuid(newLeader);
  if (leader)
  {
    this._leaderUuid = newLeader;
    leader.addFollower(this.getUuid());
  }
};

/**
 * Gets whether or not this battler has a leader.
 * Only battlers with the ai-trait of `follower` can have leaders.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasLeader = function()
{
  return !!this._leaderUuid;
};

/**
 * Gets all followers associated with this battler.
 * Only leaders can have followers.
 * @return {string[]} The `uuid`s of all followers.
 */
JABS_Battler.prototype.getFollowers = function()
{
  return this._followers;
};

/**
 * Gets the whole battler of the follower matching the `uuid` provided.
 * @param {string} followerUuid The `uuid` of the follower to find.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getFollowerByUuid = function(followerUuid)
{
  // if we don't have followers, just return null.
  if (!this.hasFollowers()) return null;

  // search through the followers to find the matching battler.
  const foundUuid = this._followers.find(uuid => uuid === followerUuid);
  if (foundUuid)
  {
    return $gameMap.getBattlerByUuid(foundUuid);
  }

  return null;

};

/**
 * Adds a follower to the leader's collection.
 * @param {string} newFollowerUuid The new uuid of the follower now being tracked.
 */
JABS_Battler.prototype.addFollower = function(newFollowerUuid)
{
  const found = this.getFollowerByUuid(newFollowerUuid);
  if (found)
  {
    console.error("this follower already existed within the follower list.");
  }
  else
  {
    this._followers.push(newFollowerUuid);
  }
};

/**
 * Removes the follower from
 * @param {string} oldFollowerUuid The `uuid` of the follower to remove from tracking.
 */
JABS_Battler.prototype.removeFollower = function(oldFollowerUuid)
{
  const index = this._followers.indexOf(uuid => uuid === oldFollowerUuid);
  if (index !== -1)
  {
    this._followers.splice(index, 1);
  }
  else
  {
    console.error("could not find follower to remove from the list.", oldFollowerUuid);
  }
};

/**
 * Clears all current followers from this battler.
 */
JABS_Battler.prototype.clearFollowers = function()
{
  // first de-assign leadership from all followers for this leader...
  this._followers.forEach(followerUuid =>
  {
    $gameMap.clearLeaderDataByUuid(followerUuid);
  });

  // ...then empty the collection.
  this._followers.splice(0, this._followers.length);
};

/**
 * Removes this follower's leader.
 */
JABS_Battler.prototype.clearLeader = function()
{
  // get the leader's uuid for searching.
  const leaderUuid = this.getLeader();
  // if found, remove this follower from that leader.
  if (leaderUuid)
  {
    const uuid = this.getUuid();
    // in some instances, "this" may not be alive anymore so handle that.
    if (!uuid) return;

    const leader = $gameMap.getBattlerByUuid(leaderUuid);
    if (!leader) return;

    leader.removeFollowerByUuid(uuid);
  }
};

/**
 * Removes a follower from it's current leader.
 * @param {string} uuid The `uuid` of the follower to remove from the leader.
 */
JABS_Battler.prototype.removeFollowerByUuid = function(uuid)
{
  const index = this._followers.indexOf(uuid);
  if (index !== -1)
  {
    this._followers.splice(index, 1);
  }
};

/**
 * Removes the leader data from this battler.
 */
JABS_Battler.prototype.clearLeaderData = function()
{
  this.setLeader("");
  this.clearLeaderDecidedActionsQueue();
};

/**
 * Gets whether or not this battler has followers.
 * Only battlers with the AI trait of "leader" will have followers.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasFollowers = function()
{
  // if you're not a leader, you can't have followers.
  if (!this.getAiMode().leader) return false;

  return this._followers.length > 0;
};

/**
 * Gets the database data for this battler.
 * @returns {RPG_Actor|RPG_Enemy} The battler data.
 */
JABS_Battler.prototype.getReferenceData = function()
{
  // if somehow we don't have a battler, return an empty object.
  if (!this.getBattler()) return {};

  // if it is an actor, return the actor database data.
  if (this.isActor())
  {
    return this.getBattler()
      .actor();
  }

  // if it is an enemy, return the enemy database data.
  if (this.getBattler()
    .isEnemy())
  {
    return this.getBattler()
      .enemy();
  }
};

/**
 * Determines if this battler is facing its target.
 * @param {Game_Character} target The target `Game_Character` to check facing for.
 */
JABS_Battler.prototype.isFacingTarget = function(target)
{
  const userDir = this.getCharacter()
    .direction();
  const targetDir = target.direction();

  switch (userDir)
  {
    case J.ABS.Directions.DOWN:
      return targetDir === J.ABS.Directions.UP;
    case J.ABS.Directions.UP:
      return targetDir === J.ABS.Directions.DOWN;
    case J.ABS.Directions.LEFT:
      return targetDir === J.ABS.Directions.RIGHT;
    case J.ABS.Directions.RIGHT:
      return targetDir === J.ABS.Directions.LEFT;
  }

  return false;
};

/**
 * Whether or not this battler is actually the `Game_Player`.
 * @returns {boolean}
 */
JABS_Battler.prototype.isPlayer = function()
{
  return (this.getCharacter() instanceof Game_Player);
};

/**
 * Whether or not this battler is a `Game_Actor`.
 * The player counts as a `Game_Actor`, too.
 * @returns {boolean}
 */
JABS_Battler.prototype.isActor = function()
{
  return (this.isPlayer() || this.getBattler() instanceof Game_Actor)
};

/**
 * Whether or not this battler is a `Game_Enemy`.
 * @returns {boolean}
 */
JABS_Battler.prototype.isEnemy = function()
{
  return (this.getBattler() instanceof Game_Enemy);
};

/**
 * Compares the user with a provided target team to see if they are the same.
 * @param {number} targetTeam The id of the team to check.
 * @returns {boolean} True if the user and target are on the same team, false otherwise.
 */
JABS_Battler.prototype.isSameTeam = function(targetTeam)
{
  return (this.getTeam() === targetTeam);
};

/**
 * Gets whether or not the provided target team is considered "friendly".
 * @param {number} targetTeam The id of the team to check.
 * @returns {boolean}
 */
JABS_Battler.prototype.isFriendlyTeam = function(targetTeam)
{
  // TODO: parameterize in objects what are "opposing" teams.
  return [this.getTeam()].includes(targetTeam);
};

/**
 * Gets whether or not the provided target team is considered "opposing".
 * @param {number} targetTeam The id of the team to check.
 * @returns {boolean}
 */
JABS_Battler.prototype.isOpposingTeam = function(targetTeam)
{
  // TODO: parameterize in objects what are "friendly" teams.
  return !(targetTeam === this.getTeam());
  //return [].includes(targetTeam);
};

/**
 * Gets this battler's team id.
 * @returns {number}
 */
JABS_Battler.prototype.getTeam = function()
{
  return this._team;
};

/**
 * Gets the phase of battle this battler is currently in.
 * The player does not have any phases.
 * @returns {number} The phase this `JABS_Battler` is in.
 */
JABS_Battler.prototype.getPhase = function()
{
  return this._phase;
};

/**
 * Gets whether or not this battler is invincible.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInvincible = function()
{
  return this._invincible;
};

/**
 * Gets whether or not this battler is inanimate.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInanimate = function()
{
  return this._inanimate;
};

/**
 * Sets this battler to be invincible, rendering them unable to be collided
 * with by map actions of any kind.
 * @param {boolean} invincible True if uncollidable, false otherwise (default: true).
 */
JABS_Battler.prototype.setInvincible = function(invincible = true)
{
  this._invincible = invincible;
};

/**
 * Sets the phase of battle that this battler should be in.
 * @param {number} newPhase The new phase the battler is entering.
 */
JABS_Battler.prototype.setPhase = function(newPhase)
{
  this._phase = newPhase;
};

/**
 * Resets the phase of this battler back to one and resets all flags.
 */
JABS_Battler.prototype.resetPhases = function()
{
  this.setPhase(1);
  this._prepareReady = false;
  this._prepareCounter = 0;
  this._postActionCooldownComplete = false;
  this.setDecidedAction(null);
  this.setAllyTarget(null);
  this.setInPosition(false);
};

/**
 * Gets whether or not this battler is in position for a given skill.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInPosition = function()
{
  return this._inPosition;
};

/**
 * Sets this battler to be identified as "in position" to execute their
 * decided skill.
 * @param {boolean} inPosition
 */
JABS_Battler.prototype.setInPosition = function(inPosition = true)
{
  this._inPosition = inPosition;
};

/**
 * Gets whether or not this battler has decided an action.
 * @returns {boolean}
 */
JABS_Battler.prototype.isActionDecided = function()
{
  return this._decidedAction !== null;
};

/**
 * Gets the battler's decided action.
 * @returns {JABS_Action[]|null}
 */
JABS_Battler.prototype.getDecidedAction = function()
{
  return this._decidedAction;
};

/**
 * Sets this battler's decided action to this action.
 * @param {JABS_Action[]} action The action this battler has decided on.
 */
JABS_Battler.prototype.setDecidedAction = function(action)
{
  this._decidedAction = action;
};

/**
 * Clears this battler's decided action.
 */
JABS_Battler.prototype.clearDecidedAction = function()
{
  this._decidedAction = null;
};

/**
 * Resets the idle action back to a not-ready state.
 */
JABS_Battler.prototype.resetIdleAction = function()
{
  this._idleActionReady = false;
};

/**
 * Returns the `Game_Character` that this `JABS_Battler` is bound to.
 * For the player, it'll return a subclass instead: `Game_Player`.
 * @returns {Game_Event|Game_Player|Game_Follower} The event this `JABS_Battler` is bound to.
 */
JABS_Battler.prototype.getCharacter = function()
{
  return this._event;
};

/**
 * Returns the `Game_Battler` that this `JABS_Battler` represents.
 *
 * This may be either a `Game_Actor`, or `Game_Enemy`.
 * @returns {Game_Actor|Game_Enemy} The `Game_Battler` this battler represents.
 */
JABS_Battler.prototype.getBattler = function()
{
  return this._battler;
};

/**
 * Gets whether or not the underlying battler is dead.
 * @returns {boolean} True if they are dead, false otherwise.
 */
JABS_Battler.prototype.isDead = function()
{
  return this.getBattler().isDead();
};

/**
 * Whether or not the event is actually loaded and valid.
 * @returns {boolean} True if the event is valid (non-player) and loaded, false otherwise.
 */
JABS_Battler.prototype.isEventReady = function()
{
  const character = this.getCharacter();
  if (character instanceof Game_Player)
  {
    return false;
  }

  return !!character.event();

};

/**
 * The radius a battler of a different team must enter to cause this unit to engage.
 * @returns {number} The sight radius for this `JABS_Battler`.
 */
JABS_Battler.prototype.getSightRadius = function()
{
  let sight = this._sightRadius;
  if (this.isAlerted())
  {
    sight += this._alertedSightBoost;
  }

  return sight;
};

/**
 * The maximum distance a battler of a different team may reach before this unit disengages.
 * @returns {number} The pursuit radius for this `JABS_Battler`.
 */
JABS_Battler.prototype.getPursuitRadius = function()
{
  let pursuit = this._pursuitRadius;
  if (this.isAlerted())
  {
    pursuit += this._alertedPursuitBoost;
  }

  return pursuit;
};

/**
 * Sets whether or not this battler is engaged.
 * @param {boolean} isEngaged Whether or not this battler is engaged.
 */
JABS_Battler.prototype.setEngaged = function(isEngaged)
{
  this._engaged = isEngaged;
};

/**
 * Whether or not this `JABS_Battler` is currently engaged in battle with a target.
 * @returns {boolean} Whether or not this battler is engaged.
 */
JABS_Battler.prototype.isEngaged = function()
{
  return this._engaged;
};

/**
 * Engage battle with the target battler.
 * @param {JABS_Battler} target The target this battler is engaged with.
 */
JABS_Battler.prototype.engageTarget = function(target)
{
  // this battler cannot engage with targets right now.
  if (this.isEngagementLocked()) return;

  // enable engagement.
  this.setIdle(false);
  this.setEngaged(true);

  // setup the target and their aggro.
  this.setTarget(target);
  this.addUpdateAggro(target.getUuid(), 0);

  // check if this is an actor-based character.
  if (this.isActor())
  {
    // disable walking through walls while the follower is engaged.
    this.getCharacter().setThrough(false);
  }

  // if we're alerted, also clear the alert state.
  this.clearAlert();

  // TODO: abstract this.
  this.showBalloon(J.ABS.Balloons.Exclamation);
};

/**
 * Disengage from the target.
 */
JABS_Battler.prototype.disengageTarget = function()
{
  // clear any targeting.
  this.setTarget(null);
  this.setAllyTarget(null);

  // disable being engaged.
  this.setEngaged(false);

  // disable the alert when disengaging.
  this.clearAlert();

  // remove leader/follower data.
  this.clearFollowers();
  this.clearLeaderData();

  // forget decided action.
  this.clearDecidedAction();

  // reset all the phases back to default.
  this.resetPhases();

  // TODO: abstract this.
  //this.showBalloon(J.ABS.Balloons.Frustration);
};

/**
 * Gets whether or not this battler is currently barred from engagement.
 * @returns {boolean}
 */
JABS_Battler.prototype.isEngagementLocked = function()
{
  return this._engagementLock;
};

/**
 * Locks engagement.
 * Disables the ability for this battler to acquire a target and do battle.
 */
JABS_Battler.prototype.lockEngagement = function()
{
  this._engagementLock = true;
};

/**
 * Unlocks engagement.
 * Allows this battler to engage with targets and do battle.
 */
JABS_Battler.prototype.unlockEngagement = function()
{
  this._engagementLock = false;
};

/**
 * Gets the current target of this battler.
 * @returns {JABS_Battler|null}
 */
JABS_Battler.prototype.getTarget = function()
{
  return this._target;
};

/**
 * Sets the target of this battler.
 * @param {JABS_Battler} newTarget The new target.
 */
JABS_Battler.prototype.setTarget = function(newTarget)
{
  this._target = newTarget;
};

/**
 * Gets the last battler struck by this battler.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getBattlerLastHit = function()
{
  if (this._lastHit && this._lastHit.isDead())
  {
    // if the last hit battler was defeated or something, remove it.
    this.setBattlerLastHit(null);
  }

  return this._lastHit;
};

/**
 * Sets the last battler struck by this battler.
 * @param {JABS_Battler} battlerLastHit The battler that is being set as last struck.
 */
JABS_Battler.prototype.setBattlerLastHit = function(battlerLastHit)
{
  this._lastHit = battlerLastHit;

  // the player-controlled character cannot have a target by normal means due
  // to them not being controlled by AI. However, their "last hit" is basically
  // the same thing, so assign their target as well.
  if (this.isPlayer())
  {
    this.setTarget(this._lastHit);
  }
};

/**
 * Gets whether or not this has a last battler hit currently stored.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasBattlerLastHit = function()
{
  return !!this.getBattlerLastHit();
};

/**
 * Clears the last battler hit tracker from this battler.
 */
JABS_Battler.prototype.clearBattlerLastHit = function()
{
  this.setBattlerLastHit(null);
  this.setLastBattlerHitCountdown(0);

  // when clearing the last battler hit, also remove the player's target that
  // was likely added via the above function of "setBattlerLastHit".
  if (this.isPlayer())
  {
    this.setTarget(null);
  }
};

/**
 * Sets the last battler hit countdown.
 * @param {number} duration The duration in frames (60/s).
 */
JABS_Battler.prototype.setLastBattlerHitCountdown = function(duration = 900)
{
  this._lastHitCountdown = duration;
};

/**
 * Counts down the last hit counter.
 * @returns {boolean}
 */
JABS_Battler.prototype.countdownLastHit = function()
{
  if (this._lastHitCountdown <= 0)
  {
    this._lastHitCountdown = 0;
    if (this.hasBattlerLastHit())
    {
      this.clearBattlerLastHit();
    }
  }

  if (this._lastHitCountdown > 0)
  {
    this._lastHitCountdown--;
  }
};

/**
 * Gets whether or not this battler is dead inside.
 * @returns {boolean}
 */
JABS_Battler.prototype.isDead = function()
{
  const battler = this.getBattler();

  if (!battler)
  { // has no battler.
    return true;
  }
  else if (!$gameMap.battlerExists(this))
  { // battler isn't on the map.
    return true;
  }
  else if (battler.isDead() || this.isDying())
  { // battler is actually dead.
    return true;
  }
  // battler is OK!
  return false;

};

/**
 * Gets the current allied target of this battler.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getAllyTarget = function()
{
  return this._allyTarget;
};

/**
 * Sets the allied target of this battler.
 * @param {JABS_Battler} newAlliedTarget The new target.
 */
JABS_Battler.prototype.setAllyTarget = function(newAlliedTarget)
{
  this._allyTarget = newAlliedTarget;
};

/**
 * Determines the distance from this battler and the point.
 * @param {number|null} x2 The x coordinate to check.
 * @param {number|null} y2 The y coordinate to check.
 * @returns {number|null} The distance from the battler to the point.
 */
JABS_Battler.prototype.distanceToPoint = function(x2, y2)
{
  if ((x2 ?? y2) === null) return null;
  const x1 = this.getX();
  const y1 = this.getY();
  const distance = Math.hypot(x2 - x1, y2 - y1).toFixed(2);
  return parseFloat(distance);
};

/**
 * Determines distance from this battler and the target.
 * @param {JABS_Battler} target The target that this battler is checking distance against.
 * @returns {number|null} The distance from this battler to the provided target.
 */
JABS_Battler.prototype.distanceToDesignatedTarget = function(target)
{
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * Determines distance from this battler and the current target.
 * @returns {number|null} The distance.
 */
JABS_Battler.prototype.distanceToCurrentTarget = function()
{
  const target = this.getTarget();
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * Determines distance from this battler and the current ally target.
 * @returns {number|null} The distance.
 */
JABS_Battler.prototype.distanceToAllyTarget = function()
{
  const target = this.getAllyTarget();
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * A shorthand reference to the distance this battler is from it's home.
 * @returns {number} The distance.
 */
JABS_Battler.prototype.distanceToHome = function()
{
  return this.distanceToPoint(this._homeX, this._homeY);
};

/**
 * Gets whether or not this battler will move around while idle.
 * @returns {boolean}
 */
JABS_Battler.prototype.canIdle = function()
{
  return this._canIdle;
};

/**
 * Gets whether or not this battler should show its hp bar.
 * @returns {boolean}
 */
JABS_Battler.prototype.showHpBar = function()
{
  return this._showHpBar;
};

/**
 * Gets whether or not this battler should show its name.
 * @returns {boolean}
 */
JABS_Battler.prototype.showBattlerName = function()
{
  return this._showBattlerName;
};

/**
 * Gets whether or not this battler is in an `alerted` state.
 * @returns {boolean} True if this battler is alerted, false otherwise.
 */
JABS_Battler.prototype.isAlerted = function()
{
  return this._alerted;
};

/**
 * Sets the alerted state for this battler.
 * @param {boolean} alerted The new alerted state (default = true).
 */
JABS_Battler.prototype.setAlerted = function(alerted = true)
{
  this._alerted = alerted;
};

/**
 * Gets whether or not this battler is in an `alerted` state.
 * @returns {number} The duration remaining for this alert state.
 */
JABS_Battler.prototype.getAlertDuration = function()
{
  return this._alertDuration;
};

/**
 * Sets the alerted counter to this number of frames.
 * @param {number} alertedFrames The duration in frames for how long to be alerted.
 */
JABS_Battler.prototype.setAlertedCounter = function(alertedFrames)
{
  this._alertedCounter = alertedFrames;
  if (this._alertedCounter > 0)
  {
    this.setIdle(false);
    this.setAlerted();
  }
  else if (this._alertedCounter <= 0)
  {
    this.setAlerted(false);
  }
};

/**
 * Gets the alerted coordinates.
 * @returns {[number, number]} The `[x, y]` of the alerter.
 */
JABS_Battler.prototype.getAlertedCoordinates = function()
{
  return this._alertedCoordinates;
};

/**
 * Sets the alerted coordinates.
 * @param {number} x The `x` of the alerter.
 * @param {number} y The `y` of the alerter.
 */
JABS_Battler.prototype.setAlertedCoordinates = function(x, y)
{
  this._alertedCoordinates = [x, y];
};

/**
 * Whether or not this battler is at it's home coordinates.
 * @returns {boolean} True if the battler is home, false otherwise.
 */
JABS_Battler.prototype.isHome = function()
{
  return (this._event.x === this._homeX && this._event.y === this._homeY);
};

/**
 * Returns the X coordinate of the event portion's initial placement.
 * @returns {number} The X coordinate of this event's home.
 */
JABS_Battler.prototype.getHomeX = function()
{
  return this._homeX;
};

/**
 * Returns the Y coordinate of the event portion's initial placement.
 * @returns {number} The Y coordinate of this event's home.
 */
JABS_Battler.prototype.getHomeY = function()
{
  return this._homeY;
};

/**
 * Returns the X coordinate of the event.
 * @returns {number} The X coordinate of this event.
 */
JABS_Battler.prototype.getX = function()
{
  return this.getCharacter()._realX;
};

/**
 * Returns the Y coordinate of the event.
 * @returns {number} The Y coordinate of this event.
 */
JABS_Battler.prototype.getY = function()
{
  return this.getCharacter()._realY;
};

/**
 * Retrieves the AI associated with this battler.
 * @returns {JABS_BattlerAI} This battler's AI.
 */
JABS_Battler.prototype.getAiMode = function()
{
  return this._aiMode;
};

/**
 * Gets this follower's leader's AI.
 * @returns {JABS_BattlerAI} This battler's leader's AI.
 */
JABS_Battler.prototype.getLeaderAiMode = function()
{
  // if we don't have a leader, don't.
  if (!this.hasLeader()) return null;

  const leader = $gameMap.getBattlerByUuid(this.getLeader());
  if (!leader) return null;

  return leader.getAiMode();
};

/**
 * Tries to move this battler away from its current target.
 * This may fail if the battler is pinned in a corner or something.
 */
JABS_Battler.prototype.moveAwayFromTarget = function()
{
  const battler = this.getCharacter();
  const target = this.getTarget();
  if (!target) return;
  const character = target.getCharacter();

  battler.moveAwayFromCharacter(character);
};

/**
 * Tries to move this battler away from its current target.
 *
 * There is no pathfinding away, but if its not able to move directly
 * away, it will try a different direction to wiggle out of corners.
 */
JABS_Battler.prototype.smartMoveAwayFromTarget = function()
{
  const battler = this.getCharacter();
  const target = this.getTarget();
  if (!target) return;

  battler.moveAwayFromCharacter(target.getCharacter());
  if (!battler.isMovementSucceeded())
  {
    const threatDir = battler.reverseDir(battler.direction());
    let newDir = (Math.randomInt(4) + 1) * 2;
    while (newDir === threatDir)
    {
      newDir = (Math.randomInt(4) + 1) * 2;
    }
    battler.moveStraight(newDir);
  }
};

/**
 * Tries to move this battler towards its current target.
 */
JABS_Battler.prototype.smartMoveTowardTarget = function()
{
  const target = this.getTarget();
  if (!target) return;

  this.smartMoveTowardCoordinates(target.getX(), target.getY());
};

/**
 * Tries to move this battler towards its ally target.
 */
JABS_Battler.prototype.smartMoveTowardAllyTarget = function()
{
  const target = this.getAllyTarget();
  if (!target) return;

  this.smartMoveTowardCoordinates(target.getX(), target.getY());
};

/**
 * Tries to move this battler toward a set of coordinates.
 * @param {number} x The `x` coordinate to reach.
 * @param {number} y The `y` coordinate to reach.
 */
JABS_Battler.prototype.smartMoveTowardCoordinates = function(x, y)
{
  const character = this.getCharacter();
  const nextDir = character.findDiagonalDirectionTo(x, y);

  if (character.isDiagonalDirection(nextDir))
  {
    const horzvert = character.getDiagonalDirections(nextDir);
    character.moveDiagonally(horzvert[0], horzvert[1]);
  }
  else
  {
    character.moveStraight(nextDir);
  }
};

/**
 * Turns this battler towards it's current target.
 */
JABS_Battler.prototype.turnTowardTarget = function()
{
  const character = this.getCharacter();
  const target = this.getTarget();
  if (!target) return;

  character.turnTowardCharacter(target.getCharacter());
};
//#endregion reference helpers

//#region isReady & cooldowns
/**
 * Initializes a cooldown with the given key.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration to initialize this cooldown with.
 */
JABS_Battler.prototype.initializeCooldown = function(cooldownKey, duration)
{
  // grab the slot being worked with.
  const skillSlot = this.getBattler().getSkillSlot(cooldownKey);

  // if we don't have a slot, then do not process.
  if (!skillSlot) return;

  // set the skillslot's cooldown frames to the default.
  skillSlot.getCooldown().setFrames(duration);
};

/**
 * Gets the cooldown data for a given cooldown key.
 * @param {string} cooldownKey The cooldown to lookup.
 * @returns {JABS_Cooldown}
 */
JABS_Battler.prototype.getCooldown = function(cooldownKey)
{
  const skillSlot = this.getBattler().getSkillSlot(cooldownKey);

  if (!skillSlot)
  {
    console.warn('omg');

    // TODO: make sure enemies get assigned their slots.

    return null;
  }

  return skillSlot.getCooldown();
};

/**
 * Gets the cooldown and skill slot data for a given key.
 * @param {string} key The slot to get the data for.
 * @returns {{ cooldown: JABS_Cooldown, skillslot: JABS_SkillSlot }}
 */
JABS_Battler.prototype.getActionKeyData = function(key)
{
  const cooldown = this.getCooldown(key);
  const skillslot = this.getBattler().getSkillSlot(key);

  if (!cooldown || !skillslot) return null;

  return {
    cooldown,
    skillslot
  }
};

/**
 * Whether or not this battler has finished it's post-action cooldown phase.
 * @returns {boolean} True if the battler is cooled down, false otherwise.
 */
JABS_Battler.prototype.isPostActionCooldownComplete = function()
{
  if (this._postActionCooldownComplete)
  {
    // we are ready to do idle things.
    return true;
  }

  if (this._postActionCooldown <= this._postActionCooldownMax)
  {
    // we are still charging up...
    this._postActionCooldown++;
    return false;
  }
  this._postActionCooldownComplete = true;
  this._postActionCooldown = 0;

  // we are ready to finish phase3!
  return true;

};

/**
 * Starts the post-action cooldown for this battler.
 * @param {number} cooldown The cooldown duration.
 */
JABS_Battler.prototype.startPostActionCooldown = function(cooldown)
{
  this._postActionCooldownComplete = false;
  this._postActionCooldown = 0;
  this._postActionCooldownMax = cooldown;
};

/**
 * Retrieves the battler's idle state.
 * @returns {boolean} True if the battler is idle, false otherwise.
 */
JABS_Battler.prototype.isIdle = function()
{
  return this._idle;
};

/**
 * Sets whether or not this battler is idle.
 * @param {boolean} isIdle True if this battler is idle, false otherwise.
 */
JABS_Battler.prototype.setIdle = function(isIdle)
{
  this._idle = isIdle;
};

/**
 * Whether or not this battler is ready to perform an idle action.
 * @returns {boolean} True if the battler is idle-ready, false otherwise.
 */
JABS_Battler.prototype.isIdleActionReady = function()
{
  if (this._idleActionReady)
  {
    // we are ready to do idle things.
    return true;
  }

  if (this._idleActionCount <= this._idleActionCountMax)
  {
    // we are still charging up...
    this._idleActionCount++;
    return false;
  }
  this._idleActionReady = true;
  this._idleActionCount = 0;

  // we are ready to idle!
  return true;

};

/**
 * Whether or not the skilltype has a base or combo cooldown ready.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @returns {boolean} True if the given skilltype is ready, false otherwise.
 */
JABS_Battler.prototype.isSkillTypeCooldownReady = function(cooldownKey)
{
  const isAnyReady = this.getBattler()
    .getSkillSlotManager()
    .isAnyCooldownReadyForSlot(cooldownKey);
  return isAnyReady;
};

/**
 * Modifies the cooldown for this key by a given amount.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.modCooldownCounter = function(cooldownKey, duration)
{
  this.getCooldown(cooldownKey).modBaseFrames(duration);
};

/**
 * Set the cooldown timer to a designated number.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.setCooldownCounter = function(cooldownKey, duration)
{
  this.getCooldown(cooldownKey).setFrames(duration);
};

/**
 * Resets this battler's combo information.
 * @param {string} cooldownKey The key of this cooldown.
 */
JABS_Battler.prototype.resetComboData = function(cooldownKey)
{
  this.getBattler()
    .getSkillSlotManager()
    .getSkillSlotByKey(cooldownKey)
    .resetCombo();
};

/**
 * Sets the combo frames to be a given value.
 * @param {string} cooldownKey The key associated with the cooldown.
 * @param {number} duration The number of frames until this combo action is ready.
 */
JABS_Battler.prototype.setComboFrames = function(cooldownKey, duration)
{
  this.getCooldown(cooldownKey).setComboFrames(duration);
};

/**
 * Whether or not this battler is ready to take action of any kind.
 * @returns {boolean} True if the battler is ready, false otherwise.
 */
JABS_Battler.prototype.isActionReady = function()
{
  if (this._prepareReady)
  {
    // we are ready to take action.
    return true;
  }

  if (this._prepareCounter < this._prepareMax)
  {
    // we are still charging up...
    this._prepareCounter++;
    return false;
  }

  this._prepareReady = true;
  this._prepareCounter = 0;
  // we are charged up now!
  return true;

};

/**
 * Determines the number of frames between opportunity to take the next action.
 * This maps to time spent in phase1 of JABS AI.
 * @returns {number} The number of frames between actions.
 */
JABS_Battler.prototype.getPrepareTime = function()
{
  return this.getBattler().prepareTime();
};

/**
 * Determines whether or not a skill can be executed based on restrictions or not.
 * This is used by AI.
 * @param {number} chosenSkillId The skill id to be executed.
 * @returns {boolean} True if this skill can be executed, false otherwise.
 */
JABS_Battler.prototype.canExecuteSkill = function(chosenSkillId)
{
  // if there is no chosen skill, then we obviously cannot execute it.
  if (!chosenSkillId) return false;

  // check if the battler can use skills.
  const canUseSkills = this.canBattlerUseSkills();

  // check if the battler can use basic attacks.
  const canUseAttacks = this.canBattlerUseAttacks();

  // if can't use basic attacks or skills, then autofail.
  if (!canUseSkills && !canUseAttacks)
  {
    return false;
  }

  // check if the chosen skill is the enemy's basic attack.
  const isBasicAttack = this.isSkillIdBasicAttack(chosenSkillId);

  // check if basic attacks are blocked plus this being a basic attack.
  if (!canUseAttacks && isBasicAttack)
  {
    // if the skill is a basic attack, but the battler can't attack, then fail.
    return false;
  }

  // if the skill is an assigned skill, but the battler can't use skills, then fail.
  if (!canUseSkills && !isBasicAttack)
  {
    return false;
  }

  // check if this battler can pay the costs for the given skill id.
  if (!this.canPaySkillCost(chosenSkillId))
  {
    // cannot pay the cost.
    return false;
  }

  // build the cooldown key based on the skill data.
  const cooldownKey = this.getCooldownKeyBySkillId(chosenSkillId);

  // check to make sure we have a key.
  if (!cooldownKey)
  {
    // if somehow we have no key, then this skill clearly isn't ready.
    return false;
  }

  // grab the cooldown itself.
  const cooldown = this.getCooldown(cooldownKey);

  // check if the skill was actually a remembered effective skill from a follower.
  if (!cooldown)
  {
    // please stop trying to cast your follower's skills.
    console.warn(this, cooldownKey);
    console.trace();
    return false;
  }

  // check if the base is off cooldown yet.
  if (!cooldown.isBaseReady())
  {
    // cooldown is not ready yet.
    return false;
  }

  // cast the skill!
  return true;
};

JABS_Battler.prototype.getCooldownKeyBySkillId = function(skillId)
{
  // handle accordingly for enemies.
  if (this.isEnemy())
  {
    // grab the skill itself.
    const skill = this.getSkill(skillId);

    // return the arbitrary key.
    return `${skill.id}-${skill.name}`;
  }
  // handle accordingly for actors.
  else if (this.isActor())
  {
    // grab the first slot that the id lives in.
    const slot = this.getBattler().findSlotForSkillId(skillId);

    // if there is no slot with this skill, then its not a basic attack.
    if (!slot) return null;

    // return the found key.
    return slot.key;
  }

  // if somehow it is neither actor nor enemy, then return global.
  return "Global";
};

/**
 * Determines whether or not the given skill id is actually a basic attack
 * skill used by this battler. Basic attack includes main and off hands.
 * @param {number} skillId The skill id to check.
 * @returns {boolean} True if the skill is a basic attack, false otherwise.
 */
JABS_Battler.prototype.isSkillIdBasicAttack = function(skillId)
{
  // handle accordingly if an enemy.
  if (this.isEnemy())
  {
    // grab the enemy basic attack.
    const [basicAttackSkillId] = this.getEnemyBasicAttack();

    // check if the chosen skill is the enemy's basic attack.
    return (skillId === basicAttackSkillId);
  }
  // handle accordingly if an actor.
  else if (this.isActor())
  {
    // grab the first slot that the id lives in.
    const slot = this.getBattler().findSlotForSkillId(skillId);

    // if there is no slot with this skill, then its not a basic attack.
    if (!slot) return false;

    // if the slot key matches our mainhand, then it is a basic attack.
    return (slot.key === JABS_Button.Mainhand || slot.key === JABS_Button.Offhand);
  }

  // handle accordingly if not actor or enemy.
  console.warn(`non-actor/non-enemy checked for basic attack.`, this);
  return false;
};

/**
 * Gets the proper skill based on the skill id.
 * Accommodates J-SkillExtend and/or J-Passives.
 * @param {number} skillId The skill id to retrieve.
 * @returns {RPG_Skill|null}
 */
JABS_Battler.prototype.getSkill = function(skillId)
{
  // check to make sure we actually have a skill id first.
  if (!skillId)
  {
    // return null if we do not.
    return null;
  }

  // return the skill assocaited with the underlying battler.
  return this.getBattler().skill(skillId);
};

/**
 * Determines whether or not this battler can pay the cost of a given skill id.
 * Accommodates skill extensions.
 * @param {number} skillId The skill id to check.
 * @returns {boolean} True if this battler can pay the cost, false otherwise.
 */
JABS_Battler.prototype.canPaySkillCost = function(skillId)
{
  // if the skill cost is more than the battler has resources for, then fail.
  const skill = this.getSkill(skillId);

  // check if the battler can pay the cost.
  if (!this.getBattler().canPaySkillCost(skill))
  {
    return false;
  }

  // we can pay the cost!
  return true;
};
//#endregion isReady & cooldowns

//#region get data
/**
 * Gets the skill id of the last skill that this battler executed.
 * @returns {number}
 */
JABS_Battler.prototype.getLastUsedSkillId = function()
{
  return this._lastUsedSkillId;
};

/**
 * Sets the skill id of the last skill that this battler executed.
 * @param {number} skillId The skill id of the last skill used.
 */
JABS_Battler.prototype.setLastUsedSkillId = function(skillId)
{
  this._lastUsedSkillId = skillId;
};

/**
 * Gets all allies to this battler within a large range.
 * (Not map-wide because that could result in unexpected behavior)
 * @returns {JABS_Battler[]}
 */
JABS_Battler.prototype.getAllNearbyAllies = function()
{
  return $gameMap.getAllyBattlersWithinRange(this, JABS_Battler.allyRubberbandRange());
};

/**
 * Gets the ally ai associated with this battler.
 * @returns {JABS_AllyAI}
 */
JABS_Battler.prototype.getAllyAiMode = function()
{
  // enemies do not have ally ai.
  if (this.isEnemy()) return null;

  return this.getBattler()
    .getAllyAI();
};

/**
 * Applies the battle memory to the battler.
 * Only applicable to allies (for now).
 * @param {JABS_BattleMemory} newMemory The new memory to apply to this battler.
 */
JABS_Battler.prototype.applyBattleMemories = function(newMemory)
{
  // enemies do not (yet) track battle memories.
  if (this.isEnemy()) return;

  return this.getBattler()
    .getAllyAI()
    .applyMemory(newMemory);
};

/**
 * Gets the id of the battler associated with this battler
 * that has been assigned via the battler core data.
 * @returns {number}
 */
JABS_Battler.prototype.getBattlerId = function()
{
  return this._battlerId;
};

/**
 * Gets the skill id of the next combo action in the sequence.
 * @returns {number} The skill id of the next combo action.
 */
JABS_Battler.prototype.getComboNextActionId = function(cooldownKey)
{
  const nextComboId = this.getBattler()
    .getSkillSlotManager()
    .getSlotComboId(cooldownKey);

  return nextComboId;
};

/**
 * Sets the skill id for the next combo action in the sequence.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @param {number} nextComboId The skill id for the next combo action.
 */
JABS_Battler.prototype.setComboNextActionId = function(cooldownKey, nextComboId)
{
  this.getBattler()
    .getSkillSlotManager()
    .setSlotComboId(cooldownKey, nextComboId);
};

/**
 * Gets all skills that are available to this enemy battler.
 * @returns {number[]} The skill ids available to this enemy.
 */
JABS_Battler.prototype.getSkillIdsFromEnemy = function()
{
  const battler = this.getBattler();

  // filter out any "extend" skills as far as this collection is concerned.
  const filtering = action =>
  {
    // grab the skill from the database.
    const skill = battler.skill(action.skillId);

    // determine if the skill is an extend skill or not.
    const isExtendSkill = skill.meta && skill.meta['skillExtend'];

    // filter out the extend skills.
    return !isExtendSkill;
  };

  // grab the database data for this enemy.
  const battlerData = this.getBattler().enemy();

  // return the filtered result of skills.
  return battlerData.actions
    .filter(filtering)
    .map(action => action.skillId);
};

/**
 * Retrieves the `[skillId, rating]` of the basic attack for this enemy.
 * @returns {[number, number]} The `[skillId, rating]` of the basic attack.
 */
JABS_Battler.prototype.getEnemyBasicAttack = function()
{
  const battler = this.getBattler();
  const basicAttackSkill = battler.basicAttackSkillId();
  return [basicAttackSkill, 5];
};

/**
 * Gets all skill ids that this battler has access to, including the basic attack.
 * @returns {number[]}
 */
JABS_Battler.prototype.getAllSkillIdsFromEnemy = function()
{
  // grab all the added skills.
  const skills = this.getSkillIdsFromEnemy();

  // grab this enemy's basic attack.
  const [basicAttackSkillId] = this.getEnemyBasicAttack();

  // add the basic attack to the list of skills.
  skills.push(basicAttackSkillId);

  // return the built list.
  return skills;
};

/**
 * Gets the number of additional/bonus hits per basic attack.
 * Skills (such as magic) do not receive bonus hits at this time.
 * @param {RPG_Skill} skill The skill to consider regarding bonus hits.
 * @param {boolean} isBasicAttack True if this is a basic attack, false otherwise.
 * @returns {number} The number of bonus hits per attack.
 */
JABS_Battler.prototype.getAdditionalHits = function(skill, isBasicAttack)
{
  let bonusHits = 0;
  const battler = this.getBattler();
  if (isBasicAttack)
  {
    // TODO: split "basic attack" bonus hits from "skill" and "all" bonus hits.
    bonusHits += battler.getBonusHits();
    if (skill.repeats > 1)
    {
      bonusHits += skill.repeats - 1;
    }
  }
  else
  {
    // check for skills that may have non-pierce-related bonus hits?
  }

  return bonusHits;
};
//#endregion get data

//#region aggro
/**
 * Adjust the currently engaged target based on aggro.
 */
JABS_Battler.prototype.adjustTargetByAggro = function()
{
  // don't process aggro for inanimate battlers.
  if (this.isInanimate()) return;

  // check if we currently don't have a target.
  if (!this.getTarget())
  {
    // extract your the current highest aggro.
    const highestAggro = this.getHighestAggro();

    // grab the battler for that uuid.
    const newTarget = $gameMap.getBattlerByUuid(highestAggro.uuid());

    // make sure the battler exists before setting it.
    if (newTarget)
    {
      // set it.
      this.setTarget(newTarget);
    }

    // stop processing.
    return;
  }

  // if the target is dead, disengage and end combat.
  // TODO: is this a race condition?
  this.removeAggroIfTargetDead(this.getTarget().getUuid());

  // if there is no aggros remaining, disengage.
  if (this._aggros.length === 0)
  {
    this.disengageTarget();
    return;
  }

  // if there is only 1 aggro remaining
  if (this._aggros.length === 1)
  {
    // if there is no target, just stop that shit.
    if (!this.getTarget()) return;

    // grab the uuid of the first aggro in the list.
    const zerothAggroUuid = this._aggros[0].uuid();

    // check to see if the last aggro in the list belongs to the current target.
    if (!(this.getTarget().getUuid() === zerothAggroUuid))
    {
      // if it doesn't, then get that battler.
      const newTarget = $gameMap.getBattlerByUuid(zerothAggroUuid);
      if (newTarget)
      {
        // then switch to that target!
        this.setTarget(newTarget);
      }
      else
      {
        // if the battler doesn't exist but the aggro does, purge it.
        this.removeAggro(zerothAggroUuid);
      }
    }

    // stop processing.
    return;
  }

  // if you still don't have a target but have multiple aggros, then just give up.
  if (!this.getTarget()) return;

  // find the highest aggro target currently being tracked.
  const highestAggroTarget = this.getHighestAggro();

  // if the current target isn't the highest target, then switch!
  if (!(highestAggroTarget.uuid() === this.getTarget().getUuid()))
  {
    // find the new target to change to that has more aggro than the current target.
    const newTarget = $gameMap.getBattlerByUuid(highestAggroTarget.uuid());

    // if we can't find the target on the map somehow, then try to remove it from the list of aggros.
    if (!newTarget)
    {
      // get the index to remove...
      this.removeAggro(highestAggroTarget.uuid());
    }
    else
    {
      // we found it, let's engage!
      this.engageTarget(newTarget);
    }
  }

  // the current target IS the highest aggro! Continue as-usual.
};

/**
 * Gets all aggros on this battler.
 * @returns {JABS_Aggro[]}
 */
JABS_Battler.prototype.getAllAggros = function()
{
  return this._aggros;
};

/**
 * Gets the highest aggro currently tracked by this battler.
 * @returns {JABS_Aggro}
 */
JABS_Battler.prototype.getHighestAggro = function()
{
  return this._aggros.sort((a, b) =>
  {
    if (a.aggro < b.aggro)
    {
      return 1
    }
    else if (a.aggro > b.aggro)
    {
      return -1;
    }

    return 0;
  })[0];
};

/**
 * If the target is dead, removes it's aggro.
 * @param uuid
 */
JABS_Battler.prototype.removeAggroIfTargetDead = function(uuid)
{
  const battler = $gameMap.getBattlerByUuid(uuid);
  if (!battler || battler.isDead())
  {
    this.removeAggro(uuid);
  }
};

/**
 * Removes a single aggro by its `uuid`.
 * @param {string} uuid The `uuid` of the aggro to remove.
 */
JABS_Battler.prototype.removeAggro = function(uuid)
{
  // get the index to remove...
  const indexToRemove = this._aggros.findIndex(aggro => aggro.uuid() === uuid);
  if (indexToRemove > -1)
  {
    // if currently engaged with the dead target, then disengage.
    if (this.getTarget().getUuid() === uuid)
    {
      this.disengageTarget();
    }

    // ...and remove it.
    this._aggros.splice(indexToRemove, 1);
  }
};

/**
 * Adds a new aggro tracker to this battler, or updates an existing one.
 * @param {string} uuid The unique identifier of the target.
 * @param {number} aggroValue The amount of aggro being modified.
 * @param {boolean} forced If provided, then this application will bypass locks.
 */
JABS_Battler.prototype.addUpdateAggro = function(uuid, aggroValue, forced = false)
{
  // if the aggro is locked, don't adjust it.
  if (this.getBattler()
    .isAggroLocked() && !forced)
  {
    return;
  }

  const foundAggro = this.aggroExists(uuid);
  if (foundAggro)
  {
    foundAggro.modAggro(aggroValue, forced);
  }
  else
  {
    const newAggro = new JABS_Aggro(uuid);
    newAggro.setAggro(aggroValue, forced);
    this._aggros.push(newAggro);
  }
};

/**
 * Resets the aggro for a particular target.
 * @param {string} uuid The unique identifier of the target to reset.
 * @param {boolean} forced If provided, then this application will bypass locks.
 */
JABS_Battler.prototype.resetOneAggro = function(uuid, forced = false)
{
  // if the aggro is locked, don't adjust it.
  if (this.getBattler()
    .isAggroLocked() && !forced)
  {
    return;
  }

  const foundAggro = this.aggroExists(uuid);
  if (foundAggro)
  {
    foundAggro.resetAggro(forced);
  }
  else
  {
    // if the uuid provided is empty, then do nothing with it.
    if (!uuid) return;

    // otherwise, create a new aggro for this battler.
    this.addUpdateAggro(uuid, 0, forced);
  }
};

/**
 * Resets all aggro on this battler.
 * @param {string} uuid The unique identifier of the target resetting this battler's aggro.
 * @param {boolean} forced If provided, then this application will bypass locks.
 */
JABS_Battler.prototype.resetAllAggro = function(uuid, forced = false)
{
  // if the aggro is locked, don't adjust it.
  if (this.getBattler().isAggroLocked() && !forced) return;

  // reset the aggro of the battler that triggered this reset to prevent pursuit.
  this.resetOneAggro(uuid, forced);

  // and reset all aggros this battler has.
  this._aggros.forEach(aggro => aggro.resetAggro(forced));
};

/**
 * Gets an aggro by its unique identifier.
 * If the aggro doesn't exist, then returns undefined.
 * @param {string} uuid The unique identifier of the target resetting this battler's aggro.
 * @returns {JABS_Aggro}
 */
JABS_Battler.prototype.aggroExists = function(uuid)
{
  return this._aggros.find(aggro => aggro.uuid() === uuid);
};

//#endregion aggro

//#region create/apply effects
/**
 * Performs a preliminary check to see if the target is actually able to be hit.
 * @returns {boolean} True if actions can potentially connect, false otherwise.
 */
JABS_Battler.prototype.canActionConnect = function()
{
  // this battler is untargetable.
  if (this.isInvincible()) return false;

  // the player cannot be targeted while holding the DEBUG button.
  if (this.isPlayer() && Input.isPressed(J.ABS.Input.Debug)) return false;

  // precise timing allows for battlers to hit other battlers the instant they
  // meet event conditions, and that is not grounds to hit enemies.
  if (this.getCharacter().isAction())
  {
    return false;
  }

  // passes all the criteria.
  return true;
};

/**
 * Determines whether or not this battler is available as a target based on the
 * provided action's scopes.
 * @param {JABS_Action} action The action to check validity for.
 * @param {JABS_Battler} target The potential candidate for hitting with this action.
 * @param {boolean} alreadyHitOne Whether or not this action has already hit a target.
 */
JABS_Battler.prototype.isWithinScope = function(action, target, alreadyHitOne = false)
{
  const user = action.getCaster();
  const gameAction = action.getAction();
  const scopeAlly = gameAction.isForFriend();
  const scopeOpponent = gameAction.isForOpponent();
  const scopeSingle = gameAction.isForOne();
  const scopeSelf = gameAction.isForUser();
  const scopeMany = gameAction.isForAll();
  const scopeEverything = gameAction.isForEveryone();
  const scopeAllAllies = scopeAlly && scopeMany;
  const scopeAllOpponents = scopeOpponent && scopeMany;

  const targetIsSelf = (user.getUuid() === target.getUuid() || (action.getAction()
    .isForUser()));
  const actionIsSameTeam = user.getTeam() === this.getTeam();
  const targetIsOpponent = !user.isSameTeam(this.getTeam());

  // scope is for 1 target, and we already found one.
  if (scopeSingle && alreadyHitOne)
  {
    return false;
  }

  // the caster and target are the same.
  if (targetIsSelf && (scopeSelf || scopeAlly || scopeAllAllies || scopeEverything))
  {
    return true;
  }

  // action is from one of the target's allies.
  // inanimate battlers cannot be targeted by their allies with direct skills.
  if (actionIsSameTeam &&
    (scopeAlly || scopeAllAllies || scopeEverything) &&
    !(action.isDirectAction() && target.isInanimate()))
  {
    return true;
  }

  // action is for enemy battlers and scope is for opponents.
  if (targetIsOpponent && (scopeOpponent || scopeAllOpponents || scopeEverything))
  {
    return true;
  }

  // meets no criteria, target is not within scope of this action.
  return false;
};

/**
 * Creates a new `JABS_Action` from a skill id.
 * @param {number} skillId The id of the skill to create a `JABS_Action` from.
 * @param {boolean} isRetaliation True if this is a retaliation action, false otherwise.
 * @param {string} cooldownKey The cooldown key associated with this action.
 * @returns {JABS_Action[]} The `JABS_Action` based on the skill id provided.
 */
JABS_Battler.prototype.createJabsActionFromSkill = function(
  skillId,
  isRetaliation = false,
  cooldownKey = null)
{
  // create the underlying skill for the action.
  const action = new Game_Action(
    this.getBattler(),
    false);

  // set the skill which also applies all applicable overlays.
  action.setSkill(skillId);

  // grab the potentially extended skill.
  const skill = this.getSkill(skillId);

  // calculate the projectile count and directions.
  const projectileCount = skill.jabsProjectile ?? 1;
  const projectileDirections = $jabsEngine.determineActionDirections(
    this.getCharacter().direction(),
    projectileCount);

  // calculate how many actions will be generated to accommodate the directions.
  const actions = [];
  projectileDirections.forEach(direction =>
  {
    const mapAction = new JABS_Action({
      uuid: J.BASE.Helpers.generateUuid(),
      baseSkill: action.item(),
      teamId: this.getTeam(),
      gameAction: action,
      caster: this,
      isRetaliation: isRetaliation,
      direction: direction,
      cooldownKey: cooldownKey,
    });

    actions.push(mapAction);
  }, this);

  return actions;
};

/**
 * Constructs the attack data from this battler's skill slot.
 * @param {string} cooldownKey The cooldown key.
 * @returns {JABS_Action[]} The constructed `JABS_Action`s.
 */
JABS_Battler.prototype.getAttackData = function(cooldownKey)
{
  // grab the underlying battler.
  const battler = this.getBattler();

  // get the skill equipped in the designated slot.
  const skillId = this.getSkillIdForAction(cooldownKey);

  // if there isn't one, then we don't do anything.
  if (!skillId) return [];

  // check to make sure we can actually use the skill.
  if (!battler.meetsSkillConditions(battler.skill(skillId))) return [];

  // check to make sure we actually know the skill, too.
  if (!battler.hasSkill(skillId)) return [];

  // otherwise, use the skill from the slot to build an action.
  return this.createJabsActionFromSkill(skillId, false, cooldownKey);
};

/**
 * Gets the next skill id to create an action from for the given slot.
 * Accommodates combo actions.
 * @param {string} slot The slot for the skill to check.
 * @returns {number}
 */
JABS_Battler.prototype.getSkillIdForAction = function(slot)
{
  // grab the underlying battler.
  const battler = this.getBattler();

  // check the slot for a combo action.
  let skillId;

  // check if we have a skill id in the next combo action id slot.
  if (this.getComboNextActionId(slot) !== 0)
  {
    // capture the combo action id.
    skillId = this.getComboNextActionId(slot);
  }
  // if no combo...
  else
  {
    // then just grab the skill id in the slot.
    skillId = battler.getEquippedSkill(slot);
  }

  // return whichever skill id was found.
  return skillId;
};

/**
 * Consumes an item and performs its effects.
 * @param {number} toolId The id of the tool/item to be used.
 * @param {boolean} isLoot Whether or not this is a loot pickup.
 */
// eslint-disable-next-line complexity
JABS_Battler.prototype.applyToolEffects = function(toolId, isLoot = false)
{
  // grab the item data.
  const item = $dataItems[toolId];

  // grab this battler.
  const battler = this.getBattler();

  // force the player to use the item.
  battler.consumeItem(item);

  // flag the slot for refresh.
  battler.getSkillSlotManager().getToolSlot().flagSkillSlotForRefresh();

  // also generate an action based on this tool.
  const gameAction = new Game_Action(battler, false);
  gameAction.setItem(toolId);

  // handle scopes of the tool.
  const scopeNone = gameAction.item().scope === 0;
  const scopeSelf = gameAction.isForUser();
  const scopeAlly = gameAction.isForFriend();
  const scopeOpponent = gameAction.isForOpponent();
  const scopeSingle = gameAction.isForOne();
  const scopeAll = gameAction.isForAll();
  const scopeEverything = gameAction.isForEveryone();

  const scopeAllAllies = scopeEverything || (scopeAll && scopeAlly);
  const scopeAllOpponents = scopeEverything || (scopeAll && scopeOpponent);
  const scopeOneAlly = (scopeSingle && scopeAlly);
  const scopeOneOpponent = (scopeSingle && scopeOpponent);

  // apply tool effects based on scope.
  if (scopeSelf || scopeOneAlly)
  {
    this.applyToolToPlayer(toolId);
  }
  else if (scopeEverything)
  {
    this.applyToolForAllAllies(toolId);
    this.applyToolForAllOpponents(toolId);
  }
  else if (scopeOneOpponent)
  {
    this.applyToolForOneOpponent(toolId);
  }
  else if (scopeAllAllies)
  {
    this.applyToolForAllAllies(toolId);
  }
  else if (scopeAllOpponents)
  {
    this.applyToolForAllOpponents(toolId);
  }
  else if (scopeNone)
  {
    // do nothing, the item has no scope and must be relying purely on the skillId.
  }
  else
  {
    console.warn(`unhandled scope for tool: [ ${gameAction.item().scope} ]!`);
  }

  // applies common events that may be a part of an item's effect.
  gameAction.applyGlobal();

  // create the log for the tool use.
  this.createToolLog(item);

  // extract the cooldown and skill id from the item.
  const { jabsCooldown: itemCooldown, jabsSkillId: itemSkillId } = item;

  // it was an item with a skill attached.
  if (itemSkillId)
  {
    const mapAction = this.createJabsActionFromSkill(itemSkillId);
    mapAction.forEach(action =>
    {
      action.setCooldownType(JABS_Button.Tool);
      $jabsEngine.executeMapAction(this, action);
    });
  }

  // if the last item was consumed, unequip it.
  if (!isLoot && !$gameParty.items().includes(item))
  {
    // remove the item from the slot.
    //battler.setEquippedSkill(JABS_Button.Tool, 0);

    battler.getSkillSlotManager().clearSlot(JABS_Button.Tool);

    // build a lot for it.
    const log = new MapLogBuilder()
      .setupUsedLastItem(item.id)
      .build();
    $gameTextLog.addLog(log);

    // flag the slot for refresh.
    //battler.getSkillSlotManager().getToolSlot().flagSkillSlotForRefresh();
  }
  else
  {
    // it is an item with a custom cooldown.
    if (itemCooldown)
    {
      if (!isLoot) this.modCooldownCounter(JABS_Button.Tool, itemCooldown);
    }

    // it was an item, didn't have a skill attached, and didn't have a cooldown.
    if (!itemCooldown && !itemSkillId && !isLoot)
    {
      this.modCooldownCounter(JABS_Button.Tool, J.ABS.DefaultValues.CooldownlessItems);
    }
  }
};

/**
 * Applies the effects of the tool against the leader.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolToPlayer = function(toolId)
{
  // apply tool effects against player.
  const battler = this.getBattler();
  const gameAction = new Game_Action(battler, false);
  gameAction.setItem(toolId);
  gameAction.apply(battler);

  // display popup from item.
  this.generatePopItem(gameAction, toolId);

  // show tool animation.
  this.showAnimation($dataItems[toolId].animationId);
};

/**
 * Generates a popup based on the item used.
 * @param {Game_Action} gameAction The action describing the tool's effect.
 * @param {number} itemId The target having the action applied against.
 * @param {JABS_Battler} target The target for calculating damage; defaults to self.
 */
JABS_Battler.prototype.generatePopItem = function(gameAction, itemId, target = this)
{
  // if we are not using popups, then don't do this.
  if (!J.POPUPS) return;

  // grab some shorthand variables for local use.
  const character = this.getCharacter();
  const toolData = $dataItems[itemId];

  // generate the textpop.
  const itemPop = $jabsEngine.configureDamagePop(gameAction, toolData, this, target);

  // add the pop to the target's tracking.
  character.addTextPop(itemPop);
  character.setRequestTextPop();
};

/**
 * Applies the effects of the tool against all allies on the team.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForAllAllies = function(toolId)
{
  const battlers = $gameParty.battleMembers();
  if (battlers.length > 1)
  {
    battlers.shift(); // remove the leader, because that's the player.
    battlers.forEach(battler =>
    {
      const gameAction = new Game_Action(battler, false);
      gameAction.setItem(toolId);
      gameAction.apply(battler);
    });
  }

  // also apply effects to player/leader.
  this.applyToolToPlayer(toolId);
};

/**
 * Applies the effects of the tool against all opponents on the map.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForOneOpponent = function(toolId)
{
  const item = $dataItems[toolId];
  let jabsBattler = this.getTarget();
  if (!jabsBattler)
  {
    // if we don't have a target, get the last hit battler instead.
    jabsBattler = this.getBattlerLastHit();
  }

  if (!jabsBattler)
  {
    // if we don't have a last hit battler, then give up on this.
    return;
  }

  // grab the battler being affected by this item.
  const battler = jabsBattler.getBattler();

  // create the game action based on the data.
  const gameAction = new Game_Action(battler, false);

  // apply the effects against the battler.
  gameAction.apply(battler);

  // generate the text popup for the item usage on the target.
  this.generatePopItem(gameAction, toolId, jabsBattler);
};

/**
 * Applies the effects of the tool against all opponents on the map.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForAllOpponents = function(toolId)
{
  const battlers = $gameMap.getEnemyBattlers();
  battlers.forEach(jabsBattler =>
  {
    // grab the battler being affected by this item.
    const battler = jabsBattler.getBattler();

    // create the game action based on the data.
    const gameAction = new Game_Action(battler, false);

    // apply the effects against the battler.
    gameAction.apply(battler);

    // generate the text popup for the item usage on the target.
    this.generatePopItem(gameAction, toolId);
  }, this);
};

/**
 * Creates the text log entry for executing an tool effect.
 */
JABS_Battler.prototype.createToolLog = function(item)
{
  // if not enabled, skip this.
  if (!J.LOG) return;

  const log = new MapLogBuilder()
    .setupUsedItem(this.getReferenceData().name, item.id)
    .build();
  $gameTextLog.addLog(log);
};

/**
 * Executes the pre-defeat processing for a battler.
 * @param {JABS_Battler} victor The `JABS_Battler` that defeated this battler.
 */
JABS_Battler.prototype.performPredefeatEffects = function(victor)
{
  const battler = this.getBattler();
  if (this.isActor() && battler.needsDeathEffect())
  {
    this.showAnimation(152);
    battler.toggleDeathEffect();
  }
  else if (this.isEnemy())
  {
    this.showAnimation(151);
  }

  const onOwnDefeatSkills = battler.onOwnDefeatSkillIds();
  if (onOwnDefeatSkills.length)
  {
    onOwnDefeatSkills.forEach(onDefeatSkill =>
    {
      if (onDefeatSkill.shouldTrigger())
      {
        $jabsEngine.forceMapAction(this, onDefeatSkill.skillId, false);
      }
    });
  }

  const onTargetDefeatSkills = victor.getBattler().onTargetDefeatSkillIds();
  if (onTargetDefeatSkills.length)
  {
    onTargetDefeatSkills.forEach(onDefeatSkill =>
    {
      const castFromTarget = onDefeatSkill.appearOnTarget();
      if (onDefeatSkill.shouldTrigger())
      {
        if (castFromTarget)
        {
          $jabsEngine.forceMapAction(victor, onDefeatSkill.skillId, false, this.getX(), this.getY());
        }
        else
        {
          $jabsEngine.forceMapAction(victor, onDefeatSkill.skillId, false);
        }
      }
    });
  }
};

/**
 * Executes the post-defeat processing for a defeated battler.
 * @param {JABS_Battler} victor The `JABS_Battler` that defeated this battler.
 */
JABS_Battler.prototype.performPostdefeatEffects = function(victor)
{
  if (this.isActor())
  {
    this.setDying(true);
  }
};
//#endregion apply effects

//#region guarding
/**
 * Whether or not the precise-parry window is active.
 * @returns {boolean}
 */
JABS_Battler.prototype.parrying = function()
{
  return this._parryWindow > 0;
};

/**
 * Sets the battlers precise-parry window frames.
 * @param {number} parryFrames The number of frames available for precise-parry.
 */
JABS_Battler.prototype.setParryWindow = function(parryFrames)
{
  if (parryFrames < 0)
  {
    this._parryWindow = 0;
  }
  else
  {
    this._parryWindow = parryFrames;
  }
};

/**
 * Get whether or not this battler is currently guarding.
 * @returns {boolean}
 */
JABS_Battler.prototype.guarding = function()
{
  return this._isGuarding;
};

/**
 * Set whether or not this battler is currently guarding.
 * @param {boolean} isGuarding True if the battler is guarding, false otherwise.
 */
JABS_Battler.prototype.setGuarding = function(isGuarding)
{
  this._isGuarding = isGuarding;
};

/**
 * The flat amount to reduce damage by when guarding.
 * @returns {number}
 */
JABS_Battler.prototype.flatGuardReduction = function()
{
  if (!this.guarding()) return 0;

  return this._guardFlatReduction;
};

/**
 * Sets the battler's flat reduction when guarding.
 * @param {number} flatReduction The flat amount to reduce when guarding.
 */
JABS_Battler.prototype.setFlatGuardReduction = function(flatReduction)
{
  this._guardFlatReduction = flatReduction;
};

/**
 * The percent amount to reduce damage by when guarding.
 * @returns {number}
 */
JABS_Battler.prototype.percGuardReduction = function()
{
  if (!this.guarding()) return 0;

  return this._guardPercReduction;
};

/**
 * Sets the battler's percent reduction when guarding.
 * @param {number} percReduction The percent amount to reduce when guarding.
 */
JABS_Battler.prototype.setPercGuardReduction = function(percReduction)
{
  this._guardPercReduction = percReduction;
};

/**
 * Checks to see if retrieving the counter-guard skill id is appropriate.
 * @returns {number[]}
 */
JABS_Battler.prototype.counterGuard = function()
{
  return this.guarding()
    ? this.counterGuardIds()
    : [];
};

/**
 * Gets the id of the skill for counter-guarding.
 * @returns {number[]}
 */
JABS_Battler.prototype.counterGuardIds = function()
{
  return this._counterGuardIds;
};

/**
 * Sets the battler's retaliation id for guarding.
 * @param {number[]} counterGuardSkillIds The skill id to counter with while guarding.
 */
JABS_Battler.prototype.setCounterGuard = function(counterGuardSkillIds)
{
  this._counterGuardIds = counterGuardSkillIds;
};

/**
 * Checks to see if retrieving the counter-parry skill id is appropriate.
 * @returns {number[]}
 */
JABS_Battler.prototype.counterParry = function()
{
  return this.guarding()
    ? this.counterParryIds()
    : [];
};

/**
 * Gets the ids of the skill for counter-parrying.
 * @returns {number[]}
 */
JABS_Battler.prototype.counterParryIds = function()
{
  return this._counterParryIds;
};

/**
 * Sets the id of the skill to retaliate with when successfully precise-parrying.
 * @param {number[]} counterParrySkillIds The skill ids of the counter-parry skill.
 */
JABS_Battler.prototype.setCounterParry = function(counterParrySkillIds)
{
  this._counterParryIds = counterParrySkillIds;
};

/**
 * Gets the guard skill id most recently assigned.
 * @returns {number}
 */
JABS_Battler.prototype.getGuardSkillId = function()
{
  return this._guardSkillId;
};

/**
 * Sets the guard skill id to a designated skill id.
 *
 * This gets removed when guarding/parrying.
 * @param guardSkillId
 */
JABS_Battler.prototype.setGuardSkillId = function(guardSkillId)
{
  this._guardSkillId = guardSkillId;
};

/**
 * Gets all data associated with guarding for this battler.
 * @returns {JABS_GuardData|null}
 */
JABS_Battler.prototype.getGuardData = function(cooldownKey)
{
  // shorthand the battler of which we're getting data for.
  const battler = this.getBattler();

  // determine the skill in the given slot.
  const skillId = battler.getEquippedSkill(cooldownKey);

  // if we have no skill to guard with, then we don't guard.
  if (!skillId) return null;

  // get the skill.
  const skill = this.getSkill(skillId);

  // check also to make sure we can use the guard skill in the slot.
  const canUse = battler.meetsSkillConditions(skill);

  // if we cannot use the guard skill due to constraints, then we don't guard.
  if (!canUse) return null;

  // return the guard data off the skill.
  return skill.jabsGuardData;
};

/**
 * Determines whether or not the skill slot is a guard-type skill or not.
 * @param {string} cooldownKey The key to determine if its a guard skill or not.
 * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.prototype.isGuardSkillByKey = function(cooldownKey)
{
  // get the equipped skill in the given slot.
  const skillId = this.getBattler().getEquippedSkill(cooldownKey);

  // if we don't hve a skill id, it isn't a guard skill.
  if (!skillId) return false;

  // if it it isn't a guard skill by its id, then ... it isn't a guard skill.
  if (!JABS_Battler.isGuardSkillById(skillId)) return false;

  // its a guard skill!
  return true;
};

/**
 * Triggers and maintains the guard state.
 * @param {boolean} guarding True if the battler is guarding, false otherwise.
 * @param {string} skillSlot The skill slot to build guard data from.
 */
JABS_Battler.prototype.executeGuard = function(guarding, skillSlot)
{
  // if we're still guarding, and already in a guard state, don't reset.
  if (guarding && this.guarding()) return;

  // if not guarding anymore, turn off the guard state.
  if (!guarding && this.guarding())
  {
    // stop guarding.
    this.endGuarding();

    // stop processing.
    return;
  }

  // if we aren't guarding now, and weren't guarding before, don't do anything.
  if (!guarding) return;

  // if not guarding, wasn't guarding before, but want to guard, then let's guard!
  const guardData = this.getGuardData(skillSlot);

  // if we cannot guard, then don't try.
  if (!guardData || !guardData.canGuard()) return;

  // begin guarding!
  this.startGuarding(skillSlot);
};

/**
 * Begin guarding with the given skill slot.
 * @param {string} skillSlot The skill slot containing the guard data.
 */
JABS_Battler.prototype.startGuarding = function(skillSlot)
{
  // grab the guard data.
  const guardData = this.getGuardData(skillSlot);

  // begin guarding!
  this.setGuarding(true);
  this.setFlatGuardReduction(guardData.flatGuardReduction);
  this.setPercGuardReduction(guardData.percGuardReduction);
  this.setCounterGuard(guardData.counterGuardIds);
  this.setCounterParry(guardData.counterParryIds);
  this.setGuardSkillId(guardData.skillId);

  // calculate parry frames, include eva bonus to parry.
  const totalParryFrames = this.getBonusParryFrames(guardData) + guardData.parryDuration;

  // if the guarding skill has a parry window, apply those frames once.
  if (guardData.canParry()) this.setParryWindow(totalParryFrames);

  // set the pose!
  const skillId = this.getBattler().getEquippedSkill(skillSlot);
  this.performActionPose(this.getSkill(skillId));
};

/**
 * Ends the guarding stance for this battler.
 */
JABS_Battler.prototype.endGuarding = function()
{
  // end the guarding tracker.
  this.setGuarding(false);

  // remove any remaining parry time.
  this.setParryWindow(0);

  // stop posing.
  this.endAnimation();
};

/**
 * Abstraction of the definition of how to determine what the bonus to parry frames is.
 * @param {JABS_GuardData} guardData The guard data.
 * @returns {number}
 */
JABS_Battler.prototype.getBonusParryFrames = function(guardData)
{
  return Math.floor((this.getBattler().eva) * guardData.parryDuration);
};

/**
 * Counts down the parry window that occurs when guarding is first activated.
 */
JABS_Battler.prototype.countdownParryWindow = function()
{
  if (this.parrying())
  {
    this._parryWindow--;
  }

  if (this._parryWindow < 0)
  {
    this._parryWindow = 0;
  }
};
//#endregion guarding

//#region actionposes/animations
/**
 * Executes an action pose.
 * Will silently fail if the asset is missing.
 * @param {RPG_Skill} skill The skill to pose for.
 */
JABS_Battler.prototype.performActionPose = function(skill)
{
  // if we are still animating from a previous skill, prematurely end it.
  if (this._posing)
  {
    this.endAnimation();
  }

  // if we have a pose suffix for this skill, then try to perform the pose.
  if (skill.jabsPoseData)
  {
    this.changeCharacterSprite(skill);
  }
};

/**
 * Executes the change of character sprite based on the action pose data
 * from within a skill's notes.
 * @param {RPG_Skill} skill The skill to pose for.
 */
JABS_Battler.prototype.changeCharacterSprite = function(skill)
{
  // establish the base sprite data.
  const baseSpriteName = this.getCharacterSpriteName();
  this.captureBaseSpriteInfo();

  // define the duration for this pose.
  this.setAnimationCount(skill.jabsPoseDuration);

  // determine the new action pose sprite name.
  const newCharacterSprite = `${baseSpriteName}${skill.jabsPoseSuffix}`;

  // stitch the file path together with the sprite url.
  const spritePath = `img/characters/${Utils.encodeURI(newCharacterSprite)}.png`;

  // check if the sprite exists.
  const spriteExists = StorageManager.fileExists(spritePath);

  // only actually switch to the other character sprite if it exists.
  if (spriteExists)
  {
    // load the character into cache.
    ImageManager.loadCharacter(newCharacterSprite);

    // actually set the character.
    this.getCharacter().setImage(newCharacterSprite, skill.jabsPoseIndex);
  }
};

/**
 * Forcefully ends the pose animation.
 */
JABS_Battler.prototype.endAnimation = function()
{
  this.setAnimationCount(0);
  this.resetAnimation();
};

/**
 * Sets the pose animation count to a given amount.
 * @param {number} count The number of frames to animate for.
 */
JABS_Battler.prototype.setAnimationCount = function(count)
{
  this._poseFrames = count;
  if (this._poseFrames > 0)
  {
    this._posing = true;
  }

  if (this._poseFrames <= 0)
  {
    this._posing = false;
    this._poseFrames = 0;
  }
};

/**
 * Resets the pose animation for this battler.
 */
JABS_Battler.prototype.resetAnimation = function()
{
  if (!this._baseSpriteImage && !this._baseSpriteIndex) return;
  if (this._posing)
  {
    this.endAnimation();
  }

  const originalImage = this._baseSpriteImage;
  const originalIndex = this._baseSpriteIndex;
  const currentImage = this.getCharacterSpriteName();
  const currentIndex = this.getCharacterSpriteIndex();
  const character = this.getCharacter();
  if (originalImage !== currentImage || originalIndex !== currentIndex)
  {
    character.setImage(originalImage, originalIndex);
  }
};
//#endregion actionposes/animations

//#region utility helpers
/**
 * Forces a display of a emoji balloon above this battler's head.
 * @param {number} balloonId The id of the balloon to display on this character.
 */
JABS_Battler.prototype.showBalloon = function(balloonId)
{
  $gameTemp.requestBalloon(this._event, balloonId);
};

/**
 * Displays an animation on the battler.
 * @param {number} animationId The id of the animation to play on the battler.
 */
JABS_Battler.prototype.showAnimation = function(animationId)
{
  this.getCharacter().requestAnimation(animationId);
};

/**
 * Checks if there is currently an animation playing on this character.
 * @returns {boolean} True if there is an animation playing, false otherwise.
 */
JABS_Battler.prototype.isShowingAnimation = function()
{
  return this.getCharacter().isAnimationPlaying();
};
//#endregion utility helpers
//#endregion JABS_Battler

//#region JABS_BattlerAI
/**
 * An object representing the structure of the `JABS_Battler` AI.
 */
class JABS_BattlerAI
{
  /**
   * @constructor
   * @param {boolean} careful Add pathfinding pursuit and more.
   * @param {boolean} executor Add weakpoint targeting.
   * @param {boolean} reckless Add skill spamming over attacking.
   * @param {boolean} healer Prioritize healing if health is low.
   * @param {boolean} follower Only attacks alone, obeys leaders.
   * @param {boolean} leader Enables ally coordination.
   */
  constructor(
    careful = false,
    executor = false,
    reckless = false,
    healer = false,
    follower = false,
    leader = false
  )
  {
    /**
     * An ai trait that prevents this user from executing skills that are
     * elementally ineffective against their target.
     */
    this.careful = careful;

    /**
     * An ai trait that encourages this user to always use the strongest
     * available skill.
     */
    this.executor = executor;

    /**
     * An ai trait that forces this user to always use skills if possible.
     */
    this.reckless = reckless;

    /**
     * An ai trait that prioritizes healing allies.
     * If combined with smart, the most effective healing skill will be used.
     * If combined with reckless, the healer will spam healing.
     * If combined with smart AND reckless, the healer will only use the biggest
     * healing spells available.
     */
    this.healer = healer;

    /**
     * An ai trait that prevents the user from executing anything other than
     * their basic attack while they lack a leader.
     */
    this.follower = follower;

    /**
     * An ai trait that gives a battler the ability to use its own ai to
     * determine skills for a follower. This is usually combined with other
     * ai traits.
     */
    this.leader = leader;
  }

  /**
   * Checks whether or not this AI has any bonus ai traits.
   * @returns {boolean} True if there is at least one bonus trait, false otherwise.
   */
  hasBonusAiTraits()
  {
    return (
      this.careful ||
      this.executor ||
      this.reckless ||
      this.healer ||
      this.follower ||
      this.leader);
  }

  /**
   * Decides an action for the designated follower based on the leader's ai.
   * @param {JABS_Battler} leaderBattler The leader deciding the action.
   * @param {JABS_Battler} followerBattler The follower executing the decided action.
   * @returns {number} The skill id of the decided skill for the follower to perform.
   */
  decideActionForFollower(leaderBattler, followerBattler)
  {
    // grab the basic attack skill id for this battler.
    const [basicAttackSkillId] = followerBattler.getEnemyBasicAttack();

    let skillsToUse = followerBattler.getSkillIdsFromEnemy();

    // if the enemy has no skills, then just basic attack.
    if (!skillsToUse.length)
    {
      // if there are no actual skills on this enemy, just use it's basic attack.
      return basicAttackSkillId;
    }

    // all follower actions are decided based on the leader's ai.
    const {careful, executor, healer} = this;

    // the leader calculates for the follower, so the follower gets the leader's sight as a bonus.
    const modifiedSightRadius = leaderBattler.getSightRadius() + followerBattler.getSightRadius();

    // healer AI takes priority.
    if (healer)
    {
      // get nearby allies with the leader's modified sight range of both battlers.
      const allies = $gameMap.getBattlersWithinRange(leaderBattler, modifiedSightRadius);

      // prioritize healing when self or allies are low on hp.
      if (healer)
      {
        skillsToUse = this.filterSkillsHealerPriority(followerBattler, skillsToUse, allies);
      }
    }
    else if (careful || executor)
    {
      // focus on the leader's target instead of the follower's target.
      skillsToUse = this.decideAttackAction(leaderBattler, skillsToUse);
    }

    // if the enemy has no skills after all the filtering, then just basic attack.
    if (!skillsToUse.length)
    {
      // basic attacking is always an option.
      return basicAttackSkillId;
    }

    // handle either collection or single skill.
    // TODO: probably should unify the responses of the above to return either a single OR collection.
    let chosenSkillId = Array.isArray(skillsToUse) ? skillsToUse[0] : skillsToUse;

    // grab the battler of the follower.
    const followerGameBattler = followerBattler.getBattler();

    // grab the skill.
    const skill = followerGameBattler.skill(chosenSkillId);

    // check if they can pay the costs of the skill.
    if (!followerGameBattler.canPaySkillCost(skill))
    {
      // if they can't pay the cost of the decided skill, you can always basic attack!
      chosenSkillId = basicAttackSkillId;
    }

    return chosenSkillId;
  }

  /**
   * Decides a support-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideSupportAction(user, skillsToUse)
  {
    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return [];

    const allies = $gameMap.getAllyBattlersWithinRange(user, user.getSightRadius());

    // prioritize healing when self or allies are low on hp.
    if (this.healer)
    {
      skillsToUse = this.filterSkillsHealerPriority(user, skillsToUse, allies);
    }

    // if we ended up not picking a skill, then clear any ally targeting.
    if (!skillsToUse.length)
    {
      user.setAllyTarget(null);
    }

    // handle the possibility of none or many skills still remaining.
    return this.decideFromNoneToManySkills(user, skillsToUse);
  }

  /**
   * Decides an attack-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideAttackAction(user, skillsToUse)
  {
    // reduce the list to only castable skills.
    skillsToUse = this.filterUncastableSkills(user, skillsToUse);

    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return [];

    const {careful, executor} = this;
    const target = user.getTarget();

    // filter out skills that are elementally ineffective.
    if (careful)
    {
      skillsToUse = this.filterElementallyIneffectiveSkills(skillsToUse, target);
    }

    // find most elementally effective skill vs the target.
    if (executor)
    {
      skillsToUse = this.findMostElementallyEffectiveSkill(skillsToUse, user, target);
    }

    // handle the possibility of none or many skills still remaining.
    return this.decideFromNoneToManySkills(user, skillsToUse);
  }

  /**
   * Filters out skills that cannot be executed at this time by the battler.
   * This prevents the user from continuously picking a skill they cannot execute.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @returns {number[]}
   */
  filterUncastableSkills(user, skillsToUse)
  {
    // check to make sure we have skills to filter.
    if (!skillsToUse || !skillsToUse.length) return [];

    // filter the skills by whether or not they can be executed.
    return skillsToUse.filter(user.canExecuteSkill, user);
  }

  /**
   * A protection method for handling none, one, or many skills remaining after
   * filtering, and only returning a single skill id.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]|number|null} skillsToUse The available skills to use.
   * @returns {number}
   */
  decideFromNoneToManySkills(user, skillsToUse)
  {
    // check if "skills" is actually just one valid skill.
    if (Number.isInteger(skillsToUse))
    {
      // return that, this is fine.
      return skillsToUse;
    }
    // check if "skills" is indeed an array of skills with values.
    else if (Array.isArray(skillsToUse) && skillsToUse.length)
    {
      // pick one at random.
      return skillsToUse[Math.randomInt(skillsToUse.length)];
    }

    // always at least basic attack.
    return user.getEnemyBasicAttack()[0];
  }

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will purge all elementally ineffective skills from the collection.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler} target The battler to decide the action about.
   */
  filterElementallyIneffectiveSkills(skillsToUse, target)
  {
    if (skillsToUse.length > 1)
    {
      skillsToUse = skillsToUse.filter(skillId =>
      {
        const testAction = new Game_Action(target.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        return rate >= 1
      });
    }

    return skillsToUse;
  }

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will choose the skill that has the highest elemental effectiveness.
   * @param {number[]|number} skillsToUse The available skills to use.
   * @param {JABS_Battler} user The battler to decide the action.
   * @param {JABS_Battler} target The battler to decide the action about.
   */
  findMostElementallyEffectiveSkill(skillsToUse, user, target)
  {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    if (skillsToUse.length > 1)
    {
      const elementalSkillCollection = [];
      skillsToUse.forEach(skillId =>
      {
        const testAction = new Game_Action(user.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        elementalSkillCollection.push([skillId, rate]);
      });

      // sorts the skills by their elemental effectiveness.
      elementalSkillCollection.sort((a, b) =>
      {
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        return 0;
      });

      // only use the highest elementally effective skill.
      skillsToUse = elementalSkillCollection[0][0];
    }

    return skillsToUse;
  }

  /**
   * Filters skills by a healing priority.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler[]} allies
   * @returns {number} The best skill id for healing according to this battler.
   */
  filterSkillsHealerPriority(user, skillsToUse, allies)
  {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    // if we have no ai traits that affect skill-decision-making, then don't perform the logic.
    const {careful, reckless} = this;
    if (!careful && !reckless) return skillsToUse;

    let mostWoundedAlly = null;
    let lowestHpRatio = 1.01;
    let actualHpDifference = 0;
    let alliesBelow66 = 0;
    let alliesMissingAnyHp = 0;

    // iterate over allies to determine the ally with the lowest hp%
    allies.forEach(ally =>
    {
      const battler = ally.getBattler();
      const hpRatio = battler.hp / battler.mhp;

      // if it is lower than the last-tracked-lowest, then update the lowest.
      if (lowestHpRatio > hpRatio)
      {
        lowestHpRatio = hpRatio;
        mostWoundedAlly = ally;
        actualHpDifference = battler.mhp - battler.hp;

        // count all allies below the "heal all" threshold.
        if (hpRatio <= 0.66)
        {
          alliesBelow66++;
        }
      }

      // count all allies missing any amount of hp.
      if (hpRatio < 1)
      {
        alliesMissingAnyHp++;
      }
    });

    // if there are no allies that are missing hp, then just return... unless we're reckless 🌚.
    if (!alliesMissingAnyHp && !reckless) return skillsToUse;

    user.setAllyTarget(mostWoundedAlly);
    const mostWoundedAllyBattler = mostWoundedAlly.getBattler();

    // filter out the skills that aren't for allies.
    const healingTypeSkills = skillsToUse.filter(skillId =>
    {
      const testAction = new Game_Action(user.getBattler());
      testAction.setSkill(skillId);
      return (testAction.isForAliveFriend() &&  // must target living allies.
        testAction.isRecover() &&               // must recover something.
        testAction.isHpEffect());               // must affect hp.
    });

    // if we have 0 or 1 skills left after healing, just return that.
    if (healingTypeSkills.length < 2)
    {
      return healingTypeSkills;
    }

    // determine the best skill based on AI traits.
    let bestSkillId = null;
    let runningBiggestHealAll = 0;
    let runningBiggestHealOne = 0;
    let runningClosestFitHealAll = 0;
    let runningClosestFitHealOne = 0;
    let runningBiggestHeal = 0;
    let biggestHealSkill = null;
    let biggestHealAllSkill = null;
    let biggestHealOneSkill = null;
    let closestFitHealAllSkill = null;
    let closestFitHealOneSkill = null;
    let firstSkill = false;
    healingTypeSkills.forEach(skillId =>
    {
      const skill = $dataSkills[skillId];
      const testAction = new Game_Action(user.getBattler());
      testAction.setItemObject(skill);
      const healAmount = testAction.makeDamageValue(mostWoundedAllyBattler, false);
      if (Math.abs(runningBiggestHeal) < Math.abs(healAmount))
      {
        biggestHealSkill = skillId;
        runningBiggestHeal = healAmount;
      }

      // if this is our first skill in the possible heal skills available, write to all skills.
      if (!firstSkill)
      {
        biggestHealAllSkill = skillId;
        runningBiggestHealAll = healAmount;
        closestFitHealAllSkill = skillId;
        runningClosestFitHealAll = healAmount;
        biggestHealOneSkill = skillId;
        runningBiggestHealOne = healAmount;
        closestFitHealOneSkill = skillId;
        runningClosestFitHealOne = healAmount;
        firstSkill = true;
      }

      // analyze the heal all skills for biggest and closest fits.
      if (testAction.isForAll())
      {
        // if this heal amount is bigger than the running biggest heal-all amount, then update.
        if (runningBiggestHealAll < healAmount)
        {
          biggestHealAllSkill = skillId;
          runningBiggestHealAll = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-all amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealAll - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference)
        {
          closestFitHealAllSkill = skillId;
          runningClosestFitHealAll = healAmount;
        }
      }

      // analyze the heal one skills for biggest and closest fits.
      if (testAction.isForOne())
      {
        // if this heal amount is bigger than the running biggest heal-one amount, then update.
        if (runningBiggestHealOne < healAmount)
        {
          biggestHealOneSkill = skillId;
          runningBiggestHealOne = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-one amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealOne - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference)
        {
          closestFitHealOneSkill = skillId;
          runningClosestFitHealOne = healAmount;
        }
      }
    });

    const skillOptions = [biggestHealAllSkill, biggestHealOneSkill, closestFitHealAllSkill, closestFitHealOneSkill];
    bestSkillId = skillOptions[Math.randomInt(skillOptions.length)];

    // careful will decide in this order:
    if (careful)
    {
      // - if any below 40%, then prioritize heal-one of most wounded.
      if (lowestHpRatio <= 0.40)
      {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;

        // - if none below 40% but multiple wounded, prioritize closest-fit heal-all.
      }
      else if (alliesMissingAnyHp > 1 && lowestHpRatio < 0.80)
      {
        bestSkillId = defensive ? biggestHealAllSkill : closestFitHealAllSkill;

        // - if only one wounded, then heal them.
      }
      else if (alliesMissingAnyHp === 1 && lowestHpRatio < 0.80)
      {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;
        // - if none wounded, or none below 80%, then don't heal.
      }
    }
    else
    {
      // - if there is only one wounded ally, prioritize biggest heal-one skill.
      if (alliesMissingAnyHp === 1)
      {
        bestSkillId = biggestHealOneSkill;
        // - if there is more than one wounded ally, prioritize biggest heal-all skill.
      }
      else if (alliesMissingAnyHp > 1)
      {
        bestSkillId = biggestHealAllSkill;
        // - if none wounded, don't heal.
      }
    }

    // reckless will decide in this order:
    if (reckless)
    {
      // - if there are any wounded allies, always use biggest heal skill, for one or all.
      if (alliesMissingAnyHp > 0)
      {
        bestSkillId = biggestHealSkill;
        // - if none wounded, don't heal.
      }
    }

    return bestSkillId;
  }
}
//#endregion JABS_BattlerAI

//#region JABS_BattlerCoreData
/**
 * A class containing all the data extracted from the comments of an event's
 * comments and contained with friendly methods to access and manipulate.
 */
function JABS_BattlerCoreData()
{
  this.initialize(...arguments);
}

JABS_BattlerCoreData.prototype = {};
JABS_BattlerCoreData.prototype.constructor = JABS_BattlerCoreData;

/**
 * Initializes this battler data object.
 * @param {number} battlerId This enemy id.
 * @param {number} teamId This battler's team id.
 * @param {JABS_BattlerAI} battlerAI This battler's converted AI.
 * @param {number} sightRange The sight range.
 * @param {number} alertedSightBoost The boost to sight range while alerted.
 * @param {number} pursuitRange The pursuit range.
 * @param {number} alertedPursuitBoost The boost to pursuit range while alerted.
 * @param {number} alertDuration The duration in frames of how long to remain alerted.
 * @param {boolean} canIdle Whether or not this battler can idle.
 * @param {boolean} showHpBar Whether or not to show the hp bar.
 * @param {boolean} showBattlerName Whether or not to show the battler's name.
 * @param {boolean} isInvincible Whether or not this battler is invincible.
 * @param {boolean} isInanimate Whether or not this battler is inanimate.
 */
JABS_BattlerCoreData.prototype.initialize = function({
  battlerId,
  teamId,
  battlerAI,
  sightRange,
  alertedSightBoost,
  pursuitRange,
  alertedPursuitBoost,
  alertDuration,
  canIdle,
  showHpBar,
  showBattlerName,
  isInvincible,
  isInanimate
})
{
  /**
   * The id of the enemy that this battler represents.
   * @type {number}
   */
  this._battlerId = battlerId;

  /**
   * The id of the team this battler belongs to.
   * @type {number}
   */
  this._teamId = teamId;

  /**
   * The converted-from-binary AI of this battler.
   * @type {JABS_BattlerAI}
   */
  this._battlerAI = battlerAI;

  /**
   * The base range that this enemy can and engage targets within.
   * @type {number}
   */
  this._sightRange = sightRange;

  /**
   * The boost to sight range this enemy gains while alerted.
   * @type {number}
   */
  this._alertedSightBoost = alertedSightBoost;

  /**
   * The base range that this enemy will pursue it's engaged target.
   * @type {number}
   */
  this._pursuitRange = pursuitRange;

  /**
   * The boost to pursuit range this enemy gains while alerted.
   * @type {number}
   */
  this._alertedPursuitBoost = alertedPursuitBoost;

  /**
   * The duration in frames that this enemy will remain alerted.
   * @type {number}
   */
  this._alertDuration = alertDuration;

  /**
   * Whether or not this battler will move around while idle.
   * @type {boolean} True if the battler can move while idle, false otherwise.
   */
  this._canIdle = canIdle;

  /**
   * Whether or not this battler's hp bar will be visible.
   * @type {boolean} True if the battler's hp bar should show, false otherwise.
   */
  this._showHpBar = showHpBar;

  /**
   * Whether or not this battler's name will be visible.
   * @type {boolean} True if the battler's name should show, false otherwise.
   */
  this._showBattlerName = showBattlerName;

  /**
   * Whether or not this battler is invincible.
   *
   * Invincible is defined as: `actions will not collide with this battler`.
   * @type {boolean} True if the battler is invincible, false otherwise.
   */
  this._isInvincible = isInvincible;

  /**
   * Whether or not this battler is inanimate. Inanimate battlers have a few
   * unique traits, those being: cannot idle, hp bar is hidden, cannot be alerted,
   * does not play deathcry when defeated, and cannot engage in battle.
   * @type {boolean} True if the battler is inanimate, false otherwise.
   */
  this._isInanimate = isInanimate;

  this.initMembers()
};

/**
 * Initializes all properties of this class.
 * This is effectively a hook for adding extra properties into this object.
 */
JABS_BattlerCoreData.prototype.initMembers = function()
{ };

/**
 * Gets this battler's enemy id.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.battlerId = function()
{
  return this._battlerId;
};

/**
 * Gets this battler's team id.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.team = function()
{
  return this._teamId;
};

/**
 * Gets this battler's AI.
 * @returns {JABS_BattlerAI}
 */
JABS_BattlerCoreData.prototype.ai = function()
{
  return this._battlerAI;
};

/**
 * Gets the base range that this enemy can engage targets within.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.sightRange = function()
{
  return this._sightRange;
};

/**
 * Gets the boost to sight range while alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertedSightBoost = function()
{
  return this._alertedSightBoost;
};

/**
 * Gets the base range that this enemy will pursue it's engaged target.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.pursuitRange = function()
{
  return this._pursuitRange;
};

/**
 * Gets the boost to pursuit range while alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertedPursuitBoost = function()
{
  return this._alertedPursuitBoost;
};

/**
 * Gets the duration in frames for how long this battler remains alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertDuration = function()
{
  return this._alertDuration;
};

/**
 * Gets whether or not this battler will move around while idle.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.canIdle = function()
{
  return this._canIdle;
};

/**
 * Gets whether or not this battler's hp bar will be visible.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.showHpBar = function()
{
  return this._showHpBar;
};

/**
 * Gets whether or not this battler's name will be visible.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.showBattlerName = function()
{
  return this._showBattlerName;
};

/**
 * Gets whether or not this battler is `invincible`.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.isInvincible = function()
{
  return this._isInvincible;
};

/**
 * Gets whether or not this battler is `inanimate`.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.isInanimate = function()
{
  return this._isInanimate;
};
//#endregion JABS_BattlerCoreData

//#region JABS_Cooldown
/**
 * A class representing a skill or item's cooldown data.
 * @param {string} key The key of the cooldown.
 */
function JABS_Cooldown(key)
{
  this.initialize(key);
}

JABS_Cooldown.prototype = {};
JABS_Cooldown.prototype.constructor = JABS_Cooldown;

//#region initialize
/**
 * Initializes this cooldown.
 * @param {string} key The key for this cooldown.
 */
JABS_Cooldown.prototype.initialize = function(key)
{
  /**
   * The key of the cooldown.
   * @type {string}
   */
  this.key = key;

  // initialize the class members.
  this.initMembers();

  // initialize the rest of the properties.
  this.clearData();
};

/**
 * Initializes all members of this class.
 */
JABS_Cooldown.prototype.initMembers = function()
{
  /**
   * The frames of the cooldown.
   * @type {number}
   */
  this.frames = 0;

  /**
   * Whether or not the base cooldown is ready.
   * @type {boolean}
   */
  this.ready = false;

  /**
   * The number of frames in which the combo action can be executed instead.
   * @type {number}
   */
  this.comboFrames = 0;

  /**
   * Whether or not the combo cooldown is ready.
   * @type {boolean}
   */
  this.comboReady = false;

  /**
   * Whether or not this cooldown is locked from changing.
   * @type {boolean}
   */
  this.locked = false;

  /**
   * Whether or not the skill manager needs to clear the combo data for the
   * slot that this cooldown is attached to.
   * @type {boolean}
   */
  this.mustComboClear = false;
};

/**
 * Re-initializes all the data of this cooldown.
 */
JABS_Cooldown.prototype.clearData = function()
{
  // default all the values.
  this.frames = 0;
  this.ready = false;
  this.comboFrames = 0;
  this.comboReady = false;
  this.locked = false;
  this.mustComboClear = false;
};
//#endregion initialize

/**
 * Whether or not the combo data needs clearing.
 * @returns {boolean}
 */
JABS_Cooldown.prototype.needsComboClear = function()
{
  return this.mustComboClear;
};

/**
 * Acknowledges the combo was cleared and sets the flag to false.
 */
JABS_Cooldown.prototype.acknowledgeComboClear = function()
{
  this.mustComboClear = false;
};

/**
 * Requests the combo to be cleared and sets the flag to true.
 */
JABS_Cooldown.prototype.requestComboClear = function()
{
  this.mustComboClear = true;
};

/**
 * Manages the update cycle for this cooldown.
 */
JABS_Cooldown.prototype.update = function()
{
  // check if we can update the cooldowns at all.
  if (!this.canUpdate()) return;

  // update the cooldowns.
  this.updateCooldownData();
};

/**
 * Determines whether or not this cooldown can be updated.
 * @returns {boolean} True if it can be updated, false otherwise.
 */
JABS_Cooldown.prototype.canUpdate = function()
{
  // cannot update a cooldown when it is locked.
  if (this.isLocked()) return false;

  // update the cooldown!
  return true;
};

/**
 * Updates the base and combo cooldowns.
 */
JABS_Cooldown.prototype.updateCooldownData = function()
{
  // update the base cooldown.
  this.updateBaseCooldown();

  // update the combo cooldown.
  this.updateComboCooldown();
};

//#region base cooldown
/**
 * Updates the base skill data for this cooldown.
 */
JABS_Cooldown.prototype.updateBaseCooldown = function()
{
  // if the base cooldown is ready, do not update.
  if (this.ready) return;

  // check if we have a base cooldown to decrement.
  if (this.frames > 0)
  {
    // decrement the base cooldown.
    this.frames--;
  }

  // check if the base cooldown is complete.
  this.handleIfBaseReady();
};

/**
 * Enables the flag to indicate the base skill is ready for this cooldown.
 * This also clears the combo data, as they both cannot be available at the same time.
 */
JABS_Cooldown.prototype.enableBase = function()
{
  // set the base cooldown frames to 0.
  this.frames = 0;

  // toggles the base ready flag.
  this.ready = true;
}

/**
 * Gets whether or not the base skill is off cooldown.
 * @returns {boolean}
 */
JABS_Cooldown.prototype.isBaseReady = function()
{
  return this.ready;
};

/**
 * Sets a new value for the base cooldown to countdown from.
 * @param {number} frames The value to countdown from.
 */
JABS_Cooldown.prototype.setFrames = function(frames)
{
  // set the value.
  this.frames = frames;

  // check if the base cooldown is now ready.
  this.handleIfBaseReady();

  // check if the base cooldown is now not ready.
  this.handleIfBaseUnready();
};

/**
 * Adds a value to the combo frames to extend the combo countdown.
 * @param {number} frames The value to add to the countdown.
 */
JABS_Cooldown.prototype.modBaseFrames = function(frames)
{
  // modify the value.
  this.frames += frames;

  // check if the base cooldown is now ready.
  this.handleIfBaseReady();

  // check if the base cooldown is now not ready.
  this.handleIfBaseUnready();
};

/**
 * Checks if the base cooldown is in a state of ready.
 * If it is, the ready flag will be enabled.
 */
JABS_Cooldown.prototype.handleIfBaseReady = function()
{
  // check if the base cooldown is now ready.
  if (this.frames <= 0)
  {
    // clear the combo data.
    this.resetCombo();

    // enable the base skill.
    this.enableBase();
  }
};

/**
 * Checks if the base cooldown is in a state of unready.
 * If it is, the ready flag will be disabled.
 */
JABS_Cooldown.prototype.handleIfBaseUnready = function()
{
  // check if the base cooldown is now not ready.
  if (this.frames > 0)
  {
    // not ready.
    this.ready = false;
  }
};
//#endregion base cooldown

//#region combo cooldown
/**
 * Updates the combo data for this cooldown.
 */
JABS_Cooldown.prototype.updateComboCooldown = function()
{
  // if the combo cooldown is ready, do not update.
  if (this.comboReady) return;

  // decrement the combo cooldown.
  if (this.comboFrames > 0)
  {
    // decrement the combo cooldown.
    this.comboFrames--;
  }

  // handle if the base cooldown is now ready.
  this.handleIfComboReady();
};

/**
 * Enables the flag to indicate a combo is ready for this cooldown.
 */
JABS_Cooldown.prototype.enableCombo = function()
{
  // action ready!
  // zero the wait time for combo frames.
  this.comboFrames = 0;

  // enable the combo!
  this.comboReady = true;
};

/**
 * Sets the combo frames to countdown from this value.
 * @param {number} frames The value to countdown from.
 */
JABS_Cooldown.prototype.setComboFrames = function(frames)
{
  // set the value.
  this.comboFrames = frames;

  // handle if the base cooldown is now ready.
  this.handleIfComboReady();

  // handle if the base cooldown is now not ready.
  this.handleIfComboUnready();
};

/**
 * Adds a value to the combo frames to extend the combo countdown.
 * @param {number} frames The value to add to the countdown.
 */
JABS_Cooldown.prototype.modComboFrames = function(frames)
{
  // modify the value.
  this.comboFrames += frames;

  // handle if the base cooldown is now ready.
  this.handleIfComboReady();

  // handle if the base cooldown is now not ready.
  this.handleIfComboUnready();
};

/**
 * Checks if the combo cooldown is in a state of ready.
 * If it is, the ready flag will be enabled.
 */
JABS_Cooldown.prototype.handleIfComboReady = function()
{
  // check if the base cooldown is now ready.
  if (this.comboFrames <= 0)
  {
    // enable the combo!
    this.enableCombo();
  }
};

/**
 * Checks if the combo cooldown is in a state of unready.
 * If it is, the ready flag will be disabled.
 */
JABS_Cooldown.prototype.handleIfComboUnready = function()
{
  // check if the combo cooldown is now not ready.
  if (this.comboFrames > 0)
  {
    // not ready.
    this.comboReady = false;
  }
};

/**
 * Resets the combo data associated with this cooldown.
 */
JABS_Cooldown.prototype.resetCombo = function()
{
  // zero the combo frames.
  this.comboFrames = 0;

  // disable the ready flag.
  this.comboReady = false;

  // requests the slot containing this cooldown to clear the combo id.
  this.requestComboClear();
};

/**
 * Gets whether or not the combo cooldown is ready.
 * @returns {boolean}
 */
JABS_Cooldown.prototype.isComboReady = function()
{
  return this.comboReady;
};
//#endregion combo cooldown

//#region locking
/**
 * Gets whether or not this cooldown is locked.
 * @returns {boolean}
 */
JABS_Cooldown.prototype.isLocked = function()
{
  return this.locked;
};

/**
 * Locks this cooldown to prevent it from cooling down.
 */
JABS_Cooldown.prototype.lock = function()
{
  this.locked = true;
};

/**
 * Unlocks this cooldown to allow it to finish cooling down.
 */
JABS_Cooldown.prototype.unlock = function()
{
  this.locked = false;
};
//#endregion locking
//#endregion JABS_Cooldown

//#region JABS_CoreDataBuilder
/**
 * A builder class for constructing `JABS_BattlerCoreData`.
 */
class JABS_CoreDataBuilder
{
  //#region properties
  /**
   * The battler's id, such as the actor id or enemy id.
   * @type {number}
   * @private
   */
  #battlerId = 0;

  /**
   * The team id that this battler belongs to.
   * @type {number}
   * @private
   */
  #teamId = JABS_Battler.enemyTeamId();

  /**
   * The AI of this battler.
   * @type {string}
   * @private
   */
  #battlerAi = "11000000";

  /**
   * The sight range of this battler.
   * @type {number}
   * @private
   */
  #sightRange = J.ABS.Metadata.DefaultEnemySightRange;

  /**
   * The alerted sight boost of this battler.
   * @type {number}
   * @private
   */
  #alertedSightBoost = J.ABS.Metadata.DefaultEnemyAlertedSightBoost;

  /**
   * The pursuit range of this battler.
   * @type {number}
   * @private
   */
  #pursuitRange = J.ABS.Metadata.DefaultEnemyPursuitRange;

  /**
   * The alerted pursuit boost of this battler.
   * @type {number}
   * @private
   */
  #alertedPursuitBoost = J.ABS.Metadata.DefaultEnemyAlertedPursuitBoost;

  /**
   * The duration this battler remains alerted.
   * @type {number}
   * @private
   */
  #alertDuration = J.ABS.Metadata.DefaultEnemyAlertDuration;

  /**
   * Whether or not this battler is allowed to idle about.
   * @type {boolean}
   * @private
   */
  #canIdle = J.ABS.Metadata.DefaultEnemyCanIdle;

  /**
   * Whether or not this battler has a visible hp bar.
   * @type {boolean}
   * @private
   */
  #showHpBar = J.ABS.Metadata.DefaultEnemyShowHpBar;

  /**
   * Whether or not this battler has a visible hp bar.
   * @type {boolean}
   * @private
   */
  #showDangerIndicator = J.DANGER ? J.DANGER.Metadata.DefaultEnemyShowDangerIndicator : false;

  /**
   * Whether or not this battler's name is visible.
   * @type {boolean}
   * @private
   */
  #showBattlerName = J.ABS.Metadata.DefaultEnemyShowBattlerName;

  /**
   * Whether or not this battler is invincible.
   * @type {boolean}
   * @private
   */
  #isInvincible = J.ABS.Metadata.DefaultEnemyIsInvincible;

  /**
   * Whether or not this battler is inanimate.
   * @type {boolean}
   * @private
   */
  #isInanimate = J.ABS.Metadata.DefaultEnemyIsInanimate;
  //#endregion properties

  /**
   * Constructor.
   * @param {number} battlerId The id of the battler from the database.
   */
  constructor(battlerId)
  {
    this.setBattlerId(battlerId);
  }

  /**
   * Builds the core data with the current set of parameters.
   * @returns {JABS_BattlerCoreData}
   */
  build()
  {
    const core = new JABS_BattlerCoreData({
      // configure core battler data.
      battlerId: this.#battlerId,
      teamId: this.#teamId,
      battlerAI: this.#battlerAi,

      // configure sight and alert battler data.
      sightRange: this.#sightRange,
      alertedSightBoost: this.#alertedSightBoost,
      pursuitRange: this.#pursuitRange,
      alertedPursuitBoost: this.#alertedPursuitBoost,
      alertDuration: this.#alertDuration,

      // configure on-the-map settings.
      canIdle: this.#canIdle,
      showHpBar: this.#showHpBar,
      showBattlerName: this.#showBattlerName,
      isInvincible: this.#isInvincible,
      isInanimate: this.#isInanimate
    });

    // if using danger indicators, then set that, too.
    if (J.DANGER)
    {
      core.setDangerIndicator(this.#showDangerIndicator);
    }

    return core;
  }

  //#region setters
  /**
   * Sets all properties based on this battler's own data except id.
   * @param {Game_Battler} battler
   * @returns {this} This builder for fluent-building.
   */
  setBattler(battler)
  {
    this.#battlerId = battler.battlerId();
    this.#teamId = battler.teamId();
    this.#battlerAi = battler.ai();

    this.#sightRange = battler.sightRange();
    this.#alertedSightBoost = battler.alertedSightBoost();
    this.#pursuitRange = battler.pursuitRange();
    this.#alertedPursuitBoost = battler.alertedPursuitBoost();
    this.#alertDuration = battler.alertDuration();

    this.#canIdle = battler.canIdle();
    this.#showHpBar = battler.showHpBar();
    this.#showDangerIndicator = battler.showDangerIndicator();
    this.#showBattlerName = battler.showBattlerName();
    this.#isInvincible = battler.isInvincible();
    this.#isInanimate = battler.isInanimate();

    return this;
  }

  /**
   * Sets all properties based on the assumption that this is for the player.
   * Effectively, all ranges are set to 0, and all booleans are set to false.
   * @returns {this} This builder for fluent-building.
   */
  isPlayer()
  {
    this.#teamId = JABS_Battler.allyTeamId();

    this.#sightRange = 0;
    this.#alertedSightBoost = 0;
    this.#pursuitRange = 0;
    this.#alertedPursuitBoost = 0;
    this.#alertDuration = 0;

    this.#canIdle = false;
    this.#showHpBar = false;
    this.#showBattlerName = false;
    this.#isInvincible = false;
    this.#isInanimate = false;

    return this;
  }

  /**
   * Sets the battler id of this core data.
   * @param {number} battlerId The id of the battler from the database.
   * @returns {this} This builder for fluent-building.
   */
  setBattlerId(battlerId)
  {
    this.#battlerId = battlerId;
    return this;
  }

  /**
   * Sets the team id of this core data.
   * @param {number} teamId The id of the team this battler belongs to.
   * @returns {this} This builder for fluent-building.
   */
  setTeamId(teamId)
  {
    this.#teamId = teamId;
    return this;
  }

  /**
   * Sets the AI of this core data.
   * @param {string} battlerAi The AI of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setBattlerAi(battlerAi)
  {
    this.#battlerAi = battlerAi;
    return this;
  }

  /**
   * Sets the sight range of this core data.
   * @param {number} sightRange The sight range of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setSightRange(sightRange)
  {
    this.#sightRange = sightRange;
    return this;
  }

  /**
   * Sets the alerted sight boost of this core data.
   * @param {number} alertedSightBoost The alerted sight boost of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setAlertedSightBoost(alertedSightBoost)
  {
    this.#alertedSightBoost = alertedSightBoost;
    return this;
  }

  /**
   * Sets the pursuit range of this core data.
   * @param {number} pursuitRange The pursuit range of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setPursuitRange(pursuitRange)
  {
    this.#pursuitRange = pursuitRange;
    return this;
  }

  /**
   * Sets the alerted pursuit boost of this core data.
   * @param {number} alertedPursuitBoost The alerted pursuit boost of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setAlertedPursuitBoost(alertedPursuitBoost)
  {
    this.#alertedPursuitBoost = alertedPursuitBoost;
    return this;
  }

  /**
   * Sets the alerted duration of this core data.
   * @param {number} alertDuration The duration of which this battler remains alerted.
   * @returns {this} This builder for fluent-building.
   */
  setAlertDuration(alertDuration)
  {
    this.#alertDuration = alertDuration;
    return this;
  }

  /**
   * Sets whether or not this battler can idle while not in combat.
   * @param {boolean} canIdle Whether or not this battler can idle about.
   * @returns {this} This builder for fluent-building.
   */
  setCanIdle(canIdle)
  {
    this.#canIdle = canIdle;
    return this;
  }

  /**
   * Sets whether or not this battler's hp bar is visible.
   * @param {boolean} showHpBar Whether or not the hp bar is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowHpBar(showHpBar)
  {
    this.#showHpBar = showHpBar;
    return this;
  }

  /**
   * Sets whether or not this battler's danger indicator is visible.
   * @param {boolean} showDangerIndicator Whether or not the danger indicator is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowDangerIndicator(showDangerIndicator)
  {
    this.#showDangerIndicator = showDangerIndicator;
    return this;
  }

  /**
   * Sets whether or not this battler's name is visible.
   * @param {boolean} showBattlerName Whether or not the battler name is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowBattlerName(showBattlerName)
  {
    this.#showBattlerName = showBattlerName;
    return this;
  }

  /**
   * Sets whether or not this battler is invincible.
   * @param {boolean} isInvincible Whether or not the battler is invincible.
   * @returns {this} This builder for fluent-building.
   */
  setIsInvincible(isInvincible)
  {
    this.#isInvincible = isInvincible;
    return this;
  }

  /**
   * Sets whether or not this battler is inanimate.
   * @param {boolean} isInanimate Whether or not the battler is inanimate.
   * @returns {this} This builder for fluent-building.
   */
  setIsInanimate(isInanimate)
  {
    this.#isInanimate = isInanimate;
    return this;
  }
  //#endregion setters
}
//#endregion JABS_CoreDataBuilder

//#region JABS_Engine
/**
 * This class is the engine that manages JABS and how `JABS_Action`s interact
 * with the `JABS_Battler`s on the map.
 */
class JABS_Engine // eslint-disable-line no-unused-vars
{
  /**
   * @constructor
   */
  constructor()
  {
    this.initialize();
  }

  //#region properties
  /**
   * Retrieves whether or not the ABS is currently enabled.
   * @returns {boolean} True if enabled, false otherwise.
   */
  get absEnabled()
  {
    return this._absEnabled;
  }

  /**
   * Sets the ABS enabled switch to a new boolean value.
   * @param {boolean} enabled Whether or not the ABS is enabled (default = true).
   */
  set absEnabled(enabled)
  {
    this._absEnabled = enabled;
  }

  /**
   * Retrieves whether or not the ABS is currently paused.
   * @returns {boolean} True if paused, false otherwise.
   */
  get absPause()
  {
    return this._absPause;
  }

  /**
   * Sets the ABS pause switch to a new boolean value.
   * @param {boolean} paused Whether or not the ABS is paused (default = true).
   */
  set absPause(paused)
  {
    this._absPause = paused;
  }

  /**
   * Checks whether or not we have a need to request the ABS-specific menu.
   * @returns {boolean} True if menu requested, false otherwise.
   */
  get requestAbsMenu()
  {
    return this._requestAbsMenu;
  }

  /**
   * Sets the current request for calling the ABS-specific menu.
   * @param {boolean} requested Whether or not we want to request the menu (default: true).
   */
  set requestAbsMenu(requested)
  {
    this._requestAbsMenu = requested;
  }

  /**
   * Gets whether or not there is a request to cycle through party members.
   * @returns {boolean}
   */
  get requestPartyRotation()
  {
    return this._requestPartyRotation;
  }

  /**
   * Sets the request for party rotation.
   * @param {boolean} rotate True if we want to rotate party members, false otherwise.
   */
  set requestPartyRotation(rotate)
  {
    this._requestPartyRotation = rotate;
  }

  /**
   * Gets whether or not there is a request to refresh the JABS menu.
   * The most common use case for this is adding new commands to the menu.
   * @returns {boolean}
   */
  get requestJabsMenuRefresh()
  {
    return this._requestJabsMenuRefresh;
  }

  /**
   * Sets the request for refreshing the JABS menu.
   * @param {boolean} requested True if we want to refresh the JABS menu, false otherwise.
   */
  set requestJabsMenuRefresh(requested)
  {
    this._requestJabsMenuRefresh = requested;
  }

  /**
   * Checks whether or not we have a need to request rendering for new actions.
   * @returns {boolean} True if needing to render actions, false otherwise.
   */
  get requestActionRendering()
  {
    return this._requestActionRendering;
  }

  /**
   * Issues a request to render actions on the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestActionRendering(request)
  {
    this._requestActionRendering = request;
  }

  /**
   * Checks whether or not we have a need to request rendering for new loot sprites.
   * @returns {boolean} True if needing to render loot, false otherwise.
   */
  get requestLootRendering()
  {
    return this._requestLootRendering;
  }

  /**
   * Issues a request to render loot onto the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestLootRendering(request)
  {
    this._requestLootRendering = request;
  }

  /**
   * Checks whether or not we have a need to request a clearing of the action sprites
   * on the current map.
   * @returns {boolean} True if clear map requested, false otherwise.
   */
  get requestClearMap()
  {
    return this._requestClearMap;
  }

  /**
   * Issues a request to clear the map of all stale actions.
   * @param {boolean} request Whether or not we want to clear the battle map (default = true).
   */
  set requestClearMap(request)
  {
    this._requestClearMap = request;
  }

  /**
   * Checks whether or not we have a need to request a clearing of the loot sprites
   * on the current map.
   * @returns {boolean} True if clear loot requested, false otherwise.
   */
  get requestClearLoot()
  {
    return this._requestClearLoot;
  }

  /**
   * Issues a request to clear the map of any collected loot.
   * @param {boolean} request True if clear loot requested, false otherwise.
   */
  set requestClearLoot(request)
  {
    this._requestClearLoot = request;
  }

  /**
   * Checks whether or not we have a need to refresh all character sprites on the current map.
   * @returns {boolean} True if refresh is requested, false otherwise.
   */
  get requestSpriteRefresh()
  {
    return this._requestSpriteRefresh;
  }

  /**
   * Issues a request to refresh all character sprites on the current map.
   * @param {boolean} request True if we want to refresh all sprites, false otherwise.
   */
  set requestSpriteRefresh(request)
  {
    this._requestSpriteRefresh = request;
  }
  //#endregion properties

  /**
   * Creates all members available in this class.
   */
  initialize(isMapTransfer = true)
  {
    /**
     * The `JABS_Battler` representing the player.
     * @type {JABS_Battler}
     */
    this._player1 = null;

    /**
     * True if we want to review available events for rendering, false otherwise.
     * @type {boolean}
     */
    this._requestActionRendering = false;

    /**
     * True if we want to review available loot for rendering, false otherwise.
     * @type {boolean}
     */
    this._requestLootRendering = false;

    /**
     * True if we want to cycle through our party members, false otherwise.
     * @type {boolean}
     */
    this._requestPartyRotation = false;

    /**
     * True if we want to empty the map of all action sprites, false otherwise.
     * @type {boolean}
     */
    this._requestClearMap = false;

    /**
     * True if we want to empty the map of all stale loot sprites, false otherwise.
     * @type {boolean}
     */
    this._requestClearLoot = false;

    /**
     * True if we want to refresh all sprites and their add-ons, false otherwise.
     * @type {boolean}
     */
    this._requestSpriteRefresh = false;

    /**
     * A collection to manage all `JABS_Action`s on this battle map.
     * @type {JABS_Action[]}
     */
    this._actionEvents = [];

    /**
     * A collection of the metadata of all action-type events.
     * @type {rm.types.Event[]}
     */
    this._activeActions = isMapTransfer ? [] : this._activeActions ?? [];

    /**
     * True if we want to call the ABS-specific menu, false otherwise.
     * @type {boolean}
     */
    this._requestAbsMenu = false;

    /**
     * True if we want to refresh the commands of the JABS menu, false otherwise.
     * @type {boolean}
     */
    this._requestJabsMenuRefresh = false;

    /**
     * Whether or not this ABS is enabled.
     * If disabled, button input and enemy AI will be disabled.
     * Enemy battlers on the map will instead act like their
     * regularly programmed events.
     *
     * This will most likely be used for when the dev enters a town and the
     * populace is peaceful.
     * @type {boolean}
     */
    this._absEnabled = true;

    /**
     * Whether or not this ABS is temporarily paused.
     * If paused, all battlers on the map including the player will halt
     * movement, though timers will still tick.
     * @type {boolean}
     */
    this._absPause = false;

    /**
     * A collection of all ongoing states in the context of how they
     * interact with the battlers on the map. This is typically kept in-sync with
     * the individual battlers.
     * @type {JABS_TrackedState[]}
     */
    this._jabsStateTracker = [];
  }

  /**
   * Adds a new `JABS_Action` to this battle map for tracking.
   * The additional metadata is optional, omitted when executing direct actions.
   * @param {JABS_Action} actionEvent The `JABS_Action` to add.
   * @param {rm.types.Event} actionEventData The event metadata, if anything.
   */
  addActionEvent(actionEvent, actionEventData)
  {
    this._actionEvents.push(actionEvent);
    if (actionEventData)
    {
      this._activeActions.push(actionEventData);
    }
  }

  /**
   * Finds the event metadata associated with the given `uuid`.
   * @param {string} uuid The `uuid` to find.
   * @returns {rm.types.Event} The event associated with the `uuid`.
   */
  event(uuid)
  {
    const results = this._activeActions.filter(eventData => eventData.uniqueId === uuid);
    return results[0];
  }

  /**
   * Clears all currently managed `JABS_Action`s on this battle map that are marked
   * for removal.
   */
  clearActionEvents()
  {
    const actionEvents = this._actionEvents;
    const updatedActionEvents = actionEvents.filter(action => !action.getNeedsRemoval());

    if (actionEvents.length !== updatedActionEvents.length)
    {
      this.requestClearMap = true;
    }

    this._actionEvents = updatedActionEvents;
  }

  /**
   * Checks for how many living enemies there are present on the map.
   * "Enemies" is defined as "number of `Game_Battler`s that are `Game_Enemy`s".
   * @returns {boolean} True if there are any living enemies on this map, false otherwise.
   */
  anyLivingEnemies()
  {
    const anyEnemies = $gameMap
      .getBattlers()
      .find(battler => battler.isEnemy() && !battler.isInanimate());
    return !!anyEnemies;
  }

  /**
   * Determines the animation id for this particular attack.
   * -1 as an animation id represents "use normal attack", but enemies don't have that!
   * So for the case of enemies, it'll instead return the default.
   * @param {object} skill The $dataSkills object for this skill.
   * @param {JABS_Battler} caster The caster of this skill.
   */
  getAnimationId(skill, caster)
  {
    // grab the animation id from the skill.
    const {animationId} = skill;

    // check if the animation id indicates we should look to the weapon.
    if (animationId === -1)
    {
      // check if the caster is an enemy.
      if (caster.isEnemy())
      {
        // return the default attack animation id.
        return J.ABS.DefaultValues.AttackAnimationId;
      }
      // the caster was not an enemy.

      // grab the weapons of the caster.
      const weapons = caster.getBattler().weapons();

      // check to make sure we have weapons.
      if (weapons.length > 0)
      {
        // grab the first weapon's attack animation.
        return weapons[0].animationId;
      }
      // we are barefisting it.

      // just return the default attack animation id.
      return J.ABS.DefaultValues.AttackAnimationId;


    }

    return animationId;
  }

  /**
   * Returns the `JABS_Battler` associated with the player.
   * @returns {JABS_Battler} The battler associated with the player.
   */
  getPlayer1()
  {
    return this._player1;
  }

  /**
   * Initializes the player properties associated with this battle map.
   */
  initializePlayer1()
  {
    // check if we can initialize the player.
    if (!this.canInitializePlayer1()) return;

    // create a new player object.
    this._player1 = JABS_Battler.createPlayer();

    // assign the uuid to the player.
    $gamePlayer.setMapBattler(this._player1.getUuid());
  }

  /**
   * Determines whether or not the player should be initialized.
   * @returns {boolean}  True if the player should, false otherwise.
   */
  canInitializePlayer1()
  {
    // if the player doesn't exist, initialize it.
    if (this._player1 === null) return true;

    // check if the player is currently assigned a battler.
    if (!this._player1.getBattlerId()) return true;

    // initialize the player!
    return false;
  }

  //#region update
  /**
   * Updates all the battlers on the current map.
   * Also, this includes managing player input and updating active `JABS_Action`s.
   */
  update()
  {
    // update the player and things related to the player.
    this.updatePlayer();

    // update the AI of non-player battlers.
    this.updateAiBattlers();

    // update all active actions on the map.
    this.updateActions();

    // update all JABS states being tracked.
    this.updateJabsStates();

    // handle input from the player(s).
    this.updateInput();
  }

  //#region update player
  /**
   * Cycles through and updates all things related to the player.
   */
  updatePlayer()
  {
    // if we cannot update the player, then do not.
    if (!this.canUpdatePlayer()) return;

    // grab the player.
    const player = this.getPlayer1();

    // if the player is dead, handle player defeat.
    if (player.isDead())
    {
      this.handleDefeatedPlayer();
      return;
    }

    // process any queued actions executed in prior frame.
    player.processQueuedActions();

    // perform all battler updates.
    player.update();
  }

  /**
   * Determines whether or not we can update the player battler.
   * @returns {boolean}
   */
  canUpdatePlayer()
  {
    // grab the player.
    const player = this.getPlayer1();

    // if we don't have a player, do not update.
    if (player === null) return false;

    // update!
    return true;
  }
  //#region state tracking

  /**
   * Gets the collection of all JABS states that affect battlers on the map.
   * @returns {JABS_TrackedState[]}
   */
  getJabsStates()
  {
    return this._jabsStateTracker;
  }

  /**
   * Add a new JABS state to the tracker.
   * @param {JABS_TrackedState} newJabsState The JABS state to add.
   */
  addJabsState(newJabsState)
  {
    this._jabsStateTracker.push(newJabsState);
  }

  /**
   * Updates all JABS states for all battlers that are afflicted.
   */
  updateJabsStates()
  {
    // iterate over all JABS-managed states.
    this.getJabsStates()
    // execute the update against it.
      .forEach(this.updateJabsState, this);

    if (this._jabsStateTracker.length > 200)
    {
      this._jabsStateTracker.pop();
    }
  }

  /**
   * Updates a single JABS state.
   * @param {JABS_TrackedState} jabsState The JABS state to update.
   */
  updateJabsState(jabsState)
  {
    jabsState.update();
  }

  /**
   * Adds a state tracker to the collection.
   * @param {JABS_TrackedState} newTrackedState The state tracker to add.
   */
  addStateTracker(newTrackedState)
  {
    // attempt to reapply the state.
    const reapplied = this.reapplyState(newTrackedState);

    // if reapplied, do not add another copy of the state... or should we?
    if (reapplied) return;

    // if not reapplied, then add the state to the tracker.
    this.addJabsState(newTrackedState);
  }

  /**
   * Reapply the state to the same battler afflicted with the same state.
   * This refreshes the duration only.
   * @param {JABS_TrackedState} newTrackedState The state tracker to add.
   * @returns {boolean} True if the state was reapplied, false otherwise.
   */
  reapplyState(newTrackedState)
  {
    // seek the index of the same state on the same battler.
    const index = this._jabsStateTracker
      .findIndex(trackedState =>
      // check if the battlers are the same.
        trackedState.battler === newTrackedState.battler &&
      // check if the state ids are the same.
      trackedState.stateId === newTrackedState.stateId);

    // track if it was reapplied or not.
    let reapplied = false;

    // check to make sure we have to consider reapplication.
    if (index > -1)
    {
      // grab the data from the state tracker.
      const data = this._jabsStateTracker[index];

      // refresh the duration to new max.
      data.duration = newTrackedState.duration;

      // undo expiration if it was expired.
      data.expired = false;

      // flag that this was reapplied.
      reapplied = true;
    }

    // return the flag.
    return reapplied;
  }

  /**
   * Gets all tracked states for a given battler.
   * @param {Game_Battler} battler The battler to find tracked states for.
   * @returns {JABS_TrackedState[]}
   */
  getStateTrackerByBattler(battler)
  {
    return this._jabsStateTracker.filter(trackedState => trackedState.battler === battler);
  }

  /**
   * Finds the tracked state associated with a specific battler and a state id.
   * @param {Game_Battler} battler The battler to find a state for.
   * @param {number} stateId The state id to find on the given battler.
   * @returns {JABS_TrackedState}
   */
  findStateTrackerByBattlerAndState(battler, stateId)
  {
    return this.getStateTrackerByBattler(battler)
      .find(trackedState =>
        trackedState.battler === battler &&
      trackedState.stateId === stateId);
  }
  //#endregion state tracking
  //#endregion update player

  //#region update ai battlers
  /**
   * Cycles through and updates all things related to battlers other than the player.
   */
  updateAiBattlers()
  {
    // if we cannot update the battlers controlled by AI, then do not.
    if (!this.canUpdateAiBattlers()) return;

    // grab all "visible" battlers to the player.
    const visibleBattlers = $gameMap.getBattlersWithinRange(
      this.getPlayer1(),
      30,
      false);

    // update each of them.
    visibleBattlers.forEach(this.performAiBattlerUpdate, this);
  }

  /**
   * Determines whether or not we can update the ai-controlled battlers.
   * @returns {boolean}
   */
  canUpdateAiBattlers()
  {
    return true;
  }

  /**
   * Performs the update against this non-player battler.
   *
   * NOTE: The player's battler gets duplicated once into the "all battlers"
   * collection after the first party cycle. The initial check prevents updating
   * the player battler twice if they are in that collection.
   * @param {JABS_Battler} battler
   */
  performAiBattlerUpdate(battler)
  {
    // if this battler is the player, do not update.
    if (battler === this.getPlayer1()) return;

    // update the battler.
    battler.update();

    // check if the battler was defeated and needs handling.
    if (this.shouldHandleDefeatedTarget(battler))
    {
      // render battler invincible while processing defeat.
      battler.setInvincible();

      // process defeat.
      this.handleDefeatedTarget(battler, this.getPlayer1());
    }
  }

  /**
   * Determines whether or not a battler should be handled as defeated.
   * @param {JABS_Battler} target The potentially defeated battler.
   * @returns {boolean} true if the battler should be handled for defeat, false otherwise.
   */
  shouldHandleDefeatedTarget(target)
  {
    // target is not considered defeated if not dead.
    if (!target.isDead()) return false;

    // target is not considered defeated while dying.
    if (target.isDying()) return false;

    // do not re-handle defeated targets.
    if (target.isEnemy() && target.getCharacter()._erased) return false;

    // target is defeated!
    return true;
  }
  //#endregion update ai battlers

  //#region update input
  /**
   * Handles the player input.
   */
  updateInput()
  {
    // do not process input if we cannot process it.
    if (!this.canUpdateInput()) return;

    // update the input.
    if (!JABS_InputAdapter.hasControllers())
    {
      console.warn(`No input managers have been registered with the input adapter!`);
      console.warn(`if you built your own, be sure to run "JABS_InputAdapter.register(controller)"!`);
    }
  }

  /**
   * Determines whether or not to process JABS input.
   * @returns {boolean}
   */
  canUpdateInput()
  {
    // if an event is executing on the map, do not update.
    if ($gameMap.isEventRunning()) return false;

    // if the message window is up, do not update.
    if ($gameMessage.isBusy()) return false;

    // if the jabs menu is up, do not update.
    if ($jabsEngine.requestAbsMenu) return false;

    // if the JABS engine is paused, do not update.
    if ($jabsEngine.absPause) return false;

    // if the JABS engine is disabled, do not update.
    if (!$jabsEngine.absEnabled) return false;

    // update!
    return true;
  }

  /**
   * Actually executes the party cycling and swaps to the next living member.
   */
  performPartyCycling()
  {
    // check if we can party cycle.
    if ($gameParty._actors.length === 1) return;

    // determine which battler in the party is the next living battler.
    const nextAllyIndex = $gameParty._actors.findIndex(this.canCycleToAlly);

    // can't cycle if there are no living/valid members.
    if (nextAllyIndex === -1)
    {
      console.warn('No members available to cycle to.');
      return;
    }

    // swap to the next party member in the sequence.
    $gameParty._actors = $gameParty._actors.concat($gameParty._actors.splice(0, nextAllyIndex));
    $gamePlayer.refresh();
    $gamePlayer.requestAnimation(40, false);

    // recreate the JABS player battler and set it to the player character.
    this._player1 = JABS_Battler.createPlayer();
    const newPlayer = this.getPlayer1().getCharacter();
    newPlayer.setMapBattler(this._player1.getUuid());

    // request the scene overlord to take notice and react accordingly (refresh hud etc).
    this.requestPartyRotation = true;

    // if the log is present, then do log things.
    if (J.LOG)
    {
      const log = new MapLogBuilder()
        .setupPartyCycle(this.getPlayer1().battlerName())
        .build();
      $gameTextLog.addLog(log);
    }

    // also trigger an update against the switching player.
    this.getPlayer1().getBattler().onBattlerDataChange();

    // request a map-wide sprite refresh on cycling.
    this.requestSpriteRefresh = true;
  }

  /**
   * Determines whether or not this member can be party cycled to.
   * @param {number} actorId The id of the actor.
   * @param {number} partyIndex The index of the member in the party.
   * @returns
   */
  canCycleToAlly(actorId, partyIndex)
  {
    // ignore switching to self.
    if (partyIndex === 0) return false;

    // grab the actor we are attempting to cycle to.
    const actor = $gameActors.actor(actorId);

    // don't switch to a dead member.
    if (actor.isDead()) return false;

    // don't switch with a member that is locked.
    if (actor.switchLocked()) return false;

    // perform!
    return true;
  }
  //#endregion update input

  //#region update actions
  /**
   * Updates all `JABS_Action`s currently on the battle map. This includes checking for collision,
   * checking piercing information, and applying effects against the map.
   */
  updateActions()
  {
    const actionEvents = this._actionEvents;
    if (!actionEvents.length) return;

    actionEvents.forEach(this.updateAction, this);
  }

  /**
   * Updates a single `JABS_Action` that is active on the map.
   * @param {JABS_Action} action The action being updated.
   */
  updateAction(action)
  {
    // decrement the delay timer prior to action countdown.
    action.countdownDelay();

    // if we're still delaying and not triggering by touch...
    if (!this.canUpdateAction(action)) return;

    // if the delay is completed, decrement the action timer.
    if (action.isDelayCompleted())
    {
      action.countdownDuration();
    }

    // if the duration of the action expires, remove it.
    if (this.canCleanupAction(action))
    {
      this.cleanupAction(action);
      return;
    }

    // if there is a delay between hits, count down on it.
    if (!this.canActionPierce(action))
    {
      action.modPiercingDelay();
      return;
    }

    // determine targets that this action collided with.
    this.processActionCollision(action);
  }

  /**
   * Determines if the action can be updated.
   * @param {JABS_Action} action The action to potentially update.
   * @returns {boolean} True if the action can be updated, false otherwise.
   */
  canUpdateAction(action)
  {
    // if the event is a trigger action using delay, but hasn't completed, do not update.
    if (!action.triggerOnTouch() && !action.isDelayCompleted()) return false;

    // update!
    return true;
  }

  /**
   * Determines whether or not to cleanup the action.
   * @param {JABS_Action} action The action to potentially cleanup.
   * @returns {boolean} True if the action should be cleaned up, false otherwise.
   */
  canCleanupAction(action)
  {
    // if the action is expired, then cleanup.
    if (action.isActionExpired()) return true;

    // if the action has run out of piercing hits, then cleanup.
    if (action.getPiercingTimes() <= 0) return true;

    // not ready for cleanup.
    return false;
  }

  /**
   * Cleans up a `JABS_Action`.
   * @param {JABS_Action} action The action to be cleaned up.
   */
  cleanupAction(action)
  {
    // if the minimum duration hasn't passed, do not cleanup.
    if (!action.getDuration() >= JABS_Action.getMinimumDuration()) return;

    // execute the action's pre-cleanup logic.
    action.preCleanupHook();

    // flag the action for removal.
    action.setNeedsRemoval();

    // clear out stale action events.
    this.clearActionEvents();
  }

  /**
   * Determines whether or not the action is ready to hit again.
   * @param {JABS_Action} action The action to potentially pierce.
   * @returns {boolean} True if the action can hit again, false otherwise.
   */
  canActionPierce(action)
  {
    // if the action has a remaining piercing delay, do not trigger.
    if (action.getPiercingDelay() > 0) return false;

    // hit again!
    return true;
  }

  /**
   * Executes all effects of when an action collides with one or more targets.
   * @param {JABS_Action} action The action to process.
   */
  processActionCollision(action)
  {
    // if we cannot process action collision, then do not collide.
    if (!this.canProcessActionCollision(action)) return;

    // iterate over all targets found.
    this.getCollisionTargets(action)
    // apply the battle effects of the action against each target.
      .forEach(target => this.applyPrimaryBattleEffects(action, target), this);

    // execute any additional post-collision processing.
    this.handleActionPostCollision(action);
  }

  /**
   * Determines whether or not this action can collide with targets.
   * @param {JABS_Action} action The action to process.
   * @returns {boolean} True if we can collide with targets, false otherwise.
   */
  canProcessActionCollision(action)
  {
    // check if we have any collision targets.
    if (this.getCollisionTargets(action).length === 0) return false;

    // we have collision targets!
    return true;
  }

  /**
   * Handles any post-collision processing, such as ending delays.
   * @param {JABS_Action} action The action that just collided.
   */
  handleActionPostCollision(action)
  {
    // if we were delaying, end the delay.
    action.endDelay();

    // if the target can pierce enemies, adjust those values.
    action.resetPiercingDelay();
    action.modPiercingTimes();
  }
  //#endregion update actions
  //#endregion update

  //#region functional
  //#region action execution
  /**
   * Generates a new `JABS_Action` based on a skillId, and executes the skill.
   * This overrides the need for costs or cooldowns, and is intended to be
   * used from the map, within an event's custom move routes.
   * @param {JABS_Battler} caster The battler executing the skill.
   * @param {number} skillId The skill to be executed.
   * @param {boolean=} isRetaliation Whether or not this skill is from a retaliation; defaults to false.
   * @param {number=} x The target's `x` coordinate; defaults to null.
   * @param {number=} y The target's `y` coordinate; defaults to null.
   */
  forceMapAction(caster, skillId, isRetaliation = false, x = null, y = null)
  {
    // generate the forced actions based on the given skill id.
    const actions = caster.createJabsActionFromSkill(skillId, isRetaliation);

    // if we cannot execute map actions, then do not.
    if (!this.canExecuteMapActions(caster, actions)) return;

    // iterate over each action and execute them as the caster.
    actions.forEach(action => this.executeMapAction(caster, action, x, y));
  }

  /**
   * Executes all provided actions at the given coordinates if possible.
   * @param {JABS_Battler} caster The battler executing the action.
   * @param {JABS_Action[]} actions All actions to perform.
   * @param {number|null} targetX The target's `x` coordinate, if applicable.
   * @param {number|null} targetY The target's `y` coordinate, if applicable.
   */
  executeMapActions(caster, actions, targetX = null, targetY = null)
  {
    // if we cannot execute map actions, then do not.
    if (!this.canExecuteMapActions(caster, actions)) return;

    // apply on-execution effects for this action.
    this.applyOnExecutionEffects(caster, actions[0]);

    // iterate over each action and execute them as the caster.
    actions.forEach(action => this.executeMapAction(caster, action, targetX, targetY));
  }

  /**
   * Determines whether or not the given map actions can be executed by the caster.
   * @param {JABS_Battler} caster The battler executing the action.
   * @param {JABS_Action[]} actions All actions to perform.
   * @returns {boolean} True if the actions can be executed, false otherwise.
   */
  canExecuteMapActions(caster, actions)
  {
    // if there are no actions to execute, then do not execute.
    if (!actions.length) return false;

    // execute!
    return true;
  }

  /**
   * Applies any on-execution effects to the caster based on the actions.
   * @param caster
   * @param primaryAction
   */
  applyOnExecutionEffects(caster, primaryAction)
  {
    // retaliation skills are exempt from execution effects.
    if (primaryAction.isRetaliation()) return;

    // pay the primary action's skill costs.
    this.paySkillCosts(caster, primaryAction);

    // apply the necessary cooldowns for the action against the caster.
    this.applyCooldownCounters(caster, primaryAction);
  }

  /**
   * Executes the provided `JABS_Action`.
   * It generates a copy of an event from the "ActionMap" and fires it off
   * based on it's move route.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   * @param {number?} targetX The target's `x` coordinate, if applicable.
   * @param {number?} targetY The target's `y` coordinate, if applicable.
   */
  executeMapAction(caster, action, targetX, targetY)
  {
    // handle the possibility of "freecombo".
    this.handleActionCombo(caster, action);

    // handle the pose for this action.
    this.handleActionPose(caster, action);

    // handle the cast animation for this action.
    this.handleActionCastAnimation(caster, action);

    // handle the generation of the action on the map.
    this.handleActionGeneration(caster, action, targetX, targetY);
  }

  /**
   * Handles the combo functionality behind this action.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  handleActionCombo(caster, action)
  {
    // check if this action has the "freecombo" tag.
    if (action.getBaseSkill().jabsFreeCombo)
    {
      // trigger the free combo effect for this action.
      this.checkComboSequence(caster, action)
    }
  }

  /**
   * Handles the pose functionality behind this action.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  handleActionPose(caster, action)
  {
    // perform the action's corresponding pose.
    caster.performActionPose(action.getBaseSkill());
  }

  /**
   * Handles the cast animation functionality behind this action.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  handleActionCastAnimation(caster, action)
  {
    // check if a cast animation exists.
    const casterAnimation = action.getCastAnimation();
    if (casterAnimation)
    {
      // execute the cast animation.
      caster.getCharacter().requestAnimation(casterAnimation);
    }
  }

  /**
   * Handles adding this action to the map if applicable.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   * @param {number|null} x The target's `x` coordinate, if applicable.
   * @param {number|null} y The target's `y` coordinate, if applicable.
   */
  handleActionGeneration(caster, action, x, y)
  {
    // all actions start with null.
    let actionEventData = null;

    // check if this is NOT a direct action.
    if (!action.isDirectAction())
    {
      // construct the action event data to appear visually on the map.
      actionEventData = this.buildActionEventData(caster, action, x, y);
      this.addJabsActionToMap(actionEventData, action);
    }

    // add the action to the tracker.
    this.addActionEvent(action, actionEventData);
  }

  /**
   * It generates a copy of an event from the "ActionMap".
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   * @param {number|null} x The target's `x` coordinate, if applicable.
   * @param {number|null} y The target's `y` coordinate, if applicable.
   * @returns {rm.types.Event}
   */
  buildActionEventData(caster, action, x, y)
  {
    const eventId = action.getActionId();
    const actionEventData = JsonEx.makeDeepCopy($actionMap.events[eventId]);

    actionEventData.x = x ?? caster.getX();
    actionEventData.y = y ?? caster.getY();
    actionEventData.isAction = true;
    actionEventData.id += 1000;
    actionEventData.uniqueId = action.getUuid();
    actionEventData.actionDeleted = false;
    return actionEventData;
  }

  /**
   * Determines the directions of all projectiles.
   * @param {number} facing The base direction the battler is facing.
   * @param {number} projectile The pattern/number of projectiles to generate directions for.
   * @returns {number[]} The collection of directions to fire projectiles off in.
   */
  determineActionDirections(facing, projectile)
  {
    const directions = [];
    switch (projectile)
    {
      case 1:
        directions.push(facing);
        break;
      case 2:
        directions.push(this.rotate45degrees(facing, true));
        directions.push(this.rotate45degrees(facing, false));
        break;
      case 3:
        directions.push(facing);
        directions.push(this.rotate45degrees(facing, true));
        directions.push(this.rotate45degrees(facing, false));
        break;
      case 4:
        directions.push(facing);
        directions.push(this.rotate90degrees(facing, true));
        directions.push(this.rotate90degrees(facing, false));
        directions.push(this.rotate180degrees(facing));
        break;
      case 8:
        directions.push(
          1, 3, 7, 9,   // diagonal
          2, 4, 6, 8);  // cardinal
        break;
    }

    return directions;
  }

  /**
   * Rotates the direction provided 45 degrees.
   * @param {number} direction The base direction to rotate from.
   * @param {boolean} clockwise True if rotating clockwise, false otherwise.
   * @returns {number} The direction after rotation.
   */
  rotate45degrees(direction, clockwise)
  {
    let newDirection = direction;
    switch (direction)
    {
      case J.ABS.Directions.UP:
        newDirection = clockwise ? 9 : 7;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = clockwise ? 3 : 9;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = clockwise ? 7 : 1;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = clockwise ? 1 : 3;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = clockwise ? 4 : 2;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = clockwise ? 2 : 6;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = clockwise ? 8 : 4;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = clockwise ? 6 : 8;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  }

  /**
   * Rotates the direction provided 90 degrees.
   * @param {number} direction The base direction to rotate from.
   * @param {boolean} clockwise True if rotating clockwise, false otherwise.
   * @returns {number} The direction after rotation.
   */
  rotate90degrees(direction, clockwise)
  {
    let newDirection = direction;
    switch (direction)
    {
      case J.ABS.Directions.UP:
        newDirection = clockwise ? 6 : 4;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = clockwise ? 2 : 8;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = clockwise ? 8 : 2;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = clockwise ? 4 : 6;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = clockwise ? 7 : 3;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = clockwise ? 1 : 9;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = clockwise ? 9 : 1;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = clockwise ? 3 : 7;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  }

  /**
   * Rotates the direction provided 180 degrees.
   * @param {number} direction The base direction to rotate from.
   * @returns {number} The direction after rotation.
   */
  rotate180degrees(direction)
  {
    let newDirection = direction;
    switch (direction)
    {
      case J.ABS.Directions.UP:
        newDirection = 2;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = 4;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = 6;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = 8;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = 9;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = 7;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = 3;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = 1;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  }

  /**
   * Checks whether or not this skill is a basic attack.
   * @param {string} cooldownKey The cooldown key to check.
   * @returns {boolean} True if the skill is a basic attack, false otherwise.
   */
  isBasicAttack(cooldownKey)
  {
    const isMainHand = cooldownKey === JABS_Button.Mainhand;
    const isOffHand = cooldownKey === JABS_Button.Offhand;
    return (isMainHand || isOffHand);
  }

  /**
   * Pays the costs for the skill (mp/tp default) if applicable.
   * @param {JABS_Battler} caster The battler casting the action.
   * @param {JABS_Action} action The action(skill) to pay the cost for.
   */
  paySkillCosts(caster, action)
  {
    const battler = caster.getBattler();
    const skill = action.getBaseSkill();
    battler.paySkillCost(skill);
  }

  /**
   * Applies the cooldowns to the battler.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  applyCooldownCounters(caster, action)
  {
    this.applyPlayerCooldowns(caster, action);
  }

  /**
   * Applies cooldowns in regards to the player for the casted action.
   * @param {JABS_Battler} caster The player.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  applyPlayerCooldowns(caster, action)
  {
    const cooldownType = action.getCooldownType();
    const cooldownValue = action.getCooldown();
    const skill = action.getBaseSkill();

    // if the skill has a unique cooldown functionality,
    // then each slot will have an independent cooldown.
    if (skill.jabsUniqueCooldown || this.isBasicAttack(cooldownType))
    {
      // if the skill is unique, only apply the cooldown to the slot assigned.
      caster.setCooldownCounter(cooldownType, cooldownValue);
      return;
    }

    // if the skill is not unique, then the cooldown applies to all slots it is equipped to.
    const equippedSkills = caster.getBattler().getAllEquippedSkills();
    equippedSkills.forEach(skillSlot =>
    {
      if (skillSlot.id === skill.id)
      {
        caster.setCooldownCounter(skillSlot.key, cooldownValue);
      }
    });
  }

  /**
   * Creates a new `JABS_Action` and adds it to the map and tracking.
   * @param {rm.types.Event} actionEventData An object representing the data of a `Game_Event`.
   * @param {JABS_Action} action An object representing the data of a `Game_Event`.
   */
  addJabsActionToMap(actionEventData, action)
  {
    // add the data to the $datamap.events.
    $dataMap.events[$dataMap.events.length] = actionEventData;
    const newIndex = $dataMap.events.length - 1;
    actionEventData.actionIndex = newIndex;

    // assign this so it exists, but isn't valid.
    actionEventData.lootIndex = 0;

    // create the event by hand with this new data
    const actionEventSprite = new Game_Event(
      J.ABS.DefaultValues.ActionMap,
      newIndex);

    const { x: actionX, y: actionY } = actionEventData;
    actionEventSprite._realX = actionX;
    actionEventSprite._realY = actionY;
    actionEventSprite._x = actionX;
    actionEventSprite._y = actionY;

    // give it a name.
    const skillName = action.getBaseSkill().name;
    const casterName = action.getCaster().battlerName();
    actionEventSprite.__actionName = `_${casterName}-${skillName}`;

    // on rare occasions, the timing of adding an action to the map coincides
    // with the removal of the caster which breaks the ordering of the events.
    // the result will throw an error and break. This should catch that, and if
    // not, then the try-catch will.
    if (!actionEventData || !actionEventData.pages.length)
    {
      console.error("that rare error occurred!");
      return;
    }

    const pageIndex = actionEventSprite.findProperPageIndex();
    const {characterIndex, characterName} = actionEventData.pages[pageIndex].image;

    actionEventSprite.setActionSpriteNeedsAdding();
    actionEventSprite._eventId = actionEventData.id;
    actionEventSprite._characterName = characterName;
    actionEventSprite._characterIndex = characterIndex;
    const pageData = actionEventData.pages[pageIndex];
    actionEventSprite.setMoveFrequency(pageData.moveFrequency);
    actionEventSprite.setMoveRoute(pageData.moveRoute);
    actionEventSprite.setDirection(action.direction());
    actionEventSprite.setCustomDirection(action.direction());
    actionEventSprite.setCastedDirection($gamePlayer.direction());
    actionEventSprite.setMapActionData(action);

    // overwrites the "start" of the event for this event to be nothing.
    // this prevents the player from accidentally interacting with the
    // sword swing or whatever is generated by the action.
    actionEventSprite.start = () => false;

    action.setActionSprite(actionEventSprite);
    $gameMap.addEvent(actionEventSprite);
    this.requestActionRendering = true;
  }

  /**
   * Adds the loot to the map.
   * @param {number} targetX The `x` coordinate of the battler dropping the loot.
   * @param {number} targetY The `y` coordinate of the battler dropping the loot.
   * @param {RPG_EquipItem|RPG_Item} item The loot's raw data object.
   */
  addLootDropToMap(targetX, targetY, item)
  {
    // clone the loot data from the action map event id of 1.
    const lootEventData = JsonEx.makeDeepCopy($actionMap.events[1]);
    lootEventData.x = targetX;
    lootEventData.y = targetY;

    // add the loot event to the datamap list of events.
    $dataMap.events[$dataMap.events.length] = lootEventData;
    const newIndex = $dataMap.events.length - 1;
    lootEventData.lootIndex = newIndex;

    // create the loot event by hand with this new data.
    const jabsLootData = new JABS_LootDrop(item);
    lootEventData.uuid = jabsLootData.uuid;

    // set the duration of this loot drop
    // if a custom time is available, then use that, otherwise use the default.
    jabsLootData.duration = item.jabsExpiration ?? J.ABS.Metadata.DefaultLootExpiration;

    // generate a new event to visually represent the loot drop and flag it for adding.
    const eventId = $dataMap.events.length - 1;
    const lootEvent = new Game_Event($gameMap.mapId(), eventId);
    lootEvent.setLootData(jabsLootData);
    lootEvent.setLootNeedsAdding();

    // add loot event to map.
    this.requestLootRendering = true;
    $gameMap.addEvent(lootEvent);
  }

  /**
   * Applies an action against a designated target battler.
   *
   * This is the orchestration method that manages the execution of an action against
   * a given target.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyPrimaryBattleEffects(action, target)
  {
    // execute the action against the target.
    this.executeSkillEffects(action, target);

    // apply effects that require landing a successful hit.
    this.applyOnHitEffects(action, target);

    // applies additional effects that come after the skill execution.
    this.continuedPrimaryBattleEffects(action, target);

    // run any additional functionality that we needed to run after a skill is executed.
    this.postPrimaryBattleEffects(action, target);
  }

  /**
   * Attempts to execute the skill effects of this action against the target.
   * @param {JABS_Action} action The action being executed.
   * @param {JABS_Battler} target The target to apply skill effects against.
   * @returns {Game_ActionResult}
   */
  executeSkillEffects(action, target)
  {
    // handle any pre-execution effects.
    this.preExecuteSkillEffects(action, target);

    // get whether or not this action was unparryable.
    let isUnparryable = (action.isUnparryable());

    // if the target is a player and also dashing...
    if (target.isPlayer() && target.getCharacter().isDashButtonPressed())
    {
      // they cannot parry anything.
      isUnparryable = true;
    }

    // check whether or not this action was parried.
    const caster = action.getCaster();
    const isParried = isUnparryable
      ? false // parry is cancelled because the skill ignores it.
      : this.checkParry(caster, target, action);

    // check if the action was parried instead.
    const targetBattler = target.getBattler();
    if (!isUnparryable && isParried)
    {
      // grab the result, clear it, and set the parry flag to true.
      const result = targetBattler.result();
      result.clear();
      result.parried = true;
    }

    // apply the action to the target.
    const gameAction = action.getAction();
    gameAction.apply(targetBattler);

    // handle any post-execution effects.
    this.postExecuteSkillEffects(action, target);
  }

  /**
   * Execute any pre-execution effects.
   * This occurs before the actual skill is applied against the target battler to get the
   * `Game_ActionResult` that is then used throughout the function.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  preExecuteSkillEffects(action, target)
  {
  }

  /**
   * Execute any post-execution effects.
   * This occurs after the actual skill is executed against the target battler.
   * @param {JABS_Action} action The action being executed.
   * @param {JABS_Battler} target The target to apply skill effects against.
   */
  postExecuteSkillEffects(action, target)
  {
    // apply aggro regardless of successful hit.
    this.applyAggroEffects(action, target);
  }

  /**
   * Applies all aggro effects against the target.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyAggroEffects(action, target)
  {
    // grab the attacker.
    const attacker = action.getCaster();

    // don't aggro your allies against you! That's dumb.
    if (attacker.isSameTeam(target.getTeam())) return;

    // grab the result on the target, from the action executed.
    const result = target.getBattler().result();

    // the default/base aggro.
    let aggro = J.ABS.Metadata.BaseAggro;

    // hp damage counts for 1.
    if (result.hpDamage > 0)
    {
      aggro += result.hpDamage * J.ABS.Metadata.AggroPerHp;
    }

    // mp damage counts for 2.
    if (result.mpDamage > 0)
    {
      aggro += result.mpDamage * J.ABS.Metadata.AggroPerMp;
    }

    // tp damage counts for 10.
    if (result.tpDamage > 0)
    {
      aggro += result.tpDamage * J.ABS.Metadata.AggroPerTp;
    }

    // if the attacker also healed from it, extra aggro for each point healed!
    if (result.drain)
    {
      aggro += result.hpDamage * J.ABS.Metadata.AggroDrain;
    }

    // if the attacker was parried, reduce aggro on this battler...
    if (result.parried)
    {
      aggro += J.ABS.Metadata.AggroParryFlatAmount;
      // ...and also increase the aggro of the attacking battler!
      attacker.addUpdateAggro(target.getUuid(), J.ABS.Metadata.AggroParryUserGain);
    }

    // apply any bonus aggro from the underlying skill.
    aggro += action.bonusAggro();

    // apply the aggro multiplier from the underlying skill.
    aggro *= action.aggroMultiplier();

    // apply any aggro amplification from states.
    attacker.getBattler().states().forEach(state =>
    {
      if (state.jabsAggroOutAmp >= 0)
      {
        aggro *= state.jabsAggroOutAmp;
      }
    });

    // apply any aggro reduction from states.
    target.getBattler().states().forEach(state =>
    {
      if (state.jabsAggroInAmp >= 0)
      {
        aggro *= state.jabsAggroInAmp;
      }
    });

    // apply the TGR multiplier from the attacker.
    aggro *= attacker.getBattler().tgr;

    // the player can attack tremendously faster than the AI can...
    // ...so reduce the aggro dealt to compensate.
    if (attacker.isPlayer())
    {
      aggro *= J.ABS.Metadata.AggroPlayerReduction;
    }

    // apply the aggro to the target.
    target.addUpdateAggro(attacker.getUuid(), aggro);
  }

  /**
   * Applies on-hit effects against the target.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyOnHitEffects(action, target)
  {
    // if the result isn't a hit or a parry, then we don't process on-hit effects.
    const result = target.getBattler().result();
    if (!result.isHit() && !result.parried) return;

    // grab some shorthand variables for local use.
    const caster = action.getCaster();
    const targetCharacter = target.getCharacter();
    const skill = action.getBaseSkill();

    // get the animation id associated with this skill.
    const targetAnimationId = this.getAnimationId(skill, caster);

    // if the skill should animate on the target, then animate as normal.
    targetCharacter.requestAnimation(targetAnimationId, result.parried);

    // if there is a self-animation id, apply that to yourself for every hit.
    if (action.hasSelfAnimationId())
    {
      action.performSelfAnimation();
    }

    // if freecombo-ing, then we already checked for combo when executing the action.
    if (!skill.jabsFreeCombo)
    {
      this.checkComboSequence(caster, action);
    }

    this.checkKnockback(action, target);
    this.triggerAlert(caster, target);

    // if the attacker and the target are the same team, then don't set that as "last hit".
    if (!(caster.isSameTeam(target.getTeam())))
    {
      caster.setBattlerLastHit(target);
    }
  }

  /**
   * Forces the target hit to be knocked back.
   * @param {JABS_Action} action The action potentially knocking the target back.
   * @param {JABS_Battler} target The map battler to potentially knockback.
   */
  checkKnockback(action, target)
  {
    // don't knockback if already being knocked back.
    const targetSprite = target.getCharacter();
    if (targetSprite.isJumping()) return;

    // get the knockback resist for this target.
    const targetReferenceData = target.getReferenceData();
    const targetMeta = targetReferenceData.meta;
    let knockbackResist = 1.00;
    if (targetMeta && targetMeta[J.ABS.Notetags.KnockbackResist])
    {
      const metaResist = parseInt(targetMeta[J.ABS.Notetags.KnockbackResist]);
      knockbackResist = (100 - metaResist) / 100;
    }

    // don't even knock them up or around at all, they are immune to knockback.
    if (knockbackResist <= 0)
    {
      return;
    }

    // get the knockback value from the skill if applicable.
    let knockback = action.getKnockback();

    // check to make sure the skill has knockback before processing.
    if (knockback === null) return;

    // multiply the knockback by the resist.
    knockback *= knockbackResist;

    // check if the knockback is 0, or the action is direct.
    if (knockback === 0 || action.isDirectAction())
    {
      // hop in place.
      targetSprite.jump(0, 0);

      // stop processing.
      return;
    }

    // calculate where the knockback would send the target.
    const actionSprite = action.getActionSprite();
    const knockbackDirection = actionSprite.direction();
    let xPlus = 0;
    let yPlus = 0;
    switch (knockbackDirection)
    {
      case J.ABS.Directions.UP:
        yPlus -= Math.ceil(knockback);
        break;
      case J.ABS.Directions.DOWN:
        yPlus += Math.ceil(knockback);
        break;
      case J.ABS.Directions.LEFT:
        xPlus -= Math.ceil(knockback);
        break;
      case J.ABS.Directions.RIGHT:
        xPlus += Math.ceil(knockback);
        break;
    }

    const maxX = targetSprite.x + xPlus;
    const maxY = targetSprite.y + yPlus;
    let realX = targetSprite.x;
    let realY = targetSprite.y;
    let canPass = true;

    // dynamically test each square to ensure you don't cross any unpassable tiles.
    while (canPass && (realX !== maxX || realY !== maxY))
    {
      switch (knockbackDirection)
      {
        case J.ABS.Directions.UP:
          realY--;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realY++;
          break;
        case J.ABS.Directions.DOWN:
          realY++;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realY--;
          break;
        case J.ABS.Directions.LEFT:
          realX--;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realX++;
          break;
        case J.ABS.Directions.RIGHT:
          realX++;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realX--;
          break;
        default:
          canPass = false;
          break;
      }
    }

    // execute the jump to the new destination.
    targetSprite.jump(realX - targetSprite.x, realY - targetSprite.y);
  }

  /**
   * Determines if there is a combo action that should succeed this skill.
   * @param {JABS_Battler} caster The battler that casted this skill.
   * @param {JABS_Action} action The action that contains the skill to check for combos.
   */
  checkComboSequence(caster, action)
  {
    // check to make sure we have combo data before processing the combo.
    if (!this.canUpdateComboSequence(caster, action)) return;

    // execute the combo action.
    this.updateComboSequence(caster, action);
  }

  /**
   * Determines whether or not the caster can update their combo data based on
   * the given action.
   * @param {JABS_Battler} caster The caster of the action.
   * @param {JABS_Action} action The action executed.
   * @returns {boolean} True if the combo action should be updated, false otherwise.
   */
  canUpdateComboSequence(caster, action)
  {
    // grab the skill out of the action.
    const skill = action.getBaseSkill();

    // if we do not have a combo, we cannot combo.
    if (!skill.jabsComboAction) return false;

    // if the battler doesn't know the combo skill, we cannot combo.
    if (!caster.getBattler().hasSkill(skill.jabsComboSkillId)) return false;

    // execute combo actions!
    return true;
  }

  /**
   * Updates the combo action data for the caster.
   * The next time the appropriate slot is executed, the combo skill will execute instead.
   * @param {JABS_Battler} caster The caster of the action.
   * @param {JABS_Action} action The action executed.
   */
  updateComboSequence(caster, action)
  {
    // extract the combo data out of the skill.
    const { jabsComboSkillId, jabsComboDelay } = action.getBaseSkill();

    // determine which slot to apply cooldowns to.
    const cooldownKey = action.getCooldownType();

    // clarifies that this check is whether or not the next combo skill is a continuation of the combo.
    const isComboAction = (caster.getComboNextActionId(cooldownKey) !== jabsComboSkillId);

    // check if this is actually a combo action to the last action.
    if (isComboAction)
    {
      // its a combo skill, so also extend the base cooldown by the combo cooldown.
      caster.modCooldownCounter(cooldownKey, jabsComboDelay);
    }

    // update the next combo data.
    caster.setComboFrames(cooldownKey, jabsComboDelay);
    caster.setComboNextActionId(cooldownKey, jabsComboSkillId);
  }

  /**
   * Resets the combo action for the given battler.
   * @param {JABS_Battler} caster The caster of the combo attack.
   */
  resetComboAction(caster)
  {
    console.log('should cancel combo action!');
  }

  /**
   * Calculates whether or not the attack was parried.
   * @param {JABS_Battler} caster The battler performing the action.
   * @param {JABS_Battler} target The target the action is against.
   * @param {JABS_Action} action The action being executed.
   * @returns {boolean}
   */
  checkParry(caster, target, action)
  {
    // cannot parry if not facing target.
    const isFacing = caster.isFacingTarget(target.getCharacter());
    if (!isFacing) return false;

    // if the target battler has 0% GRD, they can't parry.
    const targetBattler = target.getBattler();
    if (targetBattler.grd === 0) return false;

    const casterBattler = caster.getBattler();

    // if the attacker has a state that ignores all parry, then skip parrying.
    if (casterBattler.ignoreAllParry()) return false;

    /* eslint-disable */
    /*
    // WIP formula!
    // defender's stat calculation of grd, bonuses from agi/luk.
    const baseGrd = parseFloat(((targetBattler.grd - 1) * 100).toFixed(3));
    const bonusGrdFromAgi = parseFloat((targetBattler.agi * 0.1).toFixed(3));
    const bonusGrdFromLuk = parseFloat((targetBattler.luk * 0.1).toFixed(3));
    const defenderGrd = baseGrd + bonusGrdFromAgi + bonusGrdFromLuk;

    // attacker's stat calculation of hit, bonuses from agi/luk.
    const baseHit = parseFloat((casterBattler.hit * 100).toFixed(3));
    const bonusHitFromAgi = parseFloat((casterBattler.agi * 0.1).toFixed(3));
    const bonusHitFromLuk = parseFloat((casterBattler.luk * 0.1).toFixed(3));
    const attackerHit = baseHit + bonusHitFromAgi + bonusHitFromLuk;

    // determine the difference and apply the multiplier if applicable.
    let difference = attackerHit - defenderGrd;
    if (J.LEVEL && J.LEVEL.Metadata.Enabled) {
      const multiplier = LevelScaling.multiplier(targetBattler.level, casterBattler.level);
      difference *= multiplier;
    }

    // the hit is too great, there is no chance of being parried.
    if (difference > 100) {
      return false;
    // the grd is too great, there is no chance of landing a hit.
    } else if (difference < 0) {
      return true;
    }

    const rng = parseInt(Math.randomInt(100) + 1);
    console.log(`attacker: ${attackerHit}, defender: ${defenderGrd}, rng: ${rng}, diff: ${difference}, parried: ${rng > difference}`);
    return rng > difference;
    // console.log(`attacker:${casterBattler.name()} bonus:${bonusHit} + hit:${hit-bonusHit} < grd:${parryRate} ?${hit < parryRate}`);
    */
    /* eslint-enable */

    // apply the hit bonus to hit (10% of actual hit).
    const bonusHit = parseFloat((casterBattler.hit * 0.1).toFixed(3));

    // calculate the hit rate (rng + bonus hit).
    const hit = parseFloat((Math.random() + bonusHit).toFixed(3));

    // grab the amount of parry ignored.
    const parryIgnored = (action.getBaseSkill().jabsIgnoreParry ?? 0) / 100;

    // calculate the parry rate.
    const parry = parseFloat((targetBattler.grd - 1 - parryIgnored).toFixed(3));

    // return whether or not the hit was successful.
    return hit < parry;
  }

  /**
   * If the battler is hit from outside of it's engagement range,
   * trigger the alert state.
   * @param {JABS_Battler} attacker The battler triggering the alert.
   * @param {JABS_Battler} target The battler entering the alert state.
   */
  triggerAlert(attacker, target)
  {
    // check if the target can actually be alerted first.
    if (!this.canBeAlerted(attacker, target)) return;

    // alert the target!
    target.showBalloon(J.ABS.Balloons.Question);
    target.setAlertedCoordinates(attacker.getX(), attacker.getY());
    const alertDuration = target.getAlertDuration();
    target.setAlertedCounter(alertDuration);

    // a brief pause the first time entering the alerted state.
    if (!target.isAlerted())
    {
      target.setWaitCountdown(45);
    }
  }

  /**
   * Checks if the battler can even be alerted in the first place.
   * @param {JABS_Battler} attacker The battler that initiated the alert.
   * @param {JABS_Battler} battler The battler to be alerted.
   * @return {boolean} True if they can be alerted, false otherwise.
   */
  canBeAlerted(attacker, battler)
  {
    // cannot alert your own allies.
    if (attacker.isSameTeam(battler.getTeam())) return false;

    // cannot alert the player.
    if (battler.isPlayer()) return false;

    // cannot alert battlers that are already engaged.
    if (battler.isEngaged()) return false;

    // cannot alert inanimate objects.
    if (battler.isInanimate()) return false;

    return true;
  }

  /**
   * Applies all effects to the target that occur after the skill execution is complete.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  continuedPrimaryBattleEffects(action, target)
  {
    // checks for retaliation from the target.
    this.checkRetaliate(action, target);

    // apply the battle memories to the target.
    const result = target.getBattler().result();
    this.applyBattleMemories(result, action, target);
  }

  /**
   * Executes a retalation if necessary on receiving a hit.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} targetBattler The target having the action applied against.
   */
  checkRetaliate(action, targetBattler)
  {
    // do not retaliate against other battler's retaliations.
    if (action.isRetaliation()) return;

    // do not retaliate against being targeted by battlers of the same team.
    if (action.getCaster().isSameTeam(targetBattler.getTeam()))
    {
      return;
    }

    if (targetBattler.isActor())
    {
      // handle player retaliations.
      this.handleActorRetaliation(targetBattler);
    }
    else
    {
      // handle non-player retaliations.
      this.handleEnemyRetaliation(targetBattler);
    }
  }

  /**
   * Executes any retaliation the player may have when receiving a hit.
   * @param {JABS_Battler} battler The battler doing the retaliating.
   */
  handleActorRetaliation(battler)
  {
    // grab the action result.
    const actionResult = battler.getBattler().result();

    // check if we need to perform any sort of countering.
    const needsCounterParry = actionResult.parried && battler.counterParry().length;

    // NOTE: you cannot perform both a counterguard AND a counterparry- counterparry takes priority!
    const needsCounterGuard = !needsCounterParry && battler.guarding() && battler.counterGuard().length;

    // if we should be counter-parrying.
    if (needsCounterParry)
    {
      // execute the counterparry.
      this.doCounterParry(battler, JABS_Button.Offhand);
    }

    // if we should be counter-guarding.
    if (needsCounterGuard)
    {
      // execute the counterguard.
      this.doCounterGuard(battler, JABS_Button.Offhand);
    }

    // if auto-counter is available, then just do that.
    if (actionResult.parried)
    {
      this.handleAutoCounter(battler);
    }

    // grab all the retaliation skills for this battler.
    const retaliationSkills = battler.getBattler().retaliationSkills();

    // if there are any passive retaliation skills to perform...
    if (retaliationSkills.length)
    {
      // ...perform them!
      retaliationSkills.forEach(skillChance =>
      {
        if (skillChance.shouldTrigger())
        {
          this.forceMapAction(battler, skillChance.skillId, true);
        }
      })
    }
  }

  /**
   * If the counter rate is sufficient, then automatically perform your counterskills on any
   * incoming passive parry!
   * @param {JABS_Battler} battler The battler performing the counter.
   */
  handleAutoCounter(battler)
  {
    // stop processing if we cannot autocounter.
    if (!this.canAutoCounter(battler)) return;

    // check if RNG favors you.
    const shouldAutoCounter = battler.getBattler().cnt > Math.random();

    // if RNG did actually favor you, then proceed.
    if (shouldAutoCounter)
    {
      // perform the autocounter.
      this.doAutoCounter(battler, JABS_Button.Offhand);
    }
  }

  /**
   * Commands the {@link JABS_Battler} to perform an autocounter.
   * This will attempt to execute all counterguard/counterparry skill ids available
   * in the given slot.
   * @param {JABS_Battler} battler The battler doing the autocounter.
   * @param {string=} slot The skill slot key; defaults to {@link JABS_Button.Offhand}.
   */
  doAutoCounter(battler, slot = JABS_Button.Offhand)
  {
    // execute counterparrying.
    this.doCounterParry(battler, slot);

    // execute counterguarding.
    this.doCounterGuard(battler, slot);
  }

  /**
   * Executes any counterguard skills available to the given battler.
   * @param {JABS_Battler} battler The battler to perform the skills.
   * @param {string=} slot The skill slot key; defaults to {@link JABS_Button.Offhand}.
   */
  doCounterGuard(battler, slot = JABS_Button.Offhand)
  {
    // destructure out the guard and parry ids.
    const { counterGuardIds } = battler.getGuardData(slot);

    // check if we even have any skills to counterguard with.
    if (counterGuardIds.length)
    {
      // iterate over each of them and auto-counterguard!
      counterGuardIds.forEach(id => this.forceMapAction(battler, id, true));
    }
  }

  /**
   * Executes any counterparry skills available to the given battler.
   * @param {JABS_Battler} battler The battler to perform the skills.
   * @param {string=} slot The skill slot key; defaults to {@link JABS_Button.Offhand}.
   */
  doCounterParry(battler, slot = JABS_Button.Offhand)
  {
    // destructure out the parry ids.
    const { counterParryIds } = battler.getGuardData(slot);

    // check if we even have any skills to counterparry with.
    if (counterParryIds.length)
    {
      // iterate over each of them and auto-counterparry!
      counterParryIds.forEach(id => this.forceMapAction(battler, id, true));
    }
  }

  /**
   * Determines whether or not the battler can perform any sort of autocountering.
   * @param {JABS_Battler} battler The battler to potentially autocounter.
   * @returns {boolean} True if we should try to autocounter, false otherwise.
   */
  canAutoCounter(battler)
  {
    // shorthand the guard data from your offhand.
    const guardData = battler.getGuardData(JABS_Button.Offhand);

    // if we have no guard data, don't try to autocounter.
    if (!guardData) return false;

    // if we are unable to perform a counter, don't try to autocounter.
    if (!guardData.canCounter()) return false;

    // we should try to autocounter.
    return true;
  }

  /**
   * Executes any retaliation the enemy may have when receiving a hit at any time.
   * @param {JABS_Battler} enemy The enemy's `JABS_Battler`.
   */
  handleEnemyRetaliation(enemy)
  {
    // assumes enemy battler is enemy.
    const retaliationSkills = enemy.getBattler().retaliationSkills();

    // if there are any passive retaliation skills to perform...
    if (retaliationSkills.length)
    {
      // ...perform them!
      retaliationSkills.forEach(skillChance =>
      {
        if (skillChance.shouldTrigger())
        {
          this.forceMapAction(enemy, skillChance.skillId, true);
        }
      })
    }
  }

  /**
   * Applies a battle memory to the target.
   * Only applicable to actors (for now).
   * @param {Game_ActionResult} result The effective result of the action against the target.
   * @param {JABS_Action} action The action executed against the target.
   * @param {JABS_Battler} target The target the action was applied to.
   */
  applyBattleMemories(result, action, target)
  {
    // only applicable to allies.
    if (target.isEnemy()) return;

    // only works if the code is there to process.
    if (!J.ALLYAI) return;

    const newMemory = new JABS_BattleMemory(
      target.getBattlerId(),
      action.getBaseSkill().id,
      action.getAction()
        .calculateRawElementRate(target.getBattler()),
      result.hpDamage);
    target.applyBattleMemories(newMemory);
  }

  /**
   * Executes a retalation if necessary on receiving a hit.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  postPrimaryBattleEffects(action, target)
  {
    // generate log for this action.
    this.createAttackLog(action, target);

    // generate the text popup for this action.
    this.generatePopAttack(action, target);

    // generate the text popup for the skill usage on the caster.
    this.generatePopSkillUsage(action, target);
  }

  /**
   * Generates a popup based on the action executed and its result.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  generatePopAttack(action, target)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // gather shorthand variables for use.
    const skill = action.getBaseSkill();
    const caster = action.getCaster();
    const character = target.getCharacter();

    // generate the textpop.
    const damagePop = this.configureDamagePop(action.getAction(), skill, caster, target);

    // add the pop to the target's tracking.
    character.addTextPop(damagePop);
    character.setRequestTextPop();
  }

  /**
   * Generates a popup on the caster based on the skill used.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  generatePopSkillUsage(action, target)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // inanimate objects do not have skill usage pops.
    if (action.getCaster().isInanimate()) return;

    // gather shorthand variables for use.
    const skill = action.getBaseSkill();
    const character = action.getCaster().getCharacter();

    // generate the textpop.
    const skillUsagePop = this.configureSkillUsedPop(skill);

    // add the pop to the caster's tracking.
    character.addTextPop(skillUsagePop);
    character.setRequestTextPop();
  }

  /**
   * Generates a log in the `Map_TextLog` if applicable.
   * It is important to note that only HP damage is published to the log.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The `JABS_Battler` who was the target of the action.
   */
  createAttackLog(action, target)
  {
    // if not enabled, skip this.
    if (!J.LOG) return;

    // gather shorthand variables for use.
    const result = target.getBattler().result();
    const caster = action.getCaster();
    const skill = action.getBaseSkill();

    const casterName = caster.getReferenceData().name;
    const targetName = target.getReferenceData().name;

    // create parry logs if it was parried.
    if (result.parried)
    {
      const parryLog = new MapLogBuilder()
        .setupParry(targetName, casterName, skill.id, result.parried)
        .build();
      $gameTextLog.addLog(parryLog);
      return;
    }
    // create evasion logs if it was evaded.
    else if (result.evaded)
    {
      const dodgeLog = new MapLogBuilder()
        .setupDodge(targetName, casterName, skill.id)
        .build();
      $gameTextLog.addLog(dodgeLog);
      return;
    }
    // create retaliation logs if it was a retaliation.
    else if (action.isRetaliation())
    {
      const retaliationLog = new MapLogBuilder()
        .setupRetaliation(casterName)
        .build();
      $gameTextLog.addLog(retaliationLog);
    }
    // if no damage of any kind was dealt, and no states were applied, then you get a special message!
    else if (!result.hpDamage && !result.mpDamage && !result.tpDamage && !result.addedStates.length)
    {
      const log = new MapLogBuilder()
        .setupUndamaged(targetName, casterName, skill.id)
        .build();
      $gameTextLog.addLog(log);
      return;
    }
    if (result.hpDamage)
    {
      // otherwise, it must be a regular damage type log.
      // get the base damage dealt and clean that up.
      let roundedDamage = Math.round(result.hpDamage);
      const isNotHeal = roundedDamage > 0;
      roundedDamage = roundedDamage >= 0 ? roundedDamage : roundedDamage.toString().replace("-", "");
      const damageReduction = Math.round(result.reduced);
      let reducedAmount = "";
      if (damageReduction)
      {
        reducedAmount = `(${parseInt(damageReduction)})`;
      }

      const log = new MapLogBuilder()
        .setupExecution(targetName, casterName, skill.id, roundedDamage, reducedAmount, !isNotHeal, result.critical)
        .build();
      $gameTextLog.addLog(log);
      // fall through in case there were states that were also applied, such as defeating the target.
    }

    // also publish any logs regarding application of states against the target.
    if (result.addedStates.length)
    {
      result.addedStates.forEach(stateId =>
      {
        // show a custom line when an enemy is defeated.
        if (stateId === target.getBattler().deathStateId())
        {
          const log = new MapLogBuilder()
            .setupTargetDefeated(targetName)
            .build();
          $gameTextLog.addLog(log);
          return;
        }

        // show all the rest of the non-death states.
        const log = new MapLogBuilder()
          .setupStateAfflicted(targetName, stateId)
          .build();
        $gameTextLog.addLog(log);
      });
    }
  }

  /**
   * Configures this skill used popup based on the skill itself.
   * @param {RPG_Skill} skill The skill that was used.
   * @returns {Map_TextPop}
   */
  configureSkillUsedPop(skill)
  {
    return new TextPopBuilder(skill.name)
      .isSkillUsed(skill.iconIndex)
      .build();
  }

  /**
   * Configures this damage popup based on the action result against the target.
   * @param {Game_Action} gameAction The action this popup is based on.
   * @param {RPG_Skill} skill The skill reference data itself.
   * @param {JABS_Battler} caster The battler who casted this skill.
   * @param {JABS_Battler} target The target battler the popup is placed on.
   */
  configureDamagePop(gameAction, skill, caster, target)
  {
    // get the underlying battler associated with the popup.
    const targetBattler = target.getBattler();

    // get the underlying actionresult from the skill execution.
    const actionResult = targetBattler.result();

    // initialize this to false.
    let targetElementallyImmune = false;

    // determine the elemental factor.
    let elementalRate;

    // check if using the J-Elementalistics plugin.
    if (J.ELEM)
    {
      // leverage the new elemental algorithm for elemental rates.
      elementalRate = gameAction.calculateRawElementRate(targetBattler);

      // check to ensure we have any amount of applicable elements.
      targetElementallyImmune = (gameAction.getApplicableElements(targetBattler)).length === 0;
    }
    else
    {
      // leverage the default method for obtaining elemental rate.
      elementalRate = gameAction.calcElementRate(targetBattler);
    }

    // translate the skill into it's relevant iconIndex, or 0 if not applicable.
    const elementalIcon = this.determineElementalIcon(skill, caster);

    // if the skill execution was parried, then use that icon instead.
    const iconIndex = actionResult.parried
      ? 128
      : elementalIcon;

    // instantiate the builder for piece-mealing the popup together.
    const textPopBuilder = new TextPopBuilder(0);

    switch (true)
    {
      // if you were parried, sorry about your luck.
      case actionResult.parried:
        textPopBuilder.setValue(`PARRY!`);
        break;
      // if you were evaded, how unfortunate.
      case actionResult.evaded:
        textPopBuilder.setValue(`DODGE`);
        break;
      // if the result is hp damage, treat it as such.
      case actionResult.hpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.hpDamage)
          .isHpDamage();
        break;
      // if the result is mp damage, treat it as such.
      case actionResult.mpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.mpDamage)
          .isHpDamage();
        break;
      // if the result is tp damage, treat it as such.
      case actionResult.tpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.tpDamage)
          .isHpDamage();
        break;
      // if for some reason its something else, they are probably immune.
      default:
        textPopBuilder
          .setValue(actionResult.hpDamage)
          .isHpDamage();
        //console.warn(`unknown damage output- review Game_ActionResult:`, actionResult, targetBattler);
        break;
    }

    // if we somehow used this without a proper damage type, then just build a default.
    return textPopBuilder
      .setIconIndex(iconIndex)
      .isElemental(elementalRate)
      .setCritical(actionResult.critical)
      .build();
  }

  /**
   * Translates a skill's elemental affiliation into the icon id representing it.
   * @param {RPG_Skill} skill The skill reference data itself.
   * @param {JABS_Battler} caster The battler performing the action.
   * @returns {number} The icon index to use for this popup.
   */
  determineElementalIcon(skill, caster)
  {
    // if not using the elemental icons, don't return one.
    if (!J.ABS.Metadata.UseElementalIcons) return 0;

    let {elementId} = skill.damage;

    // if the battler is an actor and the action is based on the weapon's elements
    // probe the weapon's traits for its actual element.
    if (elementId === -1 && caster.isActor())
    {
      const attackElements = caster.getBattler().attackElements();
      if (attackElements.length)
      {
        // we pick only the first element!
        [elementId,] = attackElements;
      }
      else
      {
        elementId = 0;
      }
    }

    // if its an item, then use the item's icon index.
    if (DataManager.isItem(skill))
    {
      return $dataItems[skill.id].iconIndex;
    }

    const iconData = J.ABS.Metadata.ElementalIcons;
    const elementalIcon = iconData.find(data => data.element === elementId);
    return elementalIcon ? elementalIcon.icon : 0;
  }
  //#endregion action execution

  //#region collision
  /**
   * Checks this `JABS_Action` against all map battlers to determine collision.
   * If there is a collision, then a `Game_Action` is applied.
   * @param {JABS_Action} action The `JABS_Action` to check against all battlers.
   * @returns {JABS_Battler[]} A collection of `JABS_Battler`s that this action hit.
   */
  getCollisionTargets(action)
  {
    if (action.getAction()
      .isForUser())
    {
      return [action.getCaster()];
    }

    const actionSprite = action.getActionSprite();
    const range = action.getRange();
    const shape = action.getShape();
    const casterJabsBattler = action.getCaster();
    const caster = casterJabsBattler.getCharacter();

    /**  @type {JABS_Battler[]} */
    const battlers = $gameMap.getAllBattlersDistanceSortedFromPlayer(casterJabsBattler);
    let hitOne = false;
    const targetsHit = [];

    const allyTarget = casterJabsBattler.getAllyTarget();
    if (allyTarget && action.getAction().isForOne())
    {
      if (allyTarget.canActionConnect() && allyTarget.isWithinScope(action, allyTarget, hitOne))
      {
        targetsHit.push(allyTarget);
        return targetsHit;
      }
    }

    battlers.filter(battler =>
    {
    // this battler is untargetable.
      if (!battler.canActionConnect()) return false;

      // the action's scopes don't meet the criteria for this target.
      // excludes the "single"-hitonce check.
      if (!battler.isWithinScope(action, battler)) return false;

      // if the attacker is an enemy, do not consider inanimate targets.
      if (casterJabsBattler.isEnemy() && battler.isInanimate()) return false;

      // this battler is potentially hit-able.
      return true;
    })
    .forEach(battler =>
    {
      // this time, it is effectively checking for the single-scope.
      if (!battler.isWithinScope(action, battler, hitOne)) return;

      // if the action is a direct-targeting action,
      // then only check distance between the caster and target.
      if (action.isDirectAction())
      {
        if (action.getAction().isForUser())
        {
          targetsHit.push(battler);
          hitOne = true;
          return;
        }
        const maxDistance = action.getProximity();
        const distance = casterJabsBattler.distanceToDesignatedTarget(battler);
        if (distance <= maxDistance)
        {
          targetsHit.push(battler);
          hitOne = true;
        }

      // if the action is a standard projectile-based action,
      // then check to see if this battler is now in range.
      }
      else
      {
        const sprite = battler.getCharacter();
        const actionDirection = actionSprite.direction();
        const result = this.isTargetWithinRange(actionDirection, sprite, actionSprite, range, shape);
        if (result)
        {
          targetsHit.push(battler);
          hitOne = true;
        }
      }
    });

    return targetsHit;
  }

  /**
   * Determines collision of a given shape vs coordinates.
   * @param {number} facing The direction the caster is facing.
   * @param {Game_Event|Game_Player|Game_Character} targetCharacter The target being hit.
   * @param {Game_Event} actionEvent The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {string} shape The collision formula based on shape.
   */
  isTargetWithinRange(facing, targetCharacter, actionEvent, range, shape)
  {
    switch (shape)
    {
      // shapes that do not care about direction.
      case J.ABS.Shapes.Circle:
        return this.collisionCircle(targetCharacter, actionEvent, range);
      case J.ABS.Shapes.Rhombus:
        return this.collisionRhombus(targetCharacter, actionEvent, range);
      case J.ABS.Shapes.Square:
        return this.collisionSquare(targetCharacter, actionEvent, range);
      case J.ABS.Shapes.Cross:
        return this.collisionCross(targetCharacter, actionEvent, range);

      // shapes that require action direction.
      case J.ABS.Shapes.FrontSquare:
        return this.collisionFrontSquare(targetCharacter, actionEvent, range, facing);
      case J.ABS.Shapes.Line:
        return this.collisionLine(targetCharacter, actionEvent, range, facing);
      case J.ABS.Shapes.Arc:
        return this.collisionFrontRhombus(targetCharacter, actionEvent, range, facing);
      case J.ABS.Shapes.Wall:
        return this.collisionWall(targetCharacter, actionEvent, range, facing);
      default:
        return false;
    }
  }

  /**
   * A cirlce-shaped collision.
   * Range determines the radius of the circle.
   * This has no specific type of use- it is a circle.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @returns {boolean}
   */
  collisionCircle(target, action, range)
  {
    // calculate the distance between the target and action.
    const distance = $gameMap.distance(target.x, target.y, action.x, action.y);
    
    // determine whether or not the target is within range of being hit.
    const inRange = distance <= range;

    // return the result.
    return inRange;
  }

  /**
   * A rhombus-shaped (aka diamond) collision.
   * Range determines the size of the rhombus surrounding the action.
   * This is typically used for AOE around the caster type skills, but could also
   * be used for very large objects, or as an explosion radius.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @returns {boolean}
   */
  collisionRhombus(target, action, range)
  {
    // calculate the absolute x and y distances.
    const dx = Math.abs($gameMap.deltaX(target.x, action.x));
    const dy = Math.abs($gameMap.deltaY(target.y, action.y));

    // the maximum distance the rhombus reaches is the combined x and y distances.
    const distance = dx + dy;

    // determine whether or not the target is within range of being hit.
    const inRange = distance <= range;

    // return the result.
    return inRange;
  }

  /**
   * A square-shaped collision.
   * Range determines the size of the square around the action.
   * The use cases for this are similar to that of rhombus, but instead of a diamond-shaped
   * hitbox, its a plain ol' square.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @returns {boolean}
   */
  collisionSquare(target, action, range)
  {
    // calculate the absolute x and y distances.
    const dx = Math.abs($gameMap.deltaX(target.x, action.x));
    const dy = Math.abs($gameMap.deltaY(target.y, action.y));

    // determine if we're in horizontal range.
    const inHorzRange = dx <= range;

    // determine if we're in vertical range.
    const inVertRange = dy <= range;

    // determine whether or not the target is within range of being hit.
    const inRange = inHorzRange && inVertRange;

    // return the result.
    return inRange;
  }

  /**
   * A square-shaped collision infront of the caster.
   * Range determines the size of the square infront of the action.
   * For when you want a square that doesn't affect targets behind the action. It would be
   * more accurate to call this a "half-square", really.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   * @returns {boolean}
   */
  collisionFrontSquare(target, action, range, facing)
  {
    // determine whether or not the target is within range of being hit.
    const inSquareRange = this.collisionSquare(target, action, range);

    // if they don't even collide in the full square, they won't collide in the frontsquare.
    if (!inSquareRange) return false;

    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // default to being infront, we always are!
    let inFront = true;

    // switch on caster's direction.
    // NOTE: this switch also ensures the action doesn't connect with targets behind it.
    switch (facing)
    {
      // infront when facing down means there should be positive Y distance.
      case J.ABS.Directions.DOWN:
        inFront = dy >= 0;
        break;
      // infront when facing left means there should be negative X distance.
      case J.ABS.Directions.LEFT:
        inFront = dx <= 0;
        break;
      // infront when facing right means there should be positive X distance.
      case J.ABS.Directions.RIGHT:
        inFront = dx >= 0;
        break;
      // infront when facing up means there should be negative Y distance.
      case J.ABS.Directions.UP:
        inFront = dy <= 0;
        break;
    }

    // determine whether or not the target is within range of being hit.
    const inRange = inSquareRange && inFront;

    // return the result.
    return inRange;
  }

  /**
   * A line-shaped collision.
   * Range the distance of the of the line.
   * This is typically used for spears and other stabby attacks.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   * @returns {boolean}
   */
  collisionLine(target, action, range, facing)
  {
    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // default to not hitting.
    let inRange = false;

    // some wiggle room rather than being precisely 0 distance for lines.
    // TODO: accommodate a new <size:#> tag for defining width of the line.
    const upDownBuffer = (dx <= 0.5) && (dx >= -0.5);
    const leftRightBuffer = (dy <= 0.5) && (dy >= -0.5);

    // switch on caster's direction.
    switch (facing)
    {
      case J.ABS.Directions.DOWN:
        inRange = upDownBuffer && (dy >= 0) && (dy <= range);
        break;
      case J.ABS.Directions.LEFT:
        inRange = leftRightBuffer && (dx <= 0) && (dx >= -range);
        break;
      case J.ABS.Directions.RIGHT:
        inRange = leftRightBuffer && (dx >= 0) && (dx <= range);
        break;
      case J.ABS.Directions.UP:
        inRange = upDownBuffer && (dy <= 0) && (dy >= -range);
        break;
    }

    // return the result.
    return inRange;
  }

  /**
   * An arc-shaped collision.
   * Range determines the reach and area of arc.
   * This is what could be considered a standard 180 degree slash-shape, the basic attack.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   * @returns {boolean}
   */
  collisionFrontRhombus(target, action, range, facing)
  {
    // determine whether or not the target is within range of being hit.
    const inRhombusRange = this.collisionRhombus(target, action, range);

    // if they don't even collide in the full rhombus, they won't collide in the frontrhombus.
    if (!inRhombusRange) return false;

    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // default to being infront, we always are!
    let inFront = true;

    // switch on caster's direction.
    // NOTE: this switch also ensures the action doesn't connect with targets behind it.
    switch (facing)
    {
      // infront when facing down means there should be positive Y distance.
      case J.ABS.Directions.DOWN:
        inFront = dy >= 0;
        break;
      // infront when facing left means there should be negative X distance.
      case J.ABS.Directions.LEFT:
        inFront = dx <= 0;
        break;
      // infront when facing right means there should be positive X distance.
      case J.ABS.Directions.RIGHT:
        inFront = dx >= 0;
        break;
      // infront when facing up means there should be negative Y distance.
      case J.ABS.Directions.UP:
        inFront = dy <= 0;
        break;
    }

    // determine whether or not the target is within range of being hit.
    const inRange = inRhombusRange && inFront;

    // return the result.
    return inRange;
  }

  /**
   * A wall-shaped collision.
   * Range determines how wide the wall is.
   * Typically used for hitting targets to the side of the caster.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   * @returns {boolean}
   */
  collisionWall(target, action, range, facing)
  {
    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // some wiggle room rather than being precisely 0 distance for lines.
    // TODO: accommodate a new <size:#> tag for defining width of the wall.
    const leftRightBuffer = (dx <= 0.5) && (dx >= -0.5);
    const upDownBuffer = (dy <= 0.5) && (dy >= -0.5);

    // default to not hitting.
    let inRange = false;

    switch (facing)
    {
      // when facing up or down, the Y distance should be minimal.
      case J.ABS.Directions.DOWN:
      case J.ABS.Directions.UP:
        inRange = (Math.abs(dx) <= range) && upDownBuffer;
        break;
      // when facing left or right, the X distance should be minimal.
      case J.ABS.Directions.RIGHT:
      case J.ABS.Directions.LEFT:
        inRange = (Math.abs(dy) <= range) && leftRightBuffer;
        break;
    }

    // return the result.
    return inRange;
  }

  /**
   * A cross shaped collision.
   * Range determines how far the cross reaches from the action.
   * Think bomb explosions from the game bomberman.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @returns {boolean}
   */
  collisionCross(target, action, range)
  {
    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // some wiggle room rather than being precisely 0 distance for lines.
    // TODO: accommodate a new <size:#> tag for defining width of the wall.
    const leftRightBuffer = (dx <= 0.5) && (dx >= -0.5);
    const upDownBuffer = (dy <= 0.5) && (dy >= -0.5);

    // determine if we are in vertical range.
    const inVertRange = Math.abs(dy) <= range && leftRightBuffer;

    // determine if we are in horizontal range.
    const inHorzRange = Math.abs(dx) <= range && upDownBuffer;

    // determine whether or not the target is within range of being hit.
    const inRange = inVertRange && inHorzRange;

    // return the result.
    return inRange;
  }
  //#endregion collision
  //#endregion functional

  //#region defeated target aftermath
  /**
   * Handles the defeat of a given `Game_Battler` on the map.
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  handleDefeatedTarget(target, caster)
  {
    this.predefeatHandler(target, caster);
    switch (true)
    {
      case (target.isPlayer()):
        this.handleDefeatedPlayer();
        break;
      case (target.isActor() && !target.isPlayer() && !target.isDying()):
        this.handleDefeatedAlly(target);
        break;
      case (target.isEnemy()):
        this.handleDefeatedEnemy(target, caster);
        break;
      default:
        break;
    }

    this.postDefeatHandler(target, caster);
  }

  /**
   * Handles the effects that occur before a target's defeat is processed,
   * such as "executes skill on death".
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  predefeatHandler(target, caster)
  {
    target.performPredefeatEffects(caster);
  }

  /**
   * Handles the effects that occur after a target's defeat is processed.
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  postDefeatHandler(target, caster)
  {
    target.performPostdefeatEffects(caster);
  }

  /**
   * Handles the defeat of the battler the player is currently controlling.
   */
  handleDefeatedPlayer()
  {
    this.performPartyCycling();
  }

  /**
   * Handles a non-player ally that was defeated.
   * @param {JABS_Battler} defeatedAlly The ally that was defeated.
   */
  handleDefeatedAlly(defeatedAlly)
  {
  }

  /**
   * Handles an enemy that was defeated, including dolling out exp/gold and loot drops.
   * @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
   * @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
   */
  handleDefeatedEnemy(defeatedTarget, caster)
  {
    // remove all leader/follower data the battler may have.
    defeatedTarget.clearFollowers();
    defeatedTarget.clearLeader();

    // perform the death cry if they are dunzo.
    const targetCharacter = defeatedTarget.getCharacter();
    if (!defeatedTarget.isInanimate())
    {
      SoundManager.playEnemyCollapse();
    }

    // if the defeated target is an enemy, check for death controls.
    if (defeatedTarget.hasEventActions())
    {
      targetCharacter.start();
    }

    // if the caster is player/actor, gain aftermath.
    if (caster && caster.isActor())
    {
      const targetBattler = defeatedTarget.getBattler();
      this.gainBasicRewards(targetBattler, caster);
      this.createLootDrops(defeatedTarget, caster);
    }

    // remove the target's character from the map.
    defeatedTarget.setDying(true);
  }

  /**
   * Grants experience/gold/loot rewards to the battler that defeated the target.
   * If the level scaling plugin is available, both experience and gold are scaled.
   * @param {Game_Enemy} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  gainBasicRewards(enemy, actor)
  {
    let experience = enemy.exp();
    let gold = enemy.gold();
    const actorCharacter = actor.getCharacter();

    const levelMultiplier = this.getRewardScalingMultiplier(enemy, actor);
    experience = Math.ceil(experience * levelMultiplier);
    gold = Math.ceil(gold * levelMultiplier);

    this.gainExperienceReward(experience, actorCharacter);
    this.gainGoldReward(gold, actorCharacter);
    this.createRewardsLog(experience, gold, actor);
  }

  /**
   * Gets the multiplier based on difference in level between attacker and
   * target to determine if the battle was "too easy" or "very hard", resulting
   * in reduced or increased numeric rewards (excludes loot drops).
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  getRewardScalingMultiplier(enemy, actor)
  {
    // default the multiplier to 1x.
    let multiplier = 1.0;

    // check if we are using the level scaling functionality.
    if (J.LEVEL && J.LEVEL.Metadata.Enabled)
    {
      // calculate the multiplier using scaling based on enemy and actor.
      // if the enemy is higher, then the rewards will be greater.
      // if the actor is higher, then the rewards will be lesser.
      multiplier = LevelScaling.multiplier(enemy.level, actor.getBattler().level);
    }

    // return the findings.
    return multiplier;
  }

  /**
   * Gains experience from battle rewards.
   * @param {number} experience The experience to be gained as a reward.
   * @param {Game_Character} casterCharacter The character who defeated the target.
   */
  gainExperienceReward(experience, casterCharacter)
  {
    // don't do anything if the enemy didn't grant any experience.
    if (!experience) return;

    const activeParty = $gameParty.battleMembers();
    activeParty.forEach(member =>
    {
      const gainedExperience = experience * member.exr;
      member.gainExp(gainedExperience);
    });

    // generate the text popup for the experience earned.
    this.generatePopExperience(experience, casterCharacter);
  }

  /**
   * Generates a popup for experience earned.
   * @param {number} amount The amount in the popup.
   * @param {Game_Character} character The character the popup is on.
   */
  generatePopExperience(amount, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const expPop = this.configureExperiencePop(amount);

    // add the pop to the target's tracking.
    character.addTextPop(expPop);
    character.setRequestTextPop();
  }

  /**
   * Creates the text pop of the experienced gained.
   * @param {number} exp The amount of experience gained.
   * @returns {Map_TextPop}
   */
  configureExperiencePop(exp)
  {
    // round the experience we've acquired if it is a decimal.
    const experienceGained = Math.round(exp);

    // build the popup.
    return new TextPopBuilder(experienceGained)
      .isExperience()
      .build();
  }

  /**
   * Gains gold from battle rewards.
   * @param {number} gold The gold to be gained as a reward.
   * @param {Game_Character} character The character who defeated the target.
   */
  gainGoldReward(gold, character)
  {
    // don't do anything if the enemy didn't grant any gold.
    if (!gold) return;

    // actually gain the gold.
    $gameParty.gainGold(gold);

    // generate the text popup for the gold found.
    this.generatePopGold(gold, character);
  }

  /**
   * Generates a popup for gold found.
   * @param {number} amount The amount in the popup.
   * @param {Game_Character} character The character the popup is on.
   */
  generatePopGold(amount, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const goldPop = this.configureGoldPop(amount);

    // add the pop to the target's tracking.
    character.addTextPop(goldPop);
    character.setRequestTextPop();
  }

  /**
   * Creates the text pop of the gold gained.
   * @param {number} gold The amount of gold gained.
   */
  configureGoldPop(gold)
  {
    // round the gold we've acquired if it is a decimal.
    const goldGained = Math.round(gold);

    // build the popup.
    return new TextPopBuilder(goldGained)
      .isGold()
      .build();
  }

  /**
   * Create a log entry for both experience earned and gold dropped.
   * @param {number} experience The amount of experience gained.
   * @param {number} gold The gold to be gained as a reward.
   * @param {JABS_Battler} caster The ally gaining the experience and gold.
   */
  createRewardsLog(experience, gold, caster)
  {
    if (!J.LOG) return;

    if (experience !== 0)
    {
      const expLog = new MapLogBuilder()
        .setupExperienceGained(caster.getReferenceData().name, experience)
        .build();
      $gameTextLog.addLog(expLog);
    }

    if (gold !== 0)
    {
      const goldLog = new MapLogBuilder()
        .setupGoldFound(gold)
        .build();
      $gameTextLog.addLog(goldLog);
    }
  }

  /**
   * Create all drops for a defeated enemy and gain them.
   * @param {JABS_Battler} target The enemy dropping the loot.
   * @param {JABS_Battler} caster The ally that defeated the enemy.
   */
  createLootDrops(target, caster)
  {
    // actors don't drop loot.
    if (target.isActor()) return;

    // if we have no drops, don't bother.
    const items = target.getBattler().makeDropItems();
    if (items.length === 0) return;

    items.forEach(item => this.addLootDropToMap(target.getX(), target.getY(), item));
  }

  /**
   * Creates a log for an item earned as a loot drop from an enemy.
   * @param {object} item The reference data for the item loot that was picked up.
   */
  createLootLog(item)
  {
    if (!J.LOG) return;

    let lootType = String.empty;
    if (item.atypeId)
    {
      lootType = "armor";
    }
    else if (item.wtypeId)
    {
      lootType = "weapon";
    }
    else if (item.itypeId)
    {
      lootType = "item";
    }

    // the player is always going to be the one collecting the loot- for now.
    const lootLog = new MapLogBuilder()
      .setupLootObtained(this.getPlayer1().getReferenceData().name, lootType, item.id)
      .build();
    $gameTextLog.addLog(lootLog);
  }

  /**
   * Generates popups for a pile of items picked up at the same time.
   * @param {RPG_BaseItem[]} itemDataList All items picked up.
   * @param {Game_Character} character The character displaying the popups.
   */
  generatePopItemBulk(itemDataList, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // iterate over all loot.
    itemDataList.forEach((itemData, index) =>
    {
      // generate a pop that moves based on index.
      this.generatePopItem(itemData, character, 64+(index*24));
    }, this);

    // flag the character for processing pops.
    character.setRequestTextPop();
  }

  /**
   * Generates a popup for an acquired item.
   *
   * NOTE:
   * This is used from within the `generatePopItemBulk()`!
   * Use that instead of this!
   * @param {RPG_BaseItem} itemData The item's database object.
   * @param {Game_Character} character The character displaying the popup.
   * @param {number} y The y coordiante for this item pop.
   */
  generatePopItem(itemData, character, y)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const lootPop = this.configureItemPop(itemData, y);

    // add the pop to the target's tracking.
    character.addTextPop(lootPop);
  }

  /**
   * Creates the text pop of the acquired item.
   * @param {RPG_BaseItem} itemData The item's database object.
   * @param {number} y The y coordiante for this item pop.
   */
  configureItemPop(itemData, y)
  {
    // build the popup.
    return new TextPopBuilder(itemData.name)
      .isLoot(y)
      .setIconIndex(itemData.iconIndex)
      .build();
  }

  /**
   * Handles a level up for the leader while on the map.
   * @param {string} uuid The uuid of the battler leveling up.
   */
  battlerLevelup(uuid)
  {
    const battler = $gameMap.getBattlerByUuid(uuid);
    if (battler)
    {
      const character = battler.getCharacter();
      this.playLevelUpAnimation(character);
      this.generatePopLevelUp(character);
      this.createLevelUpLog(battler);
    }
  }

  /**
   * Creates a text pop of the level up.
   * @param {Game_Character} character The character to show the popup on.
   */
  generatePopLevelUp(character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const levelUpPop = this.configureLevelUpPop();

    // add the pop to the target's tracking.
    character.addTextPop(levelUpPop);
    character.setRequestTextPop();
  }

  /**
   * Configures the level up text pop.
   * @returns {Map_TextPop}
   */
  configureLevelUpPop()
  {
    // build the popup.
    return new TextPopBuilder(`LEVEL UP`)
      .isLevelUp()
      .build();
  }

  /**
   * Creates a level up log for the given battler.
   * @param {JABS_Battler} jabsBattler The given JABS battler.
   */
  createLevelUpLog(jabsBattler)
  {
    if (!J.LOG) return;

    const battler = jabsBattler.getBattler();
    const log = this.configureLevelUpLog(battler.name(), battler.level);
    $gameTextLog.addLog(log);
  }

  /**
   * Configures the log for the actor reaching a new level.
   * @param {string} targetName The name of the battler leveling up.
   * @param {number} newLevel The level being reached.
   * @returns {Map_Log}
   */
  configureLevelUpLog(targetName, newLevel)
  {
    return new MapLogBuilder()
      .setupLevelUp(targetName, newLevel)
      .build();
  }

  /**
   * Plays the level up animation on the character.
   * @param {Game_Character} character The player's `Game_Character`.
   */
  playLevelUpAnimation(character)
  {
    character.requestAnimation(49);
  }

  /**
   * Handles a skill being learned for a battler while on the map.
   * @param {RPG_Skill} skill The skill being learned.
   * @param {string} uuid The uuid of the battler leveling up.
   */
  battlerSkillLearn(skill, uuid)
  {
    const battler = $gameMap.getBattlerByUuid(uuid);
    if (battler)
    {
      const character = battler.getCharacter();
      this.generatePopSkillLearn(skill, character);
      this.createSkillLearnLog(skill, battler);
    }
  }

  /**
   * Creates a text pop of the skill being learned.
   * @param {RPG_Skill} skill The skill being learned.
   * @param {Game_Character} character The character to show the popup on.
   */
  generatePopSkillLearn(skill, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const skillLearnPop = this.configureSkillLearnPop(skill);

    // add the pop to the target's tracking.
    character.addTextPop(skillLearnPop);
    character.setRequestTextPop();
  }

  /**
   * Configures the popup for a skill learned.
   * @param {RPG_Skill} skill The skill learned.
   * @returns {Map_TextPop}
   */
  configureSkillLearnPop(skill)
  {
    return new TextPopBuilder(skill.name)
      .isSkillLearned(skill.iconIndex)
      .build();
  }

  /**
   * Creates a skill learning log for the player.
   * @param {RPG_Skill} skill The skill being learned.
   * @param {JABS_Battler} player The player's `JABS_Battler`.
   */
  createSkillLearnLog(skill, player)
  {
    if (!J.LOG) return;

    const log = this.configureSkillLearnLog(player.getReferenceData().name, skill.id);
    $gameTextLog.addLog(log);
  }

  /**
   * Configures the log for the skill learned.
   * @param {string} targetName The name of the target learning the skill.
   * @param {number} learnedSkillId The id of the skill learned.
   * @returns {Map_Log}
   */
  configureSkillLearnLog(targetName, learnedSkillId)
  {
    return new MapLogBuilder()
      .setupSkillLearn(targetName, learnedSkillId)
      .build();
  }

//#endregion defeated target aftermath
}
//#endregion JABS_Engine

//#region JABS_GuardData
/**
 * A class responsible for managing the data revolving around guarding and parrying.
 */
class JABS_GuardData
{
  /**
   * @constructor
   * @param {number} skillId The skill this guard data is associated with.
   * @param {number} flatGuardReduction The flat amount of damage reduced when guarding, if any.
   * @param {number} percGuardReduction The percent amount of damage mitigated when guarding, if any.
   * @param {number[]} counterGuardIds The skill id to counter with when guarding, if any.
   * @param {number[]} counterParryIds The skill ids to counter with when precise-parrying, if any.
   * @param {number} parryDuration The duration of which a precise-parry is available, if any.
   */
  constructor(
    skillId,
    flatGuardReduction,
    percGuardReduction,
    counterGuardIds,
    counterParryIds,
    parryDuration)
  {
    /**
     * The skill this guard data is associated with.
     * @type {number}
     */
    this.skillId = skillId;

    /**
     * The flat amount of damage reduced when guarding, if any.
     * @type {number}
     */
    this.flatGuardReduction = flatGuardReduction;

    /**
     * The percent amount of damage mitigated when guarding, if any.
     * @type {number}
     */
    this.percGuardReduction = percGuardReduction;

    /**
     * The skill ids to counter with when guarding, if any.
     * @type {number[]}
     */
    this.counterGuardIds = counterGuardIds;

    /**
     * The skill ids to counter with when precise-parrying, if any.
     * @type {number[]}
     */
    this.counterParryIds = counterParryIds;

    /**
     * The duration of which a precise-parry is available, if any.
     * @type {number}
     */
    this.parryDuration = parryDuration;
  }

  /**
   * Gets whether or not this guard data includes the ability to guard at all.
   * @returns {boolean}
   */
  canGuard()
  {
    return !!(this.flatGuardReduction || this.percGuardReduction);
  }

  /**
   * Gets whether or not this guard data includes the ability to precise-parry.
   * @returns {boolean}
   */
  canParry()
  {
    return this.parryDuration > 0;
  }

  /**
   * Gets whether or not this guard data enables countering of any kind.
   * This is defined as "has at least one counterguard or counterparry skill id".
   * @returns {boolean}
   */
  canCounter()
  {
    return !!(this.counterGuardIds.length || this.counterParryIds.length);
  }
}
//#endregion JABS_GuardData

//#region JABS_InputAdapter
/**
 * This static class governs the instructions of what to do regarding input.
 * Inputs are received by the JABS_InputController.
 * Inputs are sent from JABS_InputController to the JABS_InputAdapter.
 * The JABS_InputAdapter contains the instructions for what to do with inputs.
 */
class JABS_InputAdapter
{
  /**
   * A collection of registered controllers.
   * @type {JABS_InputController|any}
   */
  static controllers = [];

  /**
   * Constructor.
   * A static class though, so don't try to instantiate this.
   */
  constructor()
  {
    throw new Error('JABS_InputAdapter is a static class.')
  }

  /**
   * Registers a controller with this input adapter.
   * @param {JABS_InputController|any} controller The controller to register.
   */
  static register(controller)
  {
    this.controllers.push(controller);
  }

  /**
   * Checks whether or not any controllers have been registered
   * with this input adapter.
   * @returns {boolean} True if we have at least one registered controller, false otherwise.
   */
  static hasControllers()
  {
    return this.controllers.length > 0;
  }

  /**
   * Executes an action on the map based on the mainhand skill slot.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performMainhandAction(jabsBattler)
  {
    // if the mainhand action isn't ready, then do not perform.
    if (!this.#canPerformMainhandAction(jabsBattler)) return;

    // get all actions associated with the mainhand.
    const actions = jabsBattler.getAttackData(JABS_Button.Mainhand);

    // apply the cooldown type to the appropriate slot.
    actions.forEach(action => action.setCooldownType(JABS_Button.Mainhand));

    // set the player's pending actions action to this skill.
    jabsBattler.setDecidedAction(actions);

    // set the cast time for this battler to the primary skill in the list.
    jabsBattler.setCastCountdown(actions[0].getCastTime());

    // reset the combo data now that we are executing the actions.
    jabsBattler.resetComboData(JABS_Button.Mainhand);
  }

  /**
   * Determines whether or not the player can execute the mainhand action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformMainhandAction(jabsBattler)
  {
    // do not perform actions if there is pedestrians infront of you!
    if ($gameMap.hasInteractableEventInFront(jabsBattler)) return false;

    // if the battler can't use attacks, then do not perform.
    if (!jabsBattler.canBattlerUseAttacks()) return false;

    // if the mainhand action isn't ready, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Mainhand)) return false;

    // get all actions associated with the mainhand.
    const actions = jabsBattler.getAttackData(JABS_Button.Mainhand);

    // if there are none, then do not perform.
    if (!actions || !actions.length) return false;

    // if the player is casting, then do not perform.
    if (jabsBattler.isCasting()) return false;

    // perform!
    return true;
  }

  /**
   * Executes an action on the map based on the offhand skill slot.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performOffhandAction(jabsBattler)
  {
    // if the offhand action isn't ready, then do not perform.
    if (!this.#canPerformOffhandAction(jabsBattler)) return;

    // get all actions associated with the offhand.
    const actions = jabsBattler.getAttackData(JABS_Button.Offhand);

    // apply the cooldown type to the appropriate slot.
    actions.forEach(action => action.setCooldownType(JABS_Button.Offhand));

    // set the player's pending actions action to this skill.
    jabsBattler.setDecidedAction(actions);

    // set the cast time for this battler to the primary skill in the list.
    jabsBattler.setCastCountdown(actions[0].getCastTime());

    // reset the combo data now that we are executing the actions.
    jabsBattler.resetComboData(JABS_Button.Offhand);
  }

  /**
   * Determines whether or not the player can execute the offhand action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformOffhandAction(jabsBattler)
  {
    // if the offhand skill is actually a guard skill, then do not perform.
    if (jabsBattler.isGuardSkillByKey(JABS_Button.Offhand)) return false;

    // do not perform actions if there is pedestrians infront of you!
    if ($gameMap.hasInteractableEventInFront(jabsBattler)) return false;

    // if the battler can't use attacks, then do not perform.
    if (!jabsBattler.canBattlerUseAttacks()) return false;

    // if the offhand action isn't ready, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Offhand)) return false;

    // get all actions associated with the offhand.
    const actions = jabsBattler.getAttackData(JABS_Button.Offhand);

    // if there are none, then do not perform.
    if (!actions || !actions.length) return false;

    // if the player is casting, then do not perform.
    if (jabsBattler.isCasting()) return false;

    // perform!
    return true;
  }

  /**
   * Begins the execution of a tool.
   * Depending on the equipped tool, this can perform a variety of types of actions.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performToolAction(jabsBattler)
  {
    // if the tool action isn't ready, then do not perform.
    if (!this.#canPerformToolAction(jabsBattler)) return;

    // grab the tool id currently equipped.
    const toolId = jabsBattler.getBattler().getEquippedSkill(JABS_Button.Tool);

    // perform tool effects!
    jabsBattler.applyToolEffects(toolId);
  }

  /**
   * Determines whether or not the player can execute the tool action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformToolAction(jabsBattler)
  {
    // if the tool is not off cooldown, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Tool)) return false;

    // if there is no tool equipped, then do not perform.
    if (!jabsBattler.getBattler().getEquippedSkill(JABS_Button.Tool)) return false;

    // perform!
    return true;
  }

  /**
   * Executes the dodge action.
   * The player will perform some sort of mobility action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performDodgeAction(jabsBattler)
  {
    // check if we can dodge.
    if (!this.#canPerformDodge(jabsBattler)) return;

    // perform the dodge skill.
    jabsBattler.tryDodgeSkill();
  }

  /**
   * Determines whether or not the player can perform a dodge skill.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformDodge(jabsBattler)
  {
    // if the dodge skill is not off cooldown, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Dodge)) return false;

    // if the player is unable to move for some reason, do not perform.
    if (!jabsBattler.canBattlerMove()) return false;

    // perform!
    return true;
  }

  /**
   * Begins execution of a skill based on any of the L1 + ABXY skill slots.
   * @param {number} slot The slot associated with the combat action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performCombatAction(slot, jabsBattler)
  {
    // if the offhand action isn't ready, then do not perform.
    if (!this.#canPerformCombatActionBySlot(slot, jabsBattler)) return;

    // get all actions associated with the offhand.
    const actions = jabsBattler.getAttackData(slot);

    // set the player's pending actions action to this skill.
    jabsBattler.setDecidedAction(actions);

    // set the cast time for this battler to the primary skill in the list.
    jabsBattler.setCastCountdown(actions[0].getCastTime());
  }

  /**
   * Determines whether or not the player can execute the combat action.
   * @param {string} slot The slot to check if is able to be used.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformCombatActionBySlot(slot, jabsBattler)
  {
    // if the battler can't use attacks, then do not perform.
    if (!jabsBattler.canBattlerUseSkills()) return false;

    // if the slot is empty, then do not perform.
    if (jabsBattler.getBattler().getSkillSlot(slot).isEmpty()) return false;

    // if the offhand action isn't ready, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(slot)) return false;

    // if the battler is already casting, then do not perform.
    if (jabsBattler.isCasting()) return false;

    // if there is no action data for the skill, then do not perform.
    if (jabsBattler.getAttackData(slot).length === 0) return false;

    // perform!
    return true;
  }

  /**
   * Executes the strafe action.
   * The player will not change the direction they are facing while strafing is active.
   * @param {boolean} strafing True if the player is strafing, false otherwise.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performStrafe(strafing, jabsBattler)
  {
    // check if we can strafe.
    if (!this.#canPerformStrafe(jabsBattler)) return;

    // perform the strafe.
    jabsBattler.getCharacter().setDirectionFix(strafing);
  }

  /**
   * Determines whether or not the player can strafe and hold direction while moving.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformStrafe(jabsBattler)
  {
    return true;
  }

  /**
   * Executes the rotation action.
   * The player will not change move while rotation is active.
   * @param {boolean} rotating True if the player is rotating, false otherwise.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performRotate(rotating, jabsBattler)
  {
    // check if we can rotate.
    if (!this.#canPerformRotate(jabsBattler)) return;

    // perform the rotation.
    jabsBattler.setMovementLock(rotating);
  }

  /**
   * Determines whether or not the player can rotate in-place without movement.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformRotate(jabsBattler)
  {
    return true;
  }

  /**
   * Executes the guard action.
   * The player will only perform the guard action if the offhand slot is a guard-ready skill.
   * @param {boolean} guarding True if the player is guarding, false otherwise.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performGuard(guarding, jabsBattler)
  {
    // check if we can guard with the offhand slot.
    if (!this.#canPerformGuardBySlot(JABS_Button.Offhand, jabsBattler)) return;

    // perform the guard skill in the offhand slot.
    jabsBattler.executeGuard(guarding, JABS_Button.Offhand);
  }

  /**
   * Determines whether or not the player can guard.
   * @param {string} slot The slot to check if is able to be used.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformGuardBySlot(slot, jabsBattler)
  {
    // if the offhand slot is not a guard skill, then do not perform.
    if (!jabsBattler.isGuardSkillByKey(slot)) return false;

    // perform!
    return true;
  }

  /**
   * Rotates the leader out to the back and pulls in the next-in-line.
   *
   * NOTE:
   * The logic of party cycling remains in the engine for exposure.
   */
  static performPartyCycling(force = false)
  {
    // check if we can party cycle.
    if (!this.#canPerformPartyCycling(force)) return;

    // execute the party cycling.
    $jabsEngine.performPartyCycling(force);
  }

  /**
   * Determines whether or not the player can party cycle.
   * @param {boolean} force Using `force` overrides party-cycle-lock.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformPartyCycling(force)
  {
    // if rotating is disabled, then skip- forced cycling bypasses this check.
    if (!$gameParty.canPartyCycle() && !force) return false;

    // you can't rotate if there is no party to rotate through.
    if ($gameParty._actors.length === 1) return false;

    // cycle!
    return true;
  }

  /**
   * Calls the JABS quick menu on the map.
   */
  static performMenuAction()
  {
    // if we cannot call the menu, then do not.
    if (!this.#canPerformMenuAction()) return;

    // pause JABS.
    $jabsEngine.absPause = true;

    // request the menu.
    $jabsEngine.requestAbsMenu = true;
  }

  /**
   * Determines whether or not we can call the menu.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformMenuAction()
  {
    // there are currently no conditions for accessing the JABS menu.
    return true;
  }
}
//#endregion JABS_InputAdapter

//#region JABS_LootDrop
/**
 * An object that represents the binding of a `Game_Event` to an item/weapon/armor.
 */
class JABS_LootDrop
{
  constructor(object)
  {
    this._lootObject = object;
    this.initMembers();
  }

  /**
   * Initializes properties of this object that don't require parameters.
   */
  initMembers()
  {
    /**
     * The duration that this loot drop will exist on the map.
     * @type {number}
     */
    this._duration = 900;

    /**
     * Whether or not this loot drop can expire.
     * @type {boolean}
     */
    this._canExpire = true;

    /**
     * The universally unique identifier for this loot drop.
     * @type {string}
     */
    this._uuid = J.BASE.Helpers.generateUuid();
  }

  /**
   * Gets the `uuid` of this loot drop.
   * @returns {string}
   */
  get uuid()
  {
    return this._uuid;
  }

  /**
   * Sets the `uuid` to the new value.
   * This overwrites the default-generated `uuid`.
   * @param {string} newUuid The new `uuid`.
   */
  set uuid(newUuid)
  {
    this._uuid = newUuid;
  }

  /**
   * Gets the duration remaining on this loot drop.
   * @returns {number}
   */
  get duration()
  {
    return this._duration;
  }

  /**
   * Sets the duration for this loot drop.
   */
  set duration(newDuration)
  {
    if (newDuration === -1)
    {
      this._canExpire = false;
    }

    this._duration = newDuration;
  }

  /**
   * Whether or not this loot drop's duration is expired.
   * If the loot cannot expire, this will always return false, regardless of duration.
   * @returns {boolean}
   */
  get expired()
  {
    if (!this._canExpire) return false;

    return this._duration <= 0;
  }

  /**
   * Counts down the duration for this loot drop.
   */
  countdownDuration()
  {
    if (!this._canExpire || this._duration <= 0) return;

    this._duration--;
  }

  /**
   * Gets the underlying loot object.
   * @returns {RPG_BaseItem}
   */
  get lootData()
  {
    return this._lootObject;
  }

  /**
   * Gets the `iconIndex` for the underlying loot object.
   * @returns {number}
   */
  get lootIcon()
  {
    return this._lootObject.iconIndex;
  }

  /**
   * Gets whether or not this loot should be automatically consumed on pickup.
   * @returns {boolean}
   */
  get useOnPickup()
  {
    return this._lootObject.jabsUseOnPickup ?? false;
  }
}
//#endregion JABS_LootDrop

//#region JABS_OnChanceEffect
/**
 * A class defining the structure of an on-death skill, either for ally or enemy.
 */
class JABS_OnChanceEffect
{
  constructor(skillId, chance, key)
  {
    this.skillId = skillId;
    this.chance = chance;
    this.key = key;
  }

  /**
   * Gets the underlying skill.
   * @returns {RPG_Skill}
   */
  baseSkill()
  {
    return $dataSkills[this.skillId];
  }

  /**
   * Gets whether or not the skill this chance is associated with should cast from the
   * target instead of the user.
   * @returns {boolean}
   */
  appearOnTarget()
  {
    const skill = this.baseSkill();
    return !!skill.meta["onDefeatedTarget"];
  }

  /**
   * Dances with RNG to determine if this onChanceEffect was successful or not.
   * @param {number=} rollForPositive The number of times to try for success; defaults to 1.
   * @param {number=} rollForNegative The number of times to try and undo success; defaults to 0.
   * @returns {boolean} True if this effect should proc, false otherwise.
   */
  shouldTrigger(rollForPositive = 1, rollForNegative = 0)
  {
    // default fail.
    let success = false;

    // keep rolling for positive while we have positive rolls and aren't already successful.
    while (rollForPositive && !success)
    {
      // roll for effect!
      const chance = Math.randomInt(100) + 1;

      // check if the roll meets the chance criteria.
      if (chance <= this.chance)
      {
        // flag for success!
        success = true;
      }

      // decrement the positive roll counter.
      rollForPositive--;
    }

    // if successful and we have negative rerolls, lets get fight RNG for success!
    if (success && rollForNegative)
    {
      // keep rolling for negative while we have negative rerolls and are still successful.
      while (rollForNegative && success)
      {
        // check if the roll meets the chance criteria.
        if (chance <= this.chance)
        {
          // we keep our flag! (this time...)
          success = true;
        }
        // we didn't meet the chance criteria this time.
        else
        {
          // undo our success :(
          success = false;
        }

        // decrement the negative reroll counter.
        rollForNegative--;
      }
    }

    // return our successes (or failure).
    return success;
  }
}
//#endregion JABS_OnChanceEffect

//#region JABS_SkillSlot
/**
 * This class represents a single skill slot handled by the skill slot manager.
 */
function JABS_SkillSlot()
{
  this.initialize(...arguments);
}

JABS_SkillSlot.prototype = {};
JABS_SkillSlot.prototype.constructor = JABS_SkillSlot;

/**
 * Initializes this class. Executed when this class is instantiated.
 */
JABS_SkillSlot.prototype.initialize = function(key, skillId)
{
  /**
   * The key of this skill slot.
   *
   * Maps 1:1 to one of the possible skill slot button combinations.
   * @type {string}
   */
  this.key = key;

  /**
   * The id of the skill.
   *
   * Set to 0 when a skill is not equipped in this slot.
   * @type {number}
   */
  this.id = skillId;

  // initialize the rest of the members.
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlot.prototype.initMembers = function()
{
  /**
   * The combo id that comes after the current id; default is 0.
   * @type {number}
   */
  this.comboId = 0;

  /**
   * The cooldown associated with this slot.
   * @type {JABS_Cooldown}
   */
  this.cooldown = new JABS_Cooldown(this.key);

  /**
   * Whether or not this skill slot is locked.
   *
   * Locked slots cannot be changed until unlocked.
   * @type {boolean}
   */
  this.locked = false;

  // initialize the refreshes.
  this.initVisualRefreshes();
};

//#region refreshes
/**
 * Initializes the various visual refreshes.
 */
JABS_SkillSlot.prototype.initVisualRefreshes = function()
{
  /**
   * Whether or not this skill slot's name needs refreshing.
   * @type {boolean}
   */
  this.needsNameRefresh = true;

  /**
   * Whether or not this skill slot's item cost needs refreshing.
   * @type {boolean}
   */
  this.needsItemCostRefresh = true;

  /**
   * Whether or not this skill slot's hp cost needs refreshing.
   * @type {boolean}
   */
  this.needsHpCostRefresh = true;

  /**
   * Whether or not this skill slot's mp cost needs refreshing.
   * @type {boolean}
   */
  this.needsMpCostRefresh = true;


  /**
   * Whether or not this skill slot's tp cost needs refreshing.
   * @type {boolean}
   */
  this.needsTpCostRefresh = true;


  /**
   * Whether or not this skill slot's icon needs refreshing.
   * @type {boolean}
   */
  this.needsIconRefresh = true;
};

/**
 * Flags this skillslot to need a visual refresh for the HUD.
 */
JABS_SkillSlot.prototype.flagSkillSlotForRefresh = function()
{
  this.needsNameRefresh = true;
  this.needsHpCostRefresh = true;
  this.needsMpCostRefresh = true;
  this.needsTpCostRefresh = true;
  this.needsItemCostRefresh = true;
  this.needsIconRefresh = true;
};

/**
 * Checks whether or not this skillslot's name is in need of a visual refresh.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.needsVisualNameRefresh = function()
{
  return this.needsNameRefresh;
};

/**
 * Acknowledges that this skillslot's name was visually refreshed.
 */
JABS_SkillSlot.prototype.acknowledgeNameRefresh = function()
{
  this.needsNameRefresh = false;
};

/**
 * Checks whether or not this skillslot's item cost is in need of a visual refresh by type.
 * @param {Sprite_SkillCost.Types} costType
 * @returns {boolean} True if the given type
 */
JABS_SkillSlot.prototype.needsVisualCostRefreshByType = function(costType)
{
  switch (costType)
  {
    case (Sprite_SkillCost.Types.HP):
      return this.needsHpCostRefresh;
    case (Sprite_SkillCost.Types.MP):
      return this.needsMpCostRefresh;
    case (Sprite_SkillCost.Types.TP):
      return this.needsTpCostRefresh;
    case (Sprite_SkillCost.Types.Item):
      return this.needsItemCostRefresh;
  }

  console.warn(`attempted to request a refresh of type: ${costType}, but it isn't implemented.`);
  return false;
};

/**
 * Acknowledges that this skillslot's item cost was visually refreshed.
 */
JABS_SkillSlot.prototype.acknowledgeCostRefreshByType = function(costType)
{
  switch (costType)
  {
    case (Sprite_SkillCost.Types.HP):
      this.needsHpCostRefresh = false;
      break;
    case (Sprite_SkillCost.Types.MP):
      this.needsMpCostRefresh = false;
      break;
    case (Sprite_SkillCost.Types.TP):
      this.needsTpCostRefresh = false;
      break;
    case (Sprite_SkillCost.Types.Item):
      this.needsItemCostRefresh = false;
      break;
    default:
      console.warn(`attempted to acknowledge a refresh of type: ${costType}, but it isn't implemented.`);
      break;
  }
};

/**
 * Checks whether or not this skillslot's icon is in need of a visual refresh.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.needsVisualIconRefresh = function()
{
  return this.needsIconRefresh;
};

/**
 * Acknowledges that this skillslot's icon was visually refreshed.
 */
JABS_SkillSlot.prototype.acknowledgeIconRefresh = function()
{
  this.needsIconRefresh = false;
};
//#endregion refreshes

/**
 * Gets the cooldown associated with this skill slot.
 * @returns {JABS_Cooldown}
 */
JABS_SkillSlot.prototype.getCooldown = function()
{
  return this.cooldown;
};

/**
 * Updates the cooldown for this skill slot.
 */
JABS_SkillSlot.prototype.updateCooldown = function()
{
  // update the cooldown.
  this.getCooldown().update();

  // handle the need to clear the combo id from this slot.
  this.handleComboReadiness();
};

/**
 * Determines readiness for combos based on cooldowns.
 */
JABS_SkillSlot.prototype.handleComboReadiness = function()
{
  // grab this slot's cooldown.
  const cooldown = this.getCooldown();

  // check if we need to clear the combo id.
  if (cooldown.needsComboClear())
  {
    // otherwise, reset the combo id for this slot.
    this.resetCombo();

    // let the cooldown know we did the deed.
    cooldown.acknowledgeComboClear();
  }
};

/**
 * An event hook fired when this skill slot changes in some way.
 */
JABS_SkillSlot.prototype.onChange = function()
{
  // flags the slot for visual refresh.
  this.flagSkillSlotForRefresh();
};

/**
 * Resets the combo id for this slot.
 */
JABS_SkillSlot.prototype.resetCombo = function()
{
  // reset the combo id to 0, forcing use of the main id.
  this.setComboId(0);

  // perform the on-change event hook.
  this.onChange();
};

/**
 * Gets the next combo skill id for this skill slot.
 * @returns {number}
 */
JABS_SkillSlot.prototype.getComboId = function()
{
  return this.comboId;
};

/**
 * Sets the next combo skill id for this skill slot.
 * @param {number} skillId The new skill id that is next in the combo.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.setComboId = function(skillId)
{
  // initialize change to false.
  let changed = false;

  // check if the combo id is being changed.
  if (skillId !== this.comboId)
  {
    // it was changed.
    changed = true;
  }

  // update the combo id.
  this.comboId = skillId;

  // check if the slot had a change.
  if (changed)
  {
    // perform the on-change event hook.
    this.onChange();
  }

  // return this for fluent-chaining.
  return this;
};

/**
 * Gets whether or not this slot has anything assigned to it.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isUsable = function()
{
  return this.id > 0;
};

/**
 * Gets whether or not this slot is empty.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isEmpty = function()
{
  return this.id === 0;
};

/**
 * Gets whether or not this slot belongs to the tool slot.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isItem = function()
{
  return this.key === JABS_Button.Tool;
};

/**
 * Gets whether or not this slot belongs to a skill slot.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isSkill = function()
{
  return this.key !== JABS_Button.Tool;
};

/**
 * Checks whether or not this is a "primary" slot making up the base functions
 * that this actor can perform on the field.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isPrimarySlot = function()
{
  const slots = [
    JABS_Button.Mainhand,
    JABS_Button.Offhand,
    JABS_Button.Tool,
    JABS_Button.Dodge
  ];

  return slots.includes(this.key);
};

/**
 * Checks whether or not this is a "secondary" slot making up the optional and
 * flexible functions this actor can perform on the field.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isSecondarySlot = function()
{
  const slots = [
    JABS_Button.CombatSkill1,
    JABS_Button.CombatSkill2,
    JABS_Button.CombatSkill3,
    JABS_Button.CombatSkill4,
  ];

  return slots.includes(this.key);
};

/**
 * Sets a new skill id to this slot.
 *
 * Slot cannot be assigned if it is locked.
 * @param {number} skillId The new skill id to assign to this slot.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.setSkillId = function(skillId)
{
  if (this.isLocked())
  {
    console.warn("This slot is currently locked.");
    SoundManager.playBuzzer();
    return this;
  }

  // assign the new skill id.
  this.id = skillId;

  // no change check, always perform the on-change event hook.
  this.onChange();

  // return this for fluent-chaining.
  return this;
};

/**
 * Sets whether or not this slot is locked.
 * @param {boolean} locked Whether or not this slot is locked.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.setLock = function(locked)
{
  if (!this.canBeLocked())
  {
    this.locked = locked;
  }

  return this;
};

/**
 * Gets whether or not this slot can be locked.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.canBeLocked = function()
{
  const lockproofSlots = [
    JABS_Button.Mainhand,
    JABS_Button.Offhand
  ];

  return !lockproofSlots.includes(this.key);
};

/**
 * Locks this slot, preventing changing of skill assignment.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.lock = function()
{
  this.setLock(true);
  return this;
};

/**
 * Unlocks this slot.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.unlock = function()
{
  this.setLock(false);
  return this;
};

/**
 * Gets whether or not this slot is locked.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isLocked = function()
{
  return this.locked;
};

/**
 * Gets the underlying data for this slot.
 * Supports retrieving combo skills via targetId.
 * Supports skill extended data via J-SkillExtend.
 * @param {Game_Actor|null} user The user to get extended skill data for.
 * @param {number|null} targetId The target id to get skill data for.
 * @returns {RPG_UsableItem|RPG_Skill|null}
 */
JABS_SkillSlot.prototype.data = function(user = null, targetId = this.id)
{
  // if this slot is empty, then return null.
  if (this.isEmpty()) return null;

  // check if this slot is an item.
  if (this.isItem())
  {
    // return the corresponding item.
    return $dataItems[targetId];
  }

  // check if we're using the skill extension plugin and have a user.
  if (user)
  {
    // grab the combo id in this slot.
    const comboId = this.getComboId();

    // check first if we have a valid combo id.
    if (comboId)
    {
      // nice find! return the combo id version of the skill instead.
      return user.skill(comboId);
    }

    // otherwise, return the target id.
    return user.skill(targetId);
  }

  // all else fails... just return the database data for the skill.
  return $dataSkills[targetId];
};

/**
 * Returns this slot to skill id 0 and unlocks it.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.clear = function()
{
  this.unlock();
  this.setSkillId(0);
  return this;
};

/**
 * Clears this slot in the context of "releasing unequippable skills".
 * Skills that are mainhand/offhand/tool will not be automatically removed.
 * Skills that are locked will not be automatically removed.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.autoclear = function()
{
  if (!this.canBeAutocleared())
  {
    // skip because you can't autoclear these slots.
    return this;
  }

  return this.setSkillId(0);
};

/**
 * Gets whether or not this slot can be autocleared, such as from auto-upgrading
 * a skill or something.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.canBeAutocleared = function()
{
  const noAutoclearSlots = [
    JABS_Button.Tool
  ];

  return !noAutoclearSlots.includes(this.key);
};
//#endregion JABS_SkillSlot

//#region JABS_SkillSlotManager
/**
 * A class responsible for managing the skill slots on an actor.
 */
function JABS_SkillSlotManager()
{
  this.initialize(...arguments);
}

JABS_SkillSlotManager.prototype = {};
JABS_SkillSlotManager.prototype.constructor = JABS_SkillSlotManager;

/**
 * Initializes this class. Executed when this class is instantiated.
 */
JABS_SkillSlotManager.prototype.initialize = function()
{
  // setup the properties of this class.
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlotManager.prototype.initMembers = function()
{
  /**
   * All skill slots that a battler possesses.
   *
   * These are in a fixed order.
   * @type {JABS_SkillSlot[]}
   */
  this._slots = [];

  /**
   * A single flip that gets toggled when this class no longer requires a setup.
   * @type {boolean}
   * @private
   */
  this._setupComplete = false;
};

/**
 * Gets whether or not this skill slot manager has been setup yet.
 * @returns {boolean}
 */
JABS_SkillSlotManager.prototype.isSetupComplete = function()
{
  return this._setupComplete;
};

/**
 * Finalizes the initialization of this skill slot manager.
 */
JABS_SkillSlotManager.prototype.completeSetup = function()
{
  // flag it as setup.
  this._setupComplete = true;
};

/**
 * Sets up the slots for the given battler.
 * @param {Game_Actor|Game_Enemy} battler The battler to setup slots for.
 */
JABS_SkillSlotManager.prototype.setupSlots = function(battler)
{
  // actors only get one setup!
  if (this.isSetupComplete() && battler.isActor()) return;

  // initialize the slots.
  this.initializeBattlerSlots();

  // either actor or enemy, no in between!
  switch (true)
  {
    case (battler.isActor()):
      this.setupActorSlots();
      break;
    case (battler.isEnemy()):
      this.setupEnemySlots(battler);
      break;
  }

  // flag the setup as complete.
  this.completeSetup();
};

/**
 * Gets all skill slots, regardless of whether or not their are assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllSlots = function()
{
  return this._slots;
};


JABS_SkillSlotManager.prototype.initializeBattlerSlots = function()
{
  // initialize the slots.
  this._slots = [];
};

/**
 * Setup the slots for an actor.
 * All actors have the same set of slots.
 */
JABS_SkillSlotManager.prototype.setupActorSlots = function()
{
  this._slots.push(new JABS_SkillSlot(JABS_Button.Mainhand, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.Offhand, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.Tool, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.Dodge, 0));

  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill1, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill2, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill3, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill4, 0));
};

/**
 * Setup slots for an enemy.
 * Each enemy can have varying slots.
 * @param {Game_Enemy} enemy The enemy to setup slots for.
 */
JABS_SkillSlotManager.prototype.setupEnemySlots = function(enemy)
{
  const battlerData = enemy.databaseData();
  if (!battlerData)
  {
    console.warn('missing battler data.', enemy);
    return;
  }

  // filter out any "extend" skills as far as this collection is concerned.
  const filtering = action =>
  {
    // grab the skill from the database.
    const skill = enemy.skill(action.skillId);

    // determine if the skill is an extend skill or not.
    const isExtendSkill = skill.metadata('skillExtend');

    // filter out the extend skills.
    return !isExtendSkill;
  };

  // filter the skills.
  const skillIds = battlerData.actions
    .filter(filtering)
    .map(action => action.skillId);

  // grab the basic attack skill id as well.
  const basicAttackSkillId = enemy.basicAttackSkillId();

  // check to make sure we found one.
  if (basicAttackSkillId)
  {
    // add it to the list if we did.
    skillIds.push(basicAttackSkillId);
  }

  // iterate over each skill.
  skillIds.forEach(skillId =>
  {
    // grab the skill itself.
    const skill = enemy.skill(skillId);

    // calculate the cooldown key.
    const slotKey = JABS_AiManager.buildEnemyCooldownType(skill);

    // add the slot to the manager for this enemy.
    this.addSlot(slotKey, skillId);
  }, this);
};

/**
 * Flags all skillslots for needing visual refresh for the input frame.
 */
JABS_SkillSlotManager.prototype.flagAllSkillSlotsForRefresh = function()
{
  this._slots.forEach(slot => slot.flagSkillSlotForRefresh());
};

/**
 * Adds a slot with the given slot key and skill id.
 * If a slot with the same key already exists, no action will be taken.
 * @param {string} key The slot key.
 * @param {number} initialSkillId The skill id to set to this slot.
 */
JABS_SkillSlotManager.prototype.addSlot = function(key, initialSkillId)
{
  // check if the slot key already exists on the manager.
  const exists = this._slots.find(slot => slot.key === key);

  // if it exists, then don't re-add this slot.
  if (exists) return;

  // add the slot with the designated key and skill id.
  this._slots.push(new JABS_SkillSlot(key, initialSkillId));
};

/**
 * Gets all skill slots identified as "primary".
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllPrimarySlots = function()
{
  return this.getAllSlots()
    .filter(slot => slot.isPrimarySlot());
};

/**
 * Gets all skill slots identified as "secondary".
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllSecondarySlots = function()
{
  return this.getAllSlots()
    .filter(slot => slot.isSecondarySlot());
};

/**
 * Gets the skill dedicated to the tool slot.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getToolSlot = function()
{
  return this.getSkillSlotByKey(JABS_Button.Tool);
};

/**
 * Gets the skill dedicated to the dodge slot.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getDodgeSlot = function()
{
  return this.getSkillSlotByKey(JABS_Button.Dodge);
};

/**
 * Gets all skill slots that have a skill assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEquippedSlots = function()
{
  return this.getAllSlots().filter(skillSlot => skillSlot.isUsable());
};

/**
 * Gets all secondary skill slots that are unassigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEmptySecondarySlots = function()
{
  return this.getAllSecondarySlots().filter(skillSlot => skillSlot.isEmpty());
};

/**
 * Gets all skill slots that have a skill assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEquippedAllySlots = function()
{
  return this.getEquippedSlots()
    .filter(skillSlot => skillSlot.key !== JABS_Button.Tool);
};

/**
 * Gets a skill slot by its key.
 * @param {string} key The key to find the matching slot for.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getSkillSlotByKey = function(key)
{
  return this.getAllSlots()
    .find(skillSlot => skillSlot.key === key);
};

/**
 * Gets the entire skill slot of the slot containing the skill id.
 * @param {number} skillIdToFind The skill id to find.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getSlotBySkillId = function(skillIdToFind)
{
  return this.getEquippedSlots()
    .find(skillSlot => skillSlot.id === skillIdToFind);
};

/**
 * Sets a new skill to a designated slot.
 * @param {string} key The key of the slot to set.
 * @param {number} skillId The id of the skill to assign to the slot.
 * @param {boolean} locked Whether or not the slot should be locked.
 */
JABS_SkillSlotManager.prototype.setSlot = function(key, skillId, locked)
{
  this.getSkillSlotByKey(key)
    .setSkillId(skillId)
    .setLock(locked);
};

/**
 * Gets the combo id of the given skill slot.
 * @param {string} key The skill slot key.
 * @returns {number}
 */
JABS_SkillSlotManager.prototype.getSlotComboId = function(key)
{
  return this.getSkillSlotByKey(key)
    .getComboId();
};

/**
 * Sets the combo id of the given skill slot.
 * @param {string} key The new skill slot key.
 * @param {number} comboId The new combo skill id.
 */
JABS_SkillSlotManager.prototype.setSlotComboId = function(key, comboId)
{
  // shorthand the skill slot.
  const skillSlot = this.getSkillSlotByKey(key);

  // set the new combo id.
  skillSlot.setComboId(comboId);

  // flag for refresh.
  skillSlot.flagSkillSlotForRefresh();
};

/**
 * Updates the cooldowns of all slots with a skill in them.
 */
JABS_SkillSlotManager.prototype.updateCooldowns = function()
{
  // this.getAllSlots() // use this if slots should update when there is no skill in them.
  this.getEquippedSlots()
    .forEach(slot => slot.updateCooldown());
};

/**
 * Determines if either cooldown is available for the given slot.
 * @param {string} key The slot.
 * @returns {boolean} True if one of the cooldowns is ready, false if both are not.
 */
JABS_SkillSlotManager.prototype.isAnyCooldownReadyForSlot = function(key)
{
  // shorthand the slot.
  const slot = this.getSkillSlotByKey(key);

  // shorthand the cooldown.
  const cooldown = slot.getCooldown();

  // whether or not the slot has a combo id available to it.
  const hasComboId = (slot.getComboId() !== 0);

  // check if the combo cooldown is flagged as ready.
  const comboCooldownReady = cooldown.isComboReady();

  // if we have both a combo id and a ready, we can use a combo.
  const isComboReady = hasComboId && comboCooldownReady;

  // if the base cooldown is ready, thats it- its ready.
  const isBaseReady = cooldown.isBaseReady();

  // whether or not either type of cooldown is available.
  const isAnyReady = (isComboReady || isBaseReady);

  // return our result.
  return isAnyReady;
};

/**
 * Clears and unlocks a skill slot by its key.
 * @param {string} key The key of the slot to clear.
 */
JABS_SkillSlotManager.prototype.clearSlot = function(key)
{
  this.getSkillSlotByKey(key).clear();
};

/**
 * Unlocks all slots owned by this actor.
 */
JABS_SkillSlotManager.prototype.unlockAllSlots = function()
{
  this.getAllSlots().forEach(slot => slot.unlock());
};
//#endregion JABS_SkillSlotManager

//#region JABS_Timer
/**
 * A reusable timer with some nifty functions.
 */
class JABS_Timer
{
  /**
   * The counter on this timer that ticks up to the max.
   * @type {number}
   */
  _timer = 0;

  /**
   * The maximum count this timer can reach.
   * @type {number}
   */
  _timerMax = 0;

  /**
   * Whether or not this timer has completed.
   * @type {boolean}
   */
  _timerComplete = false;

  /**
   * Whether or not to stop counting after we've reached the max.
   * @type {boolean}
   */
  _stopCounting = true;

  /**
   * The callback function to execute when the timer completes.
   * If none is provided, nothing will happen, though the {@link #onComplete} will still execute
   * in case you would prefer to handle it in code yourself.
   * @type {Function|null}
   */
  _callback = null;

  /**
   * Constructor.
   * @param {number} timerMax The max duration of this timer.
   * @param {boolean=} stopCounting Whether or not to stop counting after completing; defaults to true.
   * @param {Function|null=} callback EXPERIMENTAL. A callback function for completion of this timer.
   */
  constructor(timerMax, stopCounting = true, callback = null)
  {
    this._timerMax = timerMax;
    this._stopCounting = stopCounting;
    this._callback = callback;
  }

  /**
   * Gets the current time on this timer.
   * @returns {number}
   */
  getCurrentTime()
  {
    return this._timer;
  }

  /**
   * Sets the current time of this timer to a given amount.
   * Reducing below max time will remove completion if applicable.
   * Setting at or above max time will apply completion if applicable.
   * @param {number} time The new time for this timer.
   */
  setCurrentTime(time)
  {
    this._timer = time;

    // handle the possibility of the timer becoming incomplete.
    this._handleIfIncomplete();

    // handle the possibility that this timer is completed.
    this._handleIfComplete();
  }

  /**
   * Modify the current time of this timer by the given amount.
   * Reducing below max time will remove completion if applicable.
   * Setting at or above max time will apply completion if applicable.
   * @param {number} time The amount to modify by.
   * @returns {number} The new total after modification.
   */
  modCurrentTime(time)
  {
    // modify by this amount.
    this._timer += time;

    // handle the possibility of the timer becoming incomplete.
    this._handleIfIncomplete();

    // handle the possibility that this timer is completed.
    this._handleIfComplete();

    // for convenience, returns the new total.
    return this._timer;
  }

  /**
   * Gets the total time set to run on this timer.
   * @returns {number}
   */
  getMaxTime()
  {
    return this._timerMax;
  }

  /**
   * Sets the max time for this timer to the given amount.
   * @param {number} maxTime The new max time for this timer.
   */
  setMaxTime(maxTime)
  {
    this._timerMax = maxTime;
  }

  /**
   * Whether or not we should stop counting beyond max when updating.
   * @returns {boolean}
   */
  shouldStopCounting()
  {
    return this._stopCounting;
  }

  /**
   * Normalize time that is above bounds while the "stop counting" flag is set.
   */
  normalizeTime()
  {
    // don't mess with time that isn't finished.
    if (!this.isTimerComplete()) return;

    // normalize only applies to "should stop counting"
    if (!this.shouldStopCounting()) return;

    // reset the time to the max time.
    this._timer = this.getMaxTime();
  }

  /**
   * Checks whether or not this timer is completed.
   * @returns {boolean} True if it is completed, false otherwise.
   */
  isTimerComplete()
  {
    return this._timerComplete;
  }

  /**
   * Resets the timer back to initial state.
   */
  reset()
  {
    // re-initialize the timer.
    this._timer = 0;

    // re-initialize the completion flag.
    this._timerComplete = false;
  }

  /**
   * The main update method of this timer.
   */
  update()
  {
    // process the tick of this timer.
    this.tick();

    // process the tock of this timer.
    this.tock();
  }

  /**
   * Processes the incrementing of the time.
   */
  tick()
  {
    // you cannot tick past the completion.
    if (this.isTimerComplete()) return;

    // increment the timer.
    this._timer++;
  }

  /**
   * Processes the management of state of this timer.
   */
  tock()
  {
    // handle the possibility that this timer is completed.
    this._handleIfComplete();
  }

  /**
   * Handles the possibility of this timer becoming incomplete.
   */
  _handleIfIncomplete()
  {
    // check if we are below the max time duration.
    if (this._timer < this._timerMax)
    {
      // going below the timer marks this timer as incomplete.
      this._timerComplete = false;
    }

    // normalize if applicable.
    this.normalizeTime();
  }

  /**
   * Handles the possibility of this timer becoming complete.
   */
  _handleIfComplete()
  {
    // do nothing if already complete.
    if (this.isTimerComplete()) return;

    // check if we have reached or exceeded the max time duration.
    if (this._timer >= this._timerMax)
    {
      // surpassing the timer marks this timer as complete.
      this._timerComplete = true;

      // normalize if applicable.
      this.normalizeTime();

      // process the on-completion event hook.
      this.onComplete();
    }
  }

  /**
   * Forcefully completes this timer.
   */
  forceComplete()
  {
    // set the current to the max time.
    this.setCurrentTime(this.getMaxTime());

    // process completion of the timer.
    this._handleIfComplete();
  }

  onComplete()
  {
    //console.log(`timer completed`, this);
  }
}
//#endregion JABS_Timer

//#region JABS_TrackedState
/**
 * A class containing the tracked data for a particular state and battler.
 *
 * This class enables JABS to keep tabs on state durations as well as their effects.
 * Since most effects in-battle aren't directly replicatable on the map as easily,
 * this acts as an interface between the state and JABS, of which JABS owns.
 */
function JABS_TrackedState()
{
  this.initialize(...arguments);
}
JABS_TrackedState.prototype = {};
JABS_TrackedState.prototype.constructor = JABS_TrackedState;

/**
 * @constructor
 * @param {Game_Battler} battler The battler afflicted with this state.
 * @param {number} stateId The id of the state being tracked.
 * @param {number} iconIndex The icon index of the state being tracked.
 * @param {number} duration The duration of the state being tracked.
 * @param {Game_Battler} source The origin that applied this state to the battler.
 */
JABS_TrackedState.prototype.initialize = function({battler, stateId, iconIndex, duration, source})
{
  /**
   * The battler being afflicted with this state.
   * @type {Game_Battler}
   */
  this.battler = battler;

  /**
   * The id of the state being tracked.
   * @type {number}
   */
  this.stateId = stateId;

  /**
   * The icon index of the state being tracked (for visual purposes).
   * @type {number}
   */
  this.iconIndex = iconIndex;

  /**
   * The current duration of the state being tracked. Decrements over time.
   * @type {number}
   */
  this.duration = duration;

  /**
   * Whether or not this tracked state is identified as `expired`.
   * Expired states do not apply to the battler, but are kept in the tracking collection
   * to grant the ability to refresh the state duration or whatever we choose to do.
   * @type {boolean}
   */
  this.expired = false;

  /**
   * The source that caused this state. Usually this is an opposing battler. If no source is specified,
   * then the afflicted battler is the source.
   * @type {Game_Battler}
   */
  this.source = source ?? battler;
};

/**
 * Updates this tracked state over time. If the duration reaches 0, then the state
 * is removed and this tracked state becomes `expired`.
 */
JABS_TrackedState.prototype.update = function()
{
  if (this.duration > 0)
  {
    this.duration--;
  }
  else if (this.duration === 0 && this.stateId !== this.battler.deathStateId())
  {
    this.removeStateFromBattler();
  }
};

/**
 * Performs the removal of the state from the battler and sets the `expired` to true.
 */
JABS_TrackedState.prototype.removeStateFromBattler = function()
{
  const index = this.battler
    .states()
    .findIndex(state => state.id === this.stateId);
  if (index > -1)
  {
    this.battler.removeState(this.stateId);
    this.expired = true;
  }
};

/**
 * Gets whether or not this tracked state is `expired`.
 * @returns {boolean}
 */
JABS_TrackedState.prototype.isExpired = function()
{
  return this.expired;
};

/**
 * Gets whether or not this tracked state is about to 'expire'.
 * @returns {boolean}
 */
JABS_TrackedState.prototype.isAboutToExpire = function()
{
  return this.duration <= 90;
};
//#endregion JABS_TrackedState

//#region RPG_BaseBattler
//#region bonusHits
/**
 * The number of additional bonus hits this battler adds to their basic attacks.
 * @type {number}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//#endregion bonusHits
//#endregion RPG_BaseBattler


//#region RPG_Class
//#region bonusHits
/**
 * The number of additional bonus hits this battler adds to their basic attacks.
 * @type {number}
 */
Object.defineProperty(RPG_Class.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this battler.
 * @returns {number|null}
 */
RPG_Class.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_Class.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//#endregion bonusHits
//#endregion RPG_Class

//#region teamId
/**
 * The JABS team id for this battler.
 * This number is the id of the team that this battler will belong to.
 * @type {number}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsTeamId",
  {
    get: function()
    {
      return this.getJabsTeamId();
    },
  });

/**
 * Gets the JABS team id for this battler.
 * @returns {number}
 */
RPG_BaseBattler.prototype.getJabsTeamId = function()
{
  return this.extractJabsTeamId();
};

/**
 * Extracts the JABS team id for this battler from its notes.
 */
RPG_BaseBattler.prototype.extractJabsTeamId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.TeamId, true);
};
//#endregion teamId

//#region prepare time
/**
 * The JABS prepare time for this battler.
 * This number represents how many frames must pass before this battler can
 * decide an action to perform when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsPrepareTime",
  {
    get: function()
    {
      return this.getJabsPrepareTime();
    },
  });

/**
 * Gets the JABS prepare time for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsPrepareTime = function()
{
  return this.extractJabsPrepareTime();
};

/**
 * Extracts the JABS prepare time for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsPrepareTime = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.PrepareTime, true);
};
//#endregion prepare time

//#region sight range
/**
 * The JABS sight range for this battler.
 * This number represents how many tiles this battler can see before
 * engaging in combat when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsSightRange",
  {
    get: function()
    {
      return this.getJabsSightRange();
    },
  });

/**
 * Gets the JABS sight range for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsSightRange = function()
{
  return this.extractJabsSightRange();
};

/**
 * Extracts the JABS sight range for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsSightRange = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Sight, true);
};
//#endregion sight range

//#region pursuit range
/**
 * The JABS pursuit range for this battler.
 * This number represents how many tiles this battler can see after
 * engaging in combat when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsPursuitRange",
  {
    get: function()
    {
      return this.getJabsPursuitRange();
    },
  });

/**
 * Gets the JABS pursuit range for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsPursuitRange = function()
{
  return this.extractJabsPursuitRange();
};

/**
 * Extracts the JABS pursuit range for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsPursuitRange = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Pursuit, true);
};
//#endregion pursuit range

//#region alert duration
/**
 * The JABS alert duration for this battler.
 * This number represents how many frames this battler will remain alerted
 * when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAlertDuration",
  {
    get: function()
    {
      return this.getJabsAlertDuration();
    },
  });

/**
 * Gets the JABS alert duration for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsAlertDuration = function()
{
  return this.extractJabsAlertDuration();
};

/**
 * Extracts the JABS alert duration for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsAlertDuration = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Pursuit, true);
};
//#endregion alert duration

//#region alerted sight boost
/**
 * The JABS alerted sight boost for this battler.
 * This number represents the sight bonus applied while this battler is alerted
 * outside of combat when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAlertedSightBoost",
  {
    get: function()
    {
      return this.getJabsAlertedSightBoost();
    },
  });

/**
 * Gets the JABS alerted sight boost for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsAlertedSightBoost = function()
{
  return this.extractJabsAlertedSightBoost();
};

/**
 * Extracts the JABS alerted sight boost for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsAlertedSightBoost = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AlertedSightBoost, true);
};
//#endregion alerted sight boost

//#region alerted pursuit boost
/**
 * The JABS alerted pursuit boost for this battler.
 * This number represents the sight bonus applied while this battler is alerted
 * inside of combat when controlled by the {@link JABS_AiManager}.
 *
 * It is important to note that enemies cannot be alerted during combat, but their
 * alert duration may spill over into the beginning of combat.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAlertedPursuitBoost",
  {
    get: function()
    {
      return this.getJabsAlertedPursuitBoost();
    },
  });

/**
 * Gets the JABS alerted pursuit boost for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsAlertedPursuitBoost = function()
{
  return this.extractJabsAlertedPursuitBoost();
};

/**
 * Extracts the JABS alerted pursuit boost for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsAlertedPursuitBoost = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AlertedPursuitBoost, true);
};
//#endregion alerted pursuit boost

//#region ai
/**
 * The compiled {@link JABS_BattlerAI}.
 * This defines how this battler's AI will be controlled.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsBattlerAi",
  {
    get: function()
    {
      return this.getJabsBattlerAi();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of careful.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsBattlerAi = function()
{
  // extract the AI traits out.
  const careful = this.jabsAiTraitCareful;
  const executor = this.jabsAiTraitExecutor;
  const reckless = this.jabsAiTraitReckless;
  const healer = this.jabsAiTraitHealer;
  const follower = this.jabsAiTraitFollower;
  const leader = this.jabsAiTraitLeader;

  // return the compiled battler AI.
  return new JABS_BattlerAI(careful, executor, reckless, healer, follower, leader);
};

//#region ai:careful
/**
 * The JABS AI trait of careful.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitCareful",
  {
    get: function()
    {
      return this.getJabsAiTraitCareful();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of careful.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitCareful = function()
{
  return this.extractJabsAiTraitCareful();
};

/**
 * Extracts the JABS AI trait of careful from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitCareful = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitCareful);
};
//#endregion ai:careful

//#region ai:executor
/**
 * The JABS AI trait of executor.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitExecutor",
  {
    get: function()
    {
      return this.getJabsAiTraitExecutor();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of executor.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitExecutor = function()
{
  return this.extractJabsAiTraitExecutor();
};

/**
 * Extracts the JABS AI trait of executor from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitExecutor = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitExecutor);
};
//#endregion ai:executor

//#region ai:reckless
/**
 * The JABS AI trait of reckless.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitReckless",
  {
    get: function()
    {
      return this.getJabsAiTraitReckless();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of reckless.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitReckless = function()
{
  return this.extractJabsAiTraitReckless();
};

/**
 * Extracts the JABS AI trait of reckless from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitReckless = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitReckless);
};
//#endregion ai:reckless

//#region ai:healer
/**
 * The JABS AI trait of healer.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitHealer",
  {
    get: function()
    {
      return this.getJabsAiTraitHealer();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of healer.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitHealer = function()
{
  return this.extractJabsAiTraitHealer();
};

/**
 * Extracts the JABS AI trait of healer from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitHealer = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitHealer);
};
//#endregion ai:healer

//#region ai:follower
/**
 * The JABS AI trait of follower.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitFollower",
  {
    get: function()
    {
      return this.getJabsAiTraitFollower();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of follower.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitFollower = function()
{
  return this.extractJabsAiTraitFollower();
};

/**
 * Extracts the JABS AI trait of follower from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitFollower = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitFollower);
};
//#endregion ai:follower

//#region ai:leader
/**
 * The JABS AI trait of leader.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitLeader",
  {
    get: function()
    {
      return this.getJabsAiTraitLeader();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of leader.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitLeader = function()
{
  return this.extractJabsAiTraitLeader();
};

/**
 * Extracts the JABS AI trait of leader from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitLeader = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitLeader);
};
//#endregion ai:leader

//#endregion ai

//#region config
//#region config:canIdle
/**
 * The JABS config option for enabling idling.
 * This boolean decides whether or not this battler can idle while not engaged in combat.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigCanIdle",
  {
    get: function()
    {
      return this.getJabsConfigCanIdle();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsConfigCanIdle = function()
{
  return this.extractJabsConfigCanIdle();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsConfigCanIdle = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigCanIdle, true);
};
//#endregion config:canIdle

//#region config:noIdle
/**
 * The JABS config option for disabling idling.
 * This boolean decides whether or not this battler can idle while not engaged in combat.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNoIdle",
  {
    get: function()
    {
      return this.getJabsConfigNoIdle();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsConfigNoIdle = function()
{
  return this.extractJabsConfigNoIdle();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsConfigNoIdle = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNoIdle, true);
};
//#endregion config:canIdle

//#region config:showHpBar
/**
 * The JABS config option for enabling showing the hp bar.
 * This boolean decides whether or not this battler will reveal its hp bar under its sprite.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigShowHpBar",
  {
    get: function()
    {
      return this.getJabsConfigCanIdle();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigCanIdle = function()
{
  return this.extractJabsConfigCanIdle();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigCanIdle = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigShowHpBar, true);
};
//#endregion config:showHpBar

//#region config:noHpBar
/**
 * The JABS config option for disabling showing the hp bar.
 * This boolean decides whether or not this battler will hide its hp bar under its sprite.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNoHpBar",
  {
    get: function()
    {
      return this.getJabsConfigNoIdle();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigNoIdle = function()
{
  return this.extractJabsConfigNoIdle();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigNoIdle = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNoHpBar, true);
};
//#endregion config:noHpBar

//#region config:showName
/**
 * The JABS config option for enabling showing the battler's name.
 * This boolean decides whether or not this battler will reveal its name under its sprite.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigShowName",
  {
    get: function()
    {
      return this.getJabsConfigShowName();
    },
  });

/**
 * Checks whether or not this battler's name is visible.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigShowName = function()
{
  return this.extractJabsConfigShowName();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigShowName = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigShowName, true);
};
//#endregion config:showName

//#region config:noName
/**
 * The JABS config option for disabling showing the battler's name.
 * This boolean decides whether or not this battler will hide its name under its sprite.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNoName",
  {
    get: function()
    {
      return this.getJabsConfigNoName();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigNoName = function()
{
  return this.extractJabsConfigNoName();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigNoName = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNoName, true);
};
//#endregion config:noName

//#region config:invincible
/**
 * The JABS config option for enabling invincibility on this battler.
 * This boolean decides whether or not actions can collide with this battler.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigInvincible",
  {
    get: function()
    {
      return this.getJabsConfigInvincible();
    },
  });

/**
 * Checks whether or not this battler is invincible.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigInvincible = function()
{
  return this.extractJabsConfigInvincible();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigInvincible = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigInvincible, true);
};
//#endregion config:invincible

//#region config:notInvincible
/**
 * The JABS config option for disabling invincibility on this battler.
 * This boolean decides whether or not actions cannot collide with this battler.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNotInvincible",
  {
    get: function()
    {
      return this.getJabsConfigNotInvincible();
    },
  });

/**
 * Checks whether or not this battler isn't invincible.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigNotInvincible = function()
{
  return this.extractJabsConfigNotInvincible();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigNotInvincible = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNotInvincible, true);
};
//#endregion config:notInvincible

//#region config:inanimate
/**
 * The JABS config option for enabling being inanimate for this battler.
 * This boolean decides whether or not to enable being inanimate
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigInanimate",
  {
    get: function()
    {
      return this.getJabsConfigInanimate();
    },
  });

/**
 * Checks whether or not this battler is inanimate.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigInanimate = function()
{
  return this.extractJabsConfigInanimate();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigInanimate = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigInanimate, true);
};
//#endregion config:inanimate

//#region config:notInanimate
/**
 * The JABS config option for disabling being inanimate for this battler.
 * This boolean decides whether or not to disable being inanimate.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNotInanimate",
  {
    get: function()
    {
      return this.getJabsConfigNotInanimate();
    },
  });

/**
 * Checks whether or not this battler isn't inanimate.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigNotInanimate = function()
{
  return this.extractJabsConfigNotInanimate();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigNotInanimate = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNotInanimate, true);
};
//#endregion config:notInanimate

//#endregion config

//#region RPG_EquipItem
//#region skillId
/**
 * The skill id associated with this equipment.
 * This is typically found on weapons and offhand armors.
 * @type {number|null}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsSkillId",
  {
    get: function()
    {
      return this.getJabsSkillId();
    },
  });

/**
 * Gets the JABS skill id for this equip.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.getJabsSkillId = function()
{
  return this.extractJabsSkillId();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.extractJabsSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SkillId, true);
};
//#endregion skillId

//#region offhand skillId
/**
 * The offhand skill id override from this equip.
 * @type {number}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsOffhandSkillId",
  {
    get: function()
    {
      return this.getJabsOffhandSkillId();
    },
  });

/**
 * Gets the JABS offhand skill id override for this equip.
 * @returns {number}
 */
RPG_EquipItem.prototype.getJabsOffhandSkillId = function()
{
  return this.extractJabsOffhandSkillId()
};

/**
 * Gets the value from its notes.
 */
RPG_EquipItem.prototype.extractJabsOffhandSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.OffhandSkillId, true);
};
//#endregion offhand skillId



//#region useOnPickup
/**
 * Normally defines whether or not an item will be automatically used
 * upon being picked up, however, equipment cannot be "used".
 * @type {false}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsUseOnPickup",
  {
    get: function()
    {
      return false;
    },
  });
//#endregion useOnPickup

//#region expiration
/**
 * The expiration time in frames for this equip drop.
 * @type {number|null}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsExpiration",
  {
    get: function()
    {
      return this.getJabsExpirationFrames();
    },
  });

/**
 * Gets the expiration time in frames.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.getJabsExpirationFrames = function()
{
  return this.extractJabsExpirationFrames();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.extractJabsExpirationFrames = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Expires, true);
};
//#endregion expiration
//#endregion RPG_EquipItem

//#region RPG_Item
//#region skillId
/**
 * The skill id associated with this item or tool.
 * @type {number|null}
 */
Object.defineProperty(RPG_Item.prototype, "jabsSkillId",
  {
    get: function()
    {
      return this.getJabsSkillId();
    },
  });

/**
 * Gets the JABS skill id for this item or tool.
 * @returns {number|null}
 */
RPG_Item.prototype.getJabsSkillId = function()
{
  return this.extractJabsSkillId();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Item.prototype.extractJabsSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SkillId, true);
};
//#endregion skillId

//#region useOnPickup
/**
 * Whether or not this item will be automatically executed upon being picked up.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_Item.prototype, "jabsUseOnPickup",
  {
    get: function()
    {
      return this.getJabsUseOnPickup();
    },
  });

/**
 * Gets whether or not this item will be used on pickup.
 * @returns {boolean|null}
 */
RPG_Item.prototype.getJabsUseOnPickup = function()
{
  return this.extractJabsUseOnPickup();
};

/**
 * Extracts the boolean from the notes.
 * @returns {boolean|null}
 */
RPG_Item.prototype.extractJabsUseOnPickup = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.UseOnPickup, true);
};
//#endregion useOnPickup

//#region expiration
/**
 * The expiration time in frames for this loot drop.
 * @type {number|null}
 */
Object.defineProperty(RPG_Item.prototype, "jabsExpiration",
  {
    get: function()
    {
      return this.getJabsExpirationFrames();
    },
  });

/**
 * Gets the expiration time in frames.
 * @returns {number|null}
 */
RPG_Item.prototype.getJabsExpirationFrames = function()
{
  return this.extractJabsExpirationFrames();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Item.prototype.extractJabsExpirationFrames = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Expires, true);
};
//#endregion expiration
//#endregion RPG_Item

//#region RPG_Skill effects
//#region range
/**
 * The JABS range for this skill.
 * This range determines the number of tiles the skill can reach in the
 * context of collision with targets.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsRadius",
  {
    get: function()
    {
      return this.getJabsRadius();
    },
  });

/**
 * Gets the JABS range for this skill.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsRadius = function()
{
  return this.extractJabsRadius();
};

/**
 * Extracts the JABS range for this skill from its notes.
 */
RPG_Skill.prototype.extractJabsRadius = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Range, true);
};
//#endregion range

//#region proximity
/**
 * A new property for retrieving the JABS proximity from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsProximity",
  {
    get: function()
    {
      return this.getJabsProximity();
    },
  });

/**
 * Gets the JABS proximity this skill.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsProximity = function()
{
  return this.extractJabsProximity();
};

/**
 * Extracts the JABS proximity for this skill from its notes.
 */
RPG_Skill.prototype.extractJabsProximity = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Proximity, true);
};
//#endregion proximity

//#region actionId
/**
 * A new property for retrieving the JABS actionId from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsActionId",
  {
    get: function()
    {
      return this.getJabsActionId();
    },
  });

/**
 * Gets the JABS actionId this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsActionId = function()
{
  return this.extractJabsActionId();
};

/**
 * Extracts the JABS actionId for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsActionId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.ActionId, true);
};
//#endregion actionId

//#region duration
/**
 * A new property for retrieving the JABS duration from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDuration",
  {
    get: function()
    {
      return this.getJabsDuration();
    },
  });

/**
 * Gets the JABS duration this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsDuration = function()
{
  return this.extractJabsDuration();
};

/**
 * Extracts the JABS duration for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsDuration = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Duration, true);
};
//#endregion duration

//#region shape
/**
 * A new property for retrieving the JABS shape from this skill.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsShape",
  {
    get: function()
    {
      return this.getJabsShape();
    },
  });

/**
 * Gets the JABS shape this skill.
 * @returns {string|null}
 */
RPG_Skill.prototype.getJabsShape = function()
{
  return this.extractJabsShape();
};

/**
 * Extracts the JABS shape for this skill from its notes.
 * @returns {string|null}
 */
RPG_Skill.prototype.extractJabsShape = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.Shape, true);
};
//#endregion shape

//#region knockback
/**
 * A new property for retrieving the JABS knockback from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsKnockback",
  {
    get: function()
    {
      return this.getJabsKnockback();
    },
  });

/**
 * Gets the JABS knockback this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsKnockback = function()
{
  return this.extractJabsKnockback();
};

/**
 * Extracts the JABS knockback for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsKnockback = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Knockback, true);
};
//#endregion knockback

//#region castAnimation
/**
 * A new property for retrieving the JABS castAnimation id from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCastAnimation",
  {
    get: function()
    {
      return this.getJabsCastAnimation();
    },
  });

/**
 * Gets the JABS castAnimation this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsCastAnimation = function()
{
  return this.extractJabsCastAnimation();
};

/**
 * Extracts the JABS castAnimation for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsCastAnimation = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.CastAnimation, true);
};
//#endregion castAnimation

//#region castTime
/**
 * A new property for retrieving the JABS castTime from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCastTime",
  {
    get: function()
    {
      return this.getJabsCastTime();
    },
  });

/**
 * Gets the JABS castTime this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsCastTime = function()
{
  return this.extractJabsCastTime();
};

/**
 * Extracts the JABS castTime for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsCastTime = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.CastTime, true);
};
//#endregion castTime

//#region freeCombo
/**
 * Whether or not this skill has the "free combo" trait on it.
 * Skills with "free combo" can continuously be executed regardless of
 * the actual timing factor for combos.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsFreeCombo",
  {
    get: function()
    {
      return this.getJabsFreeCombo();
    },
  });

/**
 * Gets the JABS freeCombo this skill.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.getJabsFreeCombo = function()
{
  return this.extractJabsFreeCombo();
};

/**
 * Extracts the JABS freeCombo for this skill from its notes.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.extractJabsFreeCombo = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.FreeCombo, true);
};
//#endregion freeCombo

//#region direct
/**
 * A new property for retrieving the JABS direct from this skill.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDirect",
  {
    get: function()
    {
      return this.getJabsDirect();
    },
  });

/**
 * Gets the JABS direct this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsDirect = function()
{
  return this.extractJabsDirect();
};

/**
 * Extracts the JABS direct for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsDirect = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Direct, true);
};
//#endregion direct

//#region bonusAggro
/**
 * A new property for retrieving the JABS bonusAggro from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsBonusAggro",
  {
    get: function()
    {
      return this.getJabsBonusAggro();
    },
  });

/**
 * Gets the JABS bonusAggro this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsBonusAggro = function()
{
  return this.extractJabsBonusAggro();
};

/**
 * Extracts the JABS bonusAggro for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsBonusAggro = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusAggro, true);
};
//#endregion bonusAggro

//#region aggroMultiplier
/**
 * A new property for retrieving the JABS aggroMultiplier from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsAggroMultiplier",
  {
    get: function()
    {
      return this.getJabsAggroMultiplier();
    },
  });

/**
 * Gets the JABS aggroMultiplier this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsAggroMultiplier = function()
{
  return this.extractJabsAggroMultiplier();
};

/**
 * Extracts the JABS aggroMultiplier for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsAggroMultiplier = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AggroMultiplier, true);
};
//#endregion aggroMultiplier

//#region jabsGuardData
/**
 * The `JABS_GuardData` of this skill.
 * Will return null if there is no guard tag available on this
 * @type {JABS_GuardData}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuardData",
  {
    get: function()
    {
      return this.getJabsGuardData();
    },
  });

/**
 * Gets the JABS guard this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsGuardData = function()
{
  return new JABS_GuardData(
    this.id,
    this.jabsGuardFlat,
    this.jabsGuardPercent,
    this.jabsCounterGuard,
    this.jabsCounterParry,
    this.jabsParry)
};
//#endregion jabsGuardData

//#region guard
/**
 * A new property for retrieving the JABS guard from this skill.
 * @type {[number, number]}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuard",
  {
    get: function()
    {
      return this.getJabsGuard();
    },
  });

/**
 * The flat amount of damage reduced by this skill when guarding.
 * Should be negative.
 * If positive, this flat damage will instead be added on while guarding.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuardFlat",
  {
    get: function()
    {
      return this.jabsGuard[0];
    },
  });

/**
 * The percent amount of damage reduced by this skill when guarding.
 * Should be negative.
 * If positive, this percent damage will instead be added on while guarding.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuardPercent",
  {
    get: function()
    {
      return this.jabsGuard[1];
    },
  });

/**
 * Gets the JABS guard this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsGuard = function()
{
  return this.extractJabsGuard();
};

/**
 * Extracts the JABS guard for this skill from its notes.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.extractJabsGuard = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.Guard);
};
//#endregion guard

//#region parry
/**
 * The number of frames that the precise-parry window is available
 * when first guarding.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsParry",
  {
    get: function()
    {
      return this.getJabsParryFrames();
    },
  });

/**
 * Gets the JABS parry this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsParryFrames = function()
{
  return this.extractJabsParryFrames();
};

/**
 * Extracts the JABS parry for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsParryFrames = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Parry, true);
};
//#endregion parry

//#region counterParry
/**
 * When performing a precise-parry, this skill id will be automatically
 * executed in retaliation.
 * @type {number[]}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCounterParry",
  {
    get: function()
    {
      return this.getJabsCounterParry();
    },
  });

/**
 * Gets the JABS counterParry this skill.
 * @returns {number[]}
 */
RPG_Skill.prototype.getJabsCounterParry = function()
{
  return this.extractJabsCounterParry();
};

/**
 * Extracts the JABS counterParry for this skill from its notes.
 * @returns {number[]}
 */
RPG_Skill.prototype.extractJabsCounterParry = function()
{
  return this.getNumberArrayFromNotesByRegex(J.ABS.RegExp.CounterParry);
};
//#endregion counterParry

//#region counterGuard
/**
 * While guarding, this skill id will be automatically executed in retaliation.
 * @type {number[]}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCounterGuard",
  {
    get: function()
    {
      return this.getJabsCounterGuard();
    },
  });

/**
 * Gets the JABS counterGuard this skill.
 * @returns {number[]}
 */
RPG_Skill.prototype.getJabsCounterGuard = function()
{
  return this.extractJabsCounterGuard();
};

/**
 * Extracts the JABS counterGuard for this skill from its notes.
 * @returns {number[]}
 */
RPG_Skill.prototype.extractJabsCounterGuard = function()
{
  return this.getNumberArrayFromNotesByRegex(J.ABS.RegExp.CounterGuard);
};
//#endregion counterGuard

//#region projectile
/**
 * A new property for retrieving the JABS projectile frames from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsProjectile",
  {
    get: function()
    {
      return this.getJabsProjectile();
    },
  });

/**
 * Gets the JABS projectile this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsProjectile = function()
{
  return this.extractJabsProjectile();
};

/**
 * Extracts the JABS projectile for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsProjectile = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Projectile, true);
};
//#endregion projectile

//#region uniqueCooldown
/**
 * A new property for retrieving the JABS uniqueCooldown from this skill.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsUniqueCooldown",
  {
    get: function()
    {
      return this.getJabsUniqueCooldown();
    },
  });

/**
 * Gets the JABS uniqueCooldown this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsUniqueCooldown = function()
{
  return this.extractJabsUniqueCooldown();
};

/**
 * Extracts the JABS uniqueCooldown for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsUniqueCooldown = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.UniqueCooldown, true);
};
//#endregion uniqueCooldown

//#region moveType
/**
 * The direction that this dodge skill will move.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsMoveType",
  {
    get: function()
    {
      return this.getJabsMoveType();
    },
  });

/**
 * Gets the JABS moveType this skill.
 * @returns {string|null}
 */
RPG_Skill.prototype.getJabsMoveType = function()
{
  return this.extractJabsMoveType();
};

/**
 * Extracts the JABS moveType for this skill from its notes.
 * @returns {string|null}
 */
RPG_Skill.prototype.extractJabsMoveType = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.MoveType, true);
};
//#endregion moveType

//#region invincibleDodge
/**
 * Whether or not the battler is invincible for the duration of this
 * skill's dodge movement.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsInvincibleDodge",
  {
    get: function()
    {
      return this.getJabsInvincibileDodge();
    },
  });

/**
 * Gets the dodge invincibility flag for this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsInvincibileDodge = function()
{
  return this.extractJabsInvincibleDodge();
};

/**
 * Extracts the JABS invincibleDodge for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsInvincibleDodge = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.InvincibleDodge, true);
};
//#endregion invincibleDodge

//#region comboAction
/**
 * The JABS combo data for this skill.
 *
 * The zeroth index is the combo skill id
 * The first index is the delay in frames until the combo can be triggered.
 *
 * Will be null if the combo tag is missing from the skill.
 * @type {[number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboAction",
  {
    get: function()
    {
      return this.getJabsComboAction();
    },
  });

/**
 * The JABS combo skill id that this skill can lead into if the skill is learned
 * by the caster.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboSkillId",
  {
    get: function()
    {
      return this.jabsComboAction[0];
    },
  });

/**
 * The JABS combo delay in frames before the combo skill can be triggered.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboDelay",
  {
    get: function()
    {
      return this.jabsComboAction[1];
    },
  });

/**
 * Gets the JABS combo this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsComboAction = function()
{
  return this.extractJabsComboAction();
};

/**
 * Extracts the JABS combo for this skill from its notes.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.extractJabsComboAction = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.ComboAction);
};
//#endregion comboAction

//#region piercing
/**
 * The JABS piercing data for this skill.
 *
 * The zeroth index is the number of times to repeatedly pierce targets.
 * The first index is the delay in frames between each pierce hit.
 *
 * Will be null if the piercing tag is missing from the skill.
 * @type {[number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPiercingData",
  {
    get: function()
    {
      const piercingData = this.getJabsPiercingData();
      if (!piercingData)
      {
        return [1, 0];
      }

      return piercingData;
    },
  });

/**
 * The number of times this skill can hit targets.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPierceCount",
  {
    get: function()
    {
      return this.jabsPiercingData[0];
    },
  });

/**
 * The delay in frames between each pierce hit on targets.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPierceDelay",
  {
    get: function()
    {
      return this.jabsPiercingData[1];
    },
  });

/**
 * Gets the JABS combo this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsPiercingData = function()
{
  return this.extractJabsPiercingData();
};

/**
 * Extracts the JABS combo for this skill from its notes.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.extractJabsPiercingData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.PiercingData);
};
//#endregion piercing

//#region knockbackResist
//#region RPG_BaseBattler
/**
 * A new property for retrieving the JABS castTime from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsKnockbackResist",
  {
    get: function()
    {
      return this.getJabsKnockbackResist();
    },
  });

/**
 * Gets the JABS castTime this skill.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsKnockbackResist = function()
{
  return this.extractJabsKnockbackResist();
};

/**
 * Extracts the JABS castTime for this skill from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsKnockbackResist = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.KnockbackResist, true);
};
//#endregion RPG_BaseBattler

//#region RPG_BaseItem
/**
 * A new property for retrieving the JABS castTime from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_BaseItem.prototype, "jabsKnockbackResist",
  {
    get: function()
    {
      return this.getJabsKnockbackResist();
    },
  });

/**
 * Gets the JABS castTime this skill.
 * @returns {number|null}
 */
RPG_BaseItem.prototype.getJabsKnockbackResist = function()
{
  return this.extractJabsKnockbackResist();
};

/**
 * Extracts the JABS castTime for this skill from its notes.
 * @returns {number|null}
 */
RPG_BaseItem.prototype.extractJabsKnockbackResist = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.KnockbackResist, true);
};
//#endregion RPG_BaseItem
//#endregion knockbackResist

//#region poseSuffix
/**
 * Gets the JABS pose suffix data for this skill.
 *
 * The zeroth index is the string suffix itself (no quotes needed).
 * The first index is the index on the suffixed character sheet.
 * The second index is the number of frames to spend in this pose.
 * @type {[string, number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseData",
  {
    get: function()
    {
      return this.getJabsPoseData();
    },
  });

/**
 * Gets the JABS pose suffix for this skill.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseSuffix",
  {
    get: function()
    {
      return this.jabsPoseData[0];
    },
  });

/**
 * Gets the JABS pose index for this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseIndex",
  {
    get: function()
    {
      return this.jabsPoseData[1];
    },
  });

/**
 * Gets the JABS pose duration for this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseDuration",
  {
    get: function()
    {
      return this.jabsPoseData[2];
    },
  });

/**
 * Gets the JABS pose suffix data for this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsPoseData = function()
{
  return this.extractJabsPoseData();
};

/**
 * Extracts the JABS pose suffix data for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsPoseData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.PoseSuffix, true);
};
//#endregion poseSuffix

//#region ignoreParry
/**
 * The amount of parry rating ignored by this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsIgnoreParry",
  {
    get: function()
    {
      return this.getJabsIgnoreParry();
    },
  });

/**
 * Gets the ignore parry amount for this skill.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsIgnoreParry = function()
{
  return this.extractJabsIgnoreParry()
};

/**
 * Gets the value from the notes.
 */
RPG_Skill.prototype.extractJabsIgnoreParry = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.IgnoreParry, true);
};
//#endregion ignoreParry

//#region unparryable
//#region RPG_Skill
/**
 * Whether or not this skill is completely unparryable by the target.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsUnparryable",
  {
    get: function()
    {
      return this.getJabsUnparryable();
    },
  });

/**
 * Gets whether or not this skill is unparryable.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.getJabsUnparryable = function()
{
  return this.extractJabsUnparryable();
};

/**
 * Extracts the boolean from the notes.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.extractJabsUnparryable = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Unparryable, true);
};
//#endregion RPG_Skill

//#region RPG_State
/**
 * Whether or not the battler afflicted with this state is unparryable in
 * any action it takes.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsUnparryable",
  {
    get: function()
    {
      return this.getJabsUnparryable();
    },
  });

/**
 * Gets whether or not this state will provide the unparryable status
 * to its afflictee.
 * @returns {boolean|null}
 */
RPG_State.prototype.getJabsUnparryable = function()
{
  return this.extractJabsUnparryable();
};

/**
 * Extracts the boolean from the notes.
 * @returns {boolean|null}
 */
RPG_State.prototype.extractJabsUnparryable = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Unparryable, true);
};
//#endregion RPG_State
//#endregion unparryable

//#region selfAnimation
/**
 * The animation id to play on oneself when executing this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsSelfAnimationId",
  {
    get: function()
    {
      return this.getJabsSelfAnimationId();
    },
  });

/**
 * Gets the JABS self animation id.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsSelfAnimationId = function()
{
  return this.extractJabsSelfAnimationId();
};

/**
 * Extracts the value from the notes.
 */
RPG_Skill.prototype.extractJabsSelfAnimationId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SelfAnimationId, true);
};
//#endregion range

//#region delay
/**
 * The JABS delay data for this skill.
 *
 * The zeroth index is the number of frames to delay the execution of the skill by.
 * The first index is whether or not to execute regardless of delay by touch.
 *
 * Will be null if the delay tag is missing from the skill.
 * @type {[number, boolean]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDelayData",
  {
    get: function()
    {
      const delayData = this.getJabsDelayData();
      if (!delayData)
      {
        return [0, false];
      }

      return delayData;
    },
  });

/**
 * The duration in frames before this skill's action will trigger.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDelayDuration",
  {
    get: function()
    {
      return this.jabsDelayData[0];
    },
  });

/**
 * Whether or not the delay will be ignored if an enemy touches this skill's action.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDelayTriggerByTouch",
  {
    get: function()
    {
      return this.jabsDelayData[1];
    },
  });

/**
 * Gets the JABS delay data for this skill.
 * @returns {[number, boolean]|null}
 */
RPG_Skill.prototype.getJabsDelayData = function()
{
  return this.extractJabsDelayData();
};

/**
 * Extracts the data from the notes.
 * @returns {[number, boolean]|null}
 */
RPG_Skill.prototype.extractJabsDelayData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.DelayData);
};
//#endregion delay
//#endregion RPG_Skill effects

//#region RPG_State effects
//#region paralysis
/**
 * Whether or not this state is also a JABS paralysis state.
 * Paralysis is the same as being rooted & muted & disarmed simultaneously.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsParalyzed",
  {
    get: function()
    {
      return this.getJabsParalyzed();
    },
  });

/**
 * Gets whether or not this is a JABS paralysis state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsParalyzed = function()
{
  return this.extractJabsParalyzed()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsParalyzed = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Paralyzed, true);
};
//#endregion paralysis

//#region rooted
/**
 * Whether or not this state is also a JABS rooted state.
 * Rooted battlers are unable to move on the map.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsRooted",
  {
    get: function()
    {
      return this.getJabsRooted();
    },
  });

/**
 * Gets whether or not this is a JABS rooted state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsRooted = function()
{
  return this.extractJabsRooted()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsRooted = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Rooted, true);
};
//#endregion rooted

//#region muted
/**
 * Whether or not this state is also a JABS muted state.
 * Muted battlers are unable to use their combat skills.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsMuted",
  {
    get: function()
    {
      return this.getJabsMuted();
    },
  });

/**
 * Gets whether or not this is a JABS muted state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsMuted = function()
{
  return this.extractJabsMuted()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsMuted = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Muted, true);
};
//#endregion muted

//#region disarmed
/**
 * Whether or not this state is also a JABS disarmed state.
 * Disarmed battlers are unable to use their basic attacks.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsDisarmed",
  {
    get: function()
    {
      return this.getJabsDisarmed();
    },
  });

/**
 * Gets whether or not this is a JABS disarmed state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsDisarmed = function()
{
  return this.extractJabsDisarmed()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsDisarmed = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Disarmed, true);
};
//#endregion disarmed

//#region negative
/**
 * Whether or not this state is considered "negative" for the purpose
 * of AI action decision-making. Ally AI set to Support or enemy AI set
 * to Healing will attempt to remove "negative" states if possible.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsNegative",
  {
    get: function()
    {
      return this.getJabsNegative();
    },
  });

/**
 * Gets whether or not this is a JABS negative state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsNegative = function()
{
  return this.extractJabsNegative()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsNegative = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Negative);
};
//#endregion disarmed

//#region aggroInAmp
/**
 * Multiply incoming aggro by this amount.
 * @type {number|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsAggroInAmp",
  {
    get: function()
    {
      return this.getJabsAggroInAmp();
    },
  });

/**
 * Gets the incoming aggro amplifier.
 * @returns {number|null}
 */
RPG_State.prototype.getJabsAggroInAmp = function()
{
  return this.extractJabsAggroInAmp()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_State.prototype.extractJabsAggroInAmp = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AggroInAmp, true);
};
//#endregion aggroInAmp

//#region aggroOutAmp
/**
 * Multiply outgoing aggro by this amount.
 * @type {number|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsAggroOutAmp",
  {
    get: function()
    {
      return this.getJabsAggroOutAmp();
    },
  });

/**
 * Gets the outgoing aggro amplifier.
 * @returns {number|null}
 */
RPG_State.prototype.getJabsAggroOutAmp = function()
{
  return this.extractJabsAggroOutAmp()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_State.prototype.extractJabsAggroOutAmp = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AggroOutAmp, true);
};
//#endregion aggroOutAmp

//#region aggroLock
/**
 * Whether or not this state locks aggro. Battlers with this state applied
 * can neither gain nor lose aggro for the duration of the state.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsAggroLock",
  {
    get: function()
    {
      return this.getJabsAggroLock();
    },
  });

/**
 * Gets whether or not this is a JABS aggro-locking state.
 * @returns {boolean|null}
 */
RPG_State.prototype.getJabsAggroLock = function()
{
  return this.extractJabsAggroLock()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean|null}
 */
RPG_State.prototype.extractJabsAggroLock = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AggroLock, true);
};
//#endregion aggroLock

//#region offhand skillId
/**
 * The offhand skill id override from this state.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsOffhandSkillId",
  {
    get: function()
    {
      return this.getJabsOffhandSkillId();
    },
  });

/**
 * Gets the JABS offhand skill id override for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsOffhandSkillId = function()
{
  return this.extractJabsOffhandSkillId()
};

/**
 * Gets the value from its notes.
 */
RPG_State.prototype.extractJabsOffhandSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.OffhandSkillId, true);
};
//#endregion offhand skillId

//#region slipHp
//#region flat
/**
 * The flat slip hp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFlatPerFive",
  {
    get: function()
    {
      return this.getJabsSlipHpFlatPer5();
    },
  });

/**
 * The flat slip hp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFlatPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpFlatPerFive / 5);
    },
  });

/**
 * The flat slip hp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFlatPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpFlatPerFive / 20);
    },
  });

/**
 * Gets the per5 flat slip hp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipHpFlatPer5 = function()
{
  return this.extractJabsSlipHpFlatPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipHpFlatPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipHpFlat);
};
//#endregion flat

//#region percent
/**
 * The percent slip hp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpPercentPerFive",
  {
    get: function()
    {
      return this.getJabsSlipHpPercentPer5();
    },
  });

/**
 * The percent slip hp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpPercentPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpPercentPerFive / 5);
    },
  });

/**
 * The percent slip hp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpPercentPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpPercentPerFive / 20);
    },
  });

/**
 * Gets the per5 percent slip hp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipHpPercentPer5 = function()
{
  return this.extractJabsSlipHpPercentPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipHpPercentPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipHpPercent);
};
//#endregion percent

//#region formula
/**
 * The formula slip hp amount- per 5 seconds.
 * This does NOT `eval()` the formula, as there is no additional variables
 * available for context.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFormulaPerFive",
  {
    get: function()
    {
      return this.getJabsSlipHpFormulaPer5();
    },
  });

/**
 * Gets the per5 formula slip hp amount for this state.
 * @returns {string|null}
 */
RPG_State.prototype.getJabsSlipHpFormulaPer5 = function()
{
  return this.extractJabsSlipHpFormulaPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipHpFormulaPer5 = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.SlipHpFormula);
};
//#endregion formula
//#endregion slipHp

//#region slipMp
//#region flat
/**
 * The flat slip mp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFlatPerFive",
  {
    get: function()
    {
      return this.getJabsSlipMpFlatPer5();
    },
  });

/**
 * The flat slip mp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFlatPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpFlatPerFive / 5);
    },
  });

/**
 * The flat slip mp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFlatPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpFlatPerFive / 20);
    },
  });

/**
 * Gets the per5 flat slip mp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipMpFlatPer5 = function()
{
  return this.extractJabsSlipMpFlatPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipMpFlatPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipMpFlat);
};
//#endregion flat

//#region percent
/**
 * The percent slip mp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpPercentPerFive",
  {
    get: function()
    {
      return this.getJabsSlipMpPercentPer5();
    },
  });

/**
 * The percent slip mp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpPercentPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpPercentPerFive / 5);
    },
  });

/**
 * The percent slip mp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpPercentPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpPercentPerFive / 20);
    },
  });

/**
 * Gets the per5 percent slip mp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipMpPercentPer5 = function()
{
  return this.extractJabsSlipMpPercentPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipMpPercentPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipMpPercent);
};
//#endregion percent

//#region formula
/**
 * The formula slip mp amount- per 5 seconds.
 * This does NOT `eval()` the formula, as there is no additional variables
 * available for context.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFormulaPerFive",
  {
    get: function()
    {
      return this.getJabsSlipMpFormulaPer5();
    },
  });

/**
 * Gets the per5 formula slip mp amount for this state.
 * @returns {string|null}
 */
RPG_State.prototype.getJabsSlipMpFormulaPer5 = function()
{
  return this.extractJabsSlipMpFormulaPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipMpFormulaPer5 = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.SlipMpFormula);
};
//#endregion formula
//#endregion slipMp

//#region slipTp
//#region flat
/**
 * The flat slip tp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFlatPerFive",
  {
    get: function()
    {
      return this.getJabsSlipTpFlatPer5();
    },
  });

/**
 * The flat slip tp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFlatPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpFlatPerFive / 5);
    },
  });

/**
 * The flat slip tp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFlatPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpFlatPerFive / 20);
    },
  });

/**
 * Gets the per5 flat slip tp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipTpFlatPer5 = function()
{
  return this.extractJabsSlipTpFlatPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipTpFlatPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipTpFlat);
};
//#endregion flat

//#region percent
/**
 * The percent slip tp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpPercentPerFive",
  {
    get: function()
    {
      return this.getJabsSlipTpPercentPer5();
    },
  });

/**
 * The percent slip tp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpPercentPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpPercentPerFive / 5);
    },
  });

/**
 * The percent slip tp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpPercentPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpPercentPerFive / 20);
    },
  });

/**
 * Gets the per5 percent slip tp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipTpPercentPer5 = function()
{
  return this.extractJabsSlipTpPercentPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipTpPercentPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipTpPercent);
};
//#endregion percent

//#region formula
/**
 * The formula slip tp amount- per 5 seconds.
 * This does NOT `eval()` the formula, as there is no additional variables
 * available for context.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFormulaPerFive",
  {
    get: function()
    {
      return this.getJabsSlipTpFormulaPer5();
    },
  });

/**
 * Gets the per5 formula slip tp amount for this state.
 * @returns {string|null}
 */
RPG_State.prototype.getJabsSlipTpFormulaPer5 = function()
{
  return this.extractJabsSlipTpFormulaPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipTpFormulaPer5 = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.SlipTpFormula);
};
//#endregion formula
//#endregion slipTp
//#endregion RPG_State effects

//#region RPG_Traited
//#region bonusHits
/**
 * A new property for retrieving the JABS bonusHits from this traited item.
 * @type {number}
 */
Object.defineProperty(RPG_Traited.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this traited item.
 * @returns {number|null}
 */
RPG_Traited.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_Traited.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//#endregion bonusHits
//#endregion RPG_Traited


//#region RPG_UsableItem
//#region bonusHits
/**
 * The number of additional bonus hits this skill or item adds to their basic attacks.
 * @type {number}
 */
Object.defineProperty(RPG_UsableItem.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this skill or item.
 * @returns {number|null}
 */
RPG_UsableItem.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_UsableItem.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//#endregion bonusHits

//#region cooldown
/**
 * The JABS cooldown when using this skill or item.
 * @type {number}
 */
Object.defineProperty(RPG_UsableItem.prototype, "jabsCooldown",
  {
    get: function()
    {
      return this.getJabsCooldown();
    },
  });

/**
 * Gets the JABS cooldown for this skill or item.
 * @returns {number}
 */
RPG_UsableItem.prototype.getJabsCooldown = function()
{
  return this.extractJabsCooldown()
};

/**
 * Gets the value from the notes.
 */
RPG_UsableItem.prototype.extractJabsCooldown = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Cooldown, true);
};
//#endregion cooldown
//#endregion RPG_UsableItem

//#region DataManager
/**
 * The global reference for the `JABS_Engine` data object.
 * @type {JABS_Engine}
 * @global
 */
var $jabsEngine = null;

/**
 * The global reference for the `Game_Enemies` data object.<br/>
 *
 * Unlike `$gameActors`, this is effectively a `Game_Enemy` factory rather than
 * a getter for `Game_Actor`s.
 * @type {Game_Enemies}
 * @global
 */
var $gameEnemies = null;

/**
 * The global reference for the `$dataMap` data object that contains all the replicable `JABS_Action`s.
 * @type {Map}
 * @global
 */
var $actionMap = null;

/**
 * Extends `createGameObjects()` to include creation of our global game objects
 */
J.ABS.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.ABS.Aliased.DataManager.createGameObjects.call(this);

  // update the skill master map to have data.
  DataManager.getSkillMasterMap();

  // instantiate the engine itself.
  $jabsEngine = new JABS_Engine();

  // setup the global access to the enemies database data.
  $gameEnemies = new Game_Enemies();
};

/**
 * Executes the retrieval of the skill master map from which we clone all action events.
 */
DataManager.getSkillMasterMap = function()
{
  const mapId = J.ABS.DefaultValues.ActionMap;
  if (mapId > 0)
  {
    const filename = "Map%1.json".format(mapId.padZero(3));
    this.loadSkillMasterMap("$dataMap", filename);
  }
  else
  {
    throw new Error("Missing skill master map.");
  }
};

/**
 * Retrieves the skill master map.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 */
DataManager.loadSkillMasterMap = function(name, src)
{
  const xhr = new XMLHttpRequest();
  const url = "data/" + src;
  xhr.open("GET", url);
  xhr.overrideMimeType("application/json");
  xhr.onload = () => this.onMapGet(xhr, name, src, url);
  xhr.onerror = () => this.gracefulFail(name, src, url);
  xhr.send();
};

/**
 * Retrieves the map data file from a given location.
 * @param {XMLHttpRequest} xhr The `xhr` service for fetching files from the local.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 * @param {string} url The path of the file to retrieve.
 */
DataManager.onMapGet = function(xhr, name, src, url)
{
  if (xhr.status < 400)
  {
    $actionMap = JSON.parse(xhr.responseText);
  }
  else
  {
    this.gracefulFail(name, src, url);
  }
};

/**
 * Gracefully fails and just logs it a missing file or whatever is the problem.
 * @param {string} name The name of the problemed file.
 * @param {string} src The source.
 * @param {string} url The path of the problemed file.
 */
DataManager.gracefulFail = function(name, src, url)
{
  console.error(name, src, url);
};
//#endregion


//TODO: move these to the input manager?
//#region Input
/**
 * The mappings of the gamepad descriptions to their buttons.
 */
J.ABS.Input = {};

// this section of inputs is an attempt to align with the internal RMMZ mapping convention.
J.ABS.Input.DirUp = "up";
J.ABS.Input.DirDown = "down";
J.ABS.Input.DirLeft = "left";
J.ABS.Input.DirRight = "right";
J.ABS.Input.Mainhand = "ok";
J.ABS.Input.Offhand = "cancel";
J.ABS.Input.Dash = "shift";
J.ABS.Input.Tool = "tab";
J.ABS.Input.GuardTrigger = "pagedown";
J.ABS.Input.SkillTrigger = "pageup";

// this section of inputs are newly implemented, and thus shouldn't
J.ABS.Input.MobilitySkill = "r2";
J.ABS.Input.StrafeTrigger = "l2";
J.ABS.Input.Quickmenu = "start";
J.ABS.Input.PartyCycle = "select";
J.ABS.Input.Debug = "cheat";

// for gamepads, these buttons are tracked, but aren't used by JABS right now.
J.ABS.Input.R3 = "r3";
J.ABS.Input.L3 = "l3";

// for keyboards, these buttons are for direct combatskill usage.
J.ABS.Input.CombatSkill1 = "combat-skill-1";
J.ABS.Input.CombatSkill2 = "combat-skill-2";
J.ABS.Input.CombatSkill3 = "combat-skill-3";
J.ABS.Input.CombatSkill4 = "combat-skill-4";

/**
 * OVERWRITE Defines gamepad button input to instead perform the various
 * actions that are expected in this ABS.
 *
 * This includes:
 * - D-Pad up, down, left, right
 * - A/cross, B/circle, X/square, Y/triangle
 * - L1/LB, R1/RB
 * - NEW: select/options, start/menu
 * - NEW: L2/LT, R2/RT
 * - NEW: L3/LSB, R3/RSB
 * - OVERWRITE: Y now is the tool button, and start is the menu.
 */
Input.gamepadMapper = {
  0: J.ABS.Input.Mainhand,      // cross
  1: J.ABS.Input.Offhand,        // circle
  2: J.ABS.Input.Dash,          // square
  3: J.ABS.Input.Tool,          // triangle

  4: J.ABS.Input.SkillTrigger,  // left bumper
  5: J.ABS.Input.GuardTrigger,  // right bumper
  6: J.ABS.Input.StrafeTrigger, // left trigger
  7: J.ABS.Input.MobilitySkill, // right trigger

  8: J.ABS.Input.PartyCycle,        // select
  9: J.ABS.Input.Quickmenu,         // start

  10: J.ABS.Input.L3,           // left stick button
  11: J.ABS.Input.R3,           // right stick button

  12: J.ABS.Input.DirUp,        // d-pad up
  13: J.ABS.Input.DirDown,      // d-pad down
  14: J.ABS.Input.DirLeft,      // d-pad left
  15: J.ABS.Input.DirRight,     // d-pad right
  // the analog stick should be natively supported for movement.
};

/**
 * Extends the existing mapper for keyboards to accommodate for the
 * additional skill inputs that are used for gamepads.
 */
Input.keyMapper = {
  // define the original keyboard mapping.
  ...Input.keyMapper,

  // this is the new debug move-through for use with JABS.
  192: J.ABS.Input.Debug,       // ` (backtick)

  // core buttons.
  90: J.ABS.Input.Mainhand,     // z
  88: J.ABS.Input.Offhand,      // x
  16: J.ABS.Input.Dash,         // shift (overwrite)
  67: J.ABS.Input.Tool,         // c

  // functional buttons.
  81: J.ABS.Input.SkillTrigger, // q
  17: J.ABS.Input.StrafeTrigger,// ctrl
  69: J.ABS.Input.GuardTrigger, // e
  9: J.ABS.Input.MobilitySkill,// tab (overwrite)

  // quickmenu button.
  13: J.ABS.Input.Quickmenu,    // enter (overwrite)

  // party cycling button.
  46: J.ABS.Input.PartyCycle,   // del

  // movement buttons.
  38: J.ABS.Input.DirUp,        // arrow up
  40: J.ABS.Input.DirDown,      // arrow down
  37: J.ABS.Input.DirLeft,      // arrow left
  39: J.ABS.Input.DirRight,     // arrow right

  // keyboard alternative for the multi-button skills.
  49: J.ABS.Input.CombatSkill1,       // 1 = L1 + cross
  50: J.ABS.Input.CombatSkill2,       // 2 = L1 + circle
  51: J.ABS.Input.CombatSkill3,       // 3 = L1 + square
  52: J.ABS.Input.CombatSkill4,       // 4 = L1 + triangle
};
//#endregion Input

//#region JABS_AiManager
/**
 * This static class manages all ai-controlled battlers while on the map.
 */
class JABS_AiManager
{
  /**
   * Constructor.
   * This is a static class.
   */
  constructor()
  {
    throw new Error("The JABS_AiManager is a static class.");
  }

  static debugActor(message, battler)
  {
    if (battler.isEnemy()) return;

    console.log(message, battler);
  }

  static debugEnemy(message, battler)
  {
    if (battler.isActor()) return;

    console.log(message, battler);
  }

  //#region update loop
  /**
   * Handles updating all the logic of the JABS engine.
   */
  static update()
  {
    // check if the AI manager can execute.
    if (!this.canUpdate()) return;

    // execute AI management.
    this.manageAi();
  }

  /**
   * Whether or not the ai manager can process an update.
   * @return {boolean} True if the manager can update, false otherwise.
   */
  static canUpdate()
  {
    // do not manage if the engine is paused.
    if ($jabsEngine.absPause) return false;

    // do not manage if the message window is up.
    if ($gameMessage.isBusy()) return false;

    // do not manage if the map is handling an event.
    if ($gameMap.isEventRunning()) return false;

    // update!
    return true;
  }

  /**
   * Define whether or not the player is engaged in combat with any of the current battlers.
   */
  static manageAi()
  {
    // grab all available battlers within a fixed range.
    const battlers = $gameMap.getBattlersWithinRange(
      $jabsEngine.getPlayer1(),
      J.ABS.Metadata.MaxAiUpdateRange);

    // if we have no battlers, then do not process AI.
    if (!battlers.length) return;

    // iterate over each battler available.
    battlers.forEach(this.handleBattlerAi, this);
  }

  /**
   * Handles the AI management of this battler.
   * @param {JABS_Battler} battler The battler to potentially handle AI of.
   */
  static handleBattlerAi(battler)
  {
    // check if we can manage the AI of this battler.
    if (!this.canManageAi(battler)) return;

    // execute the AI loop for this battler.
    this.executeAi(battler);
  }

  /**
   * Determines whether or not this battler can have its AI managed.
   * @param {JABS_Battler} battler The battler to check if AI is manageable.
   * @returns {boolean} True if the AI should be managed, false otherwise.
   */
  static canManageAi(battler)
  {
    // do not manage dead battlers.
    if (battler.isDead()) return false;

    // do not manage the player.
    if (battler.isPlayer()) return false;

    // do not manage inanimate battlers.
    if (battler.isInanimate()) return false;

    // manage that AI!
    return true;
  }

  /**
   * Executes the interactions specified by the combination of the AI mode bits.
   * @param {JABS_Battler} battler The battler executing on the AI mode.
   */
  static executeAi(battler)
  {
    // no AI is executed when waiting.
    if (battler.isWaiting()) return;

    // if the battler is engaged, then do AI things.
    if (battler.isEngaged())
    {
      // adjust the targets based on aggro and presence.
      battler.adjustTargetByAggro();

      // if we are no longer engaged due to removing dead aggros, then stop.
      if (!battler.isEngaged()) return;

      // don't try to idle while engaged.
      battler.setIdle(false);

      // determine the phase and perform actions accordingly.
      const phase = battler.getPhase();
      switch (phase)
      {
        case 1:
          this.aiPhase1(battler);
          break;
        case 2:
          this.aiPhase2(battler);
          break;
        case 3:
          this.aiPhase3(battler);
          break;
        default:
          this.aiPhase0(battler);
          break;
      }
    }
    else
    {
      // the battler is not engaged, instead just idle about.
      this.aiPhase0(battler);
    }
  }
  //#endregion update loop

  //#region Phase 0 - Idle Phase
  /**
   * The zero-th phase, when the battler is not engaged- it's idle action.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase0(battler)
  {
    // if the battler cannot idle, then do not idle.
    if (!battler.canIdle()) return;

    // grab whether or not the battler is currently idle.
    const isIdle = battler.isIdle();

    // check if the battler is currently not in-motion.
    if (battler.getCharacter().isStopping())
    {
      // check if the battler is alerted.
      if (battler.isAlerted())
      {
        // if stopped and alerted, then go try to find the one triggering the alert.
        this.seekForAlerter(battler);
        return;
      }
      // check if we aren't idle, and also aren't home.
      else if (!isIdle && !battler.isHome())
      {
        // try to go back towards the home coordinates.
        this.goHome(battler);
      }
      // check if we are idle (implicitly also home)
      else if (isIdle)
      {
        // move about idly.
        this.moveIdly(battler);
      }
    }
  }

  /**
   * If a battler is idle but alerted, then they will try to seek out what
   * disturbed their idling.
   * @param {JABS_Battler} battler The battler seeking for the alerter.
   */
  static seekForAlerter(battler)
  {
    // grab the x:y coordinates that we last "heard" the one triggering the alert from.
    const [alertX, alertY] = battler.getAlertedCoordinates();

    // attempt to move intelligently towards those coordiantes.
    battler.smartMoveTowardCoordinates(alertX, alertY);
  }

  /**
   * Progresses the battler towards their home coordinates.
   * @param {JABS_Battler} battler The battler going home.
   */
  static goHome(battler)
  {
    // grab the character of the battler trying to go home.
    const character = battler.getCharacter();

    // determine the next direction to face when going home.
    const nextDir = character.findDirectionTo(battler.getHomeX(), battler.getHomeY());

    // take a step in the right direction.
    character.moveStraight(nextDir);

    // check if we've made it home.
    if (battler.isHome())
    {
      // flag this battler as being idle.
      battler.setIdle(true);
    }
  }

  /**
   * Executes whatever the idle action is for this battler.
   * @param {JABS_Battler} battler The battler moving idly.
   */
  static moveIdly(battler)
  {
    // if we're not able to move idly, then do not.
    if (!this.canMoveIdly(battler)) return;

    // grab the character of the battler.
    const character = battler.getCharacter();

    // check if they are "close" to their home point.
    if (JABS_Battler.isClose(battler.distanceToHome()))
    {
      // move randomly.
      character.moveRandom();
    }
    // they are not "close" to their home point.
    else
    {
      // determine the direction to face to move towards home.
      const nextDir = character.findDirectionTo(battler.getHomeX(), battler.getHomeY());

      // move towards home.
      character.moveStraight(nextDir);
    }

    // reset the idle action counter.
    battler.resetIdleAction();
  }

  /**
   * Determiens whether or not this battler can move idly.
   * @param {JABS_Battler} battler The battler trying to move idly.
   * @returns {boolean} True if this battler can movie idly, false otherwise.
   */
  static canMoveIdly(battler)
  {
    // if we're not able to move idly, then do not.
    if (!battler.isIdleActionReady()) return false;

    // we idle about infrequently.
    if (!this.shouldMoveIdly()) return false;

    // idle about!
    return true;
  }

  /**
   * Determines whether or not RNG favored this battler to move.
   * @returns {boolean} True if we should take a step, false otherwise.
   */
  static shouldMoveIdly()
  {
    // roll a d100.
    const chance = (Math.randomInt(100) + 1);

    // need a nat100 to move.
    const shouldMove = (chance === 100);

    // to move or not to move?
    return shouldMove;
  }
  //#endregion Phase 0 - Idle Phase

  //#region Phase 1 - Pre-Action Movement Phase
  /**
   * Phase 1 for AI is the phase where the battler will count down its "prepare" timer.
   * While in this phase, the battler will make an effort to maintain a "safe" distance
   * from its current target.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase1(battler)
  {
    // check if the battler has their prepare timer ready for action.
    // if this battler is a follower that has a leader, it will automatically proceed.
    if (this.canTransitionToPhase2(battler))
    {
      // move to the next phase of AI.
      this.transitionToPhase2(battler);

      // stop processing.
      return;
    }

    // check if the battler is able to move and isn't moving.
    if (this.canDecidePhase1Movement(battler))
    {
      // move around as-necessary.
      this.decideAiMovement(battler);

      // stop processing.
      return;
    }

    // otherwise, we must be processing a movement command from before.
  }

  /**
   * Determines whether or not this battler is ready to transition to AI phase 2.
   * @param {JABS_Battler} battler The battler to transition.
   * @returns {boolean} True if this battler should transition, false otherwise.
   */
  static canTransitionToPhase2(battler)
  {
    // check if the battler has decided an action yet.
    if (!battler.isActionReady()) return false;

    // move to phase 2!
    return true;
  }

  /**
   * Transitions this battler to AI phase 2, action decision and repositioning.
   * @param {JABS_Battler} battler The battler to transition.
   */
  static transitionToPhase2(battler)
  {
    // move to the next phase of AI.
    battler.setPhase(2);
  }

  /**
   * Determines whether or not this battler can perform pre-action movement.
   * @param {JABS_Battler} battler The battler to move.
   * @returns {boolean} True if this battler should move, false otherwise.
   */
  static canDecidePhase1Movement(battler)
  {
    // check if the battler is currently moving.
    if (battler.getCharacter().isMoving()) return false;

    // check if the battler is unable to move.
    if (!battler.canBattlerMove()) return false;

    // move!
    return true;
  }

  /**
   * Moves the battler around in an effort to maintain a "comfortable" distance
   * away from their current target.
   * @param {JABS_Battler} battler The battler deciding movement strategy.
   */
  static decideAiMovement(battler)
  {
    // check if the distance is invalid or too great.
    if (this.shouldDisengageTarget(battler))
    {
      // just give up on this target.
      battler.disengageTarget();

      // stop processing.
      return;
    }

    // check if the battler is "close".
    this.maintainSafeDistance(battler);

    // check if we should turn towards the target.
    // NOTE: this prevents 100% always facing the target, preventing perma-parry.
    if (Math.randomInt(100) < 70)
    {
      // turn towards the target.
      battler.turnTowardTarget();
    }
  }

  /**
   * Determines whether or not this battler should disengage from its target
   * due to distancing concerns.
   * @param {JABS_Battler} battler The battler to disengage.
   * @returns {boolean} True if this battler needs to disengage, false otherwise.
   */
  static shouldDisengageTarget(battler)
  {
    // calculate the distance to this battler's current target.
    const distance = battler.distanceToCurrentTarget();

    // check if the distance is invalid.
    if (distance === null) return true;

    // check if the distance arbitrarily is too great.
    if (distance > 15) return true;

    // check if the distance is outside of the pursuit radius of this battler.
    if (battler.getPursuitRadius() < distance) return true;

    // do not disengage.
    return false;
  }

  /**
   * This battler will attempt to keep a "safe" distance of not-too-far and
   * not-too-close to its target.
   * @param {JABS_Battler} battler The battler to do the distancing.
   */
  static maintainSafeDistance(battler)
  {
    // calculate the distance to this battler's current target.
    const distance = battler.distanceToCurrentTarget();

    // if we are safe, then do nothing.
    if (JABS_Battler.isSafe(distance)) return;

    switch (true)
    {
      case JABS_Battler.isClose(distance):
        battler.smartMoveAwayFromTarget();
        break;
      case JABS_Battler.isFar(distance):
        battler.smartMoveTowardTarget();
        break;
    }
  }
  //#endregion Phase 1 - Pre-Action Movement Phase

  //#region Phase 2 - Execute Action Phase
  /**
   * Phase 2 for AI is the phase where the battler will decide adn execute its action.
   * While in this phase, the battler will decide its action, and attempt to move
   * into the required range to execute the action if necessary and execute it.
   * @param {JABS_Battler} battler The `JABS_Battler`.
   */
  static aiPhase2(battler)
  {
    // check if the distance is invalid or too great.
    if (this.shouldDisengageTarget(battler))
    {

      // just give up on this target.
      battler.disengageTarget();

      // stop processing.
      return;
    }

    // check if the battler has decided their action yet.
    if (this.needsActionDecision(battler))
    {

      // make a decision about what to do.
      this.decideAiPhase2Action(battler);

      // stop processing.
      return;
    }

    // check if we need to reposition.
    if (this.needsRepositioning(battler))
    {

      // move into a better position based on the decided action.
      this.decideAiPhase2Movement(battler);

      // stop processing.
      return;
    }

    // check if we're ready to execute actions.
    if (this.needsActionExecution(battler))
    {
      // execute the decided action.
      this.executeAiPhase2Action(battler);
    }
  }

  /**
   * Determines whether or not this battler needs to decide an action.
   * @param {JABS_Battler} battler The battler to decide an action.
   * @returns {boolean} True if this battler needs to decide, false otherwise.
   */
  static needsActionDecision(battler)
  {
    // check if the battler has not yet decided an action.
    if (!battler.isActionDecided()) return true;

    // battler already has already made a decision.
    return false;
  }

  /**
   * Determines whether or not this battler needs to get into position.
   * @param {JABS_Battler} battler The battler to reposition.
   * @returns {boolean} True if this battler needs to move, false otherwise.
   */
  static needsRepositioning(battler)
  {
    // check if the battler is currently busy with another action like moving or casting.
    const isBusy = battler._event.isMoving() || battler.isCasting();

    // check if the battler is able to move.
    const isAble = battler.canBattlerMove();

    // check if the battler is already in-position.
    const alreadyInPosition = battler.isInPosition()

    // if the battler isn't busy, is able, and not already in position, then reposition!
    if (!isBusy && !alreadyInPosition && isAble) return true;

    // battler is fine where they are at.
    return false;
  }

  /**
   * Determines whether or not this battler needs to execute queued actions.
   * @param {JABS_Battler} battler The battler to take action.
   * @returns {boolean} True if this battler needs to take action, false otherwise.
   */
  static needsActionExecution(battler)
  {
    // check if this battler has decided on an action to take.
    if (!battler.isActionDecided()) return false;

    // check if this battler is in position.
    if (!battler.isInPosition()) return false;

    // check if the battler is still casting.
    if (battler.isCasting()) return false;

    // we need action!
    return true;
  }

  /**
   * Execute the decided queued actions for this battler.
   * @param {JABS_Battler} battler The battler to take action.
   */
  static executeAiPhase2Action(battler)
  {
    // face the target to execute the action.
    battler.turnTowardTarget();

    // execute the queued action.
    battler.processQueuedActions();

    // force a wait of 1/3 a second.
    battler.setWaitCountdown(20);

    // switch to cooldown phase.
    battler.setPhase(3);
  }

  /**
   * The battler decides what action to execute.
   * @param {JABS_Battler} battler The battler deciding the actions.
   */
  static decideAiPhase2Action(battler)
  {
    this.decideEnemyAiPhase2Action(battler);
  }

  /**
   * The enemy battler decides what action to take.
   * Based on it's AI traits, it will make a decision on an action to take.
   * @param {JABS_Battler} battler The enemy battler deciding the action.
   */
  static decideEnemyAiPhase2Action(battler)
  {
    // grab the AI object belonging to this battler.
    const ai = battler.getAiMode();

    // extract the AI from this battler.
    const {careful, executor, reckless, healer, follower, leader} = ai;

    // check if the battler has the "leader" ai trait.
    if (leader)
    {
      // decide actions for all nearby followers.
      this.decideActionsForFollowers(battler);

      // fall through and continue with your own actions!
    }

    // check if the battler has the "follower" ai trait.
    if (follower)
    {
      // decide the skill and set it up for this follower.
      this.decideFollowerAi(battler);

      // stop processing.
      return;
    }

    // check if the battler has the "healer" ai trait.
    // battlers with "careful" will leverage that while deciding healing skills.
    if (healer)
    {
      // decide the skill and set it up for this battler.
      this.decideHealerAi(battler);

      // stop processing.
      return;
    }

    /*
    * It is important to note here that you can have "careful" and other above ai traits.
    * "careful" will impact how the above are decided.
    */

    // check if the battler has the "careful" or "executor" ai trait.
    if (careful || executor)
    {
      // decide an attack skill from the available skills.
      this.decideAggressiveAi(battler);

      // stop processing.
      return;
    }

    // check if the battler has the "reckless" ai trait.
    if (reckless)
    {
      // decide a random skill from the available skills.
      this.decideRecklessAi(battler);

      // stop processing.
      return;
    }

    // process generic AI decision making.
    this.decideGenericAi(battler);
  }

  //#region ai:leader
  /**
   * Decides the next action for all applicable followers.
   * @param {JABS_Battler} leader The leader to make decisions with.
   */
  static decideActionsForFollowers(leader)
  {
    // grab all nearby followers.
    const nearbyFollowers = $gameMap.getNearbyFollowers(leader);

    // iterate over each found follower.
    nearbyFollowers.forEach(follower => this.decideActionForFollower(leader, follower));
  }

  /**
   * Decides the next action for a follower.
   * @param {JABS_Battler} leader The leader battler.
   * @param {JABS_Battler} follower The follower battler potentially being lead.
   */
  static decideActionForFollower(leader, follower)
  {
    // leaders can't control other leaders' followers.
    if (!this.canDecideActionForFollower(leader, follower)) return;

    // assign the follower to this leader.
    if (!follower.hasLeader())
    {
      follower.setLeader(leader.getUuid());
    }

    // grab the leader's AI.
    const leaderAi = leader.getAiMode();

    // decide the action of the follower for them.
    const followerAction = leaderAi.decideActionForFollower(leader, follower);

    // check if we found a valid action for the follower.
    if (followerAction)
    {
      // set it as their next action.
      follower.setLeaderDecidedAction(followerAction);
    }
  }

  /**
   * Determines whether or not this leader can lead the given follower.
   * @param {JABS_Battler} leader The leader battler.
   * @param {JABS_Battler} follower The follower battler potentially being lead.
   * @returns {boolean} True if this leader can lead this follower, false otherwise.
   */
  static canDecideActionForFollower(leader, follower)
  {
    // check if the follower and the leader are actually the same.
    if (leader === follower)
    {
      // you are already in control, bro.
      return false;
    }

    // check if the follower exists.
    if (!follower)
    {
      // there is nothing to control.
      return false;
    }

    // check if the follower is a leader themself.
    if (follower.getAiMode().leader)
    {
      // leaders cannot control leaders.
      return false;
    }

    // check if the follower has a leader that is different than this leader.
    if (follower.hasLeader() && follower.getLeader() !== leader.getUuid())
    {
      // stop trying to boss other leader's followers around!
      leader.removeFollower(follower.getUuid());

      // they are already under control.
      return false;
    }

    // lead this follower!
    return true;
  }
  //#endregion ai:leader

  //#region ai:follower
  /**
   * Handles how a follower decides its next action to take while engaged.
   *
   * NOTE:
   * If a follower has a leader, they will wait until the leader gives commands
   * to execute them. This means that the follower's turn speed will be reduced
   * to match the leader if necessary.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideFollowerAi(battler)
  {
    // check if we have a leader ready to guide us.
    if (this.hasLeaderReady(battler))
    {
      // let the leader decide what this battler should do.
      this.decideFollowerAiByLeader(battler);
    }
    // we have no leader.
    else
    {
      // only basic attacks for this battler.
      this.decideFollowerAiBySelf(battler);
    }
  }

  /**
   * Determines whether or not this battler has a leader ready to guide them.
   * @param {JABS_Battler} battler The battler deciding the action.
   * @returns {boolean} True if this battler has a ready leader, false otherwise.
   */
  static hasLeaderReady(battler)
  {
    // check if we have a leader.
    if (!battler.hasLeader()) return false;

    // check to make sure we can actually retrieve the leader.
    if (!battler.getLeaderBattler()) return false;

    // check to make sure that leader is still engaged in combat.
    if (!battler.getLeaderBattler().isEngaged()) return false;

    // let the leader decide!
    return true;
  }

  /**
   * Allows the leader to decide this follower's next action to take.
   * @param {JABS_Battler} battler The follower that is allowing a leader to decide.
   */
  static decideFollowerAiByLeader(battler)
  {
    // show the balloon that we are processing leader actions instead.
    battler.showBalloon(J.ABS.Balloons.Check);

    // we have an engaged leader.
    const leaderDecidedSkillId = battler.getNextLeaderDecidedAction();

    // check if we decided on a skill.
    if (!leaderDecidedSkillId || leaderDecidedSkillId.length)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(leaderDecidedSkillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, leaderDecidedSkillId, cooldownKey);
  }

  /**
   * Allows the follower to decide their own next action to take.
   * It is always a basic attack.
   * @param {JABS_Battler} battler The follower that is deciding for themselves.
   */
  static decideFollowerAiBySelf(battler)
  {
    // only basic attacks for this battler.
    const [basicAttackSkillId] = battler.getEnemyBasicAttack();

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(basicAttackSkillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, basicAttackSkillId, cooldownKey);
  }
  //#endregion ai:follower

  //#region ai:healer
  /**
   * Handles how a healer decides its next action to take while engaged.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideHealerAi(battler)
  {
    // get all skills available to this enemy.
    const skillsToUse = battler.getSkillIdsFromEnemy();

    // determine the best support action to use.
    const skillId = battler.getAiMode().decideSupportAction(battler, skillsToUse);

    // check if we decided on a skill.
    if (!skillId)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(skillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, skillId, cooldownKey);
  }
  //#endregion ai:healer

  //#region ai:careful/executor
  /**
   * Handles how a batler decides its next action to take while engaged.
   * "Smart" battlers will try to use skills that are known to be strong/effective
   * against their targets.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideAggressiveAi(battler)
  {
    // get all skills available to this enemy.
    const skillsToUse = battler.getAllSkillIdsFromEnemy();

    // determine the best attack action to use.
    const skillId = battler.getAiMode().decideAttackAction(battler, skillsToUse) ?? 0;

    // check if we decided on a skill.
    if (!skillId)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(skillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, skillId, cooldownKey);
  }
  //#endregion ai:careful/executor

  //#region ai:reckless
  /**
   * Handles how a battler decides its next action while engaged.
   * "Reckless" battlers will always try to use a skill instead of their basic attack.
   * If an enemy with reckless does not have any skills to use, it will default to
   * its own basic attack instead.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideRecklessAi(battler)
  {
    // get all skills (excluding basic attack) available to this enemy.
    const skillsToUse = battler.getSkillIdsFromEnemy();

    // check if we decided on a skill.
    if (!skillsToUse || !skillsToUse.length)
    {
      console.warn('a battler with the "reckless" trait was found with no skills.', battler);
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // determine the best attack action to use.
    const skillId = battler.getAiMode().decideAttackAction(battler, skillsToUse);

    if (!this.isSkillIdValid(skillId))
    {
      // cancel the setup if we can't use any skills while being reckless!
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(skillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, skillId, cooldownKey);
  }

  /**
   *
   * @param {number|number[]} skillId The skill id or ids to validate.
   * @returns {boolean} True if the skill id is
   */
  static isSkillIdValid(skillId)
  {
    // if the skill id is something falsy like 0/null/undefined, not valid.
    if (!skillId) return false;

    // check if the "skill id" is actually an array of them.
    if (Array.isArray(skillId))
    {
      // the length of the skill id array is 0, not valid.
      if (!skillId.length) return false;
    }

    // skill id is valid!
    return true;
  }
  //#endregion ai:reckless

  //#region ai:unassigned
  /**
   * HAndles how a battler decides its next action while engaged.
   * When a battler has no special ai traits, it'll just pick a random skill
   * from its list of skills with a 50% chance of instead using its basic attack.
   * @param {JABS_Battler} battler The battler to decide actions.
   */
  static decideGenericAi(battler)
  {
    // get all skills available to this enemy.
    const skillsToUse = battler.getSkillIdsFromEnemy();

    // determine the best attack action to use.
    let skillId = skillsToUse[Math.randomInt(skillsToUse.length)];

    // 50% chance of just using the basic attack instead.
    if (Math.randomInt(2) === 0)
    {
      // grab this enemy's basic attack.
      const [basicAttackSkillId] = battler.getEnemyBasicAttack();

      // overwrite the random skill with the basic attack.
      skillId = basicAttackSkillId;
    }

    // check if we decided on a skill.
    if (!skillId)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown key from the skill.
    const cooldownKey = this.buildEnemyCooldownType($dataSkills[skillId]);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, skillId, cooldownKey);
  }
  //#endregion ai:unassigned

  /**
   * Sets up the battler and the action in preparation for the next phase.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {number} skillId The id of the skill to perform the action for.
   * @param {string} cooldownKey The type of cooldown to set to the action.
   */
  static setupActionForNextPhase(battler, skillId, cooldownKey)
  {
    // check if we can setup this action.
    if (!this.canSetupActionForNextPhase(battler, skillId))
    {
      // cancel the action setup.
      this.cancelActionSetup(battler);

      // do not process.
      return;
    }

    // generate the actions based on the given skill id.
    const actions = battler.createJabsActionFromSkill(skillId);

    // set the cooldown type for all actions.
    actions.forEach(action => action.setCooldownType(cooldownKey));

    // determine the "primary" action.
    const action = actions[0];

    // perform the execution animation.
    this.performExecutionAnimation(battler, action);

    // set an arbitrary 1/3 second wait after setup.
    battler.setWaitCountdown(20);

    // set the cast time of this skill.
    battler.setCastCountdown(action.getCastTime());

    // set the decided action.
    battler.setDecidedAction(actions);
  }

  /**
   * Constructs a cooldown key based on the skill.
   * @param {RPG_Skill} skill The chosen skill to determine a cooldown type for.
   * @returns {string} The cooldown key.
   */
  static buildEnemyCooldownType(skill)
  {
    return `${skill.id}-${skill.name}`;
  }

  /**
   * Determines whether or not the given skill can be transformed into an action
   * by the given battler.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {number} skillId The id of the skill to perform the action for.
   * @returns {boolean} True if we can setup an action with this skill id, false otherwise.
   */
  static canSetupActionForNextPhase(battler, skillId)
  {
    // check if we even have a skill to setup.
    if (!skillId) return false;

    // check if this battler can execute this skill.
    if (!battler.canExecuteSkill(skillId)) return false;

    // setup the action!
    return true;
  }

  /**
   * Cancel the setup process for this battler.
   * @param {JABS_Battler} battler The battler canceling the action.
   */
  static cancelActionSetup(battler)
  {
    // set the decided action to null.
    battler.setDecidedAction(null);

    // if we can't setup this skill for some reason, then wait before trying again.
    battler.setWaitCountdown(20);
  }

  /**
   * Performs a brief animation to indicate that the battler has decided an action.
   * The animation depends on whether or not the action was a support action or not.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {JABS_Action} action The action used to gauge which animation to show.
   */
  static performExecutionAnimation(battler, action)
  {
    // check if this action is a support action.
    if (action.isSupportAction())
    {
      // show the "support decision" animation on the battler.
      battler.showAnimation(J.ABS.Metadata.SupportDecidedAnimationId)
    }
    // the action is not a support action.
    else
    {
      // show the "attack decision" animation on the battler.
      battler.showAnimation(J.ABS.Metadata.AttackDecidedAnimationId)
    }
  }

  /**
   * The battler attempts to move into a position where they can execute
   * their decided skill and land a hit.
   * @param {JABS_Battler} battler The battler trying to get into position.
   */
  static decideAiPhase2Movement(battler)
  {
    // check if we can actually perform phase 2 movement.
    if (!this.canPerformPhase2Movement(battler)) return;

    // check if we need to move closer.
    if (this.needsToMoveCloser(battler))
    {
      // get closer to the target so we can execute the skill.
      this.phase2MoveCloser(battler);
    }
    // the battler is close enough.
    else
    {
      // flag this battler as in-position to execute.
      battler.setInPosition(true);
    }
  }

  /**
   * Determines whether or not this battler can (or needs to) perform ai phase 2 movement.
   * @param {JABS_Battler} battler The battler to check if movement is needed.
   * @returns {boolean} True if this battler needs to move closer, false otherwise.
   */
  static canPerformPhase2Movement(battler)
  {
    // check if this battler has decided on an action yet.
    if (!battler.isActionDecided()) return false;

    // check if we're already in position.
    if (battler.isInPosition()) return false;

    // move closer!
    return true;
  }

  /**
   * Determines whether or not to move closer in AI phase 2.
   * @param {JABS_Battler} battler The battler to check if movement is needed.
   * @returns {boolean} True if this battler needs to move closer, false otherwise.
   */
  static needsToMoveCloser(battler)
  {
    // grab the action.
    const [action,] = battler.getDecidedAction();

    // check if the action is self-targeting; we can cast these wherever.
    if (action.isForSelf()) return false;

    // calculate distance to target to determine if we need to get closer.
    const distanceToTarget = battler.getAllyTarget()
      ? battler.distanceToAllyTarget()
      : battler.distanceToCurrentTarget();

    // check if we are further away than the minimum proximity.
    if (distanceToTarget > action.getProximity()) return true;

    // no need to move.
    return false;
  }

  /**
   * Moves this battler closer to the relevant target.
   * @param {JABS_Battler} battler The battler to move.
   */
  static phase2MoveCloser(battler)
  {
    // check if this battler has an ally target first.
    if (battler.getAllyTarget())
    {
      // move towards the ally.
      battler.smartMoveTowardAllyTarget();
    }
    // this battler does not have an ally target.
    else
    {
      // move towards the target instead.
      battler.smartMoveTowardTarget();
    }
  }
  //#endregion Phase 2 - Execute Action Phase

  //#region Phase 3 - Post-Action Cooldown Phase
  /**
   * Phase 3 for AI is the phase where the battler is cooling down from its skill usage.
   * While in this phase, the battler will attempt to maintain a "safe" distance from
   * its current target.
   * @param {JABS_Battler} battler The battler for this AI.
   */
  static aiPhase3(battler)
  {
    // check if we are ready for a phase reset.
    if (this.canResetAiPhases(battler))
    {
      // AI loop complete, reset back to phase 1.
      this.resetAiPhases(battler);
    }
    // the battler's post-action cooldown is not finished.
    else
    {
      // check if they are able to move while cooling down.
      if (this.canPerformPhase3Movement(battler))
      {
        // move around while you're waiting for the cooldown.
        this.decideAiPhase3Movement(battler);
      }
    }
  }

  /**
   * Determines wehther or not this battler is ready to reset its AI phases.
   * @param {JABS_Battler} battler The battler to reset phases for.
   * @returns {boolean} True if the battler is ready to reset, false otherwise.
   */
  static canResetAiPhases(battler)
  {
    // check if the battler's cooldown is complete.
    if (!battler.isPostActionCooldownComplete()) return false;

    // ready for reset!
    return true;
  }

  /**
   * Resets the phases for this battler back to phase 1.
   * @param {JABS_Battler} battler The battler to reset phases for.
   */
  static resetAiPhases(battler)
  {
    // AI loop complete, reset back to phase 1.
    battler.resetPhases();
  }

  /**
   * Determines whether or not this battler can move around while waiting for
   * its AI phase reset.
   * @param {JABS_Battler} battler The battler to move.
   * @returns {boolean} True if the battler can move, false otherwise.
   */
  static canPerformPhase3Movement(battler)
  {
    // check if the battler is able to move.
    if (!battler.canBattlerMove()) return false;

    // check if the battler is currently moving.
    if (battler._event.isMoving()) return false;

    // move!
    return true;
  }

  /**
   * Decides where to move while waiting for cooldown to complete from the skill.
   * @param {JABS_Battler} battler The battler in this cooldown phase.
   */
  static decideAiPhase3Movement(battler)
  {
    // move around as-necessary.
    this.decideAiMovement(battler);
  }

  //#endregion Phase 3 - Post-Action Cooldown Phase
}
//#endregion JABS_AiManager

//#region Game_Action
/**
 * OVERWRITE In the context of this `Game_Action`, for non-allies, it should
 * instead return the $dataEnemies data instead of the $gameTroop data because
 * the troop doesn't exist on the map.
 */
Game_Action.prototype.subject = function()
{
  let subject;
  if (this._subjectActorId > 0)
  {
    subject = $gameActors.actor(this._subjectActorId)
  }
  else
  {
    subject = $gameEnemies.enemy(this._subjectEnemyIndex);
  }
  return subject;
};

/**
 * OVERWRITE In the context of this `Game_Action`, overwrites the function for
 * setting the subject to reference the $dataEnemies, a new global object reference
 * for the database tab of enemies instead of referencing the troop.
 * @param {Game_Actor|Game_Enemy} subject The subject to work with.
 */
Game_Action.prototype.setSubject = function(subject)
{
  if (subject.isActor())
  {
    this._subjectActorId = subject.actorId();
    this._subjectEnemyIndex = -1;
  }
  else if (subject.isEnemy())
  {
    this._subjectEnemyIndex = subject.enemyId();
    this._subjectActorId = 0;
  }
};

/**
 * Gets the parry rate for a given battler.
 * @param {Game_Battler} target The target to check the parry rate for.
 */
Game_Action.prototype.itemPar = function(target)
{
  return (target.grd - 1).toFixed(3);
};

/**
 * Rounds the result of the damage calculations when executing skills.
 */
J.ABS.Aliased.Game_Action.makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical)
{
  let base = J.ABS.Aliased.Game_Action.makeDamageValue.call(this, target, critical);

  const player = $jabsEngine.getPlayer1();
  const isPlayer = player.getBattler() === target;
  if (isPlayer)
  {
    // currently, only the player can properly defend like this.
    base = this.handleGuardEffects(base, player);
  }

  return base;
};

/**
 * OVERWRITE Rewrites the handling of applying states to targets.
 *
 * Passes the attacker as another data point to the application of state.
 * @param {Game_Battler} target The target.
 * @param {rm.types.Effect} effect The potential effect to add.
 */
Game_Action.prototype.itemEffectAddAttackState = function(target, effect)
{
  for (const stateId of this.subject().attackStates())
  {
    let chance = effect.value1;
    chance *= target.stateRate(stateId);
    chance *= this.subject()
      .attackStatesRate(stateId);
    chance *= this.lukEffectRate(target);
    if (Math.random() < chance)
    {
      target.addState(stateId, this.subject());
      this.makeSuccess(target);
    }
  }
};

/**
 * OVERWRITE Rewrites the handling of applying states to targets.
 *
 * Passes the attacker as another data point to the application of state.
 * @param {Game_Battler} target The target.
 * @param {rm.types.Effect} effect The potential effect to add.
 */
Game_Action.prototype.itemEffectAddNormalState = function(target, effect)
{
  let chance = effect.value1;
  if (!this.isCertainHit())
  {
    chance *= target.stateRate(effect.dataId);
    chance *= this.lukEffectRate(target);
  }
  if (Math.random() < chance)
  {
    target.addState(effect.dataId, this.subject());
    this.makeSuccess(target);
  }
};

/**
 * Intercepts the action result and prevents adding states entirely if precise-parried
 * by the player.
 */
J.ABS.Aliased.Game_Action.itemEffectAddState = Game_Action.prototype.itemEffectAddState;
Game_Action.prototype.itemEffectAddState = function(target, effect)
{
  const player = $jabsEngine.getPlayer1();
  const isPlayer = player.getBattler() === target;
  if (isPlayer)
  {
    // if it is the player, peek at the result before applying.
    const result = player.getBattler().result();

    // if the player precise-parried the action, no status effects applied.
    if (result.parried) return;
  }

  // if the precise-parry-state-prevention wasn't successful, apply as usual.
  J.ABS.Aliased.Game_Action.itemEffectAddState.call(this, target, effect);
};

/**
 * Handles all guard-related effects, such as parrying or guarding.
 * @param {number} damage The amount of damage before damage reductions.
 * @param {JABS_Battler} jabsBattler The battler potentially doing guard things..
 * @returns {number} The amount of damage after damage reductions from guarding.
 */
Game_Action.prototype.handleGuardEffects = function(damage, jabsBattler)
{
  // check if the battler is parrying; parrying takes priority over guarding.
  if (jabsBattler.parrying())
  {
    // process the parry functionality.
    this.processParry(jabsBattler);

    // calculate the reduced amount from guarding.
    const parryReducedDamage = this.calculateParryDamageReduction(jabsBattler, damage);

    // return the reduced amount.
    return parryReducedDamage;
  }

  // check if the battler is guarding.
  if (jabsBattler.guarding())
  {
    // process the guard functionality.
    this.processGuard(jabsBattler);

    // calculate the reduced amount from guarding.
    const guardReducedDamage = this.calculateGuardDamageReduction(jabsBattler, damage);

    // return the reduced amount.
    return guardReducedDamage;
  }

  // if there was no guarding or parrying happen, just return the original damage.
  return damage;
};

/**
 * Processes the action as a parry, mitigating all damage, along
 * with any additional side effects.
 * @param {JABS_Battler} jabsBattler The battler that is parrying.
 */
Game_Action.prototype.processParry = function(jabsBattler)
{
  // shorthand the underlying battler.
  const battler = jabsBattler.getBattler();

  // grab the action result.
  const actionResult = battler.result();

  // nullify the result via parry.
  actionResult.parried = true;

  // perform on-parry effects.
  this.onParry(jabsBattler);

  // TODO: pull the parry logic out of the requestanimation function.
  // play the parry animation.
  jabsBattler.getCharacter().requestAnimation(0, true);

  // reset the player's guarding.
  jabsBattler.setParryWindow(0);
  jabsBattler.setGuardSkillId(0);
};

/**
 * A hook to perform actions on-parry.
 * @param {JABS_Battler} jabsBattler The battler that is parrying.
 */
Game_Action.prototype.onParry = function(jabsBattler)
{
  // handle tp generation from parrying.
  const guardSkillTp = this.getTpFromGuardSkill(jabsBattler) * 10;

  // gain 10x of the tp from the guard skill when parrying.
  jabsBattler.getBattler().gainTp(guardSkillTp);
};

/**
 * Calculates the damage reduction from parrying.
 * @param {JABS_Battler} jabsBattler The battler that is parrying.
 * @param {number} originalDamage The original amount of damage.
 * @returns {number} The damage after reduction.
 */
Game_Action.prototype.calculateParryDamageReduction = function(jabsBattler, originalDamage)
{
  // assign the damage to a local variable because good coding practices.
  let modifiedDamage = originalDamage;

  // parry damage reduction is always 100%.
  modifiedDamage = 0;

  // return the parry-modified damage.
  return modifiedDamage;
};

/**
 * Processes the action as a guard, reducing damage along with any
 * additional side effects.
 * @param {JABS_Battler} jabsBattler The battler that is guar1ding.
 */
Game_Action.prototype.processGuard = function(jabsBattler)
{
  // perform on-guard effects.
  this.onGuard(jabsBattler);
};

/**
 * A hook to perform actions on-guard.
 * @param {JABS_Battler} jabsBattler The battler that is guarding.
 */
Game_Action.prototype.onGuard = function(jabsBattler)
{
  // gain any tp associated with defending.
  const guardSkillTp = this.getTpFromGuardSkill(jabsBattler);

  // gain 100% of the tp from the guard skill when guarding.
  jabsBattler.getBattler().gainTp(guardSkillTp);
};

/**
 * Calculates the damage reduction from guarding.
 * @param {JABS_Battler} jabsBattler The battler that is guarding.
 * @param {number} originalDamage The original amount of damage.
 * @returns {number} The damage after reduction.
 */
Game_Action.prototype.calculateGuardDamageReduction = function(jabsBattler, originalDamage)
{
  // assign the damage to a local variable because good coding practices.
  let modifiedDamage = originalDamage;

  // reduce the damage accordingly per the guard data- percent then flat.
  modifiedDamage = this.percDamageReduction(modifiedDamage, jabsBattler);
  modifiedDamage = this.flatDamageReduction(modifiedDamage, jabsBattler);

  // return the guard-modified damage.
  return modifiedDamage;
};

/**
 * Gets the TP from the guard skill that was performed.
 * @param {JABS_Battler} jabsBattler The battler that is defending.
 * @return {number} The TP
 */
Game_Action.prototype.getTpFromGuardSkill = function(jabsBattler)
{
  // handle tp generation from the guard skill.
  const skillId = jabsBattler.getGuardSkillId();

  // grab the potentially extended guard skill.
  const skill = jabsBattler.getSkill(skillId);

  // if timing is just a hair off, the guarding skill won't be available.
  if (!skill) return 0;

  // return the tp associated with the guard skill.
  return skill.tpGain;
};

/**
 * Reduces damage of a value if defending- by a flat amount.
 * @param {number} base The base damage value to modify.
 * @param {JABS_Battler} player The player's JABS battler.
 * @returns {number} The damage after reduction.
 */
Game_Action.prototype.flatDamageReduction = function(base, player)
{
  // calculate the flat reduction.
  const reduction = parseFloat(player.flatGuardReduction());

  // grab the action result for updating.
  const result = player.getBattler().result();

  // take note of the flat amount reduced in the action result.
  result.reduced += reduction;

  // prevent reducing the damage into healing instead.
  const flatReducedDamage = Math.max((base + reduction), 0);

  // return the reduced amount of damage.
  return flatReducedDamage;
};

/**
 * Reduces damage of a value if defending- by a percent amount.
 * @param {number} baseDamage The base damage value to modify.
 * @param {JABS_Battler} jabsBattler The battler reducing damage.
 * @returns {number} The damage after reduction.
 */
Game_Action.prototype.percDamageReduction = function(baseDamage, jabsBattler)
{
  // calculate the percent reduction.
  const reduction = parseFloat(baseDamage - ((100 + jabsBattler.percGuardReduction()) / 100) * baseDamage);

  // grab the action result for updating.
  const actionResult = jabsBattler.getBattler().result();

  // take note of the percent amount reduced in the action result.
  actionResult.reduced -= reduction;

  // prevent reducing the damage into healing instead.
  const percentReducedDamage = Math.max((baseDamage - reduction), 0);

  // return the reduced amount of damage.
  return percentReducedDamage;
};

/**
 * OVERWRITE Replaces the hitrate formula with a standardized one that
 * makes it so the default is NOT to miss with half of your swings just
 * because you don't have +100% hit rate on every single skill.
 * @returns {number}
 */
Game_Action.prototype.itemHit = function()
{
  // success is a multiplier against the hitrate.
  const successFactor = this.item().successRate * 0.01;

  // calculate the hitrate factor.
  const hitRate = successFactor * this.subject().hit;

  // return the hitrate factor.
  return hitRate;
};

/**
 * OVERWRITE Alters this functionality to be determined by attacker's hit vs target's evade.
 * @param {Game_Battler} target The target of this action.
 * @returns {number}
 */
Game_Action.prototype.itemEva = function(target)
{
  switch (true)
  {
    case (this.isPhysical()):
      return target.eva;
    case (this.isMagical()):
      return target.mev;
    default:
      return 0;
  }
};

/**
 * OVERWRITE Adjusts how a skill is applied against the target in the context of JABS.
 */
J.ABS.Aliased.Game_Action.apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target)
{
  if ($jabsEngine.absEnabled)
  {
    this.applySkill(target);
  }
  else
  {
    J.ABS.Aliased.Game_Action.apply.call(this, target);
  }
};

/**
 * Applies a skill against the target.
 * This is effectively Game_Action.apply, but with some adjustments to accommodate
 * the fact that we're using this in an action battle system instead.
 *
 * "Missed" is no longer a possibility. It is false 100% of the time.
 * @param {Game_Battler} target The target the skill is being applied to.
 */
Game_Action.prototype.applySkill = function(target)
{
  const result = target.result();
  this.subject().clearResult();
  result.clear();
  result.used = this.testApply(target);
  result.evaded = !this.calculateHitSuccess(target);
  result.physical = this.isPhysical();
  result.drain = this.isDrain();
  if (result.isHit())
  {
    // check if there is a damage formula.
    if (this.item().damage.type > 0)
    {
      // determine if its a critical hit.
      result.critical = Math.random() < this.itemCri(target);

      // calculate the damage.
      const value = this.makeDamageValue(target, result.critical);

      // actually apply the damage to the target.
      this.executeDamage(target, value);
    }

    // add the subject who is applying the state as a parameter for tracking purposes.
    this.item().effects.forEach(effect => this.applyItemEffect(target, effect));

    // applies on-cast/on-hit effects, like gaining TP or producing on-cast states.
    this.applyItemUserEffect(target);

    // applies common events that may be a part of a skill's effect.
    this.applyGlobal();
  }

  // also update the last target hit.
  this.updateLastTarget(target);
};

/**
 * Calculates whether or not the attacker was precise enough to land the hit.
 * If this returns false, the result is that the skill was evaded.
 * @param {Game_Battler} target The target the skill is being applied to.
 * @returns {boolean}
 */
Game_Action.prototype.calculateHitSuccess = function(target)
{
  // hit rate gets a bonus between 0-1.
  const hitRate = Math.random() + this.itemHit();

  // grab the evade rate of the target based on the action.
  const evadeRate = this.itemEva(target);

  // determine the success.
  const success = (hitRate - evadeRate) > 0;

  // return our outcome.
  return success;
};
//#endregion Game_Action

//#region Game_ActionResult
/**
 * Extends {@link Game_ActionResult.initialize}.
 * Initializes additional members.
 */
J.ABS.Aliased.Game_ActionResult.set('initialize', Game_ActionResult.prototype.initialize);
Game_ActionResult.prototype.initialize = function()
{
  /**
   * Whether or not the result was parried.
   * @type {boolean}
   */
  this.parried = false;

  /**
   * The amount of damage reduced by guarding.
   * @type {number}
   */
  this.reduced = 0;

  // perform original logic.
  J.ABS.Aliased.Game_ActionResult.get('initialize').call(this);
};

/**
 * Extends `.clear()` to include wiping the custom properties.
 */
J.ABS.Aliased.Game_ActionResult.set('clear', Game_ActionResult.prototype.clear);
Game_ActionResult.prototype.clear = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_ActionResult.get('clear').call(this);

  // refresh our custom parameters.
  this.parried = false;
  this.reduced = 0;
};

/**
 * OVERWRITE Removes the check for "hit vs rng", and adds in parry instead.
 */
Game_ActionResult.prototype.isHit = function()
{
  return this.used && !this.parried && !this.evaded;
};
//#endregion Game_ActionResult

//#region Game_Actor
/**
 * Adds in the jabs tracking object for equipped skills.
 */
J.ABS.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('initMembers').call(this);

  /**
   * The master reference to the `_j` object containing all plugin properties.
   * @type {{}}
   */
  this._j ||= {};

  /**
   * The master reference to all JABS-related added properties on this class.
   * @type {{}}
   */
  this._j._abs ||= {};

  /**
   * The number of bonus hits this actor currently has.
   * @type {number}
   */
  this._j._abs._bonusHits = 0;

  /**
   * Whether or not the death effect has been performed.
   * The death effect is defined as "death animation".
   * @type {boolean}
   */
  this._j._abs._deathEffect = false;
};

/**
 * Extends `.setup()` and initializes the jabs equipped skills.
 */
J.ABS.Aliased.Game_Actor.set('setup', Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('setup').call(this, actorId);

  // setup all the JABS skill slots for the first time.
  this.initAbsSkills();

  // execute the first refresh for JABS-related things.
  this.jabsRefresh();
};

/**
 * Gets the prepare time for this actor.
 * Actors are not gated by prepare times, only by post-action cooldowns.
 * @returns {number}
 */
Game_Actor.prototype.prepareTime = function()
{
  return 1;
};

/**
 * Gets the skill id for this actor.
 * Actors don't use this functionality, they have equipped skills instead.
 * @returns {null}
 */
Game_Actor.prototype.skillId = function()
{
  return null;
};

/**
 * Gets the sight range for this actor.
 * Looks first to the class, then the actor for the tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.sightRange = function()
{
  let val = Game_Battler.prototype.sightRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Sight])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Sight]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Sight])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Sight]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<s:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alerted sight boost for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.alertedSightBoost = function()
{
  let val = Game_Battler.prototype.alertedSightBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertSightBoost])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertSightBoost]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<as:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alerted pursuit boost for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.pursuitRange = function()
{
  let val = Game_Battler.prototype.pursuitRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Pursuit])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Pursuit]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Pursuit])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Pursuit]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<p:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alerted pursuit boost for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.alertedPursuitBoost = function()
{
  let val = Game_Battler.prototype.alertedPursuitBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertPursuitBoost])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertPursuitBoost]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ap:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alert duration for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.alertDuration = function()
{
  let val = Game_Battler.prototype.alertDuration.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertDuration])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertDuration]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertDuration])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertDuration]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ad:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the ai of the actor.
 * Though allies leverage ally ai for action decision making, this AI does
 * have one effect: how to move around and stuff throughout the phases.
 * @returns {null}
 */
Game_Actor.prototype.ai = function()
{
  return new JABS_BattlerAI(true, true);
};

/**
 * Gets whether or not the actor can idle.
 * Actors can never idle.
 * @returns {boolean}
 */
Game_Actor.prototype.canIdle = function()
{
  return false;
};

/**
 * Gets whether or not the actor's hp bar will show.
 * Actors never show their hp bar (they use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showHpBar = function()
{
  return false;
};

/**
 * Gets whether or not the actor's name will show below their character.
 * Actors never show their name (the use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showBattlerName = function()
{
  return false;
};

/**
 * Gets whether or not the actor is invincible.
 * Actors are never invincible by this means.
 * @returns {boolean}
 */
Game_Actor.prototype.isInvincible = function()
{
  return false;
};

/**
 * Gets whether or not the actor is inanimate.
 * Actors are never inanimate (duh).
 * @returns {boolean}
 */
Game_Actor.prototype.isInanimate = function()
{
  return false;
};

/**
 * Gets whether or not there are notes that indicate skills should be autoassigned
 * when leveling up.
 * @returns {boolean}
 */
Game_Actor.prototype.autoAssignOnLevelup = function()
{
  const objectsToCheck = this.getAllNotes();
  const structure = /<autoAssignSkills>/i;
  let autoAssign = false;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        autoAssign = true;
      }
    });
  });

  return autoAssign;
};

/**
 * The team id of this actor.
 * Defaults to the default ally team id.
 * @returns {number}
 */
Game_Actor.prototype.teamId = function()
{
  let val = JABS_Battler.allyTeamId();

  const referenceData = this.databaseData();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Team])
  {
    // if its in the metadata, then grab it from there.
    val = referenceData.meta[J.BASE.Notetags.Team];
  }
  else
  {
    const structure = /<team:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = RegExp.$1;
      }
    });
  }

  return parseInt(val);
};

/**
 * Replaces the map damage with JABS' version of the map damage.
 */
J.ABS.Aliased.Game_Actor.set('performMapDamage', Game_Actor.prototype.performMapDamage);
Game_Actor.prototype.performMapDamage = function()
{
  // check if JABS is disabled.
  if (!$jabsEngine.absEnabled)
  {
    // perform original logic.
    J.ABS.Aliased.Game_Actor.get('performMapDamage').call(this);
  }
  // JABS is definitely enabled.
  else
  {
    // let JABS handle it.
    this.performJabsFloorDamage();
  }
};

/**
 * Handles how an actor is treated when they are taking floor damage on the map.
 */
Game_Actor.prototype.performJabsFloorDamage = function()
{
  // just flash the screen, the damage is applied by other means.
  $gameScreen.startFlashForDamage();
};

/**
 * Disable built-in on-turn-end effects while JABS is active.
 * (built-in effects include regeneration and poison, but those are
 * already handled elsewhere in the engine)
 */
J.ABS.Aliased.Game_Actor.set('turnEndOnMap', Game_Actor.prototype.turnEndOnMap);
Game_Actor.prototype.turnEndOnMap = function()
{
  // if JABS is enabled, the fun never stops!
  if (!$jabsEngine.absEnabled) return;

  // do normal turn-end things while JABS is disabled.
  J.ABS.Aliased.Game_Actor.get('turnEndOnMap').call(this);
};

/**
 * Actors have fixed `uuid`s, and thus it can be calculated as-is.
 * @returns {string}
 */
Game_Actor.prototype.getUuid = function()
{
  if (this.actor())
  {
    return `actor-${this.actorId()}`;
  }

  console.warn("no uuid currently available.");
  return String.empty;
};

/**
 * Checks all possible places for whether or not the actor is able to
 * be switched to.
 * @returns {boolean}
 */
Game_Actor.prototype.switchLocked = function()
{
  const objectsToCheck = this.getAllNotes();
  const structure = /<noSwitch>/i;
  let switchLocked = false;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        switchLocked = true;
      }
    });
  });

  return switchLocked;
};

/**
 * Gets whether or not this actor needs a death effect.
 * @returns {boolean}
 */
Game_Actor.prototype.needsDeathEffect = function()
{
  return this._j._abs._deathEffect;
};

/**
 * Toggles this actor's need for a death effect.
 */
Game_Actor.prototype.toggleDeathEffect = function()
{
  this._j._abs._deathEffect = !this._j._abs._deathEffect;
};

/**
 * Toggles the death effect for this actor when they die.
 */
J.ABS.Aliased.Game_Actor.set('onDeath', Game_Actor.prototype.onDeath);
Game_Actor.prototype.onDeath = function()
{
  // toggle the on-death flag for tracking if death has occurred or not.
  this.toggleDeathEffect();
};

/**
 * Reverts the death effect toggle when they are revived.
 */
J.ABS.Aliased.Game_Actor.set('onRevive', Game_Actor.prototype.onRevive);
Game_Actor.prototype.onRevive = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onRevive').call(this);

  // stops this battler from being flagged as dead by JABS.
  this.stopDying();
};

/**
 * Stops this actor from being in the death effect flagged state.
 */
Game_Actor.prototype.stopDying = function()
{
  // grab the battler that is revived.
  const jabsBattler = $gameMap.getBattlerByUuid(this.getUuid());

  // validate the existance of the battler before using.
  if (!jabsBattler) return;

  // turn off the dying effect.
  jabsBattler.setDying(false);
};

/**
 * Initializes the JABS equipped skills based on equipment.
 */
Game_Actor.prototype.initAbsSkills = function()
{
  // setup the skill slots for the first time.
  this.getSkillSlotManager().setupSlots(this);

  // update them with data.
  this.refreshBasicAttackSkills();
};

/**
 * Gets all skill slots identified as "primary".
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getAllPrimarySkills = function()
{
  return this.getSkillSlotManager().getAllPrimarySlots();
};

/**
 * Gets all skill slots identified as "secondary".
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getAllSecondarySkills = function()
{
  return this.getSkillSlotManager().getAllSecondarySlots();
};

/**
 * Gets the skill dedicated to the tool slot.
 * @returns {JABS_SkillSlot}
 */
Game_Actor.prototype.getToolSkill = function()
{
  return this.getSkillSlotManager().getToolSlot();
};

/**
 * Gets the skill dedicated to the dodge slot.
 * @returns {JABS_SkillSlot}
 */
Game_Actor.prototype.getDodgeSkill = function()
{
  return this.getSkillSlotManager().getDodgeSlot();
};

/**
 * Gets all skill slots that have skills assigned to them.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getValidEquippedSkillSlots = function()
{
  // don't try to get slots if we are not setup yet.
  if (!this.getSkillSlotManager()) return [];

  return this.getSkillSlotManager().getEquippedSlots();
};

/**
 * Gets all skill slots that have skills assigned to them- excluding the tool slot.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getValidSkillSlotsForAlly = function()
{
  return this.getSkillSlotManager().getEquippedAllySlots();
};

/**
 * Gets all skill slots that have skills that are upgradable.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getUpgradableSkillSlots = function()
{
  return this
    .getValidEquippedSkillSlots()
    .filter(skillSlot =>
    {
      if (!skillSlot.canBeAutocleared())
      {
      // skip the main/off/tool slots.
        return false;
      }

      if (skillSlot.isLocked())
      {
      // skip locked slots.
        return false;
      }

      return true;
    });
};

/**
 * Refreshes the JABS skills that are currently equipped.
 * If any are no longer valid, they will be removed.
 */
Game_Actor.prototype.refreshBasicAttackSkills = function()
{
  // don't refresh if setup hasn't been completed.
  if (!this.canRefreshBasicAttackSkills()) return;

  // update the mainhand skill slot.
  this.updateMainhandSkill();

  // update the offhand skill slot.
  this.updateOffhandSkill();

  // remove all unequippable skills from their slots.
  this.removeInvalidSkills();

};

Game_Actor.prototype.canRefreshBasicAttackSkills = function()
{
  // don't refresh if setup hasn't been completed.
  if (!this.getSkillSlotManager().isSetupComplete()) return false;

  // refresh!
  return true;
};

/**
 * Gets the mainhand skill for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getMainhandSkill = function()
{
  // grab the mainhand of the actor.
  const [mainhand,] = this.equips();

  // default the mainhand skill to 0.
  let mainhandSkill = 0;

  // check if we have something in our mainhand.
  if (mainhand)
  {
    // assign the skill id tag from the mainhand.
    mainhandSkill = mainhand.jabsSkillId ?? 0;
  }

  // return what we found.
  return mainhandSkill
};

/**
 * Updates the mainhand skill slot with the most up-to-date value.
 */
Game_Actor.prototype.updateMainhandSkill = function()
{
  // determine the current main and offhand skills.
  const mainhandSkill = this.getMainhandSkill();

  // update the main and offhand skill slots.
  this.setEquippedSkill(JABS_Button.Mainhand, mainhandSkill);
};

/**
 * Gets the offhand skill for this actor.
 *
 * Takes into consideration the possibility of an offhand override
 * from the mainhand or some states.
 * @returns {number} The offhand skill id.
 */
Game_Actor.prototype.getOffhandSkill = function()
{
  // grab the offhand skill override if one exists.
  const offhandOverride = this.offhandSkillOverride();

  // check if there is an offhand override skill to use instead.
  if (offhandOverride)
  {
    // return the override.
    return offhandOverride;
  }

  // grab the offhand of the actor.
  const [,offhand] = this.equips();

  // default the offhand skill to 0.
  let offhandSkill = 0;

  // check if we have something in our offhand.
  if (offhand)
  {
    // assign the skill id tag from the offhand.
    offhandSkill = offhand.jabsSkillId ?? 0;
  }

  // return what we found.
  return offhandSkill;
};

/**
 * Updates the offhand skill slot with the most up-to-date value.
 */
Game_Actor.prototype.updateOffhandSkill = function()
{
  // determine the current main and offhand skills.
  const offhandSkill = this.getOffhandSkill();

  // update the offhand skill slot.
  this.setEquippedSkill(JABS_Button.Offhand, offhandSkill);
};

/**
 * Gets the offhand skill id override if one exists from
 * any states.
 * @returns {number}
 */
Game_Actor.prototype.offhandSkillOverride = function()
{
  // default to override of skill id 0.
  let overrideSkillId = 0;

  // grab all states to start.
  const objectsToCheck = [...this.states()];

  // grab the weapon of the actor.
  const [weapon,] = this.equips();

  // check if we have a weapon.
  if (weapon)
  {
    // add the weapon on for possible offhand overrides.
    objectsToCheck.unshift(weapon);
  }

  // iterate over all sources.
  objectsToCheck.forEach(obj =>
  {
    // check if we have an offhand skill id override.
    if (obj.jabsOffhandSkillId)
    {
      // assign it if we do.
      overrideSkillId = obj.jabsOffhandSkillId;
    }
  });

  // return the last override skill found, if any.
  return overrideSkillId;
};

/**
 * Automatically removes all skills that are no longer available.
 * This most commonly will occur when a skill is bound to equipment that is
 * no longer equipped to the character. Skills that are "forced" will not be removed.
 */
Game_Actor.prototype.removeInvalidSkills = function()
{
  // grab all the slots this actor has.
  const slots = this.getSkillSlotManager().getAllSlots();

  // iterate over each of them.
  slots.forEach(skillSlot =>
  {
    // check if we currently know this skill.
    if (!this.hasSkill(skillSlot.id))
    {
      // remove it if we don't.
      skillSlot.autoclear();
    }
  });
};

/**
 * Extends {@link #onBattlerDataChange}.
 * Adds a hook for performing actions when the battler's data hase changed.
 */
J.ABS.Aliased.Game_Actor.set('onBattlerDataChange', Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.jabsRefresh();
};

/**
 * Refreshes aspects associated with this battler in the context of JABS.
 */
Game_Actor.prototype.jabsRefresh = function()
{
  // refresh the currently equipped skills to ensure they are still valid.
  this.refreshBasicAttackSkills();

  // refresh the bonus hits to ensure they are still accurate.
  this.refreshBonusHits();
};

/**
 * OVERWRITE Replaces the levelup display on the map to not display a message.
 */
Game_Actor.prototype.shouldDisplayLevelUp = function()
{
  return false;
};

/**
 * Executes the JABS level up process.
 */
J.ABS.Aliased.Game_Actor.set('onLevelUp', Game_Actor.prototype.onLevelUp);
Game_Actor.prototype.onLevelUp = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onLevelUp').call(this);

  // perform JABS-related things for leveling up.
  this.jabsLevelUp();
};

/**
 * Do JABS-related things for leveling up.
 */
Game_Actor.prototype.jabsLevelUp = function()
{
  // refresh the sprite if they need it.
  $jabsEngine.requestSpriteRefresh = true;

  // command the JABS engine to do the JABS-related things for leveling up.
  $jabsEngine.battlerLevelup(this.getUuid());
};

/**
 * Extends {@link #onLevelDown}.
 * Also refresh sprites' danger indicator.
 */
J.ABS.Aliased.Game_Actor.set('onLevelDown', Game_Actor.prototype.onLevelDown);
Game_Actor.prototype.onLevelDown = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onLevelDown').call(this);

  // perform JABS-related things for leveling down.
  this.jabsLevelDown();
};

/**
 * Do JABS-related things for leveling down.
 */
Game_Actor.prototype.jabsLevelDown = function()
{
  // if this isn't the leader, then don't worry about leveling down.
  if (!this.isLeader()) return;

  // this is the leader so refresh the battler sprite!
  $jabsEngine.requestSpriteRefresh = true;
};

/**
 * A hook for performing actions when a battler learns a new skill.
 * @param {number} skillId The skill id of the skill learned.
 */
J.ABS.Aliased.Game_Actor.set('onLearnNewSkill', Game_Actor.prototype.onLearnNewSkill);
Game_Actor.prototype.onLearnNewSkill = function(skillId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onLearnNewSkill').call(this, skillId);

  // perform JABS-related things for learning a new skill.
  this.jabsLearnNewSkill(skillId);
};

/**
 * Do JABS-related things for leveling down.
 * @param {number} skillId The skill id being learned.
 */
Game_Actor.prototype.jabsLearnNewSkill = function(skillId)
{
  // if the skill id is invalid, do not do JABS things.
  if (!skillId) return;

  // show the popup for the skill learned on the battler.
  $jabsEngine.battlerSkillLearn(this.skill(skillId), this.getUuid());

  // upgrade the skill if permissable.
  this.upgradeSkillIfUpgraded(skillId);

  // autoassign skills if necessary.
  this.autoAssignSkillsIfRequired(skillId);

  // do nothing if we don't have a slot manager to work with.
  if (!this.getSkillSlotManager()) return;

  // flag skills on the skillslot manager for refreshing.
  this.getSkillSlotManager().flagAllSkillSlotsForRefresh();
};

/**
 * If a skill that was upgraded is equipped currently, upgrade it.
 * @param {number} skillId The skill id to upgrade.
 */
Game_Actor.prototype.upgradeSkillIfUpgraded = function(skillId)
{
  const upgradableSkillsSlots = this.getUpgradableSkillSlots();
  if (!upgradableSkillsSlots)
  {
    return;
  }

  upgradableSkillsSlots.forEach(skillSlot =>
  {
    const skillData = this.skill(skillSlot.id);
    const upgradeSkillId = parseInt(skillData.meta["Hide if learned Skill"]);
    if (upgradeSkillId === skillId)
    {
      this.setEquippedSkill(skillSlot.key, skillId);
    }
  }, this);
};

/**
 * If the actor has a tag/note somewhere for auto-assignment, then this will
 * attempt to automatically slot the learned skill into an otherwise empty
 * skill slot.
 *
 * This will only attempt to assign skills to one of the 8 secondary slots.
 *
 * If all slots are full, no action is taken.
 * @param {number} skillId The skill id to auto-assign to a slot.
 */
Game_Actor.prototype.autoAssignSkillsIfRequired = function(skillId)
{
  if (this.autoAssignOnLevelup())
  {
    const emptySlots = this.getEmptySecondarySkills();
    if (!emptySlots.length)
    {
      return;
    }

    const slotKey = emptySlots[0].key;
    this.setEquippedSkill(slotKey, skillId);
  }
};

/**
 * Updates the bonus hit count for this actor based on equipment.
 *
 * NOTE:
 * This is explicitly not using `this.getAllNotes()` so that we can
 * also parse out the repeats from all the relevant sources as well.
 */
Game_Actor.prototype.refreshBonusHits = function()
{
  // default to zero bonus hits.
  let bonusHits = 0;

  // iterate over all equips.
  bonusHits += this.getBonusHitsFromTraitedSources(this.equips());

  // iterate over all states.
  bonusHits += this.getBonusHitsFromTraitedSources(this.states());

  // add your own actor data as a source.
  bonusHits += this.getBonusHitsFromTraitedSources([this.actor()]);

  // add your own class data as a source.
  bonusHits += this.getBonusHitsFromTraitedSources([this.currentClass()]);

  // iterate over all skills learned; concept as "passive skills", not bonus hits per skill.
  bonusHits += this.getBonusHitsFromNonTraitedSources(this.skills());

  // set the bonus hits to the total amount found everywhere.
  this._j._abs._bonusHits = bonusHits;
};

/**
 * Gets the current number of bonus hits for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getBonusHits = function()
{
  return this._j._abs._bonusHits;
};

/**
 * Determines the various state duration boosts available to this actor.
 * @param {number} baseDuration The base duration of the state.
 * @param {Game_Battler} attacker The attacker- for use with formulai.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationBoost = function(baseDuration, attacker)
{
  // initialize the running tally.
  let durationBoost = 0;

  // grab all the things to check.
  const objectsToCheck = this.getAllNotes();

  // iterate over each of the things to check.
  objectsToCheck.forEach(obj =>
  {
    // add the flat boosts.
    durationBoost += this.getStateDurationFlatPlus(obj);

    // add the percent boosts, using the base duration.
    durationBoost += this.getStateDurationPercPlus(obj, baseDuration);

    // add the formula-driven boosts, using the base duration and the attacker.
    durationBoost += this.getStateDurationFormulaPlus(obj, baseDuration, attacker);
  });

  // reduce to 2 decimal places.
  const fixedDurationBoost = parseFloat(durationBoost.toFixed(2));

  // return our calculated state duration boosts.
  return fixedDurationBoost;
};

/**
 * Gets the combined amount of flat state duration boosts from all sources.
 * @param {RPG_BaseItem} noteObject The database object.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationFlatPlus = function(noteObject)
{
  // determine the structure.
  const structure = J.ABS.RegExp.StateDurationFlatPlus;

  // extract the amount from the object.
  const flatDurationBoost = noteObject.getNumberFromNotesByRegex(structure);

  // return was found.
  return flatDurationBoost;
};

/**
 * Gets the combined amount of percent-based state duration boosts from all sources.
 * @param {RPG_BaseItem} noteObject The database object.
 * @param {number} baseDuration The base duration of the state.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationPercPlus = function(noteObject, baseDuration)
{
  // determine the structure.
  const structure = J.ABS.RegExp.StateDurationPercentPlus;

  // extract the amount from the object.
  const percDurationBoost = noteObject.getNumberFromNotesByRegex(structure);

  // perform the calculation.
  const calculatedBoost = Math.round(baseDuration * (percDurationBoost / 100));

  // return the calculated amount.
  return calculatedBoost;
};

/**
 * Gets the combined amount of formula-based state duration boosts from all sources.
 * @param {RPG_BaseItem} noteObject The database object.
 * @param {number} baseDuration The base duration of the state.
 * @param {Game_Actor|Game_Enemy} attacker The attacker applying the state.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationFormulaPlus = function(noteObject, baseDuration, attacker)
{
  // determine the structure.
  const structure = J.ABS.RegExp.StateDurationFormulaPlus;

  // get the note data from this skill.
  const lines = noteObject.getFilteredNotesByRegex(structure);

  // if we have no matching notes, then short circuit.
  if (!lines.length)
  {
    // return null or 0 depending on provided options.
    return 0;
  }

  // initialize the base boost.
  let formulaDurationBoost = 0;

  // establish some variables for eval scope access.
  const a = this;  // the one who applied the state.
  const b = attacker; // this battler, afflicted by the state.
  const v = $gameVariables._data; // access to variables if you need it.
  const d = baseDuration;

  // iterate over each valid line of the note.
  lines.forEach(line =>
  {
    // extract the captured formula.
    // eslint-disable-next-line prefer-destructuring
    const result = structure.exec(line)[1];

    // regular parse it and add it to the running total.
    formulaDurationBoost += JSON.parse(eval(result));
  });

  // return our evaluated amounts.
  return formulaDurationBoost;
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * Adds the `uuid` to the battler class.
 */
J.ABS.Aliased.Game_Battler.initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function()
{
  J.ABS.Aliased.Game_Battler.initMembers.call(this);
  /**
   * All modifications to the battler lives within this object.
   * @type {any}
   */
  this._j = this._j || {
    /**
     * The `uuid` of this battler.
     * @type {string}
     */
    _uuid: J.BASE.Helpers.generateUuid(),
  };

  /**
   * All equipped skills on this battler.
   * @type {JABS_SkillSlotManager}
   */
  this._j._equippedSkills = new JABS_SkillSlotManager();
};

/**
 * Gets the `uuid` of this battler.
 * At this level, only returns an empty string.
 * @returns {string}
 */
Game_Battler.prototype.getUuid = function()
{
  return this._j._uuid;
};

/**
 * Sets the `uuid` of this battler.
 * @param {string} uuid The `uuid` to assign to this battler.
 */
Game_Battler.prototype.setUuid = function(uuid)
{
  this._j._uuid = uuid;
};

/**
 * Gets the underlying id of the battler from the database.
 * @returns {number}
 */
Game_Battler.prototype.battlerId = function()
{
  return 0;
};

/**
 * Gets the battler's skill slot manager directly.
 * @returns {JABS_SkillSlotManager}
 */
Game_Battler.prototype.getSkillSlotManager = function()
{
  return this._j._equippedSkills;
};

/**
 * All battlers have a prepare time.
 * At this level, returns default 180 frames.
 * @returns {number}
 */
Game_Battler.prototype.prepareTime = function()
{
  return 180;
};

/**
 * Gets the battler's basic attack skill id.
 * This is defined by the first "Attack Skill" trait on a battler.
 * If there are multiple traits of this kind, only the first found will be used.
 * @returns {number}
 */
Game_Battler.prototype.basicAttackSkillId = function()
{
  // get the data from the database of this battler.
  const databaseData = this.databaseData();

  // the battler's basic attack is their first found "Attack Skill" trait.
  const attackSkillTrait = databaseData.traits
    .find(trait => trait.code === J.BASE.Traits.ATTACK_SKILLID);

  // check to make sure we found a trait.
  if (attackSkillTrait)
  {
    // return the traits underlying skill id.
    return attackSkillTrait.dataId;
  }

  // we didn't find a trait so just return 1.
  return 0;
};

/**
 * All battlers have a default sight range.
 * @returns {number}
 */
Game_Battler.prototype.sightRange = function()
{
  return 4;
};

/**
 * All battlers have a default alerted sight boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedSightBoost = function()
{
  return 2;
};

/**
 * All battlers have a default pursuit range.
 * @returns {number}
 */
Game_Battler.prototype.pursuitRange = function()
{
  return 6;
};

/**
 * All battlers have a default alerted pursuit boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedPursuitBoost = function()
{
  return 4;
};

/**
 * All battlers have a default alert duration.
 * @returns {number}
 */
Game_Battler.prototype.alertDuration = function()
{
  return 300;
};

/**
 * All battlers have a default team id.
 * At this level, the default team id is 1 (the default for enemies).
 * @returns {number}
 */
Game_Battler.prototype.teamId = function()
{
  return JABS_Battler.enemyTeamId();
};

/**
 * All battlers have a default AI.
 * @returns {JABS_BattlerAI}
 */
Game_Battler.prototype.ai = function()
{
  return new JABS_BattlerAI();
};

/**
 * All battlers can idle by default.
 * @returns {boolean}
 */
Game_Battler.prototype.canIdle = function()
{
  return true;
};

/**
 * All battlers will show their hp bar by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showHpBar = function()
{
  return true;
};

/**
 * All battlers will show their danger indicator by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showDangerIndicator = function()
{
  return true;
};

/**
 * All battlers will show their database name by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showBattlerName = function()
{
  return true;
};

/**
 * All battlers can be invincible, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInvincible = function()
{
  return false;
};

/**
 * All battlers can be inanimate, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInanimate = function()
{
  return false;
};

/**
 * Retrieves all skills that are currently equipped on this actor.
 * @returns {JABS_SkillSlot[]}
 */
Game_Battler.prototype.getAllEquippedSkills = function()
{
  return this.getSkillSlotManager().getAllSlots();
};

/**
 * Gets the key to the slot that the provided skill id lives within.
 * @param {number} skillIdToFind The skill id to find amidst all equipped skills.
 * @returns {JABS_SkillSlot}
 */
Game_Battler.prototype.findSlotForSkillId = function(skillIdToFind)
{
  return this.getSkillSlotManager().getSlotBySkillId(skillIdToFind);
};

/**
 * Gets the currently-equipped skill id in the specified slot.
 * @param {string} slot The slot to retrieve an equipped skill for.
 * @returns {number}
 */
Game_Battler.prototype.getEquippedSkill = function(slot)
{
  return this.getSkillSlot(slot).id;
};

/**
 * Gets the slot associated with a key.
 * @param {string} slot The slot to retrieve a slot for.
 * @returns {JABS_SkillSlot}
 */
Game_Battler.prototype.getSkillSlot = function(slot)
{
  return this.getSkillSlotManager().getSkillSlotByKey(slot);
};

/**
 * Gets all secondary slots that are unassigned.
 * @returns {JABS_SkillSlot[]}
 */
Game_Battler.prototype.getEmptySecondarySkills = function()
{
  return this.getSkillSlotManager().getEmptySecondarySlots();
};

/**
 * Sets the skill id to the specified slot with an option to lock the skill into the slot.
 * @param {string} slot The slot to retrieve an equipped skill for.
 * @param {number} skillId The skill id to assign to the specified slot.
 * @param {boolean} locked Whether or not the skill is locked onto this slot.
 */
Game_Battler.prototype.setEquippedSkill = function(slot, skillId, locked = false)
{
  // shorthand the skill slot manager.
  const skillSlotManager = this.getSkillSlotManager();

  // do nothing if we don't have skill slots to work with.
  if (!skillSlotManager) return;

  // check if we need to actually update the slot.
  if (this.needsSlotUpdate(slot, skillId, locked))
  {
    // update the slot.
    skillSlotManager.setSlot(slot, skillId, locked);

    // check if we're using the hud's input frame.
    if (J.HUD && J.HUD.EXT_INPUT)
    {
      // flag the slot for refresh.
      skillSlotManager.getSkillSlotByKey(slot).flagSkillSlotForRefresh();

      // request an update to the input frame.
      $hudManager.requestRefreshInputFrame();
    }
  }
};

/**
 * Whether or not this actor requires the given slot to be updated.
 * @param {string} slot The slot to retrieve an equipped skill for.
 * @param {number} skillId The skill id to assign to the specified slot.
 * @param {boolean} locked Whether or not the skill is locked onto this slot.
 * @returns {boolean} True if this slot needs to be updated, false otherwise.
 */
Game_Battler.prototype.needsSlotUpdate = function(slot, skillId, locked)
{
  // grab the slot in question.
  const currentSlot = this.getSkillSlot(slot);

  // if we have no slot currently, we need to update it.
  if (!currentSlot) return true;

  // if the locked states don't match, we need to update it.
  if (currentSlot.isLocked() !== locked) return true;

  // if the skill ids don't match, we need to udpate it.
  if (currentSlot.id !== skillId) return true;

  // guess we didn't need to update it after all.
  return false;
};

/**
 * Checks if a slot is locked or not.
 * @param {string} slot The slot being checked to see if it is locked.
 * @returns {boolean}
 */
Game_Battler.prototype.isSlotLocked = function(slot)
{
  return this.getSkillSlotManager()
    .getSkillSlotByKey(slot)
    .isLocked();
};

/**
 * Unlocks a slot that was forcefully assigned.
 * @param {string} slot The slot to unlock.
 */
Game_Battler.prototype.unlockSlot = function(slot)
{
  this.getSkillSlotManager()
    .getSkillSlotByKey(slot)
    .unlock();
};

/**
 * Unlocks all slots that were forcefully assigned.
 */
Game_Battler.prototype.unlockAllSlots = function()
{
  this.getSkillSlotManager().unlockAllSlots();
};

/**
 * Extracts all on-chance-effects from a given collection of checkables with notes.
 * @param {RegExp} structure The regex structure to parse for.
 * @param {RPG_Base[]} checkables The list of checkables to parse.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.getAllOnChanceEffects = function(structure, checkables)
{
  // initialize the collection.
  const onChanceEffects = [];

  // scan all checkables.
  checkables.forEach(checkable =>
  {
    // build concrete on-chance-effects for each instance on the checkable.
    const onChanceEffectList = J.BASE.Helpers.parseSkillChance(structure, checkable);

    // add it to the collection.
    onChanceEffects.push(...onChanceEffectList);
  });

  // return what was found.
  return onChanceEffects;
};

/**
 * Gets all retaliation skills associated with this battler.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.retaliationSkills = function()
{
  // get all retaliation skills from the notes.
  const retaliations = this.getAllOnChanceEffects(J.ABS.RegExp.Retaliate, this.getAllNotes());

  // return what was found.
  return retaliations;
};

/**
 * Gets all on-own-defeat skills associated with this battler.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.onOwnDefeatSkillIds = function()
{
  // get all on-own-defeat skills from the notes.
  const onOwnDeaths = this.getAllOnChanceEffects(J.ABS.RegExp.OnOwnDefeat, this.getAllNotes());

  // return what was found.
  return onOwnDeaths;
};

/**
 * Gets all on-target-defeat skills associated with this battler.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.onTargetDefeatSkillIds = function()
{
  // get all on-target-defeat skills from the notes.
  const onTargetKills = this.getAllOnChanceEffects(J.ABS.RegExp.onTargetDefeat, this.getAllNotes());

  // return what was found.
  return onTargetKills;
};

/**
 * A multiplier against the vision of an enemy target.
 * This may increase/decrease the sight and pursuit range of an enemy attempting to
 * perceive the actor.
 * @returns {number}
 */
Game_Battler.prototype.getVisionModifier = function()
{
  let visionMultiplier = 100;
  const objectsToCheck = this.getAllNotes();
  objectsToCheck.forEach(obj => (visionMultiplier += this.extractVisionModifiers(obj)));

  return Math.max((visionMultiplier / 100), 0);
};

/**
 * Gets all modifiers related to vision from this database object.
 * @param referenceData
 * @returns {number}
 */
Game_Battler.prototype.extractVisionModifiers = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return 0;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<visionMultiplier:[ ]?(-?[\d]+)>/i;
  let visionMultiplier = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      const multiplier = parseInt(RegExp.$1);
      visionMultiplier += multiplier;
    }
  });

  return visionMultiplier;
};

/**
 * Gets whether or not the aggro is locked for this battler.
 * Locked aggro means their aggro cannot be modified in any way.
 * @returns {boolean}
 */
Game_Battler.prototype.isAggroLocked = function()
{
  return this.states().some(state => state.jabsAggroLock ?? false);
};

/**
 * OVERWRITE Rewrites the handling for state application. The attacker is
 * now relevant to the state being applied.
 * @param {number} stateId The state id to potentially apply.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
J.ABS.Aliased.Game_Battler.addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId, attacker)
{
  // if we're missing an attacker or the engine is disabled, perform as usual.
  if (!attacker || !$jabsEngine._absEnabled)
  {
    // perform original logic.
    J.ABS.Aliased.Game_Battler.addState.call(this, stateId);

    // stop processing this state.
    return;
  }

  // check if we can add the state to the battler.
  if (this.isStateAddable(stateId))
  {
    // check to make sure we're not already afflicted with the state.
    if (!this.isStateAffected(stateId))
    {
      // add the new state with the attacker data.
      this.addNewState(stateId, attacker);

      // refresh this battler.
      this.refresh();
    }

    // reset the state counts for the battler.
    this.resetStateCounts(stateId, attacker);

    // add the new state to the action result on this battler.
    this._result.pushAddedState(stateId);
  }
};

/**
 * Extends this function to add the state to the JABS state tracker.
 * @param {number} stateId The state id to track.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
J.ABS.Aliased.Game_Battler.addNewState = Game_Battler.prototype.addNewState;
Game_Battler.prototype.addNewState = function(stateId, attacker)
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.addNewState.call(this, stateId);

  // add the jabs state.
  this.addJabsState(stateId, attacker);
};

/**
 * Refreshes the battler's state that is being re-applied.
 * @param {number} stateId The state id to track.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
J.ABS.Aliased.Game_Battler.resetStateCounts = Game_Battler.prototype.resetStateCounts;
Game_Battler.prototype.resetStateCounts = function(stateId, attacker)
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.resetStateCounts.call(this, stateId);

  // add the state to the battler.
  this.addJabsState(stateId, attacker);
};

/**
 * Extends `removeState()` to also expire the state in the JABS state tracker.
 * @param {number} stateId
 */
J.ABS.Aliased.Game_Battler.removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.removeState.call(this, stateId);

  // query for the state to remove from the engine.
  const stateTracker = $jabsEngine.findStateTrackerByBattlerAndState(this, stateId);

  // check if we found anything.
  if (stateTracker)
  {
    // expire the found state if it is being removed.
    stateTracker.expired = true;
  }
};

/**
 * Adds a particular state to become tracked by the tracker for this battler.
 * @param {number} stateId The state id to track.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
Game_Battler.prototype.addJabsState = function(stateId, attacker)
{
  // check if we're missing an actor due to external application of state.
  if (!attacker)
  {
    // assign the attacker to be oneself if none otherwise exists.
    attacker = this;
  }

  // grab the state from the attacker's perspective.
  const state = attacker.state(stateId);

  // grab the duration out of the state.
  let duration = state.stepsToRemove;

  // check if we should extend our incoming positive states.
  if (this.isActor() && !state.jabsNegative)
  {
    // extend our incoming positive states!
    duration += this.getStateDurationBoost(duration, attacker);
  }
  // check if we should extend our outgoing negative states.
  else if (this.isEnemy() && attacker && attacker.isActor() && state.jabsNegative)
  {
    // extend our outgoing negative states!
    duration += attacker.getStateDurationBoost(duration, this);
  }

  // build a new state tracker based on the given data.
  const stateTracker = new JABS_TrackedState({
    battler: this,
    stateId: stateId,
    iconIndex: state.iconIndex,
    duration: duration,
    source: attacker
  });

  // add the state to the engine's tracker.
  $jabsEngine.addStateTracker(stateTracker);
};

/**
 * Determines the various state duration boosts available to this battler.
 * @param {number} baseDuration The base duration of the state.
 * @param {Game_Battler} attacker The attacker- for use with formulai.
 * @returns {number}
 */
Game_Battler.prototype.getStateDurationBoost = function(baseDuration, attacker)
{
  return 0;
};

/**
 * Gets the numeric representation of this battler's strength.
 * @returns {number}
 */
Game_Battler.prototype.getPowerLevel = function()
{
  let powerLevel = 0;
  let counter = 2;
  // skip HP/MP
  const bparams = [2, 3, 4, 5, 6, 7];
  const xparams = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const sparams = [18, 19, 20, 21, 22, 23, 24, 25];
  while (counter < 28)
  {
    if (bparams.includes(counter))
    {
      powerLevel += this.param(counter);
    }

    if (xparams.includes(counter))
    {
      powerLevel += this.xparam(counter - 8) * 100;
    }

    if (sparams.includes(counter))
    {
      powerLevel += (this.sparam(counter - 18) * 100 - 100);
    }

    counter++;
  }

  if (Number.isNaN(powerLevel))
  {
    console.warn('what happened');
  }

  powerLevel += (this.level ** 2);
  return Math.round(powerLevel);
};

/**
 * Gets the current number of bonus hits for this actor.
 * At the Game_Battler level will always return 0.
 * @returns {number}
 */
Game_Battler.prototype.getBonusHits = function()
{
  return 0;
};

/**
 * Extracts all bonus hits from a collection of traited sources.
 * @param {RPG_Traited[]|RPG_BaseBattler[]|RPG_Class[]} sources The collection to iterate over.
 * @returns {number}
 */
Game_Battler.prototype.getBonusHitsFromTraitedSources = function(sources)
{
  // set this counter to zero.
  let bonusHits = 0;

  // build the reducer for adding repeat traits up as bonus hits.
  const reducer = (previousValue, currentValue) => previousValue + currentValue.value;
  const isHitsTrait = trait => trait.code === J.BASE.Traits.ATTACK_REPEATS;

  // iterate over all equips.
  sources.forEach(source =>
  {
    // if the slot is empty, don't process it.
    if (!source) return;

    // grab the bonus hits from
    bonusHits += source.jabsBonusHits;
    bonusHits += source.traits
      .filter(isHitsTrait)
      .reduce(reducer, 0);
  });

  // return the bonus hits from some traited sources.
  return bonusHits;
};

/**
 * Extracts all bonus hits from a collection of non-traited sources.
 * @param {RPG_Skill[]|RPG_Item[]} sources The collection to iterate over.
 * @returns {number}
 */
Game_Battler.prototype.getBonusHitsFromNonTraitedSources = function(sources)
{
  // set this counter to zero.
  let bonusHits = 0;

  // iterate over all non-traited sources.
  sources.forEach(source =>
  {
    // grab the bonus hits from the source.
    bonusHits += source.jabsBonusHits;
  });

  // return the bonus hits from non-traited sources.
  return bonusHits;
};

/**
 * Gets the current health percent of this battler.
 * @returns {number}
 */
Game_Battler.prototype.currentHpPercent = function()
{
  return parseFloat((this.hp / this.mhp).toFixed(2));
};

/**
 * Checks all states to see if we have anything that grants parry ignore.
 * @returns {boolean}
 */
Game_Battler.prototype.ignoreAllParry = function()
{
  const objectsToCheck = this.states();
  if (J.PASSIVE)
  {
    objectsToCheck.push(...this.passiveSkillStates());
  }

  const unparryable = objectsToCheck.some(obj => obj.jabsUnparryable);

  return unparryable;
};

/**
 * Overwrites {@link Game_Battler.regenerateAll}.
 * JABS manages its own regeneration, so we don't want this interfering.
 */
Game_Battler.prototype.regenerateAll = function() 
{
};
//#endregion Game_Battler

//#region Game_Character
/**
 * Hooks into the `Game_Character.initMembers` and adds in action sprite properties.
 */
J.ABS.Aliased.Game_Character.initMembers = Game_Character.prototype.initMembers;
Game_Character.prototype.initMembers = function()
{
  this._j = this._j || {};
  J.ABS.Aliased.Game_Character.initMembers.call(this);
  this.initActionSpriteProperties();
  this.initLootSpriteProperties();
};

/**
 * Initializes the action sprite properties for this character.
 */
Game_Character.prototype.initActionSpriteProperties = function()
{
  this._j._action = {
    actionData: null,
    needsAdding: false,
    needsRemoving: false,
    battlerUuid: String.empty,
  }
};

/**
 * Initializes the loot sprite properties.
 */
Game_Character.prototype.initLootSpriteProperties = function()
{
  this._j._loot = {
    _needsAdding: false,
    _needsRemoving: false,
    _data: null,
  };
};

/**
 * Gets the loot sprite properties for this event.
 * @returns {object}
 */
Game_Character.prototype.getLootSpriteProperties = function()
{
  return this._j._loot;
};

/**
 * Whether or not this character is/has loot.
 */
Game_Character.prototype.isLoot = function()
{
  return !!this.getLootData();
};

/**
 * Gets whether or not this loot needs rendering onto the map.
 * @returns {boolean} True if needing rendering, false otherwise.
 */
Game_Character.prototype.getLootNeedsAdding = function()
{
  const loot = this.getLootSpriteProperties();
  return loot._needsAdding;
};

/**
 * Sets the loot to need rendering onto the map.
 * @param {boolean} needsAdding Whether or not this loot needs adding.
 */
Game_Character.prototype.setLootNeedsAdding = function(needsAdding = true)
{
  const loot = this.getLootSpriteProperties();
  loot._needsAdding = needsAdding;
};

/**
 * Gets whether or not this loot object is flagged for removal.
 */
Game_Character.prototype.getLootNeedsRemoving = function()
{
  const loot = this.getLootSpriteProperties();
  return loot._needsRemoving;
};

/**
 * Sets the loot object to be flagged for removal.
 * @param {boolean} needsRemoving True if we want to remove the loot, false otherwise.
 */
Game_Character.prototype.setLootNeedsRemoving = function(needsRemoving = true)
{
  const loot = this.getLootSpriteProperties();
  loot._needsRemoving = needsRemoving;
};

/**
 * Gets the loot data for this character/event.
 * @returns {JABS_LootDrop}
 */
Game_Character.prototype.getLootData = function()
{
  const loot = this.getLootSpriteProperties();
  return loot._data;
};

/**
 * Gets whether or not this loot data is use-on-pickup or not.
 * @returns {boolean}
 */
Game_Character.prototype.isUseOnPickupLoot = function()
{
  return this.getLootData().useOnPickup;
};

/**
 * Sets the loot data to the provided loot.
 * @param {object} data The loot data to assign to this character/event.
 */
Game_Character.prototype.setLootData = function(data)
{
  const loot = this.getLootSpriteProperties();
  loot._data = data;
};

/**
 * Gets all action sprite properties for this event.
 */
Game_Character.prototype.getActionSpriteProperties = function()
{
  return this._j._action;
};

/**
 * Gets whether or not this character is an action.
 * @returns {boolean} True if this is an action, false otherwise.
 */
Game_Character.prototype.isAction = function()
{
  return !!this.getMapActionData();
};

/**
 * If the event has a `JABS_Action` associated with it, return that.
 * @returns {JABS_Action}
 */
Game_Character.prototype.getMapActionData = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  if (actionSpriteProperties.actionData)
  {
    return actionSpriteProperties.actionData;
  }
  else
  {
    return null;
  }
};

/**
 * Gets whether or not the underlying `JABS_Action` requires removal from the map.
 * @returns {boolean} True if removal is required, false otherwise.
 */
Game_Character.prototype.getJabsActionNeedsRemoving = function()
{
  // if it is not an action, don't remove whatever it is.
  if (!this.isAction()) return false;

  // return whether or not the removal is needed.
  return this.getMapActionData().getNeedsRemoval();
};

/**
 * Gets the `uuid` of this event's underlying action, if it exists.
 * @returns {string}
 */
Game_Character.prototype.getMapActionUuid = function()
{
  const actionData = this.getMapActionData();
  if (actionData)
  {
    return actionData.getUuid();
  }
  else
  {
    return null;
  }
};

/**
 * Gets the `uuid` of this `JABS_Battler`.
 */
Game_Character.prototype.getActionUuid = function()
{
  const jabsAction = this.getMapActionData();
  return jabsAction.getUuid();
};

/**
 * Gets the `JABS_Battler` associated with this character.
 * @returns {JABS_Battler}
 */
Game_Character.prototype.getJabsBattler = function()
{
  const uuid = this.getJabsBattlerUuid();
  return $gameMap.getBattlerByUuid(uuid);
};

/**
 * Gets the `uuid` of this `JABS_Battler`.
 */
Game_Character.prototype.getJabsBattlerUuid = function()
{
  const asp = this.getActionSpriteProperties();
  return asp.battlerUuid;
};

/**
 * Sets the provided `JABS_Battler` to this character.
 * @param {string} uuid The uuid of the `JABS_Battler` to set to this character.
 */
Game_Character.prototype.setMapBattler = function(uuid)
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.battlerUuid = uuid;
};

Game_Character.prototype.clearMapBattler = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.battlerUuid = String.empty;
};

/**
 * Gets whether or not this character has a `JABS_Battler` attached to it.
 */
Game_Character.prototype.hasJabsBattler = function()
{
  const asp = this.getActionSpriteProperties();
  const uuid = asp.battlerUuid;
  if (!uuid) return false;

  const battler = $gameMap.getBattlerByUuid(uuid);
  if (!battler) return false;

  return true;
};

/**
 * Gets the `needsAdding` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsAdding = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsAdding;
};

/**
 * Sets the `needsAdding` property from the `actionSpriteProperties` for this event.
 * @param {boolean} addSprite True if you want this event to be added, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsAdding = function(addSprite = true)
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.needsAdding = addSprite;
};

/**
 * Gets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsRemoving = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsRemoving;
};

/**
 * Sets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 * @param {boolean} removeSprite True if you want this event to be removed, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsRemoving = function(removeSprite = true)
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsRemoving = removeSprite;
};

/**
 * Execute an animation of a provided id upon this character.
 * @param {number} animationId The animation id to execute on this character.
 * @param {boolean} parried Whether or not the animation being requested was parried.
 */
Game_Character.prototype.requestAnimation = function(animationId, parried = false)
{
  // TODO: remove the parry logic out of this function.
  // check if we parried.
  if (parried)
  {
    // TODO: extract this.
    const parryAnimationId = 122;

    // request the animation on this character.
    $gameTemp.requestAnimation([this], parryAnimationId);
  }
  else
  {
    $gameTemp.requestAnimation([this], animationId);
  }
};

J.ABS.Aliased.Game_Character.isMovementSucceeded = Game_Character.prototype.isMovementSucceeded;
Game_Character.prototype.isMovementSucceeded = function()
{
  const battler = this.getJabsBattler();
  if (battler && !battler.canBattlerMove())
  {
    return false;
  }
  else
  {
    return J.ABS.Aliased.Game_Character.isMovementSucceeded.call(this);
  }
};

/* eslint-disable */
/**
 * Intelligently determines the next step to take on a path to the destination `x,y`.
 * @param {number} goalX The `x` coordinate trying to be reached.
 * @param {number} goalY The `y` coordinate trying to be reached.
 * @returns {1|2|3|4|6|7|8|9} The direction decided.
 */
Game_Character.prototype.findDiagonalDirectionTo = function(goalX, goalY)
{
  const searchLimit = this.searchLimit();
  const mapWidth = $gameMap.width();
  const nodeList = [];
  const openList = [];
  const closedList = [];
  const start = {};
  let best = start;
  let goaled = false;

  if (this.x === goalX && this.y === goalY)
  {
    return 0;
  }

  start.parent = null;
  start.x = this.x;
  start.y = this.y;
  start.g = 0;
  start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
  nodeList.push(start);
  openList.push(start.y * mapWidth + start.x);

  while (nodeList.length > 0)
  {
    let bestIndex = 0;
    for (var i = 0; i < nodeList.length; i++)
    {
      if (nodeList[i].f < nodeList[bestIndex].f)
      {
        bestIndex = i;
      }
    }

    const current = nodeList[bestIndex];
    const x1 = current.x;
    const y1 = current.y;
    const pos1 = y1 * mapWidth + x1;
    const g1 = current.g;

    nodeList.splice(bestIndex, 1);
    openList.splice(openList.indexOf(pos1), 1);
    closedList.push(pos1);

    if (current.x === goalX && current.y === goalY)
    {
      best = current;
      goaled = true;
      break;
    }

    if (g1 >= searchLimit)
    {
      continue;
    }

    for (var j = 1; j <= 9; j++)
    {
      if (j === 5)
      {
        continue;
      }
      var directions;
      if (this.isDiagonalDirection(j))
      {
        directions = this.getDiagonalDirections(j);
      }
      else
      {
        directions = [j, j];
      }

      const [horz, vert] = directions;
      const x2 = $gameMap.roundXWithDirection(x1, horz);
      const y2 = $gameMap.roundYWithDirection(y1, vert);
      const pos2 = y2 * mapWidth + x2;

      if (closedList.contains(pos2))
      {
        continue;
      }

      if (this.isStraightDirection(j))
      {
        if (!this.canPass(x1, y1, j))
        {
          continue;
        }
      }
      else if (this.isDiagonalDirection(j))
      {
        if (!this.canPassDiagonally(x1, y1, horz, vert))
        {
          continue;
        }
      }

      var g2 = g1 + 1;
      var index2 = openList.indexOf(pos2);

      if (index2 < 0 || g2 < nodeList[index2].g)
      {
        var neighbor;
        if (index2 >= 0)
        {
          neighbor = nodeList[index2];
        }
        else
        {
          neighbor = {};
          nodeList.push(neighbor);
          openList.push(pos2);
        }
        neighbor.parent = current;
        neighbor.x = x2;
        neighbor.y = y2;
        neighbor.g = g2;
        neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
        if (!best || neighbor.f - neighbor.g < best.f - best.g)
        {
          best = neighbor;
        }
      }
    }
  }

  let node = best;
  while (node.parent && node.parent !== start)
  {
    node = node.parent;
  }

  const deltaX1 = $gameMap.deltaX(node.x, start.x);
  const deltaY1 = $gameMap.deltaY(node.y, start.y);
  if (deltaY1 > 0)
  {
    return deltaX1 === 0 ? 2 : deltaX1 > 0 ? 3 : 1;
  }
  else if (deltaY1 < 0)
  {
    return deltaX1 === 0 ? 8 : deltaX1 > 0 ? 9 : 7;
  }
  else
  {
    if (deltaX1 !== 0)
    {
      return deltaX1 > 0 ? 6 : 4;
    }
  }

  const deltaX2 = this.deltaXFrom(goalX);
  const deltaY2 = this.deltaYFrom(goalY);
  if (Math.abs(deltaX2) > Math.abs(deltaY2))
  {
    if (deltaX2 > 0)
    {
      return deltaY2 === 0 ? 4 : deltaY2 > 0 ? 7 : 1;
    }
    else if (deltaX2 < 0)
    {
      return deltaY2 === 0 ? 6 : deltaY2 > 0 ? 9 : 3;
    }
    else
    {
      return deltaY2 === 0 ? 0 : deltaY2 > 0 ? 8 : 2;
    }
  }
  else
  {
    if (deltaY2 > 0)
    {
      return deltaX2 === 0 ? 8 : deltaX2 > 0 ? 7 : 9;
    }
    else if (deltaY2 < 0)
    {
      return deltaX2 === 0 ? 2 : deltaX2 > 0 ? 1 : 3;
    }
    else
    {
      return deltaX2 === 0 ? 0 : deltaX2 > 0 ? 4 : 6;
    }
  }
};
/* eslint-enable */
//#endregion Game_Character

//#region Game_CharacterBase
/**
 * Extends the `initMembers()` to allow custom move speeds and dashing.
 */
J.ABS.Aliased.Game_CharacterBase.initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function()
{
  J.ABS.Aliased.Game_CharacterBase.initMembers.call(this);

  /**
   * The real
   * @type {number}
   * @private
   */
  this._realMoveSpeed = 4;
  this._wasDodging = false;
  this._dodgeBoost = 0;
};

/**
 * OVERWRITE Replaces the "real move speed" value to return
 * our custom real move speed instead, along with dash boosts as necessary.
 * @returns {number}
 */
Game_CharacterBase.prototype.realMoveSpeed = function()
{
  const dashBoost = (this.isDashing()
    ? this.dashSpeed()
    : 0);
  const realMoveSpeed = this._realMoveSpeed + dashBoost;
  return realMoveSpeed;
};

/**
 * Default speed boost for all characters when dashing.
 */
Game_CharacterBase.prototype.dashSpeed = function()
{
  return J.ABS.Metadata.DashSpeedBoost;
};

/**
 * Extends the `setMoveSpeed()` to also modify custom move speeds.
 */
J.ABS.Aliased.Game_CharacterBase.setMoveSpeed = Game_CharacterBase.prototype.setMoveSpeed;
Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed)
{
  // perform original logic.
  J.ABS.Aliased.Game_CharacterBase.setMoveSpeed.call(this, moveSpeed);

  // set the underlying real move speed to this.
  this._realMoveSpeed = moveSpeed;
};

/**
 * Sets the boost gained when dodging to a specified amount.
 * @param {number} dodgeMoveSpeed The boost gained when dodging.
 */
Game_CharacterBase.prototype.setDodgeBoost = function(dodgeMoveSpeed)
{
  this._dodgeBoost = dodgeMoveSpeed;
};

/**
 * Extends the update to allow for custom values while dashing.
 */
J.ABS.Aliased.Game_CharacterBase.update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function()
{
  J.ABS.Aliased.Game_CharacterBase.update.call(this);
  this.updateDodging();
};

/**
 * Whether or not the player has executed a dodge skill.
 */
Game_CharacterBase.prototype.isDodging = function()
{
  const player = $jabsEngine.getPlayer1();
  return player.isDodging();
};

/**
 * Alters the speed when dodging (and when dodging is finished).
 */
Game_CharacterBase.prototype.updateDodging = function()
{
  // get the current state of the player's dodge.
  const isDodging = this.isDodging();

  this.handleDodgeStart(isDodging);
  this.handleDodgeEnd(isDodging);

  this._wasDodging = isDodging;
};

/**
 * Handles the start of dodging, if necessary.
 * If the player's current dodge state is active, then modify the move speed accordingly.
 * @param {boolean} isDodging True if the player is dodging right now, false otherwise.
 */
Game_CharacterBase.prototype.handleDodgeStart = function(isDodging)
{
  // if are currently dodging, update our move speed to the dodge speed instead.
  if (!this._wasDodging && isDodging)
  {
    this.setMoveSpeed(this._moveSpeed + this._dodgeBoost);
  }
};

/**
 * Handles the end of dodging, if necessary.
 * If the player's current dodge state is inactive, then return the move speed to normal.
 * @param {boolean} isDodging True if the player is dodging right now, false otherwise.
 */
Game_CharacterBase.prototype.handleDodgeEnd = function(isDodging)
{
  // if we are no longer doding, but were before, reduce the move speed back to normal.
  if (this._wasDodging && !isDodging)
  {
    this.setMoveSpeed(this._moveSpeed - this._dodgeBoost);
  }
};
//#endregion Game_CharacterBase

//#region Game_Enemies
/**
 * A class for retrieving a particular enemy.
 */
// function Game_Enemies()
// {
//   this.initialize(...arguments);
// }
//
// /**
//  * Initializes this `Game_Enemies` class.
//  */
// Game_Enemies.prototype.initialize = function()
// {
//   this._data = [];
// };
//
// /**
//  * Looks up and caches an enemy of the given id.
//  * @param {number} enemyId The id to look up an enemy for.
//  * @returns {Game_Enemy}
//  */
// Game_Enemies.prototype.enemy = function(enemyId)
// {
//   // check to make sure there is a matching enemy in the database.
//   if ($dataEnemies[enemyId])
//   {
//     // check if our cache has this enemy entry.
//     if (!this._data[enemyId])
//     {
//       this._data[enemyId] = new Game_Enemy(enemyId, null, null);
//     }
//
//     return this._data[enemyId];
//   }
//   return null;
// };

/**
 * A class that acts as a lazy dictionary for {@link Game_Enemy} data.
 * Do not use the enemies from this class as actual battlers!
 */
class Game_Enemies
{
  /**
   * A simple cache to store enemies by their ids.
   * @type {Map<number, Game_Enemy>}
   */
  #cache = new Map();

  /**
   * Gets the enemy battler data for the enemy id provided.
   * @param {number} enemyId The enemy id to generate an enemy for.
   * @returns {Game_Enemy} The enemy battler data.
   */
  enemy(enemyId)
  {
    // check if we have the enemy already in the cache.
    if (this.#cache.has(enemyId))
    {
      // return the cached enemy.
      return this.#cache.get(enemyId);
    }

    // create the new enemy.
    const enemy = new Game_Enemy(enemyId, null, null);

    // add the new enemy to the cache.
    this.#cache.set(enemyId, enemy);

    // return the enemy.
    return enemy;
  }
}
//#endregion Game_Enemies

//#region Game_Enemy
/**
 * Extends {@link Game_Enemy.setup}.
 * Includes JABS skill initialization.
 */
J.ABS.Aliased.Game_Enemy.set('setup', Game_Enemy.prototype.setup);
Game_Enemy.prototype.setup = function(enemyId, x, y)
{
  // perform original logic.
  J.ABS.Aliased.Game_Enemy.get('setup').call(this, enemyId, x, y);

  // initialize the combat skills for the battler.
  this.initAbsSkills();
};

/**
 * Initializes the JABS equipped skills based on skill data from this enemy.
 */
Game_Enemy.prototype.initAbsSkills = function()
{
  this.getSkillSlotManager().setupSlots(this);
};

/**
 * Gets the battler id of this enemy from the database.
 * @returns {number}
 */
Game_Enemy.prototype.battlerId = function()
{
  return this.enemyId();
};

/**
 * Gets the enemy's basic attack skill id.
 * This is defined by the first "Attack Skill" trait on an enemy.
 * If there are multiple traits of this kind, only the first found will be used.
 * @returns {number}
 */
J.ABS.Aliased.Game_Enemy.set('basicAttackSkillId', Game_Enemy.prototype.basicAttackSkillId);
Game_Enemy.prototype.basicAttackSkillId = function()
{
  // check our enemy to see if we found a custom basic attack skill id.
  const basicAttackSkillId = J.ABS.Aliased.Game_Enemy.get('basicAttackSkillId').call(this);

  // if we didn't find one, return the default instead.
  return basicAttackSkillId ?? J.ABS.Metadata.DefaultEnemyAttackSkillId;
};

/**
 * Gets the current number of bonus hits for this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.getBonusHits = function()
{
  // default the bonus hits to 0.
  let bonusHits = 0;

  // grab all things that have notes.
  const objectsToCheck = this.getAllNotes();

  // accumulate all bonus hits from all objects.
  objectsToCheck.forEach(obj => bonusHits += obj.jabsBonusHits ?? 0);

  // return what we found.
  return bonusHits;
};

/**
 * Gets the enemy's prepare time from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.prepareTime = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // find the trait that is for prepare time.
  const prepareTimeTrait = referenceData.traits.find(trait => trait.code === J.BASE.Traits.ATTACK_SPEED);

  // if we found a trait, prefer that first.
  if (prepareTimeTrait) return prepareTimeTrait.value;

  // grab the prepare time from the notes of the battler.
  const prepareFromNotes = referenceData.jabsPrepareTime;

  // if we found a note, prefer that second.
  if (prepareFromNotes) return prepareFromNotes;

  // if we don't have a trait or note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyPrepareTime;
};

/**
 * Gets the enemy's team id from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.teamId = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the team id from the battler.
  const teamId = referenceData.jabsTeamId;

  // if they don't have a team id tag, then return the default.
  if (!teamId) return JABS_Battler.enemyTeamId();

  // return the team id.
  return referenceData.jabsTeamId;
};

/**
 * Gets the enemy's ai from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {JABS_BattlerAI}
 */
Game_Enemy.prototype.ai = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the battler ai from the battler.
  const battlerAi = referenceData.jabsBattlerAi;

  // return what we found.
  return battlerAi;
};

/**
 * Gets the enemy's sight range from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.sightRange = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the sight range from the notes of the battler.
  const sightRange = referenceData.jabsSightRange;

  // check if the sight range is a non-null value.
  if (sightRange !== null)
  {
    // return the parsed sight range.
    return sightRange;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemySightRange;
};

/**
 * Gets the enemy's boost to sight range when alerted from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.alertedSightBoost = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the alerted sight boost from the notes of the battler.
  const alertedSightBoost = referenceData.jabsAlertedSightBoost;

  // check if the alerted sight boost is a non-null value.
  if (alertedSightBoost !== null)
  {
    // return the parsed alerted sight boost.
    return alertedSightBoost;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyAlertedSightBoost;
};

/**
 * Gets the enemy's pursuit range from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.pursuitRange = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the pursuit range from the notes of the battler.
  const pursuitRange = referenceData.jabsPursuitRange;

  // check if the pursuit range is a non-null value.
  if (pursuitRange !== null)
  {
    // return the parsed pursuit range.
    return pursuitRange;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyPursuitRange;
};

/**
 * Gets the enemy's boost to pursuit range when alerted from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.alertedPursuitBoost = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the alerted pursuit boost from the notes of the battler.
  const alertedSightBoost = referenceData.jabsAlertedPursuitBoost;

  // check if the alerted pursuit boost is a non-null value.
  if (alertedSightBoost !== null)
  {
    // return the parsed alerted pursuit boost.
    return alertedSightBoost;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyAlertedPursuitBoost;
};

/**
 * Gets the enemy's duration for being alerted from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.alertDuration = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the alert duration from the notes of the battler.
  const alertDuration = referenceData.jabsAlertDuration;

  // check if the alert duration is a non-null value.
  if (alertDuration !== null)
  {
    // return the parsed alert duration.
    return alertDuration;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyAlertDuration
};

/**
 * Gets whether or not an enemy can idle about from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.canIdle = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are allowed to idle.
  const canIdle = referenceData.jabsConfigCanIdle;

  // if we found a non-null value, return it.
  if (canIdle !== null) return canIdle;

  // check if we are disallowed from idling.
  const cannotIdle = referenceData.jabsConfigNoIdle;

  // if we found a non-null value, return it.
  if (cannotIdle !== null) return cannotIdle;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyCanIdle;
};

/**
 * Gets whether or not an enemy has a visible hp bar from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.showHpBar = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are allowed to show the hp bar.
  const showHpBar = referenceData.jabsConfigShowHpBar;

  // if we found a non-null value, return it.
  if (showHpBar !== null) return showHpBar;

  // check if we are disallowed from showing the hp bar.
  const noHpBar = referenceData.jabsConfigNoHpBar;

  // if we found a non-null value, return it.
  if (noHpBar !== null) return noHpBar;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyShowHpBar;
};

/**
 * Gets whether or not an enemy has a visible battler name from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.showBattlerName = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are allowed to show the battler's name.
  const showName = referenceData.jabsConfigShowName;

  // if we found a non-null value, return it.
  if (showName !== null) return showName;

  // check if we are disallowed from showing the battler's name.
  const noName = referenceData.jabsConfigNoName;

  // if we found a non-null value, return it.
  if (noName !== null) return noName;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyShowBattlerName;
};

/**
 * Gets whether or not an enemy is invincible from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.isInvincible = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are enabling invincibility.
  const isInvincible = referenceData.jabsConfigInvincible;

  // if we found a non-null value, return it.
  if (isInvincible !== null) return isInvincible;

  // check if we are disabling invincibility.
  const notInvincible = referenceData.jabsConfigNotInvincible;

  // if we found a non-null value, return it.
  if (notInvincible !== null) return notInvincible;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyIsInvincible;
};

/**
 * Gets whether or not an enemy is inanimate from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.isInanimate = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are enabling invincibility.
  const isInanimate = referenceData.jabsConfigInanimate;

  // if we found a non-null value, return it.
  if (isInanimate !== null) return isInanimate;

  // check if we are disabling invincibility.
  const notInanimate = referenceData.jabsConfigNotInanimate;

  // if we found a non-null value, return it.
  if (notInanimate !== null) return notInanimate;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyIsInanimate;
};
//#endregion Game_Enemy

//#region Game_Event
J.ABS.Aliased.Game_Event.initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function()
{
  this._j ||= {};

  /**
   * The various parameters extracted from the event on the field.
   * These parameters describe a battler's core data points so that
   * their `JABS_Battler` can be constructed.
   * @type {JABS_BattlerCoreData}
   */
  this._j._battlerData = null;

  /**
   * The initial direction this event is facing.
   */
  this._j._initialDirection = 0;

  /**
   * The direction the player was facing when the skill was executed.
   * Only applicable to action events.
   * @type {number}
   */
  this._j._castedDirection = 0;
  J.ABS.Aliased.Game_Event.initMembers.call(this);
};

/**
 * Binds a `JABS_Action` to a `Game_Event`.
 * @param {JABS_Action} action The action to assign to this `Game_Event`.
 */
Game_Event.prototype.setMapActionData = function(action)
{
  this._j._action.actionData = action;
};

/**
 * Sets the initial direction being faced on this event's creation.
 * @param {number} direction The initial direction faced on creation.
 */
Game_Event.prototype.setCustomDirection = function(direction)
{
  // don't turn if direction is fixed.
  if (this.isDirectionFixed()) return;

  this._j._initialDirection = direction;
};

/**
 * Gets the initial direction being faced on this event's creation.
 * @returns {number}
 */
Game_Event.prototype.getCustomDirection = function()
{
  return this._j._initialDirection;
};

/**
 * Sets the initial direction being faced on this event's creation.
 * @param {number} direction The initial direction faced on creation.
 */
Game_Event.prototype.setCastedDirection = function(direction)
{
  // don't turn if direction is fixed.
  if (this.isDirectionFixed()) return;

  this._j._castedDirection = direction;
};

/**
 * Gets the initial direction being faced on this event's creation.
 * @returns {number}
 */
Game_Event.prototype.getCastedDirection = function()
{
  return this._j._castedDirection;
};

/**
 * Modifies the `.event` method of `Game_Event` to return the data from the
 * $actionMap if it isn't a normal event.
 */
J.ABS.Aliased.Game_Event.event = Game_Event.prototype.event;
Game_Event.prototype.event = function()
{
  if (this.isAction())
  {
    return $jabsEngine.event(this.getMapActionUuid());
  }

  return J.ABS.Aliased.Game_Event.event.call(this);
};

/**
 * Adds an extra catch so that if there is a failure, then the failure is
 * silently ignored because bad timing is just bad luck!
 */
J.ABS.Aliased.Game_Event.findProperPageIndex = Game_Event.prototype.findProperPageIndex;
Game_Event.prototype.findProperPageIndex = function()
{
  try
  {
    const test = J.ABS.Aliased.Game_Event.findProperPageIndex.call(this);
    if (Number.isInteger(test)) return test;
  }
  catch (err)
  {
    return -1;
  }
};

/**
 * OVERWRITE When an map battler is hidden by something like a switch or some
 * other condition, unveil it upon meeting such conditions.
 */
J.ABS.Aliased.Game_Event.refresh = Game_Event.prototype.refresh;
Game_Event.prototype.refresh = function()
{
  if ($jabsEngine.absEnabled)
  {
    // don't refresh loot.
    if (this.isLoot()) return;

    const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
    if (this._pageIndex !== newPageIndex)
    {
      this._pageIndex = newPageIndex;
      this.setupPage();
      this.transformBattler();
    }
  }
  else
  {
    J.ABS.Aliased.Game_Event.refresh.call(this);
  }
};

/**
 * Extends this method to accommodate for the possibility of that one
 * error propping up where an attempt to update an event that is no longer
 * available for updating causing the game to crash.
 */
J.ABS.Aliased.Game_Event.page = Game_Event.prototype.page;
Game_Event.prototype.page = function()
{
  if (this.event())
  {
    return J.ABS.Aliased.Game_Event.page.call(this);
  }

  /*
  console.log($dataMap.events);
  console.log($gameMap._events);
  console.warn(this);
  console.warn('that thing happened again, you should probably look into this.');
  */
  return null;
};

/**
 * Reveals a battler that was hidden.
 */
Game_Event.prototype.transformBattler = function()
{
  const battler = this.getJabsBattler();
  if (battler)
  {
    battler.revealHiddenBattler();
  }

  $gameMap.refreshOneBattler(this);
};

/**
 * Extends the pagesettings for events and adds on custom parameters to this event.
 */
J.ABS.Aliased.Game_Event.setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Event.setupPageSettings.call(this);

  // parse the comments on the event to potentially transform it into a battler.
  this.parseEnemyComments();
};

/**
 * Parses the comments of this event to extract battler core data if available.
 *
 * JABS parameters are prioritized in this order:
 *  1) from the comments on the event page itself.
 *  2) from the notes of the enemy in the database (requires at least enemy id in comments).
 *  3) from the defaults of all enemies.
 */
Game_Event.prototype.parseEnemyComments = function()
{
  // apply the custom move speeds from this event if any are available.
  this.applyCustomMoveSpeed();

  // if there is something stopping us from parsing comments, then do not.
  if (!this.canParseEnemyComments())
  {
    this.initializeCoreData(null);
    return;
  }

  //  determine our overrides.
  const battlerId = this.getBattlerIdOverrides();

  // get the battler data for enemies of this id.
  const enemyBattler = $gameEnemies.enemy(battlerId);

  // determine the event-page overrides for the various core battler data.
  let teamId = this.getTeamIdOverrides() ?? enemyBattler.teamId();
  const ai = this.getBattlerAiOverrides() ?? enemyBattler.ai();
  const sightRange = this.getSightRangeOverrides() ?? enemyBattler.sightRange();
  const alertedSightBoost = this.getAlertedSightBoostOverrides() ?? enemyBattler.alertedSightBoost();
  const pursuitRange = this.getPursuitRangeOverrides() ?? enemyBattler.pursuitRange();
  const alertedPursuitBoost = this.getAlertedPursuitBoostOverrides() ?? enemyBattler.alertedPursuitBoost();
  const alertDuration = this.getAlertDurationOverrides() ?? enemyBattler.alertDuration();
  let canIdle = this.getCanIdleOverrides() ?? enemyBattler.canIdle();
  let showHpBar = this.getShowHpBarOverrides() ?? enemyBattler.showHpBar();
  let showBattlerName = this.getShowBattlerNameOverrides() ?? enemyBattler.showBattlerName();
  const isInvincible = this.getInvincibleOverrides() ?? enemyBattler.isInvincible();
  const isInanimate = this.getInanimateOverrides() ?? enemyBattler.isInanimate();

  // if inanimate, override the overrides with these instead.
  if (isInanimate)
  {
    // inanimate objects belong to the neutral team.
    teamId = JABS_Battler.neutralTeamId();

    // inanimate objects cannot idle, lack hp bars, and won't display their name.
    canIdle = false;
    showHpBar = false;
    showBattlerName = false;
  }

  // build the core data.
  const battlerCoreData = new JABS_CoreDataBuilder(battlerId)
    .setTeamId(teamId)
    .setBattlerAi(ai)
    .setSightRange(sightRange)
    .setAlertedSightBoost(alertedSightBoost)
    .setPursuitRange(pursuitRange)
    .setAlertedPursuitBoost(alertedPursuitBoost)
    .setAlertDuration(alertDuration)
    .setCanIdle(canIdle)
    .setShowHpBar(showHpBar)
    .setShowBattlerName(showBattlerName)
    .setIsInvincible(isInvincible)
    .setIsInanimate(isInanimate)
    .build();

  // initialize the core data based on this.
  this.initializeCoreData(battlerCoreData);
};

//#region overrides
/**
 * Parses out the enemy id from a list of event commands.
 * @returns {number} The found battler id, or 0 if not found.
 */
Game_Event.prototype.getBattlerIdOverrides = function()
{
  // all variables gotta start somewhere.
  let battlerId = 0;

  // check all the valid event commands to see what our battler id is.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.EnemyId.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    battlerId = parseInt(regexResult[1]);
  });

  // return what we found.
  return battlerId;
};

/**
 * Parses out the team id from a list of event commands.
 * @returns {number|null} The found team id, or null if not found.
 */
Game_Event.prototype.getTeamIdOverrides = function()
{
  // default team id for an event is an enemy.
  let teamId = 1;

  // check all the valid event commands to see if we have an override for team.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.TeamId.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    teamId = parseInt(regexResult[1]);
  });

  // return what we found.
  return teamId;
};

/**
 * Parses out the battler ai including their bonus ai traits.
 * @returns {JABS_BattlerAI} The constructed battler AI.
 */
Game_Event.prototype.getBattlerAiOverrides = function()
{
  // default to not having any ai traits.
  let careful = false;
  let executor = false;
  let reckless = false;
  let healer = false;
  let follower = false;
  let leader = false;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "careful" ai trait.
    if (J.ABS.RegExp.AiTraitCareful.test(comment))
    {
      // parse the value out of the regex capture group.
      careful = true;
    }

    // check if this battler has the "executor" ai trait.
    if (J.ABS.RegExp.AiTraitExecutor.test(comment))
    {
      // parse the value out of the regex capture group.
      executor = true;
    }

    // check if this battler has the "reckless" ai trait.
    if (J.ABS.RegExp.AiTraitReckless.test(comment))
    {
      // parse the value out of the regex capture group.
      reckless = true;
    }

    // check if this battler has the "healer" ai trait.
    if (J.ABS.RegExp.AiTraitHealer.test(comment))
    {
      // parse the value out of the regex capture group.
      healer = true;
    }

    // check if this battler has the "follower" ai trait.
    if (J.ABS.RegExp.AiTraitFollower.test(comment))
    {
      // parse the value out of the regex capture group.
      follower = true;
    }

    // check if this battler has the "leader" ai trait.
    if (J.ABS.RegExp.AiTraitLeader.test(comment))
    {
      // if the value is present, then it must be
      leader = true;
    }
  });

  // return the overridden battler ai.
  return new JABS_BattlerAI(careful, executor, reckless, healer, follower, leader);
};

/**
 * Parses out the sight range from a list of event commands.
 * @returns {number|null} The found sight range, or null if not found.
 */
Game_Event.prototype.getSightRangeOverrides = function()
{
  // core combat values are null by default.
  let sightRange = null;

  // check all the valid event commands to see if we have an override for sight.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.Sight.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    sightRange = parseInt(regexResult[1]);
  });

  // return what we found.
  return sightRange;
};

/**
 * Parses out the alerted sight boost from a list of event commands.
 * @returns {number|null} The found alerted sight boost range, or null if not found.
 */
Game_Event.prototype.getAlertedSightBoostOverrides = function()
{
  // core combat values are null by default.
  let alertedSightBoost = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.AlertedSightBoost.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    alertedSightBoost = parseInt(regexResult[1]);
  });

  // return what we found.
  return alertedSightBoost;
};

/**
 * Parses out the pursuit range from a list of event commands.
 * @returns {number|null} The found pursuit range, or null if not found.
 */
Game_Event.prototype.getPursuitRangeOverrides = function()
{
  // core combat values are null by default.
  let pursuitRange = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.Pursuit.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    pursuitRange = parseInt(regexResult[1]);
  });

  // return what we found.
  return pursuitRange;
};

/**
 * Parses out the alerted pursuit boost from a list of event commands.
 * @returns {number|null} The found alerted pursuit boost range, or null if not found.
 */
Game_Event.prototype.getAlertedPursuitBoostOverrides = function()
{
  // core combat values are null by default.
  let alertedPursuitBoost = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.AlertedPursuitBoost.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    alertedPursuitBoost = parseFloat(regexResult[1]);
  });

  // return what we found.
  return alertedPursuitBoost;
};

/**
 * Parses out the alert duration from a list of event commands.
 * @returns {number|null} The found alert duration, or null if not found.
 */
Game_Event.prototype.getAlertDurationOverrides = function()
{
  // core combat values are null by default.
  let alertDuration = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.AlertDuration.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    alertDuration = parseInt(regexResult[1]);
  });

  // return what we found.
  return alertDuration;
};

/**
 * Parses out the override for whether or not this battler can idle about.
 * @returns {boolean|null} True if we force-allow idling, false if we force-disallow, null if no overrides.
 */
Game_Event.prototype.getCanIdleOverrides = function()
{
  // all variables gotta start somewhere.
  let canIdle = null;

  // check all the valid event commands to see if we have any config options.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "noIdle" config option.
    if (J.ABS.RegExp.ConfigNoIdle.test(comment))
    {
      // parse the value out of the regex capture group.
      canIdle = false;
    }


    // check if this battler has the "canIdle" config option.
    if (J.ABS.RegExp.ConfigCanIdle.test(comment))
    {
      // parse the value out of the regex capture group.
      canIdle = true;
    }
  });

  // return the truth.
  return canIdle;
};

/**
 * Parses out the override for whether or not this battler can show its hp bar.
 * @returns {boolean|null} True if we force-allow showing, false if we force-disallow, null if no overrides.
 */
Game_Event.prototype.getShowHpBarOverrides = function()
{
  // all variables gotta start somewhere.
  let showHpBar = null;

  // check all the valid event commands to see if we have any config options.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "noHpBar" config option.
    if (J.ABS.RegExp.ConfigNoHpBar.test(comment))
    {
      // parse the value out of the regex capture group.
      showHpBar = false;
    }

    // check if this battler has the "showHpBar" config option.
    if (J.ABS.RegExp.ConfigShowHpBar.test(comment))
    {
      // parse the value out of the regex capture group.
      showHpBar = true;
    }
  });

  // return the truth.
  return showHpBar;
};

/**
 * Parses out the override for whether or not this battler is inanimate.
 * @returns {boolean|null} True if we force-inanimate, false if we force-un-inanimate, null if no overrides.
 */
Game_Event.prototype.getInanimateOverrides = function()
{
  // all variables gotta start somewhere.
  let inanimate = null;

  // check all the valid event commands to see if we have any config options.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "notInanimate" config option.
    if (J.ABS.RegExp.ConfigNotInanimate.test(comment))
    {
      // parse the value out of the regex capture group.
      inanimate = false;
    }

    // check if this battler has the "inanimate" config option.
    if (J.ABS.RegExp.ConfigInanimate.test(comment))
    {
      // parse the value out of the regex capture group.
      inanimate = true;
    }
  });

  // return the truth.
  return inanimate;
};

/**
 * Parses out the override for whether or not this battler is invincible.
 * @returns {boolean|null} True if we force-invincibile, false if we force-un-invincible, null if no overrides.
 */
Game_Event.prototype.getInvincibleOverrides = function()
{
  // all variables gotta start somewhere.
  let isInvincible = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "invincible" config option.
    if (J.ABS.RegExp.ConfigInvincible.test(comment))
    {
      // parse the value out of the regex capture group.
      isInvincible = true;
    }

    // check if this battler has the "notInvincible" config option.
    if (J.ABS.RegExp.ConfigNotInvincible.test(comment))
    {
      // parse the value out of the regex capture group.
      isInvincible = false;
    }
  });

  // return the truth.
  return isInvincible;
};

/**
 * Parses out the override for whether or not this battler can show its name.
 * @returns {boolean|null} True if we force-allow showing, false if we force-disallow, null if no overrides.
 */
Game_Event.prototype.getShowBattlerNameOverrides = function()
{
  // all variables gotta start somewhere.
  let showBattlerName = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "notInvincible" config option.
    if (J.ABS.RegExp.ConfigNoName.test(comment))
    {
      // parse the value out of the regex capture group.
      showBattlerName = false;
    }

    // check if this battler has the "invincible" config option.
    if (J.ABS.RegExp.ConfigShowName.test(comment))
    {
      // parse the value out of the regex capture group.
      showBattlerName = true;
    }
  });

  // return the truth.
  return showBattlerName;
};
//#endregion overrides

/**
 * Binds the initial core battler data to the event.
 * @param {JABS_BattlerCoreData|null} battlerCoreData The core data of this battler.
 */
Game_Event.prototype.initializeCoreData = function(battlerCoreData)
{
  this.setBattlerCoreData(battlerCoreData);
};

/**
 * Checks to see if this event [page] can have its comments parsed to
 * transform it into a `JABS_Battler`.
 * @returns {boolean} True if the event can be parsed, false otherwise.
 */
Game_Event.prototype.canParseEnemyComments = function()
{
  // if somehow it is less than -1, then do not. Weird things happen.
  if (this.findProperPageIndex() < -1) return false;

  // grab the event command list for analysis.
  const commentCommandList = this.getValidCommentCommands();

  // if we do not have a list of comments to parse, then do not.
  if (!commentCommandList.length) return false;

  // check all the commands to make sure a battler id is among them.
  const hasBattlerId = commentCommandList.some(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check to make sure this is at least an enemy of some kind.
    return J.ABS.RegExp.EnemyId.test(comment);
  });

  // if there is no battler id among the comments, then don't parse.
  if (!hasBattlerId) return false;

  // we are clear to parse out those comments!
  return true;
};

/**
 * Applies the custom move speed if available.
 */
Game_Event.prototype.applyCustomMoveSpeed = function()
{
  // grab the list of valid comments.
  const commentCommandList = this.getValidCommentCommands();

  // initialize the move speed.
  let moveSpeed = null;

  // iterate over the comments.
  commentCommandList.forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.MoveSpeed.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    moveSpeed = parseFloat(regexResult[1]);
  });

  // check if we encountered additional move speed modifiers.
  if (moveSpeed !== null)
  {
    // set the new movespeed.
    this.setMoveSpeed(moveSpeed);
  }
};

/**
 * Get the move speed of the current active page on this event.
 * @returns {number}
 */
Game_Event.prototype.getEventCurrentMovespeed = function()
{
  return this.event().pages[this.findProperPageIndex()].moveSpeed;
};

/**
 * Gets the core battler data for this event.
 * @returns {JABS_BattlerCoreData}
 */
Game_Event.prototype.getBattlerCoreData = function()
{
  return this._j._battlerData;
};

/**
 * Sets the core battler data for this event.
 * @param {JABS_BattlerCoreData} data The core data of the battler this event represents.
 */
Game_Event.prototype.setBattlerCoreData = function(data)
{
  this._j._battlerData = data;
};

/**
 * Gets whether or not this event is a JABS battler.
 * @returns {boolean}
 */
Game_Event.prototype.isJabsBattler = function()
{
  const data = this.getBattlerCoreData();
  return !!data;
};

/**
 * Gets the battler's id from their core data.
 * @returns {number}
 */
Game_Event.prototype.getBattlerId = function()
{
  const data = this.getBattlerCoreData();
  if (!data) return 0;

  return data.battlerId();
};
//#endregion Game_Event

//#region Game_Interpreter
/**
 * Enables setting move routes of `Game_Character`s on the map with JABS.
 * @param {number} param The character/event id to get the data for.
 * @returns {Game_Character}
 */
J.ABS.Aliased.Game_Interpreter.character = Game_Interpreter.prototype.character;
Game_Interpreter.prototype.character = function(param)
{
  if ($jabsEngine.absEnabled)
  {
    if (param < 0)
    {
      return $gamePlayer;
    }
    else if (this.isOnCurrentMap())
    {
      const id = param > 0 ? param : this._eventId;
      return $gameMap.event(id);
    }
    else
    {
      return null;
    }
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.character.call(this, param);
  }
};

/**
 * Enables transferring with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command201 = Game_Interpreter.prototype.command201;
Game_Interpreter.prototype.command201 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    if ($gameMessage.isBusy()) return false;

    let mapId;
    let x;
    let y;
    if (params[0] === 0)
    {
      mapId = params[1];
      x = params[2];
      y = params[3];
    }
    else
    {
      mapId = $gameVariables.value(params[1]);
      x = $gameVariables.value(params[2]);
      y = $gameVariables.value(params[3]);
    }

    $gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5]);
    this.setWaitMode("transfer");
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command201.call(this, params);
  }
};

/**
 * Enables map scrolling with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command204 = Game_Interpreter.prototype.command204;
Game_Interpreter.prototype.command204 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    if ($gameMap.isScrolling())
    {
      this.setWaitMode("scroll");
      return false;
    }

    $gameMap.startScroll(params[0], params[1], params[2]);
    if (params[3])
    {
      this.setWaitMode("scroll");
    }

    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command204.call(this, params);
  }
};

/**
 * Enables default battles with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 *
 * NOTE: Though the battling is enabled, the battles may not behave as one would
 * expect from a default battle system when using an ABS as well.
 */
J.ABS.Aliased.Game_Interpreter.command301 = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    let troopId;
    switch (params[0])
    {
      case 0:
        // Direct designation
        troopId = params[1];
        break;
      case 1:
        // Designation with a variable
        troopId = $gameVariables.value(params[1]);
        break;
      default:
        // Same as Random Encounters
        troopId = $gamePlayer.makeEncounterTroopId();
        break;
    }

    if ($dataTroops[troopId])
    {
      BattleManager.setup(troopId, params[2], params[3]);
      BattleManager.setEventCallback(n => this._branch[this._indent] = n);
      $gamePlayer.makeEncounterCount();
      SceneManager.push(Scene_Battle);
    }

    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command301.call(this, params);
  }
};

/**
 * Enables the shop scene with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command302 = Game_Interpreter.prototype.command302;
Game_Interpreter.prototype.command302 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    const goods = [params];
    while (this.nextEventCode() === 605)
    {
      this._index++;
      goods.push(this.currentCommand().parameters);
    }

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, params[4]);
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command302.call(this, params);
  }
};

/**
 * Enables the name input processing with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command303 = Game_Interpreter.prototype.command303;
Game_Interpreter.prototype.command303 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    if ($dataActors[params[0]])
    {
      SceneManager.push(Scene_Name);
      SceneManager.prepareNextScene(params[0], params[1]);
    }

    return true;
  }

  return J.ABS.Aliased.Game_Interpreter.command303.call(this, params);
};

/**
 * Enables saving with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command352 = Game_Interpreter.prototype.command352;
Game_Interpreter.prototype.command352 = function()
{
  if ($jabsEngine.absEnabled)
  {
    SceneManager.push(Scene_Save);
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command352.call(this);
  }
};
//#endregion Game_Interpreter

//#region Game_Map
/**
 * Hooks into `Game_Map.initialize()` to add the JABS object for tracking
 * all things related to the ABS system.
 */
J.ABS.Aliased.Game_Map.set('initialize', Game_Map.prototype.initialize);
Game_Map.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Map.get('initialize').call(this);

  // initialize jabs properties.
  this.initJabsMembers();
};

/**
 * Initializes properties of this class related to JABS.
 */
Game_Map.prototype.initJabsMembers = function()
{
  /**
   * The over-arching J object to contain all additional plugin parameters.
   */
  this._j ||= {};

  /**
   * A tracking list of all current battlers on this map.
   * @type {JABS_Battler[]}
   */
  this._j._allBattlers = [];
};

/**
 * Extends `Game_Map.setup()` to parse out battlers and populate enemies.
 */
J.ABS.Aliased.Game_Map.set('setup', Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Map.get('setup').call(this, mapId);

  // initialize all JABS-related data.
  this.initJabsEngine();
};

/**
 * Initializes all enemies and the battle map for JABS.
 */
Game_Map.prototype.initJabsEngine = function()
{
  // don't do things if we aren't using JABS.
  if (!$jabsEngine.absEnabled) return;

  // initialize the battle map for this map.
  $jabsEngine.initialize();

  // refresh all the battlers on this map.
  this.refreshAllBattlers();
};

/**
 * Refresh all battlers on the map. This only affects existing enemies on the map.
 * If an enemy was defeated and thus removed, that enemy is gone until the map is
 * reinitialized.
 */
Game_Map.prototype.refreshAllBattlers = function()
{
  /**
   * A collection of all existing battlers on the current map.
   * @type {JABS_Battler[]}
   */
  this._j._allBattlers = this.parseBattlers();
};

/**
 * Refreshes a single battler on this map. Only affects existing enemies on the map.
 * This is used almost exclusively with conditional event rendering.
 * @param {Game_Event} event The event to refresh.
 */
Game_Map.prototype.refreshOneBattler = function(event)
{
  // get the index of the battler by uuid, assuming they exist in the collection.
  const [battler, targetIndex] = this.findBattlerByUuid(event.getJabsBattlerUuid());

  // if we found a match, it is update/delete.
  const newBattler = this.convertOneToEnemy(event);
  if (battler)
  {
    // check to see if the new page is an enemy.
    if (newBattler === null)
    {
      // if not an enemy, delete it from the battler tracking.
      this.destroyBattler(battler, true);
    }
    else
    {
      // if it is an enemy, update the old enemy with the new one.
      this._j._allBattlers[targetIndex] = newBattler;
    }
  }

  // if we didn't find a match, then its create or do nothing.
  else
  {
    // the next page is an enemy, create a new one and add to the list.
    if (!(newBattler === null))
    {
      this._j._allBattlers.push(newBattler);
    }
    // the next page is not an enemy, do nothing.
  }
};

/**
 * Hooks into `Game_Map.update()` to add the battle map's update.
 */
J.ABS.Aliased.Game_Map.set('update', Game_Map.prototype.update);
Game_Map.prototype.update = function(sceneActive)
{
  // perform original logic.
  J.ABS.Aliased.Game_Map.get('update').call(this, sceneActive);

  // update JABS-related things.
  this.updateJabs();
};

/**
 * Updates things related to JABS.
 */
Game_Map.prototype.updateJabs = function()
{
  // update JABS battle map.
  $jabsEngine.update();
};

/**
 * Gets all action events that have yet to have a `Sprite_Character` generated for them.
 * @returns {Game_Event[]} A list of all newly added action events.
 */
Game_Map.prototype.newActionEvents = function()
{
  // the filter function for only retrieving newly-added action events.
  const filtering = event =>
  {
    // we only care about actions that also need adding.
    if (event.getActionSpriteNeedsAdding()) return true;

    // it must have already had a sprite created for this action.
    return false;
  };

  // return the new-action-filtered event list.
  return this.actionEvents().filter(filtering);
};

/**
 * Gets all action events that have reached their expiration and need removal.
 * @returns {Game_Event[]} A list of all expired action events.
 */
Game_Map.prototype.expiredActionEvents = function()
{
  // the filter function for only retrieving expired action events.
  const filtering = event =>
  {
    // we only care about actions that are past their prime.
    if (event.getJabsActionNeedsRemoving()) return true;

    // the action must still be valid.
    return false;
  };

  // return the expired-action-filtered event list.
  return this.actionEvents().filter(filtering);
};

/**
 * Gets all action events that have reached their expiration and need removal.
 * @returns {rm.types.Event[]} All relevant action metadatas.
 */
Game_Map.prototype.actionEventsFromDataMapByUuid = function(uuid)
{
  // the filter function for retrieving action metadatas from the datamap.
  /** @param {rm.types.Event} metadata */
  const filtering = metadata =>
  {
    // don't include invalid or non-action event metadatas.
    if (!metadata || !metadata.actionIndex) return false;

    // don't include actions metadatas that aren't related to the removed one.
    const actionMetadata = $jabsEngine.event(uuid);
    if (metadata.actionIndex !== actionMetadata.actionIndex) return false;

    // we want this metadata!
    return true;
  };

  // return the action-metadata-filtered event list.
  return $dataMap.events.filter(filtering);
};

/**
 * Gets all events that have a `JABS_Action` associated with them on the current map.
 * @returns {Game_Event[]} A list of events that have a `JABS_Action`.
 */
Game_Map.prototype.actionEvents = function()
{
  // the filter function for only retrieving action events.
  const filtering = event =>
  {
    // the only thing that matters is if we explicitly flagged it as an action.
    if (event.isAction) return true;

    // it must not be a real action.
    return false;
  };

  // return the action-filtered event list.
  return this.events().filter(filtering);
};

/**
 * Gets all loot events that have yet to have a `Sprite_Character` generated for them.
 * @returns {Game_Event[]} A list of all newly added loot events.
 */
Game_Map.prototype.newLootEvents = function()
{
  // the filter function for only retrieving newly-added loot events.
  const filtering = event =>
  {
    // we only care about loot that also needs adding.
    if (event.getLootNeedsAdding()) return true;

    // it must have already had a sprite created for this loot.
    return false;
  };

  // return the new-loot-filtered event list.
  return this.lootEvents().filter(filtering);
};

/**
 * Gets all loot events that have reached their expiration and need removal.
 * @returns {Game_Event[]} A list of all expired loot events.
 */
Game_Map.prototype.expiredLootEvents = function()
{
  // the filter function for only retrieving newly-added loot events.
  const filtering = event =>
  {
    // we only care about loot that is past its prime.
    if (event.getLootNeedsRemoving()) return true;

    // the loot must still be valid.
    return false;
  };

  // return the expired-loot-filtered event list.
  return this.lootEvents().filter(filtering);
};

/**
 * Gets all loot event metadatas that bear the same `uuid` as requested.
 * @returns {rm.types.Event[]} All relevant loot metadatas.
 */
Game_Map.prototype.lootEventsFromDataMapByUuid = function(uuid)
{
  // the filter function for retrieving loot metadatas from the datamap.
  /** @param {rm.types.Event} metadata */
  const filtering = metadata =>
  {
    // don't include invalid or non-action event metadatas.
    if (!metadata || !metadata.uuid) return false;

    // don't include loot metadatas that aren't related to the removed one.
    if (metadata.uuid !== uuid) return false;

    // we want this metadata!
    return true;
  };

  // return the action-metadata-filtered event list.
  return $dataMap.events.filter(filtering);
};

/**
 * Gets all events that have a `JABS_LootDrop` associated with them on the current map.
 * @returns {Game_Event[]} A list of events that have a `JABS_LootDrop`.
 */
Game_Map.prototype.lootEvents = function()
{
  // the filter function for only retrieving action events.
  const filtering = event =>
  {
    // only check if they are loot.
    if (event.isLoot()) return true;

    // it must not be loot.
    return false;
  };

  // return the loot-filtered event list.
  return this.events().filter(filtering);
};

/**
 * Gets all battlers on the current battle map.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getBattlers = function()
{
  if (this._j._allBattlers === null) return [];

  return this._j._allBattlers.filter(battler =>
  {
    const exists = !!battler;
    return exists && !battler.getCharacter()._erased;
  });
};

/**
 * Gets all battlers on the current battle map, including the player.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllBattlers = function()
{
  const battlers = this.getBattlers();
  if ($jabsEngine.getPlayer1())
  {
    battlers.push($jabsEngine.getPlayer1());
  }
  return battlers;
};

/**
 * Gets all battlers on the current map, and orders them by distance in relation to
 * a given "origin" battler. It simply uses the given battler's coordinates as the
 * origin and calculates distance from there for all battlers present.
 * @param {JABS_Battler} originBattler
 * @returns
 */
Game_Map.prototype.getAllBattlersDistanceSortedFromPlayer = function(originBattler)
{
  const battlers = this.getAllBattlers();
  return this.orderBattlersByDistanceFromBattler(battlers, originBattler);
};

/**
 * Sorts a collection of battlers by their distance from an origin battler.
 * @param {JABS_Battler[]} battlers The collection of battlers to sort.
 * @param {JABS_Battler} originBattler The origin battler to check distance against.
 * @returns
 */
Game_Map.prototype.orderBattlersByDistanceFromBattler = function(battlers, originBattler)
{
  return battlers.sort((battlerA, battlerB) =>
  {
    const distanceA = originBattler.distanceToDesignatedTarget(battlerA);
    const distanceB = originBattler.distanceToDesignatedTarget(battlerB);
    return distanceA - distanceB;
  });
};

/**
 * Find a battler on this map by their `uuid`.
 * @param {string} uuid The unique identifier of a battler to find.
 * @returns {(JABS_Battler|null)}
 */
Game_Map.prototype.getBattlerByUuid = function(uuid)
{
  const battlers = this.getAllBattlers();
  const jabsBattler = battlers.find(battler => battler.getUuid() === uuid);
  return jabsBattler
    ? jabsBattler
    : null;
};

/**
 * Checks whether or not a particular battler exists on the map.
 * @param {JABS_Battler} battlerToCheck The battler to check the existence of.
 * @returns {boolean}
 */
Game_Map.prototype.battlerExists = function(battlerToCheck)
{
  return !!this.getAllBattlers()
  .find(battler => battler.getUuid() === battlerToCheck.getUuid());
};

/**
 * Gets all battlers within a given range of another battler.
 * @param {JABS_Battler} user The user containing the base coordinates.
 * @param {number} maxDistance The maximum distance that we check battlers for.
 * @param {boolean} includePlayer Whether or not to include the player among battlers within range.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getBattlersWithinRange = function(user, maxDistance, includePlayer = true)
{
  const battlers = this.getBattlers();
  if (includePlayer)
  {
    battlers.push($jabsEngine.getPlayer1());
  }

  return battlers.filter(battler => user.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all nearby battlers that have an ai trait of `follower`.
 * @param {JABS_Battler} jabsBattler The battler to get all nearby followers for.
 * @returns {JABS_Battler[]} All ai-traited `follower` battlers.
 */
Game_Map.prototype.getNearbyFollowers = function(jabsBattler)
{
  const range = jabsBattler.getSightRadius() + jabsBattler.getPursuitRadius();
  const nearbyBattlers = $gameMap.getBattlersWithinRange(jabsBattler, range);

  // the filter function for determining if a battler is a follower to this leader.
  const filtering = battler =>
  {
    // grab the ai of the nearby battler.
    const ai = battler.getAiMode();

    // check if they can become a follower to the designated leader.
    const canLead = !battler.hasLeader() || (jabsBattler.getUuid() === battler.getLeader());

    // return the answer to that.
    return (ai.follower && !ai.leader && canLead);
  };

  return nearbyBattlers.filter(filtering);
};

/**
 * Clears leader data from another battler by it's `uuid`.
 * @param {string} followerUuid The `uuid` of the battler to clear leader data for.
 */
Game_Map.prototype.clearLeaderDataByUuid = function(followerUuid)
{
  const battler = this.getBattlerByUuid(followerUuid);
  if (battler)
  {
    battler.clearLeaderData();
  }
};

/**
 * Gets all battlers that are on a different team from the designated battler.
 * @param {JABS_Battler} user The battler to find opponents for.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getOpposingBattlers = function(user)
{
  const battlers = this.getBattlers();
  const player = $jabsEngine.getPlayer1();
  if (!user.isSameTeam(player.getTeam()))
  {
    battlers.push(player);
  }

  return battlers.filter(battler =>
  {
    const isNotSameTeam = !user.isSameTeam(battler.getTeam());
    const isNotNeutral = battler.getTeam() !== JABS_Battler.neutralTeamId();
    return isNotSameTeam && isNotNeutral;
  });
};

/**
 * Gets all battlers that are on a different team from the designated battler
 * within a given range.
 * @param {JABS_Battler} user The battler to find opponents for.
 * @param {number} maxDistance The max range to find opponents within.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getOpposingBattlersWithinRange = function(user, maxDistance)
{
  const battlers = this.getOpposingBattlers(user);
  return battlers.filter(battler => user.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all non-enemy battlers on the current battle map.
 * @returns {JABS_Battler[]} A list of allied battlers.
 */
Game_Map.prototype.getActorBattlers = function()
{
  return this.getAllBattlers()
  .filter(battler => battler.isActor());
};

/**
 * Gets all battlers that share the same team as the target.
 * @param {JABS_Battler} target The battler to compare for allies.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllyBattlers = function(target)
{
  const battlers = this.getAllBattlers();
  return battlers.filter(battler => target.isSameTeam(battler.getTeam()));
};

/**
 * Gets all battlers that share the same team as the target within a given range.
 * @param {JABS_Battler} target The battler to find opponents for.
 * @param {number} maxDistance The max range to find opponents within.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllyBattlersWithinRange = function(target, maxDistance)
{
  const battlers = this.getAllyBattlers(target);
  return battlers.filter(battler => target.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all non-ally battlers on the current battle map.
 * @returns {JABS_Battler[]} A list of enemy battlers.
 */
Game_Map.prototype.getEnemyBattlers = function()
{
  const battlers = this.getBattlers();
  const enemyBattlers = [];
  battlers.forEach(battler =>
  {
    if (battler.isEnemy())
    {
      enemyBattlers.push(battler);
    }
  });

  return enemyBattlers;
};

/**
 * Retrieves all events that are identified as loot on the map currently.
 */
Game_Map.prototype.getLootDrops = function()
{
  return this.events()
  .filter(event => event.isLoot());
};

/**
 * Parses out all enemies from the array of events on the map.
 * @returns {JABS_Battler[]} A `Game_Enemy[]`.
 */
Game_Map.prototype.parseBattlers = function()
{
  const evs = this.events();
  if (evs === undefined || evs === null || evs.length < 1)
  {
    return [];
  }

  try
  {
    const battlerEvents = evs.filter(event => event.isJabsBattler());
    return this.convertAllToEnemies(battlerEvents);
  }
  catch (err)
  {
    console.error(err);
    // for a brief moment when leaving the menu, these are all null.
    return [];
  }
};

/**
 * Converts all provided `Game_Event`s into `Game_Enemy`s.
 * @param {Game_Event[]} events A `Game_Event[]`.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.convertAllToEnemies = function(events)
{
  return events.map(event => this.convertOneToEnemy(event));
};

/**
 * Converts a single `Game_Event` into a `Game_Enemy`.
 * @param {Game_Event} event The `Game_Event` to convert to a `JABS_Battler`.
 * @returns {JABS_Battler}
 */
Game_Map.prototype.convertOneToEnemy = function(event)
{
  if (!event.isJabsBattler())
  {
    // if the battler has no id, it is likely being hidden/transformed to non-battler.
    event.setMapBattler("");
    return null;
  }

  const battlerCoreData = event.getBattlerCoreData();
  const battlerId = event.getBattlerId();
  const battler = new Game_Enemy(battlerId, null, null);
  const mapBattler = new JABS_Battler(event, battler, battlerCoreData);
  const uuid = mapBattler.getUuid();
  event.setMapBattler(uuid);
  return mapBattler;
};

/**
 * Finds the battler and its index in the collection by its `uuid`.
 *
 * The result of this is intended to be destructured from the array.
 * @param {string} uuid The `uuid` of the battler to find.
 * @returns {[JABS_Battler, number]}
 */
Game_Map.prototype.findBattlerByUuid = function(uuid)
{
  let targetIndex = -1;
  const foundBattler = this._j._allBattlers.find((battler, index) =>
  {
    const result = battler.getUuid() === uuid;
    if (result) targetIndex = index;
    return result;
  });

  return [foundBattler, targetIndex];
};

/**
 * Finds the battler and its index in the collection by its `_eventId`.
 *
 * The result of this is intended to be destructured from the array.
 * If no result is found, the battler will be null, and index will be -1.
 * @param {number} eventId The `_eventId` of the battler to find.
 * @returns {[JABS_Battler, number]}
 */
Game_Map.prototype.findBattlerByEventId = function(eventId)
{
  let targetIndex = -1;
  const foundBattler = this._j._allBattlers.find((battler, index) =>
  {
    // do not process non-enemies.
    if (!battler.isEnemy()) return false;

    // check if the enemy matches the event we're looking for.
    const isTargetEvent = battler.getCharacter().eventId() === eventId;

    // if it isn't the event we're looking for, keep looking.
    if (!isTargetEvent) return false;

    // grab the index in the collection.
    targetIndex = index;

    // we found a match!
    return true;
  });

  // return the results.
  return [foundBattler, targetIndex];
};

/**
 * Removes a battler from tracking by its index in the master tracking list.
 * @param {number} index The index to splice away.
 */
Game_Map.prototype.deleteBattlerByIndex = function(index)
{
  this._j._allBattlers.splice(index, 1);
};

/**
 * Deletes and removes a `JABS_Battler` from this map's tracking.
 * @param {JABS_Battler} targetBattler The map battler to destroy.
 * @param {boolean} holdSprite Whether or not to actually destroy the sprite of the battler.
 */
Game_Map.prototype.destroyBattler = function(targetBattler, holdSprite = false)
{
  const uuid = targetBattler.getUuid();
  const targetIndex = this._j._allBattlers.findIndex(battler => battler.getUuid() === uuid);

  // if the battler exists, then lets handle it.
  if (targetIndex > -1)
  {
    // shorthand reference to the event/sprite of the battler.
    const event = targetBattler.getCharacter();

    if (!holdSprite)
    {
      // if we're not holding the sprite, then erase it.
      event.erase();

      // set the visual component to be removed, too.
      event.setActionSpriteNeedsRemoving();
    }

    // we always remove the battler from tracking when destroying.
    this.deleteBattlerByIndex(targetIndex);
  }
};

/**
 * Adds a provided event to the current map's event list.
 * @param {Game_Event} event The `Game_Event` to add to this map.
 */
Game_Map.prototype.addEvent = function(event)
{
  this._events.push(event);
};

/**
 * Removes a provided event from the current map's event list.
 * @param {Game_Event} eventToRemove The `Game_Event` to remove from this map.
 */
Game_Map.prototype.removeEvent = function(eventToRemove)
{
  // find the index of the event we're trying to remove.
  const eventIndex = this._events.findIndex(event => event === eventToRemove);

  // confirm we found the event to remove.
  if (eventIndex > -1)
  {
    // remove it if it's an action event.
    this.handleActionEventRemoval(eventToRemove);

    // remove it if it's a loot event.
    this.handleLootEventRemoval(eventToRemove);

    // delete the event from tracking.
    delete this._events[eventIndex];
  }
};

/**
 * Handles the removal of events with an underlying `JABS_Action` from the map.
 * @param {Game_Event} actionToRemove The `Game_Event` to remove from this map.
 */
Game_Map.prototype.handleActionEventRemoval = function(actionToRemove)
{
  // don't process if this event isn't an action.
  if (!actionToRemove.isAction()) return;

  // get the relevant metadatas for the action.
  const actionMetadatas = this.actionEventsFromDataMapByUuid(actionToRemove.getActionUuid());

  // all removed events get erased.
  actionToRemove.erase();

  // command the battle map to cleanup the jabs action.
  $jabsEngine.cleanupAction(actionToRemove.getMapActionData());

  // and also to cleanup the current list of active jabs action events.
  $jabsEngine.clearActionEvents();

  // iterate over each of the metadatas for deletion.
  actionMetadatas.forEach(actionMetadata =>
  {
    // purge the action metadata from the datamap.
    delete $dataMap.events[actionMetadata.actionIndex];
  });
};

/**
 * Handles the removal of events with an underlying `JABS_LootDrop` from the map.
 * @param {Game_Event} lootToRemove The `Game_Event` to remove from this map.
 */
Game_Map.prototype.handleLootEventRemoval = function(lootToRemove)
{
  // don't process if this event isn't an action.
  if (!lootToRemove.isLoot()) return;

  // get the relevant metadatas for the loot.
  const lootMetadatas = this.lootEventsFromDataMapByUuid(lootToRemove.getLootData().uuid);

  // iterate over each of the metadatas for deletion.
  lootMetadatas.forEach(lootMetadata =>
  {
    // purge the loot metadata from the datamap.
    delete $dataMap.events[lootMetadata.lootIndex];
  });
};

/**
 * Removes all actions on the map that have been flagged for removal.
 */
Game_Map.prototype.clearExpiredJabsActionEvents = function()
{
  // grab the list of expired action events.
  const expiredActionEvents = this.expiredActionEvents();

  // get all the game_event sprites that need removing.
  expiredActionEvents.forEach(this.clearExpiredJabsActionEvent, this);
};

/**
 * Clears a particular action event from the map.
 * @param {Game_Event} event The action event to clear.
 */
Game_Map.prototype.clearExpiredJabsActionEvent = function(event)
{
  this.removeEvent(event);
};

/**
 * Removes all loot on the map that has been flagged for removal.
 */
Game_Map.prototype.clearExpiredLootEvents = function()
{
  // grab the list of expired loot events.
  const expiredLootEvents = this.expiredLootEvents();

  // get all the game_event sprites that need removing.
  expiredLootEvents.forEach(this.clearExpiredLootEvent, this);
};

/**
 * Clears a particular loot event from the map.
 * @param {Game_Event} lootEvent The loot event to clear.
 */
Game_Map.prototype.clearExpiredLootEvent = function(lootEvent)
{
  this.removeEvent(lootEvent);
};

/**
 * Handles event interaction for events in front of the player. If they exist,
 * and the player meets the criteria to interact with the event, then do so.
 * It also prevents the player from swinging their weapon willy nilly at NPCs.
 * @param {JABS_Battler} jabsBattler The battler to check the fore-facing events of.
 * @returns {boolean} True if there is an event infront of the player, false otherwise.
 */
Game_Map.prototype.hasInteractableEventInFront = function(jabsBattler)
{
  const player = jabsBattler.getCharacter();
  const direction = player.direction();
  const x1 = player.x;
  const y1 = player.y;
  const x2 = $gameMap.roundXWithDirection(x1, direction);
  const y2 = $gameMap.roundYWithDirection(y1, direction);
  const triggers = [0, 1, 2];

  // look over events directly infront of the player.
  for (const event of $gameMap.eventsXy(x2, y2))
  {
    // if the player is mashing the button at an enemy, let them continue.
    if (event.isJabsBattler()) return false;

    if (event.isTriggerIn(triggers) && event.isNormalPriority() === true)
    {
      return true;
    }
  }

  // if we're looking over a counter, address events a space away instead.
  if ($gameMap.isCounter(x2, y2))
  {
    const x3 = $gameMap.roundXWithDirection(x2, direction);
    const y3 = $gameMap.roundYWithDirection(y2, direction);
    for (const event of $gameMap.eventsXy(x3, y3))
    {
      // if the player is mashing the button at an enemy, let them continue.
      if (event.isJabsBattler()) return false;

      if (event.isTriggerIn(triggers) && event.isNormalPriority() === true)
      {
        return true;
      }
    }
  }

  return false;
};
//#endregion Game_Map

//#region Game_Party
/**
 * Extends the initialize to include additional objects for JABS.
 */
J.ABS.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Party.get('initialize').call(this);

  // initialize party data for JABS.
  this.initJabsPartyData();
};

/**
 * Initializes the stuff related to tracking JABS party cycle capabilities.
 */
Game_Party.prototype.initJabsPartyData = function()
{
  /**
   * The master reference to the `_j` object containing all plugin properties.
   * @type {{}}
   */
  this._j ||= {};

  /**
   * The master reference to all JABS-related added properties on this class.
   * @type {{}}
   */
  this._j._abs ||= {};

  /**
   * Whether or not the party is allowed to party cycle.
   * @type {boolean}
   */
  this._j._abs._canPartyCycle ||= true;
};

/**
 * (re-)Enables the JABS party cycle functionality.
 */
Game_Party.prototype.enablePartyCycling = function()
{
  this._j._abs._canPartyCycle = true;
};

/**
 * Disables the JABS party cycle functionality.
 */
Game_Party.prototype.disablePartyCycling = function()
{
  this._j._abs._canPartyCycle = false;
};

/**
 * Gets whether or not the party can cycle between members.
 * @returns {boolean} True if party cycling is enabled, false otherwise.
 */
Game_Party.prototype.canPartyCycle = function()
{
  return this._j._abs._canPartyCycle;
};
//#endregion Game_Party

//#region Game_Player
/**
 * OVERWRITE Changes the button detection to look for a different button instead of SHIFT.
 */
Game_Player.prototype.isDashButtonPressed = function()
{
  const shift = Input.isPressed(J.ABS.Input.Dash);
  if (ConfigManager.alwaysDash)
  {
    return !shift;
  }
  else
  {
    return shift;
  }
};

/**
 * While JABS is enabled, don't try to interact with events if they are enemies.
 */
J.ABS.Aliased.Game_Player.startMapEvent = Game_Player.prototype.startMapEvent;
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal)
{
  if ($jabsEngine.absEnabled)
  {
    if (!$gameMap.isEventRunning())
    {
      for (const event of $gameMap.eventsXy(x, y))
      {
        if (
          !event._erased &&
          event.isTriggerIn(triggers) &&
          event.isNormalPriority() === normal &&
          !event.getJabsBattler()
        )
        {
          event.start();
        }
      }
    }
  }
  else
  {
    J.ABS.Aliased.Game_Player.startMapEvent.call(this, x, y, triggers, normal);
  }

};

/**
 * If the Abs menu is pulled up, the player shouldn't be able to move.
 */
J.ABS.Aliased.Game_Player.canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function()
{
  const isMenuRequested = $jabsEngine.requestAbsMenu;
  const isAbsPaused = $jabsEngine.absPause;
  const isPlayerCasting = $jabsEngine.getPlayer1().isCasting();
  if (isMenuRequested || isAbsPaused || isPlayerCasting)
  {
    return false;
  }
  else
  {
    return J.ABS.Aliased.Game_Player.canMove.call(this);
  }
};

J.ABS.Aliased.Game_Player.isDebugThrough = Game_Player.prototype.isDebugThrough;
Game_Player.prototype.isDebugThrough = function()
{
  if ($jabsEngine.absEnabled)
  {
    return Input.isPressed(J.ABS.Input.Debug) && $gameTemp.isPlaytest();
  }
  else
  {
    return J.ABS.Aliased.Game_Player.isDebugThrough.call(this);
  }
};

/**
 * Initializes the player's `JABS_Battler` if it was not already initialized.
 */
J.ABS.Aliased.Game_Player.refresh = Game_Player.prototype.refresh;
Game_Player.prototype.refresh = function()
{
  J.ABS.Aliased.Game_Player.refresh.call(this);
  $jabsEngine.initializePlayer1();
};

/**
 * Checks whether or not the player is picking up loot drops.
 */
J.ABS.Aliased.Game_Player.updateMove = Game_Player.prototype.updateMove;
Game_Player.prototype.updateMove = function()
{
  J.ABS.Aliased.Game_Player.updateMove.call(this);
  this.checkForLoot();
};

/**
 * Checks to see if the player coordinates are intercepting with any loot
 * currently on the ground.
 */
Game_Player.prototype.checkForLoot = function()
{
  // get all the loot drops on the map.
  const lootDrops = $gameMap.getLootDrops();

  // make sure we have any loot to work with before processing.
  if (lootDrops.length)
  {
    // process the loot collection.
    this.processLootCollection(lootDrops);
  }
};

/**
 * Processes a collection of loot to determine what to do with it.
 * @param {Game_Event[]} lootDrops The list of all loot drops.
 */
Game_Player.prototype.processLootCollection = function(lootDrops)
{
  // for events picked up and stored all at once.
  const lootCollected = [];

  // iterate over each of the loots to see what we can do with them.
  lootDrops.forEach(lootDrop =>
  {
    // don't pick it up if we cannot pick it up.
    if (!this.canCollectLoot(lootDrop)) return;

    // check if the loot is to be used immediately on-pickup.
    if (lootDrop.isUseOnPickupLoot())
    {
      // use and remove it from tracking if it is.
      this.useOnPickup(lootDrop.getLootData().lootData);
      this.removeLoot(lootDrop);
      return;
    }

    // add it to our group pickup tracker for additional processing.
    lootCollected.push(lootDrop);
  });

  // don't try to pick up collections that don't exist.
  if (!lootCollected.length) return;

  // pick up all the remaining loot.
  this.pickupLootCollection(lootCollected);
};

Game_Player.prototype.canCollectLoot = function(lootEvent)
{
  // we cannot collect loot events that have already been erased.
  if (lootEvent._erased) return false;

  // we cannot collect loot that isn't close enough.
  if (!this.isTouchingLoot(lootEvent)) return false;

  // we can pick it up!
  return true;
};

/**
 * Picks up all loot at the same time that is to be stored.
 * @param {Game_Event[]} lootCollected The list of loot that was collected.
 */
Game_Player.prototype.pickupLootCollection = function(lootCollected)
{
  const lootPickedUp = [];

  // iterate over and pickup all loot collected.
  lootCollected.forEach(loot =>
  {
    // get the underlying loot item.
    const {lootData} = loot.getLootData();

    // store the loot on-pickup.
    this.storeOnPickup(lootData);

    // note that the loot was picked up.
    lootPickedUp.push(lootData);

    // remove loot now that we're done with it.
    this.removeLoot(loot);
  });

  // generate all popups for the loot collected.
  $jabsEngine.generatePopItemBulk(lootPickedUp, this);

  // oh yeah, and play a sound because you picked things up.
  SoundManager.playUseItem();
};

/**
 * Whether or not the player is "touching" the this loot drop.
 * @param {Game_Event} lootDrop The event representing the loot drop.
 * @returns {boolean}
 */
Game_Player.prototype.isTouchingLoot = function(lootDrop)
{
  const distance = $gameMap.distance(lootDrop._realX, lootDrop._realY, this._realX, this._realY);
  return distance <= J.ABS.Metadata.LootPickupRange;
};

/**
 * Collects the loot drop off the ground.
 * @param {Game_Event} lootEvent The event representing this loot.
 */
Game_Player.prototype.pickupLoot = function(lootEvent)
{
  // extract the loot data.
  const lootMetadata = lootEvent.getLootData();
  const {lootData} = lootMetadata;
  lootMetadata.useOnPickup
    ? this.useOnPickup(lootData)
    : this.storeOnPickup(lootData);
};

/**
 * Uses the loot as soon as it is collected.
 * @param {RPG_BaseItem} lootData An object representing the loot.
 */
Game_Player.prototype.useOnPickup = function(lootData)
{
  const player = $jabsEngine.getPlayer1();
  player.applyToolEffects(lootData.id, true);
};

/**
 * Picks up the loot and stores it in the player's inventory.
 * @param {RPG_BaseItem} lootData The loot database data itself.
 */
Game_Player.prototype.storeOnPickup = function(lootData)
{
  // add the loot to your inventory.
  $gameParty.gainItem(lootData, 1, true);

  // generate a log for the loot collected.
  $jabsEngine.createLootLog(lootData);
};

/**
 * Removes the loot drop event from the map.
 * @param {Game_Event} lootEvent The loot to remove from the map.
 */
Game_Player.prototype.removeLoot = function(lootEvent)
{
  lootEvent.setLootNeedsRemoving(true);
  $jabsEngine.requestClearLoot = true;
};
//#endregion Game_Player

//#region Game_Unit
/**
 * OVERWRITE If Jabs is enabled, then you are always "in battle"!
 * Otherwise, it is dependent on the default method.
 */
J.ABS.Aliased.Game_Unit.inBattle = Game_Unit.prototype.inBattle;
Game_Unit.prototype.inBattle = function()
{
  return $jabsEngine.absEnabled
    ? true
    : J.ABS.Aliased.Game_Unit.inBattle.call(this);
}
//#endregion Game_Unit

//#region Scene_Load
/**
 * OVERWRITE When loading, the map needs to be refreshed to load the enemies
 * properly.
 */
J.ABS.Aliased.Scene_Load.reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;
Scene_Load.prototype.reloadMapIfUpdated = function()
{
  if ($jabsEngine.absEnabled)
  {
    const mapId = $gameMap.mapId();
    const x = $gamePlayer.x;
    const y = $gamePlayer.y;
    $gamePlayer.reserveTransfer(mapId, x, y);
    $gamePlayer.requestMapReload();
  }
  else
  {
    J.ABS.Aliased.Scene_Load.reloadMapIfUpdated.call(this);
  }
};
//#endregion Scene_Load


//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JABS objects for tracking.
 */
J.ABS.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function()
{
  J.ABS.Aliased.Scene_Map.initialize.call(this);
  this._j = this._j || {};
  this.initJabsMembers();
};

/**
 * Initializes the player's `JABS_Battler` if it was not already initialized.
 */
J.ABS.Aliased.Scene_Map.onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function()
{
  if ($jabsEngine.absEnabled)
  {
    $jabsEngine.initializePlayer1();
  }

  J.ABS.Aliased.Scene_Map.onMapLoaded.call(this);
};

/**
 * Initializes all JABS components.
 */
Scene_Map.prototype.initJabsMembers = function()
{
  this.initJabsMenu();
};

/**
 * Initializes the JABS menu.
 */
Scene_Map.prototype.initJabsMenu = function()
{
  this._j._absMenu = {};
  this._j._absMenu._windowFocus = null;
  this._j._absMenu._equipType = null;
  this._j._absMenu._mainWindow = null;
  this._j._absMenu._skillWindow = null;
  this._j._absMenu._toolWindow = null;
  this._j._absMenu._dodgeWindow = null;
  this._j._absMenu._equipSkillWindow = null;
  this._j._absMenu._equipToolWindow = null;
  this._j._absMenu._equipDodgeWindow = null;
};

/**
 * Create the Hud with all the rest of the windows.
 */
J.ABS.Aliased.Scene_Map.createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function()
{
  this.createJabsAbsMenu();
  J.ABS.Aliased.Scene_Map.createAllWindows.call(this);
};

/**
 * Update the `JABS_BattlerManager` while updating the regular scene map.
 */
J.ABS.Aliased.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function()
{
  J.ABS.Aliased.Scene_Map.update.call(this);

  // if the ABS is disabled, then don't update it.
  if (!$jabsEngine.absEnabled) return;

  // update the JABS engine!
  JABS_AiManager.update();

  // handle the JABS menu.
  if ($jabsEngine.requestAbsMenu)
  {
    this.manageAbsMenu();
  }
  else
  {
    this.hideAllJabsWindows();
  }

  // handle rotation.
  if ($jabsEngine.requestPartyRotation)
  {
    this.handlePartyRotation();
  }

  // handle requests for refreshing the JABS quick menu.
  if ($jabsEngine.requestJabsMenuRefresh)
  {
    this.refreshJabsMenu();
  }
};

/**
 * Manages the party rotation.
 */
Scene_Map.prototype.handlePartyRotation = function()
{
  $jabsEngine.requestPartyRotation = false;
  if (J.HUD)
  {
    this.refreshHud();
  }
};

/**
 * Hides all windows of the JABS menu.
 */
Scene_Map.prototype.hideAllJabsWindows = function()
{
  this._j._absMenu._mainWindow.hide();
  this._j._absMenu._skillWindow.hide();
  this._j._absMenu._equipSkillWindow.hide();
  this._j._absMenu._toolWindow.hide();
  this._j._absMenu._equipToolWindow.hide();
  this._j._absMenu._dodgeWindow.hide();
  this._j._absMenu._equipDodgeWindow.hide();
};

//#region JABS Menu
/**
 * OVERWRITE Disable the primary menu from being called while JABS is enabled.
 */
J.ABS.Aliased.Scene_Map.callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function()
{
  // if the ABS is disabled, then allow the menu to be called.
  if (!$jabsEngine.absEnabled)
  {
    J.ABS.Aliased.Scene_Map.callMenu.call(this);
  }
};

/**
 * Creates the Jabs quick menu for use.
 */
Scene_Map.prototype.createJabsAbsMenu = function()
{
  // the main window that forks into the other three.
  this.createJabsAbsMenuMainWindow();

  // the three main windows of the ABS menu.
  this.createJabsAbsMenuSkillListWindow();
  this.createJabsAbsMenuToolListWindow();
  this.createJabsAbsMenuDodgeListWindow();

  // the assignment of the the windows.
  this.createJabsAbsMenuEquipSkillWindow();
  this.createJabsAbsMenuEquipToolWindow();
  this.createJabsAbsMenuEquipDodgeWindow();
};

/**
 * Creates the first/main window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  const w = 400;
  const h = 334;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const mainMenu = new Window_AbsMenu(rect);
  mainMenu.setHandler("skill-assign", this.commandSkill.bind(this));
  mainMenu.setHandler("dodge-assign", this.commandDodge.bind(this));
  mainMenu.setHandler("item-assign", this.commandItem.bind(this));
  mainMenu.setHandler("main-menu", this.commandMenu.bind(this));
  mainMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "main"));
  this._j._absMenu._mainWindow = mainMenu;
  this._j._absMenu._mainWindow.close();
  this._j._absMenu._mainWindow.hide();
  this.addWindow(this._j._absMenu._mainWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuSkillListWindow = function()
{
  const w = 400;
  const h = 300;
  const x = Graphics.boxWidth - (w);
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const skillMenu = new Window_AbsMenuSelect(rect, "skill");
  skillMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "skill"));
  skillMenu.setHandler("skill", this.commandEquipSkill.bind(this));
  this._j._absMenu._skillWindow = skillMenu;
  this._j._absMenu._skillWindow.close();
  this._j._absMenu._skillWindow.hide();
  this.addWindow(this._j._absMenu._skillWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipSkillWindow = function()
{
  const w = 400;
  const h = 380;
  const x = Graphics.boxWidth - (w);
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const skillMenu = new Window_AbsMenuSelect(rect, "equip-skill");
  skillMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "assign"));
  skillMenu.setHandler("slot", this.commandAssign.bind(this));
  this._j._absMenu._equipSkillWindow = skillMenu;
  this._j._absMenu._equipSkillWindow.close();
  this._j._absMenu._equipSkillWindow.hide();
  this.addWindow(this._j._absMenu._equipSkillWindow);
};

/**
 * Creates the item assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuToolListWindow = function()
{
  const w = 400;
  const h = 300;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const itemMenu = new Window_AbsMenuSelect(rect, "tool");
  itemMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "tool"));
  itemMenu.setHandler("tool", this.commandEquipTool.bind(this));
  this._j._absMenu._toolWindow = itemMenu;
  this._j._absMenu._toolWindow.close();
  this._j._absMenu._toolWindow.hide();
  this.addWindow(this._j._absMenu._toolWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipToolWindow = function()
{
  const w = 400;
  const h = 70;
  const x = Graphics.boxWidth - (w);
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const itemMenu = new Window_AbsMenuSelect(rect, "equip-tool");
  itemMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "assign"));
  itemMenu.setHandler("slot", this.commandAssign.bind(this));
  this._j._absMenu._equipToolWindow = itemMenu;
  this._j._absMenu._equipToolWindow.close();
  this._j._absMenu._equipToolWindow.hide();
  this.addWindow(this._j._absMenu._equipToolWindow);
};

/**
 * Creates the dodge assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuDodgeListWindow = function()
{
  const w = 400;
  const h = 300;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const dodgeMenu = new Window_AbsMenuSelect(rect, "dodge");
  dodgeMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "dodge"));
  dodgeMenu.setHandler("dodge", this.commandEquipDodge.bind(this));
  this._j._absMenu._dodgeWindow = dodgeMenu;
  this._j._absMenu._dodgeWindow.close();
  this._j._absMenu._dodgeWindow.hide();
  this.addWindow(this._j._absMenu._dodgeWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipDodgeWindow = function()
{
  const w = 400;
  const h = 70;
  const x = Graphics.boxWidth - (w);
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const assignMenu = new Window_AbsMenuSelect(rect, "equip-dodge");
  assignMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "assign"));
  assignMenu.setHandler("slot", this.commandAssign.bind(this));
  this._j._absMenu._equipDodgeWindow = assignMenu;
  this._j._absMenu._equipDodgeWindow.close();
  this._j._absMenu._equipDodgeWindow.hide();
  this.addWindow(this._j._absMenu._equipDodgeWindow);
};

/**
 * Manages the ABS main menu's interactivity.
 */
Scene_Map.prototype.manageAbsMenu = function()
{
  switch (this._j._absMenu._windowFocus)
  {
    case "main":
      this._j._absMenu._mainWindow.show();
      this._j._absMenu._mainWindow.open();
      this._j._absMenu._mainWindow.activate();
      break;
    case "skill":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._skillWindow.show();
      this._j._absMenu._skillWindow.open();
      this._j._absMenu._skillWindow.activate();
      break;
    case "tool":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._toolWindow.show();
      this._j._absMenu._toolWindow.open();
      this._j._absMenu._toolWindow.activate();
      break;
    case "dodge":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._dodgeWindow.show();
      this._j._absMenu._dodgeWindow.open();
      this._j._absMenu._dodgeWindow.activate();
      break;
    case null:
      this._j._absMenu._windowFocus = "main";
      break;
  }
};

/**
 * When the "assign skills" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandSkill = function()
{
  this._j._absMenu._windowFocus = "skill";
  this._j._absMenu._skillWindow.refresh();
  this._j._absMenu._skillWindow.show();
  this._j._absMenu._skillWindow.open();
  this._j._absMenu._skillWindow.activate();
  this._j._absMenu._equipType = "skill";
};

/**
 * When the "assign items" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandItem = function()
{
  this._j._absMenu._windowFocus = "tool";
  this._j._absMenu._toolWindow.refresh();
  this._j._absMenu._toolWindow.show();
  this._j._absMenu._toolWindow.open();
  this._j._absMenu._toolWindow.activate();
  this._j._absMenu._equipType = "tool";
};

/**
 * When the "assign dodge" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandDodge = function()
{
  this._j._absMenu._windowFocus = "dodge";
  this._j._absMenu._dodgeWindow.refresh();
  this._j._absMenu._dodgeWindow.show();
  this._j._absMenu._dodgeWindow.open();
  this._j._absMenu._dodgeWindow.activate();
  this._j._absMenu._equipType = "dodge";
};

/**
 * Brings up the main menu.
 */
Scene_Map.prototype.commandMenu = function()
{
  SceneManager.push(Scene_Menu);
};

Scene_Map.prototype.refreshJabsMenu = function()
{
  $jabsEngine.requestJabsMenuRefresh = false;
  this._j._absMenu._mainWindow.refresh();
};

/**
 * When a decision is made in skill assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipSkill = function()
{
  this._j._absMenu._windowFocus = "assign";
  this._j._absMenu._skillWindow.close();
  this._j._absMenu._skillWindow.deactivate();
  this._j._absMenu._equipSkillWindow.refresh();
  this._j._absMenu._equipSkillWindow.show();
  this._j._absMenu._equipSkillWindow.open();
  this._j._absMenu._equipSkillWindow.activate();
};

/**
 * When a decision is made in tool assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipTool = function()
{
  this._j._absMenu._windowFocus = "assign";
  this._j._absMenu._toolWindow.close();
  this._j._absMenu._toolWindow.deactivate();
  this._j._absMenu._equipToolWindow.refresh();
  this._j._absMenu._equipToolWindow.show();
  this._j._absMenu._equipToolWindow.open();
  this._j._absMenu._equipToolWindow.activate();
};

/**
 * When a decision is made in tool assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipDodge = function()
{
  this._j._absMenu._windowFocus = "assign";
  this._j._absMenu._dodgeWindow.close();
  this._j._absMenu._dodgeWindow.deactivate();
  this._j._absMenu._equipDodgeWindow.refresh();
  this._j._absMenu._equipDodgeWindow.show();
  this._j._absMenu._equipDodgeWindow.open();
  this._j._absMenu._equipDodgeWindow.activate();
};

/**
 * When assigning a slot, determine the last opened window and use that.
 */
Scene_Map.prototype.commandAssign = function()
{
  const actor = $gameParty.leader();
  let nextActionSkill = 0
  let equippedActionSlot = 0;
  switch (this._j._absMenu._equipType)
  {
    case "skill":
      equippedActionSlot = this._j._absMenu._equipSkillWindow.currentExt();
      nextActionSkill = this._j._absMenu._skillWindow.currentExt();
      break;
    case "tool":
      equippedActionSlot = this._j._absMenu._equipToolWindow.currentExt();
      nextActionSkill = this._j._absMenu._toolWindow.currentExt();
      break;
    case "dodge":
      equippedActionSlot = this._j._absMenu._equipDodgeWindow.currentExt();
      nextActionSkill = this._j._absMenu._dodgeWindow.currentExt();
      break;
    default:
      break;
  }

  actor.setEquippedSkill(equippedActionSlot, nextActionSkill);
  this.closeAbsWindow("assign");
};

/**
 * Closes a given Abs menu window.
 * @param {string} absWindow The type of abs window being closed.
 */
Scene_Map.prototype.closeAbsWindow = function(absWindow)
{
  switch (absWindow)
  {
    case "main":
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._mainWindow.close();
      this.closeAbsMenu();
      break;
    case "skill":
      this._j._absMenu._skillWindow.deactivate();
      this._j._absMenu._skillWindow.close();
      this._j._absMenu._windowFocus = "main";
      break;
    case "tool":
      this._j._absMenu._toolWindow.deactivate();
      this._j._absMenu._toolWindow.close();
      this._j._absMenu._windowFocus = "main";
      break;
    case "dodge":
      this._j._absMenu._dodgeWindow.deactivate();
      this._j._absMenu._dodgeWindow.close();
      this._j._absMenu._windowFocus = "main";
      break;
    case "assign":
      this._j._absMenu._equipSkillWindow.deactivate();
      this._j._absMenu._equipSkillWindow.close();
      this._j._absMenu._equipToolWindow.deactivate();
      this._j._absMenu._equipToolWindow.close();
      this._j._absMenu._equipDodgeWindow.deactivate();
      this._j._absMenu._equipDodgeWindow.close();
      this._j._absMenu._skillWindow.deactivate();
      this._j._absMenu._skillWindow.close();
      this._j._absMenu._toolWindow.deactivate();
      this._j._absMenu._toolWindow.close();
      this._j._absMenu._dodgeWindow.deactivate();
      this._j._absMenu._dodgeWindow.close();
      this._j._absMenu._mainWindow.activate();
      this._j._absMenu._mainWindow.open();
      this._j._absMenu._mainWindow.show();
      this._j._absMenu._windowFocus = "main"
      break;
  }
};

/**
 * Close out from the Abs menu.
 */
Scene_Map.prototype.closeAbsMenu = function()
{
  this._j._absMenu._mainWindow.closeMenu();
};
//#endregion JABS Menu
//#endregion Scene_Map

//#region Sprite_Character
/**
 * Hooks into `Sprite_Character.initMembers` and adds our initiation for damage sprites.
 */
J.ABS.Aliased.Sprite_Character.set('initMembers', Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function()
{
  /**
   * The over-arching J object to contain all additional plugin parameters.
   */
  this._j ||= {};

  /**
   * The battle-related sprites and such are maintained within this umbrella.
   */
  this._j._abs ||= {};

  /**
   * Whether or not the map sprite setup has been completed.
   * @type {boolean}
   */
  this._j._abs._jabsBattlerSetupComplete = false;

  /**
   * The state overlay sprite associated with this character's battler.
   * @type {Sprite_StateOverlay|null}
   */
  this._j._stateOverlaySprite = null;

  /**
   * The hp gauge sprite associated with this character's battler.
   * @type {Sprite_MapGauge|null}
   */
  this._j._hpGauge = null;

  /**
   * The text sprite displaying the name of this character's battler.
   * @type {Sprite_BaseText|null}
   */
  this._j._battlerName = null;

  /**
   * The umbrella object for loot information.
   * @type {{}}
   */
  this._j._loot = {};

  /**
   * Whether or not the loot sprite setup has been completed.
   * @type {boolean}
   */
  this._j._loot._lootSetupComplete = false;

  /**
   * The icon sprite that represents this character if it is loot.
   * @type {Sprite_Icon|null}
   */
  this._j._loot._sprite = null;

  /**
   * Whether this is on the up or the down swing.
   * @type {boolean} True if on the upswing, false if on the downswing.
   */
  this._j._loot._swing = false;

  /**
   * The modified x coordinate to draw this character as a result of swinging.
   * @type {number}
   */
  this._j._loot._ox = 0;

  /**
   * The modified y coordinate to draw this character as a result of swinging.
   * @type {number}
   */
  this._j._loot._oy = 0;

  // perform original logic.
  J.ABS.Aliased.Sprite_Character.get('initMembers').call(this);
};

//#region setup & reference
/**
 * Hooks into the `Sprite_Character.update` and adds our ABS updates.
 */
J.ABS.Aliased.Sprite_Character.set('update', Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function()
{
  // perform original logic.
  J.ABS.Aliased.Sprite_Character.get('update').call(this);

  // only update the jabs battler components if they have been initialized.
  if (this.isJabsBattlerReady())
  {
    // update the state overlay for this battler.
    this.updateStateOverlay();

    // update the gauges, if any, for this battler.
    this.updateGauges();

    // update the battler's name, if any.
    this.updateBattlerName();
  }

  /// only update the loot components if they have been initialized.
  if (this.isLootReady())
  {
    // update the battler's name, if any.
    this.updateLootFloat();
  }
};

/**
 * Whether or not this map sprite has been setup with all its sprites yet.
 * @returns {boolean} True if this jabs battler has been established, false otherwise.
 */
Sprite_Character.prototype.isJabsBattlerReady = function()
{
  return this._j._abs._jabsBattlerSetupComplete;
};

/**
 * Give this map sprite setup a stamp of approval, indicating that it is
 * ready to be processed by our `update()` siblings/overlords!
 */
Sprite_Character.prototype.finalizeJabsBattlerSetup = function()
{
  this._j._abs._jabsBattlerSetupComplete = true;
};

/**
 * Returns the `Game_Battler` associated with the current sprite.
 * @returns {Game_Actor|Game_Enemy} The battler this sprite is bound to.
 */
Sprite_Character.prototype.getBattler = function()
{
  // check to make sure this is a JABS battler.
  if (this.isJabsBattler())
  {
    // grab the battler associated with this sprite.
    return this._character.getJabsBattler().getBattler();
  }
  // otherwise, this must be a regular sprite for an event.
  else return null;
};

/**
 * Gets whether or not this sprite belongs to a battler.
 * @returns {boolean} True if this sprite belongs to a battler, false otherwise.
 */
Sprite_Character.prototype.isJabsBattler = function()
{
  // if the character doesn't exist, or they are a vehicle, they aren't a battler.
  if (!this._character || this._character instanceof Game_Vehicle) return false;

  // return whether or not this has a battler attached to it.
  return !!this._character.hasJabsBattler();
};

/**
 * Whether or not this loot sprite has been setup with all its sprites yet.
 * @returns {boolean}  True if this loot has been established, false otherwise.
 */
Sprite_Character.prototype.isLootReady = function()
{
  return this._j._loot._lootSetupComplete;
};

/**
 * Give this loot sprite setup a stamp of approval, indicating that it is
 * ready to be processed by our `update()` siblings/overlords!
 */
Sprite_Character.prototype.finalizeLootSetup = function()
{
  this._j._loot._lootSetupComplete = true;
};

/**
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
Sprite_Character.prototype.canUpdate = function()
{
  return $jabsEngine.absEnabled;
};

/**
 * If the "character" is actually a loot drop, don't identify it as empty for the purposes
 * of drawing the loot icon on the map.
 * @returns {boolean} True if the character should be drawn, false otherwise.
 */
J.ABS.Aliased.Sprite_Character.set('isEmptyCharacter', Sprite_Character.prototype.isEmptyCharacter);
Sprite_Character.prototype.isEmptyCharacter = function()
{
  // check if we're loot.
  return this.isLoot()
    // intercept for the case of loot, as it actually is a character to be updated!
    ? false
    // otherwise, perform original logic.
    : J.ABS.Aliased.Sprite_Character.get('isEmptyCharacter').call(this)
};

/**
 * Hooks into the `Sprite_Character.setCharacter` and sets up the battler sprite.
 * @param {Game_Character} character The character being assigned to this sprite.
 */
J.ABS.Aliased.Sprite_Character.set('setCharacter', Sprite_Character.prototype.setCharacter);
Sprite_Character.prototype.setCharacter = function(character)
{
  // perform original logic.
  J.ABS.Aliased.Sprite_Character.get('setCharacter').call(this, character);

  // if the sprite changed, the JABS-related data probably changed, too.
  this.setupJabsSprite();
};

/**
 * Extends `setCharacterBitmap()` to perform on-graphic-change things.
 */
J.ABS.Aliased.Sprite_Character.set('setCharacterBitmap', Sprite_Character.prototype.setCharacterBitmap);
Sprite_Character.prototype.setCharacterBitmap = function()
{
  // perform original logic.
  J.ABS.Aliased.Sprite_Character.get('setCharacterBitmap').call(this);

  // if the sprite changed, the JABS-related data probably changed, too.
  this.setupJabsSprite();
};

/**
 * Setup this `Sprite_Character` with the additional JABS-related functionalities.
 */
Sprite_Character.prototype.setupJabsSprite = function()
{
  // if this is a battler, configure the visual components of the battler.
  this.handleBattlerSetup();

  // perform logic when the character's bitmap changes, like when an event page is changed.
  this.handleLootSetup();
};

/**
 * Handle battler setup for JABS-related data points.
 */
Sprite_Character.prototype.handleBattlerSetup = function()
{
  // check if this is a battler.
  if (this.isJabsBattler())
  {
    // setup the sprite with all the battler-related data points.
    this.setupMapSprite();
  }
};

/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupMapSprite = function()
{
  // setup a state overlay sprite to display the state of a given battler.
  this.setupStateOverlay();

  // setup a gauge sprite to display
  this.setupHpGauge();

  // setup a text sprite to display the name of the battler on the map.
  this.setupBattlerName();

  // flag this character as finalized for the purpose of jabs battler-related updates.
  this.finalizeJabsBattlerSetup();
};
//#endregion setup & reference

//#region state overlay
/**
 * Sets up this character's state overlay, to show things like poison or paralysis.
 */
Sprite_Character.prototype.setupStateOverlay = function()
{
  // grab the battler of this character.
  const battler = this.getBattler();

  // check if we already have an overlay sprite available.
  if (this._j._stateOverlaySprite)
  {
    // assign the current battler to the overlay sprite.
    this._j._stateOverlaySprite.setup(battler);
  }
  // if we don't have an overlay, the build it.
  else
  {
    // create and assign the state overlay sprite..
    this._j._stateOverlaySprite = this.createStateOverlaySprite();

    // assign the current battler to the overlay sprite.
    this._j._stateOverlaySprite.setup(battler);

    // add it to this sprite's tracking.
    this.addChild(this._j._stateOverlaySprite);
  }
};

/**
 * Creates the sprite representing the overlay of the state on the map.
 * @returns {Sprite_StateOverlay} The overlay sprite, governing state for this character.
 */
Sprite_Character.prototype.createStateOverlaySprite = function()
{
  return new Sprite_StateOverlay();
};

/**
 * Updates the battler's overlay for states (if applicable).
 */
Sprite_Character.prototype.updateStateOverlay = function()
{
  // check if we can update the state overlay.
  if (this.canUpdateStateOverlay())
  {
    // update it.
    this.showStateOverlay();
  }
  // otherwise, if we can't update it...
  else
  {
    // then hide it.
    this.hideStateOverlay();
  }
};

/**
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
Sprite_Character.prototype.canUpdateStateOverlay = function()
{
  // if we're not using JABS, then it shouldn't update.
  if (!this.canUpdate()) return false;

  // if this sprite doesn't have a battler, then it shouldn't update.
  if (!this.isJabsBattler()) return false;

  // if this sprite doesn't even exist yet, then it shouldn't update.
  if (!this._j._stateOverlaySprite) return false;

  // we should update!
  return true;
};

/**
 * Shows the state overlay if it exists.
 */
Sprite_Character.prototype.showStateOverlay = function()
{
  this._j._stateOverlaySprite.show();
};

/**
 * Hides the state overlay if it exists.
 */
Sprite_Character.prototype.hideStateOverlay = function()
{
  this._j._stateOverlaySprite.hide();
};
//#endregion state overlay

//#region gauges
/**
 * Sets up this character's hp gauge, to show the hp bar as-needed.
 */
Sprite_Character.prototype.setupHpGauge = function()
{
  // check if we already have an hp gauge sprite available.
  if (!this._j._hpGauge)
  {
    // initialize the hp gauge as a generic map gauge.
    this._j._hpGauge = this.createGenericSpriteGauge();

    // add the sprite to tracking.
    this.addChild(this._j._hpGauge);
  }

  // assign the current battler to the hp gauge sprite.
  this._j._hpGauge.setup(this.getBattler(), "hp");

  // activate it the gauge.
  this._j._hpGauge.activateGauge();


  // locate the gauge below the character.
  this._j._hpGauge.move(
    -(this._j._hpGauge.bitmapWidth() / 1.5),
    -12);
};

/**
 * Creates a deactivated `Sprite_MapGauge` sprite yet to be setup.
 * @returns {Sprite_MapGauge}
 */
Sprite_Character.prototype.createGenericSpriteGauge = function()
{
  // generate a deactivated gauge.
  const sprite = new Sprite_MapGauge();
  sprite.deactivateGauge();

  // relocate the gauge.
  const x = this.x - (sprite.width / 1.5);
  const y = this.y - 12;
  sprite.move(x, y);

  // return the generic sprite centered on the character.
  return sprite;
};

/**
 * Updates the all gauges associated with this battler
 */
Sprite_Character.prototype.updateGauges = function()
{
  // check if we can update the hp gauge.
  if (this.canUpdateHpGauge())
  {
    // update it.
    this.updateHpGauge();
  }
  // otherwise, if we can't update it...
  else
  {
    // then hide it.
    this.hideHpGauge();
  }
};

/**
 * Determines whether or not we can update the hp gauge.
 * @returns {boolean} True if we can update the hp gauge, false otherwise.
 */
Sprite_Character.prototype.canUpdateHpGauge = function()
{
  // if we're not using JABS, then it shouldn't update.
  if (!this.canUpdate()) return false;

  // if this sprite doesn't have a battler, then it shouldn't update.
  if (!this.isJabsBattler()) return false;

  // if we aren't allowed to show the gauge, then it shouldn't update.
  if (!this._character.getJabsBattler().showHpBar()) return false;

  // we should update!
  return true;
};

/**
 * Updates the hp gauge sprite.
 */
Sprite_Character.prototype.updateHpGauge = function()
{
  // show the hp gauge if we should be showing it.
  this.showHpGauge();

  // ensure the hp gauge matches the current battler.
  this._j._hpGauge._battler = this.getBattler();
};

/**
 * Shows the hp gauge if it exists.
 */
Sprite_Character.prototype.showHpGauge = function()
{
  this._j._hpGauge.show();
};

/**
 * Hides the hp gauge if it exists.
 */
Sprite_Character.prototype.hideHpGauge = function()
{
  this._j._hpGauge.hide();
};
//#endregion gauges

//#region battler name
/**
 * Sets up this battler's name as a sprite below the character.
 */
Sprite_Character.prototype.setupBattlerName = function()
{
  // check if we already have a battler name present.
  if (this._j._battlerName)
  {
    // redraw the new battler name.
    this._j._battlerName.setText(this.getBattlerName());

    // if we already have the sprite, no need to recreate it.
    return;
  }

  // build and assign the battler name sprite.
  this._j._battlerName = this.createBattlerNameSprite();

  // add it to this sprite's tracking.
  this.addChild(this._j._battlerName);
};

/**
 * Creates the sprite that contains this battler's name.
 * @returns {Sprite_BaseText} The battlers name, as a sprite.
 */
Sprite_Character.prototype.createBattlerNameSprite = function()
{
  // get the name of this battler.
  const battlerName = this.getBattlerName();

  // build the text sprite.
  const sprite = new Sprite_BaseText()
    .setText(battlerName)
    .setFontSize(10)
    .setAlignment(Sprite_BaseText.Alignments.Left)
    .setColor("#ffffff");
  sprite.setText(battlerName);

  // relocate the sprite to a better position.
  sprite.move(-30, 8);

  // return this created sprite.
  return sprite;
};

/**
 * Gets this battler's name.
 * If there is no battler, this will return an empty string.
 * @returns {string}
 */
Sprite_Character.prototype.getBattlerName = function()
{
  // get the battler if we have one.
  const battler = this.getBattler();

  // if we don't, then just return an empty string.
  if (!battler) return String.empty;

  // pull the name straight from the database actor/enemy tab.
  const battlerName = battler.databaseData().name;

  // return the battler name.
  return battlerName;
};

/**
 * Updates this battler's name.
 */
Sprite_Character.prototype.updateBattlerName = function()
{
  // check if we can update the battler name.
  if (this.canUpdateBattlerName())
  {
    // update it.
    this.showBattlerName();
  }
  // otherwise, if we can't update it...
  else
  {
    // then hide it.
    this.hideBattlerName();
  }
};

/**
 * Determines whether or not we can update the battler name.
 * @returns {boolean} True if we can update the battler name, false otherwise.
 */
Sprite_Character.prototype.canUpdateBattlerName = function()
{
  // if we're not using JABS, then it shouldn't update.
  if (!this.canUpdate()) return false;

  // if this sprite doesn't have a battler, then it shouldn't update.
  if (!this.isJabsBattler()) return false;

  // if we aren't allowed to show the battler name, then it shouldn't update.
  if (!this._character.getJabsBattler().showBattlerName()) return false;

  // we should update!
  return true;
};

/**
 * Shows the battler's name if it exists.
 */
Sprite_Character.prototype.showBattlerName = function()
{
  this._j._battlerName.show();
};

/**
 * Hides the battler's name if it exists.
 */
Sprite_Character.prototype.hideBattlerName = function()
{
  this._j._battlerName.hide();
};
//#endregion battler name

//#region loot
/**
 * Handle loot setup for loot that hasn't been drawn yet.
 */
Sprite_Character.prototype.handleLootSetup = function()
{
  // check if this is loot.
  if (this.isLoot())
  {
    // check if we've already drawn the loot.
    if (!this.hasLootDrawn())
    {
      // draw the loot sprite for this character.
      this.setupLootSprite();
    }
  }
};

/**
 * Whether or not we've drawn the child sprites that make up the loot.
 * @returns {boolean} True if we've already drawn the loot sprites, false otherwise.
 */
Sprite_Character.prototype.hasLootDrawn = function()
{
  return !this.children.length;
};

/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupLootSprite = function()
{
  // flag this character is "through", so they don't block movement of others.
  this._character._through = true;

  // create and assign the image sprite icon.
  this._j._loot._sprite = this.createLootSprite();

  // add it to this sprite's tracking.
  this.addChild(this._j._loot._sprite);

  // flag this character as finalized for the purpose of loot-related updates.
  this.finalizeLootSetup();
};

/**
 * Creates the loot sprite based on the loot the enemy drop.
 */
Sprite_Character.prototype.createLootSprite = function()
{
  // get the loot's icon index.
  const iconIndex = this.getLootIcon();

  // build the sprite from the icon.
  const sprite = new Sprite_Icon(iconIndex);

  // relocate the loot a bit randomly.
  const xOffset = J.BASE.Helpers.getRandomNumber(-30, 0);
  const yOffset = J.BASE.Helpers.getRandomNumber(-90, -70);
  sprite.move(xOffset, yOffset);

  // return the built sprite.
  return sprite;
};

/**
 * Gets the loot data associated with this sprite.
 * @returns {JABS_LootDrop}
 */
Sprite_Character.prototype.getLootData = function()
{
  return this._character.getLootData();
};

/**
 * Gets the loot icon associated with the underlying loot.
 * @returns {number} The icon index of the loot, or -1 if there is none.
 */
Sprite_Character.prototype.getLootIcon = function()
{
  return this.getLootData().lootIcon ?? -1;
};

/**
 * Gets the loot icon associated with the underlying loot.
 * @returns {number} The icon index of the loot, or -1 if there is none.
 */
Sprite_Character.prototype.getLootExpired = function()
{
  return this.getLootData().expired ?? true;
};

/**
 * Executes the loot's countdown to expiry.
 */
Sprite_Character.prototype.performLootDurationCountdown = function()
{
  // execute a countdown on behalf of the loot.
  this.getLootData().countdownDuration();
};

/**
 * Deletes all child loot sprites from the screen.
 */
Sprite_Character.prototype.deleteLootSprite = function()
{
  if (this.children.length > 0)
  {
    this.children.splice(0, this.children.length);
  }
};

/**
 * Gets whether or not this sprite is actually just some loot to be gathered.
 * @returns {boolean} True if this sprite represents a loot object, false otherwise.
 */
Sprite_Character.prototype.isLoot = function()
{
  return this._character.isLoot();
};

/**
 * The current direction of swing.
 * @returns {boolean} True if we're swinging up, false if we're swinging down.
 */
Sprite_Character.prototype.lootSwing = function()
{
  return this._j._loot._swing;
};

/**
 * Swing the loot up and enforce the direction.
 * @param {number} amount The amount of the direction.
 */
Sprite_Character.prototype.lootSwingUp = function(amount = 0)
{
  this._j._loot._swing = true;

  this._j._loot._oy -= amount;
};

/**
 * Swing the loot down and enforce the direction.
 * @param {number} amount The amount of the direction.
 */
Sprite_Character.prototype.lootSwingDown = function(amount = 0)
{
  this._j._loot._swing = false;

  this._j._loot._oy += amount;
};

/**
 * Updates the loot to give the effect that it is floating in place.
 */
Sprite_Character.prototype.updateLootFloat = function()
{
  // perform the countdown and manage this loot expiration.
  this.handleLootDuration();

  // manage the floaty-ness if we float.
  this.handleLootFloat();
};

/**
 * Handles loot duration and expiration for this sprite.
 */
Sprite_Character.prototype.handleLootDuration = function()
{
  // tick tock the duration countdown of the loot if it has an expiration.
  this.performLootDurationCountdown();

  // check if the loot is now expired.
  if (this.getLootExpired())
  {
    // expire it if it is.
    this.expireLoot();
  }
};

/**
 * Perform all steps to have this loot expired and removed.
 */
Sprite_Character.prototype.expireLoot = function()
{
  // don't reset the removal if its already set.
  if (this._character.getLootNeedsRemoving()) return;

  // set the loot to be removed.
  this._character.setLootNeedsRemoving(true);
  $jabsEngine.requestClearLoot = true;
};

/**
 *
 */
Sprite_Character.prototype.handleLootFloat = function()
{
  // check if we can update the loot float.
  if (this.canUpdateLootFloat())
  {
    // float the loot.
    this.lootFloat();
  }
};

/**
 * Checks whether or not we can float the loot.
 * @returns {boolean} True if we can, false if we cannot.
 */
Sprite_Character.prototype.canUpdateLootFloat = function()
{
  // if we have no sprite, we can't update it.
  if (!this._j._loot._sprite) return false;

  // if the loot is expired, we can't update it.
  if (this.getLootExpired()) return false;

  // we can update!
  return true;
};

/**
 * A basic slow swing up and down a bit for the loot drops.
 */
Sprite_Character.prototype.lootFloat = function()
{
  // grab the sprite for floaty goodness- if we have one.
  const lootSprite = this._j._loot._sprite;

  // Lets swing up and down a bit.
  if (this.lootSwing())
  {
    // ~swing up!
    this.lootFloatUp(lootSprite);
  }
  else
  {
    // !swing down~
    this.lootFloatDown(lootSprite);
  }
};

/**
 * The downswing of a loot sprite while floating.
 * @param {Sprite} lootSprite The sprite to give a float effect.
 */
Sprite_Character.prototype.lootFloatDown = function(lootSprite)
{
  // swing the loot down.
  this.lootSwingDown(0.3);
  lootSprite.y += 0.3;

  // check if we should swing back up.
  if (this.shouldSwingUp())
  {
    // if so, swing up.
    this.lootSwingUp();
  }
};

/**
 * Determines whether or not we should reverse the swing back upwards.
 * @returns {boolean}
 */
Sprite_Character.prototype.shouldSwingUp = function()
{
  return this._j._loot._oy > 5;
};

/**
 * The upswing of a loot sprite while floating.
 * @param {Sprite} lootSprite The sprite give a float effect.
 */
Sprite_Character.prototype.lootFloatUp = function(lootSprite)
{
  // swing the loot up.
  this.lootSwingUp(0.3);
  lootSprite.y -= 0.3;

  // check if we've swung too far down.
  if (this.shouldSwingDown())
  {
    // if so, swing up.
    this.lootSwingDown();
  }
};

/**
 * Determines whether or not we should reverse the swing back upwards.
 * @returns {boolean}
 */
Sprite_Character.prototype.shouldSwingDown = function()
{
  return this._j._loot._oy < -5;
};
//#endregion loot
//#endregion Sprite_Character

//#region Sprite_Gauge
/**
 * Due to JABS' slip effects, we have fractional hp/mp/tp values.
 * This rounds up the values for the sprite gauge if they are a number.
 */
J.ABS.Aliased.Sprite_Gauge.currentValue = Sprite_Gauge.prototype.currentValue;
Sprite_Gauge.prototype.currentValue = function()
{
  const base = J.ABS.Aliased.Sprite_Gauge.currentValue.call(this);

  // if we somehow ended up with NaN, then just let them deal with it.
  if (isNaN(base)) return base;

  // return the rounded-up amount.
  return Math.ceil(base);
};
//#endregion Sprite_Gauge

//#region Spriteset_Map
/**
 * Hooks into the `update` function to also update any active action sprites.
 */
J.ABS.Aliased.Spriteset_Map.spritesetUpdate = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function()
{
  // perform original logic.
  J.ABS.Aliased.Spriteset_Map.spritesetUpdate.call(this);

  // perform jabs-related sprite updates.
  this.updateJabsSprites();
};

/**
 * Updates all existing actionSprites on the map.
 */
Spriteset_Map.prototype.updateJabsSprites = function()
{
  // manage action sprites.
  this.handleActionSprites();

  // manage loot sprites.
  this.handleLootSprites();

  // manage full-screen sprite refreshes.
  this.handleSpriteRefresh();
};

/**
 * Processes incoming requests to add/remove action sprites.
 */
Spriteset_Map.prototype.handleActionSprites = function()
{
  // check if we have incoming requests to add new action sprites.
  if ($jabsEngine.requestActionRendering)
  {
    // add the new action sprites.
    this.addActionSprites();
  }

  // check if we have incoming requests to remove old action sprites.
  if ($jabsEngine.requestClearMap)
  {
    // remove the old action sprites.
    this.removeActionSprites();
  }
};

/**
 * Processes incoming requests to add/remove loot sprites.
 */
Spriteset_Map.prototype.handleLootSprites = function()
{
  // check if we have incoming requests to add new loot sprites.
  if ($jabsEngine.requestLootRendering)
  {
    // add the new loot sprites.
    this.addLootSprites();
  }

  // check if we have incoming requests to remove old loot sprites.
  if ($jabsEngine.requestClearLoot)
  {
    // remove the old loot sprites.
    this.removeLootSprites();
  }
};

/**
 * Processes incoming requests to add/remove loot sprites.
 */
Spriteset_Map.prototype.handleSpriteRefresh = function()
{
  // check if we have incoming requests to do a sprite refresh.
  if ($jabsEngine.requestSpriteRefresh)
  {
    // refresh all character sprites.
    this.refreshAllCharacterSprites();
  }
};

/**
 * Adds all needing-to-be-added action sprites to the map and renders.
 */
Spriteset_Map.prototype.addActionSprites = function()
{
  // grab all the newly-added action events.
  const newActionEvents = $gameMap.newActionEvents();

  // scan each of them and add new action sprites as-needed.
  newActionEvents.forEach(this.addActionSprite, this);

  // acknowledge that action sprites were added.
  $jabsEngine.requestActionRendering = false;
};

/**
 * Processes a single event and adds its corresponding action sprite if necessary.
 * @param {Game_Event} actionEvent The event that may require a new sprite added.
 */
Spriteset_Map.prototype.addActionSprite = function(actionEvent)
{
  // get the underlying character associated with this action.
  const character = actionEvent.getMapActionData().getActionSprite();

  // generate the new sprite based on the action's character.
  const sprite = new Sprite_Character(character);

  // add the sprite to tracking.
  this._characterSprites.push(sprite);
  this._tilemap.addChild(sprite);

  // acknowledge that the sprite was added.
  actionEvent.setActionSpriteNeedsAdding(false);
};

/**
 * Scans all events on the map and adds new loot sprites accordingly.
 */
Spriteset_Map.prototype.addLootSprites = function()
{
  // grab all the newly-added loot events.
  const events = $gameMap.newLootEvents();

  // scan each of them and add new loot sprites.
  events.forEach(this.addLootSprite, this);

  // acknowledge that loot sprites were added.
  $jabsEngine.requestLootRendering = false;
};

/**
 * Processes a single event and adds its corresponding loot sprite if necessary.
 * @param {Game_Event} lootEvent The event that may require a new sprite added.
 */
Spriteset_Map.prototype.addLootSprite = function(lootEvent)
{
  // generate the new sprite based on the loot's character.
  const sprite = new Sprite_Character(lootEvent);

  // add the sprite to tracking.
  this._characterSprites.push(sprite);
  this._tilemap.addChild(sprite);

  // acknowledge that the sprite was added.
  lootEvent.setLootNeedsAdding(false);
};

/**
 * Removes all expired action sprites from the map.
 */
Spriteset_Map.prototype.removeActionSprites = function()
{
  // grab all expired action events.
  const events = $gameMap.expiredActionEvents();

  // remove them.
  events.forEach(this.removeActionSprite, this);

  // acknowledge that expired action sprites were cleared.
  $jabsEngine.requestClearMap = false;
};

/**
 * Processes a single action event and removes its corresponding sprite(s).
 * @param {Game_Event} actionEvent The action event that requires removal.
 */
Spriteset_Map.prototype.removeActionSprite = function(actionEvent)
{
  // get the sprite index for the action event.
  const spriteIndex = this._characterSprites.findIndex(sprite =>
  {
    // if the character doesn't match the event, then keep looking.
    if (sprite._character !== actionEvent) return false;

    // we found a match!
    return true;
  });

  // confirm we did indeed find the sprite's index for removal.
  if (spriteIndex !== -1)
  {
    // purge the sprite from tracking.
    this._characterSprites.splice(spriteIndex, 1);
  }

  // flag the Game_Event for removal from Game_Map's tracking.
  actionEvent.setActionSpriteNeedsRemoving();

  // delete the now-removed sprite for this action.
  $gameMap.clearExpiredJabsActionEvents();
};

/**
 * Removes all needing-to-be-removed loot sprites from the map.
 */
Spriteset_Map.prototype.removeLootSprites = function()
{
  // grab all expired loot events.
  const events = $gameMap.expiredLootEvents();

  // remove them.
  events.forEach(this.removeLootSprite, this);

  // acknowledge that expired loot sprites were cleared.
  $jabsEngine.requestClearLoot = false;
};

/**
 * Processes a single loot event and removes its corresponding sprite(s).
 * @param {Game_Event} lootEvent The loot event that requires removal.
 */
Spriteset_Map.prototype.removeLootSprite = function(lootEvent)
{
  const spriteIndex = this._characterSprites.findIndex(sprite =>
  {
    // if the character doesn't match the event, then keep looking.
    if (sprite._character !== lootEvent) return false;

    // we found a match!
    return true;
  });

  // confirm we did indeed find the sprite's index for removal.
  if (spriteIndex !== -1)
  {
    // delete that sprite's loot.
    this._characterSprites[spriteIndex].deleteLootSprite();

    // purge the sprite from tracking.
    this._characterSprites.splice(spriteIndex, 1);
  }

  // delete the now-removed sprite for this action.
  $gameMap.clearExpiredLootEvents();
};

/**
 * Refreshes all character sprites on the map.
 * Does nothing in this plugin, but leaves open for extension.
 */
Spriteset_Map.prototype.refreshAllCharacterSprites = function()
{
  $jabsEngine.requestSpriteRefresh = false;
};
//#endregion Spriteset_Map

//#region Window_AbsMenu
/**
 * The window representing what is called and manages the player's assigned skill slots.
 */
class Window_AbsMenu extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The shape of the window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
  }

  /**
   * Initializes this window.
   * @param {Rectangle} rect The shape of the window.
   */
  initialize(rect)
  {
    super.initialize(rect);
    this.refresh();
    this.select(0);
    this.activate();
  }

  /**
   * Generates the command list for the JABS menu.
   */
  makeCommandList()
  {
    // to adjust the icons, change the number that is the last parameter of these commands.
    this.addCommand(J.ABS.Metadata.EquipCombatSkillsText, "skill-assign", true, null, 77);
    this.addCommand(J.ABS.Metadata.EquipDodgeSkillsText, "dodge-assign", true, null, 82);
    this.addCommand(J.ABS.Metadata.EquipToolsText, "item-assign", true, null, 83);
    this.addCommand(J.ABS.Metadata.MainMenuText, "main-menu", true, null, 189);
    this.addCommand(J.ABS.Metadata.CancelText, "cancel", true, null, 73);
  }

  /**
   * Closes the Abs menu.
   */
  closeMenu()
  {
    if (!this.isClosed())
    {
      this.close();
      $jabsEngine.absPause = false;
      $jabsEngine.requestAbsMenu = false;
    }
  }
}
//#endregion Window_AbsMenu

//#region Window_AbsMenuSelect
/**
 * A window that is reused to draw all the subwindows of the JABS menu.
 */
class Window_AbsMenuSelect
  extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The shape of the window.
   * @param {string} type The type of window this is, such as "dodge" or "skill".
   */
  constructor(rect, type)
  {
    super(rect);
    this.initialize(rect, type);
  }

  /**
   * Initializes this window.
   * @param {Rectangle} rect The window dimensions.
   * @param {string} type The type of abs menu selection this is.
   */
  initialize(rect, type)
  {
    this._j = {};
    this._j._menuType = type;
    super.initialize(rect);
    this.refresh();
    this.select(0);
    this.activate();
  }

  /**
   * Draws all commands of this select window.
   */
  makeCommandList()
  {
    switch (this._j._menuType)
    {
      case "skill":
        // the list of all equippable combat skills this actor knows.
        this.makeSkillList();
        break;
      case "tool":
        // the list of all items/tools in the party's possession.
        this.makeToolList();
        break;
      case "dodge":
        // the list of all equippable dodge skills this actor knows.
        this.makeDodgeList();
        break;
      case "equip-skill":
        // the combat skill equip menu, where all the combat skills can be equipped.
        this.makeEquippedSkillList();
        break;
      case "equip-tool":
        // the tool equip menu, where the items/tools can be equipped.
        this.makeEquippedToolList();
        break;
      case "equip-dodge":
        // the dodge skill equip menu, where all the dodge skills can be equipped.
        this.makeEquippedDodgeList();
        break;
    }
  }

  /**
   * Fills the list with learned skills to assign.
   */
  makeSkillList()
  {
    const actor = $gameParty.leader();
    const skills = actor.skills().filter(JABS_Battler.isSkillVisibleInCombatMenu);

    this.addCommand(J.ABS.Metadata.ClearSlotText, "skill", true, 0, 16);
    skills.forEach(skill =>
    {
      this.addCommand(skill.name, "skill", true, skill.id, skill.iconIndex);
    });
  }

  /**
   * Fills the list with items in the player's possession to assign.
   */
  makeToolList()
  {
    const items = $gameParty.allItems().filter(JABS_Battler.isItemVisibleInToolMenu);

    this.addCommand(J.ABS.Metadata.ClearSlotText, "tool", true, 0, 16);
    items.forEach(item =>
    {
      const name = `${item.name}: ${$gameParty.numItems(item)}`;
      this.addCommand(name, "tool", true, item.id, item.iconIndex);
    });
  }

  /**
   * Fills the list with the currently assigned dodge.
   */
  makeDodgeList()
  {
    const skills = $gameParty.leader().skills();
    const dodgeSkills = skills.filter(JABS_Battler.isSkillVisibleInDodgeMenu);

    this.addCommand(J.ABS.Metadata.ClearSlotText, "dodge", true, 0, 16);
    dodgeSkills.forEach(dodge =>
    {
      this.addCommand(dodge.name, "dodge", true, dodge.id, dodge.iconIndex);
    });
  }

  /**
   * Fills the list with the currently assigned items.
   */
  makeEquippedSkillList()
  {
    const leader = $gameParty.leader();
    const skills = leader.getAllSecondarySkills();
    skills.forEach(skillSlot =>
    {
      let name = `${skillSlot.key}: ${J.ABS.Metadata.UnassignedText}`;
      let iconIndex = 0;
      if (skillSlot.isUsable())
      {
        const equippedSkill = leader.skill(skillSlot.id);
        name = `${equippedSkill.name}`;
        iconIndex = equippedSkill.iconIndex;
      }

      this.addCommand(name, "slot", true, skillSlot.key, iconIndex);
    });
  }

  /**
   * Fills the list with the currently assigned items.
   */
  makeEquippedToolList()
  {
    const toolSkill = $gameParty.leader().getToolSkill();
    let name = `${toolSkill.key}: ${J.ABS.Metadata.UnassignedText}`;
    let iconIndex = 0;
    if (toolSkill.isUsable())
    {
      const equippedTool = $dataItems[toolSkill.id];
      name = `${equippedTool.name}: ${$gameParty.numItems(equippedTool)}`;
      iconIndex = equippedTool.iconIndex;
    }

    this.addCommand(name, "slot", true, toolSkill.key, iconIndex);
  }

  /**
   * Fills the list with the currently assigned items.
   */
  makeEquippedDodgeList()
  {
    // grab the leader.
    const leader = $gameParty.leader();

    // grab the leader's dodge skill.
    const dodgeSkill = leader.getDodgeSkill();

    // default the unequipped slot text.
    let name = `${dodgeSkill.key}: ${J.ABS.Metadata.UnassignedText}`;
    let iconIndex = 0;
    if (dodgeSkill.isUsable())
    {
      const equippedDodgeSkill = leader.skill(dodgeSkill.id);
      name = `${equippedDodgeSkill.name}`;
      iconIndex = equippedDodgeSkill.iconIndex;
    }

    this.addCommand(name, "slot", true, dodgeSkill.key, iconIndex);
  }
}
//#endregion Window_AbsMenuSelect