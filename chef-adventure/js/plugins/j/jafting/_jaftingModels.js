/*:
 * @target MZ
 * @plugindesc
 * [v2.0 JAFT] The various custom models created for JAFTING.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-JAFTING
 * @orderBefore J-JAFTING
 * @orderBefore J-JAFTING-Refinement
 * @help
 * ============================================================================
 * A component of the JAFTING system.
 * This is a cluster of all models that honestly deserved their own file, but
 * that is mighty inconvenient for plugin consumers, so now its all in one.
 * ============================================================================
 */

//#region JAFT_Category
/**
 * Represents the category details for this recipe.
 * A single recipe can live in multiple categories.
 */
function JAFTING_Category()
{
  this.initialize(...arguments);
}

JAFTING_Category.prototype = {};
JAFTING_Category.prototype.constructor = JAFTING_Category;
JAFTING_Category.prototype.initialize = function(name, key, iconIndex, description)
{
  /**
   * The name of this crafting category.
   * @type {string}
   */
  this.name = name;

  /**
   * The unique key of this crafting category.
   * @type {string}
   */
  this.key = key;

  /**
   * The icon that will display in the type selection window next to this category.
   * @type {number}
   */
  this.iconIndex = iconIndex;

  /**
   * The description that shows up in the help window.
   * @type {string}
   */
  this.description = description;
  this.initMembers();
};

/**
 * Initializes all members in this class with defaults.
 */
JAFTING_Category.prototype.initMembers = function()
{
  /**
   * Whether or not this category is unlocked.
   * @type {boolean}
   */
  this.unlocked = false;
};

/**
 * Gets whether or not this JAFTING category is unlocked.
 * @returns {boolean}
 */
JAFTING_Category.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Locks this JAFTING category.
 */
JAFTING_Category.prototype.lock = function()
{
  this.unlocked = false;
};

/**
 * Unlocks this JAFTING category.
 */
JAFTING_Category.prototype.unlock = function()
{
  this.unlocked = true;
};
//#endregion JAFT_Category

//#region JAFT_Component
/**
 * A single instance of a particular crafting component, such as an ingredient/tool/output,
 * for use in JAFTING.
 */
function JAFTING_Component()
{
  this.initialize(...arguments);
}

JAFTING_Component.prototype = {};
JAFTING_Component.prototype.constructor = JAFTING_Component;
JAFTING_Component.prototype.initialize = function(id, type, count, isTool)
{
  /**
   * The id of the underlying component.
   * @type {number}
   */
  this.id = id;

  /**
   * The type of component this is, such as `i`/`w`/`a`.
   * @type {string}
   */
  this.type = type;

  /**
   * How many of this component is required.
   * @type {number}
   */
  this.count = count;

  /**
   * Whether or not this component is a non-consumable tool that is required
   * to perform crafting for particular recipes.
   * @type {boolean}
   */
  this.isTool = isTool;
};

/**
 * Gets the underlying RPG:Item that this component represents.
 */
JAFTING_Component.prototype.getItem = function()
{
  switch (this.type)
  {
    case `i`:
      return $dataItems[this.id];
    case `w`:
      return $dataWeapons[this.id];
    case `a`:
      return $dataArmors[this.id];
    default:
      console.error("attempted to craft an invalid item.");
      console.log(this);
      throw new Error("The output's type of a recipe was invalid. Check your recipes' output types again.");
  }
};

/**
 * Crafts this particular component based on it's type.
 */
JAFTING_Component.prototype.craft = function()
{
  $gameParty.gainItem(this.getItem(), this.count);
};

/**
 * Consumes this particular component based on it's type.
 */
JAFTING_Component.prototype.consume = function()
{
  $gameParty.loseItem(this.getItem(), this.count);
};
//#endregion JAFT_Component

//#region JAFT_Recipe
/**
 * The data that makes up what defines a crafting recipe for use with JAFTING.
 */
function JAFTING_Recipe()
{
  this.initialize(...arguments);
}

JAFTING_Recipe.prototype = {};
JAFTING_Recipe.prototype.constructor = JAFTING_Recipe;
JAFTING_Recipe.prototype.initialize = function(
  name, key, description, categories, iconIndex, tools, ingredients, output, masked
)
{
  /**
   * The name of this crafting recipe.
   * @type {string}
   */
  this.name = name;

  /**
   * The unique key associated with this crafting recipe.
   * @type {string}
   */
  this.key = key;

  /**
   * The description of this crafting recipe.
   * @type {string}
   */
  this.description = description;

  /**
   * The category keys that this crafting recipe belongs to.
   * @type {string[]}
   */
  this.categories = categories;

  /**
   * The icon that will display in the type selection window next to this category.
   * @type {number}
   */
  this.iconIndex = iconIndex;

  /**
   * The list of required tools not consumed but required to execute the recipe.
   * @type {JAFTING_Component[]}
   */
  this.tools = tools;

  /**
   * The list of ingredients that make up this recipe that will be consumed.
   * @type {JAFTING_Component[]}
   */
  this.ingredients = ingredients;

  /**
   * The list of `JAFTING_Component`s that would be generated when this recipe is successfully crafted.
   * @type {JAFTING_Component[]}
   */
  this.output = output;

  /**
   * Whether or not this recipe is masked by default until crafted the first time.
   * Masked recipes show up as all question marks in place of their name.
   * @type {boolean}
   */
  this.maskedUntilCrafted = masked;
  this.initMembers();
};

