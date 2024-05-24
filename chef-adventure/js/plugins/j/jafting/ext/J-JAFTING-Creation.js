//region CraftCategory_Tracking
/**
 * A data model representing the tracking of a single crafting category key.
 */
function CategoryTracking(key, unlocked, timesCrafted)
{
  this.initialize(...arguments);
}

CategoryTracking.prototype = {};
CategoryTracking.prototype.constructor = CategoryTracking;

/**
 * Initializes a single category tracking.
 * @param {string} key The key of the category tracked.
 * @param {boolean} unlocked Whether or not unlocked.
 * @param {number=} timesCrafted The number of times a recipe with this category key has been crafted before.
 */
CategoryTracking.prototype.initialize = function(key, unlocked, timesCrafted = 0)
{
  /**
   * The key of this category that is being tracked.
   * @type {string}
   */
  this.key = key;

  /**
   * True if the category associated with this key is unlocked,
   * false otherwise.
   * @type {boolean}
   */
  this.unlocked = unlocked;

  /**
   * The number of times a recipe with this category key has been crafted.
   * @type {number}
   */
  this.timesCrafted = 0;
};

/**
 * Checks whether or not this tracked recipe has been unlocked.
 * @return {boolean}
 */
CategoryTracking.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Unlocks this crafting category.<br>
 * It will be available to the player if they have the other requirements met.
 */
CategoryTracking.prototype.unlock = function()
{
  this.unlocked = true;
};

/**
 * Locks this crafting category.<br>
 * It will be hidden from the player, even if they have other requirements met.
 */
CategoryTracking.prototype.lock = function()
{
  this.unlocked = false;
};

CategoryTracking.prototype.craftedCount = function()
{
  return this.timesCrafted;
};
//endregion CraftRecipe_Tracking

//region CraftingCategory
/**
 * Represents the category details for this recipe.
 * A single recipe can live in multiple categories.
 */
class CraftingCategory
{
  //region properties
  /**
   * The name of this crafting category.
   * @type {string}
   */
  name = String.empty;

  /**
   * The unique key of this crafting category.
   * @type {string}
   */
  key = String.empty;

  /**
   * The icon index of this crafting category.
   * @type {number}
   */
  iconIndex = -1;

  /**
   * The description of this crafting category.
   * @type {string}
   */
  description = String.empty;

  /**
   * True this crafting category is unlocked by default, false otherwise.
   */
  unlockedByDefault = false;
  //endregion properties

  /**
   * Constructor.
   */
  constructor(name, key, iconIndex, description, unlockedByDefault)
  {
    this.name = name;
    this.key = key;
    this.iconIndex = iconIndex;
    this.description = description;
    this.unlockedByDefault = unlockedByDefault;
  }

  /**
   * Locks this crafting category.
   */
  lock()
  {
    $gameParty.lockCategory(this.key);
  }

  /**
   * Unlocks this crafting category.
   */
  unlock()
  {
    $gameParty.unlockCategory(this.key);
  }

  /**
   * Checks if the party knows any recipes for this crafting category.
   * @return {boolean}
   */
  hasAnyRecipes()
  {
    return $gameParty.getUnlockedRecipes()
      .some(unlockedRecipe => unlockedRecipe.categoryKeys.includes(this.key), this);
  }
}
//endregion CraftingCategory

//region CraftingComponent
/**
 * A data model for a single component of a recipe in crafting.
 */
class CraftingComponent
{
  static Types =
    {
      Item: 'i',
      Weapon: 'w',
      Armor: 'a',
      Gold: 'g',
      SDP: 's',
    }

  static Typed =
    {
      Gold: () => CraftingComponent.builder
        .id(0)
        .type(CraftingComponent.Types.Gold)
        .build(),
      SDP: () => CraftingComponent.builder
        .id(0)
        .type(CraftingComponent.Types.SDP)
        .build(),
    }

  /**
   * The number of instances required of the given component.
   * @type {number}
   */
  #count = 0;

  /**
   * The id of the given component.
   * @type {number}
   */
  #id = 0;

  /**
   * The type of the given component.
   * @type {String.empty|'i'|'w'|'a'|'g'|'s'}
   */
  #type = String.empty;

  /**
   * Constructor.
   */
  constructor(count, id, type)
  {
    /**
     * How many of this component is required.
     * @type {number}
     */
    this.#count = count;

    /**
     * The id of the underlying component.
     * @type {number}
     */
    this.#id = id;

    /**
     * The type of component this is, such as `i`/`w`/`a`.
     * @type {string}
     */
    this.#type = type;
  }

  /**
   * Sets the count or quantity of this component to a given value.
   * @param {number} count The new value.
   */
  setCount(count)
  {
    this.#count = count;
  }

  /**
   * Gets the underlying item associated with the component.
   *
   *
   * @apinote If the underlying component is gold or SDP points, the object will
   * be of type {@link CraftingComponent}, and also have these properties:
   * <pre>
   * {
   *   name: string,
   *   description: string,
   *   iconIndex: number
   * }
   * </pre>
   * @return {RPG_Item|RPG_Weapon|RPG_Armor|CraftingComponent}
   */
  getItem()
  {
    if (this.isDatabaseEntry())
    {
      return this.#getDatabaseEntry();
    }

    if (this.isGold())
    {
      return this.#getGoldComponent();
    }

    if (this.isSdp())
    {
      return this.#getSdpComponent();
    }

    console.warn("attempted to retrieve an unsupported type; this will probably break.", this);
    return null;
  }

  getComponentType()
  {
    return this.#type;
  }

  isItem()
  {
    return this.#type === CraftingComponent.Types.Item;
  }

  isWeapon()
  {
    return this.#type === CraftingComponent.Types.Weapon;
  }

  isArmor()
  {
    return this.#type === CraftingComponent.Types.Armor;
  }

