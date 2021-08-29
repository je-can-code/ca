/**
 * Extends `createGameObjects` with the fetching of the enemy map into memory.
 */
J.STAR.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  J.STAR.Aliased.DataManager.createGameObjects.call(this);
  DataManager.getEnemyMasterMap();
};

/**
 * Executes the retrieval of the enemy master map from which we clone all JABS battlers.
 */
DataManager.getEnemyMasterMap = function() {
  const mapId = J.STAR.DefaultValues.EnemyMap;
  if (mapId > 0) {
    const filename = "Map%1.json".format(mapId.padZero(3));
    this.loadEnemyMasterMap("$dataMap", filename);
  } else {
    throw new Error("Missing enemy master map.");
  }
};

/**
 * Retrieves the skill master map.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 */
DataManager.loadEnemyMasterMap = function(name, src) {
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
DataManager.onEnemyMapGet = function(xhr, name, src, url) {
  if (xhr.status < 400) {
    BattleManager.enemyMap = JSON.parse(xhr.responseText);
  } else {
    this.gracefulFail(name, src, url);
  }
};