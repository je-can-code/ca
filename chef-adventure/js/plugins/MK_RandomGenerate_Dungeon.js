/*:
 * @target MZ
 * @plugindesc 1.01 Aero's Random Dungeon Generator
 * @author Aerosys
 * 
 *
 * =====================================================================================
 * PARAMS
 * =====================================================================================
 *
 * @param Default Use Seedable RNG
 * @desc You can change this for each dungeon individually
 * @type boolean
 * @default true
 * 
 * @param Entrance Region Id
 * @desc Region Id to define Entrance location
 * @default 5
 *
 * @param Player Spawning Point Region Id
 * @desc Region Id to define where the Player spawns when he is transferred towards a generated Map
 * @default 6
 *
 * @param Exit Region Id
 * @desc Region Id to define Exit location
 * @default 13
 *
 * @param Decoration Stopper Id
 * @desc Region Id to determine the last object in your decoration map
 * @default 61
 *
 * @param Default Border Width
 * @desc Space which is kept between the manipulated area and the edges
 * @default 1
 *
 * @command borderWidth
 * @text (optional) Set Border Width
 * @desc Change the size of the margin of the generated Map
 *
 * @arg value
 * @type Number
 * @default 1
 *
 * @command noSeedableRNG
 * @text (optional) Not use seedable RNG
 * @desc Disable the seedable RNG for a Rogue-like game.
 *
 * @command setSeed
 * @text (optional) Set Seed
 * @desc Set a custom Seed for the RNG
 *
 * @arg value
 * @type Number
 * @default 42
 * 
 * @command Create Classical Maze
 * @desc Start generating a Maze using the Prims algorithm
 *
 * @command Create Maze with Finetuning
 * @desc Start generating a Maze with optional parameters.
 *
 * @arg cutOffDeadEnds
 * @text Cut off Dead Ends
 * @desc Dead Ends are removed to create blank Tiles. Value is number of iterations.
 * @type Number
 * @default 2
 *
 * @arg mergeDeadEnds
 * @text Merge Dead Ends
 * @desc Chance that a new Tunnel is created from a Dead End back to the Maze. Will lead to imperfect Maze.
 * @type Number
 * @default 0.5
 *
 * @arg mode
 * @desc You can define the order of cut off first, then merge Dead Ends, or the other way round.
 * @type select
 * @option Cut off, then Merge
 * @option Merge, then Cut off
 * @default Cut off, then Merge
 *
 * @command Create Dungeon using Random Walk
 * @desc Start generating a Cave-like Dungeon allowing large Areas
 *
 * @arg Start
 * @type select
 * @option top
 * @option left
 * @option right
 * @option bottom
 * @default bottom
 *
 * @arg End
 * @type select
 * @option top
 * @option left
 * @option right
 * @option bottom
 * @default top
 *
 * @arg allowRevisit
 * @text allow Revisit
 * @desc Define, if the Random Walk algorithm is allowed to revisit a Place that he has already visited.
 * @type boolean
 * @default true
 *
 * @command createRoad
 * @text Create Road
 * @desc Start generating a (Forest) Road
 *
 * @arg Start
 * @type select
 * @option top
 * @option left
 * @option right
 * @option bottom
 * @default bottom
 *
 * @arg End
 * @type select
 * @option top
 * @option left
 * @option right
 * @option bottom
 * @default top
 *
 * @command placeEntrance
 * @text Place Entrance
 * @desc Place the Entrance
 *
 * @arg Position
 * @type select
 * @option any
 * @option top
 * @option left
 * @option right
 * @option bottom
 * @default bottom
 *
 * @command placeExit
 * @text Place Exit
 * @desc Place the Exit
 *
 * @arg Position
 * @type select
 * @option any
 * @option top
 * @option left
 * @option right
 * @option bottom
 * @default top
 *
 * @command spawnPlayerAt
 * @text (optional) Spawn Player at Region Id
 * @desc When you want the Player to spawn at a different Region Id
 *
 * @arg direction
 * @type select
 * @option any
 * @option top
 * @option left
 * @option right
 * @option bottom
 * @default any
 *
 * @arg regionId
 * @text Region Id
 * @type Number
 * @default 6 
 *
 * @command drawDecorations
 * @text Draw Decorations
 * @desc Draw Assets that are drawn on the Decoration Map
 *
 * @arg Ids
 * @desc comma-separated list of Decoration Ids. If empty, draw all Decorations.
 *
 * @command drawDecorationXTimes
 * @text Draw Decoration X Times
 * @desc Draw a specific Asset X times on the Map
 *
 * @arg Id
 * @type Number
 * @desc Id of the Decoration you want to draw.
 *
 * @arg min
 * @type Number
 * @default 1
 * @desc Minimum Number that the Asset should be drawn.
 *
 * @arg max
 * @type Number
 * @default 1
 * @desc Maximum Number that the Asset should be drawn.
 *
 * @command finalize
 * @text Finalize
 * @desc Call this Function at the end.
 *
 *
 * =====================================================================================
 * HELP
 * =====================================================================================
 *
 * @help
 * contact
 * --------
 * Aerosys at rpgmaker web forums
 *
 * Requirements (in this order)
 * ----------------------------
 * none
 *
 * T&C
 * ----------------------------
 * Credit Aerosys, Lantiz / Biterkid
 * Full T&C in the forums and on my website
 *
 * Instructions and T&C at v-aero.me
 * Please visit the rpgmakerweb forum to give feedback :)
 */

var MK = MK || {};
MK.alias = MK.alias || {};

var params = PluginManager.parameters('MK_RandomGenerate_Dungeon');
MK.ENTRANCE_REGION_ID           = Number(params['Entrance Region Id']);
MK.SPAWNING_POINT_REGION_ID     = Number(params['Player Spawning Point Region Id']);
MK.EXIT_REGION_ID               = Number(params['Exit Region Id']);
MK.DECORATION_STOPPER_ID        = Number(params['Decoration Stopper Id']);
MK.DEFAULT_BORDER_WIDTH         = Number(params['Default Border Width']);
MK.USE_SEEDABLE_RNG             = "true" == params['Default Use Seedable RNG'];

var Imported = Imported || {};
Imported.MK_RandomGenerate_Dungeon = '1.01';

/*
// Alias
MK.alias.event = Game_Event.prototype.event;
Game_Event.prototype.event = function() {
    
    if (!$dataMap.events[this._eventId])
        throw Error ("FATAL: Wanted to access Event '" + this._eventId + "' but does not exist!");
    
    return MK.alias.event.call(this);
};
*/


// =====================================================================================
// DataManager
// =====================================================================================

MK.loadedMapId;
MK.isLoadingMapInfos    = false;
MK.additionalMaps       = {};
MK.n_mapsLoading        = 0;


// Alias
MK.alias.loadMapData = DataManager.loadMapData;
DataManager.loadMapData = function(mapId) {
	
    MK.loadedMapId = mapId;
    
    if ($dungeonGenerator.mapId != mapId) {
        $dungeonGenerator.leaveRNGArea();
        MK.alias.loadMapData.call(this, mapId);
    }
};


// Alias
MK.alias.onLoad = DataManager.onLoad;
DataManager.onLoad = function(object) {
	
    if (object === $dataMap)
        MK.isLoadingMapInfos = true;
    
	MK.alias.onLoad.call(this, object);
    
    if (object === $dataMap)
		DataManager.loadChildMaps();
}

DataManager.clearAdditionalMaps = function() {
    $additionalMaps = {};
}

