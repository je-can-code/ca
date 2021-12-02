//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 CMS_S] A redesign of the status menu.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This is a redesign of the status menu. It includes ALL parameters instead of
 * just the b-params. It also includes elemental and state rates.
 * 
 * 
 * ============================================================================
 * 
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
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
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CMS_S = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CMS_S.Metadata = {};
J.CMS_S.Metadata.Name = `J-CMS-Status`;
J.CMS_S.Metadata.Version = '1.0.0';

J.CMS_S.Aliased = {
  Scene_Status: {},
  Window_Status: {},
  Window_StatusParams: {},
  Window_StatusEquip: {},
};

//#endregion Introduction

//#region Scene objects
//#region Scene_Status
/**
 * OVERWRITE Removes the buttons because fuck the buttons.
 */
Scene_Status.prototype.createButtons = function()
{
};

/**
 * OVERWRITE Removes the profile window because sticking that in a help window
 * was a dumb idea.
 */
Scene_Status.prototype.create = function()
{
  Scene_MenuBase.prototype.create.call(this);
  //this.createProfileWindow();
  this.createStatusWindow();
  this.createStatusParamsWindow();
  this.createStatusEquipWindow();
};

/**
 * OVERWRITE Removes the binding between the "profile" (help) window and
 * the refreshing of an actor.
 */
Scene_Status.prototype.refreshActor = function()
{
  const actor = this.actor();
  //this._profileWindow.setText(actor.profile());
  this._statusWindow.setActor(actor);
  this._statusParamsWindow.setActor(actor);
  this._statusEquipWindow.setActor(actor);
};

/**
 * Creates the Rectangle that will represent the window for the base status details.
 * @returns {Rectange}
 */
