//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 ABS-BOSS] Data-driven boss encounters for J-ABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin allows boss fights to be authored as data instead of as long
 * chains of event commands.
 *
 * A boss encounter describes who is fighting, who is allowed to drive them,
 * and what recurs while the fight runs. That description lives in an external
 * configuration file, which means a fight can be revised, retimed, or rebuilt
 * without opening a single event page.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; the battle system the encounters take place in.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Encounters are defined in the "bosses" block of "data/config.jabs.json",
 * alongside "teams" and "juice". Each encounter names a map, one or more
 * participants, and any number of recurring routines.
 *
 * Participants are a list rather than a single boss on purpose. A lone boss, a
 * boss with destructible parts, a pair of twins, and a swarm sharing a single
 * health pool are all the same structure with a different win condition, so
 * none of them require a new shape later.
 *
 * Nothing in this plugin draws anything. What a boss is - a battler, a health
 * pool, a set of behaviors - is combat knowledge, and a frame drawn around a
 * health bar is a view of that knowledge. Anything wanting to display a boss
 * asks this plugin for it.
 *
 * ============================================================================
 * AUTHORING AN ENCOUNTER:
 * A minimal encounter looks like this:
 *
 *  {
 *    "teams": [ ... ],
 *    "juice": { ... },
 *    "bosses": [
 *      {
 *        "key": "gluttonwolf",
 *        "map": 75,
 *        "participants": [
 *          {
 *            "key": "mayor",
 *            "eventId": 4,
 *            "enemyId": 581,
 *            "expect": "Gluttonwolf Mayor"
 *          }
 *        ],
 *        "aiControl": "shared",
 *        "routines": [
 *          {
 *            "key": "devour",
 *            "cadence": 20,
 *            "steps": [
 *              {
 *                "verb": "forceSkill",
 *                "skill": 2584,
 *                "expect": "Devour",
 *                "cast": true
 *              }
 *            ]
 *          }
 *        ]
 *      }
 *    ]
 *  }
 *
 * ----------------------------------------------------------------------------
 * AI CONTROL:
 * "shared" means the encounter layers behavior on top of a boss that its normal
 * AI continues to drive. This is the default and it is what most fights want.
 *
 * "scripted" means the encounter drives the boss outright for the duration of a
 * routine, and the routine is expected to suppress the normal AI itself.
 *
 * ----------------------------------------------------------------------------
 * CADENCE:
 * A routine's cadence is measured in seconds, counted from the moment the
 * encounter starts, so a routine's first execution is a full interval away
 * rather than landing on the first frame of the fight.
 *
 * When a routine comes due while the boss cannot act - stunned, or already
 * casting - that execution is skipped rather than queued. Queueing would mean
 * a stun releases into every missed execution firing back to back.
 *
 * ----------------------------------------------------------------------------
 * CAST TIME:
 * A step's "cast" property decides whether the skill observes its own cast
 * time. This is not cosmetic. A cast time is the telegraph - the window in
 * which a player reads an attack and moves out of it - so a skill executed
 * without its cast time is a skill that cannot be dodged.
 *
 * It defaults to true. Set it to false only for scripted set-pieces that are
 * not meant to be reacted to.
 *
 * ----------------------------------------------------------------------------
 * THE "expect" PROPERTY:
 * Every database reference carries the name that row had when the encounter
 * was authored. Before a fight runs, those names are checked against the
 * database as it stands now.
 *
 * This exists because a stale id fails silently. When a database is rebalanced
 * and ids move, a fight that references the old numbers keeps running - it just
 * summons the wrong enemy or casts the wrong skill, forever, without complaint.
 * Recording the name turns that silence into a crash at the one moment an
 * author can act on it.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    The plugin metadata class no longer declares private members. Its base
 *    constructor reaches postInitialize before a derived class installs its
 *    own, so anything private was being touched on an object that did not yet
 *    have it, which threw during boot.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @command start-encounter
 * @text Start Boss Encounter
 * @desc Begins a boss fight. Use this when the scene in front of the fight ends.
 * @arg encounterKey
 * @type string
 * @text Encounter
 * @desc The name of the encounter to begin, as written in the configuration.
 *
 * @command end-encounter
 * @text End Boss Encounter
 * @desc Ends the running boss fight. Use this after the boss's death scene finishes.
 */
