//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 DANGER] Enable danger indicators on foes on the map.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * This plugin enables the ability to display danger indicators on enemies
 * while on the map.
 *
 * This plugin requires JABS.
 * This plugin is plug-n-play, with minimal configuration.
 * ============================================================================
 * USAGE:
 * If you are using JABS, then JABS already knows what to do to make use of
 * this functionality. Just add this plugin after/below JABS, and it'll work
 * with no additional adjustments.
 * ============================================================================
 * @param defaultEnemyShowDangerIndicator
 * @type boolean
 * @text Show Indicator by Default
 * @desc The default for whether or not enemies' danger indicators are visible.
 * @default true
 *
 * @param dangerIndicatorIconData
 * @type struct<DangerIconsStruct>
 * @text Danger Indicator Icons
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

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DANGER = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DANGER.Metadata =
  {
    /**
     * The name of this plugin.
     */
    Name: `J-ABS-DangerIndicator`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

/**
 * A collection of helper functions for use within this plugin.
 */
J.DANGER.Helpers = {};

/**
 * A collection of helper functions for the use with the plugin manager.
 */
J.DANGER.Helpers.PluginManager = {};

/**
 * Translates the plugin parameters' JSON into the danger icon metadata.
 * @param {string} obj The JSON to be parsed into danger icons.
 * @returns {{}} A custom object containing KVPs of [name]: [iconIndex].
 */
J.DANGER.Helpers.PluginManager.TranslateDangerIndicatorIcons = obj =>
{
  // no danger indicator icons identified.
  if (!obj) return {};

  // parse the JSON and update the values to be actual numbers.
  const raw = JSON.parse(obj);
  Object.keys(raw).forEach(key =>
  {
    raw[key] = parseInt(raw[key]);
  });

  return raw;
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.DANGER.PluginParameters = PluginManager.parameters(J.DANGER.Metadata.Name);
J.DANGER.Metadata.DefaultEnemyShowDangerIndicator = J.DANGER.PluginParameters['defaultEnemyShowDangerIndicator'] === "true";
J.DANGER.Metadata.DangerIndicatorIcons = J.DANGER.Helpers.PluginManager.TranslateDangerIndicatorIcons(J.DANGER.PluginParameters['dangerIndicatorIconData']);

/**
 * A collection of icons that represent the danger level of a given enemy relative to the player.
 */
J.DANGER.DangerIndicatorIcons =
  {
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
 * A collection of all extended classes in this plugin.
 */
J.DANGER.Aliased =
  {
    Game_Character: new Map(),
    Game_Event: new Map(),
    JABS_Battler: new Map(),
    JABS_BattlerCoreData: new Map(),
    Sprite_Character: new Map(),
    Spriteset_Map: new Map(),
  };
//#endregion Introduction

//#region Game objects
//#region Game_Actor
/**
 * Gets whether or not the actor's danger indicator will show.
 * Danger indicator is not applicable to actors (since it is relative to the player).
 * @returns {boolean}
 */
Game_Actor.prototype.showDangerIndicator = function()
{
  return false;
};
//#endregion Game_Actor

//#region Game_Enemy
/**
 * Gets whether or not an enemy has a visible danger indicator from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.showDangerIndicator = function()
{
  let val = J.DANGER.Metadata.DefaultEnemyShowDangerIndicator;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoDangerIndicator])
  {
    // if its in the metadata, then grab it from there.
    val = false;
  }
  else
  {
    const structure = /<noDangerIndicator>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = false;
      }
    });
  }

  return val;
};
//#endregion Game_Enemy

//#region Game_Event
/**
 * Extends the binding of core battler data to the event.
 * Adds the danger indicator data to the core battler data.
 * @param {JABS_BattlerCoreData|null} battlerCoreData The core data of this battler.
 */
J.DANGER.Aliased.Game_Event.set('initializeCoreData', Game_Event.prototype.initializeCoreData);
Game_Event.prototype.initializeCoreData = function(battlerCoreData)
{
  // check to make sure the core data isn't null.
  if (battlerCoreData !== null)
  {
    // update the core data with the danger indicator.
    battlerCoreData = this.updateWithDangerIndicator(battlerCoreData);
  }

  // perform original logic, potentially with the modified core data.
  J.DANGER.Aliased.Game_Event.get('initializeCoreData').call(this, battlerCoreData);
};

/**
 * Updates the battler core data with the show danger indicator information.
 * @param {JABS_BattlerCoreData} battlerCoreData The core data of this battler.
 */
Game_Event.prototype.updateWithDangerIndicator = function(battlerCoreData)
{
  // determine whether or not to show the indicator.
  const showDangerIndicator = this.canShowDangerIndicator(battlerCoreData.battlerId());

  // assign the above determined boolean.
  battlerCoreData.setDangerIndicator(showDangerIndicator);

  // return the modified core data.
  return battlerCoreData;
};

/**
 * Gets whether or not to show the danger indicator on this battler.
 * @param {number} battlerId The id of the battler to check.
 * @returns {boolean} True if we should show the indicator, false otherwise.
 */
Game_Event.prototype.canShowDangerIndicator = function(battlerId)
{
  //TODO: add equipment that can hide/show the danger indicator?

  // start with the default of whether or not to show the danger indicator.
  let showDangerIndicator = $gameEnemies.enemy(battlerId).showDangerIndicator();

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then it must be false.
  if (!commentCommands.length) return showDangerIndicator;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const comment = command.parameters[0];

    // if we are explicitly saying to hide it, then hide it.
    if (/<noDangerIndicator>/i.test(comment))
    {
      showDangerIndicator = false;
    }
    // if we explicitly saying to show it, then show it.
    else if (/<showDangerIndicator>/i.test(comment))
    {
      showDangerIndicator = true;
    }
  });

  // return whether or not to show the danger indicator.
  return showDangerIndicator;
};
//#endregion Game_Event
//#endregion Game objects

//#region Sprite objects
//#region Sprite_Character
/**
 * Extends the `initMembers()` function to include our new data.
 */
J.DANGER.Aliased.Sprite_Character.set('initMembers', Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * The danger indicator sprite for this character.
   * @type {Sprite_Icon}
   */
  this._j._dangerIndicator = null;

  // perform original logic.
  J.DANGER.Aliased.Sprite_Character.get('initMembers').call(this);
};

/**
 * Setup this `Sprite_Character` with the additional JABS-related functionalities.
 */
J.DANGER.Aliased.Sprite_Character.set('setupJabsSprite', Sprite_Character.prototype.setupJabsSprite);
Sprite_Character.prototype.setupJabsSprite = function()
{
  // perform original logic.
  J.DANGER.Aliased.Sprite_Character.get('setupJabsSprite').call(this);

  // if this is a battler, configure the visual components of the battler.
  this.handleBattlerSetup();

  // setup the danger indicator.
  this.setupDangerIndicator();
};

/**
 * Sets up the danger indicator sprite for this battler.
 */
Sprite_Character.prototype.setupDangerIndicator = function()
{
  // determine the icon index for this battler.
  const dangerIndicatorIcon = this.getDangerIndicatorIcon();

  // check if we already have an indicator present.
  if (this._j._dangerIndicator)
  {
    // overwrite the icon on it.
    this._j._dangerIndicator.setIconIndex(dangerIndicatorIcon);
  }
  // if we don't have an indicator, then build it.
  else
  {
    // create and assign the danger indicator sprite.
    this._j._dangerIndicator = this.createDangerIndicatorSprite(dangerIndicatorIcon);

    // add it to this sprite's tracking.
    this.addChild(this._j._dangerIndicator);
  }
};

/**
 * Creates the danger indicator sprite for this battler.
 * @returns {Sprite_Icon} The icon representing this danger indicator.
 */
Sprite_Character.prototype.createDangerIndicatorSprite = function(dangerIndicatorIcon)
{
  // instantiate the new sprite and hide it.
  const sprite = new Sprite_Icon(dangerIndicatorIcon);
  sprite.hide();

  // reduces scaling to draw the sprite smaller.
  sprite.scale.x = 0.5;
  sprite.scale.y = 0.5;

  // relocates the sprite to a better position.
  sprite.move(-50, 8);

  // return this created sprite.
  return sprite;
};

/**
 * Determines the iconIndex that indicates the danger level relative to the player and enemy.
 * @returns The icon index of the danger indicator icon.
 */
Sprite_Character.prototype.getDangerIndicatorIcon = function()
{
  // if a battler isn't on this sprite, then don't do it.
  const battler = this.getBattler();
  if (!battler) return -1;

  // if the sprite belongs to the player, then don't do it.
  const player = $gameBattleMap.getPlayerMapBattler().getBattler();
  if (player === battler) return -1;

  // get the corresponding power levels.
  const bpl = battler.getPowerLevel();
  const ppl = player.getPowerLevel();

  switch (true)
  {
    case (bpl < ppl * 0.5):
      return J.DANGER.DangerIndicatorIcons.Worthless;
    case (bpl >= ppl * 0.5 && bpl < ppl * 0.7):
      return J.DANGER.DangerIndicatorIcons.Simple;
    case (bpl >= ppl * 0.7 && bpl < ppl * 0.9):
      return J.DANGER.DangerIndicatorIcons.Easy;
    case (bpl >= ppl * 0.9 && bpl < ppl * 1.1):
      return J.DANGER.DangerIndicatorIcons.Average;
    case (bpl >= ppl * 1.1 && bpl < ppl * 1.3):
      return J.DANGER.DangerIndicatorIcons.Hard;
    case (bpl >= ppl * 1.3 && bpl <= ppl * 1.5):
      return J.DANGER.DangerIndicatorIcons.Grueling;
    case (bpl > ppl * 1.5):
      return J.DANGER.DangerIndicatorIcons.Deadly;
    default:
      console.error(bpl);
      return -1;
  }
};

/**
 * Extends `update()` to update the danger indicator.
 */
J.DANGER.Aliased.Sprite_Character.set('update', Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function()
{
  // perform original logic.
  J.DANGER.Aliased.Sprite_Character.get('update').call(this);

  // check if we can update the indicator.
  if (this.canUpdateDangerIndicator())
  {
    // update it.
    this.updateDangerIndicator();
  }
  // otherwise, if we can't update it...
  else
  {
    // hide it.
    this.hideDangerIndicator();
  }
};

/**
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
Sprite_Character.prototype.canUpdateDangerIndicator = function()
{
  // if we're not using JABS, then it shouldn't update.
  if (!this.canUpdate()) return false;

  // if this sprite doesn't have a battler, then it shouldn't update.
  if (!this.isJabsBattler()) return false;

  // if we aren't allowed to show the indicator, then it shouldn't update.
  if (!this._character.getMapBattler().showDangerIndicator()) return false;

  // we should update!
  return true;
};

/**
 * Updates the danger indicator associated with this battler
 */
Sprite_Character.prototype.updateDangerIndicator = function()
{
  // show the indicator if we should be showing it.
  this.showDangerIndicator();
};

/**
 * Shows the danger indicator if it exists.
 */
Sprite_Character.prototype.showDangerIndicator = function()
{
  this._j._dangerIndicator.show();
};

/**
 * Hides the danger indicator if it exists.
 */
Sprite_Character.prototype.hideDangerIndicator = function()
{
  this._j._dangerIndicator.hide();
};
//#endregion Sprite_Character

//#region Spriteset_Map
/**
 * Extends `refreshAllCharacterSprites()` to also refresh danger indicators.
 */
J.DANGER.Aliased.Spriteset_Map.set('refreshAllCharacterSprites', Spriteset_Map.prototype.refreshAllCharacterSprites);
Spriteset_Map.prototype.refreshAllCharacterSprites = function()
{
  // iterate over each sprite and set up its danger indicators if necessary.
  this._characterSprites.forEach(sprite => sprite.setupDangerIndicator());

  // perform original logic.
  J.DANGER.Aliased.Spriteset_Map.get('refreshAllCharacterSprites').call(this);
};
//#endregion Spriteset_Map
//#endregion Sprite objects

//#region Custom objects
//#region JABS_BattlerCoreData
/**
 * Extends the `initMembers()` function to include our new data.
 */
J.DANGER.Aliased.JABS_BattlerCoreData.set('initMembers', JABS_BattlerCoreData.prototype.initMembers);
JABS_BattlerCoreData.prototype.initMembers = function()
{
  // perform original logic.
  J.DANGER.Aliased.JABS_BattlerCoreData.get('initMembers').call(this);

  /**
   * Whether or not this battler's danger indicator will be visible.
   * @type {boolean} True if the battler's danger indicator should show, false otherwise.
   */
  this._showDangerIndicator = J.DANGER.Metadata.DefaultEnemyShowDangerIndicator;
};
/**
 * Sets whether or not to show the danger indicator.
 */
JABS_BattlerCoreData.prototype.setDangerIndicator = function(showDangerIndicator)
{
  this._showDangerIndicator = showDangerIndicator;
};

/**
 * Gets whether or not this battler's danger indicator will be visible.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.showDangerIndicator = function()
{
  // danger indicators NEVER show on inanimate enemies.
  if (this.isInanimate()) return false;

  return this._showDangerIndicator;
};
//#endregion JABS_BattlerCoreData

//#region JABS_Battler
/**
 * Extends `initCoreData()` to include our danger indicator flag.
 * @param {JABS_BattlerCoreData} battlerCoreData The core data of the battler.
 */
J.DANGER.Aliased.JABS_Battler.set('initCoreData', JABS_Battler.prototype.initCoreData);
JABS_Battler.prototype.initCoreData = function(battlerCoreData)
{
  /**
   * Whether or not this battler's danger indicator is visible.
   * Inanimate battlers do not show by default.
   * @type {boolean}
   */
  this._showDangerIndicator = battlerCoreData.isInanimate()
    ? false
    : battlerCoreData.showDangerIndicator();

  // perform original logic.
  J.DANGER.Aliased.JABS_Battler.get('initCoreData').call(this, battlerCoreData);
};
/**
 * Gets whether or not this battler should show its danger indicator.
 * @returns {boolean}
 */
JABS_Battler.prototype.showDangerIndicator = function()
{
  return this._showDangerIndicator;
};
//#endregion JABS_Battler
//#endregion Custom objects

//ENDOFFILE