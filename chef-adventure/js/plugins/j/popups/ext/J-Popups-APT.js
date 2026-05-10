//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.2 POPUPS-APT] Aptitude point gain popups.
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
 * OVERVIEW
 * This plugin is an extension of J-Popups for J-Aptitude.
 *
 * Have you ever wanted a satisfying popup to fly off your character every time
 * they earn AP in combat? Well now you can! This plugin wires up AP reward
 * popups into the JABS combat flow, so players always know when their aptitude
 * is growing.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.2
 *    AP reward popups route through `JABS_PopupMergeController.routeRewardPop` when J-Popups-ABS merge is enabled.
 * - 1.0.1
 *    Renamed source file to standard JABS naming conventions.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion Introduction

//region J_PopupsExtAPT_init
J.POPUPS.EXT.APT = J.POPUPS.EXT.APT || {};

J.POPUPS.EXT.APT.Aliased = J.POPUPS.EXT.APT.Aliased || {};
J.POPUPS.EXT.APT.Aliased.JABS_Engine = new Map();
//endregion J_PopupsExtAPT_init

//region Map_TextPop
/**
 * The popup type for AP (aptitude point) rewards.
 */
Map_TextPop.Types.Ap = 'ap';
//endregion Map_TextPop

//region TextPopBuilder
/**
 * Add convenient defaults for configuring an AP-gain popup.
 * @returns {TextPopBuilder}
 */
TextPopBuilder.prototype.isAptitude = function()
{
  this.setPopupType(Map_TextPop.Types.Ap);
  this.setTextColorIndex(17);
  this.setIconIndex(86);
  this.forRewardUpRing();
  return this;
};
//endregion TextPopBuilder

//region JABS_Engine
/**
 * Extends {@link #gainAptitudeReward}.<br/>
 * Also shows an AP popup on each eligible member's character.
 */
J.POPUPS.EXT.APT.Aliased.JABS_Engine.set('gainAptitudeReward', JABS_Engine.prototype.gainAptitudeReward);
JABS_Engine.prototype.gainAptitudeReward = function(ap, actor, enemy)
{
  J.POPUPS.EXT.APT.Aliased.JABS_Engine.get('gainAptitudeReward')
    .call(this, ap, actor, enemy);

  if (ap === 0) return;

  $gameParty.members()
    .filter(member => this.canGainAptitudeReward(member, enemy))
    .forEach(member =>
    {
      const jabsBattler = JABS_AiManager.getBattlerByUuid(member.getUuid());
      if (!jabsBattler) return;

      const levelMultiplier = this.getRewardScalingMultiplier(enemy, jabsBattler);
      const actualAp = Math.ceil(ap * levelMultiplier);
      const pop = new TextPopBuilder(actualAp)
        .isAptitude()
        .build();

      JABS_PopupMergeController.routeRewardPop(pop, jabsBattler.getCharacter(), {
        rewardType: Map_TextPop.Types.Ap,
        amount: actualAp,
      });
    });
};

/**
 * Extends {@link #onTypedApGained}.<br/>
 * Also shows a typed-AP popup with icon and type label on the character.
 */
J.POPUPS.EXT.APT.Aliased.JABS_Engine.set('onTypedApGained', JABS_Engine.prototype.onTypedApGained);
JABS_Engine.prototype.onTypedApGained = function(apPoints, character, apTypeKey)
{
  J.POPUPS.EXT.APT.Aliased.JABS_Engine.get('onTypedApGained')
    .call(this, apPoints, character, apTypeKey);

  const {
    name,
    icon
  } = ApManager.apTypeDisplay(apTypeKey);
  const pop = new TextPopBuilder(`${apPoints} [${name}]`)
    .isAptitude()
    .setIconIndex(icon)
    .build();

  TextPopManager.show(pop, character);
};
//endregion JABS_Engine

//# sourceMappingURL=J-Popups-APT.js.map
