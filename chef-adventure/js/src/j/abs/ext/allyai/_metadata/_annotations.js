//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.1 ALLYAI] Grants your allies AI to fight alongside the player.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @base J-ABS
 * @orderBefore J-ABS-InputManager
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables allies to leverage one of a selection of ally AI modes.
 *
 * This plugin requires JABS.
 * This plugin requires followers be enabled to do anything.
 * This plugin has plugin parameters that can adjust some arbitrary parameters.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * All members of the party represented by "followers" on the field will be
 * granted AI to enable action decision-making while in combat.
 *
 * In order to set a default ally AI mode (defaults to "variety"), you can use
 * a tag on the actor and/or class. Class will take priority over actor tags.
 *
 * ============================================================================
 * DEFAULT ALLY AI MODE:
 * Have you ever wanted to set the default AI mode of your allies to a
 * particular mode? Well now you can! By applying the appropriate tags to
 * actors/classes, you can allow your allies to have a preset ally AI mode!
 *
 * NOTE:
 * Tags on classes are considered "more granular" and thus take priority over
 * tags that exist on the actors.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 *
 * TAG FORMAT:
 *  <defaultAi:MODE>
 * Where MODE is one of the valid modes listed below.
 *
 * EXAMPLE:
 *  <defaultAi:do-nothing>
 * This ally will be set to the "do-nothing" mode by default.
 *
 * AVAILABLE MODES:
 * - Do Nothing (do-nothing):
 *   Your ally will take no action.
 *
 * - Only Attack (basic-attack):
 *   Your ally will only execute the action from their mainhand weapon.
 *
 * - Variety (variety):
 *   Your ally will pick and choose an action from it's available skills. There
 *   is a 50% chance that if an ally is in need of support, this mode will
 *   select a support skill instead- if any are equipped. This will leverage
 *   battle memories where applicable.
 *
 * - Full Force (full-force):
 *   Your ally will always select the skill that will deal the most damage to
 *   it's current target. This will leverage battle memories where applicable.
 *
 * - Support (support):
 *   Your ally will attempt to keep all allies in the vicinity healthy. They
 *   will first address any <negative> states, second address allies health who
 *   are below a designated threshold of max hp (configurable), third address
 *   an effort to buff allies and debuff enemies. For the buff/debuff address,
 *   the AI will make an active effort to keep your party buffed with all
 *   states available, and refresh states once they reach a designated
 *   threshold of duration (configurable) left.
 *
 * ----------------------------------------------------------------------------
 * NOTE ABOUT COMBOS WITH ALLY AI:
 * As the player can, your allies can potentially perform combo skills, but
 * they adhere to the same restrictions that the player does. However, unlike
 * the player, it is not dependent on button inputs, but instead dependent on
 * RNG to continue a combo. Each of the modes above provide different bonuses
 * to the base 50% chance for executing a combo:
 * - do-nothing:    no bonus.   (=50% chance)
 * - basic-attack:  +30% chance (=80% chance)
 * - variety:       +20% chance (=70% chance)
 * - full-force:    +50% chance (=100% chance!!!)
 * - support:       +10% chance (=60% chance)
 *
 * ----------------------------------------------------------------------------
 * BATTLE MEMORIES:
 * Additionally, in the modes of "Variety" and "Full Force", there is an extra
 * functionality to be considered called "battle memories"- unique to ally ai.
 * Battle Memories are effectively a snapshot recollection of your ally using
 * a skill against the enemy. The ally remembers the damage dealt, and the
 * level of effectiveness (elemental efficacy) versus a given target with a
 * given skill. This will influence the allies decision making when it comes to
 * deciding skills (preferring known effectiveness over otherwise).
 *
 * AGGRO/PASSIVE TOGGLE:
 * Lastly, there is a party-wide toggle available that will toggle between two
 * options: Passive and Aggressive. When "Passive" is enabled, your allies will
 * not engage unless they are hit directly, or you attack a foe. When
 * "Aggressive" is enabled, your allies will engage with any enemy that comes
 * within their designated sight range (configurable) similar to how enemies
 * will engage the player when you enter their sight range.
 *
 * ============================================================================
 * Caveats to note:
 * - When party-cycling, all allies will be pulled to the player and all aggro
 *   will be removed (so they don't just try to resume fighting).
 *
 * - When an ally is defeated, party-cycling will skip over them and they will
 *   follow the player like a normal non-battler follower.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.1
 *    Updated JABS menu integration with help text.
 * - 1.1.0
 *    Retroactively added this CHANGELOG.
 *    Upgraded AI to be able to leverage combos (enemy AI, too).
 *    Refactored code surrounding AI action decision-making.
 *    Refactored code surrounding ally AI assignment from command windows.
 *    Refactored code surrounding battler access and management.
 *    Refactored ally AI targeting.
 *    Removed dead code.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @param menuConfigs
 * @text MENU DETAILS
 *
 * @param jabsMenuAllyAiCommandName
 * @parent menuConfigs
 * @type string
 * @text Menu Text
 * @desc The text displayed in the JABS quick menu for the ally ai command.
 * @default Assign Ally AI
 *
 * @param jabsMenuAllyAiCommandIconIndex
 * @parent menuConfigs
 * @type number
 * @text Menu Icon
 * @desc The icon displayed beside the above menu text.
 * @default 2564
 *
 * @param jabsMenuAllyAiCommandSwitchId
 * @parent menuConfigs
 * @type number
 * @text Menu Switch
 * @desc The control switch for whether or not the ally ai command displays in the menu.
 * @default 101
 *
 * @param partyConfigs
 * @text PARTY-WIDE DETAILS
 *
 * @param partyWidePassiveText
 * @parent partyConfigs
 * @type string
 * @text Party Passive Text
 * @desc The text displayed when the party-wide toggle is set to "passive".
 * @default Passive Enabled
 *
 * @param partyWidePassiveIconIndex
 * @parent partyConfigs
 * @type number
 * @text Party Passive Icon
 * @desc The icon indicating party-wide passive engagement is enabled.
 * @default 4
 *
 * @param partyWideAggressiveText
 * @parent partyConfigs
 * @type string
 * @text Party Aggressive Text
 * @desc The text displayed when the party-wide toggle is set to "aggressive".
 * @default Aggressive Enabled
 *
 * @param partyWideAggressiveIconIndex
 * @parent partyConfigs
 * @type number
 * @text Party Aggressive Icon
 * @desc The icon indicating party-wide aggressive engagement is enabled.
 * @default 15
 *
 * @param aiModeConfigs
 * @text AI-MODE DETAILS
 *
 * @param aiModeEquipped
 * @parent aiModeConfigs
 * @type number
 * @text Mode Equipped Icon
 * @desc The icon indicating that the mode is equipped.
 * @default 91
 *
 * @param aiModeNotEquipped
 * @parent aiModeConfigs
 * @type number
 * @text Mode Not Equipped Icon
 * @desc The icon indicating that the mode is not equipped.
 * @default 95
 *
 * @param aiModeDoNothing
 * @parent aiModeConfigs
 * @type string
 * @text "Do Nothing" Text
 * @desc The text displayed for the ally ai mode of "do nothing".
 * @default Do Nothing
 *
 * @param aiModeOnlyAttack
 * @parent aiModeConfigs
 * @type string
 * @text "Only Attack" Text
 * @desc The text displayed for the ally ai mode of "only attack".
 * @default Only Attack
 *
 * @param aiModeVariety
 * @parent aiModeConfigs
 * @type string
 * @text "Variety" Text
 * @desc The text displayed for the ally ai mode of "variety".
 * @default Variety
 *
 * @param aiModeFullForce
 * @parent aiModeConfigs
 * @type string
 * @text "Full Force" Text
 * @desc The text displayed for the ally ai mode of "full force".
 * @default Full Force
 *
 * @param aiModeSupport
 * @parent aiModeConfigs
 * @type string
 * @text "Support" Text
 * @desc The text displayed for the ally ai mode of "support".
 * @default Support
 *
 */