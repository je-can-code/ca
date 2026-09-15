//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.1 ABS-JUICE] Procedural map battler motion juice for JABS (squish, tilt, casting pulse, weapon swing).
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Motion
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Motion
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
 * Place after J-Motion (which owns character motion), and after
 * J-ABS-InputManager (dodge key binding), J-ABS-Poses (attack poses), and
 * J-ABS-Hitstop (impact timing). Juice wraps engine hooks that chain after
 * those extensions so gameplay semantics stay unchanged.
 *
 * Relationship to J-Motion:
 * Juice decides WHEN a battler reacts and HOW HARD; J-Motion decides what the
 * sprite looks like. Everything a battler does with its own body is declared on
 * J-Motion's composer under the `combat:reaction` source, so a reaction composes
 * with whatever ambient motion that battler already has rather than fighting it.
 * The four reactions register as ordinary motion types — `squish`, `tilt`,
 * `flip` and `charge` — which means an event page or a state can ask for them by
 * name too. The weapon swing overlay is the exception: it is a sprite this
 * plugin creates and owns, so it is driven directly rather than composed.
 *
 * ============================================================================
 * OVERLAYS OUTSIDE COMBAT
 * The overlay presets are available to events through the Apply Overlay plugin
 * command, which shows any IconSet cell over any character in any of the nine
 * presets. Naming an item, weapon, armor or skill reads that row's icon, which
 * keeps a cutscene pointing at the right picture after the database is edited;
 * a raw cell index is there for icons that belong to no row.
 *
 * Set Hold to true and the icon reaches its pose and stays there until Remove
 * Overlay withdraws it, which is what "the hero raises the amulet" looks like
 * when the scene is not ready to move on yet. The `present` preset lifts the
 * icon straight up over the character's head and is facing-agnostic.
 *
 * A held overlay survives everything that rebuilds the map's sprites — opening
 * and closing the menu, a map transfer, a scene change — because what is stored
 * is the request rather than the sprite, and sprites collect their overlays as
 * they are built. It follows the character, so a held icon on the player stays
 * with them across maps.
 *
 * It does NOT survive loading a save file, which matches how J-Motion's own
 * motions behave; nothing about the character's decoration is written to the
 * savefile by either plugin. A cutscene that holds something up should take it
 * down before it ends.
 *
 * Overlays are keyed by a source, exactly as J-Motion's motions are. Two
 * different sources can hold two icons on one character, and withdrawing one
 * leaves the other alone. Leave the source alone unless you need that.
 *
 * For the motions a character makes with its own BODY — squish, tilt, flip and
 * charge — use J-Motion's Apply Motion command instead. Those are registered
 * motion types and are already addressable by name from any event page.
 *
 * Coexistence with J-ABS-Poses:
 * Poses swap character sheets / patterns for readable attacks, which is a
 * different layer entirely from the transform J-Motion composes. Keep juice
 * intensities modest so pose readability stays primary.
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
 *   Forces weapon swing overlay icon index N on the IconSet sheet. When absent,
 *   the icon is inferred from the actor's equipped gear: dual-wield offhand uses
 *   weapon slot 2; a single offhand resolves the orb/shield armor icon by matching
 *   skill ids on armor rows or the equip slot when it is armor.
 *
 * <noJuice>
 *   Suppresses all juice motion on the caster when this skill executes.
 *   Equivalent to <juiceMotion:none>.
 *
 * <juiceMotion:NAME>
 *   Selects a preset weapon/caster motion. Valid values:
 *   Weapon overlay:  arc | arc-reverse | arc-oscillate | bash | present | recoil | spin |
 *                    spin-reverse | stab-forward
 *   Caster-body:     squish | pulse | flip | flip-reverse
 *   Suppress:        none  (equivalent to <noJuice>)
 *   Legacy keys: swing-top-down → arc; swing-bottom-up → arc-reverse; spin-360 → spin;
 *   spin-720 → spin; spin-360-reverse → spin-reverse.
 *   present lifts the icon upward on screen (screen-stable "brandish"; uses facing-up card).
 *   arc-oscillate sweeps the arc back and forth, alternating direction on each sweep (see
 *   juiceRepeatCount below for sweep count).
 *   On healing skills, omitting juiceMotion keeps caster-only support squish; any juiceMotion
 *   tag opts into full strike juice.
 *
 * <castMotion:NAME>
 *   Selects the body motion shown for the WHOLE of this skill's cast, as opposed to
 *   juiceMotion above, which plays once at execution. Valid values:
 *   squish  - a fixed-period squat, width swelling as height compresses, for the length
 *             of the cast. Reads as effort being spent rather than energy gathering.
 *   When omitted, the cast shows the default accelerating charge pulse.
 *
 * <castMotionPeriod:N>
 *   Frames per repetition of the cast motion (default 8, which is about seven squats a
 *   second). Smaller is faster. Only read when castMotion is set.
 *
 * <castMotionIntensity:PERCENT>
 *   Peak deformation of the cast motion as a percent of the sprite's true size: at the
 *   bottom of a 45 squat the sprite is 45% wider and correspondingly shorter. When
 *   omitted, the juice config's unarmedStrikeSquishIntensity is used, which is tuned for
 *   a poke rather than a workout. Only read when castMotion is set.
 *
 * <juiceSpan:N>
 *   Arc span in degrees for arc / arc-reverse / arc-oscillate (default 120; typical range 30–300).
 *
 * <juiceRepeatCount:N>
 *   Number of times to repeat the motion within the juice duration (default 1).
 *   For spin / spin-reverse: full rotations.
 *   For arc-oscillate: number of arc sweeps, alternating direction.
 *   For all other motions: full replays within the duration window.
 *
 * <juiceDuration:N>
 *   Overrides the swing animation duration in frames. When omitted, the global
 *   `weaponSwingFrames * 2` value from config.jabs.json is used.
 *
 * <juiceStabTipDegrees:N>
 *   Degrees from Pixi +x to bore/tip at rotation 0. Stab defaults to sword diagonal;
 *   bash / recoil default to barrel toward −x unless overridden. Accepts negative values.
 *
 * <juiceProfileGun>
 *   Side-profile firearm icon: mirror east/west instead of ~180° rotation (keeps the grip
 *   from reading upside-down when the art points left). Up/down still use ±90° rotation —
 *   pure side-view art cannot read as true top-down aim; use a separate sprite or tune degrees.
 *
 * <jabsJuiceWeaponStyle:key>
 *   Selects a multiplier row from the `profiles` map in `config.jabs.json` → `juice`.
 *   Keys are arbitrary identifiers (letters, digits, underscore, dash) and must already
 *   exist in the `profiles` map.
 *   When omitted, inferred keys match the swing icon row: weapon rows use the string weapon
 *   type id (e.g. wtypeId 1 → "1"); armor rows use "a" + armor type id (e.g. atypeId 4 → "a4")
 *   so armor buckets never collide with weapon type ids.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.2.1
 *    Corrected which hook the juice manager reads when resolving a motion.
 * - 1.2.0
 *    Caster and target body motion is now declared on J-Motion's composer rather
 *    than written onto the sprite directly, which makes J-Motion a hard dependency.
 *    A battler's reaction composes with whatever ambient motion it already carries
 *    instead of cancelling it, and the four reactions register as ordinary motion
 *    types - squish, tilt, flip and charge - so an event page or a state can ask
 *    for them by name. Every skill notetag is unchanged.
 *    The casting pulse is now renewed each frame with a short life rather than
 *    started once and cancelled, so a cast that ends by any route at all lapses on
 *    its own. It also holds its own source, so a battler struck while casting
 *    flinches in full instead of for a single frame, and it stops on death rather
 *    than shimmering through the corpse's collapse.
 *    The weapon swing overlay is unchanged and still drives its sprite directly.
 * - 1.1.1
 *    Simplified six guards that tested a value for null and undefined before
 *    asking whether it was finite, which Number.isFinite already answers for
 *    both. No behavioural change; the checks could never have decided anything.
 * - 1.1.0
 *    Added <noJuice> and <juiceMotion:none> to suppress caster motion outright.
 *    Added flip/flip-reverse caster-body full-rotation spin motions.
 *    Added arc-oscillate weapon motion (alternating-direction arc sweeps).
 *    Renamed <juiceSpinCount> to <juiceRepeatCount>, generalized to every motion.
 *    Added <juiceDuration:N> to override the per-cycle swing frame count.
 *    Support/utility skills (damage type None) no longer trigger a target
 *    hit-reaction squish that could cancel their own caster-side motion.
 *    Removed the juiceConfigValidation module; config shape is now
 *    guaranteed by the jmz-data-editor tool instead of validated at runtime.
 * - 1.0.1
 *    Fixed crash when the full menu (Scene_Menu) was opened while a juice motion was in flight.
 *    JuiceMotionManager.#effects is a static array that outlives any single scene instance;
 *    when SceneManager tears down Scene_Map, all Sprite_Character objects in the old spriteset
 *    have their Pixi transform nulled, and the next frameTick call on the still-queued effects
 *    would throw "Cannot read properties of null (reading 'scale')".
 *    Fix: Scene_Map.terminate() now calls JuiceMotionManager.clearAll() before sprites are
 *    destroyed, draining all pending effects and sprite locks proactively.
 *    Secondary safeguard: all sprite-bound effect subclasses (JuiceSquishMotionEffect,
 *    JuiceTiltMotionEffect, JuiceCastingPulseMotionEffect, JuiceWeaponSwingMotionEffect)
 *    implement isSpriteAlive() checked in frameTick; effects targeting a sprite with a null
 *    transform are silently discarded rather than allowed to crash.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @command applyOverlay
 * @text Apply Overlay
 * @desc Shows an icon over a character in one of the overlay presets.
 *
 * @arg target
 * @type select
 * @option Player
 * @option Follower
 * @option Event
 * @option This Event
 * @default This Event
 * @text Target
 * @desc Which character shows the icon.
 *
 * @arg targetId
 * @type number
 * @min 1
 * @default 1
 * @text Target ID
 * @desc The follower's party slot or the event's id. Ignored for the player and this event.
 *
 * @arg iconSource
 * @type select
 * @option Item
 * @option Weapon
 * @option Armor
 * @option Skill
 * @option Icon Index
 * @default Item
 * @text Icon Source
 * @desc Where the icon comes from. Naming a database row survives that row's icon being changed later.
 *
 * @arg iconId
 * @type number
 * @min 0
 * @default 1
 * @text Icon ID
 * @desc The database id of the row, or the IconSet cell index when the source is Icon Index.
 *
 * @arg motion
 * @type select
 * @option present
 * @option arc
 * @option arc-reverse
 * @option arc-oscillate
 * @option spin
 * @option spin-reverse
 * @option stab-forward
 * @option bash
 * @option recoil
 * @default present
 * @text Motion
 * @desc Which preset to pose the icon in. `present` lifts it straight up over the head.
 *
 * @arg duration
 * @type number
 * @min 1
 * @default 20
 * @text Duration
 * @desc How many frames the motion takes. When held, this is how long reaching the pose takes.
 *
 * @arg repeats
 * @type number
 * @min 1
 * @max 8
 * @default 1
 * @text Repeats
 * @desc How many times the motion repeats within the duration. Rotations, for the spin presets.
 *
 * @arg spanDegrees
 * @type number
 * @min 30
 * @max 300
 * @default 120
 * @text Arc Span
 * @desc How wide the arc sweeps, in degrees. Only the arc presets read this.
 *
 * @arg hold
 * @type boolean
 * @default false
 * @text Hold
 * @desc Park at the final pose and stay there until Remove Overlay withdraws it.
 *
 * @arg sourceKey
 * @type string
 * @default command
 * @text Source
 * @desc Who owns this overlay. Removing a source only removes what that source applied.
 *
 * @command removeOverlay
 * @text Remove Overlay
 * @desc Takes down whatever a source was holding up on a character.
 *
 * @arg target
 * @type select
 * @option Player
 * @option Follower
 * @option Event
 * @option This Event
 * @default This Event
 * @text Target
 * @desc Which character to take the icon from.
 *
 * @arg targetId
 * @type number
 * @min 1
 * @default 1
 * @text Target ID
 * @desc The follower's party slot or the event's id. Ignored for the player and this event.
 *
 * @arg sourceKey
 * @type string
 * @default command
 * @text Source
 * @desc Who is withdrawing. Only overlays applied under this same source are removed.
 */
//endregion annotations

