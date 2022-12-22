//region JAFT_Category
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
//endregion JAFT_Category