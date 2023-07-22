//region Game_System
/**
 * Hooks in and initializes the SDP system.
 */
J.SDP.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_System.get('initialize').call(this);

  // initializes members for this plugin.
  this.initSdpMembers();
};

/**
 * Initializes the SDP system and binds earned panels to the `$gameSystem` object.
 */
Game_System.prototype.initSdpMembers = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the SDP system.
   */
  this._j._sdp ||= {};

  /**
   * The collection of all defined SDPs.
   * @type {StatDistributionPanel[]}
   */
  this._j._sdp._panels = J.SDP.Helpers.TranslateSDPs(J.SDP.PluginParameters['SDPs']);

  /**
   * Whether or not to force any enemy that can drop a panel to drop a panel.
   * @type {boolean}
   */
  this._j._sdp._forceDropPanels = false;
};

/**
 * Enables a DEBUG functionality for forcing the drop of panels where applicable.
 */
Game_System.prototype.enableForcedSdpDrops = function()
{
  this._j._sdp._forceDropPanels = true;
};

/**
 * Disables a DEBUG functionality for forcing the drop of panels where applicable.
 */
Game_System.prototype.disableForcedSdpDrops = function()
{
  this._j._sdp._forceDropPanels = false;
};

/**
 * Determines whether or not the DEBUG functionality of forced-panel-dropping is active.
 * @returns {boolean|*|boolean}
 */
Game_System.prototype.shouldForceDropSdp = function()
{
  return this._j._sdp._forceDropPanels ?? false;
};

/**
 * Updates the list of all available difficulties from the latest plugin metadata.
 */
J.SDP.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.SDP.Aliased.Game_System.get('onAfterLoad').call(this);

  // update from the latest plugin metadata.
  this.updateSdpsFromPluginMetadata();
};

/**
 * Updates the panel list from the latest plugin metadata.
 */
Game_System.prototype.updateSdpsFromPluginMetadata = function()
{
  // refresh the panel list from the plugin metadata.
  this._j._sdp._panels ??= J.SDP.Helpers.TranslateSDPs(J.SDP.PluginParameters['SDPs']);
};

/**
 * Gets all panels currently built from the plugin parameters.
 * @returns {StatDistributionPanel[]}
 */
Game_System.prototype.getAllSdps = function()
{
  return this._j._sdp._panels;
};

/**
 * Gets a single panel based on the key provided.
 * @param {string} key The less-friendly unique key that represents this SDP.
 * @returns {StatDistributionPanel}
 */
Game_System.prototype.getSdpByKey = function(key)
{
  // if we don't have panels to search through, don't do it.
  if (!this.getAllSdps().length) return null;

  const foundPanel = this.getAllSdps().find(panel => panel.key === key);
  return foundPanel;
};

/**
 * Gets all panels that match the keys provided.
 * @param {string[]} keys The list of keys to find panels for.
 * @returns {StatDistributionPanel[]}
 */
Game_System.prototype.getSdpsByKeys = function(keys)
{
  // if we don't have panels to search through, don't do it.
  if (!this.getAllSdps().length) return [];

  return this.getAllSdps().filter(sdp => keys.includes(sdp.key));
};

/**
 * Gets all currently-unlocked `StatDistributionPanel`s.
 * @returns {StatDistributionPanel[]} All currently unlocked SDPs.
 */
Game_System.prototype.getUnlockedSdps = function()
{
  // if we don't have panels to search through, don't do it.
  if (!this.getAllSdps().length) return [];

  const panels = this.getAllSdps();

  const unlockedPanels = panels.filter(panel => panel.isUnlocked());

  return unlockedPanels;
};

/**
 * Gets the number of panels currently unlocked for the party.
 * @returns {number}
 */
Game_System.prototype.getUnlockedSdpsCount = function()
{
  return this.getUnlockedSdps().length;
};

/**
 * Unlocks a SDP by its key.
 * @param {string} key The key of the SDP to unlock.
 */
Game_System.prototype.unlockSdp = function(key)
{
  const panel = this.getSdpByKey(key);
  if (panel)
  {
    panel.unlock();
  }
  else
  {
    console.error(`The SDP key of ${key} was not found in the list of panels to unlock.`);
  }
};

/**
 * Unlocks all SDPs currently in the plugin parameters.
 *
 * This is primarily a debug utility.
 */
Game_System.prototype.unlockAllSdps = function()
{
  this._j._sdp._panels.forEach(panel => panel.unlock());
};

/**
 * Locks a SDP by its key.
 * @param {string} key The key of the SDP to lock.
 */
Game_System.prototype.lockSdp = function(key)
{
  const panel = this.getSdpByKey(key);
  if (panel)
  {
    panel.lock();
  }
  else
  {
    console.error(`The SDP key of ${key} was not found in the list of panels to lock.`);
  }
};

/**
 * Gets the ranking of a specific SDP for one of the actors.
 * @param {number} actorId The id of the actor you want to get a ranking for.
 * @param {string} key The unique key of the SDP to get the ranking for.
 * @returns {number} The rank of the panel that the actor is at.
 */
Game_System.prototype.getRankByActorAndKey = function(actorId, key)
{
  // make sure the actor id is valid.
  const actor = $gameActors.actor(actorId);
  if (!actor)
  {
    console.error(`The actor id of ${actorId} was invalid.`);
    return 0;
  }

  // make sure the actor has ranks in the panel and return the rank.
  const panelRanking = actor.getSdpByKey(key);
  if (panelRanking)
  {
    return panelRanking.currentRank;
  }
  else
  {
    return 0;
  }
};
//endregion Game_System