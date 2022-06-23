//#region Game_Event
J.ABS.Aliased.Game_Event.initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function()
{
  this._j = this._j || {};

  /**
   * The various parameters extracted from the event on the field.
   * These parameters describe a battler's core data points so that
   * their `JABS_Battler` can be constructed.
   * @type {JABS_BattlerCoreData}
   */
  this._j._battlerData = null;

  /**
   * The initial direction this event is facing.
   */
  this._j._initialDirection = 0;

  /**
   * The direction the player was facing when the skill was executed.
   * Only applicable to action events.
   * @type {number}
   */
  this._j._castedDirection = 0;
  J.ABS.Aliased.Game_Event.initMembers.call(this);
};

/**
 * Binds a `JABS_Action` to a `Game_Event`.
 * @param {JABS_Action} action The action to assign to this `Game_Event`.
 */
Game_Event.prototype.setMapActionData = function(action)
{
  this._j._action.actionData = action;
};

/**
 * Sets the initial direction being faced on this event's creation.
 * @param {number} direction The initial direction faced on creation.
 */
Game_Event.prototype.setCustomDirection = function(direction)
{
  // don't turn if direction is fixed.
  if (this.isDirectionFixed()) return;

  this._j._initialDirection = direction;
};

/**
 * Gets the initial direction being faced on this event's creation.
 * @returns {number}
 */
Game_Event.prototype.getCustomDirection = function()
{
  return this._j._initialDirection;
};

/**
 * Sets the initial direction being faced on this event's creation.
 * @param {number} direction The initial direction faced on creation.
 */
Game_Event.prototype.setCastedDirection = function(direction)
{
  // don't turn if direction is fixed.
  if (this.isDirectionFixed()) return;

  this._j._castedDirection = direction;
};

/**
 * Gets the initial direction being faced on this event's creation.
 * @returns {number}
 */
Game_Event.prototype.getCastedDirection = function()
{
  return this._j._castedDirection;
};

/**
 * Modifies the `.event` method of `Game_Event` to return the data from the
 * $actionMap if it isn't a normal event.
 */
J.ABS.Aliased.Game_Event.event = Game_Event.prototype.event;
Game_Event.prototype.event = function()
{
  if (this.isAction())
  {
    return $jabsEngine.event(this.getMapActionUuid());
  }

  return J.ABS.Aliased.Game_Event.event.call(this);
};

/**
 * Adds an extra catch so that if there is a failure, then the failure is
 * silently ignored because bad timing is just bad luck!
 */
J.ABS.Aliased.Game_Event.findProperPageIndex = Game_Event.prototype.findProperPageIndex;
Game_Event.prototype.findProperPageIndex = function()
{
  try
  {
    const test = J.ABS.Aliased.Game_Event.findProperPageIndex.call(this);
    if (Number.isInteger(test)) return test;
  }
  catch (err)
  {
    return -1;
  }
};

/**
 * OVERWRITE When an map battler is hidden by something like a switch or some
 * other condition, unveil it upon meeting such conditions.
 */
J.ABS.Aliased.Game_Event.refresh = Game_Event.prototype.refresh;
Game_Event.prototype.refresh = function()
{
  if ($jabsEngine.absEnabled)
  {
    // don't refresh loot.
    if (this.isLoot()) return;

    const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
    if (this._pageIndex !== newPageIndex)
    {
      this._pageIndex = newPageIndex;
      this.setupPage();
      this.transformBattler();
    }
  }
  else
  {
    J.ABS.Aliased.Game_Event.refresh.call(this);
  }
};

/**
 * Extends this method to accommodate for the possibility of that one
 * error propping up where an attempt to update an event that is no longer
 * available for updating causing the game to crash.
 */
J.ABS.Aliased.Game_Event.page = Game_Event.prototype.page;
Game_Event.prototype.page = function()
{
  if (this.event())
  {
    return J.ABS.Aliased.Game_Event.page.call(this);
  }

  /*
  console.log($dataMap.events);
  console.log($gameMap._events);
  console.warn(this);
  console.warn('that thing happened again, you should probably look into this.');
  */
  return null;
};

