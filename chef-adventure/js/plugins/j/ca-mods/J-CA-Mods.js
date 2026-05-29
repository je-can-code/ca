//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.0.0 CAMODS] JS Mods exclusive to Chef Adventure.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * ============================================================================
 * OVERVIEW
 * These modifications of code are modifications against various components of
 * the core scripts. Additionally, plugins I've written are also modified here
 * in a way that I consider "not-mainstream enough" to be published as a part
 * of the original plugins.
 *
 * NOTE ABOUT USING THIS "PLUGIN":
 * While I do list below the various changes that are provided by this plugin
 * modifier, I do not intend to support this as a public plugin, so you should
 * probably not use this plugin unless you want 100% of the functionality
 * listed below, or are able to tweak/adjust the code yourself.
 *
 * This is also NOT a versioned plugin, and can potentially change without
 * any notification.
 *
 * Use with caution!
 *
 * ============================================================================
 * SYSTEM CHANGES:
 * - variable assignment for tracking a wide variety of battle data points
 * - additional equip slot for all actors (as accessory)
 * - "recover all" recovers TP too
 * - prevent passage on tileset terrain id 1
 * - random variable assignment for "rare/named enemies" on map transfer
 * - removal of touch buttons from base/map/menu scenes
 *
 * ----------------------------------------------------------------------------
 * CA-UNIQUE CHANGES:
 * - forces the previous leader to be in the second party slot after cycling.
 * - loot drop x,y adjustment unique to CA
 * - anti-null elementIds hard-coded
 * - mini floor-damage system built with tags (TODO: replace with plugin?)
 * - drop sources for enemies modified to include states and party drop sources
 *
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/__ca-mods/core/_metadata/_pluginMetadata.js
var J_CaModsPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name
	* @param {string} version
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/__ca-mods/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.CAMods = {};
/**
* The metadata associated with this plugin, such as name and version.
*/
J.CAMods.Metadata = new J_CaModsPluginMetadata("J-CA-Mods", "1.0.0");
/**
* The actual `plugin parameters` extracted from RMMZ.
*/
J.CAMods.PluginParameters = J.CAMods.Metadata.parsedPluginParameters;
/**
* A collection of data points being tracked for CA.
* Each of these data points represent a variableId to track data within.
*/
J.CAMods.Tracking = {};
J.CAMods.Tracking.EnemiesDefeated = 101;
J.CAMods.Tracking.DestructiblesDestroyed = 102;
J.CAMods.Tracking.TotalDamageDealt = 103;
J.CAMods.Tracking.HighestDamageDealt = 104;
J.CAMods.Tracking.NumberOfCritsDealt = 105;
J.CAMods.Tracking.BiggestCritDealt = 106;
J.CAMods.Tracking.NumberOfParries = 107;
J.CAMods.Tracking.NumberOfPreciseParries = 108;
J.CAMods.Tracking.TotalDamageTaken = 109;
J.CAMods.Tracking.HighestDamageTaken = 110;
J.CAMods.Tracking.NumberOfCritsTaken = 111;
J.CAMods.Tracking.BiggestCritTaken = 112;
J.CAMods.Tracking.MainhandSkillUsage = 113;
J.CAMods.Tracking.OffhandSkillUsage = 114;
J.CAMods.Tracking.AssignedSkillUsage = 115;
J.CAMods.Tracking.DodgeSkillUsage = 116;
J.CAMods.Tracking.NumberOfDeaths = 117;
/**
* A collection of all aliased methods for this plugin.
*/
J.CAMods.Aliased = {};
J.CAMods.Aliased.JABS_Battler = new Map();
J.CAMods.Aliased.JABS_Engine = new Map();
J.CAMods.Aliased.Game_Actor = new Map();
J.CAMods.Aliased.Game_BattlerBase = new Map();
J.CAMods.Aliased.Game_Enemy = new Map();
J.CAMods.Aliased.Game_Map = new Map();
J.CAMods.Aliased.Game_Party = new Map();
J.CAMods.Aliased.Scene_Boot = new Map();

