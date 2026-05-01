//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PASSIVE-ABS] Random passive affixes + tier presentation for JABS enemies.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Passive
 * @base J-ABS-Speed
 * @base J-ABS-Tools
 * @base J-ABS-Timing
 * @base J-ABS-Shield
 * @base J-SkillExtend
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Passive
 * @orderAfter J-ABS-Speed
 * @orderAfter J-ABS-Tools
 * @orderAfter J-ABS-Timing
 * @orderAfter J-ABS-Shield
 * @orderAfter J-SkillExtend
 * @orderAfter J-HUD-TargetFrame
 * @orderAfter J-MessageTextCodes
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Passive for J-ABS.
 *
 * It adds a passive "affix" system to JABS map enemies so they can spawn with
 * a random tier prefix and/or suffix (both weighted), and it decorates the
 * name presentation on the map and in the target HUD.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This plugin is intentionally layered behind a simple policy:
 * If an event explicitly defines passive state ids via `<passive:[...]>`, then
 * those ids win and no random affix rolling occurs for that spawn.
 *
 * Otherwise, prefix/suffix affixes are rolled from state-defined pools and
 * applied as passive states to the spawned enemy battler.
 *
 * ============================================================================
 * PASSIVE AFFIX RNG (MAP ENEMIES)
 * Have you ever wanted "Wicked Slime" or "Slime of Frost" to be a thing, but
 * still want full control when you need it? Well now you can! By applying the
 * appropriate tags to your states and enemies (and optionally event comments),
 * you too can have JABS enemies spawn with weighted passive affixes.
 *
 * TAG USAGE:
 * - States (prefix/suffix pool membership + weights)
 * - Enemies (block RNG and/or override chances)
 * - Events (Comment commands on the page that spawns the enemy)
 *
 * POLICY / PRECEDENCE:
 *  (1) If the event has an explicit `<passive:[...]>` list that contains any
 *      affix ids, then that list is applied and no random affix rolling
 *      occurs.
 *  (2) Otherwise, prefix and suffix are rolled independently by chance + pool.
 *  (3) Event comment overrides beat enemy note overrides, which beat the
 *      plugin defaults.
 *
 * ----------------------------------------------------------------------------
 * BLOCKING RANDOM AFFIXES
 * Have you ever wanted a specific enemy to opt-out of random affixes entirely,
 * or to only ever roll one slot? Well now you can! By applying the following
 * tags to an enemy note, you too can block random affix rolls per enemy.
 *
 * TAG USAGE:
 * - Enemies
 *
 * TAG FORMAT:
 *  <no-rng-passives>
 *  <no-rng-passive-prefixes>
 *  <no-rng-passive-suffixes>
 *
 * TAG EXAMPLES:
 *  <no-rng-passives>
 *    Prevents rolling both prefixes and suffixes for this enemy.
 *
 *  <no-rng-passive-prefixes>
 *    Prevents rolling prefixes for this enemy, but suffixes may still roll.
 *
 * ----------------------------------------------------------------------------
 * OVERRIDING RANDOM AFFIX CHANCES
 * Have you ever wanted a particular enemy (or a single spawn point on the map)
 * to have a much higher (or lower) chance of rolling an affix? Well now you
 * can! By applying these chance tags to an enemy note or event comment, you
 * too can override the percent chance for that slot.
 *
 * TAG USAGE:
 * - Enemies
 * - Events (Comment commands)
 *
 * TAG FORMAT:
 *  <passive-affix-prefix-chance:PERCENT>
 *  <passive-affix-suffix-chance:PERCENT>
 *    Where PERCENT is 0–100 (decimals allowed).
 *
 * TAG NOTES:
 * - Multiple chance tags on an event page are allowed; the last one wins.
 * - Event comment chance overrides take priority over enemy note overrides.
 *
 * TAG EXAMPLES:
 *  <passive-affix-prefix-chance:100>
 *    Always rolls a prefix (unless blocked or overridden by explicit
 *    `<passive:[...]>`).
 *
 *  <passive-affix-suffix-chance:12.5>
 *    Rolls a suffix roughly 12.5% of the time.
 *
 * ============================================================================
 * AFFIX POOLS (STATE NOTES)
 * Have you ever wanted some passive states to act like "affix words", where a
 * state can be eligible to become a prefix or suffix? Well now you can! By
 * applying the following tags to states, you too can define the pools this
 * plugin rolls from.
 *
 * TAG USAGE:
 * - States
 *
 * TAG FORMAT:
 *  <enemy-prefix>
 *  <enemy-suffix>
 *
 * TAG EXAMPLES:
 *  <enemy-prefix>
 *    This state can be selected as a prefix affix state.
 *
 * ----------------------------------------------------------------------------
 * WEIGHTING AFFIX ROLLS
 * Have you ever wanted some affixes to be common and others to be rare? Well
 * now you can! By applying a weight tag to a state, you too can influence how
 * often it is selected by the weighted roll.
 *
 * TAG USAGE:
 * - States
 *
 * TAG FORMAT:
 *  <affix-weight:N>
 *    Where N is a positive integer weight.
 *
 * TAG EXAMPLES:
 *  <affix-weight:10>
 *    Ten times as likely as an affix with weight 1.
 *
 * ============================================================================
 * TIER STRIPE / TINT
 * Have you ever wanted your tier prefix to communicate its tier visually on
 * the map (and optionally in the HUD), without forcing every prefix to have a
 * color? Well now you can! By applying a tier hex tag to a prefix state, you
 * too can tint the map nameplate stripe (and optionally the HUD name row).
 *
 * TAG USAGE:
 * - States
 *
 * TAG FORMAT:
 *  <tier-color-hex:#RRGGBB>
 *
 * TAG NOTES:
 * - No tag means no stripe tint. Full stop.
 *
 * TAG EXAMPLES:
 *  <tier-color-hex:#FF0000>
 *    Uses a bright red stripe tint when this prefix is the selected tier
 *    prefix.
 *
 * ============================================================================
 * PLUGIN PARAMETERS
 * Have you ever wanted to tune the default prefix/suffix roll chances without
 * tagging every enemy? Well now you can! By configuring the parameters below,
 * you too can set the global defaults used when no overrides are present.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param parentConfigPassiveAbs
 * @text PASSIVE ABS
 *
 * @param default-prefix-chance
 * @parent parentConfigPassiveAbs
 * @type number
 * @decimals 2
 * @min 0
 * @max 100
 * @text Default Prefix Affix Chance
 * @desc Percent chance to roll a random prefix affix when the slot is not blocked and no override applies.
 * @default 8
 *
 * @param default-suffix-chance
 * @parent parentConfigPassiveAbs
 * @type number
 * @decimals 2
 * @min 0
 * @max 100
 * @text Default Suffix Affix Chance
 * @desc Percent chance to roll a random suffix affix when the slot is not blocked and no override applies.
 * @default 8
 */
