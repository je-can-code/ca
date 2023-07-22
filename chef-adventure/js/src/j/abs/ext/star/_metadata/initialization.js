/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.STAR = {};

//region version checks
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
  const requiredJabsVersion = '3.1.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//endregion version check

/**
 * The metadata for this plugin.
 */
J.ABS.EXT.STAR.Metadata = {};
J.ABS.EXT.STAR.Metadata.Name = 'J-ABS-STAR';
J.ABS.EXT.STAR.Metadata.Version = '1.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.STAR.PluginParameters = PluginManager.parameters(J.ABS.EXT.STAR.Metadata.Name);

/**
 * The default values for this plugin.
 */
J.ABS.EXT.STAR.DefaultValues = {
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
J.ABS.EXT.STAR.Aliased = {
  BattleManager: new Map(),
  DataManager: new Map(),
  Game_Interpreter: {},
  Game_Map: new Map(),
  Game_Player: new Map(),
  Game_Troop: new Map(),
  Scene_Map: new Map(),
};

J.ABS.EXT.STAR.Regexp = {
  BattleMapId: /<battleMapId:(\d+)>/gi,
};