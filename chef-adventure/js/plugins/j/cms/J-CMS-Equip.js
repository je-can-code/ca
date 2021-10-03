//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 CMS_E] A redesign of the equip menu.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This is a redesign of the equipment menu.
 * It includes the ability to see more parameters when changing equips.
 * You can also now press the square button (or equivalent of) to view the
 * detailed information relating to JABS (if applicable).
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
J.CMS_E = {};
 
/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CMS_E.Metadata = {};
J.CMS_E.Metadata.Name = `J-CMS-Equip`;
J.CMS_E.Metadata.Version = '1.0.0';

J.CMS_E.Aliased = {
  Scene_Equip: {},
  Window_EquipSlot: {},
};
//#endregion Introduction

//#region Scene objects
//#region Scene_Equip
/**
 * Initializes this scene.
 */
Scene_Equip.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
  this._j = this._j || {};
  this._j.moreVisible = false;
};

/**
 * OVERWRITE Removes the buttons because fuck the buttons.
 */
Scene_Equip.prototype.createButtons = function() {};

/**
 * OVERWRITE Removes the command window, because who even uses optimize?
 */
Scene_Equip.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
  this.createStatusWindow();
  this.createMoreDataWindow();  
  this.createSlotWindow();
  this.createItemWindow();
  this.refreshActor();
  this._slotWindow.activate();
  this._slotWindow.select(0);
  this._slotWindow.onIndexChange();
};

/**
 * OVERWRITE Replaces the button area height with 0 because fuck buttons.
 * @returns {number}
 */
Scene_Equip.prototype.buttonAreaHeight = () => 0;

/**
 * OVERWRITE Modifies the width of the equip status window.
 */
Scene_Equip.prototype.statusWidth = () => 900;

/**
 * OVERWRITE Modifies the size of the equip slots window.
 * @returns {Rectangle}
 */
