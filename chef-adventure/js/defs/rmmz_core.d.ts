import './pixi.d.ts';
import {
    Game_Actors,
    Game_Map, Game_Message, Game_Party,
    Game_Player, Game_Screen, Game_SelfSwitches,
    Game_Switches, Game_System, Game_Temp, Game_Timer, Game_Troop, Game_Variables,
} from "./rmmz_objects";
import {ImageManager} from "./rmmz_managers";
import {rm} from "./lunalite-pixi-mz";

/** @global RPGMaker Plugin's Object */
declare var $plugins: rm.types.PluginSettings[];

/** @global Database Actor data. */
declare var $dataActors: RPG_Actor[];

/** @global Database Class data. */
declare var $dataClasses: RPG_Class[];

/** @global Database Skill data. */
declare var $dataSkills: RPG_Skill[];

/** @global Database Item data. */
declare var $dataItems: RPG_Item[];

/** @global Database Weapon data. */
declare var $dataWeapons: RPG_Weapon[];

/** @global Database Armor data. */
declare var $dataArmors: RPG_Armor[];

/** @global Database Enemy data. */
declare var $dataEnemies: RPG_Enemy[];

/** @global Database Troop data. */
declare var $dataTroops: Array<rm.types.Troop>;

/** @global Database State data. */
declare var $dataStates: RPG_State[];

/** @global Database Animation data. */
declare var $dataAnimations: Array<rm.types.Animation>;

/** @global Database Tileset data. */
declare var $dataTilesets: Array<rm.types.Tileset>;

/** @global Database CommonEvent data. */
declare var $dataCommonEvents: Array<rm.types.CommonEvent>;

/** @global Database System data. */
declare var $dataSystem: System;

/** @global Database MapInfo data. */
declare var $dataMapInfos: MapInfo[];

/** @global Database Map data for the current map. */
declare var $dataMap: Map;

/** @global Database Temporary game data; not saved with the game. */
declare var $gameTemp: Game_Temp;

/** @global Database Game System data; saved with the game.
 * @type {Game_Temp}
 */
declare var $gameSystem: Game_System;

/** @global Game Screen; contains properties and methods
 * for adjusting the game screen.
 * @type {Game_Screen}
 */
declare var $gameScreen: Game_Screen;

declare var $gameTimer: Game_Timer;

/** @global The Game Message; contains properties and methods
 * for displaying messages in the game message window.
 * @type {Game_Message}
 */
declare var $gameMessage: Game_Message;

/** @global The Game Switches; contains properties and methods
 * for modifying in game switches while the game is running.
 * These are boolean values: true or false.
 * @type {Game_Switches}
 */
declare var $gameSwitches: Game_Switches;

/** @global The Game Variables; contains properties and methods
 * for modifying the values of game variables.
 * The variables can contain anything.
 * @type {Game_Variables}
 */
declare var $gameVariables: Game_Variables;

declare var $gameSelfSwitches: Game_SelfSwitches;

declare var $gameActors: Game_Actors;

/** @global The Game Party; contains properties and methods
 * for interacting with the game party. Some of the methods include
 * number of party members, etc.
 * @type {Game_Party}
 */
declare var $gameParty: Game_Party;

/** @global The Game Troop; contains properties and methods
 * for interacting with the game troops. Some of the methods include
 * enemy data, enemy names, etc.
 * @type {Game_Troop}
 */
declare var $gameTroop: Game_Troop;

/** @global The Game Map; contains properties and methods
 * for interacting with the game map. Some of these methods include
 * interacting with the map's game_interpreter, and event information.
 * @type {Game_Map}
 */
declare var $gameMap: Game_Map;

/** @global The Game Player; contains properties and methods
 * for interacting with the game player. Some of these methods
 * include interacting with the player's position and move route.
 * @type {Game_Player}
 */
declare var $gamePlayer: Game_Player;

declare var $testEvent: Array<rm.types.EventCommand>;

/**
 * Allows you to map pixels to the screen or draw rectangles.
 */
declare class Bitmap {
    /**
     * The basic object that represents an image.
     *
     * @class Bitmap
     * @constructor
     * @param {number} width The width of the bitmap
     * @param {number} height The height of the bitmap
     */
    constructor(width?: number, height?: number);

    /**
     * The face name of the font.
     *
     * @property fontFace
     * @type String
     */
    fontFace: string;
    /**
     * The size of the font in pixels.
     *
     * @property fontSize
     * @type {number}
     */
    fontSize: number;
    /**
     * Whether the font is italic.
     *
     * @property fontItalic
     * @type Boolean
     */
    fontItalic: boolean;
    /**
     * Whether the font is bold.
     *
     * @property fontBold
     * @type Boolean
     */
    fontBold: boolean;
    /**
     * The color of the text in CSS format.
     *
     * @property textColor
     * @type String
     */
    textColor: string;
    /**
     * The color of the outline of the text in CSS format.
     *
     * @property outlineColor
     * @type String
     */
    outlineColor: string;
    /**
     * The width of the outline of the text.
     *
     * @property outlineWidth
     * @type {number}
     */
    outlineWidth: number;
    /**
     * [read-only] The url of the image file.
     *
     * @property url
     * @type String
     */
    url: string;
    /**
     * [read-only] The base texture that holds the image.
     *
     * @property baseTexture
     * @type PIXI.BaseTexture
     */
    baseTexture: PIXI.BaseTexture;
    /**
     * [read-only] The bitmap canvas.
     *
     * @property canvas
     * @type HTMLCanvasElement
     */
    canvas: HTMLCanvasElement;
    /**
     * [read-only] The 2d context of the bitmap canvas.
     *
     * @property context
     * @type CanvasRenderingContext2D
     */
    context: CanvasRenderingContext2D;
    /**
     * [read-only] The width of the bitmap.
     *
     * @property width
     * @type {number}
     */
    width: number;
    /**
     * [read-only] The height of the bitmap.
     *
     * @property height
     * @type {number}
     */
    height: number;
    /**
     * [read-only] The rectangle of the bitmap.
     *
     * @property rect
     * @type Rectangle
     */
    rect: Rectangle;
    /**
     * Whether the smooth scaling is applied.
     *
     * @property smooth
     * @type Boolean
     */
    smooth: boolean;
    /**
     * The opacity of the drawing object in the range (0, 255).
     *
     * @property paintOpacity
     * @type {number}
     */
    paintOpacity: number;
    /**
     * Cache entry, for images. In all cases _url is the same as cacheEntry.key
     * @type CacheEntry
     */
    cacheEntry: CacheEntry;

    /**
     * Checks whether the bitmap is ready to render.
     *
     * @method isReady
     * @return {Boolean} True if the bitmap is ready to render
     */
    isReady(): boolean;

    /**
     * Checks whether a loading error has occurred.
     *
     * @method isError
     * @return {Boolean} True if a loading error has occurred
     */
    isError(): boolean;

