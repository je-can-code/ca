 
//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.6 PIXEL-ABS] Bridges J-Pixelistics with J-ABS for combat-aware pixel movement.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Pixelistics
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Pixelistics
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is J-ABS-Pixelistics: the JABS integration layer for
 * J-Pixelistics.
 *
 * It adapts JABS-specific behavior (ally AI formation movement, JABS battler
 * hitbox queries, action/projectile pixel distance scaling, and the dodge
 * step-count multiplier) to work with the fractional-coordinate system
 * provided by J-Pixelistics.
 *
 * ----------------------------------------------------------------------------
 * REQUIREMENTS
 * - J-Base  (any recent version)
 * - J-ABS   (v4.11.0+)
 * - J-Pixelistics (v1.0.0+)
 *
 * Load order in RPG Maker plugin manager:
 *   J-Base → J-ABS → J-Pixelistics → J-ABS-Pixelistics
 *
 * ----------------------------------------------------------------------------
 * HITBOX SIZE
 * Enemy battlers now share one rectangular hitbox model across:
 *  - PIXEL movement/body collision
 *  - JABS battler targeting/collision
 *  - JABS battler hitbox overlays
 *
 * The hitbox is centered horizontally on the event and anchored vertically to
 * the event's feet, meaning the feet are the bottom-center of the rectangle.
 *
 * Apply hitbox size in either place:
 *  - enemy note
 *  - event comments on the battler page
 *
 * If both exist, the event comment wins.
 * If neither exists, the plugin parameter defaults are used.
 *
 * Tag formats:
 *   <hitboxSize:N>
 *    Square shorthand. N is both the width and height in tiles.
 *
 *   <hitboxSize:[W, H]>
 *    Explicit rectangle. W is width in tiles, H is height in tiles.
 *
 * Examples:
 *   <hitboxSize:1.0>
 *    A 1.0 x 1.0 tile square hitbox.
 *
 *   <hitboxSize:[0.8, 0.5]>
 *    A rectangle 0.8 tiles wide and 0.5 tiles tall.
 *
 * ----------------------------------------------------------------------------
 * HITBOX REVEAL
 * Enemy battlers can optionally reveal a faint hitbox outline when the player
 * is nearby, using the same battler AABB model as combat collision.
 *
 * Apply reveal range in either place:
 *  - enemy note
 *  - event comments on the battler page
 *
 * If both exist, the event comment wins.
 * If neither exists, the plugin parameter default is used.
 *
 * Tag format:
 *   <hitboxReveal:N>
 *    Reveal this battler's hitbox outline while the player is within N tiles.
 *
 * Example:
 *   <hitboxReveal:4.5>
 *    The outline is visible when the player is within 4.5 tiles.
 *
 * If the default range is 0, then proximity-based outlines are disabled unless
 * the always-active plugin parameter is enabled.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.6
 *    Added enemy `hitboxReveal` support for proximity-based hitbox outlines in `J-ABS-Pixelistics`.
 *    Added an always-active outline option and a default reveal-range plugin parameter.
 * - 1.0.5
 *    Added unified enemy `hitboxSize` support across PIXEL movement, JABS battler collision,
 *    and battler hitbox overlays.
 *    `event > enemy > default` precedence now applies to enemy hitbox sizing.
 *    Added default enemy hitbox width/height plugin parameters.
 * - 1.0.4
 *    `angleToDirection` folds atan2 vs `dir8ToAngle` degrees into one sector map so keyboard north and analog aim agree.
 * - 1.0.3
 *    `JABS_AiManager` and `JABS_Battler` integration for defensive dodge with pixel movement and formation rules.
 * - 1.0.2
 *    While strafe (direction fix) is active on the leader, projectile base direction follows
 *    sprite facing instead of movement vector — avoids firing opposite the drawn facing.
 * - 1.0.1
 *    Leader projectile aim uses vector / analog input (8-dir) so diagonals match movement.
 *    Sprites stay 4-dir; load order remains J-Base → J-ABS → J-Pixelistics → this plugin.
 * - 1.0.0
 *    Initial release as the JABS integration layer for J-Pixelistics.
 *    Pixel-aware idle wander state machine: idle enemies pick a random
 *    passable destination within the configured wander radius, walk to it,
 *    wait 2–5 seconds, then repeat.
 *    idleWanderRadius plugin parameter (default 1.5 tiles).
 *    Stuck detection: abandons unreachable destinations after 1.5s.
 *    Dodge step count scaled by subcell density so dodge distance matches
 *    the intended tile distance.
 *    Collision table rebuilt when an enemy is defeated.
 *    Smart pixel-aware movement for ally formation, retreating, and
 *    returning to home point.
 *    While the party leader is in pivot guard (one input: lock in place, guard
 *    when eligible), player map movement and dash reassert are disabled.
 * ============================================================================
 *
 *
 * @param idleConfigs
 * @text IDLE MOVEMENT
 *
 * @param idleWanderRadius
 * @parent idleConfigs
 * @type number
 * @decimals 2
 * @min 0.50
 * @max 10.00
 * @text Idle Wander Radius
 * @desc Distance in tiles from home an enemy may wander while idle. Default 1.5 gives a 3x3-tile area.
 * @default 1.50
 *
 * @param enemyHitboxConfigs
 * @text ENEMY HITBOX
 *
 * @param defaultEnemyHitboxWidth
 * @parent enemyHitboxConfigs
 * @type number
 * @decimals 2
 * @min 0.05
 * @text Default Enemy Hitbox Width
 * @desc Full enemy hitbox width in tiles when no event or enemy override exists.
 * @default 0.80
 *
 * @param defaultEnemyHitboxHeight
 * @parent enemyHitboxConfigs
 * @type number
 * @decimals 2
 * @min 0.05
 * @text Default Enemy Hitbox Height
 * @desc Full enemy hitbox height in tiles when no event or enemy override exists.
 * @default 0.50
 *
 * @param outlineAlwaysActive
 * @parent enemyHitboxConfigs
 * @type boolean
 * @text Outline Always Active
 * @desc If true, all eligible battler hitbox outlines are always visible regardless of range.
 * @default false
 *
 * @param defaultHitboxRevealRange
 * @parent enemyHitboxConfigs
 * @type number
 * @decimals 2
 * @min 0
 * @text Default Hitbox Reveal Range
 * @desc Reveal hitbox outlines within this many tiles when no event or enemy override exists. 0 disables proximity mode.
 * @default 6.00
 *
 */
//endregion annotations

//region plugin metadata
/**
 * Plugin metadata class for J-ABS-Pixelistics.
 */
class JAbsPixelistics_PluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   * @param {string} name The plugin name.
   * @param {string} version The plugin version.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   * Extends {@link #postInitialize}.<br>
   * Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The radius in tiles from home that an idle enemy may wander.
     * A value of 1.5 produces a 3x3-tile wander area centered on the home point.
     * @type {number}
     */
    this.IdleWanderRadius = parseFloat(this.parsedPluginParameters['idleWanderRadius']) || 1.50;

    /**
     * The default enemy hitbox width in tiles when no override is provided.
     * This is the full width, not a half-width/radius.
     * @type {number}
     */
    this.DefaultEnemyHitboxWidth = parseFloat(this.parsedPluginParameters['defaultEnemyHitboxWidth']) || 0.80;

    /**
     * The default enemy hitbox height in tiles when no override is provided.
     * This is the full height, not a half-height/radius.
     * @type {number}
     */
    this.DefaultEnemyHitboxHeight = parseFloat(this.parsedPluginParameters['defaultEnemyHitboxHeight']) || 0.50;

    /**
     * Whether or not all eligible battler hitbox outlines should always be visible.
     * When enabled, reveal range requirements are ignored completely.
     * @type {boolean}
     */
    this.EnemyHitboxOutlineAlwaysActive = this.parsedPluginParameters['outlineAlwaysActive'] === 'true';

    // parse the configured reveal range once so we can distinguish missing from explicit zero.
    const configuredRevealRange = parseFloat(this.parsedPluginParameters['defaultHitboxRevealRange']);

    /**
     * The default range in tiles for revealing enemy hitbox outlines.
     * A value of 0 disables proximity-based outlines unless always-active mode is enabled.
     * @type {number}
     */
    this.DefaultEnemyHitboxRevealRange = Number.isNaN(configuredRevealRange)
      ? 6.00
      : configuredRevealRange;
  }
}
//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 * Nested under J.PIXEL.EXT to follow the extension convention:
 * J.PIXEL owns this namespace; ABS is the consuming context.
 */
J.PIXEL.EXT ||= {};

/**
 * The extension namespace for J-ABS-Pixelistics.
 * Sentinel: check `J.PIXEL.EXT.ABS` to detect whether this plugin is loaded.
 */
J.PIXEL.EXT.ABS = {};

/**
 * The metadata associated with this plugin.
 */
J.PIXEL.EXT.ABS.Metadata = new JAbsPixelistics_PluginMetadata('J-ABS-Pixelistics', '1.0.6');

/**
 * A collection of regex patterns for this plugin.
 */
J.PIXEL.EXT.ABS.RegExp = {};

/**
 * Optional per-enemy hitbox size override.
 * Supports either a square shorthand or explicit width/height rectangle in tiles.
 */
J.PIXEL.EXT.ABS.RegExp.HitboxSize =
  /<hitboxSize:[ ]?(\[[ ]?[+-]?\d+(?:\.\d+)?[ ]?,[ ]?[+-]?\d+(?:\.\d+)?[ ]?]|[+-]?\d+(?:\.\d+)?)>/i;

/**
 * Optional per-enemy hitbox reveal range override.
 *
 * <pre>
 * Structure:
 *  <hitboxReveal:RANGE>
 *
 * Example:
 *  <hitboxReveal:6.5>
 *
 * Translation:
 *  Reveal this battler's hitbox outline while the player is within 6.5 tiles.
 * </pre>
 * @type {RegExp}
 */
J.PIXEL.EXT.ABS.RegExp.HitboxReveal = /<hitboxReveal:[ ]?([+-]?\d+(?:\.\d+)?)>/i;

/**
 * A collection of all aliased methods for this plugin.
 */
J.PIXEL.EXT.ABS.Aliased = {
  Game_CharacterBase: new Map(),
  Game_Event: new Map(),
  Game_Player: new Map(),
  JABS_AiManager: new Map(),
  JABS_Battler: new Map(),
  JABS_Engine: new Map(),
  Spriteset_Map: new Map(),
};
//endregion metadata
//endregion initialization

//region RPG_Enemy
/**
 * Normalizes raw hitbox size note data into the canonical width/height model.
 * @param {string|number|number[]|null} rawHitboxSize The raw hitbox size data.
 * @returns {{widthTiles:number,heightTiles:number}|null}
 */
