/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Loot Drop data structure.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This class represents the data structure of a single loot drop. This
 * contains the various data points, such as what the duration of the drop is,
 * what the drop itself is, whether it can even expire, etc.
 * ============================================================================
 */

/**
 * An object that represents the binding of a `Game_Event` to an item/weapon/armor.
 */
 class JABS_LootDrop {
  constructor(object) {
    this._lootObject = object;
    this.initMembers();
  };

  /**
   * Initializes properties of this object that don't require parameters.
   */
  initMembers() {
    /**
     * The duration that this loot drop will exist on the map.
     * @type {number}
     */
    this._duration = 900;

    /**
     * Whether or not this loot drop can expire.
     * @type {boolean}
     */
    this._canExpire = true;

    /**
     * The universally unique identifier for this loot drop.
     * @type {string}
     */
    this._uuid = J.BASE.Helpers.generateUuid();
  };

  /**
   * Gets the duration remaining on this loot drop.
   * @returns {number}
   */
  get duration() {
    return this._duration;
  };

  /**
   * Sets the duration for this loot drop.
   */
  set duration(newDuration) {
    if (newDuration === -1) {
      this._canExpire = false;
    }

    this._duration = newDuration;
  };

  /**
   * Whether or not this loot drop's duration is expired.
   * If the loot cannot expire, this will always return false, regardless of duration.
   * @returns {boolean}
   */
  get expired() {
    if (!this._canExpire) return false;

    return this._duration <= 0;
  };

  /**
   * Counts down the duration for this loot drop.
   */
  countdownDuration() {
    if (!this._canExpire || this._duration <= 0) return;

    this._duration--;
  };

  /**
   * Gets the underlying loot object.
   * @returns {object}
   */
  get lootData() {
    return this._lootObject;
  };

  /**
   * Gets the `iconIndex` for the underlying loot object.
   * @returns {number}
   */
  get lootIcon() {
    return this._lootObject.iconIndex;
  };

  /**
   * Gets whether or not this loot should be automatically consumed on pickup.
   * @returns {boolean}
   */
  get useOnPickup() {
    return this._lootObject._j.useOnPickup;
  };
};
//ENDFILE