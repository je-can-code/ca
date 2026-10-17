//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.2 POPUPS-SDP] SDP point gain popups.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Popups
 * @base J-SDP
 * @orderAfter J-Base
 * @orderAfter J-Popups
 * @orderAfter J-SDP
 * @help
 * ============================================================================
 * Please refer to J-Popups-SDP's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/popups/ext/sdp/index.md
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/popups/ext/sdp/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-Popups-SDP.
*/
var J_PopupsSdp_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/popups/ext/sdp/_metadata/initialization.js
globalThis.J ||= {};
J.POPUPS ||= {};
J.POPUPS.EXT ||= {};
J.POPUPS.EXT.SDP = J.POPUPS.EXT.SDP || {};
/**
* The metadata associated with this extension plugin.
*/
J.POPUPS.EXT.SDP.Metadata = new J_PopupsSdp_PluginMetadata("J-Popups-SDP", "1.0.2");
J.POPUPS.EXT.SDP.Aliased = J.POPUPS.EXT.SDP.Aliased || {};
J.POPUPS.EXT.SDP.Aliased.JABS_Engine = new Map();

//#endregion
//#region src/plugins/popups/ext/sdp/managers/JABS_Engine.js
/**
* Extends {@link #onSdpRewardGranted}.<br/>
* Also shows an SDP-points popup on the character.
*/
J.POPUPS.EXT.SDP.Aliased.JABS_Engine.set("onSdpRewardGranted", JABS_Engine.prototype.onSdpRewardGranted);
JABS_Engine.prototype.onSdpRewardGranted = function(sdpPoints, character) {
	J.POPUPS.EXT.SDP.Aliased.JABS_Engine.get("onSdpRewardGranted").call(this, sdpPoints, character);
	const pop = new TextPopBuilder(sdpPoints).isSdpPoints().build();
	JABS_PopupMergeController.routeRewardPop(pop, character, {
		rewardType: Map_TextPop.Types.Sdp,
		amount: sdpPoints
	});
};
/**
* Extends {@link #onSdpPanelUnlocked}.<br/>
* Also shows an SDP-unlock popup on the character.
*/
J.POPUPS.EXT.SDP.Aliased.JABS_Engine.set("onSdpPanelUnlocked", JABS_Engine.prototype.onSdpPanelUnlocked);
JABS_Engine.prototype.onSdpPanelUnlocked = function(sdpKey, character) {
	J.POPUPS.EXT.SDP.Aliased.JABS_Engine.get("onSdpPanelUnlocked").call(this, sdpKey, character);
	const sdp = J.SDP.Metadata.panelsMap.get(sdpKey);
	const pop = new TextPopBuilder(sdp.name).isSdpPoints().build();
	TextPopManager.show(pop, character);
};

//#endregion
//# sourceMappingURL=J-Popups-SDP.js.map