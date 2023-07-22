//=============================================================================
// RPG Maker MZ - Region Base Plugin
//=============================================================================
// Version
// 1.0.1 2020/10/20 マップデータがロードされていないタイミングでアクターの特徴がスクリプト経由で参照されるとエラーになる問題を修正
// 1.0.0 2020/08/20 初版
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Region Base Plugin
 * @author triacontane
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url
 * @help
 * ============================================================================
 * NOTE:
 * This plugin has been modified to be compatible with JABS!
 * If wanting to use this plugin, please retrieve your own untampered copy from
 *  <RMMZ install folder>/dlc/BasicResources/plugins/official/RegionBase.js
 * ============================================================================
 * Offers a database of regions and terrain tags.
 * The specs generally follow RPG Maker MV Trinity.
 * The plug-in offers the following functions using regions and terrain tags as
 * triggers:
 *
 *  - Event, player passage determination (4 dir included)
 *  - Ladders, bushes, counters, damage floors
 *  - Calling of common events (3 trigger types)
 *  - Switches that turn ON only when a tile is entered
 *  - Traits enabled only when a tile is entered
 *  - Notes field
 *
 * The database can be referred to from scripts and external plug-ins with the
 * following script. Please note that when not configured, or if the index set
 * to [0], the content will become undefined.
 *    $dataSystem.regions[ID];
 *    $dataSystem.terrainTags[ID];
 * ============================================================================
 * @param regionList
 * @text Region List
 * @desc List of region data.
 * @default []
 * @type struct<Record>[]
 *
 * @param terrainTagList
 * @text Terrain Tag List
 * @desc List of terrain tag data.
 * @default []
 * @type struct<Record>[]

 */

/*~struct~Record:
 *
 * @param id
 * @text ID
 * @desc Target region or terrain tag ID.
 * @default 1
 * @type number
 *
 * @param name
 * @text Name
 * @desc Name for management. No special significance.
 * @default
 *
 * @param collisionForPlayer
 * @text Player Collision Determination
 * @desc Determines collision with player.
 * @default []
 * @type select[]
 * @option Impassable
 * @value collision_all
 * @option Cannot be passed from top
 * @value collision_up
 * @option Cannot be passed from right
 * @value collision_right
 * @option Cannot be passed from bottom
 * @value collision_down
 * @option Cannot be passed from left
 * @value collision_left
 *
 * @param collisionForEvent
 * @text Event Collision Determination
 * @desc Determines collision with event.
 * @default []
 * @type select[]
 * @option Impassable
 * @value collision_all
 * @option Cannot be passed from top
 * @value collision_up
 * @option Cannot be passed from right
 * @value collision_right
 * @option Cannot be passed from bottom
 * @value collision_down
 * @option Cannot be passed from left
 * @value collision_left
 *
 * @param through
 * @text Through
 * @desc Through settings. Enable to pass through impassable tiles. Collision determination takes priority.
 * @default false
 * @type boolean
 *
 * @param tileAttribute
 * @text Tile Attribute
 * @desc The tile attribute.
 * @default []
 * @type select[]
 * @option Ladder
 * @value ladder
 * @option Bush
 * @value bush
 * @option Counter
 * @value counter
 * @option Damage Floor
 * @value damage_floor
 *
 * @param commonEvent
 * @text Common Event
 * @desc Common event to be called.
 * @type struct<CommonEvent>[]
 *
 * @param switchId
 * @text SwitchID
 * @desc Switch that turns ON when tile is entered. Turns OFF when left.
 * @type switch
 *
 * @param traitsId
 * @text Traits
 * @desc Traits that are enabled only when the Player has entered the tile. Selected from Jobs for convenience.
 * @type class
 *
 * @param note
 * @text Notes
 * @desc The notes field. As with the regular database, meta information is always generated from here. Assumes usage in scripts.
 * @type multiline_string
 */

/*~struct~CommonEvent:
 *
 * @param id
 * @text ID
 * @desc Common Event ID.
 * @default 1
 * @type common_event
 *
 * @param trigger
 * @text Trigger
 * @desc Launch trigger for common events.
 * @default 0
 * @type select
 * @option Executes only once when the area is entered
 * @value 0
 * @option Executes when the player walks while in the area
 * @value 1
 * @option Executes only once when the area is left
 * @value 2
 */

