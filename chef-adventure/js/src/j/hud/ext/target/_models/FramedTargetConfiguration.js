//region FramedTargetConfiguration
/**
 * A configuration object for whether to show/hide various target data points.
 */
class FramedTargetConfiguration
{
  /**
   * Whether or not to show the target's name.
   * @type {boolean}
   */
  showName = true;

  /**
   * Whether or not to show the target's HP.
   * @type {boolean}
   */
  showHp = true;

  /**
   * Whether or not to show the target's MP.
   * @type {boolean}
   */
  showMp = true;

  /**
   * Whether or not to show the target's TP.
   * @type {boolean}
   */
  showTp = true;

  /**
   * Whether or not to show the target text.
   * @type {boolean}
   */
  showText = true;

  /**
   * Constructor.
   * @param {boolean} showName Whether or not to show the name.
   * @param {boolean} showText Whether or not to show the name.
   * @param {boolean} showHp Whether or not to show the name.
   * @param {boolean} showMp Whether or not to show the name.
   * @param {boolean} showTp Whether or not to show the name.
   */
  constructor(
    showName = true,
    showText = true,
    showHp = J.HUD.EXT.TARGET.Metadata.EnableHP,
    showMp = J.HUD.EXT.TARGET.Metadata.EnableMP,
    showTp = J.HUD.EXT.TARGET.Metadata.EnableTP)
  {
    this.showName = showName;
    this.showText = showText;
    this.showHp = showHp;
    this.showMp = showMp;
    this.showTp = showTp;
  }
}
//endregion FramedTargetConfiguration