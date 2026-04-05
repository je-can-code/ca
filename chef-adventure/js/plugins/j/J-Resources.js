//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 RESOURCES] Extends skill cost/gain system to include HP, MP, and TP.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin extends the skill cost and gain system to support HP, MP, and TP
 * costs and gains defined entirely through notetags.
 *
 * Integrates with other plugins:
 * - J-ABS; JABS will use these costs/gains when executing skills.
 * - J-CMS-Skill; the skill detail window will display HP costs.
 * - J-HUD-InputFrame; the input frame will display HP costs on skill slots.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * By default, RMMZ supports MP and TP costs on skills via the editor.
 * This plugin adds HP cost and gain support, as well as tag-based flat,
 * percentage, and formula costs for MP and TP as well.
 *
 * longParam ID 34 is reserved by this plugin for the HP cost parameter.
 *
 * ============================================================================
 * HP COST
 * By applying the appropriate notetag to a skill, that skill will cost HP
 * to execute. HP costs can be flat, percentage, or formula-based.
 *
 * NOTE: By default, a battler cannot cast a skill if its HP cost would kill
 * them. Add the sacrifice tag to allow casting even when it would be lethal.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT (flat):
 *  <hp-cost:FLAT>
 *    Where FLAT is the flat amount of HP to deduct.
 *
 * TAG FORMAT (percentage):
 *  <hp-cost:PERCENT%>
 *    Where PERCENT is the percentage of max HP to deduct.
 *
 * TAG FORMAT (formula):
 *  <hp-cost:[FORMULA]>
 *    Where FORMULA is an eval'd expression with access to `a` (the battler).
 *
 * TAG FORMAT (lethal / sacrifice):
 *  <hp-cost-sacrifice>
 *    Allows casting even when the HP cost would reduce HP to 0.
 *
 * TAG EXAMPLES:
 *  <hp-cost:50>
 *    Costs exactly 50 HP.
 *
 *  <hp-cost:10%>
 *    Costs 10% of max HP.
 *
 *  <hp-cost:[a.mhp / 4]>
 *    Costs 25% of max HP via formula.
 *
 *  <hp-cost-sacrifice>
 *    This skill can be cast even if it would reduce the caster to 0 HP.
 *
 * ============================================================================
 * HP COST REDUCTION (HCR)
 * Mirroring MCR (MP Cost Rate) and TCR (TP Cost Rate), HCR reduces the total
 * HP cost of skills. Unlike MCR/TCR which are multipliers, HCR is additive
 * subtraction from 100 — a tag of <hcr:5> means "reduce HP costs by 5%".
 *
 * TAG USAGE:
 * - Actors
 * - Enemies
 * - Classes
 * - Equips (weapons, armors)
 * - States
 *
 * TAG FORMAT:
 *  <hcr:VALUE>
 *    Where VALUE is the integer percentage to reduce HP costs by.
 *
 * TAG EXAMPLES:
 *  <hcr:5>
 *    Reduces all HP skill costs by 5%.
 *
 * ============================================================================
 * HP GAIN
 * By applying the appropriate notetag to a skill, that skill will restore HP
 * upon being cast. HP gains can be flat, percentage, or formula-based.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT (flat):
 *  <hp-gain:FLAT>
 *
 * TAG FORMAT (percentage):
 *  <hp-gain:PERCENT%>
 *
 * TAG FORMAT (formula):
 *  <hp-gain:[FORMULA]>
 *
 * ============================================================================
 * EXTRA MP / TP COSTS AND GAINS
 * The same flat/percent/formula tags are also available for MP and TP,
 * layered on top of the editor's native MP/TP cost fields.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT:
 *  <mp-cost:VALUE>  <mp-cost:PERCENT%>  <mp-cost:[FORMULA]>
 *  <tp-cost:VALUE>  <tp-cost:PERCENT%>  <tp-cost:[FORMULA]>
 *  <mp-gain:VALUE>  <mp-gain:PERCENT%>  <mp-gain:[FORMULA]>
 *  <tp-gain:VALUE>  <tp-gain:PERCENT%>  <tp-gain:[FORMULA]>
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 *    Added HP/MP/TP costs and gains via flat, percent, and formula notetags.
 *    Added HCR (HP Cost Reduction) as an additive stat sourced from traits.
 *    Added sacrifice tag to allow lethal HP costs.
 *    Registered longParam ID 34 for Life Cost.
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 101
 *
 */