/**
 * Reveals a battler that was hidden.
 */
Game_Event.prototype.transformBattler = function()
{
  const battler = this.getJabsBattler();
  if (battler)
  {
    battler.revealHiddenBattler();
  }

  $gameMap.refreshOneBattler(this);
};

/**
 * Extends the pagesettings for events and adds on custom parameters to this event.
 */
J.ABS.Aliased.Game_Event.setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Event.setupPageSettings.call(this);

  // parse the comments on the event to potentially transform it into a battler.
  this.parseEnemyComments();
};

/**
 * Parses the comments of this event to extract battler core data if available.
 *
 * JABS parameters are prioritized in this order:
 *  1) from the comments on the event page itself.
 *  2) from the notes of the enemy in the database (requires at least enemy id in comments).
 *  3) from the defaults of all enemies.
 */
Game_Event.prototype.parseEnemyComments = function()
{
  // apply the custom move speeds from this event if any are available.
  this.applyCustomMoveSpeed();

  // if there is something stopping us from parsing comments, then do not.
  if (!this.canParseEnemyComments())
  {
    this.initializeCoreData(null);
    return;
  }

  //  determine our overrides.
  const battlerId = this.getBattlerIdOverrides();
  let teamId = this.getTeamIdOverrides();
  const ai = this.getBattlerAiOverrides();
  const sightRange = this.getSightRangeOverrides();
  const alertedSightBoost = this.getAlertedSightBoostOverrides();
  const pursuitRange = this.getPursuitRangeOverrides();
  const alertedPursuitBoost = this.getAlertedPursuitBoostOverrides();
  const alertDuration = this.getAlertDurationOverrides();
  let canIdle = this.getCanIdleOverrides();
  let showHpBar = this.getShowHpBarOverrides();
  let showBattlerName = this.getShowBattlerNameOverrides();
  const isInvincible = this.getInvincibleOverrides();
  const isInanimate = this.getInanimateOverrides();

  // if inanimate, override the overrides with these instead.
  if (isInanimate)
  {
    // inanimate objects belong to the neutral team.
    teamId = JABS_Battler.neutralTeamId();

    // inanimate objects cannot idle, lack hp bars, and won't display their name.
    canIdle = false;
    showHpBar = false;
    showBattlerName = false;
  }

  // setup the core data and assign it.
  const enemyBattler = $gameEnemies.enemy(battlerId);
  const battlerCoreData = new JABS_CoreDataBuilder(battlerId)
    .setTeamId(teamId ?? enemyBattler.teamId())
    .setBattlerAi(ai ?? enemyBattler.ai())
    .setSightRange(sightRange ?? enemyBattler.sightRange())
    .setAlertedSightBoost(alertedSightBoost ?? enemyBattler.alertedSightBoost())
    .setPursuitRange(pursuitRange ?? enemyBattler.pursuitRange())
    .setAlertedPursuitBoost(alertedPursuitBoost ?? enemyBattler.alertedPursuitBoost())
    .setAlertDuration(alertDuration ?? enemyBattler.alertDuration())
    .setCanIdle(canIdle ?? enemyBattler.canIdle())
    .setShowHpBar(showHpBar ?? enemyBattler.showHpBar())
    .setShowBattlerName(showBattlerName ?? enemyBattler.showBattlerName())
    .setIsInvincible(isInvincible ?? enemyBattler.isInvincible())
    .setIsInanimate(isInanimate ?? enemyBattler.isInanimate())
    .build();

  // build the core data based on this.
  this.initializeCoreData(battlerCoreData);
};

//#region overrides
/**
 * Parses out the enemy id from a list of event commands.
 * @returns {number} The found battler id, or 0 if not found.
 */
Game_Event.prototype.getBattlerIdOverrides = function()
{
  // all variables gotta start somewhere.
  let battlerId = 0;

  // check all the valid event commands to see what our battler id is.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const comment = command.parameters[0];

    // check if this is a matching line.
    if (/<(?:e|enemy|enemyId):[ ]?([0-9]*)>/i.test(comment))
    {
      // parse the value out of the regex capture group.
      battlerId = parseInt(RegExp.$1);
    }
  });

  // return what we found.
  return battlerId;
};

