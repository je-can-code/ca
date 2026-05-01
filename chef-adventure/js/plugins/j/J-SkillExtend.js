//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 EXTEND] Extends the capabilities of skills/actions.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * ============================================================================
 * This plugin extends the functionality of skills. It features additional
 * functionality that allow you to leverage new strategies in skill learning
 * and game development.
 *
 * DETAILS:
 * The new functionalities available are as follows:
 * - Skills extending skills.
 * - On-hit self-state application.
 * - On-cast self-state application.
 * ============================================================================
 * SKILL EXTENSION:
 * Have you ever wanted to have a single skill gain additional effects by
 * learning other skills? Well now you can! By applying the appropriate tag to
 * the skill(s) in question, you too can have skills that can progressively
 * gain additional upgrades/capabilities as a battler learns more skills!
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <skillExtend:[NUM]>
 *  <skillExtend:[NUM,NUM,...]>
 * Where NUM is the skill id to extend.
 *
 * TAG EXAMPLES:
 *  <skillExtend:[40]>
 * This skill will act as an extension to skill of id 40.
 *
 *  <skillExtend:[7,8,9,10,11]>
 * This skill will act as an extension to all skills of id 7, 8, 9, 10, and 11.
 * ============================================================================
 * WHAT DOES "ACT AS AN EXTENSION" MEAN?
 * ============================================================================
 * This section of information is so important that it gets its own headline!
 *
 * Lets pretend that in our fictional example, skill id 40 maps to "Fireball".
 * We want to extend our "Fireball" skill in some way by using this skill's
 * data points. What might that look like? It can manifest in a variety of
 * ways, but with this plugin, we use extension skills as OVERRIDES or AUGMENTS
 * to the base skill. Thusly, if this skill were some kind of upgrade, you
 * could fill in the damage formula to maybe have higher multipliers, and
 * add some extra repeats (offset of +1). The changes in the skill will overlay
 * the base skill's parameters and apply BEFORE the skill's execution. You
 * can see below for a comprehensive list of what happens to the base skill
 * based on an extension skill.
 *
 * NOTE:
 * Effects are only added or updated. Tags cannot be removed by this plugin
 * with the single exception of the extend tag.
 *
 * Comprehensive breakdown of how things are overridden:
 *  If a damage type is checked:
 *    - yes/no critical option is replaced.
 *    - base element id is replaced.
 *    - allowed upgrade of "hp damage" >> "hp drain" (but not cross or reverse)
 *    - allowed upgrade of "mp damage" >> "mp drain" (but not cross or reverse)
 *    - damage variance is replaced.
 *    - the formula itself is replaced if it is not completely empty.
 *  Other sections include:
 *    - the "effects" section of the skill just adds right into the base skill.
 *    - the two "meta" objects are merged with the extension skill's priority.
 *    - the extension skill's "note" object is appended onto the base skill's.
 *    - the repeats are added onto the base (offset of +1).
 *    - the speed is added onto the base.
 *    - the success is added onto the base (only if not same or equal to 100).
 *    - the scope is replaced.
 *    - the mp cost is replaced.
 *    - the tp cost is replaced.
 *    - the tp gain is added onto the base.
 *    - if the hit type section is not "certain hit", then it replaces.
 *    - both message lines are replaced.
 *  Base data things of note:
 *    - the "occasion" is not changeable.
 *    - though "note" objects are appended, the tag for extension is removed
 *      to prevent recursive behaviors in skill extension. This removal is
 *      only for this execution of the skill for overlay purposes only.
 *    - the editor's speed cap of +/-2000 is not respected!
 *    - the editor's success cap of 0-100 is not respected!
 *  When it comes to the note section:
 *    - all tags by default will be overridden where the key matches.
 *    - you can avoid override behavior by configuring duplicate keys.
 *
 * If using this plugin with JABS...
 *
 * Note about adding move-related tags:
 *  The effects of adding the "moveType" tag onto a skill that didn't
 *  previously have it are completely untested, use at your own risk!
 * Note about adding guard-related tags:
 *  The effects of adding the "counterGuard/counterParry" tags onto a skill
 *  that didn't previously have it are untested, though shouldn't cause any
 *  problems if they are added onto a skill with "guard & parry".
 * Note about combo-related tags:
 *  The effects of adding the "combo/actionId/direct" tags onto any skills is
 *  something to be careful about, as they very significantly change how
 *  the manager interacts with the actions. Replacing any of those values
 *  though should be totally fine if they already existed on the base skill.
 *
 * With that in mind, it is strongly recommended that you copy-paste the base
 * skill into the extension skill slot in your RMMZ editor database skill tab
 * to start your extension (or another skill extension of the same skill
 * perhaps)!
 * ============================================================================
 * SELF-STATE APPLICATION:
 * Have you ever wanted a battler to be able to inflict themselves with a state
 * upon execution of a skill? Well now you can! By applying the appropriate tag
 * to the skill(s) in question, you too can have battlers that are applying
 * states of any kind to themselves!
 *
 * NOTE 1:
 * State resistance is not taken into account in regards to the CHANCE of the
 * various self-state effects. It is assumed that the percent chance designated
 * in the tag is fully representative of the chance that the state will be
 * applied to the caster.
 *
 * NOTE 2:
 * In addition to JABS multiple projectiles triggering the on-hit effect
 * multiple times, having a skill "repeat", or in JABS have multiple hits on
 * the skill, will both result in triggering the on-hit effect multiple times.
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <onCastSelfState:[STATE_ID,CHANCE]>
 *  <onHitSelfState:[STATE_ID,CHANCE]>
 * Where STATE_ID is the id of the state to apply.
 * Where CHANCE is the percent chance between 0 and 100 that it'll apply.
 *
 * TAG EXAMPLES:
 *  <onCastSelfState:[3,40]>
 * The caster has a 40% chance of applying state w/ id of 3 to oneself.
 * When using JABS, this applies as soon as the skill/action is executed.
 * When using non-JABS, this applies in the same phase as you would gain TP
 * from executing a skill.
 *
 *  <onHitSelfState:[19,100]>
 * The caster has a 100% (always) chance of appling state id 19 to oneself.
 * This processes as soon as the skill is "applied" to the target.
 * When using JABS, this applies as soon as the skill/action connects with
 * a target of any kind. This will trigger multiple times if an action has
 * multiple projectiles.
 * When using non-JABS, this applies when a skill is being executed against a
 * target. This happens regardless the outcome of the skill.
 * ============================================================================
 * CHANGELOG:
 * - 1.2.1
 *    Fixed extendEffects to deduplicate addState effects by state ID when merging overlays.
 *    When an extension defines a state application, any prior entry for that state ID is
 *    replaced rather than concatenated — last extension wins per state. Multiple entries for
 *    the same state within a single extension are preserved for intentional stack effects.
 * - 1.2.0
 *    Implement caching for skill extensions by caster.
 *    Consume `RPGManager` updates.
 * - 1.1.0
 *    Rewrite tag override functionality to replace excluding specified keys.
 * - 1.0.1
 *    Fixed reference error when attempting to extend skills w/ on-hit effects.
 *    Retroactively added this CHANGELOG.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//region Metadata
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '3.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.EXTEND = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.EXTEND.Metadata = {};

