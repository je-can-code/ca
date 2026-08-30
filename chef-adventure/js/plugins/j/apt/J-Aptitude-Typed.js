//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.3 APT-TYPED] Adds typed (element/weapon type/skill type) AP gains and teachables.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Aptitude
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Aptitude
 * @orderAfter J-Log
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin extends the Aptitude System by allowing the ability to define
 * teachables to require certain "types" of AP, and also allow the player to
 * gain certain "types" of AP.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-Log; log the type of AP gained.
 * - J-Popups (+ J-Popups-APT); updates popups for typed AP gained.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This plugin allows the dev to create teachable skills that demand specific
 * "types" of AP to be earned instead of just plain AP. AP is "typed" by one of
 * two approaches: either explicit (putting a new "typed AP gain" tag on
 * specific enemies, similar to the existing AP gain tag) or implicit (the
 * ability to dynamically assess elements and the means of which an enemy was
 * defeated to determine what "types" of AP the player should earn).
 *
 * By default, implicit AP gains are disabled.
 * Update the plugin parameters to enable implicit AP gains.
 * See the next section for more details.
 *
 * ============================================================================
 * EXPLICIT vs IMPLICIT
 *
 * EXPLICIT
 * What is "explicit" typed AP gain?
 * You, the dev, can explicit apply tags to enemies of your choosing and state
 * that a particular enemy will grant a particular type of AP. Period. That is
 * it. You can specify that a fire demon grants 25 fire AP, or if you wanted,
 * you can specify that that same fire demon actually grants 10000 water AP. It
 * is explicit and simply whatever tags you apply.
 *
 *
 * IMPLICIT
 * What is "implicit" typed AP gain?
 * You, the dev, no longer need to worry about that cumbersome effort of having
 * to cycle over the entire database of enemies and applying tags to them.
 * Instead, the system will evaluate the means of defeat and the enemy being
 * defeated and determine "which type of AP" the player should gain. The system
 * will identify enemies as "aligned" by the following conditions in
 * conjunction with the plugin parameter values (that have sensible defaults).
 *
 * IMPLICIT ELEMENTAL GAIN FROM ENEMIES (elemental type)
 * If an enemy has a elemental trait on them that is equal to or lesser than
 * the plugin parameter "Elemental Alignment Threshold", then that enemy is
 * "aligned" with that particular element.
 *
 * IMPLICIT ELEMENTAL GAIN FROM ENEMIES (slayer type)
 * If an enemy has an elemental trait that is prefixed with "vs " or "x " or
 * "tool-" and it has a value that is equal to or greater than the plugin
 * parameter for "Slayer Alignment Threshold", then that enemy is "aligned"
 * with that particular element.
 *
 * NOTE ABOUT "SLAYER" TYPED ELEMENTS
 * "Slayer" type elements are an arbitrary concept where an element doubles as
 * a "taxonomy/attribute/functionality identifier" for an enemy. Examples of
 * such might be:
 * - "vs Reptile"     (taxonomy of lizards and dragons)
 * - "vs Undead"      (taxonomy of zombies and skeletons)
 * - "vs Slime"       (taxonomy of slimes and oozes)
 * - "vs Construct"   (taxonomy of robots and machines)
 * - "x Flying"       (attribute of enemies that fly or have wings)
 * - "x Armored"      (attribute of enemies that are armored or have shells)
 * - "tool-shatter"   (functionality of being susceptible to shatter effects)
 * - "tool-overload"  (functionality of being susceptible to overload effects)
 *
 * I do not know if this is a common usage of elements, but it is how I
 * leveraged elements in my own games, so if you want this type of
 * functionality in your game, you'll need to adapt your elements to follow
 * such conventions because it is hard-coded to look for this stuff.
 * You also do not have to use it.
 *
 * IMPLICIT WEAPON TYPE GAIN FROM USAGE
 * If an enemy is defeated with a skill that has a "required weapon type" value
 * on it, then AP gained from that enemy will be of that "weapon type".
 *
 * IMPLICIT SKILL TYPE GAIN FROM USAGE
 * If an enemy is defeated with a skill that is a part of a particular "skill
 * type", then AP gained from that enemy will be of that "skill type".
 *
 * IMPLICIT ELEMENT GAIN FROM USAGE
 * If an enemy is defeated with a skill that has a particular element (or
 * elements if using J-Elementalistics), then AP gained from that enemy will be
 * of that particular element.
 *
 *
 * NOTE ABOUT AP GAINED IMPLICITLY
 * All implicit gains will refer to the base <ap:AMOUNT> tag and will be gained
 * at "Percent of Implicitly-Typed AP Gained"% of AMOUNT. By default, this is
 * set to 0, meaning that no implicit AP gains will occur. If this system is
 *
 *
 * ============================================================================
 * TYPED TEACHABLES
 * Have you ever wanted to enable the ability to associate an element or
 * weapon type or skill type with a particular teachable so the player would
 * need to gain a particular type of AP to learn it? Well now you can! By
 * applying the appropriate tag to across the various database locations, you
 * too can do cool things that only others with this plugin can do.
 *
 * NOTE ABOUT IMPLICIT vs EXPLICIT GAINED AP
 * The typed teachables do not care whether the typed AP is explicitly gained
 * or implicitly gained. If the teachable requires 25 fire AP and the player
 * gains 25 fire AP from either approach, it will teach them the skill.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Weapons
 * - Armor
 * - States
 *
 * TAG FORMAT:
 *  <aptitudeTyped:[SKILL_ID, REQUIRED_AP, DOMAIN, ID_OR_NAME]>
 *    Where SKILL_ID is the database id of the skill to learn,
 *    Where REQUIRED_AP is how much AP that source needs to teach it.
 *    Where DOMAIN is the family of AP typing to consider for ID_OR_NAME.
 *    Where ID_OR_NAME is the id or name of the element/weapon/skilltype.
 *
 * TAG EXAMPLES:
 *  <aptitudeTyped:[12, 150, element, fire]>
 * This source enables learning skill of id 12 once the owner gains 150 points
 * of "fire" element AP.
 *
 *  <aptitudeTyped:[20, 800, weapontype, 5]>
 * This source enables learning skill of id 20 once the owner gains 800 points
 * of weapon type with id 5 worth of AP.
 *
 *  <aptitudeTyped:[74, 1250, skilltype, sorcery]>
 * This source enables learning skill of id 74 once the owner gains 1250 points
 * of skill type with name "sorcery" worth of AP.
 *
 * ============================================================================
 * (explicit) TYPED AP GAIN
 * Have you ever wanted to gain AP of a particular type from enemies? Well now
 * you can! By applying the appropriate tags to enemies in the database, you
 * too can gain AP of a particular type from enemies.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <apTyped:[AMOUNT, DOMAIN, ID_OR_NAME]>
 *    Where AMOUNT is the amount of AP to be gained.
 *    Where DOMAIN is the family of AP typing to consider for ID_OR_NAME.
 *    Where ID_OR_NAME is the id or name of the element/weapon/skilltype.
 *
 * TAG EXAMPLES:
 *  <apTyped:[6, element, fire]>
 * This enemy will yield 6 fire-element AP upon defeat.
 *
 *  <apTyped:[3, weapontype, sword]>
 * This enemy will yield 3 sword-weapontype AP upon defeat.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.3
 *    Routed the missing-teachable warning through J-Base's new Diagnostics, so
 *    it names J-Aptitude-Typed in the console.
 * - 1.1.2
 *    Repointed typed AP gain logging at J-Log's new $mapLogs registry. The
 *    $actionLogManager global this called is gone. Requires J-Log 3.0.0 when
 *    J-Log is installed at all.
 * - 1.1.1
 *    Adapted to the RPGManager array read signature.
 * - 1.1.0
 *    Fixed <apTyped:[AMOUNT, DOMAIN, ID_OR_NAME]> never matching — the
 *    regex required a 4th leading numeric field that the documented
 *    3-argument format never had.
 *    Fixed AptitudeTeachable.js never being imported in entry.js, so
 *    setApTypeKey()/apTypeKey() were never actually attached.
 *    Renamed ApTypeKey.DomainType.WeaponType/SkillType to Weapon/Skill.
 *    Replaced the leftover boilerplate plugin description.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param implicitConfig
 * @text IMPLICIT SETUP
 *
 * @param implicitEnemyElementPercent
 * @parent implicitConfig
 * @type number
 * @text Percent of Implicitly-Typed AP Gained
 * @desc The percent of AP that will be gained from implicitly typed actions. Set to zero to disable implicit gains.
 * @min 0
 * @max 100
 * @default 0
 *
 * @param resistThreshold
 * @parent implicitConfig
 * @type number
 * @text Elemental Alignment Threshold
 * @desc The highest elemental rate allowed to identify an enemy's elemental alignment.
 * @min 0
 * @max 99
 * @default 75
 *
 * @param slayerWeaknessThreshold
 * @parent implicitConfig
 * @type number
 * @text Slayer Alignment Threshold
 * @desc The lowest elemental rate allowed to identify an enemy's taxonomy alignment.
 * @min 101
 * @max 1000
 * @default 125
 *
 * @param excludedAlignmentElements
 * @parent implicitConfig
 * @type string[]
 * @text Excluded Alignment Elements
 * @desc A list of elemental types that will not be considered for alignment.
 * @default []
 *
 * @command mod-ap-all
 * @text Add/Remove Typed AP (Party)
 * @desc Adds or removes a designated amount of typed AP from all members of the current party.
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The amount of AP to modify by. Negative removes AP. Per-source never goes below 0.
 * @default 10
 * @arg domain
 * @type select
 * @option element
 * @option weapontype
 * @option skilltype
 * @desc The family of AP typing to consider for the actor.
 * @default element
 * @arg id
 * @type number
 * @min 1
 * @max 9999
 * @desc The id of the element, weapon type, or skill type to consider for the actor.
 * @default 1
 *
 * @command mod-ap
 * @text Add/Remove Typed AP
 * @desc Adds or removes a designated amount of typed AP from an actor by its id.
 * @arg actorId
 * @type actor
 * @desc The id of the actor to modify AP for.
 * @default 1
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The amount of AP to modify by. Negative removes AP. Per-source never goes below 0.
 * @default 10
 * @arg domain
 * @type select
 * @option element
 * @option weapontype
 * @option skilltype
 * @desc The family of AP typing to consider for the actor.
 * @default element
 * @arg id
 * @type number
 * @min 1
 * @max 9999
 * @desc The id of the element, weapon type, or skill type to consider for the actor.
 * @default 1
 */