/**
 * Parses out the team id from a list of event commands.
 * @returns {number|null} The found team id, or null if not found.
 */
Game_Event.prototype.getTeamIdOverrides = function()
{
  // all variables gotta start somewhere.
  let teamId = 1;

  // check all the valid event commands to see if we have an override for team.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const comment = command.parameters[0];

    // check if this is a matching line.
    if (/<(?:team|teamId):[ ]?([0-9]*)>/i.test(comment))
    {
      // parse the value out of the regex capture group.
      teamId = parseInt(RegExp.$1);
    }
  });

  // return what we found.
  return teamId;
};

/**
 * Parses out the battler ai including their bonus ai traits.
 * @returns {JABS_BattlerAI} The constructed battler AI.
 */
Game_Event.prototype.getBattlerAiOverrides = function()
{
  // default to not having any ai traits.
  let careful = false;
  let executor = false;
  let reckless = false;
  let healer = false;
  let follower = false;
  let leader = false;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "careful" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(careful)>/i.test(comment))
    {
      // parse the value out of the regex capture group.
      careful = true;
    }

    // check if this battler has the "executor" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(executor)>/i.test(comment))
    {
      // parse the value out of the regex capture group.
      executor = true;
    }

    // check if this battler has the "reckless" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(reckless)>/i.test(comment))
    {
      // parse the value out of the regex capture group.
      reckless = true;
    }

    // check if this battler has the "healer" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(healer)>/i.test(comment))
    {
      // parse the value out of the regex capture group.
      healer = true;
    }

    // check if this battler has the "follower" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(follower)>/i.test(comment))
    {
      // parse the value out of the regex capture group.
      follower = true;
    }

    // check if this battler has the "leader" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(leader)>/i.test(comment))
    {
      // if the value is present, then it must be
      leader = true;
    }
  });

  // check if we found exactly zero bonus ai traits.
  if (!careful && !executor && !reckless && !healer && !follower && !leader)
  {
    // if we found none, scan for legacy code format.
    const legacyAi = this.getBattlerAiOverridesLegacy();

    // check if we found an AI built off the legacy code format.
    if (legacyAi)
    {
      // return the legacy AI instead of an empty AI.
      return legacyAi;
    }

    // we have absolutely no ai trait overrides.
    return null;
  }

  // return the overridden battler ai.
  return new JABS_BattlerAI(careful, executor, reckless, healer, follower, leader);
};

/**
 * Parses out the battler ai based on legacy code format.
 * The basic/defensive traits are no longer valid, and their
 * equivalent ai traits are ignored.
 * @returns {JABS_BattlerAI|null} The legacy-built battler ai, or null if none was found.
 */
Game_Event.prototype.getBattlerAiOverridesLegacy = function()
{
  // all variables gotta start somewhere.
  let code = String.empty;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this battler has ai traits.
      if (/<ai:[ ]?([0|1]{8})>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        code = RegExp.$1;
      }
    });

  // if we found a legacy AI code, we'll accept that... for now...
  if (code !== String.empty)
  {
    //const basic = parseInt(code[0]) === 1; // no longer a feature.
    const careful = parseInt(code[1]) === 1;
    const executor = parseInt(code[2]) === 1;
    const reckless = parseInt(code[3]) === 1;
    //const defensive = parseInt(code[4]) === 1; // no longer a feature.
    const healer = parseInt(code[5]) === 1;
    const follower = parseInt(code[6]) === 1;
    const leader = parseInt(code[7]) === 1;

    // build the new AI based on the old code.
    return new JABS_BattlerAI(careful, executor, reckless, healer, follower, leader);
  }

  // if we found nothing, thats okay, we just legit have no overrides.
  return null;
};

/**
 * Parses out the sight range from a list of event commands.
 * @returns {number|null} The found sight range, or null if not found.
 */