DataManager.loadChildMaps = function() {
    
    this.clearAdditionalMaps();
    
    var xhr = new XMLHttpRequest();
    var url = 'data/MapInfos.json';
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        
        var data = JSON.parse(xhr.responseText);
        
        function thisParentId() {
            for (mapInfo_ of data) {
                if (!!mapInfo_ && mapInfo_.id == MK.loadedMapId)
                    return mapInfo_.parentId;
            }
            return 0;
        }
        var parentId = thisParentId();
        
        for (var mapInfo of data) {
            if (!mapInfo) continue;
            
            if (mapInfo.parentId == MK.loadedMapId || mapInfo.parentId == parentId) {
                
                var name = mapInfo.name.toLowerCase();
                if (name.startsWith("snippets")
                    || name.startsWith("dec")
                    || name.startsWith("support")) {
                        
                    var filename = 'Map%1.json'.format(mapInfo.id.padZero(3));
                    DataManager.loadAdditionalMap(name, filename);
                }
            }
        }
        MK.isLoadingMapInfos = false;
    }
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
        MK.isLoadingMapInfos = false;
    }
    xhr.send();
}

DataManager.loadAdditionalMap = function(name, src) {
	var xhr = new XMLHttpRequest();
	var url = 'data/' + src;
	xhr.open('GET', url);
	xhr.overrideMimeType('application/json');
	xhr.onload = function() {
		if (xhr.status < 400) {
			var data = JSON.parse(xhr.responseText);
			MK.additionalMaps[name] = {};
			MK.additionalMaps[name].width  = data.width;
			MK.additionalMaps[name].height = data.height;
			MK.additionalMaps[name].data   = data.data;
			MK.additionalMaps[name].events = data.events;
			MK.n_mapsLoading -= 1;
		}
	}
	xhr.onerror = this._mapLoader || function() {
		DataManager._errorUrl = DataManager._errorUrl || url;
	}
	MK.additionalMaps[name] = null;
	MK.n_mapsLoading += 1;
	xhr.send();
};

// Alias
MK.alias.isMapLoaded = DataManager.isMapLoaded;
DataManager.isMapLoaded = function() {
	return MK.alias.isMapLoaded.call(this)
        && MK.n_mapsLoading == 0
        && !MK.isLoadingMapInfos;
};


// =====================================================================================
// Game_Map
// =====================================================================================
Game_Map.prototype.tileIndex = function(x, y, z) {
    return (z * this.height() + y) * this.width() + x;
}


Game_Map.prototype.MK_applyLoops = function(x, y) {
    
    // don't do modulo, it sucks with negative numbers
    if (this.isLoopHorizontal() && x < 0)              x = this.width() - 1;
    if (this.isLoopHorizontal() && x >= this.width())  x = 0;
    if (this.isLoopVertical()   && y < 0)              y = this.height() - 1;
    if (this.isLoopVertical()   && y >= this.height()) y = 0;
    return [x, y];
}


Game_Map.prototype.autotileEdge = function(autotile, x, y, z) {
    
    x = this.MK_applyLoops(x, y)[0];
    y = this.MK_applyLoops(x, y)[1];

    if (!this.isValid(x, y))
        return false;

    // check water & waterfall
    var isWater     = [0, 4, 6, 8, 10, 12, 14].contains(autotile);
    var isWaterfall =    [5, 7, 9, 11, 13, 15].contains(this.autotileType(x, y, z));

    if (isWater && isWaterfall)
        return false;

    return autotile != this.autotileType(x, y, z);
};

Game_Map.prototype.autotileWallEdge = function(autotile, x, y, z) {
    
    x = this.MK_applyLoops(x, y)[0];
    y = this.MK_applyLoops(x, y)[1];

    if (!this.isValid(x, y))
        return false;
    
    var same = this.autotileEdge(autotile, x, y, z);
    if(same && this.autotileType(x, y, z) + 8 == autotile) {
        return false;
    }
    return same;
};

Game_Map.prototype.getAutotileTileId = function(autotile, index) {
    return 2048 + (48 * autotile) + index;
};

Game_Map.prototype.getAutotileGroup = function(autotile) {
    if(!autotile) {
        return 0;
    }
	if ([5, 7, 9, 11, 13, 15].contains(autotile)) {
        return 2 ;
    }
    if(autotile >= 48 && autotile <= 79) {
        return 1 ;
    }
    if(autotile >= 88 && autotile <= 95) {
        return 1;
    }
    if(autotile >= 104 && autotile <= 111) {
        return 1;
    }
    if(autotile >= 120 && autotile <= 127) {
        return 1;
    }
    return 0;
};

Game_Map.prototype.waterfallAutotileIndex = function(l, r) {
    var edge = 0;
    if(l) {
        edge += 1;
    }
    if(r) {
        edge += 2;
    }
    return edge;
};

Game_Map.prototype.wallTopAutotileIndex = function(u, d, l, r) {
    var edge = 0;
    if(l) {
        edge += 1;
    }
    if(u) {
        edge += 2;
    }
    if(r) {
        edge += 4;
    }
    if(d) {
        edge += 8;
    }
    return edge;
};

Game_Map.prototype.normalAutotileIndex = function(u, d, l, r, ul, ur, dl, dr) {
    var edge = 0;
    if(l) {
        edge += 1;
    }
    if(u) {
        edge += 2;
    }
    if(r) {
        edge += 4;
    }
    if(d) {
        edge += 8;
    }
    var corner = 0;
    switch(edge) {
        case 0:
            if(ul) {
                corner += 1;
            }
            if(ur) {
                corner += 2;
            }
            if(dr) {
                corner += 4;
            }
            if(dl) {
                corner += 8;
            }
            return corner;
        case 1:
            if(ur) {
                corner += 1;
            }
            if(dr) {
                corner += 2;
            }
            return 16 + corner;
        case 2:
            if(dr) {
                corner += 1;
            }
            if(dl) {
                corner += 2;
            }
            return 20 + corner;
        case 4:
            if(dl) {
                corner += 1;
            }
            if(ul) {
                corner += 2;
            }
            return 24 + corner;
        case 8:
            if(ul) {
                corner += 1;
            }
            if(ur) {
                corner += 2;
            }
            return 28 + corner;
        case 5:
            return 32;
        case 10:
            return 33;
        case 3:
            return dr ? 35 : 34;
        case 6:
            return dl ? 37 : 36;
        case 12:
            return ul ? 39 : 38;
        case 9:
            return ur ? 41 : 40;
        case 7 :
            return 42;
        case 11:
            return 43;
        case 13:
            return 44;
        case 14:
            return 45;
        case 15:
            return 46;
        default:
            return 47;
    }
};

Game_Map.prototype.updateAutotile = function(x, y, z) {
    var autotile = this.autotileType(x, y, z);
    
    if(autotile < 0) {
        return;
    }
    
    var index = 0;
    var autoTileGroup = this.getAutotileGroup(autotile);
    
    switch(autoTileGroup) {
        case 2:
            var l = this.autotileEdge(autotile, x - 1, y, z);
            var r = this.autotileEdge(autotile, x + 1, y, z);
            index = this.waterfallAutotileIndex(l, r);
            break;
        case 1:
            var l = this.autotileWallEdge(autotile, x - 1, y, z);
            var r = this.autotileWallEdge(autotile, x + 1, y, z);
            var u = this.autotileEdge(autotile, x, y - 1, z);
            var d = this.autotileEdge(autotile, x, y + 1, z);
            index = this.wallTopAutotileIndex(u, d, l, r);
            break;
        case 0:
            var  l = this.autotileEdge(autotile, x - 1, y, z);
            var  r = this.autotileEdge(autotile, x + 1, y, z);
            var  u = this.autotileEdge(autotile, x, y - 1, z);
            var  d = this.autotileEdge(autotile, x, y + 1, z);
            var ul = this.autotileEdge(autotile, x - 1, y - 1, z);
            var ur = this.autotileEdge(autotile, x + 1, y - 1, z);
            var dl = this.autotileEdge(autotile, x - 1, y + 1, z);
            var dr = this.autotileEdge(autotile, x + 1, y + 1, z);
            index = this.normalAutotileIndex(u, d, l, r, ul, ur, dl, dr);
            break;
    }
    
    $dataMap.data[this.tileIndex(x, y, z)] = this.getAutotileTileId(autotile, index);
};