//endregion annotations

//#region src/plugins/abs/ext/boss/models/JabsBossEncounter.js
/**
* The whole of one boss fight, as authored in configuration.
*
* An encounter is inert data until something starts it. It knows which map it belongs to, which
* bodies take part, who is permitted to drive them, and what recurs while it runs- but it holds no
* runtime state of its own, so the same encounter can be started, lost, and started again without
* carrying anything forward from the previous attempt.
*/
var JabsBossEncounter = class {
	/**
	* The author-facing name for this encounter, and the handle used to start it.
	* @type {string}
	*/
	#key = String.empty;
	/**
	* The id of the map this encounter takes place on.
	* @type {number}
	*/
	#mapId = 0;
	/**
	* Every body taking part in this encounter.
	* @type {JabsBossParticipant[]}
	*/
	#participants = [];
	/**
	* Who is permitted to drive the participants while this encounter is live.
	* @type {string}
	*/
	#aiControl = String.empty;
	/**
	* The recurring sequences that run for the duration of this encounter.
	* @type {JabsBossRoutine[]}
	*/
	#routines = [];
	/**
	* Constructor.
	* @param {string} key The author-facing name for this encounter.
	* @param {number} mapId The id of the map this encounter takes place on.
	* @param {JabsBossParticipant[]} participants Every body taking part.
	* @param {string} aiControl Who is permitted to drive the participants.
	* @param {JabsBossRoutine[]} routines The recurring sequences for this encounter.
	*/
	constructor(key, mapId, participants, aiControl, routines) {
		this.#key = key;
		this.#mapId = mapId;
		this.#participants = participants;
		this.#aiControl = aiControl;
		this.#routines = routines;
	}
	/**
	* Gets the author-facing name for this encounter.
	* @returns {string}
	*/
	key() {
		return this.#key;
	}
	/**
	* Gets the id of the map this encounter takes place on.
	* @returns {number}
	*/
	mapId() {
		return this.#mapId;
	}
	/**
	* Gets every body taking part in this encounter.
	* @returns {JabsBossParticipant[]}
	*/
	participants() {
		return this.#participants;
	}
	/**
	* Gets who is permitted to drive the participants while this encounter is live.
	* @returns {string}
	*/
	aiControl() {
		return this.#aiControl;
	}
	/**
	* Gets the recurring sequences that run for the duration of this encounter.
	* @returns {JabsBossRoutine[]}
	*/
	routines() {
		return this.#routines;
	}
	/**
	* Gets the participant considered the primary body of this encounter.
	*
	* Single-participant fights are the overwhelming majority, and steps that name no participant
	* mean "the boss". This is that boss.
	* @returns {JabsBossParticipant}
	*/
	primaryParticipant() {
		const [primary] = this.#participants;
		return primary;
	}
};

