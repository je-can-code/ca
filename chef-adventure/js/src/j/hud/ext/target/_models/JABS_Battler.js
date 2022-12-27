//region JABS_Battler
/**
 * Sets the last battler struck by this battler.
 * @param {JABS_Battler} battlerLastHit The battler that is being set as last struck.
 */
J.HUD.EXT.TARGET.Aliased.JABS_Battler.set('setBattlerLastHit', JABS_Battler.prototype.setBattlerLastHit);
JABS_Battler.prototype.setBattlerLastHit = function(battlerLastHit)
{
  // check if we can update the target frame based on the provided data.
  if (this.canUpdateTargetFrame(battlerLastHit))
  {
    // create the target frame data.
    const framedTarget = this.buildFramedTarget(battlerLastHit);

    // set the new target to be picked up by the hud manager.
    $hudManager.setNewTarget(framedTarget);
  }

  // perform original logic.
  J.HUD.EXT.TARGET.Aliased.JABS_Battler.get('setBattlerLastHit').call(this, battlerLastHit);
};

/**
 * Determines whether or not the target frame should be updated.
 * @param {JABS_Battler} potentialTarget The battler that is being set as last struck.
 * @returns {boolean} True if we should update the target frame, false otherwise.
 */
JABS_Battler.prototype.canUpdateTargetFrame = function(potentialTarget)
{
  // if this battler is not the player, then do not update the target frame.
  if (!this.isPlayer()) return false;

  // if the potential target is invalid, do not update the target frame.
  if (!potentialTarget) return false;

  // if this target does not permit showing the target frame, then do not.
  if (!potentialTarget.canShowTargetFrame()) return false;

  // at this point, if we're considering it seriously, refresh the window.
  $hudManager.requestTargetFrameRefresh();

  // always update the target frame if we didn't have a last-hit before.
  if (!this.getTarget())
  {
    return true;
  }

  // don't re-update the last hit if they haven't changed.
  if (this.getTarget().getUuid() === potentialTarget.getUuid()) return false;

  // time to update target frame!
  return true;
};

/**
 * Checks the last hit battler to build the target frame.
 * @param {JABS_Battler} battlerLastHit The battler that is being set as last struck.
 * @returns {FramedTarget}
 */
JABS_Battler.prototype.buildFramedTarget = function(battlerLastHit)
{
  // determine the name of the battler.
  const battlerName = battlerLastHit.battlerName();

  // extract the target frame text.
  const targetFrameText = battlerLastHit.getTargetFrameText();

  // extract the target frame icon.
  const targetFrameIcon = battlerLastHit.getTargetFrameIcon();

  // extract the target configuration.
  const targetConfiguration = battlerLastHit.buildFramedTargetConfiguration();

  // create the new framed target for this battler.
  return new FramedTarget(
    battlerName,
    targetFrameText,
    targetFrameIcon,
    battlerLastHit.getBattler(),
    targetConfiguration);
};

/**
 * Determines whether or not the target frame will show for the given target.
 * @returns {boolean} True if we should show the target frame, false otherwise.
 */
JABS_Battler.prototype.canShowTargetFrame = function()
{
  // if this isn't an enemy, then they don't show the target frame.
  if (!this.isEnemy()) return false;

  // if there isn't an event or character remaining, don't bother.
  if (!this.getCharacter() || this.getCharacter().isErased()) return false;

  // check the event to see if we can show the target frame.
  const hiddenByEvent = !this.getCharacter().canShowTargetFrame();

  // if the event prevents showing the target frame, then don't show it.
  if (hiddenByEvent) return false;

  // check the enemy to see if the enemy in the database prevents showing.
  const hiddenByDatabase = !this.getBattler().showTargetFrame();

  // if one or the other are indicating not to show, then don't.
  if (hiddenByDatabase) return false;

  // show the target frame!
  return true;
};

/**
 * Builds the configuration for the target frame based on this battler.
 * @returns {FramedTargetConfiguration}
 */
JABS_Battler.prototype.buildFramedTargetConfiguration = function()
{
  // showing the target's name reuses existing logic to check.
  const showName = this.showBattlerName();

  // check to see if we should show the target text.
  const showText = this.canShowTargetText();

  // check to see if we should show HP.
  const showHpGauge = this.canShowTargetHp();

  // check to see if we should show MP.
  const showMpGauge = this.canShowTargetMp();

  // check to see if we should show TP.
  const showTpGauge = this.canShowTargetTp();

  // return the built configuration.
  return new FramedTargetConfiguration(
    showName,
    showText,
    showHpGauge,
    showMpGauge,
    showTpGauge);
};

