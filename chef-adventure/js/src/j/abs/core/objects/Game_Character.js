//#region Game_Character
/**
 * Hooks into the `Game_Character.initMembers` and adds in action sprite properties.
 */
J.ABS.Aliased.Game_Character.initMembers = Game_Character.prototype.initMembers;
Game_Character.prototype.initMembers = function()
{
  this._j = this._j || {};
  J.ABS.Aliased.Game_Character.initMembers.call(this);
  this.initActionSpriteProperties();
  this.initLootSpriteProperties();
};

/**
 * Initializes the action sprite properties for this character.
 */
Game_Character.prototype.initActionSpriteProperties = function()
{
  this._j._action = {
    actionData: null,
    needsAdding: false,
    needsRemoving: false,
    battlerUuid: String.empty,
  }
};

/**
 * Initializes the loot sprite properties.
 */
Game_Character.prototype.initLootSpriteProperties = function()
{
  this._j._loot = {
    _needsAdding: false,
    _needsRemoving: false,
    _data: null,
  };
};

/**
 * Gets the loot sprite properties for this event.
 * @returns {object}
 */
Game_Character.prototype.getLootSpriteProperties = function()
{
  return this._j._loot;
};

/**
 * Whether or not this character is/has loot.
 */
Game_Character.prototype.isLoot = function()
{
  return !!this.getLootData();
};

/**
 * Gets whether or not this loot needs rendering onto the map.
 * @returns {boolean} True if needing rendering, false otherwise.
 */
Game_Character.prototype.getLootNeedsAdding = function()
{
  const loot = this.getLootSpriteProperties();
  return loot._needsAdding;
};

/**
 * Sets the loot to need rendering onto the map.
 * @param {boolean} needsAdding Whether or not this loot needs adding.
 */
Game_Character.prototype.setLootNeedsAdding = function(needsAdding = true)
{
  const loot = this.getLootSpriteProperties();
  loot._needsAdding = needsAdding;
};

/**
 * Gets whether or not this loot object is flagged for removal.
 */
Game_Character.prototype.getLootNeedsRemoving = function()
{
  const loot = this.getLootSpriteProperties();
  return loot._needsRemoving;
};

/**
 * Sets the loot object to be flagged for removal.
 * @param {boolean} needsRemoving True if we want to remove the loot, false otherwise.
 */
Game_Character.prototype.setLootNeedsRemoving = function(needsRemoving = true)
{
  const loot = this.getLootSpriteProperties();
  loot._needsRemoving = needsRemoving;
};

/**
 * Gets the loot data for this character/event.
 * @returns {JABS_LootDrop}
 */
Game_Character.prototype.getLootData = function()
{
  const loot = this.getLootSpriteProperties();
  return loot._data;
};

/**
 * Gets whether or not this loot data is use-on-pickup or not.
 * @returns {boolean}
 */
Game_Character.prototype.isUseOnPickupLoot = function()
{
  return this.getLootData().useOnPickup;
};

/**
 * Sets the loot data to the provided loot.
 * @param {object} data The loot data to assign to this character/event.
 */
Game_Character.prototype.setLootData = function(data)
{
  const loot = this.getLootSpriteProperties();
  loot._data = data;
};

/**
 * Gets all action sprite properties for this event.
 */
Game_Character.prototype.getActionSpriteProperties = function()
{
  return this._j._action;
};

/**
 * Gets whether or not this character is an action.
 * @returns {boolean} True if this is an action, false otherwise.
 */
Game_Character.prototype.isAction = function()
{
  return !!this.getMapActionData();
};

/**
 * If the event has a `JABS_Action` associated with it, return that.
 * @returns {JABS_Action}
 */
Game_Character.prototype.getMapActionData = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  if (actionSpriteProperties.actionData)
  {
    return actionSpriteProperties.actionData;
  }
  else
  {
    return null;
  }
};

/**
 * Gets whether or not the underlying `JABS_Action` requires removal from the map.
 * @returns {boolean} True if removal is required, false otherwise.
 */
Game_Character.prototype.getJabsActionNeedsRemoving = function()
{
  // if it is not an action, don't remove whatever it is.
  if (!this.isAction()) return false;

  // return whether or not the removal is needed.
  return this.getMapActionData().getNeedsRemoval();
};

/**
 * Gets the `uuid` of this event's underlying action, if it exists.
 * @returns {string}
 */
Game_Character.prototype.getMapActionUuid = function()
{
  const actionData = this.getMapActionData();
  if (actionData)
  {
    return actionData.getUuid();
  }
  else
  {
    return null;
  }
};

