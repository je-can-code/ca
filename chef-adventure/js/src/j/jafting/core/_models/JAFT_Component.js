//region JAFT_Component
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
//endregion JAFT_Component