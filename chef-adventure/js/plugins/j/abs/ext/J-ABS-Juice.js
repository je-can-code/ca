//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 ABS-JUICE] Procedural map battler motion juice for JABS (squish, tilt, casting pulse, weapon swing).
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-InputManager
 * @orderAfter J-ABS-Poses
 * @orderAfter J-ABS-Hitstop
 * @help
 * ============================================================================
 * OVERVIEW
 * J-ABS-Juice layers lightweight procedural motion on map battlers: target hit
 * reactions, caster strike/dodge/heal pulses, casting shimmer, and optional
 * IconSet weapon swing overlays driven by skills or equipped weapons.
 *
 * Load order:
 * Place after J-ABS-InputManager (dodge key binding), J-ABS-Poses (attack poses),
 * and J-ABS-Hitstop (impact timing). Juice wraps engine hooks that chain after
 * those extensions so gameplay semantics stay unchanged.
 *
 * Coexistence with J-ABS-Poses:
 * Poses swap character sheets / patterns for readable attacks. Juice adjusts
 * Pixi scale and rotation on the live Sprite_Character (plus a short IconSet
 * overlay child for swings). Keep juice intensities modest so pose readability
 * stays primary; if a pose plugin ever writes scale each frame, raise juice
 * timings only after verifying the interaction in-game.
 *
 * ============================================================================
 * REQUIRED EXTERNAL CONFIGURATION
 * J-ABS-Juice has NO plugin parameters. All tuning lives in the external JABS
 * configuration file at `data/config.jabs.json`, under a top-level `juice`
 * block. The plugin THROWS at startup when the block (or any required leaf) is
 * missing or malformed — this is intentional. Disabling juice is "remove the
 * plugin from your manifest", not "leave the config block out".
 *
 * Why? Plugin parameters cannot express structured data without becoming
 * fragile JSON-in-a-string blobs, and "juice off when a switch is on" was
 * never a real requirement: developers who do not want juice should just not
 * load the plugin.
 *
 * Required shape (all leaves required; missing keys are loud errors):
 *
 *   {
 *     "teams": [ ... ],
 *     "juice": {
 *       "target": {
 *         "physicalSquishIntensity": 0.12,
 *         "magicalSquishIntensity":  0.08,
 *         "squishFrames":            10,
 *         "healingRecipientScale":   0.65,
 *         "flurryDecayPercent":      72
 *       },
 *       "caster": {
 *         "dodgeSquishIntensity":          0.28,
 *         "dodgeSquishFrames":             12,
 *         "supportPulseIntensity":         0.06,
 *         "supportPulseFrames":            12,
 *         "strikeTiltRadians":             0.18,
 *         "strikeTiltFrames":              6,
 *         "weaponSwingPeakRadians":        0.65,
 *         "weaponSwingFrames":             10,
 *         "spriteVerticalOffsetPixels":    10,
 *         "unarmedStrikeSquishIntensity":  0.14,
 *         "unarmedStrikeSquishFrames":     9
 *       },
 *       "casting": {
 *         "pulseAmplitude": 0.045
 *       },
 *       "profiles": {
 *         "default": { "tiltMul": 1, "swingMul": 1 }
 *       }
 *     }
 *   }
 *
 * Field reference (all values dimensionless unless noted):
 * target.physicalSquishIntensity — scale pulse on physical hits.
 * target.magicalSquishIntensity  — scale pulse on magical hits.
 * target.squishFrames            — frames spent easing the target pulse.
 * target.healingRecipientScale   — multiplier applied when the action heals.
 * target.flurryDecayPercent      — per-repeat damping (1–100) for the same
 *                                  action UUID vs target within a 2-frame window.
 * caster.dodgeSquishIntensity    — caster squish on the dodge cooldown.
 * caster.dodgeSquishFrames       — frames easing the dodge squish.
 * caster.supportPulseIntensity   — caster squish on heal / support actions.
 * caster.supportPulseFrames      — frames easing support pulses.
 * caster.strikeTiltRadians       — peak body tilt for offensive actions (radians).
 * caster.strikeTiltFrames        — frames easing tilt recovery.
 * caster.weaponSwingPeakRadians  — peak overlay rotation for IconSet swings (radians).
 * caster.weaponSwingFrames       — frames the IconSet overlay spends swinging.
 * caster.spriteVerticalOffsetPixels — positive shifts the IconSet overlay down
 *                                     on screen (tall-head chibi sprites often need 8–14).
 * caster.unarmedStrikeSquishIntensity — squish intensity when no IconSet
 *                                       swing plays (icon unresolved).
 * caster.unarmedStrikeSquishFrames    — frames easing unarmed pulses.
 * casting.pulseAmplitude         — continuous shimmer amplitude while
 *                                  {@link JABS_Battler.isCasting} stays true.
 * profiles                       — keyed tilt/swing multiplier rows. Keys
 *                                  match `[A-Za-z0-9_-]+`. Each row needs both
 *                                  `tiltMul` and `swingMul`. A `default` row
 *                                  is mandatory (fallback when a skill's
 *                                  resolved style key has no matching row).
 *
 * Inferred profile keys (when a skill has no `<jabsJuiceWeaponStyle:...>` tag):
 *   - weapons: string weapon type id (example wtypeId 1 → "1").
 *   - armor:   "a" + armor type id  (example atypeId 4 → "a4").
 *
 * ============================================================================
 * SKILL TAGS (notes):
 * <jabsJuiceIcon:N>
 *   Forces weapon swing overlay icon index N on the IconSet sheet (-1 behavior
 *   falls back to inferred equip icon for actors: dual-wield offhand uses weapon slot 2; offhand + one weapon
 *   resolves orb/shield armor by matching skill ids on armor rows or equip slot 1 when it is armor (body armor is
 *   not blindly armors()[0]), unless the executing offhand skill currently belongs to the mainhand's
 *   provided offhand path, including any temporary state-driven transform on that path).
 *
 * <juiceMotion:arc> | arc-reverse | bash | present | recoil | spin | spin-reverse | stab-forward
 *   Weapon overlay preset. Legacy swing-top-down / swing-bottom-up map to arc / arc-reverse.
 *   Legacy spin keys: spin-360 → spin; spin-720 → spin (see juiceSpinCount); spin-360-reverse → spin-reverse.
 *   present lifts the icon upward on screen (screen-stable "brandish" read; placement uses facing-up card).
 *   On healing skills, omitting juiceMotion keeps caster-only support squish; any juiceMotion tag opts into full strike juice.
 *
 * <juiceSpan:N>
 *   Arc span in degrees for arc / arc-reverse (default 120; typical range 30–300).
 *
 * <juiceSpinCount:N>
 *   Full rotations for spin / spin-reverse (default 1; clamped 1–8). Legacy juiceMotion:spin-720 implies 2 when omitted.
 *
 * <juiceStabTipDegrees:N>
 *   Degrees from Pixi +x to bore/tip at rotation 0. Stab defaults to sword diagonal;
 *   bash / recoil default to barrel toward −x unless you override.
 *
 * <juiceProfileGun>
 *   Side-profile firearm icon: mirror east/west instead of ~180° rotation (keeps the grip
 *   from reading upside-down when the art points left). Up/down still use ±90° rotation —
 *   pure side-view art cannot read as true top-down aim; use a separate sprite or tune degrees.
 *
 * <jabsJuiceWeaponStyle:key>
 *   Selects a multiplier row from the `profiles` map in `config.jabs.json` -> `juice`.
 *   Keys are arbitrary identifiers (letters, digits, underscore, dash) and must already
 *   exist in the `profiles` map.
 *   When omitted, inferred keys match the swing icon row: weapon rows use string weapon type ids; armor rows use
 *   a + armor type id (example type 4 → "a4") so armor buckets never collide with weapon type ids.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion annotations

//region plugin metadata
/**
 * Validates a finite float value loaded from the external juice config, throwing on absence / non-finite values.
 * Lives outside {@link JAbsJuice_PluginMetadata} so it is safe while {@link PluginMetadata#initializePlugin}
 * runs {@link JAbsJuice_PluginMetadata#postInitialize} during {@code super()} (subclass private slots are not
 * usable yet).
 *
 * @param {*} raw Raw config value read at a leaf path.
 * @param {string} path Dotted path used in the thrown error (e.g. {@code juice.target.physicalSquishIntensity}).
 * @returns {number}
 */
function jabsJuiceRequireFloat(raw, path)
{
  // an explicit "the key is not there" is treated identically to "the key is junk" — both surface as a misconfig.
  if (raw === undefined || raw === null)
  {
    throw new Error(`[J-ABS-Juice] missing required number at config.jabs.json -> ${path}`);
  }

  // accept JSON numbers as well as numeric strings (config files are author-friendly).
  const parsed = typeof raw === 'number'
    ? raw
    : Number.parseFloat(String(raw));

  if (Number.isFinite(parsed) === false)
  {
    throw new Error(`[J-ABS-Juice] non-finite number at config.jabs.json -> ${path} (got: ${String(raw)})`);
  }

  return parsed;
}

/**
 * Validates a finite integer value loaded from the external juice config, throwing on absence / non-finite values.
 * Truncates any fractional component the same way RMMZ frame counts do.
 *
 * @param {*} raw Raw config value read at a leaf path.
 * @param {string} path Dotted path used in the thrown error (e.g. {@code juice.target.squishFrames}).
 * @returns {number}
 */
function jabsJuiceRequireInt(raw, path)
{
  // share the float path so authors writing "10" (string) vs 10 (number) both work; reject anything non-finite.
  const f = jabsJuiceRequireFloat(raw, path);

  return Math.trunc(f);
}

/**
 * Validates a single weapon-style multiplier row loaded from the external juice config.
 *
 * @param {*} row Unknown JSON row content.
 * @param {string} path Dotted path used in the thrown error (e.g. {@code juice.profiles.default}).
 * @returns {{ tiltMul: number, swingMul: number }}
 */
function jabsJuiceRequireStyleRow(row, path)
{
  // we never accept "row was forgotten"; the multiplier table is supposed to be authored on purpose.
  if (row === undefined || row === null || typeof row !== 'object')
  {
    throw new Error(`[J-ABS-Juice] missing or invalid profile row at config.jabs.json -> ${path}`);
  }

  // both multipliers are required leaves — partial rows would silently change feel without an obvious failure.
  const tiltMul = jabsJuiceRequireFloat(row.tiltMul, `${path}.tiltMul`);
  const swingMul = jabsJuiceRequireFloat(row.swingMul, `${path}.swingMul`);

  return { tiltMul, swingMul };
}

/**
 * Regex used to validate weapon-style profile keys. Matches the plugin's note tag capture: letters, digits,
 * underscore, and hyphen. Kept here so the data editor can mirror it without duplicating constants.
 * @type {RegExp}
 */
const jabsJuiceProfileKeyPattern = /^[a-zA-Z0-9_-]+$/;

/**
 * Validates the `juice.profiles` map, normalizes its rows, and guarantees a `default` row is present.
 *
 * @param {*} profiles Raw `juice.profiles` blob from the external config.
 * @returns {Object<string, { tiltMul: number, swingMul: number }>}
 */
function jabsJuiceRequireProfiles(profiles)
{
  // multiplier table = per-skill / per-weapon "feel" knob; missing it is misconfig, not no-op.
  if (profiles === undefined || profiles === null || typeof profiles !== 'object')
  {
    throw new Error('[J-ABS-Juice] missing required map at config.jabs.json -> juice.profiles');
  }

  // build the runtime lookup table; we keep authoring order via Object.keys for deterministic iteration if ever needed.
  const table = {};
  const keys = Object.keys(profiles);

  for (let i = 0; i < keys.length; i++)
  {
    const key = keys[i];

    // enforce the same charset the note tag accepts so an authored key always matches a notetag lookup.
    if (jabsJuiceProfileKeyPattern.test(key) === false)
    {
      throw new Error(
        `[J-ABS-Juice] invalid profile key "${key}" at config.jabs.json -> juice.profiles `
          + `(allowed: ${jabsJuiceProfileKeyPattern.source})`,
      );
    }

    table[key] = jabsJuiceRequireStyleRow(profiles[key], `juice.profiles.${key}`);
  }

  // `default` is the fallback when a skill's resolved style key has no matching row; it must always exist.
  if (Object.prototype.hasOwnProperty.call(table, 'default') === false)
  {
    throw new Error('[J-ABS-Juice] missing required row at config.jabs.json -> juice.profiles.default');
  }

  return table;
}

