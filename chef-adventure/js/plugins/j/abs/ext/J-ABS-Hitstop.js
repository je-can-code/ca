//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.2 HITSTOP] An extension for JABS that adds hitstop functionality.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin does some stuff that is probably pretty cool.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Cool details about this cool plugin go here.
 *
 * ============================================================================
 * SOMETHING KEY TO THIS PLUGIN:
 * Ever want to do something cool? Well now you can! By applying the
 * appropriate tag to across the various database locations, you too can do
 * cool things that only others with this plugin can do.
 *
 * TAG USAGE:
 * - Actors
 * - Enemies
 * - Skills
 * - etc.
 *
 * TAG FORMAT:
 *  <tag:VALUE>
 *    Where VALUE represents the amount to do.
 *
 * TAG EXAMPLES:
 *  <tag:100>
 * 100 of something will occur when this is triggered.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.2
 *    Raised minimum J-ABS version requirement to 4.7.0.
 * - 1.0.1
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.0
 *    The initial release.
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
 *
 * @command do-the-thing
 * @text Add/Remove points
 * @desc Adds or removes a designated amount of points from all members of the current party.
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The number of points to modify by. Negative will remove points. Cannot go below 0.
 */
//endregion annotations

//region plugin metadata
class JHitstop_PluginMetadata
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
     * Default frames to use when a skill lacks `<hitstop:N>`.
     * Typical values: 0–10. Keep subtle by default.
     * @type {number}
     */
    this.defaultHitstopFrames = 5;

    /**
     * Frames to add when the hit is a critical. Small bump keeps readability without camera FX.
     * @type {number}
     */
    this.critBonusFrames = 15;

    /**
     * Guarded hits scale by this percent (e.g., 50 means half duration on guard).
     * @type {number}
     */
    this.guardScalePercent = 50;

    /**
     * Global maximum cap on frames to prevent long freezes.
     * @type {number}
     */
    this.maxFrames = 60;

    /**
     * Global multi-hit decay percent applied within the flurry window (e.g., 50 = half duration).
     * @type {number}
     */
    this.flurryDecayPercent = 50;

    /**
     * The window (in frames) during which subsequent hits from the same action decay.
     * @type {number}
     */
    this.flurryWindowFrames = 20;

    /**
     * Whether to apply a brief white flash on targets (disabled in MVP; requires sprite access helper).
     * @type {boolean}
     */
    this.flashOnHit = false;

    //region shake
    /**
     * Enables a tiny screen shake when hitstop is applied.
     * @type {boolean}
     */
    this.shakeOnHit = true;

    /**
     * Minimum hitstop frames before shake triggers; prevents noise on 1–2f taps.
     * @type {number}
     */
    this.shakeMinFrames = 2;

    /**
     * Base shake power (RMMZ `$gameScreen.startShake(power, speed, duration)`).
     * Keep very small for party play.
     * @type {number}
     */
    this.shakeBasePower = 0.1;

    /**
     * Extra power per hitstop frame (e.g., 0.25 means 5f → +1.25 power).
     * @type {number}
     */
    this.shakePowerPerFrame = 0.025;

    /**
     * Shake speed (visual frequency). 5 is the engine’s typical default.
     * @type {number}
     */
    this.shakeSpeed = 8;

    /**
     * Maximum duration (in frames) for a shake, regardless of hitstop length.
     * @type {number}
     */
    this.shakeMaxDurationFrames = 8;

    /**
     * Cooldown in frames during which no new shake will start; tames APM spam.
     * @type {number}
     */
    this.shakeCooldownFrames = 5;

    /**
     * Only shake when the attacker is the player battler.
     * @type {boolean}
     */
    this.onlyOnPlayerImpact = true;

    /**
     * Also allow shake when the player is the target (being hit).
     * @type {boolean}
     */
    this.alsoOnPlayerAsTarget = true;

    /**
     * If true, only the first impact within the flurry window can trigger shake.
     * @type {boolean}
     */
    this.shakeOnlyOnFlurryFirstHit = true;

    this.lastShakeFrame = 0;

    //endregion shake
  }
}

//endregion plugin metadata

//region initialization
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

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '4.6.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();

//endregion version check
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.HITSTOP = {};

/**
 * The metadata associated with this plugin.
 */