RPG_Enemy.hitboxSizeDataFromRaw = function(rawHitboxSize)
{
  // if no override exists, then there is nothing to normalize.
  if (rawHitboxSize === null || rawHitboxSize === undefined) return null;

  // parse the raw note payload into an engine-friendly object.
  const parsedHitboxSize = JsonMapper.parseObject(rawHitboxSize);

  // if the shorthand number was provided, then it represents a square hitbox.
  if (typeof parsedHitboxSize === 'number')
  {
    // reject invalid sizes so callers can fall back cleanly.
    if (parsedHitboxSize <= 0) return null;

    // the shorthand applies equally to width and height.
    return {
      widthTiles: parsedHitboxSize,
      heightTiles: parsedHitboxSize,
    };
  }

  // if the rectangle form was provided, then normalize its dimensions.
  if (Array.isArray(parsedHitboxSize))
  {
    // deconstruct the rectangle into width and height.
    const [ widthTiles, heightTiles ] = parsedHitboxSize;

    // reject invalid rectangles so callers can fall back cleanly.
    if (widthTiles <= 0 || heightTiles <= 0) return null;

    // return the normalized rectangle.
    return {
      widthTiles,
      heightTiles,
    };
  }

  // anything else is malformed and should be ignored.
  return null;
};

/**
 * The enemy hitbox size override from this database note, if any.
 * @type {{widthTiles:number,heightTiles:number}|null}
 */
Object.defineProperty(RPG_Enemy.prototype, 'hitboxSizeData', {
  get: function()
  {
    // grab the raw hitbox payload from the notes.
    const rawHitboxSize = RPGManager.getStringFromNoteByRegex(this, J.PIXEL.EXT.ABS.RegExp.HitboxSize, true);

    // normalize the found data into the shared runtime model.
    return RPG_Enemy.hitboxSizeDataFromRaw(rawHitboxSize);
  },
});

/**
 * The enemy hitbox reveal range override from this database note, if any.
 * @type {number|null}
 */
Object.defineProperty(RPG_Enemy.prototype, 'hitboxRevealRange', {
  get: function()
  {
    // grab the configured reveal range from the notes.
    return RPGManager.getNumberFromNoteByRegex(this, J.PIXEL.EXT.ABS.RegExp.HitboxReveal, true);
  },
});
//endregion RPG_Enemy

//region JABS_AiManager
/**
 * Overrides {@link #canMoveIdly}.<br/>
 * With pixel-idle wander the timing is managed entirely by the destination/wait
 * state machine on the battler. The external frame-gate and random roll are not needed.
 * @param {JABS_Battler} battler The battler checking idle movement readiness.
 * @returns {boolean} Always true; the battler's own state machine controls pacing.
 */
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set('canMoveIdly', JABS_AiManager.canMoveIdly);
// eslint-disable-next-line no-unused-vars
JABS_AiManager.canMoveIdly = function(battler)
{
  return true;
};

/**
 * Overrides {@link #moveIdly}.<br/>
 * Delegates to the battler's pixel-aware idle wander state machine rather than
 * calling the tile-step moveRandom, which only advances a single distancePerFrame pixel.
 * @param {JABS_Battler} battler The battler moving idly.
 */
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set('moveIdly', JABS_AiManager.moveIdly);
JABS_AiManager.moveIdly = function(battler)
{
  battler.updatePixelIdleWander();
};

/**
 * Overrides {@link #goHome}.<br/>
 * Uses pixel-aware smart movement toward the home coordinates so the battler glides
 * home smoothly instead of shuffling one distancePerFrame pixel at a time via moveStraight.
 * @param {JABS_Battler} battler The battler returning to its home point.
 */
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set('goHome', JABS_AiManager.goHome);
JABS_AiManager.goHome = function(battler)
{
  // use pixel-aware movement rather than a tile-step moveStraight.
  battler.smartMoveTowardCoordinates(battler.getHomeX(), battler.getHomeY());

  // once close enough to home, transition to idle state.
  if (battler.isHome())
  {
    battler.setIdle(true);
  }
};

/**
 * Keeps allies within leash range of the leader, even during combat.
 * If beyond leash, snap back and clear movement to avoid drift.
 * @param {JABS_Battler} allyBattler The ally battler.
 */
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set("rubberbandAlly", JABS_AiManager.rubberbandAlly);
JABS_AiManager.rubberbandAlly = function(allyBattler)
{
  // Acquire characters and compute fractional distance.
  const allyCharacter = allyBattler.getCharacter();

  allyBattler.lockEngagement();
  allyBattler.disengageTarget();
  allyBattler.resetAllAggro(null, true);
  allyBattler.unlockEngagement();

  // Snap and clear pixel movement state.
  allyCharacter.jumpToPlayer();
  allyCharacter.stopPixelMoving();
};

/**
 * Extends {@link #moveTowardSlotIfNeeded}.<br/>
 * Replaces movement with PIXEL-aware hysteresis and near-target throttling to prevent sliding.
 * This implementation does NOT call the original; it fully handles formation movement.
 * @param {JABS_Battler} allyBattler The ally battler.
 * @param {number} desiredX The desired slot x (fractional center).
 * @param {number} desiredY The desired slot y (fractional center).
 */
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set("moveTowardSlotIfNeeded", JABS_AiManager.moveTowardSlotIfNeeded);
JABS_AiManager.moveTowardSlotIfNeeded = function(allyBattler, desiredX, desiredY)
{
  // dodge pipeline owns the ally sprite until endDodge; skip formation pull during forced dodge.
  if (allyBattler.isDodging())
  {
    return;
  }

  if (allyBattler.guarding())
  {
    return;
  }

  // acquire the character once.
  const chr = allyBattler.getCharacter();

  // resolve tolerances.
  // default if ALLYAI not present.
  let tolerance = 0.45;

  // extra ring outside tolerance for gentle throttling near target.
  const hysteresis = 0.25;

  if (J.ABS.EXT.ALLYAI && J.ABS.EXT.ALLYAI.Metadata)
  {
    // use the configured formation tolerance if available.
    tolerance = J.ABS.EXT.ALLYAI.Metadata.FormationTolerance;
  }

  // compute Euclidean distance to the target point using fractional coords.
  const dx = chr.x - desiredX;
  const dy = chr.y - desiredY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // if within tolerance, do not micro-adjust and ensure we are truly idle.
  if (dist <= tolerance)
  {
    // snap to logical to ensure no residual drift and clear any transient motion.
    chr.stopPixelMoving();

    // do not issue a move when already within tolerance.
    return;
  }

  // determine the near-range threshold for light throttling.
  const nearThreshold = tolerance + hysteresis;

  // if inside the near ring, allow only occasional nudges (every other frame) to prevent micro-drifting.
  if (dist <= nearThreshold)
  {
    // If we recently moved, skip this frame to avoid overshooting.
    if (chr.isPixelOnCooldown())
    {
      // do not move this frame while on cooldown.
      return;
    }

    // if able to move, issue a single smart step and set a short cooldown.
    if (allyBattler.canBattlerMove())
    {
      // execute a smart step toward the target slot.
      allyBattler.smartMoveTowardCoordinates(desiredX, desiredY);

      // set a short, local cooldown (1 frame) to reduce micro-steps and sliding.
      chr.setPixelMoveCooldown(1);
    }

    // done processing near-range.
    return;
  }

  // we are far enough away: move every frame without throttling for responsiveness.
  if (allyBattler.canBattlerMove())
  {
    // execute the smart step toward the target slot.
    allyBattler.smartMoveTowardCoordinates(desiredX, desiredY);
  }
};

/**
 * Overrides {@link #calculateFormationSlotCoordinates}.<br/>
 * Calculates considering the tile center.
 * @param {number} lx The leader's x coordinate.
 * @param {number} rx The rotated x.
 * @param {number} ly The leader's y coordinate.
 * @param {number} ry The rotated y.
 * @returns {[number, number]}
 */
JABS_AiManager.calculateFormationSlotCoordinates = function(lx, rx, ly, ry)
{
  // compute absolute slot tile by applying the rotated offset and target the tile center.
  const sx = lx + rx + 0.5;
  const sy = ly + ry + 0.5;

  // return slot coords (fractional center).
  return [ sx, sy ];
};

/**
 * Overrides {@link #isWithinTolerance}.<br/>
 * Checks if a battler is within a Euclidean tolerance of the target point.
 * @param {JABS_Battler} allyBattler The ally battler.
 * @param {number} targetX The target x (fractional center).
 * @param {number} targetY The target y (fractional center).
 * @param {number} tolerance The allowed range before moving.
 * @returns {boolean} True if within tolerance, false otherwise.
 */
JABS_AiManager.isWithinTolerance = function(allyBattler, targetX, targetY, tolerance)
{
  // compute Euclidean distance to the target using fractional coords.
  const chr = allyBattler.getCharacter();
  const dx = chr.x - targetX;
  const dy = chr.y - targetY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // return whether or not we are close enough.
  return dist <= tolerance;
};
//endregion JABS_AiManager

//region JABS_Engine
/**
 * Extends {@link JABS_Engine.getBattlerAabbModel}.<br>
 * Enemy battlers with PIXEL hitbox-size data provide their own feet-anchored
 * rectangular AABB so JABS combat collision and overlays stay synchronized.
 * @param {Game_CharacterBase} character The character whose AABB is being queried.
 * @returns {JABS_Aabb}
 */
J.PIXEL.EXT.ABS.Aliased.JABS_Engine.set('getBattlerAabbModel', JABS_Engine.getBattlerAabbModel);
JABS_Engine.getBattlerAabbModel = function(character)
{
  // if the character exposes a custom battler hitbox model, then use it.
  if (character && typeof character.getPixelAbsBattlerAabbModel === 'function')
  {
    const customAabb = character.getPixelAbsBattlerAabbModel();

    // if a custom model exists, then it is the single source of truth.
    if (customAabb)
    {
      return customAabb;
    }
  }

  // otherwise, perform original logic.
  return J.PIXEL.EXT.ABS.Aliased.JABS_Engine.get('getBattlerAabbModel').call(this, character);
};
//endregion JABS_Engine

//region Game_CharacterBase
/**
 * Extends {@link Game_CharacterBase.isOverlappingSolidTiles}.<br>
 * Enemy battlers with rectangular hitboxes need tile overlap checks based on the
 * full feet-anchored rectangle instead of a square radius around the center.
 * @param {number} px The proposed pivot x in tile units.
 * @param {number} py The proposed pivot y in tile units.
 * @param {number} radius The compatibility radius from PIXEL core.
 * @returns {boolean}
 */