//#endregion
//#region src/plugins/abs/ext/boss/managers/JabsBossManager.js
/**
* The authority on boss encounters: which one is running, who is in it, and what recurs while it
* does.
*
* This lives with the battle system rather than the HUD on purpose. What a boss *is* is combat
* knowledge- a battler, a health pool, a set of behaviors. A frame drawn around a health bar is a
* view of that knowledge, and views do not own the thing they render. Anything wanting to display
* a boss asks here; nothing here knows a window exists.
*/
var JabsBossManager = class JabsBossManager {
	/**
	* The verbs a boss step may perform.
	*
	* Only verbs a shipped fight actually uses are listed. The vocabulary observed across the
	* existing hand-evented fights is considerably larger, and the rest land as the fights that need
	* them are converted- an implemented verb with no consumer is untested surface.
	*/
	static Verbs = { 
	/**
	* Makes the boss perform a skill.
	*/
ForceSkill: "forceSkill" };
	/**
	* Every encounter known to the game, keyed by its author-facing name.
	* @type {Map<string, JabsBossEncounter>}
	*/
	static encounters = new Map();
	/**
	* The encounter currently being fought, if any.
	* @type {JabsBossEncounter|null}
	*/
	static #activeEncounter = null;
	/**
	* How many frames remain before each of the active encounter's routines comes due, keyed by
	* routine name. Cadence is measured from the moment the encounter starts, so every routine's
	* first execution is a full interval away rather than landing on frame one.
	* @type {Map<string, number>}
	*/
	static #routineCountdowns = new Map();
	/**
	* Registers every encounter parsed from configuration.
	* @param {JabsBossEncounter[]} encounters The encounters to register.
	*/
	static registerEncounters(encounters) {
		encounters.forEach((encounter) => this.encounters.set(encounter.key(), encounter));
	}
	/**
	* Gets the encounter currently being fought.
	* @returns {JabsBossEncounter|null} The active encounter, or null when no fight is running.
	*/
	static activeEncounter() {
		return this.#activeEncounter;
	}
	/**
	* Determines whether a boss encounter is currently being fought.
	* @returns {boolean}
	*/
	static hasActiveEncounter() {
		return this.#activeEncounter !== null;
	}
	/**
	* Begins the encounter of the given name.
	*
	* Starting is explicit rather than automatic on map load because a boss fight almost never
	* begins when the player walks into the room- it begins when the story scene in front of it
	* ends.
	* @param {string} encounterKey The name of the encounter to begin.
	*/
	static startEncounter(encounterKey) {
		const encounter = this.encounters.get(encounterKey);
		if (!encounter) {
			throw new Error(`Unknown boss encounter: [ ${encounterKey} ].`);
		}
		this.#validateEncounter(encounter);
		this.#activeEncounter = encounter;
		this.#routineCountdowns.clear();
		encounter.routines().forEach((routine) => this.#routineCountdowns.set(routine.key(), routine.cadenceFrames()));
	}
	/**
	* Ends the active encounter and discards its runtime state.
	*/
	static endEncounter() {
		this.#activeEncounter = null;
		this.#routineCountdowns.clear();
	}
	/**
	* Confirms every database reference in an encounter still means what it meant when authored.
	* @param {JabsBossEncounter} encounter The encounter to check.
	*/
	static #validateEncounter(encounter) {
		encounter.participants().forEach((participant) => this.#validateReference($dataEnemies[participant.enemyId()], participant.enemyId(), participant.expect(), `encounter [ ${encounter.key()} ] participant [ ${participant.key()} ] enemy`));
		encounter.routines().forEach((routine) => this.#validateRoutine(encounter, routine));
	}
	/**
	* Confirms every database reference within a single routine is still accurate.
	* @param {JabsBossEncounter} encounter The encounter owning the routine, named for the error.
	* @param {JabsBossRoutine} routine The routine to check.
	*/
	static #validateRoutine(encounter, routine) {
		routine.steps().forEach((step) => this.#validateReference($dataSkills[step.skillId()], step.skillId(), step.expect(), `encounter [ ${encounter.key()} ] routine [ ${routine.key()} ] skill`));
	}
	/**
	* Confirms one database row still carries the name it was authored against.
	* @param {RPG_Base} databaseEntry The row the id currently resolves to.
	* @param {number} id The id being checked, named for the error.
	* @param {string} expected The name recorded when the encounter was authored.
	* @param {string} description Where in the configuration this reference lives.
	*/
	static #validateReference(databaseEntry, id, expected, description) {
		if (expected === String.empty) return;
		const actual = databaseEntry ? databaseEntry.name : "<nothing>";
		if (actual === expected) return;
		throw new Error(`Boss configuration drift: ${description} id [ ${id} ] was authored as [ ${expected} ] but is now [ ${actual} ].`);
	}
	/**
	* Gets the {@link JABS_Battler} for the given participant of the active encounter.
	* @param {JabsBossParticipant} participant The participant to resolve.
	* @returns {JABS_Battler|null} The battler, or null when its event is not currently on the map.
	*/
	static getParticipantJabsBattler(participant) {
		const participantEvent = $gameMap.event(participant.eventId());
		if (!participantEvent) return null;
		return participantEvent.getJabsBattler();
	}
	/**
	* Gets the {@link Game_Battler} for the primary body of the active encounter.
	* @returns {Game_Battler|null} The battler, or null when no encounter is running.
	*/
	static getBossGameBattler() {
		const jabsBattler = this.getBossJabsBattler();
		if (!jabsBattler) return null;
		return jabsBattler.getBattler();
	}
	/**
	* Gets the {@link JABS_Battler} for the primary body of the active encounter.
	* @returns {JABS_Battler|null} The battler, or null when no encounter is running.
	*/
	static getBossJabsBattler() {
		if (!this.#activeEncounter) return null;
		const primary = this.#activeEncounter.primaryParticipant();
		return this.getParticipantJabsBattler(primary);
	}
	/**
	* Gets the primary boss's current health as a whole-number percent.
	* @returns {number} The percent, or zero when there is no boss to measure.
	*/
	static getBossHpPercent() {
		const gameBattler = this.getBossGameBattler();
		if (!gameBattler) return 0;
		return gameBattler.currentHpPercent100();
	}
	/**
	* Determines whether the primary boss is at or below a given health percent.
	* @param {number} hpPercentThreshold The percent to compare inclusively against.
	* @returns {boolean} True when the boss is at or below the threshold, false otherwise.
	*/
	static isBossBelowHpThreshold(hpPercentThreshold) {
		const gameBattler = this.getBossGameBattler();
		if (!gameBattler) return false;
		return gameBattler.currentHpPercent100() <= hpPercentThreshold;
	}
	/**
	* Determines whether the primary boss is at or above a given health percent.
	* @param {number} hpPercentThreshold The percent to compare inclusively against.
	* @returns {boolean} True when the boss is at or above the threshold, false otherwise.
	*/
	static isBossAboveHpThreshold(hpPercentThreshold) {
		const gameBattler = this.getBossGameBattler();
		if (!gameBattler) return false;
		return gameBattler.currentHpPercent100() >= hpPercentThreshold;
	}
	/**
	* Advances the active encounter by one frame.
	*/
	static update() {
		if (!this.hasActiveEncounter()) return;
		this.#activeEncounter.routines().forEach((routine) => this.#updateRoutine(routine));
	}
	/**
	* Advances a single routine by one frame, executing it when it comes due.
	* @param {JabsBossRoutine} routine The routine to advance.
	*/
	static #updateRoutine(routine) {
		const remaining = this.#routineCountdowns.get(routine.key());
		if (remaining > 0) {
			this.#routineCountdowns.set(routine.key(), remaining - 1);
			return;
		}
		if (this.#canExecuteRoutine() === false) return;
		this.#executeRoutine(routine);
		this.#routineCountdowns.set(routine.key(), routine.cadenceFrames());
	}
	/**
	* Determines whether the active encounter's boss is in a state where a routine may execute.
	* @returns {boolean}
	*/
	static #canExecuteRoutine() {
		const jabsBattler = this.getBossJabsBattler();
		if (!jabsBattler) return false;
		if (jabsBattler.getBattler().isDead()) return false;
		if (jabsBattler.isCastingOrChanneling()) return false;
		return true;
	}
	/**
	* Performs every step of a routine, in order.
	* @param {JabsBossRoutine} routine The routine to perform.
	*/
	static #executeRoutine(routine) {
		routine.steps().forEach((step) => this.#executeStep(step));
	}
	/**
	* Performs a single step of a routine.
	* @param {JabsBossStep} step The step to perform.
	*/
	static #executeStep(step) {
		switch (step.verb()) {
			case JabsBossManager.Verbs.ForceSkill:
				this.#executeForceSkill(step);
				break;
			default: throw new Error(`Unrecognized boss step verb: [ ${step.verb()} ].`);
		}
	}
	/**
	* Makes the boss perform the skill named by a step.
	*
	* There are two genuinely different ways to make a battler use a skill, and which one is correct
	* depends entirely on whether the skill has a telegraph worth preserving.
	* @param {JabsBossStep} step The step naming the skill to perform.
	*/
	static #executeForceSkill(step) {
		const jabsBattler = this.getBossJabsBattler();
		if (step.isCast() === false) {
			$jabsEngine.forceMapAction(jabsBattler, step.skillId(), false);
			return;
		}
		const actionOptions = JABS_ActionOptions.Builder().build();
		const actions = jabsBattler.createJabsActionFromSkill(step.skillId(), actionOptions);
		jabsBattler.setDecidedAction(actions);
		const [primaryAction] = actions;
		jabsBattler.setCastCountdown(primaryAction.getCastTime());
		jabsBattler.setPhase(2);
	}
};

