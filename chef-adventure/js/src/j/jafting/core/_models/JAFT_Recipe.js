//region JAFT_Recipe
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
//endregion JAFT_Recipe