//endregion annotations

//region plugin metadata
class JPassiveAbs_PluginMetadata
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

    // pull defaults from the plugin manager so designers can tune without touching code.
    this.initializeMetadata();
  }

  /**
   * Parses the plugin parameters and assigns them to the metadata.
   */
  initializeMetadata()
  {
    /**
     * The default chance for a prefix to be applied.
     * @type {number}
     */
    this.defaultPrefixChance = parseFloat(this.parsedPluginParameters['default-prefix-chance']);

    /**
     * The default chance for a suffix to be applied.
     * @type {number}
     */
    this.defaultSuffixChance = parseFloat(this.parsedPluginParameters['default-suffix-chance']);
  }

  /**
   * Initializes the state affix weight totals and maps.
   */
  initializeStateAffixWeights()
  {
    /**
     * The total weight of all prefixes.
     * @type {number}
     */
    this.totalPrefixWeight = 0;

    /**
     * The total weight of all suffixes.
     * @type {number}
     */
    this.totalSuffixWeight = 0;

    /**
     * The collection of key=id,value=weight for all states and their prefix weights found in the database.
     * @type {Map<number, number>}
     */
    this.prefixMap = new Map();

    /**
     * The collection of key=id,value=weight for all states and their suffix weights found in the database.
     * @type {Map<number, number>}
     */
    this.suffixMap = new Map();

    // iterate through all states.
    $dataStates.forEach(state =>
    {
      // first entry is always null.
      if (!state) return;

      // check if the state is a prefix.
      if (state.isEnemyPrefix)
      {
        // add the weight and capture the prefix.
        this.totalPrefixWeight += state.affixWeight;
        this.prefixMap.set(state.id, state.affixWeight);
      }

      // check if the state is a suffix.
      if (state.isEnemySuffix)
      {
        // add the weight and capture the suffix.
        this.totalSuffixWeight += state.affixWeight;
        this.suffixMap.set(state.id, state.affixWeight);
      }
    });
  }

  /**
   * Determines if the provided state id is an affix state.
   * @param {number} stateId The state id to check.
   * @returns {boolean} True if the state is a prefix or suffix, false otherwise.
   */
  isAffixStateId(stateId)
  {
    return this.prefixMap.has(stateId) || this.suffixMap.has(stateId);
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
J.PASSIVE.EXT.ABS = {};

/**
 * The metadata associated with this plugin.
 */
J.PASSIVE.EXT.ABS.Metadata = new JPassiveAbs_PluginMetadata('J-Passive-ABS', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.PASSIVE.EXT.ABS.Aliased = {};
J.PASSIVE.EXT.ABS.Aliased.JABS_AiManager = new Map();
J.PASSIVE.EXT.ABS.Aliased.JABS_Battler = new Map();
J.PASSIVE.EXT.ABS.Aliased.Scene_Boot = new Map();
J.PASSIVE.EXT.ABS.Aliased.Sprite_Character = new Map();
J.PASSIVE.EXT.ABS.Aliased.Window_PassiveDetail = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.PASSIVE.EXT.ABS.RegExp = {};

// on states.
J.PASSIVE.EXT.ABS.RegExp.Prefix = /<enemy-prefix>/i;
J.PASSIVE.EXT.ABS.RegExp.Suffix = /<enemy-suffix>/i;
J.PASSIVE.EXT.ABS.RegExp.Weight = /<affix-weight:([1-9]\d*)>/i;
J.PASSIVE.EXT.ABS.RegExp.TierColorHex = /<tier-color-hex:(#[0-9A-F]{6})>/i;

// on enemies (and event comments for the same tags).
J.PASSIVE.EXT.ABS.RegExp.NoRngPassives = /<no-rng-passives>/i;
J.PASSIVE.EXT.ABS.RegExp.NoRngPassivePrefixes = /<no-rng-passive-prefixes>/i;
J.PASSIVE.EXT.ABS.RegExp.NoRngPassiveSuffixes = /<no-rng-passive-suffixes>/i;

// on enemies and event comments — last tag wins when multiple appear on the event page.
J.PASSIVE.EXT.ABS.RegExp.PassiveAffixPrefixChance = /<passive-affix-prefix-chance:[ ]?([+-]?\d+(?:\.\d+)?)>/i;
J.PASSIVE.EXT.ABS.RegExp.PassiveAffixSuffixChance = /<passive-affix-suffix-chance:[ ]?([+-]?\d+(?:\.\d+)?)>/i;

//region helpers
/**
 * A collection of helper methods for this plugin.
 */
J.PASSIVE.EXT.ABS.Helpers = {};

/**
 * Resolves map/HUD tier stripe tint from the first enemy-prefix passive state on the battler.
 * Callers assign the result to {@link JABS_BattlerName#colorHex} (or HUD fields) when non-empty.
 * @param {Game_Battler} battler Source battler; only enemies participate.
 * @returns {string} Stripe hex, or {@link String.empty} when none applies.
 */
J.PASSIVE.EXT.ABS.Helpers.resolvePassiveTierStripeColorHex = function(battler)
{
  // only enemies carry the passive tier bands we use for the stripe; everyone else is a no-op.
  if (!battler || battler.isEnemy() === false) return String.empty;

  // same passive list the rest of the passive stack uses — if it is empty, there is no tier color to resolve.
  const passiveStatesIds = battler.getPassiveStateIds();
  if (passiveStatesIds.length === 0) return String.empty;

  // walk in passive order; the first enemy-prefix state decides the stripe (matches map nameplate + HUD policy).
  for (const passiveStateId of passiveStatesIds)
  {
    const state = battler.state(passiveStateId);
    if (!state) continue;

    // non-prefix passives do not participate in the tier stripe.
    if (state.isEnemyPrefix !== true) continue;

    // only states with an explicit `<tier-color-hex:...>` note participate; no invented defaults.
    if (state.tierColorHex && state.tierColorHex !== String.empty)
    {
      return state.tierColorHex;
    }

    // first prefix state wins even when it has no hex — do not keep scanning for a later prefix.
    break;
  }

  return String.empty;
};
//endregion helpers
//endregion initialization

//region RPG_Enemy
/**
 * Whether or not this enemy is blocked from having passive prefixes.
 * @type {boolean}
 */
Object.defineProperty(
  RPG_Enemy.prototype, 'noRngPrefixes', {
    get()
    {
      return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.ABS.RegExp.NoRngPassivePrefixes);
    }
  },
);

/**
 * Whether or not this enemy is blocked from having passive suffixes.
 * @type {boolean}
 */
Object.defineProperty(
  RPG_Enemy.prototype, 'noRngSuffixes', {
    get()
    {
      return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.ABS.RegExp.NoRngPassiveSuffixes);
    }
  },
);

/**
 * Whether or not this enemy is blocked from random passive affix rolls on both slots.
 * @type {boolean}
 */
Object.defineProperty(
  RPG_Enemy.prototype, 'noRngPassives', {
    get()
    {
      return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.ABS.RegExp.NoRngPassives);
    }
  },
);

