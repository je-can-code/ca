//region Game_Battler
/**
 * Gets all skill proficiencies for this battler.
 * @returns {SkillProficiency[]}
 */
Game_Battler.prototype.skillProficiencies = function()
{
  return [];
};

/**
 * Gets the prof of one particular skill for this battler.
 * @param {number} skillId The id of the skill to get proficiency for.
 * @returns {number}
 */
Game_Battler.prototype.skillProficiencyBySkillId = function(skillId)
{
  return 0;
};

/**
 * Gets the total amount of proficiency gained from an action for this battler.
 * @returns {number}
 */
Game_Battler.prototype.skillProficiencyAmount = function()
{
  const base = this.baseSkillProficiencyAmount();
  const bonuses = this.bonusSkillProficiencyGains();
  return base + bonuses;
};

/**
 * Gets the base amount of proficiency gained from an action for this battler.
 * @returns {number}
 */
Game_Battler.prototype.baseSkillProficiencyAmount = function()
{
  return 1;
};

/**
 * Gets the base amount of proficiency gained from an action for this battler.
 * @returns {number}
 */
Game_Battler.prototype.bonusSkillProficiencyGains = function()
{
  return 0;
};

/**
 * Whether or not a battler can gain proficiency by using skills against this battler.
 * @returns {boolean} True if the battler can give proficiency, false otherwise.
 */
Game_Battler.prototype.canGiveProficiency = function()
{
  // get whether or not they are blocked from giving proficiency.
  const canGiveProficiency = this.extractProficiencyGivingBlock();

  // return the outcome.
  return canGiveProficiency;
};

/**
 * Determines whether or not this battler can give proficiency gains.
 * @returns {number}
 */
Game_Battler.prototype.extractProficiencyGivingBlock = function()
{
  const objectsToCheck = this.getAllNotes();
  const structure = /<proficiencyGivingBlock>/i;
  let canGiveProficiency = true;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        canGiveProficiency = false;
      }
    });
  });

  return canGiveProficiency;
};

/**
 * Whether or not this battler can gain proficiency from using skills.
 * @returns {boolean} True if the battler can gain proficiency, false otherwise.
 */
Game_Battler.prototype.canGainProficiency = function()
{
  // get whether or not they are blocked from gaining proficiency.
  const canGainProficiency = this.extractProficiencyGainingBlock();

  // return the outcome.
  return canGainProficiency;
};

/**
 * Determines whether or not this battler can gain proficiency.
 * @returns {number}
 */
Game_Battler.prototype.extractProficiencyGainingBlock = function()
{
  const objectsToCheck = this.getAllNotes();
  const structure = /<proficiencyGainingBlock>/i;
  let canGainProficiency = true;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        canGainProficiency = false;
      }
    });
  });

  return canGainProficiency;
};
//endregion Game_Battler