(() =>
{
  'use strict';
  const script = document.currentScript;
  const param  = PluginManagerEx.createParameter(script);

  const _DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function(object) {
    _DataManager_onLoad.apply(this, arguments);
    if ($dataSystem && $dataClasses && !$dataSystem.regions) {
      PluginManagerEx.setupRegionData(param.regionList, 'regions');
      PluginManagerEx.setupRegionData(param.terrainTagList, 'terrainTags');
    }
  };

  PluginManagerEx.setupRegionData = function(paramList, prop) {
    const dataList = [];
    $dataSystem[prop] = dataList;
    if (!Array.isArray(paramList)) {
      return;
    }
    paramList.forEach(item => {
      dataList[item.id] = item;
      const classData = $dataClasses[item.traitsId];
      if (classData) {
        item.traits = classData.traits;
      }
    });
    DataManager.extractArrayMetadata(dataList);
  };

  /**
   * Game_CharacterBase
   */
  const _Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
  Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    $gameMap.setPassableSubject(this);
    return _Game_CharacterBase_isMapPassable.apply(this, arguments)
  };

  Game_CharacterBase.prototype.findCollisionData = function(x, y) {
    return null;
  };

  Game_Event.prototype.findCollisionData = function(x, y) {
    return $gameMap.findArrayDataRegionAndTerrain(x, y, 'collisionForEvent');
  };

  Game_Player.prototype.findCollisionData = function(x, y) {
    return $gameMap.findArrayDataRegionAndTerrain(x, y, 'collisionForPlayer');
  };

  /**
   * Game_Player
   */
  const _Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function(sceneActive) {
    const wasMoving = this.isMoving();
    _Game_Player_update.apply(this, arguments);
    if (!this.isMoving() && wasMoving) {
      this.updateCurrentRegion();
      this.updateCurrentTerrainTags();
    }
  };

  Game_Player.prototype.updateCurrentRegion = function() {
    this._region = $gameMap.findCurrentRegion(this.x, this.y);
    this.updateCurrentRegionAndTerrain(this._region, this._prevRegion);
    this._prevRegion = this._region;
  };

  Game_Player.prototype.updateCurrentTerrainTags = function() {
    this._terrainTags = $gameMap.findCurrentTerrainTag(this.x, this.y);
    this.updateCurrentRegionAndTerrain(this._terrainTags, this._prevTerrainTags);
    this._prevTerrainTags = this._terrainTags;
  };

  Game_Player.prototype.updateCurrentRegionAndTerrain = function(current, prev) {
    this.checkRegionCommonTrigger(current || {}, prev || {});
    this.checkRegionSwitch(current || {}, prev || {});
  };

  Game_Player.prototype.checkRegionCommonTrigger = function(current, prev) {
    (current.commonEvent || []).forEach(event => {
      if (event.trigger === 0 && current.id !== prev.id) {
        $gameMap.setupDynamicCommon(event.id);
      } else if (event.trigger === 1) {
        $gameMap.setupDynamicCommon(event.id);
      }
    });
    (prev.commonEvent || []).forEach(event => {
      if (event.trigger === 2 && current.id !== prev.id) {
        $gameMap.setupDynamicCommon(event.id);
      }
    });
  };

  Game_Player.prototype.checkRegionSwitch = function(current, prev) {
    if (current.id !== prev.id) {
      if (current.switchId > 0) {
        $gameSwitches.setValue(current.switchId, true);
      }
      if (prev.switchId > 0) {
        $gameSwitches.setValue(prev.switchId, false);
      }
    }
  };

  Game_Player.prototype.appendRegionTraits = function(traitsObjects) {
    if ($gameMap.mapId() <= 0 || !$dataMap) {
      return traitsObjects;
    }
    const region = $gameMap.findCurrentRegion(this.x, this.y);
    if (region && region.traits) {
      traitsObjects.push(region);
    }
    const terrainTag = $gameMap.findCurrentTerrainTag(this.x, this.y);
    if (terrainTag && terrainTag.traits) {
      traitsObjects.push(terrainTag);
    }
    return traitsObjects;
  };

  /**
   * Game_Actor
   */
  const _Game_Actor_traitObjects = Game_Actor.prototype.traitObjects;
  Game_Actor.prototype.traitObjects = function() {
    const traitsObjects = _Game_Actor_traitObjects.apply(this, arguments);
    return $gamePlayer.appendRegionTraits(traitsObjects);
  };

  /**
   * Game_Map
   */
  Game_Map.prototype.setPassableSubject = function(character) {
    /** @type {Game_Player|Game_Event} */
    this._passableSubject = character;
  };

  const _Game_Map_isPassable = Game_Map.prototype.isPassable;
  Game_Map.prototype.isPassable = function(x, y, d) {
    const passable = _Game_Map_isPassable.apply(this, arguments);
    if (this.isCollidedByRegion(x, y, d)) {
      return false;
    } else if (this.isThroughByRegion(x, y)) {
      return true;
    } else {
      return passable;
    }
  };

  Game_Map.prototype.isCollidedByRegion = function(x, y, d) {
    const collision = this._passableSubject.findCollisionData(x, y);

    if (!collision) return false;

    if (collision && collision.length === 0) {
      return false;
    }

    return collision.includes('collision_all') ||
      (collision.includes('collision_up') && d === 8) ||
      (collision.includes('collision_right') && d === 6) ||
      (collision.includes('collision_left') && d === 4) ||
      (collision.includes('collision_down') && d === 2);
  };

  Game_Map.prototype.isThroughByRegion = function(x, y) {
    return this.findDataRegionAndTerrain(x, y, 'through');
  };

  const _Game_Map_checkLayeredTilesFlags = Game_Map.prototype.checkLayeredTilesFlags;
  Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
    const result = _Game_Map_checkLayeredTilesFlags.apply(this, arguments);
    if (result) {
      return true;
    }
    const attribute = this.findArrayDataRegionAndTerrain(x, y, 'tileAttribute');
    switch (bit) {
      case 0x20:
        return attribute.includes('ladder');
      case 0x40:
        return attribute.includes('bush');
      case 0x80:
        return attribute.includes('counter');
      case 0x100:
        return attribute.includes('damage_floor');
    }
    return false;
  };

  Game_Map.prototype.findArrayDataRegionAndTerrain = function(x, y, prop) {
    const region = this.findCurrentRegion(x, y);
    const regionValue = region ? region[prop] : [];
    const terrain = this.findCurrentTerrainTag(x, y);
    const terrainValue = terrain ? terrain[prop] : [];
    return regionValue.concat(terrainValue);
  };

  Game_Map.prototype.findDataRegionAndTerrain = function(x, y, prop) {
    const region = this.findCurrentRegion(x, y);
    if (region && region[prop]) {
      return region[prop];
    }
    const terrain = this.findCurrentTerrainTag(x, y);
    if (terrain && terrain[prop]) {
      return terrain[prop]
    }
    return null;
  };

  Game_Map.prototype.findCurrentRegion = function(x, y) {
    return $dataSystem.regions[this.regionId(x, y)];
  };

  Game_Map.prototype.findCurrentTerrainTag = function(x, y) {
    return $dataSystem.terrainTags[this.terrainTag(x, y)];
  };
})();