/**
 * The name of this plugin.
 */
J.EXTEND.Metadata.Name = `J-SkillExtend`;

/**
 * The version of this plugin.
 */
J.EXTEND.Metadata.Version = '1.2.1';

/**
 * A collection of all aliased methods for this plugin.
 */
J.EXTEND.Aliased = {};
J.EXTEND.Aliased.DataManager = new Map();
J.EXTEND.Aliased.Game_Action = new Map();
J.EXTEND.Aliased.Game_Actor = new Map();
J.EXTEND.Aliased.Game_Enemy = new Map();
J.EXTEND.Aliased.Game_Item = new Map();
J.EXTEND.Aliased.Game_Item = new Map();
J.EXTEND.Aliased.JABS_SkillSlotManager = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.EXTEND.RegExp = {};
J.EXTEND.RegExp.SkillExtend = /<skillExtend:[ ]?(\[[ ]?\d+(?:,[ ]?\d+)*[ ]?])>/i;
J.EXTEND.RegExp.OnHitSelfState = /<onHitSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
J.EXTEND.RegExp.OnCastSelfState = /<onCastSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
//endregion Metadata

//region RPG_Skill
/**
 * Determines whether or not there are any skill extensions on this skill.
 */
Object.defineProperty(RPG_Skill.prototype, "isSkillExtension", {
  get: function()
  {
    return !!RPGManager.getArrayFromNotesByRegex(this, J.EXTEND.RegExp.SkillExtend, true, true);
  },
});

/**
 * Gets all skill extensions for this skill- if any.
 * Will return an empty array if none are present.
 */
Object.defineProperty(RPG_Skill.prototype, "getSkillExtensions", {
  get: function()
  {
    return RPGManager.getArrayFromNotesByRegex(this, J.EXTEND.RegExp.SkillExtend, true);
  },
});
//endregion RPG_Skill

//region DataManager
/**
 * Extends {@link #setupNewGame}.<br/>
 * Also clears the RPGManager note cache for a fresh session.
 */
J.EXTEND.Aliased.DataManager.set('setupNewGame', DataManager.setupNewGame);
DataManager.setupNewGame = function()
{
  // clear any previously cached skill extensions before creating a new game.
  OverlayManager.clearCache();

  // perform original logic.
  J.EXTEND.Aliased.DataManager.get('setupNewGame')
    .call(this);
};

/**
 * Extends {@link #extractSaveContents}.<br/>
 * Also clears the RPGManager note cache before applying save data.
 */
J.EXTEND.Aliased.DataManager.set('extractSaveContents', DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
  // clear any previously cached skill extensions before applying the save contents.
  OverlayManager.clearCache();

  // perform original logic.
  J.EXTEND.Aliased.DataManager.get('extractSaveContents')
    .call(this, contents);
};

/**
 * Extends {@link #setupBattleTest}.<br/>
 * Also clears the RPGManager note cache when entering battle test.
 */
J.EXTEND.Aliased.DataManager.set('setupBattleTest', DataManager.setupBattleTest);
DataManager.setupBattleTest = function()
{
  // clear cache to ensure battle test uses fresh extensions.
  OverlayManager.clearCache();

  // perform original logic.
  J.EXTEND.Aliased.DataManager.get('setupBattleTest')
    .call(this);
};
//endregion DataManager

//region JABS_SkillSlotManager
J.EXTEND.Aliased.JABS_SkillSlotManager.set('filterActionSkills', JABS_SkillSlotManager.prototype.filterActionSkills);
/**
 * Extends {@link #filterActionSkills}.<br/>
 * Also filters out skill extensions.
 * @param {Game_Enemy} enemy The enemy to check.
 * @param {RPG_EnemyAction} action The action to check.
 */
JABS_SkillSlotManager.prototype.filterActionSkills = function(enemy, action)
{
  // perform original logic.
  const originalLogic = J.EXTEND.Aliased.JABS_SkillSlotManager.get('filterActionSkills')
    .call(this, enemy, action);

  // if the original logic returns false, then don't continue.
  if (originalLogic === false) return false;

  // grab the skill from the database.
  const skill = enemy.skill(action.skillId);

  // filter out the extend skills.
  return skill.isSkillExtension === false;
};
//endregion JABS_SkillSlotManager

//region OverlayManager
/**
 * A static class for managing the overlaying of one skill onto another.
 * The methods are divided by the attribute they overlay.
 */
class OverlayManager
{
  /**
   * The line types available for overlaying in the context of a note.
   */
  static LineType = {
    /**
     * A "key value pair" tag, such as <key:value>.
     */
    kvp: 'kvp',

    /**
     * A "boolean" tag, such as <key>.
     */
    boolean: 'boolean',

    /**
     * A tag that isn't supported by this framework at this time.
     * Any tag that is not one of the defined types will qualify as this and not get mutated.
     */
    unsupported: 'unsupported',
  };

