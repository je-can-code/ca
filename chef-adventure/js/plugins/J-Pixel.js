//#region Initialization
/*:
 * @target MZ
 * @plugindesc 
 * [v.alpha PIXEL] Enables pixel-based movement instead of grid-based movement while on the map.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ============================================================================
 * Enables pixel-based movement instead of grid-based movement on the map.
 * This also includes 8-directional movement as well.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.PIXEL = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.PIXEL.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-Pixel`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.PIXEL.PluginParameters = PluginManager.parameters(J.PIXEL.Metadata.Name);
J.PIXEL.Metadata = {
  ...J.PIXEL.Metadata,
  /**
   * The version of this plugin.
   */
  Version: 1.00,
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.PIXEL.Aliased = {
  Game_Character: {},
  Game_Event: {},
  Game_Map: {},
  Game_Player: {},
};
//#endregion Initialization

//#region Extensions
Number.prototype.floatSafeRemainder = function(step){
  var valDecCount = (this.toString().split('.')[1] || '').length;
  var stepDecCount = (step.toString().split('.')[1] || '').length;
  var decCount = valDecCount > stepDecCount? valDecCount : stepDecCount;
  var valInt = parseInt(this.toFixed(decCount).replace('.',''));
  var stepInt = parseInt(step.toFixed(decCount).replace('.',''));
  return (valInt % stepInt) / Math.pow(10, decCount);
};
//#endregion Extensions

//#region Game objects
//#region Game_Character
Game_Character.prototype.moveDiagonallyRaw = function (direction) {
  const horz = [1, 7].includes(direction) ? 4 : 6;
  const vert = [1, 3].includes(direction) ? 2 : 8;
  this.moveDiagonally(horz, vert);
};
//#endregion Game_Character

//#region Game_Map
Game_Map.prototype.yWithDirection = function(y, d) {
  //const result = y + (d === 2 ? 1 : d === 8 ? -1 : 0);
  const distance = this.reduceDistance(d);
  const result = y + (d === 2 ? distance : d === 8 ? -distance : 0);
  return result;
};

Game_Map.prototype.roundX = function(x) {
  const result = this.isLoopHorizontal() ? x.floatSafeRemainder(this.width()) : x;
  return result;
};

Game_Map.prototype.roundY = function(y) {
  const result = this.isLoopVertical() ? y.floatSafeRemainder(this.height()) : y;
  return result;
};

Game_Map.prototype.xWithDirection = function(x, d) {
  //const result = x + (d === 6 ? 1 : d === 4 ? -1 : 0);
  const distance = this.reduceDistance(d);
  const result = x + (d === 6 ? distance : d === 4 ? -distance : 0);
  return result;
};

Game_Map.prototype.roundXWithDirection = function(x, d) {
  //const result = this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
  const distance = this.reduceDistance(d);
  const result = this.roundX(x + (d === 6 ? distance : d === 4 ? -distance : 0));
  return result;
};

Game_Map.prototype.roundYWithDirection = function(y, d) {
  //const result = this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
  const distance = this.reduceDistance(d);
  const result = this.roundY(y + (d === 2 ? distance : d === 8 ? -distance : 0));
  return result;
};

Game_Map.prototype.isPassable = function(x, y, d) {
  console.log((1 << (d / 2 - 1)) & 0x0f);
  const result = this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
  console.log(x, y, d, result);
  return true//result;
};

Game_Map.prototype.reduceDistance = function(direction) {
  const stepSize = 0.5;
  const decrease = [2, 6];
  const increase = [4, 8];
  if (increase.includes(direction)) {
    return stepSize;
  } else if (decrease.includes(direction)) {
    return -stepSize;
  } else {
    // safety net.
    console.log("safety net");
    return 1;
  }
};
//#endregion Game_Map

//#region Game_Player
/**
 * OVERWRITE Allows moving diagonally.
 * @param {number} direction The direction being moved.
 */
Game_Player.prototype.executeMove = function(direction) {
  if ([1, 3, 7, 9].includes(direction)) {
    this.moveDiagonallyRaw(direction);
  } else if ([2, 4, 6, 8].includes(direction)) {
    this.moveStraight(direction);
  }
};

/**
 * Extends `.moveDiagonally` to try and move vert/horz if diagonal movement fails. 
 */
J.PIXEL.Aliased.Game_Player.moveDiagonally = Game_Player.prototype.moveDiagonally;
Game_Player.prototype.moveDiagonally = function(horz, vert) {
  J.PIXEL.Aliased.Game_Player.moveDiagonally.call(this, horz, vert);
  if (!this.isMovementSucceeded()) {
    this.setMovementSuccess(this.canPass(this._x, this._y, vert));
    if (this.isMovementSucceeded()) {
      this.moveStraight(vert);
    }

    this.setMovementSuccess(this.canPass(this._x, this._y, horz));
    if (this.isMovementSucceeded()) {
      this.moveStraight(horz);
    }
  }
};

Game_Player.prototype.moveStraight = function(d) {
  this.setMovementSuccess(this.canPass(this._x, this._y, d));
  if (this.isMovementSucceeded()) {
      this.setDirection(d);
      this._x = $gameMap.roundXWithDirection(this._x, d);
      this._y = $gameMap.roundYWithDirection(this._y, d);
      this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
      this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
      this.increaseSteps();
  } else {
      this.setDirection(d);
      this.checkEventTriggerTouchFront(d);
  }
};

/**
 * Enables diagonal directional input detection for the dpad.
 * @returns {number}
 */
Game_Player.prototype.getInputDirection = function() {
  return Input.dir8;
};
//#endregion Game_Player
//#endregion Game objects

//ENDOFFILE