/**
 * Validates the entire `juice` block from the external JABS config, throwing on absence or shape problems.
 * Returns the raw block so the caller can extract sub-sections by name without re-walking.
 *
 * @param {*} root The parsed `config.jabs.json` root blob (already loaded by J-ABS).
 * @returns {object}
 */
function jabsJuiceRequireBlock(root)
{
  // the juice block is strictly required: dropping the plugin should be the way to disable juice, not a missing block.
  if (root === undefined || root === null || typeof root !== 'object')
  {
    throw new Error('[J-ABS-Juice] config.jabs.json is missing or unreadable; the juice block cannot be loaded.');
  }

  const { juice } = root;

  if (juice === undefined || juice === null || typeof juice !== 'object')
  {
    throw new Error(
      '[J-ABS-Juice] config.jabs.json is missing the required "juice" block '
        + '(see plugin help for the expected shape).',
    );
  }

  // sub-section presence checks happen here so the per-key errors below can assume their parent object exists.
  if (typeof juice.target !== 'object' || juice.target === null)
  {
    throw new Error('[J-ABS-Juice] config.jabs.json -> juice is missing the required "target" section.');
  }

  if (typeof juice.caster !== 'object' || juice.caster === null)
  {
    throw new Error('[J-ABS-Juice] config.jabs.json -> juice is missing the required "caster" section.');
  }

  if (typeof juice.casting !== 'object' || juice.casting === null)
  {
    throw new Error('[J-ABS-Juice] config.jabs.json -> juice is missing the required "casting" section.');
  }

  return juice;
}

class JAbsJuice_PluginMetadata
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
   *  Loads the juice block from the external JABS config.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize this plugin from external configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin by reading the `juice` block from `config.jabs.json`.
   * Throws if the block (or any required sub-key) is missing — this is intentional and documented in the plugin
   * help. Disabling juice is "remove the plugin from the manifest", not "leave the block out".
   */
  initializeMetadata()
  {
    // J-ABS guarantees the parsed root is on its metadata by the time extensions postInitialize() (orderAfter).
    const juice = jabsJuiceRequireBlock(J.ABS.Metadata.ExternalConfig);

    const { target, caster, casting } = juice;

    /**
     * Target squish intensity scale for physical impacts (dimensionless scale delta).
     * @type {number}
     */
    this.targetPhysicalSquishIntensity = jabsJuiceRequireFloat(
      target.physicalSquishIntensity,
      'juice.target.physicalSquishIntensity'
    );

    /**
     * Target squish intensity scale for magical impacts.
     * @type {number}
     */
    this.targetMagicalSquishIntensity = jabsJuiceRequireFloat(
      target.magicalSquishIntensity,
      'juice.target.magicalSquishIntensity'
    );

    /**
     * Frames to spend easing the target squish envelope.
     * @type {number}
     */
    this.targetSquishFrames = jabsJuiceRequireInt(target.squishFrames, 'juice.target.squishFrames');

    /**
     * Scalar applied to recipient squish when the incoming action is healing.
     * @type {number}
     */
    this.healingRecipientSquishScale = jabsJuiceRequireFloat(
      target.healingRecipientScale,
      'juice.target.healingRecipientScale'
    );

    /**
     * Percent (0–100) describing how strongly repeated hits decay juice amplitude within the flurry window.
     * @type {number}
     */
    this.flurryDecayPercent = jabsJuiceRequireInt(target.flurryDecayPercent, 'juice.target.flurryDecayPercent');

    /**
     * Dodge-only caster squish intensity (cooldown key matches dodge skill).
     * @type {number}
     */
    this.dodgeSquishIntensity = jabsJuiceRequireFloat(caster.dodgeSquishIntensity, 'juice.caster.dodgeSquishIntensity');

    /**
     * Frames for dodge squish easing.
     * @type {number}
     */
    this.dodgeSquishFrames = jabsJuiceRequireInt(caster.dodgeSquishFrames, 'juice.caster.dodgeSquishFrames');

    /**
     * Support/healing caster pulse intensity.
     * @type {number}
     */
    this.supportCasterPulseIntensity = jabsJuiceRequireFloat(
      caster.supportPulseIntensity,
      'juice.caster.supportPulseIntensity'
    );

    /**
     * Frames for support caster easing.
     * @type {number}
     */
    this.supportCasterPulseFrames = jabsJuiceRequireInt(
      caster.supportPulseFrames,
      'juice.caster.supportPulseFrames'
    );

    /**
     * Peak body tilt (radians) applied to strikers at execution time (before style multipliers).
     * @type {number}
     */
    this.casterStrikeTiltRadians = jabsJuiceRequireFloat(caster.strikeTiltRadians, 'juice.caster.strikeTiltRadians');

    /**
     * Frames spent tilting the striker.
     * @type {number}
     */
    this.casterStrikeTiltFrames = jabsJuiceRequireInt(caster.strikeTiltFrames, 'juice.caster.strikeTiltFrames');

    /**
     * Peak weapon-overlay swing rotation (radians) before style multipliers.
     * @type {number}
     */
    this.weaponSwingPeakRadians = jabsJuiceRequireFloat(
      caster.weaponSwingPeakRadians,
      'juice.caster.weaponSwingPeakRadians'
    );

    /**
     * Frames for the weapon swing overlay arc.
     * @type {number}
     */
    this.weaponSwingFrames = jabsJuiceRequireInt(caster.weaponSwingFrames, 'juice.caster.weaponSwingFrames');

    /**
     * Extra downward shift for IconSet juice overlays (pixels; positive moves toward feet).
     * @type {number}
     */
    this.spriteJuiceVerticalOffsetPixels = jabsJuiceRequireInt(
      caster.spriteVerticalOffsetPixels,
      'juice.caster.spriteVerticalOffsetPixels'
    );

    /**
     * Body squish intensity when no weapon icon overlay plays (unarmed / enemies without icons).
     * @type {number}
     */
    this.unarmedStrikeSquishIntensity = jabsJuiceRequireFloat(
      caster.unarmedStrikeSquishIntensity,
      'juice.caster.unarmedStrikeSquishIntensity'
    );

    /**
     * Frames for unarmed strike easing.
     * @type {number}
     */
    this.unarmedStrikeSquishFrames = jabsJuiceRequireInt(
      caster.unarmedStrikeSquishFrames,
      'juice.caster.unarmedStrikeSquishFrames'
    );

    /**
     * Casting pulse amplitude while {@link JABS_Battler.isCasting} remains true.
     * @type {number}
     */
    this.castingPulseAmplitude = jabsJuiceRequireFloat(casting.pulseAmplitude, 'juice.casting.pulseAmplitude');

    /**
     * Named multiplier buckets keyed by skill tags or weapon type ids (parsed `juice.profiles` map).
     * `default` is guaranteed to exist (validator throws if not).
     * @type {Object<string, { tiltMul: number, swingMul: number }>}
     */
    this.weaponStyleMultipliers = jabsJuiceRequireProfiles(juice.profiles);
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
  if (hasBaseRequirement === false)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '4.7.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (hasJabsRequirement === false)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();

//endregion version checks

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.JUICE = {};

/**
 * The metadata associated with this plugin.
 */
J.ABS.EXT.JUICE.Metadata = new JAbsJuice_PluginMetadata('J-ABS-Juice', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.JUICE.Aliased = {};
J.ABS.EXT.JUICE.Aliased.JABS_Engine = new Map();
J.ABS.EXT.JUICE.Aliased.JABS_Battler = new Map();
J.ABS.EXT.JUICE.Aliased.Scene_Map = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.JUICE.RegExp = {
  /**
   * Skill: `<jabsJuiceIcon:N>` — forces weapon swing overlay icon index (IconSet).
   */
  JuiceIcon: /<jabsJuiceIcon:[ ]?(\d+)>/i,

  /**
   * Skill: `<jabsJuiceWeaponStyle:NAME>` — names a row inside weapon-style multipliers JSON.
   */
  JuiceWeaponStyle: /<jabsJuiceWeaponStyle:[ ]?([a-zA-Z0-9_-]+)>/i,

  /**
   * Skill: `<juiceMotion:NAME>` — selects a preset weapon motion (kebab-case).
   */
  JuiceMotion: /<juiceMotion:[ ]?([a-zA-Z0-9_-]+)>/i,

  /**
   * Skill: `<juiceSpan:N>` — arc span in degrees for arc / arc-reverse (default 120).
   */
  JuiceSpan: /<juiceSpan:[ ]?(\d+)>/i,

  /**
   * Skill: `<juiceSpinCount:N>` — full rotations for spin / spin-reverse (default 1; range 1–8).
   */
  JuiceSpinCount: /<juiceSpinCount:[ ]?(\d+)>/i,

  /**
   * Skill: `<juiceStabTipDegrees:N>` — tip/bore bearing from Pixi +x at rotation 0 (stab / bash / recoil; see help).
   */
  JuiceStabTipDegrees: /<juiceStabTipDegrees:[ ]?(-?\d+)>/i,

  /**
   * Skill: `<juiceProfileGun>` — side-profile IconSet gun: flip horizontally instead of ~180° rotation on east/west.
   */
  JuiceProfileGun: /<juiceProfileGun>/i,
};
//endregion initialization

//region RPG_Skill
/**
 * Skill note override for J-ABS-Juice weapon swing IconSet index (falls back to equipped weapon).
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, 'jabsJuiceIconIndex', {
  get: function()
  {
    return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceIcon, true) ?? -1;
  },
});

/**
 * Skill note override for juice swing style bucket (matched against weapon-style multiplier keys).
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, 'jabsJuiceWeaponStyle', {
  get: function()
  {
    return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceWeaponStyle, true) ?? String.empty;
  },
});

/**
 * Skill note override for the preset weapon motion key (kebab-case).
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, 'jabsJuiceMotion', {
  get: function()
  {
    return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceMotion, true) ?? String.empty;
  },
});

/**
 * Skill note: arc / arc-reverse span in degrees (`<juiceSpan:N>`). Omitted uses plugin default (120).
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, 'jabsJuiceArcSpanDegrees', {
  get: function()
  {
    return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceSpan, true) ?? -1;
  },
});

/**
 * Skill note: `<juiceSpinCount:N>` — full rotations for spin / spin-reverse (see J-ABS-Juice help).
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, 'jabsJuiceSpinCount', {
  get: function()
  {
    return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceSpinCount, true) ?? -1;
  },
});

/**
 * Skill note: tip/bearing from Pixi +x at rotation 0 in degrees (`<juiceStabTipDegrees:N>`).
 * Omitted: stab-forward uses sword default; bash / recoil use π rad (barrel toward −x) unless tagged.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, 'jabsJuiceStabTipDegrees', {
  get: function()
  {
    return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceStabTipDegrees, true) ?? null;
  },
});

/**
 * Skill note: `<juiceProfileGun>` — profile gun overlay uses horizontal flip for left/right aim (see J-ABS-Juice help).
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, 'jabsJuiceProfileGun', {
  get: function()
  {
    return RPGManager.checkForBooleanFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceProfileGun, false) === true;
  },
});
//endregion RPG_Skill

//region JuiceFlurryStrikeRecord
/**
 * One row of flurry decay state for a given action UUID and target UUID pair.
 */
class JuiceFlurryStrikeRecord
{
  /**
   * @param {number} count How many qualifying hits have stacked in the short window.
   * @param {number} frame Last {@link Graphics.frameCount} when this row was touched.
   */
  constructor(count, frame)
  {
    this.count = count;
    this.frame = frame;
  }
}
//endregion JuiceFlurryStrikeRecord

//region JuiceMapSpriteFinder
/**
 * Resolves the {@link Sprite_Character} that renders a map {@link Game_Character}.
 */
class JuiceMapSpriteFinder
{
  /**
   * Finds the character sprite for the given logical character on the current map scene.
   * @param {Game_Character} mapCharacter The character whose sprite we want.
   * @returns {Sprite_Character|null}
   */
  static findSpriteCharacterFor(mapCharacter)
  {
    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map))
    {
      return null;
    }

    const spriteset = scene._spriteset;
    if (!spriteset)
    {
      return null;
    }

    return spriteset.findTargetSprite(mapCharacter);
  }
}
//endregion JuiceMapSpriteFinder

