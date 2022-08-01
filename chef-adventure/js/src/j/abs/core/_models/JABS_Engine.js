//#region JABS_Engine
/**
 * This class is the engine that manages JABS and how `JABS_Action`s interact
 * with the `JABS_Battler`s on the map.
 */
class JABS_Engine // eslint-disable-line no-unused-vars
{
  /**
   * @constructor
   */
  constructor()
  {
    this.initialize();
  }

  //#region properties
  /**
   * Retrieves whether or not the ABS is currently enabled.
   * @returns {boolean} True if enabled, false otherwise.
   */
  get absEnabled()
  {
    return this._absEnabled;
  }

  /**
   * Sets the ABS enabled switch to a new boolean value.
   * @param {boolean} enabled Whether or not the ABS is enabled (default = true).
   */
  set absEnabled(enabled)
  {
    this._absEnabled = enabled;
  }

  /**
   * Retrieves whether or not the ABS is currently paused.
   * @returns {boolean} True if paused, false otherwise.
   */
  get absPause()
  {
    return this._absPause;
  }

  /**
   * Sets the ABS pause switch to a new boolean value.
   * @param {boolean} paused Whether or not the ABS is paused (default = true).
   */
  set absPause(paused)
  {
    this._absPause = paused;
  }

  /**
   * Checks whether or not we have a need to request the ABS-specific menu.
   * @returns {boolean} True if menu requested, false otherwise.
   */
  get requestAbsMenu()
  {
    return this._requestAbsMenu;
  }

  /**
   * Sets the current request for calling the ABS-specific menu.
   * @param {boolean} requested Whether or not we want to request the menu (default: true).
   */
  set requestAbsMenu(requested)
  {
    this._requestAbsMenu = requested;
  }

  /**
   * Gets whether or not there is a request to cycle through party members.
   * @returns {boolean}
   */
  get requestPartyRotation()
  {
    return this._requestPartyRotation;
  }

  /**
   * Sets the request for party rotation.
   * @param {boolean} rotate True if we want to rotate party members, false otherwise.
   */
  set requestPartyRotation(rotate)
  {
    this._requestPartyRotation = rotate;
  }

  /**
   * Gets whether or not there is a request to refresh the JABS menu.
   * The most common use case for this is adding new commands to the menu.
   * @returns {boolean}
   */
  get requestJabsMenuRefresh()
  {
    return this._requestJabsMenuRefresh;
  }

  /**
   * Sets the request for refreshing the JABS menu.
   * @param {boolean} requested True if we want to refresh the JABS menu, false otherwise.
   */
  set requestJabsMenuRefresh(requested)
  {
    this._requestJabsMenuRefresh = requested;
  }

  /**
   * Checks whether or not we have a need to request rendering for new actions.
   * @returns {boolean} True if needing to render actions, false otherwise.
   */
  get requestActionRendering()
  {
    return this._requestActionRendering;
  }

  /**
   * Issues a request to render actions on the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestActionRendering(request)
  {
    this._requestActionRendering = request;
  }

  /**
   * Checks whether or not we have a need to request rendering for new loot sprites.
   * @returns {boolean} True if needing to render loot, false otherwise.
   */
  get requestLootRendering()
  {
    return this._requestLootRendering;
  }

  /**
   * Issues a request to render loot onto the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestLootRendering(request)
  {
    this._requestLootRendering = request;
  }

  /**
   * Checks whether or not we have a need to request a clearing of the action sprites
   * on the current map.
   * @returns {boolean} True if clear map requested, false otherwise.
   */
  get requestClearMap()
  {
    return this._requestClearMap;
  }

  /**
   * Issues a request to clear the map of all stale actions.
   * @param {boolean} request Whether or not we want to clear the battle map (default = true).
   */
  set requestClearMap(request)
  {
    this._requestClearMap = request;
  }

  /**
   * Checks whether or not we have a need to request a clearing of the loot sprites
   * on the current map.
   * @returns {boolean} True if clear loot requested, false otherwise.
   */
  get requestClearLoot()
  {
    return this._requestClearLoot;
  }

  /**
   * Issues a request to clear the map of any collected loot.
   * @param {boolean} request True if clear loot requested, false otherwise.
   */
  set requestClearLoot(request)
  {
    this._requestClearLoot = request;
  }

  /**
   * Checks whether or not we have a need to refresh all character sprites on the current map.
   * @returns {boolean} True if refresh is requested, false otherwise.
   */
  get requestSpriteRefresh()
  {
    return this._requestSpriteRefresh;
  }

  /**
   * Issues a request to refresh all character sprites on the current map.
   * @param {boolean} request True if we want to refresh all sprites, false otherwise.
   */
  set requestSpriteRefresh(request)
  {
    this._requestSpriteRefresh = request;
  }
  //#endregion properties

  /**
   * Creates all members available in this class.
   */
  initialize(isMapTransfer = true)
  {
    /**
     * The `JABS_Battler` representing the player.
     * @type {JABS_Battler}
     */
    this._player1 = null;

    /**
     * True if we want to review available events for rendering, false otherwise.
     * @type {boolean}
     */
    this._requestActionRendering = false;

    /**
     * True if we want to review available loot for rendering, false otherwise.
     * @type {boolean}
     */
    this._requestLootRendering = false;

    /**
     * True if we want to cycle through our party members, false otherwise.
     * @type {boolean}
     */
    this._requestPartyRotation = false;

    /**
     * True if we want to empty the map of all action sprites, false otherwise.
     * @type {boolean}
     */
    this._requestClearMap = false;

    /**
     * True if we want to empty the map of all stale loot sprites, false otherwise.
     * @type {boolean}
     */
    this._requestClearLoot = false;

    /**
     * True if we want to refresh all sprites and their add-ons, false otherwise.
     * @type {boolean}
     */
    this._requestSpriteRefresh = false;

    /**
     * A collection to manage all `JABS_Action`s on this battle map.
     * @type {JABS_Action[]}
     */
    this._actionEvents = [];

    /**
     * A collection of the metadata of all action-type events.
     * @type {rm.types.Event[]}
     */
    this._activeActions = isMapTransfer ? [] : this._activeActions ?? [];

    /**
     * True if we want to call the ABS-specific menu, false otherwise.
     * @type {boolean}
     */
    this._requestAbsMenu = false;

    /**
     * True if we want to refresh the commands of the JABS menu, false otherwise.
     * @type {boolean}
     */
    this._requestJabsMenuRefresh = false;

    /**
     * Whether or not this ABS is enabled.
     * If disabled, button input and enemy AI will be disabled.
     * Enemy battlers on the map will instead act like their
     * regularly programmed events.
     *
     * This will most likely be used for when the dev enters a town and the
     * populace is peaceful.
     * @type {boolean}
     */
    this._absEnabled = true;

    /**
     * Whether or not this ABS is temporarily paused.
     * If paused, all battlers on the map including the player will halt
     * movement, though timers will still tick.
     * @type {boolean}
     */
    this._absPause = false;

    /**
     * A collection of all ongoing states in the context of how they
     * interact with the battlers on the map. This is typically kept in-sync with
     * the individual battlers.
     * @type {JABS_TrackedState[]}
     */
    this._jabsStateTracker = [];
  }

  /**
   * Adds a new `JABS_Action` to this battle map for tracking.
   * The additional metadata is optional, omitted when executing direct actions.
   * @param {JABS_Action} actionEvent The `JABS_Action` to add.
   * @param {rm.types.Event} actionEventData The event metadata, if anything.
   */
  addActionEvent(actionEvent, actionEventData)
  {
    this._actionEvents.push(actionEvent);
    if (actionEventData)
    {
      this._activeActions.push(actionEventData);
    }
  }

  /**
   * Finds the event metadata associated with the given `uuid`.
   * @param {string} uuid The `uuid` to find.
   * @returns {rm.types.Event} The event associated with the `uuid`.
   */
  event(uuid)
  {
    const results = this._activeActions.filter(eventData => eventData.uniqueId === uuid);
    return results[0];
  }

  /**
   * Clears all currently managed `JABS_Action`s on this battle map that are marked
   * for removal.
   */
  clearActionEvents()
  {
    const actionEvents = this._actionEvents;
    const updatedActionEvents = actionEvents.filter(action => !action.getNeedsRemoval());

    if (actionEvents.length !== updatedActionEvents.length)
    {
      this.requestClearMap = true;
    }

    this._actionEvents = updatedActionEvents;
  }

  /**
   * Checks for how many living enemies there are present on the map.
   * "Enemies" is defined as "number of `Game_Battler`s that are `Game_Enemy`s".
   * @returns {boolean} True if there are any living enemies on this map, false otherwise.
   */
  anyLivingEnemies()
  {
    const anyEnemies = $gameMap
      .getBattlers()
      .find(battler => battler.isEnemy() && !battler.isInanimate());
    return !!anyEnemies;
  }

  /**
   * Determines the animation id for this particular attack.
   * -1 as an animation id represents "use normal attack", but enemies don't have that!
   * So for the case of enemies, it'll instead return the default.
   * @param {object} skill The $dataSkills object for this skill.
   * @param {JABS_Battler} caster The caster of this skill.
   */
  getAnimationId(skill, caster)
  {
    // grab the animation id from the skill.
    const {animationId} = skill;

    // check if the animation id indicates we should look to the weapon.
    if (animationId === -1)
    {
      // check if the caster is an enemy.
      if (caster.isEnemy())
      {
        // return the default attack animation id.
        return J.ABS.DefaultValues.AttackAnimationId;
      }
      // the caster was not an enemy.

      // grab the weapons of the caster.
      const weapons = caster.getBattler().weapons();

      // check to make sure we have weapons.
      if (weapons.length > 0)
      {
        // grab the first weapon's attack animation.
        return weapons[0].animationId;
      }
      // we are barefisting it.

      // just return the default attack animation id.
      return J.ABS.DefaultValues.AttackAnimationId;


    }

    return animationId;
  }

  /**
   * Returns the `JABS_Battler` associated with the player.
   * @returns {JABS_Battler} The battler associated with the player.
   */
  getPlayer1()
  {
    return this._player1;
  }

  /**
   * Initializes the player properties associated with this battle map.
   */
  initializePlayer1()
  {
    // check if we can initialize the player.
    if (!this.canInitializePlayer1()) return;

    // create a new player object.
    this._player1 = JABS_Battler.createPlayer();

    // assign the uuid to the player.
    $gamePlayer.setMapBattler(this._player1.getUuid());
  }

  /**
   * Determines whether or not the player should be initialized.
   * @returns {boolean}  True if the player should, false otherwise.
   */
  canInitializePlayer1()
  {
    // if the player doesn't exist, initialize it.
    if (this._player1 === null) return true;

    // check if the player is currently assigned a battler.
    if (!this._player1.getBattlerId()) return true;

    // initialize the player!
    return false;
  }

  //#region update
  /**
   * Updates all the battlers on the current map.
   * Also, this includes managing player input and updating active `JABS_Action`s.
   */
  update()
  {
    // update the player and things related to the player.
    this.updatePlayer();

    // update the AI of non-player battlers.
    this.updateAiBattlers();

    // update all active actions on the map.
    this.updateActions();

    // update all JABS states being tracked.
    this.updateJabsStates();

    // handle input from the player(s).
    this.updateInput();
  }

  //#region update player
  /**
   * Cycles through and updates all things related to the player.
   */
  updatePlayer()
  {
    // if we cannot update the player, then do not.
    if (!this.canUpdatePlayer()) return;

    // grab the player.
    const player = this.getPlayer1();

    // if the player is dead, handle player defeat.
    if (player.isDead())
    {
      this.handleDefeatedPlayer();
      return;
    }

    // process any queued actions executed in prior frame.
    player.processQueuedActions();

    // perform all battler updates.
    player.update();
  }

  /**
   * Determines whether or not we can update the player battler.
   * @returns {boolean}
   */
  canUpdatePlayer()
  {
    // grab the player.
    const player = this.getPlayer1();

    // if we don't have a player, do not update.
    if (player === null) return false;

    // update!
    return true;
  }
  //#region state tracking

