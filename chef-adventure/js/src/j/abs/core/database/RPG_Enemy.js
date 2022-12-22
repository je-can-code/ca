//region teamId
/**
 * The JABS team id for this battler.
 * This number is the id of the team that this battler will belong to.
 * @type {number}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsTeamId",
  {
    get: function()
    {
      return this.getJabsTeamId();
    },
  });

/**
 * Gets the JABS team id for this battler.
 * @returns {number}
 */
RPG_BaseBattler.prototype.getJabsTeamId = function()
{
  return this.extractJabsTeamId();
};

/**
 * Extracts the JABS team id for this battler from its notes.
 */
RPG_BaseBattler.prototype.extractJabsTeamId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.TeamId, true);
};
//endregion teamId

//region prepare time
/**
 * The JABS prepare time for this battler.
 * This number represents how many frames must pass before this battler can
 * decide an action to perform when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsPrepareTime",
  {
    get: function()
    {
      return this.getJabsPrepareTime();
    },
  });

/**
 * Gets the JABS prepare time for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsPrepareTime = function()
{
  return this.extractJabsPrepareTime();
};

/**
 * Extracts the JABS prepare time for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsPrepareTime = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.PrepareTime, true);
};
//endregion prepare time

//region sight range
/**
 * The JABS sight range for this battler.
 * This number represents how many tiles this battler can see before
 * engaging in combat when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsSightRange",
  {
    get: function()
    {
      return this.getJabsSightRange();
    },
  });

/**
 * Gets the JABS sight range for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsSightRange = function()
{
  return this.extractJabsSightRange();
};

/**
 * Extracts the JABS sight range for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsSightRange = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Sight, true);
};
//endregion sight range

//region pursuit range
/**
 * The JABS pursuit range for this battler.
 * This number represents how many tiles this battler can see after
 * engaging in combat when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsPursuitRange",
  {
    get: function()
    {
      return this.getJabsPursuitRange();
    },
  });

/**
 * Gets the JABS pursuit range for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsPursuitRange = function()
{
  return this.extractJabsPursuitRange();
};

/**
 * Extracts the JABS pursuit range for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsPursuitRange = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Pursuit, true);
};
//endregion pursuit range

//region alert duration
/**
 * The JABS alert duration for this battler.
 * This number represents how many frames this battler will remain alerted
 * when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAlertDuration",
  {
    get: function()
    {
      return this.getJabsAlertDuration();
    },
  });

/**
 * Gets the JABS alert duration for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsAlertDuration = function()
{
  return this.extractJabsAlertDuration();
};

/**
 * Extracts the JABS alert duration for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsAlertDuration = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Pursuit, true);
};
//endregion alert duration

//region alerted sight boost
/**
 * The JABS alerted sight boost for this battler.
 * This number represents the sight bonus applied while this battler is alerted
 * outside of combat when controlled by the {@link JABS_AiManager}.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAlertedSightBoost",
  {
    get: function()
    {
      return this.getJabsAlertedSightBoost();
    },
  });

/**
 * Gets the JABS alerted sight boost for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsAlertedSightBoost = function()
{
  return this.extractJabsAlertedSightBoost();
};

/**
 * Extracts the JABS alerted sight boost for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsAlertedSightBoost = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AlertedSightBoost, true);
};
//endregion alerted sight boost

//region alerted pursuit boost
/**
 * The JABS alerted pursuit boost for this battler.
 * This number represents the sight bonus applied while this battler is alerted
 * inside of combat when controlled by the {@link JABS_AiManager}.
 *
 * It is important to note that enemies cannot be alerted during combat, but their
 * alert duration may spill over into the beginning of combat.
 * @returns {number|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAlertedPursuitBoost",
  {
    get: function()
    {
      return this.getJabsAlertedPursuitBoost();
    },
  });

/**
 * Gets the JABS alerted pursuit boost for this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsAlertedPursuitBoost = function()
{
  return this.extractJabsAlertedPursuitBoost();
};

/**
 * Extracts the JABS alerted pursuit boost for this battler from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsAlertedPursuitBoost = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AlertedPursuitBoost, true);
};
//endregion alerted pursuit boost

//region ai
/**
 * The compiled {@link JABS_EnemyAI}.
 * This defines how this battler's AI will be controlled.
 * @type {JABS_EnemyAI}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsBattlerAi",
  {
    get: function()
    {
      return this.getJabsBattlerAi();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of careful.
 * @returns {JABS_EnemyAI}
 */