  //region caching
  /**
   * A cache for caster-skill extensions.
   * This is effectively a map of maps, where the parent map is keyed by the caster, while the child map is keyed by
   * a combination of the skill id and its extension skill ids.
   * @type {WeakMap<Game_Actor|Game_Enemy, Map<string, RPG_Skill>>}
   */
  static _casterExtendCache = new WeakMap();

  /**
   * The metrics for this manager.
   * @type {{ hits: number, misses: number }}
   */
  static _metrics = {
    hits: 0,
    misses: 0,
  };

  /**
   * Invalidates the cache for the given battler.
   * @param {Game_Actor|Game_Enemy} battler The battler to invalidate the cache for.
   * @returns {boolean} True if the cache was invalidated, false otherwise.
   */
  static invalidate(battler)
  {
    return this._casterExtendCache.delete(battler);
  }

  /**
   * Clears the cache for all objects.
   */
  static clearCache()
  {
    this._casterExtendCache = new WeakMap();
  }

  /**
   * Gets the existing cache of a caster's skill extensions.
   * If a cache does not yet exist for the caster, it'll be created.
   * @param {Game_Actor|Game_Enemy} caster The caster of the skill.
   * @returns {Map<string, RPG_Skill>}
   */
  static getOrCreateCacheForCaster(caster)
  {
    // check if the cache for this caster already exists.
    const cacheHit = this._casterExtendCache.get(caster);

    // if it does exist, return it.
    if (cacheHit) return cacheHit;

    // it doesn't exist yet, so create it.
    const newCasterCache = new Map();
    this._casterExtendCache.set(caster, newCasterCache);

    // return the newly created cache.
    return newCasterCache;
  }

  /**
   * Retrieves a cached value for this caster/key, or computes and stores it.
   *
   * @param {Game_Actor|Game_Enemy} caster - The caster whose cache bucket to use.
   * @param {string} key - Stable key representing the computed value (ex: base skill id + overlay ids).
   * @param {Function} computeFn - A no-arg function that computes the value on a cache miss.
   * @returns {RPG_Skill} - The cached or newly computed extended skill.
   */
  static cached(caster, key, computeFn)
  {
    // get or create the per-caster cache map from the WeakMap.
    const perCaster = this.getOrCreateCacheForCaster(caster);

    // if we already have this key cached, return it and track a hit.
    if (perCaster.has(key))
    {
      // increment metrics for visibility while iterating on this.
      this._metrics.hits++;

      // return the cached value.
      return perCaster.get(key);
    }

    // we do not yet have a cached value; compute it now.
    const value = computeFn();

    // store the computed value in the per-caster cache.
    perCaster.set(key, value);

    // increment miss counter.
    this._metrics.misses++;

    // return the computed value.
    return value;
  }

  //endregion caching

