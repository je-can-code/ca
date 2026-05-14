//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.2 HUD-INPUT] A HUD frame that displays your leader's buttons data.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-HUD
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of the J-HUD system.
 *
 * This is the Input Frame, which displays the various action keys and their
 * corresponding cooldown and cost data points for the leader of the party.
 *
 * This plugin requires JABS.
 * This plugin requires the base HUD.
 * This plugin has no additional configuration required.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This includes the following data points for the currently selected leader:
 * - mainhand, offhand, tool, and dodge/sprint action keys.
 * - while holding the skill trigger, skill keys show instead.
 * - ability costs for all keys, or item count remaining for tool.
 * ============================================================================
 * CHANGELOG
 * ----------------------------------------------------------------------------
 * - 1.1.2
 *    Combo cooldown gauge merges J-ABS global cooldown (GCD) for GCD-subject
 *    skill slots (not tool/dodge).
 * - 1.1.1
 *    Wired HP skill cost into Sprite_SkillCost for display on action slots
 *    (requires J-Resources).
 * - 1.1.0
 *    Changed input to reflect a switch-view diamond in the center.
 *    Retroactively added this changelog.
 * - 1.0.0
 *    Initial release.
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
  const requiredBaseVersion = '2.3.1';
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
J.HUD.EXT.INPUT.Metadata.Version = '1.1.2';
J.HUD.EXT.INPUT.Metadata.Name = `J-HUD-InputFrame`;

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
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('initHudMembers')
    .call(this);

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
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('createAllWindows')
    .call(this);

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
};

/**
 * Creates the rectangle representing the window for the input frame.
 * @returns {Rectangle}
 */
