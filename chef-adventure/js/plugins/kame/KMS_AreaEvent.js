//=============================================================================
// KMS_AreaEvent.js
//   Last update: 2019/01/01
//=============================================================================

/*:
 * @plugindesc
 * [v0.1.0] Expand the trigger area for events on map.
 * 
 * @author Kameo (Kamesoft)
 *
 * @help
 * ## Set trigger area
 *
 *  Add <AreaEvent:WxH> to the comment command which placed top
 *  of the event page, the trigger area is expanded to WxH tiles.
 *  Example: <AreaEvent:3x2>
 *
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