J.PIXEL.EXT.ABS.Aliased.Game_CharacterBase.set(
  'isOverlappingSolidTiles',
  Game_CharacterBase.prototype.isOverlappingSolidTiles);
Game_CharacterBase.prototype.isOverlappingSolidTiles = function(px, py, radius)
{
  // if this character does not expose a custom rectangular hitbox, then perform original logic.
  if (typeof this.hasCustomPixelHitbox !== 'function' || this.hasCustomPixelHitbox() === false)
  {
    return J.PIXEL.EXT.ABS.Aliased.Game_CharacterBase.get('isOverlappingSolidTiles').call(this, px, py, radius);
  }

  // build the full tile-space rectangle from the feet-anchored PIXEL hitbox.
  const hitbox = this._pixelHitbox(this.getEffectiveRadius());
  const left = px + hitbox.hx;
  const right = left + hitbox.w;
  const top = py + hitbox.hy;
  const bottom = top + hitbox.h;

  // define tiny epsilon to bias away from seams when flooring.
  const eps = 1e-6;

  // compute the inclusive bounds of tiles overlapped by the full rectangle.
  const minCol = Math.floor(left + eps);
  const maxCol = Math.floor(right - eps);
  const minRow = Math.floor(top + eps);
  const maxRow = Math.floor(bottom - eps);

  // iterate all overlapped tiles.
  for (let ty = minRow; ty <= maxRow; ty++)
  {
    for (let tx = minCol; tx <= maxCol; tx++)
    {
      // treat out-of-bounds as solid.
      if ($gameMap.isValid(tx, ty) === false)
      {
        return true;
      }

      // determine if this tile has any passable cardinal direction at all.
      const anyPass =
        $gameMap.isPassable(tx, ty, J.PIXEL.Directions.DOWN) ||
        $gameMap.isPassable(tx, ty, J.PIXEL.Directions.LEFT) ||
        $gameMap.isPassable(tx, ty, J.PIXEL.Directions.RIGHT) ||
        $gameMap.isPassable(tx, ty, J.PIXEL.Directions.UP);

      // a tile with no passable cardinals is a solid wall tile.
      if (anyPass === false)
      {
        return true;
      }
    }
  }

  return false;
};

/**
 * Extends {@link Game_CharacterBase.isCharacterCollisionAt}.<br>
 * Character-vs-character overlap needs one shared PIXEL AABB builder so every
 * battler is compared in the same pivot-aware coordinate space.
 * @param {number} px Proposed x in fractional tiles.
 * @param {number} py Proposed y in fractional tiles.
 * @param {number=} radius Optional collision half-size in tiles.
 * @returns {boolean}
 */
J.PIXEL.EXT.ABS.Aliased.Game_CharacterBase.set(
  'isCharacterCollisionAt',
  Game_CharacterBase.prototype.isCharacterCollisionAt);
Game_CharacterBase.prototype.isCharacterCollisionAt = function(px, py, radius = 0.35)
{
  // acquire the player reference.
  const player = $gamePlayer;

  // acquire follower references.
  const followers = player._followers._data;

  // build the party list (player + followers).
  const party = [ player ].concat(followers);

  // determine if this character is part of the party.
  const selfIsParty = party.includes(this);

  // gather all map events as initial candidates.
  const events = $gameMap.events();

  // initialize candidate collection.
  const candidates = [];

  // add events that can collide.
  events.forEach(ev =>
  {
    // exclude self.
    if (ev === this) return;

    // exclude erased events.
    if (ev.isErased()) return;

    // exclude events flagged as through.
    if (ev.isThrough()) return;

    // exclude events that are not normal priority.
    if (ev.isNormalPriority() === false) return;

    // exclude JABS action sprites so they do not block physical movement.
    if (J.ABS && ev.isJabsAction()) return;

    // include this event as a candidate.
    candidates.push(ev);
  });

  // only add the player/followers if self is not a party member.
  if (selfIsParty === false)
  {
    // add the player as a candidate when not through.
    if (player !== this && player.isThrough() === false)
    {
      candidates.push(player);
    }

    // add followers that can collide.
    followers.forEach(f =>
    {
      // exclude self.
      if (f === this) return;

      // exclude through followers.
      if (f.isThrough()) return;

      candidates.push(f);
    });
  }

  /**
   * Builds a tile-space AABB for collision testing from the character's current
   * PIXEL pivot and hitbox data.
   * @param {Game_CharacterBase} character The character being represented.
   * @param {number} logicalX The logical x coordinate to evaluate.
   * @param {number} logicalY The logical y coordinate to evaluate.
   * @param {number} halfRadius The compatibility radius for square footprints.
   * @returns {{left:number,right:number,top:number,bottom:number}}
   */
  const buildCharacterAabb = function(character, logicalX, logicalY, halfRadius)
  {
    // build from the same pivot-aware hitbox data that PIXEL movement/overlay use.
    const pivotX = logicalX + character.getCollisionPivotX();
    const pivotY = logicalY + character.getCollisionPivotY();
    const hitbox = character._pixelHitbox(halfRadius);
    const left = pivotX + hitbox.hx;
    const top = pivotY + hitbox.hy;

    return {
      left,
      right: left + hitbox.w,
      top,
      bottom: top + hitbox.h,
    };
  };

  /**
   * Determines whether or not two tile-space rectangles overlap.
   * Edge-touching is not treated as overlap, matching the legacy scalar logic.
   * @param {{left:number,right:number,top:number,bottom:number}} a The first rect.
   * @param {{left:number,right:number,top:number,bottom:number}} b The second rect.
   * @returns {boolean}
   */
  const rectanglesOverlap = function(a, b)
  {
    return a.left < b.right
      && a.right > b.left
      && a.top < b.bottom
      && a.bottom > b.top;
  };

  // build the self footprint at the proposed logical location.
  const selfAabb = buildCharacterAabb(this, px, py, radius);

  // probe the AABB for each candidate.
  for (let i = 0; i < candidates.length; i++)
  {
    // grab the candidate.
    const ch = candidates[i];

    // extra defense: skip JABS action sprites even if accidentally included above.
    if (J.ABS && ch.isJabsAction())
    {
      continue;
    }

    // the legacy footprint uses the candidate's effective radius around its logical position.
    const candidateRadius = ch.getEffectiveRadius();
    const candidateAabb = buildCharacterAabb(ch, ch.x, ch.y, candidateRadius);

    // if the rectangles overlap, then movement would collide.
    if (rectanglesOverlap(selfAabb, candidateAabb))
    {
      return true;
    }
  }

  return false;
};
//endregion Game_CharacterBase

//region Game_Event
/**
 * Extends {@link #initMembers}.<br>
 * Also initializes the cached enemy hitbox size data.
 */
J.PIXEL.EXT.ABS.Aliased.Game_Event.set('initMembers', Game_Event.prototype.initMembers);
Game_Event.prototype.initMembers = function()
{
  // perform original logic.
  J.PIXEL.EXT.ABS.Aliased.Game_Event.get('initMembers').call(this);

  // initialize our pixel-ABS hitbox cache.
  this.initPixelAbsHitboxData();
};

/**
 * Extends {@link #setupPageSettings}.<br>
 * Rebuilds the cached hitbox data whenever the active page changes.
 */
J.PIXEL.EXT.ABS.Aliased.Game_Event.set('setupPageSettings', Game_Event.prototype.setupPageSettings);
Game_Event.prototype.setupPageSettings = function()
{
  // perform original logic first so battler core data is current.
  J.PIXEL.EXT.ABS.Aliased.Game_Event.get('setupPageSettings').call(this);

  // refresh the resolved hitbox data for the new page.
  this.refreshPixelAbsHitboxSizeData();

  // refresh the resolved hitbox reveal data for the new page.
  this.refreshPixelAbsHitboxRevealRange();
};

/**
 * Initializes the cached pixel-ABS enemy hitbox data.
 */
Game_Event.prototype.initPixelAbsHitboxData = function()
{
  // ensure the shared extension data structure exists.
  this._j ||= {};
  this._j._pixel ||= {};
  this._j._pixel._abs ||= {};

  // initialize the cached hitbox size to nothing.
  this._j._pixel._abs._hitboxSizeData = null;

  // initialize the cached hitbox reveal range to nothing.
  this._j._pixel._abs._hitboxRevealRange = null;
};

/**
 * Gets the cached enemy hitbox size data for this event.
 * @returns {{widthTiles:number,heightTiles:number}|null}
 */
Game_Event.prototype.getPixelAbsHitboxSizeData = function()
{
  // if our cache was somehow never initialized, then do so now.
  if (!this._j || !this._j._pixel || !this._j._pixel._abs)
  {
    this.initPixelAbsHitboxData();
  }

  return this._j._pixel._abs._hitboxSizeData;
};

/**
 * Sets the cached enemy hitbox size data for this event.
 * @param {{widthTiles:number,heightTiles:number}|null} hitboxSizeData The resolved data.
 */
Game_Event.prototype.setPixelAbsHitboxSizeData = function(hitboxSizeData)
{
  // if our cache was somehow never initialized, then do so now.
  if (!this._j || !this._j._pixel || !this._j._pixel._abs)
  {
    this.initPixelAbsHitboxData();
  }

  // null means this event should use the vanilla PIXEL footprint.
  if (hitboxSizeData === null)
  {
    this._j._pixel._abs._hitboxSizeData = null;
    return;
  }

  // store a fresh copy to avoid accidental external mutation.
  this._j._pixel._abs._hitboxSizeData = {
    widthTiles: hitboxSizeData.widthTiles,
    heightTiles: hitboxSizeData.heightTiles,
  };
};

/**
 * Refreshes the resolved enemy hitbox size for this event.
 */
Game_Event.prototype.refreshPixelAbsHitboxSizeData = function()
{
  // only JABS enemy battlers participate in this shared hitbox model.
  if (this.canUsePixelAbsHitboxSize() === false)
  {
    this.setPixelAbsHitboxSizeData(null);
    return;
  }

  // resolve in precedence order: event > enemy > default.
  const hitboxSizeData = this.getPixelAbsHitboxSizeCommentOverride()
    ?? this.getPixelAbsHitboxSizeEnemyFallback()
    ?? this.getPixelAbsDefaultHitboxSizeData();

  // cache the found size for the runtime systems that need it.
  this.setPixelAbsHitboxSizeData(hitboxSizeData);
};

/**
 * Determines whether or not this event should use PIXEL-ABS battler hitbox data.
 * @returns {boolean}
 */
