//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 CMS_S] A redesign of the status menu for chef adventure.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-SDP
 * @base J-CriticalFactors
 * @base J-NaturalGrowth
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This is primarily designed to render out multiple additional parameters from
 * other plugins for the Chef Adventure game:
 * - BASE (the max tp)
 * - JABS (the movement speed boost)
 * - SDP (breakdown of what panels give bonuses, sdp/exp/gold boosts)
 * - CRIT (the crit damage multiplier and reduction)
 * - NATURAL (the natural buffs and growths)
 *
 * This provides a more comprehensive view of what all the parameters are for
 * the actors (revealing base/sp/ex values) as well as providing a breakdown
 * for each parameter as to what is feeding into it.
 *
 * NOTE ABOUT USING THIS CUSTOM STATUS SCREEN:
 * It is not encouraged to use this unless you intend to use all the base
 * plugins that are listed. Support for this plugin will be minimal for
 * edge-cases outside of how I use this.
 *
 * ============================================================================
 * CHANGELOG
 * ----------------------------------------------------------------------------
 * - 1.1.0
 *    Added complete long-parameter coverage and detailed breakdown panel.
 *    Documentation pass for status list window and models.
 *    Retroactively added this changelog.
 * - 1.0.0
 *    Initial release.
 * =========================================================================
 */
//endregion Introduction

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.1';
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
J.CMS_S = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CMS_S.Metadata = {};
J.CMS_S.Metadata.Name = `J-CMS-Status`;
J.CMS_S.Metadata.Version = '1.1.0';

J.CMS_S.Aliased = {
  Scene_Status: new Map(),
};
//endregion Introduction

//region StatusParameter
/**
 * The content of a single parameter being drawn in a window.
 */
class StatusParameter
{
  /**
   * The numeric value for the parameter.
   * For sp/ex parameters, this may be a decimal.
   * @type {number}
   */
  value = 0.0;

  /**
   * The "long" parameter id for this parameter.
   * @type {number}
   */
  longParamId = 0;

  /**
   * The `name` of this parameter.
   * @type {string}
   */
  name = String.empty;

  /**
   * The `iconIndex` of this parameter.
   * @type {number}
   */
  iconIndex = 0;

  /**
   * The `colorIndex` of this parameter.
   * @type {number}
   */
  colorIndex = 0;

  /**
   * Constructor.
   * @param {number} value The value of the parameter.
   * @param {number} longParamId The long parameter id this value represents.
   */
  constructor(value, longParamId)
  {
    // assign the raw numeric value of the parameter.
    this.value = value;

    // assign the long param id that describes how this value should be displayed.
    this.longParamId = longParamId;

    // refresh the derived display data for this parameter.
    this.refresh();
  }

  /**
   * Initialize the properties based on the provided
   */
  refresh()
  {
    this.name = TextManager.longParam(this.longParamId);
    this.iconIndex = IconManager.longParam(this.longParamId);
    this.colorIndex = ColorManager.longParam(this.longParamId);
  }

  /**
   * Get the pretty value of this parameter.
   * @param {boolean=} withPadding True if you want zero-padding, false otherwise; defaults to false.
   * @returns {string}
   */
  prettyValue(withPadding = false)
  {
    // start with a working numeric copy of the value.
    let num = this.value;

    // define which long param ids should be scaled to whole-number percent space.
    const multiplyBy100Ids = [
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17,   // ex-params
      18, 19, 20, 21, 22, 23, 24, 25, 26, 27, // s-params
      28, 29,                                 // crit params
    ];

    // scale to percent space when applicable.
    if (multiplyBy100Ids.includes(this.longParamId))
    {
      num *= 100;
    }

    // the s-params look nicer centered around 0 instead of 100.
    const minus100Ids = [ 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 ];
    if (minus100Ids.includes(this.longParamId))
    {
      num -= 100;
    }

    // handle regen values as per-second rate (engine’s native 1/5s tick assumed).
    const regenIds = [ 15, 16, 17 ];
    if (regenIds.includes(this.longParamId))
    {
      // compute the per-second rate.
      const perSecond = (num / 5);

      // if not an integer, show one decimal place; else show whole.
      const regenStr = Number.isInteger(perSecond)
        ? perSecond.toString()
        : perSecond.toFixed(1);

      // return the decorated regen string.
      return `${regenStr}/s`;
    }

    // turn numeric into a base string, trimming ".0" trailing decimals.
    let base = Number.isInteger(num)
      ? num.toString()
      : num.toFixed(1);
    if (base.endsWith('.0'))
    {
      base = base.slice(0, base.length - 2);
    }

    // apply optional left-padding on the base string before suffixes.
    if (withPadding && this.value)
    {
      // note: padding widths grouped by visual scale of the stat block.
      const pad6 = [ 0, 1 ];                           // MHP, MMP
      const pad4 = [ 2, 3, 4, 5, 6, 7, 19, 28, 29, 30 ]; // b-params, GRD, crits, MTP
      const pad3 = [ 13, 14, 18, 20, 21, 22, 23, 24, 25, 26, 27 ]; // CNT, MRF, most s-params

      if (pad6.includes(this.longParamId))
      {
        base = String(base)
          .padZero(6);
      }
      else if (pad4.includes(this.longParamId))
      {
        base = String(base)
          .padZero(4);
      }
      else if (pad3.includes(this.longParamId))
      {
        base = String(base)
          .padZero(3);
      }
    }

    // add a percent sign for the appropriate groups.
    const percentIds = [
      9, 13, 14,                 // EVA, CNT, MRF
      20, 21, 22, 23, 24, 25, 26, 27, // selected s-params
      28, 29,                    // crit params
    ];
    if (percentIds.includes(this.longParamId))
    {
      base = `${base}%`;
    }

    // return the final formatted value.
    return base;
  }
}

//endregion StatusParameter

//region StatusStatListRow
/**
 * Represents a single selectable stat row for the Status stat list window.
 * Each row points at a specific long parameter id and the display section it belongs to.
 */
class StatusStatListRow
{
  /**
   * The display section header this row belongs to (ex: "Core Parameters").
   * @type {string}
   */
  section = String.empty;

  /**
   * The long parameter id represented by this row.
   * @type {number}
   */
  longParamId = 0;

  /**
   * Constructor.
   * @param {string} section The display section header.
   * @param {number} longParamId The long parameter id represented by this row.
   */
  constructor(section, longParamId)
  {
    // assign the section this row belongs to for grouping.
    this.section = section;

    // assign the long parameter id this row represents.
    this.longParamId = longParamId;
  }
}

//endregion StatusStatListRow

//region J.CMS_S.Helpers
/**
 * Text and number formatting helpers.
 */
class StatusHelper
{
  /**
   * Formats a numeric percent (e.g., 25 -> "+25%" when signed).
   * @param {number} percent The percent value.
   * @param {boolean} signed Whether to prefix a plus when positive.
   * @returns {string}
   */
  static toPercentString(percent, signed)
  {
    // choose either whole number or one decimal place.
    const base = Number.isInteger(percent)
      ? `${percent}`
      : percent.toFixed(1);

    // prefix a plus sign when signed and non‑negative.
    const sign = (signed && percent >= 0)
      ? '+'
      : String.empty;

    // return the formatted percent string.
    return `${sign}${base}%`;
  }

  /**
   * Converts a rate like 1.20 into a signed percentage delta string like "+20%".
   * @param {number} rate The multiplier rate.
   * @returns {string}
   */
  static toRateString(rate)
  {
    // convert a multiplier into a delta percent relative to 1.0.
    const delta = (rate - 1.0) * 100;

    // delegate to the percent string formatter with a leading sign.
    return this.toPercentString(delta, true);
  }
}
//endregion J.CMS_S.Helpers

//region Scene_Status
/**
 * Overwrites {@link #createButtons}.<br/>
 * Removes buttons because fuck the buttons.
 */
Scene_Status.prototype.createButtons = function()
{
};

/**
 * Overwrites {@link #create}.<br/>
 * Creates all windows and initializes state.
 */
Scene_Status.prototype.create = function()
{
  // perform base create.
  Scene_MenuBase.prototype.create.call(this);

  // initialize members/state.
  this.initMembers();

  // create Page 1 windows.
  this.createStatusWindow();
  this.createStatusParamsWindow();
  this.createStatusEquipWindow();

  // create Page 2 windows.
  this.createStatListWindow();
  this.createStatBreakdownWindow();

  // create the bottom-centered hint window (visible on both pages).
  this.createStatusHintWindow();

  // apply initial page visibility and activation.
  this.applyPageVisibility();
};

//region init
/**
 * Initializes all members and namespaced state for this scene.
 */
Scene_Status.prototype.initMembers = function()
{
  // ensure root namespaces for this scene branch.
  if (!this._j) this._j = {};
  if (!this._j._cms_s) this._j._cms_s = {};
  if (!this._j._cms_s._status) this._j._cms_s._status = {};

  // initialize window references.
  this._j._cms_s._status._windows = {
    _status: null,
    _params: null,
    _equip: null,
    _list: null,
    _breakdown: null,
    _hint: null,
  };

  // initialize state.
  this._j._cms_s._status._state = {
    _pageIndex: 0,
    _lastDir4: 0,
    _switchCooldown: 0,
  };
};
//endregion init

//region accessors (windows)
Scene_Status.prototype.getStatusWindow = function()
{
  return this._j._cms_s._status._windows._status;
};

Scene_Status.prototype.setStatusWindow = function(v)
{
  this._j._cms_s._status._windows._status = v;
};

Scene_Status.prototype.getParamsWindow = function()
{
  return this._j._cms_s._status._windows._params;
};

Scene_Status.prototype.setParamsWindow = function(v)
{
  this._j._cms_s._status._windows._params = v;
};

Scene_Status.prototype.getEquipWindow = function()
{
  return this._j._cms_s._status._windows._equip;
};

Scene_Status.prototype.setEquipWindow = function(v)
{
  this._j._cms_s._status._windows._equip = v;
};

Scene_Status.prototype.getStatListWindow = function()
{
  return this._j._cms_s._status._windows._list;
};

Scene_Status.prototype.setStatListWindow = function(v)
{
  this._j._cms_s._status._windows._list = v;
};

Scene_Status.prototype.getStatBreakdownWindow = function()
{
  return this._j._cms_s._status._windows._breakdown;
};

Scene_Status.prototype.setStatBreakdownWindow = function(v)
{
  this._j._cms_s._status._windows._breakdown = v;
};

Scene_Status.prototype.getStatusHintWindow = function()
{
  return this._j._cms_s._status._windows._hint;
};

Scene_Status.prototype.setStatusHintWindow = function(v)
{
  this._j._cms_s._status._windows._hint = v;
};
//endregion accessors (windows)

//region accessors (state)
Scene_Status.prototype.getPageIndex = function()
{
  return this._j._cms_s._status._state._pageIndex | 0;
};

Scene_Status.prototype.setPageIndex = function(v)
{
  this._j._cms_s._status._state._pageIndex = v | 0;
};

Scene_Status.prototype.getLastDir4 = function()
{
  return this._j._cms_s._status._state._lastDir4 | 0;
};

Scene_Status.prototype.setLastDir4 = function(v)
{
  this._j._cms_s._status._state._lastDir4 = v | 0;
};

Scene_Status.prototype.getSwitchCooldown = function()
{
  return this._j._cms_s._status._state._switchCooldown | 0;
};

Scene_Status.prototype.setSwitchCooldown = function(v)
{
  const frames = v | 0;
  this._j._cms_s._status._state._switchCooldown = Math.max(0, frames);
};
//endregion accessors (state)

/**
 * Overwrites {@link #refreshActor}.<br/>
 * Refresh all windows.
 */
Scene_Status.prototype.refreshActor = function()
{
  const actor = this.actor();
  this.getStatusWindow()
    .setActor(actor);
  this.getParamsWindow()
    .setActor(actor);
  this.getEquipWindow()
    .setActor(actor);

  // grab the window handles for reference.
  const list = this.getStatListWindow();
  const breakdown = this.getStatBreakdownWindow();

  // also set the actor on the list.
  list.setActor(actor);

  // also set the actor on the breakdown.
  breakdown.setContext(actor, list.currentLongParamId());
};

//region rect helpers
/**
 * The rectangle for the status window.
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusWindowRect = function()
{
  const wx = 0;
  const wy = 0;
  const ww = Math.round(Graphics.boxWidth * 0.3);
  const wh = Math.round(Graphics.boxHeight * 0.6);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * The rectangle for the equip window.
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusEquipWindowRect = function()
{
  const wx = 0;
  const wy = this.getStatusWindow().height;
  const ww = Math.round(Graphics.boxWidth * 0.3);
  const wh = Math.round(Graphics.boxHeight * 0.4);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * The rectangle for the parameters window.
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusParamsWindowRect = function()
{
  // grab the width of the status window.
  const wx = this.getStatusWindow().width;

  // compute the vertical offset from the hint’s height.
  const hintRect = this.statusHintWindowRect();
  const wy = hintRect.height;

  // keep the same width as before.
  const ww = Math.round(Graphics.boxWidth * 0.7);

  // fill remaining height beneath the hint.
  const wh = Graphics.boxHeight - wy;

  // border-to-border placement.
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * The rectangle for the stat list window.
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusStatListWindowRect = function()
{
  // start exactly after the left column.
  const wx = Math.round(Graphics.boxWidth * 0.3);

  // align directly under the hint (no top gap).
  const hintRect = this.statusHintWindowRect();
  const wy = hintRect.height;

  // arbitrary width.
  const ww = 440;

  // height fills the remaining space below the hint.
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * The rectangle for the stat breakdown window.
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusStatBreakdownWindowRect = function()
{
  // grab the list for relative positioning.
  const list = this.statusStatListWindowRect();

  // start at the list’s right edge.
  const wx = list.x + list.width;

  // align directly under the hint.
  const wy = this.statusHintWindowRect().height;

  // use the remaining width to the right;
  const ww = Graphics.boxWidth - wx;

  // fill the rest of the screen below the hint.
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * The rectangle for the hint window.
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusHintWindowRect = function()
{
  // start the hint immediately after the left column.
  const wx = this.getStatusWindow().width;

  // arbitrary y.
  const wy = 0;

  // the hint spans the remainder of the screen to the right.
  const ww = Graphics.boxWidth - wx;

  // arbitrary height.
  const wh = 60;

  return new Rectangle(wx, wy, ww, wh);
};
//endregion rect helpers

//region create
/**
 * Creates the status window and configures it.
 */
Scene_Status.prototype.createStatusWindow = function()
{
  const rect = this.statusWindowRect();
  const win = new Window_Status(rect);
  this.setStatusWindow(win);
  this.addWindow(win);
};

/**
 * Creates the parameters window and configures it.
 */
Scene_Status.prototype.createStatusParamsWindow = function()
{
  const rect = this.statusParamsWindowRect();
  const win = new Window_StatusParameters(rect);
  this.setParamsWindow(win);
  this.addWindow(win);
};

/**
 * Creates the equipment window and configures it.
 */
Scene_Status.prototype.createStatusEquipWindow = function()
{
  const rect = this.statusEquipWindowRect();
  const win = new Window_StatusEquip(rect);
  this.setEquipWindow(win);
  this.addWindow(win);
};

/**
 * Creates the stat list window and configures it.
 */
