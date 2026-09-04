//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 ABS-DPS] Measures how much damage each party member is dealing, and how fast.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * J-ABS-Dps measures damage output. It watches the same moment J-ABS already
 * announces- a skill effect landing on a target- and files each landed hit
 * against the fight it happened in.
 *
 * Nothing in this plugin changes gameplay. It only observes. It also draws
 * nothing; J-HUD-Dps is the readout built on top of these numbers.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * THE CLOCK ONLY RUNS IN COMBAT.
 * A rate measured against wall time is mostly measuring the walk between
 * fights. The clock here advances only while the party is engaged, so out of
 * combat every figure freezes and holds its last reading rather than decaying
 * toward zero on the way to the next encounter.
 *
 * TWO RATES, AND THE GAP BETWEEN THEM IS THE POINT.
 * The rolling rate covers the last few seconds and answers "how hard is this
 * hitting right now". The encounter rate covers a whole fight, dodging and
 * repositioning and cooldown idling included. A slow heavy weapon and a fast
 * light one can tie on one and be nowhere near each other on the other.
 *
 * AN ENCOUNTER ENDS AT ITS LAST HIT, NOT WHEN COMBAT IS DECLARED OVER.
 * JABS keeps its in-combat countdown alive for between two and ten seconds
 * after the fighting stops. That countdown falling is the signal that a fight
 * finished, but the fight is measured only as far as the last hit that landed-
 * on a six second encounter, letting the tail into the span would roughly
 * halve every number it produced.
 *
 * EVERY MEMBER SHARES ONE CLOCK.
 * Damage is recorded per battler, but all of them are measured against the
 * same encounter span. An ally who spent the fight dead, stuck on terrain, or
 * idling somewhere divides their small damage by the whole fight and reads
 * low, which is the entire signal. Giving each battler their own active-time
 * denominator would make everyone look fine over whatever slice of the fight
 * they bothered to show up for.
 *
 * ----------------------------------------------------------------------------
 * WHAT COUNTS:
 * A hit is recorded when all of the following hold.
 *
 * - The caster is an actor. This measures what the party puts out, and with
 *   teams in play an enemy striking another enemy would otherwise land here.
 * - The target is an enemy, and is not inanimate. Inanimate forces the neutral
 *   team, and JABS only declares combat between opposed teams, so nothing
 *   struck this way ever raises the in-combat flag. The clock would never
 *   start and the encounter would never close.
 *
 * ----------------------------------------------------------------------------
 * BUILDING A TRAINING DUMMY:
 * Do NOT tag a dummy as inanimate. It reads like the right tag- a dummy should
 * not wander off- but inanimate puts the target on the neutral team, and a
 * neutral target is never opposed to the party, so hitting it is never combat.
 * The clock stays frozen, every hit lands on the same frame, and no rate can be
 * measured at all.
 *
 * Build it as an ordinary enemy instead:
 * - Fixed autonomous movement on the event, which is what actually keeps it
 *   still. Inanimate was never the thing stopping it from moving.
 * - Sight and pursuit of zero, so it never chases. As a bonus this lets JABS
 *   compress its own combat tail to two seconds, so the encounter closes
 *   promptly once the swinging stops.
 * - A large hp pool rather than the invincible flag. Invincible makes a battler
 *   untargetable outright, so nothing would ever connect with it.
 * - The action did not come from the tool or usable item slot. A thrown bomb
 *   is a statement about the bomb, not about the weapon being measured.
 * - The attack was not evaded.
 * - The hit dealt more than zero hp damage. A pure state application deals
 *   nothing, and a heal arrives as negative damage that would walk the figure
 *   backwards.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * PLUGIN PARAMETERS:
 * @param rollingWindowSeconds
 * @type number
 * @min 1
 * @max 60
 * @text Rolling Window (seconds)
 * @desc How far back the rolling rate looks, in seconds of combat time. Keep it shorter than a typical fight, or the rate becomes a smoothing filter instead.
 * @default 5
 */
//=================================================================================================
//endregion annotations