  /**
   * Gets the collection of all JABS states that affect battlers on the map.
   * @returns {JABS_TrackedState[]}
   */
  getJabsStates()
  {
    return this._jabsStateTracker;
  }

  /**
   * Add a new JABS state to the tracker.
   * @param {JABS_TrackedState} newJabsState The JABS state to add.
   */
  addJabsState(newJabsState)
  {
    this._jabsStateTracker.push(newJabsState);
  }

  /**
   * Updates all JABS states for all battlers that are afflicted.
   */
  updateJabsStates()
  {
    // iterate over all JABS-managed states.
    this.getJabsStates()
    // execute the update against it.
      .forEach(this.updateJabsState, this);

    if (this._jabsStateTracker.length > 200)
    {
      this._jabsStateTracker.pop();
    }
  }

  /**
   * Updates a single JABS state.
   * @param {JABS_TrackedState} jabsState The JABS state to update.
   */
  updateJabsState(jabsState)
  {
    jabsState.update();
  }

  /**
   * Adds a state tracker to the collection.
   * @param {JABS_TrackedState} newTrackedState The state tracker to add.
   */
  addStateTracker(newTrackedState)
  {
    // attempt to reapply the state.
    const reapplied = this.reapplyState(newTrackedState);

    // if reapplied, do not add another copy of the state... or should we?
    if (reapplied) return;

    // if not reapplied, then add the state to the tracker.
    this.addJabsState(newTrackedState);
  }

  /**
   * Reapply the state to the same battler afflicted with the same state.
   * This refreshes the duration only.
   * @param {JABS_TrackedState} newTrackedState The state tracker to add.
   * @returns {boolean} True if the state was reapplied, false otherwise.
   */
  reapplyState(newTrackedState)
  {
    // seek the index of the same state on the same battler.
    const index = this._jabsStateTracker
      .findIndex(trackedState =>
      // check if the battlers are the same.
        trackedState.battler === newTrackedState.battler &&
      // check if the state ids are the same.
      trackedState.stateId === newTrackedState.stateId);

    // track if it was reapplied or not.
    let reapplied = false;

    // check to make sure we have to consider reapplication.
    if (index > -1)
    {
      // grab the data from the state tracker.
      const data = this._jabsStateTracker[index];

      // refresh the duration to new max.
      data.duration = newTrackedState.duration;

      // undo expiration if it was expired.
      data.expired = false;

      // flag that this was reapplied.
      reapplied = true;
    }

    // return the flag.
    return reapplied;
  }

  /**
   * Gets all tracked states for a given battler.
   * @param {Game_Battler} battler The battler to find tracked states for.
   * @returns {JABS_TrackedState[]}
   */
  getStateTrackerByBattler(battler)
  {
    return this._jabsStateTracker.filter(trackedState => trackedState.battler === battler);
  }

  /**
   * Finds the tracked state associated with a specific battler and a state id.
   * @param {Game_Battler} battler The battler to find a state for.
   * @param {number} stateId The state id to find on the given battler.
   * @returns {JABS_TrackedState}
   */
  findStateTrackerByBattlerAndState(battler, stateId)
  {
    return this.getStateTrackerByBattler(battler)
      .find(trackedState =>
        trackedState.battler === battler &&
      trackedState.stateId === stateId);
  }
  //#endregion state tracking
  //#endregion update player

  //#region update ai battlers
  /**
   * Cycles through and updates all things related to battlers other than the player.
   */
  updateAiBattlers()
  {
    // if we cannot update the battlers controlled by AI, then do not.
    if (!this.canUpdateAiBattlers()) return;

    // grab all "visible" battlers to the player.
    const visibleBattlers = $gameMap.getBattlersWithinRange(
      this.getPlayer1(),
      30,
      false);

    // update each of them.
    visibleBattlers.forEach(this.performAiBattlerUpdate, this);
  }

  /**
   * Determines whether or not we can update the ai-controlled battlers.
   * @returns {boolean}
   */
  canUpdateAiBattlers()
  {
    return true;
  }

  /**
   * Performs the update against this non-player battler.
   *
   * NOTE: The player's battler gets duplicated once into the "all battlers"
   * collection after the first party cycle. The initial check prevents updating
   * the player battler twice if they are in that collection.
   * @param {JABS_Battler} battler
   */
  performAiBattlerUpdate(battler)
  {
    // if this battler is the player, do not update.
    if (battler === this.getPlayer1()) return;

    // update the battler.
    battler.update();

    // check if the battler was defeated and needs handling.
    if (this.shouldHandleDefeatedTarget(battler))
    {
      // render battler invincible while processing defeat.
      battler.setInvincible();

      // process defeat.
      this.handleDefeatedTarget(battler, this.getPlayer1());
    }
  }

  /**
   * Determines whether or not a battler should be handled as defeated.
   * @param {JABS_Battler} target The potentially defeated battler.
   * @returns {boolean} true if the battler should be handled for defeat, false otherwise.
   */
  shouldHandleDefeatedTarget(target)
  {
    // target is not considered defeated if not dead.
    if (!target.isDead()) return false;

    // target is not considered defeated while dying.
    if (target.isDying()) return false;

    // do not re-handle defeated targets.
    if (target.isEnemy() && target.getCharacter()._erased) return false;

    // target is defeated!
    return true;
  }
  //#endregion update ai battlers

  //#region update input
  /**
   * Handles the player input.
   */
  updateInput()
  {
    // do not process input if we cannot process it.
    if (!this.canUpdateInput()) return;

    // update the input.
    if (!JABS_InputAdapter.hasControllers())
    {
      console.warn(`No input managers have been registered with the input adapter!`);
      console.warn(`if you built your own, be sure to run "JABS_InputAdapter.register(controller)"!`);
    }
  }

  /**
   * Determines whether or not to process JABS input.
   * @returns {boolean}
   */
  canUpdateInput()
  {
    // if an event is executing on the map, do not update.
    if ($gameMap.isEventRunning()) return false;

    // if the message window is up, do not update.
    if ($gameMessage.isBusy()) return false;

    // if the jabs menu is up, do not update.
    if ($jabsEngine.requestAbsMenu) return false;

    // if the JABS engine is paused, do not update.
    if ($jabsEngine.absPause) return false;

    // if the JABS engine is disabled, do not update.
    if (!$jabsEngine.absEnabled) return false;

    // update!
    return true;
  }

  /**
   * Actually executes the party cycling and swaps to the next living member.
   */
  performPartyCycling()
  {
    // check if we can party cycle.
    if ($gameParty._actors.length === 1) return;

    // determine which battler in the party is the next living battler.
    const nextAllyIndex = $gameParty._actors.findIndex(this.canCycleToAlly);

    // can't cycle if there are no living/valid members.
    if (nextAllyIndex === -1)
    {
      console.warn('No members available to cycle to.');
      return;
    }

    // swap to the next party member in the sequence.
    $gameParty._actors = $gameParty._actors.concat($gameParty._actors.splice(0, nextAllyIndex));
    $gamePlayer.refresh();
    $gamePlayer.requestAnimation(40, false);

    // recreate the JABS player battler and set it to the player character.
    this._player1 = JABS_Battler.createPlayer();
    const newPlayer = this.getPlayer1().getCharacter();
    newPlayer.setMapBattler(this._player1.getUuid());

    // request the scene overlord to take notice and react accordingly (refresh hud etc).
    this.requestPartyRotation = true;

    // if the log is present, then do log things.
    if (J.LOG)
    {
      const log = new MapLogBuilder()
        .setupPartyCycle(this.getPlayer1().battlerName())
        .build();
      $gameTextLog.addLog(log);
    }

    // also trigger an update against the switching player.
    this.getPlayer1().getBattler().onBattlerDataChange();

    // request a map-wide sprite refresh on cycling.
    this.requestSpriteRefresh = true;
  }

  /**
   * Determines whether or not this member can be party cycled to.
   * @param {number} actorId The id of the actor.
   * @param {number} partyIndex The index of the member in the party.
   * @returns
   */
  canCycleToAlly(actorId, partyIndex)
  {
    // ignore switching to self.
    if (partyIndex === 0) return false;

    // grab the actor we are attempting to cycle to.
    const actor = $gameActors.actor(actorId);

    // don't switch to a dead member.
    if (actor.isDead()) return false;

    // don't switch with a member that is locked.
    if (actor.switchLocked()) return false;

    // perform!
    return true;
  }
  //#endregion update input

  //#region update actions
  /**
   * Updates all `JABS_Action`s currently on the battle map. This includes checking for collision,
   * checking piercing information, and applying effects against the map.
   */
  updateActions()
  {
    const actionEvents = this._actionEvents;
    if (!actionEvents.length) return;

    actionEvents.forEach(this.updateAction, this);
  }

  /**
   * Updates a single `JABS_Action` that is active on the map.
   * @param {JABS_Action} action The action being updated.
   */
  updateAction(action)
  {
    // decrement the delay timer prior to action countdown.
    action.countdownDelay();

    // if we're still delaying and not triggering by touch...
    if (!this.canUpdateAction(action)) return;

    // if the delay is completed, decrement the action timer.
    if (action.isDelayCompleted())
    {
      action.countdownDuration();
    }

    // if the duration of the action expires, remove it.
    if (this.canCleanupAction(action))
    {
      this.cleanupAction(action);
      return;
    }

    // if there is a delay between hits, count down on it.
    if (!this.canActionPierce(action))
    {
      action.modPiercingDelay();
      return;
    }

    // determine targets that this action collided with.
    this.processActionCollision(action);
  }

  /**
   * Determines if the action can be updated.
   * @param {JABS_Action} action The action to potentially update.
   * @returns {boolean} True if the action can be updated, false otherwise.
   */
  canUpdateAction(action)
  {
    // if the event is a trigger action using delay, but hasn't completed, do not update.
    if (!action.triggerOnTouch() && !action.isDelayCompleted()) return false;

    // update!
    return true;
  }

  /**
   * Determines whether or not to cleanup the action.
   * @param {JABS_Action} action The action to potentially cleanup.
   * @returns {boolean} True if the action should be cleaned up, false otherwise.
   */
  canCleanupAction(action)
  {
    // if the action is expired, then cleanup.
    if (action.isActionExpired()) return true;

    // if the action has run out of piercing hits, then cleanup.
    if (action.getPiercingTimes() <= 0) return true;

    // not ready for cleanup.
    return false;
  }

  /**
   * Cleans up a `JABS_Action`.
   * @param {JABS_Action} action The action to be cleaned up.
   */
  cleanupAction(action)
  {
    // if the minimum duration hasn't passed, do not cleanup.
    if (!action.getDuration() >= JABS_Action.getMinimumDuration()) return;

    // execute the action's pre-cleanup logic.
    action.preCleanupHook();

    // flag the action for removal.
    action.setNeedsRemoval();

    // clear out stale action events.
    this.clearActionEvents();
  }

  /**
   * Determines whether or not the action is ready to hit again.
   * @param {JABS_Action} action The action to potentially pierce.
   * @returns {boolean} True if the action can hit again, false otherwise.
   */
  canActionPierce(action)
  {
    // if the action has a remaining piercing delay, do not trigger.
    if (action.getPiercingDelay() > 0) return false;

    // hit again!
    return true;
  }

  /**
   * Executes all effects of when an action collides with one or more targets.
   * @param {JABS_Action} action The action to process.
   */
  processActionCollision(action)
  {
    // if we cannot process action collision, then do not collide.
    if (!this.canProcessActionCollision(action)) return;

    // iterate over all targets found.
    this.getCollisionTargets(action)
    // apply the battle effects of the action against each target.
      .forEach(target => this.applyPrimaryBattleEffects(action, target), this);

    // execute any additional post-collision processing.
    this.handleActionPostCollision(action);
  }