Game_Map.prototype.updateAllAutoTiles = function() {
    for(var i = 0; i < this.width(); i++) {
        for(var j = 0; j < this.height(); j++) {
            for(var k = 0; k < 6; k++) {
                this.updateAutotile(i, j, k);
            }
        }
    }
};
// =====================================================================================
// PRNG
// =====================================================================================
class MK_PRGN {
    
    constructor(seed) {
        this.seed = seed;
    }
    
    setSeed(i) {
        this.seed = i;
    }
    
    randomInteger(min, max) {
        max = max || 1;
        min = min || 0;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280;
        return Math.floor(min + rnd * (max - min));
    }
}

// =====================================================================================
// Dungeon Generator
// =====================================================================================
class DungeonGenerator {
    
    constructor() {
        this._useSeedableRNG = MK.USE_SEEDABLE_RNG;
        this._borderWidth = MK.DEFAULT_BORDER_WIDTH;
        this.spawnLocation = null;
        this.rng = new MK_PRGN(74);
    }
    
    reset() {
        this.spawnLocation = null;
        if ($gameMap.mapId() != this.mapId) {
            // entered RNG Area
            this.dataMap = JsonEx.makeDeepCopy($dataMap);
            this.originalDataMap = JsonEx.makeDeepCopy(this.dataMap);
        } else {
            // still on RNG Area
            this.dataMap = JsonEx.makeDeepCopy(this.originalDataMap);
        }
        this.mapId = $gameMap.mapId();
    }
    
    resetAfterFinalize() {
        this._borderWidth = MK.DEFAULT_BORDER_WIDTH;
        this._useSeedableRNG = MK.USE_SEEDABLE_RNG;
    }
    
    leaveRNGArea() {
        this.dataMap = null;
        this.mapId = null;
        MK.additionalMaps = {};
    }

    setSeed(i) {
        this.rng.setSeed(i);
        this._useSeedableRNG = true;
        return this;
    }
    
    randomSeed() {
        return this.noSeedableRNG();
    }
    
    noSeedableRNG() {
        this._useSeedableRNG = false;
        return this;
    }
    
    borderWidth(borderWidth) {
        this._borderWidth = borderWidth;
        return this;
    }
    
    randomInteger(min, max)
    {
        if (this._useSeedableRNG)
            return this.rng.randomInteger(min, max);
        
        var rnd = Math.random();
        return Math.floor(min + rnd * (max - min));
    }

    threshold(probability) {
        return this.randomInteger(1, 100) <= probability * 100.0;
    }

    pick_random(array) {
        if (array.length == 0) throw Error ("FATAL: pick random: empty array given!");
        if (array.length == 1) return array[0];
        return array[this.randomInteger(0, array.length)];
    }


    getSnippetWidth() {
        return Math.floor((MK.additionalMaps["snippets"].width - 5) / 4);
    }

    getSnippetHeight() {
        return Math.floor((MK.additionalMaps["snippets"].height - 5) / 4);
    }

    getDungeonWidth() {
        return Math.floor(($dataMap.width - (2 * this._borderWidth)) / this.getSnippetWidth());
    }

    getDungeonHeight() {
        return Math.floor(($dataMap.height - (2 * this._borderWidth))  / this.getSnippetHeight());
    }
    
    validateMapSettingsMaze() {
        if (!MK.additionalMaps.snippets) this.error("Snippets Map", "snippets");
    }
    
    validateMapSettingsWithArea() {
        if (!MK.additionalMaps.snippets)              this.error("Snippets Map", "snippets");
        if (!MK.additionalMaps.snippetsarea)          this.error("Areas Map", "snippetsArea");
        if (!MK.additionalMaps.snippetstransitions)   this.error("Transitions Map", "snippetsTransitions");
    }
    
    error(name, exactName) {
        throw Error (name + " not found!\n" + 
                "Please check if it is defined, in Map Tree below Space Map, and has the name '" + exactName + "'");
    }
    
    index(x, y, z, dataMap) {
        dataMap = dataMap ? dataMap : this.dataMap;
        var w = dataMap.width;
        var h = dataMap.height;
        return (z * w * h) + (y * w) + x;
    }
    
    tile(x, y, z, dataMap) {
        dataMap = dataMap ? dataMap : this.dataMap;
        var loc = this.index(x, y, z, dataMap);
        return dataMap.data[loc];
    }
    
    regionId(x, y, dataMap) {
        return this.tile(x, y, 5, dataMap);
    }
    
    isTileEmpty(x, y, dataMap) {
        for (var z = 0; z < 6; z++) {
            if (this.tile(x, y, z, dataMap) != 0)
                return false;
        }
        return true;
    }
    
    getTileStack(x, y, dataMap) {
        var stack = [];
        for (var z = 0; z < 6; z++) {
            var id = this.tile(x, y, z, dataMap);
            stack.push(id);
        }
        return stack;
    }
    
    setTileStack(x, y, dataMap, stack) {
        for (var z = 0; z < 6; z++) {
            var loc = this.index(x, y, z, dataMap);
            dataMap.data[loc] = stack[z];
        }
    }
    
    isAreaEmpty(x1, y1, x2, y2, dataMap) {
       
        for (var x = x1; x <= x2; x++) {
            for (var y = y1; y <= y2; y++) {
                if (!this.isTileEmpty(x, y, dataMap))
                    return false;
            }
        }
        
        for (event of dataMap.events) {
            if (!event)
                continue;
            if (x1 <= event.x && event.x <= x2 && y1 <= event.y && event.y <= y2)
                return false;
        }
        
        return true;
    }
    
