//region Window_MoreData
/**
 * A window designed to display "more" data.
 * "More" data is typically defined as parameters not found otherwise listed
 * in the screens these lists usually reside in.
 */
class Window_MoreData extends Window_Command
{
  /**
   * The various types supported by "more data" functionality.
   */
  static Types = {
    /** The weapon type. */
    Weapon: "Weapon",

    /** The armor type. */
    Armor: "Armor",

    /** The skill type. */
    Skill: "Skill",

    /** The item type. */
    Item: "Item",

    /** Unknown type, if somehow some other type found its way in there. */
    Unknown: "Unknown",
  };

  /**
   * @constructor
   * @param {Rectangle} rect A rectangle that represents the shape of this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
    this.refresh();
  }

  /**
   * Initializes all properties of this method.
   */
  initMembers()
  {
    /**
     * The item we're displaying more data for.
     * @type {RPG_EquipItem|RPG_UsableItem|null}
     */
    this.item = null;

    /**
     * The type of item we're displaying in the more data window.
     * @type {string}
     */
    this.type = null;

    /**
     * The actor used to perform parameter calculations against.
     * @type {Game_Actor}
     */
    this.actor = null;
  }

  /**
   * Sets an item to this window to display more data for.
   * @param {RPG_BaseItem} newItem The item to set for this window.
   */
  setItem(newItem)
  {
    this.item = newItem;
    this.refresh();
  }

  /**
   * Sets the actor of this window for performing parameter calculations against.
   * @param {Game_Actor} newActor The new actor.
   */
  setActor(newActor)
  {
    this.actor = newActor;
    this.refresh();
  }

  /**
   * Refreshes this window by clearing it and redrawing all its contents.
   */
  refresh()
  {
    super.refresh();
    if (this.item)
    {
      this.determineItemType();
    }
  }

  /**
   * Updates the type of item this is.
   */
  determineItemType()
  {
    switch (true)
    {
      case DataManager.isItem(this.item):
        this.type = Window_MoreData.Types.Item;
        break;
      case DataManager.isSkill(this.item):
        this.type = Window_MoreData.Types.Skill;
        break;
      case DataManager.isArmor(this.item):
        this.type = Window_MoreData.Types.Armor;
        break;
      case DataManager.isWeapon(this.item):
        this.type = Window_MoreData.Types.Weapon;
        break;
      default:
        this.type = Window_MoreData.Types.Unknown;
        console.warn('was provided an unknown item type to display more data for.', this.item);
        break;
    }
  }

  /**
   * Determines whether or not the selected row is a weapon or not.
   * @returns {boolean} True if this is a weapon, false otherwise.
   */
  weaponSelected()
  {
    return this.type === Window_MoreData.Types.Weapon;
  }

  /**
   * Determines whether or not the selected row is an armor or not.
   * @returns {boolean} True if this is an armor, false otherwise.
   */
  armorSelected()
  {
    return this.type === Window_MoreData.Types.Armor;
  }

  /**
   * Determines whether or not the selected row is an item or not.
   * @returns {boolean} True if this is an item, false otherwise.
   */
  itemSelected()
  {
    return this.type === Window_MoreData.Types.Item;
  }

  /**
   * Determines whether or not the selected row is a skill or not.
   * @returns {boolean} True if this is a skill, false otherwise.
   */
  skillSelected()
  {
    return this.type === Window_MoreData.Types.Skill;
  }

  /**
   * Creates a command list for this menu.
   */
  makeCommandList()
  {
    if (this.item)
    {
      // this.addCommand(`More ${this.type} Data`, null, true, null, 2568, 1);
      // this.addCommand(`${this.item.name}`, null, true, null, this.item.iconIndex, 0);
      this.adjustWindowHeight();
    }
  }

  /**
   * Readjusts the height of the command window to match the number of commands.
   */
  adjustWindowHeight()
  {
    const magicHeight = 800;
    const calculatedHeight = (this._list.length + 1) * (this.lineHeight() + 8) - 16;
    if (calculatedHeight >= magicHeight)
    {
      this.height = magicHeight;
    }
    else
    {
      this.height = calculatedHeight;
    }
  }
}
//endregion Window_MoreData