/**
 * Optional override for the passive prefix affix roll percent ({@code 0}–{@code 100}) from this enemy's note.
 * @type {number|null}
 */
Object.defineProperty(
  RPG_Enemy.prototype, 'passiveAffixPrefixChance', {
    get()
    {
      return RPGManager.getNumberFromNoteByRegex(
        this,
        J.PASSIVE.EXT.ABS.RegExp.PassiveAffixPrefixChance,
        true
      );
    }
  },
);

/**
 * Optional override for the passive suffix affix roll percent ({@code 0}–{@code 100}) from this enemy's note.
 * @type {number|null}
 */
Object.defineProperty(
  RPG_Enemy.prototype, 'passiveAffixSuffixChance', {
    get()
    {
      return RPGManager.getNumberFromNoteByRegex(
        this,
        J.PASSIVE.EXT.ABS.RegExp.PassiveAffixSuffixChance,
        true
      );
    }
  },
);
//endregion RPG_Enemy

//region RPG_State
/**
 * Whether or not this state is flagged as an enemy prefix state.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, 'isEnemyPrefix', {
  get()
  {
    return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.ABS.RegExp.Prefix);
  },
});

/**
 * Whether or not this state is flagged as an enemy suffix state.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, 'isEnemySuffix', {
  get()
  {
    return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.ABS.RegExp.Suffix);
  },
});

/**
 * The weight of this state for enemy affixes.
 * Defaults to 100 if none is found.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, 'affixWeight', {
  get()
  {
    return RPGManager.getNumberFromNoteByRegex(this, J.PASSIVE.EXT.ABS.RegExp.Weight, true) ?? 100;
  },
});

/**
 * Optional tier stripe / HUD tint hex from {@link J.PASSIVE.EXT.ABS.RegExp.TierColorHex}; absent tag means no color.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, 'tierColorHex', {
  get()
  {
    return RPGManager.getStringFromNoteByRegex(this, J.PASSIVE.EXT.ABS.RegExp.TierColorHex, true);
  }
});
//endregion RPG_State

//region JABS_AiManager
/**
 * True when prefix affix RNG is blocked for this spawn (enemy note or event comments).
 * @param {Game_Event} character Spawning map event.
 * @param {RPG_Enemy} enemyData Database enemy row.
 * @returns {boolean}
 */
JABS_AiManager.shouldBlockPassivePrefixRng = function(character, enemyData)
{
  // database-level master switch: both affix slots refuse RNG when this tag is present.
  if (enemyData.noRngPassives) return true;

  // if the enemy says no prefixes, then we should block.
  if (enemyData.noRngPrefixes) return true;

  // if the event disables prefixes, then we should block.
  if (character.eventCommentsDisablePassiveAffixPrefixRng()) return true;

  // no blocking!
  return false;
};

/**
 * True when suffix affix RNG is blocked for this spawn (enemy note or event comments).
 * @param {Game_Event} character Spawning map event.
 * @param {RPG_Enemy} enemyData Database enemy row.
 * @returns {boolean}
 */
JABS_AiManager.shouldBlockPassiveSuffixRng = function(character, enemyData)
{
  // same master switch as prefix — one tag on the enemy row turns off both random affix pools.
  if (enemyData.noRngPassives) return true;

  // if the enemy says no suffixes, then we should block.
  if (enemyData.noRngSuffixes) return true;

  // if the event disables suffixes, then we should block.
  if (character.eventCommentsDisablePassiveAffixSuffixRng()) return true;

  // no blocking!
  return false;
};

/**
 * Extends {@link #postConvertMutate}.<br/>
 * Also adds the event source to the battler.
 * @param {Game_Enemy} battler The enemy battler that was converted from the event.
 * @param {JABS_Battler} jabsBattler The created JABS battler from the event.
 */
