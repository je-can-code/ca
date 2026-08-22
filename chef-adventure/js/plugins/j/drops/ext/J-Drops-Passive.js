//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 DROPS-PASSIVE] Lets states contribute extra drops to every enemy.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-DropsControl
 * @orderAfter J-Base
 * @orderAfter J-DropsControl
 * @help
 * ============================================================================
 * OVERVIEW
 * J-DropsControl reads the `<drops:[...]>` tag off the enemy being defeated and
 * nothing else. This extension widens that search to include states: the ones
 * riding the defeated enemy, and the ones riding the party that killed it.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-DropsControl; this is an extension of that plugin's drop sources.
 * - J-Passive; passive skill states are the intended vehicle for this.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * A state is a convenient place to hang a drop because it can arrive from a
 * dozen directions- a passive skill, a piece of equipment, a buff someone cast,
 * a story flag applied at a cutscene- and every one of those ends up asking the
 * same question of the same tag. Rather than teach each of those systems to
 * publish drops, this teaches drops to read states.
 *
 * WHY THIS IS AN EXTENSION AND NOT THE DEFAULT:
 * "Everything the party is currently buffed by can change what an enemy drops"
 * is a strong flavor. It makes loot tables depend on party composition, which
 * is either the entire point of your build system or an unpleasant surprise
 * that makes your drop rates impossible to reason about. Loading this plugin is
 * how you opt into the first reading.
 *
 * ============================================================================
 * ENEMY STATES AS DROP SOURCES:
 * Every state currently applied to the defeated enemy is scanned for the same
 * `<drops:[...]>` tag J-DropsControl already reads from the enemy itself.
 *
 * This is what makes "burning enemies drop charcoal" or "an enemy afflicted
 * with a treasure-marking state drops an extra item" possible without editing
 * a single enemy in the database.
 *
 * ============================================================================
 * PARTY STATES AS DROP SOURCES:
 * Every state currently applied to any active battle member is also scanned,
 * against every enemy that dies.
 *
 * This is the "lucky charm" pattern: a passive skill state that adds an item to
 * the global drop pool for as long as somebody in the active party has it.
 * Reserve members do not count- only who is actually fighting.
 *
 * ============================================================================
 * TAG USAGE:
 * - States
 *
 * TAG FORMAT:
 *  <drops:[TYPE,ID,CHANCE]>
 *    Where TYPE is one of: i, item, w, weapon, a, armor.
 *    Where ID is the id of the item/weapon/armor in the database.
 *    Where CHANCE is the percent chance of this dropping.
 *
 * This is J-DropsControl's own tag, unchanged- see that plugin's help for the
 * full description. All this plugin changes is where it gets read from.
 *
 * TAG EXAMPLES:
 *  <drops:[i,3,25]>
 * While this state is applied, there is a 25% chance of also dropping item 3.
 *
 *  <drops:[a,7,100]>
 * While this state is applied, armor 7 always additionally drops.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/drops/ext/passive/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-Drops-Passive.
*
* This plugin has nothing to configure: what it does is add two more places to look for the
* `<drops:[...]>` tag, and which states are on a battler is already the game's own answer.
*/
var JDropsPassive_PluginMetadata = class extends PluginMetadata {
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
//#region src/plugins/drops/ext/passive/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.DROPS.EXT.PASSIVE = {};
/**
* The metadata associated with this plugin.
*/
J.DROPS.EXT.PASSIVE.Metadata = new JDropsPassive_PluginMetadata("J-Drops-Passive", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.DROPS.EXT.PASSIVE.Aliased = {};
J.DROPS.EXT.PASSIVE.Aliased.Game_Enemy = new Map();

//#endregion
//#region src/plugins/drops/ext/passive/objects/Game_Enemy.js
/**
* Extends {@link #dropSources}.<br/>
* Also considers the states applied to this enemy, and the states applied to the party that is
* fighting it, as places a `<drops:[...]>` tag can live.
* @returns {RPG_BaseItem[]}
*/
J.DROPS.EXT.PASSIVE.Aliased.Game_Enemy.set("dropSources", Game_Enemy.prototype.dropSources);
Game_Enemy.prototype.dropSources = function() {
	const sources = J.DROPS.EXT.PASSIVE.Aliased.Game_Enemy.get("dropSources").call(this);
	sources.push(...this.allStates());
	sources.push(...$gameParty.extraDropSources());
	return sources;
};

//#endregion
//#region src/plugins/drops/ext/passive/objects/Game_Party.js
/**
* Gets the additional sources the party contributes when an enemy is working out its drop list.
*
* Only active battle members count. Loot that follows a character sitting in reserve would be
* invisible to the player- there is nothing on screen to attribute the extra item to- and it would
* make the drop pool depend on the entire roster rather than on the party the player assembled.
* @returns {RPG_BaseItem[]}
*/
Game_Party.prototype.extraDropSources = function() {
	const extraSources = [];
	$gameParty.battleMembers().forEach((member) => extraSources.push(...member.allStates()));
	return extraSources;
};

//#endregion
//# sourceMappingURL=J-Drops-Passive.js.map