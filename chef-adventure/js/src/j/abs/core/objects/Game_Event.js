//region Game_Event
J.ABS.Aliased.Game_Event.set('initMembers', Game_Event.prototype.initMembers);
Game_Event.prototype.initMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  /**
   * The various parameters extracted from the event on the field.
   * These parameters describe a battler's core data points so that
   * their `JABS_Battler` can be constructed.
   * @type {JABS_BattlerCoreData}
   */
  this._j._abs._battlerData = null;

  /**
   * The initial direction this event is facing.
   */
  this._j._abs._initialDirection = 0;

  /**
   * The direction the player was facing when the skill was executed.
   * Only applicable to action events.
   * @type {number}
   */
  this._j._abs._castedDirection = 0;

  // perform original logic.
  J.ABS.Aliased.Game_Event.get('initMembers').call(this);
};

/**
 * Sets the initial direction being faced on this event's creation.
 * @param {number} direction The initial direction faced on creation.
 */
Game_Event.prototype.setCustomDirection = function(direction)
{
  // don't turn if direction is fixed.
  if (this.isDirectionFixed()) return;

  this._j._abs._initialDirection = direction;
};

/**
 * Gets the initial direction being faced on this event's creation.
 * @returns {number}
 */
Game_Event.prototype.getCustomDirection = function()
{
  return this._j._abs._initialDirection;
};

/**
 * Sets the initial direction being faced on this event's creation.
 * @param {number} direction The initial direction faced on creation.
 */
Game_Event.prototype.setCastedDirection = function(direction)
{
  // don't turn if direction is fixed.
  if (this.isDirectionFixed()) return;

  this._j._abs._castedDirection = direction;
};

/**
 * Gets the initial direction being faced on this event's creation.
 * @returns {number}
 */
Game_Event.prototype.getCastedDirection = function()
{
  return this._j._abs._castedDirection;
};

/**
 * Modifies the `.event` method of `Game_Event` to return the data from the
 * $actionMap if it isn't a normal event.
 */
J.ABS.Aliased.Game_Event.set('event', Game_Event.prototype.event);
Game_Event.prototype.event = function()
{
  // check if this is actually an action.
  if (this.isJabsAction())
  {
    // return the action's data instead.
    return $jabsEngine.event(this.getJabsActionUuid());
  }

  // return the underlying event data.
  return J.ABS.Aliased.Game_Event.get('event').call(this);
};

/**
 * Adds an extra catch so that if there is a failure, then the failure is
 * silently ignored because bad timing is just bad luck!
 */
J.ABS.Aliased.Game_Event.set('findProperPageIndex', Game_Event.prototype.findProperPageIndex);
Game_Event.prototype.findProperPageIndex = function()
{
  try
  {
    // check original logic to see if we can return this.
    const test = J.ABS.Aliased.Game_Event.get('findProperPageIndex').call(this);

    // validate the index is indeed a proper event page index.
    if (Number.isInteger(test)) return test;
  }
  catch (err)
  {
    console.trace();
    console.error(`could not find page index for this event.`, err, this);

    return -1;
  }
};

/**
 * OVERWRITE When an map battler is hidden by something like a switch or some
 * other condition, unveil it upon meeting such conditions.
 */
J.ABS.Aliased.Game_Event.set('refresh', Game_Event.prototype.refresh);
Game_Event.prototype.refresh = function()
{
  // check if JABS is enabled.
  if ($jabsEngine.absEnabled)
  {
    // let JABS take care of the event refresh.
    this.jabsEventRefresh();
  }
  // JABS isn't enabled.
  else
  {
    // perform original logic.
    J.ABS.Aliased.Game_Event.get('refresh').call(this);
  }
};

/**
 * Replaces {@link Game_Event.refresh}.
 * Safely handles battler transformation and page index reassignment.
 *
 * Sometimes the page index reassignment can get out of hand and requires guardrails.
 */
Game_Event.prototype.jabsEventRefresh = function()
{
  // don't refresh loot.
  if (this.isJabsLoot()) return;

  // grab the current page index.
  const newPageIndex = this.isErased()
    ? -1
    : this.findProperPageIndex();

  // check if the page index changed.
  if (this._pageIndex !== newPageIndex)
  {
    // update the page index.
    this._pageIndex = newPageIndex;

    // run the page setup.
    this.setupPage();

    // also transform the battler if applicable.
    this.transformBattler();
  }
};

/**
 * Extends this method to accommodate for the possibility of that one
 * error propping up where an attempt to update an event that is no longer
 * available for updating causing the game to crash.
 */
