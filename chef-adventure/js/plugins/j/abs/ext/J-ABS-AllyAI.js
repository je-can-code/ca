//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 ALLYAI] Grants your allies AI to fight alongside the player.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
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
 * - 1.2.0
 *    Removed ally AI code from core JABS and added here.
 *    Fixed issue where battle memories were not correctly applied.
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

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.3';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '3.3.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//endregion version check

//region plugin setup and configuration
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.ALLYAI = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.ALLYAI.Metadata = {};
J.ABS.EXT.ALLYAI.Metadata.Name = `J-ABS-AllyAI`;
J.ABS.EXT.ALLYAI.Metadata.Version = '1.2.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.ALLYAI.PluginParameters = PluginManager.parameters(J.ABS.EXT.ALLYAI.Metadata.Name);

// configuration for the main JABS quick menu command for ally AI.
J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandName = J.ABS.EXT.ALLYAI.PluginParameters['jabsMenuAllyAiCommandName'];
J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['jabsMenuAllyAiCommandIconIndex']);
J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandSwitchId = Number(J.ABS.EXT.ALLYAI.PluginParameters['jabsMenuAllyAiCommandSwitchId']);

// configuration for party-wide commands.
J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveText = J.ABS.EXT.ALLYAI.PluginParameters['partyWidePassiveText'];
J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['partyWidePassiveIconIndex']);
J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveText = J.ABS.EXT.ALLYAI.PluginParameters['partyWideAggressiveText'];
J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['partyWideAggressiveIconIndex']);

