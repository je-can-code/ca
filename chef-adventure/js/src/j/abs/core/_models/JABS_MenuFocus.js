//region JABS_MenuType
/**
 * The keys of the window focuses that the JABS menu can choose from.
 */
class JABS_MenuType
{
  /**
   * Constructor.
   * Not intended to be used for static classes.
   */
  constructor()
  {
    console.warn(`Attempted to instantiate the JABS_MenuType class.`);
    console.warn(`Please directly use the static properties on it instead of instantiating it.`);
    console.warn(`Consider adding additional static properties if new menu items are being added.`);
    console.trace();
    throw new Error(`JABS_MenuType is a static class that cannot be instantiated.`);
  }

  /**
   * The "main" window is the root window containing the list of subcommands.
   * @type {"main"}
   */
  static Main = "main";

  /**
   * The "skill" window is the list of combat skills that the player can choose from to equip.
   * @type {"skill"}
   */
  static Skill = "skill";

  /**
   * The "tool" window is the list of tools that the player can choose from to equip.
   * @type {"tool"}
   */
  static Tool = "tool";

  /**
   * The "dodge" window is the list of dodge skills that the player can choose from to equip.
   * @type {string}
   */
  static Dodge = "dodge";

  /**
   * The "assign" window is one of multiple types of windows where items or skills are assigned
   * via the concept of "combat skills", "dodge skills", and "tools".
   * @type {string}
   */
  static Assign = "assign"
}
//endregion JABS_MenuType