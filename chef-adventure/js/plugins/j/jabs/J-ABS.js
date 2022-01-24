//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Enables battles to be carried out on the map.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This plugin is JABS: J's Action Battle System.
 * Using this plugin will enable you to carry out battles directly on the map
 * in real-time, similar to popular game franchises like Zelda.
 *
 * In order to leverage this plugin, all the following plugins must be present
 * and ideally in this order:
 * - J-BASE
 * - J-ABS
 * - _jabsModels
 * - _jabsManagers
 * - _jabsObjects
 * - _jabsScenes
 * - _jabsSprites
 * - _jabsWindows
 * ============================================================================
 * DEVELOPER NOTES:
 * This plugin is divided into 7 separate "plugins" that also must be present
 * in order for this engine to work, and ideally in this order:
 * - J-ABS (this plugin/file)
 *    This plugin contains the actual engine that orchestrates the the entirety
 *    of this action battle system. Additionally, the JABS_InputAdapter lives
 *    here and handles the translation of input into commands that JABS can
 *    understand and make use of.
 *
 * - _jabsModels
 *    This contains all the various custom classes that were not overwrites or
 *    extensions of the core RMMZ scripts. Things such as the JABS_Battler
 *    class can be found there.
 *
 * - _jabsManagers
 *    This contains all modifications to the core RMMZ scripts that are just
 *    static classes, such as the DataManager and Input. Additionally, you can
 *    find the JABS_AiManager there.
 *
 * - _jabsObjects
 *    This contains all modifications to the core RMMZ scripts that are related
 *    to the various "Game_*" objects, such as Game_Event or Game_Map. I
 *    Call out Game_Event and Game_Map specifically because they received the
 *    largest amount of modifications to accommodate EVENTS being able to be
 *    translated into enemies that reside on the MAP, as this engine demands.
 *
 * - _jabsScenes
 *    This contains all modifications to the core RMMZ scripts that are related
 *    to the various "Scene_*" objects, such as Scene_Load and Scene_Map. This
 *    mostly just contains the orchestration for the JABS menu on the map.
 *
 * - _jabsSprites
 *    This contains all modifications to the core RMMZ scripts that are related
 *    to the various "Sprite_*" and "Spriteset_*" objects, such as
 *    Sprite_Character and Spriteset_Map. This mostly is where the sprite
 *    orchestration for adding actions or loot to the map exists.
 *
 * - _jabsWindows
 *    This contains all modifications to the core RMMZ scripts that are related
 *    to the various "Window_*" objects, such as Window_AbsMenu. Actually, that
 *    isn't an overwrite, its just new, but it seemed strange to not have a
 *    windows file after having a file for all the other types of core objects.
 *
 *
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
 * @param defaultEnemyAiCode
 * @parent enemyDefaultConfigs
 * @type string
 * @text Default Enemy AI Code
 * @desc The default ai code for enemy battlers. Don't change it if you don't understand it!
 * @default 10000000
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
 * @arg skillId
 * @type skill
 * @text Choose Skill
 * @desc
 * The skill to be assigned to the actor.
 * You may choose "none" if you want to unassign the slot.
 * @default 1
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
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.0.0';
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
J.ABS.Metadata.DefaultEnemyAiCode = J.ABS.PluginParameters['defaultEnemyAiCode'];
J.ABS.Metadata.DefaultEnemyCanIdle = Boolean(J.ABS.PluginParameters['defaultEnemyCanIdle'] === "true");
J.ABS.Metadata.DefaultEnemyShowHpBar = Boolean(J.ABS.PluginParameters['defaultEnemyShowHpBar'] === "true");
J.ABS.Metadata.DefaultEnemyShowBattlerName = Boolean(J.ABS.PluginParameters['defaultEnemyShowBattlerName'] === "true");
J.ABS.Metadata.DefaultEnemyIsInvincible = Boolean(J.ABS.PluginParameters['defaultEnemyIsInvincible'] === "true");
J.ABS.Metadata.DefaultEnemyIsInanimate = Boolean(J.ABS.PluginParameters['defaultEnemyIsInanimate'] === "true");

