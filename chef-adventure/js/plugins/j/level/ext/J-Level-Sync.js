//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.1.0 LEVEL-SYNC] Content level sync for dungeons and trials.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-LevelMaster
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-LevelMaster
 * @orderAfter J-LEVEL-Flat
 * @help
 * ============================================================================
 * OVERVIEW
 * This extension adds content level sync for dungeons and trials. When active,
 * all party actors fight at a declared effective level for the duration of the
 * encapsulation. Real levels, EXP, and save data are never modified.
 *
 * Integrates with:
 * - J-Base; required foundation for all J plugins.
 * - J-LevelMaster; this extension hooks into getLevel() — required base.
 * - J-Level-Flat; EXP policy interaction controlled by the Sync Affects EXP
 *   parameter (default off — real level governs EXP rewards).
 * - J-Natural; parameter buff refresh is triggered on sync toggle when loaded.
 * - J-ABS; no core changes needed; getLevel() hook propagates automatically.
 * - J-HUD (Party/Target); sync indicator shown beside level text when active.
 *
 * ----------------------------------------------------------------------------
 * ACTIVATION
 * Content sync is activated in one of two ways:
 *
 * 1. PLUGIN COMMAND (recommended — session-scoped):
 *    Use "Set Content Sync" at a dungeon entrance event. The session persists
 *    across map transfers until "Clear Content Sync" is called explicitly.
 *    Session always takes priority over map notes.
 *
 * 2. MAP NOTE TAG (convenience — map-scoped):
 *    Add <levelSync:N> to a map's note field. Sync activates on map setup and
 *    clears automatically when leaving a map without the tag (provided no
 *    session is active). Map notes are ignored when a session is running.
 *
 * ----------------------------------------------------------------------------
 * TAG REFERENCE
 *
 *   <levelSync:N>
 *     Activate content sync at level N on this map (N must be > 0).
 *     Default mode is cap-only: overleveled actors clamp down to N,
 *     underleveled actors are unaffected.
 *
 *   <levelSyncUp>
 *     Paired with <levelSync:N>. Enables uplevel (exact sync) mode:
 *     all actors fight at exactly level N, including underleveled ones.
 *
 * Example map notes:
 *   <levelSync:50>                  <- cap-only at 50
 *
 *   <levelSync:50>
 *   <levelSyncUp>                   <- exact sync at 50
 *
 * ----------------------------------------------------------------------------
 * SYNC MODES
 *
 *   Cap-only (default):
 *     Real level 90 in a level-50 zone → fights as 50.
 *     Real level 30 in a level-50 zone → fights as 30 (unchanged).
 *
 *   Uplevel (exact sync, opt-in):
 *     Real level 90 in a level-50 zone → fights as 50.
 *     Real level 30 in a level-50 zone → fights as 50 (boosted).
 *
 * ----------------------------------------------------------------------------
 * WHAT SYNC AFFECTS
 *
 *   YES (uses effective/synced level):
 *     - getLevel() / actor.level / actor.lvl while encapsulated
 *     - Class paramBase curve (already reads getLevel())
 *     - LevelScaling combat and reward multipliers
 *     - Formula evaluation using a.level
 *     - HUD level display (with sync icon)
 *     - J-APT level-difference gate (actor side)
 *
 *   NO (explicitly unchanged):
 *     - Saved _level and EXP (never mutated)
 *     - Equipment flat stats (paramPlus)
 *     - Learned skill list
 *     - Permanent J-Natural growth from real level-ups
 *     - SDP panel investment
 *     - EXP rewards (by default — see Sync Affects EXP parameter)
 *
 * ----------------------------------------------------------------------------
 * EXP BEHAVIOR
 *
 *   By default (Sync Affects EXP = false), EXP rewards use the actor's real
 *   level. This preserves J-Level-Flat's "too high = no EXP" design: a
 *   real level-90 actor synced to 50 still earns zero EXP from level-50
 *   enemies because the EXP calculation sees level 90, not 50.
 *
 *   Set Sync Affects EXP = true to use effective level for EXP. Actors synced
 *   down to 50 would then earn EXP as if they are level 50.
 *
 * ----------------------------------------------------------------------------
 * SESSION PRIORITY
 *
 *   An active session (set by plugin command) is never overridden or cancelled
 *   by a map note — even if the map has no sync tag, or has a different level.
 *   Only the "Clear Content Sync" plugin command ends a session.
 *
 *   Typical pattern for a multi-map dungeon:
 *     - Entrance NPC event: call "Set Content Sync" (level=50, uplevel=false)
 *     - Exit crystal event: call "Clear Content Sync"
 *     - Inner maps do not need any tags
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Routed the _levelSync namespace into its own save section, so an active
 *    sync session lands in systems/level-sync.json rather than in the system
 *    blob.
 *    Moved the _levelSync namespace seeding from the initialize aliases to
 *    initMembers, so a decoded save can establish it without a constructor.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @command setContentSync
 * @text Set Content Sync
 * @desc Activates content level sync at the specified level for all party members.
 *
 * @arg level
 * @type number
 * @min 1
 * @text Sync Level
 * @desc The level all party actors will fight at (or be capped to).
 * @default 50
 *
 * @arg uplevel
 * @type boolean
 * @text Uplevel
 * @desc If true, underleveled actors are boosted to the sync level (exact sync). Default false = cap-only.
 * @default false
 *
 * @command clearContentSync
 * @text Clear Content Sync
 * @desc Deactivates the active content sync session and restores real effective levels.
 *
 * ============================================================================
 *
 * @param sync-indicator-icon
 * @type number
 * @text Sync Indicator Icon
 * @desc Icon index shown beside level text while content sync is active. Set to 0 to suppress the icon.
 * @default 75
 *
 * @param sync-affects-exp
 * @type boolean
 * @text Sync Affects EXP
 * @desc If true, EXP rewards use the synced level. If false (default), real level governs EXP — preserving J-Level-Flat's design.
 * @default false
 *
 */