  /**
   * Determines whether or not this action can collide with targets.
   * @param {JABS_Action} action The action to process.
   * @returns {boolean} True if we can collide with targets, false otherwise.
   */
  canProcessActionCollision(action)
  {
    // check if we have any collision targets.
    if (this.getCollisionTargets(action).length === 0) return false;

    // we have collision targets!
    return true;
  }

  /**
   * Handles any post-collision processing, such as ending delays.
   * @param {JABS_Action} action The action that just collided.
   */
  handleActionPostCollision(action)
  {
    // if we were delaying, end the delay.
    action.endDelay();

    // if the target can pierce enemies, adjust those values.
    action.resetPiercingDelay();
    action.modPiercingTimes();
  }
  //#endregion update actions
  //#endregion update

  //#region functional
  //#region action execution
  /**
   * Generates a new `JABS_Action` based on a skillId, and executes the skill.
   * This overrides the need for costs or cooldowns, and is intended to be
   * used from the map, within an event's custom move routes.
   * @param {JABS_Battler} caster The battler executing the skill.
   * @param {number} skillId The skill to be executed.
   * @param {boolean=} isRetaliation Whether or not this skill is from a retaliation; defaults to false.
   * @param {number=} x The target's `x` coordinate; defaults to null.
   * @param {number=} y The target's `y` coordinate; defaults to null.
   */
  forceMapAction(caster, skillId, isRetaliation = false, x = null, y = null)
  {
    // generate the forced actions based on the given skill id.
    const actions = caster.createJabsActionFromSkill(skillId, isRetaliation);

    // if we cannot execute map actions, then do not.
    if (!this.canExecuteMapActions(caster, actions)) return;

    // iterate over each action and execute them as the caster.
    actions.forEach(action => this.executeMapAction(caster, action, x, y));
  }

  /**
   * Executes all provided actions at the given coordinates if possible.
   * @param {JABS_Battler} caster The battler executing the action.
   * @param {JABS_Action[]} actions All actions to perform.
   * @param {number|null} targetX The target's `x` coordinate, if applicable.
   * @param {number|null} targetY The target's `y` coordinate, if applicable.
   */
  executeMapActions(caster, actions, targetX = null, targetY = null)
  {
    // if we cannot execute map actions, then do not.
    if (!this.canExecuteMapActions(caster, actions)) return;

    // apply on-execution effects for this action.
    this.applyOnExecutionEffects(caster, actions[0]);

    // iterate over each action and execute them as the caster.
    actions.forEach(action => this.executeMapAction(caster, action, targetX, targetY));
  }

  /**
   * Determines whether or not the given map actions can be executed by the caster.
   * @param {JABS_Battler} caster The battler executing the action.
   * @param {JABS_Action[]} actions All actions to perform.
   * @returns {boolean} True if the actions can be executed, false otherwise.
   */
  canExecuteMapActions(caster, actions)
  {
    // if there are no actions to execute, then do not execute.
    if (!actions.length) return false;

    // execute!
    return true;
  }

  /**
   * Applies any on-execution effects to the caster based on the actions.
   * @param caster
   * @param primaryAction
   */
  applyOnExecutionEffects(caster, primaryAction)
  {
    // retaliation skills are exempt from execution effects.
    if (primaryAction.isRetaliation()) return;

    // pay the primary action's skill costs.
    this.paySkillCosts(caster, primaryAction);

    // apply the necessary cooldowns for the action against the caster.
    this.applyCooldownCounters(caster, primaryAction);
  }

  /**
   * Executes the provided `JABS_Action`.
   * It generates a copy of an event from the "ActionMap" and fires it off
   * based on it's move route.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   * @param {number?} targetX The target's `x` coordinate, if applicable.
   * @param {number?} targetY The target's `y` coordinate, if applicable.
   */
  executeMapAction(caster, action, targetX, targetY)
  {
    // handle the possibility of "freecombo".
    this.handleActionCombo(caster, action);

    // handle the pose for this action.
    this.handleActionPose(caster, action);

    // handle the cast animation for this action.
    this.handleActionCastAnimation(caster, action);

    // handle the generation of the action on the map.
    this.handleActionGeneration(caster, action, targetX, targetY);
  }

  /**
   * Handles the combo functionality behind this action.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  handleActionCombo(caster, action)
  {
    // check if this action has the "freecombo" tag.
    if (action.getBaseSkill().jabsFreeCombo)
    {
      // trigger the free combo effect for this action.
      this.checkComboSequence(caster, action)
    }
  }

  /**
   * Handles the pose functionality behind this action.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  handleActionPose(caster, action)
  {
    // perform the action's corresponding pose.
    caster.performActionPose(action.getBaseSkill());
  }

  /**
   * Handles the cast animation functionality behind this action.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  handleActionCastAnimation(caster, action)
  {
    // check if a cast animation exists.
    const casterAnimation = action.getCastAnimation();
    if (casterAnimation)
    {
      // execute the cast animation.
      caster.getCharacter().requestAnimation(casterAnimation);
    }
  }

  /**
   * Handles adding this action to the map if applicable.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   * @param {number|null} x The target's `x` coordinate, if applicable.
   * @param {number|null} y The target's `y` coordinate, if applicable.
   */
  handleActionGeneration(caster, action, x, y)
  {
    // all actions start with null.
    let actionEventData = null;

    // check if this is NOT a direct action.
    if (!action.isDirectAction())
    {
      // construct the action event data to appear visually on the map.
      actionEventData = this.buildActionEventData(caster, action, x, y);
      this.addJabsActionToMap(actionEventData, action);
    }

    // add the action to the tracker.
    this.addActionEvent(action, actionEventData);
  }

  /**
   * It generates a copy of an event from the "ActionMap".
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   * @param {number|null} x The target's `x` coordinate, if applicable.
   * @param {number|null} y The target's `y` coordinate, if applicable.
   * @returns {rm.types.Event}
   */
  buildActionEventData(caster, action, x, y)
  {
    const eventId = action.getActionId();
    const actionEventData = JsonEx.makeDeepCopy($actionMap.events[eventId]);

    actionEventData.x = x ?? caster.getX();
    actionEventData.y = y ?? caster.getY();
    actionEventData.isAction = true;
    actionEventData.id += 1000;
    actionEventData.uniqueId = action.getUuid();
    actionEventData.actionDeleted = false;
    return actionEventData;
  }

  /**
   * Determines the directions of all projectiles.
   * @param {number} facing The base direction the battler is facing.
   * @param {number} projectile The pattern/number of projectiles to generate directions for.
   * @returns {number[]} The collection of directions to fire projectiles off in.
   */
  determineActionDirections(facing, projectile)
  {
    const directions = [];
    switch (projectile)
    {
      case 1:
        directions.push(facing);
        break;
      case 2:
        directions.push(this.rotate45degrees(facing, true));
        directions.push(this.rotate45degrees(facing, false));
        break;
      case 3:
        directions.push(facing);
        directions.push(this.rotate45degrees(facing, true));
        directions.push(this.rotate45degrees(facing, false));
        break;
      case 4:
        directions.push(facing);
        directions.push(this.rotate90degrees(facing, true));
        directions.push(this.rotate90degrees(facing, false));
        directions.push(this.rotate180degrees(facing));
        break;
      case 8:
        directions.push(
          1, 3, 7, 9,   // diagonal
          2, 4, 6, 8);  // cardinal
        break;
    }

    return directions;
  }