Game_Event.prototype.getSightRangeOverrides = function()
{
  // all variables gotta start somewhere.
  let sightRange = null;

  // check all the valid event commands to see if we have an override for sight.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:s|sight|sightRange):[ ]?([0-9]*)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        sightRange = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return sightRange;
};

/**
 * Parses out the alerted sight boost from a list of event commands.
 * @returns {number|null} The found alerted sight boost range, or null if not found.
 */
Game_Event.prototype.getAlertedSightBoostOverrides = function()
{
  // all variables gotta start somewhere.
  let alertedSightBoost = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:as|alertedSight|alertedSightBoost):[ ]?([0-9]*)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        alertedSightBoost = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return alertedSightBoost;
};

/**
 * Parses out the pursuit range from a list of event commands.
 * @returns {number|null} The found pursuit range, or null if not found.
 */
Game_Event.prototype.getPursuitRangeOverrides = function()
{
  // all variables gotta start somewhere.
  let pursuitRange = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:p|pursuit|pursuitRange):[ ]?([0-9]*)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        pursuitRange = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return pursuitRange;
};

/**
 * Parses out the alerted pursuit boost from a list of event commands.
 * @returns {number|null} The found alerted pursuit boost range, or null if not found.
 */
Game_Event.prototype.getAlertedPursuitBoostOverrides = function()
{
  // all variables gotta start somewhere.
  let alertedPursuitBoost = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:ap|alertedPursuit|alertedPursuitBoost):[ ]?([0-9]*)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        alertedPursuitBoost = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return alertedPursuitBoost;
};

/**
 * Parses out the alert duration from a list of event commands.
 * @returns {number|null} The found alert duration, or null if not found.
 */
Game_Event.prototype.getAlertDurationOverrides = function()
{
  // all variables gotta start somewhere.
  let alertDuration = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:ad|alertDuration):[ ]?([0-9]*)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        alertDuration = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return alertDuration;
};

/**
 * Parses out the override for whether or not this battler can idle about.
 * @returns {boolean|null} True if we force-allow idling, false if we force-disallow, null if no overrides.
 */
Game_Event.prototype.getCanIdleOverrides = function()
{
  // all variables gotta start somewhere.
  let canIdle = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(noIdle)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        canIdle = false;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(canIdle)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        canIdle = true;
      }
    });

  // return the truth.
  return canIdle;
};

/**
 * Parses out the override for whether or not this battler can show its hp bar.
 * @returns {boolean|null} True if we force-allow showing, false if we force-disallow, null if no overrides.
 */
Game_Event.prototype.getShowHpBarOverrides = function()
{
  // all variables gotta start somewhere.
  let showHpBar = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(noHpBar)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        showHpBar = false;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(showHpBar)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        showHpBar = true;
      }
    });

  // return the truth.
  return showHpBar;
};
//#endregion overrides

/**
 * Parses out the override for whether or not this battler is inanimate.
 * @returns {boolean|null} True if we force-inanimate, false if we force-un-inanimate, null if no overrides.
 */
Game_Event.prototype.getInanimateOverrides = function()
{
  // all variables gotta start somewhere.
  let inanimate = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(inanimate)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        inanimate = true;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(notInanimate)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        inanimate = false;
      }
    });

  // return the truth.
  return inanimate;
};

/**
 * Parses out the override for whether or not this battler is invincible.
 * @returns {boolean|null} True if we force-invincibile, false if we force-un-invincible, null if no overrides.
 */
Game_Event.prototype.getInvincibleOverrides = function()
{
  // all variables gotta start somewhere.
  let isInvincible = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(invincible)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        isInvincible = true;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(notInvincible)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        isInvincible = false;
      }
    });

  // return the truth.
  return isInvincible;
};

/**
 * Parses out the override for whether or not this battler can show its name.
 * @returns {boolean|null} True if we force-allow showing, false if we force-disallow, null if no overrides.
 */
Game_Event.prototype.getShowBattlerNameOverrides = function()
{
  // all variables gotta start somewhere.
  let showBattlerName = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
    // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(noName)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        showBattlerName = false;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(showName)>/i.test(comment))
      {
      // parse the value out of the regex capture group.
        showBattlerName = true;
      }
    });

  // return the truth.
  return showBattlerName;
};

