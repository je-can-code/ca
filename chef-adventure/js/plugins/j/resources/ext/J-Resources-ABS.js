//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 RESOURCES-ABS] Damage-linked HP, MP, and TP resource effects.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Resources
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-Resources
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Resources, enabling resource mutations that
 * trigger during combat rather than at the moment a skill is cast.
 *
 * Integrates with others of mine plugins:
 * - J-Popups-Resources; on-attack and when-hit gains emit popups automatically.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Two new families of notetags are provided by this plugin:
 *
 *   ON-ATTACK tags live on skills. Every time that skill lands a hit on-map,
 *   the caster is granted some amount of HP, MP, or TP.
 *
 *   WHEN-HIT tags live on actors, classes, equips, or states. Every time that
 *   battler takes HP damage on-map, gains from all tagged sources are summed
 *   and applied to them.
 *
 * ============================================================================
 * ON-ATTACK GAINS
 * Have you ever wanted a skill that siphons a little bit of HP each time it
 * connects, or a technique that refunds TP on every successful hit? Well now
 * you can! By applying the appropriate tag(s) to a skill, the caster will
 * receive HP, MP, or TP every time that skill lands.
 *
 * NOTE:
 * Gains are scaled by the caster's REC stat.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT (flat):
 *  <on-attack-hp-gain:FLAT>
 *  <on-attack-mp-gain:FLAT>
 *  <on-attack-tp-gain:FLAT>
 *    Where FLAT is a fixed amount to restore on each hit.
 *
 * TAG FORMAT (percentage):
 *  <on-attack-hp-gain:PERCENT%>
 *  <on-attack-mp-gain:PERCENT%>
 *  <on-attack-tp-gain:PERCENT%>
 *    Where PERCENT is a percentage of the caster's maximum for that resource.
 *
 * TAG FORMAT (formula):
 *  <on-attack-hp-gain:[FORMULA]>
 *  <on-attack-mp-gain:[FORMULA]>
 *  <on-attack-tp-gain:[FORMULA]>
 *    Where FORMULA is an eval'd expression.
 *    `a` = the caster battler.
 *    `b` = flat + calculated-percent (the accumulated base before formula).
 *
 * TAG EXAMPLES:
 *  <on-attack-hp-gain:20>
 *    Restores 20 HP to the caster each time this skill lands.
 *
 *  <on-attack-mp-gain:5%>
 *    Restores 5% of the caster's max MP each time this skill lands.
 *
 *  <on-attack-tp-gain:[a.level / 10]>
 *    Restores TP equal to one-tenth the caster's level per hit.
 *
 * ============================================================================
 * WHEN-HIT GAINS
 * Have you ever wanted a battler that builds rage the more they get beaten
 * around, or an accessory that slowly replenishes MP for a stalwart defender?
 * Well now you can! By applying the appropriate tag(s) to the database object
 * in question, that battler will receive HP, MP, or TP each time they take HP
 * damage. All tagged sources are summed together automatically.
 *
 * NOTE:
 * Gains are scaled by the target's REC stat.
 *
 * NOTE:
 * In formula tags, `b` is the raw HP damage dealt rather than the accumulated
 * base value- this lets you write damage-proportional expressions like `b * 0.05`.
 *
 * TAG USAGE:
 * - Actors
 * - Enemies
 * - Classes
 * - Equips (weapons, armors)
 * - States
 *
 * TAG FORMAT (flat):
 *  <when-hit-hp-gain:FLAT>
 *  <when-hit-mp-gain:FLAT>
 *  <when-hit-tp-gain:FLAT>
 *
 * TAG FORMAT (percentage):
 *  <when-hit-hp-gain:PERCENT%>
 *  <when-hit-mp-gain:PERCENT%>
 *  <when-hit-tp-gain:PERCENT%>
 *    Where PERCENT is a percentage of the target's maximum for that resource.
 *
 * TAG FORMAT (formula):
 *  <when-hit-hp-gain:[FORMULA]>
 *  <when-hit-mp-gain:[FORMULA]>
 *  <when-hit-tp-gain:[FORMULA]>
 *    Where FORMULA is an eval'd expression.
 *    `a` = the target battler.
 *    `b` = the raw HP damage dealt by the hit.
 *
 * TAG EXAMPLES:
 *  <when-hit-tp-gain:5>
 *    Gain 5 TP each time this battler takes HP damage (great for a "Rage" state).
 *
 *  <when-hit-mp-gain:2%>
 *    Recover 2% of max MP each time this battler takes HP damage.
 *
 *  <when-hit-tp-gain:[b * 0.05]>
 *    Gain TP equal to 5% of the damage taken- scales with how hard the hit was.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 *    Added on-attack HP/MP/TP gains via flat, percent, and formula skill tags.
 *    Added when-hit HP/MP/TP gains aggregated across all traited sources.
 * ============================================================================
 */
