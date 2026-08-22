//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 ABS-METRICS] Records JABS combat activity into game variables.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-InputManager
 * @help
 * ============================================================================
 * OVERVIEW
 * J-ABS-Metrics quietly keeps score. It hooks the moments JABS already
 * announces- a battler died, a skill effect landed, guard was raised, an item
 * was consumed- and files what happened into game variables.
 *
 * Nothing in this plugin changes gameplay. It only observes.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; every metric here is a JABS event.
 * - J-ABS-InputManager; defines the slots that usage is bucketed by.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Variables are the right home for this despite being clumsy storage, because
 * variables are the one thing the event editor, the message window, and every
 * conditional branch in the game can already read. A trophy that unlocks at
 * "1000 enemies defeated" is a single event page against a variable this plugin
 * maintains, with nothing else to write.
 *
 * The metrics divide into three shapes, and knowing which is which is the
 * difference between a number that means something and one that does not:
 *
 * - RUNNING TOTALS only ever grow (total damage dealt, damage prevented).
 * - PERSONAL BESTS keep the largest value ever seen (biggest crit landed).
 * - COUNTS tally occurrences (number of parries, guard activations).
 *
 * ============================================================================
 * REQUIRED EXTERNAL CONFIGURATION
 * J-ABS-Metrics has NO plugin parameters. Which variable holds which metric is
 * declared in the external JABS configuration file at `data/config.jabs.json`,
 * under a top-level `metrics` block. The plugin THROWS at startup when the
 * block is missing.
 *
 * A variableId is a bare number that means nothing on its own, and twenty-six
 * of them in a plugin parameter panel is twenty-six opportunities to point two
 * metrics at the same variable and never find out. In the config file they sit
 * beside the rest of the JABS setup, in a file that diffs.
 *
 * Required shape (all twenty-six keys required):
 *
 *   {
 *     "teams": [ ... ],
 *     "metrics": {
 *       "enemiesDefeated":           61,
 *       "destructiblesDestroyed":    62,
 *       "alliesDowned":              63,
 *       "numberOfDeaths":            64,
 *       "totalDamageDealt":          65,
 *       "highestDamageDealt":        66,
 *       "numberOfCritsDealt":        67,
 *       "biggestCritDealt":          68,
 *       "attacksEvadedByEnemies":    69,
 *       "totalDamageTaken":          70,
 *       "highestDamageTaken":        71,
 *       "numberOfCritsTaken":        72,
 *       "biggestCritTaken":          73,
 *       "numberOfParries":           74,
 *       "numberOfPreciseParries":    75,
 *       "numberOfGlancingBlows":     76,
 *       "numberOfGuardedHits":       77,
 *       "attacksEvadedByParty":      78,
 *       "damagePreventedByGuarding": 79,
 *       "mainhandSkillUsage":        80,
 *       "offhandSkillUsage":         81,
 *       "assignedSkillUsage":        82,
 *       "dodgeSkillUsage":           83,
 *       "guardActivations":          84,
 *       "toolUsage":                 85,
 *       "usableItemUsage":           86
 *     }
 *   }
 *
 * ============================================================================
 * WHO COUNTS:
 * Two rules, applied consistently.
 *
 * DEFENSIVE OUTCOMES ARE PARTY-WIDE. Damage taken, parries, glancing blows,
 * guarded hits, evasions and damage prevented all count for any actor, not only
 * the one being controlled. An ally soaking a hit soaked it; leaving them out
 * would make damage-taken and damage-prevented describe different populations
 * and stop being comparable to each other.
 *
 * INPUT METRICS ARE THE PLAYER ONLY. Slot usage, guard activations, dodges and
 * item usage count only what the person holding the controller did. Ally AI
 * raises guard on its own schedule, and folding that in would bury the one
 * number these exist to answer: what did the player actually reach for.
 *
 * ============================================================================
 * WHAT COUNTS AS WHAT:
 *
 * ENEMIES DEFEATED vs DESTRUCTIBLES DESTROYED:
 * A battler flagged inanimate- a tree, an ore deposit, a crate- files under
 * destructibles. Everything else files under enemies. Keeping them apart means
 * an hour spent harvesting does not read as an hour spent fighting.
 *
 * THE THREE DEFENSIVE OUTCOMES:
 * A hit that is fully negated is a PARRY. A hit that lands for reduced damage
 * because the defender rolled well is a GLANCING BLOW. A hit that never
 * connects because evasion beat accuracy is an EVASION. All three exist, and
 * all three are counted separately.
 *
 * PARRIES, PRECISE AND OTHERWISE:
 * A parry happens two ways- passively, when the defender's GRD overwhelms the
 * attacker's HIT, or deliberately, by holding guard inside the parry window.
 * Both produce the same outcome, so "number of parries" is the combined total,
 * and "number of precise parries" is the deliberate subset of it. The passive
 * count is the difference between the two and deliberately spends no variable
 * of its own- a stored figure that can disagree with its own operands is worse
 * than a subtraction performed when someone asks.
 *
 * ATTACKS EVADED, BOTH DIRECTIONS:
 * "By enemies" counts swings that an enemy slipped, which is a statement about
 * picking fights above one's level rather than about swinging at empty air.
 * "By party" counts incoming attacks the party slipped.
 *
 * DAMAGE PREVENTED BY GUARDING:
 * Measured as the difference between the hit before and after guard reduction,
 * at the one moment both figures exist. Healing runs through the same reduction
 * path as negative damage and is excluded, since "prevented" there would be a
 * number pointing the wrong way.
 *
 * ITEM USAGE IS COUNTED AT CONSUMPTION:
 * Not at the executed action, because an item only produces an action when it
 * carries a skill id- so a plain healing potion would never be counted at all.
 * Walking over loot travels the same path and is excluded: picking a potion up
 * is not using one.
 *
 * ITEMS ARE NOT ATTACKS:
 * Anything executed from the tool slot OR the usable item slot is skipped for
 * damage tracking. A thrown bomb is inventory usage, not swordsmanship.
 *
 * The stronger reason is that an item's damage is authored against the item
 * rather than against the character using it. A bomb tuned to delete a boulder
 * in one hit lands for a number no weapon in the game will ever approach, so a
 * single throw would take permanent ownership of "highest damage dealt" and
 * drag the lifetime total somewhere that describes the inventory instead of the
 * player. Item usage is still counted- just in its own tallies, where a count
 * of throws is what it claims to be.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/abs/ext/metrics/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-ABS-Metrics.
