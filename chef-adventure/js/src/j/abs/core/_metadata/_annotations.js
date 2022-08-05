/* eslint-disable max-len */
/*:
 * @target MZ
 * @plugindesc
 * [v3.1.0 JABS] Enables combat to be carried out on the map.
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