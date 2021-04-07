//#region Introduction
//=============================================================================
// RPG Maker MZ - Ignis Pixel Movement
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Pixel Movement for MZ.
 * @author Reisen (Mauricio Pastana)
 *
 * @help Ignis Pixel Movement - 
 * For support and new plugins join our discord server! https://discord.gg/g6dSnZx
 * Want to support new creations? be a patreon! https://www.patreon.com/raizen884?fan_landing=true
 *
 * This plugin changes from the grid collisions to pixel collisions
 * It puts the commands on the top and the status on the bottom.
 *
 * IgnisEnginePM.checkCollision(event/player, event)
 * You can check collision between two RPG Maker objects (event or player)
 * Ex: IgnisEnginePM.checkCollisionPlayer(1) to check collsion of player with event of id 1
 * Or between 2 events of id 3 and 1
 * IgnisEnginePM.checkCollisionEvents(3, 1)
 * 
 * 
 * @command collisionSet
 * @text Set Collision Box
 * @desc Sets a specific collision box for this event
 * @arg collisionBox
 * @type struct<Event>
 * 
 * @param Cursor Distance
 * @desc The higher, the further away for the the cursor click make the character go faster
 * @type number
 * @default 480
 * 
 * @param Player Collision
 * @type struct<Player>
 * @text Default Player Collisions
 * @param Event Collision
 * @type struct<EventG>
 * @text Default Event Collisions
 * @param Region Collisions
 * @type struct<Region>[]
 * @text Region Collisions
 * @param Default Mode
 * @desc Default mode for events, you can individually change each event mode as you wish.
 * @type boolean
 * @on Pixel Movement
 * @off Grid Movement
 * 
 */
/*~struct~Region:
 * @param regionId
 * @type number
 * @default 1
 * @param x
 * @type number
 * @default 0
 * @param y
 * @type number
 * @default 0
 * @param width
 * @type number
 * @default 48
 * @param height
 * @type number
 * @default 48
 */
/*~struct~Event:
 * @param eventId
 * @type number
 * @default 1
 * @param x
 * @type number
 * @default 0
 * @param y
 * @type number
 * @default 0
 * @param width
 * @type number
 * @default 48
 * @param height
 * @type number
 * @default 48
 */
/*~struct~Player:
 * @param x
 * @type number
 * @default 0
 * @param y
 * @type number
 * @default 0
 * @param width
 * @type number
 * @default 48
 * @param height
 * @type number
 * @default 48
 */
/*~struct~EventG:
 * @param x
 * @type number
 * @default 0
 * @param y
 * @type number
 * @default 0
 * @param width
 * @type number
 * @default 48
 * @param height
 * @type number
 * @default 48
 */
//#endregion Introduction

//=============================================================================
// * Ignis_PM_Collider
// * new class
//=============================================================================
function IgnisEnginePM() {
    throw new Error("This is a static class");
}
//=============================================================================
// checks Collision only - new function
//=============================================================================
IgnisEnginePM.checkCollisionBox = function (realX1, realY1, hitBox1, realX2, realY2, hitBox2) {
    if (realY1 > realY2 + hitBox2.height / $gameMap.tileHeight() || realX1 + hitBox1.width / $gameMap.tileWidth() < realX2 || realY1 + hitBox1.height / $gameMap.tileHeight() < realY2 || realX1 > realX2 + hitBox2.width / $gameMap.tileWidth()) {
        return false
    }
    return true
};
//=============================================================================
// checks Collision and triggers - new function
//=============================================================================
IgnisEnginePM.checkCollisionBoxTriggers = function (player, event, x, y) {
    let realX1 = x
    let realY1 = y
    let realX2 = event._colisionBox.x / $gameMap.tileWidth() + event._realX
    let realY2 = event._colisionBox.y / $gameMap.tileHeight() + event._realY
    let hitBox1X = realX1 + player._colisionBox.width / $gameMap.tileWidth()
    let hitBox1Y = realY1 + player._colisionBox.height / $gameMap.tileHeight()
    let hitBox2X = realX2 + event._colisionBox.width / $gameMap.tileWidth()
    let hitBox2Y = realY2 + event._colisionBox.height / $gameMap.tileHeight()
    if (realY1 > hitBox2Y || hitBox1X < realX2 || hitBox1Y < realY2 || realX1 > hitBox2X) {
        return false
    }
    if (event.isTriggerIn([1, 2]) &&
        event.isNormalPriority() === true) {
        event.start();
    }
    return true
};