    /**
     * Resizes the bitmap.
     *
     * @method resize
     * @param {number} width The new width of the bitmap
     * @param {number} height The new height of the bitmap
     */
    resize(width: number, height: number): void;

    /**
     * Performs a block transfer.
     *
     * @method blt
     * @param {Bitmap} source The bitmap to draw
     * @param {number} sx The x coordinate in the source
     * @param {number} sy The y coordinate in the source
     * @param {number} sw The width of the source image
     * @param {number} sh The height of the source image
     * @param {number} dx The x coordinate in the destination
     * @param {number} dy The y coordinate in the destination
     * @param {number} [dw=sw] The width to draw the image in the destination
     * @param {number} [dh=sh] The height to draw the image in the destination
     */
    blt(source: Bitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw?: number, dh?: number): void;

    /**
     * Returns pixel color at the specified point.
     *
     * @method getPixel
     * @param {number} x The x coordinate of the pixel in the bitmap
     * @param {number} y The y coordinate of the pixel in the bitmap
     * @return {String} The pixel color (hex format)
     */
    getPixel(x: number, y: number): string;

    /**
     * Returns alpha pixel value at the specified point.
     *
     * @method getAlphaPixel
     * @param {number} x The x coordinate of the pixel in the bitmap
     * @param {number} y The y coordinate of the pixel in the bitmap
     * @return {String} The alpha value
     */
    getAlphaPixel(x: number, y: number): string;

    /**
     * Clears the specified rectangle.
     *
     * @method clearRect
     * @param {number} x The x coordinate for the upper-left corner
     * @param {number} y The y coordinate for the upper-left corner
     * @param {number} width The width of the rectangle to clear
     * @param {number} height The height of the rectangle to clear
     */
    clearRect(x: number, y: number, width: number, height: number): void;

    /**
     * Clears the entire bitmap.
     *
     * @method clear
     */
    clear(): void;

    /**
     * Fills the specified rectangle.
     *
     * @method fillRect
     * @param {number} x The x coordinate for the upper-left corner
     * @param {number} y The y coordinate for the upper-left corner
     * @param {number} width The width of the rectangle to clear
     * @param {number} height The height of the rectangle to clear
     * @param {String} color The color of the rectangle in CSS format
     */
    fillRect(x: number, y: number, width: number, height: number, color: string): void;

    /**
     * Fills the entire bitmap.
     *
     * @method fillAll
     * @param {String} color The color of the rectangle in CSS format
     */
    fillAll(color: string): void;

    /**
     * Draws the rectangle with a gradation.
     *
     * @method gradientFillRect
     * @param {number} x The x coordinate for the upper-left corner
     * @param {number} y The y coordinate for the upper-left corner
     * @param {number} width The width of the rectangle to clear
     * @param {number} height The height of the rectangle to clear
     * @param {String} color1 The start color of the gradation
     * @param {String} color2 The end color of the gradation
     * @param {Boolean} vertical Whether it draws a vertical gradient
     */
    gradientFillRect(x: number, y: number, width: number, height: number, color1: string, color2: string, vertical?: boolean): void;

    /**
     * Draw the filled circle.
     *
     * @method drawCircle
     * @param {number} x The x coordinate of the center of the circle
     * @param {number} y The y coordinate of the center of the circle
     * @param {number} radius The radius of the circle
     * @param {String} color The color of the circle in CSS format
     */
    drawCircle(x: number, y: number, radius: number, color: string): void;

    /**
     * Draws the outline text to the bitmap.
     *
     * @method drawText
     * @param {String} text The text that will be drawn
     * @param {number} x The x coordinate for the left of the text
     * @param {number} y The y coordinate for the top of the text
     * @param {number} maxWidth The maximum allowed width of the text
     * @param {number} lineHeight The height of the text line
     * @param {String} align The alignment of the text
     */
    drawText(text: string, x: number, y: number, maxWidth: number, lineHeight: number, align?: string): void;

    /**
     * Returns the width of the specified text.
     *
     * @method measureTextWidth
     * @param {String} text The text to be measured
     * @return {number} The width of the text in pixels
     */
    measureTextWidth(text: string): number;

    /**
     * Changes the color tone of the entire bitmap.
     *
     * @method adjustTone
     * @param {number} r The red strength in the range (-255, 255)
     * @param {number} g The green strength in the range (-255, 255)
     * @param {number} b The blue strength in the range (-255, 255)
     */
    adjustTone(r: number, g: number, b: number): void;

    /**
     * Rotates the hue of the entire bitmap.
     *
     * @method rotateHue
     * @param {number} offset The hue offset in 360 degrees
     */
    rotateHue(offset: number): void;

    /**
     * Applies a blur effect to the bitmap.
     *
     * @method blur
     */
    blur(): void;

    /**
     * Add a callback function that will be called when the bitmap is loaded.
     *
     * @method addLoadListener
     * @param {Function} listner The callback function
     */
    addLoadListener(listner: (bitmap: Bitmap) => void): void;

    /**
     * touch the resource
     * @method touch
     */
    touch(): void;

    /**
     * Performs a block transfer, using assumption that original image was not modified (no hue)
     *
     * @method blt
     * @param {Bitmap} source The bitmap to draw
     * @param {number} sx The x coordinate in the source
     * @param {number} sy The y coordinate in the source
     * @param {number} sw The width of the source image
     * @param {number} sh The height of the source image
     * @param {number} dx The x coordinate in the destination
     * @param {number} dy The y coordinate in the destination
     * @param {number} [dw=sw] The width to draw the image in the destination
     * @param {number} [dh=sh] The height to draw the image in the destination
     */
    bltImage(source: Bitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw?: number, dh?: number): void;

    /**
     * Loads a image file and returns a new bitmap object.
     *
     * @static
     * @method load
     * @param {String} url The image url of the texture
     * @return Bitmap
     */
    static load(url: string): Bitmap;

    /**
     * Takes a snapshot of the game screen and returns a new bitmap object.
     *
     * @static
     * @method snap
     * @param {Stage} stage The stage object
     * @return Bitmap
     */
    static snap(stage: Stage): Bitmap;
}

declare class CacheEntry {
    /**
     * The resource class. Allows to be collected as a garbage if not use for some time or ticks
     *
     * @class CacheEntry
     * @constructor
     * @param {ResourceManager} resource manager
     * @param {string} key, url of the resource
     * @param {string} item - Bitmap, HTML5Audio, WebAudio - whatever you want to store in the cache
     */
    constructor(cache: CacheMap, key: string, item: string);

    /**
     * frees the resource
     */
    free(byTTL?: boolean): void;

    /**
     * Allocates the resource
     * @returns {CacheEntry}
     */
    allocate(): CacheEntry;