  /**
   * Checks if the underlying item associated with this component is an entry
   * derived from the RMMZ database.
   * @return {boolean}
   */
  isDatabaseEntry()
  {
    switch (this.#type)
    {
      case CraftingComponent.Types.Item:
      case CraftingComponent.Types.Weapon:
      case CraftingComponent.Types.Armor:
        return true;
      case CraftingComponent.Types.Gold:
      case CraftingComponent.Types.SDP:
        return false;
      default:
        console.error(`unsupported item type found: [${this.#type}]`);
        console.log(this);
        throw new Error("The type of this component is unsupported.");
    }
  }

  /**
   * Gets the underlying component's database data.
   * @return {RPG_Item|RPG_Weapon|RPG_Armor}
   */
  #getDatabaseEntry()
  {
    switch (this.#type)
    {
      case CraftingComponent.Types.Item:
        return $dataItems.at(this.#id);
      case CraftingComponent.Types.Weapon:
        return $dataWeapons.at(this.#id);
      case CraftingComponent.Types.Armor:
        return $dataArmors.at(this.#id);
      default:
        console.warn("attempted to retrieve an unsupported type.", this);
        return null;
    }
  }

  /**
   * Checks if the underlying item associated with the component is just gold.
   * @return {boolean}
   */
  isGold()
  {
    return this.#type === CraftingComponent.Types.Gold;
  }

  /**
   * Gets the precrafted gold component with the correct quantity.
   * @return {CraftingComponent}
   */
  #getGoldComponent()
  {
    const goldComponent = CraftingComponent.Typed.Gold();
    goldComponent.setCount(this.#count);
    return goldComponent;
  }

  /**
   * Checks if the underlying item associated with the component is just SDP points.
   * @return {boolean}
   */
  isSdp()
  {
    return this.#type === CraftingComponent.Types.SDP;
  }

  /**
   * Gets the precrafted SDP component with the correct quantity.
   * @return {CraftingComponent}
   */
  #getSdpComponent()
  {
    const sdpComponent = CraftingComponent.Typed.SDP();
    sdpComponent.setCount(this.#count);
    return sdpComponent;
  }

  /**
   * Gets the name for this component.
   * @return {string}
   */
  getName()
  {
    // check if this is something from the database.
    if (this.isDatabaseEntry())
    {
      // return the database name.
      return this.getItem().name;
    }

    // otherwise, pivot on the type of the component to determine the name.
    switch (this.#type)
    {
      case CraftingComponent.Types.Gold:
        return TextManager.currencyUnit;
      case CraftingComponent.Types.SDP:
        return TextManager.sdpPoints();
    }
  }

  /**
   * Gets the icon index for this component.
   * @return {number}
   */
  getIconIndex()
  {
    // check if this is something from the database.
    if (this.isDatabaseEntry())
    {
      // return the database name.
      return this.getItem().iconIndex;
    }

    // otherwise, pivot on the type of the component to determine the name.
    switch (this.#type)
    {
      case CraftingComponent.Types.Gold:
        return IconManager.rewardParam(1)
      case CraftingComponent.Types.SDP:
        return IconManager.rewardParam(4);
    }
  }

  /**
   * Gets the quantity held by the party of this component.
   * @return {number}
   */
  getHandledQuantity()
  {
    // its from the database, so just fetch the quantity as-usual.
    if (this.isDatabaseEntry()) return $gameParty.numItems(this.getItem());

    // its money, so use the party's held amount.
    if (this.isGold()) return $gameParty.gold();

    // accommodate those using the SDP system as well.
    if (J.JAFTING.EXT.CREATE.Metadata.usingSdp())
    {
      // its SDP, so use the leader's points.
      if (this.isSdp()) return $gameParty.leader().getSdpPoints();
    }

    console.warn('an unsupported component type was presented for quantity.', this);

    // we don't even know what is desired, so lets just say none.
    return 0;
  }

  /**
   * Crafts this particular component based on it's type.
   */
  generate()
  {
    // check if this is a database entry.
    if (this.isDatabaseEntry())
    {
      // add the database item to the party inventory.
      $gameParty.gainItem(this.getItem(), this.#count);
    }

    // check if this is just gold.
    else if (this.isGold())
    {
      // add the money to the running total.
      $gameParty.gainGold(this.#count);
    }

    // check if this is SDP gain.
    else if (this.isSdp())
    {
      // TODO: update this to only apply to the leader?
      // give the points to each member of the party.
      $gameParty.members().forEach(actor => actor.modSdpPoints(this.#count));
    }
  }

  /**
   * Consumes this particular component based on it's type.
   */
  consume()
  {
    // check if this is a database entry.
    if (this.isDatabaseEntry())
    {
      // remove the database item to the party inventory.
      $gameParty.loseItem(this.getItem(), this.#count);
    }

    // check if this is just gold.
    else if (this.isGold())
    {
      // remove the money from the running total.
      $gameParty.loseGold(this.#count);
    }

    // check if this is SDP loss.
    else if (this.isSdp())
    {
      // TODO: update this to only apply to the leader?
      // remove points from each member of the party.
      $gameParty.members().forEach(actor => actor.modSdpPoints(-this.#count));
    }
  }

  /**
   * Gets the count of this component required for the parent recipe.
   * @return {number}
   */
  quantity()
  {
    return this.#count;
  }

  /**
   * Checks if the party has as many of this component as are required.
   * @return {boolean}
   */
  hasEnough()
  {
    // check if this is a database entry.
    if (this.isDatabaseEntry())
    {
      // determine how many the party has of this particular item.
      const count = $gameParty.numItems(this.getItem());

      // if we don't have as many as are required, then we don't have enough.
      return (this.#count <= count);
    }

    // check if this is just gold.
    else if (this.isGold())
    {
      // add the money to the running total.
      return (this.#count <= $gameParty.gold());
    }

    // check if this is SDP gain.
    else if (this.isSdp())
    {
      // TODO: update this to only apply to the leader?
      // give the points to each member of the party.
      return (this.#count <= $gameParty.leader().getSdpPoints());
    }

    // we don't have enough.
    return false;
  }

  /**
   * A builder class for building {@link CraftingComponent}s.
   * @type {JAFT_ComponentBuilder}
   */
  static builder = new class JAFT_ComponentBuilder
  {
    /**
     * The number of instances required of the given component.
     * @type {number}
     */
    #count = 0;

    /**
     * The id of the given component.
     * @type {number}
     */
    #id = 0;

    /**
     * The type of the given component.
     * @type {String.empty|'i'|'w'|'a'|'g'|'s'}
     */
    #type = String.empty;

    build()
    {
      const builtComponent = new CraftingComponent(
        this.#count,
        this.#id,
        this.#type)

      this.#clear();

      return builtComponent;
    }

    #clear()
    {
      this.#count = 0;
      this.#id = 0;
      this.#type = String.empty;
    }

    count(count)
    {
      this.#count = count;
      return this;
    }

    id(id)
    {
      this.#id = id;
      return this;
    }

    type(type)
    {
      this.#type = type;
      return this;
    }
  }
}
//endregion CraftingComponent

//region crafting configuration
/**
 * The configuration model for crafting config data.
 */
class CraftingConfiguration
{
  /**
   * All recipes defined in configuration.
   * @type {CraftingRecipe[]}
   */
  #recipes = [];

  /**
   * All categories defined in configuration.
   * @type {CraftingCategory[]}
   */
  #categories = [];

  /**
   * Constructor.
   */
  constructor(recipes, categories)
  {
    this.#recipes = recipes;
    this.#categories = categories;
  }

  /**
   * Gets the crafting recipes that are currently defined in configuration.
   * @return {CraftingRecipe[]}
   */
  recipes()
  {
    return this.#recipes;
  }

  /**
   * Gets the crafting categories that are currently defined in configuration.
   * @return {CraftingCategory[]}
   */
  categories()
  {
    return this.#categories;
  }

  /**
   * A builder class for fluently constructing new {@link CraftingConfiguration}s.
   * @type {CraftingConfigurationBuilder}
   */
  static builder = new class CraftingConfigurationBuilder
  {
    /**
     * The crafting recipe state for this builder.
     * @type {CraftingRecipe[]}
     */
    #recipes = [];

    /**
     * The crafting category state for this builder.
     * @type {CraftingCategory[]}
     */
    #categories = [];

    /**
     * Build the instance with the provided fluent parameters.
     * @return {CraftingConfiguration}
     */
    build()
    {
      const newConfig = new CraftingConfiguration(
        this.#recipes,
        this.#categories);

      this.#clear();

      return newConfig;
    }

    /**
     * Reverts the state of the builder to an empty builder.
     */
    #clear()
    {
      this.#recipes = [];
      this.#categories = [];
    }

    /**
     * Sets the recipes for the builder.
     * @param {CraftingRecipe[]} recipes The recipes from configuration.
     * @return {CraftingConfigurationBuilder} This builder for fluent-chaining.
     */
    recipes(recipes)
    {
      this.#recipes = recipes;
      return this;
    }

    /**
     * Sets the categories for the builder.
     * @param {CraftingCategory[]} categories The categories from configuration.
     * @return {CraftingConfigurationBuilder} This builder for fluent-chaining.
     */
    categories(categories)
    {
      this.#categories = categories;
      return this;
    }
  }
}
//endregion

//region CraftingRecipe
/**
 * A data model for a single recipe in crafting.
 */
class CraftingRecipe
{
  //region properties
  /**
   * The name of this crafting recipe.
   * @type {string}
   */
  name = String.empty;

  /**
   * The unique key associated with this crafting recipe.
   * @type {string}
   */
  key = String.empty;

  /**
   * The category keys that this crafting recipe belongs to.
   * @type {string[]}
   */
  categoryKeys = [];

  /**
   * The icon that will display in the type selection window next to this category.
   * @type {number}
   */
  iconIndex = -1;

  /**
   * The description of this crafting recipe.
   * @type {string}
   */
  description = String.empty;

  /**
   * The list of required tools not consumed but required to execute the recipe.
   * @type {CraftingComponent[]}
   */
  unlockedByDefault = false;

  /**
   * If true, then the textual details will be masked in the recipe regarding this recipe
   * until it is crafted.
   * @type {boolean}
   */
  maskedUntilCrafted = true;

  /**
   * The components that will be consumed when this recipe is crafted.
   * @type {CraftingComponent[]}
   */
  ingredients = [];

  /**
   * The components that are required to execute this recipe, but are not consumed when crafted.
   * @type {CraftingComponent[]}
   */
  tools = [];

  /**
   * The components that are created upon successful crafting execution of this recipe.
   * @type {CraftingComponent[]}
   */
  outputs = [];
  //endregion

  constructor(
    name,
    key,
    categoryKeys,
    iconIndex,
    description,
    unlockedByDefault,
    maskedUntilCrafted,
    ingredients,
    tools,
    outputs)
  {
    this.name = name;
    this.key = key;
    this.categoryKeys = categoryKeys;
    this.iconIndex = iconIndex;
    this.description = description;
    this.unlockedByDefault = unlockedByDefault;
    this.maskedUntilCrafted = maskedUntilCrafted;
    this.ingredients = ingredients;
    this.tools = tools;
    this.outputs = outputs;
  }

  /**
   * Checks if the party has the required materials to perform the crafting.
   */
  canCraft()
  {
    // check over all ingredients to see if we have enough to craft recipe.
    const hasIngredients = this.ingredients.every(component => component.hasEnough());

    // check over all tools to see if we have them on-hand to craft this recipe.
    const hasTools = this.tools.every(component => component.hasEnough());

    // we can only craft if we have the required ingredients AND tools.
    const canCraft = hasIngredients && hasTools;
    return canCraft;
  }

  /**
   * Executes the crafting of the recipe.<br>
   * This includes consuming the ingredients, generating the outputs, and improving proficiency.
   */
  craft()
  {
    // consume all the inputs.
    this.ingredients.forEach(component => component.consume());

    // generate all the outputs.
    this.outputs.forEach(component => component.generate());

    // improve the proficiency for the recipe.
    $gameParty
      .getRecipeTrackingByKey(this.key)
      .improveProficiency();
  }

  /**
   * Checks if this recipe should have its details masked.
   * @return {boolean}
   */
  needsMasking()
  {
    // if we aren't masked to begin with, then don't mask.
    if (!this.maskedUntilCrafted) return false;

    // check if we've crafted this recipe before.
    const hasCraftedBefore = $gameParty
      .getRecipeTrackingByKey(this.key)
      .hasBeenCrafted();

    // we don't mask after we craft it.
    if (hasCraftedBefore) return false;

    // it should be masked!
    return true;
  }

  /**
   * Gets the crafting proficiency for this recipe.
   * @return {number}
   */
  getProficiency()
  {
    return $gameParty
      .getRecipeTrackingByKey(this.key)
      .craftingProficiency();
  }

  /**
   * Gets the recipe's name.<br>
   * If the name is empty or empty-like, it will use the primary output's instead.
   * @return {string}
   */
  getRecipeName()
  {
    // initialize the name.
    let name = (!this.name.trim().length)
      // use the primary output's name if we didn't define one.
      ? this.getPrimaryOutput().name
      // we defined a name to use.
      : this.name;

    // check if we need masking.
    if (this.needsMasking())
    {
      // mask the name.
      name = name.replace(/[A-Za-z\-!?',.]/ig, "?");
    }

    // return our determination.
    return name;
  }

  /**
   * Gets the recipe's description.<br>
   * If the description is empty or empty-like, it will use the primary output's instead.
   * @return {string}
   */
  getRecipeDescription()
  {
    // initialize the description.
    let description = (!this.description.trim().length)
      // use the primary output's description if we didn't define one.
      ? this.getPrimaryOutput().description
      // we defined a description to use.
      : this.description;

    // check if we need masking.
    if (this.needsMasking())
    {
      // mask the description.
      description = description.replace(/[A-Za-z\-!?',.]/ig, "?");
    }

    // return our determination.
    return description;
  }

  /**
   * Gets the recipe's icon index.<br>
   * If the icon index is set to -1, it will use the primary output's instead.
   * @return {number}
   */
  getRecipeIcon()
  {
    // initialize the icon.
    let iconIndex = (this.iconIndex <= -1)
      // use the primary output's icon if we didn't define one.
      ? this.getPrimaryOutput().iconIndex
      // we defined an icon to use.
      : this.iconIndex;

    // check if we need masking.
    if (this.needsMasking())
    {
      // mask the icon with a question mark icon.
      iconIndex = 93;
    }

    // return our determination.
    return iconIndex;
  }

  /**
   * Gets the underlying item for the primary output of this recipe.
   * @return {RPG_Item|RPG_Weapon|RPG_Armor}
   */
  getPrimaryOutput()
  {
    return this.outputs.at(0)?.getItem();
  }

  /**
   * A debug function for receiving all materials required to craft this recipe.
   */
  getAllComponents()
  {
    this.ingredients.forEach(ingredient => ingredient.generate());
    this.tools.forEach(tool => tool.generate());
  }
}
//endregion CraftingRecipe

//region RecipeTracking
/**
 * A data model representing the tracking of a single crafting recipe key.
 */
function RecipeTracking(recipeKey, unlocked, timesCrafted)
{
  this.initialize(recipeKey, unlocked, timesCrafted);
}

RecipeTracking.prototype = {};
RecipeTracking.prototype.constructor = RecipeTracking;

/**
 * Initializes a single recipe tracking.
 * @param {string} recipeKey The key of the recipe tracked.
 * @param {boolean} unlocked Whether or not unlocked.
 * @param {number=} timesCrafted The number of times this recipe has been crafted before.
 */
RecipeTracking.prototype.initialize = function(recipeKey, unlocked, timesCrafted = 0)
{
  /**
   * The key of this recipe that is being tracked.
   * @type {string}
   */
  this.key = recipeKey;

  /**
   * True if the recipe associated with this key is unlocked,
   * false otherwise.
   * @type {boolean}
   */
  this.unlocked = unlocked;

  /**
   * The number of times a recipe with this key has been crafted.
   * @type {number}
   */
  this.proficiency = timesCrafted;
};

/**
 * Checks whether or not this tracked recipe has been unlocked.
 * @return {boolean}
 */
RecipeTracking.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Unlocks this crafting recipe.<br>
 * It will be available to the player if they have the other requirements met.
 */
RecipeTracking.prototype.unlock = function()
{
  this.unlocked = true;
};

/**
 * Locks this crafting recipe.<br>
 * It will be hidden from the player, even if they have other requirements met.
 */
RecipeTracking.prototype.lock = function()
{
  this.unlocked = false;
};

/**
 * Improves the crafting proficiency for this recipe.
 */
RecipeTracking.prototype.improveProficiency = function(improvement = 1)
{
  this.proficiency += improvement;
}

/**
 * Checks if this recipe has been crafted before.
 * @return {boolean}
 */
RecipeTracking.prototype.hasBeenCrafted = function()
{
  return this.craftingProficiency() > 0;
};

/**
 * Gets how many times this particular recipe has been crafted.
 * @return {number}
 */
RecipeTracking.prototype.craftingProficiency = function()
{
  return this.proficiency;
};
//endregion RecipeTracking

//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 JAFT-Create] An extension for JAFTING to enable recipe creation.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-JAFTING
 * @orderAfter J-Base
 * @orderAfter J-JAFTING
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables the "create" functionality of JAFTING.
 * The "create" functionality is a flexible but straight-forward adaptation of
 * a traditional crafting system.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-JAFTING; the core that this engine hooks into to enable crafting.
 *
 * ============================================================================
 * CRAFTING
 * Ever want to create some items and/or equips? Maybe also separate them into
 * various thematic categories as well? Well now you can! By using the J-MZ
 * Data Editor app, you can easily click your way through category and recipe
 * configuration creation!
 *
 * DETAILS
 * One might ask "how does it work?", and considering the level of complexity
 * that a crafting system typically entails, your question is well-founded.
 * Fortunately, I've boiled down creation to a few things that you need to
 * comprehend in order to get this working. Those things are "recipes" with
 * their "core data" and "component data".
 *
 * WHAT IS A RECIPE?
 * A recipe is a combination of the previously listed "core data" and
 * "component data". These two things together represent a single "recipe", of
 * which is defined by a unique key of your choosing, along with all the rest
 * of the details.
 *
 * CORE DATA
 * The "core data" of a recipe represents mostly a recipe's metadata.
 * - Key
 *  The unique identifier for this recipe.
 *
 * - Icon
 *  The icon index that is displayed next to the recipe in the list.
 *  A -1 informs the system to use the first output's icon index.
 *
 * - Name
 *  The name that is displayed when listing known recipes of a category.
 *  An empty string informs the system to use the first output's name.
 *
 * - Description
 *  The description shown in the help window in the crafting scene.
 *  An empty string informs the system to use the first output's description.
 *
 * - Unlocked By Default
 *  Whether or not the recipe is unlocked without being manually unlocked.
 *
 * - Masked Until Crafted
 *  Whether or not the recipe details are obfuscated with ???s until crafted.
 *
 * - Category Keys
 *  A list of category keys that the recipe belongs to.
 *
 * The above information is important metadata mostly for display purposes
 * within the crafting scene.
 *
 * COMPONENT DATA
 * The "component data" of a recipe represents the requirements for actually
 * crafting a given recipe.
 * - Ingredients
 *  A list of components that are consumed upon recipe creation.
 *
 * - Tools
 *  A list of required-but-not-consumed components for recipe creation.
 *
 * - Output
 *  A list of components that are generated by the recipe's creation.
 *
 * WHAT IS A COMPONENT
 * After understanding the above, you may wonder "well, what is a component?".
 * A "component" in the context of this system is simply a representation of
 * a type of item/weapon/armor (or money/SDP points) and its corresponding
 * quantity. A "component" is effectively a line-item of the given section in
 * a recipe that it lives.
 *
 * ----------------------------------------------------------------------------
 * ABOUT THE RECIPE/CATEGORY CONFIGURATION:
 * It is important to note that this file is REQUIRED if you are using this
 * plugin. The configuration file is just a JSON file that lives in your /data
 * directory with other data files like your maps and database stuff, which
 * means you could hand-write it if you were a masochist, but that is highly
 * prone to error.
 *
 * It is strongly recommended to use the app I built for it.
 *
 * I literally built the app so that I didn't have to use the plugin manager's
 * really clumsy interface for configuring recipes.
 *
 *
 * USING THE DATA EDITOR
 * Obviously it would be difficult to describe this without the ability to use
 * images in here, but consider the following facts:
 *
 * RECIPE:CATEGORY RELATIONSHIP
 * A recipe can belong to as many categories as you desire.
 * If you don't know any of the categories, the player won't have access to
 * the recipe to create in the scene.
 *
 * ABUSING THE HELPERS
 * It is strongly recommended to keep the component and category helper windows
 * up on the side or background to manipulate the various data points in them,
 * and also being able to clone the selected/relevant data into the respective
 * lists that they relate to.
 *
 * DEFAULT RECIPE FIELDS
 * Some of the fields of a recipe can be left blank.
 * When said fields are left blank, they will instead be populated with the
 * first item in the output list.
 * Those fields include:
 * - Name
 * - Description
 * - Icon Index (cannot be blank, set to -1 aka default)
 *
 * UNIQUENESS REQUIREMENTS
 * The Data Editor does not enforce it, but the keys of the list are required
 * to be unique. If you have duplicate keys, the last one found will be the
 * recipe representing the key. I suppose that isn't horrible, but it does seem
 * rather wasteful.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Recipes & Categories can now be updated for existing save files.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 105
 *
 * @param menu-name
 * @parent parentConfig
 * @type string
 * @text Menu Name
 * @desc The name of the command used for JAFTING's Creation.
 * @default Creation
 *
 * @param menu-icon
 * @parent parentConfig
 * @type number
 * @text Menu Icon
 * @desc The icon of the command used for JAFTING's Creation.
 * @default 2565
 *
 *
 * @command call-menu
 * @text Call the Creation Menu
 * @desc Calls the JAFTING Creation scene.
 *
 * @command unlock-categories
 * @text Unlock Categories
 * @desc Unlocks all crafting categories matching the provided keys.
 * @arg categoryKeys
 * @type string[]
 * @text Category Keys
 * @desc All the keys of the categories to be unlocked.
 * @default []
 *
 * @command lock-categories
 * @text Lock Categories
 * @desc Locks all crafting categories matching the provided keys.
 * @arg categoryKeys
 * @type string[]
 * @text Category Keys
 * @desc All of the keys of the categories to be locked.
 * @default []
 *
 * @command unlock-recipes
 * @text Unlock Recipes
 * @desc Unlocks all crafting recipes matching the provided keys.
 * @arg recipeKeys
 * @type string[]
 * @text Recipe Keys
 * @desc All the keys of the recipes to be unlocked.
 * @default []
 *
 * @command lock-recipes
 * @text Lock Recipes
 * @desc Locks all crafting recipes matching the provided keys.
 * @arg recipeKeys
 * @type string[]
 * @text Recipe Keys
 * @desc All of the keys of the recipes to be locked.
 * @default []
 *
 * @command unlock-all-categories
 * @text Unlock All Categories
 * @desc Unlocks all implemented crafting categories.
 *
 * @command lock-all-categories
 * @text Lock All Categories
 * @desc Locks all implemented crafting categories.
 *
 * @command unlock-all-recipes
 * @text Unlock All Recipes
 * @desc Unlocks all implemented crafting recipes.
 *
 * @command lock-all-recipes
 * @text Lock All Recipes
 * @desc Locks all implemented crafting recipes.
 */
//endregion annotations

//region plugin metadata
/**
 * Plugin metadata for the creation JAFTING plugin.<br>
 * Such data includes things like recipes, categories, and connectivity
 * with the SDP system.
 */
class J_CraftingCreatePluginMetadata extends PluginMetadata
{
  /**
   * The path where the config for panels is located.
   * @type {string}
   */
  static CONFIG_PATH = 'data/config.crafting.json';

  /**
   * Classifies the anonymous object from the parsed json into a proper set
   * of recipes and categories.
   * @param parsedJson
   * @return {CraftingConfiguration} The blob with all data converted into proper classes.
   */
  static classify(parsedJson)
  {
    // classify the configuration data.
    const recipes = this.parseRecipes(parsedJson.recipes);
    const categories = this.parseCategories(parsedJson.categories);

    // build the new crafting configuration.
    const config = CraftingConfiguration.builder
      .recipes(recipes)
      .categories(categories)
      .build();

    // return what we made.
    return config;
  }

  /**
   * Converts the JSON-parsed blob into classified {@link CraftingRecipe}s.
   * @param {any} parsedRecipesBlob The already-parsed JSON blob.
   */
  static parseRecipes(parsedRecipesBlob)
  {
    // a mapping function for classifying the components of the recipe.
    const componentMapper = mappableComponent =>
    {
      const { count, id, type } = mappableComponent;
      const newComponent = new CraftingComponent(count, id, type);
      return newComponent;
    };

    // a mapping function for classifying the recipes of the configuration.
    const recipeMapper = mappableRecipe =>
    {
      // parse all components from the recipe.
      const parsedIngredients = mappableRecipe.ingredients.map(componentMapper, this);
      const parsedTools = mappableRecipe.tools.map(componentMapper, this);
      const parsedOutputs = mappableRecipe.outputs.map(componentMapper, this);

      // create the recipe.
      const newJaftingRecipe = new CraftingRecipe(
        mappableRecipe.name,
        mappableRecipe.key,
        mappableRecipe.categoryKeys,
        mappableRecipe.iconIndex,
        mappableRecipe.description,
        mappableRecipe.unlockedByDefault,
        mappableRecipe.maskedUntilCrafted,
        parsedIngredients,
        parsedTools,
        parsedOutputs);

      return newJaftingRecipe;
    };

    /** @type {CraftingRecipe[]} */
    const jaftingRecipes = parsedRecipesBlob.map(recipeMapper, this);

    // return what we made.
    return jaftingRecipes;
  }

  static parseCategories(parsedCategoriesBlob)
  {
    // a maping function for classify the categories of the configuration.
    const categoryMapper = mappableCategory =>
    {
      const { name, key, iconIndex, description, unlockedByDefault } = mappableCategory;
      const newCategory = new CraftingCategory(name, key, iconIndex, description, unlockedByDefault);
      return newCategory
    };

    // iterate over each category to classify the data.
    const jaftingCategories = parsedCategoriesBlob.map(categoryMapper, this);

    // return what we made.
    return jaftingCategories;
  }

  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize the panels from plugin configuration.
    this.initializeConfiguration();

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the SDPs that exist in the SDP configuration.
   */
  initializeConfiguration()
  {
    // parse the files as an actual list of objects from the JSON configuration.
    const parsedJson = JSON.parse(StorageManager.fsReadFile(J_CraftingCreatePluginMetadata.CONFIG_PATH));
    if (parsedJson === null)
    {
      console.error('no crafting configuration was found in the /data directory of the project.');
      console.error('Consider adding configuration using the J-MZ data editor, or hand-writing one.');
      throw new Error('Crafting plugin is being used, but no config file is present.');
    }

    // class-ify over each panel.
    const classifiedCraftingConfig = J_CraftingCreatePluginMetadata.classify(parsedJson);

    /**
     * The collection of all defined jafting recipes.
     * @type {CraftingRecipe[]}
     */
    this.recipes = classifiedCraftingConfig.recipes();

    const recipeMap = new Map();
    this.recipes.forEach(recipe => recipeMap.set(recipe.key, recipe));

    /**
     * A key:recipe map of all defined recipes.
     * @type {Map<string, CraftingRecipe>}
     */
    this.recipesMap = recipeMap;

    /**
     * The collection of all defined jafting categories.
     * @type {CraftingCategory[]}
     */
    this.categories = classifiedCraftingConfig.categories();

    const categoriesMap = new Map();
    this.categories.forEach(category => categoriesMap.set(category.key, category));

    /**
     * A key:category map of all defined categories.
     * @type {Map<string, CraftingCategory>}
     */
    this.categoriesMap = categoriesMap;

    console.log(`loaded:
      - ${this.recipes.length} recipes
      - ${this.categories.length} categories
      from file ${J_CraftingPluginMetadata.CONFIG_PATH}.`);
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible
     * in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);

    /**
     * The name used for the command when visible in a menu.
     * @type {string}
     */
    this.commandName = this.parsedPluginParameters['menu-name'] ?? 'Creation';

    /**
     * The icon used alongside the command's name when visible in the menu.
     * @type {number}
     */
    this.commandIconIndex = parseInt(this.parsedPluginParameters['menu-icon']) ?? 0;
  }

  /**
   * Determine if the SDP system is available for use with this crafting system.
   * @return {boolean}
   */
  usingSdp()
  {
    // if we're not connected, then do not.
    if (!this.#hasSdpConnection()) return false;

    // if we're not high enough version, then do not.
    if (!this.#hasMinimumSdpVersion()) return false;

    // lets do it!
    return true;
  }

  /**
   * Checks if the plugin metadata is detected for the SDP system.
   * @return {boolean}
   */
  #hasSdpConnection()
  {
    // both plugins are not registered.
    if (!PluginMetadata.hasPlugin('J-SDP')) return false;

    // both plugins are registered, nice!
    return true;
  }

  /**
   * Checks if the SDP system meets the minimum version requirement for
   * connecting with this crafting system.
   * @return {boolean}
   */
  #hasMinimumSdpVersion()
  {
    // grab the minimum verison.
    const minimumVersion = this.#minimumSdpVersion();

    // check if we meet the minimum version threshold.
    const meetsThreshold = J.SDP.Metadata.version
      .satisfiesPluginVersion(minimumVersion);

    // if the SDP exists but doesn't meet the threshold, then we're not connecting.
    if (!meetsThreshold) return false;

    // we're good!
    return true;
  }

  /**
   * Gets the current minimum version of the SDP system that
   * this crafting will communicate with.
   * @return {PluginVersion}
   */
  #minimumSdpVersion()
  {
    return PluginVersion.builder
      .major('2')
      .minor('0')
      .patch('0')
      .build();
  }
}
//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all extensions related to the parent.
 */
J.JAFTING.EXT ||= {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.JAFTING.EXT.CREATE = {};

/**
 * The metadata associated with this plugin.
 */
J.JAFTING.EXT.CREATE.Metadata = new J_CraftingCreatePluginMetadata('J-JAFTING-Creation', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.JAFTING.EXT.CREATE.Aliased = {};
J.JAFTING.EXT.CREATE.Aliased.Game_Party = new Map();
J.JAFTING.EXT.CREATE.Aliased.Game_System = new Map();
J.JAFTING.EXT.CREATE.Aliased.Scene_Jafting = new Map();
J.JAFTING.EXT.CREATE.Aliased.Window_JaftingList = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.JAFTING.EXT.CREATE.RegExp = {};
J.JAFTING.EXT.CREATE.RegExp.Points = /<tag:[ ]?(\d+)>/i;
//endregion initialization

//region plugin commands
/**
 * A plugin command.<br>
 * Calls the JAFTING creation menu.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.CREATE.Metadata.name,
  "call-menu",
  () =>
  {
    Scene_JaftingCreate.callScene();
  });

/**
 * A plugin command.<br>
 * Unlocks all categories matching the provided keys.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.CREATE.Metadata.name,
  "unlock-categories",
  args =>
  {
    const {categoryKeys} = args;

    const parsedCategoryKeys = JSON.parse(categoryKeys);
    parsedCategoryKeys.forEach($gameParty.unlockCategory, $gameParty);
  });

/**
 * A plugin command.<br>
 * Unlocks all categories matching the provided keys.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.CREATE.Metadata.name,
  "lock-categories",
  args =>
  {
    const {categoryKeys} = args;

    const parsedCategoryKeys = JSON.parse(categoryKeys);
    parsedCategoryKeys.forEach($gameParty.lockCategory, $gameParty);
  });

/**
 * A plugin command.<br>
 * Unlocks all recipes matching the provided keys.<br>
 * If the owning categories are not unlocked, the recipes won't be accessible.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.CREATE.Metadata.name,
  "unlock-recipes",
  args =>
{
  const {recipeKeys} = args;

  const parsedRecipeKeys = JSON.parse(recipeKeys);
  parsedRecipeKeys.forEach($gameParty.unlockRecipe, $gameParty);
});

/**
 * A plugin command.<br>
 * Unlocks all categories matching the provided keys.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.CREATE.Metadata.name,
  "lock-recipes",
  args =>
  {
    const {recipeKeys} = args;

    const parsedRecipeKeys = JSON.parse(recipeKeys);
    parsedRecipeKeys.forEach($gameParty.lockRecipe, $gameParty);
  });

/**
 * A plugin command.<br>
 * Unlocks all categories.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.CREATE.Metadata.name,
  "unlock-all-categories",
  () =>
  {
    $gameParty.unlockAllCategories();
  });

/**
 * A plugin command.<br>
 * Unlocks all categories.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.CREATE.Metadata.name,
  "lock-all-categories",
  () =>
  {
    $gameParty.lockAllCategories();
  });

/**
 * A plugin command.<br>
 * Unlocks all recipes.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.CREATE.Metadata.name,
  "unlock-all-recipes",
  () =>
  {
    $gameParty.unlockAllRecipes();
  });

/**
 * A plugin command.<br>
 * Unlocks all recipes.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.CREATE.Metadata.name,
  "lock-all-recipes",
  () =>
  {
    $gameParty.lockAllRecipes();
  });
//endregion plugin commands

//region Game_Party
/**
 * Extends {@link #initialize}.<br>
 * Also initializes our jafting members.
 */
J.JAFTING.EXT.CREATE.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.JAFTING.EXT.CREATE.Aliased.Game_Party.get('initialize')
    .call(this);

  // init the members.
  this.initJaftingCreationMembers();

  // populate the trackings.
  this.populateJaftingTrackings();
};

/**
 * Initializes all members of the jafting system.
 */
Game_Party.prototype.initJaftingCreationMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the jafting system.
   */
  this._j._crafting ||= {};

  /**
   * A collection of all recipes being tracked by this party.
   * There should always be one for every recipe imported from the configuration.
   * @type {RecipeTracking[]}
   */
  this._j._crafting._recipeTrackings = [];

  /**
   * A collection of all categories being tracked by this party.
   * There should always be one for every category imported from the configuration.
   * @type {CategoryTracking[]}
   */
  this._j._crafting._categoryTrackings = [];
};

/**
 * Populates all jafting trackings from the current plugin metadata.
 */
Game_Party.prototype.populateJaftingTrackings = function()
{
  // populate the recipes.
  this._j._crafting._recipeTrackings = J.JAFTING.EXT.CREATE.Metadata.recipes
    .map(recipe => new RecipeTracking(recipe.key, recipe.unlockedByDefault));

  // populate the categories.
  this._j._crafting._categoryTrackings = J.JAFTING.EXT.CREATE.Metadata.categories
    .map(category => new CategoryTracking(category.key, category.unlockedByDefault));
};

/**
 * Refreshes all the recipe trackings from the plugin metadata.
 */
Game_Party.prototype.updateRecipesFromConfig = function()
{
  // grab the current list of trackings by reference.
  const trackings = this.getAllRecipeTrackings();

  // iterate over all of the ones defined in the plugin metadata.
  J.JAFTING.EXT.CREATE.Metadata.recipes.forEach(recipe =>
  {
    // skip ones that we shouldn't be adding.
    // NOTE: recipes typically only leverage the key.
    if (!this.canGainEntry(recipe.key)) return;

    // find one by the same key in the existing trackings.
    const foundTracking = trackings.find(tracking => tracking.key === recipe.key);

    // check if we found a tracking.
    if (!foundTracking)
    {
      console.log(`adding new recipe; ${recipe.key}`);
      // we didn't find one, so create and add a new tracking.
      const newTracking = new RecipeTracking(recipe.key, recipe.unlockedByDefault);
      trackings.push(newTracking);
    }
  });
};

Game_Party.prototype.updateCategoriesFromConfig = function()
{
  // grab the current list of trackings by reference.
  const trackings = this.getAllCategoryTrackings();

  // iterate over all of the ones defined in the plugin metadata.
  J.JAFTING.EXT.CREATE.Metadata.categories.forEach(category =>
  {
    // skip ones that we shouldn't be adding.
    // NOTE: categories can leverage both key and name.
    if (!this.canGainEntry(category.key) || !this.canGainEntry(category.name)) return;

    // find one by the same key in the existing trackings.
    const found = trackings.find(tracking => tracking.key === category.key);

    // check if we found a tracking.
    if (!found)
    {
      console.log(`adding new category; ${category.name} : ${category.key}`);
      // we didn't find one, so create and add a new tracking.
      const newTracking = new CategoryTracking(category.key, category.unlockedByDefault);
      trackings.push(newTracking);
    }
  });
};

/**
 * Gets all jafting recipe trackings.
 * @return {RecipeTracking[]}
 */
Game_Party.prototype.getAllRecipeTrackings = function()
{
  return this._j._crafting._recipeTrackings;
};

/**
 * Gets all jafting category trackings.
 * @return {CategoryTracking[]}
 */
Game_Party.prototype.getAllCategoryTrackings = function()
{
  return this._j._crafting._categoryTrackings;
};

/**
 * Gets all recipe trackings that are unlocked.
 * @return {RecipeTracking[]}
 */
Game_Party.prototype.getUnlockedRecipeTrackings = function()
{
  return this.getAllRecipeTrackings()
    .filter(recipe => recipe.isUnlocked());
};

/**
 * Gets all category trackings that are unlocked.
 * @return {CategoryTracking[]}
 */
Game_Party.prototype.getUnlockedCategoryTrackings = function()
{
  return this.getAllCategoryTrackings()
    .filter(category => category.isUnlocked());
};

/**
 * Gets a current list of all jafting recipes that are unlocked.
 * @return {CraftingRecipe[]}
 */
Game_Party.prototype.getUnlockedRecipes = function()
{
  // start our tracking with an empty array.
  const unlockedRecipes = [];

  // iterate over each of the unlocked trackings.
  this.getUnlockedRecipeTrackings()
    .forEach(tracking =>
    {
      // grab the recipe associated with the key.
      const recipe = this.getRecipeByKey(tracking.key);

      // skip unfound keys if we have those somehow.
      if (!recipe) return;

      // add the recipe to the list.
      unlockedRecipes.push(recipe);
    });

  // return what we found.
  return unlockedRecipes;
};

/**
 * Gets a current list of all jafting categories that are unlocked.
 * @return {CraftingCategory[]}
 */
Game_Party.prototype.getUnlockedCategories = function()
{
  // start our tracking with an empty array.
  const unlockedCategories = [];

  // iterate over each of the unlocked trackings.
  this.getUnlockedCategoryTrackings()
    .forEach(tracking =>
    {
      // grab the category associated with the key.
      const category = this.getCategoryByKey(tracking.key);

      // skip unfound keys if we have those somehow.
      if (!category) return;

      // add the category to the list.
      unlockedCategories.push(category);
    });

  // return what we found.
  return unlockedCategories;
};

/**
 * Gets all unlocked recipes that are a part of a given category.
 * @param {string} categoryKey The category to get all unlocked recipes for.
 * @returns {CraftingRecipe[]}
 */
Game_Party.prototype.getUnlockedRecipesByCategory = function(categoryKey)
{
  const recipes = this.getUnlockedRecipes();
  const unlocked = recipes.filter(recipe => recipe.categoryKeys.includes(categoryKey));

  return unlocked;
};

/**
 * Gets all unlocked recipes that are a part of a given category that have
 * also been crafted at least once.
 * @param {string} categoryKey The category to get all unlocked recipes for.
 * @returns {CraftingRecipe[]}
 */
Game_Party.prototype.getCraftedRecipeCountByCategoryKey = function(categoryKey)
{
  // get all unlocked recipes of a given category.
  const unlocked = this.getUnlockedRecipesByCategory(categoryKey);

  if (!unlocked.length) return 0;

  // grab the keys of all the unlocked recipes.
  const keys = unlocked.map(recipe => recipe.key);

  // filter the unlocked recipe trackings to the ones that are relevant and crafted.
  const trackings = this
    .getUnlockedRecipeTrackings()
    .filter(recipe => keys.includes(recipe.key))
    .filter(recipe => recipe.hasBeenCrafted());

  // return what we found.
  return trackings.length;
};

/**
 * Returns a map of all jafting recipes keyed by the recipe's key.
 * @return {Map<string, CraftingRecipe>}
 */
Game_Party.prototype.getAllRecipesAsMap = function()
{
  return J.JAFTING.EXT.CREATE.Metadata.recipesMap;
};

/**
 * Gets the recipe tracking associated with a specific key.
 * @param {string} key The key of the recipe tracking to find.
 * @return {RecipeTracking}
 */
Game_Party.prototype.getRecipeTrackingByKey = function(key)
{
  return this.getAllRecipeTrackings()
    .find(tracked => (tracked.key === key));
};

/**
 * Get a jafting recipe by its key.
 * @param {string} key The key of the recipe to find.
 * @return {CraftingRecipe}
 */
Game_Party.prototype.getRecipeByKey = function(key)
{
  return this.getAllRecipesAsMap()
    .get(key);
};

/**
 * Returns a map of all jafting categories keyed by the category's key.
 * @return {Map<string, CraftingCategory>}
 */
Game_Party.prototype.getAllCategoriesAsMap = function()
{
  return J.JAFTING.EXT.CREATE.Metadata.categoriesMap;
};

/**
 * Get a jafting category by its key.
 * @param {string} key The key of the category to find.
 * @return {CraftingCategory}
 */
Game_Party.prototype.getCategoryByKey = function(key)
{
  return this.getAllCategoriesAsMap()
    .get(key);
};

/**
 * Gets the category tracking associated with a specific key.
 * @param {string} key The key of the category tracking to find.
 * @return {CategoryTracking}
 */
Game_Party.prototype.getCategoryTrackingByKey = function(key)
{
  return this.getAllCategoryTrackings()
    .find(tracked => (tracked.key === key));
};

/**
 * Locks a recipe associated with the given key.
 * @param {string} key The key of the recipe to lock.
 */
Game_Party.prototype.lockRecipe = function(key)
{
  // grab the tracking we're working with.
  const tracking = this.getRecipeTrackingByKey(key);

  // validate there is a tracking.
  if (!tracking)
  {
    // stop processing if there isn't any tracking.
    console.error(`The recipe key of ${key} was not found in the list of recipes to lock.`);
    return;
  }

  // lock the recipe.
  tracking.lock();
};

/**
 * Unlocks a recipe associated with the given key.
 * @param {string} key The key of the recipe to unlock.
 */
Game_Party.prototype.unlockRecipe = function(key)
{
  // grab the tracking we're working with.
  const tracking = this.getRecipeTrackingByKey(key);

  // validate there is a tracking.
  if (!tracking)
  {
    // stop processing if there isn't any tracking.
    console.error(`The recipe key of ${key} was not found in the list of recipes to unlock.`);
    return;
  }

  // unlock the recipe.
  tracking.unlock();
};

/**
 * Locks a category associated with the given key.
 * @param {string} key The key of the category to lock.
 */
Game_Party.prototype.lockCategory = function(key)
{
  // grab the tracking we're working with.
  const tracking = this.getCategoryTrackingByKey(key);

  // validate there is a tracking.
  if (!tracking)
  {
    // stop processing if there isn't any tracking.
    console.error(`The category of ${key} was not found in the list of categorys to lock.`);
    return;
  }

  // lock the recipe.
  tracking.lock();
};

/**
 * Unlocks a category associated with the given key.
 * @param {string} key The key of the category to unlock.
 */
Game_Party.prototype.unlockCategory = function(key)
{
  // grab the tracking we're working with.
  const tracking = this.getCategoryTrackingByKey(key);

  // validate there is a tracking.
  if (!tracking)
  {
    // stop processing if there isn't any tracking.
    console.error(`The category key of ${key} was not found in the list of categories to unlock.`);
    return;
  }

  // unlock the recipe.
  tracking.unlock();
};

/**
 * Unlocks all implemented categories.
 */
Game_Party.prototype.unlockAllCategories = function()
{
  this
    .getAllCategoryTrackings()
    .filter(tracking => this.canGainEntry(tracking.key))
    .forEach(tracking => tracking.unlock());
};

/**
 * Locks all implemented categories.
 */
Game_Party.prototype.lockAllCategories = function()
{
  this
    .getAllCategoryTrackings()
    .forEach(tracking => tracking.lock());
};

/**
 * Unlocks all implemented recipes.
 */
Game_Party.prototype.unlockAllRecipes = function()
{
  this
    .getAllRecipeTrackings()
    .filter(tracking => this.canGainEntry(tracking.key))
    .forEach(tracking => tracking.unlock());
};

/**
 * Locks all implemented recipes.
 */
Game_Party.prototype.lockAllRecipes = function()
{
  this
    .getAllRecipeTrackings()
    .forEach(tracking => tracking.lock());
};

/**
 * Whether or not a named entry should be unlockable.
 * This is mostly for skipping recipe names that are used as dividers in the list.
 * @param {string} name The name of the entry.
 * @return {boolean} True if the entry can be gained, false otherwise.
 */
Game_Party.prototype.canGainEntry = function(name)
{
  // skip entries that are null.
  if (name === null) return false;

  // skip entries with empty names.
  if (name.trim().length === 0) return false;

  // skip entries that start with an underscore (arbitrary).
  if (name.startsWith('_')) return false;

  // skip entries that start with a multiple equals (arbitrary).
  if (name.startsWith('==') || name.startsWith('===')) return false;

  // skip entries that are the "empty" name (arbitrary).
  if (name.includes('-- empty --')) return false;

  // we can gain it!
  return true;
};

/**
 * Adds +1 proficiency to all recipe trackings, revealing them if they were previously masked.
 * This is mostly for debugging purposes.
 */
Game_Party.prototype.revealAllKnownRecipes = function()
{
  this
    .getAllRecipeTrackings()
    .filter(tracking => this.canGainEntry(tracking.key))
    .forEach(tracking => tracking.improveProficiency(1));
};

/**
 * Completely unlocks all recipes and categories and reveals them if they would be otherwise masked.
 * This is mostly for debugging purposes.
 */
Game_Party.prototype.unlockEverythingCompletely = function()
{
  this.unlockAllRecipes();
  this.unlockAllCategories();
  this.revealAllKnownRecipes();
};

Game_Party.prototype.updateVariableWithCraftedCountByCategories = function(variableId, ...categoryKeys)
{
  // initialize with zero crafted entries.
  let count = 0;

  // iterate over each of the category keys.
  categoryKeys.forEach(categoryKey =>
  {
    // add the crafted amount for each category passed.
    count += this.getCraftedRecipeCountByCategoryKey(categoryKey);
  }, this);

  // update the variable requested with the total count.
  $gameVariables.setValue(variableId, count);
};
//endregion Game_Party

//region Game_System
/**
 * Extends {@link #onAfterLoad}.<br>
 * Updates the database with the tracked refined equips.
 */
J.JAFTING.EXT.CREATE.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.JAFTING.EXT.CREATE.Aliased.Game_System.get('onAfterLoad').call(this);

  // update the recipes & categories.
  $gameParty.updateRecipesFromConfig();
  $gameParty.updateCategoriesFromConfig();
};
//endregion Game_System

//region Scene_Jafting
/**
 * Extends {@link #onRootJaftingSelection}.<br>
 * When JAFTING is selected, open the root JAFTING menu.
 */
J.JAFTING.EXT.CREATE.Aliased.Scene_Jafting
  .set('onRootJaftingSelection', Scene_Jafting.prototype.onRootJaftingSelection);
Scene_Jafting.prototype.onRootJaftingSelection = function()
{
  // grab which JAFTING mode was selected.
  const currentSelection = this.getRootJaftingKey();

  // check if the current selection is create.
  if (currentSelection === Scene_JaftingCreate.KEY)
  {
    // execute the monsterpedia.
    this.jaftingCreationSelected();
  }
  // the current selection is not create.
  else
  {
    // possibly activate other choices.
    J.JAFTING.EXT.CREATE.Aliased.Scene_Jafting.get('onRootJaftingSelection').call(this);
  }
};

/**
 * Switch to the jafting creation scene when selected from the root jafting list.
 */
Scene_Jafting.prototype.jaftingCreationSelected = function()
{
  // close the root jafting windows.
  this.closeRootJaftingWindows();

  // call the creation scene.
  Scene_JaftingCreate.callScene();
};
//endregion Scene_Jafting

//region Scene_JaftingCreate
class Scene_JaftingCreate extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  /**
   * The symbol representing the command for this scene from other menus.
   * @type {string}
   */
  static KEY = 'jafting-create';

  /**
   * Constructor.
   */
  constructor()
  {
    // call super when having extended constructors.
    super();

    // jumpstart initialization on creation.
    this.initialize();
  }

  //region init
  /**
   * Initialize the window and all properties required by the scene.
   */
  initialize()
  {
    // perform original logic.
    super.initialize();

    // also initialize our scene properties.
    this.initMembers();
  }

  /**
   * Initialize all properties for our omnipedia.
   */
  initMembers()
  {
    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the monsterpedia members.
    this.initPrimaryMembers();
  }

  /**
   * The core properties of this scene are the root namespace definitions for this plugin.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with the omnipedia.
     */
    this._j._crafting = {};
  }

  /**
   * The primary properties of the scene are the initial properties associated with
   * the main list containing all pedias unlocked by the player along with some subtext of
   * what the pedia entails.
   */
  initPrimaryMembers()
  {
    /**
     * A grouping of all properties associated with the jafting type of creation.
     * Creation is a subcategory of the jafting system.
     */
    this._j._crafting._create = {};

    /**
     * The window that shows the tertiary information about a recipe or category.
     * @type {Window_CreationDescription}
     */
    this._j._crafting._create._creationDescription = null;

    /**
     * The window that shows the list of unlocked categories.
     * @type {Window_CategoryList}
     */
    this._j._crafting._create._categoryList = null;

    /**
     * The window that shows the list of unlocked recipes.
     * @type {Window_RecipeList}
     */
    this._j._crafting._create._recipeList = null;

    /**
     * The window that shows the details of the currently-selected recipe.
     * @type {Window_RecipeDetails}
     */
    this._j._crafting._create._recipeDetails = null;

    /**
     * The window that shows the list of ingredients on the currently selected recipe.
     * @type {Window_RecipeIngredientList}
     */
    this._j._crafting._create._recipeIngredientList = null;

    /**
     * The window that shows the list of tools on the currently selected recipe.
     * @type {Window_RecipeToolList}
     */
    this._j._crafting._create._recipeToolList = null;

    /**
     * The window that shows the list of outputs on the currently selected recipe.
     * @type {Window_RecipeOutputList}
     */
    this._j._crafting._create._recipeOutputList = null;
  }
  //endregion init

  //region create
  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();

    // configure window relations and such now that they are all created.
    this.configureAllWindows();
  }

  /**
   * Creates all windows in this scene.
   */
  createAllWindows()
  {
    // create all the windows.
    this.createCreationDescriptionWindow();
    this.createCategoryListWindow();
    this.createRecipeListWindow();
    this.createRecipeDetailsWindow();
    this.createRecipeIngredientListWindow();
    this.createRecipeToolListWindow();
    this.createRecipeOutputListWindow();
  }

  /**
   * Configures all windows.
   */
  configureAllWindows()
  {
    // also update with the currently selected item, if one exists.
    this.getCreationDescriptionWindow()
      .setText(this.getCategoryListWindow().currentHelpText() ?? String.empty);
  }

  /**
   * Overrides {@link Scene_MenuBase.prototype.createBackground}.<br>
   * Changes the filter to a different type from {@link PIXI.filters}.<br>
   */
  createBackground()
  {
    this._backgroundFilter = new PIXI.filters.AlphaFilter(0.1);
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    //this.setBackgroundOpacity(220);
  }

  /**
   * Overrides {@link #createButtons}.<br>
   * Disables the creation of the buttons.
   * @override
   */
  createButtons()
  {
  }
  //endregion create

  //region creation description
  /**
   * Creates the CreationDescription window.
   */
  createCreationDescriptionWindow()
  {
    // create the window.
    const window = this.buildCreationDescriptionWindow();

    // update the tracker with the new window.
    this.setCreationDescriptionWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildCreationDescriptionWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getCreationDescriptionRectangle();

    // create the window with the rectangle.
    const window = new Window_CreationDescription(rectangle);

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getCreationDescriptionRectangle()
  {
    // grab the rect for the recipe list this should be next to.
    const listWindow = this.getRecipeListRectangle();

    // the description should live at the right side of the list.
    const x = listWindow.width + Graphics.horizontalPadding;

    // the window's origin coordinates are the box window's origin as well.
    const [ _, y ] = Graphics.boxOrigin;

    // define the width of the window.
    const width = Graphics.boxWidth - listWindow.width - Graphics.horizontalPadding;

    // define the height of the window.
    const height = 100;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the CreationDescription window being tracked.
   * @returns {Window_CreationDescription}
   */
  getCreationDescriptionWindow()
  {
    return this._j._crafting._create._creationDescription;
  }

  /**
   * Sets the CreationDescription window tracking.
   */
  setCreationDescriptionWindow(someWindow)
  {
    this._j._crafting._create._creationDescription = someWindow;
  }
  //endregion creation description

  //region category list
  /**
   * Creates the CategoryList window.
   */
  createCategoryListWindow()
  {
    // create the window.
    const window = this.buildCategoryListWindow();

    // update the tracker with the new window.
    this.setCategoryListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildCategoryListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getCategoryListRectangle();

    // create the window with the rectangle.
    const window = new Window_CategoryList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.onCategoryListCancel.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onCategoryListSelection.bind(this));

    // overwrite the onIndexChange hook with our local hook.
    window.onIndexChange = this.onCategoryListIndexChange.bind(this);

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getCategoryListRectangle()
  {
    // the window's origin coordinates are the box window's origin as well.
    const [x, y] = Graphics.boxOrigin;

    // define the width of the window.
    const width = 300;

    // define the height of the window.
    const height = Graphics.boxHeight - (Graphics.verticalPadding * 2);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the CategoryList window being tracked.
   */
  getCategoryListWindow()
  {
    return this._j._crafting._create._categoryList;
  }

  /**
   * Sets the CategoryList window tracking.
   */
  setCategoryListWindow(someWindow)
  {
    this._j._crafting._create._categoryList = someWindow;
  }

  onCategoryListIndexChange()
  {
    const helpText = this.getCategoryListWindow().currentHelpText();

    this.getCreationDescriptionWindow().setText(helpText ?? String.empty);
  }

  onCategoryListCancel()
  {
    // revert to the previous scene.
    SceneManager.pop();
  }

  onCategoryListSelection()
  {
    // grab the category list window we're on.
    const categoryListWindow = this.getCategoryListWindow();

    // the category key is also the symbol of the category commands.
    const currentCategory = categoryListWindow.currentSymbol();

    // grab the recipe list window.
    const recipeListWindow = this.getRecipeListWindow();

    // set the current category to this new category.
    recipeListWindow.setCurrentCategory(currentCategory);

    // switch attention to the recipe list window instead.
    this.deselectCategoryListWindow();
    this.selectRecipeListWindow();

    // also reveal the ingredient list window.
    const ingredientListWindow = this.getRecipeIngredientListWindow();
    ingredientListWindow.show();
    ingredientListWindow.deselect();

    // also reveal the tool list window.
    const toolListWindow = this.getRecipeToolListWindow();
    toolListWindow.show();
    toolListWindow.deselect();

    // also reveal the tool list window.
    const outputListWindow = this.getRecipeOutputListWindow();
    outputListWindow.show();
    outputListWindow.deselect();
  }

  /**
   * Selects the window by revealing and activating it.
   */
  selectCategoryListWindow()
  {
    // grab the window.
    const categoryListWindow = this.getCategoryListWindow();

    // reveal the window.
    categoryListWindow.show();
    categoryListWindow.activate();

    this.getCreationDescriptionWindow()
      .setText(categoryListWindow.currentHelpText());
  }

  /**
   * Deselects the window by hiding and deactivating it.
   */
  deselectCategoryListWindow()
  {
    // grab the window.
    const window = this.getCategoryListWindow();

    // put the window away.
    window.hide();
    window.deactivate();
  }
  //endregion category list

  //region recipe list
  /**
   * Creates the RecipeList window.
   */
  createRecipeListWindow()
  {
    // create the window.
    const window = this.buildRecipeListWindow();

    // update the tracker with the new window.
    this.setRecipeListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildRecipeListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getRecipeListRectangle();

    // create the window with the rectangle.
    const window = new Window_RecipeList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.onRecipeListCancel.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onRecipeListSelection.bind(this));

    // overwrite the onIndexChange hook with our local hook.
    window.onIndexChange = this.onRecipeListIndexChange.bind(this);

    // also put the window away.
    window.hide();
    window.deactivate();

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getRecipeListRectangle()
  {
    // the window's origin coordinates are the box window's origin as well.
    const [x, y] = Graphics.boxOrigin;

    // define the width of the window.
    const width = this.getCategoryListRectangle().width;

    // define the height of the window.
    const height = Graphics.boxHeight - (Graphics.verticalPadding * 2);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the RecipeList window being tracked.
   * @returns {Window_RecipeList}
   */
  getRecipeListWindow()
  {
    return this._j._crafting._create._recipeList;
  }

  /**
   * Sets the RecipeList window tracking.
   * @param recipeList {Window_RecipeList}
   */
  setRecipeListWindow(recipeList)
  {
    this._j._crafting._create._recipeList = recipeList;
  }

  /**
   * Selects the window by revealing and activating it.
   */
  selectRecipeListWindow()
  {
    // grab the window.
    const recipeListWindow = this.getRecipeListWindow();

    // reveal the window.
    recipeListWindow.show();
    recipeListWindow.activate();
    recipeListWindow.onIndexChange();

    // also grab the details.
    const detailsWindow = this.getRecipeDetailsWindow();

    // reveal that window, too.
    detailsWindow.show();

    this.getCreationDescriptionWindow()
      .setText(recipeListWindow.currentHelpText() ?? String.empty);
  }

  /**
   * Deselects the window by hiding and deactivating it.
   */
  deselectRecipeListWindow()
  {
    // grab the window.
    const listWindow = this.getRecipeListWindow();

    // put the window away.
    listWindow.select(0);
    listWindow.hide();
    listWindow.deactivate();

    // hide all those windows.
    this.getRecipeDetailsWindow().hide();
    this.getRecipeIngredientListWindow().hide();
    this.getRecipeToolListWindow().hide();
    this.getRecipeOutputListWindow().hide();
  }

  onRecipeListIndexChange()
  {
    // grab the this list window.
    const recipeListWindow = this.getRecipeListWindow();

    // shorthand the currently-selected recipe.
    /** @type {CraftingRecipe} */
    const currentRecipe = recipeListWindow.currentExt();
    const { ingredients, tools, outputs } = currentRecipe;

    // set the help text to the recipe's description, which is the help text.
    this.getCreationDescriptionWindow()
      .setText(recipeListWindow.currentHelpText() ?? String.empty);

    // grab the details window.
    const detailsWindow = this.getRecipeDetailsWindow();
    detailsWindow.setNeedsMasking(currentRecipe.needsMasking());
    detailsWindow.setCurrentRecipe(recipeListWindow.currentExt());
    detailsWindow.refresh();

    // refresh the ingredients list.
    const ingredientListWindow = this.getRecipeIngredientListWindow();
    ingredientListWindow.setComponents(ingredients);
    ingredientListWindow.refresh();

    // refresh the tools list.
    const toolListWindow = this.getRecipeToolListWindow();
    toolListWindow.setComponents(tools);
    toolListWindow.refresh();

    // refresh the outputs list.
    const outputListWindow = this.getRecipeOutputListWindow();
    outputListWindow.setNeedsMasking(currentRecipe.needsMasking())
    outputListWindow.setComponents(outputs);
    outputListWindow.refresh();
  }

  onRecipeListCancel()
  {
    this.deselectRecipeListWindow();

    this.selectCategoryListWindow();
  }

  onRecipeListSelection()
  {
    // craft the recipe.
    this.craftSelection();

    // refresh all the windows.
    this.onRecipeListIndexChange();

    // redirect to the recipe list again.
    const listWindow = this.getRecipeListWindow();
    listWindow.refresh();
    listWindow.activate();
    console.log('recipe crafted:', listWindow.currentExt());
  }

  craftSelection()
  {
    const currentRecipe = this.getRecipeListWindow().currentExt();

    currentRecipe.craft();

    SoundManager.playShop();
  }
  //endregion recipe list

  //region recipe details
  /**
   * Creates the RecipeDetails window.
   */
  createRecipeDetailsWindow()
  {
    // create the window.
    const window = this.buildRecipeDetailsWindow();

    // update the tracker with the new window.
    this.setRecipeDetailsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildRecipeDetailsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getRecipeDetailsRectangle();

    // create the window with the rectangle.
    const window = new Window_RecipeDetails(rectangle);

    // by default, hide the window.
    window.hide();

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getRecipeDetailsRectangle()
  {
    const widthReduction = this.getRecipeListRectangle().width + Graphics.horizontalPadding;
    const x = 0 + widthReduction;

    const heightReduction = (this.getCreationDescriptionRectangle().height + Graphics.verticalPadding);
    const y = 0 + heightReduction;

    // define the width of the window.
    const width = Graphics.boxWidth - widthReduction;

    // define the height of the window.
    const height = Graphics.boxHeight - heightReduction;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the RecipeDetails window being tracked.
   * @returns {Window_RecipeDetails}
   */
  getRecipeDetailsWindow()
  {
    return this._j._crafting._create._recipeDetails;
  }

  /**
   * Sets the RecipeDetails window tracking.
   */
  setRecipeDetailsWindow(someWindow)
  {
    this._j._crafting._create._recipeDetails = someWindow;
  }
  //endregion recipe details

  //region recipe ingredient list
  /**
   * Creates the RecipeIngredientList window.
   */
  createRecipeIngredientListWindow()
  {
    // create the window.
    const window = this.buildRecipeIngredientListWindow();

    // update the tracker with the new window.
    this.setRecipeIngredientListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildRecipeIngredientListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getRecipeIngredientListRectangle();

    // create the window with the rectangle.
    const window = new Window_RecipeIngredientList(rectangle);

    // just hide and deactivate it.
    window.hide();
    window.deactivate();

    // no command functionality despite being a command window.

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getRecipeIngredientListRectangle()
  {
    // the window's origin coordinates are the box window's origin as well.
    const widthReduction = this.getRecipeListRectangle().right;
    const x = 0 + widthReduction - 20;

    const y = this.getCreationDescriptionRectangle().bottom + 70;

    // define the width of the window.
    const width = 350;

    // define the height of the window.
    const height = Graphics.boxHeight - y - Graphics.verticalPadding;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the RecipeIngredientList window being tracked.
   */
  getRecipeIngredientListWindow()
  {
    return this._j._crafting._create._recipeIngredientList;
  }

  /**
   * Sets the RecipeIngredientList window tracking.
   */
  setRecipeIngredientListWindow(someWindow)
  {
    this._j._crafting._create._recipeIngredientList = someWindow;
  }
  //endregion recipe ingredient list

  //region recipe tool list
  /**
   * Creates the RecipeToolList window.
   */
  createRecipeToolListWindow()
  {
    // create the window.
    const window = this.buildRecipeToolListWindow();

    // update the tracker with the new window.
    this.setRecipeToolListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildRecipeToolListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getRecipeToolListRectangle();

    // create the window with the rectangle.
    const window = new Window_RecipeToolList(rectangle);

    // just hide and deactivate it.
    window.hide();
    window.deactivate();

    // no command functionality despite being a command window.

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getRecipeToolListRectangle()
  {
    // the window's origin coordinates are the box window's origin as well.
    const x = this.getRecipeIngredientListRectangle().right - 20;

    const y = this.getCreationDescriptionRectangle().bottom + 70;

    // define the width of the window.
    const width = 350;

    // define the height of the window.
    const height = Graphics.boxHeight - y - Graphics.verticalPadding;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the RecipeToolList window being tracked.
   * @returns {Window_RecipeToolList}
   */
  getRecipeToolListWindow()
  {
    return this._j._crafting._create._recipeToolList;
  }

  /**
   * Sets the RecipeToolList window tracking.
   */
  setRecipeToolListWindow(someWindow)
  {
    this._j._crafting._create._recipeToolList = someWindow;
  }
  //endregion recipe tool list

  //region recipe output list
  /**
   * Creates the RecipeOutputList window.
   */
  createRecipeOutputListWindow()
  {
    // create the window.
    const window = this.buildRecipeOutputListWindow();

    // update the tracker with the new window.
    this.setRecipeOutputListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildRecipeOutputListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getRecipeOutputListRectangle();

    // create the window with the rectangle.
    const window = new Window_RecipeOutputList(rectangle);

    // just hide and deactivate it.
    window.hide();
    window.deactivate();

    // no command functionality despite being a command window.

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getRecipeOutputListRectangle()
  {
    // the window's origin coordinates are the box window's origin as well.
    const x = this.getRecipeToolListRectangle().right - 20;
    const y = this.getCreationDescriptionRectangle().bottom + 70;

    // define the width of the window.
    const width = 350;

    // define the height of the window.
    const height = Graphics.boxHeight - y - Graphics.verticalPadding;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the RecipeOutputList window being tracked.
   */
  getRecipeOutputListWindow()
  {
    return this._j._crafting._create._recipeOutputList;
  }

  /**
   * Sets the RecipeOutputList window tracking.
   */
  setRecipeOutputListWindow(someWindow)
  {
    this._j._crafting._create._recipeOutputList = someWindow;
  }

  //endregion recipe output list
}
//endregion Scene_JaftingCreate

//region Window_CategoryList
/**
 * A window containing the list of all crafting categories.
 */
class Window_CategoryList extends Window_Command
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Creates the command list of unlocked crafting categories.
   */
  makeCommandList()
  {
    // empty the current list.
    this.clearCommandList();

    // grab all the listings available.
    const commands = this.buildCommands();

    // build all the commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all categories to the list that are unlocked.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all unlocked entries in the list.
    const categories = $gameParty.getUnlockedCategories();

    // compile the list of commands.
    const commands = categories.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the category data.
   * @param {CraftingCategory} category The category data.
   * @returns {BuiltWindowCommand} The built command based on this enemy.
   */
  buildCommand(category)
  {
    // build a command based on the category.
    return new WindowCommandBuilder(category.name)
      .setSymbol(category.key)
      .setExtensionData(category)
      .setIconIndex(category.iconIndex)
      .setHelpText(category.description)
      .setEnabled(category.hasAnyRecipes())
      .build();
  }

  /**
   * Overrides {@link #itemHeight}.<br>
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 2;
  }
}
//endregion Window_CategoryList

//region Window_CreationDescription
class Window_CreationDescription extends Window_Help
{
  constructor(rect)
  {
    super(rect);
  }
}
//endregion Window_CreationDescription

//region Window_JaftingList
/**
 * Extends {@link #buildCommands}.<br>
 * Includes the creation command as well as the rest.
 */
J.JAFTING.EXT.CREATE.Aliased.Window_JaftingList.set('buildCommands', Window_JaftingList.prototype.buildCommands);
Window_JaftingList.prototype.buildCommands = function()
{
  // get the original list of commands.
  const commands = J.JAFTING.EXT.CREATE.Aliased.Window_JaftingList.get('buildCommands').call(this);

  // add the creation command.
  commands.push(this.buildCreationCommand());

  // return the compiled list.
  return commands;
};

/**
 * Builds the jafting creation command for the main jafting types menu.
 * @return {BuiltWindowCommand}
 */
Window_JaftingList.prototype.buildCreationCommand = function()
{
  return new WindowCommandBuilder(J.JAFTING.EXT.CREATE.Metadata.commandName)
    .setSymbol(Scene_JaftingCreate.KEY)
    .setEnabled($gameSwitches.value(J.JAFTING.EXT.CREATE.Metadata.menuSwitchId))
    .addSubTextLine("The crux of creation.")
    .addSubTextLine("Create items and equips from various categories of crafting- as your heart desires.")
    .setIconIndex(J.JAFTING.EXT.CREATE.Metadata.commandIconIndex)
    .build();
};
//endregion Window_JaftingList

//region Window_RecipeDetails
class Window_RecipeDetails extends Window_Base
{
  /**
   * The currently selected recipe being detailed.
   * @type {CraftingRecipe}
   */
  #currentRecipe = null;

  /**
   * True if the text of this list should be masked, false otherwise.
   * @type {boolean}
   */
  needsMasking = false;

  constructor(rect)
  {
    super(rect);
  }

  getCurrentRecipe()
  {
    return this.#currentRecipe;
  }

  setCurrentRecipe(recipe)
  {
    this.#currentRecipe = recipe;
  }

  setNeedsMasking(needsMasking)
  {
    this.needsMasking = needsMasking;
  }

  /**
   * Implements {@link Window_Base.drawContent}.<br>
   * Draws a the recipe details.
   */
  drawContent()
  {
    if (!this.#canDrawContent()) return;

    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // render the ingredients header text.
    const ingredientsX = x;
    const ingredientsY = y;
    this.drawIngredientsHeader(ingredientsX, ingredientsY);

    // render the tools header text.
    const toolsX = x + 330;
    const toolsY = y;
    this.drawToolsHeader(toolsX, toolsY);

    // render the outputs header text.
    const outputsX = x + 660;
    const outputsY = y;
    this.drawOutputsHeader(outputsX, outputsY);

    // render the primary output data.
    const primaryOutputX = x + 990;
    const primaryOutputY = y;
    this.drawPrimaryOutput(primaryOutputX, primaryOutputY);
  }

  /**
   * Determines if the content for this window can be drawn.
   * @return {boolean}
   */
  #canDrawContent()
  {
    // if there is no recipe, then we cannot draw its detail.
    if (this.#currentRecipe == null) return false;

    // we can draw content!
    return true;
  }

  /**
   * Renders the ingredient list header information.
   */
  drawIngredientsHeader(x, y)
  {
    // reset all the font stuff before we start.
    this.resetFontSettings();

    // render the header text.
    this.modFontSize(4);
    this.toggleBold();
    this.drawText('INGREDIENTS', x, y, 300, 'left');
    this.toggleBold();

    // render the subtext.
    this.modFontSize(-12);
    this.toggleItalics();
    const subtext = 'Materials consumed when crafting this recipe.';
    this.drawText(subtext, x, y+20, this.textWidth(subtext), Window_Base.TextAlignments.Left);
    this.toggleItalics();

    this.drawHorizontalLine(x, y+50, 300, 3);
  }

  /**
   * Renders the tool list header information.
   */
  drawToolsHeader(x, y)
  {
    // reset all the font stuff before we start.
    this.resetFontSettings();

    // render the header text.
    this.modFontSize(4);
    this.toggleBold();
    this.drawText('TOOLS', x, y, 300, 'left');
    this.toggleBold();

    // render the subtext.
    this.modFontSize(-12);
    this.toggleItalics();
    const subtext = "Materials required to craft this recipe.";
    this.drawText(subtext, x, y+20, this.textWidth(subtext), Window_Base.TextAlignments.Left);

    this.drawHorizontalLine(x, y+50, 300, 3);
  }

  /**
   * Renders the output list header information.
   */
  drawOutputsHeader(x, y)
  {
    // reset all the font stuff before we start.
    this.resetFontSettings();

    // render the outputs header text.
    this.modFontSize(4);
    this.toggleBold();
    this.drawText('OUTPUTS', x, y, 300, 'left');
    this.toggleBold();

    // render the subtext.
    this.modFontSize(-12);
    this.toggleItalics();
    const subtext = "Materials generated when the recipe is crafted.";
    this.drawText(subtext, x, y+20, this.textWidth(subtext), Window_Base.TextAlignments.Left);

    this.drawHorizontalLine(x, y+50, 300, 3);
  }

  drawPrimaryOutput(x, y)
  {
    // reset all the font stuff before we start.
    this.resetFontSettings();

    // a nice vertical line is appreciated.
    this.drawVerticalLine(x - 20, y, this.innerHeight, 3);

    // shorthand the line height.
    const lh = this.lineHeight();

    const proficiency = `Proficiency: ${this.#currentRecipe.getProficiency()}`;
    this.drawText(proficiency, x, y, 200);

    // grab the component for the primary output of this recipe.
    const primaryOutput = this.#currentRecipe.outputs.at(0);

    switch (primaryOutput.getComponentType())
    {
      case (CraftingComponent.Types.Item):
        this.drawPrimaryOutputItem(x, y);
        break;
      case (CraftingComponent.Types.Weapon):
        this.drawPrimaryOutputWeaponOrArmor(x, y);
        break;
      case (CraftingComponent.Types.Armor):
        this.drawPrimaryOutputWeaponOrArmor(x, y);
        break;
      case (CraftingComponent.Types.Gold):
        this.drawPrimaryOutputGold(x, y);
        break;
      case (CraftingComponent.Types.SDP):
        this.drawPrimaryOutputSdp(x, y);
        break;
    }

    this.drawText('', x, y + (lh * 1), 300);
  }

  //region item output
  drawPrimaryOutputItem(x, y)
  {
    // shorthand the line height.
    const lh = this.lineHeight() - 4;

    // grab the underlying item we're working with.
    const output = this.#currentRecipe.outputs.at(0).getItem();

    const lifeY = y + (lh * 1);
    this.drawLifeMessage(output, x, lifeY);

    const magiY = y + (lh * 2);
    this.drawMagiMessage(output, x, magiY);

    const techY = y + (lh * 3);
    this.drawTechMessage(output, x, techY);

    const revivalY = y + (lh * 5);
    this.drawRevival(output, x, revivalY);

    const statesY = y + (lh * 7);
    this.drawFoodStateChanges(output, x, statesY);
  }

  drawLifeMessage(output, x, y)
  {
    // start from scratch.
    this.resetFontSettings();

    // initialize these for updating later.
    let percentRecovered = 0;
    let flatRecovered = 0;

    // find the first life recovery effect.
    const foundRecovery = output.effects.find(effect => effect.code === Game_Action.EFFECT_RECOVER_HP);

    // check if we found the effect.
    if (foundRecovery)
    {
      percentRecovered = Math.round(foundRecovery.value1 * 100);
      flatRecovered = foundRecovery.value2;
    }

    // initialize the recovery message.
    let recoveryMessage = ``;

    // add the flat recovered amount if there is any.
    if (flatRecovered !== 0) recoveryMessage += `${flatRecovered}`;

    // add the percent recovered amount if there is any.
    if (percentRecovered !== 0) recoveryMessage += ` +${percentRecovered}%`;

    // render the icon for recovery.
    this.drawIcon(IconManager.param(0), x, y);

    // check first if there was no actual recovery.
    if (percentRecovered === 0 && flatRecovered === 0)
    {
      // change the color to the disabled color.
      this.processColorChange(7); // disabled color.

      // default the message to just zero.
      recoveryMessage = `0`;
    }
    // there was recovery.
    else
    {
      // change the color to the parameter color.
      this.processColorChange(21); // life color
    }

    // check if we should be masking instead.
    if (this.needsMasking)
    {
      // mask away.
      recoveryMessage = '??';
    }

    // render the message.
    this.drawText(recoveryMessage.trim(), x + 40, y, 200);
  }

  drawMagiMessage(output, x, y)
  {
    // start from scratch.
    this.resetFontSettings();

    // initialize these for updating later.
    let percentRecovered = 0;
    let flatRecovered = 0;

    // find the first life recovery effect.
    const foundRecovery = output.effects.find(effect => effect.code === Game_Action.EFFECT_RECOVER_MP);

    // check if we found the effect.
    if (foundRecovery)
    {
      percentRecovered = Math.round(foundRecovery.value1 * 100);
      flatRecovered = foundRecovery.value2;
    }

    // initialize the recovery message.
    let recoveryMessage = ``;

    // add the flat recovered amount if there is any.
    if (flatRecovered !== 0) recoveryMessage += `${flatRecovered}`;

    // add the percent recovered amount if there is any.
    if (percentRecovered !== 0) recoveryMessage += ` +${percentRecovered}%`;

    // render the icon for recovery.
    this.drawIcon(IconManager.param(1), x, y);

    // check first if there was no actual recovery.
    if (percentRecovered === 0 && flatRecovered === 0)
    {
      // change the color to the disabled color.
      this.processColorChange(7); // disabled color.

      // default the message to just zero.
      recoveryMessage = `0`;
    }
    // there was recovery.
    else
    {
      // change the color to the parameter color.
      this.processColorChange(23); // life color
    }

    // check if we should be masking instead.
    if (this.needsMasking)
    {
      // mask away.
      recoveryMessage = '??';
    }

    // render the message.
    this.drawText(recoveryMessage.trim(), x + 40, y, 200);
  }

  drawTechMessage(output, x, y)
  {
    // start from scratch.
    this.resetFontSettings();

    // initialize these for updating later.
    let flatRecovered = 0;

    // find the first life recovery effect.
    const foundRecovery = output.effects.find(effect => effect.code === Game_Action.EFFECT_GAIN_TP);

    // check if we found the effect.
    if (foundRecovery) flatRecovered = foundRecovery.value1;

    // initialize the recovery message.
    let recoveryMessage = ``;

    // add the flat recovered amount if there is any.
    if (flatRecovered !== 0) recoveryMessage += `${flatRecovered}`;

    // render the icon for recovery.
    this.drawIcon(IconManager.maxTp(), x, y);

    // check first if there was no actual recovery.
    if (flatRecovered === 0)
    {
      // change the color to the disabled color.
      this.processColorChange(7); // disabled color.

      // default the message to just zero.
      recoveryMessage = `0`;
    }
    // there was recovery.
    else
    {
      // change the color to the parameter color.
      this.processColorChange(29); // life color
    }

    // check if we should be masking instead.
    if (this.needsMasking)
    {
      // mask away.
      recoveryMessage = '??';
    }

    // render the message.
    this.drawText(recoveryMessage, x + 40, y, 200);
  }

  drawRevival(output, x, y)
  {
    // start from scratch.
    this.resetFontSettings();

    // find the first revival effect.
    const revivalEffect = output.effects
      .find(effect =>
        effect.code === Game_Action.EFFECT_REMOVE_STATE &&
        effect.dataId === $gameParty.leader().deathStateId());

    this.drawIcon($dataStates.at(1).iconIndex, x, y);

    let text = revivalEffect
      ? `Revival ${revivalEffect.value1 * 100}%`
      : `Cannot revive.`;

    if (this.needsMasking)
    {
      text = '??';
    }

    const textX = x + 40;
    this.drawText(text, textX, y);
  }

  drawFoodStateChanges(output, x, y)
  {
    // start from scratch.
    this.resetFontSettings();

    // grab all the food-specific state effects.
    const foodStateEffects = output.effects
      .filter(effect =>
        // it has to add one of OUR states.
        effect.code === Game_Action.EFFECT_ADD_STATE &&
        this.#foodStateIds().includes(effect.dataId));

    // shorthand the line height.
    const lh = this.lineHeight() - 4;

    const forEacher = (foodStateEffect, index) =>
    {
      /** @type {RPG_State} */
      const foodState = $dataStates.at(foodStateEffect.dataId);

      const foodStateY = y + (index * lh);
      this.drawIcon(foodState.iconIndex, x, foodStateY);

      const foodStateText = `${foodState.name}`;
      const foodStateNameX = x + 40;
      this.drawText(foodStateText, foodStateNameX, foodStateY, 200);

      const foodStateEffectChance = this.needsMasking
        ? "?"
        : `${foodStateEffect.value1 * 100}%`;

      this.drawText(foodStateEffectChance, foodStateNameX, foodStateY, 160, 'right');
    };

    foodStateEffects.forEach(forEacher, this);
  }

  #foodStateIds()
  {
    return [82, 83, 84, 85, 86, 87, 88];
  }
  //endregion item output

  //region weapon/armor output
  drawPrimaryOutputWeaponOrArmor(x, y)
  {
    // shorthand the line height.
    const lh = this.lineHeight() - 4;

    // grab the underlying weapon we're working with.
    const output = this.#currentRecipe.outputs.at(0).getItem();

    const coreParamsY = y + (lh * 1);
    this.drawCoreParams(output, x, coreParamsY);

    const traitsY = y + (lh * 5);
    this.drawTraits(output, x, traitsY);
  }

  drawCoreParams(output, x, y)
  {
    // start from scratch.
    this.resetFontSettings();

    const leftX = x;
    const rightX = x + 100;

    // shorthand the line height.
    const lh = this.lineHeight() - 4;

    // draw mhp
    const mhpY = y;
    const mhp = this.needsMasking ? '??' : output.params.at(0);
    this.drawIcon(IconManager.param(0), leftX, mhpY);
    this.drawText(mhp, leftX+40, mhpY);

    // draw mmp
    const mmpY = y + (lh * 1);
    const mmp = this.needsMasking ? '??' : output.params.at(1);
    this.drawIcon(IconManager.param(1), leftX, mmpY);
    this.drawText(mmp, leftX+40, mmpY);

    // draw atk
    const atkY = y + (lh * 2);
    const atk = this.needsMasking ? '??' : output.params.at(2);
    this.drawIcon(IconManager.param(2), leftX, atkY);
    this.drawText(atk, leftX+40, atkY);

    // draw def
    const defY = y + (lh * 3);
    const def = this.needsMasking ? '??' : output.params.at(3);
    this.drawIcon(IconManager.param(3), leftX, defY);
    this.drawText(def, leftX+40, defY);

    // draw agi
    const agiY = y;
    const agi = this.needsMasking ? '??' : output.params.at(6);
    this.drawIcon(IconManager.param(6), rightX, agiY);
    this.drawText(agi, rightX+40, agiY);

    // draw def
    const lukY = y + (lh * 1);
    const luk = this.needsMasking ? '??' : output.params.at(7);
    this.drawIcon(IconManager.param(7), rightX, lukY);
    this.drawText(luk, rightX+40, lukY);

    // draw mat
    const matY = y + (lh * 2);
    const mat = this.needsMasking ? '??' : output.params.at(4);
    this.drawIcon(IconManager.param(4), rightX, matY);
    this.drawText(mat, rightX+40, matY);

    // draw mdf
    const mdfY = y + (lh * 3);
    const mdf = this.needsMasking ? '??' : output.params.at(5);
    this.drawIcon(IconManager.param(5), rightX, mdfY);
    this.drawText(mdf, rightX+40, mdfY);
  }

  drawTraits(output, x, y)
  {
    // start from scratch.
    this.resetFontSettings();

    // shorthand the line height.
    const lh = this.lineHeight() - 8;

    const forEacher = (trait, index) =>
    {
      const traitY = y + (lh * index);
      let traitMessage = trait.textNameAndValue();
      if (this.needsMasking)
      {
        traitMessage = traitMessage.replace(/[A-Za-z0-9\-!?',.]/ig, "?");
      }

      this.drawText(traitMessage, x, traitY);
    };

    output.traits.forEach(forEacher, this);
  }
  //endregion weapon/armor output

  //region resource output
  drawPrimaryOutputGold(x, y)
  {
    // shorthand the line height.
    const lh = this.lineHeight() - 4;

    // grab the underlying resource we're working with.
    const output = this.#currentRecipe.outputs.at(0).getItem();

    // render the text.
    this.drawText('Resource:', x, y + (lh * 1), 150);

    const resourceY = y + (lh * 2);
    this.drawIcon(IconManager.rewardParam(1), x, resourceY);
    this.drawText('Gold', x, resourceY, 150);
    this.drawText(`${output.quantity()}`, x, resourceY, 150, Window_Base.TextAlignments.Right);
  }

  drawPrimaryOutputSdp(x, y)
  {
    // shorthand the line height.
    const lh = this.lineHeight() - 4;

    // grab the underlying resource we're working with.
    const output = this.#currentRecipe.outputs.at(0).getItem();

    // render the text.
    this.drawText('Resource:', x, y + (lh * 1), 150);

    const resourceY = y + (lh * 2);
    this.drawIcon(IconManager.rewardParam(4), x, resourceY);
    this.drawText('SDP', x, resourceY, 150);
    this.drawText(output.quantity(), x, resourceY, 150, Window_Base.TextAlignments.Right);
  }
  //endregion resource output
}
//endregion Window_RecipeDetails

//region Window_IngredientList
class Window_RecipeIngredientList extends Window_Command
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);

    // this background is layered ontop of another window, so it should be invisibile.
    this.opacity = 0;
  }

  /**
   * Extends {@link #initialize}.<br>
   * Initializes some additional window properies.
   */
  initialize(rect)
  {
    /**
     * The list of components this window should render.
     * @type {CraftingComponent[]}
     */
    this._components = [];

    super.initialize(rect);
  }

  setComponents(components)
  {
    this._components = components;
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Creates the command list of unlocked crafting categories.
   */
  makeCommandList()
  {
    // empty the current list.
    this.clearCommandList();

    // grab all the listings available.
    const commands = this.buildCommands();

    // build all the commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all categories to the list that are unlocked.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all recipes in the list.
    const components = this._components;

    // compile the list of commands.
    const commands = components.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the component data.
   * @param {CraftingComponent} component The component data.
   * @returns {BuiltWindowCommand} The built command based on this enemy.
   */
  buildCommand(component)
  {
    // determine how many we need vs have on-hand.
    const need = component.quantity();
    const have = component.getHandledQuantity();
    const haveTextColor = (have >= need) ? 24 : 18;
    const needQuantity = `x${need}`;

    const subtexts = [];

    // determine the subtext messages for the command.
    let missingMessage = `(have: ${have})`;
    if (have < need)
    {
      missingMessage += ` (missing: ${(need - have)})`;
    }

    subtexts.push(missingMessage);

    // build a command based on the component.
    return new WindowCommandBuilder(component.getName())
      .setSymbol(`${component.getName()}-${this.index()}`)
      .setExtensionData(component)
      .setIconIndex(component.getIconIndex())
      .setHelpText(component.getName())

      // TODO: when i/w/a rarity is implemented, add it here.
      //.setColorIndex(rarityColorIndex)

      .setRightText(needQuantity)
      .setRightColorIndex(haveTextColor)
      .setSubtextLines(subtexts)
      .build();
  }

  /**
   * Overrides {@link #itemHeight}.<br>
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 1.5;
  }

  /**
   * Overrides {@link #drawBackgroundRect}.<br>
   * Prevents the rendering of the backdrop of each line in the window.
   * @param {Rectangle} _ The rectangle to draw the background for.
   * @override
   */
  drawBackgroundRect(_)
  {
  }
}
//endregion Window_IngredientList

//region Window_RecipeList
/**
 * A window containing the list of all crafting recipes.
 */
class Window_RecipeList extends Window_Command
{
  /**
   * The currently selected category on the category list window.
   * @type {string}
   */
  currentCategory = String.empty;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Sets the current category and updates the list of available recipes.
   * @param {string} newCategory The new jafting category to consider.
   */
  setCurrentCategory(newCategory)
  {
    // set the new category.
    this.currentCategory = newCategory;

    // refresh the command list based on this new category.
    this.refresh();
  }

  /**
   * Gets the current category to filter recipes by.
   * @return {string}
   */
  getCurrentCategory()
  {
    return this.currentCategory;
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Creates the command list of unlocked crafting recipes.
   */
  makeCommandList()
  {
    // empty the current list.
    this.clearCommandList();

    // grab all the listings available.
    const commands = this.buildCommands();

    // build all the commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all recipes to the list that are unlocked.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all unlocked entries in the list.
    const recipes = $gameParty.getUnlockedRecipes();

    // determine the current category selected.
    const currentCategory = this.getCurrentCategory();

    // only include the recipes that belong to the current category.
    const categoryRecipes = recipes
      .filter(recipe => recipe.categoryKeys.includes(currentCategory));

    // compile the list of commands.
    const commands = categoryRecipes.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the recipe data.
   * @param {CraftingRecipe} recipe The recipe data.
   * @returns {BuiltWindowCommand}
   */
  buildCommand(recipe)
  {
    // build a command based on the category.
    return new WindowCommandBuilder(recipe.getRecipeName())
      .setSymbol(recipe.key)
      .setExtensionData(recipe)
      .setHelpText(recipe.getRecipeDescription())
      .setIconIndex(recipe.getRecipeIcon())
      .setEnabled(recipe.canCraft())
      .build();
  }

  /**
   * Overrides {@link #itemHeight}.<br>
   * Makes the command rows smaller so there can be additional recipeeeees.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight();
  }

  /**
   * Overrides {@link #drawBackgroundRect}.<br>
   * Prevents the rendering of the backdrop of each line in the window.
   * @param {Rectangle} _ The rectangle to draw the background for.
   * @override
   */
  drawBackgroundRect(_)
  {
  }
}
//endregion Window_RecipeList

//region Window_RecipeOutputList
class Window_RecipeOutputList extends Window_Command
{
  /**
   * True if the text of this list should be masked, false otherwise.
   * @type {boolean}
   */
  needsMasking = false;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);

    // this background is layered ontop of another window, so it should be invisibile.
    this.opacity = 0;
  }

  /**
   * Extends {@link #initialize}.<br>
   * Initializes some additional window properies.
   */
  initialize(rect)
  {
    /**
     * The list of components this window should render.
     * @type {CraftingComponent[]}
     */
    this._components = [];

    super.initialize(rect);
  }

  setComponents(components)
  {
    this._components = components;
  }

  setNeedsMasking(needsMasking)
  {
    this.needsMasking = needsMasking;
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Creates the command list of unlocked crafting categories.
   */
  makeCommandList()
  {
    // empty the current list.
    this.clearCommandList();

    // grab all the listings available.
    const commands = this.buildCommands();

    // build all the commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all categories to the list that are unlocked.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all recipes in the list.
    const components = this._components;

    // compile the list of commands.
    const commands = components.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the component data.
   * @param {CraftingComponent} component The component data.
   * @returns {BuiltWindowCommand} The built command based on this enemy.
   */
  buildCommand(component)
  {
    // determine how many we need vs have on-hand.
    const have = component.getHandledQuantity();

    // determine the subtext messages for the command.
    let subTextLine = `(have: ${have})`;

    const possiblyMaskedOutput = this.needsMasking
      ? component.getName().replace(/[A-Za-z\-!?',.]/ig, "?")
      : component.getName();

    // build a command based on the component.
    const command = new WindowCommandBuilder(possiblyMaskedOutput)
      .setSymbol(`${component.getName()}-${this.index()}`)
      .setExtensionData(component)
      .setIconIndex(component.getIconIndex())
      .setHelpText(component.getName())
      .setRightText(`+${component.quantity()}`)
      .addSubTextLine(subTextLine)

      // TODO: when i/w/a rarity is implemented, add it here.
      //.setColorIndex(rarityColorIndex)

      .build();

    return command;
  }

  /**
   * Overrides {@link #itemHeight}.<br>
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 1.5;
  }

  /**
   * Overrides {@link #drawBackgroundRect}.<br>
   * Prevents the rendering of the backdrop of each line in the window.
   * @param {Rectangle} _ The rectangle to draw the background for.
   * @override
   */
  drawBackgroundRect(_)
  {
  }
}
//endregion Window_RecipeOutputList

//region Window_RecipeToolList
class Window_RecipeToolList extends Window_Command
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);

    // this background is layered ontop of another window, so it should be invisibile.
    this.opacity = 0;
  }

  /**
   * Extends {@link #initialize}.<br>
   * Initializes some additional window properies.
   */
  initialize(rect)
  {
    /**
     * The list of components this window should render.
     * @type {CraftingComponent[]}
     */
    this._components = [];

    super.initialize(rect);
  }

  setComponents(components)
  {
    this._components = components;
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Creates the command list of unlocked crafting categories.
   */
  makeCommandList()
  {
    // empty the current list.
    this.clearCommandList();

    // grab all the listings available.
    const commands = this.buildCommands();

    // build all the commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all categories to the list that are unlocked.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all recipes in the list.
    const components = this._components;

    // compile the list of commands.
    const commands = components.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the component data.
   * @param {CraftingComponent} component The component data.
   * @returns {BuiltWindowCommand} The built command based on this enemy.
   */
  buildCommand(component)
  {
    // determine how many we need vs have on-hand.
    const need = component.quantity();
    const have = component.getHandledQuantity();
    const haveTextColor = (have >= need) ? 24 : 18;
    const needQuantity = `x${need}`;

    const subtexts = [];

    // determine the subtext messages for the command.
    let missingMessage = `(have: ${have})`;
    if (have < need)
    {
      missingMessage += ` (missing: ${(need - have)})`;
    }

    subtexts.push(missingMessage);

    // build a command based on the component.
    return new WindowCommandBuilder(component.getName())
      .setSymbol(`${component.getName()}-${this.index()}`)
      .setExtensionData(component)
      .setIconIndex(component.getIconIndex())
      .setHelpText(component.getName())

      // TODO: when i/w/a rarity is implemented, add it here.
      //.setColorIndex(rarityColorIndex)

      .setRightText(needQuantity)
      .setRightColorIndex(haveTextColor)
      .setSubtextLines(subtexts)
      .build();
  }

  /**
   * Overrides {@link #itemHeight}.<br>
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 1.5;
  }

  /**
   * Overrides {@link #drawBackgroundRect}.<br>
   * Prevents the rendering of the backdrop of each line in the window.
   * @param {Rectangle} _ The rectangle to draw the background for.
   * @override
   */
  drawBackgroundRect(_)
  {
  }
}
//endregion Window_RecipeToolList