Scene_Map.prototype.inputFrameWindowRect = function()
{
  // Match Window_InputFrame’s key geometry.
  const ikw = 72;
  const ikh = 72;

  // Use the same diamond gap as the window, for perfect alignment.
  const bodyGap = Window_InputFrame.DiamondGap;

  // Visual span.
  const diamondBodyWidth = (3 * ikw) + (2 * bodyGap);
  const diamondBodyHeight = (2 * ikh) + bodyGap;

  // Reserve horizontal space for the labels (“Actions” left, “Skills” right).
  const labelReserveEachSide = 48;

  // Add small margins to avoid clipping gradients/labels.
  const marginX = 24;
  const marginY = 24;

  // Final window size: body span + label reserves + visual margins.
  const width = Math.ceil(diamondBodyWidth + (labelReserveEachSide * 2) + marginX);
  const height = Math.ceil(diamondBodyHeight + marginY);

  // Center horizontally; anchor bottom.
  const x = Math.floor((Graphics.boxWidth - width) / 2);
  const y = Graphics.boxHeight - height;

  // Build and return the rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked input frame window.
 * @returns {Window_InputFrame}
 */
Scene_Map.prototype.getInputFrameWindow = function()
{
  return this._j._hud._inputFrame;
};

/**
 * Set the currently tracked input frame window to the given window.
 * @param {Window_InputFrame} window The window to track.
 */
Scene_Map.prototype.setInputFrameWindow = function(window)
{
  this._j._hud._inputFrame = window;
};
//endregion input frame

/**
 * Extend the update loop for the input frame.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('updateHudFrames')
    .call(this);

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
    this.getInputFrameWindow()
      .refresh();

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
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('refreshHud')
    .call(this);

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
class Sprite_BaseSkillSlot
  extends Sprite_BaseText
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
    return this.skillSlot()
      .isItem();
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
    return this.skillSlot()
      .data(this.targetBattler(), this.skillId());
  }

  /**
   * Gets the effective skill (or item) id for this slot, accounting for active skill transforms
   * and any queued combo follow-up.
   *
   * Resolution order:
   *  1. Item slots return the raw item id unchanged — transforms do not apply to items.
   *  2. When a combo follow-up is queued, its id is returned directly; combo chains are
   *     sourced from the resolved (transformed) starter skill and are not re-transformed.
   *  3. Otherwise the slot's base skill id is passed through the transform resolver so the
   *     HUD displays the skill that will actually fire, not the raw equipped id.
   * @returns {number}
   */
  skillId()
  {
    // item slots store item ids — transforms are skills-only, so return raw.
    if (this.skillSlot().isItem())
    {
      return this.skillSlot().id;
    }

    // grab the cooldown data for this skill slot.
    const cooldownData = this.cooldownData();

    // when a combo follow-up is queued, show the combo skill as-is.
    if (cooldownData && cooldownData.comboNextActionId > 0)
    {
      return cooldownData.comboNextActionId;
    }

    // for the base slot, ask the battler for the resolved (post-transform) skill id.
    const battler = this.targetBattler();

    // fall back to the raw slot id if there is no battler reference yet.
    if (!battler)
    {
      return this.skillSlot().id;
    }

    // resolve through the transform layer so the HUD reflects the effective skill.
    return battler.getResolvedSkillId(this.skillSlot().key);
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
class Sprite_CooldownGauge
  extends Sprite
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

      /**
       * Highest recent combined cooldown (slot vs GCD) so the bar does not shrink when GCD outlasts the per-skill
       * timer.
       * @type {number}
       */
      _gcdHudPeak: 0,

      /**
       * Leader battler whose {@link J.ABS.Globals.GlobalCooldownKey} may be reflected on this input-slot gauge.
       * @type {JABS_Battler|null}
       */
      _gcdMergeBattler: null,

      /**
       * Skill id assigned to this HUD slot; used with
       * {@link JABS_GlobalCooldown.skillIsSubjectToGlobalCooldown} to decide if GCD should merge.
       * @type {number}
       */
      _gcdMergeSkillId: 0,
    };
  }

  /**
   * Binds this gauge to show remaining GCD alongside the slot cooldown when the slot maps to a GCD-subject skill.
   * Clears merge state for tool, dodge, and item slots so those inputs never display the shared timer.
   * @param {JABS_Battler|null} jabsBattler The leader JABS battler.
   * @param {JABS_SkillSlot|null} skillSlot Slot shown on this input key.
   */
  setHudGcdMerge(jabsBattler, skillSlot)
  {
    this._j._gcdMergeBattler = null;
    this._j._gcdMergeSkillId = 0;
    if (!jabsBattler || !skillSlot) return;
    const { key } = skillSlot;
    if (key === JABS_Button.Tool || key === JABS_Button.Dodge) return;
    if (skillSlot.isItem()) return;
    this._j._gcdMergeBattler = jabsBattler;
    this._j._gcdMergeSkillId = skillSlot.id;
  }

  /**
   * Remaining frames on the battler-wide GCD for HUD purposes when merge is armed and the slotted skill is
   * GCD-subject.
   * Returns zero if J-ABS or {@link JABS_GlobalCooldown} is unavailable, the slot is not merged, or the global timer
   * is ready.
   * @returns {number} Frames left on {@link J.ABS.Globals.GlobalCooldownKey}, or 0 when not applicable.
   */
  globalHudFrames()
  {
    if (!this._j._gcdMergeBattler || !this._j._gcdMergeSkillId) return 0;
    if (typeof J.ABS === 'undefined' || typeof JABS_GlobalCooldown === 'undefined') return 0;
    const sk = $dataSkills[this._j._gcdMergeSkillId];
    if (JABS_GlobalCooldown.skillIsSubjectToGlobalCooldown(sk) === false) return 0;
    const globalCd = this._j._gcdMergeBattler.getCooldown(J.ABS.Globals.GlobalCooldownKey);
    if (!globalCd) return 0;
    if (globalCd.isBaseReady() === true) return 0;
    return globalCd.frames;
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
    const cd = this.cooldownData();
    const g = this.globalHudFrames();
    return Math.max(cd.frames, g);
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
    return 'rgba(0, 0, 255, 1)';
  }

  /**
   * The color to gradient into.
   * Defaults to green.
   * @returns {string}
   */
  gaugeColor2()
  {
    return 'rgba(0, 255, 0, 1)';
  }

  /**
   * The backdrop color.
   * Defaults to black with 50% opacity.
   * @returns {string}
   */
  gaugeBackColor()
  {
    return 'rgba(0, 0, 0, 0.5)';
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
   * Disables the gauge, clears the GCD peak used for merged display, and makes it invisible.
   */
  disableGauge()
  {
    // zero the max value.
    this.setMaxValue(0);

    this._j._gcdHudPeak = 0;

    // make the sprite invisible.
    this.bitmap.paintOpacity = 0;
  }

  /**
   * Enables the gauge and sets the max value from the greater of the slot cooldown and merged GCD so the bar matches
   * the longer wait.
   * Tracks a peak so the fill rate stays stable when GCD extends past the per-skill countdown.
   */
  enableGauge()
  {
    const cd = this.cooldownData();
    const g = this.globalHudFrames();
    const eff = Math.max(cd.frames, g);
    if (this._j._gcdHudPeak < eff)
    {
      this._j._gcdHudPeak = eff;
    }
    this.setMaxValue(this._j._gcdHudPeak);

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
   * Shows or hides the gauge and updates its max from slot cooldown and optional merged GCD.
   * Hides only when both the slot base cooldown and merged GCD are finished; otherwise keeps the peak max for a smooth
   * drain.
   */
  handleActionReadiness()
  {
    const cooldown = this.cooldownData();
    const g = this.globalHudFrames();
    const eff = Math.max(cooldown.frames, g);

    if (cooldown.isComboReady() && this.isMaxUnassigned())
    {
      this.enableGauge();
    }

    if (cooldown.isBaseReady() === true && g <= 0)
    {
      this.disableGauge();
      return;
    }

    if (cooldown.isBaseReady() === false || g > 0)
    {
      if (this._j._gcdHudPeak < eff)
      {
        this._j._gcdHudPeak = eff;
      }
      this.setMaxValue(this._j._gcdHudPeak);
      this.bitmap.paintOpacity = 255;
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
    const [ borderedX, borderedY ] = [ x + 1, y + 1 ];

    // render the filled portion of the gauge onto the bitmap.
    this.bitmap.gradientFillRect(
      borderedX,            // the x including borders.
      borderedY,            // the y including borders.
      fillW,                // the width to fill.
      fillH,                // the hieght to fill.
      this.gaugeColor1(),   // the color gradient to start with.
      this.gaugeColor2()
    );  // the color gradient to end with.
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
  this.bitmap.drawText(this._j._text, 0, 0, this.bitmapWidth(), this.bitmapHeight(), "center");
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

  this.bitmap.drawText(cooldownBaseText, 0, 0, this.bitmapWidth(), this.bitmapHeight(), "center");
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
class Sprite_InputKeySlot
  extends Sprite
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
    if (this.skillSlot()
      .isItem())
    {
      return skillId;
    }

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
    return this.jabsBattler()
      .getBattler();
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

    // TODO: implement.
  }

  /**
   * Creates the key for the input key icon sprite based on the parameters.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyIconSpriteKey(skillSlot, inputType)
  {
    return `icon-${this.battler()
      .name()}-${this.battler()
      .battlerId()}-${inputType}`;
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
    return `cost-${this.battler()
      .name()}-${this.battler()
      .battlerId()}-${inputType}-${amount}-${colorIndex}`;
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
    return `skillcost-${this.battler()
      .name()}-${this.battler()
      .battlerId()}-${costType}-${inputType}`;
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
  makeInputKeyCooldownTimerSpriteKey(cooldownData, inputType, isItem)
  {
    return `cooldown-${this.battler()
      .name()}-${this.battler()
      .battlerId()}-${inputType}-${isItem}`;
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
    const key = this.makeInputKeyCooldownTimerSpriteKey(cooldownData, inputType, isItem);

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
    return `combo-${this.battler()
      .name()}-${this.battler()
      .battlerId()}-${inputType}`;
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
    return `skillname-${this.battler()
      .name()}-${this.battler()
      .battlerId()}-${inputType}`;
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
    return `slotname-${this.battler()
      .name()}-${this.battler()
      .battlerId()}-${inputType}`;
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

    if (!this.skillSlot()
      .isItem())
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
    sprite.move(x + 6, y + 20);
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
    const sprite = this.getOrCreateInputKeySkillCostSprite(skillSlot, Sprite_SkillCost.Types.HP, inputType);
    sprite.show();
    sprite.move(x - 2, y - 10);
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
    const sprite = this.getOrCreateInputKeySkillCostSprite(skillSlot, Sprite_SkillCost.Types.MP, inputType);
    sprite.show();
    sprite.move(x - 2, y);
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
    const sprite = this.getOrCreateInputKeySkillCostSprite(skillSlot, Sprite_SkillCost.Types.TP, inputType);
    sprite.show();
    sprite.move(x - 2, y + 10);
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
    const sprite = this.getOrCreateInputKeySkillCostSprite(skillSlot, Sprite_SkillCost.Types.Item, inputType);
    sprite.show();
    sprite.move(x + 42, y + 24);
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
    sprite.setHudGcdMerge(this.jabsBattler(), this.skillSlot());
    sprite.show();
    sprite.move(x + 32, y + 32);
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
    sprite.move(x + 28, y + 16);
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
    sprite.move(x, y + 36);
  }

  drawInputKeySlotName(x, y)
  {
    // grab data for building the sprite.
    const skillSlot = this.skillSlot();
    const inputType = this.skillSlot().key;

    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySlotNameSprite(skillSlot, inputType);
    sprite.show();
    sprite.move(x, y + 48);
  }

  //endregion drawing
}

//endregion Sprite_InputKeySlot

//region Sprite_SkillCost
/**
 * A sprite that represents a skill slot's assigned skill's mp cost.
 */
class Sprite_SkillCost
  extends Sprite_BaseSkillSlot
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
   * Calculates the skill cost according to the type of this sprite.
   *
   * The resolved (post-transform) skill id is used so cost display reflects the
   * skill that will actually fire rather than the raw base skill in the slot.
   * @returns {number}
   */
  skillCostByType()
  {
    const leader = $gameParty.leader();
    if (!leader) return 0;

    // resolve through the transform layer so cost reflects the effective skill.
    const resolvedId = leader.getResolvedSkillId(this.skillSlot().key);
    const ability = this.skillSlot().data(leader, resolvedId);
    if (!ability) return 0;

    switch (this.skillCostType())
    {
      case Sprite_SkillCost.Types.HP:
        return leader.skillHpCost(ability);
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
    let skillCost = this.skillCost()
      .toFixed(0);

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
    this.skillSlot()
      .acknowledgeCostRefreshByType(this.skillCostType());
  }
}

//endregion Sprite_SkillCost

//region Sprite_SkillName
/**
 * A sprite that represents a skill slot's assigned skill's name.
 */
class Sprite_SkillName
  extends Sprite_BaseSkillSlot
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
    return (this.hasSkillSlot() && this.skillSlot()
      .needsVisualNameRefresh());
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
    this.skillSlot()
      .acknowledgeNameRefresh();
  }
}

//endregion Sprite_SkillName

//region Sprite_SkillSlotIcon
/**
 * A sprite that displays the icon represented by the assigned skill slot.
 */
class Sprite_SkillSlotIcon
  extends Sprite_Icon
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
   *
   * The resolved (post-transform) skill id is used so the icon reflects the skill that
   * will actually fire rather than the raw equipped skill in the slot.
   * @returns {number}
   */
  skillSlotIcon()
  {
    // if there is no skill slot, return whatever is currently there.
    if (!this.hasSkillSlot()) return this._j._iconIndex;

    // grab the party leader; they are the source of transform resolution for the icon.
    const leader = $gameParty.leader();

    // if there is no leader, do not try to translate the slot into an icon.
    if (!leader) return this._j._iconIndex;

    // resolve through the transform layer so the icon shows the effective skill.
    const resolvedId = leader.getResolvedSkillId(this.skillSlot().key);

    // fetch the skill data for the resolved id.
    const skill = this.skillSlot().data(leader, resolvedId);

    // if nothing was in the slot, then don't draw it.
    if (!skill) return 0;

    // return the resolved skill's icon index.
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
    return (this.hasSkillSlot() && this.skillSlot()
      .needsVisualIconRefresh());
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
    this.skillSlot()
      .acknowledgeIconRefresh();
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
class Window_InputFrame
  extends Window_Frame
{
  /**
   * Modes for how the input diamond should render.
   * @type {{ Base: string, Skills: string }}
   */
  static Modes = {
    Base: 'base',
    Skills: 'skills',
  };

  /**
   * The visual gap (in pixels) between the top and bottom bodies of the diamond.
   * Also used by the scene’s window sizing to keep things in sync.
   * Tweak this to 4/6/etc to fiddle the spacing.
   * @returns {number}
   */
  static get DiamondGap()
  {
    // default was 2; try 4 or 6 to taste.
    return 6;
  }

  /**
   * Constructor.
   * @param {Rectangle} rect The shape of this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * The rough estimate of width for a single input key and all its subsprites.
   * @returns {number}
   */
  inputKeyWidth()
  {
    return 72;
  }

  /**
   * The rough estimate of height for a single input key and all its subsprites.
   * @returns {number}
   */
  inputKeyHeight()
  {
    return 72;
  }

  //region state
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

    /**
     * A grouping for tracking last-known values used to determine
     * if this HUD requires a refresh.
     */
    this._j._last ||= {};

    /**
     * Tracks whether SkillTrigger was held on the last processed frame.
     * Used to request refreshes only when the held state changes so we
     * preserve the "draw only when needed" behavior.
     * @type {boolean}
     */
    this._j._last._skillTriggerHeld = false;

    /**
     * Tracks whether the party was considered in combat on the last processed frame.
     * Used to request refresh on combat context changes so the left node can
     * swap between Sprint (out of combat) and Mobility/Dodge (in combat).
     * @type {boolean}
     */
    this._j._last._partyInCombat = false;

    /**
     * A grouping for tracking the flip progress and direction.
     */
    this._j._flip ||= {};

    /**
     * The current progress for the flip animation.
     * @type {number}
     */
    this._j._flip._progress = 0;

    /**
     * The maximum duration for the flip animation.
     * @type {number}
     */
    this._j._flip._max = 10;

    /**
     * The current direction of the flip animation.
     * @type {number}
     */
    this._j._flip._direction = 0;
  }

  /**
   * Gets whether or not the skill trigger is held.
   * @returns {boolean}
   */
  skillTriggerHeld()
  {
    return this._j._last._skillTriggerHeld;
  }

  /**
   * Sets whether or not the skill trigger is held.
   * @param {boolean} value True if the skill trigger is held, false otherwise.
   */
  setSkillTriggerHeld(value)
  {
    this._j._last._skillTriggerHeld = value;
  }

  /**
   * Gets whether or not the party is in combat.
   * @returns {boolean}
   */
  partyInCombat()
  {
    return this._j._last._partyInCombat;
  }

  /**
   * Sets whether or not the party is in combat.
   * @param {boolean} value True if the party is in combat, false otherwise.
   */
  setPartyInCombat(value)
  {
    this._j._last._partyInCombat = value;
  }

  /**
   * Gets the current flip progress (0..max).
   * @returns {number}
   */
  getFlipProgress()
  {
    // store under a dedicated bag to avoid accidental overlap.
    return this._j._flip._progress;
  }

  /**
   * Sets the current flip progress (0..max).
   * @param {number} value The new progress.
   */
  setFlipProgress(value)
  {
    this._j._flip._progress = Math.max(0, value);
  }

  /**
   * Gets the maximum flip duration in frames.
   * @returns {number}
   */
  getFlipMax()
  {
    return this._j._flip._max;
  }

  /**
   * Sets the maximum flip duration in frames.
   * @param {number} value The new max duration.
   */
  setFlipMax(value)
  {
    this._j._flip._max = Math.max(0, value);
  }

  /**
   * Gets the current flip direction (-1, 0, +1).
   * @returns {number}
   */
  getFlipDirection()
  {
    return this._j._flip._direction;
  }

  /**
   * Sets the current flip direction (-1, 0, +1).
   * @param {number} value The new direction.
   */
  setFlipDirection(value)
  {
    // cache the numeric direction requested.
    const dir = value;

    // normalize to -1, 0, or +1 only.
    if (dir < 0)
    {
      this._j._flip._direction = -1;
    }
    else if (dir > 0)
    {
      this._j._flip._direction = 1;
    }
    else
    {
      this._j._flip._direction = 0;
    }
  }

  //endregion state

  /**
   * Executes any one-time configuration required for this window.
   */
  configure()
  {
    // perform original logic.
    super.configure();

    // remove opacity for completely transparent window.
    this.opacity = 32;
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
    return `inputkey-${$gameParty.leader()
      .actorId()}-${inputType}`;
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
    const sprite = new Sprite_InputKeySlot(skillSlot, $jabsEngine.getPlayer1());

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

  //region refresh
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

  //endregion refresh

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

    // check if the player is holding the skill trigger.
    this.checkSkillTrigger();

    // check if the party combat context changed and request redraw if so.
    this.checkCombatContext();

    // advance the crossfade animator when active (using accessors only).
    this.advanceFlipAnimator();

    // draw the contents.
    this.drawInputFrame();
  }

  /**
   * Checks if the player is holding the SkillTrigger and updates the internal state accordingly.
   */
  checkSkillTrigger()
  {
    // determine whether the SkillTrigger is currently held.
    const currentlyHeld = this.isSkillTriggerHeld();

    // if the held state changed since last frame, request a redraw.
    if (this.skillTriggerHeld() !== currentlyHeld)
    {
      // update last-known held state.
      this.setSkillTriggerHeld(currentlyHeld);

      // kick the flip animator in the correct direction via setter only.
      this.setFlipDirection(currentlyHeld
        ? +1
        : -1);

      // redraw is required to flip between views.
      this.requestInternalRefresh();
    }
  }

  /**
   * Checks if the party combat context changed and updates internal state.
   */
  checkCombatContext()
  {
    // determine whether the party is currently considered in combat.
    const currentlyInCombat = $gameParty.anyMemberInCombat();

    // if the combat context changed since last frame, request a redraw.
    if (this.partyInCombat() !== currentlyInCombat)
    {
      // update last-known in-combat state.
      this.setPartyInCombat(currentlyInCombat);

      // redraw is required to swap the left node (Sprint ↔ Mobility).
      this.requestInternalRefresh();
    }
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
    return (playerX < this.width + 100) && (playerY < this.height + 100);
  }

  /**
   * Manages opacity for all sprites while the player is interfering with the visibility.
   */
  handlePlayerInterference()
  {
    this._j._spriteCache.forEach((sprite, _) =>
    {
      // if we are above 64, rapidly decrement by -15 until we get below 64.
      if (sprite.opacity > 64)
      {
        sprite.opacity -= 15;
      }// if we are below 64, increment by +1 until we get to 64.
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
      if (sprite.opacity < 255)
      {
        sprite.opacity += 15;
      }// if we are above 255, set to 255.
      else if (sprite.opacity > 255) sprite.opacity = 255;
    });
  }

  //endregion visibility

  /**
   * Advances the flip animator when active; requests refresh while animating.
   * Uses only accessors for state changes.
   */
  advanceFlipAnimator()
  {
    // if idle, nothing to do.
    if (this.getFlipDirection() === 0)
    {
      return;
    }

    // compute new progress.
    const next = this.getFlipProgress() + this.getFlipDirection();
    const max = this.getFlipMax();

    // clamp into [0, max].
    if (next <= 0)
    {
      this.setFlipProgress(0);
      this.setFlipDirection(0);
    }
    else if (next >= max)
    {
      this.setFlipProgress(max);
      this.setFlipDirection(0);
    }
    else
    {
      this.setFlipProgress(next);
    }

    // while animating, ensure redraw continues.
    this.requestInternalRefresh();
  }

  /**
   * Computes current alphas for base and skills diamonds from the flip animator.
   * @returns {{alphaBase:number, alphaSkills:number}}
   */
  computeFlipAlphas()
  {
    // if animator is idle, snap to whichever mode is active.
    if (this.getFlipDirection() === 0)
    {
      const skillsActive = this.isSkillTriggerHeld();
      return {
        alphaBase: skillsActive
          ? 0
          : 255,
        alphaSkills: skillsActive
          ? 255
          : 0,
      };
    }

    // blend based on normalized progress.
    const max = this.getFlipMax();
    const prog = this.getFlipProgress();
    const t = max > 0
      ? (prog / max)
      : 1;

    // direction +1 means transitioning to Skills; -1 to Actions.
    const alphaSkills = Math.round(255 * t);
    const alphaBase = 255 - alphaSkills;
    return {
      alphaBase,
      alphaSkills
    };
  }

  //region draw
  /**
   * Draws the input frame window in its entirety.
   */
  drawInputFrame()
  {
    // don't draw if we don't need to draw.
    if (!this.canDrawInputFrame()) return;

    // wipe the drawn contents.
    this.contents.clear();
    this.contentsBack.clear();

    // hide all the sprites and let each update its own bitmap.
    this._j._spriteCache.forEach((sprite =>
    {
      sprite.hide();
      sprite.drawInputKey();
    }));

    // compute blend alphas between modes (0..255 each) using accessors.
    const alphas = this.computeFlipAlphas();
    const {
      alphaBase,
      alphaSkills
    } = alphas;

    // draw Actions (base) with its alpha when non-zero.
    if (alphaBase > 0)
    {
      // apply paint opacity for gradients/text.
      this.contents.paintOpacity = alphaBase;

      // pass the same alpha down so child slot sprites also fade.
      this.drawDiamond(Window_InputFrame.Modes.Base, alphaBase);
    }

    // draw Skills with its alpha when non-zero.
    if (alphaSkills > 0)
    {
      // apply paint opacity for gradients/text.
      this.contents.paintOpacity = alphaSkills;

      // pass the same alpha down so child slot sprites also fade.
      this.drawDiamond(Window_InputFrame.Modes.Skills, alphaSkills);
    }

    // reset paint opacity for any future draws this frame.
    this.contents.paintOpacity = 255;

    // draw the mode labels with their own fading alphas.
    this.drawModeLabels(alphaBase, alphaSkills);

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
   * Checks the current bindings for SkillTrigger and returns true if any bound
   * physical symbol is currently pressed. This is remap‑aware.
   * @returns {boolean}
   */
  isSkillTriggerHeld()
  {
    // get JABS bindings and the physical symbols for the logical SkillTrigger.
    const allBindings = Input.getAllBindings('JABS');
    const bound = allBindings && allBindings[JABS_Button.SkillTrigger]
      ? allBindings[JABS_Button.SkillTrigger]
      : [];

    // if any symbol bound to SkillTrigger is held, return true.
    for (let i = 0; i < bound.length; i++)
    {
      const symbol = bound[i];
      if (Input.isPressed(symbol))
      {
        return true;
      }
    }

    // none of the bound symbols are pressed.
    return false;
  }

  /**
   * Draws the “Actions” and “Skills” labels with matching crossfade alphas.
   * @param {number} alphaBase The opacity (0..255) for the Actions label.
   * @param {number} alphaSkills The opacity (0..255) for the Skills label.
   */
  drawModeLabels(alphaBase, alphaSkills)
  {
    // cache base font settings to restore afterward.
    const prevSize = this.contents.fontSize;
    const prevOutlineW = this.contents.outlineWidth;
    const prevOutlineC = this.contents.outlineColor;
    const prevPaint = this.contents.paintOpacity;

    // choose a slightly larger, bold-ish readable style.
    this.contents.fontSize = prevSize + 2;
    this.contents.outlineWidth = 4;
    this.contents.outlineColor = 'rgba(0, 0, 0, 0.85)';

    // compute margins for label placement inside contents space.
    const leftMargin = 8;
    const rightMargin = 8;
    const topMargin = 2;

    // draw "Actions" in the upper-left, using the base alpha.
    if (alphaBase > 0)
    {
      // apply the alpha for this pass.
      this.contents.paintOpacity = alphaBase;

      // define text and measure for any future adjustments if needed.
      const text = 'Actions';

      // draw the text left-aligned at the top-left margin.
      this.drawText(text, leftMargin, topMargin, 160, 'left');
    }

    // draw "Skills" in the upper-right, using the skills alpha.
    if (alphaSkills > 0)
    {
      // apply the alpha for this pass.
      this.contents.paintOpacity = alphaSkills;

      // define text and measure its width.
      const text = 'Skills';
      const tw = this.textSizeEx(text).width; // consistent with Window_Base API.

      // compute x so the right edge sits at contentsWidth - rightMargin.
      const x = Math.max(0, this.contentsWidth() - rightMargin - tw);

      // draw the text right-aligned at the top-right margin.
      this.drawText(text, x, topMargin, tw, 'right');
    }

    // restore font and opacity.
    this.contents.fontSize = prevSize;
    this.contents.outlineWidth = prevOutlineW;
    this.contents.outlineColor = prevOutlineC;
    this.contents.paintOpacity = prevPaint;
  }

  /**
   * Draws a multi-layer HUD panel background that looks richer than a flat gradient.
   * Renders shadow to contentsBack, then gradient/border/gloss/tint to contents.
   * @param {number} x The left of the panel (contents space).
   * @param {number} y The top of the panel (contents space).
   * @param {number} w The width of the panel.
   * @param {number} h The height of the panel.
   * @param {{
   *   tint?: string,
   *   tintAlpha?: number,
   *   cornerPad?: number,
   * }} [options] Optional styling overrides.
   */
  drawHudPanelFancy(x, y, w, h, options)
  {
    // configure options w/ reasonable defaults.
    const opts = options || {};
    const tint = opts.tint || null;             // e.g., 'rgba(255,64,64,1.0)'
    const tintAlpha = Number(opts.tintAlpha || 0); // 0..1
    const radius = Math.max(0, Number(opts.cornerPad || 0));

    // colors from theme (same family your old panels used).
    const back1 = ColorManager.itemBackColor1(); // darker
    const back2 = ColorManager.itemBackColor2(); // lighter

    // quick guards.
    if (w <= 0 || h <= 0) return;

    // helpers to draw a rounded-rect path into a 2D context.
    const roundRectPath = (ctx, rx, ry, rw, rh, r) =>
    {
      const rr = Math.min(r, Math.floor(Math.min(rw, rh) / 2));
      if (rr <= 0)
      {
        ctx.rect(rx, ry, rw, rh);
        return;
      }
      const r2 = rr * 2;
      ctx.moveTo(rx + rr, ry);
      ctx.lineTo(rx + rw - rr, ry);
      ctx.arc(rx + rw - rr, ry + rr, rr, Math.PI * 1.5, 0);
      ctx.lineTo(rx + rw, ry + rh - rr);
      ctx.arc(rx + rw - rr, ry + rh - rr, rr, 0, Math.PI * 0.5);
      ctx.lineTo(rx + rr, ry + rh);
      ctx.arc(rx + rr, ry + rh - rr, rr, Math.PI * 0.5, Math.PI);
      ctx.lineTo(rx, ry + rr);
      ctx.arc(rx + rr, ry + rr, rr, Math.PI, Math.PI * 1.5);
    };

    // 1) soft shadow to contentsBack (subtle, non-accumulating because we clear each refresh).
    {
      const sb = this.contentsBack;
      const ctx = sb.context;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      for (let i = 1; i <= 3; i++)
      {
        ctx.beginPath();
        roundRectPath(ctx, x + i, y + i + 1, w, h, radius);
        ctx.fill();
      }
      ctx.restore();
      sb._baseTexture.update();
    }

    // 2) main body gradient fill to contents (3-stop vertical feel).
    const c = this.contents;
    const ctx = c.context;
    ctx.save();
    const grad = ctx.createLinearGradient(0, y + h, 0, y);
    grad.addColorStop(0.00, back1);
    grad.addColorStop(0.50, back2);
    grad.addColorStop(1.00, back1);
    ctx.fillStyle = grad;
    ctx.beginPath();
    roundRectPath(ctx, x, y, w, h, radius);
    ctx.fill();

    // mid highlight band (very soft)
    const midH = Math.max(6, Math.floor(h * 0.25));
    const midY = y + Math.floor((h - midH) / 2);
    const midGrad = ctx.createLinearGradient(0, midY + midH, 0, midY);
    midGrad.addColorStop(0.00, 'rgba(255,255,255,0.00)');
    midGrad.addColorStop(1.00, 'rgba(255,255,255,0.06)');
    ctx.fillStyle = midGrad;
    ctx.beginPath();
    roundRectPath(ctx, x + 1, midY, w - 2, midH, Math.max(0, radius - 1));
    ctx.fill();

    // 3) inner border (crisper than before).
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    roundRectPath(ctx, x + 0.5, y + 0.5, w - 1, h - 1, Math.max(0, radius - 0.5));
    ctx.stroke();

    // 4) top gloss band for a gentle sheen.
    const glossH = Math.max(4, Math.floor(h * 0.20));
    const glossGrad = ctx.createLinearGradient(0, y + glossH, 0, y);
    glossGrad.addColorStop(0.00, 'rgba(255,255,255,0.18)');
    glossGrad.addColorStop(1.00, 'rgba(255,255,255,0.00)');
    ctx.fillStyle = glossGrad;
    ctx.beginPath();
    roundRectPath(ctx, x + 1, y + 1, w - 2, glossH, Math.max(0, radius - 1));
    ctx.fill();

    // 5) optional tint overlay (context-aware color).
    if (tint && tintAlpha > 0)
    {
      ctx.globalAlpha = Math.max(0, Math.min(1, tintAlpha));
      ctx.fillStyle = tint;
      ctx.beginPath();
      roundRectPath(ctx, x, y, w, h, radius);
      ctx.fill();
    }

    ctx.restore();
    c._baseTexture.update();

  }

  /**
   * Renders a diamond from the window's upper-left using shared coordinates.
   * The parent computes x/y once per node and draws exactly four buttons.
   * @param {string} mode One of {@link Window_InputFrame.Modes}.
   * @param {number} slotOpacity The opacity to apply to slot sprites (0..255).
   */
  drawDiamond(mode, slotOpacity)
  {
    // shared key sizes.
    const ikw = this.inputKeyWidth();
    const ikh = this.inputKeyHeight();

    // diamond geometry (centered in the window box; matches Scene sizing math).
    const cx = Math.floor(this.width / 2) + 4;
    const cy = Math.floor(this.height / 2) - 10;

    // use a single desired body-to-body gap in BOTH axes.
    const desiredGap = Window_InputFrame.DiamondGap; // applies horizontally AND vertically

    // half-sizes for converting between centers and sprite origins.
    const halfIkw = Math.floor(ikw / 2);
    const halfIkh = Math.floor(ikh / 2);

    // VERTICAL: distance between centers of top and bottom bodies so that
    // the visible body gap equals desiredGap.
    const verticalCenterDistance = ikh + desiredGap;

    // compute the visual centers for top/bottom.
    const topCenterY = cy - Math.floor(verticalCenterDistance / 2);
    const bottomCenterY = cy + Math.floor(verticalCenterDistance / 2);

    // convert visual centers to sprite origins (compensate for +20 body offset).
    const topY = topCenterY - halfIkh - 20;
    const bottomY = bottomCenterY - halfIkh - 20;

    // HORIZONTAL: Left/Right are DiamondGap away from the center column body.
    // That means each side center is offset by (ikw + desiredGap) from cx.
    const sideCenterOffset = ikw + desiredGap;
    const leftCenterX = cx - sideCenterOffset;
    const rightCenterX = cx + sideCenterOffset;

    // convert centers to sprite origins.
    const leftX = leftCenterX - halfIkw;
    const rightX = rightCenterX - halfIkw;

    // Left/Right share the midline vertically.
    const sideY = cy - halfIkh - 20;

    // Top and Bottom share the same x (center column).
    const topX = cx - halfIkw;
    const bottomX = cx - halfIkw;

    // draw four buttons according to mode.
    switch (mode)
    {
      case Window_InputFrame.Modes.Skills:
      {
        // Top    → Skill 4
        // Left   → Skill 3
        // Right  → Skill 2
        // Bottom → Skill 1
        this.drawButton(topX, topY, JABS_Button.CombatSkill4, slotOpacity);
        this.drawButton(leftX, sideY, JABS_Button.CombatSkill3, slotOpacity);
        this.drawButton(rightX, sideY, JABS_Button.CombatSkill2, slotOpacity);
        this.drawButton(bottomX, bottomY, JABS_Button.CombatSkill1, slotOpacity);
        break;
      }

      case Window_InputFrame.Modes.Base:
      default:
      {
        // decide the left node based on combat context.
        const leftButton = this.partyInCombat()
          ? JABS_Button.Dodge
          : JABS_Button.Sprint;

        // Top    → Tool
        // Left   → Sprint (OoC) or Dodge (In‑combat)
        // Right  → Offhand
        // Bottom → Mainhand
        this.drawButton(topX, topY, JABS_Button.Tool, slotOpacity);
        this.drawButton(leftX, sideY, leftButton, slotOpacity);
        this.drawButton(rightX, sideY, JABS_Button.Offhand, slotOpacity);
        this.drawButton(bottomX, bottomY, JABS_Button.Mainhand, slotOpacity);
        break;
      }
    }
  }

  /**
   * Draw a single button at x,y.
   * Sprint is a special case (not a skillslot), everything else uses drawInputKey().
   * @param {number} x The x coordinate (CONTENTS space).
   * @param {number} y The y coordinate (CONTENTS space).
   * @param {string} button The logical button (from {@link JABS_Button}).
   * @param {number} opacity The per-pass opacity (0..255) for slot sprites.
   */
  drawButton(x, y, button, opacity)
  {
    // sprint is not backed by a JABS_SkillSlot; render its node directly.
    if (button === JABS_Button.Sprint)
    {
      this.drawSprintNode(x, y);
      return;
    }

    // draw the input-key backed slot with the provided opacity.
    this.drawInputKey(button, x, y, opacity);
  }

  /**
   * Draws a Sprint node styled like a skill slot: a panel,
   * a centered icon, and a small label reading "dash".
   * @param {number} x The x coordinate for the node (contents space).
   * @param {number} y The y coordinate for the node (contents space).
   */
  drawSprintNode(x, y)
  {
    // node size, aligned with other keys.
    const ikw = this.inputKeyWidth();
    const ikh = this.inputKeyHeight();

    // panel rectangle aligned to other slot panels.
    const panelX = x - 10;
    const panelY = y + 20;
    const panelW = ikw - 10;
    const panelH = ikh;

    // render the fancy HUD panel background.
    this.drawHudPanelFancy(panelX, panelY, panelW, panelH, {
      tint: null,
      tintAlpha: 0,
    });

    // icon (temporary index 140) centered, biased upward to leave label room.
    const iconIndex = 140;
    const iconW = ImageManager.iconWidth;
    const iconH = ImageManager.iconHeight;
    const labelReserve = 18;
    const iconX = panelX + Math.floor((panelW - iconW) / 2);
    const iconY = panelY + Math.max(0, Math.floor((panelH - labelReserve - iconH) / 2));
    this.drawIcon(iconIndex, iconX, iconY);

    // small label using Window_Base helpers (no direct font pokes).
    const originalSize = this.contents.fontSize;
    const originalOutlineW = this.contents.outlineWidth;
    const originalOutlineC = this.contents.outlineColor;

    // match other slot label sizing (slightly smaller than default).
    this.setFontSize(originalSize - 10);
    this.contents.outlineWidth = 4;
    this.contents.outlineColor = 'rgba(0, 0, 0, 0.85)';

    const text = 'Dash';
    const tw = this.textSizeEx(text).width;
    const labelX = panelX + Math.floor((panelW - tw) / 2) - 5;
    const labelY = panelY + panelH - labelReserve - 16;
    this.drawText(text, labelX, labelY, tw, 'left');

    // restore font settings.
    this.setFontSize(originalSize);
    this.contents.outlineWidth = originalOutlineW;
    this.contents.outlineColor = originalOutlineC;
  }

  /**
   * Draws a single input key of the input frame.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} opacity The per-pass opacity (0..255) for slot sprites.
   */
  drawInputKey(inputType, x, y, opacity)
  {
    // shorthand the player's JABS battler data.
    const jabsPlayer = $jabsEngine.getPlayer1();

    // grab the cooldown data and the skillslot data from the leader based on the slot.
    const actionKeyData = jabsPlayer.getActionKeyData(inputType);

    // if we have no action key data for this slot, don't draw it.
    if (!actionKeyData) return;

    // extract the input key's data.
    const skillSlot = actionKeyData.skillslot;

    // draw the input key slot's sprite with the provided opacity.
    this.drawInputKeySlotSprite(skillSlot, inputType, x, y, opacity);
  }

  /**
   * Draw the input key associated with a given skill slot.
   * @param {JABS_SkillSlot} skillSlot The skill slot to draw.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate (CONTENTS space).
   * @param {number} y The y coordinate (CONTENTS space).
   * @param {number} opacity The per-pass opacity (0..255) for the slot sprite.
   */
  drawInputKeySlotSprite(skillSlot, inputType, x, y, opacity)
  {
    const sprite = this.getOrCreateInputKeySlotSprite(skillSlot, inputType);

    // draw the panel background when the slot isn’t empty.
    if (!skillSlot.isEmpty())
    {
      const width = this.inputKeyWidth() - 10;
      const height = this.inputKeyHeight();

      // fancy multi-layer HUD panel.
      this.drawHudPanelFancy(x - 10, y + 20, width, height, {
        // no tint by default; wire one in later if you theme by state.
        tint: null,
        tintAlpha: 0,
      });
    }

    // TODO: adjust x/y back a bit.

    // position the slot sprite.
    const px = this.padding + x - 4;
    const py = this.padding + y + 14;
    sprite.show();
    sprite.move(px, py);
    sprite.opacity = Math.max(0, Math.min(255, opacity || 255));
  }

  //endregion draw
}

//endregion Window_InputFrame

//# sourceMappingURL=J-HUD-InputFrame.js.map
