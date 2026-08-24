//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PROF-KNOWLEDGE] A currency earned by using skills.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Proficiency
 * @orderAfter J-Base
 * @orderAfter J-Proficiency
 * @orderAfter J-CMS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin turns skill use into a spendable currency.
 *
 * Whenever an actor gains proficiency in a skill, the party gains the same
 * amount of "knowledge" in whatever kinds that skill's type is mapped to. What
 * the kinds are, which skill types produce them, and what they can be traded
 * for are all authored in configuration - this plugin never knows what any
 * particular kind of knowledge means.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-Proficiency; the source of every point this plugin hands out.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Knowledge is defined in three blocks of "data/config.proficiency.json",
 * alongside "conditionals".
 *
 * A TAG is a kind of knowledge. It is a name for a balance and nothing more.
 *
 * The SKILL TYPE MAPPING says which tags a skill's use produces, keyed by the
 * skill's type. A skill type absent from the mapping produces nothing, which
 * is what lets a roster of passives and item skills need no exclusion list -
 * and means a skill type added later stays silent until somebody maps it.
 *
 * An EXCHANGE is a standing offer to convert one tag's points into something
 * from the database at an authored rate. Exchanges are named, because a tag
 * may be worth spending on more than one thing.
 *
 * Only actors produce knowledge. Enemies gain proficiency of their own and it
 * yields nothing, because the party cannot learn from a lesson it did not sit
 * through.
 *
 * Proficiency can also be handed out in the negative by the commands that
 * reward it. A debit reduces proficiency and leaves knowledge alone; the
 * points may already have been spent, and taking back what is no longer there
 * would leave the ledger disagreeing with the bag.
 *
 * ============================================================================
 * AUTHORING KNOWLEDGE:
 * A minimal setup looks like this:
 *
 *   "knowledgeTags": [
 *     {
 *       "key": "offensive",
 *       "name": "Offensive Knowledge",
 *       "iconIndex": 0,
 *       "description": "What swinging something teaches you about making one."
 *     }
 *   ],
 *   "skillTypeMapping": {
 *     "7": [ "offensive" ]
 *   },
 *   "knowledgeExchanges": [
 *     {
 *       "key": "blueprints",
 *       "tagKey": "offensive",
 *       "cost": 100,
 *       "output": { "id": 501, "type": "i", "count": 1 }
 *     }
 *   ]
 *
 * A skill type may map to several tags at once, in which case using it credits
 * every one of them.
 *
 * An output type is one of "i" for an item, "w" for a weapon, or "a" for an
 * armor.
 *
 * ============================================================================
 * EXCHANGING:
 * The exchange command converts every whole unit the balance can afford, all
 * at once. Whatever is left over is smaller than the price of a unit, and it
 * stays banked toward the next one.
 *
 * The command says nothing and plays nothing. It writes what happened into a
 * variable and a switch of your choosing, and the event decides what to make
 * of that - so the character handing the goods over speaks in their own voice
 * rather than this plugin's.
 *
 * Leave either id at 0 to skip that output entirely. An output nobody asked
 * for is left alone rather than cleared.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @command exchange-knowledge
 * @text Exchange Knowledge
 * @desc Converts banked knowledge into whatever the named exchange offers.
 * @arg exchangeKey
 * @type string
 * @text Exchange
 * @desc The name of the exchange to perform, as written in the configuration.
 * @arg resultVariableId
 * @type variable
 * @text Amount Granted
 * @desc A variable to write the number of things handed over into. Leave at 0 to skip.
 * @default 0
 * @arg resultSwitchId
 * @type switch
 * @text Granted Anything
 * @desc A switch recording whether anything at all was handed over. Leave at 0 to skip.
 * @default 0
 */
//endregion annotations