// custom data configurations.
J.ABS.Metadata.UseElementalIcons = Boolean(J.ABS.PluginParameters['useElementalIcons'] === "true");
J.ABS.Metadata.ElementalIcons = J.ABS.Helpers.PluginManager.TranslateElementalIcons(J.ABS.PluginParameters['elementalIconData']);

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
   */
  UP: 8,

  /**
   * Represents the RIGTH direction, or 6.
   */
  RIGHT: 6,

  /**
   * Represents the LEFT direction, or 4.
   */
  LEFT: 4,

  /**
   * Represents the DOWN direction, or 2.
   */
  DOWN: 2,

  /**
   * Represents the diagonal LOWER LEFT direction, or 1.
   */
  LOWERLEFT: 1,

  /**
   * Represents the diagonal LOWER RIGHT direction, or 3.
   */
  LOWERRIGHT: 3,

  /**
   * Represents the diagonal UPPER LEFT direction, or 7.
   */
  UPPERLEFT: 7,

  /**
   * Represents the diagonal UPPER RIGHT direction, or 9.
   */
  UPPERRIGHT: 9,
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
  Cooldown: /<cooldown:[ ]?(\d+)>/gi,
  Range: /<range:[ ]?(\d+)>/gi,
  Proximity: /<proximity:[ ]?(\d+)>/gi,
  ActionId: /<actionId:[ ]?(\d+)>/gi,
  Duration: /<duration:[ ]?(\d+)>/gi,
  Shape: /<shape:[ ]?(rhombus|square|frontsquare|line|arc|wall|cross)>/gi,
  Knockback: /<knockback:[ ]?(\d+)>/gi,
  CastAnimation: /<castAnimation:[ ]?(\d+)>/gi,
  CastTime: /<castTime:[ ]?(\d+)>/gi,
  FreeCombo: /<freeCombo>/gi,
  Direct: /<direct>/gi,
  BonusAggro: /<aggro:[ ]?(\d+)>/gi,
  AggroMultiplier: /<aggroMultiplier:[ ]?(\d+)>/gi,
  BonusHits: /<bonusHits:[ ]?(\d+)>/gi,
  Guard: /<guard:[ ]?(\[-?\d+,[ ]?-?\d+])>/gi,
  Parry: /<parry:[ ]?(\d+)>/gi,
  CounterParry: /<counterParry:[ ]?(\d+)>/gi,
  CounterGuard: /<counterGuard:[ ]?(\d+)>/gi,
  Projectile: /<projectile:[ ]?([12348])>/gi,
  UniqueCooldown: /<uniqueCooldown>/gi,
  MoveType: /<moveType:[ ]?(forward|backward|directional)>/gi,
  InvincibleDodge: /<invincibleDodge>/gi,
  ComboAction: /<combo:[ ]?(\[\d+,[ ]?\d+])>/gi,
  KnockbackResist: /<knockbackResist:[ ]?(\d+)>/gi,
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.Aliased = {
  DataManager: {},
  Game_Actor: {},
  Game_Action: {},
  Game_ActionResult: {},
  Game_Battler: {},
  Game_BattlerBase: {},
  Game_Character: {},
  Game_CharacterBase: {},
  Game_Event: {},
  Game_Follower: {},
  Game_Followers: {},
  Game_Interpreter: {},
  Game_Map: new Map(),
  Game_Party: {},
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
  const {actorId, skillId, slot, locked} = args;
  const actor = $gameActors.actor(parseInt(actorId));
  const translation = J.ABS.Helpers.PluginManager.TranslateOptionToSlot(slot);
  actor.setEquippedSkill(
    translation,
    parseInt(skillId),
    locked === 'true');
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
//#endregion Plugin Command Registration
//#endregion Introduction

//#region JABS_Engine
/**
 * This class is the engine that manages JABS and how `JABS_Action`s interact
 * with the `JABS_Battler`s on the map.
 */
class JABS_Engine
{
  /**
   * @constructor
   */
  constructor()
  {
    this.initialize();
  };

  //#region properties
  /**
   * Retrieves whether or not the ABS is currently enabled.
   * @returns {boolean} True if enabled, false otherwise.
   */
  get absEnabled()
  {
    return this._absEnabled;
  };

  /**
   * Sets the ABS enabled switch to a new boolean value.
   * @param {boolean} enabled Whether or not the ABS is enabled (default = true).
   */
  set absEnabled(enabled)
  {
    this._absEnabled = enabled;
  };

  /**
   * Retrieves whether or not the ABS is currently paused.
   * @returns {boolean} True if paused, false otherwise.
   */
  get absPause()
  {
    return this._absPause;
  };

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
  };

  /**
   * Sets the current request for calling the ABS-specific menu.
   * @param {boolean} requested Whether or not we want to request the menu (default: true).
   */
  set requestAbsMenu(requested)
  {
    this._requestAbsMenu = requested;
  };

  /**
   * Gets whether or not there is a request to cycle through party members.
   * @returns {boolean}
   */
  get requestPartyRotation()
  {
    return this._requestPartyRotation;
  };

  /**
   * Sets the request for party rotation.
   * @param {boolean} rotate True if we want to rotate party members, false otherwise.
   */
  set requestPartyRotation(rotate)
  {
    this._requestPartyRotation = rotate;
  };

  /**
   * Gets whether or not there is a request to refresh the JABS menu.
   * The most common use case for this is adding new commands to the menu.
   * @returns {boolean}
   */
  get requestJabsMenuRefresh()
  {
    return this._requestJabsMenuRefresh;
  };

  /**
   * Sets the request for refreshing the JABS menu.
   * @param {boolean} requested True if we want to refresh the JABS menu, false otherwise.
   */
  set requestJabsMenuRefresh(requested)
  {
    this._requestJabsMenuRefresh = requested;
  };

  /**
   * Checks whether or not we have a need to request rendering for new actions.
   * @returns {boolean} True if needing to render actions, false otherwise.
   */
  get requestActionRendering()
  {
    return this._requestActionRendering;
  };

  /**
   * Issues a request to render actions on the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestActionRendering(request)
  {
    this._requestActionRendering = request;
  };

  /**
   * Checks whether or not we have a need to request rendering for new loot sprites.
   * @returns {boolean} True if needing to render loot, false otherwise.
   */
  get requestLootRendering()
  {
    return this._requestLootRendering;
  };

  /**
   * Issues a request to render loot onto the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestLootRendering(request)
  {
    this._requestLootRendering = request;
  };

  /**
   * Checks whether or not we have a need to request a clearing of the action sprites
   * on the current map.
   * @returns {boolean} True if clear map requested, false otherwise.
   */
  get requestClearMap()
  {
    return this._requestClearMap;
  };

  /**
   * Issues a request to clear the map of all stale actions.
   * @param {boolean} request Whether or not we want to clear the battle map (default = true).
   */
  set requestClearMap(request)
  {
    this._requestClearMap = request;
  };

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
  };

  /**
   * Checks whether or not we have a need to refresh all character sprites on the current map.
   * @returns {boolean} True if refresh is requested, false otherwise.
   */
  get requestSpriteRefresh()
  {
    return this._requestSpriteRefresh;
  };

  /**
   * Issues a request to refresh all character sprites on the current map.
   * @param {boolean} request True if we want to refresh all sprites, false otherwise.
   */
  set requestSpriteRefresh(request)
  {
    this._requestSpriteRefresh = request;
  };
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
     * True if we want to render additional sprites to the screen, false otherwise.
     * @type {boolean}
     */
    this._requestRendering = false;

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
    this._jabsStateTracker = this._jabsStateTracker || [];
  };

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
  };

  /**
   * Finds the event metadata associated with the given `uuid`.
   * @param {string} uuid The `uuid` to find.
   * @returns {rm.types.Event} The event associated with the `uuid`.
   */
  event(uuid)
  {
    const results = this._activeActions.filter(eventData => eventData.uniqueId === uuid);
    return results[0];
  };

  /**
   * Removes the temporary metadata from our store.
   * @param {JABS_Action} actionEvent The action event data.
   */
  removeActionEvent(actionEvent)
  {
    // find all the actions that are the same as this one.
    const sameAction = this._actionEvents
      .filter(action => action.getUuid() === actionEvent.getUuid());
    if (!sameAction || !sameAction.length)
    {
      // if for some reason we don't have any matching actions, then we're done.
      return;
    }

    const uniqueId = sameAction[0].getUuid();

    // filter out all those same actions.
    const updatedActiveActions = this.
    _activeActions
      .filter(active => !(active.uniqueId === uniqueId));
    this._activeActions = updatedActiveActions;
  };

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
  };

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
  };

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
    let animationId = skill.animationId;

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
      else
      {
        // grab the weapons of the caster.
        const weapons = caster.getBattler().weapons();

        // check to make sure we have weapons.
        if (weapons.length > 0)
        {
          // grab the first weapon's attack animation.
          return weapons[0].animationId;
        }
        // we are barefisting it.
        else
        {
          // just return the default attack animation id.
          return J.ABS.DefaultValues.AttackAnimationId;
        }
      }
    }

    return animationId;
  };

  /**
   * Returns the `JABS_Battler` associated with the player.
   * @returns {JABS_Battler} The battler associated with the player.
   */
  getPlayer1()
  {
    return this._player1;
  };

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
  };

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
  };

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
  };

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
  };

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
  };
  //#region state tracking

  /**
   * Gets the collection of all JABS states that affect battlers on the map.
   * @returns {JABS_TrackedState[]}
   */
  getJabsStates()
  {
    return this._jabsStateTracker;
  };

  /**
   * Add a new JABS state to the tracker.
   * @param {JABS_TrackedState} newJabsState The JABS state to add.
   */
  addJabsState(newJabsState)
  {
    this._jabsStateTracker.push(newJabsState);
  };

  /**
   * Updates all JABS states for all battlers that are afflicted.
   */
  updateJabsStates()
  {
    // iterate over all JABS-managed states.
    this.getJabsStates()
      // execute the update against it.
      .forEach(this.updateJabsState, this);
  };

  /**
   * Updates a single JABS state.
   * @param {JABS_TrackedState} jabsState The JABS state to update.
   */
  updateJabsState(jabsState)
  {
    jabsState.update();
  };

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
  };

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
  };

  /**
   * Gets all tracked states for a given battler.
   * @param {Game_Battler} battler The battler to find tracked states for.
   * @returns {JABS_TrackedState[]}
   */
  getStateTrackerByBattler(battler)
  {
    return this._jabsStateTracker.filter(trackedState => trackedState.battler === battler);
  };

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
  };
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
  };

  /**
   * Determines whether or not we can update the ai-controlled battlers.
   * @returns {boolean}
   */
  canUpdateAiBattlers()
  {
    return true;
  };

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
  };

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
  };
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
  };

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
  };

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

    // request a map-wide sprite refresh on cycling.
    this.requestSpriteRefresh = true;
  };

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
  };
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
  };

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
  };

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
  };

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
  };

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
  };

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
  };

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
  };

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
  };

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
  };
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
   * @param {boolean} isRetaliation Whether or not this skill is from a retaliation.
   * @param {number|null} x The target's `x` coordinate, if applicable.
   * @param {number|null} y The target's `y` coordinate, if applicable.
   */
  forceMapAction(caster, skillId, isRetaliation = false, x = null, y = null)
  {
    // generate the forced actions based on the given skill id.
    const actions = caster.createJabsActionFromSkill(skillId, isRetaliation);

    // if we cannot execute map actions, then do not.
    if (!this.canExecuteMapActions(caster, actions)) return;

    // iterate over each action and execute them as the caster.
    actions.forEach(action => this.executeMapAction(caster, action, x, y));
  };

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
  };

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
  };

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
  };

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
  };

  /**
   * Handles the combo functionality behind this action.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  handleActionCombo(caster, action)
  {
    // grab the underlying skill for this action.
    const baseSkill = action.getBaseSkill();

    // check if this action has the "freecombo" tag.
    if (baseSkill._j.freeCombo())
    {
      // trigger the free combo effect for this action.
      this.checkComboSequence(caster, action)
    }
  };

  /**
   * Handles the pose functionality behind this action.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  handleActionPose(caster, action)
  {
    // perform the action's corresponding pose.
    caster.performActionPose(action.getBaseSkill());
  };

  /**
   * Handles the cast animation functionality behind this action.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  handleActionCastAnimation(caster, action)
  {
    // check if a cast animation exists.
    //const casterAnimation = action.getBaseSkill()._j.casterAnimation();
    const casterAnimation = action.getCastAnimation();
    if (casterAnimation)
    {
      // execute the cast animation.
      caster.getCharacter().requestAnimation(casterAnimation);
    }
  };

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
  };

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
  };

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
  };

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
  };

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
  };

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
  };

  /**
   * Checks whether or not this skill is a basic attack.
   * @param {string} cooldownKey The cooldown key to check.
   * @returns {boolean} True if the skill is a basic attack, false otherwise.
   */
  isBasicAttack(cooldownKey)
  {
    const isMainHand = cooldownKey === JABS_Button.Main;
    const isOffHand = cooldownKey === JABS_Button.Offhand;
    return (isMainHand || isOffHand);
  };

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
  };

  /**
   * Applies the cooldowns to the battler.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  applyCooldownCounters(caster, action)
  {
    this.applyPlayerCooldowns(caster, action);
  };

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
  };

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
  };

  /**
   * Adds the loot to the map.
   * @param {number} targetX The `x` coordinate of the battler dropping the loot.
   * @param {number} targetY The `y` coordinate of the battler dropping the loot.
   * @param {object} item The loot's raw data object.
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
    jabsLootData.duration = item._j.expires || J.ABS.Metadata.DefaultLootExpiration;

    // generate a new event to visually represent the loot drop and flag it for adding.
    const eventId = $dataMap.events.length - 1;
    const lootEvent = new Game_Event($gameMap.mapId(), eventId);
    lootEvent.setLootData(jabsLootData);
    lootEvent.setLootNeedsAdding();

    // add loot event to map.
    this.requestLootRendering = true;
    $gameMap.addEvent(lootEvent);
  };

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
  };

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
    const isUnparryable = (action.getBaseSkill()._j.ignoreParry() === -1);

    // check whether or not this action was parried.
    const caster = action.getCaster();
    const isParried = isUnparryable
      ? false // parry is cancelled because the skill ignores it.
      : this.checkParry(caster, target);

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
  };

  /**
   * Execute any pre-execution effects.
   * This occurs before the actual skill is applied against the target battler to get the
   * `Game_ActionResult` that is then used throughout the function.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  preExecuteSkillEffects(action, target)
  {
  };

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
  };

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
    const attackerStates = attacker.getBattler().states();
    if (attackerStates.length > 0)
    {
      attackerStates.forEach(state =>
      {
        if (state._j.aggroOutAmp >= 0)
        {
          aggro *= state._j.aggroOutAmp;
        }
      });
    }

    // apply any aggro reduction from states.
    const targetStates = target.getBattler().states();
    if (targetStates.length > 0)
    {
      targetStates.forEach(state =>
      {
        if (state._j.aggroInAmp >= 0)
        {
          aggro *= state._j.aggroInAmp;
        }
      });
    }

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
  };

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
    if (action.getJabsData().selfAnimationId())
    {
      const event = action.getActionSprite();
      const selfAnimationId = action.getJabsData().selfAnimationId();
      event.requestAnimation(selfAnimationId);
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
  };

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
      let metaResist = parseInt(targetMeta[J.ABS.Notetags.KnockbackResist]);
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
    if (knockback == null) return;

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
  };

  /**
   * Determines if there is a combo action that should succeed this skill.
   * @param {JABS_Battler} caster The battler that casted this skill.
   * @param {JABS_Action} action The action that contains the skill to check for combos.
   */
  checkComboSequence(caster, action)
  {
    const combo = action.getBaseSkill()._j.combo();
    if (combo)
    {
      const battler = caster.getBattler();
      const [skillId, comboDelay] = combo;
      if (!battler.hasSkill(skillId))
      {
        return;
      }

      const cooldownKey = action.getCooldownType();
      if (!(caster.getComboNextActionId(cooldownKey) === skillId))
      {
        caster.modCooldownCounter(cooldownKey, comboDelay);
      }

      caster.setComboFrames(cooldownKey, comboDelay);
      caster.setComboNextActionId(cooldownKey, skillId);
    }
  };

  /**
   * Calculates whether or not the attack was parried.
   * @param {JABS_Battler} caster The battler performing the action.
   * @param {JABS_Battler} target The target the action is against.
   * @returns {boolean}
   */
  checkParry(caster, target)
  {
    const isFacing = caster.isFacingTarget(target.getCharacter());
    // cannot parry if not facing target.
    if (!isFacing) return false;

    // if the target battler has 0% GRD, they can't parry.
    const targetBattler = target.getBattler();
    if (targetBattler.grd === 0) return false;

    const casterBattler = caster.getBattler();

    // if the attacker has a state that ignores all parry, then skip parrying.
    if (casterBattler.ignoreAllParry()) return false;

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
    */

    const bonusHit = parseFloat((casterBattler.hit * 0.1).toFixed(3));
    const hit = parseFloat((Math.random() + bonusHit).toFixed(3));
    const parry = parseFloat((targetBattler.grd - 1).toFixed(3));
    // console.log(`attacker:${casterBattler.name()} bonus:${bonusHit} + hit:${hit-bonusHit} < grd:${parryRate} ?${hit < parryRate}`);
    return hit < parry;
  };

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
  };

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
  };

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
  };

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
    if (action.getCaster()
      .isSameTeam(targetBattler.getTeam()))
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
  };

  /**
   * Executes any retaliation the player may have when receiving a hit while guarding/parrying.
   * @param {JABS_Battler} battler The player's `JABS_Battler`.
   */
  handleActorRetaliation(battler)
  {
    const result = battler.getBattler()
      .result();
    const needsCounterParry = result.preciseParried && battler.counterParry();
    const needsCounterGuard = !needsCounterParry && battler.guarding() && battler.counterGuard();
    const retaliationSkills = battler.getBattler()
      .retaliationSkills();

    // if we should be counter-parrying.
    if (needsCounterParry)
    {
      this.forceMapAction(battler, battler.counterParry(), true);
    }

    // if we should be counter-guarding.
    if (needsCounterGuard)
    {
      this.forceMapAction(battler, battler.counterGuard(), true);
    }

    // if auto-counter is available, then just do that.
    if (result.parried)
    {
      this.handleAutoCounter(battler);
    }

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
  };

  /**
   * If the counter rate is sufficient, then automatically perform your counterskills on any
   * incoming passive parry!
   * @param {JABS_Battler} battler The battler performing the counter.
   */
  handleAutoCounter(battler)
  {
    // if we don't have anything to auto-counter with, skip it.
    const guardData = battler.getGuardData(JABS_Button.Offhand);
    if (!guardData) return;
    if (!guardData.canCounter()) return;

    // if RNG is within the threshold...
    const shouldAutoCounter = battler.getBattler().cnt > Math.random();

    // ...then execute all counters available!
    if (shouldAutoCounter)
    {
      if (guardData.counterGuardId)
      {
        // if we have a counterguard, perform it.
        this.forceMapAction(battler, guardData.counterGuardId, true);
      }

      if (guardData.counterParryId)
      {
        // if we have a counterparry, perform it.
        this.forceMapAction(battler, guardData.counterParryId, true);
      }
    }
  }

  /**
   * Executes any retaliation the enemy may have when receiving a hit at any time.
   * @param {JABS_Battler} enemy The enemy's `JABS_Battler`.
   */
  handleEnemyRetaliation(enemy)
  {
    // assumes enemy battler is enemy.
    const retaliationSkills = enemy.getBattler()
      .retaliationSkills();

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
  };

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
  };

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
  };

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
  };

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
  };

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
        .setupParry(targetName, casterName, skill.id, result.preciseParried)
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
  };

  /**
   * Configures this skill used popup based on the skill itself.
   * @param {rm.types.Skill} skill The skill that was used.
   * @returns {Map_TextPop}
   */
  configureSkillUsedPop(skill)
  {
    return new TextPopBuilder(skill.name)
      .isSkillUsed(skill.iconIndex)
      .build();
  };

  /**
   * Configures this damage popup based on the action result against the target.
   * @param {Game_Action} gameAction The action this popup is based on.
   * @param {rm.types.Skill} skill The skill reference data itself.
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

    // if the target was completely immune to what you had, then say so.
    if (targetElementallyImmune)
    {
      textPopBuilder.setValue(`IMMUNE`);
    }
    // if you were parried, sorry about your luck.
    else if (actionResult.parried)
    {
      textPopBuilder.setValue(`PARRY!`);
    }
    // if the result is tp damage, treat it as such.
    else if (actionResult.hpDamage)
    {
      textPopBuilder
        .setValue(actionResult.hpDamage)
        .isHpDamage();
    }
    // if the result is tp damage, treat it as such.
    else if (actionResult.mpDamage)
    {
      textPopBuilder
        .setValue(actionResult.mpDamage)
        .isMpDamage();
    }
    // if the result is tp damage, treat it as such.
    else if (actionResult.tpDamage)
    {
      textPopBuilder
        .setValue(actionResult.mpDamage)
        .isTpDamage();
    }

    // if we somehow used this without a proper damage type, then just build a default.
    return textPopBuilder
      .setIconIndex(iconIndex)
      .isElemental(elementalRate)
      .setCritical(actionResult.critical)
      .build();
  };

  /**
   * Translates a skill's elemental affiliation into the icon id representing it.
   * @param {rm.types.Skill} skill The skill reference data itself.
   * @param {JABS_Battler} caster The battler performing the action.
   * @returns {number} The icon index to use for this popup.
   */
  determineElementalIcon(skill, caster)
  {
    // if not using the elemental icons, don't return one.
    if (!J.ABS.Metadata.UseElementalIcons) return 0;

    let elementId = skill.damage.elementId;

    // if the battler is an actor and the action is based on the weapon's elements
    // probe the weapon's traits for its actual element.
    if (elementId === -1 && caster.isActor())
    {
      const attackElements = caster.getBattler().attackElements();
      if (attackElements.length)
      {
        // we pick only the first element!
        elementId = attackElements[0];
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
  };
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
    let targetsHit = [];

    const allyTarget = casterJabsBattler.getAllyTarget();
    if (allyTarget && action.getAction()
      .isForOne())
    {
      if (allyTarget.canActionConnect() && allyTarget.isWithinScope(action, allyTarget, hitOne))
      {
        targetsHit.push(allyTarget);
        return targetsHit;
      }
    }

    battlers
      .filter(battler =>
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
          if (action.getAction()
            .isForUser())
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
          let dx = actionSprite.x - sprite.x;
          let dy = actionSprite.y - sprite.y;
          dx = dx >= 0 ? Math.max(dx, 0) : Math.min(dx, 0);
          dy = dy >= 0 ? Math.max(dy, 0) : Math.min(dy, 0);
          const result = this.isTargetWithinRange(caster.direction(), dx, dy, range, shape);
          if (result)
          {
            targetsHit.push(battler);
            hitOne = true;
          }
        }
      });

    return targetsHit;
  };

  /**
   * Determines collision of a given shape vs coordinates.
   * @param {number} facing The direction the caster is facing.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {string} shape The collision formula based on shape.
   */
  isTargetWithinRange(facing, dx, dy, range, shape)
  {
    switch (shape)
    {
      case J.BASE.Shapes.Rhombus:
        return this.collisionRhombus(Math.abs(dx), Math.abs(dy), range);
      case J.BASE.Shapes.Square:
        return this.collisionSquare(Math.abs(dx), Math.abs(dy), range);
      case J.BASE.Shapes.FrontSquare:
        return this.collisionFrontSquare(dx, dy, range, facing);
      case J.BASE.Shapes.Line:
        return this.collisionLine(dx, dy, range, facing);
      case J.BASE.Shapes.Arc:
        return this.collisionArc(dx, dy, range, facing);
      case J.BASE.Shapes.Wall:
        return this.collisionWall(dx, dy, range, facing);
      case J.BASE.Shapes.Cross:
        return this.collisionCross(dx, dy, range);
      default:
        return false;
    }
  };

  /**
   * A rhombus-shaped (aka diamond) collision.
   * Range determines the size of the rhombus surrounding the action.
   * This is typically used for AOE around the caster type skills, but could also
   * be used for very large objects, or as an explosion radius.
   * @param {number} absDx The absolute value of the distance between target and actions' `X` value.
   * @param {number} absDy The absolute value of the distance between target and actions' `Y` value.
   * @param {number} range How big the collision shape is.
   */
  collisionRhombus(absDx, absDy, range)
  {
    return (absDx + absDy) <= range;
  };

  /**
   * A square-shaped collision.
   * Range determines the size of the square around the action.
   * The use cases for this are similar to that of rhombus, but instead of a diamond-shaped
   * hitbox, its a plain ol' square.
   * @param {number} absDx The absolute value of the distance between target and actions' `X` value.
   * @param {number} absDy The absolute value of the distance between target and actions' `Y` value.
   * @param {number} range How big the collision square is.
   */
  collisionSquare(absDx, absDy, range)
  {
    const inHorzRange = absDx <= range;
    const inVertRange = absDy <= range;
    return inHorzRange && inVertRange;
  };

  /**
   * A square-shaped collision infront of the caster.
   * Range determines the size of the square infront of the action.
   * For when you want a square that doesn't affect targets behind the action. It would be
   * more accurate to call this a "half-square", really.
   * @param {number} dx The distance between target and actions' `X` value.
   * @param {number} dy The distance between target and actions' `Y` value.
   * @param {number} range How big the collision square is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionFrontSquare(dx, dy, range, facing)
  {
    const inHorzRange = Math.abs(dx) <= range;
    const inVertRange = Math.abs(dy) <= range;
    let isFacing = true;

    switch (facing)
    {
      case J.ABS.Directions.DOWN:
        isFacing = dy <= 0;
        break;
      case J.ABS.Directions.LEFT:
        isFacing = dx >= 0;
        break;
      case J.ABS.Directions.RIGHT:
        isFacing = dx <= 0;
        break;
      case J.ABS.Directions.UP:
        isFacing = dy >= 0;
        break;
    }

    return inHorzRange && inVertRange && isFacing;
  };

  /**
   * A line-shaped collision.
   * Range the distance of the of the line.
   * This is typically used for spears and other stabby attacks.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionLine(dx, dy, range, facing)
  {
    let result = false;
    switch (facing)
    {
      case J.ABS.Directions.DOWN:
        result = (dx === 0) && (dy >= 0) && (dy <= range);
        break;
      case J.ABS.Directions.UP:
        result = (dx === 0) && (dy <= 0) && (dy >= -range);
        break;
      case J.ABS.Directions.RIGHT:
        result = (dy === 0) && (dx >= 0) && (dx <= range);
        break;
      case J.ABS.Directions.LEFT:
        result = (dy === 0) && (dx <= 0) && (dx >= -range);
        break;
    }

    return result;
  };

  /**
   * An arc-shaped collision.
   * Range determines the reach and area of arc.
   * This is what could be considered a standard 180 degree slash-shape, the basic attack.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionArc(dx, dy, range, facing)
  {
    const inRange = (Math.abs(dx) + Math.abs(dy)) <= range;
    let isFacing = true;
    switch (facing)
    {
      case J.ABS.Directions.DOWN:
        isFacing = dy <= 0;
        break;
      case J.ABS.Directions.UP:
        isFacing = dy >= 0;
        break;
      case J.ABS.Directions.RIGHT:
        isFacing = dx <= 0;
        break;
      case J.ABS.Directions.LEFT:
        isFacing = dx >= 0;
        break;
    }

    return inRange && isFacing;
  };

  /**
   * A wall-shaped collision.
   * Range determines how wide the wall is.
   * Typically used for hitting targets to the side of the caster.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionWall(dx, dy, range, facing)
  {
    let result = false;
    switch (facing)
    {
      case J.ABS.Directions.DOWN:
      case J.ABS.Directions.UP:
        result = Math.abs(dx) <= range && dy === 0;
        break;
      case J.ABS.Directions.RIGHT:
      case J.ABS.Directions.LEFT:
        result = Math.abs(dy) <= range && dx === 0;
        break;
    }

    return result;
  };

  /**
   * A cross shaped collision.
   * Range determines how far the cross reaches from the action.
   * Think bomb explosions from the game bomberman.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   */
  collisionCross(dx, dy, range)
  {
    const inVertRange = Math.abs(dy) <= range && dx === 0;
    const inHorzRange = Math.abs(dx) <= range && dy === 0;
    return inVertRange || inHorzRange;
  };

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
  };

  /**
   * Handles the effects that occur before a target's defeat is processed,
   * such as "executes skill on death".
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  predefeatHandler(target, caster)
  {
    target.performPredefeatEffects(caster);
  };

  /**
   * Handles the effects that occur after a target's defeat is processed.
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  postDefeatHandler(target, caster)
  {
    target.performPostdefeatEffects(caster);
  };

  /**
   * Handles the defeat of the battler the player is currently controlling.
   */
  handleDefeatedPlayer()
  {
    this.performPartyCycling();
  };

  /**
   * Handles a non-player ally that was defeated.
   */
  handleDefeatedAlly(defeatedAlly)
  {
    //console.log(`${defeatedAlly.getBattler().name()} has died.`);
  };

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
  };

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
  };

  /**
   * Gets the multiplier based on difference in level between attacker and
   * target to determine if the battle was "too easy" or "very hard", resulting
   * in reduced or increased numeric rewards (excludes loot drops).
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  getRewardScalingMultiplier(enemy, actor)
  {
    let multiplier = 1.0;
    if (J.LEVEL && J.LEVEL.Metadata.Enabled)
    {
      multiplier = LevelScaling.multiplier(actor.getBattler().level, enemy.level);
    }

    return multiplier;
  };

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
      const gainedExperience = experience *= member.exr;
      member.gainExp(gainedExperience);
    });

    // generate the text popup for the experience earned.
    this.generatePopExperience(experience, casterCharacter);
  };

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
  };

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
  };

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
  };

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
  };

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
  };

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
  };

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
    const items = target
      .getBattler()
      .makeDropItems();
    if (items.length === 0) return;

    items.forEach(item => this.addLootDropToMap(target.getX(), target.getY(), item));
  };

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
  };

  /**
   * Generates popups for a pile of items picked up at the same time.
   * @param {rm.types.BaseItem[]} itemDataList All items picked up.
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
  };

  /**
   * Generates a popup for an acquired item.
   *
   * NOTE:
   * This is used from within the `generatePopItemBulk()`!
   * Use that instead of this!
   * @param {rm.types.BaseItem} itemData The item's database object.
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
  };

  /**
   * Creates the text pop of the acquired item.
   * @param {rm.types.BaseItem} itemData The item's database object.
   * @param {number} y The y coordiante for this item pop.
   */
  configureItemPop(itemData, y)
  {
    // build the popup.
    return new TextPopBuilder(itemData.name)
      .isLoot(y)
      .setIconIndex(itemData.iconIndex)
      .build();
  };

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
  };

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
  };

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
  };

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
  };

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
  };

  /**
   * Plays the level up animation on the character.
   * @param {Game_Character} character The player's `Game_Character`.
   */
  playLevelUpAnimation(character)
  {
    character.requestAnimation(49);
  };

  /**
   * Handles a skill being learned for the leader while on the map.
   * @param {rm.types.Skill} skill The skill being learned.
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
  };

  /**
   * Creates a text pop of the skill being learned.
   * @param {rm.types.Skill} skill The skill being learned.
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
  };

  /**
   * Configures the popup for a skill learned.
   * @param {rm.types.Skill} skill The skill learned.
   * @returns {Map_TextPop}
   */
  configureSkillLearnPop(skill)
  {
    return new TextPopBuilder(skill.name)
      .isSkillLearned(skill.iconIndex)
      .build();
  };

  /**
   * Creates a skill learning log for the player.
   * @param {rm.types.Skill} skill The skill being learned.
   * @param {JABS_Battler} player The player's `JABS_Battler`.
   */
  createSkillLearnLog(skill, player)
  {
    if (!J.LOG) return;

    const log = this.configureSkillLearnLog(player.getReferenceData().name, skill.id);
    $gameTextLog.addLog(log);
  };

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
  };