Game_Event.prototype.canUsePixelAbsEnemyHitboxData = function()
{
  // if this event is not a JABS battler, then this feature does not apply.
  if (typeof this.isJabsBattler !== 'function') return false;
  if (this.isJabsBattler() === false) return false;

  // only enemy battlers with a valid enemy id should use this path.
  if (typeof this.getBattlerId !== 'function') return false;
  if (this.getBattlerId() <= 0) return false;

  return true;
};

/**
 * Determines whether or not this event should use the unified enemy hitbox model.
 * @returns {boolean}
 */
Game_Event.prototype.canUsePixelAbsHitboxSize = function()
{
  return this.canUsePixelAbsEnemyHitboxData();
};

/**
 * Whether or not this event currently has a resolved custom hitbox model.
 * @returns {boolean}
 */
Game_Event.prototype.hasCustomPixelHitbox = function()
{
  return !!this.getPixelAbsHitboxSizeData();
};

/**
 * Gets the event comment override for hitbox size, if any.
 * @returns {{widthTiles:number,heightTiles:number}|null}
 */
Game_Event.prototype.getPixelAbsHitboxSizeCommentOverride = function()
{
  // if the event cannot parse comments, then there can be no override.
  if (typeof this.extractValueByRegex !== 'function') return null;

  // grab the raw comment payload and normalize it into the shared model.
  const rawHitboxSize = this.extractValueByRegex(J.PIXEL.EXT.ABS.RegExp.HitboxSize, null, false);
  return RPG_Enemy.hitboxSizeDataFromRaw(rawHitboxSize);
};

/**
 * Gets the cached enemy hitbox reveal range for this event.
 * @returns {number|null}
 */
Game_Event.prototype.getPixelAbsHitboxRevealRange = function()
{
  // if our cache was somehow never initialized, then do so now.
  if (!this._j || !this._j._pixel || !this._j._pixel._abs)
  {
    this.initPixelAbsHitboxData();
  }

  return this._j._pixel._abs._hitboxRevealRange;
};

/**
 * Sets the cached enemy hitbox reveal range for this event.
 * @param {number|null} hitboxRevealRange The resolved reveal range.
 */
Game_Event.prototype.setPixelAbsHitboxRevealRange = function(hitboxRevealRange)
{
  // if our cache was somehow never initialized, then do so now.
  if (!this._j || !this._j._pixel || !this._j._pixel._abs)
  {
    this.initPixelAbsHitboxData();
  }

  // store the resolved reveal range for later visibility checks.
  this._j._pixel._abs._hitboxRevealRange = hitboxRevealRange;
};

/**
 * Refreshes the resolved enemy hitbox reveal range for this event.
 */
Game_Event.prototype.refreshPixelAbsHitboxRevealRange = function()
{
  // only eligible JABS battlers participate in this feature.
  if (this.canUsePixelAbsEnemyHitboxData() === false)
  {
    this.setPixelAbsHitboxRevealRange(null);
    return;
  }

  // check the event comments first for a local override.
  const commentOverride = this.getPixelAbsHitboxRevealCommentOverride();
  if (commentOverride !== null)
  {
    this.setPixelAbsHitboxRevealRange(commentOverride);
    return;
  }

  // next, check the enemy notes for a database-level fallback.
  const enemyFallback = this.getPixelAbsHitboxRevealEnemyFallback();
  if (enemyFallback !== null)
  {
    this.setPixelAbsHitboxRevealRange(enemyFallback);
    return;
  }

  // otherwise, use the plugin default.
  this.setPixelAbsHitboxRevealRange(this.getPixelAbsDefaultHitboxRevealRange());
};

/**
 * Gets the event comment override for hitbox reveal range, if any.
 * @returns {number|null}
 */
Game_Event.prototype.getPixelAbsHitboxRevealCommentOverride = function()
{
  // if the event cannot parse comments, then there can be no override.
  if (typeof this.extractValueByRegex !== 'function') return null;

  // grab the reveal range directly from the event comments.
  return this.extractValueByRegex(J.PIXEL.EXT.ABS.RegExp.HitboxReveal, null, true);
};

/**
 * Gets the enemy database fallback hitbox size, if any.
 * @returns {{widthTiles:number,heightTiles:number}|null}
 */
Game_Event.prototype.getPixelAbsHitboxSizeEnemyFallback = function()
{
  // grab the shared enemy database data.
  const enemyData = this.getPixelAbsEnemyData();

  // if the enemy data is unavailable, then skip this fallback.
  if (!enemyData) return null;

  return enemyData.hitboxSizeData;
};

/**
 * Gets the enemy database fallback hitbox reveal range, if any.
 * @returns {number|null}
 */
Game_Event.prototype.getPixelAbsHitboxRevealEnemyFallback = function()
{
  // grab the shared enemy database data.
  const enemyData = this.getPixelAbsEnemyData();

  // if the enemy data is unavailable, then skip this fallback.
  if (!enemyData) return null;

  return enemyData.hitboxRevealRange;
};

/**
 * Gets the shared enemy database data for this battler event.
 * @returns {RPG_Enemy|null}
 */
Game_Event.prototype.getPixelAbsEnemyData = function()
{
  // grab the enemy id associated with this battler event.
  const battlerId = this.getBattlerId();

  // if somehow the battler id is invalid, then there is no fallback.
  if (battlerId <= 0) return null;

  // grab the cached enemy battler wrapper.
  const enemyBattler = $gameEnemies.enemy(battlerId);

  // if the battler wrapper is unavailable, then skip the fallback.
  if (!enemyBattler) return null;

  // grab the hydrated database data behind the battler.
  return enemyBattler.enemy();
};

/**
 * Gets the plugin-default hitbox size for enemy battlers.
 * @returns {{widthTiles:number,heightTiles:number}}
 */
Game_Event.prototype.getPixelAbsDefaultHitboxSizeData = function()
{
  return {
    widthTiles: J.PIXEL.EXT.ABS.Metadata.DefaultEnemyHitboxWidth,
    heightTiles: J.PIXEL.EXT.ABS.Metadata.DefaultEnemyHitboxHeight,
  };
};

/**
 * Gets the plugin-default hitbox reveal range for enemy battlers.
 * @returns {number}
 */
Game_Event.prototype.getPixelAbsDefaultHitboxRevealRange = function()
{
  return J.PIXEL.EXT.ABS.Metadata.DefaultEnemyHitboxRevealRange;
};

/**
 * Determines whether or not hitbox outlines should be visible for all eligible battlers.
 * @returns {boolean}
 */
Game_Event.prototype.isPixelAbsHitboxRevealAlwaysActive = function()
{
  return J.PIXEL.EXT.ABS.Metadata.EnemyHitboxOutlineAlwaysActive;
};

/**
 * Determines whether or not this battler's hitbox outline should currently be shown.
 * @returns {boolean}
 */
Game_Event.prototype.canShowPixelAbsHitboxReveal = function()
{
  // only eligible JABS battlers can reveal their hitboxes.
  if (this.canUsePixelAbsEnemyHitboxData() === false)
  {
    return false;
  }

  // invincible battlers cannot be struck, so they should not display the strike outline.
  const jabsBattler = this.getJabsBattler();
  if (!jabsBattler) return false;
  if (jabsBattler.isInvincible())
  {
    return false;
  }

  // always-active mode bypasses all range checks.
  if (this.isPixelAbsHitboxRevealAlwaysActive())
  {
    return true;
  }

  // zero or negative range means this feature is currently disabled for this battler.
  const revealRange = this.getPixelAbsHitboxRevealRange();
  if (revealRange <= 0)
  {
    return false;
  }

  // reveal the outline when the player is close enough.
  return revealRange >= this.distanceFromPlayer();
};

/**
 * Gets this event's hitbox as a PIXEL-style tile-space AABB.
 * @param {number=} logicalX The logical map x to evaluate from.
 * @param {number=} logicalY The logical map y to evaluate from.
 * @returns {{left:number,top:number,right:number,bottom:number,width:number,height:number}}
 */
Game_Event.prototype.getPixelAbsHitboxTileAabb = function(logicalX = this.x, logicalY = this.y)
{
  // build the hitbox against the event's current pivoting rules.
  const pivotX = logicalX + this.getCollisionPivotX();
  const pivotY = logicalY + this.getCollisionPivotY();
  const hitbox = this._pixelHitbox(this.getEffectiveRadius());
  const left = pivotX + hitbox.hx;
  const top = pivotY + hitbox.hy;

  return {
    left,
    top,
    right: left + hitbox.w,
    bottom: top + hitbox.h,
    width: hitbox.w,
    height: hitbox.h,
  };
};

/**
 * Builds the battler AABB model for JABS using this event's resolved hitbox.
 * @returns {JABS_Aabb|null}
 */
Game_Event.prototype.getPixelAbsBattlerAabbModel = function()
{
  // only provide a custom model when the shared enemy hitbox is active.
  if (this.hasCustomPixelHitbox() === false) return null;

  // convert the resolved tile dimensions into screen pixels.
  const { widthTiles, heightTiles } = this.getPixelAbsHitboxSizeData();
  const widthPixels = widthTiles * $gameMap.tileWidth();
  const heightPixels = heightTiles * $gameMap.tileHeight();
  const left = this.screenX() - (widthPixels / 2);
  const top = this.screenY() - heightPixels;

  return new JABS_Aabb(left, top, widthPixels, heightPixels);
};

/**
 * Extends {@link Game_Event.getCollisionRadius}.<br>
 * The rectangle is canonical, but PIXEL still asks for a scalar in some paths.
 * Use the larger half-extent as the compatibility radius.
 * @returns {number}
 */
J.PIXEL.EXT.ABS.Aliased.Game_Event.set('getCollisionRadius', Game_Event.prototype.getCollisionRadius);
Game_Event.prototype.getCollisionRadius = function()
{
  // if this event does not use the shared model, then perform original logic.
  if (this.hasCustomPixelHitbox() === false)
  {
    return J.PIXEL.EXT.ABS.Aliased.Game_Event.get('getCollisionRadius').call(this);
  }

  // use the larger half-extent as the compatibility radius.
  const { widthTiles, heightTiles } = this.getPixelAbsHitboxSizeData();
  return Math.max(widthTiles, heightTiles) / 2;
};

/**
 * Extends {@link Game_Event.getEffectiveRadius}.<br>
 * Feet-anchored rectangles are already normalized, so the compatibility radius
 * should not be clamped by the legacy downward-bleed rule.
 * @returns {number}
 */