J.PASSIVE.EXT.ABS.Aliased.JABS_AiManager.set('postConvertMutate', JABS_AiManager.postConvertMutate);
JABS_AiManager.postConvertMutate = function(battler, jabsBattler)
{
  // perform original logic.
  J.PASSIVE.EXT.ABS.Aliased.JABS_AiManager.get('postConvertMutate')
    .call(this, battler, jabsBattler);

  // grab the spawning map event and passive state ids from its comments.
  const character = jabsBattler.getCharacter();
  const passiveStateIds = character.getPassiveStateIds();

  // check if the enemy has any explicit affixes.
  const hasExplicitPassives = passiveStateIds.length > 0;
  const hasExplicitAffixes = hasExplicitPassives && passiveStateIds
    .some(id => J.PASSIVE.EXT.ABS.Metadata.isAffixStateId(id));

  // check if the event had any explicit state ids.
  if (hasExplicitAffixes)
  {
    // add the passives to the battler.
    battler.addPassiveStateExternalSourceByStateIds(passiveStateIds);

    // stop processing because explicit affixes take precedence over random.
    return;
  }

  // capture the enemy data.
  const enemyData = battler.enemy();

  // resolve gating from event comments, enemy note, then plugin defaults.
  const prefixChance = character.getResolvedPassiveAffixPrefixChance(enemyData);
  const suffixChance = character.getResolvedPassiveAffixSuffixChance(enemyData);

  const canApplyPrefix = JABS_AiManager.shouldBlockPassivePrefixRng(character, enemyData) === false &&
    Math.random() * 100 < prefixChance;
  const canApplySuffix = JABS_AiManager.shouldBlockPassiveSuffixRng(character, enemyData) === false &&
    Math.random() * 100 < suffixChance;

  // validate we can apply a prefix.
  if (canApplyPrefix)
  {
    // pick a prefix at random.
    const prefixStateId = RPGManager.weightedMapChoice(
      J.PASSIVE.EXT.ABS.Metadata.prefixMap,
      J.PASSIVE.EXT.ABS.Metadata.totalPrefixWeight
    );

    // add the prefix to the list of passive state ids when the pool produced a choice.
    if (prefixStateId !== null)
    {
      passiveStateIds.push(prefixStateId);
    }
  }

  // validate we can apply a suffix.
  if (canApplySuffix)
  {
    // pick a suffix at random.
    const suffixStateId = RPGManager.weightedMapChoice(
      J.PASSIVE.EXT.ABS.Metadata.suffixMap,
      J.PASSIVE.EXT.ABS.Metadata.totalSuffixWeight
    );

    // add the suffix to the list of passive state ids when the pool produced a choice.
    if (suffixStateId !== null)
    {
      passiveStateIds.push(suffixStateId);
    }
  }

  // add the passives to the battler.
  battler.addPassiveStateExternalSourceByStateIds(passiveStateIds);
};
//endregion JABS_AiManager

//region JABS_Battler
/**
 * With {@link J.HUD.EXT.TARGET}, wraps {@link JABS_Battler#buildFramedTarget}: tier prefix/suffix text, icons,
 * optional {@link Window_Base#colorizeText} (same passive id bands as the map stripe).
 */
if (J.HUD && J.HUD.EXT.TARGET)
{
  /**
   * Builds {@link FramedTarget} for the HUD, then applies tier label text, icons, and optional color.
   * @param {JABS_Battler} battlerLastHit Last-hit target for this frame.
   * @returns {FramedTarget}
   */
  J.PASSIVE.EXT.ABS.Aliased.JABS_Battler.set('buildFramedTarget', JABS_Battler.prototype.buildFramedTarget);
  JABS_Battler.prototype.buildFramedTarget = function(battlerLastHit)
  {
    // perform original logic (HUD fills name, notes text, icon slot, gauge config).
    const framedTarget = J.PASSIVE.EXT.ABS.Aliased.JABS_Battler.get('buildFramedTarget')
      .call(this, battlerLastHit);

    // layer passive tier presentation on top of whatever the HUD decided the base name should be.
    this.applyPassiveTierTargetFrameDecoration(framedTarget, battlerLastHit);

    // derive the same stripe hex the map uses, then tint the HUD name row to match the stripe.
    const tierStripeHex = J.PASSIVE.EXT.ABS.Helpers.resolvePassiveTierStripeColorHex(battlerLastHit.getBattler());

    if (ColorManager.isValidHexColor(tierStripeHex))
    {
      framedTarget.nameColorHex = tierStripeHex;
    }

    return framedTarget;
  };

  /**
   * Mutates {@link FramedTarget#name}: tier words, up to two `\\I` escapes, optional {@link Window_Base#colorizeText}.
   * @param {FramedTarget} framedTarget HUD row to update in place.
   * @param {JABS_Battler} battlerLastHit Source for passive state ids.
   */
  JABS_Battler.prototype.applyPassiveTierTargetFrameDecoration = function(framedTarget, battlerLastHit)
  {
    // the target frame only decorates enemies that participate in passive tier bands.
    if (battlerLastHit.isEnemy() === false) return;

    // grab the underlying RPG Maker battler (event-driven enemy).
    const battler = battlerLastHit.getBattler();

    // grab all passive state ids currently on the battler.
    const passiveStatesIds = battler.getPassiveStateIds();

    // if there are no passive states, there is nothing tier-related to express in the HUD.
    if (passiveStatesIds.length === 0) return;

    // if none of the passive states participate in either prefix/suffix affix pool, leave the HUD name alone.
    const hasAnyAffix = passiveStatesIds.some(passiveStateId =>
    {
      const state = battler.state(passiveStateId);
      if (!state) return false;
      return state.isEnemyPrefix === true || state.isEnemySuffix === true;
    });

    if (hasAnyAffix === false) return;

    // walk passive state order so the first qualifying prefix/suffix wins (same policy as the old map nameplate).
    let foundPrefix = false;
    let foundSuffix = false;
    let prefixIconIndex = null;
    let suffixIconIndex = null;

    // when the tier hex is meaningful, tint the label to the nearest windowskin palette match (icons stay un-tinted).
    let prefixTierHudMessageColorIndex = null;

    let displayName = framedTarget.name;

    for (const passiveStateId of passiveStatesIds)
    {
      const state = battler.state(passiveStateId);

      if (!state) continue;

      // apply at most one tier prefix (state name before the enemy name).
      if (state.isEnemyPrefix === true && foundPrefix === false)
      {
        // prepend the tier state's name before whatever the HUD already chose as the visible name.
        displayName = `${state.name} ${displayName}`;

        // remember which icon to draw beside the label (Window_Base understands \\I[n] escapes).
        prefixIconIndex = state.iconIndex;

        // palette index only when the state note actually defined a tier hex (no tag => no HUD tint span).
        if (state.tierColorHex)
        {
          prefixTierHudMessageColorIndex = ColorManager.colorIndexFromHex(state.tierColorHex);
        }

        // flag that we already consumed the prefix slot.
        foundPrefix = true;
      }

      // apply at most one tier suffix ("of <tier>").
      if (state.isEnemySuffix === true && foundSuffix === false)
      {
        // append the classic "of <state>" suffix after the enemy label.
        displayName = `${displayName} of ${state.name}`;

        // second icon slot (still drawn to the left of the text because escapes lead the string).
        suffixIconIndex = state.iconIndex;

        // flag that we already consumed the suffix slot.
        foundSuffix = true;
      }

      // if we have both a prefix and a suffix, we can stop scanning passive states.
      if (foundPrefix === true && foundSuffix === true) break;
    }

    // build optional icon escapes (two icons max: prefix tier, then suffix tier).
    let iconEscapes = String.empty;

    if (prefixIconIndex !== null)
    {
      iconEscapes += `\\I[${prefixIconIndex}]`;
    }

    if (suffixIconIndex !== null)
    {
      iconEscapes += `\\I[${suffixIconIndex}]`;
    }

    // label body; may gain colorizeText (\\C…\\C[0]) when the tier note sets a palette index.
    let labeledBody = displayName;

    if (J.MESSAGE && prefixTierHudMessageColorIndex !== null)
    {
      // \\C[n] + \\C[0] so the default name color returns after this span.
      labeledBody = Window_Base.prototype.colorizeText(prefixTierHudMessageColorIndex, displayName);
    }

    // icons first, then label; drawTextEx consumes the escapes in one pass.
    framedTarget.name = `${iconEscapes}${labeledBody}`;
  };
}
//endregion JABS_Battler

