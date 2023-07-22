import { rm } from "./lunalite-pixi-mz";
import { Scene_Base } from './rmmz_scenes';
import { Bitmap } from './rmmz_core';

/**
 * Manages the game data: saving, loading, meta data,
 * and map information.
 */
declare class DataManager {
    protected constructor();
    static _globalId: string;
    static _lastAccessId: number;
    static _errorUrl: any;
    static _databaseFiles: JSON[];
    static loadDatabase(): void;
    static loadDataFile(name: string, src: string): void;
    static isDatabaseLoaded(): boolean;
    static loadMapData(mapId: number): void;
    static makeEmptyMap(): void;
    static isMapLoaded(): boolean;
    static onLoad(object: any): void;
    /**
     * Extracts Meta Data. A Json Like Object
     * @param data
     */
    static extractMetaData(data: any): void;
    static checkError(): void;
    static isBattleTest(): boolean;
    static isEventTest(): boolean;
    /**
     * Returns a Bool value given an item.
     * Item being a database object representing a skill.
     * @static
     * @param {object} item
     * @returns {boolean}
     * @memberof DataManager
     */
    static isSkill(item: RPG_BaseItem): boolean;
    /**
     * Returns a Bool value given an item.
     * Item must be a database item to be true.
     * @static
     * @param {object} item
     * @returns {boolean}
     * @memberof DataManager
     */
    static isItem(item: RPG_BaseItem): boolean;
    /**
     * Returns a Bool value given an item.
     * Item must be a database weapon to be true.
     * @static
     * @param {object} item
     * @returns {boolean}
     * @memberof DataManager
     */
    static isWeapon(item: RPG_BaseItem): boolean;
    /**
     * Returns a Bool value given an item.
     * Item must be a database armor to be true.
     * @static
     * @param {object} item
     * @returns {boolean}
     * @memberof DataManager
     */
    static isArmor(item: RPG_BaseItem): boolean;
    static createGameObjects(): void;
    static setupNewGame(): void;
    static setupBattleTest(): void;
    static setupEventTest(): void;
    static loadGlobalInfo(): void;
    /**
     * JSON like object
     * @param info
     */
    static saveGlobalInfo(info: any): void;
    /**
     * Returns a Bool value given a savefileId.
     * If the savefileId exists; the value will be true.
     * @static
     * @param {number} savefileId
     * @returns {boolean}
     * @memberof DataManager
     */
    static isThisGameFile(savefileId: number): boolean;
    static isAnySavefileExists(): boolean;
    static latestSavefileId(): number;
    static loadAllSavefileImages(): void;
    /**
     * JSON Like Object for save file images
     */
    static loadSavefileImages(info: any): void;
    /**
     * Returns the maximum number of save files
     * allocated in the game.
     * @static
     * @returns {number}
     * @memberof DataManager
     */
    static maxSavefiles(): number;
    static isMapObject(object: any): boolean;
    /**
     * Saves the RPGMakerMV game given a savefileId.
     * Returns true if successful.
     * @static
     * @param {number} savefileId
     * @returns {boolean}
     * @memberof DataManager
     */
    static saveGame(savefileId: number): Promise<any>;
    static loadGame(savefileId: number): Promise<any>;
    static makeSavename(savefileId: number): string;
    /**
     * Returns the last accessed save fileId upon
     * saving or loading the game.
     * @static
     * @returns {number}
     * @memberof DataManager
     */
    static lastAccessedSavefileId(): number;
    static saveGameWithoutRescue(savefileId: number): boolean;
    static loadGameWithoutRescue(savefileId: number): boolean;
    static selectSavefileForNewGame(): void;
    /**
     * Creates a new save file on the global
     * save file information containing important
     * data such as play time, characters, timestamp.
     * @static
     * @memberof DataManager
     */
    static makeSavefileInfo(): void;
    /**
     * Creates the save file contents when saving your game.
     * Good for aliasing when you want to add more data
     * to the game's save contents.
     * @static
     * @returns {object}
     * @memberof DataManager
     */
    static makeSaveContents(): any;
    /**
     * Extracts the save file contents into the game's
     * variables. An excellent method to alias when you
     * wish to extend the game's save contents for a plugin.
     * @static
     * @param {object} contents
     * @memberof DataManager
     */
    static extractSaveContents(contents: any): void;
}

/**
 * Manages the configuration of RPGMakerMZ Config Data.
 */