J.PIXEL.EXT.ABS.Aliased.Game_Event.set('getEffectiveRadius', Game_Event.prototype.getEffectiveRadius);
Game_Event.prototype.getEffectiveRadius = function()
{
  // if this event does not use the shared model, then perform original logic.
  if (this.hasCustomPixelHitbox() === false)
  {
    return J.PIXEL.EXT.ABS.Aliased.Game_Event.get('getEffectiveRadius').call(this);
  }

  // our compatibility radius is already derived from the resolved rectangle.
  return this.getCollisionRadius();
};

/**
 * Extends {@link Game_Event.getCollisionPivotY}.<br>
 * Enemy hitboxes are feet-anchored, so the pivot becomes the event feet.
 * @returns {number}
 */
J.PIXEL.EXT.ABS.Aliased.Game_Event.set('getCollisionPivotY', Game_Event.prototype.getCollisionPivotY);
Game_Event.prototype.getCollisionPivotY = function()
{
  // if this event does not use the shared model, then perform original logic.
  if (this.hasCustomPixelHitbox() === false)
  {
    return J.PIXEL.EXT.ABS.Aliased.Game_Event.get('getCollisionPivotY').call(this);
  }

  // the feet live on the tile's bottom edge.
  return 1.0;
};

/**
 * Extends {@link Game_Event._pixelHitbox}.<br>
 * Builds the rectangular, feet-anchored hitbox for PIXEL movement checks.
 * @param {number} radius The incoming compatibility radius.
 * @returns {{w:number,h:number,hx:number,hy:number}}
 */
J.PIXEL.EXT.ABS.Aliased.Game_Event.set('_pixelHitbox', Game_Event.prototype._pixelHitbox);
Game_Event.prototype._pixelHitbox = function(radius)
{
  // if this event does not use the shared model, then perform original logic.
  if (this.hasCustomPixelHitbox() === false)
  {
    return J.PIXEL.EXT.ABS.Aliased.Game_Event.get('_pixelHitbox').call(this, radius);
  }

  // grab the canonical rectangle dimensions.
  const { widthTiles, heightTiles } = this.getPixelAbsHitboxSizeData();

  return {
    w: widthTiles,
    h: heightTiles,
    hx: -(widthTiles / 2),
    hy: -heightTiles,
  };
};
//endregion Game_Event

//region Game_Player
/**
 * Pivot guard is one input: movement lock in place, with guard layered when the offhand is guard-ready.
 * Pixel {@link #pixelMoveByInput} applies steps before JABS can reject them, so skip map motion while pivoting.
 */
J.PIXEL.EXT.ABS.Aliased.Game_Player.set('moveByInput', Game_Player.prototype.moveByInput);
Game_Player.prototype.moveByInput = function()
{
  const jabsPlayer = $jabsEngine && $jabsEngine.getPlayer1();
  const leaderCharacterMatches = jabsPlayer && jabsPlayer.getCharacter() === this;
  const pivotGuardBlocksMotion = leaderCharacterMatches
    && (jabsPlayer.canBattlerMove() === false || jabsPlayer.guarding());

  if (pivotGuardBlocksMotion)
  {
    $gameTemp.clearDestination();
    this.stopFollowersPixelMoving();
    this.setMovePressed(false);
    this.setMovementSuccess(false);

    let faceDir = 0;
    const vAngle = this.getVectorInputAngle();

    if (vAngle !== null)
    {
      faceDir = this.angleToNearestDirection(vAngle);
    }
    else
    {
      const d8 = Input.dir8;

      if (d8 > 0)
      {
        faceDir = this.angleToNearestDirection(this.dir8ToAngle(d8));
      }
    }

    if (faceDir > 0)
    {
      this.setDirection(faceDir);
      this.checkEventTriggerTouchFront(faceDir);
    }

    return;
  }

  J.PIXEL.EXT.ABS.Aliased.Game_Player.get('moveByInput')
    .call(this);
};

/**
 * Dash cannot reassert during pivot guard (pixel {@link #updateDashing} vs click-to-move).
 */
J.PIXEL.EXT.ABS.Aliased.Game_Player.set('updateDashing', Game_Player.prototype.updateDashing);
Game_Player.prototype.updateDashing = function()
{
  const jabsPlayer = $jabsEngine && $jabsEngine.getPlayer1();
  const leaderCharacterMatches = jabsPlayer && jabsPlayer.getCharacter() === this;
  const pivotGuardBlocksMotion = leaderCharacterMatches
    && (jabsPlayer.canBattlerMove() === false || jabsPlayer.guarding());

  if (pivotGuardBlocksMotion)
  {
    this._dashing = false;
    return;
  }

  J.PIXEL.EXT.ABS.Aliased.Game_Player.get('updateDashing')
    .call(this);
};
//endregion Game_Player

//region JABS_Battler
/**
 * Extends {@link #initIdleInfo}.<br/>
 * Adds pixel-movement-aware idle destination and wait timer state.
 */
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set('initIdleInfo', JABS_Battler.prototype.initIdleInfo);
JABS_Battler.prototype.initIdleInfo = function()
{
  // perform original logic.
  J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get('initIdleInfo').call(this);

  /**
   * The pixel-space destination this battler is currently wandering toward.
   * Null when the battler has no current wander target.
   * @type {{x: number, y: number}|null}
   */
  this._pixelIdleDest ??= null;

  /**
   * The number of frames remaining before this battler picks a new wander destination.
   * @type {number}
   */
  this._pixelIdleWait ??= 0;

  /**
   * The number of consecutive frames this battler has been unable to reach its
   * current wander destination. Used to detect and escape stuck states.
   * @type {number}
   */
  this._pixelIdleStuckFrames ??= 0;
};

/**
 * Overrides {@link #isHome}.<br/>
 * Uses a distance-based check instead of integer tile equality, since pixel
 * movement coordinates are fractional and exact equality is never satisfied.
 * @returns {boolean} True if within half a tile of home, false otherwise.
 */
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set('isHome', JABS_Battler.prototype.isHome);
JABS_Battler.prototype.isHome = function()
{
  return this.distanceToHome() < 0.5;
};

/**
 * The number of consecutive traveling frames allowed before a destination is
 * abandoned. At 60 fps this is 1.5 seconds, which is enough time to cross the
 * entire wander radius; if the battler hasn't arrived by then it is stuck.
 * @type {number}
 */
JABS_Battler.pixelIdleStuckLimit = 90;

/**
 * Executes the pixel-aware idle wander state machine for one game frame.
 *
 * States:
 *  - Waiting: decrement the wait timer; do not move.
 *  - Traveling: move toward the current destination; on arrival, transition to Waiting.
 *              Abandons the destination and enters Waiting if stuck for too long.
 *  - Choosing: no destination and no wait; roll a new destination or wait if none found.
 */
JABS_Battler.prototype.updatePixelIdleWander = function()
{
  // ensure properties are present (handles pre-plugin saves).
  this._pixelIdleDest ??= null;
  this._pixelIdleWait ??= 0;
  this._pixelIdleStuckFrames ??= 0;

  // waiting — tick down and hold position.
  if (this._pixelIdleWait > 0)
  {
    this._pixelIdleWait--;
    return;
  }

  // traveling — move toward the chosen destination.
  if (this._pixelIdleDest !== null)
  {
    const { x, y } = this._pixelIdleDest;

    // arrived when within a comfortable fraction of a tile.
    const arrived = Math.hypot(this.getX() - x, this.getY() - y) < 0.25;

    if (arrived === false)
    {
      // count consecutive frames spent trying to reach this destination.
      this._pixelIdleStuckFrames++;

      // if stuck too long, abandon the destination rather than twitching forever.
      if (this._pixelIdleStuckFrames >= JABS_Battler.pixelIdleStuckLimit)
      {
        this._pixelIdleDest = null;
        this._pixelIdleStuckFrames = 0;
        this._pixelIdleWait = this._rollIdleWaitDuration();
        return;
      }

      // keep moving toward the destination this frame.
      this.smartMoveTowardCoordinates(x, y);
      return;
    }

    // arrived — clear the destination and start the post-arrival wait.
    this._pixelIdleDest = null;
    this._pixelIdleStuckFrames = 0;
    this._pixelIdleWait = this._rollIdleWaitDuration();
    return;
  }

  // no destination and no wait — try to roll a valid wander point.
  const dest = this._rollIdleDestination();

  // if all candidates were impassable, wait a cycle before trying again.
  if (dest === null)
  {
    this._pixelIdleWait = this._rollIdleWaitDuration();
    return;
  }

  this._pixelIdleDest = dest;
  this._pixelIdleStuckFrames = 0;
};

/**
 * Rolls a random wait duration before this battler picks its next wander destination.
 * Returns a random multiple of 30 frames between 30 and 300 (one to ten seconds at 30 fps).
 * @returns {number} The number of frames to wait.
 */
JABS_Battler.prototype._rollIdleWaitDuration = function()
{
  // 4–10 inclusive, each unit = 30 frames; range is 2 to 5 seconds at 60 fps.
  const multiplier = Math.randomInt(7) + 4;

  return multiplier * 30;
};

/**
 * Rolls a random wander destination within the configured idle wander radius of home.
 * Retries up to five times to find a tile that is passable in at least one cardinal direction.
 * Returns null if every candidate lands on impassable terrain.
 * @returns {{x: number, y: number}|null} The chosen destination, or null if none found.
 */
JABS_Battler.prototype._rollIdleDestination = function()
{
  const homeX = this.getHomeX();
  const homeY = this.getHomeY();
  const range = J.PIXEL.EXT.ABS.Metadata.IdleWanderRadius;

  for (let attempt = 0; attempt < 5; attempt++)
  {
    // random offset along each axis within [-range, range].
    const dx = (Math.random() * range * 2) - range;
    const dy = (Math.random() * range * 2) - range;

    const destX = homeX + dx;
    const destY = homeY + dy;

    const tx = Math.round(destX);
    const ty = Math.round(destY);

    // accept the tile if it allows passage in any cardinal direction.
    const walkable = $gameMap.isPassable(tx, ty, 2)
      || $gameMap.isPassable(tx, ty, 4)
      || $gameMap.isPassable(tx, ty, 6)
      || $gameMap.isPassable(tx, ty, 8);

    if (walkable)
    {
      return { x: destX, y: destY };
    }
  }

  // all five candidates were impassable.
  return null;
};

/**
 * Extends {@link #setDodgeSteps}.<br/>
 * Scales the step count by the pixel collision density so dodge distance
 * covers the same visual distance as it would in tile-locked movement.
 * @param {number} stepCount The number of steps to dodge.
 */
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set('setDodgeSteps', JABS_Battler.prototype.setDodgeSteps);
JABS_Battler.prototype.setDodgeSteps = function(stepCount)
{
  // ensure the collision manager is configured before reading its step count.
  if (PIXEL_CollisionManager.collisionStepCount === undefined)
  {
    // initialize with defaults.
    PIXEL_CollisionManager.initConfig();
  }

  // scale step count by the subcell density so dodge covers the intended tile distance.
  const scaledStepCount = stepCount * PIXEL_CollisionManager.collisionStepCount;

  // perform original logic with the scaled step count.
  J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get('setDodgeSteps')
    .call(this, scaledStepCount);
};