J.ABS.EXT.HITSTOP.Metadata = new JHitstop_PluginMetadata('J-ABS-Hitstop', '1.0.1');

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.HITSTOP.Aliased = {};
J.ABS.EXT.HITSTOP.Aliased.Game_Character = new Map();
J.ABS.EXT.HITSTOP.Aliased.JABS_Engine = new Map();
J.ABS.EXT.HITSTOP.Aliased.JABS_Action = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.HITSTOP.RegExp = {
  /**
   * Skill: `<hitstop:N>`
   */
  Hitstop: /<hitstop:[ ]?(\d+)>/i,
  /**
   * Skill: `<noHitstop>`
   */
  NoHitstop: /<noHitstop>/i,
  /**
   * Actor/Enemy: `<hitstopScale:P%>`
   */
  HitstopScale: /<hitstopScale:[ ]?(\d+)%>/i,
};
//endregion initialization

//region JABS_Action (hitstop helpers)
/**
 * Gets the hitstop frames declared on the skill via `<hitstop:N>`.
 * Returns 0 if not tagged.
 * @returns {number}
 */
JABS_Action.prototype.getHitstopFrames = function()
{
  // read a number from the skill’s notes.
  const skill = this.getBaseSkill();

  // extract the frames from the tag when present.
  const frames = RPGManager.getNumberFromNoteByRegex(skill, J.ABS.EXT.HITSTOP.RegExp.Hitstop, true);

  // return the frames or 0 if not found.
  return frames || 0;
};

/**
 * Whether this skill disables hitstop via `<noHitstop>`.
 * @returns {boolean}
 */
JABS_Action.prototype.skillDisablesHitstop = function()
{
  // read the existance of the tag from notes.
  const skill = this.getBaseSkill();

  // return whether or not the no-hitstop tag exists.
  return RPGManager.checkForBooleanFromNoteByRegex(skill, J.ABS.EXT.HITSTOP.RegExp.NoHitstop);
};
//endregion JABS_Action (hitstop helpers)

//region JABS_HitstopData
/**
 * Represents per-entity hitstop state (timer and queued effects).
 */
class JABS_HitstopData
{
  /**
   * Constructor.
   */
  constructor()
  {
    // initialize all members.
    this.initMembers();
  }

  /**
   * Initializes this data model.
   */
  initMembers()
  {
    /**
     * The remaining hitstop frames for this entity.
     * @type {number}
     */
    this._frames = 0;

    /**
     * A short-lived map of actionUuid => remaining frames used to scale multi-hit decay.
     * This is per-character so decay is per-target per-action.
     * @type {Map<string, number>}
     */
    this._flurryWindows = new Map();
  }

  /**
   * JsonEx restores `_flurryWindows` as a plain object; `Map` is not JSON-native.
   */
  normalizeFlurryWindowsMap()
  {
    if (this._flurryWindows instanceof Map)
    {
      return;
    }

    const raw = this._flurryWindows;
    const map = new Map();
    if (raw !== undefined && raw !== null && typeof raw === 'object')
    {
      Object.keys(raw).forEach(k =>
      {
        const v = raw[k];
        if (typeof v === 'number' && Number.isNaN(v) === false)
        {
          map.set(k, v);
        }
      });
    }

    this._flurryWindows = map;
  }

  /**
   * Sets hitstop frames.
   * @param {number} frames The frames to set.
   */
  setFrames(frames)
  {
    // set the frames to the provided amount.
    this._frames = Math.max(0, Math.floor(frames));
  }

  /**
   * Gets remaining hitstop frames.
   * @returns {number}
   */
  getFrames()
  {
    // return the remaining frames.
    return this._frames;
  }

  /**
   * Decrements hitstop frames by one frame.
   */
  tick()
  {
    this.normalizeFlurryWindowsMap();

    // decrement the timer if applicable.
    if (this._frames > 0) this._frames--;

    // also decrement any active flurry windows.
    this._flurryWindows.forEach((remaining, key) =>
    {
      // decrement the remaining frames.
      const next = remaining - 1;

      // if the window elapsed, remove this entry.
      if (next <= 0)
      {
        this._flurryWindows.delete(key);
      }
      // otherwise, persist the decremented window.
      else
      {
        this._flurryWindows.set(key, next);
      }
    });
  }

