//region Game_Actor
/**
 * Gets the parameter value from the "long" parameter id.
 *
 * "Long" parameter ids are used in the context of 0-27, rather than
 * 0-7 for param, 0-9 for xparam, and 0-9 for sparam.
 * @param {number} paramId The "long" parameter id.
 * @returns {number} The value of the given parameter.
 */
// eslint-disable-next-line complexity
Game_Actor.prototype.longParam = function(paramId)
{
  switch (paramId)
  {
    case  0:
      return this.param(paramId); // mhp
    case  1:
      return this.param(paramId); // mmp
    case  2:
      return this.param(paramId); // atk
    case  3:
      return this.param(paramId); // def
    case  4:
      return this.param(paramId); // mat
    case  5:
      return this.param(paramId); // mdf
    case  6:
      return this.param(paramId); // agi
    case  7:
      return this.param(paramId); // luk
    case  8:
      return this.xparam(paramId - 8); // hit
    case  9:
      return this.xparam(paramId - 8); // eva (parry boost)
    case 10:
      return this.xparam(paramId - 8); // cri
    case 11:
      return this.xparam(paramId - 8); // cev
    case 12:
      return this.xparam(paramId - 8); // mev (unused)
    case 13:
      return this.xparam(paramId - 8); // mrf
    case 14:
      return this.xparam(paramId - 8); // cnt (autocounter)
    case 15:
      return this.xparam(paramId - 8); // hrg
    case 16:
      return this.xparam(paramId - 8); // mrg
    case 17:
      return this.xparam(paramId - 8); // trg
    case 18:
      return this.sparam(paramId - 18); // trg (aggro)
    case 19:
      return this.sparam(paramId - 18); // grd (parry)
    case 20:
      return this.sparam(paramId - 18); // rec
    case 21:
      return this.sparam(paramId - 18); // pha
    case 22:
      return this.sparam(paramId - 18); // mcr (mp cost)
    case 23:
      return this.sparam(paramId - 18); // tcr (tp cost)
    case 24:
      return this.sparam(paramId - 18); // pdr
    case 25:
      return this.sparam(paramId - 18); // mdr
    case 26:
      return this.sparam(paramId - 18); // fdr
    case 27:
      return this.sparam(paramId - 18); // exr
    case 30:
      return this.maxTp();              // mtp
    case 31:
      return this.getWalkSpeedBoosts();               // move speed boost
    case 32:
      return this.bonusSkillProficiencyGains();   // proficiency boost
    case 33:
      return this.sdpMultiplier();                // sdp multiplier
    default:
      console.warn(`paramId:${paramId} didn't map to any of the default parameters.`);
      return 0;
  }
};

/**
 * The underlying database data for this battler.
 *
 * This allows operations to be performed against both actor and enemy indifferently.
 * @returns {number}
 */
Game_Actor.prototype.battlerId = function()
{
  return this.actorId();
};

/**
 * The underlying database data for this actor.
 * @returns {RPG_Actor}
 */
Game_Actor.prototype.databaseData = function()
{
  return this.actor();
};

/**
 * Determines whether or not this actor is the leader.
 * @returns {boolean}
 */
Game_Actor.prototype.isLeader = function()
{
  return $gameParty.leader() === this;
};

/**
 * All sources this actor battler has available to it.
 * @returns {(RPG_Actor|RPG_State|RPG_Class|RPG_Skill|RPG_EquipItem)[]}
 */
Game_Actor.prototype.getNotesSources = function()
{
  // get the super-classes' note sources as a baseline.
  const baseNoteSources = Game_Battler.prototype.getNotesSources.call(this);

  // the list of note sources unique to actors.
  const actorUniqueNoteSources = [
    // add the actor's class to the source list.
    this.currentClass(),

    // add all of the actor's valid equips to the source list.
    ...this.equippedEquips(),
  ];

  // combine the two source lists.
  const combinedNoteSources = baseNoteSources.concat(actorUniqueNoteSources);

  // return our combination.
  return combinedNoteSources;
};

/**
 * Extends {@link #setup}.
 * Adds a hook for performing actions when an actor is setup.
 */
J.BASE.Aliased.Game_Actor.set('setup', Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId)
{
  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('setup').call(this, actorId);

  // execute the on-setup hook.
  this.onSetup(actorId);
};

/**
 * A hook for performing actions when an actor is setup.
 * @param {number} actorId The actor's id.
 */