//#region src/plugins/abs/ext/dps/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-ABS-Dps.
*
* One tunable, and it is the one worth tuning: how far back the rolling rate looks. The right value
* is a function of how long a typical fight lasts, which is a thing that is learned by watching the
* number rather than reasoned about in advance.
*/
var JAbsDps_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The name of this plugin.
	* @param {string} version The semver-formatted version of this plugin.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Reads the rolling window length from plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*
	* Parameter-driven fields are declared here rather than as class fields, so that values coming
	* out of the RMMZ plugin manager actually apply after load.
	*/
	initializeMetadata() {
		/**
		* How many seconds of combat time the rolling rate looks back across.
		*
		* Shorter than a typical fight on purpose. Once the window outlasts the encounter it stops
		* being a rate and becomes a smoothing filter- three seconds of swinging divided by a fifteen
		* second window reads as a fifth of the real output.
		* @type {number}
		*/
		this.rollingWindowSeconds = Number(this.parsedPluginParameters["rollingWindowSeconds"] ?? 5);
		/**
		* The rolling window length expressed in frames, which is the unit the tracker measures in.
		* @type {number}
		*/
		this.rollingWindowFrames = this.rollingWindowSeconds * 60;
	}
};

//#endregion
//#region src/plugins/abs/ext/dps/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.DPS = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.DPS.Metadata = new JAbsDps_PluginMetadata("J-ABS-Dps", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.DPS.Aliased = {};
J.ABS.EXT.DPS.Aliased.JABS_Engine = new Map();

//#endregion
//#region src/plugins/abs/ext/dps/models/JabsDpsHit.js
/**
* One landed hit, recorded at the moment its result was applied to the target.
*
* The tracker stores these rather than running counters, because a counter answers exactly one
* question and a hit answers all of them. Rolling damage is a filter on {@link combatFrame},
* per-battler damage is a group on {@link casterUuid}, and per-skill attribution is a group on
* {@link skillId} - none of which require the recording side to know they were wanted.
*/
var JabsDpsHit = class {
	/**
	* The combat-time frame this hit landed on.
	*
	* Combat time, not real time- the tracker's clock only advances while the party is engaged, so
	* two hits five frames apart across a ten minute walk are still five frames apart here.
	* @type {number}
	*/
	#combatFrame = 0;
	/**
	* The uuid of the battler that dealt this hit.
	* @type {string}
	*/
	#casterUuid = String.empty;
	/**
	* The id of the skill that dealt this hit.
	* @type {number}
	*/
	#skillId = 0;
	/**
	* The hp damage this hit inflicted.
	* @type {number}
	*/
	#hpDamage = 0;
	/**
	* Whether or not this hit was a critical.
	* @type {boolean}
	*/
	#critical = false;
	/**
	* Constructor.
	* @param {number} combatFrame The combat-time frame this hit landed on.
	* @param {string} casterUuid The uuid of the battler that dealt this hit.
	* @param {number} skillId The id of the skill that dealt this hit.
	* @param {number} hpDamage The hp damage this hit inflicted.
	* @param {boolean} critical Whether or not this hit was a critical.
	*/
	constructor(combatFrame, casterUuid, skillId, hpDamage, critical) {
		this.#combatFrame = combatFrame;
		this.#casterUuid = casterUuid;
		this.#skillId = skillId;
		this.#hpDamage = hpDamage;
		this.#critical = critical;
	}
	/**
	* Gets the combat-time frame this hit landed on.
	* @returns {number}
	*/
	combatFrame() {
		return this.#combatFrame;
	}
	/**
	* Gets the uuid of the battler that dealt this hit.
	* @returns {string}
	*/
	casterUuid() {
		return this.#casterUuid;
	}
	/**
	* Gets the id of the skill that dealt this hit.
	* @returns {number}
	*/
	skillId() {
		return this.#skillId;
	}
	/**
	* Gets the hp damage this hit inflicted.
	* @returns {number}
	*/
	hpDamage() {
		return this.#hpDamage;
	}
	/**
	* Gets whether or not this hit was a critical.
	* @returns {boolean}
	*/
	isCritical() {
		return this.#critical;
	}
};