//#region src/plugins/prof/ext/knowledge/__models/KnowledgeExchange.js
/**
* A standing offer to convert one kind of knowledge into something from the database.
*
* An exchange is named rather than derived from its tag, because a tag may have several things worth
* spending it on. "Convert all of my offensive knowledge" stops meaning anything the moment a second
* buyer exists, so the caller names the offer and the tag comes along with it.
*
* The rate lives here rather than in code so that a game can decide what knowledge is worth without
* anybody rebuilding a plugin.
*/
var KnowledgeExchange = class KnowledgeExchange {
	/**
	* The datastore each output type is drawn from.
	*
	* This mirrors the shape crafting uses for its own components, but resolves independently: that model
	* belongs to another ship, and this one must work whether or not that ship is installed.
	* @type {Object<string, string>}
	*/
	static Types = {
		Item: "i",
		Weapon: "w",
		Armor: "a"
	};
	/**
	* The unique identifier for this exchange, named by whoever triggers it.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The key of the {@link KnowledgeTag} this exchange spends.
	* @type {string}
	*/
	tagKey = String.empty;
	/**
	* How many points one unit of the output costs.
	* @type {number}
	*/
	cost = 0;
	/**
	* The datastore the output is drawn from; one of {@link KnowledgeExchange.Types}.
	* @type {string}
	*/
	outputType = String.empty;
	/**
	* The id of the output within its datastore.
	* @type {number}
	*/
	outputId = 0;
	/**
	* How many of the output a single unit yields.
	* @type {number}
	*/
	outputCount = 0;
	/**
	* Constructor.
	* @param {string} key The unique identifier for this exchange.
	* @param {string} tagKey The key of the knowledge tag this exchange spends.
	* @param {number} cost How many points one unit of the output costs.
	* @param {string} outputType The datastore the output is drawn from.
	* @param {number} outputId The id of the output within its datastore.
	* @param {number} outputCount How many of the output a single unit yields.
	*/
	constructor(key, tagKey, cost, outputType, outputId, outputCount) {
		this.key = key;
		this.tagKey = tagKey;
		this.cost = cost;
		this.outputType = outputType;
		this.outputId = outputId;
		this.outputCount = outputCount;
	}
	/**
	* How many whole units a given pile of points can buy.<br/>
	* Whatever is left over is not lost- it simply stays banked until it is worth a unit.
	* @param {number} points The points currently held for this exchange's tag.
	* @returns {number}
	*/
	unitsAvailable(points) {
		const affordable = points / this.cost;
		return Math.floor(affordable);
	}
	/**
	* How many points a given number of units costs in total.
	* @param {number} units The number of units being bought.
	* @returns {number}
	*/
	priceOf(units) {
		return units * this.cost;
	}
	/**
	* How many of the output a given number of units yields.
	* @param {number} units The number of units being bought.
	* @returns {number}
	*/
	yieldOf(units) {
		return units * this.outputCount;
	}
	/**
	* The database entry this exchange hands over.
	*
	* Resolved on demand rather than at boot, because the datastores do not exist while configuration is
	* being parsed.
	* @returns {RPG_Item|RPG_Weapon|RPG_Armor}
	*/
	resolveOutput() {
		switch (this.outputType) {
			case KnowledgeExchange.Types.Item: return $dataItems.at(this.outputId);
			case KnowledgeExchange.Types.Weapon: return $dataWeapons.at(this.outputId);
			case KnowledgeExchange.Types.Armor: return $dataArmors.at(this.outputId);
			default: throw new Error(`exchange '${this.key}' names an unrecognized output type of '${this.outputType}'.`);
		}
	}
};

//#endregion
//#region src/plugins/prof/ext/knowledge/__models/KnowledgeTag.js
/**
* A single kind of knowledge the party can accumulate.
*
* A tag is nothing but a name for a balance. This plugin never knows what any particular tag *means*-
* whether it represents offense, defense, or something a future game invents- because the tags are
* authored in configuration and referenced only by key. That is what keeps the currency generic: adding
* a new kind of knowledge is a config edit rather than a code change.
*
* Tags are built from configuration at boot and are never saved; the balances they name live on
* {@link Game_Party}.
*/
var KnowledgeTag = class {
	/**
	* The unique identifier for this tag, used everywhere a balance is read or written.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The player-facing name of this kind of knowledge.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The icon representing this kind of knowledge wherever it is displayed.
	* @type {number}
	*/
	iconIndex = 0;
	/**
	* The flavor text describing what this kind of knowledge represents.
	* @type {string}
	*/
	description = String.empty;
	/**
	* Constructor.
	* @param {string} key The unique identifier for this tag.
	* @param {string} name The player-facing name of this kind of knowledge.
	* @param {number} iconIndex The icon representing this kind of knowledge.
	* @param {string} description The flavor text describing this kind of knowledge.
	*/
	constructor(key, name, iconIndex, description) {
		this.key = key;
		this.name = name;
		this.iconIndex = iconIndex;
		this.description = description;
	}
};