//#region src/plugins/abs/ext/juice/_metadata/_pluginMetadata.js
var JAbsJuice_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
	* Loads the juice block from the external JABS config.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin by reading the `juice` block from `config.jabs.json`.
	* The JMZ data editor guarantees all fields are present and numeric; no shape validation is needed here.
	*/
	initializeMetadata() {
		const { target, caster, casting, profiles } = J.ABS.Metadata.ExternalConfig.juice;
		/**
		* Target squish intensity scale for physical impacts (dimensionless scale delta).
		* @type {number}
		*/
		this.targetPhysicalSquishIntensity = target.physicalSquishIntensity;
		/**
		* Target squish intensity scale for magical impacts.
		* @type {number}
		*/
		this.targetMagicalSquishIntensity = target.magicalSquishIntensity;
		/**
		* Frames to spend easing the target squish envelope.
		* @type {number}
		*/
		this.targetSquishFrames = Math.trunc(target.squishFrames);
		/**
		* Scalar applied to recipient squish when the incoming action is healing.
		* @type {number}
		*/
		this.healingRecipientSquishScale = target.healingRecipientScale;
		/**
		* Percent (0–100) describing how strongly repeated hits decay juice amplitude within the flurry window.
		* @type {number}
		*/
		this.flurryDecayPercent = Math.trunc(target.flurryDecayPercent);
		/**
		* Dodge-only caster squish intensity (cooldown key matches dodge skill).
		* @type {number}
		*/
		this.dodgeSquishIntensity = caster.dodgeSquishIntensity;
		/**
		* Frames for dodge squish easing.
		* @type {number}
		*/
		this.dodgeSquishFrames = Math.trunc(caster.dodgeSquishFrames);
		/**
		* Support/healing caster pulse intensity.
		* @type {number}
		*/
		this.supportCasterPulseIntensity = caster.supportPulseIntensity;
		/**
		* Frames for support caster easing.
		* @type {number}
		*/
		this.supportCasterPulseFrames = Math.trunc(caster.supportPulseFrames);
		/**
		* Peak body tilt (radians) applied to strikers at execution time (before style multipliers).
		* @type {number}
		*/
		this.casterStrikeTiltRadians = caster.strikeTiltRadians;
		/**
		* Frames spent tilting the striker.
		* @type {number}
		*/
		this.casterStrikeTiltFrames = Math.trunc(caster.strikeTiltFrames);
		/**
		* Peak weapon-overlay swing rotation (radians) before style multipliers.
		* @type {number}
		*/
		this.weaponSwingPeakRadians = caster.weaponSwingPeakRadians;
		/**
		* Frames for the weapon swing overlay arc.
		* @type {number}
		*/
		this.weaponSwingFrames = Math.trunc(caster.weaponSwingFrames);
		/**
		* Extra downward shift for IconSet juice overlays (pixels; positive moves toward feet).
		* @type {number}
		*/
		this.spriteJuiceVerticalOffsetPixels = Math.trunc(caster.spriteVerticalOffsetPixels);
		/**
		* Body squish intensity when no weapon icon overlay plays (unarmed / enemies without icons).
		* @type {number}
		*/
		this.unarmedStrikeSquishIntensity = caster.unarmedStrikeSquishIntensity;
		/**
		* Frames for unarmed strike easing.
		* @type {number}
		*/
		this.unarmedStrikeSquishFrames = Math.trunc(caster.unarmedStrikeSquishFrames);
		/**
		* Casting pulse amplitude while {@link JABS_Battler.isCasting} remains true.
		* @type {number}
		*/
		this.castingPulseAmplitude = casting.pulseAmplitude;
		/**
		* Named multiplier buckets keyed by weapon style tag (parsed `juice.profiles` map).
		* `default` is guaranteed to exist by the editor.
		* @type {Object<string, { tiltMul: number, swingMul: number }>}
		*/
		const styleEntries = Object.keys(profiles).map((key) => [key, {
			tiltMul: profiles[key].tiltMul,
			swingMul: profiles[key].swingMul
		}]);
		this.weaponStyleMultipliers = Object.fromEntries(styleEntries);
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.13.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (hasJabsRequirement === false) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
	const requiredMotionVersion = "1.1.0";
	const hasMotionRequirement = J.BASE.Helpers.satisfies(J.MOTION.Metadata.version.version(), requiredMotionVersion);
	if (hasMotionRequirement === false) {
		throw new Error(`Either missing J-Motion or has a lower version than the required: ${requiredMotionVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.JUICE = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.JUICE.Metadata = new JAbsJuice_PluginMetadata("J-ABS-Juice", "1.2.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.JUICE.Aliased = {};
J.ABS.EXT.JUICE.Aliased.JABS_Engine = new Map();
J.ABS.EXT.JUICE.Aliased.JABS_Battler = new Map();
J.ABS.EXT.JUICE.Aliased.Scene_Map = new Map();
J.ABS.EXT.JUICE.Aliased.Sprite_Character = new Map();
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
	* Skill: `<noJuice>` — suppresses all juice motion on the caster when this skill executes.
	*/
	NoJuice: /<noJuice>/i,
	/**
	* Skill: `<juiceMotion:NAME>` — selects a preset weapon motion (kebab-case).
	* Weapon overlay: arc | arc-reverse | arc-oscillate | bash | present | recoil | spin | spin-reverse | stab-forward
	* Caster-body: squish | pulse | flip | flip-reverse
	* Suppress: none (equivalent to <noJuice>)
	*/
	JuiceMotion: /<juiceMotion:[ ]?([a-zA-Z0-9_-]+)>/i,
	/**
	* Skill: `<juiceSpan:N>` — arc span in degrees for arc / arc-reverse (default 120).
	*/
	JuiceSpan: /<juiceSpan:[ ]?(\d+)>/i,
	/**
	* Skill: `<juiceRepeatCount:N>` — number of times to repeat the motion within the juice duration (default 1).
	* For spin / spin-reverse: full rotations. For arc-oscillate: number of arc sweeps (alternating direction).
	* For all other motions: number of full replays within the duration window.
	*/
	JuiceRepeatCount: /<juiceRepeatCount:[ ]?(\d+)>/i,
	/**
	* Skill: `<juiceDuration:N>` — overrides the swing animation duration in frames.
	* When omitted, the global `weaponSwingFrames * 2` metadata default is used.
	*/
	JuiceDuration: /<juiceDuration:[ ]?(\d+)>/i,
	/**
	* Skill: `<castMotion:NAME>` — selects the body motion shown for the whole of this skill's cast,
	* as opposed to `<juiceMotion:>`, which plays once at execution. Currently: squish.
	* When omitted, the cast shows the default accelerating charge pulse.
	*
	* <pre>
	* Structure:
	*  <castMotion:NAME>
	*
	* Example:
	*  <castMotion:squish>
	*
	* Translation:
	*  while this skill is being cast, the caster squats on a fixed rapid period
	* </pre>
	*/
	CastMotion: /<castMotion:[ ]?([a-zA-Z0-9_-]+)>/i,
	/**
	* Skill: `<castMotionPeriod:N>` — how many frames one repetition of the cast motion takes.
	* Smaller is faster. When omitted, the motion type's registered default period is used.
	*
	* <pre>
	* Structure:
	*  <castMotionPeriod:FRAMES>
	*
	* Example:
	*  <castMotionPeriod:6>
	*
	* Translation:
	*  one squat every six frames, ten a second
	* </pre>
	*/
	CastMotionPeriod: /<castMotionPeriod:[ ]?(\d+)>/i,
	/**
	* Skill: `<castMotionIntensity:PERCENT>` — how far the body deforms at the peak of each repetition
	* of the cast motion, as a percent of its true size. When omitted, the unarmed strike squish
	* intensity from the juice config is used, which is tuned for a poke rather than a workout.
	*
	* <pre>
	* Structure:
	*  <castMotionIntensity:PERCENT>
	*
	* Example:
	*  <castMotionIntensity:45>
	*
	* Translation:
	*  at the bottom of each squat the sprite is 45% wider and correspondingly shorter
	* </pre>
	*/
	CastMotionIntensity: /<castMotionIntensity:[ ]?(\d+)>/i,
	/**
	* Skill: `<juiceStabTipDegrees:N>` — tip/bore bearing from Pixi +x at rotation 0 (stab / bash / recoil; see help).
	*/
	JuiceStabTipDegrees: /<juiceStabTipDegrees:[ ]?(-?\d+)>/i,
	/**
	* Skill: `<juiceProfileGun>` — side-profile IconSet gun: flip horizontally instead of ~180° rotation on east/west.
	*/
	JuiceProfileGun: /<juiceProfileGun>/i
};

//#endregion
//#region src/plugins/abs/ext/juice/_metadata/meta.js
var PLUGIN_NAME = "J-ABS-Juice";
var PLUGIN_VERSION = "1.2.1";
var PLUGIN_DESC_TAG = "ABS-JUICE";

//#endregion
//#region src/plugins/abs/ext/juice/core/JuiceIconResolver.js
/**
* Works out which IconSet cell a plugin command is talking about.
*
* An event author thinks in "the amulet" rather than "cell 195", and the database already knows
* which icon the amulet uses. Naming the row is also the only version of this that survives editing
* the icon later — a raw index typed into a command in chapter two keeps pointing at whatever moves
* into that cell afterwards.
*
* The raw index is still offered, because an icon that belongs to no row at all is a real thing to
* want and there is nowhere else to say it.
*
* This is the one place in the ship that treats database ids as untrusted, and deliberately: every
* other id in the codebase comes from a notetag the JMZ editor wrote, while these are typed by hand
* into a command dialog and land in a cutscene that may not be played for another six months.
*/
var JuiceIconResolver = class JuiceIconResolver {
	/**
	* An item from `$dataItems`.
	* @type {string}
	*/
	static ITEM = "Item";
	/**
	* A weapon from `$dataWeapons`.
	* @type {string}
	*/
	static WEAPON = "Weapon";
	/**
	* An armor from `$dataArmors`.
	* @type {string}
	*/
	static ARMOR = "Armor";
	/**
	* A skill from `$dataSkills`.
	* @type {string}
	*/
	static SKILL = "Skill";
	/**
	* The IconSet cell index, given directly.
	* @type {string}
	*/
	static ICON_INDEX = "Icon Index";
	/**
	* Resolves a command's icon choice into an IconSet cell.
	* @param {string} source Which kind of thing names the icon.
	* @param {number} id The database id, or the cell index when the source is the index itself.
	* @returns {number} The IconSet cell, or `0` when the choice does not name one.
	*/
	static resolve(source, id) {
		if (source === JuiceIconResolver.ICON_INDEX) return id;
		const table = JuiceIconResolver.tableFor(source);
		if (table === null) {
			Diagnostics.warn("J-ABS-Juice", `unknown icon source: [ ${source} ]`, {
				source,
				id
			});
			return 0;
		}
		const entry = table.at(id);
		if (!entry) {
			Diagnostics.warn("J-ABS-Juice", `no ${source} exists with id: [ ${id} ]`, {
				source,
				id
			});
			return 0;
		}
		return entry.iconIndex;
	}
	/**
	* Gets the database table a given icon source reads from.
	* @param {string} source Which kind of thing names the icon.
	* @returns {RPG_BaseItem[]|null} The table, or null when the source names none.
	*/
	static tableFor(source) {
		switch (source) {
			case JuiceIconResolver.ITEM: return $dataItems;
			case JuiceIconResolver.WEAPON: return $dataWeapons;
			case JuiceIconResolver.ARMOR: return $dataArmors;
			case JuiceIconResolver.SKILL: return $dataSkills;
			default: return null;
		}
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/database/RPG_Skill.js
/**
* When {@code true}, all juice motion is suppressed for this skill on the caster.
* @type {boolean}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsNoJuice", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.NoJuice, false) === true;
} });
/**
* Skill note override for J-ABS-Juice weapon swing IconSet index (falls back to equipped weapon).
* @type {number}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceIconIndex", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceIcon, true) ?? -1;
} });
/**
* Skill note override for juice swing style bucket (matched against weapon-style multiplier keys).
* @type {string}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceWeaponStyle", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceWeaponStyle, true) ?? String.empty;
} });
/**
* Skill note override for the preset weapon motion key (kebab-case).
* @type {string}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceMotion", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceMotion, true) ?? String.empty;
} });
/**
* Skill note: the body motion shown for the whole of this skill's cast (`<castMotion:NAME>`).
* Empty when omitted, which means the default charge pulse.
* @type {string}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceCastMotion", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.CastMotion, true) ?? String.empty;
} });
/**
* Skill note: frames per repetition of the cast motion (`<castMotionPeriod:N>`).
* Zero when omitted, which lets the motion type's registered default period stand.
* @type {number}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceCastMotionPeriod", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.CastMotionPeriod, true) ?? 0;
} });
/**
* Skill note: peak deformation of the cast motion as a percent (`<castMotionIntensity:PERCENT>`).
* Zero when omitted, which lets the juice config's unarmed strike intensity stand.
* @type {number}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceCastMotionIntensity", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.CastMotionIntensity, true) ?? 0;
} });
/**
* Skill note: arc / arc-reverse span in degrees (`<juiceSpan:N>`). Omitted uses plugin default (120).
* @type {number}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceArcSpanDegrees", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceSpan, true) ?? -1;
} });
/**
* Skill note: `<juiceRepeatCount:N>` — number of times to repeat the motion within the juice duration.
* Applies to all motion types: spin / spin-reverse use it as full rotations; arc-oscillate uses it as
* sweep count (alternating direction); all others replay the motion N times within the duration.
* @type {number}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceRepeatCount", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceRepeatCount, true) ?? -1;
} });
/**
* Skill note: `<juiceDuration:N>` — overrides the weapon swing animation duration in frames.
* When omitted, the global metadata default (`weaponSwingFrames * 2`) is used.
* @type {number|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceDuration", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceDuration, true) ?? null;
} });
/**
* Skill note: tip/bearing from Pixi +x at rotation 0 in degrees (`<juiceStabTipDegrees:N>`).
* Omitted: stab-forward uses sword default; bash / recoil use π rad (barrel toward −x) unless tagged.
* @type {number|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceStabTipDegrees", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceStabTipDegrees, true) ?? null;
} });
/**
* Skill note: `<juiceProfileGun>` — profile gun overlay uses horizontal flip for left/right aim (see J-ABS-Juice help).
* @type {boolean}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsJuiceProfileGun", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.ABS.EXT.JUICE.RegExp.JuiceProfileGun, false) === true;
} });

//#endregion
//#region src/plugins/abs/ext/juice/helpers/JuiceFlurryStrikeRecord.js
/**
* One row of flurry decay state for a given action UUID and target UUID pair.
*/
var JuiceFlurryStrikeRecord = class {
	/**
	* @param {number} count How many qualifying hits have stacked in the short window.
	* @param {number} frame Last {@link Graphics.frameCount} when this row was touched.
	*/
	constructor(count, frame) {
		this.count = count;
		this.frame = frame;
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/helpers/JuiceMapSpriteFinder.js
/**
* Resolves the {@link Sprite_Character} that renders a map {@link Game_Character}.
*/
var JuiceMapSpriteFinder = class {
	/**
	* Finds the character sprite for the given logical character on the current map scene.
	* @param {Game_Character} mapCharacter The character whose sprite we want.
	* @returns {Sprite_Character|null}
	*/
	static findSpriteCharacterFor(mapCharacter) {
		const scene = SceneManager._scene;
		if (!scene.isMapScene()) {
			return null;
		}
		const spriteset = scene._spriteset;
		if (!spriteset) {
			return null;
		}
		return spriteset.findTargetSprite(mapCharacter);
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/models/JuiceBaseEffect.js
/**
* Queued per-frame juice work driven by {@link JuiceMotionManager#frameTick}.
* Subclasses implement {@link #tick}; override {@link #restore} when a cancel must snap baselines.
*/
var JuiceBaseEffect = class {
	/**
	* Advances this effect by one frame.
	* @returns {boolean} True while this instance should stay in the motion queue.
	*/
	tick() {
		throw new Error("JuiceBaseEffect.tick must be implemented by subclass.");
	}
	/**
	* Baseline restore when the motion manager tears an effect down early (default: no-op).
	*/
	restore() {}
	/**
	* Returns whether the target sprite for this effect is still alive and safe to write to.
	*
	* The base implementation always returns {@code true} (for non-sprite effects that do not
	* hold a sprite reference). Sprite-bound subclasses override this to check the Pixi
	* {@code destroyed} flag on their sprite; {@link JuiceMotionManager.frameTick} uses this
	* to skip effects whose sprite was destroyed mid-flight (e.g. during scene transitions).
	* @returns {boolean}
	*/
	isSpriteAlive() {
		return true;
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/models/JuiceWeaponSwingMotionEffect.js
/**
* Drives one weapon-icon overlay swing arc, then detaches and destroys the overlay sprite.
*/
var JuiceWeaponSwingMotionEffect = class JuiceWeaponSwingMotionEffect extends JuiceBaseEffect {
	/**
	* Unit forward vector (Pixi space: +x right, +y down) for map facing codes 1–9.
	* @param {number} dir Game_Character.direction().
	* @returns {{ x: number, y: number }}
	*/
	/**
	* Gets the stab tip angle radians.
	* @returns {number} The stabTipAngleRadians.
	*/
	stabTipAngleRadians() {
		return this._stabTipAngleRadians;
	}
	/**
	* Gets the profile gun.
	* @returns {boolean} The profileGun.
	*/
	profileGun() {
		return this._profileGun;
	}
	/**
	* Gets the overlay.
	* @returns {Bitmap} The overlay.
	*/
	overlay() {
		return this._overlay;
	}
	/**
	* Gets the scale mag.
	* @returns {number} The scaleMag.
	*/
	scaleMag() {
		return this._scaleMag;
	}
	/**
	* Gets the parent sprite.
	* @returns {Sprite} The parentSprite.
	*/
	parentSprite() {
		return this._parentSprite;
	}
	/**
	* Gets the frame.
	* @returns {number} The frame.
	*/
	frame() {
		return this._frame;
	}
	/**
	* Sets the frame.
	* @param {number} newFrame The new frame.
	*/
	setFrame(newFrame) {
		this._frame = newFrame;
	}
	/**
	* Gets the duration frames.
	* @returns {number} The durationFrames.
	*/
	durationFrames() {
		return this._durationFrames;
	}
	/**
	* Gets the swing direction.
	* @returns {number} The swingDirection.
	*/
	swingDirection() {
		return this._swingDirection;
	}
	/**
	* Gets the motion type.
	* @returns {string} The motionType.
	*/
	motionType() {
		return this._motionType;
	}
	/**
	* Gets the repeat count.
	* @returns {number} The repeatCount.
	*/
	repeatCount() {
		return this._repeatCount;
	}
	/**
	* Gets the trail.
	* @returns {{sprite: Sprite, ttl: number}[]} The trail.
	*/
	trail() {
		return this._trail;
	}
	/**
	* Sets the trail.
	* @param {{sprite: Sprite, ttl: number}[]} newTrail The new trail.
	*/
	setTrail(newTrail) {
		this._trail = newTrail;
	}
	/**
	* Gets the arc span degrees.
	* @returns {number} The arcSpanDegrees.
	*/
	arcSpanDegrees() {
		return this._arcSpanDegrees;
	}
	/**
	* Gets the base rotation.
	* @returns {number} The baseRotation.
	*/
	baseRotation() {
		return this._baseRotation;
	}
	/**
	* Gets the base x.
	* @returns {number} The baseX.
	*/
	baseX() {
		return this._baseX;
	}
	/**
	* Gets the base y.
	* @returns {number} The baseY.
	*/
	baseY() {
		return this._baseY;
	}
	/**
	* Gets whether this overlay parks at its final pose instead of tearing itself down.
	* @returns {boolean} The held.
	*/
	isHeld() {
		return this._held;
	}
	/**
	* Flags this overlay as one that parks at its final pose and waits to be withdrawn.
	*
	* Set after construction rather than passed in, because holding is a decision about how long the
	* overlay lives rather than anything about the motion it plays — a held `present` and a one-shot
	* `present` are the same thirteen arguments and the same arc, right up until the last frame.
	*/
	flagHeld() {
		this._held = true;
	}
	/**
	* Normalizes repeat count — floors to integer, defaults to 1 if invalid or below 1.
	* @param {number} repeatCount Candidate count from skill notes or resolver.
	* @returns {number}
	*/
	static #clampRepeatCount(repeatCount) {
		if (repeatCount === undefined || repeatCount === null || Number.isFinite(repeatCount) === false) {
			return 1;
		}
		const k = Math.floor(repeatCount);
		return k < 1 ? 1 : k;
	}
	static #forwardUnit(dir) {
		const h = Math.SQRT1_2;
		switch (dir) {
			case 2: return {
				x: 0,
				y: 1
			};
			case 4: return {
				x: -1,
				y: 0
			};
			case 6: return {
				x: 1,
				y: 0
			};
			case 8: return {
				x: 0,
				y: -1
			};
			case 1: return {
				x: -h,
				y: h
			};
			case 3: return {
				x: h,
				y: h
			};
			case 7: return {
				x: -h,
				y: -h
			};
			case 9: return {
				x: h,
				y: -h
			};
			default: return {
				x: -1,
				y: 0
			};
		}
	}
	/**
	* Maps clock hour (12 at top, CW positive hour index) to Pixi polar angle from +x axis (radians).
	* Accepts any real hour so callers can interpolate across midnight without `% 12` (continuous θ).
	* @param {number} hourFrom12CW Fractional hours from 12 o'clock clockwise (may be negative or > 12).
	* @returns {number}
	*/
	static hourToTheta(hourFrom12CW) {
		return -Math.PI / 2 + hourFrom12CW * (Math.PI / 6);
	}
	/**
	* Arc center hour per arc-table.md (facing → center of 120° arc on screen clock).
	* @param {number} dir Game_Character.direction().
	* @returns {number}
	*/
	static arcCenterHourFromDirection(dir) {
		switch (dir) {
			case 8: return 0;
			case 2: return 6;
			case 4: return 9;
			case 6: return 3;
			case 7: return 10.5;
			case 1: return 7.5;
			case 9: return 1.5;
			case 3: return 4.5;
			default: return 9;
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
	static computeArcPose(dir, phy, arcSpanDegrees, reverse, ease) {
		const juiceDy = J.ABS.EXT.JUICE.Metadata.spriteJuiceVerticalOffsetPixels;
		const cx = 0;
		const cy = -(phy * .5) + juiceDy;
		const orbit = phy * .38;
		const spanHours = arcSpanDegrees / 30;
		const centerH = JuiceWeaponSwingMotionEffect.arcCenterHourFromDirection(dir);
		const half = spanHours / 2;
		let hourFloat;
		if (reverse === false) {
			hourFloat = centerH + half - spanHours * ease;
		} else {
			hourFloat = centerH - half + spanHours * ease;
		}
		const theta = JuiceWeaponSwingMotionEffect.hourToTheta(hourFloat);
		const x = cx + Math.cos(theta) * orbit;
		const y = cy + Math.sin(theta) * orbit;
		return {
			x,
			y,
			theta
		};
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
	static computeArcTravelRadians(dir, phy, arcSpanDegrees, reverse, ease) {
		const eps = 1 / 96;
		let easeLo;
		let easeHi;
		if (ease <= eps) {
			easeLo = ease;
			easeHi = Math.min(ease + eps * 2, 1);
		} else if (ease >= 1 - eps) {
			easeHi = ease;
			easeLo = Math.max(ease - eps * 2, 0);
		} else {
			easeLo = ease - eps;
			easeHi = ease + eps;
		}
		const pLo = JuiceWeaponSwingMotionEffect.computeArcPose(dir, phy, arcSpanDegrees, reverse, easeLo);
		const pHi = JuiceWeaponSwingMotionEffect.computeArcPose(dir, phy, arcSpanDegrees, reverse, easeHi);
		const vx = pHi.x - pLo.x;
		const vy = pHi.y - pLo.y;
		const magSq = vx * vx + vy * vy;
		if (magSq < 1e-12) {
			const pose = JuiceWeaponSwingMotionEffect.computeArcPose(dir, phy, arcSpanDegrees, reverse, ease);
			const spanHours = arcSpanDegrees / 30;
			const dhDease = reverse === true ? spanHours : -spanHours;
			const dThetaDease = Math.PI / 6 * dhDease;
			const orbit = phy * .38;
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
	static bladeRotationFromTravelRadians(travelRadians) {
		return JuiceWeaponSwingMotionEffect.IconDiagonalRestRadians + travelRadians;
	}
	/**
	* Strike-phase ease for bash: 0 during wind-up, then smoothstep so contact snaps instead of floating.
	* @param {number} ease Outer eased progress 0..1 (swing tick).
	* @returns {number}
	*/
	static #bashStrikeEase(ease) {
		const strikeStart = .18;
		let strikePhase = 0;
		if (ease > strikeStart) {
			strikePhase = (ease - strikeStart) / (1 - strikeStart);
		}
		return strikePhase * strikePhase * (3 - 2 * strikePhase);
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
	static computeBashOffset(dir, phy, ease) {
		const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(dir);
		const perp = {
			x: -forward.y,
			y: forward.x
		};
		const windT = Math.min(1, ease / .32);
		const windBack = phy * .14 * (1 - windT) * (1 - windT);
		const strikeEase = JuiceWeaponSwingMotionEffect.#bashStrikeEase(ease);
		const fwdStrike = phy * .56 * strikeEase;
		const fwdScalar = -windBack + fwdStrike;
		const hookScalar = phy * .045 * Math.sin(Math.PI * strikeEase);
		const x = forward.x * fwdScalar + perp.x * hookScalar;
		const y = forward.y * fwdScalar + perp.y * hookScalar;
		return {
			x,
			y
		};
	}
	/**
	* Wrist snap during the strike phase only — lighter total twist so profile icons do not barrel-roll.
	* @param {number} ease Eased progress 0..1.
	* @returns {number}
	*/
	static bashWhipRotationRadians(ease) {
		const strikeEase = JuiceWeaponSwingMotionEffect.#bashStrikeEase(ease);
		return Math.sin(Math.PI * strikeEase) * .22;
	}
	/**
	* Recoil preset offset: shot kick — pulls back along facing and climbs slightly (ease 0 = max kick).
	* Rotation delta is added on top of {@link IconDiagonalRestRadians}.
	* @param {number} dir RMMZ 8-dir.
	* @param {number} phy Character pattern height.
	* @param {number} ease Eased progress 0..1 (matches swing tick).
	* @returns {{ x: number, y: number, rotationDelta: number }}
	*/
	static computeRecoilPose(dir, phy, ease) {
		const kick = 1 - ease;
		const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(dir);
		const backDist = phy * .22 * kick;
		const x = -forward.x * backDist;
		const y = -forward.y * backDist - phy * .06 * kick;
		const rotationDelta = -kick * .28;
		return {
			x,
			y,
			rotationDelta
		};
	}
	/**
	* Blade rotation for normal arc: polar tangent from orbit θ plus diagonal icon rest
	* (what the sheet was authored against).
	* @param {number} theta Orbit angle from {@link hourToTheta}.
	* @returns {number}
	*/
	static bladeRotationArcForward(theta) {
		return JuiceWeaponSwingMotionEffect.IconDiagonalRestRadians + theta + Math.PI / 2;
	}
	/**
	* Angle from Pixi +x to sword-tip direction inside this IconSet tile when {@link Sprite#rotation} === 0.
	* Vanilla sword slices sit corner-to-corner toward screen upper-left (−3π/4). Wrong prior guess assumed tip-at-west,
	* which made τ + π equal 0 for pure-west thrust — sprite stayed unturned while sliding sideways (“sorta stab”).
	* World tip angle = rotation + {@link StabIconTipAngleRadians} must equal thrust τ from {@link #forwardUnit}.
	* @readonly
	*/
	static StabIconTipAngleRadians = -Math.PI * 3 / 4;
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
	static stabBladeRotationRadians(dir, tipAngleRadians) {
		const tip = Number.isFinite(tipAngleRadians) ? tipAngleRadians : JuiceWeaponSwingMotionEffect.StabIconTipAngleRadians;
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
	static weaponTipAlign(dir, tipRadians, profileGun) {
		const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(dir);
		const thrustAngle = Math.atan2(forward.y, forward.x);
		let rotation = thrustAngle - tipRadians;
		if (profileGun === false) {
			return {
				rotation,
				mirrorX: false
			};
		}
		while (rotation > Math.PI) {
			rotation -= Math.PI * 2;
		}
		while (rotation <= -Math.PI) {
			rotation += Math.PI * 2;
		}
		let mirrorX = false;
		const nearPi = .15;
		if (Math.abs(Math.abs(rotation) - Math.PI) < nearPi) {
			rotation = 0;
			mirrorX = true;
		}
		return {
			rotation,
			mirrorX
		};
	}
	/**
	* Preset motion keys for the weapon overlay.
	* @readonly
	*/
	static MotionTypes = {
		Arc: "arc",
		ArcOscillate: "arc-oscillate",
		ArcReverse: "arc-reverse",
		Bash: "bash",
		Present: "present",
		Recoil: "recoil",
		Spin: "spin",
		SpinReverse: "spin-reverse",
		StabForward: "stab-forward"
	};
	/**
	* Determines whether a key names one of the overlay presets.
	*
	* The preset list is closed — every motion an overlay can play is a case in {@link #tick} — so
	* anything else is a typo, and a typo silently falling through to the `arc` default is how an
	* author loses an afternoon to a swing that will not swing.
	* @param {string} motionType The candidate preset key.
	* @returns {boolean}
	*/
	static isKnownMotionType(motionType) {
		const known = Object.values(JuiceWeaponSwingMotionEffect.MotionTypes);
		return known.includes(motionType);
	}
	/**
	* Determines whether a preset ignores which way the character is facing.
	*
	* Only `present` does. It lifts the icon straight up the screen and {@link JuiceWeaponSwingOverlay}
	* builds it against a fixed north regardless of what was asked for, so the facing a `present` was
	* spawned at is not information about it. That matters to anything holding one: a held overlay
	* rebuilt on every turn restarts its own ease, and for the one motion where turning changes
	* nothing that reads as the icon dropping and being raised again.
	* @param {string} motionType The overlay preset in question.
	* @returns {boolean}
	*/
	static isFacingAgnostic(motionType) {
		return motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Present;
	}
	/**
	* Which way an untagged icon points, for the presets that align to a tip rather than an orbit.
	*
	* Two readings of the IconSet cell, and which one is right depends on what the motion is doing
	* with it. A thrust presents the blade of a sword, drawn corner to corner; a bash or a recoil is
	* built around a barrel, which sits along the cell's negative x. Nothing else consults this,
	* because an arc orients itself from the direction it is travelling.
	* @param {string} motionType The overlay preset about to play.
	* @returns {number} Radians from +x to the tip at rotation 0.
	*/
	static defaultTipRadiansFor(motionType) {
		if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.StabForward || motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Present) {
			return JuiceWeaponSwingMotionEffect.StabIconTipAngleRadians;
		}
		return JuiceWeaponSwingMotionEffect.BashRecoilIconTipAngleRadians;
	}
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
	* @param {number} repeatCount Times to repeat the motion within duration (clamped 1–8).
	* @param {boolean} profileGun Skill `<juiceProfileGun>` — mirror for E/W aim instead of π rotation.
	*/
	constructor(parentSprite, overlay, baseRotation, peakRotationRadians, durationFrames, motionType, arcSpanDegrees, swingDirection, stabTipAngleRadians, neutralBaseX, neutralBaseY, repeatCount, profileGun) {
		super();
		this._parentSprite = parentSprite;
		this._overlay = overlay;
		this._baseRotation = baseRotation;
		this._peakRotationRadians = peakRotationRadians;
		this._durationFrames = durationFrames;
		this._motionType = motionType;
		this._frame = 0;
		this._arcSpanDegrees = arcSpanDegrees >= 30 && arcSpanDegrees <= 300 ? arcSpanDegrees : 120;
		/**
		* Facing used for orbit / stab / spin geometry for this swing only (not live {@link Game_Character#direction}).
		* @type {number}
		*/
		this._swingDirection = swingDirection;
		/**
		* Stab tip axis (radians); ignored except stab-forward.
		* @type {number}
		*/
		this._stabTipAngleRadians = Number.isFinite(stabTipAngleRadians) ? stabTipAngleRadians : JuiceWeaponSwingMotionEffect.StabIconTipAngleRadians;
		if (Number.isFinite(neutralBaseX) && Number.isFinite(neutralBaseY)) {
			this._baseX = neutralBaseX;
			this._baseY = neutralBaseY;
		} else {
			this._baseX = overlay.x;
			this._baseY = overlay.y;
		}
		/** @type {{ sprite: Sprite, ttl: number }[]} */
		this._trail = [];
		/**
		* Times to repeat the motion within the duration window (all motion types).
		* @type {number}
		*/
		this._repeatCount = JuiceWeaponSwingMotionEffect.#clampRepeatCount(repeatCount);
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
		/**
		* Whether this overlay parks at its final pose rather than tearing itself down.
		* @type {boolean}
		*/
		this._held = false;
	}
	/**
	* Applies thrust-aligned rotation plus extras; updates mirror scale when {@link #_profileGun}.
	* @param {number} dir Facing direction.
	* @param {number} extraRotationRadians Added on top of aligned thrust (whip, recoil kick, etc.).
	*/
	#applyTipAlignedRotation(dir, extraRotationRadians) {
		const align = JuiceWeaponSwingMotionEffect.weaponTipAlign(dir, this.stabTipAngleRadians(), this.profileGun());
		this.overlay().rotation = align.rotation + extraRotationRadians;
		if (this.profileGun() === true) {
			this.overlay().scale.x = this.scaleMag() * (align.mirrorX ? -1 : 1);
			this.overlay().scale.y = this.scaleMag();
		}
	}
	/**
	* Returns false when the parent character sprite's Pixi transform has been nulled out.
	*
	* Pixi sets {@code transform = null} when a sprite is destroyed; it does NOT reliably set
	* a {@code destroyed} boolean in all RMMZ-bundled versions, so checking transform directly
	* is the safe guard. The overlay is a child of the parent; a null transform on the parent
	* means both are gone and ticking either would immediately throw.
	* @returns {boolean}
	*/
	isSpriteAlive() {
		return !!this.parentSprite().transform;
	}
	/**
	* Advances one frame of the swing arc.
	* @returns {boolean} True while the effect should stay in the runner queue.
	*/
	tick() {
		this.setFrame(this.frame() + 1);
		const t = Math.min(this.frame() / this.durationFrames(), 1);
		const ease = 1 - Math.pow(1 - t, 3);
		const phy = this.parentSprite().patternHeight();
		const dir = this.swingDirection();
		switch (this.motionType()) {
			case JuiceWeaponSwingMotionEffect.MotionTypes.ArcReverse:
				this.#tickArc(phy, dir, ease, true);
				break;
			case JuiceWeaponSwingMotionEffect.MotionTypes.ArcOscillate:
				this.#tickArcOscillate(phy, dir, t);
				break;
			case JuiceWeaponSwingMotionEffect.MotionTypes.Spin:
				this.#tickSpin(phy, t, this.repeatCount(), 1);
				break;
			case JuiceWeaponSwingMotionEffect.MotionTypes.SpinReverse:
				this.#tickSpin(phy, t, this.repeatCount(), -1);
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
		if (this.frame() >= this.durationFrames()) {
			if (this.isHeld() === true) return true;
			this.restore();
			return false;
		}
		return true;
	}
	/**
	* Implements {@link JuiceBaseEffect#restore}.<br/>
	* Detaches and destroys the overlay and everything trailing it.
	*
	* This is reached from two directions: a one-shot swing reaching the end of its duration, and
	* something withdrawing a held overlay long after it stopped moving. Both have to leave the
	* parent sprite exactly as they found it, so neither owns the teardown and both call this.
	*/
	restore() {
		if (this.isSpriteAlive() === false) return;
		this.parentSprite().removeChild(this.overlay());
		this.overlay().destroy();
		this.trail().forEach((trail) => {
			this.parentSprite().removeChild(trail.sprite);
			trail.sprite.destroy();
		}, this);
		this.trail().length = 0;
	}
	/**
	* Clock-orbit arc preset (arc-table.md); arc = CCW on clock, arc-reverse = CW.
	* @param {number} phy Pattern height.
	* @param {number} dir Facing direction.
	* @param {number} ease Eased progress (0..1).
	* @param {boolean} reverse Arc-reverse when true.
	*/
	#tickArc(phy, dir, ease, reverse) {
		const pose = JuiceWeaponSwingMotionEffect.computeArcPose(dir, phy, this.arcSpanDegrees(), reverse, ease);
		this.overlay().x = pose.x;
		this.overlay().y = pose.y;
		if (reverse === true) {
			const travel = JuiceWeaponSwingMotionEffect.computeArcTravelRadians(dir, phy, this.arcSpanDegrees(), true, ease);
			this.overlay().rotation = JuiceWeaponSwingMotionEffect.bladeRotationFromTravelRadians(travel);
			return;
		}
		this.overlay().rotation = JuiceWeaponSwingMotionEffect.bladeRotationArcForward(pose.theta);
	}
	/**
	* Alternating arc sweeps: arc → arc-reverse → arc … for `_repeatCount` total passes.
	* Each pass occupies an equal slice of the total duration; direction flips each slice.
	* @param {number} phy Pattern height.
	* @param {number} dir Facing direction.
	* @param {number} t Linear progress (0..1).
	*/
	#tickArcOscillate(phy, dir, t) {
		const sliceT = t * this.repeatCount() % 1;
		const sliceIndex = Math.floor(t * this.repeatCount());
		const reverse = sliceIndex % 2 === 1;
		const ease = 1 - Math.pow(1 - sliceT, 3);
		this.#tickArc(phy, dir, ease, reverse);
	}
	/**
	* Ticks a spin flourish around the battler center.
	* @param {number} phy Pattern height for scale.
	* @param {number} t Linear progress (0..1).
	* @param {number} spinCount Number of full rotations.
	* @param {number} spinDirectionSign +1 default (CCW in Pixi); −1 for {@link MotionTypes.SpinReverse}.
	*/
	#tickSpin(phy, t, spinCount, spinDirectionSign) {
		const sign = spinDirectionSign === -1 ? -1 : 1;
		const radians = Math.PI * 2 * spinCount * t * sign;
		this.overlay().rotation = this.baseRotation() + radians;
		const centerX = 0;
		const centerY = -(phy * .5);
		const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(this.swingDirection());
		const front = phy * .12;
		const frontX = forward.x * front;
		const frontY = forward.y * front;
		const phaseOffset = -(Math.PI / 6);
		const theta = radians + phaseOffset;
		const orbit = phy * .38;
		const juiceDy = J.ABS.EXT.JUICE.Metadata.spriteJuiceVerticalOffsetPixels;
		this.overlay().x = centerX + frontX + Math.cos(theta) * orbit;
		this.overlay().y = centerY + frontY + Math.sin(theta) * orbit + juiceDy;
		if (this.shouldSpawnTrail() === true) {
			this.#spawnTrailAfterimage();
		}
	}
	/**
	* Determines whether this frame should leave an afterimage behind.
	*
	* A trail is a record of movement, and a held overlay stops moving the moment it arrives. Left
	* ungated, a parked spin would keep stamping a ghost every other frame forever, on a spot the
	* overlay has not left — no leak, since each expires on its own ttl, but a permanent shimmer of
	* sprite churn around an icon that is supposed to be sitting still.
	* @returns {boolean}
	*/
	shouldSpawnTrail() {
		if (this.frame() % 2 !== 0) return false;
		if (this.isHeld() === false) return true;
		return this.frame() < this.durationFrames();
	}
	/**
	* Spawns one afterimage based on the current overlay state.
	*/
	#spawnTrailAfterimage() {
		const ghost = new Sprite();
		ghost.bitmap = this.overlay().bitmap;
		ghost.anchor.x = this.overlay().anchor.x;
		ghost.anchor.y = this.overlay().anchor.y;
		ghost.scale.x = this.overlay().scale.x;
		ghost.scale.y = this.overlay().scale.y;
		ghost.opacity = 140;
		ghost.blendMode = 1;
		ghost.setFrame(this.overlay()._frame.x, this.overlay()._frame.y, this.overlay()._frame.width, this.overlay()._frame.height);
		ghost.x = this.overlay().x;
		ghost.y = this.overlay().y;
		ghost.rotation = this.overlay().rotation;
		this.parentSprite().addChild(ghost);
		this.trail().push({
			sprite: ghost,
			ttl: 10
		});
	}
	/**
	* Ticks and fades all existing trail afterimages.
	*/
	#tickTrail() {
		if (this.trail().length === 0) {
			return;
		}
		const survivors = [];
		this.trail().forEach((trail) => {
			trail.ttl -= 1;
			trail.sprite.opacity = Math.max(0, Math.round(trail.ttl / 10 * 140));
			if (trail.ttl > 0) {
				survivors.push(trail);
				return;
			}
			this.parentSprite().removeChild(trail.sprite);
			trail.sprite.destroy();
		});
		this.setTrail(survivors);
	}
	/**
	* Ticks a forward stab (mostly translation, minimal rotation).
	* @param {number} phy Pattern height for scale.
	* @param {number} dir Facing direction.
	* @param {number} ease Eased progress (0..1).
	*/
	#tickStabForward(phy, dir, ease) {
		this.#applyTipAlignedRotation(dir, 0);
		const forward = JuiceWeaponSwingMotionEffect.#forwardUnit(dir);
		const dist = phy * .55;
		const dx = forward.x * dist;
		const dy = forward.y * dist;
		this.overlay().x = this.baseX() + dx * ease;
		this.overlay().y = this.baseY() + dy * ease;
	}
	/**
	* Lifts the icon straight upward on screen (facing-agnostic “present this item”).
	* @param {number} phy Character pattern height.
	* @param {number} ease Eased progress 0..1.
	*/
	#tickPresent(phy, ease) {
		const lift = phy * .42;
		this.overlay().x = this.baseX();
		this.overlay().y = this.baseY() - lift * ease;
		this.overlay().rotation = this.baseRotation();
	}
	/**
	* Ticks bash smack — thrust-aligned weapon plus a single wrist hump (no velocity-spin rotation).
	* @param {number} phy Pattern height.
	* @param {number} dir Facing direction.
	* @param {number} ease Eased progress 0..1.
	*/
	#tickBash(phy, dir, ease) {
		const off = JuiceWeaponSwingMotionEffect.computeBashOffset(dir, phy, ease);
		const whip = JuiceWeaponSwingMotionEffect.bashWhipRotationRadians(ease);
		this.overlay().x = this.baseX() + off.x;
		this.overlay().y = this.baseY() + off.y;
		this.#applyTipAlignedRotation(dir, whip);
	}
	/**
	* Ticks firearm-style recoil (pull back + settle).
	* @param {number} phy Pattern height.
	* @param {number} dir Facing direction.
	* @param {number} ease Eased progress 0..1.
	*/
	#tickRecoil(phy, dir, ease) {
		const p = JuiceWeaponSwingMotionEffect.computeRecoilPose(dir, phy, ease);
		this.overlay().x = this.baseX() + p.x;
		this.overlay().y = this.baseY() + p.y;
		this.#applyTipAlignedRotation(dir, p.rotationDelta);
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/resolvers/JuiceStyleMultiplierRow.js
/**
* Tilt and swing intensity multipliers for one juice weapon-style bucket.
*/
var JuiceStyleMultiplierRow = class {
	/**
	* @param {number} tiltMul Scale applied to strike tilt (radians envelope).
	* @param {number} swingMul Scale applied to weapon swing overlay peak rotation.
	*/
	constructor(tiltMul = 1, swingMul = 1) {
		this.tiltMul = tiltMul;
		this.swingMul = swingMul;
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/resolvers/JuiceProfileResolver.js
/**
* Resolves weapon / armor icon indices and swing style keys for juice profiles.
*/
var JuiceProfileResolver = class JuiceProfileResolver {
	/**
	* Resolves the selected preset motion for this skill (defaults to arc).
	* Normalizes legacy keys (swing-top-down / swing-bottom-up; spin-360 / spin-720 / spin-360-reverse).
	* @param {JABS_Action} action The executing action.
	* @returns {string}
	*/
	static resolveJuiceMotion(action) {
		const skill = action.getBaseSkill();
		const motion = skill.jabsJuiceMotion;
		if (motion === String.empty) {
			return JuiceProfileResolver.MotionArcKey;
		}
		if (motion === "arc-oscillate") {
			return JuiceWeaponSwingMotionEffect.MotionTypes.ArcOscillate;
		}
		if (motion === "swing-top-down") {
			return JuiceProfileResolver.MotionArcKey;
		}
		if (motion === "swing-bottom-up") {
			return JuiceProfileResolver.MotionArcReverseKey;
		}
		if (motion === "spin-360") {
			return JuiceWeaponSwingMotionEffect.MotionTypes.Spin;
		}
		if (motion === "spin-720") {
			return JuiceWeaponSwingMotionEffect.MotionTypes.Spin;
		}
		if (motion === "spin-360-reverse") {
			return JuiceWeaponSwingMotionEffect.MotionTypes.SpinReverse;
		}
		return motion;
	}
	/**
	* Number of times to repeat the motion within the juice duration (1–8).
	* Applies universally: rotations for spin, sweeps for arc-oscillate, replays for all others.
	* @param {JABS_Action} action The executing action.
	* @returns {number}
	*/
	static resolveJuiceRepeatCount(action) {
		const skill = action.getBaseSkill();
		const tagged = skill.jabsJuiceRepeatCount;
		if (tagged >= 1) {
			return Math.floor(tagged);
		}
		return 1;
	}
	/**
	* Default motion key for arc preset (kebab-case).
	* @readonly
	*/
	static MotionArcKey = "arc";
	/**
	* Default motion key for reversed arc preset (kebab-case).
	* @readonly
	*/
	static MotionArcReverseKey = "arc-reverse";
	/**
	* Resolves arc span in degrees for arc / arc-reverse (default 120).
	* @param {JABS_Action} action The executing action.
	* @returns {number}
	*/
	static resolveJuiceArcSpanDegrees(action) {
		const skill = action.getBaseSkill();
		const n = skill.jabsJuiceArcSpanDegrees;
		if (n >= 30 && n <= 300) {
			return n;
		}
		return 120;
	}
	/**
	* Override swing duration in frames from `<juiceDuration:N>`, or null to use the metadata default.
	* @param {JABS_Action} action The executing action.
	* @returns {number|null}
	*/
	static resolveJuiceDuration(action) {
		return action.getBaseSkill().jabsJuiceDuration;
	}
	/**
	* True when skill notes request profile-gun overlay alignment (horizontal mirror vs full flip).
	* @param {JABS_Action} action The executing action.
	* @returns {boolean}
	*/
	static resolveJuiceProfileGun(action) {
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
	static resolveJuiceWeaponTipRadians(action, motionKey) {
		const skill = action.getBaseSkill();
		const deg = skill.jabsJuiceStabTipDegrees;
		if (Number.isFinite(deg)) {
			return deg * Math.PI / 180;
		}
		return JuiceWeaponSwingMotionEffect.defaultTipRadiansFor(motionKey);
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
	static #equippedGearForJuiceInference(caster, action) {
		const gb = caster.getBattler();
		if (gb.isActor() === false) {
			return null;
		}
		const weapons = gb.weapons();
		if (weapons.length === 0) {
			return null;
		}
		const slotKey = action.getCooldownType();
		if (slotKey === JABS_Button.Offhand && weapons.length > 1 && weapons[1]) {
			return {
				kind: "weapon",
				item: weapons[1]
			};
		}
		if (slotKey === JABS_Button.Offhand && weapons.length === 1) {
			const executingId = action.getBaseSkill().id;
			const [w0] = weapons;
			if (gb.isMainhandProvidedOffhandSkill(executingId) === true) {
				return {
					kind: "weapon",
					item: w0
				};
			}
			const orbArmor = JuiceProfileResolver.#armorRowForOffhandSingleWeapon(gb, executingId);
			if (orbArmor) {
				return {
					kind: "armor",
					item: orbArmor
				};
			}
			return {
				kind: "weapon",
				item: w0
			};
		}
		return {
			kind: "weapon",
			item: weapons[0]
		};
	}
	/**
	* Picks the armor row that should drive orb/offhand-shield juice when only one weapon is equipped.
	* Body armor often sits earlier in {@link Game_Actor#armors} than the shield slot — match tags first, then slot 1.
	* @param {Game_Actor} gb The actor (callers ensure actor-only).
	* @param {number} executingId Skill id executing right now.
	* @returns {RPG_Armor|null}
	*/
	static #armorRowForOffhandSingleWeapon(gb, executingId) {
		const armors = gb.armors();
		for (let i = 0; i < armors.length; i++) {
			const row = armors[i];
			if (row.jabsOffhandSkillId > 0 && row.jabsOffhandSkillId === executingId) {
				return row;
			}
			if (row.jabsSkillId > 0 && row.jabsSkillId === executingId) {
				return row;
			}
		}
		const equips = gb.equips();
		const [, slot1] = equips;
		if (slot1 && DataManager.isArmor(slot1)) {
			return slot1;
		}
		if (armors.length > 0 && armors[0]) {
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
	static resolveWeaponIconIndex(caster, action) {
		const skill = action.getBaseSkill();
		const tagged = skill.jabsJuiceIconIndex;
		if (tagged >= 0) {
			return tagged;
		}
		const gear = JuiceProfileResolver.#equippedGearForJuiceInference(caster, action);
		if (!gear) {
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
	static resolveWeaponStyleKey(caster, action) {
		const skill = action.getBaseSkill();
		const noteStyle = skill.jabsJuiceWeaponStyle;
		if (noteStyle !== String.empty) {
			return noteStyle;
		}
		const gear = JuiceProfileResolver.#equippedGearForJuiceInference(caster, action);
		if (!gear) {
			return "default";
		}
		if (gear.kind === "weapon") {
			return String(gear.item.wtypeId);
		}
		return `a${gear.item.atypeId}`;
	}
	/**
	* Looks up swing / tilt multipliers for the resolved style key.
	* @param {string} styleKey The style bucket.
	* @returns {{ tiltMul: number, swingMul: number }}
	*/
	static resolveStyleMultipliers(styleKey) {
		const md = J.ABS.EXT.JUICE.Metadata;
		const table = md.weaponStyleMultipliers;
		const raw = table[styleKey] || table.default;
		if (!raw) {
			return new JuiceStyleMultiplierRow(1, 1);
		}
		return new JuiceStyleMultiplierRow(raw.tiltMul, raw.swingMul);
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/managers/JuiceMotionManager.js
/**
* Turns combat events into the motion a battler makes about them.
*
* Everything that happens to a character's own body — squashing on impact, leaning into a swing,
* flipping, shimmering while it charges — is declared on J-Motion's composer and animated there.
* This class decides *when* a reaction happens and *how hard*; it does not animate anything, and it
* never touches a sprite to do it.
*
* That split is why an enemy can be breathing, poisoned and recoiling from a hit at the same time
* without any of those three knowing the others exist. The composer resolves them.
*
* Every reaction is declared under one source key, so a new one replaces whatever the last one was
* doing. A battler has one body and can only be doing one thing with it, which used to be enforced
* with a lock and is now simply what sharing a source key means.
*
* The queue further down is the exception, and it is a different job: the weapon swing overlay is a
* sprite this plugin creates and owns outright, not a character the engine is drawing for us, so it
* has nowhere to be composed and is driven frame by frame from here.
*
* `CharacterMotionComposer` and `MotionDeclaration` are reached as globals rather than imports:
* they ship inside J-Motion's bundle and are hoisted by the time this one loads.
*/
var JuiceMotionManager = class JuiceMotionManager {
	/**
	* The source key every combat reaction is declared under.
	*
	* `combat` is the highest-priority source there is, which is what lets a reaction claim scale or
	* rotation away from whatever ambient motion a battler happens to be carrying.
	* @type {string}
	*/
	static REACTION_SOURCE_KEY = "combat:reaction";
	/**
	* The source key the casting pulse is declared under.
	*
	* Deliberately not the reaction key. The pulse is renewed every frame and relies on the composer
	* recognising an unchanged declaration, while a one-shot reaction deliberately defeats that same
	* check to restart itself — sharing a key means each destroys the other, and a battler struck
	* while casting would flinch for exactly one frame before the next renewal wiped it.
	*
	* Separated, they compose: both rank `combat`, the reaction is declared later so it takes the
	* scale claim, and the charge glow keeps burning underneath it.
	* @type {string}
	*/
	static CASTING_SOURCE_KEY = "combat:casting";
	/**
	* Sprite-bound effects this plugin drives itself, rather than through the composer.
	* @type {JuiceBaseEffect[]}
	*/
	static #effects = [];
	/**
	* Squashes a battler's body, optionally several times over.
	* @param {Game_Character} character The character reacting.
	* @param {number} intensity How far the body deforms at the peak of a cycle, ex: `0.12`.
	* @param {number} durationFrames How long one cycle lasts.
	* @param {number} [repeatCount=1] How many cycles to run.
	*/
	static scheduleSquish(character, intensity, durationFrames, repeatCount = 1) {
		const parameters = [
			intensity,
			durationFrames,
			repeatCount
		];
		const totalFrames = durationFrames * repeatCount;
		JuiceMotionManager.#declareReaction(character, "squish", parameters, totalFrames);
	}
	/**
	* Leans a battler's body into a swing.
	* @param {Game_Character} character The character reacting.
	* @param {number} peakRadians How far it leans at the peak of the arc.
	* @param {number} durationFrames How long the lean lasts.
	*/
	static scheduleTilt(character, peakRadians, durationFrames) {
		const parameters = [peakRadians, durationFrames];
		JuiceMotionManager.#declareReaction(character, "tilt", parameters, durationFrames);
	}
	/**
	* Turns a battler's body through one or more complete rotations.
	* @param {Game_Character} character The character reacting.
	* @param {string} direction Which way it turns: `cw` or `ccw`.
	* @param {number} durationFrames How long the whole flip takes.
	* @param {number} [turnCount=1] How many complete turns to make in that time.
	*/
	static scheduleFlipBody(character, direction, durationFrames, turnCount = 1) {
		const parameters = [
			turnCount,
			durationFrames,
			direction
		];
		JuiceMotionManager.#declareReaction(character, "flip", parameters, durationFrames);
	}
	/**
	* Keeps a battler shimmering while it charges a skill.
	*
	* This is declared with no duration and is expected to be called again on every frame the cast is
	* still running. Re-declaring the same thing does not restart it — the composer recognises an
	* unchanged declaration and lets the effect keep running — so the pulse builds continuously while
	* something keeps asking for it and lapses shortly after anything stops.
	*
	* That is deliberately a heartbeat rather than a start and a stop. A cast can end in ways nobody
	* hooked: the caster is killed mid-incantation, knocked out of it, or moved to another map. An
	* explicit teardown has to know about every one of those, while a heartbeat only has to stop
	* beating.
	* @param {Game_Character} character The character charging.
	* @param {number} amplitude How far it swells at the peak of a pulse, ex: `0.04`.
	* @param {number} heartbeatFrames How long to keep pulsing after the last call.
	*/
	static scheduleCastingPulse(character, amplitude, heartbeatFrames) {
		const sourceKey = JuiceMotionManager.CASTING_SOURCE_KEY;
		const declaration = new MotionDeclaration("charge", [amplitude], sourceKey);
		CharacterMotionComposer.declare(character, sourceKey, [declaration], heartbeatFrames);
	}
	/**
	* Keeps a battler squatting while it works something off mid-cast.
	*
	* The same heartbeat contract as {@link #scheduleCastingPulse}, on the same source key- a cast
	* makes exactly one casting motion, so whichever of the two a skill asks for replaces the other,
	* and {@link #cancelCastingPulse} settles either. Only the shape differs: a fixed-period squash
	* rather than an accelerating swell.
	* @param {Game_Character} character The character working it off.
	* @param {number} intensity How far the body deforms at the peak of a squat, ex: `0.14`.
	* @param {number} periodFrames How many frames one squat takes.
	* @param {number} heartbeatFrames How long to keep squatting after the last call.
	*/
	static scheduleCastingSquish(character, intensity, periodFrames, heartbeatFrames) {
		const sourceKey = JuiceMotionManager.CASTING_SOURCE_KEY;
		const declaration = new MotionDeclaration("castSquish", [intensity, periodFrames], sourceKey);
		CharacterMotionComposer.declare(character, sourceKey, [declaration], heartbeatFrames);
	}
	/**
	* Stops a battler's casting pulse.
	* @param {Game_Character} character The character to settle.
	*/
	static cancelCastingPulse(character) {
		CharacterMotionComposer.removeDeclarations(character, JuiceMotionManager.CASTING_SOURCE_KEY);
	}
	/**
	* Stops every motion a battler is making about combat, of either kind.
	*
	* Used when something ends a battler's participation outright rather than ending one reaction —
	* a death, most of all, where anything still shimmering would be shimmering on a corpse.
	* @param {Game_Character} character The character to settle.
	*/
	static cancelForCharacter(character) {
		CharacterMotionComposer.removeDeclarations(character, JuiceMotionManager.REACTION_SOURCE_KEY);
		CharacterMotionComposer.removeDeclarations(character, JuiceMotionManager.CASTING_SOURCE_KEY);
	}
	/**
	* Declares a one-off reaction with a frame budget.
	*
	* The previous reaction is withdrawn before the new one is declared, which looks redundant next to
	* a method whose whole job is to replace what a source had — and is not. The composer deliberately
	* leaves an unchanged declaration alone so that an ambient motion is not restarted every time a
	* map refreshes, and a reaction wants the opposite: hitting something twice with the same weapon
	* has to squash it twice, not extend one squash into a longer one.
	* @param {Game_Character} character The character reacting.
	* @param {string} motionType The registered motion to run.
	* @param {Array<string|number>} parameters The motion's parameters, in registered order.
	* @param {number} totalFrames How long the whole reaction lasts.
	*/
	static #declareReaction(character, motionType, parameters, totalFrames) {
		const sourceKey = JuiceMotionManager.REACTION_SOURCE_KEY;
		const declaration = new MotionDeclaration(motionType, parameters, sourceKey);
		CharacterMotionComposer.removeDeclarations(character, sourceKey);
		CharacterMotionComposer.declare(character, sourceKey, [declaration], totalFrames);
	}
	/**
	* Discards every queued overlay effect.
	*
	* Call this whenever the map scene is about to be torn down, so that effects referencing
	* soon-to-be-destroyed sprites do not linger in the static queue and crash the next `Scene_Map`
	* the first time {@link #frameTick} runs again.
	*
	* Character reactions need no equivalent: the composer keys them by character in a `WeakMap`, so
	* leaving a map takes its motions with it.
	*/
	static clearAll() {
		JuiceMotionManager.#effects.length = 0;
	}
	/**
	* Registers a sprite-bound effect on the overlay queue.
	* @param {JuiceBaseEffect} effect The effect instance.
	*/
	static pushExternalEffect(effect) {
		JuiceMotionManager.#effects.push(effect);
	}
	/**
	* Tears one effect down and takes it off the queue ahead of its natural end.
	*
	* Only a held overlay ever needs this. Everything else in the queue ends by saying so from
	* {@link JuiceBaseEffect#tick}, and an effect that parks forever has no such moment — so
	* withdrawing one has to reach in from outside and finish it by hand.
	* @param {JuiceBaseEffect} effect The effect to stop.
	*/
	static discardEffect(effect) {
		effect.restore();
		const index = JuiceMotionManager.#effects.indexOf(effect);
		if (index === -1) return;
		JuiceMotionManager.#effects.splice(index, 1);
	}
	/**
	* Runs every frame while on the map, via the {@link Scene_Map#update} alias.
	*/
	static frameTick() {
		if (!JuiceMotionManager.#effects.length) {
			return;
		}
		const survivors = [];
		for (let i = 0; i < JuiceMotionManager.#effects.length; i++) {
			const effect = JuiceMotionManager.#effects[i];
			if (!effect.isSpriteAlive()) {
				continue;
			}
			if (effect.tick()) {
				survivors.push(effect);
			}
		}
		JuiceMotionManager.#effects.length = 0;
		survivors.forEach((s) => JuiceMotionManager.#effects.push(s));
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/managers/JuiceWeaponSwingOverlay.js
/**
* Spawns a short-lived weapon icon sprite parented to a {@link Sprite_Character} and swings it.
*/
var JuiceWeaponSwingOverlay = class JuiceWeaponSwingOverlay {
	/**
	* @param {number} d Candidate direction code.
	* @returns {boolean}
	*/
	static #isValidSwingDirection(d) {
		return d >= 1 && d <= 9 && d !== 5;
	}
	/**
	* True when motion uses clock-orbit arc geometry (shared focal point).
	* @param {string} motionType Preset key (kebab-case).
	* @returns {boolean}
	*/
	static #isArcMotion(motionType) {
		return motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Arc || motionType === JuiceWeaponSwingMotionEffect.MotionTypes.ArcReverse;
	}
	/**
	* @param {number} spinCount Spin count from hook (may be invalid when absent).
	* @returns {number}
	*/
	static #coalesceSpinCount(spinCount) {
		if (Number.isFinite(spinCount) === false) {
			return 1;
		}
		return spinCount;
	}
	/**
	* Derives a direction-aware overlay placement so the icon reads like it's coming from the hand.
	* Used for spin / stab (arc presets use orbit math instead- this is only ever called from play()'s
	* non-arc branch, so no motion-type parameter is needed here).
	* @param {Sprite_Character} parentSprite The character sprite receiving the overlay.
	* @param {number} direction RMMZ 8-dir (same snapshot as the swing arc uses).
	* @returns {{ x: number, y: number, scale: number }}
	*/
	static #buildSwingProfile(parentSprite, direction) {
		const ph = parentSprite.patternHeight();
		const tw = 26;
		const ySide = -ph * .52;
		const yDown = -ph * .22;
		const yUp = -ph * .82;
		const card = (horiz, vert, sc) => {
			return {
				x: horiz,
				y: vert,
				scale: sc
			};
		};
		const blendProf = (a, b, t) => {
			return {
				x: a.x + (b.x - a.x) * t,
				y: a.y + (b.y - a.y) * t,
				scale: a.scale + (b.scale - a.scale) * t
			};
		};
		const left = card(-tw, ySide, 1.65);
		const right = card(tw, ySide, 1.65);
		const down = card(10, yDown, 1.5);
		const up = card(0, yUp, 1.5);
		/** @type {{ x: number, y: number, scale: number }} */
		let prof;
		switch (direction) {
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
				prof = blendProf(down, left, .5);
				break;
			case 3:
				prof = blendProf(down, right, .5);
				break;
			case 7:
				prof = blendProf(up, left, .5);
				break;
			case 9:
				prof = blendProf(up, right, .5);
				break;
			default:
				prof = left;
				break;
		}
		return {
			x: prof.x,
			y: prof.y,
			scale: prof.scale
		};
	}
	/**
	* Plays an overlay preset with nothing but a preset key to go on.
	*
	* {@link #play} is shaped for combat, where a skill and a weapon between them have already
	* answered which way a barrel points and whether the art is drawn in profile. An overlay asked
	* for by name has no weapon behind it, so the preset's own reading of the IconSet cell is all
	* there is — and every caller in that position was otherwise assembling the same ten arguments.
	* @param {Sprite_Character} parentSprite The character sprite receiving the overlay.
	* @param {number} iconIndex Icon index on the IconSet sheet.
	* @param {string} motionType Preset key (kebab-case).
	* @param {number} durationFrames Duration of the motion in frames.
	* @param {number} repeatCount Times the motion repeats within the duration.
	* @param {number} arcSpanDegrees Arc span for the presets that orbit.
	* @param {number} swingDirection RMMZ 8-dir the geometry is built against.
	* @returns {JuiceWeaponSwingMotionEffect} The queued effect.
	*/
	static playPreset(parentSprite, iconIndex, motionType, durationFrames, repeatCount, arcSpanDegrees, swingDirection) {
		const tipRadians = JuiceWeaponSwingMotionEffect.defaultTipRadiansFor(motionType);
		return JuiceWeaponSwingOverlay.play(parentSprite, iconIndex, J.ABS.EXT.JUICE.Metadata.weaponSwingPeakRadians, durationFrames, motionType, arcSpanDegrees, swingDirection, tipRadians, repeatCount, false);
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
	* @returns {JuiceWeaponSwingMotionEffect} The queued effect, for callers that keep hold of it.
	*/
	static play(parentSprite, iconIndex, peakRotationRadians, durationFrames, motionType, arcSpanDegrees, swingDirection, weaponTipRadians, spinCount, profileGun) {
		let spanDeg = arcSpanDegrees;
		if (Number.isFinite(spanDeg) === false) {
			spanDeg = 120;
		}
		const pw = ImageManager.iconWidth;
		const ph = ImageManager.iconHeight;
		const bitmap = ImageManager.loadSystem("IconSet");
		const sx = iconIndex % 16 * pw;
		const sy = Math.floor(iconIndex / 16) * ph;
		const overlay = new Sprite();
		overlay.bitmap = bitmap;
		overlay.setFrame(sx, sy, pw, ph);
		if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Spin || motionType === JuiceWeaponSwingMotionEffect.MotionTypes.SpinReverse) {
			overlay.anchor.x = 1.15;
			overlay.anchor.y = 1.15;
		} else {
			overlay.anchor.x = .78;
			overlay.anchor.y = .92;
		}
		let swingDir = swingDirection;
		if (JuiceWeaponSwingOverlay.#isValidSwingDirection(swingDir) === false) {
			swingDir = parentSprite._character.direction();
		}
		let weaponTipResolved = weaponTipRadians;
		if (Number.isFinite(weaponTipResolved) === false) {
			weaponTipResolved = JuiceWeaponSwingMotionEffect.StabIconTipAngleRadians;
		}
		const spinCountResolved = JuiceWeaponSwingOverlay.#coalesceSpinCount(spinCount);
		const profileGunResolved = profileGun === true;
		const phy = parentSprite.patternHeight();
		let neutralForCtorX;
		let neutralForCtorY;
		if (JuiceWeaponSwingOverlay.#isArcMotion(motionType) === true) {
			const reverse = motionType === JuiceWeaponSwingMotionEffect.MotionTypes.ArcReverse;
			const pose0 = JuiceWeaponSwingMotionEffect.computeArcPose(swingDir, phy, spanDeg, reverse, 0);
			overlay.x = pose0.x;
			overlay.y = pose0.y;
			if (reverse === true) {
				const travel0 = JuiceWeaponSwingMotionEffect.computeArcTravelRadians(swingDir, phy, spanDeg, true, 0);
				overlay.rotation = JuiceWeaponSwingMotionEffect.bladeRotationFromTravelRadians(travel0);
			} else {
				overlay.rotation = JuiceWeaponSwingMotionEffect.bladeRotationArcForward(pose0.theta);
			}
			overlay.scale.x = 1.6;
			overlay.scale.y = 1.6;
		} else {
			const profile = JuiceWeaponSwingOverlay.#buildSwingProfile(parentSprite, swingDir);
			const juiceDy = J.ABS.EXT.JUICE.Metadata.spriteJuiceVerticalOffsetPixels;
			const neutralX = profile.x;
			const neutralY = profile.y + juiceDy;
			if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Bash) {
				const bash0 = JuiceWeaponSwingMotionEffect.computeBashOffset(swingDir, phy, 0);
				const bashAlign = JuiceWeaponSwingMotionEffect.weaponTipAlign(swingDir, weaponTipResolved, profileGunResolved);
				overlay.x = neutralX + bash0.x;
				overlay.y = neutralY + bash0.y;
				overlay.rotation = bashAlign.rotation + JuiceWeaponSwingMotionEffect.bashWhipRotationRadians(0);
				overlay.scale.x = profile.scale * (bashAlign.mirrorX ? -1 : 1);
				overlay.scale.y = profile.scale;
				neutralForCtorX = neutralX;
				neutralForCtorY = neutralY;
			} else if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Recoil) {
				const recoil0 = JuiceWeaponSwingMotionEffect.computeRecoilPose(swingDir, phy, 0);
				const recoilAlign = JuiceWeaponSwingMotionEffect.weaponTipAlign(swingDir, weaponTipResolved, profileGunResolved);
				overlay.x = neutralX + recoil0.x;
				overlay.y = neutralY + recoil0.y;
				overlay.rotation = recoilAlign.rotation + recoil0.rotationDelta;
				overlay.scale.x = profile.scale * (recoilAlign.mirrorX ? -1 : 1);
				overlay.scale.y = profile.scale;
				neutralForCtorX = neutralX;
				neutralForCtorY = neutralY;
			} else if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.StabForward) {
				const stabAlign = JuiceWeaponSwingMotionEffect.weaponTipAlign(swingDir, weaponTipResolved, profileGunResolved);
				overlay.x = neutralX;
				overlay.y = neutralY;
				overlay.rotation = stabAlign.rotation;
				overlay.scale.x = profile.scale * (stabAlign.mirrorX ? -1 : 1);
				overlay.scale.y = profile.scale;
			} else if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Present) {
				const presentProf = JuiceWeaponSwingOverlay.#buildSwingProfile(parentSprite, 8);
				const presentJuiceDy = J.ABS.EXT.JUICE.Metadata.spriteJuiceVerticalOffsetPixels;
				const px = presentProf.x;
				const py = presentProf.y + presentJuiceDy;
				overlay.x = px;
				overlay.y = py;
				overlay.rotation = JuiceWeaponSwingMotionEffect.IconDiagonalRestRadians;
				overlay.scale.x = presentProf.scale;
				overlay.scale.y = presentProf.scale;
			} else {
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
		if (motionType === JuiceWeaponSwingMotionEffect.MotionTypes.Present) {
			swingDirForMotion = 8;
		}
		const motion = new JuiceWeaponSwingMotionEffect(parentSprite, overlay, baseRotation, peakRotationRadians, durationFrames, motionType, spanDeg, swingDirForMotion, weaponTipResolved, neutralForCtorX, neutralForCtorY, spinCountResolved, profileGunResolved);
		JuiceMotionManager.pushExternalEffect(motion);
		return motion;
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/managers/JuiceHookManager.js
/**
* Central hook orchestration for J-ABS-Juice (caster, target, casting).
*/
var JuiceHookManager = class JuiceHookManager {
	/**
	* Remembers multi-hit connection counts for amplitude decay.
	* @type {Map<string, JuiceFlurryStrikeRecord>}
	*/
	static #flurryState = new Map();
	/**
	* Clears stale flurry rows occasionally so long sessions do not grow forever.
	*/
	static #maybeGarbageCollectFlurry() {
		if (Graphics.frameCount % 600 !== 0) {
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
	static #computeFlurryAmplitudeScale(action, target) {
		const md = J.ABS.EXT.JUICE.Metadata;
		const key = `${action.getUuid()}::${target.getUuid()}`;
		const frame = Graphics.frameCount;
		const prior = JuiceHookManager.#flurryState.get(key);
		let count = 1;
		if (prior && frame - prior.frame <= 2) {
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
	static onPostPrimaryBattleEffects(action, target) {
		JuiceHookManager.#maybeGarbageCollectFlurry();
		const result = target.getBattler().result();
		if (result.parried === true) {
			return;
		}
		if (result.evaded === true) {
			return;
		}
		const character = target.getCharacter();
		const md = J.ABS.EXT.JUICE.Metadata;
		const ga = action.getAction();
		if (ga.item().damage.type === 0) {
			return;
		}
		let intensity = md.targetMagicalSquishIntensity;
		if (ga.isPhysical()) {
			intensity = md.targetPhysicalSquishIntensity;
		}
		if (action.isHealing()) {
			intensity *= md.healingRecipientSquishScale;
		}
		intensity *= JuiceHookManager.#computeFlurryAmplitudeScale(action, target);
		JuiceMotionManager.scheduleSquish(character, intensity, md.targetSquishFrames);
	}
	/**
	* Hook: {@link JABS_Engine.executeMapAction}.
	* @param {JABS_Battler} caster The caster.
	* @param {JABS_Action} action The action executing on the map.
	*/
	static onExecuteMapAction(caster, action) {
		const skill = action.getBaseSkill();
		const cooldownKey = action.getCooldownType();
		const dodgeKey = JABS_Button.Dodge;
		if (skill.jabsNoJuice === true) {
			return;
		}
		const motionKey = skill.jabsJuiceMotion;
		if (cooldownKey === dodgeKey && motionKey === String.empty) {
			JuiceHookManager.#applyDodgeJuice(caster);
			return;
		}
		if (motionKey === "none") {
			return;
		}
		if (motionKey === "squish") {
			const repeatCount = JuiceProfileResolver.resolveJuiceRepeatCount(action);
			const duration = JuiceProfileResolver.resolveJuiceDuration(action);
			JuiceHookManager.#applySquishCasterJuice(caster, repeatCount, duration);
			return;
		}
		if (motionKey === "pulse") {
			const repeatCount = JuiceProfileResolver.resolveJuiceRepeatCount(action);
			const duration = JuiceProfileResolver.resolveJuiceDuration(action);
			JuiceHookManager.#applySupportCasterJuice(caster, repeatCount, duration);
			return;
		}
		if (motionKey === "flip") {
			const repeatCount = JuiceProfileResolver.resolveJuiceRepeatCount(action);
			const duration = JuiceProfileResolver.resolveJuiceDuration(action);
			JuiceHookManager.#applyFlipBodyJuice(caster, "cw", repeatCount, duration);
			return;
		}
		if (motionKey === "flip-reverse") {
			const repeatCount = JuiceProfileResolver.resolveJuiceRepeatCount(action);
			const duration = JuiceProfileResolver.resolveJuiceDuration(action);
			JuiceHookManager.#applyFlipBodyJuice(caster, "ccw", repeatCount, duration);
			return;
		}
		if (action.isHealing()) {
			if (motionKey === String.empty) {
				JuiceHookManager.#applySupportCasterJuice(caster);
				return;
			}
		}
		if (skill.damage.type === 0 && motionKey === String.empty) {
			JuiceHookManager.#applySupportCasterJuice(caster);
			return;
		}
		JuiceHookManager.#applyStrikeJuice(caster, action);
	}
	/**
	* Applies dodge-only motion on the caster (scale squash, no weapon overlay).
	* @param {JABS_Battler} caster The dodging battler.
	*/
	static #applyDodgeJuice(caster) {
		const md = J.ABS.EXT.JUICE.Metadata;
		const character = caster.getCharacter();
		JuiceMotionManager.scheduleSquish(character, md.dodgeSquishIntensity, md.dodgeSquishFrames);
	}
	/**
	* Applies a body squash on the caster, optionally repeated {@link repeatCount} times.
	* Used by <juiceMotion:squish> for skills that want a punchy caster reaction without a weapon overlay.
	* @param {JABS_Battler} caster The caster.
	* @param {number} [repeatCount=1] How many times to cycle the squish.
	* @param {number|null} [totalDuration=null] Total frame budget; divided evenly across cycles. Defaults to metadata value.
	*/
	static #applySquishCasterJuice(caster, repeatCount = 1, totalDuration = null) {
		const md = J.ABS.EXT.JUICE.Metadata;
		const character = caster.getCharacter();
		const baseDuration = totalDuration ?? md.unarmedStrikeSquishFrames;
		const perCycleDuration = Math.max(1, Math.floor(baseDuration / repeatCount));
		JuiceMotionManager.scheduleSquish(character, md.unarmedStrikeSquishIntensity, perCycleDuration, repeatCount);
	}
	/**
	* Applies gentle caster pulse for healing or support actions, optionally repeated {@link repeatCount} times.
	* @param {JABS_Battler} caster The healing caster.
	* @param {number} [repeatCount=1] How many times to cycle the pulse.
	* @param {number|null} [totalDuration=null] Total frame budget; divided evenly across cycles. Defaults to metadata value.
	*/
	static #applySupportCasterJuice(caster, repeatCount = 1, totalDuration = null) {
		const md = J.ABS.EXT.JUICE.Metadata;
		const character = caster.getCharacter();
		const baseDuration = totalDuration ?? md.supportCasterPulseFrames;
		const perCycleDuration = Math.max(1, Math.floor(baseDuration / repeatCount));
		JuiceMotionManager.scheduleSquish(character, md.supportCasterPulseIntensity, perCycleDuration, repeatCount);
	}
	/**
	* Spins the caster sprite through N full 360° rotations over the total duration.
	* Used by <juiceMotion:flip> (clockwise) and <juiceMotion:flip-reverse> (counter-clockwise).
	* @param {JABS_Battler} caster The caster.
	* @param {string} direction Which way the caster turns: `cw` or `ccw`.
	* @param {number} [repeatCount=1] Number of full rotations to complete.
	* @param {number|null} [totalDuration=null] Total frame budget. Defaults to metadata unarmed squish frames.
	*/
	static #applyFlipBodyJuice(caster, direction, repeatCount = 1, totalDuration = null) {
		const md = J.ABS.EXT.JUICE.Metadata;
		const character = caster.getCharacter();
		const duration = totalDuration ?? md.unarmedStrikeSquishFrames;
		JuiceMotionManager.scheduleFlipBody(character, direction, duration, repeatCount);
	}
	/**
	* Applies strike motion: tilt + optional weapon swing for actors when an icon resolves.
	* @param {JABS_Battler} caster The attacker.
	* @param {JABS_Action} action The strike action.
	*/
	static #applyStrikeJuice(caster, action) {
		const md = J.ABS.EXT.JUICE.Metadata;
		const character = caster.getCharacter();
		const iconIndex = JuiceProfileResolver.resolveWeaponIconIndex(caster, action);
		if (iconIndex < 0) {
			JuiceMotionManager.scheduleSquish(character, md.unarmedStrikeSquishIntensity, md.unarmedStrikeSquishFrames);
			return;
		}
		const styleKey = JuiceProfileResolver.resolveWeaponStyleKey(caster, action);
		const mul = JuiceProfileResolver.resolveStyleMultipliers(styleKey);
		JuiceMotionManager.scheduleTilt(character, md.casterStrikeTiltRadians * mul.tiltMul, md.casterStrikeTiltFrames);
		JuiceHookManager.#playWeaponSwing(caster, action, iconIndex, mul.swingMul);
	}
	/**
	* Arcs a weapon icon out of the caster to accompany a strike.
	*
	* This is the one piece of juice that still drives a sprite directly, and it has to: the overlay
	* is a sprite this plugin creates and parents itself, not a character the engine is drawing, so
	* there is nothing for the motion composer to compose it onto.
	* @param {JABS_Battler} caster The attacker.
	* @param {JABS_Action} action The strike action.
	* @param {number} iconIndex The weapon icon to arc.
	* @param {number} swingMultiplier The style multiplier applied to the swing's width.
	*/
	static #playWeaponSwing(caster, action, iconIndex, swingMultiplier) {
		const sprite = JuiceMapSpriteFinder.findSpriteCharacterFor(caster.getCharacter());
		if (!sprite) {
			return;
		}
		const md = J.ABS.EXT.JUICE.Metadata;
		const swingWidthMultiplier = 2;
		const swingDurationMultiplier = 2;
		const motionType = JuiceProfileResolver.resolveJuiceMotion(action);
		const arcSpanDegrees = JuiceProfileResolver.resolveJuiceArcSpanDegrees(action);
		const weaponTipRadians = JuiceProfileResolver.resolveJuiceWeaponTipRadians(action, motionType);
		const spinCount = JuiceProfileResolver.resolveJuiceRepeatCount(action);
		const profileGun = JuiceProfileResolver.resolveJuiceProfileGun(action);
		const juiceDuration = JuiceProfileResolver.resolveJuiceDuration(action) ?? md.weaponSwingFrames * swingDurationMultiplier;
		const peakRadians = md.weaponSwingPeakRadians * swingMultiplier * swingWidthMultiplier;
		JuiceWeaponSwingOverlay.play(sprite, iconIndex, peakRadians, juiceDuration, motionType, arcSpanDegrees, action.direction(), weaponTipRadians, spinCount, profileGun);
	}
	/**
	* How long a casting pulse outlives the last frame that asked for it.
	*
	* Short enough that a cast ending is indistinguishable from the pulse stopping, long enough to
	* survive a frame the cast loop happens not to run on.
	* @type {number}
	*/
	static #castingHeartbeatFrames = 4;
	/**
	* Hook: cast timer loop — keeps the casting pulse alive while a cast is running.
	*
	* Called on every frame of a cast rather than once at the start, which is what makes the pulse
	* self-limiting: it is declared with a few frames of life and renewed for as long as something
	* keeps calling. A cast that ends in a way nobody hooked — the caster killed mid-incantation,
	* interrupted, or moved to another map — simply stops renewing, and the pulse lapses on its own.
	* @param {JABS_Battler} battler The casting battler.
	*/
	static tickCastingJuice(battler) {
		const md = J.ABS.EXT.JUICE.Metadata;
		const character = battler.getCharacter();
		const castMotion = JuiceHookManager.#castMotionFor(battler);
		if (castMotion === "squish") {
			const skill = battler.getDecidedAction()[0].getBaseSkill();
			const period = skill.jabsJuiceCastMotionPeriod || JuiceHookManager.#castingSquishDefaultPeriodFrames;
			JuiceMotionManager.scheduleCastingSquish(character, JuiceHookManager.#castingSquishIntensityFor(skill, md), period, JuiceHookManager.#castingHeartbeatFrames);
			return;
		}
		JuiceMotionManager.scheduleCastingPulse(character, md.castingPulseAmplitude, JuiceHookManager.#castingHeartbeatFrames);
	}
	/**
	* How many frames one casting squat takes when the skill does not say.
	*
	* Eight frames is seven and a half squats a second, which is the "rapidly" the design asked for
	* without turning into a vibration.
	* @type {number}
	*/
	static #castingSquishDefaultPeriodFrames = 8;
	/**
	* How hard the casting squat deforms the sprite.
	*
	* A skill may author its own peak as a percent; a workout wants to read as a workout, and the
	* config's unarmed strike squish is tuned for a poke. Zero is the getter's "nothing authored"
	* sentinel, in which case that config value stands.
	* @param {RPG_Skill} skill The skill being cast.
	* @param {object} md This plugin's metadata, holding the config fallback.
	* @returns {number} The peak deformation as a fraction of true size, ex: `0.45`.
	*/
	static #castingSquishIntensityFor(skill, md) {
		const authoredPercent = skill.jabsJuiceCastMotionIntensity;
		if (authoredPercent === 0) return md.unarmedStrikeSquishIntensity;
		return authoredPercent / 100;
	}
	/**
	* The cast motion the battler's in-flight skill asked for, if any.
	*
	* A battler mid-cast always has a decided action, but the tick can land on a frame where the
	* decision has not been made yet or has already been cleared, and an empty answer there simply
	* means the default charge-up.
	* @param {JABS_Battler} battler The casting battler.
	* @returns {string} The cast motion key, or an empty string for the default.
	*/
	static #castMotionFor(battler) {
		const actions = battler.getDecidedAction();
		if (!actions || actions.length === 0) return String.empty;
		return actions[0].getBaseSkill().jabsJuiceCastMotion;
	}
	/**
	* Hook: cast completion — tears down casting-layer motion before execution juice runs.
	*
	* The heartbeat above would retire the pulse on its own within a few frames, but a cast that
	* completes is immediately followed by the juice for whatever it cast, and those few frames are
	* exactly the ones the player is watching. This ends it on the frame it actually ended.
	*
	* Only the pulse is withdrawn. A reaction running at the same time belongs to something else that
	* happened to this battler, and finishing a cast is no reason to cut it short.
	* @param {JABS_Battler} battler The battler who finished casting.
	*/
	static endCastingJuice(battler) {
		const character = battler.getCharacter();
		JuiceMotionManager.cancelCastingPulse(character);
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/managers/JABS_Engine.js
/**
* Extends {@link JABS_Engine.postPrimaryBattleEffects}.<br/>
* Applies lightweight target-side sprite reactions after core logging (and after Hitstop).
*/
J.ABS.EXT.JUICE.Aliased.JABS_Engine.set("postPrimaryBattleEffects", JABS_Engine.prototype.postPrimaryBattleEffects);
JABS_Engine.prototype.postPrimaryBattleEffects = function(action, target) {
	J.ABS.EXT.JUICE.Aliased.JABS_Engine.get("postPrimaryBattleEffects").call(this, action, target);
	JuiceHookManager.onPostPrimaryBattleEffects(action, target);
};
/**
* Extends {@link JABS_Engine.executeMapAction}.<br/>
* Runs caster-facing juice after JABS core and after higher-priority wrappers such as Poses.
*/
J.ABS.EXT.JUICE.Aliased.JABS_Engine.set("executeMapAction", JABS_Engine.prototype.executeMapAction);
JABS_Engine.prototype.executeMapAction = function(caster, action, targetX, targetY) {
	J.ABS.EXT.JUICE.Aliased.JABS_Engine.get("executeMapAction").call(this, caster, action, targetX, targetY);
	JuiceHookManager.onExecuteMapAction(caster, action);
};

//#endregion
//#region src/plugins/abs/ext/juice/models/JuiceCastingPulseMotionEffect.js
/**
* The shimmer a battler gives off while it is charging a skill.
*
* Unlike every other juice reaction this one has no duration, because a cast has no duration either
* — it lasts until the caster finishes, is interrupted, or dies. It animates for exactly as long as
* something keeps declaring it, which is the composer's ordinary contract and needs no clock.
*
* The pulse accelerates as it runs, from a slow swell to a fast one over about three seconds. That
* ramp is the whole reason this is not just a `pulse` oscillator: a steady rhythm reads as ambient
* and this needs to read as building toward something.
*
* `MotionEffect`, `MotionChannels` and `MotionEasing` are reached as globals rather than imports:
* they ship inside J-Motion's bundle and are hoisted by the time this one loads.
*/
var JuiceCastingPulseMotionEffect = class extends MotionEffect {
	/**
	* The channels a casting pulse takes exclusive ownership of.
	*
	* Scale only. The glow is deliberately left unclaimed so that it resolves against every other
	* flash on the character by strength — a caster who is also bleeding should show whichever of the
	* two is currently brighter, rather than the charge-up suppressing the injury outright.
	* @returns {string[]}
	*/
	claims() {
		return [MotionChannels.SCALE_X, MotionChannels.SCALE_Y];
	}
	/**
	* How many frames one swell currently takes.
	*
	* The period contracts as the cast goes on, which is what turns a rhythm into a build-up. It stops
	* contracting once the ramp is spent so that a very long cast settles into an urgent pulse rather
	* than accelerating into a vibration.
	* @returns {number}
	*/
	periodFrames() {
		const startPeriodFrames = 60;
		const endPeriodFrames = 24;
		const rampDurationFrames = 180;
		const ramp = MotionEasing.normalize(this.elapsedFrames() / rampDurationFrames);
		return Math.round(startPeriodFrames + (endPeriodFrames - startPeriodFrames) * ramp);
	}
	/**
	* Where in the current swell this frame sits, from -1 to 1.
	* @returns {number}
	*/
	wave() {
		const period = this.periodFrames();
		const phaseRadians = this.elapsedFrames() % period / period * (Math.PI * 2);
		return Math.sin(phaseRadians);
	}
	/**
	* The charge glow for a point in the swell.
	*
	* A cold blue-white, at up to roughly a third strength. Anything stronger stops reading as energy
	* gathering around a caster and starts reading as the sprite being washed out.
	* @param {number} wave Where in the swell this frame sits, from -1 to 1.
	* @returns {number[]} The `[r, g, b, a]` blend colour.
	*/
	glowFor(wave) {
		const peakAlpha = 96;
		const strength = (wave + 1) / 2;
		return [
			180,
			220,
			255,
			Math.round(strength * peakAlpha)
		];
	}
	/**
	* Writes this frame of the casting pulse into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		const { amplitude } = this.parameters();
		const wave = this.wave();
		const swell = 1 + wave * amplitude;
		composition.contribute(this, MotionChannels.SCALE_X, swell);
		composition.contribute(this, MotionChannels.SCALE_Y, swell);
		composition.contribute(this, MotionChannels.FLASH, this.glowFor(wave));
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/models/JuiceFlipBodyMotionEffect.js
/**
* A full body rotation, for skills whose whole idea is that the caster went end over end.
*
* The rotation sweeps linearly rather than easing, because a flip that slows into its landing reads
* as a stumble. It travels a whole number of turns over its duration, so it finishes pointing
* exactly where it started and can be withdrawn on its final frame without a snap.
*
* Rotating a character sprite is not free: they are anchored at the feet so they stand on a tile,
* and turning about that point swings the body around like a conker on a string. Asking the
* composition for centred rotation is the entire fix — the view owns the anchor and the height
* compensation, so nothing about that problem lives here.
*
* `MotionEffect`, `MotionChannels` and `MotionEasing` are reached as globals rather than imports:
* they ship inside J-Motion's bundle and are hoisted by the time this one loads.
*/
var JuiceFlipBodyMotionEffect = class extends MotionEffect {
	/**
	* The channel a flip takes exclusive ownership of.
	* @returns {string[]}
	*/
	claims() {
		return [MotionChannels.ROTATION];
	}
	/**
	* How far through the flip this frame is, from 0 to 1.
	* @returns {number}
	*/
	progress() {
		const { duration } = this.parameters();
		return MotionEasing.normalize(this.elapsedFrames() / duration);
	}
	/**
	* Which way round the flip goes, as a multiplier on the angle.
	*
	* Anything that is not explicitly counter-clockwise turns clockwise, matching how a spin reads its
	* own direction — an unrecognised value is an authoring typo, and a flip going the wrong way is a
	* better outcome than a caster that stands still with no clue anything was wrong.
	* @returns {number} `1` for clockwise, `-1` for counter-clockwise.
	*/
	directionSign() {
		const { direction } = this.parameters();
		return direction === "ccw" ? -1 : 1;
	}
	/**
	* The angle this frame sits at, in radians.
	* @returns {number}
	*/
	currentRotation() {
		const { turns } = this.parameters();
		return 2 * Math.PI * turns * this.directionSign() * this.progress();
	}
	/**
	* Writes this frame of the flip into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		composition.contribute(this, MotionChannels.ROTATION, this.currentRotation());
		if (composition.accepts(this, MotionChannels.ROTATION) === false) return;
		composition.flagCenterRotation();
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/models/JuiceHeldOverlay.js
/**
* One icon a character is holding up, and everything needed to put it back.
*
* A held overlay outlives the sprite showing it. `Sprite_Character` objects are built and destroyed
* every time the map scene is rebuilt — opening the menu is enough — while the character they draw
* lives in the save data and persists. So what is stored here is the *request* rather than the
* sprite work: who is holding something up, which icon, in what pose. The effect doing the actual
* drawing is attached and detached as sprites come and go, which is what lets a held icon survive a
* trip through the menu and reappear on the other side.
*
* This is the same split J-Motion draws between a `MotionDeclaration` and a `MotionEffect`, for the
* same reason, and the pull in {@link Sprite_Character#updateHeldJuiceOverlays} mirrors the one
* that composer does.
*/
var JuiceHeldOverlay = class {
	/**
	* The character holding the icon up.
	* @type {Game_Character}
	*/
	#character = null;
	/**
	* Who asked for this, and therefore who is allowed to withdraw it.
	* @type {string}
	*/
	#sourceKey = String.empty;
	/**
	* The IconSet cell being held up.
	* @type {number}
	*/
	#iconIndex = 0;
	/**
	* The overlay preset the icon is posed in, ex: `present`.
	* @type {string}
	*/
	#motionType = String.empty;
	/**
	* How many frames the pose takes to reach, before it parks there.
	* @type {number}
	*/
	#durationFrames = 0;
	/**
	* How many times the motion repeats on its way to the final pose.
	* @type {number}
	*/
	#repeatCount = 1;
	/**
	* Arc span in degrees, for the presets that orbit.
	* @type {number}
	*/
	#arcSpanDegrees = 120;
	/**
	* The effect currently drawing this, or null when no sprite is showing it.
	* @type {JuiceWeaponSwingMotionEffect|null}
	*/
	#effect = null;
	/**
	* The facing the live effect was built against.
	*
	* Overlay geometry is resolved once at spawn and never re-read, because a swing that changed
	* direction halfway through would tear rather than swing. A held pose has the opposite problem:
	* it lasts long enough for the character to turn under it, and a spear left pointing at where
	* north used to be reads as a bug. Remembering the facing is what lets the pull notice.
	* @type {number}
	*/
	#facing = 0;
	/**
	* Constructor.
	* @param {Game_Character} character The character holding the icon up.
	* @param {string} sourceKey Who asked for this.
	* @param {number} iconIndex The IconSet cell to hold up.
	* @param {string} motionType The overlay preset to pose it in.
	* @param {number} durationFrames How many frames reaching the pose takes.
	* @param {number} repeatCount How many times the motion repeats on the way there.
	* @param {number} arcSpanDegrees Arc span in degrees, for the presets that orbit.
	*/
	constructor(character, sourceKey, iconIndex, motionType, durationFrames, repeatCount, arcSpanDegrees) {
		this.#character = character;
		this.#sourceKey = sourceKey;
		this.#iconIndex = iconIndex;
		this.#motionType = motionType;
		this.#durationFrames = durationFrames;
		this.#repeatCount = repeatCount;
		this.#arcSpanDegrees = arcSpanDegrees;
	}
	/**
	* Gets the character holding the icon up.
	* @returns {Game_Character} The character.
	*/
	character() {
		return this.#character;
	}
	/**
	* Gets who asked for this overlay.
	* @returns {string} The sourceKey.
	*/
	sourceKey() {
		return this.#sourceKey;
	}
	/**
	* Gets the IconSet cell being held up.
	* @returns {number} The iconIndex.
	*/
	iconIndex() {
		return this.#iconIndex;
	}
	/**
	* Gets the overlay preset the icon is posed in.
	* @returns {string} The motionType.
	*/
	motionType() {
		return this.#motionType;
	}
	/**
	* Gets how many frames reaching the pose takes.
	* @returns {number} The durationFrames.
	*/
	durationFrames() {
		return this.#durationFrames;
	}
	/**
	* Gets how many times the motion repeats on the way to the pose.
	* @returns {number} The repeatCount.
	*/
	repeatCount() {
		return this.#repeatCount;
	}
	/**
	* Gets the arc span in degrees.
	* @returns {number} The arcSpanDegrees.
	*/
	arcSpanDegrees() {
		return this.#arcSpanDegrees;
	}
	/**
	* Gets the effect currently drawing this overlay.
	* @returns {JuiceWeaponSwingMotionEffect|null} The effect, or null when nothing is drawing it.
	*/
	effect() {
		return this.#effect;
	}
	/**
	* Sets the effect currently drawing this overlay.
	* @param {JuiceWeaponSwingMotionEffect|null} newEffect The new effect, or null to detach.
	*/
	setEffect(newEffect) {
		this.#effect = newEffect;
	}
	/**
	* Gets the facing the live effect was built against.
	* @returns {number} The facing.
	*/
	facing() {
		return this.#facing;
	}
	/**
	* Sets the facing the live effect was built against.
	* @param {number} newFacing The new facing.
	*/
	setFacing(newFacing) {
		this.#facing = newFacing;
	}
	/**
	* Determines whether a sprite is already showing this overlay as currently requested.
	*
	* Three things have to agree for the answer to be yes, and each false answer is a different way a
	* held icon goes stale: nothing is drawing it at all, something is drawing it on a sprite that
	* has since been replaced, or it is drawn correctly for a direction the character is no longer
	* facing.
	* @param {Sprite_Character} sprite The sprite asking whether it has work to do.
	* @returns {boolean}
	*/
	isCurrentFor(sprite) {
		const effect = this.effect();
		if (effect === null) return false;
		if (effect.parentSprite() !== sprite) return false;
		if (JuiceWeaponSwingMotionEffect.isFacingAgnostic(this.motionType()) === true) return true;
		return this.character().direction() === this.facing();
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/models/JuiceSquishMotionEffect.js
/**
* The body squash a battler gives when it hits something or gets hit.
*
* A sine envelope, which matters more than it sounds: the shape starts and ends at exactly no
* deformation, so a squish can be handed to the composer with a frame budget and simply stop being
* declared when the budget runs out. There is no snap back to normal because the last frame it drew
* was already normal.
*
* Width swells as height compresses rather than both shrinking together. That is the whole trick to
* making it read as impact — something being flattened rather than something being scaled down.
*
* `MotionEffect` and `MotionChannels` are reached as globals rather than imports: they ship inside
* J-Motion's bundle and are hoisted by the time this one loads.
*/
var JuiceSquishMotionEffect = class extends MotionEffect {
	/**
	* The channels a squish takes exclusive ownership of.
	*
	* Scale, and only scale. A combat reaction has to read at the size the designer tuned it to, so
	* it replaces an ambient breathe for its duration rather than multiplying against it — two
	* compounding scale motions produce an amplitude neither of them asked for.
	* @returns {string[]}
	*/
	claims() {
		return [MotionChannels.SCALE_X, MotionChannels.SCALE_Y];
	}
	/**
	* How far through the current squish cycle this frame is, from 0 to 1.
	*
	* Cycles are counted by wrapping the elapsed frames rather than by resetting a counter, so a
	* repeated squish needs no per-cycle bookkeeping and cannot drift.
	* @returns {number}
	*/
	cycleProgress() {
		const { duration } = this.parameters();
		return this.elapsedFrames() % duration / duration;
	}
	/**
	* Writes this frame of the squish into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		const { intensity } = this.parameters();
		const envelope = Math.sin(this.cycleProgress() * Math.PI);
		const swell = 1 + envelope * intensity;
		composition.contribute(this, MotionChannels.SCALE_X, swell);
		composition.contribute(this, MotionChannels.SCALE_Y, 1 / swell);
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/models/JuiceTiltMotionEffect.js
/**
* The lean a battler takes as it swings a weapon.
*
* This is the caster half of a strike — the weapon overlay does the arc, and this tips the body
* into it so the swing looks like it came from somewhere. On its own it is barely visible, which is
* the point: a strike that reads as a whole-body action is a dozen small things agreeing, not one
* large one.
*
* Like the squish it rides a sine envelope, so it begins and ends at no rotation at all and can be
* withdrawn on any frame without the sprite jumping.
*
* `MotionEffect`, `MotionChannels` and `MotionEasing` are reached as globals rather than imports:
* they ship inside J-Motion's bundle and are hoisted by the time this one loads.
*/
var JuiceTiltMotionEffect = class extends MotionEffect {
	/**
	* The channel a tilt takes exclusive ownership of.
	*
	* A strike lean has to be the only thing rotating the body while it runs, or an ambient swing
	* adds an angle the designer never tuned for and the strike stops reading as deliberate.
	* @returns {string[]}
	*/
	claims() {
		return [MotionChannels.ROTATION];
	}
	/**
	* How far through the tilt this frame is, from 0 to 1.
	* @returns {number}
	*/
	progress() {
		const { duration } = this.parameters();
		return MotionEasing.normalize(this.elapsedFrames() / duration);
	}
	/**
	* Writes this frame of the tilt into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		const { peak } = this.parameters();
		const envelope = Math.sin(this.progress() * Math.PI);
		composition.contribute(this, MotionChannels.ROTATION, envelope * peak);
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/managers/JuiceHeldOverlayManager.js
/**
* Keeps track of every icon a character is holding up, and puts them back on screen.
*
* The weapon swing overlay was built for something that happens and is over — a sword comes out,
* arcs, and destroys itself a quarter of a second later, so nothing ever had to remember it. An
* icon held up until a cutscene says otherwise is the same drawing with the opposite lifetime, and
* a lifetime measured in minutes crosses everything that tears a spriteset down.
*
* So this class holds requests, not sprites, and sprites come and ask. {@link #materializeFor} runs
* from `Sprite_Character#update`, which means a rebuilt map scene restores its held icons on the
* first frame it draws without anybody having to notice the scene changed. The alternative — a
* teardown hook that saves state and a startup hook that restores it — has to know every route out
* of a map scene, and there are more of those than anyone remembers.
*
* State lives for as long as the characters do and no longer: a `WeakMap` keyed by character means
* the events of a map the player has left are collected along with their held overlays, while
* `$gamePlayer` and the followers persist and keep theirs. Nothing here is saved to file, which
* matches how J-Motion's composer behaves and keeps one rule to remember instead of two.
*/
var JuiceHeldOverlayManager = class JuiceHeldOverlayManager {
	/**
	* Every held overlay, by character and then by who asked for it.
	*
	* Two sources can hold two different icons up on one character without either knowing about the
	* other, which is the same guarantee a source key buys on the motion composer.
	* @type {WeakMap<Game_Character, Map<string, JuiceHeldOverlay>>}
	*/
	static #byCharacter = new WeakMap();
	/**
	* Asks a character to hold an icon up until somebody says otherwise.
	*
	* A source asking twice replaces what it had rather than stacking, because "hold this up" is a
	* statement about what the character is currently doing rather than another thing to add to it.
	* @param {Game_Character} character The character to hold the icon up.
	* @param {string} sourceKey Who is asking, and who may later withdraw it.
	* @param {number} iconIndex The IconSet cell to hold up.
	* @param {string} motionType The overlay preset to pose it in, ex: `present`.
	* @param {number} durationFrames How many frames reaching the pose takes.
	* @param {number} repeatCount How many times the motion repeats on the way there.
	* @param {number} arcSpanDegrees Arc span in degrees, for the presets that orbit.
	*/
	static declare(character, sourceKey, iconIndex, motionType, durationFrames, repeatCount, arcSpanDegrees) {
		JuiceHeldOverlayManager.withdraw(character, sourceKey);
		const declaration = new JuiceHeldOverlay(character, sourceKey, iconIndex, motionType, durationFrames, repeatCount, arcSpanDegrees);
		const declarations = JuiceHeldOverlayManager.#declarationsFor(character);
		declarations.set(sourceKey, declaration);
	}
	/**
	* Takes down whatever a source was holding up on a character.
	*
	* Silent when that source is holding nothing, because the honest use of this is "make sure the
	* hero is not still brandishing the amulet", and an author should be able to say that at the end
	* of a cutscene without first working out whether a branch earlier on ever started it.
	* @param {Game_Character} character The character to take the icon from.
	* @param {string} sourceKey Who is withdrawing.
	*/
	static withdraw(character, sourceKey) {
		const declarations = JuiceHeldOverlayManager.#byCharacter.get(character);
		if (declarations === undefined) return;
		const declaration = declarations.get(sourceKey);
		if (declaration === undefined) return;
		JuiceHeldOverlayManager.#detach(declaration);
		declarations.delete(sourceKey);
	}
	/**
	* Puts every icon this sprite's character is holding up back on screen.
	*
	* Runs on every character on the map on every frame, so the first thing it does is establish that
	* the overwhelming majority of them are holding nothing.
	* @param {Sprite_Character} sprite The sprite about to draw.
	*/
	static materializeFor(sprite) {
		const character = sprite.character();
		const declarations = JuiceHeldOverlayManager.#byCharacter.get(character);
		if (declarations === undefined) return;
		declarations.forEach((declaration) => JuiceHeldOverlayManager.#materialize(declaration, sprite));
	}
	/**
	* Builds the sprite work for one held overlay, if it is not already right.
	* @param {JuiceHeldOverlay} declaration The overlay being held up.
	* @param {Sprite_Character} sprite The sprite to draw it on.
	*/
	static #materialize(declaration, sprite) {
		if (declaration.isCurrentFor(sprite) === true) return;
		const isRebuild = declaration.effect() !== null;
		JuiceHeldOverlayManager.#detach(declaration);
		const facing = declaration.character().direction();
		const effect = JuiceWeaponSwingOverlay.playPreset(sprite, declaration.iconIndex(), declaration.motionType(), declaration.durationFrames(), declaration.repeatCount(), declaration.arcSpanDegrees(), facing);
		effect.flagHeld();
		if (isRebuild === true) {
			effect.setFrame(effect.durationFrames());
		}
		declaration.setEffect(effect);
		declaration.setFacing(facing);
	}
	/**
	* Stops whatever is currently drawing a held overlay, leaving the request itself intact.
	* @param {JuiceHeldOverlay} declaration The overlay to stop drawing.
	*/
	static #detach(declaration) {
		const effect = declaration.effect();
		if (effect === null) return;
		JuiceMotionManager.discardEffect(effect);
		declaration.setEffect(null);
	}
	/**
	* Gets the declaration table for a character, creating it the first time one is needed.
	* @param {Game_Character} character The character to look up.
	* @returns {Map<string, JuiceHeldOverlay>}
	*/
	static #declarationsFor(character) {
		const existing = JuiceHeldOverlayManager.#byCharacter.get(character);
		if (existing !== undefined) return existing;
		const declarations = new Map();
		JuiceHeldOverlayManager.#byCharacter.set(character, declarations);
		return declarations;
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/models/JuiceCastingSquishMotionEffect.js
/**
* The frantic squat a battler does while it is working something off mid-cast.
*
* Like the casting pulse, this has no duration: a cast lasts until the caster finishes, is
* interrupted, or dies, and this animates for exactly as long as something keeps declaring it. What
* differs is the shape. The pulse swells both axes together because it is a charge-up, and nothing is
* being deformed. This compresses height as it widens, which is the squish grammar for impact, and it
* does so on a fixed fast period rather than a ramp. A steady, rapid squat reads as effort being spent;
* a build-up would read as energy gathering, which is the opposite of the fiction.
*
* The envelope only ever squashes. A sine over half a cycle sits at zero on both ends and peaks in the
* middle, so every squat starts and ends at the sprite's true size and nothing snaps back.
*
* `MotionEffect` and `MotionChannels` are reached as globals rather than imports: they ship inside
* J-Motion's bundle and are hoisted by the time this one loads.
*/
var JuiceCastingSquishMotionEffect = class extends MotionEffect {
	/**
	* The channels a casting squish takes exclusive ownership of.
	*
	* Scale only, like every other body reaction. No glow is claimed or contributed: the charge glow
	* belongs to gathering energy, and a battler doing squats is spending it.
	* @returns {string[]}
	*/
	claims() {
		return [MotionChannels.SCALE_X, MotionChannels.SCALE_Y];
	}
	/**
	* How far through the current squat this frame is, from 0 to 1.
	*
	* Counted by wrapping elapsed frames rather than resetting a counter, so a squat that runs for the
	* length of a long cast needs no bookkeeping and cannot drift.
	* @returns {number}
	*/
	cycleProgress() {
		const { period } = this.parameters();
		return this.elapsedFrames() % period / period;
	}
	/**
	* Writes this frame of the squat into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		const { intensity } = this.parameters();
		const envelope = Math.sin(this.cycleProgress() * Math.PI);
		const swell = 1 + envelope * intensity;
		composition.contribute(this, MotionChannels.SCALE_X, swell);
		composition.contribute(this, MotionChannels.SCALE_Y, 1 / swell);
	}
};

//#endregion
//#region src/plugins/abs/ext/juice/core/registerJuiceMotionTypes.js
/**
* Teaches J-Motion the four shapes a battler makes when it does something.
*
* These are registered rather than kept private because the registry is the only way into the
* composer, and going through it has a second benefit worth having: a combat reaction becomes
* something an event page or a state can ask for by name, so the squish a sword makes is available
* to a cutscene without a line of code being written for it.
*
* None of them take a phase offset. Every other motion in the ecosystem starts somewhere random in
* its cycle so that a room full of them does not animate in lockstep, but a reaction happens because
* something just happened — starting one halfway through would drop the frame the player is watching
* for.
*
* The defaults here are the fallback for a hand-authored tag. Combat passes every parameter
* explicitly, resolved from this plugin's own metadata and the skill's notetags, so nothing on this
* page affects what a weapon does.
*/
MotionTypeRegistry.register("squish", {
	implementation: JuiceSquishMotionEffect,
	parameterNames: [
		"intensity",
		"duration",
		"repeats"
	],
	defaults: {
		intensity: .12,
		duration: 12,
		repeats: 1
	},
	phaseSpan: () => 0
});
MotionTypeRegistry.register("tilt", {
	implementation: JuiceTiltMotionEffect,
	parameterNames: ["peak", "duration"],
	defaults: {
		peak: .35,
		duration: 12
	},
	phaseSpan: () => 0
});
MotionTypeRegistry.register("flip", {
	implementation: JuiceFlipBodyMotionEffect,
	parameterNames: [
		"turns",
		"duration",
		"direction"
	],
	defaults: {
		turns: 1,
		duration: 24,
		direction: "cw"
	},
	phaseSpan: () => 0
});
MotionTypeRegistry.register("charge", {
	implementation: JuiceCastingPulseMotionEffect,
	parameterNames: ["amplitude"],
	defaults: { amplitude: .04 },
	phaseSpan: () => 0
});
MotionTypeRegistry.register("castSquish", {
	implementation: JuiceCastingSquishMotionEffect,
	parameterNames: ["intensity", "period"],
	defaults: {
		intensity: .14,
		period: 8
	},
	phaseSpan: () => 0
});

//#endregion
//#region src/plugins/abs/ext/juice/objects/JABS_Battler.js
/**
* Extends {@link JABS_Battler.processCastingTimer}.<br/>
* Keeps casting pulse juice alive while the battler remains in a casting state.
*/
J.ABS.EXT.JUICE.Aliased.JABS_Battler.set("processCastingTimer", JABS_Battler.prototype.processCastingTimer);
JABS_Battler.prototype.processCastingTimer = function() {
	J.ABS.EXT.JUICE.Aliased.JABS_Battler.get("processCastingTimer").call(this);
	if (this.isCasting() === true && this.isDead() === false) {
		JuiceHookManager.tickCastingJuice(this);
	}
};
/**
* Extends {@link JABS_Battler.onCastComplete}.<br/>
* Clears casting-layer transforms before the decided action executes on the map.
*/
J.ABS.EXT.JUICE.Aliased.JABS_Battler.set("onCastComplete", JABS_Battler.prototype.onCastComplete);
JABS_Battler.prototype.onCastComplete = function() {
	JuiceHookManager.endCastingJuice(this);
	J.ABS.EXT.JUICE.Aliased.JABS_Battler.get("onCastComplete").call(this);
};

//#endregion
//#region src/plugins/abs/ext/juice/scenes/Scene_Map.js
/**
* Extends {@link Scene_Map#update}.<br/>
* Advances queued juice tweens after the map scene finishes its own update pass.
*/
J.ABS.EXT.JUICE.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function() {
	J.ABS.EXT.JUICE.Aliased.Scene_Map.get("update").call(this);
	JuiceMotionManager.frameTick();
};
/**
* Extends {@link Scene_Map#terminate}.<br/>
* Flushes all queued juice effects before the scene is torn down.
*
* The JuiceMotionManager effect queue is static and outlives any single scene instance.
* All queued effects hold direct references to Sprite_Character objects that belong to
* this scene's spriteset; those sprites are destroyed along with the scene. Clearing the
* queue here ensures the next Scene_Map instance does not inherit stale references to
* dead sprites and crash on the first frameTick call.
*/
J.ABS.EXT.JUICE.Aliased.Scene_Map.set("terminate", Scene_Map.prototype.terminate);
Scene_Map.prototype.terminate = function() {
	JuiceMotionManager.clearAll();
	J.ABS.EXT.JUICE.Aliased.Scene_Map.get("terminate").call(this);
};

//#endregion
//#region src/plugins/abs/ext/juice/sprites/Sprite_Character.js
/**
* Extends {@link #update}.<br/>
* Restores any icon this sprite's character is holding up.
*
* This runs on every frame rather than on some event announcing that a sprite was created, because
* there is no such event that covers every route. A sprite appears when a map loads, when the menu
* closes, when an event page turns, and when a follower joins the party; a held overlay has to
* survive all four, and asking on every frame is what makes the question "is this drawn correctly
* right now" instead of "did something happen that means it might not be".
*
* The cost of asking is one `WeakMap` miss for every character holding nothing, which is very
* nearly all of them.
*/
J.ABS.EXT.JUICE.Aliased.Sprite_Character.set("update", Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function() {
	J.ABS.EXT.JUICE.Aliased.Sprite_Character.get("update").call(this);
	this.updateHeldJuiceOverlays();
};
/**
* Restores any held juice overlays this sprite's character has outstanding.
*/
Sprite_Character.prototype.updateHeldJuiceOverlays = function() {
	JuiceHeldOverlayManager.materializeFor(this);
};

//#endregion
//#region src/plugins/abs/ext/juice/_metadata/pluginCommands.js
/**
* Reads one numeric command argument, falling back when the field was left blank.
*
* `Number.parseInt` answers `NaN` for an empty string, and a `NaN` duration is the one that cannot
* be shrugged off: the overlay's own progress is computed against it, `frame >= NaN` is false
* forever, and a one-shot that never finishes is also never tracked by anything that could take it
* down again. The fallbacks are the defaults each argument declares in `_annotations.js`.
* @param {string} raw The argument as the command handed it over.
* @param {number} fallback The value to use when the field held nothing usable.
* @returns {number}
*/
var readNumber = (raw, fallback) => {
	const parsed = Number.parseInt(raw, 10);
	return Number.isFinite(parsed) ? parsed : fallback;
};
/**
* Shows an icon over a character, either as a single motion or held until withdrawn.
*
* Everything a battler does with its own body is already addressable from an event page, because
* those motions register with J-Motion and `applyMotion` can ask for any of them by name. The
* overlay is the half that could not be: it is a sprite this plugin builds rather than a channel on
* one the engine draws, so it has no declaration for `applyMotion` to make.
*
* `MotionTargetResolver` is reached as a global rather than imported: it ships inside J-Motion's
* bundle, which is a declared `@base` and is hoisted long before this one loads.
*/
PluginManager.registerCommand(J.ABS.EXT.JUICE.Metadata.name, "applyOverlay", function(args) {
	const { target, targetId, iconSource, iconId, motion, duration, repeats, spanDegrees, hold, sourceKey } = args;
	const parsedTargetId = Number.parseInt(targetId, 10);
	const parsedIconId = Number.parseInt(iconId, 10);
	const parsedDuration = readNumber(duration, 20);
	const parsedRepeats = readNumber(repeats, 1);
	const parsedSpanDegrees = readNumber(spanDegrees, 120);
	const isHeld = hold === "true";
	const resolvedSourceKey = sourceKey || "command";
	const character = MotionTargetResolver.resolve(target, parsedTargetId, this);
	if (!character) {
		Diagnostics.warn("J-ABS-Juice", "apply overlay could not find its target", {
			target,
			targetId
		});
		return;
	}
	if (JuiceWeaponSwingMotionEffect.isKnownMotionType(motion) === false) {
		Diagnostics.warn("J-ABS-Juice", `unknown overlay motion: [ ${motion} ]`, {
			motion,
			target
		});
		return;
	}
	const iconIndex = JuiceIconResolver.resolve(iconSource, parsedIconId);
	if (isHeld === true) {
		JuiceHeldOverlayManager.declare(character, resolvedSourceKey, iconIndex, motion, parsedDuration, parsedRepeats, parsedSpanDegrees);
		return;
	}
	const sprite = JuiceMapSpriteFinder.findSpriteCharacterFor(character);
	if (sprite === null) {
		Diagnostics.warn("J-ABS-Juice", "apply overlay found no sprite for its target", {
			target,
			targetId
		});
		return;
	}
	const facing = character.direction();
	JuiceWeaponSwingOverlay.playPreset(sprite, iconIndex, motion, parsedDuration, parsedRepeats, parsedSpanDegrees, facing);
});
/**
* Takes down whatever a source was holding up on a character.
*
* Only reaches held overlays. A one-shot lasts a fraction of a second and takes itself down, so
* there is never a moment when withdrawing one would mean anything.
*/
PluginManager.registerCommand(J.ABS.EXT.JUICE.Metadata.name, "removeOverlay", function(args) {
	const { target, targetId, sourceKey } = args;
	const parsedTargetId = Number.parseInt(targetId, 10);
	const resolvedSourceKey = sourceKey || "command";
	const character = MotionTargetResolver.resolve(target, parsedTargetId, this);
	if (!character) {
		Diagnostics.warn("J-ABS-Juice", "remove overlay could not find its target", {
			target,
			targetId
		});
		return;
	}
	JuiceHeldOverlayManager.withdraw(character, resolvedSourceKey);
});

//#endregion
//# sourceMappingURL=J-ABS-Juice.js.map