Scene_Status.prototype.createStatListWindow = function()
{
  const rect = this.statusStatListWindowRect();
  const list = new Window_StatusStatList(rect);
  this.setStatListWindow(list);
  list.setActor(this.actor());
  list.setChangeHandler(this.onStatListChanged.bind(this));
  this.addWindow(list);
};

/**
 * Creates the stat breakdown window and configures it.
 */
Scene_Status.prototype.createStatBreakdownWindow = function()
{
  const rect = this.statusStatBreakdownWindowRect();
  const breakdown = new Window_StatusStatBreakdown(rect);
  this.setStatBreakdownWindow(breakdown);
  breakdown.setContext(this.actor(), 0);
  this.addWindow(breakdown);
};

/**
 * Creates the bottom-centered hint window.
 */
Scene_Status.prototype.createStatusHintWindow = function()
{
  // build the hint rect.
  const rect = this.statusHintWindowRect();

  // create the hint window.
  const hint = new Window_StatusPageHint(rect);

  // store reference.
  this.setStatusHintWindow(hint);

  // add to the scene.
  this.addWindow(hint);
};
//endregion create

//region page switching + visibility
/**
 * An event that fires when the selected stat changes in the list window.
 */
Scene_Status.prototype.onStatListChanged = function()
{
  // if there is no index, don't execute the on-change event.
  if (this.getPageIndex() !== 1) return;

  // grab the selected long param id.
  const longId = this.getStatListWindow()
    .currentLongParamId();

  // update the context of the breakdown window.
  this.getStatBreakdownWindow()
    .setContext(this.actor(), longId);
};

/**
 * Applies visibility to the windows based on the current page index.
 */
Scene_Status.prototype.applyPageVisibility = function()
{
  // determine which page is currently active.
  const isPage1 = this.getPageIndex() === 0;
  const isPage2 = this.getPageIndex() === 1;

  // always show the left-side status and equip windows on both pages.
  this.getStatusWindow().visible = true;
  this.getEquipWindow().visible = true;

  // toggle the right-hand content by page.
  this.getParamsWindow().visible = isPage1;

  this.getStatBreakdownWindow().visible = isPage2;

  // keep the hint visible on both pages.
  this.getStatusHintWindow().visible = true;

  const listWindow = this.getStatListWindow();
  listWindow.visible = isPage2;

  // manage activation for the selectable list only when Page 2 is active.
  if (isPage1)
  {
    // deactivate the list window for page 1.
    listWindow.deactivate();
  }
  else
  {
    // activate the list window for page 2.
    listWindow.activate();

    // autoselect the first item in the list of we haven't selected anything yet.
    if (listWindow.index() === -1)
    {
      listWindow.select(0);
    }
  }
};
//endregion page switching + visibility

//region update
/**
 * Extends {@link #update}.<br/>
 * Also handles page switching and cooldowns.
 */
J.CMS_S.Aliased.Scene_Status.set('update', Scene_Status.prototype.update);
Scene_Status.prototype.update = function()
{
  // perform original logic.
  J.CMS_S.Aliased.Scene_Status.get('update')
    .call(this);

  // watch for the cancel button, it leaves the scene.
  if (Input.isTriggered('cancel'))
  {
    this.popScene();
    return;
  }

  // also update the page switch cooldown.
  this.updatePageSwitchCooldown();
};

/**
 * Updates the page switch cooldown.
 */
Scene_Status.prototype.updatePageSwitchCooldown = function()
{
  // decrement the switch cooldown if any.
  const cooldown = this.getSwitchCooldown();

  // check if we need to cool down.
  if (cooldown > 0)
  {
    // decrement the cooldown.
    const nextFrames = cooldown - 1;

    // update the cooldown.
    this.setSwitchCooldown(nextFrames);

    // stop processing.
    return;
  }

  // handle page switching when not cooling down.
  if (this.getSwitchCooldown() === 0)
  {
    // handle the potential for page switching.
    this.handlePageSwitching();
  }
};

/**
 * Handles page switching between status breakdown and stat overview.
 */
Scene_Status.prototype.handlePageSwitching = function()
{
  // check for left/right inputs.
  const goPrev = Input.isTriggered('left') || Input.isTriggered('dpad-left');
  const goNext = Input.isTriggered('right') || Input.isTriggered('dpad-right');

  // check if we received input.
  if (goPrev || goNext)
  {
    // identify the next page index.
    const next = (this.getPageIndex() + 1) % 2;

    // flip the index.
    this.setPageIndex(next);

    // update the visibility of the windows.
    this.applyPageVisibility();

    // update the stat list if needed.
    this.onStatListChanged();

    // small debounce to avoid rapid flips when holding.
    this.setSwitchCooldown(12);
  }
};
//endregion update
//endregion Scene_Status

//region Window_Status
/**
 * Overwrites {@link #drawBlock1}.<br/>
 * Renders the actor name and class without the nickname.
 */
Window_Status.prototype.drawBlock1 = function()
{
  // grab the y coordinate.
  const y = this.block1Y();

  // draw the components.
  this.drawActorName(this._actor, 0, y, 168);
  this.drawActorClass(this._actor, 204, y, 168);

  // don't draw the nickname.
};

/**
 * Overwrites {@link #drawBlock2}.<br/>
 * Renders the actor face, basic info, and experience at non-default positioning.
 */
Window_Status.prototype.drawBlock2 = function()
{
  // grab the y coordinate.
  const y = this.block2Y();

  // draw the components.
  this.drawActorFace(this._actor, 12, y);
  this.drawBasicInfo(204, y);
  this.drawExpInfo(0, y + 250);
};
//endregion Window_Status

//region Window_StatusPageHint
/**
 * A tiny, non-interactive window that informs the player they can use Left/Right
 * to switch the right-hand view in the Status scene.
 */
class Window_StatusPageHint
  extends Window_Base
{
  /**
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // build base window.
    super(rect);

    // draw static content.
    this.refresh();
  }

  //endregion init

  //region drawing
  /**
   * Redraws the hint text centered within the window.
   */
  refresh()
  {
    // clear any existing content.
    this.contents.clear();

    // compute drawing rect.
    const { innerWidth } = this;
    const x = 0;
    const y = 0;

    // pull text to draw.
    const text = 'Left/Right: Switch View';

    // use the system color to denote hint/instruction.
    this.changeTextColor(ColorManager.systemColor());

    // center the hint within the window.
    this.drawText(text, x, y, innerWidth, 'center');

    // reset text color to default.
    this.resetTextColor();
  }

  //endregion drawing
}

//endregion Window_StatusPageHint

//region Window_StatusParameters
/**
 * A replacement class for `Window_StatusParams`, which originally extended `Window_Selectable`
 * and rendered only the b-params. This window now extends `Window_Base` and renders all
 * params, including b-/x-/s- params.
 */