/**
 * Extends {@link #destroy}.<br/>
 * Rebuilds the pixel collision table when an enemy battler is defeated,
 * in case the enemy event occupied passability cells that are now vacated.
 */
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set('destroy', JABS_Battler.prototype.destroy);
JABS_Battler.prototype.destroy = function()
{
  // record whether the battler being destroyed is an enemy (not an actor).
  const isEnemy = this.getBattler().isActor() === false;

  // perform original logic.
  J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get('destroy')
    .call(this);

  // if an enemy was destroyed, rebuild the collision table to free any blocked cells.
  if (isEnemy)
  {
    // rebuild the subcell collision table for the current map.
    PIXEL_CollisionManager.setupCollision();
  }
};

/**
 * Tries to move this battler away from its current target until leaving the "close" band.
 * Chooses the direction that maximizes separation next frame based on simulated steps.
 * Falls back to a passable direction if none increases separation to get unstuck.
 */
JABS_Battler.prototype.smartMoveAwayFromTarget = function()
{
  // Acquire the current target.
  const target = this.getTarget();

  // If there is no target, then do nothing.
  if (!target)
  {
    // No retreat needed with no target.
    return;
  }

  // forced dodge owns movement; pixel steering here stacks dodge speed and reads as free sprint.
  if (this.isDodging())
  {
    return;
  }

  if (this.guarding())
  {
    return;
  }

  // Acquire our character.
  const chr = this.getCharacter();

  // Compute vector (self - target) so we move away from target.
  const dx = chr.x - target.getX();
  const dy = chr.y - target.getY();

  // Compute current Euclidean distance in tiles (fractional coordinates).
  const currentDistance = Math.sqrt(dx * dx + dy * dy);

  // If we are not "close", then no need to step away this frame.
  if (JABS_Battler.isClose(currentDistance) === false)
  {
    // Spacing is safe or far; do nothing.
    return;
  }

  // Define a small hysteresis so we retreat until clearly outside the close band.
  const hysteresis = 0.25;

  // If we already passed closeBand + hysteresis, then stop retreating.
  if (currentDistance >= (JABS_Battler.closeDistance + hysteresis))
  {
    // We are outside the danger band far enough; stop retreating.
    return;
  }

  // If we have an active retreat micro-route and it remains passable, honor it.
  if (chr.isMicroRouting())
  {
    // Acquire the cached retreat direction.
    const cachedDirection = chr.getMicroRouteDirection();

    // Determine if the cached direction remains passable.
    let cachedPassable;

    // Check diagonal passability for diagonal directions.
    if (chr.isDiagonalDirection(cachedDirection))
    {
      // Check diagonal passability.
      cachedPassable = chr.canPassDiagonalByDirection(cachedDirection);
    }
    else
    {
      // Check straight passability.
      cachedPassable = chr.canPassStraight(cachedDirection);
    }

    // If still passable, apply it and decrement remaining frames.
    if (cachedPassable)
    {
      // Execute the step in the cached direction.
      chr.pixelMoveByInput(cachedDirection);

      // Reduce how many frames remain for this micro-route.
      chr.decrementMicroRouteFrames();

      // Continue following the cached direction this frame.
      return;
    }

    // If blocked, drop the micro-route immediately.
    chr.clearMicroRoute();
  }

  // Build a collection of candidate directions to consider for retreat.
  const directions = [
    J.ABS.Directions.LOWERLEFT,
    J.ABS.Directions.DOWN,
    J.ABS.Directions.LOWERRIGHT,
    J.ABS.Directions.LEFT,
    J.ABS.Directions.RIGHT,
    J.ABS.Directions.UPPERLEFT,
    J.ABS.Directions.UP,
    J.ABS.Directions.UPPERRIGHT,
  ];

  // Determine the straight and diagonal step distances for accurate simulation.
  const straightStep = chr.distancePerFrame();
  const diagonalStep = chr.diagonalDistancePerFrame();

  // Initialize a variable to track the best separating candidate.
  let bestDirection = 0;

  // Initialize the best separation found.
  let bestSeparation = currentDistance;

  // Define a small epsilon; new distance must exceed this to be considered an improvement.
  const epsilon = 0.01;

  // Iterate over all candidates to find the best separating direction.
  directions.forEach(dir =>
  {
    // Determine if this direction is diagonal.
    const isDiagonal = chr.isDiagonalDirection(dir);

    // Skip directions that are not passable.
    if (isDiagonal)
    {
      // If we cannot pass diagonally, skip.
      if (chr.canPassDiagonalByDirection(dir) === false) return;
    }
    else
    {
      // If we cannot pass straight, skip.
      if (chr.canPassStraight(dir) === false) return;
    }

    // Simulate the next position if we moved in this direction by the correct step distance.
    let simX = chr.x;
    let simY = chr.y;

    // Simulate displacement based on the direction.
    if (dir === J.ABS.Directions.LOWERLEFT)
    {
      // Down-left.
      simX -= diagonalStep;
      simY += diagonalStep;
    }
    else if (dir === J.ABS.Directions.LOWERRIGHT)
    {
      // Down-right.
      simX += diagonalStep;
      simY += diagonalStep;
    }
    else if (dir === J.ABS.Directions.UPPERLEFT)
    {
      // Up-left.
      simX -= diagonalStep;
      simY -= diagonalStep;
    }
    else if (dir === J.ABS.Directions.UPPERRIGHT)
    {
      // Up-right.
      simX += diagonalStep;
      simY -= diagonalStep;
    }
    else if (dir === J.ABS.Directions.DOWN)
    {
      // Down.
      simY += straightStep;
    }
    else if (dir === J.ABS.Directions.UP)
    {
      // Up.
      simY -= straightStep;
    }
    else if (dir === J.ABS.Directions.RIGHT)
    {
      // Right.
      simX += straightStep;
    }
    else if (dir === J.ABS.Directions.LEFT)
    {
      // Left.
      simX -= straightStep;
    }

    // Compute the simulated separation from target after this step.
    const sdx = simX - target.getX();
    const sdy = simY - target.getY();
    const simulatedDistance = Math.sqrt(sdx * sdx + sdy * sdy);

    // If the simulated distance meaningfully increases, consider it the new best.
    if ((simulatedDistance - bestSeparation) > epsilon)
    {
      // Track this candidate as best so far.
      bestSeparation = simulatedDistance;
      bestDirection = dir;
    }
  });

  // If no candidate increased separation, attempt to move in any passable direction to get unstuck.
  if (bestDirection === 0)
  {
    // First try diagonals to slide out of corners.
    const diagonalFallbacks = [
      J.ABS.Directions.LOWERLEFT,
      J.ABS.Directions.LOWERRIGHT,
      J.ABS.Directions.UPPERLEFT,
      J.ABS.Directions.UPPERRIGHT,
    ];
    let chosen = 0;
    diagonalFallbacks.forEach(dir =>
    {
      // If not yet chosen and passable diagonally, choose it.
      if (chosen === 0 && chr.canPassDiagonalByDirection(dir))
      {
        // Assign this diagonal as chosen.
        chosen = dir;
      }
    });

    // If no diagonal worked, try cardinals.
    if (chosen === 0)
    {
      const cardinalFallbacks = [
        J.ABS.Directions.LEFT,
        J.ABS.Directions.RIGHT,
        J.ABS.Directions.UP,
        J.ABS.Directions.DOWN,
      ];
      cardinalFallbacks.forEach(dir =>
      {
        // If not yet chosen and passable straight, choose it.
        if (chosen === 0 && chr.canPassStraight(dir))
        {
          // Assign this cardinal as chosen.
          chosen = dir;
        }
      });
    }

    // Assign the chosen fallback direction, if any.
    bestDirection = chosen;
  }

  // If still no direction available, wait a bit so neighbors can shuffle.
  if (bestDirection === 0)
  {
    // Apply a small wait to prevent tight-looping.
    this.setWaitCountdown(2);

    // Do not attempt to move this frame.
    return;
  }

  // Execute the pixel step away in the best direction.
  chr.pixelMoveByInput(bestDirection);

  // Seed a very short retreat micro-route to avoid per-frame dithering.
  // Use a slightly longer hold when we are very close.
  const taxi = Math.abs(dx) + Math.abs(dy);
  let frames = 1;

  // If we are extremely close, hold a couple of frames to create space.
  if (taxi < 1.25)
  {
    // Hold two frames when very close.
    frames = 2;
  }

  // Cache the micro-route direction and frame count for retreat.
  chr.setMicroRouteDirection(bestDirection);
  chr.setMicroRouteFrames(frames);
};

/**
 * Tries to move this battler toward a set of coordinates.
 * Chooses a direction based on angle, prefers diagonals, and holds that
 * direction for a few frames (a "micro-route") before re-deciding.
 * @param {number} targetX The x coordinate to reach.
 * @param {number} targetY The y coordinate to reach.
 */