    /**
     * Sets the time to live
     * @param {number} ticks TTL in ticks, 0 if not set
     * @param {number} time TTL in seconds, 0 if not set
     * @returns {CacheEntry}
     */
    setTimeToLive(ticks?: number, seconds?: number): CacheEntry;

    isStillAlive(): boolean;

    /**
     * makes sure that resource wont freed by Time To Live
     * if resource was already freed by TTL, put it in cache again
     */
    touch(): void;
}

declare class CacheMap {
    /**
     * Cache for images, audio, or any other kind of resource
     * @param manager
     * @constructor
     */
    constructor(manager: ImageManager);

    /**
     * checks ttl of all elements and removes dead ones
     */
    checkTTL(): void;

    /**
     * cache item
     * @param key url of cache element
     * @returns {*|null}
     */
    getItem(key: string): any;

    clear(): void;

    setItem(key: string, item: any): CacheEntry;

    update(ticks: number, delta: number): void;
}

/**
 * The static class that carries out graphics processing.
 *
 * @class Graphics
 */
declare class Graphics {
    protected constructor();

    /**
     * The total frame count of the game screen.
     *
     * @static
     * @property frameCount
     * @type {number}
     */
    static frameCount: number;
    /**
     * The alias of PIXI.blendModes.NORMAL.
     *
     * @static
     * @property BLEND_NORMAL
     * @type {number}
     * @final
     */
    static BLEND_NORMAL: number;
    /**
     * The alias of PIXI.blendModes.ADD.
     *
     * @static
     * @property BLEND_ADD
     * @type {number}
     * @final
     */
    static BLEND_ADD: number;
    /**
     * The alias of PIXI.blendModes.MULTIPLY.
     *
     * @static
     * @property BLEND_MULTIPLY
     * @type {number}
     * @final
     */
    static BLEND_MULTIPLY: number;
    /**
     * The alias of PIXI.blendModes.SCREEN.
     *
     * @static
     * @property BLEND_SCREEN
     * @type {number}
     * @final
     */
    static BLEND_SCREEN: number;
    /**
     * The width of the game screen.
     *
     * @static
     * @property width
     * @type {number}
     */
    static width: number;
    /**
     * The height of the game screen.
     *
     * @static
     * @property height
     * @type {number}
     */
    static height: number;
    /**
     * The width of the window display area.
     *
     * @static
     * @property boxWidth
     * @type {number}
     */
    static boxWidth: number;
    /**
     * The height of the window display area.
     *
     * @static
     * @property boxHeight
     * @type {number}
     */
    static boxHeight: number;
    /**
     * The zoom scale of the game screen.
     *
     * @static
     * @property scale
     * @type {number}
     */
    static scale: number;

    /**
     * Initializes the graphics system.
     *
     * @static
     * @method initialize
     * @param {number} width The width of the game screen
     * @param {number} height The height of the game screen
     * @param {String} type The type of the renderer.
     *                 'canvas', 'webgl', or 'auto'.
     */
    static initialize(width?: number, height?: number, type?: string): void;

    /**
     * Marks the beginning of each frame for FPSMeter.
     *
     * @static
     * @method tickStart
     */
    static tickStart(): void;

    /**
     * Marks the end of each frame for FPSMeter.
     *
     * @static
     * @method tickEnd
     */
    static tickEnd(): void;

    /**
     * Renders the stage to the game screen.
     *
     * @static
     * @method render
     * @param {Stage} stage The stage object to be rendered
     */
    static render(stage?: Stage): void;

    /**
     * Checks whether the renderer type is WebGL.
     *
     * @static
     * @method isWebGL
     * @return {Boolean} True if the renderer type is WebGL
     */
    static isWebGL(): boolean;

    /**
     * Checks whether the current browser supports WebGL.
     *
     * @static
     * @method hasWebGL
     * @return {Boolean} True if the current browser supports WebGL.
     */
    static hasWebGL(): boolean;

    /**
     * Checks whether the canvas blend mode 'difference' is supported.
     *
     * @static
     * @method canUseDifferenceBlend
     * @return {Boolean} True if the canvas blend mode 'difference' is supported
     */
    static canUseDifferenceBlend(): boolean;

    /**
     * Checks whether the canvas blend mode 'saturation' is supported.
     *
     * @static
     * @method canUseSaturationBlend
     * @return {Boolean} True if the canvas blend mode 'saturation' is supported
     */
    static canUseSaturationBlend(): boolean;

    /**
     * Sets the source of the "Now Loading" image.
     *
     * @static
     * @method setLoadingImage
     * @param {String} Path of image
     */
    static setLoadingImage(src: string): void;

    /**
     * Initializes the counter for displaying the "Now Loading" image.
     *
     * @static
     * @method startLoading
     */
    static startLoading(): void;

    /**
     * Increments the loading counter and displays the "Now Loading" image if necessary.
     *
     * @static
     * @method updateLoading
     */
    static updateLoading(): void;

    /**
     * Erases the "Now Loading" image.
     *
     * @static
     * @method endLoading
     */
    static endLoading(): void;

    /**
     * Displays the error text to the screen.
     *
     * @static
     * @method printError
     * @param {String} name The name of the error
     * @param {String} message The message of the error
     */
    static printError(name: string, message: string): void;

    /**
     * Shows the FPSMeter element.
     *
     * @static
     * @method showFps
     */
    static showFps(): void;

    /**
     * Hides the FPSMeter element.
     *
     * @static
     * @method hideFps
     */
    static hideFps(): void;

    /**
     * Loads a font file.
     *
     * @static
     * @method loadFont
     * @param {String} name The face name of the font
     * @param {String} url The url of the font file
     */
    static loadFont(name: string, url: string): void;

    /**
     * Checks whether the font file is loaded.
     *
     * @static
     * @method isFontLoaded
     * @param {String} name The face name of the font
     * @return {Boolean} True if the font file is loaded
     */
    static isFontLoaded(name: string): boolean;

    /**
     * Starts playback of a video.
     *
     * @static
     * @method playVideo
     * @param {String} src
     */
    static playVideo(src: string): void;

    /**
     * Checks whether the video is playing.
     *
     * @static
     * @method isVideoPlaying
     * @return {Boolean} True if the video is playing
     */
    static isVideoPlaying(): boolean;

    /**
     * Checks whether the browser can play the specified video type.
     *
     * @static
     * @method canPlayVideoType
     * @param {String} type The video type to test support for
     * @return {Boolean} True if the browser can play the specified video type
     */
    static canPlayVideoType(type: string): boolean;

    /**
     * Converts an x coordinate on the page to the corresponding
     * x coordinate on the canvas area.
     *
     * @static
     * @method pageToCanvasX
     * @param {number} x The x coordinate on the page to be converted
     * @return {number} The x coordinate on the canvas area
     */
    static pageToCanvasX(x: number): number;

