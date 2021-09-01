/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Mods/Adds for the various window object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This is a cluster of all changes/overwrites to the objects that would
 * otherwise be found in the rmmz_windows.js, such as Window_Gold. Also, any
 * new things that follow the pattern that defines a window object can be found
 * in here.
 * ============================================================================
 */

//#region Window_AbsMenu
/**
 * The window representing what is called and manages the player's assigned skill slots.
 */
 class Window_AbsMenu extends Window_Command {
  /**
   * @constructor
   * @param {Rectangle} rect The shape of the window.
   */
  constructor(rect) { 
    super(rect);
    this.initialize(rect);
  };
  
  /**
   * Initializes this window.
   * @param {Rectangle} rect The shape of the window.
   */
  initialize(rect) {
    super.initialize(rect);
    this.refresh();
    this.select(0);
    this.activate();
  };

  /**
   * Generates the command list for the JABS menu.
   */
  makeCommandList() {
    // to adjust the icons, change the number that is the last parameter of these commands.
    this.addCommand(J.ABS.Metadata.EquipCombatSkillsText, "skill-assign", true, null, 77);
    this.addCommand(J.ABS.Metadata.EquipDodgeSkillsText, "dodge-assign", true, null, 82);
    this.addCommand(J.ABS.Metadata.EquipToolsText, "item-assign", true, null, 83);
    this.addCommand(J.ABS.Metadata.MainMenuText, "main-menu", true, null, 189);
    this.addCommand(J.ABS.Metadata.CancelText, "cancel", true, null, 73);
  };

  /**
   * Closes the Abs menu.
   */
  closeMenu() {
    if (!this.isClosed()) {
      this.close();
      $gameBattleMap.absPause = false;
      $gameBattleMap.requestAbsMenu = false;
    }
  };

}

//#endregion

//#region Window_AbsMenuSelect
/**
 * A window that is reused to draw all the subwindows of the JABS menu.
 */
class Window_AbsMenuSelect extends Window_Command {
  /**
   * @constructor
   * @param {Rectangle} rect The shape of the window.
   * @param {string} type The type of window this is, such as "dodge" or "skill".
   */
  constructor(rect, type) {
    super(rect);
    this.initialize(rect, type);
  };

  /**
   * Initializes this window.
   * @param {Rectangle} rect The window dimensions.
   * @param {string} type The type of abs menu selection this is.
   */
  initialize(rect, type) {
    this._j = {};
    this._j._menuType = type;
    super.initialize(rect);
    this.refresh();
    this.select(0);
    this.activate();
  };

  /**
   * Draws all commands of this select window.
   */
  makeCommandList() {
    switch (this._j._menuType) {
      case "skill":
        // the list of all equippable combat skills this actor knows.
        this.makeSkillList();
        break;
      case "tool":
        // the list of all items/tools in the party's possession.
        this.makeToolList();
        break;
      case "dodge":
        // the list of all equippable dodge skills this actor knows.
        this.makeDodgeList();
        break;
      case "equip-skill":
        // the combat skill equip menu, where all the combat skills can be equipped.
        this.makeEquippedSkillList();
        break;
      case "equip-tool":
        // the tool equip menu, where the items/tools can be equipped.
        this.makeEquippedToolList();
        break;
      case "equip-dodge":
        // the dodge skill equip menu, where all the dodge skills can be equipped.
        this.makeEquippedDodgeList();
        break;
    }
  };

  /**
   * Fills the list with learned skills to assign.
   */
  makeSkillList() {
    const actor = $gameParty.leader();
    const skills = actor.skills().filter(skill => {
      const isDodgeSkillType = JABS_Battler.isDodgeSkillById(skill.id);
      const isGuardSkillType = JABS_Battler.isGuardSkillById(skill.id);
      let needsHiding = false;
      // supports yanfly's skill core functionality and hides from the menu where applicable.
      if (skill.meta && skill.meta["Hide if learned Skill"]) {
        const nextSkillId = parseInt(skill.meta["Hide if learned Skill"]);
        needsHiding = actor.isLearnedSkill(nextSkillId);
      }

      return !isDodgeSkillType && !isGuardSkillType && !needsHiding;
    });

    this.addCommand(J.ABS.Metadata.ClearSlotText, "skill", true, 0, 16);
    skills.forEach(skill => {
      this.addCommand(skill.name, "skill", true, skill.id, skill.iconIndex);
    });
  };