//#endregion
//#region src/plugins/abs/ext/dps/models/JabsDpsEncounter.js
/**
* One fight's worth of landed hits, and the combat-time span they happened across.
*
* An encounter opens on the first hit that qualifies and closes when the party leaves combat. It
* holds the hits and answers questions about them; deciding when to open, extend or close one is
* the tracker's job, not its own.
*
* The span deliberately ends at the last landed hit rather than at the moment combat was declared
* over. JABS keeps its in-combat countdown alive for between two and ten seconds after the fighting
* stops, and on a six second encounter that tail would roughly halve every figure derived here.
*/
var JabsDpsEncounter = class JabsDpsEncounter {
	/**
	* The shortest span any encounter is permitted to be measured across, in frames.
	*
	* Without a floor, the opening hit of a fight divides by roughly one frame and a hundred points
	* of damage reads as six thousand per second before settling. One second of deliberate
	* underreporting decays into correctness within that same second; the spike is wrong at exactly
	* the moment the number is being watched.
	* @type {number}
	*/
	static MINIMUM_SPAN_FRAMES = 60;
	/**
	* How many frames make up one second of combat time.
	* @type {number}
	*/
	static FRAMES_PER_SECOND = 60;
	/**
	* The combat-time frame this encounter opened on.
	* @type {number}
	*/
	#openedAtCombatFrame = 0;
	/**
	* The working end of this encounter, in combat-time frames.
	*
	* While the encounter is open the tracker walks this forward every frame, so a lull in the middle
	* of a fight correctly drags the rate down. On close it snaps back to the last landed hit.
	* @type {number}
	*/
	#endCombatFrame = 0;
	/**
	* The combat-time frame of the most recent hit recorded here.
	* @type {number}
	*/
	#lastHitCombatFrame = 0;
	/**
	* Whether or not this encounter has been closed out.
	* @type {boolean}
	*/
	#closed = false;
	/**
	* Every hit landed during this encounter, in the order they landed.
	* @type {JabsDpsHit[]}
	*/
	#hits = [];
	/**
	* Constructor.
	* @param {number} openedAtCombatFrame The combat-time frame this encounter opened on.
	*/
	constructor(openedAtCombatFrame) {
		this.#openedAtCombatFrame = openedAtCombatFrame;
		this.#endCombatFrame = openedAtCombatFrame;
		this.#lastHitCombatFrame = openedAtCombatFrame;
	}
	/**
	* Gets the combat-time frame this encounter opened on.
	* @returns {number}
	*/
	openedAtCombatFrame() {
		return this.#openedAtCombatFrame;
	}
	/**
	* Gets whether or not this encounter has been closed out.
	* @returns {boolean}
	*/
	isClosed() {
		return this.#closed;
	}
	/**
	* Gets every hit landed during this encounter.
	* @returns {JabsDpsHit[]}
	*/
	hits() {
		return this.#hits;
	}
	/**
	* Records a hit against this encounter.
	* @param {JabsDpsHit} hit The hit that just landed.
	*/
	addHit(hit) {
		this.#hits.push(hit);
		this.#lastHitCombatFrame = hit.combatFrame();
	}
	/**
	* Walks the working end of this encounter forward to the given combat-time frame.
	* @param {number} combatFrame The current combat-time frame.
	*/
	extendTo(combatFrame) {
		this.#endCombatFrame = combatFrame;
	}
	/**
	* Closes this encounter out, snapping its span back to the last hit that landed.
	*/
	close() {
		this.#endCombatFrame = this.#lastHitCombatFrame;
		this.#closed = true;
	}
	/**
	* Gets how many frames of combat time this encounter spans, floored at the minimum.
	* @returns {number}
	*/
	spanFrames() {
		const span = this.#endCombatFrame - this.#openedAtCombatFrame;
		return Math.max(JabsDpsEncounter.MINIMUM_SPAN_FRAMES, span);
	}
	/**
	* Gets the total hp damage the given battler dealt during this encounter.
	* @param {string} casterUuid The uuid of the battler in question.
	* @returns {number}
	*/
	damageBy(casterUuid) {
		return this.#hits.filter((hit) => hit.casterUuid() === casterUuid).reduce((total, hit) => total + hit.hpDamage(), 0);
	}
	/**
	* Gets the hp damage the given battler dealt on or after the given combat-time frame.
	* @param {string} casterUuid The uuid of the battler in question.
	* @param {number} sinceCombatFrame The earliest frame that still counts.
	* @returns {number}
	*/
	damageBySince(casterUuid, sinceCombatFrame) {
		return this.#hits.filter((hit) => hit.casterUuid() === casterUuid).filter((hit) => hit.combatFrame() >= sinceCombatFrame).reduce((total, hit) => total + hit.hpDamage(), 0);
	}
	/**
	* Gets the given battler's damage per second across this whole encounter.
	* @param {string} casterUuid The uuid of the battler in question.
	* @returns {number}
	*/
	dpsBy(casterUuid) {
		const damage = this.damageBy(casterUuid);
		return JabsDpsEncounter.toDps(damage, this.spanFrames());
	}
	/**
	* Converts an amount of damage across a span of frames into a per-second rate.
	* @param {number} damage The damage dealt across the span.
	* @param {number} frames The number of frames the damage was dealt across.
	* @returns {number}
	*/
	static toDps(damage, frames) {
		return damage * JabsDpsEncounter.FRAMES_PER_SECOND / frames;
	}
};

