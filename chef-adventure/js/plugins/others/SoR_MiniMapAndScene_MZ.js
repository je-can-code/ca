//=============================================================================
// SoR_MiniMapAndScene_MZ.js
// SoR License inherited from MIT License (C) 2020 蒼竜
// http://dragonflare.blue/dcave/license.php
// ----------------------------------------------------------------------------
// Latest version v1.12 (2020/11/04)
//=============================================================================
/*:ja
@plugindesc ＜ミニマップ・広域マップ＞ v1.12
@author 蒼竜
@help マップ上で画面隅に2色塗りを基本としたミニマップを表示する機能を実装します。
天井や崖上などの「エディタ設定としては通れるが、ゲームとしては通れない・立ち入れない」
場所・領域を簡単に通行不可扱いとして塗り潰す機能など、通行可能領域の視認性を
容易に確保できるオプションが利用可能です。
おまけ機能として、専用シーンによる広域マップ確認機能も利用できます。

ミニマップの基本動作は、導入するのみで行えます。
本格的なミニマップ機能のための高度な設定は、pdfドキュメントを参照してください。
デフォルトでは表示されないようになっています。
プラグインコマンドで「明示的に1度表示処理」を呼び出してください。

@target MZ
@url http://dragonflare.blue/dcave/

@param -----一般設定-----
@param Minimap_Radius
@desc ミニマップ半径 (default: 128)
@default 128
@type number
@param MiniMap_Position
@desc ミニマップ描画位置(default: 0)
@type select
@option 右上
@value 0
@option 左上
@value 1
@option 右下
@value 2
@option 左下
@value 3
@default 0

@param Minimap_PixelSize
@desc ミニマップを着色する1マス分の大きさ。 ※隣接する異なる通行設定エリアが塗り分けられなくなるので2以上推奨 (default: 8)
@default 8
@type number
@param -----リージョン関係-----
@param PaintColor_Passable
@desc 通行可能地点をマッピングする色 (default: rgba(60,60,60,1.0))
@default rgba(60,60,60,1.0)
@type string
@param PaintColor_InPassable
@desc 通行不可能地点をマッピングする色 (default: rgba(70,70,250,1.0))
@default rgba(70,70,250,1.0)
@type string
@param PaintColor_Partitions
@desc 行き来できない２つの通行可能領域を示す仕切りをマッピングする色 (default: rgba(155,155,255,1.0))
@default rgba(155,155,255,1.0)
@type string

@param RegionID_TransferPoint
@desc 場所移動地点を示すリージョンID, 0で無効 (default: 0)
@default 0
@type number
@param PaintColor_TransferPoint
@desc RegionID_TransferPointで指定した場所移動発生地点をマッピングする色 (default:rgba(255,255,55,1.0))
@default rgba(255,255,55,1.0)
@type string

@param RegionID_InpassableSearch
@desc 通行不可化する閉領域を示すリージョンID, 0で無効 (default: 0)
@default 0
@type number
@param Inpassable_IsolatedPoint
@desc 孤立してしまった通行可能地点を通行不可扱いとしてマッピング (default: false)
@default false
@type boolean

@param --------画像系--------
@param Minimap_FrontLayerImage 
@desc ミニマップUIベース画像 (default: base)
@type file
@dir img/SoRMap
@default base
@param MapIcon_Player
@desc プレイヤー現在地表示アイコン (default: player)
@type file
@dir img/SoRMap
@default player
@param MapIcon_EnemySymbol
@desc 敵シンボル現在地表示アイコン (default: enemy)
@type file
@dir img/SoRMap
@default enemy
@param MapIcon_NPCSymbol
@desc NPC現在地表示アイコン (default: npc)
@type file
@dir img/SoRMap
@default npc
@param MapIcon_TreasureSymbol
@desc 宝箱表示アイコン (default: treasure)
@type file
@dir img/SoRMap
@default treasure

@param MapIcon_BoatSymbol
@desc 小型船表示アイコン (default: none)
@type file
@dir img/SoRMap
@default 
@param MapIcon_ShipSymbol
@desc 大型船表示アイコン (default: none)
@type file
@dir img/SoRMap
@default 
@param MapIcon_AirShipSymbol
@desc 飛行船表示アイコン (default: none)
@type file
@dir img/SoRMap
@default 

@param -----特殊設定-----
@param SwitchID_NotFoundTreasuresVisible
@desc 未開封宝箱を表示するためのフラグ。指定番号スイッチがONの時のみ表示。0指定で無条件表示 (default: 0)
@default 0
@type number

@param AutoHideMap_onMessage
@desc 'true'の時、メッセージウィンドウ表示中の間はミニマップを自動的に隠す。デフォルト環境想定 (default: false)
@default false
@type boolean

@param -----広域マップ-----
@param Header_Style
@desc 広域マップ画面上部ヘッダー(シーンタイトルバー) (default: 0)
@type select
@option 標準スキンによるウィンドウ
@value 0
@option 独自画像を利用
@value 1
@default 0

@param Name_AreaMapScene
@desc 広域マップモード時にタイトルウィンドウに表示する名前。ウインドウスキン使用時のみ (default:AreaMap)
@default AreaMap
@type string

@param UseLegend_AreaMapScene
@desc 'true'の時、広域マップシーンにおいて凡例を表示 (default: true)
@default true
@type boolean
@param CallButton_ForAreaMap
@desc マップ上で、広域マップを呼び出すボタン設定、無指定でキーによる呼び出し無効 (default: none)
@default 
@type string

@param LegendPlayer_ForAreaMap
@desc 広域マップ凡例内のプレイヤー現在地アイコンを示す文字列 (default: 現在地)
@default 現在地
@type string
@param LegendEnemy_ForAreaMap
@desc 広域マップ凡例内のエネミーアイコンを示す文字列 (default: エネミー)
@default エネミー
@type string
@param LegendNPC_ForAreaMap
@desc 広域マップ凡例内のNPCアイコンを示す文字列 (default: NPC)
@default NPC
@type string
@param LegendTreasure_ForAreaMap
@desc 広域マップ凡例内の宝箱アイコンを示す文字列 (default: 宝箱)
@default 宝箱
@type string

@param LegendBoat_ForAreaMap
@desc 広域マップ凡例内の小型船アイコンを示す文字列 (default: none)
@default 
@type string
@param LegendShip_ForAreaMap
@desc 広域マップ凡例内の大型船アイコンを示す文字列 (default: none)
@default 
@type string
@param LegendAirShip_ForAreaMap
@desc 広域マップ凡例内の飛行船アイコンを示す文字列 (default: none)
@default 
@type string


@param HelpWindow_Text
@desc 操作ヘルプウィンドウ内に表示するテキスト、制御文字使用可能
@default カーソル:位置移動  Tab:凡例ON/OFF 
@type string
@param HelpWindow_Ypadd
@desc 操作ヘルプウィンドウのy座標，ヘッダーのスタイルに応じて要調整 (default: 56)
@default 56
@type number
@min -9999
@param ControlHelpText_XPadd
@desc 操作ヘルプウィンドウ内のテキストのx座標補正 (default: 36)
@default 36
@type number
@min -9999

@param --広域マップ独自画像ヘッダ--
@param Header_OriginalImage
@desc ヘッダー画像。独自画像を使用する場合のみ有効。以下同様 (default: msglog_bg)
@type file
@dir img/SoRMap
@default areamap_bg
@param UseLegend_AreaMapNameOnImgHeader
@desc 'true'の時、独自ヘッダに乗せるマップ名表示を行う (default: true)
@default true
@type boolean
@param AreaMap_MapNameX
@desc 独自画像ヘッダ使用時，現在マップ名表示x座標(default: 88)
@default 88
@type number
@param AreaMap_MapNameY
@desc 独自画像ヘッダ使用時，現在マップ名表示y座標(default: 16)
@default 16
@type number
@param AreaMap_FontSize
@desc 独自画像ヘッダ使用時，現在マップ名表示フォントサイズ(default: 24)
@default 24
@type number

@param --------その他--------
@param Padding_MinimapInnerPos
@desc ミニマップ内部位置補正。円形くりぬきサイズ調整用(default: -8)
@default -8
@type number
@min -9999
@param Padding_MinimapInnerRad
@desc ミニマップ内部半径補正。円形くりぬきサイズ調整用(default: -5)
@default -5
@min -9999
@type number

@param PosErrorTolerance_ForMapUpdate
@desc イベント・プレイヤー移動時のミニマップ反映頻度 (default: 1歩ずつ)
@type select
@option 1歩ずつ(タイルサイズに紐づけ)
@value 1.0
@option タイル1/2
@value 0.5
@option タイル1/4
@value 0.25
@option タイル1/5
@value 0.2
@option タイル1/10
@value 0.1
@option 厳密に
@value 0.0
@default 1.0
@decimal 2

@param -----独自要素追加機能-----
@param AdditionalSymbols
@desc 任意のシンボル追加。描画処理は「NPC」方式に準拠
@type struct<AddSymbols>[]
@default []
@param AdditionalRegions
@desc 任意のマッピング用リージョン追加
@type struct<AddRegions>[]
@default []

@command OpenMiniMap
@text ミニマップオープン[ミニマップ・マップシーン]
@desc ミニマップを表示します。使用開始時に1度は明示的に呼び出してください。
@command CloseMiniMap
@text ミニマップクローズ[ミニマップ・マップシーン]
@desc ミニマップを隠します。カットシーン等で明示的に呼び出して下さい。
@command ReloadSymbolTags
@text イベントシンボル情報リロード[ミニマップ・マップシーン]
@desc ミニマップに掲載するイベントのタグを再読み込みします。
@command CallAreaMap
@text 広域マップシーン呼び出し[ミニマップ・マップシーン]
@desc 広域マップを確認する専用シーンを呼び出します。
*/

