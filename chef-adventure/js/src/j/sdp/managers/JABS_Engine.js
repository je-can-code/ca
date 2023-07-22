//region JABS_Engine
if (J.ABS)
{
  /**
   * Extends the basic rewards from defeating an enemy to also include SDP points.
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  J.SDP.Aliased.JABS_Engine.set('gainBasicRewards', JABS_Engine.prototype.gainBasicRewards);
  JABS_Engine.prototype.gainBasicRewards = function(enemy, actor)
  {
    // perform original logic.
    J.SDP.Aliased.JABS_Engine.get('gainBasicRewards').call(this, enemy, actor);

    // grab the sdp points value.
    let sdpPoints = enemy.sdpPoints();

    // if we have no points, then no point in continuing.
    if (!sdpPoints) return;

    // get the scaling multiplier if any exists.
    const levelMultiplier = this.getRewardScalingMultiplier(enemy, actor);

    // round up in favor of the player to skip decimals from the multiplier.
    sdpPoints = Math.ceil(sdpPoints * levelMultiplier);

    // gain the value calculated.
    this.gainSdpReward(sdpPoints, actor);

    // generate a log for the SDP gain.
    this.createSdpLog(sdpPoints, actor);
  };

  /**
   * Gains SDP points from battle rewards.
   * @param {number} sdpPoints The SDP points to gain.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  JABS_Engine.prototype.gainSdpReward = function(sdpPoints, actor)
  {
    // don't do anything if the enemy didn't grant any sdp points.
    if (!sdpPoints) return;

    // sdp points are obtained by all members in the party.
    $gameParty.members().forEach(member => member.modSdpPoints(sdpPoints));

    // get the true amount obtained after multipliers for the leader.
    const sdpMultiplier = actor.getBattler().sdpMultiplier();
    const multipliedSdpPoints = Math.round(sdpMultiplier * sdpPoints);

    // generate the text popup for the obtained sdp points.
    this.generatePopSdpPoints(multipliedSdpPoints, actor.getCharacter());
  };

  /**
   * Generates a popup for the SDP points obtained.
   * @param {number} amount The amount to display.
   * @param {Game_Character} character The character to show the popup on.
   */
  JABS_Engine.prototype.generatePopSdpPoints = function(amount, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const sdpPop = this.configureSdpPop(amount);

    // add the pop to the caster's tracking.
    character.addTextPop(sdpPop);
    character.requestTextPop();
  };

  /**
   * Creates the text pop of the SDP points gained.
   * @param {number} sdpPoints The amount of experience gained.
   */
  JABS_Engine.prototype.configureSdpPop = function(sdpPoints)
  {
    return new TextPopBuilder(sdpPoints)
      .isSdpPoints()
      .build();
  };

  /**
   * Creates the log entry if using the J-LOG.
   * @param {number} sdpPoints The SDP ponts gained.
   * @param {JABS_Battler} battler The battler gaining the SDP points.
   */
  JABS_Engine.prototype.createSdpLog = function(sdpPoints, battler)
  {
    if (!J.LOG) return;

    const sdpLog = new MapLogBuilder()
      .setupSdpAcquired(battler.battlerName(), sdpPoints)
      .build();
    $gameTextLog.addLog(sdpLog);
  };
}
//endregion JABS_Engine