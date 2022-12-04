declare function Sprite_Clickable(...args: any[]): void;
declare class Sprite_Clickable {
    constructor(...args: any[]);
    constructor: typeof Sprite_Clickable;
    initialize(): void;
    _pressed: boolean;
    _hovered: boolean;
    update(): void;
    processTouch(): void;
    isPressed(): boolean;
    isClickEnabled(): any;
    isBeingTouched(): any;
    hitTest(x: any, y: any): any;
    onMouseEnter(): void;
    onMouseExit(): void;
    onPress(): void;
    onClick(): void;
}
declare function Sprite_Button(...args: any[]): void;
declare class Sprite_Button {
    constructor(...args: any[]);
    constructor: typeof Sprite_Button;
    initialize(buttonType: any): void;
    _buttonType: any;
    _clickHandler: any;
    _coldFrame: Rectangle;
    _hotFrame: Rectangle;
    setupFrames(): void;
    blockWidth(): number;
    blockHeight(): number;
    loadButtonImage(): void;
    bitmap: any;
    buttonData(): any;
    update(): void;
    checkBitmap(): void;
    updateFrame(): void;
    updateOpacity(): void;
    opacity: number;
    setColdFrame(x: any, y: any, width: any, height: any): void;
    setHotFrame(x: any, y: any, width: any, height: any): void;
    setClickHandler(method: any): void;
    onClick(): void;
}
declare function Sprite_Character(...args: any[]): void;
declare class Sprite_Character {
    constructor(...args: any[]);
    constructor: typeof Sprite_Character;
    initialize(character: any): void;
    initMembers(): void;
    _character: any;
    _balloonDuration: number;
    _tilesetId: any;
    _upperBody: Sprite;
    _lowerBody: Sprite;
    setCharacter(character: any): void;
    checkCharacter(character: any): boolean;
    update(): void;
    updateVisibility(): void;
    visible: boolean;
    isTile(): any;
    isObjectCharacter(): any;
    isEmptyCharacter(): boolean;
    tilesetBitmap(tileId: any): any;
    updateBitmap(): void;
    _tileId: any;
    _characterName: any;
    _characterIndex: any;
    isImageChanged(): boolean;
    setTileBitmap(): void;
    bitmap: any;
    setCharacterBitmap(): void;
    _isBigCharacter: any;
    updateFrame(): void;
    updateTileFrame(): void;
    updateCharacterFrame(): void;
    characterBlockX(): number;
    characterBlockY(): number;
    characterPatternX(): any;
    characterPatternY(): number;
    patternWidth(): any;
    patternHeight(): any;
    updateHalfBodySprites(): void;
    createHalfBodySprites(): void;
    updatePosition(): void;
    x: any;
    y: any;
    z: any;
    updateOther(): void;
    opacity: any;
    blendMode: any;
    _bushDepth: any;
}
declare function Sprite_Battler(...args: any[]): void;
declare class Sprite_Battler {
    constructor(...args: any[]);
    constructor: typeof Sprite_Battler;
    initialize(battler: any): void;
    initMembers(): void;
    _battler: any;
    _damages: any[];
    _homeX: any;
    _homeY: any;
    _offsetX: any;
    _offsetY: any;
    _targetOffsetX: any;
    _targetOffsetY: any;
    _movementDuration: any;
    _selectionEffectCount: number;
    setBattler(battler: any): void;
    checkBattler(battler: any): boolean;
    mainSprite(): Sprite_Battler;
    setHome(x: any, y: any): void;
    update(): void;
    bitmap: any;
    updateVisibility(): void;
    visible: boolean;
    updateMain(): void;
    updateBitmap(): void;
    updateFrame(): void;
    updateMove(): void;
    updatePosition(): void;
    x: any;
    y: any;
    updateDamagePopup(): void;
    updateSelectionEffect(): void;
    setupDamagePopup(): void;
    createDamageSprite(): void;
    destroyDamageSprite(sprite: any): void;
    damageOffsetX(): number;
    damageOffsetY(): number;
    startMove(x: any, y: any, duration: any): void;
    onMoveEnd(): void;
    isEffecting(): boolean;
    isMoving(): boolean;
    inHomePosition(): boolean;
    onMouseEnter(): void;
    onPress(): void;
    onClick(): void;
}
declare function Sprite_Actor(...args: any[]): void;
declare class Sprite_Actor {
    constructor(...args: any[]);
    constructor: typeof Sprite_Actor;
    initialize(battler: any): void;
    initMembers(): void;
    _battlerName: any;
    _motion: any;
    _motionCount: number;
    _pattern: any;
    mainSprite(): Sprite;
    createMainSprite(): void;
    _mainSprite: Sprite;
    createShadowSprite(): void;
    _shadowSprite: Sprite;
    createWeaponSprite(): void;
    _weaponSprite: Sprite_Weapon;
    createStateSprite(): void;
    _stateSprite: Sprite_StateOverlay;
    setBattler(battler: any): void;
    _actor: any;
    moveToStartPosition(): void;
    setActorHome(index: any): void;
    update(): void;
    updateShadow(): void;
    updateMain(): void;
    setupMotion(): void;
    setupWeaponAnimation(): void;
    startMotion(motionType: any): void;
    updateTargetPosition(): void;
    shouldStepForward(): any;
    updateBitmap(): void;
    updateFrame(): void;
    updateMove(): void;
    updateMotion(): void;
    updateMotionCount(): void;
    motionSpeed(): number;
    refreshMotion(): void;
    startEntryMotion(): void;
    stepForward(): void;
    stepBack(): void;
    retreat(): void;
    onMoveEnd(): void;
    damageOffsetX(): number;
    damageOffsetY(): any;
}
declare namespace Sprite_Actor {
    namespace MOTIONS {
        namespace walk {
            const index: number;
            const loop: boolean;
        }
        namespace wait {
            const index_1: number;
            export { index_1 as index };
            const loop_1: boolean;
            export { loop_1 as loop };
        }
        namespace chant {
            const index_2: number;
            export { index_2 as index };
            const loop_2: boolean;
            export { loop_2 as loop };
        }
        namespace guard {
            const index_3: number;
            export { index_3 as index };
            const loop_3: boolean;
            export { loop_3 as loop };
        }
        namespace damage {
            const index_4: number;
            export { index_4 as index };
            const loop_4: boolean;
            export { loop_4 as loop };
        }
        namespace evade {
            const index_5: number;
            export { index_5 as index };
            const loop_5: boolean;
            export { loop_5 as loop };
        }
        namespace thrust {
            const index_6: number;
            export { index_6 as index };
            const loop_6: boolean;
            export { loop_6 as loop };
        }
        namespace swing {
            const index_7: number;
            export { index_7 as index };
            const loop_7: boolean;
            export { loop_7 as loop };
        }
        namespace missile {
            const index_8: number;
            export { index_8 as index };
            const loop_8: boolean;
            export { loop_8 as loop };
        }
        namespace skill {
            const index_9: number;
            export { index_9 as index };
            const loop_9: boolean;
            export { loop_9 as loop };
        }
        namespace spell {
            const index_10: number;
            export { index_10 as index };
            const loop_10: boolean;
            export { loop_10 as loop };
        }
        namespace item {
            const index_11: number;
            export { index_11 as index };
            const loop_11: boolean;
            export { loop_11 as loop };
        }
        namespace escape {
            const index_12: number;
            export { index_12 as index };
            const loop_12: boolean;
            export { loop_12 as loop };
        }
        namespace victory {
            const index_13: number;
            export { index_13 as index };
            const loop_13: boolean;
            export { loop_13 as loop };
        }
        namespace dying {
            const index_14: number;
            export { index_14 as index };
            const loop_14: boolean;
            export { loop_14 as loop };
        }
        namespace abnormal {
            const index_15: number;
            export { index_15 as index };
            const loop_15: boolean;
            export { loop_15 as loop };
        }
        namespace sleep {
            const index_16: number;
            export { index_16 as index };
            const loop_16: boolean;
            export { loop_16 as loop };
        }
        namespace dead {
            const index_17: number;
            export { index_17 as index };
            const loop_17: boolean;
            export { loop_17 as loop };
        }
    }
}
declare function Sprite_Enemy(...args: any[]): void;
declare class Sprite_Enemy {
    constructor(...args: any[]);
    constructor: typeof Sprite_Enemy;
    initialize(battler: any): void;
    initMembers(): void;
    _enemy: any;
    _appeared: any;
    _battlerName: any;
    _battlerHue: any;
    _effectType: any;
    _effectDuration: any;
    _shake: number;
    createStateIconSprite(): void;
    _stateIconSprite: Sprite_StateIcon;
    setBattler(battler: any): void;
    update(): void;
    updateBitmap(): void;
    loadBitmap(name: any): void;
    bitmap: any;
    setHue(hue: any): void;
    updateFrame(): void;
    updatePosition(): void;
    updateStateSprite(): void;
    initVisibility(): void;
    opacity: number;
    setupEffect(): void;
    startEffect(effectType: any): void;
    startAppear(): void;
    startDisappear(): void;
    startWhiten(): void;
    startBlink(): void;
    startCollapse(): void;
    startBossCollapse(): void;
    startInstantCollapse(): void;
    updateEffect(): void;
    isEffecting(): boolean;
    revertToNormal(): void;
    blendMode: number;
    updateWhiten(): void;
    updateBlink(): void;
    updateAppear(): void;
    updateDisappear(): void;
    updateCollapse(): void;
    updateBossCollapse(): void;
    updateInstantCollapse(): void;
    damageOffsetX(): any;
    damageOffsetY(): number;
}
declare function Sprite_Animation(...args: any[]): void;
declare class Sprite_Animation {
    constructor(...args: any[]);
    constructor: typeof Sprite_Animation;
    initialize(): void;
    initMembers(): void;
    _targets: any;
    _animation: any;
    _mirror: any;
    _delay: any;
    _previous: any;
    _effect: any;
    _handle: any;
    _playing: boolean;
    _started: boolean;
    _frameIndex: number;
    _maxTimingFrames: any;
    _flashColor: any;
    _flashDuration: any;
    _viewportSize: number;
    z: number;
    destroy(options: any): void;
    setup(targets: any, animation: any, mirror: any, delay: any, previous: any): void;
    update(): void;
    canStart(): boolean;
    shouldWaitForPrevious(): boolean;
    updateEffectGeometry(): void;
    updateMain(): void;
    processSoundTimings(): void;
    processFlashTimings(): void;
    checkEnd(): void;
    updateFlash(): void;
    isPlaying(): boolean;
    setRotation(x: any, y: any, z: any): void;
    _render(renderer: any): void;
    setProjectionMatrix(renderer: any): void;
    setCameraMatrix(): void;
    setViewport(renderer: any): void;
    targetPosition(renderer: any): Point;
    targetSpritePosition(sprite: any): any;
    resetViewport(renderer: any): void;
    onBeforeRender(renderer: any): void;
    onAfterRender(renderer: any): void;
}
declare function Sprite_AnimationMV(...args: any[]): void;
declare class Sprite_AnimationMV {
    constructor(...args: any[]);
    constructor: typeof Sprite_AnimationMV;
    initialize(): void;
    initMembers(): void;
    _targets: any;
    _animation: any;
    _mirror: any;
    _delay: any;
    _rate: number;
    _duration: number;
    _flashColor: any;
    _flashDuration: any;
    _screenFlashDuration: any;
    _hidingDuration: any;
    _hue1: any;
    _hue2: any;
    _bitmap1: any;
    _bitmap2: any;
    _cellSprites: any[];
    _screenFlashSprite: ScreenSprite;
    z: number;
    setup(targets: any, animation: any, mirror: any, delay: any): void;
    setupRate(): void;
    setupDuration(): void;
    update(): void;
    updateFlash(): void;
    updateScreenFlash(): void;
    absoluteX(): number;
    absoluteY(): number;
    updateHiding(): void;
    isPlaying(): boolean;
    loadBitmaps(): void;
    isReady(): any;
    createCellSprites(): void;
    createScreenFlashSprite(): void;
    updateMain(): void;
    updatePosition(): void;
    x: any;
    y: any;
    updateFrame(): void;
    currentFrameIndex(): number;
    updateAllCellSprites(frame: any): void;
    updateCellSprite(sprite: any, cell: any): void;
    processTimingData(timing: any): void;
    startFlash(color: any, duration: any): void;
    startScreenFlash(color: any, duration: any): void;
    startHiding(duration: any): void;
    onEnd(): void;
}
declare function Sprite_Battleback(...args: any[]): void;
declare class Sprite_Battleback {
    constructor(...args: any[]);
    constructor: typeof Sprite_Battleback;
    initialize(type: any): void;
    bitmap: any;
    adjustPosition(): void;
    width: number;
    height: number;
    x: number;
    y: number;
    battleback1Bitmap(): any;
    battleback2Bitmap(): any;
    battleback1Name(): any;
    battleback2Name(): any;
    overworldBattleback1Name(): string;
    overworldBattleback2Name(): string;
    normalBattleback1Name(): string;
    normalBattleback2Name(): string;
    terrainBattleback1Name(type: any): "Wasteland" | "DirtField" | "Desert" | "Lava1" | "Lava2" | "Snowfield" | "Clouds" | "PoisonSwamp";
    terrainBattleback2Name(type: any): "Wasteland" | "Desert" | "Snowfield" | "Clouds" | "PoisonSwamp" | "Forest" | "Cliff" | "Lava";
    defaultBattleback1Name(): string;
    defaultBattleback2Name(): string;
    shipBattleback1Name(): string;
    shipBattleback2Name(): string;
    autotileType(z: any): any;
}
declare function Sprite_Damage(...args: any[]): void;
declare class Sprite_Damage {
    constructor(...args: any[]);
    constructor: typeof Sprite_Damage;
    initialize(): void;
    _duration: number;
    _flashColor: number[];
    _flashDuration: number;
    _colorType: number;
    destroy(options: any): void;
    setup(target: any): void;
    setupCriticalEffect(): void;
    fontFace(): any;
    fontSize(): any;
    damageColor(): any;
    outlineColor(): string;
    outlineWidth(): number;
    createMiss(): void;
    createDigits(value: any): void;
    createChildSprite(width: any, height: any): Sprite;
    createBitmap(width: any, height: any): Bitmap;
    update(): void;
    updateChild(sprite: any): void;
    updateFlash(): void;
    updateOpacity(): void;
    opacity: number;
    isPlaying(): boolean;
}
declare function Sprite_Gauge(...args: any[]): void;
declare class Sprite_Gauge {
    constructor(...args: any[]);
    constructor: typeof Sprite_Gauge;
    initialize(): void;
    initMembers(): void;
    _battler: any;
    _statusType: any;
    _value: any;
    _maxValue: any;
    _targetValue: any;
    _targetMaxValue: any;
    _duration: number;
    _flashingCount: number;
    destroy(options: any): void;
    createBitmap(): void;
    bitmap: Bitmap;
    bitmapWidth(): number;
    bitmapHeight(): number;
    textHeight(): number;
    gaugeHeight(): number;
    gaugeX(): number;
    labelY(): number;
    labelFontFace(): any;
    labelFontSize(): number;
    valueFontFace(): any;
    valueFontSize(): number;
    setup(battler: any, statusType: any): void;
    update(): void;
    updateBitmap(): void;
    updateTargetValue(value: any, maxValue: any): void;
    smoothness(): 5 | 20;
    updateGaugeAnimation(): void;
    updateFlashing(): void;
    flashingColor1(): number[];
    flashingColor2(): number[];
    isValid(): any;
    currentValue(): any;
    currentMaxValue(): any;
    label(): any;
    gaugeBackColor(): any;
    gaugeColor1(): any;
    gaugeColor2(): any;
    labelColor(): any;
    labelOutlineColor(): any;
    labelOutlineWidth(): number;
    valueColor(): any;
    valueOutlineColor(): string;
    valueOutlineWidth(): number;
    redraw(): void;
    drawGauge(): void;
    drawGaugeRect(x: any, y: any, width: any, height: any): void;
    gaugeRate(): number;
    drawLabel(): void;
    setupLabelFont(): void;
    measureLabelWidth(): number;
    labelOpacity(): 255 | 160;
    drawValue(): void;
    setupValueFont(): void;
}
declare function Sprite_Name(...args: any[]): void;
declare class Sprite_Name {
    constructor(...args: any[]);
    constructor: typeof Sprite_Name;
    initialize(): void;
    initMembers(): void;
    _battler: any;
    _name: any;
    _textColor: any;
    destroy(options: any): void;
    createBitmap(): void;
    bitmap: Bitmap;
    bitmapWidth(): number;
    bitmapHeight(): number;
    fontFace(): any;
    fontSize(): any;
    setup(battler: any): void;
    update(): void;
    updateBitmap(): void;
    name(): any;
    textColor(): any;
    outlineColor(): any;
    outlineWidth(): number;
    redraw(): void;
    setupFont(): void;
}
declare function Sprite_StateIcon(...args: any[]): void;
declare class Sprite_StateIcon {
    constructor(...args: any[]);
    constructor: typeof Sprite_StateIcon;
    initialize(): void;
    initMembers(): void;
    _battler: any;
    _iconIndex: any;
    _animationCount: number;
    _animationIndex: number;
    loadBitmap(): void;
    bitmap: any;
    setup(battler: any): void;
    update(): void;
    animationWait(): number;
    updateIcon(): void;
    shouldDisplay(): any;
    updateFrame(): void;
}
declare function Sprite_StateOverlay(...args: any[]): void;
declare class Sprite_StateOverlay {
    constructor(...args: any[]);
    constructor: typeof Sprite_StateOverlay;
    initialize(): void;
    initMembers(): void;
    _battler: any;
    _overlayIndex: any;
    _animationCount: number;
    _pattern: number;
    loadBitmap(): void;
    bitmap: any;
    setup(battler: any): void;
    update(): void;
    animationWait(): number;
    updatePattern(): void;
    updateFrame(): void;
}
declare function Sprite_Weapon(...args: any[]): void;
declare class Sprite_Weapon {
    constructor(...args: any[]);
    constructor: typeof Sprite_Weapon;
    initialize(): void;
    initMembers(): void;
    _weaponImageId: any;
    _animationCount: number;
    _pattern: number;
    x: number;
    setup(weaponImageId: any): void;
    update(): void;
    animationWait(): number;
    updatePattern(): void;
    loadBitmap(): void;
    bitmap: any;
    updateFrame(): void;
    isPlaying(): boolean;
}
declare function Sprite_Balloon(...args: any[]): void;
declare class Sprite_Balloon {
    constructor(...args: any[]);
    constructor: typeof Sprite_Balloon;
    initialize(): void;
    initMembers(): void;
    _target: any;
    _balloonId: any;
    _duration: number;
    z: number;
    loadBitmap(): void;
    bitmap: any;
    setup(targetSprite: any, balloonId: any): void;
    update(): void;
    updatePosition(): void;
    x: any;
    y: number;
    updateFrame(): void;
    speed(): number;
    waitTime(): number;
    frameIndex(): number;
    isPlaying(): boolean;
}
declare function Sprite_Picture(...args: any[]): void;
declare class Sprite_Picture {
    constructor(...args: any[]);
    constructor: typeof Sprite_Picture;
    initialize(pictureId: any): void;
    _pictureId: any;
    _pictureName: any;
    picture(): any;
    update(): void;
    updateBitmap(): void;
    visible: boolean;
    bitmap: any;
    updateOrigin(): void;
    updatePosition(): void;
    x: number;
    y: number;
    updateScale(): void;
    updateTone(): void;
    updateOther(): void;
    opacity: any;
    blendMode: any;
    rotation: number;
    loadBitmap(): void;
}
declare function Sprite_Timer(...args: any[]): void;
declare class Sprite_Timer {
    constructor(...args: any[]);
    constructor: typeof Sprite_Timer;
    initialize(): void;
    _seconds: any;
    destroy(options: any): void;
    createBitmap(): void;
    bitmap: Bitmap;
    fontFace(): any;
    fontSize(): any;
    update(): void;
    updateBitmap(): void;
    redraw(): void;
    timerText(): string;
    updatePosition(): void;
    x: number;
    y: number;
    updateVisibility(): void;
    visible: any;
}
declare function Sprite_Destination(...args: any[]): void;
declare class Sprite_Destination {
    constructor(...args: any[]);
    constructor: typeof Sprite_Destination;
    initialize(): void;
    _frameCount: number;
    destroy(options: any): void;
    update(): void;
    visible: boolean;
    createBitmap(): void;
    bitmap: Bitmap;
    blendMode: number;
    updatePosition(): void;
    x: number;
    y: number;
    updateAnimation(): void;
    opacity: number;
}
declare function Spriteset_Base(...args: any[]): void;
declare class Spriteset_Base {
    constructor(...args: any[]);
    constructor: typeof Spriteset_Base;
    initialize(): void;
    _animationSprites: any[];
    destroy(options: any): void;
    loadSystemImages(): void;
    createLowerLayer(): void;
    createUpperLayer(): void;
    update(): void;
    createBaseSprite(): void;
    _baseSprite: Sprite;
    _blackScreen: ScreenSprite;
    createBaseFilters(): void;
    _baseColorFilter: ColorFilter;
    createPictures(): void;
    _pictureContainer: Sprite;
    pictureContainerRect(): Rectangle;
    createTimer(): void;
    _timerSprite: Sprite_Timer;
    createOverallFilters(): void;
    filters: any[];
    _overallColorFilter: ColorFilter;
    updateBaseFilters(): void;
    updateOverallFilters(): void;
    updatePosition(): void;
    x: number;
    y: number;
    findTargetSprite(): any;
    updateAnimations(): void;
    processAnimationRequests(): void;
    createAnimation(request: any): void;
    createAnimationSprite(targets: any, animation: any, mirror: any, delay: any): void;
    isMVAnimation(animation: any): boolean;
    makeTargetSprites(targets: any): any[];
    lastAnimationSprite(): any;
    isAnimationForEach(animation: any): boolean;
    animationBaseDelay(): number;
    animationNextDelay(): number;
    animationShouldMirror(target: any): any;
    removeAnimation(sprite: any): void;
    removeAllAnimations(): void;
    isAnimationPlaying(): boolean;
}
declare function Spriteset_Map(...args: any[]): void;
declare class Spriteset_Map {
    constructor(...args: any[]);
    constructor: typeof Spriteset_Map;
    initialize(): void;
    _balloonSprites: any[];
    destroy(options: any): void;
    loadSystemImages(): void;
    createLowerLayer(): void;
    update(): void;
    hideCharacters(): void;
    createParallax(): void;
    _parallax: TilingSprite;
    createTilemap(): void;
    _effectsContainer: Tilemap;
    _tilemap: Tilemap;
    loadTileset(): void;
    _tileset: any;
    createCharacters(): void;
    _characterSprites: any[];
    createShadow(): void;
    _shadowSprite: Sprite;
    createDestination(): void;
    _destinationSprite: Sprite_Destination;
    createWeather(): void;
    _weather: Weather;
    updateTileset(): void;
    updateParallax(): void;
    _parallaxName: any;
    updateTilemap(): void;
    updateShadow(): void;
    updateWeather(): void;
    updateBalloons(): void;
    processBalloonRequests(): void;
    createBalloon(request: any): void;
    removeBalloon(sprite: any): void;
    removeAllBalloons(): void;
    findTargetSprite(target: any): any;
    animationBaseDelay(): number;
}
declare function Spriteset_Battle(...args: any[]): void;
declare class Spriteset_Battle {
    constructor(...args: any[]);
    constructor: typeof Spriteset_Battle;
    initialize(): void;
    _battlebackLocated: boolean;
    loadSystemImages(): void;
    createLowerLayer(): void;
    createBackground(): void;
    _backgroundFilter: any;
    _backgroundSprite: Sprite;
    createBattleback(): void;
    _back1Sprite: Sprite_Battleback;
    _back2Sprite: Sprite_Battleback;
    createBattleField(): void;
    _battleField: Sprite;
    _effectsContainer: Sprite;
    battleFieldOffsetY(): number;
    update(): void;
    updateBattleback(): void;
    createEnemies(): void;
    _enemySprites: Sprite_Enemy[];
    compareEnemySprite(a: any, b: any): number;
    createActors(): void;
    _actorSprites: any[];
    updateActors(): void;
    findTargetSprite(target: any): any;
    battlerSprites(): Sprite_Enemy[];
    isEffecting(): boolean;
    isAnyoneMoving(): boolean;
    isBusy(): any;
}
