//region Metadata
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
})();
//endregion version check

//region plugin setup and configuration
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS = {};

/**
 * The parent namespace for all JABS extensions.
 */
J.ABS.EXT = {}

//region helpers
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
    const { elementId, iconIndex } = kvp;
    return {element: parseInt(elementId), icon: parseInt(iconIndex)};
  });
};
//endregion helpers

//region metadata
/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.Metadata = {};
J.ABS.Metadata.Name = 'J-ABS';
J.ABS.Metadata.Version = '3.2.2';

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
//endregion metadata

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
  //region ON SKILLS
  ActionId: /<actionId:[ ]?(\d+)>/gi,

  // pre-execution-related.
  CastTime: /<castTime:[ ]?(\d+)>/gi,
  CastAnimation: /<castAnimation:[ ]?(\d+)>/gi,

  // post-execution-related.
  Cooldown: /<cooldown:[ ]?(\d+)>/gi,
  UniqueCooldown: /<uniqueCooldown>/gi,

  // projectile-related.
  Range: /<radius:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/gi,
  Proximity: /<proximity:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/gi,
  Projectile: /<projectile:[ ]?([12348])>/gi,
  Shape: /<hitbox:[ ]?(circle|rhombus|square|frontsquare|line|arc|wall|cross)>/gi,
  Direct: /<direct>/gi,
  Duration: /<duration:[ ]?(\d+)>/gi,
  Knockback: /<knockback:[ ]?(\d+)>/gi,
  DelayData: /<delay:[ ]?(\[-?\d+,[ ]?(true|false)])>/gi,

  // animation-related.
  SelfAnimationId: /<selfAnimationId:[ ]?(\d+)>/gi,
  PoseSuffix: /<poseSuffix:[ ]?(\[[-_]?\w+,[ ]?\d+,[ ]?\d+])>/gi,

  // combo-related.
  ComboAction: /<combo:[ ]?(\[\d+,[ ]?\d+])>/gi,
  ComboStarter: /<comboStarter>/gi,
  AiSkillExclusion: /<aiSkillExclusion>/gi,
  FreeCombo: /<freeCombo>/gi,

  // learning-related
  AutoAssign: /<autoAssignSkills>/gi,
  AssignInPlaceOf: /<autoAssignOnLearning:(\d+)>/gi,

  // aggro-related.
  BonusAggro: /<aggro:[ ]?(-?\d+)>/gi,
  AggroMultiplier: /<aggroMultiplier:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/gi,

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
  Retaliate: /<retaliate:[ ]?(\[\d+,?[ ]?[\d+]?])>/gi,
  OnOwnDefeat: /<onOwnDefeat:[ ]?(\[\d+,?[ ]?[\d+]?])>/gi,
  onTargetDefeat: /<onTargetDefeat:[ ]?(\[\d+,?[ ]?[\d+]?])>/gi,
  //endregion ON SKILLS

  //region ON EQUIPS
  // skill-related.
  SkillId: /<skillId:[ ]?(\d+)>/gi,
  OffhandSkillId: /<offhandSkillId:[ ]?(\d+)>/gi,

  // knockback-related.
  KnockbackResist: /<knockbackResist:[ ]?(\d+)>/gi,

  // parry-related.
  IgnoreParry: /<ignoreParry:[ ]?(\d+)>/gi,
  //endregion ON EQUIPS

  //region ON ITEMS
  UseOnPickup: /<useOnPickup>/gi,
  Expires: /<expires:[ ]?(\d+)>/gi,
  //endregion ON ITEMS

  //region ON STATES
  // definition-related.
  Negative: /<negative>/gi,

  // jabs core ailment functionalities.
  Paralyzed: /<paralyzed>/gi,
  Rooted: /<rooted>/gi,
  Disarmed: /<disabled>/gi,
  Muted: /<muted>/gi,

  // aggro-related.
  AggroLock: /<aggroLock>/gi,
  AggroOutAmp: /<aggroOutAmp:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/gi,
  AggroInAmp: /<aggroInAmp:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/gi,

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
  //endregion ON STATES

  //region ON BATTLERS
  // core concepts.
  EnemyId: /<enemyId:[ ]?([0-9]*)>/i,
  TeamId: /<teamId:[ ]?([0-9]*)>/g,
  Sight: /<sight:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
  Pursuit: /<pursuit:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
  MoveSpeed: /<moveSpeed:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
  PrepareTime: /<prepare:[ ]?([0-9]*)>/i,

  // bonus concepts.
  VisionMultiplier: /<visionMultiplier:[ ]?(-?[\d]+)>/i,

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
  //endregion ON BATTLERS

  //region ON ACTORS/CLASSES
  ConfigNoSwitch: /<noSwitch>/i,
  //endregion ON ACTORS/CLASSES
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.Aliased = {
  DataManager: new Map(),

  Game_Actor: new Map(),
  Game_Action: new Map(),
  Game_ActionResult: new Map(),
  Game_Battler: new Map(),
  Game_Character: new Map(),
  Game_CharacterBase: new Map(),
  Game_Enemy: new Map(),
  Game_Event: new Map(),
  Game_Interpreter: {},
  Game_Map: new Map(),
  Game_Party: new Map(),
  Game_Player: new Map(),
  Game_Switches: new Map(),
  Game_Unit: new Map(),

  RPG_Actor: new Map(),
  RPG_Enemy: new Map(),
  RPG_Skill: new Map(),

  Scene_Load: new Map(),
  Scene_Map: new Map(),

  Spriteset_Map: new Map(),
  Sprite_Character: new Map(),
  Sprite_Gauge: new Map(),
};
//endregion Plugin setup & configuration

//region Plugin Command Registration
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
  const { actorId, skillId, itemId, slot, locked } = args;

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

  const { Slot } = args;
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
// PluginManager.registerCommand(J.ABS.Metadata.Name, "HP Damage to Enemy", args =>
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

//endregion Plugin Command Registration
//endregion Metadata