//#endregion
//#region src/plugins/abs/ext/boss/models/JabsBossParticipant.js
/**
* A single body that belongs to a boss encounter.
*
* Most fights have exactly one participant, but the concept is deliberately plural: a boss with
* destructible parts, a pair of twins, and a swarm sharing one health pool are all the same
* structure wearing different win conditions. Keeping participants a list from day one means none
* of those require a new shape later.
*/
var JabsBossParticipant = class {
	/**
	* The author-facing name for this participant, used to reference it from elsewhere in the config.
	* @type {string}
	*/
	#key = String.empty;
	/**
	* The id of the event on the encounter's map that hosts this participant's battler.
	* @type {number}
	*/
	#eventId = 0;
	/**
	* The id of the enemy in the database that this participant is expected to be.
	* @type {number}
	*/
	#enemyId = 0;
	/**
	* The name this participant's enemy had when the encounter was authored.
	*
	* This is the drift tripwire. Database ids move when the database is rebalanced, and a stale id
	* fails silently- the fight simply runs against the wrong enemy and nothing reports a problem.
	* Storing the name alongside the id lets validation fail loudly instead.
	* @type {string}
	*/
	#expect = String.empty;
	/**
	* Constructor.
	* @param {string} key The author-facing name for this participant.
	* @param {number} eventId The id of the event hosting this participant's battler.
	* @param {number} enemyId The id of the enemy this participant should be.
	* @param {string} expect The enemy name recorded when this encounter was authored.
	*/
	constructor(key, eventId, enemyId, expect) {
		this.#key = key;
		this.#eventId = eventId;
		this.#enemyId = enemyId;
		this.#expect = expect;
	}
	/**
	* Gets the author-facing name for this participant.
	* @returns {string}
	*/
	key() {
		return this.#key;
	}
	/**
	* Gets the id of the event hosting this participant's battler.
	* @returns {number}
	*/
	eventId() {
		return this.#eventId;
	}
	/**
	* Gets the id of the enemy this participant should be.
	* @returns {number}
	*/
	enemyId() {
		return this.#enemyId;
	}
	/**
	* Gets the enemy name recorded when this encounter was authored.
	* @returns {string}
	*/
	expect() {
		return this.#expect;
	}
};