    placeSnippet (sourceMapName, id, x, y, columns, rows) {
        
        columns = (columns) ? columns : 4;
        rows = (rows) ? rows : 4;
        
        var element_width = this.getSnippetWidth();
        var element_height = this.getSnippetHeight();
        
        var from_x = id % columns;
        var from_y = Math.floor(id / columns);
        
        var to_x = (x * element_width) + this._borderWidth;
        var to_y = (y * element_height) + this._borderWidth;
        var x1 = ((element_width  + 1) * from_x) + 1;
        var y1 = ((element_height + 1) * from_y) + 1;
        var x2 = ((element_width  + 1) * (from_x + 1)) - 1;
        var y2 = ((element_height + 1) * (from_y + 1)) - 1;
        
        this.safelyCopyTiles(to_x, to_y, sourceMapName, x1, y1, x2, y2);
        this.cloneEventsFromArea(to_x, to_y, sourceMapName, x1, y1, x2, y2);
    }
    
    
    safelyCopyTiles(to_x, to_y, sourceMapName, from_x1, from_y1, from_x2, from_y2) {
        
        if (!sourceMapName)
            throw Error ("FATAL: no sourceMapName given!");
        
        if (!(sourceMapName in MK.additionalMaps))
            throw Error ("Map [" + sourceMapName + "] not exists! Please define it and put it as Child Map of the Space Map");
        
        var w = from_x2 - from_x1 + 1;
        var h = from_y2 - from_y1 + 1;
        
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                this.copyTileFromXY(
                    from_x1 + x,
                    from_y1 + y,
                    to_x + x,
                    to_y + y,
                    MK.additionalMaps[sourceMapName],
                    this.dataMap
                    );
            }
        }
    }
    
    copyTileFromXY(from_x, from_y, to_x, to_y, source, target) {
        var tileStack = this.getTileStack(from_x, from_y, source);
        this.safelyPasteTileStack(to_x, to_y, source, target, tileStack);
    }
    
    safelyPasteTileStack(to_x, to_y, source, target, tileStack) {
        
        for (var z = 0; z < 6; z++) {
            
            var target_loc = this.index(to_x, to_y, z, target);
            var target_id  = target.data[target_loc];
            var source_id  = tileStack[z];
            
            if ([2, 3].contains(z) && source_id == 0)                       continue;
            if ([0, 1].contains(z) && (tileStack[0] + tileStack[1]) == 0)   continue;
            if (z == 0 && source_id == 0)                                   continue;
            
            if (z == 3 && target_id != 0)
                target.data[this.index(to_x, to_y, z - 1, target)] = target.data[target_loc];
            
            target.data[target_loc] = source_id;
        }
    }
    
    eraseRegionId(regionId) {
        for (var x = 0; x < this.dataMap.width; x++) {
            for (var y = 0; y < this.dataMap.height; y++) {
                var loc = this.index(x, y, 5);
                if (this.dataMap.data[loc] == regionId) {
                    this.dataMap.data[loc] = 0;
                }
            }
        }
        return this;
    }
    
    eraseRegionIds(ids) {
        for (var r of ids) {
            this.eraseRegionId(r);
        }
        return this;
    }
    
    cloneEventFromXY(to_x, to_y, sourceMapName, from_x, from_y)
    {
        for (var event of MK.additionalMaps[sourceMapName].events)
        {
            if (!event)
                continue;
            
            if (event.x == from_x && event.y == from_y)
            {
                var next_id = this.dataMap.events.length;
                var eventData = JsonEx.makeDeepCopy(event);
                eventData.id = next_id;
                eventData.x  = to_x;
                eventData.y  = to_y;
                this.dataMap.events[next_id] = eventData;
                
                $gameSelfSwitches.setValue([$gameMap.mapId(), eventData.id, 'A'], false);
                $gameSelfSwitches.setValue([$gameMap.mapId(), eventData.id, 'B'], false);
                $gameSelfSwitches.setValue([$gameMap.mapId(), eventData.id, 'C'], false);
                $gameSelfSwitches.setValue([$gameMap.mapId(), eventData.id, 'D'], false);
            }
        }
    }


    cloneEventsFromArea(to_x, to_y, sourceMapName, x1, y1, x2, y2)
    {
        for (var x = 0; x < x2 - x1 + 1; x++) {
            for (var y = 0; y < y2 - y1 + 1; y++) {
                this.cloneEventFromXY(to_x + x, to_y + y, sourceMapName, x1 + x, y1 + y);
            }
        }
    }


    createMatrix(width, height, initial_value) {
        
        var matrix = [];
        initial_value = initial_value || 0;
        
        for (var x = 0; x < width; x++) {
            matrix.push([]);
            for (var y = 0; y < height; y++) {
                matrix[matrix.length - 1].push(initial_value);
            }
        }
        return matrix;
    }
    
    
    // runs PRIMS algorithm
    prims () {
        
        this.reset();
        this.validateMapSettingsMaze();
        
        var dungeon_width = this.getDungeonWidth();
        var dungeon_height = this.getDungeonHeight();
        var map = this.createMatrix(dungeon_width, dungeon_height);
        var points = [];
        
        for (var x = 0; x < dungeon_width; x++) {
            for (var y = 0; y < dungeon_height; y++) {
                points.push({x: x, y: y});
            }
        }
        
        map[1][0] = map[1][0] | 4;
        map[1][1] = map[1][1] | 1;
        
        var remaining = (dungeon_width) * (dungeon_height);
        
        while (remaining > 0)
        {
            remaining -= 1;
            var options = [];
            
            for (var i = 0; i < points.length; i++)
            {
                var p = points[i];
                
                if (map[p.x][p.y] == 0 && p.x != 0                && map[p.x-1][p.y] != 0)
                    options.push(p);
                if (map[p.x][p.y] == 0 && p.x < dungeon_width -1  && map[p.x+1][p.y] != 0)
                    options.push(p);
                if (map[p.x][p.y] == 0 && p.y != 0                && map[p.x][p.y-1] != 0)
                    options.push(p);
                if (map[p.x][p.y] == 0 && p.y < dungeon_height -1 && map[p.x][p.y+1] != 0)
                    options.push(p);
            }
            
            if (options.length == 0)
                break;
            
            var p = this.pick_random(options);
            var dirs = [];
            
            if (p.x > 0 && map[p.x-1][p.y] != 0)                    dirs.push('left');
            if (p.x < dungeon_width -1 && map[p.x+1][p.y] != 0)     dirs.push('right');
            if (p.y > 0 && map[p.x][p.y-1] != 0)                    dirs.push('up');
            if (p.y < dungeon_height -1 && map[p.x][p.y+1] != 0)    dirs.push('down');
            
            var dir = this.pick_random(dirs);
            
            if (dir == 'left') {
                map[p.x][p.y] = map[p.x][p.y] | 8;
                map[p.x-1][p.y] = map[p.x-1][p.y] | 2;
            }
            if (dir == 'right') {
                map[p.x][p.y] = map[p.x][p.y] | 2;
                map[p.x+1][p.y] = map[p.x+1][p.y] | 8;
            }
            if (dir == 'up') {
                map[p.x][p.y] = map[p.x][p.y] | 1;
                map[p.x][p.y-1] = map[p.x][p.y-1] | 4;
            }
            if (dir == 'down') {
                map[p.x][p.y] = map[p.x][p.y] | 4;
                map[p.x][p.y+1] = map[p.x][p.y+1] | 1;
            }
        }
        this.map = map;
        return new MazeBuilderParams();
    }


    randomWalk () {	
        this.reset();
        return new RandomWalkParams();
    }


    run_randomWalk (params) {
        
        this.validateMapSettingsWithArea();
        
        var start = params._start;
        var exit  = params._exit;
        
        if (!start) start = "bottom";
        if (!exit) 	exit  = "top";
        
        if (!["top", "right", "left", "bottom"].contains(start))
            throw Error("RandomWalk: start must be top, right, left or bottom");
        
        if (!["top", "right", "left", "bottom"].contains(exit))
            throw Error("RandomWalk: exit must be top, right, left or bottom");
        
        if (start == exit)
            throw Error("RandomWalk: Cannot start and end from same direction");
        
        var allow_up    = params._allowGoingBack || start != "top";
        var allow_right = params._allowGoingBack || start != "right";
        var allow_left  = params._allowGoingBack || start != "left";
        var allow_down  = params._allowGoingBack || start != "bottom";
        
        var w = this.getDungeonWidth();
        var h = this.getDungeonHeight();
        var map = this.createMatrix(w, h, 0);
        var visited = this.createMatrix(w, h, false);
        
        var start_x;
        var start_y;
        
        if (start == "top") {
            start_x = Math.floor(w / 2);
            start_y = 0;
        }
        if (start == "right") {
            start_x = w - 1;
            start_y = Math.floor(h / 2);
        }
        if (start == "left") {
            start_x = 0;
            start_y = Math.floor(h / 2);
        }
        if (start == "bottom") {
            start_x = Math.floor(w / 2);
            start_y = h - 1;
        }
        
        map[start_x][start_y] = 1;
        
        var x = start_x;
        var y = start_y;
        var stack = [];
        stack.push({"x": x, "y": y});
        
        while (stack.length > 0) {
            
            x = stack[stack.length - 1].x;
            y = stack[stack.length - 1].y;
            map[x][y] = 1;
            visited[x][y] = true;
            var options = [];
            
            if (exit == "top" 		&& y == 0) 		break;
            if (exit == "right" 	&& x == w - 1) 	break;
            if (exit == "left"  	&& x == 0) 		break;
            if (exit == "bottom"	&& y == h - 1) 	break;
            
            function inFrame(x, y) {
                return 0 <= x && x < w && 0 <= y && y < h;
            }
            
            function check(x, y) {
                return inFrame(x, y) && (params._allowRevisit || (!map[x][y] && !visited[x][y]));
            }
            
            function check2(x, y) {
                if (!inFrame(x, y)) return false;
                if (!params._allowRevisit && visited[x][y]) return false;
                
                var i = 0;
                if (inFrame(x, y-1) && map[x][y-1]) i++;
                if (inFrame(x, y+1) && map[x][y+1]) i++;
                if (inFrame(x-1, y) && map[x-1][y]) i++;
                if (inFrame(x+1, y) && map[x+1][y]) i++;
                return i <= 1;
            }
            
            if (params._allowLargeAreas) {
                if (check(x, y-1) && allow_up)    options.push("up");
                if (check(x+1, y) && allow_right) options.push("right");
                if (check(x-1, y) && allow_left)  options.push("left");
                if (check(x, y+1) && allow_down)  options.push("down");
            } else {
                if (check2(x, y-1) && allow_up)    options.push("up");
                if (check2(x+1, y) && allow_right) options.push("right");
                if (check2(x-1, y) && allow_left)  options.push("left");
                if (check2(x, y+1) && allow_down)  options.push("down");
            }
            
            if (options.length == 0) {
                stack.pop();
                map[x][y] = 0;
                continue;
            }
            
            var option = this.pick_random(options);
            
            if (option == "up")     y = y - 1;
            if (option == "right")  x = x + 1;
            if (option == "left")   x = x - 1;
            if (option == "down")   y = y + 1;
            
            stack.push({x: x, y: y});
        }
        
        this.map = this._binary2drawable(map);
        
        return this;
    }


    /* cuts off dead ends.
     * 
     * @param n (integer): how often this feature should be repeated
     *
     * caution: removing too many deadends may occur that there's no place left for entrance and exit
     */ 
    cutOffDeadEnds (n)
    {
        var map = this.map;
        
        if (n == 0) return this;
        if (!n) n = 1;
        
        for (var i = 0; i < n; i++)
        {
            var list = [];
            
            for (var x = 0; x < map.length; x++) {
                for (var y = 0; y < map[x].length; y++) {
                    
                    if ([1, 2, 4, 8].contains(map[x][y]))
                        list.push({x: x, y: y});
                }
            }
            
            for (var j = 0; j < list.length; j++)
            {
                var x = list[j].x;
                var y = list[j].y;
                
                if (map[x][y] == 1) // v
                {
                    map[x][y] = 0;
                    map[x][y-1] = map[x][y-1] & 11;
                }
                if (map[x][y] == 2) // <
                {
                    map[x][y] = 0;
                    map[x+1][y] = map[x+1][y] & 7;
                }
                if (map[x][y] == 4) // ^
                {
                    map[x][y] = 0;
                    map[x][y+1] = map[x][y+1] & 14;
                }
                if (map[x][y] == 8) // >
                {
                    map[x][y] = 0;
                    map[x-1][y] = map[x-1][y] & 13;
                }
            }
        }
        
        return this;
    }


    /*
     * For every dead end, make a new tunnel which merges back into the maze. Will lead to an imperfect maze
     *
     * @param probability (float 0.0 < 1.0): The higher the value, the higher the chance a tunnel will be build, otherwise this deadend keeps untouched
     */
    mergeDeadEnds(probability)
    {
        var map = this.map;
        if (!probability)
            probability = 0.5;
        
        for (var x = 0; x < map.length; x++)
        {
            for (var y = 0; y < map[x].length; y++)
            {
                if ([1, 2, 4, 8].contains(map[x][y]))
                {
                    // check probability
                    if (!this.threshold(probability))
                        continue;
                    
                    var options = [];
                    
                    if (map[x][y] != 1 && y > 0 				&& map[x][y-1] != 0) options.push('up');
                    if (map[x][y] != 2 && x < map.length - 1 	&& map[x+1][y] != 0) options.push('right');
                    if (map[x][y] != 4 && y < map[x].length -1 	&& map[x][y+1] != 0) options.push('down');
                    if (map[x][y] != 8 && x > 0 				&& map[x-1][y] != 0) options.push('left');
                    
                    if (options.length == 0)
                        continue;
                    
                    var option = this.pick_random(options);
                    
                    if (option == 'up')
                    {
                        map[x][y]   = map[x][y] | 1;
                        map[x][y-1] = map[x][y-1] | 4;
                    }
                    if (option == 'right')
                    {
                        map[x][y]   = map[x][y] | 2;
                        map[x+1][y] = map[x+1][y] | 8;
                    }
                    if (option == 'down')
                    {
                        map[x][y]   = map[x][y] | 4;
                        map[x][y+1] = map[x][y+1] | 1;
                    }
                    if (option == 'left')
                    {
                        map[x][y]   = map[x][y] | 8;
                        map[x-1][y] = map[x-1][y] | 2;
                    }
                }
            }
        }
        return this;
    }


    _binary2drawable(source) {
        
        var w = source.length;
        var h = source[0].length;
        var target = this.createMatrix(w, h);
        
        function check(x_, y_) {
            return (x_ >= 0 && x_ < w && y_ >= 0 && y_ < h && source[x_][y_]);
        }
        
        function isArea(x_, y_) {
            return  (check(x_ - 1, y_) && check(x_ - 1, y_ - 1) && check(x_, y_ - 1))  // top left
                ||  (check(x_, y_ - 1) && check(x_ + 1, y_ - 1) && check(x_ + 1, y_))  // top right
                ||  (check(x_ + 1, y_) && check(x_ + 1, y_ + 1) && check(x_, y_ + 1))  // down right
                ||  (check(x_, y_ + 1) && check(x_ - 1, y_ + 1) && check(x_ - 1, y_)); // down left
        }
        
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                
                if (!source[x][y]) {
                    target[x][y] = 0;
                    continue;
                }
                var id = 0;
                
                if (!isArea(x, y)) {
                    
                    // is tunnel
                    if (check(x, y - 1)) id = id | 1;
                    if (check(x + 1, y)) id = id | 2;
                    if (check(x, y + 1)) id = id | 4;
                    if (check(x - 1, y)) id = id | 8;
                }
                else
                {
                    // is Area
                    if (check(x + 1, y) && check(x + 1, y + 1) && check(x, y + 1)) // corner top left
                        id = id | 1;
                    if (check(x - 1, y) && check(x - 1, y + 1) && check(x, y + 1)) // corner top right
                        id = id | 2;
                    if (check(x - 1, y) && check(x - 1, y - 1) && check(x, y - 1)) // corner bottom right
                        id = id | 4;
                    if (check(x, y - 1) && check(x + 1, y - 1) && check(x + 1, y)) // corner bottom left
                        id = id | 8;
                    
                    if      (id == 1)  id = 0;
                    else if (id == 2)  id = 2;
                    else if (id == 3)  id = 1;
                    else if (id == 4)  id = 8;
                    else if (id == 5)  id = 14;
                    else if (id == 6)  id = 5;
                    else if (id == 7)  id = 12;
                    else if (id == 8)  id = 6;
                    else if (id == 9)  id = 3;
                    else if (id == 10) id = 11;
                    else if (id == 11) id = 13;
                    else if (id == 12) id = 7;
                    else if (id == 13) id = 10;
                    else if (id == 14) id = 9;
                    else if (id == 15) id = 4;
                    
                    // is Transition
                    if      (id == 0 && check(x, y - 1) && check(x - 1, y)) id = 16 + 3;
                    else if (id == 2 && check(x, y - 1) && check(x + 1, y)) id = 16 + 7;
                    else if (id == 6 && check(x, y + 1) && check(x - 1, y)) id = 16 + 15;
                    else if (id == 8 && check(x, y + 1) && check(x + 1, y)) id = 16 + 11;
                    else if (id == 0 && check(x, y - 1))					id = 16 + 0;
                    else if (id == 1 && check(x, y - 1))					id = 16 + 1;
                    else if (id == 2 && check(x, y - 1))					id = 16 + 2;
                    else if (id == 6 && check(x, y + 1))					id = 16 + 4;
                    else if (id == 7 && check(x, y + 1))					id = 16 + 5;
                    else if (id == 8 && check(x, y + 1))					id = 16 + 6;
                    else if (id == 0 && check(x - 1, y))					id = 16 + 8;
                    else if (id == 2 && check(x + 1, y))					id = 16 + 9;
                    else if (id == 3 && check(x - 1, y))					id = 16 + 10;
                    else if (id == 6 && check(x - 1, y))					id = 16 + 12;
                    else if (id == 8 && check(x + 1, y))					id = 16 + 13;
                    else if (id == 5 && check(x + 1, y))					id = 16 + 14;
                    
                    id += 16;
                }   
                target[x][y] = id;
            }
        }
        return target;
    }


    _generateOuterMaps(source) {
        
        var w = source.length;
        var h = source[0].length;
        var target = this.createMatrix(w, h);
        
        function check(x_, y_) {
            return (x_ < 0 || x_ >= w || y_ < 0 || y_ >= h || source[x_][y_] == 0);
        }
        
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                
                if (source[x][y]) {
                    target[x][y] = source[x][y];
                    continue;
                }
                var id = 0;
                var next_id = 0;
        
                if (check(x + 1, y) && check(x + 1, y + 1) && check(x, y + 1)) // corner top left
                    id = id | 1;
                if (check(x - 1, y) && check(x - 1, y + 1) && check(x, y + 1)) // corner top right
                    id = id | 2;
                if (check(x - 1, y) && check(x - 1, y - 1) && check(x, y - 1)) // corner bottom right
                    id = id | 4;
                if (check(x, y - 1) && check(x + 1, y - 1) && check(x + 1, y)) // corner bottom left
                    id = id | 8;
                
                if (id == 0)  next_id = -64;
                if (id == 1)  next_id = 0;
                if (id == 2)  next_id = 2;
                if (id == 3)  next_id = 1;
                if (id == 4)  next_id = 8;
                if (id == 5)  next_id = 14;
                if (id == 6)  next_id = 5;
                if (id == 7)  next_id = 12;
                if (id == 8)  next_id = 6;
                if (id == 9)  next_id = 3;
                if (id == 10) next_id = 11;
                if (id == 11) next_id = 13;
                if (id == 12) next_id = 7;
                if (id == 13) next_id = 10;
                if (id == 14) next_id = 9;
                if (id == 15) next_id = 4;
                
                next_id += 64;
                target[x][y] = next_id;
            }
        }
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                source[x][y] = target[x][y];
            }
        }
    }


    _remapSnippets(source) {
        
        var w = source.length;
        var h = source[0].length;
        
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                var id = source[x][y];
                
                if (id == 0 || id > 15)
                    continue;
                
                var next_id = 0;
                if (id == 1)  next_id = 12; // 0001
                if (id == 2)  next_id = 13; // 0010
                if (id == 3)  next_id = 9;  // 0011
                if (id == 4)  next_id = 14; // 0100
                if (id == 5)  next_id = 4;  // 0101
                if (id == 6)  next_id = 1;  // 0110
                if (id == 7)  next_id = 5;  // 0111
                if (id == 8)  next_id = 15; // 1000
                if (id == 9)  next_id = 11; // 1001
                if (id == 10) next_id = 8;  // 1010
                if (id == 11) next_id = 10; // 1011
                if (id == 12) next_id = 3;  // 1100
                if (id == 13) next_id = 7;  // 1101
                if (id == 14) next_id = 2;  // 1110
                if (id == 15) next_id = 6;  // 1111
                
                source[x][y] = next_id;
            }
        }
    }
    
    wipeCurrentMap() {
        for (var x = this._borderWidth; x < $dataMap.width - this._borderWidth; x++) {
            for (var y = this._borderWidth; y < $dataMap.height - this._borderWidth; y++) {
                for (var z = 0; z < 6; z++) {
                    var loc = this.index(x, y, z);
                    this.dataMap.data[loc] = 0;
                }
            }
        }
    }
    
    generate () {
        
        var map = this.map;
        this._remapSnippets(this.map);
        
        this.wipeCurrentMap();
        
        var maps            = ("snippets"               in MK.additionalMaps) ? ["snippets"] : [];
        var mapsArea        = ("snippetsarea"           in MK.additionalMaps) ? ["snippetsarea"] : [];
        var mapsTransitions = ("snippetstransitions"    in MK.additionalMaps) ? ["snippetstransitions"] : [];
        var mapsOuter       = ("snippetsouter"          in MK.additionalMaps) ? ["snippetsouter"] : [];
        
        for (var i = 0; i < 99; i++) {
            if ("snippets" + i in MK.additionalMaps)            maps.push("snippets" + i);
            if ("snippetsarea" + i in MK.additionalMaps)        mapsArea.push("snippetsarea" + i);
            if ("snippetstransitions" + i in MK.additionalMaps) mapsTransitions.push("snippetstransitions" + i);
            if ("snippetsouter" + i in MK.additionalMaps)       mapsOuter.push("snippetsouter" + i);
        }
        
        if (mapsOuter.length > 0)
            this._generateOuterMaps(map);
        
        if (maps.length == 0)
            throw Error("There's no Snippets Map defined to generate dungeon. Please insert at least one snippets map in Space Map's note tags.");
        
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[x].length; y++) {
                
                var id = map[x][y];
                
                if (id < 16)
                    this.placeSnippet(this.pick_random(maps), id, x, y);
                
                if (id >= 16 && id < 32)
                    this.placeSnippet(this.pick_random(mapsArea), id - 16, x, y, 3, 5);
                
                if (id >= 32 && id < 48)
                    this.placeSnippet(this.pick_random(mapsTransitions), id - 32, x, y);
                
                if (id >= 64)
                    this.placeSnippet(this.pick_random(mapsOuter), id - 64, x, y, 3, 5);
            }
        }
        
        return this;
    }
    
    
    getPossibleLocations(r, x1, x2, y1, y2, dataMap) {
        
        if (!r) throw Error ("FATAL: get Possible Locations: No region Id given!");
        
        dataMap = dataMap ? dataMap : this.dataMap;
        x1 = !!x1 ? x1 : 0;
        y1 = !!y1 ? y1 : 0;
        x2 = !!x2 ? x2 : dataMap.width;
        y2 = !!y2 ? y2 : dataMap.height;
        
        var list = [];
        for (var x = x1; x < x2; x++) {
            for (var y = y1; y < y2; y++) {
                if (this.regionId(x, y, dataMap) == r) {
                    list.push({x: x, y: y});
                }
            }
        }
        return list;
    }

    
    getPossibleLocationsByDirection(r, direction) {
        
        if (!direction) direction = "any";
        
        if (!["bottom", "top", "left", "right", "any"].contains(direction))
            throw Error ("direction must be either bottom, top, left, right or any, but was " + direction);
        
        var options = [];
        
        if (direction == "any") {
           options = this.getPossibleLocations(r);
        }
        else {
        
            for (var n = 1; options.length == 0; n++) {
                
                if (direction == "bottom") {
                    var x1 = 0;
                    var x2 = this.dataMap.width;
                    var y1 = this.dataMap.height - (n * this.getSnippetHeight());
                    var y2 = this.dataMap.height;
                }
                if (direction == "top") {
                    var x1 = 0;
                    var x2 = this.dataMap.width;
                    var y1 = 0;
                    var y2 = n * this.getSnippetHeight();
                }
                
                if (direction == "left") {
                    var x1 = 0;
                    var x2 = n * this.getSnippetWidth();
                    var y1 = 0;
                    var y2 = this.dataMap.height;
                }
                
                if (direction == "right") {
                    var x1 = this.dataMap.width - (n * this.getSnippetWidth());
                    var x2 = this.dataMap.width;
                    var y1 = 0;
                    var y2 = this.dataMap.height;
                }
                
                if (x1 < 0 ||
                    x2 > this.dataMap.width ||
                    y1 < 0 ||
                    y2 > this.dataMap.height)
                    break;
                
                options = this.getPossibleLocations(r, x1, x2, y1, y2);
            }
        }
        return options;
    }
    
    
    _choseSpecialLocation(regionId, direction) {
        
        var options = this.getPossibleLocationsByDirection(regionId, direction);
        if (options.length == 0)
            return {x: 0, y: 0};
            //throw Error ("Please ensure that enough spawning points for entrance, for exit OR for the player are set on the snippets.");
        
        return this.pick_random(options);
    }

    _placeSpecialLocation (r, position) {
        
        this._identifyDecoRegions();
        var deco = this._choseSpecialLocation(r, position);
        this.drawDecoration(deco.x, deco.y, r);
        return deco;
    }


    placeEntranceOn (position) {
        
        this._placeSpecialLocation(MK.ENTRANCE_REGION_ID, position);
        return this;
    }

    placeExitOn (position) {
        
        this._placeSpecialLocation(MK.EXIT_REGION_ID, position);
        return this;
    }


    makeWayOut (position) {
        
        var options = [];
        var w = this.getDungeonWidth();
        var h = this.getDungeonHeight();
        var map = this.map;
        
        if (position == "bottom") {
            for (var x = 0; x < w; x++) {
                if (map[x][h - 1] != 0) options.push({x: x, y: h - 1});
            }
        }
        if (position == "right") {
            for (var y = 0; y < h; y++) {
                if (map[w - 1][y] != 0) options.push({x: w - 1, y: y});
            }
        }
        if (position == "left") {
            for (var y = 0; y < h; x++) {
                if (map[0][y] != 0) options.push({x: 0, y: y});
            }
        }
        if (position == "top") {
            for (var x = 0; x < w; x++) {
                if (map[x][0] != 0) options.push({x: x, y: 0});
            }
        }
        
        if (options.length == 0)
            throw Error ("Wanted to transform Frame into Entrance; however there's no available spot to transform.");
        
        var option = this.pick_random(options);   
        var current_id = map[option.x][option.y];
        var next_id;
        
        if (position == "top"    && current_id < 16) next_id = current_id | 1;
        if (position == "right"  && current_id < 16) next_id = current_id | 2;
        if (position == "bottom" && current_id < 16) next_id = current_id | 4;
        if (position == "left"   && current_id < 16) next_id = current_id | 8;
        
        if (position == "top" && current_id >= 16) {
            if (current_id == 16 + 0)  next_id = 32 + 0;
            if (current_id == 16 + 1)  next_id = 32 + 1;
            if (current_id == 16 + 2)  next_id = 32 + 2;
            if (current_id == 32 + 8)  next_id = 32 + 3;
            if (current_id == 32 + 9)  next_id = 32 + 8;
        }
        if (position == "right" && current_id >= 16) {
            if (current_id == 16 + 2)  next_id = 32 + 9;
            if (current_id == 16 + 5)  next_id = 32 + 14;
            if (current_id == 16 + 8)  next_id = 32 + 13;
            if (current_id == 32 + 2)  next_id = 32 + 7;
            if (current_id == 32 + 6)  next_id = 32 + 11;
        }
        if (position == "bottom" && current_id >= 16) {
            if (current_id == 16 + 6)  next_id = 32 + 4;
            if (current_id == 16 + 7)  next_id = 32 + 5;
            if (current_id == 16 + 8)  next_id = 32 + 6;
            if (current_id == 32 + 12) next_id = 32 + 15;
            if (current_id == 32 + 13) next_id = 32 + 11;
        }
        if (position == "left" && current_id >= 16) {
            if (current_id == 16 + 0)  next_id = 32 + 8;
            if (current_id == 16 + 3)  next_id = 32 + 10;
            if (current_id == 16 + 6)  next_id = 32 + 12;
            if (current_id == 32 + 0)  next_id = 32 + 3;
            if (current_id == 32 + 4)  next_id = 32 + 15;
        }
        
        this.map[option.x][option.y] = next_id;
        return this;
    }


    drawDecoration (x, y, regionId) {
        
        var decorationData = this.decorations[regionId];
        var origin_x = decorationData.x;
        var origin_y = decorationData.y;
        var element_width = decorationData.w;
        var element_height = decorationData.h;
        var maxElements = decorationData.n;
        
        var i = this.randomInteger(0, maxElements);
        var x1 = i * element_width + origin_x;
        var y1 = origin_y;
        var x2 = (i+1) * element_width + origin_x - 1;
        var y2 = origin_y + element_height - 1;
        
        this.safelyCopyTiles(
            x,
            y,
            "decoration",
            x1,
            y1,
            x2,
            y2
        );
        this.cloneEventsFromArea(
            x,
            y,
            "decoration",
            x1,
            y1,
            x2,
            y2
        );
    }


    _identifyDecoRegions () {
        
        var decoMapName = "decoration";
        
        if (!(decoMapName in MK.additionalMaps))
            throw Error ("Decoration Map not defined");
        
        var dataMap = MK.additionalMaps[decoMapName];
        var w = dataMap.width;
        var h = dataMap.height;
        this.decorations = {};
        
        function determineDimensions(regionId, y) {
            
            var x_ = 0;
            var y_ = y;
            for (; $dungeonGenerator.regionId(x_, y_, dataMap) == regionId; x_++) { }
            x_ -= 1;
            for (; $dungeonGenerator.regionId(x_, y_, dataMap) == regionId; y_++) { }
            return {w: x_ + 1, h: y_ - y};
        }
        
        function lookForStopper(regionId, y_, w_, h_) {
            // Stopper ID ?
            for (var x_ = 0; x_ < w; x_++) {
                if ($dungeonGenerator.regionId(x_, y_, dataMap) == MK.DECORATION_STOPPER_ID)
                    return Math.floor(x_ / w_) - 1;
            }
            
            for (var n = 1; ((n + 1) * w_ - 1) < w; n++) {
                var x1 = n * w_;
                var y1 = y_;
                var x2 = (n + 1) * w_ - 1;
                var y2 = y_ + h_ - 1;
                
                if ($dungeonGenerator.isAreaEmpty(x1, y1, x2, y2, dataMap))
                    return n - 1;
            }
            
            return 1;
        }
        
        for (var y = 0; y < h; y++) {
            var regionId = this.regionId(0, y, dataMap);
            
            if (regionId in this.decorations)
                continue;
            
            if (regionId) {
                var elementDimensions = determineDimensions(regionId, y);
                var n = lookForStopper(regionId, y, elementDimensions.w, elementDimensions.h);
                
                var elementData = {};
                elementData.regionId = regionId;
                elementData.x = elementDimensions.w;
                elementData.y = y;
                elementData.w = elementDimensions.w;
                elementData.h = elementDimensions.h;
                elementData.n = n;
                
                this.decorations[regionId] = elementData;
            }
        }
    }


    drawDecorations (regionIds) {
        
        this._identifyDecoRegions();
        
        for (var regionId in this.decorations) {
            if (regionIds != null && !regionIds.contains(Number(regionId)))
                continue;
            
            if ([MK.ENTRANCE_REGION_ID, MK.EXIT_REGION_ID, MK.SPAWNING_POINT_REGION_ID].contains(Number(regionId)))
                continue;
            
            for (var loc of this.getPossibleLocations(regionId)) {
                this.drawDecoration(loc.x, loc.y, regionId);
            }
        }
        return this;
    }


    drawDecorationXTimes (regionId, n, m) {
        
        if (!n) n = 1;
        if (!m) m = n;
        n = this.randomInteger(n, m + 1);
        
        if (!regionId) throw Error ("drawDecorationXTimes: regionId not given!");
        
        if (!(regionId in this.decorations))
            throw Error ("Wanted to draw Decoration with id " + regionId + " but this id is not used on decorations Map");
        
        for (var i = 0; i < n; i++) {
            var options = this.getPossibleLocations(regionId);
            if (options.length == 0)
                break;
            
            var option = this.pick_random(options);
            this.drawDecoration(option.x, option.y, regionId);
        }   
        this.eraseRegionId(regionId);
        return this;
    }


    spawnPlayerAt (direction, regionId) {
        
        if (!direction)
            throw Error ("Spawn Player at: No direction given!");
        
        var regionId = regionId ? regionId : MK.SPAWNING_POINT_REGION_ID;
        this.spawnLocation = this._choseSpecialLocation(regionId, direction);
        return this;
    } 


    finalize () {
        
        if (!this.spawnLocation) {
            this.spawnLocation = this._choseSpecialLocation(MK.SPAWNING_POINT_REGION_ID);
        }
        
        this.eraseRegionIdsAndShadows();
        this.injectDataMap(this.dataMap, this.spawnLocation.x, this.spawnLocation.y);
        this.resetAfterFinalize();
    }
    
    injectDataMap(dataMap, spawnX, spawnY) {
        
        dataMap = dataMap ? dataMap : this.dataMap;
        spawnX = spawnX ? spawnX : $gamePlayer.x;
        spawnY = spawnY ? spawnY : $gamePlayer.y;
        
        $dataMap = dataMap;
        $gameMap.updateAllAutoTiles();
        $gameMap._events = [];
        $gamePlayer._needsMapReload = true;
        $gameMap.requestRefresh($gameMap.mapId());
        
        if (typeof mv3d !== 'undefined') {
            mv3d.clearMapCells();
            mv3d.clearMap();
        }
        $gamePlayer.reserveTransfer($gameMap.mapId(), spawnX, spawnY, 0, 2);
    }
    
    eraseRegionIdsAndShadows() {
        this.eraseRegionId(MK.ENTRANCE_REGION_ID);
        this.eraseRegionId(MK.EXIT_REGION_ID);
        this.eraseShadows();
    }
    
    eraseShadows() {
        for (var x = 0; x < this.dataMap.width; x++) {
            for (var y = 0; y < this.dataMap.height; y++) {
                var loc = this.index(x, y, 4);
                this.dataMap.data[loc] = 0;
            }
        }
    }
}

