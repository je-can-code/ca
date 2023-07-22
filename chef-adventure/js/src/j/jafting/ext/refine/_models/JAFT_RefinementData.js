//region JAFT_RefinementData
/**
 * A class containing all the various data points extracted from notes.
 */
class JAFTING_RefinementData
{
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta)
  {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
    this.refinedCount = 0;
    this.maxRefineCount = this.getMaxRefineCount();
    this.maxTraitCount = this.getMaxTraitCount();
    this.notRefinementMaterial = this.isNotMaterial();
    this.notRefinementBase = this.isNotBase();
    this.unrefinable = this.isNotRefinable();
  }

  /**
   * The number of times this piece of equipment can be refined.
   * @returns {number}
   */
  getMaxRefineCount()
  {
    let count = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MaxRefineCount])
    {
      count = parseInt(this._meta[J.BASE.Notetags.MaxRefineCount]) || count;
    }
    else
    {
      const structure = /<maxRefineCount:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          count = parseInt(RegExp.$1);
        }
      })
    }

    return count;
  }

  /**
   * The number of transferable traits that this piece of equipment can have at any one time.
   * @returns {number}
   */
  getMaxTraitCount()
  {
    let count = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MaxRefineTraits])
    {
      count = parseInt(this._meta[J.BASE.Notetags.MaxRefineTraits]) || count;
    }
    else
    {
      const structure = /<maxRefinedTraits:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          count = parseInt(RegExp.$1);
        }
      })
    }

    return count;
  }

  /**
   * Gets whether or not this piece of equipment can be used in refinement as a material.
   * @returns {boolean}
   */
  isNotMaterial()
  {
    let notMaterial = false;
    if (this._meta && this._meta[J.BASE.Notetags.NotRefinementMaterial])
    {
      notMaterial = true;
    }
    else
    {
      const structure = /<notRefinementMaterial>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          notMaterial = true;
        }
      })
    }

    return notMaterial;
  }

  /**
   * Gets whether or not this piece of equipment can be used in refinement as a base.
   * @returns {boolean}
   */
  isNotBase()
  {
    let notBase = false;
    if (this._meta && this._meta[J.BASE.Notetags.NotRefinementBase])
    {
      notBase = true;
    }
    else
    {
      const structure = /<notRefinementBase>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          notBase = true;
        }
      })
    }

    return notBase;
  }

  /**
   * Gets whether or not this piece of equipment can be used in refinement.
   * If this is true, this will mean this cannot be used in refinement as base or material.
   * @returns
   */
  isNotRefinable()
  {
    let noRefine = false;
    if (this._meta && this._meta[J.BASE.Notetags.NoRefinement])
    {
      noRefine = true;
    }
    else
    {
      const structure = /<noRefine>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          noRefine = true;
        }
      })
    }

    return noRefine;
  }
}
//endregion JAFT_RefinementData