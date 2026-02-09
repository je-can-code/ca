//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 HUD-QUEST] A HUD frame that displays quest objective information.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of the J-HUD plugin.
 * It will display quests and their objectives and the player's progress as
 * in realtime.
 *
 * It will show and hide with the rest of the HUD, and will only reveal quests
 * that are flagged as "tracked" in the questopedia.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Cool details about this cool plugin go here.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 101
 *
 *
 * @command do-the-thing
 * @text Add/Remove points
 * @desc Adds or removes a designated amount of points from all members of the current party.
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The number of points to modify by. Negative will remove points. Cannot go below 0.
 */
//endregion annotations

//region plugin metadata
class J_HUD_Quest_PluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);
  }
}

//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all extensions related to the parent.
 */
J.HUD.EXT.QUEST ||= {};

/**
 * The metadata associated with this plugin.
 */
J.HUD.EXT.QUEST.Metadata = new J_HUD_Quest_PluginMetadata('J-HUD-QuestFrame', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT.QUEST.Aliased = {};
J.HUD.EXT.QUEST.Aliased.Scene_Map = new Map();
J.HUD.EXT.QUEST.Aliased.Scene_Questopedia = new Map();
J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest = new Map();
J.HUD.EXT.QUEST.Aliased.TrackedOmniObjective = new Map();
J.HUD.EXT.QUEST.Aliased.HudManager = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.HUD.EXT.QUEST.RegExp = {};
J.HUD.EXT.QUEST.RegExp.Points = /<tag:[ ]?(\d+)>/i;
//endregion initialization

//region plugin commands
/**
 * Plugin command for doing the thing.
 */
PluginManager.registerCommand(J.HUD.EXT.QUEST.Metadata.name, "do-the-thing", args =>
{
  console.log('did the thing.');
});
//endregion plugin commands

//region TrackedOmniObjective
/**
 * Extends {@link onObjectiveUpdate}.<br/>
 * Also refreshes the HUD for tracked quests.
 */
J.HUD.EXT.QUEST.Aliased.TrackedOmniObjective.set('onObjectiveUpdate', TrackedOmniObjective.prototype.onObjectiveUpdate);
TrackedOmniObjective.prototype.onObjectiveUpdate = function()
{
  // perform original logic.
  J.HUD.EXT.QUEST.Aliased.TrackedOmniObjective.get('onObjectiveUpdate')
    .call(this);

  // check if this quest is being tracked in the HUD.
  if (QuestManager.quest(this.questKey).tracked)
  {
    // refresh the quest status.
    $hudManager.requestQuestRefresh();
  }
};
//endregion TrackedOmniObjective

//region TrackedOmniQuest
/**
 * Extends {@link refreshState}.<br/>
 * Also flags the HUD for refreshment.
 */
J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest.set('refreshState', TrackedOmniQuest.prototype.refreshState);
TrackedOmniQuest.prototype.refreshState = function()
{
  // perform original logic.
  J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest.get('refreshState')
    .call(this);

  // also refresh the quest HUD with a progression of objectives.
  $hudManager.requestQuestRefresh();
};

/**
 * Unlocks this quest and actives the target objective. If no objectiveId is provided, then the first objective will be
 * made {@link OmniObjective.States.Active}.
 * @param {number=} objectiveId The id of the objective to initialize as active; defaults to the immediate or first.
 */
J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest.set('unlock', TrackedOmniQuest.prototype.unlock);
TrackedOmniQuest.prototype.unlock = function(objectiveId = null)
{
  // perform original logic.
  J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest.get('unlock')
    .call(this, objectiveId);

  // check if we have any tracked quests.
  const hasNoTrackedQuests = QuestManager.trackedQuests().length === 0;

  // check if there is nothing else tracked, and this quest is now active.
  if (hasNoTrackedQuests && this.state === OmniQuest.States.Active)
  {
    // start tracking it!
    this.toggleTracked();

    // and also refresh the HUD.
    $hudManager.requestQuestRefresh();
  }
};

//endregion TrackedOmniQuest

//region Hud_Manager
/**
 * Initialize the various members of the HUD.
 */
J.HUD.EXT.QUEST.Aliased.HudManager.set('initMembers', HudManager.prototype.initMembers);
HudManager.prototype.initMembers = function()
{
  // perform original logic.
  J.HUD.EXT.QUEST.Aliased.HudManager.get('initMembers')
    .call(this);

  /**
   * The request state for the quest data of the HUD.
   * @type {boolean}
   */
  this._needsQuestRefresh = true;
};

/**
 * Issue a request to refresh the quest data in the HUD.
 */
HudManager.prototype.requestQuestRefresh = function()
{
  this._needsQuestRefresh = true;
};

/**
 * Acknowledge the request to refresh the HUD.
 */
HudManager.prototype.acknowledgeQuestRefresh = function()
{
  this._needsQuestRefresh = false;
};

/**
 * Whether or not we have a request to refresh the quest data of the HUD.
 * @returns {boolean}
 */
HudManager.prototype.needsQuestRefresh = function()
{
  return this._needsQuestRefresh;
};
//endregion Hud_Manager

//region Scene_Map
/**
 * Extends {@link #initHudMembers}.<br>
 * Includes initialization of the target frame members.
 */
J.HUD.EXT.QUEST.Aliased.Scene_Map.set('initHudMembers', Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function()
{
  // perform original logic.
  J.HUD.EXT.QUEST.Aliased.Scene_Map.get('initHudMembers')
    .call(this);

  /**
   * A grouping of all properties that belong to quest extension of the HUD.
   */
  this._j._hud._quest = {};

  /**
   * The quest frame for tracking quests and their objectives.
   * @type {Window_QuestFrame}
   */
  this._j._hud._quest._questFrame = null;
};

/**
 * Extends {@link #createAllWindows}.<br>
 * Includes creation of the target frame window.
 */
J.HUD.EXT.QUEST.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT.QUEST.Aliased.Scene_Map.get('createAllWindows')
    .call(this);

  // create the target frame.
  this.createQuestFrameWindow();
};

//region quest frame
/**
 * Creates the quest frame window and adds it to tracking.
 */
Scene_Map.prototype.createQuestFrameWindow = function()
{
  // create the window.
  const window = this.buildQuestFrameWindow();

  // update the tracker with the new window.
  this.setQuestFrameWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the quest frame window.
 * @returns {Window_QuestFrame}
 */
Scene_Map.prototype.buildQuestFrameWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.questFrameWindowRect();

  // create the window with the rectangle.
  const window = new Window_QuestFrame(rectangle);

  // return the built and configured window.
  return window;
}

/**
 * Creates the rectangle representing the window for the target frame.
 * @returns {Rectangle}
 */
Scene_Map.prototype.questFrameWindowRect = function()
{
  // define the width of the window.
  const width = 800; // J.HUD.EXT.TARGET.Metadata.TargetFrameWidth;

  // define the height of the window.
  const height = 400; // J.HUD.EXT.TARGET.Metadata.TargetFrameHeight;

  // define the origin x of the window.
  const x = 0; //J.HUD.EXT.TARGET.Metadata.TargetFrameX;

  // define the origin y of the window.
  const y = 0; // J.HUD.EXT.TARGET.Metadata.TargetFrameY;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked quest frame window.
 * @returns {Window_QuestFrame}
 */
Scene_Map.prototype.getQuestFrameWindow = function()
{
  return this._j._hud._quest._questFrame;
}

/**
 * Set the currently tracked quest frame window to the given window.
 * @param {Window_QuestFrame} window The window to track.
 */
Scene_Map.prototype.setQuestFrameWindow = function(window)
{
  this._j._hud._quest._questFrame = window;
}
//endregion quest frame

/**
 * Extends {@link #updateHudFrames}.<br>
 * Includes updating the target frame.
 */
J.HUD.EXT.QUEST.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.QUEST.Aliased.Scene_Map.get('updateHudFrames')
    .call(this);

  // check if we need to refresh quest data.
  if ($hudManager.needsQuestRefresh())
  {
    // refresh the quest frame.
    this.getQuestFrameWindow()
      .refresh();

    // acknowledge the refresh.
    $hudManager.acknowledgeQuestRefresh();
  }
};
//endregion Scene_Map

//region Scene_Questopedia
/**
 * Extends {@link onQuestopediaListSelection}.<br/>
 * Triggers a HUD update request when something is selected in the list of quests.
 */
J.HUD.EXT.QUEST.Aliased.Scene_Questopedia.set(
  'onQuestopediaListSelection',
  Scene_Questopedia.prototype.onQuestopediaListSelection);
Scene_Questopedia.prototype.onQuestopediaListSelection = function()
{
  // perform original logic.
  J.HUD.EXT.QUEST.Aliased.Scene_Questopedia.get('onQuestopediaListSelection')
    .call(this);

  // also refresh the HUD when the user gets back to the map if they added/removed trackings of quests.
  $hudManager.requestQuestRefresh();
}

//endregion Scene_Questopedia

//region Window_QuestFrame
/**
 * A window containing the HUD data for the {@link QuestManager}'s tracked quests.
 */
class Window_QuestFrame
  extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The window size desired for this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Extends {@link initialize}.<br/>
   * Also configures this window accordingly.
   * @param {Rectangle} rect The rectangle representing this window.
   */
  initialize(rect)
  {
    // perform original logic.
    super.initialize(rect);

    // run our one-time setup and configuration.
    this.configure();

    // refresh the window for the first time.
    this.refresh();
  }

  /**
   * Performs the one-time setup and configuration per instantiation.
   */
  configure()
  {
    // make the window's background opacity transparent.
    this.opacity = 0;
  }

  /**
   * Extends {@link #update}.<br/>
   * Manages visibility of the quest frame.
   */
  update()
  {
    // perform original logic.
    super.update();

    // check if we can show this hud.
    if (!$hudManager.canShowHud())
    {
      // if we're not allowed to see the hud, then close it.
      if (!this.isClosed())
      {
        this.close();
      }

      // don't do anything else if the hud can't be shown.
      return;
    }
    else
    {
      // otherwise, open the hud.
      if (!this.isOpen())
      {
        this.open();
        this.refresh();
      }
    }

    // manage interference-based opacity.
    this.updateVisibility();
  }

  /**
   * Manages the visibility while the player is potentially interfering with it.
   */
  updateVisibility()
  {
    if (this.playerInterference())
    {
      // drastically reduce visibility of the this quest frame while the player is overlapped.
      this.handlePlayerInterference();
    }
    // otherwise, it must be regular visibility processing.
    else
    {
      // handle opacity based on the time remaining on the inactivity timer.
      this.handleNonInterferenceOpacity();
    }
  }

  /**
   * Determines whether or not the player is in the way (or near it) of this window.
   * @returns {boolean} True if the player is in the way, false otherwise.
   */
  playerInterference()
  {
    const playerX = $gamePlayer.screenX();
    const playerY = $gamePlayer.screenY();

    // the quest frame is in the upper left corner, thus the player only interferes
    // when they are literally between 0 and the width/height of the window.
    return (playerX < (this.width)) && (playerY < (this.height));
  }

  /**
   * Manages opacity for the window while the player is interfering with the visibility.
   */
  handlePlayerInterference()
  {
    // if we are above 64, rapidly decrement by -15 until we get below 64.
    if (this.contentsOpacity > 64)
    {
      this.contentsOpacity -= 15;
    }// if we are below 64, increment by +1 until we get to 64.
    else if (this.contentsOpacity < 64) this.contentsOpacity += 1;
  }

  /**
   * Reverts the opacity changes associated with the player getting in the way.
   */
  handleNonInterferenceOpacity()
  {
    // refresh the opacity so the frame can be seen again.
    this.contentsOpacity = 255;
  }

  /**
   * Draws the quests currently tracked in the window as an element of the HUD.
   */
  drawContent()
  {
    // don't draw the hud if it can't be shown.
    if (!$hudManager.canShowHud()) return;

    // we default to the upper left most point of the window for origin.
    const [ x, y ] = [ 0, 0 ];

    // draw the quests and their objective datas.
    this.drawQuests(x, y);
  }

  /**
   * Renders all {@link TrackedOmniQuest}s the player currently has set as "tracked".
   * @param {number} x The origin x.
   * @param {number} y The origin y.
   */
  drawQuests(x, y)
  {
    // grab the current quest.
    const quests = QuestManager.trackedQuests();

    // if there are no tracked quests, do not render them.
    if (quests.length === 0) return;

    // designate the lineheight once!
    const lh = this.lineHeight();

    // initialize the line counter, shared throughout the rendering of this window.
    let lineCount = 0;

    // render each quest with a global line count that keeps the Y in sync.
    // TODO: consider using a reducer?
    quests.forEach(quest =>
    {
      // the base y for this quest.
      const questY = y;

      // the base y for this quest.
      const questNameY = questY + (lh * lineCount);

      // render the quest name as the header of the quest frame for each quest.
      // TODO: if necessary, make this return how many lines rendered?
      this.drawQuestName(quest, x, questNameY);

      // and count the line.
      lineCount++;

      // grab all the active objectives.
      const drawableObjectives = quest.objectives.filter(objective => objective.isActive());

      // check if we ended up with no active objectives.
      if (drawableObjectives.length === 0)
      {
        // identify the specified line height for each successive quest .
        const nonObjectiveY = questY + (lh * lineCount);

        // render the non-objective.
        // TODO: if necessary, make this return how many lines rendered?
        this.drawNonObjective(quest, x, nonObjectiveY);

        // and count the line.
        lineCount++;

        // don't process the objectives.
        return;
      }

      // iterate over each objective to render it.
      drawableObjectives
        .forEach(objective =>
        {
          // identify the specified line height for each successive objective.
          const objectiveY = questY + (lh * lineCount);

          // render the objective.
          // TODO: if necessary, make this return how many lines rendered?
          this.drawObjective(objective, x, objectiveY);

          // and count the line.
          lineCount++;
        });
    }, this);
  }

  /**
   * Renders the name of the quest being tracked.
   * @param {TrackedOmniQuest} quest The quest being tracked.
   * @param {number} x The origin x.
   * @param {number} y The origin y.
   */
  drawQuestName(quest, x, y)
  {
    // if the quest isn't known, it should be masked.
    const possiblyMaskedName = quest.isKnown()
      ? quest.name()
      : J.BASE.Helpers.maskString(quest.name());

    // the quest name itself looks a bit better when its a bit smaller than the base size and bold.
    const questNameSized = this.modFontSizeForText(-4, possiblyMaskedName);
    const questName = this.boldenText(questNameSized);

    // render the emboldened text of the quest name.
    const questNameWidth = this.textWidth(questName);
    this.drawTextEx(questName, x, y, questNameWidth);
  }

  /**
   * Renders in-place of objectives the appropriate "you're not currently on any active objective for this quest" text,
   *
   * This situation is kind of an exceptional situation for a player to likely want to track a quest for, and should be
   * called out as a thing to discourage the player from keeping tracked.
   * @param {TrackedOmniQuest} quest The quest to render for the non-objective situation.
   * @param {number} x The origin x.
   * @param {number} y The origin y.
   */
  drawNonObjective(quest, x, y)
  {
    // determine the suspected reason for which there are no active objectives.
    let noObjectivesText;
    switch (true)
    {
      case quest.isCompleted():
        noObjectivesText = `✅ Quest is complete.`;
        break;
      case quest.isFailed():
        noObjectivesText = `❌ Quest is failed.`;
        break;
      case quest.isMissed():
        noObjectivesText = `❓ Quest is missed.`;
        break;
      default:
        const secretObjective = quest.objectives.find(objective => !objective.isHidden());
        noObjectivesText = secretObjective
          ? secretObjective.fulfillmentText()
          : `🍈 Quest is in a state with no known objectives active.`;
        break;
    }

    // render the line and count it.
    const text = this.modFontSizeForText(-8, noObjectivesText);
    const nonObjectiveX = x + 10;
    const objectiveTextWidth = this.textWidth(text);
    this.drawTextEx(text, nonObjectiveX, y, objectiveTextWidth);
  }

  /**
   * Renders the fulfillment text for the given objective.
   * @param {TrackedOmniObjective} objective The objective to render.
   * @param {number} x The origin x.
   * @param {number} y The origin y.
   */
  drawObjective(objective, x, y)
  {
    // the fulfillment text may be longer, so render it a bit smaller.
    const objectiveText = this.modFontSizeForText(-8, objective.fulfillmentText());

    // render the text a bit indented to the right.
    const objectiveX = x + 10;
    const objectiveTextWidth = this.textWidth(objectiveText);
    this.drawTextEx(objectiveText, objectiveX, y, objectiveTextWidth);
  }

  /**
   * Overrides {@link lineHeight}.<br/>
   * This window's default lineheight will be 10 less than the default.
   * @returns {number}
   */
  lineHeight()
  {
    return super.lineHeight() - 10;
  }
}

//endregion Window_QuestFrame