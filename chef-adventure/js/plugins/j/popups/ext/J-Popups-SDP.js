//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 POPUPS] SDP map popups (requires J-Popups + J-SDP + J-ABS).
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @orderAfter J-SDP
 * @help
 * ============================================================================
 * Registers J.POPUPS.EXT.SDP. Load after J-Popups and J-SDP.
 * ============================================================================
 */
//endregion Introduction


//region J_PopupsExtSDP_init
J.POPUPS.EXT.SDP = J.POPUPS.EXT.SDP || {};

J.POPUPS.EXT.SDP.Aliased = J.POPUPS.EXT.SDP.Aliased || {};
J.POPUPS.EXT.SDP.Aliased.JABS_Engine = new Map();
//endregion J_PopupsExtSDP_init


//region J_POPSDP_Engine

//region JABS_Engine aliases
/**
 * Extends {@link #onSdpRewardGranted}.<br/>
 * Also shows an SDP-points popup on the character.
 */
J.POPUPS.EXT.SDP.Aliased.JABS_Engine.set('onSdpRewardGranted', JABS_Engine.prototype.onSdpRewardGranted);
JABS_Engine.prototype.onSdpRewardGranted = function(sdpPoints, character)
{
  // perform original logic.
  J.POPUPS.EXT.SDP.Aliased.JABS_Engine.get('onSdpRewardGranted')
    .call(this, sdpPoints, character);

  const pop = new TextPopBuilder(sdpPoints)
    .isSdpPoints()
    .build();

  character.addTextPop(pop);
  character.requestTextPop();
};

/**
 * Extends {@link #onSdpPanelUnlocked}.<br/>
 * Also shows an SDP-unlock popup on the character.
 */
J.POPUPS.EXT.SDP.Aliased.JABS_Engine.set('onSdpPanelUnlocked', JABS_Engine.prototype.onSdpPanelUnlocked);
JABS_Engine.prototype.onSdpPanelUnlocked = function(sdpKey, character)
{
  // perform original logic.
  J.POPUPS.EXT.SDP.Aliased.JABS_Engine.get('onSdpPanelUnlocked')
    .call(this, sdpKey, character);

  const sdp = J.SDP.Metadata.panelsMap.get(sdpKey);
  const pop = new TextPopBuilder(sdp.name)
    .isSdpPoints()
    .build();

  character.addTextPop(pop);
  character.requestTextPop();
};
//endregion JABS_Engine aliases

//endregion J_POPSDP_Engine


//# sourceMappingURL=J-Popups-SDP.js.map
