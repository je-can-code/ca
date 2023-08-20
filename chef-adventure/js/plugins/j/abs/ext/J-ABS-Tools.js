//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 TOOLS] Enable new tool-like tags for use with skills.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables new tags that give tool-like functionality to skills.
 *
 * Enables:
 * - NEW! added "gap close" aka "hookshot" functionality.
 *
 * TODO:
 * - gloves for carrying events.
 *
 * This plugin requires JABS.
 * ============================================================================
 * GAP CLOSING:
 * Have you ever wanted to be able to use a skill and gap close to a target
 * without having to take the painstaking effort of manually moving to the
 * given target? Well now you can! By applying the appropriate tags to various
 * database locations, you can enable/disable gap closing for your battlers!
 *
 * HEADS UP:
 * There are a number of tags required to make this work, so this will deviate
 * from normal tag explanations a bit.
 *
 * TAG USAGE:
 * (primarily)
 * - Events
 * - Skills
 * - Enemies
 *
 * (secondarily)
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <gapClose>
 * This tag is required on skills that you want to be "gap closing skills".
 *
 *  <gapCloseTarget>
 * This tag is required on the things you want to be "gap closable", such as
 * enemies or on events representing enemies. This tag can also be applied to
 * things that a battler can be affected by, such as equipment or states.
 *
 * GAP CLOSE TARGET vs PLUGIN PARAMETER "Gap Close Default":
 * The <gapCloseTarget> tag is not required if you enable flip the plugin
 * parameter of "Gap Close Default" to true. Anything you hit while that is
 * true will result in gap closing if the skill permits.
 *
 * EXAMPLE:
 *  <gapClose> on skill ID 25.
 *  <gapCloseTarget> on enemy ID 33.
 * Using skill 25 against enemy 33 will pull the player to the enemy.
 *
 *  <gapClose> on skill ID 25.
 *  <gapCloseTarget> on state ID 4.
 * An enemy afflicts the player/battler with state 4.
 * If the enemy then used skill 25 against the player with the state, they
 * would be pulled to the player.
 *
 *  <gapClose> on skill ID 25.
 *  <gapCloseTarget> on some event that is an inanimate battler.
 * Using skill 25 against the event will pull the player to the event.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param canGapCloseByDefault
 * @type boolean
 * @text Gap Close Default
 * @desc True if you can gap close to anything hittable, false if only specific targets.
 * @default false
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.TOOLS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.TOOLS.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-Tools`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The plugin parameters for this plugin.
 */
J.ABS.EXT.TOOLS.PluginParameters = PluginManager.parameters(J.ABS.EXT.TOOLS.Metadata.Name);

/**
 * A continuation of the `metadata` for this plugin, typically containing additional content
 * that was derived from the plugin parameters.
 */
J.ABS.EXT.TOOLS.Metadata = {
  // include the original metadata.
  ...J.ABS.EXT.TOOLS.Metadata,

  /**
   * The behavior for whether or not the player can gap close to anything they hit, or if they
   * can only gap close to targets bearing the "gap close target" tag.
   */
  CanGapCloseByDefault: J.ABS.EXT.TOOLS.PluginParameters["canGapCloseByDefault"] === "true",
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.TOOLS.Aliased = {
  Game_Character: new Map(),
  Game_CharacterBase: new Map(),
  Game_Event: new Map(),
  Game_Follower: new Map(),
  Game_Player: new Map(),
  Game_System: new Map(),
  JABS_Engine: new Map(),
  JABS_Battler: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.TOOLS.RegExp = {
  GapClose: /<gapClose>/i,
  GapCloseTarget: /<gapCloseTarget>/i,
  GapCloseMode: /<gapCloseMode:(blink|jump|travel)>/i,
  GapClosePosition: /<gapClosePosition:(infront|behind|same)>/i,
  BlockGapClose: /<blockGapClose>/i,
};

/**
 * All types of gap close modes that are available to pick from.
 * The mode is the means of which the battler will travel the to the destination.
 * All modes bypass terrain.
 * If they should not bypass terrain, consider eventing instead.
 */
J.ABS.EXT.TOOLS.GapCloseModes = {
  /**
   * Blinks instantly to the target.
   */
  Blink: "blink",

  /**
   * Jumps to the target.
   */
  Jump: "jump",

  /**
   * Using pathing, will attempt to walk to the destination.
   * While traveling, "through" will be enabled.
   */
  Travel: "travel",
};

/**
 * All types of gap close positions that are available to pick from.
 * The position is ultimately the destination, defined as where the battler
 * should end up when they are done gap closing.
 */
J.ABS.EXT.TOOLS.GapClosePositions = {
  /**
   * Infront translates to being on the same side of the target as the gap-closing
   * battler was when they started the gap closing process, and does not consider the
   * facing of the target battler considering that can change wildly.
   */
  Infront: "infront",

  /**
   * Behind translates to being on the opposite side of the target as the gap-closing
   * battler was when they started the gap closing process, and does not consider the
   * facing of the target battler considering that can change wildly.
   */
  Behind: "behind",

  /**
   * Same translates to arriving at the same coordinates as the target is, meaning the
   * gap-closing battler will be ontop of the target.
   */
  Same: "same",
};
//endregion Introduction

/**
 * Initializes the properties of this battler that are not related to anything in particular.
 */
J.ABS.EXT.TOOLS.Aliased.JABS_Battler.set('initGeneralInfo', JABS_Battler.prototype.initGeneralInfo);
JABS_Battler.prototype.initGeneralInfo = function()
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.JABS_Battler.get('initGeneralInfo').call(this);

  /**
   * The counter for how long this battler is waiting.
   * @type {boolean}
   */
  this._gapClosing = false;

  /**
   * The destination coordinates of where this battler is gap closing to.
   * @type {[number, number]}
   */
  this._gapCloseDestination = [0, 0];
};

/**
 * Begins the process of gap closing.
 */
JABS_Battler.prototype.beginGapClosing = function()
{
  this._gapClosing = true;
};

/**
 * Ends the process of gap closing.
 */
JABS_Battler.prototype.endGapClosing = function()
{
  this._gapClosing = false;
};

/**
 * Gets whether or not this battler is currently gap closing.
 * @returns {boolean}
 */
JABS_Battler.prototype.isGapClosing = function()
{
  return this._gapClosing;
};

/**
 * Gets the destination coordinates of where this battler is gap closing to.
 * @returns {[number,number]}
 */
JABS_Battler.prototype.gapCloseDestination = function()
{
  return this._gapCloseDestination;
};

/**
 * Sets the destination coordinates for this battler's gap close.
 * @param {[number, number]} destination The destination x:y coordinates.
 */
JABS_Battler.prototype.setGapCloseDestination = function(destination)
{
  this._gapCloseDestination = destination;
};

/**
 * Determines whether or not we have a valid gap close destination.
 * @returns {boolean} True if we have a valid destination, false otherwise.
 */
JABS_Battler.prototype.hasGapCloseDestination = function()
{
  // destructure the gap close destination.
  const [goalX, goalY] = this.gapCloseDestination();

  // if the destination is 0:0, then we don't have a destination.
  if (goalX === 0 && goalY === 0) return false;

  // otherwise we have a destination to gap close to!
  return true;
};

/**
 * Clears the destination coordinates for gap closing.
 */
JABS_Battler.prototype.clearGapCloseDestination = function()
{
  this._gapCloseDestination = [0, 0];
};

/**
 * Extends {@link JABS_Battler.update}.
 * Also updates the gap closing process.
 */
J.ABS.EXT.TOOLS.Aliased.JABS_Battler.set('update', JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function()
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.JABS_Battler.get('update').call(this);

  // also update gap closing.
  this.updateGapClosing();
};

/**
 * The update flow for managing gap closing.
 */
JABS_Battler.prototype.updateGapClosing = function()
{
  // check if we are currently gap closing.
  if (this.isGapClosing())
  {
    // make sure we have a valid destination.
    if (this.hasGapCloseDestination())
    {
      // check if we reached the destination yet.
      if (this.hasReachedGapCloseDestination())
      {
        this.clearGapCloseDestination();
        this.endGapClosing();
      }

      // we haven't reached the destination, keep going.
    }
    // we don't have a valid destination.
    else
    {
      // stop that.
      this.clearGapCloseDestination();
      this.endGapClosing();
    }
  }

  // not gap closing.
};

/**
 * Determines whether or not this battler can be gap closed to.
 * @returns {boolean} True if the battler can be gap closed to, false otherwise.
 */
JABS_Battler.prototype.isGapClosable = function()
{
  // grab the battler.
  const battler = this.getBattler();

  // check the battler to see if they are gap closable.
  const battlerGapClosable = battler.isGapClosable();

  // by default characters are not gap closable.
  let characterGapClosable = false;

  // check if this battler is an event-based battler.
  if (this.isEvent())
  {
    // grab the character.
    const character = this.getCharacter();

    // check the character to see if they are gap closable.
    characterGapClosable = character.isGapClosable();
  }

  // if either the battler or character is gap closable, then we can gap close.
  if (battlerGapClosable || characterGapClosable) return true;

  // no gap closing :(
  return false;
};

/**
 * Executes a gap close to the target based on the provided action.
 * @param {JABS_Action} action The `JABS_Action` containing the action data.
 * @param {JABS_Battler} target The target having the action applied against.
 */
JABS_Battler.prototype.gapCloseToTarget = function(action, target)
{
  // do not try to gap close if we are already gap closing.
  if (this.isGapClosing()) return;

  // begin the gap closing procedure.
  this.beginGapClosing();

  // set the gap close destination to wherever the target is at this moment.
  this.setGapCloseDestination([target.getX(), target.getY()]);

  // extract the gap close details from the skill.
  let { jabsGapCloseMode, jabsGapClosePosition } = action.getBaseSkill();

  // if the position is not identified, then default to "same".
  jabsGapClosePosition ??= J.ABS.EXT.TOOLS.GapClosePositions.Same;

  // determine the destination delta coordiantes.
  const [x, y] = this.determineGapCloseCoordinates(target, jabsGapClosePosition);

  // if the mode is not identified, then default to "jump".
  jabsGapCloseMode ??= J.ABS.EXT.TOOLS.GapCloseModes.Jump;

  // grab the underlying character for access to movement.
  const casterCharacter = this.getCharacter();

  // pivot on the mode.
  switch (jabsGapCloseMode)
  {
    case J.ABS.EXT.TOOLS.GapCloseModes.Jump:
      casterCharacter.jump(x, y)
      break;
    case J.ABS.EXT.TOOLS.GapCloseModes.Blink:
      // TODO: update player locate to be less visually jarring? (see: parallax background)
      casterCharacter.locate(target.getX(), target.getY());
      break;
    case J.ABS.EXT.TOOLS.GapCloseModes.Travel:
      // TODO: pathfind instead.
      casterCharacter.jump(x, y)
      break;
  }
};

/**
 * Determines where the precise coordinates are that we're attempting to gap close to.
 * Note that this doesn't return the x:y of the target, it returns the delta so that
 * @param {JABS_Battler} target The target having the action applied against.
 * @param {J.ABS.EXT.TOOLS.GapCloseModes} position The position post-gap-closing.
 * @returns {[x: number, y: number]}
 */
JABS_Battler.prototype.determineGapCloseCoordinates = function(target, position)
{
  const targetCharacter = target.getCharacter();

  const [x, y] = [this.getX(), this.getY()];
  const goalX = targetCharacter.deltaXFrom(x);
  const goalY = targetCharacter.deltaYFrom(y);

  if (position === J.ABS.EXT.TOOLS.GapClosePositions.Behind)
  {
    // TODO: adjust goal x,y based on position w/ target.
    return [goalX, goalY];
  }

  if (position === J.ABS.EXT.TOOLS.GapClosePositions.Infront)
  {
    // TODO: adjust goal x,y based on position w/ target.
    return [goalX, goalY];
  }

  // position must be "same", so just return the target's coordinates.
  return [goalX, goalY];
};

/**
 * Determines if this battler has reached its gap close destination coordinates yet.
 * @returns {boolean} True if it has reached the destination, false otherwise.
 */
JABS_Battler.prototype.hasReachedGapCloseDestination = function()
{
  // check if somehow we are processing this without a destination.
  if (!this.hasGapCloseDestination())
  {
    // stop gap closing.
    this.endGapClosing();

    // we are where we need to be.
    return true;
  }

  // destructure the destination out.
  const [goalX, goalY] = this.gapCloseDestination();

  // check where we're currently at.
  const [actualX, actualY] = [this.getX(), this.getY()];

  // the amount of wiggle room for gap closing- perfect gap closing is not viable.
  const fuzzy = JABS_Battler.gapCloseWiggleRoom();

  // check if we are generally at the target destination.
  const xOk = (actualX >= goalX-fuzzy) && (actualX <= goalX+fuzzy);
  const yOk = (actualY >= goalY-fuzzy) && (actualY <= goalY+fuzzy);
  const doneMoving = !(this.getCharacter().isMoving());

  // if we have reached the destination, then we're done.
  if (xOk && yOk && doneMoving) return true;

  // keep going!
  return false;
};

/**
 * A static value representing some degree of variance allowed for gap closing
 * to a target destination.
 * @returns {number} The amount of x:y coordinate wiggle room to identify as "close enough".
 */
JABS_Battler.gapCloseWiggleRoom = function()
{
  return 0.5;
};

//region gapClose
/**
 * Whether or not this skill is designed to gap close.
 * Gap-closing will pull the player to wherever the skill connected.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGapClose",
  {
    get: function()
    {
      return this.getJabsGapClose();
    },
  });

/**
 * Gets whether or not this skill is a gap close skill.
 * @returns {boolean}
 */
RPG_Skill.prototype.getJabsGapClose = function()
{
  return this.extractJabsGapClose();
};

/**
 * Extracts the value from its notes.
 * @returns {boolean}
 */
RPG_Skill.prototype.extractJabsGapClose = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.EXT.TOOLS.RegExp.GapClose);
};
//endregion gapClose

//region gapCloseMode
/**
 * The type of gap close mode this skill uses.
 * If there is no gap close mode available, then it'll be null instead.
 * @type {J.ABS.EXT.TOOLS.GapCloseModes|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGapCloseMode",
  {
    get: function()
    {
      return this.getJabsGapCloseMode();
    },
  });

/**
 * Gets the gap close mode of this skill.
 * @returns {J.ABS.EXT.TOOLS.GapCloseModes|null}
 */
RPG_Skill.prototype.getJabsGapCloseMode = function()
{
  return this.extractJabsGapCloseMode();
};

/**
 * Extracts the value from its notes.
 * @returns {J.ABS.EXT.TOOLS.GapCloseModes|null}
 */
RPG_Skill.prototype.extractJabsGapCloseMode = function()
{
  return this.getStringFromNotesByRegex(J.ABS.EXT.TOOLS.RegExp.GapCloseMode, true);
};
//endregion gapCloseMode

//region gapClosePosition
/**
 * The type of gap close position this skill uses.
 * If there is no gap close position available, then it'll be null instead.
 * @type {J.ABS.EXT.TOOLS.GapClosePositions|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGapClosePosition",
  {
    get: function()
    {
      return this.getJabsGapCloseMode();
    },
  });

/**
 * Gets the gap close position of this skill.
 * @returns {J.ABS.EXT.TOOLS.GapClosePositions|null}
 */
RPG_Skill.prototype.getJabsGapCloseMode = function()
{
  return this.extractJabsGapCloseMode();
};

/**
 * Extracts the value from its notes.
 * @returns {J.ABS.EXT.TOOLS.GapClosePositions|null}
 */
RPG_Skill.prototype.extractJabsGapCloseMode = function()
{
  return this.getStringFromNotesByRegex(J.ABS.EXT.TOOLS.RegExp.GapClosePosition, true);
};
//endregion gapClosePosition

/**
 * Processes the various on-hit effects against the target.
 * @param {JABS_Action} action The `JABS_Action` containing the action data.
 * @param {JABS_Battler} target The target having the action applied against.
 */
J.ABS.EXT.TOOLS.Aliased.JABS_Engine.set('processOnHitEffects', JABS_Engine.prototype.processOnHitEffects)
JABS_Engine.prototype.processOnHitEffects = function(action, target)
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.JABS_Engine.get('processOnHitEffects').call(this, action, target);

  // handle gapclose logic.
  this.handleGapClose(action, target);
};

JABS_Engine.prototype.handleGapClose = function(action, target)
{
  // if we cannot gap close, then do not.
  if (!this.canGapClose(action, target)) return;

  // grab the caster.
  const caster = action.getCaster();

  // gap close to the target.
  caster.gapCloseToTarget(action, target)
};

/**
 * Determine whether or not the target can be gap closed to.
 * @param {JABS_Action} action The `JABS_Action` containing the action data.
 * @param {JABS_Battler} target The target having the action applied against.
 * @returns {boolean} True if the target can be gap closed to, false otherwise.
 */
JABS_Engine.prototype.canGapClose = function(action, target)
{
  // grab the skill.
  const skill = action.getBaseSkill();

  // if the skill isn't a gap close skill, then we cannot gap close.
  if (!skill.jabsGapClose) return false;

  // if it is a gap close skill and the default behavior is always gap close, then we can gap close.
  if (J.ABS.EXT.TOOLS.Metadata.CanGapCloseByDefault) return true;

  // if the target is not a gap-closable target, then we cannot gap close.
  if (!target.isGapClosable(action, target)) return false;

  // we can gap close!
  return true;
};

/**
 * Determines whether or not this battler is a gap close target.
 * @returns {boolean} True if this battler is a gap close target, false otherwise.
 */
Game_Battler.prototype.isGapClosable = function()
{
  // grab all the note objects.
  const objectsToCheck = this.getAllNotes();

  // initialize the data.
  let gapCloseTarget = false;

  // iterate over all the note objects.
  objectsToCheck.forEach(obj =>
  {
    // split up the notes.
    const notedata = obj.note.split(/[\r\n]+/);

    // iterate over all the lines of the note object.
    notedata.forEach(line =>
    {
      // check if it is a gap closable target.
      if (J.ABS.EXT.TOOLS.RegExp.GapCloseTarget.test(line))
      {
        // flag it as such.
        gapCloseTarget = true;
      }
    });
  });

  // return what we found.
  return gapCloseTarget;
};

/**
 * Extends {@link Game_CharacterBase.initMembers}.
 * Also initializes our new members.
 */
J.ABS.EXT.TOOLS.Aliased.Game_CharacterBase.set('initMembers', Game_CharacterBase.prototype.initMembers);
Game_CharacterBase.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.Game_CharacterBase.get('initMembers').call(this);

  // initialize our class members.
  this.initToolsMembers();
};

Game_CharacterBase.prototype.initToolsMembers = function()
{
  /**
   * The over-arching object that contains all properties for this plugin.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the tools extension.
   */
  this._j._tools ||= {};

  /**
   * A grouping of all properties associated with the grab and throw tool functionality.
   */
  this._j._tools._grabThrow ||= {};

  this._j._tools._grabThrow._grab ||= {};

  this._j._tools._grabThrow._grab._enabled = false;

  this._j._tools._grabThrow._grab._wait = new JABS_Timer(0);

  this._j._tools._grabThrow._grab._check = false;

  this._j._tools._grabThrow._throw ||= {};

  this._j._tools._grabThrow._throw._enabled = false;

  this._j._tools._grabThrow._throw._through = false;

  this._j._tools._grabThrow._throw._directionFixAlways = false; // TODO: from plugin params.

  this._j._tools._grabThrow._throw._directionFix = false;

  this._j._tools._grabThrow._throw._range = 0;

  this._j._tools._grabThrow._throw._wait = new JABS_Timer(0);
};

/**
 * Determines whether or not this event has any gap close target overrides.
 * @returns {boolean} True if this event has a gap close override, false otherwise.
 */
Game_Event.prototype.isGapClosable = function()
{
  // initialize the data.
  let gapCloseTarget = false;

  // check all the valid event commands to see if this target is gap closable.
  this.getValidCommentCommands().forEach(command =>
  {
    // shorthand the comment into a variable.
    const [comment,] = command.parameters;

    // check if it is a gap closable target.
    if (J.ABS.EXT.TOOLS.RegExp.GapCloseTarget.test(comment))
    {
      // flag it as such.
      gapCloseTarget = true;
    }
  });

  // return what we found.
  return gapCloseTarget;
};



/**
 * Extends {@link Game_System.initMembers}.
 * Also initializes our new members.
 */
J.ABS.EXT.TOOLS.Aliased.Game_System.set('initMembers', Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.Game_System.get('initMembers').call(this);

  // initialize our class members.
  this.initToolsMembers();
};

Game_System.prototype.initToolsMembers = function()
{
  /**
   * The over-arching object that contains all properties for this plugin.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the tools extension.
   */
  this._j._tools ||= {};

  /**
   * Whether or not the grab and throw functionality is currently enabled.
   * @type {boolean}
   */
  this._j._tools._grabThrowEnabled = true; // TODO: parameterize this.
};

/**
 * Gets whether or not grab and throw functionality is enabled.
 * @returns {boolean}
 */
Game_System.prototype.isGrabThrowEnabled = function()
{
  return this._j._tools._grabThrowEnabled;
};

/**
 * Sets whether or not grab and throw functionality is enabled.
 * @param {boolean} isEnabled
 */
Game_System.prototype.setGrabThrowEnabled = function(isEnabled)
{
  this._j._tools._grabThrowEnabled = isEnabled;
};

/**
 * Toggles whether or not grab and throw functionality is enabled.
 */
Game_System.prototype.toggleGrabThrowEnabled = function()
{
  this._j._tools._grabThrowEnabled = !this.isGrabThrowEnabled();
};

