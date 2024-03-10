//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 HUD-INPUT] A HUD frame that displays your leader's buttons data.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @base J-Base
 * @base J-HUD
 * @orderAfter J-ABS
 * @orderAfter J-Base
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin is an extension of the J-HUD system.
 *
 * This is the Input Frame, which displays the various action keys and their
 * corresponding cooldown and cost data points for the leader of the party.
 *
 * This includes the following data points for the currently selected leader:
 * - main and offhand action keys
 * - tool and dodge action keys
 * - ability keys (L1 + A/B/X/Y) action keys
 * - ability costs for all action keys, or item count remaining for tool.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.2';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

//region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.HUD.EXT.INPUT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT.INPUT = {};
J.HUD.EXT.INPUT.Metadata = {};
J.HUD.EXT.INPUT.Metadata.Version = '1.0.0';
J.HUD.EXT.INPUT.Metadata.Name = `J-HUD-InputFrame`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD.EXT.INPUT.PluginParameters = PluginManager.parameters(J.HUD.EXT.INPUT.Metadata.Name);

J.HUD.EXT.INPUT.Metadata.InputFrameX = Number(J.HUD.EXT.INPUT.PluginParameters['inputFrameX']);
J.HUD.EXT.INPUT.Metadata.InputFrameY = Number(J.HUD.EXT.INPUT.PluginParameters['inputFrameY']);
J.HUD.EXT.INPUT.Metadata.UseGamepadLayout = false;

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT.INPUT.Aliased = {
  Scene_Map: new Map(),
};
//endregion metadata
//endregion introduction

//region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('initHudMembers', Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('initHudMembers').call(this);

  /**
   * The input frame window on the map.
   * @type {Window_InputFrame}
   */
  this._j._hud._inputFrame = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the target frame.
  this.createInputFrameWindow();
};

//region input frame
/**
 * Creates the input frame window and adds it to tracking.
 */
Scene_Map.prototype.createInputFrameWindow = function()
{
  // create the window.
  const window = this.buildInputFrameWindow();

  // update the tracker with the new window.
  this.setInputFrameWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the input frame window.
 * @returns {Window_InputFrame}
 */
Scene_Map.prototype.buildInputFrameWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.inputFrameWindowRect();

  // create the window with the rectangle.
  const window = new Window_InputFrame(rectangle);

  // return the built and configured window.
  return window;
}

/**
 * Creates the rectangle representing the window for the input frame.
 * @returns {Rectangle}
 */
Scene_Map.prototype.inputFrameWindowRect = function()
{
  // if using the keyboard layout, apply a modifier against the width.
  const usingKeyboardWidthModifier = J.HUD.EXT.INPUT.Metadata.UseGamepadLayout
    ? 0     // no bonus for gamepads.
    : 220;  // bonus width for all-in-one row.

  // define the width of the window.
  const width = 500 + usingKeyboardWidthModifier;

  // if using the keyboard layout, apply a modifier against the height.
  const usingKeyboardHeightModifier = J.HUD.EXT.INPUT.Metadata.UseGamepadLayout
    ? 0
    : -60;

  // define the height of the window.
  const height = 160 + usingKeyboardHeightModifier;

  // define the origin x of the window.
  const x = Graphics.boxWidth - width;

  // define the origin y of the window.
  const y = Graphics.boxHeight - height;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked input frame window.
 * @returns {Window_InputFrame}
 */
Scene_Map.prototype.getInputFrameWindow = function()
{
  return this._j._hud._inputFrame;
}

/**
 * Set the currently tracked input frame window to the given window.
 * @param {Window_InputFrame} window The window to track.
 */
Scene_Map.prototype.setInputFrameWindow = function(window)
{
  this._j._hud._inputFrame = window;
}
//endregion input frame

/**
 * Extend the update loop for the input frame.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages hud refreshes.
  this.handleInputFrameUpdate();
};

/**
 * Processes incoming requests regarding the input frame.
 */
Scene_Map.prototype.handleInputFrameUpdate = function()
{
  // handles incoming requests to refresh the input frame.
  this.handleRefreshInputFrame();

  // manage the visibility of the input frame.
  this.handleVisibilityInputFrame();
};

/**
 * Processes incoming requests regarding refreshing the input frame.
 */
Scene_Map.prototype.handleRefreshInputFrame = function()
{
  // handles incoming requests to refresh the input frame.
  if ($hudManager.hasRequestRefreshInputFrame())
  {
    // refresh the input frame.
    this.getInputFrameWindow().refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshInputFrame();
  }
};

/**
 * Processes incoming requests regarding the input frame.
 */
Scene_Map.prototype.handleVisibilityInputFrame = function()
{
  // grab the window itself.
  const inputFrameWindow = this.getInputFrameWindow();

  // handles incoming requests to refresh the input frame.
  if ($hudManager.canShowHud())
  {
    // hide the input frame.
    inputFrameWindow.show();
  }
  else
  {
    // show the input frame.
    inputFrameWindow.hide();
    inputFrameWindow.hideSprites();
  }
};

/**
 * Refreshes the hud on-command.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('refreshHud', Scene_Map.prototype.refreshHud);
Scene_Map.prototype.refreshHud = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('refreshHud').call(this);

  // grab the window.
  const inputFrameWindow = this.getInputFrameWindow();

  // refresh the input frame.
  inputFrameWindow.refreshCache();
  inputFrameWindow.refresh();
};
//endregion Scene_Map

//region Sprite_BaseSkillSlot
/**
 * A sprite that represents a skill slot.
 * This is a base class for other things that need data from a skill slot.
 */
class Sprite_BaseSkillSlot extends Sprite_BaseText
{
  /**
   * Extend initialization of the sprite to assign a skill slot for tracking.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track the name of.
   */
  initialize(skillSlot)
  {
    // perform original logic.
    super.initialize(String.empty);

    // sets the skill slot to trigger a refresh.
    this.setSkillSlot(skillSlot);
  }

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The skill slot associated with this sprite.
     * @type {JABS_SkillSlot|null}
     */
    this._j._skillSlot = null;
  }

  /**
   * Gets the skill slot associated with this sprite.
   * @returns {JABS_SkillSlot|null}
   */
  skillSlot()
  {
    return this._j._skillSlot;
  }

  /**
   * Gets whether or not there is a skill slot presently
   * assigned to this sprite.
   * @returns {boolean}
   */
  hasSkillSlot()
  {
    return !!this._j._skillSlot;
  }

  /**
   * Sets the skill slot for this sprite.
   * @param {JABS_SkillSlot} skillSlot The skill slot to assign.
   */
  setSkillSlot(skillSlot)
  {
    this._j._skillSlot = skillSlot;
    this.setText(this.skillName());
  }

  /**
   * Gets whether or not this slot is for an item instead of a skill.
   * @returns {boolean}
   */
  isItem()
  {
    return this.skillSlot().isItem();
  }

  /**
   * Get the cooldown data associated with the battler that owns
   * this skill slot.
   * @returns {JABS_Cooldown|null}
   */
  cooldownData()
  {
    // if we have no slot data, then we have no cooldown data.
    if (!this.hasSkillSlot()) return null;

    const jabsBattler = this.targetJabsBattler();

    if (!jabsBattler) return null;

    const inputType = this.skillSlot().key;

    // grab the cooldown data from the leader based on this slot.
    return jabsBattler.getCooldown(inputType);
  }

  /**
   * Gets the target `JABS_Battler` associated with this sprite.
   * @returns {JABS_Battler|null}
   */
  targetJabsBattler()
  {
    return $jabsEngine.getPlayer1();
  }

  /**
   * Gets the target `Game_Actor` or `Game_Enemy`
   * @returns {Game_Actor|Game_Enemy|null}
   */
  targetBattler()
  {
    const jabsBattler = this.targetJabsBattler();
    if (!jabsBattler) return null;

    return jabsBattler.getBattler();
  }

  /**
   * Gets the skill currently assigned to the skill slot.
   * @returns {RPG_Skill|null}
   */
  skill()
  {
    // if we do not have a skill slot, then the name is empty.
    if (!this.hasSkillSlot()) return null;

    // grab the cooldown data from the leader based on this slot.
    const cooldownData = this.cooldownData();

    // if we have no action key data for this slot, don't draw it.
    if (!cooldownData) return null;

    // grab the skill itself, either extended or not.
    return this.skillSlot().data(this.targetBattler(), this.skillId());
  }

  /**
   * Gets the skill (or item) id of the assigned ability of this skill slot.
   * Accommodates the possibility of
   * @returns {number}
   */
  skillId()
  {
    // the base id is of the skill slot's id.
    const skillId = this.skillSlot().id;

    // if it is an item, then the base skill id is the only id.
    if (this.skillSlot().isItem()) return skillId;

    // grab the cooldown data for this skill.
    const cooldownData = this.cooldownData();

    // if there is none, then return the default.
    if (!cooldownData) return skillId;

    // see if we should be grabbing the next combo skill, or this skill.
    const hasNextSkill = cooldownData.comboNextActionId > 0;
    const nextSkillId = hasNextSkill
      ? cooldownData.comboNextActionId  // return the next skill in the combo.
      : skillId;                        // return the current skill.

    return nextSkillId;
  }

  /**
   * Gets the skill name of the skill currently in the slot.
   * This accommodates the possibility of combos and skill extensions.
   * @returns {string} The name of the skill.
   */
  skillName()
  {
    // grab the skill itself, either extended or not.
    const skill = this.skill();

    // if no skill is in the slot, then the name is empty.
    if (!skill) return String.empty;

    // return the found name.
    return skill.name;
  }
}
//endregion Sprite_BaseSkillSlot