  /**
   * Rotates the direction provided 45 degrees.
   * @param {number} direction The base direction to rotate from.
   * @param {boolean} clockwise True if rotating clockwise, false otherwise.
   * @returns {number} The direction after rotation.
   */
  rotate45degrees(direction, clockwise)
  {
    let newDirection = direction;
    switch (direction)
    {
      case J.ABS.Directions.UP:
        newDirection = clockwise ? 9 : 7;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = clockwise ? 3 : 9;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = clockwise ? 7 : 1;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = clockwise ? 1 : 3;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = clockwise ? 4 : 2;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = clockwise ? 2 : 6;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = clockwise ? 8 : 4;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = clockwise ? 6 : 8;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  }

  /**
   * Rotates the direction provided 90 degrees.
   * @param {number} direction The base direction to rotate from.
   * @param {boolean} clockwise True if rotating clockwise, false otherwise.
   * @returns {number} The direction after rotation.
   */
  rotate90degrees(direction, clockwise)
  {
    let newDirection = direction;
    switch (direction)
    {
      case J.ABS.Directions.UP:
        newDirection = clockwise ? 6 : 4;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = clockwise ? 2 : 8;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = clockwise ? 8 : 2;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = clockwise ? 4 : 6;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = clockwise ? 7 : 3;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = clockwise ? 1 : 9;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = clockwise ? 9 : 1;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = clockwise ? 3 : 7;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  }

  /**
   * Rotates the direction provided 180 degrees.
   * @param {number} direction The base direction to rotate from.
   * @returns {number} The direction after rotation.
   */
  rotate180degrees(direction)
  {
    let newDirection = direction;
    switch (direction)
    {
      case J.ABS.Directions.UP:
        newDirection = 2;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = 4;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = 6;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = 8;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = 9;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = 7;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = 3;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = 1;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  }

  /**
   * Checks whether or not this skill is a basic attack.
   * @param {string} cooldownKey The cooldown key to check.
   * @returns {boolean} True if the skill is a basic attack, false otherwise.
   */
  isBasicAttack(cooldownKey)
  {
    const isMainHand = cooldownKey === JABS_Button.Mainhand;
    const isOffHand = cooldownKey === JABS_Button.Offhand;
    return (isMainHand || isOffHand);
  }

  /**
   * Pays the costs for the skill (mp/tp default) if applicable.
   * @param {JABS_Battler} caster The battler casting the action.
   * @param {JABS_Action} action The action(skill) to pay the cost for.
   */
  paySkillCosts(caster, action)
  {
    const battler = caster.getBattler();
    const skill = action.getBaseSkill();
    battler.paySkillCost(skill);
  }

  /**
   * Applies the cooldowns to the battler.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  applyCooldownCounters(caster, action)
  {
    this.applyPlayerCooldowns(caster, action);
  }

  /**
   * Applies cooldowns in regards to the player for the casted action.
   * @param {JABS_Battler} caster The player.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  applyPlayerCooldowns(caster, action)
  {
    const cooldownType = action.getCooldownType();
    const cooldownValue = action.getCooldown();
    const skill = action.getBaseSkill();

    // if the skill has a unique cooldown functionality,
    // then each slot will have an independent cooldown.
    if (skill.jabsUniqueCooldown || this.isBasicAttack(cooldownType))
    {
      // if the skill is unique, only apply the cooldown to the slot assigned.
      caster.setCooldownCounter(cooldownType, cooldownValue);
      return;
    }

    // if the skill is not unique, then the cooldown applies to all slots it is equipped to.
    const equippedSkills = caster.getBattler().getAllEquippedSkills();
    equippedSkills.forEach(skillSlot =>
    {
      if (skillSlot.id === skill.id)
      {
        caster.setCooldownCounter(skillSlot.key, cooldownValue);
      }
    });
  }

  /**
   * Creates a new `JABS_Action` and adds it to the map and tracking.
   * @param {rm.types.Event} actionEventData An object representing the data of a `Game_Event`.
   * @param {JABS_Action} action An object representing the data of a `Game_Event`.
   */
  addJabsActionToMap(actionEventData, action)
  {
    // add the data to the $datamap.events.
    $dataMap.events[$dataMap.events.length] = actionEventData;
    const newIndex = $dataMap.events.length - 1;
    actionEventData.actionIndex = newIndex;

    // assign this so it exists, but isn't valid.
    actionEventData.lootIndex = 0;

    // create the event by hand with this new data
    const actionEventSprite = new Game_Event(
      J.ABS.DefaultValues.ActionMap,
      newIndex);

    const { x: actionX, y: actionY } = actionEventData;
    actionEventSprite._realX = actionX;
    actionEventSprite._realY = actionY;
    actionEventSprite._x = actionX;
    actionEventSprite._y = actionY;

    // give it a name.
    const skillName = action.getBaseSkill().name;
    const casterName = action.getCaster().battlerName();
    actionEventSprite.__actionName = `_${casterName}-${skillName}`;

    // on rare occasions, the timing of adding an action to the map coincides
    // with the removal of the caster which breaks the ordering of the events.
    // the result will throw an error and break. This should catch that, and if
    // not, then the try-catch will.
    if (!actionEventData || !actionEventData.pages.length)
    {
      console.error("that rare error occurred!");
      return;
    }

    const pageIndex = actionEventSprite.findProperPageIndex();
    const {characterIndex, characterName} = actionEventData.pages[pageIndex].image;

    actionEventSprite.setActionSpriteNeedsAdding();
    actionEventSprite._eventId = actionEventData.id;
    actionEventSprite._characterName = characterName;
    actionEventSprite._characterIndex = characterIndex;
    const pageData = actionEventData.pages[pageIndex];
    actionEventSprite.setMoveFrequency(pageData.moveFrequency);
    actionEventSprite.setMoveRoute(pageData.moveRoute);
    actionEventSprite.setDirection(action.direction());
    actionEventSprite.setCustomDirection(action.direction());
    actionEventSprite.setCastedDirection($gamePlayer.direction());
    actionEventSprite.setMapActionData(action);

    // overwrites the "start" of the event for this event to be nothing.
    // this prevents the player from accidentally interacting with the
    // sword swing or whatever is generated by the action.
    actionEventSprite.start = () => false;

    action.setActionSprite(actionEventSprite);
    $gameMap.addEvent(actionEventSprite);
    this.requestActionRendering = true;
  }

  /**
   * Adds the loot to the map.
   * @param {number} targetX The `x` coordinate of the battler dropping the loot.
   * @param {number} targetY The `y` coordinate of the battler dropping the loot.
   * @param {RPG_EquipItem|RPG_Item} item The loot's raw data object.
   */
  addLootDropToMap(targetX, targetY, item)
  {
    // clone the loot data from the action map event id of 1.
    const lootEventData = JsonEx.makeDeepCopy($actionMap.events[1]);
    lootEventData.x = targetX;
    lootEventData.y = targetY;

    // add the loot event to the datamap list of events.
    $dataMap.events[$dataMap.events.length] = lootEventData;
    const newIndex = $dataMap.events.length - 1;
    lootEventData.lootIndex = newIndex;

    // create the loot event by hand with this new data.
    const jabsLootData = new JABS_LootDrop(item);
    lootEventData.uuid = jabsLootData.uuid;

    // set the duration of this loot drop
    // if a custom time is available, then use that, otherwise use the default.
    jabsLootData.duration = item.jabsExpiration ?? J.ABS.Metadata.DefaultLootExpiration;

    // generate a new event to visually represent the loot drop and flag it for adding.
    const eventId = $dataMap.events.length - 1;
    const lootEvent = new Game_Event($gameMap.mapId(), eventId);
    lootEvent.setLootData(jabsLootData);
    lootEvent.setLootNeedsAdding();

    // add loot event to map.
    this.requestLootRendering = true;
    $gameMap.addEvent(lootEvent);
  }

  /**
   * Applies an action against a designated target battler.
   *
   * This is the orchestration method that manages the execution of an action against
   * a given target.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyPrimaryBattleEffects(action, target)
  {
    // execute the action against the target.
    this.executeSkillEffects(action, target);

    // apply effects that require landing a successful hit.
    this.applyOnHitEffects(action, target);

    // applies additional effects that come after the skill execution.
    this.continuedPrimaryBattleEffects(action, target);

    // run any additional functionality that we needed to run after a skill is executed.
    this.postPrimaryBattleEffects(action, target);
  }

  /**
   * Attempts to execute the skill effects of this action against the target.
   * @param {JABS_Action} action The action being executed.
   * @param {JABS_Battler} target The target to apply skill effects against.
   * @returns {Game_ActionResult}
   */
  executeSkillEffects(action, target)
  {
    // handle any pre-execution effects.
    this.preExecuteSkillEffects(action, target);

    // get whether or not this action was unparryable.
    let isUnparryable = (action.isUnparryable());

    // if the target is a player and also dashing...
    if (target.isPlayer() && target.getCharacter().isDashButtonPressed())
    {
      // they cannot parry anything.
      isUnparryable = true;
    }

    // check whether or not this action was parried.
    const caster = action.getCaster();
    const isParried = isUnparryable
      ? false // parry is cancelled because the skill ignores it.
      : this.checkParry(caster, target, action);

    // check if the action was parried instead.
    const targetBattler = target.getBattler();
    if (!isUnparryable && isParried)
    {
      // grab the result, clear it, and set the parry flag to true.
      const result = targetBattler.result();
      result.clear();
      result.parried = true;
    }

    // apply the action to the target.
    const gameAction = action.getAction();
    gameAction.apply(targetBattler);

    // handle any post-execution effects.
    this.postExecuteSkillEffects(action, target);
  }

  /**
   * Execute any pre-execution effects.
   * This occurs before the actual skill is applied against the target battler to get the
   * `Game_ActionResult` that is then used throughout the function.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  preExecuteSkillEffects(action, target)
  {
  }

  /**
   * Execute any post-execution effects.
   * This occurs after the actual skill is executed against the target battler.
   * @param {JABS_Action} action The action being executed.
   * @param {JABS_Battler} target The target to apply skill effects against.
   */
  postExecuteSkillEffects(action, target)
  {
    // apply aggro regardless of successful hit.
    this.applyAggroEffects(action, target);
  }

  /**
   * Applies all aggro effects against the target.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyAggroEffects(action, target)
  {
    // grab the attacker.
    const attacker = action.getCaster();

    // don't aggro your allies against you! That's dumb.
    if (attacker.isSameTeam(target.getTeam())) return;

    // grab the result on the target, from the action executed.
    const result = target.getBattler().result();

    // the default/base aggro.
    let aggro = J.ABS.Metadata.BaseAggro;

    // hp damage counts for 1.
    if (result.hpDamage > 0)
    {
      aggro += result.hpDamage * J.ABS.Metadata.AggroPerHp;
    }

    // mp damage counts for 2.
    if (result.mpDamage > 0)
    {
      aggro += result.mpDamage * J.ABS.Metadata.AggroPerMp;
    }

    // tp damage counts for 10.
    if (result.tpDamage > 0)
    {
      aggro += result.tpDamage * J.ABS.Metadata.AggroPerTp;
    }

    // if the attacker also healed from it, extra aggro for each point healed!
    if (result.drain)
    {
      aggro += result.hpDamage * J.ABS.Metadata.AggroDrain;
    }

    // if the attacker was parried, reduce aggro on this battler...
    if (result.parried)
    {
      aggro += J.ABS.Metadata.AggroParryFlatAmount;
      // ...and also increase the aggro of the attacking battler!
      attacker.addUpdateAggro(target.getUuid(), J.ABS.Metadata.AggroParryUserGain);
    }

    // apply any bonus aggro from the underlying skill.
    aggro += action.bonusAggro();

    // apply the aggro multiplier from the underlying skill.
    aggro *= action.aggroMultiplier();

    // apply any aggro amplification from states.
    attacker.getBattler().states().forEach(state =>
    {
      if (state.jabsAggroOutAmp >= 0)
      {
        aggro *= state.jabsAggroOutAmp;
      }
    });

    // apply any aggro reduction from states.
    target.getBattler().states().forEach(state =>
    {
      if (state.jabsAggroInAmp >= 0)
      {
        aggro *= state.jabsAggroInAmp;
      }
    });

    // apply the TGR multiplier from the attacker.
    aggro *= attacker.getBattler().tgr;

    // the player can attack tremendously faster than the AI can...
    // ...so reduce the aggro dealt to compensate.
    if (attacker.isPlayer())
    {
      aggro *= J.ABS.Metadata.AggroPlayerReduction;
    }

    // apply the aggro to the target.
    target.addUpdateAggro(attacker.getUuid(), aggro);
  }

  /**
   * Applies on-hit effects against the target.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyOnHitEffects(action, target)
  {
    // if the result isn't a hit or a parry, then we don't process on-hit effects.
    const result = target.getBattler().result();
    if (!result.isHit() && !result.parried) return;

    // grab some shorthand variables for local use.
    const caster = action.getCaster();
    const targetCharacter = target.getCharacter();
    const skill = action.getBaseSkill();

    // get the animation id associated with this skill.
    const targetAnimationId = this.getAnimationId(skill, caster);

    // if the skill should animate on the target, then animate as normal.
    targetCharacter.requestAnimation(targetAnimationId, result.parried);

    // if there is a self-animation id, apply that to yourself for every hit.
    if (action.hasSelfAnimationId())
    {
      action.performSelfAnimation();
    }

    // if freecombo-ing, then we already checked for combo when executing the action.
    if (!skill.jabsFreeCombo)
    {
      this.checkComboSequence(caster, action);
    }

    this.checkKnockback(action, target);
    this.triggerAlert(caster, target);

    // if the attacker and the target are the same team, then don't set that as "last hit".
    if (!(caster.isSameTeam(target.getTeam())))
    {
      caster.setBattlerLastHit(target);
    }
  }

  /**
   * Forces the target hit to be knocked back.
   * @param {JABS_Action} action The action potentially knocking the target back.
   * @param {JABS_Battler} target The map battler to potentially knockback.
   */
  checkKnockback(action, target)
  {
    // don't knockback if already being knocked back.
    const targetSprite = target.getCharacter();
    if (targetSprite.isJumping()) return;

    // get the knockback resist for this target.
    const targetReferenceData = target.getReferenceData();
    const targetMeta = targetReferenceData.meta;
    let knockbackResist = 1.00;
    if (targetMeta && targetMeta[J.ABS.Notetags.KnockbackResist])
    {
      const metaResist = parseInt(targetMeta[J.ABS.Notetags.KnockbackResist]);
      knockbackResist = (100 - metaResist) / 100;
    }

    // don't even knock them up or around at all, they are immune to knockback.
    if (knockbackResist <= 0)
    {
      return;
    }

    // get the knockback value from the skill if applicable.
    let knockback = action.getKnockback();

    // check to make sure the skill has knockback before processing.
    if (knockback === null) return;

    // multiply the knockback by the resist.
    knockback *= knockbackResist;

    // check if the knockback is 0, or the action is direct.
    if (knockback === 0 || action.isDirectAction())
    {
      // hop in place.
      targetSprite.jump(0, 0);

      // stop processing.
      return;
    }

    // calculate where the knockback would send the target.
    const actionSprite = action.getActionSprite();
    const knockbackDirection = actionSprite.direction();
    let xPlus = 0;
    let yPlus = 0;
    switch (knockbackDirection)
    {
      case J.ABS.Directions.UP:
        yPlus -= Math.ceil(knockback);
        break;
      case J.ABS.Directions.DOWN:
        yPlus += Math.ceil(knockback);
        break;
      case J.ABS.Directions.LEFT:
        xPlus -= Math.ceil(knockback);
        break;
      case J.ABS.Directions.RIGHT:
        xPlus += Math.ceil(knockback);
        break;
    }

    const maxX = targetSprite.x + xPlus;
    const maxY = targetSprite.y + yPlus;
    let realX = targetSprite.x;
    let realY = targetSprite.y;
    let canPass = true;

    // dynamically test each square to ensure you don't cross any unpassable tiles.
    while (canPass && (realX !== maxX || realY !== maxY))
    {
      switch (knockbackDirection)
      {
        case J.ABS.Directions.UP:
          realY--;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realY++;
          break;
        case J.ABS.Directions.DOWN:
          realY++;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realY--;
          break;
        case J.ABS.Directions.LEFT:
          realX--;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realX++;
          break;
        case J.ABS.Directions.RIGHT:
          realX++;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realX--;
          break;
        default:
          canPass = false;
          break;
      }
    }

    // execute the jump to the new destination.
    targetSprite.jump(realX - targetSprite.x, realY - targetSprite.y);
  }

  /**
   * Determines if there is a combo action that should succeed this skill.
   * @param {JABS_Battler} caster The battler that casted this skill.
   * @param {JABS_Action} action The action that contains the skill to check for combos.
   */
  checkComboSequence(caster, action)
  {
    // check to make sure we have combo data before processing the combo.
    if (!this.canUpdateComboSequence(caster, action)) return;

    // execute the combo action.
    this.updateComboSequence(caster, action);
  }

  /**
   * Determines whether or not the caster can update their combo data based on
   * the given action.
   * @param {JABS_Battler} caster The caster of the action.
   * @param {JABS_Action} action The action executed.
   * @returns {boolean} True if the combo action should be updated, false otherwise.
   */
  canUpdateComboSequence(caster, action)
  {
    // grab the skill out of the action.
    const skill = action.getBaseSkill();

    // if we do not have a combo, we cannot combo.
    if (!skill.jabsComboAction) return false;

    // if the battler doesn't know the combo skill, we cannot combo.
    if (!caster.getBattler().hasSkill(skill.jabsComboSkillId)) return false;

    // execute combo actions!
    return true;
  }

  /**
   * Updates the combo action data for the caster.
   * The next time the appropriate slot is executed, the combo skill will execute instead.
   * @param {JABS_Battler} caster The caster of the action.
   * @param {JABS_Action} action The action executed.
   */
  updateComboSequence(caster, action)
  {
    // extract the combo data out of the skill.
    const { jabsComboSkillId, jabsComboDelay } = action.getBaseSkill();

    // determine which slot to apply cooldowns to.
    const cooldownKey = action.getCooldownType();

    // clarifies that this check is whether or not the next combo skill is a continuation of the combo.
    const isComboAction = (caster.getComboNextActionId(cooldownKey) !== jabsComboSkillId);

    // check if this is actually a combo action to the last action.
    if (isComboAction)
    {
      // its a combo skill, so also extend the base cooldown by the combo cooldown.
      caster.modCooldownCounter(cooldownKey, jabsComboDelay);
    }

    // update the next combo data.
    caster.setComboFrames(cooldownKey, jabsComboDelay);
    caster.setComboNextActionId(cooldownKey, jabsComboSkillId);
  }

  /**
   * Resets the combo action for the given battler.
   * @param {JABS_Battler} caster The caster of the combo attack.
   */
  resetComboAction(caster)
  {
    console.log('should cancel combo action!');
  }

  /**
   * Calculates whether or not the attack was parried.
   * @param {JABS_Battler} caster The battler performing the action.
   * @param {JABS_Battler} target The target the action is against.
   * @param {JABS_Action} action The action being executed.
   * @returns {boolean}
   */
  checkParry(caster, target, action)
  {
    // cannot parry if not facing target.
    const isFacing = caster.isFacingTarget(target.getCharacter());
    if (!isFacing) return false;

    // if the target battler has 0% GRD, they can't parry.
    const targetBattler = target.getBattler();
    if (targetBattler.grd === 0) return false;

    const casterBattler = caster.getBattler();

    // if the attacker has a state that ignores all parry, then skip parrying.
    if (casterBattler.ignoreAllParry()) return false;

    /* eslint-disable */
    /*
    // WIP formula!
    // defender's stat calculation of grd, bonuses from agi/luk.
    const baseGrd = parseFloat(((targetBattler.grd - 1) * 100).toFixed(3));
    const bonusGrdFromAgi = parseFloat((targetBattler.agi * 0.1).toFixed(3));
    const bonusGrdFromLuk = parseFloat((targetBattler.luk * 0.1).toFixed(3));
    const defenderGrd = baseGrd + bonusGrdFromAgi + bonusGrdFromLuk;

    // attacker's stat calculation of hit, bonuses from agi/luk.
    const baseHit = parseFloat((casterBattler.hit * 100).toFixed(3));
    const bonusHitFromAgi = parseFloat((casterBattler.agi * 0.1).toFixed(3));
    const bonusHitFromLuk = parseFloat((casterBattler.luk * 0.1).toFixed(3));
    const attackerHit = baseHit + bonusHitFromAgi + bonusHitFromLuk;

    // determine the difference and apply the multiplier if applicable.
    let difference = attackerHit - defenderGrd;
    if (J.LEVEL && J.LEVEL.Metadata.Enabled) {
      const multiplier = LevelScaling.multiplier(targetBattler.level, casterBattler.level);
      difference *= multiplier;
    }

    // the hit is too great, there is no chance of being parried.
    if (difference > 100) {
      return false;
    // the grd is too great, there is no chance of landing a hit.
    } else if (difference < 0) {
      return true;
    }

    const rng = parseInt(Math.randomInt(100) + 1);
    console.log(`attacker: ${attackerHit}, defender: ${defenderGrd}, rng: ${rng}, diff: ${difference}, parried: ${rng > difference}`);
    return rng > difference;
    // console.log(`attacker:${casterBattler.name()} bonus:${bonusHit} + hit:${hit-bonusHit} < grd:${parryRate} ?${hit < parryRate}`);
    */
    /* eslint-enable */

    // apply the hit bonus to hit (10% of actual hit).
    const bonusHit = parseFloat((casterBattler.hit * 0.1).toFixed(3));

    // calculate the hit rate (rng + bonus hit).
    const hit = parseFloat((Math.random() + bonusHit).toFixed(3));

    // grab the amount of parry ignored.
    const parryIgnored = (action.getBaseSkill().jabsIgnoreParry ?? 0) / 100;

    // calculate the parry rate.
    const parry = parseFloat((targetBattler.grd - 1 - parryIgnored).toFixed(3));

    // return whether or not the hit was successful.
    return hit < parry;
  }

  /**
   * If the battler is hit from outside of it's engagement range,
   * trigger the alert state.
   * @param {JABS_Battler} attacker The battler triggering the alert.
   * @param {JABS_Battler} target The battler entering the alert state.
   */
  triggerAlert(attacker, target)
  {
    // check if the target can actually be alerted first.
    if (!this.canBeAlerted(attacker, target)) return;

    // alert the target!
    target.showBalloon(J.ABS.Balloons.Question);
    target.setAlertedCoordinates(attacker.getX(), attacker.getY());
    const alertDuration = target.getAlertDuration();
    target.setAlertedCounter(alertDuration);

    // a brief pause the first time entering the alerted state.
    if (!target.isAlerted())
    {
      target.setWaitCountdown(45);
    }
  }

  /**
   * Checks if the battler can even be alerted in the first place.
   * @param {JABS_Battler} attacker The battler that initiated the alert.
   * @param {JABS_Battler} battler The battler to be alerted.
   * @return {boolean} True if they can be alerted, false otherwise.
   */
  canBeAlerted(attacker, battler)
  {
    // cannot alert your own allies.
    if (attacker.isSameTeam(battler.getTeam())) return false;

    // cannot alert the player.
    if (battler.isPlayer()) return false;

    // cannot alert battlers that are already engaged.
    if (battler.isEngaged()) return false;

    // cannot alert inanimate objects.
    if (battler.isInanimate()) return false;

    return true;
  }

  /**
   * Applies all effects to the target that occur after the skill execution is complete.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  continuedPrimaryBattleEffects(action, target)
  {
    // checks for retaliation from the target.
    this.checkRetaliate(action, target);

    // apply the battle memories to the target.
    const result = target.getBattler().result();
    this.applyBattleMemories(result, action, target);
  }

  /**
   * Executes a retalation if necessary on receiving a hit.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} targetBattler The target having the action applied against.
   */
  checkRetaliate(action, targetBattler)
  {
    // do not retaliate against other battler's retaliations.
    if (action.isRetaliation()) return;

    // do not retaliate against being targeted by battlers of the same team.
    if (action.getCaster().isSameTeam(targetBattler.getTeam()))
    {
      return;
    }

    if (targetBattler.isActor())
    {
      // handle player retaliations.
      this.handleActorRetaliation(targetBattler);
    }
    else
    {
      // handle non-player retaliations.
      this.handleEnemyRetaliation(targetBattler);
    }
  }

  /**
   * Executes any retaliation the player may have when receiving a hit.
   * @param {JABS_Battler} battler The battler doing the retaliating.
   */
  handleActorRetaliation(battler)
  {
    // grab the action result.
    const actionResult = battler.getBattler().result();

    // check if we need to perform any sort of countering.
    const needsCounterParry = actionResult.parried && battler.counterParry().length;

    // NOTE: you cannot perform both a counterguard AND a counterparry- counterparry takes priority!
    const needsCounterGuard = !needsCounterParry && battler.guarding() && battler.counterGuard().length;

    // if we should be counter-parrying.
    if (needsCounterParry)
    {
      // execute the counterparry.
      this.doCounterParry(battler, JABS_Button.Offhand);
    }

    // if we should be counter-guarding.
    if (needsCounterGuard)
    {
      // execute the counterguard.
      this.doCounterGuard(battler, JABS_Button.Offhand);
    }

    // if auto-counter is available, then just do that.
    if (actionResult.parried)
    {
      this.handleAutoCounter(battler);
    }

    // grab all the retaliation skills for this battler.
    const retaliationSkills = battler.getBattler().retaliationSkills();

    // if there are any passive retaliation skills to perform...
    if (retaliationSkills.length)
    {
      // ...perform them!
      retaliationSkills.forEach(skillChance =>
      {
        if (skillChance.shouldTrigger())
        {
          this.forceMapAction(battler, skillChance.skillId, true);
        }
      })
    }
  }

  /**
   * If the counter rate is sufficient, then automatically perform your counterskills on any
   * incoming passive parry!
   * @param {JABS_Battler} battler The battler performing the counter.
   */
  handleAutoCounter(battler)
  {
    // stop processing if we cannot autocounter.
    if (!this.canAutoCounter(battler)) return;

    // check if RNG favors you.
    const shouldAutoCounter = battler.getBattler().cnt > Math.random();

    // if RNG did actually favor you, then proceed.
    if (shouldAutoCounter)
    {
      // perform the autocounter.
      this.doAutoCounter(battler, JABS_Button.Offhand);
    }
  }

  /**
   * Commands the {@link JABS_Battler} to perform an autocounter.
   * This will attempt to execute all counterguard/counterparry skill ids available
   * in the given slot.
   * @param {JABS_Battler} battler The battler doing the autocounter.
   * @param {string=} slot The skill slot key; defaults to {@link JABS_Button.Offhand}.
   */
  doAutoCounter(battler, slot = JABS_Button.Offhand)
  {
    // execute counterparrying.
    this.doCounterParry(battler, slot);

    // execute counterguarding.
    this.doCounterGuard(battler, slot);
  }

  /**
   * Executes any counterguard skills available to the given battler.
   * @param {JABS_Battler} battler The battler to perform the skills.
   * @param {string=} slot The skill slot key; defaults to {@link JABS_Button.Offhand}.
   */
  doCounterGuard(battler, slot = JABS_Button.Offhand)
  {
    // destructure out the guard and parry ids.
    const { counterGuardIds } = battler.getGuardData(slot);

    // check if we even have any skills to counterguard with.
    if (counterGuardIds.length)
    {
      // iterate over each of them and auto-counterguard!
      counterGuardIds.forEach(id => this.forceMapAction(battler, id, true));
    }
  }

  /**
   * Executes any counterparry skills available to the given battler.
   * @param {JABS_Battler} battler The battler to perform the skills.
   * @param {string=} slot The skill slot key; defaults to {@link JABS_Button.Offhand}.
   */
  doCounterParry(battler, slot = JABS_Button.Offhand)
  {
    // destructure out the parry ids.
    const { counterParryIds } = battler.getGuardData(slot);

    // check if we even have any skills to counterparry with.
    if (counterParryIds.length)
    {
      // iterate over each of them and auto-counterparry!
      counterParryIds.forEach(id => this.forceMapAction(battler, id, true));
    }
  }

  /**
   * Determines whether or not the battler can perform any sort of autocountering.
   * @param {JABS_Battler} battler The battler to potentially autocounter.
   * @returns {boolean} True if we should try to autocounter, false otherwise.
   */
  canAutoCounter(battler)
  {
    // shorthand the guard data from your offhand.
    const guardData = battler.getGuardData(JABS_Button.Offhand);

    // if we have no guard data, don't try to autocounter.
    if (!guardData) return false;

    // if we are unable to perform a counter, don't try to autocounter.
    if (!guardData.canCounter()) return false;

    // we should try to autocounter.
    return true;
  }

  /**
   * Executes any retaliation the enemy may have when receiving a hit at any time.
   * @param {JABS_Battler} enemy The enemy's `JABS_Battler`.
   */
  handleEnemyRetaliation(enemy)
  {
    // assumes enemy battler is enemy.
    const retaliationSkills = enemy.getBattler().retaliationSkills();

    // if there are any passive retaliation skills to perform...
    if (retaliationSkills.length)
    {
      // ...perform them!
      retaliationSkills.forEach(skillChance =>
      {
        if (skillChance.shouldTrigger())
        {
          this.forceMapAction(enemy, skillChance.skillId, true);
        }
      })
    }
  }

  /**
   * Applies a battle memory to the target.
   * Only applicable to actors (for now).
   * @param {Game_ActionResult} result The effective result of the action against the target.
   * @param {JABS_Action} action The action executed against the target.
   * @param {JABS_Battler} target The target the action was applied to.
   */
  applyBattleMemories(result, action, target)
  {
    // only applicable to allies.
    if (target.isEnemy()) return;

    // only works if the code is there to process.
    if (!J.ALLYAI) return;

    const newMemory = new JABS_BattleMemory(
      target.getBattlerId(),
      action.getBaseSkill().id,
      action.getAction()
        .calculateRawElementRate(target.getBattler()),
      result.hpDamage);
    target.applyBattleMemories(newMemory);
  }

  /**
   * Executes a retalation if necessary on receiving a hit.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  postPrimaryBattleEffects(action, target)
  {
    // generate log for this action.
    this.createAttackLog(action, target);

    // generate the text popup for this action.
    this.generatePopAttack(action, target);

    // generate the text popup for the skill usage on the caster.
    this.generatePopSkillUsage(action, target);
  }

  /**
   * Generates a popup based on the action executed and its result.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  generatePopAttack(action, target)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // gather shorthand variables for use.
    const skill = action.getBaseSkill();
    const caster = action.getCaster();
    const character = target.getCharacter();

    // generate the textpop.
    const damagePop = this.configureDamagePop(action.getAction(), skill, caster, target);

    // add the pop to the target's tracking.
    character.addTextPop(damagePop);
    character.setRequestTextPop();
  }

  /**
   * Generates a popup on the caster based on the skill used.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  generatePopSkillUsage(action, target)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // inanimate objects do not have skill usage pops.
    if (action.getCaster().isInanimate()) return;

    // gather shorthand variables for use.
    const skill = action.getBaseSkill();
    const character = action.getCaster().getCharacter();

    // generate the textpop.
    const skillUsagePop = this.configureSkillUsedPop(skill);

    // add the pop to the caster's tracking.
    character.addTextPop(skillUsagePop);
    character.setRequestTextPop();
  }

  /**
   * Generates a log in the `Map_TextLog` if applicable.
   * It is important to note that only HP damage is published to the log.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The `JABS_Battler` who was the target of the action.
   */
  createAttackLog(action, target)
  {
    // if not enabled, skip this.
    if (!J.LOG) return;

    // gather shorthand variables for use.
    const result = target.getBattler().result();
    const caster = action.getCaster();
    const skill = action.getBaseSkill();

    const casterName = caster.getReferenceData().name;
    const targetName = target.getReferenceData().name;

    // create parry logs if it was parried.
    if (result.parried)
    {
      const parryLog = new MapLogBuilder()
        .setupParry(targetName, casterName, skill.id, result.parried)
        .build();
      $gameTextLog.addLog(parryLog);
      return;
    }
    // create evasion logs if it was evaded.
    else if (result.evaded)
    {
      const dodgeLog = new MapLogBuilder()
        .setupDodge(targetName, casterName, skill.id)
        .build();
      $gameTextLog.addLog(dodgeLog);
      return;
    }
    // create retaliation logs if it was a retaliation.
    else if (action.isRetaliation())
    {
      const retaliationLog = new MapLogBuilder()
        .setupRetaliation(casterName)
        .build();
      $gameTextLog.addLog(retaliationLog);
    }
    // if no damage of any kind was dealt, and no states were applied, then you get a special message!
    else if (!result.hpDamage && !result.mpDamage && !result.tpDamage && !result.addedStates.length)
    {
      const log = new MapLogBuilder()
        .setupUndamaged(targetName, casterName, skill.id)
        .build();
      $gameTextLog.addLog(log);
      return;
    }
    if (result.hpDamage)
    {
      // otherwise, it must be a regular damage type log.
      // get the base damage dealt and clean that up.
      let roundedDamage = Math.round(result.hpDamage);
      const isNotHeal = roundedDamage > 0;
      roundedDamage = roundedDamage >= 0 ? roundedDamage : roundedDamage.toString().replace("-", "");
      const damageReduction = Math.round(result.reduced);
      let reducedAmount = "";
      if (damageReduction)
      {
        reducedAmount = `(${parseInt(damageReduction)})`;
      }

      const log = new MapLogBuilder()
        .setupExecution(targetName, casterName, skill.id, roundedDamage, reducedAmount, !isNotHeal, result.critical)
        .build();
      $gameTextLog.addLog(log);
      // fall through in case there were states that were also applied, such as defeating the target.
    }

    // also publish any logs regarding application of states against the target.
    if (result.addedStates.length)
    {
      result.addedStates.forEach(stateId =>
      {
        // show a custom line when an enemy is defeated.
        if (stateId === target.getBattler().deathStateId())
        {
          const log = new MapLogBuilder()
            .setupTargetDefeated(targetName)
            .build();
          $gameTextLog.addLog(log);
          return;
        }

        // show all the rest of the non-death states.
        const log = new MapLogBuilder()
          .setupStateAfflicted(targetName, stateId)
          .build();
        $gameTextLog.addLog(log);
      });
    }
  }

  /**
   * Configures this skill used popup based on the skill itself.
   * @param {RPG_Skill} skill The skill that was used.
   * @returns {Map_TextPop}
   */
  configureSkillUsedPop(skill)
  {
    return new TextPopBuilder(skill.name)
      .isSkillUsed(skill.iconIndex)
      .build();
  }

  /**
   * Configures this damage popup based on the action result against the target.
   * @param {Game_Action} gameAction The action this popup is based on.
   * @param {RPG_Skill} skill The skill reference data itself.
   * @param {JABS_Battler} caster The battler who casted this skill.
   * @param {JABS_Battler} target The target battler the popup is placed on.
   */
  configureDamagePop(gameAction, skill, caster, target)
  {
    // get the underlying battler associated with the popup.
    const targetBattler = target.getBattler();

    // get the underlying actionresult from the skill execution.
    const actionResult = targetBattler.result();

    // initialize this to false.
    let targetElementallyImmune = false;

    // determine the elemental factor.
    let elementalRate;

    // check if using the J-Elementalistics plugin.
    if (J.ELEM)
    {
      // leverage the new elemental algorithm for elemental rates.
      elementalRate = gameAction.calculateRawElementRate(targetBattler);

      // check to ensure we have any amount of applicable elements.
      targetElementallyImmune = (gameAction.getApplicableElements(targetBattler)).length === 0;
    }
    else
    {
      // leverage the default method for obtaining elemental rate.
      elementalRate = gameAction.calcElementRate(targetBattler);
    }

    // translate the skill into it's relevant iconIndex, or 0 if not applicable.
    const elementalIcon = this.determineElementalIcon(skill, caster);

    // if the skill execution was parried, then use that icon instead.
    const iconIndex = actionResult.parried
      ? 128
      : elementalIcon;

    // instantiate the builder for piece-mealing the popup together.
    const textPopBuilder = new TextPopBuilder(0);

    switch (true)
    {
      // if you were parried, sorry about your luck.
      case actionResult.parried:
        textPopBuilder.setValue(`PARRY!`);
        break;
      // if you were evaded, how unfortunate.
      case actionResult.evaded:
        textPopBuilder.setValue(`DODGE`);
        break;
      // if the result is hp damage, treat it as such.
      case actionResult.hpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.hpDamage)
          .isHpDamage();
        break;
      // if the result is mp damage, treat it as such.
      case actionResult.mpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.mpDamage)
          .isHpDamage();
        break;
      // if the result is tp damage, treat it as such.
      case actionResult.tpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.tpDamage)
          .isHpDamage();
        break;
      // if for some reason its something else, they are probably immune.
      default:
        textPopBuilder
          .setValue(actionResult.hpDamage)
          .isHpDamage();
        globalThis.failedTextPopActionResult = actionResult;
        console.warn(`unknown damage output- review Game_ActionResult:`, actionResult, targetBattler);
        break;
    }

    // if we somehow used this without a proper damage type, then just build a default.
    return textPopBuilder
      .setIconIndex(iconIndex)
      .isElemental(elementalRate)
      .setCritical(actionResult.critical)
      .build();
  }

