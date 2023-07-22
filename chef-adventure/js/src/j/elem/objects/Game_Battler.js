//region Game_Battler
/**
 * Determines whether or not a given element id is absorbed by this battler.
 * @param {number} elementId The element id.
 * @returns {boolean}
 */
Game_Battler.prototype.isElementAbsorbed = function(elementId)
{
  return this.elementsAbsorbed().includes(elementId);
};

/**
 * Determines whether or not a given element id can affect this battler in the
 * context of "strict" elements. If the target has no strict elements, then this
 * will automatically return true. Otherwise, it'll check elements.
 * @param {number} elementId The element id.
 * @returns {boolean}
 */
Game_Battler.prototype.isElementStrict = function(elementId)
{
  const strict = this.strictElements();

  // if we don't have any strict elements on this battler
  if (!strict.length)
  {
    // then strictness doesn't apply.
    return true;
  }

  // otherwise, check the strict elements to see if we have a match.
  return strict.includes(elementId);
};

/**
 * Gets all elements this battler absorbs.
 * @returns {number[]}
 */
Game_Battler.prototype.elementsAbsorbed = function()
{
  return [];
};

/**
 * Gets all absorbed element ids from a given object on this battler.
 *
 * @todo Potentially lift this to J.BASE.Helpers
 * @param {RPG_BaseItem} referenceData The database data object.
 * @returns {number[]}
 */
Game_Battler.prototype.extractAbsorbedElements = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const lines = referenceData.note.split(/[\r\n]+/);
  const structure = /<absorbElements:[ ]?(\[\d+,?[ ]?\d*?])>/i;
  const elements = [];
  lines.forEach(line =>
  {
    if (line.match(structure))
    {
      const data = JSON.parse(RegExp.$1);
      elements.push(...data);
    }
  });

  return elements;
};

/**
 * Gets the strict elements for this battler, if any.
 * "Strict" elements are the only elements this battler can be affected by.
 *
 * If none are found, the default is all elements (to negate this feature).
 * @returns {number[]}
 */
Game_Battler.prototype.strictElements = function()
{
  return $dataSystem.elements.map((_, index) => index);
};

/**
 * Gets the strict element ids from a given object on this battler.
 *
 * @todo Potentially lift this to J.BASE.Helpers
 * @param {RPG_BaseItem} referenceData The database data object.
 * @returns {number[]}
 */
Game_Battler.prototype.extractStrictElements = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const lines = referenceData.note.split(/[\r\n]+/);
  const structure = /<strictElements:[ ]?(\[\d+,?[ ]?\d*?])>/i;
  const elements = [];
  lines.forEach(line =>
  {
    if (line.match(structure))
    {
      const data = JSON.parse(RegExp.$1);
      elements.push(...data);
    }
  });

  return elements;
};

/**
 * Gets the element rate boost for this element for this battler.
 * @param {number} elementId The element id to check.
 */
Game_Battler.prototype.elementRateBoost = function(elementId)
{
  return 1;
};

/**
 * Gets the element boosts associated with the provided element id.
 * @param {RPG_BaseItem} referenceData The reference data with a note to parse.
 * @returns {[number, number][]}
 */
Game_Battler.prototype.extractElementRateBoosts = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const lines = referenceData.note.split(/[\r\n]+/);
  const structure = /<boostElements:(\d+):(-?\+?[\d]+)>/i;
  const boostedElements = [];

  // get all the boosts first.
  lines.forEach(line =>
  {
    if (line.match(structure))
    {
      const id = parseInt(RegExp.$1);
      const boost = parseInt(RegExp.$2);
      boostedElements.push([id, boost]);
    }
  });

  return boostedElements;
};
//endregion Game_Battler