declare class ConfigManager {
    protected constructor();

    /**
     * Loads the content global configuration associated with the project.
     */
    static load(): void;
    static save(): void;
    static makeData(): rm.types.ConfigData;
    static applyData(config: rm.types.ConfigData): void;
    static readFlag(config: rm.types.ConfigData, name: string): boolean;
    static readVolume(config: rm.types.ConfigData, name: string): number;
}

/**
 * The static class that manages storage of save game data.
 */
declare class StorageManager {
    protected constructor();
    static saveObject(saveName: string, object: any): Promise<any>;

    /**
     * Loads an object from configuration.
     * @param object
     */
    static loadObject(object: any): Promise<any>;
    static objectToJson(object: any): Promise<any>;
    static jsonToObject(json: JSON): Promise<any>;
    static jsonToZip(json: JSON): Promise<any>;
    static zipToJson(zip: any): Promise<any>;
    static saveZip(saveName: string, zip: any): Promise<any>;
    static loadZip(saveName: string, zip: any): Promise<any>;
    static saveToForage(saveName: string): Promise<any>;
    static loadFromForage(saveName: string): Promise<any>;
    static forageExists(saveName: string): boolean;
    static removeForage(saveName: string): Promise<any>;
    static updateForageKeys(): Promise<any>;
    static forageKeysUpdated(): boolean;
    static fsMkdir(path: string): void;
    static fsRename(oldPath: string, newPath: string): void;
    static fsUnlink(path: string): void;
    static fsReadFile(path: string): void;
    static fsWriteFile(path: string, data: any): void;
    static fileDirectoryPath(): string;
    static filePath(): string;
    static forageKey(): string;
    static forageTestKey(): string;
    static save(savefileId: number, json: string): void;
    static load(savefileId: number): string;
    static exists(savefileId: number): boolean;
    static remove(savefileId: number): void;
    static backup(savefileId: number): void;
    static backupExists(savefileId: number): boolean;
    static cleanBackup(savefileId: number): boolean;
    static restoreBackup(savefileId: number): void;
    static isLocalMode(): boolean;
    static saveToLocalFile(savefileId: number, json: string): void;
    static loadFromLocalFile(savefileId: number): string;
    static loadFromLocalBackupFile(savefileId: number): string;
    static localFileBackupExists(savefileId: number): boolean;
    static localFileExists(savefileId: number): boolean;
    static removeLocalFile(savefileId: number): void;
    static saveToWebStorage(savefileId: number, json: string): void;
    static loadFromWebStorage(savefileId: number): string;
    static loadFromWebStorageBackup(savefileId: number): string;
    static webStorageBackupExists(savefileId: number): boolean;
    static webStorageExists(savefileId: number): boolean;
    static removeWebStorage(savefileId: number): void;
    static localFileDirectoryPath(): string;
    static localFilePath(savefileId: number): string;
    static webStorageKey(savefileId: number): string;
}

/**
 * Hello font manager.
 */
declare class FontManager {
    /**
     * hello world.
     */
    _urls: any;
}

/**
 * Static class that manages images. Loading the images
 * and create bitmap objects.
 */
declare class ImageManager {
    protected constructor();

    /**
     * The standardized icon width.
     */
    static iconWidth: number;

    /**
     * The standardized icon height.
     */
    static iconHeight: number;

    /**
     * The standardized face width.
     */
    static faceWidth: number;

    /**
     * The standardized face height.
     */
    static faceHeight: number;

    /**
     * A cache used for storing images.
     * @type {Map<string, any>}
     */
    static _cache: { [key: string]: any };

    /**
     * A cache used for storing important things.
     * @type {Map<string, any>}
     */
    static _system: { [key: string]: any };

