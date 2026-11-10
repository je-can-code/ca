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
 * Please refer to J-ABS-Boss's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/abs/ext/boss/index.md
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
* bodies take part, who is permitted to drive them, what recurs while it runs, what it does in answer
* to what happens in it, and which switch tells the story it was won- but it holds no runtime state of
* its own, so the same encounter can be started, lost, and started again without carrying anything
* forward from the previous attempt.
*/
var JabsBossEncounter = class {
	/**
	* The author-facing name for this encounter, and the handle used to start it.
	* @type {string}
	*/
	#key = String.empty;
	/**
	* The id of the map holding this encounter's arena in the game itself.
	*
	* Starting the encounter never consults it. The fight runs on whichever map starts it, which is what
	* lets a test hall built in the arena's shape stage the very same fight. Winning does consult it: only
	* a fight won here turns on the defeat switch, so a hall can be won over and over without the story
	* ever hearing of it. Tooling also checks the participants' tiles against the arena it names.
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
	* The switch turned on once every body in this encounter has fallen, or zero for none.
	*
	* This is how the story learns a boss is dead without the boss's own event having to know anything
	* about the story. The body that falls is only ever the boss: its death scene says its last words,
	* and whatever the world does about it afterward waits on this switch.
	* @type {number}
	*/
	#defeatSwitchId = 0;
	/**
	* What this encounter does, once each, in answer to the moments of the fight.
	* @type {JabsBossReaction[]}
	*/
	#reactions = [];
	/**
	* Constructor.
	* @param {string} key The author-facing name for this encounter.
	* @param {number} mapId The id of the map holding this encounter's arena.
	* @param {JabsBossParticipant[]} participants Every body taking part.
	* @param {string} aiControl Who is permitted to drive the participants.
	* @param {JabsBossRoutine[]} routines The recurring sequences for this encounter.
	* @param {number} defeatSwitchId The switch turned on once every body has fallen, or zero for none.
	* @param {JabsBossReaction[]} reactions What this encounter does in answer to the moments of the fight.
	*/
	constructor(key, mapId, participants, aiControl, routines, defeatSwitchId, reactions) {
		this.#key = key;
		this.#mapId = mapId;
		this.#participants = participants;
		this.#aiControl = aiControl;
		this.#routines = routines;
		this.#defeatSwitchId = defeatSwitchId;
		this.#reactions = reactions;
	}
	/**
	* Gets the author-facing name for this encounter.
	* @returns {string}
	*/
	key() {
		return this.#key;
	}
	/**
	* Gets the id of the map holding this encounter's arena.
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
	* Gets the switch turned on once every body in this encounter has fallen, which is zero when the
	* encounter turns no switch on at all.
	* @returns {number}
	*/
	defeatSwitchId() {
		return this.#defeatSwitchId;
	}
	/**
	* Gets what this encounter does, once each, in answer to the moments of the fight.
	* @returns {JabsBossReaction[]}
	*/
	reactions() {
		return this.#reactions;
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
//#region src/plugins/abs/ext/boss/models/JabsBossReaction.js
/**
* Something a boss fight does once, the moment a thing happens in it.
*
* Routines are what a fight keeps doing; reactions are what it does in answer. The boss seals itself
* away as the fight opens, the rocks come faster each time one of its guardians falls, the seal breaks
* once they all have, and a boss worn down past a third of its health flares up and changes the room.
* Each reaction fires at most once per fight, on the first frame its trigger holds, and a fight started
* again starts with every reaction unfired.
*/
var JabsBossReaction = class {
	/**
	* The moments a reaction can answer.
	*/
	static Triggers = {
		/**
		* The fight begins: every body has just arrived, before a single frame of the fight has played.
		*/
		Start: "start",
		/**
		* Every one of the named participants has fallen and finished its death scene.
		*/
		Fallen: "fallen",
		/**
		* Every one of the named participants- or the boss, when none are named- is still standing at or below a
		* percent of its health. A fight's turning points: the boss flaring up as it is worn down.
		*/
		Health: "health"
	};
	/**
	* The author-facing name for this reaction.
	* @type {string}
	*/
	#key = String.empty;
	/**
	* The moment this reaction answers, one of {@link JabsBossReaction.Triggers}.
	* @type {string}
	*/
	#trigger = String.empty;
	/**
	* The author-facing names of the participants a fallen or health trigger waits on.
	*
	* All of them, not any one: a reaction to one body falling names that one body, and a reaction to a
	* whole group falling names the group. A health trigger naming nobody watches the boss.
	* @type {string[]}
	*/
	#participantKeys = [];
	/**
	* The steps performed when this reaction fires, in order.
	* @type {JabsBossStep[]}
	*/
	#steps = [];
	/**
	* The percent of its health a health trigger waits for its participants to be worn down to, inclusive.
	* Zero for every other trigger, which waits on no health at all.
	* @type {number}
	*/
	#belowPercent = 0;
	/**
	* Constructor.
	* @param {string} key The author-facing name for this reaction.
	* @param {string} trigger The moment this reaction answers.
	* @param {string[]} participantKeys The participants a fallen or health trigger waits on.
	* @param {JabsBossStep[]} steps The steps performed when this reaction fires.
	* @param {number} belowPercent The health percent a health trigger waits for, or zero for any other trigger.
	*/
	constructor(key, trigger, participantKeys, steps, belowPercent = 0) {
		this.#key = key;
		this.#trigger = trigger;
		this.#participantKeys = participantKeys;
		this.#steps = steps;
		this.#belowPercent = belowPercent;
	}
	/**
	* Gets the author-facing name for this reaction.
	* @returns {string}
	*/
	key() {
		return this.#key;
	}
	/**
	* Gets the moment this reaction answers.
	* @returns {string}
	*/
	trigger() {
		return this.#trigger;
	}
	/**
	* Gets the author-facing names of the participants a fallen or health trigger waits on.
	* @returns {string[]}
	*/
	participantKeys() {
		return this.#participantKeys;
	}
	/**
	* Gets the steps performed when this reaction fires.
	* @returns {JabsBossStep[]}
	*/
	steps() {
		return this.#steps;
	}
	/**
	* Gets the percent of its health a health trigger waits for its participants to be worn down to, which is
	* zero for every other trigger.
	* @returns {number}
	*/
	belowPercent() {
		return this.#belowPercent;
	}
};

//#endregion
//#region src/plugins/abs/ext/boss/managers/JabsBossManager.js
/**
* The opacities a blinking body passes through as it fades out of sight.
* @type {number[]}
*/
var BLINK_FADE_OUT = [
	200,
	150,
	100,
	50,
	0
];
/**
* The opacities a blinking body passes through as it fades back in.
* @type {number[]}
*/
var BLINK_FADE_IN = [
	50,
	100,
	150,
	200,
	255
];
/**
* How many frames each opacity of a blink's fade holds before the next.
* @type {number}
*/
var BLINK_FADE_STEP_FRAMES = 3;
/**
* How many frames a blinking body is away: its fade out plays during them, so it is out of sight for most.
* @type {number}
*/
var BLINK_AWAY_FRAMES = 60;
/**
* How many frames a blinking body holds still once it has faded back in, before whatever follows it.
* @type {number}
*/
var BLINK_SETTLE_FRAMES = 30;
/**
* The facings a blink may leave a body with: zero keeps the one it had, and the rest are down, left, right and up.
* @type {number[]}
*/
var BLINK_DIRECTIONS = [
	0,
	2,
	4,
	6,
	8
];
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
		ForceSkill: "forceSkill",
		/**
		* Puts a state on a participant, such as a seal that holds it still and turns every hit to nothing.
		*/
		AddState: "addState",
		/**
		* Takes a state off a participant again.
		*/
		RemoveState: "removeState",
		/**
		* Changes what a participant looks like, such as a statue coming to life.
		*/
		ChangeImage: "changeImage",
		/**
		* Shortens how long a routine waits between executions, so the fight gets faster.
		*/
		QuickenRoutine: "quickenRoutine",
		/**
		* Puts something on the map that is part of the fight without being a body it has to fell, such as a
		* hazard that wakes as the boss is worn down.
		*/
		Spawn: "spawn",
		/**
		* Shifts the color of the whole screen, such as the room reddening as the boss's temper rises.
		*/
		Tint: "tint",
		/**
		* Plays an animation over a participant, such as the boss flaring up.
		*/
		Animation: "animation",
		/**
		* Has a participant say a line, holding the fight still until the player has read it.
		*/
		Dialogue: "dialogue",
		/**
		* Has a participant vanish from where it stands and reappear on another tile, such as a boss taking its place
		* on each of the room's platforms in turn.
		*/
		Blink: "blink",
		/**
		* Holds the steps behind it for a while, such as a boss gathering itself between one blast and the next.
		*/
		Wait: "wait",
		/**
		* Teaches a participant a skill its own AI uses from then on, such as a summon learned partway through.
		*/
		LearnSkill: "learnSkill",
		/**
		* Wakes a dormant routine, so something the fight keeps doing only starts once the fight reaches a moment.
		*/
		StartRoutine: "startRoutine"
	};
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
	* How many frames each of the active encounter's routines currently waits between executions, keyed by
	* routine name.
	*
	* Every routine starts at the cadence it was authored with, and a quickening shortens it as the fight
	* goes on. That is fight state, so it lives here rather than on the routine: the next attempt at the
	* same fight starts back at the authored cadence.
	* @type {Map<string, number>}
	*/
	static #routineCadences = new Map();
	/**
	* The reactions to bodies falling that have already fired in the active encounter. Each fires once per
	* fight. Reactions to the fight beginning are never kept here, because they fire as the fight starts
	* and at no other moment.
	* @type {Set<JabsBossReaction>}
	*/
	static #firedReactions = new Set();
	/**
	* The bodies the active encounter spawned, keyed by the name of the participant each one plays.
	*
	* These are held as the events themselves rather than as their ids. A spawned body's slot is freed
	* once it leaves the map, and the next thing dropped there- loot, most often- can move into it, so an
	* id kept here could quietly start naming something that is not the boss at all.
	* @type {Map<string, Game_Event>}
	*/
	static #participantBodies = new Map();
	/**
	* Whether every body the active encounter spawned has fallen and finished its death scene.
	*
	* A fight is won exactly once. The defeat switch turns on at the moment this settles rather than on
	* every frame after it, since each switch change makes the whole map refresh.
	* @type {boolean}
	*/
	static #bossDefeated = false;
	/**
	* One firing of a reaction, or one execution of a routine, playing its steps in order.
	*
	* A step that takes time- a line being said, a blink across the room, a pause- plays out as a scene: the same
	* event commands an event would run, run by an interpreter belonging to the participant's own event, so
	* anything that reads who is acting, such as a message floating above whoever speaks, finds them exactly as it
	* would during a scene. Every step behind a scene waits until it is over.
	* @typedef {Object} JabsBossLane
	* @property {JabsBossRoutine|JabsBossReaction} owner The routine or reaction whose steps these are.
	* @property {JabsBossStep[]} steps The steps it has yet to take, oldest first.
	* @property {Game_Interpreter|null} scene The scene the step it is on is playing, or null when it plays none.
	*/
	/**
	* Every lane still playing, in the order they began.
	*
	* Lanes play side by side, the way a fight's separate events would: a boss blinking around the room on one
	* routine does not hold up the spawner on another, or the turning point its health just passed. A scene holds
	* only the lane playing it. Steps in a lane with nothing to wait on all play in the same frame.
	* @type {JabsBossLane[]}
	*/
	static #lanes = [];
	/**
	* The bodies the active encounter's steps spawned that are no part of its win condition, such as hazards.
	*
	* Held as the events themselves for the same reason the participants' bodies are: a slot can be handed to
	* something else once its body leaves the map. When the fight is won or ended, whichever of these are
	* still standing leave with it.
	* @type {Game_Event[]}
	*/
	static #extraBodies = [];
	/**
	* The screen tone the active encounter found when it first tinted the screen, or empty when it has not.
	*
	* A fight's tint is the fight's own. Ending the fight hands the screen back the way the fight found it,
	* so whatever the story does next starts from the room as it was.
	* @type {number[]}
	*/
	static #toneBeforeFight = [];
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
	* Determines whether the active encounter has been won: every body it spawned has fallen, and each
	* one's death scene has finished playing.
	*
	* A fight won away from its arena turns no switch on, so this is how a test hall learns its fight is
	* over.
	* @returns {boolean}
	*/
	static isBossDefeated() {
		return this.#bossDefeated;
	}
	/**
	* Begins the encounter of the given name, spawning every one of its bodies onto the current map.
	*
	* Starting is explicit rather than automatic on map load because a boss fight almost never
	* begins when the player walks into the room- it begins when the story scene in front of it
	* ends. The bodies arrive at that same moment, which is why the map staging the fight holds no
	* event for the boss at all.
	* @param {string} encounterKey The name of the encounter to begin.
	*/
	static startEncounter(encounterKey) {
		const encounter = this.encounters.get(encounterKey);
		if (!encounter) {
			throw new Error(`Unknown boss encounter: [ ${encounterKey} ].`);
		}
		this.#validateEncounter(encounter);
		this.#clearExtraBodies();
		this.#lanes = [];
		this.#spawnParticipants(encounter);
		this.#activeEncounter = encounter;
		this.#bossDefeated = false;
		this.#seedRoutines(encounter);
		this.#firedReactions.clear();
		this.#fireStartReactions(encounter);
	}
	/**
	* Seeds each of an encounter's routines with the cadence it was authored with, a full interval away.
	*
	* A dormant routine gets a cadence but no countdown: it is not running until a step starts it, and a routine
	* with no countdown is one the fight never advances.
	* @param {JabsBossEncounter} encounter The encounter whose routines to seed.
	*/
	static #seedRoutines(encounter) {
		this.#routineCountdowns.clear();
		this.#routineCadences.clear();
		encounter.routines().forEach((routine) => {
			this.#routineCadences.set(routine.key(), routine.cadenceFrames());
			if (routine.isDormant()) return;
			this.#routineCountdowns.set(routine.key(), routine.cadenceFrames());
		});
	}
	/**
	* Fires every one of an encounter's reactions to the fight beginning.
	* @param {JabsBossEncounter} encounter The encounter that just began.
	*/
	static #fireStartReactions(encounter) {
		encounter.reactions().filter((reaction) => reaction.trigger() === JabsBossReaction.Triggers.Start).forEach((reaction) => this.#performReaction(reaction));
	}
	/**
	* Ends the active encounter and discards its runtime state.
	*
	* Any participant still standing is left where it is. Ending a fight is bookkeeping, and whatever the
	* story wants done with a survivor belongs to the scene that ends it. What the fight put on the map for
	* itself is different: a hazard it woke, or a tint it laid over the screen, is the fight's own and leaves
	* with it.
	*/
	static endEncounter() {
		this.#clearExtraBodies();
		this.#restoreTone();
		this.#activeEncounter = null;
		this.#routineCountdowns.clear();
		this.#routineCadences.clear();
		this.#firedReactions.clear();
		this.#participantBodies.clear();
		this.#bossDefeated = false;
		this.#lanes = [];
	}
	/**
	* Takes every extra body the active encounter spawned off the map, and forgets them all.
	*
	* Taking a body off the map is erasing it, the same way J-ABS itself takes an enemy away while it waits
	* to respawn.
	*/
	static #clearExtraBodies() {
		this.#extraBodies.filter((body) => this.#isStillStanding(body)).forEach((body) => body.erase());
		this.#extraBodies = [];
	}
	/**
	* Determines whether a spawned body is still on the map and still standing.
	* @param {Game_Event} body The body to check.
	* @returns {boolean}
	*/
	static #isStillStanding(body) {
		if ($gameMap.event(body.eventId()) !== body) return false;
		return body.isErased() === false;
	}
	/**
	* Puts the screen back the way the active encounter found it, if the encounter ever tinted it.
	*/
	static #restoreTone() {
		if (this.#toneBeforeFight.length === 0) return;
		$gameScreen.startTint(this.#toneBeforeFight, 0);
		this.#toneBeforeFight = [];
	}
	/**
	* Puts every participant of an encounter onto the current map.
	* @param {JabsBossEncounter} encounter The encounter whose bodies to spawn.
	*/
	static #spawnParticipants(encounter) {
		encounter.participants().forEach((participant) => this.#spawnParticipant(encounter, participant));
	}
	/**
	* Spawns a single participant from the enemy clone map onto its tile, and remembers the body.
	* @param {JabsBossEncounter} encounter The encounter owning the participant, named for errors.
	* @param {JabsBossParticipant} participant The participant to spawn.
	*/
	static #spawnParticipant(encounter, participant) {
		const body = $jabsEngine.addEnemyToMap(participant.x(), participant.y(), participant.templateId());
		const who = this.#describeParticipant(encounter, participant);
		this.#confirmBody(body, participant.enemyId(), participant.templateId(), who);
		this.#participantBodies.set(participant.key(), body);
	}
	/**
	* Confirms a spawn produced a body at all, and that the body is the enemy it was spawned to be.
	*
	* A slot holding no event spawns nothing, and a boss that never shows up is the hardest failure there is
	* to diagnose from in-game. A slot can also hold an event and still produce the wrong body: the clone
	* map's slots are only expected to match their enemy ids, and nothing enforces it. A slot that drifted, or
	* a placeholder slot with no enemy on it, would otherwise put a body on the map that fights as something
	* else- or does not fight at all- without a word.
	* @param {Game_Event|undefined} body The event the spawn produced, if it produced one.
	* @param {number} enemyId The enemy the body was spawned to be.
	* @param {number} templateId The clone map slot the body was copied from, named for the errors.
	* @param {string} who Whatever the body was spawned for, named for the errors.
	*/
	static #confirmBody(body, enemyId, templateId, who) {
		if (!body) {
			throw new Error(`Boss ${who} could not spawn: the enemy clone map holds no event [ ${templateId} ].`);
		}
		const jabsBattler = body.getJabsBattler();
		const spawnedEnemyId = jabsBattler ? jabsBattler.getBattler().enemyId() : 0;
		if (spawnedEnemyId === enemyId) return;
		throw new Error(`Boss configuration drift: ${who} spawned enemy [ ${spawnedEnemyId} ] from clone event [ ${templateId} ].`);
	}
	/**
	* Names a participant the way the spawning errors refer to it.
	* @param {JabsBossEncounter} encounter The encounter owning the participant.
	* @param {JabsBossParticipant} participant The participant being described.
	* @returns {string}
	*/
	static #describeParticipant(encounter, participant) {
		return `encounter [ ${encounter.key()} ] participant [ ${participant.key()} ]`;
	}
	/**
	* Confirms every database reference in an encounter still means what it meant when authored.
	* @param {JabsBossEncounter} encounter The encounter to check.
	*/
	static #validateEncounter(encounter) {
		encounter.participants().forEach((participant) => this.#validateReference($dataEnemies[participant.enemyId()], participant.enemyId(), participant.expect(), `encounter [ ${encounter.key()} ] participant [ ${participant.key()} ] enemy`));
		encounter.routines().forEach((routine) => this.#validateRoutine(encounter, routine));
		encounter.reactions().forEach((reaction) => this.#validateReaction(encounter, reaction));
		this.#validateDefeatSwitch(encounter);
	}
	/**
	* Confirms the switch an encounter turns on when it is won is one the game actually has.
	*
	* The engine quietly ignores a switch past the end of its list, so a mistyped id would let the boss
	* fall while the story waited on it forever, with nothing anywhere saying why.
	* @param {JabsBossEncounter} encounter The encounter to check.
	*/
	static #validateDefeatSwitch(encounter) {
		const switchId = encounter.defeatSwitchId();
		if (switchId === 0) return;
		const lastSwitchId = $dataSystem.switches.length - 1;
		if (switchId > 0 && switchId <= lastSwitchId) return;
		const where = `encounter [ ${encounter.key()} ]`;
		throw new Error(`Boss ${where} turns on switch [ ${switchId} ] when won, but the game only has switches 1-${lastSwitchId}.`);
	}
	/**
	* Confirms every step within a single routine still refers to things that exist.
	* @param {JabsBossEncounter} encounter The encounter owning the routine.
	* @param {JabsBossRoutine} routine The routine to check.
	*/
	static #validateRoutine(encounter, routine) {
		const where = `encounter [ ${encounter.key()} ] routine [ ${routine.key()} ]`;
		routine.steps().forEach((step) => this.#validateStep(encounter, step, where));
	}
	/**
	* Confirms a reaction answers a moment a fight actually has, waits on bodies the fight actually has,
	* and that each of its steps refers to things that exist.
	* @param {JabsBossEncounter} encounter The encounter owning the reaction.
	* @param {JabsBossReaction} reaction The reaction to check.
	*/
	static #validateReaction(encounter, reaction) {
		const where = `encounter [ ${encounter.key()} ] reaction [ ${reaction.key()} ]`;
		this.#validateTrigger(encounter, reaction, where);
		reaction.steps().forEach((step) => this.#validateStep(encounter, step, where));
	}
	/**
	* Confirms a reaction's trigger is one a fight has, and that whatever it waits on is real.
	* @param {JabsBossEncounter} encounter The encounter owning the reaction.
	* @param {JabsBossReaction} reaction The reaction to check.
	* @param {string} where Where in the configuration the reaction lives, named for the error.
	*/
	static #validateTrigger(encounter, reaction, where) {
		switch (reaction.trigger()) {
			case JabsBossReaction.Triggers.Start: return;
			case JabsBossReaction.Triggers.Fallen:
				this.#validateFallenTrigger(encounter, reaction, where);
				return;
			case JabsBossReaction.Triggers.Health:
				this.#validateHealthTrigger(encounter, reaction, where);
				return;
			default: throw new Error(`Boss ${where} answers [ ${reaction.trigger()} ], which is not a moment a fight has.`);
		}
	}
	/**
	* Confirms a fallen trigger waits on somebody, and only on participants the encounter has.
	* @param {JabsBossEncounter} encounter The encounter owning the reaction.
	* @param {JabsBossReaction} reaction The reaction to check.
	* @param {string} where Where in the configuration the reaction lives, named for the error.
	*/
	static #validateFallenTrigger(encounter, reaction, where) {
		if (reaction.participantKeys().length === 0) {
			throw new Error(`Boss ${where} waits on nobody falling, so it would fire the moment the fight began.`);
		}
		reaction.participantKeys().forEach((key) => this.#validateParticipantKey(encounter, key, where));
	}
	/**
	* Confirms a health trigger waits on a percent a fight actually passes through, and only on participants
	* the encounter has. Naming nobody is allowed: it watches the boss.
	* @param {JabsBossEncounter} encounter The encounter owning the reaction.
	* @param {JabsBossReaction} reaction The reaction to check.
	* @param {string} where Where in the configuration the reaction lives, named for the error.
	*/
	static #validateHealthTrigger(encounter, reaction, where) {
		const percent = reaction.belowPercent();
		if (percent <= 0 || percent >= 100) {
			const threshold = `waits for health at or below [ ${percent}% ]`;
			throw new Error(`Boss ${where} ${threshold}, which is no turning point a fight has.`);
		}
		reaction.participantKeys().forEach((key) => this.#validateParticipantKey(encounter, key, where));
	}
	/**
	* Confirms a single step refers only to things that exist, judged by what its verb reads.
	* @param {JabsBossEncounter} encounter The encounter owning the step.
	* @param {JabsBossStep} step The step to check.
	* @param {string} where Where in the configuration the step lives, named for the error.
	*/
	static #validateStep(encounter, step, where) {
		switch (step.verb()) {
			case JabsBossManager.Verbs.ForceSkill:
				this.#validateStepParticipant(encounter, step, where);
				this.#validateReference($dataSkills[step.skillId()], step.skillId(), step.expect(), `${where} skill`);
				return;
			case JabsBossManager.Verbs.AddState:
			case JabsBossManager.Verbs.RemoveState:
				this.#validateStepParticipant(encounter, step, where);
				this.#validateReference($dataStates[step.stateId()], step.stateId(), step.expect(), `${where} state`);
				return;
			case JabsBossManager.Verbs.ChangeImage:
				this.#validateStepParticipant(encounter, step, where);
				return;
			case JabsBossManager.Verbs.QuickenRoutine:
				this.#validateRoutineKey(encounter, step.routineKey(), where);
				return;
			case JabsBossManager.Verbs.Spawn:
				this.#validateReference($dataEnemies[step.enemyId()], step.enemyId(), step.expect(), `${where} spawned enemy`);
				return;
			case JabsBossManager.Verbs.Tint:
				this.#validateTone(step, where);
				return;
			case JabsBossManager.Verbs.Animation:
				this.#validateStepParticipant(encounter, step, where);
				this.#validateReference($dataAnimations[step.animationId()], step.animationId(), step.expect(), `${where} animation`);
				return;
			case JabsBossManager.Verbs.Dialogue:
				this.#validateStepParticipant(encounter, step, where);
				this.#validateLines(step, where);
				return;
			case JabsBossManager.Verbs.Blink:
				this.#validateStepParticipant(encounter, step, where);
				this.#validateDirection(step, where);
				return;
			case JabsBossManager.Verbs.LearnSkill:
				this.#validateStepParticipant(encounter, step, where);
				this.#validateReference($dataSkills[step.skillId()], step.skillId(), step.expect(), `${where} skill`);
				return;
			case JabsBossManager.Verbs.StartRoutine:
				this.#validateRoutineKey(encounter, step.routineKey(), where);
				return;
		}
	}
	/**
	* Confirms a blink faces a way a character can face: down, left, right or up, or none to keep its facing.
	*
	* The engine reads any other number as a facing too, and a body facing nowhere fires whatever it fires next
	* at nothing.
	* @param {JabsBossStep} step The step to check.
	* @param {string} where Where in the configuration the step lives, named for the error.
	*/
	static #validateDirection(step, where) {
		if (BLINK_DIRECTIONS.includes(step.direction())) return;
		const facing = `blinks to face [ ${step.direction()} ]`;
		throw new Error(`Boss ${where} ${facing}, which is not down (2), left (4), right (6) or up (8).`);
	}
	/**
	* Confirms a tint names a whole screen tone: red, green, blue and gray.
	*
	* The engine reads a tone by position, so one with a value missing would not fail- it would settle on a
	* color nobody chose.
	* @param {JabsBossStep} step The step to check.
	* @param {string} where Where in the configuration the step lives, named for the error.
	*/
	static #validateTone(step, where) {
		if (step.tone().length === 4) return;
		throw new Error(`Boss ${where} tints the screen to [ ${step.tone()} ], which is not red, green, blue and gray.`);
	}
	/**
	* Confirms a line of dialogue says something.
	*
	* An empty message still opens a window and still holds the fight until the player dismisses it, which
	* reads as the game stalling for no reason.
	* @param {JabsBossStep} step The step to check.
	* @param {string} where Where in the configuration the step lives, named for the error.
	*/
	static #validateLines(step, where) {
		if (step.lines().length > 0) return;
		throw new Error(`Boss ${where} has a participant say nothing at all.`);
	}
	/**
	* Confirms the participant a step acts on is one the encounter has. A step naming nobody acts on the
	* boss, who always exists.
	* @param {JabsBossEncounter} encounter The encounter owning the step.
	* @param {JabsBossStep} step The step to check.
	* @param {string} where Where in the configuration the step lives, named for the error.
	*/
	static #validateStepParticipant(encounter, step, where) {
		const key = step.participantKey();
		if (key === String.empty) return;
		this.#validateParticipantKey(encounter, key, where);
	}
	/**
	* Confirms an encounter has a participant answering to the given name.
	*
	* A misspelled name is not an error anything else would catch: a reaction waiting on it would never
	* fire, and a step acting on it would act on nobody, and the fight would simply play wrong.
	* @param {JabsBossEncounter} encounter The encounter to look in.
	* @param {string} key The participant name to find.
	* @param {string} where Where in the configuration the name was given, named for the error.
	*/
	static #validateParticipantKey(encounter, key, where) {
		const isKnown = encounter.participants().some((participant) => participant.key() === key);
		if (isKnown) return;
		throw new Error(`Boss ${where} names participant [ ${key} ], but the encounter has nobody by that name.`);
	}
	/**
	* Confirms an encounter has a routine answering to the given name.
	* @param {JabsBossEncounter} encounter The encounter to look in.
	* @param {string} key The routine name to find.
	* @param {string} where Where in the configuration the name was given, named for the error.
	*/
	static #validateRoutineKey(encounter, key, where) {
		const isKnown = encounter.routines().some((routine) => routine.key() === key);
		if (isKnown) return;
		throw new Error(`Boss ${where} names routine [ ${key} ], but the encounter has no routine by that name.`);
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
		const drift = `was authored as [ ${expected} ] but is now [ ${actual} ]`;
		throw new Error(`Boss configuration drift: ${description} id [ ${id} ] ${drift}.`);
	}
	/**
	* Gets the {@link JABS_Battler} for the given participant of the active encounter.
	* @param {JabsBossParticipant} participant The participant to resolve.
	* @returns {JABS_Battler|null} The battler, or null when its body is not currently on the map.
	*/
	static getParticipantJabsBattler(participant) {
		const body = this.#participantBodies.get(participant.key());
		if (!body) return null;
		if ($gameMap.event(body.eventId()) !== body) return null;
		if (body.isErased()) return null;
		return body.getJabsBattler();
	}
	/**
	* Determines whether a battler is the body of one of the active encounter's participants: the boss, or any
	* other body the fight is won by felling.
	*
	* What a fight spawns for itself, such as a hazard, is no participant, and neither is anything that was on the
	* map before the fight began.
	* @param {JABS_Battler} jabsBattler The battler to check.
	* @returns {boolean}
	*/
	static isParticipant(jabsBattler) {
		const body = jabsBattler.getCharacter();
		return [...this.#participantBodies.values()].includes(body);
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
		if ($gameMap.isEventRunning()) return;
		this.#lanes.forEach((lane) => this.#updateScene(lane));
		if (this.#isFightHeld()) return;
		this.#lanes.forEach((lane) => this.#runLane(lane));
		this.#lanes = this.#lanes.filter((lane) => this.#isScenePlaying(lane));
		this.#updateReactions();
		this.#updateDefeat();
		this.#activeEncounter.routines().forEach((routine) => this.#updateRoutine(routine));
	}
	/**
	* Advances the scene a lane is playing, if it is playing one.
	* @param {JabsBossLane} lane The lane whose scene to advance.
	*/
	static #updateScene(lane) {
		if (this.#isScenePlaying(lane) === false) return;
		lane.scene.update();
	}
	/**
	* Determines whether a lane is in the middle of playing a scene.
	* @param {JabsBossLane} lane The lane to check.
	* @returns {boolean}
	*/
	static #isScenePlaying(lane) {
		if (lane.scene === null) return false;
		return lane.scene.isRunning();
	}
	/**
	* Fires every reaction whose moment has just arrived.
	*/
	static #updateReactions() {
		this.#activeEncounter.reactions().filter((reaction) => reaction.trigger() !== JabsBossReaction.Triggers.Start).filter((reaction) => this.#isReactionDue(reaction)).forEach((reaction) => this.#fireReaction(reaction));
	}
	/**
	* Determines whether a reaction is due: not yet spent this fight, and its moment has arrived.
	* @param {JabsBossReaction} reaction The reaction to check.
	* @returns {boolean}
	*/
	static #isReactionDue(reaction) {
		if (this.#firedReactions.has(reaction)) return false;
		if (reaction.trigger() === JabsBossReaction.Triggers.Health) return this.#isHealthReached(reaction);
		return reaction.participantKeys().every((key) => this.#participantBodies.get(key).isErased());
	}
	/**
	* Determines whether every participant a health reaction watches is standing at or below its percent.
	* @param {JabsBossReaction} reaction The health reaction to check.
	* @returns {boolean}
	*/
	static #isHealthReached(reaction) {
		return this.#watchedParticipants(reaction).every((participant) => this.#isWornDownTo(participant, reaction.belowPercent()));
	}
	/**
	* Gets the participants a health reaction watches: the ones it names, or the boss when it names nobody.
	* @param {JabsBossReaction} reaction The health reaction.
	* @returns {JabsBossParticipant[]}
	*/
	static #watchedParticipants(reaction) {
		if (reaction.participantKeys().length === 0) return [this.#activeEncounter.primaryParticipant()];
		return reaction.participantKeys().map((key) => this.#participantByKey(key));
	}
	/**
	* Determines whether a participant is still standing, at or below a percent of its health.
	* @param {JabsBossParticipant} participant The participant to measure.
	* @param {number} percent The percent to compare inclusively against.
	* @returns {boolean}
	*/
	static #isWornDownTo(participant, percent) {
		const jabsBattler = this.getParticipantJabsBattler(participant);
		if (!jabsBattler) return false;
		const battler = jabsBattler.getBattler();
		if (battler.isDead()) return false;
		return battler.currentHpPercent100() <= percent;
	}
	/**
	* Spends a reaction, then performs it.
	* @param {JabsBossReaction} reaction The reaction to fire.
	*/
	static #fireReaction(reaction) {
		this.#firedReactions.add(reaction);
		this.#performReaction(reaction);
	}
	/**
	* Performs each of a reaction's steps, in order.
	* @param {JabsBossReaction} reaction The reaction to perform.
	*/
	static #performReaction(reaction) {
		this.#performSteps(reaction, reaction.steps());
	}
	/**
	* Opens a lane for steps, then plays as many of them as may play right now.
	* @param {JabsBossRoutine|JabsBossReaction} owner The routine or reaction whose steps these are.
	* @param {JabsBossStep[]} steps The steps to perform, in order.
	*/
	static #performSteps(owner, steps) {
		const lane = {
			owner,
			steps: [...steps],
			scene: null
		};
		this.#lanes.push(lane);
		this.#runLane(lane);
	}
	/**
	* Plays a lane's steps in order, stopping at a scene: every step behind one waits until it is over.
	* @param {JabsBossLane} lane The lane to play.
	*/
	static #runLane(lane) {
		while (lane.steps.length > 0 && this.#isScenePlaying(lane) === false) {
			const step = lane.steps.shift();
			this.#executeStep(step, lane);
		}
	}
	/**
	* Settles the active encounter as won on the first frame every one of its bodies has fallen, and lets
	* the story know.
	*/
	static #updateDefeat() {
		if (this.#bossDefeated) return;
		if (!this.#isEveryBodyGone()) return;
		this.#bossDefeated = true;
		this.#clearExtraBodies();
		this.#lanes = [];
		this.#announceDefeat();
	}
	/**
	* Determines whether every body the active encounter spawned has fallen and finished dying.
	*
	* J-ABS erases a fallen body only once its death scene has played out, so an erased body is one whose
	* last words have all been said. Each body is asked directly rather than looked up on the map: a body
	* the map no longer holds may only have been left behind by a player walking off of it, which is not
	* the same thing at all as a boss that has fallen.
	* @returns {boolean}
	*/
	static #isEveryBodyGone() {
		return this.#activeEncounter.participants().every((participant) => this.#participantBodies.get(participant.key()).isErased());
	}
	/**
	* Turns on the active encounter's defeat switch, when it names one and the fight was won in its arena.
	*/
	static #announceDefeat() {
		if ($gameMap.mapId() !== this.#activeEncounter.mapId()) return;
		const switchId = this.#activeEncounter.defeatSwitchId();
		if (switchId === 0) return;
		$gameSwitches.setValue(switchId, true);
	}
	/**
	* Determines whether the fight is being held still for a message, the way the battle system holds every
	* battler while one is on screen. A participant's own line counts: by the time this is asked, any line
	* being said has already been put on screen.
	* @returns {boolean}
	*/
	static #isFightHeld() {
		return $gameMessage.isBusy();
	}
	/**
	* Advances a single routine by one frame, executing it when it comes due.
	* @param {JabsBossRoutine} routine The routine to advance.
	*/
	static #updateRoutine(routine) {
		if (this.#routineCountdowns.has(routine.key()) === false) return;
		const remaining = this.#routineCountdowns.get(routine.key());
		if (remaining > 0) {
			this.#routineCountdowns.set(routine.key(), remaining - 1);
			return;
		}
		if (this.#isRoutinePlaying(routine)) return;
		if (this.#canExecuteRoutine() === false) return;
		this.#executeRoutine(routine);
		this.#routineCountdowns.set(routine.key(), this.#routineCadences.get(routine.key()));
	}
	/**
	* Determines whether the active encounter's boss is in a state where a routine may execute.
	*
	* A routine's turn is judged by the boss, whichever participant its steps act on: the boss is who the
	* fight's rhythm belongs to.
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
	* Determines whether a routine's last run is still playing.
	* @param {JabsBossRoutine} routine The routine to check.
	* @returns {boolean}
	*/
	static #isRoutinePlaying(routine) {
		return this.#lanes.some((lane) => lane.owner === routine);
	}
	/**
	* Performs every step of a routine, in order.
	* @param {JabsBossRoutine} routine The routine to perform.
	*/
	static #executeRoutine(routine) {
		this.#performSteps(routine, routine.steps());
	}
	/**
	* Performs a single step of a routine or reaction.
	* @param {JabsBossStep} step The step to perform.
	* @param {JabsBossLane} lane The lane playing it, which a step that takes time plays its scene on.
	*/
	static #executeStep(step, lane) {
		switch (step.verb()) {
			case JabsBossManager.Verbs.ForceSkill:
				this.#executeForceSkill(step);
				break;
			case JabsBossManager.Verbs.AddState:
				this.#executeAddState(step);
				break;
			case JabsBossManager.Verbs.RemoveState:
				this.#executeRemoveState(step);
				break;
			case JabsBossManager.Verbs.ChangeImage:
				this.#executeChangeImage(step);
				break;
			case JabsBossManager.Verbs.QuickenRoutine:
				this.#executeQuickenRoutine(step);
				break;
			case JabsBossManager.Verbs.Spawn:
				this.#executeSpawn(step);
				break;
			case JabsBossManager.Verbs.Tint:
				this.#executeTint(step);
				break;
			case JabsBossManager.Verbs.Animation:
				this.#executeAnimation(step);
				break;
			case JabsBossManager.Verbs.Dialogue:
				this.#executeDialogue(step, lane);
				break;
			case JabsBossManager.Verbs.Blink:
				this.#executeBlink(step, lane);
				break;
			case JabsBossManager.Verbs.Wait:
				this.#executeWait(step, lane);
				break;
			case JabsBossManager.Verbs.LearnSkill:
				this.#executeLearnSkill(step);
				break;
			case JabsBossManager.Verbs.StartRoutine:
				this.#executeStartRoutine(step);
				break;
			default: throw new Error(`Unrecognized boss step verb: [ ${step.verb()} ].`);
		}
	}
	/**
	* Gets the battler a step acts on: the participant it names, or the boss when it names nobody.
	* @param {JabsBossStep} step The step being performed.
	* @returns {JABS_Battler|null} The battler, or null when that participant has no body on the map.
	*/
	static #stepJabsBattler(step) {
		const participant = this.#stepParticipant(step);
		return this.getParticipantJabsBattler(participant);
	}
	/**
	* Gets the participant a step acts on: the one it names, or the boss when it names nobody.
	* @param {JabsBossStep} step The step being performed.
	* @returns {JabsBossParticipant}
	*/
	static #stepParticipant(step) {
		const key = step.participantKey();
		if (key === String.empty) return this.#activeEncounter.primaryParticipant();
		return this.#participantByKey(key);
	}
	/**
	* Gets the active encounter's participant answering to the given name.
	* @param {string} key The participant's author-facing name.
	* @returns {JabsBossParticipant}
	*/
	static #participantByKey(key) {
		return this.#activeEncounter.participants().find((participant) => participant.key() === key);
	}
	/**
	* Makes a participant perform the skill named by a step.
	*
	* There are two genuinely different ways to make a battler use a skill, and which one is correct
	* depends entirely on whether the skill has a telegraph worth preserving.
	* @param {JabsBossStep} step The step naming the skill to perform.
	*/
	static #executeForceSkill(step) {
		const jabsBattler = this.#stepJabsBattler(step);
		if (!jabsBattler) return;
		if (step.isCast() === false) {
			$jabsEngine.forceMapAction(jabsBattler, step.skillId(), false);
			return;
		}
		const actionOptions = JABS_ActionOptions.Builder().build();
		const actions = jabsBattler.createJabsActionFromSkill(step.skillId(), actionOptions);
		jabsBattler.setDecidedAction(actions);
		const [primaryAction] = actions;
		jabsBattler.setCastCountdown(primaryAction.getCastTime());
		if (jabsBattler.canBattlerMove() === false) {
			jabsBattler.setInPosition(true);
		}
		jabsBattler.setPhase(2);
	}
	/**
	* Puts the state named by a step on its participant.
	* @param {JabsBossStep} step The step naming the participant and the state.
	*/
	static #executeAddState(step) {
		const jabsBattler = this.#stepJabsBattler(step);
		if (!jabsBattler) return;
		const battler = jabsBattler.getBattler();
		battler.addState(step.stateId(), battler);
	}
	/**
	* Takes the state named by a step off its participant.
	* @param {JabsBossStep} step The step naming the participant and the state.
	*/
	static #executeRemoveState(step) {
		const jabsBattler = this.#stepJabsBattler(step);
		if (!jabsBattler) return;
		const battler = jabsBattler.getBattler();
		battler.removeState(step.stateId());
	}
	/**
	* Changes what a step's participant looks like.
	*
	* A spawned body has a single page, so nothing that refreshes the map can put its old look back: a page
	* is only set up again when the event changes which page it is on.
	* @param {JabsBossStep} step The step naming the participant and its new look.
	*/
	static #executeChangeImage(step) {
		const jabsBattler = this.#stepJabsBattler(step);
		if (!jabsBattler) return;
		const body = jabsBattler.getCharacter();
		body.setImage(step.characterName(), step.characterIndex());
	}
	/**
	* Shortens how long the routine named by a step waits between executions.
	* @param {JabsBossStep} step The step naming the routine and by how much.
	*/
	static #executeQuickenRoutine(step) {
		const key = step.routineKey();
		const cadence = this.#routineCadences.get(key);
		this.#routineCadences.set(key, cadence - step.frames());
		if (this.#routineCountdowns.has(key) === false) return;
		const remaining = this.#routineCountdowns.get(key);
		this.#routineCountdowns.set(key, remaining - step.frames());
	}
	/**
	* Wakes the dormant routine a step names: it plays at once, then keeps its cadence from there.
	*
	* A fight that turns a corner- a summoner starting at two thirds, a tour of the room starting at two fifths- is a
	* routine that sat dormant until a reaction to that moment started it.
	* @param {JabsBossStep} step The step naming the routine.
	*/
	static #executeStartRoutine(step) {
		const key = step.routineKey();
		if (this.#routineCountdowns.has(key)) return;
		this.#routineCountdowns.set(key, 0);
	}
	/**
	* Puts the body a step names onto its tile, as part of the fight without being a body the fight needs
	* felled.
	* @param {JabsBossStep} step The step naming the enemy, its template, its tile, and how it arrives.
	*/
	static #executeSpawn(step) {
		const body = $jabsEngine.addEnemyToMap(step.x(), step.y(), step.templateId());
		const who = `encounter [ ${this.#activeEncounter.key()} ] spawn of enemy [ ${step.enemyId()} ]`;
		this.#confirmBody(body, step.enemyId(), step.templateId(), who);
		this.#extraBodies.push(body);
		if (step.animationId() > 0) {
			$gameTemp.requestAnimation([body], step.animationId());
		}
	}
	/**
	* Teaches the participant a step names the skill it names, so its own AI can use it from now on.
	* @param {JabsBossStep} step The step naming the participant and the skill.
	*/
	static #executeLearnSkill(step) {
		const jabsBattler = this.#stepJabsBattler(step);
		if (!jabsBattler) return;
		jabsBattler.getBattler().learnSkill(step.skillId());
	}
	/**
	* Shifts the whole screen toward the tone a step names, over the time it names.
	* @param {JabsBossStep} step The step naming the tone and how long it takes to settle.
	*/
	static #executeTint(step) {
		if (this.#toneBeforeFight.length === 0) {
			this.#toneBeforeFight = [...$gameScreen.tone()];
		}
		$gameScreen.startTint(step.tone(), step.frames());
	}
	/**
	* Plays the animation a step names over its participant.
	* @param {JabsBossStep} step The step naming the participant and the animation.
	*/
	static #executeAnimation(step) {
		const jabsBattler = this.#stepJabsBattler(step);
		if (!jabsBattler) return;
		const body = jabsBattler.getCharacter();
		$gameTemp.requestAnimation([body], step.animationId());
	}
	/**
	* Has a step's participant say its line, holding the fight until the player has read it.
	* @param {JabsBossStep} step The step naming the participant, their face and name, and their line.
	* @param {JabsBossLane} lane The lane playing it.
	*/
	static #executeDialogue(step, lane) {
		const jabsBattler = this.#stepJabsBattler(step);
		if (!jabsBattler) return;
		const speaker = jabsBattler.getCharacter();
		const commands = this.#dialogueCommands(step);
		this.#playScene(lane, commands, speaker.eventId());
	}
	/**
	* Builds the event commands that say a step's line: one Show Text with the speaker's face and name, then each
	* of its lines, then the end of the list.
	* @param {JabsBossStep} step The step naming the speaker and the line.
	* @returns {object[]}
	*/
	static #dialogueCommands(step) {
		const showText = this.#command(101, [
			step.face(),
			step.faceIndex(),
			0,
			2,
			step.speaker()
		]);
		const textLines = step.lines().map((line) => this.#command(401, [line]));
		return [
			showText,
			...textLines,
			this.#endOfList()
		];
	}
	/**
	* Has a step's participant blink across the room: it flares and fades from where it stands, and a moment later
	* fades back in on the tile the step names, facing the way it names.
	* @param {JabsBossStep} step The step naming the participant, the tile, the facing, and the flare.
	* @param {JabsBossLane} lane The lane playing it.
	*/
	static #executeBlink(step, lane) {
		const jabsBattler = this.#stepJabsBattler(step);
		if (!jabsBattler) return;
		const body = jabsBattler.getCharacter();
		const commands = this.#blinkCommands(step);
		this.#playScene(lane, commands, body.eventId());
	}
	/**
	* Builds the event commands for a blink, every one of them acting on the event playing it.
	* @param {JabsBossStep} step The step naming the tile, the facing, and the flare.
	* @returns {object[]}
	*/
	static #blinkCommands(step) {
		const flare = this.#flareCommands(step);
		const fadeOut = this.#fadeRoute(BLINK_FADE_OUT, false);
		const fadeIn = this.#fadeRoute(BLINK_FADE_IN, true);
		const vanish = [
			...flare,
			this.#command(205, [0, fadeOut]),
			this.#command(230, [BLINK_AWAY_FRAMES])
		];
		const arrive = [
			this.#command(203, [
				0,
				0,
				step.x(),
				step.y(),
				step.direction()
			]),
			...flare,
			this.#command(205, [0, fadeIn]),
			this.#command(230, [BLINK_SETTLE_FRAMES])
		];
		return [
			...vanish,
			...arrive,
			this.#endOfList()
		];
	}
	/**
	* Builds the command that plays a step's flare over the event playing it, when the step names one.
	* @param {JabsBossStep} step The step naming the flare.
	* @returns {object[]} The command, or none when the step names no animation.
	*/
	static #flareCommands(step) {
		if (step.animationId() === 0) return [];
		return [this.#command(212, [
			0,
			step.animationId(),
			false
		])];
	}
	/**
	* Builds a move route that walks a body's opacity through the given values, a few frames apart.
	* @param {number[]} opacities The opacities to pass through, in order.
	* @param {boolean} wait Whether the scene waits for the fade to finish before moving on.
	* @returns {object}
	*/
	static #fadeRoute(opacities, wait) {
		const fade = opacities.flatMap((opacity) => [{
			code: 42,
			parameters: [opacity]
		}, {
			code: 15,
			parameters: [BLINK_FADE_STEP_FRAMES]
		}]);
		return {
			list: [...fade, {
				code: 0,
				parameters: []
			}],
			repeat: false,
			skippable: true,
			wait
		};
	}
	/**
	* Holds a step's lane for the time the step names, before anything behind it plays.
	* @param {JabsBossStep} step The step naming how long.
	* @param {JabsBossLane} lane The lane to hold.
	*/
	static #executeWait(step, lane) {
		const commands = [this.#command(230, [step.frames()]), this.#endOfList()];
		this.#playScene(lane, commands, 0);
	}
	/**
	* Plays event commands on a lane as a scene, run by an interpreter belonging to the given event.
	*
	* Running them the way an event runs them is what lets "this event" in a command, and anything reading who is
	* speaking, mean the participant- exactly as it would during a scene the map plays.
	* @param {JabsBossLane} lane The lane to play the scene on.
	* @param {object[]} commands The event commands, ending with the end of the list.
	* @param {number} eventId The event the scene belongs to, or zero for none.
	*/
	static #playScene(lane, commands, eventId) {
		const scene = new Game_Interpreter();
		scene.setup(commands, eventId);
		lane.scene = scene;
	}
	/**
	* Builds a single event command at the top level of a list.
	* @param {number} code The command's code.
	* @param {Array} parameters The command's parameters.
	* @returns {object}
	*/
	static #command(code, parameters) {
		return {
			code,
			indent: 0,
			parameters
		};
	}
	/**
	* Builds the command that ends an event list, where an interpreter stops.
	* @returns {object}
	*/
	static #endOfList() {
		return this.#command(0, []);
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
*
* A participant is not an event on any particular map. It names an enemy and the tile that enemy
* appears on, and the encounter spawns it from the enemy clone map onto whichever map the fight
* starts on. That is what lets one encounter run unchanged in its real arena and in a test hall built
* in the same shape: neither map holds the boss, so neither map's event numbering has to agree with
* anything, and no editor ever has to be talked into assigning an event a particular id.
*
* Usually the template it spawns from is the one in the slot matching its enemy id. A participant can
* name a different template instead, for a body that is that same enemy but dressed for this one fight:
* a prefix it always wears, a role it plays, a level it fights at. The enemy's own template stays exactly
* as it is for every other place that enemy turns up.
*/
var JabsBossParticipant = class {
	/**
	* The author-facing name for this participant, used to reference it from elsewhere in the config.
	* @type {string}
	*/
	#key = String.empty;
	/**
	* The id of the enemy in the database that this participant is.
	*
	* The body spawned for it has to turn out to be this enemy, whichever template it came from.
	* @type {number}
	*/
	#enemyId = 0;
	/**
	* The id of the event on the enemy clone map this participant spawns from.
	*
	* The clone map keeps each enemy's own template in the slot matching its enemy id, so that slot is
	* what a participant spawns from unless it names another. A template of its own sits past the last
	* enemy id, where no enemy added later can ever claim the slot.
	* @type {number}
	*/
	#templateId = 0;
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
	* The x coordinate of the tile this participant appears on when the encounter starts.
	* @type {number}
	*/
	#x = 0;
	/**
	* The y coordinate of the tile this participant appears on when the encounter starts.
	* @type {number}
	*/
	#y = 0;
	/**
	* Constructor.
	* @param {string} key The author-facing name for this participant.
	* @param {number} enemyId The id of the enemy this participant is.
	* @param {string} expect The enemy name recorded when this encounter was authored.
	* @param {number} x The x coordinate of the tile this participant appears on.
	* @param {number} y The y coordinate of the tile this participant appears on.
	* @param {number} templateId The id of the clone map event this participant spawns from.
	*/
	constructor(key, enemyId, expect, x, y, templateId) {
		this.#key = key;
		this.#enemyId = enemyId;
		this.#expect = expect;
		this.#x = x;
		this.#y = y;
		this.#templateId = templateId;
	}
	/**
	* Gets the author-facing name for this participant.
	* @returns {string}
	*/
	key() {
		return this.#key;
	}
	/**
	* Gets the id of the enemy this participant is.
	* @returns {number}
	*/
	enemyId() {
		return this.#enemyId;
	}
	/**
	* Gets the id of the clone map event this participant spawns from.
	* @returns {number}
	*/
	templateId() {
		return this.#templateId;
	}
	/**
	* Gets the enemy name recorded when this encounter was authored.
	* @returns {string}
	*/
	expect() {
		return this.#expect;
	}
	/**
	* Gets the x coordinate of the tile this participant appears on when the encounter starts.
	* @returns {number}
	*/
	x() {
		return this.#x;
	}
	/**
	* Gets the y coordinate of the tile this participant appears on when the encounter starts.
	* @returns {number}
	*/
	y() {
		return this.#y;
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
	* Whether this routine waits, not running at all, until a step starts it.
	*
	* Most of what a fight keeps doing, it does from the first frame. Some of it only begins once the fight turns a
	* corner- a summoner from two thirds of the boss's health on- and a reaction to that moment is what starts it.
	* @type {boolean}
	*/
	#dormant = false;
	/**
	* Constructor.
	* @param {string} key The author-facing name for this routine.
	* @param {number} cadenceFrames How many frames elapse between executions.
	* @param {JabsBossStep[]} steps The steps performed each time this routine comes due.
	* @param {boolean} dormant Whether this routine waits for a step to start it.
	*/
	constructor(key, cadenceFrames, steps, dormant = false) {
		this.#key = key;
		this.#cadenceFrames = cadenceFrames;
		this.#steps = steps;
		this.#dormant = dormant;
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
	/**
	* Gets whether this routine waits, not running at all, until a step starts it.
	* @returns {boolean}
	*/
	isDormant() {
		return this.#dormant;
	}
};

//#endregion
//#region src/plugins/abs/ext/boss/models/JabsBossStep.js
/**
* One instruction inside a boss routine or reaction.
*
* A step is the smallest unit an encounter can express, and the vocabulary is deliberately small:
* every operation observed across the existing hand-evented boss fights reduces to a handful of
* these. Only the verbs a shipped fight actually needs are implemented- an unimplemented verb is
* an unexercised code path, and this system earns its keep by being trustworthy rather than broad.
*
* Every step carries every field any verb reads. A verb reads only the ones it has a use for, and the
* rest sit at their "none", which keeps one shape for every step whichever verb it names.
*/
var JabsBossStep = class {
	/**
	* Everything a step can be told, whichever verb it performs.
	* @typedef {Object} JabsBossStepDetails
	* @property {string} participantKey The participant the step acts on, or empty for the primary.
	* @property {number} skillId The skill a forced skill performs.
	* @property {number} stateId The state added to or removed from the participant.
	* @property {string} expect The name the referenced skill, state, enemy or animation carried when authored.
	* @property {boolean} cast Whether a forced skill observes its own cast time.
	* @property {string} characterName The character sheet a participant changes into.
	* @property {number} characterIndex The character on that sheet.
	* @property {string} routineKey The routine a quickening speeds up.
	* @property {number} frames How many frames a quickening takes off that routine's cadence, or a tint takes to settle.
	* @property {number} enemyId The enemy a spawn puts on the map.
	* @property {number} templateId The slot on the enemy clone map a spawn copies its body from.
	* @property {number} x The tile column a spawn puts its body on, or a blink takes its participant to.
	* @property {number} y The tile row a spawn puts its body on, or a blink takes its participant to.
	* @property {number} direction The way a blink leaves its participant facing, or zero to keep its facing.
	* @property {number[]} tone The screen tone a tint settles on: red, green, blue and gray.
	* @property {number} animationId The animation played over a participant, a blink's flare, or a spawn's arrival.
	* @property {string} face The face image shown with a participant's line, or empty for none.
	* @property {number} faceIndex The face on that image.
	* @property {string} speaker The name shown with a participant's line.
	* @property {string[]} lines The text a participant says, shown together as one message.
	*/
	/**
	* The verb this step performs.
	* @type {string}
	*/
	#verb = String.empty;
	/**
	* The author-facing name of the participant this step acts on.
	*
	* Empty means the encounter's primary participant- "the boss"- because that is who the overwhelming
	* majority of steps are about.
	* @type {string}
	*/
	#participantKey = String.empty;
	/**
	* The id of the skill this step performs, for a forced skill.
	* @type {number}
	*/
	#skillId = 0;
	/**
	* The id of the state this step adds or removes.
	* @type {number}
	*/
	#stateId = 0;
	/**
	* The name the skill, state, enemy or animation this step references had when it was authored, used to
	* detect database drift. Empty means the author recorded no name to check against.
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
	* The character sheet this step changes its participant into.
	* @type {string}
	*/
	#characterName = String.empty;
	/**
	* The character on that sheet this step changes its participant into.
	* @type {number}
	*/
	#characterIndex = 0;
	/**
	* The author-facing name of the routine this step speeds up.
	* @type {string}
	*/
	#routineKey = String.empty;
	/**
	* How many frames this step works across: how much a quickening takes off its routine's cadence, or how
	* long a tint takes to settle.
	* @type {number}
	*/
	#frames = 0;
	/**
	* The id of the enemy this step puts on the map, for a spawn.
	* @type {number}
	*/
	#enemyId = 0;
	/**
	* The slot on the enemy clone map this step copies its body from, for a spawn.
	*
	* Already resolved: an author naming no template of their own gets the slot matching the enemy's id.
	* @type {number}
	*/
	#templateId = 0;
	/**
	* The tile column this step puts its body on, for a spawn, or takes its participant to, for a blink.
	* @type {number}
	*/
	#x = 0;
	/**
	* The tile row this step puts its body on, for a spawn, or takes its participant to, for a blink.
	* @type {number}
	*/
	#y = 0;
	/**
	* The way this step leaves its participant facing, for a blink: 2, 4, 6 or 8, or zero to keep its facing.
	* @type {number}
	*/
	#direction = 0;
	/**
	* The screen tone this step settles on, for a tint: red, green, blue and gray.
	* @type {number[]}
	*/
	#tone = [];
	/**
	* The id of the animation this step plays: over its participant, as a blink's flare, or as a spawn's arrival.
	* Zero plays none.
	* @type {number}
	*/
	#animationId = 0;
	/**
	* The face image shown with this step's line, for dialogue, or empty for none.
	* @type {string}
	*/
	#face = String.empty;
	/**
	* The face on that image shown with this step's line.
	* @type {number}
	*/
	#faceIndex = 0;
	/**
	* The name shown with this step's line, for dialogue.
	* @type {string}
	*/
	#speaker = String.empty;
	/**
	* The text this step's participant says, for dialogue, shown together as one message.
	* @type {string[]}
	*/
	#lines = [];
	/**
	* Constructor.
	* @param {string} verb The verb this step performs.
	* @param {JabsBossStepDetails} details Everything the step was told, with each unused field at its "none".
	*/
	constructor(verb, details) {
		this.#verb = verb;
		this.#participantKey = details.participantKey;
		this.#skillId = details.skillId;
		this.#stateId = details.stateId;
		this.#expect = details.expect;
		this.#cast = details.cast;
		this.#characterName = details.characterName;
		this.#characterIndex = details.characterIndex;
		this.#routineKey = details.routineKey;
		this.#frames = details.frames;
		this.#enemyId = details.enemyId;
		this.#templateId = details.templateId;
		this.#x = details.x;
		this.#y = details.y;
		this.#direction = details.direction;
		this.#tone = details.tone;
		this.#animationId = details.animationId;
		this.#face = details.face;
		this.#faceIndex = details.faceIndex;
		this.#speaker = details.speaker;
		this.#lines = details.lines;
	}
	/**
	* Gets the verb this step performs.
	* @returns {string}
	*/
	verb() {
		return this.#verb;
	}
	/**
	* Gets the author-facing name of the participant this step acts on, which is empty for the primary.
	* @returns {string}
	*/
	participantKey() {
		return this.#participantKey;
	}
	/**
	* Gets the id of the skill this step performs.
	* @returns {number}
	*/
	skillId() {
		return this.#skillId;
	}
	/**
	* Gets the id of the state this step adds or removes.
	* @returns {number}
	*/
	stateId() {
		return this.#stateId;
	}
	/**
	* Gets the skill or state name recorded when this step was authored.
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
	/**
	* Gets the character sheet this step changes its participant into.
	* @returns {string}
	*/
	characterName() {
		return this.#characterName;
	}
	/**
	* Gets the character on that sheet this step changes its participant into.
	* @returns {number}
	*/
	characterIndex() {
		return this.#characterIndex;
	}
	/**
	* Gets the author-facing name of the routine this step speeds up.
	* @returns {string}
	*/
	routineKey() {
		return this.#routineKey;
	}
	/**
	* Gets how many frames this step works across: what a quickening takes off its routine's cadence, or how
	* long a tint takes to settle.
	* @returns {number}
	*/
	frames() {
		return this.#frames;
	}
	/**
	* Gets the id of the enemy this step puts on the map.
	* @returns {number}
	*/
	enemyId() {
		return this.#enemyId;
	}
	/**
	* Gets the slot on the enemy clone map this step copies its body from.
	* @returns {number}
	*/
	templateId() {
		return this.#templateId;
	}
	/**
	* Gets the tile column this step puts its body on, or takes its participant to.
	* @returns {number}
	*/
	x() {
		return this.#x;
	}
	/**
	* Gets the tile row this step puts its body on, or takes its participant to.
	* @returns {number}
	*/
	y() {
		return this.#y;
	}
	/**
	* Gets the way this step leaves its participant facing, which is zero to keep its facing.
	* @returns {number}
	*/
	direction() {
		return this.#direction;
	}
	/**
	* Gets the screen tone this step settles on: red, green, blue and gray.
	* @returns {number[]}
	*/
	tone() {
		return this.#tone;
	}
	/**
	* Gets the id of the animation this step plays, which is zero when it plays none.
	* @returns {number}
	*/
	animationId() {
		return this.#animationId;
	}
	/**
	* Gets the face image shown with this step's line, which is empty for none.
	* @returns {string}
	*/
	face() {
		return this.#face;
	}
	/**
	* Gets the face on that image shown with this step's line.
	* @returns {number}
	*/
	faceIndex() {
		return this.#faceIndex;
	}
	/**
	* Gets the name shown with this step's line.
	* @returns {string}
	*/
	speaker() {
		return this.#speaker;
	}
	/**
	* Gets the text this step's participant says, shown together as one message.
	* @returns {string[]}
	*/
	lines() {
		return this.#lines;
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
		const defeatSwitchId = rawEncounter.defeatSwitch ?? 0;
		const rawReactions = rawEncounter.reactions ?? [];
		const reactions = rawReactions.map((raw) => this.parseReaction(raw));
		const { key, map } = rawEncounter;
		return new JabsBossEncounter(key, map, participants, aiControl, routines, defeatSwitchId, reactions);
	}
	/**
	* Builds one participant out of its raw configuration.
	*
	* A participant names an enemy and the tile it appears on rather than an event, because the
	* encounter spawns its own bodies when it starts. The same configuration then serves every map the
	* fight is staged on.
	* @param {any} rawParticipant The unparsed participant from configuration.
	* @returns {JabsBossParticipant}
	*/
	parseParticipant(rawParticipant) {
		const { key, enemyId, expect, x, y } = rawParticipant;
		const template = rawParticipant.template ?? 0;
		const templateId = template === 0 ? enemyId : template;
		return new JabsBossParticipant(key, enemyId, expect, x, y, templateId);
	}
	/**
	* Builds one reaction out of its raw configuration.
	* @param {any} rawReaction The unparsed reaction from configuration.
	* @returns {JabsBossReaction}
	*/
	parseReaction(rawReaction) {
		const { key, on } = rawReaction;
		const participantKeys = rawReaction.participants ?? [];
		const steps = rawReaction.steps.map((raw) => this.parseStep(raw));
		const belowPercent = rawReaction.below ?? 0;
		return new JabsBossReaction(key, on, participantKeys, steps, belowPercent);
	}
	/**
	* Builds one routine out of its raw configuration.
	* @param {any} rawRoutine The unparsed routine from configuration.
	* @returns {JabsBossRoutine}
	*/
	parseRoutine(rawRoutine) {
		const cadenceFrames = this.secondsToFrames(rawRoutine.cadence);
		const steps = rawRoutine.steps.map((raw) => this.parseStep(raw));
		const dormant = rawRoutine.dormant === true;
		return new JabsBossRoutine(rawRoutine.key, cadenceFrames, steps, dormant);
	}
	/**
	* Builds one step out of its raw configuration.
	* @param {any} rawStep The unparsed step from configuration.
	* @returns {JabsBossStep}
	*/
	parseStep(rawStep) {
		const details = {
			...this.parseStepReferences(rawStep),
			...this.parseStepPlacement(rawStep),
			...this.parseStepPresentation(rawStep)
		};
		return new JabsBossStep(rawStep.verb, details);
	}
	/**
	* Reads what a step acts on and refers to: its participant, the skill, state or routine it names, and the
	* time it works across.
	* @param {any} rawStep The unparsed step from configuration.
	* @returns {Object} Those fields of the step's details.
	*/
	parseStepReferences(rawStep) {
		return {
			participantKey: rawStep.participant ?? String.empty,
			skillId: rawStep.skill ?? 0,
			stateId: rawStep.state ?? 0,
			expect: rawStep.expect ?? String.empty,
			cast: rawStep.cast !== false,
			routineKey: rawStep.routine ?? String.empty,
			frames: this.secondsToFrames(rawStep.seconds ?? 0)
		};
	}
	/**
	* Reads where a step puts things: the enemy a spawn puts on the map, the clone map slot it copies, and the
	* tile and facing a spawn or a blink lands on.
	* @param {any} rawStep The unparsed step from configuration.
	* @returns {Object} Those fields of the step's details.
	*/
	parseStepPlacement(rawStep) {
		const enemyId = rawStep.enemyId ?? 0;
		const template = rawStep.template ?? 0;
		const templateId = template === 0 ? enemyId : template;
		return {
			enemyId,
			templateId,
			x: rawStep.x ?? 0,
			y: rawStep.y ?? 0,
			direction: rawStep.direction ?? 0
		};
	}
	/**
	* Reads how a step looks and sounds: a changed look, a tint, an animation, and a line with its face and speaker.
	* @param {any} rawStep The unparsed step from configuration.
	* @returns {Object} Those fields of the step's details.
	*/
	parseStepPresentation(rawStep) {
		return {
			characterName: rawStep.image ?? String.empty,
			characterIndex: rawStep.index ?? 0,
			tone: rawStep.tone ?? [],
			animationId: rawStep.animation ?? 0,
			face: rawStep.face ?? String.empty,
			faceIndex: rawStep.faceIndex ?? 0,
			speaker: rawStep.speaker ?? String.empty,
			lines: rawStep.lines ?? []
		};
	}
	/**
	* Translates an author-facing count of seconds into engine frames, rounded to a whole frame.
	* @param {number} seconds The seconds to translate.
	* @returns {number}
	*/
	secondsToFrames(seconds) {
		return Math.round(seconds * FRAMES_PER_SECOND);
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
J.ABS.EXT.BOSS.Aliased = {
	Game_Map: new Map(),
	JABS_Engine: new Map()
};
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
//#region src/plugins/abs/ext/boss/objects/JABS_Engine.js
/**
* Extends {@link #resolveKnockbackDistance}.<br/>
* Also keeps every participant of the boss fight exactly where it stands.
*
* A boss is immune to knockback outright, however hard it is hit and whatever it otherwise resists. A boss that
* can be shoved around its own arena can be wedged into a doorway or pinned in a corner, and then the fight is
* fought against the walls of the room rather than against the boss. Only being moved is refused: every state a
* hit carries, a stun among them, still lands.
*/
J.ABS.EXT.BOSS.Aliased.JABS_Engine.set("resolveKnockbackDistance", JABS_Engine.prototype.resolveKnockbackDistance);
JABS_Engine.prototype.resolveKnockbackDistance = function(action, target) {
	if (JabsBossManager.isParticipant(target)) return null;
	return J.ABS.EXT.BOSS.Aliased.JABS_Engine.get("resolveKnockbackDistance").call(this, action, target);
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