//#endregion
//#region src/plugins/prof/ext/knowledge/_metadata/_pluginMetadata.js
/**
* The metadata for the knowledge extension of J-Proficiency.
*
* Everything this plugin knows about what knowledge *is* comes out of configuration. The three blocks it
* reads all live in `config.proficiency.json` alongside the conditionals rather than in a file of their
* own, the same way J-ABS-Boss reads its encounters out of `config.jabs.json`- one file per plugin family
* keeps the editor's boards mapping one-to-one onto config files.
*
* None of the parse helpers below may be `#private`. The whole chain runs out of {@link PluginMetadata}'s
* constructor by way of `postInitialize`, and a derived class installs its private members only after
* `super()` returns- so a private helper does not exist yet at the moment this runs, and touching one
* throws before the game finishes booting.
*/
var J_KnowledgePluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The name of this plugin.
	* @param {string} version The version of this plugin.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Also reads the knowledge configuration out of the proficiency config's root.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeKnowledge();
	}
	/**
	* Reads every knowledge tag, skill type mapping and exchange out of configuration.
	*
	* J-Proficiency guarantees the parsed root is on its metadata by the time extensions postInitialize().
	* All three blocks are optional: a game that installs this plugin before authoring anything simply has
	* no tags, and therefore grants nothing to nobody, which is the correct behavior rather than a crash.
	*/
	initializeKnowledge() {
		const externalConfig = J.PROF.Metadata.ExternalConfig;
		const rawTags = externalConfig.knowledgeTags ?? [];
		const rawMapping = externalConfig.skillTypeMapping ?? {};
		const rawExchanges = externalConfig.knowledgeExchanges ?? [];
		/**
		* Every kind of knowledge this game defines.
		* @type {KnowledgeTag[]}
		*/
		this.tags = this.parseTags(rawTags);
		/**
		* A map of tagKey:tag, for resolving a tag by the key everything else refers to it by.
		* @type {Map<string, KnowledgeTag>}
		*/
		this.tagsMap = new Map(this.tags.map((tag) => [tag.key, tag]));
		/**
		* A map of skill type id:tagKey[], describing which kinds of knowledge a skill's use produces.
		* @type {Map<number, string[]>}
		*/
		this.skillTypeMapping = this.parseSkillTypeMapping(rawMapping);
		/**
		* Every standing offer to convert knowledge into something from the database.
		* @type {KnowledgeExchange[]}
		*/
		this.exchanges = this.parseExchanges(rawExchanges);
		/**
		* A map of exchangeKey:exchange, for resolving an offer by the key a caller names it by.
		* @type {Map<string, KnowledgeExchange>}
		*/
		this.exchangesMap = new Map(this.exchanges.map((exchange) => [exchange.key, exchange]));
	}
	/**
	* Builds every knowledge tag out of its raw configuration.
	* @param {any[]} rawTags The unparsed tags from configuration.
	* @returns {KnowledgeTag[]}
	*/
	parseTags(rawTags) {
		const tagMapper = (rawTag) => new KnowledgeTag(rawTag.key, rawTag.name, rawTag.iconIndex, rawTag.description);
		return rawTags.map(tagMapper, this);
	}
	/**
	* Builds the skill type mapping out of its raw configuration.
	*
	* The keys arrive as strings because they are JSON object keys, and are converted to numbers so that a
	* skill's `stypeId` can be looked up without the caller stringifying it first.
	* @param {Object<string, string[]>} rawMapping The unparsed mapping from configuration.
	* @returns {Map<number, string[]>}
	*/
	parseSkillTypeMapping(rawMapping) {
		const mapping = new Map();
		Object.keys(rawMapping).forEach((rawSkillTypeId) => {
			const tagKeys = rawMapping[rawSkillTypeId];
			tagKeys.forEach((tagKey) => this.assertTagIsDefined(tagKey, `skill type ${rawSkillTypeId}`));
			const skillTypeId = parseInt(rawSkillTypeId, 10);
			mapping.set(skillTypeId, tagKeys);
		});
		return mapping;
	}
	/**
	* Builds every exchange out of its raw configuration.
	* @param {any[]} rawExchanges The unparsed exchanges from configuration.
	* @returns {KnowledgeExchange[]}
	*/
	parseExchanges(rawExchanges) {
		const exchangeMapper = (rawExchange) => {
			const { key, tagKey, cost, output } = rawExchange;
			this.assertTagIsDefined(tagKey, `exchange '${key}'`);
			return new KnowledgeExchange(key, tagKey, cost, output.type, output.id, output.count);
		};
		return rawExchanges.map(exchangeMapper, this);
	}
	/**
	* Throws when configuration refers to a knowledge tag that was never defined.
	*
	* This is an authoring mistake that produces no symptom at runtime- the knowledge simply never accrues,
	* or the exchange is never affordable- so it is caught while the config is being read instead.
	* @param {string} tagKey The tag key being referred to.
	* @param {string} referrer A description of what refers to it, for the error message.
	*/
	assertTagIsDefined(tagKey, referrer) {
		if (this.tagsMap.has(tagKey)) return;
		throw new Error(`${referrer} names the knowledge tag '${tagKey}', which is not defined in knowledgeTags.`);
	}
	/**
	* The kinds of knowledge that using a given skill produces.
	*
	* A skill type absent from the mapping produces nothing, which is what makes the whole roster of
	* passives, tool skills and item skills need no exclusion list- and makes a skill type added later
	* fail closed rather than leaking into a pool nobody chose.
	* @param {number} skillId The id of the skill that was used.
	* @returns {string[]}
	*/
	tagKeysForSkillId(skillId) {
		const skill = $dataSkills.at(skillId);
		const { stypeId } = skill;
		if (this.skillTypeMapping.has(stypeId) === false) return Array.empty;
		return this.skillTypeMapping.get(stypeId);
	}
	/**
	* The exchange a caller named.
	*
	* An unknown key is an authoring mistake in an event, and silently doing nothing would look exactly
	* like an empty wallet- so it says so instead.
	* @param {string} exchangeKey The key of the exchange being resolved.
	* @returns {KnowledgeExchange}
	*/
	exchangeByKey(exchangeKey) {
		if (this.exchangesMap.has(exchangeKey) === false) {
			const known = [...this.exchangesMap.keys()].join(", ");
			throw new Error(`there is no knowledge exchange with the key of '${exchangeKey}'. known exchanges: ${known}.`);
		}
		return this.exchangesMap.get(exchangeKey);
	}
};

