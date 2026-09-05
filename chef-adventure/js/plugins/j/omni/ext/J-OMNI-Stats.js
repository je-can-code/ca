//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 OMNI-STATS] Adds the Statistopedia to the Omnipedia.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-ABS-Metrics
 * @base J-Omnipedia
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-Metrics
 * @orderAfter J-Omnipedia
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin adds the "Statistopedia" to the Omnipedia: a read-only profile of
 * how this save has actually been played. Enemies felled, damage dealt and
 * taken, how often guard was raised and how often it mattered, which weapon has
 * done the most work, and where the player keeps dying.
 *
 * Nothing here changes gameplay. It observes and it reports.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; every combat moment reported here is a JABS event.
 * - J-ABS-Metrics; owns the twenty-six lifetime counters this reads.
 * - J-Omnipedia; the menu this adds a row to.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The numbers behind this screen live in two places on purpose.
 *
 * J-ABS-Metrics keeps twenty-six running counters in game variables, because a
 * variable is the one store an event page can branch on- which is what makes a
 * trophy or a milestone message possible with no code at all. Each of those is
 * a single number, and a single number is what a variable is good at.
 *
 * This plugin keeps a second, separate record for the questions that are not a
 * single number: kills per enemy, damage per weapon, deaths per map. There is
 * no arrangement of variables that answers those without reserving one variable
 * per row in the database, so they live in a model on the party instead.
 *
 * The two are not copies of each other. The variables hold the totals, the
 * model holds the breakdowns, and this screen reads both.
 *
 * ----------------------------------------------------------------------------
 * DERIVED VALUES:
 * Rates- crit rate, parry rate, accuracy- are computed when the screen draws
 * them, never stored. Each is a division of two counters that are both already
 * recorded, and keeping the quotient would create a third number able to fall
 * out of agreement with the two it came from.
 *
 * ============================================================================
 * CONTROLS:
 * L2 / R2 cycles between sections.
 * Cancel returns to the Omnipedia.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/omni/ext/stats/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-OMNI-Stats.
*
* The Statistopedia has no tunable behavior- it reports numbers other systems already record. What
* it does need is the same two things every Omnipedia entry needs: how its row presents itself in
* the root list, and the switch deciding whether that row is there at all.
*/
var J_OmniStats_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps the static command and switch metadata used by the statistopedia entry.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The various data points that define the command for the Statistopedia.
		*
		* The icon is a figure beside two graph traces, chosen out of the same green system-plate family
		* the Questopedia takes its checklist from- the pedias reading as one set in the root list matters
		* more than any one of them having the most literal icon available.
		*/
		this.Command = {
			Name: "Statistopedia",
			Symbol: "stats-pedia",
			IconIndex: 2563
		};
		/**
		* The id of the switch representing whether or not the command should be visible in the
		* Omnipedia menu.
		*
		* A player who has not fought anything yet would open the Statistopedia to a wall of zeroes,
		* which reads as a broken menu rather than an empty one- so the row is gated the same way every
		* other pedia is, and the game turns it on when there is something in it worth reading.
		* @type {number}
		*/
		this.EnabledSwitch = 111;
	}
};