//#endregion
//#region src/plugins/__ca-mods/core/_models/JABS_Battler.js
/**
* Extends {@link #getTargetFrameText}.<br/>
* If no text was provided for the target, instead autogenerate some text based on their traits.
* The "traits" are defined by arbitrary CA-specific elements, so this can't live in the
* target frame plugin, or the monsterpedia plugin.
* @returns {string}
*/
J.CAMods.Aliased.JABS_Battler.set("getTargetFrameText", JABS_Battler.prototype.getTargetFrameText);
JABS_Battler.prototype.getTargetFrameText = function() {
	const originalTargetFrameText = J.CAMods.Aliased.JABS_Battler.get("getTargetFrameText").call(this);
	if (originalTargetFrameText !== String.empty) return originalTargetFrameText;
	const battler = this.getBattler();
	const isArmed = battler.elementRate(21) > 1;
	const isFlying = battler.elementRate(22) > 1;
	const isShielded = battler.elementRate(23) > 1;
	const hasAura = battler.elementRate(24) > 1;
	const hasNoTraits = ![
		isArmed,
		isFlying,
		isShielded,
		hasAura
	].every((trait) => !!trait);
	if (hasNoTraits) return String.empty;
	const traits = [];
	if (isArmed) {
		traits.push("Weaponized");
	}
	if (isFlying) {
		traits.push("Flying");
	}
	if (isShielded) {
		traits.push("Shielded");
	}
	if (hasAura) {
		traits.push("Aural");
	}
	const text = traits.join(", ");
	return text;
};

//#endregion
//#region src/plugins/__ca-mods/core/objects/Game_Action.js
/**
* Implements {@link #getAntiNullElementIds}.<br/>
* In CA, these elementIds define tools, which should be considered regardless.
*/
Game_Action.prototype.getAntiNullElementIds = function() {
	return [
		25,
		26,
		27,
		28
	];
};

//#endregion
//#region src/plugins/__ca-mods/core/objects/Game_Actor.js
/**
* Extends {@link #equipSlots}.<br/>
* Adds a duplicate of the 5th type (accessory).
*/
J.CAMods.Aliased.Game_Actor.set("equipSlots", Game_Actor.prototype.equipSlots);
Game_Actor.prototype.equipSlots = function() {
	const baseSlots = J.CAMods.Aliased.Game_Actor.get("equipSlots").call(this);
	baseSlots.push(5);
	return baseSlots;
};
/**
* Overwrites {@link #performMapDamage}.<br/>
* Forces the map damage flash to always happen because JABS is always in-battle.
* Also shows an animation on the player when they take damage.
*/
Game_Actor.prototype.performMapDamage = function() {
	$gameScreen.startFlashForDamage();
	$gamePlayer.requestAnimation(59);
};
/**
* Extends {@link #basicFloorDamage}.<br/>
* Replaces logic if there is a $dataMap available with calculated damage instead.
*/
J.CAMods.Aliased.Game_Actor.set("basicFloorDamage", Game_Actor.prototype.basicFloorDamage);
Game_Actor.prototype.basicFloorDamage = function() {
	if (!$dataMap || !$dataMap.meta) {
		return J.CAMods.Aliased.Game_Actor.get("basicFloorDamage").call(this);
	} else {
		return this.calculateFloorDamage();
	}
};
/**
* Calculates the amount of damage received from stepping on damage floors.
* @returns {number}
*/
Game_Actor.prototype.calculateFloorDamage = function() {
	let damage = 0;
	const objectsToCheck = this.floorDamageSources();
	objectsToCheck.forEach((obj) => damage += this.extractFloorDamageRate(obj));
	return damage;
};
/**
* Extracts the damage this object yields for floor damage.
* @param {RPG_BaseItem} referenceData The database object to extract from.
* @returns {number}
*/
Game_Actor.prototype.extractFloorDamageRate = function(referenceData) {
	if (!referenceData.note) return 0;
	const flat = RPGManager.getNumbersFromNoteByRegex(referenceData, /<damageFlat: ?(\d+)>/i);
	const percents = RPGManager.getNumbersFromNoteByRegex(referenceData, /<damagePerc: ?(\d+)>/i);
	const percentDamage = percents.reduce((t, p) => t + p / 100 * this.mhp, 0);
	return flat.reduce((t, f) => t + f, 0) + percentDamage;
};
/**
* Gets all sources that can possibly yield damage by stepping.
* Open for extension.
* @returns {*[]}
*/
Game_Actor.prototype.floorDamageSources = function() {
	const sources = [];
	sources.push($dataMap);
	return sources;
};
/**
* Refreshes all auto-equippable skills available to this battler.
*/
Game_Actor.prototype.refreshAutoEquippedSkills = function() {
	const allSlots = this.getAllEquippedSkills();
	this.skills().forEach((skill) => {
		const skillId = skill.id;
		if (allSlots.some((slot) => slot.id === skillId)) return;
		this.jabsProcessLearnedSkill(skill.id);
	}, this);
};