    /**
     * Converts a y coordinate on the page to the corresponding
     * y coordinate on the canvas area.
     *
     * @static
     * @method pageToCanvasY
     * @param {number} y The y coordinate on the page to be converted
     * @return {number} The y coordinate on the canvas area
     */
    static pageToCanvasY(y: number): number;

    /**
     * Checks whether the specified point is inside the game canvas area.
     *
     * @static
     * @method isInsideCanvas
     * @param {number} x The x coordinate on the canvas area
     * @param {number} y The y coordinate on the canvas area
     * @return {Boolean} True if the specified point is inside the game canvas area
     */
    static isInsideCanvas(x: number, y: number): boolean;

    /**
     * Calls pixi.js.old garbage collector
     */
    static callGC(): void;

    static _renderer: PIXI.AbstractRenderer;
}

declare class HTML5Audio {
    protected constructor();

    _initialized: boolean;
    _unlocked: boolean;
    _audioElement: HTMLAudioElement;
    _gainTweenInterval: number;
    _tweenGain: number;
    _tweenTargetGain: number;
    _tweenGainStep: number;
    _staticSePath: boolean;
    _volume: number;
    _loadListeners: (() => void)[];
    _hasError: boolean;
    __autoPlay: boolean;
    _isLoading: boolean;
    _buffered: boolean;
    /**
     * [read-only] The url of the audio file.
     *
     * @property url
     * @type String
     */
    url: string;
    /**
     * The volume of the audio.
     *
     * @property volume
     * @type {number}
     */
    volume: number;

    /**
     * Sets up the Html5 Audio.
     *
     * @static
     * @method setup
     * @param {String} url The url of the audio file
     */
    setup(url: string): void;

    /**
     * Initializes the audio system.
     *
     * @static
     * @method initialize
     * @return {Boolean} True if the audio system is available
     */
    initialize(): void;

    /**
     * Clears the audio data.
     *
     * @static
     * @method clear
     */
    clear(): void;

    /**
     * Set the URL of static se.
     *
     * @static
     * @param {String} url
     */
    setStaticSe(url: string): void;

    /**
     * Checks whether the audio data is ready to play.
     *
     * @static
     * @method isReady
     * @return {Boolean} True if the audio data is ready to play
     */
    isReady(): boolean;

    /**
     * Checks whether a loading error has occurred.
     *
     * @static
     * @method isError
     * @return {Boolean} True if a loading error has occurred
     */
    isError(): boolean;

    /**
     * Checks whether the audio is playing.
     *
     * @static
     * @method isPlaying
     * @return {Boolean} True if the audio is playing
     */
    isPlaying(): boolean;

    /**
     * Plays the audio.
     *
     * @static
     * @method play
     * @param {Boolean} loop Whether the audio data play in a loop
     * @param {number} offset The start position to play in seconds
     */
    play(loop: boolean, offset: number): void;

    /**
     * Stops the audio.
     *
     * @static
     * @method stop
     */
    stop(): void;

    /**
     * Performs the audio fade-in.
     *
     * @static
     * @method fadeIn
     * @param {number} duration Fade-in time in seconds
     */
    fadeIn(duration: number): void;

    /**
     * Performs the audio fade-out.
     *
     * @static
     * @method fadeOut
     * @param {number} duration Fade-out time in seconds
     */
    fadeOut(duration: number): void;

    /**
     * Gets the seek position of the audio.
     *
     * @static
     * @method seek
     */
    seek(): void;
}

declare class Input {
    protected constructor();

    /**
     * The wait time of the key repeat in frames.
     *
     * @static
     * @property keyRepeatWait
     * @type {number}
     */
    static keyRepeatWait: number;
    /**
     * The interval of the key repeat in frames.
     *
     * @static
     * @property keyRepeatInterval
     * @type {number}
     */
    static keyRepeatInterval: number;
    /**
     * A hash table to convert from a virtual key code to a mapped key name.
     *
     * @static
     * @property keyMapper
     * @type Object
     * ```
     * {
     * [key:number]:string
     * }
     * ```
     */
    static keyMapper: Object;
    /**
     * A hash table to convert from a gamepad button to a mapped key name.
     *
     * @static
     * @property gamepadMapper
     * @type Object
     * ```
     * {
     * [key:number]:String
     * }
     * ```
     */
    static gamepadMapper: Object;
    /**
     * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
     *
     * @static
     * @property dir4
     * @type {number}
     */
    static dir4: number;
    /**
     * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
     *
     * @static
     * @property dir8
     * @type {number}
     */
    static dir8: number;
    /**
     * [read-only] The time of the last input in milliseconds.
     *
     * @static
     * @property date
     * @type {number}
     */
    static date: number;

    /**
     * Initializes the input system.
     *
     * @static
     * @method initialize
     */
    static initialize(): void;

    /**
     * Clears all the input data.
     *
     * @static
     * @method clear
     */
    static clear(): void;

    /**
     * Updates the input data.
     *
     * @static
     * @method update
     */
    static update(): void;

    /**
     * Checks whether a key is currently pressed down.
     *
     * @static
     * @method isPressed
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is pressed
     */
    static isPressed(keyName: string): boolean;

    /**
     * Checks whether a key is just pressed.
     *
     * @static
     * @method isTriggered
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is triggered
     */
    static isTriggered(keyName: string): boolean;

    /**
     * Checks whether a key is just pressed or a key repeat occurred.
     *
     * @static
     * @method isRepeated
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is repeated
     */
    static nisRepeated(keyName: string): boolean;

    /**
     * Checks whether a key is kept depressed.
     *
     * @static
     * @method isLongPressed
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is long-pressed
     */
    static isLongPressed(keyName: string): boolean;
}

/**
 * The static class that handles JSON with object information.
 *
 * @class JsonEx
 */
declare class JsonEx {
    protected constructor();

    /**
     * The maximum depth of objects.
     *
     * @static
     * @property maxDepth
     * @type {number}
     * @default 100
     */
    maxDepth: number;

    /**
     * Makes a deep copy of the specified object.
     *
     * @static
     * @method makeDeepCopy
     * @param {Object} object The object to be copied
     * @return {Object} The copied object
     */
    static makeDeepCopy(object: any): any;

    /**
     * Converts an object to a JSON string with object information.
     *
     * @static
     * @method stringify
     * @param {Object} object The object to be converted
     * @return {String} The JSON string
     */
    static stringify(object: any): string;

    /**
     * Parses a JSON string and reconstructs the corresponding object.
     *
     * @static
     * @method parse
     * @param {String} json The JSON string
     * @return {Object} The reconstructed object
     */
    static parse(json: string): any;
}

/**
 * Extends the `Number` class with additional functions.
 */
declare class Number {
    /**
     * Makes a number string with leading zeros.
     *
     * @memberof JsExtensions
     * @param {number} length - The length of the output string.
     * @returns {string} A string with leading zeros.
     */
    padZero(length: number): string;

