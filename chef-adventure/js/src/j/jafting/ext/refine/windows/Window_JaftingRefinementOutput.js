//region Window_JaftingRefinementOutput
/**
 * The window containing the chosen equips for refinement and also the projected results.
 */
class Window_JaftingRefinementOutput
  extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
    this.opacity = 220;
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The primary equip that is the refinement target.
     * Traits from the secondary equip will be transfered to this equip.
     * @type {RPG_EquipItem}
     */
    this._primaryEquip = null;

    /**
     * The secondary equip that is the refinement material.
     * The transferable traits on this equip will be transfered to the target.
     * @type {RPG_EquipItem}
     */
    this._secondaryEquip = null;

    /**
     * The output of what would be the result from refining these items.
     * @type {RPG_EquipItem}
     */
    this._resultingEquip = null;
  }

  /**
   * Gets the primary equip selected, aka the refinement target.
   * @returns {RPG_EquipItem}
   */
  get primaryEquip()
  {
    return this._primaryEquip;
  }

  /**
   * Sets the primary equip selected, aka the refinement target.
   * @param {RPG_EquipItem} equip The equip to set as the target.
   */
  set primaryEquip(equip)
  {
    this._primaryEquip = equip;
    this.refresh();
  }

  /**
   * Gets the secondary equip selected, aka the refinement material.
   * @returns {RPG_EquipItem}
   */
  get secondaryEquip()
  {
    return this._secondaryEquip;
  }

  /**
   * Sets the secondary equip selected, aka the refinement material.
   * @param {RPG_EquipItem} equip The equip to set as the material.
   */
  set secondaryEquip(equip)
  {
    this._secondaryEquip = equip;
    this.refresh();
  }

  /**
   * Gets the resulting equip from the output.
   */
  get outputEquip()
  {
    return this._resultingEquip;
  }

  /**
   * Sets the resulting equip to the output to allow for the scene to grab the data.
   * @param {RPG_EquipItem} equip The equip to set.
   */
  set outputEquip(equip)
  {
    this._resultingEquip = equip;
  }

  lineHeight()
  {
    return 32;
  }

  refresh()
  {
    // redraw all the contents.
    this.contents.clear();
    this.drawContent();
  }

  /**
   * Draws all content in this window.
   */
  drawContent()
  {
    // if we don't have anything in the target slot, do not draw anything.
    if (!this.primaryEquip) return;

    this.drawRefinementTarget();
    this.drawRefinementMaterial();
    this.drawRefinementResult();
  }

  /**
   * Draws the primary equip that is being used as a base for refinement.
   * Will draw whatever is being hovered over if nothing is selected.
   */
  drawRefinementTarget()
  {
    this.drawEquip(this.primaryEquip, 0, "base");
  }

  /**
   * Draws the secondary equip that is being used as a material for refinement.
   * Will draw whatever is being hovered over if nothing is selected.
   */
  drawRefinementMaterial()
  {
    if (!this.secondaryEquip) return;

    this.drawEquip(this.secondaryEquip, 350, "material");
  }

  /**
   * Draws one column of a piece of equip and it's traits.
   * @param {RPG_EquipItem} equip The equip to draw details for.
   * @param {number} x The `x` coordinate to start drawing at.
   * @param {string} type Which column this is.
   */
  drawEquip(equip, x, type)
  {
    if (type === "output")
    {
      console.log();
    }
    const parsedTraits = $gameJAFTING.parseTraits(equip);
    const jaftingTraits = $gameJAFTING.combineBaseParameterTraits(parsedTraits);
    this.drawEquipTitle(equip, x, type);
    this.drawEquipTraits(jaftingTraits, x);
  }

  /**
   * Draws the title for this portion of the equip details.
   * @param {RPG_EquipItem} equip The equip to draw details for.
   * @param {number} x The `x` coordinate to start drawing at.
   * @param {string} type Which column this is.
   */
  drawEquipTitle(equip, x, type)
  {
    const lh = this.lineHeight();
    const cw = 300;
    switch (type)
    {
      case "base":
        this.drawTextEx(`\\PX[16]${J.JAFTING.EXT.REFINE.Messages.TitleBase}`, x + (cw * 0), lh * 0, 200);
        break;
      case "material":
        this.drawTextEx(`\\PX[16]${J.JAFTING.EXT.REFINE.Messages.TitleMaterial}`, x + (cw * 1), lh * 0, 200);
        break;
      case "output":
        this.drawTextEx(`\\PX[16]${J.JAFTING.EXT.REFINE.Messages.TitleOutput}`, x + (cw * 2), lh * 0, 200);
        break;
    }

    if (type === "output")
    {
      if (equip.jaftingRefinedCount === 0)
      {
        this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${equip.name} +1\\C[0]`, x, lh * 1, 200);
      }
      else
      {
        const suffix = `+${equip.jaftingRefinedCount + 1}`;
        const index = equip.name.lastIndexOf("+");
        if (index > -1)
        {
          // if we found a +, then strip it out and add the suffix to it.
          const name = `${equip.name.slice(0, index)}${suffix}`;
          this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${name}\\C[0]`, x, lh * 1, 200);
        }
        else
        {
          // in cases where a refined equip is being used as a material for a never-before refined
          // equip, then there won't be any string manipulation for it's name.
          const name = `${equip.name} ${suffix}`;
          this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${name}\\C[0]`, x, lh * 1, 200);
        }
      }
    }
    else
    {
      this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${equip.name}\\C[0]`, x, lh * 1, 200);
    }
  }

  /**
   * Draws all transferable traits on this piece of equipment.
   * @param {RPG_Trait[]} traits A list of transferable traits.
   * @param {number} x The `x` coordinate to start drawing at.
   */
  drawEquipTraits(traits, x)
  {
    const lh = this.lineHeight();
    if (!traits.length)
    {
      this.drawTextEx(`${J.JAFTING.EXT.REFINE.Messages.NoTransferableTraits}`, x, lh * 2, 250);
      return;
    }

    traits.sort((a, b) => a._code - b._code);

    traits.forEach((trait, index) =>
    {
      const y = (lh * 2) + (index * lh);
      this.drawTextEx(`${trait.nameAndValue}`, x, y, 250);
    });
  }

  /**
   * Draws the projected refinement result of fusing the material into the base.
   */
  drawRefinementResult()
  {
    // don't try to draw the result if the player hasn't made it to the material yet.
    if (!this.primaryEquip || !this.secondaryEquip) return;

    // produce the potential result if confirmed.
    const result = $gameJAFTING.determineRefinementOutput(this.primaryEquip, this.secondaryEquip);

    // render the projected merge results.
    this.drawEquip(result, 700, "output");

    // assign it for ease of retrieving from the scene.
    this.outputEquip = result;
  }

}
//endregion Window_JaftingRefinementOutput