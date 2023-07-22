/**
 * Extends {@link DataManager.createGameObjects}.
 * Includes fetching the enemy map and storing it memory.
 */
J.ABS.EXT.STAR.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.DataManager.get('createGameObjects').call(this);

  // load the enemy master map into memory.
  DataManager.getEnemyMasterMap();
};

/**
 * Executes the retrieval of the enemy master map.
 * All JABS battlers are cloned from here.
 */
DataManager.getEnemyMasterMap = function()
{
  // determine the map id of the enemy map.
  const mapId = J.ABS.EXT.STAR.DefaultValues.EnemyMap;

  // check to make sure the map id is valid.
  if (mapId > 0) 
  {
    // generate the map file name.
    const filename = "Map%1.json".format(mapId.padZero(3));

    // load the enemy map into memory.
    this.loadEnemyMasterMap("$dataMap", filename);
  }
  // the map id wasn't correct!
  else 
  {
    throw new Error("Missing enemy master map.");
  }
};

/**
 * Retrieves the enemy master map.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 */
DataManager.loadEnemyMasterMap = function(name, src) 
{
  // TODO: replace with native "fetch"?
  // the copy pasta logic for fetching a resource, specifically our enemy map.
  const xhr = new XMLHttpRequest();
  const url = "data/" + src;
  xhr.open("GET", url);
  xhr.overrideMimeType("application/json");
  xhr.onload = () => this.onEnemyMapGet(xhr, name, src, url);
  xhr.onerror = () => this.gracefulFail(name, src, url);
  xhr.send();
};

/**
 * Retrieves the enemy map data file from a given location.
 * @param {XMLHttpRequest} xhr The `xhr` service for fetching files from the local.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 * @param {string} url The path of the file to retrieve.
 */
DataManager.onEnemyMapGet = function(xhr, name, src, url) 
{
  if (xhr.status < 400) 
  {
    // the enemy map data lives on the battle manager.
    BattleManager.enemyMap = JSON.parse(xhr.responseText);
  }
  else
  {
    // TODO: throw an error- the enemy map is REQUIRED.
    this.gracefulFail(name, src, url);
  }
};