/*:
@plugindesc <Minimap and Area Map> v1.12
@author Soryu
@help This plugin introduce a function to draw a minimap on the map scene
drawn with two colors. The advantage of this plugin is the equipment of
autonomous mapping for the region where the player cannot arrive but 
it is passable on the editor with fewer work, which leads to high visibility
of passable areas on the map for players. Besides, the scene of area map viewer is also available.

This plugin works just installing in your games in principle.
However, you should read the document for the usage of high functional minimap. 

From v1.01, the minimap does not appear on the screen in default.
Call a plugin command explicitly once to show the minimap. 

@target MZ
@url http://dragonflare.blue/dcave/index_e.php

@param ------General------
@param Minimap_Radius
@desc Radius of minimap window(default: 128)
@default 128
@type number
@param MiniMap_Position
@desc Position of minimap window(default: 0)
@type select
@option Upper right
@value 0
@option Upper left
@value 1
@option Lower right
@value 2
@option Lower left
@value 3
@default 0

@param Minimap_PixelSize
@desc Pixel size of each tile on the minimap (default: 8)
@default 8
@type number
@param -----Region Settings-----
@param PaintColor_Passable
@desc Color to paint passable region (default: rgba(60,60,60,1.0))
@default rgba(60,60,60,1.0)
@type string
@param PaintColor_InPassable
@desc Color to paint inpassable region (default: rgba(70,70,250,1.0))
@default rgba(70,70,250,1.0)
@type string
@param PaintColor_Partitions
@desc Color to paint partitions which clearly split the adjacent two different passable regions (default: rgba(155,155,255,1.0))
@default rgba(155,155,255,1.0)
@type string

@param RegionID_TransferPoint
@desc Region ID to indicate regions which map transfer occur, set 0 to disable (default: 0)
@default 0
@type number
@param PaintColor_TransferPoint
@desc Color to paint the region of RegionID_TransferPoint (default:rgba(255,255,55,1.0))
@default rgba(255,255,55,1.0)
@type string

@param RegionID_InpassableSearch
@desc Region ID to designate the inpassable region, set 0 to disable (default: 0)
@default 0
@type number
@param Inpassable_IsolatedPoint
@desc Flag to treat isolated point of passable as inpassable (default: false)
@default false
@type boolean


@param --------Images--------
@param Minimap_FrontLayerImage 
@desc Base image of minimap (default: base)
@type file
@dir img/SoRMap
@default base
@param MapIcon_Player
@desc Icon for current player position (default: player)
@type file
@dir img/SoRMap
@default player
@param MapIcon_EnemySymbol
@desc Icon for current enemies position (default: enemy)
@type file
@dir img/SoRMap
@default enemy
@param MapIcon_NPCSymbol
@desc Icon for current NPC position (default: npc)
@type file
@dir img/SoRMap
@default npc
@param MapIcon_TreasureSymbol
@desc Icon for treasures position (default: treasure)
@type file
@dir img/SoRMap
@default treasure


@param MapIcon_BoatSymbol
@desc Icon for the boat position (default: none)
@type file
@dir img/SoRMap
@default 
@param MapIcon_ShipSymbol
@desc Icon for the ship position (default: none)
@type file
@dir img/SoRMap
@default 
@param MapIcon_AirShipSymbol
@desc Icon for the airship position (default: none)
@type file
@dir img/SoRMap
@default 

@param -----For Area Map-----
@param Header_Style
@desc The style of header image on the area map scene (default: 0)
@type select
@option Default window style with the skin
@value 0
@option Use original image source.
@value 1
@default 0

@param Name_AreaMapScene
@desc The name of title for Area Map displayed in the Area Map scene (default:AreaMap)
@default AreaMap
@type string
@param UseLegend_AreaMapScene
@desc If 'true', legend of icons are displayed in the Area Map scene. (default: true)
@default true
@type boolean
@param CallButton_ForAreaMap
@desc Key to call the area map scene on the map, set nothing to disable. (default: none)
@default 
@type string

@param HelpWindow_Text
@desc Texts in the help window in the area map scene
@default Cursor: Move the focus  Tab: Legend ON/OFF
@type string

@param HelpWindow_Ypadd
@desc Y-coordinate of the help window (default: 56)
@default 56
@type number
@min -9999
@param ControlHelpText_XPadd
@desc Padding for the help text in the window for x-coordinate (default: 36)
@default 36
@type number
@min -9999

@param --Original header in the area map--
@param Header_OriginalImage
@desc Image source used for the header (default: msglog_bg)
@type file
@dir img/SoRMap
@default areamap_bg
@param UseLegend_AreaMapNameOnImgHeader
@desc If 'true', map name is displayed (expected on the original header image) (default: true)
@default true
@type boolean
@param AreaMap_MapNameX
@desc X-coordinate of the current map name with original header (default: 88)
@default 88
@type number
@param AreaMap_MapNameY
@desc Y-coordinate of the current map name with original header (default: 16)
@default 16
@type number
@param AreaMap_FontSize
@desc Font size of the current map name with original header (default: 24)
@default 24
@type number

@param -----Special-----
@param SwitchID_NotFoundTreasuresVisible
@desc Flag to show unopened treasures on minimap. If a gameSwitch of designated ID is ON, they are shown. Give 0 for no restrictions. (default: 0)
@default 0
@type number

@param AutoHideMap_onMessage
@desc If 'true', minimap is hidden automatically for RPGMaker default system while the message window (any events) is activated. (default: false)
@default false
@type boolean

@param ---Original Symbols and Regions---
@param AdditionalSymbols
@desc Add original symbols in the minimap. The usage follows the style of NPC icons.
@type struct<AddSymbolsE>[]
@default []
@param AdditionalRegions
@desc Add original region colors in the minimap.
@type struct<AddRegionsE>[]
@default []

@param LegendPlayer_ForAreaMap
@desc Text indicating player icon in the legend of area map (default: Player)
@default Player
@type string
@param LegendEnemy_ForAreaMap
@desc Text indicating player icon in the legend of area map (default: Enemy)
@default Enemy
@type string
@param LegendNPC_ForAreaMap
@desc Text indicating player icon in the legend of area map (default: NPC)
@default NPC
@type string
@param LegendTreasure_ForAreaMap
@desc Text indicating player icon in the legend of area map (default: Treasure)
@default Treasure
@type string

@param LegendBoat_ForAreaMap
@desc Text indicating boat icon in the legend of area map (default: none)
@default 
@type string
@param LegendShip_ForAreaMap
@desc Text indicating ship icon in the legend of area map (default: none)
@default 
@type string
@param LegendAirShip_ForAreaMap
@desc Text indicating airship icon in the legend of area map (default: none)
@default 
@type string


@param --------Others--------
@param Padding_MinimapInnerPos
@desc Position correction of inner minimap. (default: -8)
@default -8
@type number
@param Padding_MinimapInnerRad
@desc Radius correction of inner minimap. (default: -5)
@default -5
@type number

@param PosErrorTolerance_ForMapUpdate
@desc Frequency to reflect the movement of events and player on the minimap (default: step by step)
@type select
@option step by step (associated with the default tile size)
@value 1.0
@option Half of the tile
@value 0.5
@option Quarter of the tile
@value 0.25
@option One-fifth of the tile
@value 0.2
@option One-tenth of the tile
@value 0.1
@option Strictly
@value 0.0
@default 1.0
@decimal 2

@command OpenMiniMap
@text Open Minimap[Minimap&Scene]
@desc Display minimap.
@command CloseMiniMap
@text Close Minimap[Minimap&Scene]
@desc Hide minimap. Call explicitly for events as cutscenes.
@command ReloadSymbolTags
@text Reload Symbol[Minimap&Scene]
@desc Reload the symbol tags for minimap.
@command CallAreaMap
@text Call Area Map[Minimap&Scene]
@desc Call and transit to the area map scene.
*/

/*~struct~AddSymbols:
@param Icon
@desc 追加の表示アイコン (タグ: MMSymbol【このファイル名】)
@type file
@dir img/SoRMap
@default 
@param Legend_ForAreaMap
@desc 追加アイコンに対する広域マップ凡例内の文字列
@default 
@type string
*/
/*~struct~AddRegions:
@param RegionID
@desc 追加するリージョンID
@type number
@param PaintColor
@desc リージョンに対するマップ彩色カラー(RGBA形式)
@default rgba(255,255,255,1.0)
@type string
*/

/*~struct~AddSymbolsE:
@param Icon
@desc Additional icon for Symbol
@type file
@dir img/SoRMap
@default 
@param Legend_ForAreaMap
@desc The text shown in the legend of area map 
@default 
@type string
*/
/*~struct~AddRegionsE:
@param RegionID
@desc Additional region ID
@type number
@param PaintColor
@desc Color assosiated to the region (RGBA)
@default rgba(255,255,255,1.0)
@type string
*/


var Imported = Imported || {};

