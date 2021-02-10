/*:
 * @target MV MZ
 * @plugindesc Player can 8-dir move, also touch input movement.
 * @author Sasuke KANNAZUKI, Yami
 *
 * @param dir4 Switch ID
 * @type number
 * @min 0
 * @desc when this ID's switch is true, player moves 4-dir.
 * If set 0, it's always 8-dir.
 * @default 100
 *
 *
 * This plugin enables player 8-dir move.
 */

(function() {

    //
    // process parameters
    //
    var parameters = PluginManager.parameters('Yami_8DirEx');
    var dir4varID = Number(parameters['dir4 Switch ID'] || 100);

    /**
     * Determines if a numeric directional input is diagonal.
     * @param {number} direction The direction to check.
     * @returns {boolean} True if the input is diagonal, false otherwise.
     */
    Game_Character.prototype.isMoveDiagonally = function(direction) {
      return [1, 3, 7, 9].contains(direction);
    };

    /**
     * Determines if a numeric directional input is straight.
     * @param {number} direction The direction to check.
     * @returns {boolean} True if the input is straight, false otherwise.
     */
    Game_Character.prototype.isMoveStraight = function(direction) {
      return [2, 4, 6, 8].contains(direction);
    };

    /**
     * Determines the horz/vert directions to move based on a diagonal direction.
     * @param {number} direction The diagonal-only numeric direction to move.
     */
    Game_Character.prototype.getDiagonallyMovement = function(direction) {
      let horz = 0;
      let vert = 0;
      switch (direction) {
        case 1: 
          horz = 4; vert = 2; 
          break;
        case 3:
          horz = 6; vert = 2;
          break;
        case 7:
          horz = 4; vert = 8;
          break;
        case 9:
          horz = 6; vert = 8;
          break;
      }

      return [horz, vert];
    };

    /**
     * Extends the "Move Straight" functionality to include moving diagonally if the direction
     * is diagonal. This has been largely overwritten to accommodate events that can fire in
     * multiple directions within the context of JABS.
     */
    var _Game_Character_moveStraight = Game_Character.prototype.moveStraight;
    Game_Event.prototype.moveStraight = function(direction) {
      const hasInitialDirection = this._j._initialDirection;
      const initialDirectionIsDiagonal = this.isMoveDiagonally(this._j._initialDirection);
      if (hasInitialDirection && initialDirectionIsDiagonal) {
        const horzVert = this.getDiagonallyMovement(this._j._initialDirection);
        const canMoveDiagonally = this.canPass(this._x, this._y, horzVert[0]) && this.canPass(this._x, this._y, horzVert[1]);
        if (canMoveDiagonally) {
          const facing = this.determineDirection();
          this.setDirection(facing);
          this.moveDiagonally.apply(this, horzVert);
          return;  
        } else {
          const canMoveHorizontally = this.canPass(this._x, this._y, horzVert[0]);
          const canMoveVertically = this.canPass(this._x, this._y, horzVert[1]);
          if (canMoveHorizontally) {
            _Game_Character_moveStraight.call(this, horzVert[0]);
            return;
          }

          if (canMoveVertically) {
            _Game_Character_moveStraight.call(this, horzVert[1]);
            return;
          }
        }
      }

      if (this.isMoveStraight(direction)) {
        _Game_Character_moveStraight.call(this, direction);
      } else if (this.isMoveDiagonally(direction)) {
        const diag = this.getDiagonallyMovement(this._j._initialDirection);
        this.moveDiagonally.apply(this, diag);
      }
    };

    Game_Event.prototype.determineDirection = function() {
      const player = this.getMapActionData().getCaster();
      const playerDirection = player.getCharacter().direction();
      const projectiles = this.getMapActionData().getBaseSkill()._j.projectile;
      const playerX = player.getX();
      const playerY = player.getY();
      const actionX = this.x;
      const actionY = this.y;
      let dir = playerDirection;
      switch (projectiles) {
        case 1: 
        case 2:
        case 3:
          dir = playerDirection;
          break;
        case 4:
        case 8:
          if (actionX < playerX) dir = 4;
          if (actionX > playerX) dir = 6;
          if (actionY < playerY) dir = 8;
          if (actionY > playerY) dir = 2;
          break;
      }

      return dir;
    };

    /**
     * OVERWRITE Moves the player in the direction provided.
     * Extended to allow for diagonal movement as well.
     * @param {number} direction The numeric direction to move.
     */
    Game_Player.prototype.processMoveByInput = function(direction) {
      if (this.isMoveStraight(direction)) {
        this.moveStraight(direction);
      } else if (this.isMoveDiagonally(direction)) {
        var diagonal = this.getDiagonallyMovement(direction);
        this.moveDiagonally.apply(this, diagonal);
      }
    };

    /**
     * Extends built-in diagonal movement to also move either horizontally or vertically
     * if a move diagonally should fail.
     * @param {number} horz The horizontal piece of the direction to move.
     * @param {number} vert The vertical piece of the direction to move.
     */
    var _Game_Player_moveDiagonally = Game_Character.prototype.moveDiagonally;
    Game_Character.prototype.moveDiagonally = function(horz, vert) {
      _Game_Player_moveDiagonally.call(this, horz, vert);
      if (!this.isMovementSucceeded()) {

        // try vertical move
        this.setMovementSuccess(this.canPass(this._x, this._y, vert));
        if (this.isMovementSucceeded()) {
          this.moveStraight(vert);
        }

        // try horizontal move
        this.setMovementSuccess(this.canPass(this._x, this._y, horz));
        if (this.isMovementSucceeded()) {
          this.moveStraight(horz);
        }
      }
    };

    /**
     * Moves the player in a direction dependent on input.
     * Enables diagonally movement as well.
     */
    Game_Player.prototype.moveByInput = function() {
      if (!this.isMoving() && this.canMove()) {
        var dir4mode = (!!dir4varID && $gameSwitches.value(dir4varID));
        var direction = dir4mode ? Input.dir4 : Input.dir8;
        if (direction > 0) {
          $gameTemp.clearDestination();
        } else if ($gameTemp.isDestinationValid()){
          var x = $gameTemp.destinationX();
          var y = $gameTemp.destinationY();
          if (dir4mode) {
            direction = this.findDirectionTo(x, y);
          } else {
            direction = this.findDiagonalDirectionTo(x, y);
          }
        }
        if (direction > 0) {
          this.processMoveByInput(direction);
        }
      }
    };

    /**
     * Determines the diagonal(?) distance between two points.
     * @param {number} x1 The starting `x` coordinate.
     * @param {number} y1 The starting `y` coordinate.
     * @param {number} x2 The goal `x` coordinate.
     * @param {number} y2 The goal `y` coordinate.
     */
    Game_Map.prototype.diagonalDistance = function(x1, y1, x2, y2) {
        var x = Math.abs(this.deltaX(x1, x2));
        var y = Math.abs(this.deltaY(y1, y2));
        return Math.min(x, y) * 3 / 2 + Math.abs(x - y);
    };

    /**
     * Intelligently determines the next step to take on a path to the destination `x,y`.
     * @param {number} goalX The `x` coordinate trying to be reached.
     * @param {number} goalY The `y` coordinate trying to be reached.
     */
    Game_Character.prototype.findDiagonalDirectionTo = function(goalX, goalY) {
      var searchLimit = this.searchLimit()
      var mapWidth = $gameMap.width();
      var nodeList = [];
      var openList = [];
      var closedList = [];
      var start = {};
      var best = start

      if (this.x === goalX && this.y === goalY) {
        return 0;
      }

      start.parent = null;
      start.x = this.x;
      start.y = this.y;
      start.g = 0;
      start.f = $gameMap.diagonalDistance(start.x, start.y, goalX, goalY);
      nodeList.push(start);
      openList.push(start.y * mapWidth + start.x);

      while (nodeList.length > 0) {
        var bestIndex = 0;
        for (var i = 0; i < nodeList.length; i++) {
          if (nodeList[i].f < nodeList[bestIndex].f) {
            bestIndex = i;
          }
        }

        var current = nodeList[bestIndex];
        var x1 = current.x;
        var y1 = current.y;
        var pos1 = y1 * mapWidth + x1;
        var g1 = current.g;

        nodeList.splice(bestIndex, 1);
        openList.splice(openList.indexOf(pos1), 1);
        closedList.push(pos1);

        if (current.x === goalX && current.y === goalY) {
          best = current;
          goaled = true;
          break;
        }

        if (g1 >= searchLimit) {
          continue;
        }

        for (var j = 1; j <= 9; j++) {
          if(j === 5) {
            continue;
          }
          var directions;
          if (this.isMoveDiagonally(j)) {
            directions = this.getDiagonallyMovement(j);
          } else { 
            directions = [j, j];
          }
          var horz = directions[0];
          var vert = directions[1];
          var x2 = $gameMap.roundXWithDirection(x1, horz);
          var y2 = $gameMap.roundYWithDirection(y1, vert);
          var pos2 = y2 * mapWidth + x2;

          if (closedList.contains(pos2)) {
            continue;
          }

          if (this.isMoveStraight(j)) {
            if (!this.canPass(x1, y1, j)) {
              continue;
            }
          } else if (this.isMoveDiagonally(j)) {
            if (!this.canPassDiagonally(x1, y1, horz, vert)) {
              continue;
            }
          }

          var g2 = g1 + 1;
          var index2 = openList.indexOf(pos2);

          if (index2 < 0 || g2 < nodeList[index2].g) {
            var neighbor;
            if (index2 >= 0) {
              neighbor = nodeList[index2];
            } else {
              neighbor = {};
              nodeList.push(neighbor);
              openList.push(pos2);
            }
            neighbor.parent = current;
            neighbor.x = x2;
            neighbor.y = y2;
            neighbor.g = g2;
            neighbor.f = g2 + $gameMap.diagonalDistance(x2, y2, goalX, goalY);
            if (!best || neighbor.f - neighbor.g < best.f - best.g) {
              best = neighbor;
            }
          }
        }
      }
      var node = best;
      while (node.parent && node.parent !== start) {
        node = node.parent;
      }

      var deltaX1 = $gameMap.deltaX(node.x, start.x);
      var deltaY1 = $gameMap.deltaY(node.y, start.y);
      if (deltaY1 > 0) {
        return deltaX1 === 0 ? 2 : deltaX1 > 0 ? 3 : 1;
      } else if (deltaY1 < 0) {
        return deltaX1 === 0 ? 8 : deltaX1 > 0 ? 9 : 7;
      } else { // deltaY1 === 0
        if (deltaX1 !== 0) {
          return deltaX1 > 0 ? 6 : 4;
        }
      }

      var deltaX2 = this.deltaXFrom(goalX);
      var deltaY2 = this.deltaYFrom(goalY);
      if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
        if(deltaX2 > 0) {
          return deltaY2 === 0 ? 4 : deltaY2 > 0 ? 7 : 1;
        } else if (deltaX2 < 0) {
          return deltaY2 === 0 ? 6 : deltaY2 > 0 ? 9 : 3;
        } else {
          return deltaY2 === 0 ? 0 : deltaY2 > 0 ? 8 : 2;
        }
      } else {
        if (deltaY2 > 0) {
          return deltaX2 === 0 ? 8 : deltaX2 > 0 ? 7 : 9;
        } else if (deltaY2 < 0) {
          return deltaX2 === 0 ? 2 : deltaX2 > 0 ? 1 : 3;
        } else {
          return deltaX2 === 0 ? 0 : deltaX2 > 0 ? 4 : 6;
        }
      }
    };
}());
