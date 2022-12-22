//region RPG_State effects
//region paralysis
/**
 * Whether or not this state is also a JABS paralysis state.
 * Paralysis is the same as being rooted & muted & disarmed simultaneously.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsParalyzed",
  {
    get: function()
    {
      return this.getJabsParalyzed();
    },
  });

/**
 * Gets whether or not this is a JABS paralysis state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsParalyzed = function()
{
  return this.extractJabsParalyzed()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsParalyzed = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Paralyzed, true);
};
//endregion paralysis

//region rooted
/**
 * Whether or not this state is also a JABS rooted state.
 * Rooted battlers are unable to move on the map.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsRooted",
  {
    get: function()
    {
      return this.getJabsRooted();
    },
  });

/**
 * Gets whether or not this is a JABS rooted state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsRooted = function()
{
  return this.extractJabsRooted()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsRooted = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Rooted, true);
};
//endregion rooted

//region muted
/**
 * Whether or not this state is also a JABS muted state.
 * Muted battlers are unable to use their combat skills.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsMuted",
  {
    get: function()
    {
      return this.getJabsMuted();
    },
  });

/**
 * Gets whether or not this is a JABS muted state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsMuted = function()
{
  return this.extractJabsMuted()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsMuted = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Muted, true);
};
//endregion muted

//region disarmed
/**
 * Whether or not this state is also a JABS disarmed state.
 * Disarmed battlers are unable to use their basic attacks.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsDisarmed",
  {
    get: function()
    {
      return this.getJabsDisarmed();
    },
  });

/**
 * Gets whether or not this is a JABS disarmed state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsDisarmed = function()
{
  return this.extractJabsDisarmed()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsDisarmed = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Disarmed, true);
};
//endregion disarmed

//region negative
/**
 * Whether or not this state is considered "negative" for the purpose
 * of AI action decision-making. Ally AI set to Support or enemy AI set
 * to Healing will attempt to remove "negative" states if possible.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsNegative",
  {
    get: function()
    {
      return this.getJabsNegative();
    },
  });

/**
 * Gets whether or not this is a JABS negative state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsNegative = function()
{
  return this.extractJabsNegative()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsNegative = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Negative);
};
//endregion disarmed

//region aggroInAmp
/**
 * Multiply incoming aggro by this amount.
 * @type {number|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsAggroInAmp",
  {
    get: function()
    {
      return this.getJabsAggroInAmp();
    },
  });

/**
 * Gets the incoming aggro amplifier.
 * @returns {number|null}
 */
RPG_State.prototype.getJabsAggroInAmp = function()
{
  return this.extractJabsAggroInAmp()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_State.prototype.extractJabsAggroInAmp = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AggroInAmp, true);
};
//endregion aggroInAmp

//region aggroOutAmp
/**
 * Multiply outgoing aggro by this amount.
 * @type {number|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsAggroOutAmp",
  {
    get: function()
    {
      return this.getJabsAggroOutAmp();
    },
  });

/**
 * Gets the outgoing aggro amplifier.
 * @returns {number|null}
 */
RPG_State.prototype.getJabsAggroOutAmp = function()
{
  return this.extractJabsAggroOutAmp()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_State.prototype.extractJabsAggroOutAmp = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AggroOutAmp, true);
};
//endregion aggroOutAmp

//region aggroLock
/**
 * Whether or not this state locks aggro. Battlers with this state applied
 * can neither gain nor lose aggro for the duration of the state.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsAggroLock",
  {
    get: function()
    {
      return this.getJabsAggroLock();
    },
  });

/**
 * Gets whether or not this is a JABS aggro-locking state.
 * @returns {boolean|null}
 */
RPG_State.prototype.getJabsAggroLock = function()
{
  return this.extractJabsAggroLock()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean|null}
 */
RPG_State.prototype.extractJabsAggroLock = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AggroLock, true);
};
//endregion aggroLock

//region offhand skillId
/**
 * The offhand skill id override from this state.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsOffhandSkillId",
  {
    get: function()
    {
      return this.getJabsOffhandSkillId();
    },
  });

/**
 * Gets the JABS offhand skill id override for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsOffhandSkillId = function()
{
  return this.extractJabsOffhandSkillId()
};

/**
 * Gets the value from its notes.
 */
RPG_State.prototype.extractJabsOffhandSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.OffhandSkillId, true);
};
//endregion offhand skillId

