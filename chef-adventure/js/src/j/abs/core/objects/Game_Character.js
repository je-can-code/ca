//region Game_Character
/**
 * Hooks into the `Game_Character.initMembers` and adds in action sprite properties.
 */
J.ABS.Aliased.Game_Character.set('initMembers', Game_Character.prototype.initMembers);
Game_Character.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Character.get('initMembers').call(this);

  // initialize our custom members.
  this.initJabsMembers();
};

/**
 * Initialize any custom JABS properties for this character.
 */
Game_Character.prototype.initJabsMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  // initialize the custom properties.
  this.initJabsActionMembers();
  this.initJabsLootMembers();
};

// TODO: cleanup the getters/setters for action sprites.
/**
 * Initializes the action sprite properties for this character.
 */
Game_Character.prototype.initJabsActionMembers = function()
{
  /**
   * The block of all action-related data associated with this character.
   */
  this._j._abs._action = {};

  /**
   * The actual action for this character.
   * @type {JABS_Action|null}
   */
  this._j._abs._action.actionData = null;

  /**
   * Whether or not this action needs to be added to the map visually.
   * @type {boolean}
   */
  this._j._abs._action.needsAdding = false;

  /**
   * Whether or not this action needs to be removed from the map visually.
   * @type {boolean}
   */
  this._j._abs._action.needsRemoving = false;

  /**
   * The uuid for this character.
   * @type {string|String.empty}
   */
  this._j._abs._action.battlerUuid = String.empty;
};

/**
 * Initializes the loot sprite properties.
 */
Game_Character.prototype.initJabsLootMembers = function()
{
  /**
   * The block of all loot-related data associated with this character.
   */
  this._j._abs._loot = {};

  /**
   * Whether or not this loot needs to be added to the map visually.
   * @type {boolean}
   */
  this._j._abs._loot._needsAdding = false;

  /**
   * Whether or not this loot needs to be removed from the map visually.
   * @type {boolean}
   */
  this._j._abs._loot._needsRemoving = false;

  /**
   * The underlying loot data.
   * @type {JABS_LootDrop|null}
   */
  this._j._abs._loot._data = null;
};

//region JABS action
/**
 * If the event has a `JABS_Action` associated with it, return that.
 * @returns {JABS_Action}
 */
Game_Character.prototype.getJabsAction = function()
{
  return this._j._abs._action.actionData;
};

/**
 * Binds a `JABS_Action` to this character.
 * @param {JABS_Action} action The action to assign to this character.
 */
Game_Character.prototype.setJabsAction = function(action)
{
  this._j._abs._action.actionData = action;
};

/**
 * Gets whether or not this character is an action.
 * @returns {boolean} True if this is an action, false otherwise.
 */
Game_Character.prototype.isJabsAction = function()
{
  return !!this.getJabsAction();
};

/**
 * Gets whether or not the underlying `JABS_Action` requires removal from the map.
 * @returns {boolean} True if removal is required, false otherwise.
 */
Game_Character.prototype.getJabsActionNeedsRemoving = function()
{
  // if it is not an action, don't remove whatever it is.
  if (!this.isJabsAction()) return false;

  // return whether or not the removal is needed.
  return this.getJabsAction().getNeedsRemoval();
};

/**
 * Gets the `uuid` of the underlying {@link JABS_Action}.
 * @return {string|String.empty} The uuid when there is an action, {@link String.empty} otherwise.
 */
Game_Character.prototype.getJabsActionUuid = function()
{
  // grab the underlying action data.
  const jabsAction = this.getJabsAction();

  // validate we have the action data.
  if (jabsAction)
  {
    // return the underlying uuid of the action.
    return jabsAction.getUuid();
  }
  // there is no action data.
  else
  {
    // there is no uuid.
    return String.empty;
  }
};

/**
 * Gets the `needsAdding` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsAdding = function()
{
  return this._j._abs._action.needsAdding;
};

/**
 * Sets the `needsAdding` property from the `actionSpriteProperties` for this event.
 * @param {boolean} addSprite True if you want this event to be added, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsAdding = function(addSprite = true)
{
  this._j._abs._action.needsAdding = addSprite;
};

// TODO: remove getter/setter for sprite removal, shift responsibility to action?
/**
 * Gets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsRemoving = function()
{
  return this._j._abs._action.needsRemoving;
};

/**
 * Sets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 * @param {boolean} removeSprite True if you want this event to be removed, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsRemoving = function(removeSprite = true)
{
  this._j._abs._action.needsRemoving = removeSprite;
};
//endregion JABS action

//region JABS battler
/**
 * Gets the `uuid` of this `JABS_Battler`.
 */
