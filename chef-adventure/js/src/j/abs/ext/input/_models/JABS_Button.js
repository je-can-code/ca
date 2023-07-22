//region JABS_Button
/**
 * A static class containing all input keys available for JABS.
 */
class JABS_Button
{
  //region functionality
  /**
   * The "start" key.
   * Used for bringing up the JABS menu on the map.
   * @type {string}
   */
  static Menu = "Menu";

  /**
   * The "select" key.
   * Used for party-cycling.
   * @type {string}
   */
  static Select = "Select";
  //endregion functionality

  //region primary
  /**
   * The "main", "A" button, or "Z" key.
   * Used for executing the mainhand action.
   * @type {string}
   */
  static Mainhand = "Main";

  /**
   * The "offhand", "B" button, or "X" key.
   * Used for executing the offhand action.
   * @type {string}
   */
  static Offhand = "Offhand";

  /**
   * The "tool", "Y" button, or "C" key.
   * Used for executing the currently selected tool skill.
   * @type {string}
   */
  static Tool = "Tool";

  /**
   * The "dodge", "R2" button, or "Tab" key.
   * Used for executing the currently selected dodge skill.
   * @type {string}
   */
  static Dodge = "Dodge";
  //endregion primary

  //region mobility
  /**
   * The "strafe", "L2" button, or "Left Ctrl" key.
   * Used for locking the direction faced while the input is held.
   * @type {string}
   */
  static Strafe = "Strafe";

  /**
   * The "rotate", "R1" button, or "W" and "E" key(s).
   * Used for locking in-place while the input is held.
   * @type {string}
   */
  static Rotate = "Rotate";

  /**
   * The "guard", "R1" button, or "W", and "E" key(s).
   * Used for activating the guard function while the input is held.
   * @type {string}
   */
  static Guard = "Guard";
  //endregion mobility

  //region L1 + buttons
  /**
   * The `L1 + A` or 1 key.
   * Executes combat skill 1.
   * @type {string}
   */
  static CombatSkill1 = "CombatSkill1";

  /**
   * The `L1 + B` or 2 key.
   * Executes combat skill 2.
   * @type {string}
   */
  static CombatSkill2 = "CombatSkill2";

  /**
   * The `L1 + X` or 3 key.
   * Executes combat skill 3.
   * @type {string}
   */
  static CombatSkill3 = "CombatSkill3";

  /**
   * The `L1 + Y` or 4 key.
   * Executes combat skill 4.
   * @type {string}
   */
  static CombatSkill4 = "CombatSkill4";
  //endregion  L1 + buttons

  /**
   * Gets all assignable buttons used for JABS.
   * @returns {string[]} A collection of JABS-input keys' identifiers.
   */
  static assignableInputs()
  {
    // the valid set of assignable inputs.
    const okInputs = [
      // primary
      this.Mainhand,
      this.Offhand,
      this.Tool,
      this.Dodge,

      // L1 + buttons
      this.CombatSkill1,
      this.CombatSkill2,
      this.CombatSkill3,
      this.CombatSkill4,
    ];

    // a filter function for ensuring only the correct inputs are accepted.
    const filtering = buttonInput => !okInputs.includes(buttonInput);

    // return the filtered buttons.
    return this.allButtons().filter(filtering);
  }

  /**
   * Gets all currently available buttons used for JABS.
   * @returns {string[]} A collection of JABS-input key's identifiers.
   */
  static allButtons()
  {
    return [
      // functionality
      this.Menu,
      this.Select,

      // primary
      this.Mainhand,
      this.Offhand,
      this.Tool,
      this.Dodge,

      // mobility
      this.Strafe,
      this.Rotate,
      this.Guard,

      // L1 + buttons
      this.CombatSkill1,
      this.CombatSkill2,
      this.CombatSkill3,
      this.CombatSkill4,
    ];
  }
}
//endregion JABS_Button