//#endregion
//#region src/plugins/abs/ext/dps/managers/JabsDpsTracker.js
/**
* Keeps a live measure of how much damage each party member is dealing, and how fast.
*
* The whole instrument rests on one idea: the clock only runs while the party is in combat. A rate
* measured against wall time in an ARPG is mostly measuring the walk between fights, so the
* denominator here advances only while {@link Game_Party#anyMemberInCombat} says something is
* happening. Out of combat it freezes, and every figure holds its last reading instead of decaying
* to zero on the way to the next encounter.
*
* Two encounters are kept at a time, and they behave as a shift register. A closed encounter stays
* in the current slot until the next one opens on its first landed hit, which is what makes the
* fight that just ended readable in the moment anyone would want to read it.
*/
var JabsDpsTracker = class JabsDpsTracker {
	/**
	* How many frames of combat time the rolling window looks back across.
	* @type {number}
	*/
	#rollingWindowFrames = 300;
	/**
	* How many frames the party has spent in combat this session.
	*
	* This is the clock everything is measured against, and it is deliberately not the frame count.
	* It advances only while the party is engaged.
	* @type {number}
	*/
	#combatFrames = 0;
	/**
	* Whether the party was in combat as of the previous update.
	*
	* Held only to spot the falling edge- the moment combat ends is the signal to close an encounter,
	* and there is no event announcing it.
	* @type {boolean}
	*/
	#wasInCombat = false;
	/**
	* The encounter currently being measured, or the most recently finished one.
	*
	* Seeded already-spent so nothing downstream has to consider emptiness- a fightless encounter
	* answers zero to every question asked of it, which is the honest answer before any fighting.
	* @type {JabsDpsEncounter}
	*/
	#currentEncounter = JabsDpsTracker.spentEncounter();
	/**
	* The encounter before the current one.
	* @type {JabsDpsEncounter}
	*/
	#previousEncounter = JabsDpsTracker.spentEncounter();
	/**
	* Constructor.
	* @param {number} rollingWindowFrames How many frames the rolling window looks back across.
	*/
	constructor(rollingWindowFrames) {
		this.#rollingWindowFrames = rollingWindowFrames;
	}
	/**
	* Builds an encounter that is already over and never had anything happen in it.
	* @returns {JabsDpsEncounter}
	*/
	static spentEncounter() {
		const encounter = new JabsDpsEncounter(0);
		encounter.close();
		return encounter;
	}
	/**
	* Gets how many frames the rolling window looks back across.
	* @returns {number}
	*/
	rollingWindowFrames() {
		return this.#rollingWindowFrames;
	}
	/**
	* Gets how many frames the party has spent in combat this session.
	* @returns {number}
	*/
	combatFrames() {
		return this.#combatFrames;
	}
	/**
	* Gets the encounter currently being measured, or the most recently finished one.
	* @returns {JabsDpsEncounter}
	*/
	currentEncounter() {
		return this.#currentEncounter;
	}
	/**
	* Gets the encounter before the current one.
	* @returns {JabsDpsEncounter}
	*/
	previousEncounter() {
		return this.#previousEncounter;
	}
	/**
	* Advances the tracker by one frame.
	*/
	update() {
		const inCombat = $gameParty.anyMemberInCombat();
		this.updateCombatClock(inCombat);
		this.updateEncounterState(inCombat);
		this.#wasInCombat = inCombat;
	}
	/**
	* Advances the combat clock, and the open encounter along with it.
	* @param {boolean} inCombat Whether or not the party is currently in combat.
	*/
	updateCombatClock(inCombat) {
		if (inCombat === false) return;
		this.#combatFrames++;
		if (this.#currentEncounter.isClosed() === false) {
			this.#currentEncounter.extendTo(this.#combatFrames);
		}
	}
	/**
	* Closes out the open encounter when combat has just ended.
	* @param {boolean} inCombat Whether or not the party is currently in combat.
	*/
	updateEncounterState(inCombat) {
		if (inCombat === true) return;
		if (this.#wasInCombat === false) return;
		if (this.#currentEncounter.isClosed() === true) return;
		this.#currentEncounter.close();
	}
	/**
	* Considers a landed skill effect for recording, and records it when it describes party damage.
	* @param {JABS_Action} action The action that was executed.
	* @param {JABS_Battler} target The battler the effects were applied against.
	*/
	handleSkillEffect(action, target) {
		if (this.shouldRecordSkillEffect(action, target) === false) return;
		const caster = action.getCaster();
		const { hpDamage, critical } = target.getBattler().result();
		this.recordHit(caster.getUuid(), action.getBaseSkill().id, hpDamage, critical);
	}
	/**
	* Gets whether or not a landed skill effect belongs in the damage record.
	* @param {JABS_Action} action The action that was executed.
	* @param {JABS_Battler} target The battler the effects were applied against.
	* @returns {boolean}
	*/
	shouldRecordSkillEffect(action, target) {
		const cooldownType = action.getCooldownType();
		if (cooldownType === JABS_Button.Tool) return false;
		if (cooldownType === JABS_Button.UsableItem) return false;
		const caster = action.getCaster();
		if (caster.isActor() === false) return false;
		if (target.isEnemy() === false) return false;
		if (target.isInanimate() === true) return false;
		const { hpDamage, evaded } = target.getBattler().result();
		if (evaded === true) return false;
		if (hpDamage <= 0) return false;
		return true;
	}
	/**
	* Records a landed hit, opening a new encounter when the previous one is spent.
	* @param {string} casterUuid The uuid of the battler that dealt the hit.
	* @param {number} skillId The id of the skill that dealt the hit.
	* @param {number} hpDamage The hp damage the hit inflicted.
	* @param {boolean} critical Whether or not the hit was a critical.
	*/
	recordHit(casterUuid, skillId, hpDamage, critical) {
		if (this.#currentEncounter.isClosed() === true) {
			this.openEncounter();
		}
		const hit = new JabsDpsHit(this.#combatFrames, casterUuid, skillId, hpDamage, critical);
		this.#currentEncounter.addHit(hit);
	}
	/**
	* Opens a new encounter, retiring the finished one into the previous slot.
	*/
	openEncounter() {
		this.#previousEncounter = this.#currentEncounter;
		this.#currentEncounter = new JabsDpsEncounter(this.#combatFrames);
	}
	/**
	* Gets the given battler's damage per second across the last few seconds of combat.
	* @param {string} casterUuid The uuid of the battler in question.
	* @returns {number}
	*/
	rollingDpsBy(casterUuid) {
		const windowFrames = this.#rollingWindowFrames;
		const earliestCountedFrame = this.#combatFrames - windowFrames;
		const damage = this.#currentEncounter.damageBySince(casterUuid, earliestCountedFrame);
		return JabsDpsEncounter.toDps(damage, this.rollingDenominatorFrames());
	}
	/**
	* Gets how many frames the rolling rate is currently divided by.
	*
	* Two clamps, fixing opposite failures. The window has to be capped by how long the fight has
	* actually been going, or the opening seconds of every encounter divide by a window that has not
	* filled and read low. It also has to be floored, or the very first hit divides by almost nothing
	* and reads absurdly high.
	* @returns {number}
	*/
	rollingDenominatorFrames() {
		const elapsed = this.#combatFrames - this.#currentEncounter.openedAtCombatFrame();
		const unfilledWindow = Math.min(this.#rollingWindowFrames, elapsed);
		return Math.max(JabsDpsEncounter.MINIMUM_SPAN_FRAMES, unfilledWindow);
	}
	/**
	* Gets the given battler's damage per second across the current encounter.
	* @param {string} casterUuid The uuid of the battler in question.
	* @returns {number}
	*/
	currentDpsBy(casterUuid) {
		return this.#currentEncounter.dpsBy(casterUuid);
	}
	/**
	* Gets the given battler's damage per second across the previous encounter.
	* @param {string} casterUuid The uuid of the battler in question.
	* @returns {number}
	*/
	previousDpsBy(casterUuid) {
		return this.#previousEncounter.dpsBy(casterUuid);
	}
	/**
	* Gets the total hp damage the given battler dealt in the current encounter.
	* @param {string} casterUuid The uuid of the battler in question.
	* @returns {number}
	*/
	currentDamageBy(casterUuid) {
		return this.#currentEncounter.damageBy(casterUuid);
	}
};

//#endregion
//#region src/plugins/abs/ext/dps/managers/JABS_Engine.js
/**
* Extends {@link JABS_Engine.prototype.initialize}.<br/>
* Also seeds the damage tracker that measures what the party is putting out.
*
* The tracker survives a map transfer for the same reason the food chain plans do- a fight can be
* walked out of and back into, and a reading that resets at the map edge would be a reading about
* the map edge.
* @param {boolean} isMapTransfer Whether or not this initialization is from a map transfer.
*/
J.ABS.EXT.DPS.Aliased.JABS_Engine.set("initialize", JABS_Engine.prototype.initialize);
JABS_Engine.prototype.initialize = function(isMapTransfer = true) {
	J.ABS.EXT.DPS.Aliased.JABS_Engine.get("initialize").call(this, isMapTransfer);
	const { rollingWindowFrames } = J.ABS.EXT.DPS.Metadata;
	/**
	* The tracker measuring per-battler damage output across the current and previous encounters.
	* @type {JabsDpsTracker}
	*/
	this._dpsTracker = isMapTransfer ? this._dpsTracker ?? new JabsDpsTracker(rollingWindowFrames) : new JabsDpsTracker(rollingWindowFrames);
};
/**
* Gets the tracker measuring per-battler damage output.
* @returns {JabsDpsTracker}
*/
JABS_Engine.prototype.dpsTracker = function() {
	return this._dpsTracker;
};
/**
* Extends {@link JABS_Engine.prototype.update}.<br/>
* Also advances the damage tracker's combat clock.
*
* Hooked here rather than onto the map scene so the measurement runs whether or not the readout is
* installed- the numbers are the plugin, and the window is only one way of looking at them.
*/
J.ABS.EXT.DPS.Aliased.JABS_Engine.set("update", JABS_Engine.prototype.update);
JABS_Engine.prototype.update = function() {
	J.ABS.EXT.DPS.Aliased.JABS_Engine.get("update").call(this);
	this.dpsTracker().update();
};
/**
* Extends {@link JABS_Engine.prototype.postExecuteSkillEffects}.<br/>
* Also offers the landed hit to the damage tracker.
* @param {JABS_Action} action The action being executed.
* @param {JABS_Battler} target The target the skill effects were applied against.
*/
J.ABS.EXT.DPS.Aliased.JABS_Engine.set("postExecuteSkillEffects", JABS_Engine.prototype.postExecuteSkillEffects);
JABS_Engine.prototype.postExecuteSkillEffects = function(action, target) {
	J.ABS.EXT.DPS.Aliased.JABS_Engine.get("postExecuteSkillEffects").call(this, action, target);
	this.dpsTracker().handleSkillEffect(action, target);
};

//#endregion
//# sourceMappingURL=J-ABS-Dps.js.map