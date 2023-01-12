//region JABS_LootDrop
/**
 * An object that represents the binding of a `Game_Event` to an item/weapon/armor.
 */
class JABS_LootDrop
{
  /**
   * The duration that this loot drop will exist on the map.
   * @type {number}
   */
  _duration = 900;

  /**
   * Whether or not this loot drop can expire.
   * @type {boolean}
   */
  _canExpire = true;

  /**
   * The universally unique identifier for this loot drop.
   * @type {string}
   */
  _uuid = J.BASE.Helpers.shortUuid();

  /**
   * The underlying database object for the item or equip loot.
   * Is null while unassigned.
   * @type {RPG_EquipItem|RPG_Item|null}
   */
  _lootObject = null;

  constructor(object)
  {
    this.lootObject = object;
  }

  /**
   * Gets the `uuid` of this loot drop.
   * @returns {string}
   */
  get uuid()
  {
    return this._uuid;
  }

  /**
   * Sets the `uuid` to the new value.
   * This overwrites the default-generated `uuid`.
   * @param {string} newUuid The new `uuid`.
   */
  set uuid(newUuid)
  {
    this._uuid = newUuid;
  }

  /**
   * Gets the duration remaining on this loot drop.
   * @returns {number}
   */
  get duration()
  {
    return this._duration;
  }

  /**
   * Sets the duration for this loot drop.
   */
  set duration(newDuration)
  {
    // -1 is the magic duration means this loot stays forever.
    if (newDuration === -1)
    {
      // disable this loot's expire functionality.
      this.disableExpiration();
    }

    // update the duration.
    this._duration = newDuration;
  }

  /**
   * Whether or not this loot drop's duration is expired.
   * If the loot cannot expire, this will always return false, regardless of duration.
   * @returns {boolean}
   */
  get expired()
  {
    // if this loot cannot expire, then it is never expired.
    if (!this.canExpire()) return false;

    // return whether or not the duration has expired.
    return this._duration <= 0;
  }

  /**
   * Set the underlying loot drop.
   * @param {RPG_EquipItem|RPG_Item|null} newLootObject The loot that this drop represents.
   */
  set lootObject(newLootObject)
  {
    this._lootObject = newLootObject;
  }

  canExpire()
  {
    return this._canExpire;
  }

  enableExpiration()
  {
    this._canExpire = true;
  }

  disableExpiration()
  {
    this._canExpire = false;
  }

  /**
   * Counts down the duration for this loot drop.
   */
  countdownDuration()
  {
    if (!this.canCountdownDuration()) return;

    this._duration--;
  }

  /**
   * Determines whether or not this loot should countdown the duration.
   * @returns {boolean} True if the loot should countdown, false otherwise.
   */
  canCountdownDuration()
  {
    // if already expired, do not countdown.
    if (!this.canExpire()) return false;

    // do not continue counting if duration has expired.
    if (this.duration <= 0) return false;

    // countdown the duration!
    return true;
  }

  /**
   * Gets the underlying loot object.
   * @returns {RPG_BaseItem}
   */
  get lootData()
  {
    return this._lootObject;
  }

  /**
   * Gets the `iconIndex` for the underlying loot object.
   * @returns {number}
   */
  get lootIcon()
  {
    return this._lootObject.iconIndex;
  }

  /**
   * Gets whether or not this loot should be automatically consumed on pickup.
   * @returns {boolean}
   */
  get useOnPickup()
  {
    return this._lootObject.jabsUseOnPickup ?? false;
  }
}
//endregion JABS_LootDrop