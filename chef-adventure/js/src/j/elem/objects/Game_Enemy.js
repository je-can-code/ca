//region Game_Enemy
/**
 * Modifies the element rate to accommodate elemental absorption tags on an actor.
 */
J.ELEM.Aliased.Game_Enemy.set("elementRate", Game_Enemy.prototype.elementRate);
Game_Enemy.prototype.elementRate = function(elementId)
{
  const baseRate = J.ELEM.Aliased.Game_Enemy.get("elementRate").call(this, elementId);

  const isAbsorbed = this.isElementAbsorbed(elementId) ? -1 : 1;
  return baseRate * isAbsorbed;
};

/**
 * Gets all elements this enemy absorbs.
 * @returns {number[]}
 */
Game_Enemy.prototype.elementsAbsorbed = function()
{
  const objectsToCheck = this.getAllNotes();
  const absorbed = [];
  objectsToCheck.forEach(referenceData =>
  {
    const elementsFromObject = this.extractAbsorbedElements(referenceData);
    absorbed.push(...elementsFromObject);
  });

  return absorbed;
};

/**
 * Gets the only elements this enemy can be affected by.
 * @returns {number[]}
 */
Game_Enemy.prototype.strictElements = function()
{
  const objectsToCheck = this.getAllNotes();
  const strict = [];
  objectsToCheck.forEach(referenceData =>
  {
    const elementsFromObject = this.extractStrictElements(referenceData);
    strict.push(...elementsFromObject);
  });

  // if there were no "strict" elements found, then add all elements to
  // pass the "strict" check.
  if (!strict.length)
  {
    strict.push(...Game_Battler.prototype.strictElements.call(this));
  }

  return strict;
};

/**
 * Gets the element rate boost for this element for this enemy.
 * @param {number} elementId The element id to check.
 * @returns {number}
 */
Game_Enemy.prototype.elementRateBoost = function(elementId)
{
  const objectsToCheck = this.getAllNotes();
  const boosts = [];
  objectsToCheck.forEach(referenceData =>
  {
    const boost = this.extractElementRateBoosts(referenceData);
    if (!boost.length) return;

    boosts.push(...boost);
  });

  const filteredBoosts = boosts.filter(boost =>
  {
    return boost[0] === elementId;
  });
  const factoredBoosts = filteredBoosts.map(boost => boost[1] / 100);
  const boostAmount = factoredBoosts.reduce((previousAmount, nextAmount) => previousAmount + nextAmount, 1);
  return boostAmount;
};

//endregion Game_Enemy