RPG_BaseBattler.prototype.getJabsBattlerAi = function()
{
  // extract the AI traits out.
  const careful = this.jabsAiTraitCareful;
  const executor = this.jabsAiTraitExecutor;
  const reckless = this.jabsAiTraitReckless;
  const healer = this.jabsAiTraitHealer;
  const follower = this.jabsAiTraitFollower;
  const leader = this.jabsAiTraitLeader;

  // return the compiled battler AI.
  return new JABS_EnemyAI(careful, executor, reckless, healer, follower, leader);
};

//region ai:careful
/**
 * The JABS AI trait of careful.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitCareful",
  {
    get: function()
    {
      return this.getJabsAiTraitCareful();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of careful.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitCareful = function()
{
  return this.extractJabsAiTraitCareful();
};

/**
 * Extracts the JABS AI trait of careful from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitCareful = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitCareful);
};
//endregion ai:careful

//region ai:executor
/**
 * The JABS AI trait of executor.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitExecutor",
  {
    get: function()
    {
      return this.getJabsAiTraitExecutor();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of executor.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitExecutor = function()
{
  return this.extractJabsAiTraitExecutor();
};

/**
 * Extracts the JABS AI trait of executor from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitExecutor = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitExecutor);
};
//endregion ai:executor

//region ai:reckless
/**
 * The JABS AI trait of reckless.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitReckless",
  {
    get: function()
    {
      return this.getJabsAiTraitReckless();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of reckless.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitReckless = function()
{
  return this.extractJabsAiTraitReckless();
};

/**
 * Extracts the JABS AI trait of reckless from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitReckless = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitReckless);
};
//endregion ai:reckless

//region ai:healer
/**
 * The JABS AI trait of healer.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitHealer",
  {
    get: function()
    {
      return this.getJabsAiTraitHealer();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of healer.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitHealer = function()
{
  return this.extractJabsAiTraitHealer();
};

/**
 * Extracts the JABS AI trait of healer from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitHealer = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitHealer);
};
//endregion ai:healer

//region ai:follower
/**
 * The JABS AI trait of follower.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitFollower",
  {
    get: function()
    {
      return this.getJabsAiTraitFollower();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of follower.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitFollower = function()
{
  return this.extractJabsAiTraitFollower();
};

/**
 * Extracts the JABS AI trait of follower from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitFollower = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitFollower);
};
//endregion ai:follower

//region ai:leader
/**
 * The JABS AI trait of leader.
 * This boolean decides whether or not this battler has this AI trait.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsAiTraitLeader",
  {
    get: function()
    {
      return this.getJabsAiTraitLeader();
    },
  });

/**
 * Checks whether or not this battler has the JABS AI trait of leader.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsAiTraitLeader = function()
{
  return this.extractJabsAiTraitLeader();
};

/**
 * Extracts the JABS AI trait of leader from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsAiTraitLeader = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AiTraitLeader);
};
//endregion ai:leader

//endregion ai

//region config
//region config:canIdle
/**
 * The JABS config option for enabling idling.
 * This boolean decides whether or not this battler can idle while not engaged in combat.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigCanIdle",
  {
    get: function()
    {
      return this.getJabsConfigCanIdle();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsConfigCanIdle = function()
{
  return this.extractJabsConfigCanIdle();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsConfigCanIdle = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigCanIdle, true);
};
//endregion config:canIdle

//region config:noIdle
/**
 * The JABS config option for disabling idling.
 * This boolean decides whether or not this battler can idle while not engaged in combat.
 * @type {boolean}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNoIdle",
  {
    get: function()
    {
      return this.getJabsConfigNoIdle();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.getJabsConfigNoIdle = function()
{
  return this.extractJabsConfigNoIdle();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean}
 */