// configuration for the various ai modes.
J.ABS.EXT.ALLYAI.Metadata.AiModeEquippedIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['aiModeEquipped']);
J.ABS.EXT.ALLYAI.Metadata.AiModeNotEquippedIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['aiModeNotEquipped']);
J.ABS.EXT.ALLYAI.Metadata.AiModeDoNothingText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeDoNothing'];
J.ABS.EXT.ALLYAI.Metadata.AiModeOnlyAttackText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeOnlyAttack'];
J.ABS.EXT.ALLYAI.Metadata.AiModeVarietyText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeVariety'];
J.ABS.EXT.ALLYAI.Metadata.AiModeFullForceText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeFullForce'];
J.ABS.EXT.ALLYAI.Metadata.AiModeSupportText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeSupport'];

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.ALLYAI.Aliased = {
  Game_Actor: new Map(),
  Game_BattleMap: new Map(),
  Game_Battler: {},
  Game_Follower: new Map(),
  Game_Followers: new Map(),
  Game_Interpreter: {},
  Game_Map: new Map(),
  Game_Party: new Map(),
  Game_Player: {},

  JABS_AiManager: new Map(),
  JABS_Battler: new Map(),

  Scene_Map: {},

  Window_AbsMenu: new Map(),
  Window_AbsMenuSelect: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.ALLYAI.RegExp = {};
J.ABS.EXT.ALLYAI.RegExp.DefaultAi = /<defaultAi:(do-nothing|basic-attack|variety|full-force|support)>/i;
//endregion plugin setup and configuration
//endregion Introduction

//region JABS_AllyAI
/**
 * A class representing the AI-decision-making functionality for allies.
 */
function JABS_AllyAI()
{
  this.initialize(...arguments);
}

JABS_AllyAI.prototype = Object.create(JABS_AI.prototype);
JABS_AllyAI.prototype.constructor = JABS_AllyAI;

//region statics
/**
 * The strict enumeration of what ai modes are available for ally ai.
 * @type {any}
 */
JABS_AllyAI.modes = {
  /**
   * When this mode is assigned, the battler will take no action.
   */
  DO_NOTHING: {
    key: "do-nothing",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeDoNothingText,
  },

  /**
   * When this mode is assigned, the battler will only use their mainhand attack skill.
   * If no skill is equipped in their main hand, they will do nothing.
   */
  BASIC_ATTACK: {
    key: "basic-attack",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeOnlyAttackText,
  },

  /**
   * When this mode is assigned, the battler will intelligently decide from any skill they have equipped.
   */
  VARIETY: {
    key: "variety",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeVarietyText
  },

  /**
   * When this mode is assigned, the battler will use the biggest and strongest skills available.
   */
  FULL_FORCE: {
    key: "full-force",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeFullForceText
  },

  /**
   * When this mode is assigned, the battler will prioritize supporting and healing allies.
   */
  SUPPORT: {
    key: "support",
    name: J.ABS.EXT.ALLYAI.Metadata.AiModeSupportText
  },
};

/**
 * Gets all valid values of the possible modes currently implemented.
 * @returns {any[]}
 */
JABS_AllyAI.getModes = () => Object
  .keys(JABS_AllyAI.modes)
  .map(key => JABS_AllyAI.modes[key]);

/**
 * Validates the input of a mode to ensure it is one of the available and implemented ally ai modes.
 * @param {string} potentialMode The mode to validate.
 * @returns {boolean}
 */
JABS_AllyAI.validateMode = potentialMode => JABS_AllyAI
  .getModes()
  .find(mode => mode.key === potentialMode);
//endregion statics

//region initialize
/**
 * Initializes this class.
 * @param {string} initialMode The mode to start out in.
 */
JABS_AllyAI.prototype.initialize = function(initialMode)
{
  this.mode = initialMode;
  this.initMembers();
};

/**
 * Initializes all default members of this class.
 */
JABS_AllyAI.prototype.initMembers = function()
{
  /**
   * The collection of memories this ally ai possesses.
   * @type {JABS_BattleMemory[]}
   */
  this.memory = [];
};
//endregion initialize

//region mode
/**
 * Gets the current mode this ally's AI is set to.
 * @returns {string}
 */
JABS_AllyAI.prototype.getMode = function()
{
  return this.mode;
};

/**
 * Changes the current AI mode this ally is set to.
 * @param {string} newMode
 */
JABS_AllyAI.prototype.changeMode = function(newMode)
{
  if (!JABS_AllyAI.validateMode(newMode))
  {
    console.error(`Attempted to assign ally ai mode: [${newMode}], but is not a valid ai mode.`);
    return;
  }

  this.mode = newMode;
};
//endregion mode

//region decide action
/**
 * Decides an action based on this battler's AI, the target, and the given available skills.
 * @param {JABS_Battler} user The battler of the AI deciding a skill.
 * @param {JABS_Battler} target The target battler to decide an action against.
 * @param {number[]} availableSkills A collection of all skill ids to potentially pick from.
 * @returns {number|null} The skill id chosen to use, or null if none were valid choices for this AI.
 */
JABS_AllyAI.prototype.decideAction = function(user, target ,availableSkills)
{
  // filter out the unusable or invalid skills.
  const usableSkills = this.filterUncastableSkills(user, availableSkills);

  // determine which AI mode the ally is assigned.
  const currentMode = this.getMode();

  // pivot on the ai mode selected to decide what skill to use.
  switch (currentMode)
  {
    case JABS_AllyAI.modes.DO_NOTHING.key:
      return this.decideDoNothing(user);
    case JABS_AllyAI.modes.BASIC_ATTACK.key:
      return this.decideBasicAttack(usableSkills, user);
    case JABS_AllyAI.modes.VARIETY.key:
      return this.decideVariety(usableSkills, user, target);
    case JABS_AllyAI.modes.FULL_FORCE.key:
      return this.decideFullForce(usableSkills, user, target);
    case JABS_AllyAI.modes.SUPPORT.key:
      return this.decideSupport(usableSkills, user);
    default:
      return usableSkills.at(0);
  }
};

//region do-nothing
/**
 * Decides to do nothing and waits a short amount of time before doing anything else.
 * @returns {null}
 */
JABS_AllyAI.prototype.decideDoNothing = function(attacker)
{
  // forces a short wait before thinking about what to do next.
  attacker.setWaitCountdown(20);

  // return nothing to indicate no action should be taken.
  return null;
};
//endregion do-nothing

//region basic-attack
/**
 * Decides a skill id based on the ai mode of "basic attack only".
 * @param {number[]} usableSkills The skill ids available to choose from.
 * @param {JABS_Battler} user The battler choosing the skill.
 * @returns {number|null}
 */
JABS_AllyAI.prototype.decideBasicAttack = function(usableSkills, user)
{
  // check first if we should follow with the next hit of the combo.
  if (this.shouldFollowWithCombo(user))
  {
    // we're doing the next combo in the chain!
    return this.followWithCombo(user);
  }

  // determine which skill of the skills available is the mainhand skill.
  const mainBasicAttackSkillId = usableSkills
    .find(id => user.getBattler().findSlotForSkillId(id).key === JABS_Button.Mainhand);

  // determine which skill of the skills available is the offhand skill.
  const offhandBasicAttackSkillId = usableSkills
    .find(id => user.getBattler().findSlotForSkillId(id).key === JABS_Button.Offhand);

  // if we have neither basic attack skills, then do not process.
  if (!mainBasicAttackSkillId && !offhandBasicAttackSkillId) return null;

  // check if we have to decide between using mainhand or offhand.
  if (mainBasicAttackSkillId && offhandBasicAttackSkillId)
  {
    // a 70% chance to use mainhand, 30% chance to use offhand by default.
    return RPGManager.chanceIn100(70)
      ? mainBasicAttackSkillId
      : offhandBasicAttackSkillId;
  }

  // check if we do not have a mainhand skill.
  if (!mainBasicAttackSkillId)
  {
    // in which case we return the offhand skill.
    return offhandBasicAttackSkillId;
  }
  // since we do have a mainhand skill.
  else
  {
    // lets return it.
    return mainBasicAttackSkillId;
  }
};
//endregion basic-attack

//region variety
/**
 * Decides a skill id based on the ai mode of "variety".
 * If no allies are in danger, then simply chooses a random skill.
 * Will learn over time which skills are effective and ineffective against targets.
 * May use a support skill if allies are below half health.
 * @param {number[]} usableSkills The skill ids available to choose from.
 * @param {JABS_Battler} user The battler choosing the skill.
 * @param {JABS_Battler} target The targeted battler to use the skill against.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideVariety = function(usableSkills, user, target)
{
  // check first if we should follow with the next hit of the combo.
  if (this.shouldFollowWithCombo(user))
  {
    // we're doing the next combo in the chain!
    return this.followWithCombo(user);
  }

  // initialize the chosen skill id.
  let chosenSkillId = 0;

  // locally capture the list of usable skills for modification.
  let tempAvailableSkills = usableSkills;

  // check if any nearby allies are "in danger".
  const nearbyAllies = user.getAllNearbyAllies();
  const anyAlliesInDanger = nearbyAllies.some(battler => battler.getBattler().currentHpPercent() < 0.6);

  // if they are allies in danger, 50:50 chance to instead prioritize a support action.
  if (anyAlliesInDanger && Math.randomInt(2) === 0)
  {
    return this.decideSupport(usableSkills, user);
  }

  // grab all memories that this battler has of the target.
  const memoriesOfTarget = this.memory.filter(mem => mem.battlerId === target.getBattlerId());

  // filter all available skills down to what we recall as effective.
  if (memoriesOfTarget.length)
  {
    tempAvailableSkills = this.filterMemoriesByEffectiveness(tempAvailableSkills, memoriesOfTarget);
  }

  // if no skill was effective, or there were no memories, just pick a random skill and call it good.
  if (tempAvailableSkills.length === 0)
  {
    chosenSkillId = usableSkills.at(Math.randomInt(usableSkills.length));
  }

  // if the memories yielded a single effective skill, then 50/50 between that and a random skill.
  if (tempAvailableSkills.length === 1)
  {
    chosenSkillId = Math.randomInt(2) === 0
      ? tempAvailableSkills[0]
      : usableSkills[Math.randomInt(usableSkills.length)];
  }

  // if there were multiple memories of effective skills against the target, then randomly pick one.
  if (tempAvailableSkills.length > 1)
  {
    chosenSkillId = tempAvailableSkills[Math.randomInt(tempAvailableSkills.length)];
  }

  // return the decided skill id.
  return chosenSkillId;
};
//endregion variety

//region full-force
/**
 * Decides a skill id based on the ai mode of "full-force".
 * Always looks to choose the skill that will deal the most damage.
 * If we developed effective memories, then we may leverage those instead.
 * @param {number[]} usableSkills The skill ids available to choose from.
 * @param {JABS_Battler} user The battler choosing the skill.
 * @param {JABS_Battler} target The targeted battler to use the skill against.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideFullForce = function(usableSkills, user, target)
{
  // check first if we should follow with the next hit of the combo.
  if (this.shouldFollowWithCombo(user))
  {
    // we're doing the next combo in the chain!
    return this.followWithCombo(user);
  }

  let chosenSkillId = 0;
  let tempAvailableSkills = usableSkills;

  // determine the strongest skill available that this user can execute.
  const strongestSkillId = this.determineStrongestSkill(usableSkills, user, target);

  // grab all memories that this battler has of the target.
  const memoriesOfTarget = this.memory.filter(mem => mem.battlerId === target.getBattlerId());

  // check to make sure we have memories before analyzing them.
  if (memoriesOfTarget.length)
  {
    // filter the available skills by what was remembered to be effective.
    tempAvailableSkills = this.filterMemoriesByEffectiveness(tempAvailableSkills, memoriesOfTarget);
  }

  // check if we have no known effective skills.
  if (tempAvailableSkills.length === 0)
  {
    // if we no longer have any skills to pick from after filtering, then pick the strongest.
    chosenSkillId = this.determineStrongestSkill(usableSkills, user, target);
  }
  // we found exactly 1 effective skill.
  else if (tempAvailableSkills.length === 1)
  {
    // grab the known effective skill.
    const knownEffectiveSkill = tempAvailableSkills.at(0);

    // check if the strongest skill available is also the already-known effective skill.
    if (strongestSkillId === knownEffectiveSkill)
    {
      // if the strongest skill that was just calculated is the effective skill, then just use that.
      chosenSkillId = strongestSkillId;
    }
    // the strongest skill is different than the known effective skill.
    else
    {
      // 50% chance of picking either the strongest or the already-known effective skill.
      chosenSkillId = RPGManager.chanceIn100(50)
        ? strongestSkillId
        : knownEffectiveSkill;
    }
  }
  // we have more than 1 effective skill to work with.
  else
  {
    // if we have multiple previously proven-effective skills, then just pick one of those.
    chosenSkillId = tempAvailableSkills.at(Math.randomInt(tempAvailableSkills.length));
  }

  // return the chosen skill.
  return chosenSkillId;
};
//endregion full-force

//region support
/**
 * Decides a skill id based on this ally's current AI mode.
 * This mode prioritizes keeping allies alive.
 * Support priorities = cleansing > healing > buffing.
 * @param {number[]} usableSkills The skill ids available to choose from.
 * @param {JABS_Battler} user The battler choosing the skill.
 * @returns {number} The chosen support skill id to perform.
 */
JABS_AllyAI.prototype.decideSupport = function(usableSkills, user)
{
  // check first if we should follow with the next hit of the combo.
  if (this.shouldFollowWithCombo(user))
  {
    // we're doing the next combo in the chain!
    return this.followWithCombo(user);
  }

  // initialize our support skill id.
  let supportSkillId = 0;

  // first priority is cleansing status ailments, including death, from allies.
  supportSkillId = this.decideSupportCleansing(usableSkills, user);

  // check if there was no need for cleansing.
  if (!supportSkillId)
  {
    // prioritize recovering missing health for allies.
    supportSkillId = this.decideSupportHealing(usableSkills, user);
  }

  // check if there was no need for healing.
  if (!supportSkillId)
  {
    // prioritize status buffing on allies.
    supportSkillId = this.decideSupportBuffing(usableSkills, user);
  }

  // check if there was no need for any healing.
  if (!supportSkillId)
  {
    // do nothing.
    return this.decideDoNothing(user);
  }

  // return the chosen skill id.
  return supportSkillId;
};

//region support-cleansing
/**
 * Decides on the best cleansing skill from the selection of skills available.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideSupportCleansing = function(availableSkills, healer)
{
  const nearbyAllies = healer.getAllNearbyAllies();
  let bestSkillId = 0;

  // iterate over all nearby allies.
  nearbyAllies.forEach(ally =>
  {
    const allyBattler = ally.getBattler();

    // and check each of their states.
    const allyStates = allyBattler.states();
    if (allyStates.length > 0)
    {

      // the find the first one that we can cleanse.
      const cleansableState = allyStates.find(state =>
      {
        const isNegative = state.jabsNegative; // skills to be cleansed have a "negative" tag.
        const canBeCleansed = this.determineBestSkillForStateCleansing(availableSkills, state.id, healer);
        return isNegative && canBeCleansed;
      });

      // if we have a cleansable state, then return the best skill for it.
      if (cleansableState)
      {
        bestSkillId = this.determineBestSkillForStateCleansing(availableSkills, cleansableState.id, healer);
      }
    }
  });

  return bestSkillId;
};

/**
 * Determines which skill of the available skills is the most effective for cleansing a given state.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {number} stateIdToBeCleansed The id of the state to be cleansed.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.determineBestSkillForStateCleansing = function(availableSkills, stateIdToBeCleansed, healer)
{
  let bestSkillForStateCleansing = null;
  let highestCleanseRate = 0.0;

  // iterate over all skills available to find the best rate of state removal for the target state.
  availableSkills.forEach(skillId =>
  {
    const skill = healer.getSkill(skillId);

    // find all effects from a skill that remove states.
    const stateCleansingEffects = skill.effects.filter(fx => fx.code === 22 && fx.dataId === stateIdToBeCleansed);

    // if we have effects...
    if (stateCleansingEffects.length > 0)
    {

      // ...iterate over them to find the best rate of state removal.
      stateCleansingEffects.forEach(effect =>
      {
        if (highestCleanseRate < effect.value1)
        {
          bestSkillForStateCleansing = skillId;
          highestCleanseRate = effect.value1;
        }
      });
    }
  });

  return bestSkillForStateCleansing;
};
//endregion support-cleansing

//region support-healing
/**
 * Decides on the best healing skill from the selection of skills available.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideSupportHealing = function(availableSkills, healer)
{
  // filter out the skills that aren't for allies.
  const healingTypeSkills = availableSkills.filter(skillId =>
  {
    const testAction = new Game_Action(healer.getBattler());
    testAction.setSkill(skillId);
    return (testAction.isForAliveFriend() &&  // must target living allies.
      testAction.isRecover() &&               // must recover something.
      testAction.isHpEffect());               // must affect hp.
  });

  let bestSkillId = 0;

  // if we have no healing type skills, then do nothing.
  if (healingTypeSkills.length === 0) return bestSkillId;

  // set the lowest hp ally as your target for supporting with one of our skills.
  const lowestAlly = this.determineLowestHpAlly(healer);
  healer.setAllyTarget(lowestAlly);

  // get all the low hp allies.
  const below60 = this.countLowHpAllies(healer);
  const lowestAllyBattler = lowestAlly.getBattler();
  const healerBattler = healer.getBattler();

  // depending on how many wounded targets we have, determine the best healing skill to use.
  if (below60 === 0)
  {
    // if we have no targets in need of healing, then don't.
    return bestSkillId;
  }

  if (below60 === 1)
  {
    // find the best fit healing skill for a single target.
    bestSkillId = this.bestFitHealingOneSkill(healingTypeSkills, healerBattler, lowestAllyBattler);
  }
  else if (below60 >= 2)
  {
    // find the best fit healing skill for all targets.
    bestSkillId = this.bestFitHealingAllSkill(healingTypeSkills, healerBattler, lowestAllyBattler);
  }

  return bestSkillId;
};

/**
 * Gets the lowest hp ally nearby.
 * @param {JABS_Battler} healer The battler performing the healing.
 * @returns {JABS_Battler}
 */
JABS_AllyAI.prototype.determineLowestHpAlly = function(healer)
{
  const nearbyAllies = healer.getAllNearbyAllies();

  // determine the lowest ally within range.
  let lowestAlly = null;
  nearbyAllies.forEach(ally =>
  {
    if (!lowestAlly)
    {
      // if we don't yet have a lowest ally, assign it.
      lowestAlly = ally;
    }
    else if (ally.getBattler()
      .currentHpPercent() < lowestAlly.getBattler()
      .currentHpPercent())
    {
      // update the ally to determine the lowest ally with the lowest hp.
      lowestAlly = ally;
    }
  });

  return lowestAlly;
};

/**
 * Gets how many of the nearby allies are BELOW the given hp threshold.
 * The default threshold is 60% of max hp.
 * @param {JABS_Battler} healer The battler performing the healing.
 * @param {number} threshold The percent (decimal between 0-1) of what is defined as "low" hp.
 * @returns {number}
 */
JABS_AllyAI.prototype.countLowHpAllies = function(healer, threshold = 0.6)
{
  const nearbyAllies = healer.getAllNearbyAllies();
  let belowThreshold = 0;
  // tally up the allies below the threshold % hp.
  nearbyAllies.forEach(ally =>
  {
    if (ally.getBattler()
      .currentHpPercent() < threshold)
    {
      belowThreshold++;
    }
  });

  return belowThreshold;
};

/**
 * Finds the best-fit healing skill for the target.
 * This is agnostic to whether or not the skill is a multi-target healing skill.
 * @param {number[]} healingTypeSkills The collection of skills that heal hp.
 * @param {Game_Battler} healerBattler The battler choosing the skill.
 * @param {Game_Battler} lowestAllyBattler The ally battler who has the lowest hp.
 * @returns {number}
 */
JABS_AllyAI.prototype.bestFitHealingOneSkill = function(healingTypeSkills, healerBattler, lowestAllyBattler)
{
  let bestSkillId = 0;
  let smallestDifference = Number.MAX_SAFE_INTEGER; // need it to be an unrealistically high difference to start.
  healingTypeSkills.forEach(skillId =>
  {
    const skill = healerBattler.skill(skillId);
    const testAction = new Game_Action(healerBattler);
    testAction.setItemObject(skill);

    // if the lowest ally isn't yourself, and this skill only targets yourself, don't consider it.
    if (healerBattler !== lowestAllyBattler && testAction.isForUser()) return;

    // if the skill doesn't target 1 or all or dead allies, then don't use it (omit random).
    if (!testAction.isForOne() && !testAction.isForAll() && !testAction.isForDeadFriend()) return;

    // get the test heal amount for this skill against the ally.
    const healAmount = Math.abs(testAction.makeDamageValue(lowestAllyBattler, false));

    // determine the difference between the closest healing to full and
    const differenceFromMax = Math.abs((lowestAllyBattler.hp + healAmount) - lowestAllyBattler.mhp);
    if (differenceFromMax < smallestDifference)
    {
      bestSkillId = skillId;
      smallestDifference = differenceFromMax;
    }
  });

  return bestSkillId;
};

/**
 * Finds the best-fit healing skill for multiple targets.
 * If there are no multi-target healing skills available, will instead choose the best single-target.
 * If
 * @param {number[]} healingTypeSkills The collection of skills that heal hp.
 * @param {Game_Battler} healerBattler The battler choosing the skill.
 * @param {Game_Battler} lowestAllyBattler The ally battler who has the lowest hp.
 * @returns {number}
 */
JABS_AllyAI.prototype.bestFitHealingAllSkill = function(healingTypeSkills, healerBattler, lowestAllyBattler)
{
  let bestSkillId = 0;

  // filter out all skills that are not for multiple targets.
  const multiTargetHealingTypeSkills = healingTypeSkills.filter(skillId =>
  {
    const skill = healerBattler.skill(skillId);
    const testAction = new Game_Action(healerBattler);
    testAction.setItemObject(skill);
    return testAction.isForAll();
  });

  // if we have no skills that are multi-targeting, then instead find the best single target.
  if (multiTargetHealingTypeSkills.length === 0) return this.bestFitHealingOneSkill();

  // if there is only one skill that multi-targets, then use that.
  if (multiTargetHealingTypeSkills.length === 1) return multiTargetHealingTypeSkills[0];

  let smallestDifference = 99999999; // need it to be an unrealistically high difference to start.
  multiTargetHealingTypeSkills.forEach(skillId =>
  {
    const skill = healerBattler.skill(skillId);
    const testAction = new Game_Action(healerBattler);
    testAction.setItemObject(skill);

    // get the test heal amount for this skill against the ally.
    const healAmount = Math.abs(testAction.makeDamageValue(lowestAllyBattler, false));

    // determine the difference between the closest healing to full and
    const differenceFromMax = Math.abs((lowestAllyBattler.hp + healAmount) - lowestAllyBattler.mhp);
    if (differenceFromMax < smallestDifference)
    {
      bestSkillId = skillId;
      smallestDifference = differenceFromMax;
    }
  });

  return bestSkillId;
};
//endregion support-healing

//region support-buffing
/**
 * Decides on the best buffing skill from the selection of skills available.
 * @param {number[]} availableSkills The skill ids available to choose from.
 * @param {JABS_Battler} healer The battler choosing the skill.
 * @returns {number}
 */
JABS_AllyAI.prototype.decideSupportBuffing = function(availableSkills, healer)
{
  const nearbyAllies = healer.getAllNearbyAllies();

  // iterate over all skills available to find a state that would benefit your allies.
  let bestSkillId = 0;
  let chosenAlly = null;
  availableSkills.forEach(skillId =>
  {
    const skill = healer.getSkill(skillId);

    // find all effects from a skill that add states.
    const stateAddingEffects = skill.effects.filter(fx => fx.code === 21);

    // if we have effects...
    if (stateAddingEffects.length > 0)
    {
      // ...iterate over them...
      let ready = false;
      stateAddingEffects.forEach(effect =>
      {
        if (ready) return;

        // ...and check each ally and see if they have it yet.
        nearbyAllies.forEach(ally =>
        {
          // see if the state for this ally is expired or about to expire.
          const trackedState = $jabsEngine.getJabsStateByUuidAndStateId(ally.getUuid(), effect.dataId);
          if (!trackedState || trackedState.isAboutToExpire())
          {
            // stop looking and use the below skill and target ally.
            ready = true;
            bestSkillId = skillId;
            chosenAlly = ally;
          }
        });
      });
    }
  });

  // if we ended up deciding an ally, then set them for targeting.
  if (chosenAlly)
  {
    healer.setAllyTarget(chosenAlly);
  }

  return bestSkillId;
};
//endregion support-buffing
//endregion support

/**
 * Overrides {@link #aiComboChanceModifier}.<br>
 * Adjusts the bonus combo chance modifier based on the selected ally AI mode.
 * @returns {number}
 */
JABS_AllyAI.prototype.aiComboChanceModifier = function()
{
  // determine which AI mode the ally is assigned.
  const currentMode = this.getMode().key;

  // modify the combo chance based on the selected AI mode.
  switch (currentMode)
  {
    case JABS_AllyAI.modes.BASIC_ATTACK.key:
      return 30;
    case JABS_AllyAI.modes.VARIETY.key:
      return 20;
    case JABS_AllyAI.modes.FULL_FORCE.key:
      return 50;
    case JABS_AllyAI.modes.SUPPORT.key:
      return 10;
    default:
      return 0;
  }
};
//endregion decide action

//region battle memory
/**
 * Handles a new memory for this battler's ally ai.
 * @param {JABS_BattleMemory} newMemory The new memory to handle.
 */
JABS_AllyAI.prototype.applyMemory = function(newMemory)
{
  const memory = this.getMemory(newMemory.battlerId, newMemory.skillId);
  if (!memory)
  {
    this.addMemory(newMemory);
  }
  else
  {
    this.updateMemory(newMemory);
  }
};

/**
 * Gets a memory for a given battler id and skill id.
 * @param {number} battlerId The composite key of the battler id to find a memory for.
 * @param {number} skillId The composite key of the skill id to find a memory for.
 * @returns {JABS_BattleMemory}
 */
JABS_AllyAI.prototype.getMemory = function(battlerId, skillId)
{
  return this.getMemories().find(mem => mem.battlerId === battlerId && mem.skillId === skillId);
};

/**
 * Gets all memories currently saved by this ally.
 * @returns {JABS_BattleMemory[]}
 */
JABS_AllyAI.prototype.getMemories = function()
{
  return this.memory;
};

/**
 * Adds a new battle memory to this ally ai.
 * @param {JABS_BattleMemory} newMemory The new memory to add to the collection.
 */
JABS_AllyAI.prototype.addMemory = function(newMemory)
{
  this.memory.push(newMemory);
  this.memory.sort();
};

/**
 * Updates a battle memory with the new one.
 * @param {JABS_BattleMemory} newMemory The new memory to replace the old.
 */
JABS_AllyAI.prototype.updateMemory = function(newMemory)
{
  let memory = this.getMemory(newMemory.battlerId, newMemory.skillId);
  memory.effectiveness = newMemory.effectiveness;
  memory.damageApplied = newMemory.damageApplied;
  this.memory.sort();
};

/**
 * Filters out all "ineffective" skills from a list of possible skills based on
 * ones own memories.
 * @param {number[]} usableSkills The collection of skillIds that are being filtered.
 * @param {JABS_BattleMemory[]} memoriesOfTarget All currently stored memories this AI has for a given target.
 * @returns {number[]} All "effective" skills after the filtering has taken place.
 */
JABS_AllyAI.prototype.filterMemoriesByEffectiveness = function(usableSkills, memoriesOfTarget)
{
  // a filtering function for filtering out unknown or ineffective skill ids.
  const filtering = skillId =>
  {
    // grab the prior memory based on the skill id.
    const priorMemory = memoriesOfTarget.find(mem => mem.skillId === skillId);

    // if there was no prior memory, then this skill isn't known to be effective.
    if (!priorMemory) return false;

    // if the memory exists and was effective, then include this skill.
    if (priorMemory.wasEffective()) return true;

    // the memory existed, but wasn't effective, so disclude this skill.
    return false;
  };

  // return the filtered list of skills.
  return usableSkills.filter(filtering, this);
};
//endregion battle memory
//endregion JABS_AllyAI

//region JABS_BattleMemory
/**
 * A class representing a single battle memory.
 * Battle memories are simply a mapping of the battler targeted, the skill used, and
 * the effectiveness of the skill on the target.
 * This is used when the AI decides which action to use.
 */
function JABS_BattleMemory()
{
  this.initialize(...arguments);
}

JABS_BattleMemory.prototype = {};
JABS_BattleMemory.prototype.constructor = JABS_BattleMemory;

/**
 * Initializes this class.
 * @param {number} battlerId The id of the battler the memory is built on.
 * @param {number} skillId The skill id executed against the battler.
 * @param {number} effectiveness The level of effectiveness of the skill used on this battler.
 * @param {boolean} damageApplied The damage applied to the target.
 */
JABS_BattleMemory.prototype.initialize = function(battlerId, skillId, effectiveness, damageApplied)
{
  /**
   * The id of the battler targeted.
   * @type {number}
   */
  this.battlerId = battlerId;

  /**
   * The id of the skill executed.
   * @type {number}
   */
  this.skillId = skillId;

  /**
   * How elementally effective the skill was that was used on the given battler id.
   * @type {boolean}
   */
  this.effectiveness = effectiveness;

  /**
   * The damage dealt from this action.
   */
  this.damageApplied = damageApplied;
};

/**
 * Checks if this memory was an effective one.
 * @returns {boolean}
 */
JABS_BattleMemory.prototype.wasEffective = function()
{
  return this.effectiveness >= 1;
};
//endregion JABS_BattleMemory

//region JABS_Battler
/**
 * Extends the engagement determination to handle aggro/passive party toggling.
 * @param {JABS_Battler} target The target to see if we should engage with.
 * @returns {boolean}
 */
J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.set('shouldEngage', JABS_Battler.prototype.shouldEngage);
JABS_Battler.prototype.shouldEngage = function(target, distance)
{
  // enemies follow standard behavior.
  if (this.isEnemy())
  {
    // perform original logic.
    return J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get('shouldEngage').call(this, target, distance);
  }

  // aggro allies against non-inanimate targets also follow standard behavior.
  if ($gameParty.isAggro() && !target.isInanimate())
  {
    // perform original logic.
    return J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get('shouldEngage').call(this, target, distance);
  }

  // determine if the ally should engage the foe.
  return this.shouldAllyEngage(target, distance);
};

/**
 * Determines whether or not the ally should engage in combat with the target.
 * @param {JABS_Battler} target The target to potentially engage with.
 * @param {number} distance The distance from this battler to the nearest potential target.
 * @returns {boolean} True if this ally should engage in combat, false otherwise.
 */
JABS_Battler.prototype.shouldAllyEngage = function(target, distance)
{
  // allies cannot engage against inanimate targets.
  if (target.isInanimate()) return false;

  // check if the target is visible to this ally.
  if (!this.inSightRange(target, distance)) return false;

  // check if this ally is alerted.
  const isAlerted = this.isAlerted();

  // check if the player has a "last hit" target.
  const playerHitSomething = $jabsEngine.getPlayer1().hasBattlerLastHit();

  // if we are alerted or the player is attacking something, lets fight.
  const shouldEngage = (isAlerted || playerHitSomething);

  // return the determination.
  return shouldEngage;
};

/**
 * Gets all allies to this battler within a large range.
 * (Not map-wide because that could result in unexpected behavior)
 * @returns {JABS_Battler[]}
 */
JABS_Battler.prototype.getAllNearbyAllies = function()
{
  return JABS_AiManager.getAlliedBattlersWithinRange(this, JABS_Battler.allyRubberbandRange());
};

/**
 * Gets the ally ai associated with this battler.
 * @returns {JABS_AllyAI}
 */
JABS_Battler.prototype.getAllyAiMode = function()
{
  // enemies do not have ally ai.
  if (this.isEnemy()) return null;

  return this.getBattler().getAllyAI();
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
//endregion JABS_Battler

//region JABS_AiManager
/**
 * Extends `aiPhase0()` to accommodate the possibility of actors having an idle phase.
 * @param {JABS_Battler} battler The batter to decide for.
 */
J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.set('aiPhase0', JABS_AiManager.aiPhase0);
JABS_AiManager.aiPhase0 = function(battler)
{
  // check if this is an enemy's ai being managed.
  if (battler.isEnemy())
  {
    // perform original logic for enemies.
    J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.get('aiPhase0').call(this, battler);
  }
  // it must be an ally.
  else
  {
    // process ally idle phase.
    this.allyAiPhase0(battler);
  }
};

/**
 * Decides what to do for allies in their idle phase.
 * @param {JABS_Battler} allyBattler The ally battler.
 */
JABS_AiManager.allyAiPhase0 = function(allyBattler)
{
  // check if we can perform phase 0 things.
  if (!this.canPerformAllyPhase0(allyBattler)) return;

  // phase 0 for allies is just seeking for alerters if necessary.
  this.seekForAlerter(allyBattler);
};

/**
 * Determines whether or not the ally can do phase 0 things.
 * @param {JABS_Battler} allyBattler The ally battler.
 * @returns {boolean} True if this ally can do phae 0 things, false otherwise.
 */
JABS_AiManager.canPerformAllyPhase0 = function(allyBattler)
{
  // if we are not alerted, do not idle.
  if (!allyBattler.isAlerted()) return false;

  // if we are in active motion, do not idle.
  if (!allyBattler.getCharacter().isStopping()) return false;

  // perform!
  return true;
};

/**
 * Extends {@link #decideAiPhase2Action}.<br>
 * Includes handling ally AI as well as enemy.
 * @param {JABS_Battler} battler The battler deciding the action.
 */
J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.set('decideAiPhase2Action', JABS_AiManager.decideAiPhase2Action);
JABS_AiManager.decideAiPhase2Action = function(battler)
{
  // check if the battler is an enemy.
  if (battler.isEnemy())
  {
    // perform original logic for enemies.
    J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.get('decideAiPhase2Action').call(this, battler);
  }
  // it isn't an enemy, it must be an ally.
  else
  {
    // perform ally AI instead.
    this.decideAllyAiPhase2Action(battler);
  }
};

/**
 * The ally battler decides what action to take.
 * Based on it's AI traits, it will make a decision on an action to take.
 * @param {JABS_Battler} jabsBattler The ally battler deciding the action.
 */
JABS_AiManager.decideAllyAiPhase2Action = function(jabsBattler)
{
  // grab the underlying battler deciding the action.
  const battler = jabsBattler.getBattler();

  // get all slots that have skills in them.
  const validSkillSlots = battler.getValidSkillSlotsForAlly();

  // convert the slots into their respective skill ids.
  const currentlyEquippedSkillIds = validSkillSlots.map(skillSlot => skillSlot.id);

  // decide the action based on the ally ai mode currently assigned.
  const decidedSkillId = jabsBattler
    .getAllyAiMode()
    .decideAction(
      jabsBattler,
      jabsBattler.getTarget(),
      currentlyEquippedSkillIds);

  // validate the skill chosen.
  if (!this.isSkillIdValid(decidedSkillId))
  {
    // cancel the setup.
    this.cancelActionSetup(jabsBattler);

    // stop processing.
    return;
  }

  // TODO: allow allies to use dodge skills, but code the AI to use it intelligently.
  // check if the skill id is actually a mobility skill.
  if (JABS_Battler.isDodgeSkillById(decidedSkillId))
  {
    // cancel the setup.
    this.cancelActionSetup(jabsBattler);

    // stop processing.
    return;
  }

  // determine the slot to apply the cooldown to.
  const decidedSkillSlot = battler.findSlotForSkillId(decidedSkillId);

  // build the cooldown from the skill.
  const cooldownKey = decidedSkillSlot.key;

  // setup the action for use!
  this.setupActionForNextPhase(jabsBattler, decidedSkillId, cooldownKey);
};
//endregion JABS_AiManager

//region JABS_Engine
/**
 * Extends {@link JABS_Engine.prePartyCycling}.<br>
 * Jumps all followers to the player upon party cycling.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.set('prePartyCycling', JABS_Engine.prototype.prePartyCycling);
JABS_Engine.prototype.prePartyCycling = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.get('prePartyCycling').call(this);

  // when cycling, jump all followers to the player.
  $gamePlayer.jumpFollowersToMe();
};

/**
 * Overrides {@link JABS_Engine.handlePartyCycleMemberChanges}.<br>
 * Jumps all followers to the player upon party cycling.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.set('handlePartyCycleMemberChanges', JABS_Engine.prototype.handlePartyCycleMemberChanges);
JABS_Engine.prototype.handlePartyCycleMemberChanges = function()
{
  // grab the current data for removing after to prevent duplicate players.
  const formerLeader = $gameParty.leaderJabsBattler();

  // check to make sure we have a leader.
  if (formerLeader)
  {
    // remove the former leader to make room for them as a follower!
    JABS_AiManager.removeBattler(formerLeader);
  }

  // perform original logic, updating the player to the latest.
  J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.get('handlePartyCycleMemberChanges').call(this);

  // rebuild all allies.
  $gameMap.updateAllies();
};

/**
 * Extends {@link JABS_Engine.continuedPrimaryBattleEffects}.<br>
 * Also applies battle memories as-necessary.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.set('continuedPrimaryBattleEffects', JABS_Engine.prototype.continuedPrimaryBattleEffects);
JABS_Engine.prototype.continuedPrimaryBattleEffects = function(action, target)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.get('continuedPrimaryBattleEffects').call(this, action, target);

  // apply the battle memories to the target.
  const result = target.getBattler().result();
  this.applyBattleMemories(result, action, target);
};

/**
 * Applies battle memories against the target based on the action being impacted.
 * @param result
 * @param action
 * @param target
 */
JABS_Engine.prototype.applyBattleMemories = function(result, action, target)
{
  // only apply if allowed.
  if (this.canApplyBattleMemories(target)) return;

  // generate the new battle memory of the action and its result for the target.
  const newMemory = new JABS_BattleMemory(
    target.getBattlerId(),
    action.getBaseSkill().id,
    action.getAction().calculateRawElementRate(target.getBattler()),
    result.hpDamage);

  // determine the one who who executed the action.
  const attacker = action.getCaster();

  // save the memory of the action execution to the caster.
  attacker.applyBattleMemories(newMemory);
};

/**
 * Determines whether or not battle memories should be applied to the target.
 * @param {JABS_Battler} target The target battler to potentially apply abttle memories to.
 * @returns {boolean}
 */
JABS_Engine.prototype.canApplyBattleMemories = function(target)
{
  // enemies do not use battle memories like ally AI does.
  if (target.isEnemy()) return false;

  // apply the memories!
  return true;
};
//endregion JABS_Engine

//region JABS_SkillSlotManager
/**
 * Gets all skill slots that have a skill assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEquippedAllySlots = function()
{
  // define the invalid skill slots that allies shouldn't use skills from.
  const invalidAllySlots = [JABS_Button.Tool, JABS_Button.Dodge];

  // return the filtered list of slots with skills that aren't invalid.
  return this.getEquippedSlots()
    // exclude the invalid skill slots.
    .filter(skillSlot => !invalidAllySlots.includes(skillSlot.key));
};
//endregion JABS_SkillSlotManager

//region Game_Actor
/**
 * Extends {@link #initMembers}.<br>
 * Also tracks JABS ally AI.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Actor.get('initMembers').call(this);

  // init the additional members.
  this.initAllyAiMembers();
};

/**
 * Initializes all members associated with the JABS extension of Ally AI.
 */
Game_Actor.prototype.initAllyAiMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  /**
   * A grouping of all properties associated with the ally AI extension.
   */
  this._j._abs._allyAi ||= {};

  /**
   * The currently selected Ally AI mode.
   * @type {JABS_AllyAI|null}
   */
  this._j._abs._allyAi._mode = new JABS_AllyAI(JABS_AllyAI.modes.VARIETY);
};

/**
 * Extends {@link #setup}.<br>
 * Also initializes ally AI.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Actor.set('setup', Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Actor.get('setup').call(this, actorId);

  // also initialize the ally's AI.
  this.initAllyAI();
};

/**
 * Initializes the ally ai for this battler.
 */
Game_Actor.prototype.initAllyAI = function()
{
  // grab the default ally AI mode for this actor.
  const defaultAllyAiMode = this.getDefaultAllyAI();

  // update the ally AI mode with the default.
  this.setAllyAIMode(defaultAllyAiMode);
};

/**
 * Get the current ally AI mode for this ally.
 * @returns {JABS_AllyAI}
 */
Game_Actor.prototype.getAllyAI = function()
{
  if (!this._j._abs._allyAi)
  {
    this.initAllyAiMembers();
  }

  return this._j._abs._allyAi._mode;
}

/**
 * Set the current ally AI mode for this ally.
 * @param {JABS_AllyAI} mode The mode to set.
 */
Game_Actor.prototype.setAllyAIMode = function(mode)
{
  this._j._abs._allyAi._mode.changeMode(mode);
};

/**
 * Gets the default ally AI mode associated with an actor.
 * The priority for the AI mode is class > actor > default.
 * @returns {string}
 */
Game_Actor.prototype.getDefaultAllyAI = function()
{
  // if there is no actor id, then don't try this yet.
  if (!this._actorId) return null;

  // extract the ally ai mode from the actor.
  const actorMode = this.actor().getStringFromNotesByRegex(J.ABS.EXT.ALLYAI.RegExp.DefaultAi, true);

  // extract the ally ai mode from the class.
  const classMode = this.currentClass().getStringFromNotesByRegex(J.ABS.EXT.ALLYAI.RegExp.DefaultAi, true);

  // priority is class > actor > default, for ally ai mode.
  const allyAiMode = classMode ?? actorMode;

  // validate the mode provided.
  if (JABS_AllyAI.validateMode(allyAiMode))
  {
    // if validation succeeds, then return what was in the notes.
    return allyAiMode;
  }

  // return the default of "variety" for ally ai.
  return JABS_AllyAI.modes.VARIETY.key;
};

/**
 * Gets all skill slots that have skills assigned to them- excluding the tool slot.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getValidSkillSlotsForAlly = function()
{
  return this.getSkillSlotManager().getEquippedAllySlots();
};
//endregion Game_Actor

//region Game_Follower
/**
 * OVERWRITE Adjust the chaseCharacter function to prevent chasing the player
 * while this follower is engaged.
 * @param {Game_Character} character The character this follower is following.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Follower.set('chaseCharacter', Game_Follower.prototype.chaseCharacter);
Game_Follower.prototype.chaseCharacter = function(character)
{
  // if this isn't a valid battler or followers aren't being shown, then don't control them.
  if (!this.canObeyJabsAi())
  {
    // perform original logic.
    J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('chaseCharacter').call(this, character);

    // stop processing.
    return;
  }

  // let the AI handle the chasing.
  this.obeyJabsAi(character);
};

/**
 * Determines whether or not this follower should be controlled by the {@link JABS_AiManager}.<br>
 * @returns {boolean} True if this follower should be controlled, false otherwise.
 */
Game_Follower.prototype.canObeyJabsAi = function()
{
  // if we are not visible, then we should not be controlled by JABS AI.
  if (!this.isVisible()) return false;

  // if we do not have a JABS battler, then we should not be controlled by JABS AI.
  if (!this.getJabsBattler()) return false;

  // lets get controlled!
  return true;
};

/**
 * Determines how this character should move in consideration of JABS' own AI manager.
 * @param {Game_Character} character The character being chased.
 */
Game_Follower.prototype.obeyJabsAi = function(character)
{
  // check if we should be doing dead ai things.
  if (this.shouldObeyJabsDeadAi())
  {
    // handle dead jabs ai logic.
    this.handleJabsDeadAi(character);
  }

  // check if we should be doing combat ai things.
  if (this.shouldObeyJabsCombatAi())
  {
    // handle combat jabs ai logic.
    this.handleJabsCombatAi(character);
  }
};

/**
 * Determines whether or not this follower should be obeying the JABS DEAD AI.
 * @returns {boolean}
 */
Game_Follower.prototype.shouldObeyJabsDeadAi = function()
{
  // Are we dead?
  const isDead = this.getJabsBattler().isDead();

  // return the diagnostic.
  return isDead;
};

/**
 * Handles the repeated actions for when a battler is dead.
 *
 * If this follower is dead, this will be the only JABS AI available to follow.
 *
 * Some ideas are in the TODOs below:
 * - TODO: Add option for character sprite change.
 * - TODO: Add option for follow (default) or stay.
 * - TODO: Add option for character motion effects, try integration with moghunters?
 * @param {Game_Character} character The character being "followed".
 */
Game_Follower.prototype.handleJabsDeadAi = function(character)
{
  // TODO: handle logic for repeating whilst dead.
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('chaseCharacter').call(this, character);
};

/**
 * Determines whether or not this follower should be obeying the JABS COMBAT AI.
 * @returns {boolean}
 */
Game_Follower.prototype.shouldObeyJabsCombatAi = function()
{
  // you cannot be dead and also in combat.
  if (this.shouldObeyJabsDeadAi()) return false;

  // lets get to fighting!
  return true;
};

/**
 * Handles the flow of logic for the movement of this character while available
 * to do combat things according to the {@link JABS_AiManager}.<br>
 * @param character
 */
Game_Follower.prototype.handleJabsCombatAi = function(character)
{
  // determine if this follower is in combat somehow.
  if (this.isInCombat())
  {
    // do active combat things!
    this.handleJabsCombatActiveAi(character);
  }
  // we are not actively engaged in any form of combat.
  else
  {
    // do non-combat things.
    this.handleJabsCombatInactiveAi(character);
  }
};

/**
 * Determines whether or not this battler is considered "in combat".
 * If a battler is "in combat", their movement is given to the JABS AI for combat purposes.
 * Default things that should allow movement include already being engaged in combat, or
 * having been alerted by a foe.
 * @returns {boolean}
 */
Game_Follower.prototype.isInCombat = function()
{
  // grab the battler data.
  const battler = this.getJabsBattler();

  // check if we are "in combat" in some way.
  const isInCombat = (battler.isEngaged() || battler.isAlerted());

  // return the result.
  return isInCombat;
};

/**
 * Handles the follower logic of things to do while this battler is in active combat.
 * @param {Game_Character} character The character being "followed".
 */
Game_Follower.prototype.handleJabsCombatActiveAi = function(character)
{
  // the battler is engaged, the AI will handle the movement.
  this.handleEngagementDistancing();

  // movement is relinquished to the jabs-ai-manager-senpai!
};

/**
 * Handles the repeated actions for when a battler is dead.
 *
 * If this follower is combat-ready but not alerted or engaged, they will just follow defaults.
 *
 * TODO: consider rapidly looping this when the character is far away?
 * @param {Game_Character} character The character being "followed".
 */
Game_Follower.prototype.handleJabsCombatInactiveAi = function(character)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('chaseCharacter').call(this, character);
};