//region slipHp
//region flat
/**
 * The flat slip hp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFlatPerFive",
  {
    get: function()
    {
      return this.getJabsSlipHpFlatPer5();
    },
  });

/**
 * The flat slip hp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFlatPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpFlatPerFive / 5);
    },
  });

/**
 * The flat slip hp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFlatPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpFlatPerFive / 20);
    },
  });

/**
 * Gets the per5 flat slip hp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipHpFlatPer5 = function()
{
  return this.extractJabsSlipHpFlatPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipHpFlatPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipHpFlat);
};
//endregion flat

//region percent
/**
 * The percent slip hp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpPercentPerFive",
  {
    get: function()
    {
      return this.getJabsSlipHpPercentPer5();
    },
  });

/**
 * The percent slip hp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpPercentPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpPercentPerFive / 5);
    },
  });

/**
 * The percent slip hp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpPercentPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpPercentPerFive / 20);
    },
  });

/**
 * Gets the per5 percent slip hp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipHpPercentPer5 = function()
{
  return this.extractJabsSlipHpPercentPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipHpPercentPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipHpPercent);
};
//endregion percent

//region formula
/**
 * The formula slip hp amount- per 5 seconds.
 * This does NOT `eval()` the formula, as there is no additional variables
 * available for context.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFormulaPerFive",
  {
    get: function()
    {
      return this.getJabsSlipHpFormulaPer5();
    },
  });

/**
 * Gets the per5 formula slip hp amount for this state.
 * @returns {string|null}
 */
RPG_State.prototype.getJabsSlipHpFormulaPer5 = function()
{
  return this.extractJabsSlipHpFormulaPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipHpFormulaPer5 = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.SlipHpFormula);
};
//endregion formula
//endregion slipHp

//region slipMp
//region flat
/**
 * The flat slip mp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFlatPerFive",
  {
    get: function()
    {
      return this.getJabsSlipMpFlatPer5();
    },
  });

/**
 * The flat slip mp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFlatPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpFlatPerFive / 5);
    },
  });

/**
 * The flat slip mp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFlatPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpFlatPerFive / 20);
    },
  });

/**
 * Gets the per5 flat slip mp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipMpFlatPer5 = function()
{
  return this.extractJabsSlipMpFlatPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipMpFlatPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipMpFlat);
};
//endregion flat

//region percent
/**
 * The percent slip mp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpPercentPerFive",
  {
    get: function()
    {
      return this.getJabsSlipMpPercentPer5();
    },
  });

/**
 * The percent slip mp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpPercentPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpPercentPerFive / 5);
    },
  });

/**
 * The percent slip mp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpPercentPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpPercentPerFive / 20);
    },
  });

/**
 * Gets the per5 percent slip mp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipMpPercentPer5 = function()
{
  return this.extractJabsSlipMpPercentPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipMpPercentPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipMpPercent);
};
//endregion percent

//region formula
/**
 * The formula slip mp amount- per 5 seconds.
 * This does NOT `eval()` the formula, as there is no additional variables
 * available for context.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFormulaPerFive",
  {
    get: function()
    {
      return this.getJabsSlipMpFormulaPer5();
    },
  });

/**
 * Gets the per5 formula slip mp amount for this state.
 * @returns {string|null}
 */
RPG_State.prototype.getJabsSlipMpFormulaPer5 = function()
{
  return this.extractJabsSlipMpFormulaPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipMpFormulaPer5 = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.SlipMpFormula);
};
//endregion formula
//endregion slipMp

//region slipTp
//region flat
/**
 * The flat slip tp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFlatPerFive",
  {
    get: function()
    {
      return this.getJabsSlipTpFlatPer5();
    },
  });

/**
 * The flat slip tp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFlatPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpFlatPerFive / 5);
    },
  });

/**
 * The flat slip tp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFlatPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpFlatPerFive / 20);
    },
  });

/**
 * Gets the per5 flat slip tp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipTpFlatPer5 = function()
{
  return this.extractJabsSlipTpFlatPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipTpFlatPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipTpFlat);
};
//endregion flat

//region percent
/**
 * The percent slip tp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpPercentPerFive",
  {
    get: function()
    {
      return this.getJabsSlipTpPercentPer5();
    },
  });

/**
 * The percent slip tp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpPercentPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpPercentPerFive / 5);
    },
  });

/**
 * The percent slip tp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpPercentPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpPercentPerFive / 20);
    },
  });

/**
 * Gets the per5 percent slip tp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipTpPercentPer5 = function()
{
  return this.extractJabsSlipTpPercentPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipTpPercentPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipTpPercent);
};
//endregion percent

//region formula
/**
 * The formula slip tp amount- per 5 seconds.
 * This does NOT `eval()` the formula, as there is no additional variables
 * available for context.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFormulaPerFive",
  {
    get: function()
    {
      return this.getJabsSlipTpFormulaPer5();
    },
  });

/**
 * Gets the per5 formula slip tp amount for this state.
 * @returns {string|null}
 */
RPG_State.prototype.getJabsSlipTpFormulaPer5 = function()
{
  return this.extractJabsSlipTpFormulaPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipTpFormulaPer5 = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.SlipTpFormula);
};
//endregion formula
//endregion slipTp
//endregion RPG_State effects