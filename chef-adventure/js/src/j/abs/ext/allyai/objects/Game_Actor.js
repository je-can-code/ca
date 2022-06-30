//#region Game_Actor
/**
 * Adds in the jabs tracking object for ally ai.
 */
J.ALLYAI.Aliased.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function()
{
  J.ALLYAI.Aliased.Game_Actor.initMembers.call(this);
  this._j = this._j || {};
  /**
   * The current ally ai configuration for this actor.
   * @type {JABS_AllyAI}
   */
  this._j._allyAi = this._j._allyAi || null;
};

J.ALLYAI.Aliased.Game_Actor.setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId)
{
  J.ALLYAI.Aliased.Game_Actor.setup.call(this, actorId);
  this.initializeAllyAI();
};

/**
 * Initializes the ally ai for this battler.
 */
Game_Actor.prototype.initializeAllyAI = function()
{
  if (!this.getAllyAI())
  {
    const defaultAllyAiMode = this.getDefaultAllyAI();
    this._j._allyAi = new JABS_AllyAI(defaultAllyAiMode);
  }
};

/**
 * Gets the currently configured ally ai.
 * @returns {JABS_AllyAI}
 */
Game_Actor.prototype.getAllyAI = function()
{
  return this._j._allyAi;
};

/**
 * Gets the default ally ai mode that is defined in the actor's notes
 * (or actor's class's notes).
 * @returns {string}
 */
Game_Actor.prototype.getDefaultAllyAI = function()
{
  // if there is no actor id, then don't try this yet.
  if (!this._actorId) return null;

  let defaultAllyAi = JABS_AllyAI.modes.VARIETY;
  const structure = /<defaultAi:([-. \w+]*)>/i;
  const actorData = this.actor();

  // check the actor's notes first.
  const notedata = actorData.note.split(/[\r\n]+/);
  notedata.forEach(note =>
  {
    if (note.match(structure))
    {
      if (JABS_AllyAI.validateMode(RegExp.$1))
      {
        defaultAllyAi = RegExp.$1;
      }
    }
  });

  // then check the class notes in case there is a more granular ai assignment.
  const {classId} = actorData;
  const classData = $dataClasses[classId];
  const classNotedata = classData.note.split(/[\r\n]+/);
  classNotedata.forEach(note =>
  {
    if (note.match(structure))
    {
      if (JABS_AllyAI.validateMode(RegExp.$1))
      {
        defaultAllyAi = RegExp.$1;
      }
    }
  });

  return JABS_AllyAI.validateMode(defaultAllyAi);
};
//#endregion Game_Actor