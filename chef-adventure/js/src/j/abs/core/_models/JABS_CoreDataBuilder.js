//region JABS_CoreDataBuilder
/**
 * A builder class for constructing `JABS_BattlerCoreData`.
 */
class JABS_CoreDataBuilder
{
  //region properties
  /**
   * The battler's id, such as the actor id or enemy id.
   * @type {number}
   * @private
   */
  #battlerId = 0;

  /**
   * The team id that this battler belongs to.
   * @type {number}
   * @private
   */
  #teamId = JABS_Battler.enemyTeamId();

  /**
   * The AI of this battler.
   * @type {string}
   * @private
   */
  #battlerAi = "11000000";

  /**
   * The sight range of this battler.
   * @type {number}
   * @private
   */
  #sightRange = J.ABS.Metadata.DefaultEnemySightRange;

  /**
   * The alerted sight boost of this battler.
   * @type {number}
   * @private
   */
  #alertedSightBoost = J.ABS.Metadata.DefaultEnemyAlertedSightBoost;

  /**
   * The pursuit range of this battler.
   * @type {number}
   * @private
   */
  #pursuitRange = J.ABS.Metadata.DefaultEnemyPursuitRange;

  /**
   * The alerted pursuit boost of this battler.
   * @type {number}
   * @private
   */
  #alertedPursuitBoost = J.ABS.Metadata.DefaultEnemyAlertedPursuitBoost;

  /**
   * The duration this battler remains alerted.
   * @type {number}
   * @private
   */
  #alertDuration = J.ABS.Metadata.DefaultEnemyAlertDuration;

  /**
   * Whether or not this battler is allowed to idle about.
   * @type {boolean}
   * @private
   */
  #canIdle = J.ABS.Metadata.DefaultEnemyCanIdle;

  /**
   * Whether or not this battler has a visible hp bar.
   * @type {boolean}
   * @private
   */
  #showHpBar = J.ABS.Metadata.DefaultEnemyShowHpBar;

  /**
   * Whether or not this battler has a visible hp bar.
   * @type {boolean}
   * @private
   */
  #showDangerIndicator = J.ABS.EXT.DANGER ? J.ABS.EXT.DANGER.Metadata.DefaultEnemyShowDangerIndicator : false;

  /**
   * Whether or not this battler's name is visible.
   * @type {boolean}
   * @private
   */
  #showBattlerName = J.ABS.Metadata.DefaultEnemyShowBattlerName;

  /**
   * Whether or not this battler is invincible.
   * @type {boolean}
   * @private
   */
  #isInvincible = J.ABS.Metadata.DefaultEnemyIsInvincible;

  /**
   * Whether or not this battler is inanimate.
   * @type {boolean}
   * @private
   */
  #isInanimate = J.ABS.Metadata.DefaultEnemyIsInanimate;
  //endregion properties

  /**
   * Constructor.
   * @param {number} battlerId The id of the battler from the database.
   */
  constructor(battlerId)
  {
    this.setBattlerId(battlerId);
  }