  /**
   * Whether this entity is currently hitstopped.
   * @returns {boolean}
   */
  isActive()
  {
    // return whether or not the frames are still ticking.
    return this._frames > 0;
  }

  /**
   * Flags the provided action uuid as “in flurry window” on this entity.
   * @param {string} actionUuid The action uuid.
   * @param {number} windowFrames The window in frames.
   */
  flagFlurryWindow(actionUuid, windowFrames)
  {
    this.normalizeFlurryWindowsMap();

    // set or replace the window with the provided amount.
    this._flurryWindows.set(actionUuid, Math.max(0, Math.floor(windowFrames)));
  }

  /**
   * Determines whether or not the provided action uuid is inside the flurry window.
   * @param {string} actionUuid The action uuid.
   * @returns {boolean} True if in the window, false otherwise.
   */
  isInFlurryWindow(actionUuid)
  {
    this.normalizeFlurryWindowsMap();

    // determine if the action is currently in the window.
    return this._flurryWindows.has(actionUuid);
  }
}

SerializableRegistry.register(JABS_HitstopData);

//endregion JABS_HitstopData

//region JABS_Engine (impact hook)
/**
 * Extends {@link JABS_Engine.postPrimaryBattleEffects}.<br/>
 * Also applies local hitstop to attacker, target, and the delivering action event.
 */
J.ABS.EXT.HITSTOP.Aliased.JABS_Engine.set('postPrimaryBattleEffects', JABS_Engine.prototype.postPrimaryBattleEffects);
JABS_Engine.prototype.postPrimaryBattleEffects = function(action, target)
{
  // perform original logic.
  J.ABS.EXT.HITSTOP.Aliased.JABS_Engine.get('postPrimaryBattleEffects')
    .call(this, action, target);

  // attempt to apply hitstop for this impact.
  this.tryApplyHitstop(action, target);
};

/**
 * Attempts to apply hitstop for this impact.
 * @param {JABS_Action} action The action affecting the target.
 * @param {JABS_Battler} target The target receiving the action.
 */
JABS_Engine.prototype.tryApplyHitstop = function(action, target)
{
  // grab the attacker.
  const attacker = action.getCaster();

  // apply using manager; this computes duration and handles decay.
  JABS_HitstopManager.apply(action, attacker, target);
};
//endregion JABS_Engine (impact hook)

//region JABS_HitstopManager
/**
 * A small helper that owns hitstop calculation and application.
 */
class JABS_HitstopManager
{
  /**
   * Computes the hitstop duration for this impact in frames.
   * @param {JABS_Action} action The action causing the impact.
   * @param {JABS_Battler} attacker The attacker battler.
   * @param {JABS_Battler} target The target battler.
   * @returns {number} The resolved frames (0..MaxFrames).
   */
  static durationFor(action, attacker, target)
  {
    // pull base frames from the skill tag or global default.
    const baseFrames = this.#getSkillHitstopFrames(action);

    // short-circuit if globally or locally disabled.
    if (baseFrames === 0) return 0;

    // derive flags from the result on the target battler.
    const result = target.getBattler()
      .result();

    // scale by crit bonus when applicable.
    const critBonus = result.critical
      ? J.ABS.EXT.HITSTOP.Metadata.critBonusFrames
      : 0;

    // scale by guard when applicable.
    const guardScale = result.guarded
      ? (J.ABS.EXT.HITSTOP.Metadata.guardScalePercent / 100)
      : 1;

    // parries nullify hitstop if present on result (shield ext sets result.parried).
    const isParry = result.parried === true;

    // compute raw duration from base adjustments.
    const raw = isParry
      ? 0
      : Math.floor((baseFrames + critBonus) * guardScale);

    // apply per-target scale (optional tag) on actors/enemies if present.
    const targetScale = this.#getBattlerHitstopScale(target);

    // combine and clamp to the configured max frames.
    const combined = Math.min(
      Math.floor(raw * targetScale),
      J.ABS.EXT.HITSTOP.Metadata.maxFrames
    );

    // return the final duration.
    return Math.max(0, combined);
  }

