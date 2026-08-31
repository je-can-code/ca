//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 MOTION-PASSIVE] Passive states can declare sprite motion.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Motion
 * @base J-Motion-ABS
 * @base J-Passive
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Motion
 * @orderAfter J-Motion-ABS
 * @orderAfter J-Passive
 * @help
 * ============================================================================
 * OVERVIEW
 * J-Motion-ABS lets an APPLIED state declare a motion. This lets a PASSIVE one
 * do the same. It adds no tag and no parameter of its own- the whole plugin is
 * one more place the <motion:...> tag is honoured.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; a battler needs a presence on the map before it can be animated.
 * - J-Motion; this extension is meaningless without motion.
 * - J-Motion-ABS; the bridge between a battler and its character lives there.
 * - J-Passive; this extension is meaningless without passive states.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * WHY THIS IS A SEPARATE PLUGIN
 * An applied state announces its own arrival and departure, so J-Motion-ABS
 * animates one by listening. A passive announces neither. Passives are granted
 * by rebuilding the whole set from every source a battler owns- its own row,
 * its states, its skills, its equipment, the event that spawned it- and they
 * are refused by the ordinary state-adding path outright, so there is no
 * arrival to hear.
 *
 * This plugin therefore reconciles instead of listening: whenever that set is
 * rebuilt, it asks what the battler is carrying now and settles the difference.
 * That is a genuinely different mechanism, which is why it is a genuinely
 * different plugin rather than a few more lines in J-Motion-ABS.
 *
 * WHAT THAT BUYS YOU
 * Because it reconciles, it never goes stale:
 *
 * - An affix rolled onto an enemy at spawn animates from its first frame.
 * - A passive granted by a weapon starts and stops with the equipping.
 * - A passive that J-Passive-Conditional gates on and off mid-fight starts and
 *   stops the motion with the gate, without either plugin knowing about the
 *   other.
 * - Party cycling moves the leader's passive motions to whoever is leading now,
 *   rather than stranding them on the character the player drives.
 *
 * STACKS
 * A passive applied several times over animates once. Three stacks of the same
 * state are still one thing the sprite is doing, and animating it three times
 * would move the sprite three times as far as the tag asked for.
 *
 * ============================================================================
 * TAG FORMAT:
 * There is no tag of this plugin's own. Write J-Motion's:
 *
 *  <motion:[TYPE]>
 *  <motion:[TYPE, PARAM, ...]>
 *
 * TAG USAGE:
 * - States, when they are being granted as passives.
 *
 * TAG EXAMPLES:
 *  <motion:[scale,150]>
 * A creature carrying this passive is half again its usual size. Useful on an
 * affix, where the size IS the warning.
 *
 *  <motion:[throb,80,0,0,0,90]>
 * A creature carrying this passive pulses red, continuously, for as long as it
 * has the passive.
 *
 * ============================================================================
 * WHICH MOTION WINS:
 * When two sources want the same thing from a sprite- both want to scale it,
 * say- the more fleeting one wins, on the reasoning that the shorter something
 * lasts the more likely it is the thing the player is meant to be reading.
 *
 * From weakest to strongest: an event page's ambient motion, then a passive,
 * then an applied state, then a plugin command, then a combat reaction.
 *
 * So an elite's permanent swell is overridden by the flicker of it catching
 * fire, and returns when the fire goes out. Motions that want different things
 * do not contest at all and simply run together.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/motion/ext/passive/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-Motion-Passive.