Game_Actor.prototype.onSetup = function(actorId)
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

/**
 * Extends {@link #learnSkill}.
 * Adds a hook for performing actions when a new skill is learned.
 * If the skill is already known, it will not trigger any on-skill-learned effects.
 */
J.BASE.Aliased.Game_Actor.set('learnSkill', Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId)
{
  // check if we don't already know the skill.
  if (!this.isLearnedSkill(skillId))
  {
    // execute the on-learn-new-skill hook.
    this.onLearnNewSkill(skillId);
  }

  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('learnSkill').call(this, skillId);
};

/**
 * A hook for performing actions when an actor learns a new skill.
 * @param {number} skillId The skill id of the skill learned.
 */
Game_Actor.prototype.onLearnNewSkill = function(skillId)
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

/**
 * Extends {@link #learnSkill}.
 * Adds a hook for performing actions when a new skill is learned.
 * If the skill is already known, it will not trigger any on-skill-learned effects.
 */
J.BASE.Aliased.Game_Actor.set('forgetSkill', Game_Actor.prototype.forgetSkill);
Game_Actor.prototype.forgetSkill = function(skillId)
{
  // you cannot forget a skill you do not know.
  if (this.isLearnedSkill(skillId))
  {
    // execute the on-forget-skill hook.
    this.onForgetSkill(skillId);
  }

  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('forgetSkill').call(this, skillId);
};

/**
 * A hook for performing actions when a battler forgets a skill.
 * @param {number} skillId The skill id of the skill forgotten.
 */
Game_Actor.prototype.onForgetSkill = function(skillId)
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

/**
 * Extends {@link #die}.
 * Adds a toggle of the death effects.
 */
J.BASE.Aliased.Game_Actor.set('die', Game_Actor.prototype.die);
Game_Actor.prototype.die = function()
{
  // perform original effects.
  J.BASE.Aliased.Game_Actor.get('die').call(this);

  // perform on-death effects.
  this.onDeath();
};

/**
 * An event hook fired when this actor dies.
 */
Game_Actor.prototype.onDeath = function()
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

/**
 * Extends {@link #revive}.
 * Handles on-revive effects at the actor-level.
 */
J.BASE.Aliased.Game_Actor.set('revive', Game_Actor.prototype.revive);
Game_Actor.prototype.revive = function()
{
  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('revive').call(this);

  // perform on-revive effects.
  this.onRevive();
};

/**
 * An event hook fired when this actor revives.
 */
Game_Actor.prototype.onRevive = function()
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

/**
 * An event hook fired when this actor changes their current equipment.
 */
Game_Actor.prototype.onEquipChange = function()
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

J.BASE.Aliased.Game_Actor.set('changeClass', Game_Actor.prototype.changeClass);
Game_Actor.prototype.changeClass = function(classId, keepExp)
{
  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('changeClass').call(this, classId, keepExp);

  // perform on-class-change effects.
  this.onClassChange(classId, keepExp);
};

/**
 * An event hook fired when this actor changes classes.
 */
Game_Actor.prototype.onClassChange = function(classId, keepExp)
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

/**
 * Extends {@link #changeEquip}.
 * Adds a hook for performing actions when equipment on the actor has changed state.
 */
J.BASE.Aliased.Game_Actor.set('changeEquip', Game_Actor.prototype.changeEquip);
Game_Actor.prototype.changeEquip = function(slotId, item)
{
  // grab a snapshot of what the equips looked like before changing.
  const oldEquips = JsonEx.makeDeepCopy(this._equips);

  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('changeEquip').call(this, slotId, item);

  // determine if the equips array changed from what it was before original logic.
  const isChanged = !oldEquips.equals(this._equips);

  // check if we did actually have change.
  if (isChanged)
  {
    // triggers the on-equip-change hook.
    this.onEquipChange();
  }
};

/**
 * Extends {@link #discardEquip}.
 * Adds a hook for performing actions when equipment on the actor has been discarded.
 */
J.BASE.Aliased.Game_Actor.set('discardEquip', Game_Actor.prototype.discardEquip);
Game_Actor.prototype.discardEquip = function(item)
{
  // grab a snapshot of what the equips looked like before changing.
  const oldEquips = JsonEx.makeDeepCopy(this._equips);

  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('discardEquip').call(this, item);

  // determine if the equips array changed from what it was before original logic.
  const isChanged = !oldEquips.equals(this._equips);

  // check if we did actually have change.
  if (isChanged)
  {
    // triggers the on-equip-change hook.
    this.onEquipChange();
  }
};