//#endregion
//#region src/plugins/abs/ext/boss/models/JabsBossRoutine.js
/**
* A repeating sequence of steps that runs while its encounter is live.
*
* Routines are the recurring half of a boss fight- the summon that arrives every fifteen seconds,
* the circuit of attacks the boss walks. They are additive and they do not stop on their own: a
* fight that gets harder the longer it runs is a design position, not an oversight, so nothing
* here quietly retires a routine that was started.
*/
var JabsBossRoutine = class {
	/**
	* The author-facing name for this routine.
	* @type {string}
	*/
	#key = String.empty;
	/**
	* How many frames elapse between executions of this routine.
	* @type {number}
	*/
	#cadenceFrames = 0;
	/**
	* The steps performed each time this routine comes due, in order.
	* @type {JabsBossStep[]}
	*/
	#steps = [];
	/**
	* Constructor.
	* @param {string} key The author-facing name for this routine.
	* @param {number} cadenceFrames How many frames elapse between executions.
	* @param {JabsBossStep[]} steps The steps performed each time this routine comes due.
	*/
	constructor(key, cadenceFrames, steps) {
		this.#key = key;
		this.#cadenceFrames = cadenceFrames;
		this.#steps = steps;
	}
	/**
	* Gets the author-facing name for this routine.
	* @returns {string}
	*/
	key() {
		return this.#key;
	}
	/**
	* Gets how many frames elapse between executions of this routine.
	* @returns {number}
	*/
	cadenceFrames() {
		return this.#cadenceFrames;
	}
	/**
	* Gets the steps performed each time this routine comes due.
	* @returns {JabsBossStep[]}
	*/
	steps() {
		return this.#steps;
	}
};

