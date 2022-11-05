//#region Game_Enemy
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
 * All sources this enemy battler has available to it.
 * @returns {(RPG_Enemy|RPG_State|RPG_Skill)[]}
 */
Game_Enemy.prototype.getNotesSources = function()
{
  // get the super-classes' note sources as a baseline.
  const baseNoteSources = Game_Battler.prototype.getNotesSources.call(this);

  // the list of note sources unique to enemies.
  const enemyUniqueNoteSources = [
    // add the actor's skills to the source list.
    ...this.skills(),
  ];

  // combine the two source lists.
  const combinedNoteSources = baseNoteSources.concat(enemyUniqueNoteSources);

  // return our combination.
  return combinedNoteSources;
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
//#endregion Game_Enemy