J.ABS.Aliased.Game_Event.set('page', Game_Event.prototype.page);
Game_Event.prototype.page = function()
{
  // check to make sure we have an event to build a page from first.
  if (this.event())
  {
    // perform original logic.
    return J.ABS.Aliased.Game_Event.get('page').call(this);
  }

  console.log($dataMap.events);
  console.log($gameMap._events);
  console.warn(this);
  console.warn('that thing happened again, you should probably look into this.');

  // return null because... something went awry.
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
J.ABS.Aliased.Game_Event.set('setupPageSettings', Game_Event.prototype.setupPageSettings);
Game_Event.prototype.setupPageSettings = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Event.get('setupPageSettings').call(this);

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

  // get the battler data for enemies of this id.
  const enemyBattler = $gameEnemies.enemy(battlerId);

  // determine the event-page overrides for the various core battler data.
  let teamId = this.getTeamIdOverrides() ?? enemyBattler.teamId();
  const ai = this.getBattlerAiOverrides() ?? enemyBattler.ai();
  const sightRange = this.getSightRangeOverrides() ?? enemyBattler.sightRange();
  const alertedSightBoost = this.getAlertedSightBoostOverrides() ?? enemyBattler.alertedSightBoost();
  const pursuitRange = this.getPursuitRangeOverrides() ?? enemyBattler.pursuitRange();
  const alertedPursuitBoost = this.getAlertedPursuitBoostOverrides() ?? enemyBattler.alertedPursuitBoost();
  const alertDuration = this.getAlertDurationOverrides() ?? enemyBattler.alertDuration();
  let canIdle = this.getCanIdleOverrides() ?? enemyBattler.canIdle();
  let showHpBar = this.getShowHpBarOverrides() ?? enemyBattler.showHpBar();
  let showBattlerName = this.getShowBattlerNameOverrides() ?? enemyBattler.showBattlerName();
  const isInvincible = this.getInvincibleOverrides() ?? enemyBattler.isInvincible();
  const isInanimate = this.getInanimateOverrides() ?? enemyBattler.isInanimate();

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

  // build the core data.
  const battlerCoreData = new JABS_CoreDataBuilder(battlerId)
    .setTeamId(teamId)
    .setBattlerAi(ai)
    .setSightRange(sightRange)
    .setAlertedSightBoost(alertedSightBoost)
    .setPursuitRange(pursuitRange)
    .setAlertedPursuitBoost(alertedPursuitBoost)
    .setAlertDuration(alertDuration)
    .setCanIdle(canIdle)
    .setShowHpBar(showHpBar)
    .setShowBattlerName(showBattlerName)
    .setIsInvincible(isInvincible)
    .setIsInanimate(isInanimate)
    .build();

  // initialize the core data based on this.
  this.initializeCoreData(battlerCoreData);
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
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check to make sure this is at least an enemy of some kind.
    return J.ABS.RegExp.EnemyId.test(comment);
  });

  // if there is no battler id among the comments, then don't parse.
  if (!hasBattlerId) return false;

  // we are clear to parse out those comments!
  return true;
};

//region overrides
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
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.EnemyId.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    battlerId = parseInt(regexResult[1]);
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
  // default team id for an event is an enemy.
  let teamId = 1;

  // check all the valid event commands to see if we have an override for team.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.TeamId.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    teamId = parseInt(regexResult[1]);
  });

  // return what we found.
  return teamId;
};

/**
 * Parses out the battler ai including their bonus ai traits.
 * @returns {JABS_EnemyAI} The constructed battler AI.
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
    if (J.ABS.RegExp.AiTraitCareful.test(comment))
    {
      // parse the value out of the regex capture group.
      careful = true;
    }

    // check if this battler has the "executor" ai trait.
    if (J.ABS.RegExp.AiTraitExecutor.test(comment))
    {
      // parse the value out of the regex capture group.
      executor = true;
    }

    // check if this battler has the "reckless" ai trait.
    if (J.ABS.RegExp.AiTraitReckless.test(comment))
    {
      // parse the value out of the regex capture group.
      reckless = true;
    }

    // check if this battler has the "healer" ai trait.
    if (J.ABS.RegExp.AiTraitHealer.test(comment))
    {
      // parse the value out of the regex capture group.
      healer = true;
    }

    // check if this battler has the "follower" ai trait.
    if (J.ABS.RegExp.AiTraitFollower.test(comment))
    {
      // parse the value out of the regex capture group.
      follower = true;
    }

    // check if this battler has the "leader" ai trait.
    if (J.ABS.RegExp.AiTraitLeader.test(comment))
    {
      // if the value is present, then it must be
      leader = true;
    }
  });

  // return the overridden battler ai.
  return new JABS_EnemyAI(careful, executor, reckless, healer, follower, leader);
};

/**
 * Parses out the sight range from a list of event commands.
 * @returns {number|null} The found sight range, or null if not found.
 */