  /**
   * Builds the core data with the current set of parameters.
   * @returns {JABS_BattlerCoreData}
   */
  build()
  {
    const core = new JABS_BattlerCoreData({
      // configure core battler data.
      battlerId: this.#battlerId,
      teamId: this.#teamId,
      battlerAI: this.#battlerAi,

      // configure sight and alert battler data.
      sightRange: this.#sightRange,
      alertedSightBoost: this.#alertedSightBoost,
      pursuitRange: this.#pursuitRange,
      alertedPursuitBoost: this.#alertedPursuitBoost,
      alertDuration: this.#alertDuration,

      // configure on-the-map settings.
      canIdle: this.#canIdle,
      showHpBar: this.#showHpBar,
      showBattlerName: this.#showBattlerName,
      isInvincible: this.#isInvincible,
      isInanimate: this.#isInanimate
    });

    // if using danger indicators, then set that, too.
    if (J.ABS.EXT.DANGER)
    {
      core.setDangerIndicator(this.#showDangerIndicator);
    }

    return core;
  }

  //region setters
  /**
   * Sets all properties based on this battler's own data except id.
   * @param {Game_Battler} battler
   * @returns {this} This builder for fluent-building.
   */
  setBattler(battler)
  {
    this.#battlerId = battler.battlerId();
    this.#teamId = battler.teamId();
    this.#battlerAi = battler.ai();

    this.#sightRange = battler.sightRange();
    this.#alertedSightBoost = battler.alertedSightBoost();
    this.#pursuitRange = battler.pursuitRange();
    this.#alertedPursuitBoost = battler.alertedPursuitBoost();
    this.#alertDuration = battler.alertDuration();

    this.#canIdle = battler.canIdle();
    this.#showHpBar = battler.showHpBar();
    this.#showDangerIndicator = battler.showDangerIndicator();
    this.#showBattlerName = battler.showBattlerName();
    this.#isInvincible = battler.isInvincible();
    this.#isInanimate = battler.isInanimate();

    return this;
  }

  /**
   * Sets all properties based on the assumption that this is for the player.
   * Effectively, all ranges are set to 0, and all booleans are set to false.
   * @returns {this} This builder for fluent-building.
   */
  isPlayer()
  {
    this.#teamId = JABS_Battler.allyTeamId();

    this.#sightRange = 0;
    this.#alertedSightBoost = 0;
    this.#pursuitRange = 0;
    this.#alertedPursuitBoost = 0;
    this.#alertDuration = 0;

    this.#canIdle = false;
    this.#showHpBar = false;
    this.#showBattlerName = false;
    this.#isInvincible = false;
    this.#isInanimate = false;

    return this;
  }

  /**
   * Sets the battler id of this core data.
   * @param {number} battlerId The id of the battler from the database.
   * @returns {this} This builder for fluent-building.
   */
  setBattlerId(battlerId)
  {
    this.#battlerId = battlerId;
    return this;
  }

  /**
   * Sets the team id of this core data.
   * @param {number} teamId The id of the team this battler belongs to.
   * @returns {this} This builder for fluent-building.
   */
  setTeamId(teamId)
  {
    this.#teamId = teamId;
    return this;
  }

  /**
   * Sets the AI of this core data.
   * @param {string} battlerAi The AI of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setBattlerAi(battlerAi)
  {
    this.#battlerAi = battlerAi;
    return this;
  }

  /**
   * Sets the sight range of this core data.
   * @param {number} sightRange The sight range of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setSightRange(sightRange)
  {
    this.#sightRange = sightRange;
    return this;
  }

  /**
   * Sets the alerted sight boost of this core data.
   * @param {number} alertedSightBoost The alerted sight boost of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setAlertedSightBoost(alertedSightBoost)
  {
    this.#alertedSightBoost = alertedSightBoost;
    return this;
  }

  /**
   * Sets the pursuit range of this core data.
   * @param {number} pursuitRange The pursuit range of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setPursuitRange(pursuitRange)
  {
    this.#pursuitRange = pursuitRange;
    return this;
  }

  /**
   * Sets the alerted pursuit boost of this core data.
   * @param {number} alertedPursuitBoost The alerted pursuit boost of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setAlertedPursuitBoost(alertedPursuitBoost)
  {
    this.#alertedPursuitBoost = alertedPursuitBoost;
    return this;
  }

  /**
   * Sets the alerted duration of this core data.
   * @param {number} alertDuration The duration of which this battler remains alerted.
   * @returns {this} This builder for fluent-building.
   */
  setAlertDuration(alertDuration)
  {
    this.#alertDuration = alertDuration;
    return this;
  }

  /**
   * Sets whether or not this battler can idle while not in combat.
   * @param {boolean} canIdle Whether or not this battler can idle about.
   * @returns {this} This builder for fluent-building.
   */
  setCanIdle(canIdle)
  {
    this.#canIdle = canIdle;
    return this;
  }

  /**
   * Sets whether or not this battler's hp bar is visible.
   * @param {boolean} showHpBar Whether or not the hp bar is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowHpBar(showHpBar)
  {
    this.#showHpBar = showHpBar;
    return this;
  }

  /**
   * Sets whether or not this battler's danger indicator is visible.
   * @param {boolean} showDangerIndicator Whether or not the danger indicator is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowDangerIndicator(showDangerIndicator)
  {
    this.#showDangerIndicator = showDangerIndicator;
    return this;
  }

  /**
   * Sets whether or not this battler's name is visible.
   * @param {boolean} showBattlerName Whether or not the battler name is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowBattlerName(showBattlerName)
  {
    this.#showBattlerName = showBattlerName;
    return this;
  }

  /**
   * Sets whether or not this battler is invincible.
   * @param {boolean} isInvincible Whether or not the battler is invincible.
   * @returns {this} This builder for fluent-building.
   */
  setIsInvincible(isInvincible)
  {
    this.#isInvincible = isInvincible;
    return this;
  }

  /**
   * Sets whether or not this battler is inanimate.
   * @param {boolean} isInanimate Whether or not the battler is inanimate.
   * @returns {this} This builder for fluent-building.
   */
  setIsInanimate(isInanimate)
  {
    this.#isInanimate = isInanimate;
    return this;
  }
  //endregion setters
}
//endregion JABS_CoreDataBuilder