//region Game_Actor
/**
 * Extends {@link #initMembers}.
 * Also tracks JABS ally AI.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Actor.get('initMembers').call(this);

  // init the additional members.
  this.initAllyAiMembers();
};

/**
 * Initializes all members associated with the JABS extension of Ally AI.
 */
Game_Actor.prototype.initAllyAiMembers = function()
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
   * A grouping of all properties associated with the ally AI extension.
   */
  this._j._abs._allyAi ||= {};

  /**
   * The currently selected Ally AI mode.
   * @type {JABS_AllyAI|null}
   */
  this._j._abs._allyAi._mode = new JABS_AllyAI(JABS_AllyAI.modes.VARIETY);
};

/**
 * Extends {@link #setup}.
 * Also initializes ally AI.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Actor.set('setup', Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Actor.get('setup').call(this, actorId);

  // also initialize the ally's AI.
  this.initAllyAI();
};

/**
 * Initializes the ally ai for this battler.
 */
Game_Actor.prototype.initAllyAI = function()
{
  // grab the default ally AI mode for this actor.
  const defaultAllyAiMode = this.getDefaultAllyAI();

  // update the ally AI mode with the default.
  this.setAllyAIMode(defaultAllyAiMode);
};

/**
 * Get the current ally AI mode for this ally.
 * @returns {JABS_AllyAI}
 */
Game_Actor.prototype.getAllyAI = function()
{
  if (!this._j._abs._allyAi)
  {
    this.initAllyAiMembers();
  }

  return this._j._abs._allyAi._mode;
}

/**
 * Set the current ally AI mode for this ally.
 * @param {JABS_AllyAI} mode The mode to set.
 */
Game_Actor.prototype.setAllyAIMode = function(mode)
{
  this._j._abs._allyAi._mode.changeMode(mode);
};

/**
 * Gets the default ally AI mode associated with an actor.
 * The priority for the AI mode is class > actor > default.
 * @returns {string}
 */
Game_Actor.prototype.getDefaultAllyAI = function()
{
  // if there is no actor id, then don't try this yet.
  if (!this._actorId) return null;

  // extract the ally ai mode from the actor.
  const actorMode = this.actor().getStringFromNotesByRegex(J.ABS.EXT.ALLYAI.RegExp.DefaultAi, true);

  // extract the ally ai mode from the class.
  const classMode = this.currentClass().getStringFromNotesByRegex(J.ABS.EXT.ALLYAI.RegExp.DefaultAi, true);

  // priority is class > actor > default, for ally ai mode.
  const allyAiMode = classMode ?? actorMode;

  // validate the mode provided.
  if (JABS_AllyAI.validateMode(allyAiMode))
  {
    // if validation succeeds, then return what was in the notes.
    return allyAiMode;
  }

  // return the default of "variety" for ally ai.
  return JABS_AllyAI.modes.VARIETY.key;
};

/**
 * Gets all skill slots that have skills assigned to them- excluding the tool slot.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getValidSkillSlotsForAlly = function()
{
  return this.getSkillSlotManager().getEquippedAllySlots();
};
//endregion Game_Actor