*
* Every value this plugin needs is a variableId, and a variableId is a primitive that means nothing
* on its own- which is exactly the kind of thing that belongs beside the rest of the JABS
* configuration rather than in a plugin parameter blob nobody can diff.
*/
var JAbsMetrics_PluginMetadata = class extends PluginMetadata {
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
	* Loads the metrics block from the external JABS config.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin by reading the `metrics` block from
	* `config.jabs.json`. J-ABS parses that file while its own metadata is being published, and this
	* plugin is ordered after it, so the parsed root is guaranteed to be present by the time this runs.
	*/
	initializeMetadata() {
		const { metrics } = J.ABS.Metadata.ExternalConfig;
		this.initializeOutcomeMetadata(metrics);
		this.initializeOffenseMetadata(metrics);
		this.initializeDamageTakenMetadata(metrics);
		this.initializeMitigationMetadata(metrics);
		this.initializeUsageMetadata(metrics);
	}
	/**
	* Initializes the variables tracking who died and how often.
	* @param {object} metrics The parsed `metrics` block.
	*/
	initializeOutcomeMetadata(metrics) {
		/**
		* The variable counting how many animate enemies have been slain.
		* @type {number}
		*/
		this.enemiesDefeatedVariableId = metrics.enemiesDefeated;
		/**
		* The variable counting how many inanimate battlers- trees, ore, crates- have been broken.
		* Kept apart from the enemy tally so a player who spent an hour chopping shrubs does not read
		* as a player who spent an hour fighting.
		* @type {number}
		*/
		this.destructiblesDestroyedVariableId = metrics.destructiblesDestroyed;
		/**
		* The variable counting how many times a non-player ally has gone down.
		* @type {number}
		*/
		this.alliesDownedVariableId = metrics.alliesDowned;
		/**
		* The variable counting how many times the player has been defeated.
		* @type {number}
		*/
		this.numberOfDeathsVariableId = metrics.numberOfDeaths;
	}
	/**
	* Initializes the variables describing what the party dishes out.
	* @param {object} metrics The parsed `metrics` block.
	*/
	initializeOffenseMetadata(metrics) {
		/**
		* The variable accumulating every point of hp damage the party has dealt.
		* @type {number}
		*/
		this.totalDamageDealtVariableId = metrics.totalDamageDealt;
		/**
		* The variable holding the largest single hit the party has ever landed.
		* @type {number}
		*/
		this.highestDamageDealtVariableId = metrics.highestDamageDealt;
		/**
		* The variable counting how many critical hits the party has landed.
		* @type {number}
		*/
		this.numberOfCritsDealtVariableId = metrics.numberOfCritsDealt;
		/**
		* The variable holding the largest single critical hit the party has ever landed.
		* @type {number}
		*/
		this.biggestCritDealtVariableId = metrics.biggestCritDealt;
		/**
		* The variable counting swings that an enemy evaded outright.
		*
		* This is a hit-versus-evasion roll rather than a swing at empty air, so a high count says the
		* player kept picking fights with things well above their level.
		* @type {number}
		*/
		this.attacksEvadedByEnemiesVariableId = metrics.attacksEvadedByEnemies;
	}
	/**
	* Initializes the variables describing what the party absorbs.
	* @param {object} metrics The parsed `metrics` block.
	*/
	initializeDamageTakenMetadata(metrics) {
		/**
		* The variable accumulating every point of hp damage the party has absorbed.
		* @type {number}
		*/
		this.totalDamageTakenVariableId = metrics.totalDamageTaken;
		/**
		* The variable holding the largest single hit the party has ever absorbed.
		* @type {number}
		*/
		this.highestDamageTakenVariableId = metrics.highestDamageTaken;
		/**
		* The variable counting how many critical hits have landed on the party.
		* @type {number}
		*/
		this.numberOfCritsTakenVariableId = metrics.numberOfCritsTaken;
		/**
		* The variable holding the largest single critical hit the party has ever absorbed.
		* @type {number}
		*/
		this.biggestCritTakenVariableId = metrics.biggestCritTaken;
	}
	/**
	* Initializes the variables describing everything the party did to make an incoming hit hurt less.
	* @param {object} metrics The parsed `metrics` block.
	*/
	initializeMitigationMetadata(metrics) {
		/**
		* The variable counting fully negated hits of either parry kind.
		*
		* Both the passive roll and the deliberate button press write the same outcome, so this is the
		* combined total. Subtracting the precise tally from it yields the passive one, which is why no
		* variable is spent holding that separately.
		* @type {number}
		*/
		this.numberOfParriesVariableId = metrics.numberOfParries;
		/**
		* The variable counting parries earned by holding guard inside the parry window.
		*
		* The deliberate half of the parry system, and the one worth being smug about.
		* @type {number}
		*/
		this.numberOfPreciseParriesVariableId = metrics.numberOfPreciseParries;
		/**
		* The variable counting glancing blows- the partial parry, which still lands but for less.
		* @type {number}
		*/
		this.numberOfGlancingBlowsVariableId = metrics.numberOfGlancingBlows;
		/**
		* The variable counting hits that landed on a battler who was actively guarding.
		* @type {number}
		*/
		this.numberOfGuardedHitsVariableId = metrics.numberOfGuardedHits;
		/**
		* The variable counting incoming attacks the party evaded outright.
		* @type {number}
		*/
		this.attacksEvadedByPartyVariableId = metrics.attacksEvadedByParty;
		/**
		* The variable accumulating the damage guarding subtracted from incoming hits.
		*
		* The single most legible answer to "was holding guard worth it" - a player who never raised it
		* reads zero here, and one who lived on it reads a number rivaling their total damage taken.
		* @type {number}
		*/
		this.damagePreventedByGuardingVariableId = metrics.damagePreventedByGuarding;
	}
	/**
	* Initializes the variables describing which inputs the player actually reaches for.
	* @param {object} metrics The parsed `metrics` block.
	*/
	initializeUsageMetadata(metrics) {
		/**
		* The variable counting actions executed from the mainhand slot.
		* @type {number}
		*/
		this.mainhandSkillUsageVariableId = metrics.mainhandSkillUsage;
		/**
		* The variable counting actions executed from the offhand slot.
		* @type {number}
		*/
		this.offhandSkillUsageVariableId = metrics.offhandSkillUsage;
		/**
		* The variable counting actions executed from any of the four assignable combat slots.
		* @type {number}
		*/
		this.assignedSkillUsageVariableId = metrics.assignedSkillUsage;
		/**
		* The variable counting dodge skill activations.
		* @type {number}
		*/
		this.dodgeSkillUsageVariableId = metrics.dodgeSkillUsage;
		/**
		* The variable counting how many times the player raised their guard.
		*
		* Counted on the transition into guarding rather than per frame held, so this answers "how often
		* did they reach for it" instead of "how long did they lean on it".
		* @type {number}
		*/
		this.guardActivationsVariableId = metrics.guardActivations;
		/**
		* The variable counting tool slot usage.
		* @type {number}
		*/
		this.toolUsageVariableId = metrics.toolUsage;
		/**
		* The variable counting usable item slot usage.
		* @type {number}
		*/
		this.usableItemUsageVariableId = metrics.usableItemUsage;
	}
};