/**
 * A simple calculated gauge representing the current cooldown of an action.
 * While the skill is ready, this gauge is invisible.
 */
class Sprite_CooldownGauge extends Sprite
{
  constructor(cooldownData)
  {
    // perform original logic with no bitmap.
    super();

    // initialize with the cooldown data.
    this.initMembers();

    // initialize the bitmap for the gauge.
    this.createBitmap();

    // sets up this gauge with the cooldown data.
    this.setup(cooldownData);
  }

  //region properties
  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j = {
      /**
       * The cooldown data this gauge is associated with.
       * @type {JABS_Cooldown|null}
       */
      _cooldownData: null,

      /**
       * The current value of the gauge.
       * @type {number}
       */
      _valueCurrent: 0,

      /**
       * The maximum value of the gauge.
       * @type {number}
       */
      _valueMax: 0,
    };
  }

  /**
   * Gets whether or not this gauge has a max value currently.
   * @returns {boolean}
   */
  isMaxUnassigned()
  {
    return this._j._valueMax === 0;
  }

  /**
   * Gets the cooldown data associated with this gauge.
   * @returns {JABS_Cooldown}
   */
  cooldownData()
  {
    return this._j._cooldownData;
  }

  /**
   * Sets the cooldown data associated with this gauge.
   * @param {JABS_Cooldown} cooldownData The new cooldown data to set.
   */
  setCooldownData(cooldownData)
  {
    this._j._cooldownData = cooldownData;
  }

  /**
   * Gets the current value for this gauge.
   * @returns {number}
   */
  currentValue()
  {
    return this.cooldownData().frames;
  }

  /**
   * Gets the max value for this gauge.
   * @returns {number}
   */
  maxValue()
  {
    return this._j._valueMax;
  }

  /**
   * Sets the max value for this gauge.
   * @param {number} maxValue The max value to set.
   */
  setMaxValue(maxValue)
  {
    this._j._valueMax = maxValue;
  }

  /**
   * The width of the bitmap.
   */
  bitmapWidth()
  {
    return 32;
  }

  /**
   * The height of the bitmap.
   */
  bitmapHeight()
  {
    return 20;
  }

  /**
   * The height of this gauge.
   */
  gaugeHeight()
  {
    return 10;
  }

  /**
   * The color to gradient from.
   * Defaults to blue.
   * @returns {string}
   */
  gaugeColor1()
  {
    return "rgba(0, 0, 255, 1)";
  }

  /**
   * The color to gradient into.
   * Defaults to green.
   * @returns {string}
   */
  gaugeColor2()
  {
    return "rgba(0, 255, 0, 1)";
  }

  /**
   * The backdrop color.
   * Defaults to black with 50% opacity.
   * @returns {string}
   */
  gaugeBackColor()
  {
    return "rgba(0, 0, 0, 0.5)";
  }

  /**
   * The percent/decimal representing how full this gauge is currently is.
   * @returns {number} A number between 0 and 1.
   */
  gaugeRate()
  {
    // the rate is always zero if we don't have anything assigned.
    if (this.isMaxUnassigned()) return 0;

    const value = this.currentValue();
    const maxValue = this.maxValue();
    const rate = maxValue > 0
      ? value / maxValue
      : 0;

    const parsedRate = parseFloat(rate.toFixed(3));

    return parsedRate;
  }
  //endregion properties

  /**
   * Sets up the gauge based on the cooldown data.
   * @param {JABS_Cooldown} cooldownData The cooldown data for this gauge.
   */
  setup(cooldownData)
  {
    this.setCooldownData(cooldownData);
  }

  /**
   * Generates the bitmap for this gauge.
   */
  createBitmap()
  {
    this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
  }

  /**
   * Disables the gauge and makes it invisible.
   */
  disableGauge()
  {
    // zero the max value.
    this.setMaxValue(0);

    // make the sprite invisible.
    this.bitmap.paintOpacity = 0;
  }

  /**
   * Enables the gauge and sets the max value to whatever the cooldown dictates.
   * If the gauge was previously invisible, it will be made visible.
   */
  enableGauge()
  {
    // extract the frames from the cooldown data.
    const { frames } = this.cooldownData();

    // set the new max value.
    this.setMaxValue(frames);

    // make the sprite visible.
    this.bitmap.paintOpacity = 255;
  }

  /**
   * Extends {@link Sprite.update}.<br>
   * Also updates the drawing of this gauge.
   */
  update()
  {
    // perform original logic.
    super.update();

    // if we cannot update, do not try to draw the gauge.
    if (!this.canUpdate()) return;

    // handle readiness of the combo.
    this.handleActionReadiness();

    // draw the gauge.
    this.redraw();
  }

  /**
   * Whether or not this gauge can be updated.
   * @returns {boolean} True if this gauge can be updated, false otherwise.
   */
  canUpdate()
  {
    // if we do not have a current value, do not update.
    if (Number.isNaN(this.currentValue())) return false;

    return true;
  }

  /**
   * Handles the visibility of the gauge.
   */
  handleActionReadiness()
  {
    // grab the cooldown for this gauge.
    const cooldown = this.cooldownData();

    // check if the combo is ready and we have no max.
    if (cooldown.isComboReady() && this.isMaxUnassigned())
    {
      // enable the gauge with its values.
      this.enableGauge();
    }

    // check if the cooldown's base is ready.
    if (cooldown.isBaseReady())
    {
      // clear the gauge when the base is ready.
      this.disableGauge();
    }
  }

  /**
   * Clears the bitmap to redraw the gauge anew.
   */
  redraw()
  {
    // clear the rendering.
    this.bitmap.clear();

    // draw the gauge.
    this.drawGauge();
  }

  /**
   * Draws this gauge.
   */
  drawGauge()
  {
    // define the origin point of this gauge.
    const x = 0;
    const y = this.bitmapHeight() - this.gaugeHeight();

    // define the size of this gauge.
    const w = this.bitmapWidth() - x;
    const h = this.gaugeHeight();

    // draw the gauge with the given parameters.
    this.drawGaugeRect(x, y, w, h);
  }

  /**
   * Actually draws the gauge based on the given parameters.
   * @param {number} x The x of the origin for this gauge.
   * @param {number} y The y of the origin for this gauge.
   * @param {number} w The width of the gauge.
   * @param {number} h The height of this gauge.
   */
  drawGaugeRect(x, y, w, h)
  {
    // determine the percent/decimal amount of how filled the gauge is.
    const rate = this.gaugeRate();

    // calculate the width of the filled portion of the gauge lesser the borders.
    const fillW = Math.floor((w - 2) * rate);

    // calculate the height of the filled portion of the gauge lesser the borders.
    const fillH = h - 2;

    // render the backdrop of the gauge.
    this.bitmap.fillRect(x, y, w, h, this.gaugeBackColor());

    // calculate the bordered x,y coordinates.
    const [borderedX, borderedY] = [x + 1, y + 1];

    // render the filled portion of the gauge onto the bitmap.
    this.bitmap.gradientFillRect(
      borderedX,            // the x including borders.
      borderedY,            // the y including borders.
      fillW,                // the width to fill.
      fillH,                // the hieght to fill.
      this.gaugeColor1(),   // the color gradient to start with.
      this.gaugeColor2());  // the color gradient to end with.
  }
}