//#endregion
//#region src/plugins/omni/ext/stats/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredOmniVersion = "1.0.0";
	const hasOmniRequirement = J.BASE.Helpers.satisfies(J.OMNI.Metadata.version.version(), requiredOmniVersion);
	if (hasOmniRequirement === false) {
		throw new Error(`Either missing J-Omnipedia or has a lower version than the required: ${requiredOmniVersion}`);
	}
})();
/**
* The over-arching extensions collection for this plugin.
*/
J.OMNI.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.OMNI.EXT.STATS = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.OMNI.EXT.STATS.Metadata = new J_OmniStats_PluginMetadata("J-OMNI-Stats", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.OMNI.EXT.STATS.Aliased = {};
J.OMNI.EXT.STATS.Aliased.Game_Map = new Map();
J.OMNI.EXT.STATS.Aliased.Game_Party = new Map();
J.OMNI.EXT.STATS.Aliased.JABS_Engine = new Map();
J.OMNI.EXT.STATS.Aliased.Scene_Omnipedia = new Map();
J.OMNI.EXT.STATS.Aliased.Window_OmnipediaList = new Map();

//#endregion
//#region src/plugins/omni/ext/stats/__models/StatistopediaRecords.js
/**
* The party's lifetime combat record, in the shapes a game variable cannot hold.
*
* J-ABS-Metrics already keeps twenty-six counters, and keeps them in variables on purpose: an event
* page can branch on a variable, which is what makes a trophy or a milestone message possible with
* no code at all. Every one of those is a single number, and a single number is exactly what a
* variable is good at.
*
* This model exists for the questions that are not a single number. "How many of those kills were
* bearcats" and "which weapon has dealt the most damage over this whole save" are keyed collections,
* and there is no arrangement of variables that answers them without reserving one variable per
* enemy in the database. So the two stores are not rivals and neither is a copy of the other- the
* variables hold the totals, this holds the breakdowns, and the Statistopedia reads both.
*
* Everything here is a raw observation. Nothing derived lives in this class: a crit rate is a
* division of two counters that are both already recorded, and storing the quotient creates a third
* number that can fall out of agreement with the two it came from. Rates are computed where they are
* displayed.
*/
var StatistopediaRecords = class {
	/**
	* How many of each enemy the party has defeated, keyed by database enemy id.
	*
	* Kept per-id rather than per-family because per-id is strictly more information: any grouping
	* worth showing- by family, by region, by whether the name starts with a bang- is a sum over these
	* at render time, and a grouping recorded directly could never be regrouped later.
	* @type {Map<number, number>}
	*/
	_killsByEnemyId = new Map();
	/**
	* Total hp damage the party has dealt while each weapon was equipped, keyed by database weapon id.
	*
	* Attributed to the weapon rather than the skill, because "favorite weapon" is a question about
	* what the player reaches for and a single weapon fires many different skills.
	* @type {Map<number, number>}
	*/
	_damageByWeaponId = new Map();
	/**
	* How many times each skill has been executed, keyed by database skill id.
	*
	* J-ABS-Metrics counts the same executions bucketed by which slot they came out of, which answers
	* "does this player lean on their mainhand" but cannot answer "which skill". Both are worth having
	* and neither derives from the other.
	* @type {Map<number, number>}
	*/
	_usageBySkillId = new Map();
	/**
	* How many enemies the party has defeated on each map, keyed by map id.
	* @type {Map<number, number>}
	*/
	_killsByMapId = new Map();
	/**
	* How many times the player has died on each map, keyed by map id.
	*
	* The map a player dies on repeatedly is the most useful single number in this whole model for
	* anyone tuning difficulty, which is why it is kept apart from the flat death count.
	* @type {Map<number, number>}
	*/
	_deathsByMapId = new Map();
	/**
	* Every map id the party has set foot on.
	*
	* A set rather than a counter, because the interesting number is how much of the world has been
	* seen- revisiting the same town a hundred times is not exploration.
	* @type {Set<number>}
	*/
	_visitedMapIds = new Set();
	/**
	* How many attacks the party has landed for damage.
	*
	* J-ABS-Metrics counts the damage those hits added up to and how many of them crit, but never the
	* hits themselves- so without this, a crit rate has a numerator and no denominator. It is the one
	* counter here that exists purely to make other numbers divisible.
	* @type {number}
	*/
	_hitsLanded = 0;
	/**
	* How many attacks have landed on the party for damage.
	*
	* The defensive mirror of {@link _hitsLanded}, and the denominator for the rate of crits taken.
	* @type {number}
	*/
	_hitsTaken = 0;
	/**
	* The most enemies defeated in a row without the player dying.
	* @type {number}
	*/
	_longestKillStreak = 0;
	/**
	* The streak currently running, which becomes a record only if it survives to beat the one above.
	* @type {number}
	*/
	_currentKillStreak = 0;
	/**
	* The most damage ever dealt past what was needed to kill something.
	*
	* Overkill is the stat that tells a player their build outgrew the content, and it is the one
	* superlative here with no defensive equivalent- there is no such thing as being killed extra.
	* @type {number}
	*/
	_biggestOverkill = 0;
	/**
	* The lowest hp the player has ever been reduced to and lived.
	*
	* Zero means no close call has been recorded yet rather than a survival at zero hp, which cannot
	* happen- reaching zero is what death is. The recorder tests for the zero explicitly rather than
	* seeding this at infinity, because infinity does not survive a round trip through JSON.
	* @type {number}
	*/
	_lowestHpSurvived = 0;
	/**
	* The party's lifetime kills, keyed by database enemy id.
	* @returns {Map<number, number>}
	*/
	killsByEnemyId() {
		return this._killsByEnemyId;
	}
	/**
	* Records one defeated enemy against its database id.
	* @param {number} enemyId The database id of the enemy that was defeated.
	*/
	addKillForEnemy(enemyId) {
		const kills = this.killsByEnemyId();
		const current = kills.get(enemyId) ?? 0;
		kills.set(enemyId, current + 1);
	}
	/**
	* The party's lifetime damage, keyed by the database id of the weapon that dealt it.
	* @returns {Map<number, number>}
	*/
	damageByWeaponId() {
		return this._damageByWeaponId;
	}
	/**
	* Adds damage onto the running total for a weapon.
	* @param {number} weaponId The database id of the weapon that was equipped.
	* @param {number} damage The hp damage that landed.
	*/
	addDamageForWeapon(weaponId, damage) {
		const damageTotals = this.damageByWeaponId();
		const current = damageTotals.get(weaponId) ?? 0;
		damageTotals.set(weaponId, current + damage);
	}
	/**
	* How many times each skill has been executed, keyed by database skill id.
	* @returns {Map<number, number>}
	*/
	usageBySkillId() {
		return this._usageBySkillId;
	}
	/**
	* Records one execution of a skill.
	* @param {number} skillId The database id of the skill that was executed.
	*/
	addUsageForSkill(skillId) {
		const usage = this.usageBySkillId();
		const current = usage.get(skillId) ?? 0;
		usage.set(skillId, current + 1);
	}
	/**
	* The party's kills, keyed by the map they happened on.
	* @returns {Map<number, number>}
	*/
	killsByMapId() {
		return this._killsByMapId;
	}
	/**
	* Records one defeated enemy against the map it fell on.
	* @param {number} mapId The map the kill happened on.
	*/
	addKillForMap(mapId) {
		const kills = this.killsByMapId();
		const current = kills.get(mapId) ?? 0;
		kills.set(mapId, current + 1);
	}
	/**
	* The player's deaths, keyed by the map they happened on.
	* @returns {Map<number, number>}
	*/
	deathsByMapId() {
		return this._deathsByMapId;
	}
	/**
	* Records one player death against the map it happened on.
	* @param {number} mapId The map the death happened on.
	*/
	addDeathForMap(mapId) {
		const deaths = this.deathsByMapId();
		const current = deaths.get(mapId) ?? 0;
		deaths.set(mapId, current + 1);
	}
	/**
	* Every map id the party has set foot on.
	* @returns {Set<number>}
	*/
	visitedMapIds() {
		return this._visitedMapIds;
	}
	/**
	* Records that the party has now been to a map.
	* @param {number} mapId The map that was entered.
	*/
	addVisitedMap(mapId) {
		this.visitedMapIds().add(mapId);
	}
	/**
	* How many attacks the party has landed for damage.
	* @returns {number}
	*/
	hitsLanded() {
		return this._hitsLanded;
	}
	/**
	* Sets how many attacks the party has landed for damage.
	* @param {number} value The new total.
	*/
	setHitsLanded(value) {
		this._hitsLanded = value;
	}
	/**
	* Records one landed attack.
	*/
	addHitLanded() {
		const landed = this.hitsLanded() + 1;
		this.setHitsLanded(landed);
	}
	/**
	* How many attacks have landed on the party for damage.
	* @returns {number}
	*/
	hitsTaken() {
		return this._hitsTaken;
	}
	/**
	* Sets how many attacks have landed on the party for damage.
	* @param {number} value The new total.
	*/
	setHitsTaken(value) {
		this._hitsTaken = value;
	}
	/**
	* Records one attack landing on the party.
	*/
	addHitTaken() {
		const taken = this.hitsTaken() + 1;
		this.setHitsTaken(taken);
	}
	/**
	* The most enemies ever defeated between two deaths.
	* @returns {number}
	*/
	longestKillStreak() {
		return this._longestKillStreak;
	}
	/**
	* Sets the longest kill streak on record.
	* @param {number} value The new record.
	*/
	setLongestKillStreak(value) {
		this._longestKillStreak = value;
	}
	/**
	* The streak currently running.
	* @returns {number}
	*/
	currentKillStreak() {
		return this._currentKillStreak;
	}
	/**
	* Sets the streak currently running.
	* @param {number} value The new running streak.
	*/
	setCurrentKillStreak(value) {
		this._currentKillStreak = value;
	}
	/**
	* Extends the running streak by one, promoting it to the record if it now beats the record.
	*
	* The promotion happens here rather than on death, because a player who is mid-streak and has
	* already passed their old best should see the new number immediately- waiting until they die to
	* acknowledge it would mean the menu disagrees with what just happened on screen.
	*/
	extendKillStreak() {
		const extended = this.currentKillStreak() + 1;
		this.setCurrentKillStreak(extended);
		if (extended <= this.longestKillStreak()) return;
		this.setLongestKillStreak(extended);
	}
	/**
	* Ends the running streak, leaving the record it may have set alone.
	*/
	breakKillStreak() {
		this.setCurrentKillStreak(0);
	}
	/**
	* The most damage ever dealt past a lethal blow.
	* @returns {number}
	*/
	biggestOverkill() {
		return this._biggestOverkill;
	}
	/**
	* Sets the biggest overkill on record.
	* @param {number} value The new record.
	*/
	setBiggestOverkill(value) {
		this._biggestOverkill = value;
	}
	/**
	* Records a candidate against the overkill record, keeping whichever is larger.
	* @param {number} overkill The damage dealt in excess of the target's remaining hp.
	*/
	recordOverkill(overkill) {
		if (overkill <= this.biggestOverkill()) return;
		this.setBiggestOverkill(overkill);
	}
	/**
	* The lowest hp the player has ever survived at, or zero if there is no record yet.
	* @returns {number}
	*/
	lowestHpSurvived() {
		return this._lowestHpSurvived;
	}
	/**
	* Sets the lowest hp ever survived at.
	* @param {number} value The new record.
	*/
	setLowestHpSurvived(value) {
		this._lowestHpSurvived = value;
	}
	/**
	* Records a candidate against the closest-call record, keeping whichever is lower.
	*
	* The first survival always takes the record regardless of how comfortable it was, because a
	* record of zero means "nothing recorded" rather than "survived at zero" - without that case a
	* minimum seeded at zero could never be beaten by any real value.
	* @param {number} remainingHp The hp the player was left standing on.
	*/
	recordHpSurvived(remainingHp) {
		if (remainingHp <= 0) return;
		const currentRecord = this.lowestHpSurvived();
		if (currentRecord === 0) {
			this.setLowestHpSurvived(remainingHp);
			return;
		}
		if (remainingHp >= currentRecord) return;
		this.setLowestHpSurvived(remainingHp);
	}
};
SerializableRegistry.register(StatistopediaRecords);

//#endregion
//#region src/plugins/omni/ext/stats/managers/StatistopediaRecorder.js
/**
* Files combat events into the party's {@link StatistopediaRecords}.
*
* This is the mirror of `JABS_MetricsManager`, and deliberately shaped like it: the engine hooks live
* in their own files and every one of them ends in a call to a static method here, so "what counts as
* an overkill" is answerable by reading one class instead of tracing an alias chain.
*
* The two recorders do not overlap. Metrics owns the lifetime counters that go into game variables so
* events can branch on them; this owns the keyed breakdowns and the superlatives, which have no
* variable form. Where a question needs both- a critical rate needs a count of crits from over there
* and a count of hits from over here- the arithmetic happens at render time in
* {@link StatistopediaService}, not in either store.
*/
var StatistopediaRecorder = class StatistopediaRecorder {
	/**
	* The hp each battler was standing on immediately before the hit currently being applied.
	*
	* Overkill is the only statistic here that cannot be computed after the fact: the engine clamps hp
	* at zero, so by the time a hit has landed, how far past zero it would have gone is gone with it.
	* Keyed by battler uuid rather than held as a single value, because applying a skill effect can
	* provoke retaliation that applies another one before the first has finished.
	* @type {Map<string, number>}
	*/
	static preHitHp = new Map();
	/**
	* Constructor.
	* A static class though, so don't build it.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* The party's record of everything a game variable cannot hold.
	* @returns {StatistopediaRecords}
	*/
	static records() {
		return $gameParty.getStatistopediaRecords();
	}
	/**
	* Remembers what a battler was standing on before a hit lands on it.
	* @param {JABS_Battler} target The battler about to be hit.
	*/
	static rememberPreHitHp(target) {
		const uuid = target.getUuid();
		const currentHp = target.getBattler().hp;
		StatistopediaRecorder.preHitHp.set(uuid, currentHp);
	}
	/**
	* Reads back and forgets what a battler was standing on before the hit that just landed.
	*
	* A battler with nothing remembered answers zero, which is what an overkill calculation reads as
	* "this hit did not have further to go than the target had hp" - the safe direction to be wrong in
	* for a record that only ever moves upward.
	* @param {JABS_Battler} target The battler that was hit.
	* @returns {number}
	*/
	static takePreHitHp(target) {
		const uuid = target.getUuid();
		const remembered = StatistopediaRecorder.preHitHp.get(uuid) ?? 0;
		StatistopediaRecorder.preHitHp.delete(uuid);
		return remembered;
	}
	/**
	* Records a hit the party landed on an enemy.
	*
	* The conditions reaching this method are deliberately identical to the ones J-ABS-Metrics counts
	* its crits under. A critical rate divides one by the other, so a denominator counted under looser
	* rules than its numerator would produce a rate that could exceed one hundred percent.
	* @param {JABS_Action} action The action that landed.
	* @param {JABS_Battler} target The enemy that was struck.
	*/
	static trackHitLanded(action, target) {
		const records = StatistopediaRecorder.records();
		const { hpDamage } = target.getBattler().result();
		records.addHitLanded();
		const hpBefore = StatistopediaRecorder.takePreHitHp(target);
		const overkill = hpDamage - hpBefore;
		if (overkill > 0) {
			records.recordOverkill(overkill);
		}
		StatistopediaRecorder.trackWeaponDamage(action, hpDamage);
	}
	/**
	* Attributes damage to whatever the player was holding when they dealt it.
	*
	* Only the player's damage is attributed. An ally's contribution is real, but "favorite weapon" is
	* a question about what the person holding the controller reaches for, and folding in a weapon the
	* ally AI chose would answer a question nobody asked.
	* @param {JABS_Action} action The action that landed.
	* @param {number} hpDamage The damage it dealt.
	*/
	static trackWeaponDamage(action, hpDamage) {
		const caster = action.getCaster();
		if (caster.isPlayer() === false) return;
		const equippedWeapons = caster.getBattler().weapons();
		if (equippedWeapons.length === 0) return;
		const weapon = equippedWeapons.at(0);
		StatistopediaRecorder.records().addDamageForWeapon(weapon.id, hpDamage);
	}
	/**
	* Records a hit that landed on the party.
	* @param {JABS_Battler} target The ally that was struck.
	*/
	static trackHitTaken(target) {
		const records = StatistopediaRecorder.records();
		records.addHitTaken();
		const remainingHp = target.getBattler().hp;
		records.recordHpSurvived(remainingHp);
		StatistopediaRecorder.takePreHitHp(target);
	}
	/**
	* Records a defeated enemy against its database id, the map it fell on, and the running streak.
	* @param {JABS_Battler} defeatedTarget The battler that was defeated.
	*/
	static trackDefeatedEnemy(defeatedTarget) {
		if (defeatedTarget.isInanimate() === true) return;
		const records = StatistopediaRecorder.records();
		const mapId = $gameMap.mapId();
		records.addKillForEnemy(defeatedTarget.battlerId());
		records.addKillForMap(mapId);
		records.extendKillStreak();
	}
	/**
	* Records the player's death against the map it happened on, and ends the running streak.
	*/
	static trackDefeatedPlayer() {
		const records = StatistopediaRecorder.records();
		const mapId = $gameMap.mapId();
		records.addDeathForMap(mapId);
		records.breakKillStreak();
	}
	/**
	* Records which skill the player just executed.
	* @param {JABS_Action} action The action that was executed.
	*/
	static trackSkillUsage(action) {
		const skill = action.getBaseSkill();
		StatistopediaRecorder.records().addUsageForSkill(skill.id);
	}
	/**
	* Records that the party has now set foot on a map.
	* @param {number} mapId The map that was entered.
	*/
	static trackVisitedMap(mapId) {
		StatistopediaRecorder.records().addVisitedMap(mapId);
	}
};

//#endregion
//#region src/plugins/omni/ext/stats/managers/StatistopediaService.js
/**
* Turns two very different stores into one list of labelled rows.
*
* The Statistopedia has no data of its own. Its numbers come from J-ABS-Metrics' game variables and
* from the party's {@link StatistopediaRecords}, and reconciling those two shapes is the entire job
* of this class. It exists as a service rather than as window code because a window that computes
* what it draws cannot be tested without standing one up, and every rate in here is arithmetic worth
* asserting on directly.
*
* Rows are built, never drawn. The window iterates whatever comes back and knows nothing about what
* any of it means.
*/
var StatistopediaService = class StatistopediaService {
	/**
	* The value shown where a number cannot honestly be computed yet.
	*
	* A rate with nothing in its denominator is not zero- zero percent is a claim about a player who
	* tried and failed, and showing it to someone who has not swung yet is a lie the menu tells on its
	* own behalf.
	* @type {string}
	*/
	static NO_DATA = "n/a";
	/**
	* The sections the Statistopedia pages through, in the order they are presented.
	*
	* The order is a narrowing: what you did, how you held up, what you reached for, what you set a
	* record at, and where you were when it happened.
	* @type {Array<{key: string, name: string, iconIndex: number}>}
	*/
	static SECTIONS = [
		{
			key: "combat",
			name: "Combat",
			iconIndex: 77
		},
		{
			key: "defense",
			name: "Defense",
			iconIndex: 81
		},
		{
			key: "usage",
			name: "Habits",
			iconIndex: 79
		},
		{
			key: "records",
			name: "Records",
			iconIndex: 87
		},
		{
			key: "world",
			name: "World",
			iconIndex: 190
		}
	];
	/**
	* Constructor.
	* A static class though, so don't build it.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* The sections available to page through.
	* @returns {Array<{key: string, name: string, iconIndex: number}>}
	*/
	static sections() {
		return StatistopediaService.SECTIONS;
	}
	/**
	* Builds the rows for one section.
	*
	* An unrecognized key yields no rows rather than throwing, because the only thing that can supply
	* a key is the section list above- so a miss means the cycle and this switch have drifted apart,
	* and a blank panel says that more usefully at runtime than a crash does.
	* @param {string} sectionKey The key of the section to build.
	* @returns {Array<{label: string, value: string}>}
	*/
	static rowsFor(sectionKey) {
		switch (sectionKey) {
			case "combat": return StatistopediaService.combatRows();
			case "defense": return StatistopediaService.defenseRows();
			case "usage": return StatistopediaService.usageRows();
			case "records": return StatistopediaService.recordsRows();
			case "world": return StatistopediaService.worldRows();
			default: return [];
		}
	}
	/**
	* What the party has done to everything else.
	* @returns {Array<{label: string, value: string}>}
	*/
	static combatRows() {
		const metadata = StatistopediaService.metricsMetadata();
		const records = StatistopediaService.records();
		const kills = StatistopediaService.counter(metadata.enemiesDefeatedVariableId);
		const damageDealt = StatistopediaService.counter(metadata.totalDamageDealtVariableId);
		const crits = StatistopediaService.counter(metadata.numberOfCritsDealtVariableId);
		const evadedByEnemies = StatistopediaService.counter(metadata.attacksEvadedByEnemiesVariableId);
		const hits = records.hitsLanded();
		const swings = hits + evadedByEnemies;
		return [
			StatistopediaService.countRow("Enemies Defeated", kills),
			StatistopediaService.countRow("Total Damage Dealt", damageDealt),
			StatistopediaService.countRow("Biggest Hit", StatistopediaService.counter(metadata.highestDamageDealtVariableId)),
			StatistopediaService.countRow("Critical Hits Landed", crits),
			StatistopediaService.countRow("Biggest Critical", StatistopediaService.counter(metadata.biggestCritDealtVariableId)),
			StatistopediaService.rateRow("Critical Rate", crits, hits),
			StatistopediaService.rateRow("Accuracy", hits, swings),
			StatistopediaService.averageRow("Damage per Kill", damageDealt, kills)
		];
	}
	/**
	* What everything else has done to the party.
	* @returns {Array<{label: string, value: string}>}
	*/
	static defenseRows() {
		const metadata = StatistopediaService.metricsMetadata();
		const records = StatistopediaService.records();
		const parries = StatistopediaService.counter(metadata.numberOfParriesVariableId);
		const preciseParries = StatistopediaService.counter(metadata.numberOfPreciseParriesVariableId);
		const guardedHits = StatistopediaService.counter(metadata.numberOfGuardedHitsVariableId);
		const prevented = StatistopediaService.counter(metadata.damagePreventedByGuardingVariableId);
		const critsTaken = StatistopediaService.counter(metadata.numberOfCritsTakenVariableId);
		const passiveParries = parries - preciseParries;
		return [
			StatistopediaService.countRow("Deaths", StatistopediaService.counter(metadata.numberOfDeathsVariableId)),
			StatistopediaService.countRow("Allies Downed", StatistopediaService.counter(metadata.alliesDownedVariableId)),
			StatistopediaService.countRow("Total Damage Taken", StatistopediaService.counter(metadata.totalDamageTakenVariableId)),
			StatistopediaService.countRow("Worst Hit Taken", StatistopediaService.counter(metadata.highestDamageTakenVariableId)),
			StatistopediaService.countRow("Critical Hits Taken", critsTaken),
			StatistopediaService.rateRow("Critical Rate Against You", critsTaken, records.hitsTaken()),
			StatistopediaService.countRow("Parries", parries),
			StatistopediaService.countRow("Parries on Purpose", preciseParries),
			StatistopediaService.countRow("Parries by Luck", passiveParries),
			StatistopediaService.countRow("Glancing Blows", StatistopediaService.counter(metadata.numberOfGlancingBlowsVariableId)),
			StatistopediaService.countRow("Attacks Evaded", StatistopediaService.counter(metadata.attacksEvadedByPartyVariableId)),
			StatistopediaService.countRow("Damage Stopped by Guarding", prevented),
			StatistopediaService.averageRow("Stopped per Guarded Hit", prevented, guardedHits)
		];
	}
	/**
	* What the party reaches for.
	* @returns {Array<{label: string, value: string}>}
	*/
	static usageRows() {
		const metadata = StatistopediaService.metricsMetadata();
		return [
			StatistopediaService.countRow("Mainhand Swings", StatistopediaService.counter(metadata.mainhandSkillUsageVariableId)),
			StatistopediaService.countRow("Offhand Swings", StatistopediaService.counter(metadata.offhandSkillUsageVariableId)),
			StatistopediaService.countRow("Equipped Skills Used", StatistopediaService.counter(metadata.assignedSkillUsageVariableId)),
			StatistopediaService.countRow("Dodges", StatistopediaService.counter(metadata.dodgeSkillUsageVariableId)),
			StatistopediaService.countRow("Guards Raised", StatistopediaService.counter(metadata.guardActivationsVariableId)),
			StatistopediaService.countRow("Tools Used", StatistopediaService.counter(metadata.toolUsageVariableId)),
			StatistopediaService.countRow("Items Used", StatistopediaService.counter(metadata.usableItemUsageVariableId))
		];
	}
	/**
	* The superlatives: the single best number the party ever put up.
	* @returns {Array<{label: string, value: string}>}
	*/
	static recordsRows() {
		const records = StatistopediaService.records();
		const closestCall = records.lowestHpSurvived();
		return [
			StatistopediaService.countRow("Longest Kill Streak", records.longestKillStreak()),
			StatistopediaService.countRow("Current Kill Streak", records.currentKillStreak()),
			StatistopediaService.countRow("Biggest Overkill", records.biggestOverkill()),
			StatistopediaService.closestCallRow(closestCall),
			StatistopediaService.favoriteWeaponRow(),
			StatistopediaService.favoriteSkillRow(),
			StatistopediaService.nemesisRow()
		];
	}
	/**
	* Where all of it happened.
	* @returns {Array<{label: string, value: string}>}
	*/
	static worldRows() {
		const metadata = StatistopediaService.metricsMetadata();
		const records = StatistopediaService.records();
		const visited = records.visitedMapIds();
		return [
			StatistopediaService.countRow("Places Visited", visited.size),
			StatistopediaService.countRow("Steps Taken", $gameParty.steps()),
			StatistopediaService.countRow("Things Broken", StatistopediaService.counter(metadata.destructiblesDestroyedVariableId)),
			StatistopediaService.deadliestPlaceRow(),
			StatistopediaService.busiestPlaceRow()
		];
	}
	/**
	* Builds the closest-call row, which reads differently before the first one happens.
	* @param {number} closestCall The lowest hp ever survived at, or zero if there is none yet.
	* @returns {{label: string, value: string}}
	*/
	static closestCallRow(closestCall) {
		if (closestCall === 0) {
			return StatistopediaService.row("Closest Call", StatistopediaService.NO_DATA);
		}
		return StatistopediaService.row("Closest Call", `${StatistopediaService.number(closestCall)} hp`);
	}
	/**
	* Builds the row naming whichever weapon has dealt the most damage.
	* @returns {{label: string, value: string}}
	*/
	static favoriteWeaponRow() {
		const records = StatistopediaService.records();
		const leader = StatistopediaService.largestEntry(records.damageByWeaponId());
		if (leader === null) {
			return StatistopediaService.row("Favorite Weapon", StatistopediaService.NO_DATA);
		}
		const weapon = $dataWeapons.at(leader.key);
		const damage = StatistopediaService.number(leader.value);
		return StatistopediaService.row("Favorite Weapon", `${weapon.name} (${damage})`);
	}
	/**
	* Builds the row naming whichever skill has been used the most.
	* @returns {{label: string, value: string}}
	*/
	static favoriteSkillRow() {
		const records = StatistopediaService.records();
		const leader = StatistopediaService.largestEntry(records.usageBySkillId());
		if (leader === null) {
			return StatistopediaService.row("Most-Used Skill", StatistopediaService.NO_DATA);
		}
		const skill = $dataSkills.at(leader.key);
		const uses = StatistopediaService.number(leader.value);
		return StatistopediaService.row("Most-Used Skill", `${skill.name} (${uses})`);
	}
	/**
	* Builds the row naming whichever enemy the party has killed the most of.
	* @returns {{label: string, value: string}}
	*/
	static nemesisRow() {
		const records = StatistopediaService.records();
		const leader = StatistopediaService.largestEntry(records.killsByEnemyId());
		if (leader === null) {
			return StatistopediaService.row("Most Slain", StatistopediaService.NO_DATA);
		}
		const enemy = $dataEnemies.at(leader.key);
		const kills = StatistopediaService.number(leader.value);
		return StatistopediaService.row("Most Slain", `${enemy.name} (${kills})`);
	}
	/**
	* Builds the row naming wherever the player has died the most.
	* @returns {{label: string, value: string}}
	*/
	static deadliestPlaceRow() {
		const records = StatistopediaService.records();
		const leader = StatistopediaService.largestEntry(records.deathsByMapId());
		if (leader === null) {
			return StatistopediaService.row("Deadliest Place", StatistopediaService.NO_DATA);
		}
		const name = StatistopediaService.mapName(leader.key);
		const deaths = StatistopediaService.number(leader.value);
		return StatistopediaService.row("Deadliest Place", `${name} (${deaths})`);
	}
	/**
	* Builds the row naming wherever the party has killed the most.
	* @returns {{label: string, value: string}}
	*/
	static busiestPlaceRow() {
		const records = StatistopediaService.records();
		const leader = StatistopediaService.largestEntry(records.killsByMapId());
		if (leader === null) {
			return StatistopediaService.row("Busiest Hunting Ground", StatistopediaService.NO_DATA);
		}
		const name = StatistopediaService.mapName(leader.key);
		const kills = StatistopediaService.number(leader.value);
		return StatistopediaService.row("Busiest Hunting Ground", `${name} (${kills})`);
	}
	/**
	* The metadata naming which variable holds which lifetime counter.
	* @returns {JAbsMetrics_PluginMetadata}
	*/
	static metricsMetadata() {
		return J.ABS.EXT.METRICS.Metadata;
	}
	/**
	* The party's record of everything a variable cannot hold.
	* @returns {StatistopediaRecords}
	*/
	static records() {
		return $gameParty.getStatistopediaRecords();
	}
	/**
	* Reads one of J-ABS-Metrics' lifetime counters.
	* @param {number} variableId The variable holding the counter.
	* @returns {number}
	*/
	static counter(variableId) {
		return $gameVariables.value(variableId);
	}
	/**
	* Builds a row from a label and an already-formatted value.
	* @param {string} label The name of the statistic.
	* @param {string} value The value as it should be read.
	* @returns {{label: string, value: string}}
	*/
	static row(label, value) {
		return {
			label,
			value
		};
	}
	/**
	* Builds a row from a raw count.
	* @param {string} label The name of the statistic.
	* @param {number} count The count to present.
	* @returns {{label: string, value: string}}
	*/
	static countRow(label, count) {
		const formatted = StatistopediaService.number(count);
		return StatistopediaService.row(label, formatted);
	}
	/**
	* Builds a row presenting one count as a percentage of another.
	* @param {string} label The name of the statistic.
	* @param {number} numerator The count being measured.
	* @param {number} denominator The count it is measured against.
	* @returns {{label: string, value: string}}
	*/
	static rateRow(label, numerator, denominator) {
		if (denominator === 0) {
			return StatistopediaService.row(label, StatistopediaService.NO_DATA);
		}
		const percentage = numerator / denominator * 100;
		return StatistopediaService.row(label, `${percentage.toFixed(1)}%`);
	}
	/**
	* Builds a row presenting the average of one count across another.
	* @param {string} label The name of the statistic.
	* @param {number} total The running total being spread.
	* @param {number} occurrences How many times it was spread across.
	* @returns {{label: string, value: string}}
	*/
	static averageRow(label, total, occurrences) {
		if (occurrences === 0) {
			return StatistopediaService.row(label, StatistopediaService.NO_DATA);
		}
		const average = Math.round(total / occurrences);
		return StatistopediaService.countRow(label, average);
	}
	/**
	* Finds the largest entry in a keyed tally.
	*
	* Ties resolve to whichever key the map met first, which is insertion order- the enemy you started
	* killing earlier wins a dead heat. Nothing better presents itself, and a tie between two counts
	* this large is not a thing a player will ever witness.
	*
	* This is the one place in this class that returns null, because "no entries" is genuinely
	* different from "an entry whose value is zero" and every caller renders the two differently.
	* @param {Map<number, number>} tally The keyed tally to search.
	* @returns {{key: number, value: number}|null} The largest entry, or null when there are none.
	*/
	static largestEntry(tally) {
		let leader = null;
		tally.forEach((value, key) => {
			if (leader !== null && value <= leader.value) return;
			leader = {
				key,
				value
			};
		});
		return leader;
	}
	/**
	* Resolves a map id into the name a player would recognize.
	*
	* The display name is preferred because that is the one shown on screen when the player arrives;
	* the editor name is the fallback for maps that never set one.
	* @param {number} mapId The map to name.
	* @returns {string}
	*/
	static mapName(mapId) {
		const info = $dataMapInfos.at(mapId);
		const displayName = $gameMap.displayName();
		if (mapId === $gameMap.mapId() && displayName !== String.empty) {
			return displayName;
		}
		return info.name;
	}
	/**
	* Formats a number for reading rather than for arithmetic.
	* @param {number} value The number to format.
	* @returns {string}
	*/
	static number(value) {
		return value.toLocaleString();
	}
};

//#endregion
//#region src/plugins/omni/ext/stats/objects/Game_Party.js
/**
* Extends {@link #initOmnipediaMembers}.<br/>
* Includes the statistopedia's records.
*/
J.OMNI.EXT.STATS.Aliased.Game_Party.set("initOmnipediaMembers", Game_Party.prototype.initOmnipediaMembers);
Game_Party.prototype.initOmnipediaMembers = function() {
	J.OMNI.EXT.STATS.Aliased.Game_Party.get("initOmnipediaMembers").call(this);
	this.initStatistopediaMembers();
};
/**
* Initialize members related to the omnipedia's statistopedia.
*/
Game_Party.prototype.initStatistopediaMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The grouping of all properties related to the omnipedia.
	*/
	this._j._omni ||= {};
	/**
	* The party's lifetime record of everything a game variable cannot hold.
	*
	* A single instance rather than a keyed collection of saveables, because unlike the monsterpedia
	* there is nothing here to enumerate- the party has exactly one combat history.
	* @type {StatistopediaRecords}
	*/
	this._j._omni._statistopediaRecords = new StatistopediaRecords();
};
/**
* Gets the party's statistopedia records.
* @returns {StatistopediaRecords}
*/
Game_Party.prototype.getStatistopediaRecords = function() {
	return this._j._omni._statistopediaRecords;
};