//endregion annotations

//#region src/plugins/apt/ext/typed/_models/ApTypeKey.js
var ApTypeKey = class {
	/**
	* The types available for domain on a typed AP teachable.
	* @type {{Element: string, Weapon: string, Skill: string}}
	*/
	static DomainType = {
		Element: "element",
		Weapon: "weapontype",
		Skill: "skilltype"
	};
	/**
	* The domain of the key.
	* @type {string}
	*/
	domain = String.empty;
	/**
	* The id of the key.
	* @type {number}
	*/
	id = 0;
	/**
	* Constructor.
	* @param {string} domain The domain of the key.
	* @param {number} id The id of the key.
	*/
	constructor(domain, id) {
		this.domain = String(domain);
		this.id = Number(id);
	}
	/**
	* Determines equality with another key by domain+id.
	* @param {ApTypeKey} other - The other key to compare against.
	* @returns {boolean} - True when both domain and id match.
	*/
	equals(other) {
		return this.domain === other.domain && this.id === other.id;
	}
};

//#endregion
//#region src/plugins/apt/ext/typed/_models/ApTypeGrant.js
/**
* Represents a typed AP grant consisting of a `domain`, an `id`, and an `amount`.
* Used for explicit typed AP reward lines parsed off enemies.
*/
var ApTypeGrant = class {
	/**
	* The amount of AP to grant (pre- or post-scaling depending on usage site).
	* @type {number}
	*/
	amount = 0;
	/**
	* The normalized domain name for this grant.
	* @type {string}
	*/
	domain = String.empty;
	/**
	* The numeric id within the domain.
	* @type {number}
	*/
	id = 0;
	/**
	* Constructs a new typed AP grant.
	* @param {number} amount - The amount of AP granted.
	* @param {string} domain - The domain name (normalized lowercase recommended).
	* @param {number} id - The numeric id within the domain.
	*/
	constructor(amount, domain, id) {
		this.amount = Number(amount);
		this.domain = String(domain).trim().toLowerCase();
		this.id = Number(id);
	}
	/**
	* Creates a key model from this grant’s identity for matching teachables.
	* @returns {ApTypeKey} - The domain+id key.
	*/
	toKey() {
		return new ApTypeKey(this.domain, this.id);
	}
};