//#endregion
//#region src/plugins/abs/ext/metrics/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.METRICS = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.METRICS.Metadata = new JAbsMetrics_PluginMetadata("J-ABS-Metrics", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.METRICS.Aliased = {};
J.ABS.EXT.METRICS.Aliased.Game_Action = new Map();
J.ABS.EXT.METRICS.Aliased.JABS_Battler = new Map();
J.ABS.EXT.METRICS.Aliased.JABS_Engine = new Map();

//#endregion
//#region src/plugins/abs/ext/metrics/managers/JABS_MetricsManager.js
/**
* A static manager that translates combat events into game variables.
*
* The engine hooks that feed this live across {@link JABS_Engine}, {@link Game_Action} and
* {@link JABS_Battler}, but the recording itself lives here so that "what counts as a critical hit"
* is answerable without standing up a battle. It also gives the variable writes a single choke
* point- every metric in the game flows through {@link JABS_MetricsManager.increment} or
* {@link JABS_MetricsManager.recordHighWaterMark}, so a question like "which of these is a running
* total and which is a personal best" is answered by looking at which helper the call used.
*/
var JABS_MetricsManager = class {
	/**
	* Constructor.
	* A static class though, so don't build it.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Gets the metadata governing which variable holds which metric.
	* @returns {JAbsMetrics_PluginMetadata}
	*/
	static metadata() {
		return J.ABS.EXT.METRICS.Metadata;
	}
	/**
	* Adds an amount onto a running total held in a variable.
	* @param {number} variableId The variable holding the running total.
	* @param {number} amount The amount to add.
	*/
	static increment(variableId, amount) {
		J.BASE.Helpers.modVariable(variableId, amount);
	}
	/**
	* Records a candidate against a personal best, keeping whichever is larger.
	* @param {number} variableId The variable holding the personal best.
	* @param {number} candidate The value that may or may not be a new best.
	*/
	static recordHighWaterMark(variableId, candidate) {
		const currentBest = $gameVariables.value(variableId);
		if (candidate <= currentBest) return;
		$gameVariables.setValue(variableId, candidate);
	}
	/**
	* Determines whether a cooldown key belongs to one of the two item-bearing slots.
	*
	* Both slots are excluded from the damage tallies, and for the same reason: an item's damage is
	* authored against the item, not against the character swinging it. A bomb tuned to delete a
	* boulder in one hit lands for a number no weapon in the game will ever approach, so a single
	* throw would take permanent ownership of "biggest hit" and drag the lifetime average somewhere
	* that describes the inventory rather than the player.
	* @param {string} cooldownType The cooldown key the action was executed from.
	* @returns {boolean} True if the action came out of the tool or usable item slot.
	*/
	static isItemSlot(cooldownType) {
		return cooldownType === JABS_Button.Tool || cooldownType === JABS_Button.UsableItem;
	}
	/**
	* Records the defeat of a battler that was not the player.
	* @param {JABS_Battler} defeatedTarget The battler that was defeated.
	*/
	static trackDefeatedEnemy(defeatedTarget) {
		const metadata = this.metadata();
		if (defeatedTarget.isInanimate() === true) {
			this.increment(metadata.destructiblesDestroyedVariableId, 1);
			return;
		}
		this.increment(metadata.enemiesDefeatedVariableId, 1);
	}
	/**
	* Records the downing of a non-player ally.
	*/
	static trackDefeatedAlly() {
		this.increment(this.metadata().alliesDownedVariableId, 1);
	}
	/**
	* Records the defeat of the player.
	*/
	static trackDefeatedPlayer() {
		this.increment(this.metadata().numberOfDeathsVariableId, 1);
	}
	/**
	* Records the outcome of a hit the party landed on an enemy.
	* @param {JABS_Battler} target The enemy that was struck.
	*/
	static trackAttackData(target) {
		const metadata = this.metadata();
		const { hpDamage, critical, evaded } = target.getBattler().result();
		if (evaded === true) {
			this.increment(metadata.attacksEvadedByEnemiesVariableId, 1);
			return;
		}
		if (hpDamage <= 0) return;
		this.increment(metadata.totalDamageDealtVariableId, hpDamage);
		this.recordHighWaterMark(metadata.highestDamageDealtVariableId, hpDamage);
		if (critical !== true) return;
		this.increment(metadata.numberOfCritsDealtVariableId, 1);
		this.recordHighWaterMark(metadata.biggestCritDealtVariableId, hpDamage);
	}
	/**
	* Records the outcome of a hit the party absorbed.
	* @param {JABS_Battler} target The ally that was struck.
	*/
	static trackDefensiveData(target) {
		const metadata = this.metadata();
		const { hpDamage, critical, parried, glancing, evaded } = target.getBattler().result();
		if (glancing === true) {
			this.increment(metadata.numberOfGlancingBlowsVariableId, 1);
		}
		if (hpDamage > 0) {
			this.trackDamageTaken(hpDamage, critical);
			return;
		}
		if (parried === true) {
			this.increment(metadata.numberOfParriesVariableId, 1);
			return;
		}
		if (evaded === true) {
			this.increment(metadata.attacksEvadedByPartyVariableId, 1);
		}
	}
	/**
	* Records a hit that got through the party's defenses.
	* @param {number} hpDamage The hp damage that landed.
	* @param {boolean} critical Whether or not the hit was a critical.
	*/
	static trackDamageTaken(hpDamage, critical) {
		const metadata = this.metadata();
		this.increment(metadata.totalDamageTakenVariableId, hpDamage);
		this.recordHighWaterMark(metadata.highestDamageTakenVariableId, hpDamage);
		if (critical !== true) return;
		this.increment(metadata.numberOfCritsTakenVariableId, 1);
		this.recordHighWaterMark(metadata.biggestCritTakenVariableId, hpDamage);
	}
	/**
	* Records a parry earned by holding guard inside the parry window.
	*
	* The combined parry tally is not touched here: the deliberate parry also writes the same
	* `parried` outcome the passive one does, so it is already counted where every fully negated hit
	* is counted. Adding to both from here would double the total and make the passive count- which is
	* derived by subtraction- come out negative.
	*/
	static trackPreciseParry() {
		this.increment(this.metadata().numberOfPreciseParriesVariableId, 1);
	}
	/**
	* Records a hit that landed on a battler who was actively guarding.
	*/
	static trackGuardedHit() {
		this.increment(this.metadata().numberOfGuardedHitsVariableId, 1);
	}
	/**
	* Records how much damage guarding subtracted from an incoming hit.
	* @param {number} originalDamage The damage before the guard reduction was applied.
	* @param {number} reducedDamage The damage that remained after the guard reduction.
	*/
	static trackDamagePrevented(originalDamage, reducedDamage) {
		const prevented = originalDamage - reducedDamage;
		if (prevented <= 0) return;
		this.increment(this.metadata().damagePreventedByGuardingVariableId, prevented);
	}
	/**
	* Records that the player raised their guard.
	*/
	static trackGuardActivation() {
		this.increment(this.metadata().guardActivationsVariableId, 1);
	}
	/**
	* Records the use of an item out of one of the two item-bearing slots.
	*
	* Counted here rather than off the executed map action, because an item only produces a map action
	* when it has a skill attached to it- so a plain healing potion would never be counted at all.
	* @param {string} buttonType The slot the item was used from.
	*/
	static trackItemUsage(buttonType) {
		const metadata = this.metadata();
		if (buttonType === JABS_Button.Tool) {
			this.increment(metadata.toolUsageVariableId, 1);
			return;
		}
		this.increment(metadata.usableItemUsageVariableId, 1);
	}
	/**
	* Records which slot the player just executed an action from.
	* @param {JABS_Action} action The action driving this step.
	*/
	static trackActionData(action) {
		const metadata = this.metadata();
		const cooldownType = action.getCooldownType();
		switch (cooldownType) {
			case JABS_Button.Mainhand:
				this.increment(metadata.mainhandSkillUsageVariableId, 1);
				break;
			case JABS_Button.Offhand:
				this.increment(metadata.offhandSkillUsageVariableId, 1);
				break;
			case JABS_Button.Dodge:
				this.increment(metadata.dodgeSkillUsageVariableId, 1);
				break;
			case JABS_Button.Tool:
			case JABS_Button.UsableItem: break;
			default:
				this.increment(metadata.assignedSkillUsageVariableId, 1);
				break;
		}
	}
};