    /**
     * Returns a number whose value is limited to the given range.
     *
     * @memberof JsExtensions
     * @param {number} min - The lower boundary.
     * @param {number} max - The upper boundary.
     * @returns {number} A number in the range (min, max).
     */
    clamp(min: number, max: number): number;
}

/**
 * Extends the `Number` class with additional functions.
 */
declare class String {
    /**
     * Makes a number string with leading zeros.
     *
     * @memberof JsExtensions
     * @param {number} length - The length of the output string.
     * @returns {string} A string with leading zeros.
     */
    padZero(length: number): string;

    padStart(length: number, fillStr?: string = ' '): string;
}

declare class Rectangle extends PIXI.Rectangle {
    /**
     * The rectangle class.
     *
     * @class Rectangle
     * @constructor
     * @param {number} x The x coordinate for the upper-left corner
     * @param {number} y The y coordinate for the upper-left corner
     * @param {number} width The width of the rectangle
     * @param {number} height The height of the rectangle
     */
    constructor(x?: number, y?: number, width?: number, height?: number);

    /**
     * @static
     * @property emptyRectangle
     * @type Rectangle
     */
    static emptyRectangle: Rectangle;
}

declare class ScreenSprite extends PIXI.Sprite {
    /**
     * The sprite which covers the entire game screen.
     *
     * @class ScreenSprite
     * @constructor
     */
    constructor();

    /**
     * The opacity of the sprite (0 to 255).
     *
     * @property opacity
     * @type {number}
     */
    opacity: number;

    /**
     * Sets black to the color of the screen sprite.
     *
     * @method setBlack
     */
    setBlack(): void;

    /**
     * Sets white to the color of the screen sprite.
     *
     * @method setWhite
     */
    setWhite(): void;

    /**
     * Sets the color of the screen sprite by values.
     *
     * @method setColor
     * @param {number} r The red value in the range (0, 255)
     * @param {number} g The green value in the range (0, 255)
     * @param {number} b The blue value in the range (0, 255)
     */
    setColor(r?: number, g?: number, b?: number): void;
}

declare class Tilemap extends PIXI.Container {
    /**
     * [read-only] The array of children of the sprite.
     *
     * @property children
     * @type Array<PIXI.DisplayObject>
     */
    constructor();

    /**
     * The bitmaps used as a tileset.
     *
     * @property bitmaps
     * @type Array
     */
    bitmaps: Bitmap[];
    /**
     * The origin point of the tilemap for scrolling.
     *
     * @property origin
     * @type Point
     */
    origin: Point;
    /**
     * The tileset flags.
     *
     * @property flags
     * @type Array
     */
    flags: number[];
    /**
     * The animation count for autotiles.
     *
     * @property animationCount
     * @type {number}
     */
    animationCount: number;
    /**
     * Whether the tilemap loops horizontal.
     *
     * @property horizontalWrap
     * @type Boolean
     */
    horizontalWrap: boolean;
    /**
     * Whether the tilemap loops vertical.
     *
     * @property verticalWrap
     * @type Boolean
     */
    verticalWrap: boolean;
    /**
     * The width of the screen in pixels.
     *
     * @property width
     * @type {number}
     */
    tileWidth: number;
    /**
     * The height of a tile in pixels.
     *
     * @property tileHeight
     * @type {number}
     */
    tileHeight: number;

    /**
     * Sets the tilemap data.
     *
     * @method setData
     * @param {number} width The width of the map in number of tiles
     * @param {number} height The height of the map in number of tiles
     * @param {Array} data The one dimensional array for the map data
     */
    setData(width: number, height: number, data: number[]): void;

    /**
     * Checks whether the tileset is ready to render.
     *
     * @method isReady
     * @type Boolean
     * @return {Boolean} True if the tilemap is ready
     */
    isReady(): boolean;

    /**
     * Updates the tilemap for each frame.
     *
     * @method update
     */
    update(): void;

    /**
     * @method updateTransform
     * @private
     */
    updateTransform(): void;

    /**
     * Forces to repaint the entire static
     *
     * @method refresh
     */
    refresh(): void;

    /**
     * Adds a child to the container.
     *
     * @method addChild
     * @param {PIXI.DisplayObject} child The child to add
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Adds a child to the container at a specified index.
     *
     * @method addChildAt
     * @param {PIXI.DisplayObject} child The child to add
     * @param {number} index The index to place the child in
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;

    /**
     * Removes a child from the container.
     *
     * @method removeChild
     * @param {PIXI.DisplayObject} child The child to remove
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Removes a child from the specified index position.
     *
     * @method removeChildAt
     * @param {number} index The index to get the child from
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChildAt(index: number): PIXI.DisplayObject;

    /**
     * Forces to refresh the tileset
     *
     * @method refresh
     */
    refreshTileset(): void;

    static TILE_ID_A1: number;
    static TILE_ID_A2: number;
    static TILE_ID_A3: number;
    static TILE_ID_A4: number;
    static TILE_ID_A5: number;
    static TILE_ID_B: number;
    static TILE_ID_C: number;
    static TILE_ID_D: number;
    static TILE_ID_E: number;
    static TILE_ID_MAX: number;
    static FLOOR_AUTOTILE_TABLE: number[][][];
    static WALL_AUTOTILE_TABLE: number[][][];
    static WATERFALL_AUTOTILE_TABLE: number[][][];

    static isVisibleTile(tileId: number): boolean;

    static isAutotile(tileId: number): boolean;

    static getAutotileKind(tileId: number): number;

    static getAutotileShape(tileId: number): number;

    static makeAutotileId(kind: number, shape: number): number;

    static isSameKindTile(tileID1: number, tileID2: number): boolean;

    static isTileA1(tileId: number): boolean;

    static isTileA2(tileId: number): boolean;

    static isTileA3(tileId: number): boolean;

    static isTileA4(tileId: number): boolean;

    static isTileA5(tileId: number): boolean;

    static isWaterTile(tileId: number): boolean;

    static isWaterfallTile(tileId: number): boolean;

    static isGroundTile(tileId: number): boolean;

    static isShadowingTile(tileId: number): boolean;

    static isRoofTile(tileId: number): boolean;

    static isWallTopTile(tileId: number): boolean;

    static isWallSideTile(tileId: number): boolean;

    static isWallTile(tileId: number): boolean;

    static isFloorTypeAutotile(tileId: number): boolean;

    static isWallTypeAutotile(tileId: number): boolean;

    static isWaterfallTypeAutotile(tileId: number): boolean;
}

declare class ShaderTilemap extends Tilemap {
    protected constructor();

    /**
     * PIXI render method
     *
     * @method renderWebGL
     * @param {PIXI.WebGLRenderer} pixi renderer
     */
    renderWebGL(renderer: PIXI.Renderer): void;

    /**
     * PIXI render method
     *
     * @method renderCanvas
     * @param {PIXI.CanvasRenderer} pixi renderer
     */
    renderCanvas(renderer: PIXI.CanvasRenderer): void;