//region JABS_Engine (juice hooks)
/**
 * Extends {@link JABS_Engine.postPrimaryBattleEffects}.<br/>
 * Applies lightweight target-side sprite reactions after core logging (and after Hitstop).
 */
J.ABS.EXT.JUICE.Aliased.JABS_Engine.set('postPrimaryBattleEffects', JABS_Engine.prototype.postPrimaryBattleEffects);
JABS_Engine.prototype.postPrimaryBattleEffects = function(action, target)
{
  // perform original logic (includes upstream extensions such as Hitstop).
  J.ABS.EXT.JUICE.Aliased.JABS_Engine.get('postPrimaryBattleEffects')
    .call(this, action, target);

  // layer procedural juice on the struck battler when applicable.
  JuiceHookManager.onPostPrimaryBattleEffects(action, target);
};

/**
 * Extends {@link JABS_Engine.executeMapAction}.<br/>
 * Runs caster-facing juice after JABS core and after higher-priority wrappers such as Poses.
 */
J.ABS.EXT.JUICE.Aliased.JABS_Engine.set('executeMapAction', JABS_Engine.prototype.executeMapAction);
JABS_Engine.prototype.executeMapAction = function(caster, action, targetX, targetY)
{
  // perform original logic (poses, cooldown routing, generation, etc.).
  J.ABS.EXT.JUICE.Aliased.JABS_Engine.get('executeMapAction')
    .call(this, caster, action, targetX, targetY);

  // attach caster-side strike / dodge / heal pulses without blocking gameplay logic.
  JuiceHookManager.onExecuteMapAction(caster, action);
};
//endregion JABS_Engine (juice hooks)

//region JuiceHookManager
/**
 * Central hook orchestration for J-ABS-Juice (caster, target, casting).
 */
class JuiceHookManager
{
  /**
   * Remembers multi-hit connection counts for amplitude decay.
   * @type {Map<string, JuiceFlurryStrikeRecord>}
   */
  static #flurryState = new Map();

  /**
   * Clears stale flurry rows occasionally so long sessions do not grow forever.
   */
  static #maybeGarbageCollectFlurry()
  {
    if (Graphics.frameCount % 600 !== 0)
    {
      return;
    }

    JuiceHookManager.#flurryState.clear();
  }

  /**
   * Computes amplitude multiplier for pierced / repeated applications.
   * @param {JABS_Action} action The action.
   * @param {JABS_Battler} target The target battler.
   * @returns {number}
   */
  static #computeFlurryAmplitudeScale(action, target)
  {
    const md = J.ABS.EXT.JUICE.Metadata;
    const key = `${action.getUuid()}::${target.getUuid()}`;
    const frame = Graphics.frameCount;
    const prior = JuiceHookManager.#flurryState.get(key);
    let count = 1;

    if (prior && frame - prior.frame <= 2)
    {
      count = prior.count + 1;
    }

    JuiceHookManager.#flurryState.set(key, new JuiceFlurryStrikeRecord(count, frame));

    const decay = md.flurryDecayPercent / 100;
    return Math.pow(decay, count - 1);
  }

  /**
   * Hook: {@link JABS_Engine#postPrimaryBattleEffects}.
   * @param {JABS_Action} action The impacting action.
   * @param {JABS_Battler} target The battler receiving the effect.
   */
  static onPostPrimaryBattleEffects(action, target)
  {
    JuiceHookManager.#maybeGarbageCollectFlurry();

    const result = target.getBattler()
      .result();

    if (result.parried === true)
    {
      return;
    }

    if (result.evaded === true)
    {
      return;
    }

    const sprite = JuiceMapSpriteFinder.findSpriteCharacterFor(target.getCharacter());
    if (!sprite)
    {
      return;
    }

    const md = J.ABS.EXT.JUICE.Metadata;
    const ga = action.getAction();
    let intensity = md.targetMagicalSquishIntensity;

    if (ga.isPhysical())
    {
      intensity = md.targetPhysicalSquishIntensity;
    }

    if (action.isHealing())
    {
      intensity *= md.healingRecipientSquishScale;
    }

    intensity *= JuiceHookManager.#computeFlurryAmplitudeScale(action, target);

    JuiceMotionManager.scheduleSquish(sprite, intensity, md.targetSquishFrames);
  }

  /**
   * Hook: {@link JABS_Engine.executeMapAction}.
   * @param {JABS_Battler} caster The caster.
   * @param {JABS_Action} action The action executing on the map.
   */
  static onExecuteMapAction(caster, action)
  {
    const cooldownKey = action.getCooldownType();
    const dodgeKey = typeof JABS_Button !== 'undefined'
      ? JABS_Button.Dodge
      : 'Dodge';

    if (cooldownKey === dodgeKey)
    {
      JuiceHookManager.#applyDodgeJuice(caster);
      return;
    }

    if (action.isHealing())
    {
      const strikeMotionRequested = action.getBaseSkill().jabsJuiceMotion !== String.empty;

      if (strikeMotionRequested === false)
      {
        JuiceHookManager.#applySupportCasterJuice(caster);
        return;
      }

      // authored `<juiceMotion:…>` wins over the healing shortcut — same path as strikes (tilt + overlay).
    }

    JuiceHookManager.#applyStrikeJuice(caster, action);
  }

  /**
   * Applies dodge-only motion on the caster (scale squash, no weapon overlay).
   * @param {JABS_Battler} caster The dodging battler.
   */
  static #applyDodgeJuice(caster)
  {
    const md = J.ABS.EXT.JUICE.Metadata;
    const sprite = JuiceMapSpriteFinder.findSpriteCharacterFor(caster.getCharacter());
    if (!sprite)
    {
      return;
    }

    JuiceMotionManager.scheduleSquish(sprite, md.dodgeSquishIntensity, md.dodgeSquishFrames);
  }

  /**
   * Applies gentle caster pulse for healing actions.
   * @param {JABS_Battler} caster The healing caster.
   */
  static #applySupportCasterJuice(caster)
  {
    const md = J.ABS.EXT.JUICE.Metadata;
    const sprite = JuiceMapSpriteFinder.findSpriteCharacterFor(caster.getCharacter());
    if (!sprite)
    {
      return;
    }

    JuiceMotionManager.scheduleSquish(sprite, md.supportCasterPulseIntensity, md.supportCasterPulseFrames);
  }

  /**
   * Applies strike motion: tilt + optional weapon swing for actors when an icon resolves.
   * @param {JABS_Battler} caster The attacker.
   * @param {JABS_Action} action The strike action.
   */
  static #applyStrikeJuice(caster, action)
  {
    const md = J.ABS.EXT.JUICE.Metadata;
    const sprite = JuiceMapSpriteFinder.findSpriteCharacterFor(caster.getCharacter());
    if (!sprite)
    {
      return;
    }

    const styleKey = JuiceProfileResolver.resolveWeaponStyleKey(caster, action);
    const mul = JuiceProfileResolver.resolveStyleMultipliers(styleKey);

    JuiceMotionManager.scheduleTilt(
      sprite,
      md.casterStrikeTiltRadians * mul.tiltMul,
      md.casterStrikeTiltFrames
    );

    const iconIndex = JuiceProfileResolver.resolveWeaponIconIndex(caster, action);
    if (iconIndex >= 0)
    {
      // exaggerate the swing so it stays readable through rapid combos.
      // this is intentionally over-the-top (paper mario juice).
      const swingWidthMultiplier = 2;
      const swingDurationMultiplier = 2;

      // select the motion type for this skill.
      const motionType = JuiceProfileResolver.resolveJuiceMotion(action);
      const arcSpanDegrees = JuiceProfileResolver.resolveJuiceArcSpanDegrees(action);
      const weaponTipRadians = JuiceProfileResolver.resolveJuiceWeaponTipRadians(action, motionType);
      const spinCount = JuiceProfileResolver.resolveJuiceSpinCount(action);
      const profileGun = JuiceProfileResolver.resolveJuiceProfileGun(action);

      JuiceWeaponSwingOverlay.play(
        sprite,
        iconIndex,
        md.weaponSwingPeakRadians * mul.swingMul * swingWidthMultiplier,
        md.weaponSwingFrames * swingDurationMultiplier,
        motionType,
        arcSpanDegrees,
        action.direction(),
        weaponTipRadians,
        spinCount,
        profileGun
      );
    }
    else
    {
      JuiceMotionManager.scheduleSquish(
        sprite,
        md.unarmedStrikeSquishIntensity,
        md.unarmedStrikeSquishFrames
      );
    }
  }

  /**
   * Hook: cast timer loop — starts a casting pulse once per cast session.
   * @param {JABS_Battler} battler The casting battler.
   */
  static tickCastingJuice(battler)
  {
    if (battler._juiceCastingScheduled === true)
    {
      return;
    }

    const sprite = JuiceMapSpriteFinder.findSpriteCharacterFor(battler.getCharacter());
    if (!sprite)
    {
      return;
    }

    battler._juiceCastingScheduled = true;

    const md = J.ABS.EXT.JUICE.Metadata;

    JuiceMotionManager.scheduleCastingPulse(
      sprite,
      md.castingPulseAmplitude,
      () => battler.isCasting()
    );
  }

  /**
   * Hook: cast completion — tears down casting-layer motion before execution juice runs.
   * @param {JABS_Battler} battler The battler who finished casting.
   */
  static endCastingJuice(battler)
  {
    battler._juiceCastingScheduled = false;

    const sprite = JuiceMapSpriteFinder.findSpriteCharacterFor(battler.getCharacter());
    if (!sprite)
    {
      return;
    }

    JuiceMotionManager.cancelForSprite(sprite);
  }
}
//endregion JuiceHookManager

//region JuiceMotionManager
/**
 * Owns lightweight per-frame juice tweens on Pixi sprites (scale / rotation).
 */
class JuiceMotionManager
{
  /**
   * @type {JuiceBaseEffect[]}
   */
  static #effects = [];

  /**
   * @type {WeakMap<Sprite, JuiceBaseEffect>}
   */
  static #spriteLocks = new WeakMap();

  /**
   * Clears the active sprite lock after a bound effect finishes its own teardown.
   * Motion effect instances call this from {@link JuiceBaseEffect#tick} when they return false.
   *
   * @param {Sprite} sprite The sprite that was exclusively owned by a juice motion.
   */
  static relinquishSpriteLock(sprite)
  {
    JuiceMotionManager.#spriteLocks.delete(sprite);
  }

  /**
   * Schedules a one-shot body squish on a sprite (scale pulse).
   * @param {Sprite} sprite The Pixi sprite.
   * @param {number} intensityScale Max delta applied via sine envelope (e.g. 0.12).
   * @param {number} durationFrames Frames to run.
   */
  static scheduleSquish(sprite, intensityScale, durationFrames)
  {
    JuiceMotionManager.#cancelSpriteLock(sprite);

    const effect = new JuiceSquishMotionEffect(sprite, intensityScale, durationFrames);

    JuiceMotionManager.#spriteLocks.set(sprite, effect);
    JuiceMotionManager.#effects.push(effect);
  }