/**
 * Initializes all members that do not require parameters for this class.
 */
JAFTING_Recipe.prototype.initMembers = function()
{
  /**
   * Whether or not this recipe has been unlocked for JAFTING.
   * @type {boolean}
   */
  this.unlocked = false;

  /**
   * Whether or not this recipe has been JAFTED before.
   * @type {boolean}
   */
  this.crafted = false;
};

/**
 * Gets whether or not this JAFTING recipe has been unlocked or not.
 * @returns {boolean}
 */
JAFTING_Recipe.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Locks this JAFTING recipe.
 */
JAFTING_Recipe.prototype.lock = function()
{
  this.unlocked = false;
};

/**
 * Unlocks this JAFTING recipe. Does not unlock the category this recipe belongs to.
 */
JAFTING_Recipe.prototype.unlock = function()
{
  this.unlocked = true;
};

/**
 * Creates all output of this JAFTING recipe and marks the recipe as "crafted".
 */
JAFTING_Recipe.prototype.craft = function()
{
  this.output.forEach(component => component.craft());
  this.ingredients.forEach(component => component.consume());
  this.setCrafted();
};

/**
 * Gets whether or not this recipe is craftable based on the ingredients and tools on-hand.
 * @returns {boolean}
 */
JAFTING_Recipe.prototype.canCraft = function()
{
  let hasIngredients = true;
  let hasTools = true;

  // check over all ingredients to see if we have enough to JAFT this recipe.
  this.ingredients.forEach(component =>
  {
    const count = $gameParty.numItems(component.getItem());
    if (component.count > count)
    {
      hasIngredients = false;
    }
  });

  // check over all tools to see if we have them on-hand to JAFT this recipe.
  this.tools.forEach(component =>
  {
    const count = $gameParty.numItems(component.getItem());
    if (component.count > count)
    {
      hasTools = false;
    }
  });

  return hasIngredients && hasTools;
};

/**
 * Gets whether or not this recipe has been crafted before.
 * @returns {boolean}
 */
JAFTING_Recipe.prototype.hasBeenCrafted = function()
{
  return this.crafted;
};

/**
 * Sets this recipe to a "crafted" state.
 * @param {boolean} crafted Whether or not this item has been crafted.
 */
JAFTING_Recipe.prototype.setCrafted = function(crafted = true)
{
  this.crafted = crafted;
};

/**
 * Gets the primary output of this recipe.
 * Primary output is defined as the first item in the list of all output
 * that this recipe creates.
 * @returns {any}
 */
JAFTING_Recipe.prototype.getPrimaryOutput = function()
{
  return this.output[0].getItem();
};

/**
 * Gets the name of this recipe.
 * If none was specified, then the primary output's name will be used.
 * @returns {string}
 */
JAFTING_Recipe.prototype.getRecipeName = function()
{
  let name = "";
  if (!this.name.length)
  {
    const primaryOutput = this.getPrimaryOutput();
    name = primaryOutput.name;
  }
  else
  {
    name = this.name;
  }

  if (this.maskedUntilCrafted && !this.crafted)
  {
    name = name.replace(/[A-Za-z\-!?',.]/ig, "?");
  }

  return name;
};

/**
 * Gets the icon index of this recipe.
 * If none was specified, then the primary output's icon index will be used.
 * @returns {number}
 */
JAFTING_Recipe.prototype.getRecipeIconIndex = function()
{
  if (this.iconIndex === -1)
  {
    const primaryOutput = this.getPrimaryOutput();
    return primaryOutput.iconIndex;
  }
  else
  {
    return this.iconIndex;
  }
};

/**
 * Gets the description of this recipe.
 * If none was specified, then the primary output's description will be used.
 * @returns {string}
 */
JAFTING_Recipe.prototype.getRecipeDescription = function()
{
  let description = "";
  if (!this.description.length)
  {
    const primaryOutput = this.getPrimaryOutput();
    description = primaryOutput.description;
  }
  else
  {
    description = this.description;
  }

  if (this.maskedUntilCrafted && !this.crafted)
  {
    description = description.replace(/[A-Za-z\-!?',.]/ig, "?");
  }

  return description;
};
//#endregion JAFT_Recipe

//#region JAFT_RefinementData
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
  };

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
      const structure = /<maxRefine:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          count = parseInt(RegExp.$1);
        }
      })
    }

    return count;
  };

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
  };

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
  };

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
  };

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
  };
}
//#endregion JAFT_RefinementData

//ENDOFFILE