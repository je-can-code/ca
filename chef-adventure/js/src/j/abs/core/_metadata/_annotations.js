/* eslint-disable max-len */
/*:
 * @target MZ
 * @plugindesc
 * [v3.2.2 JABS] Enables combat to be carried out on the map.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin is JABS: J's Action Battle System.
 * Using this plugin will enable you to carry out combat directly on the map
 * in real-time, similar to popular game franchises like Zelda.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Have you ever wanted to decorate events with tons of event comments and
 * watch them come to life as AI-controlled allies/enemies in an action battle
 * system for your button-mashing hack-n-slash pleasure? Well now you can! Just
 * slap some tags on the various everything across the entire RMMZ editor, and
 * you too can have a functional ABS, aka JABS!
 *
 * ============================================================================
 * INTEGRATIONS:
 * In addition to JABS, I've written a suite(20+) of other plugins that add
 * new systems or modify existing systems.
 *
 * All plugins I have written are highly compatible with eachother, and JABS.
 * Many of them were written to compliment JABS, such as the HUD or Ally AI.
 *
 * If you find issue with how my plugins are interacting with one another, feel
 * free to reach out and let me know and I'll see if I can fix it.
 *
 * If you find issue with how JABS is interacting with someone elses' plugin,
 * I encourage you communicate with that plugin author to have them reach out
 * to me and we shall discuss the problem and try to come to a solution if one
 * exists for the problem.
 *
 * As an alternative to the above, you are also welcome to file an issue
 * against my github repository describing the issue and how to reproduce it
 * minimally, and I will look into it when possible.
 * ============================================================================
 * Due to the sheer length of instruction provided below, the changelog for
 * JABS lives at the top instead of the bottom like the rest of my plugins.
 *
 * CHANGELOG:
 * - 3.2.2
 *    JABS quick menu how honors menu access via event control.
 *    Actor-based JABS parameter retrieval has been refactored.
 *    Enabled auto-counter for enemies.
 *    Fixed issue where states weren't reapplied properly.
 *    Fixed issue where inanimate battlers could endlessly alert allies.
 * - 3.2.1
 *    Refactored slip effects to accommodate the J-Passives update.
 *    Fixed issue where endlessly delaying actions would never expire.
 * - 3.2.0
 *    Fixed bug where actions couldn't connect if the attacker was too close.
 *    Upgraded AI to be able to leverage combos (ally AI, too).
 *    Refactored code surrounding AI action decision-making.
 * - 3.1.2
 *    Refactored some of the JABS menu in a non-breaking way.
 *    Optimized/centralized note tag retrieval in many cases.
 * - 3.1.1
 *    Retroactively added this CHANGELOG.
 * - 3.1.0
 *    Optimized battler tracking and management.
 *    Optimized state tracking and management.
 *    Optimized integrations with my other plugins.
 *    Added proper guidance in the plugin description.
 *    Added state duration modifiers functionality.
 *    Fixed "ignore all parry" tag.
 *    Added "Skill Charging" as JABS extension.
 *    Added "Casting Modifiers" as JABS extension.
 *    Added "Map Tools" as JABS extension.
 *    Added "Cyclone-Movement" adapter as JABS extension.
 *    Updated distance-centric tags to now allow for decimals (like "range").
 *    Added "circle" hitbox.
 *    Updated hitbox logic.
 *    Updated tags surrounding enemy event configuration.
 *    Updated tags surrounding AI definition for enemies.
 *    Optimized AI decision-making capabilities based on AI traits.
 * - 3.0.0
 *    Extracted "Text Pops" as a JABS extension plugin.
 *    Extracted "Input Management" as a JABS extension plugin.
 *    Extracted "Diagonal Movements" as a JABS extension plugin.
 *    Extracted "Movespeed Modifiers" as a JABS extension plugin.
 *    Integrated "Ally AI" as JABS extension.
 *    Added Aggro functionality.
 *    Added skill delay functionality (like bombs).
 *    Adjusted numerous data points to be customizable in plugin parameters.
 *    Further optimized "under-the-hood" parts of JABS.
 * - 2.3.1
 *    Updated loot drop functionality to be less wonky.
 *    Other miscellaneous bugfixes.
 * - 2.3.0
 *    Updated plugin parameters format to be cleaner.
 *    Added "Danger Indicator" functionality (see indicator on enemies on map).
 *    Added "Battler Name" functionality (see names of enemies on map).
 *    Other miscellaneous bugfixes.
 * - 2.2.0
 *    Added 2 new AI types: "leader" and "follower".
 *    Shifted tag location for enemies from event notebox to comment format.
 *    Other miscellaneous bugfixes.
 * - 2.1.0
 *    Implemented party cycling between members of the party.
 *    Added refresh command for JABS quick menu.
 *    Added "bonus hits" functionality.
 *    Disabled native RMMZ regeneration.
 *    Modified dash functionality to be controlled by JABS instead.
 *    Enemies now perform their active event page upon defeat.
 *    Disabled on-hit effects against targets that parry.
 *    Added "counter-guard" and "counter-parry" functionality.
 *    Added visual indicator for "action decided" for AI-controlled battlers.
 *    Excessive number of bugfixes.
 * - 2.0.0
 *    Added guarding functionality.
 *    Added counterattack functionality.
 *    Added projectile count modifiers.
 *    Enemy loot is now dropped on the ground.
 *    Added movespeed modifier functionality (for player only).
 *    Greatly optimized "under-the-hood" parts of JABS.
 * - 1.0.0
 *    The initial release.
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
 * FIRST TIME SETUP, THE ACTION MAP:
 * If you're not using the demo as a base, then you'll need to add a new map to
 * your project where all the "action events" will live. These events represent
 * the visual components of skills executed on the map and are mapped by adding
 * a tag to the skills that associate your skill with the designated event on
 * the action map. Once you've created the map, you'll need to take note of the
 * map id and align it in the plugin parameters with the "Action Map Id" param.
 *
 * ============================================================================
 * SETTING UP YOUR SKILLS:
 * In addition to setting up your enemies, you'll need to setup skills as well.
 * There are a huge variety of tags to be used, but there are a few that you'll
 * probably include on most skills.
 *
 * NOTE ABOUT THROUGH:
 * I would strongly encourage when building actions on the action map, to set
 * your action events to have "through" checked. Otherwise, they may get stuck
 * on various events or terrains unexpectedly- especially if using any kind of
 * pixel movement plugins/adapters.
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
 * NOTE ABOUT HIT COUNT:
 * When a skill has hit it's maximum number of times (once by default, or as
 * many times as defined by the "pierce" tag), it will disappear.
 *
 * NOTE ABOUT MIN DURATION:
 * Skills still have an arbitrary minimum duration of 8 frames.
 *
 * ----------------------------------------------------------------------------
 * COOLDOWN MANAGEMENT:
 * In interest of not letting the player endlessly spam their skills, you'll
 * probably want to introduce cooldowns to their skills. There are two tags for
 * handling that you'll probably want to use.
 *
 * COOLDOWN:
 * The cooldown is the primary tag to handle cooldowns. This tag defines an
 * amount of time in frames that must pass before the battler can use the skill
 * again.
 *    <cooldown:VAL>
 *  Where VAL is the cooldown amount in frames for this skill.
 *
 * NOTE ABOUT SLOTS ON COOLDOWN:
 * JABS permits the assignment of the same skill to multiple slots on a single
 * battler. By default, when using a skill with a cooldown, if any other skills
 * are equipped that share the same skill ID, they too will go on cooldown for
 * the same amount as defined in the skill. However, you can change this
 * functionality by using the next tag.
 *
 * UNIQUE COOLDOWN:
 * Using the "unique cooldown" tag on a skill will force each slot a skill is
 * equipped to to handle their cooldown independently, even if the skill shares
 * the same skill ID as another slot.
 *    <uniqueCooldown>
 *
 * ----------------------------------------------------------------------------
 * RADIUS:
 * The radius represents how big the "hitbox" of this skill using tiles as the
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
 * PROJECTILE:
 * The "projectile" value will define how many projectiles will be fired when
 * the skill is executed. This works a bit differently than you probably think.
 * The values available for this are:
 *  1: A single projectile that will fire forward.
 *  2: Two projectiles in a V shape firing forward.
 *  3: Three projectiles in a W shape firing forward.
 *  4: Four projectiles, one in each of the cardinal directions.
 *  8: Eight projectiles, one in each of the cardinal and diagonal directions.
 *
 *    <projectile:VAL>
 *  Where VAL is one of the valid numeric values listed above.
 *
 * NOTE ABOUT PROJECTILE MOTION:
 * I would strongly encourage when building your actions on the action map,
 * to use "turn X degrees" instead of "turn X direction", as they can mess up
 * the illusion of the projectiles obeying the direction they were fired in.
 * In that same vein, I'd also encourage using "1 step forward/backward" in
 * place of "Move up/down/left/right" for the same reason.
 *
 * NOTE ABOUT DIAGONALS:
 * I would also encourage using my "J-ABS-Diagonals" plugin to gain access to
 * more precise rotation within the custom move routes among other things.
 *
 * NOTE ABOUT FUTURE PLANS:
 * There is developer dreams to refine the projectile functionality into
 * something a bit cleaner, so this is tentative to change.
 *
 * ----------------------------------------------------------------------------
 * HITBOX:
 * The hitbox defines the shape of the hitbox for this skill (surprise!).
 * The value for this must be selected from the given list, and each can
 * interact a bit differently with the "radius" tag.
 *
 * NOTE ABOUT COLLISION:
 * It is important to remember that while the hitbox defines the shape of
 * collision, the hitbox is always centered on the action event (with some
 * exceptions), and can definitely be moving.
 *
 * NOTE ABOUT PROJECTILES:
 * If this skill has multiple projectiles, ALL projectiles will share the same
 * hitbox.
 *
 * CIRCLE:
 * The "circle" hitbox is just what you'd think: a circle that grows in size
 * the greater the radius.
 *    <hitbox:circle>
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
 * SELF ANIMATION:
 * The "self animation" is simply a numeric value that represents an animation
 * that will play on the caster when the skill hits a target.
 *    <selfAnimationId:VAL>
 *  Where VAL is the animation id to execute once finished casting.
 *
 * ----------------------------------------------------------------------------
 * PIERCING:
 * The "pierce" tag is a tag that enables a skill to hit multiple targets
 * multiple times, potentially with a delay between each hit.
 *    <pierce:[TIMES,DELAY]>
 *  Where TIMES is the maximum number of times this skill can pierce.
 *  Where DELAY is the number of frames between each hit.
 *
 * NOTE ABOUT HIT FREQUENCY:
 * The most a skill can hit via "pierce" is once per frame. If the DELAY
 * is set to 0, then it will hit each frame that the skill's hitbox collides
 * with the target.
 *
 * NOTE ABOUT SKILL REPEATS:
 * The "repeats" field from the database is added onto the TIMES value,
 * even if there is no "pierce" tag on the skill, meaning if you omit the
 * "pierce" tag and add "5 repeats" via the database editor, the skill will
 * effectively have this tag on it:
 *    <pierce:[6,0]>
 *
 * ----------------------------------------------------------------------------
 * KNOCKBACK:
 * The "knockback" tag defines how many tiles the target will be knocked back
 * when hit by this skill.
 *    <knockback:VAL>
 *  Where VAL is distance the target will be knocked back.
 *
 * ----------------------------------------------------------------------------
 * DELAY:
 * The "delay" tag is a bit of a tricky one that allows a skill to exist on the
 * map for a duration of time before triggering. The simplest example of this
 * would be like a time bomb, or a time landmine. If you want an action to
 * persist indefinitely, you can set the DURATION to -1 and it will not
 * disappear until it is touched.
 *    <delay:[DURATION,TOUCHABLE]>
 *  Where DURATION is number of frames to exist on the map before detonating.
 *  Where TOUCHABLE a boolean defining whether or not it triggers when touched.
 *
 * EXAMPLE:
 *    <delay:[300,true]>
 * As an example, the above tag would result in an action that was placed where
 * the caster was at time of skill execution, and sit there for 300 frames
 * (which is roughly 5 seconds). If an enemy touched this action, the action
 * would trigger.
 *
 * NOTE ABOUT TOUCHING:
 * "touched" is a term used loosely. To "touch" an action, you simply need to
 * collide with it, which can be deceiving if its a bomb with a large hitbox.
 *
 * WARNING ABOUT INDEFINITE DELAY:
 * If the DURATION is set to -1, don't forget to set the TOUCHABLE to "true"!
 * If you do not, the action will sit there forever and never trigger due to
 * not being touchable.
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
 * ----------------------------------------------------------------------------
 * COMBOS:
 * This is a somewhat broad topic encompassing multiple tags, but "comboing"
 * can also be a feature of JABS if desired.
 *
 * COMBO ACTION:
 * The "combo action" tag will define what skill can be followed when using
 * this skill. This will cause a skill to temporarily be replaced by the
 * COMBOSKILLID in the tag, and be executable after LINKTIME frames.
 *    <combo:[COMBO_SKILL_ID,LINK_TIME]>
 *  Where COMBO_SKILL_ID is the skill ID that will be combo'd into.
 *  Where LINK_TIME is the number of frames until the combo is available.
 *
 * If a skill has a combo tag on it like this, the cooldown of the skill must
 * have a longer cooldown than the LINK_TIME frames, otherwise it will never be
 * usable. After the original skill's cooldown time expires (as in, the skill
 * that initiated the combo), it will undo all subsequent combo effects and
 * return back to the original skill. Keep in mind that with each subsequent
 * combo action executed, the remaining cooldown gets extended by the LINK_TIME
 * frames amount, allowing the combo to continue.
 *
 * This sounds complicated, but take a look at the sample project for examples
 * and play around with it a bit to gain a firmer grasp on it.
 *
 * EXAMPLE:
 *      <combo:[2,10]>
 * As an example, if skill contained the above tag and a battler used this
 * this skill, their skill would become skill ID 2, and be usable after
 * 10 frames (roughly 1/6 of a second).
 *
 * COMBO STARTER:
 * While combo action tags work as you might suspect for when the player is
 * controlling a particular battler, AI-controlled battlers require a bit of
 * extra hand-holding in order to use combos. The main tag for that is the
 * "combo starter" tag, that looks something like this:
 *    <comboStarter>
 *
 * That is it. By default, AI-controlled battlers will dismiss skills that
 * have the "combo action" tag on them, but if you add the "combo starter"
 * tag to the skills that are intended to start a combo, the AI will know that
 * it can use that skill as well. The chance of pursuing a combo is dependent
 * on the AI configuration (ally or enemy), but generally hovers between 50-100
 * percent chance of obeying the "combo action" tag. More on that down in the
 * AI traits section, and in the J-ABS-AllyAI plugin.
 *
 * NOTE ABOUT FOLLOW-UP COMBOS:
 * In order for a combo action to become available, it REQUIRES the skill to
 * connect with a target. However, if you want a skill to not require hitting
 * anything and instead become available as soon as the skill is executed,
 * then check the next tag.
 *
 * FREECOMBO:
 * In some cases, you may want a skill to not have a requirement to hit
 * anything in order to combo. In these cases, there is another tag to add to
 * your skill that you want to freely combo into another.
 *    <freeCombo>
 *
 * Using this will instantly make the next combo skill available to execute.
 *
 * AI SKILL EXCLUSION:
 * While this isn't explicitly related to combos, this is most likely to be
 * used in conjunction with combo tags. The "ai skill exclusion" tag does
 * exactly what you probably suspect it will do: exclude the skill from the
 * list of available skills that an AI-controlled battler can leverage. You
 * may ask "why would I want to add a skill to an enemy, and then exclude it?"
 * and the answer is "because its a part of a combo". As you may recall from
 * the many paragraphs of combo information above, in order for a skill to be
 * usable within a combo, the battler must know the skill. However, a skill
 * that is the end of a combo typically won't have a combo tag, meaning the
 * AI will be able to randomly also select the combo-ender skill while deciding
 * actions. By adding the "ai skill exclusion" tag to said combo-ender skills,
 * you can avoid this behavior with grace. You can also use this to exclude
 * skills that perform other functionalities that shouldn't be executed in
 * battle, such as "passive" skills.
 *    <aiSkillExclusion>
 *
 * NOTE ABOUT SKILL EXTENSION SKILLS:
 * If also using the "J-SkillExtend" plugin, by default all extension skills
 * will be excluded from random selection, identical in behavior to the
 * "ai skill exclusion" tag above.
 *
 * ----------------------------------------------------------------------------
 * GUARDING:
 * Guarding is a first-class citizen of functionality in JABS! If you want a
 * skill to be considered a guard skill, there are a variety of tags you can
 * use to build full-featured defending fun.
 *
 * NOTE ABOUT GUARD SKILL TYPES:
 * It is important to note that a skill must have the "Guard Skill Type" id in
 * order for it to be even recognized as a guard skill. That is defined by you
 * in the plugin parameters.
 *
 * GUARD:
 * The most basic of guarding requires the "guard" tag. This is a tag made up
 * of a pair of values to define damage reduction/amplification.
 *    <guard:[FLAT,PERCENT]>
 *  Where FLAT is the flat amount to modify damage by.
 *  Where PERCENT is the percent amount to modify damage by.
 *
 * The FLAT and PERCENT values should likely be negative most of the time,
 * unless your intent is to make it so that guarding increases damage instead.
 *
 * EXAMPLE:
 *      <guard:[-10,-25]>
 * As an example, if a guard skill contained the above tag, then the damage
 * would be reduced by a flat 10 and then reduced by 25%.
 * This order favors the player, because we want our players to have fun!
 *
 * PARRY:
 * Parrying as a functionality is a means to completely mitigate an incoming
 * attack if the player guards at "just the right time". Using this tag, you
 * can define how large the window is for "just the right time".
 *    <parry:VAL>
 *  Where VAL is the number of frames parrying is available.
 *
 * The window of "just the right time" always starts when guarding starts and
 * counts down VAL number of frames until zero. The parry window is visually
 * identified by its unique blue flash on the guarding battler.
 *
 * NOTE ABOUT CONSECUTIVE PARRIES:
 * Do be aware that upon successful parry, all guarding stops automatically
 * and the parry window is immediately ended. However, the character will
 * still be in "pivot mode", where they can rotate in place. To guard or
 * parry again, you will need to release the button and press it again.
 *
 * COUNTER-GUARD/COUNTER-PARRY:
 * In addition to just guarding to reduce damage and/or parrying to mitigate,
 * you can define guard skills that can have a chance (or always) result in
 * retaliating with a skill in response to being hit while guarding or
 * parrying.
 *    <counterGuard:[SKILL,CHANCE]>
 *  Where SKILL is the skill ID to potentially counter with when guarding.
 *  Where CHANCE is the percent chance to execute the SKILL per hit guarded.
 *
 *    <counterParry:[SKILL,CHANCE]>
 *  Where SKILL is the skill ID to potentially counter with when parrying.
 *  Where CHANCE is the percent chance to execute the SKILL on-parry.
 *
 * NOTE ABOUT COUNTER PRIORITIES:
 * Counter-parrying takes precedence over counter-guarding. If both
 * counter-guard and counter-parry are available on the same battler and RNG
 * favors you, only counter-parry will be executed.
 *
 * UNPARRYABLE:
 * Should the need arise that you need a particular skill skip the possibility
 * of being parried (like for an important skill that should always hit), then
 * we have a tag for that too.
 *    <unparryable>
 *
 * Using this tag will make a skill simply unable to be parried, even should
 * all requirements be met.
 *
 * ============================================================================
 * USING SKILLS:
 * Now that you've spent all this time setting up skills with a massive pile of
 * tags, you'll probably want to execute them to chop up your trash mobs!
 * Fortunately for you, that is relatively straight forward. There are two ways
 * to do this.
 *
 * NOTE ABOUT SKILL USABILITY:
 * In addition to the default RMMZ skill usage requirements (cost etc), it is
 * extremely important to note that the battler MUST know the skill in order to
 * execute it. That sounds silly, but given the nature of being able to equip
 * gear that uses a skill (potentially without having ever learned it), this is
 * an important fact to be aware of- especially in the mainhand/offhand slots.
 *
 * A LITTLE ABOUT SKILL SLOTS FIRST:
 * JABS makes use of what is called "skill slots". There are eight of them, all
 * of which I arbitrarily just made up.
 * - mainhand
 * - offhand
 * - tool
 * - dodge
 * - combat skill 1
 * - combat skill 2
 * - combat skill 3
 * - combat skill 4
 *
 * ----------------------------------------------------------------------------
 * MAINHAND AND OFFHAND SLOTS:
 * The "mainhand" and "offhand" slots are typically slots the player does not
 * assign directly. They are instead autoassigned via equipment. Normally, the
 * weapon slot will translate to your mainhand slot, and the shield will define
 * your offhand slot. If the actor is dual-wielding, then the second weapon
 * slot will fill the offhand slot instead. In order to designate what skills
 * the equipment grant to the actor, you'll use the "skill ID" tag:
 *    <skillId:SKILL_ID>
 *  Where SKILL_ID is the skill to be assigned to the equip slot.
 *
 * The usability of the skill in the equip slot is defined by the skill itself.
 * If you want the shield to have an attack skill of some kind, then you can
 * assign it as such. However, ONLY THE OFFHAND CAN DEFINE A GUARD SKILL. So
 * keep that in mind.
 *
 * HIDING ITEMS/SKILLS FROM ASSIGNMENT:
 * Should you find yourself the need to have certain items/skills that should
 * never appear in the assignment menu for a given slot, use this tag:
 *    <hideFromJabsMenu>
 *
 * This hiding applies to "dodge" and "combat" skills, as well as "tools".
 * Anything hidden from the quick menu will still be revealed in the main menu.
 *
 * ----------------------------------------------------------------------------
 * TOOL SLOT:
 * The "tool" slot is always player-assigned (or via plugin commands if you
 * want). The "tool" slot represents usable items. These can be potions, bombs,
 * or whatever else you want. Similar to equipment, you'll only need assign a
 * SKILL_ID to them and they become usable with the given effects defined in
 * the database:
 *    <skillId:SKILL_ID>
 *  Where SKILL_ID is the skill to be performed by the tool slot.
 *
 * ----------------------------------------------------------------------------
 * DODGE SLOT:
 * The "dodge" slot is also always player-assigned. This slot represents a
 * unique "mobility" type skill (normally), where there are additional tags
 * that can help define how the player moves when executing the skill. Keep
 * in mind that in order for a skill to be identified as a "dodge" skill, it
 * will not only need some tags below, but also need to be a part of the skill
 * type that is defined in the plugin parameters for "dodge skill type".
 *
 * DODGE MOVETYPE:
 * The "move type" defines one of three kinds of movetypes available for the
 * dodge skill.
 *    <moveType:TYPE>
 *  Where TYPE is one of "forward", "backward", or "directional".
 *
 * The "forward move type" will force the dodge skill to move the player in
 * the same direction they are facing.
 *
 * The "backward move type" will force the dodge skill to move the player in
 * the opposite direction they are facing.
 *
 * The "directional move type" will grant the player the ability to move in
 * whatever direction they are pressing when the skill is executed.
 *
 * DODGE INVINCIBILITY:
 * Normally when performing a dodge skill, the player is simply being
 * forcefully moved by the skill, but are still susceptible to interruption by
 * enemy attacks if they collide with something. If you want the player to
 * instead be invincible for the duration of the movement, then you can use
 * this tag.
 *    <invincibleDodge>
 *
 * DODGE DISTANCE:
 * Sometimes you may want the player to only dodge a couple steps, maybe other
 * times you'll want them to be able to dodge across the map. In either case,
 * if you want to define this distance, you'll use the "radius" tag that is
 * already used to define distance for skills:
 *    <radius:DISTANCE>
 *  Where DISTANCE is the number of tiles to be forcefully moved.
 *
 * ----------------------------------------------------------------------------
 * COMBAT SKILL SLOTS:
 * There are four combat skill slots available, and all four are assigned by
 * the player. They are designed to be swappable anytime from the quickmenu
 * from whatever skills the player currently knows and also have been setup.
 * Using all the various tags you've learned about above (and below), those are
 * the skills that can be designated as "combat skills".
 *
 * ============================================================================
 * AGGRO MANAGEMENT:
 * When it comes to AI and allies and enemies all taking swings at eachother,
 * sometimes certain allies should be grabbing the attention of enemies and
 * vice versa. Thus we have an aggro system- a numeric representation of how
 * mad a battler is at another. Any AI-controlled battler will always target
 * the battler with the highest aggro value in relation to them.
 *
 * It is worth noting that there are a bundle of plugin parameter tags that
 * revolve around defaults of aggro generation, so do be sure to review them.
 *
 * Additionally, there are a few basics that are simply the way this system
 * functions. There is no way to change this without going into the code and
 * manually changing it, so pay attention!
 *
 * Aggro always starts with the base amount defined in the plugin params.
 * Aggro accumulates the HP then MP then TP damage calculations next.
 * Aggro accumulates the HP Drain next (MP/TP not considered!)
 * Aggro accumulates the amount when parried if applicable next.
 *  (the target parrying also aggros the attacker!)
 * Aggro then accumulates any bonus aggro from tags described below.
 * Aggro then multiplies any bonus rates from tags described below.
 * Aggro then multiplies iteratively over every attacker state from tags below.
 * Aggro then multiplies iteratively over every target state from tags below.
 * Aggro then multiplies based on the attacker's TGR stat.
 * Aggro then multiplies based on the player-unique multiplier if applicable.
 *
 * By default, you don't need to do anything special to utilize this system,
 * but if you want to manipulate it in any way, like making skills that will
 * generate more aggro than others, or lock aggro, or reduce aggro, then you
 * will want to leverage the following tags.
 *
 * ----------------------------------------------------------------------------
 * AGGRO TAGS FOR SKILLS:
 * There are a couple of tags that you can place on skills to affect aggro.
 * They will influence how much or little a skill will affect the aggro
 * generation based on the above aggro logic.
 *
 * BONUS AGGRO:
 * As suggested, this tag will cause skills to generate additional aggro. This
 * can also be used to reduce aggro if you opt to make the amount negative.
 *    <aggro:VAL>
 *  Where VAL is the numeric amount of aggro to gain (or lose).
 *
 * AGGRO MULTIPLIER:
 * The aggro multiplier tag can be used to make skills still use all the same
 * formulas, but then just pile on an extra multiplier atop that to further
 * amplify aggro.
 *    <aggroMultiplier:VAL>
 *  Where VAL is a decimal multiplier against aggro.
 *
 * NOTE ABOUT DEFAULT AGGRO MULTIPLIERS:
 * The default is 1.0 if unspecified, so when adding a multiplier to skills,
 * you'll probably want it to be some fractional number between ~0.1 and ~10.
 *
 * ----------------------------------------------------------------------------
 * AGGRO TAGS FOR STATES:
 * There are also a couple of tags that you can place on states to affect
 * aggro. These will be in effect for the duration of the state on the battler.
 *
 * AGGRO LOCK:
 * To lock a battler's aggro means it cannot be changed while the state is
 * applied to the battler. They can still influence other battler's aggro, but
 * they themselves cannot have their aggro adjusted by any means.
 *    <aggroLock>
 *
 * AGGRO OUT AMPLIFIER:
 * As the title suggests, applying this tag to a state will cause all aggro
 * this battler generates to be multiplied by a given amount.
 *    <aggroOutAmp:VAL>
 *  Where VAL is the decimal multiplier against outgoing aggro.
 *
 * AGGRO IN AMPLIFIER:
 * Similar to the AGGRO OUT AMPLIFIER, applying this tag to a state will cause
 * all received aggro for this battler to be multiplied by a given amount.
 *    <aggroInAmp:VAL>
 *  Where VAL is the decimal multiplier against incoming aggro.
 *
 * ============================================================================
 * CONFIGURING LOOT:
 * After a hard day of chopping up trash mobs, you should be a benevolent RMMZ
 * developer and reward your player with loot. Any droppable item that is
 * listed in the database can be dropped and subsequently collected. However,
 * the setup is kind of clumsy by default. I would encourage using another of
 * my plugins called "J-DropsControl". Regardless if you do or don't, there
 * are a couple of tags you may want to consider using in tandem with the
 * plugin parameters for loot drops.
 *
 * ----------------------------------------------------------------------------
 * USE ON PICKUP:
 * The "heart" drop, made iconic by the Zelda franchise, is an item that when
 * picked up, will immediately heal for a given amount. Should you also want to
 * create such functionality, you can use the "use on pickup" tag. Simply add
 * the tag to an ITEM that can be dropped from a foe on defeat, and when the
 * player collects the loot, it will instead be immediately performed as if
 * using the item on oneself.
 *    <useOnPickup>
 *
 * While I use the classic "heart" drop from Zelda as an example, it does not
 * have to be a healing item that is immediately used. Get creative!
 *
 * ----------------------------------------------------------------------------
 * EXPIRATION:
 * In the plugin parameters, you can set the default duration for which an loot
 * drop can persist on the map after being dropped. While it could be set for
 * loot to persist indefinitely, if you should ever need to make a particular
 * loot drop only last for a designated amount of time, then this is the tag
 * for you.
 *    <expires:DURATION>
 *  Where DURATION is the number of frames to persist after being dropped.
 *
 * NOTE ABOUT MAP TRANSFERS:
 * All loot is erased upon transfering maps. This is an intended functionality.
 * If you want to demand the player collect loot, you should consider either
 * locking the player on the map or forcing the item into the player's
 * inventory via eventing.
 *
 * ============================================================================
 * SETTING UP STATES:
 * States are obviously an important part of any good RPG! So naturally, when
 * you go about building states with JABS, there are a few additional details
 * that you should understand when it comes to their setup and functionality.
 * There is one tag for defining what is a "negative" state, and four tags
 * for locking core functionality on a battler. Additionally, there are a host
 * of other tags that grant other useful functionality. Read on to learn more!
 *
 * ----------------------------------------------------------------------------
 * NEGATIVE:
 * Functionally, a state being "negative" does not impact how it operates, but
 * it does influence how the AI perceives the states and considers actions when
 * attempting to heal (like by trying to purge states). Thus, if you want a
 * state to be considered negative and thus AI-controlled battlers will attempt
 * to heal this state when using either <aiTrait:healer> or setting ally AI to
 * "support", then add this tag to the state.
 *    <negative>
 *
 * ----------------------------------------------------------------------------
 * ROOTED:
 * A state with the "rooted" tag will lock the battler's movement.
 *    <rooted>
 *
 * ----------------------------------------------------------------------------
 * DISARMED:
 * A state with the "disarmed" tag will lock the battler's basic attacks.
 * Basic attacks are considered either the main or offhand for actor battlers,
 * and the "basic attack" traited skill for enemy battlers.
 *    <disarmed>
 *
 * ----------------------------------------------------------------------------
 * MUTED:
 * A state with the "muted" tag will lock the battler's combat actions.
 * Combat actions are considered either the four extra equippable slots for
 * actor battlers, and any non-basic-attack skills for enemy battlers.
 *    <muted>
 *
 * ----------------------------------------------------------------------------
 * PARALYZED:
 * A state with the "paralyzed" tag will lock everything about a battler.
 * It is functionally the same as being "rooted", "disarmed", and "muted", all
 * at the same time.
 *    <paralyzed>
 *
 * ----------------------------------------------------------------------------
 * ----------------------------------------------------------------------------
 * SLIP DAMAGE:
 * For those unfamiliar with the term, "slip damage" is an alternative naming
 * for "damage over time". There are three types of tags for each of the three
 * categories of slip damage. It is important to note that the values you place
 * in the value portion of these tags equals "this much per 5 seconds". See the
 * examples for more details on that. But if you want to think about math, then
 * just consider it that the tick value you see will be about 1/20 of that VAL.
 * And that the tick happens 4 times per second.
 *
 * ----------------------------------------------------------------------------
 * SLIP DAMAGE AS A CONCEPT:
 * Battlers have three pools of parameters that are conventionally replenished
 * or diminished by some means or another, those being hp/mp/tp. Slip damage in
 * the context of JABS revolves around manipulation of these three parameters.
 *
 * NEGATIVE SLIP DAMAGE:
 * When the aim of a state is to diminish a target's pools, use negative slip
 * damage. Common examples of this are:
 * - Poison for reducing HP steadily for a time.
 * - Forgetful for reducing MP steadily for a time.
 * - Exhaustion for reducing TP steadily for a time.
 *
 * POSITIVE SLIP DAMAGE:
 * When the aim of a state is to replenish a target's pools, use positive slip
 * damage. Common examples of this are:
 * - Regenerate for increasing HP steadily for a time.
 * - Zen for increasing MP steadily for a time.
 * - Focused for increasing TP steadily for a time.
 *
 * With this in mind, the tags are grouped into three categories, and named with
 * clarity in mind when reading the tag. This means there are three permutations
 * of three categories of ways slip damage is applied. You can read about them
 * in the three subsections below.
 *
 * IMPORTANT NOTE ABOUT DAMAGE FREQUENCY:
 * It is important to note that the values in all three categories of damage
 * application are assumed to be the amount of damage/healing applied over the
 * spread of five seconds. The amount is spread over a total of 20 ticks per
 * five seconds, translating to four ticks per second. This was an arbitrary
 * decision, but important to comprehend the magic formula of which each tick
 * will translate to based on the amount you enter as VAL in the values of the
 * tags below:
 *    VAL / 20 = AMOUNT_PER_TICK
 *
 * FLAT:
 * Flat damage is just that, a fixed amount of unmitigatable damage or healing
 * against the given parameter.
 *    <hpFlat:VAL>
 *    <mpFlat:VAL>
 *    <tpFlat:VAL>
 *  Where VAL is the amount to lose per 5.
 *
 * PERCENT:
 * Percent damage will eat a portion of the battler's max value per tick.
 * Use this tag with care, because it adds up fast!
 *    <hpPercent:VAL>
 *    <mpPercent:VAL>
 *    <tpPercent:VAL>
 *  Where VAL is the % of max value to lose per 5.
 *
 * FORMULA:
 * Formula-driven damage allows you to build formulas that can potentially
 * scale with a battler's stats. Similar to the damage formula you define in
 * skills, you can define a similar formula within the brackets to deal
 * formula-based damage with every tick. This formula will have access to the
 * one afflicted with the state as "a", the one who applied the state as "b",
 * the collection of variables as "v", and the state object itself as "s".
 *    <hpFormula:[FORMULA]>
 *    <mpFormula:[FORMULA]>
 *    <tpFormula:[FORMULA]>
 *  Where FORMULA is the damage-like formula to calculate VAL to lose per 5.
 *
 * EXAMPLES:
 *    <hpFlat:-100>
 *  A battler with this tag would lose 100 HP over five seconds, at the rate of
 *  5 damage per tick.
 *
 *    <mpPercent:50>
 *  A battler would lose 50% of their max MP over five seconds, at the rate of
 *  2.5% damage per tick.
 *
 *    <tpFormula:[(a.atk * 2)]>
 *  A battler would gain TP equal to "200% of own attack" over five seconds, at
 * the rate of 10% healing per tick.
 *
 *    <hpPercent:80>
 *  A battler would gain 80% of their max HP over five seconds, at the rate of
 *  4% healing per tick.
 *
 *    <mpFormula:[a.mdf + b.mdf]>
 *  A battler would gain MP equal to "100% of my own and the afflicter's magic
 *  defense" over five seconds, at the rate of 5% healing per tick.
 *
 *    <tpFlat:-20>
 *  A battler would lose 20 TP over five seconds, at the rate of exactly
 *  1 damage per tick.
 *
 * NOTE ABOUT VAL OUTPUT:
 * Making the output VAL a multiple of 20x is an easy mental and visual way to
 * control the damage or healing by increments of 1. For example, having the
 * healing output change between 20 to 40 to 60 to 80 would visually be
 * outputed as seeing popups change from 1, to 2, to 3, to 4, and onward. The
 * same concept applies if the output is negative.
 *
 * STATE DURATIONS:
 * After all that talk about manipulation of health and stuff via states, you
 * might be saying "you've told me that everything is outputed as per five
 * seconds, but how do I specify how long they last?". To accommodate the fact
 * that I wanted governance over durations to be accessible, I opted to
 * repurposes the "stepstoRemove" property on states, which is the "Remove by
 * Walking" number box in the database editor. The number entered into that box
 * will be the number of frames that a state will persist. Considering RMMZ
 * runs natively at roughly 60 frames per second, you can assume that if you
 * make a state duration last 300 frames, that it will roughly afflict the
 * battler with exactly as much as you specify in the VAL output of the slip
 * damage or other effects.
 *
 * NOTE ABOUT FRAMES PER SECOND:
 * I do say "roughly" a number of times in the section above. That is because
 * while the engine assumes you'll be running at 60 frames per second, the
 * reality is that it teeters somewhere between 30 and 60 depending on the
 * level of action and how powerful your computer is, etc. This means that
 * even though the state may be designated to last 300 frames, and you convert
 * that in your head to 5 seconds, it may actually be longer than 5 seconds if
 * your frames per second are spending a lot of time below 60.
 * Keep that in mind when designing states.
 * ============================================================================
 * STATE DURATION EXTENSIONS:
 * In some cases, you may want the player to acquire armor or have states to
 * apply modifiers to how long states last. To accomplish this functionality,
 * we have another trio of tags that can modify the duration of states applied
 * by a given battler.
 *
 * NOTE ABOUT SCOPE OF USE:
 * This is for outgoing state duration only!
 * This does NOT extend or reduce state durations for incoming states.
 *
 * NOTE ABOUT POSITIVE OR NEGATIVE:
 * Any of the below values can be positive or negative and will modify the
 * base duration accordingly.
 *
 * NOTE ABOUT MULTIPLE TAGS:
 * All tags are summed up into their respective groups and added together
 * from all available note-containing sources applicable to the battler.
 *
 * FLAT:
 * Flat state duration boosts are exactly as you might suspect, a flat number
 * of frames that will be added to the base duration.
 *    <stateDurationFlat: VAL>
 *  Where VAL is the number of frames to add onto the base duration.
 *
 * PERCENT:
 * Percent state duration boosts are also what you might expect: a percent
 * modifier of the base duration added to the base duration.
 *    <stateDurationPerc: VAL>
 *  Where VAL is the % of base duration to be added onto the base duration.
 *
 * FORMULA:
 * For more complex scenarios, you may want to use a formula to calculate the
 * bonus state duration to be added to the base duration.
 *    <stateDurationForm:[FORMULA]>
 *  Where FORMULA is the damage-like formula to calculate VAL to add onto
 *  the base duration.
 *
 *  Within the FORMULA, there are pre-defined variables available for use:
 *    - "a": which represents the battler afflicted with the state.
 *    - "b": which represents the base duration of the state.
 *    - "v": which represents access to the variable store.
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