(function() {
	const pluginName = "SoR_MiniMapAndScene_MZ";
    const Param = PluginManager.parameters(pluginName);

    const Minimap_Radius = Number(Param['Minimap_Radius']) || 0;
    const Minimap_PixelSize = Number(Param['Minimap_PixelSize']) || 0;

    const RegionID_TransferPoint = Number(Param['RegionID_TransferPoint']) || 0;
    const RegionID_InpassableSearch = Number(Param['RegionID_InpassableSearch']) || 0;
    const Inpassable_IsolatedPoint = Boolean(Param['Inpassable_IsolatedPoint'] === 'true') || false;
    const MiniMap_Position = Number(Param['MiniMap_Position']) || 0;

    const PaintColor_Passable = String(Param['PaintColor_Passable']) || 'rgba(60,60,60,1.0)';
    const PaintColor_InPassable = String(Param['PaintColor_InPassable']) || 'rgba(70,70,250,1.0)';
    const PaintColor_Partitions = String(Param['PaintColor_Partitions']) || 'rgba(155,155,255,1.0)';
    const PaintColor_TransferPoint = String(Param['PaintColor_TransferPoint']) || 'rgba(255,255,55,1.0)';

    const Minimap_FrontLayerImage = String(Param['Minimap_FrontLayerImage']) || '';
    const MapIcon_Player = String(Param['MapIcon_Player']) || '';
    const MapIcon_EnemySymbol = String(Param['MapIcon_EnemySymbol']) || '';
    const MapIcon_NPCSymbol = String(Param['MapIcon_NPCSymbol']) || '';
    const MapIcon_TreasureSymbol = String(Param['MapIcon_TreasureSymbol']) || '';

    const Name_AreaMapScene = String(Param['Name_AreaMapScene']) || '';
    const UseLegend_AreaMapScene = Boolean(Param['UseLegend_AreaMapScene'] === 'true' || false);
    const CallButton_ForAreaMap = String(Param['CallButton_ForAreaMap']) || '';

    const Padding_MinimapInnerPos = Number(Param['Padding_MinimapInnerPos']) || 0;
    const Padding_MinimapInnerRad = Number(Param['Padding_MinimapInnerRad']) || 0;

    const LegendPlayer_ForAreaMap = String(Param['LegendPlayer_ForAreaMap']) || '';
    const LegendEnemy_ForAreaMap = String(Param['LegendEnemy_ForAreaMap']) || '';
    const LegendNPC_ForAreaMap = String(Param['LegendNPC_ForAreaMap']) || '';
    const LegendTreasure_ForAreaMap = String(Param['LegendTreasure_ForAreaMap']) || '';
 
    const PosErrorTolerance_ForMapUpdate = Number(Param['PosErrorTolerance_ForMapUpdate']) || 0;
    const AdditionalSymbols = convertJsonParam(Param['AdditionalSymbols']) || '';
    const AdditionalRegions = convertJsonParam(Param['AdditionalRegions']) || '';

//1.06
    const Header_Style = Number(Param['Header_Style']) || 0;
    const Header_OriginalImage = String(Param['Header_OriginalImage']) || '';
    const UseLegend_AreaMapNameOnImgHeader = Boolean(Param['UseLegend_AreaMapNameOnImgHeader'] === 'true' || false);
    const AreaMap_MapNameX = String(Param['AreaMap_MapNameX']) || '';
    const AreaMap_MapNameY = String(Param['AreaMap_MapNameY']) || '';
    const AreaMap_FontSize = String(Param['AreaMap_FontSize']) || '';
 
    const HelpWindow_Text = String(Param['HelpWindow_Text']) || ''; 
    const HelpWindow_Ypadd = Number(Param['HelpWindow_Ypadd']) || 0;
    const ControlHelpText_XPadd = Number(Param['ControlHelpText_XPadd']) || 0;

//1.07
    const SwitchID_NotFoundTreasuresVisible = Number(Param['SwitchID_NotFoundTreasuresVisible']) || 0;
    const MapIcon_BoatSymbol = String(Param['MapIcon_BoatSymbol']) || '';
    const MapIcon_ShipSymbol = String(Param['MapIcon_ShipSymbol']) || '';
    const MapIcon_AirShipSymbol = String(Param['MapIcon_AirShipSymbol']) || '';
    const LegendBoat_ForAreaMap = String(Param['LegendBoat_ForAreaMap']) || '';
    const LegendShip_ForAreaMap = String(Param['LegendShip_ForAreaMap']) || '';
    const LegendAirShip_ForAreaMap = String(Param['LegendAirShip_ForAreaMap']) || '';

//1.12
    const AutoHideMap_onMessage = Boolean(Param['AutoHideMap_onMessage'] === 'true' || false);

    let autohideMM = false;



    let SoR_MM_Isopen = true; 

    function convertJsonParam(param) {
        if (param == undefined) return [];
        let arr = [];
            JSON.parse(param).map(function(param) {
                const obj = JSON.parse(param);
                arr.push(obj);
            });
        return arr; 
    };


ImageManager.loadMMSprite = function(filename) {
    return this.loadBitmap('img/SoRMap/', filename, 0, true);
}


const SoR_MMS_ST_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    SoR_MM_Isopen = false;
    SoR_MMS_ST_commandNewGame.call(this);
}


const SoR_MMS_SM_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    this.createMiniMapWindow();
    SoR_MMS_SM_createAllWindows.call(this);
    
}

Scene_Map.prototype.createMiniMapWindow = function() {
    const rect = this.SoR_MiniMapWindowRect();
    this.MiniMapObj = new SoR_MiniMap(rect);
    this.addWindow(this.MiniMapObj);

    this.MiniMapObj.traverseMap();
    this.MiniMapObj.paintMiniMap();
    this.MiniMapObj.DrawMinimapBase();
}

const SoR_MMS_SM_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    SoR_MMS_SM_start.call(this);

    this.MiniMapObj.SearchEventSymbols();
    this.MiniMapObj.DrawMMComponents();
    ///this.MiniMapObj.updateMinimap();// initialization for drawing 
}


Scene_Map.prototype.SoR_MiniMapWindowRect = function() {
    const ww = Graphics.width;
    const wh = Graphics.height;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};


const SoR_MMS_SM_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    SoR_MMS_SM_update.call(this);

    this.checkHitKeyForAreaMapCall();
    if(AutoHideMap_onMessage) this.checkAutoHideMM();
}

Scene_Map.prototype.checkHitKeyForAreaMapCall = function() {
    if(this.isBusy() || $gameMap.isEventRunning() || $gameMessage.isBusy()) return;
    if(CallButton_ForAreaMap!="" && Input.isTriggered(CallButton_ForAreaMap)){
        SceneManager.push(Scene_SoREntireMap);
    }
}

Scene_Map.prototype.checkAutoHideMM = function() {
    if($gameMap.isEventRunning() || $gameMessage.isBusy() || this.isBusy()){
        if(SoR_MM_Isopen==true && autohideMM == false){
             SceneManager._scene.MiniMapObj.close();
             autohideMM = true;
        }
    }
    else{
        if(SoR_MM_Isopen==false && autohideMM){
         SceneManager._scene.MiniMapObj.open();
         autohideMM = false;
        }
    }
}
 


//////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
function SoR_MiniMap() {
    this.initialize(...arguments);
}
SoR_MiniMap.prototype = Object.create(Window_Base.prototype);
SoR_MiniMap.prototype.constructor = SoR_MiniMap;
Object.defineProperty(SoR_MiniMap.prototype, "innerWidth", {
    get: function() { return this._width; },
    set: function(value) { this.height = value; },
    configurable: true
});
Object.defineProperty(SoR_MiniMap.prototype, "innerHeight", {
    get: function() { return this._height; },
    set: function(value) { this.height = value; },
    configurable: true
});


SoR_MiniMap.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.openness = SoR_MM_Isopen ? 255:0;
    this.visible = true;
    this.opacity = 0;

    this.mapdata = [];
    this.mapimg = null;     //minimap sprite
    this.map_sx = 0;        //sizeofmap
    this.map_sy = 0;
    this.centerx = -1;
    this.centery = -1;
    this.cursor_dir = -1;
    this.pixelsize = Minimap_PixelSize;     //pixel size on minimap
    this.minimap_rad = Minimap_Radius; //radius
    this.map_padd = 0; //boundary cells on minimap

    this.inpassable_ck = [];
    this.inpass_ck_visited = [];

    this.EVsymbols = [];
    this.AdditionalSymbols = [];
    this.MinimapLocate(MiniMap_Position);
    this.InitImages();
}

SoR_MiniMap.prototype.open = function() {
    Window_Base.prototype.open.call(this);
    SoR_MM_Isopen = true;
}
SoR_MiniMap.prototype.close = function() {
    Window_Base.prototype.close.call(this);
    SoR_MM_Isopen = false;
}


SoR_MiniMap.prototype.MinimapLocate = function(p){
    let px = 0, py =0;
    const padd = this.minimap_rad*2;

    switch(p){
        case 0:
            px = Graphics.width-padd;
            py = 0;
        break;
        case 1:
            px = 4;
            py = 0;
        break;
        case 2:
            px = Graphics.width-padd;
            py = Graphics.height-padd;
        break;
        case 3:
            px = 4;
            py = Graphics.height-padd;
        break;
    }
    this.move(px,py,(this.minimap_rad+2)*2,(this.minimap_rad+2)*2);    
}


SoR_MiniMap.prototype.InitImages = function() {
    this.mapspr = new Sprite();

    if(Minimap_FrontLayerImage!=="") this.basespr = new Sprite(ImageManager.loadMMSprite(Minimap_FrontLayerImage));
    else this.basespr = new Sprite(new Bitmap(1,1));

    if(MapIcon_Player!=="") this.p_cursor = new Sprite(ImageManager.loadMMSprite(MapIcon_Player));
    else this.p_cursor = new Sprite(new Bitmap(4,1));

    ImageManager.loadMMSprite(MapIcon_EnemySymbol);
    ImageManager.loadMMSprite(MapIcon_NPCSymbol);
    ImageManager.loadMMSprite(MapIcon_TreasureSymbol);
    ImageManager.loadMMSprite(MapIcon_BoatSymbol);
    ImageManager.loadMMSprite(MapIcon_ShipSymbol);
    ImageManager.loadMMSprite(MapIcon_AirShipSymbol);
    const add_n = AdditionalSymbols.length;
    for(let i=0; i<add_n; i++){
        ImageManager.loadMMSprite(AdditionalSymbols[i].Icon);
    }
  
    this.addChild(this.mapspr);
}

SoR_MiniMap.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.updateMinimap();
}

SoR_MiniMap.prototype.DrawMMComponents = function(){
    this.DrawMinimapBase();
    
    this.DrawSymbolCursor();
    this.DrawPlayerCursor($gamePlayer._direction);
    this.DrawMinimapEdgeSpr();
    this.DrawMinimapMask();
}

SoR_MiniMap.prototype.isUpdateRequired = function(testx,testy,d) {
    let ev_flag = false;
    //player
    if(EvalRealPlayerPos_withEps(this.centerx, testx, this.pixelsize) && EvalRealPlayerPos_withEps(this.centery, testy, this.pixelsize) && this.cursor_dir == d){
        this.player_needupdate = false;
    }
    else{
         ev_flag = true;
         this.player_needupdate = true;
    } 

    const evlen = this.EVsymbols.length;
    for(let i=0; i<evlen;i++){
        const ev = this.EVsymbols[i];

        const p_ev = FindSymbolFromEvID(ev);
        if(p_ev === undefined) continue;
  
        const x = p_ev._realX;
        const y = p_ev._realY;
        const page = p_ev.findProperPageIndex()+1;//0 origin to 1 origin in the game
        const dir = p_ev._direction;
        
        if(p_ev._erased == false && this.EVsymbols[i].cursor.visible == true){
            this.EVsymbols[i].needUpdate = true;
            ev_flag = true;
        }
        else{
         if( EvalRealPos_withEps(this.EVsymbols[i]._realX,x) && EvalRealPos_withEps(this.EVsymbols[i]._realY,y)  && this.EVsymbols[i]._page == page) this.EVsymbols[i].needUpdate = false;
         else{
            this.EVsymbols[i].needUpdate = true;
            ev_flag = true;
            // && this.EVsymbols[i]._d == dir
         }
        }


    }
 
    return ev_flag;
}


function EvalRealPlayerPos_withEps(tar, base, ps) {
    if(!tar) return true; 
    const eps = ps*PosErrorTolerance_ForMapUpdate;
    const bp = base+eps;
    const bm = base-eps;
    if(tar > bm && tar < bp) return true;
    else return false;
}
function EvalRealPos_withEps(tar, base) {
    if(!tar) return true;
    const eps = PosErrorTolerance_ForMapUpdate;
    const bp = base+eps;
    const bm = base-eps;
    if(tar > bm && tar < bp) return true; 
    else return false;
}