/**
 * Extends {@link #forceChangeEquip}.
 * Adds a hook for performing actions when equipment on the actor has been forcefully changed.
 */
J.BASE.Aliased.Game_Actor.set('forceChangeEquip', Game_Actor.prototype.forceChangeEquip);
Game_Actor.prototype.forceChangeEquip = function(slotId, item)
{
  // grab a snapshot of what the equips looked like before changing.
  const oldEquips = JsonEx.makeDeepCopy(this._equips);

  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('forceChangeEquip').call(this, slotId, item);

  // determine if the equips array changed from what it was before original logic.
  const isChanged = !oldEquips.equals(this._equips);

  // check if we did actually have change.
  if (isChanged)
  {
    // triggers the on-equip-change hook.
    this.onEquipChange();
  }
};

/**
 * Extends {@link #releaseUnequippableItems}.
 * Adds a hook for performing actions when equipment on the actor has been released due to internal change.
 */
J.BASE.Aliased.Game_Actor.set('releaseUnequippableItems', Game_Actor.prototype.releaseUnequippableItems);
Game_Actor.prototype.releaseUnequippableItems = function(forcing)
{
  // grab a snapshot of what the equips looked like before changing.
  const oldEquips = JsonEx.makeDeepCopy(this._equips);

  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('releaseUnequippableItems').call(this, forcing);

  // determine if the equips array changed from what it was before original logic.
  const isChanged = this.haveEquipsChanged(oldEquips);

  // check if we did actually have change.
  if (isChanged)
  {
    // triggers the on-equip-change hook.
    this.onEquipChange();
  }
};

/**
 * Determines whether or not the equips have changed since before.
 * @param {Game_Item[]} oldEquips The old equips collection.
 * @returns {boolean} True if there was a change in equips, false otherwise.
 */
Game_Actor.prototype.haveEquipsChanged = function(oldEquips)
{
  // if the equip lengths are different, then we definitely have change.
  if (oldEquips.length !== this._equips.length) return true;

  // default to no change.
  let hasDifferentEquips = false;

  // iterate over all the old equips to compare with new.
  oldEquips.forEach((oldEquip, index) =>
  {
    // check if their item id is the same.
    const sameItemId = oldEquip.itemId() === this._equips[index].itemId();

    // check if their equip type is the same.
    const sameType = oldEquip._dataClass === this._equips[index]._dataClass;

    // check if their underlying item is the same.
    const sameInnerItem = oldEquip._item === this._equips[index]._item;

    // if all three are the same, then no change.
    if (sameItemId && sameType && sameInnerItem) return;

    // something changed.
    hasDifferentEquips = true;
  });

  return hasDifferentEquips;
};

/**
 * Gets all currently-equipped equips for this actor.
 * Normally, {@link #equips} includes `null`s where there may be empty equipment slots,
 * but this filters those out for you.
 * @returns {RPG_EquipItem[]}
 */
Game_Actor.prototype.equippedEquips = function()
{
  return this.equips().filter(equip => !!equip);
};

/**
 * An event hook fired when this actor levels up.
 */
Game_Actor.prototype.onLevelUp = function()
{
  this.onBattlerDataChange();
};

/**
 * Extends {@link #levelUp}.
 * Adds a hook for performing actions when an the actor levels up.
 */
J.BASE.Aliased.Game_Actor.set('levelUp', Game_Actor.prototype.levelUp);
Game_Actor.prototype.levelUp = function()
{
  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('levelUp').call(this);

  // triggers the on-level-up hook.
  this.onLevelUp();
};

/**
 * An event hook fired when this actor levels down.
 */
Game_Actor.prototype.onLevelDown = function()
{
  this.onBattlerDataChange();
};

/**
 * Extends {@link #levelDown}.
 * Adds a hook for performing actions when an the actor levels down.
 */
J.BASE.Aliased.Game_Actor.set('levelDown', Game_Actor.prototype.levelDown);
Game_Actor.prototype.levelDown = function()
{
  // perform original logic.
  J.BASE.Aliased.Game_Actor.get('levelDown').call(this);

  // triggers the on-level-down hook.
  this.onLevelDown();
};
//endregion Game_Actor