//endregion annotations

//region plugin metadata
class JResources_PluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);
  }
}

//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.RESOURCES = {};

/**
 * The plugin umbrella that governs all extensions related to the parent.
 */
J.RESOURCES.EXT ||= {};

/**
 * The metadata associated with this plugin.
 */
J.RESOURCES.Metadata = new JResources_PluginMetadata('J-Resources', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.RESOURCES.Aliased = {};
J.RESOURCES.Aliased.IconManager = new Map();
J.RESOURCES.Aliased.TextManager = new Map();
J.RESOURCES.Aliased.Game_BattlerBase = new Map();
J.RESOURCES.Aliased.Game_Battler = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.RESOURCES.RegExp = {};
J.RESOURCES.RegExp.HpCostReduction = /<hrc:\[([+\-*/ ().\w]+)]>/gi;

J.RESOURCES.RegExp.HpCostFlat = /<hp-cost:(\d+)>/gi;
J.RESOURCES.RegExp.HpCostPercent = /<hp-cost:(\d+)%>/gi;
J.RESOURCES.RegExp.HpCostFormula = /<hp-cost:\[([+\-*/ ().\w]+)]>/gi;
J.RESOURCES.RegExp.HpCostLethal = /<hp-cost-can-kill>/i;

J.RESOURCES.RegExp.HpGainFlat = /<hp-gain:(\d+)>/i;
J.RESOURCES.RegExp.HpGainPercent = /<hp-gain:(\d+)%>/i;
J.RESOURCES.RegExp.HpGainFormula = /<hp-gain:\[([+\-*/ ().\w]+)]>/gi;

J.RESOURCES.RegExp.MpCostFlat = /<mp-cost:(\d+)>/gi;
J.RESOURCES.RegExp.MpCostPercent = /<mp-cost:(\d+)%>/gi;
J.RESOURCES.RegExp.MpCostFormula = /<mp-cost:\[([+\-*/ ().\w]+)]>/gi;

J.RESOURCES.RegExp.MpGainFlat = /<mp-gain:(\d+)>/i;
J.RESOURCES.RegExp.MpGainPercent = /<mp-gain:(\d+)%>/i;
J.RESOURCES.RegExp.MpGainFormula = /<mp-gain:\[([+\-*/ ().\w]+)]>/gi;

J.RESOURCES.RegExp.TpCostFlat = /<tp-cost:(\d+)>/gi;
J.RESOURCES.RegExp.TpCostPercent = /<tp-cost:(\d+)%>/gi;
J.RESOURCES.RegExp.TpCostFormula = /<tp-cost:\[([+\-*/ ().\w]+)]>/gi;

J.RESOURCES.RegExp.TpGainFlat = /<tp-gain:(\d+)>/i;
J.RESOURCES.RegExp.TpGainPercent = /<tp-gain:(\d+)%>/i;
J.RESOURCES.RegExp.TpGainFormula = /<tp-gain:\[([+\-*/ ().\w]+)]>/gi;

//endregion initialization

//region RPG_Traited
/**
 * Gets the hp cost reduction for this battler.
 * @returns {number}
 */
RPG_Traited.prototype.hcr = function()
{
  return RPGManager.getResultFromNoteByRegex(this, J.RESOURCES.RegExp.HpCostReduction, 0);
};
//endregion RPG_Traited

//region ColorManager
/**
 * Gets the color for HP costs.
 * Mirrors the existing {@link ColorManager.mpCostColor} and {@link ColorManager.tpCostColor}.
 * @returns {string} The hex color string for HP cost text.
 */
ColorManager.hpCostColor = function()
{
  return this.textColor(18);
};
//endregion ColorManager


//region IconManager
/**
 * Gets the icon index for the HP skill cost parameter.
 * Mirrors {@link IconManager.sparam} entries for MCR (964) and TCR (965).
 * @returns {number}
 */
IconManager.hpCost = function()
{
  return 928;
};

/**
 * Extends {@link IconManager.longParam}.<br/>
 * Adds longParam ID 34 for the HP cost icon.
 * J-Resources registers ID 34 for this purpose.
 * @param {number} paramId The long parameter id.
 * @returns {number}
 */
J.RESOURCES.Aliased.IconManager.set('longParam', IconManager.longParam);
IconManager.longParam = function(paramId)
{
  // handle the hp cost longParam id.
  if (paramId === 34)
  {
    return this.hpCost();
  }

  // perform original logic.
  return J.RESOURCES.Aliased.IconManager.get('longParam')
    .call(this, paramId);
};
//endregion IconManager


//region ResourceCostManager
class ResourceCostManager
{
  /**
   * Determines the amount of HP cost for a skill.
   * @param {Game_Actor|Game_Enemy} battler The battler to check.
   * @param {RPG_Skill} skill The skill to check.
   * @returns {number}
   */
  static hpCostBySkill(battler, skill)
  {
    // extract the costs from the skill's note.
    const flatCost = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.HpCostFlat);
    const percentCost = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.HpCostPercent);
    const calculatedPercentCost = battler.mhp * (percentCost / 100);
    const formulaCosts = RPGManager.getResultFromNoteByRegex(
      skill,
      J.RESOURCES.RegExp.HpCostFormula,
      (flatCost + calculatedPercentCost),
      battler
    );

    // if there are no costs, then return 0.
    if (flatCost === 0 && calculatedPercentCost === 0 && formulaCosts === 0) return 0;

    // add all the costs together.
    const sumCost = flatCost + calculatedPercentCost + formulaCosts;

    // determine how the cost reduction applies to the skill cost.
    const totalCost = battler.hcrFactor() * sumCost;

    // return the total cost.
    return totalCost;
  }

  /**
   * Determines the additional amount of MP cost for a skill.
   * @param {Game_Actor|Game_Enemy} battler The battler to check.
   * @param {RPG_Skill} skill The skill to check.
   * @returns {number}
   */
  static extraMpCostBySkill(battler, skill)
  {
    // extract the costs from the skill's note.
    const flatCost = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.MpCostFlat);
    const percentCost = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.MpCostPercent);
    const calculatedPercentCost = battler.mmp * (percentCost / 100);
    const formulaCosts = RPGManager.getResultFromNoteByRegex(
      skill,
      J.RESOURCES.RegExp.MpCostFormula,
      (flatCost + calculatedPercentCost),
      battler
    );

    // if there are no costs, then return 0.
    if (flatCost === 0 && calculatedPercentCost === 0 && formulaCosts === 0) return 0;

    // add all the costs together.
    const sumCost = flatCost + calculatedPercentCost + formulaCosts;

    // determine how the cost reduction applies to the skill cost.
    const totalCost = battler.mcr * sumCost;

    // return the total cost.
    return totalCost;
  }

  /**
   * Determines the additional amount of TP cost for a skill.
   * @param {Game_Actor|Game_Enemy} battler The battler to check.
   * @param {RPG_Skill} skill The skill to check.
   * @returns {number}
   */
  static extraTpCostBySkill(battler, skill)
  {
    // extract the costs from the skill's note.
    const flatCost = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.TpCostFlat);
    const percentCost = RPGManager.getNumberFromNoteByRegex(skill, J.RESOURCES.RegExp.TpCostPercent);
    const calculatedPercentCost = battler.mtp * (percentCost / 100);
    const formulaCosts = RPGManager.getResultFromNoteByRegex(
      skill ,
      J.RESOURCES.RegExp.TpCostFormula,
      (flatCost + calculatedPercentCost),
      battler
    );

    // if there are no costs, then return 0.
    if (flatCost === 0 && calculatedPercentCost === 0 && formulaCosts === 0) return 0;

    // add all the costs together.
    const sumCost = flatCost + calculatedPercentCost + formulaCosts;

    // determine how the cost reduction applies to the skill cost.
    const totalCost = battler.tcr * sumCost;

    // return the total cost.
    return totalCost;
  }

  /**
   * Calculate the amount of HP gained from a skill.
   * @param {Game_Actor|Game_Enemy} battler The battler to gain hp.
   * @param {RPG_Skill} skill The skill to gain hp from.
   * @returns {number}
   */
  static skillGainHp(battler, skill)
  {
    // identify the true form of the skill.
    const battlerSkill = battler.skill(skill.id);

    // extract the gains from the skill's note.
    const flatGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.HpGainFlat);
    const percentGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.HpGainPercent);
    const calculatedPercentGain = battler.mhp * (percentGain / 100);
    const formulaGains = RPGManager.getResultFromNoteByRegex(
      battlerSkill,
      J.RESOURCES.RegExp.HpGainFormula,
      (flatGain + calculatedPercentGain),
      battler
    );

    // if there are no gains, then return 0.
    if (flatGain === 0 && calculatedPercentGain === 0 && formulaGains === 0) return 0;

    // add all the gains together and apply REC.
    const gains = (flatGain + calculatedPercentGain + formulaGains) * battler.rec;

    // return the total gains.
    return gains;
  }

  /**
   * Calculate the amount of MP gained from a skill.
   * @param {Game_Actor|Game_Enemy} battler The battler to gain mp.
   * @param {RPG_Skill} skill The skill to gain mp from.
   * @returns {number}
   */
  static skillGainMp(battler, skill)
  {
    // identify the true form of the skill.
    const battlerSkill = battler.skill(skill.id);

    // extract the gains from the skill's note.
    const flatGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.MpGainFlat);
    const percentGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.MpGainPercent);
    const calculatedPercentGain = battler.mmp * (percentGain / 100);
    const formulaGains = RPGManager.getResultFromNoteByRegex(
      battlerSkill,
      J.RESOURCES.RegExp.MpGainFormula,
      (flatGain + calculatedPercentGain),
      battler
    );

    // if there are no gains, then return 0.
    if (flatGain === 0 && calculatedPercentGain === 0 && formulaGains === 0) return 0;

    // add all the gains together and apply REC.
    const gains = (flatGain + calculatedPercentGain + formulaGains) * battler.rec;

    // return the total gains.
    return gains;
  }

  /**
   * Calculate the amount of TP gained from a skill.
   * @param {Game_Actor|Game_Enemy} battler The battler to gain tp.
   * @param {RPG_Skill} skill The skill to gain tp from.
   * @returns {number}
   */
  static skillGainTp(battler, skill)
  {
    // identify the true form of the skill.
    const battlerSkill = battler.skill(skill.id);

    // extract the gains from the skill's note.
    const flatGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.TpGainFlat);
    const percentGain = RPGManager.getNumberFromNoteByRegex(battlerSkill, J.RESOURCES.RegExp.TpGainPercent);
    const calculatedPercentGain = battler.mtp * (percentGain / 100);
    const formulaGains = RPGManager.getResultFromNoteByRegex(
      battlerSkill,
      J.RESOURCES.RegExp.TpGainFormula,
      (flatGain + calculatedPercentGain),
      battler
    );

    // if there are no gains, then return 0.
    if (flatGain === 0 && calculatedPercentGain === 0 && formulaGains === 0) return 0;

    // add all the gains together and apply REC.
    const gains = (flatGain + calculatedPercentGain + formulaGains) * battler.rec;

    // return the total gains.
    return gains;
  }
}

