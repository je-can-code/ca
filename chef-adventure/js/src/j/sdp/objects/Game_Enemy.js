//region Game_Enemy
/**
 * Gets any additional drops from the notes of this particular enemy.
 * This allows for only gaining an SDP from enemies once.
 * @returns {RPG_DropItem[]}
 */
J.SDP.Aliased.Game_Enemy.set("extraDrops", Game_Enemy.prototype.extraDrops);
Game_Enemy.prototype.extraDrops = function()
{
  // get the original drop list.
  const dropList = J.SDP.Aliased.Game_Enemy.get("extraDrops").call(this);

  // if we cannot drop the SDP for some reason, then return the unmodified drop list.
  if (!this.canDropSdp()) return dropList;

  // add the drop to the list of possible drops.
  const sdpDrop = this.makeSdpDrop();
  dropList.push(sdpDrop);

  // return the list with the added SDP.
  return dropList;
};

/**
 * Determines if there is an SDP to drop, and whether or not to drop it.
 * @returns {RPG_DropItem}
 */
Game_Enemy.prototype.canDropSdp = function()
{
  // if we do not have a panel to drop, then don't drop it.
  if (!this.hasSdpDropData()) return false;

  // grab the panel for shorthand reference below.
  const panel = $gameSystem.getSdpByKey(this.enemy().sdpDropKey);

  // if the enemy has a panel that isn't defined, then don't drop it.
  if (!panel)
  {
    console.warn(`Panel of key ${this.enemy().sdpDropKey} is not defined, but was trying to be dropped.`);
    console.warn(`Consider defining a panel with the key of ${this.enemy().sdpDropKey}.`);
    return false;
  }

  // if we have already unlocked the droppable panel, then don't drop it.
  if (panel.isUnlocked()) return false;

  // drop the panel!
  return true;
};

/**
 * Makes the new drop item for the SDP based on the data from this enemy.
 * @returns {RPG_Item}
 */
Game_Enemy.prototype.makeSdpDrop = function()
{
  // grab all the data points to build the SDP drop.
  const [key, chance, itemId] = this.getSdpDropData();

  // if debug is enabled, panels should always drop.
  const debugChance = $gameSystem.shouldForceDropSdp()
    ? 10000000
    : chance;

  // build the sdp drop item.
  const sdpDrop = new RPG_DropItemBuilder().itemLoot(itemId, debugChance);

  // assign the drop item the key for the panel.
  sdpDrop.setSdpKey(key);

  // return the custom item.
  return sdpDrop;
};

/**
 * Gets the SDP drop data from this enemy.
 * @returns {[string,number,number]}
 */
Game_Enemy.prototype.getSdpDropData = function()
{
  return this.enemy().sdpDropData;
};

/**
 * Gets whether or not this enemy has an SDP to drop.
 * @returns {boolean}
 */
Game_Enemy.prototype.hasSdpDropData = function()
{
  return this.enemy().sdpDropData[0] !== String.empty;
};

/**
 * Gets the base amount of SDP points this enemy grants.
 * @returns {number}
 */
Game_Enemy.prototype.sdpPoints = function()
{
  return this.enemy().sdpPoints;
};
//endregion Game_Enemy