//region JABS_AiManager
/**
 * This static class tracks and manages all {@link JABS_Battler}s on the map.
 */
class JABS_AiManager
{
  /**
   * A collection of all battlers being managed by this manager.
   * @type {Map<string, JABS_Battler>}
   */
  static battlers = new Map();

  /**
   * The maximum update range for AI to be cognizant of eachother.
   * @type {number}
   */
  static maxAiRange = J.ABS.Metadata.MaxAiUpdateRange;

  /**
   * Constructor.
   * This is a static class.
   */
  constructor()
  {
    throw new Error("The JABS_AiManager is a static class.");
  }

  //region get battlers
  /**
   * Gets all battlers as an array for iterative purposes.
   * @returns {JABS_Battler[]} The currently tracked battlers.
   */
  static getAllBattlers()
  {
    // return an array form of the battlers.
    return Array
      .from(this.battlers.values());
  }

  /**
   * Find a battler by its uuid.
   * @param {string} uuid The uuid of the battler to find.
   * @returns {JABS_Battler|undefined}
   */
  static getBattlerByUuid(uuid)
  {
    // return what is found by that uuid.
    return this.battlers.get(uuid);
  }

  /**
   * Finds a battler by its {@link Game_Event.eventId}.
   * @param {number} eventId The event id to find a battler for.
   * @returns {JABS_Battler|undefined}
   */
  static getBattlerByEventId(eventId)
  {
    // find the battler with the matching event id.
    return this.getAllBattlers()
      .find(battler => battler.getCharacter().eventId() === eventId);
  }

  /**
   * Gets all battlers within a given distance from given battler.
   * @param {JABS_Battler} user The target to get battlers within range of.
   * @param {number} maxRange The maximum range to check for battlers within.
   * @returns {JABS_Battler[]}
   */
  static getBattlersWithinRange(user, maxRange)
  {
    // find all battlers that are within the max range.
    return this.getAllBattlers()
      .filter(battler => user.distanceToDesignatedTarget(battler) <= maxRange);
  }

  /**
   * Gets all followers that the given leader battler has.
   * @param {JABS_Battler} leaderBattler
   * @returns {JABS_Battler[]}
   */
  static getLeaderFollowers(leaderBattler)
  {
    // if we're not able to lead, then you have no followers.
    if (!leaderBattler.getAiMode().leader) return [];

    // determine all nearby battlers of the same team.
    const nearbyBattlers = this.getAlliedBattlersWithinRange(leaderBattler, leaderBattler.getPursuitRadius());

    // the filter function for determining if a battler is a follower to this leader.
    /** @param battler {JABS_Battler} */
    const filtering = battler =>
    {
      // actors are not considered for leader/follower.
      if (battler.isActor()) return false;

      // grab the ai of the nearby battler.
      const { follower, leader } = battler.getAiMode();

      // check if they can become a follower to the designated leader.
      const canLead = !battler.hasLeader() || (leaderBattler.getUuid() === battler.getLeader());

      // if i am a follower, not a leader, and can be lead, then lead me.
      return (follower && !leader && canLead);
    };

    // return the filtered nearby battlers that are followers.
    return nearbyBattlers.filter(filtering);
  }

  /**
   * Gets all battlers in order from closest to farthest in relation
   * to the given origin battler.
   * @param {JABS_Battler} originBattler The origin battler to sort all other battlers by.
   * @returns {JABS_Battler[]}
   */
  static getAllBattlersDistanceSortedFromBattler(originBattler)
  {
    // grab all the battlers available.
    const battlers = this.getAllBattlers();

    // return them sorted, closest to farthest.
    return this.#sortBattlersByDistanceFromBattlerAscending(battlers, originBattler);
  }

  /**
   * Gets all battlers within a given distance from given battler, sorted closest to farthest.
   * @param {JABS_Battler} originBattler The target to get battlers within range of.
   * @param {number} maxRange The maximum range to check for battlers within.
   * @returns {JABS_Battler[]}
   */
  static getAllBattlersWithinRangeSortedByDistance(originBattler, maxRange)
  {
    // find all battlers that are within the max range.
    const battlers = this.getBattlersWithinRange(originBattler, maxRange);

    // return them sorted, closest to farthest.
    return this.#sortBattlersByDistanceFromBattlerAscending(battlers, originBattler);
  }

  /**
   * Gets all battlers that are of an opposing team to the selected battler.
   * @param {JABS_Battler} selectedBattler The battler to get the opposing battlers list for.
   * @returns {JABS_Battler[]} All opposing battlers being tracked.
   */
  static getOpposingBattlers(selectedBattler)
  {
    // grab all the battlers available.
    const battlers = this.getAllBattlers();

    // return the opposing battlers.
    return this.#filterBattlersByOpposingTeam(battlers, selectedBattler);
  }

  /**
   * Gets all opposing battlers to the selected battler within a given range.
   * @param {JABS_Battler} selectedBattler The selected battler to compare range and opposition with.
   * @param {number} maxRange The maximum range from the selected battler; inclusive.
   * @returns {JABS_Battler[]} The double-filtered list of opposing battlers within range.
   */
  static getOpposingBattlersWithinRange(selectedBattler, maxRange)
  {
    // grab all opposing battlers available.
    const opposingBattlers = this.getOpposingBattlers(selectedBattler);

    // return the range-filtered opposing battlers.
    return this.#filterBattlersByRangeFromBattler(opposingBattlers, selectedBattler, maxRange);
  }

