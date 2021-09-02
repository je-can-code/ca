//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 DANGER] Displays the danger indicator next to enemy's hp gauge.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * It would be overwhelming to write everything here.
 * Do visit the URL attached to this plugin for documentation.
 *
 * @param Danger Indicator Icons
 * @parent iconConfigs
 * @type struct<DangerIconsStruct>
 * @desc The collection of icons to represent enemy danger levels beside their hp gauge.
 * @default {"Worthless":"880","Simple":"881","Easy":"882","Average":"883","Hard":"884","Grueling":"885","Deadly":"886"}
 */
/*~struct~DangerIconsStruct:
 * @param Worthless
 * @type number
 * @text Extremely Easy <7
 * @desc When an enemy is more 7+ levels below the player, display this icon.
 * @default 591
 *
 * @param Simple
 * @type number
 * @text Very Easy <5-6
 * @desc When an enemy is more 5-6 levels below the player, display this icon.
 * @default 583
 *
 * @param Easy
 * @type number
 * @text Easy <3-4
 * @desc When an enemy is more 3-4 levels below the player, display this icon.
 * @default 581
 *
 * @param Average
 * @type number
 * @text Normal +/- 2
 * @desc When the player and enemy are within 0-2 levels of eachother, display this icon.
 * @default 579
 *
 * @param Hard
 * @type number
 * @text Hard >3-4
 * @desc When an player is more 3-4 levels below the enemy, display this icon.
 * @default 578
 *
 * @param Grueling
 * @type number
 * @text Very Hard >5-6
 * @desc When an player is more 5-6 levels below the enemy, display this icon.
 * @default 577
 *
 * @param Deadly
 * @type number
 * @text Extremely Hard >7+
 * @desc When an player is more 7+ levels below the enemy, display this icon.
 * @default 588
*/
//#endregion Introduction

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
// Check to ensure we have the minimum required version of the J-Base plugin.
const requiredBaseVersion = '1.0.0';
const hasBaseRequirement = J.BASE.Helpers.satisfies(requiredBaseVersion, J.BASE.Metadata.Version);
if (!hasBaseRequirement) {
  throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
}

// Check to ensure we have the minimum required version of the J-ABS plugin.
const requiredJabsVersion = '2.3.0';
const hasJabsRequirement = J.BASE.Helpers.satisfies(requiredJabsVersion, J.ABS.Metadata.Version);
if (!hasJabsRequirement) {
  throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
}
//#endregion version check

//#region plugin setup and configuration
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DANGER = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DANGER.Metadata = {};
J.DANGER.Metadata.Name = 'J-ABS-DangerIndicators';
J.DANGER.Metadata.Version = '1.0.0';

/**
 * A collection of icons that represent the danger level of a given enemy relative to the player.
 */
J.DANGER.DangerIndicatorIcons = {
  /**
   * Worthless enemies are 7+ levels below the player.
   * @type {number}
   */
  Worthless: J.DANGER.Metadata.DangerIndicatorIcons.Worthless,

  /**
   * Simple enemies are 5-6 levels below the player.
   * @type {number}
   */
  Simple: J.DANGER.Metadata.DangerIndicatorIcons.Simple,

  /**
   * Easy enemies are 3-4 levels below the player.
   * @type {number}
   */
  Easy: J.DANGER.Metadata.DangerIndicatorIcons.Easy,

  /**
   * Average enemies are +/- 2 levels of the player.
   * @type {number}
   */
  Average: J.DANGER.Metadata.DangerIndicatorIcons.Average,

  /**
   * Hard enemies are 3-4 levels above the player.
   * @type {number}
   */
  Hard: J.DANGER.Metadata.DangerIndicatorIcons.Hard,

  /**
   * Grueling enemies are 5-6 levels above the player.
   * @type {number}
   */
  Grueling: J.DANGER.Metadata.DangerIndicatorIcons.Grueling,

  /**
   * Deadly enemies are 7+ levels above the player.
   * @type {number}
   */
  Deadly: J.DANGER.Metadata.DangerIndicatorIcons.Deadly,
};
/**
 * A collection of all aliased methods for this plugin.
 */
J.DANGER.Aliased = {
  JABS_Battler: {},
  Sprite_Character: {},
};
//#endregion plugin setup and configuration

//#region Sprite objects
//#region Sprite_Character
J.DANGER.Aliased.Sprite_Character.initMembers = Sprite_Character.prototype.initMembers;
Sprite_Character.prototype.initMembers = function() {
  J.DANGER.Aliased.Sprite_Character.initMembers.call(this);
  this.initDangerIndicatorMembers();
};

Sprite_Character.prototype.initDangerIndicatorMembers = function() {
  this._j = this._j || {};
  this._j._dangerIndicator = null;
};