//#endregion
//#region src/plugins/abs/ext/boss/models/JabsBossStep.js
/**
* One instruction inside a boss routine.
*
* A step is the smallest unit an encounter can express, and the vocabulary is deliberately small:
* every operation observed across the existing hand-evented boss fights reduces to a handful of
* these. Only the verbs a shipped fight actually needs are implemented- an unimplemented verb is
* an unexercised code path, and this system earns its keep by being trustworthy rather than broad.
*/
var JabsBossStep = class {
	/**
	* The verb this step performs.
	* @type {string}
	*/
	#verb = String.empty;
	/**
	* The id of the skill this step operates on.
	* @type {number}
	*/
	#skillId = 0;
	/**
	* The name the skill had when this step was authored, used to detect database drift.
	* @type {string}
	*/
	#expect = String.empty;
	/**
	* Whether this step's skill should observe its own cast time.
	*
	* This is not cosmetic. A cast time is the telegraph- it is the window in which a player reads
	* the attack and moves out of it. Executing a skill without its cast time deletes that window
	* and turns a readable attack into an unavoidable one.
	* @type {boolean}
	*/
	#cast = true;
	/**
	* Constructor.
	* @param {string} verb The verb this step performs.
	* @param {number} skillId The id of the skill this step operates on.
	* @param {string} expect The skill name recorded when this step was authored.
	* @param {boolean} cast Whether the skill should observe its own cast time.
	*/
	constructor(verb, skillId, expect, cast) {
		this.#verb = verb;
		this.#skillId = skillId;
		this.#expect = expect;
		this.#cast = cast;
	}
	/**
	* Gets the verb this step performs.
	* @returns {string}
	*/
	verb() {
		return this.#verb;
	}
	/**
	* Gets the id of the skill this step operates on.
	* @returns {number}
	*/
	skillId() {
		return this.#skillId;
	}
	/**
	* Gets the skill name recorded when this step was authored.
	* @returns {string}
	*/
	expect() {
		return this.#expect;
	}
	/**
	* Gets whether this step's skill should observe its own cast time.
	* @returns {boolean}
	*/
	isCast() {
		return this.#cast;
	}
};

//#endregion
//#region src/plugins/abs/ext/boss/_metadata/_pluginMetadata.js
/**
* The number of frames in one second, used to translate author-facing cadences into engine time.
*
* Authors think in seconds because that is how a fight is designed and described- "a summon every
* fifteen seconds". The engine counts frames. This is where those two vocabularies meet, exactly
* once, so no other file has to know the conversion.
* @type {number}
*/
var FRAMES_PER_SECOND = 60;
var J_BossPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
	* Includes parsing the boss encounter configuration.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeBossEncounters();
	}
	/**
	* Reads every boss encounter out of configuration and hands them to the manager.
	*
	* Encounters live in the `bosses` block of `config.jabs.json` rather than in a file of their own,
	* the same way J-ABS-Juice reads its `juice` block. One file per plugin family keeps the editor's
	* boards mapping one-to-one onto config files, and means an extension never has to own the loading
	* of its own configuration.
	*/
	initializeBossEncounters() {
		const { bosses } = J.ABS.Metadata.ExternalConfig;
		const encounters = bosses.map((rawEncounter) => this.parseEncounter(rawEncounter));
		JabsBossManager.registerEncounters(encounters);
	}
	/**
	* Builds one encounter out of its raw configuration.
	*
	* None of the parse helpers below may be `#private`. The whole chain runs out of
	* {@link PluginMetadata}'s constructor by way of `postInitialize`, and a derived class installs its
	* private members only after `super()` returns- so a private helper does not exist yet at the moment
	* this runs, and touching one throws before the game finishes booting.
	* @param {any} rawEncounter The unparsed encounter from configuration.
	* @returns {JabsBossEncounter}
	*/
	parseEncounter(rawEncounter) {
		const participants = rawEncounter.participants.map((raw) => this.parseParticipant(raw));
		const aiControl = rawEncounter.aiControl ?? J.ABS.EXT.BOSS.AiControl.Shared;
		const rawRoutines = rawEncounter.routines ?? [];
		const routines = rawRoutines.map((raw) => this.parseRoutine(raw));
		return new JabsBossEncounter(rawEncounter.key, rawEncounter.map, participants, aiControl, routines);
	}
	/**
	* Builds one participant out of its raw configuration.
	* @param {any} rawParticipant The unparsed participant from configuration.
	* @returns {JabsBossParticipant}
	*/
	parseParticipant(rawParticipant) {
		const { key, eventId, enemyId, expect } = rawParticipant;
		return new JabsBossParticipant(key, eventId, enemyId, expect);
	}
	/**
	* Builds one routine out of its raw configuration.
	* @param {any} rawRoutine The unparsed routine from configuration.
	* @returns {JabsBossRoutine}
	*/
	parseRoutine(rawRoutine) {
		const cadenceFrames = Math.round(rawRoutine.cadence * FRAMES_PER_SECOND);
		const steps = rawRoutine.steps.map((raw) => this.parseStep(raw));
		return new JabsBossRoutine(rawRoutine.key, cadenceFrames, steps);
	}
	/**
	* Builds one step out of its raw configuration.
	* @param {any} rawStep The unparsed step from configuration.
	* @returns {JabsBossStep}
	*/
	parseStep(rawStep) {
		const { verb, skill, expect } = rawStep;
		const cast = rawStep.cast !== false;
		return new JabsBossStep(verb, skill, expect, cast);
	}
};