/**
 * Extends {@link Game_Follower.update}.<br>
 * If this follower should be controlled by JABS AI, then modify the way it updates.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Follower.set('update', Game_Follower.prototype.update);
Game_Follower.prototype.update = function()
{
  // check if this follower should be obeying jabs ai.
  if (!this.canObeyJabsAi())
  {
    // perform original logic if we are not.
    J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('update').call(this);

    // stop processing.
    return;
  }

  // update for the ally ai instead.
  this.updateAllyAi();
};

/**
 * A slightly modified update for followers controlled by JABS AI.
 */
Game_Follower.prototype.updateAllyAi = function()
{
  // TODO: rewrite this entirely.
  // perform superclass logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get('update').call(this);
  //Game_Character.prototype.update.call(this);

  // update the various parameters accordingly for followers.
  this.setMoveSpeed($gamePlayer.realMoveSpeed());
  this.setOpacity($gamePlayer.opacity());
  this.setBlendMode($gamePlayer.blendMode());
  this.setWalkAnime($gamePlayer.hasWalkAnime());
  this.setStepAnime($gamePlayer.hasStepAnime());
  this.setTransparent($gamePlayer.isTransparent());
  // skip direction fix lock.

  // also handle engagement distancing.
  this.handleEngagementDistancing();
};