//region Game_Event
/**
 * Reads the last {@link J.PASSIVE.EXT.ABS.RegExp.PassiveAffixPrefixChance} tag from this page's comment commands.
 * @returns {number|null} Parsed chance, or null when no tag is present.
 */
Game_Event.prototype.getPassiveAffixPrefixChanceFromEventComments = function()
{
  // last matching tag on this page wins — designers author comments top-to-bottom and the final line is authoritative.
  let chance = null;
  const regex = J.PASSIVE.EXT.ABS.RegExp.PassiveAffixPrefixChance;

  this.getValidCommentCommands()
    .forEach(command =>
    {
      const [ comment, ] = command.parameters;

      // reset before each exec so we do not carry state across unrelated comment lines.
      regex.lastIndex = 0;
      const regexResult = regex.exec(comment);

      if (regexResult === null) return;

      chance = parseFloat(regexResult[1]);
    });

  return chance;
};

/**
 * Reads the last {@link J.PASSIVE.EXT.ABS.RegExp.PassiveAffixSuffixChance} tag from this page's comment commands.
 * @returns {number|null} Parsed chance, or null when no tag is present.
 */
Game_Event.prototype.getPassiveAffixSuffixChanceFromEventComments = function()
{
  // last matching tag on this page wins — designers author comments top-to-bottom and the final line is authoritative.
  let chance = null;
  const regex = J.PASSIVE.EXT.ABS.RegExp.PassiveAffixSuffixChance;

  this.getValidCommentCommands()
    .forEach(command =>
    {
      const [ comment, ] = command.parameters;

      // reset before each exec so we do not carry state across unrelated comment lines.
      regex.lastIndex = 0;
      const regexResult = regex.exec(comment);

      if (regexResult === null) return;

      chance = parseFloat(regexResult[1]);
    });

  return chance;
};

/**
 * True when any comment on this page contains {@link J.PASSIVE.EXT.ABS.RegExp.NoRngPassivePrefixes}.
 * @returns {boolean}
 */
Game_Event.prototype.eventCommentsDisablePassiveAffixPrefixRng = function()
{
  // one blocking tag anywhere on the page is enough — the spawn should not roll prefix affixes at all.
  let blocks = false;

  this.getValidCommentCommands()
    .forEach(command =>
    {
      const [ comment, ] = command.parameters;

      if (J.PASSIVE.EXT.ABS.RegExp.NoRngPassivePrefixes.test(comment))
      {
        blocks = true;
      }
    });

  return blocks;
};

/**
 * True when any comment on this page contains {@link J.PASSIVE.EXT.ABS.RegExp.NoRngPassiveSuffixes}.
 * @returns {boolean}
 */
Game_Event.prototype.eventCommentsDisablePassiveAffixSuffixRng = function()
{
  // parallel to prefix blocking — suffix pools can be turned off independently per spawn point.
  let blocks = false;

  this.getValidCommentCommands()
    .forEach(command =>
    {
      const [ comment, ] = command.parameters;

      if (J.PASSIVE.EXT.ABS.RegExp.NoRngPassiveSuffixes.test(comment))
      {
        blocks = true;
      }
    });

  return blocks;
};

/**
 * Effective prefix affix roll gate for this spawn: event comment overrides enemy note, then plugin default.
 * @param {RPG_Enemy} enemyData Database enemy row for the spawned troop member.
 * @returns {number} The percent chance of the roll.
 */
Game_Event.prototype.getResolvedPassiveAffixPrefixChance = function(enemyData)
{
  // map event layer: this page can override the database row for this specific spawn.
  const eventOverride = this.getPassiveAffixPrefixChanceFromEventComments();
  if (eventOverride !== null)
  {
    return parseFloat(eventOverride).clamp(0, 100);
  }

  // enemy note field from the hydrated RPG_Enemy when the event did not supply a usable override.
  const enemyOverride = enemyData.passiveAffixPrefixChance;
  if (enemyOverride !== null)
  {
    return parseFloat(enemyOverride)
      .clamp(0, 100);
  }

  // fall back to the J-Passive-ABS plugin default parameter.
  return J.PASSIVE.EXT.ABS.Metadata.defaultPrefixChance;
};

/**
 * Effective suffix affix roll gate for this spawn: event comment overrides enemy note, then plugin default.
 * @param {RPG_Enemy} enemyData Database enemy row for the spawned troop member.
 * @returns {number} The percent chance of the roll.
 */