  /**
   * Schedules a short tilt on the sprite (rotation around anchor).
   * @param {Sprite} sprite The Pixi sprite.
   * @param {number} peakRadians Peak rotation magnitude (radians).
   * @param {number} durationFrames Frames to run.
   */
  static scheduleTilt(sprite, peakRadians, durationFrames)
  {
    JuiceMotionManager.#cancelSpriteLock(sprite);

    const effect = new JuiceTiltMotionEffect(sprite, peakRadians, durationFrames);

    JuiceMotionManager.#spriteLocks.set(sprite, effect);
    JuiceMotionManager.#effects.push(effect);
  }

  /**
   * Schedules a casting pulse while {@link code frameFn} returns true (caller-driven envelope).
   * @param {Sprite} sprite The Pixi sprite.
   * @param {number} amplitudeScale Scale wobble amplitude (small, e.g. 0.04).
   * @param {function(): boolean} continuePredicate While true, pulse continues.
   */
  static scheduleCastingPulse(sprite, amplitudeScale, continuePredicate)
  {
    JuiceMotionManager.#cancelSpriteLock(sprite);

    const effect = new JuiceCastingPulseMotionEffect(sprite, amplitudeScale, continuePredicate);

    JuiceMotionManager.#spriteLocks.set(sprite, effect);
    JuiceMotionManager.#effects.push(effect);
  }

  /**
   * Cancels any active juice motion tied to this sprite.
   * @param {Sprite} sprite The Pixi sprite.
   */
  static cancelForSprite(sprite)
  {
    JuiceMotionManager.#cancelSpriteLock(sprite);
  }

  /**
   * Registers an external effect (usually a {@link JuiceBaseEffect} subclass) on the global queue.
   * @param {JuiceBaseEffect} effect The effect instance.
   */
  static pushExternalEffect(effect)
  {
    JuiceMotionManager.#effects.push(effect);
  }

  /**
   * Runs every frame while on the map (via {@link Scene_Map#update} alias).
   */
  static frameTick()
  {
    if (!JuiceMotionManager.#effects.length)
    {
      return;
    }

    const survivors = [];
    for (let i = 0; i < JuiceMotionManager.#effects.length; i++)
    {
      const effect = JuiceMotionManager.#effects[i];
      if (effect.tick())
      {
        survivors.push(effect);
      }
    }

    JuiceMotionManager.#effects.length = 0;
    survivors.forEach(s => JuiceMotionManager.#effects.push(s));
  }

  /**
   * Forces restoration if we still hold a lock on the sprite.
   * @param {Sprite} sprite The Pixi sprite.
   */
  static #cancelSpriteLock(sprite)
  {
    const held = JuiceMotionManager.#spriteLocks.get(sprite);
    if (!held)
    {
      return;
    }

    held.restore();

    JuiceMotionManager.#effects = JuiceMotionManager.#effects.filter(e => e !== held);
    JuiceMotionManager.#spriteLocks.delete(sprite);
  }
}
//endregion JuiceMotionManager

//region JuiceWeaponSwingOverlay
/**
 * Spawns a short-lived weapon icon sprite parented to a {@link Sprite_Character} and swings it.
 */
class JuiceWeaponSwingOverlay
{
  /**
   * @param {number} d Candidate direction code.
   * @returns {boolean}
   */
  static #isValidSwingDirection(d)
  {
    return d >= 1 && d <= 9 && d !== 5;
  }

  /**
   * True when motion uses clock-orbit arc geometry (shared focal point).
   * @param {string} motionType Preset key (kebab-case).
   * @returns {boolean}
   */
  static #isArcMotion(motionType)
  {
    return motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Arc
      || motionType === JuiceWeaponSwingMotionEffect.MotionTypes.ArcReverse;
  }

  /**
   * @param {number} spinCount Spin count from hook (may be invalid when absent).
   * @returns {number}
   */
  static #coalesceSpinCount(spinCount)
  {
    if (spinCount === undefined || spinCount === null || Number.isFinite(spinCount) === false)
    {
      return 1;
    }

    return spinCount;
  }

  /**
   * Derives a direction-aware overlay placement so the icon reads like it's coming from the hand.
   * Used for spin / stab (arc presets use orbit math instead).
   * @param {Sprite_Character} parentSprite The character sprite receiving the overlay.
   * @param {string} motionType Preset key (kebab-case).
   * @param {number} direction RMMZ 8-dir (same snapshot as the swing arc uses).
   * @returns {{ x: number, y: number, scale: number }}
   */
  static #buildSwingProfile(parentSprite, motionType, direction)
  {
    const ph = parentSprite.patternHeight();

    const tightOrbit = motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Arc
      || motionType === JuiceWeaponSwingMotionEffect.MotionTypes.ArcReverse;

    const tw = tightOrbit ? 20 : 26;
    const ySide = -ph * (tightOrbit ? 0.48 : 0.52);
    const yDown = -ph * (tightOrbit ? 0.18 : 0.22);
    const yUp = -ph * (tightOrbit ? 0.76 : 0.82);

    const card = (horiz, vert, sc) =>
    {
      return { x: horiz, y: vert, scale: sc };
    };

    const blendProf = (a, b, t) =>
    {
      return {
        x: a.x + ((b.x - a.x) * t),
        y: a.y + ((b.y - a.y) * t),
        scale: a.scale + ((b.scale - a.scale) * t),
      };
    };

    const left = card(-tw, ySide, 1.65);
    const right = card(tw, ySide, 1.65);
    const down = card(tightOrbit ? 6 : 10, yDown, 1.5);
    const up = card(0, yUp, 1.5);

    /** @type {{ x: number, y: number, scale: number }} */
    let prof;

    switch (direction)
    {
      case 2:
        prof = down;
        break;
      case 4:
        prof = left;
        break;
      case 6:
        prof = right;
        break;
      case 8:
        prof = up;
        break;
      case 1:
        prof = blendProf(down, left, 0.5);
        break;
      case 3:
        prof = blendProf(down, right, 0.5);
        break;
      case 7:
        prof = blendProf(up, left, 0.5);
        break;
      case 9:
        prof = blendProf(up, right, 0.5);
        break;
      default:
        prof = left;
        break;
    }

    return { x: prof.x, y: prof.y, scale: prof.scale };
  }

  /**
   * Plays a swing arc using an icon from IconSet, then removes the overlay.
   * @param {Sprite_Character} parentSprite The character sprite receiving the overlay.
   * @param {number} iconIndex Icon index on the IconSet sheet.
   * @param {number} peakRotationRadians Peak extra rotation applied during the swing.
   * @param {number} durationFrames Duration of the swing in frames.
   * @param {string} motionType Preset key (kebab-case).
   * @param {number} arcSpanDegrees Arc span for arc modes (default 120).
   * @param {number} swingDirection RMMZ 8-dir from {@link JABS_Action#direction} at strike time (pivot/guard-safe).
   * Omit to use {@link Game_Character#direction}.
   * @param {number} weaponTipRadians Radians from +x to tip/bore at rotation 0 (stab / bash / recoil).
   * Resolved per motion when omitted in skill notes
   * ({@link JuiceProfileResolver.resolveJuiceWeaponTipRadians}).
   * @param {number} spinCount Full rotations for spin / spin-reverse
   * ({@link JuiceProfileResolver.resolveJuiceSpinCount}).
   * @param {boolean} profileGun Skill `<juiceProfileGun>` — horizontal mirror for side-profile gun icons (east/west).
   */
  static play(
    parentSprite,
    iconIndex,
    peakRotationRadians,
    durationFrames,
    motionType,
    arcSpanDegrees,
    swingDirection,
    weaponTipRadians,
    spinCount,
    profileGun
  )
  {
    let spanDeg = arcSpanDegrees;
    if (spanDeg === undefined || spanDeg === null || Number.isFinite(spanDeg) === false)
    {
      spanDeg = 120;
    }

    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const bitmap = ImageManager.loadSystem('IconSet');
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;

    const overlay = new Sprite();
    overlay.bitmap = bitmap;
    overlay.setFrame(sx, sy, pw, ph);
    if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Spin
      || motionType === JuiceWeaponSwingMotionEffect.MotionTypes.SpinReverse)
    {
      overlay.anchor.x = 1.15;
      overlay.anchor.y = 1.15;
    }
    else
    {
      overlay.anchor.x = 0.78;
      overlay.anchor.y = 0.92;
    }

    let swingDir = swingDirection;
    if (JuiceWeaponSwingOverlay.#isValidSwingDirection(swingDir) === false)
    {
      swingDir = parentSprite._character.direction();
    }

    let weaponTipResolved = weaponTipRadians;
    if (weaponTipResolved === undefined || weaponTipResolved === null || Number.isFinite(weaponTipResolved) === false)
    {
      weaponTipResolved = JuiceWeaponSwingMotionEffect.StabIconTipAngleRadians;
    }

    const spinCountResolved = JuiceWeaponSwingOverlay.#coalesceSpinCount(spinCount);

    const profileGunResolved = profileGun === true;

    const phy = parentSprite.patternHeight();

    let neutralForCtorX;
    let neutralForCtorY;

    if (JuiceWeaponSwingOverlay.#isArcMotion(motionType) === true)
    {
      const reverse = motionType === JuiceWeaponSwingMotionEffect.MotionTypes.ArcReverse;
      const pose0 = JuiceWeaponSwingMotionEffect.computeArcPose(swingDir, phy, spanDeg, reverse, 0);

      overlay.x = pose0.x;
      overlay.y = pose0.y;

      if (reverse === true)
      {
        const travel0 = JuiceWeaponSwingMotionEffect.computeArcTravelRadians(swingDir, phy, spanDeg, true, 0);
        overlay.rotation = JuiceWeaponSwingMotionEffect.bladeRotationFromTravelRadians(travel0);
      }
      else
      {
        overlay.rotation = JuiceWeaponSwingMotionEffect.bladeRotationArcForward(pose0.theta);
      }
      overlay.scale.x = 1.6;
      overlay.scale.y = 1.6;
    }
    else
    {
      const profile = JuiceWeaponSwingOverlay.#buildSwingProfile(parentSprite, motionType, swingDir);
      const juiceDy = J.ABS.EXT.JUICE.Metadata.spriteJuiceVerticalOffsetPixels;
      const neutralX = profile.x;
      const neutralY = profile.y + juiceDy;

      if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Bash)
      {
        const bash0 = JuiceWeaponSwingMotionEffect.computeBashOffset(swingDir, phy, 0);
        const bashAlign = JuiceWeaponSwingMotionEffect.weaponTipAlign(
          swingDir,
          weaponTipResolved,
          profileGunResolved
        );

        overlay.x = neutralX + bash0.x;
        overlay.y = neutralY + bash0.y;
        overlay.rotation = bashAlign.rotation + JuiceWeaponSwingMotionEffect.bashWhipRotationRadians(0);
        overlay.scale.x = profile.scale * (bashAlign.mirrorX ? -1 : 1);
        overlay.scale.y = profile.scale;
        neutralForCtorX = neutralX;
        neutralForCtorY = neutralY;
      }
      else if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Recoil)
      {
        const recoil0 = JuiceWeaponSwingMotionEffect.computeRecoilPose(swingDir, phy, 0);
        const recoilAlign = JuiceWeaponSwingMotionEffect.weaponTipAlign(
          swingDir,
          weaponTipResolved,
          profileGunResolved
        );

        overlay.x = neutralX + recoil0.x;
        overlay.y = neutralY + recoil0.y;
        overlay.rotation = recoilAlign.rotation + recoil0.rotationDelta;
        overlay.scale.x = profile.scale * (recoilAlign.mirrorX ? -1 : 1);
        overlay.scale.y = profile.scale;
        neutralForCtorX = neutralX;
        neutralForCtorY = neutralY;
      }
      else if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.StabForward)
      {
        const stabAlign = JuiceWeaponSwingMotionEffect.weaponTipAlign(
          swingDir,
          weaponTipResolved,
          profileGunResolved
        );

        overlay.x = neutralX;
        overlay.y = neutralY;
        overlay.rotation = stabAlign.rotation;
        overlay.scale.x = profile.scale * (stabAlign.mirrorX ? -1 : 1);
        overlay.scale.y = profile.scale;
      }
      else if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Present)
      {
        const presentProf = JuiceWeaponSwingOverlay.#buildSwingProfile(parentSprite, motionType, 8);
        const presentJuiceDy = J.ABS.EXT.JUICE.Metadata.spriteJuiceVerticalOffsetPixels;
        const px = presentProf.x;
        const py = presentProf.y + presentJuiceDy;

        overlay.x = px;
        overlay.y = py;
        overlay.rotation = JuiceWeaponSwingMotionEffect.IconDiagonalRestRadians;
        overlay.scale.x = presentProf.scale;
        overlay.scale.y = presentProf.scale;
      }
      else
      {
        overlay.x = neutralX;
        overlay.y = neutralY;
        overlay.rotation = JuiceWeaponSwingMotionEffect.IconDiagonalRestRadians;
        overlay.scale.x = profile.scale;
        overlay.scale.y = profile.scale;
      }
    }

    overlay.opacity = 200;
    overlay.blendMode = 0;

    parentSprite.addChild(overlay);

    const baseRotation = overlay.rotation;

    let swingDirForMotion = swingDir;
    if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Present)
    {
      swingDirForMotion = 8;
    }