    /**
     * An empty bitmap.
     */
    static _emptyBitmap: Bitmap;
    /**
     * Loads the bitmap from url and returns it.
     * @param url
     * @return Bitmap
     */
    static loadBitmapFromUrl(url: string): Bitmap;
    /**
     * Throws a load error and retries loading the bitmap.
     * @param bitmap
     */
    static throwLoadError(bitmap: Bitmap): void;
    static loadFace(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/parallaxes/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadParallax(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/pictures/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadPicture(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/animations/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadAnimation(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/battlebacks1/' folder
     *  and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadBattleback1(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/battlebacks2/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadBattleback2(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/enemies/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadEnemy(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/characters/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadCharacter(filename: string, hue?: number): Bitmap;
    static loadSvActor(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/sv_enemies/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadSvEnemy(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from 'img/system/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadSystem(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/tilesets/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadTileset(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/titles1/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadTitle1(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from the 'img/titles2/' folder
     * and returns it.
     * @param {string} filename
     * @param {number} [hue]
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadTitle2(filename: string, hue?: number): Bitmap;
    /**
     * Loads a Bitmap object from any folder and returns it.
     *
     * @param {string} folder
     * @param {string} filename
     * @param {number} hue
     * @param {boolean} smooth
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadBitmap(folder: string, filename: string, hue: number, smooth: boolean): Bitmap;
    /**
     * Loads an empty Bitmap object and returns it.
     *
     * @param {string} path
     * @param {number} hue
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadEmptyBitmap(path: string, hue: number): Bitmap;
    /**
     * Loads a Bitmap object given a path
     * and returns it.
     * @param {string} path
     * @param {number} hue
     * @returns {Bitmap}
     * @memberof ImageManagerStatic
     */
    static loadNormalBitmap(path: string, hue: number): Bitmap;
    /**
     * Clears the image cache in RPGMakerMV.
     *
     * @memberof ImageManagerStatic
     */
    static clear(): void;
    /**
     * Returns true if the image cache
     * is ready.
     * @returns {boolean}
     * @memberof ImageManagerStatic
     */
    static isReady(): boolean;
    /**
     * Returns true if the given filename
     * is an object character. Must contain
     * a  '!' in the file name to be an
     * object character.
     * @param {string} filename
     * @returns {boolean}
     * @memberof ImageManagerStatic
     */
    static isObjectCharacter(filename: string): boolean;
    /**
     * Returns true if the given filename is
     * a large character. Must contain a '$'
     * in the file name to be a large character.
     * @param {string} filename
     * @returns {boolean}
     * @memberof ImageManagerStatic
     */
    static isBigCharacter(filename: string): boolean;
    static isZeroParallax(filename: string): boolean;
}

/**
 * Static class that manages plugins
 */
declare class PluginManager {
    protected constructor();
    static _path: string;
    static _scripts: string[];
    static _errorUrls: string[];
    static setup(plugins: rm.types.PluginSettings[]): void;
    static checkErrors(): void;
    /**
     * Returns all of the plugin parameters for an RPGMakerMZ
     * plugin in a JSON Like String Format.
     * Should typedef this for ease of parsing.
     * @param name
     * @return Any
     */
    static parameters(name: string): any;
    /**
     * Uses internally by the Plugin Manager to load
     * the plugin scripts.
     * @param name
     */
    static loadScript(name: string): void;
    static onError(e: Event): void;
    /**
     * Registers a new plugin command in MZ using a function expression.
     * @param pluginName
     * @param commandName
     * @param func
     */
    static registerCommand(pluginName: string, commandName: string, func: (arg0: any) => void): void;
}

/**
 * Manages the scenes of the game.
 */
declare class SceneManager {
    protected constructor();
    static _scene: Scene_Base;
    static _nextScene: Scene_Base;
    static _stack: any[];
    static _screenWidth: number;
    static _screenHeight: number;
    static _backgroundBitmap: Bitmap;
    static _boxWidth: number;
    static _boxHeight: number;
    static _deltaTime: number;
    static _currentTime: number;
    static _accumulator: number;
    static preferableRendererType(): string;
    static shouldUseCanvasRenderer(): boolean;
    static initialize(): void;
    static initGraphics(): void;
    static initAudio(): void;
    static initInput(): void;
    static initNwjs(): void;
    static update(): void;
    static terminate(): void;
    static tickStart(): void;
    static tickEnd(): void;
    static changeScene(): void;
    static updateScene(): void;
    static renderScene(): void;
    static onSceneCreate(): void;
    static onSceneStart(): void;
    static onSceneLoading(): void;
    static onError(e: Event): void;
    static onKeyDown(event: KeyboardEvent): void;
    static catchException(e: Event): void;
    static isSceneChanging(): boolean;
    static isCurrentSceneBusy(): boolean;
    static isCurrentSceneStarted(): boolean;
    static isNextScene(sceneClass: any): boolean;
    static isPreviousScene(sceneClass: any): boolean;
    /**
     * Goes to the scene passed in.
     * @param sceneClass
     */
    static goto(sceneClass: any): void;
    /**
     * Pushes the scene passed in to the scene stack.
     * Immediately goes to the scene passed in.
     * @param sceneClass
     */
    static push(sceneClass: any): void;
    /**
     * Pops the current scene from the stack.
     */
    static pop(): void;
    /**
     * Exits the current scene.
     */
    static exit(): void;
    static clearStack(): void;
    /**
     * Stops the current scene.
     */
    static stop(): void;
    static prepareNextScene(): void;
    static snap(): Bitmap;
    static snapForBackground(): void;
    static backgroundBitmap(): Bitmap;
    static updateManagers(ticks: number, delta: number): void;
    static showDevTools(): void;
}

/**
 * Static class that plays sound effects defined in the database.
 */
declare class SoundManager {
    protected constructor();
    static preloadImportantSounds(): void;
    static loadSystemSound(databaseNumber: number): void;
    static playSystemSound(databaseNumber: number): void;
    static playCursor(): void;
    static playOk(): void;
    static playCancel(): void;
    static playBuzzer(): void;
    static playEquip(): void;
    static playSave(): void;
    static playLoad(): void;
    static playBattleStart(): void;
    static playEscape(): void;
    static playEnemyAttack(): void;
    static playEnemyDamage(): void;
    static playEnemyCollapse(): void;
    static playBossCollapse1(): void;
    static playBossCollapse2(): void;
    static playActorDamage(): void;
    static playActorCollapse(): void;
    static playRecovery(): void;
    static playMiss(): void;
    static playEvasion(): void;
    static playMagicEvasion(): void;
    static playReflection(): void;
    static playShop(): void;
    static playUseItem(): void;
    static playUseSkill(): void;
}

/**
 * Static class that handles BGM, BGS, ME, and SE.
 */
declare class AudioManager {
    protected constructor();
    static _bgmVolume: number;
    static _bgsVolume: number;
    static _meVolume: number;
    static _seVolume: number;
    static _currentBgm: rm.types.AudioParameters;
    static _currentBgs: rm.types.AudioParameters;
    static _bgmBuffer: HTML5Audio;
    static _bgsBuffer: HTML5Audio;
    static _meBuffer: HTML5Audio;
    static _seBuffers: HTML5Audio[];
    static _staticBuffers: HTML5Audio[];
    static _replayFadeTime: number;
    static _path: string;
    static _blobUrl: string;
    static bgmVolume: number;
    static bgsVolume: number;
    static meVolume: number;
    static seVolume: number;
    static playBgm(bgm: rm.types.AudioParameters, pos?: number): void;
    static replayBgm(bgm: rm.types.AudioParameters): void;
    static isCurrentBgm(bgm: rm.types.AudioParameters): boolean;
    static updateBgmParameters(bgm: rm.types.AudioParameters): void;
    static pdateCurrentBgm(bgm: rm.types.AudioParameters, pos: number): void;
    static stopBgm(): void;
    static fadeOutBgm(duration: number): void;
    static fadeInBgm(duration: number): void;
    static playBgs(bgs: rm.types.AudioParameters, pos?: number): void;
    static replayBgs(bgs: rm.types.AudioParameters): void;
    static isCurrentBgs(bgs: rm.types.AudioParameters): boolean;
    static updateBgsParameters(bgs: rm.types.AudioParameters): void;
    static updateCurrentBgs(bgs: rm.types.AudioParameters, pos: number): void;
    static stopBgs(): void;
    static fadeOutBgs(duration: number): void;
    static fadeInBgs(duration: number): void;
    static playMe(me: rm.types.AudioParameters): void;
    static updateMeParameters(me: rm.types.AudioParameters): void;
    static fadeOutMe(duration: number): void;
    static stopMe(): void;
    static playSe(se: rm.types.AudioParameters): void;
    static updateSeParameters(buffer: rm.types.AudioParameters, se: rm.types.AudioParameters): void;
    static stopSe(): void;
    static playStaticSe(se: rm.types.AudioParameters): void;
    static loadStaticSe(se: rm.types.AudioParameters): void;
    static isStaticSe(se: rm.types.AudioParameters): boolean;
    static stopAll(): void;
    static saveBgm(): rm.types.AudioParameters;
    static saveBgs(): rm.types.AudioParameters;
    static makeEmptyAudioObject(): rm.types.AudioParameters;
    static createBuffer(): HTML5Audio;
    static updateBufferParameters(buffer: rm.types.AudioParameters, configVolume: number, audio: rm.types.AudioParameters): void;
    static audioFileExt(): string;
    static shouldUseHtml5Audio(): string;
    static checkErrors(): void;
    static checkWebAudioError(webAudio?: HTML5Audio): void;
    static playEncryptedBgm(bgm: rm.types.AudioParameters, pos?: number): void;
    static createDecryptBuffer(url: string, bgm: rm.types.AudioParameters, pos?: number): void;
}

/**
 * The static class that handles terms and messages.
 * This is linked to the terms and information
 * contained within the editor.
 */
declare class TextManager {
    protected constructor();
    static currencyUnit: string;
    static level: string;
    static levelA: string;
    static hp: string;
    static hpA: string;
    static mp: string;
    static mpA: string;
    static tp: string;
    static tpA: string;
    static exp: string;
    static expA: string;
    static fight: string;
    static escape: string;
    static attack: string;
    static guard: string;
    static item: string;
    static skill: string;
    static equip: string;
    static status: string;
    static formation: string;
    static save: string;
    static gameEnd: string;
    static options: string;
    static weapon: string;
    static armor: string;
    static keyItem: string;
    static equip2: string;
    static optimize: string;
    static clear: string;
    static newGame: string;
    static continue_: string;
    static toTitle: string;
    static cancel: string;
    static buy: string;
    static sell: string;
    static alwaysDash: string;
    static commandRemember: string;
    static bgmVolume: string;
    static bgsVolume: string;
    static meVolume: string;
    static seVolume: string;
    static possession: string;
    static expTotal: string;
    static expNext: string;
    static saveMessage: string;
    static loadMessage: string;
    static file: string;
    static partyName: string;
    static emerge: string;
    static preemptive: string;
    static surprise: string;
    static escapeStart: string;
    static escapeFailure: string;
    static victory: string;
    static defeat: string;
    static obtainExp: string;
    static obtainGold: string;
    static obtainItem: string;
    static levelUp: string;
    static obtainSkill: string;
    static useItem: string;
    static criticalToEnemy: string;
    static criticalToActor: string;
    static actorDamage: string;
    static actorRecovery: string;
    static actorGain: string;
    static actorLoss: string;
    static actorDrain: string;
    static actorNoDamage: string;
    static actorNoHit: string;
    static enemyDamage: string;
    static enemyRecovery: string;
    static enemyGain: string;
    static enemyLoss: string;
    static enemyDrain: string;
    static enemyNoDamage: string;
    static enemyNoHit: string;
    static evasion: string;
    static magicEvasion: string;
    static magicReflection: string;
    static counterAttack: string;
    static substitute: string;
    static buffAdd: string;
    static debuffAdd: string;
    static buffRemove: string;
    static actionFailure: string;
    static basic(basicId: number): string;
    static param(paramId: number): string;
    static command(commandId: number): string;
    static message(messageId: string): string;
    static getter(method: string, param: number): string;
}

declare class ColorManager {
    protected constructor();
    _windowSkin: Bitmap;
    /**
     * Loads the window skin into ColorManager.
     */
    static loadWindowSkin(): void;
    /**
     * Loads the text color using the window skin color Index.
     * @param windowSkinColorIndex
     * @returns Color
     */
    static textColor(windowSkinColorIndex: number): rm.types.Color;
    /**
     * Uses the normal color, index 0
     * of the window skin.
     */
    static normalColor(): rm.types.Color;
    /**
     * Uses the system color; index 16 on the window skin.
     * @return Color
     */
    static systemColor(): rm.types.Color;
    /**
     * Uses the crisis color; index 17 on the window skin.
     * @return Color
     */
    static crisisColor(): rm.types.Color;
    /**
     * Uses the death color; index 18 on the window skin.
     * @return Color
     */
    static deathColor(): rm.types.Color;
    /**
     * Uses the  gauge back color; index 19 on the window skin.
     * @return Color
     */
    static gaugeBackColor(): rm.types.Color;
    /**
     * Uses the hp gauge color 1. Index 20 on the window skin.
     * @return Color
     */
    static hpGaugeColor1(): rm.types.Color;
    /**
     * Uses the hp guage color 2. Index 21 on the window skin.
     * @return Color
     */
    static hpGaugeColor2(): rm.types.Color;
    /**
     * Uses the mp gauge color 1. Index 22 on the window skin.
     * @return Color
     */
    static mpGaugeColor1(): rm.types.Color;
    /**
     * Uses the mp gauge color 2. Index 23 on the window skin.
     * @return Color
     */
    static mpGaugeColor2(): rm.types.Color;
    /**
     * Uses the mp cost color. Index 23 on the window skin.
     * @return Color
     */
    static mpCostColor(): rm.types.Color;
    /**
     * Uses the power up color. Index 24 on the window skin.
     * @return Color
     */
    static powerUpColor(): rm.types.Color;
    /**
     * Uses the power down color. Index 25 on the window skin.
     * @return Color
     */
    static powerDownColor(): rm.types.Color;
    /**
     * Uses the ct gauge color 1. Index 26 on the window skin.
     * @return Color
     */
    static ctGaugeColor1(): rm.types.Color;
    /**
     * Uses the ct gauge color 2. Index 27 on the window skin.
     * @return Color
     */
    static ctGaugeColor2(): rm.types.Color;
    /**
     * Uses the tp gauge color 1. Index 28 on the window skin.
     * @return Color
     */
    static tpGaugeColor1(): rm.types.Color;
    /**
     * Uses the tp gauge color 2. Index 29 on the window skin.
     * @return Color
     */
    static tpGaugeColor2(): rm.types.Color;
    /**
     * Uses the tp cost color. Index 29 on the window skin.
     * @return Color
     */
    static tpCostColor(): rm.types.Color;
    /**
     * Uses the pending color.
     * @return Color
     */
    static pendingColor(): rm.types.Color;
    /**
     * Given the actor status the color is different.
     * Alive -> Normal Color
     * Dying -> Crisis Color
     * Dead -> Death Color
     * If it's not an actor, it returns the normal color.
     * @param actor
     * @return Color
     */
    static hpColor(actor: Game_Actor): rm.types.Color;
    /**
     * Based on actor; currently returns normal color.
     * @return Color
     */
    static mpColor(): rm.types.Color;
    /**
     * Based on actor; currently returns normal color.
     * @return Color
     */
    static tpColor(): rm.types.Color;
    /**
     * This returns the text color based on change.
     * change > 0 -> Power Up Color
     * change < 0 -> Power Down Color
     * else -> Normal color.
     * @param change
     * @return Color
     */
    static paramChangeTextColor(change: number): rm.types.Color;
    /**
     * Returns the color based on Color Type.
     * 0 -> HP Damage Color
     * 1 -> HP Recover Color
     * 2 -> MP Damage Color
     * 3 -> MP Recover Color
     * Number -> Default Color
     * @param colorType
     * @return Color
     */
    static damageColor(colorType: rm.types.DamageColorType): rm.types.Color;
    /**
     * Returns the color "rgba(0, 0, 0, 0.6)"
     * @return Color
     */
    static outlineColor(): rm.types.Color;
    /**
     * Returns the color "rgba(0, 0, 0, 0.6)"
     * @return Color
     */
    static dimColor1(): rm.types.Color;
    /**
     * Returns the color "rgba(0, 0, 0, 0)"
     * @return Color
     */
    static dimColor2(): rm.types.Color;
    /**
     * Returns the color "rgba(32, 32, 32, 0.5)"
     * @return Color
     */
    static itemBackColor1(): rm.types.Color;
    /**
     * Returns the color "rgba(0, 0, 0, 0.5)"
     * @return Color
     */
    static itemBackColor2(): rm.types.Color;
}

declare class EffectManager {
    protected constructor();
    static _cache: { [key: string]: any };
    static _errorUrls: any[];
    /**
     * Load the Effect from a file.
     * @param fileName
     * @return Effect
     */
    static load(fileName: string): any;
    /**
     * Starts loading  the Effect from URL
     * @param url
     * @return Effect
     */
    static startLoading(url: string): any;
    /**
     * Clears the cache and releases the Effect from
     * Graphics.
     */
    static clear(): void;
    /**
     * Not Implemented
     */
    static onLoad(): void;
    /**
     * Makes a url to an Effekseer file.
     * @param fileName
     * @return String
     */
    static makeUrl(fileName: string): string;
    /**
     * Checks the error in the errorUrls.
     */
    static checkErrors(): void;
    /**
     * Throws the loading error.
     * @param url
     */
    static throwLoadError(url: string): void;
    /**
     * Returns true if the EffectManager is ready.
     * @return Bool
     */
    static isReady(): boolean;
}