//endregion ResourceCostManager

//region TextManager
/**
 * Gets the name of the HP skill cost parameter.
 * Mirrors {@link TextManager.sparam} entries for MCR ("Magi Cost") and TCR ("Tech Cost").
 * @returns {string}
 */
TextManager.hpCost = function()
{
  return 'Life Cost';
};

/**
 * Extends {@link TextManager.longParam}.<br/>
 * Adds longParam ID 34 for the HP cost label.
 * J-Resources registers ID 34 for this purpose.
 * @param {number} paramId The long parameter id.
 * @returns {string}
 */
J.RESOURCES.Aliased.TextManager.set('longParam', TextManager.longParam);
TextManager.longParam = function(paramId)
{
  // handle the hp cost longParam id.
  if (paramId === 34)
  {
    return this.hpCost();
  }

  // perform original logic.
  return J.RESOURCES.Aliased.TextManager.get('longParam')
    .call(this, paramId);
};
//endregion TextManager


//region Game_Actor
/**
 * Gets all sources that contribute to the hp cost reduction.
 * @returns {[RPG_Actor, RPG_Class, RPG_EquipItem[], RPG_State[]]}
 */
Game_Actor.prototype.hcrSources = function()
{
  return [
    this.databaseData(),
    this.currentClass(),
    ...this.equippedEquips(),
    ...this.allStates(),
  ];
};
//endregion Game_Actor

