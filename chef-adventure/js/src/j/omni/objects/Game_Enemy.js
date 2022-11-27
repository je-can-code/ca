//#region Game_Enemy
/**
 * Gets the {@link MonsterpediaObservations} associated with this enemy.
 * If none exists yet, one will be initialized.
 * @returns {MonsterpediaObservations}
 */
Game_Enemy.prototype.getMonsterPediaObservations = function()
{
  return $gameParty.getOrCreateMonsterpediaObservationsById(this.battlerId());
};

/**
 * Extends {@link #onDeath}.
 * Also updates the monsterpedia observations for this enemy.
 */
J.OMNI.Aliased.Game_Enemy.set('die', Game_Enemy.prototype.die);
Game_Enemy.prototype.onDeath = function()
{
  // increment the counter for how many times we've defeated this enemy.
  this.updateMonsterpediaObservation();
};

/**
 * Updates the monsterpedia observation associated with this enemy on-death.
 */
Game_Enemy.prototype.updateMonsterpediaObservation = function()
{
  // increment the counter for how many times we've defeated this enemy.
  this.incrementDefeatCount();

  // learn the name of the enemy in the monsterpedia.
  this.learnMonsterpediaName();

  // deduce the monster family of the enemy.
  this.learnMonsterpediaFamily();

  // discern a description of the enemy.
  this.learnMonsterpediaDescription();

  // project the parameters of the enemy.
  this.learnMonsterpediaParameters();
};

/**
 * Increment the death counter for this particular enemy.
 */
Game_Enemy.prototype.incrementDefeatCount = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // increment the defeat count.
  observations.numberDefeated++;
};

/**
 * Enables the visibility of the enemy's name in the monsterpedia
 * for this monster.
 */
Game_Enemy.prototype.learnMonsterpediaName = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // identify the name of the enemy.
  observations.knowsName = true;
};

/**
 * Enables the visibility of the enemy's family in the monsterpedia
 * for this monster.
 */
Game_Enemy.prototype.learnMonsterpediaFamily = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // deduce the monster family of the enemy.
  observations.knowsFamily = true;
};

/**
 * Enables the visibility of the enemy's description in the monsterpedia
 * for this monster.
 */
Game_Enemy.prototype.learnMonsterpediaDescription = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // discern a description of the enemy.
  observations.knowsDescription = true;
};

/**
 * Enables the visibility of the enemy's parameters in the monsterpedia
 * for this monster.
 */
Game_Enemy.prototype.learnMonsterpediaParameters = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // project the parameters of the enemy.
  observations.knowsParameters = true;
};
//#endregion Game_Enemy