Scene_Equip.prototype.slotWindowRect = function() {
  const wx = this.statusWidth();
  const wy = this.mainAreaTop();
  const ww = Graphics.boxWidth - this.statusWidth();
  const wh = this.slotWindowHeight(6);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * Calculates the slot window height based on slot count.
 * @param {number} equipSlotCount The number of slots. 
 * @returns {number} The calculated height for the slot window.
 */
Scene_Equip.prototype.slotWindowHeight = equipSlotCount => 48 * equipSlotCount;

/**
 * Toggles the visibility of the "more" window.
 */
Scene_Equip.prototype.switchToMoreDataFromEquipSlots = function() {
  this._j.moreVisible = !this._j.moreVisible;
  if (this._j.moreVisible) {
    this._slotWindow.refreshMoreData();
    this._slotWindow.deactivate();
    this._moreDataWindow.show();
    this._moreDataWindow.activate();
    this._moreDataWindow.select(0);
  } else {
    this._moreDataWindow.hide();
    this._moreDataWindow.deactivate();
    this._moreDataWindow.deselect();
    this._slotWindow.activate();
  }
};

/**
 * Extends the slot window to include our additional actions.
 */
J.CMS_E.Aliased.Scene_Equip.createSlotWindow = Scene_Equip.prototype.createSlotWindow;
Scene_Equip.prototype.createSlotWindow = function() {
  J.CMS_E.Aliased.Scene_Equip.createSlotWindow.call(this);
  this._slotWindow.setHandler("more", this.switchToMoreDataFromEquipSlots.bind(this));
  this._slotWindow.setHandler("pagedown", this.nextActor.bind(this));
  this._slotWindow.setHandler("pageup", this.previousActor.bind(this));
  this._slotWindow.setMoreDataWindow(this._moreDataWindow);
};

/**
 * OVERWRITE Prevents hiding the item window.
 */
Scene_Equip.prototype.createItemWindow = function() {
  const rect = this.itemWindowRect();
  this._itemWindow = new Window_EquipItem(rect);
  this._itemWindow.setHelpWindow(this._helpWindow);
  this._itemWindow.setStatusWindow(this._statusWindow);
  this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
  this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
  this._slotWindow.setItemWindow(this._itemWindow);
  this.addWindow(this._itemWindow);
};

/**
 * Creates the more data window.
 */
Scene_Equip.prototype.createMoreDataWindow = function() {
  const rect = this.moreDataRect();
  this._moreDataWindow = new Window_MoreEquipData(rect);
  this._moreDataWindow.hide();
  this._moreDataWindow.deactivate();
  this._moreDataWindow.deselect();
  this._moreDataWindow.opacity = 255;
  this._moreDataWindow.setHandler("cancel", this.backToList.bind(this));
  this.addWindow(this._moreDataWindow);
};

Scene_Equip.prototype.moreDataRect = function() {
  const width = 500;
  const wx = this.statusWidth() - width - 12;
  const wy = this.slotWindowRect().y - 12;
  const ww = width;
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.backToList = function() {
  this.switchToMoreDataFromEquipSlots();
};

/**
 * Gets the rectangle that defines the shape of this window.
 * @returns {Rectangle}
 */
Scene_Equip.prototype.itemWindowRect = function() {
  const wx = this.statusWidth();
  const wy = this.mainAreaTop() + this._slotWindow.height;
  const ww = Graphics.boxWidth - this.statusWidth();
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * OVERWRITE Prevents hiding the equip window.
 */
Scene_Equip.prototype.onSlotOk = function() {
  this._itemWindow.activate();
  this._itemWindow.select(0);
};

/**
 * OVERWRITE Replaces the slot cancel functionality with the end of the scene.
 */
Scene_Equip.prototype.onSlotCancel = function() {
  this.popScene();
};

/**
 * OVERWRITE Prevents hiding the item window.
 */
Scene_Equip.prototype.hideItemWindow = function() {
  this._slotWindow.activate();
  this._itemWindow.deselect();
};

/**
 * OVERWRITE Prevents trying to activate a window that was removed from the scene.
 */
Scene_Equip.prototype.onActorChange = function() {
  Scene_MenuBase.prototype.onActorChange.call(this);
  this.refreshActor();
  this.hideItemWindow();
};

/**
 * Extends the actor refresh to include the more data window.
 */
J.CMS_E.Aliased.Scene_Equip.refreshActor = Scene_Equip.prototype.refreshActor;
Scene_Equip.prototype.refreshActor = function() {
  J.CMS_E.Aliased.Scene_Equip.refreshActor.call(this);
  const actor = this.actor();
  this._moreDataWindow.setActor(actor);
};
//#endregion Scene_Equip
//#endregion Scene objects

//#region Window objects
//#region Window_MoreEquipData
/**
 * A window designed to display "more" data associated with the equipment.
 */
class Window_MoreEquipData extends Window_MoreData {
  constructor(rect) {
    super(rect);
  };

  makeCommandList() {
    super.makeCommandList();
    if (!this.item) return;

    this.addJaftingRefinementData();
    this.addSharedCommands();
    this.addJabsEquipmentData();
    this.addEquipmentTraits();
    
    this.addWeaponCommands();
    this.addArmorCommands();

    // always adjust after determining the commands.
    this.adjustWindowHeight();
  };

  addSharedCommands() {
    this.item.params.forEach((value, index) => {
      if (!value) return;

      this.addBaseParameterCommand(index);
    });
  };

  /**
   * Adds all commands exclusive to showing the more data of a weapon.
   */
  addWeaponCommands() {
    if (!this.weaponSelected()) return;
    console.log(this.item);
  };

  /**
   * Adds all commands related to JABS on the equipment.
   */
  addJabsEquipmentData() {
    if (!this.item._j) return;

    const { bonusHits, skillId, speedBoost } = this.item._j;

    const hitBonusCommand = `Hit Count: x${bonusHits+1}`;
    const hitBonusIcon = IconManager.jabsParameterIcon(IconManager.JABS_PARAMETER.BONUS_HITS);
    this.addCommand(hitBonusCommand, null, true, null, hitBonusIcon, 0);  

    if (speedBoost) {
      const speedBoostCommand = `Speed Boost: ${speedBoost}`;
      const speedBoostIcon = IconManager.jabsParameterIcon(IconManager.JABS_PARAMETER.SPEED_BOOST)
      this.addCommand(speedBoostCommand, null, true, null, speedBoostIcon, 0);
    }

    const baseAttackskill = $dataSkills[skillId];
    const comboSkillList = this.recursivelyFindAllComboSkillIds(skillId);
    const baseAttackSkillCommand = comboSkillList.length ? `Combo Starter` : `Attack Skill`;
    const attackSkillCommand = `${baseAttackSkillCommand}: \\C[2]${baseAttackskill.name}\\C[0]`;
    this.addCommand(attackSkillCommand, null, true, null, baseAttackskill.iconIndex, 0);
    if (comboSkillList.length) {
      comboSkillList.forEach((skillId, index) => {
        const skill = $dataSkills[skillId];
        const commandName = `Combo Skill ${index+1}: \\C[2]${skill.name}\\C[0]`;
        this.addCommand(commandName, null, true, null, skill.iconIndex, 0);
      });
    }
  };

  /**
   * Recursively finds the complete combo of an equip starting at a particular
   * skill id and building the collection of skill ids that this skill combos into.
   * @param {number} skillId The id to recursively interpret the combo of.
   * @param {number[]} list The running list of combo skill ids.
   * @returns {number[]} The full combo of the starting skill id.
   */
  recursivelyFindAllComboSkillIds(skillId, list = []) {
    const skillIdList = list;
    const skill = $dataSkills[skillId];
    if (skill._j.combo && !skill._j.freeCombo) {
      const foundComboSkill = skill._j.combo[0];
      skillIdList.push(foundComboSkill);
      return this.recursivelyFindAllComboSkillIds(foundComboSkill, skillIdList);
    } else {
      return skillIdList;
    }
  }

  /**
   * Adds all commands related to JAFTING on the equipment.
   */
  addJaftingRefinementData() {
    if (!this.item._jafting) return;

    const {
      maxRefineCount,
      maxTraitCount,
      notRefinementBase,
      notRefinementMaterial,
      refinedCount,
      unrefinable
    } = this.item._jafting;

    if (unrefinable) {
      const unrefinableCommand = `Unrefinable`;
      const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.UNREFINABLE);
      const unrefinableColor = 2;
      this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
      return;
    }

    if (notRefinementBase) {
      const unrefinableCommand = `Only Refine as Material`;
      const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.NOT_BASE);
      const unrefinableColor = 2;
      this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
    }

    if (notRefinementMaterial) {
      const unrefinableCommand = `Only Refine as Base`;
      const unrefinableIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.NOT_MATERIAL);
      const unrefinableColor = 2;
      this.addCommand(unrefinableCommand, null, true, null, unrefinableIcon, unrefinableColor);
    }

    let maxRefineIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.TIMES_REFINED);
    let maxRefineCommand = `Refinement: ${refinedCount}`;
    if (maxRefineCount) {
      maxRefineCommand += ` / ${maxRefineCount}`;
      if (maxRefineCount === refinedCount) {
        maxRefineIcon = 91;
      }
    }

    this.addCommand(maxRefineCommand, null, true, null, maxRefineIcon);

    let maxTraitIcon = IconManager.jaftingParameterIcon(IconManager.JAFTING_PARAMETER.MAX_TRAITS);
    const currentTraitCount = $gameJAFTING.parseTraits(this.item).length;
    let maxTraitCommand = `Transferable Traits: ${currentTraitCount}`;
    if (maxTraitCount) {
      maxTraitCommand += ` / ${maxTraitCount}`;
    }

    this.addCommand(maxTraitCommand, null, true, null, maxTraitIcon);
  };

  /**
   * Adds a command to the list based on the base parameter matching the given id.
   * @param {number} paramId The id of the base parameter.
   */
  addBaseParameterCommand(paramId) {
    const baseValue = this.item.params[paramId];
    const commandName = `${TextManager.param(paramId)}: ${baseValue}`;
    this.addCommand(commandName, null, true, null, IconManager.param(paramId), 0);
  };

  addEquipmentTraits() {
    // we have no traits.
    const allTraits = this.item.traits;
    if (!allTraits.length) return;

    const xparamNoPercents = [0, 2, 8]; // code 22
    const sparamNoPercents = [1]; // code 23
    const dividerIndex = allTraits.findIndex(trait => trait.code === J.BASE.Traits.NO_DISAPPEAR);
    const hasDivider = dividerIndex !== -1;
    if (hasDivider) {
      this.addCommand(`BASE TRAITS`, null, true, null, 16, 30);
    }

    allTraits.forEach(t => {
      const convertedTrait = new JAFTING_Trait(t.code, t.dataId, t.value);
      let commandName = convertedTrait.nameAndValue;
      let commandColor = 0;
      switch (convertedTrait._code) {
        case 21:
          const paramId = convertedTrait._dataId;
          const paramBase = this.actor.paramBase(paramId);
          const bonus = paramBase * (convertedTrait._value-1);
          const sign = bonus >= 0 ? '+' : '-';
          commandName += ` \\C[6](${sign}${bonus.toFixed(2)})\\C[0]`;
          break;
        case 22:
          const xparamId = convertedTrait._dataId;
          if (xparamNoPercents.includes(xparamId)) {
            commandName = commandName.replace("%", String.empty);
          }
          
          break;
        case 23:
          const sparamId = convertedTrait._dataId;
          if (sparamNoPercents.includes(sparamId)) {
            commandName = commandName.replace("%", String.empty);
          }

          break;
        case 63:
          commandName = convertedTrait.name;
          commandColor = 30;
          break;
      }

      const commandIcon = IconManager.trait(convertedTrait);
      this.addCommand(commandName, null, true, null, commandIcon, commandColor);
    });
  };

  /**
   * 
   * @param {number} paramId The id of the base parameter.
   */
  addBaseParameterTraitCommand(paramId) {
    let commandName = `${TextManager.param(paramId)}: `;
    const traitBonus = this.item.traits
      .filter(trait => trait.code === J.BASE.Traits.B_PARAMETER && trait.dataId === paramId)
      .reduce((r, trait) => r * trait.value, 1);
    if (traitBonus && traitBonus !== 1) {
      const sign = traitBonus > 1 ? '+' : '-';
      const value = ((traitBonus - 1) * 100).toFixed(0);
      commandName += ` ${sign}${value}%`;
      this.addCommand(commandName, null, true, null, IconManager.param(paramId), 0);
    }
  };

  /**
   * Adds all commands exclusive to showing the more data of a armor.
   */
  addArmorCommands() {
    if (!this.armorSelected()) return;
    console.log(this.item);
  };
};
//#endregion Window_MoreEquipData

//#region Window_EquipSlot
/**
 * Extends the `.initialize()` to include tracking for the more equip data window.
 */
J.CMS_E.Aliased.Window_EquipSlot.initialize = Window_EquipSlot.prototype.initialize;
Window_EquipSlot.prototype.initialize = function(rect) {
  J.CMS_E.Aliased.Window_EquipSlot.initialize.call(this, rect);
  /**
   * The more data window to manipulate.
   * @type {Window_MoreEquipData}
   */
  this._moreDataWindow = null;
};

/**
 * Refreshes the more data window.
 */
Window_EquipSlot.prototype.refreshMoreData = function() {
  this.onIndexChange();
};

/**
 * Updates the "more" window to point to the new index's item.
 */
Window_EquipSlot.prototype.onIndexChange = function() {
  this._moreDataWindow.setItem(this.item());
};

/**
 * Associates the more equip data window to this one for observation.
 * @param {Window_MoreEquipData} moreDataWindow The window to attach to this.
 */
Window_EquipSlot.prototype.setMoreDataWindow = function(moreDataWindow) {
  this._moreDataWindow = moreDataWindow;
};
//#endregion Window_EquipSlot
//#endregion Window objects
//ENDFILE