  /**
   * Translates a skill's elemental affiliation into the icon id representing it.
   * @param {RPG_Skill} skill The skill reference data itself.
   * @param {JABS_Battler} caster The battler performing the action.
   * @returns {number} The icon index to use for this popup.
   */
  determineElementalIcon(skill, caster)
  {
    // if not using the elemental icons, don't return one.
    if (!J.ABS.Metadata.UseElementalIcons) return 0;

    let {elementId} = skill.damage;

    // if the battler is an actor and the action is based on the weapon's elements
    // probe the weapon's traits for its actual element.
    if (elementId === -1 && caster.isActor())
    {
      const attackElements = caster.getBattler().attackElements();
      if (attackElements.length)
      {
        // we pick only the first element!
        [elementId,] = attackElements;
      }
      else
      {
        elementId = 0;
      }
    }

    // if its an item, then use the item's icon index.
    if (DataManager.isItem(skill))
    {
      return $dataItems[skill.id].iconIndex;
    }

    const iconData = J.ABS.Metadata.ElementalIcons;
    const elementalIcon = iconData.find(data => data.element === elementId);
    return elementalIcon ? elementalIcon.icon : 0;
  }
  //#endregion action execution

  //#region collision
  /**
   * Checks this `JABS_Action` against all map battlers to determine collision.
   * If there is a collision, then a `Game_Action` is applied.
   * @param {JABS_Action} action The `JABS_Action` to check against all battlers.
   * @returns {JABS_Battler[]} A collection of `JABS_Battler`s that this action hit.
   */
  getCollisionTargets(action)
  {
    if (action.getAction()
      .isForUser())
    {
      return [action.getCaster()];
    }

    const actionSprite = action.getActionSprite();
    const range = action.getRange();
    const shape = action.getShape();
    const casterJabsBattler = action.getCaster();
    const caster = casterJabsBattler.getCharacter();

    /**  @type {JABS_Battler[]} */
    const battlers = $gameMap.getAllBattlersDistanceSortedFromPlayer(casterJabsBattler);
    let hitOne = false;
    const targetsHit = [];

    const allyTarget = casterJabsBattler.getAllyTarget();
    if (allyTarget && action.getAction().isForOne())
    {
      if (allyTarget.canActionConnect() && allyTarget.isWithinScope(action, allyTarget, hitOne))
      {
        targetsHit.push(allyTarget);
        return targetsHit;
      }
    }

    battlers.filter(battler =>
    {
    // this battler is untargetable.
      if (!battler.canActionConnect()) return false;

      // the action's scopes don't meet the criteria for this target.
      // excludes the "single"-hitonce check.
      if (!battler.isWithinScope(action, battler)) return false;

      // if the attacker is an enemy, do not consider inanimate targets.
      if (casterJabsBattler.isEnemy() && battler.isInanimate()) return false;

      // this battler is potentially hit-able.
      return true;
    })
    .forEach(battler =>
    {
      // this time, it is effectively checking for the single-scope.
      if (!battler.isWithinScope(action, battler, hitOne)) return;

      // if the action is a direct-targeting action,
      // then only check distance between the caster and target.
      if (action.isDirectAction())
      {
        if (action.getAction().isForUser())
        {
          targetsHit.push(battler);
          hitOne = true;
          return;
        }
        const maxDistance = action.getProximity();
        const distance = casterJabsBattler.distanceToDesignatedTarget(battler);
        if (distance <= maxDistance)
        {
          targetsHit.push(battler);
          hitOne = true;
        }

      // if the action is a standard projectile-based action,
      // then check to see if this battler is now in range.
      }
      else
      {
        const sprite = battler.getCharacter();
        const actionDirection = actionSprite.direction();
        const result = this.isTargetWithinRange(actionDirection, sprite, actionSprite, range, shape);
        if (result)
        {
          targetsHit.push(battler);
          hitOne = true;
        }
      }
    });

    return targetsHit;
  }