    /**
     * Forces to repaint the entire tilemap AND update bitmaps list if needed
     *
     * @method refresh
     */
    refresh(): void;

    /**
     * Call after you update tileset
     *
     * @method refreshTileset
     */
    refreshTileset(): void;
}

declare class Sprite extends PIXI.Sprite {
    /**
     * The core object that gets rendered to the screen.
     * @param {Bitmap} bitmap The image representing the sprite.
     */
    constructor(bitmap?: Bitmap);

    /**
     * The image for the sprite.
     */
    bitmap: Bitmap;

    /**
     * The opacity of the sprite.
     */
    opacity: number;

    /**
     * The visibility of the sprite.
     */
    visible: boolean;

    /**
     * The x coordinate of the sprite.
     */
    x: number;

    /**
     * The y coordinate of the sprite.
     */
    y: number;

    /**
     * The origin point of the sprite. (0,0) to (1,1).
     */
    point: PIXI.Point;

    /**
     * The scale factor of the sprite.
     */
    scale: PIXI.Point;

    /**
     * The rotation of the sprite in radians.
     */
    rotation: number;

    /**
     * The blend mode to be applied to the sprite.
     */
    blendMode: number;

    /**
     * Sets the filters for the sprite.
     */
    filters: PIXI.Filter[];

    /**
     * The id associated with this sprite.
     */
    spriteId: number;

    /**
     * Initializes the sprite with a bitmap if applicable.
     * @param {Bitmap} bitmap The bitmap to use as a source.
     */
    initialize(bitmap?: Bitmap): void;

    /**
     * Updates the sprite for each and all children sprite each frame.
     */
    update(): void;

    updateTransform(): void;

    /**
     * Updates the x and y to a new {@link Point}.
     *
     * @param {number} x The x coordinate of the sprite
     * @param {number} y The y coordinate of the sprite
     */
    move(x: number, y: number): void;

    /**
     * Sets the rectagle of the bitmap that the sprite displays.
     *
     * @method setFrame
     * @param {number} x The x coordinate of the frame
     * @param {number} y The y coordinate of the frame
     * @param {number} width The width of the frame
     * @param {number} height The height of the frame
     */
    setFrame(x: number, y: number, width: number, height: number): void;

    /**
     * Gets the blend color for the sprite.
     *
     * @method getBlendColor
     * @return {Array} The blend color [r, g, b, a]
     */
    getBlendColor(): number[];

    /**
     * Sets the blend color for the sprite.
     * @param {number[]} color The blend color [r, g, b, a]
     */
    setBlendColor(color: number[]): void;

    /**
     * Gets the color tone for the sprite.
     * @return {number[]} The color tone [r, g, b, gray]
     */
    getColorTone(): number[];

    /**
     * Sets the color tone for the sprite.
     * @param {number[]} tone The color tone [r, g, b, gray]
     */
    setColorTone(tone: number[]): void;

    /**
     * Adds a child to the container.
     * @param {PIXI.DisplayObject} child The child to add
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Adds a child to the container at a specified index.
     * @param {PIXI.DisplayObject} child The child to add
     * @param {number} index The index to place the child in
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;

    /**
     * Removes a child from the container.
     * @param {PIXI.DisplayObject} child The child to remove
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Removes a child from the specified index position.
     * @param {number} index The index to get the child from
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChildAt(index: number): PIXI.DisplayObject;

    /**
     * Number of the created objects.
     */
    static _counter: number;
}

declare class Stage extends PIXI.Container {
    /**
     * The root object of the display tree.
     *
     * @class Stage
     * @constructor
     */
    constructor();

    /**
     * Adds a child to the container.
     *
     * @method addChild
     * @param {PIXI.DisplayObject} child The child to add
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Adds a child to the container at a specified index.
     *
     * @method addChildAt
     * @param {PIXI.DisplayObject} child The child to add
     * @param {number} index The index to place the child in
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;

    /**
     * Removes a child from the container.
     *
     * @method removeChild
     * @param {PIXI.DisplayObject} child The child to remove
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Removes a child from the specified index position.
     *
     * @method removeChildAt
     * @param {number} index The index to get the child from
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChildAt(index: number): PIXI.DisplayObject;
}

declare class TilingSprite extends PIXI.TilingSprite {
    /**
     * The sprite object for a tiling image.
     *
     * @class TilingSprite
     * @constructor
     * @param {Bitmap} bitmap The image for the tiling sprite
     */
    constructor(bitmap: Bitmap);

    /**
     * The origin point of the tiling sprite for scrolling.
     *
     * @property origin
     * @type Point
     */
    origin: Point;
    /**
     * The image for the tiling sprite.
     *
     * @property bitmap
     * @type Bitmap
     */
    bitmap: Bitmap;
    /**
     * The opacity of the tiling sprite (0 to 255).
     *
     * @property opacity
     * @type {number}
     */
    opacity: number;
    /**
     * The visibility of the tiling sprite.
     *
     * @property visible
     * @type Boolean
     */
    visibility: boolean;
    /**
     * The x coordinate of the tiling sprite.
     *
     * @property x
     * @type {number}
     */
    x: number;
    /**
     * The y coordinate of the tiling sprite.
     *
     * @property y
     * @type {number}
     */
    y: number;
    spriteId: number;

    /**
     * Updates the tiling sprite for each frame.
     *
     * @method update
     */
    update(): void;

    /**
     * @method updateTransform
     * @private
     */
    updateTransform(): void;

    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {number} x The x coordinate of the tiling sprite
     * @param {number} y The y coordinate of the tiling sprite
     * @param {number} width The width of the tiling sprite
     * @param {number} height The height of the tiling sprite
     */
    move(x?: number, y?: number, width?: number, height?: number): void;

    /**
     * Specifies the region of the image that the tiling sprite will use.
     *
     * @method setFrame
     * @param {number} x The x coordinate of the frame
     * @param {number} y The y coordinate of the frame
     * @param {number} width The width of the frame
     * @param {number} height The height of the frame
     */
    setFrame(x: number, y: number, width: number, height: number): void;

    updateTransformTS(): void;

    /**
     * @method generateTilingTexture
     * @param {Boolean} arg
     */
    generateTilingTexture(arg: boolean): void;
}

declare class ToneFilter extends PIXI.filters.ColorMatrixFilter {
    /**
     * The color matrix filter for WebGL.
     *
     * @class ToneFilter
     * @extends PIXI.Filter
     * @constructor
     */
    constructor();

    /**
     * Changes the hue.
     *
     * @method adjustHue
     * @param {number} value The hue value in the range (-360, 360)
     */
    adjustHue(value?: number): void;

    /**
     * Changes the saturation.
     *
     * @method adjustSaturation
     * @param {number} value The saturation value in the range (-255, 255)
     */
    adjustSaturation(value?: number): void;