//region Game_Battler
/**
 * Extends {@link #initMembers}.<br/>
 * Also initializes the resources members.
 */
J.RESOURCES.Aliased.Game_Battler.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.RESOURCES.Aliased.Game_Battler.get('initMembers')
    .call(this);

  // also init our resources members.
  this.initResourcesMembers();
};

/**
 * Initializes the resources members.
 */
Game_Battler.prototype.initResourcesMembers = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with resources.
   */
  this._j._resources ||= {};

  /**
   * The hp cost reduction for this battler.
   * @type {number}
   */
  this._j._hcr = 100;
};

/**
 * Gets the hp cost reduction for this battler.
 * @returns {number}
 */
Game_Battler.prototype.hcr = function()
{
  return this._j._hcr;
};

/**
 * Gets the hp cost reduction factor for this battler.
 * This is the normalized fractional amount used in the math for hp cost reduction.
 */
Game_Battler.prototype.hcrFactor = function()
{
  const hrcFactor = this._j._hcr / 100;
  return hrcFactor;
};

/**
 * Sets the hp cost reduction for this battler.
 * @param {number} value The new hp cost reduction.
 */
Game_Battler.prototype.setHcr = function(value)
{
  this._j._hcr = value;
};

/**
 * Extends {@link #onBattlerDataChange}.<br/>
 * Also refreshes the hp cost reduction for this battler.
 */