  /**
   * Determines collision of a given shape vs coordinates.
   * @param {number} facing The direction the caster is facing.
   * @param {Game_Event|Game_Player|Game_Character} targetCharacter The target being hit.
   * @param {Game_Event} actionEvent The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {string} shape The collision formula based on shape.
   */
  isTargetWithinRange(facing, targetCharacter, actionEvent, range, shape)
  {
    switch (shape)
    {
      // shapes that do not care about direction.
      case J.ABS.Shapes.Circle:
        return this.collisionCircle(targetCharacter, actionEvent, range);
      case J.ABS.Shapes.Rhombus:
        return this.collisionRhombus(targetCharacter, actionEvent, range);
      case J.ABS.Shapes.Square:
        return this.collisionSquare(targetCharacter, actionEvent, range);
      case J.ABS.Shapes.Cross:
        return this.collisionCross(targetCharacter, actionEvent, range);

      // shapes that require action direction.
      case J.ABS.Shapes.FrontSquare:
        return this.collisionFrontSquare(targetCharacter, actionEvent, range, facing);
      case J.ABS.Shapes.Line:
        return this.collisionLine(targetCharacter, actionEvent, range, facing);
      case J.ABS.Shapes.Arc:
        return this.collisionFrontRhombus(targetCharacter, actionEvent, range, facing);
      case J.ABS.Shapes.Wall:
        return this.collisionWall(targetCharacter, actionEvent, range, facing);
      default:
        return false;
    }
  }

