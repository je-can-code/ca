//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 POPUPS-SDP] SDP point gain popups.
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
 * OVERVIEW
 * This plugin is an extension of J-Popups for J-SDP.
 *
 * Have you ever wanted a popup to appear whenever a battler earns SDP points
 * in combat? Well now you can! This plugin wires up SDP reward popups into
 * the JABS combat flow so players always get that satisfying feedback when
 * their panel points are ticking up.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Renamed source file to standard JABS naming conventions.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion Introduction


//region J_PopupsExtSDP_init
J.POPUPS.EXT.SDP = J.POPUPS.EXT.SDP || {};

J.POPUPS.EXT.SDP.Aliased = J.POPUPS.EXT.SDP.Aliased || {};
J.POPUPS.EXT.SDP.Aliased.JABS_Engine = new Map();
//endregion J_PopupsExtSDP_init


//region JABS_Engine
/**
 * Extends {@link #onSdpRewardGranted}.<br/>
 * Also shows an SDP-points popup on the character.
 */
J.POPUPS.EXT.SDP.Aliased.JABS_Engine.set('onSdpRewardGranted', JABS_Engine.prototype.onSdpRewardGranted);
JABS_Engine.prototype.onSdpRewardGranted = function(sdpPoints, character)
{
  J.POPUPS.EXT.SDP.Aliased.JABS_Engine.get('onSdpRewardGranted')
    .call(this, sdpPoints, character);

  const pop = new TextPopBuilder(sdpPoints)
    .isSdpPoints()
    .build();

  TextPopManager.show(pop, character);
};

/**
 * Extends {@link #onSdpPanelUnlocked}.<br/>
 * Also shows an SDP-unlock popup on the character.
 */
J.POPUPS.EXT.SDP.Aliased.JABS_Engine.set('onSdpPanelUnlocked', JABS_Engine.prototype.onSdpPanelUnlocked);
JABS_Engine.prototype.onSdpPanelUnlocked = function(sdpKey, character)
{
  J.POPUPS.EXT.SDP.Aliased.JABS_Engine.get('onSdpPanelUnlocked')
    .call(this, sdpKey, character);

  const sdp = J.SDP.Metadata.panelsMap.get(sdpKey);
  const pop = new TextPopBuilder(sdp.name)
    .isSdpPoints()
    .build();

  TextPopManager.show(pop, character);
};
//endregion JABS_Engine

//# sourceMappingURL=J-Popups-SDP.js.map