J.RESOURCES.Aliased.Game_Battler.set('onBattlerDataChange', Game_Battler.prototype.onBattlerDataChange);
Game_Battler.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.NATURAL.Aliased.Game_Battler.get('onBattlerDataChange')
    .call(this);

  // also refresh the hrc.
  this.refreshHcr();
};

/**
 * Refreshes the hp cost reduction for this battler.
 */
Game_Battler.prototype.refreshHcr = function()
{
  // grab all the sources for hcr.
  const sources = this.hcrSources();

  // starting from 100, subtract the hcr from each source.
  const hcr = sources.reduce((acc, source) => acc - source.hcr(), 100);

  // ensure the hcr is never negative.
  const normalizedHcr = Math.max(0, hcr);

  // set the new hcr value.
  this.setHcr(normalizedHcr);
};

/**
 * Gets all sources that contribute to the hp cost reduction.
 * @returns {[(RPG_Actor|RPG_Enemy), RPG_Class, RPG_EquipItem[], RPG_State[]]}
 */
Game_Battler.prototype.hcrSources = function()
{
  return [];
};

/**
 * Extends {@link Game_Battler.prototype.canPaySkillCost}.
 * Now includes HP cost eligibility.
 * @param {RPG_Skill} skill The skill to check.
 * @returns {boolean}
 */
J.RESOURCES.Aliased.Game_BattlerBase.set('canPaySkillCost', Game_BattlerBase.prototype.canPaySkillCost);
Game_Battler.prototype.canPaySkillCost = function(skill)
{
  // Check base costs MP/TP first.
  if (J.RESOURCES.Aliased.Game_BattlerBase.get('canPaySkillCost')
    .call(this, skill) === false)
  {
    return false;
  }

  // Check HP cost (default: forbid lethal unless tag allows).
  const hpCost = this.skillHpCost(skill);
  if (hpCost > 0)
  {
    // Allow sacrifice via notetag.
    const allowSacrifice = RPGManager.checkForBooleanFromNoteByRegex(skill, J.RESOURCES.RegExp.HpCostLethal);
    if (allowSacrifice)
    {
      // Can drop to 0 or below.
      return true;
    }
    else
    {
      // Must stay above 1 HP.
      return this.hp > hpCost;
    }
  }

  return true;
};

/**
 * Extends {@link Game_Battler.prototype.paySkillCost}.
 * Now deducts HP, MP, TP, and any gains.
 * @param {RPG_Skill} skill The skill being paid for.
 */