//endregion annotations


//#region src/plugins/level/ext/sync/_metadata/_pluginMetadata.js
var JLevelSync_PluginMetadata = class extends PluginMetadata {
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
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The icon index rendered beside level text while content sync is active.
		* Set to 0 to suppress the icon entirely.
		* @type {number}
		*/
		this.syncIndicatorIconIndex = Number(this.parsedPluginParameters["sync-indicator-icon"]) || 75;
		/**
		* Whether the synced (effective) level is used when calculating EXP rewards.
		* When false (default), real _level is used, preserving J-Level-Flat's
		* level-difference EXP policy.
		* @type {boolean}
		*/
		this.syncAffectsExp = this.parsedPluginParameters["sync-affects-exp"] === "true";
	}
};

//#endregion
//#region src/plugins/level/ext/sync/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The parent namespace must exist when this ext loads after J-LevelMaster.
*/
J.LEVEL ||= {};
J.LEVEL.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.LEVEL.EXT.SYNC = {};
/**
* The metadata associated with this plugin.
*/
J.LEVEL.EXT.SYNC.Metadata = new JLevelSync_PluginMetadata("J-Level-Sync", "1.1.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.LEVEL.EXT.SYNC.Aliased = {};
J.LEVEL.EXT.SYNC.Aliased.Game_Actor = new Map();
J.LEVEL.EXT.SYNC.Aliased.Game_Map = new Map();
J.LEVEL.EXT.SYNC.Aliased.Game_System = new Map();
J.LEVEL.EXT.SYNC.Aliased.JABS_Engine = new Map();
J.LEVEL.EXT.SYNC.Aliased.Sprite_ActorValue = new Map();
J.LEVEL.EXT.SYNC.Aliased.Window_StatusBase = new Map();
J.LEVEL.EXT.SYNC.Aliased.Window_TargetFrame = new Map();
/**
* All regular expressions used by this plugin.
*/
J.LEVEL.EXT.SYNC.RegExp = {
	/**
	* Matches a map note declaring a content sync level.
	*
	* <pre>
	* Structure:
	*   <levelSync:N>
	*
	* Example:
	*   <levelSync:50>
	*
	* Translation:
	*   Content sync level: 50 (N must be a positive integer greater than 0)
	* </pre>
	* @type {RegExp}
	*/
	ContentSyncLevel: /<levelSync:[ ]?(\d+)>/i,
	/**
	* Matches a map note opting into uplevel (exact sync) mode.
	*
	* <pre>
	* Structure:
	*   <levelSyncUp>
	*
	* Example:
	*   <levelSyncUp>
	*
	* Translation:
	*   Underleveled actors are boosted to the sync level as well.
	* </pre>
	* @type {RegExp}
	*/
	ContentSyncUplevel: /<levelSyncUp>/i
};

//#endregion
//#region src/plugins/level/ext/sync/objects/Game_System.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes content sync session storage for this plugin.
*/
J.LEVEL.EXT.SYNC.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.LEVEL.EXT.SYNC.Aliased.Game_System.get("initMembers").call(this);
	/**
	* The overarching _j object, where all my stateful plugin data is stored.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with this plugin.
	*/
	this._j._levelSync ||= {};
	/**
	* The active content sync session, or null when no sync is running.
	* @type {{ level: number, uplevel: boolean }|null}
	*/
	this._j._levelSync._contentSyncSession = null;
};
/**
* Seeds the content sync session slot when it is absent, leaving any loaded session intact.
*
* Saves written before this plugin existed have no slot at all; this fills it without disturbing
* a session that was already restored.
*/
Game_System.prototype.initContentSyncSessionIfAbsent = function() {
	this._j._levelSync._contentSyncSession ??= null;
};
/**
* Gets the active content sync session.
* @returns {{ level: number, uplevel: boolean }|null}
*/
Game_System.prototype.getContentSyncSession = function() {
	return this._j._levelSync._contentSyncSession;
};
/**
* Sets the active content sync session to the given level and uplevel flag.
* @param {number} level The sync level all actors will be clamped or boosted to.
* @param {boolean} uplevel Whether underleveled actors are boosted to the sync level.
*/
Game_System.prototype.setContentSyncSession = function(level, uplevel) {
	this._j._levelSync._contentSyncSession = {
		level,
		uplevel
	};
};
/**
* Clears the active content sync session, restoring real effective levels.
*/
Game_System.prototype.clearContentSyncSession = function() {
	this._j._levelSync._contentSyncSession = null;
};
/**
* Gets whether a content sync session is currently active.
* @returns {boolean}
*/
Game_System.prototype.hasContentSyncSession = function() {
	return this.getContentSyncSession() !== null;
};
/**
* Extends {@link #onAfterLoad}.<br/>
* Re-applies party refresh after loading a save so stats and HUD reflect
* any session that was active when the save was made.
*/
J.LEVEL.EXT.SYNC.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.LEVEL.EXT.SYNC.Aliased.Game_System.get("onAfterLoad").call(this);
	this._j._levelSync ||= {};
	this.initContentSyncSessionIfAbsent();
	$gameParty.members().forEach((actor) => {
		if (J.NATURAL) actor.refreshAllParameterBuffs();
		actor.onBattlerDataChange();
	});
};