//#endregion
//#region src/plugins/abs/ext/metrics/managers/JABS_Engine.js
/**
* Extends {@link #handleDefeatedEnemy}.<br/>
* Also records the kill against the appropriate tally.
* @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
* @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
*/
J.ABS.EXT.METRICS.Aliased.JABS_Engine.set("handleDefeatedEnemy", JABS_Engine.prototype.handleDefeatedEnemy);
JABS_Engine.prototype.handleDefeatedEnemy = function(defeatedTarget, caster) {
	J.ABS.EXT.METRICS.Aliased.JABS_Engine.get("handleDefeatedEnemy").call(this, defeatedTarget, caster);
	JABS_MetricsManager.trackDefeatedEnemy(defeatedTarget);
};
/**
* Extends {@link #handleDefeatedAlly}.<br/>
* Also records that a party member went down.
* @param {JABS_Battler} defeatedAlly The ally that was defeated.
*/
J.ABS.EXT.METRICS.Aliased.JABS_Engine.set("handleDefeatedAlly", JABS_Engine.prototype.handleDefeatedAlly);
JABS_Engine.prototype.handleDefeatedAlly = function(defeatedAlly) {
	J.ABS.EXT.METRICS.Aliased.JABS_Engine.get("handleDefeatedAlly").call(this, defeatedAlly);
	JABS_MetricsManager.trackDefeatedAlly();
};
/**
* Extends {@link #handleDefeatedPlayer}.<br/>
* Also records the death.
*
* The tally is taken before the original logic rather than after, because handling a defeated player
* is what triggers the game over- there is no guarantee the rest of this function returns.
*/
J.ABS.EXT.METRICS.Aliased.JABS_Engine.set("handleDefeatedPlayer", JABS_Engine.prototype.handleDefeatedPlayer);
JABS_Engine.prototype.handleDefeatedPlayer = function() {
	JABS_MetricsManager.trackDefeatedPlayer();
	J.ABS.EXT.METRICS.Aliased.JABS_Engine.get("handleDefeatedPlayer").call(this);
};
/**
* Extends {@link #postExecuteSkillEffects}.<br/>
* Also records the combat outcome of the hit that just landed.
* @param {JABS_Action} action The action being executed.
* @param {JABS_Battler} target The target the skill effects were applied against.
*/
J.ABS.EXT.METRICS.Aliased.JABS_Engine.set("postExecuteSkillEffects", JABS_Engine.prototype.postExecuteSkillEffects);
JABS_Engine.prototype.postExecuteSkillEffects = function(action, target) {
	J.ABS.EXT.METRICS.Aliased.JABS_Engine.get("postExecuteSkillEffects").call(this, action, target);
	if (JABS_MetricsManager.isItemSlot(action.getCooldownType())) return;
	if (target.isEnemy()) {
		JABS_MetricsManager.trackAttackData(target);
	} else if (target.isActor()) {
		JABS_MetricsManager.trackDefensiveData(target);
	}
};
/**
* Extends {@link #executeMapAction}.<br/>
* Also records which slot the player is leaning on.
* @param {JABS_Battler} caster The battler executing the action.
* @param {JABS_Action} action The action being executed.
* @param {number?} targetX The target's `x` coordinate, if applicable.
* @param {number?} targetY The target's `y` coordinate, if applicable.
*/
J.ABS.EXT.METRICS.Aliased.JABS_Engine.set("executeMapAction", JABS_Engine.prototype.executeMapAction);
JABS_Engine.prototype.executeMapAction = function(caster, action, targetX, targetY) {
	J.ABS.EXT.METRICS.Aliased.JABS_Engine.get("executeMapAction").call(this, caster, action, targetX, targetY);
	if (caster.isPlayer() === false) return;
	JABS_MetricsManager.trackActionData(action);
};