  /**
   * Gets the extended skill based on the caster's learned skills.
   * @param caster {Game_Actor|Game_Enemy} The caster of the skill.
   * @param skillId {number} The base skill to extend.
   * @returns {RPG_Skill}
   */
  static getExtendedSkill(caster, skillId)
  {
    // validate the incoming base id.
    if (skillId <= 0) throw new Error('Invalid skill extension id.');

    // if we don't have a caster for some reason, don't process anything.
    if (!caster) return $dataSkills[skillId];

    // collect all overlay-capable skills for the provided base skill id.
    const overlaySkills = caster.skills()
      .filter(skill => this.#isOverlayForBase(skill, skillId));

    // sort overlays deterministically by their id to ensure stable and predictable results.
    if (overlaySkills.length > 0)
    {
      overlaySkills.sort((a, b) => a.id - b.id);
    }

    // construct a cache key that represents the base skill and the exact overlay set order.
    const overlayKey = `${skillId}|${overlaySkills.map(s => s.id)
      .join(',')}`;

    // fetch from cache or compute the extended skill once for this exact combination.
    return this.cached(
      caster,
      overlayKey,
      () => this.#getExtendedSkill(overlaySkills, skillId)
    );
  }

  /**
   * Checks if a given skill is an extension skill that can overlay the given base skill.
   * @param {RPG_Skill} skill The skill that potentially is the overlay.
   * @param {number} skillId The id of the base skill to check for overlay compatibility.
   * @returns {boolean} Whether or not the skill is an overlay for the base skill.
   */
  static #isOverlayForBase(skill, skillId)
  {
    // if this skill is not an extension skill, then it cannot overlay the base.
    if (skill.isSkillExtension === false) return false;

    // indicate whether or not this skill overlays the base.
    return skill.getSkillExtensions.includes(skillId);
  }

  /**
   * Extends the base skill with the given overlay skills in sequential order.
   * @param {RPG_Skill[]} overlaySkills - The skill overlays to apply.
   * @param {number} skillId - The id of the base skill to extend.
   * @returns {RPG_Skill} The extended skill.
   */
  static #getExtendedSkill(overlaySkills, skillId)
  {
    // if there are no overlays, return the original skill without incurring clone cost.
    if (overlaySkills.length === 0)
    {
      // return the base database skill untouched.
      return $dataSkills[skillId];
    }

    // clone the base skill so overlays can safely mutate the clone without affecting the database.
    const baseClone = $dataSkills[skillId]._clone();

    // apply all overlays in order to produce the final extended skill.
    const extended = overlaySkills
      .reduce((working, overlay) => this.extendSkill(working, overlay), baseClone);

    // return the final extended skill.
    return extended;
  }

  /**
   * Merges the skill overlay onto the base skill and returns the updated base skill.
   * @param baseSkill {RPG_Skill} The base skill to be overlayed.
   * @param skillOverlay {RPG_Skill} The skill to overlay with.
   * @returns {RPG_Skill} The base skill overlayed with the overlay skill.
   */
  static extendSkill(baseSkill, skillOverlay)
  {
    // merge all of the base skill data.
    const updatedBaseSkill = this.extendBaseSkill(baseSkill, skillOverlay);

    // sanitize the skill extends out of the base skill to prevent recursive extensions.
    this.sanitizeExtensions(updatedBaseSkill);

    // return the base skill merged with the overlay.
    return updatedBaseSkill;
  }

  //region extensions
  /**
   * Overlays the base skill data.
   *
   * Effects, meta, note, and repeats are combined.
   *
   * Scope, mpCost, tpCost, and tpGain are replaced.
   * @param baseSkill {RPG_Skill} The base skill.
   * @param skillOverlay {RPG_Skill} The overlay skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static extendBaseSkill(baseSkill, skillOverlay)
  {
    // extend all the sections of the skill with the skill overlay.
    this.extendGeneral(baseSkill, skillOverlay);
    this.extendDamage(baseSkill, skillOverlay);
    this.extendEffects(baseSkill, skillOverlay);
    this.extendInvocation(baseSkill, skillOverlay);
    this.extendMessage(baseSkill, skillOverlay);

    // extend the note and metadata with the skill overlay.
    this.extendMetadata(baseSkill, skillOverlay);

    // return the base skill extended by the overlay.
    return baseSkill;
  }

  /**
   * Extends the general settings section of a skill.
   * @param {RPG_Skill} baseSkill The skill being extended.
   * @param {RPG_Skill} skillOverlay The skill extending the base skill.
   */
  static extendGeneral(baseSkill, skillOverlay)
  {
    // overwrite mp costs if not the same.
    if (baseSkill.mpCost !== skillOverlay.mpCost)
    {
      baseSkill.mpCost = skillOverlay.mpCost;
    }

    // overwrite tp costs if not the same.
    if (baseSkill.tpCost !== skillOverlay.tpCost)
    {
      baseSkill.tpCost = skillOverlay.tpCost;
    }

    // overwrite scope if not "none" (0 = default) and not the same.
    const bothHaveScopes = baseSkill.scope !== 0 && skillOverlay.scope !== 0;
    const scopesHaveChanged = baseSkill.scope !== skillOverlay.scope;
    if (bothHaveScopes && scopesHaveChanged)
    {
      baseSkill.scope = skillOverlay.scope;
    }

    // NOTE: not overriding "occasion".
    // NOTE: not overriding "skill type".
  }

  /**
   * Extends the damage section of a skill.
   * @param {RPG_Skill} baseSkill The skill being extended.
   * @param {RPG_Skill} skillOverlay The skill extending the base skill.
   */
  static extendDamage(baseSkill, skillOverlay)
  {
    // if the overlay damage type isn't "none", then overlay those values.
    if (!skillOverlay.damage.type)
    {
      return;
    }

    if (baseSkill.damage.critical !== skillOverlay.damage.critical)
    {
      // overwrite the critical toggle.
      baseSkill.damage.critical = skillOverlay.damage.critical;
    }

    if (baseSkill.damage.elementId !== skillOverlay.damage.elementId)
    {
      baseSkill.damage.elementId = skillOverlay.damage.elementId;
    }

    if (baseSkill.damage.type !== skillOverlay.damage.type)
    {
      // allow upgrading hp-damage >> hp-drain.
      if (baseSkill.damage.type === 1 && skillOverlay.damage.type === 5)
      {
        baseSkill.damage.type = 5;
      }
      // allow upgrading mp-damage >> mp-drain.
      else if (baseSkill.damage.type === 2 && skillOverlay.damage.type === 6)
      {
        baseSkill.damage.type = 6;
      }

      // otherwise, overwrite damage type.
      // TODO: when stacking damage types, update here.
    }
    if (baseSkill.damage.variance !== skillOverlay.damage.variance)
    {
      baseSkill.damage.variance = skillOverlay.damage.variance;
    }

    if (skillOverlay.damage.formula && baseSkill.damage.formula !== skillOverlay.damage.formula)
    {
      // overwrite the formula.
      baseSkill.damage.formula = skillOverlay.damage.formula;
    }
  }

  /**
   * Extends the effects section of a skill.
   *
   * For add-state effects (code 21), the overlay wins per state id — "last extension wins."
   * If the overlay defines a chance for state X, any earlier add-state entries for state X
   * are stripped from the base before concatenation.  This prevents duplicate apply-state
   * rolls when a later extension upgrades a partial chance to a guaranteed application.
   *
   * All other effect types are concatenated as before.
   * @param {RPG_Skill} baseSkill The skill being extended.
   * @param {RPG_Skill} skillOverlay The skill extending the base skill.
   */
  static extendEffects(baseSkill, skillOverlay)
  {
    // nothing to merge if the overlay contributes no effects.
    if (skillOverlay.effects.length === 0) return;

    // collect the add-state effects the overlay is explicitly providing.
    const overlayAddStates = skillOverlay.effects
      .filter(e => e.code === Game_Action.EFFECT_ADD_STATE);

    if (overlayAddStates.length > 0)
    {
      // build the set of state ids the overlay will own going forward.
      const replacedIds = new Set(overlayAddStates.map(e => e.dataId));

      // remove any prior add-state entries for those ids so there is no duplicate roll.
      baseSkill.effects = baseSkill.effects
        .filter(e => e.code !== Game_Action.EFFECT_ADD_STATE || replacedIds.has(e.dataId) === false);
    }

    // concat all overlay effects — add-state entries for replaced ids now exist only once.
    baseSkill.effects = baseSkill.effects.concat(skillOverlay.effects);
  }

  /**
   * Extends the metadata of a skill.
   * @param {RPG_Skill} baseSkill The skill being extended.
   * @param {RPG_Skill} skillOverlay The skill extending the base skill.
   */
  static extendMetadata(baseSkill, skillOverlay)
  {
    // combine the meta together.
    baseSkill.meta = {
      ...baseSkill.meta, ...skillOverlay.meta,
    };

    // merge notes via overwriteNote() instead of blind concatenation.
    baseSkill.note = this.overwriteNote(baseSkill.note, skillOverlay.note);

    // invalidate all cached tag parses for this object (RPGManager WeakMap cache).
    RPGManager.invalidate(baseSkill);
  }

  /**
   * Extends the invocation section of a skill.
   * @param {RPG_Skill} baseSkill The skill being extended.
   * @param {RPG_Skill} skillOverlay The skill extending the base skill.
   */
  static extendInvocation(baseSkill, skillOverlay)
  {
    // combine speeds.
    if (skillOverlay.speed !== 0)
    {
      baseSkill.speed += skillOverlay.speed;
    }

    // if they aren't the same, and aren't 100 (default), then add them.
    if (baseSkill.successRate !== skillOverlay.successRate || skillOverlay.successRate !== 100)
    {
      baseSkill.successRate += skillOverlay.successRate;
    }

    // combine repeats if they aren't just 1 (default).
    if (skillOverlay.repeats !== 1)
    {
      baseSkill.repeats += (skillOverlay.repeats - 1);
    }

    // combine the tp gains.
    baseSkill.tpGain += skillOverlay.tpGain;

    // if both hit types are NOT "certain hit" (default), then overwrite them.
    if (baseSkill.hitType && skillOverlay.hitType)
    {
      baseSkill.hitType = skillOverlay.hitType;
    }

    // overwrite the animation if not 0 (default) and it changed.
    if (baseSkill.animationId !== 0 && baseSkill.animationId !== skillOverlay.animationId)
    {
      baseSkill.animationId = skillOverlay.animationId;
    }
  }

  /**
   * Extends the message section of a skill.
   * @param {RPG_Skill} baseSkill The skill being extended.
   * @param {RPG_Skill} skillOverlay The skill extending the base skill.
   */
  static extendMessage(baseSkill, skillOverlay)
  {
    // overwrite message 1.
    if (baseSkill.message1 !== skillOverlay.message1)
    {
      baseSkill.message1 = skillOverlay.message1;
    }

    // overwrite message 2.
    if (baseSkill.message2 !== skillOverlay.message2)
    {
      baseSkill.message2 = skillOverlay.message2;
    }
  }

  /**
   * Purges all references to the skill extend tag from the `baseSkill`.
   * @param baseSkill {RPG_Skill} The base skill.
   * @returns {RPG_Skill} The overlayed base skill.
   */
  static sanitizeExtensions(baseSkill)
  {
    // remove the skill extend from the metadata.
    delete baseSkill.meta['skillExtend'];

    // remove the skill extend from the notedata.
    baseSkill.note = baseSkill.note.replace(J.EXTEND.RegExp.SkillExtend, String.empty);

    // cleanup any duplicate newlines.
    baseSkill.note = baseSkill.note.replace(/\n\n/gmi, '\n');
    baseSkill.note = baseSkill.note.replace(/\r\r/gmi, '\r');

    // we changed the note – invalidate cached parses for this skill.
    RPGManager.invalidate(baseSkill);
  }

  //region extend note
  // TODO: make this configurable.
  /**
   * The list of keys on notes that should never get merged/overridden, but instead appended.
   * @type {string[]}
   */
  static _nonCombiningKeys = [ 'drop' ];

  /**
   * Gets the keys that should never be combined- they will effectively be treated as unsupported.
   * @returns {string[]}
   */
  static getNonCombiningKeys()
  {
    return this._nonCombiningKeys;
  }

  /**
   * Sets the global list of tag keys that should NOT be replaced when merging, but instead combined.
   * This allows multi-instance tags like `drop` to append additional lines from the overlay note.
   * @param {string[]} keys The array of keys that should be non-combining (case-insensitive).
   */
  static setNonCombiningKeys(keys)
  {
    // ensure we store a normalized list of lowercase keys for comparisons.
    this._nonCombiningKeys = Array.isArray(keys)
      ? keys.map(k => String(k)
        .toLowerCase())
      : [];
  }

  /**
   * Merges the overlay note into the base note with key-aware behavior.
   * - For keys not in the exclusions set: replace base lines with overlay lines if overlay provides any.
   * - For keys in the exclusions set: append unique overlay lines after base lines (multi-instance tags like "drop").
   * - Unsupported lines (non-tag text) are preserved from both notes with deduplication; base lines keep priority.
   *
   * Keys are case-insensitive. Tags are those enclosed with angle brackets (e.g., `<key:value>` or `<key>`).
   *
   * @param {string} baseNote The base note content.
   * @param {string} overlayNote The overlay note content.
   * @param {string[]=} nonCombiningKeys Optional keys to merge instead of replace; defaults to configured static list.
   * @returns {string} The merged note text, joined with newlines.
   */
  static overwriteNote(baseNote, overlayNote, nonCombiningKeys)
  {
    // normalize the incoming notes to empty strings if nullish.
    const oldNote = baseNote || String.empty;

    // normalize the overlay note to empty string if nullish.
    const newNote = overlayNote || String.empty;

    // normalize the incoming non-combining keys; fall back to configured static if not provided.
    const exclusions = this._normalizeExclusions(nonCombiningKeys);

    // tokenize both notes into tags and unsupported lines.
    const oldTokens = this._tokenizeNote(oldNote);

    // tokenize the new note into tags and unsupported lines as well.
    const newTokens = this._tokenizeNote(newNote);

    // bucket the tags by key for old note.
    const oldBuckets = this._toKeyBuckets(oldTokens.tags);

    // bucket the tags by key for new note.
    const newBuckets = this._toKeyBuckets(newTokens.tags);

    // merge the buckets based on replace-or-merge rules and exclusions.
    const merged = this._mergeBuckets(oldBuckets, newBuckets, exclusions);

    // merge unsupported lines from old then new with deduplication.
    const mergedUnsupported = this._mergeUnsupported(oldTokens.unsupported, newTokens.unsupported);

    // reconstruct the final note text from unsupported + merged tags in key order.
    const result = this._reconstructNote(mergedUnsupported, merged);

    // return the final merged note string.
    return result;
  }

  /**
   * Normalizes the incoming exclusions array, or falls back to the static configuration.
   * @param {string[]|null|undefined} exclusions The caller-provided keys that should merge instead of replace.
   * @returns {string[]} A lowercase array of keys to treat as non-replacing during merges.
   */
  static _normalizeExclusions(exclusions)
  {
    // determine the base keys list to use.
    const provided = Array.isArray(exclusions)
      ? exclusions
      : this.getNonCombiningKeys();

    // normalize all keys to lowercase for case-insensitive comparisons.
    return provided.map(k => String(k)
      .toLowerCase());
  }

  /**
   * Tokenizes a note text into angle-bracketed tags and unsupported lines.
   * Handles tags concatenated without newlines by regex extraction, and also
   * collects newline-separated content that is not tags.
   * @param {string} note The raw note text.
   * @returns {{tags: string[], unsupported: string[]}} The extracted tags and unsupported lines.
   */
  static _tokenizeNote(note)
  {
    // find angle-bracketed chunks like <key:value> or <key>.
    const tags = note.match(/<[^>]+>/g) || [];

    // split the raw text on newlines to capture any free-form lines.
    const rawLines = (note.split(/[\r\n]+/) || []).filter(l => l.length > 0);

    // build a fast look-up set of exact tag strings.
    const tagSet = new Set(tags);

    // anything that is not an exact tag string is considered unsupported.
    const unsupported = rawLines.filter(l => tagSet.has(l) === false);

    // return the separated collections.
    return {
      tags: tags,
      unsupported: unsupported
    };
  }

  /**
   * Parses a single tag string into a key and type using the existing classifier.
   * @param {string} tag The tag, e.g. "<range:5>" or "<direct>".
   * @returns {{type: string, key: (string|null), line: string}} The parsed record.
   */
  static _parseTag(tag)
  {
    // classify tag or unsupported using existing logic.
    const type = this._classifyLine(tag);

    // unsupported tags simply echo back with null key.
    if (type === OverlayManager.LineType.unsupported)
    {
      // return unsupported tag data.
      return {
        type: type,
        key: null,
        line: tag
      };
    }

    // strip off the leading and trailing angle brackets.
    const inner = tag.substring(1, tag.length - 1);

    // if this is a kvp like <key:value> then split on the first colon.
    if (type === OverlayManager.LineType.kvp)
    {
      // find the first colon index.
      const idx = inner.indexOf(':');

      // extract and normalize the key to lowercase.
      const key = inner.substring(0, idx)
        .trim()
        .toLowerCase();

      // return the parsed kvp.
      return {
        type: type,
        key: key,
        line: tag
      };
    }

    // it must be boolean; use the entire inner content as the key.
    const key = inner.trim()
      .toLowerCase();

    // return the parsed boolean.
    return {
      type: OverlayManager.LineType.boolean,
      key: key,
      line: tag
    };
  }

  /**
   * Determines if the note line is one of our standard key-value pairs separated by a colon.
   * @param {string} line The note line as a string.
   * @returns {boolean} True if it is a conventional <key:value> type of line.
   */
  static _classifyLine(line)
  {
    // must at least start and end with angle brackets.
    if (line.startsWith('<') === false || line.endsWith('>') === false) return OverlayManager.LineType.unsupported;

    // too many angle brackets.
    if ((line.match(/</g) || []).length > 1) return OverlayManager.LineType.unsupported;
    if ((line.match(/>/g) || []).length > 1) return OverlayManager.LineType.unsupported;

    // if a colon exists, then it must be a key-value pair of some kind.
    if (line.includes(':')) return OverlayManager.LineType.kvp;

    // its just a pair of angle brackets, so its a boolean-type tag.
    return OverlayManager.LineType.boolean;
  }

  /**
   * Buckets an array of tag strings by their keys, preserving the first-seen key order
   * and deduping exact duplicate lines within a key.
   * @param {string[]} tags The tag strings to bucket.
   * @returns {{ order: string[], map: Record<string, string[]> }} The ordered keys and per-key lines.
   */
  static _toKeyBuckets(tags)
  {
    // the ordered list of unique keys as encountered.
    const order = [];

    // the key -> array-of-lines mapping.
    const map = Object.create(null);

    // iterate over each tag.
    tags.forEach(tag =>
    {
      // parse the tag into its parts.
      const parsed = this._parseTag(tag);

      // skip unsupported; those are handled elsewhere.
      if (parsed.type === OverlayManager.LineType.unsupported)
      {
        return;
      }

      // if encountering this key for the first time, initialize it.
      if (map[parsed.key] === undefined)
      {
        // initialize the array of lines for this key.
        map[parsed.key] = [];

        // record the encounter order for later reconstruction.
        order.push(parsed.key);
      }

      // dedupe exact duplicate lines for this key.
      if (map[parsed.key].includes(parsed.line) === false)
      {
        // add this unique line.
        map[parsed.key].push(parsed.line);
      }
    });

    // return the buckets.
    return {
      order: order,
      map: map
    };
  }

  /**
   * Merges the old and new buckets according to replacement rules and exclusions.
   * - For keys NOT in exclusions: replace old lines entirely with new lines (if provided), else keep old.
   * - For keys IN exclusions: combine old lines with new lines (append unique new lines), preserving order.
   * - New-only keys are appended in the order they appear in the new note.
   * @param {{order: string[], map: Record<string, string[]>}} oldBuckets The buckets from the base note.
   * @param {{order: string[], map: Record<string, string[]>}} newBuckets The buckets from the overlay note.
   * @param {string[]} exclusions The keys to be combined instead of replaced.
   * @returns {{ order: string[], map: Record<string, string[]> }} The merged buckets.
   */
  static _mergeBuckets(oldBuckets, newBuckets, exclusions)
  {
    // the merged map to accumulate into.
    const mergedMap = Object.create(null);

    // the merged key order to output.
    const mergedOrder = [];

    // helper to append a key with its lines in order while honoring dedupe.
    const appendKey = (key, lines) =>
    {
      // ignore if no lines provided.
      if (!lines || lines.length === 0)
      {
        return;
      }

      // set the lines array as a shallow copy.
      mergedMap[key] = lines.slice(0);

      // record the key order if not already present.
      if (mergedOrder.includes(key) === false)
      {
        // push the key preserving order.
        mergedOrder.push(key);
      }
    };

    // step 1: walk old keys first to preserve their order baseline.
    oldBuckets.order.forEach(key =>
    {
      // determine whether this key is in the exclusions list.
      const isExcluded = exclusions.includes(key);

      // gather the old lines for this key.
      const oldLines = oldBuckets.map[key];

      // gather any new lines for this key, if present.
      const newLines = newBuckets.map[key];

      // if we have new lines and the key is not excluded, then replace.
      if (newLines && newLines.length > 0 && isExcluded === false)
      {
        // replace the old lines entirely with the new lines.
        appendKey(key, newLines);
        return;
      }

      // if the key is excluded and we have new lines, then combine.
      if (isExcluded && newLines && newLines.length > 0)
      {
        // start with a copy of old lines.
        const combined = oldLines.slice(0);

        // append any new unique lines.
        newLines.forEach(line =>
        {
          // only include if not present.
          if (combined.includes(line) === false)
          {
            // add the unique new line.
            combined.push(line);
          }
        });

        // append the combined lines for this key.
        appendKey(key, combined);
        return;
      }

      // otherwise, no new lines or no exclusion behavior; keep old.
      appendKey(key, oldLines);
    });

    // step 2: append any new-only keys at the end in the order they appear in the new note.
    newBuckets.order.forEach(key =>
    {
      // only consider keys we don't already have.
      if (mergedOrder.includes(key) === false)
      {
        // add the new-only key with its lines as-is.
        appendKey(key, newBuckets.map[key]);
      }
    });

    // return the merged buckets for reconstruction.
    return {
      order: mergedOrder,
      map: mergedMap
    };
  }

  /**
   * Merges unsupported lines by appending new unsupported lines that do not already exist.
   * Old unsupported lines retain their relative order.
   * @param {string[]} oldUnsupported The unsupported lines from the base note.
   * @param {string[]} newUnsupported The unsupported lines from the overlay note.
   * @returns {string[]} The merged unsupported lines.
   */
  static _mergeUnsupported(oldUnsupported, newUnsupported)
  {
    // initialize the merged unsupported list honoring old order.
    const merged = [];

    // include all old unsupported while deduping.
    oldUnsupported.forEach(line =>
    {
      // only include if not already added.
      if (merged.includes(line) === false)
      {
        // add the old unsupported line.
        merged.push(line);
      }
    });

    // append any new unsupported lines not already present.
    newUnsupported.forEach(line =>
    {
      // only include if not already present.
      if (merged.includes(line) === false)
      {
        // add the new unsupported line.
        merged.push(line);
      }
    });

    // return the merged unsupported lines.
    return merged;
  }

  /**
   * Reconstructs a note from unsupported lines and merged buckets of tags.
   * Unsupported lines are emitted first, followed by tags grouped by key in key order.
   * @param {string[]} unsupported The unsupported lines to emit first.
   * @param {{order: string[], map: Record<string, string[]>}} buckets The merged buckets.
   * @returns {string} The reconstructed note text.
   */
  static _reconstructNote(unsupported, buckets)
  {
    // initialize an array of parts to join.
    const parts = [];

    // append unsupported lines first, honoring their order.
    unsupported.forEach(line =>
    {
      // push the unsupported line.
      parts.push(line);
    });

    // for each key in order, append its lines in recorded order.
    buckets.order.forEach(key =>
    {
      // retrieve the lines for this key.
      const lines = buckets.map[key];

      // append each tag line.
      lines.forEach(line =>
      {
        // push the tag line.
        parts.push(line);
      });
    });

    // join with newlines to keep readability and stability.
    const result = parts.join('\n');

    // return the reconstructed note.
    return result;
  }

  //endregion extend note
  //endregion extensions
}

//endregion OverlayManager

//region Game_Action
/**
 * Overrides {@link #setSkill}.<br>
 * If a caster is available to this action, then update the udnerlying skill with
 * the overlayed skill instead.
 */
J.EXTEND.Aliased.Game_Action.set('setSkill', Game_Action.prototype.setSkill);
Game_Action.prototype.setSkill = function(skillId)
{
  // check if we are missing a caster.
  if (!this.subject())
  {
    // perform original logic.
    J.EXTEND.Aliased.Game_Action.get('setSkill')
      .call(this, skillId);

    // stop processing.
    return;
  }

  // build the extended skill.
  const skillToSet = OverlayManager.getExtendedSkill(this.subject(), skillId);

  // assign the overlayed skill to the object instead.
  this._item.setObject(skillToSet);
};

/**
 * Overrides {@link #setItemObject}.<br>
 * If a caster is available to this action, then update the underlying item with the data.
 */
J.EXTEND.Aliased.Game_Action.set('setItemObject', Game_Action.prototype.setItemObject);
Game_Action.prototype.setItemObject = function(itemObject)
{
  // check if we are missing a caster.
  if (!this.subject())
  {
    // perform original logic.
    J.EXTEND.Aliased.Game_Action.get('setItemObject')
      .call(this, itemObject);

    // stop processing.
    return;
  }

  // TODO: sort out how to manage this when both skills AND items come through this way.
  this._item.setObject(itemObject);
};

/**
 * Extends {@link #apply}.<br>
 * Also applies on-hit states.
 */
J.EXTEND.Aliased.Game_Action.set('apply', Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Action.get('apply')
    .call(this, target);

  // apply our on-hit self-states if we have any.
  this.applyOnHitSelfStates();
};

/**
 * Applies all applicable on-hit self states.
 */
Game_Action.prototype.applyOnHitSelfStates = function()
{
  // apply all on-hit states to oneself.
  this.applyStates(this.subject(), this.onHitSelfStates());
};

/**
 * Gets all possible states that could be self-inflicted when this skill hits a target.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Action.prototype.onHitSelfStates = function()
{
  // grab all the self-state sources.
  const sources = this.selfStateSources();

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnHitSelfState);

  // return what we found.
  return stateChances;
};

/**
 * Extends {@link #applyItemUserEffect}.<br>
 * Also applies on-cast states.
 */
J.EXTEND.Aliased.Game_Action.set('applyItemUserEffect', Game_Action.prototype.applyItemUserEffect);
Game_Action.prototype.applyItemUserEffect = function(target)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Action.get('applyItemUserEffect')
    .call(this, target);