//#endregion
//#region src/plugins/level/ext/sync/objects/Game_Map.js
/**
* Extends {@link #initMembers}.<br/>
* Initializes the level sync state so accessors are safe before the first map setup.
*/
J.LEVEL.EXT.SYNC.Aliased.Game_Map.set("initMembers", Game_Map.prototype.initMembers);
Game_Map.prototype.initMembers = function() {
	J.LEVEL.EXT.SYNC.Aliased.Game_Map.get("initMembers").call(this);
	this.initLevelSyncMembers();
};
/**
* Initializes all level sync members to their defaults.
*/
Game_Map.prototype.initLevelSyncMembers = function() {
	/**
	* The overarching _j object, where all my stateful plugin data is stored.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with this plugin.
	*/
	this._j._levelSync ||= {};
	/**
	* The content sync level parsed from the map note, or null if not present.
	* @type {number|null}
	*/
	this._j._levelSync._contentSyncLevel = null;
	/**
	* Whether the map note opts into uplevel (exact sync) mode.
	* @type {boolean}
	*/
	this._j._levelSync._contentSyncUplevel = false;
};
/**
* Extends {@link #setup}.<br/>
* Also parses content sync tags from the map note and refreshes the party
* when a map-note-driven sync is detected and no session is active.
*/
J.LEVEL.EXT.SYNC.Aliased.Game_Map.set("setup", Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId) {
	J.LEVEL.EXT.SYNC.Aliased.Game_Map.get("setup").call(this, mapId);
	this.initLevelSyncMembers();
	this.parseMapContentSyncTags();
	if ($gameSystem.hasContentSyncSession() === false) {
		$gameParty.members().forEach((actor) => {
			if (J.NATURAL) actor.refreshAllParameterBuffs();
			actor.onBattlerDataChange();
		});
	}
};
/**
* Parses the map note for content sync level and uplevel tags.
*/
Game_Map.prototype.parseMapContentSyncTags = function() {
	const syncLevel = RPGManager.getNumberFromNoteByRegex($dataMap, J.LEVEL.EXT.SYNC.RegExp.ContentSyncLevel);
	this.setContentSyncLevel(syncLevel > 0 ? syncLevel : null);
	const uplevel = RPGManager.checkForBooleanFromNoteByRegex($dataMap, J.LEVEL.EXT.SYNC.RegExp.ContentSyncUplevel);
	this.setContentSyncUplevel(uplevel === true);
};
/**
* Gets the content sync level declared in this map's note, or null if absent.
* @returns {number|null}
*/
Game_Map.prototype.getMapContentSyncLevel = function() {
	return this.contentSyncLevel();
};
/**
* Gets whether this map's note opts into uplevel (exact sync) mode.
* @returns {boolean}
*/
Game_Map.prototype.isMapContentSyncUplevel = function() {
	return this.contentSyncUplevel();
};
/**
* Gets the content sync level.
* @returns {number} The contentSyncLevel.
*/
Game_Map.prototype.contentSyncLevel = function() {
	return this._j._levelSync._contentSyncLevel;
};
/**
* Sets the content sync level.
* @param {number} newContentSyncLevel The new contentSyncLevel.
*/
Game_Map.prototype.setContentSyncLevel = function(newContentSyncLevel) {
	this._j._levelSync._contentSyncLevel = newContentSyncLevel;
};
/**
* Gets the content sync uplevel.
* @returns {boolean} The contentSyncUplevel.
*/
Game_Map.prototype.contentSyncUplevel = function() {
	return this._j._levelSync._contentSyncUplevel;
};
/**
* Sets the content sync uplevel.
* @param {boolean} newContentSyncUplevel The new contentSyncUplevel.
*/
Game_Map.prototype.setContentSyncUplevel = function(newContentSyncUplevel) {
	this._j._levelSync._contentSyncUplevel = newContentSyncUplevel;
};

