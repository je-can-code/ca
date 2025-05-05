//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CMS_S] A redesign of the status menu.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
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
J.CMS_S.Metadata.Version = '1.0.0';

J.CMS_S.Aliased = {
  Scene_Status: {},
  Window_Status: {},
  Window_StatusParams: {},
  Window_StatusEquip: {},
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
   * @param {boolean=} longParamId True if this should be multiplied by 100, false otherwise.
   */
  constructor(value, longParamId)
  {
    this.value = value;
    this.longParamId = longParamId;
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
    // copy the value.
    let prettyValue = this.value;

    // subjectively, whole numbers are better than 0-1 decimal numbers.
    const needsMultiplyBy100 = [
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17,     // ex-params
      18, 19, 20, 21, 22, 23, 24, 25, 26, 27,   // sp-params
      28, 29                                    // crit params
    ];

    // check if our long param id is in this group.
    if (needsMultiplyBy100.includes(this.longParamId))
    {
      // multiply by 100 then.
      prettyValue *= 100;
    }

    // subjectively, the sp-params would look better if they were 0-based instead of 100-based.
    const needsMinusBy100 = [
      18, 19, 20, 21, 22, 23, 24, 25, 26, 27,   // sp-params
    ];

    // check if our long param id is in this group.
    if (needsMinusBy100.includes(this.longParamId))
    {
      // reduce by 100 then.
      prettyValue -= 100;
    }

    // check to make sure we're using padding.
    if (withPadding && this.value)
    {
      // subjectively, the big parameters like hp and mp should have leading zeroes.
      const needs6ZeroPadding = [
        0, 1,                                     // max hp/mp
      ];

      // subjectively, the sorta big parameters like b-params, crit-params, and max tp also get zeroes.
      const needs4ZeroPadding = [
        2, 3, 4, 5, 6, 7,                         // most b-params
        19,                                       // just GRD
        28, 29,                                   // crit params
        30,                                       // max tp
      ];

      // subjectively, the sp-params (except GRD) should have fewer leading zeroes.
      const needs3ZeroPadding = [
        13, 14,                               // CNT & MRF
        18, 20, 21, 22, 23, 24, 25, 26, 27,   // sp-params
      ];

      // check if our long param id is in this group.
      if (needs6ZeroPadding.includes(this.longParamId))
      {
        // pad with up to 6 zeroes.
        prettyValue = prettyValue.padZero(6);
      }
      // check if our long param id is in this group.
      else if (needs4ZeroPadding.includes(this.longParamId))
      {
        // pad with up to 4 zeroes.
        prettyValue = prettyValue.padZero(4);
      }
      // check if our long param id is in this group.
      else if (needs3ZeroPadding.includes(this.longParamId))
      {
        // pad with up to 3 zeroes.
        prettyValue = prettyValue.padZero(3);
      }
    }

    let finalPrettyValue = !(Number.isInteger(prettyValue))
      ? prettyValue.toFixed(1)
      : prettyValue.toString();

    // check if we just have unused decimals.
    if (finalPrettyValue.endsWith(".0"))
    {
      // strip em off.
      finalPrettyValue = finalPrettyValue.slice(0, finalPrettyValue.length - 2);
    }

    // the long param ids that should be decorated with a % symbol.
    const needsPercentSymbol = [
      9, 13, 14,                                // EVA & CNT & MRF
      20, 21, 22, 23, 24, 25, 26, 27,           // sp-params
      28, 29,                                   // crit params
    ];

    // check if our long param id is in this group.
    if (needsPercentSymbol.includes(this.longParamId))
    {
      // append with a % symbol.
      finalPrettyValue = `${finalPrettyValue}%`;
    }

    // the long param ids that should be decorated with a regen rate per second.
    const needsRegenRate = [
      15, 16, 17 ];

    // check if our long param id is in this group.
    if (needsRegenRate.includes(this.longParamId))
    {
      // calculate the per-second rate of regen.
      let per1rate = (prettyValue / 5);

      // check if it came out to be a clean whole number or not.
      if (!Number.isInteger(per1rate))
      {
        // chop off the shit after 2 decimals.
        per1rate = per1rate.toFixed(1);
      }

      // decorate the value with the per-second rate.
      finalPrettyValue = `${per1rate}/s`;
    }

    // return the "pretty" value!
    return finalPrettyValue;
  }
}

//endregion StatusParameter

//region Scene_Status
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
 * @returns {Rectangle}
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
 * @returns {Rectangle}
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
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusParamsWindowRect = function()
{
  const wx = this._statusWindow.width;
  const wy = 0;
  const ww = Math.round(Graphics.boxWidth * 0.7);
  const wh = Graphics.boxHeight;
  return new Rectangle(wx, wy, ww, wh);
};
//endregion Scene_Status

//region Window_Status
/**
 * OVERWRITE Changes the `x:y` coordinates for where to draw the components of this block.
 * Also does NOT write nicknames, because why is that a thing?
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
 * OVERWRITE Changes the `x:y` coordinates for where to draw the components of this block.
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
    super.initialize(rect);
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
   * OVERWRITE Changes the lineheight to default to something smaller than 36 for this window.
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
   * OVERWRITE Replaces this with a smaller font size reduction.
   */
  makeFontSmaller()
  {
    if (this.contents.fontSize >= 24)
    {
      this.contents.fontSize -= 6;
    }
  }

  /**
   * OVERWRITE Replaces this with a smaller font size increase.
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