/**
 * Gets the `uuid` of this `JABS_Battler`.
 */
Game_Character.prototype.getActionUuid = function()
{
  const jabsAction = this.getMapActionData();
  return jabsAction.getUuid();
};

/**
 * Gets the `JABS_Battler` associated with this character.
 * @returns {JABS_Battler}
 */
Game_Character.prototype.getJabsBattler = function()
{
  const uuid = this.getJabsBattlerUuid();
  return $gameMap.getBattlerByUuid(uuid);
};

/**
 * Gets the `uuid` of this `JABS_Battler`.
 */
Game_Character.prototype.getJabsBattlerUuid = function()
{
  const asp = this.getActionSpriteProperties();
  return asp.battlerUuid;
};

/**
 * Sets the provided `JABS_Battler` to this character.
 * @param {string} uuid The uuid of the `JABS_Battler` to set to this character.
 */
Game_Character.prototype.setMapBattler = function(uuid)
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.battlerUuid = uuid;
};

Game_Character.prototype.clearMapBattler = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.battlerUuid = String.empty;
};

/**
 * Gets whether or not this character has a `JABS_Battler` attached to it.
 */
Game_Character.prototype.hasJabsBattler = function()
{
  const asp = this.getActionSpriteProperties();
  const uuid = asp.battlerUuid;
  if (!uuid) return false;

  const battler = $gameMap.getBattlerByUuid(uuid);
  if (!battler) return false;

  return true;
};

/**
 * Gets the `needsAdding` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsAdding = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsAdding;
};

/**
 * Sets the `needsAdding` property from the `actionSpriteProperties` for this event.
 * @param {boolean} addSprite True if you want this event to be added, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsAdding = function(addSprite = true)
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.needsAdding = addSprite;
};

/**
 * Gets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsRemoving = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsRemoving;
};

/**
 * Sets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 * @param {boolean} removeSprite True if you want this event to be removed, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsRemoving = function(removeSprite = true)
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsRemoving = removeSprite;
};

/**
 * Execute an animation of a provided id upon this character.
 * @param {number} animationId The animation id to execute on this character.
 * @param {boolean} parried Whether or not the animation being requested was parried.
 */
Game_Character.prototype.requestAnimation = function(animationId, parried = false)
{
  // TODO: remove the parry logic out of this function.
  // check if we parried.
  if (parried)
  {
    // TODO: extract this.
    const parryAnimationId = 122;

    // request the animation on this character.
    $gameTemp.requestAnimation([this], parryAnimationId);
  }
  else
  {
    $gameTemp.requestAnimation([this], animationId);
  }
};

J.ABS.Aliased.Game_Character.isMovementSucceeded = Game_Character.prototype.isMovementSucceeded;
Game_Character.prototype.isMovementSucceeded = function()
{
  const battler = this.getJabsBattler();
  if (battler && !battler.canBattlerMove())
  {
    return false;
  }
  else
  {
    return J.ABS.Aliased.Game_Character.isMovementSucceeded.call(this);
  }
};

/**
 * Determines if a numeric directional input is diagonal.
 * @param {number} direction The direction to check.
 * @returns {boolean} True if the input is diagonal, false otherwise.
 */
Game_Character.prototype.isDiagonalDirection = function(direction)
{
  return [1, 3, 7, 9].contains(direction);
};

/**
 * Determines if a numeric directional input is straight.
 * @param {number} direction The direction to check.
 * @returns {boolean} True if the input is straight, false otherwise.
 */
Game_Character.prototype.isStraightDirection = function(direction)
{
  return [2, 4, 6, 8].contains(direction);
};

/**
 * Determines the horz/vert directions to move based on a diagonal direction.
 * @param {number} direction The diagonal-only numeric direction to move.
 */
Game_Character.prototype.getDiagonalDirections = function(direction)
{
  switch (direction)
  {
    case 1:
      return [4, 2];
    case 3:
      return [6, 2];
    case 7:
      return [4, 8];
    case 9:
      return [6, 8];
  }
};

/**
 * Intelligently determines the next step to take on a path to the destination `x,y`.
 * @param {number} goalX The `x` coordinate trying to be reached.
 * @param {number} goalY The `y` coordinate trying to be reached.
 */