//=============================================================================
// checks Button Trigger - new function
//=============================================================================
IgnisEnginePM.checkCollisionButton = function (player, event, x, y) {
    let realX1 = x
    let realY1 = y
    let realX2 = event._colisionBox.x / $gameMap.tileWidth() + event._realX
    let realY2 = event._colisionBox.y / $gameMap.tileHeight() + event._realY
    let hitBox1X = realX1 + player._colisionBox.width / $gameMap.tileWidth()
    let hitBox1Y = realY1 + player._colisionBox.height / $gameMap.tileHeight()
    let hitBox2X = realX2 + event._colisionBox.width / $gameMap.tileWidth()
    let hitBox2Y = realY2 + event._colisionBox.height / $gameMap.tileHeight()
    if (realY1 > hitBox2Y || hitBox1X < realX2 || hitBox1Y < realY2 || realX1 > hitBox2X) {
        return false
    }
    if (event.isTriggerIn([0]) &&
        event.isNormalPriority() === true) {
        event.start();
    }
    return true
};
//=============================================================================
// changeTileMode - changes to Tile mode and back from certain events
//=============================================================================
IgnisEnginePM.changeTileMode = function (id, tileMode) {
    const events = $gameMap.events();
    let event = events.find(event => event.eventId() === id)
    event.setGridMovement(tileMode);
}
IgnisEnginePM.checkCollisionPlayer = function (eventId) {
    return IgnisEnginePM.checkCollision($gamePlayer, $gameMap.events().find(event => event.eventId() == eventId))
}
IgnisEnginePM.checkCollisionEvents = function (eventId, eventId2) {
    return IgnisEnginePM.checkCollision($gameMap.events().find(event => event.eventId() == eventId2, $gameMap.events().find(event => event.eventId() == eventId)))
}
//=============================================================================
// checks Collision only - new function
//=============================================================================
IgnisEnginePM.checkCollision = function (player, event) {
    let realX1 = player._realX
    let realY1 = player._realY
    let realX2 = event._colisionBox.x / $gameMap.tileWidth() + event._realX
    let realY2 = event._colisionBox.y / $gameMap.tileHeight() + event._realY
    let hitBox1X = realX1 + player._colisionBox.width / $gameMap.tileWidth()
    let hitBox1Y = realY1 + player._colisionBox.height / $gameMap.tileHeight()
    let hitBox2X = realX2 + event._colisionBox.width / $gameMap.tileWidth()
    let hitBox2Y = realY2 + event._colisionBox.height / $gameMap.tileHeight()
    if (realY1 > hitBox2Y || hitBox1X < realX2 || hitBox1Y < realY2 || realX1 > hitBox2X) {
        return false
    }
    return true
};
IgnisEnginePM.loadRegionHitBoxes = function (regionHitBoxes) {
    this.regionHitBoxes = []
    for (var n = 0; n < regionHitBoxes.length; n++) {
        let regionConfig = new Ignis_PM_Collider(JSON.parse(regionHitBoxes[n]));
        this.regionHitBoxes[regionConfig.regionId] = regionConfig;
    }
};

IgnisEnginePM.containsRegion = function (regionId) {
    return this.regionHitBoxes[regionId] != null
};
IgnisEnginePM.getHitBox = function (regionId) {
    return this.regionHitBoxes[regionId].rect
};
//=============================================================================
// * Ignis_PM_Collider
// * new class
//=============================================================================
function Ignis_PM_Collider() {
    this.initialize(...arguments);
}
Ignis_PM_Collider.prototype = Object.create(Object.prototype);
Ignis_PM_Collider.prototype.constructor = Ignis_PM_Collider;