/**
 * Jump to the player from wherever you are.
 */
Game_Follower.prototype.jumpToPlayer = function()
{
  const sx = $gamePlayer.deltaXFrom(this.x);
  const sy = $gamePlayer.deltaYFrom(this.y);
  this.jump(sx, sy);
};

/**
 * If the battler is too far from the player, jump to them.
 */
Game_Follower.prototype.handleEngagementDistancing = function()
{
  // don't manage engagement distancing if they are not valid JABS battlers ready for combat.
  if (!this.canObeyJabsAi()) return;

  // grab the underlying jabs battler.
  const battler = this.getJabsBattler();

  // calculate the distance to the player.
  const distanceToPlayer = $gameMap.distance(this._realX, this._realY, $gamePlayer._realX, $gamePlayer._realY);

  // check if we are not engaged and not alerted.
  if (!battler.isEngaged() && !battler.isAlerted())
  {
    // determine if we are close enough to the player to allow engagement.
    if (distanceToPlayer <= Math.round(JABS_Battler.allyRubberbandRange() / 2))
    {
      // if the ally is within range of the player, then re-enable the ability to engage.
      battler.unlockEngagement();
    }

    // if the battler is engaged, make sure they stay within range of the player.
  }

  // determine if we have exceeded the distance allowed to be apart from the player.
  if (distanceToPlayer > JABS_Battler.allyRubberbandRange())
  {
    // when the ally is too far away from the player, disengage and prevent further engagement.
    battler.lockEngagement();
    battler.disengageTarget();
    battler.resetAllAggro(null, true);
    this.jumpToPlayer();
  }
};