class Window_StatusParameters
  extends Window_Base
{
  /**
   * @param {Rectangle} rect A rectangle that represents the shape of this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initMembers();
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    this.actor = null;
  }

  /**
   * Overwrites {@link #lineHeight}.<br/>
   * Reduces line height for this window.
   * @returns {number}
   */
  lineHeight()
  {
    return 32;
  }

  /**
   * Sets the actor for this window to draw parameter data for.
   * @param {Game_Actor} actor The actor to set.
   */
  setActor(actor)
  {
    this.actor = actor;
    this.refresh();
  }

  /**
   * Refreshes this window by clearing it and redrawing all its contents.
   */
  refresh()
  {
    this.contents.clear();
    this.drawContent();
  }

  /**
   * Draws all content in this window.
   */
  drawContent()
  {
    // if we don't have an actor to render the parameters for, don't.
    if (!this.actor) return;

    // define the two column x coordinates.
    const [ column1X, column2X ] = [ 0, 500 ];

    // define the three row y coordinates.
    const [ row1Y, row2Y, row3Y, row4Y ] = [ 0, 180, 360, 470 ];

    // draw row 1.
    this.drawCombatStats(column1X, row1Y);
    this.drawVitalityStats(column2X, row1Y);

    // draw row 2.
    this.drawPrecisionStats(column1X, row2Y);
    this.drawDefensiveStats(column2X, row2Y);

    // draw row 3.
    this.drawMobilityStats(column1X, row3Y);
    this.drawFateStats(column2X, row3Y);

    // draw row 4.
    this.drawElementalRates(column1X, row4Y);
    this.drawStateRates(column2X, row4Y);
  }

  /**
   * Draws all vitality-related stats, such as max hp and the regenerations.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawVitalityStats(x, y)
  {
    // draw the title for damage.
    this.drawTitle("Vitality", x, (y - 15), 7, 3);

    // the width of the section.
    const w = 450;

    // combine the base for each row to have to accommodate the title underline.
    const rowBaseY = y + 8;

    // draw the T separator; arbitrary line height decision by design.
    this.drawTSeparator(x, rowBaseY - 2, w, 4);

    // draw the parameters for the combat
    this.drawVitalityParameters(x, rowBaseY, w);
  }

  /**
   * Draws the vitality parameter section.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the parameter section.
   */
  drawVitalityParameters(x, y, w)
  {
    // shorthand for line height.
    const lh = this.lineHeight();

    // the width of the column of parameters.
    const parameterWidth = w / 2;

    // define the right column's x coordinate.
    const rightX = x + parameterWidth + 16;

    // define the first row's y coordinate.
    const row1y = y + (lh * 1);

    // define the second row's y coordinate.
    const row2y = y + (lh * 2);

    // define the third row's y coordinate.
    const row3y = y + (lh * 3);

    // define the fourth row's y coordinate.
    const row4y = y + (lh * 4);

    // get the max hp.
    const mhpParam = this.makeParameter(0);

    // get the max mp.
    const mmpParam = this.makeParameter(1);

    // get the max tp.
    const mtpParam = this.makeParameter(30);

    // get the rec parameter.
    const recParam = this.makeParameter(20);

    // get the hrg parameter.
    const hrgParam = this.makeParameter(15);

    // get the mrg parameter.
    const mrgParam = this.makeParameter(16);

    // get the trg parameter.
    const trgParam = this.makeParameter(17);

    // get the pha parameter.
    const phaParam = this.makeParameter(21);

    // draw the max hp parameter on the left.
    this.drawParameterLeft(x, row1y, parameterWidth, mhpParam);

    // draw the hp regen parameter on the right.
    this.drawParameterRight(rightX, row1y, parameterWidth, hrgParam);

    // draw the max mp parameter on the left.
    this.drawParameterLeft(x, row2y, parameterWidth, mmpParam);

    // draw the mp regen parameter on the right.
    this.drawParameterRight(rightX, row2y, parameterWidth, mrgParam);

    // draw the max tp parameter on the left.
    this.drawParameterLeft(x, row3y, parameterWidth, mtpParam);

    // draw the tp regen parameter on the right.
    this.drawParameterRight(rightX, row3y, parameterWidth, trgParam);

    // draw the max tp parameter on the left.
    this.drawParameterLeft(x, row4y, parameterWidth, recParam);

    // draw the tp regen parameter on the right.
    this.drawParameterRight(rightX, row4y, parameterWidth, phaParam);
  }

  /**
   * Draws all core combat stats, such as power and force.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawCombatStats(x, y)
  {
    // draw the title for damage.
    this.drawTitle("Combat", x, (y - 15), 76, 10);

    // the width of the section.
    const w = 450;

    // combine the base for each row to have to accommodate the title underline.
    const rowBaseY = y + 8;

    // draw the T separator; arbitrary line height decision by design.
    this.drawTSeparator(x, (rowBaseY - 4), w, 2);

    // draw the parameters for the combat
    this.drawCombatParameters(x, rowBaseY, w);
  }

  /**
   * Draws the combat parameter section.
   * @param {number} leftX The x coordinate.
   * @param {number} rowBaseY The y coordinate.
   * @param {number} sectionWidth The width of the parameter section.
   */
  drawCombatParameters(leftX, rowBaseY, sectionWidth)
  {
    // shorthand for line height.
    const lh = this.lineHeight();

    // the width of the column of parameters.
    const parameterWidth = sectionWidth / 2;

    // define the right column's x coordinate.
    const rightX = leftX + parameterWidth + 16;

    // define the first row's y coordinate.
    const row1y = rowBaseY + (lh * 1);

    // get the attack parameter.
    const atkParam = this.makeParameter(2);

    // get the force parameter.
    const matParam = this.makeParameter(4);

    // get the magicreflect parameter.
    const mrfParam = this.makeParameter(13);

    // get the autocounter parameter.
    const cntParam = this.makeParameter(14);

    // draw the power parameter on the left.
    this.drawParameterLeft(leftX, row1y, parameterWidth, atkParam);

    // draw the force parameter on the right.
    this.drawParameterRight(rightX, row1y, parameterWidth, matParam);

    // define the second row's y coordinate.
    const row2y = rowBaseY + (lh * 2);

    // draw the power parameter on the left.
    this.drawParameterLeft(leftX, row2y, parameterWidth, cntParam);

    // draw the force parameter on the right.
    this.drawParameterRight(rightX, row2y, parameterWidth, mrfParam);
  }

  /**
   * Draws all precision-related stats, such as hit, crit, and parry.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawPrecisionStats(x, y)
  {
    // draw the title for damage.
    this.drawTitle("Precision", x, (y - 15), 1756, 6);

    // the width of the section.
    const w = 450;

    // combine the base for each row to have to accommodate the title underline.
    const rowBaseY = y + 8;

    // draw the T separator; arbitrary line height decision by design.
    this.drawTSeparator(x, rowBaseY - 2, w, 4);

    // draw the parameters for the combat
    this.drawPrecisionParameters(x, rowBaseY, w);
  }

  /**
   * Draws the precision parameter section.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the parameter section.
   */
  drawPrecisionParameters(x, y, w)
  {
    // shorthand for line height.
    const lh = this.lineHeight();

    // the width of the column of parameters.
    const parameterWidth = w / 2;

    // define the right column's x coordinate.
    const rightX = x + parameterWidth + 16;

    // define the first row's y coordinate.
    const row1y = y + (lh * 1);

    // define the second row's y coordinate.
    const row2y = y + (lh * 2);

    // define the third row's y coordinate.
    const row3y = y + (lh * 3);

    // define the fourth row's y coordinate.
    const row4y = y + (lh * 4);

    // get the hit parameter.
    const hitParam = this.makeParameter(8);

    // get the grd parameter.
    const grdParam = this.makeParameter(19);

    // get the agi parameter.
    const agiParam = this.makeParameter(6);

    // get the eva parameter.
    const evaParam = this.makeParameter(9);

    // get the cri parameter.
    const criParam = this.makeParameter(10);

    // get the cev parameter.
    const cevParam = this.makeParameter(11);

    // get the cdm parameter.
    const cdmParam = this.makeParameter(28);

    // get the cdr parameter.
    const cdrParam = this.makeParameter(29);

    // draw the hit parameter on the left.
    this.drawParameterLeft(x, row1y, parameterWidth, hitParam);

    // draw the parry (grd) parameter on the right.
    this.drawParameterRight(rightX, row1y, parameterWidth, grdParam);

    // draw the agility parameter on the left.
    this.drawParameterLeft(x, row2y, parameterWidth, agiParam);

    // draw the parry boost (eva) parameter on the right.
    this.drawParameterRight(rightX, row2y, parameterWidth, evaParam);

    // draw the crit chance parameter on the left.
    this.drawParameterLeft(x, row3y, parameterWidth, criParam);

    // draw the crit evade parameter on the right.
    this.drawParameterRight(rightX, row3y, parameterWidth, cevParam);

    // draw the crit damage multiplier parameter on the left.
    this.drawParameterLeft(x, row4y, parameterWidth, cdmParam);

    // draw the crit damage reduction parameter on the right.
    this.drawParameterRight(rightX, row4y, parameterWidth, cdrParam);
  }

  /**
   * Draws all defensive stats, such as endure and .
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawDefensiveStats(x, y)
  {
    // draw the title for damage.
    this.drawTitle("Defensive", x, (y - 15), 1625, 26);

    // the width of the section.
    const w = 450;

    // combine the base for each row to have to accommodate the title underline.
    const rowBaseY = y + 8;

    // draw the T separator; arbitrary line height decision by design.
    this.drawTSeparator(x, (rowBaseY - 4), w, 2);

    // draw the parameters for the combat
    this.drawDefensiveParameters(x, rowBaseY, w);
  }

  /**
   * Draws the combat parameter section.
   * @param {number} leftX The x coordinate.
   * @param {number} rowBaseY The y coordinate.
   * @param {number} sectionWidth The width of the parameter section.
   */
  drawDefensiveParameters(leftX, rowBaseY, sectionWidth)
  {
    // shorthand for line height.
    const lh = this.lineHeight();

    // the width of the column of parameters.
    const parameterWidth = sectionWidth / 2;

    // define the right column's x coordinate.
    const rightX = leftX + parameterWidth + 16;

    // define the first row's y coordinate.
    const row1y = rowBaseY + (lh * 1);

    // define the second row's y coordinate.
    const row2y = rowBaseY + (lh * 2);

    // get the defense parameter.
    const defParam = this.makeParameter(3);

    // get the resist parameter.
    const mdfParam = this.makeParameter(5);

    // get the phys damage down parameter.
    const pdrParam = this.makeParameter(24);

    // get the magi damage down parameter.
    const mdrParam = this.makeParameter(25);

    // draw the power parameter on the left.
    this.drawParameterLeft(leftX, row1y, parameterWidth, defParam);

    // draw the force parameter on the right.
    this.drawParameterRight(rightX, row1y, parameterWidth, mdfParam);

    // draw the power parameter on the left.
    this.drawParameterLeft(leftX, row2y, parameterWidth, pdrParam);

    // draw the force parameter on the right.
    this.drawParameterRight(rightX, row2y, parameterWidth, mdrParam);
  }

  /**
   * Draws all mobility stats, such as movespeed.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawMobilityStats(x, y)
  {
    // draw the title for damage.
    this.drawTitle("Mobility", x, (y - 15), 82, 20);

    // the width of the section.
    const w = 450;

    // combine the base for each row to have to accommodate the title underline.
    const rowBaseY = y + 8;

    // draw the T separator; arbitrary line height decision by design.
    this.drawTSeparator(x, (rowBaseY - 4), w, 1);

    // draw the parameters for the combat
    this.drawMobilityParameters(x, rowBaseY, w);
  }

  /**
   * Draws the mobility parameter section.
   * @param {number} leftX The x coordinate.
   * @param {number} rowBaseY The y coordinate.
   * @param {number} sectionWidth The width of the parameter section.
   */
  drawMobilityParameters(leftX, rowBaseY, sectionWidth)
  {
    // shorthand for line height.
    const lh = this.lineHeight();

    // the width of the column of parameters.
    const parameterWidth = sectionWidth / 2;

    // define the first row's y coordinate.
    const row1y = rowBaseY + (lh * 1);

    // get the move speed boost parameter.
    const msbParam = this.makeParameter(31);

    // draw the power parameter on the left.
    this.drawParameterLeft(leftX, row1y, parameterWidth, msbParam);
  }

  /**
   * Draws all fate-related stats, such as experience rate and luck.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawFateStats(x, y)
  {
    // draw the title for damage.
    this.drawTitle("Fate", x, (y - 15), 1619, 27);

    // the width of the section.
    const w = 450;

    // combine the base for each row to have to accommodate the title underline.
    const rowBaseY = y + 8;

    // draw the T separator; arbitrary line height decision by design.
    this.drawTSeparator(x, (rowBaseY - 4), w, 2);

    // draw the parameters for the combat
    this.drawFateParameters(x, rowBaseY, w);
  }

  /**
   * Draws the fate parameter section.
   * @param {number} leftX The x coordinate.
   * @param {number} rowBaseY The y coordinate.
   * @param {number} sectionWidth The width of the parameter section.
   */
  drawFateParameters(leftX, rowBaseY, sectionWidth)
  {
    // shorthand for line height.
    const lh = this.lineHeight();

    // the width of the column of parameters.
    const parameterWidth = sectionWidth / 2;

    // define the right column's x coordinate.
    const rightX = leftX + parameterWidth + 16;

    // define the first row's y coordinate.
    const row1y = rowBaseY + (lh * 1);

    // get the fortune parameter.
    const lukParam = this.makeParameter(7);

    // get the experience rate parameter.
    const exrParam = this.makeParameter(27);

    // get the skill proficiency boost parameter.
    const spbParam = this.makeParameter(32);

    // get the sdp multiplier bonus parameter.
    const smbParam = this.makeParameter(33);

    // draw the luck parameter on the left.
    this.drawParameterLeft(leftX, row1y, parameterWidth, lukParam);

    // draw the experience parameter on the right.
    this.drawParameterRight(rightX, row1y, parameterWidth, exrParam);

    // define the second row's y coordinate.
    const row2y = rowBaseY + (lh * 2);

    // draw the proficiency parameter on the left.
    this.drawParameterLeft(leftX, row2y, parameterWidth, spbParam);

    // draw the sdp parameter on the right.
    this.drawParameterRight(rightX, row2y, parameterWidth, smbParam);
  }

  /**
   * Draws a T separator by using a horizontal and vertical line.
   * The length of these lines is defined by the section width and the number of lines.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the T separator.
   * @param {number=} lines The height of the T separator, multiplied by `lineHeight`; defaults to 1 line.
   */
  drawTSeparator(x, y, w, lines = 1)
  {
    // shorthand the line height.
    const lh = this.lineHeight();

    // define the first row's y coordinate.
    const firstRowY = y + (lh * 1);

    // separate the title from the parameters, for visual effect.
    this.drawHorizontalLine(x, firstRowY - 4, w + 16, 3);

    // define the right column's x coordinate.
    const secondColumnX = x + (w / 2) + 12;

    // define the x coordinate for the vertical line.
    const verticalLineX = secondColumnX - 4;

    // define the height in pixels for the vertical line.
    const verticalLineHeight = (lh * lines) + 4;

    // separate the two columns of parameters, for visual effect.
    this.drawVerticalLine(verticalLineX, firstRowY - 2, verticalLineHeight, 3);

  }

  /**
   * Creates a new parameter object that contains the necessary data to draw it into the window.
   * @param {number} longParamId The "long" parameter id.
   * @returns {StatusParameter} The compiled {@link StatusParameter}.
   */
  makeParameter(longParamId)
  {
    // get the parameter value.
    const value = this.actor.longParam(longParamId);

    // return a newly constructed status parameter.
    return new StatusParameter(value, longParamId);
  }

  /**
   * Draws a {@link StatusParameter} at the designated coordinates, left-aligned.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The total width of the section.
   * @param {StatusParameter} parameter The parameter to draw details for.
   */
  drawParameterLeft(x, y, w, parameter)
  {
    // clear text color modifiers.
    this.resetFontSettings();

    // draw the icon.
    this.drawIcon(parameter.iconIndex, x, y);

    // reduce the font size a bit.
    this.makeFontSmaller();

    // swap the text color over to the color index if available.
    this.changeTextColor(ColorManager.textColor(parameter.colorIndex));

    // calculate a modified x to accommodate the icon.
    const iconPaddedX = x + ImageManager.iconWidth + 4;

    // the width of the name.
    const nameWidth = w * 0.70;

    // draw the name of the parameter at the modified x.
    this.drawText(`${parameter.name}`, iconPaddedX, y, nameWidth, 'left');

    // calculate a modified x to further accommodate the name as well.
    const iconNamePaddedX = iconPaddedX + (w * 0.45);

    // the width of the value.
    const valueWidth = w * 0.40;

    // get the pretty value of this parameter.
    const value = parameter.prettyValue();

    // draw the value of the parameter at an even further modified x.
    this.drawText(value, iconNamePaddedX, y, valueWidth, 'right');

    // clear text color modifiers.
    this.resetFontSettings();
  }

  /**
   * Draws a {@link StatusParameter} at the designated coordinates, left-aligned.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The total width of the section.
   * @param {StatusParameter} parameter The parameter to draw details for.
   */
  drawParameterRight(x, y, w, parameter)
  {
    // clear text color modifiers.
    this.resetFontSettings();

    // swap the text color over to the color index if available.
    this.changeTextColor(ColorManager.textColor(parameter.colorIndex));

    // reduce the font size a bit.
    this.makeFontSmaller();

    // the width of the value.
    const valueWidth = w * 0.40;

    // get the pretty value of this parameter.
    const value = parameter.prettyValue();

    // draw the value of the parameter at an even further modified x.
    this.drawText(value, x, y, valueWidth, 'left');

    // calculate a modified x to accommodate the value.
    const valuePaddedX = x + (valueWidth * 0.45);

    // the width of the name.
    const nameWidth = w * 0.70;

    // draw the name of the parameter at the modified x.
    this.drawText(`${parameter.name}`, valuePaddedX, y, nameWidth, 'right');

    // calculate a modified x to further accommodate the name as well.
    const nameValuePaddedX = valuePaddedX + nameWidth;

    // draw the icon.
    this.drawIcon(parameter.iconIndex, nameValuePaddedX, y);

    // clear text color modifiers.
    this.resetFontSettings();
  }

  /**
   * Overwrites {@link #makeFontSmaller}.<br/>
   * Makes the reduction step smaller.
   */
  makeFontSmaller()
  {
    if (this.contents.fontSize >= 24)
    {
      this.contents.fontSize -= 6;
    }
  }

  /**
   * Overwrites {@link #makeFontBigger}.<br/>
   * Makes the expansion step smaller.
   */
  makeFontBigger()
  {
    if (this.contents.fontSize <= 96)
    {
      this.contents.fontSize += 6;
    }
  }

  /**
   * Draws the elemental rates section.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   * @param {number} limit The endpoint if applicable of elements to pull.
   */
  drawElementalRates(x, y, limit = 10)
  {
    // draw the title for this section.
    this.drawTitle("Elemental Affiliations", x, y - 10, 64, 8);

    // draw a visual separator from title and data.
    this.drawHorizontalLine(x, y + 36, 450, 3);

    // grab all relevant elements.
    const elements = $dataSystem.elements.slice(0, limit);

    // iterate over each element to draw it.
    elements.forEach((elementName, index) =>
    {
      // calculate the y coordinate.
      const modY = y + ((index + 1) * this.lineHeight()) + 8;

      // calculate the rate.
      const rate = ((this.actor.traitsPi(11, index)) * 100);

      // initialize the color index to default.
      let colorIndex = 0;

      // check if the rate is over the base 100 rate.
      if (rate > 100)
      {
        // higher rates mean more incoming damage.
        colorIndex = 10; // red
      }
      // check if the rate is under the base 100 rate.
      else if (rate < 100 && rate > 0)
      {
        // lower rates mean less incoming damage.
        colorIndex = 3; // green
      }
      else if (rate === 0)
      {
        colorIndex = 7; // grey
      }

      // determine the icon index for the element.
      const iconIndex = IconManager.element(index);

      // determine the element name.
      const actualElementName = (elementName === String.empty)
        ? "Neutral"
        : elementName;

      let ratePrefix = String.empty;
      if (J.ELEM && this.actor.isElementAbsorbed(index))
      {
        ratePrefix = "-"; // prefix with a minus to indicate absorption.
        colorIndex = 5; // set it to purple regardless of greater or lesser than 100.
      }

      this.drawParameter(`${actualElementName}`, `${ratePrefix}${rate}%`, iconIndex, x + 40, modY, colorIndex);
    });
  }

  /**
   * Draws the state rates section.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawStateRates(x, y)
  {
    // draw the title
    this.drawTitle("Ailment Resistances", x, y - 10, 2, 8);

    // draw a visual separator from title and data.
    this.drawHorizontalLine(x, y + 36, 450, 3);

    const states = $dataStates.slice(4, 18);
    states.forEach((state, index) =>
    {
      if (!state) return;

      const modY = y + ((index + 1) * this.lineHeight()) + 8;
      let rate = ((this.actor.traitsPi(13, state.id)) * 100);

      if (this.actor.isStateResist(state.id))
      {
        rate = 0;
      }

      let colorIndex = 0;
      if (rate > 100)
      {
        colorIndex = 10; // red
      }
      else if (rate < 100 && rate > 0)
      {
        colorIndex = 3; // green
      }
      else if (rate === 0)
      {
        colorIndex = 7; // grey
      }

      this.drawParameter(`${state.name}`, `${rate}%`, state.iconIndex, x + 40, modY, colorIndex);
    });
  }

  /**
   * Draws the given data as "a parameter".
   * @param {string} name The name of the parameter.
   * @param {number} value The value of the parameter.
   * @param {number} iconIndex The icon index for this parameter.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   * @param {number} colorIndex The color index for this parameter.
   */
  drawParameter(name, value, iconIndex, x, y, colorIndex = 0)
  {
    this.resetTextColor();
    const modifiedX = x + 36;
    this.drawIcon(iconIndex, x, y);
    this.drawText(`${name}`, modifiedX, y, 200);
    this.changeTextColor(ColorManager.textColor(colorIndex));
    this.drawText(`${value}`, modifiedX + 200, y, 250);
  }

  /**
   * Draws the title of one of the sections for parameters.
   * @param {string} text The text to write as the title.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   * @param {number=} iconIndex The icon index for this parameter; defaults to none(0).
   * @param {number=} colorIndex The color index for the title; defaults to system color(1).
   * @param {string=} alignment The text-alignment value of the title; defaults to "center".
   */
  drawTitle(text, x, y, iconIndex = 0, colorIndex = 1, alignment = "center")
  {
    // clear any font modifications.
    this.resetFontSettings();

    // draw the icon of the title.
    this.drawIcon(iconIndex, x, y + 16);

    // swap the color over to the title color.
    this.changeTextColor(ColorManager.textColor(colorIndex));

    // upsize the title!
    this.makeFontBigger();

    // draw the title itself.
    this.drawText(text, x + 32, y + 16, 350, alignment);

    // clear our font modifications because we're good tech citizens.
    this.resetFontSettings();
  }
}

//endregion Window_StatusParameters

//region Window_StatusStatBreakdown
/**
 * A read-only window that explains where a stat comes from.
 */