    const motion = new JuiceWeaponSwingMotionEffect(
      parentSprite,
      overlay,
      baseRotation,
      peakRotationRadians,
      durationFrames,
      motionType,
      spanDeg,
      swingDirForMotion,
      weaponTipResolved,
      neutralForCtorX,
      neutralForCtorY,
      spinCountResolved,
      profileGunResolved
    );

    JuiceMotionManager.pushExternalEffect(motion);
  }
}
//endregion JuiceWeaponSwingOverlay

//region JuiceBaseEffect
/**
 * Queued per-frame juice work driven by {@link JuiceMotionManager#frameTick}.
 * Subclasses implement {@link #tick}; override {@link #restore} when a cancel must snap baselines.
 */
class JuiceBaseEffect
{
  /**
   * Advances this effect by one frame.
   * @returns {boolean} True while this instance should stay in the motion queue.
   */
  tick()
  {
    throw new Error('JuiceBaseEffect.tick must be implemented by subclass.');
  }

  /**
   * Baseline restore when the motion manager tears an effect down early (default: no-op).
   */
  restore()
  {
  }
}
//endregion JuiceBaseEffect

//region JuiceCastingPulseMotionEffect
/**
 * Continuous scale shimmer while a caller-supplied predicate stays true (casting juice).
 */
class JuiceCastingPulseMotionEffect extends JuiceBaseEffect
{
  /**
   * @param {Sprite} sprite The Pixi sprite being driven.
   * @param {number} amplitudeScale Scale wobble amplitude (small, e.g. 0.04).
   * @param {function(): boolean} continuePredicate While true, pulse continues.
   */
  constructor(sprite, amplitudeScale, continuePredicate)
  {
    super();
    this._sprite = sprite;
    this._amplitudeScale = amplitudeScale;
    this._continuePredicate = continuePredicate;
    this._phase = 0;
    this._baseScaleX = sprite.scale.x;
    this._baseScaleY = sprite.scale.y;

    // capture the baseline tone + blend so we can restore it exactly after casting ends.
    this._baseBlendColor = sprite.getBlendColor();
    this._baseColorTone = sprite.getColorTone();
  }

  /**
   * Snaps scale back to the baseline captured at construction time.
   */
  restore()
  {
    this._sprite.scale.x = this._baseScaleX;
    this._sprite.scale.y = this._baseScaleY;

    // restore original render modifiers.
    this._sprite.setBlendColor(this._baseBlendColor);
    this._sprite.setColorTone(this._baseColorTone);
  }

  /**
   * Advances one frame of the casting pulse.
   * @returns {boolean} True while the effect should stay in the runner queue.
   */
  tick()
  {
    if (this._continuePredicate() === false)
    {
      this.restore();
      JuiceMotionManager.relinquishSpriteLock(this._sprite);
      return false;
    }

    // advance the pulse phase.
    this._phase++;

    // calculate the next scale multiplier.
    // this is a uniform "breathing" pulse rather than a squash/stretch, so it reads as a charge-up shimmer.
    // also, the pulse ramps from slow to faster over time, so it reads like building energy.
    const startPeriodFrames = 60;
    const endPeriodFrames = 24;
    const rampDurationFrames = 180;
    const t = Math.min(this._phase / rampDurationFrames, 1);
    const periodFrames = Math.round(startPeriodFrames + ((endPeriodFrames - startPeriodFrames) * t));
    const phaseRadians = (this._phase % periodFrames) / periodFrames * (Math.PI * 2);
    const wave = Math.sin(phaseRadians);
    const mul = 1 + (wave * this._amplitudeScale);

    // apply the pulse to both axes equally.
    this._sprite.scale.x = this._baseScaleX * mul;
    this._sprite.scale.y = this._baseScaleY * mul;

    // apply a lightweight casting glow.
    // this uses blendColor alpha pulsing to fake an additive-ish "charging" overlay.
    const glowMin = 0;
    const glowMax = 96;
    const glowAlpha = Math.round(((wave + 1) / 2) * (glowMax - glowMin) + glowMin);
    this._sprite.setBlendColor([ 180, 220, 255, glowAlpha ]);

    return true;
  }
}
//endregion JuiceCastingPulseMotionEffect

//region JuiceSquishMotionEffect
/**
 * One-shot scale squash / stretch envelope on a sprite (body squish juice).
 */
class JuiceSquishMotionEffect extends JuiceBaseEffect
{
  /**
   * @param {Sprite} sprite The Pixi sprite being driven.
   * @param {number} intensityScale Max delta applied via sine envelope (e.g. 0.12).
   * @param {number} durationFrames Frames to run.
   */
  constructor(sprite, intensityScale, durationFrames)
  {
    super();
    this._sprite = sprite;
    this._intensityScale = intensityScale;
    this._durationFrames = durationFrames;
    this._frame = 0;
    this._baseScaleX = sprite.scale.x;
    this._baseScaleY = sprite.scale.y;
  }

  /**
   * Snaps the sprite back to the baseline captured at construction time.
   */
  restore()
  {
    this._sprite.scale.x = this._baseScaleX;
    this._sprite.scale.y = this._baseScaleY;
  }

  /**
   * Advances one frame of the squish envelope.
   * @returns {boolean} True while the effect should stay in the runner queue.
   */
  tick()
  {
    this._frame++;
    const t = this._frame / this._durationFrames;
    const envelope = Math.sin(t * Math.PI);
    const mul = 1 + envelope * this._intensityScale;
    this._sprite.scale.x = this._baseScaleX * mul;
    this._sprite.scale.y = this._baseScaleY * (1 / mul);

    if (this._frame >= this._durationFrames)
    {
      this.restore();
      JuiceMotionManager.relinquishSpriteLock(this._sprite);
      return false;
    }

    return true;
  }
}
//endregion JuiceSquishMotionEffect

//region JuiceTiltMotionEffect
/**
 * One-shot rotation wobble (strike tilt juice) on a sprite.
 */
class JuiceTiltMotionEffect extends JuiceBaseEffect
{
  /**
   * @param {Sprite} sprite The Pixi sprite being driven.
   * @param {number} peakRadians Peak rotation magnitude (radians).
   * @param {number} durationFrames Frames to run.
   */
  constructor(sprite, peakRadians, durationFrames)
  {
    super();
    this._sprite = sprite;
    this._peakRadians = peakRadians;
    this._durationFrames = durationFrames;
    this._frame = 0;
    this._baseRotation = sprite.rotation;
  }

  /**
   * Snaps rotation back to the baseline captured at construction time.
   */
  restore()
  {
    this._sprite.rotation = this._baseRotation;
  }

  /**
   * Advances one frame of the tilt envelope.
   * @returns {boolean} True while the effect should stay in the runner queue.
   */
  tick()
  {
    this._frame++;
    const t = this._frame / this._durationFrames;
    const envelope = Math.sin(t * Math.PI);
    this._sprite.rotation = this._baseRotation + envelope * this._peakRadians;

    if (this._frame >= this._durationFrames)
    {
      this.restore();
      JuiceMotionManager.relinquishSpriteLock(this._sprite);
      return false;
    }

    return true;
  }
}
//endregion JuiceTiltMotionEffect

//region JuiceWeaponSwingMotionEffect
/**
 * Drives one weapon-icon overlay swing arc, then detaches and destroys the overlay sprite.
 */
class JuiceWeaponSwingMotionEffect extends JuiceBaseEffect
{
  /**
   * Unit forward vector (Pixi space: +x right, +y down) for map facing codes 1–9.
   * @param {number} dir Game_Character.direction().
   * @returns {{ x: number, y: number }}
   */
  /**
   * Clamps spin preset rotation count (full turns) for spin / spin-reverse.
   * @param {number} spinCount Candidate count from skill notes or resolver.
   * @returns {number}
   */
  static #clampSpinCount(spinCount)
  {
    if (spinCount === undefined || spinCount === null || Number.isFinite(spinCount) === false)
    {
      return 1;
    }

    const k = Math.floor(spinCount);

    if (k < 1)
    {
      return 1;
    }

    if (k > 8)
    {
      return 8;
    }

    return k;
  }

  static #forwardUnit(dir)
  {
    const h = Math.SQRT1_2;
    switch (dir)
    {
      case 2:
        return { x: 0, y: 1 };
      case 4:
        return { x: -1, y: 0 };
      case 6:
        return { x: 1, y: 0 };
      case 8:
        return { x: 0, y: -1 };
      case 1:
        return { x: -h, y: h };
      case 3:
        return { x: h, y: h };
      case 7:
        return { x: -h, y: -h };
      case 9:
        return { x: h, y: -h };
      default:
        return { x: -1, y: 0 };
    }
  }

  /**
   * Maps clock hour (12 at top, CW positive hour index) to Pixi polar angle from +x axis (radians).
   * Accepts any real hour so callers can interpolate across midnight without `% 12` (continuous θ).
   * @param {number} hourFrom12CW Fractional hours from 12 o'clock clockwise (may be negative or > 12).
   * @returns {number}
   */
  static hourToTheta(hourFrom12CW)
  {
    return (-Math.PI / 2) + (hourFrom12CW * (Math.PI / 6));
  }

  /**
   * Arc center hour per arc-table.md (facing → center of 120° arc on screen clock).
   * @param {number} dir Game_Character.direction().
   * @returns {number}
   */
  static arcCenterHourFromDirection(dir)
  {
    switch (dir)
    {
      case 8:
        return 0;
      case 2:
        return 6;
      case 4:
        return 9;
      case 6:
        return 3;
      case 7:
        return 10.5;
      case 1:
        return 7.5;
      case 9:
        return 1.5;
      case 3:
        return 4.5;
      default:
        return 9;
    }
  }