// TODO: refactor handleEngagementDistancing().
//endregion Game_Follower

//region Game_Followers
/**
 * OVERWRITE If you're using this, the followers always show up!
 * @returns {boolean}
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Followers.set('show', Game_Followers.prototype.show);
Game_Followers.prototype.show = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Followers.get('show').call(this);

  // update all allies when choosing "show" as an event command.
  $gameMap.updateAllies();

  // refresh the JABS menu.
  $jabsEngine.requestJabsMenuRefresh = true;
};

/**
 * OVERWRITE If you're using this, the followers always show up!
 * @returns {boolean}
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Followers.set('hide', Game_Followers.prototype.hide);
Game_Followers.prototype.hide = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Followers.get('hide').call(this);

  // update all allies when choosing "hide" as an event command.
  $gameMap.updateAllies();

  // refresh the JABS menu.
  $jabsEngine.requestJabsMenuRefresh = true;
};

/**
 * OVERWRITE Adjust the jumpAll function to prevent jumping to the player
 * when the player is hit.
 */
Game_Followers.prototype.jumpAll = function()
{
  // don't make all the followers jump if the player isn't jumping.
  if (!$gamePlayer.isJumping()) return;

  // iterate over each follower to make them jump as-needed.
  for (const follower of this._data)
  {
    // skip followers that don't exist.
    if (!follower || !follower.isVisible()) return;

    // grab the follower's battler.
    const battler = follower.getJabsBattler();

    // don't jump if engaged.
    if (battler.isEngaged()) return;

    // determine coordinates to jump to.
    const sx = $gamePlayer.deltaXFrom(follower.x);
    const sy = $gamePlayer.deltaYFrom(follower.y);

    // jump!
    follower.jump(sx, sy);
  }
};