SoR_MiniMap.prototype.updateMinimap = function() {
    const pd = this.map_padd;
    const px = $gamePlayer._realX;
    const py = $gamePlayer._realY;
    const d = $gamePlayer._direction; 
 
    let testx = Math.round((px+pd)*this.pixelsize) - this.minimap_rad;
    let testy = Math.round((py+pd)*this.pixelsize) - this.minimap_rad;
    
    if(!this.isUpdateRequired(testx,testy,d)) return;

        if(this.player_needupdate){
            this.centerx = testx;
            this.centery = testy;
        }
        
        this.UpdateMinimapBase();
        this.UpdateSymbolCursor();
        this.UpdatePlayerCursor(d);
        
}

SoR_MiniMap.prototype.DrawPlayerCursor = function(d) {
    this.cursor_dir = d;
    const wd = Math.floor(this.p_cursor.bitmap.width/4);
    const ht = this.p_cursor.bitmap.height;
    const pixs = Math.floor(this.pixelsize/2);

    this.p_cursor.setFrame((d/2-1)*wd, 0, wd, ht);
    this.p_cursor.x = this.minimap_rad-ht+pixs;
    this.p_cursor.y = this.minimap_rad-ht+pixs;
    this.addChild(this.p_cursor);
}


SoR_MiniMap.prototype.DrawSymbolCursor = function() {
    const pd = this.map_padd;
    for(let i=0; i<this.EVsymbols.length;i++){
    const ev = this.EVsymbols[i];
    let x, y, flags, page, dir, treasure_flag, p_ev;

    if(ev.type>=3 && ev.type<= 5){ //boat, ship, airship 
        if(ev.type==3) p_ev = $gameMap.boat();
        else if(ev.type==4) p_ev = $gameMap.ship();
        else if(ev.type==5) p_ev = $gameMap.airship(); 
        x = p_ev._realX;
        y = p_ev._realY;
    }
    else{// regular events
        p_ev = FindSymbolFromEvID(ev);
        if(p_ev === undefined) continue;

        flags = ev.flags;
        page = p_ev.findProperPageIndex()+1;//0 origin to 1 origin in the game
        if(page<=0) continue;

        dir = p_ev._direction;
        treasure_flag = 0;

        //if(this.EVsymbols[i].needUpdate){
            this.EVsymbols[i]._realX = p_ev._realX;
            this.EVsymbols[i]._realY = p_ev._realY;
        //}
        x = this.EVsymbols[i]._realX;
        y = this.EVsymbols[i]._realY;
        
        this.EVsymbols[i]._d = dir;
        this.EVsymbols[i]._page = page;
    }




    if(ev.type==2){//treasure
        if(flags.indexOf(page)!=-1) treasure_flag=1;
    }
    else{//enemy, npc
        if(ev.type==0){
            if(p_ev._erased) continue;
        }
        if(ev.flags.length!=0){
            //Isenable visible symbols
            if(flags.indexOf(page)==-1) continue;
        }
    }

    let posx = Math.round(($gamePlayer._realX-x)*this.pixelsize);
    let posy = Math.round(($gamePlayer._realY-y)*this.pixelsize);

    let wd = 0;
    let ht = 0;
    const pixs = Math.floor(this.pixelsize/2);

    if(ev.type==0){//enemy
        wd = ev.cursor.bitmap.width/4;
        ht = ev.cursor.bitmap.height;  
        ev.cursor.setFrame((dir/2-1)*wd, 0, wd, ht);
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;

        this.addChild(ev.cursor);
        ev.cursor.visible = false;
        //console.log(ev.e_cursor.x + " " + this.e_cursor.y)
    }
    else if(ev.type==1){//npc
        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
        ev.cursor.setFrame( 0, 0, wd, ht);
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
        this.addChild(ev.cursor);
    }
    else if(ev.type==2){//tre
        if(IsVisible_NotFoundTreasures(treasure_flag)){
            wd = ev.cursor.bitmap.width/2;
            ht = ev.cursor.bitmap.height;
            ev.cursor.setFrame( treasure_flag*wd, 0, wd, ht);
            ev.cursor.x = this.minimap_rad-posx-ht+pixs;
            ev.cursor.y = this.minimap_rad-posy-ht+pixs;
            this.addChild(ev.cursor);
        }
    }
    else if(ev.type==3){//BOAT
        wd = this.cursor.bitmap.width;
        ht = this.cursor.bitmap.height;
        this.cursor.x = this.minimap_rad-posx-ht+pixs;
        this.cursor.y = this.minimap_rad-posy-ht+pixs;
        this.addChild(ev.cursor);

       // this.boat_cursor.addLoadListener(function() {
       // this.contents.blt(this.boat_cursor, 0, 0, wd, ht, this.minimap_rad-posx-ht+pixs, this.minimap_rad-posy-ht+pixs);
       // }.bind(this));
    }
    else if(ev.type==4){//SHIP
        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
        this.addChild(ev.cursor);
    }
    else if(ev.type==5){//AIRSHIP
        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
        this.addChild(ev.cursor);
    }
    else{//additional symbols
        const id = ev.type-11; 
        wd = ev.cursor.width;
        ht = ev.cursor.height;
  
        ev.cursor.setFrame( 0, 0, wd, ht);
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
        this.addChild(ev.cursor);
    }

    }
}



SoR_MiniMap.prototype.UpdatePlayerCursor = function(d) {
    this.cursor_dir = d;
    const wd = Math.floor(this.p_cursor.bitmap.width/4);
    const ht = this.p_cursor.bitmap.height;
    const pixs = Math.floor(this.pixelsize/2);

    this.p_cursor.setFrame((d/2-1)*wd, 0, wd, ht);
    this.p_cursor.x = this.minimap_rad-ht+pixs;
    this.p_cursor.y = this.minimap_rad-ht+pixs;
}


SoR_MiniMap.prototype.UpdateSymbolCursor = function() {
    const pd = this.map_padd;
    for(let i=0; i<this.EVsymbols.length;i++){
    const ev = this.EVsymbols[i];
    let x, y, flags, page, dir, treasure_flag, p_ev;

    if(ev.type>=3 && ev.type<= 5){ //boat, ship, airship 
        if(ev.type==3) p_ev = $gameMap.boat();
        else if(ev.type==4) p_ev = $gameMap.ship();
        else if(ev.type==5) p_ev = $gameMap.airship(); 
        x = p_ev._realX;
        y = p_ev._realY;
    }
    else{// regular events
        p_ev = FindSymbolFromEvID(ev);
        if(p_ev === undefined) { ev.cursor.visible = false; continue;}

        flags = ev.flags;
        page = p_ev.findProperPageIndex()+1;//0 origin to 1 origin in the game
        if(page<=0) { ev.cursor.visible = false; continue;}

        dir = p_ev._direction;
        treasure_flag = 0;

        if(this.EVsymbols[i].needUpdate){
            this.EVsymbols[i]._realX = p_ev._realX;
            this.EVsymbols[i]._realY = p_ev._realY;
        }
        x = this.EVsymbols[i]._realX;
        y = this.EVsymbols[i]._realY;
        
        this.EVsymbols[i]._d = dir;
        this.EVsymbols[i]._page = page;

    }


    if(ev.type==2){//treasure
        if(flags.indexOf(page)!=-1) treasure_flag=1;
    }
/*
    else{//enemy, npc
        if(ev.type==0){
            if(p_ev._erased) continue;
        }
        if(ev.flags.length!=0){
            //Isenable visible symbols
            if(flags.indexOf(page)==-1) continue;
        }
    }
*/
    let posx = Math.round(($gamePlayer._realX-x)*this.pixelsize);
    let posy = Math.round(($gamePlayer._realY-y)*this.pixelsize);

    let wd = 0;
    let ht = 0;
    const pixs = Math.floor(this.pixelsize/2);

    if(ev.type==0){//e_cursor
        if( (ev.flags.length!=0 && flags.indexOf(page)==-1) || p_ev._erased){ ev.cursor.visible = false; continue;}

        wd = ev.cursor.bitmap.width/4;
        ht = ev.cursor.bitmap.height;
  
        ev.cursor.setFrame((dir/2-1)*wd, 0, wd, ht);
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
        ev.cursor.visible = true;
    }
    else if(ev.type==1){//npc_cursor
        if((ev.flags.length!=0 && flags.indexOf(page)==-1) || p_ev._erased){ ev.cursor.visible = false; continue;}

        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
        ev.cursor.setFrame( 0, 0, wd, ht);
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
    }
    else if(ev.type==2){//tre_cursor
        if(p_ev._erased){ ev.cursor.visible = false; continue;}
        if(IsVisible_NotFoundTreasures(treasure_flag)){
            wd = ev.cursor.bitmap.width/2;
            ht = ev.cursor.bitmap.height;
            ev.cursor.setFrame( treasure_flag*wd, 0, wd, ht);
            ev.cursor.x = this.minimap_rad-posx-ht+pixs;
            ev.cursor.y = this.minimap_rad-posy-ht+pixs;
        }
    }
    else if(ev.type==3){//BOAT
        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
    }
    else if(ev.type==4){//SHIP
        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
    }
    else if(ev.type==5){//AIRSHIP
        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
    }
    else{//additional symbols
        if((ev.flags.length!=0 && flags.indexOf(page)==-1) || p_ev._erased){ ev.cursor.visible = false; continue;}
        const id = ev.type-11; 
        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
  
        ev.cursor.setFrame( 0, 0, wd, ht);
        ev.cursor.x = this.minimap_rad-posx-ht+pixs;
        ev.cursor.y = this.minimap_rad-posy-ht+pixs;
    }

    }
}