    /**
     * Changes the tone.
     *
     * @method adjustTone
     * @param {number} r The red strength in the range (-255, 255)
     * @param {number} g The green strength in the range (-255, 255)
     * @param {number} b The blue strength in the range (-255, 255)
     */
    adjustTone(r?: number, g?: number, b?: number): void;
}

declare class ToneSprite extends PIXI.Container {
    /**
     * The sprite which changes the screen color in 2D canvas mode.
     *
     * @class ToneSprite
     * @constructor
     */
    constructor();

    /**
     * Clears the tone.
     *
     * @method reset
     */
    clear(): void;

    /**
     * Sets the tone.
     *
     * @method setTone
     * @param {number} r The red strength in the range (-255, 255)
     * @param {number} g The green strength in the range (-255, 255)
     * @param {number} b The blue strength in the range (-255, 255)
     * @param {number} gray The grayscale level in the range (0, 255)
     */
    setTone(r: number, g: number, b: number, gray: number): void;
}

declare class TouchInput {
    protected constructor();

    static _mousePressed: boolean;
    static _screenPressed: boolean;
    static _pressedTime: number;
    static _date: number;
    static _x: number;
    static _y: number;
    /**
     * The wait time of the pseudo key repeat in frames.
     *
     * @static
     * @property keyRepeatWait
     * @type {number}
     */
    static keyRepeatWait: rm.types.Frames;
    /**
     * The interval of the pseudo key repeat in frames.
     *
     * @static
     * @property keyRepeatInterval
     * @type {number}
     */
    static keyRepeatInterval: rm.types.Frames;
    /**
     * [read-only] The horizontal scroll amount.
     *
     * @static
     * @property wheelX
     * @type {number}
     */
    static wheelX: number;
    /**
     * [read-only] The vertical scroll amount.
     *
     * @static
     * @property wheelY
     * @type {number}
     */
    static wheelY: number;
    /**
     * [read-only] The x coordinate on the canvas area of the latest touch event.
     *
     * @static
     * @property x
     * @type {number}
     */
    static x: number;
    /**
     * [read-only] The y coordinate on the canvas area of the latest touch event.
     *
     * @static
     * @property y
     * @type {number}
     */
    static y: number;
    /**
     * [read-only] The time of the last input in milliseconds.
     *
     * @static
     * @property date
     * @type {number}
     */
    static date: number;

    /**
     * Initializes the touch system.
     *
     * @static
     * @method initialize
     */
    static initialize(): void;

    /**
     * Clears all the touch data.
     *
     * @static
     * @method clear
     */
    static clear(): void;

    /**
     * Updates the touch data.
     *
     * @static
     * @method update
     */
    static update(): void;

    /**
     * Checks whether the mouse button or touchscreen is currently pressed down.
     *
     * @static
     * @method isPressed
     * @return {Boolean} True if the mouse button or touchscreen is pressed
     */
    static isPressed(): boolean;

    /**
     * Checks whether the left mouse button or touchscreen is just pressed.
     *
     * @static
     * @method isTriggered
     * @return {Boolean} True if the mouse button or touchscreen is triggered
     */
    static isTriggered(): boolean;

    /**
     * Checks whether the left mouse button or touchscreen is just pressed
     * or a pseudo key repeat occurred.
     *
     * @static
     * @method isRepeated
     * @return {Boolean} True if the mouse button or touchscreen is repeated
     */
    static isRepeated(): boolean;

    /**
     * Checks whether the left mouse button or touchscreen is kept depressed.
     *
     * @static
     * @method isLongPressed
     * @return {Boolean} True if the left mouse button or touchscreen is long-pressed
     */
    static isLongPressed(): boolean;

    /**
     * Checks whether the right mouse button is just pressed.
     *
     * @static
     * @method isCancelled
     * @return {Boolean} True if the right mouse button is just pressed
     */
    static isCancelled(): boolean;

    /**
     * Checks whether the mouse or a finger on the touchscreen is moved.
     *
     * @static
     * @method isMoved
     * @return {Boolean} True if the mouse or a finger on the touchscreen is moved
     */
    static isMoved(): boolean;

    /**
     * Checks whether the left mouse button or touchscreen is released.
     *
     * @static
     * @method isReleased
     * @return {Boolean} True if the mouse button or touchscreen is released
     */
    static isReleased(): boolean;
}

declare class Utils {
    protected constructor();

    /**
     * The name of the RPG Maker. 'MV' in the current version.
     */
    static RPGMAKER_NAME: string;
    /**
     * The version of the RPG Maker.
     *
     * @static
     * @property RPGMAKER_VERSION
     * @type String
     * @final
     */
    static RPGMAKER_VERSION: string;

    /**
     * Checks whether the option is in the query string.
     *
     * @param {String} name The option name
     * @return {Boolean} True if the option is in the query string
     */
    static isOptionValid(name: string): boolean;

    /**
     * Checks whether the platform is NW.js.
     *
     * @return {Boolean} True if the platform is NW.js
     */
    static isNwjs(): boolean;

    /**
     * Checks whether the platform is a mobile device.
     *
     * @static
     * @method isMobileDevice
     * @return {Boolean} True if the platform is a mobile device
     */
    static isMobileDevice(): boolean;

    /**
     * Checks whether the browser is Mobile Safari.
     *
     * @static
     * @method isMobileSafari
     * @return {Boolean} True if the browser is Mobile Safari
     */
    static isMobileSafari(): boolean;

    /**
     * Checks whether the browser is Android Chrome.
     *
     * @return {Boolean} True if the browser is Android Chrome
     */
    static isAndroidChrome(): boolean;

    /**
     * Checks whether the browser can read files in the game folder.
     *
     * @return {Boolean} True if the browser can read files in the game folder
     */
    static canReadGameFiles(): boolean;

    /**
     * Makes a CSS color string from RGB values.
     *
     * @static
     * @method rgbToCssColor
     * @param {number} r The red value in the range (0, 255)
     * @param {number} g The green value in the range (0, 255)
     * @param {number} b The blue value in the range (0, 255)
     * @return {String} CSS color string
     */
    static rgbToCssColor(r: number, g: number, b: number): string;

    static isSupportPassiveEvent(): boolean;

    static generateRuntimeId(): number;

    /**
     * Encodes a URI component without escaping slash characters.
     *
     * @param {string} str - The input string.
     * @returns {string} Encoded string.
     */
    static encodeURI(str: string): string;
}

declare class Weather extends PIXI.Container {
    /**
     * The weather effect which displays rain, storm, or snow.
     *
     * @class Weather
     * @constructor
     */
    constructor();

    /**
     * The type of the weather in ['none', 'rain', 'storm', 'snow'].
     *
     * @property type
     * @type String
     */
    type: string;
    /**
     * The power of the weather in the range (0, 9).
     *
     * @property power
     * @type {number}
     */
    power: number;
    /**
     * The origin point of the weather for scrolling.
     *
     * @property origin
     * @type Point
     */
    origin: Point;