Scene_Status.prototype.statusWindowRect = function()
{
  const wx = 0;
  const wy = 0;
  const ww = Math.round(Graphics.width * 0.3);
  const wh = Math.round(Graphics.height * 0.6);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * Creates the Rectangle that will represent the window for the equip details.
 * @returns {Rectange}
 */
Scene_Status.prototype.statusEquipWindowRect = function()
{
  const wx = 0;
  const wy = this._statusWindow.height;
  const ww = Math.round(Graphics.boxWidth * 0.3);
  const wh = Math.round(Graphics.boxHeight * 0.4);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * OVERWRITE Replaces the window type used for this part of the display.
 * This window no longer extends Window_Selectable, but instead extends
 * Window_Base so that we can draw cleaner than as a list.
 */
Scene_Status.prototype.createStatusParamsWindow = function()
{
  const rect = this.statusParamsWindowRect();
  this._statusParamsWindow = new Window_StatusParameters(rect);
  this.addWindow(this._statusParamsWindow);
};

/**
 * Creates the Rectangle that will represent the window for the parameter details.
 * @returns {Rectange}
 */
Scene_Status.prototype.statusParamsWindowRect = function()
{
  const wx = this._statusWindow.width;
  const wy = 0;
  const ww = Math.round(Graphics.boxWidth * 0.7);
  const wh = Graphics.boxHeight;
  return new Rectangle(wx, wy, ww, wh);
};
//#endregion Scene_Status
//#endregion Scene objects

//#region Window objects
//#region Window_Status
Window_Status.prototype.drawBlock1 = function()
{
  const y = this.block1Y();
  this.drawActorName(this._actor, 0, y, 168);
  this.drawActorClass(this._actor, 204, y, 168);
  this.drawActorNickname(this._actor, 0, y + 200, 270);
};

Window_Status.prototype.drawBlock2 = function()
{
  const y = this.block2Y();
  this.drawActorFace(this._actor, 12, y);
  this.drawBasicInfo(204, y);
  this.drawExpInfo(0, y + 250);
};
//#endregion Window_Status

//#region Window_StatusParameters
/**
 * A replacement class for `Window_StatusParams`, which originally extended `Window_Selectable`
 * and rendered only the b-params. This window now extends `Window_Base` and renders all
 * params, including b-/x-/s- params.
 */
class Window_StatusParameters
  extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect A rectangle that represents the shape of this window.
   */
  constructor(rect)
  {
    super(rect);
    super.initialize(rect);
    this.initMembers();
  };

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    this.actor = null;
  };

  /**
   * OVERWRITE Changes the lineheight to default to something smaller than 36 for this window.
   * @returns {number}
   */
  lineHeight()
  {
    return 32;
  };

  /**
   * Sets the actor for this window to draw parameter data for.
   * @param {Game_Actor} actor The actor to set.
   */
  setActor(actor)
  {
    this.actor = actor;
    this.refresh();
  };

  /**
   * Refreshes this window by clearing it and redrawing all its contents.
   */
  refresh()
  {
    this.contents.clear();
    this.drawContent();
  };

  /**
   * Draws all content in this window.
   */
  drawContent()
  {
    // if we don't have an actor to render the parameters for, don't.
    if (!this.actor) return;

    this.drawBParams(0, 0);
    this.drawXParams(350, 0);
    this.drawSParams(700, 0);
    this.drawElementalRates(0, 380);
    this.drawStateRates(350, 380);
  };

  /**
   * Draws all the b-params for the actor.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawBParams(x, y)
  {
    this.drawTitle("Params", x, y - 15, 2563, 1);

    const paramIds = [0, 1, 2, 3, 4, 5, 6, 7];
    paramIds.forEach((paramId, index) =>
    {
      const name = TextManager.param(paramId);
      const value = this.actor.param(paramId);
      const iconIndex = IconManager.param(paramId);
      y = ((index + 1) * this.lineHeight()) + 8;
      this.drawParameter(name, value, iconIndex, x + 40, y);
    });
  };

  /**
   * Draws all the x-params for the actor.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawXParams(x, y)
  {
    this.drawTitle("Rates", x, y - 15, 92, 1);

    const paramIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    paramIds.forEach((xparamId, index) =>
    {
      const name = TextManager.xparam(xparamId);
      const value = Math.round(this.actor.xparam(xparamId) * 100);
      const iconIndex = IconManager.xparam(xparamId);
      y = ((index + 1) * this.lineHeight()) + 8;
      this.drawParameter(name, value, iconIndex, x + 40, y);
    });
  };

  /**
   * Draws all the s-params for the actor.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawSParams(x, y)
  {
    this.drawTitle("Bonuses", x, y - 10, 73, 1);

    const paramIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    paramIds.forEach((sparamId, index) =>
    {
      const name = TextManager.sparam(sparamId);
      const value = Math.round(this.actor.sparam(sparamId) * 100) - 100;
      const iconIndex = IconManager.sparam(sparamId);
      y = ((index + 1) * this.lineHeight()) + 8;
      this.drawParameter(name, value, iconIndex, x + 40, y);
    });
  };

  /**
   * Draws the elemental rates section.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   * @param {number} limit The endpoint if applicable of elements to pull.
   */
  drawElementalRates(x, y, limit = 10)
  {
    this.drawTitle("Elements", x, y - 10, 78, 1);

    const elements = $dataSystem.elements.slice(0, limit);
    elements.forEach((name, index) =>
    {
      const modY = y + ((index + 1) * this.lineHeight()) + 8;
      let rate = ((this.actor.traitsPi(11, index)) * 100);
      let colorIndex = 0;
      if (rate > 100)
      {
        colorIndex = 10; // red
      }
      else if (rate < 100)
      {
        colorIndex = 3; // green
      }
      const iconIndex = IconManager.element(index);
      name = (name === "") ? "Neutral" : name;
      this.drawParameter(`${name}`, `${rate}%`, iconIndex, x + 40, modY, colorIndex);
    });
  };

  /**
   * Draws the state rates section.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawStateRates(x, y)
  {
    this.drawTitle("Ailments", x, y - 10, 18, 1);

    const states = $dataStates.slice(4, 12);
    states.forEach((state, index) =>
    {
      if (!state) return;

      const modY = y + ((index + 1) * this.lineHeight()) + 8;
      let rate = ((this.actor.traitsPi(13, index + 4)) * 100);
      let colorIndex = 0;
      if (rate > 100)
      {
        colorIndex = 10; // red
      }
      else if (rate < 100)
      {
        colorIndex = 3; // green
      }
      const iconIndex = state.iconIndex;
      this.drawParameter(`${state.name}`, `${rate}%`, iconIndex, x + 40, modY, colorIndex);
    });
  };

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
  };

  /**
   * Draws the title of one of the sections for parameters.
   * @param {string} text The text to write as the title.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   * @param {number} iconIndex The icon index for this parameter.
   * @param {number} colorIndex The color index for the title.
   */
  drawTitle(text, x, y, iconIndex = 0, colorIndex = 1)
  {
    this.resetTextColor();
    this.drawIcon(iconIndex, x, y + 16);
    this.changeTextColor(ColorManager.textColor(colorIndex));
    this.contents.fontSize += 12;
    this.drawText(text, x + 32, y + 16, 350);
    this.contents.fontSize -= 12;
  };
};
//#endregion Window_StatusParameters
//#endregion Window objects

//ENDFILE