//#endregion defeated target aftermath
}
//#endregion JABS_Engine

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
  constructor() { throw new Error('JABS_InputAdapter is a static class.')};

  /**
   * Registers a controller with this input adapter.
   * @param {JABS_InputController|any} controller The controller to register.
   */
  static register(controller)
  {
    this.controllers.push(controller);
  };

  /**
   * Checks whether or not any controllers have been registered
   * with this input adapter.
   * @returns {boolean} True if we have at least one registered controller, false otherwise.
   */
  static hasControllers()
  {
    return this.controllers.length > 0;
  };

  /**
   * Executes an action on the map based on the mainhand skill slot.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performMainhandAction(jabsBattler)
  {
    // if the mainhand action isn't ready, then do not perform.
    if (!this.canPerformMainhandAction(jabsBattler)) return;

    // get all actions associated with the mainhand.
    let actions = jabsBattler.getAttackData(JABS_Button.Main);

    // apply the cooldown type to the appropriate slot.
    actions.forEach(action => action.setCooldownType(JABS_Button.Main));

    // set the player's pending actions action to this skill.
    jabsBattler.setDecidedAction(actions);

    // set the cast time for this battler to the primary skill in the list.
    jabsBattler.setCastCountdown(actions[0].getCastTime());

    // reset the combo data now that we are executing the actions.
    jabsBattler.resetComboData(JABS_Button.Main);
  };

  /**
   * Determines whether or not the player can execute the mainhand action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformMainhandAction(jabsBattler)
  {
    // do not perform actions if there is pedestrians infront of you!
    if ($gameMap.hasInteractableEventInFront(jabsBattler)) return false;

    // if the battler can't use attacks, then do not perform.
    if (!jabsBattler.canBattlerUseAttacks()) return false;

    // if the mainhand action isn't ready, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Main)) return false;

    // get all actions associated with the mainhand.
    const actions = jabsBattler.getAttackData(JABS_Button.Main);

    // if there are none, then do not perform.
    if (!actions || !actions.length) return false;

    // if the player is casting, then do not perform.
    if (jabsBattler.isCasting()) return false;

    // perform!
    return true;
  };

  /**
   * Executes an action on the map based on the offhand skill slot.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performOffhandAction(jabsBattler)
  {
    // if the offhand action isn't ready, then do not perform.
    if (!this.canPerformOffhandAction(jabsBattler)) return;

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
  };

  /**
   * Determines whether or not the player can execute the offhand action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformOffhandAction(jabsBattler)
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
  };

  /**
   * Begins the execution of a tool.
   * Depending on the equipped tool, this can perform a variety of types of actions.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performToolAction(jabsBattler)
  {
    // if the tool action isn't ready, then do not perform.
    if (!this.canPerformToolAction(jabsBattler)) return;

    // grab the tool id currently equipped.
    const toolId = jabsBattler.getBattler().getEquippedSkill(JABS_Button.Tool);

    // perform tool effects!
    jabsBattler.applyToolEffects(toolId);
  };

  /**
   * Determines whether or not the player can execute the tool action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformToolAction(jabsBattler)
  {
    // if the tool is not off cooldown, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Tool)) return false;

    // if there is no tool equipped, then do not perform.
    if (!jabsBattler.getBattler().getEquippedSkill(JABS_Button.Tool)) return false;

    // perform!
    return true;
  };

  /**
   * Executes the dodge action.
   * The player will perform some sort of mobility action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performDodgeAction(jabsBattler)
  {
    // check if we can dodge.
    if (!this.canPerformDodge(jabsBattler)) return;

    // perform the dodge skill.
    jabsBattler.tryDodgeSkill();
  };

  /**
   * Determines whether or not the player can perform a dodge skill.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformDodge(jabsBattler)
  {
    // if the dodge skill is not off cooldown, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Dodge)) return false;

    // if the player is unable to move for some reason, do not perform.
    if (!jabsBattler.canBattlerMove()) return false;

    // perform!
    return true;
  };

  /**
   * Begins execution of a skill based on any of the L1 + ABXY skill slots.
   * @param {number} slot The slot associated with the combat action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performCombatAction(slot, jabsBattler)
  {
    // if the offhand action isn't ready, then do not perform.
    if (!this.canPerformCombatActionBySlot(slot, jabsBattler)) return;

    // get all actions associated with the offhand.
    const actions = jabsBattler.getAttackData(slot);

    // set the player's pending actions action to this skill.
    jabsBattler.setDecidedAction(actions);

    // set the cast time for this battler to the primary skill in the list.
    jabsBattler.setCastCountdown(actions[0].getCastTime());
  };

  /**
   * Determines whether or not the player can execute the combat action.
   * @param {string} slot The slot to check if is able to be used.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformCombatActionBySlot(slot, jabsBattler)
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
  };

  /**
   * Executes the strafe action.
   * The player will not change the direction they are facing while strafing is active.
   * @param {boolean} strafing True if the player is strafing, false otherwise.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performStrafe(strafing, jabsBattler)
  {
    // check if we can strafe.
    if (!this.canPerformStrafe(jabsBattler)) return;

    // perform the strafe.
    jabsBattler.getCharacter().setDirectionFix(strafing);
  };

  /**
   * Determines whether or not the player can strafe and hold direction while moving.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformStrafe(jabsBattler)
  {
    return true;
  };

  /**
   * Executes the rotation action.
   * The player will not change move while rotation is active.
   * @param {boolean} rotating True if the player is rotating, false otherwise.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performRotate(rotating, jabsBattler)
  {
    // check if we can rotate.
    if (!this.canPerformRotate(jabsBattler)) return;

    // perform the rotation.
    jabsBattler.setMovementLock(rotating);
  };

  /**
   * Determines whether or not the player can rotate in-place without movement.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformRotate(jabsBattler)
  {
    return true;
  };

  /**
   * Executes the guard action.
   * The player will only perform the guard action if the offhand slot is a guard-ready skill.
   * @param {boolean} guarding True if the player is guarding, false otherwise.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performGuard(guarding, jabsBattler)
  {
    // check if we can guard with the offhand slot.
    if (!this.canPerformGuardBySlot(JABS_Button.Offhand, jabsBattler)) return;

    // perform the guard skill in the offhand slot.
    jabsBattler.executeGuard(guarding, JABS_Button.Offhand);
  };

  /**
   * Determines whether or not the player can guard.
   * @param {string} slot The slot to check if is able to be used.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformGuardBySlot(slot, jabsBattler)
  {
    // if the offhand slot is not a guard skill, then do not perform.
    if (!jabsBattler.isGuardSkillByKey(slot)) return false;

    // perform!
    return true;
  };

  /**
   * Rotates the leader out to the back and pulls in the next-in-line.
   *
   * NOTE:
   * The logic of party cycling remains in the engine for exposure.
   */
  static performPartyCycling(force = false)
  {
    // check if we can party cycle.
    if (!this.canPerformPartyCycling(force)) return;

    // execute the party cycling.
    $jabsEngine.performPartyCycling(force);
  };

  /**
   * Determines whether or not the player can party cycle.
   * @param {boolean} force Using `force` overrides party-cycle-lock.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformPartyCycling(force)
  {
    // if rotating is disabled, then skip- forced cycling bypasses this check.
    if (!$gameParty.canPartyCycle() && !force) return false;

    // you can't rotate if there is no party to rotate through.
    if ($gameParty._actors.length === 1) return false;

    // cycle!
    return true;
  };

  /**
   * Calls the JABS quick menu on the map.
   */
  static performMenuAction()
  {
    // if we cannot call the menu, then do not.
    if (!this.canPerformMenuAction()) return;

    // pause JABS.
    $jabsEngine.absPause = true;

    // request the menu.
    $jabsEngine.requestAbsMenu = true;
  };

  /**
   * Determines whether or not we can call the menu.
   * @returns {boolean} True if they can, false otherwise.
   */
  static canPerformMenuAction()
  {
    // there are currently no conditions for accessing the JABS menu.
    return true;
  };
}
//#endregion JABS_InputAdapter
//ENDFILE