SoR_MiniMap.prototype.SearchEventSymbols = function() {
   const evs = $gameMap.events();
   const orig_symbol = AdditionalSymbols.length; //for displaying additional symbols
   const evlen = evs.length;

   //searchevent symbols
   for(let i=0; i<evlen;i++){
    const ev = evs[i];
    const mt = ev.event().meta;
        if(Imported.SoR_EnemySymbolEncounter_MZ && mt.EnemySymbol){
            let spr;
            if(MapIcon_EnemySymbol!=="") spr = new Sprite(ImageManager.loadMMSprite(MapIcon_EnemySymbol));
            else spr = new Sprite(new Bitmap(4,1));
            if(this.EVsymbols.find(elem => elem.eid == ev._eventId) === undefined){
                 this.EVsymbols.push({type:0,eid:ev._eventId, flags:[], needUpdate: true , cursor: spr});

            }
        }
        else if(mt.MMSymbolNPC){
            let tagcode = [];
            if(this.EVsymbols.find(elem => elem.eid == ev._eventId) === undefined){
         
               let spr;
               if(MapIcon_NPCSymbol!=="") spr = new Sprite(ImageManager.loadMMSprite(MapIcon_NPCSymbol));
               else spr = new Sprite(new Bitmap(1,1));   

               if(mt.MMSymbolNPC!==true)  tagcode = AnalyzeMMSymbolTag(mt.MMSymbolNPC); //read additional meta
               this.EVsymbols.push({type:1,eid:ev._eventId, flags:tagcode, needUpdate: true , cursor: spr});
            }
        }
        else if(mt.MMSymbolTreasure){
            if(this.EVsymbols.find(elem => elem.eid == ev._eventId) === undefined){

                if(mt.MMSymbolTreasure!==true){
                    let spr;
                    if(MapIcon_TreasureSymbol!=="") spr = new Sprite(ImageManager.loadMMSprite(MapIcon_TreasureSymbol));
                    else spr = new Sprite(new Bitmap(2,1));

                    let tgcode = AnalyzeMMSymbolTag(mt.MMSymbolTreasure); //read additional meta
                    this.EVsymbols.push({type:2,eid:ev._eventId, flags:tgcode, needUpdate: true, cursor: spr});
                }

            }
        }

        if(orig_symbol != 0){//original symbols if needed

            for(let j=0; j<orig_symbol;j++){ 
                const sname = "MMSymbol" + AdditionalSymbols[j].Icon;

                for (let value of Object.keys(mt)) { //arbitrary meta
                    if(value == sname){
                        if(this.EVsymbols.find(elem => elem.eid == ev._eventId) === undefined){
                            const arg = Object.values(mt);
                            let spr = new Sprite(ImageManager.loadMMSprite(AdditionalSymbols[j].Icon));

                            if(arg[0] != true){
                                tagcode = AnalyzeMMSymbolTag(arg[0]); //read additional meta
                                this.EVsymbols.push({type:11+j,eid:ev._eventId, flags:tagcode, needUpdate: true, cursor: spr});
                            }
                            else this.EVsymbols.push({type:11+j,eid:ev._eventId, flags:[], needUpdate: true, cursor: spr});
                        }
                        
                        break;
                    }
                }

            }//for all symbols

        }//
        
   }


 
   //search default ships
   if(MapIcon_BoatSymbol !==""){
       if($gameMap.boat()._mapId === $gameMap.mapId()){
        let spr;
        if(MapIcon_BoatSymbol !=="") spr = new Sprite(ImageManager.loadMMSprite(MapIcon_BoatSymbol));
        else spr = new Sprite(new Bitmap(1,1));

        this.EVsymbols.push({type:3,eid: null, flags:[], needUpdate: true, cursor:spr});
       }
    }
    if(MapIcon_ShipSymbol !==""){
        if($gameMap.ship()._mapId === $gameMap.mapId()){
        let spr;
        if(MapIcon_ShipSymbol!=="") spr = new Sprite(ImageManager.loadMMSprite(MapIcon_ShipSymbol));
        else spr = new Sprite(new Bitmap(1,1));   

        this.EVsymbols.push({type:4,eid: null, flags:[], needUpdate: true, cursor:spr});
        }
    }
    if(MapIcon_AirShipSymbol !==""){
        if($gameMap.airship()._mapId === $gameMap.mapId()){

        let spr;
        if(MapIcon_AirShipSymbol!=="") spr = new Sprite(ImageManager.loadMMSprite(MapIcon_AirShipSymbol));
        else spr = new Sprite(new Bitmap(1,1));   
         
        this.EVsymbols.push({type:5,eid: null, flags:[], needUpdate: true, cursor: spr});
        }
    }


}


function AnalyzeMMSymbolTag(str){
    let tag = [];

    const spl_str = str.split(',');
    const regex = /(\d+)\s*-\s*(\d+)/;
    const splstrlen = spl_str.length;
    for (let i = 0; i < splstrlen; i++){
       if (regex.test(spl_str[i]) == true){
         const begin = Number(RegExp.$1);
         const end = Number(RegExp.$2);
         for (let j = begin; j <= end; j++) tag.push(j); //ranged ID
       }
       else tag.push(Number(spl_str[i])); //one ID
    }
    
  return tag;
}



SoR_MiniMap.prototype.DrawMinimapBase = function() {
    const padx = -8;
    const pady = -8;
    const posx = padx+this.centerx;
    const posy = pady+this.centery;
    
    
    this.mapspr = new Sprite(this.mapimg);
    this.mapspr.setFrame( posx, posy, this.minimap_rad*2, this.minimap_rad*2);
    this.mapspr.x = -16;//this.minimap_rad-posx-ht+pixs;
    this.mapspr.y = -16;//this.minimap_rad-posy-ht+pixs;

    
    //this.mapspr = new Sprite();
    this.addChild(this.mapspr);

    //this.mapimg.addLoadListener(function() {
    //this.contents.mapblt(this.mapimg, posx, posy, this.minimap_rad*2, this.minimap_rad*2, -16, -16);
    //}.bind(this));
}
SoR_MiniMap.prototype.UpdateMinimapBase = function() {
    const padx = -8;
    const pady = -8;
    const posx = padx+this.centerx;
    const posy = pady+this.centery;
    
    
    //this.mapspr = new Sprite(this.mapimg);
    this.mapspr.setFrame( posx, posy, this.minimap_rad*2, this.minimap_rad*2);
    //this.mapspr.x = -16;//this.minimap_rad-posx-ht+pixs;
    //this.mapspr.y = -16;//this.minimap_rad-posy-ht+pixs;

    //this.mapimg.addLoadListener(function() {
    //this.contents.mapblt(this.mapimg, posx, posy, this.minimap_rad*2, this.minimap_rad*2, -16, -16);
    //}.bind(this));
}

SoR_MiniMap.prototype.DrawMinimapEdgeSpr = function() {
    const padx = -8;
    const pady = -8;
    const posx = padx+this.centerx;
    const posy = pady+this.centery;
    
    this.basespr.setFrame( 0, 0, this.minimap_rad*4, this.minimap_rad*4);
    this.basespr.x = padx;//-16;//this.minimap_rad-posx-ht+pixs;
    this.basespr.y = pady;//-16;//this.minimap_rad-posy-ht+pixs;
    this.basespr.scale.x = 0.5;
    this.basespr.scale.y = 0.5;

    
    this.addChild(this.basespr);
    //this.basespr.addLoadListener(function() {
    //    this.contents.blt(this.basespr, 0, 0, this.minimap_rad*4, this.minimap_rad*4, padx, pady, this.minimap_rad*2,this.minimap_rad*2);
    //}.bind(this));
}

SoR_MiniMap.prototype.DrawMinimapMask = function() {
    const padx = Padding_MinimapInnerPos;
    const pady = Padding_MinimapInnerPos;
    const posx = padx+this.centerx;
    const posy = pady+this.centery;
    
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFFFFF);
    graphics.drawCircle(padx+this.minimap_rad, pady+this.minimap_rad, this.minimap_rad+Padding_MinimapInnerRad);
    graphics.endFill();
    this.addChild(graphics)
    this.mask = graphics;
}





SoR_MiniMap.prototype.traverseMap = function() {
    this.map_sx = $gameMap.width();
    this.map_sy = $gameMap.height();
    this.map_padd = Math.floor(this.minimap_rad/this.pixelsize);
    const pd = this.map_padd;

    for(let j=0; j<this.map_sy+pd*2; j++){
        for(let i=0; i<this.map_sx+pd*2; i++){
            let flag = false;
            let ndir = [0,0,0,0];

            if(j<pd || j>=this.map_sy+pd || i<pd || i>=this.map_sx+pd);//boundary cells
            else{
                //regular check
                for(let d=2; d<=8; d+=2){
                    const subflag = $gamePlayer.isMapPassable(i-pd,j-pd,d); //$gameMap.isValid(x+1-pd,y-pd)
                    flag = flag || subflag;
                    if(!subflag){//partially passable?
                        ndir[d/2-1] = -1;
                    }
                }
                
                if(flag && Inpassable_IsolatedPoint){//Eliminate Isolated point
                    if(!$gamePlayer.isMapPassable(i-pd,j-pd,6) && !$gamePlayer.isMapPassable(i-pd,j-pd,4) && !$gamePlayer.isMapPassable(i-pd,j-pd,8) && !$gamePlayer.isMapPassable(i-pd,j-pd,2)){
                        flag = false;
                    }
                }

            }
            let tile = flag==true? 1:0;

            if(RegionID_TransferPoint>0 && RegionID_TransferPoint == $gameMap.regionId(i-pd,j-pd)) tile = 2;
            if(RegionID_InpassableSearch > 0 && RegionID_InpassableSearch == $gameMap.regionId(i-pd,j-pd)) this.inpassable_ck.push({x:i,y:j});
            const AddRlen = AdditionalRegions.length;
            for(let k=0; k < AddRlen; k++){ //additional regions
                if(AdditionalRegions[k].RegionID == $gameMap.regionId(i-pd,j-pd)){ 
                    tile = 11+k;
                    break;
                }
            }

            this.mapdata.push({tile: tile, ndir: ndir});
        }
    }
}



SoR_MiniMap.prototype.paintMiniMap = function() {
    const pd = this.map_padd;
    this.mapimg = new Bitmap((this.map_sx+pd*2) * this.pixelsize, (this.map_sy+pd*2) * this.pixelsize);

    if(this.inpassable_ck.length!=0) this.ProcessInppassableRegion();

    for(let j=0; j<this.map_sy+pd*2; j++){
        for(let i=0; i<this.map_sx+pd*2; i++){
            const ind = j*(this.map_sx+pd*2)+i;
            const data = this.mapdata[ind];
            const cond = data.tile;
            const subpass = data.ndir;

            let cl;
            if(cond==2) cl = PaintColor_TransferPoint; //transfer
            else if(cond==1) cl = PaintColor_Passable; //nomal passable
            else if (cond >=11) cl = AdditionalRegions[cond-11].PaintColor; // additional color
            else cl = PaintColor_InPassable; //not passable
 

            this.mapimg.fillRect(i * this.pixelsize, j * this.pixelsize, this.pixelsize, this.pixelsize, cl);

            //partially inpassable
            if(cond!=0){
                cl = PaintColor_Partitions;
                for(let d=0;d<4;d++){
                    if(subpass[d]==-1){
                        switch(d){
                            case 0:
                            this.mapimg.fillRect(i * this.pixelsize, (j+1) * this.pixelsize-1, this.pixelsize, 1, cl);
                            break;
                            case 1:
                            this.mapimg.fillRect(i * this.pixelsize, j * this.pixelsize, 1, this.pixelsize, cl);
                            break;
                            case 2:
                            this.mapimg.fillRect((i+1)*this.pixelsize-1, j * this.pixelsize, 1, this.pixelsize, cl);
                            break;
                            case 3:
                            this.mapimg.fillRect(i * this.pixelsize, j * this.pixelsize, this.pixelsize, 1, cl);
                            break;
                        }
                    }
                }
            }


        }
    }

    
}


