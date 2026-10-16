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
 * Please refer to J-Drops-Passive's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/drops/ext/passive/index.md
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