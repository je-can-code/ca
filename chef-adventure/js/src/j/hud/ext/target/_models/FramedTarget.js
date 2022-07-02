//#region FramedTarget
/**
 * The shape of a target for the target frame.
 */
class FramedTarget
{
  /**
   * The name of the target.
   * @type {string|String.empty}
   */
  name = String.empty;

  /**
   * The additional text of the target.
   * @type {string|String.empty}
   */
  text = String.empty;

  /**
   * The icon to place on the target.
   * @type {number}
   */
  icon = 0;

  /**
   * The battler data of the target.
   * @type {Game_Enemy|null}
   */
  battler = null;

  /**
   * The configuration of this target.
   * @type {FramedTargetConfiguration|null}
   */
  configuration = null;

  /**
   * Constructor.
   * @param {string|String.empty} name The name of the target.
   * @param {string|String.empty} text The additional text for the target.
   * @param {number} icon The icon to place on this target.
   * @param {Game_Enemy|null} battler The battler data of the target.
   * @param {FramedTargetConfiguration|null} configuration The configuration of this target.
   */
  constructor(name, text = String.empty, icon = 0, battler = null, configuration = null)
  {
    this.name = name;
    this.text = text;
    this.icon = icon;
    this.battler = battler;
    this.configuration = configuration;
  }
}
//#endregion FramedTarget