//#endregion
//#region src/plugins/omni/ext/stats/objects/Game_Map.js
/**
* Extends {@link #setup}.<br/>
* Also files the map as somewhere the party has now been.
*
* Recorded on setup rather than on transfer because setup is the one path every arrival takes-
* a transfer, a new game, and a save loaded directly onto a map all end up here.
* @param {number} mapId The id of the map being set up.
*/
J.OMNI.EXT.STATS.Aliased.Game_Map.set("setup", Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId) {
	J.OMNI.EXT.STATS.Aliased.Game_Map.get("setup").call(this, mapId);
	StatistopediaRecorder.trackVisitedMap(mapId);
};

//#endregion
//#region src/plugins/omni/ext/stats/managers/JABS_Engine.js
/**
* Extends {@link #preExecuteSkillEffects}.<br/>
* Also remembers what the target was standing on before the hit lands.
*
* Overkill is the reason this hook is aliased at all. The engine clamps hp at zero, so once a lethal
* blow has been applied there is no longer any record of how much further it would have gone- the
* only moment that number exists is the one before the damage is dealt.
* @param {JABS_Action} action The action being executed.
* @param {JABS_Battler} target The target the skill effects are about to be applied against.
*/
J.OMNI.EXT.STATS.Aliased.JABS_Engine.set("preExecuteSkillEffects", JABS_Engine.prototype.preExecuteSkillEffects);
JABS_Engine.prototype.preExecuteSkillEffects = function(action, target) {
	J.OMNI.EXT.STATS.Aliased.JABS_Engine.get("preExecuteSkillEffects").call(this, action, target);
	StatistopediaRecorder.rememberPreHitHp(target);
};
/**
* Extends {@link #postExecuteSkillEffects}.<br/>
* Also files the outcome of the hit into the statistopedia's records.
*
* The item-slot exclusion mirrors J-ABS-Metrics exactly, and it has to: the counters this produces
* are the denominators for rates whose numerators live over there, so a hit counted here under
* looser rules than the crit counted there would produce a rate above one hundred percent.
* @param {JABS_Action} action The action being executed.
* @param {JABS_Battler} target The target the skill effects were applied against.
*/
J.OMNI.EXT.STATS.Aliased.JABS_Engine.set("postExecuteSkillEffects", JABS_Engine.prototype.postExecuteSkillEffects);
JABS_Engine.prototype.postExecuteSkillEffects = function(action, target) {
	J.OMNI.EXT.STATS.Aliased.JABS_Engine.get("postExecuteSkillEffects").call(this, action, target);
	const cooldownType = action.getCooldownType();
	if (JABS_MetricsManager.isItemSlot(cooldownType)) return;
	const { hpDamage } = target.getBattler().result();
	if (hpDamage <= 0) return;
	if (target.isEnemy()) {
		StatistopediaRecorder.trackHitLanded(action, target);
	} else if (target.isActor()) {
		StatistopediaRecorder.trackHitTaken(target);
	}
};
/**
* Extends {@link #handleDefeatedEnemy}.<br/>
* Also files the kill against the enemy, the map, and the running streak.
* @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
* @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
*/
J.OMNI.EXT.STATS.Aliased.JABS_Engine.set("handleDefeatedEnemy", JABS_Engine.prototype.handleDefeatedEnemy);
JABS_Engine.prototype.handleDefeatedEnemy = function(defeatedTarget, caster) {
	J.OMNI.EXT.STATS.Aliased.JABS_Engine.get("handleDefeatedEnemy").call(this, defeatedTarget, caster);
	StatistopediaRecorder.trackDefeatedEnemy(defeatedTarget);
};
/**
* Extends {@link #handleDefeatedPlayer}.<br/>
* Also files the death against the map and ends the running streak.
*
* The record is taken before the original logic rather than after, matching J-ABS-Metrics and for the
* same reason: handling a defeated player is what triggers the game over, so there is no guarantee
* the rest of the function returns.
*/
J.OMNI.EXT.STATS.Aliased.JABS_Engine.set("handleDefeatedPlayer", JABS_Engine.prototype.handleDefeatedPlayer);
JABS_Engine.prototype.handleDefeatedPlayer = function() {
	StatistopediaRecorder.trackDefeatedPlayer();
	J.OMNI.EXT.STATS.Aliased.JABS_Engine.get("handleDefeatedPlayer").call(this);
};
/**
* Extends {@link #executeMapAction}.<br/>
* Also files which skill the player reached for.
* @param {JABS_Battler} caster The battler executing the action.
* @param {JABS_Action} action The action being executed.
* @param {number?} targetX The target's `x` coordinate, if applicable.
* @param {number?} targetY The target's `y` coordinate, if applicable.
*/
J.OMNI.EXT.STATS.Aliased.JABS_Engine.set("executeMapAction", JABS_Engine.prototype.executeMapAction);
JABS_Engine.prototype.executeMapAction = function(caster, action, targetX, targetY) {
	J.OMNI.EXT.STATS.Aliased.JABS_Engine.get("executeMapAction").call(this, caster, action, targetX, targetY);
	if (caster.isPlayer() === false) return;
	StatistopediaRecorder.trackSkillUsage(action);
};

