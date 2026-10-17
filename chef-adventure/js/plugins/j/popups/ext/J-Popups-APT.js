//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.3 POPUPS-APT] Aptitude point gain popups.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Popups
 * @base J-Aptitude
 * @orderAfter J-Base
 * @orderAfter J-Popups
 * @orderAfter J-Aptitude
 * @help
 * ============================================================================
 * Please refer to J-Popups-APT's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/popups/ext/apt/index.md
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/popups/ext/apt/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-Popups-APT.
*/
var J_PopupsApt_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/popups/ext/apt/_metadata/initialization.js
globalThis.J ||= {};
J.POPUPS ||= {};
J.POPUPS.EXT ||= {};
J.POPUPS.EXT.APT = J.POPUPS.EXT.APT || {};
/**
* The metadata associated with this extension plugin.
*/
J.POPUPS.EXT.APT.Metadata = new J_PopupsApt_PluginMetadata("J-Popups-APT", "1.0.3");
J.POPUPS.EXT.APT.Aliased = J.POPUPS.EXT.APT.Aliased || {};
J.POPUPS.EXT.APT.Aliased.JABS_Engine = new Map();

//#endregion
//#region src/plugins/popups/ext/apt/_models/Map_TextPop.js
/**
* The popup type for AP (aptitude point) rewards.
*/
Map_TextPop.Types.Ap = "ap";

//#endregion
//#region src/plugins/popups/ext/apt/_models/TextPopBuilder.js
/**
* Add convenient defaults for configuring an AP-gain popup.
* @returns {TextPopBuilder}
*/
TextPopBuilder.prototype.isAptitude = function() {
	this.setPopupType(Map_TextPop.Types.Ap);
	this.setTextColorIndex(17);
	this.setIconIndex(IconManager.apPoints());
	this.forRewardUpRing();
	return this;
};

//#endregion
//#region src/plugins/popups/ext/apt/managers/JABS_Engine.js
/**
* Extends {@link #gainAptitudeReward}.<br/>
* Also shows an AP popup on each eligible member's character.
*/
J.POPUPS.EXT.APT.Aliased.JABS_Engine.set("gainAptitudeReward", JABS_Engine.prototype.gainAptitudeReward);
JABS_Engine.prototype.gainAptitudeReward = function(ap, actor, enemy) {
	J.POPUPS.EXT.APT.Aliased.JABS_Engine.get("gainAptitudeReward").call(this, ap, actor, enemy);
	if (ap === 0) return;
	$gameParty.members().filter((member) => this.canGainAptitudeReward(member, enemy)).forEach((member) => {
		const jabsBattler = JABS_AiManager.getBattlerByUuid(member.getUuid());
		if (!jabsBattler) return;
		const levelMultiplier = this.getRewardScalingMultiplier(enemy, jabsBattler);
		const actualAp = Math.ceil(ap * levelMultiplier);
		const pop = new TextPopBuilder(actualAp).isAptitude().build();
		JABS_PopupMergeController.routeRewardPop(pop, jabsBattler.getCharacter(), {
			rewardType: Map_TextPop.Types.Ap,
			amount: actualAp
		});
	});
};
/**
* Extends {@link #onTypedApGained}.<br/>
* Also shows a typed-AP popup with icon and type label on the character.
*/
J.POPUPS.EXT.APT.Aliased.JABS_Engine.set("onTypedApGained", JABS_Engine.prototype.onTypedApGained);
JABS_Engine.prototype.onTypedApGained = function(apPoints, character, apTypeKey) {
	J.POPUPS.EXT.APT.Aliased.JABS_Engine.get("onTypedApGained").call(this, apPoints, character, apTypeKey);
	const { name, icon } = ApManager.apTypeDisplay(apTypeKey);
	const pop = new TextPopBuilder(`${apPoints} [${name}]`).isAptitude().setIconIndex(icon).build();
	TextPopManager.show(pop, character);
};

//#endregion
//# sourceMappingURL=J-Popups-APT.js.map