//#endregion
//#region src/plugins/apt/ext/typed/_models/ApTypeDisplayInfo.js
/**
* Represents the display information for a typed AP key: a user-facing
* `name` and an `icon` index. This is a simple runtime record.
*/
var ApTypeDisplayInfo = class {
	/**
	* The display name.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The icon index for this display.
	* @type {number}
	*/
	icon = 0;
	/**
	* Constructs a new display info.
	* @param {string} name - The user-facing name to display
	* @param {number} icon - The icon index corresponding to the key
	*/
	constructor(name, icon) {
		this.name = String(name);
		this.icon = Number(icon);
	}
};

//#endregion
//#region src/plugins/apt/ext/typed/_models/AptitudeTeachable.js
/**
* Sets the AP type key for this teachable.
* @param {ApTypeKey} apTypeKey - The AP type key to set.
*/
AptitudeTeachable.prototype.setApTypeKey = function(apTypeKey) {
	/**
	* The AP type key for this teachable.
	* @type {ApTypeKey} apTypeKey - The AP type key to set.
	*/
	this.apType = apTypeKey;
};
/**
* Gets the AP type key for this teachable.
* @returns {ApTypeKey} The AP type key.
*/
AptitudeTeachable.prototype.apTypeKey = function() {
	return this.apType;
};
/**
* Determines if this teachable is typed.
* @returns {boolean}
*/
AptitudeTeachable.prototype.isTyped = function() {
	return this.apType !== undefined;
};