//#endregion
//#region src/plugins/omni/ext/stats/windows/Window_StatistopediaDetail.js
/**
* The panel of labelled statistics for whichever section is currently selected.
*
* Every row it draws arrives finished from {@link StatistopediaService}: a label and a value, both
* already strings. This window resolves nothing, computes nothing, and formats nothing- which is
* what makes the numbers testable without standing a scene up.
*
* It is a command window rather than a plain one so that long sections scroll on their own, which
* matters because the section list is expected to grow and no section should ever need a layout
* decision made about it individually.
*/
var Window_StatistopediaDetail = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect A rectangle that represents the shape of this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link #initMembers}.<br/>
	* Seeds the section this panel is reporting on.
	*
	* The section has to be established here rather than in the constructor body, because the base
	* class finishes by refreshing- and refreshing is what calls {@link makeCommandList}. A field
	* assigned after `super()` returns would be assigned after the rows were already built against
	* nothing.
	*/
	initMembers() {
		/**
		* The key of the section currently being reported.
		*
		* Seeded to the first section rather than to an empty string so the very first draw shows real
		* content; an empty key would build an empty panel that the player would see for one frame.
		* @type {string}
		*/
		this._sectionKey = StatistopediaService.sections().at(0).key;
	}
	/**
	* The key of the section currently being reported.
	* @returns {string}
	*/
	sectionKey() {
		return this._sectionKey;
	}
	/**
	* Points this panel at a different section.
	* @param {string} sectionKey The key of the section to report on.
	*/
	setSectionKey(sectionKey) {
		this._sectionKey = sectionKey;
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Builds one row per statistic in the active section.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds a command for every statistic in the active section.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const activeSection = this.sectionKey();
		const rows = StatistopediaService.rowsFor(activeSection);
		return rows.map(this.buildCommand, this);
	}
	/**
	* Builds a single row: the name of the statistic on the left, its value on the right.
	* @param {{label: string, value: string}} row The row driving this step.
	* @returns {BuiltWindowCommand}
	*/
	buildCommand(row) {
		const { label, value } = row;
		return new WindowCommandBuilder(label).setSymbol(label).setRightText(value).build();
	}
};