/**
 * Sets whether or not all followers are direction-fixed.
 * @param {boolean} isFixed Whether or not the direction should be fixed.
 */
Game_Followers.prototype.setDirectionFixAll = function(isFixed)
{
  this._data.forEach(follower =>
  {
    // skip followers that don't exist.
    if (!follower) return;

    // set their direction to be whatever the player's is.
    follower.setDirection(isFixed);
  });
};
//endregion Game_Followers

//region Game_Interpreter
/**
 * Extends the "Set Moveroute" event command.
 * Sets all follower's direction-fix to be whatever the player's is after a moveroute.
 * This accommodates the other adjustment regarding the player direction locking and allowing
 * the allies to stay agnostic to that input.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Interpreter.command205 = Game_Interpreter.prototype.command205;
Game_Interpreter.prototype.command205 = function(params)
{
  // if param[0] is -1, that is the player!
  // TODO: only jump to player if the player moves!
  // execute the move route command.
  const result = J.ABS.EXT.ALLYAI.Aliased.Game_Interpreter.command205.call(this, params);

  // check if we have a result and also the target is to move the character.
  if (result && params[0] === -1)
  {
    // then check the player's lock status and set all followers to be the same.
    $gamePlayer.followers().setDirectionFixAll($gamePlayer.isDirectionFixed());
    $gamePlayer.jumpFollowersToMe();
  }

  // return the outcome.
  return result;
};
//endregion Game_Interpreter

//region Game_Map
/**
 * Extends {@link Game_Map.parseBattlers}.<br>
 * Also parses ally battlers as well as events.
 * @returns {JABS_Battler[]}
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Map.set('parseBattlers', Game_Map.prototype.parseBattlers);
Game_Map.prototype.parseBattlers = function()
{
  // perform original logic.
  const originalParsedBattlers = J.ABS.EXT.ALLYAI.Aliased.Game_Map.get('parseBattlers').call(this);

  // also parse ally battlers.
  const parsedAllyBattlers = this.parseAllyBattlers();

  // combine all battlers.
  const parsedBattlers = originalParsedBattlers.concat(parsedAllyBattlers);

  // return the combined conversion.
  return parsedBattlers;
};

/**
 * Parses all followers that are active into their battler form.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.parseAllyBattlers = function()
{
  return JABS_AiManager
    .convertFollowersToBattlers($gamePlayer.followers().data());
};

/**
 * Gets all ally battlers out of the collection of battlers.
 * This does not include the player.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getFollowerBattlers = function()
{
  return JABS_AiManager.getAllBattlers()
    .filter(battler => battler.isFollower());
};

/**
 * Updates all ally battlers in-place.
 * For use with party-cycling.
 */