//#endregion
//#region src/plugins/apt/ext/typed/_metadata/_pluginMetadata.js
/**
* The metadata for the J-APT Typed extension.
*/
var JAptitudeTyped_PluginMetadata = class extends PluginMetadata {
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
	* Also initializes the typed‑AP configuration from parsed parameters.
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
		* Integer percent applied to inferred enemy element types per kill (0-100).
		* @type {number}
		*/
		this.ImplicitEnemyElementPercent = JsonMapper.parseObject(this.parsedPluginParameters["implicitEnemyElementPercent"]);
		/**
		* The strict resistance threshold (elements with rate < this are alignments).
		* Authored in percent points, consumed as the `/100` factor element rates are expressed in.
		* @type {number}
		*/
		this.ResistThreshold = JsonMapper.parseObject(this.parsedPluginParameters["resistThreshold"]) / 100;
		/**
		* The strict slayer/attribute threshold (elements with rate > this qualify).
		* Authored in percent points, consumed as the `/100` factor element rates are expressed in.
		* @type {number}
		*/
		this.SlayerWeaknessThreshold = JsonMapper.parseObject(this.parsedPluginParameters["slayerWeaknessThreshold"]) / 100;
		/**
		* Names or ids to exclude from resistance-as-alignment.
		* @type {string[]}
		*/
		this.ExcludedAlignmentElements = JsonMapper.parseObject(this.parsedPluginParameters["excludedAlignmentElements"]);
		/**
		* Whether to include auto-states in inference (reserved for future use).
		* @type {boolean}
		*/
		this.IncludeAutoStatesInInference = false;
	}
};

