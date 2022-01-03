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
 * This plugin enables battles to carried out on the map, akin to what you'd
 * find in the Zelda franchise or other hack'n'slash games.
 * 
 * In order to accomplish this, events are tagged with comments that this
 * engine translates into various data points that create battlers on the map.
 * ============================================================================
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
 * @text Guard Skill Type Id
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
 * @option R1A
 * @option R1B
 * @option R1X
 * @option R1Y
 * @option L1A
 * @option L1B
 * @option L1X
 * @option L1Y
 * @default R1A
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
 * @option R1A
 * @option R1B
 * @option R1X
 * @option R1Y
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
//#endregion Introduction
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
      return Game_Actor.JABS_TOOLSKILL;
    case "Dodge":
      return Game_Actor.JABS_DODGESKILL;
    case "R1A":
      return Game_Actor.JABS_R1_A_SKILL;
    case "R1B":
      return Game_Actor.JABS_R1_B_SKILL;
    case "R1X":
      return Game_Actor.JABS_R1_X_SKILL;
    case "R1Y":
      return Game_Actor.JABS_R1_Y_SKILL;
    case "L1A":
      return Game_Actor.JABS_L1_A_SKILL;
    case "L1B":
      return Game_Actor.JABS_L1_B_SKILL;
    case "L1X":
      return Game_Actor.JABS_L1_X_SKILL;
    case "L1Y":
      return Game_Actor.JABS_L1_Y_SKILL;
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
  $gameBattleMap.absEnabled = true;
});

/**
 * Plugin command for disabling JABS.
 */
PluginManager.registerCommand(J.ABS.Metadata.Name, "Disable JABS", () =>
{
  $gameBattleMap.absEnabled = false;
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
  $gameBattleMap.rotatePartyMembers(true);
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
  $gameBattleMap.requestJabsMenuRefresh = true;
});
//#endregion Plugin Command Registration

//ENDFILE