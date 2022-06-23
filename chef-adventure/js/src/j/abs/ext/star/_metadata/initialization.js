/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.STAR = {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '3.0.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//#endregion version check

/**
 * The metadata for this plugin.
 */
J.STAR.Metadata = {};
J.STAR.Metadata.Name = 'J-ABS-STAR';
J.STAR.Metadata.Version = '1.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.STAR.PluginParameters = PluginManager.parameters(J.STAR.Metadata.Name);

/**
 * The default values for this plugin.
 */
J.STAR.DefaultValues = {
  /**
   * The mapId used when there is no mapId specified.
   * @type {number}
   */
  EnemyMap: 110,

  /**
   * The maximum number of enemies that can be generated in a troop.
   * Though the max in the database is higher, this keeps things smooth.
   * @type {number}
   */
  MaxEnemyCount: 12,
};

/**
 * The aliased classes within this plugin.
 */
J.STAR.Aliased = {
  BattleManager: new Map(),
  DataManager: new Map(),
  Game_Interpreter: {},
  Game_Map: new Map(),
  Game_Player: new Map(),
  Game_Troop: new Map(),
  Scene_Map: new Map(),
};