    /**
     * Updates the weather for each frame.
     *
     * @method update
     */
    update(): void;
}

declare class WindowLayer extends PIXI.Container {
    /**
     * The layer which contains game windows.
     *
     * @class WindowLayer
     * @constructor
     */
    constructor();

    /**
     * The width of the window layer in pixels.
     *
     * @property width
     * @type {number}
     */
    voidFilter: PIXI.Filter;

    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {number} x The x coordinate of the window layer
     * @param {number} y The y coordinate of the window layer
     * @param {number} width The width of the window layer
     * @param {number} height The height of the window layer
     */
    move(x: number, y: number, width: number, height: number): void;

    /**
     * Updates the window layer for each frame.
     *
     * @method update
     */
    update(): void;

    /**
     * Adds a child to the container.
     *
     * @method addChild
     * @param {PIXI.DisplayObject} child The child to add
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Adds a child to the container at a specified index.
     *
     * @method addChildAt
     * @param {PIXI.DisplayObject} child The child to add
     * @param {number} index The index to place the child in
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;

    /**
     * Removes a child from the container.
     *
     * @method removeChild
     * @param {PIXI.DisplayObject} child The child to remove
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Removes a child from the specified index position.
     *
     * @method removeChildAt
     * @param {number} index The index to get the child from
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChildAt(index: number): PIXI.DisplayObject;

    /**
     * @method _renderCanvas
     * @param {PIXI.CanvasRenderer} renderer
     * @private
     */
    _renderCanvas(renderer: PIXI.CanvasRenderer): void;

    /**
     * @method _renderWebGL
     * @param {PIXI.WebGLRenderer} renderer
     * @private
     */
    _renderWebGL(renderer: PIXI.Renderer): void;
}

declare class Window extends PIXI.Container {
    /**
     * The visibility of the sprite.
     *
     * @property visible
     * @type Boolean
     */
    constructor();

    /**
     * The origin point of the window for scrolling.
     *
     * @property origin
     * @type Point
     */
    origin: PIXI.Point;
    /**
     * The active state for the window.
     *
     * @property active
     * @type Boolean
     */
    active: boolean;
    /**
     * The visibility of the down scroll arrow.
     *
     * @property downArrowVisible
     * @type Boolean
     */
    downArrowVisible: boolean;
    /**
     * The visibility of the up scroll arrow.
     *
     * @property upArrowVisible
     * @type Boolean
     */
    upArrowVisible: boolean;
    /**
     * The visibility of the pause sign.
     *
     * @property pause
     * @type Boolean
     */
    pause: boolean;
    /**
     * The image used as a window skin.
     *
     * @property windowskin
     * @type {Bitmap}
     */
    windowskin: Bitmap;
    /**
     * The bitmap used for the window contents.
     *
     * @type {Bitmap}
     */
    contents: Bitmap;
    /**
     * The width of the window in pixels.
     *
     * @property width
     * @type {number}
     */
    padding: number;
    /**
     * The size of the margin for the window background.
     *
     * @property margin
     * @type {number}
     */
    margin: number;
    /**
     * The opacity of the window without contents (0 to 255).
     *
     * @property opacity
     * @type {number}
     */
    opacity: number;
    /**
     * The opacity of the window background (0 to 255).
     *
     * @property backOpacity
     * @type {number}
     */
    backOpacity: number;
    /**
     * The opacity of the window contents (0 to 255).
     *
     * @property contentsOpacity
     * @type {number}
     */
    contentsOpacity: number;
    /**
     * The openness of the window (0 to 255).
     *
     * @property openness
     * @type {number}
     */
    openness: number;
    /**
     * The width of the content area in pixels.
     */
    innerWidth: number;
    /**
     * The height of the content area in pixels.
     */
    innerHeight: number;
    /**
     * The rectangle of the content area
     */
    innerRect: Rectangle;

    /**
     * Updates the window for each frame.
     *
     * @method update
     */
    update(): void;

    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {number} x The x coordinate of the window
     * @param {number} y The y coordinate of the window
     * @param {number} width The width of the window
     * @param {number} height The height of the window
     */
    move(x?: number, y?: number, width?: number, height?: number): void;

    /**
     * Returns true if the window is completely open (openness == 255).
     *
     * @method isOpen
     * @return {Boolean}
     */
    isOpen(): boolean;

    /**
     * Returns true if the window is completely closed (openness == 0).
     *
     * @method isClosed
     * @return {Boolean}
     */
    isClosed(): boolean;

    /**
     * Sets the position of the command cursor.
     *
     * @method setCursorRect
     * @param {number} x The x coordinate of the cursor
     * @param {number} y The y coordinate of the cursor
     * @param {number} width The width of the cursor
     * @param {number} height The height of the cursor
     */
    setCursorRect(x?: number, y?: number, width?: number, height?: number): void;

    /**
     * Changes the color of the background.
     *
     * @method setTone
     * @param {number} r The red value in the range (-255, 255)
     * @param {number} g The green value in the range (-255, 255)
     * @param {number} b The blue value in the range (-255, 255)
     */
    setTone(r: number, g: number, b: number): void;

    /**
     * Adds a child between the background and contents.
     *
     * @method addChildToBack
     * @param {PIXI.DisplayObject} child The child to add
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChildToBack(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Adds a child to the container.
     *
     * @method addChild
     * @param {PIXI.DisplayObject} child The child to add
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Adds a child to the container at a specified index.
     *
     * @method addChildAt
     * @param {PIXI.DisplayObject} child The child to add
     * @param {number} index The index to place the child in
     * @return {PIXI.DisplayObject} The child that was added
     */
    addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;

    /**
     * Removes a child from the container.
     *
     * @method removeChild
     * @param {PIXI.DisplayObject} child The child to remove
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Removes a child from the specified index position.
     *
     * @method removeChildAt
     * @param {number} index The index to get the child from
     * @return {PIXI.DisplayObject} The child that was removed
     */
    removeChildAt(index: number): PIXI.DisplayObject;

    /**
     * Move the cursor position by the given amount
     * @param x
     * @param y
     */
    moveCursorBy(x: number, y: number): void;

    /**
     * Moves the inner children by the given amount.
     * @param x
     * @param y
     */
    moveInnerChildrenBy(x: number, y: number): void;

    /**
     * Adds a child to the client area.
     * @param child
     * @return DisplayObject
     */
    addInnerChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

    /**
     * Draws the window shape into PIXI.Graphics object. Used by WindowLayer.
     * @param graphics
     */
    drawShape(graphics: PIXI.Graphics): void;

    /**
     * Destroys the window
     */
    destroy(): void;

    /**
     * @method updateTransform
     * @private
     */
    updateTransform(): void;
}