//#endregion
//#region src/plugins/prof/ext/knowledge/_metadata/initialization.js
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
	const requiredProficiencyVersion = "2.3.0";
	const hasProficiencyRequirement = J.BASE.Helpers.satisfies(J.PROF.Metadata.version.version(), requiredProficiencyVersion);
	if (hasProficiencyRequirement === false) {
		throw new Error(`Either missing J-Proficiency or has a lower version than the required: ${requiredProficiencyVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.PROF.EXT.KNOWLEDGE = {};
/**
* The metadata associated with this plugin.
* @type {J_KnowledgePluginMetadata}
*/
J.PROF.EXT.KNOWLEDGE.Metadata = new J_KnowledgePluginMetadata("J-Proficiency-Knowledge", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.PROF.EXT.KNOWLEDGE.Aliased = {
	Game_Actor: new Map(),
	Game_Party: new Map()
};

//#endregion
//#region src/plugins/prof/ext/knowledge/managers/KnowledgeExchangeManager.js
/**
* A static manager for converting banked knowledge into things from the database.
*
* The arithmetic and the transaction live here rather than in the plugin command that triggers them,
* because a command is not a testable place to keep a rule. The command does nothing but call this and
* report what came back.
*
* Nothing here narrates. No sound, no message, no fanfare- the event that calls the command owns all of
* that, so a game's voice stays in its own events rather than being baked into a plugin.
*/
var KnowledgeExchangeManager = class {
	/**
	* Constructor.<br/>
	* This is a static class; it should not be instantiated.
	*/
	constructor() {
		throw new Error("The KnowledgeExchangeManager is a static class.");
	}
	/**
	* Converts as much of a tag's banked knowledge as the named exchange will take.
	*
	* Every whole unit the balance can afford is bought at once. Whatever is left over is smaller than the
	* price of a unit and stays banked toward the next one, which is why no remainder needs recording
	* anywhere- the balance is the remainder.
	* @param {string} exchangeKey The key of the exchange being performed.
	* @returns {{ units: number, granted: number, exchange: KnowledgeExchange }}
	*/
	static exchange(exchangeKey) {
		const exchange = J.PROF.EXT.KNOWLEDGE.Metadata.exchangeByKey(exchangeKey);
		const points = $gameParty.knowledgePoints(exchange.tagKey);
		const units = exchange.unitsAvailable(points);
		if (units === 0) {
			return {
				units: 0,
				granted: 0,
				exchange
			};
		}
		const price = exchange.priceOf(units);
		const granted = exchange.yieldOf(units);
		const output = exchange.resolveOutput();
		$gameParty.loseKnowledgePoints(exchange.tagKey, price);
		$gameParty.gainItem(output, granted);
		return {
			units,
			granted,
			exchange
		};
	}
	/**
	* Records the outcome of an exchange where the event that asked for it can read it.
	*
	* An event branches its dialogue on this- whether the visit was worth anything, and how much- which is
	* how the plugin manages to hand out a reward without owning a single word of what gets said about it.
	*
	* An id of zero means the event did not ask for that output, and an output nobody asked for is left
	* entirely alone rather than being cleared. Writing to variable zero would quietly stomp on whatever
	* the game keeps there.
	* @param {{ units: number, granted: number, exchange: KnowledgeExchange }} result The exchange outcome.
	* @param {number} resultVariableId The variable to write the number granted into, or zero for none.
	* @param {number} resultSwitchId The switch to record whether anything was granted, or zero for none.
	*/
	static report(result, resultVariableId, resultSwitchId) {
		const { granted } = result;
		if (resultVariableId > 0) {
			$gameVariables.setValue(resultVariableId, granted);
		}
		if (resultSwitchId > 0) {
			const grantedAnything = granted > 0;
			$gameSwitches.setValue(resultSwitchId, grantedAnything);
		}
	}
};

//#endregion
//#region src/plugins/prof/ext/knowledge/objects/Game_Party.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the knowledge points this party has accumulated.
*/
J.PROF.EXT.KNOWLEDGE.Aliased.Game_Party.set("initMembers", Game_Party.prototype.initMembers);
Game_Party.prototype.initMembers = function() {
	J.PROF.EXT.KNOWLEDGE.Aliased.Game_Party.get("initMembers").call(this);
	this.initKnowledgeMembers();
};
/**
* Initializes the members of this class.
*
* Knowledge is held by the party rather than by the actor who earned it. The whole group learns from
* what any of them does, and the things it buys land in a shared bag- so splitting the ledger per actor
* would only invite the player to work out which character to play in order to farm it.
*/
Game_Party.prototype.initKnowledgeMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the proficiency system.
	*/
	this._j._proficiency ||= {};
	/**
	* The points held against each knowledge tag, keyed by that tag's key.
	*
	* A map rather than a field per kind, because the kinds are authored in configuration- naming them
	* here would be the one place this system stopped being generic.
	* @type {Map<string, number>}
	*/
	this._j._proficiency._knowledgePoints ||= new Map();
};
/**
* The points held against every knowledge tag.
* @returns {Map<string, number>}
*/
Game_Party.prototype.knowledgePointsMap = function() {
	return this._j._proficiency._knowledgePoints;
};
/**
* The points currently held against a single knowledge tag.
*
* A tag never earned against reads as zero rather than being written into the map, because reading a
* balance is not a reason to start tracking one.
* @param {string} tagKey The key of the knowledge tag being read.
* @returns {number}
*/
Game_Party.prototype.knowledgePoints = function(tagKey) {
	const points = this.knowledgePointsMap();
	if (points.has(tagKey) === false) return 0;
	return points.get(tagKey);
};
/**
* Adds points to a knowledge tag's balance.
* @param {string} tagKey The key of the knowledge tag being credited.
* @param {number} amount How many points to add.
*/
Game_Party.prototype.gainKnowledgePoints = function(tagKey, amount) {
	const current = this.knowledgePoints(tagKey);
	const updated = current + amount;
	this.setKnowledgePoints(tagKey, updated);
};
/**
* Removes points from a knowledge tag's balance.
* @param {string} tagKey The key of the knowledge tag being debited.
* @param {number} amount How many points to remove.
*/
Game_Party.prototype.loseKnowledgePoints = function(tagKey, amount) {
	const current = this.knowledgePoints(tagKey);
	const updated = current - amount;
	this.setKnowledgePoints(tagKey, updated);
};
/**
* Assigns a knowledge tag's balance outright.
*
* The floor exists because a balance is a record of what was earned and not yet spent; there is no such
* thing as owing knowledge, and nothing downstream is prepared to be handed a negative pile.
* @param {string} tagKey The key of the knowledge tag being written.
* @param {number} amount The balance to assign.
*/
Game_Party.prototype.setKnowledgePoints = function(tagKey, amount) {
	const floored = Math.max(0, amount);
	this.knowledgePointsMap().set(tagKey, floored);
};

//#endregion
//#region src/plugins/prof/ext/knowledge/objects/Game_Actor.js
/**
* Extends {@link #increaseSkillProficiency}.<br/>
* Also credits the party with whatever kinds of knowledge that skill's use produces.
*
* This is deliberately hung on the actor rather than on the battler. {@link Game_Enemy} defines its own
* `increaseSkillProficiency`, so an enemy practising its craft on the party never mints knowledge, and
* that exclusion costs no guard- the class boundary is the rule.
*/
J.PROF.EXT.KNOWLEDGE.Aliased.Game_Actor.set("increaseSkillProficiency", Game_Actor.prototype.increaseSkillProficiency);
Game_Actor.prototype.increaseSkillProficiency = function(skillId, amount = 1) {
	J.PROF.EXT.KNOWLEDGE.Aliased.Game_Actor.get("increaseSkillProficiency").call(this, skillId, amount);
	this.gainKnowledgeFromSkillUse(skillId, amount);
};
/**
* Credits the party with the knowledge that using a given skill produces.
*
* Proficiency can be handed out in the negative by the plugin commands that reward it, and a debit must
* not claw knowledge back: the points may already have been spent, and taking them from a balance that
* no longer holds them would leave the ledger disagreeing with what the player is carrying.
* @param {number} skillId The id of the skill that was used.
* @param {number} amount How much proficiency was gained by using it.
*/
Game_Actor.prototype.gainKnowledgeFromSkillUse = function(skillId, amount) {
	if (amount <= 0) return;
	const tagKeys = J.PROF.EXT.KNOWLEDGE.Metadata.tagKeysForSkillId(skillId);
	tagKeys.forEach((tagKey) => $gameParty.gainKnowledgePoints(tagKey, amount));
};

//#endregion
//#region src/plugins/prof/ext/knowledge/registerKnowledgeCurrencies.js
/**
* Puts every kind of knowledge on the menu's currency strip.
*
* The menu is genuinely optional here- knowledge accrues and is spent perfectly well without one- so
* this is the single namespace check that arrangement is allowed. J-CMS knows nothing about knowledge
* in return; it publishes a strip and anything with something to show registers itself.
*
* The tags are read out of configuration rather than named here, so a game adding a fifth kind of
* knowledge gets it on the strip without anybody touching this file.
*/
if (J.CMS) {
	J.PROF.EXT.KNOWLEDGE.Metadata.tags.forEach((tag) => {
		const definition = new CurrencyDefinition(`knowledge-${tag.key}`, tag.iconIndex, () => tag.name, () => $gameParty.knowledgePoints(tag.key));
		Window_Currencies.register(definition);
	});
}

//#endregion
//#region src/plugins/prof/ext/knowledge/_metadata/pluginCommands.js
/**
* Plugin command for converting a tag's banked knowledge into whatever the named exchange offers.
*/
PluginManager.registerCommand(J.PROF.EXT.KNOWLEDGE.Metadata.name, "exchange-knowledge", (args) => {
	const { exchangeKey, resultVariableId, resultSwitchId } = args;
	const parsedVariableId = parseInt(resultVariableId, 10);
	const parsedSwitchId = parseInt(resultSwitchId, 10);
	const result = KnowledgeExchangeManager.exchange(exchangeKey);
	KnowledgeExchangeManager.report(result, parsedVariableId, parsedSwitchId);
});

//#endregion
//# sourceMappingURL=J-Proficiency-Knowledge.js.map