//region Sprite_CooldownTimer
/**
 * A sprite that displays a timer representing the cooldown time for a JABS action.
 */
function Sprite_CooldownTimer()
{
  this.initialize(...arguments);
}

Sprite_CooldownTimer.prototype = Object.create(Sprite.prototype);
Sprite_CooldownTimer.prototype.constructor = Sprite_CooldownTimer;
Sprite_CooldownTimer.prototype.initialize = function(skillType, cooldownData, isItem = false)
{
  Sprite.prototype.initialize.call(this);
  this.initMembers(skillType, cooldownData, isItem);
  this.loadBitmap();
}

/**
 * Initializes the properties associated with this sprite.
 * @param {string} skillType The slot that this skill maps to.
 * @param {object} cooldownData The cooldown data associated with this cooldown sprite.
 * @param {boolean} isItem Whether or not this cooldown timer is for an item.
 */
Sprite_CooldownTimer.prototype.initMembers = function(skillType, cooldownData, isItem)
{
  this._j = {};
  this._j._skillType = skillType;
  this._j._cooldownData = cooldownData;
  this._j._isItem = isItem;
}

/**
 * Loads the bitmap into the sprite.
 */
Sprite_CooldownTimer.prototype.loadBitmap = function()
{
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
  this.bitmap.fontFace = this.fontFace();
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.drawText(
    this._j._text,
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
}

Sprite_CooldownTimer.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  this.updateCooldownText();
}

