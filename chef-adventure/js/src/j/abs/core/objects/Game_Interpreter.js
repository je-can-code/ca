//region Game_Interpreter
/**
 * Enables setting move routes of `Game_Character`s on the map with JABS.
 * @param {number} param The character/event id to get the data for.
 * @returns {Game_Character}
 */
J.ABS.Aliased.Game_Interpreter.character = Game_Interpreter.prototype.character;
Game_Interpreter.prototype.character = function(param)
{
  if ($jabsEngine.absEnabled)
  {
    if (param < 0)
    {
      return $gamePlayer;
    }
    else if (this.isOnCurrentMap())
    {
      const id = param > 0 ? param : this._eventId;
      return $gameMap.event(id);
    }
    else
    {
      return null;
    }
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.character.call(this, param);
  }
};

/**
 * Enables transferring with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command201 = Game_Interpreter.prototype.command201;
Game_Interpreter.prototype.command201 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    if ($gameMessage.isBusy()) return false;

    let mapId;
    let x;
    let y;
    if (params[0] === 0)
    {
      mapId = params[1];
      x = params[2];
      y = params[3];
    }
    else
    {
      mapId = $gameVariables.value(params[1]);
      x = $gameVariables.value(params[2]);
      y = $gameVariables.value(params[3]);
    }

    $gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5]);
    this.setWaitMode("transfer");
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command201.call(this, params);
  }
};

/**
 * Enables map scrolling with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command204 = Game_Interpreter.prototype.command204;
Game_Interpreter.prototype.command204 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    if ($gameMap.isScrolling())
    {
      this.setWaitMode("scroll");
      return false;
    }

    $gameMap.startScroll(params[0], params[1], params[2]);
    if (params[3])
    {
      this.setWaitMode("scroll");
    }

    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command204.call(this, params);
  }
};

/**
 * Enables default battles with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 *
 * NOTE: Though the battling is enabled, the battles may not behave as one would
 * expect from a default battle system when using an ABS as well.
 */
J.ABS.Aliased.Game_Interpreter.command301 = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    let troopId;
    switch (params[0])
    {
      case 0:
        // Direct designation
        troopId = params[1];
        break;
      case 1:
        // Designation with a variable
        troopId = $gameVariables.value(params[1]);
        break;
      default:
        // Same as Random Encounters
        troopId = $gamePlayer.makeEncounterTroopId();
        break;
    }

    if ($dataTroops[troopId])
    {
      BattleManager.setup(troopId, params[2], params[3]);
      BattleManager.setEventCallback(n => this._branch[this._indent] = n);
      $gamePlayer.makeEncounterCount();
      SceneManager.push(Scene_Battle);
    }

    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command301.call(this, params);
  }
};

/**
 * Enables the shop scene with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command302 = Game_Interpreter.prototype.command302;
Game_Interpreter.prototype.command302 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    const goods = [params];
    while (this.nextEventCode() === 605)
    {
      this._index++;
      goods.push(this.currentCommand().parameters);
    }

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, params[4]);
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command302.call(this, params);
  }
};

/**
 * Enables the name input processing with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command303 = Game_Interpreter.prototype.command303;
Game_Interpreter.prototype.command303 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    if ($dataActors[params[0]])
    {
      SceneManager.push(Scene_Name);
      SceneManager.prepareNextScene(params[0], params[1]);
    }

    return true;
  }

  return J.ABS.Aliased.Game_Interpreter.command303.call(this, params);
};

/**
 * Enables saving with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command352 = Game_Interpreter.prototype.command352;
Game_Interpreter.prototype.command352 = function()
{
  if ($jabsEngine.absEnabled)
  {
    SceneManager.push(Scene_Save);
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command352.call(this);
  }
};
//endregion Game_Interpreter