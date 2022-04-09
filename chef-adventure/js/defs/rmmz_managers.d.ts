import {rm} from "./lunalite-pixi-mz";

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
     * @returns {Bool}
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
     * @returns {Bool}
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