  /**
   * Gets the closest opposing battler in the selected battler's sight range.
   * @param {JABS_Battler} selectedBattler The battler to find the closest opponent for.
   * @returns {JABS_Battler|null} The closest battler, or null if no opponent is in sight.
   */
  static getClosestOpposingBattler(selectedBattler)
  {
    // grab all opposing battlers within the selected battlers sight.
    const battlers = this.getOpposingBattlersWithinRange(
      selectedBattler,
      selectedBattler.getSightRadius());

    // if we have no visible opposing battlers, then there is no closest.
    if (!battlers.length) return null;

    // sort the closest battler out.
    const [closestBattler,] = this.#sortBattlersByDistanceFromBattlerAscending(
      battlers,
      selectedBattler);

    // return the closest we found.
    return closestBattler;
  }

  /**
   * Gets all battlers that are of an allied team to the selected battler.
   * @param {JABS_Battler} selectedBattler The battler to get the allied battlers list for.
   * @returns {JABS_Battler[]} All allied battlers being tracked.
   */
  static getAlliedBattlers(selectedBattler)
  {
    // grab all the battlers available.
    const battlers = this.getAllBattlers();

    // return the allied battlers.
    return this.#filterBattlersByAlliedTeam(battlers, selectedBattler);
  }

  /**
   * Gets all allied battlers to the selected battler within a given range.
   * @param {JABS_Battler} selectedBattler The selected battler to compare range and alliance with.
   * @param {number} maxRange The maximum range from the selected battler; inclusive.
   * @returns {JABS_Battler[]} The double-filtered list of allied battlers within range.
   */
  static getAlliedBattlersWithinRange(selectedBattler, maxRange)
  {
    // grab all allied battlers available.
    const alliedBattlers = this.getAlliedBattlers(selectedBattler);

    // return the range-filtered allied battlers.
    return this.#filterBattlersByRangeFromBattler(alliedBattlers, selectedBattler, maxRange);
  }

  /**
   * Gets all battlers that use {@link Game_Actor} for their battler.
   * @returns {JABS_Battler[]}
   */
  static getActorBattlers()
  {
    // filter on whether or not the battler is a {@link Game_Actor}.
    return this.getAllBattlers()
      .filter(battler => battler.isActor());
  }

  /**
   * Gets all battlers that use {@link Game_Enemy} for their battler.
   * @returns {JABS_Battler[]}
   */
  static getEnemyBattlers()
  {
    // filter on whether or not the battler is a {@link Game_Enemy}.
    return this.getAllBattlers()
      .filter(battler => battler.isEnemy());
  }

  /**
   * Filters the battlers based on whether or not the battler is on an opposing
   * team from the selected battler.
   * @param {JABS_Battler[]} battlers The battlers to be filtered by team opposition.
   * @param {JABS_Battler} selectedBattler The battler to compare for team opposition.
   * @returns {JABS_Battler[]} The filtered list of only opposing battlers.
   */
  static #filterBattlersByOpposingTeam(battlers, selectedBattler)
  {
    // a filter function for determining whether or not the battler is of the opposing team.
    const filtering = battler => 
    {
      // neutral battlers are never an opposition.
      if (battler.getTeam() === JABS_Battler.neutralTeamId()) return false;

      // check if the selected battler is not the same team as the target battler's team.
      const isOpposingTeam = !selectedBattler.isSameTeam(battler.getTeam());

      // return what we found.
      return isOpposingTeam;
    };

    // return the battlers filtered by team opposition of the selected battler.
    return battlers.filter(filtering);
  }

  /**
   * Filters the battlers based on whether or not the battler is on an allied
   * team from the selected battler.
   * @param {JABS_Battler[]} battlers The battlers to be filtered by team alliance.
   * @param {JABS_Battler} selectedBattler The battler to compare for team alliance.
   * @returns {JABS_Battler[]} The filtered list of only allied battlers.
   */
  static #filterBattlersByAlliedTeam(battlers, selectedBattler)
  {
    // a filter function for determining whether or not the battler is of the same team.
    const filtering = battler => 
    {
      // neutral battlers are never an ally.
      if (battler.getTeam() === JABS_Battler.neutralTeamId()) return false;

      // check if the selected battler is the same team as the target battler's team.
      const isSameTeam = selectedBattler.isSameTeam(battler.getTeam());

      // return what we found.
      return isSameTeam;
    };

    // return the battlers filtered by team alliance of the selected battler.
    return battlers.filter(filtering);
  }

  /**
   * Filters the battlers based on whether or not they are within the maximum range from the origin battler.
   * @param {JABS_Battler[]} battlers The battlers to be filtered by team opposition.
   * @param {JABS_Battler} originBattler The battler to filter by maximum range from.
   * @param {number} maxRange The maximum range from the origin battler; inclusive.
   * @returns {JABS_Battler[]} The filtered list of only battlers within the max range from the origin.
   */
  static #filterBattlersByRangeFromBattler(battlers, originBattler, maxRange)
  {
    // a filter function for removing battlers outside of a given range.
    const filtering = battler => 
    {
      // grab the distance from the origin battler to the given battler.
      const distance = originBattler.distanceToDesignatedTarget(battler);

      // whether or not the battler is in range.
      const inRange = distance <= maxRange;

      // return the result.
      return inRange;
    };

    // return the battlers filtered by maximum range.
    return battlers.filter(filtering);
  }

  /**
   * Sorts the battlers in order from closest to farthest from the origin battler.
   * @param {JABS_Battler[]} battlers The collection of battlers to sort.
   * @param {JABS_Battler} originBattler The origin battler to check distance against.
   * @returns {JABS_Battler[]} The battlers sorted from closest to farthest.
   */
  static #sortBattlersByDistanceFromBattlerAscending(battlers, originBattler)
  {
    // a compare function for comparing the distance between two battlers.
    const comparing = (battlerA, battlerB) => 
    {
      const distanceA = originBattler.distanceToDesignatedTarget(battlerA);
      const distanceB = originBattler.distanceToDesignatedTarget(battlerB);
      return distanceA - distanceB;
    };

    // return the battlers sorted by distance from closest to farthest.
    return battlers.sort(comparing);
  }
  //endregion get battlers

  //region manage battlers
  /**
   * Adds a battler to tracking.
   * @param {JABS_Battler} battler The battler to add to tracking.
   */
  static addOrUpdateBattler(battler)
  {
    // grab the key, aka the uuid of the battler.
    const key = battler.getUuid();

    // check if the battler already is being tracked.
    if (this.battlers.has(key))
    {
      // if it is, just update the battler data.
      this.updateBattler(key, battler);
    }
    // the battler isn't being tracked.
    else
    {
      // just add the battler anew.
      this.addBattler(battler);
    }
  }

  /**
   * Adds a battler to tracking based on the battler's own uuid.
   * @param {JABS_Battler} battler The battler to add to tracking.
   */
  static addBattler(battler)
  {
    // grab the key, aka the uuid of the battler.
    const key = battler.getUuid();

    // update the battler key with the newest battler.
    this.battlers.set(key, battler);
  }

  /**
   * Updates a given key in the battler tracking with new battler data.
   * @param {string} key The key of the battler to replace the slot of.
   * @param {JABS_Battler} battler The updated battler data.
   */
  static updateBattler(key, battler)
  {
    // update the battler key with the newest battler.
    this.battlers.set(key, battler);
  }

  /**
   * Adds a collection of battlers to tracking.
   * @param {JABS_Battler} battlers The battler to add to tracking.
   */
  static addOrUpdateBattlers(battlers)
  {
    battlers.forEach(this.addOrUpdateBattler, this);
  }

  /**
   * Removes a battler from tracking.
   * @param {JABS_Battler} battler The battler to remove from tracking.
   */
  static removeBattler(battler)
  {
    // grab the key, aka the uuid of the battler.
    const key = battler.getUuid();

    // check if the battler is currently being tracked.
    if (this.battlers.has(key))
    {
      // remove battler from tracking.
      this.battlers.delete(key);
    }
  }

  /**
   * Removes a collection of battlers from tracking.
   * @param {JABS_Battler[]} battlers The battler to remove from tracking.
   */
  static removeBattlers(battlers)
  {
    battlers.forEach(this.removeBattler, this);
  }

  /**
   * Clears the currently tracked battlers.
   */
  static clearBattlers()
  {
    this.battlers.clear();
  }

  /**
   * Converts an event into an enemy if possible.
   * @param {Game_Event} event The event to potentially convert.
   * @returns {JABS_Battler|null} A battler if the event had one available, null otherwise.
   */
  static convertEventToBattler(event)
  {
    // verify we can conver the event to a battler.
    if (!this.canConvertEventToBattler(event))
    {
      // if the battler has no id, it is likely being hidden/transformed to non-battler.
      event.setJabsBattlerUuid(String.empty);

      // null is the default for non-enemies.
      return null;
    }

    // create the underlying battler associated with the event.
    const battler = new Game_Enemy(
      event.getBattlerId(),
      null,
      null);

    // create the battler with the new data.
    const jabsBattler = new JABS_Battler(
      event,
      battler,
      event.getBattlerCoreData());

    // update the battler with the latest uuid.
    event.setJabsBattlerUuid(jabsBattler.getUuid());

    // return the newly created battler.
    return jabsBattler;
  }

  /**
   * Converts a collection of events into enemies if possible.
   * @param {Game_Event[]} events The events to potentially convert to battlers.
   * @returns {JABS_Battler[]} The converted collection of battlers (possibly empty).
   */
  static convertEventsToBattlers(events)
  {
    return events
      .map(event => this.convertEventToBattler(event))
      .filter(event => !!event);
  }

  /**
   * Determines whether or not the event can be converted into a battler.
   * @param {Game_Event} event The event to potentially convert.
   * @returns {boolean} True if the event is convertable, false otherwise.
   */
  static canConvertEventToBattler(event)
  {
    // if the event isn't a JABS battler, then don't try to convert it.
    if (!event.isJabsBattler()) return false;

    // convert it!
    return true;
  }

  /**
   * Converts a collection of followers into allies if possible.
   * @param {Game_Follower[]} followers The followers to potentially convert to battlers.
   * @returns {JABS_Battler[]} The converted collection of battlers (possibly empty).
   */
  static convertFollowersToBattlers(followers)
  {
    return $gamePlayer.followers().data()
      .map(this.convertFollowerToBattler, this)
      .filter(follower => !!follower);
  }

  /**
   * Converts an follower into an ally if possible.
   * @param {Game_Follower} follower The follower to potentially convert.
   * @returns {JABS_Battler|null} A battler if the follower had one available, null otherwise.
   */
  static convertFollowerToBattler(follower)
  {
    // verify we can conver the follower to a battler.
    if (!this.canConvertFollowerToBattler(follower))
    {
      // if the battler has no id, it is likely being hidden/transformed to non-battler.
      follower.setJabsBattlerUuid(String.empty);

      // null is the default.
      return null;
    }

    // grab the battler of the follower.
    const battler = follower.actor();

    // create a builder to step through for this battler.
    const builder = new JABS_CoreDataBuilder(0);

    // set the battler.
    builder.setBattler(battler);

    // check if we're using the danger indicators.
    if (J.ABS.EXT.DANGER)
    {
      // never show the danger indicator for allies.
      builder.setShowDangerIndicator(false)
    }

    // build the core data.
    const coreData = builder.build();

    // instantiate the battler.
    const jabsBattler = new JABS_Battler(follower, battler, coreData);

    // assign the map battler to the follower.
    follower.setJabsBattlerUuid(jabsBattler.getUuid());

    // return the built ally map battler.
    return jabsBattler;
  }

  /**
   * Determines whether or not the follower can be converted into a battler.
   * @param {Game_Follower} follower The follower to potentially convert.
   * @returns {boolean} True if the follower is convertable, false otherwise.
   */
  static canConvertFollowerToBattler(follower)
  {
    // if a follower is not visible, then there is no underlying battler.
    if (!follower.isVisible()) return false;

    // convert it!
    return true;
  }
  //endregion manage battlers

  //region update loop
  /**
   * Handles updating all the logic of the JABS engine.
   */
  static update()
  {
    // check if the AI manager can execute.
    if (!this.canUpdate()) return;

    // execute AI management.
    this.manageAi();
  }

  /**
   * Whether or not the ai manager can process an update.
   * @return {boolean} True if the manager can update, false otherwise.
   */
  static canUpdate()
  {
    // do not manage if the engine is paused.
    if ($jabsEngine.absPause) return false;

    // do not manage if the message window is up.
    if ($gameMessage.isBusy()) return false;

    // do not manage if the map is handling an event.
    if ($gameMap.isEventRunning()) return false;

    // update!
    return true;
  }

  /**
   * Define whether or not the player is engaged in combat with any of the current battlers.
   */
  static manageAi()
  {
    // grab all available battlers within a fixed range.
    const battlers = this.getAllBattlersWithinRangeSortedByDistance(
      $jabsEngine.getPlayer1(),
      J.ABS.Metadata.MaxAiUpdateRange);

    // if we have no battlers, then do not process AI.
    if (!battlers.length) return;

    // iterate over each battler available.
    battlers.forEach(this.handleBattlerAi, this);
  }

  /**
   * Handles the AI management of this battler.
   * @param {JABS_Battler} battler The battler to potentially handle AI of.
   */
  static handleBattlerAi(battler)
  {
    // check if we can manage the AI of this battler.
    if (!this.canManageAi(battler)) return;

    // execute the AI loop for this battler.
    this.executeAi(battler);
  }

  /**
   * Determines whether or not this battler can have its AI managed.
   * @param {JABS_Battler} battler The battler to check if AI is manageable.
   * @returns {boolean} True if the AI should be managed, false otherwise.
   */
  static canManageAi(battler)
  {
    // do not manage dead battlers.
    if (battler.isDead()) return false;

    // do not manage the player.
    if (battler.isPlayer()) return false;

    // do not manage inanimate battlers.
    if (battler.isInanimate()) return false;

    // manage that AI!
    return true;
  }

  /**
   * Executes the interactions specified by the combination of the AI mode bits.
   * @param {JABS_Battler} battler The battler executing on the AI mode.
   */
  static executeAi(battler)
  {
    // no AI is executed when waiting.
    if (battler.isWaiting()) return;

    // if the battler is engaged, then do AI things.
    if (battler.isEngaged())
    {
      // adjust the targets based on aggro and presence.
      battler.adjustTargetByAggro();

      // if we are no longer engaged due to removing dead aggros, then stop.
      if (!battler.isEngaged()) return;

      // don't try to idle while engaged.
      battler.setIdle(false);

      // determine the phase and perform actions accordingly.
      const phase = battler.getPhase();
      switch (phase)
      {
        case 1:
          this.aiPhase1(battler);
          break;
        case 2:
          this.aiPhase2(battler);
          break;
        case 3:
          this.aiPhase3(battler);
          break;
        default:
          this.aiPhase0(battler);
          break;
      }
    }
    else
    {
      // the battler is not engaged, instead just idle about.
      this.aiPhase0(battler);
    }
  }
  //endregion update loop

  //region Phase 0 - Idle Phase
  /**
   * The zero-th phase, when the battler is not engaged- it's idle action.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase0(battler)
  {
    // if the battler cannot idle, then do not idle.
    if (!battler.canIdle()) return;

    // grab whether or not the battler is currently idle.
    const isIdle = battler.isIdle();

    // check if the battler is currently not in-motion.
    if (battler.getCharacter().isStopping())
    {
      // check if the battler is alerted.
      if (battler.isAlerted())
      {
        // if stopped and alerted, then go try to find the one triggering the alert.
        this.seekForAlerter(battler);
      }
      // check if we aren't idle, and also aren't home.
      else if (!isIdle && !battler.isHome())
      {
        // try to go back towards the home coordinates.
        this.goHome(battler);
      }
      // check if we are idle (implicitly also home)
      else if (isIdle)
      {
        // move about idly.
        this.moveIdly(battler);
      }
    }
  }

  /**
   * If a battler is idle but alerted, then they will try to seek out what
   * disturbed their idling.
   * @param {JABS_Battler} battler The battler seeking for the alerter.
   */
  static seekForAlerter(battler)
  {
    // grab the x:y coordinates that we last "heard" the one triggering the alert from.
    const [alertX, alertY] = battler.getAlertedCoordinates();

    // attempt to move intelligently towards those coordiantes.
    battler.smartMoveTowardCoordinates(alertX, alertY);
  }

  /**
   * Progresses the battler towards their home coordinates.
   * @param {JABS_Battler} battler The battler going home.
   */
  static goHome(battler)
  {
    // grab the character of the battler trying to go home.
    const character = battler.getCharacter();

    // determine the next direction to face when going home.
    const nextDir = character.findDirectionTo(battler.getHomeX(), battler.getHomeY());

    // take a step in the right direction.
    character.moveStraight(nextDir);

    // check if we've made it home.
    if (battler.isHome())
    {
      // flag this battler as being idle.
      battler.setIdle(true);
    }
  }

  /**
   * Executes whatever the idle action is for this battler.
   * @param {JABS_Battler} battler The battler moving idly.
   */
  static moveIdly(battler)
  {
    // if we're not able to move idly, then do not.
    if (!this.canMoveIdly(battler)) return;

    // grab the character of the battler.
    const character = battler.getCharacter();

    // check if they are "close" to their home point.
    if (JABS_Battler.isClose(battler.distanceToHome()))
    {
      // move randomly.
      character.moveRandom();
    }
    // they are not "close" to their home point.
    else
    {
      // determine the direction to face to move towards home.
      const nextDir = character.findDirectionTo(battler.getHomeX(), battler.getHomeY());

      // move towards home.
      character.moveStraight(nextDir);
    }

    // reset the idle action counter.
    battler.resetIdleAction();
  }

  /**
   * Determiens whether or not this battler can move idly.
   * @param {JABS_Battler} battler The battler trying to move idly.
   * @returns {boolean} True if this battler can movie idly, false otherwise.
   */
  static canMoveIdly(battler)
  {
    // if we're not able to move idly, then do not.
    if (!battler.isIdleActionReady()) return false;

    // we idle about infrequently.
    if (!this.shouldMoveIdly()) return false;

    // idle about!
    return true;
  }

  /**
   * Determines whether or not RNG favored this battler to move.
   * @returns {boolean} True if we should take a step, false otherwise.
   */
  static shouldMoveIdly()
  {
    // roll a d100.
    const chance = (Math.randomInt(100) + 1);

    // need a nat100 to move.
    const shouldMove = (chance === 100);

    // to move or not to move?
    return shouldMove;
  }
  //endregion Phase 0 - Idle Phase

  //region Phase 1 - Pre-Action Movement Phase
  /**
   * Phase 1 for AI is the phase where the battler will count down its "prepare" timer.
   * While in this phase, the battler will make an effort to maintain a "safe" distance
   * from its current target.
   * @param {JABS_Battler} battler The battler executing this phase of the AI.
   */
  static aiPhase1(battler)
  {
    // check if the battler has their prepare timer ready for action.
    // if this battler is a follower that has a leader, it will automatically proceed.
    if (this.canTransitionToPhase2(battler))
    {
      // move to the next phase of AI.
      this.transitionToPhase2(battler);

      // stop processing.
      return;
    }

    // check if the battler is able to move and isn't moving.
    if (this.canDecidePhase1Movement(battler))
    {
      // move around as-necessary.
      this.decideAiMovement(battler);
    }

    // otherwise, we must be processing a movement command from before.
  }

  /**
   * Determines whether or not this battler is ready to transition to AI phase 2.
   * @param {JABS_Battler} battler The battler to transition.
   * @returns {boolean} True if this battler should transition, false otherwise.
   */
  static canTransitionToPhase2(battler)
  {
    // check if the battler has decided an action yet.
    if (!battler.isActionReady()) return false;

    // move to phase 2!
    return true;
  }

  /**
   * Transitions this battler to AI phase 2, action decision and repositioning.
   * @param {JABS_Battler} battler The battler to transition.
   */
  static transitionToPhase2(battler)
  {
    // move to the next phase of AI.
    battler.setPhase(2);
  }

  /**
   * Determines whether or not this battler can perform pre-action movement.
   * @param {JABS_Battler} battler The battler to move.
   * @returns {boolean} True if this battler should move, false otherwise.
   */
  static canDecidePhase1Movement(battler)
  {
    // check if the battler is currently moving.
    if (battler.getCharacter().isMoving()) return false;

    // check if the battler is unable to move.
    if (!battler.canBattlerMove()) return false;

    // move!
    return true;
  }

  /**
   * Moves the battler around in an effort to maintain a "comfortable" distance
   * away from their current target.
   * @param {JABS_Battler} battler The battler deciding movement strategy.
   */
  static decideAiMovement(battler)
  {
    // check if the distance is invalid or too great.
    if (this.shouldDisengageTarget(battler))
    {
      // just give up on this target.
      battler.disengageTarget();

      // stop processing.
      return;
    }

    // check if the battler is "close".
    this.maintainSafeDistance(battler);

    // check if we should turn towards the target.
    // NOTE: this prevents 100% always facing the target, preventing perma-parry.
    if (Math.randomInt(100) < 70)
    {
      // turn towards the target.
      battler.turnTowardTarget();
    }
  }

  /**
   * Determines whether or not this battler should disengage from its target
   * due to distancing concerns.
   * @param {JABS_Battler} battler The battler to disengage.
   * @returns {boolean} True if this battler needs to disengage, false otherwise.
   */
  static shouldDisengageTarget(battler)
  {
    // calculate the distance to this battler's current target.
    const distance = battler.distanceToCurrentTarget();

    // check if the distance is invalid.
    if (distance === null) return true;

    // check if the distance arbitrarily is too great.
    if (distance > 20) return true;

    // check if the distance is outside of the pursuit radius of this battler.
    if (battler.getPursuitRadius() < distance) return true;

    // do not disengage.
    return false;
  }

  /**
   * This battler will attempt to keep a "safe" distance of not-too-far and
   * not-too-close to its target.
   * @param {JABS_Battler} battler The battler to do the distancing.
   */
  static maintainSafeDistance(battler)
  {
    // calculate the distance to this battler's current target.
    const distance = battler.distanceToCurrentTarget();

    // if we are safe, then do nothing.
    if (JABS_Battler.isSafe(distance)) return;

    switch (true)
    {
      case JABS_Battler.isClose(distance):
        battler.smartMoveAwayFromTarget();
        break;
      case JABS_Battler.isFar(distance):
        battler.smartMoveTowardTarget();
        break;
    }
  }
  //endregion Phase 1 - Pre-Action Movement Phase

  //region Phase 2 - Execute Action Phase
  /**
   * Phase 2 for AI is the phase where the battler will decide and execute its action.
   * While in this phase, the battler will decide its action, and attempt to move
   * into the required range to execute the action if necessary and execute it.
   * @param {JABS_Battler} battler The ai battler being managed.
   */
  static aiPhase2(battler)
  {
    // check if the distance is invalid or too great.
    if (this.shouldDisengageTarget(battler))
    {
      // just give up on this target.
      battler.disengageTarget();

      // stop processing.
      return;
    }

    // check if the battler has decided their action yet.
    if (this.needsActionDecision(battler))
    {
      // make a decision about what to do.
      this.decideAiPhase2Action(battler);

      // stop processing.
      return;
    }

    // check if we need to reposition.
    if (this.needsRepositioning(battler))
    {
      // move into a better position based on the decided action.
      this.decideAiPhase2Movement(battler);

      // stop processing.
      return;
    }

    // check if we're ready to execute actions.
    if (this.needsActionExecution(battler))
    {
      // execute the decided action.
      this.executeAiPhase2Action(battler);
    }
  }

  /**
   * Determines whether or not this battler needs to decide an action.
   * @param {JABS_Battler} battler The battler to decide an action.
   * @returns {boolean} True if this battler needs to decide, false otherwise.
   */
  static needsActionDecision(battler)
  {
    // check if the battler has not yet decided an action.
    if (!battler.isActionDecided()) return true;

    // battler already has already made a decision.
    return false;
  }

  /**
   * Determines whether or not this battler needs to get into position.
   * @param {JABS_Battler} battler The battler to reposition.
   * @returns {boolean} True if this battler needs to move, false otherwise.
   */
  static needsRepositioning(battler)
  {
    // if the battler is casting, then they can't do repositioning things.
    if (battler.isCasting()) return false;

    // if we are already in position, then we don't need repositioning.
    if (battler.isInPosition()) return false;

    // if the battler is moving, then they can't do repositioning things.
    if (battler.getCharacter().isMoving()) return false;

    // if we can't even move, we aren't able to reposition.
    if (!battler.canBattlerMove()) return false;

    // we need repositioning!
    return true;
  }

  /**
   * Determines whether or not this battler needs to execute queued actions.
   * @param {JABS_Battler} battler The battler to take action.
   * @returns {boolean} True if this battler needs to take action, false otherwise.
   */
  static needsActionExecution(battler)
  {
    // check if this battler has decided on an action to take.
    if (!battler.isActionDecided()) return false;

    // check if this battler is in position.
    if (!battler.isInPosition()) return false;

    // check if the battler is still casting.
    if (battler.isCasting()) return false;

    // we need action!
    return true;
  }

  /**
   * Execute the decided queued actions for this battler.
   * @param {JABS_Battler} battler The battler to take action.
   */
  static executeAiPhase2Action(battler)
  {
    // face the target to execute the action.
    battler.turnTowardTarget();

    // execute the queued action.
    battler.processQueuedActions();

    // force a wait of 1/3 a second.
    battler.setWaitCountdown(20);

    // switch to cooldown phase.
    battler.setPhase(3);
  }

  /**
   * The battler decides what action to execute.
   * @param {JABS_Battler} battler The battler deciding the actions.
   */
  static decideAiPhase2Action(battler)
  {
    this.decideEnemyAiPhase2Action(battler);
  }

  /**
   * The enemy battler decides what action to take.
   * Based on it's AI traits, it will make a decision on an action to take.
   * @param {JABS_Battler} battler The enemy battler deciding the action.
   */
  static decideEnemyAiPhase2Action(battler)
  {
    // use the battler's AI to decide the action.
    const decidedSkillId = battler
      .getAiMode()
      .decideAction(
        battler,
        battler.getTarget(),
        battler.getSkillIdsFromEnemy());

    // validate the skill chosen.
    if (!this.isSkillIdValid(decidedSkillId))
    {
      // cancel the setup.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // construct the skill from the battler's perspective.
    const skill = battler.getSkill(decidedSkillId);

    // check to make sure we actually constructed a skill.
    if (!skill)
    {
      // cancel the setup if we decided on nothing.
      this.cancelActionSetup(battler);

      // stop processing.
      return;
    }

    // build the cooldown from the skill.
    const cooldownKey = this.buildEnemyCooldownType(skill);

    // setup the skill for use.
    this.setupActionForNextPhase(battler, decidedSkillId, cooldownKey);
  }

  /**
   * Determines whether or not the parameter provided is a valid skill id.
   * @param {number|number[]|null} skillId The skill id or ids to validate.
   * @returns {boolean} True if it is a single skill id, false otherwise.
   */
  static isSkillIdValid(skillId)
  {
    // if the skill id is something falsy like 0/null/undefined, not valid.
    if (!skillId) return false;

    // if the skill id somehow managed to become many skill ids, not valid.
    if (Array.isArray(skillId)) return false;

    // skill id is valid!
    return true;
  }

  /**
   * Sets up the battler and the action in preparation for the next phase.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {number} skillId The id of the skill to perform the action for.
   * @param {string} cooldownKey The type of cooldown to set to the action.
   */
  static setupActionForNextPhase(battler, skillId, cooldownKey)
  {
    // check if we can setup this action.
    if (!this.canSetupActionForNextPhase(battler, skillId))
    {
      // cancel the action setup.
      this.cancelActionSetup(battler);

      // do not process.
      return;
    }

    // generate the actions based on the given skill id.
    const actions = battler.createJabsActionFromSkill(skillId);

    // set the cooldown type for all actions.
    actions.forEach(action => action.setCooldownType(cooldownKey));

    // destructure the "primary" action out.
    const [action,] = actions;

    // perform the execution animation.
    this.performExecutionAnimation(battler, action);

    // set an arbitrary 1/3 second wait after setup.
    battler.setWaitCountdown(10);

    // set the cast time of this skill.
    battler.setCastCountdown(action.getCastTime());

    // set the decided action.
    battler.setDecidedAction(actions);
  }

  /**
   * Constructs a cooldown key based on the skill.
   * @param {RPG_Skill} skill The chosen skill to determine a cooldown type for.
   * @returns {string} The cooldown key.
   */
  static buildEnemyCooldownType(skill)
  {
    return `${skill.id}-${skill.name}`;
  }

  /**
   * Determines whether or not the given skill can be transformed into an action
   * by the given battler.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {number} skillId The id of the skill to perform the action for.
   * @returns {boolean} True if we can setup an action with this skill id, false otherwise.
   */
  static canSetupActionForNextPhase(battler, skillId)
  {
    // check if we even have a skill to setup.
    if (!skillId) return false;

    // check if this battler can execute this skill.
    if (!battler.canExecuteSkill(skillId)) return false;

    // setup the action!
    return true;
  }

  /**
   * Cancel the setup process for this battler.
   * @param {JABS_Battler} battler The battler canceling the action.
   */
  static cancelActionSetup(battler)
  {
    // set the decided action to null.
    battler.setDecidedAction(null);

    // if we can't setup this skill for some reason, then wait before trying again.
    battler.setWaitCountdown(20);
  }

  /**
   * Performs a brief animation to indicate that the battler has decided an action.
   * The animation depends on whether or not the action was a support action or not.
   * @param {JABS_Battler} battler The battler performing the action.
   * @param {JABS_Action} action The action used to gauge which animation to show.
   */
  static performExecutionAnimation(battler, action)
  {
    // check if this action is a support action.
    if (action.isSupportAction())
    {
      // show the "support decision" animation on the battler.
      battler.showAnimation(J.ABS.Metadata.SupportDecidedAnimationId)
    }
    // the action is not a support action.
    else
    {
      // show the "attack decision" animation on the battler.
      battler.showAnimation(J.ABS.Metadata.AttackDecidedAnimationId)
    }
  }

  /**
   * The battler attempts to move into a position where they can execute
   * their decided skill and land a hit.
   * @param {JABS_Battler} battler The battler trying to get into position.
   */
  static decideAiPhase2Movement(battler)
  {
    // check if we can actually perform phase 2 movement.
    if (!this.canPerformPhase2Movement(battler)) return;

    // check if we need to move closer.
    if (this.needsToMoveCloser(battler))
    {
      // get closer to the target so we can execute the skill.
      this.phase2MoveCloser(battler);
    }
    // the battler is close enough.
    else
    {
      // flag this battler as in-position to execute.
      battler.setInPosition(true);
    }
  }

  /**
   * Determines whether or not this battler can (or needs to) perform ai phase 2 movement.
   * @param {JABS_Battler} battler The battler to check if movement is needed.
   * @returns {boolean} True if this battler needs to move closer, false otherwise.
   */
  static canPerformPhase2Movement(battler)
  {
    // check if this battler has decided on an action yet.
    if (!battler.isActionDecided()) return false;

    // check if we're already in position.
    if (battler.isInPosition()) return false;

    // move closer!
    return true;
  }

  /**
   * Determines whether or not to move closer in AI phase 2.
   * @param {JABS_Battler} battler The battler to check if movement is needed.
   * @returns {boolean} True if this battler needs to move closer, false otherwise.
   */
  static needsToMoveCloser(battler)
  {
    // grab the action.
    const [action,] = battler.getDecidedAction();

    // check if the action is self-targeting; we can cast these wherever.
    if (action.isForSelf()) return false;

    // calculate distance to target to determine if we need to get closer.
    const distanceToTarget = battler.getAllyTarget()
      ? battler.distanceToAllyTarget()
      : battler.distanceToCurrentTarget();

    // check if we are further away than the minimum proximity.
    if (distanceToTarget > action.getProximity()) return true;

    // no need to move.
    return false;
  }

  /**
   * Moves this battler closer to the relevant target.
   * @param {JABS_Battler} battler The battler to move.
   */
  static phase2MoveCloser(battler)
  {
    // check if this battler has an ally target first.
    if (battler.getAllyTarget())
    {
      // move towards the ally.
      battler.smartMoveTowardAllyTarget();
    }
    // this battler does not have an ally target.
    else
    {
      // move towards the target instead.
      battler.smartMoveTowardTarget();
    }
  }
  //endregion Phase 2 - Execute Action Phase

  //region Phase 3 - Post-Action Cooldown Phase
  /**
   * Phase 3 for AI is the phase where the battler is cooling down from its skill usage.
   * While in this phase, the battler will attempt to maintain a "safe" distance from
   * its current target.
   * @param {JABS_Battler} battler The battler for this AI.
   */
  static aiPhase3(battler)
  {
    // check if we are ready for a phase reset.
    if (this.canResetAiPhases(battler))
    {
      // AI loop complete, reset back to phase 1.
      this.resetAiPhases(battler);
    }
    // the battler's post-action cooldown is not finished.
    else
    {
      // check if they are able to move while cooling down.
      if (this.canPerformPhase3Movement(battler))
      {
        // move around while you're waiting for the cooldown.
        this.decideAiPhase3Movement(battler);
      }
    }
  }

  /**
   * Determines wehther or not this battler is ready to reset its AI phases.
   * @param {JABS_Battler} battler The battler to reset phases for.
   * @returns {boolean} True if the battler is ready to reset, false otherwise.
   */
  static canResetAiPhases(battler)
  {
    // check if the battler's cooldown is complete.
    if (!battler.isPostActionCooldownComplete()) return false;

    // ready for reset!
    return true;
  }

  /**
   * Resets the phases for this battler back to phase 1.
   * @param {JABS_Battler} battler The battler to reset phases for.
   */
  static resetAiPhases(battler)
  {
    // AI loop complete, reset back to phase 1.
    battler.resetPhases();
  }

  /**
   * Determines whether or not this battler can move around while waiting for
   * its AI phase reset.
   * @param {JABS_Battler} battler The battler to move.
   * @returns {boolean} True if the battler can move, false otherwise.
   */
  static canPerformPhase3Movement(battler)
  {
    // check if the battler is able to move.
    if (!battler.canBattlerMove()) return false;

    // check if the battler is currently moving.
    if (battler._event.isMoving()) return false;

    // move!
    return true;
  }

  /**
   * Decides where to move while waiting for cooldown to complete from the skill.
   * @param {JABS_Battler} battler The battler in this cooldown phase.
   */
  static decideAiPhase3Movement(battler)
  {
    // move around as-necessary.
    this.decideAiMovement(battler);
  }

  //endregion Phase 3 - Post-Action Cooldown Phase
}
//endregion JABS_AiManager