Game_Event.prototype.getResolvedPassiveAffixSuffixChance = function(enemyData)
{
  // check if there is an event-level override for this enemy.
  const eventOverride = this.getPassiveAffixSuffixChanceFromEventComments();
  if (eventOverride !== null)
  {
    // clamp only after we coerce to a real finite number — never pass null/NaN into Number#clamp.
    return parseFloat(eventOverride)
      .clamp(0, 100);
  }

  // check if there was an enemy default to fallback to.
  const enemyOverride = enemyData.passiveAffixSuffixChance;
  if (enemyOverride !== null)
  {
    return parseFloat(enemyOverride)
      .clamp(0, 100);

  }

  // fall back to the J-Passive-ABS plugin default parameter for suffix chance.
  return J.PASSIVE.EXT.ABS.Metadata.defaultSuffixChance;
};
//endregion Game_Event

//region Scene_Boot
/**
 * Extends {@link #onDatabaseLoaded}.<br/>
 * Initializes the passive state affix weights for JABS map enemies.
 * The passive detail window's JABS sections are provided directly by
 * Window_PassiveDetail in this extension — no contributor registration needed.
 */
J.PASSIVE.EXT.ABS.Aliased.Scene_Boot.set('onDatabaseLoaded', Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function()
{
  // perform original logic.
  J.PASSIVE.EXT.ABS.Aliased.Scene_Boot.get('onDatabaseLoaded').call(this);

  // initialize the state affix weights used by the JABS enemy affix system.
  J.PASSIVE.EXT.ABS.Metadata.initializeStateAffixWeights();
};
//endregion Scene_Boot

//region Sprite_Character
/**
 * Extends {@link #getBattlerName}.<br/>
 * Considers passive tier states for {@link JABS_BattlerName#colorHex} (map stripe).
 * Tier label copy is composed in the HUD target frame.
 * @returns {JABS_BattlerName}
 */
J.PASSIVE.EXT.ABS.Aliased.Sprite_Character.set('getBattlerName', Sprite_Character.prototype.getBattlerName);
Sprite_Character.prototype.getBattlerName = function()
{
  // perform original logic.
  /** @type {JABS_BattlerName} */
  const battlerName = J.PASSIVE.EXT.ABS.Aliased.Sprite_Character.get('getBattlerName')
    .call(this);

  // apply passive tier accent for the map nameplate stripe.
  this.applyPassiveMapTierAccent(battlerName);

  // return the updated name.
  return battlerName;
};

/**
 * Sets {@link JABS_BattlerName#colorHex} from the first tier-prefix passive state.
 * Map stripe and HUD may reuse the same field for tinting.
 * @param {JABS_BattlerName} battlerName The battler's name.
 */
Sprite_Character.prototype.applyPassiveMapTierAccent = function(battlerName)
{
  // if there is no battler, or this isn't an enemy map nameplate use-case, don't worry about the color.
  if (this.canApplyPassiveMapTierAccent() === false) return;

  // grab the battler.
  const battler = this.getBattler();

  // share the exact same tier-prefix → tierColorHex rule as the HUD target frame (see J.PASSIVE.EXT.ABS).
  const tierStripeHex = J.PASSIVE.EXT.ABS.Helpers.resolvePassiveTierStripeColorHex(battler);

  // only touch the name bag when we actually resolved a stripe color (pure helper returns empty otherwise).
  if (tierStripeHex !== String.empty)
  {
    battlerName.colorHex = tierStripeHex;
  }
};

/**
 * Determines whether or not passive map tier accent should be considered for this sprite.
 * @returns {boolean} True if the battler name color may be modified, false otherwise.
 */
Sprite_Character.prototype.canApplyPassiveMapTierAccent = function()
{
  // grab the battler.
  const battler = this.getBattler();

  // if there is no battler, don't worry about the name.
  if (!battler) return false;

  // if the battler isn't an enemy, then don't worry about the name.
  if (battler.isEnemy() === false) return false;

  return true;
};
//endregion Sprite_Character

//region Window_PassiveDetail
/**
 * Extends {@link Window_PassiveDetail#drawCombatSection}.<br/>
 * Injects JABS combat, shield, and stacking sections into the passive detail
 * window. These draw before the core sections so combat effects appear first.
 * All methods read and advance {@link Window_PassiveDetail#currentY} directly —
 * no y threading through method signatures.
 */
J.PASSIVE.EXT.ABS.Aliased.Window_PassiveDetail.set(
  'drawCombatSection',
  Window_PassiveDetail.prototype.drawCombatSection);
Window_PassiveDetail.prototype.drawCombatSection = function(state)
{
  // perform original logic (core stub — no-op).
  J.PASSIVE.EXT.ABS.Aliased.Window_PassiveDetail
    .get('drawCombatSection')
    .call(this, state);

  // draw JABS combat effects: ailments, slip, modifiers, timing extensions.
  this.drawJabsCombatSection(state);

  // draw JABS shield data when J-ABS-Ext-Shield is loaded.
  this.drawJabsShieldSection(state);

  // draw JABS reapplication / stacking config when present.
  this.drawJabsStackingSection(state);
};

/**
 * Draws the JABS Combat section.
 * Skipped when the state has no JABS combat content.
 * @param {RPG_State} state The state being detailed.
 */
Window_PassiveDetail.prototype.drawJabsCombatSection = function(state)
{
  const rows = this.collectJabsCombatRows(state);
  if (rows.length === 0) return;

  this.drawDetailSectionHeader('Combat');

  rows.forEach(({ icon, label, value }) =>
  {
    this.drawDetailRow(icon, label, value);
  });
};

/**
 * Collects all JABS combat display rows for the given state.
 * Delegates to focused sub-collectors to stay within complexity limits.
 * @param {RPG_State} state The state to check.
 * @returns {Array<{icon: number, label: string, value: string}>}
 */
Window_PassiveDetail.prototype.collectJabsCombatRows = function(state)
{
  const rows = [];

  // status ailments and slip damage/regen.
  rows.push(...this.collectJabsAilmentRows(state));

  // aggro, offhand, vision, retaliation, bonus hits, speed, gap close.
  rows.push(...this.collectJabsModifierRows(state));

  // cast time, cooldown, on-cast state, duration formula.
  rows.push(...this.collectJabsTimingRows(state));

  return rows;
};

/**
 * Collects JABS ailment and slip rows for the given state.
 * Covers the five status ailment flags and HP/MP/TP slip (percent or formula).
 * @param {RPG_State} state The state to check.
 * @returns {Array<{icon: number, label: string, value: string}>}
 */
Window_PassiveDetail.prototype.collectJabsAilmentRows = function(state)
{
  const rows = [];

  // status ailments: boolean constraint flags.
  if (state.jabsParalyzed) rows.push({ icon: 0, label: 'Paralyzed', value: '(rooted + muted + disabled)' });
  if (state.jabsRooted)    rows.push({ icon: 0, label: 'Rooted',    value: '(cannot move)' });
  if (state.jabsMuted)     rows.push({ icon: 0, label: 'Muted',     value: '(no cast skills)' });
  if (state.jabsDisarmed)  rows.push({ icon: 0, label: 'Disabled',  value: '(no basic attack)' });
  if (state.jabsNegative)  rows.push({ icon: 0, label: 'Negative',  value: '(AI tries to remove)' });

  // slip damage/regen — percent-based takes priority over formula-based.
  const slipHpPct  = state.jabsSlipHpPercentPerFive;
  const slipMpPct  = state.jabsSlipMpPercentPerFive;
  const slipTpPct  = state.jabsSlipTpPercentPerFive;
  const slipHpForm = state.jabsSlipHpFormulaPerFive;
  const slipMpForm = state.jabsSlipMpFormulaPerFive;
  const slipTpForm = state.jabsSlipTpFormulaPerFive;

  // percent-based values are already a plain number; formula-based values are evaluated
  // against the current actor so the player sees an actual quantity, not raw code.
  if (slipHpPct)
  {
    rows.push({ icon: 0, label: 'HP Slip', value: `${slipHpPct}% / 5s` });
  }
  else if (slipHpForm)
  {
    rows.push({ icon: 0, label: 'HP Slip', value: `${this.evaluateFormula(slipHpForm, this._actor)} / 5s` });
  }

  if (slipMpPct)
  {
    rows.push({ icon: 0, label: 'MP Slip', value: `${slipMpPct}% / 5s` });
  }
  else if (slipMpForm)
  {
    rows.push({ icon: 0, label: 'MP Slip', value: `${this.evaluateFormula(slipMpForm, this._actor)} / 5s` });
  }

  if (slipTpPct)
  {
    rows.push({ icon: 0, label: 'TP Slip', value: `${slipTpPct}% / 5s` });
  }
  else if (slipTpForm)
  {
    rows.push({ icon: 0, label: 'TP Slip', value: `${this.evaluateFormula(slipTpForm, this._actor)} / 5s` });
  }

  return rows;
};

/**
 * Collects JABS battler-modifier rows for the given state.
 * Covers aggro, offhand skill, vision, retaliation, bonus hits (three scopes),
 * parry ignore, speed boost (ext-speed), and gap-close target (ext-tools).
 * @param {RPG_State} state The state to check.
 * @returns {Array<{icon: number, label: string, value: string}>}
 */
Window_PassiveDetail.prototype.collectJabsModifierRows = function(state)
{
  const rows = [];

  // aggro — threat scaling multiplier.
  const aggroOut = state.jabsAggroOutAmp;
  if (aggroOut) rows.push({ icon: 0, label: 'Aggro Out', value: `x${aggroOut}` });

  // offhand skill override.
  const offhandId = state.jabsOffhandSkillId;
  if (offhandId)
  {
    const skill = $dataSkills[offhandId];
    rows.push({
      icon: skill ? skill.iconIndex : 0,
      label: 'Offhand',
      value: skill ? skill.name : `Skill #${offhandId}`,
    });
  }

  // vision range modifier.
  const visionMult = RPGManager.getNumberFromNoteByRegex(state, J.ABS.RegExp.VisionMultiplier);
  if (visionMult)
  {
    const sign = visionMult > 0 ? '+' : '';
    rows.push({ icon: 0, label: 'Vision', value: `${sign}${visionMult}%` });
  }

  // retaliation: skill + chance on being struck.
  const retaliateData = RPGManager.getNumbersFromNoteByRegex(state, J.ABS.RegExp.Retaliate);
  if (retaliateData && retaliateData.length >= 2)
  {
    const [retSkillId, retChance] = retaliateData;
    const retSkill = $dataSkills[retSkillId];
    rows.push({
      icon: retSkill ? retSkill.iconIndex : 0,
      label: 'Retaliate',
      value: `${retSkill ? retSkill.name : `Skill #${retSkillId}`} at ${retChance}%`,
    });
  }

  // bonus hits (three scope variants).
  const bonusGlobal = state.jabsBonusHitsScopeGlobal;
  const bonusBasic  = state.jabsBonusHitsScopeBasic;
  const bonusSkill  = state.jabsBonusHitsScopeSkill;
  if (bonusGlobal) rows.push({ icon: 0, label: 'Bonus Hits (all)',    value: `+${bonusGlobal}` });
  if (bonusBasic)  rows.push({ icon: 0, label: 'Bonus Hits (basic)',  value: `+${bonusBasic}` });
  if (bonusSkill)  rows.push({ icon: 0, label: 'Bonus Hits (skills)', value: `+${bonusSkill}` });

  // parry ignore — bearer's attacks bypass the target's guard.
  const ignoresParry = RPGManager.checkForBooleanFromNoteByRegex(state, J.ABS.RegExp.Unparryable);
  if (ignoresParry) rows.push({ icon: 0, label: 'Ignore Parry', value: '' });

  // movement speed boost from J-ABS-Ext-Speed.
  if (J.ABS.EXT.SPEED)
  {
    const speedBoost = RPGManager.getNumberFromNoteByRegex(state, J.ABS.EXT.SPEED.RegExp.WalkSpeedBoost);
    if (speedBoost)
    {
      const sign = speedBoost > 0 ? '+' : '';
      rows.push({ icon: 0, label: 'Speed Boost', value: `${sign}${speedBoost}` });
    }
  }

  // gap-close targeting — this battler can be gap-closed to.
  if (J.ABS.EXT.TOOLS)
  {
    const isTarget = RPGManager.checkForBooleanFromNoteByRegex(
      state, J.ABS.EXT.TOOLS.RegExp.GapCloseTarget);
    if (isTarget) rows.push({ icon: 0, label: 'Gap Close Target', value: '' });
  }

  return rows;
};

/**
 * Collects JABS timing and extension rows for the given state.
 * Covers cast time modifiers (ext-timing), cooldown modifiers (ext-timing),
 * on-cast self state (J-Extend), and state duration formula.
 * @param {RPG_State} state The state to check.
 * @returns {Array<{icon: number, label: string, value: string}>}
 */
Window_PassiveDetail.prototype.collectJabsTimingRows = function(state)
{
  const rows = [];

  // cast time and fast cooldown modifiers from J-ABS-Ext-Timing.
  // timing formulas use 'a' (the actor), so evaluate them for a human-readable value.
  if (J.ABS.EXT.TIMING)
  {
    const castFlat = RPGManager.getStringFromNoteByRegex(state, J.ABS.EXT.TIMING.RegExp.CastSpeedFlat);
    if (castFlat)
    {
      rows.push({ icon: 0, label: 'Cast Time Flat', value: `${this.evaluateFormula(castFlat, this._actor)}` });
    }

    const castRate = RPGManager.getStringFromNoteByRegex(state, J.ABS.EXT.TIMING.RegExp.CastSpeedRate);
    if (castRate)
    {
      rows.push({ icon: 0, label: 'Cast Time Rate', value: `${this.evaluateFormula(castRate, this._actor)}%` });
    }

    const cdFlat = RPGManager.getStringFromNoteByRegex(state, J.ABS.EXT.TIMING.RegExp.FastCooldownFlat);
    if (cdFlat)
    {
      rows.push({ icon: 0, label: 'Cooldown Flat', value: `${this.evaluateFormula(cdFlat, this._actor)}` });
    }

    const cdRate = RPGManager.getStringFromNoteByRegex(state, J.ABS.EXT.TIMING.RegExp.FastCooldownRate);
    if (cdRate)
    {
      rows.push({ icon: 0, label: 'Cooldown Rate', value: `${this.evaluateFormula(cdRate, this._actor)}%` });
    }
  }

  // on-cast self state from J-Extend.
  if (J.EXTEND)
  {
    const onCastData = RPGManager.getNumbersFromNoteByRegex(state, J.EXTEND.RegExp.OnCastSelfState);
    if (onCastData && onCastData.length >= 2)
    {
      const [castStateId, castChance] = onCastData;
      const castState = $dataStates[castStateId];
      rows.push({
        icon: castState ? castState.iconIndex : 0,
        label: 'On Cast',
        value: `${castState ? castState.name : `State #${castStateId}`} at ${castChance}%`,
      });
    }
  }

  // state duration formula modifier — 'a' is the applying actor; evaluate to show multiplier.
  const durationForm = RPGManager.getStringFromNoteByRegex(state, J.ABS.RegExp.StateDurationFormulaPlus);
  if (durationForm)
  {
    rows.push({ icon: 0, label: 'Duration', value: `x${this.evaluateFormula(durationForm, this._actor)}` });
  }

  return rows;
};

/**
 * Draws the JABS Shield section when J-ABS-Ext-Shield is loaded and the state
 * has shield-related tags. Skipped otherwise.
 * @param {RPG_State} state The state being detailed.
 */
Window_PassiveDetail.prototype.drawJabsShieldSection = function(state)
{
  // ext-shield isn't loaded; nothing to show.
  if (!J.ABS.EXT.SHIELD) return;

  const rows = [];

  // shield points derived from a formula — evaluated as self vs. self since the bearer
  // of a permanent passive state is both the acting and target battler.
  const shieldFormula = RPGManager.getStringFromNoteByRegex(
    state, J.ABS.EXT.SHIELD.RegExp.ShieldPointsFormula);
  if (shieldFormula)
  {
    rows.push({ icon: 0, label: 'Shield', value: `${this.evaluateFormula(shieldFormula, this._actor)}` });
  }

  // protect mode prevents overflow damage on shield break.
  const shieldProtect = RPGManager.checkForBooleanFromNoteByRegex(
    state, J.ABS.EXT.SHIELD.RegExp.Protect);
  if (shieldProtect) rows.push({ icon: 0, label: 'Shield Protect', value: '(no overflow dmg)' });

  if (rows.length === 0) return;

  this.drawDetailSectionHeader('Shield');

  rows.forEach(({ icon, label, value }) =>
  {
    this.drawDetailRow(icon, label, value);
  });
};

/**
 * Draws the JABS Stacking section when the state has a reapplication type.
 * Shows the stack type and its sub-settings (extend amount/cap or max stacks).
 * Skipped when no reapplication type is defined on the state.
 * @param {RPG_State} state The state being detailed.
 */
Window_PassiveDetail.prototype.drawJabsStackingSection = function(state)
{
  const reapplyType = state.jabsStateReapplyType;
  if (!reapplyType) return;

  this.drawDetailSectionHeader('Stacking');

  this.drawDetailRow(0, 'Stack Type', reapplyType);

  if (reapplyType === 'extend')
  {
    const extendAmt = state.jabsStateExtendAmount;
    const extendMax = state.jabsStateExtendMax;
    this.drawDetailRow(0, 'Extend Amount', `${extendAmt}f`);
    if (extendMax) this.drawDetailRow(0, 'Extend Cap', `${extendMax}f`);
  }

  if (reapplyType === 'stack')
  {
    this.drawDetailRow(0, 'Max Stacks',     `${state.jabsStateStackMax}`);
    this.drawDetailRow(0, 'Stacks Applied', `${state.jabsStateStacksApplied}`);
    if (state.jabsLoseAllStacksAtOnce) this.drawDetailRow(0, 'Lose All Stacks At Once', '');
  }
};
//endregion Window_PassiveDetail

//# sourceMappingURL=J-Passive-ABS.js.map