  /**
   * Applies hitstop to the attacker, target, and the delivering action event.
   * Also handles multi-hit decay.
   * @param {JABS_Action} action The action causing the hit.
   * @param {JABS_Battler} attacker The attacker.
   * @param {JABS_Battler} target The target.
   */
  static apply(action, attacker, target)
  {
    // compute the duration for this impact.
    let frames = this.durationFor(action, attacker, target);

    // if there is no duration, then do not apply hitstop.
    if (frames === 0) return;

    // resolve decay if the target recently took a hit from this action (multi-hit window).
    const targetChar = target.getCharacter();
    const hitstop = targetChar.getHitstopData();
    const actionUuid = action.getUuid();

    // if inside flurry window, reduce by global percent.
    if (hitstop.isInFlurryWindow(actionUuid))
    {
      // calculate the decayed frames.
      frames = Math.floor(frames * (J.ABS.EXT.HITSTOP.Metadata.flurryDecayPercent / 100));

      // clamp the result to minimum of 0.
      if (frames < 0) frames = 0;
    }

    // if still nothing after decay, do not apply.
    if (frames === 0) return;

    // apply the window for subsequent impacts from this same action.
    const wasFirstInFlurry = hitstop.isInFlurryWindow(actionUuid) === false;
    hitstop.flagFlurryWindow(actionUuid, J.ABS.EXT.HITSTOP.Metadata.flurryWindowFrames);

    // resolve all involved characters.
    const attackerChar = attacker.getCharacter();
    const actionChar = action.getActionSprite();

    // set hitstop on target.
    this.#applyFrames(targetChar, frames);

    // set hitstop on attacker.
    this.#applyFrames(attackerChar, frames);

    // set hitstop on the action event (if available or relevant).
    if (actionChar)
    {
      // set frames on the action event.
      this.#applyFrames(actionChar, frames);
    }

    // trigger a tiny screen shake to sell the moment (player-centric, anti-spam).
    this.#applyMicroShake(frames, attacker, target, wasFirstInFlurry);
  }

  //region internals
  /**
   * Applies frames to a `Game_Character`’s hitstop data (extends if active).
   * @param {Game_Character} character The character to affect.
   * @param {number} frames The frames to apply.
   */
  static #applyFrames(character, frames)
  {
    // grab hitstop data.
    const data = character.getHitstopData();

    // choose extension (max) so concurrent impacts coalesce.
    const extended = Math.max(data.getFrames(), frames);

    // set the frames on the character.
    data.setFrames(extended);
  }

  /**
   * Reads the skill’s hitstop frames, honoring `<noHitstop>`.
   * @param {JABS_Action} action The action to inspect.
   * @returns {number}
   */
  static #getSkillHitstopFrames(action)
  {
    // short-circuit if the skill declares no hitstop.
    if (action.skillDisablesHitstop()) return 0;

    // read a hitstop value from the skill if present; otherwise use default.
    const tagged = action.getHitstopFrames();

    // coalesce to default when no tag provided.
    return tagged > 0
      ? tagged
      : J.ABS.EXT.HITSTOP.Metadata.defaultHitstopFrames;
  }

  /**
   * Computes a per-battler scale (actors/enemies) for hitstop if tagged.
   * @param {JABS_Battler} jabsBattler The battler to read scale from.
   * @returns {number} A multiplier like 1.0 for 100%.
   */
  static #getBattlerHitstopScale(jabsBattler)
  {
    // grab the database object for the battler.
    const db = jabsBattler.getBattlerDatabaseData();

    // resolve a percent from notes if present.
    const scalePercent = RPGManager.getNumberFromNoteByRegex(db, J.ABS.EXT.HITSTOP.RegExp.HitstopScale, true);

    // if no scale provided, default to 100%.
    if (!scalePercent) return 1;

    // convert to a multiplier.
    return Math.max(0, scalePercent) / 100;
  }

