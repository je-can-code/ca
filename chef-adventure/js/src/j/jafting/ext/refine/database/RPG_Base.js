J.JAFTING.EXT.REFINE.Aliased.RPG_Base.set('_generate', RPG_Base.prototype._generate);
/**
 * Extends {@link RPG_Base._generate}.
 *
 * Also mirrors additional JAFTING-related values to the new object.
 * @param {RPG_Base} overrides The overriding object.
 * @param {number} index The new index.
 * @returns {this}
 */
RPG_Base.prototype._generate = function(overrides, index)
{
  // perform original logic.
  const original = J.JAFTING.EXT.REFINE.Aliased.RPG_Base.get('_generate').call(this, overrides, index);

  // update the refined count to the latest.
  original.jaftingRefinedCount = overrides.jaftingRefinedCount;

  // return the modificaiton.
  return original;
};