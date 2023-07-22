//region Game_Enemy
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
J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.set('onDeath', Game_Enemy.prototype.onDeath);
Game_Enemy.prototype.onDeath = function()
{
  // perform original logic.
  J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.get('onDeath').call(this);

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

/**
 * Extends {@link #makeDropItems}.
 * Also observes each drop dropped for monsterpedia purposes.
 */
J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.set('makeDropItems', Game_Enemy.prototype.makeDropItems);
Game_Enemy.prototype.makeDropItems = function()
{
  // perform original logic to retrieve original drops.
  const drops = J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.get('makeDropItems').call(this);

  // validate we have drops.
  if (drops.length)
  {
    // observe the drops.
    drops.forEach(this.observeDrop, this);
  }

  // return all earned loot!
  return drops;
};

/**
 * Observes a given drop, and records it in the monsterpedia if applicable.
 * @param {RPG_Item|RPG_Weapon|RPG_Armor} drop The drop to observe.
 */
Game_Enemy.prototype.observeDrop = function(drop)
{
  // grab the observations of this monster.
  const observations = this.getMonsterPediaObservations();

  // extract the drop data.
  const { kind: dropType, id: dropId } = drop;

  // don't process the drop if its already known.
  if (observations.isDropKnown(dropType, dropId)) return;

  // observe the drop.
  observations.addKnownDrop(dropType, dropId);
};

/**
 * Observes a given element, and records it in the monsterpedia if applicable.
 * @param {number} elementId The element id to observe.
 */
Game_Enemy.prototype.observeElement = function(elementId)
{
  // grab the observations of this monster.
  const observations = this.getMonsterPediaObservations();

  // don't process the element if its already known.
  if (observations.isElementalisticKnown(elementId)) return;

  // observe the element.
  observations.addKnownElementalistic(elementId);
};
//endregion Game_Enemy