var $dungeonGenerator = new DungeonGenerator();

// =====================================================================================
// Params
// =====================================================================================
class MazeBuilderParams
{
	constructor() {}
	
	cutOffDeadEnds (n) {
		$dungeonGenerator.cutOffDeadEnds(n);
		return this;
	}
	
	mergeDeadEnds (probability) {
		$dungeonGenerator.mergeDeadEnds(probability);
		return this;
	}
	
	generate () {
		$dungeonGenerator.generate();
		return $dungeonGenerator;
	}
    
    makeWayOut (position) {
        $dungeonGenerator.makeWayOut(position);
        return this;
    }
}


class RandomWalkParams
{
	constructor() {
		this._start = "bottom";
		this._exit = "top";
		this._allowGoingBack = true;
		this._allowLargeAreas = true;
		this._allowRevisit = false;
        this._generated = false;
	}
	
	start (direction) {
		this._start = direction;
		return this;
	}
	
	exit (direction) {
		this._exit = direction;
		return this;
	}
	
	allowGoingBack (b) {
		this._allowGoingBack = b;
		return this;
	}
	
	allowLargeAreas (b) {
		this._allowLargeAreas = b;
		return this;
	}
	
	allowRevisit (b) {
		this._allowRevisit = b;
		return this;
	}
	