Game_Character.prototype.getJabsBattlerUuid = function()
{
  return this._j._abs._action.battlerUuid;
};

/**
 * Sets the provided `JABS_Battler` to this character.
 * @param {string} uuid The uuid of the `JABS_Battler` to set to this character.
 */
Game_Character.prototype.setJabsBattlerUuid = function(uuid)
{
  this._j._abs._action.battlerUuid = uuid;
};

/**
 * Gets whether or not this character has a `JABS_Battler` attached to it.
 */
Game_Character.prototype.hasJabsBattler = function()
{
  // grab the uuid of the battler.
  const uuid = this.getJabsBattlerUuid();

  // if we have no uuid, then this character does not have a battler.
  if (!uuid) return false;

  // grab the tracked battler by its uuid.
  const battler = JABS_AiManager.getBattlerByUuid(uuid);

  // if there is no tracked battler, then this character doesn't have a battler.
  if (!battler)
  {
    // clear the battler so we don't check again.
    this.setJabsBattlerUuid(String.empty);

    // there is no battler on this character.
    return false;
  }

  // we have a battler!
  return true;
};

/**
 * Gets the `JABS_Battler` associated with this character.
 * @returns {JABS_Battler}
 */
Game_Character.prototype.getJabsBattler = function()
{
  // grab the uuid of this character.
  const uuid = this.getJabsBattlerUuid();

  // return the tracked battler.
  return JABS_AiManager.getBattlerByUuid(uuid);
};
//endregion JABS battler

//region JABS loot
/**
 * Gets the loot data for this character/event.
 * @returns {JABS_LootDrop}
 */
Game_Character.prototype.getJabsLoot = function()
{
  return this._j._abs._loot._data;
};

/**
 * Sets the loot data to the provided loot.
 * @param {RPG_EquipItem|RPG_Item} data The loot data to assign to this character/event.
 */
Game_Character.prototype.setJabsLoot = function(data)
{
  this._j._abs._loot._data = data;
};

/**
 * Whether or not this character is/has loot.
 */
Game_Character.prototype.isJabsLoot = function()
{
  return !!this.getJabsLoot();
};

/**
 * Gets whether or not this loot needs rendering onto the map.
 * @returns {boolean} True if needing rendering, false otherwise.
 */
Game_Character.prototype.getLootNeedsAdding = function()
{
  return this._j._abs._loot._needsAdding;
};

/**
 * Sets the loot to need rendering onto the map.
 * @param {boolean} needsAdding Whether or not this loot needs adding.
 */
Game_Character.prototype.setLootNeedsAdding = function(needsAdding = true)
{
  this._j._abs._loot._needsAdding = needsAdding;
};

/**
 * Gets whether or not this loot object is flagged for removal.
 */
Game_Character.prototype.getLootNeedsRemoving = function()
{
  return this._j._abs._loot._needsRemoving;
};

/**
 * Sets the loot object to be flagged for removal.
 * @param {boolean} needsRemoving True if we want to remove the loot, false otherwise.
 */
Game_Character.prototype.setLootNeedsRemoving = function(needsRemoving = true)
{
  this._j._abs._loot._needsRemoving = needsRemoving;
};
//endregion JABS loot

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

/**
 * Extends {@link Game_Character.isMovementSucceeded}.
 * Includes handling for battlers being move-locked by JABS.
 * @returns {boolean}
 */
J.ABS.Aliased.Game_Character.set('isMovementSucceeded', Game_Character.prototype.isMovementSucceeded);
Game_Character.prototype.isMovementSucceeded = function()
{
  // grab the underlying battler.
  const battler = this.getJabsBattler();

  // validate we have a battler and that they can move.
  if (battler && !battler.canBattlerMove())
  {
    // if we have a battler that also cannot move, then movement never succeeds.
    return false;
  }

  // otherwise, perform original logic.
  return J.ABS.Aliased.Game_Character.get('isMovementSucceeded').call(this);
};

/* eslint-disable */
/**
 * Intelligently determines the next step to take on a path to the destination `x,y`.
 * @param {number} goalX The `x` coordinate trying to be reached.
 * @param {number} goalY The `y` coordinate trying to be reached.
 * @returns {1|2|3|4|6|7|8|9} The direction decided.
 */
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
    let bestIndex = 0;
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

      const [horz, vert] = directions;
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
//endregion Game_Character