//#endregion
//#region src/plugins/__ca-mods/core/objects/Game_BattlerBase.js
/**
* Extends {@link #recoverAll}.<br/>
* Using the event command for "Recover All" also restores all TP to the battler.
*/
J.CAMods.Aliased.Game_BattlerBase.set("recoverAll", Game_BattlerBase.prototype.recoverAll);
Game_BattlerBase.prototype.recoverAll = function() {
	J.CAMods.Aliased.Game_BattlerBase.get("recoverAll").call(this);
	this._tp = this.maxTp();
};

//#endregion
//#region src/plugins/__ca-mods/core/objects/Game_Enemy.js
/**
* Extends the drop sources to include passive skill states.
* This isn't a flavor everyone might like, so this is personal functionality instead.
* @returns {RPG_BaseItem[]}
*/
J.CAMods.Aliased.Game_Enemy.set("dropSources", Game_Enemy.prototype.dropSources);
Game_Enemy.prototype.dropSources = function() {
	const sources = J.CAMods.Aliased.Game_Enemy.get("dropSources").call(this);
	sources.push(...this.allStates());
	sources.push(...$gameParty.extraDropSources());
	return sources;
};

//#endregion
//#region src/plugins/__ca-mods/core/objects/Game_Map.js
/**
* Overwrites {@link #checkPassage}.<br/>
* Disables the ability to walk over tiles with the terrain ID of 1.
* In practice, this prevents battlers from getting knocked into otherwise
* unreachable locations, like what is supposed to be ceiling tiles.
* @param {number} x The `x` coordinate.
* @param {number} y The `y` coordinate.
* @param {number} bit The bitwise operator being checked.
* @returns {boolean} True if the tile can be walked on, false otherwise.
*/
Game_Map.prototype.checkPassage = function(x, y, bit) {
	const flags = this.tilesetFlags();
	const tiles = this.allTiles(x, y);
	for (const tile of tiles) {
		const flag = flags[tile];
		if ((flag & 16) !== 0) {
			continue;
		}
		if (flag >> 12 === 1) {
			return false;
		}
		if ((flag & bit) === 0) {
			return true;
		}
		if ((flag & bit) === bit) {
			return false;
		}
	}
	return false;
};
/**
* Extends {@link #setup}.<br/>
* Upon map initialization, assigns a random integer between 1-100 to an arbitrary variable.
* In CA, this value is used to determine the presence of "rare/named" monsters on the map.
*/
J.CAMods.Aliased.Game_Map.set("setup", Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId) {
	J.CAMods.Aliased.Game_Map.get("setup").call(this, mapId);
	$gameVariables.setValue(13, Math.randomInt(100) + 1);
};

//#endregion
//#region src/plugins/__ca-mods/core/objects/Game_Party.js
/**
* The actorIds that correlate with elemental actors in regards to Chef Adventure.
* @type {number[]}
*/
Game_Party.ELEMENTAL_ALLY_ACTOR_IDS = [
	3,
	4,
	5,
	6
];
/**
* Gets any additional sources to scan for drops when determining a drop item list on
* an enemy. In this case, we are including passive skill states to potentially add
* new items to every enemy.
* @returns {RPG_BaseItem[]}
*/
Game_Party.prototype.extraDropSources = function() {
	const extraSources = [];
	$gameParty.battleMembers().forEach((member) => extraSources.push(...member.allStates()));
	return extraSources;
};
/**
* Gets all current actors that are just the elemental variety.
* @returns {Game_Actor[]}
*/
Game_Party.prototype.elementalActors = function() {
	return $gameParty.battleMembers().filter((member) => Game_Party.ELEMENTAL_ALLY_ACTOR_IDS.contains(member.actorId()));
};
/**
* Gets all current JABS Battlers that are just the elemental variety.
* @returns {JABS_Battler[]}
*/
Game_Party.prototype.elementalJabsBattlers = function() {
	const filtering = (jabsBattler) => {
		const actorId = jabsBattler.getBattler().actorId();
		return Game_Party.ELEMENTAL_ALLY_ACTOR_IDS.includes(actorId);
	};
	return JABS_AiManager.getActorBattlers().filter(filtering, this);
};
/**
* Determine if the leader is the given actorId.
* @param {number} actorId The actor id to compare the leader's actor id with.
* @returns {boolean} True if the leader is the same actor as the designated id, false otherwise.
*/
Game_Party.prototype.isLeaderActor = function(actorId) {
	return this.leader().actorId() === actorId;
};