SoR_MiniMap.prototype.ProcessInppassableRegion = function() {// forced inpassable regions
    const pd = this.map_padd;
    this.inpass_ck_visited = Array((this.map_sx+pd*2)*(this.map_sy+pd*2));
    const inpasslen = this.inpassable_ck.length;
    for(let i=0;i<inpasslen;i++){
        this.inpass_ck_visited.fill(false);
        const x = this.inpassable_ck[i].x;   
        const y = this.inpassable_ck[i].y;

        this.DrawInpassable(x,y);
    }
    this.inpass_ck_visited = [];
}

SoR_MiniMap.prototype.DrawInpassable = function(x,y) {//non-recursive DFS for forced inpassable regions
    const pd = this.map_padd;
    let node_stack = [];
    node_stack.push({x:x,y:y});

    while(node_stack.length>0){
        const st = node_stack[node_stack.length-1];
        const ind = st.y*(this.map_sx+pd*2)+st.x;
        const x = st.x;
        const y = st.y;

        this.inpass_ck_visited[ind] = true;
        this.mapdata[ind] = {tile: 0, ndir:[0,0,0,0]};

        if($gameMap.isValid(x+1-pd,y-pd) && !this.inpass_ck_visited[y*(this.map_sx+pd*2)+x+1] && $gamePlayer.isMapPassable(x-pd,y-pd,6)){
            node_stack.push({x:x+1,y:y});
        }
        else if($gameMap.isValid(x-1-pd,y-pd) && !this.inpass_ck_visited[y*(this.map_sx+pd*2)+x-1] && $gamePlayer.isMapPassable(x-pd,y-pd,4)){
            node_stack.push({x:x-1,y:y});
        }
        else if($gameMap.isValid(x-pd,y+1-pd) && !this.inpass_ck_visited[(y+1)*(this.map_sx+pd*2)+x] && $gamePlayer.isMapPassable(x-pd,y-pd,2)){
            node_stack.push({x:x,y:y+1});
        }
        else if($gameMap.isValid(x-pd,y-1-pd) && !this.inpass_ck_visited[(y-1)*(this.map_sx+pd*2)+x] && $gamePlayer.isMapPassable(x-pd,y-pd,8)){
            node_stack.push({x:x,y:y-1});
        }
        else node_stack.pop();
    }

}





function FindSymbolFromEvID(ev){
    return $gameMap.events().find(elem => elem._eventId == ev.eid);
}










///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function Scene_SoREntireMap() {
    this.initialize(...arguments);
}

Scene_SoREntireMap.prototype = Object.create(Scene_Base.prototype);
Scene_SoREntireMap.prototype.constructor = Scene_SoREntireMap;

Scene_SoREntireMap.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_SoREntireMap.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createHelpWindow();
    this.createAreaMapWindows();
}

Scene_SoREntireMap.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    
    this.AreaMapObj.DrawMMComponents();

    if(this._Legendwindow){ 
        this.addChild(this._Legendwindow);
        this._Legendwindow.open();
    }

    //this.AreaMapObj.updateMinimap();// initialization for drawing 
    this.AreaMapObj.initializeWindowPosition();
    SoundManager.playOk();
}

Scene_SoREntireMap.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    this.CheckHitKeys();
}

//background as Scene_Menu
Scene_SoREntireMap.prototype.createBackground = function() {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    this._backgroundSprite.opacity = 192;
};


// main window
Scene_SoREntireMap.prototype.createAreaMapWindows = function(){
      this.createMiniMapWindow();
      if(Header_Style==0) this.createSceneNameWindow();
      else this.createHeaderSprites();

      if(UseLegend_AreaMapScene) this._Legendwindow = new Window_AreaMapLegend();
}


///////////////
Scene_SoREntireMap.prototype.createHeaderSprites = function() { 
	const img = ImageManager.loadMMSprite(Header_OriginalImage);
	this._bgpicture = new Sprite(img);
    this.addChild(this._bgpicture);

    if(UseLegend_AreaMapNameOnImgHeader){
        const mapname = $gameMap.displayName();
        this._MapNameWindow = new Window_Base(new Rectangle(AreaMap_MapNameX,AreaMap_MapNameY,Graphics.width,56));
        this._MapNameWindow.contents.fontSize = AreaMap_FontSize;
        this._MapNameWindow.setBackgroundType(2);
        this.addChild(this._MapNameWindow);
        this._MapNameWindow.drawText(mapname, 0, 0, this._MapNameWindow.width);
    }
}

Scene_SoREntireMap.prototype.createSceneNameWindow = function(){
    this._SceneNamewindow = new Window_Base(new Rectangle(0,0,Graphics.width,64));
    this._SceneNamewindow.setBackgroundType(0);
    this.addWindow(this._SceneNamewindow);
    this._SceneNamewindow.drawText(Name_AreaMapScene, 0, 0, this._SceneNamewindow.width, "center");

    const mapname = $gameMap.displayName();
    this._SceneNamewindow.contents.fontSize = 18;
    const mname_w = this._SceneNamewindow.textWidth(mapname);
    this._MapNameWindow = new Window_Base(new Rectangle(0,64,mname_w+32,56));
    this._MapNameWindow.contents.fontSize = 18;
    this._MapNameWindow.setBackgroundType(0);
    this.addWindow(this._MapNameWindow);
    this._MapNameWindow.drawText(mapname, 0, 0, this._MapNameWindow.width);
}


Scene_SoREntireMap.prototype.createHelpWindow = function(){
    const helptext = HelpWindow_Text; 
    this._HelpWindow = new EntireMapHelpWindow(new Rectangle(0,HelpWindow_Ypadd,Graphics.width,56));
    const helpstate = this._HelpWindow.createTextState(helptext, Graphics.width/2 +ControlHelpText_XPadd, 0, this._HelpWindow.width);

    this._HelpWindow.opacity = 255;
    this._HelpWindow.contents.fontSize = 18;
    this._HelpWindow.setBackgroundType(1);
    this._HelpWindow.processAllText(helpstate);
    this.addChild(this._HelpWindow);
}


Scene_SoREntireMap.prototype.createCancelButton = function() {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
    this._cancelButton.y = this.buttonY();
    this.addWindow(this._cancelButton);
};





Scene_SoREntireMap.prototype.CheckHitKeys = function(){

    if (Input.isTriggered('up') || Input.isLongPressed('up')){
        if(this.AreaMapObj.y > Graphics.height - this.AreaMapObj.height+this.AreaMapObj.pixelsize){
        SoundManager.playCursor();
        this.AreaMapObj.y-=this.AreaMapObj.pixelsize;
        }
    }
    else if(Input.isTriggered('down') || Input.isLongPressed('down')){
        if(this.AreaMapObj.y < -this.AreaMapObj.pixelsize){
        SoundManager.playCursor();
        this.AreaMapObj.y+=this.AreaMapObj.pixelsize;
        }
    }
    else if(Input.isTriggered('right')|| Input.isLongPressed('right')){        
        if(this.AreaMapObj.x < -this.AreaMapObj.pixelsize){
        SoundManager.playCursor();
        this.AreaMapObj.x+=this.AreaMapObj.pixelsize;
        }
     
    }
    else if(Input.isTriggered('left')|| Input.isLongPressed('left')){
        if(this.AreaMapObj.x > Graphics.width - this.AreaMapObj.width+this.AreaMapObj.pixelsize){
        SoundManager.playCursor();
        this.AreaMapObj.x-=this.AreaMapObj.pixelsize;
        }
    }


    if (UseLegend_AreaMapScene && Input.isTriggered(CallButton_ForAreaMap)){
        if(!this._Legendwindow.isOpening() && !this._Legendwindow.isClosing()){
            if(!this._Legendwindow.isOpen())this._Legendwindow.open();
            if(this._Legendwindow.isOpen()) this._Legendwindow.close();
            SoundManager.playOk();
        }
      }
    

    if (Input.isTriggered('cancel') || TouchInput.isCancelled()){
         SoundManager.playCancel();
         SceneManager.pop();
    }
}



Scene_SoREntireMap.prototype.createMiniMapWindow = function() {
    const rect = this.SoR_AreaMapWindowRect();
    this.AreaMapObj = new SoR_AreaMap(rect);
    this.addWindow(this.AreaMapObj);

    this.AreaMapObj.traverseMap();
    this.AreaMapObj.FixWindowParameter();
    this.AreaMapObj.paintMiniMap();
   // this.AreaMapObj.DrawMinimapBase();
    this.AreaMapObj.SearchEventSymbols();
    
}


Scene_SoREntireMap.prototype.SoR_AreaMapWindowRect = function() {
    const ww = Graphics.width*4;
    const wh = Graphics.height*4;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};






///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
function EntireMapHelpWindow() {
    this.initialize(...arguments);
}

EntireMapHelpWindow.prototype = Object.create(Window_Base.prototype);
EntireMapHelpWindow.prototype.constructor = EntireMapHelpWindow;
Object.defineProperty(EntireMapHelpWindow.prototype, "innerWidth", {
    get: function() { return this._width; },
    set: function(value) { this.height = value; },
    configurable: true
});
Object.defineProperty(EntireMapHelpWindow.prototype, "innerHeight", {
    get: function() { return this._height; },
    set: function(value) { this.height = value; },
    configurable: true
});

EntireMapHelpWindow.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
}

//Renders the object using the WebGL renderer.
EntireMapHelpWindow.prototype.render = function render(renderer) {
    if (!this.visible) return;

    const graphics = new PIXI.Graphics();
    const gl = renderer.gl;
    const children = this.children.clone();

    renderer.framebuffer.forceStencil();
    graphics.transform = this.transform;
    renderer.batch.flush();
    gl.enable(gl.STENCIL_TEST);
    
    while (children.length > 0) {
        const win = children.pop();
        if (win._isWindow && win.visible && win.openness > 0) {
            win.render(renderer);
        }
    }

    gl.disable(gl.STENCIL_TEST);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.clearStencil(0);
    renderer.batch.flush();

    for (const child of this.children) {
        if (!child._isWindow && child.visible) {
            child.render(renderer);
        }
    }

    renderer.batch.flush();
};


