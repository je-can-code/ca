//region DataManager
/**
 * The global reference for the `JABS_Engine` data object.
 * @type {JABS_Engine}
 * @global
 */
var $jabsEngine = null;

/**
 * The global reference for the `Game_Enemies` data object.<br/>
 *
 * Unlike `$gameActors`, this is effectively a `Game_Enemy` factory rather than
 * a getter for `Game_Actor`s.
 * @type {Game_Enemies}
 * @global
 */
var $gameEnemies = null;

/**
 * The global reference for the `$dataMap` data object that contains all the replicable `JABS_Action`s.
 * @type {Map}
 * @global
 */
var $actionMap = null;

/**
 * Extends {@link DataManager.createGameObjects}.
 * Includes creation of our global game objects.
 */
J.ABS.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.ABS.Aliased.DataManager.get('createGameObjects').call(this);

  // update the skill master map to have data.
  DataManager.getSkillMasterMap();

  // instantiate the engine itself.
  $jabsEngine = new JABS_Engine();

  // setup the global access to the enemies database data.
  $gameEnemies = new Game_Enemies();
};

/**
 * Executes the retrieval of the skill master map from which we clone all action events.
 */
DataManager.getSkillMasterMap = function()
{
  const mapId = J.ABS.DefaultValues.ActionMap;
  if (mapId > 0)
  {
    const filename = "Map%1.json".format(mapId.padZero(3));
    this.loadSkillMasterMap("$dataMap", filename);
  }
  else
  {
    throw new Error("Missing skill master map.");
  }
};

/**
 * Retrieves the skill master map.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 */
DataManager.loadSkillMasterMap = function(name, src)
{
  const xhr = new XMLHttpRequest();
  const url = "data/" + src;
  xhr.open("GET", url);
  xhr.overrideMimeType("application/json");
  xhr.onload = () => this.onMapGet(xhr, name, src, url);
  xhr.onerror = () => this.gracefulFail(name, src, url);
  xhr.send();
};

/**
 * Retrieves the map data file from a given location.
 * @param {XMLHttpRequest} xhr The `xhr` service for fetching files from the local.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 * @param {string} url The path of the file to retrieve.
 */
DataManager.onMapGet = function(xhr, name, src, url)
{
  if (xhr.status < 400)
  {
    $actionMap = JSON.parse(xhr.responseText);
  }
  else
  {
    this.gracefulFail(name, src, url);
  }
};

/**
 * Gracefully fails and just logs it a missing file or whatever is the problem.
 * @param {string} name The name of the problemed file.
 * @param {string} src The source.
 * @param {string} url The path of the problemed file.
 */
DataManager.gracefulFail = function(name, src, url)
{
  console.error(name, src, url);
};
//endregion
