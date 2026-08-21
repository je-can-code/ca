//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.3.0 PASSIVE-CONDITIONAL] Gates passives and auto-applies combat states (JABS map).
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Passive
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Passive
 * @orderAfter J-Passive-Affix
 * @orderAfter J-CriticalFactors
 * @orderAfter J-Pixelistics
 * @help
 * ============================================================================
 * OVERVIEW
 * Extends J-Passive so passive grants from a source can be gated and scaled.
 * Unconditional passives are simply grants with no rules.
 *
 * Tag families on database rows (skills, states, equip, class, actor, enemy, etc.):
 *  passiveSourceRule       — gates every passive from this source
 *  passiveStateRule        — gates one state id from this source
 *  passiveStateCount       — stack contribution for one state id from this source
 *  autoApplyState          — applies a real combat state on a timer or combat event
 *  autoApplyStateOnNearby  — same as autoApplyState, but aura-style onto nearby battlers instead of the bearer
 *  autoExecuteSkill        — executes a map skill on a timer or combat event
 *  autoModifyCooldowns     — modifies one or more of the bearer's own active skill-slot cooldowns on a timer or combat event
 *  autoInflictState        — applies a real combat state onto whoever this battler just inflicted a state upon
 *  removeOnSkillExecution  — chance to strip a stack from this state when the bearer executes a map skill
 *  removeOnSkillResolution — chance to strip a stack from this state when the bearer's fired action expires
 *  removeStateOnMove       — strips this state the instant the bearer moves (pairs with autoApplyState's "stand")
 *
 * Map battlers re-check on a throttled timer; any passive refresh re-evaluates.
 * ============================================================================
 * GATE TAGS
 *  <passiveSourceRule:[KIND, PARAM?]>
 *  <passiveStateRule:[STATE_ID, KIND, PARAM?]>
 *
 * Threshold kinds use *Above (>=) and *Below (<=):
 *  hp/mp/tp — current resource percent; mhp/mmp/mtp — flat max values
 *  {registryKey}Above/Below — flat or hundred-scale per ParameterRegistry
 *  allAllies{Key}Above/Below — every allied JABS battler (incl. self) must pass
 *
 * Discrete kinds include alliesNearby, enemiesNearby, alliesNearbyBelow, enemiesNearbyBelow,
 * enemiesTargetingMe, enemiesTargetingMeBelow, hasState, negativeStateCount, slotOnCooldown,
 * slotOffCooldown, allOnCooldown, allOffCooldown, sinceLastMoved/Hit/Attacked,
 * movedWithin/hitWithin/attackedWithin (frames).
 *
 * alliesNearby/enemiesNearby pass at COUNT or more in range (>=); the *Below counterparts pass
 * under COUNT (<) — use them for "nobody nearby" gates, e.g. [enemiesNearbyBelow, 1, 1] for
 * "no enemies within melee range" (1 tile).
 *
 * enemiesTargetingMe/enemiesTargetingMeBelow work the same way but are NOT proximity-scoped-
 * they count opposing battlers that currently have this battler as their live AI target,
 * regardless of tile distance. No radius param; PARAM is just the count threshold.
 *
 * EXAMPLES:
 *  <passive:[12]>
 *  <passiveStateRule:[12, hpBelow, 25]>
 *  <passiveSourceRule:[allOffCooldown]>
 *  <passiveSourceRule:[enemiesNearbyBelow, 1, 1]>
 *  <passiveSourceRule:[enemiesTargetingMe, 1]>
 *    Only grants this source's passives while at least one enemy has this battler targeted.
 * ============================================================================
 * STACK COUNT TAG
 *  <passiveStateCount:[STATE_ID, KIND, PARAM]>
 *
 * Kinds: negativeStateCount, alliesNearby (excludes self), enemiesNearby, enemiesTargetingMe
 * (not proximity-scoped- see above), lessIsMoreHp/Mp/Tp, moreIsMoreHp/Mp/Tp, per-{registryKey}
 * (integer points per stack).
 *
 * EXAMPLE:
 *  <passiveStateCount:[70, enemiesTargetingMe, 1]>
 *    State 70 gains 1 stack per enemy currently targeting this battler- pair with a state
 *  carrying a flat pdr/mdr param-rate trait so each stack chips away at incoming damage.
 * ============================================================================
 * AUTO-APPLY STATE TAG
 *  <autoApplyState:[STATE_ID, CONDITION, PARAM]>
 *
 * Applies a normal JABS state (shield, buff, etc.) — not a passive grant.
 * Do not also list the same state id in <passive:[...]> on the same row.
 * PARAM meaning depends on CONDITION (see below).
 *
 * CONDITIONS — PARAM is minimum FRAMES between applies (per source+state+condition):
 *  time            — periodic while on the ABS map (interval = PARAM)
 *  hpDmg / mpDmg / tpDmg — combat loss via gain* < 0 (not skill MP/TP pay)
 *  anyDmg          — when HP, MP, or TP takes combat damage
 *  whenCrit        — when THIS battler is critically hit (victim; not onCritApply)
 *  whenGlanced     — when THIS battler suffers a glancing blow (victim; implicit partial parry-
 *    reduced damage, not a miss); mutually exclusive with whenCrit on any single hit
 *  negaStateAdded  — when a <type:negative> (isNegativeType) state is added
 *  posiStateAdded  — when a non-negative state is added
 *  anyStateAdded   — when any combat state is added
 *  onHealHp/Mp/Tp  — when this battler's own HP/MP/TP is restored (onSelfHeal)
 *  onAllyHeal      — when a battler within proximity of THIS battler is healed (any resource)
 *  onKill          — when this battler defeats an enemy (JABS_Engine#handleDefeatedEnemy)
 *  onDamageDealt   — when this battler lands damage on an opposing battler (JABS_Engine#postExecuteSkillEffects)
 *  onWeaponHit     — narrower onDamageDealt: only Mainhand/Offhand-slot hits qualify (basic attack
 *    or its combo chain); skills fired from any other slot do not trigger this condition
 *  move            — PARAM = whole TILES per apply (Pixelistics updatePixelStepping; requires J-Pixelistics)
 *  stand           — PARAM = frames between applies while standing still on the map
 *  enemiesNearby / alliesNearby / enemiesNearbyBelow / alliesNearbyBelow — 4/5-value proximity
 *    tuples, same shape and semantics as autoExecuteSkill's proximity form below.
 *
 * EXAMPLES:
 *  <autoApplyState:[50, time, 900]>
 *  <autoApplyState:[51, hpDmg, 60]>
 *  <autoApplyState:[52, anyDmg, 120]>
 *  <autoApplyState:[53, whenCrit, 120]>
 *  <autoApplyState:[53, whenGlanced, 120]>
 *  <autoApplyState:[54, negaStateAdded, 180]>
 *  <autoApplyState:[55, posiStateAdded, 180]>
 *  <autoApplyState:[56, anyStateAdded, 60]>
 *  <autoApplyState:[57, onKill, 0]>
 *  <autoApplyState:[58, onDamageDealt, 0]>
 *  <autoApplyState:[59, onAllyHeal, 0]>
 *  <autoApplyState:[MOMENTUM_ID, move, 2]>
 *  <autoApplyState:[BUFF_ID, stand, 120]>
 *  <autoApplyState:[ACCURACY_BUFF_ID, enemiesNearbyBelow, 1, 30, 1]>
 *    Every 30 frames, apply the accuracy buff while no enemy is within 1 tile (melee range).
 * ============================================================================
 * AUTO-APPLY STATE ON NEARBY TAG
 *  <autoApplyStateOnNearby:[STATE_ID, KIND, MIN_COUNT, COOLDOWN_FRAMES, TRIGGER_TILES?]>
 *
 * Aura-style sibling of autoApplyState: instead of applying STATE_ID to the rule bearer,
 * it redirects onto every battler currently in proximity- enemies or allies depending on
 * KIND. Good fit for "afflicts nearby enemies" or "buffs nearby allies" passive auras.
 *
 * Only four KIND values do anything here (every other autoApplyState CONDITION has no
 * proximity set to iterate and simply won't fire):
 *  enemiesNearby      — targets nearby enemy JABS battlers
 *  alliesNearby       — targets nearby allied JABS battlers, excluding the bearer itself
 *  enemiesNearbyBelow — same target set as enemiesNearby, gate inverted (see below)
 *  alliesNearbyBelow  — same target set as alliesNearby, gate inverted (see below)
 *
 * MIN_COUNT is the count threshold that gates the pulse. For enemiesNearby/alliesNearby the
 * pulse fires at MIN_COUNT or more in range; for the Below variants it fires strictly UNDER
 * MIN_COUNT. Either way the pulse then hits everyone CURRENTLY in range, not just MIN_COUNT
 * of them- so a Below rule with MIN_COUNT 1 (the "nothing nearby" case) can gate-pass while
 * resolving zero targets, applying to nobody that tick. MIN_COUNT 2+ still lands on whatever
 * stragglers remain under the threshold.
 * COOLDOWN_FRAMES is tracked on the bearer, so the pulse cadence is consistent regardless
 * of how many targets are currently in range.
 * The optional fifth TRIGGER_TILES overrides the plugin's default proximity radius for
 * this rule's gate only.
 *
 * EXAMPLES:
 *  <autoApplyStateOnNearby:[60, enemiesNearby, 1, 120]>
 *    Every 120 frames, if at least 1 enemy is within the default proximity radius, apply
 *    state 60 to every nearby enemy.
 *
 *  <autoApplyStateOnNearby:[61, alliesNearby, 2, 300, 8]>
 *    Every 300 frames, if at least 2 allies (excluding the bearer) are within 8 tiles,
 *    apply state 61 to every nearby ally.
 *
 *  <autoApplyStateOnNearby:[62, enemiesNearbyBelow, 3, 120]>
 *    Every 120 frames, if fewer than 3 enemies are within range, apply state 62 to
 *    whichever enemies (0-2 of them) are still around.
 * ============================================================================
 * AUTO-EXECUTE SKILL TAG
 *  <autoExecuteSkill:[SKILL_ID, CONDITION, PARAM]>
 *
 * Fires a map skill through JABS forceMapAction — no MP/TP cost, no skill cooldown.
 * Victims may parry and retaliate. Payload skill owns radius, hitbox, and formula.
 * Do not tag the payload skill with autoExecuteSkill (depth guard).
 * PARAM meaning matches autoApplyState CONDITIONS, plus:
 *  enemiesNearby / alliesNearby / enemiesNearbyBelow / alliesNearbyBelow — four- or
 *  five-value tuple:
 *    <autoExecuteSkill:[SKILL_ID, KIND, COUNT, FRAMES]>
 *    optional fifth TRIGGER_TILES overrides default-proximity-tiles for the gate only.
 *    enemiesNearby/alliesNearby fire at or above COUNT; the Below variants fire strictly
 *    under COUNT.
 *
 * EXAMPLES:
 *  <autoExecuteSkill:[1021, time, 60]>
 *  <autoExecuteSkill:[1022, enemiesNearby, 1, 60]>
 *  <autoExecuteSkill:[1023, move, 1]>
 *  <autoExecuteSkill:[1024, stand, 120]>
 *  <autoExecuteSkill:[1025, enemiesNearbyBelow, 1, 60, 1]>
 *    Casts skill 1025 every 60 frames while no enemy is within 1 tile.
 *  <autoExecuteSkill:[1026, onWeaponHit, 0]>
 *    Magic-knight style: every basic-attack (or combo) hit also fires skill 1026 on the target.
 *  <autoExecuteSkill:[1027, whenGlanced, 0]>
 *    Retaliate on a glancing blow: every time this battler is grazed, fires skill 1027 as a real
 *    map action from this battler's own position. No auto-aim at the attacker- the payload skill's
 *    own hitbox/range decides who it reaches (self-centered radial or facing-cone reads as
 *    "retaliation").
 * ============================================================================
 * AUTO-MODIFY COOLDOWNS TAG
 *  <autoModifyCooldowns:[AMOUNT, CONDITION, THROTTLE_FRAMES, UNIT, RANGE?, TARGET_KEY?]>
 *
 * Directly modifies one or more of the bearer's own active skill-slot cooldowns- no skill or state
 * is executed/applied, this tag mutates cooldown timers in place.
 *
 * Unlike its siblings, AMOUNT is a signed modification amount, not a database id: negative reduces
 * a cooldown, positive increases it. THROTTLE_FRAMES is the same per-rule minimum-frames-between-
 * dispatches gate every other tag in this family uses.
 *
 * UNIT (required):
 *  percent — AMOUNT is a percentage of each targeted cooldown's own full/total duration (not
 *            however much of it happens to remain), so a kill always refunds a consistent,
 *            predictable chunk regardless of timing.
 *  flat    — AMOUNT is a literal frame count, applied directly regardless of that skill's length.
 *
 * RANGE (optional, defaults to "all"):
 *  single  — exactly one named slot; requires TARGET_KEY.
 *  combat  — the four combat-skill slots only.
 *  all     — mainhand, offhand, tool, dodge (mobility skills equip here), and all four combat
 *            skills. Deliberately excludes GCD/usable-item slots.
 *
 * TARGET_KEY (required only when RANGE is "single"): an author-facing slot name — mainhand,
 * offhand, tool, dodge, or skill1-skill4 (combatskill1-4 also accepted); raw JABS_Button keys pass
 * through unchanged.
 *
 * Only slots that are both equipped and currently mid-cooldown (frames > 0) are touched- a slot
 * that's already ready has nothing to modify.
 *
 * Built on the same condition framework as the rest of this family, but only a subset of pumps are
 * currently wired for this tag (see {@link AutoModifyCooldownManager}): onKill, and
 * negaStateInflicted/posiStateInflicted/anyStateInflicted (this battler inflicts a state onto
 * someone else- the effect lands back on the inflictor, not the afflicted target). Other conditions
 * parse correctly but will not yet fire until their pump call sites are wired.
 *
 * EXAMPLES:
 *  <autoModifyCooldowns:[-10, onKill, 0, percent, all]>
 *    On every kill, no throttle: -10% of full duration off every active mainhand/offhand/tool/
 *    dodge/combat-skill cooldown.
 *  <autoModifyCooldowns:[-60, onKill, 0, flat, all]>
 *    Same trigger/range, but a flat 60-frame (1 second) refund regardless of each skill's own
 *    total duration.
 *  <autoModifyCooldowns:[-15, onKill, 0, percent, combat]>
 *    Restricted to the four combat-skill slots only.
 *  <autoModifyCooldowns:[-25, onKill, 0, percent, single, mainhand]>
 *    Restricted to the mainhand slot only.
 *  <autoModifyCooldowns:[-10, onKill, 0, percent]>
 *    RANGE omitted- defaults to "all".
 *  <autoModifyCooldowns:[-60, negaStateInflicted, 0, flat, all]>
 *    Every time this battler inflicts a negative-tagged state on an opponent, no throttle: refund
 *    a flat 60 frames (1 second) off every active cooldown.
 * ============================================================================
 * AUTO-INFLICT STATE TAG
 *  <autoInflictState:[STATE_ID, CONDITION, COOLDOWN_FRAMES]>
 *
 * Unlike autoApplyState (applies to the rule bearer) and its OnNearby sibling (applies to
 * proximity), this fires from an event involving an external battler- the rule bearer doing
 * something to someone else- and applies STATE_ID onto that same someone else. The bearer's own
 * state tracking credits the bearer as the inflictor of STATE_ID, matching who really did it.
 * COOLDOWN_FRAMES is the minimum frames between dispatches for this rule; 0 means every time.
 * Depth-guarded (auto-inflict-state-max-depth) in case STATE_ID is itself negative-tagged and
 * would otherwise re-trigger this same tag on application.
 *
 * CONDITIONS:
 *  negaStateInflicted — this battler inflicts a <type:negative> (isNegativeType) state on someone
 *  posiStateInflicted — this battler inflicts a non-negative state on someone
 *  anyStateInflicted  — this battler inflicts any state on someone
 *  onKnockback        — this battler knocks an enemy back (JABS_Engine#checkKnockback)
 *
 * EXAMPLES:
 *  <autoInflictState:[70, negaStateInflicted, 0]>
 *  <autoInflictState:[71, posiStateInflicted, 60]>
 *  <autoInflictState:[72, anyStateInflicted, 0]>
 *  <autoInflictState:[73, onKnockback, 0]>
 * ============================================================================
 * REMOVE ON SKILL EXECUTION (state note only)
 *  <removeOnSkillExecution:[STYPE_ID, CHANCE]>
 *
 * On this battler executing a map skill, rolls CHANCE (1–100). STYPE_ID 0 = any type.
 * On success, peels stacks via decrementStateStacks (respects loseAllStacksAtOnce on
 * this state row). Tag lives on the state that may be removed — not on skills/equip.
 *
 * EXAMPLES:
 *  <removeOnSkillExecution:[7, 100]>
 *  <removeOnSkillExecution:[0, 25]>
 * ============================================================================
 * REMOVE ON SKILL RESOLUTION (state note only)
 *  <removeOnSkillResolution:[STYPE_ID, CHANCE]>
 *
 * When the action fired by this battler fully expires — after its last hit lands,
 * or after it travels its full duration without contacting any target — rolls CHANCE
 * (1–100). STYPE_ID 0 = any type. On success, peels stacks via decrementStateStacks
 * (respects loseAllStacksAtOnce on this state row). Tag lives on the state that may
 * be removed — not on skills/equip.
 *
 * Unlike removeOnSkillExecution, removal fires at action expiry (after damage is
 * already resolved), so state traits such as ATK bonuses are still present during
 * damage calculation.
 *
 * EXAMPLES:
 *  <removeOnSkillResolution:[7, 100]>
 *  <removeOnSkillResolution:[0, 25]>
 * ============================================================================
 * REMOVE STATE ON MOVE (state note only)
 *  <removeStateOnMove:[STATE_ID]>
 *
 * The instant the bearer moves on the map, unconditionally peels one stack from STATE_ID
 * (or all stacks at once if that state row has loseAllStacksAtOnce set). No chance roll,
 * no stype filter- this fires every single time the bearer moves, full stop. Tag lives on
 * the state doing the peeling- typically the SAME state also carries an autoApplyState
 * "stand" rule for the very state id it removes, since this pairing is what makes a
 * "charge up while standing still, lose it the moment you move" mechanic work: standing
 * still builds the stack, moving strips it instantly, and the stand cooldown is reset to a
 * full interval the moment you move again so the buildup can't restart instantly either.
 *
 * EXAMPLES:
 *  <autoApplyState:[80, stand, 60]>
 *  <removeStateOnMove:[80]>
 *    On this same state row: standing still for 60 frames applies a stack of state 80.
 *    Taking even a single step immediately strips it and resets the stand timer.
 * ============================================================================
 * CHANGELOG:
 * - 1.3.0
 *    Passive states no longer appear in the JABS affliction strip. A passive is
 *    permanent and neither waits out nor cures, so listing it beside poison and
 *    paralysis filled the strip with rows the player could do nothing about.
 *    This exclusion previously lived in J-ABS, which had to reach across for it;
 *    it belongs here, where passives and JABS already meet.
 * - 1.2.0
 *    Conditional passive tracking state is no longer written to savefiles
 *    where it can be recomputed from the battler's current situation on load.
 * - 1.1.2
 *    Added the whenGlanced condition (this battler suffers a glancing blow as the victim- mutually
 *    exclusive with whenCrit on any single hit), wired into autoApplyState and autoExecuteSkill via
 *    Game_Action#apply alongside the existing whenCrit check. Lets "retaliate on a glancing blow"
 *    builds fire.
 * - 1.1.1
 *    Wired negaStateInflicted/posiStateInflicted/anyStateInflicted into autoModifyCooldowns via a
 *    new shared AutoRuleManager#scheduleSelfStateInflictedTriggers pump, called from
 *    Game_Battler#onJabsStateInflicted alongside the existing autoInflictState dispatch. Lets
 *    "reduce my own cooldowns when I land a debuff" builds fire, not just onKill.
 * - 1.1.0
 *    Added autoModifyCooldowns, which directly modifies one or more of the bearer's own active
 *    skill-slot cooldowns (percent-of-total or flat frames) on a condition- currently wired for
 *    onKill only. Widened the shared dispatch contract so a subclass's dispatch() can see the full
 *    authored tuple, not just the leading id, and added an opt-out (requiresPositiveId) from the
 *    base class's positive-id validation for tags whose leading slot is a signed value instead.
 * - 1.0.0
 *    Initial release. Passive gates (passiveSourceRule, passiveStateRule,
 *    passiveStateCount) with map reconcile and combat timestamps (movement, hit,
 *    attack, onHealHp/Mp/Tp). autoApplyState schedules real JABS states on time,
 *    hpDmg/mpDmg/tpDmg/anyDmg (combat gain* loss only, not skill pay), whenCrit
 *    (victim), negaStateAdded/posiStateAdded/anyStateAdded, move (whole tiles via
 *    Pixelistics updatePixelStepping), and stand (idle on map). removeOnSkillExecution on state
 *    rows (stype filter, chance, stack-aware decrementStateStacks). removeOnSkillResolution on
 *    state rows — same shape as removeOnSkillExecution but fires at action expiry so state
 *    traits are active during damage calculation.
 * ============================================================================
 *
 * @param parentConfigPassiveConditional
 * @text PASSIVE CONDITIONAL
 *
 * @param reconcile-delay-frames
 * @parent parentConfigPassiveConditional
 * @type number
 * @min 1
 * @max 600
 * @text Reconcile Delay (frames)
 * @desc Frames between passive rule re-checks per map battler.
 * @default 15
 *
 * @param default-proximity-tiles
 * @parent parentConfigPassiveConditional
 * @type number
 * @min 1
 * @max 99
 * @text Default Proximity (tiles)
 * @desc Tile radius for alliesNearby/enemiesNearby rules and stack counts.
 * @default 5
 *
 * @param auto-execute-skill-max-depth
 * @parent parentConfigPassiveConditional
 * @type number
 * @min 1
 * @max 8
 * @text Auto-Execute Max Depth
 * @desc Max nested autoExecuteSkill firings per synchronous call stack.
 * @default 1
 *
 * @param auto-inflict-state-max-depth
 * @parent parentConfigPassiveConditional
 * @type number
 * @min 1
 * @max 8
 * @text Auto-Inflict Max Depth
 * @desc Max nested autoInflictState firings per synchronous call stack.
 * @default 1
 */
//endregion annotations


//#region src/plugins/passive/ext/conditional/_metadata/_pluginMetadata.js
var JPassiveConditional_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
	* Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Parses the plugin parameters and assigns them to the metadata.
	*/
	initializeMetadata() {
		const reconcileParsed = parseInt(this.parsedPluginParameters["reconcile-delay-frames"], 10);
		/**
		* Frames between map-side passive rule reconciles per {@link JABS_Battler}.
		* @type {number}
		*/
		this.reconcileDelayFrames = Number.isNaN(reconcileParsed) ? 15 : reconcileParsed;
		const proximityParsed = parseInt(this.parsedPluginParameters["default-proximity-tiles"], 10);
		/**
		* Default tile radius for alliesNearby/enemiesNearby rules and stack counts.
		* @type {number}
		*/
		this.defaultProximityTiles = Number.isNaN(proximityParsed) ? 5 : proximityParsed;
		const depthParsed = parseInt(this.parsedPluginParameters["auto-execute-skill-max-depth"], 10);
		/**
		* Maximum nested {@link AutoExecuteSkillManager} executions per synchronous call stack.
		* @type {number}
		*/
		this.autoExecuteSkillMaxDepth = Number.isNaN(depthParsed) ? 1 : depthParsed;
		const inflictDepthParsed = parseInt(this.parsedPluginParameters["auto-inflict-state-max-depth"], 10);
		/**
		* Maximum nested {@link AutoInflictStateManager} dispatches per synchronous call stack.
		* @type {number}
		*/
		this.autoInflictStateMaxDepth = Number.isNaN(inflictDepthParsed) ? 1 : inflictDepthParsed;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs conditional passive states on the map.
*/
J.PASSIVE.EXT.CONDITIONAL = {};
/**
* The metadata associated with this plugin.
*/
J.PASSIVE.EXT.CONDITIONAL.Metadata = new JPassiveConditional_PluginMetadata("J-Passive-Conditional", "1.3.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased = {};
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Action = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Action = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Engine = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_CharacterBase = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.Window_PassiveDetail = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.StateAfflictionProvider = new Map();
/**
* All regular expressions used by this plugin.
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp = {};
/**
* Captures {@code passiveSourceRule} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match contributes one tuple that gates <strong>every</strong> passive state id declared on the same row.
* <p>
* Author shape: {@code <passiveSourceRule:[kind]>}, or {@code <passiveSourceRule:[kind, param]>}.<br/>
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code ['allOffCooldown']}</li>
*   <li>{@code ['alliesNearby', 2]}</li>
*   <li>{@code ['hpBelow', 25]}</li>
* </ul>
* <p>
* Multiple source rules on one row are AND-ed: every tuple must pass for any passive from that source to count.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule = /<passiveSourceRule:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code passiveStateRule} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match gates one passive state id declared on the same row; other passives on that row are unaffected.
* <p>
* Author shape: {@code <passiveStateRule:[stateId, kind]>}, or {@code <passiveStateRule:[stateId, kind, param]>}.<br/>
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [12, 'hpBelow', 25]}</li>
*   <li>{@code [5, 'hasState', 14]}</li>
*   <li>{@code [6, 'slotOffCooldown', 'mainhand']}</li>
* </ul>
* <p>
* Source-wide rules still apply first; state rules AND with any {@link PassiveSourceRule} tuples on the row.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule = /<passiveStateRule:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code passiveStateCount} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match scales how many stacks one source contributes for one passive state id (0 stacks is valid).
* <p>
* Author shape: {@code <passiveStateCount:[stateId, kind, param]>}.<br/>
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [77, 'moreIsMoreHp', 25]} — floor(current hp% / 25) stacks</li>
*   <li>{@code [12, 'per-cri', 3]} — floor(crit rate / 3) stacks (hundred-scale params use tag integers)</li>
*   <li>{@code [8, 'alliesNearby', 2]} — floor(nearby allies excluding self / 2) stacks</li>
* </ul>
* <p>
* When no count tuple targets a state, {@link Game_Battler#getPassiveStackContributionFromSource} falls back to 1.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount = /<passiveStateCount:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code autoApplyState} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match schedules a real JABS state application (not a passive grant).
* <p>
* Author shape: {@code <autoApplyState:[stateId, condition, param]>}.<br/>
* The third value is condition-specific — see plugin help for the glossary.
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [12, 'time', 900]} — every 900 frames while on the ABS map</li>
*   <li>{@code [14, 'hpDmg', 60]} — on HP damage, at most once per 60 frames</li>
*   <li>{@code [15, 'whenCrit', 120]} — when this battler is critically hit (victim)</li>
*   <li>{@code [16, 'anyDmg', 90]} — when HP, MP, or TP takes damage</li>
*   <li>{@code [17, 'posiStateAdded', 180]} — when a non-negative state is added</li>
*   <li>{@code [18, 'anyStateAdded', 60]} — when any combat state is added</li>
*   <li>{@code [42, 'move', 2]} — one apply per 2 whole tiles traveled (Pixelistics updatePixelStepping)</li>
*   <li>{@code [43, 'stand', 120]} — while idle on map, at most once per 120 frames</li>
* </ul>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState = /<autoApplyState:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code autoApplyStateOnNearby} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match schedules a real JABS state application onto nearby battlers (aura-style).
* <p>
* Unlike {@code autoApplyState} which applies to the rule bearer, this tag applies the state to
* every enemy or ally within proximity on each pulse. Only {@code enemiesNearby} and
* {@code alliesNearby} conditions are meaningful here.
* </p>
* <ul>
*   <li>{@code [1061, 'enemiesNearby', 1, 60]} — apply to all nearby enemies every 60 frames</li>
*   <li>{@code [1062, 'alliesNearby', 1, 120]} — apply to all nearby allies every 120 frames</li>
*   <li>{@code [1063, 'enemiesNearby', 2, 60, 3]} — apply when 2+ enemies within 3 tiles, every 60 frames</li>
* </ul>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyStateOnNearby = /<autoApplyStateOnNearby:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code autoExecuteSkill} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match schedules a map skill via {@link AutoExecuteSkillManager} and {@link JABS_Engine#forceMapAction}.
* <p>
* Author shape: {@code <autoExecuteSkill:[skillId, condition, param]>}, or a four- or five-value
* {@code enemiesNearby} tuple. After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [1021, 'time', 60]} — every 60 frames while on the ABS map</li>
*   <li>{@code [1022, 'enemiesNearby', 1, 60]} — every 60 frames when at least one enemy is in range</li>
*   <li>{@code [1023, 'enemiesNearby', 1, 30, 2]} — same with a 2-tile trigger gate radius</li>
*   <li>{@code [1024, 'move', 1]} — one execution per whole tile traveled</li>
*   <li>{@code [1025, 'stand', 120]} — while idle, at most once per 120 frames</li>
* </ul>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill = /<autoExecuteSkill:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code autoModifyCooldowns} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match schedules a signed cooldown modification via {@link AutoModifyCooldownManager} against
* one or more of the rule bearer's own active skill-slot cooldowns.
* <p>
* Unlike its siblings, {@code tuple[0]} is a signed modification amount, not a database id- negative
* reduces, positive increases. Unit (percent of the cooldown's own full duration, or a flat frame
* count) and range (which skill slots) live past the slots the shared dispatch loop inspects.
* </p>
* <p>
* Author shape: {@code <autoModifyCooldowns:[amount, condition, throttleFrames, unit, range?, targetKey?]>}.
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [-10, 'onKill', 0, 'percent', 'all']} — on every kill, -10% of full duration off
*   every active mainhand/offhand/tool/dodge/combat-skill cooldown</li>
*   <li>{@code [-60, 'onKill', 0, 'flat', 'all']} — same trigger/range, but a flat 60-frame refund
*   regardless of each skill's own total duration</li>
*   <li>{@code [-15, 'onKill', 0, 'percent', 'combat']} — restricted to the four combat-skill slots</li>
*   <li>{@code [-25, 'onKill', 0, 'percent', 'single', 'mainhand']} — restricted to one named slot</li>
*   <li>{@code [-10, 'onKill', 0, 'percent']} — range omitted, defaults to {@code 'all'}</li>
* </ul>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoModifyCooldowns = /<autoModifyCooldowns:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code autoInflictState} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match schedules a real JABS state application via {@link AutoInflictStateManager} onto
* whichever external battler was just affected by the rule bearer's event.
* <p>
* Unlike {@code autoApplyState} (applies to the rule bearer) and {@code autoApplyStateOnNearby}
* (applies to proximity), this tag fires from an event involving an external battler- the rule
* bearer doing something to someone else- and applies the payload state to that same someone else.
* </p>
* <p>
* Author shape: {@code <autoInflictState:[stateId, condition, cooldownFrames]>}.<br/>
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [1071, 'negaStateInflicted', 0]} — every time this battler inflicts any negative state</li>
*   <li>{@code [1072, 'posiStateInflicted', 60]} — on inflicting a positive state, at most once per 60 frames</li>
*   <li>{@code [1073, 'anyStateInflicted', 0]} — every time this battler inflicts any state at all</li>
*   <li>{@code [1074, 'onKnockback', 0]} — every time this battler knocks an enemy back</li>
* </ul>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoInflictState = /<autoInflictState:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code removeOnSkillExecution} bracket tuples from <strong>state</strong> notes only.<br/>
* On skill execution, rolls chance and may peel stacks via {@link Game_Battler#decrementStateStacks}.
* <p>
* Author shape: {@code <removeOnSkillExecution:[stypeId, chance]>}.<br/>
* {@code stypeId} 0 matches any skill type. {@code chance} is 1–100 for {@link RPGManager.chanceIn100}.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveOnSkillExecution = /<removeOnSkillExecution:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code removeOnSkillResolution} bracket tuples from <strong>state</strong> notes only.<br/>
* When the owning battler's action resolves against a target, rolls chance and may peel stacks
* via {@link Game_Battler#decrementStateStacks}. Fires after {@link Game_Action#apply} so that
* state traits are still active during damage calculation.
* <p>
* Author shape: {@code <removeOnSkillResolution:[stypeId, chance]>}.<br/>
* {@code stypeId} 0 matches any skill type. {@code chance} is 1–100 for {@link RPGManager.chanceIn100}.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveOnSkillResolution = /<removeOnSkillResolution:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code removeStateOnMove} bracket tuples from <strong>state</strong> notes only.<br/>
* When the owning battler moves, strips the target state via {@link Game_Battler#decrementStateStacks}.
* Respects {@code jabsLoseAllStacksAtOnce} on the target state — one call collapses all stacks if set.
* <p>
* Author shape: {@code <removeStateOnMove:[stateId]>}.<br/>
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [1031]} — strip state 1031 when this battler moves</li>
* </ul>
* <p>
* Intended use: mastery states pair {@code autoApplyState:[PAYLOAD, stand, F]} with
* {@code removeStateOnMove:[PAYLOAD]} to build a movement-reset stack counter.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove = /<removeStateOnMove:[ ]?(\[[^\]]+])>/gi;

//#endregion
//#region src/plugins/passive/ext/conditional/database/RPG_BaseBattler.js
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule} tuples from this row.<br/>
* Actor and enemy database rows extend {@link RPG_BaseBattler} — same getters as {@link RPG_BaseItem}.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "passiveSourceRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule} tuples from this row.<br/>
* Each tuple targets one passive state id; collection hooks filter by state when evaluating inclusion.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "passiveStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount} tuples from this row.<br/>
* Used by {@link Game_Battler#getPassiveStackContributionFromSource} instead of the default +1 stack.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "passiveStateCounts", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState} tuples from this row.<br/>
* Each tuple schedules a real state via {@link AutoApplyStateManager} (not the passive pipeline).
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "autoApplyStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyStateOnNearby} tuples from this row.<br/>
* Each tuple schedules a real state application onto nearby battlers via
* {@link AutoApplyStateOnNearbyManager} — aura-style, targeting enemies or allies in proximity
* rather than the rule bearer itself.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "autoApplyStateOnNearbyRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyStateOnNearby, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill} tuples from this row.<br/>
* Each tuple schedules a map skill via {@link AutoExecuteSkillManager}.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "autoExecuteSkillRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoModifyCooldowns} tuples from this row.<br/>
* Each tuple schedules a signed cooldown modification via {@link AutoModifyCooldownManager} against
* one or more of the bearer's own active skill-slot cooldowns.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "autoModifyCooldownRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoModifyCooldowns, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoInflictState} tuples from this row.<br/>
* Each tuple schedules a real state application via {@link AutoInflictStateManager} onto whichever
* external battler this row's bearer just inflicted a state upon- not the bearer, and not nearby.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "autoInflictStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoInflictState, true);
} });

//#endregion
//#region src/plugins/passive/ext/conditional/database/RPG_BaseItem.js
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule} tuples from this row.<br/>
* These live on the same database object as {@code <passive:[…]>} — not a parallel append pipeline.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "passiveSourceRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule} tuples from this row.<br/>
* Each tuple targets one passive state id; collection hooks filter by state when evaluating inclusion.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "passiveStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount} tuples from this row.<br/>
* Used by {@link Game_Battler#getPassiveStackContributionFromSource} instead of the default +1 stack.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "passiveStateCounts", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState} tuples from this row.<br/>
* Each tuple schedules a real state via {@link AutoApplyStateManager} (not the passive pipeline).
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "autoApplyStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyStateOnNearby} tuples from this row.<br/>
* Each tuple schedules a real state application onto nearby battlers via
* {@link AutoApplyStateOnNearbyManager} — aura-style, targeting enemies or allies in proximity
* rather than the rule bearer itself.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "autoApplyStateOnNearbyRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyStateOnNearby, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill} tuples from this row.<br/>
* Each tuple schedules a map skill via {@link AutoExecuteSkillManager}.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "autoExecuteSkillRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoModifyCooldowns} tuples from this row.<br/>
* Each tuple schedules a signed cooldown modification via {@link AutoModifyCooldownManager} against
* one or more of the bearer's own active skill-slot cooldowns.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "autoModifyCooldownRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoModifyCooldowns, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoInflictState} tuples from this row.<br/>
* Each tuple schedules a real state application via {@link AutoInflictStateManager} onto whichever
* external battler this row's bearer just inflicted a state upon- not the bearer, and not nearby.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "autoInflictStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoInflictState, true);
} });

//#endregion
//#region src/plugins/passive/ext/conditional/database/RPG_State.js
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveOnSkillExecution} tuples from this state row.<br/>
* Each tuple is {@code [stypeId, chance]}; {@code stypeId} 0 matches any skill type.
* @type {any[][]}
*/
Object.defineProperty(RPG_State.prototype, "removeOnSkillExecutionRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveOnSkillExecution, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveOnSkillResolution} tuples from this state row.<br/>
* Each tuple is {@code [stypeId, chance]}; {@code stypeId} 0 matches any skill type.
* Fires after {@link Game_Action#apply} so state traits are active during damage calculation.
* @type {any[][]}
*/
Object.defineProperty(RPG_State.prototype, "removeOnSkillResolutionRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveOnSkillResolution, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove} tuples from this state row.<br/>
* Each tuple is {@code [stateId]}; when the owning battler moves, that state is stripped.
* @type {any[][]}
*/
Object.defineProperty(RPG_State.prototype, "removeStateOnMoveRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove, true);
} });

//#endregion
//#region src/plugins/passive/ext/conditional/helpers/PassiveRuleThreshold.js
/**
* Shared threshold comparisons for passive gate rules ({@code *Above/*Below} and {@code allAllies*}).<br/>
* Authors write hundred-scale integers in tags for x/sparam registry keys (e.g. {@code 25} means 25% crit).
*/
var PassiveRuleThreshold = class {
	/**
	* Current hp/mp/tp keys compared as percent of max.
	* @type {string[]}
	*/
	static CURRENT_RESOURCE_KEYS = [
		"hp",
		"mp",
		"tp"
	];
	/**
	* Max hp/mp/tp keys compared as flat values from {@link Game_Battler#parameter}.
	* @type {string[]}
	*/
	static MAX_RESOURCE_KEYS = [
		"mhp",
		"mmp",
		"mtp"
	];
	/**
	* Compares one battler against a threshold using inclusive Above/Below semantics.<br/>
	* {@code hpAbove, 50} passes at exactly 50%; {@code hpBelow, 25} passes at exactly 25%.
	* @param {Game_Battler} battler The battler whose live value we read.
	* @param {string} key Resource or registry key (hp, cri, mhp, etc.).
	* @param {string} direction {@code 'above'} or {@code 'below'} parsed from the rule kind suffix.
	* @param {number} threshold Tag integer to compare against (percent or flat per key type).
	* @returns {boolean} Whether the battler satisfies the inclusive threshold.
	*/
	static compare(battler, key, direction, threshold) {
		const value = this.resolveRuleValue(battler, key);
		if (direction === "above") {
			return value >= threshold;
		}
		return value <= threshold;
	}
	/**
	* Resolves the left-hand value for a threshold key on one battler.<br/>
	* Routes current resources to percent, max resources to flat totals, everything else to registry.
	* @param {Game_Battler} battler The battler whose value we resolve.
	* @param {string} key Resource or registry key from the parsed rule kind.
	* @returns {number} Integer comparison value in tag authoring units.
	*/
	static resolveRuleValue(battler, key) {
		if (this.CURRENT_RESOURCE_KEYS.includes(key)) {
			return this.#currentResourcePercent(battler, key);
		}
		if (this.MAX_RESOURCE_KEYS.includes(key)) {
			return battler.parameter(key);
		}
		return this.#registryIntegerValue(battler, key);
	}
	/**
	* Converts current hp/mp/tp into a whole-number percent of max for threshold and stack math.
	* @param {Game_Battler} battler The battler whose resource we read.
	* @param {string} resource One of {@code hp}, {@code mp}, or {@code tp}.
	* @returns {number} Rounded percent 0–100; zero when max is zero.
	*/
	static #currentResourcePercent(battler, resource) {
		switch (resource) {
			case "hp": {
				const { mhp } = battler;
				if (mhp <= 0) return 0;
				return Math.round(battler.hp / mhp * 100);
			}
			case "mp": {
				const { mmp } = battler;
				if (mmp <= 0) return 0;
				return Math.round(battler.mp / mmp * 100);
			}
			case "tp": {
				const mtp = battler.maxTp();
				if (mtp <= 0) return 0;
				return Math.round(battler.tp / mtp * 100);
			}
		}
	}
	/**
	* Resolves a {@link ParameterRegistry} key into tag integer units for comparison.
	* @param {Game_Battler} battler The battler passed to the registry resolver.
	* @param {string} key Registry key such as {@code cri} or {@code rec}.
	* @returns {number} Whole-number value; unknown keys return zero (fail closed).
	*/
	static #registryIntegerValue(battler, key) {
		const definition = ParameterRegistry.get(key);
		if (!definition) return 0;
		const raw = definition.resolveValue(battler);
		if (this.#usesHundredScale(definition.format)) {
			return Math.round(raw * 100);
		}
		return raw;
	}
	/**
	* Whether a registry format stores fractional values that authors write as hundred-scale integers.
	* @param {string} format {@link ParameterDefinition} format id.
	* @returns {boolean} True when tag values should be compared after multiplying raw by 100.
	*/
	static #usesHundredScale(format) {
		return format === "percent" || format === "percentSuffix" || format === "percentCentered" || format === "multiplierPercent" || format === "scaledPoints" || format === "scaledOffset";
	}
	/**
	* Parses an {@code *Above/*Below} kind into key + direction when present.<br/>
	* Example: {@code hpBelow} → {@code { key: 'hp', direction: 'below' }}.
	* @param {string} kind Full rule kind from a parsed note tuple.
	* @returns {{ key: string, direction: string }|null} Parsed key/direction, or null when not a threshold kind.
	*/
	static parseThresholdKind(kind) {
		if (kind.endsWith("Above")) {
			return {
				key: kind.slice(0, -5),
				direction: "above"
			};
		}
		if (kind.endsWith("Below")) {
			return {
				key: kind.slice(0, -5),
				direction: "below"
			};
		}
		return null;
	}
	/**
	* Parses an {@code allAllies*Above/Below} kind when present.<br/>
	* Every allied JABS battler (including self) must satisfy the same threshold.
	* @param {string} kind Full rule kind from a parsed note tuple.
	* @returns {{ key: string, direction: string }|null} Parsed key/direction after the allAllies prefix.
	*/
	static parseAllAlliesThresholdKind(kind) {
		if (kind.startsWith("allAllies") === false) return null;
		const stripped = kind.slice("allAllies".length);
		const remainder = stripped.charAt(0).toLowerCase() + stripped.slice(1);
		return this.parseThresholdKind(remainder);
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/helpers/PassiveRuleJabsAccess.js
/**
* Resolves {@link JABS_Battler} context and proximity helpers for passive rule evaluation.<br/>
* Ally and enemy checks use JABS battlers — not {@link $gameParty} — so map AI context stays authoritative.
*/
var PassiveRuleJabsAccess = class {
	/**
	* Looks up the map-side {@link JABS_Battler} wrapper for a {@link Game_Battler}.<br/>
	* Returns null when the battler is not registered with ABS (menu-only actors, etc.).
	* @param {Game_Battler} battler The battler whose uuid we resolve on the map.
	* @returns {JABS_Battler|null} The live JABS wrapper, or null when off-map / unregistered.
	*/
	static getJabsBattler(battler) {
		if (!battler || !battler.getUuid) return null;
		return JABS_AiManager.getBattlerByUuid(battler.getUuid()) ?? null;
	}
	/**
	* Default proximity radius in tiles from plugin metadata.<br/>
	* Used when authors omit an explicit radius on alliesNearby / enemiesNearby rules.
	* @returns {number} Tile radius from {@link default-proximity-tiles} plugin param.
	*/
	static defaultProximity() {
		return J.PASSIVE.EXT.CONDITIONAL.Metadata.defaultProximityTiles;
	}
	/**
	* Allied battlers within proximity, excluding self.<br/>
	* Used by {@code alliesNearby} gates and stack counts — self never counts toward the tally.
	* @param {Game_Battler} battler The battler whose neighborhood we measure.
	* @param {number|null} proximityTiles Optional tile radius; defaults to plugin param.
	* @returns {JABS_Battler[]} Allied JABS battlers in range, never including the evaluator.
	*/
	static nearbyAlliesExcludingSelf(battler, proximityTiles = null) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [];
		const proximity = proximityTiles ?? this.defaultProximity();
		return JABS_AiManager.getAlliedBattlersWithinRange(jabsBattler, proximity).filter((ally) => ally.getUuid() !== jabsBattler.getUuid());
	}
	/**
	* Opposing battlers within proximity of this battler.<br/>
	* Used by {@code enemiesNearby} gate rules and auto-execute trigger gates.
	* @param {Game_Battler} battler The battler whose neighborhood we measure.
	* @param {number|null} proximityTiles Optional tile radius; defaults to plugin param.
	* @returns {JABS_Battler[]} Opposing JABS battlers within the requested tile radius.
	*/
	static nearbyEnemies(battler, proximityTiles = null) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [];
		const proximity = proximityTiles ?? this.defaultProximity();
		return JABS_AiManager.getOpposingBattlersWithinRange(jabsBattler, proximity);
	}
	/**
	* Opposing battlers that currently have this battler as their live AI target- not a proximity
	* check, unlike {@link nearbyEnemies}. An enemy counts here the moment it engages this battler
	* as its target, regardless of tile distance, and stops counting the moment it disengages or
	* retargets someone else.<br/>
	* Used by {@code enemiesTargetingMe} gate and stack-count rules.
	* @param {Game_Battler} battler The battler whose "being focused" status we measure.
	* @returns {JABS_Battler[]} Opposing JABS battlers currently targeting this battler.
	*/
	static enemiesTargetingMe(battler) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [];
		return JABS_AiManager.getOpposingBattlers(jabsBattler).filter((enemy) => {
			const enemyTarget = enemy.getTarget();
			if (!enemyTarget) return false;
			return enemyTarget.getUuid() === jabsBattler.getUuid();
		});
	}
	/**
	* Allied battlers for {@code allAllies*} threshold checks (includes self when on the map).<br/>
	* Every member of the returned set must satisfy the same threshold for the gate to pass.
	* @param {Game_Battler} battler The battler whose party context we collect.
	* @returns {Game_Battler[]} Allied battlers plus self when map context exists.
	*/
	static allAlliedBattlersIncludingSelf(battler) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [battler];
		const allies = JABS_AiManager.getAlliedBattlers(jabsBattler).map((ally) => ally.getBattler()).filter((allyBattler) => !!allyBattler);
		if (allies.includes(battler) === false) {
			allies.push(battler);
		}
		return allies;
	}
	/**
	* Allied JABS battlers within an explicit tile radius, excluding self.<br/>
	* Used by scoped resource threshold gates ({@code anyAlly}, {@code allAllies} scope).
	* @param {Game_Battler} battler The evaluating battler.
	* @param {number} range Tile radius.
	* @returns {JABS_Battler[]} Allied JABS battlers in range, never including the evaluator.
	*/
	static alliedBattlersWithinRange(battler, range) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [];
		return JABS_AiManager.getAlliedBattlersWithinRange(jabsBattler, range).filter((ally) => ally.getUuid() !== jabsBattler.getUuid());
	}
	/**
	* Opposing JABS battlers within an explicit tile radius.<br/>
	* Used by scoped resource threshold gates ({@code anyEnemy}, {@code allEnemies} scope).
	* @param {Game_Battler} battler The evaluating battler.
	* @param {number} range Tile radius.
	* @returns {JABS_Battler[]} Opposing JABS battlers within range.
	*/
	static opposingBattlersWithinRange(battler, range) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [];
		return JABS_AiManager.getOpposingBattlersWithinRange(jabsBattler, range);
	}
	/**
	* Maps author-facing slot names to {@link JABS_Button} keys.<br/>
	* Accepts shorthand like {@code mainhand} / {@code skill1} as well as raw button keys.
	* @param {string|number} slotParam Author tag value for a skill slot.
	* @returns {string} Resolved {@link JABS_Button} key for cooldown queries.
	*/
	static resolveSlotKey(slotParam) {
		const normalized = String(slotParam).toLowerCase();
		switch (normalized) {
			case "main":
			case "mainhand": return JABS_Button.Mainhand;
			case "offhand": return JABS_Button.Offhand;
			case "tool": return JABS_Button.Tool;
			case "dodge": return JABS_Button.Dodge;
			case "combatskill1":
			case "skill1": return JABS_Button.CombatSkill1;
			case "combatskill2":
			case "skill2": return JABS_Button.CombatSkill2;
			case "combatskill3":
			case "skill3": return JABS_Button.CombatSkill3;
			case "combatskill4":
			case "skill4": return JABS_Button.CombatSkill4;
			default: return String(slotParam);
		}
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/AutoRuleManager.js
/**
* Base class for managers that schedule automatic effects from passive-capable source tuples.
*
* Owns every condition branch — time, proximity, damage, state, movement, heal — and delegates
* only the terminal dispatch (apply a state vs execute a skill) to the subclass.
*
* Subclasses must implement:
*  - {@link rulesProperty}  — name of the source property holding authored tuples
*  - {@link dispatch}       — terminal action (addState / forceMapAction)
*/
var AutoRuleManager = class {
	/**
	* The name of the property on each source object that holds the authored rule tuples.
	*
	* Examples: {@code 'autoApplyStateRules'} or {@code 'autoExecuteSkillRules'}.
	* @returns {string} - The property name holding rule tuples on source objects.
	*/
	static get rulesProperty() {
		throw new Error(`${this.name} must implement static get rulesProperty()`);
	}
	/**
	* Whether `tuple[0]` must be a strictly-positive integer to be considered valid.
	*
	* True for every subclass whose `tuple[0]` is a database id (state/skill ids are never 0 or
	* negative). Override to false for a subclass whose `tuple[0]` is a signed value instead (e.g. a
	* modification amount where negative/positive is meaningful direction, not an invalid id).
	* @returns {boolean}
	*/
	static get requiresPositiveId() {
		return true;
	}
	/**
	* The terminal action for one resolved rule.
	*
	* Called after all condition and cooldown gates pass. Subclasses implement
	* the actual effect — applying a state, firing a skill, etc.
	* @param {Game_Battler} _battler - The battler that owns the rule.
	* @param {number} _id - State id or skill id, depending on the subclass.
	* @param {any[]} _tuple - The full authored tuple this dispatch came from, for subclasses whose
	* payload needs more than just `id` (e.g. a modification amount plus a range/target selector
	* living further down the tuple than the shared loop itself ever inspects).
	* @returns {boolean} - True when the effect was successfully dispatched.
	*/
	static dispatch(_battler, _id, _tuple) {
		throw new Error(`${this.name} must implement static dispatch()`);
	}
	/**
	* Evaluates every {@code time} rule on this battler while active on the ABS map.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose rules may fire.
	*/
	static processTimeRules(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		this.tryDispatch(battler, "time");
	}
	/**
	* Evaluates every {@code stand} rule while this battler is idle on the ABS map.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose rules may fire.
	*/
	static processStandRules(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const lastMovedFrame = battler.getPassiveRuleLastMovedFrame();
		const framesSinceMoved = Graphics.frameCount - lastMovedFrame;
		if (framesSinceMoved === 0) return;
		this.tryDispatch(battler, "stand");
	}
	/**
	* Evaluates every {@code enemiesNearby} and {@code enemiesNearbyBelow} rule on this battler
	* while on the ABS map.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose rules may fire.
	*/
	static processEnemiesNearbyRules(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		this.tryDispatch(battler, "enemiesNearby");
		this.tryDispatch(battler, "enemiesNearbyBelow");
	}
	/**
	* Evaluates every {@code alliesNearby} and {@code alliesNearbyBelow} rule on this battler
	* while on the ABS map.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose rules may fire.
	*/
	static processAlliesNearbyRules(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		this.tryDispatch(battler, "alliesNearby");
		this.tryDispatch(battler, "alliesNearbyBelow");
	}
	/**
	* Fires resource-specific and {@code anyDmg} rules after damage is applied to one pool.
	* @param {Game_Actor|Game_Enemy} battler - The battler that took damage.
	* @param {'hpDmg'|'mpDmg'|'tpDmg'} resourceKind - Which resource pool decreased.
	*/
	static scheduleDamageTriggers(battler, resourceKind) {
		this.tryDispatch(battler, resourceKind);
		this.tryDispatch(battler, "anyDmg");
	}
	/**
	* Fires {@code whenCrit} rules after this battler is struck by a critical hit.
	* @param {Game_Actor|Game_Enemy} battler - The battler that was critically hit.
	*/
	static scheduleCritTriggers(battler) {
		this.tryDispatch(battler, "whenCrit");
	}
	/**
	* Fires {@code whenGlanced} rules after this battler suffers a glancing blow as the victim.
	*
	* Mutually exclusive with {@link scheduleCritTriggers} at the source- a glancing blow can never
	* also be a critical hit, so a single incoming attack can only ever fire one of the two.
	* @param {Game_Actor|Game_Enemy} battler - The battler that was glanced.
	*/
	static scheduleGlancingTriggers(battler) {
		this.tryDispatch(battler, "whenGlanced");
	}
	/**
	* Fires state-polarity and {@code anyStateAdded} rules after a combat state lands on this battler.
	* @param {Game_Actor|Game_Enemy} battler - The battler that received the state.
	* @param {number} stateId - The database id of the state that was added.
	*/
	static scheduleStateAddedTriggers(battler, stateId) {
		this.tryDispatch(battler, "anyStateAdded");
		const state = $dataStates[stateId];
		if (!state) return;
		if (state.isNegativeType()) {
			this.tryDispatch(battler, "negaStateAdded");
		} else {
			this.tryDispatch(battler, "posiStateAdded");
		}
	}
	/**
	* Fires state-polarity and {@code anyStateInflicted} rules on the battler that just inflicted a
	* combat state onto someone else- single-party variant for subclasses whose effect lands back on
	* the rule bearer itself (e.g. modifying the inflictor's own cooldowns), not on the afflicted
	* target. {@link AutoInflictStateManager} handles the dual-party case (rule bearer, external
	* effect target) separately and does not go through this method.
	* @param {Game_Actor|Game_Enemy} battler - The battler that just inflicted the state.
	* @param {number} inflictedStateId - The database id of the state that was just inflicted.
	*/
	static scheduleSelfStateInflictedTriggers(battler, inflictedStateId) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		if (!battler) return;
		const inflictedState = $dataStates[inflictedStateId];
		if (!inflictedState) return;
		this.tryDispatch(battler, "anyStateInflicted");
		if (inflictedState.isNegativeType()) {
			this.tryDispatch(battler, "negaStateInflicted");
		} else {
			this.tryDispatch(battler, "posiStateInflicted");
		}
	}
	/**
	* Fires heal-receive rules after one resource pool is restored on this battler.
	* @param {Game_Actor|Game_Enemy} battler - The battler that was healed.
	* @param {'onHealHp'|'onHealMp'|'onHealTp'} healKind - Which resource pool was restored.
	*/
	static scheduleHealTriggers(battler, healKind) {
		this.tryDispatch(battler, healKind);
	}
	/**
	* Fires {@code onKill} rules on the battler that just landed a kill.
	* @param {Game_Actor|Game_Enemy} battler - The battler that defeated an enemy.
	*/
	static scheduleKillTriggers(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		if (!battler) return;
		this.tryDispatch(battler, "onKill");
	}
	/**
	* Fires {@code onDamageDealt} rules on the battler that just landed damage on an opponent.
	* @param {Game_Actor|Game_Enemy} battler - The battler that dealt the damage.
	*/
	static scheduleDamageDealtTriggers(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		if (!battler) return;
		this.tryDispatch(battler, "onDamageDealt");
	}
	/**
	* Fires {@code onWeaponHit} rules on the battler that just landed a mainhand/offhand attack.
	*
	* Narrower than {@code onDamageDealt} — only counts hits from the caster's own basic-attack or
	* combo chain (whatever is bound to the Mainhand/Offhand slot), not damage from arbitrary skills.
	* @param {Game_Actor|Game_Enemy} battler - The battler that landed the weapon hit.
	*/
	static scheduleWeaponHitTriggers(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		if (!battler) return;
		this.tryDispatch(battler, "onWeaponHit");
	}
	/**
	* Credits one whole tile of travel toward {@code move} rules on this battler.
	*
	* Called from {@link Game_CharacterBase#updatePixelStepping} after a Pixelistics tile step completes.
	* @param {Game_Actor|Game_Enemy} battler - The battler that completed a whole map tile step.
	*/
	static creditTileStep(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const rules = this.collectRules(battler);
		for (const entry of rules) {
			const { source, tuple, tupleIndex } = entry;
			const id = Number(tuple[0]);
			const kind = String(tuple[1]);
			const tilesPerDispatch = Number(tuple[2]);
			if (Number.isNaN(id) || this.requiresPositiveId && id <= 0) continue;
			if (kind !== "move") continue;
			if (Number.isNaN(tilesPerDispatch) || tilesPerDispatch <= 0) continue;
			const ruleKey = this.buildRuleKey(source, tupleIndex, id, kind);
			const priorCredit = battler.getAutoRuleTileCredit(ruleKey);
			const nextCredit = priorCredit + 1;
			if (nextCredit < tilesPerDispatch) {
				battler.setAutoRuleTileCredit(ruleKey, nextCredit);
				continue;
			}
			this.dispatch(battler, id, tuple);
			battler.setAutoRuleTileCredit(ruleKey, 0);
		}
	}
	/**
	* Forwards one Pixelistics tile step from a map character to its underlying battler.
	* @param {Game_Character} character - The character that just completed a whole-tile step.
	*/
	static processTileStepFromCharacter(character) {
		const jabsBattler = character.getJabsBattler();
		if (!jabsBattler) return;
		const battler = jabsBattler.getBattler();
		if (!battler) return;
		this.creditTileStep(battler);
	}
	/**
	* Walks every authored tuple on this battler and dispatches when the condition kind matches.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose rules are evaluated.
	* @param {string} conditionKind - The condition kind to match against authored tuples.
	*/
	static tryDispatch(battler, conditionKind) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const rules = this.collectRules(battler);
		for (const entry of rules) {
			const { source, tuple, tupleIndex } = entry;
			const id = Number(tuple[0]);
			const kind = String(tuple[1]);
			if (Number.isNaN(id) || this.requiresPositiveId && id <= 0) continue;
			if (kind !== conditionKind) continue;
			if (kind === "move") continue;
			if (this.isProximityKind(kind)) {
				this._tryDispatchProximityRule(battler, source, tupleIndex, id, kind, tuple);
				continue;
			}
			const param = Number(tuple[2]);
			if (Number.isNaN(param) || param < 0) continue;
			this._tryDispatchRule(battler, source, tupleIndex, id, kind, param, tuple);
		}
	}
	/**
	* Gathers rule tuples from every passive-capable source on this battler.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose sources should be scanned.
	* @returns {{ source: RPG_BaseItem, tuple: any[], tupleIndex: number }[]} - Rules with their originating source row.
	*/
	static collectRules(battler) {
		const collected = [];
		const sources = battler.getPassiveStateSources();
		for (const source of sources) {
			const tuples = source[this.rulesProperty];
			for (let tupleIndex = 0; tupleIndex < tuples.length; tupleIndex++) {
				collected.push({
					source,
					tuple: tuples[tupleIndex],
					tupleIndex
				});
			}
		}
		return collected;
	}
	/**
	* Builds a stable cooldown key for one authored rule on one source row.
	*
	* The tuple index is included so duplicate id/condition pairs on the same row stay independent.
	* @param {RPG_BaseItem} source - The database row carrying the tag.
	* @param {number} tupleIndex - Zero-based index of this tuple on the source row.
	* @param {number} id - State id or skill id for this rule.
	* @param {string} condition - The condition kind string.
	* @returns {string} - A unique key used for last-dispatch frame tracking on the battler.
	*/
	static buildRuleKey(source, tupleIndex, id, condition) {
		const sourceLabel = source.constructor.name || "Unknown";
		const sourceId = source.id;
		return `${sourceLabel}:${sourceId}:${tupleIndex}:${id}:${condition}`;
	}
	/**
	* Handles the 4/5-tuple proximity branch for {@code enemiesNearby}/{@code alliesNearby} and
	* their {@code *Below} counterparts.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose proximity is evaluated.
	* @param {RPG_BaseItem} source - The database row that declared the rule.
	* @param {number} tupleIndex - Zero-based index of this tuple on the source row.
	* @param {number} id - State id or skill id for this rule.
	* @param {string} kind - The proximity condition kind; see {@link isProximityKind}.
	* @param {any[]} tuple - The full parsed tuple array from the authored tag.
	*/
	static _tryDispatchProximityRule(battler, source, tupleIndex, id, kind, tuple) {
		const minCount = Number(tuple[2]);
		const cooldownFrames = Number(tuple[3]);
		const triggerTilesRaw = tuple.length >= 5 ? Number(tuple[4]) : null;
		const triggerTiles = triggerTilesRaw !== null && !Number.isNaN(triggerTilesRaw) ? triggerTilesRaw : null;
		if (Number.isNaN(minCount) || minCount < 1) return;
		if (Number.isNaN(cooldownFrames) || cooldownFrames < 0) return;
		const nearbyCount = this.nearbyBattlersForKind(battler, kind, triggerTiles).length;
		if (this.proximityGatePasses(nearbyCount, minCount, kind) === false) return;
		this._tryDispatchRule(battler, source, tupleIndex, id, kind, cooldownFrames, tuple);
	}
	/**
	* Whether a condition kind string is one of the proximity-gated kinds handled by
	* {@link _tryDispatchProximityRule} instead of the standard frame-cooldown path.
	* @param {string} kind - The condition kind to test.
	* @returns {boolean} - True for enemiesNearby, alliesNearby, and their Below counterparts.
	*/
	static isProximityKind(kind) {
		return kind === "enemiesNearby" || kind === "alliesNearby" || kind === "enemiesNearbyBelow" || kind === "alliesNearbyBelow";
	}
	/**
	* Resolves the JABS battler set a proximity kind counts/targets — opposing battlers for the
	* enemy kinds, allied battlers (excluding self) for the ally kinds. The {@code Below} suffix
	* only affects the gate comparison direction, not which set is measured.
	* @param {Game_Actor|Game_Enemy} battler - The evaluating battler.
	* @param {string} kind - The proximity condition kind; see {@link isProximityKind}.
	* @param {number|null} triggerTiles - Optional explicit tile radius override.
	* @returns {JABS_Battler[]} - The resolved battler set for this kind.
	*/
	static nearbyBattlersForKind(battler, kind, triggerTiles) {
		return kind === "enemiesNearby" || kind === "enemiesNearbyBelow" ? PassiveRuleJabsAccess.nearbyEnemies(battler, triggerTiles) : PassiveRuleJabsAccess.nearbyAlliesExcludingSelf(battler);
	}
	/**
	* Compares a resolved nearby-battler count against the tuple's threshold, honoring the
	* {@code Below} suffix as an inversion of the default at-least-COUNT comparison.
	* @param {number} nearbyCount - Battlers currently resolved in range.
	* @param {number} minCount - The count threshold authored on the tuple.
	* @param {string} kind - The proximity condition kind; see {@link isProximityKind}.
	* @returns {boolean} - True when the gate for this kind passes.
	*/
	static proximityGatePasses(nearbyCount, minCount, kind) {
		if (kind === "enemiesNearbyBelow" || kind === "alliesNearbyBelow") return nearbyCount < minCount;
		return nearbyCount >= minCount;
	}
	/**
	* Dispatches one rule when its per-key frame cooldown has elapsed.
	* @param {Game_Actor|Game_Enemy} battler - The battler that owns the rule.
	* @param {RPG_BaseItem} source - The database row that declared the rule.
	* @param {number} tupleIndex - Zero-based index of this tuple on the source row.
	* @param {number} id - State id or skill id for this rule.
	* @param {string} condition - The condition kind string.
	* @param {number} cooldownFrames - Minimum frames that must elapse between dispatches for this key.
	* @param {any[]} tuple - The full authored tuple, forwarded to the subclass dispatch for rules
	* whose payload needs more than just `id`.
	*/
	static _tryDispatchRule(battler, source, tupleIndex, id, condition, cooldownFrames, tuple) {
		const ruleKey = this.buildRuleKey(source, tupleIndex, id, condition);
		const now = Graphics.frameCount;
		const lastFrame = battler.getAutoRuleLastFrame(ruleKey);
		const elapsed = now - lastFrame;
		if (lastFrame > 0 && elapsed < cooldownFrames) return;
		const dispatched = this.dispatch(battler, id, tuple);
		if (dispatched === true) {
			battler.setAutoRuleLastFrame(ruleKey, now);
		}
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/AutoApplyStateManager.js
/**
* Schedules real JABS state applications from {@link RPG_BaseItem#autoApplyStateRules} tuples.
*
* Uses {@link Game_Battler#addState} as the terminal dispatch — separate from the passive grant
* pipeline so states applied here behave as live combat states with durations and removal.
* The state is always applied to the rule bearer (self). For aura-style application to nearby
* battlers, see {@link AutoApplyStateOnNearbyManager}.
*/
var AutoApplyStateManager = class extends AutoRuleManager {
	/**
	* The name of the source property that holds auto-apply-state rule tuples.
	* @returns {string} - The property name holding rule tuples on source objects.
	*/
	static get rulesProperty() {
		return "autoApplyStateRules";
	}
	/**
	* Evaluates every rule matching the given condition kind — delegates to {@link tryDispatch}.
	* Exposed as a named method so callers can invoke condition-scoped evaluations without
	* knowing the base class method name.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose rules are evaluated.
	* @param {string} conditionKind - The condition kind to evaluate (e.g. 'move', 'time').
	*/
	static tryApply(battler, conditionKind) {
		return this.tryDispatch(battler, conditionKind);
	}
	/**
	* Pushes a real combat state onto the battler through the JABS addState path.
	* @param {Game_Actor|Game_Enemy} battler - The battler receiving the state.
	* @param {number} stateId - The database id of the state to apply.
	* @param {any[]} _tuple - The full authored tuple; unused here, this rule's whole payload is the id.
	* @returns {boolean} - True when addState was called and the state was addable.
	*/
	static dispatch(battler, stateId, _tuple) {
		if (battler.isStateAddable(stateId) === false) return false;
		battler.addState(stateId, battler);
		return true;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/AutoApplyStateOnNearbyManager.js
/**
* Schedules real JABS state applications onto nearby battlers from
* {@link RPG_BaseItem#autoApplyStateOnNearbyRules} tuples.
*
* Unlike {@link AutoApplyStateManager}, which always applies the state to the rule bearer,
* this manager redirects dispatch to the battlers in proximity — enemies or allies depending
* on the condition kind. This enables aura-style effects where the bearer passively afflicts
* surrounding targets on a pulse timer.
*
* Only proximity condition kinds ({@code enemiesNearby}/{@code alliesNearby} and their
* {@code Below} counterparts) are meaningful here; other condition kinds have no proximity
* target set to iterate and will not fire. Note that a {@code *Below} tuple with a threshold
* of 1 (the "nothing nearby" case) can gate-pass while resolving zero targets — that pulse
* simply applies to nobody. Thresholds of 2+ still land on the stragglers under the count
* (e.g. "not swarmed by 5+ enemies, but hit whichever 1-2 are still around").
*/
var AutoApplyStateOnNearbyManager = class extends AutoRuleManager {
	/**
	* The name of the source property that holds auto-apply-state-on-nearby rule tuples.
	* @returns {string} - The property name holding rule tuples on source objects.
	*/
	static get rulesProperty() {
		return "autoApplyStateOnNearbyRules";
	}
	/**
	* Pushes a real combat state onto the target battler through the JABS addState path.
	*
	* The battler parameter here is the nearby target, not the rule bearer — the bearer's
	* cooldown is managed separately in {@link _tryDispatchProximityRule}.
	* @param {Game_Actor|Game_Enemy} battler - The nearby battler receiving the state.
	* @param {number} stateId - The database id of the state to apply.
	* @returns {boolean} - True when addState was called and the state was addable.
	*/
	static dispatch(battler, stateId) {
		if (battler.isStateAddable(stateId) === false) return false;
		battler.addState(stateId, battler);
		return true;
	}
	/**
	* Overrides the base proximity handler to redirect state application onto nearby battlers.
	*
	* The cooldown is tracked on the rule bearer so the pulse cadence is consistent regardless
	* of how many targets are in range. The state is applied to every nearby battler in the
	* resolved set each time the cooldown elapses.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose proximity is evaluated.
	* @param {RPG_BaseItem} source - The database row that declared the rule.
	* @param {number} tupleIndex - Zero-based index of this tuple on the source row.
	* @param {number} id - The state id to apply to nearby battlers.
	* @param {string} kind - The proximity condition kind; see {@link AutoRuleManager.isProximityKind}.
	* @param {any[]} tuple - The full parsed tuple array from the authored tag.
	*/
	static _tryDispatchProximityRule(battler, source, tupleIndex, id, kind, tuple) {
		const minCount = Number(tuple[2]);
		const cooldownFrames = Number(tuple[3]);
		const triggerTilesRaw = tuple.length >= 5 ? Number(tuple[4]) : null;
		const triggerTiles = triggerTilesRaw !== null && !Number.isNaN(triggerTilesRaw) ? triggerTilesRaw : null;
		if (Number.isNaN(minCount) || minCount < 1) return;
		if (Number.isNaN(cooldownFrames) || cooldownFrames < 0) return;
		const nearbyJabsBattlers = this.nearbyBattlersForKind(battler, kind, triggerTiles);
		if (this.proximityGatePasses(nearbyJabsBattlers.length, minCount, kind) === false) return;
		const ruleKey = this.buildRuleKey(source, tupleIndex, id, kind);
		const now = Graphics.frameCount;
		const lastFrame = battler.getAutoRuleLastFrame(ruleKey);
		if (lastFrame > 0 && now - lastFrame < cooldownFrames) return;
		let anyDispatched = false;
		nearbyJabsBattlers.forEach((jabsTarget) => {
			const target = jabsTarget.getBattler();
			if (!target) return;
			if (this.dispatch(target, id) === true) anyDispatched = true;
		});
		if (anyDispatched === true) {
			battler.setAutoRuleLastFrame(ruleKey, now);
		}
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/AutoExecuteSkillManager.js
/**
* Schedules map skill executions from {@link RPG_BaseItem#autoExecuteSkillRules} tuples.
*
* Uses {@link JABS_Engine#forceMapAction} as the terminal dispatch — skills fired here are real
* map actions with hitboxes, elements, and effects, and are subject to JABS parry and retaliation.
*/
var AutoExecuteSkillManager = class AutoExecuteSkillManager extends AutoRuleManager {
	/**
	* The name of the source property that holds auto-execute-skill rule tuples.
	* @returns {string} - The property name holding rule tuples on source objects.
	*/
	static get rulesProperty() {
		return "autoExecuteSkillRules";
	}
	/**
	* Tracks the current nesting depth of in-flight forced skill executions.
	*
	* Used to prevent synchronous re-entry when a forced skill triggers another auto-execute rule.
	* @type {number}
	*/
	static #executionDepth = 0;
	/**
	* Forces one map skill through JABS without applying cost or cooldown to the payload skill row.
	*
	* Depth-guarded to prevent infinite re-entry — if a forced skill triggers another auto-execute
	* rule during its own execution, the nested dispatch is silently skipped.
	* @param {Game_Actor|Game_Enemy} battler - The battler firing the skill.
	* @param {number} skillId - The database id of the skill to execute.
	* @param {any[]} _tuple - The full authored tuple; unused here, this rule's whole payload is the id.
	* @returns {boolean} - True when forceMapAction was successfully invoked.
	*/
	static dispatch(battler, skillId, _tuple) {
		const maxDepth = J.PASSIVE.EXT.CONDITIONAL.Metadata.autoExecuteSkillMaxDepth || 1;
		if (AutoExecuteSkillManager.#executionDepth >= maxDepth) return false;
		const jabsBattler = PassiveRuleJabsAccess.getJabsBattler(battler);
		if (!jabsBattler) return false;
		if (Number.isNaN(skillId) || skillId <= 0) return false;
		if (!battler.skill(skillId)) return false;
		AutoExecuteSkillManager.#executionDepth += 1;
		try {
			const preview = jabsBattler.createJabsActionFromSkill(skillId);
			if (!$jabsEngine.canExecuteMapActions(jabsBattler, preview)) return false;
			$jabsEngine.forceMapAction(jabsBattler, skillId, false);
			return true;
		} finally {
			AutoExecuteSkillManager.#executionDepth -= 1;
		}
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/AutoModifyCooldownManager.js
/**
* Schedules cooldown modifications from {@link RPG_BaseItem#autoModifyCooldownRules} tuples.
*
* Unlike its siblings, the payload isn't a state/skill id- it's a signed modification amount
* (`tuple[0]`) applied directly to one or more of the battler's own active skill-slot cooldowns.
* Unit and range/target selection live further down the tuple than the shared dispatch loop ever
* inspects (`tuple[3]` onward), so this manager parses those slots itself out of the forwarded tuple.
*/
var AutoModifyCooldownManager = class extends AutoRuleManager {
	/**
	* The name of the source property that holds auto-modify-cooldown rule tuples.
	* @returns {string} - The property name holding rule tuples on source objects.
	*/
	static get rulesProperty() {
		return "autoModifyCooldownRules";
	}
	/**
	* `tuple[0]` here is a signed modification amount, not a database id- negative values are the
	* normal case (reducing cooldowns), so the base class's positive-id safety net does not apply.
	* @returns {boolean}
	*/
	static get requiresPositiveId() {
		return false;
	}
	/**
	* Applies a signed modification to one or more of the battler's active skill-slot cooldowns.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose cooldowns are modified.
	* @param {number} amount - The signed modification amount; negative reduces, positive increases.
	* @param {any[]} tuple - The full authored tuple:
	* `[amount, condition, throttleFrames, unit, range?, targetKey?]`.
	* @returns {boolean} - True when at least one active cooldown was modified.
	*/
	static dispatch(battler, amount, tuple) {
		const unit = String(tuple[3]);
		const range = tuple.length >= 5 ? String(tuple[4]) : "all";
		const targetKeyParam = tuple.length >= 6 ? tuple[5] : undefined;
		if (unit !== "percent" && unit !== "flat") return false;
		const keys = this.resolveKeys(range, targetKeyParam);
		if (keys.length === 0) return false;
		const slots = battler.getSkillSlotManager().getEquippedSlots().filter((slot) => keys.includes(slot.key) && slot.getCooldown().frames > 0);
		if (slots.length === 0) return false;
		slots.forEach((slot) => {
			const cooldown = slot.getCooldown();
			const delta = unit === "percent" ? Math.floor(cooldown.maxFrames * (amount / 100)) : amount;
			cooldown.modBaseFrames(delta);
		});
		return true;
	}
	/**
	* Resolves a RANGE selector into the concrete set of {@link JABS_Button} keys it targets.
	* @param {string} range - One of `'single'`, `'combat'`, or `'all'`.
	* @param {string|number|undefined} targetKeyParam - The author-facing slot name for `'single'`.
	* @returns {string[]} - The resolved {@link JABS_Button} keys, or an empty array when unresolvable.
	*/
	static resolveKeys(range, targetKeyParam) {
		switch (range) {
			case "single":
				if (targetKeyParam === undefined) return [];
				return [PassiveRuleJabsAccess.resolveSlotKey(targetKeyParam)];
			case "combat": return [
				JABS_Button.CombatSkill1,
				JABS_Button.CombatSkill2,
				JABS_Button.CombatSkill3,
				JABS_Button.CombatSkill4
			];
			case "all": return [
				JABS_Button.Mainhand,
				JABS_Button.Offhand,
				JABS_Button.Tool,
				JABS_Button.Dodge,
				JABS_Button.CombatSkill1,
				JABS_Button.CombatSkill2,
				JABS_Button.CombatSkill3,
				JABS_Button.CombatSkill4
			];
			default: return [];
		}
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/AutoInflictStateManager.js
/**
* Schedules real JABS state applications from {@link RPG_BaseItem#autoInflictStateRules} tuples.
*
* Unlike {@link AutoApplyStateManager} (self-targeted) and {@link AutoApplyStateOnNearbyManager}
* (proximity-targeted), this manager reads rules from the battler who just did something to an
* external battler- inflicted a state, or knocked them back- and applies the configured payload
* state onto that same external target, not onto the rule bearer, and not onto anything nearby.
*/
var AutoInflictStateManager = class AutoInflictStateManager extends AutoRuleManager {
	/**
	* The name of the source property that holds auto-inflict-state rule tuples.
	* @returns {string} - The property name holding rule tuples on source objects.
	*/
	static get rulesProperty() {
		return "autoInflictStateRules";
	}
	/**
	* Tracks the current nesting depth of in-flight auto-inflict dispatches.
	*
	* Used to prevent synchronous re-entry when a dispatched state is itself negative-tagged and
	* would otherwise immediately re-trigger this same manager via {@link #scheduleInflictedStateTriggers}.
	* @type {number}
	*/
	static #inflictDepth = 0;
	/**
	* Pushes a real combat state onto the target battler through the JABS addState path.
	*
	* Depth-guarded to prevent infinite re-entry- if the dispatched state is itself negative-tagged,
	* applying it fires {@link Game_Battler#onJabsStateInflicted} again, which could otherwise chain
	* indefinitely.
	* @param {Game_Actor|Game_Enemy} battler - The target battler receiving the state.
	* @param {number} stateId - The database id of the state to apply.
	* @param {Game_Actor|Game_Enemy} inflictor - The battler who actually inflicted this state- the
	* bearer of the {@code autoInflictState} rule, credited as the source for JABS state tracking.
	* @returns {boolean} - True when addState was called and the state was addable.
	*/
	static dispatch(battler, stateId, inflictor) {
		const maxDepth = J.PASSIVE.EXT.CONDITIONAL.Metadata.autoInflictStateMaxDepth || 1;
		if (AutoInflictStateManager.#inflictDepth >= maxDepth) return false;
		if (battler.isStateAddable(stateId) === false) return false;
		AutoInflictStateManager.#inflictDepth += 1;
		try {
			battler.addState(stateId, inflictor);
			return true;
		} finally {
			AutoInflictStateManager.#inflictDepth -= 1;
		}
	}
	/**
	* Evaluates every {@code autoInflictState} rule on the inflicting battler and applies matching
	* payload states onto the battler that was just afflicted.
	* @param {Game_Actor|Game_Enemy} applier - The battler whose rules are evaluated (the inflictor).
	* @param {Game_Actor|Game_Enemy} target - The battler who was just afflicted by {@code applier}.
	* @param {number} inflictedStateId - The database id of the state that was just inflicted.
	*/
	static scheduleInflictedStateTriggers(applier, target, inflictedStateId) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		if (!applier || !target) return;
		const inflictedState = $dataStates[inflictedStateId];
		if (!inflictedState) return;
		const polarityKind = inflictedState.isNegativeType() ? "negaStateInflicted" : "posiStateInflicted";
		this._dispatchMatchingRules(applier, target, (kind) => kind === "anyStateInflicted" || kind === polarityKind);
	}
	/**
	* Evaluates every {@code autoInflictState} rule on the knocking-back battler and applies matching
	* payload states onto the battler that was just knocked back.
	* @param {Game_Actor|Game_Enemy} applier - The battler whose rules are evaluated (who knocked back).
	* @param {Game_Actor|Game_Enemy} target - The battler who was just knocked back by {@code applier}.
	*/
	static scheduleKnockbackTriggers(applier, target) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		if (!applier || !target) return;
		this._dispatchMatchingRules(applier, target, (kind) => kind === "onKnockback");
	}
	/**
	* Shared dispatch loop for every {@code autoInflictState} condition kind.
	*
	* Cannot reuse the base {@link AutoRuleManager.tryDispatch} loop because that assumes one battler
	* plays both roles (rule owner and dispatch recipient)- here the rules live on {@code applier}
	* but the payload state lands on {@code target}. Cooldown is tracked on {@code applier} since
	* the rule itself belongs to them, regardless of which target it most recently fired against.
	* @param {Game_Actor|Game_Enemy} applier - The battler whose rules are evaluated.
	* @param {Game_Actor|Game_Enemy} target - The battler the payload state should land on.
	* @param {(kind: string) => boolean} kindMatches - Predicate deciding whether a tuple's condition
	* kind applies to the event currently being scheduled.
	*/
	static _dispatchMatchingRules(applier, target, kindMatches) {
		const rules = this.collectRules(applier);
		for (const entry of rules) {
			const { source, tuple, tupleIndex } = entry;
			const id = Number(tuple[0]);
			const kind = String(tuple[1]);
			const cooldownFrames = Number(tuple[2]);
			if (Number.isNaN(id) || id <= 0) continue;
			if (kindMatches(kind) === false) continue;
			if (Number.isNaN(cooldownFrames) || cooldownFrames < 0) continue;
			const ruleKey = this.buildRuleKey(source, tupleIndex, id, kind);
			const now = Graphics.frameCount;
			const lastFrame = applier.getAutoRuleLastFrame(ruleKey);
			if (lastFrame > 0 && now - lastFrame < cooldownFrames) continue;
			const dispatched = this.dispatch(target, id, applier);
			if (dispatched === true) {
				applier.setAutoRuleLastFrame(ruleKey, now);
			}
		}
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/SkillExecutionStateRemovalManager.js
/**
* Processes {@link RPG_State#removeOnSkillExecutionRules} when a map battler executes a skill.<br/>
* Peels stacks via {@link Game_Battler#decrementStateStacks} using {@code loseAllStacksAtOnce} policy.
*/
var SkillExecutionStateRemovalManager = class {
	/**
	* Rolls removal rules on every combat state this battler currently carries.
	* @param {Game_Actor|Game_Enemy} battler The battler that executed the skill.
	* @param {number} skillId The database skill id that was executed.
	*/
	static process(battler, skillId) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const skill = $dataSkills[skillId];
		if (!skill) return;
		const executedStype = skill.stypeId;
		const activeStates = battler.states();
		for (const state of activeStates) {
			if (!state) continue;
			const rules = state.removeOnSkillExecutionRules;
			for (const tuple of rules) {
				const stypeId = Number(tuple[0]);
				const chance = Number(tuple[1]);
				if (Number.isNaN(chance) || chance <= 0) continue;
				if (stypeId !== 0 && stypeId !== executedStype) continue;
				const positiveRolls = 1 + battler.getPositiveRollsForSkill(state);
				const negativeRolls = battler.getNegativeRollsForSkill(state);
				if (RPGManager.fateOf100(battler, chance, positiveRolls, negativeRolls) === false) continue;
				const stacksLossCount = this.#resolveStacksLossCount(battler, state);
				battler.decrementStateStacks(state.id, stacksLossCount);
			}
		}
	}
	/**
	* Mirrors {@link JABS_State#handleStackChangeFromDuration} stack peel amount for one state.
	* @param {Game_Actor|Game_Enemy} battler The battler losing stacks.
	* @param {RPG_State} state The state row to peel- already confirmed live on the battler by the
	* caller, so no re-lookup against $dataStates is needed here.
	* @returns {number} How many stacks to remove in one proc.
	*/
	static #resolveStacksLossCount(battler, state) {
		const loseAllStacksAtOnce = state.jabsLoseAllStacksAtOnce === true;
		const tracked = $jabsEngine.getJabsStateByUuidAndStateId(battler.getUuid(), state.id);
		if (loseAllStacksAtOnce === true && tracked) {
			return tracked.stackCount;
		}
		return 1;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/SkillResolutionStateRemovalManager.js
/**
* Processes {@link RPG_State#removeOnSkillResolutionRules} when a map battler's action resolves
* against a target.<br/>
* Fires after {@link Game_Action#apply} so that state traits (such as ATK bonuses) are still
* active during damage calculation before the stacks are peeled.<br/>
* Peels stacks via {@link Game_Battler#decrementStateStacks} using {@code loseAllStacksAtOnce} policy.
*/
var SkillResolutionStateRemovalManager = class {
	/**
	* Rolls removal rules on every combat state this battler currently carries.
	* @param {Game_Actor|Game_Enemy} battler - The battler whose action just resolved.
	* @param {number} skillId - The database skill id that resolved against the target.
	*/
	static process(battler, skillId) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const skill = $dataSkills[skillId];
		if (!skill) return;
		const executedStype = skill.stypeId;
		const activeStates = battler.states();
		for (const state of activeStates) {
			if (!state) continue;
			const rules = state.removeOnSkillResolutionRules;
			for (const tuple of rules) {
				const stypeId = Number(tuple[0]);
				const chance = Number(tuple[1]);
				if (Number.isNaN(chance) || chance <= 0) continue;
				if (stypeId !== 0 && stypeId !== executedStype) continue;
				const positiveRolls = 1 + battler.getPositiveRollsForSkill(state);
				const negativeRolls = battler.getNegativeRollsForSkill(state);
				if (RPGManager.fateOf100(battler, chance, positiveRolls, negativeRolls) === false) continue;
				const stacksLossCount = this.#resolveStacksLossCount(battler, state);
				battler.decrementStateStacks(state.id, stacksLossCount);
			}
		}
	}
	/**
	* Mirrors {@link JABS_State#handleStackChangeFromDuration} stack peel amount for one state.
	* @param {Game_Actor|Game_Enemy} battler - The battler losing stacks.
	* @param {RPG_State} state - The state row to peel- already confirmed live on the battler by the
	* caller, so no re-lookup against $dataStates is needed here.
	* @returns {number} - How many stacks to remove in one proc.
	*/
	static #resolveStacksLossCount(battler, state) {
		const loseAllStacksAtOnce = state.jabsLoseAllStacksAtOnce === true;
		const tracked = $jabsEngine.getJabsStateByUuidAndStateId(battler.getUuid(), state.id);
		if (loseAllStacksAtOnce === true && tracked) {
			return tracked.stackCount;
		}
		return 1;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/MoveStateRemovalManager.js
/**
* Processes {@link RPG_State#removeStateOnMoveRules} when a map battler moves.<br/>
* Peels stacks via {@link Game_Battler#decrementStateStacks} using {@code loseAllStacksAtOnce} policy,
* then resets the stand cooldown for matching {@code autoApplyState} rules so the rebuild
* interval starts fresh from the moment the battler stops moving.
*/
var MoveStateRemovalManager = class {
	/**
	* Strips states declared by move-removal rules on every state this battler currently carries,
	* then resets the stand auto-apply cooldown for the matching payload so stacking restarts
	* from a full interval rather than firing immediately on the next stand tick.
	* @param {Game_Actor|Game_Enemy} battler The battler that just moved.
	*/
	static process(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const activeStates = battler.allStates();
		for (const state of activeStates) {
			if (!state) continue;
			const rules = state.removeStateOnMoveRules;
			for (const tuple of rules) {
				const stateId = Number(tuple[0]);
				if (Number.isNaN(stateId) || stateId <= 0) continue;
				const stacksLossCount = this.#resolveStacksLossCount(battler, stateId);
				battler.decrementStateStacks(stateId, stacksLossCount);
				this.#resetStandCooldown(battler, state, stateId);
			}
		}
	}
	/**
	* Resets the autoApplyState stand cooldown for a given payload state on a given source row.
	* Finds the matching stand tuple by payload state id and stamps its cooldown to now,
	* ensuring the battler must wait the full interval before the first stack reapplies.
	* @param {Game_Actor|Game_Enemy} battler The battler that moved.
	* @param {RPG_State} sourceState The state row carrying the removeStateOnMove + autoApplyState tags.
	* @param {number} payloadStateId The payload state id to match against autoApplyState tuples.
	*/
	static #resetStandCooldown(battler, sourceState, payloadStateId) {
		const tuples = sourceState.autoApplyStateRules;
		for (let tupleIndex = 0; tupleIndex < tuples.length; tupleIndex++) {
			const tuple = tuples[tupleIndex];
			const tupleStateId = Number(tuple[0]);
			const condition = String(tuple[1]).toLowerCase();
			if (tupleStateId !== payloadStateId) continue;
			if (condition !== "stand") continue;
			const ruleKey = AutoApplyStateManager.buildRuleKey(sourceState, tupleIndex, payloadStateId, "stand");
			battler.setAutoApplyLastFrame(ruleKey, Graphics.frameCount);
		}
	}
	/**
	* Mirrors {@link JABS_State#handleStackChangeFromDuration} stack peel amount for one state id.
	* @param {Game_Actor|Game_Enemy} battler The battler losing stacks.
	* @param {number} stateId The database state id to peel.
	* @returns {number} How many stacks to remove in one proc.
	*/
	static #resolveStacksLossCount(battler, stateId) {
		const stateRow = $dataStates[stateId];
		if (!stateRow) return 1;
		const loseAllStacksAtOnce = stateRow.jabsLoseAllStacksAtOnce === true;
		const tracked = $jabsEngine.getJabsStateByUuidAndStateId(battler.getUuid(), stateId);
		if (loseAllStacksAtOnce === true && tracked) {
			return tracked.stackCount;
		}
		return 1;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/PassiveGateEvaluator.js
/**
* Evaluates {@link passiveSourceRule}/{@link passiveStateRule} tuples against live battler context.<br/>
* Every tuple on a source/state pair must pass (AND semantics); cross-source stacking is handled upstream in J-Passive.
*/
var PassiveGateEvaluator = class {
	/**
	* Evaluates one gate rule kind against the battler's current map context.<br/>
	* Discrete kinds dispatch in the switch; threshold kinds fall through to {@link #evaluateThresholdKind}.
	* The params array mirrors the tag tuple slots after the kind: [threshold, scope?, range?] for
	* resource gates; a single scalar for most other gates.
	* @param {Game_Battler} battler The battler whose context we evaluate.
	* @param {string} kind Rule kind from a parsed note tuple.
	* @param {(number|string)[]=} params Remaining tuple slots after the kind.
	* @returns {boolean} Whether this single tuple passes right now.
	*/
	static evaluate(battler, kind, params = []) {
		const [param, scope, range] = params;
		switch (kind) {
			case "alliesNearby": return PassiveRuleJabsAccess.nearbyAlliesExcludingSelf(battler, scope ? Number(scope) : null).length >= Number(param);
			case "enemiesNearby": return PassiveRuleJabsAccess.nearbyEnemies(battler, scope ? Number(scope) : null).length >= Number(param);
			case "alliesNearbyBelow": return PassiveRuleJabsAccess.nearbyAlliesExcludingSelf(battler, scope ? Number(scope) : null).length < Number(param);
			case "enemiesNearbyBelow": return PassiveRuleJabsAccess.nearbyEnemies(battler, scope ? Number(scope) : null).length < Number(param);
			case "enemiesTargetingMe": return PassiveRuleJabsAccess.enemiesTargetingMe(battler).length >= Number(param);
			case "enemiesTargetingMeBelow": return PassiveRuleJabsAccess.enemiesTargetingMe(battler).length < Number(param);
			case "hpAbove": return this.#evaluateResourceThreshold(battler, "hp", "above", Number(param), scope, range);
			case "hpBelow": return this.#evaluateResourceThreshold(battler, "hp", "below", Number(param), scope, range);
			case "mpAbove": return this.#evaluateResourceThreshold(battler, "mp", "above", Number(param), scope, range);
			case "mpBelow": return this.#evaluateResourceThreshold(battler, "mp", "below", Number(param), scope, range);
			case "tpAbove": return this.#evaluateResourceThreshold(battler, "tp", "above", Number(param), scope, range);
			case "tpBelow": return this.#evaluateResourceThreshold(battler, "tp", "below", Number(param), scope, range);
			case "anyAbove": return this.#evaluateAnyResourceThreshold(battler, "above", Number(param), scope, range);
			case "anyBelow": return this.#evaluateAnyResourceThreshold(battler, "below", Number(param), scope, range);
			case "allAbove": return this.#evaluateAllResourcesThreshold(battler, "above", Number(param), scope, range);
			case "allBelow": return this.#evaluateAllResourcesThreshold(battler, "below", Number(param), scope, range);
			case "hasState": return battler.isStateAffected(Number(param));
			case "negativeStateCount": return this.countNegativeStates(battler) >= Number(param);
			case "slotOnCooldown": return this.#isSlotOnCooldown(battler, param) === true;
			case "slotOffCooldown": return this.#isSlotOnCooldown(battler, param) === false;
			case "allOnCooldown": return this.#areAllCombatSlotsOnCooldown(battler) === true;
			case "allOffCooldown": return this.#areAllCombatSlotsReady(battler) === true;
			case "sinceLastMoved": return this.#framesSince(battler.getPassiveRuleLastMovedFrame()) >= Number(param);
			case "sinceLastHit": return this.#framesSince(battler.getPassiveRuleLastHitFrame()) >= Number(param);
			case "sinceLastAttacked": return this.#framesSince(battler.getPassiveRuleLastAttackedFrame()) >= Number(param);
			case "movedWithin": return this.#framesSince(battler.getPassiveRuleLastMovedFrame()) <= Number(param);
			case "hitWithin": return this.#framesSince(battler.getPassiveRuleLastHitFrame()) <= Number(param);
			case "attackedWithin": return this.#framesSince(battler.getPassiveRuleLastAttackedFrame()) <= Number(param);
			case "onHealHp": return this.#framesSince(battler.getPassiveRuleLastHpHealFrame()) <= Number(param);
			case "onHealMp": return this.#framesSince(battler.getPassiveRuleLastMpHealFrame()) <= Number(param);
			case "onHealTp": return this.#framesSince(battler.getPassiveRuleLastTpHealFrame()) <= Number(param);
			default: return this.#evaluateThresholdKind(battler, kind, param);
		}
	}
	/**
	* Evaluates {@code *Above/*Below} and {@code allAllies*} threshold kinds.<br/>
	* Unknown kinds fail closed so tag typos do not silently grant passives.
	* @param {Game_Battler} battler The battler whose values we compare.
	* @param {string} kind Full threshold kind from the note tuple.
	* @param {number|string|null} param Tag threshold integer.
	* @returns {boolean} Whether the threshold gate passes.
	*/
	static #evaluateThresholdKind(battler, kind, param) {
		const allAllies = PassiveRuleThreshold.parseAllAlliesThresholdKind(kind);
		if (allAllies) {
			return PassiveRuleJabsAccess.allAlliedBattlersIncludingSelf(battler).every((allyBattler) => PassiveRuleThreshold.compare(allyBattler, allAllies.key, allAllies.direction, Number(param)));
		}
		const threshold = PassiveRuleThreshold.parseThresholdKind(kind);
		if (!threshold) return false;
		return PassiveRuleThreshold.compare(battler, threshold.key, threshold.direction, Number(param));
	}
	/**
	* Counts negative states currently affecting this battler.<br/>
	* Negative classification comes from {@link RPG_State#isNegativeType} / the {@code <type:negative>} tag.
	* @param {Game_Battler} battler The battler whose active states we inspect.
	* @returns {number} Count of states flagged negative by J-ABS.
	*/
	static countNegativeStates(battler) {
		return battler.allStates().filter((state) => state && state.isNegativeType()).length;
	}
	/**
	* Whether one JABS skill slot is currently on cooldown for this battler.<br/>
	* Used by {@code slotOnCooldown} / {@code slotOffCooldown} gate kinds.
	* @param {Game_Battler} battler The battler whose slot we inspect.
	* @param {string|number} slotParam Author tag value (mainhand, skill1, raw button key, etc.).
	* @returns {boolean} True when the slot is cooling down; false when ready or off-map.
	*/
	static #isSlotOnCooldown(battler, slotParam) {
		const jabsBattler = PassiveRuleJabsAccess.getJabsBattler(battler);
		if (!jabsBattler) return false;
		const slotKey = PassiveRuleJabsAccess.resolveSlotKey(slotParam);
		return jabsBattler.isSkillTypeCooldownReady(slotKey) === false;
	}
	/**
	* Whether every assigned combat skill slot is on cooldown simultaneously.<br/>
	* Only secondary slots (CombatSkill1–4) with an assigned skill are checked —
	* mainhand, offhand, tool, and dodge have no meaningful player-managed cooldowns
	* and must not pollute the result. Empty secondary slots are skipped for the same reason.<br/>
	* Used by {@code allOnCooldown} source-wide gate kind.
	* @param {Game_Battler} battler The battler whose slot manager we inspect.
	* @returns {boolean} True only when every assigned combat slot is still cooling down.
	*/
	static #areAllCombatSlotsOnCooldown(battler) {
		const jabsBattler = PassiveRuleJabsAccess.getJabsBattler(battler);
		if (!jabsBattler) return false;
		const slotManager = jabsBattler.getBattler().getSkillSlotManager();
		if (!slotManager) return false;
		const assignedCombatSlots = slotManager.getAllSecondarySlots().filter((slot) => slot.isEmpty() === false);
		if (assignedCombatSlots.length === 0) return false;
		return assignedCombatSlots.every((slot) => jabsBattler.isSkillTypeCooldownReady(slot.key) === false);
	}
	/**
	* Whether every assigned combat skill slot is ready (off cooldown).<br/>
	* Only secondary slots (CombatSkill1–4) with an assigned skill are checked —
	* mainhand, offhand, tool, and dodge are excluded for the same reason as
	* {@link #areAllCombatSlotsOnCooldown}. Empty secondary slots are skipped.<br/>
	* Used by {@code allOffCooldown} source-wide gate kind.
	* @param {Game_Battler} battler The battler whose slot manager we inspect.
	* @returns {boolean} True only when every assigned combat slot is ready to fire.
	*/
	static #areAllCombatSlotsReady(battler) {
		const jabsBattler = PassiveRuleJabsAccess.getJabsBattler(battler);
		if (!jabsBattler) return false;
		const slotManager = jabsBattler.getBattler().getSkillSlotManager();
		if (!slotManager) return false;
		const assignedCombatSlots = slotManager.getAllSecondarySlots().filter((slot) => slot.isEmpty() === false);
		if (assignedCombatSlots.length === 0) return true;
		return assignedCombatSlots.every((slot) => jabsBattler.isSkillTypeCooldownReady(slot.key) === true);
	}
	/**
	* Evaluates a single-resource threshold gate ({@code hpAbove}, {@code mpBelow}, etc.)
	* against the resolved scope of battlers.<br/>
	* Scope {@code anyAlly}/{@code anyEnemy} passes when at least one battler in range satisfies
	* the threshold; {@code allAllies}/{@code allEnemies} requires every battler to satisfy it.
	* Self scope (default) evaluates the evaluating battler only.
	* @param {Game_Battler} battler The evaluating battler.
	* @param {string} resource One of {@code hp}, {@code mp}, {@code tp}.
	* @param {string} direction {@code 'above'} or {@code 'below'}.
	* @param {number} threshold Tag threshold integer (0–100 percent).
	* @param {string} [scope] {@code self} (default), {@code anyAlly}, {@code allAllies}, {@code anyEnemy}, {@code allEnemies}.
	* @param {number|string} [range] Tile radius for ally/enemy scopes; defaults to plugin proximity param.
	* @returns {boolean} Whether the gate passes.
	*/
	static #evaluateResourceThreshold(battler, resource, direction, threshold, scope, range) {
		const resolvedScope = scope ?? "self";
		const resolvedRange = range !== undefined ? Number(range) : PassiveRuleJabsAccess.defaultProximity();
		const targets = this.#resolveScopedBattlers(battler, resolvedScope, resolvedRange);
		if (resolvedScope === "anyAlly" || resolvedScope === "anyEnemy") {
			return targets.some((target) => PassiveRuleThreshold.compare(target, resource, direction, threshold));
		}
		return targets.every((target) => PassiveRuleThreshold.compare(target, resource, direction, threshold));
	}
	/**
	* Evaluates {@code anyAbove}/{@code anyBelow} — passes when any of HP, MP, or TP
	* satisfies the threshold across the resolved scope.
	* @param {Game_Battler} battler The evaluating battler.
	* @param {string} direction {@code 'above'} or {@code 'below'}.
	* @param {number} threshold Threshold percent (0–100).
	* @param {string} [scope] Scope string; defaults to {@code self}.
	* @param {number|string} [range] Tile radius; defaults to plugin proximity param.
	* @returns {boolean} Whether at least one resource on any in-scope target satisfies the threshold.
	*/
	static #evaluateAnyResourceThreshold(battler, direction, threshold, scope, range) {
		const resolvedScope = scope ?? "self";
		const resolvedRange = range !== undefined ? Number(range) : PassiveRuleJabsAccess.defaultProximity();
		const targets = this.#resolveScopedBattlers(battler, resolvedScope, resolvedRange);
		return targets.some((target) => PassiveRuleThreshold.CURRENT_RESOURCE_KEYS.some((key) => PassiveRuleThreshold.compare(target, key, direction, threshold)));
	}
	/**
	* Evaluates {@code allAbove}/{@code allBelow} — passes when all of HP, MP, and TP
	* satisfy the threshold across the resolved scope.
	* @param {Game_Battler} battler The evaluating battler.
	* @param {string} direction {@code 'above'} or {@code 'below'}.
	* @param {number} threshold Threshold percent (0–100).
	* @param {string} [scope] Scope string; defaults to {@code self}.
	* @param {number|string} [range] Tile radius; defaults to plugin proximity param.
	* @returns {boolean} Whether every resource on every in-scope target satisfies the threshold.
	*/
	static #evaluateAllResourcesThreshold(battler, direction, threshold, scope, range) {
		const resolvedScope = scope ?? "self";
		const resolvedRange = range !== undefined ? Number(range) : PassiveRuleJabsAccess.defaultProximity();
		const targets = this.#resolveScopedBattlers(battler, resolvedScope, resolvedRange);
		return targets.every((target) => PassiveRuleThreshold.CURRENT_RESOURCE_KEYS.every((key) => PassiveRuleThreshold.compare(target, key, direction, threshold)));
	}
	/**
	* Resolves the set of battlers to test for a scoped resource threshold gate.<br/>
	* Scope controls who is evaluated; range limits the neighbourhood for ally/enemy scopes.
	* @param {Game_Battler} battler The evaluating battler.
	* @param {string} scope One of {@code self}, {@code anyAlly}, {@code allAllies}, {@code anyEnemy}, {@code allEnemies}.
	* @param {number} range Tile radius for ally/enemy scopes.
	* @returns {Game_Battler[]} The battlers to test against the threshold.
	*/
	static #resolveScopedBattlers(battler, scope, range) {
		switch (scope) {
			case "anyAlly":
			case "allAllies": return PassiveRuleJabsAccess.alliedBattlersWithinRange(battler, range).map((jabs) => jabs.getBattler()).filter((b) => !!b);
			case "anyEnemy":
			case "allEnemies": return PassiveRuleJabsAccess.opposingBattlersWithinRange(battler, range).map((jabs) => jabs.getBattler()).filter((b) => !!b);
			case "self":
			default: return [battler];
		}
	}
	/**
	* Frames elapsed since a passive-rule timestamp was stamped.<br/>
	* Never-stamped events behave as "since forever" for sinceLast* kinds.
	* @param {number} stampFrame {@link Graphics.frameCount} when the event last occurred (0 = never).
	* @returns {number} Elapsed frames since the stamp.
	*/
	static #framesSince(stampFrame) {
		if (stampFrame <= 0) return Graphics.frameCount;
		return Graphics.frameCount - stampFrame;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/PassiveStackCountEvaluator.js
/**
* Evaluates {@link passiveStateCount} tuples into stack contribution counts.<br/>
* Returns integer stack totals per source; 0 is valid and excludes that source from the stack map upstream.
*/
var PassiveStackCountEvaluator = class {
	/**
	* Evaluates one parsed {@code passiveStateCount} tuple from database notes.<br/>
	* Delegates to {@link #evaluate} after unpacking {@code [stateId, kind, param]}.
	* @param {Game_Battler} battler The battler whose live context drives the count.
	* @param {any[]} tuple Parsed note tuple {@code [stateId, kind, param]}.
	* @returns {number} Stack contribution from this source (0 is valid).
	*/
	static evaluateTuple(battler, tuple) {
		const [, kind, param, scope] = tuple;
		return this.evaluate(battler, kind, param, scope);
	}
	/**
	* Resolves a stack-count kind into an integer contribution for one source.<br/>
	* All formulas use {@code Math.floor(value / param)} so partial thresholds do not grant extra stacks.
	* @param {Game_Battler} battler The battler whose live context drives the count.
	* @param {string} kind Stack scaler kind from the note tuple.
	* @param {number|string|null} param Divisor or points-per-stack from the note tuple.
	* @param {number|string|null} [scope] Optional tile radius for proximity kinds; defaults to plugin default-proximity-tiles.
	* @returns {number} Stack contribution from this source (0 when kind is unknown).
	*/
	static evaluate(battler, kind, param, scope = null) {
		if (kind.startsWith("per-")) {
			return this.#evaluatePerParam(battler, kind.slice(4), Number(param));
		}
		const proximityTiles = scope ? Number(scope) : null;
		switch (kind) {
			case "negativeStateCount": return Math.floor(PassiveGateEvaluator.countNegativeStates(battler) / Number(param));
			case "alliesNearby": return Math.floor(PassiveRuleJabsAccess.nearbyAlliesExcludingSelf(battler, proximityTiles).length / Number(param));
			case "enemiesNearby": return Math.floor(PassiveRuleJabsAccess.nearbyEnemies(battler, proximityTiles).length / Number(param));
			case "enemiesTargetingMe": return Math.floor(PassiveRuleJabsAccess.enemiesTargetingMe(battler).length / Number(param));
			case "lessIsMoreHp": return Math.floor(this.#missingResourcePercent(battler, "hp") / Number(param));
			case "lessIsMoreMp": return Math.floor(this.#missingResourcePercent(battler, "mp") / Number(param));
			case "lessIsMoreTp": return Math.floor(this.#missingResourcePercent(battler, "tp") / Number(param));
			case "moreIsMoreHp": return Math.floor(PassiveRuleThreshold.resolveRuleValue(battler, "hp") / Number(param));
			case "moreIsMoreMp": return Math.floor(PassiveRuleThreshold.resolveRuleValue(battler, "mp") / Number(param));
			case "moreIsMoreTp": return Math.floor(PassiveRuleThreshold.resolveRuleValue(battler, "tp") / Number(param));
			default: return 0;
		}
	}
	/**
	* Scales stacks from a registry or resource key using {@code per-{key}, pointsPerStack} tags.<br/>
	* Example: {@code per-cri, 3} at 9% crit → {@code floor(9 / 3) = 3} stacks.
	* @param {Game_Battler} battler The battler whose parameter value we read.
	* @param {string} key Registry or resource key after the {@code per-} prefix.
	* @param {number} pointsPerStack Tag param — every this-many points grants one stack.
	* @returns {number} Floored stack count; zero when pointsPerStack is invalid.
	*/
	static #evaluatePerParam(battler, key, pointsPerStack) {
		if (pointsPerStack <= 0) return 0;
		const value = PassiveRuleThreshold.resolveRuleValue(battler, key);
		return Math.floor(value / pointsPerStack);
	}
	/**
	* Computes how much of a resource is missing, as a percent, for {@code lessIsMore*} stack kinds.<br/>
	* Full resource → 0 missing; empty resource → 100 missing.
	* @param {Game_Battler} battler The battler whose resource we inspect.
	* @param {string} resource One of {@code hp}, {@code mp}, or {@code tp}.
	* @returns {number} Whole-number percent missing (0–100).
	*/
	static #missingResourcePercent(battler, resource) {
		const current = PassiveRuleThreshold.resolveRuleValue(battler, resource);
		return Math.max(0, 100 - current);
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/objects/Game_Battler.js
/**
* Extends {@link #initPassiveStatesMembers}.<br/>
* Adds passive rule tracking frames and reconcile timer storage.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("initPassiveStatesMembers", Game_Battler.prototype.initPassiveStatesMembers);
Game_Battler.prototype.initPassiveStatesMembers = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("initPassiveStatesMembers").call(this);
	this.initPassiveRuleMembers();
};
/**
* Initializes members used by passive rule evaluation and drift reconciliation.<br/>
* Stored under {@code _j._passive._conditional} alongside passive core's state tracker.
*/
Game_Battler.prototype.initPassiveRuleMembers = function() {
	/**
	* A grouping of passive rule runtime data.
	*/
	this._j._passive._conditional = {};
	/**
	* Cached passive collection fingerprint for cheap drift checks on the map.
	* @type {string}
	*/
	this._j._passive._conditional._collectionFingerprint = String.empty;
	/**
	* Fingerprint computed by the current drift check, held briefly so the post-refresh
	* alias can apply it directly instead of re-running both collectors a third time.
	* Null outside of an active reconcilePassiveRules call.
	* @type {string|null}
	*/
	this._j._passive._conditional._pendingFingerprint = null;
	/**
	* Throttled reconcile timer for map-side rule drift.
	* @type {JABS_Timer}
	*/
	const delay = J.PASSIVE.EXT.CONDITIONAL.Metadata.reconcileDelayFrames || 15;
	this._j._passive._conditional._timer = new JABS_Timer(delay);
	/**
	* Last map frame this battler moved.
	* @type {number}
	*/
	this._j._passive._conditional._lastMovedFrame = 0;
	/**
	* Last map frame this battler took damage.
	* @type {number}
	*/
	this._j._passive._conditional._lastHitFrame = 0;
	/**
	* Last map frame this battler executed a map skill.
	* @type {number}
	*/
	this._j._passive._conditional._lastAttackedFrame = 0;
	/**
	* Last known real X coordinate of the map character; seeded on first JABS update.
	* @type {number|null}
	*/
	this._j._passive._conditional._lastTrackedX = null;
	/**
	* Last known real Y coordinate of the map character; seeded on first JABS update.
	* @type {number|null}
	*/
	this._j._passive._conditional._lastTrackedY = null;
	/**
	* Last map frame this battler received positive HP recovery.
	* @type {number}
	*/
	this._j._passive._conditional._lastHpHealFrame = 0;
	/**
	* Last map frame this battler received positive MP recovery.
	* @type {number}
	*/
	this._j._passive._conditional._lastMpHealFrame = 0;
	/**
	* Last map frame this battler received positive TP recovery.
	* @type {number}
	*/
	this._j._passive._conditional._lastTpHealFrame = 0;
	/**
	* Per-rule cooldown stamps shared across all {@link AutoRuleManager} subclasses (rule key → frame).
	* @type {Map<string, number>}
	*/
	this._j._passive._conditional._autoRuleLastFrame = new Map();
	/**
	* Per-rule whole-tile credit shared across all {@link AutoRuleManager} subclasses (rule key → tiles).
	* @type {Map<string, number>}
	*/
	this._j._passive._conditional._autoRuleTileCredit = new Map();
};
/**
* Reads the last map frame an auto rule key fired.
* @param {string} ruleKey Stable key from {@link AutoRuleManager.buildRuleKey}.
* @returns {number}
*/
Game_Battler.prototype.getAutoRuleLastFrame = function(ruleKey) {
	return this.autoRuleLastFrame().get(ruleKey) || 0;
};
/**
* Stamps the last map frame an auto rule key fired.
* @param {string} ruleKey Stable key from {@link AutoRuleManager.buildRuleKey}.
* @param {number} frame {@link Graphics.frameCount} when the rule last fired.
*/
Game_Battler.prototype.setAutoRuleLastFrame = function(ruleKey, frame) {
	this.autoRuleLastFrame().set(ruleKey, frame);
};
/**
* Reads accumulated whole-tile credit for one {@code move} auto rule key.
* @param {string} ruleKey Stable key from {@link AutoRuleManager.buildRuleKey}.
* @returns {number}
*/
Game_Battler.prototype.getAutoRuleTileCredit = function(ruleKey) {
	return this.autoRuleTileCredit().get(ruleKey) || 0;
};
/**
* Stores accumulated whole-tile credit for one {@code move} auto rule key.
* @param {string} ruleKey Stable key from {@link AutoRuleManager.buildRuleKey}.
* @param {number} tiles Whole tiles credited toward the next dispatch.
*/
Game_Battler.prototype.setAutoRuleTileCredit = function(ruleKey, tiles) {
	this.autoRuleTileCredit().set(ruleKey, tiles);
};
/**
* Returns the last map frame this battler moved.<br/>
* Read by {@code sinceLastMoved} / {@code movedWithin} gate kinds.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never moved on the map.
*/
Game_Battler.prototype.getPassiveRuleLastMovedFrame = function() {
	return this.lastMovedFrame();
};
/**
* Returns the last map frame this battler took damage.<br/>
* Read by {@code sinceLastHit} / {@code hitWithin} gate kinds.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never hit on the map.
*/
Game_Battler.prototype.getPassiveRuleLastHitFrame = function() {
	return this.lastHitFrame();
};
/**
* Returns the last map frame this battler executed a map skill.<br/>
* Read by {@code sinceLastAttacked} / {@code attackedWithin} gate kinds.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never attacked on the map.
*/
Game_Battler.prototype.getPassiveRuleLastAttackedFrame = function() {
	return this.lastAttackedFrame();
};
/**
* Stamps the current frame as the last time this battler moved on the map.<br/>
* Called from {@link JABS_Battler#updatePassiveRuleMovementTracking} when coordinates change.
*/
Game_Battler.prototype.stampPassiveRuleMovedFrame = function() {
	this.setLastMovedFrame(Graphics.frameCount);
};
/**
* Stamps the current frame as the last time this battler took damage.<br/>
* Called from the {@link #gainHp} alias when hp loss is applied.
*/
Game_Battler.prototype.stampPassiveRuleHitFrame = function() {
	this.setLastHitFrame(Graphics.frameCount);
};
/**
* Stamps the current frame as the last time this battler executed a map skill.<br/>
* Called from {@link JABS_Battler#setLastUsedSkillId} after a real skill use.
*/
Game_Battler.prototype.stampPassiveRuleAttackedFrame = function() {
	this.setLastAttackedFrame(Graphics.frameCount);
};
/**
* Returns the last frame this battler received positive HP recovery.<br/>
* Read by the {@code onHealHp} gate kind.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never healed.
*/
Game_Battler.prototype.getPassiveRuleLastHpHealFrame = function() {
	return this.lastHpHealFrame();
};
/**
* Returns the last frame this battler received positive MP recovery.<br/>
* Read by the {@code onHealMp} gate kind.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never healed.
*/
Game_Battler.prototype.getPassiveRuleLastMpHealFrame = function() {
	return this.lastMpHealFrame();
};
/**
* Returns the last frame this battler received positive TP recovery.<br/>
* Read by the {@code onHealTp} gate kind.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never healed.
*/
Game_Battler.prototype.getPassiveRuleLastTpHealFrame = function() {
	return this.lastTpHealFrame();
};
/**
* Stamps the current frame as the last time this battler received HP healing.
*/
Game_Battler.prototype.stampPassiveRuleHpHealFrame = function() {
	this.setLastHpHealFrame(Graphics.frameCount);
};
/**
* Stamps the current frame as the last time this battler received MP healing.
*/
Game_Battler.prototype.stampPassiveRuleMpHealFrame = function() {
	this.setLastMpHealFrame(Graphics.frameCount);
};
/**
* Stamps the current frame as the last time this battler received TP healing.
*/
Game_Battler.prototype.stampPassiveRuleTpHealFrame = function() {
	this.setLastTpHealFrame(Graphics.frameCount);
};
/**
* Extends {@link #gainHp}.<br/>
* Records damage timestamps for {@link passiveStateRule} kinds that care about hit windows.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("gainHp", Game_Battler.prototype.gainHp);
Game_Battler.prototype.gainHp = function(value) {
	if (value < 0) {
		this.stampPassiveRuleHitFrame();
	}
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("gainHp").call(this, value);
	if (value < 0) {
		AutoApplyStateManager.scheduleDamageTriggers(this, "hpDmg");
		AutoExecuteSkillManager.scheduleDamageTriggers(this, "hpDmg");
	}
};
/**
* Extends {@link #gainMp}.<br/>
* Fires mpDmg auto-apply rules when MP is reduced.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("gainMp", Game_Battler.prototype.gainMp);
Game_Battler.prototype.gainMp = function(value) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("gainMp").call(this, value);
	if (value < 0) {
		AutoApplyStateManager.scheduleDamageTriggers(this, "mpDmg");
		AutoExecuteSkillManager.scheduleDamageTriggers(this, "mpDmg");
	}
};
/**
* Extends {@link #gainTp}.<br/>
* Fires tpDmg auto-apply rules when TP is reduced.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("gainTp", Game_Battler.prototype.gainTp);
Game_Battler.prototype.gainTp = function(value) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("gainTp").call(this, value);
	if (value < 0) {
		AutoApplyStateManager.scheduleDamageTriggers(this, "tpDmg");
		AutoExecuteSkillManager.scheduleDamageTriggers(this, "tpDmg");
	}
};
/**
* Extends {@link #onHeal}.<br/>
* Stamps the appropriate heal-frame counter so {@link PassiveGateEvaluator} can check
* whether a heal occurred recently enough for an {@code onHealHp/Mp/Tp} gate to pass.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("onHeal", Game_Battler.prototype.onHeal);
Game_Battler.prototype.onHeal = function(resource, amount) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("onHeal").call(this, resource, amount);
	if (resource === J.BASE.Resource.HP) {
		this.stampPassiveRuleHpHealFrame();
		AutoApplyStateManager.scheduleHealTriggers(this, "onHealHp");
		AutoExecuteSkillManager.scheduleHealTriggers(this, "onHealHp");
	} else if (resource === J.BASE.Resource.MP) {
		this.stampPassiveRuleMpHealFrame();
		AutoApplyStateManager.scheduleHealTriggers(this, "onHealMp");
		AutoExecuteSkillManager.scheduleHealTriggers(this, "onHealMp");
	} else if (resource === J.BASE.Resource.TP) {
		this.stampPassiveRuleTpHealFrame();
		AutoApplyStateManager.scheduleHealTriggers(this, "onHealTp");
		AutoExecuteSkillManager.scheduleHealTriggers(this, "onHealTp");
	}
	PassiveRuleJabsAccess.nearbyAlliesExcludingSelf(this).forEach((jabsAlly) => {
		const allyBattler = jabsAlly.getBattler();
		if (!allyBattler) return;
		AutoApplyStateManager.scheduleHealTriggers(allyBattler, "onAllyHeal");
		AutoExecuteSkillManager.scheduleHealTriggers(allyBattler, "onAllyHeal");
	});
};
/**
* Extends {@link #canIncludePassiveStateFromSource}.<br/>
* Applies passiveSourceRule and passiveStateRule gates for this source/state pair.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("canIncludePassiveStateFromSource", Game_Battler.prototype.canIncludePassiveStateFromSource);
Game_Battler.prototype.canIncludePassiveStateFromSource = function(baseItem, stateId) {
	if (J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("canIncludePassiveStateFromSource").call(this, baseItem, stateId) === false) {
		return false;
	}
	return this.evaluatePassiveGateRulesForSource(baseItem, stateId);
};
/**
* Extends {@link #getPassiveStackContributionFromSource}.<br/>
* Applies passiveStateCount scaling when declared for this source/state pair.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("getPassiveStackContributionFromSource", Game_Battler.prototype.getPassiveStackContributionFromSource);
Game_Battler.prototype.getPassiveStackContributionFromSource = function(baseItem, stateId) {
	const countTuple = this.findPassiveStateCountTuple(baseItem, stateId);
	if (countTuple === null) {
		return J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("getPassiveStackContributionFromSource").call(this, baseItem, stateId);
	}
	return PassiveStackCountEvaluator.evaluateTuple(this, countTuple);
};
/**
* Evaluates every gate rule on a source that applies to the given passive state id.<br/>
* Source rules ({@code [kind, param?]}) and state rules ({@code [stateId, kind, param?]}) are
* evaluated separately with explicit destructuring — no length heuristics.<br/>
* All rules AND together; any failure short-circuits and excludes the passive.
* @param {RPG_BaseItem} baseItem Database row carrying passive and rule tags.
* @param {number} stateId Passive state id being evaluated for this source.
* @returns {boolean} Whether this source may contribute the given passive state right now.
*/
Game_Battler.prototype.evaluatePassiveGateRulesForSource = function(baseItem, stateId) {
	const sourceRules = baseItem.passiveSourceRules;
	const passesSourceRules = sourceRules.every(([kind, ...params]) => PassiveGateEvaluator.evaluate(this, kind, params));
	if (passesSourceRules === false) return false;
	const stateRules = baseItem.passiveStateRules.filter(([ruleStateId]) => Number(ruleStateId) === stateId);
	const passesStateRules = stateRules.every(([, kind, ...params]) => PassiveGateEvaluator.evaluate(this, kind, params));
	return passesStateRules;
};
/**
* Finds the first passiveStateCount tuple targeting a passive state id on this source.<br/>
* When authors duplicate tags, the first match wins.
* @param {RPG_BaseItem} baseItem Database row carrying passive and rule tags.
* @param {number} stateId Passive state id whose stack scaler we want.
* @returns {any[]|null} Parsed {@code [stateId, kind, param]} tuple, or null when none.
*/
Game_Battler.prototype.findPassiveStateCountTuple = function(baseItem, stateId) {
	const matches = baseItem.passiveStateCounts.filter((tuple) => Number(tuple[0]) === stateId);
	if (matches.length === 0) return null;
	return matches[0];
};
/**
* Builds a fingerprint of the current passive collection without mutating the tracker.<br/>
* Uses the pre-filtered {@link #passiveCapableSources} list from the last refresh rather than
* re-invoking the full collectors — sources like weapon combat skills that carry no passive tags
* are already excluded, so only the relevant subset is evaluated against live gate rules.
* @returns {string} Stable JSON fingerprint of unique ids and stack entries.
*/
Game_Battler.prototype.buildPassiveCollectionFingerprint = function() {
	const sources = this.passiveCapableSources();
	const uniqueIds = [];
	/** @type {Map<number, number>} */
	const stackMap = new Map();
	sources.forEach((source) => {
		let uniqueSourceIds = source.uniquePassiveStateIds;
		if (source.isEquipItem()) {
			uniqueSourceIds = uniqueSourceIds.concat(source.uniqueEquippedPassiveStateIds);
		}
		uniqueSourceIds.forEach((id) => {
			if (this.canIncludePassiveStateFromSource(source, id)) {
				uniqueIds.push(id);
			}
		});
		let stackableSourceIds = source.passiveStateIds;
		if (source.isEquipItem()) {
			stackableSourceIds = stackableSourceIds.concat(source.equippedPassiveStateIds);
		}
		stackableSourceIds.forEach((id) => {
			if (this.canIncludePassiveStateFromSource(source, id) === false) return;
			const contribution = this.getPassiveStackContributionFromSource(source, id);
			if (contribution <= 0) return;
			const running = stackMap.has(id) ? stackMap.get(id) : 0;
			stackMap.set(id, running + contribution);
		});
	});
	uniqueIds.sort((left, right) => left - right);
	const stackEntries = [...stackMap.entries()].sort((left, right) => left[0] - right[0]);
	return JSON.stringify({
		uniqueIds,
		stackEntries
	});
};
/**
* Stores the latest passive collection fingerprint after a refresh pass.<br/>
* When called from within a {@link reconcilePassiveRules} cycle the pending fingerprint is
* reused directly — the drift check already ran both collectors, so running them a third
* time would be redundant.  Outside that cycle (e.g. equip/unequip) both collectors run
* fresh to produce an accurate baseline.
*/
Game_Battler.prototype.updatePassiveRuleCollectionFingerprint = function() {
	const pending = this.pendingFingerprint();
	if (pending !== null) {
		this.setCollectionFingerprint(pending);
		return;
	}
	this.setCollectionFingerprint(this.buildPassiveCollectionFingerprint());
};
/**
* Re-checks whether passive rule drift changed the collection; refreshes when it did.<br/>
* Called from the throttled reconcile timer while the battler is active on the map.
*/
Game_Battler.prototype.reconcilePassiveRules = function() {
	const nextFingerprint = this.buildPassiveCollectionFingerprint();
	const previousFingerprint = this.collectionFingerprint();
	if (nextFingerprint === previousFingerprint) return;
	this.setPendingFingerprint(nextFingerprint);
	this.refreshPassiveStates();
	this.setPendingFingerprint(null);
};
/**
* Returns the throttled reconcile timer used while this battler is active on the map.<br/>
* Interval comes from {@link reconcile-delay-frames} plugin param.
* @returns {JABS_Timer} Repeating timer owned by this battler's conditional storage.
*/
Game_Battler.prototype.passiveRuleReconcileTimer = function() {
	return this._j._passive._conditional._timer;
};
/**
* Advances the reconcile timer and triggers a passive refresh when rule drift is detected.<br/>
* Reset-after-fire pattern keeps reconcile work off every single map frame.
*/
Game_Battler.prototype.updatePassiveRuleReconcileTimer = function() {
	const timer = this.passiveRuleReconcileTimer();
	timer.update();
	if (timer.isTimerComplete() === false) return;
	timer.reset();
	this.reconcilePassiveRules();
};
/**
* Extends {@link #refreshPassiveStates}.<br/>
* Updates the cached collection fingerprint after passive core rebuilds the tracker.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("refreshPassiveStates", Game_Battler.prototype.refreshPassiveStates);
Game_Battler.prototype.refreshPassiveStates = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("refreshPassiveStates").call(this);
	this.updatePassiveRuleCollectionFingerprint();
};
/**
* Manually triggers auto-execute skill rules for the given condition kind on this battler.<br/>
* Delegates to {@link AutoExecuteSkillManager.tryDispatch}, which applies the depth guard to
* prevent infinite re-entry when a forced skill itself triggers further auto-executes.
* @param {string} conditionKind - The condition kind to evaluate (e.g. 'time', 'stand').
*/
Game_Battler.prototype.tryAutoExecuteSkills = function(conditionKind) {
	AutoExecuteSkillManager.tryDispatch(this, conditionKind);
};
/**
* Extends {@link #onStateAdded}.<br/>
* Fires anyStateAdded plus posi/nega polarity auto-apply when a combat state lands.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("onStateAdded", Game_Battler.prototype.onStateAdded);
Game_Battler.prototype.onStateAdded = function(stateId) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("onStateAdded").call(this, stateId);
	AutoApplyStateManager.scheduleStateAddedTriggers(this, stateId);
	AutoExecuteSkillManager.scheduleStateAddedTriggers(this, stateId);
};
/**
* Extends {@link #onJabsStateInflicted}.<br/>
* Fires autoInflictState rules on the inflicting battler, applying the configured payload state
* onto this battler (the one just afflicted)- not the inflictor, and not anything nearby. Also
* fires the inflicting battler's autoModifyCooldowns rules against themselves- unlike
* autoInflictState, that effect lands back on the inflictor, not on this newly-afflicted target.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("onJabsStateInflicted", Game_Battler.prototype.onJabsStateInflicted);
Game_Battler.prototype.onJabsStateInflicted = function(stateId, attacker) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("onJabsStateInflicted").call(this, stateId, attacker);
	AutoInflictStateManager.scheduleInflictedStateTriggers(attacker, this, stateId);
	AutoModifyCooldownManager.scheduleSelfStateInflictedTriggers(attacker, stateId);
};
/**
* Gets the auto rule last frame.
* @returns {Map<string, number>} The autoRuleLastFrame.
*/
Game_Battler.prototype.autoRuleLastFrame = function() {
	return this._j._passive._conditional._autoRuleLastFrame;
};
/**
* Gets the auto rule tile credit.
* @returns {Map<string, number>} The autoRuleTileCredit.
*/
Game_Battler.prototype.autoRuleTileCredit = function() {
	return this._j._passive._conditional._autoRuleTileCredit;
};
/**
* Gets the last moved frame.
* @returns {number} The lastMovedFrame.
*/
Game_Battler.prototype.lastMovedFrame = function() {
	return this._j._passive._conditional._lastMovedFrame;
};
/**
* Sets the last moved frame.
* @param {number} newLastMovedFrame The new lastMovedFrame.
*/
Game_Battler.prototype.setLastMovedFrame = function(newLastMovedFrame) {
	this._j._passive._conditional._lastMovedFrame = newLastMovedFrame;
};
/**
* Gets the last hit frame.
* @returns {number} The lastHitFrame.
*/
Game_Battler.prototype.lastHitFrame = function() {
	return this._j._passive._conditional._lastHitFrame;
};
/**
* Sets the last hit frame.
* @param {number} newLastHitFrame The new lastHitFrame.
*/
Game_Battler.prototype.setLastHitFrame = function(newLastHitFrame) {
	this._j._passive._conditional._lastHitFrame = newLastHitFrame;
};
/**
* Gets the last attacked frame.
* @returns {number} The lastAttackedFrame.
*/
Game_Battler.prototype.lastAttackedFrame = function() {
	return this._j._passive._conditional._lastAttackedFrame;
};
/**
* Sets the last attacked frame.
* @param {number} newLastAttackedFrame The new lastAttackedFrame.
*/
Game_Battler.prototype.setLastAttackedFrame = function(newLastAttackedFrame) {
	this._j._passive._conditional._lastAttackedFrame = newLastAttackedFrame;
};
/**
* Gets the last hp heal frame.
* @returns {number} The lastHpHealFrame.
*/
Game_Battler.prototype.lastHpHealFrame = function() {
	return this._j._passive._conditional._lastHpHealFrame;
};
/**
* Sets the last hp heal frame.
* @param {number} newLastHpHealFrame The new lastHpHealFrame.
*/
Game_Battler.prototype.setLastHpHealFrame = function(newLastHpHealFrame) {
	this._j._passive._conditional._lastHpHealFrame = newLastHpHealFrame;
};
/**
* Gets the last mp heal frame.
* @returns {number} The lastMpHealFrame.
*/
Game_Battler.prototype.lastMpHealFrame = function() {
	return this._j._passive._conditional._lastMpHealFrame;
};
/**
* Sets the last mp heal frame.
* @param {number} newLastMpHealFrame The new lastMpHealFrame.
*/
Game_Battler.prototype.setLastMpHealFrame = function(newLastMpHealFrame) {
	this._j._passive._conditional._lastMpHealFrame = newLastMpHealFrame;
};
/**
* Gets the last tp heal frame.
* @returns {number} The lastTpHealFrame.
*/
Game_Battler.prototype.lastTpHealFrame = function() {
	return this._j._passive._conditional._lastTpHealFrame;
};
/**
* Sets the last tp heal frame.
* @param {number} newLastTpHealFrame The new lastTpHealFrame.
*/
Game_Battler.prototype.setLastTpHealFrame = function(newLastTpHealFrame) {
	this._j._passive._conditional._lastTpHealFrame = newLastTpHealFrame;
};
/**
* Gets the pending fingerprint.
* @returns {string|null} The pendingFingerprint.
*/
Game_Battler.prototype.pendingFingerprint = function() {
	return this._j._passive._conditional._pendingFingerprint;
};
/**
* Sets the pending fingerprint.
* @param {string|null} newPendingFingerprint The new pendingFingerprint.
*/
Game_Battler.prototype.setPendingFingerprint = function(newPendingFingerprint) {
	this._j._passive._conditional._pendingFingerprint = newPendingFingerprint;
};
/**
* Gets the collection fingerprint.
* @returns {string} The collectionFingerprint.
*/
Game_Battler.prototype.collectionFingerprint = function() {
	return this._j._passive._conditional._collectionFingerprint;
};
/**
* Sets the collection fingerprint.
* @param {string} newCollectionFingerprint The new collectionFingerprint.
*/
Game_Battler.prototype.setCollectionFingerprint = function(newCollectionFingerprint) {
	this._j._passive._conditional._collectionFingerprint = newCollectionFingerprint;
};

//#endregion
//#region src/plugins/passive/ext/conditional/objects/Game_Action.js
/**
* Extends {@link #apply}.<br/>
* When the target is critically hit, runs {@code whenCrit} auto-apply rules on the victim. When the
* target suffers a glancing blow instead, runs {@code whenGlanced} auto-apply rules on the victim-
* the two are mutually exclusive on any single hit (see {@link Game_Action#executeJabsAction}).
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Action.get("apply").call(this, target);
	const result = target.result();
	if (result.critical === true) {
		AutoApplyStateManager.scheduleCritTriggers(target);
		AutoExecuteSkillManager.scheduleCritTriggers(target);
	}
	if (result.glancing === true) {
		AutoApplyStateManager.scheduleGlancingTriggers(target);
		AutoExecuteSkillManager.scheduleGlancingTriggers(target);
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/objects/Game_CharacterBase.js
/**
* Extends {@link Game_CharacterBase#updatePixelStepping}.<br/>
* Credits whole tiles toward {@code move} auto-apply after Pixelistics fires a step.<br/>
* Hooks stepping instead of {@link Game_CharacterBase#onStep} because J-Pixelistics aliases
* {@link Game_Player#onStep} on its own prototype (player steps never reach a base-only onStep chain).
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_CharacterBase.set("updatePixelStepping", Game_CharacterBase.prototype.updatePixelStepping);
Game_CharacterBase.prototype.updatePixelStepping = function() {
	const tookStep = this.moveDistance() >= this.stepDistance();
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_CharacterBase.get("updatePixelStepping").call(this);
	if (tookStep === false) return;
	AutoApplyStateManager.processTileStepFromCharacter(this);
	AutoExecuteSkillManager.processTileStepFromCharacter(this);
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/JABS_Battler.js
/**
* Extends {@link JABS_Battler#update}.<br/>
* Throttles passive rule reconciles and stamps movement timestamps for sinceLast/movedWithin rules.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.set("update", JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.get("update").call(this);
	this.updatePassiveRuleMovementTracking();
	this.updatePassiveRuleReconcile();
};
/**
* Extends {@link JABS_Battler#setLastUsedSkillId}.<br/>
* Stamps attack timestamps when this battler executes map skills.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.set("setLastUsedSkillId", JABS_Battler.prototype.setLastUsedSkillId);
JABS_Battler.prototype.setLastUsedSkillId = function(skillId) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.get("setLastUsedSkillId").call(this, skillId);
	const battler = this.getBattler();
	if (!battler) return;
	battler.stampPassiveRuleAttackedFrame();
	SkillExecutionStateRemovalManager.process(battler, skillId);
};
/**
* Delegates throttled passive rule reconciliation to the underlying battler.<br/>
* Called every JABS update tick while this map battler is active.
*/
JABS_Battler.prototype.updatePassiveRuleReconcile = function() {
	const battler = this.getBattler();
	if (!battler) return;
	battler.updatePassiveRuleReconcileTimer();
	AutoApplyStateManager.processTimeRules(battler);
	AutoApplyStateManager.processEnemiesNearbyRules(battler);
	AutoApplyStateManager.processAlliesNearbyRules(battler);
	AutoApplyStateOnNearbyManager.processEnemiesNearbyRules(battler);
	AutoApplyStateOnNearbyManager.processAlliesNearbyRules(battler);
	AutoExecuteSkillManager.processTimeRules(battler);
	AutoExecuteSkillManager.processEnemiesNearbyRules(battler);
	AutoExecuteSkillManager.processAlliesNearbyRules(battler);
	AutoApplyStateManager.processStandRules(battler);
	AutoExecuteSkillManager.processStandRules(battler);
};
/**
* Stamps movement when this map battler's character coordinates change.<br/>
* Feeds {@code sinceLastMoved} and {@code movedWithin} gate kinds on the underlying battler.
*/
JABS_Battler.prototype.updatePassiveRuleMovementTracking = function() {
	const character = this.getCharacter();
	if (!character) return;
	const battler = this.getBattler();
	if (!battler) return;
	const tracker = battler._j._passive._conditional;
	const currentX = character._realX;
	const currentY = character._realY;
	if (tracker._lastTrackedX === null) {
		tracker._lastTrackedX = currentX;
		tracker._lastTrackedY = currentY;
		return;
	}
	if (tracker._lastTrackedX === currentX && tracker._lastTrackedY === currentY) return;
	tracker._lastTrackedX = currentX;
	tracker._lastTrackedY = currentY;
	battler.stampPassiveRuleMovedFrame();
	MoveStateRemovalManager.process(battler);
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/JABS_Engine.js
/**
* Extends {@link JABS_Engine#handleDefeatedEnemy}.<br/>
* Fires {@code onKill} rules on the battler that defeated the enemy.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Engine.set("handleDefeatedEnemy", JABS_Engine.prototype.handleDefeatedEnemy);
JABS_Engine.prototype.handleDefeatedEnemy = function(defeatedTarget, caster) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Engine.get("handleDefeatedEnemy").call(this, defeatedTarget, caster);
	if (!caster) return;
	const casterBattler = caster.getBattler();
	if (!casterBattler) return;
	AutoApplyStateManager.scheduleKillTriggers(casterBattler);
	AutoExecuteSkillManager.scheduleKillTriggers(casterBattler);
	AutoModifyCooldownManager.scheduleKillTriggers(casterBattler);
};
/**
* Extends {@link JABS_Engine#checkKnockback}.<br/>
* Fires {@code onKnockback} autoInflictState rules on the battler that knocked the target back,
* applying the configured payload state onto the knocked-back target.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Engine.set("checkKnockback", JABS_Engine.prototype.checkKnockback);
JABS_Engine.prototype.checkKnockback = function(action, target) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Engine.get("checkKnockback").call(this, action, target);
	const casterBattler = action.getCaster().getBattler();
	const targetBattler = target.getBattler();
	if (!casterBattler || !targetBattler) return;
	AutoInflictStateManager.scheduleKnockbackTriggers(casterBattler, targetBattler);
};
/**
* Extends {@link JABS_Engine#postExecuteSkillEffects}.<br/>
* Fires {@code onDamageDealt} rules on the caster after landing damage on an opposing battler.
* Reuses the same result-field check {@link JABS_Engine#applyAggroEffects} already performs here.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Engine.set("postExecuteSkillEffects", JABS_Engine.prototype.postExecuteSkillEffects);
JABS_Engine.prototype.postExecuteSkillEffects = function(action, target) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Engine.get("postExecuteSkillEffects").call(this, action, target);
	const caster = action.getCaster();
	if (!JABS_TeamRules.isOpposed(caster.getTeam(), target.getTeam())) return;
	const result = target.getBattler().result();
	const dealtDamage = result.hpDamage > 0 || result.mpDamage > 0 || result.tpDamage > 0;
	if (!dealtDamage) return;
	const casterBattler = caster.getBattler();
	if (!casterBattler) return;
	AutoApplyStateManager.scheduleDamageDealtTriggers(casterBattler);
	AutoExecuteSkillManager.scheduleDamageDealtTriggers(casterBattler);
	const cooldownType = action.getCooldownType();
	const isWeaponSlot = cooldownType === JABS_Button.Mainhand || cooldownType === JABS_Button.Offhand;
	if (isWeaponSlot) {
		AutoApplyStateManager.scheduleWeaponHitTriggers(casterBattler);
		AutoExecuteSkillManager.scheduleWeaponHitTriggers(casterBattler);
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/models/JABS_Action.js
/**
* Extends {@link #preCleanupHook}.<br/>
* Also processes {@code removeOnSkillResolution} rules when this action expires.
* Fires regardless of whether the action hit any targets, covering both
* hit-until-exhausted and whiff-and-expire cases.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Action.set("preCleanupHook", JABS_Action.prototype.preCleanupHook);
JABS_Action.prototype.preCleanupHook = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Action.get("preCleanupHook").call(this);
	const casterBattler = this.getCaster().getBattler();
	SkillResolutionStateRemovalManager.process(casterBattler, this.getBaseSkill().id);
};

//#endregion
//#region src/plugins/passive/ext/conditional/models/StateAfflictionProvider.js
/**
* Extends {@link StateAfflictionProvider.qualifies}.<br/>
* Also excludes passive states from the affliction strip.
*
* A passive is a permanent trait wearing a state's clothing - granted by equipment or a skill and
* never expiring - so listing one beside poison and paralysis would fill the strip with rows the
* player can neither wait out nor cure. J-ABS has no notion of a passive state, and the knowledge
* belongs on this side of the seam: this extension is where passives and JABS already meet.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.StateAfflictionProvider.set("qualifies", StateAfflictionProvider.qualifies);
StateAfflictionProvider.qualifies = function(trackedState, battler) {
	const qualifiesNormally = J.PASSIVE.EXT.CONDITIONAL.Aliased.StateAfflictionProvider.get("qualifies").call(this, trackedState, battler);
	if (qualifiesNormally === false) return false;
	if (battler.isPassiveState(trackedState.stateId) === true) return false;
	return true;
};

//#endregion
//#region src/plugins/passive/ext/conditional/models/AutoApplyStateDisplay.js
/**
* Player-facing prose for {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState} tuples.<br/>
* Handles {@code time} and {@code stand} conditions; other kinds are skipped until a passive needs them.
*/
var AutoApplyStateDisplay = class AutoApplyStateDisplay {
	/**
	* Formats map-timer param as a player-facing seconds phrase.
	* @param {number} frames Interval in frames (60 frames ≈ 1 second).
	* @returns {string}
	*/
	static intervalPhrase(frames) {
		const sec = frames / 60;
		if (Number.isInteger(sec)) {
			return `${sec} seconds`;
		}
		const rounded = Math.round(sec * 100) / 100;
		const display = parseFloat(rounded.toFixed(2));
		return `~${display} seconds`;
	}
	/**
	* Wraps one highlight fragment with italic, bold, and color for drawTextEx.
	* @param {Window_Base} window Host window supplying text style helpers.
	* @param {number} colorIndex Palette index for {@link Window_Base#colorizeText}.
	* @param {string} text Inner phrase to emphasize.
	* @returns {string}
	*/
	static highlightPhrase(window, colorIndex, text) {
		return window.colorizeText(colorIndex, window.boldenText(window.italicizeText(text)));
	}
	/**
	* Formats one parsed time autoApplyState tuple as drawTextEx prose.
	* Applied state renders via {@code \\state[STATE_ID]} (J-Message icon + name).
	* @param {number} stateId Database state id from the parsed tuple.
	* @param {number} param Frame interval from the parsed tuple.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static formatTimeProse(stateId, param, window) {
		const interval = AutoApplyStateDisplay.highlightPhrase(window, 6, AutoApplyStateDisplay.intervalPhrase(param));
		return `Every ${interval}, gain \\state[${stateId}].`;
	}
	/**
	* Formats one parsed stand autoApplyState tuple as drawTextEx prose.
	* @param {number} stateId Database state id from the parsed tuple.
	* @param {number} param Frame interval from the parsed tuple.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static formatStandProse(stateId, param, window) {
		const interval = AutoApplyStateDisplay.highlightPhrase(window, 6, AutoApplyStateDisplay.intervalPhrase(param));
		return `While standing still, gain \\state[${stateId}] every ${interval}.`;
	}
	/**
	* Builds drawTextEx prose lines for every time autoApplyState tag on a database row.
	* @param {RPG_BaseItem} dataRow State, skill, or equip row bearing notes.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string[]}
	*/
	static collectTimeProseLines(dataRow, window) {
		return AutoApplyStateDisplay.#collectProseLinesByCondition(dataRow, window, "time", AutoApplyStateDisplay.formatTimeProse);
	}
	/**
	* Builds drawTextEx prose lines for every stand autoApplyState tag on a database row.
	* @param {RPG_BaseItem} dataRow State, skill, or equip row bearing notes.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string[]}
	*/
	static collectStandProseLines(dataRow, window) {
		return AutoApplyStateDisplay.#collectProseLinesByCondition(dataRow, window, "stand", AutoApplyStateDisplay.formatStandProse);
	}
	/**
	* Shared collector — filters autoApplyState tuples by condition kind and formats prose.
	* @param {RPG_BaseItem} dataRow State, skill, or equip row bearing notes.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @param {string} conditionKind The condition kind to match ('time' or 'stand').
	* @param {(stateId: number, param: number, window: Window_Base) => string} formatter Formats one
	* matching tuple into a prose line; the caller supplies the kind-specific formatter to use.
	* @returns {string[]}
	*/
	static #collectProseLinesByCondition(dataRow, window, conditionKind, formatter) {
		const tuples = RPGManager.getArraysFromNotesByRegex(dataRow, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState, true);
		const lines = [];
		for (const tuple of tuples) {
			const stateId = Number(tuple[0]);
			const condition = String(tuple[1]).toLowerCase();
			const param = Number(tuple[2]);
			if (Number.isNaN(stateId) || stateId < 1) continue;
			if (condition !== conditionKind) continue;
			if (Number.isNaN(param) || param < 1) continue;
			lines.push(formatter(stateId, param, window));
		}
		return lines;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/models/AutoInflictStateDisplay.js
/**
* Player-facing prose for {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoInflictState} tuples.<br/>
* Reuses {@link AutoApplyStateDisplay}'s generic interval/highlight formatting helpers- those are
* plain text utilities, not specific to the self-apply tag they were originally written for.
*/
var AutoInflictStateDisplay = class AutoInflictStateDisplay {
	/**
	* Formats one parsed negaStateInflicted autoInflictState tuple as drawTextEx prose.
	* @param {number} stateId Database state id from the parsed tuple (the payload to apply).
	* @param {number} cooldownFrames Minimum frames between dispatches from the parsed tuple.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static formatNegativeInflictProse(stateId, cooldownFrames, window) {
		const payload = AutoInflictStateDisplay.#highlightState(window, stateId);
		return `Whenever this battler inflicts a negative state on a foe, also inflict ${payload}` + AutoInflictStateDisplay.#cooldownClause(cooldownFrames, window);
	}
	/**
	* Formats one parsed posiStateInflicted autoInflictState tuple as drawTextEx prose.
	* @param {number} stateId Database state id from the parsed tuple (the payload to apply).
	* @param {number} cooldownFrames Minimum frames between dispatches from the parsed tuple.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static formatPositiveInflictProse(stateId, cooldownFrames, window) {
		const payload = AutoInflictStateDisplay.#highlightState(window, stateId);
		return `Whenever this battler inflicts a positive state on someone, also inflict ${payload}` + AutoInflictStateDisplay.#cooldownClause(cooldownFrames, window);
	}
	/**
	* Formats one parsed anyStateInflicted autoInflictState tuple as drawTextEx prose.
	* @param {number} stateId Database state id from the parsed tuple (the payload to apply).
	* @param {number} cooldownFrames Minimum frames between dispatches from the parsed tuple.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static formatAnyInflictProse(stateId, cooldownFrames, window) {
		const payload = AutoInflictStateDisplay.#highlightState(window, stateId);
		return `Whenever this battler inflicts any state on someone, also inflict ${payload}` + AutoInflictStateDisplay.#cooldownClause(cooldownFrames, window);
	}
	/**
	* Wraps the payload state's inline \\state[ID] fragment in the same highlight styling used
	* elsewhere, so inflict-state prose visually matches auto-apply-state prose.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @param {number} stateId Database state id to render inline.
	* @returns {string}
	*/
	static #highlightState(window, stateId) {
		return AutoApplyStateDisplay.highlightPhrase(window, 6, `\\state[${stateId}]`);
	}
	/**
	* Builds the trailing cooldown clause for prose, or an empty string when the rule has no
	* throttle (cooldownFrames of 0 means "every time").
	* @param {number} cooldownFrames Minimum frames between dispatches.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static #cooldownClause(cooldownFrames, window) {
		if (cooldownFrames <= 0) return ".";
		const interval = AutoApplyStateDisplay.highlightPhrase(window, 6, AutoApplyStateDisplay.intervalPhrase(cooldownFrames));
		return ` (at most once every ${interval}).`;
	}
	/**
	* Builds drawTextEx prose lines for every autoInflictState tag on a database row, regardless
	* of which inflict condition each tuple uses.
	* @param {RPG_BaseItem} dataRow State, skill, or equip row bearing notes.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string[]}
	*/
	static collectProseLines(dataRow, window) {
		const tuples = RPGManager.getArraysFromNotesByRegex(dataRow, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoInflictState, true);
		const lines = [];
		for (const tuple of tuples) {
			const stateId = Number(tuple[0]);
			const condition = String(tuple[1]).toLowerCase();
			const cooldownFrames = Number(tuple[2]);
			if (Number.isNaN(stateId) || stateId < 1) continue;
			if (Number.isNaN(cooldownFrames) || cooldownFrames < 0) continue;
			if (condition === "negastateinflicted") {
				lines.push(AutoInflictStateDisplay.formatNegativeInflictProse(stateId, cooldownFrames, window));
			} else if (condition === "posistateinflicted") {
				lines.push(AutoInflictStateDisplay.formatPositiveInflictProse(stateId, cooldownFrames, window));
			} else if (condition === "anystateinflicted") {
				lines.push(AutoInflictStateDisplay.formatAnyInflictProse(stateId, cooldownFrames, window));
			}
		}
		return lines;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/models/RemoveStateOnMoveDisplay.js
/**
* Player-facing prose for {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove} tuples.
*/
var RemoveStateOnMoveDisplay = class RemoveStateOnMoveDisplay {
	/**
	* Formats one parsed removeStateOnMove tuple as drawTextEx prose.
	* @param {number} stateId Database state id to be stripped on movement.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static formatProse(stateId, window) {
		const stateName = window.colorizeText(14, window.boldenText(`\\state[${stateId}]`));
		return `Moving removes all ${stateName} stacks.`;
	}
	/**
	* Builds drawTextEx prose lines for every removeStateOnMove tag on a database row.
	* @param {RPG_BaseItem} dataRow State, skill, or equip row bearing notes.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string[]}
	*/
	static collectProseLines(dataRow, window) {
		if (!J.PASSIVE || !J.PASSIVE.EXT || !J.PASSIVE.EXT.CONDITIONAL) return [];
		const tuples = RPGManager.getArraysFromNotesByRegex(dataRow, J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove, true);
		const lines = [];
		for (const tuple of tuples) {
			const stateId = Number(tuple[0]);
			if (Number.isNaN(stateId) || stateId < 1) continue;
			lines.push(RemoveStateOnMoveDisplay.formatProse(stateId, window));
		}
		return lines;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/windows/Window_PassiveDetail.js
/**
* Extends {@link Window_PassiveDetail#drawStateHeader}.<br/>
* Injects autoApplyState (stand condition), autoInflictState, and removeStateOnMove prose
* under the header.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Window_PassiveDetail.set("drawStateHeader", Window_PassiveDetail.prototype.drawStateHeader);
Window_PassiveDetail.prototype.drawStateHeader = function(state) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Window_PassiveDetail.get("drawStateHeader").call(this, state);
	this.drawAutoApplyStandProse(state);
	this.drawAutoInflictStateProse(state);
	this.drawRemoveStateOnMoveProse(state);
};
/**
* Draws player-facing prose for each stand {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState} tag.
* Skipped when the state carries no stand auto-apply rules.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawAutoApplyStandProse = function(state) {
	const lines = AutoApplyStateDisplay.collectStandProseLines(state, this);
	if (lines.length === 0) return;
	const width = this.innerWidth - 4;
	lines.forEach((text) => {
		this.drawTextEx(text, 4, this.currentY, width);
		this.currentY += this.textSizeEx(text).height + 4;
	});
};
/**
* Draws player-facing prose for each {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoInflictState} tag.
* Skipped when the state carries no auto-inflict rules.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawAutoInflictStateProse = function(state) {
	const lines = AutoInflictStateDisplay.collectProseLines(state, this);
	if (lines.length === 0) return;
	const width = this.innerWidth - 4;
	lines.forEach((text) => {
		this.drawTextEx(text, 4, this.currentY, width);
		this.currentY += this.textSizeEx(text).height + 4;
	});
};
/**
* Draws player-facing prose for each {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove} tag.
* Skipped when the state carries no move-removal rules.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawRemoveStateOnMoveProse = function(state) {
	const lines = RemoveStateOnMoveDisplay.collectProseLines(state, this);
	if (lines.length === 0) return;
	const width = this.innerWidth - 4;
	lines.forEach((text) => {
		this.drawTextEx(text, 4, this.currentY, width);
		this.currentY += this.textSizeEx(text).height + 4;
	});
};

//#endregion
//#region src/plugins/passive/ext/conditional/registerPassiveConditionalSaveCodecs.js
/**
* The reconcile throttle is a stopwatch measuring how long since this battler's conditional passives
* were last reconciled, which is a question only the current session can ask - so it is never
* written, and every loaded actor starts with a fresh one.
*
* `Game_Actor` is the only host that reaches a savefile: the field is assigned on `Game_Battler`,
* but enemies are rebuilt from the troop rather than persisted.
*/
SerializableRegistry.extend(Game_Actor, { transients: { "_j._passive._conditional._timer": () => new JABS_Timer(J.PASSIVE.EXT.CONDITIONAL.Metadata.reconcileDelayFrames || 15) } });

//#endregion
//# sourceMappingURL=J-Passive-Conditional.js.map