  // apply our on-cast self-states if we have any.
  this.applyOnCastSelfStates();
};

/**
 * Applies all applicable on-cast self states.
 */
Game_Action.prototype.applyOnCastSelfStates = function()
{
  // apply all self-inflictable states to oneself.
  this.applyStates(this.subject(), this.onCastSelfStates());
};

/**
 * Gets all possible states that could be self-inflicted when casting this skill.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Action.prototype.onCastSelfStates = function()
{
  // grab all the self-state sources.
  const sources = this.selfStateSources();

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnCastSelfState);

  // return what we found.
  return stateChances;
};

/**
 * All sources to derive self-applied states from.
 * @returns {(RPG_UsableItem|RPG_State)[]}
 */
Game_Action.prototype.selfStateSources = function()
{
  // define the sources for this action.
  const sources = [
    // this action itself is a source (the underlying item/skill).
    this.item(),

    // the caster's states also apply as a source.
    ...this.subject()
      .allStates(), ];

  // return what we found.
  return sources;
};

/**
 * Applies the given states to the target.
 * @param target {Game_Actor|Game_Enemy} The target to apply states to.
 * @param jabsOnChanceEffects {JABS_OnChanceEffect[]} The various states to potentially apply.
 */
Game_Action.prototype.applyStates = function(target, jabsOnChanceEffects)
{
  if (jabsOnChanceEffects.length)
  {
    // iterate over each of them and see if we should apply them.
    jabsOnChanceEffects.forEach(jabsOnChanceEffect =>
    {
      // roll the dice to see if the on-chance effect applies.
      if (jabsOnChanceEffect.shouldTrigger())
      {
        // apply the given state to the caster, with the caster as the attacker.
        target.addState(jabsOnChanceEffect.skillId, this.subject());
      }
    });
  }
};
//endregion Game_Action