  /**
   * A cirlce-shaped collision.
   * Range determines the radius of the circle.
   * This has no specific type of use- it is a circle.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @returns {boolean}
   */
  collisionCircle(target, action, range)
  {
    // calculate the distance between the target and action.
    const distance = $gameMap.distance(target.x, target.y, action.x, action.y);
    
    // determine whether or not the target is within range of being hit.
    const inRange = distance <= range;

    // return the result.
    return inRange;
  }

  /**
   * A rhombus-shaped (aka diamond) collision.
   * Range determines the size of the rhombus surrounding the action.
   * This is typically used for AOE around the caster type skills, but could also
   * be used for very large objects, or as an explosion radius.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @returns {boolean}
   */
  collisionRhombus(target, action, range)
  {
    // calculate the absolute x and y distances.
    const dx = Math.abs($gameMap.deltaX(target.x, action.x));
    const dy = Math.abs($gameMap.deltaY(target.y, action.y));

    // the maximum distance the rhombus reaches is the combined x and y distances.
    const distance = dx + dy;

    // determine whether or not the target is within range of being hit.
    const inRange = distance <= range;

    // return the result.
    return inRange;
  }

  /**
   * A square-shaped collision.
   * Range determines the size of the square around the action.
   * The use cases for this are similar to that of rhombus, but instead of a diamond-shaped
   * hitbox, its a plain ol' square.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @returns {boolean}
   */
  collisionSquare(target, action, range)
  {
    // calculate the absolute x and y distances.
    const dx = Math.abs($gameMap.deltaX(target.x, action.x));
    const dy = Math.abs($gameMap.deltaY(target.y, action.y));

    // determine if we're in horizontal range.
    const inHorzRange = dx <= range;

    // determine if we're in vertical range.
    const inVertRange = dy <= range;

    // determine whether or not the target is within range of being hit.
    const inRange = inHorzRange && inVertRange;

    // return the result.
    return inRange;
  }

  /**
   * A square-shaped collision infront of the caster.
   * Range determines the size of the square infront of the action.
   * For when you want a square that doesn't affect targets behind the action. It would be
   * more accurate to call this a "half-square", really.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   * @returns {boolean}
   */
  collisionFrontSquare(target, action, range, facing)
  {
    // determine whether or not the target is within range of being hit.
    const inSquareRange = this.collisionSquare(target, action, range);

    // if they don't even collide in the full square, they won't collide in the frontsquare.
    if (!inSquareRange) return false;

    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // default to being infront, we always are!
    let inFront = true;

    // switch on caster's direction.
    // NOTE: this switch also ensures the action doesn't connect with targets behind it.
    switch (facing)
    {
      // infront when facing down means there should be positive Y distance.
      case J.ABS.Directions.DOWN:
        inFront = dy >= 0;
        break;
      // infront when facing left means there should be negative X distance.
      case J.ABS.Directions.LEFT:
        inFront = dx <= 0;
        break;
      // infront when facing right means there should be positive X distance.
      case J.ABS.Directions.RIGHT:
        inFront = dx >= 0;
        break;
      // infront when facing up means there should be negative Y distance.
      case J.ABS.Directions.UP:
        inFront = dy <= 0;
        break;
    }

    // determine whether or not the target is within range of being hit.
    const inRange = inSquareRange && inFront;

    // return the result.
    return inRange;
  }

  /**
   * A line-shaped collision.
   * Range the distance of the of the line.
   * This is typically used for spears and other stabby attacks.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   * @returns {boolean}
   */
  collisionLine(target, action, range, facing)
  {
    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // default to not hitting.
    let inRange = false;

    // some wiggle room rather than being precisely 0 distance for lines.
    // TODO: accommodate a new <size:#> tag for defining width of the line.
    const upDownBuffer = (dx <= 0.5) && (dx >= -0.5);
    const leftRightBuffer = (dy <= 0.5) && (dy >= -0.5);

    // switch on caster's direction.
    switch (facing)
    {
      case J.ABS.Directions.DOWN:
        inRange = upDownBuffer && (dy >= 0) && (dy <= range);
        break;
      case J.ABS.Directions.LEFT:
        inRange = leftRightBuffer && (dx <= 0) && (dx >= -range);
        break;
      case J.ABS.Directions.RIGHT:
        inRange = leftRightBuffer && (dx >= 0) && (dx <= range);
        break;
      case J.ABS.Directions.UP:
        inRange = upDownBuffer && (dy <= 0) && (dy >= -range);
        break;
    }

    // return the result.
    return inRange;
  }

  /**
   * An arc-shaped collision.
   * Range determines the reach and area of arc.
   * This is what could be considered a standard 180 degree slash-shape, the basic attack.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   * @returns {boolean}
   */
  collisionFrontRhombus(target, action, range, facing)
  {
    // determine whether or not the target is within range of being hit.
    const inRhombusRange = this.collisionRhombus(target, action, range);

    // if they don't even collide in the full rhombus, they won't collide in the frontrhombus.
    if (!inRhombusRange) return false;

    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // default to being infront, we always are!
    let inFront = true;

    // switch on caster's direction.
    // NOTE: this switch also ensures the action doesn't connect with targets behind it.
    switch (facing)
    {
      // infront when facing down means there should be positive Y distance.
      case J.ABS.Directions.DOWN:
        inFront = dy >= 0;
        break;
      // infront when facing left means there should be negative X distance.
      case J.ABS.Directions.LEFT:
        inFront = dx <= 0;
        break;
      // infront when facing right means there should be positive X distance.
      case J.ABS.Directions.RIGHT:
        inFront = dx >= 0;
        break;
      // infront when facing up means there should be negative Y distance.
      case J.ABS.Directions.UP:
        inFront = dy <= 0;
        break;
    }

    // determine whether or not the target is within range of being hit.
    const inRange = inRhombusRange && inFront;

    // return the result.
    return inRange;
  }

  /**
   * A wall-shaped collision.
   * Range determines how wide the wall is.
   * Typically used for hitting targets to the side of the caster.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   * @returns {boolean}
   */
  collisionWall(target, action, range, facing)
  {
    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // some wiggle room rather than being precisely 0 distance for lines.
    // TODO: accommodate a new <size:#> tag for defining width of the wall.
    const leftRightBuffer = (dx <= 0.5) && (dx >= -0.5);
    const upDownBuffer = (dy <= 0.5) && (dy >= -0.5);

    // default to not hitting.
    let inRange = false;

    switch (facing)
    {
      // when facing up or down, the Y distance should be minimal.
      case J.ABS.Directions.DOWN:
      case J.ABS.Directions.UP:
        inRange = (Math.abs(dx) <= range) && upDownBuffer;
        break;
      // when facing left or right, the X distance should be minimal.
      case J.ABS.Directions.RIGHT:
      case J.ABS.Directions.LEFT:
        inRange = (Math.abs(dy) <= range) && leftRightBuffer;
        break;
    }

    // return the result.
    return inRange;
  }

  /**
   * A cross shaped collision.
   * Range determines how far the cross reaches from the action.
   * Think bomb explosions from the game bomberman.
   * @param {Game_Event|Game_Player|Game_Character} target The target being hit.
   * @param {Game_Event} action The action sprite against the target.
   * @param {number} range How big the collision shape is.
   * @returns {boolean}
   */
  collisionCross(target, action, range)
  {
    // calculate the non-absolute x and y distances.
    const dx = $gameMap.deltaX(target.x, action.x);
    const dy = $gameMap.deltaY(target.y, action.y);

    // some wiggle room rather than being precisely 0 distance for lines.
    // TODO: accommodate a new <size:#> tag for defining width of the wall.
    const leftRightBuffer = (dx <= 0.5) && (dx >= -0.5);
    const upDownBuffer = (dy <= 0.5) && (dy >= -0.5);

    // determine if we are in vertical range.
    const inVertRange = Math.abs(dy) <= range && leftRightBuffer;

    // determine if we are in horizontal range.
    const inHorzRange = Math.abs(dx) <= range && upDownBuffer;

    // determine whether or not the target is within range of being hit.
    const inRange = inVertRange && inHorzRange;

    // return the result.
    return inRange;
  }
  //#endregion collision
  //#endregion functional

  //#region defeated target aftermath
  /**
   * Handles the defeat of a given `Game_Battler` on the map.
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  handleDefeatedTarget(target, caster)
  {
    this.predefeatHandler(target, caster);
    switch (true)
    {
      case (target.isPlayer()):
        this.handleDefeatedPlayer();
        break;
      case (target.isActor() && !target.isPlayer() && !target.isDying()):
        this.handleDefeatedAlly(target);
        break;
      case (target.isEnemy()):
        this.handleDefeatedEnemy(target, caster);
        break;
      default:
        break;
    }

    this.postDefeatHandler(target, caster);
  }

  /**
   * Handles the effects that occur before a target's defeat is processed,
   * such as "executes skill on death".
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  predefeatHandler(target, caster)
  {
    target.performPredefeatEffects(caster);
  }

  /**
   * Handles the effects that occur after a target's defeat is processed.
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  postDefeatHandler(target, caster)
  {
    target.performPostdefeatEffects(caster);
  }

  /**
   * Handles the defeat of the battler the player is currently controlling.
   */
  handleDefeatedPlayer()
  {
    this.performPartyCycling();
  }

  /**
   * Handles a non-player ally that was defeated.
   * @param {JABS_Battler} defeatedAlly The ally that was defeated.
   */
  handleDefeatedAlly(defeatedAlly)
  {
  }

