import './pixi';
import { rm } from "./lunalite-pixi-mz";
import {
    Game_Actor,
    Game_Battler,
    Game_Character,
    Game_Enemy,
    Game_Event,
    Game_Picture,
    Game_Player
} from "./rmmz_objects";
import {Bitmap, ScreenSprite, ShaderTilemap, Sprite, Tilemap, ToneFilter, ToneSprite, Weather} from "./rmmz_core";

declare class Sprite_Base { }

declare class Sprite_Battler { }

/**
 * -----------------------------------------------------------------------------
 * Sprite_Actor
 *
 * The sprite for displaying an actor.
 */
declare class Sprite_Actor extends Sprite_Battler {
    /**
     * Creates an instance of Sprite_Actor; can be passed
     * a battler on creation.
     * @param {Game_Actor} [battler]
     * @memberof Sprite_Actor
     */
    constructor(battler?: Game_Actor);
    _battlerName: string;
    _motion: rm.types.Motion;
    _motionCount: number;
    _pattern: rm.types.CharacterPattern;
    _mainSprite: Sprite_Base;
    _shadowSprite: Sprite;
    _weaponSprite: Sprite_Weapon;
    _stateSprite: Sprite_StateOverlay;
    _actor: Game_Actor;
    initialize(battler?: Game_Actor): void;
    /**
     * Creates the main sprite of the sprite actor.
     *
     * @memberof Sprite_Actor
     */
    createMainSprite(): void;
    /**
     * Creates the shadow sprite of the sprite actor.
     *
     * @memberof Sprite_Actor
     */
    createShadowSprite(): void;
    /**
     * Sets the weapon sprite of the sprite actor.
     *
     * @memberof Sprite_Actor
     */
    createWeaponSprite(): void;
    /**
     * Creates the state sprite of the sprite actor.
     *
     * @memberof Sprite_Actor
     */
    createStateSprite(): void;
    /**
     * Sets the battler of the sprite actor.
     *
     * @param {Game_Actor} battler
     * @memberof Sprite_Actor
     */
    setBattler(battler: Game_Actor): void;
    /**
     * Moves the sprite actor to the start position.
     *
     * @memberof Sprite_Actor
     */
    moveToStartPosition(): void;
    setActorHome(index: number): void;
    updateShadow(): void;
    /**
     * Sets up motion on the sprite actor.
     *
     * @memberof Sprite_Actor
     */
    setupMotion(): void;
    /**
     * Sets up weapon animation on the sprite actor.
     *
     * @memberof Sprite_Actor
     */
    setupWeaponAnimation(): void;
    /**
     * Starts the motion given the specified motion
     * type.
     * @param {string} motionType
     * @memberof Sprite_Actor
     */
    startMotion(motionType: string): void;
    updateTargetPosition(): void;
    /**
     * Updates the sprite actor's movement.
     *
     * @memberof Sprite_Actor
     */
    updateMove(): void;
    /**
     * Updates the sprite actor's motion.
     *
     * @memberof Sprite_Actor
     */
    updateMotion(): void;
    updateMotionCount(): void;
    /**
     * Returns the speed of the motion for the sprite actor.
     *
     * @returns {number}
     * @memberof Sprite_Actor
     */
    motionSpeed(): number;
    /**
     * Refreshes the motion of the sprite actor.
     *
     * @memberof Sprite_Actor
     */
    refreshMotion(): void;
    /**
     * Starts the entry motion of the sprite actor.
     *
     * @memberof Sprite_Actor
     */
    startEntryMotion(): void;
    /**
     * Has the sprite actor step forward.
     *
     * @memberof Sprite_Actor
     */
    stepForward(): void;
    /**
     * Has the sprite actor step back.
     *
     * @memberof Sprite_Actor
     */
    stepBack(): void;
    /**
     * Has the sprite actor retreat.
     *
     * @memberof Sprite_Actor
     */
    retreat(): void;
    damageOffsetX(): number;
    damageOffsetY(): number;
    static MOTIONS: {abnormal: rm.types.Motion, chant: rm.types.Motion, damage: rm.types.Motion, dead: rm.types.Motion, dying: rm.types.Motion, escape: rm.types.Motion, evade: rm.types.Motion, guard: rm.types.Motion, item: rm.types.Motion, missile: rm.types.Motion, skill: rm.types.Motion, sleep: rm.types.Motion, spell: rm.types.Motion, swing: rm.types.Motion, thrust: rm.types.Motion, victory: rm.types.Motion, wait: rm.types.Motion, walk: rm.types.Motion};
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Animation
 *
 * The sprite for displaying an animation.
 */
declare class Sprite_Animation extends Sprite {
    protected constructor();
    /**
     * {
     * key: Animation
     * };
     */
    _checker1: { [key: string]: any };
    _target: Sprite_Base;
    _animation: rm.types.Animation;
    _mirror: boolean;
    _delay: number;
    _rate: number;
    _duration: number;
    _flashColor: number[];
    _flashDuration: number;
    _screenFlashDuration: number;
    _hidingDuration: number;
    _bitmap1: Bitmap;
    _bitmap2: Bitmap;
    _cellSprites: Sprite[];
    _screenFlashSprite: ScreenSprite;
    _duplicated: boolean;
    _reduceArtifacts: boolean;
    initMembers(): void;
    setup(target: Sprite_Base, animation: rm.types.Animation, mirror: boolean, delay: number): void;
    /**
     * Removes the sprite animation.
     *
     * @memberof Sprite_Animation
     */
    remove(): void;
    setupRate(): void;
    setupDuration(): void;
    /**
     * Updates the flash animation of the sprite animation.
     *
     * @memberof Sprite_Animation
     */
    updateFlash(): void;
    updateScreenFlash(): void;
    /**
     * Returns the absolute x position of the sprite animation.
     *
     * @returns {number}
     * @memberof Sprite_Animation
     */
    absoluteX(): number;
    /**
     * Returns the absolute y position of the sprite aniamtion.
     *
     * @returns {number}
     * @memberof Sprite_Animation
     */
    absoluteY(): number;
    /**
     * Updates the hiding of the sprite animation.
     *
     * @memberof Sprite_Animation
     */
    updateHiding(): void;
    /**
     * Returns true if the sprite animation is playing.
     *
     * @returns {boolean}
     * @memberof Sprite_Animation
     */
    isPlaying(): boolean;
    /**
     * Loads the bitmaps of the sprite animation.
     *
     * @memberof Sprite_Animation
     */
    loadBitmaps(): void;
    /**
     * Returns true if the sprite animation is ready.
     *
     * @returns {boolean}
     * @memberof Sprite_Animation
     */
    isReady(): boolean;
    /**
     * Create the sprites of the sprite animation.
     *
     * @memberof Sprite_Animation
     */
    createSprites(): void;
    /**
     * Create the cell sprites of the sprite animation.
     *
     * @memberof Sprite_Animation
     */
    createCellSprites(): void;
    /**
     * Create the screen flash sprite of the sprite animation.
     *
     * @memberof Sprite_Animation
     */
    createScreenFlashSprite(): void;
    /**
     * Updates the main loop of the sprite animation.
     *
     * @memberof Sprite_Animation
     */
    updateMain(): void;
    /**
     * Updates the position of the sprite animation.
     *
     * @memberof Sprite_Animation
     */
    updatePosition(): void;
    /**
     * Updates the frame of the sprite aniamtion.
     *
     * @memberof Sprite_Animation
     */
    updateFrame(): void;
    /**
     * Returns the current frame index of the sprite aniamtion.
     *
     * @returns {number}
     * @memberof Sprite_Animation
     */
    currentFrameIndex(): number;
    updateAllCellSprites(frame: number[][]): void;
    updateCellSprite(sprite: Sprite, cell: number[]): void;
    processTimingData(timing: rm.types.AnimationTiming): void;
    startFlash(color: number[], duration: number): void;
    startScreenFlash(color: number[], duration: number): void;
    /**
     * Starts hiding the sprite animation.
     *
     * @param {number} duration The duration of the hide.
     * @memberof Sprite_Animation
     */
    startHiding(duration: number): void;
    /**
     * Structure
     * {
     * key: Animation
     * };
     */
    static _checker2: { [key: string]: any };
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Balloon
 *
 * The sprite for displaying a balloon icon.
 */
declare class Sprite_Balloon extends Sprite_Base {
    protected constructor();
    _balloonId: rm.types.BalloonId;
    _duration: number;
    initMembers(): void;
    loadBitmap(): void;
    setup(balloonId: rm.types.BalloonId): void;
    /**
     * Updates the balloon sprite.
     *
     * @memberof Sprite_Balloon
     */
    update(): void;
    /**
     * Updates the balloon sprite frame.
     *
     * @memberof Sprite_Balloon
     */
    updateFrame(): void;
    /**
     * Returns the speed of the balloon animation.
     *
     * @returns {number}
     * @memberof Sprite_Balloon
     */
    speed(): number;
    /**
     * Returns the wait time.
     *
     * @returns {number}
     * @memberof Sprite_Balloon
     */
    waitTime(): number;
    /**
     * Returns the frame index of the balloon animation.
     *
     * @returns {number}
     * @memberof Sprite_Balloon
     */
    frameIndex(): number;
    /**
     * Returns true if the balloon animation is playing.
     *
     * @returns {boolean}
     * @memberof Sprite_Balloon
     */
    isPlaying(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Button
 *
 * The sprite for displaying a button.
 */
declare class Sprite_Button extends Sprite {
    protected constructor();
    _touching: boolean;
    _coldFrame: Rectangle;
    _hotFrame: Rectangle;
    _clickHandler: () => void;
    /**
     * Update method, which checks if the sprite is being touched and updates
     * the current frame.
     *
     * @memberof Sprite_Button
     */
    updateFrame(): void;
    /**
     * Set the button sprites cold frame.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     *
     * @memberof Sprite_Button
     *
     */
    setColdFrame(x: number, y: number, width: number, height: number): void;
    /**
     * Set the button sprites hot frame
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     *
     * @memberof Sprite_Button
     *
     */
    setHotFrame(x: number, y: number, width: number, height: number): void;
    /**
     * Creates a new handler and binds it to the button.
     *
     * @memberof Sprite_Button
     * @param method
     */
    setClickHandler(method: () => void): void;
    /**
     * Calls the handler method bound to the button.
     *
     * @memberof Sprite_Button
     */
    callClickHandler(): void;
    /**
     * Processes weather or not the button is being touched and calls the handler
     * bound to the button.
     * @memberof Sprite_Button
     */
    processTouch(): void;
    /**
     * Returns true if the sprite button is currently active.
     * @returns {boolean}
     * @memberof Sprite_Button
     */
    isActive(): boolean;
    /**
     * Returns true is the button is presently being touched.
     * @returns {boolean}
     * @memberof Sprite_Button
     */
    isButtonTouched(): boolean;
    /**
     * Changes the x coordinate of the screen to local sprite x coordinate.
     * @param {number} x
     * @returns {number}
     * @memberof Sprite_Button
     */
    canvasToLocalX(x: number): number;
    /**
     * Changes the y coordinate of the screen
     * to local sprite y coordinate.
     * @param {number} y
     * @returns {number}
     * @memberof Sprite_Button
     */
    canvasToLocalY(y: number): number;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Character
 *
 * The sprite for displaying a character.
 */
declare class Sprite_Character extends Sprite_Base {
    /**
     * Creates an instance of Sprite_Character.
     * @param {Game_Character} character
     * @memberof Sprite_Character
     */
    constructor(character: Game_Character);
    /**
     * The Game_Character object assigned
     * to the sprite.
     * @private var
     * @type {Game_Character}
     * @memberof Sprite_Character
     */
    _character: Game_Character|Game_Event|Game_Player;
    _balloonDuration: number;
    _tilesetId: number;
    _upperBody: Sprite;
    _lowerBody: Sprite;
    _bushDepth: number;
    /**
     * The current balloon sprite
     * assigned to the sprite.
     * @private var
     * @type {Sprite_Balloon}
     * @memberof Sprite_Character
     */
    _balloonSprite: Sprite_Balloon;
    initialize(character: Game_Character): void;
    initMembers(): void;
    /**
     * Sets the current Game_Character object
     * attached to the sprite.
     * @param {Game_Character} character
     * @memberof Sprite_Character
     */
    setCharacter(character: Game_Character): void;
    /**
     * Returns true if the Game_Character object
     * tileId is greater than 0.
     * @returns {boolean}
     * @memberof Sprite_Character
     */
    isTile(): boolean;
    tilesetBitmap(tileId: number): Bitmap;
    /**
     * Updates the bitmap of the sprite character.
     *
     * @memberof Sprite_Character
     */
    updateBitmap(): void;
    /**
     * Returns true if the sprite character image has changed.
     *
     * @returns {boolean}
     * @memberof Sprite_Character
     */
    isImageChanged(): boolean;
    setTileBitmap(): void;
    /**
     * Sets the sprite character bitmap.
     *
     * @memberof Sprite_Character
     */
    setCharacterBitmap(): void;
    /**
     * Updates the sprite character frame.
     *
     * @memberof Sprite_Character
     */
    updateFrame(): void;
    /**
     * Updates the sprite character tile frame.
     *
     * @memberof Sprite_Character
     */
    updateTileFrame(): void;
    /**
     * Updates the sprite character -- character frame.
     *
     * @memberof Sprite_Character
     */
    updateCharacterFrame(): void;
    characterBlockX(): number;
    characterBlockY(): number;
    /**
     * Returns the character x pattern.
     *
     * @returns {number}
     * @memberof Sprite_Character
     */
    characterPatternX(): rm.types.CharacterPattern;
    /**
     * Returns the character y pattern.
     *
     * @returns {number}
     * @memberof Sprite_Character
     */
    characterPatternY(): rm.types.CharacterPattern;
    /**
     * Returns the pattern width.
     *
     * @returns {number}
     * @memberof Sprite_Character
     */
    patternWidth(): number;
    /**
     * Returns the pattern height.
     *
     * @returns {number}
     * @memberof Sprite_Character
     */
    patternHeight(): number;
    updateHalfBodySprites(): void;
    createHalfBodySprites(): void;
    /**
     * Updates the position of the sprite character.
     *
     * @memberof Sprite_Character
     */
    updatePosition(): void;
    updateAnimation(): void;
    updateOther(): void;
    setupAnimation(): void;
    /**
     * Sets up the Game_Character object
     * balloon sprite, and calls the startBalloon method.
     * @memberof Sprite_Character
     */
    setupBalloon(): void;
    /**
     * Starts the balloon sprite on the
     * Game_Character object.
     * @memberof Sprite_Character
     */
    startBalloon(): void;
    /**
     * Processes the balloon sprite, calls
     * the endBaloon method if the balloon sprite is done playing.
     * @memberof Sprite_Character
     */
    updateBalloon(): void;
    /**
     * Ends the balloon sprite, removing it from
     * the Game_Character object sprite.
     * @memberof Sprite_Character
     */
    endBalloon(): void;
    /**
     * Returns true if a balloon animation
     * is playing on the character.
     * @returns {boolean}
     * @memberof Sprite_Character
     */
    isBalloonPlaying(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Damage
 *
 * The sprite for displaying a popup damage.
 */
declare class Sprite_Damage extends Sprite {
    protected constructor();
    __duration: number;
    /**
     * Array of 3 numbers of RGB
     */
    _flashColor: number[];
    _flashDuration: number;
    _damageBitmap: Bitmap;
    setup(target: Game_Actor): void;
    setupCriticalEffect(): void;
    /**
     * Returns the digit width of the sprite damage.
     *
     * @returns {number}
     * @memberof Sprite_Damage
     */
    digitWidth(): number;
    /**
     * Returns the digit height of the sprite damage.
     *
     * @returns {number}
     * @memberof Sprite_Damage
     */
    digitHeight(): number;
    /**
     * Creates the miss display of the damage sprite.
     *
     * @memberof Sprite_Damage
     */
    createMiss(): void;
    createDigits(baseRow: number, value: number): void;
    /**
     * Creates the child sprite of the damage sprite for displaying damage.
     *
     * @param {number} width The width of the sprite to add.
     * @param {number} height The height of the sprite to add.
     * @returns {Sprite}
     * @memberof Sprite_Damage
     */
    createChildSprite(width, height): Sprite;
    updateChild(sprite: Sprite): void;
    /**
     * Updates the flash of the damage sprite.
     *
     * @memberof Sprite_Damage
     */
    updateFlash(): void;
    /**
     * Updates the opacity of the damage sprite.
     *
     * @memberof Sprite_Damage
     */
    updateOpacity(): void;
    /**
     * Returns true if the damage sprite is playing.
     *
     * @returns {boolean}
     * @memberof Sprite_Damage
     */
    isPlaying(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Destination
 *
 * The sprite for displaying the destination place of the touch input.
 */
declare class Sprite_Destination extends Sprite {
    protected constructor();
    _frameCount: number;
    /**
     * Creates the destination bitmap of the destination sprite.
     *
     * @memberof Sprite_Destination
     */
    createBitmap(): void;
    /**
     * Updates the position of the destination sprite.
     *
     * @memberof Sprite_Destination
     */
    updatePosition(): void;
    /**
     * Updates the destination sprite animation.
     *
     * @memberof Sprite_Destination
     */
    updateAnimation(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Enemy
 *
 * The sprite for displaying an enemy.
 */
declare class Sprite_Enemy extends Sprite_Battler {
    constructor(battler: Game_Enemy);
    _enemy: Game_Enemy;
    _appeared: boolean;
    _battlerName: string;
    _battlerHue: number;
    _effectType: string;
    _effectDuration: number;
    _shake: number;
    _stateIconSprite: Sprite_StateIcon;
    initialize(battler: Game_Enemy): void;
    createStateIconSprite(): void;
    /**
     * Sets the battler to an instance of game enemy.
     *
     * @param {Game_Enemy} battler Instance of game enemy.
     * @memberof Sprite_Enemy
     */
    setBattler(battler: Game_Enemy): void;
    loadBitmap(name: string, hue: number): void;
    /**
     * Updates the state sprite on the sprite enemy.
     *
     * @memberof Sprite_Enemy
     */
    updateStateSprite(): void;
    initVisibility(): void;
    setupEffect(): void;
    startEffect(effectType: string): void;
    /**
     * Starts the appearinig effect on the sprite enemy.
     *
     * @memberof Sprite_Enemy
     */
    startAppear(): void;
    /**
     * Starts the disappearing effect on the sprite enemy.
     *
     * @memberof Sprite_Enemy
     */
    startDisappear(): void;
    /**
     * Starts the whiten effect on the sprite enemy.
     *
     * @memberof Sprite_Enemy
     */
    startWhiten(): void;
    /**
     * Starts the blink effect on the sprite enemy.
     *
     * @memberof Sprite_Enemy
     */
    startBlink(): void;
    /**
     * Starts the collapse effect of the sprite
     * enemy.
     * @memberof Sprite_Enemy
     */
    startCollapse(): void;
    /**
     * Starts the boss collapse effect of the sprite
     * enemy.
     * @memberof Sprite_Enemy
     */
    startBossCollapse(): void;
    /**
     * Starts the instant collapse effect of the sprite enemy.
     *
     * @memberof Sprite_Enemy
     */
    startInstantCollapse(): void;
    updateEffect(): void;
    /**
     * Returns true if the effect type on the sprite enemy
     * is not null.
     * @returns {boolean}
     * @memberof Sprite_Enemy
     */
    isEffecting(): boolean;
    /**
     * Revers the sprite enemy to a normal state.
     *
     * @memberof Sprite_Enemy
     */
    revertToNormal(): void;
    /**
     * Updates the whiten effect on the sprite enemy.
     *
     * @memberof Sprite_Enemy
     */
    updateWhiten(): void;
    /**
     * Updates the blink effect on the sprite enemy.
     *
     * @memberof Sprite_Enemy
     */
    updateBlink(): void;
    /**
     * Updates the appear effect on the sprite enemy.
     *
     * @memberof Sprite_Enemy
     */
    updateAppear(): void;
    updateDisappear(): void;
    /**
     * Updates the collapse effect.
     *
     * @memberof Sprite_Enemy
     */
    updateCollapse(): void;
    /**
     * Updates the boss collapse effect.
     *
     * @memberof Sprite_Enemy
     */
    updateBossCollapse(): void;
    /**
     * Updates the instant collapse effect.
     *
     * @memberof Sprite_Enemy
     */
    updateInstantCollapse(): void;
    damageOffsetX(): number;
    damageOffsetY(): number;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Picture
 *
 * The sprite for displaying a picture.
 */
declare class Sprite_Picture {
    constructor(pictureId: number);
    _pictureId: number;
    _pictureName: string;
    _isPicture: boolean;
    picture(): Game_Picture;
    updateBitmap(): void;
    updateOrigin(): void;
    updatePosition(): void;
    updateScale(): void;
    updateTone(): void;
    updateOther(): void;
    loadBitmap(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_StateIcon
 *
 * The sprite for displaying state icons.
 */
declare class Sprite_StateIcon extends Sprite {
    protected constructor();
    _battler: Game_Battler;
    _iconIndex: number;
    _animationCount: number;
    _animationIndex: number;
    /**
     * Initializes the sprite state icon properties.
     *
     * @memberof Sprite_StateIcon
     */
    initMembers(): void;
    /**
     * Loads the bitmap of the sprite state icon.
     *
     * @memberof Sprite_StateIcon
     */
    loadBitmap(): void;
    setup(battler: Game_Battler): void;
    animationWait(): number;
    /**
     * Updates the icon displayed in the icon sprite.
     *
     * @memberof Sprite_StateIcon
     */
    updateIcon(): void;
    /**
     * Updates the state icon sprite frame.
     *
     * @memberof Sprite_StateIcon
     */
    updateFrame(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_StateOverlay
 *
 * The sprite for displaying an overlay image for a state.
 */
declare class Sprite_StateOverlay extends Sprite_Base {
    protected constructor();
    _battler: Game_Battler;
    _overlayIndex: number;
    _animationCount: number;
    _pattern: number;
    /**
     * Initialize the overlay sprite properties.
     *
     * @memberof Sprite_StateOverlay
     */
    initMembers(): void;
    /**
     * Loads the bitmap of the overlay sprite.
     *
     * @memberof Sprite_StateOverlay
     */
    loadBitmap(): void;
    setup(battler: Game_Battler): void;
    animationWait(): number;
    /**
     * Updates the overlay sprite pattern.
     *
     * @memberof Sprite_StateOverlay
     */
    updatePattern(): void;
    /**
     * Updates the overlay sprite frame.
     *
     * @memberof Sprite_StateOverlay
     */
    updateFrame(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Timer
 *
 * The sprite for displaying the timer.
 */
declare class Sprite_Timer extends Sprite {
    protected constructor();
    _seconds: number;
    /**
     * Creates the bitmap of the sprite timer.
     *
     * @memberof Sprite_Timer
     */
    createBitmap(): void;
    /**
     * Updates the bitmap of the sprite timer.
     *
     * @memberof Sprite_Timer
     */
    updateBitmap(): void;
    /**
     * Redraws the sprite timer.
     *
     * @memberof Sprite_Timer
     */
    redraw(): void;
    /**
     * Returns the text of the timer.
     *
     * @returns {string} The text displayed on the timer.
     * @memberof Sprite_Timer
     */
    timerText(): string;
    /**
     * Updates the positon of the sprite timer.
     *
     * @memberof Sprite_Timer
     */
    updatePosition(): void;
    /**
     * Updates the visibility of the sprite timer.
     *
     * @memberof Sprite_Timer
     */
    updateVisibility(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Weapon
 *
 * The sprite for displaying a weapon image for attacking.
 */
declare class Sprite_Weapon extends Sprite_Base {
    protected constructor();
    _weaponImageId: rm.types.WeaponImageId;
    _animaationCount: number;
    _pattern: number;
    /**
     * Initializes the members of the weapon sprite object.
     *
     * @memberof Sprite_Weapon
     */
    initMembers(): void;
    setup(weaponImageId: rm.types.WeaponImageId): void;
    animationWait(): number;
    /**
     * Updates the pattern of the weapon sprite.
     *
     * @memberof Sprite_Weapon
     */
    updatePattern(): void;
    /**
     * Loads the bitmap of the weapon sprite.
     *
     * @memberof Sprite_Weapon
     */
    loadBitmap(): void;
    /**
     * Updates the weapon sprite frames.
     *
     * @memberof Sprite_Weapon
     */
    updateFrame(): void;
    /**
     * Returns true if the weapon sprite is playing.
     *
     * @returns {boolean}
     * @memberof Sprite_Weapon
     */
    isPlaying(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Spriteset_Base
 *
 * The superdeclare class of Spriteset_Map and Spriteset_Battle.
 */
declare class Spriteset_Base extends Sprite {
    protected constructor();
    _tone: number[];
    _baseSprite: Sprite;
    _blackScreen: ScreenSprite;
    _toneFilter: ToneFilter;
    _toneSprite: ToneSprite;
    _pictureContainer: Sprite;
    _timerSprite: Sprite_Timer;
    _flashSprite: ScreenSprite;
    _fadeSprite: ScreenSprite;
    /**
     * Creates the lower layer including the base sprites.
     *
     * @memberof Spriteset_Base
     */
    createLowerLayer(): void;
    /**
     * Creates the upper layer including the pictures,
     * timer, and screen sprites.
     * @memberof Spriteset_Base
     */
    createUpperLayer(): void;
    /**
     * Create the base sprite.
     *
     * @memberof Spriteset_Base
     */
    createBaseSprite(): void;
    /**
     * Creates the tone changer sprite.
     *
     * @memberof Spriteset_Base
     */
    createToneChanger(): void;
    /**
     * Creates the WebGL toner.
     *
     * @memberof Spriteset_Base
     */
    createWebGLToneChanger(): void;
    /**
     * Creates the Canvas tone.
     *
     * @memberof Spriteset_Base
     */
    createCanvasToneChanger(): void;
    /**
     * Creates a new sprite picture on the spritesetb ase.
     *
     * @memberof Spriteset_Base
     */
    createPictures(): void;
    /**
     * Creates a new Sprite timer on the spriteset base.
     *
     * @memberof Spriteset_Base
     */
    createTimer(): void;
    /**
     * Creates the screen sprite.
     *
     * @memberof Spriteset_Base
     */
    createScreenSprites(): void;
    /**
     * Updates the screen sprites on the spriteset base.
     *
     * @memberof Spriteset_Base
     */
    updateScreenSprites(): void;
    updateToneChanger(): void;
    /**
     * Updates the WebGL tone changer.
     *
     * @memberof Spriteset_Base
     */
    updateWebGLToneChanger(): void;
    /**
     * Updates the Canvas tone changer.
     *
     * @memberof Spriteset_Base
     */
    updateCanvasToneChanger(): void;
    /**
     * Updates the position of spriteset base.
     *
     * @memberof Spriteset_Base
     */
    updatePosition(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Spriteset_Battle
 *
 * The set of sprites on the battle screen.
 */
declare class Spriteset_Battle extends Spriteset_Base {
    protected constructor();
    _battlebackLocated: boolean;
    _backgroundSprite: Sprite;
    _battleField: Sprite;
    _back1Sprite: TilingSprite;
    _back2Sprite: TilingSprite;
    _enemySprites: Sprite_Enemy[];
    _actorSprites: Sprite_Actor[];
    /**
     * Creates the background of the battle spriteset.
     *
     * @memberof Spriteset_Battle
     */
    createBackground(): void;
    /**
     * Creates the battlefield of the battle spriteset.
     *
     * @memberof Spriteset_Battle
     */
    createBattleField(): void;
    /**
     * Creates the battleback of the battle spriteset.
     *
     * @memberof Spriteset_Battle
     */
    createBattleback(): void;
    /**
     * Updates the battleback of the battle spriteset.
     *
     * @memberof Spriteset_Battle
     */
    updateBattleback(): void;
    /**
     * Locates the battleback and adjusts the coordinates of the
     * battleback.
     * @memberof Spriteset_Battle
     */
    locateBattleback(): void;
    /**
     * Returns battleb ack 2 of the battle spriteset.
     *
     * @returns {Bitmap} Instance of the Bitmap class.
     * @memberof Spriteset_Battle
     */
    battleback1Bitmap(): Bitmap;
    /**
     * Returns battleback 2 of the battle spriteset.
     *
     * @returns {Bitmap} Instance of the Bitmap class.
     * @memberof Spriteset_Battle
     */
    battleback2Bitmap(): Bitmap;
    /**
     *
     *
     * @returns {string} Name of battleback 1 bitmap.
     * @memberof Spriteset_Battle
     */
    battleback1Name(): string;
    /**
     *
     *
     * @returns {string} Name of battleback 2 bitmap.
     * @memberof Spriteset_Battle
     */
    battleback2Name(): string;
    /**
     * Returns the battleback 1 name as a string.
     *
     * @returns {string} Name of overworld battleback 1 bitmap.
     * @memberof Spriteset_Battle
     */
    overworldBattleback1Name(): string;
    /**
     * Returns the battleback 2 name as a string.
     *
     * @returns {string} Name of overworld battleback 2 bitmap.
     * @memberof Spriteset_Battle
     */
    overworldBattleback2Name(): string;
    /**
     *
     *
     * @returns {string} Name of the normal battleback 1 bitmap.
     * @memberof Spriteset_Battle
     */
    normalBattleback1Name(): string;
    /**
     *
     *
     * @returns {string} Name of the normal battleback 2 bitmap.
     * @memberof Spriteset_Battle
     */
    normalBattleback2Name(): string;
    /**
     * Given the specified terrtain type, return
     * the battleback 1 name.
     * @param {number} type Terrain type.
     * @returns {string} Name of the terrtain battleback 1 bitmap.
     * @memberof Spriteset_Battle
     */
    terrainBattleback1Name(type: number): string;
    /**
     * Given the specified terrain type, return
     * the battleback 2 name.
     * @param {number} type Terrain type.
     * @returns {string} Name of the terrain battleback 2 bitmap.
     * @memberof Spriteset_Battle
     */
    terrainBattleback2Name(type: number): string;
    /**
     *
     *
     * @returns {string} Name of the default battleback 1 name.
     * @memberof Spriteset_Battle
     */
    defaultBattleback1Name(): string;
    /**
     *
     *
     * @returns {string} Name of the default battleback 2 name.
     * @memberof Spriteset_Battle
     */
    defaultBattleback2Name(): string;
    /**
     *
     *
     * @returns {string} Name of the ship battleback 1  bitmap.
     * @memberof Spriteset_Battle
     */
    shipBattleback1Name(): string;
    /**
     *
     *
     * @returns {string} Name of the ship battleback 2 bitmap.
     * @memberof Spriteset_Battle
     */
    shipBattleback2Name(): string;
    autotileType(z: number): number;
    /**
     * Creates sprite enemies for the battle spriteset.
     *
     * @memberof Spriteset_Battle
     */
    createEnemies(): void;
    compareEnemySprite(a: Sprite_Enemy, b: Sprite_Enemy): number;
    /**
     * Creates sprite actors for the battle spriteset.
     *
     * @memberof Spriteset_Battle
     */
    createActors(): void;
    /**
     * Updates the actor sprites on the battle spriteset.
     *
     * @memberof Spriteset_Battle
     */
    updateActors(): void;
    /**
     * Returns all battler sprites on the battle spriteset.
     *
     * @returns {Sprite_Battler[]}
     * @memberof Spriteset_Battle
     */
    battlerSprites(): Sprite_Battler[];
    /**
     * Returns true if animation is playing on the battle spriteset.
     *
     * @returns {boolean}
     * @memberof Spriteset_Battle
     */
    isAnimationPlaying(): boolean;
    isEffecting(): boolean;
    /**
     * Returns true if any sprite actor or enemy is moving.
     *
     * @returns {boolean} Representing whether any battle participants are moving.
     * @memberof Spriteset_Battle
     */
    isAnyoneMoving(): boolean;
    /**
     * Returns true if the battle spriteset is busy.
     *
     * @returns {boolean}
     * @memberof Spriteset_Battle
     */
    isBusy(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Spriteset_Map
 *
 * The set of sprites on the map screen.
 */
declare class Spriteset_Map extends Spriteset_Base {
    protected constructor();
    _parallax: TilingSprite;
    _tilemap: Tilemap | ShaderTilemap;
    _tileset: rm.types.Tileset;
    _characterSprites: Sprite_Character[];
    _shadowSprite: Sprite;
    _destinationSprite: Sprite_Destination;
    _weather: Weather;
    _parallaxName: string;
    /**
     * Hides the map spriteset character sprites.
     *
     * @memberof Spriteset_Map
     */
    hideCharacters(): void;
    /**
     * Creates the map spriteset parallax.
     *
     * @memberof Spriteset_Map
     */
    createParallax(): void;
    /**
     * Creates the map spriteset tile map.
     *
     * @memberof Spriteset_Map
     */
    createTilemap(): void;
    /**
     * Loads the map spriteset tileset.
     *
     * @memberof Spriteset_Map
     */
    loadTileset(): void;
    /**
     * Creates the map spriteset character sprite.
     *
     * @memberof Spriteset_Map
     */
    createCharacters(): void;
    /**
     * Creates the map spriteset shadow sprite.
     *
     * @memberof Spriteset_Map
     */
    createShadow(): void;
    /**
     * Creates the map spriteset destination sprite.
     *
     * @memberof Spriteset_Map
     */
    createDestination(): void;
    /**
     * Creates the map spriteset weather.
     *
     * @memberof Spriteset_Map
     */
    createWeather(): void;
    /**
     * Updates the map spriteset tileset.
     *
     * @memberof Spriteset_Map
     */
    updateTileset(): void;
    updateParallax(): void;
    /**
     * Updates the map spriteset tile map.
     *
     * @memberof Spriteset_Map
     */
    updateTilemap(): void;
    /**
     * Updates the map spriteset shadow.
     *
     * @memberof Spriteset_Map
     */
    updateShadow(): void;
    /**
     * Updates the map spriteset weather.
     *
     * @memberof Spriteset_Map
     */
    updateWeather(): void;
}