Sprite_CooldownTimer.prototype.updateCooldownText = function()
{
  this.bitmap.clear();
  let baseCooldown = (this._j._cooldownData.frames / 60).toFixed(1);
  if (typeof baseCooldown === 'undefined')
  {
    baseCooldown = 0;
  }

  const cooldownBaseText = baseCooldown > 0
    ? baseCooldown
    : String.empty;
  const cooldownComboText = (cooldownBaseText > 0 && this._j._cooldownData.comboNextActionId !== 0)
    ? "COMBO!"
    : "❌";

  this.bitmap.drawText(
    cooldownBaseText,
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
  this.bitmap.fontSize = this.fontSize() - 8;
  this.bitmap.fontItalic = true;
  this.bitmap.drawText(
    cooldownComboText,
    0, this.fontSize(),
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.fontItalic = false;

}

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_CooldownTimer.prototype.bitmapWidth = function()
{
  return 40;
}

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_CooldownTimer.prototype.bitmapHeight = function()
{
  return this.fontSize() * 3;
}

/**
 * Determines the font size for text in this sprite.
 */
Sprite_CooldownTimer.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() - 10;
}

/**
 * determines the font face for text in this sprite.
 */
Sprite_CooldownTimer.prototype.fontFace = function()
{
  return $gameSystem.numberFontFace();
}
//endregion

//region Sprite_InputKeySlot
/**
 * A single sprite that owns the drawing and management of a single input key slot.
 */
class Sprite_InputKeySlot extends Sprite
{
  /**
   * Extend initialization of the sprite to assign a skill slot for tracking.
   * @param {JABS_SkillSlot|null} skillSlot The skill slot to track the name of.
   * @param {Game_Actor|Game_Enemy|null} battler The battler that owns this slot.
   */
  initialize(skillSlot = null, battler = null)
  {
    // perform original logic.
    super.initialize();

    // add our extra data points to track.
    this.initMembers();

    // setup this input key slot sprite.
    this.setup(skillSlot, battler);
  }

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * The skill slot associated with this sprite.
     * @type {JABS_SkillSlot|null}
     */
    this._j._skillSlot = null;

    /**
     * The battler associated with the skill slot.
     * Used for deriving skill costs and skill extensions.
     * @type {Game_Actor|Game_Enemy|null}
     */
    this._j._battler = null;

    /**
     * The cached collection of sprites.
     * @type {Map<string, Sprite_SkillSlotIcon|Sprite_SkillName|Sprite_SkillCost|Sprite_CooldownGauge>}
     */
    this._j._spriteCache = new Map();
  }

  /**
   * Sets up this sprite with the given skill slot and owning battler.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track.
   * @param {JABS_Battler} battler The battler owning the skill slot.
   */
  setup(skillSlot, battler)
  {
    // assign the given skill slot.
    this.setSkillSlot(skillSlot);

    // assign the given battler.
    this.setBattler(battler);

    // draw the sprite!
    this.drawInputKey();
  }

  //region getters & setters
  /**
   * Gets the assigned skill slot.
   * @returns {JABS_SkillSlot|null}
   */
  skillSlot()
  {
    return this._j._skillSlot;
  }

  /**
   * Checks whether or not there is a skill slot currently assigned.
   * @returns {boolean}
   */
  hasSkillSlot()
  {
    return !!this._j._skillSlot;
  }

  /**
   * Assigns the given skill slot to this sprite.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track.
   */
  setSkillSlot(skillSlot)
  {
    this._j._skillSlot = skillSlot;
  }

  /**
   * Get the cooldown data associated with the battler that owns
   * this skill slot.
   * @returns {JABS_Cooldown|null}
   */
  cooldownData()
  {
    // if we have no slot data, then we have no cooldown data.
    if (!this.hasSkillSlot()) return null;

    const jabsBattler = this.jabsBattler();

    if (!jabsBattler) return null;

    const inputType = this.skillSlot().key;

    // grab the cooldown data from the leader based on this slot.
    return jabsBattler.getCooldown(inputType);
  }

  /**
   * Gets the skill (or item) id of the assigned ability of this skill slot.
   * Accommodates the possibility of
   * @returns {number}
   */
  skillId()
  {
    // the base id is of the skill slot's id.
    const skillId = this.skillSlot().id;

    // if it is an item, then the base skill id is the only id.
    if (this.skillSlot().isItem()) return skillId;

    // grab the cooldown data for this skill.
    const cooldownData = this.cooldownData();

    // if there is none, then return the default.
    if (!cooldownData) return skillId;

    // see if we should be grabbing the next combo skill, or this skill.
    const hasNextSkill = cooldownData.comboNextActionId > 0;
    return hasNextSkill
      ? cooldownData.comboNextActionId  // return the next skill in the combo.
      : skillId;                        // return the current skill.
  }

  /**
   * Gets the `JABS_Battler` this input key slot is associated with.
   * @returns {JABS_Battler|null}
   */
  jabsBattler()
  {
    return this._j._battler;
  }

  /**
   * Gets the `Game_Battler` associated with the `JABS_Battler` assigned to this sprite.
   * @returns {Game_Actor|Game_Enemy}
   */
  battler()
  {
    return this.jabsBattler().getBattler();
  }

  /**
   * Checks whether or not there is a battler currently assigned.
   * @returns {boolean}
   */
  hasBattler()
  {
    return !!this._j._battler;
  }

  /**
   * Assigns the given battler to this sprite.
   * @param {JABS_Battler} battler The battler owning the skill slot.
   */
  setBattler(battler)
  {
    this._j._battler = battler;
  }
  //endregion getters & setters

  //region caching
  /**
   * Ensures all sprites are created and available for use.
   */
  createCache()
  {
    // with no leader, we have no inputs to make a cache.
    if (!$gameParty.leader()) return;

    // grab the leader and their battler for doing things.
    const leader = $gameParty.leader();
  }

  /**
   * Creates the key for the input key icon sprite based on the parameters.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyIconSpriteKey(skillSlot, inputType)
  {
    return `icon-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
  }

  /**
   * Creates an icon sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_Icon}
   */
  getOrCreateInputKeyIconSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeyIconSpriteKey(skillSlot, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillSlotIcon(0, skillSlot);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key ability cost sprite based on the parameters.
   * @param {number} amount The amount that is this cost.
   * @param {number} colorIndex The color index to draw this cost in.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyAbilityCostSpriteKey(amount, colorIndex, inputType)
  {
    return `cost-${this.battler().name()}-${this.battler().battlerId()}-${inputType}-${amount}-${colorIndex}`;
  }

  /**
   * Creates an ability cost sprite for the given input key and caches it.
   * @param {number} amount The amount that is this cost.
   * @param {number} colorIndex The color index to draw this cost in.
   * @param {JABS_Button} inputType The type of input for this key.
   * @param {number} itemId If this is an item, then the item id can be passed for tracking.
   * @returns {Sprite_SkillCost}
   */
  getOrCreateInputKeyAbilityCostSprite(amount, colorIndex, inputType, itemId = 0)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeyAbilityCostSpriteKey(amount, colorIndex, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillCost(amount, colorIndex, itemId);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key ability cost sprite based on the parameters.
   * @param {Sprite_SkillCost.Types} costType The type of cost for this key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySkillCostSpriteKey(costType, inputType)
  {
    return `skillcost-${this.battler().name()}-${this.battler().battlerId()}-${costType}-${inputType}`;
  }

  /**
   * Creates an skill cost sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The slot associated with this skill.
   * @param {Sprite_SkillCost.Types} costType The type of cost this sprite is.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_SkillCost}
   */
  getOrCreateInputKeySkillCostSprite(skillSlot, costType, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySkillCostSpriteKey(costType, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillCost(skillSlot, costType);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key cooldown timer sprite based on the parameters.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {JABS_Button} inputType The type of input for this key.
   * @param {boolean} isItem Whether or not this cooldown timer is for the item slot.
   * @returns {string}
   */
  makeInputKeyCooldowntTimerSpriteKey(cooldownData, inputType, isItem)
  {
    return `cooldown-${this.battler().name()}-${this.battler().battlerId()}-${inputType}-${isItem}`;
  }

  /**
   * Creates a cooldown timer sprite for the given input key and caches it.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {string} inputType The type of input for this key.
   * @returns {Sprite_CooldownTimer}
   */
  getOrCreateInputKeyCooldownTimerSprite(cooldownData, inputType)
  {
    // we always are working with items when assigning
    const isItem = inputType === JABS_Button.Tool;

    // determine the key for this sprite.
    const key = this.makeInputKeyCooldowntTimerSpriteKey(cooldownData, inputType, isItem);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_CooldownTimer(inputType, cooldownData, isItem);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key combo gauge sprite based on the parameters.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyComboGaugeSpriteKey(cooldownData, inputType)
  {
    return `combo-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
  }

  /**
   * Creates a combo gauge sprite for the given input key and caches it.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_CooldownGauge}
   */
  getOrCreateInputKeyComboGaugeSprite(cooldownData, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeyComboGaugeSpriteKey(cooldownData, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_CooldownGauge(cooldownData);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // configure the sprite per our unique needs.
    sprite.rotation = 270 * (Math.PI / 180);
    sprite.scale.x = 0.6;
    sprite.scale.y = 1.1;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key skill name sprite based on the parameters.
   * @param {string} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySkillNameSpriteKey(inputType)
  {
    return `skillname-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
  }

  /**
   * Creates a skill name sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The slot associated with this skill.
   * @param {string} inputType The type of input for this key.
   * @returns {Sprite_SkillName}
   */
  getOrCreateInputKeySkillNameSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySkillNameSpriteKey(inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillName(skillSlot)
      .setFontSize(12)
      .setAlignment(Sprite_BaseText.Alignments.Center);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for the input key skill name sprite based on the parameters.
   * @param {string} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySlotNameSpriteKey(inputType)
  {
    return `slotname-${this.battler().name()}-${this.battler().battlerId()}-${inputType}`;
  }

  /**
   * Creates a slot name sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The slot to create a name for.
   * @param {string} inputType The type of input for this key.
   * @returns {Sprite_BaseText}
   */
  getOrCreateInputKeySlotNameSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySlotNameSpriteKey(inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // push for uppercase for cleanliness.
    let labelText = inputType.toUpperCase();

    // check if this is a combat skill.
    if (skillSlot.isSecondarySlot())
    {
      // parse out the word "combat" from the input if it exists.
      labelText = labelText.replace("COMBAT", String.empty);
    }

    // create a new sprite.
    const sprite = new Sprite_BaseText(labelText)
      .setFontSize(12)
      .setAlignment(Sprite_BaseText.Alignments.Center)
      .setBold(true);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }
  //endregion caching

  //region drawing
  /**
   * Draws the input key sprite based on the currently assigned data.
   */
  drawInputKey()
  {
    // if we cannot draw, do not.
    if (!this.canDrawInputKey()) return;

    // our origin is 0:0.
    const x = 0;
    const y = 0;

    // draw skill icon.
    this.drawInputKeySkillIcon(x, y);

    if (!this.skillSlot().isItem())
    {
      this.drawInputKeyHpCost(x, y);
      this.drawInputKeyMpCost(x, y);
      this.drawInputKeyTpCost(x, y);
    }
    // if this is a tool, then draw the item cost.
    else
    {
      this.drawInputKeyItemCost(x, y);
    }

    // draw skill combo gauge and cooldown timer.
    this.drawInputKeyComboGauge(x, y);
    this.drawInputKeyCooldownTimer(x, y);

    // draw skill name.
    this.drawInputKeySkillName(x, y);

    // draw the slot name.
    this.drawInputKeySlotName(x, y);
  }

  /**
   * Checks whether or not this input key has the necessary data in order
   * to draw the sprite.
   * @returns {boolean}
   */
  canDrawInputKey()
  {
    // we require a skill slot to draw the skill slot data.
    if (!this.hasSkillSlot()) return false;

    // we require a battler to draw the battler's skill slot data.
    if (!this.hasBattler()) return false;

    // we require a skill in the slot to draw the skill slot data.
    if (!this.skillId()) return false;

    // let's draw!
    return true;
  }

  /**
   * Draws the input key's associated skill icon.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeySkillIcon(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeyIconSprite(skillSlot, inputType);
    sprite.show();
    sprite.move(x+6, y+20);
  }

  /**
   * Draws the input key's associated mp cost.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyHpCost(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.HP,
      inputType);
    sprite.show();
    sprite.move(x-2, y-10);
  }

  /**
   * Draws the input key's associated mp cost.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyMpCost(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.MP,
      inputType);
    sprite.show();
    sprite.move(x-2, y);
  }

  /**
   * Draws the input key's associated tp cost.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyTpCost(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.TP,
      inputType);
    sprite.show();
    sprite.move(x-2, y+10);
  }

  /**
   * Draws the input key's associated item cost.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyItemCost(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.Item,
      inputType);
    sprite.show();
    sprite.move(x+36, y+10);
  }

  /**
   * Draws the input key's associated combo gauge.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyComboGauge(x, y)
  {
    // grab data for building the sprite.
    const cooldownData = this.cooldownData();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeyComboGaugeSprite(cooldownData, inputType);
    sprite.show();
    sprite.move(x+32, y+32);
  }

  /**
   * Draws the input key's associated cooldown data in text.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyCooldownTimer(x, y)
  {
    // grab data for building the sprite.
    const cooldownData = this.cooldownData();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeyCooldownTimerSprite(cooldownData, inputType);
    sprite.show();
    sprite.move(x+28, y+16);
  }

  /**
   * Draws the input key's skill's name.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeySkillName(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillNameSprite(skillSlot, inputType);
    sprite.show();
    sprite.move(x, y+36);
  }

  drawInputKeySlotName(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySlotNameSprite(skillSlot, inputType);
    sprite.show();
    sprite.move(x, y+48);
  }
  //endregion drawing
}
//endregion Sprite_InputKeySlot

//region Sprite_SkillCost
/**
 * A sprite that represents a skill slot's assigned skill's mp cost.
 */
class Sprite_SkillCost extends Sprite_BaseSkillSlot
{
  /**
   * The supported types of skill costs for this sprite.
   */
  static Types = {
    HP: "hp",
    MP: "mp",
    TP: "tp",
    Item: "item"
  };

  /**
   * Extend initialization of the sprite to assign a skill slot for tracking.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track the name of.
   * @param {Sprite_SkillCost.Types} skillCostType The skillcost type for this sprite.
   */
  initialize(skillSlot, skillCostType)
  {
    // perform original logic.
    super.initialize(skillSlot);

    // assign the skill cost type to this sprite.
    this.setSkillCostType(skillCostType);

    // empty the cost.
    this.synchronizeCost();
  }

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The skill cost type.
     * @type {Sprite_SkillCost.Types}
     */
    this._j._skillCostType = Sprite_SkillCost.Types.MP;
  }

  /**
   * Gets the skill cost type of this sprite.
   * @returns {Sprite_SkillCost.Types}
   */
  skillCostType()
  {
    return this._j._skillCostType;
  }

  /**
   * Gets the skill cost of this sprite.
   * @returns {number}
   */
  skillCost()
  {
    return this.skillCostByType();
  }

  /**
   * Calculates the skill cost accordingly to the type of this sprite.
   * @returns {number}
   */
  skillCostByType()
  {
    const leader = $gameParty.leader();
    if (!leader) return 0;

    const ability = this.skillSlot().data(leader);
    if (!ability) return 0;

    switch (this.skillCostType())
    {
      case Sprite_SkillCost.Types.HP:
        // TODO: implement HP costs.
        return 0;
      case Sprite_SkillCost.Types.MP:
        return ability.mpCost * leader.mcr;
      case Sprite_SkillCost.Types.TP:
        return ability.tpCost * leader.tcr;
      case Sprite_SkillCost.Types.Item:
        return $gameParty.numItems(ability);
    }
  }

  /**
   * Sets the skill cost type for this sprite.
   * @param {Sprite_SkillCost.Types} skillCostType The skill type to assign to this sprite.
   */
  setSkillCostType(skillCostType)
  {
    if (this.skillCostType() !== skillCostType)
    {
      this._j._skillCostType = skillCostType;
      this.refresh();
    }
  }

  /**
   * OVERWRITE Gets the color of the text for this sprite based on the
   * type of skill cost for this sprite, instead of the assigned color.
   * @returns {string}
   */
  color()
  {
    return this.colorBySkillCostType();
  }

  /**
   * Gets the hex color based on the type of skill cost this is.
   * @returns {string}
   */
  colorBySkillCostType()
  {
    switch (this.skillCostType())
    {
      case Sprite_SkillCost.Types.HP:
        return "#ff0000";
      case Sprite_SkillCost.Types.MP:
        return "#0077ff";
      case Sprite_SkillCost.Types.TP:
        return "#33ff33";
      default:
        return "#ffffff";
    }
  }

  /**
   * OVERWRITE Gets the font size for this sprite's text.
   * Skill costs are hard-coded to be a fixed size, 12.
   * @returns {number}
   */
  fontSize()
  {
    return 12;
  }

  /**
   * Extends the `update()` to also synchronize the text to
   * match the skill slot it is
   */
  update()
  {
    // perform original logic.
    super.update();

    // check if we need to synchronize a new cost.
    if (this.needsSynchronization())
    {
      // sync the cost.
      this.synchronizeCost();
    }
  }

  /**
   * Checks whether or not this slot is in need of cost synchronization.
   * @returns {boolean}
   */
  needsSynchronization()
  {
    // if the slot is empty, then do not.
    const skillslot = this.skillSlot();
    if (!skillslot) return false;

    // if the slot doesn't require synchronization, then do not.
    if (!skillslot.needsVisualCostRefreshByType(this.skillCostType())) return false;

    // the slot needs synchronization!
    return true;
  }

  /**
   * Synchronizes the text with the underlying skill inside the
   * tracked skill slot. This allows dynamic updating when the slot
   * changes skill due to combos and such.
   */
  synchronizeCost()
  {
    // get the cost of the assigned skill as an integer.
    let skillCost = this.skillCost().toFixed(0);

    // check if the icon index for this icon is up to date.
    if (this.text() !== skillCost)
    {
      // check if the skill cost is actually 0.
      if (skillCost === "0")
      {
        // replace 0 with an empty string instead.
        skillCost = String.empty;
      }

      // if it isn't, update it.
      this.setText(skillCost);
    }

    // acknowledge the refresh.
    this.skillSlot().acknowledgeCostRefreshByType(this.skillCostType());
  }
}
//endregion Sprite_SkillCost

//region Sprite_SkillName
/**
 * A sprite that represents a skill slot's assigned skill's name.
 */
class Sprite_SkillName extends Sprite_BaseSkillSlot
{
  /**
   * Extends the `update()` to also synchronize the text to
   * match the skill slot it is
   */
  update()
  {
    // perform original logic.
    super.update();

    // check if this slot needs name synchronization.
    if (this.needsSynchronization())
    {
      // sync the text.
      this.synchronizeText();
    }
  }

  /**
   * Checks whether or not this slot is in need of name synchronization.
   * @returns {boolean}
   */
  needsSynchronization()
  {
    return (this.hasSkillSlot() && this.skillSlot().needsVisualNameRefresh());
  }

  /**
   * Synchronizes the text with the underlying skill inside the
   * tracked skill slot. This allows dynamic updating when the slot
   * changes skill due to combos and such.
   */
  synchronizeText()
  {
    // check if the icon index for this icon is up to date.
    if (this.text() !== this.skillName())
    {
      // if it isn't, update it.
      this.setText(this.skillName());
    }

    // acknowledge the refresh.
    this.skillSlot().acknowledgeNameRefresh();
  }
}
//endregion Sprite_SkillName

//region Sprite_SkillSlotIcon
/**
 * A sprite that displays the icon represented by the assigned skill slot.
 */
class Sprite_SkillSlotIcon extends Sprite_Icon
{
  /**
   * Initializes this sprite with the designated icon.
   * @param {number} iconIndex The icon index of the icon for this sprite.
   * @param {JABS_SkillSlot} skillSlot The skill slot to monitor.
   */
  initialize(iconIndex = 0, skillSlot = null)
  {
    // perform original logic.
    super.initialize(iconIndex);

    // assign the skill slot to this sprite.
    this.setSkillSlot(skillSlot);
  }

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The skill slot that this sprite is watching.
     * @type {JABS_SkillSlot|null}
     */
    this._j._skillSlot = null;
  }

  /**
   * Sets the skill slot for this sprite's icon.
   * @param {JABS_SkillSlot} skillSlot The skill slot being assigned.
   */
  setSkillSlot(skillSlot)
  {
    this._j._skillSlot = skillSlot;
  }

  /**
   * Gets whether or not there is a skill slot currently being tracked.
   * @returns {boolean}
   */
  hasSkillSlot()
  {
    return !!this._j._skillSlot;
  }

  /**
   * Gets the skill slot currently assigned to this sprite.
   * @returns {JABS_SkillSlot|null}
   */
  skillSlot()
  {
    return this._j._skillSlot;
  }

  /**
   * Gets the icon associated with the tracked skill slot.
   * @returns {number}
   */
  skillSlotIcon()
  {
    // if there is no skill slot, return whatever is currently there.
    if (!this.hasSkillSlot()) return this._j._iconIndex;

    // if there is no leader, do not try to translate the slot into an icon.
    if (!$gameParty.leader()) return this._j._iconIndex;

    // if we are leveraging skill extensions, then grab the appropriate skill.
    const skill = this.skillSlot().data($gameParty.leader());

    // if nothing was in the slot, then don't draw it.
    if (!skill) return 0;

    // return the skill's icon index.
    return skill.iconIndex;
  }

  /**
   * The `JABS_Button` key that this skill slot belongs to.
   * @returns {string}
   */
  skillSlotKey()
  {
    return this._j._skillSlot.key;
  }

  /**
   * Extends the `update()` to monitor the icon index in case it changes.
   */
  update()
  {
    // perform original logic.
    super.update();

    // check if this slot needs icon synchronization.
    if (this.needsSynchronization())
    {
      // keep the icon index in-sync with the skill slot.
      this.synchronizeIconIndex();
    }
  }

  /**
   * Checks whether or not this slot is in need of name synchronization.
   * @returns {boolean}
   */
  needsSynchronization()
  {
    return (this.hasSkillSlot() && this.skillSlot().needsVisualIconRefresh());
  }

  /**
   * Synchronize the icon index for this skill slot.
   * Updates it if necessary.
   */
  synchronizeIconIndex()
  {
    // check if the icon index for this icon is up to date.
    if (this.iconIndex() !== this.skillSlotIcon())
    {
      // if it isn't, update it.
      this.setIconIndex(this.skillSlotIcon());
    }

    // acknowledge the refresh.
    this.skillSlot().acknowledgeIconRefresh();
  }

  /**
   * Upon becoming ready, execute this logic.
   * In this sprite's case, we render ourselves.
   * @param {number} iconIndex The icon index of this sprite.
   */
  onReady(iconIndex = 0)
  {
    // perform original logic.
    super.onReady(iconIndex);

    // only perform this logic if we have a skill slot.
    if (this.hasSkillSlot())
    {
      // set the icon index to be whatever the skill slot's icon is.
      this.setIconIndex(this.skillSlotIcon());
    }
  }
}
//endregion Sprite_SkillIcon

//region Window_InputFrame
/**
 * A window displaying available skills and button inputs.
 */
class Window_InputFrame extends Window_Frame
{
  /**
   * Constructor.
   * @param {Rectangle} rect The shape of this window.
   */
  constructor(rect) 
  {
    super(rect); 
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The battler of which to track inputs for.
     * @type {Game_Actor}
     */
    this._j._battler = null;

    /**
     * Whether or not the window needs a refresh internally.
     * This is toggled after all draws are executed and tracked to
     * prevent unnecessary redraws.
     * @type {boolean}
     */
    this._j._needsRefresh = true;
  }

  /**
   * Executes any one-time configuration required for this window.
   */
  configure()
  {
    // perform original logic.
    super.configure();

    // remove opacity for completely transparent window.
    this.opacity = 0;
  }

  /**
   * Requests this window to clear and redraw its contents.
   */
  requestInternalRefresh()
  {
    this._j._needsRefresh = true;
  }

  /**
   * Gets whether or not this window needs refresh.
   * @returns {boolean}
   */
  needsInternalRefresh()
  {
    return this._j._needsRefresh;
  }

  /**
   * Flags internally this window for successfully refreshing text.
   */
  acknowledgeInternalRefresh()
  {
    this._j._needsRefresh = false;
  }

  //region caching
  /**
   * Ensures all sprites are created and available for use.
   */
  createCache()
  {
    // perform original logic.
    super.createCache();
  }

  /**
   * Creates the key for the input key icon sprite based on the parameters.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySlotSpriteKey(skillSlot, inputType)
  {
    return `inputkey-${$gameParty.leader().actorId()}-${inputType}`;
  }

  /**
   * Creates the input key sprite for the given slot.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_InputKeySlot}
   */
  getOrCreateInputKeySlotSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySlotSpriteKey(skillSlot, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_InputKeySlot(
      skillSlot,
      $jabsEngine.getPlayer1());

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }
  //endregion caching

  /**
   * Refreshes the contents of this window.
   */
  refresh()
  {
    // clear out the window contents.
    this.contents.clear();

    // rebuilds the contents of the window.
    this.requestInternalRefresh();
  }

  /**
   * Hide all sprites for the hud.
   */
  hideSprites()
  {
    // hide all the sprites.
    this._j._spriteCache.forEach((sprite, _) => sprite.hide());

    this.requestInternalRefresh();
  }

  /**
   * Updates the logic for this window frame.
   */
  updateFrame()
  {
    // perform original logic.
    super.updateFrame();

    // handle the visibility of the hud for dynamic interferences.
    this.manageVisibility();

    // draw the contents.
    this.drawInputFrame();
  }

  //region visibility
  /**
   * Manages visibility for the hud.
   */
  manageVisibility()
  {
    // handle interference from the message window popping up.
    this.handleMessageWindowInterference();

    // check if the player is interfering with visibility.
    if (this.playerInterference())
    {
      // if so, adjust opacity accordingly.
      this.handlePlayerInterference();
    }
    // the player isn't interfering.
    else
    {
      // undo the opacity changes.
      this.revertInterferenceOpacity();
    }
  }

  /**
   * Close and open the window based on whether or not the message window is up.
   */
  handleMessageWindowInterference()
  {
    // check if the message window is up.
    if ($gameMessage.isBusy() || $gameMap.isEventRunning())
    {
      // check to make sure we haven't closed this window yet.
      if (!this.isClosed())
      {
        // hide all the sprites.
        this.hideSprites();

        // and close the window.
        this.close();
      }
    }
    // otherwise, the message window isn't there.
    else
    {
      // just open the window.
      this.open();
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
    return (playerX < this.width+100) && (playerY < this.height+100);
  }

  /**
   * Manages opacity for all sprites while the player is interfering with the visibility.
   */
  handlePlayerInterference()
  {
    this._j._spriteCache.forEach((sprite, _) =>
    {
      // if we are above 64, rapidly decrement by -15 until we get below 64.
      if (sprite.opacity > 64) sprite.opacity -= 15;
      // if we are below 64, increment by +1 until we get to 64.
      else if (sprite.opacity < 64) sprite.opacity += 1;
    });
  }

  /**
   * Reverts the opacity changes associated with the player getting in the way.
   */
  revertInterferenceOpacity()
  {
    this._j._spriteCache.forEach((sprite, _) =>
    {
      // if we are below 255, rapidly increment by +15 until we get to 255.
      if (sprite.opacity < 255) sprite.opacity += 15;
      // if we are above 255, set to 255.
      else if (sprite.opacity > 255) sprite.opacity = 255;
    });
  }
  //endregion visibility

  /**
   * The rough estimate of width for a single input key and all its subsprites.
   * @returns {number}
   */
  inputKeyWidth()
  {
    return 72;
  }

  inputKeyHeight()
  {
    return 96;
  }

  /**
   * Draws the input frame window in its entirety.
   */
  drawInputFrame()
  {
    // don't draw if we don't need to draw.
    if (!this.canDrawInputFrame()) return;

    // wipe the drawn contents.
    this.contents.clear();

    // hide all the sprites.
    this._j._spriteCache.forEach((sprite =>
    {
      sprite.hide();
      sprite.drawInputKey();
    }));

    if (J.HUD.EXT.INPUT.Metadata.UseGamepadLayout)
    {
      // draw the inputs.
      this.drawGamepadStyleInputKeys();
    }
    else
    {
      // draw the inputs.
      this.drawKeyboardStyleInputKeys();
    }

    // flags that this has been refreshed.
    this.acknowledgeInternalRefresh();
  }

  /**
   * Determines whether or not we can draw the input frame.
   * @returns {boolean} True if we can, false otherwise.
   */
  canDrawInputFrame()
  {
    // if the leader is not present or available, we cannot draw.
    if (!$gameParty.leader()) return false;

    // if we cannot draw the hud, we cannot draw.
    if (!$hudManager.canShowHud()) return false;

    // if we don't need to draw it, we cannot draw.
    if (!this.needsInternalRefresh()) return false;

    // draw it!
    return true;
  }

  /**
   * Draws the inputs to be more console-style with a gamepad layout.
   */
  drawGamepadStyleInputKeys()
  {
    // our origin x:y coordinates.
    const x = 0;
    const y = 0;

    // draw the primary section of our input.
    this.drawGamepadPrimaryInputKeys(x, y);

    // draw the secondary section of our input.
    this.drawGamepadSecondaryInputKeys(x+250, y);
  }

  /**
   * Draws the inputs to be more PC-style with a keyboard layout.
   */
  drawKeyboardStyleInputKeys()
  {
    // our origin x:y coordinates.
    const ikw = this.inputKeyWidth();
    const x = 0;
    const y = 0;

    // draw the primary section of our input.
    this.drawKeyboardPrimaryInputKeys(x, y);

    // draw the secondary section of our input.
    const keyboardSecondaryX = x + (ikw*4) + 24;
    this.drawKeyboardSecondaryInputKeys(keyboardSecondaryX, y);
  }

  /**
   * Draws the primary set of input keys.
   * This includes: mainhand, offhand, dodge, and tool input keys.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawGamepadPrimaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the four basic core functions of JABS.
    this.drawInputKey(JABS_Button.Mainhand, baseX+ikw*0, baseY+32);
    this.drawInputKey(JABS_Button.Offhand, baseX+(ikw*1), baseY+32);
    this.drawInputKey(JABS_Button.Dodge, baseX+(ikw*2), baseY+64);
    this.drawInputKey(JABS_Button.Tool, baseX+(ikw*2), baseY);
  }

  /**
   * Draws the primary set of input keys.
   * This includes: all L1 and R1 combo inputs.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawGamepadSecondaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the combat skills equipped for JABS.
    this.drawInputKey(JABS_Button.CombatSkill3, baseX+ikw*0, baseY+32);
    this.drawInputKey(JABS_Button.CombatSkill4, baseX+(ikw*1), baseY);
    this.drawInputKey(JABS_Button.CombatSkill1, baseX+(ikw*1), baseY+64);
    this.drawInputKey(JABS_Button.CombatSkill2, baseX+(ikw*2), baseY+32);
  }

  drawKeyboardPrimaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the four basic core functions of JABS.
    this.drawInputKey(JABS_Button.Mainhand, baseX + ikw*0, baseY);
    this.drawInputKey(JABS_Button.Offhand, baseX + ikw*1, baseY);
    this.drawInputKey(JABS_Button.Dodge, baseX + ikw*2, baseY);
    this.drawInputKey(JABS_Button.Tool, baseX + ikw*3, baseY);
  }

  drawKeyboardSecondaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the combat skills equipped for JABS.
    this.drawInputKey(JABS_Button.CombatSkill1, baseX + ikw*0, baseY);
    this.drawInputKey(JABS_Button.CombatSkill2, baseX + ikw*1, baseY);
    this.drawInputKey(JABS_Button.CombatSkill3, baseX + ikw*2, baseY);
    this.drawInputKey(JABS_Button.CombatSkill4, baseX + ikw*3, baseY);
  }

  /**
   * Draws a single input key of the input frame.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKey(inputType, x, y)
  {
    // shorthand the player's JABS battler data.
    const jabsPlayer = $jabsEngine.getPlayer1();

    // grab the cooldown data and the skillslot data from the leader based on the slot.
    const actionKeyData = jabsPlayer.getActionKeyData(inputType);

    // if we have no action key data for this slot, don't draw it.
    if (!actionKeyData) return;

    // extract the input key's data.
    const skillSlot =  actionKeyData.skillslot;

    // draw the input key slot's sprite.
    this.drawInputKeySlotSprite(skillSlot, inputType, x, y);
  }

  /**
   * Draw the input key associated with a given skill slot.
   * @param {JABS_SkillSlot} skillSlot The skill slot to draw.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeySlotSprite(skillSlot, inputType, x, y)
  {
    const sprite = this.getOrCreateInputKeySlotSprite(skillSlot, inputType);

    if (!skillSlot.isEmpty())
    {
      const width = this.inputKeyWidth() - 10;
      const height = this.inputKeyHeight();
      const c1 = ColorManager.itemBackColor1();
      const c2 = ColorManager.itemBackColor2();
      this.contents.gradientFillRect(x-10, y+20, width, height, c1, c2, true);
    }

    sprite.show();
    sprite.move(x+6, y+20);
  }
}
//endregion Window_InputFrame