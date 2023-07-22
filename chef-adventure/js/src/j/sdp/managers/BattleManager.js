//region BattleManager
/**
 * Extends the creation of the rewards object to include SDP points.
 */
J.SDP.Aliased.BattleManager.makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function()
{
  J.SDP.Aliased.BattleManager.makeRewards.call(this);
  this._rewards = {
    ...this._rewards,
    sdp: $gameTroop.sdpTotal(),
  };
};

/**
 * Extends the gaining of rewards to also gain SDP points.
 */
J.SDP.Aliased.BattleManager.gainRewards = BattleManager.gainRewards;
BattleManager.gainRewards = function()
{
  J.SDP.Aliased.BattleManager.gainRewards.call(this);
  this.gainSdpPoints();
};

/**
 * Performs a gain of the SDP points for all members of the party after battle.
 */
BattleManager.gainSdpPoints = function()
{
  const sdpPoints = this._rewards.sdp;
  $gameParty.members().forEach(member =>
  {
    member.modSdpPoints(sdpPoints);
  });
};

J.SDP.Aliased.BattleManager.displayRewards = BattleManager.displayRewards;
BattleManager.displayRewards = function()
{
  this.displaySdp();
  J.SDP.Aliased.BattleManager.displayRewards.call(this);
};

BattleManager.displaySdp = function()
{
  const { sdp } = this._rewards;
  if (sdp > 0)
  {
    const text = `${sdp} ${J.SDP.Metadata.VictoryText}`;
    $gameMessage.add("\\." + text);
  }
};
//endregion BattleManager