//#endregion
//#region src/plugins/abs/ext/metrics/objects/Game_Action.js
/**
* Extends {@link #onParry}.<br/>
* Also records the parry as the deliberate kind.
*
* This hook is reached only from {@link Game_Action.processGuard}'s sibling
* {@link Game_Action.processParry}, which in turn only runs while the battler's parry window is
* open- so arriving here is proof the player earned it on purpose. The passive roll that produces
* the same `parried` outcome never comes through here, which is what makes the two separable at all.
* @param {JABS_Battler} jabsBattler The battler that is parrying.
*/
J.ABS.EXT.METRICS.Aliased.Game_Action.set("onParry", Game_Action.prototype.onParry);
Game_Action.prototype.onParry = function(jabsBattler) {
	J.ABS.EXT.METRICS.Aliased.Game_Action.get("onParry").call(this, jabsBattler);
	if (jabsBattler.isActor() === false) return;
	JABS_MetricsManager.trackPreciseParry();
};
/**
* Extends {@link #onGuard}.<br/>
* Also records that a hit landed on someone who was holding guard.
* @param {JABS_Battler} jabsBattler The battler that is guarding.
*/
J.ABS.EXT.METRICS.Aliased.Game_Action.set("onGuard", Game_Action.prototype.onGuard);
Game_Action.prototype.onGuard = function(jabsBattler) {
	J.ABS.EXT.METRICS.Aliased.Game_Action.get("onGuard").call(this, jabsBattler);
	if (jabsBattler.isActor() === false) return;
	JABS_MetricsManager.trackGuardedHit();
};
/**
* Extends {@link #calculateGuardDamageReduction}.<br/>
* Also records the difference between what the hit would have dealt and what it did.
*
* Measured here rather than anywhere downstream because this is the only point at which both numbers
* exist at once- by the time the result carries a figure, the original is gone.
* @param {JABS_Battler} jabsBattler The battler doing the guarding.
* @param {number} originalDamage The damage before any guard reduction.
* @returns {number} The damage after the guard reduction.
*/
J.ABS.EXT.METRICS.Aliased.Game_Action.set("calculateGuardDamageReduction", Game_Action.prototype.calculateGuardDamageReduction);
Game_Action.prototype.calculateGuardDamageReduction = function(jabsBattler, originalDamage) {
	const reducedDamage = J.ABS.EXT.METRICS.Aliased.Game_Action.get("calculateGuardDamageReduction").call(this, jabsBattler, originalDamage);
	if (jabsBattler.isActor()) {
		JABS_MetricsManager.trackDamagePrevented(originalDamage, reducedDamage);
	}
	return reducedDamage;
};