  /**
   * Pose on the orbit for arc / arc-reverse at eased progress (also used at spawn with ease 0).
   * @param {number} dir Facing direction.
   * @param {number} phy Pattern height.
   * @param {number} arcSpanDegrees Arc span in degrees.
   * @param {boolean} reverse True for arc-reverse (CW on clock).
   * @param {number} ease Eased progress 0..1.
   * @returns {{ x: number, y: number, theta: number }}
   */
  static computeArcPose(dir, phy, arcSpanDegrees, reverse, ease)
  {
    const juiceDy = J.ABS.EXT.JUICE.Metadata.spriteJuiceVerticalOffsetPixels;
    const cx = 0;
    const cy = -(phy * 0.5) + juiceDy;
    const orbit = phy * 0.38;
    const spanHours = arcSpanDegrees / 30;
    const centerH = JuiceWeaponSwingMotionEffect.arcCenterHourFromDirection(dir);
    const half = spanHours / 2;

    // interpolate in unwrapped hour space — never `% 12` mid-arc or θ jumps ~2π when the swing crosses 12 o'clock.
    let hourFloat;
    if (reverse === false)
    {
      hourFloat = (centerH + half) - (spanHours * ease);
    }
    else
    {
      hourFloat = (centerH - half) + (spanHours * ease);
    }

    const theta = JuiceWeaponSwingMotionEffect.hourToTheta(hourFloat);
    const x = cx + (Math.cos(theta) * orbit);
    const y = cy + (Math.sin(theta) * orbit);

    return { x, y, theta };
  }

  /**
   * Instantaneous travel angle (radians) along the arc from eased pose samples.
   * Used for {@link MotionTypes.ArcReverse} blade orientation — velocity-aligned read matches reverse motion.
   * Forward {@link MotionTypes.Arc} keeps {@link JuiceWeaponSwingMotionEffect.bladeRotationArcForward} instead;
   * IconSet anchor was tuned to θ+π/2, not raw atan2 velocity.
   * @param {number} dir Facing direction.
   * @param {number} phy Pattern height.
   * @param {number} arcSpanDegrees Arc span in degrees.
   * @param {boolean} reverse Arc-reverse when true.
   * @param {number} ease Eased progress 0..1.
   * @returns {number}
   */
  static computeArcTravelRadians(dir, phy, arcSpanDegrees, reverse, ease)
  {
    const eps = 1 / 96;
    let easeLo;
    let easeHi;

    if (ease <= eps)
    {
      easeLo = ease;
      easeHi = Math.min(ease + (eps * 2), 1);
    }
    else if (ease >= 1 - eps)
    {
      easeHi = ease;
      easeLo = Math.max(ease - (eps * 2), 0);
    }
    else
    {
      easeLo = ease - eps;
      easeHi = ease + eps;
    }

    const pLo = JuiceWeaponSwingMotionEffect.computeArcPose(dir, phy, arcSpanDegrees, reverse, easeLo);
    const pHi = JuiceWeaponSwingMotionEffect.computeArcPose(dir, phy, arcSpanDegrees, reverse, easeHi);
    const vx = pHi.x - pLo.x;
    const vy = pHi.y - pLo.y;
    const magSq = (vx * vx) + (vy * vy);

    if (magSq < 1e-12)
    {
      const pose = JuiceWeaponSwingMotionEffect.computeArcPose(dir, phy, arcSpanDegrees, reverse, ease);
      const spanHours = arcSpanDegrees / 30;
      const dhDease = reverse === true ? spanHours : -spanHours;
      const dThetaDease = (Math.PI / 6) * dhDease;
      const orbit = phy * 0.38;
      const vx2 = -orbit * Math.sin(pose.theta) * dThetaDease;
      const vy2 = orbit * Math.cos(pose.theta) * dThetaDease;

      return Math.atan2(vy2, vx2);
    }

    return Math.atan2(vy, vx);
  }

  /**
   * Full overlay rotation from travel radians plus IconSet diagonal rest bias (arc-reverse path).
   * @param {number} travelRadians Direction of motion along the orbit (radians).
   * @returns {number}
   */
  static bladeRotationFromTravelRadians(travelRadians)
  {
    return JuiceWeaponSwingMotionEffect.IconDiagonalRestRadians + travelRadians;
  }

  /**
   * Strike-phase ease for bash: 0 during wind-up, then smoothstep so contact snaps instead of floating.
   * @param {number} ease Outer eased progress 0..1 (swing tick).
   * @returns {number}
   */
  static #bashStrikeEase(ease)
  {
    const strikeStart = 0.18;
    let strikePhase = 0;

    if (ease > strikeStart)
    {
      strikePhase = (ease - strikeStart) / (1 - strikeStart);
    }

    return strikePhase * strikePhase * (3 - (2 * strikePhase));
  }

  /**
   * Bash preset offset: wind back, then drive forward through contact (club / pistol-whip shared read).
   * Lateral hook is tied to strike phase only so the path reads like a hit, not a full orbit.
   * Rotation uses {@link bashWhipRotationRadians} + thrust alignment (no velocity-spin).
   * @param {number} dir RMMZ 8-dir.
   * @param {number} phy Character pattern height.
   * @param {number} ease Eased progress 0..1 (matches swing tick).
   * @returns {{ x: number, y: number }}
   */
  static computeBashOffset(dir, phy, ease)
  {
    const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(dir);
    const perp =
    {
      x: -forward.y,
      y: forward.x,
    };

    const windT = Math.min(1, ease / 0.32);
    const windBack = phy * 0.14 * (1 - windT) * (1 - windT);
    const strikeEase = JuiceWeaponSwingMotionEffect.#bashStrikeEase(ease);
    const fwdStrike = phy * 0.56 * strikeEase;
    const fwdScalar = -windBack + fwdStrike;

    const hookScalar = phy * 0.045 * Math.sin(Math.PI * strikeEase);
    const x = (forward.x * fwdScalar) + (perp.x * hookScalar);
    const y = (forward.y * fwdScalar) + (perp.y * hookScalar);

    return { x, y };
  }

  /**
   * Wrist snap during the strike phase only — lighter total twist so profile icons do not barrel-roll.
   * @param {number} ease Eased progress 0..1.
   * @returns {number}
   */
  static bashWhipRotationRadians(ease)
  {
    const strikeEase = JuiceWeaponSwingMotionEffect.#bashStrikeEase(ease);

    return Math.sin(Math.PI * strikeEase) * 0.22;
  }

  /**
   * Recoil preset offset: shot kick — pulls back along facing and climbs slightly (ease 0 = max kick).
   * Rotation delta is added on top of {@link IconDiagonalRestRadians}.
   * @param {number} dir RMMZ 8-dir.
   * @param {number} phy Character pattern height.
   * @param {number} ease Eased progress 0..1 (matches swing tick).
   * @returns {{ x: number, y: number, rotationDelta: number }}
   */
  static computeRecoilPose(dir, phy, ease)
  {
    const kick = 1 - ease;
    const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(dir);
    const backDist = phy * 0.22 * kick;
    const x = -forward.x * backDist;
    const y = (-forward.y * backDist) - (phy * 0.06 * kick);
    const rotationDelta = -kick * 0.28;

    return { x, y, rotationDelta };
  }

  /**
   * Blade rotation for normal arc: polar tangent from orbit θ plus diagonal icon rest
   * (what the sheet was authored against).
   * @param {number} theta Orbit angle from {@link hourToTheta}.
   * @returns {number}
   */
  static bladeRotationArcForward(theta)
  {
    return JuiceWeaponSwingMotionEffect.IconDiagonalRestRadians + theta + (Math.PI / 2);
  }

  /**
   * Angle from Pixi +x to sword-tip direction inside this IconSet tile when {@link Sprite#rotation} === 0.
   * Vanilla sword slices sit corner-to-corner toward screen upper-left (−3π/4). Wrong prior guess assumed tip-at-west,
   * which made τ + π equal 0 for pure-west thrust — sprite stayed unturned while sliding sideways (“sorta stab”).
   * World tip angle = rotation + {@link StabIconTipAngleRadians} must equal thrust τ from {@link #forwardUnit}.
   * @readonly
   */
  static StabIconTipAngleRadians = (-Math.PI * 3) / 4;

  /**
   * Default bore axis for bash / recoil when `<juiceStabTipDegrees>` is omitted (tag overrides).
   * Matches typical IconSet firearms: barrel reads toward −x in the cell.
   * @readonly
   */
  static BashRecoilIconTipAngleRadians = Math.PI;

  /**
   * Full weapon rotation for stab-forward: sprite rotates so tip aims along thrust τ = atan2(fy, fx).
   * Pure alignment — rotation = τ − tipAngle only (no swing twist); stab tracks facing exactly.
   * tipAngle defaults to {@link StabIconTipAngleRadians} or skill tag degrees.
   * @param {number} dir RMMZ 8-dir (same as strike snapshot).
   * @param {number} tipAngleRadians Angle from Pixi +x to tip when rotation === 0 (radians).
   * @returns {number}
   */
  static stabBladeRotationRadians(dir, tipAngleRadians)
  {
    const tip = tipAngleRadians !== undefined && tipAngleRadians !== null && Number.isFinite(tipAngleRadians)
      ? tipAngleRadians
      : JuiceWeaponSwingMotionEffect.StabIconTipAngleRadians;

    const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(dir);
    const thrustAngle = Math.atan2(forward.y, forward.x);

    return thrustAngle - tip;
  }

  /**
   * Thrust alignment with optional profile-gun rule: mirror X instead of ~π rotation
   * (avoids upside-down profile art on east/west).
   * North/south still use ±90° rotation; side-view art cannot match top-down aim without new sprites or tip tweaks.
   * @param {number} dir RMMZ 8-dir.
   * @param {number} tipRadians Resolved bore angle from +x at rotation 0.
   * @param {boolean} profileGun Skill tagged `<juiceProfileGun>`.
   * @returns {{ rotation: number, mirrorX: boolean }}
   */
  static weaponTipAlign(dir, tipRadians, profileGun)
  {
    const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(dir);
    const thrustAngle = Math.atan2(forward.y, forward.x);
    let rotation = thrustAngle - tipRadians;

    if (profileGun === false)
    {
      return { rotation, mirrorX: false };
    }

    while (rotation > Math.PI)
    {
      rotation -= Math.PI * 2;
    }
    while (rotation <= -Math.PI)
    {
      rotation += Math.PI * 2;
    }

    let mirrorX = false;
    const nearPi = 0.15;

    if (Math.abs(Math.abs(rotation) - Math.PI) < nearPi)
    {
      rotation = 0;
      mirrorX = true;
    }

    return { rotation, mirrorX };
  }

  /**
   * Preset motion keys for the weapon overlay.
   * @readonly
   */
  static MotionTypes = {
    Arc: 'arc',
    ArcReverse: 'arc-reverse',
    Bash: 'bash',
    Present: 'present',
    Recoil: 'recoil',
    Spin: 'spin',
    SpinReverse: 'spin-reverse',
    StabForward: 'stab-forward',
  };

  /**
   * Default IconSet cell rest: 45° CW so blade reads toward 12 o'clock before arc deltas (spec).
   * @readonly
   */
  static IconDiagonalRestRadians = Math.PI / 4;