//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
function SoR_AreaMap() {
    this.initialize(...arguments);
}
SoR_AreaMap.prototype = Object.create(SoR_MiniMap.prototype);
SoR_AreaMap.prototype.constructor = SoR_AreaMap;


SoR_AreaMap.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.openness = 255;
    this.visible = true;
    this.opacity = 0;

    this.mapdata = [];
    this.mapimg = null;     //minimap sprite
    this.map_sx = 0;        //sizeofmap
    this.map_sy = 0;
    this.centerx = -1;
    this.centery = -1;
    this.cursor_dir = -1;
    this.pixelsize = 16;     //pixel size on minimap
    this.minimap_rad = 256; //radius --> for padding in entire region
    this.map_padd = 0; //boundary cells on minimap

    this.inpassable_ck = [];
    this.inpass_ck_visited = [];

    this.EVsymbols = [];
    this.AdditionalSymbols = [];
    this.InitImages();
}


SoR_AreaMap.prototype.initializeWindowPosition = function() {
    this.x = -this.pixelsize;
    this.y = -this.pixelsize;

    const pd = this.map_padd;
    const px = $gamePlayer._x;
    const py = $gamePlayer._y;
 
    let testx = (px+pd)*this.pixelsize;
    let testy = (py+pd)*this.pixelsize;

    if(this.width < Graphics.width) this.x += (Graphics.width-this.width)/2;
    else{
        this.x += (Graphics.width/2 - testx);
        if(this.x < Graphics.width - this.width+this.pixelsize) this.x = Graphics.width - this.width+this.pixelsize;
        else if(this.x > -this.pixelsize) this.x = -this.pixelsize;
    }
    if(this.height < Graphics.height) this.y += (Graphics.height-this.height)/2;
    else{
        this.y += (Graphics.height/2 - testy);
        if(this.y < Graphics.height - this.height+this.pixelsize) this.y = Graphics.height - this.height+this.pixelsize;
        else if(this.y > -this.pixelsize) this.y = -this.pixelsize;
    }
}


SoR_AreaMap.prototype.FixWindowParameter = function() {
    this.minimap_rad = this.map_sx > this.map_sy? (this.map_sx+this.map_padd+8)*this.pixelsize/2 : (this.map_sy+this.map_padd+8)*this.pixelsize/2; //radius
    this.move(0,0,(this.map_sx+this.map_padd+8)*this.pixelsize,(this.map_sy+this.map_padd+8)*this.pixelsize);
}

SoR_AreaMap.prototype.updateMinimap = function() {
    const pd = this.map_padd;
    const px = $gamePlayer._x;
    const py = $gamePlayer._y;
    const d = $gamePlayer._direction;
 
    let testx = (px+pd)*this.pixelsize/2  //- this.minimap_rad;
    let testy = (py+pd)*this.pixelsize/2 //- this.minimap_rad;

        this.centerx = testx;
        this.centery = testy;

        this.UpdateMinimapBase((this.map_sx+pd)*this.pixelsize,(this.map_sy+pd)*this.pixelsize);
        this.UpdateSymbolCursor();
        this.UpdatePlayerCursor(d);
}

SoR_AreaMap.prototype.DrawMMComponents = function(){
    const pd = this.map_padd;
    const px = $gamePlayer._x;
    const py = $gamePlayer._y;
 
    this.DrawMinimapBase(0,0);
    this.DrawSymbolCursor();
    this.DrawPlayerCursor($gamePlayer._direction);
}


SoR_AreaMap.prototype.DrawMinimapBase = function(xx,yy) {

    this.mapspr = new Sprite(this.mapimg);
    //this.mapspr.setFrame( posx, posy, this.minimap_rad*2, this.minimap_rad*2);
    this.mapspr.x = xx*2-16;//this.minimap_rad-posx-ht+pixs;
    this.mapspr.y = yy*2-16;//this.minimap_rad-posy-ht+pixs;

    this.addChild(this.mapspr);
/*
    this.mapimg.addLoadListener(function() {
    this.contents.mapblt(this.mapimg, 0, 0, xx*2, yy*2, -16, -16);
    }.bind(this));*/
}
SoR_AreaMap.prototype.UpdateMinimapBase = function(xx,yy) {
 
    //this.mapspr.setFrame( posx, posy, this.minimap_rad*2, this.minimap_rad*2);
    this.mapspr.x = xx*2-16;//this.minimap_rad-posx-ht+pixs;
    this.mapspr.y = yy*2-16;//this.minimap_rad-posy-ht+pixs;
 
/*
    this.mapimg.addLoadListener(function() {
    this.contents.mapblt(this.mapimg, 0, 0, xx*2, yy*2, -16, -16);
    }.bind(this));*/
}


SoR_AreaMap.prototype.DrawPlayerCursor = function(d) {
    const pd = this.map_padd;
    const px = $gamePlayer._x;
    const py = $gamePlayer._y;
 
    let testx = (px+pd)*this.pixelsize  //- this.minimap_rad;
    let testy = (py+pd)*this.pixelsize //- this.minimap_rad;
    
    this.cursor_dir = d;
    const wd = Math.floor(this.p_cursor.width/4);
    const ht = this.p_cursor.height; 

    this.p_cursor.setFrame((d/2-1)*wd, 0, wd, ht);
    this.p_cursor.x = testx-wd;
    this.p_cursor.y = testy-ht
    this.addChild(this.p_cursor);
}

SoR_AreaMap.prototype.UpdatePlayerCursor = function(d) {
    const pd = this.map_padd;
    const px = $gamePlayer._x;
    const py = $gamePlayer._y;
 
    let testx = (px+pd)*this.pixelsize  //- this.minimap_rad;
    let testy = (py+pd)*this.pixelsize //- this.minimap_rad;
    
    this.cursor_dir = d;
    const wd = Math.floor(this.p_cursor.width/4);
    const ht = this.p_cursor.height;

    const pixs = Math.floor(this.pixelsize/2);
    this.p_cursor.setFrame((d/2-1)*wd, 0, wd, ht);
    this.p_cursor.x = testx-wd;
    this.p_cursor.y = testy-ht
}


SoR_AreaMap.prototype.DrawSymbolCursor = function() {
    const pd = this.map_padd;

    const evslen = this.EVsymbols.length;
    for(let i=0; i<evslen;i++){
    const ev = this.EVsymbols[i];
    let x, y, flags, page, dir, treasure_flag, p_ev;

    if(ev.type>=3 && ev.type<= 5){ //boat, ship, airship
        if(ev.type==3) p_ev = $gameMap.boat();
        else if(ev.type==4) p_ev = $gameMap.ship();
        else if(ev.type==5) p_ev = $gameMap.airship();
    }
    else{ // regular events
        p_ev = FindSymbolFromEvID(ev);
        if(p_ev === undefined) continue;

        flags = ev.flags;
        page = p_ev.findProperPageIndex()+1;//0 origin to 1 origin in the game
							 
        dir = p_ev._direction;
        treasure_flag = 0;
        if(page<=0) continue;
   }

    x = p_ev._x;
    y = p_ev._y;

    if(ev.type==2){//treasure
        if(flags.indexOf(page)!=-1) treasure_flag=1; //opened
    }
    else{//enemy, npc
        if(ev.type==0){
            if(p_ev._erased) continue;
        }       
        if(ev.flags.length!=0){
            //Isenable visible symbols
            if(flags.indexOf(page)==-1) continue;
        }
    }
    let posx = Math.round((x+pd)*this.pixelsize);
    let posy = Math.round((y+pd)*this.pixelsize);

    let wd = 0;
    let ht = 0; 
    
    if(ev.type==0){//e_cursor
      wd = ev.cursor.bitmap.width/4;
      ht = ev.cursor.bitmap.height;
	  ev.cursor.setFrame((dir/2-1)*wd, 0, wd, ht);
      ev.cursor.x = posx-ht;
      ev.cursor.y = posy-ht;
      this.addChild(ev.cursor);
    }
    else if(ev.type==1){//npc_cursor
	   wd = ev.cursor.bitmap.width;
       ht = ev.cursor.bitmap.height;
       ev.cursor.setFrame( 0, 0, wd, ht);
       ev.cursor.x = posx-ht;
       ev.cursor.y = posy-ht;
       this.addChild(ev.cursor);
    }
    else if(ev.type==2){//tre_cursor
      if(IsVisible_NotFoundTreasures(treasure_flag)){
            wd = ev.cursor.bitmap.width/2;
            ht = ev.cursor.bitmap.height;
            ev.cursor.setFrame( treasure_flag*wd, 0, wd, ht);
            ev.cursor.x = posx-ht;
            ev.cursor.y = posy-ht;
            this.addChild(ev.cursor);						 
      }
    }
    else if(ev.type==3){//boat
        wd = this.cursor.bitmap.width;
        ht = this.cursor.bitmap.height;
        this.cursor.x = posx-ht;
        this.cursor.y = posxy-ht;
        this.addChild(ev.cursor);
    }
    else if(ev.type==4){//ship
        wd = this.cursor.width;
        ht = this.cursor.height;
        ev.cursor.x = posx-ht;
        ev.cursor.y = posy-ht;
        this.addChild(ev.cursor);
    }
    else if(ev.type==5){//airship
        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
        ev.cursor.x = posx-ht;
        ev.cursor.y = posy-ht;
        this.addChild(ev.cursor);
    }
    else{//additional symbols
        const id = ev.type-11;
        const mysymbol = this.AdditionalSymbols[id];
        wd = mysymbol.bitmap.width;
        ht = mysymbol.bitmap.height;

        ev.cursor.setFrame( 0, 0, wd, ht);
        ev.cursor.x = posx-ht;
        ev.cursor.y = posy-ht;
        this.addChild(ev.cursor);								   
    }

    }
}