//#endregion
//#region src/plugins/level/ext/sync/objects/Game_Actor.js
/**
* Extends {@link #getLevel}.<br/>
* Applies the content sync overlay after the normal computation. The sync
* is a final clamp or replace on the result, leaving the re-entrancy guard
* and base computation in Game_Battler.getLevel() untouched.
*/
J.LEVEL.EXT.SYNC.Aliased.Game_Actor.set("getLevel", Game_Actor.prototype.getLevel);
Game_Actor.prototype.getLevel = function() {
	const computedLevel = J.LEVEL.EXT.SYNC.Aliased.Game_Actor.get("getLevel").call(this);
	const syncLevel = this.resolveContentSyncLevel();
	if (syncLevel === null) return computedLevel;
	const uplevel = this.isContentSyncUplevel();
	if (uplevel === false) return Math.min(computedLevel, syncLevel);
	return syncLevel;
};
/**
* Resolves the active content sync level from session or map note.
* Session always takes priority over map note.
* @returns {number|null} The active sync level, or null if no sync is active.
*/
Game_Actor.prototype.resolveContentSyncLevel = function() {
	if ($gameSystem.hasContentSyncSession() === true) {
		return $gameSystem.getContentSyncSession().level;
	}
	const mapSyncLevel = $gameMap.getMapContentSyncLevel();
	return mapSyncLevel;
};
/**
* Gets whether the active content sync uses uplevel (exact) mode.
* @returns {boolean}
*/
Game_Actor.prototype.isContentSyncUplevel = function() {
	if ($gameSystem.hasContentSyncSession() === true) {
		return $gameSystem.getContentSyncSession().uplevel;
	}
	return $gameMap.isMapContentSyncUplevel();
};
/**
* Gets whether this actor is currently under a content sync encapsulation.
* @returns {boolean}
*/
Game_Actor.prototype.isContentSynced = function() {
	return this.resolveContentSyncLevel() !== null;
};
/**
* Gets the level to use for EXP reward calculations.
* When Sync Affects EXP is false (default), returns the real _level so that
* J-Level-Flat's level-difference EXP policy is not affected by the sync overlay.
* @returns {number}
*/
Game_Actor.prototype.getLevelForExp = function() {
	if (J.LEVEL.EXT.SYNC.Metadata.syncAffectsExp === false) {
		return this.getBattlerBaseLevel();
	}
	return this.getLevel();
};

