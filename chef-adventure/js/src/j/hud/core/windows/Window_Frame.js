//region Window_Frame
/**
 * A base class with some common sprite-cache-management features.
 */
class Window_Frame extends Window_Base
{
  /**
   * Constructor.
   * @param {Rectangle} rect The shape of this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Initializes the properties of this class.
   * @param {Rectangle} rect The rectangle representing this window.
   */
  initialize(rect)
  {
    // perform original logic.
    super.initialize(rect);

    // add our extra data points to track.
    this.initMembers();

    // run any one-time configuration changes.
    this.configure();
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    /**
     * The over-arching object that contains all properties for this plugin.
     */
    this._j ||= {};

    /* eslint-disable max-len */
    /**
     * The cached collection of sprites.
     * @type {Map<string, Sprite_Icon|Sprite_BaseText|Sprite_SkillCost|Sprite_CooldownGauge|Sprite_ActorValue|Sprite_MapGauge|Sprite_Gauge|Sprite_FlowingGauge|Sprite_Face|Sprite>}
     */
    this._j._spriteCache = new Map();
    /* eslint-enable max-len */
  }

  /**
   * Executes any one-time configuration required for this window.
   */
  configure()
  {
    // build the image cache for the first time.
    this.refreshCache();
  }

  //region caching
  /**
   * Empties and recreates the entire cache of sprites.
   */
  refreshCache()
  {
    // destroy and empty all sprites within the cache.
    this.emptyCache();

    // recreate all sprites for the cache.
    this.createCache();
  }

  /**
   * Empties the cache of all sprites.
   */
  emptyCache()
  {
    // iterate over each sprite and destroy it properly.
    this._j._spriteCache.forEach((value, _) => value.destroy());

    // empty the collection of all references.
    this._j._spriteCache.clear();
  }

  /**
   * Empties and recreates the entire cache of sprites.
   */
  createCache()
  {
    // fill with sprite creation methods.
  }
  //endregion caching

  /**
   * Hooks into the update loop to include updating for this frame.
   */
  update()
  {
    // perform original logic.
    super.update();

    // update this frame.
    this.updateFrame();
  }

  /**
   * Updates the logic for this window frame.
   */
  updateFrame()
  {
    // fill with window frame logic.
  }
}
//endregion Window_Frame