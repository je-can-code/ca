//=============================================================================
// VisuStella MZ - Enhanced TP System
// VisuMZ_2_EnhancedTpSystem.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_EnhancedTpSystem = true;

var VisuMZ = VisuMZ || {};
VisuMZ.EnhancedTP = VisuMZ.EnhancedTP || {};
VisuMZ.EnhancedTP.version = 1.06;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.06] [EnhancedTP]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Enhanced_TP_System_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The TP system in RPG Maker MZ is rather limiting. A lot of the TP system is
 * hardcoded in giving RPG Maker MZ users very little control over how much TP
 * gain a battler can receive from particular actions and situations. This
 * plugin gives you the ability to adjust how much TP battlers will acquire
 * various actions, different TP modes, and letting players selecting and pick
 * what TP mode they want for each actor.
 *
 * Features include all (but not limited to) the following:
 * 
 * * TP Modes that allow actors and enemies to have different ways of
 *   generating TP through battle.
 * * 30 pre-made TP Modes for you to use and/or learn from.
 * * Functionality for skills and items to change a target's TP Mode.
 * * The ability to teach actors new TP modes upon learning new skills.
 * * Unlock new TP Modes from becoming the target of skills and/or items.
 * * Trait Objects (like states) that will enforce a specific TP Mode when
 *   applied.
 * * TP Gauge can flash a variety of colors once a certain percentile range
 *   has been met.
 * * Integrated TP Mode changer for players within Scene_Skill.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 2 ------
 *
 * This plugin is a Tier 2 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * MaxTP Overwrite
 *
 * - There was nothing altering MaxTP before and this plugin offers TP Modes
 * that change up the MaxTP total. The function has been overwritten for more
 * plugin functionality.
 *
 * ---
 *
 * Preserve TP
 *
 * - Preserve TP function has been overwritten so it is no longer determined by
 * the presence of the Preserve TP trait, but instead, determined by whether or
 * not the current TP Mode has TP Preservation as its property. This is to keep
 * the consistency in the TP Modes and to give the game dev more control over
 * this aspect.
 *
 * ---
 * 
 * Initial TP Gain in Battle Reworked
 *
 * - If 'Preserve TP' was off, battlers would normally have a random amount of
 * TP given to them at the start of battle by default. However, there was no
 * place to control this value in the RPG Maker MZ editor itself so this has
 * been overwritten to give you, the game dev, full control over this aspect,
 * and whether or not it requires the 'Preserve TP' flag or not.
 *
 * ---
 *
 * On Damage TP Gain
 *
 * - The on Damage function has been overwritten to remove the default TP gain
 * aspect in favor of custom TP gain aspect granted by the current equipped TP
 * Mode to keep functionality under control.
 *
 * ---
 * 
 * Sprite_Gauge Changes
 * 
 * - The sprite gauge has been changed slightly to allow for flashing gauges.
 * They're separated into different layers now when it comes strictly to a TP
 * gauge. There shouldn't be any noticeable compatibility problems with them
 * unless there are plugins that alter the TP gauge completely.
 * 
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 *
 * ---
 *
 * === General TP Mode Notetags ===
 *
 * These are TP Mode-related notatags that affect both actors and enemies.
 *
 * ---
 *
 * <TP Mode: name>
 *
 * - Used for: Actor Enemy, State Notetags
 * - Sets the starting TP Mode for this actor/enemy to be 'name'.
 * - Replace 'name' with the name of a TP Mode from the Plugin Parameters =>
 *   TP Modes listing.
 *
 * ---
 *
 * <Starting TP Modes>
 *  name
 *  name
 *  name
 *  name
 * </Starting TP Modes>
 *
 * - Used for: Actor Notetags
 * - Adds TP Modes to the actor's available list of TP Modes from the start.
 * - Replace 'name' with the name of a TP Mode from the Plugin Parameters =>
 *   TP Modes listing.
 * - Insert more 'name' entries for more TP Modes.
 *
 * ---
 *
 * <Change Target TP Mode: name>
 *
 * <Change User TP Mode: name>
 *
 * - Used for: Skill, Item Notetags
 * - Changes the target/user's TP Mode to the target TP Mode upon using this
 *   item/skill.
 * - For <Change Target TP Mode: name>, the action must successfully hit the
 *   target in order for the TP Mode to change.
 * - Replace 'name' with the name of a TP Mode from the Plugin Parameters =>
 *   TP Modes listing.
 *
 * ---
 *
 * === Actor-Only TP Mode Notetags ===
 *
 * These are TP Mode-related notetags that only affect actors.
 *
 * ---
 *
 * <Learn TP Mode: name>
 *
 * - Used for: Skill Notetags
 * - Causes the target selected actor to learn the specific TP Mode when the
 *   skill is learned.
 * - Insert multiple copies of this notetag to have the skill learn more
 *   TP Modes for the target actor.
 * - Replace 'name' with the name of a TP Mode from the Plugin Parameters =>
 *   TP Modes listing.
 * - Keep in mind that learning the skill is required for the TP Mode to be
 *   learned. Adding the skill through a trait will not teach the TP Mode.
 *
 * ---
 *
 * <Learn TP Modes>
 *  name
 *  name
 *  name
 * </Learn TP Modes>
 *
 * - Used for: Skill Notetags
 * - Causes the target selected actor to learn the specific TP Mode when the
 *   skill is learned.
 * - Replace 'name' with the name of a TP Mode from the Plugin Parameters =>
 *   TP Modes listing.
 * - Insert more 'name' entries for more TP Modes.
 *
 * ---
 *
 * <Unlock TP Mode: name>
 *
 * - Used for: Skill, Item Notetags
 * - Causes the target selected actor to unlock the specific TP Mode.
 * - Insert multiple copies of this notetag to have the item/skill unlock more
 *   TP Modes for the target actor.
 * - Replace 'name' with the name of a TP Mode from the Plugin Parameters =>
 *   TP Modes listing.
 *
 * ---
 *
 * <Unlock TP Modes>
 *  name
 *  name
 *  name
 * </Unlock TP Modes>
 *
 * - Used for: Skill, Item Notetags
 * - Causes the target selected actor to unlock the specific TP Mode.
 * - Replace 'name' with the name of a TP Mode from the Plugin Parameters =>
 *   TP Modes listing.
 * - Insert more 'name' entries for more TP Modes.
 *
 * ---
 *
 * <Force TP Mode: name>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Forces the affected battler to use the specific named TP Mode in battle.
 * - Priority is given based the ordering of trait objects if multiple forced
 *   TP Mode effects are present.
 * - Replace 'name' with the name of a TP Mode from the Plugin Parameters =>
 *   TP Modes listing.
 *
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Actor Plugin Commands ===
 * 
 * ---
 *
 * Actor: Change TP Mode
 * - Changes target actor(s) TP Mode.
 *
 *   Actor ID(s):
 *   - Select which actor(s) to affect.
 *
 *   TP Mode Name:
 *   - Change to this TP Mode for selected actor(s).
 *
 * ---
 *
 * Actor: Unlock TP Mode
 * - Unlocks TP Modes for target actor(s).
 *
 *   Actor ID(s):
 *   - Select which actor(s) to affect.
 *
 *   TP Modes:
 *   - Change to this TP Mode for selected actor(s).
 *
 * ---
 *
 * Actor: Unlock All TP Modes
 * - Unlocks all TP Modes for target actor(s).
 *
 *   Actor ID(s):
 *   - Select which actor(s) to affect.
 *
 * ---
 * 
 * === Enemy Plugin Commands ===
 * 
 * ---
 *
 * Enemy: Change TP Mode
 * - Changes target enemy(ies) TP Mode.
 *
 *   Enemy Index(es):
 *   - Select which enemy(ies) to affect.
 *
 *   TP Mode Name:
 *   - Change to this TP Mode for selected enemy(ies).
 *
 * ---
 *
 * === System Plugin Commands ===
 * 
 * ---
 * 
 * System: Show/Hide TP Mode
 * - Shows/Hides TP Mode from Scene_Skill.
 *
 *   Show TP Mode?:
 *   - Shows/Hides TP Mode in Scene_Skill.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * These are the general settings for the Enhanced TP System plugin. These
 * control the default settings for TP Modes and TP Mode option appearing in
 * Scene_Skill for the player.
 *
 * ---
 *
 * Defaults
 * 
 *   Default TP Mode:
 *   - Which TP mode should actors and enemies have by default?
 * 
 *   Global TP Modes:
 *   - TP Modes available to the all actors to pick from.
 *
 * ---
 *
 * Scene_Skill
 * 
 *   Show TP Mode?:
 *   - Show TP Mode in Scene_Skill by default?
 * 
 *   TP Mode Command:
 *   - The command name format shown in Scene_Skill.
 *   - %1 - TP Text
 * 
 *   TP Mode Icon:
 *   - Icon used for TP Mode shown in Scene_Skill.
 * 
 *   Background Type:
 *   - Select background type for this window.
 *     - 0 - Window
 *     - 1 - Dim
 *     - 2 - Transparent
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: TP Modes
 * ============================================================================
 *
 * TP Modes are the TP settings that an actor or enemy has. TP Modes regulate
 * how TP is earned as well as the maximum TP value the actor/enemy can have.
 * Players can switch between TP Modes if granted the option, too.
 *
 * TP Modes can be added, removed, and editted by you the game dev. Each TP
 * Mode will have the following Plugin Parameters for you to adjust:
 *
 * ---
 *
 * General
 * 
 *   TP Mode Name:
 *   - The name for this TP Mode.
 *   - Used for notetag reference.
 * 
 *   Icon:
 *   - Icon used for this TP Mode.
 * 
 *   Help:
 *   - Help description used for this TP Mode.
 *   - %1 - In-game TP vocabulary.
 * 
 *   MaxTP Formula:
 *   - What's the MaxTP for this TP Mode?
 * 
 *   TCR Multiplier:
 *   - Multiplier on how much TP is earned.
 *   - Stacks multiplicatively with TCR.
 * 
 *   Preserve TP?:
 *   - If preserved, carry TP to the next battle.
 *   - If not, TP resets each battle.
 *
 * ---
 * 
 * Gauge
 * 
 *   Flash Gauge?:
 *   - Let this gauge flash once it reaches a certain percentage value.
 *   - Requires VisuMZ_1_SkillsStatesCore!
 * 
 *   Required Rate:
 *   - What rate does this gauge need to be over in order for it to flash?
 * 
 *   Flash Speed:
 *   - How fast should the gauge flash different colors?
 *   - Lower numbers are slower. Higher numbers are faster.
 * 
 *   Color Lightness:
 *   - How light should the flash color be?
 *   - Lower numbers are darker. Higher numbers are lighter.
 * 
 *   Custom Label:
 *   - Instead of displaying "TP", what label do you want to display here?
 *   - Leave empty to keep using "TP".
 *   - This applies to gauges only. This does NOT change the way TP costs are
 *     displayed in the skill windows.
 * 
 *   Custom Color 1:
 *   Custom Color 2:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *   - Empty for default colors.
 *   - This applies to gauges only. This does NOT change the way TP costs are
 *     displayed in the skill windows.
 * 
 * ---
 *
 * TP Formulas > Generic
 * 
 *   Initial TP:
 *   - How much TP is gained at the start of battle?
 * 
 *   Critical Hit:
 *   - How much TP is gained when landing a critical hit?
 * 
 *   Evasion:
 *   - How much TP is gained when evading an action?
 * 
 *   Use Item:
 *   - How much TP is gained when using an item in battle?
 * 
 *   Use Skill:
 *   - How much TP is gained when using a skill in battle that isn't
 *     Attack or Guard?
 *
 * ---
 *
 * TP Formulas > During Regen
 * 
 *   TP Regen:
 *   - How much TP is gained each turn during regeneration?
 * 
 *   Critical HP:
 *   - How much TP is gained when user is in critical HP (25%)
 *     during regeneration.
 * 
 *   Full HP:
 *   - How much TP is gained when user has full HP
 *     during regeneration.
 * 
 *   Critical MP:
 *   - How much TP is gained when user is in critical MP (25%)
 *     during regeneration.
 * 
 *   Full MP:
 *   - How much TP is gained when user has full MP
 *     during regeneration.
 * 
 *   Only Member:
 *   - How much TP is gained when user is the only alive party member
 *     during regeneration.
 *
 * ---
 *
 * TP Formulas > HP Damage
 * 
 *   Take HP Damage:
 *   - How much TP is gained when receiving HP damage?
 *   - Damage value is stored in 'value' variable.
 * 
 *   Deal HP Damage:
 *   - How much TP is gained when dealing HP damage?
 *   - Damage value is stored in 'value' variable.
 * 
 *   Ally HP Damage:
 *   - How much TP is gained when an ally receives HP damage?
 *   - Damage value is stored in 'value' variable.
 *
 * ---
 *
 * TP Formulas > HP Heal
 * 
 *   Take HP Heal:
 *   - How much TP is gained when receiving HP heals?
 *   - Heal value is stored in 'value' variable.
 * 
 *   Deal HP Heal:
 *   - How much TP is gained when dealing HP heals?
 *   - Heal value is stored in 'value' variable.
 * 
 *   Ally HP Heal:
 *   - How much TP is gained when an ally receives HP heals?
 *   - Damage value is stored in 'value' variable.
 *
 * ---
 *
 * TP Formulas > MP Damage
 * 
 *   Take MP Damage:
 *   - How much TP is gained when receiving MP damage?
 *   - Damage value is stored in 'value' variable.
 * 
 *   Deal MP Damage:
 *   - How much TP is gained when dealing MP damage?
 *   - Damage value is stored in 'value' variable.
 * 
 *   Ally MP Damage:
 *   - How much TP is gained when an ally receives MP damage?
 *   - Damage value is stored in 'value' variable.
 *
 * ---
 *
 * TP Formulas > MP Heal
 * 
 *   Take MP Heal:
 *   - How much TP is gained when receiving MP heals?
 *   - Heal value is stored in 'value' variable.
 * 
 *   Deal MP Heal:
 *   - How much TP is gained when dealing MP heals?
 *   - Heal value is stored in 'value' variable.
 * 
 *   Ally MP Heal:
 *   - How much TP is gained when an ally receives MP heals?
 *   - Damage value is stored in 'value' variable.
 *
 * ---
 *
 * TP Formulas > Buffs
 * 
 *   Deal Ally Buff:
 *   - How much TP is gained when user inflicts a buff on an ally through an
 *     Item/Skill Effect (code does not count).
 * 
 *   Deal Enemy Buff:
 *   - How much TP is gained when user inflicts a buff on an enemy through an
 *     Item/Skill Effect (code does not count).
 * 
 *   Gain Ally Buff:
 *   - How much TP is gained when user gains a buff from an ally through an
 *     Item/Skill Effect (code does not count).
 * 
 *   Gain Enemy Buff:
 *   - How much TP is gained when user gains a buff from an enemy through an
 *     Item/Skill Effect (code does not count).
 *
 * ---
 *
 * TP Formulas > Debuffs
 * 
 *   Deal Ally Debuff:
 *   - How much TP is gained when user inflicts a debuff on an ally through an
 *     Item/Skill Effect (code does not count).
 * 
 *   Deal Enemy Debuff:
 *   - How much TP is gained when user inflicts a debuff on an enemy through
 *     an Item/Skill Effect (code does not count).
 * 
 *   Gain Ally Debuff:
 *   - How much TP is gained when user gains a debuff from an ally through an
 *     Item/Skill Effect (code does not count).
 * 
 *   Gain Enemy Debuff:
 *   - How much TP is gained when user gains a debuff from an enemy through an
 *     Item/Skill Effect (code does not count).
 *
 * ---
 *
 * TP Formulas > States
 * 
 *   Deal Ally State:
 *   - How much TP is gained when user inflicts a state on an ally through an
 *     Item/Skill Effect (code does not count).
 * 
 *   Deal Enemy State:
 *   - How much TP is gained when user inflicts a state on an enemy through an
 *     Item/Skill Effect (code does not count).
 * 
 *   Gain Ally State:
 *   - How much TP is gained when user gains a state from an ally through an
 *     Item/Skill Effect (code does not count).
 * 
 *   Gain Enemy State:
 *   - How much TP is gained when user gains a state from an enemy through an
 *     Item/Skill Effect (code does not count).
 *
 * ---
 *
 * TP Formulas > Death
 * 
 *   Ally Death:
 *   - How much TP is gained when an allied member dies.
 *   - Does not matter who the killer is.
 * 
 *   Enemy Death:
 *   - How much TP is gained when an enemy member dies.
 *   - Does not matter who the killer is.
 *
 * ---
 *
 * TP Formulas > Battle
 * 
 *   Win Battle:
 *   - How much TP is gained when the player wins a battle.
 * 
 *   Flee Battle:
 *   - How much TP is gained when the player escapes a battle.
 * 
 *   Lose Battle:
 *   - How much TP is gained when the player loses a battle.
 *
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 * 
 * 7. If this VisuStella MZ plugin is a paid product, all project team members
 * must purchase their own individual copies of the paid product if they are to
 * use it. Usage includes working on related game mechanics, managing related
 * code, and/or using related Plugin Commands and features. Redistribution of
 * the plugin and/or its code to other members of the team is NOT allowed
 * unless they own the plugin itself as that conflicts with Article 4.
 * 
 * 8. Any extensions and/or addendums made to this plugin's Terms of Use can be
 * found on VisuStella.com and must be followed.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * * Yanfly
 * * Arisu
 * * Olivia
 * * Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.06: February 12, 2021
 * * Feature Update!
 * ** <Force TP Mode: name> notetag is now updated to be enforced outside of
 *    battle as well. Update made by Olivia.
 * 
 * Version 1.05: January 22, 2021
 * * Documentation Update!
 * ** Add notes to the "Custom Label" and "Custom Color" Plugin Parameters:
 * *** This applies to gauges only. This does NOT change the way TP costs are
 *     displayed in the skill windows.
 * 
 * Version 1.04: January 15, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Parameters added
 * *** Plugin Parameters > General Settings > Background Type
 * 
 * Version 1.03: December 4, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New plugin parameters added by Arisu:
 * *** Custom Label
 * **** Instead of displaying "TP", what label do you want to display here?
 *      Leave empty to keep using "TP".
 * *** Custom Color 1, Custom Color 2
 * **** Use #rrggbb for custom colors or regular numbers for text colors from
 *      the Window Skin. Empty for default colors.
 * *** These plugin parameters are added onto TP Modes.
 * 
 * Version 1.02: November 8, 2020
 * * Bug Fixes!
 * ** Turning off Preserve TP will no longer generate random amounts of TP at
 *    the start of battle. Fix made by Arisu.
 * 
 * Version 1.01: November 1, 2020
 * * Bug Fixes!
 * ** Skill & States Core is no longer a dependency for Enhanced TP System.
 *    Fix made by Olivia.
 *
 * Version 1.00: October 26, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActorChangeTPMode
 * @text Actor: Change TP Mode
 * @desc Changes target actor(s) TP Mode.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which actor(s) to affect.
 * @default ["1"]
 *
 * @arg TPModeName:str
 * @text TP Mode Name
 * @desc Change to this TP Mode for selected actor(s).
 * @default Stoic
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActorUnlockTPMode
 * @text Actor: Unlock TP Mode
 * @desc Unlocks TP Modes for target actor(s).
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which actor(s) to affect.
 * @default ["1"]
 *
 * @arg TPModes:arraystr
 * @text TP Modes
 * @type string[]
 * @desc Change to this TP Mode for selected actor(s).
 * @default ["Stoic","Comrade","Warrior","Healer"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActorUnlockAllTPModes
 * @text Actor: Unlock All TP Modes
 * @desc Unlocks all TP Modes for target actor(s).
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which actor(s) to affect.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command EnemyChangeTPMode
 * @text Enemy: Change TP Mode
 * @desc Changes target enemy(ies) TP Mode.
 *
 * @arg Enemies:arraynum
 * @text Enemy Index(es)
 * @type number[]
 * @min 0
 * @desc Select which enemy(ies) to affect.
 * @default ["0"]
 *
 * @arg TPModeName:str
 * @text TP Mode Name
 * @desc Change to this TP Mode for selected enemy(ies).
 * @default Stoic
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SceneSkillTpMode
 * @text System: Show/Hide TP Mode
 * @desc Shows/Hides TP Mode from Scene_Skill.
 *
 * @arg Show:eval
 * @text Show TP Mode?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Shows/Hides TP Mode in Scene_Skill.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param EnhancedTP
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param General:struct
 * @text General Settings
 * @type struct<General>
 * @desc General settings pertaining to TP.
 * @default {"Defaults":"","DefaultTpMode:str":"Stoic","GlobalTPModes:arraystr":"[\"Stoic\",\"Comrade\",\"Warrior\",\"Healer\"]","SceneSkill":"","ShowTpMode:eval":"true","TpModeCmdName:str":"%1 Mode","TpModeIcon:num":"164"}
 *
 * @param TpMode:arraystruct
 * @text TP Modes
 * @type struct<TpMode>[]
 * @desc TP Modes available in the game.
 * @default ["{\"Name:str\":\"Stoic\",\"Icon:num\":\"78\",\"Help:json\":\"\\\"Raise %1 when receiving damage.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"50 * (value / user.mhp) * user.tcr\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Comrade\",\"Icon:num\":\"76\",\"Help:json\":\"\\\"Raise %1 whenever allies take damage.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"20 * user.tcr\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Warrior\",\"Icon:num\":\"77\",\"Help:json\":\"\\\"Raise %1 by attacking and dealing HP damage.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"Math.min(16, value * 100 / target.mhp) * user.tcr\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Healer\",\"Icon:num\":\"72\",\"Help:json\":\"\\\"Raise %1 by healing HP.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"Math.min(16, value * 100 / target.mhp) * user.tcr\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Breaker\",\"Icon:num\":\"171\",\"Help:json\":\"\\\"Raise %1 whenever user deals MP damage\\\\nor receives MP damage.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"50 * (value / Math.max(1, this.mmp)) * user.tcr\",\"DealMpDmg:str\":\"Math.min(16, value / 4) * user.tcr\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Battery\",\"Icon:num\":\"165\",\"Help:json\":\"\\\"Raise %1 whenever use helps an ally restore MP.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"Math.min(16, value / 4) * user.tcr\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Slayer\",\"Icon:num\":\"1\",\"Help:json\":\"\\\"Raise %1 whenever an enemy is killed.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"25 * user.tcr\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Avenger\",\"Icon:num\":\"17\",\"Help:json\":\"\\\"Raise %1 whenever an ally is killed.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"50 * user.tcr\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Winner\",\"Icon:num\":\"87\",\"Help:json\":\"\\\"Raise %1 whenever your party wins a battle.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"20 * user.tcr\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Coward\",\"Icon:num\":\"89\",\"Help:json\":\"\\\"Raise %1 whenever your party escapes from battle\\\\nor loses a battle.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"20 * user.tcr\",\"LoseBattle:str\":\"20 * user.tcr\"}","{\"Name:str\":\"Cautious\",\"Icon:num\":\"32\",\"Help:json\":\"\\\"Raise %1 whenever user ends a turn with full HP.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"10 * user.tcr\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Thrifty\",\"Icon:num\":\"33\",\"Help:json\":\"\\\"Raise %1 whenever user ends a turn with full MP.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"10 * user.tcr\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Daredevil\",\"Icon:num\":\"48\",\"Help:json\":\"\\\"Raise %1 whenever user ends a turn with low HP.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"16 * user.tcr\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Splurger\",\"Icon:num\":\"49\",\"Help:json\":\"\\\"Raise %1 whenever user ends a turn with low MP.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"16 * user.tcr\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Caster\",\"Icon:num\":\"79\",\"Help:json\":\"\\\"Raise %1 whenever user performs a skill.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"16 * user.tcr\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Alchemist\",\"Icon:num\":\"176\",\"Help:json\":\"\\\"Raise %1 whenever user uses an item.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"16 * user.tcr\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Enchanter\",\"Icon:num\":\"73\",\"Help:json\":\"\\\"Gains %1 TP whenever user applies a buff\\\\nor status effect to an ally.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"16 * user.tcr\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"16 * user.tcr\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Tactician\",\"Icon:num\":\"74\",\"Help:json\":\"\\\"Gains %1 TP whenever user applies a debuff\\\\nor status effect to a foe.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"16 * user.tcr\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"16 * user.tcr\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Boosted\",\"Icon:num\":\"84\",\"Help:json\":\"\\\"Raise %1 whenever user receives a buff or\\\\nstatus effect from an ally.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"16 * user.tcr\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"16 * user.tcr\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Sufferer\",\"Icon:num\":\"2\",\"Help:json\":\"\\\"Raise %1 whenever user receives a debuff or\\\\nstatus effect from a foe.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"16 * user.tcr\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"16 * user.tcr\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Striker\",\"Icon:num\":\"78\",\"Help:json\":\"\\\"Raise %1 whenever user lands a critical hit.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"16 * user.tcr\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Dancer\",\"Icon:num\":\"82\",\"Help:json\":\"\\\"Raise %1 whenever user evades an attack.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"16 * user.tcr\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Loner\",\"Icon:num\":\"166\",\"Help:json\":\"\\\"Raise %1 whenever user ends a turn as the\\\\nlast remaining alive member.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"16 * user.tcr\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Initiator\",\"Icon:num\":\"164\",\"Help:json\":\"\\\"User gains %1 at the start of battle.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"20 * user.tcr\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Charger\",\"Icon:num\":\"311\",\"Help:json\":\"\\\"User loses all %1 at the start of battle but\\\\ngains more each passing turn.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"-1 * user.maxTp()\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"2 ** user.turnCount() * user.tcr\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Berserker\",\"Icon:num\":\"5\",\"Help:json\":\"\\\"User starts with full %1 at the start of battle,\\\\nbut loses 20 %1 each passing turn.\\\"\",\"MaxFormula:str\":\"100\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"user.maxTp()\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"-20\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Maximizer\",\"Icon:num\":\"239\",\"Help:json\":\"\\\"User's Max%1 is raised to 300 gains %1 from\\\\ndealing/receiving HP damage at a slower rate.\\\"\",\"MaxFormula:str\":\"300\",\"MultiplierTCR:num\":\"0.5\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"50 * (value / user.mhp) * user.tcr\",\"DealHpHeal:str\":\"Math.min(16, value * 100 / target.mhp) * user.tcr\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Minimizer\",\"Icon:num\":\"236\",\"Help:json\":\"\\\"User's Max%1 is lowered to 50 gains %1 from\\\\ndealing/receiving HP damage at a faster rate.\\\"\",\"MaxFormula:str\":\"50\",\"MultiplierTCR:num\":\"2.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"0\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"50 * (value / user.mhp) * user.tcr\",\"DealHpHeal:str\":\"Math.min(16, value * 100 / target.mhp) * user.tcr\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Recycler\",\"Icon:num\":\"75\",\"Help:json\":\"\\\"User's Max%1 becomes 20. User starts with 20 %1\\\\nand regenerates 20 %1 each turn.\\\"\",\"MaxFormula:str\":\"20\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"20\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"20\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"0\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"0\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}","{\"Name:str\":\"Assassin\",\"Icon:num\":\"10\",\"Help:json\":\"\\\"User's Max%1 becomes 500. User starts with 500 %1,\\\\nbut receiving healing or damage halves user's %1.\\\"\",\"MaxFormula:str\":\"500\",\"MultiplierTCR:num\":\"1.0\",\"Preserve:eval\":\"true\",\"Gauge\":\"\",\"FlashGauge:eval\":\"true\",\"FlashRequirement:num\":\"1.0\",\"FlashSpeed:num\":\"16\",\"FlashLightness:num\":\"160\",\"Formulas\":\"\",\"Generic\":\"\",\"Initial:str\":\"500\",\"CriticalHit:str\":\"0\",\"Evasion:str\":\"0\",\"UseItem:str\":\"0\",\"UseSkill:str\":\"0\",\"Regen\":\"\",\"TpRegen:str\":\"0\",\"CriticalHp:str\":\"0\",\"FullHp:str\":\"0\",\"CriticalMp:str\":\"0\",\"FullMp:str\":\"0\",\"OnlyMember:str\":\"0\",\"HPDmg\":\"\",\"TakeHpDmg:str\":\"user.tp / -2\",\"DealHpDmg:str\":\"0\",\"AllyHpDmg:str\":\"0\",\"HPHeal\":\"\",\"TakeHpHeal:str\":\"user.tp / -2\",\"DealHpHeal:str\":\"0\",\"AllyHpHeal:str\":\"0\",\"MPDmg\":\"\",\"TakeMpDmg:str\":\"0\",\"DealMpDmg:str\":\"0\",\"AllyMpDmg:str\":\"0\",\"MPHeal\":\"\",\"TakeMpHeal:str\":\"0\",\"DealMpHeal:str\":\"0\",\"AllyMpHeal:str\":\"0\",\"Buffs\":\"\",\"DealAllyBuff:str\":\"0\",\"DealEnemyBuff:str\":\"0\",\"GainAllyBuff:str\":\"0\",\"GainEnemyBuff:str\":\"0\",\"Debuffs\":\"\",\"DealAllyDebuff:str\":\"0\",\"DealEnemyDebuff:str\":\"0\",\"GainAllyDebuff:str\":\"0\",\"GainEnemyDebuff:str\":\"0\",\"States\":\"\",\"DealAllyState:str\":\"0\",\"DealEnemyState:str\":\"0\",\"GainAllyState:str\":\"0\",\"GainEnemyState:str\":\"0\",\"Death\":\"\",\"KillAlly:str\":\"0\",\"KillEnemy:str\":\"0\",\"Battle\":\"\",\"WinBattle:str\":\"0\",\"FleeBattle:str\":\"0\",\"LoseBattle:str\":\"0\"}"]
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
/* ----------------------------------------------------------------------------
 * General Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~General:
 *
 * @param Defaults
 *
 * @param DefaultTpMode:str
 * @text Default TP Mode
 * @parent Defaults
 * @desc Which TP mode should actors and enemies have by default?
 * @default Stoic
 *
 * @param GlobalTPModes:arraystr
 * @text Global TP Modes
 * @type string[]
 * @parent Defaults
 * @desc TP Modes available to the all actors to pick from.
 * @default ["Stoic","Comrade","Warrior","Healer"]
 *
 * @param SceneSkill
 * @text Scene_Skill
 *
 * @param ShowTpMode:eval
 * @text Show TP Mode?
 * @parent SceneSkill
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show TP Mode in Scene_Skill by default?
 * @default true
 *
 * @param TpModeCmdName:str 
 * @text TP Mode Command
 * @parent SceneSkill
 * @desc The command name format shown in Scene_Skill.
 * %1 - TP Text
 * @default %1 Mode
 *
 * @param TpModeIcon:num
 * @text TP Mode Icon
 * @parent SceneSkill
 * @desc Icon used for TP Mode shown in Scene_Skill.
 * @default 164
 *
 * @param TpWindowBgType:num
 * @text Background Type
 * @parent SceneSkill
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 */
/* ----------------------------------------------------------------------------
 * TP Modes
 * ----------------------------------------------------------------------------
 */
/*~struct~TpMode:
 *
 * @param Name:str 
 * @text TP Mode Name
 * @desc The name for this TP Mode.
 * Used for notetag reference.
 * @default Untitled
 *
 * @param Icon:num
 * @text Icon
 * @parent Name:str
 * @desc Icon used for this TP Mode.
 * @default 160
 *
 * @param Help:json
 * @text Help
 * @parent Name:str
 * @type note
 * @desc Help description used for this TP Mode.
 * %1 - In-game TP vocabulary.
 * @default "Help Line 1\nHelp Line 2"
 *
 * @param MaxFormula:str
 * @text MaxTP Formula
 * @parent Name:str
 * @desc What's the MaxTP for this TP Mode?
 * @default 100
 *
 * @param MultiplierTCR:num
 * @text TCR Multiplier
 * @parent Name:str
 * @desc Multiplier on how much TP is earned.
 * Stacks multiplicatively with TCR.
 * @default 1.0
 *
 * @param Preserve:eval
 * @text Preserve TP?
 * @parent Name:str
 * @type boolean
 * @on Preserve
 * @off Don't
 * @desc If preserved, carry TP to the next battle.
 * If not, TP resets each battle.
 * @default true
 *
 * @param Gauge
 *
 * @param FlashGauge:eval
 * @text Flash Gauge?
 * @parent Gauge
 * @type boolean
 * @on Flash
 * @off Don't Flash
 * @desc Let this gauge flash once it reaches a certain percentage 
 * value. Requires VisuMZ_1_SkillsStatesCore!
 * @default true
 *
 * @param FlashRequirement:num
 * @text Required Rate
 * @parent Gauge
 * @desc What rate does this gauge need to be over in order for it to flash?
 * @default 1.0
 *
 * @param FlashSpeed:num
 * @text Flash Speed
 * @parent Gauge
 * @type number
 * @min 1
 * @max 255
 * @desc How fast should the gauge flash different colors?
 * Lower numbers are slower. Higher numbers are faster.
 * @default 16
 *
 * @param FlashLightness:num
 * @text Color Lightness
 * @parent Gauge
 * @type number
 * @min 0
 * @max 255
 * @desc How light should the flash color be?
 * Lower numbers are darker. Higher numbers are lighter.
 * @default 160
 *
 * @param CustomLabel:str
 * @text Custom Label
 * @parent Gauge
 * @desc Instead of displaying "TP", what label do you want
 * to display here? Leave empty to keep using "TP".
 * @default 
 *
 * @param CustomColor1:str
 * @text Custom Color 1
 * @parent Gauge
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin. Empty for default.
 * @default 
 *
 * @param CustomColor2:str
 * @text Custom Color 2
 * @parent Gauge
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin. Empty for default.
 * @default 
 *
 * @param Formulas
 * @text TP Formulas
 *
 * @param Generic
 * @parent Formulas
 *
 * @param Initial:str
 * @text Initial TP
 * @parent Generic
 * @desc How much TP is gained at the start of battle?
 * @default 0
 *
 * @param CriticalHit:str
 * @text Critical Hit
 * @parent Generic
 * @desc How much TP is gained when landing a critical hit?
 * @default 0
 *
 * @param Evasion:str
 * @text Evasion
 * @parent Generic
 * @desc How much TP is gained when evading an action?
 * @default 0
 *
 * @param UseItem:str
 * @text Use Item
 * @parent Generic
 * @desc How much TP is gained when using an item in battle?
 * @default 0
 *
 * @param UseSkill:str
 * @text Use Skill
 * @parent Generic
 * @desc How much TP is gained when using a skill in battle that isn't Attack or Guard?
 * @default 0
 *
 * @param Regen
 * @text During Regen
 * @parent Formulas
 *
 * @param TpRegen:str
 * @text TP Regen
 * @parent Regen
 * @desc How much TP is gained each turn during regeneration?
 * @default 0
 *
 * @param CriticalHp:str
 * @text Critical HP
 * @parent Regen
 * @desc How much TP is gained when user is in critical HP (25%)
 * during regeneration.
 * @default 0
 *
 * @param FullHp:str
 * @text Full HP
 * @parent Regen
 * @desc How much TP is gained when user has full HP
 * during regeneration.
 * @default 0
 *
 * @param CriticalMp:str
 * @text Critical MP
 * @parent Regen
 * @desc How much TP is gained when user is in critical MP (25%)
 * during regeneration.
 * @default 0
 *
 * @param FullMp:str
 * @text Full MP
 * @parent Regen
 * @desc How much TP is gained when user has full MP
 * during regeneration.
 * @default 0
 *
 * @param OnlyMember:str
 * @text Only Member
 * @parent Regen
 * @desc How much TP is gained when user is the only alive party member during regeneration.
 * @default 0
 *
 * @param HPDmg
 * @text HP Damage
 * @parent Formulas
 *
 * @param TakeHpDmg:str
 * @text Take HP Damage
 * @parent HPDmg
 * @desc How much TP is gained when receiving HP damage?
 * Damage value is stored in 'value' variable.
 * @default 0
 *
 * @param DealHpDmg:str
 * @text Deal HP Damage
 * @parent HPDmg
 * @desc How much TP is gained when dealing HP damage?
 * Damage value is stored in 'value' variable.
 * @default 0
 *
 * @param AllyHpDmg:str
 * @text Ally HP Damage
 * @parent HPDmg
 * @desc How much TP is gained when an ally receives HP damage?
 * Damage value is stored in 'value' variable.
 * @default 0
 *
 * @param HPHeal
 * @text HP Heal
 * @parent Formulas
 *
 * @param TakeHpHeal:str
 * @text Take HP Heal
 * @parent HPHeal
 * @desc How much TP is gained when receiving HP heals?
 * Heal value is stored in 'value' variable.
 * @default 0
 *
 * @param DealHpHeal:str
 * @text Deal HP Heal
 * @parent HPHeal
 * @desc How much TP is gained when dealing HP heals?
 * Heal value is stored in 'value' variable.
 * @default 0
 *
 * @param AllyHpHeal:str
 * @text Ally HP Heal
 * @parent HPHeal
 * @desc How much TP is gained when an ally receives HP heals?
 * Damage value is stored in 'value' variable.
 * @default 0
 *
 * @param MPDmg
 * @text MP Damage
 * @parent Formulas
 *
 * @param TakeMpDmg:str
 * @text Take MP Damage
 * @parent MPDmg
 * @desc How much TP is gained when receiving MP damage?
 * Damage value is stored in 'value' variable.
 * @default 0
 *
 * @param DealMpDmg:str
 * @text Deal MP Damage
 * @parent MPDmg
 * @desc How much TP is gained when dealing MP damage?
 * Damage value is stored in 'value' variable.
 * @default 0
 *
 * @param AllyMpDmg:str
 * @text Ally MP Damage
 * @parent MPDmg
 * @desc How much TP is gained when an ally receives MP damage?
 * Damage value is stored in 'value' variable.
 * @default 0
 *
 * @param MPHeal
 * @text MP Heal
 * @parent Formulas
 *
 * @param TakeMpHeal:str
 * @text Take MP Heal
 * @parent MPHeal
 * @desc How much TP is gained when receiving MP heals?
 * Heal value is stored in 'value' variable.
 * @default 0
 *
 * @param DealMpHeal:str
 * @text Deal MP Heal
 * @parent MPHeal
 * @desc How much TP is gained when dealing MP heals?
 * Heal value is stored in 'value' variable.
 * @default 0
 *
 * @param AllyMpHeal:str
 * @text Ally MP Heal
 * @parent MPHeal
 * @desc How much TP is gained when an ally receives MP heals?
 * Damage value is stored in 'value' variable.
 * @default 0
 *
 * @param Buffs
 * @parent Formulas
 *
 * @param DealAllyBuff:str
 * @text Deal Ally Buff
 * @parent Buffs
 * @desc How much TP is gained when user inflicts a buff on an
 * ally through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param DealEnemyBuff:str
 * @text Deal Enemy Buff
 * @parent Buffs
 * @desc How much TP is gained when user inflicts a buff on an
 * enemy through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param GainAllyBuff:str
 * @text Gain Ally Buff
 * @parent Buffs
 * @desc How much TP is gained when user gains a buff from an
 * ally through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param GainEnemyBuff:str
 * @text Gain Enemy Buff
 * @parent Buffs
 * @desc How much TP is gained when user gains a buff from an
 * enemy through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param Debuffs
 * @parent Formulas
 *
 * @param DealAllyDebuff:str
 * @text Deal Ally Debuff
 * @parent Debuffs
 * @desc How much TP is gained when user inflicts a debuff on an
 * ally through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param DealEnemyDebuff:str
 * @text Deal Enemy Debuff
 * @parent Debuffs
 * @desc How much TP is gained when user inflicts a debuff on an
 * enemy through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param GainAllyDebuff:str
 * @text Gain Ally Debuff
 * @parent Debuffs
 * @desc How much TP is gained when user gains a debuff from an
 * ally through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param GainEnemyDebuff:str
 * @text Gain Enemy Debuff
 * @parent Debuffs
 * @desc How much TP is gained when user gains a debuff from an
 * enemy through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param States
 * @parent Formulas
 *
 * @param DealAllyState:str
 * @text Deal Ally State
 * @parent States
 * @desc How much TP is gained when user inflicts a state on an
 * ally through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param DealEnemyState:str
 * @text Deal Enemy State
 * @parent States
 * @desc How much TP is gained when user inflicts a state on an
 * enemy through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param GainAllyState:str
 * @text Gain Ally State
 * @parent States
 * @desc How much TP is gained when user gains a state from an
 * ally through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param GainEnemyState:str
 * @text Gain Enemy State
 * @parent States
 * @desc How much TP is gained when user gains a state from an
 * enemy through an Item/Skill Effect (code does not count).
 * @default 0
 *
 * @param Death
 * @parent Formulas
 *
 * @param KillAlly:str
 * @text Ally Death
 * @parent Death
 * @desc How much TP is gained when an allied member dies.
 * Does not matter who the killer is.
 * @default 0
 *
 * @param KillEnemy:str
 * @text Enemy Death
 * @parent Death
 * @desc How much TP is gained when an enemy member dies.
 * Does not matter who the killer is.
 * @default 0
 *
 * @param Battle
 * @parent Formulas
 *
 * @param WinBattle:str
 * @text Win Battle
 * @parent Battle
 * @desc How much TP is gained when the player wins a battle.
 * @default 0
 *
 * @param FleeBattle:str
 * @text Flee Battle
 * @parent Battle
 * @desc How much TP is gained when the player escapes a battle.
 * @default 0
 *
 * @param LoseBattle:str
 * @text Lose Battle
 * @parent Battle
 * @desc How much TP is gained when the player loses a battle.
 * @default 0
 *
 */
//=============================================================================

const _0x5cea=['description','DealMpDmg','tpMode','2408074gMbyPb','TpModeIcon','FullMp','setStypeId','parameters','Scene_Boot_onDatabaseLoaded','Window_SkillType_makeCommandList','DealHpHeal','TakeMpDmg','activate','tpRate','Scene_Skill_createSkillTypeWindow','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','243660LdQPYG','registerCommand','CriticalHp','_cache','CustomColor%1','friendsUnit','convertEnhancedTpFunctions','AllyHpDmg','Game_Actor_learnSkill','onTpModeCancel','boxWidth','changeBattlerTpLabel','addChild','TakeHpDmg','return\x200','updateEnhancedTp','ShowTpMode','Game_System_initialize','FullHp','tpGaugeFlashSpeed','missed','refresh','deselect','838YDtmpP','setFrame','DealAllyState','createTpGaugeBitmaps','#%1','Game_Action_itemEffectAddBuff','Icon','_actor','Settings','setHandler','clamp','height','itemEffectAddBuff','171561AVTfQN','setHelpWindow','opponentsUnit','isTpGaugeFlashing','itemEffectAddDebuff','Sprite_Gauge_update','FleeBattle','setHelpWindowItem','isActor','isItem','LoseBattle','match','changeTpCustomColor','createTpModeWindow','TakeMpHeal','learnTpMode','_battler','ARRAYJSON','DealEnemyBuff','OnlyMember','ActorUnlockTPMode','244ULNAsJ','TpModeOrder','_tpModeWindow','enemy','chargeTpByDamage','_stypeId','refreshActor','WinBattle','GainAllyState','onDatabaseLoaded','setTpModeInSceneSkill','selectLast','subject','ActorChangeTPMode','Game_Action_itemEffectAddDebuff','applyGlobal','guardSkillId','MultiplierTCR','isDead','critical','_data','FUNC','min','colSpacing','Game_Battler_regenerateTp','tpCostColor','defaultTpMode','commandTpMode','textColor','addTpModeCommand','iconWidth','drawGaugeRectEnhancedTp','Game_Action_executeHpDamage','applyEnhancedTP','skillIsNotAttackGuard','scrollTo','BattleManager_onEscapeSuccess','trg','MaxFormula','Scene_Skill_create','Evasion','TPModeName','tpModesCommandIcon','createSkillTypeWindow','format','%1Func','gainSilentTp','aliveMembers','Game_Party_initialize','cancel','regenerateTp','split','setup','maxTp','create','clear','NUM','changeTpMode','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20user;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20target;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20damage\x20=\x20value;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20heal\x20=\x20value;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20%1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20','Game_Actor_setup','EVAL','GainAllyBuff','process_VisuMZ_EnhancedTP_Settings','mmp','Game_Action_apply','ConvertParams','max','Enemies','showTpModeInSceneSkill','onBattleStart','_tpTextSprite','STRUCT','Game_BattlerBase_isPreserveTp','terms','_tp','push','bitmap','DealMpHeal','item','AllyMpDmg','addState','KillAlly','AllyMpHeal','BattleManager_processDefeat','Sprite_Gauge_drawGaugeRect','attackSkillId','drawText','bind','apply','_tpMode','abs','STR','MaxFormulaFunc','itemLineRect','prototype','Sprite_Gauge_redraw','result','gaugeRate','_availableTpModes','26NipyQG','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','learnSkillEnhancedTP','learnSkill','drawItem','processDefeat','_tpGaugeSprite','gradientFillRect','drawIcon','tpModes','tpGaugeFlashLightness','FlashGauge','Game_Battler_useItem','learnAvailableActorTpModes','useItem','sortTpModes','setHue','Sprite_Gauge_setup','applyItemEnhancedTPEffect','gaugeColor1','length','Game_BattlerBase_sparam','ARRAYEVAL','sparam','itemAt','maxCols','mainAreaHeight','forceSelect','update','Actors','DealAllyDebuff','initialize','_tpModeCache','applyGlobalEnhancedTP','GlobalTPModes','gainTpFromTpMode','index','ARRAYNUM','UseItem','_tpGaugeBack','DealHpDmg','remove','Game_Action_applyGlobal','Scene_Skill_refreshActor','Game_BattlerBase_maxTp','Initial','traitObjects','KillEnemy','CriticalHit','_statusWindow','1dqERRo','_tpModes','itemEffectAddState','DealEnemyDebuff','_skillTypeWindow','Game_Action_itemEffectAddState','VisuMZ_1_SkillsStatesCore','tpModeWindowRect','members','leader','FlashSpeed','width','executeMpDamage','learnAvailablePartyTpModes','drawFullGaugeEnhancedTp','fillRect','call','tpModeValue','519624uniRvE','parse','_statusType','onTpModeOk','redraw','\x5cI[%1]%2','Game_Battler_onBattleStart','GainAllyDebuff','AllyHpHeal','redrawEnhancedTp','name','map','target','applyItemUserEffect','TpModeCmdName','ARRAYSTRUCT','show','toUpperCase','_mp','hide','_hp','ARRAYSTR','EnhancedTP','basic','TpRegen','Name','gaugeBackColor','isPreserveTp','Sprite_Gauge_drawFullGauge','setActor','initEnhancedTP','addWindow','CriticalMp','lineHeight','processVictory','BattleManager_processVictory','GainEnemyDebuff','31565oDfDgM','TpMode','DealEnemyState','actor','FlashRequirement','setBlendColor','_tpMode_SceneSkill','initTpModes','availableTpModes','_helpWindow','trim','mhp','isTpModeCommandVisible','executeHpDamage','TPModes','onChangeTpMode','JSON','getColor','onEscapeSuccess','Game_Battler_addState','setBackgroundType','General','Game_Action_executeMpDamage','note','success','filter','tpModesCommandText','Show','TpModes','TakeHpHeal','isSkill','Window_SkillList_setStypeId','addCommand','exit','makeItemList','542203XSrayQ','UseSkill','initTp','CustomLabel'];const _0x1a99=function(_0x173243,_0x40a27c){_0x173243=_0x173243-0x122;let _0x5ceaa6=_0x5cea[_0x173243];return _0x5ceaa6;};const _0x9762=_0x1a99;(function(_0x1c364b,_0x1a05bf){const _0x39419f=_0x1a99;while(!![]){try{const _0x57cdfc=-parseInt(_0x39419f(0x1fe))+-parseInt(_0x39419f(0x237))*-parseInt(_0x39419f(0x215))+-parseInt(_0x39419f(0x1ea))+-parseInt(_0x39419f(0x1c7))*parseInt(_0x39419f(0x15e))+parseInt(_0x39419f(0x222))+-parseInt(_0x39419f(0x1a2))+-parseInt(_0x39419f(0x190))*-parseInt(_0x39419f(0x1f1));if(_0x57cdfc===_0x1a05bf)break;else _0x1c364b['push'](_0x1c364b['shift']());}catch(_0x43c681){_0x1c364b['push'](_0x1c364b['shift']());}}}(_0x5cea,0xa0a0a));var label=_0x9762(0x1b8),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x9762(0x1e0)](function(_0x100581){return _0x100581['status']&&_0x100581['description']['includes']('['+label+']');})[0x0];VisuMZ[label][_0x9762(0x21d)]=VisuMZ[label][_0x9762(0x21d)]||{},VisuMZ[_0x9762(0x13c)]=function(_0x24230d,_0x2f44c0){const _0x2a0603=_0x9762;for(const _0x21386c in _0x2f44c0){if(_0x21386c[_0x2a0603(0x22d)](/(.*):(.*)/i)){const _0xd5e31b=String(RegExp['$1']),_0x104cfa=String(RegExp['$2'])[_0x2a0603(0x1b3)]()[_0x2a0603(0x1d1)]();let _0x3006be,_0x107ce,_0x3abf90;switch(_0x104cfa){case _0x2a0603(0x133):_0x3006be=_0x2f44c0[_0x21386c]!==''?Number(_0x2f44c0[_0x21386c]):0x0;break;case _0x2a0603(0x183):_0x107ce=_0x2f44c0[_0x21386c]!==''?JSON['parse'](_0x2f44c0[_0x21386c]):[],_0x3006be=_0x107ce[_0x2a0603(0x1ad)](_0x2e7168=>Number(_0x2e7168));break;case _0x2a0603(0x137):_0x3006be=_0x2f44c0[_0x21386c]!==''?eval(_0x2f44c0[_0x21386c]):null;break;case _0x2a0603(0x174):_0x107ce=_0x2f44c0[_0x21386c]!==''?JSON[_0x2a0603(0x1a3)](_0x2f44c0[_0x21386c]):[],_0x3006be=_0x107ce[_0x2a0603(0x1ad)](_0x109100=>eval(_0x109100));break;case _0x2a0603(0x1d7):_0x3006be=_0x2f44c0[_0x21386c]!==''?JSON[_0x2a0603(0x1a3)](_0x2f44c0[_0x21386c]):'';break;case _0x2a0603(0x233):_0x107ce=_0x2f44c0[_0x21386c]!==''?JSON[_0x2a0603(0x1a3)](_0x2f44c0[_0x21386c]):[],_0x3006be=_0x107ce[_0x2a0603(0x1ad)](_0x2d7d95=>JSON[_0x2a0603(0x1a3)](_0x2d7d95));break;case _0x2a0603(0x24c):_0x3006be=_0x2f44c0[_0x21386c]!==''?new Function(JSON[_0x2a0603(0x1a3)](_0x2f44c0[_0x21386c])):new Function(_0x2a0603(0x20c));break;case'ARRAYFUNC':_0x107ce=_0x2f44c0[_0x21386c]!==''?JSON[_0x2a0603(0x1a3)](_0x2f44c0[_0x21386c]):[],_0x3006be=_0x107ce['map'](_0x635d7c=>new Function(JSON[_0x2a0603(0x1a3)](_0x635d7c)));break;case _0x2a0603(0x156):_0x3006be=_0x2f44c0[_0x21386c]!==''?String(_0x2f44c0[_0x21386c]):'';break;case _0x2a0603(0x1b7):_0x107ce=_0x2f44c0[_0x21386c]!==''?JSON[_0x2a0603(0x1a3)](_0x2f44c0[_0x21386c]):[],_0x3006be=_0x107ce['map'](_0x1c131e=>String(_0x1c131e));break;case _0x2a0603(0x142):_0x3abf90=_0x2f44c0[_0x21386c]!==''?JSON[_0x2a0603(0x1a3)](_0x2f44c0[_0x21386c]):{},_0x3006be=VisuMZ[_0x2a0603(0x13c)]({},_0x3abf90);break;case _0x2a0603(0x1b1):_0x107ce=_0x2f44c0[_0x21386c]!==''?JSON[_0x2a0603(0x1a3)](_0x2f44c0[_0x21386c]):[],_0x3006be=_0x107ce[_0x2a0603(0x1ad)](_0x174bf1=>VisuMZ[_0x2a0603(0x13c)]({},JSON[_0x2a0603(0x1a3)](_0x174bf1)));break;default:continue;}_0x24230d[_0xd5e31b]=_0x3006be;}}return _0x24230d;},(_0x33d9cf=>{const _0x4ad225=_0x9762,_0x2538c4=_0x33d9cf[_0x4ad225(0x1ac)];for(const _0x3bd505 of dependencies){if(!Imported[_0x3bd505]){alert('%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.'['format'](_0x2538c4,_0x3bd505)),SceneManager['exit']();break;}}const _0x49b6f5=_0x33d9cf[_0x4ad225(0x1ee)];if(_0x49b6f5[_0x4ad225(0x22d)](/\[Version[ ](.*?)\]/i)){const _0x57c48a=Number(RegExp['$1']);_0x57c48a!==VisuMZ[label]['version']&&(alert(_0x4ad225(0x1fd)[_0x4ad225(0x127)](_0x2538c4,_0x57c48a)),SceneManager[_0x4ad225(0x1e8)]());}if(_0x49b6f5[_0x4ad225(0x22d)](/\[Tier[ ](\d+)\]/i)){const _0x50c609=Number(RegExp['$1']);_0x50c609<tier?(alert(_0x4ad225(0x15f)[_0x4ad225(0x127)](_0x2538c4,_0x50c609,tier)),SceneManager['exit']()):tier=Math[_0x4ad225(0x13d)](_0x50c609,tier);}VisuMZ[_0x4ad225(0x13c)](VisuMZ[label][_0x4ad225(0x21d)],_0x33d9cf[_0x4ad225(0x1f5)]);})(pluginData),PluginManager[_0x9762(0x1ff)](pluginData[_0x9762(0x1ac)],_0x9762(0x244),_0x1e6fc1=>{const _0x2901cf=_0x9762;VisuMZ[_0x2901cf(0x13c)](_0x1e6fc1,_0x1e6fc1);const _0x58f988=_0x1e6fc1['Actors'][_0x2901cf(0x1ad)](_0x14ab22=>$gameActors['actor'](_0x14ab22))[_0x2901cf(0x187)](null),_0x43bc1b=_0x1e6fc1[_0x2901cf(0x124)];for(const _0x1875dc of _0x58f988){if(!_0x1875dc)continue;_0x1875dc['changeTpMode'](_0x43bc1b);}}),PluginManager[_0x9762(0x1ff)](pluginData['name'],_0x9762(0x236),_0x3f7a09=>{const _0x59390f=_0x9762;VisuMZ[_0x59390f(0x13c)](_0x3f7a09,_0x3f7a09);const _0x118ebf=_0x3f7a09[_0x59390f(0x17b)][_0x59390f(0x1ad)](_0x196565=>$gameActors['actor'](_0x196565))[_0x59390f(0x187)](null),_0x1373d1=_0x3f7a09[_0x59390f(0x1d5)];for(const _0x1d327d of _0x118ebf){if(!_0x1d327d)continue;for(const _0x35421f of _0x1373d1){_0x1d327d['learnTpMode'](_0x35421f);}}}),PluginManager[_0x9762(0x1ff)](pluginData[_0x9762(0x1ac)],'ActorUnlockAllTPModes',_0x1da067=>{const _0x34302d=_0x9762;VisuMZ[_0x34302d(0x13c)](_0x1da067,_0x1da067);const _0x3b43a8=_0x1da067[_0x34302d(0x17b)][_0x34302d(0x1ad)](_0x355937=>$gameActors[_0x34302d(0x1ca)](_0x355937))[_0x34302d(0x187)](null),_0x37dac1=VisuMZ[_0x34302d(0x1b8)][_0x34302d(0x238)];for(const _0x194a9d of _0x3b43a8){if(!_0x194a9d)continue;for(const _0x26d1f1 of _0x37dac1){_0x194a9d[_0x34302d(0x231)](_0x26d1f1);}}}),PluginManager[_0x9762(0x1ff)](pluginData[_0x9762(0x1ac)],'EnemyChangeTPMode',_0x50b4ed=>{const _0x1f1a7a=_0x9762;VisuMZ[_0x1f1a7a(0x13c)](_0x50b4ed,_0x50b4ed);const _0x9b197d=_0x50b4ed[_0x1f1a7a(0x13e)]['map'](_0x4b0b19=>$gameTroop[_0x1f1a7a(0x198)]()[_0x4b0b19])[_0x1f1a7a(0x187)](null),_0x38bd8b=_0x50b4ed[_0x1f1a7a(0x124)];for(const _0x312553 of _0x9b197d){if(!_0x312553)continue;_0x312553['changeTpMode'](_0x38bd8b);}}),PluginManager['registerCommand'](pluginData[_0x9762(0x1ac)],'SceneSkillTpMode',_0x2dcaf2=>{const _0x547c8d=_0x9762;VisuMZ[_0x547c8d(0x13c)](_0x2dcaf2,_0x2dcaf2),$gameSystem[_0x547c8d(0x241)](_0x2dcaf2[_0x547c8d(0x1e2)]);}),VisuMZ[_0x9762(0x1b8)][_0x9762(0x1f6)]=Scene_Boot[_0x9762(0x159)][_0x9762(0x240)],Scene_Boot[_0x9762(0x159)]['onDatabaseLoaded']=function(){const _0x14857e=_0x9762;VisuMZ[_0x14857e(0x1b8)][_0x14857e(0x1f6)][_0x14857e(0x1a0)](this),this[_0x14857e(0x139)]();},Scene_Boot[_0x9762(0x159)][_0x9762(0x139)]=function(){const _0x405a97=_0x9762;VisuMZ[_0x405a97(0x1b8)][_0x405a97(0x1e3)]={},VisuMZ['EnhancedTP'][_0x405a97(0x238)]=[];for(const _0x4e77b6 of VisuMZ[_0x405a97(0x1b8)][_0x405a97(0x21d)][_0x405a97(0x1c8)]){if(!_0x4e77b6)continue;_0x4e77b6[_0x405a97(0x1ee)]=_0x4e77b6['Help']['format'](TextManager['tp']),this[_0x405a97(0x204)](_0x4e77b6);const _0x22b688=_0x4e77b6[_0x405a97(0x1bb)][_0x405a97(0x1b3)]()[_0x405a97(0x1d1)]();VisuMZ[_0x405a97(0x1b8)]['TpModes'][_0x22b688]=_0x4e77b6,VisuMZ['EnhancedTP']['TpModeOrder']['push'](_0x22b688);}},Scene_Boot[_0x9762(0x159)]['convertEnhancedTpFunctions']=function(_0x2af9ff){const _0x4290a8=_0x9762,_0x55b762=[_0x4290a8(0x25d),_0x4290a8(0x18b),'CriticalHit',_0x4290a8(0x123),_0x4290a8(0x184),_0x4290a8(0x1eb),'TpRegen',_0x4290a8(0x200),_0x4290a8(0x210),'CriticalMp','FullMp',_0x4290a8(0x235),_0x4290a8(0x20b),_0x4290a8(0x186),_0x4290a8(0x205),'TakeHpHeal',_0x4290a8(0x1f8),_0x4290a8(0x1aa),'TakeMpDmg',_0x4290a8(0x1ef),_0x4290a8(0x14a),_0x4290a8(0x230),'DealMpHeal',_0x4290a8(0x14d),'DealAllyBuff',_0x4290a8(0x234),_0x4290a8(0x138),'GainEnemyBuff',_0x4290a8(0x17c),_0x4290a8(0x193),_0x4290a8(0x1a9),_0x4290a8(0x1c6),_0x4290a8(0x217),'DealEnemyState','GainAllyState','GainEnemyState',_0x4290a8(0x14c),_0x4290a8(0x18d),'WinBattle',_0x4290a8(0x228),_0x4290a8(0x22c)];for(const _0x1c111f of _0x55b762){const _0x16a328=_0x4290a8(0x135)['format'](_0x2af9ff[_0x1c111f]);_0x2af9ff['%1Func'[_0x4290a8(0x127)](_0x1c111f)]=new Function('user',_0x4290a8(0x1ae),'value',_0x16a328);}},TextManager[_0x9762(0x1e1)]=VisuMZ[_0x9762(0x1b8)][_0x9762(0x21d)][_0x9762(0x1dc)][_0x9762(0x1b0)],ColorManager[_0x9762(0x1d8)]=function(_0x56e308){const _0x4720b8=_0x9762;return _0x56e308=String(_0x56e308),_0x56e308[_0x4720b8(0x22d)](/#(.*)/i)?_0x4720b8(0x219)[_0x4720b8(0x127)](String(RegExp['$1'])):this[_0x4720b8(0x253)](Number(_0x56e308));},ImageManager[_0x9762(0x125)]=VisuMZ['EnhancedTP'][_0x9762(0x21d)][_0x9762(0x1dc)][_0x9762(0x1f2)],VisuMZ[_0x9762(0x1b8)][_0x9762(0x1c5)]=BattleManager[_0x9762(0x1c4)],BattleManager[_0x9762(0x1c4)]=function(){const _0xfcac76=_0x9762;VisuMZ[_0xfcac76(0x1b8)]['BattleManager_processVictory'][_0xfcac76(0x1a0)](this),$gameParty[_0xfcac76(0x181)](_0xfcac76(0x23e),$gameParty[_0xfcac76(0x199)](),0x0);},VisuMZ[_0x9762(0x1b8)]['BattleManager_onEscapeSuccess']=BattleManager[_0x9762(0x1d9)],BattleManager[_0x9762(0x1d9)]=function(){const _0x42216b=_0x9762;VisuMZ['EnhancedTP'][_0x42216b(0x25b)]['call'](this),$gameParty[_0x42216b(0x181)]('FleeBattle',$gameParty[_0x42216b(0x199)](),0x0);},VisuMZ['EnhancedTP'][_0x9762(0x14e)]=BattleManager['processDefeat'],BattleManager[_0x9762(0x163)]=function(){const _0x115210=_0x9762;VisuMZ[_0x115210(0x1b8)]['BattleManager_processDefeat'][_0x115210(0x1a0)](this),$gameParty[_0x115210(0x181)]('LoseBattle',$gameParty[_0x115210(0x199)](),0x0);},VisuMZ[_0x9762(0x1b8)][_0x9762(0x20f)]=Game_System['prototype'][_0x9762(0x17d)],Game_System[_0x9762(0x159)][_0x9762(0x17d)]=function(){const _0x2e77c6=_0x9762;VisuMZ['EnhancedTP'][_0x2e77c6(0x20f)]['call'](this),this[_0x2e77c6(0x1c0)]();},Game_System[_0x9762(0x159)]['initEnhancedTP']=function(){const _0xffafa2=_0x9762;this[_0xffafa2(0x1cd)]=VisuMZ[_0xffafa2(0x1b8)][_0xffafa2(0x21d)][_0xffafa2(0x1dc)][_0xffafa2(0x20e)];},Game_System['prototype'][_0x9762(0x13f)]=function(){const _0x5c5fd6=_0x9762;if(this['_tpMode_SceneSkill']===undefined)this[_0x5c5fd6(0x1c0)]();return this[_0x5c5fd6(0x1cd)];},Game_System[_0x9762(0x159)][_0x9762(0x241)]=function(_0x572a3d){const _0x2ad1c2=_0x9762;if(this[_0x2ad1c2(0x1cd)]===undefined)this[_0x2ad1c2(0x1c0)]();this['_tpMode_SceneSkill']=_0x572a3d;},VisuMZ[_0x9762(0x1b8)][_0x9762(0x13b)]=Game_Action[_0x9762(0x159)][_0x9762(0x153)],Game_Action[_0x9762(0x159)][_0x9762(0x153)]=function(_0x189696){const _0x1838fb=_0x9762;VisuMZ[_0x1838fb(0x1b8)][_0x1838fb(0x13b)][_0x1838fb(0x1a0)](this,_0x189696),this[_0x1838fb(0x258)](_0x189696);},Game_Action['prototype'][_0x9762(0x258)]=function(_0x4ab647){const _0xd891fd=_0x9762,_0x4c3152=_0x4ab647[_0xd891fd(0x15b)]();_0x4c3152[_0xd891fd(0x24a)]&&this[_0xd891fd(0x243)]()['gainTpFromTpMode'](_0xd891fd(0x18e),_0x4ab647,0x0),(_0x4c3152['evaded']||_0x4c3152[_0xd891fd(0x212)])&&_0x4ab647[_0xd891fd(0x181)](_0xd891fd(0x123),_0x4ab647,0x0);},VisuMZ[_0x9762(0x1b8)][_0x9762(0x257)]=Game_Action['prototype'][_0x9762(0x1d4)],Game_Action[_0x9762(0x159)]['executeHpDamage']=function(_0x920078,_0x3f7730){const _0xe20ee2=_0x9762;VisuMZ['EnhancedTP'][_0xe20ee2(0x257)][_0xe20ee2(0x1a0)](this,_0x920078,_0x3f7730);const _0x3da830=this[_0xe20ee2(0x243)]();_0x3f7730>0x0?(_0x920078['gainTpFromTpMode'](_0xe20ee2(0x20b),_0x920078,_0x3f7730),_0x3da830[_0xe20ee2(0x181)]('DealHpDmg',_0x920078,_0x3f7730),_0x920078[_0xe20ee2(0x203)]()[_0xe20ee2(0x181)](_0xe20ee2(0x205),_0x920078,_0x3f7730)):(_0x3f7730=Math['abs'](_0x3f7730),_0x920078[_0xe20ee2(0x181)](_0xe20ee2(0x1e4),_0x920078,_0x3f7730),_0x3da830[_0xe20ee2(0x181)](_0xe20ee2(0x1f8),_0x920078,_0x3f7730),_0x920078['friendsUnit']()[_0xe20ee2(0x181)](_0xe20ee2(0x1aa),_0x920078,_0x3f7730));},VisuMZ[_0x9762(0x1b8)]['Game_Action_executeMpDamage']=Game_Action['prototype'][_0x9762(0x19c)],Game_Action[_0x9762(0x159)][_0x9762(0x19c)]=function(_0xf5aabe,_0x4fd37a){const _0x27f5f6=_0x9762;VisuMZ[_0x27f5f6(0x1b8)][_0x27f5f6(0x1dd)][_0x27f5f6(0x1a0)](this,_0xf5aabe,_0x4fd37a);const _0x56a92b=this[_0x27f5f6(0x243)]();_0x4fd37a>0x0?(_0xf5aabe[_0x27f5f6(0x181)](_0x27f5f6(0x1f9),_0xf5aabe,_0x4fd37a),_0x56a92b[_0x27f5f6(0x181)](_0x27f5f6(0x1ef),_0xf5aabe,_0x4fd37a),_0xf5aabe['friendsUnit']()[_0x27f5f6(0x181)](_0x27f5f6(0x14a),_0xf5aabe,_0x4fd37a)):(_0x4fd37a=Math[_0x27f5f6(0x155)](_0x4fd37a),_0xf5aabe[_0x27f5f6(0x181)](_0x27f5f6(0x230),_0xf5aabe,_0x4fd37a),_0x56a92b[_0x27f5f6(0x181)](_0x27f5f6(0x148),_0xf5aabe,_0x4fd37a),_0xf5aabe['friendsUnit']()[_0x27f5f6(0x181)](_0x27f5f6(0x14d),_0xf5aabe,_0x4fd37a));},VisuMZ[_0x9762(0x1b8)][_0x9762(0x21a)]=Game_Action[_0x9762(0x159)][_0x9762(0x221)],Game_Action[_0x9762(0x159)][_0x9762(0x221)]=function(_0x5cff19,_0x53807b){const _0x2c4413=_0x9762;VisuMZ[_0x2c4413(0x1b8)][_0x2c4413(0x21a)][_0x2c4413(0x1a0)](this,_0x5cff19,_0x53807b);if(!_0x5cff19[_0x2c4413(0x15b)]()[_0x2c4413(0x1df)])return;const _0x32641c=this[_0x2c4413(0x243)]();_0x32641c[_0x2c4413(0x22a)]()===_0x5cff19['isActor']()?(_0x32641c['gainTpFromTpMode']('DealAllyBuff',_0x5cff19,0x0),_0x5cff19[_0x2c4413(0x181)](_0x2c4413(0x138),_0x5cff19,0x0)):(_0x32641c['gainTpFromTpMode']('DealEnemyBuff',_0x5cff19,0x0),_0x5cff19[_0x2c4413(0x181)]('GainEnemyBuff',_0x5cff19,0x0));},VisuMZ[_0x9762(0x1b8)]['Game_Action_itemEffectAddDebuff']=Game_Action[_0x9762(0x159)]['itemEffectAddDebuff'],Game_Action['prototype'][_0x9762(0x226)]=function(_0x568c4d,_0x1d9e07){const _0x513487=_0x9762;VisuMZ[_0x513487(0x1b8)][_0x513487(0x245)][_0x513487(0x1a0)](this,_0x568c4d,_0x1d9e07);if(!_0x568c4d['result']()['success'])return;const _0x1e69ee=this[_0x513487(0x243)]();_0x1e69ee['isActor']()===_0x568c4d[_0x513487(0x22a)]()?(_0x1e69ee[_0x513487(0x181)](_0x513487(0x17c),_0x568c4d,0x0),_0x568c4d[_0x513487(0x181)](_0x513487(0x1a9),_0x568c4d,0x0)):(_0x1e69ee[_0x513487(0x181)]('DealEnemyDebuff',_0x568c4d,0x0),_0x568c4d['gainTpFromTpMode'](_0x513487(0x1c6),_0x568c4d,0x0));},VisuMZ[_0x9762(0x1b8)][_0x9762(0x195)]=Game_Action[_0x9762(0x159)][_0x9762(0x192)],Game_Action[_0x9762(0x159)][_0x9762(0x192)]=function(_0x2a4b22,_0x249474){const _0x1b06cf=_0x9762;VisuMZ[_0x1b06cf(0x1b8)]['Game_Action_itemEffectAddState'][_0x1b06cf(0x1a0)](this,_0x2a4b22,_0x249474);if(!_0x2a4b22[_0x1b06cf(0x15b)]()[_0x1b06cf(0x1df)])return;const _0x22c1c8=this[_0x1b06cf(0x243)]();_0x22c1c8[_0x1b06cf(0x22a)]()===_0x2a4b22[_0x1b06cf(0x22a)]()?(_0x22c1c8[_0x1b06cf(0x181)](_0x1b06cf(0x217),_0x2a4b22,0x0),_0x2a4b22[_0x1b06cf(0x181)](_0x1b06cf(0x23f),_0x2a4b22,0x0)):(_0x22c1c8[_0x1b06cf(0x181)](_0x1b06cf(0x1c9),_0x2a4b22,0x0),_0x2a4b22[_0x1b06cf(0x181)]('GainEnemyState',_0x2a4b22,0x0));},VisuMZ[_0x9762(0x1b8)]['Game_Action_applyItemUserEffect']=Game_Action[_0x9762(0x159)][_0x9762(0x1af)],Game_Action[_0x9762(0x159)][_0x9762(0x1af)]=function(_0x3fee19){const _0x51b9a5=_0x9762;VisuMZ[_0x51b9a5(0x1b8)]['Game_Action_applyItemUserEffect']['call'](this,_0x3fee19),this[_0x51b9a5(0x170)]();},Game_Action['prototype']['applyItemEnhancedTPEffect']=function(_0x33e022){const _0x5d76a9=_0x9762;if(!_0x33e022)return;const _0x5e79bf=this[_0x5d76a9(0x149)]()[_0x5d76a9(0x1de)],_0x1ac1f7=this[_0x5d76a9(0x243)]();_0x5e79bf[_0x5d76a9(0x22d)](/<CHANGE TARGET TP MODE: (.*)>/i)&&_0x33e022['changeTpMode'](String(RegExp['$1']));if(!_0x33e022[_0x5d76a9(0x22a)]())return;const _0x59536c=_0x5e79bf[_0x5d76a9(0x22d)](/<UNOCK TP MODE: (.*)>/gi);if(_0x59536c)for(const _0x3d30aa of _0x59536c){_0x3d30aa[_0x5d76a9(0x22d)](/<UNOCK TP MODE: (.*)>/i),_0x33e022[_0x5d76a9(0x231)](String(RegExp['$1']));}if(_0x5e79bf[_0x5d76a9(0x22d)](/<UNOCK TP MODES>\s*([\s\S]*)\s*<\/UNOCK TP MODES>/i)){const _0x2be3d4=String(RegExp['$1'])[_0x5d76a9(0x12e)](/[\r\n]+/);for(const _0x45129e of _0x2be3d4){_0x33e022[_0x5d76a9(0x231)](_0x45129e);}}},VisuMZ['EnhancedTP'][_0x9762(0x188)]=Game_Action['prototype'][_0x9762(0x246)],Game_Action[_0x9762(0x159)][_0x9762(0x246)]=function(){const _0xbe9504=_0x9762;VisuMZ['EnhancedTP']['Game_Action_applyGlobal'][_0xbe9504(0x1a0)](this),this[_0xbe9504(0x17f)]();},Game_Action['prototype'][_0x9762(0x17f)]=function(){const _0x1d4b9c=_0x9762,_0x523ce3=this[_0x1d4b9c(0x149)]()['note'],_0x297f0d=this[_0x1d4b9c(0x243)]();_0x523ce3[_0x1d4b9c(0x22d)](/<CHANGE USER TP MODE: (.*)>/i)&&_0x297f0d[_0x1d4b9c(0x134)](String(RegExp['$1']));},Game_BattlerBase[_0x9762(0x159)][_0x9762(0x1c0)]=function(){const _0x17872a=_0x9762;this[_0x17872a(0x134)](this['defaultTpMode']());},Game_BattlerBase['prototype'][_0x9762(0x134)]=function(_0x3503ce){const _0x4f8bbc=_0x9762;_0x3503ce=_0x3503ce['toUpperCase']()[_0x4f8bbc(0x1d1)]();if(!VisuMZ[_0x4f8bbc(0x1b8)][_0x4f8bbc(0x1e3)][_0x3503ce])return;this[_0x4f8bbc(0x154)]=_0x3503ce,this[_0x4f8bbc(0x1d6)](_0x3503ce);},Game_BattlerBase[_0x9762(0x159)]['defaultTpMode']=function(){const _0x209c4e=_0x9762;return VisuMZ[_0x209c4e(0x1b8)][_0x209c4e(0x21d)][_0x209c4e(0x1dc)]['DefaultTpMode'][_0x209c4e(0x1b3)]()[_0x209c4e(0x1d1)]();},Game_BattlerBase[_0x9762(0x159)][_0x9762(0x1f0)]=function(){const _0x2e5e39=_0x9762;if(this['_tpMode']===undefined)this[_0x2e5e39(0x1c0)]();let _0x15584e=this[_0x2e5e39(0x154)];for(const _0x5dd15f of this[_0x2e5e39(0x18c)]()){if(!_0x5dd15f)continue;if(_0x5dd15f[_0x2e5e39(0x1de)][_0x2e5e39(0x22d)](/<FORCE TP MODE: (.*)>/i)){const _0x4c5297=String(RegExp['$1'])[_0x2e5e39(0x1b3)]()[_0x2e5e39(0x1d1)]();if(!VisuMZ[_0x2e5e39(0x1b8)]['TpModes'][_0x4c5297])continue;_0x15584e=_0x4c5297;break;}}return VisuMZ['EnhancedTP'][_0x2e5e39(0x1e3)][_0x15584e['toUpperCase']()['trim']()];},Game_BattlerBase[_0x9762(0x159)][_0x9762(0x1a1)]=function(_0x1de899,_0x294050,_0x591208){const _0x2d8eb6=_0x9762,_0x4de709=this[_0x2d8eb6(0x1f0)]();if(!_0x4de709)return 0x0;_0x1de899=_0x2d8eb6(0x128)[_0x2d8eb6(0x127)](_0x1de899);if(!_0x4de709[_0x1de899])return 0x0;return _0x4de709[_0x1de899](this,_0x294050,_0x591208);},Game_BattlerBase[_0x9762(0x159)][_0x9762(0x181)]=function(_0x4f4929,_0x3bff33,_0x4bab68){const _0x27d58a=_0x9762,_0x508211=Math['floor'](this[_0x27d58a(0x1a1)](_0x4f4929,_0x3bff33,_0x4bab68));this[_0x27d58a(0x129)](_0x508211);},VisuMZ[_0x9762(0x1b8)][_0x9762(0x18a)]=Game_BattlerBase[_0x9762(0x159)][_0x9762(0x130)],Game_BattlerBase['prototype'][_0x9762(0x130)]=function(){const _0x17abd5=_0x9762;if(this['tpMode']())return Math['floor'](this['tpMode']()[_0x17abd5(0x157)](this,this,0x0));return VisuMZ[_0x17abd5(0x1b8)][_0x17abd5(0x18a)][_0x17abd5(0x1a0)](this);},VisuMZ[_0x9762(0x1b8)][_0x9762(0x143)]=Game_BattlerBase[_0x9762(0x159)][_0x9762(0x1bd)],Game_BattlerBase['prototype'][_0x9762(0x1bd)]=function(){const _0x32fb44=_0x9762;if(this[_0x32fb44(0x1f0)]())return this['tpMode']()['Preserve'];return VisuMZ[_0x32fb44(0x1b8)][_0x32fb44(0x143)][_0x32fb44(0x1a0)](this);},VisuMZ[_0x9762(0x1b8)][_0x9762(0x173)]=Game_BattlerBase['prototype']['sparam'],Game_BattlerBase[_0x9762(0x159)][_0x9762(0x175)]=function(_0x5ca1d7){const _0x34b6b1=_0x9762;let _0x464fb4=VisuMZ[_0x34b6b1(0x1b8)]['Game_BattlerBase_sparam'][_0x34b6b1(0x1a0)](this,_0x5ca1d7);return _0x5ca1d7===0x5&&this['tpMode']()&&(_0x464fb4*=this['tpMode']()[_0x34b6b1(0x248)]),_0x464fb4;},Game_BattlerBase[_0x9762(0x159)][_0x9762(0x225)]=function(){const _0x4def29=_0x9762;if(!Imported['VisuMZ_1_SkillsStatesCore'])return![];const _0xbf90f6=this[_0x4def29(0x1f0)]();if(!_0xbf90f6)return![];if(!_0xbf90f6[_0x4def29(0x169)])return![];const _0x4363b7=_0xbf90f6[_0x4def29(0x1cb)]||0x0;return this[_0x4def29(0x1fb)]()>=_0x4363b7;},Game_BattlerBase[_0x9762(0x159)][_0x9762(0x211)]=function(){const _0x275339=_0x9762,_0x3a2fa3=this[_0x275339(0x1f0)]();if(!_0x3a2fa3)return![];return(_0x3a2fa3[_0x275339(0x19a)]||0x1)[_0x275339(0x21f)](0x1,0xff);},Game_BattlerBase['prototype']['tpGaugeFlashLightness']=function(){const _0x18349a=_0x9762,_0xc6dd55=this[_0x18349a(0x1f0)]();if(!_0xc6dd55)return![];return(_0xc6dd55['FlashLightness']||0x0)[_0x18349a(0x21f)](0x0,0xff);},Game_Battler[_0x9762(0x159)][_0x9762(0x1ec)]=function(){},VisuMZ[_0x9762(0x1b8)][_0x9762(0x1a8)]=Game_Battler[_0x9762(0x159)]['onBattleStart'],Game_Battler[_0x9762(0x159)][_0x9762(0x140)]=function(_0x241288){const _0x33a71b=_0x9762;VisuMZ[_0x33a71b(0x1b8)][_0x33a71b(0x1a8)][_0x33a71b(0x1a0)](this,_0x241288),this[_0x33a71b(0x181)]('Initial',this,0x0);},VisuMZ[_0x9762(0x1b8)][_0x9762(0x16a)]=Game_Battler[_0x9762(0x159)][_0x9762(0x16c)],Game_Battler[_0x9762(0x159)][_0x9762(0x16c)]=function(_0x1c9d84){const _0x21fcb0=_0x9762;VisuMZ[_0x21fcb0(0x1b8)][_0x21fcb0(0x16a)][_0x21fcb0(0x1a0)](this,_0x1c9d84),this['skillIsNotAttackGuard'](_0x1c9d84)&&this['gainTpFromTpMode']('UseSkill',this,0x0),DataManager[_0x21fcb0(0x22b)](_0x1c9d84)&&this['gainTpFromTpMode'](_0x21fcb0(0x184),this,0x0);},Game_Battler[_0x9762(0x159)][_0x9762(0x259)]=function(_0x17fba9){const _0x9c9479=_0x9762;if(!_0x17fba9)return![];if(!DataManager[_0x9c9479(0x1e5)](_0x17fba9))return![];if(_0x17fba9['id']===this[_0x9c9479(0x150)]())return![];if(_0x17fba9['id']===this[_0x9c9479(0x247)]())return![];return!![];},VisuMZ[_0x9762(0x1b8)][_0x9762(0x24f)]=Game_Battler[_0x9762(0x159)][_0x9762(0x12d)],Game_Battler[_0x9762(0x159)][_0x9762(0x12d)]=function(){const _0x24be51=_0x9762,_0x3bca69=Math['floor'](this[_0x24be51(0x130)]()*this[_0x24be51(0x25c)]);this['gainSilentTp'](_0x3bca69),this[_0x24be51(0x181)](_0x24be51(0x1ba),this,0x0),this[_0x24be51(0x1b6)]<this[_0x24be51(0x1d2)]/0x4&&this[_0x24be51(0x181)](_0x24be51(0x200),this,0x0),this['_hp']>=this[_0x24be51(0x1d2)]&&this[_0x24be51(0x181)]('FullHp',this,0x0),this[_0x24be51(0x1b4)]<this[_0x24be51(0x13a)]/0x4&&this['gainTpFromTpMode'](_0x24be51(0x1c2),this,0x0),this['_mp']>=this['mmp']&&this[_0x24be51(0x181)](_0x24be51(0x1f3),this,0x0),this[_0x24be51(0x203)]()[_0x24be51(0x12a)]()[_0x24be51(0x172)]<=0x1&&this['gainTpFromTpMode'](_0x24be51(0x235),this,0x0);},Game_Battler[_0x9762(0x159)][_0x9762(0x23b)]=function(_0x147eb0){},VisuMZ[_0x9762(0x1b8)][_0x9762(0x1da)]=Game_Battler[_0x9762(0x159)]['addState'],Game_Battler['prototype'][_0x9762(0x14b)]=function(_0xa7967a){const _0x50e939=_0x9762;VisuMZ['EnhancedTP'][_0x50e939(0x1da)][_0x50e939(0x1a0)](this,_0xa7967a),_0xa7967a===this['deathStateId']()&&this[_0x50e939(0x249)]()&&(this['friendsUnit']()['gainTpFromTpMode'](_0x50e939(0x14c),this,0x0),this[_0x50e939(0x224)]()[_0x50e939(0x181)]('KillEnemy',this,0x0));},Game_Battler[_0x9762(0x159)][_0x9762(0x1d6)]=function(_0x3759d4){const _0x282fed=_0x9762;this[_0x282fed(0x201)]={},this[_0x282fed(0x145)]=Math[_0x282fed(0x24d)](this['_tp'],this[_0x282fed(0x130)]());},VisuMZ['EnhancedTP'][_0x9762(0x136)]=Game_Actor['prototype'][_0x9762(0x12f)],Game_Actor[_0x9762(0x159)][_0x9762(0x12f)]=function(_0x5e2e71){const _0x27a680=_0x9762;VisuMZ['EnhancedTP']['Game_Actor_setup'][_0x27a680(0x1a0)](this,_0x5e2e71),this['initEnhancedTP']();},Game_Actor[_0x9762(0x159)][_0x9762(0x1c0)]=function(){const _0x459965=_0x9762;this[_0x459965(0x15d)]=[],Game_Battler['prototype']['initEnhancedTP'][_0x459965(0x1a0)](this),this['learnAvailablePartyTpModes'](),this['learnAvailableActorTpModes']();},Game_Actor[_0x9762(0x159)][_0x9762(0x251)]=function(){const _0x4e1bea=_0x9762;return this[_0x4e1bea(0x1ca)]()&&this[_0x4e1bea(0x1ca)]()['note']['match'](/<TP MODE: (.*)>/i)?String(RegExp['$1'])[_0x4e1bea(0x1b3)]()[_0x4e1bea(0x1d1)]():Game_Battler[_0x4e1bea(0x159)][_0x4e1bea(0x251)]['call'](this);},Game_Actor['prototype'][_0x9762(0x1d6)]=function(_0x2d64c9){const _0x318b7a=_0x9762;_0x2d64c9=_0x2d64c9[_0x318b7a(0x1b3)]()[_0x318b7a(0x1d1)](),Game_Battler['prototype'][_0x318b7a(0x1d6)][_0x318b7a(0x1a0)](this,_0x2d64c9),this[_0x318b7a(0x231)](_0x2d64c9);},Game_Actor[_0x9762(0x159)][_0x9762(0x231)]=function(_0x357adf){const _0x209426=_0x9762;_0x357adf=_0x357adf[_0x209426(0x1b3)]()[_0x209426(0x1d1)]();if(!VisuMZ['EnhancedTP'][_0x209426(0x1e3)][_0x357adf])return;this[_0x209426(0x15d)]=this['_availableTpModes']||[],!this[_0x209426(0x15d)]['includes'](_0x357adf)&&(this[_0x209426(0x15d)][_0x209426(0x146)](_0x357adf),this[_0x209426(0x16d)]());},VisuMZ[_0x9762(0x1b8)][_0x9762(0x16d)]=function(_0x5ea91a){const _0x82fb5a=_0x9762,_0xc377b5=[];for(const _0x183f3e of VisuMZ['EnhancedTP'][_0x82fb5a(0x238)]){if(_0x5ea91a['includes'](_0x183f3e))_0xc377b5[_0x82fb5a(0x146)](_0x183f3e);}return _0xc377b5;},Game_Actor['prototype'][_0x9762(0x16d)]=function(){const _0x546d25=_0x9762;if(this[_0x546d25(0x15d)]===undefined)this[_0x546d25(0x1c0)]();this[_0x546d25(0x15d)]=VisuMZ[_0x546d25(0x1b8)]['sortTpModes'](this['_availableTpModes']);},Game_Actor[_0x9762(0x159)][_0x9762(0x1cf)]=function(){const _0x5b3299=_0x9762;if(this[_0x5b3299(0x15d)]===undefined)this[_0x5b3299(0x1c0)]();this['learnAvailablePartyTpModes']();let _0x4ae5e4=this['_availableTpModes']['map'](_0x193a8e=>VisuMZ[_0x5b3299(0x1b8)][_0x5b3299(0x1e3)][_0x193a8e]);return _0x4ae5e4[_0x5b3299(0x187)](null);},Game_Actor[_0x9762(0x159)][_0x9762(0x19d)]=function(){const _0x3c0a7a=_0x9762;for(const _0x6fc7ba of $gameParty[_0x3c0a7a(0x167)]()){this['learnTpMode'](_0x6fc7ba[_0x3c0a7a(0x1b3)]()[_0x3c0a7a(0x1d1)]());}},Game_Actor[_0x9762(0x159)][_0x9762(0x16b)]=function(){const _0x913f48=_0x9762;if(this[_0x913f48(0x1ca)]()&&this[_0x913f48(0x1ca)]()[_0x913f48(0x1de)]['match'](/<STARTING TP (?:MODE|MODES)>\s*([\s\S]*)\s*<\/STARTING TP (?:MODE|MODES)>/i)){const _0x43d29e=String(RegExp['$1'])['split'](/[\r\n]+/);for(const _0x29e661 of _0x43d29e){this[_0x913f48(0x231)](_0x29e661[_0x913f48(0x1b3)]()[_0x913f48(0x1d1)]());}}},VisuMZ[_0x9762(0x1b8)][_0x9762(0x206)]=Game_Actor[_0x9762(0x159)][_0x9762(0x161)],Game_Actor[_0x9762(0x159)][_0x9762(0x161)]=function(_0xf0b890){const _0x2a500a=_0x9762;VisuMZ[_0x2a500a(0x1b8)]['Game_Actor_learnSkill'][_0x2a500a(0x1a0)](this,_0xf0b890),this['learnSkillEnhancedTP'](_0xf0b890);},Game_Actor[_0x9762(0x159)][_0x9762(0x160)]=function(_0x2367b8){const _0x27c66c=_0x9762;if(!$dataSkills[_0x2367b8])return;const _0x31c692=$dataSkills[_0x2367b8][_0x27c66c(0x1de)],_0x46d365=_0x31c692[_0x27c66c(0x22d)](/<LEARN TP MODE: (.*)>/gi);if(_0x46d365)for(const _0x50bf5b of _0x46d365){_0x50bf5b[_0x27c66c(0x22d)](/<LEARN TP MODE: (.*)>/i),this[_0x27c66c(0x231)](String(RegExp['$1']));}if(_0x31c692[_0x27c66c(0x22d)](/<LEARN TP MODES>\s*([\s\S]*)\s*<\/LEARN TP MODES>/i)){const _0x35401c=String(RegExp['$1'])['split'](/[\r\n]+/);for(const _0x125fa3 of _0x35401c){this[_0x27c66c(0x231)](_0x125fa3);}}},Game_Enemy[_0x9762(0x159)][_0x9762(0x251)]=function(){const _0xeb2c9e=_0x9762;return this[_0xeb2c9e(0x23a)]()[_0xeb2c9e(0x1de)][_0xeb2c9e(0x22d)](/<TP MODE: (.*)>/i)?String(RegExp['$1'])[_0xeb2c9e(0x1b3)]()[_0xeb2c9e(0x1d1)]():Game_Battler['prototype'][_0xeb2c9e(0x251)][_0xeb2c9e(0x1a0)](this);},Game_Unit[_0x9762(0x159)][_0x9762(0x181)]=function(_0x1df3c6,_0x10b19d,_0x1cda01){const _0x31d9cb=_0x9762;for(const _0x58b36c of this[_0x31d9cb(0x12a)]()){if(!_0x58b36c)continue;_0x58b36c[_0x31d9cb(0x181)](_0x1df3c6,_0x10b19d,_0x1cda01);}},VisuMZ[_0x9762(0x1b8)]['Game_Party_initialize']=Game_Party[_0x9762(0x159)][_0x9762(0x17d)],Game_Party[_0x9762(0x159)][_0x9762(0x17d)]=function(){const _0x2152f2=_0x9762;VisuMZ['EnhancedTP'][_0x2152f2(0x12b)][_0x2152f2(0x1a0)](this),this[_0x2152f2(0x1ce)]();},Game_Party[_0x9762(0x159)]['initTpModes']=function(){const _0x1ba4d0=_0x9762;this[_0x1ba4d0(0x191)]=[];for(const _0x2d865d of VisuMZ['EnhancedTP']['Settings']['General'][_0x1ba4d0(0x180)]){this[_0x1ba4d0(0x191)][_0x1ba4d0(0x146)](_0x2d865d[_0x1ba4d0(0x1b3)]()['trim']());}},Game_Party[_0x9762(0x159)][_0x9762(0x167)]=function(){const _0x3d7e99=_0x9762;if(this[_0x3d7e99(0x191)]===undefined)this[_0x3d7e99(0x1ce)]();return this[_0x3d7e99(0x191)];},VisuMZ['EnhancedTP'][_0x9762(0x122)]=Scene_Skill[_0x9762(0x159)][_0x9762(0x131)],Scene_Skill[_0x9762(0x159)][_0x9762(0x131)]=function(){const _0x4c3fdd=_0x9762;VisuMZ[_0x4c3fdd(0x1b8)][_0x4c3fdd(0x122)][_0x4c3fdd(0x1a0)](this),this[_0x4c3fdd(0x22f)]();},VisuMZ['EnhancedTP'][_0x9762(0x1fc)]=Scene_Skill[_0x9762(0x159)]['createSkillTypeWindow'],Scene_Skill[_0x9762(0x159)][_0x9762(0x126)]=function(){const _0x398e33=_0x9762;VisuMZ['EnhancedTP'][_0x398e33(0x1fc)][_0x398e33(0x1a0)](this),this['_skillTypeWindow'][_0x398e33(0x21e)](_0x398e33(0x1f0),this['commandTpMode'][_0x398e33(0x152)](this));},Scene_Skill[_0x9762(0x159)][_0x9762(0x22f)]=function(){const _0x3b42cd=_0x9762,_0x5cabdd=this[_0x3b42cd(0x197)]();this[_0x3b42cd(0x239)]=new Window_TpModes(_0x5cabdd),this[_0x3b42cd(0x239)][_0x3b42cd(0x223)](this[_0x3b42cd(0x1d0)]),this[_0x3b42cd(0x239)][_0x3b42cd(0x21e)]('ok',this['onTpModeOk'][_0x3b42cd(0x152)](this)),this[_0x3b42cd(0x239)][_0x3b42cd(0x21e)](_0x3b42cd(0x12c),this[_0x3b42cd(0x207)]['bind'](this)),this[_0x3b42cd(0x1c1)](this[_0x3b42cd(0x239)]);const _0x29826f=VisuMZ[_0x3b42cd(0x1b8)][_0x3b42cd(0x21d)][_0x3b42cd(0x1dc)]['TpWindowBgType'];this[_0x3b42cd(0x239)][_0x3b42cd(0x1db)](_0x29826f||0x0);},Scene_Skill[_0x9762(0x159)][_0x9762(0x197)]=function(){const _0x2714d3=_0x9762,_0xe6d7a6=0x0,_0x3aab36=this[_0x2714d3(0x18f)]['y']+this[_0x2714d3(0x18f)][_0x2714d3(0x220)],_0x4e9bf5=Graphics[_0x2714d3(0x208)],_0x1a0a86=this[_0x2714d3(0x178)]()-this[_0x2714d3(0x18f)][_0x2714d3(0x220)];return new Rectangle(_0xe6d7a6,_0x3aab36,_0x4e9bf5,_0x1a0a86);},Scene_Skill[_0x9762(0x159)][_0x9762(0x252)]=function(){const _0x472846=_0x9762;this[_0x472846(0x239)][_0x472846(0x1fa)](),this[_0x472846(0x239)][_0x472846(0x242)]();},Scene_Skill[_0x9762(0x159)][_0x9762(0x1a5)]=function(){const _0x434018=_0x9762;this[_0x434018(0x239)][_0x434018(0x1fa)]();const _0x42781e=this['_tpModeWindow'][_0x434018(0x149)]();if(!_0x42781e)return;this[_0x434018(0x1ca)]()[_0x434018(0x134)](_0x42781e[_0x434018(0x1bb)]),this['_tpModeWindow'][_0x434018(0x213)](),this[_0x434018(0x18f)][_0x434018(0x213)]();},Scene_Skill[_0x9762(0x159)]['onTpModeCancel']=function(){const _0x241ae1=_0x9762;this[_0x241ae1(0x239)][_0x241ae1(0x214)](),this[_0x241ae1(0x194)][_0x241ae1(0x1fa)]();},VisuMZ['EnhancedTP'][_0x9762(0x189)]=Scene_Skill[_0x9762(0x159)][_0x9762(0x23d)],Scene_Skill['prototype'][_0x9762(0x23d)]=function(){const _0x1d13ae=_0x9762;VisuMZ['EnhancedTP'][_0x1d13ae(0x189)][_0x1d13ae(0x1a0)](this);if(this[_0x1d13ae(0x239)])this[_0x1d13ae(0x239)][_0x1d13ae(0x1bf)](this[_0x1d13ae(0x1ca)]());},VisuMZ[_0x9762(0x1b8)]['Sprite_Gauge_setup']=Sprite_Gauge[_0x9762(0x159)][_0x9762(0x12f)],Sprite_Gauge[_0x9762(0x159)][_0x9762(0x12f)]=function(_0x1f3c50,_0x1bf58f){const _0x92e3c0=_0x9762;VisuMZ['EnhancedTP'][_0x92e3c0(0x16f)]['call'](this,_0x1f3c50,_0x1bf58f),this[_0x92e3c0(0x1a4)]==='tp'&&this['createEnhancedTpChildSprites']();},Sprite_Gauge[_0x9762(0x159)]['createEnhancedTpChildSprites']=function(){const _0x4a2284=_0x9762;!this[_0x4a2284(0x185)]&&(this[_0x4a2284(0x185)]=new Sprite(),this[_0x4a2284(0x20a)](this['_tpGaugeBack'])),!this[_0x4a2284(0x164)]&&(this[_0x4a2284(0x164)]=new Sprite(),this[_0x4a2284(0x20a)](this['_tpGaugeSprite'])),!this[_0x4a2284(0x141)]&&(this[_0x4a2284(0x141)]=new Sprite(),this[_0x4a2284(0x20a)](this[_0x4a2284(0x141)]));},VisuMZ[_0x9762(0x1b8)][_0x9762(0x15a)]=Sprite_Gauge[_0x9762(0x159)][_0x9762(0x1a6)],Sprite_Gauge[_0x9762(0x159)]['redraw']=function(){const _0x3c8a5e=_0x9762;let _0x50a7a8=$dataSystem[_0x3c8a5e(0x144)][_0x3c8a5e(0x1b9)][0x7];this[_0x3c8a5e(0x1a4)]==='tp'&&this[_0x3c8a5e(0x209)](),VisuMZ[_0x3c8a5e(0x1b8)][_0x3c8a5e(0x15a)][_0x3c8a5e(0x1a0)](this),this[_0x3c8a5e(0x1a4)]==='tp'&&this[_0x3c8a5e(0x1ab)](),this[_0x3c8a5e(0x1a4)]==='tp'&&($dataSystem[_0x3c8a5e(0x144)][_0x3c8a5e(0x1b9)][0x7]=_0x50a7a8);},Sprite_Gauge[_0x9762(0x159)][_0x9762(0x1ab)]=function(){const _0x218f3d=_0x9762;this[_0x218f3d(0x141)]&&(this['_tpTextSprite']['bitmap']=this[_0x218f3d(0x147)]),this[_0x218f3d(0x216)](0x0,0x0,0x0,0x0);},VisuMZ[_0x9762(0x1b8)][_0x9762(0x1be)]=Sprite_Gauge[_0x9762(0x159)]['drawFullGauge'],Sprite_Gauge['prototype']['drawFullGauge']=function(_0x232f72,_0x345c89,_0x3f31de,_0x4e9759,_0x2a5891,_0x36decd){const _0x14796a=_0x9762;this[_0x14796a(0x1a4)]==='tp'&&this[_0x14796a(0x164)]?this[_0x14796a(0x19e)](_0x232f72,_0x345c89,_0x3f31de,_0x4e9759,_0x2a5891,_0x36decd):VisuMZ['EnhancedTP']['Sprite_Gauge_drawFullGauge'][_0x14796a(0x1a0)](this,_0x232f72,_0x345c89,_0x3f31de,_0x4e9759,_0x2a5891,_0x36decd);},Sprite_Gauge['prototype']['createTpGaugeBitmaps']=function(_0x2dba37){const _0x36d970=_0x9762;!this[_0x36d970(0x185)][_0x36d970(0x147)]&&(this['_tpGaugeBack'][_0x36d970(0x147)]=new Bitmap(this['bitmap'][_0x36d970(0x19b)],this[_0x36d970(0x147)][_0x36d970(0x220)])),!this[_0x36d970(0x164)]['bitmap']&&(this[_0x36d970(0x164)][_0x36d970(0x147)]=new Bitmap(this['bitmap'][_0x36d970(0x19b)],this[_0x36d970(0x147)]['height'])),_0x2dba37&&(this[_0x36d970(0x185)]['bitmap'][_0x36d970(0x132)](),this[_0x36d970(0x164)][_0x36d970(0x147)][_0x36d970(0x132)]());},Sprite_Gauge[_0x9762(0x159)]['drawFullGaugeEnhancedTp']=function(_0xb500fc,_0x136edb,_0x490e6f,_0x1df417,_0x1656ca,_0x33be2c){const _0x22fffa=_0x9762;this[_0x22fffa(0x218)](!![]);const _0x5d7946=this[_0x22fffa(0x15c)](),_0xfb4556=Math['floor']((_0x1656ca-0x2)*_0x5d7946),_0x4d403a=_0x33be2c-0x2,_0x1edc88=this[_0x22fffa(0x1bc)]();this['_tpGaugeBack']['bitmap']['fillRect'](_0x490e6f,_0x1df417,_0x1656ca,_0x33be2c,_0x1edc88),_0xb500fc=this[_0x22fffa(0x22e)](_0xb500fc,0x1),_0x136edb=this['changeTpCustomColor'](_0x136edb,0x2),this[_0x22fffa(0x164)]['bitmap'][_0x22fffa(0x165)](_0x490e6f+0x1,_0x1df417+0x1,_0xfb4556,_0x4d403a,_0xb500fc,_0x136edb);},VisuMZ[_0x9762(0x1b8)][_0x9762(0x14f)]=Sprite_Gauge[_0x9762(0x159)]['drawGaugeRect'],Sprite_Gauge[_0x9762(0x159)]['drawGaugeRect']=function(_0x1f3471,_0x431e11,_0x25d7d3,_0x5b9d25){const _0x21c330=_0x9762;this[_0x21c330(0x1a4)]==='tp'&&this[_0x21c330(0x164)]?this[_0x21c330(0x256)](_0x1f3471,_0x431e11,_0x25d7d3,_0x5b9d25):VisuMZ[_0x21c330(0x1b8)][_0x21c330(0x14f)][_0x21c330(0x1a0)](this,_0x1f3471,_0x431e11,_0x25d7d3,_0x5b9d25);},Sprite_Gauge[_0x9762(0x159)][_0x9762(0x256)]=function(_0x1d41dd,_0x26e296,_0x5e0e20,_0x5b28da){const _0x355aab=_0x9762;this['createTpGaugeBitmaps'](!![]);const _0xec48db=this[_0x355aab(0x15c)](),_0x4df4ef=Math['floor']((_0x5e0e20-0x2)*_0xec48db),_0x285e69=_0x5b28da-0x2,_0x253fb4=this[_0x355aab(0x1bc)](),_0x454b1d=this['changeTpCustomColor'](this[_0x355aab(0x171)](),0x1),_0x2598b2=this['changeTpCustomColor'](this['gaugeColor2'](),0x2);this['_tpGaugeBack'][_0x355aab(0x147)][_0x355aab(0x19f)](_0x1d41dd,_0x26e296,_0x5e0e20,_0x5b28da,_0x253fb4),this[_0x355aab(0x164)][_0x355aab(0x147)][_0x355aab(0x165)](_0x1d41dd+0x1,_0x26e296+0x1,_0x4df4ef,_0x285e69,_0x454b1d,_0x2598b2);},VisuMZ['EnhancedTP'][_0x9762(0x227)]=Sprite_Gauge[_0x9762(0x159)]['update'],Sprite_Gauge[_0x9762(0x159)][_0x9762(0x17a)]=function(){const _0x35daac=_0x9762;VisuMZ[_0x35daac(0x1b8)][_0x35daac(0x227)]['call'](this),this[_0x35daac(0x20d)]();},Sprite_Gauge['prototype'][_0x9762(0x20d)]=function(){const _0x58a150=_0x9762;if(this[_0x58a150(0x1a4)]!=='tp')return;if(!this[_0x58a150(0x164)])return;if(!this[_0x58a150(0x232)])return;const _0x213cb3=this['_battler']['tpMode']();this[_0x58a150(0x17e)]!==_0x213cb3&&(this[_0x58a150(0x17e)]=_0x213cb3,this[_0x58a150(0x1a6)]());if(this[_0x58a150(0x232)][_0x58a150(0x225)]()){const _0x5f83cf=this[_0x58a150(0x232)]['tpGaugeFlashSpeed']();this[_0x58a150(0x164)][_0x58a150(0x16e)](this['_tpGaugeSprite']['_hue']+_0x5f83cf);const _0x39f470=this[_0x58a150(0x232)][_0x58a150(0x168)]();this['_tpGaugeSprite'][_0x58a150(0x1cc)]([0xff,0xff,0xff,_0x39f470]);}else this[_0x58a150(0x164)][_0x58a150(0x1cc)]([0xff,0xff,0xff,0x0]),this[_0x58a150(0x164)][_0x58a150(0x16e)](0x0);},Sprite_Gauge[_0x9762(0x159)][_0x9762(0x209)]=function(){const _0x545137=_0x9762;if(!this[_0x545137(0x232)])return;const _0x3e6e5d=this[_0x545137(0x232)]['tpMode']();_0x3e6e5d[_0x545137(0x1ed)]&&($dataSystem[_0x545137(0x144)]['basic'][0x7]=_0x3e6e5d['CustomLabel'][_0x545137(0x1d1)]());},Sprite_Gauge[_0x9762(0x159)][_0x9762(0x22e)]=function(_0x5bfdc1,_0x604cd4){const _0x203260=_0x9762;if(!this['_battler'])return _0x5bfdc1;const _0x16084c=this['_battler'][_0x203260(0x1f0)](),_0x364e83=_0x203260(0x202)[_0x203260(0x127)](_0x604cd4);return _0x16084c[_0x364e83]?ColorManager[_0x203260(0x1d8)](_0x16084c[_0x364e83]):_0x5bfdc1;},Window_Base[_0x9762(0x159)]['drawTpMode']=function(_0x212f7a,_0x66d64c,_0xac02e1,_0x5be122,_0x21f102){const _0x2d6402=_0x9762;if(!_0x212f7a)return;const _0x3dce19=_0xac02e1+(this[_0x2d6402(0x1c3)]()-ImageManager['iconHeight'])/0x2,_0x17d21d=ImageManager[_0x2d6402(0x255)]+0x4,_0xb09c95=Math[_0x2d6402(0x13d)](0x0,_0x5be122-_0x17d21d);this['resetTextColor'](),_0x21f102&&_0x21f102[_0x2d6402(0x1f0)]()===_0x212f7a&&this['changeTextColor'](ColorManager[_0x2d6402(0x250)]()),this[_0x2d6402(0x166)](_0x212f7a[_0x2d6402(0x21b)],_0x66d64c,_0x3dce19),this[_0x2d6402(0x151)](_0x212f7a[_0x2d6402(0x1bb)],_0x66d64c+_0x17d21d,_0xac02e1,_0xb09c95);},VisuMZ[_0x9762(0x1b8)][_0x9762(0x1f7)]=Window_SkillType[_0x9762(0x159)]['makeCommandList'],Window_SkillType[_0x9762(0x159)]['makeCommandList']=function(){const _0x15a832=_0x9762;VisuMZ['EnhancedTP'][_0x15a832(0x1f7)]['call'](this),this[_0x15a832(0x254)]();},Window_SkillType[_0x9762(0x159)][_0x9762(0x254)]=function(){const _0x486ebb=_0x9762;if(!this[_0x486ebb(0x1d3)]())return;let _0x1b1db6=TextManager[_0x486ebb(0x1e1)]['format'](TextManager['tp']);Imported[_0x486ebb(0x196)]&&(_0x1b1db6=_0x486ebb(0x1a7)[_0x486ebb(0x127)](ImageManager[_0x486ebb(0x125)],_0x1b1db6)),this[_0x486ebb(0x1e7)](_0x1b1db6,_0x486ebb(0x1f0),!![],_0x486ebb(0x1f0));},Window_SkillType[_0x9762(0x159)]['isTpModeCommandVisible']=function(){return $gameSystem['showTpModeInSceneSkill']();},VisuMZ[_0x9762(0x1b8)][_0x9762(0x1e6)]=Window_SkillList[_0x9762(0x159)]['setStypeId'],Window_SkillList['prototype'][_0x9762(0x1f4)]=function(_0x26246a){const _0x3cc5f6=_0x9762,_0x5e75a=this[_0x3cc5f6(0x23c)]!==_0x26246a;if(!_0x5e75a)return;this[_0x3cc5f6(0x1b2)]();const _0x5e8d43=SceneManager['_scene'][_0x3cc5f6(0x239)];if(_0x5e8d43)_0x5e8d43[_0x3cc5f6(0x1b5)]();const _0x2495a6=this[_0x3cc5f6(0x18f)];if(_0x2495a6)_0x2495a6[_0x3cc5f6(0x1b2)]();VisuMZ[_0x3cc5f6(0x1b8)][_0x3cc5f6(0x1e6)][_0x3cc5f6(0x1a0)](this,_0x26246a);if(_0x5e75a&&_0x5e8d43&&_0x26246a===_0x3cc5f6(0x1f0)){if(_0x2495a6)_0x2495a6[_0x3cc5f6(0x1b5)]();this['hide'](),_0x5e8d43[_0x3cc5f6(0x1b2)]();}};function Window_TpModes(){const _0x147fcf=_0x9762;this[_0x147fcf(0x17d)](...arguments);}Window_TpModes[_0x9762(0x159)]=Object[_0x9762(0x131)](Window_Selectable[_0x9762(0x159)]),Window_TpModes[_0x9762(0x159)]['constructor']=Window_TpModes,Window_TpModes['prototype'][_0x9762(0x17d)]=function(_0x5b08db){const _0x535d08=_0x9762;Window_Selectable['prototype']['initialize'][_0x535d08(0x1a0)](this,_0x5b08db),this['_actor']=null,this[_0x535d08(0x24b)]=[],this['hide']();},Window_TpModes[_0x9762(0x159)]['setActor']=function(_0x5d5c31){const _0x876649=_0x9762;this[_0x876649(0x21c)]!==_0x5d5c31&&(this[_0x876649(0x21c)]=_0x5d5c31,this[_0x876649(0x213)](),this[_0x876649(0x25a)](0x0,0x0));},Window_TpModes['prototype'][_0x9762(0x177)]=function(){return 0x2;},Window_TpModes['prototype'][_0x9762(0x24e)]=function(){return 0x10;},Window_TpModes['prototype']['maxItems']=function(){const _0x25c5fa=_0x9762;return this['_data']?this[_0x25c5fa(0x24b)]['length']:0x1;},Window_TpModes[_0x9762(0x159)][_0x9762(0x149)]=function(){const _0x5ecbe6=_0x9762;return this[_0x5ecbe6(0x176)](this[_0x5ecbe6(0x182)]());},Window_TpModes[_0x9762(0x159)]['itemAt']=function(_0x4f2f22){const _0x1866e9=_0x9762;return this[_0x1866e9(0x24b)]&&_0x4f2f22>=0x0?this[_0x1866e9(0x24b)][_0x4f2f22]:null;},Window_TpModes[_0x9762(0x159)][_0x9762(0x1e9)]=function(){const _0x2b7659=_0x9762;this['_actor']?this[_0x2b7659(0x24b)]=this[_0x2b7659(0x21c)][_0x2b7659(0x1cf)]():this[_0x2b7659(0x24b)]=[];},Window_TpModes[_0x9762(0x159)][_0x9762(0x242)]=function(){const _0x28d74c=_0x9762;this[_0x28d74c(0x179)](0x0);},Window_TpModes[_0x9762(0x159)][_0x9762(0x162)]=function(_0xca6366){const _0x211b69=_0x9762,_0x31c03c=this['itemAt'](_0xca6366);if(!_0x31c03c)return;const _0x15a181=this[_0x211b69(0x158)](_0xca6366);this['drawTpMode'](_0x31c03c,_0x15a181['x'],_0x15a181['y'],_0x15a181[_0x211b69(0x19b)],this['_actor']);},Window_TpModes['prototype']['updateHelp']=function(){const _0x4e0167=_0x9762;this[_0x4e0167(0x229)](this['item']());},Window_TpModes[_0x9762(0x159)][_0x9762(0x213)]=function(){const _0x3d1846=_0x9762;this[_0x3d1846(0x1e9)](),Window_Selectable[_0x3d1846(0x159)][_0x3d1846(0x213)]['call'](this);},Window_TpModes[_0x9762(0x159)]['playOkSound']=function(){SoundManager['playEquip']();};