//#endregion
//#region src/plugins/abs/ext/metrics/_models/JABS_Battler.js
/**
* Extends {@link #executeGuard}.<br/>
* Also records that the player reached for their guard.
*
* Counted on the transition into guarding rather than per frame held, and measured by comparing the
* guard state either side of the original call rather than by re-deriving the conditions- the
* original refuses the request for several reasons of its own, and duplicating that judgement here
* would mean two answers to one question that could drift apart.
* @param {boolean} guarding True if the battler is guarding, false otherwise.
*/
J.ABS.EXT.METRICS.Aliased.JABS_Battler.set("executeGuard", JABS_Battler.prototype.executeGuard);
JABS_Battler.prototype.executeGuard = function(guarding) {
	const wasGuarding = this.guarding();
	J.ABS.EXT.METRICS.Aliased.JABS_Battler.get("executeGuard").call(this, guarding);
	if (this.isPlayer() === false) return;
	if (wasGuarding === true) return;
	if (this.guarding() === false) return;
	JABS_MetricsManager.trackGuardActivation();
};
/**
* Extends {@link #applyToolItemEffects}.<br/>
* Also records that an item was consumed out of one of the two item-bearing slots.
*
* Hooked here rather than at the executed map action because an item only produces an action when it
* carries a skill id- a plain healing potion never reaches the engine at all, and counting there
* would silently omit every item that does nothing but heal.
* @param {number} toolId The id of the item being used.
* @param {string} buttonType The slot the item was used from.
* @param {boolean=} isLoot Whether this is a loot pickup rather than a deliberate use.
*/
J.ABS.EXT.METRICS.Aliased.JABS_Battler.set("applyToolItemEffects", JABS_Battler.prototype.applyToolItemEffects);
JABS_Battler.prototype.applyToolItemEffects = function(toolId, buttonType, isLoot = false) {
	J.ABS.EXT.METRICS.Aliased.JABS_Battler.get("applyToolItemEffects").call(this, toolId, buttonType, isLoot);
	if (this.isPlayer() === false) return;
	if (isLoot === true) return;
	JABS_MetricsManager.trackItemUsage(buttonType);
};

//#endregion
//# sourceMappingURL=J-ABS-Metrics.js.map