J.RESOURCES.Aliased.Game_BattlerBase.set('paySkillCost', Game_BattlerBase.prototype.paySkillCost);
Game_Battler.prototype.paySkillCost = function(skill)
{
  // Pay vanilla MP/TP first.
  J.RESOURCES.Aliased.Game_BattlerBase.get('paySkillCost')
    .call(this, skill);

  // pay the HP cost.
  const hpCost = this.skillHpCost(skill);
  this.paySkillHpCost(hpCost);

  // apply any gains from the skill.
  const hpGain = ResourceCostManager.skillGainHp(this, skill);
  const mpGain = ResourceCostManager.skillGainMp(this, skill);
  const tpGain = ResourceCostManager.skillGainTp(this, skill);
  this.gainHpFromResource(hpGain);
  this.gainMpFromResource(mpGain);
  this.gainTpFromResource(tpGain);
};

/**
 * Pays the hp cost for a skill.
 * @param {number} amount The amount of hp to pay.
 */
Game_Battler.prototype.paySkillHpCost = function(amount)
{
  // pay the HP cost.
  this.gainHp(-amount);
};

/**
 * Gains the given amount of HP from the skill.
 * @param {number} amount The amount of HP to gain.
 */
Game_Battler.prototype.gainHpFromResource = function(amount)
{
  this.gainHp(amount);
};

/**
 * Gains the given amount of MP from the skill.
 * @param {number} amount The amount of MP to gain.
 */
Game_Battler.prototype.gainMpFromResource = function(amount)
{
  this.gainMp(amount);
};

/**
 * Gains the given amount of TP from the skill.
 * @param {number} amount The amount of TP to gain.
 */
Game_Battler.prototype.gainTpFromResource = function(amount)
{
  this.gainTp(amount);
};
//endregion Game_Battler

//region Game_BattlerBase
//region hcr
/**
 * Gets the hp cost reduction for this battler.
 */
Object.defineProperty(Game_BattlerBase.prototype, 'hcr', {
  get: function()
  {
    return this.hcrFactor();
  },
  configurable: true
});

/**
 * Gets the hp cost reduction for this battler.
 * @returns {number}
 */
Game_BattlerBase.prototype.hcrFactor = function()
{
  return 1.0;
};
//endregion hcr

/**
 * Determines the hp cost of a skill.
 * @param {RPG_Skill} skill The skill being calculated.
 * @returns {number}
 */
Game_BattlerBase.prototype.skillHpCost = function(skill)
{
  return ResourceCostManager.hpCostBySkill(this, skill);
};

/**
 * Extends {@link Game_BattlerBase.prototype.skillMpCost}.<br/>
 * Includes extended MP costs from tags.
 * @param {RPG_Skill} skill The skill cost being calculated.
 * @returns {number}
 */
J.RESOURCES.Aliased.Game_BattlerBase.set('skillMpCost', Game_BattlerBase.prototype.skillMpCost);
Game_BattlerBase.prototype.skillMpCost = function(skill)
{
  // get base cost.
  const baseCost = J.RESOURCES.Aliased.Game_BattlerBase.get('skillMpCost')
    .call(this, skill);

  // add extended cost from tags via the manager.
  const extraCost = ResourceCostManager.extraMpCostBySkill(this, skill);

  // calculate the final cost.
  const cost = Math.max(0, (baseCost + extraCost));

  // return the cost.
  return cost;
};

/**
 * Extends {@link Game_BattlerBase.prototype.skillTpCost}.<br/>
 * Includes extended TP costs from tags.
 * @param {RPG_Skill} skill The skill cost being calculated.
 * @returns {number}
 */
J.RESOURCES.Aliased.Game_BattlerBase.set('skillTpCost', Game_BattlerBase.prototype.skillTpCost);
Game_BattlerBase.prototype.skillTpCost = function(skill)
{
  // get base cost.
  const baseCost = J.RESOURCES.Aliased.Game_BattlerBase.get('skillTpCost')
    .call(this, skill);

  // add extended cost from tags via the manager.
  const extraCost = ResourceCostManager.extraTpCostBySkill(this, skill);

  // calculate the final cost.
  const cost = Math.max(0, (baseCost + extraCost));

  // return the cost.
  return cost;
};


//endregion Game_BattlerBase

//region Game_Enemy
/**
 * Gets all sources that contribute to the hp cost reduction.
 * @returns {[RPG_Enemy, RPG_State[]]}
 */
Game_Enemy.prototype.hcrSources = function()
{
  return [
    this.databaseData(),
    ...this.allStates(),
  ];
};
//endregion Game_Enemy

//# sourceMappingURL=J-Resources.js.map