  /**
   * Applies a subtle screen shake scaled by the given hitstop frames.
   * Player-centric, anti-spam, and optionally first-hit-only within flurry.
   * @param {number} frames The resolved, post-decay hitstop frames.
   * @param {JABS_Battler} attacker The attacker.
   * @param {JABS_Battler} target The target.
   * @param {boolean} wasFirstInFlurry Whether this was the first impact in the flurry window.
   */
  static #applyMicroShake(frames, attacker, target, wasFirstInFlurry)
  {
    // feature toggle and minimum significance.
    if (J.ABS.EXT.HITSTOP.Metadata.shakeOnHit === false) return;
    if (frames < J.ABS.EXT.HITSTOP.Metadata.shakeMinFrames) return;

    // only first hit in a flurry may shake, if configured.
    if (J.ABS.EXT.HITSTOP.Metadata.shakeOnlyOnFlurryFirstHit && wasFirstInFlurry === false) return;

    // player-centric gating.
    const onlyOnPlayer = J.ABS.EXT.HITSTOP.Metadata.onlyOnPlayerImpact === true;
    const alsoOnPlayerTarget = J.ABS.EXT.HITSTOP.Metadata.alsoOnPlayerAsTarget === true;
    const attackerIsPlayer = attacker.isPlayer && attacker.isPlayer();
    const targetIsPlayer = target.isPlayer && target.isPlayer();

    if (onlyOnPlayer)
    {
      // allow: player as attacker; optionally: player as target.
      const allowed = attackerIsPlayer || (alsoOnPlayerTarget && targetIsPlayer);
      if (allowed === false) return;
    }

    // global anti-spam cooldown using frame counter.
    const now = Graphics.frameCount || SceneManager._frameCount || 0;
    const cooldown = J.ABS.EXT.HITSTOP.Metadata.shakeCooldownFrames;
    if (now - J.ABS.EXT.HITSTOP._lastShakeFrame < cooldown) return;

    // derive power and duration (still tiny), then shake.
    const base = J.ABS.EXT.HITSTOP.Metadata.shakeBasePower;
    const perF = J.ABS.EXT.HITSTOP.Metadata.shakePowerPerFrame;
    const power = Math.max(0, base + (frames * perF));
    const speed = J.ABS.EXT.HITSTOP.Metadata.shakeSpeed;
    const duration = Math.min(frames, J.ABS.EXT.HITSTOP.Metadata.shakeMaxDurationFrames);

    $gameScreen.startShake(power, speed, duration);

    // stamp cooldown.
    J.ABS.EXT.HITSTOP.Metadata.lastShakeFrame = now;
  }

  //endregion internals
}

//endregion JABS_HitstopManager

//region Game_Character
/**
 * Extends {@link #initMembers}.<br>
 * Also initializes hitstop members.
 */
J.ABS.EXT.HITSTOP.Aliased.Game_Character.set('initMembers', Game_Character.prototype.initMembers);
Game_Character.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.HITSTOP.Aliased.Game_Character.get('initMembers')
    .call(this);

  // initialize the additional hitstop members.
  this.initHitstopMembers();
};

/**
 * Initializes all members associated with hitstop on this character.
 */
Game_Character.prototype.initHitstopMembers = function()
{
  /**
   * The root namespace for all plugin data.
   */
  this._j ||= {};

  /**
   * The root namespace for ABS-related data.
   */
  this._j._abs ||= {};

  /**
   * A grouping of all properties associated with this hitstop extension.
   */
  this._j._abs._hitstop = {};

  /**
   * The hitstop data model owning timers and queued effects.
   * @type {JABS_HitstopData}
   */
  this._j._abs._hitstop._data = new JABS_HitstopData();
};

/**
 * Gets the hitstop data for this character.
 * @returns {JABS_HitstopData}
 */
Game_Character.prototype.getHitstopData = function()
{
  if (!this._j._abs._hitstop)
  {
    this.initHitstopMembers();
  }

  // return the hitstop data model.
  return this._j._abs._hitstop._data;
};

/**
 * Whether or not this character is currently paused by hitstop.
 * @returns {boolean}
 */
Game_Character.prototype.isHitstopped = function()
{
  // check the hitstop data’s active flag.
  return this.getHitstopData()
    .isActive();
};

/**
 * Extends {@link #update}.<br>
 * Also pauses this character while hitstopped.
 */
J.ABS.EXT.HITSTOP.Aliased.Game_Character.set('update', Game_Character.prototype.update);
Game_Character.prototype.update = function()
{
  // if this character is currently hitstopped, tick the timer and stop here.
  if (this.isHitstopped())
  {
    // decrement the hitstop frames on this character.
    this.getHitstopData()
      .tick();

    // stop all other update progression to create the freeze effect.
    return;
  }

  // perform original logic.
  J.ABS.EXT.HITSTOP.Aliased.Game_Character.get('update')
    .call(this);
};
//endregion Game_Character

//# sourceMappingURL=J-ABS-Hitstop.js.map