SoR_AreaMap.prototype.UpdateSymbolCursor = function() {
    const pd = this.map_padd;

    const evslen = this.EVsymbols.length;
    for(let i=0; i<evslen;i++){
    const ev = this.EVsymbols[i];
    let x, y, flags, page, dir, treasure_flag, p_ev;

    if(ev.type>=3 && ev.type<= 5){ //boat, ship, airship
        if(ev.type==3) p_ev = $gameMap.boat();
        else if(ev.type==4) p_ev = $gameMap.ship();
        else if(ev.type==5) p_ev = $gameMap.airship();
    }
    else{ // regular events
        p_ev = FindSymbolFromEvID(ev);
        if(p_ev === undefined) continue;

        flags = ev.flags;
        page = p_ev.findProperPageIndex()+1;//0 origin to 1 origin in the game

        dir = p_ev._direction;
        treasure_flag = 0;
        if(page<=0) continue;
   }

    x = p_ev._x;
    y = p_ev._y;

    if(ev.type==2){//treasure
        if(flags.indexOf(page)!=-1) treasure_flag=1; //opened
    }
    else{//enemy, npc
        if(ev.type==0){
            if(p_ev._erased) continue;
        }       
        if(ev.flags.length!=0){
            //Isenable visible symbols
            if(flags.indexOf(page)==-1) continue;
        }
    }
    let posx = Math.round((x+pd)*this.pixelsize);
    let posy = Math.round((y+pd)*this.pixelsize);

    let wd = 0;
    let ht = 0;

    if(ev.type==0){//e
      wd = ev.cursor.bitmap.width/4;
      ht = ev.cursor.bitmap.height;        
	  ev.cursor.setFrame((dir/2-1)*wd, 0, wd, ht);
      ev.cursor.x = posx-ht;
      ev.cursor.y = posy-ht;
    }
    else if(ev.type==1){//npc
	   wd = ev.cursor.bitmap.width;
       ht = ev.cursor.bitmap.height;
       ev.cursor.setFrame( 0, 0, wd, ht);
       ev.cursor.x = posx-ht;
       ev.cursor.y = posy-ht;	 
    }
    else if(ev.type==2){//treasure
      if(IsVisible_NotFoundTreasures(treasure_flag)){
            wd = ev.cursor.bitmap.width/2;
            ht = ev.cursor.bitmap.height;
            ev.cursor.setFrame( treasure_flag*wd, 0, wd, ht);
            ev.cursor.x = posx-ht;
            ev.cursor.y = posy-ht;
      }
    }
    else if(ev.type==3){//boat
        wd = this.cursor.bitmap.width;
        ht = this.cursor.bitmap.height;
        this.cursor.x = posx-ht;
        this.cursor.y = posxy-ht;					  
 
    }
    else if(ev.type==4){//ship
        wd = this.cursor.width;
        ht = this.cursor.height;
        ev.cursor.x = posx-ht;
        ev.cursor.y = posy-ht;
    }
    else if(ev.type==5){//airship
        wd = ev.cursor.bitmap.width;
        ht = ev.cursor.bitmap.height;
        ev.cursor.x = posx-ht;
        ev.cursor.y = posy-ht;
    }
    else{//additional symbols
        const id = ev.type-11;
        const mysymbol = this.AdditionalSymbols[id];
        wd = mysymbol.bitmap.width;
        ht = mysymbol.bitmap.height;
  
        ev.cursor.setFrame( 0, 0, wd, ht);
        ev.cursor.x = posx-ht;
        ev.cursor.y = posy-ht;		   
    }

    }
}

SoR_AreaMap.prototype.update = function() {}

function IsVisible_NotFoundTreasures(treasure_flag){
    if(treasure_flag!=0) return true; //ignore opened treasures (let plot)

    //For unopeded
    const val = SwitchID_NotFoundTreasuresVisible;
    if(val==0) return true; //no restrictions
    if($gameSwitches.value(val)) return true;

    return false;
}




//////////////////////////////////////////////////////////////////////
function Window_AreaMapLegend() {
    this.initialize.apply(this, arguments);
}
Window_AreaMapLegend.prototype = Object.create(Window_Base.prototype);
Window_AreaMapLegend.prototype.constructor = Window_AreaMapLegend;

Window_AreaMapLegend.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, new Rectangle(8,128,200,540));

    if(MapIcon_Player!=="") this.p_cursor = new Sprite(ImageManager.loadMMSprite(MapIcon_Player));
    else this.p_cursor = new Sprite(new Bitmap(4,1));
    let wd = this.p_cursor.bitmap.width/4;
    let ht = this.p_cursor.bitmap.width;
    this.p_cursor.setFrame(0, 0, wd, ht);

    this.e_cursor = new Sprite(ImageManager.loadMMSprite(MapIcon_EnemySymbol));
    wd = this.e_cursor.bitmap.width/4;
    ht = this.e_cursor.bitmap.width;
    this.e_cursor.setFrame(0, 0, wd, ht);

    this.npc_cursor = new Sprite(ImageManager.loadMMSprite(MapIcon_NPCSymbol));
    this.tre_cursor = new Sprite(ImageManager.loadMMSprite(MapIcon_TreasureSymbol));
    wd = this.tre_cursor.bitmap.width/2;
    ht = this.tre_cursor.bitmap.width;
    this.tre_cursor.setFrame(0, 0, wd, ht);

    this.boat_cursor = new Sprite(ImageManager.loadMMSprite(MapIcon_BoatSymbol));
    this.ship_cursor = new Sprite(ImageManager.loadMMSprite(MapIcon_ShipSymbol));
    this.airship_cursor = new Sprite(ImageManager.loadMMSprite(MapIcon_AirShipSymbol));

    this.AdditionalSymbols = [];
    const add_n = AdditionalSymbols.length;
    for(let i=0; i<add_n; i++){
        this.AdditionalSymbols[i] = new Sprite(ImageManager.loadMMSprite(AdditionalSymbols[i].Icon));
    }

    this.setBackgroundType(0);
    this.DrawLegendWindow();
}


Window_AreaMapLegend.prototype.DrawLegendWindow = function(){

    this.contents.fontSize = 18;
    
    let px = 24;
    let py = 16;
    
        if(MapIcon_Player!==""){
            this.addChild(this.p_cursor);
            this.p_cursor.x = px;
            this.p_cursor.y = py+10;
            this.drawText(LegendPlayer_ForAreaMap,40,py-11,108,"center");
            py+=28;
        }
        if(MapIcon_EnemySymbol != ""){
            this.addChild(this.e_cursor);
            this.e_cursor.x = px;
            this.e_cursor.y = py+10;
            this.drawText(LegendEnemy_ForAreaMap,40,py-11,108,"center");
            py+=28;
        }
        if(MapIcon_NPCSymbol != ""){
            this.addChild(this.npc_cursor);
            this.npc_cursor.x = px;
            this.npc_cursor.y = py+10;
            this.drawText(LegendNPC_ForAreaMap,40,py-11,108,"center");
            py+=28;
        }
        if(MapIcon_TreasureSymbol != ""){
            this.addChild(this.tre_cursor);
            this.tre_cursor.x = px;
            this.tre_cursor.y = py+10;
            this.drawText(LegendTreasure_ForAreaMap,40,py-11,108,"center");
            py+=28;
        }
        
        //boat,ship,airship (v1.07)
        if(MapIcon_BoatSymbol != ""){
            this.addChild(this.boat_cursor);
            this.boat_cursor.x = px;
            this.boat_cursor.y = py+10;
            this.drawText(LegendBoat_ForAreaMap,40,py-11,108,"center");
            py+=28;
        }
        if(MapIcon_ShipSymbol != ""){
            this.addChild(this.ship_cursor);
            this.ship_cursor.x = px;
            this.ship_cursor.y = py+10;
            this.drawText(LegendShip_ForAreaMap,40,py-11,108,"center");
            py+=28;
        }
        if(MapIcon_AirShipSymbol != ""){
            this.addChild(this.airship_cursor);
            this.airship_cursor.x = px;
            this.airship_cursor.y = py+10;
            this.drawText(LegendAirShip_ForAreaMap,40,py-11,108,"center");
            py+=28;
        }
        
        //Additional Symbols
        const add_n = AdditionalSymbols.length;
        if(add_n > 0){
            for(let i=0; i<add_n; i++){
                this.addChild(this.AdditionalSymbols[i]);
                this.AdditionalSymbols[i].x = px;
                this.AdditionalSymbols[i].y = py+10;
                this.drawText(AdditionalSymbols[i].Legend_ForAreaMap,40,py-11,108,"center");
                py+=28;
            }
        }
    
        this.height -= (512-py);
    }

Window_AreaMapLegend.prototype.updateOpen = function() {
    if (this._opening) {
        this.openness += 32;
        if (this.isOpen()) {
            this._opening = false;
            for(ico of this.children) { if(ico instanceof Sprite) ico.visible = true;}
        }
    }
}
Window_AreaMapLegend.prototype.close = function() {
    if (!this.isClosed()) {
        this._closing = true;
        for(ico of this.children) { if(ico instanceof Sprite) ico.visible = false;}
    }
    this._opening = false;
}


Window_AreaMapLegend.prototype.render = function render(renderer) {
    if (!this.visible) return;

    const graphics = new PIXI.Graphics();
    const gl = renderer.gl;
    const children = this.children.clone();

    renderer.framebuffer.forceStencil();
    graphics.transform = this.transform;
    renderer.batch.flush();
    gl.enable(gl.STENCIL_TEST);
    
    while (children.length > 0) {
        const win = children.pop();
        if (win._isWindow && win.visible && win.openness > 0) {
            win.render(renderer);
        }
    }

    gl.disable(gl.STENCIL_TEST);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.clearStencil(0);
    renderer.batch.flush();

    for (const child of this.children) {
        if (!child._isWindow && child.visible) {
            child.render(renderer);
        }
    }

    renderer.batch.flush();
}


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

const SoR_MMS_DM_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = SoR_MMS_DM_makeSaveContents.call(this);
    contents.SoRMiniMap = SoR_MM_Isopen;
    return contents;
};

const SoR_MMS_DM_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    SoR_MMS_DM_extractSaveContents.call(this, contents);
    if(!contents.SoRMiniMap) SoR_MM_Isopen = false;
    else SoR_MM_Isopen = contents.SoRMiniMap;
};

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

PluginManager.registerCommand(pluginName, "ReloadSymbolTags", args => { 
    if(SceneManager._scene instanceof Scene_Map){
       SceneManager._scene.MiniMapObj.SearchEventSymbols();
       SceneManager._scene.MiniMapObj.DrawMMComponents();
    }
});

PluginManager.registerCommand(pluginName, "CallAreaMap", args => { 
       SceneManager.push(Scene_SoREntireMap);
});

PluginManager.registerCommand(pluginName, "OpenMiniMap", args => { 
    if(SceneManager._scene instanceof Scene_Map){
       SceneManager._scene.MiniMapObj.open(); 
    }
});

PluginManager.registerCommand(pluginName, "CloseMiniMap", args => { 
    if(SceneManager._scene instanceof Scene_Map){
       SceneManager._scene.MiniMapObj.close();
    }
});


})();