//#endregion
//#region src/plugins/omni/ext/stats/scenes/Scene_Statistopedia.js
/**
* A scene reporting how this save has actually been played.
*
* Built on the facet skeleton rather than laid out from scratch, so it inherits the same help area,
* the same control legend across the bottom, and the same bounded region every other menu in the
* ecosystem draws inside. There is one strip naming the current section and one panel of rows
* beneath it, and that is the entire scene- there is nothing here to select and nothing to change.
*/
var Scene_Statistopedia = class extends Scene_MenuFacetBase {
	/**
	* Constructor.
	*/
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes the statistopedia's own members.
	*/
	initMembers() {
		super.initMembers();
		/**
		* A grouping of all properties associated with the statistopedia.
		*/
		this._j._omni = {};
		this._j._omni._stats = {};
		/**
		* The L2/R2 ring of sections this scene pages through.
		* @type {FilterCycle}
		*/
		this._j._omni._stats._sectionFilter = new FilterCycle(StatistopediaService.sections());
		/**
		* The strip naming whichever section is currently being read.
		* @type {Window_FilterStrip}
		*/
		this._j._omni._stats._sectionStrip = null;
		/**
		* The panel of rows for the current section.
		* @type {Window_StatistopediaDetail}
		*/
		this._j._omni._stats._detail = null;
	}
	/**
	* Extends {@link #create}.<br/>
	* Also creates this scene's own windows.
	*/
	create() {
		super.create();
		this.createSectionStripWindow();
		this.createDetailWindow();
		this.applyActiveSection();
		this.getDetailWindow().activate();
	}
	/**
	* Overrides {@link #commandColumnRatio}.<br/>
	* Widens the base's command column to half the screen.
	*
	* The base ratio suits a column of commands standing beside a detail pane. This scene has no such
	* pane- the panel is the whole content- so it needs more than a column and much less than the
	* screen. At full width a row puts its label against the left edge and its value against the right
	* with a runway of nothing between them, and the eye has to travel the whole way to pair the two.
	* @returns {number}
	*/
	commandColumnRatio() {
		return .5;
	}
	/**
	* The horizontal origin that centers this scene's panel in the region it was given.
	* @returns {number}
	*/
	panelX() {
		const facetArea = this.facetAreaRect();
		const width = this.commandColumnWidth();
		return facetArea.x + Math.floor((facetArea.width - width) / 2);
	}
	/**
	* The number of rows in the largest section.
	*
	* The panel is sized to the section that needs the most room rather than to the one on screen, so
	* that walking the ring resizes nothing. A window that grew and shrank under the player as they
	* pressed a shoulder button would read as the menu flinching.
	* @returns {number}
	*/
	largestSectionRowCount() {
		const sections = StatistopediaService.sections();
		const rowCounts = sections.map((section) => StatistopediaService.rowsFor(section.key).length);
		return Math.max(...rowCounts);
	}
	/**
	* Creates the strip naming the active section.
	*/
	createSectionStripWindow() {
		const window = this.buildSectionStripWindow();
		this.setSectionStripWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the section strip window.
	* @returns {Window_FilterStrip}
	*/
	buildSectionStripWindow() {
		const rectangle = this.sectionStripRectangle();
		return new Window_FilterStrip(rectangle);
	}
	/**
	* The rectangle for the section strip, pinned across the top of the region this scene owns.
	* @returns {Rectangle}
	*/
	sectionStripRectangle() {
		const facetArea = this.facetAreaRect();
		const height = this.calcWindowHeight(1, false);
		return new Rectangle(this.panelX(), facetArea.y, this.commandColumnWidth(), height);
	}
	/**
	* Gets the currently tracked section strip window.
	* @returns {Window_FilterStrip}
	*/
	getSectionStripWindow() {
		return this._j._omni._stats._sectionStrip;
	}
	/**
	* Sets the currently tracked section strip window.
	* @param {Window_FilterStrip} stripWindow The section strip window driving this step.
	*/
	setSectionStripWindow(stripWindow) {
		this._j._omni._stats._sectionStrip = stripWindow;
	}
	/**
	* Creates the panel of rows for the active section.
	*/
	createDetailWindow() {
		const window = this.buildDetailWindow();
		this.setDetailWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the detail window.
	* @returns {Window_StatistopediaDetail}
	*/
	buildDetailWindow() {
		const rectangle = this.detailRectangle();
		const window = new Window_StatistopediaDetail(rectangle);
		window.setHandler("cancel", this.onCancelStatistopedia.bind(this));
		window.setHandler("content-next", this.cycleSections.bind(this, true));
		window.setHandler("content-prev", this.cycleSections.bind(this, false));
		return window;
	}
	/**
	* The rectangle for the detail panel, filling whatever the strip left behind.
	* @returns {Rectangle}
	*/
	detailRectangle() {
		const facetArea = this.facetAreaRect();
		const stripRectangle = this.sectionStripRectangle();
		const y = stripRectangle.y + stripRectangle.height;
		const available = facetArea.height - stripRectangle.height;
		const wanted = this.calcWindowHeight(this.largestSectionRowCount(), false);
		const height = Math.min(wanted, available);
		return new Rectangle(this.panelX(), y, this.commandColumnWidth(), height);
	}
	/**
	* Gets the currently tracked detail window.
	* @returns {Window_StatistopediaDetail}
	*/
	getDetailWindow() {
		return this._j._omni._stats._detail;
	}
	/**
	* Sets the currently tracked detail window.
	* @param {Window_StatistopediaDetail} detailWindow The detail window driving this step.
	*/
	setDetailWindow(detailWindow) {
		this._j._omni._stats._detail = detailWindow;
	}
	/**
	* The section ring this scene pages through.
	* @returns {FilterCycle}
	*/
	getSectionFilter() {
		return this._j._omni._stats._sectionFilter;
	}
	/**
	* Points the strip and the panel at whichever section is now selected.
	*/
	applyActiveSection() {
		const sectionFilter = this.getSectionFilter();
		const activePosition = sectionFilter.activePosition();
		this.getSectionStripWindow().setPosition(activePosition);
		const detailWindow = this.getDetailWindow();
		detailWindow.setSectionKey(activePosition.key);
		detailWindow.refresh();
		detailWindow.select(0);
	}
	/**
	* Walks the section ring, wrapping at either end.
	* @param {boolean} isForward Whether to walk forwards.
	*/
	cycleSections(isForward) {
		const sectionFilter = this.getSectionFilter();
		if (isForward) {
			sectionFilter.next();
		} else {
			sectionFilter.previous();
		}
		this.applyActiveSection();
		this.getDetailWindow().activate();
	}
	/**
	* Closes the statistopedia and returns to the omnipedia.
	*/
	onCancelStatistopedia() {
		SceneManager.pop();
	}
	/**
	* Implements {@link #controlLegendEntries}.<br/>
	* Teaches the one control that leaves no mark on screen until it is pressed.
	*
	* A player who never tries the shoulder triggers never learns there are other sections at all,
	* which is the only thing about this scene that is not self-evident from looking at it.
	* @returns {{semantic: (string|string[]), label: string}[]}
	*/
	controlLegendEntries() {
		return [{
			semantic: ["content-prev", "content-next"],
			label: "section"
		}];
	}
};

//#endregion
//#region src/plugins/omni/ext/stats/windows/Window_OmnipediaList.js
/**
* Extends {@link #buildCommands}.<br/>
* Adds the statistopedia command to the list of commands in the omnipedia.
*/
J.OMNI.EXT.STATS.Aliased.Window_OmnipediaList.set("buildCommands", Window_OmnipediaList.prototype.buildCommands);
Window_OmnipediaList.prototype.buildCommands = function() {
	const originalCommands = J.OMNI.EXT.STATS.Aliased.Window_OmnipediaList.get("buildCommands").call(this);
	if (this.canAddStatistopediaCommand()) {
		const statistopediaCommand = new WindowCommandBuilder(J.OMNI.EXT.STATS.Metadata.Command.Name).setSymbol(J.OMNI.EXT.STATS.Metadata.Command.Symbol).addTextLine("A running account of everything you have done out there.").addTextLine("It keeps score whether or not you asked it to.").setIconIndex(J.OMNI.EXT.STATS.Metadata.Command.IconIndex).build();
		originalCommands.push(statistopediaCommand);
	}
	return originalCommands;
};
/**
* Determines whether or not the statistopedia command should be added to the Omnipedia.
* @returns {boolean}
*/
Window_OmnipediaList.prototype.canAddStatistopediaCommand = function() {
	if (!$gameSwitches.value(J.OMNI.EXT.STATS.Metadata.EnabledSwitch)) return false;
	return true;
};

//#endregion
//#region src/plugins/omni/ext/stats/scenes/Scene_Omnipedia.js
/**
* Extends {@link #onRootPediaSelection}.<br/>
* When the statistopedia is selected, open the statistopedia.
*/
J.OMNI.EXT.STATS.Aliased.Scene_Omnipedia.set("onRootPediaSelection", Scene_Omnipedia.prototype.onRootPediaSelection);
Scene_Omnipedia.prototype.onRootPediaSelection = function() {
	const currentSelection = this.getRootOmnipediaKey();
	if (currentSelection === J.OMNI.EXT.STATS.Metadata.Command.Symbol) {
		this.statistopediaSelected();
	} else {
		J.OMNI.EXT.STATS.Aliased.Scene_Omnipedia.get("onRootPediaSelection").call(this);
	}
};
/**
* Switch to the statistopedia when selected from the root omnipedia list.
*/
Scene_Omnipedia.prototype.statistopediaSelected = function() {
	this.closeRootPediaWindows();
	Scene_Statistopedia.callScene();
};

//#endregion
//#region src/plugins/omni/ext/stats/registerOmniStatsSaveCodecs.js
/**
* Declares the statistopedia's records as a class instance rather than a plain bag of fields.
*
* Without this the encoder throws by name at save time, which is the loud half of the save contract
* working as intended: a field holding an instance has to say so, or a decoded save would hand back
* an object with the right data and none of the methods that read it.
*
* J-Base owns the `Game_Party` registration, so this extends it rather than re-registering- the
* caches every other omni extension keeps on the party are theirs to declare, and this one is ours.
*/
SerializableRegistry.extend(Game_Party, { typed: { "_j._omni._statistopediaRecords": StatistopediaRecords } });

//#endregion
//# sourceMappingURL=J-OMNI-Stats.js.map