JABS_Battler.prototype.smartMoveTowardCoordinates = function(targetX, targetY)
{
  // ally ai + formations issue this every frame; while dodging it fights executeDodgeMovement and stacks dodge speed.
  if (this.isDodging())
  {
    return;
  }

  if (this.guarding())
  {
    return;
  }

  // Acquire the character for this battler.
  const chr = this.getCharacter();

  // Compute vector from self to target.
  const deltaX = targetX - chr.x;
  const deltaY = targetY - chr.y;

  // If we have practically arrived (within small tolerance), do nothing.
  const arrived = Math.abs(deltaX) + Math.abs(deltaY) < 0.1;
  if (arrived)
  {
    // Do not force movement when already close enough.
    return;
  }

  // Continue an active micro-route if it remains passable; returns true if handled.
  const continueMicroRouteIfValid = () =>
  {
    // If there are no micro-route frames left, do nothing.
    if (chr.getMicroRouteFrames() <= 0) return false;

    // Acquire the cached direction.
    const cachedDir = chr.getMicroRouteDirection();

    // Determine if the cached direction remains passable.
    const cachedOk = chr.isDiagonalDirection(cachedDir)
      ? chr.canPassDiagonalByDirection(cachedDir)
      : chr.canPassStraight(cachedDir);

    // If not passable, clear the micro-route and fall through to choosing a new direction.
    if (cachedOk === false)
    {
      // Reset the micro-route.
      chr.clearMicroRoute();

      // Indicate we did not handle movement this frame.
      return false;
    }

    // Execute the step in the cached direction.
    chr.pixelMoveByInput(cachedDir);

    // Reduce how many frames remain for this micro-route.
    chr.decrementMicroRouteFrames();

    // Indicate we handled movement this frame.
    return true;
  };

  // If the micro-route handled movement, do not select a new direction.
  if (continueMicroRouteIfValid()) return;

  // Choose a direction based on the angle to the target.
  const angleDegrees = this.calculateAngle(targetX, targetY);

  // Convert angle to an 8-direction code.
  const primaryDirection = this.angleToDirection(angleDegrees);

  // Probe helpers for passability.
  const canGoStraight = (dir) => chr.canPassStraight(dir);
  const canGoDiagonal = (dir) => chr.canPassDiagonalByDirection(dir);

  // Prefer the primary direction from the angle if it is passable.
  const choosePrimaryIfPossible = () =>
  {
    // If the primary is diagonal and passable, choose it.
    if (chr.isDiagonalDirection(primaryDirection) && canGoDiagonal(primaryDirection))
    {
      // Return the chosen primary diagonal.
      return primaryDirection;
    }

    // If the primary is straight and passable, choose it.
    if (chr.isStraightDirection(primaryDirection) && canGoStraight(primaryDirection))
    {
      // Return the chosen primary cardinal.
      return primaryDirection;
    }

    // Could not choose the primary direction.
    return 0;
  };

  // Build one diagonal candidate pointing toward the target based on the vector.
  const buildDiagonalCandidate = () =>
  {
    // Determine coarse wants along axes.
    const wantLeft = deltaX < 0;
    const wantRight = deltaX > 0;
    const wantUp = deltaY < 0;
    const wantDown = deltaY > 0;

    // Down-left candidate.
    if (wantDown && wantLeft) return J.ABS.Directions.LOWERLEFT;

    // Down-right candidate.
    if (wantDown && wantRight) return J.ABS.Directions.LOWERRIGHT;

    // Up-left candidate.
    if (wantUp && wantLeft) return J.ABS.Directions.UPPERLEFT;

    // Up-right candidate.
    if (wantUp && wantRight) return J.ABS.Directions.UPPERRIGHT;

    // No diagonal intent.
    return 0;
  };

  // Builds an ordered list of cardinal candidates toward the target.
  const buildCardinalCandidates = () =>
  {
    // Determine coarse wants.
    const wantLeft = deltaX < 0;
    const wantRight = deltaX > 0;
    const wantUp = deltaY < 0;
    const wantDown = deltaY > 0;

    // Prefer the axis with larger magnitude first.
    const preferHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);

    // Create the ordered list.
    const candidates = [];

    // If horizontal contributes most, list horizontal first.
    if (preferHorizontal)
    {
      if (wantRight) candidates.push(J.ABS.Directions.RIGHT);
      if (wantLeft) candidates.push(J.ABS.Directions.LEFT);
      if (wantDown) candidates.push(J.ABS.Directions.DOWN);
      if (wantUp) candidates.push(J.ABS.Directions.UP);
    }
    else
    {
      // Otherwise, list vertical first.
      if (wantDown) candidates.push(J.ABS.Directions.DOWN);
      if (wantUp) candidates.push(J.ABS.Directions.UP);
      if (wantRight) candidates.push(J.ABS.Directions.RIGHT);
      if (wantLeft) candidates.push(J.ABS.Directions.LEFT);
    }

    // Return the ordered list of cardinals.
    return candidates;
  };

  // Attempts to pick a passable direction using the primary, then diagonal, then cardinals.
  const decideDirection = () =>
  {
    // Try the primary from the angle.
    const primary = choosePrimaryIfPossible();
    if (primary !== 0) return primary;

    // Try the single diagonal implied by the vector.
    const diagonalCandidate = buildDiagonalCandidate();
    if (diagonalCandidate !== 0 && canGoDiagonal(diagonalCandidate)) return diagonalCandidate;

    // Try cardinals in priority order.
    const cards = buildCardinalCandidates();
    let chosen = 0;
    cards.forEach(dir =>
    {
      // Choose the first passable cardinal.
      if (chosen === 0 && canGoStraight(dir)) chosen = dir;
    });

    // Return the chosen cardinal (or 0).
    return chosen;
  };

  // Direction decided so far (0 if none).
  let decidedDirection = decideDirection();

  // If no pixel-aware choice worked, fall back to tile A* as a hint.
  if (decidedDirection === 0)
  {
    // Acquire an A* direction based on tile centers.
    const aStarDir = chr.findDirectionTo(Math.round(targetX), Math.round(targetY));

    // If A* found something, adopt it.
    if (aStarDir > 0) decidedDirection = aStarDir;
  }

  // If we still do not have a direction, wait briefly and try again next frame.
  if (decidedDirection === 0)
  {
    // Small wait to let surrounding battlers shuffle; not a long stall.
    this.setWaitCountdown(2);

    // Do not attempt to move this frame.
    return;
  }

  // Execute the step toward the target.
  chr.pixelMoveByInput(decidedDirection);

  // Seed a short micro-route to reduce dithering; scale by taxi distance.
  const taxiDistance = Math.abs(deltaX) + Math.abs(deltaY);
  let framesToHold = 1;
  if (taxiDistance > 3)
  {
    // Hold a bit longer when far away.
    framesToHold = 16;
  }
  else if (taxiDistance > 1.5)
  {
    // Hold a short time when moderately far.
    framesToHold = 8;
  }

  // Cache the micro-route direction and frame count.
  chr.setMicroRouteDirection(decidedDirection);
  chr.setMicroRouteFrames(framesToHold);
};

/**
 * Calculates the angle to the target coordinates.
 * @param {number} targetX The targetX coordinate of the target point.
 * @param {number} targetY The targetY coordinate of the target point.
 * @returns {number} The angle in degrees.
 */
JABS_Battler.prototype.calculateAngle = function(targetX, targetY)
{
  // Acquire start coordinates.
  const selfX = this.getX();
  const selfY = this.getY();

  // Compute deltas from self to target (target - self).
  const dx = targetX - selfX;
  const dy = targetY - selfY;

  // Convert to degrees using atan2 and return the angle.
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  // Return the computed angle in degrees.
  return angle;
};

/**
 * Calculates the 8-directional direction based on the angle.
 * RMMZ map coords are Y-down, so:
 *  0°  = RIGHT(6)
 * +90° = DOWN(2)
 * ±180°= LEFT(4)
 * -90° = UP(8)
 * Sectors are 45° wide with boundaries at ±22.5°, ±67.5°, ±112.5°, ±157.5°.
 *
 * {@link Game_Player.prototype.dir8ToAngle} uses 0..360 (UP=270°), while analog sticks use atan2
 * in [-180,180] (UP=-90°). Normalize first so keyboard north never lands in the LEFT bucket.
 *
 * @param {number} angle The angle in degrees (atan2 or dir8ToAngle).
 * @returns {1|2|3|4|6|7|8|9}
 */
JABS_Battler.prototype.angleToDirection = function(angle)
{
  // Fold into (-180, 180] so sector math matches both angle producers.
  let a = angle;

  if (a > 180)
  {
    a -= 360;
  }
  else if (a <= -180)
  {
    a += 360;
  }

  // Define half-sector width (45° / 2).
  const half = 22.5;

  // RIGHT: -22.5 .. 22.5
  // 6.
  const isRight = a > -half && a <= half;

  // DOWN-RIGHT: 22.5 .. 67.5
  // 3.
  const isDownRight = a > half && a <= (half + 45);

  // DOWN: 67.5 .. 112.5
  // 2.
  const isDown = a > (half + 45) && a <= (half + 90);

  // DOWN-LEFT: 112.5 .. 157.5
  // 1.
  const isDownLeft = a > (half + 90) && a <= (half + 135);

  // LEFT: >157.5 or <= -157.5
  // 4.
  const isLeft = a > (half + 135) || a <= -(half + 135);

  // UP-LEFT: -157.5 .. -112.5
  // 7.
  const isUpLeft = a > -(half + 135) && a <= -(half + 90);

  // UP: -112.5 .. -67.5
  // 8.
  const isUp = a > -(half + 90) && a <= -(half + 45);

  // UP-RIGHT: -67.5 .. -22.5
  // 9.
  const isUpRight = a > -(half + 45) && a <= -half;

  // Map the sector to the direction numbers.
  if (isRight)
  {
    // 6.
    return J.ABS.Directions.RIGHT;
  }
  else if (isDownRight)
  {
    // 3.
    return J.ABS.Directions.LOWERRIGHT;
  }
  else if (isDown)
  {
    // 2.
    return J.ABS.Directions.DOWN;
  }
  else if (isDownLeft)
  {
    // 1.
    return J.ABS.Directions.LOWERLEFT;
  }
  else if (isLeft)
  {
    // 4.
    return J.ABS.Directions.LEFT;
  }
  else if (isUpLeft)
  {
    // 7.
    return J.ABS.Directions.UPPERLEFT;
  }
  else if (isUp)
  {
    // 8.
    return J.ABS.Directions.UP;
  }
  else if (isUpRight)
  {
    // 9.
    return J.ABS.Directions.UPPERRIGHT;
  }

  // Unknown sector; return 0.
  return 0;
};

/**
 * Extends {@link JABS_Battler#getProjectileSpawnBaseDirection}.<br/>
 * Uses analog / keyboard vector input for the party leader so projectile spokes
 * match actual travel intent: {@link Game_CharacterBase#vectorMoveByAngle} keeps
 * {@link Game_Character#direction} cardinal for 4-dir sprites, which would
 * otherwise mis-aim line and formation projectiles.
 * When {@link Game_CharacterBase#isDirectionFixed} is true (JABS strafe / hold facing),
 * movement can disagree with sprite facing — fall back to map facing so shots do not
 * emit opposite the way the character is drawn.
 */
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set(
  'getProjectileSpawnBaseDirection',
  JABS_Battler.prototype.getProjectileSpawnBaseDirection,
);
JABS_Battler.prototype.getProjectileSpawnBaseDirection = function()
{
  const chr = this.getCharacter();

  // party leader: prefer the true bearing while vector movement is active.
  if (chr === $gamePlayer && typeof chr.getVectorInputAngle === 'function')
  {
    // strafe locks facing via direction fix — vector aim would track movement and look like backward fire.
    if (typeof chr.isDirectionFixed === 'function' && chr.isDirectionFixed())
    {
      return J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get('getProjectileSpawnBaseDirection').call(this);
    }

    const vectorAngle = chr.getVectorInputAngle();

    if (vectorAngle !== null)
    {
      return this.angleToDirection(vectorAngle);
    }
  }

  return J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get('getProjectileSpawnBaseDirection').call(this);
};
//endregion JABS_Battler