//#endregion
//#region src/plugins/level/ext/sync/managers/JABS_Engine.js
if (J.ABS && J.LEVEL && J.LEVEL.EXT.FLAT) {
	/**
	* Extends {@link #determineExperienceGained}.<br/>
	* Routes the actor's level through getLevelForExp() so the Sync Affects EXP
	* parameter can gate whether the sync overlay influences EXP rewards.
	* @param {Game_Enemy} defeatedEnemy The enemy that was defeated.
	* @param {Game_Actor} victoriousActor The actor that defeated the enemy.
	* @returns {number}
	*/
	J.LEVEL.EXT.SYNC.Aliased.JABS_Engine.set("determineExperienceGained", JABS_Engine.prototype.determineExperienceGained);
	JABS_Engine.prototype.determineExperienceGained = function(defeatedEnemy, victoriousActor) {
		const actorProxy = Object.create(victoriousActor);
		Object.defineProperty(actorProxy, "level", {
			get() {
				return victoriousActor.getLevelForExp();
			},
			configurable: true
		});
		return J.LEVEL.EXT.SYNC.Aliased.JABS_Engine.get("determineExperienceGained").call(this, defeatedEnemy, actorProxy);
	};
}

//#endregion
//#region src/plugins/level/ext/sync/_metadata/pluginCommands.js
/**
* Plugin command for activating content level sync at a specified level.
*/
PluginManager.registerCommand(J.LEVEL.EXT.SYNC.Metadata.name, "setContentSync", (args) => {
	const level = parseInt(args.level);
	const uplevel = args.uplevel === "true";
	$gameSystem.setContentSyncSession(level, uplevel);
	$gameParty.members().forEach((actor) => {
		if (J.NATURAL) actor.refreshAllParameterBuffs();
		actor.onBattlerDataChange();
	});
});
/**
* Plugin command for deactivating the active content sync session.
*/
PluginManager.registerCommand(J.LEVEL.EXT.SYNC.Metadata.name, "clearContentSync", () => {
	$gameSystem.clearContentSyncSession();
	$gameParty.members().forEach((actor) => {
		if (J.NATURAL) actor.refreshAllParameterBuffs();
		actor.onBattlerDataChange();
	});
});

//#endregion
//#region src/plugins/level/ext/sync/windows/Window_StatusBase.js
/**
* Extends {@link #drawActorLevel}.<br/>
* When the actor is content-synced, colorizes the level label, prepends the
* sync indicator icon, and appends the real level in parentheses so the player
* can see both the effective and actual level in any window that calls this.
* @param {Game_Actor} actor The actor whose level is being drawn.
* @param {number} x The x coordinate.
* @param {number} y The y coordinate.
*/
J.LEVEL.EXT.SYNC.Aliased.Window_StatusBase.set("drawActorLevel", Window_StatusBase.prototype.drawActorLevel);
Window_StatusBase.prototype.drawActorLevel = function(actor, x, y) {
	if (actor.isContentSynced() === false) {
		J.LEVEL.EXT.SYNC.Aliased.Window_StatusBase.get("drawActorLevel").call(this, actor, x, y);
		return;
	}
	const iconIndex = J.LEVEL.EXT.SYNC.Metadata.syncIndicatorIconIndex;
	const iconPrefix = iconIndex > 0 ? `\\I[${iconIndex}]` : "";
	this.drawTextEx(`\\C[6]${TextManager.levelA}\\C[0]`, x, y, 48);
	const syncedLevel = actor.getLevel().padZero(3);
	const realLevel = actor._level.padZero(3);
	const levelText = `\\C[6]${iconPrefix}${syncedLevel}\\C[0] (${realLevel})`;
	this.drawTextEx(levelText, x + 48, y, 120);
};