J.DANGER.Aliased.Sprite_Character.setupMapSprite = Sprite_Character.prototype.setupMapSprite;
Sprite_Character.prototype.setupMapSprite = function() {
  J.DANGER.Aliased.Sprite_Character.setupMapSprite.call(this);
  this.setupDangerIndicator();
};

/**
 * Sets up the danger indicator sprite for this battler.
 */
Sprite_Character.prototype.setupDangerIndicator = function() {
  this._j._dangerIndicator = this.createDangerIndicatorSprite();
  this.addChild(this._j._dangerIndicator);
};

/**
 * Creates the danger indicator sprite for this battler.
 * @returns {Sprite_Icon} The icon representing this danger indicator.
 */
Sprite_Character.prototype.createDangerIndicatorSprite = function() {
  const dangerIndicatorIcon = this.getDangerIndicatorIcon();
  const sprite = new Sprite_Icon(dangerIndicatorIcon);
  sprite.scale.x = 0.5;
  sprite.scale.y = 0.5;
  sprite.move(-50, 8);
  return sprite;
};

/**
 * Determines the iconIndex that indicates the danger level relative to the player and enemy.
 * @returns The icon index of the danger indicator icon.
 */
Sprite_Character.prototype.getDangerIndicatorIcon = function() {
  // if we aren't using them, don't give an icon.
  if (!J.ABS.Metadata.UseDangerIndicatorIcons) return -1;

  // if a battler isn't on this sprite, then don't do it.
  const battler = this.getBattler();
  if (!battler) return -1;

  // if the sprite belongs to the player, then don't do it.
  const player = $gameBattleMap.getPlayerMapBattler().getBattler();
  if (player === battler) return -1;

  // get the corresponding power levels.
  const bpl = battler.getPowerLevel();
  const ppl = player.getPowerLevel();

  switch (true) {
    case (bpl < ppl*0.5):
      return J.ABS.DangerIndicatorIcons.Worthless;
    case (bpl >= ppl*0.5 && bpl < ppl*0.7):
      return J.ABS.DangerIndicatorIcons.Simple;
    case (bpl >= ppl*0.7 && bpl < ppl*0.9):
      return J.ABS.DangerIndicatorIcons.Easy;
    case (bpl >= ppl*0.9 && bpl < ppl*1.1):
      return J.ABS.DangerIndicatorIcons.Average;
    case (bpl >= ppl*1.1 && bpl < ppl*1.3):
      return J.ABS.DangerIndicatorIcons.Hard;
    case (bpl >= ppl*1.3 && bpl <= ppl*1.5):
      return J.ABS.DangerIndicatorIcons.Grueling;
    case (bpl > ppl*1.5):
      return J.ABS.DangerIndicatorIcons.Deadly;
    default:
      console.log(bpl);
      return -1;
  }
};

/**
 * Hooks into the `Sprite_Character.update` and adds our ABS updates.
 */
J.DANGER.Aliased.Sprite_Character.update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
  J.DANGER.Aliased.Sprite_Character.update.call(this);
  if (this.bitmap) {
    if (this.getBattler()) {
      this.updateDangerIndicator();
    } else {
      // if the conditions changed for an event that used to have an hp gauge
      // now hide the gauge.
      if (this._j._dangerIndicator) {
        this.hideDangerIndicator();
      }
    }
  }
};

/**
 * Updates the danger indicator associated with this battler
 */
Sprite_Character.prototype.updateDangerIndicator = function() {
  const mapBattler = this._character.getMapBattler();
  if (mapBattler) {
    if (this.canUpdate() && mapBattler.showDangerIndicator()) {
      if (!this._j._dangerIndicator) {
        this.setupMapSprite();
      }

      this.showDangerIndicator();
    } else {
      this.hideDangerIndicator();
    }
  }
};

/**
 * Shows the danger indicator if it exists.
 */
Sprite_Character.prototype.showDangerIndicator = function() {
  if (this._dangerIndicator) {
    this._dangerIndicator.opacity = 255;
  }
};

/**
 * Hides the danger indicator if it exists.
 */
Sprite_Character.prototype.hideDangerIndicator = function() {
  if (this._dangerIndicator) {
    this._dangerIndicator.opacity = 0;
  }
};
//#endregion Sprite_Character
//#endregion Sprite objects

//#region JABS objects
//#region JABS_Battler
/**
 * Gets whether or not this battler should show its danger indicator.
 * @returns {boolean}
 */
JABS_Battler.prototype.showDangerIndicator = function() {
  return this._showDangerIndicator;
};
//#endregion JABS_Battler
//#endregion JABS objects

//ENDOFFILE