//region Spriteset_Map
/**
 * Extends {@link #createLowerLayer}.<br>
 * Also creates the PIXEL-ABS hitbox reveal outline layer.
 */
J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.set('createLowerLayer', Spriteset_Map.prototype.createLowerLayer);
Spriteset_Map.prototype.createLowerLayer = function()
{
  // perform original logic.
  J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.get('createLowerLayer').call(this);

  // also create the PIXEL-ABS reveal outline layer.
  this.createPixelAbsHitboxRevealLayer();
};

/**
 * Extends {@link #updateJabsSprites}.<br>
 * Also updates the PIXEL-ABS reveal outline overlays.
 */
J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.set('updateJabsSprites', Spriteset_Map.prototype.updateJabsSprites);
Spriteset_Map.prototype.updateJabsSprites = function()
{
  // perform original logic.
  J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.get('updateJabsSprites').call(this);

  // also update the PIXEL-ABS reveal outlines.
  this.handlePixelAbsHitboxRevealOutlines();
};

/**
 * Creates the layer and sprite dictionary for PIXEL-ABS reveal hitboxes.
 */
Spriteset_Map.prototype.createPixelAbsHitboxRevealLayer = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with PIXEL.
   */
  this._j._pixel ||= {};

  /**
   * A grouping of all properties associated with PIXEL-ABS.
   */
  this._j._pixel._abs ||= {};

  /**
   * The container for battler hitbox reveal outlines.
   * @type {Sprite}
   */
  this._j._pixel._abs._hitboxRevealLayer = new Sprite();

  /**
   * Direct tracking for reveal sprites by their stable key.
   * @type {Record<string, Sprite>}
   */
  this._j._pixel._abs._hitboxRevealSprites = {};

  // mount beside the existing battler overlay layers.
  this.addChild(this._j._pixel._abs._hitboxRevealLayer);
};

/**
 * Gets the PIXEL-ABS reveal outline layer.
 * @returns {Sprite}
 */
Spriteset_Map.prototype.getPixelAbsHitboxRevealLayer = function()
{
  return this._j._pixel._abs._hitboxRevealLayer;
};

/**
 * Gets the PIXEL-ABS reveal outline sprite dictionary.
 * @returns {Record<string, Sprite>}
 */
Spriteset_Map.prototype.getPixelAbsHitboxRevealSprites = function()
{
  return this._j._pixel._abs._hitboxRevealSprites;
};

/**
 * Updates the proximity-based hitbox reveal outlines for eligible battlers.
 */
Spriteset_Map.prototype.handlePixelAbsHitboxRevealOutlines = function()
{
  // if the full debug overlay is already visible, then skip these softer outlines.
  if ($jabsEngine.hitboxOverlaysVisible)
  {
    this.getPixelAbsHitboxRevealLayer().visible = false;
    this.purgePixelAbsHitboxRevealSprites([]);
    return;
  }

  // collect all battlers that should reveal their hitboxes right now.
  const items = this.collectPixelAbsHitboxRevealItems();

  // show the layer only while we have something to draw.
  const layer = this.getPixelAbsHitboxRevealLayer();
  layer.visible = items.length > 0;

  // if nothing is visible, then purge stale sprites and stop here.
  if (layer.visible === false)
  {
    this.purgePixelAbsHitboxRevealSprites(items);
    return;
  }

  // build, refresh, and purge the reveal sprites for this frame.
  this.buildMissingPixelAbsHitboxRevealSprites(items);
  this.refreshExistingPixelAbsHitboxRevealSprites(items);
  this.purgePixelAbsHitboxRevealSprites(items);
};

/**
 * Collects the battlers whose hitbox outlines should currently be revealed.
 * @returns {{ key:string, type:'battler', source: Game_Event }[]}
 */
Spriteset_Map.prototype.collectPixelAbsHitboxRevealItems = function()
{
  return this.collectActiveBattlerOverlayItems()
    .filter(item => item.type === 'battler')
    .filter(item => item.source.canShowPixelAbsHitboxReveal())
    .map(item =>
    {
      return {
        key: `pixel-reveal:${item.key}`,
        type: 'battler',
        source: item.source,
      };
    });
};

/**
 * Builds reveal sprites for any battlers that currently need one.
 * @param {{ key:string, type:'battler', source: Game_Event }[]} items The reveal items.
 */
Spriteset_Map.prototype.buildMissingPixelAbsHitboxRevealSprites = function(items)
{
  // get the container and dict for reveal sprites.
  const layer = this.getPixelAbsHitboxRevealLayer();
  const dict = this.getPixelAbsHitboxRevealSprites();

  // create any missing reveal sprites.
  items.forEach(item =>
  {
    // skip if the sprite already exists for this battler.
    if (dict[item.key]) return;

    // create, mark, and track the reveal sprite.
    const sprite = this.createBattlerHitboxSprite(item);
    sprite._pixelAbsRevealOutline = true;
    dict[item.key] = sprite;
    layer.addChild(sprite);
  });
};

/**
 * Refreshes the active reveal sprites for this frame.
 * @param {{ key:string, type:'battler', source: Game_Event }[]} items The reveal items.
 */
Spriteset_Map.prototype.refreshExistingPixelAbsHitboxRevealSprites = function(items)
{
  // quick access to tile size for the shared draw function.
  const tw = $gameMap.tileWidth();
  const th = $gameMap.tileHeight();

  // refresh each active reveal sprite.
  items.forEach(item =>
  {
    // locate or create the sprite for this battler.
    const sprite = this.getOrCreatePixelAbsHitboxRevealSprite(item);

    // place the sprite at the battler's feet.
    sprite.x = item.source.screenX();
    sprite.y = item.source.screenY();

    // compute the battler AABB from the shared runtime model.
    const aabb = JABS_Engine.getBattlerAabbModel(item.source);

    // draw the reveal outline using the shared battler hitbox function.
    this.drawBattlerHitboxInto(sprite, item.type, tw, th, false, aabb);
  });
};

/**
 * Retrieves or creates the reveal sprite for a given battler.
 * @param {{ key:string, type:'battler', source: Game_Event }} item The reveal item.
 * @returns {Sprite}
 */
Spriteset_Map.prototype.getOrCreatePixelAbsHitboxRevealSprite = function(item)
{
  // return the existing reveal sprite if it already exists.
  const dict = this.getPixelAbsHitboxRevealSprites();
  if (dict[item.key]) return dict[item.key];

  // otherwise, create and mount a new reveal sprite.
  const sprite = this.createBattlerHitboxSprite(item);
  sprite._pixelAbsRevealOutline = true;
  dict[item.key] = sprite;
  this.getPixelAbsHitboxRevealLayer().addChild(sprite);
  return sprite;
};

/**
 * Removes reveal sprites that no longer correspond to an active battler.
 * @param {{ key:string }[]} items The active reveal items.
 */
Spriteset_Map.prototype.purgePixelAbsHitboxRevealSprites = function(items)
{
  // compute the set of active reveal keys now.
  const active = new Set(items.map(item => item.key));

  // walk the dict and remove any reveal sprites whose keys are no longer active.
  const dict = this.getPixelAbsHitboxRevealSprites();
  const layer = this.getPixelAbsHitboxRevealLayer();

  Object.keys(dict)
    .forEach(key =>
    {
      if (active.has(key)) return;

      // detach and destroy the orphaned reveal sprite.
      const sprite = dict[key];
      if (sprite && sprite.parent === layer)
      {
        layer.removeChild(sprite);
      }

      this.destroyBattlerHitboxSprite(sprite);
      delete dict[key];
    });
};

/**
 * Extends {@link #drawBattlerHitboxInto}.<br>
 * Draws a softer outline-only style for PIXEL-ABS reveal sprites.
 * @param {Sprite} sprite The target battler hitbox sprite.
 * @param {'player'|'follower'|'battler'} type The kind of battler.
 * @param {number} tw Tile width in pixels.
 * @param {number} th Tile height in pixels.
 * @param {boolean} colliding Whether the battler overlaps any active action.
 * @param {JABS_Aabb} aabb The model rect for this battler in screen pixels.
 */
J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.set('drawBattlerHitboxInto', Spriteset_Map.prototype.drawBattlerHitboxInto);
Spriteset_Map.prototype.drawBattlerHitboxInto = function(sprite, type, tw, th, colliding, aabb)
{
  // if this is not a reveal sprite, then perform original logic.
  if (sprite._pixelAbsRevealOutline !== true)
  {
    J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.get('drawBattlerHitboxInto').call(
      this,
      sprite,
      type,
      tw,
      th,
      colliding,
      aabb);
    return;
  }

  // draw the softer reveal outline instead.
  this.drawPixelAbsRevealHitboxInto(sprite, aabb);
};

/**
 * Draws the softer PIXEL-ABS reveal outline into the battler hitbox sprite.
 * @param {Sprite} sprite The target reveal sprite.
 * @param {JABS_Aabb} aabb The model rect for this battler in screen pixels.
 */
Spriteset_Map.prototype.drawPixelAbsRevealHitboxInto = function(sprite, aabb)
{
  // get the graphics used to draw.
  /** @type {PIXI.Graphics} */
  const g = sprite._jabsHitboxG;

  // clear previous drawings for this frame.
  g.clear();

  // apply the softer outline style.
  const style = this.getPixelAbsRevealHitboxStyle();
  this.applyHitboxStyle(g, style);

  // compute local offsets relative to the battler feet.
  const localX = aabb.x - sprite.x;
  const localY = aabb.y - sprite.y;

  // draw the model rect exactly so visuals match physics.
  g.drawRect(localX, localY, aabb.w, aabb.h);
  g.endFill();
};

/**
 * Gets the style used for PIXEL-ABS hitbox reveal outlines.
 * @returns {{ fillColor:number, fillAlpha:number, lineColor:number, lineAlpha:number, lineWidth:number }}
 */
Spriteset_Map.prototype.getPixelAbsRevealHitboxStyle = function()
{
  // mirror the pulse highlight's soft white styling, but without any fill.
  const pulseStyle = J.ABS.Metadata.HitboxPulse;

  return {
    fillColor: pulseStyle.fillColor,
    fillAlpha: 0.0,
    lineColor: pulseStyle.lineColor,
    lineAlpha: 0.35,
    lineWidth: pulseStyle.lineWidth,
  };
};
//endregion Spriteset_Map

//# sourceMappingURL=J-Pixel-ABS.js.map