	generate () {
		
        if (!this._generated)
            $dungeonGenerator.run_randomWalk (this);
		
        $dungeonGenerator.generate();
        this._generated = true;
		return $dungeonGenerator;
	}
    
    makeWayOut (position) {
        if (!this._generated) {
            $dungeonGenerator.run_randomWalk (this);
            this._generated = true;
        }
        $dungeonGenerator.makeWayOut(position);
        return this;
    }
}

if (PluginManager && PluginManager.registerCommand) {
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'borderWidth', args => {
        $dungeonGenerator.borderWidth(Number(args.value));
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'noSeedableRNG', args => {
        $dungeonGenerator.noSeedableRNG();
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'setSeed', args => {
        $dungeonGenerator.setSeed(Number(args.value));
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'Create Classical Maze', args => {
        $dungeonGenerator.prims().generate();
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'Create Maze with Finetuning', args => {
        
        if (args.mode == 'Cut off, then Merge') {
            $dungeonGenerator.prims()
                .cutOffDeadEnds(Number(args.cutOffDeadEnds))
                .mergeDeadEnds(Number(args.mergeDeadEnds))
                .generate();
        } else {
            $dungeonGenerator.prims()
                .mergeDeadEnds(Number(args.mergeDeadEnds))
                .cutOffDeadEnds(Number(args.cutOffDeadEnds))
                .generate();
        }
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'Create Dungeon using Random Walk', args => {
        
        $dungeonGenerator.randomWalk()
            .start(args.Start)
            .exit(args.End)
            .allowRevisit(args.allowRevisit == 'true')
            .generate();
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'Create Road', args => {
        
        $dungeonGenerator.randomWalk()
            .start(args.Start)
            .exit(args.End)
            .allowGoingBack(false)
            .generate();
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'placeEntrance', args => {
        $dungeonGenerator.placeEntranceOn(args.Position);
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'placeExit', args => {
        $dungeonGenerator.placeExitOn(args.Position);
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'spawnPlayerAt', args => {
        $dungeonGenerator.spawnPlayerAt(args.direction, Number(args.regionId));
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'drawDecorations', args => {
        var ids = args.Ids ? [] : null;
        if (args.Ids) {
            for (var id of args.Ids.split(',')) {
                ids.push(Number(id));
            }
        }
        $dungeonGenerator.drawDecorations(ids);
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'drawDecorationXTimes', args => {
        $dungeonGenerator.drawDecorationXTimes(Number(args.Id), Number(args.min), Number(args.max));
    });
    
    PluginManager.registerCommand('MK_RandomGenerate_Dungeon', 'finalize', args => {
        $dungeonGenerator.finalize();
    });
}