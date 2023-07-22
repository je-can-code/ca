//region BossFrameManager
class BossFrameManager
{
  //region properties
  /**
   * The boss in the frame.
   * @type {FramedTarget|null}
   */
  static boss = null;

  /**
   * Whether or not we have a new boss to refresh for.
   * @type {boolean}
   */
  static #newBossRequest = false;

  /**
   * Whether or not we have a request to hide the boss frame.
   * @type {boolean}
   */
  static #hideBossRequest = false;

  /**
   * Whether or not we have a request to show the boss frame.
   * @type {boolean}
   */
  static #showBossRequest = false;
  //endregion properties

  /**
   * Gets the current boss.
   * @returns {FramedTarget|null}
   */
  static getBossFrame()
  {
    return this.boss;
  }

  /**
   * Sets the current boss to the given target.
   * @param {FramedTarget} boss The given target.
   */
  static setBossFrame(boss)
  {
    // update the boss.
    this.boss = boss;

    // request a refresh.
    this.requestBossFrameRefresh();
  }

  /**
   * Sets the current boss to the data that resides within a given event
   * by its eventId.
   * @param {number} eventId The id of the event to set the boss to.
   */
  static setBossByEventId(eventId)
  {
    // build the boss framedTarget by the eventId.
    const bossTarget = this.#createBossFrameFromEventId(eventId);

    // set the boss.
    this.setBossFrame(bossTarget);
  }

  //region boss checking
  /**
   * Get the {@link Game_Battler} associated with this boss.
   * @returns {Game_Battler|null}
   */
  static getBossGameBattler()
  {
    if (!this.boss) return null;

    return this.boss.battler;
  }

  /**
   * Get the {@link JABS_Battler} associated with this boss.
   * @returns {JABS_Battler|null}
   */
  static getBossJabsBattler()
  {
    // if there is no boss, then there is no jabs battler.
    if (!this.boss) return null;

    // grab the underlying battler.
    const gameBattler = this.getBossGameBattler();

    // return the matching JABS battler.
    return JABS_AiManager.getBattlerByUuid(gameBattler.getUuid());
  }

  /**
   * Gets the boss's current percent of health.
   * @returns {number}
   */
  static getBossHpPercent()
  {
    if (!this.boss) return 0;

    return this.getBossGameBattler().currentHpPercent100();
  }

  /**
   * Determines whether or not the boss is above a given hp percent threshold.
   * @param {number} hpPercentThreshold The amount to check if the boss is inclusively above.
   * @returns {boolean} True if the boss is above the given amount, false otherwise.
   */
  static isBossAboveHpThreshold(hpPercentThreshold)
  {
    // if there is no boss, then default to false.
    if (!this.boss) return false;

    // determine if the boss is above the threshold.
    const aboveThreshold = this.getBossGameBattler().currentHpPercent100() >= hpPercentThreshold;

    // return the result.
    return aboveThreshold;
  }

  /**
   * Determines whether or not the boss is below a given hp percent threshold.
   * @param {number} hpPercentThreshold The amount to check if the boss is inclusively below.
   * @returns {boolean} True if the boss is below the given amount, false otherwise.
   */
  static isBossBelowHpThreshold(hpPercentThreshold)
  {
    // if there is no boss, then default to false.
    if (!this.boss) return false;

    // determine if the boss is below the threshold.
    const aboveThreshold = this.getBossGameBattler().currentHpPercent100() <= hpPercentThreshold;

    // return the result.
    return aboveThreshold;
  }

  /**
   * Determines whether or not the boss is between two given hp percents.
   * @param {number} lowerRange The lowest inclusive hp percent allowed.
   * @param {number} upperRange The highest inclusive hp percent allowed.
   * @returns {boolean} True if the boss is within the range, false otherwise.
   */
  static isBossWithinHpRange(lowerRange, upperRange)
  {
    // if there is no boss, then default to false.
    if (!this.boss) return false;

    // check where the battler's currently is at.
    const hpPercent = this.getBossGameBattler().currentHpPercent100();

    // determine if the boss is within the threshold.
    const withinThreshold = lowerRange <= hpPercent <= upperRange;

    // return the result.
    return withinThreshold;
  }
  //endregion boss checking

  //region refresh
  /**
   * Whether or not the boss frame requires a refresh.
   * @returns {boolean}
   */
  static needsBossFrameRefresh()
  {
    return this.#newBossRequest;
  }

  /**
   * Requests the boss frame to be refreshed.
   */
  static requestBossFrameRefresh()
  {
    this.#newBossRequest = true;
  }

  /**
   * Acknowledges the refresh request for the boss frame.
   */
  static acknowledgeBossFrameRefresh()
  {
    this.#newBossRequest = false;
  }
  //endregion refresh

  //region hide
  /**
   * Whether or not the boss frame requires hiding.
   * @returns {boolean}
   */
  static needsBossFrameHiding()
  {
    return this.#hideBossRequest;
  }

  /**
   * Requests the boss frame to be concealed.
   */
  static requestHideBossFrame()
  {
    this.#hideBossRequest = true;
  }

  /**
   * Acknowledges the request for the boss frame to be concealed.
   */
  static acknowledgeBossFrameHidden()
  {
    this.#hideBossRequest = false;
  }
  //endregion hide

  //region show
  /**
   * Whether or not the boss frame requires showing.
   * @returns {boolean}
   */
  static needsBossFrameShowing()
  {
    return this.#showBossRequest;
  }

  /**
   * Requests the boss frame to be revealed.
   */
  static requestShowBossFrame()
  {
    this.#showBossRequest = true;
  }

  /**
   * Acknowledges the request for the boss frame to be revealed.
   */
  static acknowledgeBossFrameShown()
  {
    this.#showBossRequest = false;
  }
  //endregion show

  //region privates
  /**
   * Creates a {@link FramedTarget} based on the data that resides in the event
   * of the given eventId.
   * @param {number} eventId The event id to generate a boss from.
   * @returns {FramedTarget}
   */
  static #createBossFrameFromEventId(eventId)
  {
    // validate we can create a boss from this event.
    if (!this.#canCreateBossFrameFromEventId(eventId))
    {
      console.error(`could not create a boss from event of id: [ ${eventId} ].`);
      throw new Error('Failed to create boss for boss frame.');
    }

    // grab the battler for the event.
    const bossJabsBattler = $gameMap.event(eventId).getJabsBattler();

    // grab the battler from the jabs battler.
    const bossBattler = bossJabsBattler.getBattler();

    // generate the target configuration- default is fine for now.
    const framedTargetConfiguration = new FramedTargetConfiguration();

    // build the boss's framed target.
    const framedTarget = new FramedTarget(
      bossBattler.name(),
      String.empty,
      14,
      bossBattler,
      framedTargetConfiguration);

    // return the built target.
    return framedTarget;
  }

  /**
   * Determines whether or not we can build a boss from the given eventId.
   * @param {number} eventId The id of the event to build a boss from.
   * @returns {boolean} True if a boss can be built from the eventId, false otherwise.
   */
  static #canCreateBossFrameFromEventId(eventId)
  {
    // if the eventId is invalid, we can't create from that.
    if (!eventId) return false;

    // if the eventId is not a valid eventId, we cannot create from that.
    if (!$gameMap.event(eventId).getJabsBattler()) return false;

    // create the boss!
    return true;
  }
  //endregion privates
}
//endregion BossFrameManager