/**
 * Gets whether or not this battler can show their HP in the target frame window.
 * @returns {boolean} True if it can show, false otherwise.
 */
JABS_Battler.prototype.canShowTargetHp = function()
{
  // if the defaults hide the HP, then don't show it.
  if (!J.HUD.EXT.TARGET.Metadata.EnableHP) return false;

  // we do not show hp bars for non-enemies.
  if (!this.isEnemy()) return false;

  // if the event says don't show it, then don't show it.
  if (!this.getCharacter().showTargetHpBar()) return false;

  // if the enemy in the database says don't show it, then don't show it.
  if (!this.getBattler().showTargetHpBar()) return false;

  // show what the defaults are.
  return true;
};

/**
 * Gets whether or not this battler can show their MP in the target frame window.
 * @returns {boolean} True if it can show, false otherwise.
 */
JABS_Battler.prototype.canShowTargetMp = function()
{
  // if the defaults hide the MP, then don't show it.
  if (!J.HUD.EXT.TARGET.Metadata.EnableMP) return false;

  // we do not show hp bars for non-enemies.
  if (!this.isEnemy()) return false;

  // if the event says don't show it, then don't show it.
  if (!this.getCharacter().showTargetMpBar()) return false;

  // if the enemy in the database says don't show it, then don't show it.
  if (!this.getBattler().showTargetMpBar()) return false;

  // TODO: should we hide the bar if the max value is 0?
  if (this.getBattler().param(1) === 0) return false;

  // show what the defaults are.
  return true;
};

/**
 * Gets whether or not this battler can show their TP in the target frame window.
 * @returns {boolean} True if it can show, false otherwise.
 */
JABS_Battler.prototype.canShowTargetTp = function()
{
  // if the defaults hide the TP, then don't show it.
  if (!J.HUD.EXT.TARGET.Metadata.EnableTP) return false;

  // we do not show hp bars for non-enemies.
  if (!this.isEnemy()) return false;

  // if the event says don't show it, then don't show it.
  if (!this.getCharacter().showTargetTpBar()) return false;

  // if the enemy in the database says don't show it, then don't show it.
  if (!this.getBattler().showTargetTpBar()) return false;

  // TODO: should we hide the bar if the max value is 0?
  if (this.getBattler().maxTp() === 0 || this.isInanimate()) return false;

  // show what the defaults are.
  return true;
};

/**
 * Gets whether or not this battler can show extra text in the target frame window.
 * @returns {boolean} True if it can show, false otherwise.
 */
JABS_Battler.prototype.canShowTargetText = function()
{
  // we do not show hp bars for non-enemies.
  if (!this.isEnemy()) return false;

  // if the event says don't show it, then don't show it.
  if (!this.getCharacter().showTargetText()) return false;

  // if the enemy in the database says don't show it, then don't show it.
  if (!this.getBattler().showTargetText()) return false;

  // show it.
  return true;
};

/**
 * Gets the target frame text for this enemy.
 * @returns {string}
 */
JABS_Battler.prototype.getTargetFrameText = function()
{
  // if this isn't an enemy, then they don't get target frame extra text.
  if (!this.isEnemy()) return String.empty;

  // extract the text from the event.
  let targetFrameText = this.getCharacter().getTargetFrameText();

  // if there wasn't any on the event, check the enemy.
  if (!targetFrameText)
  {
    // extract the icon index from the enemy.
    targetFrameText = this.getBattler().targetFrameText();
  }

  // and return it.
  return targetFrameText;
};

/**
 * Gets the target frame icon from the underlying character.
 * @returns {number}
 */
JABS_Battler.prototype.getTargetFrameIcon = function()
{
  // if this isn't an enemy, then they don't get target frame icons.
  if (!this.isEnemy()) return 0;

  // extract the icon index from the event.
  let targetFrameIcon = this.getCharacter().getTargetFrameIcon();

  // if there wasn't one on the event, check the enemy.
  if (!targetFrameIcon)
  {
    // extract the icon index from the enemy.
    targetFrameIcon = this.getBattler().targetFrameIcon();
  }

  // and return it.
  return targetFrameIcon;
};
//endregion JABS_Battler