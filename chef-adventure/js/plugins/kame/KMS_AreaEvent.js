/*:
 * @target MZ
 * @plugindesc
 * [v0.1 AREA] Expand the trigger area for events on map.
 * @author Kameo (Kamesoft) Last update: 2019/01/01
 * @help
 * ============================================================================
 * This plugin enables users to set an event to trigger when entering anywhere
 * within a given rectangle designated by a comment in the event. This does
 * not affect events that are autorun/parallel-process.
 *
 * Easily the most common usage would be creating events that stretch along the
 * edge of a map that teleport the player to another map. This can effectively
 * reduce the number of events on a map potentially improving performance.
 * ============================================================================
 * TAG FORMAT
 * This is designed to be entered as a comment into the event you want to allow
 * interactivity with of a bigger rectangle shape.
 *
 * <areaEvent:WIDTHxHEIGHT>
 *  where WIDTH is a number representing the width of the rectangle.
 *  where HEIGHT is a number representing the height of the rectangle.
 * ============================================================================
 * EXAMPLE USAGES
 *
 *  <areaEvent:5x2>
 * The above tag creates a 5 tile wide and 2 tile high trigger range.
 *
 *  <areaEvent:1x9>
 * The above tag creates a 1 tile wide and 9 tile high trigger range.
 * ============================================================================
 * NOTE
 * Creating an area event that is 1x1 is basically what the default RMMZ editor
 * does when you create events.
 * ============================================================================
 */

var KMS = KMS || {};

(function() {

  'use strict';

  // 定数
  var Const =
  {
    debug:      false,          // デバッグモード
    pluginCode: 'AreaEvent'     // プラグインコード
  };

  var PluginName = 'KMS_' + Const.pluginCode;

  KMS.imported = KMS.imported || {};
  KMS.imported[Const.pluginCode] = true;

  var AreaEvent = {};

  // 正規表現
  AreaEvent.regex = {
    area: /<(?:エリアイベント|AreaEvent)\s*[:\s]\s*(\d+)\s*x\s*(\d+)>/i
  };

  // エリア定義の原点
  AreaEvent.origin =
    {
      topLeft:      7,
      topCenter:    8,
      topRight:     9,
      middleLeft:   4,
      middleCenter: 5,
      middleRight:  6,
      bottomLeft:   1,
      bottomCenter: 2,
      bottomRight:  3
    };

  // デバッグログ
  var debuglog;
  if (Const.debug)
  {
    debuglog = function() { console.log(arguments); };
  }
  else
  {
    debuglog = function() { };
  }

  // Integer の半分
  function halfInt(value)
  {
    return Math.floor(value / 2);
  }

  // 位置をエリアイベントの設定に合わせて補正
  function convertPositionForAreaEvent(x, y, area)
  {
    const width  = area.width  - 1;
    const height = area.height - 1;

    switch (area.origin)
    {
      case AreaEvent.origin.topLeft:
        return { x: x, y: y };
      case AreaEvent.origin.topCenter:
        return { x: x - halfInt(width), y: y };
      case AreaEvent.origin.topRight:
        return { x: x - width, y: y };
      case AreaEvent.origin.middleLeft:
        return { x: x, y: y - halfInt(height) };
      case AreaEvent.origin.middleCenter:
        return { x: x - halfInt(width), y: y - halfInt(height) };
      case AreaEvent.origin.middleRight:
        return { x: x - width, y: y - halfInt(height) };
      case AreaEvent.origin.bottomLeft:
        return { x: x, y: y - height };
      case AreaEvent.origin.bottomCenter:
        return { x: x - halfInt(width), y: y - height };
      case AreaEvent.origin.bottomRight:
        return { x: x - width, y: y - height };
      default:
        console.assert('Invalid area origin');
    }
  }

  //-----------------------------------------------------------------------------
  // Game_Event

  const _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function()
  {
    _Game_Event_setupPage.call(this);

    this.setupAreaEventAttribute();
  };

  /**
   * エリアイベント用属性の設定
   */
  Game_Event.prototype.setupAreaEventAttribute = function()
  {
    // 初期値はサイズ 1x1
    this._areaEventAttribute = { width: 1, height: 1, origin: AreaEvent.origin.topLeft };

    const isComment = (command) => (command && (command.code === 108 || command.code === 408));

    // 注釈以外に達するまで解析
    var page = this.page();
    if (!page) return;

    var commands = page.list;
    var index    = 0;
    var command  = commands[index++];
    while (isComment(command))
    {
      var comment = command.parameters[0];
      var match   = AreaEvent.regex.area.exec(comment);
      if (match)
      {
        this._areaEventAttribute.width  = Math.max(Number(match[1]), 1);
        this._areaEventAttribute.height = Math.max(Number(match[2]), 1);
        debuglog(this._areaEventAttribute);
        break;
      }

      command = commands[index++];
    }
  };

  /**
   * イベントのトリガー位置とサイズを取得 (他プラグイン用)
   *
   * @return {object} イベントのトリガー位置とサイズを格納したオブジェクト
   */
  Game_Event.prototype.getEventTriggerArea = function()
  {
    var area = this._areaEventAttribute;
    var pos  = convertPositionForAreaEvent(this._x, this._y, area);
    return { x: pos.x, y: pos.y, width: area.width, height: area.height, origin: area.origin };
  };

  Game_Event.prototype.pos = function(x, y)
  {
    var area = this._areaEventAttribute;
    var pos  = convertPositionForAreaEvent(x, y, area);

    return pos.x >= this._x &&
      pos.x <  this._x + area.width &&
      pos.y >= this._y &&
      pos.y <  this._y + area.height;
  };

})();