Game_Map.prototype.updateAllies = function()
{
  // get all the ally battlers from the current collection.
  const allyJabsBattlers = this.getFollowerBattlers();

  // first remove all battlers.
  this.removeBattlers(allyJabsBattlers);

  // then re-add the updated ones.
  const allies = this.parseAllyBattlers();

  // check to make sure we have allies.
  if (allies.length)
  {
    // add any parsed allies.
    JABS_AiManager.addOrUpdateBattlers(allies);
  }
};

/**
 * Removes all provided battlers from the battler tracking.
 * @param {JABS_Battler[]} battlers The battlers to be removed.
 */
Game_Map.prototype.removeBattlers = function(battlers)
{
  // disengage all battlers.
  battlers.forEach(battler => battler.disengageTarget());

  // remove them from tracking.
  JABS_AiManager.removeBattlers(battlers);
};
//endregion Game_Map

//region Game_Party
/**
 * Extends initialization to include the ally AI configurations.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Party.get('initialize').call(this);

  // initialize our ally ai members.
  this.initAllyAi();
};

/**
 * Initializes additional properties associated with ally ai.
 */
Game_Party.prototype.initAllyAi = function()
{
  /**
   * All encompassing object for storing my custom properties.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with ally ai.
   */
  this._j._allyAI ||= {};

  /**
   * Whether or not the party will engage without the player's engagement.
   * @type {boolean}
   */
  this._j._allyAI._aggroPassiveToggle ||= false;
};

/**
 * Gets whether or not the party is allowed to actively engage enemies.
 * @returns {boolean}
 */
Game_Party.prototype.isAggro = function()
{
  return this._j._allyAI._aggroPassiveToggle;
};

/**
 * Sets the party ally AI to be aggro.
 * Aggro party ally AI will have their own sight ranges and engage any enemies nearby.
 */
Game_Party.prototype.becomeAggro = function()
{
  this._j._allyAI._aggroPassiveToggle = true;
};

/**
 * Sets the party ally AI to be passive.
 * Passive party ally AI will only fight if hit first or when the leader engages.
 */
Game_Party.prototype.becomePassive = function()
{
  this._j._allyAI._aggroPassiveToggle = false;
};

/**
 * Extends {@link Game_Party.addActor}.<br>
 * Also updates allies to accommodate the addition of the actor.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set('addActor', Game_Party.prototype.addActor);
Game_Party.prototype.addActor = function(actorId)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Party.get('addActor').call(this, actorId);

  // update all allies when adding an actor to the party.
  $gameMap.updateAllies();
};

/**
 * Extends {@link Game_Party.removeActor}.<br>
 * Also updates allies to accommodate the removal of the actor.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set('removeActor', Game_Party.prototype.removeActor);
Game_Party.prototype.removeActor = function(actorId)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Party.get('removeActor').call(this, actorId);

  // update all allies when removing an actor from the party.
  $gameMap.updateAllies();
};
//endregion Game_Party

//region Game_Player
/**
 * Jumps all followers of the player back to the player.
 */
Game_Player.prototype.jumpFollowersToMe = function()
{
  this.followers()
    .data()
    .forEach(follower => follower.jumpToPlayer());
};
//endregion Game_Player

//region Scene_Map
/**
 * Extends the JABS menu initialization to include the new ally ai management selection.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.initJabsMembers = Scene_Map.prototype.initJabsMembers;
Scene_Map.prototype.initJabsMembers = function()
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.initJabsMembers.call(this);
  this.initAllyAiSubmenu();
};

/**
 * Initializes the new windows for ally ai management.
 */
Scene_Map.prototype.initAllyAiSubmenu = function()
{
  this._j._absMenu._allyAiPartyWindow = null;
  this._j._absMenu._allyAiEquipWindow = null;
  this._j._absMenu._allyAiActorId = 0;
};

/**
 * Sets the chosen actor id to the provided id.
 * @param {number} chosenActorId The id of the chosen actor.
 */
Scene_Map.prototype.setAllyAiActorId = function(chosenActorId)
{
  this._j._absMenu._allyAiActorId = chosenActorId;
};

/**
 * Gets the chosen actor id.
 */
Scene_Map.prototype.getAllyAiActorId = function()
{
  return this._j._absMenu._allyAiActorId;
};

/**
 * Extends the JABS menu creation to include the new windows for ally ai management.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.createJabsAbsMenu = Scene_Map.prototype.createJabsAbsMenu;
Scene_Map.prototype.createJabsAbsMenu = function()
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.createJabsAbsMenu.call(this);
  this.createAllyAiPartyWindow();
  this.createAllyAiEquipWindow();
};

/**
 * Extends the JABS menu creation to include a new command handler for ally ai.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.createJabsAbsMenuMainWindow = Scene_Map.prototype.createJabsAbsMenuMainWindow;
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.createJabsAbsMenuMainWindow.call(this);
  this._j._absMenu._mainWindow.setHandler("ally-ai", this.commandManagePartyAi.bind(this));
};

/**
 * Creates the window that lists all active members of the party.
 */
Scene_Map.prototype.createAllyAiPartyWindow = function()
{
  const w = 400;
  const h = 250;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const aiPartyMenu = new Window_AbsMenuSelect(rect, "ai-party-list");
  aiPartyMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "ai-party-list"));
  aiPartyMenu.setHandler("party-member", this.commandSelectMemberAi.bind(this));
  aiPartyMenu.setHandler("aggro-passive-toggle", this.commandAggroPassiveToggle.bind(this));
  this._j._absMenu._allyAiPartyWindow = aiPartyMenu;
  this._j._absMenu._allyAiPartyWindow.close();
  this._j._absMenu._allyAiPartyWindow.hide();
  this.addWindow(this._j._absMenu._allyAiPartyWindow);
};

/**
 * Creates a window that lists all available ai modes that the chose ally can use.
 */
Scene_Map.prototype.createAllyAiEquipWindow = function()
{
  const w = 400;
  const h = 250;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const aiMemberMenu = new Window_AbsMenuSelect(rect, "select-ai");
  aiMemberMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "select-ai"));
  aiMemberMenu.setHandler("select-ai", this.commandEquipMemberAi.bind(this));
  this._j._absMenu._allyAiEquipWindow = aiMemberMenu;
  this._j._absMenu._allyAiEquipWindow.close();
  this._j._absMenu._allyAiEquipWindow.hide();
  this.addWindow(this._j._absMenu._allyAiEquipWindow);
};

/**
 * When the "manage ally ai" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandManagePartyAi = function()
{
  this._j._absMenu._windowFocus = "ai-party-list";
};

/**
 * When an individual party member is chosen, it prioritizes the AI mode selection window.
 */
Scene_Map.prototype.commandSelectMemberAi = function()
{
  this._j._absMenu._windowFocus = "select-ai";
  const actorId = this._j._absMenu._allyAiPartyWindow.currentExt();
  this.setAllyAiActorId(actorId);
  this._j._absMenu._allyAiEquipWindow.setActorId(actorId);
  this._j._absMenu._allyAiEquipWindow.refresh();
};