Ignis_PM_Collider.prototype.initialize = function (obj) {
    this.width;
    this.height;
    this.x;
    this.y;
    this.regionId;
    for (var prop in obj) {
        this[prop] = parseInt(obj[prop]);
    }
    this.rect = new Rectangle(this.x, this.y, this.width, this.height);
};

(() => {

    const pluginName = "IgnisPixelMovement";
    PluginManager.registerCommand(pluginName, "collisionSet", args => {
        let collisionObject = JSON.parse(args["collisionBox"])
        let event = $gameMap.events().find(event => event.eventId() == collisionObject.eventId)
        let rect = new Rectangle(collisionObject.x, collisionObject.y, collisionObject.width, collisionObject.height)
        event._colisionBox = rect
    });

    let ignisParameters = PluginManager.parameters('IgnisPixelMovement');
    let ignisCursorSpeed = parseInt(ignisParameters['Cursor Distance'] || 480) / 48;
    let ignisDefaultHitBox = new Rectangle(8, 16, 40, 42)
    let regionHitBoxes = JSON.parse(PluginManager.parameters('IgnisPixelMovement')['Region Collisions']);
    IgnisEnginePM.loadRegionHitBoxes(regionHitBoxes)
    //=============================================================================
    // processMapTouch - function rewrite
    //=============================================================================
    Scene_Map.prototype.processMapTouch = function () {
        if (TouchInput.isPressed() && !this.isAnyButtonPressed()) {
            this.onMapTouch();
        }
    };
    //=============================================================================
    // onMapTouch - rewrite function 
    //=============================================================================
    Scene_Map.prototype.onMapTouch = function () {
        const x = $gameMap.canvasToMapX(TouchInput.x);
        const y = $gameMap.canvasToMapY(TouchInput.y);
        $gameTemp.setDestination(x, y);
    };
    //=============================================================================
    // isPassable - rewrite function 
    //=============================================================================
    Game_Map.prototype.isPixelPassable = function (x, y, hitBox) {
        return this.checkHitArea(x, y, hitBox)
    };
    //=============================================================================
    // checkHitArea - new function 
    //=============================================================================
    Game_Map.prototype.checkHitArea = function (baseX, baseY, hitbox) {
        let hitArea = true
        let x = baseX + hitbox.x / $gameMap.tileWidth()
        let y = baseY + hitbox.y / $gameMap.tileHeight()
        let xBox = x + hitbox.width / $gameMap.tileWidth()
        let yBox = y + hitbox.height / $gameMap.tileHeight()
        hitArea = hitArea && this.retrieveHitArea(x, y, hitbox, baseX, baseY)
        hitArea = hitArea && this.retrieveHitArea(xBox, y, hitbox, baseX, baseY)
        hitArea = hitArea && this.retrieveHitArea(x, yBox, hitbox, baseX, baseY)
        hitArea = hitArea && this.retrieveHitArea(xBox, yBox, hitbox, baseX, baseY)
        return hitArea
    }
    //=============================================================================
    // retrieveHitArea - new function 
    //=============================================================================
    Game_Map.prototype.retrieveHitArea = function (x, y, hitbox, baseX, baseY) {
        let regionId = this.regionId(Math.floor(x), Math.floor(y))
        if (IgnisEnginePM.containsRegion(regionId)) {
            hitboxRegion = IgnisEnginePM.getHitBox(regionId)
            return !IgnisEnginePM.checkCollisionBox(baseX, baseY, hitbox, Math.floor(x) + hitboxRegion.x / $gameMap.tileWidth(), Math.floor(y) + hitboxRegion.y / $gameMap.tileHeight(), hitboxRegion)
        } else {
            return this.checkPassage(Math.floor(x), Math.floor(y), 0x0f)
        }
    }
    //=============================================================================
    // eventsXyNtFloat - new function 
    //=============================================================================
    Game_Map.prototype.eventsXyNtFloat = function (x, y) {
        x = Math.floor(x); y = Math.floor(y)
        return this.events().filter(event => event.posNt(x, y) || event.posNt(x + 1, y) || event.posNt(x, y + 1) || event.posNt(x + 1, y + 1));
    };
    //=============================================================================
    // initialize - alias function 
    //=============================================================================
    let _ignisEngine_Game_CharacterBase_intialize = Game_CharacterBase.prototype.initialize;
    Game_CharacterBase.prototype.initialize = function () {
        _ignisEngine_Game_CharacterBase_intialize.call(this);
        this.speedCorrection = 1
        this._axesX = this._axesY = 0
        this._targetX = this._targetY = 0
        this._colisionBox = new Rectangle(16, 16, 32, 32)
        this._onGridMovement = false
    };
    //=============================================================================
    // initialize - alias function 
    //=============================================================================
    let _ignisEngine_Game_Player_initialize = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function () {
        _ignisEngine_Game_Player_initialize.call(this);
        let defaultHitBox = JSON.parse(PluginManager.parameters('IgnisPixelMovement')['Player Collision']);
        this._colisionBox = new Rectangle(defaultHitBox.x, defaultHitBox.y, defaultHitBox.width, defaultHitBox.height)
    };
    //=============================================================================
    // initialize - alias function 
    //=============================================================================
    let _ignisEngine_Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function (mapId, eventId) {
        _ignisEngine_Game_Event_initialize.call(this, mapId, eventId);
        this._onGridMovement = false
        let defaultHitBox = JSON.parse(PluginManager.parameters('IgnisPixelMovement')['Event Collision']);
        this._colisionBox = new Rectangle(defaultHitBox.x, defaultHitBox.y, defaultHitBox.width, defaultHitBox.height)
    };
    Game_CharacterBase.prototype.setGridMovement = function (gridMove) {
        this._onGridMovement = gridMove
        this._x = parseInt(this._x)
        this._y = parseInt(this._y)
        this._realX = parseInt(this._realX)
        this._realY = parseInt(this._realY)
    }
    //=============================================================================
    // initMembers - alias function 
    //=============================================================================
    let _ignisEngine_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers
    Game_CharacterBase.prototype.initMembers = function () {
        _ignisEngine_Game_CharacterBase_initMembers.call(this)
    }
    //=============================================================================
    // updateMove - rewrite function 
    //=============================================================================
    Game_CharacterBase.prototype.isMoving = function () {
        return this._realX !== this._x || this._realY !== this._y;
    };

    //=============================================================================
    // updateMove - rewrite function
    //=============================================================================
    let _ignisEngine_Game_CharacterBase_updateMove = Game_CharacterBase.prototype.updateMove
    Game_CharacterBase.prototype.updateMove = function () {
        if (this._onGridMovement) { _ignisEngine_Game_CharacterBase_updateMove.call(this); return }
        let patternChange = 0.0
        let direction = 0
        let oldRealX = this._realX
        let oldRealY = this._realY
        let resetX = false
        let resetY = false
        if (this._x < this._realX) {
            direction = 4
            this._realX = Math.max(this._realX - this.distancePerFrame(true), this._x);
            patternChange = this._realX - this._x
        }
        if (this._x > this._realX) {
            direction = 6
            this._realX = Math.min(this._realX + this.distancePerFrame(true), this._x);
            patternChange = this._x - this._realX
        }
        if (this._y < this._realY) {
            this._realY = Math.max(this._realY - this.distancePerFrame(false), this._y);
            if (patternChange > this._realY - this._y)
                direction = 8
        }
        if (this._y > this._realY) {
            this._realY = Math.min(this._realY + this.distancePerFrame(false), this._y);
            if (patternChange > this._y - this._realY)
                direction = 2
        }

        if (direction != 0) { this._direction = direction }

        if (!this.isMapPassable(oldRealX, this._realY, direction)) {
            resetY = true;
        }
        if (!this.isMapPassable(this._realX, oldRealY, direction)) {
            resetX = true;
        }
        if (resetX) { this._realX = oldRealX }
        if (resetY) { this._realY = oldRealY }
        this._y = this._realY
        this._x = this._realX
        if (!this.isMoving()) {
            this.refreshBushDepth();
        }
    }

    Game_Player.prototype.checkEventTriggerTouch = function (x, y) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(x, y, [1, 2], true);
        }
    };
    Game_Event.prototype.checkEventTriggerTouch = function (x, y) {
        if (!$gameMap.isEventRunning()) {
            if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
                if (!this.isJumping() && this.isNormalPriority()) {
                    this.start();
                }
            }
        }
    };
    //=============================================================================
    // canPass - rewrite function 
    //=============================================================================
    let _ignisEngine_Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass
    Game_CharacterBase.prototype.canPass = function (x, y, d) {
        if (this._onGridMovement) { return _ignisEngine_Game_CharacterBase_canPass.call(this, x, y, d) }
        return true;
    };
    //=============================================================================
    // isCollidedWithCharacters - rewrite function 
    //=============================================================================
    Game_CharacterBase.prototype.isCollidedWithCharacters = function (x, y) {
        return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
    };
    //=============================================================================
    // isCollidedWithEvents - rewrite function 
    //=============================================================================
    Game_CharacterBase.prototype.isCollidedWithEvents = function (x, y) {
        const events = $gameMap.eventsXyNtFloat(x, y);
        return events.some(event => event.isNormalPriority() && IgnisEnginePM.checkCollisionBoxTriggers(this, event, x, y));
    };
    //=============================================================================
    // pos - rewrite function 
    //=============================================================================
    Game_CharacterBase.prototype.pos = function (x, y) {
        return Math.floor(this._x) === Math.floor(x) && Math.floor(this._y) === Math.floor(y);
    };
    //=============================================================================
    // isCollidedWithVehicles - rewrite function 
    //=============================================================================
    Game_CharacterBase.prototype.isCollidedWithVehicles = function (x, y) {
        return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
    };
    //=============================================================================
    // distancePerFrame - rewrite function 
    //=============================================================================
    Game_CharacterBase.prototype.distancePerFrame = function (x_axis) {
        if (!Input._gamepadStates[18] || this._axesX == 0 && this._axesY == 0)
            return Math.pow(2, this.realMoveSpeed()) / 256 * this.speedCorrection;
        else
            return this.calculateGamepadAxisSpeed(x_axis)
    };

    //=============================================================================
    // calculateGamepadAxisSpeed - new function
    //=============================================================================
    Game_CharacterBase.prototype.calculateGamepadAxisSpeed = function (x_axis) {
        let baseSpeed = Math.pow(2, this.realMoveSpeed()) / 256
        if (x_axis) {
            baseSpeed *= Math.abs(this._axesY)
        } else {
            baseSpeed *= Math.abs(this._axesX)
        }
        return baseSpeed
    }

    //=============================================================================
    // calculateGamepadAxisSpeed - rewrite function
    //=============================================================================
    Game_CharacterBase.prototype.updateAnimationCount = function () {
        if (this.hasWalkAnime()) {
            this._animationCount += 1.5;
        } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
            this._animationCount++;
        }
    };
    let _ignisEngine_Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable
    Game_CharacterBase.prototype.isMapPassable = function (x, y, d) {
        if (this._onGridMovement) { return _ignisEngine_Game_CharacterBase_isMapPassable.call(this, x, y, d) }
        return !this.isCollidedWithCharacters(x, y, this._colisionBox) && $gameMap.isPixelPassable(x, y, this._colisionBox);
    };
    //=============================================================================
    // moveDiagonallyRaw - new function
    //=============================================================================
    Game_Player.prototype.moveDiagonallyRaw = function (direction) {
        let horz = [1, 7].includes(direction) ? 4 : 6;
        let vert = [1, 3].includes(direction) ? 2 : 8;
        this.moveDiagonally(horz, vert);
    };
    //=============================================================================
    // getInputDirection - rewrite function
    //=============================================================================
    Game_Player.prototype.getInputDirection = function () {
        return Input.dir8;
    };
    //=============================================================================
    // moveByInput - rewrite function
    //=============================================================================
    Game_Player.prototype.moveByInput = function () {
        if (!this.isMoving() && this.canMove()) {
            let direction = this.getInputDirection();
            if (direction > 0) {
                $gameTemp.clearDestination();
            } else if ($gameTemp.isDestinationValid()) {
                const x = $gameTemp.destinationX();
                const y = $gameTemp.destinationY();
                this.executeMoveByCursor(direction, x, y)
            }
            if (direction > 0) {
                this.executeMove(direction);
            }
        }
    };

    //=============================================================================
    // executeMoveByCursor - new function
    //=============================================================================
    Game_Player.prototype.executeMoveByCursor = function (direction, x, y) {
        let difX = x - this._realX
        let difY = y - this._realY
        let hyp = Math.sqrt(difX * difX + difY * difY)
        Input._gamepadStates[18] = true
        let maxSpeedX = Math.abs(difX / ignisCursorSpeed)
        let maxSpeedY = Math.abs(difY / ignisCursorSpeed)
        if (maxSpeedX > 1) { maxSpeedX = 1 }
        if (maxSpeedY > 1) { maxSpeedY = 1 }
        this.executeMove(direction, difX * maxSpeedX / hyp, difY * maxSpeedY / hyp);
    }
    //=============================================================================
    // executeMove - rewrite function 
    //=============================================================================
    Game_Player.prototype.executeMove = function (direction, axesY = Input._gamepadStates[19], axesX = Input._gamepadStates[18]) {
        if (axesX > 0) {
            if (axesY > 0) {
                direction = 3
            } else {
                direction = 1
            }
        }
        if (axesX < 0) {
            if (axesY > 0) {
                direction = 9
            } else {
                direction = 7
            }
        }
        this._axesX = axesX
        this._axesY = axesY
        if (!this._axesX || !this._axesY)
            Input._gamepadStates[18] = false
        if ([1, 3, 7, 9].includes(direction)) {
            this.speedCorrection = 1.0;
            this.moveDiagonallyRaw(direction);
        } else if ([2, 4, 6, 8].includes(direction)) {
            this.speedCorrection = 1;
            this.moveStraight(direction);
        }

    };
    Game_Player.prototype.triggerButtonAction = function () {
        if (Input.isTriggered("ok")) {
            this.checkCollisionButtonAction(this._realX, this._realY, this._direction)
        }
        return false;
    };

    Game_Player.prototype.checkCollisionButtonAction = function (x, y, d) {
        switch (d) {
            case 2:
                y = Math.min(y + this.distancePerFrame(true), y);
                break
            case 4:
                x = Math.min(x - this.distancePerFrame(true), x);
                break
            case 6:
                x = Math.max(x + this.distancePerFrame(true), x);
                break
            case 8:
                y = Math.min(y - this.distancePerFrame(true), y);
                break
        }
        this.isCollidedWithEventsPush(x, y);
    };



    //=============================================================================
    // isCollidedWithEventsPush - new function 
    //=============================================================================
    Game_Player.prototype.isCollidedWithEventsPush = function (x, y) {
        const events = $gameMap.eventsXyNtFloat(x, y);
        return events.some(event => event.isNormalPriority() && IgnisEnginePM.checkCollisionButton(this, event, x, y));
    };
    //=============================================================================
    // isCollidedWithEvents - rewrite function 
    //=============================================================================
    Game_Event.prototype.isCollidedWithEvents = function (x, y) {
        const events = $gameMap.eventsXyNtFloat(x, y);
        events.filter(event => event.isNormalPriority() && IgnisEnginePM.checkCollisionBox(x, y, this._colisionBox, event._realX, event._realY, event._colisionBox));
        return events.length > 1
    };
    //=============================================================================
    // _updateGamepadState - updates the gamepad buttons
    //=============================================================================
    let _ignisEngine_Input_updateGamepadState = Input._updateGamepadState
    Input._updateGamepadState = function (gamepad) {
        const axes = gamepad.axes;
        _ignisEngine_Input_updateGamepadState.call(this, gamepad)
        this._gamepadStates[18] = axes[1]
        this._gamepadStates[19] = axes[0]
    };
})();