//#endregion
//#region src/plugins/level/ext/sync/windows/Window_TargetFrame.js
if (J.HUD && J.HUD.EXT && J.HUD.EXT.TARGET) {
	/**
	* Extends {@link #drawTargetLevel}.<br/>
	* Colorizes the level text and prepends the sync icon when the target is a
	* content-synced actor.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	J.LEVEL.EXT.SYNC.Aliased.Window_TargetFrame.set("drawTargetLevel", Window_TargetFrame.prototype.drawTargetLevel);
	Window_TargetFrame.prototype.drawTargetLevel = function(x, y) {
		if (!this.canDrawTargetLevel()) return;
		const { _battler: battler } = this._j;
		if (!battler.level) return;
		const isSynced = battler.isActor() && battler.isContentSynced();
		const iconIndex = J.LEVEL.EXT.SYNC.Metadata.syncIndicatorIconIndex;
		const colorCode = isSynced ? "\\C[6]" : "";
		const iconPrefix = isSynced && iconIndex > 0 ? `\\I[${iconIndex}]` : "";
		const levelString = `\\FS[14]${colorCode}${iconPrefix}Lv.${battler.level.padZero(3)}`;
		this.drawTextEx(levelString, x, y, this.targetFrameLevelColumnWidth());
	};
}

//#endregion
//#region src/plugins/level/ext/sync/sprites/Sprite_ActorValue.js
if (J.HUD && J.HUD.EXT && J.HUD.EXT.PARTY) {
	/**
	* Extends {@link #update}.<br/>
	* Each tick, lazily initializes the sync indicator sprite and shows or hides
	* it depending on whether the tracked actor is currently content-synced.
	*/
	J.LEVEL.EXT.SYNC.Aliased.Sprite_ActorValue.set("update", Sprite_ActorValue.prototype.update);
	Sprite_ActorValue.prototype.update = function() {
		J.LEVEL.EXT.SYNC.Aliased.Sprite_ActorValue.get("update").call(this);
		if (this.getParameter() !== Window_PartyFrame.gaugeTypes.Level) return;
		this.getOrCreateSyncIcon();
		if (this.getActor().isContentSynced()) {
			this.syncIconSprite().show();
		} else {
			this.syncIconSprite().hide();
		}
	};
	/**
	* Gets or lazily creates the sync indicator icon child sprite.
	* @returns {Sprite_Icon}
	*/
	Sprite_ActorValue.prototype.getOrCreateSyncIcon = function() {
		if (this.syncIconSprite()) return this.syncIconSprite();
		const iconIndex = J.LEVEL.EXT.SYNC.Metadata.syncIndicatorIconIndex;
		const sprite = new Sprite_Icon(iconIndex);
		sprite.selfManageOpacity();
		sprite.hide();
		this.setSyncIconSprite(sprite);
		sprite.x = -ImageManager.iconWidth;
		this.addChild(sprite);
		return sprite;
	};
	/**
	* Extends {@link #updateBitmapByParameter}.<br/>
	* When the tracked actor is content-synced and we are drawing the level
	* parameter, applies a blue-tinted outline to signal the value is not real.
	* @param {Bitmap} bitmap The bitmap to mutate.
	* @returns {Bitmap}
	*/
	J.LEVEL.EXT.SYNC.Aliased.Sprite_ActorValue.set("updateBitmapByParameter", Sprite_ActorValue.prototype.updateBitmapByParameter);
	Sprite_ActorValue.prototype.updateBitmapByParameter = function(bitmap) {
		const updatedBitmap = J.LEVEL.EXT.SYNC.Aliased.Sprite_ActorValue.get("updateBitmapByParameter").call(this, bitmap);
		if (this.getParameter() === Window_PartyFrame.gaugeTypes.Level && this.getActor().isContentSynced()) {
			updatedBitmap.outlineColor = "rgba(64, 128, 192, 1.0)";
		}
		return updatedBitmap;
	};
	/**
	* Extends {@link #getActorValue}.<br/>
	* When the tracked actor is content-synced and we are drawing the level
	* parameter, returns a formatted string showing both the synced level and
	* the actor's real level: e.g. {@code 050 (101)}.
	* @returns {string|number}
	*/
	J.LEVEL.EXT.SYNC.Aliased.Sprite_ActorValue.set("getActorValue", Sprite_ActorValue.prototype.getActorValue);
	Sprite_ActorValue.prototype.getActorValue = function() {
		const baseValue = J.LEVEL.EXT.SYNC.Aliased.Sprite_ActorValue.get("getActorValue").call(this);
		if (this.getParameter() !== Window_PartyFrame.gaugeTypes.Level) return baseValue;
		const actor = this.getActor();
		if (actor.isContentSynced() === false) return baseValue;
		const syncedLevel = actor.getLevel().padZero(3);
		const realLevel = actor._level.padZero(3);
		return `${syncedLevel} (${realLevel})`;
	};
}
/**
* Gets the sync icon sprite.
* @returns {Sprite} The syncIconSprite.
*/
Sprite_ActorValue.prototype.syncIconSprite = function() {
	return this._j._syncIconSprite;
};
/**
* Sets the sync icon sprite.
* @param {Sprite} newSyncIconSprite The new syncIconSprite.
*/
Sprite_ActorValue.prototype.setSyncIconSprite = function(newSyncIconSprite) {
	this._j._syncIconSprite = newSyncIconSprite;
};

//#endregion
//#region src/plugins/level/ext/sync/registerLevelSyncSaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-Level-Sync a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_levelSync", "level-sync");
}

//#endregion
//# sourceMappingURL=J-Level-Sync.js.map