//region Game_Actor
/**
 * Overrides {@link #skill}<br/>.
 * Overlays the skill with any skill extensions.
 * @param {number} skillId The skill id to get the skill for.
 * @returns {RPG_Skill} The potentially extended skill.
 */
Game_Actor.prototype.skill = function(skillId)
{
  return OverlayManager.getExtendedSkill(this, skillId);
};

/**
 * Extends {@link #learnSkill}.<br/>
 * Invalidates the caster cache when a skill is learned.
 */
J.EXTEND.Aliased.Game_Actor.set('learnSkill', Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Actor.get('learnSkill')
    .call(this, skillId);

  // also invalidate the caster cache.
  OverlayManager.invalidate(this);
};

/**
 * Extends {@link #forgetSkill}.<br/>
 * Invalidates the caster cache when a skill is forgotten.
 */
J.EXTEND.Aliased.Game_Actor.set('forgetSkill', Game_Actor.prototype.forgetSkill);
Game_Actor.prototype.forgetSkill = function(skillId)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Actor.get('forgetSkill')
    .call(this, skillId);

  // also invalidate the caster cache.
  OverlayManager.invalidate(this);
};
//endregion Game_Actor

//region Game_Enemy
/**
 * Extends {@link #learnSkill}.<br/>
 * Invalidates the caster cache when a skill is learned.
 */