*
* There is nothing to configure. What this plugin does is add one more place to look for the
* `<motion:...>` tag, and which passives a battler is carrying is already J-Passive's own answer.
*/
var JMotionPassive_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The name of this plugin.
	* @param {string} version The semver-formatted version of this plugin.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/motion/ext/passive/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.5.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredMotionVersion = "1.2.0";
	const hasMotionRequirement = J.BASE.Helpers.satisfies(J.MOTION.Metadata.version.version(), requiredMotionVersion);
	if (hasMotionRequirement === false) {
		throw new Error(`Either missing J-Motion or has a lower version than the required: ${requiredMotionVersion}`);
	}
	const requiredMotionAbsVersion = "1.0.0";
	const motionAbsVersion = J.MOTION.EXT.ABS.Metadata.version.version();
	const hasMotionAbsRequirement = J.BASE.Helpers.satisfies(motionAbsVersion, requiredMotionAbsVersion);
	if (hasMotionAbsRequirement === false) {
		throw new Error(`Either missing J-Motion-ABS or has a lower version than the required: ${requiredMotionAbsVersion}`);
	}
	const requiredPassiveVersion = "2.3.0";
	const passiveVersion = J.PASSIVE.Metadata.version.version();
	const hasPassiveRequirement = J.BASE.Helpers.satisfies(passiveVersion, requiredPassiveVersion);
	if (hasPassiveRequirement === false) {
		throw new Error(`Either missing J-Passive or has a lower version than the required: ${requiredPassiveVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension.
*/
J.MOTION.EXT.PASSIVE = {};
/**
* The metadata associated with this plugin.
*/
J.MOTION.EXT.PASSIVE.Metadata = new JMotionPassive_PluginMetadata("J-Motion-Passive", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.MOTION.EXT.PASSIVE.Aliased = {};
J.MOTION.EXT.PASSIVE.Aliased.Game_Battler = new Map();
J.MOTION.EXT.PASSIVE.Aliased.JABS_AiManager = new Map();
/**
* All regular expressions used by this plugin.
*
* There are none, and that is the point of the plugin: the tag it honours is J-Motion's own, read by
* J-Motion's own parser, so a passive declares a motion with exactly the syntax everything else uses.
*/
J.MOTION.EXT.PASSIVE.RegExp = {};

//#endregion
//#region src/plugins/motion/ext/passive/managers/PassiveMotionCoordinator.js
/**
* Keeps a battler's passive motions matching the passives it is actually carrying.
*
* J-Motion-ABS animates states by watching them arrive and leave, which works because an applied
* state announces both. A passive announces neither. J-Passive grants them by rebuilding the whole
* set from every source a battler owns — its own row, its states, its skills, its equipment, the
* event that spawned it — and `isStateAddable` refuses passive ids outright, so `addState` is never
* reached and there is no arrival to hear.
*
* So this reconciles rather than listens. Every pass asks what the battler is carrying now and
* settles the difference against what was declared last time, which is the only approach that works
* when the answer can change without anything having happened that is worth naming.
*/
var PassiveMotionCoordinator = class PassiveMotionCoordinator {
	/**
	* The passive state ids currently declared on each character.
	*
	* Keyed by character rather than by battler because the character is what a declaration is made
	* against, and because the two do not correspond one to one: `$gamePlayer` stands in for whichever
	* actor is leading and a follower for whichever is behind, so the occupant changes underneath a
	* character that never does. Keying this way makes party cycling fall out of the ordinary diff —
	* the incoming leader's reconcile finds the outgoing leader's ids sitting there and withdraws them
	* without anything having had to notice that a cycle happened.
	*
	* A `WeakMap` for the same reason the composer uses one: motion is presentation, nothing here
	* should outlive the character it describes, and there is no field for the save encoder to find.
	* @type {WeakMap<Game_CharacterBase, Set<number>>}
	*/
	static #declaredByCharacter = new WeakMap();
	/**
	* The source key a passive state's motions are declared under.
	*
	* Deliberately not the `state:` key J-Motion-ABS uses. The two sets can never overlap — a passive
	* id is refused by `isStateAddable`, so nothing can be applied and passive at once — but they rank
	* differently on a contested channel, and the kind in front of the colon is what carries the rank.
	* @param {number} stateId The passive state declaring the motion.
	* @returns {string}
	*/
	static sourceKeyForState(stateId) {
		return `passive:${stateId}`;
	}
	/**
	* Settles a battler's passive motions against what it is currently carrying.
	*
	* Safe to call as often as anything likes. Unchanged declarations are handed to the composer
	* anyway and recognised as identical there, which leaves the running motion untouched — so a
	* reconcile that changes nothing costs a comparison and animates nothing anew.
	* @param {Game_Battler} battler The battler whose passives may have changed.
	*/
	static reconcile(battler) {
		const character = BattlerMotionCoordinator.characterFor(battler);
		if (character === null) return;
		const desired = PassiveMotionCoordinator.declarationsByStateId(battler);
		PassiveMotionCoordinator.#withdrawDeparted(character, desired);
		PassiveMotionCoordinator.#declareCurrent(character, desired);
		PassiveMotionCoordinator.#declaredByCharacter.set(character, new Set(desired.keys()));
	}
	/**
	* Every passive state on a battler that asks for a motion, and what it asks for.
	*
	* Passives that declare no motion are dropped here rather than carried through as empty entries,
	* because most passives are pure mechanics and an empty declaration is a source key the composer
	* would have to hold, compare and withdraw for no reason.
	*
	* Stacked passives collapse to one entry. A state applied three times over is still one thing the
	* sprite is doing, and three identical declarations under one key would animate three times as
	* far as the author asked for.
	* @param {Game_Battler} battler The battler being read.
	* @returns {Map<number, MotionDeclaration[]>} What each passive state wants, keyed by state id.
	*/
	static declarationsByStateId(battler) {
		const declarationsByStateId = new Map();
		const stateIds = new Set(battler.getPassiveStateIds());
		stateIds.forEach((stateId) => {
			const state = battler.state(stateId);
			const sourceKey = PassiveMotionCoordinator.sourceKeyForState(stateId);
			const declarations = BattlerMotionCoordinator.declarationsFromNote(state, sourceKey);
			if (declarations.length === 0) return;
			declarationsByStateId.set(stateId, declarations);
		}, this);
		return declarationsByStateId;
	}
	/**
	* Withdraws the passive motions this character was declared with and no longer wants.
	*
	* Only the departed ones are touched. Clearing the whole kind and rebuilding would be simpler to
	* read and wrong to run: the composer recognises a re-declaration as identical and leaves the
	* motion alone, but only while the declaration is still on file, and clearing takes it off.
	* @param {Game_CharacterBase} character The character being reconciled.
	* @param {Map<number, MotionDeclaration[]>} desired What it should be doing now.
	*/
	static #withdrawDeparted(character, desired) {
		const previous = PassiveMotionCoordinator.#declaredByCharacter.get(character);
		if (previous === undefined) return;
		previous.forEach((stateId) => {
			if (desired.has(stateId)) return;
			const sourceKey = PassiveMotionCoordinator.sourceKeyForState(stateId);
			CharacterMotionComposer.removeDeclarations(character, sourceKey);
		}, this);
	}
	/**
	* Declares everything the character's current passives are asking for.
	* @param {Game_CharacterBase} character The character being reconciled.
	* @param {Map<number, MotionDeclaration[]>} desired What it should be doing now.
	*/
	static #declareCurrent(character, desired) {
		desired.forEach((declarations, stateId) => {
			const sourceKey = PassiveMotionCoordinator.sourceKeyForState(stateId);
			CharacterMotionComposer.declare(character, sourceKey, declarations);
		}, this);
	}
};

//#endregion
//#region src/plugins/motion/ext/passive/objects/Game_Battler.js
/**
* Extends {@link #refreshPassiveStates}.<br/>
* Settles the battler's passive motions against the set that was just rebuilt.
*
* This is the one moment a battler's passives are known to have been recalculated, whatever caused
* it — an equip change, a skill learned, a spawning event handing over its affixes, or J-Passive's
* conditional extension deciding a gate now opens. Every one of those routes through here, so
* hooking it is what makes the feature dynamic rather than something settled once at spawn.
*/
J.MOTION.EXT.PASSIVE.Aliased.Game_Battler.set("refreshPassiveStates", Game_Battler.prototype.refreshPassiveStates);
Game_Battler.prototype.refreshPassiveStates = function(deferRefresh = false) {
	J.MOTION.EXT.PASSIVE.Aliased.Game_Battler.get("refreshPassiveStates").call(this, deferRefresh);
	PassiveMotionCoordinator.reconcile(this);
};

//#endregion
//#region src/plugins/motion/ext/passive/managers/JABS_AiManager.js
/**
* Extends {@link #addOrUpdateBattler}.<br/>
* Settles the newly-tracked battler's passive motions now that it can be found.
*
* The refresh hook alone is not enough for a spawn, and the reason is ordering. A map event becomes
* a battler in `convertEventToBattler`, and the affix extension hands over its passive state ids
* from inside that call — but nothing is added to this manager's tracking until the whole map's
* worth of conversions has finished. So the reconcile that the affix grant triggers runs against a
* battler that cannot yet be looked up by uuid, finds no character, and correctly does nothing.
*
* This is the frame after that, and it is the first moment a battler and its character can be
* reached from each other. It is also where the player arrives: `refreshPlayer1Data` registers
* player 1 here on map setup and again after every party cycle, which is what keeps the character
* the player drives showing the passives of whoever is currently leading.
* @param {JABS_Battler} battler The battler being tracked.
*/
J.MOTION.EXT.PASSIVE.Aliased.JABS_AiManager.set("addOrUpdateBattler", JABS_AiManager.addOrUpdateBattler);
JABS_AiManager.addOrUpdateBattler = function(battler) {
	J.MOTION.EXT.PASSIVE.Aliased.JABS_AiManager.get("addOrUpdateBattler").call(this, battler);
	PassiveMotionCoordinator.reconcile(battler.getBattler());
};

//#endregion
//# sourceMappingURL=J-Motion-Passive.js.map