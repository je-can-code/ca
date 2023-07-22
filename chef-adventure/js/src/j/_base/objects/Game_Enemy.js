//region Game_Enemy
/**
 * Gets the battler id of this enemy from the database.
 * @returns {number}
 */
Game_Enemy.prototype.battlerId = function()
{
  return this.enemyId();
};

/**
 * The underlying database data for this enemy.
 * @returns {RPG_Enemy}
 */
Game_Enemy.prototype.databaseData = function()
{
  return this.enemy();
};

/**
 * Extends {@link #setup}.
 * Adds a hook for performing actions when an enemy is setup.
 */
J.BASE.Aliased.Game_Enemy.set('setup', Game_Enemy.prototype.setup);
Game_Enemy.prototype.setup = function(enemyId)
{
  // perform original logic.
  J.BASE.Aliased.Game_Enemy.get('setup').call(this, enemyId);

  // execute the on-setup hook.
  this.onSetup(enemyId);
};

/**
 * A hook for performing actions when an enemy is setup.
 * @param {number} enemyId The enemy's id.
 */
Game_Enemy.prototype.onSetup = function(enemyId)
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

/**
 * Converts all "actions" from an enemy into their collection of known skills.
 * This includes both skills listed in their skill list, and any added skills via traits.
 * @returns {RPG_Skill[]}
 */
Game_Enemy.prototype.skills = function()
{
  // grab the actions for the enemy.
  const actions = this.enemy().actions
    .map(action => this.skill(action.skillId), this);

  // grab any additional skills added via traits.
  const skillTraits = this.traitObjects()
    .filter(trait => trait.code === J.BASE.Traits.ADD_SKILL)
    .map(skillTrait => this.skill(skillTrait.dataId), this);

  // combine the two arrays of skills.
  return actions
    .concat(skillTraits)
    .sort();
};

/**
 * Checks whether or not this enemy knows this skill.
 * @param {number} skillId The id of the skill to check for.
 * @returns {boolean}
 */
Game_Enemy.prototype.hasSkill = function(skillId)
{
  return this.skills().some(skill => skill.id === skillId);
};

/**
 * Extends {@link #die}.
 * Adds a toggle of the death effects.
 */
J.BASE.Aliased.Game_Enemy.set('die', Game_Enemy.prototype.die);
Game_Enemy.prototype.die = function()
{
  // perform original effects.
  J.BASE.Aliased.Game_Enemy.get('die').call(this);

  // perform on-death effects.
  this.onDeath();
};

/**
 * An event hook fired when this enemy dies.
 */
Game_Enemy.prototype.onDeath = function()
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};
//endregion Game_Enemy