  /**
   * Fills the list with items in the player's possession to assign.
   */
  makeToolList() {
    const items = $gameParty.allItems().filter(item => {
      const isItem = DataManager.isItem(item) && item.itypeId === 1;
      const isUsable = isItem && (item.occasion === 0);
      return isItem && isUsable;
    });

    this.addCommand(J.ABS.Metadata.ClearSlotText, "tool", true, 0, 16);
    items.forEach(item => {
      const name = `${item.name}: ${$gameParty.numItems(item)}`;
      this.addCommand(name, "tool", true, item.id, item.iconIndex);
    });
  };

  /**
   * Fills the list with the currently assigned dodge.
   */
  makeDodgeList() {
    const actor = $gameParty.leader();
    const skills = actor.skills();
    const dodgeSkills = skills.filter(skill => {
      return skill.stypeId === 1;
    });

    this.addCommand(J.ABS.Metadata.ClearSlotText, "dodge", true, 0, 16);
    dodgeSkills.forEach(dodge => {
      this.addCommand(dodge.name, "dodge", true, dodge.id, dodge.iconIndex);
    });
  };

  /**
   * Fills the list with the currently assigned items.
   */
  makeEquippedSkillList() {
    const actor = $gameParty.leader();
    const equippedActions = actor.getAllEquippedSkills();
    const keys = Object.keys(equippedActions).filter(key => {
      return (
        key !== Game_Actor.JABS_MAINHAND &&
        key !== Game_Actor.JABS_OFFHAND &&
        key !== Game_Actor.JABS_TOOLSKILL &&
        key !== Game_Actor.JABS_DODGESKILL);
    });

    keys.forEach(key => {
      const skillSlot = equippedActions[key];
      let name = `${key}: ${J.ABS.Metadata.UnassignedText}`;
      let iconIndex = 0;
      if (skillSlot.id !== 0) {
        const equippedSkill = $dataSkills[skillSlot.id];
        name = `${equippedSkill.name}`;
        iconIndex = equippedSkill.iconIndex;
      }

      this.addCommand(name, "slot", true, key, iconIndex);
    });
  };

  /**
   * Fills the list with the currently assigned items.
   */
  makeEquippedToolList() {
    const actor = $gameParty.leader();
    const equippedActions = actor.getAllEquippedSkills();
    const keys = Object.keys(equippedActions).filter(key => key === Game_Actor.JABS_TOOLSKILL);

    keys.forEach(key => {
      const toolSlot = equippedActions[key];
      let name = `${key}: ${J.ABS.Metadata.UnassignedText}`;
      let iconIndex = 0;
      if (toolSlot.id !== 0) {
        const equippedTool = $dataItems[toolSlot.id];
        name = `${equippedTool.name}: ${$gameParty.numItems(equippedTool)}`;
        iconIndex = equippedTool.iconIndex;
      }

      this.addCommand(name, "slot", true, key, iconIndex);
    });
  };

  /**
   * Fills the list with the currently assigned items.
   */
  makeEquippedDodgeList() {
    const actor = $gameParty.leader();
    const equippedActions = actor.getAllEquippedSkills();
    const keys = Object.keys(equippedActions).filter(key => key === Game_Actor.JABS_DODGESKILL);

    keys.forEach(key => {
      const dodgeSlot = equippedActions[key];
      let name = `${key}: ${J.ABS.Metadata.UnassignedText}`;
      let iconIndex = 0;
      if (dodgeSlot.id !== 0) {
        const equippedDodgeSkill = $dataSkills[dodgeSlot.id];
        name = `${equippedDodgeSkill.name}`;
        iconIndex = equippedDodgeSkill.iconIndex;
      }

      this.addCommand(name, "slot", true, key, iconIndex);
    });
  };
}
//#endregion Window_AbsMenuSelect
//ENDFILE