  /**
   * @param {Sprite_Character} parentSprite The character sprite that owns the overlay.
   * @param {Sprite} overlay The IconSet slice child sprite.
   * @param {number} baseRotation Starting rotation of the overlay (radians).
   * @param {number} peakRotationRadians Peak extra rotation applied during the swing.
   * @param {number} durationFrames Duration of the swing in frames.
   * @param {string} motionType Preset key (kebab-case).
   * @param {number} arcSpanDegrees Arc span for arc presets (ignored for spin/stab).
   * @param {number} swingDirection RMMZ 8-dir locked at strike time.
   * Matches {@link JABS_Action#direction} when juice hooks pass it through.
   * @param {number} stabTipAngleRadians Resolved radians from +x to tip/bore at rotation 0 (stab / bash / recoil).
   * @param {number} neutralBaseX Hand-neutral overlay X when spawn pose includes preset offset (bash / recoil).
   * @param {number} neutralBaseY Hand-neutral overlay Y (same).
   * @param {number} spinCount Full rotations for spin / spin-reverse (clamped 1–8; ignored for other presets).
   * @param {boolean} profileGun Skill `<juiceProfileGun>` — mirror for E/W aim instead of π rotation.
   */
  constructor(
    parentSprite,
    overlay,
    baseRotation,
    peakRotationRadians,
    durationFrames,
    motionType,
    arcSpanDegrees,
    swingDirection,
    stabTipAngleRadians,
    neutralBaseX,
    neutralBaseY,
    spinCount,
    profileGun
  )
  {
    super();
    this._parentSprite = parentSprite;
    this._overlay = overlay;
    this._baseRotation = baseRotation;
    this._peakRotationRadians = peakRotationRadians;
    this._durationFrames = durationFrames;
    this._motionType = motionType;
    this._frame = 0;
    this._arcSpanDegrees = arcSpanDegrees >= 30 && arcSpanDegrees <= 300
      ? arcSpanDegrees
      : 120;

    /**
     * Facing used for orbit / stab / spin geometry for this swing only (not live {@link Game_Character#direction}).
     * @type {number}
     */
    this._swingDirection = swingDirection;

    /**
     * Stab tip axis (radians); ignored except stab-forward.
     * @type {number}
     */
    this._stabTipAngleRadians = stabTipAngleRadians !== undefined && stabTipAngleRadians !== null
      && Number.isFinite(stabTipAngleRadians)
      ? stabTipAngleRadians
      : JuiceWeaponSwingMotionEffect.StabIconTipAngleRadians;

    // remember hand-neutral placement so bash / recoil can offset spawn pose without drifting the ease track.
    if (neutralBaseX !== undefined && neutralBaseX !== null && Number.isFinite(neutralBaseX)
      && neutralBaseY !== undefined && neutralBaseY !== null && Number.isFinite(neutralBaseY))
    {
      this._baseX = neutralBaseX;
      this._baseY = neutralBaseY;
    }
    else
    {
      this._baseX = overlay.x;
      this._baseY = overlay.y;
    }

    /** @type {{ sprite: Sprite, ttl: number }[]} */
    this._trail = [];

    /**
     * Full rotations for spin / spin-reverse ({@link MotionTypes.Spin}, {@link MotionTypes.SpinReverse}).
     * @type {number}
     */
    this._spinCount = JuiceWeaponSwingMotionEffect.#clampSpinCount(spinCount);

    /**
     * Profile gun: horizontal mirror replaces full 180° rotation for side-view IconSet art.
     * @type {boolean}
     */
    this._profileGun = profileGun === true;

    /**
     * Unsigned overlay scale magnitude from spawn (flip sign when mirroring).
     * @type {number}
     */
    this._scaleMag = Math.abs(overlay.scale.x);
  }

  /**
   * Applies thrust-aligned rotation plus extras; updates mirror scale when {@link #_profileGun}.
   * @param {number} dir Facing direction.
   * @param {number} extraRotationRadians Added on top of aligned thrust (whip, recoil kick, etc.).
   */
  #applyTipAlignedRotation(dir, extraRotationRadians)
  {
    const align = JuiceWeaponSwingMotionEffect.weaponTipAlign(
      dir,
      this._stabTipAngleRadians,
      this._profileGun
    );

    this._overlay.rotation = align.rotation + extraRotationRadians;

    if (this._profileGun === true)
    {
      this._overlay.scale.x = this._scaleMag * (align.mirrorX ? -1 : 1);
      this._overlay.scale.y = this._scaleMag;
    }
  }

  /**
   * Advances one frame of the swing arc.
   * @returns {boolean} True while the effect should stay in the runner queue.
   */
  tick()
  {
    this._frame++;

    const t = Math.min(this._frame / this._durationFrames, 1);

    const ease = 1 - Math.pow(1 - t, 3);

    const phy = this._parentSprite.patternHeight();
    const dir = this._swingDirection;

    switch (this._motionType)
    {
      case JuiceWeaponSwingMotionEffect.MotionTypes.ArcReverse:
        this.#tickArc(phy, dir, ease, true);
        break;
      case JuiceWeaponSwingMotionEffect.MotionTypes.Spin:
        this.#tickSpin(phy, t, this._spinCount, 1);
        break;
      case JuiceWeaponSwingMotionEffect.MotionTypes.SpinReverse:
        this.#tickSpin(phy, t, this._spinCount, -1);
        break;
      case JuiceWeaponSwingMotionEffect.MotionTypes.StabForward:
        this.#tickStabForward(phy, dir, ease);
        break;
      case JuiceWeaponSwingMotionEffect.MotionTypes.Present:
        this.#tickPresent(phy, ease);
        break;
      case JuiceWeaponSwingMotionEffect.MotionTypes.Bash:
        this.#tickBash(phy, dir, ease);
        break;
      case JuiceWeaponSwingMotionEffect.MotionTypes.Recoil:
        this.#tickRecoil(phy, dir, ease);
        break;
      case JuiceWeaponSwingMotionEffect.MotionTypes.Arc:
      default:
        this.#tickArc(phy, dir, ease, false);
        break;
    }

    this.#tickTrail();

    if (this._frame >= this._durationFrames)
    {
      this._parentSprite.removeChild(this._overlay);
      this._overlay.destroy();

      this._trail.forEach(trail =>
      {
        this._parentSprite.removeChild(trail.sprite);
        trail.sprite.destroy();
      });
      this._trail.length = 0;
      return false;
    }

    return true;
  }

  /**
   * Clock-orbit arc preset (arc-table.md); arc = CCW on clock, arc-reverse = CW.
   * @param {number} phy Pattern height.
   * @param {number} dir Facing direction.
   * @param {number} ease Eased progress (0..1).
   * @param {boolean} reverse Arc-reverse when true.
   */
  #tickArc(phy, dir, ease, reverse)
  {
    const pose = JuiceWeaponSwingMotionEffect.computeArcPose(
      dir,
      phy,
      this._arcSpanDegrees,
      reverse,
      ease
    );

    this._overlay.x = pose.x;
    this._overlay.y = pose.y;

    if (reverse === true)
    {
      const travel = JuiceWeaponSwingMotionEffect.computeArcTravelRadians(
        dir,
        phy,
        this._arcSpanDegrees,
        true,
        ease
      );
      this._overlay.rotation = JuiceWeaponSwingMotionEffect.bladeRotationFromTravelRadians(travel);
      return;
    }

    this._overlay.rotation = JuiceWeaponSwingMotionEffect.bladeRotationArcForward(pose.theta);
  }

  /**
   * Ticks a spin flourish around the battler center.
   * @param {number} phy Pattern height for scale.
   * @param {number} t Linear progress (0..1).
   * @param {number} spinCount Number of full rotations.
   * @param {number} spinDirectionSign +1 default (CCW in Pixi); −1 for {@link MotionTypes.SpinReverse}.
   */
  #tickSpin(phy, t, spinCount, spinDirectionSign)
  {
    const sign = spinDirectionSign === -1 ? -1 : 1;
    const radians = (Math.PI * 2) * spinCount * t * sign;
    this._overlay.rotation = this._baseRotation + radians;

    const centerX = 0;
    const centerY = -(phy * 0.5);

    const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(this._swingDirection);
    const front = phy * 0.12;
    const frontX = forward.x * front;
    const frontY = forward.y * front;

    const phaseOffset = -(Math.PI / 6);
    const theta = radians + phaseOffset;

    const orbit = phy * 0.38;
    const juiceDy = J.ABS.EXT.JUICE.Metadata.spriteJuiceVerticalOffsetPixels;
    this._overlay.x = centerX + frontX + Math.cos(theta) * orbit;
    this._overlay.y = centerY + frontY + Math.sin(theta) * orbit + juiceDy;

    if (this._frame % 2 === 0)
    {
      this.#spawnTrailAfterimage();
    }
  }

  /**
   * Spawns one afterimage based on the current overlay state.
   */
  #spawnTrailAfterimage()
  {
    const ghost = new Sprite();
    ghost.bitmap = this._overlay.bitmap;
    ghost.anchor.x = this._overlay.anchor.x;
    ghost.anchor.y = this._overlay.anchor.y;
    ghost.scale.x = this._overlay.scale.x;
    ghost.scale.y = this._overlay.scale.y;
    ghost.opacity = 140;
    ghost.blendMode = 1;

    ghost.setFrame(
      this._overlay._frame.x,
      this._overlay._frame.y,
      this._overlay._frame.width,
      this._overlay._frame.height
    );

    ghost.x = this._overlay.x;
    ghost.y = this._overlay.y;
    ghost.rotation = this._overlay.rotation;

    this._parentSprite.addChild(ghost);
    this._trail.push({ sprite: ghost, ttl: 10 });
  }

  /**
   * Ticks and fades all existing trail afterimages.
   */
  #tickTrail()
  {
    if (this._trail.length === 0)
    {
      return;
    }

    const survivors = [];
    this._trail.forEach(trail =>
    {
      trail.ttl -= 1;
      trail.sprite.opacity = Math.max(0, Math.round((trail.ttl / 10) * 140));
      if (trail.ttl > 0)
      {
        survivors.push(trail);
        return;
      }

      this._parentSprite.removeChild(trail.sprite);
      trail.sprite.destroy();
    });

    this._trail = survivors;
  }

  /**
   * Ticks a forward stab (mostly translation, minimal rotation).
   * @param {number} phy Pattern height for scale.
   * @param {number} dir Facing direction.
   * @param {number} ease Eased progress (0..1).
   */
  #tickStabForward(phy, dir, ease)
  {
    this.#applyTipAlignedRotation(dir, 0);

    const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(dir);
    const dist = phy * 0.55;
    const dx = forward.x * dist;
    const dy = forward.y * dist;

    this._overlay.x = this._baseX + (dx * ease);
    this._overlay.y = this._baseY + (dy * ease);
  }

  /**
   * Lifts the icon straight upward on screen (facing-agnostic “present this item”).
   * @param {number} phy Character pattern height.
   * @param {number} ease Eased progress 0..1.
   */
  #tickPresent(phy, ease)
  {
    const lift = phy * 0.42;

    this._overlay.x = this._baseX;
    this._overlay.y = this._baseY - (lift * ease);
    this._overlay.rotation = this._baseRotation;
  }

  /**
   * Ticks bash smack — thrust-aligned weapon plus a single wrist hump (no velocity-spin rotation).
   * @param {number} phy Pattern height.
   * @param {number} dir Facing direction.
   * @param {number} ease Eased progress 0..1.
   */
  #tickBash(phy, dir, ease)
  {
    const off = JuiceWeaponSwingMotionEffect.computeBashOffset(dir, phy, ease);
    const whip = JuiceWeaponSwingMotionEffect.bashWhipRotationRadians(ease);

    this._overlay.x = this._baseX + off.x;
    this._overlay.y = this._baseY + off.y;
    this.#applyTipAlignedRotation(dir, whip);
  }

  /**
   * Ticks firearm-style recoil (pull back + settle).
   * @param {number} phy Pattern height.
   * @param {number} dir Facing direction.
   * @param {number} ease Eased progress 0..1.
   */
  #tickRecoil(phy, dir, ease)
  {
    const p = JuiceWeaponSwingMotionEffect.computeRecoilPose(dir, phy, ease);

    this._overlay.x = this._baseX + p.x;
    this._overlay.y = this._baseY + p.y;
    this.#applyTipAlignedRotation(dir, p.rotationDelta);
  }
}
//endregion JuiceWeaponSwingMotionEffect

//region JABS_Battler (casting hooks)
/**
 * Extends {@link JABS_Battler.processCastingTimer}.<br/>
 * Keeps casting pulse juice alive while the battler remains in a casting state.
 */
