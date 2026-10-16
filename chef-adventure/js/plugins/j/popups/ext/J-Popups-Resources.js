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
 * Please refer to J-Popups-Resources's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/popups/ext/resources/index.md
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