class Window_StatusStatBreakdown
  extends Window_Base
{
  /**
   * The various kinds of breakdowns we can draw.
   * @type {{Base: string, Ex: string, Special: string, Mtp: string, Crit: string, Custom: string}}
   */
  static KINDS = {
    Base: 'bparam',
    Ex: 'xparam',
    Special: 'sparam',
    Mtp: 'mtp',
    Crit: 'crit',
    Custom: 'custom',
  };

  /**
   * Constructor.
   * @param {Rectangle} rect The window rectangle.
   */
  constructor(rect)
  {
    super(rect);
    this.initMembers();
  }

  //region init
  initMembers()
  {
    if (!this._j) this._j = {};
    if (!this._j._cms_s) this._j._cms_s = {};
    if (!this._j._cms_s._status) this._j._cms_s._status = {};
    this._j._cms_s._status._breakdown = {
      _actor: null,
      _longParamId: 0,
    };
  }

  //endregion init

  //region accessors
  /** @returns {Game_Actor} */
  getActor()
  {
    return this._j._cms_s._status._breakdown._actor;
  }

  /** @param {Game_Actor} v */
  setActor(v)
  {
    this._j._cms_s._status._breakdown._actor = v;
  }

  /** @returns {number} */
  getLongParamId()
  {
    return this._j._cms_s._status._breakdown._longParamId | 0;
  }

  /** @param {number} v */
  setLongParamId(v)
  {
    this._j._cms_s._status._breakdown._longParamId = v | 0;
  }

  //endregion accessors

  //region public api
  /**
   * Sets the context and refreshes the panel.
   * @param {Game_Actor} actor The actor.
   * @param {number} longParamId The long param id.
   */
  setContext(actor, longParamId)
  {
    this.setActor(actor);
    this.setLongParamId(longParamId);
    this.refresh();
  }

  //endregion public api

  //region draw lifecycle
  lineHeight()
  {
    return 28;
  }

  refresh()
  {
    this.contents.clear();
    if (!this.getActor()) return;
    this.drawBreakdown();
  }

  //endregion draw lifecycle

  //region drawing (orchestration)
  /**
   * Orchestrates the breakdown drawing for the current stat, including
   * a two-line description beneath the header pulled from TextManager.
   */
  drawBreakdown()
  {
    // gather context.
    const actor = this.getActor();
    const longId = this.getLongParamId();

    // header visuals.
    const name = TextManager.longParam(longId);
    const icon = IconManager.longParam(longId);
    const color = ColorManager.longParam(longId);

    // final value mirrors Page 1 formatting.
    const finalValue = new StatusParameter(actor.longParam(longId), longId).prettyValue(false);

    // layout.
    const gutter = 16;
    const widthUsable = this.innerWidth - gutter;
    const headerX = 0;
    const headerY = 0;

    // draw the header (icon + name on the left, value on the right).
    this.changeTextColor(ColorManager.textColor(color));
    this.drawIcon(icon, headerX, headerY + 2);
    this.drawText(name, headerX + 36, headerY, widthUsable - 36, 'left');
    this.resetTextColor();
    this.drawText(finalValue, headerX, headerY, widthUsable, 'right');

    // draw the two-line description just under the header.
    // leverage TextManager.longParamDescription(longId) from J.BASE.
    const descriptionLines = TextManager.longParamDescription(longId);

    // establish the starting y for descriptions (one row below the header).
    let cursorY = headerY + this.lineHeight();

    // draw the first description line.
    if (descriptionLines && descriptionLines.length >= 1)
    {
      this.drawText(descriptionLines[0], headerX, cursorY, widthUsable, 'left');
      cursorY += this.lineHeight();
    }

    // draw the second description line, if provided.
    if (descriptionLines && descriptionLines.length >= 2)
    {
      this.drawText(descriptionLines[1], headerX, cursorY, widthUsable, 'left');
      cursorY += this.lineHeight();
    }

    // add a small gap after the descriptions for readability.
    cursorY += 16;

    // resolve kind and draw body accordingly.
    const kind = this.resolveKind(longId);

    switch (kind)
    {
      case Window_StatusStatBreakdown.KINDS.Base:
        this.drawBParamBreakdown(actor, longId, headerX, cursorY, widthUsable);
        break;
      case Window_StatusStatBreakdown.KINDS.Ex:
        this.drawXParamBreakdown(actor, longId - 8, headerX, cursorY, widthUsable);
        break;
      case Window_StatusStatBreakdown.KINDS.Special:
        this.drawSParamBreakdown(actor, longId - 18, headerX, cursorY, widthUsable);
        break;
      case Window_StatusStatBreakdown.KINDS.Mtp:
        this.drawMtpBreakdown(actor, headerX, cursorY, widthUsable);
        break;
      case Window_StatusStatBreakdown.KINDS.Crit:
        this.drawCritBreakdown(actor, longId - 28, headerX, cursorY, widthUsable);
        break;
      case Window_StatusStatBreakdown.KINDS.Custom:
        this.drawCustomBreakdown(actor, longId, headerX, cursorY, widthUsable);
        break;
      default:
        this.drawText('No breakdown available for this stat.', headerX, cursorY, widthUsable, 'left');
        break;
    }
  }

  //endregion drawing (orchestration)

  //region kind resolution
  /**
   * Resolves the kind from a long param id.
   * @param {number} longId The long param id.
   * @returns {string}
   */
  resolveKind(longId)
  {
    if (longId === 30) return Window_StatusStatBreakdown.KINDS.Mtp;
    if (longId >= 0 && longId <= 7) return Window_StatusStatBreakdown.KINDS.Base;
    if (longId >= 8 && longId <= 17) return Window_StatusStatBreakdown.KINDS.Ex;
    if (longId >= 18 && longId <= 27) return Window_StatusStatBreakdown.KINDS.Special;
    if (longId >= 28 && longId <= 29) return Window_StatusStatBreakdown.KINDS.Crit;
    return Window_StatusStatBreakdown.KINDS.Custom;
  }

  //endregion kind resolution

  //region drawing
  /**
   * Draws the b-param breakdown.
   * @param {Game_Actor} actor
   * @param {number} longId
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @returns {number}
   */
  drawBParamBreakdown(actor, longId, x, y, w)
  {
    // Map longId directly to b-parameter id.
    const paramId = longId;

    // Derive the pre-NATURAL base using the NATURAL-only accessor.
    const baseNaturalOnly = actor.paramBaseNaturalBonuses(paramId);

    // Pull the base with NATURAL from the actor.
    const baseWithNatural = actor.paramBase(paramId);

    // Compute the vanilla (pre-NATURAL) base.
    const baseVanilla = baseWithNatural - baseNaturalOnly;

    // Read NATURAL Growth components.
    const natGrowthPlus = actor.bParamGrowthPlus(paramId);
    const natGrowthRate = actor.bParamGrowthRate(paramId);

    // Convert plus/rate pair into a concrete delta against the vanilla base.
    const natGrowthDeltaRaw = this.calcPlusRate(actor, baseVanilla, natGrowthPlus, natGrowthRate);
    const natGrowthDelta = Math.round(natGrowthDeltaRaw);

    // Read NATURAL Buff components.
    const natBuffPlus = actor.bParamBuffPlus(paramId);
    const natBuffRate = actor.bParamBuffRate(paramId);

    // Compute the concrete buff delta against the vanilla base.
    const natBuffDeltaRaw = this.calcPlusRate(actor, baseVanilla, natBuffPlus, natBuffRate);
    const natBuffDelta = Math.round(natBuffDeltaRaw);

    // NATURAL-inclusive base we’ll use as the baseline for flats/traits (Growths + Buffs).
    const baseNatural = baseVanilla + natGrowthDelta + natBuffDelta;

    // Flats by source (equips/states) from core param arrays.
    const equipFlat = this.sumEquipBParamFlat(actor, paramId);
    const stateFlat = this.sumStateBParamFlat(actor, paramId);

    // Trait multipliers by group.
    const trActor = this.paramRateFromTraits([ actor.actor() ], paramId);
    const trClass = this.paramRateFromTraits([ actor.currentClass() ], paramId);
    const trEquips = this.paramRateFromTraits(actor.equips()
      .filter(equip => !!equip), paramId);
    const trStates = this.paramRateFromTraits(actor.states(), paramId);

    // Multiply them together for a single product.
    const traitsProduct = trActor * trClass * trEquips * trStates;

    // Numeric baseline that traits will act upon.
    const preRateBase = baseNatural + (equipFlat + stateFlat);

    // Compute the absolute delta from traits.
    const traitsDelta = Math.round(preRateBase * (traitsProduct - 1.0));

    // SDP (Panels) — compute contribution and gather non-zero rows.
    const totalWithSdp = actor.param(paramId);
    const sdpCore = this._sdpCoreCoefficients(actor, paramId);
    const preSdpBase = this._solvePreSdpBaseCore(totalWithSdp, sdpCore.k, sdpCore.c);
    const rawPanelDeltas = this._computeSdpCorePanelDeltas(preSdpBase, sdpCore.panels);
    const sdpPanelDeltas = rawPanelDeltas.filter(p => p.delta !== 0);
    const sdpTotalDelta = sdpPanelDeltas.reduce((n, p) => n + p.delta, 0);

    // Begin drawing.
    let cursorY = y;

    // Base section (always shown). Include Growths/Buffs only if they contribute.
    const baseRows = [];
    baseRows.push({
      key: 'Base (Actor/Class)',
      value: baseVanilla
    });

    if (natGrowthPlus !== 0 || natGrowthRate !== 0 || natGrowthDelta !== 0)
    {
      const growthText = this.formatPlusRate(natGrowthPlus, natGrowthRate, natGrowthDelta);
      baseRows.push({
        key: '+ Natural (Growths)',
        value: growthText
      });
    }

    if (natBuffPlus !== 0 || natBuffRate !== 0 || natBuffDelta !== 0)
    {
      const buffText = this.formatPlusRate(natBuffPlus, natBuffRate, natBuffDelta);
      baseRows.push({
        key: '+ Natural (Buffs)',
        value: buffText
      });
    }

    baseRows.push({
      key: '= Base (with NATURAL)',
      value: baseNatural
    });
    cursorY = this.drawSectionWithRows(x, cursorY, w, 'Base', baseRows);

    // Flats section (only if non-zero).
    const flatsRows = [];
    if (equipFlat !== 0) flatsRows.push({
      key: '+ Equips',
      value: equipFlat
    });
    if (stateFlat !== 0) flatsRows.push({
      key: '+ States',
      value: stateFlat
    });
    cursorY = this.drawSectionWithRows(x, cursorY, w, 'Flats', flatsRows);

    // Traits section (only non-neutral rows; include combined delta if non-zero).
    const traitsRows = [];
    if (trActor !== 1.0) traitsRows.push({
      key: '× Actor',
      value: StatusHelper.toRateString(trActor)
    });
    if (trClass !== 1.0) traitsRows.push({
      key: '× Class',
      value: StatusHelper.toRateString(trClass)
    });
    if (trEquips !== 1.0) traitsRows.push({
      key: '× Equips',
      value: StatusHelper.toRateString(trEquips)
    });
    if (trStates !== 1.0) traitsRows.push({
      key: '× States',
      value: StatusHelper.toRateString(trStates)
    });
    if (traitsDelta !== 0)
    {
      const sign = traitsDelta >= 0
        ? '+'
        : String.empty;
      traitsRows.push({
        key: '= Traits',
        value: `${sign}${traitsDelta}`
      });
    }
    cursorY = this.drawSectionWithRows(x, cursorY, w, 'Traits (×)', traitsRows);

    // SDP section (only if any non-zero panel rows contribute and net isn’t neutral).
    if (sdpTotalDelta !== 0 && sdpPanelDeltas.length > 0)
    {
      const totalSign = sdpTotalDelta >= 0
        ? '+'
        : String.empty;
      const totalText = `${totalSign}${sdpTotalDelta}`;
      cursorY = this.drawSdpPanelsSection(x, cursorY, w, totalText, sdpPanelDeltas);
    }

    // Final small separator before returning.
    return cursorY + 10;
  }

  /**
   * Draws the x-param breakdown.
   * @param {Game_Actor} actor
   * @param {number} xId
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @returns {number}
   */
  drawXParamBreakdown(actor, xId, x, y, w)
  {
    // If HRG/MRG/TRG (ids 7/8/9), use the regen rendering pipeline.
    const isRegen = (xId === 7 || xId === 8 || xId === 9);

    // Delegate to the appropriate renderer to keep this method simple.
    if (isRegen)
    {
      return this._drawXParamBreakdownRegen(actor, xId, x, y, w);
    }

    return this._drawXParamBreakdownPercent(actor, xId, x, y, w);
  }

  /**
   * Renders the xparam breakdown for the three repurposed regen stats (HRG/MRG/TRG).
   * These use flat native units and are displayed as "per 5s" values for readability.
   * The section includes Baseline, Natural (growth), Natural (buffs), Traits (+), and SDP (Panels).
   * @param {Game_Actor} actor The actor whose regen xparam is being explained.
   * @param {number} xId The xparam id (7=HRG, 8=MRG, 9=TRG).
   * @param {number} x The x coordinate to start drawing.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width available to draw within.
   * @returns {number} The next y position after finishing this breakdown section.
   */
  _drawXParamBreakdownRegen(actor, xId, x, y, w)
  {
    // Gather the common xparam pieces (traits adds, NATURAL delta, total with SDP).
    const common = this._gatherXparamCommon(actor, xId);

    // Destructure the common pieces for readability.
    const addActorDec = common.adds.actor;   // editor decimal for traits
    const addClassDec = common.adds.class;   // editor decimal for traits
    const addEquipsDec = common.adds.equips; // editor decimal for traits
    const addStatesDec = common.adds.states; // editor decimal for traits
    const { natGrowthDelta } = common;       // should already be native from J.NATURAL
    const { totalWithSdp } = common;

    // Local helpers for regen display math.
    // - Traits come from editor decimals → convert to native by *100 before display.
    // - NATURAL deltas should be integer-native; if they slipped in as decimals (0<x<1), coerce to native by *100.
    const toNativeFromEditorDec = v => v * 100;
    const normalizeNaturalNative = n =>
    {
      if (n === 0) return 0;
      const abs = Math.abs(n);
      return abs < 1
        ? (n * 100)
        : n;
    };

    // Compute NATURAL Buffs as native flat delta (base 0.0 per JABS regen convention).
    const natBuffDeltaRaw = this.calcPlusRate(actor, 0.0, actor.xParamBuffPlus(xId), actor.xParamBuffRate(xId));

    // Normalize growth/buff deltas into integer-native space if they came in as editor decimals.
    const natGrowthDeltaNative = normalizeNaturalNative(natGrowthDelta);
    const natBuffDeltaNative = normalizeNaturalNative(natBuffDeltaRaw);

    // Compute SDP for regen (flats = native units, percents = decimal).
    const rSdp = this._computeNonCoreSdpContributionRegen(actor, xId, 8, totalWithSdp);
    const { sdpPanelDeltas } = rSdp;
    const sdpTotalFlat = rSdp.sdpTotal;

    // Begin drawing regen layout.
    let cursorY = y;

    // Baseline section: explicit “per 5s” labeling and a 0 baseline.
    cursorY = this.drawSectionTitle(x, cursorY, w, 'Baseline');
    this.drawKeyValue(x + 12, cursorY, w - 12, 'Baseline', this.formatPerFiveFlat(0), 'left');
    cursorY += this.lineHeight() + 6;

    // Natural (Growths): only if non-zero. Show delta as flat-per-5s.
    if (natGrowthDeltaNative !== 0)
    {
      cursorY = this.drawSectionTitle(x, cursorY, w, 'Natural');
      const growthText = this.formatPlusRatePerFive(natGrowthDeltaNative, actor.xParamGrowthRate(xId));
      this.drawKeyValue(x + 12, cursorY, w - 12, '+ Natural (Growths)', growthText, 'left');
      cursorY += this.lineHeight() + 6;
    }

    // Natural (Buffs): only if non-zero. Show delta as flat-per-5s.
    if (natBuffDeltaNative !== 0)
    {
      const buffText = this.formatSignedFlatPerFive(natBuffDeltaNative);
      this.drawKeyValue(x + 12, cursorY, w - 12, '+ Natural (Buffs)', buffText, 'left');
      cursorY += this.lineHeight() + 6;
    }

    // Traits (+) section: convert editor decimals to native (*100) and draw per‑5s.
    const traitRows = [
      {
        key: '+ Actor',
        valueNative: toNativeFromEditorDec(addActorDec)
      },
      {
        key: '+ Class',
        valueNative: toNativeFromEditorDec(addClassDec)
      },
      {
        key: '+ Equips',
        valueNative: toNativeFromEditorDec(addEquipsDec)
      },
      {
        key: '+ States',
        valueNative: toNativeFromEditorDec(addStatesDec)
      },
    ]
      .filter(r => r.valueNative !== 0)
      .map(r => ({
        key: r.key,
        value: this.formatPerFiveFlat(r.valueNative)
      }));

    cursorY = this.drawSectionWithRows(x, cursorY, w, 'Traits (+)', traitRows);

    // SDP (Panels) for regen — draw in flat-per-5s terms.
    if (sdpPanelDeltas.length > 0 && sdpTotalFlat !== 0)
    {
      const totalText = this.formatSignedFlatPerFive(sdpTotalFlat);
      cursorY = this.drawSdpPanelsFlatPerFiveSection(x, cursorY, w, totalText, sdpPanelDeltas);
    }

    // Return small tailing gap.
    return cursorY + 10;
  }

  /**
   * Renders the xparam breakdown for standard percent-based xparams.
   * These are displayed in percent space (e.g., +4.0%).
   * The section includes Baseline, Natural (growths), Natural (buffs), Traits (+), and SDP (Panels).
   * @param {Game_Actor} actor The actor whose xparam is being explained.
   * @param {number} xId The xparam id (0..9), excluding the regen ids 7/8/9.
   * @param {number} x The x coordinate to start drawing.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width available to draw within.
   * @returns {number} The next y position after finishing this breakdown section.
   */
  _drawXParamBreakdownPercent(actor, xId, x, y, w)
  {
    // Gather the common xparam pieces (traits adds, NATURAL delta, total with SDP).
    const common = this._gatherXparamCommon(actor, xId);

    // Destructure the common pieces for readability.
    const addActor = common.adds.actor;
    const addClass = common.adds.class;
    const addEquips = common.adds.equips;
    const addStates = common.adds.states;
    const { natGrowthDelta } = common;
    const { totalWithSdp } = common;

    // NATURAL Buffs as decimal delta around 0.0 baseline.
    const natBuffDeltaDec = this.calcPlusRate(actor, 0.0, actor.xParamBuffPlus(xId), actor.xParamBuffRate(xId));

    // SDP (non-core; idExtra = 8) — compute deltas and total via shared helper.
    const xSdp = this._computeNonCoreSdpContribution(actor, xId, 8, totalWithSdp);
    const { sdpPanelDeltas } = xSdp;
    const { sdpTotal } = xSdp;

    // Baseline section (always draw for orientation).
    let cursorY = y;
    cursorY = this.drawSectionTitle(x, cursorY, w, 'Baseline');
    this.drawKeyValue(x + 12, cursorY, w - 12, 'Baseline', StatusHelper.toPercentString(0, false), 'left');
    cursorY += this.lineHeight() + 6;

    // Natural (Growths): only if non-zero.
    if (natGrowthDelta !== 0)
    {
      cursorY = this.drawSectionTitle(x, cursorY, w, 'Natural');
      this.drawKeyValue(
        x + 12,
        cursorY,
        w - 12,
        '+ Natural (Growths)',
        StatusHelper.toPercentString(natGrowthDelta * 100, true),
        'left'
      );
      cursorY += this.lineHeight() + 6;
    }

    // Natural (Buffs): only if non-zero.
    if (natBuffDeltaDec !== 0)
    {
      this.drawKeyValue(
        x + 12,
        cursorY,
        w - 12,
        '+ Natural (Buffs)',
        StatusHelper.toPercentString(natBuffDeltaDec * 100, true),
        'left'
      );
      cursorY += this.lineHeight() + 6;
    }

    // Traits (+) section (data-driven rows, formatted as percents).
    const traitRows = [
      {
        key: '+ Actor',
        value: addActor
      },
      {
        key: '+ Class',
        value: addClass
      },
      {
        key: '+ Equips',
        value: addEquips
      },
      {
        key: '+ States',
        value: addStates
      },
    ].filter(r => r.value !== 0.0)
      .map(r => ({
        key: r.key,
        value: StatusHelper.toPercentString(r.value * 100, true)
      }));

    cursorY = this.drawSectionWithRows(x, cursorY, w, 'Traits (+)', traitRows);

    // SDP (Panels) for xparams — omit if total is 0 or no non-zero panels; use helper.
    if (sdpTotal !== 0 && sdpPanelDeltas.length > 0)
    {
      const totalText = StatusHelper.toPercentString(sdpTotal * 100, true);
      cursorY = this.drawSdpPanelsPercentSection(x, cursorY, w, totalText, sdpPanelDeltas);
    }

    // Return small tailing gap.
    return cursorY + 10;
  }

  /* eslint-disable max-len */
  /**
   * Gathers the common xparam inputs used by both regen and percent renderers.
   * Returns trait adds by source, the NATURAL delta against a 0.0 base, and the
   * post-SDP total (for solving SDP pre-base in the caller).
   * @param {Game_Actor} actor The actor.
   * @param {number} xId The xparam id (0..9).
   * @returns {{ adds:{actor:number,class:number,equips:number,states:number}, natGrowthDelta:number, totalWithSdp:number }}
   */

  /* eslint-enable max-len */
  _gatherXparamCommon(actor, xId)
  {
    // Aggregate trait adds for each source group.
    const addActor = this.xparamAddFromTraits([ actor.actor() ], xId);
    const addClass = this.xparamAddFromTraits([ actor.currentClass() ], xId);
    const addEquips = this.xparamAddFromTraits(actor.equips()
      .filter(e => !!e), xId);
    const addStates = this.xparamAddFromTraits(actor.states(), xId);

    // Compute NATURAL delta on the 0.0 baseline (plus/rate → concrete delta).
    const natGrowthDelta = this.calcPlusRate(actor, 0.0, actor.xParamGrowthPlus(xId), actor.xParamGrowthRate(xId));

    // Read the total including SDP for this xparam.
    const totalWithSdp = actor.xparam(xId);

    // Return the composed bundle for callers.
    return {
      adds: {
        actor: addActor,
        class: addClass,
        equips: addEquips,
        states: addStates,
      },
      natGrowthDelta,
      totalWithSdp,
    };
  }

  /**
   * Draws the s-param breakdown.
   * @param {Game_Actor} actor
   * @param {number} sId
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @returns {number}
   */
  drawSParamBreakdown(actor, sId, x, y, w)
  {
    // trait multipliers by group (omit neutral later).
    const rActor = this.sparamRateFromTraits([ actor.actor() ], sId);
    const rClass = this.sparamRateFromTraits([ actor.currentClass() ], sId);
    const rEquips = this.sparamRateFromTraits(actor.equips()
      .filter(equip => !!equip), sId);
    const rStates = this.sparamRateFromTraits(actor.states(), sId);

    // NATURAL Growth as multiplier around baseline 1.0 (rate only previously shown).
    const natGrowthPlus = actor.sParamGrowthPlus(sId);
    const natGrowthRate = actor.sParamGrowthRate(sId);

    // Compute growth delta in percent-points using the NATURAL calculator and a 1.0 base.
    const growthDeltaPct = actor.calculatePlusRate(1.0, natGrowthPlus, natGrowthRate);

    // NATURAL Buffs: compute buff delta in percent-points against 1.0 base as well.
    const natBuffPlus = actor.sParamBuffPlus(sId);
    const natBuffRate = actor.sParamBuffRate(sId);
    const buffDeltaPct = actor.calculatePlusRate(1.0, natBuffPlus, natBuffRate);

    // Compose a product for summary delta (only if anything changes) using trait multipliers and growth as multiplier.
    const natGrowthMult = (natGrowthRate + 100) / 100;
    const product = rActor * rClass * rEquips * rStates * natGrowthMult;
    const deltaPct = (product - 1.0) * 100;

    // SDP (non-core; idExtra = 18) — compute deltas and total via shared helper.
    const totalWithSdp = actor.sparam(sId);
    const sSdp = this._computeNonCoreSdpContribution(actor, sId, 18, totalWithSdp);
    const { sdpPanelDeltas } = sSdp;
    const sdpTotalDec = sSdp.sdpTotal; // decimal space (ex: 0.03 = +3%)

    // Baseline (always draw for orientation).
    let cursorY = y;
    cursorY = this.drawSectionTitle(x, cursorY, w, 'Baseline');
    this.drawKeyValue(x + 12, cursorY, w - 12, 'Baseline', StatusHelper.toRateString(1.0), 'left');
    cursorY += this.lineHeight() + 6;

    // Natural (Growths): show if non-zero.
    if (natGrowthPlus !== 0 || natGrowthRate !== 0 || growthDeltaPct !== 0)
    {
      this.drawKeyValue(
        x + 12,
        cursorY,
        w - 12,
        '+ Natural (Growths)',
        StatusHelper.toPercentString(growthDeltaPct, true),
        'left'
      );
      cursorY += this.lineHeight() + 6;
    }

    // Natural (Buffs): show if non-zero.
    if (natBuffPlus !== 0 || natBuffRate !== 0 || buffDeltaPct !== 0)
    {
      this.drawKeyValue(
        x + 12,
        cursorY,
        w - 12,
        '+ Natural (Buffs)',
        StatusHelper.toPercentString(buffDeltaPct, true),
        'left'
      );
      cursorY += this.lineHeight() + 6;
    }

    // Traits (×) section (omit neutral rows; omit entire section if no rows and no net delta).
    const showActor = rActor !== 1.0;
    const showClass = rClass !== 1.0;
    const showEquips = rEquips !== 1.0;
    const showStates = rStates !== 1.0;
    const anyTraits = showActor || showClass || showEquips || showStates;

    if (anyTraits)
    {
      cursorY = this.drawSectionTitle(x, cursorY, w, 'Traits (×)');

      if (showActor)
      {
        this.drawKeyValue(x + 12, cursorY, w - 12, '× Actor', StatusHelper.toRateString(rActor), 'left');
        cursorY += this.lineHeight();
      }

      if (showClass)
      {
        this.drawKeyValue(x + 12, cursorY, w - 12, '× Class', StatusHelper.toRateString(rClass), 'left');
        cursorY += this.lineHeight();
      }

      if (showEquips)
      {
        this.drawKeyValue(x + 12, cursorY, w - 12, '× Equips', StatusHelper.toRateString(rEquips), 'left');
        cursorY += this.lineHeight();
      }

      if (showStates)
      {
        this.drawKeyValue(x + 12, cursorY, w - 12, '× States', StatusHelper.toRateString(rStates), 'left');
        cursorY += this.lineHeight();
      }

      // show a composed delta only if non-neutral overall.
      if (deltaPct !== 0)
      {
        this.drawKeyValue(x + 12, cursorY, w - 12, '= Total', StatusHelper.toPercentString(deltaPct, true), 'left');
        cursorY += this.lineHeight();
      }

      cursorY += 6;
    }

    // SDP (Panels) for sparams — use percent helper to avoid duplication.
    const anySdp = sdpTotalDec !== 0 && sdpPanelDeltas.length > 0;
    if (anySdp)
    {
      const totalText = StatusHelper.toPercentString(sdpTotalDec * 100, true);
      cursorY = this.drawSdpPanelsPercentSection(x, cursorY, w, totalText, sdpPanelDeltas);
    }

    // Return small tailing gap.
    return cursorY + 10;
  }

  /**
   * Draws the max tp breakdown.
   * @param {Game_Actor} actor
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @returns {number}
   */
  drawMtpBreakdown(actor, x, y, w)
  {
    // base and natural pieces for Max TP.
    const baseMaxTp = actor.getBaseMaxTp();

    // Growths (permanent).
    const natGrowthPlus = actor.maxTpGrowthPlus();
    const natGrowthRate = actor.maxTpGrowthRate();
    const growthDeltaRaw = this.calcPlusRate(actor, baseMaxTp, natGrowthPlus, natGrowthRate);
    const growthDelta = Math.round(growthDeltaRaw);

    // Buffs (temporary while equipped/stated/etc.).
    const natBuffPlus = actor.maxTpBuffPlus
      ? actor.maxTpBuffPlus()
      : 0;
    const natBuffRate = actor.maxTpBuffRate
      ? actor.maxTpBuffRate()
      : 0;
    const buffDeltaRaw = this.calcPlusRate(actor, baseMaxTp, natBuffPlus, natBuffRate);
    const buffDelta = Math.round(buffDeltaRaw);

    // SDP (Panels) for Max TP (id = 30); filter to non-zero rows.
    const totalWithSdp = actor.maxTp();
    const sdp = this._sdpCoreCoefficients(actor, 30);
    const preSdpBase = this._solvePreSdpBaseCore(totalWithSdp, sdp.k, sdp.c);
    const rawPanelDeltas = this._computeSdpCorePanelDeltas(preSdpBase, sdp.panels);
    const sdpPanelDeltas = rawPanelDeltas.filter(p => p.delta !== 0);
    const sdpTotal = sdpPanelDeltas.reduce((n, p) => n + p.delta, 0);

    // draw Base (always); show Growths/Buffs only if they contribute.
    let cursorY = y;
    cursorY = this.drawSectionTitle(x, cursorY, w, 'Base');
    this.drawKeyValue(x + 12, cursorY, w - 12, 'Base (Actor/Class)', baseMaxTp, 'left');
    cursorY += this.lineHeight();

    if (natGrowthPlus !== 0 || natGrowthRate !== 0 || growthDelta !== 0)
    {
      const growthText = this.formatPlusRate(natGrowthPlus, natGrowthRate, growthDelta);
      this.drawKeyValue(x + 12, cursorY, w - 12, '+ Natural (Growths)', growthText, 'left');
      cursorY += this.lineHeight();
    }

    if (natBuffPlus !== 0 || natBuffRate !== 0 || buffDelta !== 0)
    {
      const buffText = this.formatPlusRate(natBuffPlus, natBuffRate, buffDelta);
      this.drawKeyValue(x + 12, cursorY, w - 12, '+ Natural (Buffs)', buffText, 'left');
      cursorY += this.lineHeight();
    }

    cursorY += 6;

    // SDP (Panels) for Max TP — use helper to avoid duplication.
    const anySdp = sdpTotal !== 0 && sdpPanelDeltas.length > 0;
    if (anySdp)
    {
      const totalSign = sdpTotal >= 0
        ? '+'
        : String.empty;
      const totalText = `${totalSign}${sdpTotal}`;
      cursorY = this.drawSdpPanelsSection(x, cursorY, w, totalText, sdpPanelDeltas);
    }

    // Return small tailing gap.
    return cursorY + 10;
  }

  /**
   * Draws the crit breakdown (28 = Crit Amp, 29 = Crit Block).
   * @param {Game_Actor} actor The actor.
   * @param {number} critId 0 for amp (28), 1 for block (29).
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width available.
   * @returns {number}
   */
  drawCritBreakdown(actor, critId, x, y, w)
  {
    // resolve which param functions to use.
    const isAmp = critId === 0;

    // base factors (decimal space: 0.25 => 25%).
    const base = isAmp
      ? actor.baseCriticalMultiplier()
      : actor.baseCriticalReduction();

    // additive sources in percent space (ex: 15 => +15%).
    const notes = isAmp
      ? actor.getCriticalDamageMultiplier()
      : actor.getCriticalDamageReduction();

    // total including SDP (decimal space) for solving panel deltas later.
    const totalWithSdp = isAmp
      ? actor.criticalDamageMultiplier()
      : actor.criticalDamageReduction();

    // SDP (non-core; idExtra = 28) — compute deltas and total via shared helper.
    const cSdp = this._computeNonCoreSdpContribution(actor, critId, 28, totalWithSdp);
    const { sdpPanelDeltas } = cSdp;
    const sdpTotalDec = cSdp.sdpTotal; // decimal space

    // draw sections.
    let cursorY = y;

    // Baseline (always draw) — show base as percent.
    cursorY = this.drawSectionTitle(x, cursorY, w, 'Baseline');
    this.drawKeyValue(x + 12, cursorY, w - 12, 'Baseline', StatusHelper.toPercentString(base * 100, false), 'left');
    cursorY += this.lineHeight() + 6;

    // Growth inputs (percent space: points, not decimals).
    const growthPlus = isAmp
      ? actor.cdmPlus()
      : actor.cdrPlus();
    const growthRate = isAmp
      ? actor.cdmRate()
      : actor.cdrRate();

    // Solve the delta against the base.
    const growthDelta = actor.calculatePlusRate(base, growthPlus, growthRate);

    // Only draw if something contributes.
    if (growthPlus !== 0 || growthRate !== 0 || growthDelta !== 0)
    {
      console.log('growthPlus', growthPlus);
      console.log('growthRate', growthRate);
      console.log('growthDelta', growthDelta);
      cursorY = this.drawSectionTitle(x, cursorY, w, 'Natural');
      const growthText = this.formatPlusRatePercent(growthPlus, growthRate, growthDelta);
      this.drawKeyValue(x + 12, cursorY, w - 12, '+ Natural (Growths)', growthText, 'left');
      cursorY += this.lineHeight() + 6;
    }

    // Gather raw buff inputs from notes (percent points), then solve.
    const notesSources = actor.getAllNotes();

    // Buff plus/rate regex per mode.
    const buffPlusRegex = isAmp
      ? J.CRIT.RegExp.CritDamageMultiplierBuffPlus
      : J.CRIT.RegExp.CritDamageReductionBuffPlus;
    const buffPlusSum = RPGManager.getSumFromAllNotesByRegex(notesSources, buffPlusRegex);

    const buffRateRegex = isAmp
      ? J.CRIT.RegExp.CritDamageMultiplierBuffRate
      : J.CRIT.RegExp.CritDamageReductionBuffRate;
    const buffRateSum = RPGManager.getSumFromAllNotesByRegex(notesSources, buffRateRegex);

    // Solve the delta against the base.
    const buffDelta = actor.calculatePlusRate(base, buffPlusSum, buffRateSum);

    // Only draw if something contributes.
    if (buffPlusSum !== 0 || buffRateSum !== 0 || buffDelta !== 0)
    {
      const buffText = this.formatPlusRatePercent(buffPlusSum, buffRateSum, buffDelta);
      this.drawKeyValue(x + 12, cursorY, w - 12, '+ Natural (Buffs)', buffText, 'left');
      cursorY += this.lineHeight() + 6;
    }

    // Notes (only if any contribution).
    if (notes !== 0)
    {
      cursorY = this.drawSectionTitle(x, cursorY, w, 'Notes');
      this.drawKeyValue(
        x + 12,
        cursorY,
        w - 12,
        '+ Notes',
        StatusHelper.toPercentString(notes, true),
        'left'
      );
      cursorY += this.lineHeight() + 6;
    }

    // SDP (Panels) — use percent helper to avoid duplication.
    if (sdpPanelDeltas.length > 0 && sdpTotalDec !== 0)
    {
      const totalText = StatusHelper.toPercentString(sdpTotalDec * 100, true);
      cursorY = this.drawSdpPanelsPercentSection(x, cursorY, w, totalText, sdpPanelDeltas);
    }

    // small tailing gap.
    return cursorY + 10;
  }

  /**
   * Draws a breakdown for custom long parameters that don’t fit the base/x/s/crit/mtp families.
   * Currently supported custom params:
   * - 31: Move Speed Boost (MSB)
   * - 32: Skill Proficiency Boost (SPB)
   * - 33: SDP Multiplier Bonus (SMB)
   * @param {Game_Actor} actor The actor whose stat is being explained.
   * @param {number} longId The long param id to render.
   * @param {number} x The x coordinate to start drawing.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width available to draw within.
   * @returns {number} The next y position after finishing this section.
   */
  drawCustomBreakdown(actor, longId, x, y, w)
  {
    // Dispatch to the appropriate custom renderer.
    if (longId === 31)
    {
      return this._drawMsbBreakdown(actor, x, y, w);
    }
    if (longId === 32)
    {
      return this._drawSpbBreakdown(actor, x, y, w);
    }
    if (longId === 33)
    {
      return this._drawSmbBreakdown(actor, x, y, w);
    }

    // Fallback if an unknown custom id sneaks in.
    return this.drawSectionWithRows(x, y, w, 'Details', [
      {
        key: 'Info',
        value: 'No breakdown available for this custom stat.'
      },
    ]);
  }

  //endregion drawing

  //region helpers (SDP)
  /**
   * Builds SDP percent (k) and flat (c) coefficients for core params (incl. MTP=30),
   * and collects per-panel rows including icon and rarity.
   * @param {Game_Actor} actor The actor.
   * @param {number} paramId The core param id (0..7) or 30 for MTP.
   * @returns {{k:number,c:number,panels:Array}}
   */
  _sdpCoreCoefficients(actor, paramId)
  {
    // initialize and iterate ranked panels.
    let k = 0.0;
    let c = 0;
    const rows = [];

    // get all ranked panels for this actor.
    const rankings = actor.getAllSdpRankings();

    // iterate all rankings to accumulate coefficients.
    rankings.forEach(ranking =>
    {
      // get the panel metadata for this ranking.
      const panel = J.SDP.Metadata.panelsMap.get(ranking.key);

      // if the panel doesn't exist, skip it.
      if (!panel) return;

      // fetch all parameters for this panel that affect the target param id.
      const panelParams = panel.getPanelParameterById(paramId);

      // if the panel has no relevant parameters, skip it.
      if (!panelParams.length) return;

      // iterate each parameter entry from the panel.
      panelParams.forEach(pp =>
      {
        // extract panel visuals.
        const { name } = panel;
        const { iconIndex } = panel;
        const { rarity } = panel;

        // extract parameter data.
        const { isFlat } = pp;
        const { perRank } = pp;
        const curRank = ranking.currentRank;

        // if flat, accumulate the flat amount per current rank.
        if (isFlat)
        {
          const flat = curRank * perRank;
          c += flat;
          rows.push({
            name,
            iconIndex,
            rarity,
            isFlat: true,
            amount: flat
          });
        }
        // if rate, accumulate the percent coefficient as decimal.
        else
        {
          const pct = (curRank * perRank) / 100;
          k += pct;
          rows.push({
            name,
            iconIndex,
            rarity,
            isFlat: false,
            amount: pct
          });
        }
      });
    });

    // return the combined coefficients and detailed rows.
    return {
      k,
      c,
      panels: rows
    };
  }

  /**
   * Computes each core panel's exact delta against the pre‑SDP base.
   * Floors percent pieces to match J.SDP’s behavior for core params.
   * Carries icon/rarity for rendering.
   * @param {number} basePreSdp The pre-SDP base value.
   * @param {Array} rows The rows from _sdpCoreCoefficients().
   * @returns {{name:string,delta:number,iconIndex:number,rarity:number}[]}
   */
  _computeSdpCorePanelDeltas(basePreSdp, rows)
  {
    // initialize output collection.
    const deltas = [];

    // for each row, compute its concrete delta value.
    rows.forEach(row =>
    {
      // extract visuals and data.
      const { name } = row;
      const { iconIndex } = row;
      const { rarity } = row;

      // declare the delta for this row.
      let delta;

      // optional percent rate for percent‑type rows (decimal; ex: 0.05 for +5%).
      let rateDec = 0;

      // if the row is flat, the delta is the flat amount.
      if (row.isFlat)
      {
        delta = row.amount;
      }
      // if the row is percent, floor product to match in‑plugin math.
      else
      {
        const pct = row.amount; // decimal rate
        delta = Math.floor(basePreSdp * pct);

        // carry the decimal rate for display (e.g., “+5% (+63)”).
        rateDec = pct;
      }

      // add the computed row for rendering.
      deltas.push({
        name,
        delta,
        iconIndex,
        rarity,
        // include rateDec only when non‑zero to keep objects light.
        ...(rateDec !== 0
          ? { rateDec }
          : {}),
      });
    });

    // return the collection of panel deltas.
    return deltas;
  }

  /**
   * Builds SDP coefficients for non-core params (x/s) using an id offset.
   * Includes icon and rarity for rendering.
   * For xparams use idExtra=8, for sparams use idExtra=18.
   * @param {Game_Actor} actor The actor.
   * @param {number} subId The x/s id (0..9).
   * @param {number} idExtra The offset into panel parameter ids.
   * @returns {{k:number,c:number,panels:Array}}
   */
  _sdpNonCoreCoefficients(actor, subId, idExtra)
  {
    // initialize coefficients and rows.
    let k = 0.0;
    let c = 0.0; // flats for non-core are stored as decimal (value/100)
    const rows = [];

    // get all ranked panels for this actor.
    const rankings = actor.getAllSdpRankings();

    // iterate rankings to accumulate coefficients.
    rankings.forEach(ranking =>
    {
      // get panel metadata for this ranking.
      const panel = J.SDP.Metadata.panelsMap.get(ranking.key);

      // if panel doesn’t exist, skip it.
      if (!panel) return;

      // fetch panel parameters for this non-core id (offset by idExtra).
      const panelParams = panel.getPanelParameterById(subId + idExtra);

      // if no relevant parameters, skip.
      if (!panelParams.length) return;

      // iterate each parameter entry.
      panelParams.forEach(pp =>
      {
        // extract panel visuals and parameter data.
        const { name } = panel;
        const iconIndex = panel.iconIndex | 0;  // guarantee a concrete icon index
        const rarity = panel.rarity | 0;        // guarantee a concrete color index
        const { isFlat } = pp;
        const { perRank } = pp;
        const curRank = ranking.currentRank;

        // if flat, store as decimal add.
        if (isFlat)
        {
          const add = (curRank * perRank) / 100; // percent-as-decimal
          c += add;
          rows.push({
            name,
            iconIndex,
            rarity,
            isFlat: true,
            amount: add
          });
        }
        // if percent, accumulate as decimal rate.
        else
        {
          const pct = (curRank * perRank) / 100;
          k += pct;
          rows.push({
            name,
            iconIndex,
            rarity,
            isFlat: false,
            amount: pct
          });
        }
      });
    });

    // return the combined coefficients and rows.
    return {
      k,
      c,
      panels: rows
    };
  }

  /**
   * Builds SDP coefficients for regen xparams (7/8/9) using id offset 8.
   * Flats are native units (not divided by 100). Percents remain decimal.
   * @param {Game_Actor} actor The actor.
   * @param {number} subId The xparam id (7,8,9).
   * @param {number} idExtra The offset (8 for xparams).
   * @returns {{k:number,c:number,panels:Array}}
   */
  _sdpNonCoreCoefficientsRegen(actor, subId, idExtra)
  {
    // initialize coefficients and rows.
    let k = 0.0;
    let c = 0.0; // flats in native units
    const rows = [];

    // get all ranked panels for this actor.
    const rankings = actor.getAllSdpRankings();

    // iterate rankings to accumulate coefficients.
    rankings.forEach(ranking =>
    {
      // get panel metadata for this ranking.
      const panel = J.SDP.Metadata.panelsMap.get(ranking.key);

      // if panel doesn’t exist, skip it.
      if (!panel) return;

      // fetch panel parameters for this regen sub-id.
      const panelParams = panel.getPanelParameterById(subId + idExtra);

      // if no relevant parameters, skip.
      if (!panelParams.length) return;

      // iterate each parameter entry.
      panelParams.forEach(pp =>
      {
        // visuals and data.
        const { name } = panel;
        const iconIndex = panel.iconIndex | 0;
        const rarity = panel.rarity | 0;
        const { isFlat } = pp;
        const { perRank } = pp;
        const curRank = ranking.currentRank;

        // if flat, keep native units (no /100). Example: +3 regen per 5s is represented natively.
        if (isFlat)
        {
          const add = (curRank * perRank);
          c += add;
          rows.push({
            name,
            iconIndex,
            rarity,
            isFlat: true,
            amount: add
          });
        }
        // if percent, accumulate as decimal multiplier.
        else
        {
          const pct = (curRank * perRank) / 100;
          k += pct;
          rows.push({
            name,
            iconIndex,
            rarity,
            isFlat: false,
            amount: pct
          });
        }
      });
    });

    // return combined coefficients and rows.
    return {
      k,
      c,
      panels: rows
    };
  }

  /**
   * Computes the regen (HRG/MRG/TRG) SDP contribution in native flat units.
   * @param {Game_Actor} actor The actor.
   * @param {number} subId The xparam id (7,8,9).
   * @param {number} idExtra The offset (8 for xparams).
   * @param {number} totalWithSdp The final value including SDP (native units).
   * @returns {{ sdpPanelDeltas: {name:string,delta:number,iconIndex:number,rarity:number}[], sdpTotal: number }}
   */
  _computeNonCoreSdpContributionRegen(actor, subId, idExtra, totalWithSdp)
  {
    // Build regen-specific coefficients for this sub-stat.
    const sdp = this._sdpNonCoreCoefficientsRegen(actor, subId, idExtra);

    // Solve the pre-SDP base using T = B*(1+K) + C (all native units).
    const preSdpBase = this._solvePreSdpBaseNonCore(totalWithSdp, sdp.k, sdp.c);

    // Compute individual panel deltas using the shared non-core implementation.
    const rawPanelDeltas = this._computeSdpNonCorePanelDeltas(preSdpBase, sdp.panels);

    // Filter to only non-zero contributions for rendering.
    const sdpPanelDeltas = rawPanelDeltas.filter(p => p.delta !== 0);

    // Sum the native flat deltas for a net total.
    const sdpTotal = sdpPanelDeltas.reduce((n, p) => n + p.delta, 0);

    // Return both detailed rows and the net total.
    return {
      sdpPanelDeltas,
      sdpTotal
    };
  }

  /**
   * Computes each non-core panel's exact delta against a pre‑SDP base (no floors).
   * Returns icon/rarity for rendering.
   * @param {number} basePreSdp The pre-SDP base value (x/s param before SDP).
   * @param {Array} rows The rows from _sdpNonCoreCoefficients().
   * @returns {{name:string,delta:number,iconIndex:number,rarity:number}[]}
   */
  _computeSdpNonCorePanelDeltas(basePreSdp, rows)
  {
    // initialize output.
    const deltas = [];

    // compute deltas for all rows.
    rows.forEach(row =>
    {
      // extract visuals.
      const { name } = row;
      const iconIndex = row.iconIndex | 0;
      const rarity = row.rarity | 0;

      // declare delta and optional decimal rate.
      let delta;
      let rateDec = 0;

      // if flat, delta is the flat amount in the caller’s native space.
      if (row.isFlat)
      {
        delta = row.amount;
      }
      // if rate, multiply the base by the rate (no floor for non-core stats).
      else
      {
        const pct = row.amount; // decimal rate
        delta = basePreSdp * pct;
        rateDec = pct;
      }

      // store computed row with visuals (and percent when relevant).
      deltas.push({
        name,
        delta,
        iconIndex,
        rarity,
        ...(rateDec !== 0
          ? { rateDec }
          : {}),
      });
    });

    // return rows with visuals for drawing.
    return deltas;
  }

  /**
   * Computes the non-core SDP contribution for a given subId/offset and total.
   * Returns both the filtered per-panel rows and the net decimal total.
   * Example: a return total of 0.04 represents +4%.
   * @param {Game_Actor} actor The actor.
   * @param {number} subId The x/s/crit sub-id (x:0..9, s:0..9, crit:0..1).
   * @param {number} idExtra The offset to map into panel parameter ids (x:+8, s:+18, crit:+28).
   * @param {number} totalWithSdp The final value including SDP.
   * @returns {{ sdpPanelDeltas: {name:string,delta:number,iconIndex:number,rarity:number}[], sdpTotal: number }}
   */
  _computeNonCoreSdpContribution(actor, subId, idExtra, totalWithSdp)
  {
    // Build non-core coefficients for this sub-stat.
    const sdp = this._sdpNonCoreCoefficients(actor, subId, idExtra);

    // Solve the pre-SDP base using T = B*(1+K) + C.
    const preSdpBase = this._solvePreSdpBaseNonCore(totalWithSdp, sdp.k, sdp.c);

    // Compute individual panel deltas in decimal space.
    const rawPanelDeltas = this._computeSdpNonCorePanelDeltas(preSdpBase, sdp.panels);

    // Filter to only non-zero contributions for rendering.
    const sdpPanelDeltas = rawPanelDeltas.filter(p => p.delta !== 0);

    // Sum the decimal deltas for a net total.
    const sdpTotal = sdpPanelDeltas.reduce((n, p) => n + p.delta, 0);

    // Return both detailed rows and the net total.
    return {
      sdpPanelDeltas,
      sdpTotal,
    };
  }

  /**
   * Solves for the pre‑SDP base for core params using T = B*(1+K) + C.
   * @param {number} totalWithSdp The final actor value including SDP.
   * @param {number} k The percent coefficient sum (as decimal).
   * @param {number} c The flat coefficient sum.
   * @returns {number}
   */
  _solvePreSdpBaseCore(totalWithSdp, k, c)
  {
    const numerator = totalWithSdp - c;
    const denom = 1 + k;
    const base = denom !== 0
      ? Math.round(numerator / denom)
      : 0;
    return Math.max(0, base);
  }

  /**
   * Solves for the pre‑SDP base for non-core params using T = B*(1+K) + C.
   * @param {number} totalWithSdp The final actor value including SDP.
   * @param {number} k The percent coefficient sum (as decimal).
   * @param {number} c The flat coefficient sum (already in decimal space).
   * @returns {number}
   */
  _solvePreSdpBaseNonCore(totalWithSdp, k, c)
  {
    const numerator = totalWithSdp - c;
    const denom = 1 + k;
    const base = denom !== 0
      ? (numerator / denom)
      : 0;
    return Math.max(0, base);
  }

  /**
   * Draws a single SDP panel entry (icon + colored name + right-aligned value).
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width available.
   * @param {string} name The panel name.
   * @param {number} iconIndex The icon index to draw.
   * @param {number} rarityColorIndex The ColorManager index for rarity.
   * @param {string} valueText The right-aligned value text to draw.
   */
  drawSdpPanelEntry(x, y, w, name, iconIndex, rarityColorIndex, valueText)
  {
    // coerce visuals to concrete numbers for stability.
    const safeIcon = iconIndex | 0;
    const safeRarity = rarityColorIndex | 0;

    // draw the panel icon on the left.
    this.drawIcon(safeIcon, x, y + 2);

    // compute text area for the name.
    const nameX = x + 36;
    const nameW = Math.floor(w * 0.6) - 36;

    // draw the name using rarity color.
    this.changeTextColor(ColorManager.textColor(safeRarity));
    this.drawText(name, nameX, y, nameW, 'left');
    this.resetTextColor();

    // draw the value on the right.
    this.drawText(valueText, x, y, w, 'right');
  }

  /**
   * An SDP (Panels) section renderer for regen showing flat values per 5s.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width.
   * @param {string} totalValueText The right-aligned signed total in per‑5s units.
   * @param {{ name:string, iconIndex:number, rarity:number, delta:number }[]} panels The per-panel rows.
   * @returns {number} The next y after drawing (or unchanged if skipped).
   */
  drawSdpPanelsFlatPerFiveSection(x, y, w, totalValueText, panels)
  {
    // Determine if the section is relevant at all.
    const anyPanels = panels && panels.length > 0;
    if (!anyPanels)
    {
      return y;
    }

    // Draw the section title.
    let cursorY = this.drawSectionTitle(x, y, w, 'SDP (Panels)');

    // Draw the total row as flat-per-5s.
    this.drawKeyValue(x + 12, cursorY, w - 12, '+ Total ', totalValueText, 'left');
    cursorY += this.lineHeight();

    // Draw each panel entry formatted as flat-per-5s.
    panels.forEach(panel =>
    {
      const { name } = panel;
      const { iconIndex } = panel;
      const { rarity } = panel;

      // Compose a per‑panel value string.
      // If the panel originated from a percent rate, show both: "+5% (+0.6)".
      let valueText;
      if (panel.rateDec)
      {
        const pctText = StatusHelper.toPercentString(panel.rateDec * 100, true);
        const flatText = this.formatSignedFlatPerFive(panel.delta);
        valueText = `${pctText} (${flatText})`;
      }
      else
      {
        valueText = this.formatSignedFlatPerFive(panel.delta);
      }

      // Draw the panel line with icon and rarity coloring.
      this.drawSdpPanelEntry(x + 24, cursorY, w - 24, name, iconIndex, rarity, valueText);

      // Advance to next row.
      cursorY += this.lineHeight();
    });

    // Add a small end-cap gap.
    cursorY += 6;

    // Return the next Y.
    return cursorY;
  }

  /**
   * Formats a native flat value as a per‑5s display string, with simple rounding.
   * Example: native 6 → "1.2" (per 5 seconds).
   * @param {number} nativeFlat The native flat amount (pre‑division).
   * @returns {string}
   */
  formatPerFiveFlat(nativeFlat)
  {
    // Convert native units to a per‑5s value.
    const perFive = nativeFlat / 5;

    // Show to one decimal place for readability (ex: 2.4 per 5s).
    const text = perFive.toFixed(1);
    return text;
  }

  /**
   * Formats a native flat delta as a signed per‑5s string (ex: "+1.2").
   * @param {number} nativeFlat The native flat delta (pre‑division).
   * @returns {string}
   */
  formatSignedFlatPerFive(nativeFlat)
  {
    // Determine sign character.
    const sign = nativeFlat >= 0
      ? '+'
      : String.empty;

    // Convert to per‑5s with one decimal using the shared formatter.
    const absPerFive = this.formatPerFiveFlat(Math.abs(nativeFlat));

    // Prepend the sign to the absolute value.
    return `${sign}${absPerFive}`;
  }

  /**
   * Formats NATURAL growth for regen as "<rate%> → +<per5s>" where the delta
   * is expressed as per‑5s. Example: "+20% → +0.6".
   * @param {number} deltaNative The computed delta in native flat units.
   * @param {number} ratePercent The growth rate percent (for display only).
   * @returns {string}
   */
  formatPlusRatePerFive(deltaNative, ratePercent)
  {
    // Render the rate as a percent string (signed).
    const rateText = StatusHelper.toPercentString(ratePercent, true);

    // Convert native delta to per‑5s text with sign.
    const deltaText = this.formatSignedFlatPerFive(deltaNative);

    // Keep the regen NATURAL line concise.
    return `${rateText} → ${deltaText}`;
  }

  /**
   * Formats a pair of inputs (plus, rate) and the solved percent delta into
   * a compact string: "+Plus%, +Rate% → +Delta%".
   * @param {number} plus The flat percent-points input (e.g., 15 for +15%).
   * @param {number} rate The multiplier percent input (e.g., 20 for +20%).
   * @param {number} delta The solved percent-points delta (may be fractional).
   * @returns {string}
   */
  formatPlusRatePercent(plus, rate, delta)
  {
    // Build signed pieces.
    const plusText = StatusHelper.toPercentString(plus, true);
    const rateText = StatusHelper.toPercentString(rate, true);
    const deltaText = StatusHelper.toPercentString(delta, true);

    // Return the unified, readable string.
    return `${plusText}, ${rateText} → ${deltaText}`;
  }

  //endregion helpers (SDP)

  //region custom
  /**
   * Renders the breakdown for Move Speed Boost (longId 31).
   * Source is equips/states only via the `jabsSpeedBoost` note property.
   * Values are whole-number bonuses (Page 1 shows this as a raw number, not a percent).
   * @param {Game_Actor} actor The actor whose stat is being explained.
   * @param {number} x The x coordinate to start drawing.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width available to draw within.
   * @returns {number} The next y position after finishing this section.
   */
  _drawMsbBreakdown(actor, x, y, w)
  {
    // Gather equip/state contributions directly from note properties.
    const equipTotal = (actor.equippedEquips() || [])
      .filter(e => !!e)
      .reduce((n, e) => n + (e.jabsSpeedBoost | 0), 0);
    const stateTotal = (actor.states() || [])
      .filter(s => !!s)
      .reduce((n, s) => n + (s.jabsSpeedBoost | 0), 0);

    // Total should match Page 1’s longParam(31).
    const total = (equipTotal + stateTotal);

    // Build rows — MSB is shown as whole numbers (Page 1 omits % for 31).
    const rows = [];
    rows.push({
      key: 'Baseline',
      value: 0
    });
    if (equipTotal !== 0) rows.push({
      key: '+ Equips',
      value: equipTotal
    });
    if (stateTotal !== 0) rows.push({
      key: '+ States',
      value: stateTotal
    });
    rows.push({
      key: '= Total',
      value: total
    });

    // Render the section.
    return this.drawSectionWithRows(x, y, w, 'Sources (Equips/States)', rows);
  }

  /**
   * Renders the breakdown for Skill Proficiency Boost (longId 32).
   * Source is equips/states only via `J.PROF.RegExp.ProficiencyBonus`.
   * Values are flat integers (added directly to skill proficiency gains).
   * @param {Game_Actor} actor The actor whose stat is being explained.
   * @param {number} x The x coordinate to start drawing.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width available to draw within.
   * @returns {number} The next y position after finishing this section.
   */
  _drawSpbBreakdown(actor, x, y, w)
  {
    // Sum SPB bonuses by regex over equips/states only.
    const eq = RPGManager.getSumFromAllNotesByRegex(
      actor.equippedEquips()
        .filter(e => !!e),
      J.PROF.RegExp.ProficiencyBonus
    );
    const st = RPGManager.getSumFromAllNotesByRegex(
      actor.states()
        .filter(s => !!s),
      J.PROF.RegExp.ProficiencyBonus
    );

    const total = (eq + st); // equals Page 1’s bonusSkillProficiencyGains()

    const rows = [];
    rows.push({
      key: 'Baseline',
      value: 0
    });
    if (eq !== 0) rows.push({
      key: '+ Equips',
      value: eq
    });
    if (st !== 0) rows.push({
      key: '+ States',
      value: st
    });
    rows.push({
      key: '= Total',
      value: total
    });

    return this.drawSectionWithRows(x, y, w, 'Sources (Equips/States)', rows);
  }

  /**
   * Renders the breakdown for SDP Multiplier Bonus (longId 33).
   * Source is equips/states only via `J.SDP.RegExp.SdpMultiplier`.
   * Rows render in percent points around a 100% baseline; Page 1 shows factor (total/100).
   * @param {Game_Actor} actor The actor whose stat is being explained.
   * @param {number} x The x coordinate to start drawing.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width available to draw within.
   * @returns {number} The next y position after finishing this section.
   */
  _drawSmbBreakdown(actor, x, y, w)
  {
    // Sum percent-point bonuses by regex over equips/states only.
    const eqPct = RPGManager.getSumFromAllNotesByRegex(
      actor.equippedEquips()
        .filter(e => !!e),
      J.SDP.RegExp.SdpMultiplier
    );
    const stPct = RPGManager.getSumFromAllNotesByRegex(
      actor.states()
        .filter(s => !!s),
      J.SDP.RegExp.SdpMultiplier
    );

    // Compose totals around a 100% baseline (factor 1.00 on Page 1).
    const basePct = 100;
    const totalPct = basePct + eqPct + stPct;

    // Local helpers for factor formatting to mirror Page 1.
    const formatFactor = n =>
    {
      // If under 1 in magnitude, show two decimals (ex: 0.40, 0.03).
      if (Math.abs(n) < 1)
      {
        return n.toFixed(2);
      }

      // If whole number, omit decimals (ex: 1, 2).
      if (Number.isInteger(n))
      {
        return `${n}`;
      }

      // Otherwise, show up to two decimals (trim .00 if present).
      const txt = n.toFixed(2);
      return txt.endsWith('.00')
        ? txt.slice(0, -3)
        : txt;
    };

    const formatSignedFactor = n =>
    {
      // Determine sign for the factor delta.
      const sign = n >= 0
        ? '+'
        : String.empty;

      // Always format using absolute value + sign prefix.
      return `${sign}${formatFactor(Math.abs(n))}`;
    };

    // Convert percent-points into factor deltas.
    const baseFactor = basePct / 100;     // => 1.00
    const eqFactor = eqPct / 100;       // => e.g., +0.40
    const stFactor = stPct / 100;       // => e.g., -0.03
    const totalFactor = totalPct / 100;   // => e.g., 1.37

    // Build rows rendered in factor space to match Page 1’s display.
    const rows = [];

    // Baseline shown as factor (not percent).
    rows.push({
      key: 'Baseline',
      value: formatFactor(baseFactor)
    });

    // Equips contribution as a signed factor delta.
    if (eqPct !== 0)
    {
      rows.push({
        key: '+ Equips',
        value: formatSignedFactor(eqFactor)
      });
    }

    // States contribution as a signed factor delta.
    if (stPct !== 0)
    {
      rows.push({
        key: '+ States',
        value: formatSignedFactor(stFactor)
      });
    }

    // Total as a factor (mirrors Page 1).
    rows.push({
      key: '= Total',
      value: formatFactor(totalFactor)
    });

    // Render the section.
    return this.drawSectionWithRows(x, y, w, 'Sources (Equips/States)', rows);
  }

  //endregion custom

  //region math helpers
  /**
   * Calculates the amount to add to a parameter.
   * @param {Game_Actor} actor
   * @param {number} base
   * @param {number} plus
   * @param {number} rate
   * @returns {number}
   */
  calcPlusRate(actor, base, plus, rate)
  {
    // use the provided helper from NATURAL layer.
    const computed = actor.calculatePlusRate(base, plus, rate);
    return computed;
  }

  /**
   * Formats the plus and rate into a readable string.
   * @param {number} plus
   * @param {number} rate
   * @param {number} delta
   * @returns {string}
   */
  formatPlusRate(plus, rate, delta)
  {
    const plusSign = plus >= 0
      ? '+'
      : String.empty;
    const deltaSign = delta >= 0
      ? '+'
      : String.empty;
    const rateText = StatusHelper.toPercentString(rate, true);
    return `${plusSign}${plus}, ${rateText} → ${deltaSign}${Math.round(delta)}`;
  }

  /**
   * Sums the flat bonus parameter from equips.
   * @param {Game_Actor} actor
   * @param {number} paramId
   * @returns {number}
   */
  sumEquipBParamFlat(actor, paramId)
  {
    let total = 0;
    actor.equips()
      .forEach(equip =>
      {
        if (!equip) return;
        const arr = equip.params;
        total += arr
          ? (arr[paramId] | 0)
          : 0;
      });
    return total;
  }

  /**
   * Sums the flat bonus parameter from states.
   * @param {Game_Actor} actor
   * @param {number} paramId
   * @returns {number}
   */
  sumStateBParamFlat(actor, paramId)
  {
    let total = 0;
    actor.states()
      .forEach(state =>
      {
        if (!state) return;
        const arr = state.params;
        total += arr
          ? (arr[paramId] | 0)
          : 0;
      });
    return total;
  }

  /**
   * Determines the b-param bonuses from traits.
   * @param {RPG_Traited[]} objs
   * @param {number} paramId
   * @returns {number}
   */
  paramRateFromTraits(objs, paramId)
  {
    const CODE = Game_BattlerBase.TRAIT_PARAM;
    let rate = 1.0;
    objs.forEach(source =>
    {
      if (!source || !source.traits) return;
      source.traits.forEach(trait =>
      {
        if (trait.code === CODE && trait.dataId === paramId)
        {
          rate *= trait.value;
        }
      });
    });
    return rate;
  }

  /**
   * Determines the x-param bonuses from traits.
   * @param {RPG_Traited[]} objs
   * @param {number} xId
   * @returns {number}
   */
  xparamAddFromTraits(objs, xId)
  {
    const CODE = Game_BattlerBase.TRAIT_XPARAM;
    let add = 0.0;
    objs.forEach(source =>
    {
      if (!source || !source.traits) return;
      source.traits.forEach(trait =>
      {
        if (trait.code === CODE && trait.dataId === xId)
        {
          add += trait.value;
        }
      });
    });
    return add;
  }

  /**
   * Determines the s-param bonuses from traits.
   * @param {RPG_Traited[]} objs
   * @param {number} sId
   * @returns {number}
   */
  sparamRateFromTraits(objs, sId)
  {
    const CODE = Game_BattlerBase.TRAIT_SPARAM;
    let rate = 1.0;
    objs.forEach(source =>
    {
      if (!source || !source.traits) return;
      source.traits.forEach(trait =>
      {
        if (trait.code === CODE && trait.dataId === sId)
        {
          rate *= trait.value;
        }
      });
    });
    return rate;
  }

  //endregion math helpers

  //region layout helpers
  /**
   * Draws a small section title without any horizontal line.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width.
   * @param {string} text The section title.
   * @returns {number} The next y after drawing.
   */
  drawSectionTitle(x, y, w, text)
  {
    // set the color and draw the title.
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(text, x, y, w, 'left');
    // reset color to normal.
    this.resetTextColor();

    // advance a small gap beneath the title for readability.
    const nextY = y + this.lineHeight() + 4;
    return nextY;
  }

  /**
   * Draws the value at the designated location.
   * @param x
   * @param y
   * @param w
   * @param key
   * @param value
   * @param align
   */
  drawKeyValue(x, y, w, key, value, align)
  {
    this.drawText(key, x, y, Math.floor(w * 0.6), align || 'left');
    const text = `${value}`;
    this.drawText(text, x, y, w, 'right');
  }

  /**
   * Draws a section title and a list of key/value rows.
   * If `rows` is empty, the section is skipped and the original `y` is returned.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width.
   * @param {string} title The section title.
   * @param {{ key:string, value:string|number }[]} rows The rows to draw.
   * @returns {number} The next y after drawing (or unchanged if skipped).
   */
  drawSectionWithRows(x, y, w, title, rows)
  {
    // Bail out if there is nothing to draw for this section.
    if (!rows || rows.length === 0)
    {
      return y;
    }

    // Draw the section title.
    let cursorY = this.drawSectionTitle(x, y, w, title);

    // Draw each key/value row in order.
    rows.forEach(row =>
    {
      this.drawKeyValue(x + 12, cursorY, w - 12, row.key, row.value, 'left');

      // Advance the cursor after each row.
      cursorY += this.lineHeight();
    });

    // Add a little gap beneath sections for readability.
    cursorY += 6;

    // Return the next line to start drawing on.
    return cursorY;
  }

  /* eslint-disable max-len */
  /**
   * Draws an SDP (Panels) section consisting of a "+ Total" line and panel entries.
   * If there are no non-zero panels or the overall total is neutral, the section is skipped.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width.
   * @param {string|number} totalValueText The right-aligned text for the total row.
   * @param {{ name:string, iconIndex:number, rarity:number, delta:number }[]} panels The per-panel rows; caller ensures non-zero filtering if desired.
   * @returns {number} The next y after drawing (or unchanged if skipped).
   */

  /* eslint-enable max-len */
  drawSdpPanelsSection(x, y, w, totalValueText, panels)
  {
    // Determine if the section is relevant at all.
    const anyPanels = panels && panels.length > 0;
    if (!anyPanels)
    {
      return y;
    }

    // Draw the section title.
    let cursorY = this.drawSectionTitle(x, y, w, 'SDP (Panels)');

    // Draw the total row.
    this.drawKeyValue(x + 12, cursorY, w - 12, '+ Total', totalValueText, 'left');
    cursorY += this.lineHeight();

    // Draw each panel entry.
    panels.forEach(panel =>
    {
      const { name } = panel;
      const { iconIndex } = panel;
      const { rarity } = panel;

      // Build signed flat text (e.g., "+63").
      const sign = panel.delta >= 0
        ? '+'
        : String.empty;
      const flatText = `${sign}${panel.delta}`;

      // If there is a percent component, show it as well: "+5% (+63)".
      const valueText = panel.rateDec
        ? `${StatusHelper.toPercentString(panel.rateDec * 100, true)} (${flatText})`
        : flatText;

      // Draw the panel line with icon and rarity coloring.
      this.drawSdpPanelEntry(x + 24, cursorY, w - 24, name, iconIndex, rarity, valueText);

      // Advance to next row.
      cursorY += this.lineHeight();
    });

    // Add a small end-cap gap.
    cursorY += 6;

    // Return the next Y.
    return cursorY;
  }

  /**
   * Same as `drawSdpPanelsSection`, but formats each panel delta as a percent string (e.g., "+4.0%")
   * and expects `totalValueText` to also be percent-formatted already.
   * Useful for xparams/sparams where contribution space is decimal/percentage.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate to start drawing.
   * @param {number} w The width.
   * @param {string} totalValueText The right-aligned text for the total row, already formatted.
   * @param {{ name:string, iconIndex:number, rarity:number, delta:number }[]} panels The per-panel rows.
   * @returns {number} The next y after drawing (or unchanged if skipped).
   */
  drawSdpPanelsPercentSection(x, y, w, totalValueText, panels)
  {
    // Determine if the section is relevant at all.
    const anyPanels = panels && panels.length > 0;
    if (!anyPanels)
    {
      return y;
    }

    // Draw the section title.
    let cursorY = this.drawSectionTitle(x, y, w, 'SDP (Panels)');

    // Draw the total row.
    this.drawKeyValue(x + 12, cursorY, w - 12, '+ Total', totalValueText, 'left');
    cursorY += this.lineHeight();

    // Draw each panel entry with percent formatting.
    panels.forEach(panel =>
    {
      const { name } = panel;
      const { iconIndex } = panel;
      const { rarity } = panel;
      const pct = panel.delta * 100;
      const valueText = StatusHelper.toPercentString(pct, true);

      this.drawSdpPanelEntry(x + 24, cursorY, w - 24, name, iconIndex, rarity, valueText);
      cursorY += this.lineHeight();
    });

    // Add a small end-cap gap.
    cursorY += 6;

    // Return the next Y.
    return cursorY;
  }

  //endregion layout helpers
}

