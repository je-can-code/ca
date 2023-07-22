//region Game_Actor
/**
 * Extends {@link #onSetup}.
 * Also refreshes the passive states on this battler for the first time.
 * @param {number} actorId The battler's id.
 */
J.PASSIVE.Aliased.Game_Actor.set('onSetup', Game_Actor.prototype.onSetup);
Game_Actor.prototype.onSetup = function(actorId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onSetup').call(this, actorId);

  // refresh all passive states on this battler.
  this.refreshPassiveStates();
};

/**
 * Gets all sources from which this battler can derive passive state from.
 *
 * This does include a reference call to potentially getting passive states, but due
 * to control flows, this should always come back with no passive states in the list.
 * @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
 */
Game_Actor.prototype.getPassiveStateSources = function()
{
  // perform original logic to get base sources.
  const originalSources = Game_Battler.prototype.getPassiveStateSources.call(this);

  // define additional sources that actors can derive passive states from.
  const actorPassiveSources = [
    // all equipment currently equipped on the actor.
    ...this.equippedEquips(),

    // also add the class for this
    this.currentClass(),
  ];

  // combine the sources.
  const combinedSources = originalSources.concat(actorPassiveSources);

  // return this collection of stuff.
  return combinedSources;
};

/**
 * Extends {@link #traitObjects}.
 * When considering traits, also include the actor's and party's passive states.
 */
J.PASSIVE.Aliased.Game_Actor.set('traitObjects', Game_Actor.prototype.traitObjects);
Game_Actor.prototype.traitObjects = function()
{
  // perform original logic.
  const originalObjects = J.PASSIVE.Aliased.Game_Actor.get('traitObjects').call(this);

  // add our own passive states.
  originalObjects.push(...this.getPassiveStates());

  // add our passive items/weapons/armors states.
  originalObjects.push(...$gameParty.passiveStates());

  // return the new combined collection.
  return originalObjects;
};

/**
 * Extends {@link #onLearnNewSkill}.
 * Triggers a refresh of passive states when learning a new skill.
 */
J.PASSIVE.Aliased.Game_Actor.set('onLearnNewSkill', Game_Actor.prototype.onLearnNewSkill);
Game_Actor.prototype.onLearnNewSkill = function(skillId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onLearnNewSkill').call(this, skillId);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #onForgetSkill}.
 * Triggers a refresh of passive states when forgetting a skill.
 */
J.PASSIVE.Aliased.Game_Actor.set('onForgetSkill', Game_Actor.prototype.onForgetSkill);
Game_Actor.prototype.onForgetSkill = function(skillId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onForgetSkill').call(this, skillId);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #onEquipChange}.
 * Triggers a refresh of passive states when equipment changes.
 */
J.PASSIVE.Aliased.Game_Actor.set('onEquipChange', Game_Actor.prototype.onEquipChange);
Game_Actor.prototype.onEquipChange = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onEquipChange').call(this);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #onClassChange}.
 * Triggers a refresh of passive states when the class changes.
 */
J.PASSIVE.Aliased.Game_Actor.set('onClassChange', Game_Actor.prototype.onClassChange);
Game_Actor.prototype.onClassChange = function(classId, keepExp)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onClassChange').call(this, classId, keepExp);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #getNotesSources}.
 * Includes passive skill states from this actor and also the party.
 * @returns {RPG_BaseItem[]}
 */
J.PASSIVE.Aliased.Game_Actor.set('getNotesSources', Game_Actor.prototype.getNotesSources);
Game_Actor.prototype.getNotesSources = function()
{
  // perform original logic to get notes.
  const originalSources = J.PASSIVE.Aliased.Game_Actor.get('getNotesSources').call(this);

  // newly defined sources for passives.
  const passiveSources = [
    // then add all those currently applied passive states, too.
    ...this.getPassiveStates(),

    // also apply the party's effects.
    ...$gameParty.passiveStates(),
  ];

  // combine the sources.
  const combinedSources = originalSources.concat(passiveSources);

  // return the combination.
  return combinedSources
};
//endregion Game_Actor