RPG_BaseBattler.prototype.extractJabsConfigNoIdle = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNoIdle, true);
};
//endregion config:canIdle

//region config:showHpBar
/**
 * The JABS config option for enabling showing the hp bar.
 * This boolean decides whether or not this battler will reveal its hp bar under its sprite.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigShowHpBar",
  {
    get: function()
    {
      return this.getJabsConfigCanIdle();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigCanIdle = function()
{
  return this.extractJabsConfigCanIdle();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigCanIdle = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigShowHpBar, true);
};
//endregion config:showHpBar

//region config:noHpBar
/**
 * The JABS config option for disabling showing the hp bar.
 * This boolean decides whether or not this battler will hide its hp bar under its sprite.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNoHpBar",
  {
    get: function()
    {
      return this.getJabsConfigNoIdle();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigNoIdle = function()
{
  return this.extractJabsConfigNoIdle();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigNoIdle = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNoHpBar, true);
};
//endregion config:noHpBar

//region config:showName
/**
 * The JABS config option for enabling showing the battler's name.
 * This boolean decides whether or not this battler will reveal its name under its sprite.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigShowName",
  {
    get: function()
    {
      return this.getJabsConfigShowName();
    },
  });

/**
 * Checks whether or not this battler's name is visible.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigShowName = function()
{
  return this.extractJabsConfigShowName();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigShowName = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigShowName, true);
};
//endregion config:showName

//region config:noName
/**
 * The JABS config option for disabling showing the battler's name.
 * This boolean decides whether or not this battler will hide its name under its sprite.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNoName",
  {
    get: function()
    {
      return this.getJabsConfigNoName();
    },
  });

/**
 * Checks whether or not this battler can idle.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigNoName = function()
{
  return this.extractJabsConfigNoName();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigNoName = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNoName, true);
};
//endregion config:noName

//region config:invincible
/**
 * The JABS config option for enabling invincibility on this battler.
 * This boolean decides whether or not actions can collide with this battler.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigInvincible",
  {
    get: function()
    {
      return this.getJabsConfigInvincible();
    },
  });

/**
 * Checks whether or not this battler is invincible.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigInvincible = function()
{
  return this.extractJabsConfigInvincible();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigInvincible = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigInvincible, true);
};
//endregion config:invincible

//region config:notInvincible
/**
 * The JABS config option for disabling invincibility on this battler.
 * This boolean decides whether or not actions cannot collide with this battler.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNotInvincible",
  {
    get: function()
    {
      return this.getJabsConfigNotInvincible();
    },
  });

/**
 * Checks whether or not this battler isn't invincible.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigNotInvincible = function()
{
  return this.extractJabsConfigNotInvincible();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigNotInvincible = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNotInvincible, true);
};
//endregion config:notInvincible

//region config:inanimate
/**
 * The JABS config option for enabling being inanimate for this battler.
 * This boolean decides whether or not to enable being inanimate
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigInanimate",
  {
    get: function()
    {
      return this.getJabsConfigInanimate();
    },
  });

/**
 * Checks whether or not this battler is inanimate.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigInanimate = function()
{
  return this.extractJabsConfigInanimate();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigInanimate = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigInanimate, true);
};
//endregion config:inanimate

//region config:notInanimate
/**
 * The JABS config option for disabling being inanimate for this battler.
 * This boolean decides whether or not to disable being inanimate.
 * @returns {boolean|null}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsConfigNotInanimate",
  {
    get: function()
    {
      return this.getJabsConfigNotInanimate();
    },
  });

/**
 * Checks whether or not this battler isn't inanimate.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.getJabsConfigNotInanimate = function()
{
  return this.extractJabsConfigNotInanimate();
};

/**
 * Extracts the value from this battler's notes.
 * @returns {boolean|null}
 */
RPG_BaseBattler.prototype.extractJabsConfigNotInanimate = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.ConfigNotInanimate, true);
};
//endregion config:notInanimate

//endregion config