J.ABS.EXT.JUICE.Aliased.JABS_Battler.set('processCastingTimer', JABS_Battler.prototype.processCastingTimer);
JABS_Battler.prototype.processCastingTimer = function()
{
  // advance timers exactly like core JABS (cast countdown may finish inside here).
  J.ABS.EXT.JUICE.Aliased.JABS_Battler.get('processCastingTimer')
    .call(this);

  // if still casting after countdown, keep the lightweight pulse scheduled once per session.
  if (this.isCasting())
  {
    JuiceHookManager.tickCastingJuice(this);
  }
};

/**
 * Extends {@link JABS_Battler.onCastComplete}.<br/>
 * Clears casting-layer transforms before the decided action executes on the map.
 */
J.ABS.EXT.JUICE.Aliased.JABS_Battler.set('onCastComplete', JABS_Battler.prototype.onCastComplete);
JABS_Battler.prototype.onCastComplete = function()
{
  // tear down casting pulse first so execution-time strike juice reads a neutral sprite baseline.
  JuiceHookManager.endCastingJuice(this);

  // fire the normal cast-completion pipeline (completeCast, generation, etc.).
  J.ABS.EXT.JUICE.Aliased.JABS_Battler.get('onCastComplete')
    .call(this);
};
//endregion JABS_Battler (casting hooks)

//region JuiceProfileResolver
/**
 * Resolves weapon / armor icon indices and swing style keys for juice profiles.
 */
class JuiceProfileResolver
{
  /**
   * Resolves the selected preset motion for this skill (defaults to arc).
   * Normalizes legacy keys (swing-top-down / swing-bottom-up; spin-360 / spin-720 / spin-360-reverse).
   * @param {JABS_Action} action The executing action.
   * @returns {string}
   */
  static resolveJuiceMotion(action)
  {
    const skill = action.getBaseSkill();
    const motion = skill.jabsJuiceMotion;
    if (motion === String.empty)
    {
      return JuiceProfileResolver.MotionArcKey;
    }

    if (motion === 'swing-top-down')
    {
      return JuiceProfileResolver.MotionArcKey;
    }

    if (motion === 'swing-bottom-up')
    {
      return JuiceProfileResolver.MotionArcReverseKey;
    }

    if (motion === 'spin-360')
    {
      return JuiceWeaponSwingMotionEffect.MotionTypes.Spin;
    }

    if (motion === 'spin-720')
    {
      return JuiceWeaponSwingMotionEffect.MotionTypes.Spin;
    }

    if (motion === 'spin-360-reverse')
    {
      return JuiceWeaponSwingMotionEffect.MotionTypes.SpinReverse;
    }

    return motion;
  }

  /**
   * Full rotations for spin / spin-reverse (1–8). Tag overrides legacy `spin-720` (=2 when tag omitted).
   * @param {JABS_Action} action The executing action.
   * @returns {number}
   */
  static resolveJuiceSpinCount(action)
  {
    const skill = action.getBaseSkill();
    const tagged = skill.jabsJuiceSpinCount;

    if (tagged >= 1 && tagged <= 8)
    {
      return Math.floor(tagged);
    }

    const motion = skill.jabsJuiceMotion;

    if (motion === 'spin-720')
    {
      return 2;
    }

    return 1;
  }

  /**
   * Default motion key for arc preset (kebab-case).
   * @readonly
   */
  static MotionArcKey = 'arc';

  /**
   * Default motion key for reversed arc preset (kebab-case).
   * @readonly
   */
  static MotionArcReverseKey = 'arc-reverse';

  /**
   * Resolves arc span in degrees for arc / arc-reverse (default 120).
   * @param {JABS_Action} action The executing action.
   * @returns {number}
   */
  static resolveJuiceArcSpanDegrees(action)
  {
    const skill = action.getBaseSkill();
    const n = skill.jabsJuiceArcSpanDegrees;
    if (n >= 30 && n <= 300)
    {
      return n;
    }

    return 120;
  }

  /**
   * True when skill notes request profile-gun overlay alignment (horizontal mirror vs full flip).
   * @param {JABS_Action} action The executing action.
   * @returns {boolean}
   */
  static resolveJuiceProfileGun(action)
  {
    return action.getBaseSkill().jabsJuiceProfileGun === true;
  }

  /**
   * Resolves IconSet “barrel / tip from +x at rotation 0” in radians from `<juiceStabTipDegrees>`.
   * Omitted: stab-forward uses {@link JuiceWeaponSwingMotionEffect.StabIconTipAngleRadians} (sword read);
   * bash / recoil default to {@link JuiceWeaponSwingMotionEffect.BashRecoilIconTipAngleRadians} (barrel −x in cell).
   * @param {JABS_Action} action The executing action.
   * @param {string} motionKey Resolved {@link #resolveJuiceMotion} key (kebab-case).
   * @returns {number}
   */
  static resolveJuiceWeaponTipRadians(action, motionKey)
  {
    const skill = action.getBaseSkill();
    const deg = skill.jabsJuiceStabTipDegrees;
    if (deg !== null && deg !== undefined && Number.isFinite(deg))
    {
      return (deg * Math.PI) / 180;
    }

    if (motionKey === JuiceWeaponSwingMotionEffect.MotionTypes.StabForward
      || motionKey === JuiceWeaponSwingMotionEffect.MotionTypes.Present)
    {
      return JuiceWeaponSwingMotionEffect.StabIconTipAngleRadians;
    }

    return JuiceWeaponSwingMotionEffect.BashRecoilIconTipAngleRadians;
  }

  /**
   * Equipped weapon or armor row used for icon + multiplier inference.
   * Offhand + exactly one weapon: orb/shield armor unless the executing offhand skill currently
   * belongs to the mainhand's provided offhand path; armor pick prefers rows tagged for this
   * skill id, then {@link Game_Actor#equips} slot 1 when it is armor.
   * @param {JABS_Battler} caster The caster.
   * @param {JABS_Action} action The strike action.
   * @returns {{ kind: 'weapon', item: RPG_Weapon } | { kind: 'armor', item: RPG_Armor } | null}
   */
  static #equippedGearForJuiceInference(caster, action)
  {
    const gb = caster.getBattler();

    if (gb.isActor() === false)
    {
      return null;
    }

    const weapons = gb.weapons();

    if (weapons.length === 0)
    {
      return null;
    }

    const slotKey = action.getCooldownType();

    if (slotKey === JABS_Button.Offhand && weapons.length > 1 && weapons[1])
    {
      return { kind: 'weapon', item: weapons[1] };
    }

    if (slotKey === JABS_Button.Offhand && weapons.length === 1)
    {
      const executingId = action.getBaseSkill().id;
      const [ w0 ] = weapons;

      // if the current offhand action comes from the mainhand's provided offhand path
      // (including any temporary state transform on that path), then the weapon owns the juice.
      if (gb.isMainhandProvidedOffhandSkill(executingId) === true)
      {
        return { kind: 'weapon', item: w0 };
      }

      const orbArmor = JuiceProfileResolver.#armorRowForOffhandSingleWeapon(gb, executingId);

      if (orbArmor)
      {
        return { kind: 'armor', item: orbArmor };
      }

      return { kind: 'weapon', item: w0 };
    }

    return { kind: 'weapon', item: weapons[0] };
  }

  /**
   * Picks the armor row that should drive orb/offhand-shield juice when only one weapon is equipped.
   * Body armor often sits earlier in {@link Game_Actor#armors} than the shield slot — match tags first, then slot 1.
   * @param {Game_Actor} gb The actor (callers ensure actor-only).
   * @param {number} executingId Skill id executing right now.
   * @returns {RPG_Armor|null}
   */
  static #armorRowForOffhandSingleWeapon(gb, executingId)
  {
    const armors = gb.armors();

    for (let i = 0; i < armors.length; i++)
    {
      const row = armors[i];

      if (row.jabsOffhandSkillId > 0 && row.jabsOffhandSkillId === executingId)
      {
        return row;
      }

      if (row.jabsSkillId > 0 && row.jabsSkillId === executingId)
      {
        return row;
      }
    }

    const equips = gb.equips();
    const [ , slot1 ] = equips;

    if (slot1 && DataManager.isArmor(slot1))
    {
      return slot1;
    }

    if (armors.length > 0 && armors[0])
    {
      return armors[0];
    }

    return null;
  }

  /**
   * Resolves the weapon icon index for swing overlay (-1 when unavailable).
   * Priority: `<jabsJuiceIcon:N>` tag → equipped gear ({@link #equippedGearForJuiceInference}).
   * Skill database `iconIndex` is not consulted here (tag or equip only).
   * @param {JABS_Battler} caster The caster.
   * @param {JABS_Action} action The executing action.
   * @returns {number}
   */
  static resolveWeaponIconIndex(caster, action)
  {
    const skill = action.getBaseSkill();
    const tagged = skill.jabsJuiceIconIndex;
    if (tagged >= 0)
    {
      return tagged;
    }

    const gear = JuiceProfileResolver.#equippedGearForJuiceInference(caster, action);
    if (!gear)
    {
      return -1;
    }

    return gear.item.iconIndex;
  }

  /**
   * Resolves a weapon style bucket key for multiplier lookup (defaults to 'default').
   * Uses the same gear row as {@link #resolveWeaponIconIndex} when inferring (weapon: `wtypeId` string;
   * armor-inferred: `a` + armor type id so rows do not collide with weapon keys).
   * @param {JABS_Battler} caster The caster.
   * @param {JABS_Action} action The executing action.
   * @returns {string}
   */
  static resolveWeaponStyleKey(caster, action)
  {
    const skill = action.getBaseSkill();
    const noteStyle = skill.jabsJuiceWeaponStyle;
    if (noteStyle !== String.empty)
    {
      return noteStyle;
    }

    const gear = JuiceProfileResolver.#equippedGearForJuiceInference(caster, action);
    if (!gear)
    {
      return 'default';
    }

    if (gear.kind === 'weapon')
    {
      return String(gear.item.wtypeId);
    }

    return `a${gear.item.atypeId}`;
  }

  /**
   * Looks up swing / tilt multipliers for the resolved style key.
   * @param {string} styleKey The style bucket.
   * @returns {{ tiltMul: number, swingMul: number }}
   */
  static resolveStyleMultipliers(styleKey)
  {
    const md = J.ABS.EXT.JUICE.Metadata;
    const table = md.weaponStyleMultipliers;
    const raw = table[styleKey] || table.default;
    if (!raw)
    {
      return new JuiceStyleMultiplierRow(1, 1);
    }

    return new JuiceStyleMultiplierRow(raw.tiltMul, raw.swingMul);
  }
}
//endregion JuiceProfileResolver

//region JuiceStyleMultiplierRow
/**
 * Tilt and swing intensity multipliers for one juice weapon-style bucket.
 */
class JuiceStyleMultiplierRow
{
  /**
   * @param {number} tiltMul Scale applied to strike tilt (radians envelope).
   * @param {number} swingMul Scale applied to weapon swing overlay peak rotation.
   */
  constructor(tiltMul = 1, swingMul = 1)
  {
    this.tiltMul = tiltMul;
    this.swingMul = swingMul;
  }
}
//endregion JuiceStyleMultiplierRow

//region Scene_Map (motion tick)
/**
 * Extends {@link Scene_Map#update}.<br/>
 * Advances queued juice tweens after the map scene finishes its own update pass.
 */
J.ABS.EXT.JUICE.Aliased.Scene_Map.set('update', Scene_Map.prototype.update);
Scene_Map.prototype.update = function()
{
  // perform original logic (characters, windows, etc.).
  J.ABS.EXT.JUICE.Aliased.Scene_Map.get('update')
    .call(this);

  // tick procedural juice after transforms from movement / poses are applied for this frame.
  JuiceMotionManager.frameTick();
};
//endregion Scene_Map (motion tick)

//# sourceMappingURL=J-ABS-Juice.js.map