  /**
   * Handles an enemy that was defeated, including dolling out exp/gold and loot drops.
   * @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
   * @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
   */
  handleDefeatedEnemy(defeatedTarget, caster)
  {
    // remove all leader/follower data the battler may have.
    defeatedTarget.clearFollowers();
    defeatedTarget.clearLeader();

    // perform the death cry if they are dunzo.
    const targetCharacter = defeatedTarget.getCharacter();
    if (!defeatedTarget.isInanimate())
    {
      SoundManager.playEnemyCollapse();
    }

    // if the defeated target is an enemy, check for death controls.
    if (defeatedTarget.hasEventActions())
    {
      targetCharacter.start();
    }

    // if the caster is player/actor, gain aftermath.
    if (caster && caster.isActor())
    {
      const targetBattler = defeatedTarget.getBattler();
      this.gainBasicRewards(targetBattler, caster);
      this.createLootDrops(defeatedTarget, caster);
    }

    // remove the target's character from the map.
    defeatedTarget.setDying(true);
  }

  /**
   * Grants experience/gold/loot rewards to the battler that defeated the target.
   * If the level scaling plugin is available, both experience and gold are scaled.
   * @param {Game_Enemy} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  gainBasicRewards(enemy, actor)
  {
    let experience = enemy.exp();
    let gold = enemy.gold();
    const actorCharacter = actor.getCharacter();

    const levelMultiplier = this.getRewardScalingMultiplier(enemy, actor);
    experience = Math.ceil(experience * levelMultiplier);
    gold = Math.ceil(gold * levelMultiplier);

    this.gainExperienceReward(experience, actorCharacter);
    this.gainGoldReward(gold, actorCharacter);
    this.createRewardsLog(experience, gold, actor);
  }

  /**
   * Gets the multiplier based on difference in level between attacker and
   * target to determine if the battle was "too easy" or "very hard", resulting
   * in reduced or increased numeric rewards (excludes loot drops).
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  getRewardScalingMultiplier(enemy, actor)
  {
    // default the multiplier to 1x.
    let multiplier = 1.0;

    // check if we are using the level scaling functionality.
    if (J.LEVEL && J.LEVEL.Metadata.Enabled)
    {
      // calculate the multiplier using scaling based on enemy and actor.
      // if the enemy is higher, then the rewards will be greater.
      // if the actor is higher, then the rewards will be lesser.
      multiplier = LevelScaling.multiplier(enemy.level, actor.getBattler().level);
    }

    // return the findings.
    return multiplier;
  }

  /**
   * Gains experience from battle rewards.
   * @param {number} experience The experience to be gained as a reward.
   * @param {Game_Character} casterCharacter The character who defeated the target.
   */
  gainExperienceReward(experience, casterCharacter)
  {
    // don't do anything if the enemy didn't grant any experience.
    if (!experience) return;

    const activeParty = $gameParty.battleMembers();
    activeParty.forEach(member =>
    {
      const gainedExperience = experience * member.exr;
      member.gainExp(gainedExperience);
    });

    // generate the text popup for the experience earned.
    this.generatePopExperience(experience, casterCharacter);
  }

  /**
   * Generates a popup for experience earned.
   * @param {number} amount The amount in the popup.
   * @param {Game_Character} character The character the popup is on.
   */
  generatePopExperience(amount, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const expPop = this.configureExperiencePop(amount);

    // add the pop to the target's tracking.
    character.addTextPop(expPop);
    character.setRequestTextPop();
  }

  /**
   * Creates the text pop of the experienced gained.
   * @param {number} exp The amount of experience gained.
   * @returns {Map_TextPop}
   */
  configureExperiencePop(exp)
  {
    // round the experience we've acquired if it is a decimal.
    const experienceGained = Math.round(exp);

    // build the popup.
    return new TextPopBuilder(experienceGained)
      .isExperience()
      .build();
  }

  /**
   * Gains gold from battle rewards.
   * @param {number} gold The gold to be gained as a reward.
   * @param {Game_Character} character The character who defeated the target.
   */
  gainGoldReward(gold, character)
  {
    // don't do anything if the enemy didn't grant any gold.
    if (!gold) return;

    // actually gain the gold.
    $gameParty.gainGold(gold);

    // generate the text popup for the gold found.
    this.generatePopGold(gold, character);
  }

  /**
   * Generates a popup for gold found.
   * @param {number} amount The amount in the popup.
   * @param {Game_Character} character The character the popup is on.
   */
  generatePopGold(amount, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const goldPop = this.configureGoldPop(amount);

    // add the pop to the target's tracking.
    character.addTextPop(goldPop);
    character.setRequestTextPop();
  }

  /**
   * Creates the text pop of the gold gained.
   * @param {number} gold The amount of gold gained.
   */
  configureGoldPop(gold)
  {
    // round the gold we've acquired if it is a decimal.
    const goldGained = Math.round(gold);

    // build the popup.
    return new TextPopBuilder(goldGained)
      .isGold()
      .build();
  }

  /**
   * Create a log entry for both experience earned and gold dropped.
   * @param {number} experience The amount of experience gained.
   * @param {number} gold The gold to be gained as a reward.
   * @param {JABS_Battler} caster The ally gaining the experience and gold.
   */
  createRewardsLog(experience, gold, caster)
  {
    if (!J.LOG) return;

    if (experience !== 0)
    {
      const expLog = new MapLogBuilder()
        .setupExperienceGained(caster.getReferenceData().name, experience)
        .build();
      $gameTextLog.addLog(expLog);
    }

    if (gold !== 0)
    {
      const goldLog = new MapLogBuilder()
        .setupGoldFound(gold)
        .build();
      $gameTextLog.addLog(goldLog);
    }
  }

  /**
   * Create all drops for a defeated enemy and gain them.
   * @param {JABS_Battler} target The enemy dropping the loot.
   * @param {JABS_Battler} caster The ally that defeated the enemy.
   */
  createLootDrops(target, caster)
  {
    // actors don't drop loot.
    if (target.isActor()) return;

    // if we have no drops, don't bother.
    const items = target.getBattler().makeDropItems();
    if (items.length === 0) return;

    items.forEach(item => this.addLootDropToMap(target.getX(), target.getY(), item));
  }

  /**
   * Creates a log for an item earned as a loot drop from an enemy.
   * @param {object} item The reference data for the item loot that was picked up.
   */
  createLootLog(item)
  {
    if (!J.LOG) return;

    let lootType = String.empty;
    if (item.atypeId)
    {
      lootType = "armor";
    }
    else if (item.wtypeId)
    {
      lootType = "weapon";
    }
    else if (item.itypeId)
    {
      lootType = "item";
    }

    // the player is always going to be the one collecting the loot- for now.
    const lootLog = new MapLogBuilder()
      .setupLootObtained(this.getPlayer1().getReferenceData().name, lootType, item.id)
      .build();
    $gameTextLog.addLog(lootLog);
  }

  /**
   * Generates popups for a pile of items picked up at the same time.
   * @param {RPG_BaseItem[]} itemDataList All items picked up.
   * @param {Game_Character} character The character displaying the popups.
   */
  generatePopItemBulk(itemDataList, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // iterate over all loot.
    itemDataList.forEach((itemData, index) =>
    {
      // generate a pop that moves based on index.
      this.generatePopItem(itemData, character, 64+(index*24));
    }, this);

    // flag the character for processing pops.
    character.setRequestTextPop();
  }

  /**
   * Generates a popup for an acquired item.
   *
   * NOTE:
   * This is used from within the `generatePopItemBulk()`!
   * Use that instead of this!
   * @param {RPG_BaseItem} itemData The item's database object.
   * @param {Game_Character} character The character displaying the popup.
   * @param {number} y The y coordiante for this item pop.
   */
  generatePopItem(itemData, character, y)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const lootPop = this.configureItemPop(itemData, y);

    // add the pop to the target's tracking.
    character.addTextPop(lootPop);
  }

  /**
   * Creates the text pop of the acquired item.
   * @param {RPG_BaseItem} itemData The item's database object.
   * @param {number} y The y coordiante for this item pop.
   */
  configureItemPop(itemData, y)
  {
    // build the popup.
    return new TextPopBuilder(itemData.name)
      .isLoot(y)
      .setIconIndex(itemData.iconIndex)
      .build();
  }

  /**
   * Handles a level up for the leader while on the map.
   * @param {string} uuid The uuid of the battler leveling up.
   */
  battlerLevelup(uuid)
  {
    const battler = $gameMap.getBattlerByUuid(uuid);
    if (battler)
    {
      const character = battler.getCharacter();
      this.playLevelUpAnimation(character);
      this.generatePopLevelUp(character);
      this.createLevelUpLog(battler);
    }
  }

  /**
   * Creates a text pop of the level up.
   * @param {Game_Character} character The character to show the popup on.
   */
  generatePopLevelUp(character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const levelUpPop = this.configureLevelUpPop();

    // add the pop to the target's tracking.
    character.addTextPop(levelUpPop);
    character.setRequestTextPop();
  }

  /**
   * Configures the level up text pop.
   * @returns {Map_TextPop}
   */
  configureLevelUpPop()
  {
    // build the popup.
    return new TextPopBuilder(`LEVEL UP`)
      .isLevelUp()
      .build();
  }

  /**
   * Creates a level up log for the given battler.
   * @param {JABS_Battler} jabsBattler The given JABS battler.
   */
  createLevelUpLog(jabsBattler)
  {
    if (!J.LOG) return;

    const battler = jabsBattler.getBattler();
    const log = this.configureLevelUpLog(battler.name(), battler.level);
    $gameTextLog.addLog(log);
  }

  /**
   * Configures the log for the actor reaching a new level.
   * @param {string} targetName The name of the battler leveling up.
   * @param {number} newLevel The level being reached.
   * @returns {Map_Log}
   */
  configureLevelUpLog(targetName, newLevel)
  {
    return new MapLogBuilder()
      .setupLevelUp(targetName, newLevel)
      .build();
  }

  /**
   * Plays the level up animation on the character.
   * @param {Game_Character} character The player's `Game_Character`.
   */
  playLevelUpAnimation(character)
  {
    character.requestAnimation(49);
  }

  /**
   * Handles a skill being learned for a battler while on the map.
   * @param {RPG_Skill} skill The skill being learned.
   * @param {string} uuid The uuid of the battler leveling up.
   */
  battlerSkillLearn(skill, uuid)
  {
    const battler = $gameMap.getBattlerByUuid(uuid);
    if (battler)
    {
      const character = battler.getCharacter();
      this.generatePopSkillLearn(skill, character);
      this.createSkillLearnLog(skill, battler);
    }
  }

  /**
   * Creates a text pop of the skill being learned.
   * @param {RPG_Skill} skill The skill being learned.
   * @param {Game_Character} character The character to show the popup on.
   */
  generatePopSkillLearn(skill, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const skillLearnPop = this.configureSkillLearnPop(skill);

    // add the pop to the target's tracking.
    character.addTextPop(skillLearnPop);
    character.setRequestTextPop();
  }

  /**
   * Configures the popup for a skill learned.
   * @param {RPG_Skill} skill The skill learned.
   * @returns {Map_TextPop}
   */
  configureSkillLearnPop(skill)
  {
    return new TextPopBuilder(skill.name)
      .isSkillLearned(skill.iconIndex)
      .build();
  }

  /**
   * Creates a skill learning log for the player.
   * @param {RPG_Skill} skill The skill being learned.
   * @param {JABS_Battler} player The player's `JABS_Battler`.
   */
  createSkillLearnLog(skill, player)
  {
    if (!J.LOG) return;

    const log = this.configureSkillLearnLog(player.getReferenceData().name, skill.id);
    $gameTextLog.addLog(log);
  }

  /**
   * Configures the log for the skill learned.
   * @param {string} targetName The name of the target learning the skill.
   * @param {number} learnedSkillId The id of the skill learned.
   * @returns {Map_Log}
   */
  configureSkillLearnLog(targetName, learnedSkillId)
  {
    return new MapLogBuilder()
      .setupSkillLearn(targetName, learnedSkillId)
      .build();
  }

//#endregion defeated target aftermath
}
//#endregion JABS_Engine