//#endregion
//#region src/plugins/__ca-mods/core/managers/JABS_Engine.js
/**
* Extends {@link #canGainReward}.<br/>
* Inanimate enemies (trees, shrubs, ore deposits, destructibles) do not grant any rewards in CA.
* Their levels are intentionally high to gate resource access — not to serve as experience farms.
* @param {Game_Enemy} defeatedEnemy The enemy that was defeated.
* @param {Game_Actor} victoriousActor The actor that defeated the enemy.
* @returns {boolean} False if the defeated enemy is inanimate, otherwise defers to the base check.
*/
J.CAMods.Aliased.JABS_Engine.set("canGainReward", JABS_Engine.prototype.canGainReward);
JABS_Engine.prototype.canGainReward = function(defeatedEnemy, victoriousActor) {
	if (defeatedEnemy.isInanimate() === true) {
		return false;
	}
	return J.CAMods.Aliased.JABS_Engine.get("canGainReward").call(this, defeatedEnemy, victoriousActor);
};
/**
* Fixes the weird problem where CA uniquely seems to want to move character sprites up
* by 1 when generating loot.
* @param {number} targetX The `x` coordiante where the loot will be dropped/placed.
* @param {number} targetY The `y` coordinate where the loot will be dropped/placed.
*/
J.CAMods.Aliased.JABS_Engine.set("addLootDropToMap", JABS_Engine.prototype.addLootDropToMap);
JABS_Engine.prototype.addLootDropToMap = function(targetX, targetY, item) {
	const modifiedTargetY = targetY + 1;
	return J.CAMods.Aliased.JABS_Engine.get("addLootDropToMap").call(this, targetX, modifiedTargetY, item);
};
/**
* Extends the handling of defeated enemies to track data.
* @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
* @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
*/
J.CAMods.Aliased.JABS_Engine.set("handleDefeatedEnemy", JABS_Engine.prototype.handleDefeatedEnemy);
JABS_Engine.prototype.handleDefeatedEnemy = function(defeatedTarget, caster) {
	J.CAMods.Aliased.JABS_Engine.get("handleDefeatedEnemy").call(this, defeatedTarget, caster);
	if (defeatedTarget.isInanimate()) {
		J.BASE.Helpers.modVariable(J.CAMods.Tracking.DestructiblesDestroyed, 1);
	} else {
		J.BASE.Helpers.modVariable(J.CAMods.Tracking.EnemiesDefeated, 1);
	}
};
/**
* Extends {@link #handleDefeatedPlayer}.<br/>
* Also tracks player defeated count.
*/
J.CAMods.Aliased.JABS_Engine.set("handleDefeatedPlayer", JABS_Engine.prototype.handleDefeatedPlayer);
JABS_Engine.prototype.handleDefeatedPlayer = function() {
	J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfDeaths, 1);
	J.CAMods.Aliased.JABS_Engine.get("handleDefeatedPlayer").call(this);
};
/**
* Extends {@link #postExecuteSkillEffects}.<br/>
* Also tracks our combat data in variables.
* @param {JABS_Action} action The action being executed.
* @param {JABS_Battler} target The target to apply skill effects against.
*/
J.CAMods.Aliased.JABS_Engine.set("postExecuteSkillEffects", JABS_Engine.prototype.postExecuteSkillEffects);
JABS_Engine.prototype.postExecuteSkillEffects = function(action, target) {
	J.CAMods.Aliased.JABS_Engine.get("postExecuteSkillEffects").call(this, action, target);
	if (action.getCooldownType() !== JABS_Button.Tool) {
		if (target.isEnemy()) {
			this.trackAttackData(target);
		} else if (target.isActor()) {
			this.trackDefensiveData(target);
		}
	}
};
/**
* Tracks various attack-related data points and assigns them to variables.
* @param {JABS_Battler} target The target to analyze.
*/
JABS_Engine.prototype.trackAttackData = function(target) {
	const { hpDamage, critical } = target.getBattler().result();
	if (hpDamage > 0) {
		J.BASE.Helpers.modVariable(J.CAMods.Tracking.TotalDamageDealt, hpDamage);
		const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageDealt);
		if (hpDamage > highestDamage) {
			$gameVariables.setValue(J.CAMods.Tracking.HighestDamageDealt, hpDamage);
		}
		if (critical) {
			J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsDealt, 1);
			const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritDealt);
			if (hpDamage > biggestCrit) {
				$gameVariables.setValue(J.CAMods.Tracking.BiggestCritDealt, hpDamage);
			}
		}
	}
};
/**
* Tracks various defensive-related data points and assigns them to variables.
* @param {JABS_Battler} target The target to analyze.
*/
JABS_Engine.prototype.trackDefensiveData = function(target) {
	const { hpDamage, critical, parried, preciseParried } = target.getBattler().result();
	if (hpDamage) {
		J.BASE.Helpers.modVariable(J.CAMods.Tracking.TotalDamageTaken, hpDamage);
		const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageTaken);
		if (hpDamage > highestDamage) {
			$gameVariables.setValue(J.CAMods.Tracking.HighestDamageTaken, hpDamage);
		}
		if (critical) {
			J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsTaken, 1);
			const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritTaken);
			if (hpDamage > biggestCrit) {
				$gameVariables.setValue(J.CAMods.Tracking.BiggestCritTaken, hpDamage);
			}
		}
	} else if (parried) {
		J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfParries, 1);
		if (preciseParried) {
			J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfPreciseParries, 1);
		}
	}
};
/**
* Extends {@link #executeMapAction}.<br/>
* Also tracks action execution data.
* @param {JABS_Battler} caster The battler executing the action.
* @param {JABS_Action} action The action being executed.
* @param {number?} targetX The target's `x` coordinate, if applicable.
* @param {number?} targetY The target's `y` coordinate, if applicable.
*/
J.CAMods.Aliased.JABS_Engine.set("executeMapAction", JABS_Engine.prototype.executeMapAction);
JABS_Engine.prototype.executeMapAction = function(caster, action, targetX, targetY) {
	J.CAMods.Aliased.JABS_Engine.get("executeMapAction").call(this, caster, action, targetX, targetY);
	if (caster.isPlayer()) {
		this.trackActionData(action);
	}
};
/**
* Tracks mainhand/offhand/skill usage data points and assigns them to variables.
* @param {JABS_Action} action
*/
JABS_Engine.prototype.trackActionData = function(action) {
	const cooldownType = action.getCooldownType();
	switch (cooldownType) {
		case JABS_Button.Mainhand:
			J.BASE.Helpers.modVariable(J.CAMods.Tracking.MainhandSkillUsage, 1);
			break;
		case JABS_Button.Offhand:
			J.BASE.Helpers.modVariable(J.CAMods.Tracking.OffhandSkillUsage, 1);
			break;
		default:
			J.BASE.Helpers.modVariable(J.CAMods.Tracking.AssignedSkillUsage, 1);
			break;
	}
};
J.CAMods.Aliased.JABS_Engine.set("handlePartyCycleMemberChanges", JABS_Engine.prototype.handlePartyCycleMemberChanges);
JABS_Engine.prototype.handlePartyCycleMemberChanges = function() {
	const originalLeaderActorId = $gameParty._actors.at(0);
	J.CAMods.Aliased.JABS_Engine.get("handlePartyCycleMemberChanges").call(this);
	const newIndexOfPreviousLeader = $gameParty._actors.findIndex((actorId) => actorId === originalLeaderActorId);
	$gameParty._actors.splice(newIndexOfPreviousLeader, 1);
	$gameParty._actors.splice(1, 0, originalLeaderActorId);
	$gamePlayer.refresh();
	this.refreshPlayer1Data();
};

//#endregion
//#region src/plugins/__ca-mods/core/scenes/Scene_Base.js
/**
* Overwrites {@link #buttonAreaHeight}.<br/>
* Sets the button height to 0- they are not used in CA.
* @returns {number}
*/
Scene_Base.prototype.buttonAreaHeight = function() {
	return 0;
};
/**
* Overwrites {@link #createButtons}.<br/>
* Removes logic for button creation- they are not used in CA.
*/
Scene_Base.prototype.createButtons = function() {};

//#endregion
//#region src/plugins/__ca-mods/core/scenes/Scene_Map.js
/**
* Overwrites {@link #createButtons}.<br/>
* Removes logic for button creation- they are not used in CA.
*/
Scene_Map.prototype.createButtons = function() {};

//#endregion
//#region src/plugins/__ca-mods/core/scenes/Scene_MenuBase.js
/**
* Overwrites {@link #createButtons}.<br/>
* Removes logic for button creation- those are not allowed here.
*/
Scene_MenuBase.prototype.createButtons = function() {};

//#endregion
//# sourceMappingURL=J-CA-Mods.js.map