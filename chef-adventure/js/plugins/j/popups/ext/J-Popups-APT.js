//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 POPUPS] Aptitude map popups (requires J-Popups + J-Aptitude).
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @orderAfter J-Aptitude
 * @help
 * ============================================================================
 * Registers J.POPUPS.EXT.APT for AP reward popups. Load after J-Popups and
 * J-Aptitude (and J-Aptitude-Typed if used).
 * ============================================================================
 */
//endregion Introduction


//region J_PopupsExtAPT_init
J.POPUPS.EXT.APT = J.POPUPS.EXT.APT || {};

J.POPUPS.EXT.APT.Aliased = J.POPUPS.EXT.APT.Aliased || {};
J.POPUPS.EXT.APT.Aliased.JABS_Engine = new Map();
//endregion J_PopupsExtAPT_init


//region J_POPAPT_Engine

/**
 * The popup type for AP (aptitude points) rewards.
 */
Map_TextPop.Types.Ap = 'ap';

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

//region JABS_Engine aliases
/**
 * Extends {@link #gainAptitudeReward}.<br/>
 * Also shows an AP popup on each eligible member's character.
 */
J.POPUPS.EXT.APT.Aliased.JABS_Engine.set('gainAptitudeReward', JABS_Engine.prototype.gainAptitudeReward);
JABS_Engine.prototype.gainAptitudeReward = function(ap, actor, enemy)
{
  // perform original logic.
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
      const character = jabsBattler.getCharacter();

      character.addTextPop(pop);
      character.requestTextPop();
    });
};

/**
 * Extends {@link #onTypedApGained}.<br/>
 * Also shows a typed-AP popup with icon and type label on the character.
 */
J.POPUPS.EXT.APT.Aliased.JABS_Engine.set('onTypedApGained', JABS_Engine.prototype.onTypedApGained);
JABS_Engine.prototype.onTypedApGained = function(apPoints, character, apTypeKey)
{
  // perform original logic.
  J.POPUPS.EXT.APT.Aliased.JABS_Engine.get('onTypedApGained')
    .call(this, apPoints, character, apTypeKey);

  const { name, icon } = ApManager.apTypeDisplay(apTypeKey);
  const pop = new TextPopBuilder(`${apPoints} [${name}]`)
    .isAptitude()
    .setIconIndex(icon)
    .build();

  character.addTextPop(pop);
  character.requestTextPop();
};
//endregion JABS_Engine aliases

//endregion J_POPAPT_Engine


//# sourceMappingURL=J-Popups-APT.js.map