//endregion annotations


//region plugin metadata
class JResourcesAbs_PluginMetadata
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
  }
}

//endregion plugin metadata


//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
J.RESOURCES.EXT.ABS = {};

/**
 * The metadata associated with this plugin.
 */
J.RESOURCES.EXT.ABS.Metadata = new JResourcesAbs_PluginMetadata('J-Resources-ABS', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.RESOURCES.EXT.ABS.Aliased = {};
J.RESOURCES.EXT.ABS.Aliased.JABS_Engine = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.RESOURCES.EXT.ABS.RegExp = {};

// on-attack tags (on the skill — fires for the caster on a successful hit).
J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFlat    = /<on-attack-hp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainPercent = /<on-attack-hp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFormula = /<on-attack-hp-gain:\[([+\-*/ ().\w]+)]>/gi;

J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFlat    = /<on-attack-mp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainPercent = /<on-attack-mp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFormula = /<on-attack-mp-gain:\[([+\-*/ ().\w]+)]>/gi;

J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFlat    = /<on-attack-tp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainPercent = /<on-attack-tp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFormula = /<on-attack-tp-gain:\[([+\-*/ ().\w]+)]>/gi;

// when-hit tags (on actor/class/equip/state — fires for the target when taking damage).
J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainFlat    = /<when-hit-hp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainPercent = /<when-hit-hp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainFormula = /<when-hit-hp-gain:\[([+\-*/ ().\w]+)]>/gi;

J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainFlat    = /<when-hit-mp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainPercent = /<when-hit-mp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainFormula = /<when-hit-mp-gain:\[([+\-*/ ().\w]+)]>/gi;

J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainFlat    = /<when-hit-tp-gain:(\d+)>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainPercent = /<when-hit-tp-gain:(\d+)%>/gi;
J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainFormula = /<when-hit-tp-gain:\[([+\-*/ ().\w]+)]>/gi;

//endregion initialization


//region JABS_Engine
/**
 * Extends {@link #postPrimaryBattleEffects}.<br/>
 * Also applies on-attack resource gains to the caster and when-hit resource
 * gains to the target, provided the action landed a damaging hit.
 */
J.RESOURCES.EXT.ABS.Aliased.JABS_Engine.set('postPrimaryBattleEffects', JABS_Engine.prototype.postPrimaryBattleEffects);
JABS_Engine.prototype.postPrimaryBattleEffects = function(action, target)
{
  // perform original logic.
  J.RESOURCES.EXT.ABS.Aliased.JABS_Engine.get('postPrimaryBattleEffects')
    .call(this, action, target);

  const result = target.getBattler()
    .result();

  // only resource effects that require landing a hit should proceed.
  if (result.isHit() === false) return;

  // apply resource gains to the caster from on-attack skill tags.
  ResourceHitManager.applyOnAttackEffects(action, target);

  // when-hit effects are only meaningful when real damage was dealt.
  if (result.hpDamage <= 0) return;

  // apply resource gains to the target from when-hit source tags.
  ResourceHitManager.applyWhenHitEffects(action, target);
};
//endregion JABS_Engine

//region ResourceHitManager
/**
 * Manages damage-linked resource mutations for J-Resources-ABS.
 *
 * On-attack effects read tags from the skill and apply gains to the caster.
 * When-hit effects aggregate tags from the target's traited sources and apply
 * gains to the target. Negative net totals are clamped by the engine's own
 * gainHp/Mp/Tp calls.
 */
class ResourceHitManager
{
  /**
   * Applies all on-attack resource gains to the caster.
   * Called after a successful hit has been confirmed.
   * @param {JABS_Action} action The action that landed.
   * @param {JABS_Battler} target The battler that was hit.
   */
  static applyOnAttackEffects(action, target)
  {
    const caster = action.getCaster()
      .getBattler();
    const skill = action.getBaseSkill();

    const hpGain = ResourceHitManager.onAttackHpGain(caster, skill);
    const mpGain = ResourceHitManager.onAttackMpGain(caster, skill);
    const tpGain = ResourceHitManager.onAttackTpGain(caster, skill);

    if (hpGain !== 0) caster.gainHpFromResource(hpGain);
    if (mpGain !== 0) caster.gainMpFromResource(mpGain);
    if (tpGain !== 0) caster.gainTpFromResource(tpGain);
  }

  /**
   * Applies all when-hit resource gains to the target.
   * Called after a damaging hit has been confirmed (hpDamage > 0).
   * @param {JABS_Action} action The action that landed.
   * @param {JABS_Battler} target The battler that was hit.
   */
  static applyWhenHitEffects(action, target)
  {
    const targetBattler = target.getBattler();
    const damage = targetBattler.result().hpDamage;

    const hpGain = ResourceHitManager.whenHitHpGain(targetBattler, damage);
    const mpGain = ResourceHitManager.whenHitMpGain(targetBattler, damage);
    const tpGain = ResourceHitManager.whenHitTpGain(targetBattler, damage);

    if (hpGain !== 0) targetBattler.gainHpFromResource(hpGain);
    if (mpGain !== 0) targetBattler.gainMpFromResource(mpGain);
    if (tpGain !== 0) targetBattler.gainTpFromResource(tpGain);
  }

  //region on-attack
  /**
   * Calculates the HP gain for the caster from a skill's on-attack tags.
   * @param {Game_Actor|Game_Enemy} caster The caster of the skill.
   * @param {RPG_Skill} skill The skill that landed the hit.
   * @returns {number}
   */
  static onAttackHpGain(caster, skill)
  {
    return ResourceHitManager.#gainBySkill(
      caster, skill,
      J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFlat,
      J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainPercent,
      J.RESOURCES.EXT.ABS.RegExp.OnAttackHpGainFormula,
      caster.mhp
    );
  }

  /**
   * Calculates the MP gain for the caster from a skill's on-attack tags.
   * @param {Game_Actor|Game_Enemy} caster The caster of the skill.
   * @param {RPG_Skill} skill The skill that landed the hit.
   * @returns {number}
   */
  static onAttackMpGain(caster, skill)
  {
    return ResourceHitManager.#gainBySkill(
      caster, skill,
      J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFlat,
      J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainPercent,
      J.RESOURCES.EXT.ABS.RegExp.OnAttackMpGainFormula,
      caster.mmp
    );
  }

  /**
   * Calculates the TP gain for the caster from a skill's on-attack tags.
   * @param {Game_Actor|Game_Enemy} caster The caster of the skill.
   * @param {RPG_Skill} skill The skill that landed the hit.
   * @returns {number}
   */
  static onAttackTpGain(caster, skill)
  {
    return ResourceHitManager.#gainBySkill(
      caster, skill,
      J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFlat,
      J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainPercent,
      J.RESOURCES.EXT.ABS.RegExp.OnAttackTpGainFormula,
      caster.mtp
    );
  }

  //endregion on-attack

  //region when-hit
  /**
   * Aggregates the HP gain for the target from all traited sources' when-hit tags.
   * @param {Game_Actor|Game_Enemy} targetBattler The battler that was hit.
   * @param {number} damage The raw HP damage dealt (used as `b` in formulas).
   * @returns {number}
   */
  static whenHitHpGain(targetBattler, damage)
  {
    return ResourceHitManager.#gainBySources(
      targetBattler,
      J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainFlat,
      J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainPercent,
      J.RESOURCES.EXT.ABS.RegExp.WhenHitHpGainFormula,
      targetBattler.mhp,
      damage
    );
  }

  /**
   * Aggregates the MP gain for the target from all traited sources' when-hit tags.
   * @param {Game_Actor|Game_Enemy} targetBattler The battler that was hit.
   * @param {number} damage The raw HP damage dealt (used as `b` in formulas).
   * @returns {number}
   */
  static whenHitMpGain(targetBattler, damage)
  {
    return ResourceHitManager.#gainBySources(
      targetBattler,
      J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainFlat,
      J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainPercent,
      J.RESOURCES.EXT.ABS.RegExp.WhenHitMpGainFormula,
      targetBattler.mmp,
      damage
    );
  }

  /**
   * Aggregates the TP gain for the target from all traited sources' when-hit tags.
   * @param {Game_Actor|Game_Enemy} targetBattler The battler that was hit.
   * @param {number} damage The raw HP damage dealt (used as `b` in formulas).
   * @returns {number}
   */
  static whenHitTpGain(targetBattler, damage)
  {
    return ResourceHitManager.#gainBySources(
      targetBattler,
      J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainFlat,
      J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainPercent,
      J.RESOURCES.EXT.ABS.RegExp.WhenHitTpGainFormula,
      targetBattler.mtp,
      damage
    );
  }

  //endregion when-hit

  //region private helpers
  /**
   * Calculates a resource gain from tags on a single skill (on-attack path).
   * The formula receives `a` = caster and `b` = (flat + calculatedPercent).
   * REC is applied to the total before returning.
   * @param {Game_Actor|Game_Enemy} caster
   * @param {RPG_Skill} skill
   * @param {RegExp} flatRegex
   * @param {RegExp} percentRegex
   * @param {RegExp} formulaRegex
   * @param {number} maxStat The battler's maximum for the relevant resource (mhp/mmp/mtp).
   * @returns {number}
   */
  static #gainBySkill(caster, skill, flatRegex, percentRegex, formulaRegex, maxStat)
  {
    const flat = RPGManager.getNumberFromNoteByRegex(skill, flatRegex);
    const percent = RPGManager.getNumberFromNoteByRegex(skill, percentRegex);
    const calculatedPercent = maxStat * (percent / 100);
    const formula = RPGManager.getResultFromNoteByRegex(
      skill, formulaRegex, (flat + calculatedPercent), caster
    );

    const total = flat + calculatedPercent + formula;
    if (total === 0) return 0;

    return total * caster.rec;
  }

  /**
   * Aggregates a resource gain across all of the target's traited sources (when-hit path).
   * Sources are the same set used for HCR (actor/class/equip/states for actors,
   * enemy data/states for enemies).
   * The formula receives `a` = targetBattler and `b` = damage dealt.
   * REC is applied to the total before returning.
   * @param {Game_Actor|Game_Enemy} targetBattler
   * @param {RegExp} flatRegex
   * @param {RegExp} percentRegex
   * @param {RegExp} formulaRegex
   * @param {number} maxStat The battler's maximum for the relevant resource (mhp/mmp/mtp).
   * @param {number} damage The raw HP damage from the action result.
   * @returns {number}
   */
  static #gainBySources(targetBattler, flatRegex, percentRegex, formulaRegex, maxStat, damage)
  {
    const sources = targetBattler.hcrSources();

    const totalFlat = sources.reduce((acc, source) =>
      acc + RPGManager.getNumberFromNoteByRegex(source, flatRegex), 0);

    const totalPercent = sources.reduce((acc, source) =>
      acc + RPGManager.getNumberFromNoteByRegex(source, percentRegex), 0);
    const calculatedPercent = maxStat * (totalPercent / 100);

    // damage is passed as `b` so formula authors can write e.g. `b * 0.1` for 10% of damage.
    const totalFormula = sources.reduce((acc, source) =>
      acc + RPGManager.getResultFromNoteByRegex(source, formulaRegex, damage, targetBattler), 0);

    const total = totalFlat + calculatedPercent + totalFormula;
    if (total === 0) return 0;

    return total * targetBattler.rec;
  }

  //endregion private helpers
}

//endregion ResourceHitManager

//# sourceMappingURL=J-Resources-ABS.js.map
