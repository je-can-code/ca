//region JABS_BattleMemory
/**
 * A class representing a single battle memory.
 * Battle memories are simply a mapping of the battler targeted, the skill used, and
 * the effectiveness of the skill on the target.
 * This is used when the AI decides which action to use.
 */
function JABS_BattleMemory()
{
  this.initialize(...arguments);
}

JABS_BattleMemory.prototype = {};
JABS_BattleMemory.prototype.constructor = JABS_BattleMemory;

/**
 * Initializes this class.
 * @param {number} battlerId The id of the battler the memory is built on.
 * @param {number} skillId The skill id executed against the battler.
 * @param {number} effectiveness The level of effectiveness of the skill used on this battler.
 * @param {boolean} damageApplied The damage applied to the target.
 */
JABS_BattleMemory.prototype.initialize = function(battlerId, skillId, effectiveness, damageApplied)
{
  /**
   * The id of the battler targeted.
   * @type {number}
   */
  this.battlerId = battlerId;

  /**
   * The id of the skill executed.
   * @type {number}
   */
  this.skillId = skillId;

  /**
   * How elementally effective the skill was that was used on the given battler id.
   * @type {boolean}
   */
  this.effectiveness = effectiveness;

  /**
   * The damage dealt from this action.
   */
  this.damageApplied = damageApplied;
};

/**
 * Checks if this memory was an effective one.
 * @returns {boolean}
 */
JABS_BattleMemory.prototype.wasEffective = function()
{
  return this.effectiveness >= 1;
};
//endregion JABS_BattleMemory