/* eslint-disable */
Game_Character.prototype.findDiagonalDirectionTo = function(goalX, goalY)
{
  const searchLimit = this.searchLimit();
  const mapWidth = $gameMap.width();
  const nodeList = [];
  const openList = [];
  const closedList = [];
  const start = {};
  let best = start;
  let goaled = false;

  if (this.x === goalX && this.y === goalY)
  {
    return 0;
  }

  start.parent = null;
  start.x = this.x;
  start.y = this.y;
  start.g = 0;
  start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
  nodeList.push(start);
  openList.push(start.y * mapWidth + start.x);

  while (nodeList.length > 0)
  {
    var bestIndex = 0;
    for (var i = 0; i < nodeList.length; i++)
    {
      if (nodeList[i].f < nodeList[bestIndex].f)
      {
        bestIndex = i;
      }
    }

    const current = nodeList[bestIndex];
    const x1 = current.x;
    const y1 = current.y;
    const pos1 = y1 * mapWidth + x1;
    const g1 = current.g;

    nodeList.splice(bestIndex, 1);
    openList.splice(openList.indexOf(pos1), 1);
    closedList.push(pos1);

    if (current.x === goalX && current.y === goalY)
    {
      best = current;
      goaled = true;
      break;
    }

    if (g1 >= searchLimit)
    {
      continue;
    }

    for (var j = 1; j <= 9; j++)
    {
      if (j === 5)
      {
        continue;
      }
      var directions;
      if (this.isDiagonalDirection(j))
      {
        directions = this.getDiagonalDirections(j);
      }
      else
      {
        directions = [j, j];
      }

      const horz = directions[0];
      const vert = directions[1];
      const x2 = $gameMap.roundXWithDirection(x1, horz);
      const y2 = $gameMap.roundYWithDirection(y1, vert);
      const pos2 = y2 * mapWidth + x2;

      if (closedList.contains(pos2))
      {
        continue;
      }

      if (this.isStraightDirection(j))
      {
        if (!this.canPass(x1, y1, j))
        {
          continue;
        }
      }
      else if (this.isDiagonalDirection(j))
      {
        if (!this.canPassDiagonally(x1, y1, horz, vert))
        {
          continue;
        }
      }

      var g2 = g1 + 1;
      var index2 = openList.indexOf(pos2);

      if (index2 < 0 || g2 < nodeList[index2].g)
      {
        var neighbor;
        if (index2 >= 0)
        {
          neighbor = nodeList[index2];
        }
        else
        {
          neighbor = {};
          nodeList.push(neighbor);
          openList.push(pos2);
        }
        neighbor.parent = current;
        neighbor.x = x2;
        neighbor.y = y2;
        neighbor.g = g2;
        neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
        if (!best || neighbor.f - neighbor.g < best.f - best.g)
        {
          best = neighbor;
        }
      }
    }
  }

  let node = best;
  while (node.parent && node.parent !== start)
  {
    node = node.parent;
  }

  const deltaX1 = $gameMap.deltaX(node.x, start.x);
  const deltaY1 = $gameMap.deltaY(node.y, start.y);
  if (deltaY1 > 0)
  {
    return deltaX1 === 0 ? 2 : deltaX1 > 0 ? 3 : 1;
  }
  else if (deltaY1 < 0)
  {
    return deltaX1 === 0 ? 8 : deltaX1 > 0 ? 9 : 7;
  }
  else
  {
    if (deltaX1 !== 0)
    {
      return deltaX1 > 0 ? 6 : 4;
    }
  }

  const deltaX2 = this.deltaXFrom(goalX);
  const deltaY2 = this.deltaYFrom(goalY);
  if (Math.abs(deltaX2) > Math.abs(deltaY2))
  {
    if (deltaX2 > 0)
    {
      return deltaY2 === 0 ? 4 : deltaY2 > 0 ? 7 : 1;
    }
    else if (deltaX2 < 0)
    {
      return deltaY2 === 0 ? 6 : deltaY2 > 0 ? 9 : 3;
    }
    else
    {
      return deltaY2 === 0 ? 0 : deltaY2 > 0 ? 8 : 2;
    }
  }
  else
  {
    if (deltaY2 > 0)
    {
      return deltaX2 === 0 ? 8 : deltaX2 > 0 ? 7 : 9;
    }
    else if (deltaY2 < 0)
    {
      return deltaX2 === 0 ? 2 : deltaX2 > 0 ? 1 : 3;
    }
    else
    {
      return deltaX2 === 0 ? 0 : deltaX2 > 0 ? 4 : 6;
    }
  }
};
/* eslint-enable */
//#endregion Game_Character