//#endregion
//#region src/plugins/abs/ext/boss/_metadata/initialization.js
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
	const requiredJabsVersion = "4.13.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (hasJabsRequirement === false) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.BOSS = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.BOSS.Metadata = new J_BossPluginMetadata("J-ABS-Boss", "1.0.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.BOSS.Aliased = { Game_Map: new Map() };
/**
* The modes describing who is permitted to drive a boss battler while an encounter is live.
* A boss is never wholly owned by the encounter script unless the author says so, because most
* fights want the normal JABS brain in charge and the script only layering behavior on top.
*/
J.ABS.EXT.BOSS.AiControl = {
	/**
	* The encounter layers behavior on top of the boss while its normal JABS AI continues to drive it.
	* This is the default, and it is what a fight means when it says "otherwise let regular AI handle him".
	*/
	Shared: "shared",
	/**
	* The encounter drives the boss outright for the duration of a routine, and the normal AI is expected
	* to be suppressed by the routine's own steps- typically by rooting the battler while it acts.
	*/
	Scripted: "scripted"
};

//#endregion
//#region src/plugins/abs/ext/boss/objects/Game_Map.js
/**
* Extends {@link #update}.<br/>
* Also advances the active boss encounter.
*
* The map update is the right home for this rather than a scene: an encounter is a property of the
* world the battle happens in, and it must keep counting whether or not any particular scene is on
* top of it.
*/
J.ABS.EXT.BOSS.Aliased.Game_Map.set("update", Game_Map.prototype.update);
Game_Map.prototype.update = function(sceneActive) {
	J.ABS.EXT.BOSS.Aliased.Game_Map.get("update").call(this, sceneActive);
	JabsBossManager.update();
};

//#endregion
//#region src/plugins/abs/ext/boss/_metadata/pluginCommands.js
/**
* Begins a boss encounter by name.
*
* This is the seam a story event uses when its cutscene ends and the fight begins.
*/
PluginManager.registerCommand(J.ABS.EXT.BOSS.Metadata.name, "start-encounter", (args) => {
	const { encounterKey } = args;
	JabsBossManager.startEncounter(encounterKey);
});
/**
* Ends the active boss encounter.
*
* Ending is explicit rather than automatic on defeat, because the fight is not over when the boss
* reaches zero health- it is over when its death scene finishes.
*/
PluginManager.registerCommand(J.ABS.EXT.BOSS.Metadata.name, "end-encounter", () => {
	JabsBossManager.endEncounter();
});

//#endregion
//# sourceMappingURL=J-ABS-Boss.js.map