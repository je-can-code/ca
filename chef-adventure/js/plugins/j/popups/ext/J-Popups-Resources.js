//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 POPUPS-RESOURCES] Skill cost and resource gain popups.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Popups
 * @base J-Resources
 * @orderAfter J-Base
 * @orderAfter J-Popups
 * @orderAfter J-Resources
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin adds visual popup feedback for the HP, MP, and TP costs and
 * gains introduced by J-Resources.
 *
 * Have you ever wanted to see a popup fly off your character when a skill
 * drains their HP, or when a hit-based gain restores their MP mid-combat?
 * Well now you can! Any time a J-Resources cost is paid or a gain is applied,
 * a text popup will appear over that battler's character on the map.
 *
 * Integrates with others of mine plugins:
 * - J-Resources-ABS; on-attack and when-hit gains are covered automatically.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * - HP cost popups appear in red tones.
 * - MP cost popups appear in blue tones.
 * - TP cost popups appear in yellow/green tones.
 * - Gain popups use the corresponding healing color tones.
 *
 * NOTE:
 * If J-Resources-ABS is also loaded, the on-attack and when-hit gains from
 * that plugin go through the same Game_Battler hooks and get popups for free.
 *
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Cost and on-map resource gain popups route through strike merge when J-Popups-ABS is active (`routeStrikePop`).
 * - 1.0.0
 *    Initial release.
 *    Added HP/MP/TP cost and gain popups hooked via Game_Battler methods.
 *    On-attack and when-hit gains from J-Resources-ABS are covered automatically.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/popups/ext/resources/_metadata/_pluginMetadata.js
var J_PopupsResources_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	*  Extends {@link #postInitialize}.<br>
	*  Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
	}
};

//#endregion
//#region src/plugins/popups/ext/resources/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
J.POPUPS ||= {};
J.POPUPS.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.POPUPS.EXT.RESOURCES = {};
/**
* The metadata associated with this plugin.
*/
J.POPUPS.EXT.RESOURCES.Metadata = new J_PopupsResources_PluginMetadata("J-Popups-Resources", "1.0.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.POPUPS.EXT.RESOURCES.Aliased = {};
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler = new Map();

//#endregion
//#region src/plugins/popups/ext/resources/objects/Game_Battler.js
/**
* Extends {@link #paySkillHpCost}.<br/>
* Also generates a pop for the damage dealt.
*/
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.set("paySkillHpCost", Game_Battler.prototype.paySkillHpCost);
Game_Battler.prototype.paySkillHpCost = function(amount) {
	J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.get("paySkillHpCost").call(this, amount);
	if (amount === 0) return;
	if (!J.ABS) return;
	const jabsBattler = JABS_AiManager.getBattlerByUuid(this.getUuid());
	if (!jabsBattler) return;
	const character = jabsBattler.getCharacter();
	if (!character) return;
	const pop = new TextPopBuilder(amount).isHpDamage().forEnemyDamageRing().build();
	const uuid = jabsBattler.getUuid();
	JABS_PopupMergeController.routeStrikePop(pop, character, {
		attackerUuid: uuid,
		targetUuid: uuid,
		amount
	});
};
/**
* Extends {@link #gainHpFromResource}.<br/>
* Also generates a pop for the healing received.
*/
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.set("gainHpFromResource", Game_Battler.prototype.gainHpFromResource);
Game_Battler.prototype.gainHpFromResource = function(amount) {
	J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.get("gainHpFromResource").call(this, amount);
	if (amount === 0) return;
	if (!J.ABS) return;
	const jabsBattler = JABS_AiManager.getBattlerByUuid(this.getUuid());
	if (!jabsBattler) return;
	const character = jabsBattler.getCharacter();
	if (!character) return;
	const pop = new TextPopBuilder(-amount).isHpDamage().forIncomingHealRing().build();
	const uuid = jabsBattler.getUuid();
	JABS_PopupMergeController.routeStrikePop(pop, character, {
		attackerUuid: uuid,
		targetUuid: uuid,
		amount: -amount
	});
};
/**
* Extends {@link #gainMpFromResource}.<br/>
* Also generates a pop for the healing received.
*/
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.set("gainMpFromResource", Game_Battler.prototype.gainMpFromResource);
Game_Battler.prototype.gainMpFromResource = function(amount) {
	J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.get("gainMpFromResource").call(this, amount);
	if (amount === 0) return;
	if (!J.ABS) return;
	const jabsBattler = JABS_AiManager.getBattlerByUuid(this.getUuid());
	if (!jabsBattler) return;
	const character = jabsBattler.getCharacter();
	if (!character) return;
	const pop = new TextPopBuilder(-amount).isMpDamage().forIncomingHealRing().build();
	const uuid = jabsBattler.getUuid();
	JABS_PopupMergeController.routeStrikePop(pop, character, {
		attackerUuid: uuid,
		targetUuid: uuid,
		amount: -amount
	});
};
/**
* Extends {@link #gainTpFromResource}.<br/>
* Also generates a pop for the healing received.
*/
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.set("gainTpFromResource", Game_Battler.prototype.gainTpFromResource);
Game_Battler.prototype.gainTpFromResource = function(amount) {
	J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.get("gainTpFromResource").call(this, amount);
	if (amount === 0) return;
	if (!J.ABS) return;
	const jabsBattler = JABS_AiManager.getBattlerByUuid(this.getUuid());
	if (!jabsBattler) return;
	const character = jabsBattler.getCharacter();
	if (!character) return;
	const pop = new TextPopBuilder(-amount).isTpDamage().forIncomingHealRing().build();
	const uuid = jabsBattler.getUuid();
	JABS_PopupMergeController.routeStrikePop(pop, character, {
		attackerUuid: uuid,
		targetUuid: uuid,
		amount: -amount
	});
};

//#endregion
//# sourceMappingURL=J-Popups-Resources.js.map