Game_Event.prototype.getSightRangeOverrides = function()
{
  // core combat values are null by default.
  let sightRange = null;

  // check all the valid event commands to see if we have an override for sight.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.Sight.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    sightRange = parseInt(regexResult[1]);
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
  // core combat values are null by default.
  let alertedSightBoost = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.AlertedSightBoost.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    alertedSightBoost = parseInt(regexResult[1]);
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
  // core combat values are null by default.
  let pursuitRange = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.Pursuit.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    pursuitRange = parseInt(regexResult[1]);
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
  // core combat values are null by default.
  let alertedPursuitBoost = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.AlertedPursuitBoost.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    alertedPursuitBoost = parseFloat(regexResult[1]);
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
  // core combat values are null by default.
  let alertDuration = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.AlertDuration.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    alertDuration = parseInt(regexResult[1]);
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

  // check all the valid event commands to see if we have any config options.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "noIdle" config option.
    if (J.ABS.RegExp.ConfigNoIdle.test(comment))
    {
      // parse the value out of the regex capture group.
      canIdle = false;
    }


    // check if this battler has the "canIdle" config option.
    if (J.ABS.RegExp.ConfigCanIdle.test(comment))
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

  // check all the valid event commands to see if we have any config options.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "noHpBar" config option.
    if (J.ABS.RegExp.ConfigNoHpBar.test(comment))
    {
      // parse the value out of the regex capture group.
      showHpBar = false;
    }

    // check if this battler has the "showHpBar" config option.
    if (J.ABS.RegExp.ConfigShowHpBar.test(comment))
    {
      // parse the value out of the regex capture group.
      showHpBar = true;
    }
  });

  // return the truth.
  return showHpBar;
};

/**
 * Parses out the override for whether or not this battler is inanimate.
 * @returns {boolean|null} True if we force-inanimate, false if we force-un-inanimate, null if no overrides.
 */
Game_Event.prototype.getInanimateOverrides = function()
{
  // all variables gotta start somewhere.
  let inanimate = null;

  // check all the valid event commands to see if we have any config options.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "notInanimate" config option.
    if (J.ABS.RegExp.ConfigNotInanimate.test(comment))
    {
      // parse the value out of the regex capture group.
      inanimate = false;
    }

    // check if this battler has the "inanimate" config option.
    if (J.ABS.RegExp.ConfigInanimate.test(comment))
    {
      // parse the value out of the regex capture group.
      inanimate = true;
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
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "invincible" config option.
    if (J.ABS.RegExp.ConfigInvincible.test(comment))
    {
      // parse the value out of the regex capture group.
      isInvincible = true;
    }

    // check if this battler has the "notInvincible" config option.
    if (J.ABS.RegExp.ConfigNotInvincible.test(comment))
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
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if this battler has the "notInvincible" config option.
    if (J.ABS.RegExp.ConfigNoName.test(comment))
    {
      // parse the value out of the regex capture group.
      showBattlerName = false;
    }

    // check if this battler has the "invincible" config option.
    if (J.ABS.RegExp.ConfigShowName.test(comment))
    {
      // parse the value out of the regex capture group.
      showBattlerName = true;
    }
  });

  // return the truth.
  return showBattlerName;
};
//endregion overrides

/**
 * Binds the initial core battler data to the event.
 * @param {JABS_BattlerCoreData|null} battlerCoreData The core data of this battler.
 */
Game_Event.prototype.initializeCoreData = function(battlerCoreData)
{
  this.setBattlerCoreData(battlerCoreData);
};

/**
 * Applies the custom move speed if available.
 */
Game_Event.prototype.applyCustomMoveSpeed = function()
{
  // grab the list of valid comments.
  const commentCommandList = this.getValidCommentCommands();

  // initialize the move speed.
  let moveSpeed = null;

  // iterate over the comments.
  commentCommandList.forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if the comment matches the regex.
    const regexResult = J.ABS.RegExp.MoveSpeed.exec(comment);

    // if the comment didn't match, then don't try to parse it.
    if (!regexResult) return;

    // parse the value out of the regex capture group.
    moveSpeed = parseFloat(regexResult[1]);
  });

  // check if we encountered additional move speed modifiers.
  if (moveSpeed !== null)
  {
    // set the new movespeed.
    this.setMoveSpeed(moveSpeed);
  }
};

/**
 * Gets the core battler data for this event.
 * @returns {JABS_BattlerCoreData}
 */
Game_Event.prototype.getBattlerCoreData = function()
{
  return this._j._abs._battlerData;
};

/**
 * Sets the core battler data for this event.
 * @param {JABS_BattlerCoreData} data The core data of the battler this event represents.
 */
Game_Event.prototype.setBattlerCoreData = function(data)
{
  this._j._abs._battlerData = data;
};

/**
 * Gets whether or not this event is a JABS battler.
 * @returns {boolean}
 */
Game_Event.prototype.isJabsBattler = function()
{
  return !!this.getBattlerCoreData();
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

/**
 * Get the {@link JABS_Battler} who generated this action.
 * @returns {JABS_Battler|null} The caster, or null if this isn't an action.
 */
Game_Event.prototype.getCaster = function()
{
  // if this isn't an action, then there is no caster.
  if (!this.isJabsAction()) return null;

  // grab the underlying action.
  const jabsAction = this.getJabsAction();

  // return the caster.
  return jabsAction.getCaster();
};

/**
 * Moves this event to be at the same coordinates as the caster.
 * If there is no caster, it will do nothing.
 *
 * This is designed to be used from within a custom move route.
 */
Game_Event.prototype.existOnCaster = function()
{
  // grab the caster.
  const caster = this.getCaster();

  // if for whatever reason we have no caster, then do not follow.
  if (!caster) return;

  // exist ontop of the caster.
  this.locate(caster.getX(), caster.getY());
};
//endregion Game_Event