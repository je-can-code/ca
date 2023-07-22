//region Game_Party
/**
 * Gets the collective multiplier for gold drops for the entire party.
 * @returns {number}
 */
Game_Party.prototype.getGoldMultiplier = function()
{
  let goldMultiplier = 1;
  const membersToConsider = this.goldMultiplierMembers();
  membersToConsider.forEach(actor => goldMultiplier += actor.getGoldMultiplier());
  return goldMultiplier;
};

/**
 * Gets the selection of actors to consider when determining gold bonus multipliers.
 * @returns {Game_Actor[]}
 */
Game_Party.prototype.goldMultiplierMembers = function()
{
  const membersToConsider = [];
  membersToConsider.push(...$gameParty.battleMembers());

  // if only the leader should influence drop bonuses (for ABS style).
  // membersToConsider.push($gameParty.leader());

  // or everyone including reserve members (different preferences).
  // membersToConsider.push(...$gameParty.members());
  return membersToConsider;
};

/**
 * Gets the collective multiplier for loot drops for the entire party.
 * @returns {number}
 */
Game_Party.prototype.getDropMultiplier = function()
{
  let dropMultiplier = 0;
  const membersToConsider = this.dropMultiplierMembers();
  membersToConsider.forEach(actor => dropMultiplier += actor.getDropMultiplier());
  return dropMultiplier;
};

/**
 * Gets the selection of actors to consider when determining bonus drop multipliers.
 * @returns {Game_Actor[]}
 */
Game_Party.prototype.dropMultiplierMembers = function()
{
  const membersToConsider = [];
  membersToConsider.push(...$gameParty.battleMembers());

  // if only the leader should influence drop bonuses (for ABS style).
  // membersToConsider.push($gameParty.leader());

  // or everyone including reserve members (different preferences).
  // membersToConsider.push(...$gameParty.members());
  return membersToConsider;
};
//endregion Game_Party