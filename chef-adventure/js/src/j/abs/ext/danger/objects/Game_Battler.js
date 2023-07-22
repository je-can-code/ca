/**
 * Gets the numeric representation of this battler's strength.
 * @returns {number}
 */
Game_Battler.prototype.getPowerLevel = function()
{
  let powerLevel = 0;
  let counter = 2;
  // skip HP/MP
  const bparams = [2, 3, 4, 5, 6, 7];
  const xparams = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const sparams = [18, 19, 20, 21, 22, 23, 24, 25];
  while (counter < 28)
  {
    if (bparams.includes(counter))
    {
      powerLevel += this.param(counter);
    }

    if (xparams.includes(counter))
    {
      powerLevel += this.xparam(counter - 8) * 100;
    }

    if (sparams.includes(counter))
    {
      powerLevel += (this.sparam(counter - 18) * 100 - 100);
    }

    counter++;
  }

  if (Number.isNaN(powerLevel))
  {
    console.warn('what happened');
  }

  powerLevel += (this.level ** 2);
  return Math.round(powerLevel);
};

/**
 * Determines the iconIndex that indicates the danger level relative to the player and enemy.
 * @returns {number} The icon index of the danger indicator icon.
 */
Game_Battler.prototype.getDangerIndicatorIcon = function()
{
  // if the sprite belongs to the player, then don't do it.
  const player = $jabsEngine.getPlayer1().getBattler();
  if (player === this) return -1;

  // get the corresponding power levels.
  const bpl = this.getPowerLevel();
  const ppl = player.getPowerLevel();

  switch (true)
  {
    case (bpl < ppl * 0.5):
      return J.ABS.EXT.DANGER.DangerIndicatorIcons.Worthless;
    case (bpl >= ppl * 0.5 && bpl < ppl * 0.7):
      return J.ABS.EXT.DANGER.DangerIndicatorIcons.Simple;
    case (bpl >= ppl * 0.7 && bpl < ppl * 0.9):
      return J.ABS.EXT.DANGER.DangerIndicatorIcons.Easy;
    case (bpl >= ppl * 0.9 && bpl < ppl * 1.1):
      return J.ABS.EXT.DANGER.DangerIndicatorIcons.Average;
    case (bpl >= ppl * 1.1 && bpl < ppl * 1.3):
      return J.ABS.EXT.DANGER.DangerIndicatorIcons.Hard;
    case (bpl >= ppl * 1.3 && bpl <= ppl * 1.5):
      return J.ABS.EXT.DANGER.DangerIndicatorIcons.Grueling;
    case (bpl > ppl * 1.5):
      return J.ABS.EXT.DANGER.DangerIndicatorIcons.Deadly;
    default:
      return -1;
  }
};