/**
 * Binds the initial core battler data to the event.
 * @param {JABS_BattlerCoreData|null} battlerCoreData The core data of this battler.
 */
Game_Event.prototype.initializeCoreData = function(battlerCoreData)
{
  this.setBattlerCoreData(battlerCoreData);
};

/**
 * Checks to see if this event [page] can have its comments parsed to
 * transform it into a `JABS_Battler`.
 * @returns {boolean} True if the event can be parsed, false otherwise.
 */
Game_Event.prototype.canParseEnemyComments = function()
{
  // if somehow it is less than -1, then do not. Weird things happen.
  if (this.findProperPageIndex() < -1) return false;

  // grab the event command list for analysis.
  const commentCommandList = this.getValidCommentCommands();

  // if we do not have a list of comments to parse, then do not.
  if (!commentCommandList.length) return false;

  // check all the commands to make sure a battler id is among them.
  const hasBattlerId = commentCommandList.some(command =>
  {
    // grab the comment and check to make sure it matches our notetag-like pattern.
    const comment = command.parameters[0];

    // check if the comment matches the pattern we expect.
    return comment.match(/<(?:e|enemyId):[ ]?([0-9]*)>/i);
  });

  // if there is no battler id among the comments, then don't parse.
  if (!hasBattlerId) return false;

  // we are clear to parse out those comments!
  return true;
};

/**
 * Gets all valid JABS-shaped comment event commands.
 * @returns {rm.types.EventCommand[]}
 */
Game_Event.prototype.getValidCommentCommands = function()
{
  // don't process if we have no event commands.
  if (this.list().length === 0) return [];

  // otherwise, return the filtered list.
  return this.list().filter(command =>
  {
    // if it is not a comment, then don't include it.
    const isComment = this.matchesControlCode(command.code);
    if (!isComment) return false;

    // make sure it has a valid structure.
    const comment = command.parameters[0];
    if (!comment.match(/^<[\w :"'.!+\-*/\\]+>$/i)) return false;

    // it is a valid comment worth parsing!
    return true;
  }, this);
};

/**
 * Applies the custom move speed if available.
 */
Game_Event.prototype.applyCustomMoveSpeed = function()
{
  // grab the list of valid comments.
  const commentCommandList = this.getValidCommentCommands();

  // iterate over the comments.
  commentCommandList.forEach(command =>
  {
    // check if the comment matches our structure.
    const comment = command.parameters[0];

    // check if this is a matching line.
    if (/<(?:ms|moveSpeed):[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i.test(comment))
    {
      // parse the value out of the regex capture group.
      this.setMoveSpeed(parseFloat(RegExp.$1));
    }
  });
};

/**
 * Get the move speed of the current active page on this event.
 * @returns {number}
 */
Game_Event.prototype.getEventCurrentMovespeed = function()
{
  return this.event().pages[this.findProperPageIndex()].moveSpeed;
};

/**
 * Gets the core battler data for this event.
 * @returns {JABS_BattlerCoreData}
 */
Game_Event.prototype.getBattlerCoreData = function()
{
  return this._j._battlerData;
};

/**
 * Sets the core battler data for this event.
 * @param {JABS_BattlerCoreData} data The core data of the battler this event represents.
 */
Game_Event.prototype.setBattlerCoreData = function(data)
{
  this._j._battlerData = data;
};

/**
 * Gets whether or not this event is a JABS battler.
 * @returns {boolean}
 */
Game_Event.prototype.isJabsBattler = function()
{
  const data = this.getBattlerCoreData();
  return !!data;
};

/**
 * Gets the battler's id from their core data.
 * @returns {number}
 */
Game_Event.prototype.getBattlerId = function()
{
  const data = this.getBattlerCoreData();
  if (!data) return 0;

  return data.battlerId();
};

J.ABS.Aliased.Game_Event.moveStraight = Game_Event.prototype.moveStraight;
Game_Event.prototype.moveStraight = function(direction)
{
  J.ABS.Aliased.Game_Event.moveStraight.call(this, direction);
};
//#endregion Game_Event