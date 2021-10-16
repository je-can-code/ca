//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 CMS_K] A redesign of the skill menu.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This is a redesign of the skill menu.
 * It includes the ability to see more parameters when inspecting skills.
 * 
 * Will reveal various JABS data points.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() => {
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement) {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check
 
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CMS_K = {};
 
/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CMS_K.Metadata = {};
J.CMS_K.Metadata.Name = `J-CMS-Skill`;
J.CMS_K.Metadata.Version = '1.0.0';

J.CMS_K.Aliased = {
  Scene_Skill: {},
  Window_SkillList: {},
  Window_EquipSlot: {},
};
//#endregion Introduction

//#region Scene objects
//#region Scene_Skill
J.CMS_K.Aliased.Scene_Skill.initialize = Scene_Skill.prototype.initialize;
Scene_Skill.prototype.initialize = function() {
  J.CMS_K.Aliased.Scene_Skill.initialize.call(this);
  this._j = this._j || {};
  this._j.moreVisible = false;
};

J.CMS_K.Aliased.Scene_Skill.create = Scene_Skill.prototype.create;
Scene_Skill.prototype.create = function() {
  J.CMS_K.Aliased.Scene_Skill.create.call(this);
  this.createSkillDetailWindow();
};

Scene_Skill.prototype.skillTypeWindowRect = function() {
  const ww = this.mainCommandWidth();
  const wh = this.calcWindowHeight(4, true);
  const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
  const wy = this.mainAreaTop();
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.createSkillDetailWindow = function() {
  const rect = this.skillDetailRect();
  this._skillDetailWindow = new Window_SkillDetail(rect);
  this._itemWindow.setSkillDetailWindow(this._skillDetailWindow);
  this.addWindow(this._skillDetailWindow);
};

Scene_Skill.prototype.skillDetailRect = function() {
  const ww = Graphics.boxWidth - this.mainCommandWidth();
  const wh = this.mainAreaHeight() - this._statusWindow.height
  const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
  const wy = this.mainAreaTop() + this._statusWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.mainCommandWidth = () => 400;

/**
 * OVERWRITE Removes the buttons because fuck the buttons.
 */
Scene_Skill.prototype.createButtons = function() {};

/**
 * OVERWRITE Replaces the button area height with 0 because fuck buttons.
 * @returns {number}
 */
Scene_Skill.prototype.buttonAreaHeight = () => 0;

Scene_Skill.prototype.itemWindowRect = function() {
  const ww = this.mainCommandWidth();
  const wh = this.mainAreaHeight() - this._statusWindow.height;
  const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
  const wy = this._statusWindow.y + this._statusWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};
//#endregion Scene_Skill
//#endregion Scene objects

//#region Window objects
//#region Window_SkillType
Window_SkillType.prototype.maxCols = function() {
  return 1;
};

//#endregion Window_SkillType

//#region Window_SkillList
J.CMS_K.Aliased.Window_SkillList.initialize = Window_SkillList.prototype.initialize;
Window_SkillList.prototype.initialize = function(rect) {
  J.CMS_K.Aliased.Window_SkillList.initialize.call(this, rect);
  this._skillDetailWindow = null;
};

Window_SkillList.prototype.setSkillDetailWindow = function(newWindow) {
  this._skillDetailWindow = newWindow;
  this.refreshSkillDetailWindow();
};

Window_SkillList.prototype.refreshSkillDetailWindow = function() {
  if (!this._skillDetailWindow) return;

  let id = 0;
  const item = this.item();
  if (item) {
    id = item.id;
  }
  this._skillDetailWindow.setActor(this._actor);
  this._skillDetailWindow.setSkillId(id);
};

J.CMS_K.Aliased.Window_SkillList.select = Window_SkillList.prototype.select;
Window_SkillList.prototype.select = function(index) {
  J.CMS_K.Aliased.Window_SkillList.select.call(this, index);
  this.refreshSkillDetailWindow();
};

/**
 * OVERWRITE Forces a single column for skills in this window.
 * @returns {number}
 */
Window_SkillList.prototype.maxCols = function() {
  return 1;
};

/**
 * OVERWRITE Draws the costs for the skill in the list of skills.
 * @param {rm.types.Skill} skill The skill to draw costs for.
 * @param {number} x The `x` coordinate.
 * @param {number} y The `y` coordinate.
 * @param {number} width The text width.
 */
Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
  if (this._actor.skillTpCost(skill) > 0) {
      this.changeTextColor(ColorManager.tpCostColor());
      this.drawText(this._actor.skillTpCost(skill), x, y, width, "right");
  } else if (this._actor.skillMpCost(skill) > 0) {
      this.changeTextColor(ColorManager.mpCostColor());
      this.drawText(this._actor.skillMpCost(skill), x, y, width, "right");
  }
};
//#endregion Window_SkillList

//#region Window_SkillDetail
/**
 * A window responsible for showing various datapoints of a skill.
 */
class Window_SkillDetail extends Window_Base {
  constructor(rect) {
    super(rect);
    this.initMembers();
  }

  initMembers() {
    /**
     * The skill id this window is currently presenting data for.
     * @type {number}
     */
    this._skillId = null;

    /**
     * The sprites for this skill.
     * @type {Map<string, Sprite>}
     */
    this._skillSprites = new Map();

    /**
     * The actor who owns the skill of this skill.
     * @type {Game_Actor}
     */
    this._actor = null;

    this.refresh();
  };

  /**
   * Sets the skill id of the window to this and refreshes the data.
   * @param {number} newSkillId The new skill id for this window.
   */
  setSkillId(newSkillId) {
    this._skillId = newSkillId;
    if (this._skillId < 1) {
      this._skillId = 0;
      this.clear();
    } else {
      this.refresh();
      console.log($dataSkills[this._skillId]);
    }
  };

  /**
   * Gets the skill currently being worked with.
   * @returns {rm.types.Skill?}
   */
  skill() {
    if (!this._skillId) {
      return null;
    } else {
      return $dataSkills[this._skillId];
    }
  };

  /**
   * Sets the actor to be the actor owning the window.
   * @param {Game_Actor} newActor The actor.
   */
  setActor(newActor) {
    this._actor = newActor;
    this.refresh();
  };

  /**
   * Empties the window.
   */
  clear() {
    this.contents.clear();
    this.clearSkillImages();
  };

  clearSkillImages() {
    this._skillSprites.forEach(sprite => {
      sprite.hide();
    });
  };

  /**
   * Clears and redraws all contents of this window.
   */
  refresh() {
    this.clear();
    this.drawContents();
  };

  /**
   * Draws all contents of this window.
   */
  drawContents() {
    if (!this.skill()) return;

    this.drawHeader();
    this.drawSkillLogo();
    this.drawLeftColumn();
    this.drawMiddleColumn();
    this.drawRightColumn();
  };

  /**
   * Draws the header component of this window.
   */
  drawHeader() {
    this.resetFontSettings();
    this.contents.fontSize += 12;
    this.toggleBold();
    this.drawText(this.skill().name, 0, 0, this.width);
    this.resetFontSettings();
  };

  /**
   * Places the 4x scaled-up skill icon (logo) onto the window.
   */
  drawSkillLogo() {
    this.placeSkillIcon(0, this.skill());
  };

  /**
   * Places the corresponding skill icon image.
   * @param {rm.types.Skill} skill The skill to draw this for.
   */
  placeSkillIcon(x, skill) {
    const key = `skill-${skill.id}-icon-image`;
    const sprite = this.createIconSprite(key, skill.iconIndex);
    const y = this.height - (sprite.height * (sprite.scale.x + 1));
    sprite.move(x, y);
    sprite.show();
  };

  /**
   * Generates the state icon sprite representing an afflicted state.
   * @param {string} key The key of this sprite.
   * @param {number} iconIndex The icon index of this sprite.
   */
  createIconSprite(key, iconIndex) {
    let sprite = this._skillSprites.get(key);
    if (sprite) {
      return sprite;
    } else {
      sprite = new Sprite_Icon(iconIndex);
      sprite.scale.x = 4.0;
      sprite.scale.y = 4.0;
      this._skillSprites.set(key, sprite);
      this.addInnerChild(sprite);
      return sprite;
    }
  };

  /**
   * Draws the left column, which mostly includes skill costs.
   */
  drawLeftColumn() {
    const skill = this.skill();
    const actor = this._actor;
    const params = [];

    /* TODO: add after implementing hp costs.
    const hpName = TextManager.longParam(21);
    const hpCost = parseFloat((skill.hpCost * actor.hcr).toFixed(2));
    const hpColor = ColorManager.hpCostColor();
    params.push(new JCMS_ParameterKvp(hpName, hpCost, hpColor));
    */

    params.push(this.makeSkillTypeParam(skill));
    params.push(this.makeDividerParam());
    params.push(this.makeMpCostParam(skill, actor));
    params.push(this.makeTpCostParam(skill, actor));

    const ox = 16;
    const oy = 60;
    const lh = this.lineHeight();
    params.forEach((param, index) => {
      this.resetTextColor();
      this.changeTextColor(param.color());
      this.drawText(`${param.name()}`, ox, oy+(lh*index), 250);
      if (param.value() !== null) {
        this.drawText(`${param.value()}`, ox+180, oy+(lh*index), 250);
      }
    });
  };

  drawMiddleColumn() {
    const skill = this.skill();
    const actor = this._actor;
    const params = [];

    params.push(this.makeProjectedDamageParam(skill, actor));

    const ox = 316;
    const oy = 60;
    const lh = this.lineHeight();
    params.forEach((param, index) => {
      this.resetTextColor();
      this.changeTextColor(param.color());
      this.drawText(`${param.name()}`, ox, oy+(lh*index), 250);
      if (param.value() !== null) {
        this.drawText(`${param.value()}`, ox+250, oy+(lh*index), 250);
      }
    });
  };

  /**
   * Calculates the projected damage to build a parameter.
   * 
   * If the skill lacks a formula, it won't try to project.
   * @param {rm.types.Skill} skill The skill.
   * @param {Game_Actor} actor The actor.
   * @returns 
   */
  makeProjectedDamageParam(skill, actor) {
    // if its a skill that doesn't have a formula, don't try to parse it.
    if (skill.damage.type === 0) {
      return new JCMS_ParameterKvp('Potential Damage', 'n/a', ColorManager.textColor(8));
    }

    const a = actor;
    const b = $gameEnemies.enemy(1);
    const v = $gameVariables._data;
    const sign = [3, 4].includes(skill.damage.type) ? -1 : 1;
    const value = Math.max(eval(skill.damage.formula), 0);
    const potential = isNaN(value) ? 0 : value;
    const color = sign > 0 ? ColorManager.textColor(10) : ColorManager.textColor(24);
    return new JCMS_ParameterKvp('Potential Damage', potential, color )
  };

  drawRightColumn() {
    const skill = this.skill();
    const actor = this._actor;
    const params = [];

  };

  /**
   * Makes a parameter that is used as a divider between other parameters.
   * @returns {JCMS_ParameterKvp}
   */
  makeDividerParam() {
    return new JCMS_ParameterKvp("----------------");
  };

  /**
   * Makes the skill type key value parameter.
   * @param {rm.types.Skill} skill The skill object.
   */
  makeSkillTypeParam(skill) {
    const support = [0];
    const damage = [1, 2];
    const healer = [3, 4];
    const drain  = [5, 6];

    let name = "";
    let color = ColorManager.normalColor();
    switch (true) {
      case support.includes(skill.damage.type):
        name = `Support`;
        color = ColorManager.textColor(0);
        break;
      case damage.includes(skill.damage.type):
        name = "Offensive";
        color = ColorManager.textColor(2);
        break;
      case healer.includes(skill.damage.type): 
        name = "Restorative";
        color = ColorManager.textColor(3);
        break;
      case drain.includes(skill.damage.type):
        name = "Draining";
        color = ColorManager.textColor(31);
        break;
    }

    return new JCMS_ParameterKvp(name, null, color);
  };

  /**
   * Makes the mp cost key value parameter.
   * @param {rm.types.Skill} skill The skill object.
   * @param {Game_Actor} actor The actor.
   */
  makeMpCostParam(skill, actor) {
    const mpName = TextManager.longParam(22);
    let mpColor = ColorManager.mpCostColor();
    const mpCost = parseFloat((skill.mpCost * actor.mcr).toFixed(2));
    if (mpCost === 0) {
      mpColor = ColorManager.damageColor();
    }
    return new JCMS_ParameterKvp(mpName, mpCost, mpColor);
  };

  /**
   * Makes the tp cost key value parameter.
   * @param {rm.types.Skill} skill The skill object.
   * @param {Game_Actor} actor The actor.
   */
  makeTpCostParam(skill, actor) {
    const tpName = TextManager.longParam(23);
    let tpColor = ColorManager.tpCostColor();
    const tpCost = parseFloat((skill.tpCost * actor.tcr).toFixed(2));
    if (tpCost === 0) {
      tpColor = ColorManager.damageColor();
    }

    return new JCMS_ParameterKvp(tpName, tpCost, tpColor);
  };
};
//#endregion Window_SkillDetail

//#region Window_SkillType
Window_SkillType.prototype.makeCommandList = function() {
  if (this._actor) {
    const skillTypeIds = this._actor.skillTypes();
    skillTypeIds.forEach(skillTypeId => {
      const name = $dataSystem.skillTypes[skillTypeId];
      const icon = IconManager.skillType(skillTypeId);
      this.addCommand(name, "skill", true, skillTypeId, icon);
    });
  }
};

Window_SkillType.prototype.maxCols = function() {
  return 1;
};
//#endregion Window_SkillType
//#endregion Window objects

//#region Custom objects
/**
 * A class representing a single key-value pair, with an optional long id.
 * This is used for storing table-like data related to actors and skills.
 */
class JCMS_ParameterKvp {
  constructor(name, value = null, colorId = ColorManager.normalColor()) {
    /**
     * The name of the parameter.
     * @type {string}
     */
    this._name = name;

    /**
     * The value of the parameter.
     * @type {string|number}
     */
    this._value = value;

    /**
     * The id of the color for this parameter when drawing.
     * @type {number}
     */
    this._colorId = colorId;
  };

  /**
   * Gets the name of the parameter.
   * @returns {string}
   */
  name() {
    return this._name;
  };

  /**
   * Gets the value of the parameter associated with this 
   * @param {Game_Actor} actor The actor bearing the parameter.
   * @returns 
   */
  value() {
    return this._value;
  };

  /**
   * Gets the `ColorManager`-provided color id.
   * @returns {string}
   */
  color() {
    return this._colorId;
  };
};
//#endregion Custom objects