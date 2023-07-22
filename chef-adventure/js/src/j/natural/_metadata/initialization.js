//region Metadata
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.NATURAL = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.NATURAL.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-NaturalGrowth`,

  /**
   * The version of this plugin.
   */
  Version: '2.0.1',
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.NATURAL.PluginParameters = PluginManager.parameters(J.NATURAL.Metadata.Name);
J.NATURAL.Metadata.BaseTpMaxActors = Number(J.NATURAL.PluginParameters['actorBaseTp']);
J.NATURAL.Metadata.BaseTpMaxEnemies = Number(J.NATURAL.PluginParameters['enemyBaseTp']);

/**
 * A collection of all aliased methods for this plugin.
 */
J.NATURAL.Aliased = {
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_Enemy: new Map(),
  Game_Party: new Map(),

  Scene_Equip: new Map(),

  Window_EquipItem: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.NATURAL.RegExp = {
  // base parameters.
  // base parameter buffs flat (temporary).
  MaxLifeBuffPlus: /<mhpBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MaxMagiBuffPlus: /<mmpBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  PowerBuffPlus: /<atkBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  DefenseBuffPlus: /<defBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ForceBuffPlus: /<matBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ResistBuffPlus: /<mdfBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  SpeedBuffPlus: /<agiBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  LuckBuffPlus: /<lukBuffPlus:\[([+\-*/ ().\w]+)]>/gi,

  // base parameter buffs rate (temporary).
  MaxLifeBuffRate: /<mhpBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MaxMagiBuffRate: /<mmpBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  PowerBuffRate: /<atkBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  DefenseBuffRate: /<defBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ForceBuffRate: /<matBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ResistBuffRate: /<mdfBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  SpeedBuffRate: /<agiBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  LuckBuffRate: /<lukBuffRate:\[([+\-*/ ().\w]+)]>/gi,

  // base parameter growths flat (permanent)
  MaxLifeGrowthPlus: /<mhpGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MaxMagiGrowthPlus: /<mmpGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  PowerGrowthPlus: /<atkGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  DefenseGrowthPlus: /<defGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ForceGrowthPlus: /<matGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ResistGrowthPlus: /<mdfGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  SpeedGrowthPlus: /<agiGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  LuckGrowthPlus: /<lukGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,

  // base parameter growths rate (permanent)
  MaxLifeGrowthRate: /<mhpGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MaxMagiGrowthRate: /<mmpGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  PowerGrowthRate: /<atkGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  DefenseGrowthRate: /<defGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ForceGrowthRate: /<matGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ResistGrowthRate: /<mdfGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  SpeedGrowthRate: /<agiGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  LuckGrowthRate: /<lukGrowthRate:\[([+\-*/ ().\w]+)]>/gi,

  // ex parameters.
  // ex parameter buffs flat (temporary).
  HitBuffPlus: /<hitBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  EvadeBuffPlus: /<evaBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritChanceBuffPlus: /<criBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritEvadeBuffPlus: /<cevBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiEvadeBuffPlus: /<mevBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiReflectBuffPlus: /<mrfBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CounterBuffPlus: /<cntBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  LifeRegenBuffPlus: /<hrgBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiRegenBuffPlus: /<mrgBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  TechRegenBuffPlus: /<trgBuffPlus:\[([+\-*/ ().\w]+)]>/gi,

  // ex parameter buffs rate (temporary).
  HitBuffRate: /<hitBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  EvadeBuffRate: /<evaBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CritChanceBuffRate: /<criBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CritEvadeBuffRate: /<cevBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiEvadeBuffRate: /<mevBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiReflectBuffRate: /<mrfBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CounterBuffRate: /<cntBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  LifeRegenBuffRate: /<hrgBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiRegenBuffRate: /<mrgBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  TechRegenBuffRate: /<trgBuffRate:\[([+\-*/ ().\w]+)]>/gi,

  // ex parameter growths flat (permanent)
  HitGrowthPlus: /<hitGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  EvadeGrowthPlus: /<evaGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritChanceGrowthPlus: /<criGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritEvadeGrowthPlus: /<cevGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiEvadeGrowthPlus: /<mevGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiReflectGrowthPlus: /<mrfGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CounterGrowthPlus: /<cntGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  LifeRegenGrowthPlus: /<hrgGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiRegenGrowthPlus: /<mrgGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  TechRegenGrowthPlus: /<trgGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,

  // ex parameter growths rate (permanent)
  HitGrowthRate: /<hitGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  EvadeGrowthRate: /<evaGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  CritChanceGrowthRate: /<criGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  CritEvadeGrowthRate: /<cevGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiEvadeGrowthRate: /<mevGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiReflectGrowthRate: /<mrfGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  CounterGrowthRate: /<cntGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  LifeRegenGrowthRate: /<hrgGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiRegenGrowthRate: /<mrgGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  TechRegenGrowthRate: /<trgGrowthRate:\[([+\-*/ ().\w]+)]>/gi,

  // sp parameters.
  // sp parameter buffs flat (temporary).
  AggroBuffPlus: /<tgrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ParryBuffPlus: /<grdBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  HealingBuffPlus: /<recBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ItemFxBuffPlus: /<phaBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiCostRateBuffPlus: /<mcrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  TechCostRateBuffPlus: /<tcrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  PhysDmgRateBuffPlus: /<pdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiDmgRateBuffPlus: /<mdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  FloorDmgRateBuffPlus: /<fdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ExpGainRateBuffPlus: /<exrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,

  // sp parameter buffs rate (temporary).
  AggroBuffRate: /<tgrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ParryBuffRate: /<grdBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  HealingBuffRate: /<recBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ItemFxBuffRate: /<phaBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiCostRateBuffRate: /<mcrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  TechCostRateBuffRate: /<tcrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  PhysDmgRateBuffRate: /<pdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiDmgRateBuffRate: /<mdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  FloorDmgRateBuffRate: /<fdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ExpGainRateBuffRate: /<exrBuffRate:\[([+\-*/ ().\w]+)]>/gi,

  // sp parameter growths flat (permanent).
  AggroGrowthPlus: /<tgrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ParryGrowthPlus: /<grdGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  HealingGrowthPlus: /<recGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ItemFxGrowthPlus: /<phaGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiCostRateGrowthPlus: /<mcrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  TechCostRateGrowthPlus: /<tcrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  PhysDmgRateGrowthPlus: /<pdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiDmgRateGrowthPlus: /<mdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  FloorDmgRateGrowthPlus: /<fdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ExpGainRateGrowthPlus: /<exrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,

  // sp parameter buffs rate (permanent).
  AggroGrowthRate: /<tgrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ParryGrowthRate: /<grdGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  HealingGrowthRate: /<recGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ItemFxGrowthRate: /<phaGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiCostRateGrowthRate: /<mcrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  TechCostRateGrowthRate: /<tcrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  PhysDmgRateGrowthRate: /<pdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiDmgRateGrowthRate: /<mdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  FloorDmgRateGrowthRate: /<fdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ExpGainRateGrowthRate: /<exrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,

  // additionally supported parameters.
  // TP-related parameters.
  BaseMaxTech: /<baseMaxTp:\[([+\-*/ ().\w]+)]>/gi,
  MaxTechBuffPlus: /mtpBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MaxTechBuffRate: /mtpBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MaxTechGrowthPlus: /mtpGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MaxTechGrowthRate: /mtpGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
};
//endregion Metadata