J.EXTEND.Aliased.Game_Enemy.set('learnSkill', Game_Enemy.prototype.learnSkill);
Game_Enemy.prototype.learnSkill = function(skillId)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Enemy.get('learnSkill')
    .call(this, skillId);

  // also invalidate the caster cache.
  OverlayManager.invalidate(this);
};
//endregion Game_Enemy

//region Game_Item
/**
 * Extend `initialize()` to include our update of assigning the item.
 */
J.EXTEND.Aliased.Game_Item.set('initialize', Game_Item.prototype.initialize);
Game_Item.prototype.initialize = function(item)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Item.get('initialize')
    .call(this, item);

  /**
   * The underlying object associated with this item.
   * @type {RPG_EquipItem|rm.types.UsableItem}
   */
  this._item = null;
  if (item)
  {
    this._item = item;
  }
};

/**
 * Gets the underlying object for this `Game_Item`.
 * Normally this can be retrieved by using {@link Game_Item.object}, but that function limits
 * the possibility of retrieval to only stuff in the database, which extended skills will
 * not be in the database.
 */
Game_Item.prototype.underlyingObject = function()
{
  return this._item;
};

/**
 * Extends `setObject()` to enable setting custom skills and items.
 * @param {RPG_UsableItem|RPG_EquipItem}
 */