//endregion Window_StatusStatBreakdown

//region Window_StatusStatList
/**
 * A selectable list of stats (by long param id) that drives the breakdown panel.
 */
class Window_StatusStatList
  extends Window_Selectable
{
  /**
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // build base window first.
    super(rect);

    // finish initialization.
    this.initMembers();
  }

  //region init
  /**
   * Ensures namespaced storage exists for this window.
   */
  _root()
  {
    // ensure the namespace chain exists for this window’s state.
    this._j ||= {};
    this._j._cms_s ||= {};
    this._j._cms_s._status ||= {};
    this._j._cms_s._status._list ||= {
      /**
       * The actor whose stats are shown by this list.
       * @type {Game_Actor|null}
       */
      _actor: null,

      /**
       * The rows displayed by this list.
       * @type {StatusStatListRow[]}
       */
      _data: [],

      /**
       * Callback invoked after selection changes.
       * @type {function|null}
       */
      _onChange: null,
    };
  }

  /**
   * Initializes namespaced members.
   */
  initMembers()
  {
    // make sure we have the storage.
    this._root();
  }

  //endregion init

  //region accessors
  /**
   * Gets the bound actor.
   * @returns {Game_Actor|null}
   */
  getActor()
  {
    this._root();
    return this._j._cms_s._status._list._actor;
  }

  /**
   * Binds an actor and refreshes the list.
   * @param {Game_Actor} v The actor to bind.
   */
  setActor(v)
  {
    this._root();
    this._j._cms_s._status._list._actor = v;
    this.refresh();
    this.select(0);
    this.callChangeHandler();
  }

  /**
   * Gets all rows.
   * @returns {StatusStatListRow[]}
   */
  getData()
  {
    this._root();
    return this._j._cms_s._status._list._data;
  }

  /**
   * Replaces all rows.
   * @param {StatusStatListRow[]} v The rows to assign.
   */
  setData(v)
  {
    this._root();
    this._j._cms_s._status._list._data = v;
  }

  /**
   * Gets the selection-change callback.
   * @returns {function|null}
   */
  getChangeHandler()
  {
    this._root();
    return this._j._cms_s._status._list._onChange;
  }

  /**
   * Sets the selection-change callback.
   * @param {function|null} fn The callback.
   */
  setChangeHandler(fn)
  {
    this._root();
    this._j._cms_s._status._list._onChange = fn;
  }

  //endregion accessors

  //region core overrides
  /**
   * Gets the number of rows.
   * @returns {number}
   */
  maxItems()
  {
    return this.getData().length;
  }

  /**
   * Gets a row by index.
   * @param {number} index The index.
   * @returns {StatusStatListRow}
   */
  itemAt(index)
  {
    return this.getData()[index];
  }

  /**
   * Gets the selected row.
   * @returns {StatusStatListRow}
   */
  currentItem()
  {
    return this.itemAt(this.index());
  }

  /**
   * Gets the selected long parameter id (or 0 if none).
   * @returns {number}
   */
  currentLongParamId()
  {
    /** @type {StatusStatListRow} */
    const row = this.currentItem();
    return row
      ? row.longParamId
      : 0;
  }

  /**
   * Changes selection and invokes the change callback.
   * @param {number} index The new index.
   */
  select(index)
  {
    // perform original logic.
    super.select(index);

    // notify listeners when the selection changes.
    this.callChangeHandler();
  }

  //endregion core overrides

  //region building
  /**
   * Rebuilds rows and redraws the window.
   */
  refresh()
  {
    // clear existing.
    this.contents.clear();

    // rebuild rows and allocate contents.
    this.buildData();
    this.createContents();

    // draw everything.
    this.drawAllItems();
  }

  /**
   * Populates rows grouped by parameter section.
   */
  buildData()
  {
    // Assemble rows that mirror page 1’s visual layout and reading order.
    /** @type {StatusStatListRow[]} */
    const rows = [];

    // Define groups in the same order as drawn on page 1.
    // Page 1 order: Row1 (Combat, Vitality), Row2 (Precision, Defensive), Row3 (Mobility, Fate).
    const groups = [
      // Row 1
      {
        section: 'Combat',
        ids: [ 2, 4, 14, 13 ], // ATK, MAT, CNT, MRF
      },
      {
        section: 'Vitality',
        ids: [ 0, 15, 1, 16, 30, 17, 20, 21 ], // MHP, HRG, MMP, MRG, MTP, TRG, REC, PHA
      },

      // Row 2
      {
        section: 'Precision',
        ids: [ 8, 19, 6, 9, 10, 11, 28, 29 ], // HIT, GRD, AGI, EVA, CRI, CEV, CDM, CDR
      },
      {
        section: 'Defensive',
        ids: [ 3, 5, 24, 25 ], // DEF, MDF, PDR, MDR
      },

      // Row 3
      {
        section: 'Mobility',
        ids: [ 31 ], // MSB (custom: move speed boost)
      },
      {
        section: 'Fate',
        ids: [ 7, 27, 32, 33 ], // LUK, EXR, SPB (skill prof boost), SMB (SDP multiplier bonus)
      },
    ];

    // Flatten the groups into concrete list rows in the defined order.
    groups.forEach(group =>
    {
      group.ids.forEach(longId =>
      {
        // Preserve the section label (unused visually today, but handy later).
        rows.push(new StatusStatListRow(group.section, longId));
      });
    });

    // Commit the rows to the window.
    this.setData(rows);
  }

  //endregion building

  //region drawing
  /**
   * Draws a single row (icon + name).
   * @param {number} index The row index.
   */
  drawItem(index)
  {
    // get rect and row.
    const rect = this.itemRectWithPadding(index);
    const row = this.itemAt(index);

    // collect display attributes.
    const longId = row.longParamId;
    const name = TextManager.longParam(longId);
    const icon = IconManager.longParam(longId);
    const color = ColorManager.longParam(longId);

    // draw icon + name.
    this.changeTextColor(ColorManager.textColor(color));
    this.drawIcon(icon, rect.x, rect.y + 2);
    this.drawText(name, rect.x + 36, rect.y, rect.width - 36, 'left');
    this.resetTextColor();
  }

  //endregion drawing

  //region helpers
  /**
   * Invokes the selection-change callback if assigned.
   */
  callChangeHandler()
  {
    // invoke change handler if assigned.
    const handler = this.getChangeHandler();
    if (handler)
    {
      handler();
    }
  }

  //endregion helpers
}

//endregion Window_StatusStatList