/**
 * Toggles the party-wide aggro/passive switch.
 * Passive switch will only target the leader's current target.
 * Aggro switch will enable full sight range and auto-engaging abilities.
 */
Scene_Map.prototype.commandAggroPassiveToggle = function()
{
  SoundManager.playRecovery();
  $gameParty.isAggro()
    ? $gameParty.becomePassive()
    : $gameParty.becomeAggro();
  this._j._absMenu._allyAiPartyWindow.refresh();
};

/**
 * When an ai mode is chosen, it replaces it for the actor.
 */
Scene_Map.prototype.commandEquipMemberAi = function()
{
  // grab the new ally AI mode from the window.
  const newMode = this._j._absMenu._allyAiEquipWindow.currentExt();

  // grab the current ally AI.
  const allyAi = $gameActors.actor(this.getAllyAiActorId()).getAllyAI();

  // change the mode of the AI to the new one by its key.
  allyAi.changeMode(newMode.key);

  // refresh the ally AI window to reflect the change.
  this._j._absMenu._allyAiEquipWindow.refresh();
};

/**
 * Manages the ABS main menu's interactivity.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.manageAbsMenu = Scene_Map.prototype.manageAbsMenu;
Scene_Map.prototype.manageAbsMenu = function()
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.manageAbsMenu.call(this);
  switch (this._j._absMenu._windowFocus)
  {
    case "ai-party-list":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._allyAiPartyWindow.show();
      this._j._absMenu._allyAiPartyWindow.open();
      this._j._absMenu._allyAiPartyWindow.activate();
      break;
    case "select-ai":
      this._j._absMenu._allyAiPartyWindow.hide();
      this._j._absMenu._allyAiPartyWindow.close();
      this._j._absMenu._allyAiPartyWindow.deactivate();
      this._j._absMenu._allyAiEquipWindow.show();
      this._j._absMenu._allyAiEquipWindow.open();
      this._j._absMenu._allyAiEquipWindow.activate();
      break;
  }
};

/**
 * Closes a given Abs menu window.
 * @param {string} absWindow The type of abs window being closed.
 */
J.ABS.EXT.ALLYAI.Aliased.Scene_Map.closeAbsWindow = Scene_Map.prototype.closeAbsWindow;
Scene_Map.prototype.closeAbsWindow = function(absWindow)
{
  J.ABS.EXT.ALLYAI.Aliased.Scene_Map.closeAbsWindow.call(this, absWindow);
  switch (absWindow)
  {
    case "ai-party-list":
      this._j._absMenu._allyAiPartyWindow.hide();
      this._j._absMenu._allyAiPartyWindow.close();
      this._j._absMenu._allyAiPartyWindow.deactivate();
      this._j._absMenu._mainWindow.activate();
      this._j._absMenu._mainWindow.open();
      this._j._absMenu._mainWindow.show();
      this._j._absMenu._windowFocus = "main";
      break;
    case "select-ai":
      this._j._absMenu._allyAiEquipWindow.hide();
      this._j._absMenu._allyAiEquipWindow.close();
      this._j._absMenu._allyAiEquipWindow.deactivate();
      this._j._absMenu._allyAiPartyWindow.activate();
      this._j._absMenu._allyAiPartyWindow.open();
      this._j._absMenu._allyAiPartyWindow.show();
      this._j._absMenu._windowFocus = "ai-party-list";
      break;
  }
};
//endregion Scene_Map

//region Window_AbsMenu
/**
 * Extends {@link #buildCommands}.<br>
 * Adds the ally ai management command at the end of the list.
 * @returns {BuiltWindowCommand[]}
 */
J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenu.set('buildCommands', Window_AbsMenu.prototype.buildCommands);
Window_AbsMenu.prototype.buildCommands = function()
{
  // perform original logic to get base commands.
  const originalCommands = J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenu.get('buildCommands').call(this);

  // if the switch is disabled, then the command won't even appear in the menu.
  if (!this.canAddAllyAiCommand()) return originalCommands;

  // if followers aren't being used, then this command will be disabled.
  const enabled = $gamePlayer.followers().isVisible();

  // build the command.
  const command = new WindowCommandBuilder(J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandName)
    .setSymbol('ally-ai')
    .setEnabled(enabled)
    .setIconIndex(J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandIconIndex)
    .setColorIndex(27)
    .setHelpText(this.allyAiHelpText())
    .build();

  // add the new command.
  originalCommands.push(command);

  // return the updated command list.
  return originalCommands;
};

/**
 * Determines whether or not the ally ai management command can be added to the JABS menu.
 * @returns {boolean} True if the command should be added, false otherwise.
 */
Window_AbsMenu.prototype.canAddAllyAiCommand = function()
{
  // if the necessary switch isn't ON, don't render the command at all.
  if (!$gameSwitches.value(J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandSwitchId)) return false;

  // render the command!
  return true;
};

/**
 * The help text for the JABS sdp menu.
 * @returns {string}
 */
Window_AbsMenu.prototype.allyAiHelpText = function()
{
  const description = [
    "Your AI mode selection menu.",
    "A general direction or theme of guidance can be assigned to your allies from here."
  ];

  return description.join("\n");
};
//endregion Window_AbsMenu

//region Window_AbsMenuSelect
/**
 * Extends the initialization to include the actor id for ai management.
 */
J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenuSelect.set('initialize', Window_AbsMenuSelect.prototype.initialize);
Window_AbsMenuSelect.prototype.initialize = function(rect, type)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenuSelect.get('initialize').call(this, rect, type);

  // TODO: init properly.
  this._j._chosenActorId = 0;
};

/**
 * Sets the actor id assigned to this window.
 * @param {number} actorId The new actor id for this window.
 */
Window_AbsMenuSelect.prototype.setActorId = function(actorId)
{
  this._j._chosenActorId = actorId;
};

/**
 * Gets the actor id assigned to this window, if any.
 * @returns {number}
 */
Window_AbsMenuSelect.prototype.getActorId = function()
{
  return this._j._chosenActorId;
};

/**
 * Extends the JABS quick menu select to also handle ai management.
 */
J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenuSelect.set('makeCommandList', Window_AbsMenuSelect.prototype.makeCommandList);
Window_AbsMenuSelect.prototype.makeCommandList = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenuSelect.get('makeCommandList').call(this);

  // pivot on the menu type.
  switch (this._j._menuType)
  {
    case "ai-party-list":
      this.makeAllyList();
      break;
    case "select-ai":
      this.makeAllyAiModeList();
      break;
  }
};

/**
 * Draws the list of available AI modes that an ally can use.
 */
Window_AbsMenuSelect.prototype.makeAllyList = function()
{
  // an iterator function for building all the actor commands for changing ally AI.
  const forEacher = member =>
  {
    // build the command for this member of the party.
    const command = new WindowCommandBuilder(member.name())
      .setSymbol("party-member")
      .setExtensionData(member.actorId())
      .build();

    // add the built command to the list.
    this.addBuiltCommand(command);
  };

  // build all the commands.
  $gameParty.allMembers().forEach(forEacher, this);

  // define the icons for passive/aggressive ally AI aggro settings.
  const aggroPassiveCommandName = $gameParty.isAggro()
    ? J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveText
    : J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveText;
  const aggroPassiveCommandIcon = $gameParty.isAggro()
    ? J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveIconIndex
    : J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveIconIndex;

  // build the command for toggling ally AI aggro.
  const command = new WindowCommandBuilder(aggroPassiveCommandName)
    .setSymbol("aggro-passive-toggle")
    .setIconIndex(aggroPassiveCommandIcon)
    .build();

  // add the aggro toggle command.
  this.addBuiltCommand(command);
};

/**
 * Draws the list of available AI modes that an ally can use.
 */
Window_AbsMenuSelect.prototype.makeAllyAiModeList = function()
{
  // grab the currently selected actor.
  const currentActor = $gameActors.actor(this.getActorId());

  // if there is no actor, then there is no AI.
  if (!currentActor) return;

  // grab all available ally AI modes.
  const modes = JABS_AllyAI.getModes();

  // grab the currently selected AI.
  const currentAi = currentActor.getAllyAI();

  // an iterator function for building all ally AI modes as commands.
  const forEacher = mode =>
  {
    // extract some data from this ally AI mode.
    const { key, name } = mode;

    // check if the currently selected ally AI mode is this command.
    const isEquipped = currentAi.getMode() === key;

    // build the icon based on whether or not its equipped.
    const iconIndex = isEquipped
      ? J.ABS.EXT.ALLYAI.Metadata.AiModeEquippedIconIndex
      : J.ABS.EXT.ALLYAI.Metadata.AiModeNotEquippedIconIndex;

    // build the command.
    const command = new WindowCommandBuilder(name)
    .setSymbol("select-ai")
    .setIconIndex(iconIndex)
    .setExtensionData(mode)
    .build();

    // add the command to the list.
    this.addBuiltCommand(command);
  };

  // iterate over each mode and rebuild the commands.
  modes.forEach(forEacher, this);
};
//endregion Window_AbsMenuSelect