//#endregion
//#region src/plugins/apt/ext/typed/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
J.APT ||= {};
J.APT.EXT ||= {};
J.APT.EXT.TYPED = J.APT.EXT.TYPED || {};
/**
* The plugin umbrella that governs all things related to this extension plugin.
* Name and Version are owned by the metadata instance.
*/
J.APT.EXT.TYPED.Metadata = new JAptitudeTyped_PluginMetadata("J-Aptitude-Typed", "1.1.3");
/**
* A collection of all aliased methods for this plugin.
*/
J.APT.EXT.TYPED.Aliased = {
	ApManager: new Map(),
	Game_Temp: new Map(),
	JABS_Engine: new Map(),
	RPG_Base: new Map(),
	RPG_Enemy: new Map(),
	Window_AptitudeSourceDetails: new Map(),
	Window_AptitudeAggregateDetails: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.APT.EXT.TYPED.RegExp = {
	/**
	* Typed aptitude teachable structure (with domain+idOrName).
	*
	* <pre>
	* Structure:
	*  <aptitudeTyped:[SKILL_ID, REQUIRED_AP, DOMAIN, ID_OR_NAME]>
	*
	* Examples:
	*  <aptitudeTyped:[12, 150, element, fire]>
	*  <aptitudeTyped:[12, 150, weaponType, sword]>
	*  <aptitudeTyped:[12, 150, skillType, magic]>
	* </pre>
	* @type {RegExp}
	*/
	AptitudeTeachableTyped: /<aptitudeTyped:[ ]?(\[\d+,[ ]?\d+,[ ]?[A-Za-z]+,[ ]?[A-Za-z0-9_\- ]+])>/gi,
	/**
	* Typed AP reward on enemies (repeatable; flat amounts, post-scaling).
	*
	* <pre>
	* Structure:
	*  <apTyped:[AMOUNT, DOMAIN, ID_OR_NAME]>
	*
	* Examples:
	*  <apTyped:[6, element, fire]>
	*  <apTyped:[3, weaponType, sword]>
	* </pre>
	* @type {RegExp}
	*/
	ApTypedReward: /<apTyped:[ ]?(\[\d+,[ ]?[A-Za-z]+,[ ]?[A-Za-z0-9_\- ]+])>/gi
};

//#endregion
//#region src/plugins/apt/ext/typed/database/RPG_Base.js
/**
* Extends {@link #buildAptitudeTeachings}.<br/>
* Also appends typed teachables parsed from `<aptitudeTyped:[skillId, requiredAp, domain, idOrName]>`.
*/
J.APT.EXT.TYPED.Aliased.RPG_Base.set("buildAptitudeTeachings", RPG_Base.prototype.buildAptitudeTeachings);
RPG_Base.prototype.buildAptitudeTeachings = function() {
	/** @type {AptitudeTeachable[]} */
	const base = J.APT.EXT.TYPED.Aliased.RPG_Base.get("buildAptitudeTeachings").call(this);
	/** @type {Array<[number, number, string, string|number]>} */
	const raw = RPGManager.getArraysFromNotesByRegex(this, J.APT.EXT.TYPED.RegExp.AptitudeTeachableTyped);
	const typed = raw.map(([skillId, requiredAp, domain, idOrName]) => {
		const dom = String(domain).trim().toLowerCase();
		const id = ApManager.resolveDomainId(dom, idOrName);
		if (Number.isNaN(id) === true) return null;
		const t = new AptitudeTeachable(skillId, requiredAp);
		const key = new ApTypeKey(dom, id);
		t.setApTypeKey(key);
		return t;
	}).filter((t) => !!t);
	return base.concat(typed);
};

//#endregion
//#region src/plugins/apt/ext/typed/database/RPG_Enemy.js
/**
* The explicit typed AP rewards from `<apTyped:[AMOUNT, DOMAIN, ID_OR_NAME]>`.
* @returns {ApTypeGrant[]}
*/
RPG_Enemy.prototype.typedApRewards = function() {
	const raw = RPGManager.getArraysFromNotesByRegex(this, J.APT.EXT.TYPED.RegExp.ApTypedReward);
	return raw.map(([amount, domain, idOrName]) => {
		const dom = String(domain).trim().toLowerCase();
		const id = ApManager.resolveDomainId(dom, idOrName);
		const ap = Number(amount);
		if (!Number.isFinite(ap) || ap <= 0) return null;
		if (!Number.isFinite(id)) return null;
		return new ApTypeGrant(ap, dom, id);
	}).filter((entry) => !!entry);
};
/**
* Computes (and caches) inferred enemy element types from database element rates.
* @returns {ApTypeKey[]}
*/
RPG_Enemy.prototype.inferredTypedElements = function() {
	const cached = $gameTemp.getAptTypedInferredEnemyTypes(this.id);
	if (cached) {
		return cached.map((id) => new ApTypeKey(ApTypeKey.DomainType.Element, id));
	}
	const ids = this.computeInferredTypedElementIds();
	$gameTemp.setAptTypedInferredEnemyTypes(this.id, ids);
	return ids.map((id) => new ApTypeKey(ApTypeKey.DomainType.Element, id));
};
/**
* Computes the list of element ids that represent this enemy’s inferred types
* based on database element rates and naming conventions. No runtime states are considered.
*
* Rules overview:
* - Standard (non‑prefixed) elements with rate < ResistThreshold are alignments.
* - Prefixed elements (`vs `, `x `, `tool-`) with rate > SlayerWeaknessThreshold are taxonomy/attributes.
* - No cap; exclusions (names or ids) only apply to the resistance‑alignment path.
* - Exclusions only apply to the resistance path.
*
* @returns {number[]} The list of inferred element ids.
*/
RPG_Enemy.prototype.computeInferredTypedElementIds = function() {
	const resistThreshold = J.APT.EXT.TYPED.Metadata.ResistThreshold;
	const slayerThreshold = J.APT.EXT.TYPED.Metadata.SlayerWeaknessThreshold;
	const excluded = J.APT.EXT.TYPED.Metadata.ExcludedAlignmentElements;
	const excludedIds = new Set();
	const excludedNames = new Set();
	excluded.forEach((entry) => {
		const asNum = Number(entry);
		if (Number.isFinite(asNum)) {
			excludedIds.add(asNum);
		} else {
			const normalizedName = String(entry).trim().toLowerCase();
			excludedNames.add(normalizedName);
		}
	});
	const isSlayer = (low) => low.startsWith("vs ");
	const isAttr = (low) => low.startsWith("x ");
	const isTool = (low) => low.startsWith("tool-");
	const names = $dataSystem.elements;
	const traits = Array.isArray(this.traits) ? this.traits : [];
	const rates = new Array(names.length).fill(1);
	for (let i = 0; i < traits.length; i++) {
		const t = traits[i];
		if (t && t.code === 11) {
			const eid = t.dataId;
			rates[eid] = rates[eid] * Number(t.value);
		}
	}
	const inferred = [];
	for (let eid = 0; eid < names.length; eid++) {
		const rawName = names[eid];
		if (!rawName) continue;
		const name = String(rawName).trim();
		const low = name.toLowerCase();
		const rate = rates[eid];
		const slayer = isSlayer(low);
		const attr = isAttr(low);
		const tool = isTool(low);
		const prefixed = slayer || attr || tool;
		if (prefixed === false) {
			if (excludedIds.has(eid)) continue;
			if (excludedNames.has(low)) continue;
			if (rate < resistThreshold) {
				inferred.push(eid);
			}
		}
		if (prefixed === true) {
			if (rate > slayerThreshold) {
				inferred.push(eid);
			}
		}
	}
	return inferred;
};

//#endregion
//#region src/plugins/apt/ext/typed/objects/Game_Temp.js
/**
* Extends {@link #initMembers}.
* Also initializes caches for typed AP inference.
*/
J.APT.EXT.TYPED.Aliased.Game_Temp.set("initMembers", Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function() {
	J.APT.EXT.TYPED.Aliased.Game_Temp.get("initMembers").call(this);
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with APT.
	*/
	this._j._apt ||= {};
	/**
	* A grouping of all properties associated with APT-typed.
	*/
	this._j._apt._typed = {};
	/**
	* Cache of inferred enemy element type ids by enemy database id.
	* @type {Record<number, number[]>}
	*/
	this._j._apt._typed._aptTypedInferredEnemyTypes = {};
};
/**
* Gets cached inferred element ids for an enemy (if present).
* @param {number} enemyId The database enemy id.
* @returns {number[]|null} The cached list or null.
*/
Game_Temp.prototype.getAptTypedInferredEnemyTypes = function(enemyId) {
	return this.aptTypedInferredEnemyTypes()[enemyId] || null;
};
/**
* Sets cached inferred element ids for an enemy.
* @param {number} enemyId The database enemy id.
* @param {number[]} ids The element ids to cache.
*/
Game_Temp.prototype.setAptTypedInferredEnemyTypes = function(enemyId, ids) {
	this._j._apt._typed._aptTypedInferredEnemyTypes[enemyId] = Array.isArray(ids) ? ids.slice() : [];
};
/**
* Gets the apt typed inferred enemy types.
* @returns {Record<number, number[]>} The aptTypedInferredEnemyTypes.
*/
Game_Temp.prototype.aptTypedInferredEnemyTypes = function() {
	return this._j._apt._typed._aptTypedInferredEnemyTypes;
};

//#endregion
//#region src/plugins/apt/ext/typed/managers/ApManager.js
/**
* Overwrites {@link #gainAp}.<br/>
* Routes untyped AP through `gainApUntypedOnly` so typed tracks are not fueled by it.
* @param {Game_Actor} actor The actor gaining AP.
* @param {number} amount The amount of AP awarded.
* @param {string} cause A short label describing the cause.
*/
ApManager.gainAp = function(actor, amount, cause = "victory") {
	return this.gainApUntypedOnly(actor, amount, cause);
};
/**
* Awards typed AP to the given actor for teachables matching the `domain` and `id`.
* @param {Game_Actor} actor The actor gaining AP.
* @param {number} amount The amount of AP awarded.
* @param {string} domain The domain key ('element' | 'weaponType' | 'skillType').
* @param {number} id The id within the domain.
* @param {string} cause A short label (ex: 'on-kill:typed').
*/
ApManager.gainTypedAp = function(actor, amount, domain, id, cause = "typed") {
	if (this.canGainAp(actor, amount) === false) return;
	const dom = String(domain).trim().toLowerCase();
	const sources = this.activeTeachables(actor);
	sources.forEach(({ key, teachables }) => {
		const matches = teachables.filter((teachable) => {
			if (teachable.isTyped() === false) return false;
			const apTypeKey = teachable.apTypeKey();
			if (apTypeKey.domain !== dom) return false;
			if (apTypeKey.id !== id) return false;
			return true;
		});
		if (matches.length === 0) return;
		this.applyApToSource(actor, key, matches, amount, cause);
	});
};
/**
* Routes untyped AP to only untyped teachables (those lacking `apType`).
* @param {Game_Actor} actor The actor gaining AP.
* @param {number} amount The amount of AP awarded.
* @param {string} cause A short label describing the cause.
*/
ApManager.gainApUntypedOnly = function(actor, amount, cause = "victory") {
	if (this.canGainAp(actor, amount) === false) return;
	const sources = this.activeTeachables(actor);
	sources.forEach(({ key, teachables }) => {
		const untypedTeachables = teachables.filter((teachable) => {
			if (teachable.isTyped() === true) return false;
			return true;
		});
		if (untypedTeachables.length === 0) return;
		this.applyApToSource(actor, key, untypedTeachables, amount, cause);
	});
};
/**
* Resolves a domain/idOrName pair into a numeric id using $dataSystem lists.
* Supported domains: 'element' | 'weaponType' | 'skillType'.
* @param {string} domain The domain to resolve against.
* @param {string|number} idOrName The numeric id or case-insensitive name.
* @returns {number} The resolved id (NaN if not found).
*/
ApManager.resolveDomainId = function(domain, idOrName) {
	const asNum = Number(idOrName);
	if (Number.isFinite(asNum)) return asNum;
	const key = String(domain).trim().toLowerCase();
	let list;
	switch (key) {
		case ApTypeKey.DomainType.Element:
			list = $dataSystem.elements;
			break;
		case ApTypeKey.DomainType.Weapon:
			list = $dataSystem.weaponTypes;
			break;
		case ApTypeKey.DomainType.Skill:
			list = $dataSystem.skillTypes;
			break;
		default: return NaN;
	}
	const needle = String(idOrName).trim().toLowerCase();
	const nameIndex = list.findIndex((name) => name && String(name).trim().toLowerCase() === needle);
	if (nameIndex === -1) {
		return NaN;
	}
	return nameIndex;
};
/**
* Resolves display parts (name + iconIndex) for a typed AP key.
*
* @param {ApTypeKey|{domain:string,id:number}} key - The typed key to resolve.
* @returns {ApTypeDisplayInfo} - The display name and icon index.
*/
ApManager.apTypeDisplay = function(key) {
	const domain = String(key.domain).trim().toLowerCase();
	const id = Number(key.id);
	let name;
	let icon;
	switch (domain) {
		case ApTypeKey.DomainType.Element:
			name = $dataSystem.elements[id];
			icon = IconManager.element(id);
			break;
		case ApTypeKey.DomainType.Weapon:
			name = $dataSystem.weaponTypes[id];
			icon = IconManager.weaponType(id);
			break;
		case ApTypeKey.DomainType.Skill:
			name = $dataSystem.skillTypes[id];
			icon = IconManager.skillType(id);
			break;
		default:
			name = `${domain}:${id}`;
			icon = 0;
			break;
	}
	return new ApTypeDisplayInfo(name, icon);
};

//#endregion
//#region src/plugins/apt/ext/typed/managers/JABS_Engine.js
if (J.ABS) {
	/**
	* Extends {@link #gainAptitudeReward}.<br/>
	* Also distributes typed AP from explicit enemy lines and inferred enemy element types.
	* @param {number} ap The untyped AP to gain (from `<ap:N>`).
	* @param {JABS_Battler} actor The map battler that defeated the target.
	* @param {Game_Enemy} enemy The enemy that was defeated.
	*/
	J.APT.EXT.TYPED.Aliased.JABS_Engine.set("gainAptitudeReward", JABS_Engine.prototype.gainAptitudeReward);
	JABS_Engine.prototype.gainAptitudeReward = function(ap, actor, enemy) {
		J.APT.EXT.TYPED.Aliased.JABS_Engine.get("gainAptitudeReward").call(this, ap, actor, enemy);
		const implicitEnemyPct = J.APT.EXT.TYPED.Metadata.ImplicitEnemyElementPercent;
		const enemyData = enemy.enemy();
		const explicitTyped = enemyData.typedApRewards();
		const inferredTypes = enemyData.inferredTypedElements();
		const hasExplicit = explicitTyped.length > 0;
		const hasInferred = implicitEnemyPct > 0 && inferredTypes.length > 0;
		if (!hasExplicit && !hasInferred) return;
		$gameParty.members().filter((member) => this.canGainAptitudeReward(member, enemy)).forEach((member) => this.distributeTypedAptitudeRewardsForMember(member, ap, enemy, explicitTyped, inferredTypes, implicitEnemyPct));
	};
	/**
	* Distributes typed AP rewards (explicit and inferred) to a single eligible party member.
	*
	* @param {Game_Actor} member - The party member receiving typed AP.
	* @param {number} baseAp - The base untyped AP amount granted by the enemy.
	* @param {RPG_Enemy} enemy - The defeated enemy database entry.
	* @param {ApTypeGrant[]} explicitTyped - Flat typed rewards from enemy notes.
	* @param {ApTypeKey[]} inferredTypes - Inferred enemy element types from DB rates.
	* @param {number} implicitEnemyPct - Integer percent for inferred enemy types (0-100).
	*/
	JABS_Engine.prototype.distributeTypedAptitudeRewardsForMember = function(member, baseAp, enemy, explicitTyped, inferredTypes, implicitEnemyPct) {
		const jabsBattler = JABS_AiManager.getBattlerByUuid(member.getUuid());
		if (!jabsBattler) return;
		const levelMultiplier = this.getRewardScalingMultiplier(enemy, jabsBattler);
		const baseActualAp = Math.ceil(baseAp * levelMultiplier);
		if (explicitTyped.length > 0) {
			explicitTyped.forEach((grant) => {
				const actualAp = Math.ceil(grant.amount * levelMultiplier);
				ApManager.gainTypedAp(member, actualAp, grant.domain, grant.id, "on-kill:typed:explicit");
				this.onTypedApGained(actualAp, jabsBattler.getCharacter(), new ApTypeKey(grant.domain, grant.id));
				this.createLogApTyped(actualAp, jabsBattler, new ApTypeKey(grant.domain, grant.id));
			});
		}
		if (implicitEnemyPct > 0 && inferredTypes.length > 0) {
			inferredTypes.forEach((key) => {
				const bonus = Math.ceil(baseActualAp * implicitEnemyPct / 100);
				if (bonus > 0) {
					ApManager.gainTypedAp(member, bonus, key.domain, key.id, "on-kill:typed:inferred-enemy");
					this.onTypedApGained(bonus, jabsBattler.getCharacter(), key);
					this.createLogApTyped(bonus, jabsBattler, key);
				}
			});
		}
	};
	/**
	* Lifecycle event: typed AP was awarded to a battler on the map.
	* Extended by optional plugins (e.g. J-Popups-APT) to surface map feedback.
	* @param {number} apPoints The typed AP amount granted.
	* @param {Game_Character} character The character who received the reward.
	* @param {ApTypeKey} apTypeKey The typed key (domain + id) for labeling.
	*/
	JABS_Engine.prototype.onTypedApGained = function(apPoints, character, apTypeKey) {};
	/**
	* Creates a typed AP log entry with icon + short label.
	* @param {number} apPoints - The AP gained.
	* @param {JABS_Battler} battler - The battler gaining the AP.
	* @param {ApTypeKey} apTypeKey - The typed key (domain+id) for labeling.
	*/
	JABS_Engine.prototype.createLogApTyped = function(apPoints, battler, apTypeKey) {
		if (!J.LOG) return;
		const { name, icon } = ApManager.apTypeDisplay(apTypeKey);
		const message = `\\C[16]${battler.battlerName()}\\C[0] gained \\C[29]\\*${apPoints}\\*\\C[0] AP \\i[${icon}] [${name}].`;
		const apLog = new ActionLogBuilder().setMessage(message).build();
		$mapLogs.action.addLog(apLog);
	};
}

//#endregion
//#region src/plugins/apt/ext/typed/windows/Window_Base.js
/**
* Draws a compact typed AP badge (icon + [label]) right-aligned within the left column.
* @param {ApTypeKey} apTypeKey - The typed key to render.
* @param {number} x - The row's x coordinate.
* @param {number} y - The row's y coordinate.
*/
Window_Base.prototype.drawTypedBadge = function(apTypeKey, x, y) {
	const display = ApManager.apTypeDisplay(apTypeKey);
	const label = `[${display.name}]`;
	const iconW = ImageManager.iconWidth;
	const pad = 4;
	const labelW = this.textWidth(label);
	const badgeTotalW = iconW + pad + labelW;
	const badgeX = x + badgeTotalW;
	this.drawIcon(display.icon, badgeX, y + 2);
	this.changeTextColor(this.systemColor());
	this.drawText(label, badgeX + iconW + pad, y, labelW, "left");
	this.resetTextColor();
};

//#endregion
//#region src/plugins/apt/ext/typed/windows/Window_AptitudeSourceDetails.js
/**
* Extends {@link #drawExtensionData}.<br/>
* Also draws a small typed badge (icon + label) when the teachable is typed.
* @param {AptitudeTeachable} teachable - The teachable being rendered.
* @param {string} sourceKey - The stable key for the source currently displayed.
* @param {number} x - The row's x coordinate.
* @param {number} y - The row's y coordinate.
*/
J.APT.EXT.TYPED.Aliased.Window_AptitudeSourceDetails.set("drawExtensionData", Window_AptitudeSourceDetails.prototype.drawExtensionData);
Window_AptitudeSourceDetails.prototype.drawExtensionData = function(teachable, sourceKey, x, y) {
	J.APT.EXT.TYPED.Aliased.Window_AptitudeSourceDetails.get("drawExtensionData").call(this, teachable, sourceKey, x, y);
	const key = teachable.apTypeKey();
	if (!key) {
		return;
	}
	const badgeX = x + this.gaugeWidth() - 350;
	this.drawTypedBadge(key, badgeX, y);
};

//#endregion
//#region src/plugins/apt/ext/typed/windows/Window_AptitudeAggregateDetails.js
/**
* Extends {@link #drawExtensionData}.<br/>
* Also draws a small typed badge (icon + label) when the source row is typed.
* @param {AptitudeSkillSourceProgress} sourceProgress - The per-source progress for this skill.
* @param {number} x - The row's x coordinate.
* @param {number} y - The row's y coordinate.
*/
J.APT.EXT.TYPED.Aliased.Window_AptitudeAggregateDetails.set("drawExtensionData", Window_AptitudeAggregateDetails.prototype.drawExtensionData);
Window_AptitudeAggregateDetails.prototype.drawExtensionData = function(sourceProgress, x, y) {
	J.APT.EXT.TYPED.Aliased.Window_AptitudeAggregateDetails.get("drawExtensionData").call(this, sourceProgress, x, y);
	const actor = this.actor();
	const sourceKey = sourceProgress.sourceKey();
	const skillId = sourceProgress.skillId();
	const source = ApManager.resolveSourceByKey(actor, sourceKey);
	const teachables = source.aptitudeTeachings;
	const found = teachables.find((teachable) => teachable.skillId === skillId);
	if (!found) {
		Diagnostics.warn("J-Aptitude-Typed", `could not find a teachable for skillId: ${skillId}`);
		return;
	}
	const key = found.apTypeKey();
	if (!key) {
		return;
	}
	const badgeX = x + this.gaugeWidth() - 350;
	this.drawTypedBadge(key, badgeX, y);
};

//#endregion
//#region src/plugins/apt/ext/typed/_metadata/pluginCommands.js
/**
* Plugin command for modifying typed AP for all actors.
*/
PluginManager.registerCommand(J.APT.EXT.TYPED.Metadata.name, "mod-ap-all", ({ points, domain, id }) => {
	$gameParty.members().forEach((actor) => ApManager.gainTypedAp(actor, parseInt(points), domain.toLowerCase(), parseInt(id), "plugin-command"));
});
/**
* Plugin command for modifying typed AP for a specific actor.
*/
PluginManager.registerCommand(J.APT.EXT.TYPED.Metadata.name, "mod-ap", ({ actorId, points, domain, id }) => {
	const actor = $gameActors.actor(parseInt(actorId));
	ApManager.gainTypedAp(actor, parseInt(points), domain.toLowerCase(), parseInt(id), "plugin-command");
});

//#endregion
//# sourceMappingURL=J-Aptitude-Typed.js.map