J.EXTEND.Aliased.Game_Item.set('setObject', Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(obj)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Item.get('setObject')
    .call(this, obj);

  // check to make sure we have something to work with.
  if (!obj) return;

  // check to ensure it has a skill category property.
  if (obj.hasOwnProperty('stypeId'))
  {
    // assign the data.
    this._dataClass = 'skill';
    this._item = obj;
  }
  // check to ensure it has an item category property.
  else if (obj.hasOwnProperty('itypeId'))
  {
    // assign the data.
    this._dataClass = 'item';
    this._item = obj;
  }
};

/**
 * Extends this function to return the underlying custom object (like an extended skill)
 * if it was assigned.
 */
J.EXTEND.Aliased.Game_Item.set('object', Game_Item.prototype.object);
Game_Item.prototype.object = function()
{
  // if we have a custom object to return, return that.
  if (this._item)
  {
    return this._item;
  }

  return J.EXTEND.Aliased.Game_Item.get('object')
    .call(this);
};
//endregion Game_Item

//region Game_Party
Game_Party.prototype.extraOnHitSelfStateSources = function()
{
  const extraSources = [];

  // if we're using passive skill states...
  if (J.PASSIVE)
  {
    // get all the members of the battle party.
    const members = $gameParty.battleMembers();
    members.forEach(member =>
    {
      // and shove their current array of states into the sources to check.
      extraSources.push(...member.allStates());
    });
  }

  // return all found sources.
  return extraSources;
};

Game_Party.prototype.extraOnCastSelfStateSources = function()
{
  const extraSources = [];

  // if we're using passive skill states...
  if (J.PASSIVE)
  {
    // get all the members of the battle party.
    const members = $gameParty.battleMembers();
    members.forEach(member =>
    {
      // and shove their current array of states into the sources to check.
      extraSources.push(...member.allStates());
    });
  }

  // return all found sources.
  return extraSources;
};
//endregion Game_Party

//# sourceMappingURL=J-SkillExtend.js.map
